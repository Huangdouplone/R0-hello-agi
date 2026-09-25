/* ================================================================
 * R0:hello agi · 课程深化层 ⑬（agi5 AGI 发展路线与范式更替 —— 全新整章）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：agi1~agi4 讲的是「怎么做」（训练、用法、系统、落地），这一章回看「为什么是
 *       这条路」。八节按「资源—技术—预期—评测」四栏推进：寒冬与繁荣的钱从哪来、
 *       符号与连接两条血脉、三个拐点各自松开了哪一环、预训练范式如何确立、scaling
 *       与涌现之争的度量陷阱、三要素权重的历史变化、基准饱和与污染、最后一节收口成
 *       一张可证伪的因果图。
 * 写法约定：
 *   1) 全章为新增课节，每节写齐 title / title_en / target / target_en；
 *   2) 站点无服务端：所有示例只用本地合成数据，不下载数据集、不调接口、不需要密钥；
 *      matplotlib 固定 Agg 后端、PNG 写在当前目录；
 *   3) Python 注释一律单独成行（行尾 # 页面不翻译），全部登记进 codeComments；
 *   4) 历史事实存疑处一律用「约 / 通常 / 有争议」表述，不做「哪家机构更强」的推荐，
 *      不给外部链接；
 *   5) 分期本身有争议的地方（有没有第三次寒冬）在课内明说，不当结论用。
 * ================================================================ */

