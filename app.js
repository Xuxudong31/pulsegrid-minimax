const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const STYLE_PRESETS = {
  house: {
    id: "house",
    label: "深邃浩室",
    bpm: 122,
    key: "F minor",
    swing: 54,
    bank: "RolandTR909",
    drumLabel: "909 / 俱乐部",
    bassLabel: "次低音 / 锯齿波",
    chordLabel: "小七和弦 / 铺底",
    leadLabel: "拨弦 / 延迟",
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hats: [2, 6, 10, 14],
    bass: [0, 3, 6, 8, 11, 14],
    lead: [2, 5, 10, 13],
    bassNotes: [0, 0, 3, 5, 7, 3],
    leadNotes: [12, 15, 19, 22],
    synth: "sawtooth",
  },
  techno: {
    id: "techno",
    label: "黑暗铁克诺",
    bpm: 132,
    key: "C minor",
    swing: 51,
    bank: "RolandTR909",
    drumLabel: "909 / 强驱动",
    bassLabel: "酸性 / 单声道",
    chordLabel: "暗色 / 短促和弦",
    leadLabel: "噪声 / 脉冲波",
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hats: [2, 6, 10, 14, 15],
    bass: [0, 3, 5, 7, 8, 11, 14],
    lead: [3, 7, 11, 15],
    bassNotes: [0, 0, 3, 0, -2, 3, 5],
    leadNotes: [12, 10, 15, 13],
    synth: "sawtooth",
  },
  lofi: {
    id: "lofi",
    label: "雨夜低保真",
    bpm: 84,
    key: "A minor",
    swing: 62,
    bank: "AkaiLinn",
    drumLabel: "尘埃 / 磁带",
    bassLabel: "温暖 / 圆润",
    chordLabel: "小九和弦 / 键盘",
    leadLabel: "铃声 / 黑胶",
    kick: [0, 7, 10],
    snare: [4, 12],
    hats: [2, 6, 10, 14],
    bass: [0, 4, 7, 10, 14],
    lead: [3, 9, 15],
    bassNotes: [0, 3, 5, -2, 0],
    leadNotes: [12, 15, 17, 10],
    synth: "triangle",
  },
  ambient: {
    id: "ambient",
    label: "深空氛围",
    bpm: 76,
    key: "C minor",
    swing: 50,
    bank: "RolandTR808",
    drumLabel: "轻柔 / 空间",
    bassLabel: "次低音 / 持续音",
    chordLabel: "宽广 / 云层",
    leadLabel: "玻璃质感 / 回声",
    kick: [0, 10],
    snare: [12],
    hats: [6, 14],
    bass: [0, 8],
    lead: [3, 11],
    bassNotes: [0, -2, 3, 5],
    leadNotes: [12, 19, 15, 22],
    synth: "sine",
  },
  synthwave: {
    id: "synthwave",
    label: "霓虹合成器浪潮",
    bpm: 108,
    key: "F minor",
    swing: 50,
    bank: "AkaiLinn",
    drumLabel: "林鼓机 / 门控",
    bassLabel: "模拟 / 脉冲波",
    chordLabel: "朱诺合成器 / 宽广",
    leadLabel: "霓虹 / 琶音",
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hats: [2, 6, 10, 14],
    bass: [0, 2, 4, 6, 8, 10, 12, 14],
    lead: [1, 3, 5, 7, 9, 11, 13, 15],
    bassNotes: [0, 0, 3, 7, 5, 3, -2, 3],
    leadNotes: [12, 15, 19, 22, 19, 15, 17, 24],
    synth: "sawtooth",
  },
  trance: {
    id: "trance",
    label: "欢欣迷幻舞曲",
    bpm: 138,
    key: "A minor",
    swing: 50,
    bank: "RolandTR909",
    drumLabel: "909 / 高峰",
    bassLabel: "滚动 / 锯齿波",
    chordLabel: "超级锯齿波",
    leadLabel: "拨弦 / 上扬",
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hats: [2, 6, 10, 14],
    bass: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15],
    lead: [0, 3, 6, 8, 11, 14],
    bassNotes: [0, 0, 3, 0, 5, 3, -2, 0],
    leadNotes: [12, 15, 19, 17, 15, 22],
    synth: "sawtooth",
  },
  dnb: {
    id: "dnb",
    label: "液态鼓打贝斯",
    bpm: 174,
    key: "D minor",
    swing: 53,
    bank: "RolandTR707",
    drumLabel: "碎拍 / 174",
    bassLabel: "液态 / 次低音",
    chordLabel: "空气感 / 小九和弦",
    leadLabel: "玻璃质感 / 流动",
    kick: [0, 3, 8, 10],
    snare: [4, 12],
    hats: [0, 2, 4, 6, 8, 10, 12, 14, 15],
    bass: [0, 3, 6, 8, 11, 14],
    lead: [2, 6, 9, 13],
    bassNotes: [0, 0, 3, -2, 5, 3],
    leadNotes: [12, 15, 17, 22, 19],
    synth: "sine",
  },
  trap: {
    id: "trap",
    label: "暗夜陷阱音乐",
    bpm: 142,
    key: "C minor",
    swing: 58,
    bank: "RolandTR808",
    drumLabel: "808 / 半拍",
    bassLabel: "808 / 滑音",
    chordLabel: "暗色 / 铃声",
    leadLabel: "拨弦 / 空间",
    kick: [0, 6, 10, 14],
    snare: [4, 12],
    hats: [0, 2, 4, 6, 8, 10, 11, 12, 14, 15],
    bass: [0, 6, 10, 14],
    lead: [2, 7, 11, 15],
    bassNotes: [0, -2, 3, 0],
    leadNotes: [12, 15, 10, 19],
    synth: "square",
  },
};

const VOLUME_DEFAULTS = { drums: 0.82, bass: 0.62, chords: 0.45, lead: 0.38 };
const MASTER_VOLUME_DEFAULT = 0.78;
const INSTRUMENT_TRACK_META = Object.freeze({
  harmonica: { label: "口琴", detail: "簧片 / 独立旋律" },
  flute: { label: "长笛", detail: "气息 / 独立旋律" },
  sax: { label: "萨克斯", detail: "暖管 / 独立旋律" },
  sitar: { label: "西塔琴", detail: "拨弦 / 独立旋律" },
  piano: { label: "钢琴", detail: "琴键 / 独立旋律" },
  guitar: { label: "吉他", detail: "拨弦 / 独立旋律" },
  violin: { label: "小提琴", detail: "弓弦 / 独立旋律" },
  cello: { label: "大提琴", detail: "低弦 / 独立旋律" },
  trumpet: { label: "小号", detail: "铜管 / 独立旋律" },
  clarinet: { label: "单簧管", detail: "木管 / 独立旋律" },
  marimba: { label: "马林巴", detail: "木质 / 独立旋律" },
});
const TRACK_COLOR_CLASSES = ["coral", "violet", "mint", "amber"];
const BASE_TRACK_IDS = ["drums", "bass", "chords", "lead"];
const TRACK_LABEL_TRANSLATIONS = Object.freeze({
  kick: "底鼓",
  bd: "底鼓",
  snare: "军鼓",
  sd: "军鼓",
  clap: "拍手",
  hat: "踩镲",
  hats: "踩镲",
  hh: "踩镲",
  bass: "贝斯",
  lead: "主旋律",
  pad: "氛围铺底",
  atmosphere: "氛围铺底",
  fx: "效果",
  effects: "效果",
  riff: "连复段",
  rockriffj: "摇滚连复段",
});
const MAX_CLIENT_INSTRUMENT_TRACKS = 24;
const LEGACY_PROJECT_STORAGE_KEY = "pulsegrid.project.v2";
const PROJECT_LIBRARY_STORAGE_KEY = "pulsegrid.projects.v1";
const ACTIVE_PROJECT_STORAGE_KEY = "pulsegrid.projects.active.v1";
const MAX_SAVED_PROJECTS = 50;
const STRUDEL_SAMPLE_MAPS = [
  {
    url: "https://strudel.b-cdn.net/piano.json",
    baseUrl: "https://strudel.b-cdn.net/piano/",
  },
  {
    url: "https://strudel.b-cdn.net/vcsl.json",
    baseUrl: "https://strudel.b-cdn.net/VCSL/",
  },
  {
    url: "https://strudel.b-cdn.net/tidal-drum-machines.json",
    baseUrl: "https://strudel.b-cdn.net/tidal-drum-machines/machines/",
    tag: "drum-machines",
  },
  {
    url: "https://strudel.b-cdn.net/uzu-drumkit.json",
    baseUrl: "https://strudel.b-cdn.net/uzu-drumkit/",
    tag: "drum-machines",
  },
  {
    url: "https://strudel.b-cdn.net/mridangam.json",
    baseUrl: "https://strudel.b-cdn.net/mrid/",
    tag: "drum-machines",
  },
  {
    url: "https://strudel.b-cdn.net/Dirt-Samples.json",
    baseUrl: "https://strudel.b-cdn.net/Dirt-Samples/",
  },
  {
    url: "https://strudel.b-cdn.net/uzu-wavetables.json",
    baseUrl: "https://strudel.b-cdn.net/uzu-wavetables/",
  },
];
const STRUDEL_OPTIONAL_SAMPLE_MAPS = [
  "https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json",
];
const STRUDEL_DRUM_ALIAS_MAP_URL = "https://strudel.b-cdn.net/tidal-drum-machines-alias.json";
const STRUDEL_GM_MAP_URLS = [
  "https://unpkg.com/@strudel/soundfonts@1.3.0/gm.mjs",
  "https://cdn.jsdelivr.net/npm/@strudel/soundfonts@1.3.0/gm.mjs",
];
const STRUDEL_SOUNDFONT_BASE_URL = "https://felixroos.github.io/webaudiofontdata/sound";
const ROOT_MIDI = { C: 36, "C#": 37, Db: 37, D: 38, "D#": 39, Eb: 39, E: 40, F: 41, "F#": 42, Gb: 42, G: 43, "G#": 44, Ab: 44, A: 45, "A#": 46, Bb: 46, B: 47 };
const NOTE_NAMES = ["c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b"];

let composition = createComposition("deep house");
let scopeMode = "wave";
let toastTimer;
let isGenerating = false;
let projectLibrary = [];
let currentProjectId = null;

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function detectStyle(prompt) {
  const text = prompt.toLowerCase();
  const rules = [
    ["dnb", /(drum\s*(?:&|and)\s*bass|d\s*&\s*b|dnb|liquid|液态|鼓打贝斯)/],
    ["synthwave", /(synthwave|retrowave|synth wave|合成器浪潮|蒸汽波|复古霓虹|霓虹)/],
    ["techno", /(techno|铁克诺|工业|仓库|机械|暗黑科技)/],
    ["trance", /(trance|迷幻舞曲|出神|uplifting|psytrance)/],
    ["lofi", /(lo[-\s]?fi|低保真|卧室|慵懒|黑胶|雨夜|学习)/],
    ["ambient", /(ambient|氛围|冥想|空灵|漂浮|无人声)/],
    ["trap", /(trap|陷阱|嘻哈|hip\s*hop|808|说唱)/],
    ["house", /(house|浩室|club|俱乐部|deep)/],
  ];
  return rules.find(([, regex]) => regex.test(text))?.[0] || "house";
}

