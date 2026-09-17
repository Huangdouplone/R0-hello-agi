# R0:hello agi

**R0：从零开始的 agi 之路**

> © **制作者 / Creator: Bilibili 黄豆666 (huangdouplone)** · 版权所有 / All rights reserved.
>
> 内容与代码由 **AI 辅助生成 / 组装**，技术细节请以官方文档与权威教材为准。

从零基础起步、终到 AGI 工程方向的长期编程课程。**纯静态、零依赖、可离线**：单文件 HTML 应用 + 外部课程数据脚本 + Service Worker，无后端、无构建步骤、无第三方运行时依赖。

*A long-form, zero-basis programming course heading toward AGI engineering. Purely static, dependency-free and offline-capable: a single-file HTML app plus external data modules and a Service Worker.*

---

## 中文

### 1. 项目边界

| 维度 | 说明 |
| --- | --- |
| 形态 | 单文件 `index.html`（UI + 全部逻辑）+ 7 个外部数据脚本 + 1 个 Service Worker |
| 运行 | 双击 `index.html` 即可运行；通过 http(s) 托管时自动启用离线缓存（PWA） |
| 存储 | 全部学习数据存于浏览器 `localStorage`，无服务端、无账号体系 |
| 依赖 | 零外部依赖。不引用任何 CDN、字体、图表库或前端框架，图表为手写内联 SVG |
| 适配 | PC / 移动端响应式；移动端可「添加到主屏幕」当 App 使用 |

### 2. 内容规模（实测）

| 指标 | 数值 |
| --- | --- |
| 阶段池 | **53**（两条路线共用） |
| 课节总数 | **264** |
| 阶段测评题 | **477**（choice 265 · judge 106 · fill 106） |
| 每阶段题库 / 抽题数 | 9 / 3（`AGI_QUIZ_COUNT = 3`） |
| 编程实战 | **266**（每阶段 5 道） |
| 成就 / 称号等级 | 39 / 15 |

### 3. 双路线设计

两条路线**共用同一池 53 个阶段与全部学习进度**（做题、打卡、成就、笔记、复习均按阶段 / 课节 `id` 共享），差异仅在**学习顺序与篇章结构**：

| 路线 | 篇章 | 阶段 | 课节 | 路径 |
| --- | ---: | ---: | ---: | --- |
| ⚙️ **C++（默认）** | 11 | 49 | 244 | C++ 地基 → 数学基石 → C++ 系统深入与实战 → 算法修炼 → 工程素养与求职 → 科学计算 → 机器学习 → 深度学习 → AGI 前沿 |
| 🐍 **Python** | 6 | 24 | 114 | Python 启航 → 数学基石 → 科学计算 → 机器学习 → 深度学习 → AGI 前沿（C++ 系统纵深作为可选深造专题） |

实现方式为两份显式的 id 顺序表与篇章区间：

```js
const MODE_ORDERS = { cpp: [...49 个 id], py: [...24 个 id] };
const MODE_PHASES = { cpp: [...11 篇章, range:[起, 止]], py: [...6 篇章] };
```

Python 路线独有的 4 个阶段（`py1`–`py4`）不在 C++ 路线的顺序表中，构成 49 + 4 = 53 的阶段池。切换路线只改变顺序视图，不触碰进度数据。

### 4. 技术架构

#### 4.1 加载顺序与脚本职责

```
cpp-extra-data.js   → EXTRA_STAGES / STAGE_META / LAB_ANSWERS / JOB_STAGES / AGI_STAGES
lang-en.js          → STAGE_EN / LESSON_EN（英文对照）
agi-quiz-extra.js   → AGI_QUIZ_EXTRA   每阶段 +2 测评题
agi-extra2.js       → AGI_QUIZ_EXTRA   每阶段 +2 判断 +2 填空
agi-lab-extra.js    → AGI_LAB_EXTRA    每阶段 +2 实战
agi-lab-extra2.js   → AGI_LAB_EXTRA    每阶段 +2 实战
agi-lab-en.js       → AGI_LAB_EN       原始实战（labs[0]）的英文对照
        ↓  启动期合并
_stageMap[id] = stage（含 lessons[] / quiz[] / lab + labs[]）
        ↓  单向读取
渲染层：renderAll() → 概览 / 路线 / 实战 / 篇章 …
```

