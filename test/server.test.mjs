import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import test from "node:test";
import { createAnalyticsService } from "../analytics.mjs";
import { buildStrudelCode, normalizePlan, parseModelJson, server as staticServer } from "../server.mjs";

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address()));
  });
}

function close(server) {
  return new Promise((resolve) => server.close(resolve));
}

test("MiniMax JSON 可以去除思考标签和代码围栏", () => {
  const parsed = parseModelJson('<think>内部推理</think>\n```json\n{"style":"techno"}\n```');
  assert.equal(parsed.style, "techno");
});

test("编曲计划会限制模型返回的危险或越界内容", () => {
  const plan = normalizePlan({
    title: "测试<script>",
    style: "techno",
    bpm: 999,
    key: "C minor",
    kick: Array(16).fill(1),
    snare: Array(16).fill(0),
    hats: Array(16).fill(1),
    bassRhythm: Array(16).fill(1),
    leadRhythm: Array(16).fill(0),
    bassNotes: ["c2", "eb2", "g2"],
    chordNotes: ["c4", "eb4", "g4", "bb4"],
    leadNotes: ["c5", "g4"],
    volumes: { drums: 4, bass: -1, chords: 0.4, lead: 0.2 },
  });
  assert.equal(plan.bpm, 210);
  assert.equal(plan.volumes.drums, 1);
  assert.equal(plan.volumes.bass, 0);
  assert.doesNotMatch(plan.title, /[<>]/);
});

