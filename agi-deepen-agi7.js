/* ================================================================
 * R0:hello agi · 课程深化层 ⑮（agi7 生态、产业与研发切入点 —— 全新整章）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：agi1~agi4 教「怎么做」，agi5 教「它怎么走到今天」，agi6 教「凭什么说到到了」，
 *       本站缺的最后一段是「学完技术之后，我在生态里站在哪一格」。本章七节按
 *       「义务—资源—岗位—证据—判断—协作—定位」推进：许可证与权重开放的真实差别、
 *       算力与资本门槛的曲线、六类岗位的图谱、两条路线的作品集决策树、读论文与最小
 *       复现闭环、参与开源与公开输出的阶梯，最后一节把 s1→agi7 全链收成一张位置图，
 *       并给出 90 天计划的写法与复盘节奏（全站终点课）。
 * 写法约定：
 *   1) 全章为新增课节，每节写齐 title / title_en / target / target_en；
 *   2) 站点无服务端：所有示例只用本地手填数据与合成数据，不下载数据集、不调接口、
 *      不需要密钥，产出的证据是本地文本与表格；
 *   3) Python 注释一律单独成行（行尾 # 页面不翻译），C++ 一行只放一个 //，
 *      全部登记进 codeComments；
 *   4) 表述克制：不做机构强弱判断、不预测具体公司胜负、不给外部链接，涉及数字一律
 *      用「约 / 量级 / 每几年一个数量级」，许可证条款只讲可读文本的类别差异；
 *   5) 许可证与条款属法律文本，本章只做工程侧的核对方法，课内明说「不构成法律意见」。
 * ================================================================ */