关键约定：**阶段与篇章容器由 JS 用 `innerHTML` 重建**，需被脚本寻址的 `id` 一律挂在内层容器；交互统一走 `data-act` 全局事件委派。

#### 4.2 数据模型

```js
stage = {
  id, icon, name, desc, goal,
  lessons: [{ id, title, min, summary[], code, pit, ex:{q,a}, target }],
  quiz: [{ q, o:[…], a: 正确下标, why, type: "choice"|"judge"|"fill", ans }],
  lab:  { t, req[], starter, hint, xp },   // 原始实战，等价于 labs[0]
  labs: [ … ]                              // 运行期由 lab + 叠加层合并而成
}
```

#### 4.3 叠加层（overlay）扩展模式

新增题库与实战**不改动 `cpp-extra-data.js`**，而是以叠加层 + 启动期 `concat` 注入：

| 全局 | 内容 | 效果 |
| --- | --- | --- |
| `AGI_QUIZ_EXTRA` | 每阶段 +4 题（+2 判断 +2 填空） | 每阶段题库 9 题（抽 3） |
| `AGI_LAB_EXTRA` | 每阶段 +4 道实战 | 每阶段 5 道 / 全站 266 道 |
| `AGI_LAB_EN` | 原始实战（`labs[0]`）的英文对照 | 只补缺字段，不覆盖已有英文 |

合并时 `s.labs = (s.lab ? [s.lab] : []).concat(le[id])` —— **`labs[0]` 恒为原 `s.lab`**，因此旧进度键永不失效。

#### 4.4 题库与抽题

- **题型**：`choice` / `judge` / `fill`。判断题为双选项且同样参与乱序；填空题为 `<input class="fill-input">`。
- **答案归一化**：`agiNormAns` 做全角转半角、去空白与中英标点、转小写后再比对。
- **题型均衡抽题**：`agiDrawQuiz` 先为每种已存在的题型各保底抽 1 题，再随机填满剩余名额（本课程抽 3 题，即三种题型各 1 题）。
- **选项乱序保索引**：打乱选项时同步记录原索引，正确答案跟随移动。

#### 4.5 进度键与向后兼容

```js
labKey(sid, k) = k > 0 ? sid + "#" + k : sid
```

`k = 0` 沿用旧键（`sid`），`k ≥ 1` 使用 `sid#k`。新增实战题时**老用户进度零迁移**。统计实战总数须用 `totalLabs()`。

#### 4.6 i18n 机制与覆盖

| 机制 | 说明 |
| --- | --- |
| `t(zh)` | 中文原文作 key，命中 `I18N_EN[zh]` 则返回英文，否则原样返回 |
| `pick(o, f)` | 读取 `o[f + "_en"]`，为空则回退中文 `o[f]` |
| `STAGE_EN` / `LESSON_EN` | 阶段名 **53/53**、课节标题 **264/264** |
| `LAB_EN` / `AGI_LAB_EN` / `t_en` | 实战标题 **266/266** |

课节正文（讲解 / 示例 / 易错 / 思考）为中文。已知陷阱：模块级常量若在加载期直接求值会被烘焙成中文（须存 key、渲染时再 `t()`）；字典缺 key 时 `t()` 静默返回 key，界面会露出裸 key，需断言校验；动态 setter 漏挂语言刷新会导致切语言不更新。

#### 4.7 离线与 PWA

`cpp-sw.js` 为 Service Worker：
- **`ASSETS` 与 `<script src>` 的 URL 逐字符一致**（含 `?v=N`）。缓存以完整请求 URL 为键，裸文件名匹配不上带查询串的请求。
- 预缓存逐个 `add().catch()`，任一资源缺失只跳过它自己，不会让整批失败。
- 新增资源必须同时 **加入 ASSETS** 并 **bump `CACHE` 版本**。

#### 4.8 自检套件

`verify/` 为本地验证脚本（**不参与部署**），基于 playwright-core + 系统 Edge 无头运行，覆盖：内联/外部 JS 语法、SW ASSETS 与页面请求 URL 一致性、DOM id 死引用、`data-act` 分派覆盖、数据字段与下标合法性、选项越界与重复、填空答案非空、路线引用的阶段 id 存在性与篇章区间连续性、i18n key 泄漏与英文残留、空存档不崩，以及三种题型真实出现率与逐题判分的端到端回归。

