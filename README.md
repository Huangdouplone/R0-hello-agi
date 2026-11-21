# R0:hello agi

从零基础起步、面向 AGI 工程方向的静态自学课程，单文件应用，可离线运行。
A static, self-contained self-study course from zero programming basis toward AGI engineering.

- **路线 Routes**：C++（默认）与 Python，共享阶段池与学习进度 / C++ (default) and Python, sharing the stage pool and learning progress
- **形式 Form**：单个 `index.html`（界面 + 逻辑）+ 38 个外部脚本 + 1 个 Service Worker / a single `index.html` (UI + logic) + 38 external scripts + 1 Service Worker
- **运行 Runtime**：无后端、无构建步骤、无第三方依赖；直接打开 `index.html` 即可 / no backend, no build step, no third-party dependencies; open `index.html` directly
- **统计口径 Data basis**：下列数字为 2026-11-21 加载全部脚本后的运行时实测。全站池、默认 C++ 路线与 Python 路线分列，避免混用口径。
  Counts measured at runtime on 2026-11-21 after loading all scripts. The full pool, the default C++ route and the Python route are reported separately to avoid mixing scopes.

课程文案、界面与代码由 AI 辅助生成与组装；技术细节请以权威资料为准。
Curriculum text, UI and code are generated and assembled with AI assistance. Verify technical details against authoritative sources.

---

## 内容规模（运行时实测） Content scale (measured at runtime)

| 指标 Metric | 全站池 Full stage pool | 默认 C++ 路线 Default C++ route | Python 路线 Python route |
| --- | ---: | ---: | ---: |
| 阶段 Stages | **56** | **52** | **27** |
| 部分 Parts | — | **11** | **6** |
| 课节 Lessons | **354** | **330** | **161** |
| 阶段测评题 Stage-quiz questions | **704** | **652** | **324** |
| 编程实战 Coding labs | **269** | **249** | **123** |

全站池题型分布：选择 389 · 判断 158 · 填空 157。每次抽 3 题（`AGI_QUIZ_COUNT = 3`），每种出现的题型至少一题。
Quiz types in the full pool: choice 389 · true-false 158 · fill-in 157. Three questions are drawn per attempt (`AGI_QUIZ_COUNT = 3`), with at least one from each present type.

范围关系：基础池为 49 个 C++ 路线阶段 + 4 个 Python 专属阶段 = 53；深化层在运行时插入 `agi5`、`agi6`、`agi7`，形成 56 阶段池。C++ 路线为 49 + 3 = 52 阶段；Python 路线为 24 + 3 = 27。两条路线共享数学 / AI 阶段，C++ 与 Python 基础部分互斥。
Scope relationship: the base pool has 49 C++-route stages + 4 Python-only stages = 53; the deepening layers insert `agi5`, `agi6`, `agi7` at runtime, giving a 56-stage pool. The C++ route is 49 + 3 = 52 stages; the Python route is 24 + 3 = 27. Both routes share the math / AI stages; the C++ and Python foundations are mutually exclusive.

实战分布：52 个阶段各 5 道、`eng` 6 道、`agi5`/`agi6`/`agi7` 各 1 道，合计 269；默认 C++ 路线为 48×5 + 6 + 3×1 = 249，4 个 Python 专属阶段另有 20 道。
Lab distribution: 52 stages have 5 labs each, `eng` has 6, and `agi5`/`agi6`/`agi7` have 1 each, totaling 269. The default C++ route is 48×5 + 6 + 3×1 = 249; the 4 Python-only stages add 20.

其他运行时指标 Other runtime metrics：

| 指标 Metric | 数值 Value |
| --- | ---: |
| 成就 / 称号等级 Achievements / title levels | 85 / 15 |
| 首页主题 Homepage themes | 16（1 默认 + 15 星币解锁 / 1 default + 15 coin-unlocked） |
| 名词 Terms | 326 条记录 / 7 类（326 records / 7 categories） |
| 概念图 Concept map | 17 节点 / 20 边（17 nodes / 20 edges） |

