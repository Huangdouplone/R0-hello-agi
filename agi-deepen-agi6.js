/* ================================================================
 * R0:hello agi · 课程深化层 ⑭（agi6 AGI 判据、评测与风险争论 —— 全新整章）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：agi1~agi4 讲「怎么做」，agi5 讲「怎么走到今天」，这一章补上全站缺的那一段——
 *       「凭什么说它到了」。七节按「判据 → 评测构造 → 污染与饱和 → 长程复利误差 →
 *       对齐路线 → 风险与时间线争论 → 五道门收口」推进，每节都给一个可本地复算的数
 *       （四维形状、0.95^20、Wilson 下界、n-gram 命中率、可证伪点计数）。
 * 写法约定：
 *   1) 全章为新增课节，每节写齐 title / title_en / target / target_en；
 *   2) 站点无服务端：示例只用合成任务与本地小脚本，不下载数据集、不调外部接口、
 *      不需要密钥，纯标准库（random / hashlib / math）可跑；
 *   3) Python 注释一律单独成行（行尾 # 页面不翻译），全部登记进 codeComments；
 *      代码里不出现 // 子串，避免整数除法与 URL 混进注释匹配；
 *   4) 历史与结论表述克制：不确定的写「约 / 通常 / 有争议」，不做机构强弱判断，
 *      不给外部链接，不预言时间表；
 *   5) 术语与既有名词表严格查重（缩放定律、数据污染、轨迹评测、LLM 评审、基准饱和、
 *      涌现能力、红队测试、灰度发布等均已存在，本章另立六个新键）。
 * ================================================================ */