> 关键经验：**抽查前先断言题库长度大于抽题数**（否则随机性归零）；**题库 / 数据键必须与路线引用的 `id` 严格一致**，写错会静默回退而不报错。

### 5. 学习机制

- **阶段测评**：每阶段 9 题库随机抽 3 题（单选 / 判断 / 填空，选项乱序）。
- **编程实战**：每阶段 5 道，附起始代码与提示，可一键生成 **AI 批改提示词** 交给任意大模型获取评分与建议。
- **间隔复习**：2 / 4 / 7 / 15 / 30 / 60 天队列 + 错题本。
- **每日上限保护**：每日新学默认上限 4 节（可调 1–10）；待复习积压超过阈值（默认 8）时锁定新学，强制先巩固。
- **激励**：学习日历热力图、累计学时、连续天数、39 枚成就（含 AGI 里程碑）、15 级称号、可复制的日 / 周 / 月进度报告。
- **星币经济**：学习 / 复习 / 打卡 / 测评 / 实战均可赚取星币，**仅用于解锁主页配色风格**（15 套），不做 pay-to-win。
- **记忆续学**：自动记录最后观看的课节（含已标记完成者），「今日任务」顶部高光「继续上次」。
- **数据自管**：导出 / 导入 / 重置。

### 6. 本地运行与部署

直接双击 `index.html` 即可使用。

> 需要**离线 / PWA** 能力时须通过 http(s) 访问（`file://` 下浏览器会拒绝注册 Service Worker，属正常现象，不影响其他功能）：
>
> ```bash
> python -m http.server 8080     # 然后访问 http://localhost:8080
> ```

**部署到 GitHub Pages**：将本目录全部文件（`index.html`、7 个数据脚本、`cpp-sw.js`）推送至仓库**根目录**，然后在 *Settings → Pages → Build and deployment → Source* 选择 `Deploy from a branch`、分支 `main`、目录 `/ (root)`。

### 7. 已知限制

1. **课节正文为中文**：界面框架、阶段名、课节标题、实战标题均已双语，正文（讲解 / 示例 / 易错 / 思考 / 题目）为中文。
2. **两条路线课时不等**：C++ 路线 49 阶段 / 244 节，Python 路线 24 阶段 / 114 节，进度按阶段 id 共享。
3. **数据存于本机**：清除浏览器数据会丢失进度，请定期导出备份。

### 8. 授权与声明

本仓库（含全部课程文案、界面与代码）由 **AI 辅助生成 / 组装**。内容按「零基础 → AGI 工程」路线整理，但技术细节请以权威资料为准，使用前请自行核对。仓库仅供学习交流，按现状提供，不作任何担保。授权条款见 `LICENSE.md`。

---

## English

### Overview

`R0:hello agi` is a long-form, zero-basis programming course whose single goal is to take someone who has never written code all the way to **AGI engineering**. It is a **purely static, dependency-free, offline-capable** single-file HTML app with 7 external data modules and a Service Worker — no backend, no build step, no third-party runtime dependency.

### Scope (measured)

| Metric | Value |
| --- | --- |
| Stage pool | **53** (shared by both tracks) |
| Lessons (total) | **264** |
| Stage-quiz questions | **477** (choice 265 · true-false 106 · fill-in 106) |
| Bank per stage / drawn per attempt | 9 / 3 |
| Coding labs | **266** (5 per stage) |
| Achievements / title levels | 39 / 15 |

### Two tracks

Both tracks share the **same pool of 53 stages and all progress** (exercises, check-ins, achievements, notes, reviews keyed by stage/lesson `id`). Only the learning order and chapter structure differ:

- **C++ track (default)** — 11 chapters / 49 stages / 244 lessons.
- **Python track** — 6 chapters / 24 stages / 114 lessons; C++ systems depth is offered as an optional advanced track afterwards.

This is implemented as two explicit id-order tables plus chapter ranges (`MODE_ORDERS` / `MODE_PHASES`). The four Python-only stages (`py1`–`py4`) are absent from the C++ order, giving 49 + 4 = 53. Switching tracks only changes the view order — never the progress data.

### Architecture