function parseKey(prompt, fallback) {
  const western = prompt.match(/(?:^|\s)([A-Ga-g])\s*([#b]?)(?:\s*)(minor|major|min|maj|m)?(?=\s|,|，|。|$)/i);
  const chinese = prompt.match(/([A-Ga-g])\s*([#b]?)(小调|大调)/);
  const match = chinese || western;
  if (!match) return fallback;
  const root = match[1].toUpperCase() + (match[2] || "");
  const quality = /major|maj|大调/i.test(match[3] || "") ? "major" : "minor";
  return `${root} ${quality}`;
}

function createComposition(prompt) {
  const text = String(prompt || "");
  const preset = STYLE_PRESETS[detectStyle(text)];
  const bpmMatch = text.match(/\b(6\d|7\d|8\d|9\d|1\d{2}|2[0-1]\d)\s*(?:bpm|拍)?\b/i);
  let bpm = bpmMatch ? Number(bpmMatch[1]) : preset.bpm;
  bpm = Math.max(60, Math.min(210, bpm));

  let energy = 0.64;
  let brightness = 0.52;
  let complexity = 0.58;
  if (/(暗|dark|深沉|压迫|阴冷)/i.test(text)) brightness = 0.24;
  if (/(明亮|bright|闪耀|阳光|uplifting)/i.test(text)) brightness = 0.8;
  if (/(猛烈|hard|炸|高能|冲劲|激烈|energetic|peak)/i.test(text)) energy = 0.9;
  if (/(轻柔|chill|舒缓|安静|慵懒|soft)/i.test(text)) energy = 0.36;
  if (/(复杂|丰富|细碎|complex)/i.test(text)) complexity = 0.86;
  if (/(简单|minimal|极简|干净)/i.test(text)) complexity = 0.3;

  const volumes = { ...VOLUME_DEFAULTS };
  if (preset.id === "ambient") Object.assign(volumes, { drums: 0.38, bass: 0.5, chords: 0.62, lead: 0.3 });
  if (preset.id === "dnb") Object.assign(volumes, { drums: 0.86, bass: 0.7, chords: 0.36, lead: 0.32 });
  if (preset.id === "techno") Object.assign(volumes, { drums: 0.88, bass: 0.68, chords: 0.28, lead: 0.32 });
  if (/(不要鼓|无鼓|no drums)/i.test(text)) volumes.drums = 0;
  if (/(不要旋律|无旋律|no lead)/i.test(text)) volumes.lead = 0;
  if (/(低频更强|重低音|more bass|大贝斯)/i.test(text)) volumes.bass = 0.82;

  const names = {
    house: "午夜回路",
    techno: "钢铁教堂",
    lofi: "磁带雨声",
    ambient: "缓慢轨道",
    synthwave: "霓虹地平线",
    trance: "余晖",
    dnb: "液态电流",
    trap: "夜曲 808",
  };

  return {
    ...preset,
    bpm,
    key: parseKey(text, preset.key),
    energy,
    brightness,
    complexity,
    tone: Math.round(650 + brightness * 3600),
    bassSynth: preset.synth,
    chordSynth: preset.id === "trance" ? "sawtooth" : "triangle",
    leadSynth: preset.id === "synthwave" ? "square" : "sawtooth",
    chordEnabled: true,
    seed: hashString(text || preset.label),
    volumes,
    muted: { drums: volumes.drums === 0, bass: false, chords: false, lead: volumes.lead === 0 },
    instrumentTracks: [],
    deletedTracks: [],
    projectName: names[preset.id],
    prompt: text,
  };
}

function keyRoot(comp = composition) {
  const root = comp.key.split(" ")[0];
  return ROOT_MIDI[root] ?? ROOT_MIDI.C;
}

function localizeKey(key) {
  const [root = "C", quality = "minor"] = String(key || "").split(/\s+/);
  return `${root} ${quality === "major" ? "大调" : "小调"}`;
}

function midiName(midi) {
  const pitch = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${pitch}${octave}`;
}

function makeMiniPattern(steps, token, total = 16) {
  return Array.from({ length: total }, (_, index) => (steps.includes(index) ? token : "~")).join(" ");
}

function buildPatternCode(comp) {
  const root = keyRoot(comp);
  const bassNotes = comp.bassNotes.map((interval) => midiName(root + interval)).join(" ");
  const leadNotes = comp.leadNotes.map((interval) => midiName(root + interval)).join(" ");
  const kick = makeMiniPattern(comp.kick, "bd");
  const snare = makeMiniPattern(comp.snare, "cp");
  const hats = makeMiniPattern(comp.hats, "hh");
  const bassStruct = makeMiniPattern(comp.bass, "x");
  const leadStruct = makeMiniPattern(comp.lead, "x");
  const chordRoot = midiName(root + 12);
  const chordThird = midiName(root + (comp.key.includes("major") ? 16 : 15));
  const chordFifth = midiName(root + 19);
  const chordSeventh = midiName(root + (comp.key.includes("major") ? 23 : 22));
  const cutoff = Math.round(comp.tone ?? (650 + comp.brightness * 3600));
  const room = comp.id === "ambient" ? 0.82 : comp.id === "techno" ? 0.25 : 0.5;

  const code = [
    `// 脉冲音格 / ${comp.label} / ${localizeKey(comp.key)}`,
    `setcps(${comp.bpm} / 60 / 4)`,
    "",
    `let masterVol = slider(${MASTER_VOLUME_DEFAULT.toFixed(2)}, 0, 1, 0.01, "总音量")`,
    `let drumsVol = slider(${comp.volumes.drums.toFixed(2)}, 0, 1, 0.01, "鼓组")`,
    `let bassVol = slider(${comp.volumes.bass.toFixed(2)}, 0, 1, 0.01, "贝斯")`,
    `let chordsVol = slider(${comp.volumes.chords.toFixed(2)}, 0, 1, 0.01, "和弦")`,
    `let leadVol = slider(${comp.volumes.lead.toFixed(2)}, 0, 1, 0.01, "主旋律")`,
    `let tone = slider(${cutoff}, 200, 6000, 10, "音色明暗")`,
    "",
    "stack(",
    `  s("${kick}")`,
    `    .bank("${comp.bank}").gain(drumsVol),`,
    `  s("${snare}")`,
    `    .bank("${comp.bank}").gain(drumsVol),`,
    `  s("${hats}")`,
    `    .bank("${comp.bank}").gain(drumsVol),`,
    `  note("<${bassNotes}>")`,
    `    .s("${comp.bassSynth || comp.synth}").struct("${bassStruct}")`,
    `    .attack(0.01).decay(0.18).sustain(0.12).release(0.12)`,
    `    .cutoff(tone).resonance(${comp.id === "techno" ? 14 : 6}).gain(bassVol),`,
    `  note("[${chordRoot},${chordThird},${chordFifth},${chordSeventh}]")`,
    `    .s("${comp.chordSynth || "triangle"}").slow(4)`,
    `    .attack(0.35).release(1.4)`,
    `    .cutoff(${Math.round(cutoff * 0.72)}).room(${room}).gain(chordsVol),`,
    `  note("<${leadNotes}>")`,
    `    .s("${comp.leadSynth || "sawtooth"}").struct("${leadStruct}")`,
    `    .attack(0.01).decay(0.16).sustain(0.06).release(0.2)`,
    `    .cutoff(${cutoff}).delay(0.35).room(${Math.min(0.78, room + 0.12)}).gain(leadVol)`,
    ").gain(masterVol)",
  ].join("\n");
  return normalizeDeletedTracks(comp.deletedTracks).reduce((source, track) => removeTrackFromCode(source, track), code);
}

function lineNumberAt(code, index) {
  return code.slice(0, Math.max(0, index)).split("\n").length;
}

function findDelimiterIssue(code) {
  const pairs = { "(": ")", "[": "]", "{": "}" };
  const openings = Object.keys(pairs);
  const closings = Object.values(pairs);
  const stack = [];
  let quote = "";
  let escaped = false;
  let lineComment = false;

  for (let index = 0; index < code.length; index += 1) {
    const char = code[index];
    const next = code[index + 1];
    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (openings.includes(char)) stack.push({ char, index });
    else if (closings.includes(char)) {
      const opening = stack.pop();
      if (!opening || pairs[opening.char] !== char) {
        return { line: lineNumberAt(code, index), message: `意外的 ${char}` };
      }
    }
  }

  if (quote) return { line: lineNumberAt(code, code.length), message: "字符串没有闭合" };
  if (stack.length) {
    const opening = stack.at(-1);
    return { line: lineNumberAt(code, opening.index), message: `${opening.char} 没有闭合` };
  }
  return null;
}

function parseTempo(code) {
  const cpsMatch = code.match(/\bsetcps\s*\(\s*([^\n)]+)\s*\)/);
  const cpmMatch = code.match(/\bsetcpm\s*\(\s*([^\n)]+)\s*\)/) || code.match(/\.cpm\s*\(\s*([^\n)]+)\s*\)/);
  const match = cpsMatch || cpmMatch;
  if (!match) return null;
  const expression = match[1].replace(/\s+/g, "");
  const bpmFromCps = expression.match(/^(\d+(?:\.\d+)?)\/60\/4$/);
  const bpmFromCpm = expression.match(/^(\d+(?:\.\d+)?)\/4$/);
  const direct = expression.match(/^(\d+(?:\.\d+)?)$/);
  const bpm = bpmFromCps
    ? Number(bpmFromCps[1])
    : bpmFromCpm
      ? Number(bpmFromCpm[1])
      : direct
        ? Number(direct[1]) * (cpsMatch ? 240 : 4)
        : NaN;
  if (!Number.isFinite(bpm) || bpm < 20 || bpm > 400) return null;
  return Math.max(60, Math.min(210, Math.round(bpm)));
}

function validatePatternCode(code) {
  const errors = [];
  const delimiterIssue = findDelimiterIssue(code);
  if (delimiterIssue) errors.push(delimiterIssue);
  const bpm = parseTempo(code);
  if (!/\b(?:s|sound|note|n|stack)\s*\(/.test(code) && !/(?:^|\n)\s*\$\s*:/.test(code)) {
    errors.push({ line: 1, message: "没有找到可播放的 sound()、s()、note() 或 stack() 模式" });
  }
  const emojiMatch = code.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
  if (emojiMatch) errors.push({ line: lineNumberAt(code, emojiMatch.index), message: "音乐模式代码中不能包含表情符号" });

  const sliderNames = [...code.matchAll(/\b(?:let|const)\s+(\w+)\s*=\s*slider\s*\(/g)].map((match) => match[1]);
  sliderNames.forEach((name) => {
    const unsafe = new RegExp(`\\b${name}\\s*\\.\\s*(?:mul|add)\\s*\\(`).exec(code);
    if (unsafe) errors.push({ line: lineNumberAt(code, unsafe.index), message: `${name} 不能直接链式调用 mul() 或 add()` });
  });
  return { bpm, errors };
}

function extractCallBody(code, name) {
  const match = new RegExp(`\\b${name}\\s*\\(`).exec(code);
  if (!match) return null;
  const openIndex = code.indexOf("(", match.index);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = openIndex; index < code.length; index += 1) {
    const char = code[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "(") depth += 1;
    if (char === ")") {
      depth -= 1;
      if (depth === 0) return code.slice(openIndex + 1, index);
    }
  }
  return null;
}

function splitTopLevelExpressions(body) {
  const expressions = [];
  let start = 0;
  let round = 0;
  let square = 0;
  let curly = 0;
  let quote = "";
  let escaped = false;
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'" || char === "`") quote = char;
    else if (char === "(") round += 1;
    else if (char === ")") round -= 1;
    else if (char === "[") square += 1;
    else if (char === "]") square -= 1;
    else if (char === "{") curly += 1;
    else if (char === "}") curly -= 1;
    else if (char === "," && round === 0 && square === 0 && curly === 0) {
      expressions.push(body.slice(start, index).trim());
      start = index + 1;
    }
  }
  const last = body.slice(start).trim();
  if (last) expressions.push(last);
  return expressions;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isSafeTrackId(value) {
  const trackId = String(value || "").trim();
  return trackId !== "master" && /^[A-Za-z_][A-Za-z0-9_]{0,63}$/.test(trackId);
}

function localizeTrackLabel(label, trackId) {
  const source = String(label || "").trim().slice(0, 32);
  const sourceKey = source.toLowerCase().replace(/[\s_-]+/g, "");
  const idKey = String(trackId || "").toLowerCase().replace(/[\s_-]+/g, "");
  return TRACK_LABEL_TRANSLATIONS[sourceKey]
    || TRACK_LABEL_TRANSLATIONS[idKey]
    || source
    || String(trackId || "自定义音轨").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function customTrackDetail(trackId) {
  const key = String(trackId || "").toLowerCase();
  if (/kick|snare|clap|hat|perc|drum|bd|sd|hh/.test(key)) return "鼓组 / 独立分轨";
  if (/pad|atmo|ambient/.test(key)) return "氛围 / 独立分轨";
  if (/fx|effect|noise|rise|impact/.test(key)) return "效果 / 独立分轨";
  if (/bass|sub/.test(key)) return "低频 / 独立分轨";
  return "自定义 / 独立分轨";
}

function normalizeDeletedTracks(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((track) => String(track || "").trim()).filter(isSafeTrackId))];
}

function findCallRange(code, name) {
  const match = new RegExp(`\\b${name}\\s*\\(`).exec(code);
  if (!match) return null;
  const openIndex = code.indexOf("(", match.index);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = openIndex; index < code.length; index += 1) {
    const char = code[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "(") depth += 1;
    if (char === ")") {
      depth -= 1;
      if (depth === 0) return { openIndex, closeIndex: index, body: code.slice(openIndex + 1, index) };
    }
  }
  return null;
}

function formatStackExpression(expression) {
  return expression.trim().split("\n").map((line) => {
    const content = line.trimStart();
    return `${content.startsWith(".") ? "    " : "  "}${content}`;
  }).join("\n");
}

function removeTrackFromCode(source, trackId) {
  const safeTrack = isSafeTrackId(trackId) ? trackId : "";
  if (!safeTrack) return source;
  const variable = getTrackVolumeVariable(safeTrack);
  const safeVariable = escapeRegExp(variable);
  let code = String(source || "").replace(
    new RegExp(`^\\s*(?:let|const)\\s+${safeVariable}\\s*=\\s*slider\\([^\\n]*\\)\\s*;?\\s*\\r?\\n?`, "m"),
    "",
  );
  const range = findCallRange(code, "stack");
  if (!range) return code.replace(/\n{3,}/g, "\n\n").trim();
  const gainPattern = new RegExp(`\\.gain\\(\\s*${safeVariable}\\s*\\)`);
  const expressions = splitTopLevelExpressions(range.body).filter((expression) => !gainPattern.test(expression));
  const body = expressions.length
    ? expressions.map(formatStackExpression).join(",\n")
    : '  s("~") // 静音占位';
  code = `${code.slice(0, range.openIndex + 1)}\n${body}\n${code.slice(range.closeIndex)}`;
  return code.replace(/\n{3,}/g, "\n\n").trim();
}

function deleteCompositionTrack(trackId) {
  const card = $(`.track-card[data-track="${trackId}"]`);
  if (!card) return;
  const label = card.querySelector(".track-name strong")?.textContent || "声音";
  const editor = $("#codeEditor");
  editor.value = removeTrackFromCode(editor.value, trackId);
  composition.deletedTracks = normalizeDeletedTracks([...(composition.deletedTracks || []), trackId]);

  if (BASE_TRACK_IDS.includes(trackId)) {
    if (trackId === "drums") {
      composition.kick = [];
      composition.snare = [];
      composition.hats = [];
    } else if (trackId === "chords") {
      composition.chordEnabled = false;
    } else if (Array.isArray(composition[trackId])) {
      composition[trackId] = [];
    }
    composition.muted[trackId] = true;
  } else {
    composition.instrumentTracks = composition.instrumentTracks.filter((track) => track.id !== trackId);
  }

  updateCompositionUI({ preserveCode: true });
  setEditorDirty(true);
  setEditorStatus(`${label}分轨及对应代码已删除`, "pending");
  scheduleMixerRerun();
  showToast(`${label}已从声音分轨和主作品代码中删除`);
}

function tokenizeMiniPattern(pattern) {
  return pattern.match(/\[[^\]]+\]|<[^>]+>|[^\s]+/g) || [];
}

