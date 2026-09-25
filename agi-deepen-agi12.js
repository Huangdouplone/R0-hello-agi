/* ================================================================
 * R0:hello agi · 课程深化层 ⑨（agi1 强化学习 / agi2 大语言模型 LLM）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「强化学习」与「大语言模型」两章从每节 3 要点深化到 6~8 要点。这两章是
 *       本站的知识终点，所以要点不再解释名词，而是落在「决策与代价」：建模错了算法
 *       救不回来、RLHF 的奖励从哪来、稳定性机制为什么必需、跑分为何不可信，以及
 *       prompt / RAG / 微调的选型顺序与成本、延迟、评测口径怎么算账。
 * 写法约定：
 *   1) 既有课节不写 title —— 合并时自动沿用主数据标题；
 *   2) 新增课节（agi1-6 / agi2-6）写齐 title / title_en / target / target_en 并进 order；
 *   3) code 里的中文注释一律单独成行，并全部登记到 codeComments；
 *   4) 不给外部链接、不做「哪家模型更强」这类推荐。
 * ================================================================ */

const DEEPEN_AGI12 = {
  stages: ["agi1", "agi2"],

  order: {
    agi1: ["agi1-1", "agi1-2", "agi1-3", "agi1-4", "agi1-5", "agi1-6"],
    agi2: ["agi2-1", "agi2-2", "agi2-3", "agi2-4", "agi2-5", "agi2-6"]
  },

  lessons: {

    /* ===================== agi1 强化学习 ===================== */
    "agi1-1": {
      min: 12,
      summary: [
        "强化学习的框架是智能体在环境中感知状态、选出动作、拿到奖励；这套里算法大多是现成的，真正的难点是把问题切成「状态 / 动作 / 奖励」：状态漏掉关键信息，再新的算法也学不出好策略。",
        "状态要尽量满足马尔可夫性——当前状态足以预测下一步。只喂「最近一帧画面」学不会牌类游戏，因为历史不在状态里；补历史要么拼进观测，要么靠序列模型或记忆。",
        "动作空间的粒度直接决定难度：把「走路」拆成关节力矩会难到学不出来，拆成「左/右」又丢掉控制精度。先粗后细、先离散后连续，是能让项目活下去的顺序。",
        "奖励是你写给优化器的目标，它只会照字面执行：把「把杯子放到桌上」写成「离桌子越近越好」，智能体就会贴着桌边原地转圈刷分——reward hacking 不是故障，是精确执行。",
        "稀疏奖励（只在终点给分）让学习信号近乎为零，于是引入奖励塑造给中间分数；但塑造的每一项都是可被利用的漏洞，学习速度和目标被钻空子的风险同时上升。",
        "它与监督学习的根本差别在于：没有现成标签，只有你自己试出来的那一条轨迹的回报，而且数据分布随策略改变——这就是强化学习样本昂贵、复现困难的来源。",
        "优化的是长期累计回报而不是单步奖励，这条差别会一路带到 agi1-2 的值函数与折扣因子；本章前置是整段深度学习与机器学习：dl1 的梯度优化一路到 dl5 的 Transformer，加上 ml3 的评估口径——强化学习只是把「损失」换成了「奖励」。"
      ],
      summary_en: [
        "The frame is an agent perceiving state, choosing an action and collecting reward inside an environment; the algorithms are mostly off the shelf, so the hard part is cutting the problem into state / action / reward. Miss key information in the state and no fresh algorithm recovers it.",
        "The state should be near-Markovian: enough to predict the next step. A single frame cannot teach a card game because the history is not in the observation — append history or use a sequence model or memory.",
        "Action granularity sets the difficulty: joint torques for 'walk' may never be learned, while 'left/right' throws away control precision. Coarse then fine, discrete then continuous, is what keeps projects alive.",
        "Reward is the objective you hand to an optimiser and it obeys the letter: write 'get close to the table' instead of 'put the cup on the table' and the agent spins in place by its edge. Reward hacking is exact execution, not a defect.",
        "Sparse reward (points only at the finish) leaves almost no learning signal, so shaping adds intermediate score — and every shaped term is a loophole. Speed and exposure to exploitation rise together.",
        "The real difference from supervised learning: there are no labels, only the return of the single trajectory you happened to take, and the data distribution moves with the policy — hence expensive samples and hard reproduction.",
        "What is optimised is the long-run cumulative return, not the immediate reward; that thread continues into the value function and discount factor of agi1-2. Prerequisites here: gradient optimisation from dl1 and evaluation discipline from ml3."
      ],
      code: `# 同一个任务，三种建模决定三种难度：状态、动作、奖励
# 1) 状态漏信息：只有一帧画面，学不到「红灯已经亮了三次」
obs = camera_frame()

# 2) 动作先粗后细：离散三档足够跑通，再考虑连续力矩
actions = ["left", "straight", "right", "brake"]

# 3) 奖励只写目标，不写过程
# 写「靠近就加分」，原地来回走也能拿高分——这就是被钻空子
reward = -abs(distance_to_goal)
# 终点分稀疏但真实，中间分是塑造出来的，要单独记账以便回退
bonus = 10.0 if reached_goal else 0.0

# 4) 回报要折扣累加，否则「十年后到」与「一秒后到」等价
total = 0.0
for r in reversed(episode_rewards):
    total = 0.99 * total + r`,
      pit: "把「效果差」当成算法问题去换算法：九成情况其实是建模失误——奖励里混进了与目标无关的代理项（步数惩罚太大，智能体干脆一动不动），或状态里根本没有它需要的信息。先做个自检：一个人照着这个奖励函数做事，能不能拿到高分？",
      pit_en: "Reacting to weak results by swapping algorithms: nine times out of ten the fault is modelling — a proxy term in the reward (a step penalty so large the agent just freezes) or information missing from the state. Run one check first: could a human earning this reward actually do the job?",
      ex: {
        q: "为什么「换个更强的强化学习算法」经常解决不了问题？",
        a: "瓶颈通常在状态、动作、奖励的建模上：状态缺信息或奖励偏离真实目标时，任何算法只会更精确地优化那个错的目标。",
        q_en: "Why does 'use a stronger RL algorithm' often fail to fix the problem?",
        a_en: "The bottleneck is usually the state/action/reward modelling: with missing state information or a reward that drifts from the real goal, a better algorithm just optimises the wrong target more precisely."
      }
    },

    "agi1-2": {
      min: 12,
      summary: [
        "值函数 V(s) 回答「从这个状态出发，以后平均能拿到多少折扣回报」——它把「好不好」从单步奖励抬到长期，是强化学习能看远眼的机制。",
        "Q(s,a) 比 V 多问一层：在当前状态先执行某个动作、之后再谈未来。有了 Q 就能贪心地挑动作，不必显式保存策略，这也是 Q-learning 名字的含义。",
        "贝尔曼方程是一个递归的一致性条件：当前值 = 即时奖励 + γ × 后继状态的值。它把全局问题拆成局部方程，动态规划、TD 学习、Q-learning 全都从它派生。",
        "γ 不是调参细节而是价值观：γ=0 彻底短视（只做眼前最优），γ→1 极长远，但回报方差变大、信用分配变难，且在不停机的环境里 γ=1 会让回报发散。",
        "求解有两条路：学值函数再从中导出策略（值函数方法），或直接把策略参数化（策略梯度）。前者实现简单、样本可复用，后者天生支持随机策略与连续动作。",
        "值函数方法一旦遇到「动作空间巨大或连续」就会退化成每一步都要做一次内层优化（argmax 算不动），这正是机器人、大动作空间游戏里策略梯度更常见的真实原因。",
        "还有一个容易被忽略的代价：V/Q 学到的是期望。回报分布是双峰时（要么全对要么全崩），期望值落在两峰之间，对决策毫无指导意义——这是分布值方法出现的原因。"
      ],
      summary_en: [
        "V(s) answers 'from this state, how much discounted return do I expect on average' — it lifts 'is this good' from one step to the long run, which is exactly how RL manages to see ahead.",
        "Q(s,a) asks one level more: take this action here, then talk about the future. With Q you can act greedily without storing a policy separately — that is the whole name Q-learning.",
        "The Bellman equation is a recursive consistency condition: current value = immediate reward + gamma times the value of the successor. It turns a global problem into local equations, and dynamic programming, TD and Q-learning all descend from it.",
        "gamma is a value system, not a knob: 0 means pure myopia, values near 1 mean real far-sightedness but larger variance, harder credit assignment, and in non-terminating settings gamma = 1 makes the return diverge.",
        "Two solution routes: learn a value function and derive a policy from it, or parameterise the policy directly. The first is simpler and reuses samples; the second natively supports stochastic policies and continuous actions.",
        "Value methods degrade once the action space is huge or continuous — every step needs an inner optimisation because argmax is unaffordable. That, not fashion, is why policy gradients dominate robotics and large action spaces.",
        "One quiet cost: V and Q learn expectations. When the return distribution is bimodal (either everything works or nothing does), the expectation sits between the peaks and guides no decision — the reason distributional value methods exist."
      ],
      code: `# 贝尔曼一致性：当前值 = 即时奖励 + 折扣 * 后继状态的值
gamma = 0.95
V = {s: 0.0 for s in states}

# 值迭代：反复套用同一行更新，直到几乎不再变化
for it in range(1000):
    delta = 0.0
    for s in states:
        best = max(r + gamma * V[s2] for r, s2 in backup[s])
        delta = max(delta, abs(best - V[s]))
        V[s] = best
    if delta < 1e-6:
        break

# 有了 Q 就能直接贪心动作，不必另外保存策略
def act(s):
    return max(actions, key=lambda a: Q[(s, a)])

# 动作是连续的时候，上面这行 max 根本算不出来
# 这就是要换成策略梯度（agi1-4）的时刻`,
      pit: "γ 在长任务上直接抄默认值 0.99：视野只有几步的环境里它让回报几乎不衰减、更新收敛极慢；反过来 γ=0.5 会让智能体短视到宁可放弃终点。粗略估算：想往前看 N 步，γ 取 1 - 1/N 起步，再做扫描。",
      pit_en: "Copying gamma = 0.99 onto a long task blindly: in an environment with a few steps of visibility it makes returns barely decay and convergence crawl; gamma = 0.5 makes the agent abandon the goal entirely. Rule of thumb: to look about N steps ahead start near 1 - 1/N, then sweep.",
      ex: {
        q: "什么情况下宁可用 Q(s,a) 而不是 V(s)？",
        a: "当你希望在状态里直接挑动作、并且想用「贪心下一步」构造学习目标（off-policy）时，Q 免去显式模型与内层规划；只需要评估固定策略时 V 更省。",
        q_en: "When should you prefer Q(s,a) over V(s)?",
        a_en: "When you want to pick actions straight from a state and build the target with a greedy next step (off-policy) — Q removes the need for a model or inner planning. To just evaluate a fixed policy, V is cheaper."
      }
    },

    "agi1-3": {
      min: 13,
      summary: [
        "Q-learning 的学习目标用「贪心下一步」，而实际走出来的动作可能带着探索——学的与做的不是同一个策略，这就是 off-policy，也是它能从任意历史日志里学习的原因。",
        "on/off-policy 的取舍是真实的代价交换：SARSA 同策略、学自己真正执行的行为，稳但保守；Q-learning 离策略、直接逼近最优，容易过估计但能复用别人或旧策略的数据。",
        "把神经网络直接塞进 Q-learning 会立刻训崩，病因有两个：同批样本来自连续轨迹、高度相关，破坏 SGD 的独立性假设；目标值由同一个网络算出，参数一动目标就追上来。经验回放治第一个，目标网络治第二个——治好这两个病，才谈得上从 Atari 像素到机器人控制的端到端学习。",
        "经验回放把历史存起来随机采样，顺带留下重要性权重的接口；缓冲区多大、按什么优先级采样，决定「新策略还能不能从旧经验里学到东西」——太旧的策略数据其实是有毒的。",
        "目标网络的本质是把右端的值函数冻结一段时间，让自举更新有个不动的靶子；软更新（每步按 τ 混合）更平稳但跟踪慢，硬同步简单但会跳变。",
        "探索与利用是这套框架的另一半：ε-greedy 简单可用，但 ε 衰减到多少、什么时候彻底关掉，在稀疏奖励和「必须先踩陷阱才学得到」的环境里直接决定成败。",
        "DQN 的遗产问题别忘：对最优值的过估计（Double DQN 专治此项）、只吃离散动作、对超参和随机种子极度敏感——所以「跑一次的分」在这里毫无意义，评测协议见 agi1-6。"
      ],
      summary_en: [
        "Q-learning builds its target from the greedy next step while the action actually taken may be exploratory — learning and acting follow different policies. That is off-policy, and it is why any old log can still teach something.",
        "The on/off-policy trade is a real exchange of costs: SARSA is on-policy, learns what it actually does, stable but cautious; Q-learning is off-policy, aims straight at optimal, over-estimates but reuses other people's or older data.",
        "Drop a network straight into Q-learning and training collapses for two reasons: samples from consecutive steps are strongly correlated, breaking SGD's independence assumption; and the target is produced by the same network, so it chases you. Replay fixes the first, a target network the second — only with both cured does end-to-end learning from Atari pixels to robot control become possible.",
        "Replay stores history and samples it at random, leaving a hook for importance weights. How big the buffer is and what you prioritise decides whether a fresh policy can still learn from stale experience — very old on-policy data is genuinely toxic.",
        "A target network freezes the right-hand side for a while, giving the bootstrapped update a stationary mark to aim at. Soft updates (blend by tau each step) are smoother but lag; hard syncs are simple but jump.",
        "Exploration versus exploitation is the other half of the frame: epsilon-greedy works, but how far it decays and when you switch it off entirely decides success in sparse-reward or trap-must-be-hit environments.",
        "Do not forget DQN's inherited issues: over-estimation of the optimal value (what Double DQN targets), discrete actions only, and extreme sensitivity to hyper-parameters and seeds — so a single run's score means nothing; see agi1-6 for the protocol."
      ],
      code: `# DQN 一步更新：只有当前网络吃梯度，目标网络是不动的靶子
# 1) 采样必须随机：连续轨迹之间高度相关，直接喂会训崩
batch = replay.sample(batch_size)

# 2) TD 目标：episode 结束处没有未来值
# 忘了 done 掩码，等于把两条无关的轨迹接成一条
with torch.no_grad():
    next_q = target_net(batch.next_obs).max(1).values
    y = batch.reward + gamma * next_q * (1 - batch.done)

# 3) 让当前网络的 Q 去拟合这个目标
loss = torch.nn.functional.smooth_l1_loss(
    net(batch.obs).gather(1, batch.action), y)

# 4) 隔一段时间同步目标网络（或者每步软更新 tau）
if step % target_sync == 0:
    target_net.load_state_dict(net.state_dict())

# 5) 探索：ε 要衰减，且别在训练末期彻底归零
epsilon = max(0.05, 1.0 - step / 1e6)`,
      pit: "忘了 no_grad()（或对目标做 detach），目标网络也进了计算图：梯度同时追两端，训练立刻发散且 loss 曲线看起来「就是不稳」。同类隐蔽错误还有 done 掩码写错——终止后的 next_obs 属于下一条轨迹，不屏蔽就会把成功值串进失败结局里。",
      pit_en: "Forgetting no_grad() (or detaching the target) pulls the target network into the graph: gradients chase both ends at once, training diverges, and the loss curve just looks 'unstable'. Its cousin is a wrong done mask — the next_obs after termination belongs to another episode, and without the mask you leak value from a fresh run into a finished one.",
      ex: {
        q: "为什么经验回放和目标网络缺一不可？",
        a: "它们治两种不同的病：回放解决样本相关性（违反 SGD 独立性），目标网络解决自举追尾（目标随被更新的参数一起动）。只上一个，另一个不稳定因素照样让训练崩。",
        q_en: "Why are replay and a target network both necessary?",
        a_en: "They cure different diseases: replay breaks sample correlation (which violates SGD's independence), the target network stops the bootstrapped target from chasing itself. With only one in place the other still wrecks training."
      }
    },

    "agi1-4": {
      min: 13,
      summary: [
        "策略梯度直接对策略求导：好动作提概率、坏动作降概率。它不需要值函数也能跑，代价是必须把整条轨迹走完才知道好坏——慢与不稳都由这里来。",
        "高方差有三个相乘的来源：回报本身是蒙特卡洛估计（整条轨迹的求和）、动作是采样出来的、环境转移也是随机的。三者叠起来，同一策略两次跑分能差一大截，所以多种子是纪律不是强迫症。",
        "baseline（减去 V(s)）或优势 A = Q - V 是降方差的主刀：期望不变、方差明显下降。GAE 再把「只看一步的 TD」和「看整条轨迹的 MC」做成插值，λ 就是那条偏差-方差旋钮。",
        "纯 REINFORCE 一步可能把策略推得太远，导致下一代样本与新策略几乎无关（分布不重叠），这一批数据就全废了——限制步长是数学必需，不是调参玄学。",
        "PPO 的裁剪到底稳住了什么：它把新旧策略的概率比 r 压在 [1-ε, 1+ε] 内，越界就没有梯度。被稳定的是「同一批数据被反复用的这几轮里，策略不要离采样时的行为策略太远」，因此复用样本仍然是安全的。",
        "KL 约束或早停是裁剪之外的第二道闸：单条样本被裁剪挡住，但很多小偏移会累积；一旦实测 KL 超阈值就该停止本轮更新，否则「每条都没越界」的策略整体早已跑到数据覆盖不到的地方。",
        "选型判断：动作连续、空间巨大、需要随机策略 → 策略梯度；离散小空间、样本极贵、要从日志或演示里学 → 值函数或离线方法（见 agi1-5、agi1-6）。"
      ],
      summary_en: [
        "Policy gradients differentiate the policy itself: raise good actions, lower bad ones. No value function is required, but you must finish the trajectory before you know whether it was good — and that is where the slowness and the noise come from.",
        "Variance has three multiplicative sources: the return is a Monte-Carlo sum over the whole trajectory, actions are sampled, and transitions are random. Stack them and the same policy scores very differently twice, so multiple seeds are discipline, not fussiness.",
        "A baseline (subtract V(s)) or an advantage A = Q - V is the main scalpel: expectation unchanged, variance cut sharply. GAE then interpolates between one-step TD and full-trajectory MC, with lambda as the bias-variance dial.",
        "Plain REINFORCE can move the policy so far in one update that the next batch of samples is nearly unrelated to it, throwing that whole batch away. Bounding the step is a mathematical necessity, not superstition about tuning.",
        "What PPO's clip actually stabilises: the probability ratio between new and old policy is squeezed into [1-eps, 1+eps], with no gradient beyond it. The protected quantity is 'do not drift from the behaviour policy while this batch is reused a few times', which is exactly what makes reuse safe.",
        "A KL penalty or early stop is the second gate: the clip blocks each individual term, but many small drifts accumulate. Once measured KL exceeds the threshold, end the epoch — otherwise the policy as a whole has already left the region the data covers, even though no single update crossed the line.",
        "How to choose: continuous actions, huge action spaces, genuinely stochastic policies mean policy gradients; discrete small spaces, very expensive samples, or learning from logs and demonstrations point to value methods or offline RL (see agi1-5 and agi1-6)."
      ],
      code: `# PPO 代理目标：概率比越出 [1-eps, 1+eps] 就没有梯度
# 优势为正时希望 r 变大，但被 clamp 封顶，防止一步跑太远
ratio = torch.exp(new_logp - old_logp)
surrogate = torch.min(ratio * adv,
                      torch.clamp(ratio, 1 - eps, 1 + eps) * adv)
policy_loss = -surrogate.mean()

# 优势必须标准化：不同 batch 量纲差很多
# 不然你调的其实是学习率而不是策略步长
adv = (adv - adv.mean()) / (adv.std() + 1e-8)

# old_logp 是采样时的事实，不是要优化的变量
old_logp = old_logp.detach()

# 第二道闸：实测 KL 超阈值就提前结束这一轮的复用
if approx_kl(new_logp, old_logp) > 0.02:
    break`,
      pit: "忘了在每个采样周期开始时重算 old_logp（或错误地对它求梯度），概率比恒等于 1，裁剪永远不触发：PPO 退化成一个没有步长限制的策略梯度，策略会在几轮之内跑到训练数据完全覆盖不到的地方，而 loss 曲线还在漂亮地下降。",
      pit_en: "Failing to recompute old_logp at the start of each sampling cycle (or letting it be part of the graph) pins the ratio at exactly 1, so the clip never fires: PPO degenerates into an unbounded policy gradient, the policy leaves the data's coverage within a few rounds, and the loss curve still looks lovely.",
      ex: {
        q: "PPO 的裁剪在什么情况下完全不起作用？",
        a: "当一批数据只用一次就丢掉时，新旧策略相同、概率比恒为 1，裁剪永远不触发。它的全部价值在于安全地把同一批昂贵样本复用几个 epoch。",
        q_en: "When is PPO's clipping completely inert?",
        a_en: "When each batch is used exactly once: new and old policies coincide, the ratio is always 1, and no clip fires. Its entire value is making a few epochs of reuse on expensive samples safe."
      }
    },

    "agi1-5": {
      min: 14,
      summary: [
        "RLHF 的奖励不是人直接打的分，而是「人对两个回答的偏好排序」：先用这些对比对训一个奖励模型，再让它的输出充当强化学习的奖励信号。瓶颈在标注一致性与标注规范，不在数量。",
        "偏好数据是模型行为的一面镜子：标注者天然偏爱更长、更自信、条理更清楚的答案，奖励模型就会奖励冗长与笃定，于是出现长度偏差与阿谀（用户说什么模型就同意什么）——这是目标函数的直接后果，不是意外。",
        "奖励模型必然过拟合：策略一旦进入它没见过的区域，打分就失真，出现 reward hacking（刷格式、重复免责句、错得很有底气）。所以训练时要盯「奖励在涨而人评不涨」这个背离信号，出现就该停。",
        "KL 约束不是安全装饰，而是一个认识论声明：奖励模型只在参考策略附近可信。它把优化钉回数据覆盖的区域，代价就是所谓对齐税——某些能力被压住，用来换取行为可控。",
        "RLHF 让模型「更听话、更好用」，不增加知识：知识在预训练里已经定死，RLHF 只改变输出分布（选哪个答案、用什么格式与语气）。所以它不可能把模型训得更聪明，这一点对 agi2 的选型至关重要。",
        "离线化是对这一套的直接回应：DPO 这类方法把「奖励 + 强化学习」折叠成一个分类式损失，用偏好对做监督，绕开在线采样的不稳定与算力。代价是放弃探索，天花板受限于日志里已有的好答案。",
        "离线强化学习共有的病是分布偏移：策略想选的那个动作在日志里根本没出现，它的值只能靠外推瞎估。对策是行为约束或保守估值，或者老实退回行为克隆并承认上限。"
      ],
      summary_en: [
        "RLHF's reward is not a human score but a human preference ordering between two answers: fit a reward model on those pairs first, then let its output serve as the RL signal. The bottleneck is annotation consistency and guidelines, not volume.",
        "Preference data is a mirror of annotator habits: longer, more confident, better-formatted answers win, so the reward model pays for verbosity and certainty, and length bias plus sycophancy appear. That is the objective working as written, not an accident.",
        "A reward model always over-fits its coverage: once the policy wanders into regions it never saw, the scores become fiction and reward hacking follows (format gaming, boilerplate disclaimers, confident nonsense). Watch for training reward rising while human ratings do not, and stop there.",
        "The KL term is not a safety decoration but an epistemic claim: the reward model is only trustworthy near the reference policy. It pins optimisation back inside the data, and the price is the alignment tax — some capability suppressed in exchange for controllable behaviour.",
        "RLHF makes a model more obedient and more usable; it adds no knowledge. Knowledge was fixed during pre-training, and RLHF only reshapes the output distribution (which answer, which format, which tone). It cannot make the model smarter, which matters a lot for the agi2 choices.",
        "Going offline is the direct response: DPO-style methods fold 'reward plus RL' into a classification loss trained on preference pairs, skipping the instability and compute of online sampling. The cost is no exploration at all — the ceiling is the best answer already in your logs.",
        "The shared disease of offline RL is distribution shift: an action the policy wants never appears in the log, so its value is pure extrapolation. Countermeasures are behaviour constraints or conservative value estimates, or admitting the ceiling and doing behaviour cloning instead."
      ],
      code: `# RLHF 的数据形态：同一个 prompt，两条回答，人只负责排序
pair = {"prompt": q, "chosen": a_good, "rejected": a_bad}

# 奖励模型学的是「相对顺序」，不是绝对分数
# 用排序损失，别去回归一个人类根本给不准的标量分
rm_loss = -torch.log(torch.sigmoid(r_chosen - r_rejected) + 1e-8)

# 策略这一侧：奖励减去 KL，把优化钉在参考策略附近
logratio = new_logp - ref_logp
kl = logratio.exp() - logratio - 1
objective = reward - beta * kl

# 背离监控：奖励涨了但人评没涨，该停就停
# 继续加步数只会学会骗过奖励模型
if train_reward > best_reward and human_eval <= best_human:
    stop()`,
      pit: "忘了在进 RL 之前对奖励模型做去偏与体检：长度偏差没消掉，几轮之后就成了「谁写得长谁得分高」；也没保存参考策略的 logprob，KL 项算错甚至恒为 0，等于放开了约束。两者都不会报错，只会让线上答案越来越啰嗦、越来越自信。",
      pit_en: "Skipping the reward model's bias audit before RL: an uncorrected length bias becomes 'longest answer wins' within a few rounds; and without the reference policy's log-probabilities the KL term is wrong or identically zero, which is the same as removing the leash. Neither raises an error — the answers just get wordier and more confident.",
      ex: {
        q: "为什么 RLHF 里要加 KL 惩罚，而不是直接最大化奖励模型的分数？",
        a: "因为奖励模型只在旧策略产生的数据上训过：新策略一跑远，它给的分数就是外推幻觉。KL 把优化限制在可信区域，代价是能力上限。",
        q_en: "Why penalise KL in RLHF instead of simply maximising the reward model's score?",
        a_en: "Because the reward model only saw data generated by the old policy; once the new policy drifts, its scores are extrapolated fiction. KL keeps the optimisation inside the trustworthy region, at the price of a capability ceiling."
      }
    },

    "agi1-6": {
      title: "综合重构：从建模到可信跑分的决策清单",
      title_en: "Synthesis: A Decision Checklist from Modelling to Trustworthy Scores",
      min: 15,
      target: "拿到一个真实决策问题，能一次写清状态/动作/奖励、选定 on-policy 还是离线、定好探索与评测协议，并说清每一项选择的代价。",
      target_en: "Given a real decision problem, state the state/action/reward model, pick on-policy or offline, fix the exploration and evaluation protocol in one pass, and name the cost of each choice.",
      summary: [
        "顺序不能反：先问「人类照着一个奖励函数做事能不能拿高分」，再问「状态是否含足够信息」，最后才轮到算法。现实里八成强化学习项目死在前两问。",
        "选型三问定路线：动作是离散还是连续（值函数还是策略梯度）、样本能不能在线拿（on-policy 还是能用回放和日志）、有没有可信模拟器（没有就考虑离线 RL 或模仿学习）。",
        "稳定性清单：目标网络、经验回放、优势标准化、梯度裁剪、多随机种子。前四项是算法结构给的，最后一项是评测纪律；缺一项都会把「没训好」误判成「方法不行」。",
        "仿真到现实的差距不是噪声而是系统性偏差：物理参数、执行延迟、感知误差都会被策略当成可利用的技巧学走。对策是域随机化、保守奖励、最后一级在真机上小步微调——换个种子补不上这个洞。",
        "离线强化学习的分布偏移是同一枚硬币的反面：日志里没有的动作只能靠外推估值。所以要么显式加行为约束与保守估值，要么退回行为克隆并承认能力上限，别用「理论上能外推」说服自己。",
        "评价指标：同一策略至少 5~10 个随机种子、报均值与最差值、画学习曲线，并区分「学得快」和「学得高」；只看一次跑分等于没有评测，这在策略梯度上尤其致命。",
        "常见翻车复盘：奖励被刷穿 / 探索过早收敛 / γ 取值不当导致短视 / 目标网络忘记同步 / done 掩码写错 / 只跑一个种子。这六条覆盖了新手项目失败原因的绝大多数。",
        "衔接下一章：强化学习解释了「偏好如何变成梯度」，agi2 从另一头看大模型——预训练、微调、RAG、采样参数与成本账；agi1-5 的 RLHF 会在那里被重新拆开。"
      ],
      summary_en: [
        "Never reverse the order: first ask whether a human following this reward function would score well, then whether the state carries enough information, and only then which algorithm. Roughly eighty percent of RL projects die on the first two questions.",
        "Three questions pick the route: discrete or continuous actions (value method or policy gradient), whether samples can be gathered online (on-policy, or can logs and replay be used), and whether a trustworthy simulator exists — if not, consider offline RL or imitation learning.",
        "Stability checklist: target network, replay buffer, advantage normalisation, gradient clipping, multiple seeds. The first four come from the algorithm's structure, the last from evaluation discipline; drop any one and 'we failed to train it' gets misread as 'the method does not work'.",
        "The sim-to-real gap is systematic bias, not noise: physics parameters, actuator latency and perception error all get learned as exploitable tricks. Countermeasures are domain randomisation, conservative rewards, and a final small-step fine-tune on the real machine — a new seed fixes none of it.",
        "Offline RL's distribution shift is the same coin's other face: actions absent from the log can only be valued by extrapolation. Either add explicit behaviour constraints and conservative estimates, or fall back to behaviour cloning and admit the ceiling — do not argue that extrapolation 'should' work.",
        "Evaluation protocol: at least five to ten seeds per policy, report mean and worst, plot the learning curve, and separate 'learns fast' from 'learns high'. A single run's score is not an evaluation, and with policy gradients it is actively misleading.",
        "Retrospective of common crashes: reward exploited, exploration collapsed too early, wrong gamma causing myopia, target network never synced, wrong done mask, one seed only. These six cover most beginner project failures.",
        "Bridge to the next chapter: RL explained how preference becomes gradient; agi2 looks at large models from the other end — pre-training, fine-tuning, RAG, sampling parameters and the cost ledger. The RLHF of agi1-5 gets taken apart again there."
      ],
      code: `# 一次跑分不能说明任何问题：多种子、报最差值、看曲线
# 1) 多种子：区分「策略真好」与「这次运气好」
seeds = list(range(10))

# 2) 同时记录均值、最差值和学习曲线，而不只是最终得分
curves = [train(seed, eval_every=1000) for seed in seeds]

# 3) 汇报格式：均值加减标准差，并单列最差种子
mean = sum(c.final for c in curves) / len(curves)
worst = min(c.final for c in curves)

# 4) 仿真训完先做域随机化再上真机
# 真机上只允许小步微调，且保留随时退回旧策略的开关
env = DomainRandomized(sim_env, mass=(0.8, 1.2), latency=(0, 40))`,
      pit: "忘了策略梯度的方差本来就大，用「一次训练、一次评测」的结果做算法对比：两小时的训练时间换来的是噪声排序，最后选了个运气好的配置。同一份代码至少要 5 个种子，且把种子写进配置而不是每次手填。",
      pit_en: "Forgetting how noisy policy gradients are and comparing algorithms from one training run and one evaluation: two hours of compute buy you a noise ranking and you pick the lucky configuration. At least five seeds per config, recorded in the config file rather than typed by hand.",
      ex: {
        q: "为什么「离线强化学习」不能当成「随便多少日志都能学」？",
        a: "因为策略要选的动作在日志里可能一次都没出现，它的值只能由估值网络外推出来；日志越窄，外推越离谱，所以必须加行为约束或保守估值来限制这种乐观。",
        q_en: "Why does 'offline RL' not mean 'any pile of logs will do'?",
        a_en: "The actions the policy wants may never appear in the log, so their values come from the critic extrapolating; the narrower the log, the wilder the extrapolation — hence behaviour constraints or conservatism to curb that optimism."
      }
    },

    /* ===================== agi2 大语言模型 LLM ===================== */
    "agi2-1": {
      min: 13,
      summary: [
        "预训练的目标只有一句「预测下一个 token」，知识是被这个目标顺带逼出来的副作用。理解这一点，才能解释为什么模型可以「非常流畅但内容错误」。",
        "token 是最小读写与计费单位，不是字符也不是词：子词分词把罕见词拆碎，中文常常一字占 1~3 个 token，同一段话与英文能差 1.5~3 倍——窗口和账单都按 token 走。",
        "词表大小是个取舍：表小则序列被拉得更长（更慢更贵），表大则参数与稀疏问题上升。多语言模型如果在分词上没给中文留够份额，中文的 token 效率就天生吃亏，这是选型时要亲自量的指标。",
        "缩放定律是预算工具，不是信仰：参数、数据、算力要按经验比例一起涨才划算，只堆参数不堆数据会很快撞墙；而且它外推的是平均损失，不是「会不会突然长出我要的那个能力」。",
        "语料决定能力边界与偏见的来源：知识截止日之后的事一概不知，网络文本里的重复、立场与模板都进了参数。这是后面 RAG 与微调只能「引用」和「调度」而不能凭空补事实的根因。",
        "预训练交付的是一个「通才基座」，但它只是续写机器：它从未被要求回答你。所以「不会用」不等于「不行」，SFT 与 RLHF 的作用是把已有能力引到「对话」这个接口上（见 agi2-2 与 agi1-5）。",
        "衔接：agi1 已经说明偏好怎么变成梯度；本章从数据、成本与用法这一头看同一个模型。下一节先把「让模型听懂指令」这件事算清楚。"
      ],
      summary_en: [
        "Pre-training has exactly one objective, 'predict the next token', and knowledge is a side effect forced out by it. That is why a model can be extremely fluent and simply wrong.",
        "The token is the unit of reading, writing and billing — not the character, not the word. Subword tokenisation shatters rare words, and Chinese often costs 1-3 tokens per character, so the same passage can differ from English by 1.5-3x. Windows and invoices both move in tokens.",
        "Vocabulary size is a trade: a small vocab stretches sequences (slower, costlier), a large one inflates parameters and sparsity. If a multilingual model did not reserve enough vocabulary for Chinese, its token efficiency in Chinese is structurally worse — measure this yourself when selecting.",
        "Scaling laws are a budgeting tool, not a religion: parameters, data and compute must grow together in the empirical ratio, and stacking parameters on frozen data hits a wall fast. They also extrapolate average loss, not 'will the specific capability I need appear'.",
        "The corpus sets the capability boundary and where the bias comes from: nothing after the cut-off date exists, and the repetition, stances and templates of web text are all in the weights. That is the root reason RAG and fine-tuning can only cite and schedule facts rather than invent them.",
        "Pre-training delivers a generalist base model, yet its nature is still a completion machine: it was never asked to answer you. So 'hard to use' does not mean 'cannot' — SFT and RLHF wire existing capability into the dialogue interface (see agi2-2 and agi1-5).",
        "Bridge: agi1 showed how preference becomes gradient; this chapter looks at the same model from the data, cost and usage side. Next up is the honest accounting of what fine-tuning actually buys."
      ],
      code: `# token 才是计费与窗口的单位，不是字数
ids = tokenizer.encode("大语言模型的中文成本很高")
ids_en = tokenizer.encode("Chinese costs more tokens than English per idea")

# 上下文预算必须提前算：系统提示 + 历史 + 检索片段 + 预留输出
used = count(prefix) + count(history) + count(chunks)
assert used + max_new_tokens < context_len, "超窗会被静默截断"

# 词表是否对中文友好，要拿真实业务文本自己量
# 同一句话在中英两侧的 token 数比值就是「中文成本」
zh_cost = len(ids) / len("大语言模型的中文成本很高")

# 缩放定律只告诉你预算怎么分，不保证能力出现
# 因此先跑小规模验证任务，再决定要不要买那张大卡`,
      pit: "忘了把 token 当成本项统计：同一个业务问答，中文提示词加上 few-shot 示例很容易从 800 涨到 4000 token，价格与首 token 延迟同时翻几倍，而评测分数几乎没动。这时候该砍示例与检索条数，而不是换更贵的模型。",
      pit_en: "Failing to count tokens as a cost line: the same business question can go from 800 to 4000 tokens once Chinese few-shot examples are attached, multiplying price and time-to-first-token while the score barely moves. Cut examples and retrieved chunks then — do not buy a pricier model.",
      ex: {
        q: "为什么「模型答得很流畅但内容是编的」并不矛盾？",
        a: "因为预训练奖励的是下一个 token 的似然，不是事实性；流畅说明目标完成得很好，对不对要由检索、监督与评测另外保证。",
        q_en: "Why are 'very fluent' and 'invented content' not contradictory?",
        a_en: "Pre-training rewards next-token likelihood, not factuality. Fluence means the objective was met; correctness must be supplied by retrieval, supervision and evaluation."
      }
    },

    "agi2-2": {
      min: 12,
      summary: [
        "SFT 教的是「格式与服从」：按指令的样式输出、该拒的拒、该简短的简短。往参数里灌新知识是预训练的事，SFT 只能把模型已有能力调到当前任务上。",
        "数据量与质量的关系非常陡：几百到几千条高质量、覆盖真实分布的示范，胜过十万条模板化的脏数据；一套重复模式的脏样本会让模型学会复读。",
        "多样性比规模更要命：同一种问法的一万条只教会一个模式。风格、长度、拒答、多轮、边界案例都要有样本，否则分布外立刻崩。",
        "LoRA 的本质是冻结主干、只训低秩增量：省显存、能按客户热插拔、便于回滚；代价是能力上限受秩与目标层限制，大改动与复杂推理会先撞天花板。",
        "微调的隐藏成本是「遗忘与锁定」：通用能力可能下降，且模型会向训练数据的风格收敛，之后想再用回通用提示词反而更难；上线前必须拿一组与训练无关的通用样例回归一遍。",
        "什么时候不该微调：知识会变（用 RAG）、只是格式与风格问题（先把提示词写到极限）、样本不足百条（few-shot 更划算）、需要更强推理（先试提示与蒸馏）。微调是最后手段，不是第一选择。",
        "部署侧的取舍在同一条线上：量化用精度换显存与吞吐、蒸馏用能力上限换小模型的成本、剪枝用结构化程度换稀疏加速，而且中文与代码能力往往最先掉——agi4-2 会按部署约束把这笔账重算一遍。"
      ],
      summary_en: [
        "SFT teaches format and obedience: answer in the shape asked, refuse what should be refused, stay brief when told to. Loading new knowledge is pre-training's job; SFT only steers abilities the model already has.",
        "The data-quality curve is steep: a few hundred to a few thousand high-quality samples matching the real distribution beat 100k templated dirty ones; a dirty set built on one repeated pattern teaches the model to parrot.",
        "Diversity matters more than volume: ten thousand variants of the same question still teach one pattern. Style, length, refusals, multi-turn and edge cases all need coverage, or performance collapses out of distribution.",
        "LoRA freezes the backbone and trains a low-rank delta: less memory, hot-swappable per tenant, easy to roll back. The price is a ceiling set by rank and target modules — big behavioural changes and hard reasoning hit it first.",
        "Fine-tuning's hidden cost is forgetting and lock-in: general ability can drop, and the model converges toward its training style, so generic prompts stop working well afterwards. Run unrelated general examples before shipping.",
        "When not to fine-tune: the knowledge changes (use RAG), the issue is only format or style (push the prompt to its limit first), you have under a hundred samples (few-shot wins), you need better reasoning (try prompts or distillation). Fine-tuning is the last lever, not the first.",
        "The deployment trade sits on the same line: quantisation spends accuracy to buy memory and throughput, distillation spends the ceiling to buy a smaller bill, pruning spends structure to buy sparse speed-up — and Chinese plus code tend to erode first. agi4-2 re-runs this ledger under deployment constraints."
      ],
      code: `# SFT 样本的三要素：指令、输入、期望输出
# 少了输入或输出边界，模型就学不出「什么时候该停」
sample = {
    "instruction": "把下面条款改写成非技术读者能懂的版本",
    "input": clause,
    "output": rewritten,
}

# 开训之前先查数据集健康度这三项
# 1) 重复：同一条被过采样，模型会学会复读
dup_rate = 1 - len(set(outputs)) / len(outputs)

# 2) 长度分布：训练答案都是五十字，线上就写不出长回答
lengths = [len(s["output"]) for s in data]

# 3) 拒答样本必须显式存在，否则模型学成「什么都能答」
refused = sum(1 for s in data if "无法回答" in s["output"])

# LoRA 只训低秩增量：省显存，但秩太小会先掉复杂推理与中文
model = get_peft_model(base, LoraConfig(r=16, target_modules=["q_proj", "v_proj"]))`,
      pit: "忘了留一份「旧能力」回归集：SFT 之后业务题涨十分，通用指令跟随与多轮对话却崩了，因为新数据把它锁进了单一风格。上线前跑二十个与训练完全无关的通用例子，只要十分钟，能挡掉一整类线上事故。",
      pit_en: "Skipping a regression set for general ability: after SFT the business score climbs ten points while instruction following and multi-turn fall apart, because the new data locked the model into one style. Twenty unrelated general examples take ten minutes and block a whole class of incidents.",
      ex: {
        q: "为什么「把公司文档喂进去微调」通常不如做检索？",
        a: "因为文档是要查的事实：会更新、需要溯源。写进参数既不能审计也很快过期，改一次文档就得重训一次，而检索改一条索引就能生效。",
        q_en: "Why is fine-tuning on your company documents usually worse than retrieval?",
        a_en: "Documents are facts to be looked up: they change and they need provenance. In the weights they cannot be audited and expire quickly, so every document edit means a retrain; a retrieval index updates in one ingest."
      }
    },

    "agi2-3": {
      min: 12,
      summary: [
        "提示词的本质是「把任务说清楚」：角色、任务、输入格式、输出格式、判定标准五项齐了，效果往往就够；魔法词与「你是世界顶级专家」这类咒语是迷信。同时记住一条硬约束：你给的上下文，决定它能用的信息上限。",
        "few-shot 示例买的是格式一致性，不是知识：示例要覆盖边界情况（空输入、超长、该拒答的），否则模型只在示例分布内表现好，线上一遇到边角就自由发挥。",
        "思维链是拿 token 换准确率：多生成中间步骤确实抬高复杂任务的成功率，代价是延迟与费用上升，而且中间步骤不保证为真（它可能在为已定的答案编理由）；分类、抽取这类简单任务加 CoT 反而可能变差。",
        "采样参数按任务定：抽取、分类、代码用低温（接近贪心、便于回归），创意写作才用高温。关键结论是——温度不减少事实性错误，它只是让错误更花哨，因为幻觉的根子在信息源与训练，不在采样。",
        "top-p 与温度作用相似但不同：温度改变整个分布的形状，top-p 截断候选集合。两个同时猛调会把输出推到尾部噪声上，看起来「有创意」其实是随机漂移。",
        "格式崩坏要靠结构解决：给模板、给 JSON schema、必要时用约束解码或函数调用。只写「请务必输出合法 JSON」是不可靠的，输出越长越容易漏逗号、漏引号。",
        "提示词是可版本化的资产：每次改动跑同一套固定用例回归，记录用例编号与失败原因。没有回归集的提示词工程就是玄学（这一条会在 agi2-6 与 agi4-1 变成上线要求）。"
      ],
      summary_en: [
        "A prompt is really 'state the task clearly': role, task, input format, output format, and what counts as correct — with those five, results are usually good enough. Magic words and 'you are a world-class expert' are superstition. And hold on to one hard constraint: the context you supply sets the ceiling on what information it can use.",
        "Few-shot examples buy format consistency, not knowledge. Cover the edge cases (empty input, oversized input, the ones that should be refused), or the model behaves only inside the example distribution and improvises on real inputs.",
        "Chain-of-thought buys accuracy with tokens: intermediate steps do raise success on hard tasks, at the cost of latency and price, and the steps are not guaranteed to be true (they may be rationalising a decided answer). On simple extraction or classification it can even hurt.",
        "Set sampling by task: extraction, classification and code want low temperature (near-greedy, comparable regressions); only creative writing wants heat. The key point is that temperature does not reduce factual error — it only makes errors more imaginative, because hallucination comes from the information source and training, not from sampling.",
        "top-p resembles temperature but differs: temperature reshapes the whole distribution, top-p truncates the candidate set. Pushing both hard lands the output in tail noise, which reads as 'creative' but is really random drift.",
        "Fix format collapse structurally: give a template, give a JSON schema, use constrained decoding or tool calls when it matters. 'Please always output valid JSON' is unreliable — the longer the output, the sooner a comma or quote goes missing.",
        "Prompts are versioned assets: every edit reruns the same fixed case set, logging case id and failure reason. Prompt engineering without a regression set is occult practice (agi2-6 and agi4-1 turn this into a release requirement)."
      ],
      code: `# 一个可回归的提示词：角色 / 任务 / 输入 / 输出格式 / 判定标准
SYSTEM = \"\"\"你是合同审查助手，只依据给定条款回答。
输出 JSON：{"clause": str, "risk": "high"|"mid"|"low", "reason": str}
条款里判断不了时 risk 填 unknown，不要猜。\"\"\"

# 采样参数按任务定：抽取要稳，创意要活
# 温度接近 0 才能让同样的输入给出同样的输出，回归才可比
resp = client.chat.completions.create(
    model=m, messages=msg, temperature=0, top_p=1)

# 提示词版本与用例集一起提交，改一句话也要跑全量回归
assert passed == total, f"prompt v{ver} regression failed: {failed_cases}"`,
      pit: "忘了在提示里写「不确定时怎么办」：模型总会给出一个答案，缺口会被自信的错误填上——unknown、拒答、以及「资料中未找到」这些分支必须显式写在提示里，否则幻觉会以非常专业的口吻出现。",
      pit_en: "Omitting what to do when unsure: the model always produces something, and the gap gets filled with confident error. unknown, refusal and 'not found in the material' must be written into the prompt explicitly, or hallucination arrives in a very professional tone.",
      ex: {
        q: "为什么把温度调到 0 仍然消除不了幻觉？",
        a: "温度只决定在同一分布上怎么选。如果概率质量本来就偏向错误的 token，低温只会稳定地重复那个错误；要减少幻觉得改信息源（检索、上下文、训练）。",
        q_en: "Why does setting temperature to 0 still not remove hallucination?",
        a_en: "Temperature only chooses within an existing distribution. If the probability mass already favours the wrong token, low temperature repeats that error faithfully; reducing hallucination means changing the information source — retrieval, context, training."
      }
    },

    "agi2-4": {
      min: 13,
      summary: [
        "RAG 的结构就是「先取证再答题」：把候选文档放进上下文，让模型基于它生成。它比微调更适合承载新鲜知识，因为知识存在参数外面的索引里——更新一次即生效，还能给出可核对的引用。",
        "检索质量决定上限：模型无法超越上下文里有的信息，召回不全时再大的模型也只能编。所以工程重心在分块、embedding 与混合检索（向量 + 关键词），而不是换个更大的生成模型。",
        "分块是精度与语义完整性的取舍：块太小命中准但断了上下文，块太大噪声多还挤占窗口。重叠分块、父子块（检索小块、送大块进上下文）就是为了同时拿到两边的好处。",
        "排序与截断同样关键：把最相关的三段放进去，通常比把相似度阈值以上的二十段全倒进去更有效——后者直接触发 agi2-5 说的注意力稀释，还会拉长账单。",
        "RAG 治不了所有幻觉：资料本身过时、互相矛盾，或问题需要跨文档汇总时，模型会「忠实地引用错资料」。要做引用可定位、资料冲突时报冲突而不是猜。",
        "成本与延迟要一起算：多一次 embedding 与检索、多几千 token 上下文，每次请求都更贵更慢。高频问题该缓存答案，稳定的常识该下沉到提示词里。",
        "RAG 与微调不是对手而是分工：RAG 管「是什么」（易变的事实、需要溯源的内容），微调管「怎么做」（稳定的格式、术语、风格）。同一件事提示词加检索能解决，就别动权重。"
      ],
      summary_en: [
        "RAG is 'collect evidence, then answer': put candidate documents into the context and have the model generate from them. It carries fresh knowledge better than fine-tuning because the knowledge lives in an index outside the weights — one ingest updates it, and citations stay checkable.",
        "Retrieval quality sets the ceiling: a model cannot exceed what is in its context, and with poor recall even a huge model just invents. So the engineering goes into chunking, embeddings and hybrid search (vectors plus keywords), not into a bigger generator.",
        "Chunking trades precision against semantic completeness: small chunks match well but cut context, large chunks bring noise and eat the window. Overlapping chunks and parent-child chunks (retrieve small, feed the parent) exist to get both.",
        "Ranking and truncation matter just as much: the top three relevant chunks usually beat all twenty above the similarity threshold, which triggers the attention dilution described in agi2-5 and lengthens the bill at the same time.",
        "RAG does not cure every hallucination: when the material is stale, mutually contradictory, or the question needs cross-document synthesis, the model faithfully cites the wrong thing. Citations must be locatable, and conflicts must be reported instead of guessed away.",
        "Count cost and latency too: an extra embedding plus search plus several thousand context tokens makes every request slower and pricier. Cache answers for frequent questions and push stable knowledge down into the prompt.",
        "RAG and fine-tuning are division of labour, not rivals: RAG owns 'what is' (volatile facts, content needing provenance), fine-tuning owns 'how to behave' (stable format, terminology, tone). If prompt plus retrieval solves it, keep your hands off the weights."
      ],
      code: `# RAG 三步：召回、重排、控预算，然后才交给模型
hits = store.search(embed(query), k=20)

# 阈值以上的二十段全塞进去，不如最相关的三段
# 多塞的代价是注意力稀释加双倍账单
ctx = rerank(query, hits)[:3]

# 必须给生成留出预算，否则上下文会挤掉输出长度
token_left = context_len - count(SYSTEM) - count(ctx) - max_new_tokens
assert token_left > 0, "context full: cut k or use a longer window"

# 引用要能回溯到原文位置，否则无法审计
# 也无法区分「资料里说的」与「模型自己补的」
prompt = render(query, ctx, require_citation=True)

# 检索为空是正常分支，不是异常
# 让模型回答「资料中未找到」，别让它回去靠记忆编
answer = model(prompt) if ctx else NOT_FOUND`,
      pit: "忘了处理「检索为空」与「检索冲突」两个分支：知识库没命中时模型会拿参数记忆补答，输出看起来完全正常，实际是新知识根本没进上下文；资料互相矛盾时它会随机挑一条。正确做法是显式要求回答「资料中未找到」或报告冲突，并把这两类用例固定进回归集。",
      pit_en: "Skipping the empty-retrieval and conflicting-retrieval branches: with no hit the model patches the answer from parametric memory, producing text that looks perfectly normal while your new knowledge never entered the context; with contradictory sources it picks one at random. Require an explicit 'not found in the material' or a reported conflict, and keep those cases in the regression set.",
      ex: {
        q: "为什么把整个知识库塞进超长上下文不算 RAG 的替代方案？",
        a: "一是窗口与成本撑不住，二是无关内容会稀释注意力、抬高干扰，三是失去引用与审计粒度；检索的价值在于缩小候选空间，而不是省掉一次调用。",
        q_en: "Why is stuffing the whole corpus into a long context not a replacement for RAG?",
        a_en: "The window and the bill cannot take it, irrelevant content dilutes attention and adds interference, and you lose citation granularity. Retrieval exists to shrink the candidate set, not to save one call."
      }
    },

    "agi2-5": {
      min: 13,
      summary: [
        "上下文窗口是工作内存的上限：它决定模型一次能参考多少信息，但「装得下」不等于「用得上」。证据放在中间时命中率明显低于开头与结尾，所以关键约束要写在开头、并紧邻问题再复述一遍。",
        "注意力稀释是规模问题：窗口越长，定位越不可靠，长文档问答的正确率会在某个长度之后下降。工程手段是分段问答再汇总，而不是一次丢二十万字进去。",
        "推理模型的「思考」仍然是在生成 token：它与普通 CoT 的差别在训练阶段就把中间步骤对最终答案的贡献优化进去了。两者都不能突破知识边界——推理只是把算力从并行维度挪到了时间维度上。",
        "KV cache 是自回归生成的命门：每生成一个 token 都要读全部历史的 key/value，所以首 token 延迟（prefill）与逐 token 延迟（decode）是两个独立瓶颈，显存也随「窗口长度 × 并发」上升。",
        "prompt 缓存（前缀缓存）是真实的降本手段：把不变的系统提示与检索前缀放前面、可变内容放后面，命中就省一次 prefill。反过来把时间戳、用户名写在第一行，缓存永远不会命中。",
        "失败模式要分类处理，因为修法不同：无理由拒答多为护栏误触、跑题源于指令与上下文互相冲突、格式崩坏在约束不够硬或输出超阈值后失控、静默截断则是超窗后只保留了一头。",
        "护栏要分层：模型内生对齐（不可控）、提示词约束（易被破）、结构化输出与 schema 校验（可靠）、输出校验加重试（必留）、人工确认高风险动作（兜底）。把安全完全交给一句提示词，是最常见的设计错误。"
      ],
      summary_en: [
        "The context window is the bound on working memory: it decides how much the model can consult at once, but 'fits' is not 'used'. Facts placed in the middle are hit noticeably less often than at the start or right before the question, so restate key constraints at both ends.",
        "Attention dilution scales badly: the longer the window, the less reliable the lookup, and long-document accuracy drops past some length. The engineering answer is chunked question-answering then synthesis, not one twenty-thousand-word dump.",
        "An inference model's 'thinking' is still generated tokens; what differs is that training already optimised how intermediate steps contribute to the final answer. Neither kind crosses the knowledge boundary — reasoning just moves compute from the parallel axis to the time axis.",
        "The KV cache is the choke point of autoregressive generation: every new token re-reads all past keys and values, so time-to-first-token (prefill) and per-token latency (decode) are separate bottlenecks, and memory grows with window length times concurrency.",
        "Prompt (prefix) caching is a genuine cost lever: keep the static system prompt and retrieval prefix first, variable content last, and a hit saves a prefill. Put a timestamp on line one and the cache never hits again.",
        "Classify the failure modes, because the fixes differ: unexplained refusal usually means a guard misfire, going off-topic means instruction and context conflict, format collapse means constraints were too soft or output ran long, silent truncation means the window cut part of your input.",
        "Layer the guardrails: the model's own alignment (uncontrollable), prompt constraints (breakable), structured output with schema validation (reliable), post-generation checks with retries (mandatory), human confirmation for risky actions (backstop). Delegating all safety to one prompt line is the most common design error."
      ],
      code: `# 提示结构：不变在前、可变在后，前缀缓存才命中
# 时间戳写在第一行，长系统提示就永远无法复用缓存
messages = [
    {"role": "system", "content": LONG_STATIC_SYSTEM},
    {"role": "user", "content": build_body(question, now)},
]

# 关键约束在结尾再复述一次，避开「中段命中率最低」
messages.append({"role": "user", "content": REMINDER_TAIL})

# 长材料先分段问答再汇总，比整篇丢进去更准
notes = [answer(chunk, question) for chunk in split(ctx, size=2000)]
final = synthesise(notes)

# 结构化输出加校验重试：格式崩坏要有退路
# 不能只靠「请务必输出 JSON」这种口头恳求
try:
    result = Answer.model_validate_json(resp.text)
except ValidationError:
    result = repair_once(resp.text)`,
      pit: "忘了超窗常常是静默截断而不是报错：多数实现从头部保留或从尾部保留，日志里只看到「模型变笨了」，其实是它压根没看到你放在中间的那份资料。上线前把每段 token 数打出来，并给上下文占用率设一条告警。",
      pit_en: "Forgetting that running over the window is usually a silent truncation rather than an error: most stacks keep the head or the tail, so the log just says 'the model got dumb' when in fact the document you placed in the middle was never seen. Print each section's token count before launch and alert on context utilisation.",
      ex: {
        q: "窗口明明有 128k，为什么还要做检索和分段？",
        a: "因为窗口是容量上限而不是能力上限：中段信息命中率下降、延迟与成本随长度上升、无关内容还会干扰推理。检索的意义是把上下文的信噪比拉高，而不是把窗口填满。",
        q_en: "With a 128k window, why still retrieve and chunk?",
        a_en: "Because the window is a capacity limit, not a competence limit: middle-position recall drops, latency and cost grow with length, and irrelevant content interferes with reasoning. Retrieval raises the signal-to-noise ratio, it is not about filling the window."
      }
    },

    "agi2-6": {
      title: "综合重构：Prompt / RAG / 微调的选型与成本账",
      title_en: "Synthesis: Choosing Prompt, RAG or Fine-tuning — and Pricing It",
      min: 15,
      target: "面对具体业务需求，能在提示词、RAG、微调、蒸馏与量化之间做出可解释的选择，并给出 token 成本、延迟预算与评测方案。",
      target_en: "For a concrete product need, make an explainable choice among prompts, RAG, fine-tuning, distillation and quantisation, and present the token cost, latency budget and evaluation plan that go with it.",
      summary: [
        "决策顺序固定：先把提示词写到极限（结构 + 示例 + 输出 schema）→ 不够再 RAG（缺事实、要时效、要溯源）→ 再不够才微调（格式、术语、风格、稳定行为）→ 要降本才蒸馏或量化。反着做的团队都会返工。",
        "成本按 token 与并发算，不按「一次问答」算：单次成本约等于（输入 + 输出）token 乘单价，月成本再乘请求数。长系统提示与 few-shot 会被每个请求重复付费，缓存前缀与限制检索条数省下来的往往就是利润。",
        "延迟有两个独立的数：首 token 时间由输入长度（prefill）决定，吐字速度由输出长度与并发决定。面向对话要优化前者、面向报告生成要优化后者；混在一起谈「快不快」做不出决策。",
        "吞吐靠批处理换：连续批处理把 GPU 利用率拉高、把每 token 成本压下去，代价是尾延迟变差。在线对话与离线跑批是两种部署形态，不要让它们互相迁就。",
        "评测不可靠是常态：BLEU/ROUGE 与业务质量相关性差，LLM-as-Judge 带位置偏差（偏爱先出现的答案）、长度偏差（偏爱更长）、自家模型偏差与分数漂移。它的输出只能当相对参考，且必须有黄金用例做校准。",
        "三层评测一起用：固定黄金用例集（人工标注、覆盖失败模式）→ 模型评审（快、便宜、有偏）→ 线上真实反馈（慢、准）。三者结论冲突时信线上；离线涨分而线上失败率上升，说明用例集失真。",
        "上线前清单：token 预算与告警、超时与重试、输出校验、高风险动作人审、灰度比例与回滚开关、失败样本回流入库。这一页比模型分数更能决定你晚上睡得着不着。",
        "衔接 agi3：本章处理的是「会说」的模型；下一章给它手和眼——多模态与工具调用，随之而来的是新的失效模式：轨迹错误、步骤漂移与越权。"
      ],
      summary_en: [
        "Fix the order: push the prompt to its limit (structure, examples, output schema), then RAG (missing facts, freshness, provenance), only then fine-tuning (format, terminology, style, stable behaviour), and distill or quantise last to cut cost. Teams that invert this pay it back later.",
        "Price by tokens and concurrency, not by 'one question': per-request cost is roughly (input + output) tokens times unit price, times request volume per month. Long system prompts and few-shot examples are paid again on every call — prefix caching and a capped retrieval count are where the margin hides.",
        "Latency is two independent numbers: time-to-first-token is set by input length (prefill), token rate by output length and concurrency. Optimise the first for chat and the second for report generation; blending them into 'is it fast' supports no decision.",
        "Throughput is bought with batching: continuous batching raises GPU utilisation and lowers cost per token, at the price of worse tail latency. Online chat and offline batch jobs are two deployments — do not make them share a pool.",
        "Unreliable evaluation is the default: BLEU and ROUGE correlate poorly with business quality, and LLM-as-Judge carries position bias (prefers the first answer), length bias (prefers the longer one), self-preference and score drift. Treat it as a relative signal calibrated by a golden set.",
        "Run three evaluation layers: a fixed golden case set (human-labelled, covering failure modes), model judging (fast, cheap, biased), and real online feedback (slow, truthful). When they disagree, trust production: offline gains with rising online failure rates mean your case set is lying.",
        "Pre-launch checklist: token budget with alerts, timeouts and retries, output validation, human review for risky actions, canary percentage and rollback switch, failed samples flowing back into the dataset. That page decides your sleep quality more than any benchmark score.",
        "Bridge to agi3: this chapter covered the model that can talk. The next gives it hands and eyes — multimodal input and tool calls — along with new failure modes: wrong trajectories, step drift and privilege overreach."
      ],
      code: `# 成本账一次算清：token 单价乘输入输出，再乘请求量
in_tok = count(system) + count(few_shot) + count(question)
monthly = (in_tok + 400) * price_per_token * requests_per_month

# 前缀缓存省的是输入侧的 prefill，不省输出 token
saved = in_tok * hit_rate * (1 - cache_discount)

# 模型评审必须交换位置，才能暴露「偏爱第一个答案」的位置偏差
judge_ab = score(a, b)
judge_ba = score(b, a)
assert (judge_ab > 0) == (judge_ba < 0), "judge flips with position: unusable"

# 延迟要分开看：对话盯首 token，报告盯每秒 token
slo = {"ttft_p95": 0.8, "tokens_per_sec": 40}

# 冲突时信线上：离线涨分但失败率上升，是用例集失真
ship = offline_gain > 0 and online_error_delta <= 0`,
      pit: "忘了把评审模型（LLM-as-Judge）的提示词与被测提示词一起版本化：改了评审标准，历史分数全部失效，却看起来像「模型变好了」。评审器同样需要黄金用例和回归，而且要与人工标注定期比对一致性。",
      pit_en: "Forgetting to version the judge prompt together with the tested prompt: change the judging rubric and every historical score becomes invalid while the chart reads like 'the model improved'. The judge needs its own golden cases, its own regression, and periodic agreement checks against human labels.",
      ex: {
        q: "为什么「输入 token 便宜」不能推出「成本可控」？",
        a: "因为上下文在每个请求上都要重复付费：长系统提示、few-shot、检索片段乘并发量之后，输入侧往往就是主要开销，而且它同时抬高首 token 延迟。不做前缀缓存和检索条数约束，单价再低也省不下来。",
        q_en: "Why does 'cheap input tokens' not imply 'controlled cost'?",
        a_en: "Because the context is paid again on every request: long system prompts, few-shot examples and retrieved chunks times concurrency usually make the input side the dominant cost, and they raise time-to-first-token at the same time. Without prefix caching and a cap on retrieved chunks, a low unit price saves nothing."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择/判断/填空混排） ---------- */
  quizAdd: {
    agi1: [
      {
        q: "深度 Q-learning 里，经验回放和目标网络各自解决什么问题？",
        o: ["前者提高采样效率，后者提高值函数上限", "前者打散连续样本的相关性，后者让自举的目标暂时不动", "两者都只是为了节省显存", "前者防止奖励被刷分，后者防止探索过多"],
        a: 1,
        why: "连续轨迹的样本高度相关，会破坏 SGD 的独立性假设，回放随机采样解决它；目标若由同一个网络实时算出，参数一动目标就追上来，冻结的目标网络提供不动的靶子。",
        q_en: "In deep Q-learning, what does each of the replay buffer and the target network fix?",
        o_en: ["Faster sampling vs a higher value ceiling", "Sample correlation from consecutive steps vs a bootstrapped target that keeps moving", "Both only save memory", "Anti-reward-hacking vs limiting exploration"],
        why_en: "Consecutive steps are strongly correlated and violate SGD's independence assumption, which random replay sampling fixes; a target computed by the same live network chases itself, and a frozen target network supplies a stationary mark."
      },
      {
        q: "PPO 的裁剪（clip）到底在稳定什么？",
        o: ["限制单条奖励的数值范围", "限制新旧策略概率比，使同一批样本被多次复用时策略不会跑太远", "让梯度始终为零以保持稳定", "限制经验回放缓冲区的大小"],
        a: 1,
        why: "裁剪把概率比压在 1±ε 内，越界即无梯度。它保障的是「一批昂贵样本复用几个 epoch 时，策略仍留在采样时的行为策略附近」，数据失效前不会跑飞。",
        q_en: "What does PPO's clipping actually stabilise?",
        o_en: ["The numeric range of each reward", "The new-to-old probability ratio, so the policy stays near the behaviour policy while one batch is reused", "Keeping the gradient at zero", "The size of the replay buffer"],
        why_en: "The clip keeps the ratio inside 1±epsilon and removes gradient beyond it, which is what makes reusing an expensive batch for several epochs safe: the policy stays near the one that collected the data."
      },
      {
        q: "判断：RLHF 训练得足够久，就能让基座模型学到训练数据里没有的新知识。",
        type: "judge", a: 1,
        why: "RLHF 只改变输出分布（选哪个答案、什么格式与语气），知识在预训练阶段就已写入参数；要补新事实得靠继续预训练或检索，不是靠偏好优化。",
        q_en: "True or false: running RLHF long enough teaches the base model facts that were absent from its pre-training data.",
        why_en: "False. RLHF only reshapes the output distribution (which answer, which format and tone); facts were fixed during pre-training, so new knowledge needs continued pre-training or retrieval, not preference optimisation."
      },
      {
        q: "策略梯度中减去一个与具体动作无关的 ______，可以在不引入偏差的前提下显著降低梯度方差。（填英文术语）",
        type: "fill", ans: ["baseline", "基线", "价值基线", "B(s)", "V(s)"],
        why: "baseline（通常取 V(s)）只平移回报的参照点，期望不变，因此无偏；方差因减去共同项而大幅下降，进一步可换成优势 A=Q-V 或 GAE。",
        q_en: "Subtracting a ______ that does not depend on the specific action cuts gradient variance without adding bias. (Fill in the English term.)",
        why_en: "A baseline, usually V(s), only shifts the reference point of the return, leaving the expectation untouched while removing much of the variance; the advantage A=Q-V or GAE refine the same idea."
      }
    ],
    agi2: [
      {
        q: "同一句业务文本，中文与英文的 token 数往往差 1.5~3 倍。这直接影响什么？",
        o: ["只影响模型的回答速度，不影响费用", "上下文占用与按 token 计费的成本，以及能装下的资料量", "只影响训练阶段，推理不受影响", "影响为零，因为计费按字数"],
        a: 1,
        why: "token 是最小读写与计费单位：中文更碎意味着同一段内容更贵、更占窗口、首 token 延迟也更高，选型时必须拿真实业务文本亲自查。",
        q_en: "Chinese and English differ by 1.5-3x in token count for the same business text. What does that hit?",
        o_en: ["Only answer speed, not cost", "Context occupancy, token-billed cost, and how much material fits", "Only training; inference is unaffected", "Nothing, since billing counts characters"],
        why_en: "Tokens are the unit of reading and billing: chunkier Chinese means the same content is pricier, fills more of the window and raises time-to-first-token — measure it on your own text before choosing a model."
      },
      {
        q: "需求是「答案必须随内部文档每天更新，且要能给出出处」。最合适的方案是？",
        o: ["每天重新微调一次模型", "RAG：检索当天文档并带引用作答", "把文档写进系统提示词里全量塞入", "把温度调到 0 让它记住"],
        a: 1,
        why: "易变的事实适合放在参数外的索引里：改一次文档只需重建索引，且引用可审计；每天微调既贵又慢还无法溯源。",
        q_en: "The answer must reflect internal documents updated daily, with sources. Which design fits?",
        o_en: ["Re-fine-tune the model every day", "RAG: retrieve today's documents and answer with citations", "Paste every document into the system prompt", "Set temperature to 0 so it remembers"],
        why_en: "Volatile facts belong in an index outside the weights: a document edit costs one re-ingest and citations stay auditable, whereas daily fine-tuning is slow, costly and untraceable."
      },
      {
        q: "判断：把采样温度设为 0 就可以消除模型的幻觉。",
        type: "judge", a: 1,
        why: "温度只决定在同一分布上怎么选。如果概率质量本就偏向错误内容，低温只会稳定地复现同一个错误；减少幻觉要改信息源（检索、上下文、训练）与校验。",
        q_en: "True or false: setting the sampling temperature to 0 eliminates hallucination.",
        why_en: "False. Temperature only selects within an existing distribution; if the mass already favours the wrong content, low temperature reproduces that error reliably. Cutting hallucination means changing the information source and adding checks."
      },
      {
        q: "想让前缀缓存（prompt caching）真正命中，必须把不变的内容放在提示词的 ______（填位置）。",
        type: "fill", ans: ["前面", "最前面", "开头", "前部", "靠前", "beginning", "前段"],
        why: "缓存按前缀匹配：长系统提示与检索前缀放前面、时间戳与用户名等可变内容放后面才可能命中；把时间戳写在第一行会让缓存永远失效。",
        q_en: "To actually hit prompt caching, the unchanging content must go at the ______ of the prompt. (Name the position.)",
        why_en: "Caching matches a prefix: put the long system prompt and retrieval prefix first and the variable parts (timestamp, user name) later. A timestamp on line one kills the cache forever."
      }
    ]
  },

  /* ---------- 词典：agi1 / agi2 各 6 条，分类沿用现有四类 ---------- */
  terms: [
    { term: "奖励塑形", term_en: "Reward Shaping", cat: "训练与数据",
      short: "在原始目标之外添加中间奖励，让稀疏信号变得可学。",
      short_en: "Adding intermediate reward on top of the goal so a sparse signal becomes learnable.",
      detail: ["稀疏奖励下学习信号几乎为零，塑造能把训练时间从跑不完缩到几小时。", "塑造的每一项都是可被利用的漏洞，必须单独记账、便于回退，并配人评对照。"],
      detail_en: ["Under sparse reward there is nearly no signal; shaping can cut training from unbounded to hours.", "Every shaped term is also a loophole: keep it itemised so it can be removed, and cross-check with human evaluation."],
      vs: "奖励塑形改的是学习信号，奖励设计定的是目标本身。",
      vs_en: "Shaping changes the learning signal; reward design defines the goal." },
    { term: "奖励黑客", term_en: "Reward Hacking", cat: "评测与安全",
      short: "策略精确优化了奖励函数，却背离了你真正想要的行为。",
      short_en: "The policy optimises the reward function exactly and betrays what you meant.",
      detail: ["典型表现：刷格式、重复免责句、原地转圈靠近目标、错得很有底气。", "背离信号是「训练奖励上升而人评不升」，出现就该停止更新而不是加大步数。"],
      detail_en: ["Typical forms: format gaming, boilerplate disclaimers, spinning near the target, confidently wrong output.", "The tell is training reward climbing while human ratings do not; stop there instead of taking more steps."],
      vs: "奖励黑客是目标写错后的必然结果，过拟合是模型记住了数据。",
      vs_en: "Reward hacking is the consequence of a mis-stated goal; over-fitting is the model memorising data." },
    { term: "探索与利用", term_en: "Exploration vs Exploitation", cat: "基础概念",
      short: "是试没试过的动作，还是选当前最好的动作，两者不可兼得。",
      short_en: "Try something new or take the current best — you cannot fully do both.",
      detail: ["ε-greedy 最简单，但 ε 衰减到多少、要不要彻底关掉，在稀疏奖励环境里决定成败。", "探索过早收敛会让策略永远见不到更优解，过度探索则学不到稳定行为。"],
      detail_en: ["Epsilon-greedy is simplest, but its floor and whether to switch it off decide success under sparse reward.", "Premature collapse never sees the better solution; endless exploration never settles on a behaviour."],
      vs: "探索关乎数据分布从哪来，利用关乎当前策略值不值。",
      vs_en: "Exploration is about where data comes from; exploitation is about what the current policy is worth." },
    { term: "同策略与异策略", term_en: "On-policy vs Off-policy", cat: "基础概念",
      short: "学习所用的策略与实际执行的动作是否为同一个。",
      short_en: "Whether the policy being learned is the one whose actions were taken.",
      detail: ["SARSA 同策略，稳但保守；Q-learning 离策略，直接逼近最优但会过估计。", "离策略能复用日志与他人数据，这正是离线强化学习与 RLHF 复用的基础。"],
      detail_en: ["SARSA is on-policy: stable but cautious. Q-learning is off-policy: aims at optimal but over-estimates.", "Off-policy lets you reuse logs and other agents' data, which underpins offline RL and reuse in RLHF."],
      vs: "同策略保证数据分布匹配但费样本，异策略省样本但要处理分布错位。",
      vs_en: "On-policy keeps the data distribution honest but burns samples; off-policy saves samples and must handle the mismatch." },
    { term: "经验回放", term_en: "Replay Buffer", cat: "训练与数据",
      short: "把历史交互存起来随机采样，打散轨迹相关性。",
      short_en: "Store past interactions and sample them randomly to break trajectory correlation.",
      detail: ["解决的是「连续样本高度相关破坏 SGD 假设」这个病，与目标网络互补。", "缓冲区多大、按什么优先级采样，决定新策略还能不能从很旧的经验里学到东西。"],
      detail_en: ["It cures 'consecutive samples break SGD's independence assumption', complementing the target network.", "Buffer size and prioritisation decide how much an early policy can still learn from very old experience."],
      vs: "经验回放复用自身历史，离线强化学习学别人留下的日志。",
      vs_en: "Replay reuses your own history; offline RL learns from logs someone else left behind." },
    { term: "目标网络", term_en: "Target Network", cat: "训练与数据",
      short: "把 TD 目标里的值函数冻结一段时间，提供不动的靶子。",
      short_en: "A frozen copy supplying the TD target so bootstrapping aims at something still.",
      detail: ["没有它，参数一动目标就追上来，自举更新容易发散。", "硬同步简单但会跳变，软更新（按 tau 混合）更平稳但跟踪变慢。"],
      detail_en: ["Without it the target moves with every update and bootstrapping diverges.", "Hard syncs are simple but jumpy; soft updates blended by tau are smoother but lag behind."],
      vs: "目标网络稳住学习靶子，梯度裁剪稳住单步幅度。",
      vs_en: "A target network steadies the target; gradient clipping steadies the step size." },
    { term: "分词器", term_en: "Tokenizer", cat: "训练与数据",
      short: "把文本切成 token 的组件，决定成本、窗口占用与语言公平性。",
      short_en: "The component that slices text into tokens, setting cost, window usage and per-language fairness.",
      detail: ["中文常一字占 1~3 token，同一段话与英文可差 1.5~3 倍，账单与延迟都按 token 算。", "词表小则序列更长更慢，词表大则参数与稀疏问题上升；多语言模型要在分词上给中文留够份额。"],
      detail_en: ["Chinese often costs 1-3 tokens per character, so identical passages can differ 1.5-3x from English in both bill and latency.", "A small vocab lengthens sequences; a large one inflates parameters and sparsity — multilingual models must reserve vocabulary for Chinese."],
      vs: "分词器决定文本变 token 的代价，上下文窗口决定一次能装多少 token。",
      vs_en: "The tokenizer sets what text costs in tokens; the context window sets how many tokens fit." },
    { term: "缩放定律", term_en: "Scaling Laws", cat: "基础概念",
      short: "损失随参数、数据、算力按经验比例下降的拟合规律。",
      short_en: "Empirical regularities of how loss falls with parameters, data and compute.",
      detail: ["它是预算工具：三者要按经验比例同涨，只堆参数不堆数据很快撞墙。", "它外推平均损失，不外推「我要的那个能力是否出现」，别把它当承诺。"],
      detail_en: ["Use it as a budgeting tool: the three must grow together in ratio, and piling parameters onto frozen data hits a wall fast.", "It extrapolates average loss, not whether the specific capability you need shows up — never read it as a promise."],
      vs: "缩放定律讲投入与损失的幂律关系，涌现讲指标随规模的不连续跳变。",
      vs_en: "Scaling laws relate spend to loss; emergence concerns discontinuous jumps in metrics as scale grows." },
    { term: "采样参数", term_en: "Sampling Parameters", cat: "应用与智能体",
      short: "温度、top-p、top-k 等决定如何从分布里挑下一个 token。",
      short_en: "Temperature, top-p and top-k decide how the next token is drawn from the distribution.",
      detail: ["温度改变分布形状，top-p 截断候选集合；两个同时猛调会把输出推到尾部噪声。", "它们不消除事实性错误，只会让同一类错误更稳定或更花哨。"],
      detail_en: ["Temperature reshapes the distribution, top-p truncates the candidate set; pushing both hard lands output in tail noise.", "Neither removes factual error; they only make the same error more stable or more imaginative."],
      vs: "采样参数管「怎么选」，检索与训练管「有没有正确的可选」。",
      vs_en: "Sampling decides which token to pick; retrieval and training decide whether a right one exists." },
    { term: "KV 缓存", term_en: "KV Cache", cat: "基础概念",
      short: "生成时缓存历史的 key/value，避免每步重算整段注意力。",
      short_en: "Cached keys and values so each new token does not re-attend over the whole history.",
      detail: ["它让逐 token 生成可行，但显存随窗口长度与并发线性上升。", "首 token 延迟由 prefill 决定，与吐字速度是两个独立瓶颈，要分开优化。"],
      detail_en: ["It makes token-by-token generation affordable, but memory grows linearly with window length and concurrency.", "Time-to-first-token is set by prefill and is a separate bottleneck from decode speed; optimise them apart."],
      vs: "KV 缓存省重算，前缀缓存省重复的 prefill。",
      vs_en: "The KV cache saves recomputation; prefix caching saves repeated prefill." },
    { term: "结构化输出", term_en: "Structured Output", cat: "应用与智能体",
      short: "用 schema、约束解码或函数调用把模型输出钉成可校验的数据。",
      short_en: "Schemas, constrained decoding or tool calls that pin model output into checkable data.",
      detail: ["格式崩坏在长输出上必然发生，靠「请务必输出 JSON」这类叮嘱挡不住。", "校验失败要有重试或降级分支，并且把失败样本回流到评测集。"],
      detail_en: ["Format collapse is inevitable on long outputs and cannot be talked away with 'please emit valid JSON'.", "Handle validation failure with retries or a fallback, and feed the failures back into your case set."],
      vs: "结构化输出保证形是对的，内容对不对仍要靠检索与校验。",
      vs_en: "Structured output guarantees the shape is right; correctness of content still needs retrieval and checks." },
    { term: "LLM 评审", term_en: "LLM-as-Judge", cat: "评测与安全",
      short: "用大模型给答案打分的自动评测方式，快但带系统偏差。",
      short_en: "Automated scoring by a model: fast and cheap, with systematic biases.",
      detail: ["已知偏差包括位置偏差、长度偏差、自家模型偏好与分数漂移。", "必须交换位置、固定评审提示词版本，并用人工标注的黄金集校准一致性。"],
      detail_en: ["Known biases include position preference, length preference, self-preference and score drift.", "Swap the order, version the judge prompt, and calibrate agreement against human-labelled golden cases."],
      vs: "LLM 评审便宜可规模化但可被讨好，人工标注慢而更接近业务真实。",
      vs_en: "Model judging is scalable but gameable; human labelling is slow but closer to business truth." }
  ],

  achievements: [
    { id: "rl_modeler", icon: "🎯", name: "奖励建模师", name_en: "Reward Modeller",
      desc: "完成 agi1 · 强化学习 全部课节", desc_en: "Finish every lesson of agi1 Reinforcement Learning",
      check: ["agi1"] },
    { id: "llm_operator", icon: "🧾", name: "大模型运维手", name_en: "LLM Operator",
      desc: "完成 agi2 · 大语言模型 LLM 全部课节", desc_en: "Finish every lesson of agi2 Large Language Models",
      check: ["agi2"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "同一个任务，三种建模决定三种难度：状态、动作、奖励": "One task, three modelling choices, three difficulty levels: state, action, reward",
    "1) 状态漏信息：只有一帧画面，学不到「红灯已经亮了三次」": "1) A state missing information: one frame cannot know the light has been red for three cycles",
    "2) 动作先粗后细：离散三档足够跑通，再考虑连续力矩": "2) Actions coarse before fine: three discrete steps get it running, torques come later",
    "3) 奖励只写目标，不写过程": "3) Write the goal in the reward, never the process",
    "写「靠近就加分」，原地来回走也能拿高分——这就是被钻空子": "'score for getting close' also pays for pacing in place — that is the loophole",
    "终点分稀疏但真实，中间分是塑造出来的，要单独记账以便回退": "The finish bonus is sparse but real; shaped points are invented and need their own line item so they can be reverted",
    "4) 回报要折扣累加，否则「十年后到」与「一秒后到」等价": "4) Accumulate the return with a discount, otherwise 'in ten years' equals 'in one second'",
    "贝尔曼一致性：当前值 = 即时奖励 + 折扣 * 后继状态的值": "Bellman consistency: current value = immediate reward + discount times the successor's value",
    "值迭代：反复套用同一行更新，直到几乎不再变化": "Value iteration: apply the same update until almost nothing changes",
    "有了 Q 就能直接贪心动作，不必另外保存策略": "With Q you can act greedily without storing a policy separately",
    "动作是连续的时候，上面这行 max 根本算不出来": "When actions are continuous, that max above is not computable at all",
    "这就是要换成策略梯度（agi1-4）的时刻": "This is exactly the moment to switch to policy gradients (agi1-4)",
    "DQN 一步更新：只有当前网络吃梯度，目标网络是不动的靶子": "One DQN update: only the live network takes gradient, the target network is a still mark",
    "1) 采样必须随机：连续轨迹之间高度相关，直接喂会训崩": "1) Sampling must be random: consecutive steps are correlated and feeding them straight collapses training",
    "2) TD 目标：episode 结束处没有未来值": "2) TD target: there is no future value at the end of an episode",
    "忘了 done 掩码，等于把两条无关的轨迹接成一条": "Drop the done mask and you splice two unrelated trajectories into one",
    "3) 让当前网络的 Q 去拟合这个目标": "3) Fit the live network's Q to that target",
    "4) 隔一段时间同步目标网络（或者每步软更新 tau）": "4) Sync the target network periodically (or blend by tau every step)",
    "5) 探索：ε 要衰减，且别在训练末期彻底归零": "5) Exploration: decay epsilon, but do not drive it fully to zero at the end",
    "PPO 代理目标：概率比越出 [1-eps, 1+eps] 就没有梯度": "PPO surrogate objective: once the probability ratio leaves [1-eps, 1+eps] there is no gradient",
    "优势为正时希望 r 变大，但被 clamp 封顶，防止一步跑太远": "With positive advantage r should grow, but the clamp caps it so one step cannot run too far",
    "优势必须标准化：不同 batch 量纲差很多": "Advantages must be normalised: batches differ wildly in scale",
    "不然你调的其实是学习率而不是策略步长": "Otherwise the knob you are tuning is the learning rate, not the policy step size",
    "old_logp 是采样时的事实，不是要优化的变量": "old_logp is a fact recorded at sampling time, not a variable to optimise",
    "第二道闸：实测 KL 超阈值就提前结束这一轮的复用": "The second gate: end this reuse round early once measured KL exceeds the threshold",
    "RLHF 的数据形态：同一个 prompt，两条回答，人只负责排序": "The shape of RLHF data: one prompt, two answers, and a human only ranks them",
    "奖励模型学的是「相对顺序」，不是绝对分数": "The reward model learns relative order, not an absolute score",
    "用排序损失，别去回归一个人类根本给不准的标量分": "Use a ranking loss; do not regress a scalar humans cannot assign consistently",
    "策略这一侧：奖励减去 KL，把优化钉在参考策略附近": "On the policy side: reward minus KL, nailing optimisation near the reference policy",
    "背离监控：奖励涨了但人评没涨，该停就停": "Divergence monitor: if reward rises but human ratings do not, stop",
    "继续加步数只会学会骗过奖励模型": "More steps from here only teaches it to fool the reward model",
    "一次跑分不能说明任何问题：多种子、报最差值、看曲线": "One score proves nothing: many seeds, report the worst, read the curve",
    "1) 多种子：区分「策略真好」与「这次运气好」": "1) Many seeds: separate 'the policy is good' from 'this run got lucky'",
    "2) 同时记录均值、最差值和学习曲线，而不只是最终得分": "2) Log mean, worst and the learning curve, not just the final score",
    "3) 汇报格式：均值加减标准差，并单列最差种子": "3) Report mean plus/minus standard deviation, and list the worst seed separately",
    "4) 仿真训完先做域随机化再上真机": "4) After training in simulation, randomise the domain before touching real hardware",
    "真机上只允许小步微调，且保留随时退回旧策略的开关": "On the real machine allow only small-step tuning, with a switch back to the old policy",
    "token 才是计费与窗口的单位，不是字数": "Tokens, not characters, are what the window and the bill count",
    "上下文预算必须提前算：系统提示 + 历史 + 检索片段 + 预留输出": "Budget the context up front: system prompt + history + retrieved chunks + reserved output",
    "词表是否对中文友好，要拿真实业务文本自己量": "Whether the vocab is kind to Chinese must be measured on your own text",
    "同一句话在中英两侧的 token 数比值就是「中文成本」": "The token ratio between the two languages is your Chinese cost factor",
    "缩放定律只告诉你预算怎么分，不保证能力出现": "Scaling laws only split the budget; they do not promise the capability appears",
    "因此先跑小规模验证任务，再决定要不要买那张大卡": "So run a small validation task before buying the big GPU",
    "SFT 样本的三要素：指令、输入、期望输出": "Three parts of an SFT sample: instruction, input, expected output",
    "少了输入或输出边界，模型就学不出「什么时候该停」": "Without input or output boundaries the model never learns when to stop",
    "开训之前先查数据集健康度这三项": "Check these three health metrics on the dataset before training",
    "1) 重复：同一条被过采样，模型会学会复读": "1) Duplicates: an oversampled row teaches the model to parrot",
    "2) 长度分布：训练答案都是五十字，线上就写不出长回答": "2) Length distribution: if every answer is fifty characters, production cannot write long ones",
    "3) 拒答样本必须显式存在，否则模型学成「什么都能答」": "3) Refusal examples must exist explicitly, or the model learns that everything is answerable",
    "LoRA 只训低秩增量：省显存，但秩太小会先掉复杂推理与中文": "LoRA trains only a low-rank delta: memory-cheap, but a rank too small loses hard reasoning and Chinese first",
    "一个可回归的提示词：角色 / 任务 / 输入 / 输出格式 / 判定标准": "A regressable prompt: role / task / input / output format / what counts as correct",
    "采样参数按任务定：抽取要稳，创意要活": "Set sampling by task: extraction wants stability, creative writing wants heat",
    "温度接近 0 才能让同样的输入给出同样的输出，回归才可比": "Only near-zero temperature gives identical outputs, which is what makes regressions comparable",
    "提示词版本与用例集一起提交，改一句话也要跑全量回归": "Commit the prompt version with the case set and rerun everything for one edited sentence",
    "RAG 三步：召回、重排、控预算，然后才交给模型": "RAG in three moves: recall, rerank, budget — only then hand it to the model",
    "阈值以上的二十段全塞进去，不如最相关的三段": "Twenty chunks above a threshold lose to the three most relevant ones",
    "多塞的代价是注意力稀释加双倍账单": "The extra chunks cost attention focus and double the bill",
    "必须给生成留出预算，否则上下文会挤掉输出长度": "Keep a generation budget or the context will squeeze out the output length",
    "引用要能回溯到原文位置，否则无法审计": "Citations must point back to a location or nothing is auditable",
    "也无法区分「资料里说的」与「模型自己补的」": "and you cannot tell the material's claim from the model's own addition",
    "检索为空是正常分支，不是异常": "Empty retrieval is a normal branch, not an exception",
    "让模型回答「资料中未找到」，别让它回去靠记忆编": "Have it answer 'not found in the material' instead of falling back on memory",
    "提示结构：不变在前、可变在后，前缀缓存才命中": "Prompt layout: static first, variable last, so the prefix cache can hit",
    "时间戳写在第一行，长系统提示就永远无法复用缓存": "A timestamp on line one makes a long system prompt uncached forever",
    "关键约束在结尾再复述一次，避开「中段命中率最低」": "Restate key constraints at the tail to dodge the weak middle of the window",
    "长材料先分段问答再汇总，比整篇丢进去更准": "Answer per chunk then synthesise beats dumping the whole document",
    "结构化输出加校验重试：格式崩坏要有退路": "Structured output plus validation and retry: format collapse needs an escape route",
    "不能只靠「请务必输出 JSON」这种口头恳求": "the polite request 'please output JSON' is not a mechanism",
    "成本账一次算清：token 单价乘输入输出，再乘请求量": "Do the cost maths once: unit price times in and out tokens, times request volume",
    "前缀缓存省的是输入侧的 prefill，不省输出 token": "Prefix caching saves input-side prefill, not output tokens",
    "模型评审必须交换位置，才能暴露「偏爱第一个答案」的位置偏差": "A model judge must swap positions to expose its preference for the first answer",
    "延迟要分开看：对话盯首 token，报告盯每秒 token": "Split latency: chat watches time-to-first-token, reports watch tokens per second",
    "冲突时信线上：离线涨分但失败率上升，是用例集失真": "When they conflict, trust production: offline gains with rising failures mean a stale case set"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_AGI12);