- **Data / logic separation.** `cpp-extra-data.js` holds the curriculum; `lang-en.js`, `agi-quiz-extra.js`, `agi-extra2.js`, `agi-lab-extra.js`, `agi-lab-extra2.js`, and `agi-lab-en.js` supply translations and overlays.
- **Overlay extension pattern.** New questions and labs ship as `window.AGI_QUIZ_EXTRA` / `window.AGI_LAB_EXTRA` and are merged at startup via `concat`; `cpp-extra-data.js` is never edited. Merging keeps `labs[0]` as the original `s.lab`, so existing progress keys never break.
- **Question types & scoring.** `choice` / `judge` / `fill`; answers are normalised (full-width → half-width, punctuation and whitespace stripped, lower-cased) before comparison. Draws are **type-balanced** — each existing type gets at least one slot (3 drawn ⇒ one of each) — and option shuffling preserves the original answer index.
- **Progress keying.** `labKey(sid, k) = k > 0 ? sid + "#" + k : sid`, so `k = 0` keeps the legacy key and adding labs requires **zero progress migration**.
- **i18n.** `t(zh)` looks up a Chinese-keyed dictionary, `pick(o, f)` prefers `o[f + "_en"]`. Stage names 53/53, lesson titles 264/264, and lab titles 266/266 are bilingual; lesson bodies are Chinese.
- **Offline / PWA.** The Service Worker's `ASSETS` list matches the page's `<script src>` URLs **character for character** (including `?v=N`) — the cache is keyed by full request URL, so bare filenames would miss. Precache is per-item with `catch()`, and every added asset requires a cache-version bump.
- **Verification.** `verify/` (not deployed) runs headless audits: syntax, Service-Worker asset consistency, DEAD DOM ids, `data-act` dispatch coverage, data integrity, route id/range validity, i18n leaks, empty-save resilience, and end-to-end quiz scoring.

### Run & deploy

Open `index.html` directly, or serve over http(s) to enable the Service Worker (`python -m http.server 8080`). For GitHub Pages, push everything to the repository **root** and deploy from the `main` branch, `/ (root)`.

### Known limitations

1. Lesson bodies (explanations, samples, pitfalls, questions) remain Chinese; shell, stage names, lesson titles, and lab titles are bilingual.
2. The two tracks differ in length (C++ 49 stages / 244 lessons; Python 24 stages / 114 lessons) while sharing progress by stage id.
3. Progress lives in `localStorage` — back up with the built-in export.

### License & disclosure

All curriculum text, UI, and code were **generated / assembled with AI assistance**. Verify technical details against authoritative sources before relying on them. Provided as-is for learning purposes, without warranty. See `LICENSE.md`.

---

## 📦 文件清单 / Files

| 文件 | 作用 |
| --- | --- |
| `index.html` | 应用入口：UI + 全部渲染与业务逻辑 |
| `cpp-extra-data.js` | 课程数据：`EXTRA_STAGES` / `STAGE_META` / `LAB_ANSWERS` / `JOB_STAGES` / `AGI_STAGES` |
| `lang-en.js` | 英文对照数据（`STAGE_EN` / `LESSON_EN`） |
| `agi-quiz-extra.js` | 测评题叠加层（`AGI_QUIZ_EXTRA`），每阶段 +2 道 |
| `agi-extra2.js` | 测评题叠加层（`AGI_QUIZ_EXTRA`），每阶段 +2 判断 +2 填空 → 每阶段 9 题（抽 3） |
| `agi-lab-extra.js` | 实战叠加层（`AGI_LAB_EXTRA`），每阶段 +2 道 |
| `agi-lab-extra2.js` | 实战叠加层（`AGI_LAB_EXTRA`），每阶段 +2 道 → 每阶段 5 道 / 全站 266 道 |
| `agi-lab-en.js` | 原始实战（`labs[0]`）的英文对照（`AGI_LAB_EN`），只补缺不覆盖 |
| `cpp-sw.js` | Service Worker（离线缓存） |
| `README.md` / `LICENSE.md` | 本文档 / MIT 授权 |
| `verify/` | 本地自检脚本，**不参与部署** |

## 🏷️ Topics

`agi` · `artificial-intelligence` · `machine-learning` · `deep-learning` · `llm` · `learning-roadmap` · `self-study` · `cpp` · `python` · `static-site` · `pwa` · `offline-first`
