const $ = (selector) => document.querySelector(selector);
const state = { authenticated: false, loading: false, stats: null, timer: 0 };

const EVENT_LABELS = {
  play: "播放了主作品",
  ai_compose: "完成一次 AI 编曲",
  sound_preview: "试听了音色",
  code_run: "运行了 Strudel 代码",
  project_save: "保存了项目",
};

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(Number(value || 0));
}

function formatTime(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || `请求失败（${response.status}）`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function showLogin(session = {}) {
  window.clearInterval(state.timer);
  state.timer = 0;
  state.authenticated = false;
  $("#bootState").hidden = true;
  $("#dashboardView").hidden = true;
  $("#loginView").hidden = false;
  $("#setupNote").hidden = session.configured !== false;
  $("#adminPassword").focus();
}

function showDashboard() {
  state.authenticated = true;
  $("#bootState").hidden = true;
  $("#loginView").hidden = true;
  $("#dashboardView").hidden = false;
}

function startAutoRefresh() {
  window.clearInterval(state.timer);
  state.timer = window.setInterval(() => {
    if (document.visibilityState === "visible") loadStats();
  }, 60_000);
}

function renderRankList(container, items) {
  container.replaceChildren();
  if (!items?.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "暂时还没有数据";
    container.append(empty);
    return;
  }
  const maximum = Math.max(...items.map((item) => Number(item.count) || 0), 1);
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "rank-row";
    const content = document.createElement("div");
    const labelLine = document.createElement("p");
    const label = document.createElement("span");
    const count = document.createElement("span");
    label.textContent = item.label || "未知";
    count.textContent = formatNumber(item.count);
    labelLine.append(label, count);
    const bar = document.createElement("div");
    bar.className = "rank-bar";
    const progress = document.createElement("i");
    progress.style.width = `${Math.max(3, (Number(item.count) / maximum) * 100)}%`;
    bar.append(progress);
    content.append(labelLine, bar);
    row.append(content);
    container.append(row);
  });
}

function renderActivity(items) {
  const container = $("#activityList");
  container.replaceChildren();
  if (!items?.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "产生播放或编曲操作后会显示在这里";
    container.append(empty);
    return;
  }
  items.slice(0, 8).forEach((item) => {
    const article = document.createElement("article");
    article.className = "activity-item";
    const title = document.createElement("strong");
    const value = document.createElement("span");
    const time = document.createElement("time");
    title.textContent = EVENT_LABELS[item.name] || "网站互动";
    value.textContent = item.value || "脉冲音格";
    time.textContent = formatTime(item.at);
    article.append(title, value, time);
    container.append(article);
  });
}