function tokenMatchesFamily(token, family) {
  const words = token.toLowerCase().match(/[a-z][a-z0-9_]*/g) || [];
  if (!family) return words.length > 0 && !words.every((word) => word === "x" ? false : word === "~");
  if (family === "kick") return words.some((word) => word === "gabba" || word === "sbd" || word.endsWith("bd"));
  if (family === "snare") return words.some((word) => word === "snare" || word.endsWith("sd") || word.endsWith("cp"));
  if (family === "hats") return words.some((word) => word === "hat" || word.endsWith("hh") || word.endsWith("oh"));
  return false;
}

function miniPatternToSteps(pattern, family = null, total = 16) {
  const tokens = tokenizeMiniPattern(pattern);
  if (!tokens.length) return [];
  const steps = new Set();
  tokens.forEach((token, index) => {
    if (/^(?:~|-)$/i.test(token) || !tokenMatchesFamily(token, family)) return;
    const repeatMatch = token.match(/(?:\*|!)(\d+)/);
    const repeat = Math.max(1, Math.min(16, repeatMatch ? Number(repeatMatch[1]) : 1));
    for (let substep = 0; substep < repeat; substep += 1) {
      steps.add(Math.floor(((index + substep / repeat) / tokens.length) * total) % total);
    }
  });
  return [...steps].sort((a, b) => a - b);
}