const DEEPEN_AGI5 = {
  newStages: [
    {
      id: "agi5",
      icon: "🧭",
      name: "AGI 发展路线与范式更替",
      name_en: "The Road to AGI: Paradigms and Disputes",
      desc: "从寒冬到 scaling 之争：今天的智能是被哪几只手做成这个样子的",
      desc_en: "From AI winters to the scaling dispute — which hands actually shaped today's intelligence",
      goal: "能把 AGI 的发展讲成一条有因果的路线，并对每一轮兴衰分别指出技术、资源、预期与评测各起了什么作用。",
      goal_en: "Retell AGI's development as a causal route, naming for every boom and bust what technology, resources, expectations and benchmarks each contributed.",
      insertAfter: "agi4",
      links: [],

      lab: {
        t: "把发展路线画成一张因果图",
        t_en: "Turn the road map into a single causal graph",
        mode: "text",
        req: [
          "用「技术 / 资源 / 预期 / 评测」四栏列出至少 10 个节点，每栏至少 2 个，每个节点标出年份（拿不准就写「约」）",
          "画不少于 10 条有向边，每条边配一句机制说明（谁改变了谁的可选项）；写不出机制的边一律删掉",
          "指出图中唯一的「预期→资金→能力→交付」反馈回路，并写出它在什么条件下反转成「落差被识破→资金收紧」",
          "挑两条你认为可证伪的边，各写一句「如果哪一年的哪件事没发生，这条边就该删」",
          "最后写三行结论：这一章里你最没把握的一个因果、你判断下一次拐点最可能从哪一栏先来、以及你用什么信号提前发现它"
        ],
        req_en: [
          "List at least 10 nodes in four columns — technology / resources / expectations / evaluation — with at least two per column, each dated (write 'circa' when unsure)",
          "Draw at least 10 directed edges, each with one mechanism sentence (whose option set changed); delete any edge you cannot motivate",
          "Identify the single 'expectation → funding → capability → delivery' feedback loop and state the condition that reverses it into 'gap exposed → funding tightens'",
          "Pick two edges you consider falsifiable and write for each: 'if event X in year Y had not happened, this edge should go'",
          "Close with three lines: the causal claim you trust least, which column you think produces the next inflection, and the early signal you would watch"
        ],
        starter: `COLUMNS: TECH | RESOURCE | EXPECTATION | EVAL
------------------------------------------------
1956  EXPECTATION  dartmouth workshop
197x  RESOURCE     grant lines tightened by milestone
1973  EXPECTATION  Lighthill review (UK)
198x  TECH         expert systems: rules + inference engine
1986  TECH         backprop makes deep nets trainable
2007  RESOURCE     rentable parallel compute
2009  RESOURCE     crowdsourced labels
2012  TECH         representation learning wins a benchmark
2017  TECH         attention: sequence -> one matmul
202x  EVAL         short benchmarks saturate -> long tasks
------------------------------------------------
EDGE FORMAT:  FROM -> TO : mechanism (one line, no adjectives)
LOOP CHECK: exactly one expectation->funding->capability->delivery cycle
FAKE CHECK: if X in YEAR had not happened, delete edge ...`,
        hint: "先只摆节点，别急着连线。每连一条边就问自己两个问题：当年是谁批的钱、是谁写的报告。答不上来，说明这条边是你脑补的安慰剂。",
        hint_en: "Place the nodes first and resist connecting them. For every edge ask two questions: who approved the money that year, and who wrote the report. No answer means the edge is a placebo you invented.",
        xp: 30
      },

      lessons: [

    /* ===================== agi5-1 ===================== */
    {
      id: "agi5-1",
      title: "三次寒冬与两次繁荣：钱和信任从哪来",
      title_en: "Winters and Booms: Where the Money and the Trust Came From",
      min: 13,
      target: "能用「能力—预期—资金」三角解释两次公认寒冬的成因，并说清为什么寒冬首先是预期问题而不是纯技术问题。",
      target_en: "Explain the two accepted AI winters with the capability–expectation–funding triangle, and show why a winter is first a crisis of expectations rather than of technology.",
      summary: [
        "起点是 1956 年夏天的达特茅斯研讨会：McCarthy、Minsky、Rochester 与 Shannon 在 1955 年提交的提案里，第一次把「让机器像人一样推理」写成一个可以分工攻克的课题；会上没有产出任何能跑的系统，但它把一群人的志向和此后十年的经费叙事绑在了一起，「人工智能」这个名字也来自那份提案。",
        "教科书常说的分期是两次寒冬：约 1974–1980 与约 1987–1993。「有没有第三次」本身仍有争议——有人把 1980 年代末神经网络资助退潮算作一次子领域的小型冬天，也有人把当下的调整期直接叫寒冬；本章按「两次公认寒冬 + 一次领域内退潮」来讲，不把未定论的分期当事实用。",
        "早期承诺要记具体的：1960 年代中后期，几位主要研究者公开给过「几十年内机器能做人所做的一切工作」级别的预测（原话在传播中越转越绝对）。埋下伏笔的不是乐观本身，而是可被追责的时间表——它给了后来的人一个明确的地点来判你失信。",
        "第一次寒冬的真实内容是钱改道，不是研究死亡：1966 年美国的 ALPAC 报告让机器翻译经费退潮；1973 年英国 Lighthill 报告批评 AI 二十年未兑现承诺，英国学术 AI 经费几乎被抽干（随即有 Cochrane 等人在业内联名反驳，这份报告后来被普遍认为苛刻且失准）；1970 年代中期美国 DARPA 停止「不设方向」的高校课题资助。论文照写、学位照授，收缩的是特定资助线。",
        "两次繁荣的机制不同，这一点常被抹平：第一次（约 1956–1973）建立在「通用问题求解」的乐观与刚刚可用的计算机之上；第二次（约 1980–1987）则建立一个能卖钱的中间形态上——专家系统把「知识 = 产生式规则 + 推理机」变成企业能开采购单的东西（R1/XCON、MYCIN 一类规则系统是最典型的例子）。",
        "政策的预期与产业的预期会互相加强：日本 1981 年批准、1982 年启动的「第五代计算机」计划把逻辑推理与知识处理做成国家级工程目标，直接抬高了各国对「下一代机器」的想象（该计划在 1990 年代初收尾，当初设定的多数硬目标没有达成）。那一轮放大的样板不是论文，而是采购单与新闻发布。",
        "第二次寒冬的触发点是维护成本与市场，同样不是论文：专用 Lisp 机被通用工作站与个人电脑打败，专家系统的规则库需要领域专家与知识工程师长期维护、换个部门几乎要重做一遍。当「买回来的知识资产」不再增值，采购预算先停，人才预算随后停——顺序反过来读就会误判形势。",
        "把几轮周期叠起来看，结构是同一个三角：能力（当时真能做到什么）、预期（承诺了什么、被报告与媒体放大成什么）、资金（谁批、按什么里程碑批）。能力是慢变量，预期与资金是快变量，所以繁荣期看着像「技术突然变强」、收缩期看着像「技术突然不行」，动的其实主要是后两个。下一节开始我们才谈技术本身，但请记住本章反复出现的判断句：冬天是预期事件，只是它经常穿着技术的外衣。"
      ],
      summary_en: [
        "The starting point is a Dartmouth conference room in the summer of 1956: in the proposal they filed in 1955, McCarthy, Minsky, Rochester and Shannon first wrote 'making machines reason like people' as a problem that could be split up and attacked; nothing runnable came out of the workshop, but it fused a group of ambitions with the funding narrative of the next decade — and the name 'artificial intelligence' comes from that proposal.",
        "The standard periodisation lists two winters, roughly 1974-1980 and roughly 1987-1993. Whether there was a third is still argued over: some count the late-1980s retreat in neural-network grants as a small sectoral winter, others call the current correction one. This chapter uses 'two accepted winters plus one sub-field retreat' and does not treat a contested periodisation as fact.",
        "Remember the early promises concretely: in the mid-to-late 1960s several leading researchers publicly offered predictions on the order of 'within a few decades machines will do any work a person can do' (the wording grew more absolute with each retelling). What planted the trap was not optimism but an accountable timetable — it gave later critics a precise place to declare you had defaulted.",
        "The first winter was money being rerouted, not research dying: the 1966 ALPAC report in the US drained machine-translation funding; the 1973 Lighthill report in the UK accused AI of two decades of unmet promises and UK academic AI funding was all but pulled (Cochrane and colleagues circulated a rebuttal, and history judged the report harsh and inaccurate); in the mid-1970s DARPA stopped financing direction-free university topics. Papers kept being written and degrees awarded — the specific funding lines shrank.",
        "The two booms ran on different mechanisms, a difference usually smoothed away: the first (roughly 1956-1973) rested on 'general problem solving' optimism and computing that had just become available; the second (roughly 1980-1987) rested on an intermediate form that could actually be sold — expert systems turned 'knowledge = production rules + inference engine' into something a company could raise a purchase order for, with R1/XCON and MYCIN as the archetype.",
        "Policy expectations and industry expectations amplified each other: Japan's fifth-generation computer programme, approved in 1981 and launched in 1982, made logical inference and knowledge processing a national engineering goal and lifted everyone's imagination of 'the next machine' (it wound down in the early 1990s having missed most of its hard targets). The amplification template of that round was purchase orders and press conferences, not papers.",
        "The second winter was likewise triggered by maintenance cost and market failure, not by papers: special-purpose Lisp machines lost to general workstations and PCs, and an expert system's rule base needed continuous upkeep by domain experts and knowledge engineers — move to another department and you rebuilt it. Once the purchased knowledge asset stopped appreciating, purchase budgets stopped first and headcount budgets followed; read that order backwards and you will misjudge the situation.",
        "Stack the cycles and the structure is one triangle: capability (what genuinely worked), expectation (what was promised, as amplified by reports and press), and funding (who signed, against which milestones). Capability is the slow variable, expectation and money are fast — so booms look like 'technology suddenly got strong' and busts look like 'technology suddenly got weak', when mainly the latter two moved. Technology gets its own sections from here on, but keep this chapter's recurring sentence: a winter is an expectations event that usually wears a costume of technology."
      ],
      code: `# 玩具模型：能力是慢变量，承诺与预算是快变量
# 模型里没有任何「技术突然退步」的参数，周期照样出现
# 三个量都做了归一化，只为看形状，不要拿它做任何预测
cap, budget, hype = 0.20, 1.00, 0.00

for year in range(1956, 2026, 4):
    # 预算推能力，饱和上界写在式子里：越往后越难推动
    cap = min(0.95, cap + 0.05 * budget * (1.0 - cap))
    # 落差就是承诺比交付多出来的那部分
    gap = hype
    # 落差被识破，塌下去的是预算而不是能力
    budget = 1.0 if gap < 0.15 else 0.25
    # 有钱的时候才敢把话说大：预期跟着预算走
    hype = 0.35 * budget
    state = "繁荣" if budget > 0.5 else "收缩"
    print(year, "能力", round(cap, 3), "预算", round(budget, 2), state)

# 读法：只看预算那一列的翻转点，那一次翻转就是所谓「寒冬」
print("把阈值 0.15 调大或调小，周期长度就跟着变——这正是预期问题的含义")`,
      pit: "只用「论文数量还涨不涨」来判断冬天存不存在，结果会把 1974–1980 判成「什么都没发生」，而实际发生的是资助口径从「通用推理」换成「有明确交付的窄任务」。忘了这一条，你在繁荣期会把资源红利当成技术胜利，在收缩期把还在累积的技术当成没希望——两次都在同一个地方判错方向。",
      pit_en: "Judging whether a winter exists by paper counts alone makes 1974-1980 look like 'nothing happened', when what happened was that grant language switched from 'general reasoning' to 'narrow tasks with a deliverable'. Miss this and you read a resource tailwind as a technical victory during booms, and read still-accumulating technique as hopeless during busts — the same mistake both directions.",
      ex: {
        q: "为什么专家系统的倒闭不能简单归因于「技术不成熟」？",
        a: "因为坏掉的是成本结构：规则库要靠专家与知识工程师长期维护、几乎不可复用，边际成本不随规模下降——技术够不够用是一回事，钱还能不能持续付是另一回事。",
        q_en: "Why can the collapse of expert systems not be blamed simply on immature technology?",
        a_en: "Because the cost structure broke: rule bases need permanent upkeep by domain experts and knowledge engineers and hardly transfer, so marginal cost never falls with scale — whether the technology suffices is one question, whether the payments continue is another."
      }
    },

    /* ===================== agi5-2 ===================== */
    {
      id: "agi5-2",
      title: "两条血脉：符号主义与连接主义",
      title_en: "Two Bloodlines: Symbolicism and Connectionism",
      min: 12,
      target: "能说出两脉各自的强项与失效模式，讲清 Minsky–Papert 批评的确切范围，并举出现代系统里「可微分层 + 结构化推理」合流的三处位置。",
      target_en: "State each tradition's strength and failure mode, give the exact scope of the Minsky-Papert critique, and name three places where modern systems fuse differentiable layers with structured reasoning.",
      summary: [
        "符号主义的赌注是：智能 = 对显式符号的操作。世界用逻辑、规则、框架、本体写清楚，推理引擎负责往下推。它的强项是可解释、可逐条编辑、样本效率极高（一条规则写完就永久生效）以及能严格守约束；从 1950 年代中期的 Logic Theorist 与 General Problem Solver，到专家系统，再到今天还活着的知识图谱与规则引擎，都在这条血脉上。",
        "连接主义的赌注正好相反：别手写规则，让单元之间的权重从数据里长出来。它的强项是处理噪声大、维度高、写不成规则的感觉信号（图像、语音、语言的表面分布）；代价是知识无法逐条审计、需要数据与算力、会遗忘、不同任务之间会互相串扰。",
        "感知机的历史位置要说准：Rosenblatt 在 1958 年提出的单层线性阈值单元，到 1962 年前后已经有了收敛性学习定理——它同时也已被证明只能表示线性可分的函数，奇偶校验（异或）这一类它一条都写不出来。这两件事是同一个结论的两面，不是两个发现。",
        "《Perceptrons》（Minsky 与 Papert，1969）常被引用成「证明了神经网络没用」，这个读法是错的。书里的严格结论针对单层结构，异或只是其中一条；另外两条是权重组合的规模爆炸，以及按当时的条件训不动也跑不起。作者对多层网络的态度是「原则上更强，但没人知道怎么有效训练」——那是一个被承认的未解问题，不是死刑判决。",
        "1986 年之后两脉各让了一步：反向传播（Rumelhart–Hinton–Williams 在 1986 年让它普及，更早在 1970 年代中期 Werbos、1980 年代中期 Parker 也已独立给出）把「多层可训」这条路打开，连接主义拿回了梯度这条通道；符号一侧则撞上知识工程之壁——常识、例外与歧义永远写不完，规则一多，冲突检测与检索开销反而爆炸。",
        "今天的系统是合流而不是谁赢了，合流点至少有三处：Transformer 提供可微的表示层，注意力本身就是「按内容检索」的可微近似；束搜索、约束解码与语法掩码是半符号的判决层；程序与工具调用、模式校验与图谱一致性检查是纯符号的判定层。由此有一条很硬的工程结论：让模型自己维护严格一致性（计数、精确算术、状态机、格式合法性）几乎总是输给一个显式的符号检查器。",
        "什么时候会出错：把两脉的能力混在一张榜上测。用同一套题去问「需要从分布内插的判断」和「需要严格执行的规则」，你会得到「模型很行」或「模型不行」的一刀切结论；正确做法是把任务按「近似判断」与「严格遵循」分开打分，再看两类的代价差多少——多数线上事故出在第二类，而第二类恰恰是符号主义的老本行。",
        "衔接：这一节给了你第二把尺子，第一把是上一节的「能力—预期—资金」三角。下一节用这两把尺子回看三个拐点，你会看到每一次拐点其实都是某一脉在关键处补上了对方的短板。"
      ],
      summary_en: [
        "Symbolicism's wager: intelligence is manipulation of explicit symbols. The world is written down in logic, rules, frames and ontologies and an inference engine derives from it. Its strengths are interpretability, item-by-item editability, extreme sample efficiency (a finished rule works forever) and strict constraint adherence; from the Logic Theorist and General Problem Solver of the mid-1950s through expert systems to the knowledge graphs and rule engines still alive today, all sit in this bloodline.",
        "Connectionism bets the opposite way: stop hand-writing rules and let connection weights grow out of data. Its strength is noisy, high-dimensional sensory signal that resists being written as rules (images, speech, the surface distribution of language); the price is knowledge that cannot be audited item by item, hunger for data and compute, forgetting, and cross-talk between tasks.",
        "Get the perceptron's place right: the single-layer linear threshold unit Rosenblatt proposed in 1958 already had a convergence theorem behind it by around 1962 — and it had equally been shown to represent only linearly separable functions, unable to express parity (XOR) at all. These are two faces of one result, not two discoveries.",
        "'Perceptrons' (Minsky and Papert, 1969) is quoted as 'proved neural networks useless', which is a misreading. Its rigorous results concern single-layer structures; XOR is one of them. The other two are the combinatorial explosion of weight configurations and the fact that at the time you could neither train nor run anything bigger. On multi-layer nets the authors said, in effect, 'more powerful in principle, but nobody knows how to train them effectively' — an acknowledged open problem, not a death sentence.",
        "After 1986 each side conceded ground: back-propagation (popularised by Rumelhart, Hinton and Williams in 1986, independently derived earlier by Werbos in the mid-1970s and Parker in the mid-1980s) opened the road to trainable depth and gave connectionism its gradient back; symbolism hit the knowledge-engineering wall — common sense, exceptions and ambiguity are never finished, and past a certain rule count, conflict detection and lookup costs explode.",
        "Today's systems are a merger, not a winner, and the merge happens in at least three places: the Transformer supplies differentiable representation layers, attention itself being a differentiable approximation of content-based lookup; beam search, constrained decoding and grammar masks form a semi-symbolic decision layer; programs and tool calls, schema validation and graph consistency checks form the purely symbolic adjudication layer. Hence one hard engineering rule: asking the model to maintain strict consistency itself (counting, exact arithmetic, state machines, format legality) almost always loses to an explicit symbolic checker.",
        "Where it goes wrong: grading both traditions with one benchmark. Use a single question set for 'judgement that interpolates within a distribution' and 'rules that must be followed exactly' and you get a blanket 'the model is good / bad' verdict. Score the two task families separately and compare their costs — most production incidents sit in the second family, which is precisely symbolism's home turf.",
        "Bridge: this section hands you the second measuring stick; the previous one gave you capability-expectation-funding. Next section applies both to three inflection points, where you will see each one is really a tradition patching the other's weak spot at the decisive moment."
      ],
      code: `X = [(0, 0), (0, 1), (1, 0), (1, 1)]
Y = [0, 1, 1, 0]

# 单层线性阈值单元学异或：这是容量不够，不是训练技巧不行
def train_one_layer(step_count=5000, lr=0.1):
    w = [0.5, -0.5, 0.25]
    for _ in range(step_count):
        for x, y in zip(X, Y):
            z = w[0] * x[0] + w[1] * x[1] + w[2]
            err = y - (1 if z > 0 else 0)
            w = [w[0] + lr * err * x[0], w[1] + lr * err * x[1], w[2] + lr * err]
    pred = [1 if w[0] * a + w[1] * b + w[2] > 0 else 0 for a, b in X]
    return pred

# 异或可以拆成 OR 与 NAND 两个隐藏单元再做一次 AND：一层非线性就够
def xor_with_hidden(a, b):
    or_gate = 1 if 2 * a + 2 * b - 1 > 0 else 0
    nand_gate = 1 if -2 * a - 2 * b + 3 > 0 else 0
    return 1 if 2 * or_gate + 2 * nand_gate - 3 > 0 else 0

one_layer = train_one_layer()
hidden = [xor_with_hidden(a, b) for a, b in X]
print("单层预测", one_layer, "错", sum(1 for i in range(4) if one_layer[i] != Y[i]), "个")
print("含隐藏层", hidden, "错", sum(1 for i in range(4) if hidden[i] != Y[i]), "个")

# 但结论不该写成「神经网络没用」：1969 年卡住的是多层网络没有可用训练法
# 上面这点更新量在今天不到一毫秒，在当年是按小时计的机时——训不起才是关键`,
      pit: "把「单层感知机学不会异或」记成「1969 年证明神经网络不行」，接下来二十年你就会跳过这条线所有的工程积累；反过来只记「1986 年有了反向传播」，又会漏掉它当时并不吃香的原因——多层网络要的是数据规模和并行算力。两种记法都会让你在下一轮范式合流时慢半拍，而慢半拍的代价是选错要投入的那条线。",
      pit_en: "Remembering 'a single-layer perceptron cannot learn XOR' as 'in 1969 neural networks were proven useless' makes you skip twenty years of engineering accumulation on that line; remembering only 'backprop arrived in 1986' hides why it was unfashionable — depth wanted data scale and parallel compute. Either distortion costs you half a cycle at the next merger, and that half cycle is where you bet on the wrong line.",
      ex: {
        q: "为什么知识工程没能靠「再写更多规则」继续扩张？",
        a: "因为最难写的正是例外、常识与歧义，而规则数量上升时冲突检测与检索开销超线性增长，边际收益转负——想扩规模就只能换成从数据里学表示。",
        q_en: "Why could knowledge engineering not keep expanding by simply writing more rules?",
        a_en: "Because the hardest content is exactly exceptions, common sense and ambiguity, while conflict detection and lookup cost grow super-linearly with rule count, so marginal returns go negative — scaling then requires learning representations from data instead."
      }
    },

    /* ===================== agi5-3 ===================== */
    {
      id: "agi5-3",
      title: "三个拐点：DeepBlue/AlphaGo、ImageNet、Transformer",
      title_en: "Three Inflections: DeepBlue/AlphaGo, ImageNet, Transformer",
      min: 13,
      target: "能分别说出三个拐点真正改变的是哪一层（搜索与评估 / 表示学习与数据获取 / 架构与并行度），并写出一条自己核对过的时间线。",
      target_en: "Say which layer each inflection actually changed - search and evaluation, representation learning and data acquisition, architecture and parallelism - and write a timeline you have checked yourself.",
      summary: [
        "1997 年 IBM 的 Deep Blue 在世界冠军赛上取胜，靠的是「暴力搜索 + 人工特征评估 + 专用硬件」：特制 VLSI 芯片配合 alpha-beta 搜索让它每秒能评估上亿个局面，开局库与残局库是大师和工程师手工知识的结晶。它证明的是「在规则完全、状态可判定的封闭博弈里，工程化的搜索可以打赢人类直觉」，而不是「机器学会了下棋」——这两个结论的可迁移范围差了十万八千里。",
        "从 1997 到 2016 年，改变的是评估函数从哪来：围棋的分支因子让穷举失效，AlphaGo 用策略网络缩小候选、用价值网络顶替手工评估，再用自我对弈的强化学习把两者训出来（2016 年 3 月对李世石一役以 4:1 结束，此前 2015 年 10 月它已 5:0 战胜一位欧洲职业棋手；2017 年的后续工作进一步说明不依赖人类棋谱也行）。拐点改的不是「算得更快」，而是「直觉与评估可以被学习」。",
        "2012 年 AlexNet 把 ImageNet 竞赛的前五错误率从上一年约 26% 的量级压到 16% 出头（集成模型约 15%），大家记住的是「深度网络赢了」。但更根本的变化发生在 2009–2010：ImageNet 用众包标注在几年里凑出百万级、上千类别的图像标签，第一次让「数据规模」变成可以用钱和时间买到的东西——在那之前公开视觉数据集体量小、清洗靠专家手工，这才是真瓶颈。",
        "所以 ImageNet 的意义在数据获取方式而不是模型：卷积网络早在 1989–1998 年就用于手写识别（LeNet 一族），反向传播、GPU、dropout 都不新，新的是「有一份大到能让这些老技术不再过拟合的标注数据」。由此得到本节最好用的一把尺子：判断一项进步算不算拐点，就问它松开的是模型、算力还是数据的获取方式——只有被卡住的那一环松开，才会出现台阶式的变化。",
        "2017 年的 Transformer 去掉循环结构，把序列内所有位置的依赖写成一次矩阵乘：形式上是架构变化，历史意义在并行度——训练不再被时间步串行锁住，同一批硬件就能吞下更大批量与更多参数。这笔架构的代价是注意力开销随序列长度平方增长，后来靠分块、稀疏与近似注意力、更长的缓存工程分期偿还；把它记成「因为有了注意力所以有了大模型」是把因果倒过来讲了。",
        "三个拐点叠起来才是今天的形状：搜索与评估（能自动判定对错的任务）→ 表示学习与可买的数据（能标注的任务）→ 架构与并行度（能把参数推到百亿级）。顺序不可交换：没有可学习的评估，就没有「用数据换规则」这条路线；没有并行化的架构，数据与参数都吃不下，只能停在论文里。",
        "可核对的时间线在本节示例里（年份全部手填、只打印相邻间隔，本地就能复核）：1956 达特茅斯、1958 感知机、1966 ALPAC、1969《Perceptrons》、1973 Lighthill、1986 反向传播、1997 Deep Blue、2009/2010 ImageNet、2012 AlexNet、2017 Transformer、2018 ELMo/GPT/BERT、2020 GPT-3。读这张表要防两件事：年份在传播中会被挪近（很多人把 2012 记成「深度学习元年」而忽略 2009 的数据拐点），以及把间隔读成连续进步——1969–1986 与 1993–2009 两段确实慢，慢的原因是资源不是天才。",
        "衔接：血脉与拐点都齐了，下一节讲它们怎样汇成「预训练范式」——为什么从这里开始，「知识放在哪里」比「模型有多大」更值得先问。"
      ],
      summary_en: [
        "IBM's Deep Blue won its 1997 world-championship match on brute search plus hand-crafted evaluation plus custom hardware: specialised VLSI chips feeding alpha-beta search let it evaluate on the order of a hundred million positions a second, while the opening and endgame books were crystallised human expertise. What it proved is that in closed games with complete rules and decidable positions, engineered search can beat human intuition — not that machines had learned to play chess. The two claims differ enormously in transferable range.",
        "Between 1997 and 2016 what changed was where the evaluation function comes from: Go's branching factor makes enumeration hopeless, so AlphaGo used a policy network to narrow candidates, a value network to replace hand-written evaluation, and self-play reinforcement learning to train both (its match against Lee Sedol ended 4-1 in March 2016, after a 5-0 against a European professional in October 2015; follow-up work in 2017 showed human games were not even required). The inflection is not 'computed faster' but 'intuition and evaluation can be learned'.",
        "In 2012 AlexNet cut the top-5 error on the ImageNet challenge from roughly the 26% band of the previous year to just over 16% (about 15% ensembled), and everyone remembers 'the deep network won'. The deeper change happened in 2009-2010: ImageNet used crowdsourced labelling to assemble over a million images across a thousand categories, making 'data scale' something purchasable with money and time for the first time. Before that, public vision datasets were small and expert-curated — that was the real bottleneck.",
        "So ImageNet matters for how data is acquired, not for the model: convolutional networks had already been used on handwriting between 1989 and 1998 (the LeNet family), and back-propagation, GPUs and dropout were all older. What was new was a corpus large enough that these old techniques stopped over-fitting. Hence the most useful ruler in this section: to decide whether an advance counts as an inflection, ask which link it released — model, compute, or the acquisition of data. Only releasing the link that was actually stuck produces a step change.",
        "The 2017 Transformer removed recurrence and wrote all within-sequence dependencies as a single matrix multiply: formally an architecture change, historically a change in parallelism — training was no longer serialised across time steps, so the same hardware could swallow bigger batches and more parameters. The price is attention's quadratic cost in sequence length, repaid in instalments via blocking, sparse and approximate attention, and longer-cache engineering. Retelling it as 'attention therefore big models' inverts the causality.",
        "Only the three stacked together give today's shape: search and evaluation (tasks where correctness is decidable) → representation learning and purchasable data (tasks that can be labelled) → architecture and parallelism (parameters in the tens of billions). The order cannot be shuffled: without a learnable evaluation there is no 'trade data for rules'; without a parallel architecture the data and parameters cannot be ingested at all and stay a paper.",
        "A checkable timeline is in this section's example (years typed by hand, gaps printed, verifiable offline): 1956 Dartmouth, 1958 perceptron, 1966 ALPAC, 1969 Perceptrons, 1973 Lighthill, 1986 back-prop, 1997 Deep Blue, 2009/2010 ImageNet, 2012 AlexNet, 2017 Transformer, 2018 ELMo/GPT/BERT, 2020 GPT-3. Two readings to avoid: years drift closer in retelling (many remember 2012 as year zero of deep learning and forget the 2009 data inflection), and gaps mistaken for continuous progress — 1969-1986 and 1993-2009 really were slow, and the cause was resources, not talent.",
        "Bridge: with both bloodlines and the three inflections in hand, the next section shows how they merged into the pre-training paradigm — and why from there on, 'where knowledge lives' is the better first question than 'how big the model is'."
      ],
      code: `# 事件与年份全部手填在本地：本节只做「间隔」与「松开了哪一环」的归因检查
EVENTS = [
    (1956, "达特茅斯研讨会", "预期"),
    (1958, "感知机提出", "模型"),
    (1966, "ALPAC 报告，机器翻译经费退潮", "资源"),
    (1969, "《Perceptrons》出版", "模型"),
    (1973, "Lighthill 报告，英国经费收缩", "资源"),
    (1986, "反向传播让多层网络可训", "模型"),
    (1997, "Deep Blue 战胜世界冠军", "算力"),
    (2009, "ImageNet 发布，众包标注可用", "数据"),
    (2012, "AlexNet 赢得 ILSVRC", "算力"),
    (2017, "Transformer：序列改成一次矩阵乘", "架构"),
    (2018, "ELMo 与 GPT、BERT：预训练成为默认起点", "模型"),
    (2020, "GPT-3：上下文学习成为接口", "数据"),
]

# 拐点判据：只有松开「当时真正被卡住的那一环」的事件才算拐点，别按名气挑
def show_gaps(events):
    previous = None
    for year, name, link in sorted(events):
        gap = "起点" if previous is None else year - previous
        print(gap, year, "[" + link + "]", name)
        previous = year

# 按「松开了哪一环」分组：同一环反复出现，说明它是长期瓶颈而不是运气
def by_link(events):
    groups = {}
    for year, name, link in events:
        groups.setdefault(link, []).append(str(year) + " " + name)
    return groups

show_gaps(EVENTS)
print()
for link, items in sorted(by_link(EVENTS).items()):
    print(link, len(items), items)`,
      pit: "把三个拐点按年份排成一条上升直线，会让你漏掉它们松开的是不同的环：记成「2012 = 深度学习诞生」，就会以为 2011 年桌上的选项是「换一个更好的模型」，而当时的真实约束是没有大到能让那些老技术不过拟合的标注集。年份错位一次，你对「现在该投什么」的判断就整段错位——因为可选项集合完全变了。",
      pit_en: "Laying the three inflections on one rising straight line hides that each released a different link. Remember '2012 = birth of deep learning' and you will believe the option on the table in 2011 was 'pick a better model', when the actual constraint was the absence of a labelled set big enough to keep those older techniques from over-fitting. Misdate it once and your judgement of what to invest in now is wrong wholesale, because the option set is entirely different.",
      ex: {
        q: "为什么 Deep Blue 的胜利没有直接带来下一轮繁荣？",
        a: "因为它只解决了「规则完全、状态可判定」这一小块任务，而可复制的方法（暴力搜索加人工评估）在好坏无法自动判定的开放任务上直接失效，钱与叙事没能迁移到新战场。",
        q_en: "Why did Deep Blue's win not directly cause the next boom?",
        a_en: "It solved only the slice of tasks with complete rules and decidable positions, and its transferable recipe - brute search plus hand-written evaluation - fails outright where goodness is not automatically decidable, so money and narrative never moved to the new ground."
      }
    },

    /* ===================== agi5-4 ===================== */
    {
      id: "agi5-4",
      title: "预训练范式的确立：从任务专用模型到通用底座",
      title_en: "Pre-training Becomes the Paradigm: From Task Models to a Shared Base",
      min: 13,
      target: "能讲出词向量→ELMo→GPT 的谱系，说清「换一个头」新在哪，以及微调→提示→上下文学习这条接口演化把知识搬到了哪里。",
      target_en: "Trace the lineage word vectors -> ELMo -> GPT, say precisely what 'swap a head' newly offered, and explain where fine-tuning -> prompting -> in-context learning moved knowledge.",
      summary: [
        "在预训练范式之前，默认做法是「一个任务一个模型」：垃圾邮件有垃圾邮件的特征工程与分类器，语音有语音的声学模型，两个任务之间几乎不共享任何东西——共享的只有做这两件事的那个人。这个事实决定了当时的成本结构：每多一个任务，就多一整套「数据 + 特征 + 训练 + 调参」。",
        "词向量（2013 年前后 Mikolov 等人的工作，以及 2014 年的 GloVe）第一次让「共享」变成一件可以买的东西：在一个大语料上花几小时训出一张「词 → 稠密向量」表，下游任务把这张表当输入特征就够了。关键不是省时间，而是它免费附带了几何结构——类比关系能靠向量加减近似对上，说明一部分语义被编码进了距离与方向。",
        "但静态词向量有个改不掉的缺陷：一词多义在向量表里是同一个点，「银行」在「河岸」与「存款」两个句子里坐标一样。ELMo（2018）的答案是把表示从「词的函数」改成「句子的函数」——用双向语言模型按上下文现算每个词的向量，于是同一个词在不同句子里有不同坐标。这一步确立了「表示该由模型在上游任务里自己学」的路线。",
        "GPT 谱系（2018 起）再往前一步：把预训练任务与下游任务彻底解耦，只留一个通用目标（下一词预测），下游要么少量标注 + 一个可训练的输出头，要么完全不动权重。「换一个头就能做下游任务」新在两件事：训练成本从「每任务一次」变成「一次性投入 + 每任务微调」；以及知识真的能在任务之间搬动，于是标注预算可以集中在最难的那一步。",
        "底座化真正改变的是「知识存在哪」这个提问：参数不再是知识的唯一容器，检索库、工具与上下文里的文档都能携带知识。系统设计因此变成一条明确的分工——稳定、无需出处、跨越所有场景的能力放参数里；易变、需要出处的事实放外部存储；眼下这件事正在用的信息放上下文里。这也是 agi2 里检索增强之所以是架构级而不是小技巧的原因。",
        "接口在演化，成本结构跟着一起变：微调（改权重，要标注数据与训练设施）→ 提示工程（不改权重，改的是输入分布，要人把规则写清楚）→ 上下文学习（不改权重也不写规则，只给几个示例；2020 年的 GPT-3 论文正是按示例数量把这种用法分成零样本、单样本与少样本）。同一件人工活儿从「训一个模型」降成「准备一段输入」，新问题的数量下降了，而失败模式换成「示例挑偏了」「分布外」这一类。",
        "什么时候会出错：底座不是万能的，它是「上游训练目标 + 上游数据分布」的函数，两类失效最典型——需要严格约束的场合（精确计数、合法结构、状态机一致性）它会给你近似值；需要出处与时效的场合它会编。还有第三种最阴的：分布外（罕见语言、专业体例、超长输入）时静默退化，掉分幅度比你见过的任何基准都大，而它不会主动告诉你。所以选型第一步是「把任务写成底座擅长的形状」，而不是祈祷它足够大。",
        "衔接：底座化把「做大」变成了可行策略，于是「做到多大、还要多少数据」从一个工程问题升级成一个可测量的争论。下一节的 scaling 与涌现之争就是从这里长出来的。"
      ],
      summary_en: [
        "Before pre-training the default was one model per task: spam had its own feature engineering and classifier, speech had its own acoustic model, and the two shared almost nothing — except the human doing both. That fact set the cost structure: every extra task meant another full round of data, features, training and tuning.",
        "Word vectors (Mikolov and colleagues around 2013, GloVe in 2014) made 'sharing' something you could buy for the first time: train a word-to-dense-vector table on a large corpus for a few hours and downstream tasks just consume it as input features. The point was not the hours saved but the geometry that came free — analogies could be approximated by vector arithmetic, evidence that part of semantics had been encoded in distance and direction.",
        "Static word vectors carry one unforgivable defect: polysemy is a single point in the table, so 'bank' has identical coordinates in 'river bank' and 'savings bank'. ELMo (2018) changed representation from a function of a word to a function of a sentence, computing each word's vector from its context with a bidirectional language model. That step established the route 'representations should be learned by the model itself on an upstream task'.",
        "The GPT lineage (from 2018) took one more step: pre-training and downstream tasks fully decoupled, one generic objective left (next-token prediction), and downstream work either adds a small labelled set plus a trainable output head or touches nothing at all. 'Swap a head and do the next task' was new in two ways: training cost became one large up-front investment plus a per-task fine-tune instead of one full pipeline per task, and knowledge genuinely moved between tasks, so labelling budget could be concentrated on the hardest step.",
        "What base models really changed is the question 'where does knowledge live': parameters are no longer the only container — retrieval stores, tools and documents placed in context all carry knowledge. System design becomes a clean division of labour: stable, source-free, cross-scenario capability goes into parameters; volatile, source-requiring facts go into external storage; information needed for the task at hand goes into context. That is why retrieval augmentation in agi2 is an architectural decision rather than a trick.",
        "The interface evolved and the cost structure followed: fine-tuning (changes weights; needs labels and training infrastructure) → prompt engineering (weights untouched, the input distribution changes, a human must state the rules) → in-context learning (weights untouched and no rules written, just a few examples; the 2020 GPT-3 paper named the regimes by example count: zero-shot, one-shot, few-shot). The same human job dropped from 'train a model' to 'prepare some input', which removes whole classes of problems while replacing them with 'the demonstrations were biased' and 'out of distribution'.",
        "Where it breaks: a base is not general — it is a function of its upstream objective and its upstream data distribution, and three failures are typical. Where strict constraints apply (exact counting, valid structure, state-machine consistency) it hands you an approximation. Where provenance and freshness apply it invents. The third is nastiest: out of distribution (rare languages, specialist register, very long inputs) it degrades silently, dropping further than any benchmark you have watched, and it will not tell you. So step one of selection is rewriting the task into a shape the base is good at, not praying that it is big enough.",
        "Bridge: base models made 'go bigger' a viable strategy, which turned 'how big, how much data' from an engineering detail into a measurable dispute. Next section's scaling and emergence argument grows directly out of that."
      ],
      code: `import math
from collections import Counter

# 底座就是一份与任务无关的冻结表示；这里用字符二元组的哈希向量代替预训练权重
def encode(text, dim=32):
    grams = [text[i:i + 2] for i in range(len(text) - 1)] or [text]
    v = [0.0] * dim
    for g in grams:
        v[(ord(g[0]) * 131 + ord(g[1])) % dim] += 1.0
    norm = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / norm for x in v]

# 输出头：只改这一步，表示完全不动；下面两个任务共用同一份 encode
def fit_head(labeled, dim=32):
    cent = {}
    for label, docs in labeled.items():
        xs = [encode(d, dim) for d in docs]
        cent[label] = [sum(x[k] for x in xs) / len(xs) for k in range(dim)]
    def predict(text):
        v = encode(text, dim)
        return max(cent, key=lambda L: sum(a * b for a, b in zip(v, cent[L])))
    return predict

# 任务一是情感，任务二是语种：结构一模一样，只是各标了两条样例
sent = fit_head({"好评": ["做工好 用着顺手 值得", "很喜欢 效果棒 回购"],
                 "差评": ["坏得快 后悔 浪费钱", "难用 客服差 退了"]})
lang = fit_head({"中文": ["这个东西很好用"], "英文": ["this thing works really great"]})
print(sent("很喜欢 效果棒"), sent("坏得快 后悔"))
print(lang("this thing works really great"), lang("这个东西很好用"))

# 提示式接口：权重与样例都不动，只在输入里加一条规则，行为立刻变
def with_rule(text, banned):
    verdict = sent(text)
    if verdict == "好评" and any(w in text for w in banned):
        return "差评"
    return verdict

print(with_rule("做工好 但坏得快", ["坏得快"]))

# 三种接口的差别在代价，不在能力——这张表才是「底座化」真正新出来的东西
print("接口 改权重 要标注 要训练设施")
print("微调 是 多 是")
print("提示 否 少 否")
print("上下文样例 否 零 否")

# 别忘了底座的上限：分布外它会静默退化，这里换成没见过的写法看它怎么蒙
print(sent("包装破损 但客服处理很快"))`,
      pit: "把「预训练省标注」读成「不需要标注」：微调集与提示模板的分布就是产品的边界。拿一批来源单一、几千条的指令数据微调之后，模型会稳定复现那批数据的偏好与句式，你以为买到的是通用能力，实际买到的是那批数据的形状。上线前把评测集换成真实用户分布，那一次掉分就是这件事在收账。",
      pit_en: "Reading 'pre-training saves labelling' as 'labelling is not needed': the distribution of your fine-tuning set and prompt templates is the product's boundary. Fine-tune on a few thousand single-source instructions and the model reliably reproduces that batch's preferences and phrasing — you thought you bought generality, you bought the shape of that batch. Swap the evaluation set to the real user distribution before launch; the score drop is this bill arriving.",
      ex: {
        q: "为什么「换一个输出头」在 2013 年（静态词向量）和 2018 年（双向预训练）不是同一件事？",
        a: "词向量共享的只是输入特征，表示不再随上下文与任务更新、网络主体仍要重训；上下文化表示让同一层权重按句子现算向量，共享从特征层升级到模型层，迁移才成为默认路径。",
        q_en: "Why is 'swap the output head' not the same act in 2013 (static vectors) and 2018 (bidirectional pre-training)?",
        a_en: "Word vectors share only input features: the representation stops updating with context and task and the network behind it is still retrained. Contextualised representations recompute per sentence from the same weights, so sharing moves from the feature layer to the model layer - which is when transfer becomes the default path."
      }
    },

    /* ===================== agi5-5 ===================== */
    {
      id: "agi5-5",
      title: "scaling 与「涌现」：双方论据与度量陷阱",
      title_en: "Scaling and Emergence: Both Sides and the Metric Traps",
      min: 15,
      target: "能复述两派缩放之争的真正分歧（拟合方式与指标选择），并用本地合成数据亲手复现「幂律结论随拟合口径改变」和「台阶式度量造出伪涌现」。",
      target_en: "Restate the real disagreement between the two scaling camps (fitting design and metric choice) and reproduce locally, from synthetic data, that power-law conclusions move with the fitting recipe and that a stair-step metric manufactures pseudo-emergence.",
      summary: [
        "先把结论分层，否则这场争论三句话就吵丢：损失随参数、数据、算力呈幂律（在跨多个数量级的区间里成立）这一点争议不大；真正在争的是「同样一笔算力预算，该花在更大的模型还是更多的数据上」，以及「下游能力能不能从损失曲线外推出来」。这三层经常被混着引用。",
        "第一派（以 Kaplan 等人 2020 年的工作为代表，下面简称「Kaplan 一派」）给出的分配大致是算力增长时优先加大模型（模型规模随算力的指数在 0.7 量级）。其做法是对每个模型规模各自扫学习率、取该算力点上最好的损失，再对这些「前沿点」整体拟合幂律。",
        "修正派（以 2022 年「等算力最优」一族工作为代表；「Kaplan 与 Schuff 之争」这个简称指的是同一族后续修正工作，按其中一位作者命名）指出的正是拟合设计里的一个混淆：在那种设定下「训得更久」与「模型更大」没有被独立控制，于是最优模型规模被系统性地高估了。改用等算力配对（固定算力，沿曲线扫不同大小）重拟合后，结论变成参数与数据大致同比扩大（各自指数约 0.5），并据此判断当年不少大模型属于「过大而训练不足」。",
        "所以第一层教训是方法论的：幂律的「形状」高度依赖你在什么坐标上、用什么残差、取哪一段区间来拟合。同一批实验，对数空间等权和原始空间最小二乘会给出不同的指数，只用小模型端拟合再外推更是能得出相反的最优分配。这不是哪一派更聪明，而是实验设计会直接决定结论——缩放定律是可拟合的经验关系，不是从第一性原理推出的物理定律。",
        "第二层教训关于指标。有工作（2022 年）记录了一批「涌现能力」：小模型接近零分、大模型突然达标；随后有反驳（2023 年，通常称作「涌现是海市蜃楼」一类论点）指出：跳变很可能来自度量本身的不连续——严格匹配、多步全对才给分这类打分方式会把连续改善切成台阶，换成困惑度、部分得分或校准概率这类平滑指标后，同一批数据的曲线可以变得平滑。",
        "两边都没有「赢」：支持涌现的一方保留着「能力确实不随损失平滑出现」这个经验事实，怀疑涌现的一方则握有「台阶可以由度量造成」这件利器。可操作的结论是把判断标准写清楚——任何「规模到了它自然就会」的主张，都要先回答三件事：用的什么指标、该指标在达标线附近是否连续、小模型端偶尔出现的高分是不是模板巧合。答不出这三件，就当成未证。",
        "幂律的适用边界与失效条件要记牢四条：拟合区间之外不可信（跨三四个数量级外推已经需要极强谨慎）；数据接近耗尽时曲线会撞墙变平，此时再加算力只换来更小的降幅；预训练分布之外的能力（新工具、新语言、超长输入）不由训练侧幂律决定；以及榜单饱和之后，同样的损失改善对应的分数改善趋近于零——不是模型没进步，是尺子的分辨率用完了。",
        "于是「新的算力来源」出现了两条：一条是测试时计算——让模型多想几次、自检、搜索并回退，再用强化学习把这条思考过程本身训好；2024 年前后这类做法被重新证明能买到能力，于是算力从「只花在训练」变成「训练与推理分摊」。另一条是合成数据——让强模型造题、造教材，绕开公开文本的天花板，但它有独立的代价，下一节专门算这笔账。衔接：本节示例用纯本地合成数据画两张图，你亲手把台阶与幂律都做出来之后，再读第 6、7 节会轻松很多。"
      ],
      summary_en: [
        "Separate the claims into layers first, or this argument dissolves in three sentences: that loss follows power laws in parameters, data and compute (over several orders of magnitude) is barely disputed; what is disputed is 'should a fixed compute budget buy a bigger model or more data', and 'can downstream ability be extrapolated from loss'. These three layers get quoted as one.",
        "One camp (Kaplan and colleagues, 2020; call them the Kaplan camp) reported an allocation where compute growth buys model size first, with the model-size exponent in the neighbourhood of 0.7. Their recipe was: for each model size sweep the learning rate, take the best loss at that compute point, then fit a power law across those frontier points.",
        "The correction camp (represented by the 2022 'compute-optimal' family of work; the shorthand 'Kaplan vs Schuff' names this same family of follow-up corrections after one of its later authors) pointed at a confound in exactly that fitting design: under that setup 'trained longer' and 'model is bigger' were not independently controlled, so the optimal model size came out systematically inflated. Refitting with iso-FLOP pairing — fix compute, scan sizes along that curve — gives parameters and data roughly proportional to each other (exponents near 0.5 each), and re-labelled many models of the day as over-sized and under-trained.",
        "So the first lesson is about method: the shape of a power law depends heavily on which coordinates, which residual space and which interval you fit on. The same experiments yield different exponents under equal-weight log-space fitting versus raw-space least squares, and fitting only the small end then extrapolating can flip the optimal allocation outright. Neither camp is cleverer; experimental design decides the conclusion. Scaling laws are fitted empirical relations, not physical laws derived from first principles.",
        "The second lesson is about metrics. One line of work (2022) catalogued 'emergent abilities': near-zero scores for small models, sudden competence for large ones. A rebuttal (2023, the 'emergence is a mirage' style argument) noted the jumps likely come from discontinuous metrics - exact match and all-steps-correct-or-zero scoring slice continuous improvement into stairs; switch to perplexity, partial credit or calibrated probability and the same data can produce a smooth curve.",
        "Neither side 'won': emergence's defenders keep the empirical fact that abilities do not track loss smoothly, while its sceptics hold the sharper tool that stairs can be manufactured by the metric. The usable outcome is a standard of proof: any claim of the form 'at scale it will just work' must first answer three things - which metric, is that metric continuous near the pass line, and are the occasional high scores at the small end template artefacts. No answer, treat the claim as unproven.",
        "Keep the four boundary conditions in mind: extrapolation outside the fitted interval is untrustworthy (three or four orders of magnitude already demands extreme caution); as data runs out the curve hits a wall and flattens, so extra compute buys ever smaller loss; ability outside the pre-training distribution (new tools, new languages, very long inputs) is not governed by training-side power laws; and once a benchmark saturates, the same loss improvement yields a vanishing score gain - the model did improve, the ruler ran out of resolution.",
        "Hence two new sources of compute. One is test-time compute: let the model think several times, self-check, search and back off, then train that thinking process itself with reinforcement learning; work around 2024 showed again that this buys ability, so compute is now split between training and inference. The other is synthetic data — have strong models generate exercises and textbooks to route around the ceiling of public text — which carries its own bill, settled in the next section. Bridge: this section's example plots two figures from purely local synthetic data; once you have built the staircase and the power law yourself, sections 6 and 7 read much faster."
      ],
      code: `import math
import random

# 纯本地合成数据：不联网、不下载数据集，图片写在当前目录
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# 先造一条真实的幂律当作「上帝视角」，再加对数空间噪声当作观测
# 不可约下界设得很高：这正是拟合口径能骗人的地方
ALPHA, COEF, FLOOR = 0.18, 1.40, 0.30

def true_loss(n):
    return FLOOR + COEF * n ** (-ALPHA)

def observe(ns, seed=7):
    rnd = random.Random(seed)
    return [true_loss(n) * math.exp(rnd.gauss(0, 0.012)) for n in ns]

def fit_loglog(ns, ls, subtract_floor=True):
    xs = [math.log(n) for n in ns]
    ys = [math.log(max(l - (FLOOR if subtract_floor else 0.0), 1e-6)) for l in ls]
    k = len(xs)
    sx, sy = sum(xs), sum(ys)
    sxx = sum(x * x for x in xs)
    sxy = sum(x * y for x, y in zip(xs, ys))
    slope = (k * sxy - sx * sy) / (k * sxx - sx * sx)
    return -slope, math.exp((sy - slope * sx) / k)

sizes = [10.0 ** (i / 3.0) for i in range(1, 25)]
loss = observe(sizes)
half = len(sizes) // 2
good_a, good_c = fit_loglog(sizes, loss)
blind_a, blind_c = fit_loglog(sizes, loss, False)
small_a, small_c = fit_loglog(sizes[:half], loss[:half], False)
target = 10.0 ** 8

print("真值 alpha", ALPHA, "三种口径拟合出", round(good_a, 4), round(blind_a, 4), round(small_a, 4))
print("外推到 N=1e8：真实总损失", round(true_loss(target), 4), "不可约下界", FLOOR)
print("全区间且知道下界", round(FLOOR + good_c * target ** (-good_a), 4))
blind = blind_c * target ** (-blind_a)
naive = small_c * target ** (-small_a)
print("全区间但忽略下界", round(blind, 4), "低于下界" if blind < FLOOR else "仍在界上")
print("只用小模型端拟合", round(naive, 4), "低于下界" if naive < FLOOR else "仍在界上")
print("两种口径给出低于不可约下界的数：那不是保守，是不可能")

fig, ax = plt.subplots(figsize=(6, 4))
ax.plot(sizes, loss, "o", label="observed synthetic loss")
ax.plot(sizes, [true_loss(n) for n in sizes], "-", label="true power law")
ax.set_xscale("log")
ax.set_yscale("log")
ax.set_xlabel("parameters N (log scale)")
ax.set_ylabel("loss (log scale)")
ax.legend()
fig.tight_layout()
# 同一批观测，取哪一段拟合就决定外推结论：这是实验设计之争
fig.savefig("powerlaw_fit.png", dpi=120)
plt.close(fig)

# 第二张图：底层能力平滑上升，严格匹配打分却会画出「突然涌现」
STEPS = 8

def all_or_nothing(p):
    return p ** STEPS

probs = [0.30 + 0.02 * i for i in range(26)]
fig2, ax2 = plt.subplots(figsize=(6, 4))
ax2.plot(probs, [all_or_nothing(p) for p in probs], "-", label="all-or-nothing metric")
ax2.plot(probs, probs, "--", label="per-step metric")
ax2.axhline(0.5, color="gray", linewidth=0.8)
ax2.set_xlabel("underlying competence p (smooth)")
ax2.set_ylabel("score")
ax2.legend()
fig2.tight_layout()
# 50% 线只被穿过一次：那个穿过点就是所谓「涌现」出现的地方
fig2.savefig("metric_staircase.png", dpi=120)
plt.close(fig2)

print("严格匹配刚好过半的能力阈值", round(0.5 ** (1.0 / STEPS), 4))
print("同一批数据换成连续指标，台阶就消失了")`,
      pit: "忘了「拟合区间与残差空间」会直接改写结论：在双对数坐标上把小模型端的噪声当成趋势外推，你就能宣布「再大十倍它一定会某能力」——一句此刻无法证伪的话；反过来只在两个数量级内拟合就宣称幂律成立，第三个数量级上的偏离会被写成「涌现」。引用任何缩放定律时先问三句：拟合用了哪一段、残差在哪个空间、验证点离拟合点多远。",
      pit_en: "Forgetting that the fitted interval and residual space rewrite the conclusion: treat small-end noise on log-log axes as a trend and you can announce 'ten times bigger and it will have this ability' - a sentence nobody can falsify today; fit only two orders of magnitude and declare the law holds, and the deviation at the third order becomes an 'emergence'. Whenever you cite a scaling law ask three things: which interval was fitted, in which residual space, and how far the validation points sit from the fit.",
      ex: {
        q: "为什么「等算力配对」比「每个规模各自调到最好」更能决定参数与数据的分配比例？",
        a: "因为损失同时取决于规模与训练量，朴素扫描里两者天然相关；只有把算力钉死、沿等算力曲线扫模型大小，才能真正比较参数与数据谁更值钱，否则「最优模型更大」很可能只是长训练带进来的偏差。",
        q_en: "Why does iso-FLOP pairing decide the parameter/data split better than 'tune each size to its best'?",
        a_en: "Because loss depends on size and training volume at once and the two are correlated in a naive sweep; only by pinning compute and scanning model size along that iso-compute curve can you compare what parameters buy versus data, otherwise 'bigger is optimal' is mostly an artefact of longer training."
      }
    },

    /* ===================== agi5-6 ===================== */
    {
      id: "agi5-6",
      title: "数据、算力、算法：三要素权重的历史变化",
      title_en: "Data, Compute, Algorithms: How Their Weights Shifted",
      min: 14,
      target: "能按时期指出当轮的主导要素，并用本地合成实验说明「配比就是模型」以及合成数据与自我蒸馏要付什么代价。",
      target_en: "Name the leading factor of each era, and use a local synthetic experiment to show that the data mix is the model, and what synthetic data and self-distillation actually cost.",
      summary: [
        "三要素不是并列的铁三角，而是有先后约束的：某一环被卡住时，投在另外两环上的钱几乎全部浪费；而哪一环被松开，那一轮里所有进步看起来就都是它的功劳。这是本节唯一的分析工具，也是它能重复使用的原因——它不问「什么最好」，只问「当时卡在哪」。",
        "算法主导期（约 1950 年代至 1970 年代，以及 1986–1990 年代中期的神经网络内部）：算力小、数据少，唯一还能改的就是方法。这一轮的产出是反向传播、决策树、EM 与支持向量机一族「让当时那点算力多学一点」的技巧；代价是评价被压成「在小数据集上更准」，泛化性只能靠研究者的品味来担保。",
        "算力主导期（约 2007 年起）：GPU 与集群让「同样的方法吃下大得多的数据」成为现实，2012 年的突破里可训的深度、正则技巧与硬件同时到位，但真正抬天花板的是并行度——2017 年之后 Transformer 又把它抬了一次。学术界的分水岭在这里变得非常物质：能不能借到一批卡，直接决定你能问哪一类问题。",
        "数据主导期（约 2014 年至今，2018 年之后尤其明显）：架构开始收敛，优化技巧趋于标准化，剩下真正差异化的是数据——规模、清洗、配比、去重与合成。今天看那些同源基座的各种变体，多数差别来自数据配方与训练时长，而不是结构；这也是为什么「我们换了数据」在近年的技术报告里成了一等公民。",
        "「同样的模型换个数据配比就是另一个模型」不是比喻，而是训练目标的直接后果：最大化似然把模型推向数据的条件分布，配比决定的是每个类别与每种风格的先验。三条可测的后果：稀有类被过采样会抬召回同时推高误报；领域语料占比决定术语正确率；指令与对话数据的风格决定拒答倾向与格式偏好。所以很多场合的「调模型」其实是「调数据」的口头说法。",
        "数据墙是真实存在的约束：公开可用的高质量文本被多方在 2022 年之后估算将在 2020 年代中后期被用尽，靠「再多抓一点公开网页」换性能的路径开始变平。绕开它有三种办法，每一种都要付钱：把同一批数据训更多遍（重复次数的边际收益递减，且过拟合更难查）、提高单位数据的「信息密度」（教科书式整理、去重去噪，贵在人）、以及合成数据。",
        "合成数据与自我蒸馏的代价：由现有模型造训练数据能补上格式与教材，但它会把造它的那个模型的偏差与盲区复制进下一代，而且递归得越深、分布越窄。公开研究里已经观察到递归训练下小模型会在分布尾部塌缩（模型坍缩一族结果，2023–2024），并给出约束：保留真实数据、给合成样本打上可识别标记、用工具与人的产出当外部锚。所以「合成数据更便宜」不等于「合成数据免费」，它省的是采购钱，付的是分布宽度。",
        "算力作为门槛决定谁能参与，这条是政治经济学不是价值观：一轮里如果主导要素是数据或算法，一个小组靠公开语料与新技巧仍能做出有影响力的成果；如果主导要素是算力，「训一个底座」的入场券就从论文变成机房与预算，能提出的问题类型随之收缩。历史上 1970 年代中期「不设方向」的资助被停、1980 年代末神经网络资助退潮，都是同一件事：换的是资源门槛，不是天才的密度。"
      ],
      summary_en: [
        "The three factors are not an equal-sided triangle but a sequence of constraints: while one link is stuck, money poured into the other two is largely wasted, and whichever link finally releases is credited with all the progress. That is this section's only analytical tool and why it keeps working — it never asks 'which is best', only 'what was stuck then'.",
        "The algorithm-led era (roughly the 1950s-1970s, and internally again in neural networks from about 1986): compute and data were scarce, so method was the only free variable. Its output is back-propagation, decision trees, EM and the support-vector-machine family — tricks that squeeze more learning out of the compute available. The cost: evaluation collapsed into 'more accurate on a small dataset', with generalisation guaranteed only by researchers' taste.",
        "The compute-led era (from about 2007): GPUs and clusters made 'the same method on far more data' real; the 2012 breakthrough had trainable depth, regularisation tricks and hardware arriving together, but parallelism was what lifted the ceiling, and after 2017 the Transformer lifted it again. The academic watershed became brutally material: whether you could borrow a rack of cards decided which questions you were allowed to ask.",
        "The data-led era (roughly 2014 onward, unmistakable after 2018): architectures converged and optimisation standardised, so the remaining differentiator is data — volume, cleaning, mixture, deduplication and synthesis. Among today's variants built on shared bases, most differences come from data recipe and training duration rather than structure, which is why 'we changed the data' became a first-class sentence in recent technical reports.",
        "'Same model, different mix, different model' is not a metaphor but a direct consequence of the objective: maximum likelihood pushes the model towards the data's conditional distribution, and the mix sets the prior over every category and every style. Three measurable consequences: oversampling a rare class raises recall and false alarms together; domain share decides terminology accuracy; instruction and dialogue style decides refusal tendency and formatting habits. So in many meetings 'tune the model' is really short for 'tune the data'.",
        "The data wall is a real constraint: several estimates published from 2022 onward put the exhaustion of high-quality public text in the mid-to-late 2020s, and the 'crawl a bit more of the web' route to performance is flattening. Three ways around it, each with its own price: train the same corpus more epochs (diminishing returns, and over-fitting gets harder to spot), raise information density per token (textbook-style curation, dedup and denoising - you pay in people), or synthesise data.",
        "The bill for synthetic data and self-distillation: having current models generate training data buys format and pedagogy, but it copies the generating model's biases and blind spots into the next generation, and the deeper the recursion the narrower the distribution. Public work has observed collapse in the tails under recursive training of small models (the model-collapse results of 2023-2024) and prescribes constraints: keep genuine data, mark synthetic samples as such, and use tools plus human output as external anchors. 'Synthetic data is cheaper' is not 'synthetic data is free': it saves procurement money and pays out in distribution width.",
        "Compute as a gate decides who may play, and that is a matter of political economy, not of values: when the leading factor is data or algorithm, a small group with public corpora and one new trick can still produce influential work; when it is compute, entry to 'train a base model' stops being a paper and becomes a machine room and a budget, and the set of questions one may ask narrows accordingly. The withdrawal of direction-free university grants in the mid-1970s and of neural-network grants in the late 1980s are the same event: the resource gate changed, not the density of talent."
      ],
      code: `import math
import random

# 同一套模型代码，只换数据配比，边界行为就变了
TOPICS = {
    "硬件评测": ["电池", "续航", "散热", "性能", "屏幕", "风扇"],
    "咖啡": ["烘焙", "产区", "风味", "萃取", "水温", "甜感"],
    "编程": ["编译", "内存", "指针", "延迟", "接口", "并发"],
}
# 配比 A 把量给硬件，配比 B 把量给咖啡：结构、算法、超参完全一样
MIX_A = {"硬件评测": 0.80, "咖啡": 0.10, "编程": 0.10}
MIX_B = {"硬件评测": 0.10, "咖啡": 0.80, "编程": 0.10}

def make_corpus(mix, total=600, words_per_doc=4, seed=3):
    rnd = random.Random(seed)
    docs = []
    for topic, weight in mix.items():
        for _ in range(int(total * weight)):
            words = [rnd.choice(TOPICS[topic]) for _ in range(words_per_doc)]
            docs.append((" ".join(words), topic))
    return docs

def train_nb(docs, alpha=1.0):
    vocab = sorted({w for doc, _ in docs for w in doc.split()})
    prior, like = {}, {}
    for topic in TOPICS:
        sub = [doc for doc, lab in docs if lab == topic]
        prior[topic] = (len(sub) + 1.0) / (len(docs) + len(TOPICS))
        for w in vocab:
            hit = sum(1 for doc in sub if w in doc.split())
            like[(topic, w)] = (hit + alpha) / (4.0 * len(sub) + alpha * len(vocab))
    return prior, like

def predict(model, text):
    prior, like = model
    best, best_score = None, None
    for topic in TOPICS:
        s = math.log(prior[topic])
        for w in text.split():
            if (topic, w) in like:
                s += math.log(like[(topic, w)])
        if best_score is None or s > best_score:
            best, best_score = topic, s
    return best

for name, mix in (("配比A", MIX_A), ("配比B", MIX_B)):
    model = train_nb(make_corpus(mix))
    coffee = predict(model, "产区 风味 萃取")
    coding = predict(model, "内存 并发 延迟")
    # 两边都答得对明确查询，只在跨界查询上分开：差的不是能力，是先验
    mixed = predict(model, "续航 水温")
    print(name, "纯咖啡词", coffee, "纯编程词", coding, "跨界词", mixed)

# 自我蒸馏的一维类比：每代只从前一代的估计里采样，规模越小缩得越快
rnd = random.Random(11)
sigma, replicates, sample_size = 1.0, 400, 6
for gen in range(8):
    est = []
    for _ in range(replicates):
        sample = [rnd.gauss(0.0, sigma) for _ in range(sample_size)]
        mean = sum(sample) / len(sample)
        var = sum((x - mean) ** 2 for x in sample) / (len(sample) - 1)
        est.append(math.sqrt(var))
    sigma = sum(est) / len(est)
    print("第", gen, "代 sigma", round(sigma, 4), "同规模单次估计的不确定度", round(math.sqrt(sum((e - sigma) ** 2 for e in est) / len(est)), 4))

# 真实的模型坍缩发生在词分布的尾部，这里只是它的一维骨架`,
      pit: "报「我们用了两万亿 token」而不报来源占比、去重比例与每份数据的重复次数：别人既复现不了你的分数，也预判不了你会错在哪。评测里那三个点的涨跌很可能只是某一类语料在配比里翻了一倍，而你在技术报告里把它写成「模型变聪明了」——下一轮迭代就会照着这条假因果去加钱。",
      pit_en: "Reporting 'we used two trillion tokens' without source shares, dedup ratio and epoch count per subset: nobody can reproduce your score or predict where you will be wrong. A three-point swing is quite often one corpus doubling inside the mix, and writing it up as 'the model got smarter' guarantees the next round of spending follows that fake cause.",
      ex: {
        q: "为什么「数据是新时代的护城河」这句话在 2018 年前后才成立？",
        a: "因为更早的瓶颈在别处：当时的模型规模与算力吃不下那么多数据，先赢的是方法；等架构与算力把瓶颈推到数据一侧，同一批数据才第一次变成能换成分数的稀缺资源。",
        q_en: "Why did 'data is the new moat' only become true around 2018?",
        a_en: "Because the bottleneck sat elsewhere before then: model size and compute could not digest that much data, so method won first. Only once architecture and compute pushed the constraint onto data did the same corpus become a scarce resource convertible into score."
      }
    },

    /* ===================== agi5-7 ===================== */
    {
      id: "agi5-7",
      title: "基准的演化与污染：GLUE→MMLU→长任务与 Agent",
      title_en: "Benchmarks Age and Leak: GLUE to MMLU to Long Tasks and Agents",
      min: 14,
      target: "能说出基准饱和的机制、污染的两类检测方法各自的漏检面，并写下一份可操作的「该换榜单了」判据。",
      target_en: "Explain why benchmarks saturate, what each family of contamination tests misses, and write an actionable test for 'it is time to replace this leaderboard'.",
      summary: [
        "基准的存在理由是把比较成本压下来，它的宿命是被优化掉：一套固定题目一旦公开，就同时变成社区的事实上的分配函数——训练数据、模型选型与论文叙事都朝它靠拢，于是分数上涨不再等价于能力提升。这就是 Goodhart 定律在机器学习里的具体形态，也是为什么「饱和」不是好消息而是警报。",
        "饱和有四种可识别的形态，任缺一样都别急着说「题太难」：头部方法的分数挤在一两个点内（分辨率丢了）、错误集中在同一批题上（难度信息丢了）、多次运行之间的方差与模型间差距同量级（噪声吃掉了信号）、以及人类基线被追平（天花板没了）。这四条里任意两条同时成立，就该换尺子，而不是换更贵的模型。",
        "演化路线可以当成时间轴背下来：GLUE（2018）把十几个自然语言小任务收进一张榜；难度更高的 SuperGLUE（2019）随后接棒；到 2020–2021 年这批「单句判别」任务被预训练模型集体刷穿，社区转向覆盖面更广的选择题式知识评测 MMLU（2020 年底提出、2021 年正式发表，五十多个学科、上万道题），以及代码与数学（HumanEval 2021、GSM8K 与 MATH 2021）。注意每一步换的不是「更好的题」，而是「还没被优化到的那种能力」。",
        "为什么一次性榜单不能当路线图：榜单只回答「在这些题上谁高」，而路线图需要回答「下一步能不能做成更多种类的事」。把榜单当前沿，会系统性低估三样东西——长链条任务的失败率、与工具和环境交互的复杂度、以及真实用户分布上错误的代价。MMLU 的高分与「能不能连续完成三十步任务」无关，这不是模型的缺陷，而是题型的定义决定的：它本来就是单选题。",
        "污染要分两类查：显性重叠（测试题原文或其改写进了训练语料）与隐性泄漏（同源衍生数据、统计口径泄漏、标注者重合、或题目本身就是从模型输出改写的）。检测方法有三条，各自有漏检面：n-gram 或子串重叠扫描与 minhash 找近似重复（便宜，但对深度改写和翻译会漏）、成员归属探针（前缀补全、逐词概率异常、「请背诵这段」类提示，能抓记忆但会误伤正常高频短语）、以及时间切片评测（只用在模型数据截止日期之后才出现的题，最干净但样本少、且难保证新题质量）。成熟做法是三条一起上并公布各自阈值。",
        "长任务与 Agent 时代必须换成过程与结果双轨：结果侧看端到端完成率与可验证产物（跑通的测试、改对的文件、算对的数值），过程侧看轨迹——步数、工具调用合法率、无效重试占比、终止原因分布、预算有没有被超。这里有个必须记住的现象叫「跑分不同源」：同一个模型换一套脚手架（提示、检索、并行、重试次数、失败回退策略）分数可以差出几十个点，因此两个数字不可比的原因可能根本不是模型，而是外壳。",
        "多解与不可复现要一起处理，否则你的报告只是好看：Agent 任务常有多个合法解，精确匹配会把对的判成错的；温度与采样让轨迹不唯一，所以必须报「k 次运行的分布」（首次通过率与多次尝试的覆盖率是两条不同的曲线，对应线上成本完全不同），并固定随机种子、外部版本与工具清单。只给一个数不给方差与预算，等于提出了一个不可证伪的断言。",
        "可操作的「换掉榜单」判据是五条，写不出五条就说明你只是换了一张更贵的旧榜：新题面能被现有方法稳定推动（不饱和）；失败样本可归因（能读出它为什么错，而不是只看到一个 0）；任务时长与真实工作量成比例（不是把三十分钟的事拆成三十道单选题）；至少有一个外部锚（人工对照、可验证产物或公开成本口径）；以及公布污染检查结果与去重口径。这一节也是 agi4 里红队与灰度那套判定逻辑在评测侧的对应物。"
      ],
      summary_en: [
        "A benchmark exists to make comparison cheap and is destined to be optimised away: once a fixed question set is public it doubles as the community's de facto allocation function - training data, model selection and paper narratives all steer towards it - so a rising score stops implying rising capability. That is Goodhart's law in its machine-learning form, and the reason 'saturated' is an alarm rather than good news.",
        "Saturation has four recognizable shapes, and none of them means 'these tasks are just hard': the leading methods crowd within one or two points (resolution gone), errors concentrate on the same items (difficulty information gone), run-to-run variance is the same order as the between-model gap (noise eating the signal), and the human baseline has been caught (ceiling gone). Any two of the four and you should change the ruler, not buy dearer models.",
        "The lineage is worth memorising as a timeline: GLUE (2018) folded a dozen small NLP tasks into one leaderboard; SuperGLUE (2019) raised the bar; through 2020-2021 that whole family of single-sentence discrimination tasks was swept by pre-trained models, and the field moved to broad multiple-choice knowledge coverage with MMLU (proposed late 2020, published 2021; fifty-plus subjects, tens of thousands of items) and to code and maths (HumanEval 2021, GSM8K and MATH 2021). Each step swapped in the capability that had not yet been optimised, not merely 'tougher questions'.",
        "Why a one-off leaderboard cannot serve as a roadmap: it answers 'who scores higher on these items', while a roadmap needs 'can we now do more kinds of things'. Treating leaderboards as the frontier systematically underestimates three things - failure rates on long-horizon tasks, the complexity of interacting with tools and environments, and the cost of errors on the real user distribution. A high MMLU score says nothing about completing thirty consecutive steps, and that is not a model defect: the format was single-choice by construction.",
        "Contamination comes in two kinds and needs two searches: overt overlap (test items or their rewrites present in the training corpus) and covert leakage (derived data, shared statistical pipelines, overlapping annotators, or items themselves rewritten from model output). Three detectors exist, each with a blind spot: n-gram and substring scans plus minhash catch near-duplicates (cheap, but miss deep paraphrase and translation); membership probes - prefix completion, per-token probability anomalies, 'recite this passage' prompts - catch memorisation but misfire on common phrases; time-slice evaluation uses only items appearing after the model's data cutoff, which is cleanest but scarce and hard to keep high quality. Mature reports run all three and publish each threshold.",
        "Long tasks and Agents require double-track scoring: on the outcome side, end-to-end completion rate and verifiable artefacts (tests that pass, files correctly edited, numbers that check out); on the process side, the trajectory - step count, share of legitimate tool calls, share of useless retries, distribution of stop reasons, budget compliance. Remember the non-comparable-scores effect: the same model inside a different scaffold (prompting, retrieval, parallelism, retry count, fallback policy) can differ by tens of points, so two numbers may be incomparable for reasons that have nothing to do with the model.",
        "Handle multiplicity and irreproducibility together or your report is only decoration: agent tasks often have many valid solutions, so exact match marks correct runs wrong; temperature and sampling make trajectories non-unique, so report the distribution over k runs - first-attempt pass rate and multi-attempt coverage are two different curves with very different online costs - and pin seeds, external versions and the tool inventory. A single number with no variance and no budget is an unfalsifiable claim.",
        "The operational test for 'replace this benchmark' is five criteria; fail any of them and you have bought a pricier version of the old leaderboard: the new items can still be moved by current methods (unsaturated); failures are attributable (you can read why it went wrong, not just see a zero); task duration scales with real work (thirty minutes of work is not chopped into thirty single-choice items); at least one external anchor exists (human baseline, verifiable artefact, or a published cost accounting); and contamination results and deduplication policy are disclosed. This section is the evaluation-side twin of the red-team and canary judgement calls in agi4."
      ],
      code: `import hashlib

# 训练语料与「未公开」的测试题全部手填在本地，不联网
TRAIN = [
    "The capital of France sits on the Seine and has the Louvre.",
    "A binary tree with n leaves has at most two to the n distinct shapes.",
    "Photosynthesis converts light energy into chemical energy inside the leaf.",
    "Roughly one third of children outgrow peanut allergies by adulthood.",
]
TEST = [
    ("t1", "The capital of France sits on the Seine and has the Louvre."),
    ("t2", "Which city on the Seine is the capital of France?"),
    ("t3", "Photosynthesis turns light energy into chemical energy inside leaves."),
    ("t4", "How many nodes does a balanced tree need to store a string?"),
]

def digest(text):
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:12]

def grams(text, k=4):
    words = "".join(c if c.isalnum() else " " for c in text.lower()).split()
    return {tuple(words[i:i + k]) for i in range(max(1, len(words) - k + 1))}

def jaccard(a, b):
    return len(a & b) / len(a | b) if (a | b) else 0.0

train_exact = {digest(c) for c in TRAIN}
train_grams = [grams(c) for c in TRAIN]

for tid, question in TEST:
    # 整串哈希只抓得出一字不改的拷贝，改写与换序全部漏检
    copied = digest(question) in train_exact
    # 近似重叠用 n-gram 的 Jaccard：阈值必须连同命中率一起公布
    best = max((jaccard(grams(question), g) for g in train_grams), default=0.0)
    flag = "疑似污染" if (copied or best >= 0.2) else "通过"
    print(tid, "整串命中", copied, "最佳重叠", round(best, 3), flag)

print("注意 t2：它是训练句的同义改写，却判为通过——这就是重叠法的漏检面")

# 跑分不同源：模型能力没变，只是换了脚手架，两个数字就不可比
def scaffold_score(competence, attempts, tool_error_rate):
    single = max(0.0, competence - 0.4 * tool_error_rate)
    multi = 1.0 - (1.0 - single) ** attempts
    return round(single, 3), round(multi, 3)

for attempts in (1, 4):
    print("允许尝试", attempts, "pass@1 与 pass@", scaffold_score(0.60, attempts, 0.10))

# 换掉榜单的五条判据：任何一条不过，就只是换了个更贵的旧榜单
def benchmark_ready(head_gap, errors_readable, work_proportional, human_anchor, dedup_reported):
    return {
        "unsaturated": head_gap > 0.03,
        "attributable": errors_readable,
        "proportional": work_proportional,
        "has_anchor": human_anchor,
        "dedup_reported": dedup_reported,
    }

print(benchmark_ready(0.01, True, True, False, False))`,
      pit: "忘了近似重复这一层就宣布「我们的训练集不含测试题」：整串哈希只能抓一字不改的拷贝，改写、翻译、同题干的另一版本全都漏过去。要写的是 n-gram 或 minhash 级别的重叠报告，连阈值与命中率一起公布，并附上模型的数据截止日期——否则任何人拿一份 8-gram 统计就能把你的结论推翻，而你连反驳的数字都拿不出来。",
      pit_en: "Declaring 'our training set contains no test items' without an approximate-duplicate pass: whole-string hashes only catch verbatim copies, so paraphrases, translations and alternate renderings of the same stem all slip through. Publish an n-gram or minhash overlap report with its threshold and hit rate plus the model's data cutoff, or anyone with an 8-gram script can overturn your claim and you will have no number to answer with.",
      ex: {
        q: "为什么把榜单分数写进路线图之前，必须先问「它的失败样本能不能读」？",
        a: "因为不能归因的分数只支持排序、不支持决策：你无法判断下一步该改数据、改架构还是改工具接口，团队只能靠加算力碰运气，投入与能力之间的因果链就断了。",
        q_en: "Why must you ask 'can I read its failures?' before putting a leaderboard into a roadmap?",
        a_en: "A score whose failures cannot be attributed supports ranking but not deciding: you cannot tell whether the next change belongs to data, architecture or the tool interface, so the team falls back on adding compute and hoping, which severs the causal chain between spending and capability."
      }
    },

    /* ===================== agi5-8 ===================== */
    {
      id: "agi5-8",
      title: "综合重构：把发展路线画成一张因果图",
      title_en: "Synthesis: Redraw the Whole Road as One Causal Graph",
      min: 15,
      target: "能亲手产出一张「技术—资源—预期—评测」四栏因果图与一份可证伪的复盘清单，并说清这一章能预测什么、不能预测什么。",
      target_en: "Produce a four-column causal graph of technology, resources, expectations and evaluation plus a falsifiable retrospective checklist, and state plainly what this chapter can and cannot predict.",
      summary: [
        "本章前七节的推理可以压成一张四栏表：技术（可微分层、注意力、自我对弈、检索接口）、资源（资助线与里程碑、算力可得性、数据的获取方式）、预期（提案与报告、公司承诺、媒体放大）、评测（可判定的任务与榜单）。任何一次兴衰，若不能在四栏里各指到至少一个节点，你的解释就是不完整的——这一条同时是本节的评分标准。",
        "画边比画点重要，而一条可用的边必须写清机制与时间：不要写「Transformer 带来了大模型」，要写「去掉循环 → 序列内可并行 → 同样硬件能吞更大批量 → 2018 年起预训练成为默认起点」。写得出的边才有反例，写不出的边是修辞；修辞不会错，所以也不会告你任何状。",
        "图中必须有且只有一条反馈回路：预期抬高 → 资金到位 → 能力上涨 → 交付超预期 → 预期进一步抬高。同一回路也解释了冬天：一旦能力增速跟不上预期锚点（锚是上一轮最响的那句承诺），落差被公开识破，资金按里程碑收紧，而资源收缩又压低能力增速。正反馈与崩塌共用一条边集，只是符号相反——这也是为什么「只有多头与空头」的叙事永远说不清这段历史。",
        "复盘清单的前半（每轮繁荣的触发条件）：新的数据获取方式出现了吗？新的并行度或可租的算力出现了吗？有一个可判定的任务被公开成了基准吗？出现了一个能被采购的中间形态吗（专家系统、云 API、订阅）？资助方开始按里程碑批钱了吗？这五条里至少中三条，繁荣才有物质基础；一条不中而热度很高，通常意味着叙事跑在了资源前面。",
        "清单的后半（证伪信号，用来识别退潮）：论文增速远超可复现的结果；同一批任务被反复重新定义成「真正的难点」；预算集中流向「能讲清交付口径的整合型项目」而不是新方法；榜单头部差距小于多次运行的随机波动；以及企业侧的措辞从能力叙事换成投资回报。这几条同时亮灯时，接下来发生的多半是资金事件，不是技术事件——而资金事件是可以提前减仓的。",
        "这一章能预测什么、不能预测什么：能说的是「单一要素叙事一定会翻车」——只讲算力、只讲数据、只讲架构的路线在历史上都错过下一轮，因为瓶颈总会换位置；不能说的是拐点什么时候来。回看本节示例的时间线，1986 到 2012 之间的那段间隔，没有任何一次公开预测命中过。把这两件事分清楚，就是这章的毕业标准：拥有判断结构而不是预测勇气。",
        "常见翻车点自查（每条都能回指到本章某一节）：把寒冬说成技术死亡（第 1 节）；把 Minsky–Papert 读成「神经网络被判死刑」（第 2 节）；把 ImageNet 记成模型进步（第 3 节）；把 scaling 当定律而不是拟合（第 5 节）；把数据配比当免费的调参（第 6 节）；用一次性榜单当路线图（第 7 节）；以及把某个机构的当前强弱当成路线判断——本章刻意不给这类结论，因为它换不来任何可证伪的东西。",
        "去向：这一章只回答「它是怎么走到今天的」。接下来的 agi6 处理另一个问题——「我们凭什么说它到了」：AGI 的判据怎么定、能力与风险怎么测、以及各方争论里证据强度分别如何。请把这张因果图带过去，因为每一次关于「快到了」的争论，本质上都是这条回路又转了一圈；而你已经知道该先问哪一栏。"
      ],
      summary_en: [
        "The reasoning of this chapter's seven sections compresses into a four-column table: technology (differentiable layers, attention, self-play, retrieval interfaces), resources (grant lines and milestones, compute availability, how data is acquired), expectations (proposals and reports, corporate promises, press amplification), and evaluation (decidable tasks and leaderboards). If a rise or a fall cannot point to at least one node in each column, your explanation is incomplete - that is also this section's grading rubric.",
        "Edges matter more than nodes, and a usable edge states mechanism and date: do not write 'the Transformer brought big models', write 'recurrence removed → sequences parallelise → the same hardware swallows bigger batches → from 2018 pre-training becomes the default starting point'. An edge specific enough to have a counter-example can be wrong, and only wrong things inform you; rhetoric cannot be wrong, so it tells you nothing.",
        "The graph must contain exactly one feedback loop: expectations rise → funding arrives → capability rises → delivery beats expectations → expectations rise again. The same loop explains winters: once capability growth falls below the expectation anchor (the loudest promise of the last round), the gap gets publicly exposed, funding tightens to milestones, and resource contraction then suppresses capability growth. Boom and bust share an edge set with opposite signs - which is why 'bulls versus bears' narratives can never tell this history straight.",
        "First half of the retrospective checklist (triggers of a boom): did a new way of acquiring data appear? A new level of parallelism or rentable compute? Was some decidable task published as a benchmark? Did a purchasable intermediate form appear (expert systems, cloud APIs, subscriptions)? Did funders start paying against milestones? Booms need at least three of these five; high heat with none of them means narrative has run ahead of resources.",
        "Second half (falsification signals that a retreat is near): paper output outrunning reproducible results; the same cluster of tasks repeatedly redefined as 'the real hard part'; budgets concentrating on integration projects with a clear deliverable rather than on new methods; the spread at the top of a leaderboard smaller than run-to-run noise; and corporate language switching from capability talk to return on investment. When several light up together, what follows is a funding event rather than a technical one - and funding events can be read early.",
        "What this chapter can and cannot predict: it can tell you that single-factor narratives always fail - routes that talk only about compute, or only about data, or only about architecture have missed the next round every time, because the bottleneck moves; it cannot tell you when the next inflection lands. Look back at the timeline in this section's example: nobody publicly hit the gap between 1986 and 2012. Holding that distinction - judgement structure rather than predictive nerve - is this chapter's graduation bar.",
        "Common failure points for self-check, each pointing back at a section: calling a winter a death of technology (section 1); reading Minsky-Papert as 'neural networks sentenced to death' (section 2); remembering ImageNet as a model advance (section 3); treating scaling as a law rather than a fit (section 5); treating the data mix as free tuning (section 6); using a one-off leaderboard as a roadmap (section 7); and mistaking some lab's current standing for a judgement about the route - this chapter deliberately refuses such conclusions, since they buy you nothing falsifiable.",
        "Where next: this chapter only answered 'how did we get here'. agi6 takes up a different question - 'on what grounds would we say it has arrived': how to define the AGI criterion, how capability and risk get measured, and how strong each side's evidence actually is. Carry this causal graph with you, because every argument about 'we are close' is that loop turning once more, and you now know which column to interrogate first."
      ],
      code: `# 四栏因果图：技术 / 资源 / 预期 / 评测；边必须写机制，空机制判为无效
NODES = {
    "dartmouth": ("预期", 1956),
    "lighthill": ("预期", 1973),
    "expert_market": ("预期", 1985),
    "darpa": ("资源", 1972),
    "gpu": ("资源", 2007),
    "crowd": ("资源", 2009),
    "symbol": ("技术", 1980),
    "backprop": ("技术", 1986),
    "alexnet": ("技术", 2012),
    "transformer": ("技术", 2017),
    "ilsvrc": ("评测", 2010),
    "glue": ("评测", 2018),
    "agent_eval": ("评测", 2023),
}
EDGES = [
    ("dartmouth", "darpa", "把智能写成可攻克的课题，资助方据此设立方向"),
    ("darpa", "symbol", "钱按推理与搜索批下来，符号方法攒出可用工程"),
    ("symbol", "expert_market", "产生式规则加推理机第一次变成能开采购单的东西"),
    ("expert_market", "dartmouth", "交付兑现把承诺的口径抬高，回路在此闭合"),
    ("lighthill", "darpa", "公开清算让未兑现变成可追责，资金按里程碑收紧"),
    ("gpu", "alexnet", "能租到的并行算力让同样的网络第一次吃下百万张图"),
    ("crowd", "ilsvrc", "众包标注使百万级标签可买，竞赛题面才成立"),
    ("ilsvrc", "alexnet", "固定的公开题面把改进变成可比较的分数"),
    ("backprop", "alexnet", "多层可训练的通路早已铺好，等的只是数据与算力"),
    ("alexnet", "transformer", "表示学习被证明划算，架构开始为规模化让路"),
    ("transformer", "glue", "同一底座能接多个任务，基准才可能一次覆盖多项"),
    ("glue", "agent_eval", "短任务基准饱和，评测被迫转向过程与长链条"),
]

# 检查一：四栏每栏至少两个节点，缺栏说明你的解释偏科了
def column_report(nodes):
    counts = {}
    for col, _ in nodes.values():
        counts[col] = counts.get(col, 0) + 1
    return counts, all(v >= 2 for v in counts.values())

# 检查二：有且只有一条反馈回路，多于一条往往意味着循环论证
def find_cycles(nodes, edges):
    adj = {n: [b for a, b, _ in edges if a == n] for n in nodes}
    found = set()

    def walk(start, node, path, seen):
        for nxt in adj[node]:
            if nxt == start and len(path) > 1:
                found.add(frozenset(path))
            elif nxt not in seen and nxt > start:
                walk(start, nxt, path + [nxt], seen | {nxt})

    for name in sorted(nodes):
        walk(name, name, [name], {name})
    return [sorted(c) for c in found]

# 检查三：机制太短的边等同于没写，把它挑出来而不是留着自我安慰
def unexplained(edges, min_len=12):
    return [(a, b) for a, b, m in edges if len(m) < min_len]

counts, ok = column_report(NODES)
print("分栏", counts, "四栏齐备" if ok else "有栏缺节点")
print("反馈回路", find_cycles(NODES, EDGES))
print("缺机制的边", unexplained(EDGES))

# 反转条件：同一条回路，当能力增速低于预期锚点时就倒着走
def reversed_loop(capability_growth, expectation_anchor):
    return capability_growth < expectation_anchor

print("是否处于反转段", reversed_loop(0.03, 0.05))

# 导出成纯文本的 dot 源：不装任何画图工具也读得懂，画图只是可选步骤
with open("roadmap.dot", "w", encoding="utf-8") as f:
    f.write("digraph roadmap {\\n")
    for a, b, m in EDGES:
        f.write('  "' + a + '" -> "' + b + '" [label="' + m + '"];\\n')
    f.write("}\\n")
print("已写出 roadmap.dot：它是一份文本，不是图片依赖")`,
      pit: "把因果图画成一条从左到右的进步长链：每个节点都指向前一个、没有回路也没有反例。这样的图永远正确也永远没用——它不能告诉你哪条边该被删，因此也不会因下一次意外而更新。画完必须做两个动作：找出唯一的回路，并给两条边各写一句「哪年哪件事没发生我就删它」。",
      pit_en: "Drawing the causal graph as one left-to-right chain of progress, every node pointing at the next, no loop and no counter-example. Such a graph is always right and always useless - it never says which edge to delete, so it also never updates when reality surprises you. Two moves are mandatory when you finish: locate the single feedback loop, and write for two edges exactly 'if this event in this year had not happened, I delete this edge'.",
      ex: {
        q: "为什么这张图坚持把「评测」单列成一栏，而不是并到技术里？",
        a: "因为榜单一旦发布就反过来塑造了研究议程——它决定什么算进步、什么值得做资助，属于独立的因果源；并进技术栏，你会把「尺子换了」误读成「能力跳了一级」。",
        q_en: "Why keep 'evaluation' as its own column instead of folding it into technology?",
        a_en: "Because a published leaderboard shapes the research agenda from the outside - it decides what counts as progress and what is fundable - making it an independent causal source; fold it into technology and you will misread 'the ruler changed' as 'capability jumped a level'."
      }
    }
      ],

      /* ---------- 本章题库：2 选择 + 1 判断 + 1 填空 ---------- */
      quiz: [
        {
          q: "关于历次「AI 寒冬」，下面哪种说法最站得住？",
          o: [
            "寒冬期间论文与学位中断，研究活动整体停摆",
            "被抽走的是特定资助线与采购预算：能力是慢变量，预期与资金是快变量",
            "寒冬由某一份批评报告单独造成，与早年的技术承诺无关",
            "寒冬说明当时那条技术路线已被彻底证伪"
          ],
          a: 1,
          why: "两次公认寒冬（约 1974–1980、约 1987–1993）里研究并未中断，收缩的是按里程碑批钱的资助线（ALPAC、Lighthill、DARPA 口径变化）与专家系统的采购预算。触发器是承诺与交付之间的落差，所以它首先是预期问题。",
          q_en: "Which statement about the historical AI winters holds up best?",
          o_en: [
            "Publications and degrees stopped; research halted as a whole",
            "What got pulled were specific grant lines and purchase budgets: capability is the slow variable, expectation and money the fast ones",
            "A single critical report caused it, independent of earlier technical promises",
            "They proved the technical route of the day had been falsified"
          ],
          why_en: "Research continued through both accepted winters (circa 1974-1980 and 1987-1993); what shrank were milestone-driven grant lines (ALPAC, Lighthill, DARPA policy) and expert-system purchase budgets. The trigger was the gap between promise and delivery, so it is an expectations event first."
        },
        {
          q: "Kaplan 一派与 2022 年之后「等算力最优」一族工作的分歧，主要落在哪里？",
          o: [
            "损失是否随算力呈幂律关系",
            "固定算力预算下参数与数据如何分配，以及拟合时是否把两者独立控制",
            "大模型是否具备任何涌现能力",
            "一阶优化方法是否比二阶方法更省算力"
          ],
          a: 1,
          why: "幂律本身争议不大。分歧在实验设计：早期拟合里训练时长与模型规模没有被独立控制，最优规模因此被高估；等算力配对重拟合后，参数与数据大致同比扩大。指标是否连续属于「涌现」之争，不是这一场。",
          q_en: "Where does the disagreement between the Kaplan camp and the post-2022 compute-optimal family of work mainly sit?",
          o_en: [
            "Whether loss follows a power law in compute",
            "How to split a fixed compute budget between parameters and data, and whether the fit controls the two independently",
            "Whether large models have any emergent abilities at all",
            "Whether first-order optimisers save compute over second-order ones"
          ],
          why_en: "The power law itself is not in doubt. The dispute is experimental design: in the earlier fit, training duration and model size were not independently controlled, which inflated the optimal size; refitting along iso-compute curves makes parameters and data grow roughly in proportion. Metric continuity belongs to the emergence debate, not this one."
        },
        {
          q: "判断题：把《Perceptrons》（1969）记成「证明了神经网络没有用」，是准确的历史表述。",
          type: "judge",
          a: 1,
          why: "不准确。书里的严格结论只针对单层线性阈值结构，异或只是其中一条；对多层网络作者的表态是「原则上更强但不知如何有效训练」，再加上当时算力与数据规模的根本门槛。把它读成死刑判决，会抹掉后面二十年这条线的工程积累。",
          q_en: "True or false: recording 'Perceptrons' (1969) as having proved neural networks useless is an accurate statement of history.",
          why_en: "Not accurate. Its rigorous results concern single-layer linear threshold structures, with parity being only one of them; on multi-layer nets the authors said, in effect, more powerful in principle but no known way to train them effectively - on top of hard compute and data limits at the time. Reading it as a death sentence erases twenty years of engineering accumulation on that line."
        },
        {
          q: "ImageNet 之所以被本章算作拐点，关键不在模型，而在于＿＿＿＿的获取方式变了：众包标注让百万级标签第一次可以用钱和时间买到。",
          type: "fill",
          ans: ["数据", "标注数据", "标签数据", "训练数据", "data"],
          why: "卷积网络、反向传播、GPU、dropout 在 2012 年之前都已存在，真正新的是「大到能让这些老技术不过拟合」的标注集。判断拐点要问它松开了哪一环：模型、算力，还是数据的获取方式。",
          q_en: "ImageNet counts as an inflection here not because of the model but because the acquisition of _____ changed: crowdsourcing made a million labels purchasable with money and time for the first time.",
          why_en: "Convolution, back-propagation, GPUs and dropout all predated 2012; what was new was a labelled set big enough that those older techniques stopped over-fitting. The inflection test is which link got released: model, compute, or how data is acquired."
        }
      ]
    }
  ],

  /* ---------- 名词：6 条（已对 base-terms.txt 与本目录其它 agi-deepen-*.js 查重） ---------- */
  terms: [
    { term: "技术寒冬", term_en: "AI Winter", cat: "基础概念",
      short: "指资助与采购预算收缩的周期，而不是研究中断的事件。",
      short_en: "A cycle of shrinking grants and purchase budgets, not a period when research stopped.",
      detail: ["两次公认的寒冬约在 1974–1980 与 1987–1993，触发点分别是公开清算（ALPAC、Lighthill、资助口径转向）与产品维护成本失控。", "有没有「第三次」仍是争议话题；判断寒冬要看资助线是否按里程碑收紧，用论文数量判断会得出相反的结论。"],
      detail_en: ["The two accepted winters sit around 1974-1980 and 1987-1993, triggered by public reckonings (ALPAC, Lighthill, grant policy) and by runaway maintenance cost respectively.", "Whether a third one exists is still argued; diagnose a winter by whether grant lines tightened against milestones, since paper counts point the other way."],
      vs: "技术寒冬说的是资源与预期收缩，范式更替说的是方法被替换。",
      vs_en: "An AI winter is about resources and expectations contracting; a paradigm shift is about methods being replaced." },
    { term: "符号主义", term_en: "Symbolicism", cat: "基础概念",
      short: "把智能理解为对显式符号与规则的操作，知识由人手写、引擎负责推导。",
      short_en: "Intelligence as manipulation of explicit symbols and rules: humans write the knowledge, an engine derives.",
      detail: ["强项是可解释、可逐条编辑、样本效率极高，以及能严格遵守约束——这些正是今天约束解码与校验器还在承担的职责。", "失效在知识工程之壁：例外、常识与歧义写不完，规则一多，冲突与检索开销超线性上升。"],
      detail_en: ["Its strengths are interpretability, item-by-item editability, extreme sample efficiency and strict constraint adherence - the same jobs today's constrained decoding and validators still hold.", "It fails at the knowledge-engineering wall: exceptions, common sense and ambiguity are never finished, and past a certain rule count conflict and lookup costs rise super-linearly."],
      vs: "符号主义手写知识并用引擎推导，连接主义从数据里学权重。",
      vs_en: "Symbolicism hand-writes knowledge and derives; connectionism learns weights from data." },
    { term: "连接主义", term_en: "Connectionism", cat: "基础概念",
      short: "让单元间的连接权重从数据中长出，擅长写不成规则的感知信号。",
      short_en: "Connection weights grown from data; strong on sensory signal that resists being written as rules.",
      detail: ["代价是知识不可逐条审计、依赖数据与算力、会遗忘且任务间互相串扰。", "1969 年的批评只封住单层结构；多层可训要等到反向传播普及，而普及之后仍要等算力与数据到位。"],
      detail_en: ["The price: knowledge that cannot be audited item by item, dependence on data and compute, forgetting and cross-talk between tasks.", "The 1969 critique closed only the single-layer case; trainable depth waited on back-propagation becoming standard, and then still on compute and data arriving."],
      vs: "连接主义学的是分布，符号主义维护的是一致性。",
      vs_en: "Connectionism learns a distribution; symbolism maintains consistency." },
    { term: "专家系统", term_en: "Expert System", cat: "基础概念",
      short: "产生式规则加推理机，1980 年代把 AI 第一次变成能开采购单的产品。",
      short_en: "Production rules plus an inference engine; the first AI a company could raise a purchase order for, in the 1980s.",
      detail: ["它的衰落不是规则写错了，而是成本结构坏了：库要专家长期维护、几乎不可跨部门复用，边际成本不降。", "它留下的经验是「能采购」比「能演示」更接近繁荣的成因——繁荣需要一个能卖的中间形态。"],
      detail_en: ["Its collapse was not wrong rules but a broken cost structure: the base needed expert upkeep, barely transferred between departments, and its marginal cost never fell.", "The lesson it leaves is that 'purchasable' beats 'demo-able' as a cause of booms - a boom needs an intermediate form that can be sold."],
      vs: "专家系统卖的是人写知识的交付，底座模型卖的是从数据学出的表示。",
      vs_en: "Expert systems sold hand-written knowledge as a deliverable; base models sell representations learned from data." },
    { term: "涌现能力", term_en: "Emergent Ability", cat: "评测与安全",
      short: "小模型近零分、大模型突然达标的现象，可能部分来自度量不连续。",
      short_en: "Near-zero scores for small models jumping to competence for large ones - partly an artefact of discontinuous metrics.",
      detail: ["支持方的证据是能力确实不随损失平滑出现；怀疑方的证据是换成困惑度或部分得分后台阶可被抹平。", "操作上：主张「规模到了自然就会」之前必须说清指标是什么、在达标线附近是否连续、小模型端的高分是否模板巧合。"],
      detail_en: ["Defenders note abilities genuinely do not track loss smoothly; sceptics show the stairs flatten under perplexity or partial-credit metrics.", "Operationally, before claiming 'scale will bring it', state the metric, whether it is continuous near the pass line, and whether small-end scores are template artefacts."],
      vs: "涌现能力描述分数形状，缩放定律描述损失形状，两者不互相证明。",
      vs_en: "Emergence describes the shape of scores, scaling laws the shape of loss; neither proves the other." },
    { term: "基准饱和", term_en: "Benchmark Saturation", cat: "评测与安全",
      short: "头部方法挤在一两分之内、错误集中在同批题，分数不再承载能力信息。",
      short_en: "Leading methods crowd within a point or two and errors concentrate on the same items, so scores stop carrying capability information.",
      detail: ["四种形态：分辨率丢失、难度丢失、噪声与模型间差距同量级、人类基线被追平——任意两条同时成立就该换尺子。", "换榜的判据是五条：可推动、失败可读、时长与真实工作量成比例、有外部锚、公布污染检查与去重口径。"],
      detail_en: ["Four shapes: lost resolution, lost difficulty, noise the size of the between-model gap, and the human baseline caught; any two at once mean change the ruler.", "The replacement test has five parts: still movable, failures readable, duration proportional to real work, at least one external anchor, contamination and dedup policy disclosed."],
      vs: "基准饱和是尺子失效，能力退步是模型变差，需要的证据完全不同。",
      vs_en: "Saturation is the ruler failing, regression is the model worsening; the evidence each needs is entirely different." }
  ],

  achievements: [
    { id: "agi_roadmapper", icon: "🧭", name: "路线制图师", name_en: "Road Mapper",
      desc: "完成 agi5 · AGI 发展路线与范式更替 全部课节",
      desc_en: "Finish every lesson of agi5, The Road to AGI: Paradigms and Disputes",
      check: ["agi5"] }
  ],

  /* ---------- 代码注释英文映射：覆盖上面 8 段 code 里全部含中文的注释行 ---------- */
  codeComments: {
    "玩具模型：能力是慢变量，承诺与预算是快变量": "Toy model: capability is the slow variable, promises and budgets the fast ones",
    "模型里没有任何「技术突然退步」的参数，周期照样出现": "The model has no 'technology suddenly regressed' parameter, yet the cycle still appears",
    "三个量都做了归一化，只为看形状，不要拿它做任何预测": "All three quantities are normalised to show the shape only; do not use it to predict anything",
    "预算推能力，饱和上界写在式子里：越往后越难推动": "Budget drives capability, with a saturation ceiling built in: the later it gets, the harder to move",
    "落差就是承诺比交付多出来的那部分": "The gap is exactly the part where the promise exceeds the delivery",
    "落差被识破，塌下去的是预算而不是能力": "Once the gap is seen through, it is the budget that collapses, not the capability",
    "有钱的时候才敢把话说大：预期跟着预算走": "Big talk only happens while the money flows: expectations track the budget",
    "读法：只看预算那一列的翻转点，那一次翻转就是所谓「寒冬」": "How to read it: watch the flip points in the budget column - each flip is what gets called a winter",
    "单层线性阈值单元学异或：这是容量不够，不是训练技巧不行": "A single-layer linear threshold unit on XOR: a capacity limit, not a training-trick problem",
    "异或可以拆成 OR 与 NAND 两个隐藏单元再做一次 AND：一层非线性就够": "XOR decomposes into OR and NAND hidden units plus one AND: a single non-linear layer suffices",
    "但结论不该写成「神经网络没用」：1969 年卡住的是多层网络没有可用训练法": "But the conclusion is not 'networks are useless': in 1969 depth was blocked by the lack of a usable training rule",
    "上面这点更新量在今天不到一毫秒，在当年是按小时计的机时——训不起才是关键": "These updates take under a millisecond today and hours of machine time back then - unaffordable training was the barrier",
    "事件与年份全部手填在本地：本节只做「间隔」与「松开了哪一环」的归因检查": "Events and years typed in by hand, locally: this only checks the gaps and which link got released",
    "拐点判据：只有松开「当时真正被卡住的那一环」的事件才算拐点，别按名气挑": "Inflection test: only events that released the link actually stuck at the time count - do not rank by fame",
    "按「松开了哪一环」分组：同一环反复出现，说明它是长期瓶颈而不是运气": "Group by which link was released: one link recurring marks it as the long-term bottleneck, not luck",
    "底座就是一份与任务无关的冻结表示；这里用字符二元组的哈希向量代替预训练权重": "A base is a frozen, task-agnostic representation; character-bigram hashing stands in for pre-trained weights here",
    "输出头：只改这一步，表示完全不动；下面两个任务共用同一份 encode": "Output head: only this step changes, the representation stays fixed; both tasks below share one encode",
    "任务一是情感，任务二是语种：结构一模一样，只是各标了两条样例": "Task one is sentiment, task two is language: identical structure, just two labelled examples each",
    "提示式接口：权重与样例都不动，只在输入里加一条规则，行为立刻变": "Prompt-style interface: no weights and no examples move, yet one rule added to the input changes behaviour at once",
    "三种接口的差别在代价，不在能力——这张表才是「底座化」真正新出来的东西": "The three interfaces differ in cost, not in capability - this table is what basing actually introduced",
    "别忘了底座的上限：分布外它会静默退化，这里换成没见过的写法看它怎么蒙": "Do not forget the base's ceiling: out of distribution it degrades silently - try an unseen phrasing and watch it guess",
    "纯本地合成数据：不联网、不下载数据集，图片写在当前目录": "Purely local synthetic data: no network, no dataset download, images written to the current directory",
    "先造一条真实的幂律当作「上帝视角」，再加对数空间噪声当作观测": "Build a true power law as the god's-eye view, then add log-space noise as the observations",
    "不可约下界设得很高：这正是拟合口径能骗人的地方": "The irreducible floor is set deliberately high: that is exactly where a fitting recipe can deceive you",
    "同一批观测，取哪一段拟合就决定外推结论：这是实验设计之争": "Same observations, different fitted interval, different extrapolation - this is the experimental-design dispute",
    "第二张图：底层能力平滑上升，严格匹配打分却会画出「突然涌现」": "Second figure: underlying competence rises smoothly, yet exact-match scoring draws a sudden emergence",
    "50% 线只被穿过一次：那个穿过点就是所谓「涌现」出现的地方": "The 50% line is crossed exactly once, and that crossing is where 'emergence' is said to happen",
    "同一套模型代码，只换数据配比，边界行为就变了": "Identical model code; change only the data mix and the boundary behaviour changes",
    "配比 A 把量给硬件，配比 B 把量给咖啡：结构、算法、超参完全一样": "Mix A spends its budget on hardware reviews, mix B on coffee: same structure, algorithm and hyper-parameters",
    "两边都答得对明确查询，只在跨界查询上分开：差的不是能力，是先验": "Both get the unambiguous queries right and split only on the cross-domain one: the difference is the prior, not the capability",
    "自我蒸馏的一维类比：每代只从前一代的估计里采样，规模越小缩得越快": "A one-dimensional analogy for self-distillation: each generation samples from the last estimate; smaller samples shrink faster",
    "真实的模型坍缩发生在词分布的尾部，这里只是它的一维骨架": "Real model collapse happens in the tails of the word distribution; this is only its one-dimensional skeleton",
    "训练语料与「未公开」的测试题全部手填在本地，不联网": "Training corpus and 'unseen' test items are typed in locally; nothing is fetched",
    "整串哈希只抓得出一字不改的拷贝，改写与换序全部漏检": "Whole-string hashing only catches verbatim copies; paraphrase and reordering slip through",
    "近似重叠用 n-gram 的 Jaccard：阈值必须连同命中率一起公布": "Near-duplicates via n-gram Jaccard: publish the threshold together with the hit rate",
    "跑分不同源：模型能力没变，只是换了脚手架，两个数字就不可比": "Non-comparable scores: model capability unchanged, but a different scaffold makes the two numbers incomparable",
    "换掉榜单的五条判据：任何一条不过，就只是换了个更贵的旧榜单": "Five criteria for replacing a leaderboard: fail any one and you merely bought a dearer version of the old one",
    "四栏因果图：技术 / 资源 / 预期 / 评测；边必须写机制，空机制判为无效": "Four-column causal graph: technology / resources / expectations / evaluation; every edge needs a mechanism or it is void",
    "检查一：四栏每栏至少两个节点，缺栏说明你的解释偏科了": "Check one: at least two nodes per column; a missing column means your explanation is lopsided",
    "检查二：有且只有一条反馈回路，多于一条往往意味着循环论证": "Check two: exactly one feedback loop; more than one usually means circular reasoning",
    "检查三：机制太短的边等同于没写，把它挑出来而不是留着自我安慰": "Check three: an edge with a stubby mechanism equals an unwritten one - flag it instead of keeping it",
    "反转条件：同一条回路，当能力增速低于预期锚点时就倒着走": "Reversal condition: the same loop runs backwards once capability growth falls below the expectation anchor",
    "导出成纯文本的 dot 源：不装任何画图工具也读得懂，画图只是可选步骤": "Export as plain-text dot source: readable without any graphing tool; drawing it is optional"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_AGI5);
