# agi-learning-workbench

> 🤖 **Built with AI assistance** · 本仓库由 AI 辅助搭建

A zero-basis, long-term interactive learning workbench that walks you from your very first line of code all the way to the AGI engineering frontier.

---

## 中文版

### 这是什么

`agi-learning-workbench` 是一个为零基础、每天 1–2 小时、目标是成为 **AGI（通用人工智能）工程师** 的学习者设计的**长期交互式学习工作台**。

它在原有 C++ 课程地基上，补齐了通往 AGI 工程的完整路径：Python 工程工具链 → 数学基石（线代 / 微积分 / 概率）→ 机器学习 → 深度学习 → 强化学习 / 大语言模型 / 多模态 / Agent 前沿。

### 内容规模

- **12 大篇章 · 53 个阶段 · 264 节**
- 每节含：讲解 + 可运行代码样例 + 「学完你能做到」目标 + 自测题
- 每个阶段含：阶段测评（3 题）+ 编程实战（lab，附参考解答）

### 两条学习路线（顶部一键切换）

页面右上角提供 **路线切换** 按钮，可在两条路线间自由切换：

- **C++ 路线（默认）**：先打 C++ 地基（语法 / 指针 / 面向对象 / STL / 工程素养），再到 Python 与数学基石，最后进入机器学习 / 深度学习 / AGI 前沿。
- **🐍 Python 路线**：从零开始学 Python，直奔数学基石 → 科学计算 → 机器学习 → 深度学习 → 通用人工智能前沿；把 C++ 系统纵深（语法 / 算法 / 工程素养 / 求职）作为**可选深造专题**放在 AGI 之后。

两条路线**共用同一套 53 阶段课程内容与全部学习进度**（做题、打卡、成就、笔记、复习均按课程 id 共享），切换路线不会丢失任何记录。

### 激励与留存

- GitHub 风格**学习日历热力图**、累计学时、连续天数统计
- **成就墙**（40+ 枚成就，含 9 枚 AGI 里程碑）与 15 级称号
- **间隔复习队列**、个性化每日目标、**可复制的每日 / 周 / 月进度报告**
- **记忆续学**：自动记住「最后观看」的课程（即使已标记完成），在「今日任务」顶部高光「继续上次」、在「课程全景」对应课程与阶段打上 📍 标记，次日/下次打开即可一键接着学
- **智能侧边栏**：篇章导航按页面实际位置穿插在功能键之间；支持一键**收纳到屏幕左侧**、**当前区块高亮**（滚动联动）、**宽度拖拽调节**（记忆宽度），均可本地持久化
- **🪙 星币经济 · 主页风格商店**：学习 (+5)、复习 (+2)、打卡 (+3)、通关阶段测评 (+10)、完成实战 (+15) 均可赚取星币；星币**仅可用于解锁主页配色风格**（纯外观，5 套内置风格：晨曦蓝/暗夜霓虹/樱粉温柔/极简纸感/赛博青），绝不 pay-to-win 跳过学习
- **🔒 科学防过载保护**：每日新学节数默认上限 4（可在设置中调整 1–10），保护学习效果；待复习课程积压超过阈值（默认 8）时锁定新学、强制先巩固记忆。被锁时首页展示醒目横幅、课程弹窗按钮禁用并说明原因
- 数据本机 `localStorage` 保存，支持**导出 / 导入 / 重置**

### 技术特点

- **单文件 HTML 应用 + 外部课程数据 + Service Worker**，无后端、无构建步骤、无第三方依赖
- 打开即用，**可离线**（PWA）
- 纯静态，可直接托管到 **GitHub Pages**

### 本地运行

直接双击 `index.html` 即可在浏览器打开使用。

> 若想启用**离线 / PWA（Service Worker）** 能力，需通过 http(s) 访问（而非 `file://`）。可用任意静态服务器，例如：
>
> ```bash
> # Python 3
> python -m http.server 8080
> # 然后访问 http://localhost:8080
> ```
>
> 用 `file://` 直接打开时，浏览器会拒绝注册 Service Worker，属正常现象，不影响其他功能。

### 部署到 GitHub Pages

1. 把本仓库三个文件推送到 GitHub：`index.html`、`cpp-extra-data.js`、`cpp-sw.js`
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)`
3. 等待发布完成后，访问分配的 `https://<user>.github.io/<repo>/` 即可

### ⚠️ AI 辅助搭建声明

本仓库（包括全部课程文案、界面与代码）由 **AI 辅助生成 / 组装**。内容按「零基础 → AGI 工程」路线整理，但技术细节请以权威资料为准，使用前请自行核对。仓库仅供学习交流，按现状提供，不作任何担保。

---

