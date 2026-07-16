import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createAnalyticsService } from "./analytics.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = resolve(ROOT, ".env");
const startupEnv = readEnv(ENV_FILE);
const PORT = Number(process.env.PORT || startupEnv.PORT || 4173);
const HOST = process.env.HOST || startupEnv.HOST || "127.0.0.1";
const MAX_BODY_BYTES = 120_000;
const analytics = createAnalyticsService({
  databaseUrl: process.env.DATABASE_URL || startupEnv.DATABASE_URL || "",
  adminPassword: process.env.ADMIN_PASSWORD || startupEnv.ADMIN_PASSWORD || "",
  sessionSecret: process.env.ADMIN_SESSION_SECRET || startupEnv.ADMIN_SESSION_SECRET || "",
  timeZone: process.env.ANALYTICS_TIME_ZONE || startupEnv.ANALYTICS_TIME_ZONE || "Asia/Shanghai",
});

const STYLES = new Set(["house", "techno", "lofi", "ambient", "synthwave", "trance", "dnb", "trap"]);
const BANKS = new Set(["RolandTR909", "RolandTR808", "RolandTR707", "AkaiLinn"]);
const SYNTHS = new Set(["sine", "triangle", "square", "sawtooth", "supersaw", "pulse"]);
const BASE_TRACK_IDS = new Set(["drums", "bass", "chords", "lead"]);
const LEAD_INSTRUMENTS = Object.freeze({
  synth: { label: "合成器", sound: null, envelope: ".attack(0.01).decay(0.16).sustain(0.06).release(0.2)", color: "" },
  harmonica: { label: "口琴", sound: "square", envelope: ".attack(0.04).decay(0.18).sustain(0.72).release(0.38)", color: ".vib(5.5).vibmod(0.12)" },
  flute: { label: "长笛", sound: "wt_flute", envelope: ".attack(0.05).decay(0.2).sustain(0.62).release(0.45)", color: ".vib(4.8).vibmod(0.08)" },
  sax: { label: "萨克斯", sound: "sax", envelope: ".attack(0.03).decay(0.2).sustain(0.65).release(0.4)", color: ".vib(5).vibmod(0.1)" },
  sitar: { label: "西塔琴", sound: "sitar", envelope: ".attack(0.01).decay(0.32).sustain(0.12).release(0.5)", color: "" },
  piano: { label: "钢琴", sound: "wt_piano", envelope: ".attack(0.01).decay(0.5).sustain(0.24).release(0.55)", color: "" },
  guitar: { label: "吉他", sound: "pluck", envelope: ".attack(0.01).decay(0.3).sustain(0.16).release(0.45)", color: "" },
  violin: { label: "小提琴", sound: "sawtooth", envelope: ".attack(0.12).decay(0.2).sustain(0.7).release(0.55)", color: ".vib(5.2).vibmod(0.1)" },
  cello: { label: "大提琴", sound: "triangle", envelope: ".attack(0.14).decay(0.25).sustain(0.75).release(0.65)", color: ".vib(4.5).vibmod(0.08)" },
  trumpet: { label: "小号", sound: "sawtooth", envelope: ".attack(0.06).decay(0.18).sustain(0.68).release(0.35)", color: ".vib(5).vibmod(0.08)" },
  clarinet: { label: "单簧管", sound: "square", envelope: ".attack(0.07).decay(0.2).sustain(0.68).release(0.42)", color: ".vib(4.6).vibmod(0.06)" },
  marimba: { label: "马林巴", sound: "sine", envelope: ".attack(0.005).decay(0.42).sustain(0.04).release(0.32)", color: ".fm(1.5).fmh(3)" },
});
const LEAD_INSTRUMENT_ALIASES = [
  ["harmonica", /口琴|harmonica|blues\s+harp/i],
  ["flute", /长笛|笛子|flute/i],
  ["sax", /萨克斯|sax(?:ophone)?/i],
  ["sitar", /西塔琴|sitar/i],
  ["piano", /钢琴|piano/i],
  ["guitar", /吉他|guitar/i],
  ["violin", /小提琴|violin/i],
  ["cello", /大提琴|cello/i],
  ["trumpet", /小号|trumpet/i],
  ["clarinet", /单簧管|黑管|clarinet/i],
  ["marimba", /马林巴|marimba/i],
];
const ROOT_MIDI = { C: 36, "C#": 37, Db: 37, D: 38, "D#": 39, Eb: 39, E: 40, F: 41, "F#": 42, Gb: 42, G: 43, "G#": 44, Ab: 44, A: 45, "A#": 46, Bb: 46, B: 47 };
const NOTE_NAMES = ["c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b"];
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