名词分类：基础概念 66 · 训练与数据 42 · 应用与智能体 16 · 评估与安全 27 · C++ 系统 147 · C++ 基础 8 · AI 数学 20。
Term categories: basic concepts 66 · training and data 42 · applications and agents 16 · evaluation and safety 27 · C++ systems 147 · C++ fundamentals 8 · AI math 20.

## 两条路线 Two routes

两条路线共享阶段池与进度（测评、打卡、成就、笔记与复习均按阶段 / 课节 `id` 存档），只在顺序与部分结构上不同。
Both routes share the stage pool and progress (quizzes, check-ins, achievements, notes and reviews are keyed by stage / lesson `id`); they differ only in ordering and part structure.

| 路线 Route | 部分 Parts | 阶段 Stages | 课节 Lessons | 实战 Labs | 路径 Path |
| --- | ---: | ---: | ---: | ---: | --- |
| C++（默认 / default） | 11 | 52 | 330 | 249 | C++ 基础 → 数学 → C++ 系统与实战 → 算法 → 工程与求职 → 科学计算 → 机器学习 → 深度学习 → AGI 前沿 / C++ foundation → math → C++ systems and labs → algorithms → engineering and jobs → scientific computing → machine learning → deep learning → AGI frontier |
| Python | 6 | 27 | 161 | 123 | Python 入门 → 数学 → 科学计算 → 机器学习 → 深度学习 → AGI 前沿 / Python start → math → scientific computing → machine learning → deep learning → AGI frontier |

顺序由两张显式的 id 列表定义。
Ordering is defined by two explicit id lists:

```js
const MODE_ORDERS = { cpp: [...52 ids], py: [...27 ids] };
const MODE_PHASES = { cpp: [...11 parts], py: [...6 parts] };
```

`py1`–`py4` 为 Python 专属基础阶段，不在 C++ 顺序中；`agi5`–`agi7` 在启动时插入两条顺序。切换路线只改变视图，不改进度数据。
`py1`–`py4` are Python-only foundation stages and are absent from the C++ order; `agi5`–`agi7` are inserted into both orders at startup. Switching routes changes only the view, not the progress data.

## 功能 Features

- **阶段测评 Stage quiz**：每次抽 3 题，记录最高分与错题。/ 3 questions drawn per attempt; records the best score and mistakes.
- **编程实战 Coding labs**：默认 C++ 路线 249 道，含起始代码与提示，并有一键生成 AI 批改提示词。/ 249 labs on the default C++ route, with starter code and hints, plus a one-click AI grading prompt generator.
- **间隔复习 Spaced repetition**：2 / 4 / 7 / 15 / 30 / 60 天复习队列，配合错题本。/ Review queues at 2 / 4 / 7 / 15 / 30 / 60 days plus a mistake log.
- **每日上限 Daily cap**：新学默认每天 4 节（可调 1–10）；待复习积压超过阈值（默认 8）时暂停新学。/ New lessons default to 4 per day (adjustable 1–10); new learning is locked when the review backlog exceeds a threshold (default 8).
- **进度追踪 Progress tracking**：热力图、85 个成就（含 AGI 里程碑）、15 级称号、16 种主题、可导出的日 / 周 / 月报告。/ Heatmap, 85 achievements (including AGI milestones), 15 title levels, 16 themes, exportable day/week/month reports.
- **星币 Star coins**：通过学习、复习、打卡、测评与实战获得，仅用于兑换首页主题。/ Earned through study, review, check-in, quizzes and labs; spent only on homepage themes.
- **断点续学 Resume**：记录上次查看的课节，在首页高亮提示。/ The last viewed lesson is recorded and highlighted on the home page.
- **数据管理 Data control**：导出 / 导入 / 重置。/ Export / import / reset.

## 架构 Architecture

外部脚本按固定顺序注入。
External scripts are injected in a fixed order:

```
cpp-extra-data.js          EXTRA_STAGES / STAGE_META / LAB_ANSWERS / JOB_STAGES / AGI_STAGES
lang-en.js                 STAGE_EN / LESSON_EN
agi-quiz-extra.js          AGI_QUIZ_EXTRA   +2 quizzes per stage
agi-extra2.js              AGI_QUIZ_EXTRA   +2 true-false +2 fill-in per stage
agi-lab-extra.js           AGI_LAB_EXTRA    +2 labs per stage
agi-lab-extra2.js          AGI_LAB_EXTRA    +2 labs per stage
agi-lab-en.js              AGI_LAB_EN
agi-en-batch.js            AGI_EN_BATCH     batch EN for target/code/quiz/lab starter
agi-concept.js             interactive concept map
agi-deepen-*.js            28 deepening layers: lesson bodies, quizzes, labs, terms, achievements
ped-ext.js                 "extension" tags for out-of-scope terms
        ↓  merged at startup
_stageMap[id] = stage (lessons[] / quiz[] / lab + labs[])
        ↓  assembled per MODE_ORDERS
renderAll() → overview / route / labs / parts / terms / concept map …
```

阶段与部分容器通过 `innerHTML` 重建；可被脚本寻址的 `id` 放在内层容器。交互使用全局 `data-act` 事件委托。
Stage and part containers are rebuilt with `innerHTML`; script-addressable `id`s sit on inner containers. Interactions use global `data-act` event delegation.

数据模型 Data model：

```js
stage = {
  id, icon, name, desc, goal,
  lessons: [{ id, title, min, summary[], code, pit, ex:{q,a}, target }],
  quiz: [{ q, o:[…], a, why, q_en, why_en, o_en, type }],
  lab:  { t, req[], starter, hint, xp },   // original lab, equal to labs[0]
  labs: [ … ]                              // merged from overlays at startup
}
```

新题目与实战通过 `AGI_QUIZ_EXTRA` / `AGI_LAB_EXTRA` 在启动时以 `concat` 加入；原始 `cpp-extra-data.js` 不变。`labs[0]` 始终是原始实战，因此进度键有效。统计实战用 `totalLabs()`。
New questions and labs are added via `AGI_QUIZ_EXTRA` / `AGI_LAB_EXTRA` with `concat` at startup; the original `cpp-extra-data.js` is unchanged. `labs[0]` is always the original lab, so progress keys stay valid. Count labs with `totalLabs()`.

进度键：`labKey(sid, k) = k > 0 ? sid + "#" + k : sid`。`k = 0` 保留旧键，`k ≥ 1` 用 `sid#k`；新增实战无需迁移进度。
Progress keying: `labKey(sid, k) = k > 0 ? sid + "#" + k : sid`. `k = 0` keeps the legacy key; `k ≥ 1` uses `sid#k`; adding labs requires no progress migration.

填空答案做归一化，抽取按题型均衡，选项乱序时记录原始下标。深化后每阶段题库为 4–15 题，而非早期固定的 9 题。
Quiz answers are normalized and draws are type-balanced; option shuffling tracks the original index. After deepening, each stage has a bank of 4–15 questions rather than the earlier fixed 9.

国际化覆盖（运行时） Internationalization coverage (runtime)：

| 层 Layer | 覆盖 Coverage |
| --- | --- |
| 阶段名 Stage names | 53 / 56（`agi5`–`agi7` 缺英文名 / lack English names） |
| 课节标题 Lesson titles | 332 / 354 |
| 课节 summary / pit / target | 354 / 354 |
| 课节 code Lesson code | 59 / 354 |
| 测评题干 / 解析 Quiz prompts / explanations | 704 / 704 |
| 测评选项侧表 Quiz option side tables | 392 / 704（判断题选项按语言生成 / true-false options are generated by language） |
| 实战要求 / 提示 Lab requirements / hints | 269 / 269 |
| 实战起始代码 Lab starter code | 133 / 269 |
| 名词 / 概念图边 Terms / concept-map edges | 326 / 326 · 20 / 20 |
| `ex` 题 `ex` questions | 中文 / Chinese |

`t(zh)` 以中文原文为键查 `I18N_EN`；`pick(o, f)` 先读 `o[f + "_en"]`，缺失回退中文。加载时求值的模块级常量会被固化为中文，因此导航存键、渲染时翻译。
`t(zh)` looks up `I18N_EN` by the Chinese original; `pick(o, f)` reads `o[f + "_en"]` first and falls back to Chinese. Module-level constants that are evaluated at load time get baked to Chinese, so navigation stores keys and translates at render time.