test("后端只生成受控的单 stack Strudel 模式", () => {
  const plan = normalizePlan({ style: "house", key: "F minor" });
  const code = buildStrudelCode(plan);
  assert.match(code, /^\/\/ DJ OPUS/);
  assert.match(code, /setcps\(122 \/ 60 \/ 4\)/);
  assert.match(code, /stack\(/);
  assert.doesNotMatch(code, /setcpm|\.mul\(|\.add\(|fetch\(|document\.|window\./);
  assert.equal((code.match(/slider\(/g) || []).length, 6);
});

test("明确要求口琴时会保留主旋律并新增独立口琴音轨", () => {
  const plan = normalizePlan({ style: "house", key: "C minor", leadInstrument: "harmonica" });
  const code = buildStrudelCode(plan);
  assert.equal(plan.leadInstrument, "harmonica");
  assert.equal(plan.instrumentTracks[0].id, "harmonica");
  assert.match(code, /let harmonicaVol = slider\(0\.55, 0, 1, 0\.01, "口琴"\)/);
  assert.match(code, /原主旋律/);
  assert.match(code, /独立乐器轨道：口琴/);
  assert.match(code, /\.gain\(harmonicaVol\)/);
  assert.match(code, /\.s\("square"\)/);
  assert.match(code, /\.vib\(5\.5\)\.vibmod\(0\.12\)/);
  assert.equal((code.match(/slider\(/g) || []).length, 7);
});

test("删除基础分轨会同时删除音量变量和演奏层", () => {
  const plan = normalizePlan({ style: "house", key: "C minor", leadInstrument: "flute", deletedTracks: ["bass"] });
  const code = buildStrudelCode(plan);
  assert.doesNotMatch(code, /let bassVol = slider/);
  assert.doesNotMatch(code, /\.gain\(bassVol\)/);
  assert.match(code, /let fluteVol = slider/);
  assert.match(code, /\.gain\(fluteVol\)/);
});

test("静态首页和 Strudel 运行文件可以由 Node 服务访问", async () => {
  const address = await listen(staticServer);
  try {
    const [home, runtime, admin] = await Promise.all([
      fetch(`http://127.0.0.1:${address.port}/`),
      fetch(`http://127.0.0.1:${address.port}/vendor/strudel-web-1.3.0.js`),
      fetch(`http://127.0.0.1:${address.port}/admin`),
    ]);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /脉冲音格/);
    assert.equal(runtime.status, 200);
    assert.match(runtime.headers.get("content-type") || "", /javascript/);
    assert.ok((await runtime.arrayBuffer()).byteLength > 100_000);
    assert.equal(admin.status, 200);
    assert.match(await admin.text(), /数据后台/);
  } finally {
    await close(staticServer);
  }
});

test("匿名统计会区分访客、浏览量和音乐事件", async () => {
  const analytics = createAnalyticsService({
    adminPassword: "test-admin-password",
    sessionSecret: "test-session-secret",
    timeZone: "Asia/Shanghai",
  });
  const request = {
    headers: {
      host: "localhost:4173",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit Chrome/140 Safari/537.36",
      "x-forwarded-proto": "https",
    },
    socket: { remoteAddress: "127.0.0.1" },
  };
  await analytics.trackVisit({ visitorId: "visitor_1234567890abcdef", path: "/", referrer: "https://example.com/music" }, request);
  await analytics.trackVisit({ visitorId: "visitor_1234567890abcdef", path: "/", referrer: "" }, request);
  await analytics.trackVisit({ visitorId: "visitor_abcdefghijklmnop", path: "/", referrer: "" }, {
    ...request,
    headers: { ...request.headers, "user-agent": "Mozilla/5.0 (iPhone) AppleWebKit Safari/605.1" },
  });
  await analytics.trackEvent({ visitorId: "visitor_1234567890abcdef", name: "play", value: "测试作品" }, request);
  await analytics.trackEvent({ visitorId: "visitor_1234567890abcdef", name: "ai_compose", value: "深邃浩室" }, request);
  const stats = await analytics.getStats(7);
  assert.equal(stats.storage, "memory");
  assert.equal(stats.overview.totalVisitors, 2);
  assert.equal(stats.overview.totalPageviews, 3);
  assert.equal(stats.overview.onlineVisitors, 2);
  assert.equal(stats.events.play, 1);
  assert.equal(stats.events.ai_compose, 1);
  assert.ok(stats.sources.some((item) => item.label === "example.com"));
  assert.ok(stats.devices.some((item) => item.label === "手机"));

  const login = analytics.login(request, "test-admin-password");
  assert.equal(login.ok, true);
  const cookie = login.cookie.split(";", 1)[0];
  assert.equal(analytics.isAdmin({ ...request, headers: { ...request.headers, cookie } }), true);
});

test("数据后台接口需要密码并返回统计看板数据", async () => {
  const previousPassword = process.env.ADMIN_PASSWORD;
  const previousSecret = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_PASSWORD = "integration-admin-password";
  process.env.ADMIN_SESSION_SECRET = "integration-session-secret";
  const module = await import(`../server.mjs?analytics=${Date.now()}`);
  const appServer = module.server;
  const address = await listen(appServer);
  const base = `http://127.0.0.1:${address.port}`;
  const visitorId = "visitor_integration_123456";
  try {
    const visit = await fetch(`${base}/api/analytics/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 Chrome/140 Safari/537.36" },
      body: JSON.stringify({ visitorId, path: "/", referrer: "" }),
    });
    assert.equal(visit.status, 202);

    const unauthorized = await fetch(`${base}/api/admin/stats`);
    assert.equal(unauthorized.status, 401);

    const login = await fetch(`${base}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "integration-admin-password" }),
    });
    assert.equal(login.status, 200);
    const cookie = (login.headers.get("set-cookie") || "").split(";", 1)[0];
    assert.match(cookie, /^pulsegrid_admin=/);

    const statsResponse = await fetch(`${base}/api/admin/stats?days=7`, { headers: { Cookie: cookie } });
    const stats = await statsResponse.json();
    assert.equal(statsResponse.status, 200);
    assert.equal(stats.overview.totalVisitors, 1);
    assert.equal(stats.overview.totalPageviews, 1);
    assert.equal(stats.daily.length, 7);
  } finally {
    await close(appServer);
    if (previousPassword === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = previousPassword;
    if (previousSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = previousSecret;
  }
});

test("前端会注册完整 GM、波表和鼓机别名音色库", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(source, /uzu-wavetables\.json/);
  assert.match(source, /Dirt-Samples\.json/);
  assert.match(source, /mridangam\.json/);
  assert.match(source, /@strudel\/soundfonts@1\.3\.0\/gm\.mjs/);
  assert.match(source, /registerStrudelSoundfonts\(api\)/);
  assert.match(source, /await api\.aliasBank\(STRUDEL_DRUM_ALIAS_MAP_URL\)/);
  assert.match(source, /"gm_flute"/);
  assert.match(source, /"gm_harmonica"/);
  assert.match(source, /"wt_digital_bad_day"/);
});

test("声音浏览器采用两级折叠布局并可独立试听", async () => {
  const [html, source, styles] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
  ]);
  assert.match(html, /data-sound-root="library"/);
  assert.match(html, /data-sound-root="pulse"/);
  assert.match(html, />声音<\/span>/);
  assert.match(html, />音频脉冲<\/span>/);
  assert.match(html, />乐器<\/span>/);
  assert.match(html, />鼓机<\/span>/);
  assert.match(html, />合成器<\/span>/);
  assert.match(html, />波表<\/span>/);
  assert.match(source, /previewSoundFromBrowser/);
  assert.match(source, /api\.superdough/);
  assert.match(source, /registerStrudelSampleMaps/);
  assert.match(source, /api\.loadWorklets/);
  assert.match(styles, /grid-template-columns:\s*270px 190px/);
  assert.match(styles, /\.visual-panel\s*\{[^}]*grid-row:\s*1 \/ 3/);
  assert.match(styles, /\.transport\s*\{[^}]*grid-column:\s*1;/);
});

test("所有声音分轨归零时会立即关闭 Strudel 最终输出", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(source, /function mixerHasAudibleOutput\(code\)/);
  assert.match(source, /controller\?\.output\?\.destinationGain\?\.gain/);
  assert.match(source, /closeOutputIfMixerSilent\(code\)/);
  assert.match(source, /linearRampToValueAtTime\(target, now \+ 0\.008\)/);
  assert.match(source, /const shouldOpenOutput = mixerHasAudibleOutput\(code\)/);
});