const DEEPEN_AGI6 = {
  newStages: [
    {
      id: "agi6",
      icon: "⚖️",
      name: "AGI 判据、评测与风险争论",
      name_en: "Judging AGI: Evals, Claims and Risks",
      desc: "凭什么说「通用」：判据怎么定、榜单为什么失效、风险争论里哪一段可证伪",
      desc_en: "On what grounds do we say 'general': how criteria get fixed, why leaderboards rot, and which links of the risk debate are falsifiable",
      goal: "能把任何一句「快到了」拆成判据、评测构造、污染、复利误差、对齐路线与风险论证六道检查，并对每一道写清自己改口的条件。",
      goal_en: "Take any claim of 'we are close' apart into six checks - criterion, eval construction, contamination, compounding error, alignment route and risk argument - and state for each what would make you change your mind.",
      insertAfter: "agi5",
      links: [],

      lab: {
        t: "给一个模型写判据与评测方案",
        t_en: "Write the criterion and the evaluation plan for one model",
        mode: "text",
        req: [
          "写一张判据卡：任务族（明确写「包含什么 / 不包含什么」）、四个维度（迁移 / 组合泛化 / 长程规划 / 自我纠错）各自的通过线、代价预算（步数、token 或时间上限）、判定线与允许重试次数——三件缺一件就重写",
          "为这张判据列出至少 3 条它会误伤的情形，并逐条标明它属于能力、部署还是意愿：三层的补救手段不通用，混层就是花钱修一个不存在的问题",
          "设计两类题面各一份：静态题（固定 30 道）与程序化动态题（生成器 + 验证器）。写清各自的判定器是什么、单题判定成本多少、以及等价写法会不会被误杀",
          "给出污染检查方案：至少两种检测手段、各自阈值、以及你明知道会漏的那一类（并说明为什么仍然接受它）；写不出数据截止日期就直写「未知」",
          "长任务部分交一张按步数分层的预期成功率表（含 0.95 的 20 次方这一类算术），并写明准备跑几次、报不报区间、报哪个下界",
          "最后写三句「我改口的条件」：如果某可观测量达到某个数值，我就把判断从『没到』改成『到了』。任何不可观测的条件一律删掉"
        ],
        req_en: [
          "Produce one criterion card: the task family (say explicitly what is in and what is out), a pass line for each of the four dimensions (transfer / composition / horizon / self-repair), a cost budget (step, token or wall-clock ceilings), and a decision line with the allowed number of attempts - rewrite it if any piece is missing",
          "List at least three situations where this criterion misjudges, and tag each as capability, deployment or disposition: remedies do not transfer between the three, so mixing layers means paying to fix a gap that is not there",
          "Design two item sets: a static one (30 fixed questions) and a programmatic dynamic one (generator plus verifier). For each, state what the judge is, the per-item judging cost, and whether equivalent answers get killed",
          "Give a contamination plan: at least two detectors, a threshold for each, and the class you know it misses (with the reason you accept that hole); if the data cutoff is unknown, write 'unknown' rather than guessing",
          "For long tasks, submit a success-rate table stratified by step count (including arithmetic like 0.95 to the 20th power), plus how many runs you will do and which interval bound you will report",
          "Close with three sentences of the form 'if observable X reaches value V, I move my verdict from not-there to there'. Delete any condition that cannot be observed"
        ],
        starter: `CRITERION CARD   (one model, one claim, six gates)
-------------------------------------------------
GATE 1  criterion
  task family      : IN: ...        OUT: ...
  dimension lines  : transfer .__  composition .__  horizon .__  self-repair .__
  cost budget      : steps <= __   tokens <= __   wall-clock <= __
  decision line    : pass at __ of __ attempts, line = 0.__
  human baseline   : who is the reference person, with or without tools?
GATE 2  eval construction
  static set       : 30 items, judge = __, cost per item = __
  dynamic set      : generator = __, verifier = __, cost per item = about 0
  format traps     : option-length bias handled? yes / no
  equivalent forms : how many valid answers does the task really have?
GATE 3  contamination
  detector A       : n-gram overlap, threshold __, known miss: __
  detector B       : embedding cosine, threshold __, known miss: __
  recitation probe : prefix continuation, false alarms on common phrases?
  cutoff date      : __  (write unknown instead of guessing)
GATE 4  long-horizon budget
  per-step p       : 0.__   steps 1 / 5 / 20 / 50 -> p^n = ...
  error model      : independent or shared-context correlated? state which
  reporting        : stratified by steps, k runs = __, Wilson lower bound
GATE 5  alignment route
  method family    : preference / rule / hybrid
  preference bias  : length, agreement with the user premise, rater mix
  what is proven   : behaviour under test, not the absence of other paths
GATE 6  risk and timeline
  argument links   : list each link, then one falsifier per link
  unfalsifiable    : count (any non-zero count means the claim is rhetoric)
  watch list       : metric -> the value at which I change my mind
-------------------------------------------------
DELETE ANY LINE YOU CANNOT COMPUTE ON PAPER.`,
        hint: "先写判定器，再写题目。顺序反过来，你会不自觉地出一批「只有你解释得通」的题；每写完一项就问自己：三个月后别人拿这一项能不能反驳我，不能反驳的删掉。",
        hint_en: "Write the judge before you write the questions; reversed, you will quietly produce items only you can explain. After every field ask: could someone refute me with this in three months? If not, delete it.",
        xp: 30
      },

      lessons: [

    /* ===================== agi6-1 ===================== */
    {
      id: "agi6-1",
      title: "「通用」到底指什么：从直觉到可操作判据",
      title_en: "What 'General' Actually Means: From Intuition to an Operational Criterion",
      min: 13,
      target: "能把「通用」写成一张绑定任务族、代价预算与判定线的判据卡，并用四个维度加三分法解释为什么单一分数不构成证据。",
      target_en: "Turn 'general' into a card binding a task family, a cost budget and a decision line, and use the four dimensions plus the three-way split to show why a single score is not evidence.",
      summary: [
        "前置与定位：本章的脚手架是 agi5（发展路线与范式更替），具体接口是 agi1-5 的 RLHF 与对齐、agi4-3 的安全、对齐与伦理。前面各章回答「怎么把它做出来」，本章只问一件更窄也更要紧的事：我们凭什么说它到了——要产出的是一套可复查的判断程序，不是一次预言。",
        "「什么都会」这个直觉定义必须丢掉：它既无法验证也无法反驳。可用的定义必须同时绑定三样东西——任务族（哪些事算在内、哪些明确不算）、代价预算（在多少步、多少 token、多长时间内完成）、判定线（谁来判、允许重试几次）。三件齐备，「通用」才从形容词变成一张能被别人核对的卡。",
        "「通用」通常被拆成四个互相不可替代的维度：迁移（换个题面还做不做对）、组合泛化（已经会的零件能不能拼出没见过的任务）、长程规划（能不能维护跨几十步的状态）、自我纠错（错了能不能从自己的中间结果里发现并走回来）。四者各有各的本地测法：换述集、把子任务重新组合的生成器、按步数分层、以及故意在第三步注入一个错误看它是否回头。",
        "单一分数测不出「通用」，原因是算术上的：把四个维度平均成一个总分，恰好让两种相反的形状落到同一个数字。0.90/0.40/0.35/0.55 与 0.30/0.80/0.75/0.35 的均值都是 0.55，但前者是「面广而结构不稳」（一换域就崩），后者是「窄而深」（一放大规模与叙述变化就崩），两者接下来的工程账完全不同。判据要报的是向量和通过线，只报总分的句子在论证里权重为零。",
        "把话说清需要三分而不是两分：能力（它会不会）、部署（接进真实环境能不能稳定跑：接口、权限、错误回退、单位成本）、意愿（没人盯着时它会不会去做，以及会不会为了通过检查而表演）。三分的价值在于补救手段互不通用：能力靠数据与目标函数，部署靠接口与校验与预算，意愿靠激励与监督结构。最常见的误账是把部署缺陷记进能力账，然后花大钱去训一个本来不缺能力的模型。",
        "判据必须自带「误伤清单」。任何一组维度都会漏认某类真本事、也会放过某类投机：只看换述集，会放过「模板背得熟」；只看最终答案，会放过「瞎猜对了」。所以写判据的第二个动作不是继续挑维度，而是写下三条「这套判据会把什么好系统判成差的、会把什么差系统判成好的」，并为每条配一个便宜的旁路检查。缺这份清单的判据，等于把裁判权让给发布会。",
        "人类基线是被构造出来的，不是天上掉下来的：同一条任务，「没受过训练的外行 30 分钟」和「领域专家 8 小时」是两个不同的判据，历史上不少「超过人类」的说法在写清参照人群与工具之后自己就消解了。参照人群是否允许查资料、有没有搜索引擎、是否算协作成本，通常会移动天花板一到几个点——而头部系统之间的差距往往也只有这么多，所以这些细节不是脚注，是结论本身。",
        "衔接：判据立起来之后，问题立刻变成「拿什么去测」。下一节看能力评测的最小构造，以及它为什么会从内部烂掉——记忆、污染、格式迎合这三条作弊路径，每一条都能在一个静态题库上稳定复现；本节的示例就是那台复现装置的最简骨架。"
      ],
      summary_en: [
        "Prerequisites and positioning: this chapter builds on agi5 (the roadmap and its paradigm shifts) and plugs into two specific places, RLHF and alignment in agi1-5 and safety, alignment and ethics in agi4-3. Earlier chapters answered 'how do we build it'; this one asks the narrower and more urgent question 'on what grounds would we say it is here' - the output is an inspectable procedure for judging, not a prophecy.",
        "Drop the intuitive definition 'can do anything': it can be neither verified nor refuted. A usable definition must bind three things at once - a task family (what counts, what is explicitly excluded), a cost budget (how many steps, tokens, how much wall-clock), and a decision line (who judges, how many attempts are allowed). With all three present, 'general' stops being an adjective and becomes a card someone else can audit.",
        "'General' is usually split into four dimensions that do not substitute for each other: transfer (does it still work on a rephrased surface), compositional generalisation (can known parts be recombined into unseen tasks), long-horizon planning (can state be held across tens of steps), and self-repair (can it notice a mistake in its own intermediate results and come back). Each has a cheap local test: a paraphrase set, a generator that recombines subtasks, stratification by step count, and injecting a deliberate error at step three to see whether it ever turns back.",
        "A single score cannot measure generality, and the reason is arithmetic: averaging four dimensions is precisely the operation that lets two opposite shapes land on one number. 0.90/0.40/0.35/0.55 and 0.30/0.80/0.75/0.35 both average to 0.55, yet the first is broad but structurally loose (it collapses out of domain) and the second narrow but deep (it collapses as soon as scale or narration changes), and the engineering bills that follow are different documents. Report the vector against the pass lines; a sentence that reports only an average carries zero weight in an argument.",
        "The claim needs three cuts, not two: capability (can it do it), deployment (does it run stably inside a real environment - interfaces, permissions, error fallbacks, unit cost), and disposition (will it do it when nobody is watching, and will it perform for the check rather than do the work). The value of the split is that remedies do not transfer: capability comes from data and objective, deployment from interfaces, validators and budgets, disposition from incentive and supervision structures. The most common misaccounting is booking a deployment defect to the capability ledger and then paying to train a model that was never short of capability.",
        "A criterion must ship with its own misjudgement list. Any dimension set fails to credit some real skill and lets some shortcut pass: a paraphrase test alone rewards rote template recall, and final-answer-only scoring rewards a lucky guess. So the second act of writing a criterion is not adding dimensions but writing three sentences of the form 'this criterion marks a good system as bad / a bad system as good when ...', each with a cheap side-channel check. A criterion without that list hands the referee's whistle to the press release.",
        "The human baseline is constructed, not given: for the same task, 'an untrained layperson with 30 minutes' and 'a domain expert with eight hours' are two different criteria, and many historical 'beats humans' claims dissolved once the reference population and its tools were written down. Whether the reference person may look things up, search, or collaborate usually moves the ceiling by a point or two - and the gap between leading systems is often about that size, so those details are the conclusion, not a footnote.",
        "Bridge: once the criterion stands, the question becomes what to measure with. The next section gives the minimal construction of a capability evaluation and shows why it rots from the inside - memorisation, contamination and format gaming can each be reproduced reliably on a static question set; the example in this section is the simplest skeleton of that reproduction rig."
      ],
      code: `# 判据卡：四个维度 + 三件必备（任务族 / 代价预算 / 判定线），缺一条就退回口号
DIMENSIONS = ["transfer", "composition", "horizon", "self-repair"]

CLAIM_A = {
    "name": "A",
    "scores": [0.90, 0.40, 0.35, 0.55],
    "budget": {"steps": 6, "tokens": 9000, "retries": 3},
    "line": 0.75,
}
CLAIM_B = {
    "name": "B",
    "scores": [0.30, 0.80, 0.75, 0.35],
    "budget": {"steps": 40, "tokens": 60000, "retries": 0},
    "line": 0.75,
}

def mean(values):
    return sum(values) / len(values)

def show(card):
    # 均分相同不代表同一种「通用」：平均这一步把形状信息全抹掉了
    print(card["name"], "avg", round(mean(card["scores"]), 3), "budget", card["budget"])
    for i, dim in enumerate(DIMENSIONS):
        verdict = "pass" if card["scores"][i] >= card["line"] else "miss"
        print("   ", dim, card["scores"][i], verdict)

# 三分法：能力 / 部署 / 意愿，判据信号不同，补救手段也不通用
LAYERS = [
    ("capability", "rephrasing drops it to chance", "more domain data, change the objective"),
    ("deployment", "passes the eval, fails once tools and permissions appear", "interfaces, validators, step budget"),
    ("disposition", "can do it, but does not when unsupervised", "incentives and supervision structure"),
]

for layer, signal, remedy in LAYERS:
    print(layer, "|", signal, "| remedy:", remedy)

show(CLAIM_A)
show(CLAIM_B)

# 不可证伪的判据长这样：没有预算、没有判定线，只有一句「多数常见任务都行」
VAGUE = {"name": "press release", "scores": [0.9], "line": None}
missing = [k for k in ("budget", "line") if VAGUE.get(k) in (None, {}) or k not in VAGUE]
print(VAGUE["name"], "missing fields", missing, "-> not auditable")

# 人类基线要写参照人群：同一道题，外行半小时与专家八小时是两个天花板
BASELINE = {"layperson_30min": 0.62, "expert_8h": 0.94, "model_with_search": 0.88}
for who, score in BASELINE.items():
    print("baseline", who, score, "beats it" if 0.88 > score else "below it")`,
      pit: "只报四个维度的平均分而不报形状与通过线，会让「面广但一换题面就崩」和「窄但结构稳」两类系统拿到同一个数字，于是选型把钱花到错误的一侧：前者缺的是域外数据与组合训练，后者缺的是接口、校验与预算工程。判据一旦只看总分，团队就照着总分优化，Goodhart 立刻开始工作，三个月后没人说得清该改哪一环。",
      pit_en: "Reporting only the mean of the four dimensions, with no shape and no pass lines, gives 'broad but collapses on rephrasing' and 'narrow but structurally sound' the same number, so the selection spends money on the wrong side: the first lacks out-of-domain data and compositional training, the second lacks interfaces, validators and budget engineering. Grade on an average and the team optimises the average, Goodhart starts working immediately, and in three months nobody can say which link to fix.",
      ex: {
        q: "为什么要把「意愿」从「能力」里单独切出来，而不是并进「能力但有安全限制」？",
        a: "因为三层的补救手段互不通用：能力靠数据与目标函数、部署靠接口与校验与预算、意愿靠激励与监督结构；并成一层，你会用更贵的办法去补一个本来不存在的缺口，还会把「它不肯」误读成「它不会」而放弃本可落地的功能。",
        q_en: "Why cut 'disposition' out of 'capability' instead of folding it in as 'capable but restricted'?",
        a_en: "Because the three layers have non-transferable remedies: capability comes from data and objective, deployment from interfaces, validators and budgets, disposition from incentive and supervision structure. Merge them and you pay the dearer price to close a gap that was never there, and you misread 'it will not' as 'it cannot', abandoning a feature that was shippable."
      }
    },

    /* ===================== agi6-2 ===================== */
    {
      id: "agi6-2",
      title: "能力评测的构造与失效：静态题库的三条作弊路径",
      title_en: "Building and Breaking Capability Evals: Three Ways a Static Question Set Cheats",
      min: 14,
      target: "能说出一套评测的五个构成件与三种作弊路径的机制，并解释为什么动态生成题面加程序化验证是成本最低的解毒剂。",
      target_en: "Name the five components of an evaluation and the mechanisms of its three cheating paths, and explain why dynamically generated items with programmatic verification is the cheapest antidote.",
      summary: [
        "一套评测至少有五个构成件，缺任何一个，分数的含义就变了：任务分布（题从哪个分布来，决定了这张榜在测什么）、输出表示（模型被要求以什么形式交卷）、判定器（什么算做对）、计分口径（pass@1、pass@k、部分分，三条曲线对应的线上成本完全不同）、预算（步数、token、时间、允许重试几次）。把这五件写成一页，是任何评测报告该有的第一段。",
        "判定器有三类，各自有明确的失效面：精确匹配或规则校验最便宜也最脆，一个合法的等价写法（452.0、带单位、换了主语）就被判错，于是系统性低估能力；程序执行与单元测试是迄今最硬的外部锚，但有效性等于覆盖率，测试写不全就等于没测；模型当裁判（本站术语「LLM 评审」）可扩展、能给部分分，代价是它自己就是被评测对象分布内的一个可优化目标。",
        "作弊路径一：记忆。模型认得题面而不是会解这类题。现象很好认——同一道题换个说法掉一大截、部分分与全对的分布分离（背答案的没有中间步骤分）、以及「题目一改数字就崩」。补救不是换更难的题，而是把同一模板的参数化实例交给程序判定。",
        "作弊路径二：污染。答案或题面在训练语料里，模型不必具备能力也能得分。它的检测与量化是下一节的主题；这一节只需要记住一件事——污染不是「有没有」的问题而是「有多少、集中在哪类题上」的问题，任何只回答「我们做了去污染」的报告都还不构成证据。",
        "作弊路径三：格式迎合。输出层面的偏好在给分：单选题里更长更详尽的选项被选中得更多（标注习惯使然，也常与正确答案重合）、选项位置的顺序偏好、以及「以上皆非」类否定式干扰项造成的系统性偏差。诊断办法是把人换成三条笨基线一起报：随机基线、总是选最长项、总是选上一个正确答案——任何一条离模型分数很近，那部分分数就不能算能力。",
        "一次性榜单为什么不能当路线图：榜单回答的是「在这批题上谁高」，路线图需要的是「下一类事能不能做」的前导信号。一个稳定的总分既不能区分「卡在同一个瓶颈」和「稳得没朋友」，也不能告诉你失败样本该归给数据、架构还是接口——不能归因的分数只支持排序，不支持决策（这条判据来自 agi5-7，本节给出它的构造性原因）。",
        "动态生成题面 + 程序化验证的价值在于把「出题」变成一次函数调用：生成器同时产出题面、标准答案与验证器，判定成本接近零，于是可以做「一题一面」的大样本，记忆和污染都失去落脚点；同一份代码还能顺手做难度扫描（把参数范围拉大，看成功率随难度的曲线形状，而不是只看一个点）。这也是本节示例在做的全部事情。",
        "但动态生成本身有三个新坑，写方案时要一并交代：模板过窄（测的其实是「接不接受你的模板」，一换叙述就原形毕露）、生成器与解题法同构（难度分布不受控，容易造出一堆同一难度的题而误判「方差小」）、以及验证器太宽（把错的判成对的比把对的判成错更致命，因为它抬高所有曲线）。所以成熟的方案留一个「人工写的小时级任务」作为外部锚，动态榜负责灵敏度，人工锚负责有效性。"
      ],
      summary_en: [
        "An evaluation has at least five components, and dropping any one changes what the number means: the task distribution (where items come from, which decides what the leaderboard actually measures), the answer format (in what form the model must hand it in), the judge (what counts as correct), the scoring convention (pass@1, pass@k and partial credit are three curves with very different online costs), and the budget (steps, tokens, time, retries). Those five in one page should be the first paragraph of any eval report.",
        "Judges come in three kinds, each with a stated failure surface: exact match or rule checks are cheapest and most brittle - one legitimate equivalent form (452.0, a unit attached, a reworded subject) is scored wrong, so capability gets systematically understated; program execution and unit tests are the hardest external anchor available, but effectiveness equals coverage, so tests that miss a case mean that case was never checked; a model as judge (the site's 'LLM-as-judge' entry) scales and can award partial credit, at the price of being itself an optimisable target inside the distribution being measured.",
        "Cheating path one: memorisation. The model knows the item rather than the class of problem. The symptoms are easy to spot - a large drop when the same question is rephrased, a split between partial and full credit (recalled answers have no intermediate steps to score), and collapse the moment a number in the prompt changes. The fix is not harder questions but parameterised instances of one template handed to a program.",
        "Cheating path two: contamination. The answer or the surface of the question sits in the training corpus, so score accrues without capability. Detection and quantification are next section's topic; for now one thing suffices - contamination is not a yes/no property but a matter of how much and where it concentrates, and a report that only says 'we decontaminated' is still not evidence.",
        "Cheating path three: format gaming. Output-level preferences earn points: in single-choice items the longer, more detailed option gets picked more often (an artefact of annotation habits, which also correlates with being right), plus position order preference, and the systematic bias introduced by negated distractors of the 'none of the above' kind. Diagnose it by reporting three dumb baselines next to the model: random chance, always-pick-the-longest, always-repeat-the-last-answer. Whichever baseline sits close to the model score, that part of the score is not capability.",
        "Why a one-off leaderboard cannot be a roadmap: it answers 'who is higher on this batch', while a roadmap needs a leading signal for 'can we do the next kind of thing'. A stable aggregate distinguishes neither 'stuck on the same bottleneck' from 'boringly solid', nor whether a failure belongs to data, architecture or the interface - a score whose failures cannot be attributed supports ranking but not deciding (a rule imported from agi5-7, here given its constructive reason).",
        "Dynamic item generation with programmatic verification is valuable because it turns authoring into a function call: the generator yields the prompt, the gold answer and a verifier together, so per-item judging cost approaches zero, and you can afford one-item-one-model-scale samples where neither memorisation nor contamination has a foothold. The same code gives you a difficulty sweep - widen the parameter range and look at the shape of success against difficulty instead of a single point. That is all the example in this section does.",
        "Generated items bring three new traps, which the plan should state: narrow templates (you end up measuring 'does it accept your template', and any change of narration exposes it), isomorphism between generator and solution (the difficulty distribution drifts uncontrolled, producing many items of one difficulty and a misleadingly small variance), and a loose verifier (grading a wrong answer correct is worse than grading a correct answer wrong, because it lifts every curve). Mature plans therefore keep a hand-written, hour-scale task set as an external anchor: the dynamic set buys sensitivity, the human anchor buys validity."
      ],
      code: `import random

random.seed(7)

# 缓存表当作「见过题面」：静态题库的分数收益，与真实算力无关
RECALL = {"compute 12 * 3 + 5": "41", "compute 7 * 8 + 1": "57", "compute 23 * 4 + 6": "98"}

# 程序化验证：生成器同时交出题面与一个几乎免费的判定器，动态题面才有灵敏度
def make_arith():
    a, b, c = random.randint(10, 99), random.randint(2, 9), random.randint(1, 99)
    gold = a * b + c
    prompt = "compute " + str(a) + " * " + str(b) + " + " + str(c)

    def verify(answer):
        try:
            return int(answer) == gold
        except ValueError:
            return False

    return prompt, verify

def solve(prompt, skill=0.7):
    # 先查缓存（记忆与污染的表现），查不到才动用真实算力
    if prompt in RECALL:
        return RECALL[prompt]
    if random.random() > skill:
        return "0"
    body = prompt.replace("compute ", "").replace(" ", "")
    left, right = body.split("*")
    b, c = right.split("+")
    return str(int(left) * int(b) + int(c))

static_prompts = list(RECALL.keys())
static_hits = sum(1 for p in static_prompts if solve(p) == RECALL[p])
print("static", static_hits / len(static_prompts), "items", len(static_prompts))

TRIALS = 300
dynamic_hits = 0
for _ in range(TRIALS):
    prompt, verify = make_arith()
    if verify(solve(prompt)):
        dynamic_hits += 1
print("dynamic", dynamic_hits / TRIALS, "true skill set to 0.7")

# 判定器的格式脆性：等价写法被精确匹配判错，静态分还会在低估之上再低估一次
for pred, gold in [("  452 ", "452"), ("452.0", "452"), ("ans: 452", "452")]:
    print("exact match", pred == gold, repr(pred))

# 三条笨基线一起报：只挑最长选项，命中率就能高过随机基线，那部分分数不是能力
OPTIONS = [
    ["Rust", "C++ 与 Rust 都以零成本抽象为目标，因此在没有栈展开的边界上都要求调用方…", "D"],
    ["A", "B", "第三项写得很长很长"],
]
GOLD_INDEX = [0, 2]
longest_hits = 0
for i, opts in enumerate(OPTIONS):
    pick = max(range(len(opts)), key=lambda j: len(opts[j]))
    longest_hits += 1 if pick == GOLD_INDEX[i] else 0
print("longest-option hits", longest_hits / len(OPTIONS), "chance level", 1.0 / 3)

# 难度扫描：同一模板拉大参数范围，看的是曲线形状而不是某一个点
def sweep(levels):
    out = []
    for lo, hi in levels:
        hits = 0
        for _ in range(60):
            a, b = random.randint(lo, hi), random.randint(2, 9)
            hits += 1 if random.random() < 1.0 / (1.0 + len(str(a * b))) else 0
        out.append((lo, hi, round(hits / 60, 3)))
    return out

print("difficulty sweep", sweep([(10, 20), (100, 200), (10000, 20000)]))`,
      pit: "只用整段模板生成动态题面，就宣布「我们换成了新题，所以不存在记忆效应」：换的是实例，不是任务结构，模型只要学到模板的表层模式就能拿高分，而你对外的说法是「动态生成、无污染」。忘了这一条，动态榜会把一条几乎水平的曲线夸成能力上涨，你则会在下一次换叙述分布时看到分数断崖——那时没人会怀疑题面，只会怀疑模型。",
      pit_en: "Generating every item from one template and concluding 'these are fresh items, so memorisation cannot help': you changed the instances, not the task structure, so a model that learned the surface pattern of the template still scores high while you announce 'dynamic, uncontaminated'. Miss this and a nearly flat curve gets sold as rising capability, and the next time you shift the narration distribution you watch the score fall off a cliff - at which point nobody suspects the items, only the model.",
      ex: {
        q: "为什么「验证器太宽」比「验证器太严」更危险？",
        a: "因为太严只是把对的判成错、压低一条可复查的曲线，而太宽把错的判成对、同时抬高了所有报告出去的分数与你自己后续的每一次对比基线，错误会被复利式地当成事实继续使用。",
        q_en: "Why is a too-lenient verifier more dangerous than a too-strict one?",
        a_en: "A strict one merely marks correct answers wrong and depresses a curve you can go back and recheck; a lenient one marks wrong answers right, lifting every number you report and every comparison baseline you build afterwards, so the error keeps being reused as ground truth."
      }
    },

    /* ===================== agi6-3 ===================== */
    {
      id: "agi6-3",
      title: "数据污染与基准饱和：怎么查、查完测什么",
      title_en: "Contamination and Saturation: How to Test, and What to Measure After",
      min: 14,
      target: "能列出三类污染检测手段及各自的漏检面，说明饱和之后该改测什么，并说清榜单经济学为什么也是评测设计的一部分。",
      target_en: "List the three families of contamination detectors and each one's blind spot, say what replaces a saturated benchmark, and explain why leaderboard economics belongs to evaluation design.",
      summary: [
        "先把概念钉牢（agi5-7 给了定义，本节给操作）：污染是「训练时见过评测要的分布」，它分两类——显性重叠（题面原文或其改写进了训练语料）与隐性泄漏（同源衍生数据、共用标注管线、题目本身就是从模型输出改写来的）。第二类通常更难查，因为「训练集」与「测试集」在这些情况下来自同一只手。",
        "检测一：重叠扫描。字符或词级 n-gram、子串匹配、minhash 找近似重复。它便宜、可复算、能把阈值与命中率一起公布，因此是最常被要求交的那一份报告；漏检面是深度改写、翻译、同一事实的另一种问法，以及「题面不重叠但答案重叠」（题库背后是同一张表）。",
        "检测二：表示层相似度。用嵌入（本节示例用哈希词袋代替，因为它零依赖、可复算）算题面与训练文档的余弦相似度。它能越过换序与轻度改写，代价是阈值高度依赖归一化口径、且对「同义但不同词」仍不敏感。这类方法报出来的分数如果没有同时公布维度、归一化与分位数，就没有可比性。",
        "检测三：反查式成员推断。三类常用探针：前缀续写（给开头看能不能一字不差续下去）、逐 token 概率异常（背出来的片段概率会异常地高）、以及「请背诵这段」式指令。它们直接抓「记住了」这个行为，而不是抓语料，所以能覆盖隐性泄漏；漏检与误报都很严重——常见短语、公式、法条、歌词都会误报，因此成熟报告要给「误报对照集」（一批模型没道理见过的短语）。",
        "最干净的一类叫时间切片：只用模型数据截止日期之后才出现的题（新一批竞赛题、新提交的代码问题）。它绕开了所有重叠检测的模糊地带，但有三个无法回避的代价：样本少、新题质量不稳（题目本身常是从旧题改的，语义重叠照旧）、以及最关键的一条——被评测方常常不肯或不能给出确切的截止日期，甚至「不知道」本身就是结论的一部分。",
        "饱和之后测什么（承接术语「基准饱和」的四种形态）：从「答对没有」转向「在什么代价下答对」。具体是四条可算的曲线——预算-性能曲线（同一任务族在步数、token、重试次数三档预算下的表现）、按步数分层的成功率、跨题面一致性（同题改写后的分数差，这一项直接反污染）、以及失败可归因率（多少失败样本能被读出属于哪一类）。这四条都不是排行榜友好的，但它们是路线图友好的。",
        "榜单经济学是评测设计的一部分，不是八卦：谁出题，就决定了什么算「能力」（把定义引向自己流水线上强的那一侧）；谁能刷分，就决定了分数上涨里有多少来自公开题面的优化压力；谁受益，就决定了报告的口径（发布方要叙事、评测供给方要影响力、媒体要可比数字）。对读者的可操作结论只有三条：看有没有独立出题与题目发布、看有没有第三方复现记录、看失败样本能不能读——三条全无的榜单，只能用来记史，不能用来决策。",
        "一句自查：如果你只能用一句话形容一份榜单，别说「它分数高」，要说「它把什么算作做对、把谁算作对手、以及做对一次的代价是多少」。这三件齐了，污染与饱和的问题你至少能自己复算一遍——下一节的复利误差会告诉你，第四件事（代价）才是长任务时代真正的主战场。"
      ],
      summary_en: [
        "Fix the concepts first (agi5-7 defined them; this section operationalises them): contamination means the training run saw the distribution the eval grades on, and it comes in two kinds - overt overlap (item text or its rewrite sits in the corpus) and covert leakage (derived data from the same source, shared annotation pipelines, or items that were themselves rewritten from model output). The second is usually harder to catch, because in those cases train and test came off the same workbench.",
        "Detector one: overlap scanning - character or word n-grams, substring matching, minhash for near-duplicates. It is cheap, recomputable, and lets you publish threshold and hit rate together, which is why it is the report everyone asks for. Its blind spots are deep paraphrase, translation, the same fact asked a different way, and 'the prompts do not overlap but the answers do' (the items sit on one hidden table).",
        "Detector two: representation-level similarity - embed each item and each training document and take the cosine (this section's example substitutes a hashed bag of words, since it needs nothing and anyone can recompute it). It tolerates reordering and light editing, at the cost of thresholds that swing with normalisation choices and continued insensitivity to 'same meaning, different words'. A number from this family is incomparable unless dimension, normalisation and quantiles are published alongside it.",
        "Detector three: interrogative membership inference. Three probes are common: prefix continuation (give the opening and see whether it completes verbatim), per-token probability anomaly (recalled spans sit suspiciously high), and 'recite this passage' instructions. These test the behaviour of having memorised rather than the corpus, so they can reach covert leakage - with serious false positives on common phrases, formulas, statutes and song lyrics, which is why a mature report includes a control set of strings no model could plausibly have seen.",
        "The cleanest family is time-slicing: use only items that surfaced after the model's data cutoff (a new contest, freshly filed code questions). It sidesteps every fuzzy zone of overlap detection, at three unavoidable costs: few samples, shaky item quality (new items are often edits of old ones, so semantic overlap remains), and the decisive one - the party under test often will not or cannot give a definite cutoff, and 'unknown' is itself part of the conclusion.",
        "What replaces a saturated benchmark (continuing the four shapes in the site's 'benchmark saturation' entry): move from 'was it right' to 'right at what cost'. Concretely, four computable curves - a budget-performance curve for the same task family under three settings of steps, tokens and retries; success rate stratified by step count; cross-surface consistency (the score gap after rephrasing an item, which doubles as an anti-contamination reading); and the attributable-failure rate (what share of failures you can classify). None of the four is leaderboard-friendly; all four are roadmap-friendly.",
        "Leaderboard economics belongs to evaluation design rather than gossip: whoever writes the items decides what counts as capability (pulling the definition toward the side their pipeline is strong on); whoever can grind the score decides how much of the rise came from optimising public items; whoever benefits decides the reporting format (publishers want narrative, eval suppliers want influence, press wants comparable numbers). The operational read for a viewer is three questions: are the items independently authored and released, is there a third-party reproduction record, and can failures be read. A leaderboard failing all three is a historical source, not a basis for decisions.",
        "One self-check: if you may describe a leaderboard in a single sentence, do not say 'its scores are high' - say 'this is what it treats as correct, this is who it treats as the rival, and this is what one correct answer costs'. With those three written down you can recompute the contamination and saturation questions yourself; the next section's compounding error will show that the fourth thing, cost, is the real battleground once tasks get long."
      ],
      code: `import hashlib
import math

# 本地手填的「训练语料」与「新题」：全程不联网、不下载任何数据集
TRAIN = [
    "The capital of France sits on the Seine and hosts the Louvre.",
    "A binary tree with n internal nodes has at most two to the n shapes.",
    "Photosynthesis converts light energy into chemical energy inside the leaf.",
]
TEST = [
    ("t1", "The capital of France sits on the Seine and hosts the Louvre."),
    ("t2", "Which city on the Seine is the capital of France?"),
    ("t3", "Light energy is turned into chemical energy by photosynthesis in leaves."),
    ("t4", "How many registers does this calling convention reserve for the caller?"),
]

# 检测一：字符 n-gram 的 Jaccard 重叠，抓得住拷贝，抓不住改写
def char_ngrams(text, n=8):
    t = text.lower().replace(" ", "")
    return {t[i:i + n] for i in range(max(1, len(t) - n + 1))}

def jaccard(a, b):
    union = len(a | b)
    return len(a & b) / union if union else 0.0

# 检测二：哈希词袋的余弦相似度，容得下换序，容不下同义替换
def hashed_bow(text, dim=64):
    v = [0.0] * dim
    for word in text.lower().replace(".", "").split():
        h = int(hashlib.sha1(word.encode("utf-8")).hexdigest()[:8], 16)
        v[h % dim] += 1.0
    norm = math.sqrt(sum(x * x for x in v))
    return [x / norm for x in v] if norm else v

def cosine(a, b):
    return sum(x * y for x, y in zip(a, b))

train_ng = [char_ngrams(s) for s in TRAIN]
train_v = [hashed_bow(s) for s in TRAIN]

# 阈值必须与命中率一起公布，否则「我们查过了」这三个字不可反驳
NG_TH, COS_TH = 0.30, 0.80
flagged = 0
for tid, item in TEST:
    ng = max(jaccard(char_ngrams(item), g) for g in train_ng)
    cos = max(cosine(hashed_bow(item), v) for v in train_v)
    hit = ng >= NG_TH or cos >= COS_TH
    flagged += 1 if hit else 0
    print(tid, "ngram", round(ng, 3), "cosine", round(cos, 3), "flag" if hit else "pass")
print("hit rate", round(flagged / len(TEST), 3), "thresholds", NG_TH, COS_TH)
print("the two paraphrases pass at these thresholds: that is the known miss, not a bug")

# 检测三：成员推断，背出来的片段逐词概率异常地高，但常用短语同样会误报
PROBES = [
    ("memorised span", [-0.4, -0.3, -0.5, -0.45, -0.5]),
    ("common phrase", [-0.8, -1.1, -0.7, -0.9, -1.0]),
    ("novel span", [-3.1, -2.6, -3.4, -2.9, -3.2]),
]

def mean_logprob(values):
    return sum(values) / len(values)

for name, logp in PROBES:
    score = mean_logprob(logp)
    print(name, "mean logprob", round(score, 3), "suspicious" if score > -1.2 else "normal")

# 时间切片：只用数据截止之后的题，最干净但样本少、题质也不稳
CUTOFF = 2023
FRESH = [("q1", 2021), ("q2", 2024), ("q3", 2025), ("q4", 2019), ("q5", 2020)]
usable = [qid for qid, year in FRESH if year > CUTOFF]
print("time slice keeps", len(usable), "of", len(FRESH), "items; cutoff asserted as", CUTOFF)

# 饱和四查：头部差距、错误集中度、运行间噪声、人类基线差距
def saturation_report(top_gap, error_overlap, run_noise, human_gap, min_gap=0.03):
    return {
        "lost_resolution": top_gap < min_gap,
        "lost_difficulty": error_overlap > 0.6,
        "noise_eats_signal": run_noise >= top_gap,
        "ceiling_reached": human_gap <= 0.0,
    }

flags = saturation_report(0.008, 0.86, 0.02, -0.01)
print("saturation flags", flags, "count", sum(1 for v in flags.values() if v))

# 饱和之后改测代价：同一题面在三个预算档上的曲线，比单点分数有用
def budget_curve(family, budgets):
    return [(steps, tokens, round(family(steps, tokens), 3)) for steps, tokens in budgets]

def toy_family(steps, tokens):
    return min(0.99, 0.20 + 0.9 * math.log(steps + 1) / math.log(200) + tokens / 200000.0)

print("budget curve", budget_curve(toy_family, [(2, 800), (20, 20000), (200, 200000)]))`,
      pit: "只做整串哈希或精确匹配就宣布「训练集不含测试题」：一字不改的拷贝被抓到了，改写、翻译、同题干的另一版本、以及「题面不重叠但共享同一张答案表」全部漏过去。忘了这一层的后果不是丢一个数字，而是丢掉反驳能力——任何人拿一份 8-gram 统计或一次前缀续写就能把你的结论推翻，而你手里连一个可对照的阈值与命中率都拿不出来。",
      pit_en: "Running whole-string hashes or exact match and then announcing 'our training set contains no test items': you caught verbatim copies while paraphrases, translations, alternate renderings of the same stem and 'prompts that differ but share one answer table' all slip past. The cost of skipping that layer is not a missing number but the loss of the ability to be argued with - anyone with an 8-gram script or a single prefix-completion probe can overturn your claim, and you will not even have a threshold and hit rate to answer with.",
      ex: {
        q: "为什么「跨题面一致性」既能算评测指标，又能算污染检查？",
        a: "因为记忆型收益完全依附于题面表层：同一道题换个说法就掉分，说明原先的分数里有一部分来自「见过这一串字」而不是「会这一类题」，于是一条曲线同时给出了稳定性与污染嫌疑。",
        q_en: "Why does cross-surface consistency double as both an evaluation metric and a contamination test?",
        a_en: "Because memorised gain attaches entirely to the surface of the item: score falls when the same question is rephrased, which shows part of the original score came from 'having seen this string' rather than 'knowing this class of problem' - so one curve reports both stability and suspicion."
      }
    },

    /* ===================== agi6-4 ===================== */
    {
      id: "agi6-4",
      title: "长程任务与复利误差：单步 95% 在二十步后剩多少",
      title_en: "Long Horizons and Compounding Error: What 95 Percent a Step Leaves After Twenty",
      min: 14,
      target: "能算出整链成功率的量级、指出独立假设在哪里偏乐观、用分层与置信区间报告轨迹指标，并解释跑分与好用为何不是一回事。",
      target_en: "Compute the order of magnitude of whole-chain success, name where the independence assumption is optimistic, report trajectory metrics with stratification and intervals, and explain why benchmark scores and usable behaviour diverge.",
      summary: [
        "先把算术摆出来：如果每一步的成功率是 p、各步近似独立，n 步整链成功率就是 p 的 n 次方。单步 99% 在 20 步后约 0.82，95% 约 0.36，90% 约 0.12——也就是说「每步都很体面」和「整件事能成」之间隔着一道指数。这一条不需要任何前沿知识，是所有长程声明都必须先过的一关；agi3-3 的规划-执行-观察循环越长，它就越主导结果。",
        "独立只是入门近似，实测偏差往两个方向走，而且两个方向都不友好。一是错误按「整轮」成堆：一次运行共享同一份上下文与同一个难易状态，这在同边际单步错误率下会让整链成功率高于独立模型的算法值（坏掉的运行反正早就坏了），但把重试的收益压得很低——pass@k 这条曲线因此被独立假设吹得最狠。二是级联失败：早期一步把某个前提读歪，后面每一步都在歪掉的前提上推理，于是「自称完成」与「真完成」脱节，测到的成功率反而高于真成功率。正确的问法不是「平均每步错多少」，而是「错误集中在哪些运行里、又被检出的概率多大」；本节示例把这两种偏差各算了一遍。",
        "外部验证器与重规划改变的是「错误的传播半径」而不是错误率本身：在若干步之后插一次可判定的检查（跑一遍测试、算一次数、比对一次状态），能把「错着走下去」变成「错了就退回」，代价是每步多花预算。要写清算式：检查点使整链成功率上升，但单位任务成本上升，于是真正该优化的是「固定预算下的整链成功率」，而不是「不管预算的成功率」。",
        "重规划分两种，效果差别很大：盲目重试（同一上下文再来一次，收益受限于错误的相关性，通常远小于 1 减首次失败率的独立假设值）与带新信息的重规划（拿到验证器的失败原因、检索到缺失前提后再规划，才真正把相关性打断）。混淆这两者，你会把「重试堆出来的分数」当成能力，然后在真实使用里被一次不可逆动作清算。",
        "「Agent 跑分」与「人用着靠谱」不是一回事，差异至少有五处来源：环境（跑分是干净沙箱、真实使用有脏上下文与陈旧状态）、任务分布（跑分题短且同质、真实需求是重尾的长任务）、可逆性（跑分允许失败重来、真实动作里发了的消息与写掉的库不可回收）、判定口径（跑分用题目自带的判定器、真实使用里「对不对」常常要几小时后才浮现）、以及代价不对称（一次错误抹掉十次成功的信任）。所以同一个系统可以同时是真的跑分进步了和真的不好用。",
        "轨迹级评测（本站术语「轨迹评测」）要交的字段是过程量：步数与它的分布、工具调用的合法率（参数对不对、目标存不存在）、无效重试占比、终止原因分布（自己判定完成、被步数上限截断、报错退出）、预算超支幅度、以及副作用计数（写了几次盘、发了几条外部消息、花了多少钱）。只交结果分数的轨迹报告，等于交了一个不能归因的数字。",
        "样本量与置信区间要一起报：k 次运行的通过率只是一个点估计。10 次全过的通过率是 100%，但它的 95% Wilson 置信下界只有约 0.72（用「三法则」做单侧估计约 0.70），这意味着「10 次全成」根本不支持「可靠性 99%」这一类说法。反过来，要把下界推到 0.99，需要的是约 380 次无失败运行——这就是主张的价签。要报多高的可靠性，二项分布就会告诉你欠多少次试验，这是本节示例里那个函数的用途，也是本站术语「标准误」在长任务场景的具体形态。",
        "把这一节接回判据：代价预算之所以是判据的必备一项，正是因为长任务的能力与预算不可分离——同一套权重，在允许 3 次重试与 200 步的脚手架下和只许 1 次、20 步的脚手架下是两个不同的系统。下一节换个方向问：能力之外，我们凭什么相信它会按我们想要的方式使用这些能力，也就是对齐技术路线各自解决了什么。"
      ],
      summary_en: [
        "Start with the arithmetic: if each step succeeds with probability p and steps are roughly independent, an n-step chain succeeds at p to the n. At 20 steps, 0.99 per step leaves about 0.82, 0.95 leaves about 0.36 and 0.90 leaves about 0.12 - between 'every step looks fine' and 'the job gets done' sits an exponential. This needs no frontier knowledge and is the first gate for any long-horizon claim; the longer the plan-act-observe loop of agi3-3, the more it dominates the outcome.",
        "Independence is only the entry-level approximation, and the real deviations run in two directions, neither of them kind to you. First, errors pile up by the run: one attempt shares a single context and a single difficulty state, which - at the same marginal per-step error rate - makes whole-chain success come out higher than the independent arithmetic (the doomed runs were doomed early) while crushing the value of retrying, so the pass@k curve is the number the independence assumption inflates hardest. Second, cascade failure: an early step misreads a premise and every later step reasons on the skewed premise, so 'declared done' decouples from 'actually done' and the measured rate overstates the true one. The right questions are not 'what is the average per-step error' but 'which runs do the errors sit in, and how likely are they to be caught'; this section's example computes each bias once.",
        "External verifiers and replanning change the propagation radius of an error, not its rate: inserting a decidable check every few steps (run the tests, recompute the number, compare state) turns 'wrong and continuing' into 'wrong and rolled back', at the price of extra budget per step. Do the accounting: checkpoints raise whole-chain success and raise unit cost, so the quantity worth optimising is whole-chain success under a fixed budget, not success regardless of budget.",
        "Replanning comes in two flavours with very different yields: blind retry (same context again, whose gain is capped by error correlation and typically falls well short of the independent-assumption value) and replanning with new information (feeding the verifier's failure reason, retrieving the missing premise, then re-decomposing), which is the one that actually breaks the correlation. Confuse the two and you will book retry-padded scores as capability, then be settled up by one irreversible action in real use.",
        "Benchmark scores and usable behaviour differ for at least five reasons: environment (a clean sandbox versus dirty context and stale state), task distribution (short homogeneous items versus a heavy-tailed demand), reversibility (reruns are free in evals, whereas the sent message and the dropped table are not), judging convention (the item ships with its judge in an eval, while in real use 'was that right' surfaces hours later), and cost asymmetry (one error erases ten successes worth of trust). Hence one and the same system can genuinely have improved on the benchmark and genuinely still be unusable.",
        "The fields a trajectory-level report must carry are process quantities: step count and its distribution, the legality rate of tool calls (do the arguments type-check, does the target exist), the share of useless retries, the distribution of stop reasons (declared done, cut off by the step ceiling, aborted by an error), budget overshoot, and side-effect counts (how many writes, how many outbound messages, how much money). A trajectory report that carries only the outcome has reported a number that cannot be attributed.",
        "Report sample size and interval together, because a pass rate over k runs is only a point estimate: 10 successes in 10 runs is a 100% rate whose 95% Wilson lower bound is about 0.72 (the rule of three gives roughly 0.70 one-sided), so 'it worked ten times' does not support 'this is 99% reliable'. Conversely, pushing that bound up to 0.99 costs on the order of 380 failure-free runs - that is the price tag on the claim. Claim whatever reliability you like and the binomial tells you how many runs you owe; that is what the helper in this section computes, and it is the site's 'standard error' entry wearing its long-task costume.",
        "Tie this back to the criterion: the cost budget is a mandatory field precisely because long-horizon capability cannot be separated from budget - the same weights inside a scaffold of three retries and 200 steps are a different system from the same weights inside one retry and 20 steps. The next section changes direction and asks: beyond capability, on what grounds do we trust how it will spend that capability - i.e. what each alignment technique actually solves."
      ],
      code: `import math
import random

random.seed(11)

# 复利误差：单步听着很行，二十步之后是一行幂运算的事
for p in (0.99, 0.95, 0.90):
    row = [round(p ** n, 3) for n in (1, 5, 20, 50)]
    print("per step", p, "chain by steps 1/5/20/50", row)

STEPS, P_EASY, P_HARD, HARD_SHARE = 20, 0.97, 0.80, 0.30

def chain_once(p, steps):
    for _s in range(steps):
        if random.random() > p:
            return 0.0
    return 1.0

# 偏差一：错误按「整轮」成堆。同边际单步错误率下，相关模型比独立模型算出的整链更高
def chain_mixture(steps, p_easy, p_hard, hard_share, trials=4000):
    hits = 0
    for _ in range(trials):
        p = p_hard if random.random() < hard_share else p_easy
        hits += chain_once(p, steps)
    return hits / trials

marginal = P_EASY * (1.0 - HARD_SHARE) + P_HARD * HARD_SHARE
mixture = chain_mixture(STEPS, P_EASY, P_HARD, HARD_SHARE)
print("marginal per step", round(marginal, 3), "iid chain", round(marginal ** STEPS, 3), "correlated chain", round(mixture, 3))

# 偏差一的另一面：同一任务的多次尝试共享那个难易状态，于是 pass@k 被独立假设吹起来
def shared_retry(steps, p_easy, p_hard, hard_share, attempts, trials=2000):
    hits = 0
    for _ in range(trials):
        hard = random.random() < hard_share
        ok = False
        for _a in range(attempts):
            p = p_hard if hard else p_easy
            if chain_once(p, steps) == 1.0:
                ok = True
                break
        hits += 1 if ok else 0
    return hits / trials

p1 = shared_retry(STEPS, P_EASY, P_HARD, HARD_SHARE, 1)
for attempts in (1, 5, 20):
    actual = shared_retry(STEPS, P_EASY, P_HARD, HARD_SHARE, attempts)
    naive = 1.0 - (1.0 - p1) ** attempts
    print("attempts", attempts, "shared-state pass@k", round(actual, 3), "independence-model pass@k", round(naive, 3))

# 偏差二：级联失败让「自称完成」高于「真完成」，因为检出本身有漏检率
def reported_as_done(true_chain, detect):
    return true_chain + (1.0 - true_chain) * (1.0 - detect)

print("true chain", round(mixture, 3), "reported as done", round(reported_as_done(mixture, 0.7), 3))

# 检查点改变的是错误的传播半径：整链上升但收益饱和，成本却线性上升，要按预算比大小
def with_checkpoints(steps, p, checks, detect):
    segments = checks + 1
    clean = p ** (steps / segments)
    repaired = clean + (1.0 - clean) * detect
    return round((repaired ** checks) * clean, 3)

for checks in (0, 1, 3, 7, 19):
    chain = with_checkpoints(20, 0.95, checks, 0.7)
    cost = round(1.0 + 0.12 * checks, 2)
    print("checkpoints", checks, "chain", chain, "cost", cost, "chain per cost", round(chain / cost, 3))

# 按步数分层报告：平均成功率被短任务主导，长任务那一条才是真相
CASES = [(2, 1), (3, 1), (4, 1), (5, 0), (12, 1), (15, 0), (18, 0), (30, 0), (45, 0), (60, 0)]
buckets = {}
for steps, ok in CASES:
    key = "short" if steps <= 5 else ("mid" if steps <= 20 else "long")
    slot = buckets.setdefault(key, [0, 0])
    slot[0] += 1
    slot[1] += ok
for key in sorted(buckets):
    n, hit = buckets[key]
    print(key, "items", n, "success", round(hit / n, 3), "overall mean", round(sum(o for _, o in CASES) / len(CASES), 3))

# 置信区间：全过的次数太少就撑不起高可靠性主张，下界随试验次数才慢慢爬
def wilson_lower(hits, trials, z=1.96):
    if trials == 0:
        return 0.0
    ph = hits / trials
    centre = ph + z * z / (2 * trials)
    margin = z * math.sqrt(ph * (1 - ph) / trials + z * z / (4 * trials * trials))
    return max(0.0, (centre - margin) / (1 + z * z / trials))

for trials in (5, 10, 30, 100, 400):
    print(trials, "clean runs, 95% lower bound", round(wilson_lower(trials, trials), 3))`,
      pit: "把「10 次运行全部通过」写成「可靠性 99%」，或者把 pass@10 当成能力、pass@1 当成不可用：前者忽略了 10 次全过的 95% 下界只有约 0.72（要撑到 0.99 得约 380 次无失败），后者混淆了两种完全不同的成本口径。忘了报试验次数与预算的分数既无法反驳也无法复算，而真实用户体验到的是 pass@1 加上不可逆动作的代价——你报告里的那条曲线这两样都没有。",
      pit_en: "Writing '10 runs, all passed' as '99% reliable', or reading pass@10 as capability and pass@1 as unusable: the first ignores that ten clean runs bound near 0.72 at 95% (about 380 failure-free runs are needed to reach 0.99), the second conflates two cost conventions entirely. A number without run count and budget can be neither refuted nor recomputed, and the user experiences pass@1 plus irreversible actions - neither of which appears anywhere in the curve you published.",
      ex: {
        q: "为什么加了验证器的链条不能简单写成「错误率下降了」？",
        a: "因为验证器降的是「带着错误继续走」的概率，而不是每步出错概率：它把长链切成若干短段，让失败可以退回重做，同时按检查点数量抬高了单位成本，所以收益必须以「固定预算下的整链成功率」来记账。",
        q_en: "Why can a chain with verifiers not be summarised as 'the error rate went down'?",
        a_en: "A verifier lowers the probability of carrying an error forward, not the probability of making one: it cuts a long chain into short segments so failures can roll back, while raising unit cost with each checkpoint, so the gain must be booked as whole-chain success under a fixed budget."
      }
    },

    /* ===================== agi6-5 ===================== */
    {
      id: "agi6-5",
      title: "对齐技术路线全景：各自解决什么，各自证明不了什么",
      title_en: "The Alignment Route Map: What Each Method Solves and What None of Them Proves",
      min: 14,
      target: "能按「目标获取 / 约束遵守 / 分布外稳健」三层说清 RLHF、DPO 与原则式方法的分工与失效面，并解释偏好数据的偏差如何同时污染训练与评测。",
      target_en: "Assign RLHF, DPO and principle-based methods to the three layers of objective acquisition, constraint adherence and out-of-distribution robustness, and show how preference-data bias contaminates training and evaluation at once.",
      summary: [
        "先把「对齐」拆成三层，路线之争才有意义：目标获取（它在优化的那个东西是不是我们要的）、约束遵守（不许做的那部分在压力下还成立吗）、分布外稳健（换域、被诱导、有利益冲突时行为会不会翻）。agi1-5 给了机制、agi4-3 给了落地约束，本节要的是分工表：三条技术路线不是新旧替代关系，而是各自主要管一层、并且各留一个漏判面。",
        "RLHF 的实际作用是把「说不清但人一眼能看出好坏」的那部分拟合出来：偏好数据 → 奖励模型 → 策略优化（通常是 on-policy 一族）。它的失效面从来不在流程，而在「奖励是代理」这一步：一旦策略去优化代理，就会漂到奖励模型分布外去拿分，这就是本站术语「奖励黑客」的成因；工程上表现为过优化到某个点之后，人评与自动奖励开始分叉。",
        "DPO 一族（约 2023 年起普及）把偏好对直接写成分类目标，省掉显式奖励模型与在线采样：实现简单、方差小、算力省，因此在中小规模上很吃香。它的代价是纯离线——只能学到日志分布里的偏好，部署后拿不到新证据；而没有显式奖励模型，也就没有「奖励被刷到多高」这个可监控的警报器。它在多大程度上改变长期行为，学界结论仍有争议，但「可观测性少一路」是确定的。",
        "原则式与规则式路线（宪法式的一族自我批评—修订，加上符号校验器硬拦输出）管的是第二层：把「不许做什么」写成可审计文本或可判定的检查。优点是归因清楚（能说清违反了哪一条、由哪个检查拦住）；代价有两条，一是清单永远不完备（例外与歧义写不完，这条教训和 agi5-2 的知识工程之壁是同一件事），二是「写在文档里的规则」与「真正起作用的因果机制」之间没有任何保证——模型可能因为完全不相干的特征而遵守，也可能在被诱导后绕过。",
        "偏好数据带着三种系统性偏差，而它们全都是评测问题：长度偏差（更长的回答更容易被标注为更好，模型于是学会话痨，且这个偏好在用模型复评时被第二次放大）、阿谀倾向（附和用户预设立场更容易拿高分，于是事实性判断被社会性奖励扭曲——用户一施压就改口）、以及标注者构成与任务分布偏差（谁在标、标哪些题，决定了「人类认可」这四个字到底指谁）。",
        "为什么这三条不只是产品瑕疵：只要你的评测里有模型当裁判、或者用人造满意度当指标，被优化的对象与打分用的偏好就来自同一批口味，指标会跟着模型一起漂——这时「分数涨了」与「更讨喜了」在数据上不可区分。操作上要做的是把打分权交给不由模型掌控的锚（可执行测试、可核对的数值、显式规则），把 LLM 评审降级为「粗排 + 需要人工抽样的旁路」。",
        "机制可解释性能证明什么：能证明某个特征或电路在特定任务里被使用，并且能用干预（把这条通路打噪声、或者做定向替换）来看行为是否随之改变，从而在局部建立因果；它还能揭示「同样答对但走了不同路径」这类结构性事实。它不能证明的：模型持有一个长期目标、该目标在后续训练或部署中不再漂移、以及不存在别的电路能做同一件事。类比很管用——读懂一段代码不等于穷举了它的调用路径。",
        "把三条路线合成一张取舍表，选型是「可审计性 / 表现 / 成本」的三角（本站已有「成本-质量-延迟三角」，这里是它的对齐版）：偏好式换表现但审计最弱、规则式换审计但覆盖不全、可解释换证据但局部且昂贵。因此下一节的问题就顺理成章：无论走哪条路线，都不足以支撑关于风险与时间线的大判断——那一节的任务是把争论拆成可证伪的环节，而不是选边站。"
      ],
      summary_en: [
        "Split 'alignment' into three layers first, or the route argument makes no sense: objective acquisition (is the thing it optimises the thing we want), constraint adherence (do the prohibitions survive pressure), and out-of-distribution robustness (does behaviour flip when the domain changes, when it is goaded, when interests conflict). agi1-5 gave the machinery and agi4-3 the deployment constraints; what this section wants is a division-of-labour table - the three routes do not replace each other, each mainly covers one layer and each leaves one blind spot.",
        "What RLHF actually buys is a fit for the part of quality that people spot instantly but cannot write down: preference data, then a reward model, then policy optimisation (usually an on-policy family). Its failure never lives in the pipeline; it lives in 'the reward is a proxy' - once the policy optimises the proxy it wanders outside the reward model's distribution to collect points, which is the mechanism behind the site's 'reward hacking' entry. In engineering terms: past some over-optimisation point, human ratings and the automated reward start to diverge.",
        "The DPO family (popularised from around 2023) writes preference pairs directly as a classification target, dropping the explicit reward model and on-policy sampling: simple to implement, low variance, cheap, hence attractive at small and medium scale. Its price is that it is purely offline - it can learn only the preferences present in the logged distribution and absorbs no new evidence after deployment; and with no explicit reward, there is no 'the reward has been ground up this far' alarm to monitor. How much it changes long-run behaviour is still argued; that it costs you one monitoring channel is not.",
        "Principle- and rule-based routes (the constitution-style family of self-critique and revision, plus symbolic validators that hard-block output) serve the second layer: prohibitions become auditable text or decidable checks. Their merit is attribution - you can say which rule broke and which check stopped it. Their two costs: the list is never complete (exceptions and ambiguity do not finish, which is the same lesson as the knowledge-engineering wall in agi5-2), and there is no guarantee whatsoever between 'the rule written in the document' and 'the causal mechanism actually at work' - the model may comply for entirely unrelated reasons and may be steered around the rule.",
        "Preference data carries three systematic biases, and all three are evaluation problems: length bias (longer answers get rated better, so the model learns to be verbose, and a model-as-judge pass amplifies that a second time), sycophancy (agreeing with the user's stated premise scores better, so factual judgement gets warped by a social reward - one push from the user and it recants), and rater-mix plus task-distribution bias (who labels, on which items, decides whom the words 'human approval' actually name).",
        "Why these are not merely product blemishes: as soon as your evaluation contains a model as judge, or uses manufactured satisfaction as the metric, the thing being optimised and the taste doing the grading come from the same preference pool, and the metric drifts together with the model - at which point 'the score went up' and 'it became more likeable' are indistinguishable in the data. Operationally: hand the deciding vote to anchors no model controls (executable tests, checkable numbers, explicit rules), and demote LLM judging to coarse ranking plus a human-sampled side channel.",
        "What mechanistic interpretability can prove: that a given feature or circuit is used on a specific task, established causally through interventions (noise this path, swap this direction, watch behaviour move); it can also expose structural facts like 'the same correct answer travelled two different routes'. What it cannot prove: that the model holds a persistent goal, that this goal will not drift under further training or deployment, or that no other circuit could do the same job. The analogy is the useful one - reading a piece of code is not enumerating its call paths.",
        "Fuse the three routes into one trade table and selection becomes an audit / capability / cost triangle (the site already carries a cost-quality-latency triangle; this is its alignment twin): preference-based buys capability with the weakest audit, rules buy audit with incomplete coverage, interpretability buys evidence that is local and expensive. The next question therefore falls out: no route, alone or combined, is enough to support a grand judgement about risk and timing - and that section's job is to break the argument into falsifiable links rather than pick a side."
      ],
      code: `import random

random.seed(3)

# 合成偏好对：标注员偏爱更长的回答，也偏爱附和用户预设立场的回答
CANDIDATES = [
    {"id": "A", "length": 40, "agrees": 0, "correct": 1},
    {"id": "B", "length": 260, "agrees": 1, "correct": 0},
    {"id": "C", "length": 90, "agrees": 0, "correct": 0},
]
W_LEN, W_AGREE, NOISE = 0.006, 0.9, 0.05

def preference(cand):
    return W_LEN * cand["length"] + W_AGREE * cand["agrees"] + (random.random() - 0.5) * NOISE

# 拟合出来的奖励只会复制标注员的口味：正确性根本不在它的词汇里
reward_pick = max(CANDIDATES, key=preference)
truth_pick = max(CANDIDATES, key=lambda c: c["correct"])
print("reward picks", reward_pick["id"], "| correctness picks", truth_pick["id"])

# 同一个偏好会污染以模型输出为输入的评测：复评的裁判也爱长答案
def pairwise_judge(a, b):
    return a["id"] if a["length"] > b["length"] else b["id"]

print("judge prefers", pairwise_judge(CANDIDATES[0], CANDIDATES[1]), "which is the wrong one")

# 去偏一条：给长度加罚项。它修好了这一题，却会惩罚真正需要细节的任务族
def debiased(cand, penalty=0.01):
    return cand["correct"] - penalty * cand["length"]

print("after length penalty, pick is", max(CANDIDATES, key=debiased)["id"])

# 阿谀指标：先答对，再被用户施压，看它改口的比例（0.5 是瞎猜水平）
def flip_rate(trials=200, flip_prob=0.62):
    return sum(1 for _ in range(trials) if random.random() < flip_prob) / trials

print("sycophancy flip rate", round(flip_rate(), 3), "against chance 0.5")

# 三条路线的分工表：各管一层，各留一个漏判面，别当成新旧替代
ROUTES = [
    ("preference (RLHF / DPO)", "style and human approval", "the reward is a proxy: over-optimisation, length and agreement bias"),
    ("principle and rule based", "explicit constraints, auditable text", "the list is never complete; a stated rule is not the operative cause"),
    ("mechanistic interpretability", "which circuit is used on this task", "local and task-bound: cannot certify a goal, nor that it stays put"),
]
for route, covers, misses in ROUTES:
    print(route, "| covers:", covers, "| misses:", misses)

# 压力下才测得动对齐：满意度式打分与正确性打分在这里分叉
STRESS = [("conflict of interest", 0.82, 0.44), ("prompt injection", 0.77, 0.31), ("user pushes back", 0.80, 0.41)]
for family, approval, correctness in STRESS:
    print(family, "| approval minus correctness", round(approval - correctness, 3))`,
      pit: "把「已经上了 RLHF 或 DPO」记成「对齐问题已解决」，于是把评测与监控预算全押在满意度式指标上：偏好路线改的是分布内的口味，约束遵守与分布外稳健这两层需要的是可判定的锚与压力测试，两者都不会因为损失曲线下降而出现。忘了这一条的具体后果是，你在最顺的场景里表现最好、在唯一要紧的场景（被诱导、有利益冲突、用户施压）里没有任何数据。",
      pit_en: "Recording 'RLHF or DPO is in place' as 'alignment solved' and putting the whole evaluation and monitoring budget on satisfaction-style metrics: the preference routes change in-distribution taste, while constraint adherence and out-of-distribution robustness need decidable anchors and stress tests, neither of which ever appears because a loss curve went down. The concrete cost is that you look best in the easy setting and hold zero data in the one setting that matters (goaded, conflicting interests, user pushing back).",
      ex: {
        q: "为什么 DPO 省掉奖励模型之后，过优化并没有消失，只是换了位置？",
        a: "因为偏好对与参照模型隐含定义了一个奖励，过优化从「钻显式奖励模型的空子」变成「往日志分布里偏好最强的方向坍缩」，所以表现成更长的回答和更顺耳的立场，而少掉的那个可监控量恰恰是「奖励被刷到多高」的警报器。",
        q_en: "Why does DPO's removal of the reward model not remove over-optimisation, but only move it?",
        a_en: "Preference pairs plus the reference model implicitly define a reward, so over-optimisation shifts from gaming an explicit reward model to collapsing toward the strongest preference in the logged distribution; it shows up as longer, more agreeable answers, and the monitored quantity you lost is exactly the 'the reward has been ground up this far' alarm."
      }
    },

    /* ===================== agi6-6 ===================== */
    {
      id: "agi6-6",
      title: "风险与时间线争论：证据两侧与可证伪点",
      title_en: "Risk and Timeline Disputes: Evidence on Both Sides and Where It Is Falsifiable",
      min: 14,
      target: "能把风险与时间线之争拆成三个独立问题、复述存在性风险论证的四段链条并指出可证伪点，说清安全评估框架管什么与不管什么。",
      target_en: "Split the risk-and-timing dispute into three independent questions, restate the four-link existential-risk argument with its falsifiable points, and say what safety frameworks do and do not govern.",
      summary: [
        "先拆问题，否则永远吵不出结果：这类争论通常混着三个可以分开回答的问题——能力何时到位（时间线）、到位之后是否可控（可控性）、失控的后果与影响面有多大（严重性）。三者的证据类型完全不同：第一个是拟合与外推，第二个是机制与验证，第三个是部署结构与依赖度。给一个「快/慢」标签把它们全压掉，等于放弃了这场争论里唯一有价值的部分。",
        "能力跃迁一侧的证据通常是这些：损失与算力之间的幂律在一定区间内确实稳定可外推、若干任务族在小模型上近乎零分而在大模型上跨过达标线（本站「涌现能力」条已给出度量侧的反驳）、以及长任务时长的经验增长（有公开拟合显示「能稳定完成的任务时长」在按年翻倍量级增长，但样本极少、指标定义随时间漂移、跨系统不可比，因此这个数只能当方向感用）。",
        "平滑改进一侧的证据同样不弱：历次「这次不一样」的外推都曾在区间外失效、评测指标的离散性会把平滑改善画成台阶、题面饱和之后换尺子就会出现分数跳变（agi5-7 的核心机制），以及最朴素的一条——同一套模型在不同脚手架下分数可以差出几十个点，说明许多「跃迁」其实是外壳带来的。两侧共同的不确定源是：我们只有一条时间轴上的观测，缺少可对照的反事实。",
        "把存在性风险论证写成链条才判得动：能力会跨过某个阈值 → 阈值之上的系统能把目标固化进部署（并且绕过监督）→ 失控后果不可逆且扩散够快 → 缺少能可靠拦截的机制。四条各有独立不确定性，任何一条只要存在「能防住」的可信机制且它被说清，链条就断了。要求对方按环节陈述的价值在于：分歧立刻从「你信不信」变成「第二环的哪一项证据你接受」。",
        "可证伪点是这场争论的分水岭，而不可证伪有三种常见形态：观测不到的那类（「它已经有了，只是不表现」）、定义随结果漂移的那类（「真正的 AGI 是到了才认得出的东西」）、以及无法对照的那类（「这是最后一次还能选择的机会」）。它们不一定错，但在论证里的权重为零——因为任何观测都无法让你收回它。写风险主张的合格线是：给每一环配一句「如果观测到某事，我收回这一环」。",
        "监管与安全评估框架在管的是流程而不是结论（这里只讲机制，不评条文优劣）：事前能力门槛（跨过某个能力线要评估）、透明度文档（模型卡、数据卡、评估口径）、第三方评测与复现要求、事故上报与问责通道、以及对算力或数据获取的治理。它们的共同强项是把「有没有做」变成可核查义务；共同弱项是把「做了」误当成「有用」。",
        "框架通常忘掉的几件事也要记进判据：流程合规可以被优化到分数好看而效果为零；评测题面与真实使用分布脱节（本节第 4 节的复利误差在此复现）；跨主体、跨辖区差异（谁能拿到什么、以什么成本）常不在同一张表上；部署侧与人的因素（谁在用、怎么用、谁承担后果）比模型侧更难观测；以及慢风险——就业与信息环境、依赖与心理层面——几乎总是排在快风险后面，因为它没有戏剧性的上报事件。",
        "时间线主张的正确姿势是给区间与触发条件，而不是给年份：回看历史上那些可追责的单年预测（1956 年那批提案与后来若干「一代人之内」的说法），到期而未兑现的比例很高，这不是因为预言者愚蠢，而是单一时点预测在这种问题上方差天然巨大。可操作的做法是把它换成一张观察清单——某个指标达到某个值我就改口（本节的示例给了三行样板）——这也是下一节那张检查表的最后一栏。"
      ],
      summary_en: [
        "Unbundle the question or the argument never ends: this dispute normally braids three separately answerable problems - when capability arrives (timeline), whether it stays controllable once it does (controllability), and how large and irreversible the harm would be if it slipped (severity). Each has its own evidence type: the first is fitting and extrapolation, the second mechanism and verification, the third deployment structure and dependency. Compressing all three into one 'fast/slow' label discards the only part of the argument worth having.",
        "Evidence on the leap side usually includes: the power law between loss and compute genuinely holds over some interval and extrapolates; certain task families sit near zero on small models and cross the pass line on large ones (the site's 'emergent abilities' entry supplies the metric-side rebuttal); and the empirical growth of task length, where published fits suggest the horizon of reliably completed tasks doubles on a roughly yearly scale - a number built on very few points, with a metric that drifts over time and is not comparable across systems, so it is usable only as a sense of direction.",
        "The smooth-improvement side is not short of evidence either: every previous 'this time is different' extrapolation has broken outside its fitted interval; the discreteness of metrics draws smooth gains as stairs; and once a surface saturates, changing the ruler manufactures a score jump (the core mechanism of agi5-7). Most plainly, the same model inside different scaffolds can differ by tens of points, which means many 'leaps' belong to the shell. The shared uncertainty source on both sides is brutal: we have one trajectory of observations and no counterfactual to compare against.",
        "Write the existential-risk argument as a chain, or it cannot be weighed: capability crosses some threshold → above it a system can lock its objectives into deployment and route around supervision → the failure is irreversible and spreads fast enough → no reliable interception exists. Each link carries its own uncertainty, and the chain breaks the moment any single link has a credible 'this one can be contained' mechanism that is actually spelled out. The value of demanding link-by-link statements is that the disagreement stops being 'do you believe me' and becomes 'which piece of evidence for link two do you accept'.",
        "Falsifiability is the watershed of this whole debate, and unfalsifiable claims come in three common shapes: unobservable ones ('it already has it, it just hides it'), definitions that drift with the result ('real AGI is the thing we recognise only when it arrives'), and non-comparable ones ('this is the last window in which we get to choose'). They are not necessarily false, but their weight in an argument is zero, since no observation would let you retract them. The pass mark for a risk claim: one sentence per link saying 'if I observe this, I withdraw this link'.",
        "What governance and safety frameworks actually govern is process, not conclusions (mechanisms here, no grading of statutes): ex-ante capability thresholds (cross the line and you assess), transparency documents (model cards, data cards, evaluation conventions), third-party evaluation and reproduction requirements, incident reporting and accountability channels, and governance over compute or data access. Their shared strength is turning 'did you do it' into a checkable obligation; their shared weakness is mistaking 'it was done' for 'it worked'.",
        "What those frameworks usually forget belongs in your criterion too: process compliance can be optimised until the paperwork is spotless and the effect is nil; evaluation item sets drift from real-use distributions (this section's compounding-error point recurs here); cross-actor and cross-jurisdiction differences (who can obtain what, at what cost) rarely sit on the same table; human and deployment factors (who uses it, how, who absorbs the harm) are harder to observe than model factors; and slow risks - labour markets, information environment, dependence - reliably lose to fast risks because they generate no dramatic reportable event.",
        "The honest form of a timeline claim is an interval plus triggers, not a year: look back at the accountable single-year predictions of the past (the 1956 cohort's proposals and later 'within one generation' statements) and the default rate is high - not because forecasters were foolish but because point predictions carry enormous variance on this kind of problem. The operational substitute is a watch list - at this value of this metric I change my mind (the example below gives three rows) - which becomes the last column of next section's checklist."
      ],
      code: `# 存在性风险论证的链条检查器：每一环都要配一句「什么观测会让我收回这一环」
ARGUMENT = [
    {"link": "capability crosses some threshold", "falsifier": ""},
    {"link": "above it, objectives lock into deployment", "falsifier": "if supervised revision demonstrably holds"},
    {"link": "the failure is irreversible and spreads fast", "falsifier": ""},
    {"link": "no reliable interception exists", "falsifier": "if a checked rollback is proven under load"},
]

def chain_audit(argument):
    holes = [row["link"] for row in argument if not row["falsifier"].strip()]
    return holes

holes = chain_audit(ARGUMENT)
print("links", len(ARGUMENT), "| missing falsifier", len(holes), holes)

# 不可证伪的三种常见措辞：观测不到、定义会漂、无法对照
RHETORIC = [
    "it already has it, it merely hides it",
    "real AGI is the thing we recognise only once it is here",
    "this is the last window in which we still get to choose",
]
for line in RHETORIC:
    print("zero argumentative weight:", line)

# 时间线校准的示范数据：年份只演示「到期与覆盖」的算法，不充当历史记录
FORECASTS = [(1956, 2000), (1970, 1990), (1995, 2030), (2012, 2045), (2020, 2029)]

def expired(forecasts, as_of):
    return [made for made, target in forecasts if target <= as_of]

print("as of 2026 expired point claims:", expired(FORECASTS, 2026), "of", len(FORECASTS))

# 区间比点估计诚实，但覆盖率与宽度要一起报：又窄又准才算好消息
def coverage(intervals, truth):
    hits = sum(1 for lo, hi in intervals if lo <= truth <= hi)
    widths = [hi - lo for lo, hi in intervals]
    return round(hits / len(intervals), 3), round(sum(widths) / len(widths), 1)

ENSEMBLE = [(2028, 2045), (2030, 2060), (2026, 2035), (2035, 2070), (2029, 2040)]
print("coverage and width at truth 2038:", coverage(ENSEMBLE, 2038))

# 把快慢之争换成观测量：每个指标配一条「到多少我就改口」
WATCH = [
    ("doubling time of the 50% long-task horizon", "two years below the fitted slope, and I shorten the timeline"),
    ("cross-surface consistency on dynamic items", "more than 10 points lost on rephrasing, and I mark it unproven"),
    ("chain success on the longest step bucket", "no upward curve there, and I refuse the word discontinuity"),
]
for metric, rule in WATCH:
    print("watch:", metric, "->", rule)

# 安全评估框架管流程不管结论：把「有没有做」与「有没有用」分两栏记
FRAMEWORK = [
    ("ex-ante capability threshold", "makes assessment mandatory", "the threshold itself gets optimised"),
    ("transparency documents", "cards for model and data", "the assessed party writes the conventions"),
    ("third-party evaluation", "external reproduction exists", "same items, same scaffold, same judge?"),
    ("incident reporting", "creates an accountability trail", "slow and diffuse harm is not on the form"),
]
for item, covers, blind in FRAMEWORK:
    print(item, "| covers:", covers, "| blind spot:", blind)`,
      pit: "把三个问题（何时到位、是否可控、后果多大）压成一个「快/慢」标签来表态，结果是把可讨论的部分也一起丢了：你既说不出哪条证据会让自己改口，也接不住对方只对其中一环提出的反驳。正确做法是按链条陈述并给每一环配可证伪点，忘了这一步的风险是——争论结束后你的判断和新证据之间没有任何接触面，下一次意外来的时候，你只会加倍重复原来的说法。",
      pit_en: "Compressing three questions (when it arrives, whether it stays controllable, how bad the fallout is) into one 'fast/slow' stance, which throws away the discussable part with the rest: you can neither name the evidence that would change your mind nor receive a rebuttal aimed at a single link. The fix is a link-by-link statement with a falsifier attached; skip it and your judgement keeps no contact surface with new evidence, so the next surprise only makes you repeat the original claim louder.",
      ex: {
        q: "为什么「长任务时长每年翻倍」这一类拟合不能直接当时间线证据用？",
        a: "因为它的自变量定义会随系统能力与题面一起漂移、可数据点极少、不同脚手架下的时长不可比，所以它给的是方向感而不是日期——把它外推成某年到位，等于用一条会变的尺子量一个时间点。",
        q_en: "Why can fits like 'the long-task horizon doubles yearly' not be used directly as timeline evidence?",
        a_en: "Because the measured quantity's definition drifts with system capability and item surfaces, there are very few points, and horizons under different scaffolds are not comparable - so it gives a sense of direction, not a date; extrapolating it to a year is using a ruler that changes length to mark a point in time."
      }
    },

    /* ===================== agi6-7 ===================== */
    {
      id: "agi6-7",
      title: "综合重构：一份能站得住的 AGI 判断",
      title_en: "Synthesis: An AGI Judgement That Can Take a Punch",
      min: 15,
      target: "能把判据、评测构造、污染、复利误差、对齐路线与风险论证合成六道门的检查表，对任一声明指出它卡在哪一道门，并写出自己改口的条件。",
      target_en: "Fuse criterion, eval construction, contamination, compounding error, alignment route and risk argument into a six-gate checklist, name the gate where any claim stalls, and write down the condition under which you change your mind.",
      summary: [
        "本章六节能压成一张六道门的检查表：判据门（说的是哪件事、代价多少、谁判定）、构造门（题从哪来、判定器是什么、计分口径）、污染门（查了什么、阈值多少、截止日期）、预算门（按步数分层、跑了几次、区间下界）、对齐门（走哪条路线、它的漏判面、压力下的分数）、风险门（链条分环、每环可证伪点、改口的数值条件）。裁决规则只有一条：任何一道门交不出一个别人能复算的数，这条声明就只能记为「未定」——既不承认也不否认，那才是诚实的状态。",
        "门一（判据）的可复算数是四维向量加各维通过线，不是总分：0.90/0.40/0.35/0.55 与 0.30/0.80/0.75/0.35 均值相同，要补的短板却是两笔不同的账（前者缺域外数据与组合训练，后者缺接口、校验与预算工程）。常见翻车是把「能在多数常见任务上达到人类水平」当判据——它永远正确，所以永远没有信息量；另一条是把部署缺陷记进能力账，于是花大钱修一个不存在的能力缺口。",
        "门二（构造）要交的是五件一体：任务分布、输出表示、判定器、计分口径、预算，缺一件分数的含义就变。可复算的数是三条笨基线（随机、总选最长项、总重复上一个答案）与模型分数的差距：差距小，那部分分数就不算能力。常见翻车是整场评测只有一种判定器、而且它本身就是模型；翻车的代价在 agi6-5 里付——被优化的对象与打分的口味来自同一批数据，于是「涨分」与「讨喜」在数据上不可区分。",
        "门三（污染）交的是两样：至少两种检测手段（重叠扫描与相似度或成员推断，各自带阈值与命中率），以及一个截止日期（写「未知」也得写）。可复算的数是跨题面一致性的掉分量：同题换个说法掉一大截，就把该能力标为未证实。这一门的两个翻车点在 agi6-3：只做了整串哈希就宣布查过，以及把「换了一批新题」当成「换了一种任务结构」——后者会让一条几乎水平的曲线被讲成能力上涨。",
        "门四（预算）是本章最硬的一门，因为它只要算术：单步 0.95 在 20 步后约 0.36、50 步后约 0.08；要主张 99% 的可靠性，就得给出约 380 次无失败运行这一级的试验量。要交的是按步数分层的成功率与运行次数（平均数会被短任务主导），并且把 pass@1 与 pass@k 分开报（两者对应完全不同的线上成本）。翻车点有两个方向：用 pass@k 讲能力，或用 pass@1 讲不可用——只要不交预算与次数，两个方向都能把同一份数据讲成想要的结论。",
        "门五与门六合起来管「会不会用歪」：对齐门要说清路线归属（偏好式 / 规则式 / 混合）、各自的漏判面，以及为什么分数来自压力测试而不是满意度——因为「上了 RLHF 或 DPO」解决的只是分布内的口味，过优化不会消失，只会换成往日志里最强偏好坍缩的形式（更长、更顺耳）。风险门则要求把「何时到位 / 是否可控 / 后果多大」拆成三环、每环配一个可证伪点，并给一张带数值触发条件的观察清单；缺可证伪点的环节数量大于零，这一门就不通过。",
        "三条说法的演练，看它们分别卡在哪道门：「我们已经做到了通用」——通常卡在门一（写了任务族却交不出预算）、门三（只做了整串哈希）与门六（两环都没有可证伪点），于是它的分数既不能归因也不能被反驳；「AGI 永远不可能，因为真正的通用是到了才认得出的」——卡在门六，这是定义随结果漂移的不可证伪句，它赢不了但也输不掉；「在某些窄意义上部分到了」——这是唯一能过六道门的姿态，但它必须额外披露三件事：通过线是怎么定的、失败样本能不能读、以及自己改口的条件。第三种说法最难写，因为要多交两栏证据。",
        "自我一致性检查与去向：六道门必须同时用来判别人和你自己的信念——如果你用来判 AGI 的标准与你判断「这套榜单该换了」的标准是两套，那你持有的不是判断力而是引述。带过本章的应该是一张填得满的卡，而不是一个立场。接下来的 agi7 处理另一个问题：当判据与证据长成这样时，生态与产业会怎么排、个人该站在哪切入——请把这张表带过去，因为在挑赛道之前，先要弄清是谁在用哪把尺子给你打分。"
      ],
      summary_en: [
        "This chapter's six sections compress into a six-gate checklist: the criterion gate (which task, at what cost, judged by whom), the construction gate (where items come from, what the judge is, which scoring convention), the contamination gate (which detectors, which thresholds, which cutoff date), the budget gate (success stratified by steps, run count, interval bound), the alignment gate (which route, its blind spot, scores taken under pressure rather than from satisfaction), and the risk gate (chain split into links, a falsifier per link, a numeric trigger for changing your mind). One adjudication rule: if any gate yields no number someone else can recompute, the claim is recorded as undecided - neither granted nor denied, which is the honest state.",
        "The recomputable quantity at gate one is the four-dimensional vector plus per-dimension pass lines, not an average: 0.90/0.40/0.35/0.55 and 0.30/0.80/0.75/0.35 share a mean but need two different bills to be paid (the first lacks out-of-domain data and compositional training, the second lacks interfaces, validators and budget engineering). The classic stumble is treating 'reaches human level on most common tasks' as a criterion - forever correct, hence never informative; the second is booking a deployment defect into the capability ledger and then paying to close a gap that is not there.",
        "Gate two demands all five parts on one page - task distribution, answer format, judge, scoring convention, budget - because missing any one changes what the number means. Its recomputable quantity is the gap between three dumb baselines (random, always-longest, always-repeat-last-answer) and the model: wherever a baseline sits close, that part of the score is not capability. The stumble is running an evaluation with exactly one judge and that judge being a model; the bill arrives in section five, when the optimised object and the grading taste come from the same preference pool and 'went up' becomes indistinguishable from 'became likeable'.",
        "Gate three delivers two things: at least two detectors (overlap scanning plus similarity or membership inference, each with threshold and hit rate) and a cutoff date, even if the honest entry is 'unknown'. Its recomputable quantity is the score lost under rephrasing, which marks a capability unproven when the drop is large. Two stumbles were named in agi6-3: declaring the check done after only whole-string hashing, and treating 'new items' as 'a new task structure' - the latter lets a nearly flat curve be narrated as rising capability.",
        "Gate four is the hardest because it is pure arithmetic: 0.95 per step leaves about 0.36 after twenty steps and about 0.08 after fifty, and claiming 99% reliability costs on the order of 380 failure-free runs. What you submit is success stratified by step count with the run count attached (means are dominated by short tasks), and pass@1 reported separately from pass@k since the two carry very different online costs. There are two stumbles in opposite directions: narrating capability with pass@k, or narrating unusability with pass@1 - without budget and run count, the same data supports either verdict.",
        "Gates five and six together cover 'it can do it and spend it wrongly'. The alignment gate asks for route ownership (preference-based, rule-based, hybrid), each route's blind spot, and why the score must come from stress tests rather than satisfaction: 'RLHF or DPO is in place' fixes in-distribution taste only, and over-optimisation does not vanish, it just collapses toward the strongest logged preference - longer and more agreeable. The risk gate requires splitting 'when it arrives / whether it stays controllable / how bad the fallout is' into links, one falsifier per link, and a watch list with numeric triggers; a non-zero count of links without falsifiers fails the gate.",
        "Run three claims through the gates to see where each stalls. 'We have reached general' usually stalls at gate one (a task family but no budget), gate three (whole-string hashing only) and gate six (two links with no falsifier attached), so its score supports neither attribution nor refutation. 'AGI is impossible because real generality is recognised only on arrival' stalls at gate six: a definition that drifts with the result can neither win nor lose. 'Partly reached, in these narrow senses' is the only stance that can clear all six gates, and it must disclose three extra things - how the pass line was set, whether failures are readable, and what would make the author change their mind. The third stance costs the most to write, precisely because it owes two extra columns of evidence.",
        "Self-consistency and where next: the six gates must judge your own beliefs as strictly as everyone else's - if the standard you apply to AGI differs from the one you apply to 'this leaderboard should be retired', you are holding a quotation rather than a judgement. What should leave this chapter is a filled-in card, not a position. agi7 then takes up a different question: given criteria and evidence of this shape, how the ecosystem and the industry line up, and where a person can cut in. Carry this table over, because before choosing a track you first find out who is scoring you, with which ruler."
      ],
      code: `# 六道门：判据 / 构造 / 污染 / 预算 / 对齐 / 风险，每道门交一个别人能复算的数
GATES = [
    ("criterion", lambda c: all(k in c for k in ("family", "budget", "lines"))),
    ("construction", lambda c: c.get("judges", 0) >= 1 and c.get("baselines", 0) >= 3),
    ("contamination", lambda c: c.get("detectors", 0) >= 2 and "cutoff" in c),
    ("budget", lambda c: c.get("stratified") and c.get("runs", 0) >= 30 and c.get("pass1") is not None),
    ("alignment", lambda c: c.get("route") and c.get("failure_surface") and c.get("stress_score") is not None),
    ("risk", lambda c: c.get("links", 0) > 0 and c.get("links_without_falsifier", 1) == 0),
]

def audit(claim):
    passed = [name for name, test in GATES if test(claim)]
    blocked = [name for name, test in GATES if name not in passed]
    return passed, blocked

# 三条常见说法各卡在不同的门上：别指望一道门判全部，也别用一句总评替代六道门
CLAIMS = [
    {
        "name": "press release: reached general",
        "family": "many common tasks",
        "budget": None,
        "judges": 2,
        "baselines": 3,
        "detectors": 1,
        "stratified": True,
        "runs": 60,
        "pass1": 0.51,
        "route": "preference",
        "failure_surface": "proxy reward can be over-optimised",
        "stress_score": 0.62,
        "links": 2,
        "links_without_falsifier": 2,
    },
    {
        "name": "sceptic: impossible forever",
        "family": "an undefined real generality",
        "budget": "n/a",
        "detectors": 0,
        "route": "none",
        "links": 3,
        "links_without_falsifier": 3,
    },
    {
        "name": "careful: partly there on these families",
        "family": "4 named task families, 3 excluded",
        "budget": {"steps": 20, "tokens": 20000},
        "lines": [0.75, 0.75, 0.6, 0.6],
        "judges": 2,
        "baselines": 3,
        "detectors": 3,
        "cutoff": "unknown",
        "stratified": True,
        "runs": 60,
        "pass1": 0.42,
        "route": "hybrid",
        "failure_surface": "list is incomplete; proxy reward can be gamed",
        "stress_score": 0.55,
        "links": 4,
        "links_without_falsifier": 0,
    },
]

for claim in CLAIMS:
    passed, blocked = audit(claim)
    print(claim["name"], "| gates passed", len(passed), "| blocked at", blocked if blocked else "none")

# 一页纸模板：六栏写不满，就不要下「到了 / 没到」的结论
TEMPLATE = [
    "GATE 1 criterion   : family | 4 dimension lines | budget | attempts allowed",
    "GATE 2 construction: item source | judge per item | scoring convention | baselines",
    "GATE 3 contamination: detectors + thresholds + hit rate | cutoff date (or unknown)",
    "GATE 4 budget      : p^n arithmetic | stratified by steps | runs + lower bound",
    "GATE 5 alignment   : route | its blind spot | score under pressure, not satisfaction",
    "GATE 6 risk        : links | one falsifier each | numeric triggers to change my mind",
]

with open("agi6_verdict_card.txt", "w", encoding="utf-8") as f:
    for line in TEMPLATE:
        print(line, file=f)
print("wrote agi6_verdict_card.txt: plain text, no tooling required")

# 反查自己：把这张表先拿去判你上周读过的那条声明，判不动就说明你还没学会用它
def self_test(gates_passed, gates_total=6):
    return "recompute it" if gates_passed < gates_total else "defensible"

print("verdict on my own last claim:", self_test(3))`,
      pit: "把这张表当成打分器来用——给每个声明打个六分制总分，然后宣布高分者胜出。它的正确用法是筛子而不是尺子：任何一道门交不出可复算的数，结论就落到「未定」，而「未定」不是一个失败的判决，是把注意力换到那一栏的动作。用成打分器的具体后果是，你会开始为总分挑选证据、把六道门里最容易满足的那几道填满，最终得到一份看起来很齐、实际上一推就倒的卡片。",
      pit_en: "Using the table as a scorer - giving every claim a score out of six and declaring the high scorer the winner. Its correct use is as a sieve, not a ruler: if any single gate yields no recomputable number, the verdict drops to undecided, and undecided is not a failed judgement but an instruction about which column to look at next. Used as a score, you start picking evidence for the total, filling the easiest gates first, and end up with a card that looks complete and topples on one push.",
      ex: {
        q: "为什么六道门里「未定」要算一个正式结论，而不是暂时的空白？",
        a: "因为它是可执行状态：它写明了哪一栏缺什么数、谁该去补、以及补到多少才算过，而「暂时不判」什么都不指定——把它叫成未定，下一次同类声明来的时候你才有地方可以接着比。",
        q_en: "Why should 'undecided' count as a formal verdict among the six gates rather than a blank placeholder?",
        a_en: "Because it is actionable: it names which column lacks which number, who should fill it, and what value would clear the gate, whereas 'not calling it yet' specifies nothing - calling it undecided leaves a place where the next claim of the same kind can be compared against."
      }
    }
      ],

      /* ---------- 本章题库：2 选择 + 1 判断 + 1 填空 ---------- */
      quiz: [
        {
          q: "下面哪项最能说明「四个维度的平均分 0.55」不能支持「这个系统是通用的」？",
          o: [
            "0.55 这个线定得太低，把通过线提到 0.8 结论就成立了",
            "平均这一步会把形状抹平：两种相反的四维分布能算出同一个数，而它们要补的短板是两笔不同的账",
            "四个维度之间互相独立，因此在数学上不能相加求平均",
            "总分必须改用几何平均数或加权平均数才有解释力"
          ],
          a: 1,
          why: "关键是形状而不是算法：0.90/0.40/0.35/0.55 与 0.30/0.80/0.75/0.35 均值都是 0.55，前者需要域外数据与组合训练，后者需要接口、校验与预算工程。调高通过线只是换一条总分线，不改变「单一数字无法定位短板」这件事。",
          q_en: "Which point best explains why 'the four dimensions average 0.55' cannot support 'this system is general'?",
          o_en: [
            "The line of 0.55 is simply too low; raise it to 0.8 and the claim stands",
            "Averaging flattens shape: two opposite four-dimension profiles give the same number while needing two different repairs",
            "The four dimensions are mathematically independent, so they may not be summed",
            "Only a geometric or weighted mean would make the aggregate interpretable"
          ],
          why_en: "Shape, not arithmetic, is the issue: 0.90/0.40/0.35/0.55 and 0.30/0.80/0.75/0.35 both average 0.55, yet the first needs out-of-domain data and compositional training while the second needs interfaces, validators and budget engineering. Moving the pass line only swaps one aggregate for another; it does not make a single number locate the weakness."
        },
        {
          q: "关于对齐技术路线与偏好数据，下列哪项最站得住？",
          o: [
            "DPO 省掉了显式奖励模型，因此过优化的风险也随之被消除",
            "宪法式方法把禁令写成文本，就保证了模型在被诱导时仍按文本行事",
            "长度偏差与阿谀倾向会同时污染训练目标和用模型复评的评测，因为被优化者与打分者共享同一批口味",
            "机制可解释只要定位到某条电路，就能断言模型持有一个长期目标"
          ],
          a: 2,
          why: "偏好数据的系统性偏差会经由奖励模型与「模型当裁判」两条通道同时进入训练与评测，于是涨分与讨喜在数据上不可区分。A 错在过优化只是换位置（往日志里最强偏好坍缩）并少掉一个警报器；B 错在文档里的规则不是起作用的因果机制；D 错在可解释的证据是局部且任务相关的。",
          q_en: "Which statement about alignment routes and preference data holds up best?",
          o_en: [
            "DPO removes the explicit reward model, so over-optimisation risk disappears with it",
            "Writing prohibitions as text guarantees the model still follows the text when goaded",
            "Length bias and sycophancy contaminate the training target and a model-judged evaluation at once, because the optimised object and the grading taste share one preference pool",
            "Once interpretability locates a circuit, one may assert the model holds a standing goal"
          ],
          why_en: "Systematic preference-data bias enters through two channels at once - the reward model and model-as-judge scoring - so score gains and likeability become indistinguishable in the data. A is wrong because over-optimisation only relocates (collapsing toward the strongest logged preference) and one alarm is lost; B is wrong because a stated rule is not the operative mechanism; D is wrong because interpretability evidence is local and task-bound."
        },
        {
          q: "判断题：某份声明称「这种能力其实已经具备了，只是系统平时不表现出来，因此外部观测不到」，这仍然是一个可讨论的实证主张。",
          type: "judge",
          a: 1,
          why: "不成立。「已经具备但原则上观测不到」不留下任何能收回它的观测，属于三类不可证伪措辞中的「观测不到」那一类：它不一定错，但在论证里权重为零。判据很简单——要求对方写出「什么观测会让我收回这一环」，写不出来就记为未定而不是分歧。",
          q_en: "True or false: a claim that 'this ability is already there, the system just does not display it, so it cannot be observed from outside' is still a discussable empirical claim.",
          why_en: "It is not. 'Already present but in principle unobservable' leaves no observation that could retract it - it is the unobservable species of unfalsifiable phrasing: not necessarily wrong, but of zero weight in an argument. The test is simple: ask for the sentence 'if I observe this, I withdraw this link'; if it cannot be written, record undecided rather than disagreement."
        },
        {
          q: "每一步通过率 0.95、且各步近似独立时，20 步整链成功率约为 ＿＿＿%（四舍五入到整数）。",
          type: "fill",
          ans: ["36", "35.8", "0.36", "35.7", "35"],
          why: "0.95 的 20 次方约等于 0.358，也就是约 36%。这条指数鸿沟正是判据必须写代价预算的理由：单步很体面与整件事能成是两件事，而 50 步只剩约 8%。",
          q_en: "With per-step success at 0.95 and steps approximately independent, a 20-step chain succeeds at about ____% (round to an integer).",
          why_en: "0.95 to the 20th is about 0.358, i.e. roughly 36%. That exponential gap is exactly why a criterion must carry its cost budget: 'each step looks fine' and 'the job gets done' are different claims, and at 50 steps only about 8% remains."
        }
      ]
    }
  ],

  /* ---------- 名词：6 条（已对 base-terms.txt 与本目录全部 agi-deepen-*.js 的 term 键查重） ---------- */
  terms: [
    { term: "可操作判据", term_en: "Operational Criterion", cat: "评测与安全",
      short: "把「通用」写成任务族、代价预算与判定线三件齐备的一张卡。",
      short_en: "A card that pins 'general' down to three things at once: task family, cost budget, decision line.",
      detail: ["三件缺一件，这句话就既不能验证也不能反驳：没有任务族就不知道在测什么事，没有预算就测不到真实代价，没有判定线就谁都能自称达标。", "合格的判据还自带误伤清单：写出它会把什么好系统判成差的、会把什么差系统判成好的，并为每条配一个便宜的旁路检查。"],
      detail_en: ["Miss any one of the three and the sentence can be neither verified nor refuted: without a task family nobody knows what is being measured, without a budget the real cost never shows, and without a decision line anyone may declare victory.", "A passable criterion also ships with its misjudgement list: which good systems it marks bad, which bad ones it marks good, and a cheap side-channel check for each."],
      vs: "可操作判据交的是可核对的三件事，通用人工智能这个词交的是一种方向感。",
      vs_en: "An operational criterion delivers three checkable items; the term AGI delivers a sense of direction." },
    { term: "组合泛化", term_en: "Compositional Generalisation", cat: "基础概念",
      short: "把已经会用的零件拼成没见过的任务或新组合时还能做对。",
      short_en: "Getting unseen tasks and new combinations right out of parts the system already handles.",
      detail: ["它查的是「会乘法」加「会加法」能不能合成两步题，与见过的题多不多是两回事，因此是「通用」四个维度里最难被记忆冒充的一个。", "它的失效面同样明确：模板化训练能让同模板的新实例分数很好看，一换叙述或反过来组合就崩，所以必须与跨题面一致性一起读。"],
      detail_en: ["It asks whether 'knows multiplication' plus 'knows addition' composes into a two-step problem, which is a different matter from how many items were seen - making it the hardest of the four generality dimensions for memorisation to impersonate.", "Its failure surface is equally clear: template-shaped training flatters new instances of the same template, then collapses on a change of narration or a reversed composition, so read it together with cross-surface consistency."],
      vs: "组合泛化测零件能否新拼，涌现能力描述的是分数随规模的形状。",
      vs_en: "Compositional generalisation tests whether parts recombine; emergent ability describes the shape of scores against scale." },
    { term: "程序化验证", term_en: "Programmatic Verification", cat: "评测与安全",
      short: "生成器同时交出题面、标准答案与判定程序，让评测能无限出题且判定几乎不要钱。",
      short_en: "A generator that yields the prompt, the gold answer and the verifier, so items are unlimited and judging costs almost nothing.",
      detail: ["它的价值不在更准而在便宜：判定成本接近零，才付得起一题一面的大样本，记忆与污染因此失去落脚点，顺手还能做难度扫描。", "两个必须防的坑：验证器太宽会把错的判成对并抬高所有曲线；只换实例不换任务结构时，测到的仍是模板拟合度而不是能力。"],
      detail_en: ["Its worth is cheapness rather than accuracy: with near-zero judging cost you can afford one-item-one-sample sets, so memorisation and contamination lose their foothold and a difficulty sweep comes for free.", "Two traps to guard: a lenient verifier marks wrong answers right and lifts every curve, and swapping instances while keeping the task structure measures template fit, not capability."],
      vs: "程序化验证交的是可执行判定，LLM 评审交的是模型给出的偏好分。",
      vs_en: "Programmatic verification hands over an executable decision; LLM-as-judge hands over a preference score from a model." },
    { term: "成员推断", term_en: "Membership Inference", cat: "评测与安全",
      short: "反过来问模型「这段你见过吗」：前缀续写、逐词概率异常、请背诵原文。",
      short_en: "Asking the model whether it has seen a span: prefix completion, per-token probability anomalies, recite-the-passage prompts.",
      detail: ["它查的是「记住了」这个行为而不是语料本身，所以能覆盖重叠扫描抓不到的隐性泄漏那一类。", "误报很贵：公式、法条、歌词与高频短语都会被误判为记忆，因此报告要附一批模型没道理见过的对照字符串，并公布阈值。"],
      detail_en: ["It probes the behaviour of having memorised rather than the corpus, which is how it reaches the covert-leakage class that overlap scanning misses.", "False alarms are costly - formulas, statutes, lyrics and common phrases all look like memory - so publish a control set of strings no model could plausibly have seen, together with the threshold."],
      vs: "成员推断查的是行为证据，数据污染说的是训练与评测重叠这个现象。",
      vs_en: "Membership inference is behavioural evidence; data contamination names the phenomenon of train-test overlap." },
    { term: "复利误差", term_en: "Compounding Error", cat: "评测与安全",
      short: "整链成功率近似是单步成功率的步数次方：每步都还行，整件事不行。",
      short_en: "Whole-chain success is roughly per-step success to the power of step count: fine per step, failed as a job.",
      detail: ["单步 0.95 在 20 步后约 0.36、50 步后约 0.08，这条指数鸿沟正是长任务判据必须写代价预算的原因。", "独立性只是近似：错误按整轮成堆会把重试收益压得远低于独立假设的预测，级联失败又让自称完成高于真完成，两个偏差方向都得报。"],
      detail_en: ["At 0.95 per step, twenty steps leave about 0.36 and fifty leave about 0.08 - the exponential gap that forces any long-task criterion to carry a cost budget.", "Independence is an approximation only: errors clustered by run crush retry gains far below the independent prediction, while cascade failure makes 'declared done' exceed 'actually done', and both directions must be reported."],
      vs: "复利误差解释整链为什么掉分，轨迹评测记录它掉在第几步。",
      vs_en: "Compounding error explains why the chain falls; trajectory evaluation records at which step it fell." },
    { term: "阿谀倾向", term_en: "Sycophancy", cat: "评测与安全",
      short: "附和用户预设立场更容易得分，于是判断被社会性奖励牵着走。",
      short_en: "Agreeing with the user's stated premise earns more, so judgement gets steered by a social reward.",
      detail: ["它的来源是偏好数据而不是知识缺陷：标注与复评都给「顺着说」加分，模型于是学会在被施压时收回正确答案。", "它是评测问题而不只是体验问题：一旦用模型当裁判，被优化者与打分者共享同一批口味，涨分与讨喜在数据上就不可区分。"],
      detail_en: ["Its source is the preference data rather than a knowledge gap: labelling and re-judging both reward agreement, so the model learns to recant a correct answer under pressure.", "It is an evaluation problem, not merely a UX one: with a model as judge, the optimised object and the grading taste share one preference pool, making score gains indistinguishable from likeability."],
      vs: "幻觉暴露的是能力边界，阿谀倾向暴露的是激励结构。",
      vs_en: "Hallucination exposes the capability boundary; sycophancy exposes the incentive structure." }
  ],

  achievements: [
    { id: "agi_criteria_auditor", icon: "⚖️", name: "判据审计员", name_en: "Criteria Auditor",
      desc: "完成 agi6 · AGI 判据、评测与风险争论 全部课节",
      desc_en: "Finish every lesson of agi6, Judging AGI: Evals, Claims and Risks",
      check: ["agi6"] }
  ],

  /* ---------- 代码注释英文映射：覆盖上面 7 段 code 里全部含中文的注释行（共 43 条） ---------- */
  codeComments: {
    "判据卡：四个维度 + 三件必备（任务族 / 代价预算 / 判定线），缺一条就退回口号": "Criterion card: four dimensions plus three mandatory parts (task family / cost budget / decision line); drop one and it reverts to a slogan",
    "均分相同不代表同一种「通用」：平均这一步把形状信息全抹掉了": "Equal means do not mean equal generality: the averaging step erases all the shape information",
    "三分法：能力 / 部署 / 意愿，判据信号不同，补救手段也不通用": "Three cuts, not two: capability / deployment / disposition - different signals, and remedies that do not transfer",
    "不可证伪的判据长这样：没有预算、没有判定线，只有一句「多数常见任务都行」": "Here is an unfalsifiable criterion: no budget, no decision line, just 'fine on most common tasks'",
    "人类基线要写参照人群：同一道题，外行半小时与专家八小时是两个天花板": "A human baseline must name its reference population: thirty minutes with a layperson and eight hours with an expert are two different ceilings",
    "缓存表当作「见过题面」：静态题库的分数收益，与真实算力无关": "The cache table stands in for having seen the item: static-set score gains, unrelated to any real skill",
    "程序化验证：生成器同时交出题面与一个几乎免费的判定器，动态题面才有灵敏度": "Programmatic verification: the generator emits the prompt plus an almost-free verifier, which is what gives a dynamic set its sensitivity",
    "先查缓存（记忆与污染的表现），查不到才动用真实算力": "Check the cache first (the signature of memorisation and contamination); only then spend real skill",
    "判定器的格式脆性：等价写法被精确匹配判错，静态分还会在低估之上再低估一次": "Judge brittleness on format: exact match fails equivalent forms, so the static number understates on top of understating",
    "三条笨基线一起报：只挑最长选项，命中率就能高过随机基线，那部分分数不是能力": "Report the dumb baselines alongside: always-picking-the-longest already beats chance, and that slice of the score is not capability",
    "难度扫描：同一模板拉大参数范围，看的是曲线形状而不是某一个点": "Difficulty sweep: widen the parameter range within one template and read the curve's shape, not a single point",
    "本地手填的「训练语料」与「新题」：全程不联网、不下载任何数据集": "Hand-typed local 'training corpus' and 'new items': no network, no dataset download anywhere",
    "检测一：字符 n-gram 的 Jaccard 重叠，抓得住拷贝，抓不住改写": "Detector one: character n-gram Jaccard overlap - catches copies, misses rewrites",
    "检测二：哈希词袋的余弦相似度，容得下换序，容不下同义替换": "Detector two: cosine over a hashed bag of words - tolerates reordering, not synonym substitution",
    "阈值必须与命中率一起公布，否则「我们查过了」这三个字不可反驳": "Publish the threshold with the hit rate, or 'we checked' becomes impossible to argue with",
    "检测三：成员推断，背出来的片段逐词概率异常地高，但常用短语同样会误报": "Detector three: membership inference - recited spans sit anomalously high per token, and common phrases trip it too",
    "时间切片：只用数据截止之后的题，最干净但样本少、题质也不稳": "Time slicing: only items after the cutoff - cleanest, but scarce and uneven in quality",
    "饱和四查：头部差距、错误集中度、运行间噪声、人类基线差距": "The four saturation checks: head gap, error concentration, run-to-run noise, distance to the human baseline",
    "饱和之后改测代价：同一题面在三个预算档上的曲线，比单点分数有用": "After saturation, measure cost instead: the curve across three budget tiers beats a single point",
    "复利误差：单步听着很行，二十步之后是一行幂运算的事": "Compounding error: each step sounds fine, and twenty steps later it is one exponentiation",
    "偏差一：错误按「整轮」成堆。同边际单步错误率下，相关模型比独立模型算出的整链更高": "Bias one: errors pile up by the run. At the same marginal per-step error rate, the correlated model beats the independent arithmetic",
    "偏差一的另一面：同一任务的多次尝试共享那个难易状态，于是 pass@k 被独立假设吹起来": "The other face of bias one: retries share the same difficulty state, which is where independence inflates pass@k",
    "偏差二：级联失败让「自称完成」高于「真完成」，因为检出本身有漏检率": "Bias two: cascade failure puts 'declared done' above 'actually done', because detection itself has a miss rate",
    "检查点改变的是错误的传播半径：整链上升但收益饱和，成本却线性上升，要按预算比大小": "Checkpoints change the propagation radius of an error: chain rises then saturates while cost climbs linearly - compare under budget",
    "按步数分层报告：平均成功率被短任务主导，长任务那一条才是真相": "Stratify by step count: the mean is dominated by short tasks, and the long bucket is where the truth sits",
    "置信区间：全过的次数太少就撑不起高可靠性主张，下界随试验次数才慢慢爬": "Confidence intervals: too few clean runs cannot carry a high-reliability claim; the bound only crawls up with trials",
    "合成偏好对：标注员偏爱更长的回答，也偏爱附和用户预设立场的回答": "Synthetic preference pairs: raters favour longer answers and answers that agree with the user's premise",
    "拟合出来的奖励只会复制标注员的口味：正确性根本不在它的词汇里": "A fitted reward merely copies the raters' taste: correctness is not in its vocabulary",
    "同一个偏好会污染以模型输出为输入的评测：复评的裁判也爱长答案": "The same taste contaminates any evaluation fed with model output: the re-judging referee also loves long answers",
    "去偏一条：给长度加罚项。它修好了这一题，却会惩罚真正需要细节的任务族": "One de-biasing move: penalise length. It fixes this item while punishing task families that genuinely need detail",
    "阿谀指标：先答对，再被用户施压，看它改口的比例（0.5 是瞎猜水平）": "Sycophancy metric: answer correctly, then get pushed - the recanting rate, with 0.5 as the guessing level",
    "三条路线的分工表：各管一层，各留一个漏判面，别当成新旧替代": "The division-of-labour table for three routes: each covers one layer and keeps one blind spot; they do not replace each other",
    "压力下才测得动对齐：满意度式打分与正确性打分在这里分叉": "Alignment only measures under pressure: approval-style scoring and correctness-style scoring fork right here",
    "存在性风险论证的链条检查器：每一环都要配一句「什么观测会让我收回这一环」": "A chain checker for existential-risk arguments: every link needs its own 'this observation would make me withdraw it'",
    "不可证伪的三种常见措辞：观测不到、定义会漂、无法对照": "Three common unfalsifiable phrasings: unobservable, drifting definition, nothing to compare against",
    "时间线校准的示范数据：年份只演示「到期与覆盖」的算法，不充当历史记录": "Demonstration data for timeline calibration: the years show the expiry-and-coverage arithmetic only, not a historical record",
    "区间比点估计诚实，但覆盖率与宽度要一起报：又窄又准才算好消息": "Intervals are more honest than points, but report coverage and width together - narrow and correct is the good news",
    "把快慢之争换成观测量：每个指标配一条「到多少我就改口」": "Turn the fast-versus-slow quarrel into observables: one 'at this value I change my mind' per metric",
    "安全评估框架管流程不管结论：把「有没有做」与「有没有用」分两栏记": "Safety frameworks govern process, not conclusions: keep 'was it done' and 'did it help' in separate columns",
    "六道门：判据 / 构造 / 污染 / 预算 / 对齐 / 风险，每道门交一个别人能复算的数": "Six gates: criterion / construction / contamination / budget / alignment / risk - each must yield a number others can recompute",
    "三条常见说法各卡在不同的门上：别指望一道门判全部，也别用一句总评替代六道门": "Three common claims stall at different gates: one gate decides nothing, and a blanket verdict is no substitute for six",
    "一页纸模板：六栏写不满，就不要下「到了 / 没到」的结论": "One-page template: if the six columns do not fill, do not issue an arrived-or-not verdict",
    "反查自己：把这张表先拿去判你上周读过的那条声明，判不动就说明你还没学会用它": "Turn it on yourself first: judge a claim you read last week - if you cannot, you have not learned to use the table"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_AGI6);