## 运行与部署 Run and deploy

```bash
# 直接打开 / Open directly
index.html

# 或用 http(s) 提供服务以启用 Service Worker / Or serve over http(s) to enable the Service Worker
python -m http.server 8080
```

在 GitHub Pages 上，将本目录作为仓库根推送，从 `main` 的 `/ (root)` 部署。
For GitHub Pages, push this directory as the repository root and deploy from `main`, `/ (root)`.

`cpp-sw.js` 为 Service Worker（当前 `CACHE = r0-hello-agi-v55`）。其 `ASSETS` 必须与页面 `<script src>` 的 URL 逐字符一致（含 `?v=N`）；修改任何被缓存的文件后需 bump `CACHE`。
`cpp-sw.js` is the Service Worker (current `CACHE = r0-hello-agi-v55`). Its `ASSETS` must match the page's `<script src>` URLs character for character (including `?v=N`); bump `CACHE` after changing any cached file.

## 已知限制 Known limitations

1. 阶段名英化覆盖 53 / 56；`agi5`–`agi7` 无英文名。/ Stage-name EN coverage is 53 / 56; `agi5`–`agi7` lack English names.
2. 课节标题英化 332 / 354，代码英化 59 / 354，`ex` 题保留中文。/ Lesson-title EN coverage is 332 / 354; code EN coverage is 59 / 354; `ex` questions stay Chinese.
3. 实战起始代码英化 133 / 269；要求与提示已全双语。/ Lab starter EN coverage is 133 / 269; requirements and hints are fully bilingual.
4. `agi5`–`agi7` 各 1 道实战，多数阶段为 5 道。/ `agi5`–`agi7` have one lab each, versus five for most stages.
5. 两路线长度不同（C++ 52 / 330；Python 27 / 161），进度按 id 共享。/ Route lengths differ (C++ 52 / 330; Python 27 / 161), while progress is shared by id.
6. 进度存于 `localStorage`，请定期导出。/ Progress is stored in `localStorage`; export regularly.

## 文件 Files

| 文件 File | 作用 Role |
| --- | --- |
| `index.html` | 应用入口：界面、渲染与逻辑 / App entry: UI, rendering and logic |
| `cpp-extra-data.js` | 课程数据：阶段 / 元数据 / 实战答案 / 求职 / AGI 阶段 / Curriculum data: stages / metadata / lab answers / job / AGI stages |
| `lang-en.js` | 基础英文表（`STAGE_EN` / `LESSON_EN`）/ Base English tables |
| `agi-quiz-extra.js` / `agi-extra2.js` | 阶段测评叠加层 / Stage quiz overlays |
| `agi-lab-extra.js` / `agi-lab-extra2.js` | 实战叠加层 / Lab overlays |
| `agi-lab-en.js` | 实战基础英文表 / Base lab English tables |
| `agi-en-batch.js` | 批量英文侧表 / Batch English side tables |
| `agi-concept.js` | 交互式概念图拓扑 / Interactive concept-map topology |
| `agi-deepen-*.js` | 28 个深化层 / 28 deepening layers |
| `ped-ext.js` | 超范围名词的「拓展」标记 / "Extension" tags for out-of-scope terms |
| `cpp-sw.js` | Service Worker（离线缓存 / offline cache） |
| `diagnose.html` / `404.html` | 诊断页与自定义 404 / Diagnostic page and custom 404 |
| `README.md` / `LICENSE.md` | 本文档 / MIT 许可 / This document / MIT license |

## 许可 License

MIT，见 `LICENSE.md`。作者：B 站 黄豆666（huangdouplone）。按「原样」提供，仅供学习，不作任何担保。
MIT. See `LICENSE.md`. Creator: Bilibili 黄豆666 (huangdouplone). Provided as-is for study, without warranty.

Topics：`agi` · `artificial-intelligence` · `machine-learning` · `deep-learning` · `llm` · `learning-roadmap` · `self-study` · `cpp` · `python` · `static-site` · `pwa` · `offline-first`
