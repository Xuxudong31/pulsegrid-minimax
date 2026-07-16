# 脉冲音格 · MiniMax AI

一个接入 MiniMax 与 Official Strudel WebAudio 的浏览器音乐工作台：在左侧用自然语言描述音乐，MiniMax 会生成编曲计划，后端将它转换成受控、可编辑、可由真实 Strudel 运行的代码。

## 配置 MiniMax API 密钥

1. 在 MiniMax 开放平台的“接口密钥”页面创建 API Key。
2. 打开项目中已经创建好的 `.env`。
3. 在 `.env` 中填写密钥：

```dotenv
MINIMAX_API_KEY=你的密钥
MINIMAX_MODEL=MiniMax-M3
MINIMAX_REASONING=true
```

`.env` 已加入 `.gitignore`，后端会在请求时重新读取它。保存后刷新网页即可，无须重新启动服务。不要把密钥写进 `app.js`、`index.html`，也不要把密钥发送到聊天中。

## 运行

在 VS Code 中按 `F5`，或在项目目录运行：

```powershell
npm start
```

浏览器打开 `http://localhost:4173`。现在必须通过本项目的 Node 后端启动，不能再双击 `index.html` 或使用普通 Python 静态服务器，否则 `/api/compose` 不存在。第一次播放时，浏览器会请求解锁音频，这是 Web Audio 的正常安全机制。

## 发布网页版

项目包含 Node 后端，不能只使用 GitHub Pages，否则 MiniMax 编曲接口无法运行。仓库根目录已经提供 `render.yaml`，可直接通过 Render 发布完整网页版：

[一键部署到 Render](https://render.com/deploy?repo=https://github.com/Xuxudong31/pulsegrid-minimax)

1. 将项目推送到 GitHub，确认 `.env` 没有被提交。
2. 在 Render 中选择 **New → Blueprint**，连接这个 GitHub 仓库。
3. 首次创建时，在 `MINIMAX_API_KEY` 输入框填写 MiniMax 密钥，并在 `ADMIN_PASSWORD` 输入框设置后台密码。
4. 部署完成后分享 Render 提供的 `https://你的服务名.onrender.com` 地址。

以后推送到默认分支会自动重新部署。密钥只保存在 Render 的环境变量中，不写入 GitHub。

## Agent 长期记忆与数据后台

部署后访问 `https://你的服务名.onrender.com/admin`，使用 Render 环境变量中的 `ADMIN_PASSWORD` 登录。后台统计今日/累计访客、浏览量、最近 5 分钟在线人数、访问趋势、来源、设备、浏览器，以及作品播放、AI 编曲、代码运行和音色试听次数。

同一个 PostgreSQL 数据库还会自动建立 Agent 记忆表，保存有意义的代码快照和来源，包括手动编程、粘贴、AI 创作、运行、保存、清空和混音调整。AI 在下一次创作前会检索当前用户的近期项目、历史反馈和偏好，再进行一次请求一致性检查；发现缺少指定乐器、节奏长度错误或无效结构时，会自动要求模型修正。

页面左下角提供“Agent 学习记忆”开关，关闭后不再记录新的个人创作版本。系统不记录原始 IP，疑似 API Key、Token 和密码会在入库前脱敏；用户之间不会共享原始代码，跨用户只使用匿名的正向风格统计。后台可以查看版本来源、AI 交互次数、正向反馈和已形成的学习规则，但不直接展示完整创作代码。

Render Blueprint 会创建名为 `pulsegrid-analytics` 的 PostgreSQL 数据库并自动注入 `DATABASE_URL`，所需表会在服务启动时自动建立；本地未配置数据库时会退回临时内存模式，重启后本地记忆和统计会清空。

## 已实现

- MiniMax-M3 中文/英文自然语言智能编曲、推理与二次自检修复
- PostgreSQL 长期记忆：保存关键代码版本、代码来源、执行结果与用户反馈
- 基于当前项目和历史偏好的检索增强，明确保留未要求修改的 BPM、调性、节奏和分轨
- AI 回复支持“有帮助 / 需改进”反馈，并将结果转化为当前用户后续创作规则
- 密钥仅由本机 Node 后端读取，浏览器无法获取
- 结构化编曲参数校验，后端生成受控 Strudel 代码
- 支持在当前作品上继续修改，例如“低音再重一点”
- 每次 AI 编曲都会自动覆盖主作品代码并保存，支持口琴、长笛、萨克斯、钢琴、吉他等明确乐器音色
- 左上角项目库支持新建、搜索、打开和删除项目；新项目立即保存，编辑后约 0.7 秒自动保存
- 自动迁移旧版单项目存档，最多保留 50 个本机项目
- 主作品工具栏支持一键清空代码，并同步停止当前播放
- House、Techno、Lo-fi、Ambient、Synthwave、Trance、DnB、Trap 风格
- BPM、调性、明暗、能量与复杂度识别
- Official `@strudel/web@1.3.0` REPL 运行时、调度器、鼓机采样与合成器
- 根据所有 `slider(..., "分轨名")` 自动生成独立分轨，每个控制器只改变对应声部的实际音量
- 波形/频谱直接分析 Strudel 的真实总输出，播放时随音乐变化、停止时归零
- Strudel 风格代码生成、编辑、解析、复制与导出
- 支持 `stack()`、`s()`、`note()`、`.struct()`、`.scale()`、`.s()`、`.gain()`、`slider()` 与常用 `*4` mini-notation
- 代码校验、错误行定位，以及 `Ctrl/Cmd + Enter` 运行、`Ctrl/Cmd + S` 保存
- 本地保存、刷新恢复与响应式布局
- 中文 `/admin` 数据后台、匿名访客统计、音乐互动统计与 Agent 学习指标

MiniMax 调用需要联网和可用额度；Strudel 运行库已随项目本地提供，鼓机与乐器采样仍需联网按需加载。浏览器首次播放需要由用户点击按钮解锁音频。

## Strudel 许可

本项目通过 `@strudel/web` 集成 Strudel。Strudel 使用 AGPL-3.0-or-later 许可；如果发布或分发本项目，请遵守 [Strudel 官方许可说明](https://strudel.cc/technical-manual/project-start/#respect-the-license)。
