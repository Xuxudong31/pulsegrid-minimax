import { createHash, randomUUID } from "node:crypto";
import pg from "pg";

const { Pool } = pg;
const ID_RE = /^[a-zA-Z0-9_-]{1,100}$/;
const CODE_SOURCES = new Set(["manual", "paste", "ai", "save", "run", "import", "clear", "mixer", "pre_ai"]);
const MAX_CODE_LENGTH = 40_000;
const MAX_PROMPT_LENGTH = 1_200;

function cleanText(value, maxLength = 240) {
  return String(value || "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, maxLength);
}

function cleanId(value, fallback = "") {
  const id = cleanText(value, 100);
  return ID_RE.test(id) ? id : fallback;
}

function redactSecrets(value) {
  return String(value || "")
    .replace(/\b(sk-[a-zA-Z0-9_-]{12,})\b/g, "[已隐藏密钥]")
    .replace(/((?:api[_-]?key|authorization|bearer|token|secret)\s*[:=]\s*["']?)[^\s"']{8,}/gi, "$1[已隐藏密钥]");
}

function cleanCode(value) {
  return redactSecrets(String(value || "")).slice(0, MAX_CODE_LENGTH);
}

function codeHash(code) {
  return createHash("sha256").update(code).digest("hex");
}

function safeJson(value, fallback = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  try { return JSON.parse(JSON.stringify(value)); }
  catch (_) { return fallback; }
}

function normalizeCodeRecord(value = {}) {
  const code = cleanCode(value.code);
  return {
    id: randomUUID(),
    visitorId: cleanId(value.visitorId),
    sessionId: cleanId(value.sessionId, "session-unknown"),
    projectId: cleanId(value.projectId, "project-unknown"),
    projectName: cleanText(value.projectName, 80),
    source: CODE_SOURCES.has(value.source) ? value.source : "manual",
    code,
    codeHash: codeHash(code),
    prompt: cleanText(value.prompt, MAX_PROMPT_LENGTH),
    success: value.success !== false,
    error: cleanText(value.error, 500),
    metadata: safeJson(value.metadata),
    createdAt: new Date(),
  };
}

function normalizeInteraction(value = {}) {
  return {
    id: cleanId(value.id, randomUUID()),
    visitorId: cleanId(value.visitorId),
    sessionId: cleanId(value.sessionId, "session-unknown"),
    projectId: cleanId(value.projectId, "project-unknown"),
    prompt: cleanText(value.prompt, MAX_PROMPT_LENGTH),
    reply: cleanText(value.reply, 600),
    intent: cleanText(value.intent, 48),
    model: cleanText(value.model, 80),
    plan: safeJson(value.plan),
    codeHash: cleanText(value.codeHash, 64),
    success: value.success !== false,
    error: cleanText(value.error, 500),
    feedbackScore: 0,
    createdAt: new Date(),
  };
}

function normalizeRating(value) {
  const rating = Number(value);
  return rating > 0 ? 1 : rating < 0 ? -1 : 0;
}

function lessonFromInteraction(interaction, rating) {
  const plan = safeJson(interaction?.plan);
  const style = cleanText(plan.style, 32) || "当前风格";
  const bpm = Number(plan.bpm);
  const key = cleanText(plan.key, 32);
  const instruments = Array.isArray(plan.instrumentTracks)
    ? plan.instrumentTracks.map((track) => cleanText(track?.label || track?.instrument, 24)).filter(Boolean).slice(0, 6)
    : [];
  const features = [style, Number.isFinite(bpm) ? `${Math.round(bpm)} BPM` : "", key, instruments.join("、")].filter(Boolean).join(" · ");
  return {
    key: `${rating > 0 ? "like" : "avoid"}:${style}:${instruments.join("-") || "base"}`.slice(0, 120),
    text: rating > 0
      ? `这位用户喜欢 ${features} 的编曲方向，可以在相近请求中延续。`
      : `这位用户不喜欢 ${features} 的这次处理；下次应改变节奏、音色或配器，而不是重复。`,
    weight: rating > 0 ? 1 : -1,
  };
}

function summarizeContext({ interactions = [], versions = [], lessons = [], globalStyles = [] } = {}) {
  return {
    recentTurns: interactions.slice(0, 8).map((item) => ({
      prompt: item.prompt,
      reply: item.reply,
      intent: item.intent,
      success: item.success,
      feedback: Number(item.feedbackScore || 0),
    })),
    recentCodes: versions.slice(0, 3).map((item) => ({
      source: item.source,
      prompt: item.prompt,
      success: item.success,
      code: String(item.code || "").slice(0, 8_000),
    })),
    userLessons: lessons.slice(0, 8).map((item) => item.lessonText || item.lesson_text || item.text).filter(Boolean),
    globalPreferences: globalStyles.slice(0, 5).map((item) => ({
      style: item.style,
      positive: Number(item.positive || 0),
      total: Number(item.total || 0),
    })),
  };
}

class MemoryAgentStore {
  constructor() {
    this.kind = "memory";
    this.versions = [];
    this.interactions = [];
    this.feedback = [];
    this.lessons = [];
  }

  async ready() {}

  async recordCode(record) {
    this.versions.push(record);
    if (this.versions.length > 5_000) this.versions.splice(0, this.versions.length - 5_000);
    return { id: record.id, codeHash: record.codeHash };
  }

  async recordInteraction(record) {
    this.interactions.push(record);
    if (this.interactions.length > 2_000) this.interactions.splice(0, this.interactions.length - 2_000);
    return record.id;
  }

  async recordOutcome({ interactionId, visitorId, success, error }) {
    const interaction = this.interactions.find((item) => item.id === interactionId && item.visitorId === visitorId);
    if (!interaction) return false;
    interaction.success = success;
    interaction.error = error;
    return true;
  }

  async recordFeedback({ interactionId, visitorId, rating, comment }) {
    const interaction = this.interactions.find((item) => item.id === interactionId && item.visitorId === visitorId);
    if (!interaction) return null;
    interaction.feedbackScore = rating;
    this.feedback.push({ id: randomUUID(), interactionId, visitorId, rating, comment, createdAt: new Date() });
    const lesson = lessonFromInteraction(interaction, rating);
    const existing = this.lessons.find((item) => item.visitorId === visitorId && item.lessonKey === lesson.key);
    if (existing) {
      existing.lessonText = lesson.text;
      existing.weight += lesson.weight;
      existing.evidenceCount += 1;
      existing.updatedAt = new Date();
    } else {
      this.lessons.push({ visitorId, lessonKey: lesson.key, lessonText: lesson.text, weight: lesson.weight, evidenceCount: 1, updatedAt: new Date() });
    }
    return interaction;
  }

  async getContext({ visitorId, projectId }) {
    const interactions = this.interactions
      .filter((item) => item.visitorId === visitorId)
      .sort((left, right) => Number(right.projectId === projectId) - Number(left.projectId === projectId) || right.createdAt - left.createdAt);
    const versions = this.versions
      .filter((item) => item.visitorId === visitorId && item.projectId === projectId)
      .sort((left, right) => right.createdAt - left.createdAt);
    const lessons = this.lessons
      .filter((item) => item.visitorId === visitorId)
      .sort((left, right) => Math.abs(right.weight) - Math.abs(left.weight) || right.updatedAt - left.updatedAt);
    const styleStats = new Map();
    this.interactions.forEach((item) => {
      const style = cleanText(item.plan?.style, 32);
      if (!style || !item.feedbackScore) return;
      const state = styleStats.get(style) || { style, positive: 0, total: 0 };
      state.total += 1;
      if (item.feedbackScore > 0) state.positive += 1;
      styleStats.set(style, state);
    });
    const globalStyles = [...styleStats.values()].sort((a, b) => b.positive - a.positive || b.total - a.total);
    return summarizeContext({ interactions, versions, lessons, globalStyles });
  }

  async getAdminStats() {
    const sourceCounts = new Map();
    this.versions.forEach((item) => sourceCounts.set(item.source, (sourceCounts.get(item.source) || 0) + 1));
    return {
      storage: this.kind,
      totals: {
        codeVersions: this.versions.length,
        interactions: this.interactions.length,
        positiveFeedback: this.feedback.filter((item) => item.rating > 0).length,
        learnedLessons: this.lessons.length,
      },
      codeSources: [...sourceCounts.entries()].map(([source, count]) => ({ source, count })),
      recentInteractions: this.interactions.slice(-12).reverse().map((item) => ({
        prompt: item.prompt,
        intent: item.intent,
        model: item.model,
        success: item.success,
        feedback: item.feedbackScore,
        at: item.createdAt.toISOString(),
      })),
    };
  }
}

class PostgresAgentStore {
  constructor({ databaseUrl }) {
    this.kind = "postgres";
    this.pool = new Pool({ connectionString: databaseUrl, max: 3, idleTimeoutMillis: 30_000 });
    this.schemaPromise = null;
  }

  ready() {
    if (!this.schemaPromise) {
      this.schemaPromise = this.pool.query(`
        CREATE TABLE IF NOT EXISTS agent_code_versions (
          id UUID PRIMARY KEY,
          visitor_id VARCHAR(100) NOT NULL,
          session_id VARCHAR(100) NOT NULL,
          project_id VARCHAR(100) NOT NULL,
          project_name VARCHAR(80) NOT NULL DEFAULT '',
          source VARCHAR(24) NOT NULL,
          code TEXT NOT NULL,
          code_hash CHAR(64) NOT NULL,
          prompt TEXT NOT NULL DEFAULT '',
          success BOOLEAN NOT NULL DEFAULT TRUE,
          error_text VARCHAR(500) NOT NULL DEFAULT '',
          metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS agent_interactions (
          id UUID PRIMARY KEY,
          visitor_id VARCHAR(100) NOT NULL,
          session_id VARCHAR(100) NOT NULL,
          project_id VARCHAR(100) NOT NULL,
          prompt TEXT NOT NULL,
          reply VARCHAR(600) NOT NULL DEFAULT '',
          intent VARCHAR(48) NOT NULL DEFAULT '',
          model VARCHAR(80) NOT NULL DEFAULT '',
          plan JSONB NOT NULL DEFAULT '{}'::jsonb,
          code_hash CHAR(64) NOT NULL DEFAULT '',
          success BOOLEAN NOT NULL DEFAULT TRUE,
          error_text VARCHAR(500) NOT NULL DEFAULT '',
          feedback_score SMALLINT NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS agent_feedback (
          id UUID PRIMARY KEY,
          interaction_id UUID NOT NULL REFERENCES agent_interactions(id) ON DELETE CASCADE,
          visitor_id VARCHAR(100) NOT NULL,
          rating SMALLINT NOT NULL,
          comment VARCHAR(500) NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS agent_lessons (
          visitor_id VARCHAR(100) NOT NULL,
          lesson_key VARCHAR(120) NOT NULL,
          lesson_text VARCHAR(600) NOT NULL,
          weight INTEGER NOT NULL DEFAULT 0,
          evidence_count INTEGER NOT NULL DEFAULT 1,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (visitor_id, lesson_key)
        );
        CREATE INDEX IF NOT EXISTS agent_versions_visitor_project_idx ON agent_code_versions (visitor_id, project_id, created_at DESC);
        CREATE INDEX IF NOT EXISTS agent_versions_hash_idx ON agent_code_versions (code_hash);
        CREATE INDEX IF NOT EXISTS agent_interactions_visitor_project_idx ON agent_interactions (visitor_id, project_id, created_at DESC);
        CREATE INDEX IF NOT EXISTS agent_interactions_created_idx ON agent_interactions (created_at DESC);
        CREATE INDEX IF NOT EXISTS agent_feedback_created_idx ON agent_feedback (created_at DESC);
      `).catch((error) => {
        this.schemaPromise = null;
        throw error;
      });
    }
    return this.schemaPromise;
  }

  async recordCode(record) {
    await this.ready();
    await this.pool.query(`
      INSERT INTO agent_code_versions
        (id, visitor_id, session_id, project_id, project_name, source, code, code_hash, prompt, success, error_text, metadata)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb)
    `, [record.id, record.visitorId, record.sessionId, record.projectId, record.projectName, record.source,
      record.code, record.codeHash, record.prompt, record.success, record.error, JSON.stringify(record.metadata)]);
    return { id: record.id, codeHash: record.codeHash };
  }

  async recordInteraction(record) {
    await this.ready();
    await this.pool.query(`
      INSERT INTO agent_interactions
        (id, visitor_id, session_id, project_id, prompt, reply, intent, model, plan, code_hash, success, error_text)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12)
    `, [record.id, record.visitorId, record.sessionId, record.projectId, record.prompt, record.reply,
      record.intent, record.model, JSON.stringify(record.plan), record.codeHash, record.success, record.error]);
    return record.id;
  }

  async recordOutcome({ interactionId, visitorId, success, error }) {
    await this.ready();
    const result = await this.pool.query(`
      UPDATE agent_interactions SET success = $2, error_text = $3 WHERE id = $1 AND visitor_id = $4
    `, [interactionId, success, error, visitorId]);
    return result.rowCount > 0;
  }

  async recordFeedback({ interactionId, visitorId, rating, comment }) {
    await this.ready();
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const updated = await client.query(`
        UPDATE agent_interactions SET feedback_score = $3
        WHERE id = $1 AND visitor_id = $2
        RETURNING *
      `, [interactionId, visitorId, rating]);
      const interaction = updated.rows[0];
      if (!interaction) {
        await client.query("ROLLBACK");
        return null;
      }
      await client.query(`
        INSERT INTO agent_feedback (id, interaction_id, visitor_id, rating, comment)
        VALUES ($1,$2,$3,$4,$5)
      `, [randomUUID(), interactionId, visitorId, rating, comment]);
      const lesson = lessonFromInteraction({ plan: interaction.plan }, rating);
      await client.query(`
        INSERT INTO agent_lessons (visitor_id, lesson_key, lesson_text, weight, evidence_count, updated_at)
        VALUES ($1,$2,$3,$4,1,NOW())
        ON CONFLICT (visitor_id, lesson_key) DO UPDATE SET
          lesson_text = EXCLUDED.lesson_text,
          weight = agent_lessons.weight + EXCLUDED.weight,
          evidence_count = agent_lessons.evidence_count + 1,
          updated_at = NOW()
      `, [visitorId, lesson.key, lesson.text, lesson.weight]);
      await client.query("COMMIT");
      return interaction;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async getContext({ visitorId, projectId }) {
    await this.ready();
    const [interactionResult, versionResult, lessonResult, styleResult] = await Promise.all([
      this.pool.query(`
        SELECT prompt, reply, intent, success, feedback_score, created_at
        FROM agent_interactions WHERE visitor_id = $1
        ORDER BY (project_id = $2) DESC, created_at DESC LIMIT 12
      `, [visitorId, projectId]),
      this.pool.query(`
        SELECT source, prompt, success, code, created_at
        FROM agent_code_versions WHERE visitor_id = $1 AND project_id = $2
        ORDER BY created_at DESC LIMIT 6
      `, [visitorId, projectId]),
      this.pool.query(`
        SELECT lesson_text, weight, evidence_count, updated_at
        FROM agent_lessons WHERE visitor_id = $1
        ORDER BY ABS(weight) DESC, evidence_count DESC, updated_at DESC LIMIT 8
      `, [visitorId]),
      this.pool.query(`
        SELECT plan->>'style' AS style,
          COUNT(*) FILTER (WHERE feedback_score > 0) AS positive,
          COUNT(*) AS total
        FROM agent_interactions
        WHERE feedback_score <> 0 AND COALESCE(plan->>'style', '') <> ''
        GROUP BY plan->>'style'
        ORDER BY positive DESC, total DESC LIMIT 5
      `),
    ]);
    return summarizeContext({
      interactions: interactionResult.rows.map((row) => ({ ...row, feedbackScore: row.feedback_score })),
      versions: versionResult.rows,
      lessons: lessonResult.rows,
      globalStyles: styleResult.rows,
    });
  }

  async getAdminStats() {
    await this.ready();
    const [totalsResult, sourceResult, recentResult] = await Promise.all([
      this.pool.query(`
        SELECT
          (SELECT COUNT(*) FROM agent_code_versions) AS code_versions,
          (SELECT COUNT(*) FROM agent_interactions) AS interactions,
          (SELECT COUNT(*) FROM agent_feedback WHERE rating > 0) AS positive_feedback,
          (SELECT COUNT(*) FROM agent_lessons) AS learned_lessons
      `),
      this.pool.query(`SELECT source, COUNT(*) AS count FROM agent_code_versions GROUP BY source ORDER BY count DESC`),
      this.pool.query(`
        SELECT prompt, intent, model, success, feedback_score, created_at
        FROM agent_interactions ORDER BY created_at DESC LIMIT 12
      `),
    ]);
    const row = totalsResult.rows[0] || {};
    return {
      storage: this.kind,
      totals: {
        codeVersions: Number(row.code_versions || 0),
        interactions: Number(row.interactions || 0),
        positiveFeedback: Number(row.positive_feedback || 0),
        learnedLessons: Number(row.learned_lessons || 0),
      },
      codeSources: sourceResult.rows.map((item) => ({ source: item.source, count: Number(item.count || 0) })),
      recentInteractions: recentResult.rows.map((item) => ({
        prompt: item.prompt,
        intent: item.intent,
        model: item.model,
        success: item.success,
        feedback: Number(item.feedback_score || 0),
        at: new Date(item.created_at).toISOString(),
      })),
    };
  }

  async close() {
    await this.pool.end();
  }
}

export function createAgentMemoryService(options = {}) {
  const databaseUrl = options.databaseUrl ?? process.env.DATABASE_URL ?? "";
  const store = databaseUrl ? new PostgresAgentStore({ databaseUrl }) : new MemoryAgentStore();
  const fallbackStore = store.kind === "postgres" ? new MemoryAgentStore() : store;
  let degraded = false;

  async function mirroredWrite(method, value) {
    if (store === fallbackStore) return store[method](value);
    try {
      const result = await store[method](value);
      await fallbackStore[method](value).catch(() => {});
      degraded = false;
      return result;
    } catch (_) {
      degraded = true;
      return fallbackStore[method](value);
    }
  }

  async function readWithFallback(method, value) {
    if (store === fallbackStore) return store[method](value);
    try {
      const result = await store[method](value);
      degraded = false;
      return result;
    } catch (_) {
      degraded = true;
      return fallbackStore[method](value);
    }
  }

  return {
    store,
    get storage() { return store.kind; },
    get degraded() { return degraded; },
    async ready() {
      try {
        await store.ready();
        degraded = false;
      } catch (_) {
        degraded = true;
        await fallbackStore.ready();
      }
    },
    async recordCode(value) {
      const record = normalizeCodeRecord(value);
      if (!record.visitorId) return { recorded: false };
      return { recorded: true, ...(await mirroredWrite("recordCode", record)) };
    },
    async recordInteraction(value) {
      const record = normalizeInteraction(value);
      if (!record.visitorId || !record.prompt) return "";
      await mirroredWrite("recordInteraction", record);
      return record.id;
    },
    async recordOutcome(value) {
      const interactionId = cleanId(value.interactionId);
      const visitorId = cleanId(value.visitorId);
      if (!interactionId || !visitorId) return false;
      return mirroredWrite("recordOutcome", { interactionId, visitorId, success: value.success !== false, error: cleanText(value.error, 500) });
    },
    async recordFeedback(value) {
      const interactionId = cleanId(value.interactionId);
      const visitorId = cleanId(value.visitorId);
      const rating = normalizeRating(value.rating);
      if (!interactionId || !visitorId || !rating) return { recorded: false };
      const interaction = await mirroredWrite("recordFeedback", { interactionId, visitorId, rating, comment: cleanText(value.comment, 500) });
      return { recorded: Boolean(interaction) };
    },
    async getContext(value) {
      const visitorId = cleanId(value.visitorId);
      if (!visitorId) return summarizeContext();
      return readWithFallback("getContext", { visitorId, projectId: cleanId(value.projectId, "project-unknown") });
    },
    async getAdminStats() {
      const stats = await readWithFallback("getAdminStats");
      return { ...stats, degraded };
    },
  };
}

export { cleanCode, codeHash, lessonFromInteraction };