function drawTrendChart(items) {
  const canvas = $("#trendChart");
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const width = rect.width;
  const height = rect.height;
  const padding = { top: 16, right: 16, bottom: 30, left: 34 };
  const chartWidth = Math.max(1, width - padding.left - padding.right);
  const chartHeight = Math.max(1, height - padding.top - padding.bottom);
  const values = items.flatMap((item) => [Number(item.visitors) || 0, Number(item.pageviews) || 0]);
  const maxValue = Math.max(4, ...values);
  context.clearRect(0, 0, width, height);
  context.font = "8px IBM Plex Mono, monospace";
  context.textAlign = "right";
  context.textBaseline = "middle";
  for (let line = 0; line <= 4; line += 1) {
    const y = padding.top + (chartHeight / 4) * line;
    context.strokeStyle = "rgba(255,255,255,.055)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
    context.fillStyle = "#555761";
    context.fillText(String(Math.round(maxValue * (1 - line / 4))), padding.left - 8, y);
  }
  if (!items.length) return;
  const pointX = (index) => padding.left + (items.length === 1 ? chartWidth / 2 : (index / (items.length - 1)) * chartWidth);
  const pointY = (value) => padding.top + chartHeight - (Number(value || 0) / maxValue) * chartHeight;
  const drawLine = (key, color, fill) => {
    const gradient = context.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    gradient.addColorStop(0, fill);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.beginPath();
    items.forEach((item, index) => {
      const x = pointX(index);
      const y = pointY(item[key]);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.lineTo(pointX(items.length - 1), padding.top + chartHeight);
    context.lineTo(pointX(0), padding.top + chartHeight);
    context.closePath();
    context.fillStyle = gradient;
    context.fill();
    context.beginPath();
    items.forEach((item, index) => {
      const x = pointX(index);
      const y = pointY(item[key]);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
  };
  drawLine("pageviews", "#9c7cff", "rgba(156,124,255,.12)");
  drawLine("visitors", "#ff795d", "rgba(255,121,93,.14)");
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = "#555761";
  const labelStep = Math.max(1, Math.ceil(items.length / 7));
  items.forEach((item, index) => {
    if (index % labelStep === 0 || index === items.length - 1) context.fillText(item.label, pointX(index), height - 19);
  });
}

function renderStats(data) {
  state.stats = data;
  const { overview, events } = data;
  $("#todayVisitors").textContent = formatNumber(overview.todayVisitors);
  $("#todayPageviews").textContent = formatNumber(overview.todayPageviews);
  $("#onlineVisitors").textContent = formatNumber(overview.onlineVisitors);
  $("#totalVisitors").textContent = formatNumber(overview.totalVisitors);
  $("#totalPageviews").textContent = formatNumber(overview.totalPageviews);
  $("#todayVisitorsCompare").textContent = `昨日 ${formatNumber(overview.yesterdayVisitors)} 人`;
  $("#todayPageviewsCompare").textContent = `昨日 ${formatNumber(overview.yesterdayPageviews)} 次`;
  $("#eventPlay").textContent = formatNumber(events.play);
  $("#eventAi").textContent = formatNumber(events.ai_compose);
  $("#eventSound").textContent = formatNumber(events.sound_preview);
  $("#eventCode").textContent = formatNumber(events.code_run);
  $("#lastUpdated").textContent = `更新于 ${formatTime(data.generatedAt)} · 每分钟自动刷新`;
  const persistent = data.storage === "postgres";
  $("#storageBadge").textContent = persistent ? "PostgreSQL 持久存储" : "临时内存存储";
  $("#storageBadge").classList.toggle("memory", !persistent);
  $("#databaseWarning").hidden = persistent;
  renderRankList($("#sourceList"), data.sources);
  renderRankList($("#deviceList"), data.devices);
  renderRankList($("#browserList"), data.browsers);
  renderActivity(data.recentEvents);
  requestAnimationFrame(() => drawTrendChart(data.daily || []));
}

async function loadStats() {
  if (state.loading || !state.authenticated) return;
  state.loading = true;
  $("#refreshButton").disabled = true;
  try {
    const data = await api(`/api/admin/stats?days=${encodeURIComponent($("#rangeSelect").value)}`);
    renderStats(data);
  } catch (error) {
    if (error.status === 401) showLogin({ configured: true });
    else $("#lastUpdated").textContent = error.message;
  } finally {
    state.loading = false;
    $("#refreshButton").disabled = false;
  }
}

async function boot() {
  try {
    const session = await api("/api/admin/session");
    if (session.authenticated) {
      showDashboard();
      await loadStats();
      startAutoRefresh();
    } else showLogin(session);
  } catch (error) {
    showLogin({ configured: true });
    $("#loginError").textContent = `后台连接失败：${error.message}`;
  }
}

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = $("#adminPassword").value;
  $("#loginError").textContent = "";
  $("#loginButton").disabled = true;
  try {
    await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
    $("#adminPassword").value = "";
    showDashboard();
    await loadStats();
    startAutoRefresh();
  } catch (error) {
    $("#loginError").textContent = error.message;
  } finally {
    $("#loginButton").disabled = false;
  }
});

$("#togglePassword").addEventListener("click", () => {
  const input = $("#adminPassword");
  const visible = input.type === "text";
  input.type = visible ? "password" : "text";
  $("#togglePassword").textContent = visible ? "显示" : "隐藏";
});
$("#refreshButton").addEventListener("click", loadStats);
$("#rangeSelect").addEventListener("change", loadStats);
$("#logoutButton").addEventListener("click", async () => {
  await api("/api/admin/logout", { method: "POST", body: "{}" }).catch(() => {});
  window.clearInterval(state.timer);
  showLogin({ configured: true });
});
window.addEventListener("resize", () => { if (state.stats) drawTrendChart(state.stats.daily || []); });

boot();