const STYLE_DEFAULTS = {
  house: { bpm: 122, key: "F minor", bank: "RolandTR909", kick: [0, 4, 8, 12], snare: [4, 12], hats: [2, 6, 10, 14], bass: [0, 3, 6, 8, 11, 14], lead: [2, 5, 10, 13] },
  techno: { bpm: 132, key: "C minor", bank: "RolandTR909", kick: [0, 4, 8, 12], snare: [4, 12], hats: [2, 6, 10, 14, 15], bass: [0, 3, 5, 7, 8, 11, 14], lead: [3, 7, 11, 15] },
  lofi: { bpm: 84, key: "A minor", bank: "AkaiLinn", kick: [0, 7, 10], snare: [4, 12], hats: [2, 6, 10, 14], bass: [0, 4, 7, 10, 14], lead: [3, 9, 15] },
  ambient: { bpm: 76, key: "C minor", bank: "RolandTR808", kick: [0, 10], snare: [12], hats: [6, 14], bass: [0, 8], lead: [3, 11] },
  synthwave: { bpm: 108, key: "F minor", bank: "AkaiLinn", kick: [0, 4, 8, 12], snare: [4, 12], hats: [2, 6, 10, 14], bass: [0, 2, 4, 6, 8, 10, 12, 14], lead: [1, 3, 5, 7, 9, 11, 13, 15] },
  trance: { bpm: 138, key: "A minor", bank: "RolandTR909", kick: [0, 4, 8, 12], snare: [4, 12], hats: [2, 6, 10, 14], bass: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15], lead: [0, 3, 6, 8, 11, 14] },
  dnb: { bpm: 174, key: "D minor", bank: "RolandTR707", kick: [0, 3, 8, 10], snare: [4, 12], hats: [0, 2, 4, 6, 8, 10, 12, 14, 15], bass: [0, 3, 6, 8, 11, 14], lead: [2, 6, 9, 13] },
  trap: { bpm: 142, key: "C minor", bank: "RolandTR808", kick: [0, 6, 10, 14], snare: [4, 12], hats: [0, 2, 4, 6, 8, 10, 11, 12, 14, 15], bass: [0, 6, 10, 14], lead: [2, 7, 11, 15] },
};

const SYSTEM_PROMPT = `你是脉冲音格的电子音乐编曲智能体。你要把用户的中文或英文描述转换成一个可验证的 Strudel 编曲计划。

只输出一个 JSON 对象，不要 Markdown、代码围栏、解释或思考过程。字段必须完整：
{
  "title": "2到8个汉字的作品名",
  "reply": "一句简短中文，说明你做了哪些音乐变化",
  "style": "house|techno|lofi|ambient|synthwave|trance|dnb|trap",
  "bpm": 60到210之间的整数,
  "key": "例如 C minor 或 F# major",
  "bank": "RolandTR909|RolandTR808|RolandTR707|AkaiLinn",
  "kick": [16个0或1],
  "snare": [16个0或1],
  "hats": [16个0或1],
  "bassRhythm": [16个0或1],
  "leadRhythm": [16个0或1],
  "bassNotes": [2到8个带八度的音名，例如 "c2","eb2","g2"],
  "chordNotes": [3到5个带八度的音名],
  "leadNotes": [2到8个带八度的音名],
  "bassSynth": "sine|triangle|square|sawtooth|supersaw|pulse",
  "chordSynth": "sine|triangle|square|sawtooth|supersaw|pulse",
  "leadSynth": "sine|triangle|square|sawtooth|supersaw|pulse",
  "leadInstrument": "synth|harmonica|flute|sax|sitar|piano|guitar|violin|cello|trumpet|clarinet|marimba",
  "instrumentTracks": [{
    "instrument": "harmonica|flute|sax|sitar|piano|guitar|violin|cello|trumpet|clarinet|marimba",
    "notes": [2到8个带八度的音名],
    "rhythm": [16个0或1],
    "volume": 0到1
  }],
  "tone": 200到6000的整数,
  "resonance": 0到20的数字,
  "room": 0到1的数字,
  "delay": 0到0.8的数字,
  "volumes": {"drums":0到1,"bass":0到1,"chords":0到1,"lead":0到1}
}

编曲规则：节奏数组必须正好16格；调性、低音、和弦与旋律要相互匹配；遵守用户指定的 BPM、风格和乐器；用户说“加入、添加、新增”口琴、长笛、萨克斯等乐器时，必须把它作为独立对象加入 instrumentTracks，保留原来的主旋律，不能只在 reply 中声称已经添加，也不能用新乐器替换主旋律；leadInstrument 仅用于兼容旧结果。用户说“不要、移除、去掉”某个额外乐器时，从 instrumentTracks 中删除它；如果用户说“不要某个基础轨”，将该基础轨节奏全设为0且音量设为0。用户常会在当前作品上继续说“低音更重”“更暗”等，遇到这种修改指令要保留未被要求改变的部分。每次都返回完整的新编曲计划，确保主作品代码可以被整体覆盖。除非用户明确要求全静音或清空所有轨道，否则至少保留一个音量大于0且节奏不是全0的可播放轨道；创作新作品时不得返回全0节奏或全0音量。不要使用 GM 乐器。`;

