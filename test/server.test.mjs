import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
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

test("静态首页和 Strudel 运行文件可以由 Node 服务访问", async () => {
  const address = await listen(staticServer);
  try {
    const [home, runtime] = await Promise.all([
      fetch(`http://127.0.0.1:${address.port}/`),
      fetch(`http://127.0.0.1:${address.port}/vendor/strudel-web-1.3.0.js`),
    ]);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /脉冲音格/);
    assert.equal(runtime.status, 200);
    assert.match(runtime.headers.get("content-type") || "", /javascript/);
    assert.ok((await runtime.arrayBuffer()).byteLength > 100_000);
  } finally {
    await close(staticServer);
  }
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