## English

### What is this

`agi-learning-workbench` is a long-term, interactive learning workbench for absolute beginners studying ~1–2 hours a day with the goal of becoming an **AGI (Artificial General Intelligence) engineer**.

Built on a C++ foundation, it lays out the full path to AGI engineering: a Python toolchain → the math bedrock (linear algebra / calculus / probability) → machine learning → deep learning → the frontier of reinforcement learning / large language models / multimodality / Agents.

### Scope

- **12 chapters · 53 stages · 264 lessons**
- Each lesson includes: explanation + runnable code sample + a "what you can do after this" target + a self-check quiz
- Each stage includes: a stage quiz (3 questions) + a coding lab (with reference solution)

### Two learning tracks (switch from the top bar)

The top-right of the page has a **track switcher** so you can move between two tracks freely:

- **C++ track (default)**: build the C++ foundation first (syntax / pointers / OOP / STL / engineering), then Python and the math bedrock, and finally machine learning / deep learning / the AGI frontier.
- **🐍 Python track**: start learning Python from zero and go straight to the math bedrock → scientific computing → machine learning → deep learning → the AGI frontier; the C++ systems depth (syntax / algorithms / engineering / job prep) is offered as an **optional advanced track after AGI**.

Both tracks **share the same 53-stage curriculum and all of your progress** (exercises, check-ins, achievements, notes, reviews are keyed by lesson id), so switching tracks never loses any of your records.

### Motivation & retention

- GitHub-style **learning heatmap**, cumulative study time, and streak tracking
- An **achievement wall** (40+ badges, including 9 AGI milestones) and 15 title levels
- **Spaced-repetition review queue**, personalized daily goals, and **copyable daily / weekly / monthly progress reports**
- **Resume-where-you-left-off**: the app remembers the **last lesson you viewed** (even if marked done), highlights a "Continue" card at the top of *Today's Tasks* and marks the exact lesson & stage with a 📍 in the *Course Panorama* — reopen the next day and pick up with one click
- **Smart sidebar**: the chapter nav is interleaved at its real page position; it can **collapse to the left screen edge**, **highlight the section you're viewing** (scroll-synced), and be **drag-resized** (width is remembered) — all persisted locally
- **🪙 Coin economy · Homepage style shop**: earn coins by learning (+5), reviewing (+2), check-ins (+3), passing stage quizzes (+10), and finishing labs (+15); coins can **only be spent unlocking cosmetic homepage color themes** (5 built-in: Dawn Blue / Neon Night / Sakura / Paper / Cyber) — never pay-to-win
- **🔒 Science-based anti-overload guard**: by default caps new lessons at **4/day** (adjustable 1–10 in settings) to protect learning quality; when the review backlog exceeds a threshold (default 8), new lessons are **locked** until reviews are done. A prominent banner appears on the dashboard and the lesson-modal button is disabled with the reason
- Progress is saved in the browser via `localStorage`, with **export / import / reset** support

### Technical notes

- A **single-file HTML app + external course data + Service Worker** — no backend, no build step, no third-party dependencies
- Opens instantly and works **offline** (PWA)
- Purely static, deploys straight to **GitHub Pages**

### Run locally

Just open `index.html` in a browser.

> To enable the **offline / PWA (Service Worker)** capability, serve it over http(s) rather than `file://`. Any static server works, e.g.:
>
> ```bash
> # Python 3
> python -m http.server 8080
> # then open http://localhost:8080
> ```
>
> When opened via `file://`, the browser refuses to register the Service Worker — this is expected and does not affect the rest of the app.

### Deploy to GitHub Pages

1. Push the three files to GitHub: `index.html`, `cpp-extra-data.js`, `cpp-sw.js`
2. **Settings → Pages → Build and deployment → Source**: `Deploy from a branch`, branch `main`, directory `/ (root)`
3. Once published, visit `https://<user>.github.io/<repo>/`

### ⚠️ AI-assisted build disclosure

This repository — including all curriculum content, UI, and code — was **generated / assembled with AI assistance**. The material is organized along a "zero-basis → AGI engineering" path, but please verify technical details against authoritative sources before relying on them. Provided as-is for learning purposes, without warranty of any kind.

---

## 📦 Files

| File | Purpose |
| --- | --- |
| `index.html` | The workbench app (entry point) |
| `cpp-extra-data.js` | External course data (stages, lessons, labs, quizzes) |
| `cpp-sw.js` | Service Worker for offline caching |

## 🏷️ Topics

`agi` · `artificial-intelligence` · `machine-learning` · `deep-learning` · `llm` · `learning-roadmap` · `self-study` · `cpp` · `python` · `static-site` · `pwa` · `offline-first`
