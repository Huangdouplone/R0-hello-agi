/* R0:hello agi · 概念地图 + 名词库数据
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 */
(function () {
"use strict";

window.AGI_TERMS = [
  { term: "大模型", term_en: "Large Model", cat: "基础概念", short: "用海量数据训练出来的通用文本生成模型。", short_en: "A general-purpose text model trained on massive data.",
    detail: ["规模常用参数量衡量；能力随规模与数据质量提升。", "同一模型既能写作也能写代码，是「通用」的起点。"],
    detail_en: ["Scale is usually measured in parameters; capability rises with scale and data quality.", "One model that both writes prose and writes code is the starting point of 'general'."],
    vs: "大模型是「引擎」，AGI 是「方向」。", vs_en: "A large model is the engine; AGI is the direction." },
  { term: "预训练", term_en: "Pre-training", cat: "训练与数据", short: "在海量语料上以「预测下一个词」训练模型。", short_en: "Training on huge corpora by predicting the next token.",
    detail: ["这一步决定模型的语言与知识底座。", "成本主要花在算力与数据清洗上。"],
    detail_en: ["This stage decides the model's language and knowledge foundation.", "Most of the cost goes into compute and data cleaning."],
    vs: "预训练给能力，微调给风格与领域。", vs_en: "Pre-training gives capability; fine-tuning gives style and domain." },
  { term: "微调", term_en: "Fine-tuning", cat: "训练与数据", short: "在已有模型上用小数据继续训练以适配任务。", short_en: "Continuing training on a small dataset to adapt a model.",
    detail: ["常见做法 LoRA 只训练少量适配器参数。", "效果七成取决于数据质量。"],
    detail_en: ["The common LoRA recipe trains only a small set of adapter parameters.", "Roughly seventy percent of the result depends on data quality."],
    vs: "知识更新频繁时优先 RAG，而非微调。", vs_en: "Prefer RAG when knowledge changes often." },
  { term: "提示词", term_en: "Prompt", cat: "应用与智能体", short: "你怎么问，决定模型怎么答。", short_en: "How you ask shapes how the model answers.",
    detail: ["系统提示定角色，用户提示给任务。", "写清楚角色、任务、格式与边界，是最便宜的提效手段。"],
    detail_en: ["The system prompt sets the role; the user prompt gives the task.", "Spelling out role, task, format and limits is the cheapest way to gain quality."],
    vs: "提示词改「怎么问」，微调改「模型本身」。", vs_en: "Prompts change the asking; fine-tuning changes the model." },
  { term: "上下文窗口", term_en: "Context Window", cat: "基础概念", short: "模型一次能「看见」的 token 上限。", short_en: "The token budget a model can see at once.",
    detail: ["超长对话要靠摘要或检索压缩。", "窗口大不等于记得牢，注意力会稀释。"],
    detail_en: ["Very long conversations need summarising or retrieval to compress them.", "A bigger window is not better memory — attention gets diluted."],
    vs: "窗口是容量，检索是「在容量外续住信息」。", vs_en: "The window is capacity; retrieval extends it." },
  { term: "Token", term_en: "Token", cat: "基础概念", short: "模型读写的最小单位，也是计费单位。", short_en: "The smallest unit the model reads and writes — and bills.",
    detail: ["中文约 1 字 ≈ 1~2 token。", "输入与输出分别计价，输出更贵。"],
    detail_en: ["Chinese works out at roughly 1-2 tokens per character.", "Input and output are billed separately, and output costs more."],
    vs: "token 是计量单位，上下文窗口是容量。", vs_en: "Tokens measure; the window bounds." },
  { term: "检索增强", term_en: "RAG", cat: "应用与智能体", short: "先检索资料再生成，让回答有依据。", short_en: "Retrieve first, then generate — answers with evidence.",
    detail: ["三步：检索 → 拼上下文 → 生成。", "知识频繁更新的场景首选 RAG。"],
    detail_en: ["Three steps: retrieve, assemble the context, generate.", "Prefer RAG where knowledge changes often."],
    vs: "RAG 管知识新鲜度，微调管能力适配。", vs_en: "RAG keeps knowledge fresh; tuning adapts capability." },
  { term: "智能体", term_en: "Agent", cat: "应用与智能体", short: "LLM + 自主循环 + 工具，目标驱动地「做」。", short_en: "LLM plus an autonomous loop plus tools, driven by goals.",
    detail: ["循环：思考 → 行动 → 观察 → 再思考。", "要有终止条件与最大步数。"],
    detail_en: ["The loop: think, act, observe, think again.", "It needs a termination condition and a maximum number of steps."],
    vs: "Agent 是「驾驶员」，大模型是「引擎」。", vs_en: "The agent drives; the model powers." },
  { term: "多模态", term_en: "Multimodal", cat: "应用与智能体", short: "模型能同时处理文字、图片、音频等多种输入。", short_en: "Handling text, images and audio together.",
    detail: ["典型场景：读表格截图、识别票据、看图说话。", "多模态扩大了模型能接的任务面。"],
    detail_en: ["Typical jobs: reading a screenshot of a table, recognising receipts, describing an image.", "Multimodality widens the range of tasks a model can accept."],
    vs: "多模态扩输入面，Agent 扩行动面。", vs_en: "Multimodality widens inputs; agents widen actions." },
  { term: "对齐", term_en: "Alignment", cat: "评测与安全", short: "让模型的行为符合人类意图与价值观。", short_en: "Making model behaviour match human intent and values.",
    detail: ["常见手段：人类反馈强化学习、偏好数据、安全微调。", "对齐决定「模型愿不愿意做」，而非「能不能做」。"],
    detail_en: ["Usual methods: RLHF, preference data, safety fine-tuning.", "Alignment decides whether the model is willing, not whether it is able."],
    vs: "对齐管意愿，护栏管边界。", vs_en: "Alignment shapes willingness; guardrails set limits." },
  { term: "幻觉", term_en: "Hallucination", cat: "评测与安全", short: "流畅但无依据的回答。", short_en: "Fluent answers without evidence.",
    detail: ["根源是生成式的概率本质。", "缓解：检索增强、要求引用、输出校验。"],
    detail_en: ["Its root is the probabilistic nature of generation.", "Mitigations: retrieval, requiring citations, validating the output."],
    vs: "幻觉讲「没依据」，grounding 讲「有依据」。", vs_en: "Hallucination lacks evidence; grounding provides it." },
  { term: "评测", term_en: "Evaluation", cat: "评测与安全", short: "把「感觉不错」变成可比较的分数。", short_en: "Turning vibes into comparable scores.",
    detail: ["评测集要覆盖真实任务的代表性样例。", "LLM-as-Judge 需要明确的评分标准。"],
    detail_en: ["An eval set must contain representative samples of the real task.", "LLM-as-Judge needs an explicit rubric."],
    vs: "评测是对外证明，调试是对内找错。", vs_en: "Evaluation proves it; debugging finds it." },
  { term: "推理", term_en: "Inference", cat: "应用与智能体", short: "用训练好的模型生成结果的过程。", short_en: "Running a trained model to produce output.",
    detail: ["成本与延迟主要发生在推理阶段。", "批处理、量化与缓存都能降本提速。"],
    detail_en: ["Cost and latency are dominated by the inference phase.", "Batching, quantisation and caching all cut cost and time."],
    vs: "训练花一次钱，推理按次花钱。", vs_en: "Training is paid once; inference is paid per call." },
  { term: "算力", term_en: "Compute", cat: "训练与数据", short: "训练与推理所需的计算资源。", short_en: "The compute needed for training and inference.",
    detail: ["训练看集群规模，推理看并发与显存。", "量化能显著降低显存占用。"],
    detail_en: ["Training is limited by cluster size; serving by concurrency and VRAM.", "Quantisation sharply reduces VRAM usage."],
    vs: "算力是约束，数据是原料。", vs_en: "Compute is the constraint; data is the fuel." },
  { term: "数据集", term_en: "Dataset", cat: "训练与数据", short: "训练与微调所用的数据集合。", short_en: "The data used for training and fine-tuning.",
    detail: ["数据质量比数量更决定上限。", "清洗、去重、标注规范都不可省。"],
    detail_en: ["Data quality, not quantity, sets the ceiling.", "Cleaning, deduplication and annotation guidelines cannot be skipped."],
    vs: "数据是原料，算力是加工能力。", vs_en: "Data is the fuel; compute is the machine." },
  { term: "通用人工智能", term_en: "AGI", cat: "基础概念", short: "能像人一样跨领域学习与解决新问题的智能。", short_en: "Intelligence that learns and solves new problems across domains.",
    detail: ["当前模型是「窄而深」的叠加，离通用还有距离。", "评价通用性的维度：迁移、规划、长程记忆、自我纠错。"],
    detail_en: ["Today's models are stacks of narrow-but-deep skills, still far from general.", "Dimensions of generality: transfer, planning, long-horizon memory, self-correction."],
    vs: "AGI 是目标，大模型是今天最接近的载体。", vs_en: "AGI is the goal; large models are today's closest vehicle." },
  { term: "规划", term_en: "Planning", cat: "应用与智能体", short: "把大目标拆成可执行的小步骤。", short_en: "Breaking a big goal into executable steps.",
    detail: ["Agent 的核心能力之一。", "常见做法：任务分解、先想后做、失败重规划。"],
    detail_en: ["One of an agent's core capabilities.", "Common approaches: task decomposition, think-before-acting, replanning after failure."],
    vs: "规划管「怎么走」，工具管「怎么做到」。", vs_en: "Planning decides the path; tools do the doing." },
  { term: "记忆", term_en: "Memory", cat: "应用与智能体", short: "短期记忆在上下文里，长期记忆在外部存储。", short_en: "Short-term lives in context; long-term in external storage.",
    detail: ["长期记忆通常用向量库实现，按需检索。", "存要点而非原始对话，检索才不吵。"],
    detail_en: ["Long-term memory is usually a vector store queried on demand.", "Store distilled points rather than raw dialogue, or retrieval turns to noise."],
    vs: "记忆是「记」，检索是「取」。", vs_en: "Memory stores; retrieval fetches." },
  { term: "工具使用", term_en: "Tool Use", cat: "应用与智能体", short: "让模型调用搜索、代码执行、数据库等外部能力。", short_en: "Letting the model call search, code, databases and more.",
    detail: ["模型决定「调什么」，由你的代码去执行。", "工具的参数声明写得越清楚，调用越稳。"],
    detail_en: ["The model decides which tool to call; your code actually runs it.", "The clearer the declared parameters, the more reliable the call."],
    vs: "工具扩展能力边界，提示词决定是否用得对。", vs_en: "Tools extend capability; prompts decide usage." },
  { term: "量化", term_en: "Quantization", cat: "训练与数据", short: "把权重压到更低精度以省显存、跑得更快。", short_en: "Compressing weights to lower precision to save VRAM.",
    detail: ["4-bit 量化是最常见的选择。", "量化主要省资源，不一定更准。"],
    detail_en: ["4-bit quantisation is the most common choice.", "Quantisation saves resources; it does not necessarily improve accuracy."],
    vs: "量化省资源，蒸馏缩模型。", vs_en: "Quantization saves memory; distillation shrinks the model." }
];

window.AGI_CONCEPT_MAP = {
  nodes: [
    { id: "通往 AGI", tier: 0 },
    { id: "大模型", tier: 1 }, { id: "数据", tier: 1 }, { id: "算力", tier: 1 },
    { id: "评测", tier: 1 }, { id: "安全", tier: 1 },
    { id: "预训练", tier: 2 }, { id: "微调", tier: 2 }, { id: "提示词", tier: 2 },
    { id: "检索增强", tier: 2 }, { id: "智能体", tier: 2 }, { id: "多模态", tier: 2 },
    { id: "对齐", tier: 2 },
    { id: "推理", tier: 3 }, { id: "规划", tier: 3 }, { id: "记忆", tier: 3 }, { id: "工具使用", tier: 3 }
  ],
  edges: [
    { a: "大模型", b: "通往 AGI", zh: "今天的载体", en: "today's vehicle" },
    { a: "数据", b: "通往 AGI", zh: "原料", en: "the fuel" },
    { a: "算力", b: "通往 AGI", zh: "约束条件", en: "the constraint" },
    { a: "评测", b: "通往 AGI", zh: "衡量距离", en: "measures the distance" },
    { a: "安全", b: "通往 AGI", zh: "能不能交给它", en: "whether to trust it" },

    { a: "预训练", b: "大模型", zh: "造出它", en: "builds it" },
    { a: "数据", b: "预训练", zh: "喂给预训练", en: "feeds pre-training" },
    { a: "算力", b: "预训练", zh: "撑起训练", en: "powers training" },
    { a: "微调", b: "大模型", zh: "适配任务", en: "adapts it" },
    { a: "推理", b: "大模型", zh: "让它干活", en: "puts it to work" },
    { a: "多模态", b: "大模型", zh: "扩大输入面", en: "widens inputs" },

    { a: "提示词", b: "大模型", zh: "决定输出质量", en: "shapes output" },
    { a: "检索增强", b: "大模型", zh: "补新鲜知识", en: "adds fresh knowledge" },
    { a: "智能体", b: "大模型", zh: "拿它当大脑", en: "uses it as the brain" },
    { a: "智能体", b: "规划", zh: "靠规划拆解目标", en: "plans to decompose" },
    { a: "智能体", b: "记忆", zh: "靠记忆延续任务", en: "remembers across steps" },
    { a: "智能体", b: "工具使用", zh: "靠工具落到现实", en: "acts through tools" },
    { a: "对齐", b: "安全", zh: "对齐是安全的核心手段", en: "alignment is core to safety" },
    { a: "评测", b: "对齐", zh: "评测衡量对齐效果", en: "evaluates alignment" },
    { a: "检索增强", b: "评测", zh: "用检索减少幻觉", en: "reduces hallucination" }
  ]
};

/* 英文模式下的显示名映射：概念节点与名词分类的中文名仍作为数据主键，这里只提供 label */
window.AGI_LABEL_EN = { "通往 AGI": "Toward AGI", "数据": "Data", "安全": "Safety" };
window.AGI_CAT_EN = {
  "基础概念": "Fundamentals", "训练与数据": "Training & Data", "应用与智能体": "Apps & Agents",
  "评测与安全": "Eval & Safety", "C++ 系统深入": "C++ In Depth", "C++ 语言地基": "C++ Basics",
  "AI 数学基础": "Math for AI"
};

})();