function noteNameToMidi(name) {
  const match = String(name).match(/^([a-gA-G])(#|b|s)?(-?\d+)$/);
  if (!match) return null;
  const semitones = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  const accidental = match[2] === "#" || match[2] === "s" ? 1 : match[2] === "b" ? -1 : 0;
  return (Number(match[3]) + 1) * 12 + semitones[match[1].toLowerCase()] + accidental;
}

function parseNoteIntervals(pattern, rootMidi, role, quality) {
  const noteTokens = pattern.match(/[a-gA-G](?:#|b|s)?-?\d+/g) || [];
  if (noteTokens.length) return noteTokens.map(noteNameToMidi).filter(Number.isFinite).map((midi) => midi - rootMidi);

  const degreeTokens = pattern.match(/(?:^|[\s<>,\[])(-?\d+)(?=$|[\s<>,\]])/g) || [];
  const degrees = degreeTokens.map((token) => Number(token.match(/-?\d+/)?.[0])).filter(Number.isFinite);
  if (!degrees.length) return [];
  const scale = quality === "major" ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
  const baseOctave = role === "lead" ? 12 : 0;
  return degrees.map((degree) => {
    const scaleIndex = ((degree % 7) + 7) % 7;
    return baseOctave + scale[scaleIndex] + Math.floor(degree / 7) * 12;
  });
}

function expressionStringArgument(expression, callName) {
  const match = new RegExp(`(?:^|\\.)${callName}\\(\\s*["']([^"']*)["']\\s*\\)`).exec(expression);
  return match?.[1] ?? null;
}

function sliderDefinitionsFromCode(code) {
  const definitions = {};
  const declaration = /\b(?:let|const)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*slider\s*\(([^)\r\n]*)\)/g;
  for (const match of String(code || "").matchAll(declaration)) {
    const args = splitTopLevelExpressions(match[2]);
    const value = Number(args[0]);
    if (!Number.isFinite(value)) continue;
    const labelArgument = String(args[4] || "").trim();
    const labelMatch = labelArgument.match(/^(["'`])([\s\S]*)\1$/);
    definitions[match[1]] = {
      variable: match[1],
      value,
      label: labelMatch ? labelMatch[2].replace(/\\([\\"'`])/g, "$1") : "",
      index: match.index,
    };
  }
  return definitions;
}

function sliderValuesFromCode(code) {
  return Object.fromEntries(
    Object.values(sliderDefinitionsFromCode(code)).map((definition) => [definition.variable, definition.value]),
  );
}

function compileCodeWithMixerValues(code) {
  const sliders = sliderValuesFromCode(code);
  return Object.entries(sliders).reduce((compiled, [variable, value]) => {
    if (!variable.endsWith("Vol") || !Number.isFinite(value)) return compiled;
    const safeVariable = escapeRegExp(variable);
    const volume = Math.max(0, Math.min(1, value));
    const literal = String(Math.round(volume * 10000) / 10000);
    return compiled.replace(
      new RegExp(`\\.gain\\(\\s*${safeVariable}\\s*\\)`, "g"),
      `.gain(${literal})`,
    );
  }, String(code || ""));
}

function inferInstrumentTrackFromCode(trackId, definition, code, existingTrack = null) {
  const variable = definition?.variable || `${trackId}Vol`;
  const volume = Number(definition?.value);
  const safeVariable = escapeRegExp(variable);
  const stackBody = extractCallBody(code, "stack") || "";
  const expression = splitTopLevelExpressions(stackBody)
    .find((item) => new RegExp(`\\.gain\\(\\s*${safeVariable}\\s*\\)`).test(item));
  const notePattern = expression ? expressionStringArgument(expression, "note") : "";
  const samplePattern = expression ? expressionStringArgument(expression, "s") : "";
  const notes = notePattern?.match(/[a-gA-G](?:#|b|s)?-?\d+/g)?.slice(0, 8) || existingTrack?.notes || [];
  const struct = expression ? expressionStringArgument(expression, "struct") : null;
  const steps = struct === null
    ? (samplePattern ? miniPatternToSteps(samplePattern) : expression ? [0] : existingTrack?.steps || [])
    : miniPatternToSteps(struct);
  const rhythm = Array.from({ length: 16 }, (_, index) => steps.includes(index) ? 1 : 0);
  const knownMeta = INSTRUMENT_TRACK_META[String(trackId).toLowerCase()];
  const label = localizeTrackLabel(definition?.label || existingTrack?.label || knownMeta?.label, trackId);
  return {
    id: trackId,
    variable,
    instrument: existingTrack?.instrument || String(trackId).toLowerCase(),
    label,
    detail: existingTrack?.detail || knownMeta?.detail || customTrackDetail(trackId),
    notes,
    rhythm,
    steps,
    volume: Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : 0.55)),
    muted: volume === 0,
  };
}

function parsePatternCode(code, currentComposition = composition) {
  const validation = validatePatternCode(code);
  if (validation.errors.length) return { errors: validation.errors, composition: null };

  const stackBody = extractCallBody(code, "stack");
  if (stackBody === null) return { errors: [], composition: null };
  const expressions = splitTopLevelExpressions(stackBody || "");
  const sampleExpressions = expressions
    .map((expression) => ({ expression, pattern: expressionStringArgument(expression, "s") }))
    .filter((item) => item.pattern !== null && /^s\s*\(/.test(item.expression));
  const noteExpressions = expressions
    .map((expression) => ({ expression, pattern: expressionStringArgument(expression, "note") }))
    .filter((item) => item.pattern !== null && /^note\s*\(/.test(item.expression));
  if (!sampleExpressions.length && !noteExpressions.length) {
    return { errors: [{ line: 1, message: "stack() 中没有可播放的 s() 或 note()" }], composition: null };
  }

  const next = {
    ...currentComposition,
    bpm: validation.bpm,
    volumes: { ...currentComposition.volumes },
    muted: { ...currentComposition.muted },
  };
  const keyMatch = code.match(/\.scale\(\s*"([A-Ga-g])([#b]?):(minor|major)"\s*\)/);
  if (keyMatch) next.key = `${keyMatch[1].toUpperCase()}${keyMatch[2] || ""} ${keyMatch[3]}`;

  const sliders = sliderValuesFromCode(code);
  const volumeVariables = { drums: "drumsVol", bass: "bassVol", chords: "chordsVol", lead: "leadVol" };
  Object.entries(volumeVariables).forEach(([track, variable]) => {
    if (!Number.isFinite(sliders[variable])) return;
    next.volumes[track] = Math.max(0, Math.min(1, sliders[variable]));
    next.muted[track] = next.volumes[track] === 0;
  });
  if (Number.isFinite(sliders.tone)) {
    next.tone = Math.max(120, Math.min(12000, sliders.tone));
    next.brightness = Math.max(0, Math.min(1, (next.tone - 650) / 3600));
  }

  next.kick = [];
  next.snare = [];
  next.hats = [];
  if (sampleExpressions.length) {
    next.kick = [...new Set(sampleExpressions.flatMap(({ pattern }) => miniPatternToSteps(pattern, "kick")))].sort((a, b) => a - b);
    next.snare = [...new Set(sampleExpressions.flatMap(({ pattern }) => miniPatternToSteps(pattern, "snare")))].sort((a, b) => a - b);
    next.hats = [...new Set(sampleExpressions.flatMap(({ pattern }) => miniPatternToSteps(pattern, "hats")))].sort((a, b) => a - b);
    const bank = sampleExpressions.map(({ expression }) => expressionStringArgument(expression, "bank")).find(Boolean);
    if (bank) next.bank = bank;
  }

  const chordExpression = noteExpressions.find(({ pattern }) => pattern.trim().startsWith("["));
  const melodicExpressions = noteExpressions.filter((item) => item !== chordExpression);
  let bassExpression = melodicExpressions.find(({ expression }) => /\.gain\(\s*bassVol\s*\)/.test(expression));
  let leadExpression = melodicExpressions.find(({ expression }) => /\.gain\(\s*leadVol\s*\)/.test(expression));
  const unassigned = melodicExpressions.filter((item) => item !== bassExpression && item !== leadExpression);
  if (!bassExpression && !leadExpression) {
    bassExpression = unassigned[0];
    if (unassigned.length > 1) leadExpression = unassigned.at(-1);
  } else {
    if (!bassExpression && unassigned.length) bassExpression = unassigned[0];
    if (!leadExpression && unassigned.length > 1) leadExpression = unassigned.at(-1);
  }
  const root = keyRoot(next);
  const quality = next.key.includes("major") ? "major" : "minor";

  next.bass = [];
  next.lead = [];
  next.chordEnabled = Boolean(chordExpression);
  if (bassExpression) {
    const notes = parseNoteIntervals(bassExpression.pattern, root, "bass", quality);
    if (notes.length) next.bassNotes = notes;
    const struct = expressionStringArgument(bassExpression.expression, "struct");
    next.bass = struct === null ? [0] : miniPatternToSteps(struct);
    next.bassSynth = expressionStringArgument(bassExpression.expression, "s") || next.bassSynth;
  }
  if (leadExpression) {
    const notes = parseNoteIntervals(leadExpression.pattern, root, "lead", quality);
    if (notes.length) next.leadNotes = notes;
    const struct = expressionStringArgument(leadExpression.expression, "struct");
    next.lead = struct === null ? [0] : miniPatternToSteps(struct);
    next.leadSynth = expressionStringArgument(leadExpression.expression, "s") || next.leadSynth;
  }
  if (chordExpression) next.chordSynth = expressionStringArgument(chordExpression.expression, "s") || next.chordSynth;

  return { errors: [], composition: next };
}

class AudioEngine {
  constructor() {
    this.context = null;
    this.master = null;
    this.analyser = null;
    this.trackGains = {};
    this.noiseBuffer = null;
    this.timer = null;
    this.playing = false;
    this.step = 0;
    this.absoluteStep = 0;
    this.nextNoteTime = 0;
    this.totalSteps = 32 * 16;
  }

  ensure() {
    if (this.context) return this.context;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) throw new Error("当前浏览器不支持 Web Audio API");
    this.context = new AudioContext();

    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.knee.value = 12;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.22;

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.82;
    this.master = this.context.createGain();
    this.master.gain.value = Number($("#masterVolume").value);

    ["drums", "bass", "chords", "lead"].forEach((track) => {
      const gain = this.context.createGain();
      gain.gain.value = composition.muted[track] ? 0 : composition.volumes[track];
      gain.connect(compressor);
      this.trackGains[track] = gain;
    });
    compressor.connect(this.analyser);
    this.analyser.connect(this.master);
    this.master.connect(this.context.destination);
    this.noiseBuffer = this.createNoiseBuffer();
    return this.context;
  }

  createNoiseBuffer() {
    const buffer = this.context.createBuffer(1, this.context.sampleRate, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  async start(restart = false) {
    try {
      this.ensure();
      await this.context.resume();
      if (restart) {
        this.step = 0;
        this.absoluteStep = 0;
      }
      if (this.playing) return;
      this.playing = true;
      this.nextNoteTime = this.context.currentTime + 0.05;
      this.scheduler();
      this.timer = window.setInterval(() => this.scheduler(), 25);
      updatePlayingUI(true);
    } catch (error) {
      showToast(error.message || "无法启动音频");
    }
  }

  pause() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
    this.playing = false;
    updatePlayingUI(false);
  }

  stop() {
    this.pause();
    this.step = 0;
    this.absoluteStep = 0;
    updateTransport(0, 0);
    highlightStep(-1);
  }

  seek(percent) {
    this.absoluteStep = Math.round((percent / 100) * (this.totalSteps - 1));
    this.step = this.absoluteStep % 16;
    if (this.context) this.nextNoteTime = this.context.currentTime + 0.03;
    updateTransport(this.step, this.absoluteStep);
  }

  setTrackVolume(track, value) {
    composition.volumes[track] = value;
    if (this.trackGains[track] && !composition.muted[track]) {
      this.trackGains[track].gain.setTargetAtTime(value, this.context.currentTime, 0.015);
    }
  }

  setMuted(track, muted) {
    composition.muted[track] = muted;
    if (!this.trackGains[track]) return;
    const target = muted ? 0 : composition.volumes[track];
    this.trackGains[track].gain.setTargetAtTime(target, this.context.currentTime, 0.015);
  }

  scheduler() {
    if (!this.playing || !this.context) return;
    while (this.nextNoteTime < this.context.currentTime + 0.12) {
      this.scheduleStep(this.step, this.absoluteStep, this.nextNoteTime);
      const delay = Math.max(0, (this.nextNoteTime - this.context.currentTime) * 1000);
      const shownStep = this.step;
      const shownAbsolute = this.absoluteStep;
      window.setTimeout(() => {
        if (this.playing) {
          highlightStep(shownStep);
          updateTransport(shownStep, shownAbsolute);
        }
      }, delay);

      const secondsPerStep = 60 / composition.bpm / 4;
      const swingOffset = (composition.swing - 50) / 100;
      this.nextNoteTime += secondsPerStep * (this.step % 2 === 0 ? 1 - swingOffset : 1 + swingOffset);
      this.step = (this.step + 1) % 16;
      this.absoluteStep = (this.absoluteStep + 1) % this.totalSteps;
    }
  }

  scheduleStep(step, absoluteStep, time) {
    if (composition.kick.includes(step)) this.kick(time, composition.energy);
    if (composition.snare.includes(step)) this.snare(time);
    if (composition.hats.includes(step)) this.hat(time, step % 4 === 2 ? 0.12 : 0.07);
    if (composition.bass.includes(step)) {
      const index = (absoluteStep + Math.floor(absoluteStep / 16)) % composition.bassNotes.length;
      this.bass(time, keyRoot() + composition.bassNotes[index]);
    }
    if (composition.chordEnabled && (step === 0 || (step === 8 && composition.complexity > 0.62))) this.chord(time, Math.floor(absoluteStep / 16));
    if (composition.lead.includes(step)) {
      const index = (absoluteStep + composition.seed) % composition.leadNotes.length;
      this.lead(time, keyRoot() + composition.leadNotes[index]);
    }
  }

  kick(time, energy) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(165 + energy * 35, time);
    osc.frequency.exponentialRampToValueAtTime(46, time + 0.12);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.9, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);
    osc.connect(gain).connect(this.trackGains.drums);
    osc.start(time);
    osc.stop(time + 0.34);
  }

  snare(time) {
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = this.noiseBuffer;
    filter.type = "bandpass";
    filter.frequency.value = 1850;
    filter.Q.value = 0.65;
    gain.gain.setValueAtTime(0.32, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    source.connect(filter).connect(gain).connect(this.trackGains.drums);
    source.start(time);
    source.stop(time + 0.2);
  }

  hat(time, level) {
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = this.noiseBuffer;
    filter.type = "highpass";
    filter.frequency.value = 5200 + composition.brightness * 2400;
    gain.gain.setValueAtTime(level, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);
    source.connect(filter).connect(gain).connect(this.trackGains.drums);
    source.start(time);
    source.stop(time + 0.065);
  }

  bass(time, midi) {
    const osc = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    osc.type = normalizeOscillator(composition.bassSynth || composition.synth, "sawtooth");
    osc.frequency.setValueAtTime(midiToFrequency(midi), time);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.max(120, Math.min(3200, composition.tone * 0.32)), time);
    filter.Q.value = composition.id === "techno" ? 11 : 3.5;
    const length = Math.max(0.09, 60 / composition.bpm / 3.2);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.38, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
    osc.connect(filter).connect(gain).connect(this.trackGains.bass);
    osc.start(time);
    osc.stop(time + length + 0.03);
  }

  chord(time, bar) {
    const minor = !composition.key.includes("major");
    const progressions = [[0, 8, 3, 10], [0, 5, 8, 3], [0, 3, 10, 5]];
    const rootOffset = progressions[composition.seed % progressions.length][bar % 4];
    const intervals = minor ? [0, 3, 7, 10] : [0, 4, 7, 11];
    const duration = Math.min(2.8, (60 / composition.bpm) * (composition.id === "ambient" ? 5.5 : 3.5));
    const mix = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();
    filter.type = "lowpass";
    filter.frequency.value = Math.max(300, Math.min(4800, composition.tone * 0.72));
    filter.Q.value = 1.2;
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(0.11, time + 0.1);
    envelope.gain.setValueAtTime(0.09, time + Math.max(0.11, duration - 0.35));
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    mix.connect(filter).connect(envelope).connect(this.trackGains.chords);
    intervals.forEach((interval, index) => {
      const osc = this.context.createOscillator();
      osc.type = normalizeOscillator(composition.chordSynth, "triangle");
      osc.frequency.value = midiToFrequency(keyRoot() + 12 + rootOffset + interval);
      osc.detune.value = (index - 1.5) * 3;
      osc.connect(mix);
      osc.start(time);
      osc.stop(time + duration + 0.05);
    });
  }

  lead(time, midi) {
    const osc = this.context.createOscillator();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    osc.type = normalizeOscillator(composition.leadSynth, "sawtooth");
    osc.frequency.value = midiToFrequency(midi);
    filter.type = "lowpass";
    filter.frequency.value = Math.max(300, Math.min(6000, composition.tone));
    filter.Q.value = 4;
    const length = Math.max(0.08, 60 / composition.bpm / 2.8);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.13 + composition.energy * 0.07, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
    osc.connect(filter).connect(gain).connect(this.trackGains.lead);
    osc.start(time);
    osc.stop(time + length + 0.03);
  }
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function normalizeOscillator(value, fallback = "sawtooth") {
  const type = String(value || "").toLowerCase();
  if (type === "sine" || type === "triangle" || type === "square" || type === "sawtooth") return type;
  if (type === "pulse") return "square";
  if (type === "supersaw" || type.startsWith("wt_")) return "sawtooth";
  return fallback;
}

const strudelSoundfontPresetCache = new Map();
const strudelSoundfontBufferCache = new Map();

async function loadStrudelGmMap() {
  let lastError;
  for (const url of STRUDEL_GM_MAP_URLS) {
    try {
      const module = await import(url);
      if (module?.default && typeof module.default === "object") return module.default;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(lastError?.message || "GM 乐器清单加载失败");
}

async function loadStrudelSoundfontPreset(fontName) {
  if (strudelSoundfontPresetCache.has(fontName)) return strudelSoundfontPresetCache.get(fontName);

  const pending = (async () => {
    const response = await fetch(`${STRUDEL_SOUNDFONT_BASE_URL}/${fontName}.js`);
    if (!response.ok) throw new Error(`SoundFont ${fontName} 下载失败（${response.status}）`);
    const source = await response.text();
    const marker = source.indexOf("={");
    if (marker < 0) throw new Error(`SoundFont ${fontName} 数据格式不正确`);
    const objectSource = `{${source.slice(marker + 2)}`.replace(/;\s*$/, "");
    const preset = Function(`"use strict"; return (${objectSource});`)();
    const zones = Array.isArray(preset) ? preset : preset?.zones;
    if (!Array.isArray(zones) || zones.length === 0) throw new Error(`SoundFont ${fontName} 没有可用音区`);
    return zones;
  })();

  strudelSoundfontPresetCache.set(fontName, pending);
  pending.catch(() => strudelSoundfontPresetCache.delete(fontName));
  return pending;
}

function findStrudelSoundfontZone(zones, pitch) {
  return zones.find((zone) => zone.keyRangeLow <= pitch && zone.keyRangeHigh + 1 >= pitch);
}

async function decodeStrudelSoundfontZone(zone, audioContext) {
  if (zone.buffer) return zone.buffer;

  if (zone.sample) {
    const decoded = atob(zone.sample);
    const buffer = audioContext.createBuffer(1, Math.floor(decoded.length / 2), zone.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) {
      const low = decoded.charCodeAt(index * 2);
      const high = decoded.charCodeAt(index * 2 + 1);
      let sample = high * 256 + low;
      if (sample >= 32768) sample -= 65536;
      channel[index] = sample / 65536;
    }
    zone.buffer = buffer;
    return buffer;
  }

  if (!zone.file) return null;
  const decoded = atob(zone.file);
  const bytes = new Uint8Array(decoded.length);
  for (let index = 0; index < decoded.length; index += 1) bytes[index] = decoded.charCodeAt(index);
  const buffer = await audioContext.decodeAudioData(bytes.buffer);
  zone.buffer = buffer;
  return buffer;
}

async function getStrudelSoundfontBuffer(fontName, pitch, audioContext) {
  const cacheKey = `${fontName}:::${pitch}`;
  if (strudelSoundfontBufferCache.has(cacheKey)) return strudelSoundfontBufferCache.get(cacheKey);

  const pending = (async () => {
    const zones = await loadStrudelSoundfontPreset(fontName);
    const zone = findStrudelSoundfontZone(zones, pitch);
    if (!zone) throw new Error(`SoundFont ${fontName} 不支持音高 ${pitch}`);
    const buffer = await decodeStrudelSoundfontZone(zone, audioContext);
    if (!buffer) throw new Error(`SoundFont ${fontName} 的音频数据不可用`);
    return { buffer, zone };
  })();

  strudelSoundfontBufferCache.set(cacheKey, pending);
  pending.catch(() => strudelSoundfontBufferCache.delete(cacheKey));
  return pending;
}

async function createStrudelSoundfontSource(api, fontName, value, audioContext) {
  const note = value.note ?? "c3";
  let pitch;
  if (value.freq) pitch = api.freqToMidi(value.freq);
  else if (typeof note === "string") pitch = api.noteToMidi(note);
  else if (typeof note === "number") pitch = note;
  else throw new Error(`无法识别 SoundFont 音高类型：${typeof note}`);

  const { buffer, zone } = await getStrudelSoundfontBuffer(fontName, pitch, audioContext);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  const baseDetune = zone.originalPitch - 100 * zone.coarseTune - zone.fineTune;
  source.playbackRate.value = 2 ** ((100 * pitch - baseDetune) / 1200);
  if (zone.loopStart > 1 && zone.loopStart < zone.loopEnd) {
    source.loop = true;
    source.loopStart = zone.loopStart / zone.sampleRate;
    source.loopEnd = zone.loopEnd / zone.sampleRate;
  }
  return source;
}

async function registerStrudelSoundfonts(api) {
  const requiredMethods = [
    "registerSound",
    "getADSRValues",
    "getAudioContext",
    "getParamADSR",
    "getPitchEnvelope",
    "getSoundIndex",
    "getVibratoOscillator",
    "noteToMidi",
    "freqToMidi",
    "onceEnded",
    "releaseAudioNode",
  ];
  const missingMethods = requiredMethods.filter((name) => typeof api[name] !== "function");
  if (missingMethods.length) throw new Error(`当前 Strudel 版本缺少 SoundFont 接口：${missingMethods.join("、")}`);

  const gmMap = await loadStrudelGmMap();
  let registeredCount = 0;
  Object.entries(gmMap).forEach(([name, fonts]) => {
    if (!Array.isArray(fonts) || fonts.length === 0) return;
    api.registerSound(
      name,
      async (time, value, onended) => {
        const [attack, decay, sustain, release] = api.getADSRValues([
          value.attack,
          value.decay,
          value.sustain,
          value.release,
        ]);
        const fontIndex = api.getSoundIndex(value.n, fonts.length);
        const audioContext = api.getAudioContext();
        const source = await createStrudelSoundfontSource(api, fonts[fontIndex], value, audioContext);
        const envelope = audioContext.createGain();
        const node = source.connect(envelope);
        const startTime = Math.max(time, audioContext.currentTime);
        const holdEnd = startTime + value.duration;
        api.getParamADSR(envelope.gain, attack, decay, sustain, release, 0, 0.3, startTime, holdEnd, "linear");
        const endTime = holdEnd + release + 0.01;
        const vibrato = api.getVibratoOscillator(source.detune, value, startTime);
        api.getPitchEnvelope(source.detune, value, startTime, holdEnd);
        api.onceEnded(source, () => {
          api.releaseAudioNode(source);
          vibrato?.stop();
          onended();
        });
        source.start(startTime);
        source.stop(endTime);
        return {
          node,
          stop: () => {},
          nodes: { source: [source], ...vibrato?.nodes },
        };
      },
      { type: "soundfont", prebake: true, fonts },
    );
    registeredCount += 1;
  });

  return registeredCount;
}

class StrudelRuntime {
  constructor() {
    this.api = null;
    this.repl = null;
    this.initPromise = null;
    this.ready = false;
    this.playing = false;
    this.lastEvalError = null;
    this.startedAt = 0;
    this.animationFrame = 0;
    this.analyser = null;
    this.analyserSource = null;
    this.soundfontCount = 0;
  }

  setState(message, state = "") {
    const node = $("#engineState");
    if (!node) return;
    node.textContent = message;
    node.className = state ? `engine-${state}` : "";
  }

  async ensure() {
    if (this.ready) return this.api;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      this.setState("正在初始化官方 Strudel 音频引擎…", "loading");
      const api = window.strudel;
      const initialize = window.initStrudel || api?.initStrudel;
      if (!api || typeof initialize !== "function" || typeof api.evaluate !== "function") {
        throw new Error("官方 Strudel 运行组件加载失败，请刷新页面重试");
      }

      const repl = await initialize({
        onEvalError: (error) => { this.lastEvalError = error; },
      });

      const started = performance.now();
      while (typeof window.s !== "function" || typeof window.note !== "function") {
        if (performance.now() - started > 15000) throw new Error("官方 Strudel 初始化超时，请刷新后重试");
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }

      window.sliderWithID = window.sliderWithID || ((_id, value) => Number(value));
      this.setState("正在加载完整采样、鼓机、GM 乐器与波表音色…", "loading");
      const [sampleResults, soundfontCount] = await Promise.all([
        Promise.allSettled(STRUDEL_SAMPLE_MAPS.map(({ url, baseUrl, tag }) => (
          api.samples(url, baseUrl, { prebake: true, ...(tag ? { tag } : {}) })
        ))),
        registerStrudelSoundfonts(api),
      ]);
      const failedSampleMaps = sampleResults
        .map((result, index) => ({ result, source: STRUDEL_SAMPLE_MAPS[index].url }))
        .filter(({ result }) => result.status === "rejected");
      if (failedSampleMaps.length) {
        const failedNames = failedSampleMaps.map(({ source }) => source.split("/").pop()).join("、");
        throw new Error(`Strudel 音色表加载失败：${failedNames}`);
      }
      await api.aliasBank(STRUDEL_DRUM_ALIAS_MAP_URL);
      const requiredSounds = [
        "piano",
        "harmonica",
        "RolandTR909_bd",
        "9000_bd",
        "gm_flute",
        "gm_harmonica",
        "wt_digital",
        "wt_digital_bad_day",
      ];
      const missingSounds = requiredSounds.filter((name) => !api.getSound(name));
      if (missingSounds.length) throw new Error(`以下 Strudel 音色没有注册成功：${missingSounds.join("、")}`);
      Promise.allSettled(STRUDEL_OPTIONAL_SAMPLE_MAPS.map((url) => api.samples(url)))
        .catch(() => {});

      this.api = api;
      this.repl = repl;
      this.soundfontCount = soundfontCount;
      this.ready = true;
      this.connectAnalyser();
      this.setState(`完整 Strudel 音色库 · 已就绪（${soundfontCount} 组 GM 乐器）`, "ready");
      return api;
    })();

    try {
      return await this.initPromise;
    } catch (error) {
      this.initPromise = null;
      this.setState(error.message || "Strudel 音频引擎暂不可用", "error");
      throw error;
    }
  }

  async run(code) {
    await this.ensure();
    this.lastEvalError = null;
    await this.repl.evaluate(compileCodeWithMixerValues(code), true);
    this.connectAnalyser();
    const evalError = this.lastEvalError || this.repl.state?.evalError;
    if (evalError) {
      this.playing = Boolean(this.repl.state?.started);
      updatePlayingUI(this.playing);
      throw evalError;
    }
    this.playing = true;
    this.startedAt = performance.now();
    updatePlayingUI(true);
    this.setState("官方 Strudel 音频引擎 · 正在演奏", "live");
    this.startTransportClock();
  }

  connectAnalyser() {
    try {
      const context = this.api?.getAudioContext?.();
      const controller = this.api?.getSuperdoughAudioController?.();
      const source = controller?.output?.destinationGain;
      if (!context || !source || typeof source.connect !== "function") return false;
      if (this.analyser && this.analyserSource === source) {
        audio.analyser = this.analyser;
        return true;
      }
      if (this.analyser && this.analyserSource) {
        try { this.analyserSource.disconnect(this.analyser); } catch (_) {}
      }
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.72;
      analyser.minDecibels = -100;
      analyser.maxDecibels = -20;
      source.connect(analyser);
      this.analyser = analyser;
      this.analyserSource = source;
      audio.analyser = analyser;
      return true;
    } catch (error) {
      console.warn("无法连接 Strudel 实时音频分析器", error);
      return false;
    }
  }

  stop(reset = true) {
    if (this.repl) this.repl.stop();
    else if (this.api) this.api.hush?.();
    this.playing = false;
    window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    updatePlayingUI(false);
    if (reset) {
      updateTransport(0, 0);
      highlightStep(-1);
    }
    if (this.ready) this.setState(`完整 Strudel 音色库 · 已就绪（${this.soundfontCount} 组 GM 乐器）`, "ready");
  }

  startTransportClock() {
    window.cancelAnimationFrame(this.animationFrame);
    const tick = () => {
      if (!this.playing) return;
      const elapsed = (performance.now() - this.startedAt) / 1000;
      const secondsPerStep = 60 / composition.bpm / 4;
      const absoluteStep = Math.floor(elapsed / secondsPerStep) % audio.totalSteps;
      const step = absoluteStep % 16;
      updateTransport(step, absoluteStep);
      highlightStep(step);
      this.animationFrame = window.requestAnimationFrame(tick);
    };
    tick();
  }
}

const audio = new AudioEngine();
const strudelRuntime = new StrudelRuntime();
let mixerRunTimer;
let mixerRunInFlight = false;
let mixerRerunQueued = false;
let sliderCardSyncTimer;
let projectAutoSaveTimer;

function normalizeClientInstrumentTracks(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.flatMap((item) => {
    const rawVariable = String(item?.variable || "").trim();
    const variableId = /^[A-Za-z_][A-Za-z0-9_]*Vol$/.test(rawVariable) ? rawVariable.slice(0, -3) : "";
    const id = variableId || String(item?.id || item?.instrument || "").trim();
    if (!isSafeTrackId(id) || BASE_TRACK_IDS.includes(id) || seen.has(id)) return [];
    seen.add(id);
    const variable = variableId ? rawVariable : `${id}Vol`;
    const meta = INSTRUMENT_TRACK_META[String(item?.instrument || id).toLowerCase()]
      || INSTRUMENT_TRACK_META[id.toLowerCase()];
    const rhythm = Array.isArray(item.rhythm) && item.rhythm.length === 16
      ? item.rhythm.map((step) => Number(step) > 0 ? 1 : 0)
      : Array.from({ length: 16 }, (_, index) => Array.isArray(item.steps) && item.steps.includes(index) ? 1 : 0);
    const steps = rhythm.flatMap((active, index) => active ? [index] : []);
    const volume = Number(item.volume);
    return [{
      id,
      variable,
      instrument: String(item?.instrument || id).trim() || id,
      label: localizeTrackLabel(item?.label || meta?.label, id),
      detail: String(item?.detail || meta?.detail || customTrackDetail(id)).trim().slice(0, 48),
      notes: Array.isArray(item.notes) ? item.notes.filter((note) => typeof note === "string").slice(0, 8) : [],
      rhythm,
      steps,
      volume: Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.55,
      muted: Boolean(item.muted),
    }];
  }).slice(0, MAX_CLIENT_INSTRUMENT_TRACKS);
}

function syncMixerCardsFromSliderCode(code, { removeMissing = false, render = true } = {}) {
  const definitions = sliderDefinitionsFromCode(code);
  const declaredTracks = new Set();
  let changed = false;

  BASE_TRACK_IDS.forEach((track) => {
    const value = definitions[`${track}Vol`]?.value;
    if (Number.isFinite(value)) {
      declaredTracks.add(track);
      const nextVolume = Math.max(0, Math.min(1, value));
      if (composition.volumes[track] !== nextVolume || composition.muted[track] !== (nextVolume === 0)) changed = true;
      composition.volumes[track] = nextVolume;
      composition.muted[track] = nextVolume === 0;
    } else if (removeMissing && !composition.deletedTracks?.includes(track)) {
      composition.deletedTracks = [...(composition.deletedTracks || []), track];
      changed = true;
    }
  });

  Object.values(definitions).forEach((definition) => {
    if (definition.variable === "masterVol" || !definition.variable.endsWith("Vol")) return;
    const trackId = definition.variable.slice(0, -3);
    if (!isSafeTrackId(trackId) || BASE_TRACK_IDS.includes(trackId)) return;
    const value = definition.value;
    const existing = composition.instrumentTracks?.find((track) => track.id === trackId) || null;
    if (Number.isFinite(value)) {
      declaredTracks.add(trackId);
      const inferred = inferInstrumentTrackFromCode(trackId, definition, code, existing);
      if (existing) {
        if (existing.volume !== inferred.volume || existing.muted !== inferred.muted
          || existing.variable !== inferred.variable || existing.label !== inferred.label
          || existing.steps.join(",") !== inferred.steps.join(",")
          || existing.notes.join(",") !== inferred.notes.join(",")) changed = true;
        Object.assign(existing, inferred);
      } else {
        composition.instrumentTracks = [...(composition.instrumentTracks || []), inferred];
        changed = true;
      }
    }
  });

  if (removeMissing) {
    const removedTracks = (composition.instrumentTracks || [])
      .filter((track) => !declaredTracks.has(track.id));
    if (removedTracks.length) {
      const removedIds = new Set(removedTracks.map((track) => track.id));
      composition.instrumentTracks = composition.instrumentTracks.filter((track) => !removedIds.has(track.id));
      composition.deletedTracks = [...(composition.deletedTracks || []), ...removedIds];
      changed = true;
    }
  }

  const previousDeleted = normalizeDeletedTracks(composition.deletedTracks);
  composition.deletedTracks = previousDeleted.filter((track) => !declaredTracks.has(track));
  if (composition.deletedTracks.length !== previousDeleted.length) changed = true;
  composition.instrumentTracks = normalizeClientInstrumentTracks(composition.instrumentTracks);
  if (render && changed) updateCompositionUI({ preserveCode: true });
  return changed;
}

function findInstrumentTrack(trackId) {
  return composition.instrumentTracks?.find((track) => track.id === trackId) || null;
}

function getTrackVolumeVariable(trackId) {
  return findInstrumentTrack(trackId)?.variable || `${trackId}Vol`;
}

function getTrackMixState(trackId) {
  const extraTrack = findInstrumentTrack(trackId);
  if (extraTrack) {
    return {
      volume: extraTrack.volume,
      muted: extraTrack.muted,
      hasPattern: extraTrack.steps.length > 0,
    };
  }
  const hasPattern = trackId === "drums"
    ? composition.kick.length + composition.snare.length + composition.hats.length > 0
    : trackId === "chords" ? composition.chordEnabled : Array.isArray(composition[trackId]) && composition[trackId].length > 0;
  return {
    volume: composition.volumes[trackId] ?? 0,
    muted: Boolean(composition.muted[trackId]),
    hasPattern,
  };
}

function setTrackMixState(trackId, changes) {
  const extraTrack = findInstrumentTrack(trackId);
  if (extraTrack) {
    if (Number.isFinite(changes.volume)) extraTrack.volume = Math.max(0, Math.min(1, changes.volume));
    if (typeof changes.muted === "boolean") extraTrack.muted = changes.muted;
    return;
  }
  if (Number.isFinite(changes.volume)) composition.volumes[trackId] = Math.max(0, Math.min(1, changes.volume));
  if (typeof changes.muted === "boolean") composition.muted[trackId] = changes.muted;
}

function renderInstrumentTrackCards() {
  const grid = $("#trackGrid");
  if (!grid) return;
  $$('.track-card[data-dynamic="true"]', grid).forEach((card) => card.remove());
  composition.instrumentTracks.forEach((track, index) => {
    const knownMeta = INSTRUMENT_TRACK_META[String(track.instrument || track.id).toLowerCase()]
      || INSTRUMENT_TRACK_META[track.id.toLowerCase()];
    const meta = {
      label: track.label || knownMeta?.label || localizeTrackLabel("", track.id),
      detail: track.detail || knownMeta?.detail || customTrackDetail(track.id),
    };
    const color = TRACK_COLOR_CLASSES[(index + 1) % TRACK_COLOR_CLASSES.length];
    const card = document.createElement("article");
    card.className = "track-card";
    card.dataset.track = track.id;
    card.dataset.dynamic = "true";
    card.innerHTML = `
      <header>
        <span class="track-index">${String(index + 5).padStart(2, "0")}</span>
        <span class="track-card-actions"><span class="track-led ${color}"></span><button type="button" class="track-delete" data-track="${track.id}" aria-label="删除${escapeHTML(meta.label)}分轨" title="删除分轨">×</button></span>
      </header>
      <div class="track-name"><strong>${escapeHTML(meta.label)}</strong><span>${escapeHTML(meta.detail)}</span></div>
      <div class="step-row ${color}-steps" aria-hidden="true"></div>
      <div class="track-controls">
        <button class="mute-btn" data-track="${track.id}" aria-label="${escapeHTML(meta.label)}静音">静</button>
        <input type="range" class="track-volume" data-track="${track.id}" min="0" max="1" step="0.01" value="${track.volume}" aria-label="${escapeHTML(meta.label)}音量" />
        <output>${Math.round(track.volume * 100)}</output>
      </div>`;
    grid.appendChild(card);
  });
}

function renderSteps() {
  const patterns = {
    drums: composition.kick,
    bass: composition.bass,
    chords: composition.chordEnabled ? [0, 8] : [],
    lead: composition.lead,
    ...Object.fromEntries(composition.instrumentTracks.map((track) => [track.id, track.steps])),
  };
  Object.entries(patterns).forEach(([track, hits]) => {
    const row = $(`.track-card[data-track="${track}"] .step-row`);
    if (!row) return;
    row.innerHTML = Array.from({ length: 16 }, (_, index) => {
      const height = 8 + ((composition.seed >> (index % 12)) % 17);
      return `<i class="${hits.includes(index) ? "hit" : ""}" style="--step-height:${height}px"></i>`;
    }).join("");
  });
}

function highlightStep(step) {
  $$(".step-row i").forEach((item, index) => item.classList.toggle("current", step >= 0 && index % 16 === step));
}

function updateRangeFill(input) {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = ((Number(input.value) - min) / (max - min)) * 100;
  input.style.setProperty("--range-progress", `${value}%`);
}

function updateCompositionUI({ preserveCode = false } = {}) {
  composition.instrumentTracks = normalizeClientInstrumentTracks(composition.instrumentTracks);
  composition.deletedTracks = normalizeDeletedTracks(composition.deletedTracks);
  renderInstrumentTrackCards();
  BASE_TRACK_IDS.forEach((track) => {
    const card = $(`.track-card[data-track="${track}"]`);
    if (card) card.hidden = composition.deletedTracks.includes(track);
  });
  $("#projectTitle").textContent = composition.projectName;
  const currentProjectLabel = $("#currentProjectLabel");
  if (currentProjectLabel) currentProjectLabel.textContent = composition.projectName;
  $("#scopeStyle").textContent = composition.label;
  $("#scopeKey").textContent = localizeKey(composition.key);
  $("#statBpm").textContent = composition.bpm;
  $("#statSwing").textContent = `${composition.swing}%`;
  $("#drumLabel").textContent = composition.drumLabel;
  $("#bassLabel").textContent = composition.bassLabel;
  $("#chordLabel").textContent = composition.chordLabel;
  $("#leadLabel").textContent = composition.leadLabel;
  if (!preserveCode) {
    $("#codeEditor").value = buildPatternCode(composition);
    setEditorDirty(false);
    setEditorStatus("音乐模式有效");
  }
  updateLineNumbers();
  updateSessionDuration();

  $$(".track-volume").forEach((input) => {
    const track = input.dataset.track;
    const state = getTrackMixState(track);
    input.value = state.volume;
    input.nextElementSibling.value = Math.round(state.volume * 100);
    updateRangeFill(input);
    input.closest(".track-card").classList.toggle("muted", state.muted);
    input.closest(".track-card").classList.remove("empty");
    $(`.mute-btn[data-track="${track}"]`)?.classList.toggle("active", state.muted);
    if (audio.trackGains[track]) audio.setMuted(track, state.muted);
  });
  const activeTracks = [...BASE_TRACK_IDS.filter((track) => !composition.deletedTracks.includes(track)), ...composition.instrumentTracks.map((track) => track.id)]
    .map(getTrackMixState)
    .filter((state) => state.hasPattern && !state.muted).length;
  $("#activeTrackCount").textContent = `${activeTracks} 条轨道启用`;
  renderSteps();
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateSessionDuration() {
  const totalSeconds = (audio.totalSteps / 4) * (60 / composition.bpm);
  $("#totalTime").textContent = formatTime(Math.ceil(totalSeconds));
}

function normalizeSavedComposition(savedComposition) {
  if (!savedComposition || typeof savedComposition !== "object") return null;
  const preset = STYLE_PRESETS[savedComposition.id];
  if (!preset) return null;

  const fallback = createComposition(savedComposition.prompt || preset.label);
  const bpm = Number(savedComposition.bpm);
  const keyMatch = typeof savedComposition.key === "string"
    ? savedComposition.key.match(/^([A-G](?:#|b)?) (minor|major)$/)
    : null;
  const restored = {
    ...fallback,
    ...savedComposition,
    id: preset.id,
    bpm: Number.isFinite(bpm) ? Math.max(60, Math.min(210, Math.round(bpm))) : fallback.bpm,
    key: keyMatch && Object.prototype.hasOwnProperty.call(ROOT_MIDI, keyMatch[1]) ? savedComposition.key : fallback.key,
  };
  restored.label = preset.label;
  restored.drumLabel = preset.drumLabel;
  restored.bassLabel = preset.bassLabel;
  restored.chordLabel = preset.chordLabel;
  restored.leadLabel = preset.leadLabel;
  restored.projectName = typeof savedComposition.projectName === "string" && savedComposition.projectName.trim()
    ? savedComposition.projectName.trim().slice(0, 18)
    : fallback.projectName;

  ["kick", "snare", "hats", "bass", "lead", "bassNotes", "leadNotes"].forEach((field) => {
    if (!Array.isArray(restored[field]) || !restored[field].every(Number.isFinite)) restored[field] = fallback[field];
  });
  const tone = Number(savedComposition.tone);
  restored.tone = Number.isFinite(tone) ? Math.max(120, Math.min(12000, tone)) : fallback.tone;
  ["bassSynth", "chordSynth", "leadSynth"].forEach((field) => {
    if (typeof restored[field] !== "string" || !restored[field].trim()) restored[field] = fallback[field];
  });
  restored.chordEnabled = typeof savedComposition.chordEnabled === "boolean" ? savedComposition.chordEnabled : fallback.chordEnabled;
  restored.volumes = Object.fromEntries(Object.keys(VOLUME_DEFAULTS).map((track) => {
    const volume = Number(savedComposition.volumes?.[track]);
    return [track, Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : fallback.volumes[track]];
  }));
  restored.muted = Object.fromEntries(Object.keys(VOLUME_DEFAULTS).map((track) => {
    const muted = savedComposition.muted?.[track];
    return [track, typeof muted === "boolean" ? muted : fallback.muted[track]];
  }));
  restored.instrumentTracks = normalizeClientInstrumentTracks(savedComposition.instrumentTracks);
  restored.deletedTracks = normalizeDeletedTracks(savedComposition.deletedTracks);
  return restored;
}

function localizeGeneratedCode(code, comp) {
  return String(code)
    .replace(/^\/\/ PULSEGRID AI[^\n]*/m, `// 脉冲音格 / ${comp.label} / ${localizeKey(comp.key)}`)
    .replace(/"Master"/g, '"总音量"')
    .replace(/"Drums"/g, '"鼓组"')
    .replace(/"Bass"/g, '"贝斯"')
    .replace(/"Chords"/g, '"和弦"')
    .replace(/"Lead"/g, '"主旋律"')
    .replace(/"Tone"/g, '"音色明暗"');
}

function createProjectId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeProjectRecord(record) {
  if (!record || typeof record !== "object" || typeof record.code !== "string" || !record.composition) return null;
  const savedAt = Number(record.savedAt);
  return {
    id: typeof record.id === "string" && record.id ? record.id : createProjectId(),
    code: record.code,
    composition: record.composition,
    savedAt: Number.isFinite(savedAt) ? savedAt : Date.now(),
  };
}

function persistProjectLibrary() {
  projectLibrary.sort((a, b) => b.savedAt - a.savedAt);
  localStorage.setItem(PROJECT_LIBRARY_STORAGE_KEY, JSON.stringify(projectLibrary.slice(0, MAX_SAVED_PROJECTS)));
}

function loadProjectLibrary() {
  projectLibrary = [];
  const rawLibrary = localStorage.getItem(PROJECT_LIBRARY_STORAGE_KEY);
  if (rawLibrary !== null) {
    const parsed = JSON.parse(rawLibrary);
    if (!Array.isArray(parsed)) throw new Error("项目库数据格式无效");
    const seen = new Set();
    projectLibrary = parsed
      .map(normalizeProjectRecord)
      .filter((record) => record && !seen.has(record.id) && seen.add(record.id))
      .sort((a, b) => b.savedAt - a.savedAt)
      .slice(0, MAX_SAVED_PROJECTS);
    return;
  }

  const legacyRaw = localStorage.getItem(LEGACY_PROJECT_STORAGE_KEY);
  if (!legacyRaw) return;
  const legacyProject = normalizeProjectRecord(JSON.parse(legacyRaw));
  if (!legacyProject) return;
  projectLibrary = [legacyProject];
  currentProjectId = legacyProject.id;
  persistProjectLibrary();
  localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, legacyProject.id);
  localStorage.removeItem(LEGACY_PROJECT_STORAGE_KEY);
}

function projectDisplayName(project) {
  const name = project?.composition?.projectName;
  return typeof name === "string" && name.trim() ? name.trim().slice(0, 18) : "未命名项目";
}

function nextNewProjectName() {
  const usedNames = new Set(projectLibrary.map(projectDisplayName));
  for (let index = 1; index <= MAX_SAVED_PROJECTS + 1; index += 1) {
    const candidate = `新音乐项目 ${index}`;
    if (!usedNames.has(candidate)) return candidate;
  }
  return `新音乐项目 ${Date.now().toString().slice(-4)}`;
}

function formatProjectTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "时间未知";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function setProjectPickerOpen(open) {
  const popover = $("#projectPopover");
  const switcher = $("#projectSwitcherBtn");
  if (!popover || !switcher) return;
  popover.hidden = !open;
  switcher.setAttribute("aria-expanded", String(open));
  if (open) {
    renderProjectList();
    window.setTimeout(() => $("#projectSearchInput")?.focus(), 20);
  }
}

function renderProjectList() {
  const list = $("#projectList");
  if (!list) return;
  const query = String($("#projectSearchInput")?.value || "").trim().toLocaleLowerCase("zh-CN");
  const projects = projectLibrary.filter((project) => {
    if (!query) return true;
    const comp = project.composition || {};
    return [projectDisplayName(project), comp.label, comp.key, comp.prompt, comp.bpm]
      .some((value) => String(value || "").toLocaleLowerCase("zh-CN").includes(query));
  });

  list.replaceChildren();
  if (!projects.length) {
    const empty = document.createElement("div");
    empty.className = "project-empty";
    const title = document.createElement("strong");
    title.textContent = query ? "没有找到项目" : "还没有保存的项目";
    const hint = document.createElement("span");
    hint.textContent = query ? "换一个名称或风格试试" : "点击保存后，项目会出现在这里";
    empty.append(title, hint);
    list.append(empty);
    return;
  }

  projects.forEach((project) => {
    const item = document.createElement("div");
    const isCurrent = project.id === currentProjectId;
    item.className = `project-item${isCurrent ? " current" : ""}`;

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "project-open";
    openButton.dataset.projectId = project.id;
    const icon = document.createElement("span");
    icon.className = "project-item-icon";
    icon.textContent = "乐";
    const copy = document.createElement("span");
    copy.className = "project-item-copy";
    const titleLine = document.createElement("span");
    titleLine.className = "project-item-title";
    const title = document.createElement("strong");
    title.textContent = projectDisplayName(project);
    titleLine.append(title);
    if (isCurrent) {
      const tag = document.createElement("span");
      tag.className = "project-current-tag";
      tag.textContent = "当前";
      titleLine.append(tag);
    }
    const meta = document.createElement("small");
    const bpm = Number(project.composition?.bpm);
    const bpmText = Number.isFinite(bpm) ? `${Math.round(bpm)} 拍` : "速度未知";
    const keyText = project.composition?.key ? localizeKey(project.composition.key) : "调性未知";
    meta.textContent = `${bpmText} · ${keyText} · ${formatProjectTime(project.savedAt)}`;
    copy.append(titleLine, meta);
    openButton.append(icon, copy);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "project-delete";
    deleteButton.dataset.deleteProjectId = project.id;
    deleteButton.title = `删除${projectDisplayName(project)}`;
    deleteButton.setAttribute("aria-label", deleteButton.title);
    deleteButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" /></svg>';
    item.append(openButton, deleteButton);
    list.append(item);
  });
}

function hasUnsavedChanges() {
  return Boolean($(".file-tab.active")?.classList.contains("dirty"));
}

function queueProjectAutoSave(delay = 700) {
  if (!currentProjectId) return;
  window.clearTimeout(projectAutoSaveTimer);
  projectAutoSaveTimer = window.setTimeout(() => {
    projectAutoSaveTimer = null;
    try {
      saveCurrentProject({ silent: true, statusMessage: "已自动保存到项目库" });
    } catch (error) {
      console.warn("项目自动保存失败", error);
      setEditorStatus("自动保存失败 · 请手动点击保存", "error");
    }
  }, delay);
}

function flushProjectAutoSave() {
  window.clearTimeout(projectAutoSaveTimer);
  projectAutoSaveTimer = null;
  if (!currentProjectId || !hasUnsavedChanges()) return true;
  try {
    saveCurrentProject({ silent: true, statusMessage: "已自动保存到项目库" });
    return true;
  } catch (error) {
    console.warn("无法在切换项目前保存", error);
    return false;
  }
}

function stopForProjectChange() {
  if (mixerRunTimer) window.clearTimeout(mixerRunTimer);
  mixerRunTimer = null;
  mixerRerunQueued = false;
  strudelRuntime.stop();
}

function activateSavedProject(project, { skipDirtyCheck = false, announce = true } = {}) {
  if (!project || project.id === currentProjectId && !skipDirtyCheck) {
    setProjectPickerOpen(false);
    return Boolean(project);
  }
  if (!skipDirtyCheck && hasUnsavedChanges() && !flushProjectAutoSave()
    && !window.confirm("当前项目自动保存失败，仍然要切换项目吗？")) return false;
  const restoredComposition = normalizeSavedComposition(project.composition);
  if (!restoredComposition || typeof project.code !== "string") {
    showToast("这个项目的数据已损坏，无法打开");
    return false;
  }

  stopForProjectChange();
  composition = restoredComposition;
  currentProjectId = project.id;
  $("#codeEditor").value = localizeGeneratedCode(project.code, composition);
  updateCompositionUI({ preserveCode: true });
  updateTransport(0, 0);
  setEditorDirty(false);
  setEditorStatus("已打开本机项目");
  localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, project.id);
  renderProjectList();
  setProjectPickerOpen(false);
  if (announce) {
    $("#chatMessages").innerHTML = `<article class="message agent-message"><div class="mini-avatar">智</div><div class="message-body"><div class="message-meta">脉冲 · 刚刚</div><div class="bubble"><p>已打开项目“${escapeHTML(composition.projectName)}”。你可以继续播放、编辑，或让 MiniMax 接着修改。</p></div></div></article>`;
    $("#promptStarters").style.display = "block";
    showToast(`已打开“${composition.projectName}”`);
  }
  return true;
}

function startNewProject({ skipDirtyCheck = false, announce = true } = {}) {
  if (!skipDirtyCheck && hasUnsavedChanges() && !flushProjectAutoSave()
    && !window.confirm("当前项目自动保存失败，仍然要新建项目吗？")) return false;
  stopForProjectChange();
  currentProjectId = createProjectId();
  composition = createComposition("deep house");
  composition.projectName = nextNewProjectName();
  $("#chatMessages").innerHTML = '<article class="message agent-message"><div class="mini-avatar">智</div><div class="message-body"><div class="message-meta">脉冲 · 刚刚</div><div class="bubble"><p>MiniMax 新项目已准备好。给我一个画面、情绪，或者只说一种风格。</p></div></div></article>';
  $("#promptStarters").style.display = "block";
  updateCompositionUI();
  updateTransport(0, 0);
  saveCurrentProject({ silent: true, statusMessage: "新项目已自动保存" });
  setProjectPickerOpen(false);
  if (announce) showToast(`“${composition.projectName}”已创建并自动保存`);
  return true;
}

function saveCurrentProject({ silent = false, statusMessage = "已保存到项目库" } = {}) {
  window.clearTimeout(projectAutoSaveTimer);
  projectAutoSaveTimer = null;
  const now = Date.now();
  const id = currentProjectId || createProjectId();
  const record = {
    id,
    code: $("#codeEditor").value,
    composition: JSON.parse(JSON.stringify(composition)),
    savedAt: now,
  };
  projectLibrary = [record, ...projectLibrary.filter((project) => project.id !== id)].slice(0, MAX_SAVED_PROJECTS);
  persistProjectLibrary();
  currentProjectId = id;
  localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, id);
  localStorage.removeItem(LEGACY_PROJECT_STORAGE_KEY);
  setEditorDirty(false);
  setEditorStatus(statusMessage);
  renderProjectList();
  if (!silent) showToast(`“${composition.projectName}”已保存到项目库`);
  return record;
}

function deleteSavedProject(projectId) {
  const project = projectLibrary.find((item) => item.id === projectId);
  if (!project) return;
  const name = projectDisplayName(project);
  if (!window.confirm(`确定永久删除项目“${name}”吗？`)) return;
  const wasCurrent = projectId === currentProjectId;
  projectLibrary = projectLibrary.filter((item) => item.id !== projectId);
  try {
    persistProjectLibrary();
    if (wasCurrent) {
      currentProjectId = null;
      localStorage.removeItem(ACTIVE_PROJECT_STORAGE_KEY);
      if (projectLibrary.length) activateSavedProject(projectLibrary[0], { skipDirtyCheck: true, announce: false });
      else startNewProject({ skipDirtyCheck: true, announce: false });
    } else {
      renderProjectList();
    }
    showToast(`已删除“${name}”`);
  } catch (error) {
    console.warn("无法删除本地项目", error);
    showToast("删除失败，请检查浏览器存储权限");
  }
}

function restoreSavedProject() {
  try {
    loadProjectLibrary();
    if (!projectLibrary.length) {
      renderProjectList();
      return false;
    }
    const activeId = localStorage.getItem(ACTIVE_PROJECT_STORAGE_KEY);
    const preferred = projectLibrary.find((project) => project.id === activeId) || projectLibrary[0];
    return activateSavedProject(preferred, { skipDirtyCheck: true, announce: false });
  } catch (error) {
    console.warn("无法恢复本地项目库", error);
    projectLibrary = [];
    renderProjectList();
    return false;
  }
}

function updateLineNumbers() {
  const editor = $("#codeEditor");
  const lineCount = editor.value.split("\n").length;
  $("#lineNumbers").textContent = Array.from({ length: lineCount }, (_, index) => index + 1).join("\n");
  $("#lineNumbers").scrollTop = editor.scrollTop;
}

function setEditorDirty(dirty) {
  $(".file-tab.active")?.classList.toggle("dirty", dirty);
  if (dirty) queueProjectAutoSave();
}

function setEditorStatus(message, state = "ok") {
  const status = $(".editor-status span:first-child");
  status.replaceChildren();
  const dot = document.createElement("i");
  dot.className = `status-ok ${state}`;
  status.append(dot, document.createTextNode(` ${message}`));
}

function focusEditorLine(line) {
  const editor = $("#codeEditor");
  const lines = editor.value.split("\n");
  const target = Math.max(0, Math.min(lines.length - 1, line - 1));
  const start = lines.slice(0, target).reduce((length, value) => length + value.length + 1, 0);
  editor.focus();
  editor.setSelectionRange(start, start + lines[target].length);
}

function updatePlayingUI(playing) {
  $("#playBtn").classList.toggle("is-playing", playing);
  $("#playBtn").setAttribute("aria-label", playing ? "暂停" : "播放");
  $(".live-state").classList.toggle("playing", playing);
  $("#liveStateText").textContent = playing ? "正在播放" : "准备播放";
}

function updateTransport(step, absoluteStep) {
  const percent = (absoluteStep / (audio.totalSteps - 1)) * 100;
  const timeline = $("#timeline");
  timeline.value = percent;
  updateRangeFill(timeline);
  const elapsed = (absoluteStep / 4) * (60 / composition.bpm);
  $("#currentTime").textContent = formatTime(elapsed);
  $("#barCount").textContent = String(Math.floor(absoluteStep / 16) + 1).padStart(2, "0");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function addMessage(role, content, extra = "") {
  const messages = $("#chatMessages");
  const article = document.createElement("article");
  article.className = `message ${role === "user" ? "user-message" : "agent-message"}`;
  article.innerHTML = `${role === "agent" ? '<div class="mini-avatar">智</div>' : ""}<div class="message-body"><div class="message-meta">${role === "user" ? "你" : "脉冲"} · 刚刚</div><div class="bubble">${content}${extra}</div></div>`;
  messages.appendChild(article);
  messages.scrollTop = messages.scrollHeight;
  return article;
}

async function requestMiniMaxComposition(prompt) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 95_000);
  try {
    const response = await fetch("/api/compose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        currentCode: $("#codeEditor").value,
        instrumentTracks: composition.instrumentTracks,
        deletedTracks: composition.deletedTracks,
      }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `MiniMax 请求失败（${response.status}）`);
    if (!data.code || !data.style || !data.bpm || !data.key) throw new Error("MiniMax 返回的编曲内容不完整");
    return data;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("MiniMax 生成超时，请稍后重试");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function applyMiniMaxComposition(result, prompt) {
  const base = createComposition(`${result.style} ${result.bpm} BPM ${result.key} ${prompt}`);
  base.prompt = prompt;
  base.projectName = String(result.title || base.projectName).trim().slice(0, 18) || base.projectName;
  const code = String(result.code).trim();
  const parsed = parsePatternCode(code, base);
  if (parsed.errors.length) {
    const first = parsed.errors[0];
    throw new Error(`MiniMax 生成的音乐模式第 ${first.line} 行有问题：${first.message}`);
  }
  composition = parsed.composition || base;
  composition.prompt = prompt;
  composition.projectName = base.projectName;
  composition.id = base.id;
  composition.label = STYLE_PRESETS[base.id].label;
  composition.drumLabel = STYLE_PRESETS[base.id].drumLabel;
  composition.bassLabel = STYLE_PRESETS[base.id].bassLabel;
  composition.chordLabel = STYLE_PRESETS[base.id].chordLabel;
  composition.leadLabel = STYLE_PRESETS[base.id].leadLabel;
  composition.instrumentTracks = normalizeClientInstrumentTracks(result.instrumentTracks);
  composition.deletedTracks = normalizeDeletedTracks(result.deletedTracks);
  const editor = $("#codeEditor");
  editor.value = code;
  editor.classList.remove("ai-updated");
  void editor.offsetWidth;
  editor.classList.add("ai-updated");
  window.setTimeout(() => editor.classList.remove("ai-updated"), 1300);
  updateCompositionUI({ preserveCode: true });
  setEditorDirty(true);
  const addedLabels = composition.instrumentTracks.map((track) => track.label).join("、");
  showToast(`主作品代码和声音分轨已更新${addedLabels ? ` · ${addedLabels}` : ""}`);
}

async function refreshMiniMaxStatus() {
  const state = $("#agentState");
  if (!state) return;
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    if (!response.ok) throw new Error();
    const data = await response.json();
    state.textContent = data.configured
      ? `${data.provider} ${data.model} 已连接`
      : "MiniMax 待配置 · 请设置 API 密钥";
  } catch (_) {
    state.textContent = "MiniMax 后端未连接 · 请用 F5 启动";
  }
}

async function generateFromPrompt(rawPrompt) {
  const prompt = rawPrompt.trim();
  if (!prompt || isGenerating) return;
  isGenerating = true;
  $("#sendPromptBtn").disabled = true;
  addMessage("user", `<p>${escapeHTML(prompt)}</p>`);
  const typing = addMessage("agent", '<div class="typing-dots"><i></i><i></i><i></i></div>');
  $("#promptStarters").style.display = "none";
  let phase = "minimax";

  try {
    $("#agentState").textContent = "MiniMax 正在编曲…";
    setEditorStatus("正在请求 MiniMax 智能编曲…", "pending");
    const result = await requestMiniMaxComposition(prompt);
    applyMiniMaxComposition(result, prompt);
    typing.remove();
    phase = "strudel";
    setEditorStatus("正在启动官方 Strudel 音频引擎…", "pending");
    await strudelRuntime.run($("#codeEditor").value);

    const extra = `<div class="composition-summary"><span>每分钟 ${composition.bpm} 拍</span><span>${escapeHTML(localizeKey(composition.key))}</span><span>${escapeHTML(composition.label)}</span></div>`;
    addMessage("agent", `<p>${escapeHTML(result.reply || "MiniMax 已完成编曲，真实 Strudel 轨道已经开始运行。")}</p><p class="muted-copy">主作品代码已自动覆盖并保存；由 ${escapeHTML(result.provider)} ${escapeHTML(result.model)} 编曲，官方 Strudel 网页音频引擎演奏。</p>`, extra);
    setEditorStatus("MiniMax 智能编曲 · 官方 Strudel 正在演奏");
    try {
      localStorage.setItem("pulsegrid.last", JSON.stringify({ prompt, composition: { bpm: composition.bpm, key: composition.key, id: composition.id } }));
    } catch (error) {
      console.warn("无法记录最近一次生成", error);
    }
  } catch (error) {
    if (typing.isConnected) typing.remove();
    if (phase === "minimax") {
      const message = error.message || "MiniMax 智能编曲失败";
      setEditorStatus(message, "error");
      addMessage("agent", `<p>MiniMax 暂时没有完成编曲：${escapeHTML(message)}</p><p class="muted-copy">密钥只应配置在项目的 .env 文件中，保存后刷新网页即可。</p>`);
      showToast(message);
    } else {
      const details = strudelErrorDetails(error);
      setEditorStatus(details.message, "error");
      addMessage("agent", `<p>MiniMax 已完成编曲，但没有成功启动真实 Strudel：${escapeHTML(details.message)}</p><p class="muted-copy">请确认网络可以访问采样服务器，然后刷新页面重试。</p>`);
      showToast(details.message);
    }
  } finally {
    isGenerating = false;
    $("#sendPromptBtn").disabled = false;
    refreshMiniMaxStatus();
  }
}

function translateStrudelMessage(message) {
  return String(message)
    .replace(/SyntaxError\s*:?/gi, "语法错误：")
    .replace(/ReferenceError\s*:?/gi, "引用错误：")
    .replace(/Unexpected token/gi, "出现意外符号")
    .replace(/is not defined/gi, "未定义")
    .replace(/no code to evaluate/gi, "没有可运行的代码")
    .replace(/sound ([^\s]+) not found[^\n]*/gi, "找不到声音 $1")
    .replace(/Failed to fetch/gi, "网络资源获取失败");
}

function strudelErrorDetails(error) {
  const rawMessage = String(error?.message || error || "Strudel 运行失败");
  const messageLine = rawMessage.match(/\((\d+):\d+\)/)?.[1] || rawMessage.match(/\bline\s+(\d+)/i)?.[1];
  const line = Number(error?.loc?.start?.line || error?.location?.start?.line || messageLine || 1);
  return { message: translateStrudelMessage(rawMessage), line: Number.isFinite(line) ? line : 1 };
}

async function parseEditorAndRun({ quiet = false } = {}) {
  const code = $("#codeEditor").value;
  syncMixerCardsFromSliderCode(code, { removeMissing: true });
  const result = parsePatternCode(code, composition);
  if (!result.errors.length && result.composition) {
    composition = result.composition;
    updateCompositionUI({ preserveCode: true });
  }
  setEditorStatus("正在由官方 Strudel 运行代码…", "pending");
  try {
    await strudelRuntime.run(code);
    setEditorStatus("官方 Strudel · 音乐模式正在演奏");
    if (!quiet) showToast("Strudel 音乐模式已运行");
    return true;
  } catch (error) {
    const details = strudelErrorDetails(error);
    setEditorStatus(`第 ${details.line} 行 · ${details.message}`, "error");
    if (!quiet) {
      focusEditorLine(details.line);
      showToast(`第 ${details.line} 行：${details.message}`);
    }
    return false;
  }
}

function replaceSliderDefault(variable, value) {
  const editor = $("#codeEditor");
  const expression = new RegExp(`((?:let|const)\\s+${variable}\\s*=\\s*slider\\(\\s*)-?\\d+(?:\\.\\d+)?`);
  if (!expression.test(editor.value)) return false;
  editor.value = editor.value.replace(expression, `$1${Number(value).toFixed(2)}`);
  updateLineNumbers();
  setEditorDirty(true);
  setEditorStatus("混音已更改 · 正在同步 Strudel", "pending");
  return true;
}

function scheduleMixerRerun() {
  if (!strudelRuntime.playing) return;
  if (mixerRunTimer || mixerRunInFlight) {
    mixerRerunQueued = true;
    return;
  }
  mixerRunTimer = window.setTimeout(async () => {
    mixerRunTimer = null;
    if (!strudelRuntime.playing) {
      mixerRerunQueued = false;
      return;
    }
    mixerRunInFlight = true;
    try {
      await strudelRuntime.run($("#codeEditor").value);
      setEditorStatus("官方 Strudel · 混音已同步");
    } catch (error) {
      const details = strudelErrorDetails(error);
      setEditorStatus(`第 ${details.line} 行 · ${details.message}`, "error");
    } finally {
      mixerRunInFlight = false;
      if (mixerRerunQueued && strudelRuntime.playing) {
        mixerRerunQueued = false;
        scheduleMixerRerun();
      } else {
        mixerRerunQueued = false;
      }
    }
  }, 70);
}

function scheduleSliderCardSync() {
  window.clearTimeout(sliderCardSyncTimer);
  sliderCardSyncTimer = window.setTimeout(() => {
    syncMixerCardsFromSliderCode($("#codeEditor").value, { removeMissing: true });
  }, 180);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function setupVisualizer() {
  const canvas = $("#visualizer");
  const context = canvas.getContext("2d");
  let time = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);
    time += 0.018;
    const gradient = context.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "rgba(255,121,93,.12)");
    gradient.addColorStop(0.45, "rgba(255,121,93,.95)");
    gradient.addColorStop(1, "rgba(156,124,255,.16)");
    context.strokeStyle = gradient;
    context.fillStyle = "rgba(255,121,93,.055)";
    context.shadowColor = "rgba(255,92,72,.45)";
    context.shadowBlur = 12;

    if (scopeMode === "bars") {
      const count = 54;
      const data = new Uint8Array(audio.analyser ? audio.analyser.frequencyBinCount : count);
      if (audio.analyser) audio.analyser.getByteFrequencyData(data);
      for (let index = 0; index < count; index += 1) {
        const value = audio.analyser ? data[index * 3] / 255 : 0;
        const barHeight = Math.max(2, value * height * 0.66);
        const barWidth = width / count - 2;
        context.fillStyle = index < count * 0.62 ? `rgba(255,121,93,${0.22 + value * 0.75})` : `rgba(156,124,255,${0.18 + value * 0.6})`;
        context.fillRect(index * (width / count), height / 2 - barHeight / 2, barWidth, barHeight);
      }
    } else {
      const length = 512;
      const data = new Uint8Array(length);
      if (audio.analyser) audio.analyser.getByteTimeDomainData(data);
      context.beginPath();
      let rms = 0;
      for (let index = 0; index < length; index += 1) {
        const normalized = audio.analyser ? (data[index] - 128) / 128 : 0;
        rms += normalized * normalized;
        const envelope = Math.sin((index / (length - 1)) * Math.PI) ** 0.34;
        const x = (index / (length - 1)) * width;
        const y = height / 2 + normalized * height * 0.7 * envelope;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      context.lineTo(width, height / 2);
      context.lineTo(0, height / 2);
      context.closePath();
      context.fill();
      const level = Math.sqrt(rms / length);
      $("#scopeDb").textContent = level > 0.001 ? Math.max(-60, Math.round(20 * Math.log10(level))) : "−∞";
    }
    context.shadowBlur = 0;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
}

function initEvents() {
  $("#projectSwitcherBtn").addEventListener("click", () => {
    setProjectPickerOpen($("#projectPopover").hidden);
  });
  $("#projectSearchInput").addEventListener("input", renderProjectList);
  $("#projectNewButton").addEventListener("click", () => startNewProject());
  $("#projectList").addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-project-id]");
    if (deleteButton) {
      deleteSavedProject(deleteButton.dataset.deleteProjectId);
      return;
    }
    const openButton = event.target.closest("[data-project-id]");
    if (!openButton) return;
    const project = projectLibrary.find((item) => item.id === openButton.dataset.projectId);
    activateSavedProject(project);
  });
  document.addEventListener("click", (event) => {
    if ($("#projectPopover").hidden) return;
    if (event.target.closest("#projectPopover") || event.target.closest("#projectSwitcherBtn")) return;
    setProjectPickerOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("#projectPopover").hidden) setProjectPickerOpen(false);
  });

  $("#promptForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#promptInput");
    const value = input.value;
    input.value = "";
    generateFromPrompt(value);
  });
  $("#promptInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      $("#promptForm").requestSubmit();
    }
  });
  $$("[data-prompt]").forEach((button) => button.addEventListener("click", () => generateFromPrompt(button.dataset.prompt)));

  $("#playBtn").addEventListener("click", () => {
    if (strudelRuntime.playing) strudelRuntime.stop();
    else parseEditorAndRun();
  });
  $("#restartBtn").addEventListener("click", async () => {
    strudelRuntime.stop();
    await parseEditorAndRun();
  });
  $("#runCodeBtn").addEventListener("click", parseEditorAndRun);

  $("#masterVolume").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    updateRangeFill(event.target);
    $("#masterValue").textContent = `${Math.round(value * 100)}%`;
    if (replaceSliderDefault("masterVol", value)) scheduleMixerRerun();
  });

  $("#trackGrid").addEventListener("input", (event) => {
    if (!event.target.matches(".track-volume")) return;
    const value = Number(event.target.value);
    const track = event.target.dataset.track;
    updateRangeFill(event.target);
    event.target.nextElementSibling.value = Math.round(value * 100);
    setTrackMixState(track, { volume: value, muted: false });
    $(`.mute-btn[data-track="${track}"]`)?.classList.remove("active");
    event.target.closest(".track-card").classList.remove("muted");
    if (replaceSliderDefault(getTrackVolumeVariable(track), value)) scheduleMixerRerun();
  });
  $("#trackGrid").addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".track-delete");
    if (deleteButton && event.currentTarget.contains(deleteButton)) {
      deleteCompositionTrack(deleteButton.dataset.track);
      return;
    }
    const button = event.target.closest(".mute-btn");
    if (!button || !event.currentTarget.contains(button)) return;
    const track = button.dataset.track;
    const state = getTrackMixState(track);
    const nextMuted = !state.muted;
    button.classList.toggle("active", nextMuted);
    button.closest(".track-card").classList.toggle("muted", nextMuted);
    setTrackMixState(track, { muted: nextMuted });
    if (replaceSliderDefault(getTrackVolumeVariable(track), nextMuted ? 0 : state.volume)) scheduleMixerRerun();
  });

  $("#codeEditor").addEventListener("input", () => {
    updateLineNumbers();
    setEditorDirty(true);
    setEditorStatus("已修改 · 按 Ctrl+回车运行", "pending");
    scheduleSliderCardSync();
  });
  $("#codeEditor").addEventListener("scroll", (event) => { $("#lineNumbers").scrollTop = event.target.scrollTop; });
  $("#codeEditor").addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      parseEditorAndRun();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      $("#saveBtn").click();
      return;
    }
    if (event.key !== "Tab") return;
    event.preventDefault();
    const editor = event.target;
    const start = editor.selectionStart;
    editor.value = `${editor.value.slice(0, start)}  ${editor.value.slice(editor.selectionEnd)}`;
    editor.selectionStart = editor.selectionEnd = start + 2;
    updateLineNumbers();
    setEditorDirty(true);
    setEditorStatus("已修改 · 按 Ctrl+回车运行", "pending");
    scheduleSliderCardSync();
  });

  $$(".scope-switch button").forEach((button) => button.addEventListener("click", () => {
    scopeMode = button.dataset.scope;
    $$(".scope-switch button").forEach((item) => item.classList.toggle("active", item === button));
  }));

  $("#copyBtn").addEventListener("click", async () => {
    const editor = $("#codeEditor");
    try {
      await navigator.clipboard.writeText(editor.value);
    } catch (_) {
      editor.select();
      document.execCommand("copy");
      editor.setSelectionRange(0, 0);
    }
    showToast("代码已复制到剪贴板");
  });
  $("#clearCodeBtn").addEventListener("click", () => {
    const editor = $("#codeEditor");
    if (!editor.value.trim()) {
      showToast("主作品代码已经是空的");
      return;
    }
    if (!window.confirm("确定清空主作品中的全部代码吗？播放也会停止。")) return;
    stopForProjectChange();
    editor.value = "";
    updateLineNumbers();
    setEditorDirty(true);
    setEditorStatus("代码已清空 · 保存后会更新项目", "pending");
    editor.focus();
    showToast("主作品代码已清空");
  });
  $("#saveBtn").addEventListener("click", () => {
    try {
      saveCurrentProject();
    } catch (error) {
      console.warn("无法保存本地项目", error);
      showToast("保存失败，请检查浏览器存储权限");
    }
  });
  $("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([$("#codeEditor").value], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${composition.projectName.toLowerCase().replace(/\s+/g, "-")}.strudel`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Strudel 代码已导出");
  });
  $("#newSessionBtn").addEventListener("click", () => startNewProject());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushProjectAutoSave();
  });
  window.addEventListener("beforeunload", flushProjectAutoSave);
}

function init() {
  const restored = restoreSavedProject();
  if (!restored) startNewProject({ skipDirtyCheck: true, announce: false });
  $$('input[type="range"]').forEach(updateRangeFill);
  initEvents();
  refreshMiniMaxStatus();
  setupVisualizer();
  if (window.strudel && typeof (window.initStrudel || window.strudel.initStrudel) === "function") {
    strudelRuntime.ensure().catch((error) => console.warn("官方 Strudel 初始化失败", error));
  } else {
    strudelRuntime.setState("官方 Strudel 音频引擎加载失败 · 请刷新页面", "error");
  }
  if (restored) window.setTimeout(() => showToast("已恢复上次保存的项目"), 200);
}

init();