test("完整 API 链可以把 MiniMax 响应转换成可播放代码", async () => {
  let receivedUrl = "";
  let receivedAuthorization = "";
  const mockMiniMax = createServer((req, res) => {
    receivedUrl = req.url || "";
    receivedAuthorization = req.headers.authorization || "";
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      choices: [{
        message: {
          content: JSON.stringify({
            title: "测试律动",
            reply: "我加入了更有推进感的鼓组和低音。",
            style: "techno",
            bpm: 132,
            key: "C minor",
            bank: "RolandTR909",
            kick: Array.from({ length: 16 }, (_, index) => index % 4 === 0 ? 1 : 0),
            snare: Array.from({ length: 16 }, (_, index) => index === 4 || index === 12 ? 1 : 0),
            hats: Array.from({ length: 16 }, (_, index) => index % 2 ? 0 : 1),
            bassRhythm: Array(16).fill(1),
            leadRhythm: Array.from({ length: 16 }, (_, index) => index % 4 === 3 ? 1 : 0),
            bassNotes: ["c2", "eb2", "g2"],
            chordNotes: ["c4", "eb4", "g4", "bb4"],
            leadNotes: ["c5", "g4", "eb5"],
            bassSynth: "sawtooth",
            chordSynth: "triangle",
            leadSynth: "pulse",
            tone: 1400,
            resonance: 12,
            room: 0.3,
            delay: 0.2,
            volumes: { drums: 0.9, bass: 0.72, chords: 0.3, lead: 0.35 },
          }),
        },
      }],
    }));
  });
  const mockAddress = await listen(mockMiniMax);
  const previous = {
    key: process.env.MINIMAX_API_KEY,
    base: process.env.MINIMAX_BASE_URL,
    model: process.env.MINIMAX_MODEL,
  };
  process.env.MINIMAX_API_KEY = "test-only-key";
  process.env.MINIMAX_BASE_URL = `http://127.0.0.1:${mockAddress.port}/v1`;
  process.env.MINIMAX_MODEL = "MiniMax-M3";

  const module = await import(`../server.mjs?integration=${Date.now()}`);
  const appServer = module.server;
  const appAddress = await listen(appServer);
  try {
    const response = await fetch(`http://127.0.0.1:${appAddress.port}/api/compose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "在现有作品里加入一段口琴主旋律" }),
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.provider, "MiniMax");
    assert.equal(body.title, "测试律动");
    assert.match(body.code, /setcps\(132 \/ 60 \/ 4\)/);
    assert.equal(body.leadInstrument, "harmonica");
    assert.equal(body.instrumentTracks.length, 1);
    assert.equal(body.instrumentTracks[0].id, "harmonica");
    assert.match(body.code, /AI 修改：在现有作品里加入一段口琴主旋律/);
    assert.match(body.code, /let harmonicaVol = slider/);
    assert.match(body.code, /独立乐器轨道：口琴/);

    const followUpResponse = await fetch(`http://127.0.0.1:${appAddress.port}/api/compose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "继续加入一条长笛旋律",
        currentCode: body.code,
        instrumentTracks: body.instrumentTracks,
        deletedTracks: ["chords"],
      }),
    });
    const followUp = await followUpResponse.json();
    assert.equal(followUpResponse.status, 200);
    assert.deepEqual(followUp.instrumentTracks.map((track) => track.id), ["harmonica", "flute"]);
    assert.match(followUp.code, /let harmonicaVol = slider/);
    assert.match(followUp.code, /let fluteVol = slider/);
    assert.match(followUp.code, /\.gain\(harmonicaVol\)/);
    assert.match(followUp.code, /\.gain\(fluteVol\)/);
    assert.doesNotMatch(followUp.code, /let chordsVol = slider/);
    assert.doesNotMatch(followUp.code, /\.gain\(chordsVol\)/);

    const afterDeleteResponse = await fetch(`http://127.0.0.1:${appAddress.port}/api/compose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "把低音加重一点",
        currentCode: followUp.code,
        instrumentTracks: followUp.instrumentTracks.filter((track) => track.id !== "flute"),
        deletedTracks: ["chords", "flute"],
      }),
    });
    const afterDelete = await afterDeleteResponse.json();
    assert.deepEqual(afterDelete.instrumentTracks.map((track) => track.id), ["harmonica"]);
    assert.ok(afterDelete.deletedTracks.includes("flute"));
    assert.doesNotMatch(afterDelete.code, /fluteVol/);

    const restoredResponse = await fetch(`http://127.0.0.1:${appAddress.port}/api/compose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "重新加入长笛",
        currentCode: afterDelete.code,
        instrumentTracks: afterDelete.instrumentTracks,
        deletedTracks: afterDelete.deletedTracks,
      }),
    });
    const restored = await restoredResponse.json();
    assert.deepEqual(restored.instrumentTracks.map((track) => track.id), ["harmonica", "flute"]);
    assert.ok(!restored.deletedTracks.includes("flute"));
    assert.match(restored.code, /let fluteVol = slider/);

    const silentProjectResponse = await fetch(`http://127.0.0.1:${appAddress.port}/api/compose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "制作一段 132 BPM 的暗黑工业铁克诺",
        currentCode: 'stack(s("~"))',
        instrumentTracks: [],
        deletedTracks: ["drums", "bass", "chords", "lead"],
      }),
    });
    const recovered = await silentProjectResponse.json();
    assert.equal(silentProjectResponse.status, 200);
    assert.deepEqual(recovered.deletedTracks.filter((track) => ["drums", "bass", "chords", "lead"].includes(track)), []);
    assert.match(recovered.code, /let drumsVol = slider/);
    assert.match(recovered.code, /\.gain\(bassVol\)/);
    assert.doesNotMatch(recovered.code, /静音占位/);
    assert.equal(receivedUrl, "/v1/chat/completions");
    assert.equal(receivedAuthorization, "Bearer test-only-key");
  } finally {
    await close(appServer);
    await close(mockMiniMax);
    if (previous.key === undefined) delete process.env.MINIMAX_API_KEY;
    else process.env.MINIMAX_API_KEY = previous.key;
    if (previous.base === undefined) delete process.env.MINIMAX_BASE_URL;
    else process.env.MINIMAX_BASE_URL = previous.base;
    if (previous.model === undefined) delete process.env.MINIMAX_MODEL;
    else process.env.MINIMAX_MODEL = previous.model;
  }
});