function readEnv(file) {
  const values = {};
  if (!existsSync(file)) return values;
  const source = readFileSync(file, "utf8");
  source.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) return;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  });
  return values;
}

function miniMaxConfig() {
  const fileEnv = readEnv(ENV_FILE);
  return {
    apiKey: process.env.MINIMAX_API_KEY || fileEnv.MINIMAX_API_KEY || "",
    baseURL: (process.env.MINIMAX_BASE_URL || fileEnv.MINIMAX_BASE_URL || "https://api.minimaxi.com/v1").replace(/\/$/, ""),
    model: process.env.MINIMAX_MODEL || fileEnv.MINIMAX_MODEL || "MiniMax-M3",
  };
}

function json(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(payload));
}

function clamp(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
}

function safeText(value, fallback, maxLength = 80) {
  const text = String(value || "")
    .replace(/[\r\n<>`]/g, " ")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.slice(0, maxLength) : fallback;
}

function normalizeKey(value, fallback) {
  const match = String(value || "").trim().match(/^([A-Ga-g])\s*([#b]?)[\s:]+(minor|major)$/i);
  if (!match) return fallback;
  const root = `${match[1].toUpperCase()}${match[2] || ""}`;
  return Object.hasOwn(ROOT_MIDI, root) ? `${root} ${match[3].toLowerCase()}` : fallback;
}

function midiName(midi) {
  const pitch = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${pitch}${octave}`;
}

function parseNote(value) {
  const match = String(value || "").trim().match(/^([a-gA-G])\s*(#|b|s)?\s*(-?\d+)$/);
  if (!match) return null;
  const semitones = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  const accidental = match[2] === "#" || match[2] === "s" ? 1 : match[2] === "b" ? -1 : 0;
  const midi = (Number(match[3]) + 1) * 12 + semitones[match[1].toLowerCase()] + accidental;
  return midi >= 20 && midi <= 108 ? midiName(midi) : null;
}

function defaultHarmony(key) {
  const [rootName, quality] = key.split(" ");
  const root = ROOT_MIDI[rootName] ?? ROOT_MIDI.C;
  const third = quality === "major" ? 4 : 3;
  return {
    bassNotes: [0, 0, third, 5, 7, third].map((interval) => midiName(root + interval)),
    chordNotes: [12, 12 + third, 19, quality === "major" ? 23 : 22].map((interval) => midiName(root + interval)),
    leadNotes: [12, 12 + third, 19, 17, 15, 22].map((interval) => midiName(root + interval)),
  };
}

function normalizeNotes(value, fallback, minLength, maxLength) {
  if (!Array.isArray(value)) return fallback;
  const notes = value.map(parseNote).filter(Boolean).slice(0, maxLength);
  return notes.length >= minLength ? notes : fallback;
}

function stepsToArray(steps) {
  const active = new Set(steps);
  return Array.from({ length: 16 }, (_, index) => active.has(index) ? 1 : 0);
}

function normalizeRhythm(value, fallbackSteps) {
  if (!Array.isArray(value) || value.length !== 16) return stepsToArray(fallbackSteps);
  return value.map((item) => Number(item) > 0 ? 1 : 0);
}

function normalizeLeadInstrument(value) {
  const normalized = String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (Object.hasOwn(LEAD_INSTRUMENTS, normalized)) return normalized;
  const alias = LEAD_INSTRUMENT_ALIASES.find(([, pattern]) => pattern.test(String(value || "")));
  return alias?.[0] || "synth";
}

function detectRequestedInstruments(prompt) {
  const text = String(prompt || "");
  const requested = [];
  for (const [instrument, pattern] of LEAD_INSTRUMENT_ALIASES) {
    const match = pattern.exec(text);
    if (!match) continue;
    const prefix = text.slice(Math.max(0, match.index - 8), match.index);
    if (/(不要|移除|去掉|取消|without|remove)\s*$/i.test(prefix)) continue;
    requested.push(instrument);
  }
  return requested;
}

function detectRemovedInstruments(prompt) {
  const text = String(prompt || "");
  return LEAD_INSTRUMENT_ALIASES
    .filter(([, pattern]) => {
      const match = pattern.exec(text);
      if (!match) return false;
      const prefix = text.slice(Math.max(0, match.index - 10), match.index);
      return /(不要|移除|去掉|取消|without|remove)\s*$/i.test(prefix);
    })
    .map(([instrument]) => instrument);
}

function normalizeInstrumentTracks(value, fallbackNotes, fallbackRhythm) {
  if (!Array.isArray(value)) return [];
  const tracks = [];
  const seen = new Set();
  for (const item of value) {
    const instrument = normalizeLeadInstrument(item?.instrument || item?.id);
    if (instrument === "synth" || seen.has(instrument)) continue;
    seen.add(instrument);
    const profile = LEAD_INSTRUMENTS[instrument];
    const rhythm = Array.isArray(item?.rhythm) && item.rhythm.length === 16
      ? item.rhythm.map((step) => Number(step) > 0 ? 1 : 0)
      : [...fallbackRhythm];
    tracks.push({
      id: instrument,
      instrument,
      label: profile.label,
      notes: normalizeNotes(item?.notes, fallbackNotes, 2, 8),
      rhythm,
      volume: clamp(item?.volume, 0, 1, 0.55),
    });
    if (tracks.length >= 6) break;
  }
  return tracks;
}

function normalizeDeletedTracks(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((track) => String(track || "").trim()).filter((track) => (
    BASE_TRACK_IDS.has(track) || (track !== "synth" && Object.hasOwn(LEAD_INSTRUMENTS, track))
  )))];
}

function defaultVolumesForStyle(style) {
  if (style === "ambient") return { drums: 0.35, bass: 0.5, chords: 0.65, lead: 0.3 };
  if (style === "techno") return { drums: 0.88, bass: 0.7, chords: 0.28, lead: 0.34 };
  return { drums: 0.82, bass: 0.62, chords: 0.45, lead: 0.38 };
}

function rhythmHasEvents(...rhythms) {
  return rhythms.some((rhythm) => Array.isArray(rhythm) && rhythm.some((step) => Number(step) > 0));
}

function isIntentionalSilenceRequest(prompt) {
  return /(不要任何声音|全(?:部)?静音|清空所有(?:声音|轨道|分轨)|删除所有(?:声音|轨道|分轨)|移除所有(?:声音|轨道|分轨)|silence|mute\s+all|remove\s+all\s+tracks)/i.test(String(prompt || ""));
}

function planHasAudibleTrack(plan) {
  const deleted = new Set(normalizeDeletedTracks(plan.deletedTracks));
  if (!deleted.has("drums") && plan.volumes.drums > 0 && rhythmHasEvents(plan.kick, plan.snare, plan.hats)) return true;
  if (!deleted.has("bass") && plan.volumes.bass > 0 && rhythmHasEvents(plan.bassRhythm)) return true;
  if (!deleted.has("chords") && plan.volumes.chords > 0) return true;
  if (!deleted.has("lead") && plan.volumes.lead > 0 && rhythmHasEvents(plan.leadRhythm)) return true;
  return normalizeInstrumentTracks(plan.instrumentTracks, plan.leadNotes, plan.leadRhythm)
    .some((track) => !deleted.has(track.id) && track.volume > 0 && rhythmHasEvents(track.rhythm));
}

function recoverSilentPlan(plan, prompt) {
  if (planHasAudibleTrack(plan) || isIntentionalSilenceRequest(prompt)) return false;
  const defaults = STYLE_DEFAULTS[plan.style] || STYLE_DEFAULTS.house;
  const defaultVolumes = defaultVolumesForStyle(plan.style);
  plan.deletedTracks = normalizeDeletedTracks(plan.deletedTracks).filter((track) => !BASE_TRACK_IDS.has(track));
  if (!rhythmHasEvents(plan.kick, plan.snare, plan.hats)) {
    plan.kick = stepsToArray(defaults.kick);
    plan.snare = stepsToArray(defaults.snare);
    plan.hats = stepsToArray(defaults.hats);
  }
  if (!rhythmHasEvents(plan.bassRhythm)) plan.bassRhythm = stepsToArray(defaults.bass);
  if (!rhythmHasEvents(plan.leadRhythm)) plan.leadRhythm = stepsToArray(defaults.lead);
  Object.keys(defaultVolumes).forEach((track) => {
    if (!(plan.volumes[track] > 0)) plan.volumes[track] = defaultVolumes[track];
  });
  return true;
}

function normalizePlan(raw) {
  const style = STYLES.has(raw?.style) ? raw.style : "house";
  const defaults = STYLE_DEFAULTS[style];
  const key = normalizeKey(raw?.key, defaults.key);
  const harmony = defaultHarmony(key);
  const defaultVolumes = defaultVolumesForStyle(style);

  const plan = {
    title: safeText(raw?.title, "智能律动", 18),
    reply: safeText(raw?.reply, "我根据你的描述重新安排了节奏、低音、和声与音色。", 160),
    style,
    bpm: Math.round(clamp(raw?.bpm, 60, 210, defaults.bpm)),
    key,
    bank: BANKS.has(raw?.bank) ? raw.bank : defaults.bank,
    kick: normalizeRhythm(raw?.kick, defaults.kick),
    snare: normalizeRhythm(raw?.snare, defaults.snare),
    hats: normalizeRhythm(raw?.hats, defaults.hats),
    bassRhythm: normalizeRhythm(raw?.bassRhythm, defaults.bass),
    leadRhythm: normalizeRhythm(raw?.leadRhythm, defaults.lead),
    bassNotes: normalizeNotes(raw?.bassNotes, harmony.bassNotes, 2, 8),
    chordNotes: normalizeNotes(raw?.chordNotes, harmony.chordNotes, 3, 5),
    leadNotes: normalizeNotes(raw?.leadNotes, harmony.leadNotes, 2, 8),
    bassSynth: SYNTHS.has(raw?.bassSynth) ? raw.bassSynth : style === "ambient" ? "sine" : "sawtooth",
    chordSynth: SYNTHS.has(raw?.chordSynth) ? raw.chordSynth : style === "trance" ? "supersaw" : "triangle",
    leadSynth: SYNTHS.has(raw?.leadSynth) ? raw.leadSynth : style === "synthwave" ? "square" : "sawtooth",
    leadInstrument: normalizeLeadInstrument(raw?.leadInstrument),
    tone: Math.round(clamp(raw?.tone, 200, 6000, style === "techno" ? 1100 : 2600)),
    resonance: clamp(raw?.resonance, 0, 20, style === "techno" ? 14 : 6),
    room: clamp(raw?.room, 0, 1, style === "ambient" ? 0.82 : 0.5),
    delay: clamp(raw?.delay, 0, 0.8, 0.3),
    volumes: {
      drums: clamp(raw?.volumes?.drums, 0, 1, defaultVolumes.drums),
      bass: clamp(raw?.volumes?.bass, 0, 1, defaultVolumes.bass),
      chords: clamp(raw?.volumes?.chords, 0, 1, defaultVolumes.chords),
      lead: clamp(raw?.volumes?.lead, 0, 1, defaultVolumes.lead),
    },
  };
  plan.deletedTracks = normalizeDeletedTracks(raw?.deletedTracks);
  plan.instrumentTracks = normalizeInstrumentTracks(raw?.instrumentTracks, plan.leadNotes, plan.leadRhythm);
  if (plan.leadInstrument !== "synth" && !plan.instrumentTracks.some((track) => track.id === plan.leadInstrument)) {
    plan.instrumentTracks.push(normalizeInstrumentTracks([{
      instrument: plan.leadInstrument,
      notes: plan.leadNotes,
      rhythm: plan.leadRhythm,
      volume: 0.55,
    }], plan.leadNotes, plan.leadRhythm)[0]);
  }
  return plan;
}

function miniPattern(rhythm, token) {
  return rhythm.map((active) => active ? token : "~").join(" ");
}

function fixed(value) {
  return Number(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function buildStrudelCode(plan) {
  const chord = plan.chordNotes.join(",");
  const deletedTracks = new Set(normalizeDeletedTracks(plan.deletedTracks));
  const instrumentTracks = normalizeInstrumentTracks(plan.instrumentTracks, plan.leadNotes, plan.leadRhythm)
    .filter((track) => !deletedTracks.has(track.id));
  const baseSliders = [
    !deletedTracks.has("drums") && `let drumsVol = slider(${fixed(plan.volumes.drums)}, 0, 1, 0.01, "鼓组")`,
    !deletedTracks.has("bass") && `let bassVol = slider(${fixed(plan.volumes.bass)}, 0, 1, 0.01, "贝斯")`,
    !deletedTracks.has("chords") && `let chordsVol = slider(${fixed(plan.volumes.chords)}, 0, 1, 0.01, "和弦")`,
    !deletedTracks.has("lead") && `let leadVol = slider(${fixed(plan.volumes.lead)}, 0, 1, 0.01, "主旋律")`,
  ].filter(Boolean);
  const extraSliders = instrumentTracks.map((track) => (
    `let ${track.id}Vol = slider(${fixed(track.volume)}, 0, 1, 0.01, "${track.label}")`
  ));
  const layerExpressions = [];
  if (!deletedTracks.has("drums")) {
    layerExpressions.push(
      `  s("${miniPattern(plan.kick, "bd")}")\n    .bank("${plan.bank}").gain(drumsVol)`,
      `  s("${miniPattern(plan.snare, "cp")}")\n    .bank("${plan.bank}").gain(drumsVol)`,
      `  s("${miniPattern(plan.hats, "hh")}")\n    .bank("${plan.bank}").gain(drumsVol)`,
    );
  }
  if (!deletedTracks.has("bass")) {
    layerExpressions.push([
      `  note("<${plan.bassNotes.join(" ")}>")`,
      `    .s("${plan.bassSynth}").struct("${miniPattern(plan.bassRhythm, "x")}")`,
      "    .attack(0.01).decay(0.18).sustain(0.12).release(0.15)",
      `    .cutoff(tone).resonance(${fixed(plan.resonance)}).gain(bassVol)`,
    ].join("\n"));
  }
  if (!deletedTracks.has("chords")) {
    layerExpressions.push([
      `  note("[${chord}]")`,
      `    .s("${plan.chordSynth}").slow(4).attack(0.3).release(1.4)`,
      `    .cutoff(${Math.round(plan.tone * 0.72)}).room(${fixed(plan.room)}).gain(chordsVol)`,
    ].join("\n"));
  }
  if (!deletedTracks.has("lead")) {
    layerExpressions.push([
      "  // 原主旋律",
      `  note("<${plan.leadNotes.join(" ")}>")`,
      `    .s("${plan.leadSynth}").struct("${miniPattern(plan.leadRhythm, "x")}")`,
      "    .attack(0.01).decay(0.16).sustain(0.06).release(0.2)",
      `    .cutoff(${plan.tone}).delay(${fixed(plan.delay)}).room(${fixed(Math.min(0.9, plan.room + 0.1))}).gain(leadVol)`,
    ].join("\n"));
  }
  instrumentTracks.forEach((track) => {
    const profile = LEAD_INSTRUMENTS[track.instrument];
    layerExpressions.push([
      `  // 独立乐器轨道：${track.label}`,
      `  note("<${track.notes.join(" ")}>")`,
      `    .s("${profile.sound}").struct("${miniPattern(track.rhythm, "x")}")`,
      `    ${profile.envelope}`,
      ...(profile.color ? [`    ${profile.color}`] : []),
      `    .cutoff(${plan.tone}).delay(${fixed(plan.delay)}).room(${fixed(Math.min(0.9, plan.room + 0.12))}).gain(${track.id}Vol)`,
    ].join("\n"));
  });
  if (!layerExpressions.length) layerExpressions.push('  s("~") // 静音占位');
  return [
    `// DJ OPUS / 脉冲音格 / ${plan.title}`,
    ...(plan.request ? [`// AI 修改：${plan.request}`] : []),
    `setcps(${plan.bpm} / 60 / 4)`,
    "",
    'let masterVol = slider(0.78, 0, 1, 0.01, "总音量")',
    ...baseSliders,
    ...extraSliders,
    `let tone = slider(${plan.tone}, 200, 6000, 10, "音色明暗")`,
    "",
    "stack(",
    layerExpressions.join(",\n"),
    ").gain(masterVol)",
  ].join("\n");
}

function parseModelJson(content) {
  const cleaned = String(content || "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error("MiniMax 没有返回可解析的编曲计划");
  }
}

async function callMiniMax(messages, config) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);
  try {
    const response = await fetch(`${config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.8,
        top_p: 0.95,
        max_completion_tokens: 2600,
        thinking: { type: "disabled" },
        stream: false,
      }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data?.error?.message || data?.base_resp?.status_msg || `HTTP ${response.status}`;
      const error = new Error(detail);
      error.status = response.status;
      throw error;
    }
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("MiniMax 返回了空内容");
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

async function composeWithMiniMax(prompt, currentCode, currentInstrumentTracks = [], currentDeletedTracks = []) {
  const config = miniMaxConfig();
  const current = currentCode
    ? `\n\n当前正在播放的 Strudel 作品如下。若用户是在提出修改，请以它为基础：\n${currentCode.slice(0, 18_000)}`
    : "";
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `用户要求：${prompt}${current}` },
  ];
  let content = await callMiniMax(messages, config);
  let raw;
  try {
    raw = parseModelJson(content);
  } catch (_) {
    content = await callMiniMax([
      ...messages,
      { role: "assistant", content },
      { role: "user", content: "上一个输出不是有效 JSON。请严格按系统要求只返回一个完整 JSON 对象。" },
    ], config);
    raw = parseModelJson(content);
  }
  const plan = normalizePlan(raw);
  const requestedInstruments = detectRequestedInstruments(prompt);
  const deletedTracks = new Set(normalizeDeletedTracks(currentDeletedTracks));
  requestedInstruments.forEach((instrument) => deletedTracks.delete(instrument));
  const previousTracks = normalizeInstrumentTracks(currentInstrumentTracks, plan.leadNotes, plan.leadRhythm)
    .filter((track) => !deletedTracks.has(track.id));
  const mergedTracks = new Map(previousTracks.map((track) => [track.id, track]));
  plan.instrumentTracks
    .filter((track) => !deletedTracks.has(track.id))
    .filter((track) => !requestedInstruments.length || requestedInstruments.includes(track.id))
    .forEach((track) => mergedTracks.set(track.id, track));
  const legacyInstrument = normalizeLeadInstrument(raw?.leadInstrument);
  if (legacyInstrument !== "synth"
    && (!requestedInstruments.length || requestedInstruments.includes(legacyInstrument))
    && !deletedTracks.has(legacyInstrument)
    && !mergedTracks.has(legacyInstrument)) {
    mergedTracks.set(legacyInstrument, normalizeInstrumentTracks([{
      instrument: legacyInstrument,
      notes: plan.leadNotes,
      rhythm: plan.leadRhythm,
      volume: 0.55,
    }], plan.leadNotes, plan.leadRhythm)[0]);
  }
  requestedInstruments.forEach((instrument) => {
    if (mergedTracks.has(instrument)) return;
    mergedTracks.set(instrument, normalizeInstrumentTracks([{
      instrument,
      notes: plan.leadNotes,
      rhythm: plan.leadRhythm,
      volume: 0.55,
    }], plan.leadNotes, plan.leadRhythm)[0]);
  });
  detectRemovedInstruments(prompt).forEach((instrument) => {
    mergedTracks.delete(instrument);
    deletedTracks.add(instrument);
  });
  plan.instrumentTracks = [...mergedTracks.values()].filter(Boolean).slice(0, 6);
  plan.deletedTracks = [...deletedTracks];
  plan.leadInstrument = requestedInstruments.at(-1) || plan.instrumentTracks.at(-1)?.instrument || "synth";
  plan.request = safeText(prompt, "更新编曲", 72);
  if (recoverSilentPlan(plan, prompt)) {
    plan.reply = "检测到旧项目没有活跃分轨，已恢复鼓组、贝斯、和弦和主旋律并完成编曲。";
  }
  const leadInstrument = LEAD_INSTRUMENTS[plan.leadInstrument] || LEAD_INSTRUMENTS.synth;
  return {
    provider: "MiniMax",
    model: config.model,
    title: plan.title,
    reply: plan.reply,
    style: plan.style,
    bpm: plan.bpm,
    key: plan.key,
    leadInstrument: plan.leadInstrument,
    leadInstrumentLabel: leadInstrument.label,
    deletedTracks: plan.deletedTracks,
    instrumentTracks: plan.instrumentTracks.map((track) => ({
      id: track.id,
      instrument: track.instrument,
      label: track.label,
      notes: track.notes,
      rhythm: track.rhythm,
      steps: track.rhythm.flatMap((active, index) => active ? [index] : []),
      volume: track.volume,
      muted: track.volume === 0,
    })),
    code: buildStrudelCode(plan),
  };
}

async function readJsonBody(req) {
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > MAX_BODY_BYTES) throw Object.assign(new Error("请求内容过大"), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch (_) {
    throw Object.assign(new Error("请求不是有效的 JSON"), { status: 400 });
  }
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    const config = miniMaxConfig();
    json(res, 200, {
      ok: true,
      provider: "MiniMax",
      model: config.model,
      configured: Boolean(config.apiKey),
      analytics: { storage: analytics.storage, adminConfigured: analytics.configured },
    });
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/analytics/visit") {
    const body = await readJsonBody(req);
    try {
      json(res, 202, { ok: true, ...(await analytics.trackVisit(body, req)) });
    } catch (error) {
      console.error(`[analytics] 无法记录访问：${error.message}`);
      json(res, 202, { ok: true, tracked: false });
    }
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/analytics/heartbeat") {
    const body = await readJsonBody(req);
    try {
      json(res, 202, { ok: true, ...(await analytics.heartbeat(body, req)) });
    } catch (error) {
      console.error(`[analytics] 无法更新在线状态：${error.message}`);
      json(res, 202, { ok: true, tracked: false });
    }
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/analytics/event") {
    const body = await readJsonBody(req);
    try {
      json(res, 202, { ok: true, ...(await analytics.trackEvent(body, req)) });
    } catch (error) {
      console.error(`[analytics] 无法记录事件：${error.message}`);
      json(res, 202, { ok: true, tracked: false });
    }
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/admin/session") {
    json(res, 200, {
      ok: true,
      authenticated: analytics.isAdmin(req),
      configured: analytics.configured,
      storage: analytics.storage,
    });
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/admin/login") {
    const body = await readJsonBody(req);
    const result = analytics.login(req, String(body.password || ""));
    if (!result.ok) {
      json(res, result.status, { error: result.error });
      return;
    }
    res.setHeader("Set-Cookie", result.cookie);
    json(res, 200, { ok: true, storage: analytics.storage });
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/admin/logout") {
    res.setHeader("Set-Cookie", analytics.clearSessionCookie(req));
    json(res, 200, { ok: true });
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/admin/stats") {
    if (!analytics.isAdmin(req)) {
      json(res, 401, { error: "请先登录数据后台。" });
      return;
    }
    try {
      json(res, 200, { ok: true, ...(await analytics.getStats(url.searchParams.get("days"))) });
    } catch (error) {
      console.error(`[analytics] 无法读取统计：${error.message}`);
      json(res, 503, { error: "统计数据库暂时不可用，请稍后刷新。" });
    }
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/compose") {
    if (!miniMaxConfig().apiKey) {
      json(res, 503, { error: "尚未配置 MiniMax API 密钥。请在 .env 中设置 MINIMAX_API_KEY，保存后刷新网页。", code: "MINIMAX_KEY_MISSING" });
      return;
    }
    const body = await readJsonBody(req);
    const prompt = String(body.prompt || "").trim();
    const currentCode = typeof body.currentCode === "string" ? body.currentCode : "";
    const instrumentTracks = Array.isArray(body.instrumentTracks) ? body.instrumentTracks : [];
    const deletedTracks = normalizeDeletedTracks(body.deletedTracks);
    if (!prompt) throw Object.assign(new Error("请输入音乐描述"), { status: 400 });
    if (prompt.length > 600) throw Object.assign(new Error("音乐描述不能超过 600 个字符"), { status: 400 });
    const result = await composeWithMiniMax(prompt, currentCode, instrumentTracks, deletedTracks);
    json(res, 200, result);
    return;
  }
  json(res, 404, { error: "接口不存在" });
}

function serveStatic(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch (_) {
    res.writeHead(400);
    res.end("请求地址无效");
    return;
  }
  const requested = pathname === "/"
    ? "index.html"
    : pathname === "/admin" || pathname === "/admin/"
      ? "admin.html"
      : pathname.replace(/^\/+/, "");
  const file = resolve(ROOT, requested);
  const relativeFile = relative(ROOT, file);
  if (relativeFile === ".." || relativeFile.startsWith(`..${sep}`) || isAbsolute(relativeFile)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("禁止访问");
    return;
  }
  if (!existsSync(file) || !statSync(file).isFile() || relativeFile === ".env") {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("页面不存在");
    return;
  }
  const headers = {
    "Content-Type": MIME_TYPES[extname(file).toLowerCase()] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": relativeFile.startsWith(`vendor${sep}`) ? "public, max-age=86400" : "no-cache",
  };
  res.writeHead(200, headers);
  if (req.method === "HEAD") res.end();
  else createReadStream(file).pipe(res);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || `${HOST}:${PORT}`}`);
  try {
    if (url.pathname.startsWith("/api/")) await handleApi(req, res, url);
    else serveStatic(req, res, url);
  } catch (error) {
    const upstreamStatus = Number(error.status);
    let status = upstreamStatus >= 400 && upstreamStatus < 500 ? upstreamStatus : 502;
    let message = error.name === "AbortError" ? "MiniMax 请求超时，请稍后重试" : error.message || "服务器处理失败";
    if (upstreamStatus === 401 || upstreamStatus === 403) message = "MiniMax API 密钥无效或没有该模型的权限";
    if (upstreamStatus === 429) message = "MiniMax 请求过于频繁或账户额度不足，请稍后重试";
    if (upstreamStatus >= 500) message = `MiniMax 服务暂时不可用：${message}`;
    if (error.status === 413) status = 413;
    console.error(`[${new Date().toISOString()}] ${req.method} ${url.pathname}: ${message}`);
    if (!res.headersSent) json(res, status, { error: message });
    else res.end();
  }
});

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMainModule) {
  server.listen(PORT, HOST, () => {
    const config = miniMaxConfig();
    console.log(`预览服务已启动：http://${HOST}:${PORT}`);
    console.log(`MiniMax ${config.model}：${config.apiKey ? "已配置" : "等待配置 MINIMAX_API_KEY"}`);
    console.log(`数据后台：${analytics.configured ? "已配置密码" : "等待配置 ADMIN_PASSWORD"} · ${analytics.storage}`);
    analytics.ready().catch((error) => console.error(`[analytics] 数据库初始化失败：${error.message}`));
  });
}

export { analytics, buildStrudelCode, normalizePlan, parseModelJson, server };