const DEEPEN_AGI7 = {
  newStages: [
    {
      id: "agi7",
      icon: "🧭",
      name: "生态、产业与研发切入点",
      name_en: "Ecosystem, Industry and Your Entry Point",
      desc: "技术之外的那张地图：义务、资源、岗位与证据，然后是你自己那一格",
      desc_en: "The map beyond technique: duties, resources, roles and evidence - then your own square on it",
      goal: "能在开源与闭源、算力与资本、岗位与作品集之间做出可核对的选择，最终为自己定下一个切入点并写出可判完成的 90 天计划。",
      goal_en: "Make checkable choices across open and closed, compute and capital, roles and portfolios - and end up with a chosen entry point plus a 90-day plan that can be judged done or not.",
      insertAfter: "agi6",
      links: [],

      lab: {
        t: "为自己选定切入点并写出 90 天计划",
        t_en: "Choose your own entry point and write a 90-day plan",
        mode: "text",
        req: [
          "用一句话说清「我现在在哪」：只允许引用你拿得出的证据（跑过的实验、可核对的数字、已合并的改动），出现「学过」「看过」这类词就重写",
          "从六类岗位里选一个主切入点与一个备用切入点，各写三条「这一格为什么适合我」和一条「出现什么信号说明我选错了」",
          "画能力层五层地图（机器与系统 / 数据与训练 / 模型与应用 / 判据与评测 / 位置与生态），把本站学过的章节填进去，标出至少两个空格子并写明为什么暂不填",
          "写一份 90 天计划：一个可展示交付 + 每周一行数字 + 一条放弃判据 + 三句「我怎么知道它在变好」；交付必须能在一台离线机器上被别人验证",
          "给这个交付写一篇公开输出的预告：打算讲什么、最可能讲错什么、发布前要扫描掉哪些内容（密钥样式、绝对路径、内部代号、未发布实验）",
          "最后三行：这条路线上你最没把握的一个判断、它的反证长什么样、你打算在第几天检查它"
        ],
        req_en: [
          "State 'where I am now' in one sentence using only evidence you can show (an experiment you ran, a number someone could check, a change that got merged); rewrite it if it contains 'studied' or 'read about'",
          "Pick one primary and one backup entry point from the six role families, with three reasons each for why that square fits you and one signal that would prove you chose wrong",
          "Fill the five-layer capability map (machine and system / data and training / model and application / criteria and evaluation / position and ecosystem) with the chapters you have actually done, mark at least two empty squares and say why you leave them empty for now",
          "Write a 90-day plan: one showcaseable deliverable + one line of numbers per week + one explicit stop rule + three sentences on how you will know it is getting better; the deliverable must be verifiable by someone else on an offline machine",
          "Draft a public-output teaser for that deliverable: what you will claim, which claim is most likely wrong, and what you will scan out before publishing (key-like strings, absolute paths, internal codenames, unpublished results)",
          "Close with three lines: the judgement you trust least on this route, what a counter-evidence would look like, and on which day you will check it"
        ],
        starter: `WHERE AM I (evidence only, no verbs like 'studied')
  1. runnable artefact :
  2. number I can defend :
  3. change others accepted :

ENTRY POINT            PRIMARY ______   BACKUP ______
  why fits (3 lines)   1) 2) 3)
  wrong-choice signal  :

FIVE-LAYER MAP         [ ] machine/system  [ ] data/training
                       [ ] model/app       [ ] criteria/eval
                       [ ] position/eco
  empty squares I leave empty ON PURPOSE, because:

90-DAY PLAN
  deliverable (one, showcaseable, offline-verifiable):
  weekly numbers (12 rows): week / hours / artefact / one number
  stop rule  : if ______ for two consecutive weeks, I switch topic
  getting better because : 1) 2) 3)

PUBLIC OUTPUT PREVIEW
  claim:            most likely wrong:      scan-out list:
  UNCHECKED JUDGEMENT / ITS COUNTER-EVIDENCE / DAY I CHECK IT`,
        hint: "先写「放弃判据」再写目标。大多数人计划失败不是因为不努力，而是因为一个已经不成立的方向被继续投入了九十天的沉没成本。写不出放弃判据，说明这个交付你根本不知道怎么做成。",
        hint_en: "Write the stop rule before the goal. Plans usually die not from laziness but from ninety days of sunk cost poured into a direction that had already stopped holding. If you cannot write a stop rule, you do not yet know what success looks like for this deliverable.",
        xp: 30
      },

      lessons: [

    /* ===================== agi7-1 ===================== */
    {
      id: "agi7-1",
      title: "开源与闭源的真实差别：许可证、权重开放与自建边界",
      title_en: "Open and Closed in Practice: Licences, Weights and the Build Boundary",
      min: 14,
      target: "能把一份模型或代码的可用性拆成四问条款与四层开放度，并给出「自建」与「调用」各自成立的边界条件。",
      target_en: "Break any model or code release down into four licence questions and four openness layers, and state the boundary conditions under which building yourself or calling somebody else is the right call.",
      summary: [
        "本章的前置是 agi5（这条路线是怎么走到今天的）与 agi6（我们凭什么说它到了），并直接沿用 career 章「就业方向与学习地图」的分类习惯；从这里开始问题不再是「这项技术怎么做」，而是「我在生态里站哪一格、这格要我承担什么义务」——这也是本站最后一个新问题。",
        "许可证是法律义务而不是技术指标，可核对的四问是：能不能商用、能不能再分发（包括打包进自己的产品）、衍生作品是否必须以同一条条款开源（copyleft）、以及是否附带专利授权；这四问读文本就能回答，不需要先跑一次推理，而多数人的顺序恰好是反的。",
        "条款差异的真实来源是触发点不同：宽松型（MIT、Apache-2.0 一类）只要保留声明与变更说明，代价是你不能要求别人回馈；强 copyleft（GPL 一类）在「分发」时强制开源，而 AGPL 一类把「通过网络提供服务」也算作分发——所以同一份代码，自机房部署与对外提供 SaaS 的义务完全不同，这是工程侧最容易踩空的一条。",
        "「开源模型」这个词在日常用法里通常只指权重可得，与软件界对开源的定义并不等价；把开放度拆成四层来看就不会被术语骗：权重、训练数据（或其清单）、训练代码与超参、评测口径与原始结果。多数发布只放开第一层，因此你能做的是「用它」与「在它上面再走一小步」，而不是「重做它」。",
        "名称与商标是另一个独立层次：权重可以下载、许可证可以商用，也不代表你可以拿原项目的名字做营销；反过来，带「开放」字样的模型许可证常附加条款——营收上限、不得用于竞争产品、强制在下游产物里标注来源。这些条款读十分钟就有结论，换模型却要花两周。",
        "自建与调用的边界是一条成本与可控性的交换曲线：自建的真实成本不在下载权重那一步，而在推理工程（显存、批处理、量化）、回归评测、数据不出域与长期值守；调用的成本按次结算、能力升级由对方推动，但你把「上游改接口、改价格、悄悄改行为」这三种风险买进了自己的系统里——可控性和成本是同一枚硬币的两面，不是两个独立的考虑。",
        "什么情况下闭源 API 才是正确选择：需求长尾且峰谷比大（自建等于为最坏时刻买硬件）、该能力半年内还会大幅变动、你不需要权重级私有化、内容安全与合规由对方分担一部分、以及你的护城河在数据与流程而不在推理本身。这时候自建不是稳健，是给自己找一个不需要老板批准的副业。",
        "什么情况下必须落到可自托管的模型上：数据不能出域、单位请求成本随规模变成主要矛盾、要离线或端侧运行、需要对同一输入永远得到同一行为（可复现与可审计）、以及监管要求留下可查的变更记录。此时选型表的第一列不是榜单分数，而是许可证能不能陪你走到商用上线。"
      ],
      summary_en: [
        "This chapter stands on agi5 (how the road actually got here) and agi6 (on what grounds we say it has arrived), and it borrows the classification habit of the career chapter's job-direction lesson. From here the question is no longer 'how is this technique built' but 'which square on the ecosystem map is mine, and what duties does that square impose' - the last genuinely new question this site asks.",
        "A licence is a set of legal duties, not a technical attribute. The four checkable questions are: may I use it commercially, may I redistribute it (including bundling it into my own product), must derivatives ship under the same terms (copyleft), and does a patent grant come along with it. All four are answered by reading text, with no inference run - and most people do them in exactly the reverse order.",
        "The differences come from where the duty triggers. Permissive terms (MIT, Apache-2.0 style) ask only that notices and change logs survive, and their price is that you cannot demand anything back; strong copyleft (GPL style) forces source release on distribution, and AGPL-style terms treat serving over a network as distribution - so the same code carries entirely different duties in your own data centre versus a hosted service. This is the single easiest trap for an engineer to miss.",
        "'Open-source model' in everyday use usually means only that the weights are downloadable, which is not the software world's definition of open source. Splitting openness into four layers stops the vocabulary from fooling you: weights, training data (or its manifest), training code with hyper-parameters, and the evaluation protocol with raw results. Most releases open only the first layer, so you can use the model and take one small step further on it, but you cannot rebuild it.",
        "Naming and trademarks form yet another layer: downloadable weights and a commercially friendly licence still do not let you market under the original project's name. Conversely, model licences whose names contain 'open' frequently attach conditions - a revenue cap, a ban on building a competing product, mandatory attribution in downstream artefacts. Ten minutes of reading settles it; switching models afterwards costs two weeks.",
        "Build-versus-buy trades cost against control. The real cost of self-hosting is not the weight download but the inference engineering (memory, batching, quantisation), the regression evaluation, keeping data inside the perimeter, and permanent on-call duty. Buying costs per call and lets somebody else drive capability upgrades, but it writes three risks into your system: the upstream changes the interface, changes the price, or quietly changes behaviour. Control and cost are two faces of one coin, not two separate checklists.",
        "When a closed API is genuinely the right choice: demand is long-tailed with a spiky peak-to-average ratio (self-hosting means buying hardware for your worst minute), the capability will still move a lot within two or three quarters, you do not need weight-level privacy, part of content safety and compliance is carried by the provider, and your moat sits in data and process rather than in the inference itself. Building then is not prudence; it is a side job you did not need approval for.",
        "When you must land on a self-hostable model: data may not leave the perimeter, per-request cost becomes the dominant term as volume grows, you run offline or on-device, you need the same input to always give the same behaviour (reproducibility and auditability), and the regulator expects a change trail. In that case the first column of your shortlist is not leaderboard score but whether the licence survives contact with a commercial launch."
      ],
      code: `# 许可证四问：这张表要在任何实验开始之前填完
# 条款摘要全部手填在本地，不构成法律意见，只用来逼自己逐条核对
LICENCES = {
    "MIT 型（宽松）": {"商用": True, "再分发": True, "衍生同许可": False, "网络条款": False},
    "Apache-2.0 型（宽松带专利）": {"商用": True, "再分发": True, "衍生同许可": False, "网络条款": False},
    "GPL 型（强 copyleft）": {"商用": True, "再分发": True, "衍生同许可": True, "网络条款": False},
    "AGPL 型（含网络条款）": {"商用": True, "再分发": True, "衍生同许可": True, "网络条款": True},
    "研究专用型（禁止商用）": {"商用": False, "再分发": True, "衍生同许可": False, "网络条款": False},
}

# 权重开放是分层的，这一层与上面四问完全无关，必须单独检查
OPEN_LAYERS = {"权重可得": True, "训练数据清单可得": False,
               "训练代码与超参可得": False, "评测口径与原始结果可复核": True}

def verdict(clause, distribute, saas, willing_to_open_source):
    # 商用被禁是一票否决，与你的架构无关
    if not clause["商用"]:
        return "不可上线：许可证禁止商用，只能换模型或去买授权"
    # 网络条款把对外提供服务也算作分发，这一条最容易踩空
    triggers = distribute or (saas and clause["网络条款"])
    # copyleft 的触发点是分发，只在自己机房里跑时义务还没发生
    if clause["衍生同许可"] and not triggers:
        return "可自用：不分发就不触发开源义务，但要先确认什么算分发"
    # 义务已经触发而你不愿开源，这才是 copyleft 真正的死结
    if clause["衍生同许可"] and not willing_to_open_source:
        return "不可上线：开源义务已触发，而你不愿开源"
    return "可上线：记得随产品附上许可证文本与声明副本"

print("场景一：把模型打包进要分发的产品，同时对外提供服务")
for name, clause in LICENCES.items():
    print(" ", name, "->", verdict(clause, distribute=True, saas=True, willing_to_open_source=False))

# 同一份条款换一个部署方式就换结论：差别全在触发点上
print("场景二：只在自家机房里对外提供接口，不分发任何二进制")
for name, clause in LICENCES.items():
    print(" ", name, "->", verdict(clause, distribute=False, saas=True, willing_to_open_source=False))

# 逐层看开放度：缺哪一层，决定的是你能用它还是能重做它
missing = [k for k, got in OPEN_LAYERS.items() if not got]
print("未开放的层次：", "、".join(missing))

# 最后一格自查：条款会改版，选型表要写下你读的是哪一版、哪天读的
print("选型表末列：条款版本号 + 阅读日期，半年后你会庆幸写过它")`,
      pit: "选型时只看「它开不开放」，不看条款文本。典型结果：实验全部跑通、进入上线前复核才发现许可证带「不得用于竞争产品」或月营收上限条款，或者你以为不分发就不开源、却忽略了自己正在用网络服务对外提供它——于是整体换模型，前面所有评测、提示词调优与量化结果全部作废。正确做法是把四问与四层开放度写进选型表第一列，在任何一次 GPU 实验之前填完。",
      pit_en: "Shortlisting on 'is it open' without reading the terms. The classic outcome: every experiment passes, then the pre-launch review finds a no-compete clause or a revenue cap on the model licence - or you assumed you were safe because you ship nothing, forgetting you are serving it over a network. The whole model gets swapped and every evaluation, prompt and quantisation result dies with it. Do the four questions and four openness layers in column one of the shortlist, before the first GPU run.",
      ex: {
        q: "为什么权重开放不等于这个模型可以被复现？",
        a: "因为复现需要的是数据及其配比、训练代码与超参、以及评测口径，权重只是这条流水线的一次输出快照；缺中间层，你甚至无法确定它那个分数是在什么协议下测出来的。",
        q_en: "Why do open weights not mean the model is reproducible?",
        a_en: "Because reproduction needs the data and its mixture, the training code and hyper-parameters, and the evaluation protocol; weights are only one output snapshot of that pipeline. Without the middle layers you cannot even fix the protocol under which its published score was measured."
      }
    },

    /* ===================== agi7-2 ===================== */
    {
      id: "agi7-2",
      title: "算力与资本格局：门槛曲线如何决定谁能参与",
      title_en: "Compute and Capital: How the Barrier Curve Decides Who Can Play",
      min: 13,
      target: "能把「训练门槛」拆成四项成本并分别判断其随时间的走向，用一本显存账和一本单位成本账定位自己与小团队实际可选的位置。",
      target_en: "Split the training barrier into four cost terms with separate time trends, and use a memory ledger plus a unit-cost ledger to locate the squares that an individual or a small team can actually occupy.",
      summary: [
        "门槛要拆成三件事来看，否则任何关于门槛的说法都能骗到你：一次训练实验的显存、一个「能对外发表」的模型的全成本、以及「按周迭代」的持续成本。历史上第一项在下降、第二项涨得最快、第三项最少被公开讨论——所以「门槛在降」和「门槛在升」在媒体上可以同时成立，因为它们指的是不同的东西。",
        "一次像样的预训练所需资源的量级变化（这里只给数量级，不给精确值）：2010 年代初期是单机多卡可以承担的规模；此后主流大模型预训练进入千卡级以上、以月为单位的区间，量级抬升大约在三个到六个数量级之间。这不是哪一方刻意设计的结果，而是把「参数量 × 训练 token 数」当作主要杠杆之后的必然走势。",
        "推理成本在同一时期反向移动：同一个能力水平的任务，其单位成本大约每隔一到两年下降一个数量级。原因不是魔法，而是量化与稀疏、连续批处理与缓存复用、架构为并行度让路、以及硬件代际。这条下降曲线是本章最实用的一件工具：今天算不过来的方案，明年可能就算得过来，所以「现在不做」和「永远不做」是两个不同的判断。",
        "门槛是四项之和，而且只有第一项随价格下降：硬件、数据获取、工程人力、评测与运维。数据获取的难处从「有没有」变成「干不干净、有没有权利用」；人力与运维随你要维护的复杂度上升。因此「GPU 越来越便宜，所以人人都能训大模型」这句推理是坏的——越来越便宜的是推理，越来越贵的是维持一支能够持续训练的队伍。",
        "「能训一次」和「能持续训」是两个不同的能力，本站刻意把它们分成两句话：前者只需要在某个时刻凑齐资源与知识；后者要求数据管线可定期重跑、有一把回归评测尺子替你决定这一版上不上、有检查点与故障恢复、有人值守、以及下一季度已经批下来的预算。能跑通的脚本证明第一条；能按月产出可互相比较的版本，才证明第二条。",
        "资本结构还会悄悄改写你的选题：预算批不批取决于能否在一个财务周期里讲清收益，于是能力叙事让位于交付口径。这与 agi5 里那条「预期—资金—能力—交付」回路是同一个机制，只是这一次的对象是你自己的项目。个人层面的推论很实际：把自己放在小预算就能验证的位置上，比挤进一个必须大预算才有意义的位置更重要。",
        "个人与小团队实际可选的位置（下一节展开成图谱）：微调与蒸馏、评测与数据、推理优化与端侧部署、工具链与可复现性、以及垂直场景的应用。这五处的共同点是回报主要由工程与判断决定，而不是由你抢到多少卡决定；差别在于对系统能力与对统计能力的要求比例——而这恰好是本站两条路线的分工。",
        "本节最后交给你一条表述纪律，也是自查工具：任何关于门槛的论断都要写成「约 + 量级 + 哪一年」，不写公司名字、不预测谁赢。数字会过期，判断结构不会；本章全部示例都在本地跑，就是为了让你习惯「用一张表而不是用一条新闻做决定」。"
      ],
      summary_en: [
        "The barrier is three different things, and unless you separate them any claim about it will fool you: the memory of one training experiment, the full cost of a model you could actually publish, and the running cost of iterating weekly. Historically the first falls, the second rises fastest, and the third is discussed least in public - so 'the barrier is dropping' and 'the barrier is rising' can both be true in print, because they name different objects.",
        "Take the order of magnitude of one respectable pre-training run (magnitudes here, never precise values): in the early 2010s a single machine with a few accelerators was within range; mainstream large-model pre-training then moved into the four-figure-accelerator, multi-month region, a shift on the order of three to six magnitudes. Nobody engineered that as a trap - it is what happens once 'parameters times training tokens' becomes the main lever everyone pulls.",
        "Inference cost moved the other way in the same window: for a task of fixed capability, the unit cost drops by roughly one order of magnitude every one to two years. There is no magic in it - quantisation and sparsity, continuous batching and cache reuse, architectures yielding to parallelism, and hardware generations. This decay curve is the most useful object in the section: a plan that fails the arithmetic today may pass next year, so 'not now' and 'never' are two different judgements.",
        "The barrier is a sum of four terms and only the first one gets cheaper with time: hardware, data acquisition, engineering headcount, evaluation and operations. What is hard about data shifted from 'does it exist' to 'is it clean and may we legally use it', while people and operations grow with the complexity you keep alive. So 'GPUs are getting cheaper, therefore everyone can train a big model' is a bad inference: what gets cheaper is inference; what gets dearer is keeping a team able to train continuously.",
        "'Able to train once' and 'able to keep training' are different capabilities, and this section deliberately uses two sentences for them. The first needs resources and knowledge at one moment in time. The second needs a data pipeline that can be re-run on a schedule, a regression ruler deciding whether this version ships, checkpoints and failure recovery, someone on call, and a budget already approved for next quarter. A script that runs proves the first; only versions that stay comparable month after month prove the second.",
        "Capital structure quietly rewrites your topic choice, because a budget is approved on whether the payoff can be stated inside one financial cycle - which is where capability narratives lose to delivery narratives. This is the same expectation-money-capability-delivery loop from agi5, only now pointed at your own project. The personal corollary is blunt: put yourself where a small budget can test you, rather than where only a large budget makes the question meaningful.",
        "The squares an individual or small team can genuinely occupy (the next section turns this into a map): fine-tuning and distillation, evaluation and data, inference optimisation and on-device deployment, tooling and reproducibility, and applications in one narrow vertical. All five pay out for engineering and judgement rather than for how many accelerators you got to hold; they differ in the ratio of systems skill to statistical skill - which is exactly the split between this site's two routes.",
        "One last piece of writing discipline, which doubles as a self-check: every claim about the barrier should be phrased as 'approximately, in orders of magnitude, as of year X', with no company named and no winner predicted. Numbers expire; the shape of the judgement does not. Every example in this chapter runs locally precisely so that you get into the habit of deciding from a table rather than from a headline."
      ],
      code: `# 显存账：参数只是第一项，训练时真正的大头常在优化器状态
def train_mem_gib(params_b):
    # 混合精度下权重与梯度合计约 4 字节每参数
    weight_and_grad = params_b * 4
    # 主权重与两阶动量合计约 12 字节每参数：漏掉它就低估一个量级
    optim_state = params_b * 12
    # 激活值随批量、序列长度与层数增长，这里给一个保守的量级占位
    activation = params_b * 3
    total_bytes = weight_and_grad + optim_state + activation
    return round(total_bytes / 1024 ** 3, 1)

# 推理侧另有一本账：KV 缓存按并发与序列长度增长，与参数量不成正比
def kv_cache_gib(layers, heads, head_dim, seq, concurrency):
    per_token = 2 * layers * heads * head_dim * 2
    return round(per_token * seq * concurrency / 1024 ** 3, 1)

for p in [0.5, 1.5, 7, 13, 70]:
    print("参数量", p, "B -> 训练显存量级约", train_mem_gib(p * 1e9), "GiB")
print("并发 32、序列 4096 的 KV 缓存量级约", kv_cache_gib(32, 32, 128, 4096, 32), "GiB")

# 单位推理成本的下降只写成形状：每两年一个数量级，看斜率不看截距
print("同一任务相对成本（合成数据）：")
for year in range(0, 7):
    print("  第", year, "年 ->", round(0.1 ** (year / 2.0), 4))

# 能训与能持续训的差别是一张清单，不是一个更大的数字
SUSTAIN = ["数据管线可按周重跑", "回归评测有固定基线", "检查点与故障恢复可验证",
           "有人值守并能解释失败", "下一季度预算已经批了"]
for item in SUSTAIN:
    print("持续训练检查：", item, "-> 我举得出证据吗")`,
      pit: "只按参数量估显存，看到「7B 约 14 GB」就认定自己的单卡也能训。忘了训练还要放优化器状态、梯度和激活值（全参数训练时常是权重本身的三到五倍），也忘了数据管线、评测与故障恢复各要一份人力。结果是把「我也能训一个模型」写进计划，第一次跑就撞在显存与时间双重墙前，然后误判成「这条路不适合我」——那其实是账算错了。",
      pit_en: "Estimating memory from the parameter count alone: '7B is about 14 GB, so my single card can train it'. You forget that training also carries optimiser state, gradients and activations (often three to five times the weights for full-parameter runs), plus one human each for the data pipeline, the evaluation and the recovery. The plan says 'I can train a model too', the first run hits both the memory wall and the time wall, and you misdiagnose it as 'this road is not for me' when in fact the ledger was simply wrong.",
      ex: {
        q: "为什么「能训一次」和「能持续训」在门槛上是两件事？",
        a: "因为一次训练只需要在某个时刻凑齐资源与知识，而持续训练要求资源、评测、人力与预算四个周期长期重叠，其中只有第一项会随硬件降价自动改善。",
        q_en: "Why are 'can train once' and 'can keep training' two different barriers?",
        a_en: "Because a single run only needs resources and knowledge assembled at one moment, while continuous training requires four cycles - resources, evaluation, people and budget - to overlap for long, and only the first of them improves by itself as hardware gets cheaper."
      }
    },

    /* ===================== agi7-3 ===================== */
    {
      id: "agi7-3",
      title: "岗位图谱与技能栈：六类岗位每天在改什么",
      title_en: "The Role Map: What Six Kinds of Jobs Actually Change Each Day",
      min: 14,
      target: "能按「产出物」而不是岗位名称区分六类研发岗位，说清各自的日常、高频面试问题与彼此的迁移代价，并把自己映射到图上。",
      target_en: "Distinguish six R-and-D roles by their output rather than their job title, state what each touches daily, what an interview there asks, how costly each switch is, and place yourself on the map.",
      summary: [
        "先把 career 章的方法接过来用：岗位名不是能力名，招聘要求里的动词才是。这一节把 agi1~agi4 的技术与 agi7-2 的资源现实合并成一张图，图上每个格子的判据只有一条——「这个岗位每天打开电脑在改什么东西」；名称会漂移，产出物不会。",
        "数据岗的产出物是样本：抓取与清洗、去重与污染检查、标注规范与一致性抽检、配比实验（同一份预算下哪些来源多放、哪些砍掉）。高频面试问题：你怎么证明去重真的有效果、训练集与评测集的重叠你怎么查、标注一致性用什么指标量、以及你怎么证明这次清洗让最终指标涨了——最后一个最致命，因为它要求你把因果追到某一版数据上。",
        "训练岗的产出物是「这一版要不要上」：配方与超参、小规模验证外推、长跑与故障恢复、以及面对 loss 平台期时判断问题出在数据还是配方。会被问：显存不够时你按什么顺序砍、同规模下两个配比谁更好你怎么排除随机波动、上一次训练失败你的归因是什么。这一岗最考验的不是写循环，而是把一次实验做成一条可比较的证据链。",
        "推理优化岗的产出物是执行：算子与图改写、量化与稀疏、连续批处理与 KV 缓存管理、显存与调度。面试问的是拆解能力：端到端时延你怎么分段测量、量化后精度掉了怎么报（含方差）、一个 kernel 慢你是先看访存还是先看分支、以及你为省 20% 显存愿意付出多少精度——这岗位的题库几乎就是本站 eng、s11、s17 与 agi4-2 的下游。",
        "评测岗的产出物是尺子：题目构建与防泄漏、指标选择与误差分析、多次运行的方差与显著性、回归评测与线上 A/B、榜单去污染。高频问题：你怎么证明这把尺子有效、样本量与置信区间怎么定、用大模型当评审有哪些系统偏差、以及分数涨了但用户反馈没变你怎么解释。这一岗与 agi6 直接相连，是「判据」这件事在职场上的化身。",
        "剩下两类常被忽略但岗位数量最多：安全对齐（把政策翻成数据与评测：红队用例、护栏、可审计的变更记录、最小权限的工具调用面）与产品交付（把模型变成一个可运维的功能：单位成本与容量规划、失败回退、灰度与回滚、可观测性）。两者的共同点是它们为另外四类提供约束条件，因而最先接触到真实世界的不讲理。",
        "可迁移性要按共用基础设施来看，而不是按头衔相近来看：评测与数据最易互转（共用口径与统计，换的是题目不是方法）；推理优化与产品交付互转（共用性能剖析与容量账）；训练与评测互转（都在回答「这一版是不是更好」）；最不可迁移的不是语言或框架，而是「你手上有没有可核对的数字」——这一条恰好由作品集决定，下一节就讲它。",
        "给自己的一条判断：第一份工作选「能在小事上产出带数字证据」的位置，而不是名字最好听的位置。评测与数据是资源要求最低、证据最容易积累的两格，也是转行者的落脚点；反过来，只有当你能说清「我做的哪个决定让指标或时延变了多少」时，这张图才第一次变成你的资产而不是一张海报。"
      ],
      summary_en: [
        "Start by reusing the career chapter's method: a job title is not a capability; the verbs in the listing are. This section merges the technique of agi1-agi4 with the resource reality of agi7-2 into one map, and every square on it answers a single test - 'what does this role actually change when it opens the laptop'. Titles drift; outputs do not.",
        "The data role's output is samples: collection and cleaning, deduplication and contamination checks, annotation guidelines and inter-annotator spot checks, and mixture experiments (which source gets more of the budget, which gets cut). Expect to be asked: how do you prove deduplication helped, how do you find overlap between training and evaluation data, what metric quantifies annotation agreement, and how do you show that this cleaning moved the final number. The last one is the killer, because it demands a causal trace rather than a story.",
        "The training role's output is the decision 'does this version ship': recipe and hyper-parameters, small-scale validation before extrapolation, long runs and failure recovery, and, when the loss plateaus, telling data trouble from recipe trouble. Interview questions: in which order you cut when memory runs out, how you rule out random noise when comparing two mixtures at the same scale, and what your attribution was for the last failed run. This job tests not your ability to write a loop but your ability to turn one experiment into a comparable chain of evidence.",
        "The inference-optimisation role's output is execution: operators and graph rewrites, quantisation and sparsity, continuous batching and KV-cache management, memory and scheduling. The interview is decomposition: how you measure each slice of end-to-end latency, how you report accuracy lost to quantisation (with variance), whether you look at memory access or branching first when a kernel is slow, and how much accuracy you would trade for twenty percent less memory. Its question bank is essentially the downstream of this site's engineering, template and compression chapters.",
        "The evaluation role's output is the ruler: task construction and leakage prevention, metric choice and error analysis, run-to-run variance and significance, offline regression suites versus online A/B, and leaderboard decontamination. Asked most often: how do you show the ruler is valid, how do you size the sample and the interval, which systematic biases come from using a large model as judge, and how do you explain a score that rose while user feedback did not. This role connects straight to agi6 - it is what 'criteria' looks like as a job.",
        "The remaining two are under-discussed but most numerous: safety and alignment (turning policy into data and tests: red-team cases, guardrails, auditable change records, a least-privilege tool surface) and product delivery (turning a model into an operable feature: unit cost and capacity planning, failure fallback, staged rollout and rollback, observability). Both supply constraints to the other four, which is why they meet the real world's unreasonableness first.",
        "Read transferability through shared infrastructure rather than similar titles: evaluation and data convert easily (same statistics and protocol habit, only the subject changes); inference optimisation and product delivery do (same profiling and capacity ledger); training and evaluation do (both answer 'is this version better'). The hardest thing to transfer is not a language or a framework but whether you own checkable numbers - which is decided by your portfolio, the next section's subject.",
        "A rule to keep for yourself: take the first job where you can produce small, numeric evidence, not the one with the most flattering title. Evaluation and data are the two squares with the lowest resource requirement and the fastest evidence accumulation, which makes them the landing pad for career switchers. Conversely, the map only becomes your asset the moment you can say which decision of yours moved a metric or a latency, and by how much."
      ],
      code: `# 岗位图谱：按每天在改什么东西来分，不按招聘标题来分
ROLES = {
    "数据": "改样本（清洗、去重、标注一致性、配比）",
    "训练": "改配方并拍板这一版上不上（超参、长跑、故障恢复）",
    "推理优化": "改执行（算子、图改写、量化、批处理与缓存）",
    "评测": "改尺子（题目、指标、方差、回归与去污染）",
    "安全对齐": "改约束（红队用例、护栏、最小权限、可审计）",
    "产品交付": "改成本与失败路径（容量、回退、灰度、可观测性）",
}

# 你手里已有的证据：一律按本站课程能拿出的数字来写，不写课程名
SKILLS = {"内存与性能剖析", "训练循环与梯度", "评测与统计"}

NEED = {
    "数据": {"数据清洗", "评测与统计"},
    "训练": {"训练循环与梯度", "评测与统计"},
    "推理优化": {"内存与性能剖析", "接口与部署"},
    "评测": {"评测与统计", "数据清洗"},
    "安全对齐": {"评测与统计", "接口与部署"},
    "产品交付": {"接口与部署", "内存与性能剖析"},
}

# 匹配分只是入口，缺口那一列才是面试真正会问你的地方
for role, req in NEED.items():
    hit, gap = req & SKILLS, req - SKILLS
    print(role, "覆盖", len(hit), "/", len(req), "| 缺口：", "、".join(sorted(gap)) or "无")
    print("   这一格每天在改的东西：", ROLES[role])

# 迁移代价看共用基础设施：这两对换的是题目，不是方法
print("可迁移提示：评测 <-> 数据；推理优化 <-> 产品交付")

# 最后一问留给自己：一年后这个岗位能留下哪三个可核对的数字
print("选岗硬判据：能不能在小任务上攒出带数字的证据")`,
      pit: "按岗位名投简历、按最热的那个准备面试。结果是要么进去发现工作是另一件事（头衔写着「算法」，日常是给人工标注平台修接口），要么面试被一句「你上次说指标涨了，涨了多少、跑了几次、置信区间多大」问穿——因为你准备的是名词，对方问的是数字。正确顺序是先选产出物、再补该产出物要求的证据。",
      pit_en: "Applying by job title and preparing for whatever role is hottest that season. Either you walk in and find a different job (title says 'algorithm', daily life is patching the annotation platform's endpoints), or an interview exposes you with one sentence - 'you said the metric went up: by how much, over how many runs, what interval' - because you prepared nouns and they asked for numbers. Pick the output first, then gather the evidence that output requires.",
      ex: {
        q: "为什么评测岗常被建议作为转行者的第一站？",
        a: "因为它对硬件与人力的门槛最低、而对判断与统计的要求最实在：一份小评测集、多次运行的方差、一次污染检查就能构成可核对的证据，且这些能力日后无论转数据、训练还是交付都用得上。",
        q_en: "Why is the evaluation role so often recommended as a switcher's first square?",
        a_en: "Because it has the lowest hardware and headcount bar and the most concrete demand for judgement and statistics: one small task set, the variance across runs, and a single contamination check already make checkable evidence - and all of it transfers afterwards into data, training or delivery."
      }
    },

    /* ===================== agi7-4 ===================== */
    {
      id: "agi7-4",
      title: "两条路线的作品集决策树：C++ 一层与 Python 一层",
      title_en: "A Portfolio Decision Tree: One Layer in C++, One in Python",
      min: 14,
      target: "能按自己的机器、时间与证明对象选路线，并为两条路线各列出可见成果；会用同一个项目的两层结构同时证明系统能力与判断能力。",
      target_en: "Choose a route from your own machine, time and audience, list the visible artefacts each route must produce, and use one two-layer project to prove systems skill and judgement skill at once.",
      summary: [
        "先把「作品集」定义收紧到能判真伪的程度：它是三分钟内可由别人独立验证的一份证据。三个条件同时成立才算——可运行（对方能跑起来）、可核对（有数字，不只有截图）、可归因（明确写出哪一部分是你写的、哪些是依赖）。这比 career 章「简历与项目作品集」的那条老规则更硬：简历上一行 = 一个可验证的数字。",
        "C++ 路线（系统 / 推理优化 / 端侧部署）的可见成果是「你能碰到机器」：一个最小推理内核（矩阵乘、softmax、采样）与它的时延分解表；量化前后精度与速度的对照；一次端到端剖析报告（火焰图或分段计时）说明你把瓶颈从哪挪到了哪；以及一个真的在 CPU 或开发板上跑通的端侧 demo。这一支证明的是可控性与数值细节，不是「我会写模板」。",
        "Python 路线（应用 / 数据 / 评测）的可见成果是「你能判断好坏」：一份能重跑的训练或微调脚本（固定随机源、一个 config 跑全流程）；一个小评测集加报表（含多次运行的方差与污染检查）；一个带失败回退与离线指标的 Agent 应用；以及一份数据说明（来源、清洗规则、你砍掉了什么、为什么）。这一支证明的是口径与决策，不是「我会调库」。",
        "决策树的三个判据按顺序问：你可用的机器（无 GPU 也能推进的只有 C++ 路线与评测路线；一张消费级卡才谈得上微调与量化）；你的时间形状（系统类成果是长连续的深坑，应用与数据类成果能被碎片时间推进）；你要向谁证明什么（做基础设施的团队看时延表，做产品的团队看你能不能定义成功）。用热度做第一判据的人，常常在第二判据上退赛。",
        "用同一个项目同时证明两种能力的关键是「两层结构 + 一张共用数字表」：上层用 Python 做评测、数据与接口（证明你知道什么算好），下层用 C++ 做内核与部署（证明你能把它变快）。两层共用同一张表——时延、吞吐、显存、分数与方差——上层负责解释它，下层负责改善它。于是同一个成果对两类面试官都成立，而你只付一次项目成本。",
        "可见成果的常见死法有四种，且都有解药：教程复刻而零改动（解药：加一个教程没有的约束，比如离线或端侧）；只有截图没有代码（解药：把验证步骤写成三条命令）；把外部服务当成果（解药：写清你的部分在哪一层，本站示例全离线正是为此）；README 里没有「怎么验证」这一段（解药：写不出这一段就说明你自己也没验证过）。",
        "把作品集当接口面来维护，而不是当收藏柜：每季度只维护一两件，其余归档并注明为什么放弃；每件都要有一个「已知缺陷」段落——能说出自己东西哪里坏，是从「做过项目」到「做过判断」的分界线，也是面试里最省力的加分项；这条纪律与 agi7-2 的「能持续」是同一件事在个人层面的投影。",
        "去向一句：下一节讲怎么把别人的成果变成你的判断材料——读一篇论文并做最小复现；再下一节讲怎么把你的成果交出去——参与开源与公开写作；最后把这两件事与本节的位置图一起收口。"
      ],
      summary_en: [
        "Tighten the definition of a portfolio until it can be falsified: evidence somebody else can verify within three minutes. Three conditions must hold at once - runnable by them, defensible with numbers rather than screenshots, and attributable, meaning you say plainly which parts you wrote and which are dependencies. That is harder than the old career-chapter rule it comes from: one line on the CV equals one checkable number.",
        "Visible artefacts of the C++ route (systems, inference optimisation, on-device deployment) prove you can touch the machine: a minimal inference kernel (matmul, softmax, sampling) with its latency breakdown; an accuracy-versus-speed table before and after quantisation; one profiling report that says which bottleneck you moved and where; and a demo that genuinely runs on a CPU or a board. This branch sells control and numerical detail, not 'I can write templates'.",
        "Visible artefacts of the Python route (applications, data, evaluation) prove you can tell good from bad: a re-runnable fine-tuning script with a fixed random source and one config driving the whole flow; a small task set plus a report carrying run-to-run variance and a contamination check; an agent application with a failure fallback and offline metrics; and a data note stating sources, cleaning rules, what you cut and why. This branch sells protocol and decisions, not 'I can call libraries'.",
        "Ask the decision tree's three tests in order. Your machine: only the C++ route and the evaluation route advance without any accelerator, while a single consumer card is what makes fine-tuning and quantisation discussable. Your time shape: systems work wants long unbroken dives, data and application work tolerates fragments. Your audience: infrastructure teams read latency tables, product teams read whether you can define success. People who start from which route is fashionable usually quit at the second test.",
        "The trick for proving both skills with one project is a two-layer structure over one shared numeric table. The upper layer is Python: evaluation, data and interface, which shows you know what 'good' means. The lower layer is C++: kernel and deployment, which shows you can make it fast. Both layers read the same table - latency, throughput, memory, score, variance - the upper one explains it, the lower one improves it. One project, two credible audiences, one cost paid.",
        "Portfolio artefacts die in four predictable ways and each has an antidote: a tutorial copy with no change (add a constraint the tutorial lacked, e.g. fully offline or on-device); screenshots without code (write the verification as three commands); an external service presented as your achievement (say which layer is yours - this site keeps every example offline for exactly that reason); and a README with no 'how to verify' section (if you cannot write it, you never verified it either).",
        "Maintain the portfolio as an interface surface, not a storage unit: keep one or two pieces alive each quarter, archive the rest with a sentence on why you dropped them, and give every piece a 'known defects' paragraph. Being able to say where your own work breaks is the line between 'did a project' and 'made a judgement', and it is the cheapest point you can score in an interview. This discipline is the personal projection of agi7-2's 'can it be sustained'.",
        "Where this leads: the next section turns other people's results into material for your judgement - read a paper and reproduce just enough of it; the one after that hands your results outward - open source and writing in public. The final section closes the loop by folding both back into the position map from this section."
      ],
      code: `// 端侧最小推理内核：一个矩阵乘与一次 softmax，交付物是可核对的数字
#include <chrono>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>

using Clock = std::chrono::steady_clock;

// 朴素矩阵乘：先写下它的形状，性能报告要拿它当基线
static void matmul(const std::vector<float>& a, const std::vector<float>& b,
                   std::vector<float>& c, int n) {
    for (int i = 0; i < n; ++i) {
        for (int k = 0; k < n; ++k) {
            const float av = a[i * n + k];
            // 内层沿行扫描：连续内存访问是这一支要能讲清的一件事
            for (int j = 0; j < n; ++j) c[i * n + j] += av * b[k * n + j];
        }
    }
}

// 数值稳定要减最大值，否则指数项一上冲就变成 inf
static void softmax(std::vector<float>& v) {
    float m = v[0];
    for (float x : v) if (x > m) m = x;
    double sum = 0.0;
    for (float& x : v) { x = std::exp(x - m); sum += x; }
    for (float& x : v) x = static_cast<float>(x / sum);
}

int main() {
    const int n = 256;
    std::vector<float> a(n * n, 0.01f), b(n * n, 0.02f), c(n * n, 0.0f);
    auto t0 = Clock::now();
    matmul(a, b, c, n);
    auto t1 = Clock::now();
    std::vector<float> logits(8, 0.0f);
    for (int i = 0; i < 8; ++i) logits[i] = c[i];
    softmax(logits);
    double ms = std::chrono::duration_cast<std::chrono::microseconds>(t1 - t0).count() / 1000.0;
    // 交付物是这一行：毫秒、吞吐、优化前后对照，别只写能跑
    double gflops = 2.0 * n * n * n / ms / 1e6;
    std::cout << std::fixed << std::setprecision(3)
              << "matmul n=" << n << " 用时 " << ms << " ms, 约 "
              << gflops << " GFLOPS" << std::endl;
    // 同一张表要给上层复用：Python 侧解释它，C++ 侧改善它
    std::cout << "top-1 概率 " << logits[0] << "（这一步还没有采样，温度留给下一版）" << std::endl;
    return 0;
}`,
      pit: "项目做完只留下「能跑」：没有时延数字、没有分数与方差、没有内存曲线，也没有一句「哪部分是我写的」。三个月后你既说不清它好在哪，对方也无法在三十秒内判断你做到了哪一步——于是这个项目的信号量等于零。解药是在写第一行代码之前先把「怎么验证」那一段 README 写出来，写不出来就别开工。",
      pit_en: "Finishing a project that only 'runs': no latency numbers, no score with variance, no memory curve, and not one sentence saying which parts you wrote. Three months later you cannot describe what is good about it and nobody can judge your step depth in thirty seconds, so the project carries exactly zero signal. Antidote: write the README's 'how to verify' section before the first line of code, and if you cannot write it, do not start.",
      ex: {
        q: "为什么「同一个项目分两层」能同时证明两种能力，而不是两头都做成半吊子？",
        a: "因为两层共用一张数字表：上层负责定义成功并用 Python 做评测与数据（判断力），下层负责用 C++ 改善同一张表里的时延或显存（系统力），同一次投入产出两类面试官都能各自核对的证据。",
        q_en: "Why does splitting one project into two layers prove both skills instead of making both of them half-finished?",
        a_en: "Because both layers read one shared numeric table: the upper layer defines success with evaluation and data in Python (judgement), the lower layer improves the same table's latency or memory in C++ (systems). One investment yields evidence each kind of interviewer can verify on its own terms."
      }
    },

    /* ===================== agi7-5 ===================== */
    {
      id: "agi7-5",
      title: "读懂一篇论文并做最小复现",
      title_en: "Reading a Paper and Reproducing Just Enough",
      min: 15,
      target: "能按「结论优先」的顺序读论文并检查结论是否被实验支撑，能搭起固定随机源→先复现形状→再对齐分数的最小复现闭环，并对失败做三类归因。",
      target_en: "Read a paper conclusion-first and test whether the experiments carry the claims, build a minimal reproduction loop (fix the random sources, match the curve shape, then the absolute numbers), and attribute failures to one of three causes.",
      summary: [
        "前置是 agi6 与 ml3：那一章教你怎么判断一把尺子，这一节教你怎么判断别人递给你的结论；顺手把 career 的 STAR 法反过来用——一篇论文就是一个 STAR 论证（情境、任务、行动、结果），你的任务是检查它的 R 是不是被 A 撑起来的。",
        "阅读顺序要故意违反目录顺序：摘要 → 图 1 → 结论与局限 → 主表 → 方法 → 附录 → 最后才读相关工作。理由很实际：先建立「它声称什么、凭什么」的骨架，再去读方法，否则方法部分的复杂度会让你误以为复杂即可靠，把「我读懂了流程」当成「我认可了结论」。",
        "结论与证据的对齐检查：把摘要与结论里每一个带比较级的句子抄成一行（更快、更省、优于、泛化到），逐行去表与图里找对应的那一格。找不到数字对应的句子就是修辞；修辞不会错，所以也不会给你任何信息——这一条同时是判断「这篇值不值得复现」的分诊台。",
        "公平性检查决定你对基线的信任度：对照组是否拿到同样的调参预算与数据量、算力口径是否一致（按 step 还是按 token 还是按墙钟）、报的是最好一次还是最后一次、跑了几颗随机种子、误差条是什么含义。缺一两样不算造假，但会把你自己的复现目标挪到别处去。",
        "最小复现闭环的三步是固定随机源 → 先复现曲线形状 → 最后才对绝对分数：第一步要固定随机种子、库版本、线程数与数据划分并把它们写进日志；第二步比较趋势（分桶均值、相对降幅、拐点位置、两条方法之间的相对差距）；只有形状对上之后，绝对分数的差异才是有意义的信号。",
        "为什么顺序不能反：形状一致而数值不对，多半是口径问题（步数单位、数据集划分、预处理、分词器不同、是否算了 EOS）；连形状都不对，才是实现或环境差异。反过来先追绝对分数，你会用调超参的方式把数字凑齐——那是一场上瘾的假复现，凑出来的分数不会随你换数据集而保持。",
        "失败归因分三类，每类的处置动作不同：实现差（去对伪代码与关键层，尤其注意掩码、初始化与归一化位置）、环境差（版本、硬件、非确定性算子、混合精度下的累加顺序）、口径差（评测协议、样本过滤规则、指标定义）。混在一起查的典型结局是通宵之后仍然不知道改了个什么才好的，因为你的实验里没有一条被固定住的轴。",
        "在本站练这个闭环不必真去找论文：用 ml、dl 两段的合成小实验自己造一个「结果」，保存曲线，再由第二个你复现它；这一步便宜、离线、且能故意制造三类故障让你辨认。练完之后你就有了一件比读论文更通用的能力——把任何一个声称变成一条能核对的曲线，这正是 agi7-7 里「凭什么这样判断」的具体形状。"
      ],
      summary_en: [
        "The prerequisites are agi6 and ml3: there you learned to judge a ruler, here you learn to judge a conclusion somebody hands you. It also inverts the career chapter's STAR method - a paper is one STAR argument (situation, task, action, result), and your job is to check whether its Result is actually held up by its Action.",
        "Deliberately read out of table-of-contents order: abstract, then figure 1, then conclusions and limitations, then the main table, then methods, then appendices, and only at the end related work. The reason is practical: build the skeleton of 'what is claimed, on what grounds' before you enter the methods, otherwise the machinery there will make complexity feel like reliability and you will mistake 'I followed the pipeline' for 'I accept the conclusion'.",
        "The alignment check: copy every sentence from the abstract and conclusion that contains a comparative (faster, cheaper, better than, generalises to) onto one line each, then find the exact cell in a table or figure that answers it. A claim with no matching number is rhetoric; rhetoric cannot be wrong, so it also tells you nothing. This same pass is your triage desk for deciding whether a paper is worth reproducing at all.",
        "Fairness checks decide how much you trust the baselines: did the control get the same tuning budget and the same data volume, is compute counted in steps, tokens or wall-clock, is the reported number the best run or the last one, how many seeds were run, and what the error bars actually mean. Missing one or two of these is not fraud, but it relocates the target your reproduction should be aiming at.",
        "The minimal loop has three fixed steps: lock the random sources, match the curve shape, and only then compare absolute numbers. Step one pins seed, library versions, thread count and data split into a log file. Step two compares trend - bucketed means, relative drop, where the knee sits, the gap between two methods. Only once the shape agrees does a difference in absolute score become a meaningful signal.",
        "Here is why the order cannot be flipped: shape matching while values disagree usually means a protocol difference (unit of a step, split, preprocessing, tokenizer, whether end-of-sequence is scored); a shape that does not match is an implementation or environment gap. Chase the absolute number first and you will tune your way to matching it - a fake reproduction you get addicted to, whose borrowed score will not survive changing the dataset.",
        "Failures have three homes and each has its own treatment: implementation gap (diff against the pseudocode and the critical layers, watching masks, initialisation and where the normalisation sits), environment gap (versions, hardware, non-deterministic kernels, accumulation order under mixed precision), protocol gap (evaluation recipe, sample filtering, metric definition). Debug them intermixed and the classic ending is a night over with no idea what you changed to make it work, because nothing in your experiment was a pinned axis.",
        "You can drill this loop on this site without ever fetching a paper: use the synthetic mini-experiments from the ml and dl sections to invent a 'published result', save its curve, then have a second version of you reproduce it, deliberately injecting each of the three failure kinds. What you end up with is broader than paper-reading - the ability to turn any claim into a curve you can check, which is precisely the shape of the question 'on what grounds do I judge this' in the final section."
      ],
      code: `# 复现最小闭环：先固定随机源，再比曲线形状，最后才对齐绝对分数
import math
import random

# 种子、版本、线程数与数据划分写进同一条记录，这就是复现日志的第一行
CONFIG = {"seed": 20260707, "steps": 40, "lr": 0.35, "noise": 0.05}

def run(cfg, true_lr=None):
    rng = random.Random(cfg["seed"])
    lr = cfg["lr"] if true_lr is None else true_lr
    curve = []
    for step in range(cfg["steps"]):
        # 真实规律只有一条：损失按指数下降，底部留一个不可约下界
        value = math.exp(-lr * step) + 0.2 + rng.gauss(0.0, cfg["noise"])
        curve.append(value if value > 0.0 else 0.0)
    return curve

def shape(curve, buckets=5):
    means = []
    size = len(curve) / buckets
    for i in range(buckets):
        part = curve[int(i * size):int((i + 1) * size)] or [curve[-1]]
        means.append(sum(part) / len(part))
    return [round(m, 3) for m in means]

mine = run(CONFIG)
paper = run(CONFIG, true_lr=0.35)
print("我的分桶均值：", shape(mine))
print("论文分桶均值：", shape(paper))

# 相对降幅与拐点位置才是先要对齐的东西，单点数值不算证据
first, last = mine[0], mine[-1]
drop = (first - last) / first if first else 0.0
print("相对降幅约", round(drop, 2), "形状一致时数值差异先查口径")

# 刷分数是假复现：把学习率一路凑到目标值，闭环当场断掉
target = 0.24
guesses = []
for k in range(1, 11):
    lr = k / 20.0
    tail = run({key: CONFIG[key] for key in ("seed", "steps", "noise")}, true_lr=lr)[-1]
    guesses.append((abs(tail - target), lr))
guesses.sort()
print("能凑出目标值的候选 lr：", [round(g[1], 2) for g in guesses[:3]])
print("凑得出来恰恰说明单点分数没有信息量，形状才有")`,
      pit: "跳第一步：没固定随机源就开始复现，或者更常见的是直接用作者仓库的默认 seed 却不知道自己机器上的线程数与非确定性算子已经把结果改了。于是你看到「同一份代码跑两次分数不一样」，误判成作者数字有假，或者反过来靠反复跑把它跑到了目标值上，记成自己复现成功。两种误判的共同原因是你没有把「哪一条轴被固定住了」写下来。",
      pit_en: "Skipping step one: reproducing without locking the random sources, or - more commonly - using the repository's default seed while never noticing that your thread count and non-deterministic kernels already moved the result. You then watch 'same code, two scores' and either accuse the authors of inflating them, or you re-roll until one run lands on the target and file it as a success. Both misjudgements share one root: nowhere is it written which axes you actually pinned.",
      ex: {
        q: "为什么复现要「先复现曲线形状」而不是先把最终分数对上？",
        a: "因为形状（趋势、相对降幅、方法之间的相对差距）对实现与环境差异敏感、对评测口径相对钝感，先比形状能把问题干净地切成两类：形状不对去查代码与版本，形状对而分数不对去查口径，反过来做则两类问题会互相掩盖。",
        q_en: "Why reproduce the curve shape before matching the final score?",
        a_en: "Because shape - trend, relative drop, the gap between two methods - is sensitive to implementation and environment while fairly blunt to evaluation protocol. Comparing shape first splits the problem cleanly: wrong shape means audit code and versions, right shape with wrong numbers means audit the protocol. Do it the other way and the two failure classes hide each other."
      }
    },

    /* ===================== agi7-6 ===================== */
    {
      id: "agi7-6",
      title: "参与开源与公开输出的最小路径",
      title_en: "The Shortest Path into Open Source and Publishing in Public",
      min: 13,
      target: "能沿七级阶梯进入一个真实项目，写出让维护者愿意合并的改动与带最小复现的 issue，并为公开输出建立发布前的风险扫描习惯。",
      target_en: "Climb a seven-step ladder into a real project, write changes a maintainer wants to merge and issues with a minimal reproduction, and build a pre-publication risk scan for anything you put out in public.",
      summary: [
        "前置是 eng 章的 Git 与本站的「最小可复现示例」这个名词：这一节不讲怎么配环境，只讲怎么让别人愿意接手你写的东西。先立一个反直觉的判断——参与开源的产出不只是被合并的提交，还包括你对陌生代码的理解速度，而后者不会因为对方拒绝你就退回来。",
        "阶梯是六级，按「别人要为你付多少成本」排序：把项目真用起来并提出有信息量的问题 → 提带最小复现的 issue → 修文档与示例 → 补测试或修坏测试 → 小 bugfix → 跨文件的中等改动 → 新特性。台阶不是荣誉等级，它的作用是逐级训练两件能力：读没有文档的代码，和接受评审意见而不把它当人身攻击。",
        "维护者视角决定了什么改动会被合：一个 PR 的真实成本 = 阅读 + 理解意图 + 评审 + 之后长期维护。让改动变便宜的做法是——一次只做一件事、沿用仓库现有风格、说明「为什么」而不是罗列「改了什么」、带测试或可粘贴的复现步骤、不在功能改动里夹带大范围格式化、评审回复快、并且自己先写出这个改动的限制与失败可能。",
        "issue 的写法就是本站「最小可复现示例」一词的实战版：标题写现象不写情绪，正文分「期望 / 实际 / 环境 / 复现步骤」四段，复现步骤删到三条以内且能直接粘贴运行，附上你排除过的两个猜想。这样一条 issue 被处理的概率比「求大佬看看」高一个量级，而且它不需要你有权改代码。",
        "公开写作的结构只有一种是有用的：我想解决什么 → 我以为该怎么做 → 实际发生了什么 → 结论能被谁重新核对。这类文章带来的反馈有两种，都值钱：有人指出你错在哪（最便宜的学习，因为它精确打击你的盲区），以及有人因此找到你（机会的来源）——本站把它叫反馈闭环，agi7-4 的作品集就是它的另一种形态。",
        "风险控制里最贵的一条是「别把还没发布的东西讲出去」：公司的代码与客户数据、未发表的实验结果、竞业与保密条款覆盖的范围、以及许可证要求的署名与条款随附义务（这一条与 agi7-1 直接相连）。养成一次机械扫描的习惯：密钥样式与令牌、个人绝对路径、内部代号与真实姓名、数据集出处与截图里的水印。",
        "选择投入哪个项目的判据是「你每天在用它」而不是「它最热门」：你的比较优势来自你的处境——手里的旧硬件、某个窄领域的真实数据、你踩过的某个只在特定组合下出现的坑——不来自热情。热门项目的第一条 issue 会被淹没，而你天天用的项目里那条与性能或部署有关的缺陷，往往正好是维护者缺证据的那一块。",
        "两类反模式要一起避免，它们错得同样多：一种是垃圾贡献（批量 typo、无关重构、为指标数字提 PR、把 issue 区当客服），它消耗的是整个生态的评审带宽；另一种是永远只在私下练习、从不公开，它看起来谦逊，实际上剥夺了自己被纠正的机会——而这一节的全部收益都建立在「有人告诉你你错了」上面。"
      ],
      summary_en: [
        "Prerequisites: the Git material from the engineering chapter and this site's entry for 'minimal reproducible example'. This section is not about configuring environments; it is about making other people willing to take custody of what you wrote. Settle one counter-intuitive judgement first: the output of contributing is not only merged commits, it is also the speed at which you read unfamiliar code, and that second one is not returned to you when your patch is declined.",
        "The ladder has six rungs, ordered by how much cost you impose on others: actually use the project and ask an informative question → file an issue carrying a minimal reproduction → fix documentation and examples → add tests or repair a broken one → a small bugfix → a medium change crossing files → a new feature. The rungs are not an honour ranking; they train two abilities rung by rung - reading code nobody documented, and taking review comments without reading them as an attack on your character.",
        "The maintainer's ledger decides what gets merged: the true cost of a pull request equals reading plus reconstructing intent plus review plus all the years somebody will spend maintaining it. Make the change cheap: one concern per request, follow the repository's existing style, explain why instead of listing what, attach a test or a paste-able reproduction, never smuggle a mass reformat into a functional change, answer review quickly, and state the limitations and failure modes yourself before a reviewer has to.",
        "Writing an issue is simply the field version of this site's 'minimal reproducible example': a title describing the phenomenon rather than your mood, a body in four blocks (expected, actual, environment, steps), the steps cut to three that run when pasted, plus the two hypotheses you already eliminated. Such an issue gets acted on roughly an order of magnitude more often than 'expert please look', and it requires no write access at all.",
        "Public writing has one structure that earns its keep: what I was trying to solve → what I believed the fix was → what actually happened → who can re-check my conclusion. Two kinds of feedback come out of it and both are valuable: somebody shows you exactly where you are wrong, which is the cheapest learning there is because it hits a blind spot you could not see; and somebody finds you, which is where opportunities come from. The site calls this a feedback loop; the portfolio in agi7-4 is the same loop in another shape.",
        "The costliest risk rule is: do not talk about things that are not out yet - your employer's code and your clients' data, unpublished experimental results, whatever your non-compete and confidentiality terms cover, and the attribution and notice obligations your own dependencies' licences impose (that last one links straight back to agi7-1). Build one mechanical habit before publishing: scan for key-like strings and tokens, personal absolute paths, internal codenames and real names, dataset provenance and watermarks inside screenshots.",
        "Choose which project to invest in by 'I use this daily', never by 'this one is hottest'. Your edge comes from your situation - the old hardware on your desk, the genuinely narrow domain whose data you can see, the bug that only appears in one awkward combination you happen to have walked into - not from enthusiasm. A first issue on a hot project drowns; a deployment-or-performance defect in a tool you use every day is very often exactly the evidence its maintainer is missing.",
        "Avoid both anti-patterns, they are wrong by equal amounts. One is junk contribution: drive-by typo sweeps, unrelated refactors, patches raised for a vanity metric, issue trackers used as a help desk - all of it is paid for from the whole ecosystem's review bandwidth. The other is practising forever in private and never publishing: it looks humble but it cancels your only supply of corrections, and every benefit in this section is built on somebody telling you that you are wrong."
      ],
      code: `# 一个 PR 的真实成本：阅读 + 理解意图 + 评审 + 之后长期维护
PR_CHECK = [
    ("只做一件事", 2),
    ("沿用仓库现有风格", 2),
    ("说明为什么而不是改了什么", 3),
    ("带测试或可粘贴的复现步骤", 3),
    ("没有夹带无关格式化", 2),
    ("自己先写出限制与失败可能", 2),
]

# 分数低不是别投，而是先把范围缩到一格：多数被拒的 PR 都太大
total = sum(v for _, v in PR_CHECK)
print("自查满分", total, "->", "值得提" if total >= 10 else "先缩小范围再提")
print("其中权重最高的两项：", sorted(PR_CHECK, key=lambda kv: -kv[1])[:2])

# issue 四段式：这是最小可复现示例在真实仓库里的用法
ISSUE = {"标题": "空输入时抛异常而非返回空列表",
         "期望": "返回空列表",
         "实际": "索引越界异常",
         "复现步骤": "三条以内，可直接粘贴运行",
         "已排除": "非环境差异，与线程数无关"}
for field, text in ISSUE.items():
    print("issue 字段", field, "：", text)

# 公开之前做一次机械扫描：密钥样式、个人绝对路径、内部代号、真实姓名
LEAK = ["api_key", "sk-", "token=", "/home/", "/Users/", "内部代号", "客户名"]
DRAFT = "脚本里填了 api_key 与 sk- 开头的令牌，输出落在 /home/me/out.csv，项目代号是内部代号"
hits = [k for k in LEAK if k in DRAFT]
print("发布前命中：", "、".join(hits) or "无")

# 阶梯按别人为你付的成本排序，不是按荣誉感排序
LADDER = ["用起来并问一个好问题", "带最小复现的 issue", "修文档与示例",
          "补测试或修坏测试", "小 bugfix", "跨文件的中等改动", "新特性"]
for i, rung in enumerate(LADDER, 1):
    print("第", i, "级：", rung)`,
      pit: "第一次参与就想重写一个子系统，理由通常是「我看懂了它的设计缺陷」。结果几乎固定：改动太大无法评审、与作者的路线冲突、被委婉地永久挂起，而你把仅有的热情耗在了一次没有回音的提交上。更糟的另一个极端是只在本地改、从不公开，等于放弃了唯一能纠正你的那一路反馈。正确动作是把想法切成「今天能被评审的最小一格」。",
      pit_en: "Rewriting a subsystem on your first contribution, usually because 'I can see the design flaw'. The outcome is nearly deterministic: too large to review, colliding with the author's roadmap, gently parked forever - and your whole reserve of enthusiasm goes into a submission nobody answered. The opposite extreme is just as expensive: patching locally and never publishing, which forfeits the only feedback channel that could correct you. The right move is cutting the idea down to the smallest square a reviewer can finish today.",
      ex: {
        q: "为什么修文档是有效的起点而不是「低端贡献」？",
        a: "因为文档与示例的改动成本最低、评审周期最短，却同时要求你真正把安装与使用流程跑通一遍——它检验的是新手视角这个维护者最难自测的东西，也是你练读陌生代码与走提交流程的最低风险场地。",
        q_en: "Why is fixing documentation an effective starting point rather than a low-end contribution?",
        a_en: "Because doc and example changes cost a reviewer the least and merge the fastest, yet they force you to genuinely walk the install-and-use path once. What they test is the newcomer's viewpoint, which maintainers are worst placed to self-check, and they are the lowest-risk gym for reading unfamiliar code and learning the submission workflow."
      }
    },

    /* ===================== agi7-7 ===================== */
    {
      id: "agi7-7",
      title: "全站终点：把你的 AGI 路线画成一张图",
      title_en: "Full-Site Finale: Draw Your Own AGI Route as One Picture",
      min: 15,
      target: "能把 s1 到 agi7 全链合成一张位置图，回答「我在哪、下一步做什么、凭什么这样判断」三问，并写出一份可判完成的 90 天计划与固定复盘节奏。",
      target_en: "Fuse everything from s1 through agi7 into a single position map that answers where I am, what I do next and on what grounds, and write a 90-day plan that can be judged done or not plus a fixed review cadence.",
      summary: [
        "终点先说清楚走过的是什么：本站的顺序是「语言 → 数学 → 数据 → 模型 → 系统 → 应用 → 判据 → 位置」八段——s1~s18 与 stl、algo 给了语言和系统，ma 与 sp 给了数学与数据，ml、dl 给了模型，agi1~agi4 给了应用与落地，agi5 回答「它怎么走到今天」，agi6 回答「凭什么说到到了」，本章回答「我在哪一格」。这八段里前面七段都是外部世界，只有最后一段必须有你的名字。",
        "这张图只有一个画法：横轴是五个能力层（机器与系统 / 数据与训练 / 模型与应用 / 判据与评测 / 位置与生态），纵轴是你自己能拿出的证据强度（能跑、能改、能评、能造）。把每完成一章填进一格，画完的常见结论是所有人都会撞上同一个事实：格子挤在中间两层，最左与最右是空的——左空是因为不碰机器，右空是因为从不公开。",
        "图上有三个必须回答的问题，顺序不能换：我在哪（只准引用可核对的证据：跑过的实验、能重跑的脚本、被合并的改动，「学过」不算证据）；下一步做什么（一个交付，不是一门课）；凭什么这样判断（第三问最容易空，也最关键——写不出判据就说明你在跟风向走，这一问的工具正是 agi6 给你的那套判据与度量）。",
        "两条路线在这里合并成一条：cpp 路线与 py 路线不是两种人生，而是同一个项目的两层——一层解释数字（Python：数据、评测、接口），一层改善数字（C++：内核、部署、内存）。本站给的那条等级「双语言者」说的就是这个能力：你能用 Python 判断一件事值不值得做，也能用 C++ 把它做到够快。选定一条为主线，另一条当接口面，别把自己劈成两半同时追。",
        "误区前两条来自评测与工具：把榜单当路线图（榜单是别人问题的解，你在替别人做研究，参照 agi5 关于基准饱和与 agi6 关于尺子有效性的两节）；把工具当能力（会调某个框架不是能力，能被换掉框架而你还值钱才是——工具在手里的折旧速度比你想象快得多，而拆延迟、算显存、查污染这些判断不会折旧）。",
        "误区后三条更常见也更隐蔽：把收藏当学习（存下论文与教程不等于读过，判据是你能否不看材料复述出它的实验设计和它最弱的一环）；把生态位置当身份（「我是算法工程师」不是判断，「我在数据、评测、内核三处哪一处能持续产出证据」才是）；把复现当创新（复现的价值在闭环与归因，不在对上的那个分数，见 agi7-5）。",
        "90 天计划的写法只有一种能判完成：一个可展示交付（必须能在一台离线机器上被别人验证，这是本站全部示例都离线的真正原因）+ 每周一行数字（投入小时、产出物、那一个可核对的数）+ 一条放弃判据（连续两周拿不出新数字就换题）+ 三句「我怎么知道它在变好」。千万不要写「学完某章」：章节进度是可以无限拖延而没有结果的，交付不行。",
        "复盘节奏与它同样重要，且各层要换问题：每周只记数字、不做判断（防止你在证据不足时改主意）；每月只改一次判断（写下我原以为什么、这四周的数字说了什么、我改不改）；每 90 天换一次题目——换题是纪律不是失败，因为你在 agi7-2 已经知道哪些约束会随时间移动。全站到此收口：本站能给的只有地图、方法与这张位置图，剩下三问（做什么、值不值、够了没）都在站点之外。回去更新 agi5 那张因果图和 agi6 那张判据表，它们这才有主人。"
      ],
      summary_en: [
        "Say plainly what was walked to get here: this site runs in eight stages - language, mathematics, data, models, systems, applications, criteria, position. s1-s18 with the STL and algorithm chapters gave language and systems; ma and sp gave mathematics and data; ml and dl gave models; agi1-agi4 gave applications and delivery; agi5 answered 'how did this road get here', agi6 answered 'on what grounds would we say it arrived', and this chapter asks 'which square is mine'. Seven of those eight stages are the external world; only the last one has to carry your name.",
        "There is only one way to draw the picture: five capability layers across the axis (machine and system / data and training / model and application / criteria and evaluation / position and ecosystem), and the strength of your own evidence up the other one (can run it, can change it, can judge it, can build it). Drop each finished chapter into a square and almost everybody hits the same finding: the middle two layers are crowded, the two ends are empty - empty on the left because you never touch the machine, empty on the right because you never publish.",
        "Three questions must be answered on that picture, in this order and no other. Where am I - cite only checkable evidence: an experiment you ran, a script that re-runs, a change that got merged; 'I studied it' is not evidence. What is next - one deliverable, never one course. On what grounds do I judge - the question most often left blank and the most consequential, because without a criterion you are following the wind, and the tools for that column are exactly the criteria and measurements agi6 handed you.",
        "The two routes merge into one here: the cpp route and the py route are not two lives, they are two layers of one project - one layer explains the numbers (Python: data, evaluation, interface), the other improves them (C++: kernel, deployment, memory). The rank this site hands out, 'bilingual', names precisely that: you can judge with Python whether a thing is worth doing, and with C++ make it fast enough to matter. Pick one as your main line and the other as your interface surface; do not split yourself and chase both.",
        "The first two traps come from metrics and tools. Treating a leaderboard as a roadmap: a leaderboard answers somebody else's question, so you end up doing their research (see agi5 on benchmark saturation and agi6 on when a ruler is valid). Treating a tool as a capability: being able to drive one framework is not a capability - staying valuable after the framework is swapped out is; tools in your hands depreciate far faster than you expect, while decomposing latency, balancing memory and hunting contamination never do.",
        "The next three traps are commoner and subtler. Mistaking collection for learning: saving papers and tutorials is not reading them - the test is whether you can reconstruct an experiment's design and its weakest link without the material in front of you. Mistaking an ecological position for an identity: 'I am an algorithm engineer' is not a judgement; 'of data, evaluation and kernels, in which one can I keep producing evidence' is. Mistaking reproduction for innovation: its value is the closed loop and the attribution, not the number you matched (see agi7-5).",
        "Only one form of 90-day plan can be judged finished: one showcaseable deliverable that somebody else can verify on an offline machine (that constraint is the real reason every example on this site runs offline), plus one line of numbers per week - hours in, artefact out, that one checkable figure - plus one stop rule (two consecutive weeks with no new number and you switch topic), plus three sentences on how you will know it is improving. Never write 'finish chapter X': chapter progress can be extended forever without producing a result; a deliverable cannot.",
        "The review cadence matters as much and changes its question at each level. Weekly: record numbers only, judge nothing - that stops you from changing your mind while evidence is thin. Monthly: revise one judgement - what I believed, what these four weeks of numbers said, whether I move. Every ninety days: change the topic, which is discipline and not failure, because agi7-2 already told you which constraints drift with time. The site ends here: it gives you a map, a method and this position picture; the remaining three questions - what to do, whether it is worth it, when it is enough - live outside it. Go update the causal graph from agi5 and the criteria table from agi6; only now do they have an owner."
      ],
      code: `# 全站位置图：把每一章放进能力层，空格子就是你的真实状态
LAYERS = {
    "机器与系统": ["s7 指针与引用", "s11 模板与泛型", "eng 工程化", "career 面试冲刺"],
    "数据与训练": ["sp1 NumPy", "sp2 Pandas", "ml1~ml4", "dl1~dl5"],
    "模型与应用": ["agi1 强化学习", "agi2 大模型", "agi3 Agent", "agi4 落地"],
    "判据与评测": ["ma4 概率统计", "ml3 模型评估", "agi6 判据与评测"],
    "位置与生态": ["agi5 发展路线", "agi7 生态与切入点"],
}

# 下一步必须是一个交付而不是一门课：交付要能在离线机器上被别人验证
NEXT = {
    "deliverable": "做一件能给出数字的事：端侧推理器的时延对照表，或小评测集的方差报告",
    "weekly": "12 行：投入小时 / 本周产出物 / 那一个可核对的数",
    "stop_rule": "连续两周拿不出新数字就换题，这是纪律不是失败",
    "getting_better": ["数字的波动在变小", "同量投入换出的产出在变多", "有人愿意按我写的步骤复跑"],
}

# 三问的第三问最容易空：判据写不出来就是在跟风向走
CRITERIA = ["证据：我手上能跑的东西是什么",
            "交付：90 天后能拿出哪三个数字",
            "判据：什么信号出现说明我该改路线"]

# 两条路线在同一张表上合并：一层解释数字，一层改善数字
ROUTE = {"主线": "cpp 或 py 二选一", "接口面": "另一条只维护到能读能改"}

for layer, items in LAYERS.items():
    print(layer, "->", "、".join(items), "共", len(items), "项")
print("三问自查：", " | ".join(CRITERIA))
print("路线配置：", ROUTE["主线"], "／", ROUTE["接口面"])

# 把计划写成本地文本：不依赖任何服务，打印出来贴墙上就够了
lines = ["我的 AGI 路线：位置图与 90 天计划"]
for layer, items in LAYERS.items():
    lines.append("[" + layer + "] " + "、".join(items))
for key, value in NEXT.items():
    lines.append(key + "：" + str(value))
with open("plan90.txt", "w", encoding="utf-8") as f:
    f.write("\\n".join(lines) + "\\n")
print("已写出 plan90.txt：这张图从今天起有主人了")`,
      pit: "计划里写的全是「学完哪几章」而不是「做出哪个可验证的东西」。这类计划在到期那天必然无法判定完成与否，于是你把它顺延续期，一年三次还在同一批章节上——进度条看起来很忙，证据一条没多。第二种形态同样致命：一次定三个方向，理由是「都在我计划的路线上」；三个月后每个方向都停在不能演示的中间态。约束只有一个：一次只押一个能被别人三十秒验证的交付。",
      pit_en: "A plan made entirely of 'which chapters I will finish' instead of 'which verifiable thing I will build'. On the due date such a plan can be neither judged nor falsified, so you extend it - three times in a year, still on the same chapters, progress bar busy, evidence unchanged. The second shape is equally fatal: three directions at once, justified by 'they are all on my roadmap'; after ninety days each one sits in a state that cannot be demonstrated. One constraint fixes both: bet on a single deliverable somebody else can verify in thirty seconds.",
      ex: {
        q: "为什么 90 天计划必须绑定一个可展示交付，而不是章节进度？",
        a: "因为交付是唯一能同时提供完成判据与外部反馈的形式：章节进度可以无限拖延而不出结果，而一个能被别人在离线机器上跑通的交付会自动暴露你的假设哪里不成立——这正是 agi7-6 那个反馈闭环在个人节奏上的落地。",
        q_en: "Why must a 90-day plan be tied to a showcaseable deliverable rather than to chapter progress?",
        a_en: "Because a deliverable is the only form that supplies both a completion criterion and outside feedback at once: chapter progress can stretch forever without producing a result, while something somebody else can run on an offline machine automatically exposes which of your assumptions did not hold - that is exactly the feedback loop of agi7-6 installed into your personal cadence."
      }
    }
      ],

      /* ---------- 本章题库：2 选择 + 1 判断 + 1 填空 ---------- */
      quiz: [
        {
          q: "某个模型放出「开放权重」，权重文件可直接下载，许可证允许商用。据此下面哪项判断最稳妥？",
          o: [
            "既然权重可下载且允许商用，就等于该模型已被完全复现，可以直接替换现有服务",
            "只开放了权重这一层：训练数据、超参与评测口径未必可得，商用还要看有无附加条款与商标限制",
            "开放权重的模型在能力上必然弱于闭源 API，所以商用没有意义",
            "只要不改动权重，就无需再遵守许可证里的任何义务"
          ],
          a: 1,
          why: "开放度是分层的：权重、数据（或清单）、训练代码与超参、评测口径各自独立，多数发布只放开第一层。许可证虽允许商用，仍常附营收上限、不得用于竞争产品、强制署名等条款，且模型名可能是商标；再分发通常还要求随附许可证文本。",
          q_en: "A model ships 'open weights': the files are downloadable and the licence permits commercial use. Which judgement is the safest?",
          o_en: [
            "Downloadable weights plus commercial permission mean the model has been fully reproduced and can replace your service directly",
            "Only the weights layer is open: data, hyper-parameters and evaluation protocol may be absent, and commercial use still carries extra clauses and trademark limits",
            "An open-weight model must be weaker than any closed API, so using it commercially is pointless",
            "As long as you do not touch the weights, you owe nothing else under the licence"
          ],
          why_en: "Openness comes in layers - weights, data or its manifest, training code with hyper-parameters, and the evaluation protocol - and most releases open only the first. Even with commercial use allowed, such licences often attach a revenue cap, a no-compete clause and attribution duties, the model name may be a trademark, and redistribution usually requires shipping the licence text along with it."
        },
        {
          q: "你只有一张 24GB 的消费级显卡，看到「某模型 7B 参数，FP16 约 14GB」，于是计划做全参数预训练。这个估算最主要的漏项是什么？",
          o: [
            "没有把词表大小换算成显存",
            "漏掉优化器状态、梯度与激活值，训练侧常是权重大小的三到五倍；且持续训练还要求数据管线、回归评测与值守",
            "没有考虑硬盘读写速度对显存的影响",
            "漏算了模型的推理温度与采样参数占用"
          ],
          a: 1,
          why: "参数量只对应权重那一项。全参数训练还要放梯度、优化器主权重与两阶动量以及激活值，混合精度下合计约为权重字节数的数倍；更关键的是「能训一次」还依赖数据管线、评测与人力，这些都不是显存能解决的。",
          q_en: "You own one 24 GB consumer card, read that 'a 7B model in FP16 is about 14 GB' and plan a full-parameter pre-training run. What is the biggest hole in that estimate?",
          o_en: [
            "The vocabulary size was never converted into memory",
            "Optimiser state, gradients and activations were left out - training often needs three to five times the weight footprint - and continuous training additionally needs a data pipeline, regression evaluation and someone on call",
            "Disk throughput was not counted against memory",
            "Sampling temperature was forgotten as a memory cost"
          ],
          why_en: "The parameter count only prices the weights. Full-parameter training also carries gradients, an fp32 master copy, two momentum buffers and activations, which together run to a multiple of the weight footprint even under mixed precision; and beyond memory, 'able to train once' depends on a re-runnable data pipeline, a ruler and a person - none of which are GPU problems."
        },
        {
          q: "判断题：第一次参与一个开源项目，最稳妥的起点是提交一个重写核心子系统的 PR，因为这样最能体现能力。",
          type: "judge",
          a: 1,
          why: "恰好相反。一个 PR 的成本是阅读加理解意图加评审加长期维护，重写核心子系统四项全部拉满，几乎必然被挂起并耗尽你的热情。阶梯从「用起来并提出有信息量的问题」「带最小复现的 issue」「修文档与示例」开始，这些改动便宜、评审快，还能练读陌生代码。",
          q_en: "True or false: the safest first move in an open-source project is a pull request rewriting its core subsystem, since that best demonstrates ability.",
          why_en: "The opposite. A pull request costs reading plus reconstructing intent plus review plus long-term maintenance, and a core rewrite maxes out all four, so it is almost always parked while it drains your enthusiasm. The ladder starts at 'use it and ask an informative question', 'an issue with a minimal reproduction' and 'documentation and examples' - cheap changes, quick review, and they train reading unfamiliar code."
        },
        {
          q: "做最小复现时，闭环的三步是：先固定随机源，接着先对齐＿＿＿＿，最后才比较绝对分数；因为形状对不上指向实现或环境差异，形状对而分数不对多半指向口径差异。",
          type: "fill",
          ans: ["曲线形状", "曲线", "形状", "趋势", "曲线趋势", "相对趋势"],
          why: "顺序不能反：分桶均值、相对降幅、拐点位置与方法之间的相对差距这类形状信息对实现与环境敏感、对评测口径相对钝感，能把问题干净切成两类。先追绝对分数会让人不自觉地去调超参凑数，形成一场假复现。",
          q_en: "In a minimal reproduction the three steps are: pin the random sources, then first match the _____, and only then compare absolute scores - because a shape mismatch points at implementation or environment, while a matching shape with wrong values usually points at the protocol.",
          why_en: "The order cannot flip: shape information - bucketed means, relative drop, knee position, the gap between methods - is sensitive to implementation and environment but fairly blunt to evaluation protocol, which splits failures cleanly into two classes. Chasing the absolute number first tempts you into tuning until it matches, which is a fake reproduction."
        }
      ]
    }
  ],

  /* ---------- 名词：6 条（已对 base-terms.txt 与本目录所有 agi-deepen-*.js 的 term 键查重） ---------- */
  terms: [
    { term: "开源许可证", term_en: "Open-Source Licence", cat: "基础概念",
      short: "规定一份代码或权重能被你怎么用的法律义务集合，而不是一个技术标签。",
      short_en: "The set of legal duties deciding how you may use a piece of code or a set of weights, not a technical badge.",
      detail: ["四问可直接核对：可否商用、可否再分发（含打包进产品）、衍生作品是否必须以同一条款开源、是否附带专利授权；读文本即可回答，不必先跑一次推理。", "条款差别来自触发点：宽松型只要保留声明，copyleft 在分发时强制开源，AGPL 一类把通过网络提供服务也算作分发——同一份代码自用与对外服务的义务完全不同。"],
      detail_en: ["Four checkable questions: commercial use, redistribution (including bundling into your product), whether derivatives must ship under the same terms, and whether a patent grant is included - all answered from the text, with no inference run.", "The difference lies in what triggers the duty: permissive terms only preserve notices, copyleft forces source release on distribution, and AGPL-style terms count serving over a network as distribution, so self-hosting and offering a service carry different duties for identical code."],
      vs: "开源许可证约束代码与产物的使用方式，模型许可证额外约束使用场景；两者都要读，后者常带商用附加条款。",
      vs_en: "A software licence governs the code and its derivatives; a model licence additionally governs usage scenarios and often attaches commercial conditions. Read both." },
    { term: "权重开放", term_en: "Open Weights", cat: "基础概念",
      short: "只表示参数文件可下载，不表示训练数据、训练代码或评测口径可得。",
      short_en: "Means only that the parameter files are downloadable - not that the data, the training code or the evaluation protocol come with them.",
      detail: ["开放度分四层：权重、训练数据或其清单、训练代码与超参、评测口径与原始结果；多数发布只放开第一层，所以你能用它、能在它上面再走一小步，但无法重做它。", "权重可下载与可商用是两件事：名称含「开放」的模型许可证常附营收上限、不得用于竞争产品、强制署名等条款，模型名本身还可能是注册商标。"],
      detail_en: ["Openness has four layers: weights, training data or a manifest of it, training code with hyper-parameters, and the evaluation protocol with raw results. Most releases open only the first, so you can use the model and take a small step on it but cannot rebuild it.", "Downloadable weights are not automatically commercial-friendly: open-weight licences commonly attach revenue caps, no-compete clauses and attribution duties, and the model name may itself be a registered trademark."],
      vs: "权重开放讲给不给你最终产物，可复现性讲给不给你重造出同结果的中间层。",
      vs_en: "Open weights are about being handed the final artefact; reproducibility is about being handed the intermediate layers needed to rebuild it." },
    { term: "算力资本门槛", term_en: "Compute and Capital Barrier", cat: "基础概念",
      short: "参与一轮训练的真实成本：硬件之外还有数据、人力与预算连续性。",
      short_en: "The true cost of joining a training run: hardware plus data acquisition plus people plus an unbroken budget.",
      detail: ["四项里只有硬件随代际降价，数据获取从「有没有」变成「干不干净、有没有权利用」，人力与运维随你维护的复杂度上升——所以门槛在降与门槛在升可以同时成立。", "判据要拆成两问：能不能训一次（某一刻凑齐资源与知识），能不能持续训（管线可重跑、有回归评测、可故障恢复、有人值守、下季度预算已批）；只有第一项靠钱解决。"],
      detail_en: ["Only the hardware term falls with each generation: data acquisition shifted from 'does it exist' to 'is it clean and may we use it', and people plus operations grow with what you keep alive, so 'the barrier is dropping' and 'the barrier is rising' are simultaneously true.", "Split the test: can you train once (resources and knowledge at one moment) versus can you keep training (re-runnable pipeline, regression evaluation, checkpoint recovery, someone on call, next quarter approved). Only the first is solvable with money."],
      vs: "算力资本门槛是资源问题，可以租或借道；判断与工程能力是知识问题，只能自己攒。",
      vs_en: "The compute-and-capital barrier is a resource question and can be rented or routed around; judgement and engineering skill are knowledge questions and can only be accumulated yourself." },
    { term: "岗位图谱", term_en: "Role Map", cat: "基础概念",
      short: "按岗位每天在改什么东西来分格，而不是按招聘标题来分。",
      short_en: "Squaring jobs by what they change each day rather than by the title in the listing.",
      detail: ["六类按产出物区分：数据改样本、训练改配方并拍板、推理优化改执行、评测改尺子、安全对齐改约束、产品交付改成本与失败路径；名称会漂移，产出物不会。", "可迁移性看共用基础设施：评测与数据共用口径与统计、推理优化与交付共用性能与容量账、训练与评测都在回答同一句「这版是不是更好」；最难迁移的是有没有可核对的数字。"],
      detail_en: ["Six families split by output: data changes samples, training changes the recipe and decides, inference optimisation changes execution, evaluation changes the ruler, alignment changes the constraints, delivery changes unit cost and the failure path. Titles drift; outputs do not.", "Transferability follows shared infrastructure: evaluation and data use the same protocol and statistics habit, inference optimisation and delivery share the profiling and capacity ledger, training and evaluation both answer 'is this version better'. What never transfers is whether you own checkable numbers."],
      vs: "岗位图谱回答谁在改什么，技能栈回答你改得动哪一层；两者交叉之处才是可投的岗位。",
      vs_en: "The role map says who changes what; a skill stack says which layer you can actually move. Only their intersection is a job you can apply for." },
    { term: "最小复现闭环", term_en: "Minimal Reproduction Loop", cat: "应用与智能体",
      short: "固定随机源、先对齐曲线形状、最后才比绝对分数的三步法。",
      short_en: "A three-step method: pin the random sources, match the curve shape, and only then compare absolute scores.",
      detail: ["顺序有信息量：形状对不上指向实现或环境差异，形状对而数值不对多半指向口径差异（步数单位、数据划分、预处理、分词器）。", "失败归因分三类且处置不同——实现差对代码，环境差固定并声明版本，口径差重算原论文的数字；混着查的典型结局是通宵之后仍不知道是哪条轴变了。"],
      detail_en: ["The order carries information: a shape mismatch points at implementation or environment, while a matching shape with wrong values points at the protocol - unit of a step, split, preprocessing, tokenizer.", "Failures have three homes with different treatments: implementation gaps get diffed against the code, environment gaps get pinned and declared, protocol gaps get the original numbers recomputed. Debug them together and you finish the night still unable to say which axis moved."],
      vs: "最小复现闭环用来判断别人声称了什么，最小可复现示例用来让别人判断你遇到了什么。",
      vs_en: "A minimal reproduction loop tests somebody else's claim; a minimal reproducible example lets somebody else test your bug report." },
    { term: "上游贡献阶梯", term_en: "Upstream Contribution Ladder", cat: "应用与智能体",
      short: "从提问到提特性的六级台阶，按别人为你付出的成本排序。",
      short_en: "Six rungs from asking a question to proposing a feature, ordered by the cost you impose on others.",
      detail: ["台阶是：用起来并提出有信息量的问题、带最小复现的 issue、修文档与示例、补测试、小 bugfix、跨文件改动、新特性；越往上评审周期越长、被挂起的代价越大。", "能否被合并取决于改动便不便宜：一次只做一件事、沿用现有风格、说明为什么、带测试、不夹带格式化、自己先写限制——而不是取决于改动有多聪明。"],
      detail_en: ["The rungs: use it and ask an informative question, file an issue with a minimal reproduction, fix docs and examples, add tests, land a small bugfix, cross files once, then a feature. Each rung up lengthens review and makes being parked more expensive.", "Whether you get merged depends on how cheap the change is to review - one concern, existing style, the why spelled out, a test attached, no smuggled reformatting, limitations stated first - not on how clever the change looks."],
      vs: "上游贡献阶梯练的是读陌生代码与接受评审，公开写作练的是把判断讲清楚，两者互为反馈。",
      vs_en: "The ladder trains reading unfamiliar code and taking review; writing in public trains stating a judgement clearly. Each feeds the other." }
  ],

  achievements: [
    { id: "entry_point_architect", icon: "🗺", name: "切入点建筑师", name_en: "Entry Point Architect",
      desc: "完成 agi7 · 生态、产业与研发切入点 全部课节",
      desc_en: "Finish every lesson of agi7, Ecosystem, Industry and Your Entry Point",
      check: ["agi7"] }
  ],

  /* ---------- 代码注释英文映射：覆盖上面 7 段 code 里全部含中文的注释行 ---------- */
  codeComments: {
    "许可证四问：这张表要在任何实验开始之前填完": "The four licence questions: fill this table in before any experiment starts",
    "条款摘要全部手填在本地，不构成法律意见，只用来逼自己逐条核对": "All clause summaries typed in by hand, locally; not legal advice - just a way to force yourself to check line by line",
    "权重开放是分层的，这一层与上面四问完全无关，必须单独检查": "Open weights come in layers, unrelated to the four questions above; check them separately",
    "商用被禁是一票否决，与你的架构无关": "A commercial-use ban is a veto, independent of your architecture",
    "copyleft 的触发点是分发，只在自己机房里跑时义务还没发生": "Copyleft triggers on distribution; while it only runs inside your own data centre, no duty has fired yet",
    "网络条款把对外提供服务也算作分发，这一条最容易踩空": "Network clauses count serving externally as distribution too - the easiest one to miss",
    "义务已经触发而你不愿开源，这才是 copyleft 真正的死结": "The duty has fired and you refuse to open source - this is the real copyleft deadlock",
    "同一份条款换一个部署方式就换结论：差别全在触发点上": "The same clause flips its verdict when the deployment mode changes: the whole difference sits in the trigger",
    "逐层看开放度：缺哪一层，决定的是你能用它还是能重做它": "Read openness layer by layer: whichever is missing decides whether you can use it or rebuild it",
    "最后一格自查：条款会改版，选型表要写下你读的是哪一版、哪天读的": "Last self-check: clauses get revised, so note which version you read and on what date",
    "显存账：参数只是第一项，训练时真正的大头常在优化器状态": "Memory ledger: parameters are only the first line; the heavy part of training is usually optimiser state",
    "混合精度下权重与梯度合计约 4 字节每参数": "Under mixed precision, weights plus gradients cost about 4 bytes per parameter",
    "主权重与两阶动量合计约 12 字节每参数：漏掉它就低估一个量级": "Master weights plus two momentum buffers cost about 12 bytes per parameter; omit it and you underestimate by an order",
    "激活值随批量、序列长度与层数增长，这里给一个保守的量级占位": "Activations grow with batch, sequence length and depth; this is a deliberately conservative placeholder magnitude",
    "推理侧另有一本账：KV 缓存按并发与序列长度增长，与参数量不成正比": "Inference keeps a separate ledger: the KV cache grows with concurrency and sequence length, not with parameters",
    "单位推理成本的下降只写成形状：每两年一个数量级，看斜率不看截距": "The inference-cost decay is written as a shape only: one order of magnitude every two years - read the slope, not the intercept",
    "能训与能持续训的差别是一张清单，不是一个更大的数字": "The gap between training once and training on is a checklist, not a bigger number",
    "岗位图谱：按每天在改什么东西来分，不按招聘标题来分": "Role map: group by what each job changes daily, not by the title in the listing",
    "你手里已有的证据：一律按本站课程能拿出的数字来写，不写课程名": "Evidence you already hold: describe it by the numbers the courses yield, never by course names",
    "匹配分只是入口，缺口那一列才是面试真正会问你的地方": "The match score is only the door; the gap column is what an interview actually asks about",
    "迁移代价看共用基础设施：这两对换的是题目，不是方法": "Switching cost follows shared infrastructure: these two pairs change the subject, not the method",
    "最后一问留给自己：一年后这个岗位能留下哪三个可核对的数字": "One last question for yourself: which three checkable numbers will this job leave you in a year",
    "端侧最小推理内核：一个矩阵乘与一次 softmax，交付物是可核对的数字": "A minimal on-device inference kernel: one matmul and one softmax, delivering checkable numbers",
    "朴素矩阵乘：先写下它的形状，性能报告要拿它当基线": "Naive matmul: note its shape first, since the performance report uses it as the baseline",
    "内层沿行扫描：连续内存访问是这一支要能讲清的一件事": "Inner loop scans along the row: contiguous memory access is a thing this branch must be able to explain",
    "数值稳定要减最大值，否则指数项一上冲就变成 inf": "Subtract the maximum for numerical stability, otherwise an exponent spike turns it into inf",
    "交付物是这一行：毫秒、吞吐、优化前后对照，别只写能跑": "This line is the deliverable: milliseconds, throughput, before-and-after - never just 'it runs'",
    "同一张表要给上层复用：Python 侧解释它，C++ 侧改善它": "The same table feeds the layer above: Python explains it, C++ improves it",
    "复现最小闭环：先固定随机源，再比曲线形状，最后才对齐绝对分数": "Minimal reproduction loop: pin the random sources, match the curve shape, then chase the absolute score",
    "种子、版本、线程数与数据划分写进同一条记录，这就是复现日志的第一行": "Seed, versions, thread count and data split go into one record - the first line of a reproduction log",
    "真实规律只有一条：损失按指数下降，底部留一个不可约下界": "There is exactly one true law here: loss decays exponentially above an irreducible floor",
    "相对降幅与拐点位置才是先要对齐的东西，单点数值不算证据": "Relative drop and knee position come first; a single value is not evidence",
    "刷分数是假复现：把学习率一路凑到目标值，闭环当场断掉": "Score-chasing is a fake reproduction: tune the learning rate until it matches and the loop snaps on the spot",
    "一个 PR 的真实成本：阅读 + 理解意图 + 评审 + 之后长期维护": "The real cost of a pull request: reading + reconstructing intent + review + all later maintenance",
    "分数低不是别投，而是先把范围缩到一格：多数被拒的 PR 都太大": "A low score does not mean do not submit; it means shrink to one square - most rejected requests are simply too big",
    "issue 四段式：这是最小可复现示例在真实仓库里的用法": "The four-block issue format: the minimal reproducible example applied to a real repository",
    "公开之前做一次机械扫描：密钥样式、个人绝对路径、内部代号、真实姓名": "Run one mechanical scan before publishing: key patterns, personal absolute paths, internal codenames, real names",
    "阶梯按别人为你付的成本排序，不是按荣誉感排序": "The ladder is ordered by the cost others pay for you, not by how it feels to contribute",
    "全站位置图：把每一章放进能力层，空格子就是你的真实状态": "Site-wide position map: file each chapter into a capability layer; the empty squares are your real state",
    "下一步必须是一个交付而不是一门课：交付要能在离线机器上被别人验证": "The next step is a deliverable, not a course: others must be able to verify it on an offline machine",
    "三问的第三问最容易空：判据写不出来就是在跟风向走": "The third of the three questions is the one left blank: no criterion means you are following the wind",
    "两条路线在同一张表上合并：一层解释数字，一层改善数字": "The two routes merge on one table: one layer explains the numbers, the other improves them",
    "把计划写成本地文本：不依赖任何服务，打印出来贴墙上就够了": "Write the plan to a local text file: no service involved, print it and put it on the wall"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_AGI7);
