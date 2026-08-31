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

### 激励与留存

- GitHub 风格**学习日历热力图**、累计学时、连续天数统计
- **成就墙**（40+ 枚成就，含 9 枚 AGI 里程碑）与 15 级称号
- **间隔复习队列**、个性化每日目标、**可复制的每日 / 周 / 月进度报告**
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

### Motivation & retention

- GitHub-style **learning heatmap**, cumulative study time, and streak tracking
- An **achievement wall** (40+ badges, including 9 AGI milestones) and 15 title levels
- **Spaced-repetition review queue**, personalized daily goals, and **copyable daily / weekly / monthly progress reports**
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
