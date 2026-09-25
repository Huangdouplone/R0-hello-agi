/* ================================================================
 * R0:hello agi · 课程深化层 ⑬（ma3 微积分基础 / ma4 概率与统计）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「数学基石」后半段（ma3/ma4）从每节 3 要点深化到 8 要点。微积分一章的重心是
 *       「梯度 ↔ 链式法则 ↔ 学习率 ↔ 数值步长」这条因果链；概率一章的重心是
 *       「抽样 ↔ 估计 ↔ 似然 ↔ 检验」这条证据链。两章各加一节「综合重构」收口课。
 * 写法约定（沿用已验收的 s12 样板）：
 *   1) 既有课节不写 title —— 合并时自动沿用主数据标题；
 *   2) 新课（m3-6 / m4-6）写 title / title_en / target / target_en，并且出现在 order 里；
 *   3) order 覆盖两章全部既有 id + 新增 id；quizAdd 用 {sid:[...]}；
 *   4) code 用 NumPy / 纯 Python，中文注释一律单独成行（行首 #），全部进 codeComments；
 *   5) summary_en 条数与中文严格相等且不含中文。
 * ================================================================ */

const DEEPEN_MA34 = {
  stages: ["ma3", "ma4"],

  order: {
    ma3: ["m3-1", "m3-2", "m3-3", "m3-4", "m3-5", "m3-6"],
    ma4: ["m4-1", "m4-2", "m4-3", "m4-4", "m4-5", "m4-6"]
  },

  lessons: {

    /* ===================== ma3 微积分基础 ===================== */
    "m3-1": {
      min: 12,
      summary: [
        "导数的定义是一个极限：f'(x) 等于 (f(x+h) − f(x))/h 当 h 趋于 0 时的值。它的实用读法不是「切线斜率」而是「局部线性近似的系数」——f(x+h) ≈ f(x) + f'(x)·h，整个优化领域就建在这条近似上。",
        "同一个东西有三个名字：几何上是斜率、物理上是瞬时速度、机器学习里是一阶灵敏度（「这个参数再挪一点，损失会动多少」）。第三种读法是做实验、调参、跑梯度检查时真正在脑子里跑的那一句。",
        "高阶导数描述「变化的变化」：f'' 是曲率。f'=0 且 f''>0 是局部极小、f''<0 是局部极大、f''=0 什么也说不出来（拐点或鞍点）；多元时 f'' 换成 Hessian 矩阵，判据变成「特征值全正 ⇒ 严格局部极小」——这里正好接上 ma2 的正定性。",
        "导数不一定存在：绝对值、max/min、ReLU 在 0 处、以及一切分段边界都是不可导点。深度网络里几乎每层都有 ReLU，所以「处处可导」从来不是事实；实践是取次梯度（ReLU 在 0 处给 0 或给 1 都算对），但你必须知道这是约定而不是定理。",
        "数值微分是把极限「提前截断」：d = (f(x+h) − f(x))/h。误差有两块且方向相反——截断误差约 O(h)（泰勒余项，h 越大越坏），舍入误差约 O(eps·|f|/h)（两个几乎相等的数相减会吃掉有效位，h 越小越坏）。两者之和有极小点，所以最优 h 约 √eps ≈ 1e-8；「h 取 1e-18 更精确」是彻底的误会。",
        "中心差商 (f(x+h) − f(x−h))/(2h) 把一阶误差项消掉，截断误差降到 O(h²)，最优 h 约 eps^(1/3) ≈ 6e-6。因此梯度检查永远用中心差商、h 取 1e-5 到 1e-6 量级；再往下 f(x+h) 与 f(x) 就成了同一个浮点数，商是 0 或纯噪声。",
        "什么时候会出错（一）：不连续与饱和。函数在 x 两侧斜率不同时，差商给出的是一个「介于两者之间」的假数；sigmoid/tanh 的饱和区里 f(x+h) 与 f(x) 的差异低于位宽，数值梯度恒为 0，你会以为实现写错了。",
        "衔接：这一节的前置是 ma1/ma2（向量与矩阵）以及 Python 路线的函数与浮点数。下一节把「一个变量的斜率」升级成「复合函数的导数」——链式法则，反向传播的全部数学。"
      ],
      summary_en: [
        "The derivative is defined by a limit: f'(x) is the value that (f(x+h) − f(x))/h approaches as h goes to 0. Its working reading is not 'slope of a tangent' but 'coefficient of the local linear approximation' — f(x+h) ≈ f(x) + f'(x)h — and the whole of optimisation stands on that line.",
        "The same object has three names: slope in geometry, instantaneous velocity in physics, first-order sensitivity in machine learning ('how much does the loss move if I nudge this parameter'). The third is what actually runs in your head during experiments, tuning and gradient checks.",
        "Higher derivatives describe the change of change: f'' is curvature. f' = 0 with f'' > 0 is a local minimum, f'' < 0 a local maximum, f'' = 0 says nothing (inflection or saddle). In several variables f'' becomes the Hessian and the test reads 'all eigenvalues positive means strict local minimum' — precisely where ma2's positive definiteness gets used.",
        "Derivatives need not exist: absolute value, max/min, ReLU at 0 and every piecewise boundary are non-differentiable. Nearly every layer of a deep network contains a ReLU, so 'everywhere differentiable' was never true; practice takes a subgradient (at 0 you may hand ReLU 0 or 1 and both are legal), but you must know it is a convention, not a theorem.",
        "Numerical differentiation truncates the limit early: d = (f(x+h) − f(x))/h. Two errors pull in opposite directions — truncation around O(h) from the Taylor remainder (worse for large h) and rounding around O(eps·|f|/h) because subtracting near-equal numbers devours significant digits (worse for small h). Their sum has a minimum, so the best h is about sqrt(eps) ≈ 1e-8, and '1e-18 must be more precise' is a complete misunderstanding.",
        "The central quotient (f(x+h) − f(x−h))/(2h) cancels the first-order error term, dropping truncation to O(h²), with an optimal h near eps to the one-third power ≈ 6e-6. That is why gradient checking always uses central differences with h around 1e-5 or 1e-6; go smaller and f(x+h) is literally the same float as f(x), so the quotient returns 0 or pure noise.",
        "Failure mode one: discontinuity and saturation. Where the slope differs on the two sides of x, the quotient returns a fake number somewhere between them; and in the saturated region of sigmoid or tanh the gap between f(x+h) and f(x) falls below the bit width, so the numerical gradient is exactly 0 and you blame your implementation.",
        "Bridge: prerequisites are ma1/ma2 (vectors and matrices) plus functions and floats from the Python route. Next we promote 'the slope of one variable' to 'the derivative of a composition' — the chain rule, which is all of the mathematics backpropagation needs."
      ],
      code: `def f(x):
    # 同一个函数：解析导数是 3x²-2，在 x=1 处应当等于 1.0
    return x ** 3 - 2 * x

x = 1.0
for h in [1e-2, 1e-5, 1e-8, 1e-14, 1e-18]:
    # 前向差商：h 太小会让 f(x+h) 与 f(x) 变成同一个浮点数
    print(h, (f(x + h) - f(x)) / h)
# 中心差商：截断误差从 O(h) 降到 O(h²)，同量级步长下明显更准
print((f(x + 1e-5) - f(x - 1e-5)) / (2 * 1e-5))
# 机器 eps 决定一切：float64 约 2.2e-16，最优步长在平方根与立方根量级
eps = 2.220446049250313e-16
print(eps ** 0.5, eps ** (1 / 3))
# 不可导点：abs 在 0 处前向差商给 1、中心差商给 0，两者都不是导数
print((abs(1e-6) - abs(0.0)) / 1e-6, (abs(1e-6) - abs(-1e-6)) / (2 * 1e-6))`,
      pit: "把数值梯度的步长设成 1e-16 来「更精确」：此时 f(x+h) 与 f(x) 在 float64 下是同一个数，差商恒为 0 或只有舍入噪声，于是你看到「梯度全是 0」，回头去改本来正确的反向传播。规则是中心差商用 1e-5、前向差商用 1e-8，并且比较相对误差而不是绝对误差。",
      pit_en: "Choosing h = 1e-16 for a numerical gradient 'to be more precise': at that size f(x+h) and f(x) are the same float64, so the quotient is 0 or pure rounding noise, and you go off to 'fix' a backpropagation implementation that was already correct. The working rule is h = 1e-5 for central and 1e-8 for forward differences, and always compare relative, not absolute, error.",
      ex: {
        q: "为什么数值微分的误差曲线是「先降后升」的 U 形，而不是 h 越小越准？",
        a: "因为总误差约等于截断项 C₁h（泰勒余项）加上舍入项 C₂eps/h（两数相减丢有效位）：h 大时第一项主导，h 小时第二项主导，极小点落在两项相等处，前向差商约 √eps、中心差商约 eps 的立方根。",
        q_en: "Why does numerical differentiation error form a U — down then up — instead of shrinking as h gets smaller?",
        a_en: "Because total error is roughly C₁h (truncation from the Taylor remainder) plus C₂eps/h (rounding from cancelling significant digits): the first dominates for large h, the second for tiny h, and the minimum sits where they balance — near the square root of eps for forward and the cube root for central differences."
      }
    },

    "m3-2": {
      min: 14,
      summary: [
        "起步只需一张表：常数 0、xⁿ 的导数是 n·xⁿ⁻¹、eˣ 仍是 eˣ、ln x 是 1/x、sin 与 cos 互换，再加乘积法则 (uv)' = u'v + uv' 与商法则。深度学习里 90% 的求导都是这张表配上链式法则，别的一律交给自动求导。",
        "链式法则：复合函数的导数等于「外层导数在外层输出处取值」再乘「内层导数」。它的本质是局部导数连乘——每一段只需要知道自己那一层的导数，这正是「一个可微程序可以被自动求导」的原因。",
        "反向传播 = 链式法则 + 动态规划：从损失出发沿计算图反向，每个节点缓存「损失对它的输出的导数」，乘上本层局部雅可比就得到「损失对它的输入的导数」。保存中间激活就是为了这一步——也是显存换计算、按层重算（checkpointing）这些工程手段的数学解释。",
        "多元链式最容易错的是形状而不是导数：标量损失对矩阵的梯度必须与该矩阵同形状。实践里没人写雅可比张量，而是写「上游梯度乘局部导数，再做必要的求和与转置」——∂L/∂W 写成 δᵀx 还是 xᵀδ，完全取决于你「行是样本还是列是样本」的约定（见 m1-2）。",
        "一条硬规则：梯度的形状必须与参数完全相同，且反向实现要先在小张量上手算一次，再用中心差商逐元素拨动对照（相对误差到 1e-7 量级才算通过）。这一步叫梯度检查，是本章与可运行代码之间最重要的桥。",
        "sigmoid 与饱和：σ' = σ(1−σ)，最大只有 0.25。多层 σ' 连乘会让梯度按 0.25 的幂衰减——这就是梯度消失的算术版本；也正是激活换成 ReLU/GELU、加归一化层与残差的动机。链式法则把「层数太深为什么会消失或爆炸」变成一个可以直接算出来的数。",
        "反向图还要记住「谁复制、谁求和」：加法把上游梯度原样分给每个输入，而被复制或广播用过的那一路必须把梯度沿广播维加起来；这就是为什么 batch 归约写成求和还是平均，会直接改变每个参数的梯度尺度（等效于偷偷改学习率）。",
        "衔接：上一节有了「一个变量的斜率」，这一节把「复合」讲完；下一节把导数摆进多变量空间，得到梯度、方向导数与等高线的关系。"
      ],
      summary_en: [
        "One table is enough to start: constants give 0, x^n gives n·x^(n−1), eˣ stays eˣ, ln x gives 1/x, sin and cos swap, plus the product rule (uv)' = u'v + uv' and the quotient rule. Ninety percent of differentiation in deep learning is that table plus the chain rule; everything else goes to autodiff.",
        "The chain rule says the derivative of a composition is the outer derivative evaluated at the outer output, times the inner derivative. Its essence is 'multiply local derivatives', and because each piece only needs to know its own layer, that is exactly why a differentiable program can be differentiated automatically.",
        "Backpropagation is the chain rule plus dynamic programming: walk backwards from the loss along the graph, keep at each node 'the derivative of the loss with respect to its output', multiply by this layer's local Jacobian and you obtain 'with respect to its inputs'. Storing activations exists for that step, which is the mathematical reading of the memory-for-compute trade and of activation checkpointing.",
        "In multivariate chains the mistakes are about shape, not differentiation: the gradient of a scalar loss with respect to a matrix must share that matrix's shape. Nobody writes Jacobian tensors in practice; the working form is 'upstream gradient times local derivative, then sum or transpose as needed', and whether the gradient is δᵀx or xᵀδ depends purely on your rows-are-samples versus columns-are-samples convention (see m1-2).",
        "One hard rule: the gradient's shape must equal the parameter's shape exactly. Every hand-written backward should first be derived on a tiny tensor by hand, then checked element by element with central differences, passing at relative error near 1e-7. That is gradient checking, the most important bridge between this chapter and working code.",
        "Sigmoid saturates: σ' = σ(1−σ) peaks at 0.25. Multiplying several such factors makes the gradient decay like a power of 0.25, which is the arithmetic version of vanishing gradients and the reason ReLU/GELU, normalisation layers and residual connections took over. The chain rule turns 'why do deep networks stall' into a number you can compute.",
        "A backward graph also remembers who copies and who sums: addition passes the upstream gradient unchanged to each input, while any branch that was broadcast or repeated must add its gradient back along the broadcast axes — which is precisely why choosing sum versus mean over the batch silently rescales every parameter's gradient, as if the learning rate had been changed.",
        "Bridge: the previous section produced a slope for one variable; this one finishes composition. Next we place derivatives in multivariable space and get gradients, directional derivatives and their relationship to contour lines."
      ],
      code: `import numpy as np

def sigmoid(z):
    # 单个神经元的激活：把任意实数压进 0 到 1
    return 1.0 / (1.0 + np.exp(-z))

x = np.array([1.0, 2.0])
y = 1.0
w = np.array([0.7, -0.2])

def loss(v):
    # 平方损失：前面的 0.5 让求导后系数刚好为 1
    return 0.5 * (sigmoid(v @ x) - y) ** 2

a = sigmoid(w @ x)
# 反向：三段局部导数从后往前连乘，就是链式法则
dL_da = a - y
# sigmoid 的导数只依赖它自己的输出，最大只有 0.25
da_dz = a * (1 - a)
dz_dw = x
g_ana = dL_da * da_dz * dz_dw
# 梯度形状必须与参数一致：这条断言能挡住大多数广播错误
assert g_ana.shape == w.shape
h = 1e-5
g_num = np.zeros_like(w)
for k in range(len(w)):
    # 梯度检查：每次只拨一个参数，用中心差商当金标准
    e = np.zeros_like(w)
    e[k] = h
    g_num[k] = (loss(w + e) - loss(w - e)) / (2 * h)
# 比相对误差不比绝对误差：1e-7 量级才算实现正确
print(np.max(np.abs(g_ana - g_num) / (np.abs(g_ana) + np.abs(g_num) + 1e-8)))
print(da_dz, da_dz.max())`,
      pit: "把「梯度形状对了」当成「梯度算对了」：广播与求和写错时，形状可以完全正确而数值系统性偏大（例如 batch 维求和忘了除以 n，等效于把学习率放大 n 倍）。唯一可信的验收是中心差商的梯度检查，而且要同时看相对误差和「误差最大的元素」出现在哪一层。",
      pit_en: "Treating 'the gradient has the right shape' as 'the gradient is right': a misplaced broadcast or reduction gives a perfectly shaped tensor whose values are systematically off — summing over the batch instead of averaging is exactly a learning rate inflated n-fold. The only credible acceptance test is a central-difference gradient check, read both as relative error and as which layer holds the worst element.",
      ex: {
        q: "为什么反向传播要「保存前向的中间结果」？不能重新算一遍吗？",
        a: "因为局部导数要用前向的激活值来表达（例如 σ' 只依赖 σ 本身、ReLU 的导数只依赖输入是否为正），存下一个数就把一次整层重算换成一次乘法；能不存的场景确实存在，那就是显存不够时按层重新前向（checkpointing），用时间换内存。",
        q_en: "Why does backpropagation have to keep the forward intermediates? Could it not recompute them?",
        a_en: "Because local derivatives are expressed with forward activations (σ' depends only on σ, ReLU's derivative only on the sign of its input), so storing one number buys an O(1) multiplication instead of a full extra forward pass. Recomputation is a real option — activation checkpointing — used exactly when memory, not time, is the binding constraint."
      }
    },

    "m3-3": {
      min: 13,
      summary: [
        "偏导的定义是「只动这一个变量、其余当常数」，它就是固定其它坐标后那条曲线的斜率。单个偏导只告诉你沿坐标轴走的情形，对任意方向一无所知——这正是把偏导拼成向量的动机。",
        "梯度是把各偏导排成的向量，它不是斜率而是方向，有两个等价身份：① 函数增加最快的方向；② 等值面 f = c 在该点的法向量。方向导数等于梯度点乘单位方向；由柯西-施瓦茨不等式，它在方向与梯度同向时取到最大值 ‖∇f‖、垂直时为 0——这就是「梯度指向上升最快」的全部证明。",
        "因此负梯度是「当前点、单位步长下」下降最快的方向。这两个限定很重要：它不指向最优点，也不告诉你该走多远。等值面是扁椭球时（曲率病态、条件数大），负梯度几乎与「朝最优点去」的方向垂直，于是一步步走成锯齿——这就是 m2-5 的条件数在优化里的具体表现。",
        "尺度与标准化为什么必须做：梯度的每个分量都自带该特征的单位，一个特征用「米」、另一个用「厘米」时，同一个学习率对两者完全不均衡。标准化把 Hessian 的特征值范围压小，让梯度下降从锯齿走向直线——这与 ma2 的条件数、正定性是同一件事的不同外衣。",
        "计算图上的偏导有明确的归约规则：求和把上游梯度原样复制给每个输入；求均值要多乘 1/n；max/argmax 只把梯度给胜出者；广播出去的那一路要把梯度沿广播维加起来。跨设备训练时「每个设备的梯度是求和还是平均」是最高频的形状对、数值错的事故点。",
        "梯度为 0 只说明是驻点：极小、极大或鞍点都可能。维度越高鞍点越常见（二次型问题的临界点几乎都是鞍点而不是极小），一阶方法会在鞍点附近被数据噪声踢开；想识别鞍点要看 Hessian 的特征值符号——有正有负就是鞍点。",
        "数值实现的两条注意：其一，梯度范数突然变大就是爆炸、要裁剪，恒等于 0 就是饱和、学习率过小、或者标签/掩码错位；其二，做梯度检查前务必关掉 dropout 与随机增广并固定种子，否则两次前向用的根本不是同一张网。",
        "衔接：上一节解决了「怎么求导」，这一节给出「往哪走」。下一节把它变成真正的参数更新——梯度下降、学习率的硬边界与小批量的取舍。"
      ],
      summary_en: [
        "A partial derivative means 'move this variable only, hold the rest fixed' — the slope of the curve you get by freezing every other coordinate. One partial tells you nothing about arbitrary directions, which is exactly the motive for assembling partials into a vector.",
        "The gradient is the vector of partials, and it is a direction rather than a slope with two equivalent identities: the direction of fastest increase, and the normal to the level surface f = c at that point. The directional derivative is the gradient dotted with a unit direction; by Cauchy-Schwarz it is maximal, equal to the gradient's norm, when the two align and zero when perpendicular — that is the entire proof that 'the gradient points uphill fastest'.",
        "Hence minus the gradient is the fastest descent at the current point for a unit step. Both qualifiers matter: it does not point at the optimum and says nothing about how far to go. When level sets are flat ellipsoids (pathological curvature, large condition number) the negative gradient is nearly perpendicular to 'towards the optimum' and the iterates zig-zag — the condition number of m2-5 showing up inside optimisation.",
        "Why scaling and standardising are mandatory: every gradient component carries its feature's units, and if one feature is measured in metres while another in centimetres, a single learning rate is simply wrong for both. Standardising shrinks the spread of Hessian eigenvalues and turns zig-zag into a straight line — the same fact as condition number and positive definiteness from ma2, in different clothing.",
        "Partials on a computation graph have explicit reduction rules: a sum passes the upstream gradient unchanged to each input; a mean multiplies by one over n; max/argmax gives gradient only to the winner; anything broadcast must have its gradient added back along the broadcast axes. Across devices, 'sum or average when reducing gradients' is the classic right-shape-wrong-number incident.",
        "A zero gradient only says stationary: minimum, maximum or saddle. Higher dimensions make saddles the norm rather than the exception (for quadratic forms nearly every critical point is a saddle), and first-order methods escape them thanks to data noise; to tell them apart you must read the signs of the Hessian's eigenvalues.",
        "Two numerical cautions: a gradient norm that suddenly spikes means explosion and wants clipping, while one that is identically zero means saturation, an absurdly small learning rate, or misaligned labels and masks. And before any gradient check, disable dropout and random augmentation and fix the seed — otherwise the two forward passes are not even the same network.",
        "Bridge: the last section showed how to differentiate; this one gives where to walk. Next comes the actual parameter update — gradient descent, its hard stability limit, and the batch-size trade-off."
      ],
      code: `import numpy as np

def f(p):
    # 一个椭圆碗：y 方向的曲率是 x 方向的 3 倍
    x, y = p
    return x * x + 3.0 * y * y

def grad(p):
    # 梯度：把各偏导拼成向量，指向上升最快的方向
    x, y = p
    return np.array([2 * x, 6 * y])

p = np.array([1.0, 1.0])
g = grad(p)
# 方向导数等于梯度点乘单位方向：最大值为 ‖g‖，出现在梯度方向上
for theta in np.linspace(0, 2 * np.pi, 5):
    d = np.array([np.cos(theta), np.sin(theta)])
    print(round(float(g @ d), 4))
# 与梯度垂直的方向上，一阶近似下函数值不变：那就是等高线的切向
perp = np.array([-g[1], g[0]]) / np.linalg.norm(g)
print(round(float(g @ perp), 12))
# 负梯度下降：在扁碗里几乎只是横着走，下一步甩回另一边，形成锯齿
for _ in range(6):
    p = p - 0.15 * grad(p)
    print(np.round(p, 4), round(f(p), 5))`,
      pit: "检查梯度时忘了关掉 dropout 或随机裁剪：两次前向用的是不同的随机掩码，中心差商算出来的「数值梯度」天生就抖，与解析梯度的相对误差永远在 1e-1 附近晃。你于是怀疑实现有 bug，去改本来正确的代码。梯度检查之前，固定随机种子、关掉一切随机层，并且用同一批数据。",
      pit_en: "Forgetting to disable dropout or random cropping during a gradient check: the two forward passes used different random masks, so the numerical gradient is inherently noisy and its relative error hovers near 1e-1 forever. You then suspect the implementation and start changing code that was correct. Before checking gradients, fix the seed, disable every stochastic layer, and reuse the same batch.",
      ex: {
        q: "为什么「梯度方向是上升最快」这句话里必须要求方向是单位向量？",
        a: "因为方向导数是梯度与方向的点乘，等于两者模长再乘夹角的余弦；只有把方向的模长固定为 1，比较才只关于角度。否则「取一个更长向量」就能伪装成更快上升，说法失去意义——这也正是方向由梯度给出、步长由学习率给出的分工来源。",
        q_en: "Why must the direction be a unit vector in the statement 'the gradient is the direction of fastest increase'?",
        a_en: "Because the directional derivative is the dot product, i.e. both norms times the cosine of the angle, so only with the direction's norm pinned to 1 does the comparison depend on the angle alone. Otherwise any direction with a longer vector would fake a faster increase and the claim would be empty — which is exactly why direction comes from the gradient and length from the learning rate."
      }
    },

    "m3-4": {
      min: 13,
      summary: [
        "更新式「参数减去学习率乘梯度」的来源：把损失在当前点做一阶泰勒近似成一个平面，平面本身没有最低点，于是人为加一个「这一步别走太远」的约束；在该约束下让近似下降最多的方向恰好是负梯度，步长就是那个约束半径。学习率不是天上掉下来的超参，它是这个约束的化身。",
        "学习率有可以算出来的硬边界：对二次函数，梯度下降收敛当且仅当 η < 2/λmax，而渐近最快的取法是 η = 2/(λmin + λmax)。这一条给出两个实用结论：上界由曲率决定，而「能开多大」取决于病态程度，收敛率约为 ((κ−1)/(κ+1))²，κ 就是条件数。",
        "太大与太小的症状完全不同：太大 loss 抖动、上升、变 inf/nan（发散）；太小 loss 几乎不动但看着「很稳」，很多人误判为已收敛。标准做法是固定小 batch 做学习率扫描（1e-5 一路到 1e-1，各跑几十步），看哪一段下降最快，再配 warmup 与衰减。",
        "批量、小批量与随机：全批量梯度准但每步昂贵、泛化一般；小批量的梯度估计有噪声，方差大致与 1/B 成正比（B 为批大小），所以放大 batch 时学习率可近似线性放大，直到「临界 batch」为止——这正是大 batch 训练的线性缩放规则与 warmup 的来源，说明 warmup 是算术而不是仪式。",
        "动量与自适应只是「怎么用好同一个梯度」：动量给梯度做指数滑动平均，等价于在低曲率方向上累积加速、在高曲率方向上互相抵消，因此专治锯齿；Adam 用二阶矩做逐参数的尺度归一化，等于给每个方向一个自己的学习率。两者都不改变「沿负梯度下降」的本质，也不保证落在更好的点上。",
        "梯度裁剪有两种：按范数缩放到阈值（长度变、方向不变）和逐元素 clamp（方向也变，可能把有效信息削平）。RNN 与大模型的标配是全局范数裁剪，并且要注意分布式训练下必须先聚合出全局范数再裁，否则每个设备各裁一次等于裁了两遍。",
        "局部极小、鞍点与平坦区：非凸问题里一阶方法只能保证到达驻点。实践中「卡住」的多数是高维鞍点与平坦区，靠 SGD 噪声与动量推出去；loss 出现平台不代表结束，因为不同子集与不同层以不同速度收敛，判停要靠验证集指标而不是 loss 曲线的形状。",
        "衔接：本节只用了一阶信息。下一节补上二阶——泰勒展开与 Hessian——那是学习率、动量与牛顿法共同的底座，也是「凸性」这个概念唯一真正有用的地方。"
      ],
      summary_en: [
        "Where the update 'parameters minus rate times gradient' comes from: approximate the loss by its first-order Taylor model at the current point, note that a plane has no minimum, then impose 'do not step too far'. Under that constraint the steepest decrease of the model is exactly minus the gradient, with length equal to the constraint radius. The learning rate is not a superparameter dropped from the sky; it is that constraint wearing a name.",
        "The rate has a computable hard limit: on a quadratic, gradient descent converges if and only if η < 2/λmax, and the asymptotically fastest value is η = 2/(λmin + λmax). Two practical readings follow: the ceiling is set by curvature, and how high you may go depends on how pathological the problem is, since the rate behaves like ((κ−1)/(κ+1))² where κ is the condition number.",
        "Too big and too small fail in different ways: too big makes the loss oscillate, climb, or turn into inf/nan; too small leaves a nearly flat curve that looks calm and is routinely misread as convergence. The standard fix is a rate sweep on a small batch, tens of steps each from 1e-5 up to 1e-1, take the fastest-decaying region, then wrap warmup and decay around it.",
        "Full batch, mini batch, stochastic: full-batch gradients are accurate, expensive per step and mediocre in generalisation; mini-batch estimates carry noise whose variance scales roughly like 1/B, which is why the learning rate can be scaled almost linearly with batch size up to a critical batch — the origin of the linear-scaling rule and of warmup, so warmup is arithmetic rather than ritual.",
        "Momentum and adaptivity only change how one gradient is used: momentum keeps an exponentially damped average of gradients, accumulating speed along low-curvature directions and cancelling oscillation along high-curvature ones, so it is an antidote to zig-zag; Adam normalises per parameter with a second moment, giving each direction its own effective step. Neither changes the essence of descending along minus the gradient, and neither promises a better point to land on.",
        "Clipping comes in two kinds: rescaling the whole gradient to a norm cap (length changes, direction does not) and elementwise clamping (direction changes too, and useful signal can be shaved off). Global-norm clipping is the default for RNNs and large models, and under distribution you must reduce to a global norm first, because clipping per device amounts to clipping twice.",
        "Local minima, saddles and flat regions: on non-convex problems first-order methods only guarantee a stationary point. What stalls training in practice is usually high-dimensional saddles and plateaus, which SGD noise and momentum push through; a plateau is not an ending, since subsets and layers converge at different speeds, so stopping is decided by a validation metric rather than by the shape of a curve.",
        "Bridge: this section used only first-order information. Next comes the second order — Taylor expansion and the Hessian — the shared foundation of learning rates, momentum and Newton's method, and the only place where 'convexity' genuinely earns its keep."
      ],
      code: `import numpy as np

def L(v):
    # 条件数为 10 的二次碗：两个方向的曲率分别是 2 与 20
    return v[0] ** 2 + 10 * v[1] ** 2

def grad(v):
    return np.array([2 * v[0], 20 * v[1]])

w0 = np.array([1.0, 1.0])
for eta in [0.05, 0.09, 0.11]:
    p = w0.copy()
    hist = []
    for _ in range(60):
        # 更新式：参数减去学习率乘梯度
        p = p - eta * grad(p)
        hist.append(L(p))
    # 上限 2/λmax 等于 0.1：η=0.11 直接发散；最快点 2/(λmin+λmax) 约 0.0909
    print(eta, round(hist[0], 4), round(hist[2], 4), hist[-1])
gvec = np.array([3.0, 4.0])
# 梯度裁剪：只缩长度、不改方向
print(gvec * min(1.0, 1.0 / np.linalg.norm(gvec)))
m = np.zeros(2)
p = w0.copy()
for _ in range(40):
    # 动量：低曲率方向累积、高曲率方向抵消，专治锯齿
    m = 0.9 * m + grad(p)
    p = p - 0.02 * m
print(p, L(p))`,
      pit: "在 float32 里把学习率调到 1e-8 附近，然后判定「模型学不动」：更新量已经小于参数值乘 2⁻²⁴，被舍入直接吃掉，参数一点没动而 loss 曲线看上去只是「下降很慢」。这正是混合精度训练必须保留 fp32 主权重（master weights）的原因——低位宽存权重可以，低位宽做累加更新不行。",
      pit_en: "Turning the learning rate down to about 1e-8 in float32 and then concluding 'this model cannot learn': the step is below the parameter times 2⁻²⁴, so rounding swallows it, the parameters literally never move, and the loss merely looks like it is descending slowly. That is exactly why mixed-precision training keeps fp32 master weights — storing weights in low precision is fine, accumulating updates in it is not.",
      ex: {
        q: "为什么放大 batch 时通常可以近似线性放大学习率，而且还要配一段 warmup？",
        a: "因为小批量梯度的方差约与 1/B 成正比，噪声变小后允许更大的步长，于是「一个 epoch 的总下降量」可以保持；但训练初期梯度方向本身很不稳定，一上来就用满额的大学习率会把参数打飞，所以先以小 lr 走一段 warmup，等二阶统计量与动量估计稳定后再升到目标值。",
        q_en: "Why can the learning rate usually be scaled almost linearly with batch size, and why still needs a warmup?",
        a_en: "Because mini-batch gradient variance scales like 1/B, so a larger batch tolerates a larger step and the progress per epoch stays comparable. But early in training the gradient direction itself is unreliable, so opening at the full scaled rate would blast the parameters away; warmup holds the rate low until the second-moment and momentum estimates have settled."
      }
    },

    "m3-5": {
      min: 12,
      summary: [
        "积分是导数的逆运算，几何上是面积、应用上是累积量：概率里「密度曲线下的面积就是概率」，连续期望 ∫x·p(x)dx 正是离散求和 E[X]=Σx·P(x) 的连续版本（m4-3）——损失函数里出现积分，多半是在算一个归一化常数。",
        "那个算不出来的积分就是配分函数 Z（所有 exp(−能量) 的总和或积分）。它是对比学习、变分推断、MCMC 存在的根本理由：一旦 Z 无法计算，似然就用不了，于是大家改学「不需要 Z 的东西」（比值、得分、下界）。知道这一点，才知道深度学习为什么偏爱判别式目标。",
        "softmax 与注意力是同一件事的离散版：分母那个求和就是「离散积分」，所以数值上一律先减最大值再取指数——exp 溢出与 log 下溢都在这一行被解决；连续情形对应的替代手段是拉普拉斯近似与变分界，同一个「先归一、再近似」的思路。",
        "泰勒展开是用多项式在一点附近逼近复杂函数：f(x+Δ) ≈ f(x) + f'Δ + ½f''Δ²。展开点越远、函数越弯，近似越不可信——这解释了优化为什么必须小步走、并且每一步都要在新位置重新线性化；「迭代」两个字说的就是这件重做的事。",
        "深度学习几乎所有方法都从一阶模型出发：一阶泰勒说「往负梯度走一定降」，但平面没有最低点，所以必须限制步长——学习率就是这个限制的化身（m3-4）。换句话说：只用一阶信息，就必须自己规定走多远。",
        "二阶模型有最低点：把 ½f''Δ² + f'Δ 求导置零，得 Δ* = −f'/f''，这就是牛顿法。f'' 大意味着曲率陡、步长自动变小；f'' 趋于 0 意味着平台或鞍点、步长失去约束（需要信任域或退回一阶）。多元版本把 f'' 换成 Hessian，Δ = −H⁻¹g，对二次函数一步到位，但对真实大模型完全算不动。",
        "二阶信息的代价与替代方案：n 个参数的 Hessian 有 n² 项（1e8 参数就是 1e16 个元素），所以现实是拟牛顿（BFGS/L-BFGS 用梯度差近似 H，只存几条历史）、Gauss-Newton 与 Fisher 近似（Adam 可视为其对角近似）、K-FAC，以及 Hessian-向量积（双反向传播，O(n) 内存，用来「测量」曲率而不是「存储」曲率）。",
        "凸性与局部极小：函数凸等价于图上任意弦不低于函数，也（二阶可导时）等价于 f'' 非负、Hessian 半正定，还等价于「任何局部极小都是全局极小」。线性回归、逻辑回归、岭回归都凸，所以「换个初始化结果不同」在这些模型里不该发生；神经网络非凸，因此「局部极小」在深度学习里几乎没有正面意义，真正的主角是曲率谱、条件数、优化器与数据顺序。衔接：ma3 的收口课（m3-6）会把求导、链式与步长合成一次可跑的自查实验。"
      ],
      summary_en: [
        "Integration inverts differentiation: geometrically area, operationally accumulation. In probability the area under a density is a probability, and the continuous expectation of x·p(x) is exactly the continuous twin of the discrete weighted sum from m4-3 — so when an integral shows up in a loss, it is usually a normalising constant.",
        "That uncomputable integral is the partition function Z, the total of exp(−energy) over everything. It is the fundamental reason contrastive learning, variational inference and MCMC exist: once Z is intractable the likelihood is unusable, so one learns something that does not need it — ratios, scores, bounds. Knowing this explains why deep learning prefers discriminative objectives.",
        "Softmax and attention are the discrete version of the same business: the denominator sum is a 'discrete integral', so numerically one always subtracts the maximum before exponentiating, and that single line kills both exp overflow and log underflow. In the continuous case the substitutes are Laplace approximation and variational bounds — the same normalise-then-approximate idea.",
        "A Taylor expansion approximates a complicated function near a point by a polynomial: f(x+Δ) ≈ f(x) + f'Δ + ½f''Δ². The farther from the expansion point and the curvier the function, the less trustworthy it is — which is why optimisation must take small steps and re-linearise at every new position. That re-linearisation is what the word 'iterative' actually means.",
        "Almost everything in deep learning starts from the first-order model: the linear approximation says walking along minus the gradient decreases the loss, but a plane has no bottom, so the step length must be imposed externally — the learning rate is that imposition. In short: first order only means you must decide how far to go yourself.",
        "The second-order model does have a bottom: differentiate ½f''Δ² + f'Δ and set it to zero, giving Δ* = −f'/f'', which is Newton's method. Large f'' means sharp curvature and an automatically short step; f'' near zero means a plateau or saddle and an unbounded step (hence trust regions or a fallback to first order). The multivariate version swaps f'' for the Hessian, Δ = −H⁻¹g, is exact in one step on a quadratic — and completely unaffordable on a large model.",
        "The price of second-order information and its substitutes: a Hessian over n parameters has n² entries (1e16 for 1e8 parameters), so reality is quasi-Newton (BFGS and L-BFGS approximate it from gradient differences keeping a few histories), Gauss-Newton or Fisher approximations (Adam reads as a diagonal one of these), K-FAC, and Hessian-vector products via double backprop, which cost O(n) memory and measure curvature instead of storing it.",
        "Convexity and local minima: a function is convex when every chord lies on or above its graph, equivalently (twice differentiable) when its second derivative is non-negative or its Hessian positive semi-definite, equivalently when every local minimum is global. Linear regression, logistic regression and ridge are convex, so 'different initialisation, different answer' should never happen there; neural networks are non-convex, which is why 'local minimum' carries almost no positive meaning in deep learning and the real characters are the curvature spectrum, the condition number, the optimiser and the data order. Bridge: the closing section m3-6 turns derivatives, chains and step sizes into one runnable self-check experiment."
      ],
      code: `import math

def f(x):
    # 指数函数：每一阶导数都是它自己，是最好的泰勒教具
    return math.exp(x)

def taylor(x, n):
    # n 阶泰勒多项式在 0 附近的逼近
    return sum(x ** k / math.factorial(k) for k in range(n + 1))

for x in [0.1, 1.0, 5.0]:
    # 越远离展开点，需要越高阶才追得上：局部近似只保证局部
    print(x, f(x), round(taylor(x, 3), 4))
a1, a2 = -3.0, 4.0
# 二阶模型的最低点：最优步长等于负的一阶导除以二阶导，这就是牛顿步
step = -a1 / a2
print(step, a2 > 0)
# 曲率大就步子小，曲率趋于 0 则步长失去约束，必须退回一阶或加信任域
print(-a1 / (a2 * 10), -a1 / (a2 * 0.01))
# 一维凸性检查：x 的四次方的二阶导 12x² 处处非负，所以是凸函数
print([round(12 * t * t, 3) for t in [-2.0, 0.0, 2.0]])
# 连续期望就是积分：均匀分布下 x 的平方在 0 到 1 的积分等于三分之一
print(1.0 / 3.0, sum(((i + 0.5) / 10000) ** 2 for i in range(10000)) / 10000)`,
      pit: "把「二阶方法更精确」直接推成「那就上牛顿法」：真实模型的 Hessian 既不是正定也不是常数，含鞍点与平台时牛顿步会朝着负曲率方向被弹飞；而且 n² 的存储与每次 O(n³) 的求解在参数量千万级就已不可行。可靠的用法是把二阶信息当「诊断量」——算 Hessian-向量积、看曲率特征值的范围，用来选学习率与判断是否真的收敛。",
      pit_en: "Reading 'second order is more accurate' as 'then use Newton': in real models the Hessian is neither positive definite nor constant, and at saddles or plateaus the Newton step launches you along a negative-curvature direction; besides, n² storage and an O(n³) solve are hopeless past a few tens of millions of parameters. The dependable use of second-order information is diagnostic — Hessian-vector products and the curvature eigenvalue range, to pick a learning rate and to judge whether you are truly converged.",
      ex: {
        q: "为什么「只用一阶梯度」就必须人为规定步长，而「用二阶」就可以自动定步长？",
        a: "因为一阶模型 f + f'Δ 是平面，沿负梯度方向单调下降、没有最低点，最优点不存在，只能靠外部约束（信任半径、学习率）来定 Δ；二阶模型 ½f''Δ² + f'Δ 在 f''>0 时是开口向上的抛物线，令导数为零就能解出唯一的 Δ* = −f'/f''，步长由曲率自己给出。",
        q_en: "Why does first-order-only optimisation have to impose a step size by hand, while second-order can derive one?",
        a_en: "Because the first-order model f + f'Δ is a plane that falls monotonically along minus the gradient and has no minimum, so Δ must come from an external constraint — a trust radius, a learning rate. The second-order model ½f''Δ² + f'Δ is an upward parabola when f'' is positive, so setting its derivative to zero yields a unique Δ* = −f'/f'': curvature supplies the step itself."
      }
    },

    "m3-6": {
      title: "综合重构：一次梯度检查把求导、链式与步长串起来",
      title_en: "Synthesis: One Gradient Check that Chains Derivatives, Backprop and the Step Size",
      min: 15,
      target: "能对一个小损失函数手算梯度、用中心差商逐元素验证、再解释不同学习率下的收敛与发散，并说出每一步的判据与失败征兆。",
      target_en: "Hand-derive the gradient of a small loss, verify it element by element with central differences, then explain convergence and divergence across learning rates — stating the criterion and the failure signature at every step.",
      summary: [
        "题目：单个神经元的平方损失 L(w) = ½(σ(wᵀx) − y)²。这一道题把 ma3 全用上了——求导（m3-1）、链式（m3-2）、梯度形状与方向（m3-3）、步长（m3-4）、二阶与凸性（m3-5）。",
        "第一步手算：先在纸上写出三段局部导数并连乘，同时标出每一段的形状；形状对不上就已经是 bug，不必再看数值。这一分钟的手算是后面所有「反向传播到底对不对」争论的裁判。",
        "第二步数值对拍：对每个参数拨 ±h（h 取 1e-5，中心差商），把数值梯度当金标准；比较相对误差（差除以两者绝对值之和加一个小量），1e-7 量级算通过、1e-3 就已经不可信。先关掉所有随机层，固定种子。",
        "第三步查曲率再定步长：二次近似下 η < 2/λmax 才收敛、η = 2/(λmin+λmax) 最快；没有 Hessian 就用经验法——从 1e-5 扫到 1e-1，看 loss 曲线哪一段最陡。这两条是同一件事的理论面与测量面。",
        "第四步按症状下诊断：loss 抖动或 NaN 意味着步长过大或梯度爆炸（先裁剪再降 lr）；loss 平到不动要检查是否饱和（σ'、tanh'）、掩码或标签错位、或者 float32 里更新被舍入吃掉；单个元素误差特别大，通常是某一路广播忘了沿维度求和。",
        "第五步把它变成常驻测试：梯度检查、形状断言、损失值单调性三项写成单元测试锁进 CI，改一次架构就跑一遍。深度学习里最贵的 bug 从来不是崩溃，而是「形状对、能跑、数值错」。",
        "本章复盘清单：① 导数就是局部线性近似；② 不可导点用次梯度是约定不是定理；③ 数值微分有最优步长，中心差商用 1e-5；④ 链式法则是局部导数连乘再沿广播维求和；⑤ 梯度形状必等于参数形状；⑥ 学习率上界由曲率决定；⑦ 一阶必须定步长、二阶自动定步长；⑧ 凸问题里局部极小就是全局。",
        "衔接 ma4：至此我们有了「给定数据求最优参数」的全部微积分。ma4 换一个问题——数据本身是随机的：如何用有限样本说出不确定性（分布、期望与方差、大数定律与中心极限定理），以及为什么交叉熵就是负对数似然。"
      ],
      summary_en: [
        "The problem: the squared loss L(w) = ½(σ(wᵀx) − y)² of a single neuron. This one thread uses all of ma3 — differentiation (m3-1), the chain rule (m3-2), gradient shape and direction (m3-3), step size (m3-4), second order and convexity (m3-5).",
        "Step one by hand: write the three local derivatives on paper and multiply them, noting each one's shape. A shape mismatch is already a bug before any number is checked. That minute of handwriting is the referee for every later argument about whether the backward pass is right.",
        "Step two, cross-check numerically: perturb each parameter by ±h with h = 1e-5 and treat the central quotient as gold standard; compare relative error, the difference over the sum of magnitudes plus an epsilon, where 1e-7 passes and 1e-3 already fails. Disable every stochastic layer first and fix the seed.",
        "Step three, measure curvature before choosing the step: a quadratic model needs η < 2/λmax to converge and runs fastest at 2/(λmin + λmax); without a Hessian use the empirical sweep from 1e-5 to 1e-1 and pick where the loss falls hardest. Those are the theory and the measurement of one and the same fact.",
        "Step four, diagnose from symptoms: a jagged or NaN loss means the step is too large or gradients explode (clip, then lower the rate); a perfectly flat curve means checking saturation in σ' or tanh', misaligned masks or labels, or updates rounded away in float32; one element with a huge error usually means a broadcast branch that forgot to sum along its axis.",
        "Step five, make it a permanent test: put gradient checking, shape assertions and loss monotonicity into unit tests and lock them into CI, rerunning on every architectural change. In deep learning the expensive bug is never the crash — it is 'shapes agree, it runs, the numbers are wrong'.",
        "Chapter retrospective: 1) a derivative is a local linear approximation; 2) using a subgradient at a kink is a convention, not a theorem; 3) numerical differentiation has an optimal step, 1e-5 for central differences; 4) the chain rule is a product of local derivatives plus summation over broadcast axes; 5) the gradient's shape equals the parameter's shape; 6) the learning-rate ceiling is set by curvature; 7) first order needs an imposed step, second order derives one; 8) on convex problems every local minimum is global.",
        "Into ma4: we now have all the calculus needed to fit optimal parameters for given data. ma4 changes the question — the data itself is random: how to speak about uncertainty from finite samples (distributions, expectation and variance, the law of large numbers and the central limit theorem), and why cross-entropy is negative log-likelihood."
      ],
      code: `import numpy as np

rng = np.random.default_rng(0)
x = rng.normal(size=3)
y = 1.0
w = rng.normal(size=3) * 0.1

def sig(z):
    return 1.0 / (1.0 + np.exp(-z))

def loss(v):
    # 0.5 让平方项求导后系数刚好为 1
    return 0.5 * (sig(v @ x) - y) ** 2

def grad_ana(v):
    # 反向：三段局部导数连乘，形状与参数一致
    a = sig(v @ x)
    return (a - y) * a * (1 - a) * x

h = 1e-5
grad_num = np.zeros_like(w)
for k in range(len(w)):
    # 中心差商：逐个参数拨动，其余保持不动
    e = np.zeros_like(w)
    e[k] = h
    grad_num[k] = (loss(w + e) - loss(w - e)) / (2 * h)
ga = grad_ana(w)
den = np.abs(ga) + np.abs(grad_num) + 1e-8
# 相对误差到 1e-7 量级才算实现正确：比的是相对量而不是绝对量
print(ga, grad_num, float(np.max(np.abs(ga - grad_num) / den)))
# 以曲率 2 与 20 为例：稳定上限 2/λmax、最快点 2/(λmin+λmax)，一次算清省掉整晚试错
print(2 / 20.0, 2 / (2 + 20.0))
for eta in [0.02, 0.09, 0.12]:
    p = w.copy()
    for _ in range(200):
        p = p - eta * grad_ana(p)
    # 步长过大时是发散、震荡还是只是爬不动，取决于曲率与初值：打印才看得见
    print(eta, round(loss(p), 8))`,
      pit: "只在最初那一组参数上做一次梯度检查就收工：反向实现里的错误常常只在特定区域出现（激活饱和、掩码全零、某个分支只在正样本上才走到）。规范做法是在三到五组随机参数、含边界值（全零输入、极端大输入）上各检查一次，并把「最大相对误差」写进断言阈值。",
      pit_en: "Running the gradient check once, at a single starting point, and calling it done: backward-pass bugs frequently live only in certain regions — saturated activations, an all-zero mask, a branch that only fires on positive examples. The disciplined version checks three to five random parameter sets including edge inputs (all-zero, absurdly large) and asserts on the maximum relative error.",
      ex: {
        q: "梯度检查通过之后，为什么还有可能训练不动？",
        a: "因为检查只证明「在当前点、这个实现、这批数据上梯度算对了」，它不管梯度本身有没有用：激活饱和会让梯度真实地接近 0，数据或标签错位会让正确的梯度指向错误的极小，float32 下过小的更新还会被舍入吞掉。所以「训练不动」要按三层分别查：梯度有没有值、有没有方向、更新有没有被吃掉。",
        q_en: "If the gradient check passed, why can training still fail to move?",
        a_en: "Because the check only proves the gradient is computed correctly at that point, for that implementation and that batch. It says nothing about whether the gradient is useful: saturation legitimately drives it to nearly zero, mislabelled data aims a correct gradient at a wrong optimum, and in float32 an undersized update is simply rounded away. Diagnose in three layers — is there any value, is there a direction, is the step being swallowed."
      }
    },

    /* ===================== ma4 概率与统计 ===================== */
    "m4-1": {
      min: 12,
      summary: [
        "三条公理就够了：概率落在 0 到 1 之间、必然事件为 1、互斥事件概率可加。所有「概率算不对」的题几乎都是两个错误之一——把「互斥」当成「独立」，或者忘了先做一次完备划分（也就是忘了全概率公式该出现的位置）。",
        "分布就是把所有可能结果连同概率列出来（离散求和为 1、连续密度积分为 1），期望 E[X] = Σx·P(x) 是它的概率加权平均。同一批数据可以拟到不同分布族上，选错族（把重尾当时正态）会让下游的一切——方差、置信区间、损失函数——建立在坏前提上（m4-4）。",
        "条件概率的定义是「联合概率除以条件事件的概率」，唯一要点是样本空间被缩小到 B 之后重新归一化。P(A|B) 与 P(B|A) 是两个不同的问题——阳性率与患病率；把两者混为一谈是医学筛查、风控与模型评估里最常见的错误来源（m4-2 会把它量化）。",
        "独立与互斥必须分开记：独立指联合等于乘积（一个的发生不改变另一个的概率），互斥指联合为 0（不能同时发生）。两个概率都大于 0 的互斥事件必然不独立——它们太「有关」了。这条也对应建模上的分歧：softmax 假设类别互斥，多标签 sigmoid 假设事件可以共存。",
        "全概率公式是贝叶斯的分母：把 B 按所有可能原因展开再相加。工程里它常常算不出来（要枚举所有可能性或做高维积分），于是贝叶斯更新只在「差一个常数因子」的意义下使用，或者用采样近似——这就是生成式模型「说不清似然」的根源，与 m3-5 里那个配分函数是同一堵墙。",
        "数值主线（本章最重要的一条）：概率是 (0,1) 里的数，连乘必然下溢。n 条样本的似然是 n 个小于 1 的数相乘，n 到两百就可能是 1e-300 以下、直接变成 0；所以一切似然计算都搬到 log 域做加法，归一化用 log-sum-exp（先减最大值、再 exp、再求和取 log）。softmax、交叉熵、Viterbi 的稳定实现全在这一句上。",
        "什么时候会出错（工程版）：把 log 概率当概率输出、没 mask 掉 padding 位就沿序列求均值（分母算进了不存在的 token）、用 float32 连乘概率、把缺失值当 0 概率。这些 bug 的隐蔽之处在于：排序指标（AUC）看着正常，而校准度（ECE、可靠性图）全烂。",
        "衔接：这一节的前置是 m3-5（积分就是累积）与 Python 路线的 NumPy 基础。条件概率已经把「由结果反推原因」的门开了一道缝，下一节把它做成定理，并解释「先验」这个词到底在说什么。"
      ],
      summary_en: [
        "Three axioms suffice: probabilities lie between 0 and 1, the certain event has probability 1, and probabilities of mutually exclusive events add. Every 'the arithmetic came out wrong' problem is one of two mistakes — reading 'exclusive' as 'independent', or forgetting a complete partition, i.e. forgetting where the law of total probability belonged.",
        "A distribution lists every possible outcome with its probability (summing to 1 when discrete, integrating to 1 when continuous), and E[X] = Σx·P(x) is its probability-weighted average. The same data can be fitted to different families, and choosing the wrong one (treating a heavy tail as Gaussian) leaves every downstream quantity — variance, confidence intervals, the loss function — resting on a bad premise (m4-4).",
        "Conditional probability is the joint divided by the probability of the condition; its one idea is that the sample space shrinks to B and is renormalised. P(A|B) and P(B|A) are different questions — positive-test rate versus disease prevalence — and confusing them is the most frequent single source of error in screening, risk and model evaluation, where m4-2 quantifies the damage.",
        "Independence and exclusivity must be kept apart: independent means the joint equals the product, so one event changes nothing about the other's probability; exclusive means the joint is 0, so they cannot co-occur. Two exclusive events with positive probability are necessarily dependent — they are far too related. The same split shows up in modelling: softmax asserts mutually exclusive classes, per-label sigmoid allows co-occurrence.",
        "The law of total probability is Bayes' denominator: expand B over every possible cause and add. In engineering it is often uncomputable (it wants every possibility enumerated, or a high-dimensional integral), so Bayesian updates get used only up to a constant factor, or approximated by sampling — which is exactly why generative models 'cannot state their likelihood'. The partition function of m3-5 is the same wall.",
        "The numerical through-line, and the most important sentence in this chapter: probabilities live in (0,1) so products underflow. A likelihood is a product of n terms each below 1; by n around two hundred it can drop below 1e-300 and become 0, so all likelihood arithmetic happens in the log domain as sums, with normalisation via log-sum-exp (subtract the max, exponentiate, sum, log). The stable implementations of softmax, cross-entropy and Viterbi all sit on that line.",
        "The engineering failure list: emitting log-probabilities as if they were probabilities, averaging along a sequence without masking padding (the denominator counts tokens that do not exist), multiplying probabilities in float32, treating a missing value as probability 0. These are nasty because ranking metrics such as AUC stay healthy while calibration (ECE, reliability diagrams) is destroyed.",
        "Bridge: prerequisites are m3-5 (an integral is an accumulation) and NumPy from the Python route. Conditional probability already cracks the door on reasoning from effect back to cause; the next section turns it into a theorem and explains what 'prior' actually means."
      ],
      code: `import numpy as np

p = np.array([0.5, 0.3, 0.2])
# 一个离散分布：全部非负，加起来等于 1
print(p.sum())
rng = np.random.default_rng(0)
draws = rng.choice(3, size=200000, p=p)
# 大数定律：频率会收敛到真实概率，但「多快」要等中心极限定理来回答
print(np.bincount(draws, minlength=3) / len(draws))
# 行是是否下雨，列是是否带伞：这是联合分布
joint = np.array([[0.10, 0.20], [0.35, 0.35]])
print(joint.sum(axis=1), joint.sum(axis=0))
# 条件概率等于联合除以对应的边缘：下雨天里带伞的比例
print(joint[0, 1] / joint[0].sum())
# 概率连乘必然下溢：搬到 log 域做加法
tiny = np.full(400, 0.02)
print(float(np.prod(tiny)), float(np.log(tiny).sum()))
# 归一化用 logsumexp：先减最大值，再 exp、求和、取 log
z = np.array([3.0, 1.0, 0.0])
print(float(z.max() + np.log(np.exp(z - z.max()).sum())))`,
      pit: "沿序列维求平均时忘了 mask：把 padding 位置的 0 概率或 0 log 概率算进了分母，于是「序列越长、平均分越高」，长短文本的分数不可比。AUC 看着还正常，因为排序没被打乱，但所有需要概率数值的下游（校准、阈值、加权融合）全部失真。任何沿变长维度归约之前，先把掩码同时加进分子与分母。",
      pit_en: "Averaging along the sequence axis without a mask: padding positions contribute zero probabilities (or zero log-probabilities) into the denominator, so 'longer sequence, higher average' and short and long texts become incomparable. AUC still looks fine because the ranking survives, while everything that needs the actual number — calibration, thresholds, weighted fusion — silently rots. Fold the mask into both numerator and denominator before reducing any variable-length axis.",
      ex: {
        q: "为什么概率一律要在 log 域计算，代价是什么？",
        a: "因为 n 个小于 1 的数连乘会下溢成 0（float64 下大约 200 个 0.02 就归零），而 log 把连乘变成连加、既稳定又便于求导；代价是失去「概率的直接直觉」，并且 log(0) 必须显式处理（clip，或用掩码把不该存在的项剔掉），否则换来的是 nan。",
        q_en: "Why must probabilities be computed in the log domain, and what does that cost?",
        a_en: "Because a product of numbers below 1 underflows to 0 — in float64, around two hundred factors of 0.02 already flush to zero — while logs turn products into sums, which accumulate stably and differentiate cleanly. The price is losing the direct intuition for probability, and the fact that log(0) now has to be handled explicitly (clipped, or removed by a mask), otherwise nan arrives in place of 0."
      }
    },

    "m4-2": {
      min: 13,
      summary: [
        "贝叶斯定理的结构是「后验 = 似然 × 先验 ÷ 证据」。它做的全部工作是「用一条证据把先验更新一次」，因此天然可迭代——今天的后验是明天的先验，这就是在线学习与递推滤波（Kalman、粒子滤波）的骨架。",
        "先验不是主观偏见，而是「在看到这批数据之前你所知道的一切」的形式化。Beta(α,β) 对二项问题恰好可读作「过去见过 α−1 次成功、β−1 次失败」，于是新广告 0 次点击时的估计不再是 0%，而是「加上先验参数再算」——平滑本质上就是带上历史。",
        "基率压过后验的算术：患病率 0.1%、灵敏度 99%、特异度 95%，阳性后验只有约 2%；因为假阳性的绝对数量远大于真阳性。「检测很准」是一句关于 P(阳性|患病) 的话，而你关心的是 P(患病|阳性)——方向反了，这就是贝叶斯思维的全部入门课。",
        "MAP 与正则化的对应：把「最大化后验」写到线性模型上，取负对数后高斯先验那一项正好变成 λ‖θ‖₂²、拉普拉斯先验变成 λ‖θ‖₁，也就是 L2/L1 正则（接 m2-5）。λ 的物理意义是「先验有多强」，即噪声方差与先验方差之比；于是「调 λ」不再只是调参，而是在回答「我有多坚持这条业务假设」。",
        "朴素贝叶斯假设特征在给定类别下条件独立。对文本这条假设粗暴得荒谬（词与词当然相关），却仍然好用：把类条件概率拆成逐特征连乘后只需数词频、样本需求骤减。代价是它的「概率数值」严重过自信（全往 0 或 1 跑），只能用于排序，或者外面再包一层校准。",
        "证据（那个把所有参数积分掉的边际似然）是模型比较的关键，因为它天然惩罚过拟合：参数空间越大，能分配给每个具体预测的概率质量就越薄。这就是贝叶斯奥卡姆剃刀与变分下界（ELBO）的源头；频率派要靠留出集才能做到同样的事。",
        "数值与实现三条：连乘一律 log 相加（朴素贝叶斯里几千个词概率相乘必然下溢）；未见过的取值必须给非零概率，拉普拉斯/Lidstone 平滑就是把 α、β 从 0 抬起来，否则一个未登录词就把整条文档判成不可能、预测变成 nan；后验只在同一证据下可比（分母不同），跨类别比较要先归一。",
        "衔接：贝叶斯关心「参数的不确定性」；下一节关心「数据本身长什么样」——期望、方差与协方差矩阵，那里会看到它与 ma2 的特征分解共用同一个矩阵。"
      ],
      summary_en: [
        "Bayes' theorem has the shape posterior equals likelihood times prior over evidence. All it does is update the prior once using one piece of evidence, which makes it naturally iterative — today's posterior is tomorrow's prior, and that is the skeleton of online learning and recursive filtering (Kalman, particle filters).",
        "A prior is not bias but the formalisation of 'everything you knew before seeing this data'. Beta(α,β) for a binomial problem reads exactly as 'α−1 successes and β−1 failures seen before', so a brand-new ad with zero clicks is not estimated at 0 percent but at the count with the prior parameters added in — smoothing is simply 'compute with your history included'.",
        "The base rate crushes the posterior: prevalence 0.1 percent, sensitivity 99 percent, specificity 95 percent leaves a positive result with only about 2 percent chance of disease, because the absolute count of false positives dwarfs the true ones. 'The test is accurate' is a sentence about P(positive|disease) while what you want is P(disease|positive) — reversing them is the entire introductory lesson of Bayesian thinking.",
        "MAP's correspondence with regularisation: write 'maximise the posterior' for a linear model and, after taking the negative log, a Gaussian prior contributes exactly λ‖θ‖₂² and a Laplace prior λ‖θ‖₁ — that is L2 and L1 regularisation (see m2-5). λ physically means 'how strongly do I believe this prior', the ratio of noise variance to prior variance, so tuning λ stops being knob-twiddling and becomes a defensible statement about how much business assumption you are injecting.",
        "Naive Bayes assumes features are conditionally independent given the class. For text that is absurdly false (words obviously depend on each other) and it still works: factoring the class-conditional probability into a per-feature product reduces everything to counting and slashes the sample need. The price is severely over-confident numbers, pushed toward 0 and 1, so its output is fit for ranking or a calibration layer, not for reading as probability.",
        "The evidence — that marginal likelihood with every parameter integrated out — is what model comparison needs, and it penalises overfitting automatically: the larger the parameter space, the thinner the probability mass spread over any specific prediction. That is the Bayesian Occam's razor and the ancestor of the ELBO; the frequentist reaches the same conclusion only by way of a held-out set.",
        "Three implementation notes: turn products into log sums (thousands of per-word probabilities must underflow otherwise); give unseen values non-zero mass, i.e. Laplace or Lidstone smoothing lifts α and β off zero, else one unseen token declares a whole document impossible and the prediction becomes nan; and posteriors are comparable only under the same evidence, so renormalise before comparing across classes.",
        "Bridge: Bayes is about uncertainty in parameters. The next section is about what the data itself looks like — expectation, variance and the covariance matrix, where you meet the very same matrix whose eigendecomposition powered PCA in ma2."
      ],
      code: `# 垃圾邮件：先验 1%，关键词在垃圾里出现率 60%、在正常邮件里 2%
p_spam, p_word_spam, p_word_ham = 0.01, 0.60, 0.02
evidence = p_word_spam * p_spam + p_word_ham * (1 - p_spam)
print(p_word_spam * p_spam / evidence)
# 医疗筛查同款：假阳性的绝对数量远大于真阳性，所以阳性未必患病
sens, spec, prev = 0.99, 0.95, 0.001
print(sens * prev / (sens * prev + (1 - spec) * (1 - prev)))
# 先验换成 5% 与 30%：同一个「准确」的检测，结论完全取决于基率
for prev2 in [0.001, 0.05, 0.30]:
    print(prev2, sens * prev2 / (sens * prev2 + (1 - spec) * (1 - prev2)))
# Beta 先验：alpha-1 次成功、beta-1 次失败；后验参数就是两者相加
alpha, beta, hits, misses = 1.0, 1.0, 3, 97
print((alpha + hits) / (alpha + beta + hits + misses))
# 不平滑时 0 次点击会被判成 0%，新广告永远爬不起来
print(0 / 100, (alpha + 0) / (alpha + beta + 0 + 100))`,
      pit: "拿后验概率直接当置信度展示给用户或写进报表：朴素贝叶斯与训练过拟合的神经网络都会给出 0.9999 这种数值，但实际正确率可能只有 75%。要么用校准方法（温度缩放、Platt 标度、可靠性图）把数值修回可解释的尺度，要么明确声明它只是排序分数。",
      pit_en: "Displaying a posterior as if it were a calibrated confidence: naive Bayes and an over-trained network will happily print 0.9999 while being right 75 percent of the time. Either bring the numbers back to an interpretable scale with calibration (temperature scaling, Platt, a reliability diagram) or state plainly that the value is only a ranking score.",
      ex: {
        q: "为什么说「L2 正则化其实就是高斯先验」？这改变了什么实践判断？",
        a: "因为最大化「似然乘以高斯先验」再取负对数，先验那一项正好落成 λ‖θ‖₂²，λ 是噪声方差与先验方差之比；于是选 λ 从经验调参变成一个可以陈述的业务判断——先验方差多大，就意味着你多坚持「参数应该接近 0」。",
        q_en: "Why is L2 regularisation 'just a Gaussian prior', and what practical judgement does that change?",
        a_en: "Because maximising likelihood times a Gaussian prior and taking the negative log lands precisely on λ‖θ‖₂², with λ the ratio of noise variance to prior variance. Choosing λ stops being folklore tuning and becomes a statement you can defend: the prior's spread says how hard you insist that parameters sit near zero."
      }
    },

    "m4-3": {
      min: 13,
      summary: [
        "期望 E[X] = Σx·P(x) 是「长期平均」，但它可以取不到任何实际出现的值（掷一颗骰子的期望是 3.5）；方差度量散布、标准差把它开方回原单位。这两个是随机变量的一、二阶矩，更高阶是偏度与峰度——重尾诊断要看它们（m4-4）。",
        "运算律里最容易被忽略的是那个平方：期望是线性的，但方差在缩放时是平方关系（尺度翻倍、方差翻四倍）；独立时两个变量之和的方差等于各自方差相加，不独立还要补上 2 倍协方差。这个平方，正是标准化能压住梯度尺度、以及换元时雅可比行列式平方出现的同一件事。",
        "协方差为 0 表示「没有线性关系」——注意不是「没有关系」，X 与 X² 在对称取样下可以零相关却完全确定。相关系数把两个标准差除掉，落在 −1 到 1 之间，因此它只对线性强度负责，对非线性完全盲目。",
        "协方差矩阵的对角是各维方差、非对角是两两协方差；它天生对称半正定（m2-3 的正定在这里第二次登场），所以可特征分解，特征值就是各主方向上的方差、特征向量就是 PCA 的方向（m2-4）。换句话说，「数据的相关结构」与「最优降维方向」本来就是同一个矩阵的两副面孔。",
        "样本与总体必须写清：样本均值除以 n 是期望的 MLE，而样本方差除以 n−1 才是无偏估计——因为均值本身是从这批数据里估出来的，占掉了 1 个自由度。NumPy 的坑就在这里：np.var 与 np.std 默认 ddof=0（除 n），而 np.cov 与 np.corrcoef 默认 ddof=1（除 n−1），同一份数据两边对不上，几乎人人踩过。",
        "相关性不等于因果，有三个常见机制：混淆变量（冰淇淋销量与溺水人数都由气温驱动）、反向因果、选择偏差（只观察到一部分样本）。此外相关还可能被分组掩盖甚至反号（辛普森悖论），所以要分层看；而要得到因果结论需要干预实验——这正是 m4-6 里 A/B 对比存在的理由。",
        "工程用法与陷阱：用相关矩阵做特征去冗余（把 |ρ| 高于阈值的列合并或丢掉）；标准化前先算方差，方差几乎为 0 的列必须丢弃（否则就是除以噪声）；评估别只看均值，同时报方差与分位数；重尾指标（时延、金额）用中位数与 P95，因为均值会被一次极端值拖走。",
        "衔接：期望与方差说的是「分布的样子」。下一节给出几个具体分布（伯努利、二项、泊松、正态），并回答一个更重要的问题：为什么样本一定要够，以及「够」到底是多少钱。"
      ],
      summary_en: [
        "E[X] = Σx·P(x) is a long-run average that need never be an observable value (a die's expectation is 3.5); variance measures spread and the standard deviation brings it back to the original unit. These are the first two moments; skewness and kurtosis follow, and they are what you read when diagnosing heavy tails (m4-4).",
        "The law people forget is the square: expectation is linear, but variance scales quadratically — double the scale, quadruple the variance; for independent variables variances add, and otherwise a term of twice the covariance appears. That square is the same fact that lets standardisation tame gradient scales and makes Jacobians appear squared under a change of variables.",
        "Zero covariance means 'no linear relationship', not 'no relationship': X and X² can be uncorrelated under a symmetric sample and still be perfectly determined. The correlation coefficient divides out both standard deviations and lands between −1 and 1, so it is only ever a statement about linear strength and is blind to everything else.",
        "The covariance matrix carries variances on the diagonal and pairwise covariances off it; it is symmetric positive semi-definite by construction (positive definiteness from m2-3 appearing a second time), so it eigendecomposes, its eigenvalues are the variances along the principal directions and its eigenvectors are exactly the PCA directions of m2-4. 'Correlation structure' and 'best reduction directions' were always two faces of one matrix.",
        "Sample versus population must be stated explicitly: the sample mean dividing by n is the MLE of the expectation, while an unbiased variance divides by n−1, because the mean was itself estimated from this data and consumed one degree of freedom. NumPy's trap lives right here: np.var and np.std default to ddof=0 while np.cov and np.corrcoef default to ddof=1, so the two disagree on the same array — an almost universal first encounter.",
        "Correlation is not causation for three ordinary reasons: confounders (ice-cream sales and drownings are both driven by temperature), reverse causation, and selection bias (you only observe survivors). Correlation can also be masked or flipped by stratification (Simpson's paradox), so look layer by layer; and a causal claim needs an intervention, which is precisely why the A/B comparison of m4-6 exists.",
        "Engineering uses and traps: a correlation matrix is a redundancy detector (merge or drop columns above some |ρ| threshold); compute variances before standardising and drop columns whose variance is essentially zero, or you are dividing by noise; report dispersion and quantiles next to the mean; and for heavy-tailed metrics like latency or spend, quote the median and P95, because one extreme value drags the mean away.",
        "Bridge: expectation and variance describe what a distribution looks like. The next section hands over concrete families — Bernoulli, binomial, Poisson, Gaussian — and answers the more important question: why samples must be plentiful, and exactly how many 'plentiful' means."
      ],
      code: `import numpy as np

rng = np.random.default_rng(0)
x = rng.normal(0, 1, size=4000)
# 与 x 相关的变量：噪声幅度由目标相关系数反推出来
y = 0.9 * x + np.sqrt(1 - 0.81) * rng.normal(0, 1, size=4000)
# np.var 默认除 n（ddof=0），np.cov 默认除 n-1（ddof=1）：两边默认值不一致
print(np.var(x), np.var(x, ddof=1), np.cov(x, y)[0, 1])
print(np.corrcoef(x, y)[0, 1])
# 协方差矩阵：对角是方差，非对角是两两协方差，且对称半正定
C = np.cov(np.column_stack([x, y]))
print(C, np.linalg.eigvalsh(C))
# 零相关不等于无关：对称取样下 x 与 x 的平方的相关是 0
u = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])
print(np.corrcoef(u, u ** 2)[0, 1])
# 尺度翻倍，方差翻四倍：这就是必须先标准化的理由
print(np.var(2 * x) / np.var(x))
z = rng.normal(0, 50, size=4000)
# 与噪声的相关约 0：任何「相关很小」的结论都要先排除分组与非线性
print(np.corrcoef(x, z)[0, 1])`,
      pit: "把 np.var 与 np.cov 的默认当成一致：前者 ddof=0、后者 ddof=1，于是你手工「方差归一化」算出的相关系数与 np.corrcoef 差一个 n/(n−1) 因子。小样本（n=10）时这个差异足以让阈值判定翻边；同一份代码里请显式写死 ddof，别依赖默认值。",
      pit_en: "Assuming np.var and np.cov share a default: the first uses ddof=0, the second ddof=1, so a hand-normalised correlation differs from np.corrcoef by a factor of n/(n−1) — with n around ten that is enough to flip a threshold decision. Pin ddof explicitly in one codebase instead of trusting defaults.",
      ex: {
        q: "为什么样本方差要除以 n−1 而不是 n？",
        a: "因为公式里的均值是用这批样本估出来的，样本到「估计的均值」的平方偏差之和天生比到「真均值」的小一个自由度，除以 n 会系统性偏小；除以 n−1 才把期望校正回真方差（也就是 MLE 有偏、n−1 版本无偏）。这也解释了 np.var 默认除 n 的含义：它给的是 MLE 而不是无偏估计。",
        q_en: "Why does the sample variance divide by n−1 rather than n?",
        a_en: "Because the mean inside it was estimated from the same sample, so the squared deviations around that estimate are systematically smaller than around the truth — one degree of freedom has been spent — and dividing by n−1 repairs the expectation, i.e. the MLE is biased and the n−1 version is unbiased. That is also why np.var's default of n is reporting the MLE rather than the unbiased estimator."
      }
    },

    "m4-4": {
      min: 13,
      summary: [
        "离散族按「数据是什么形状」选：伯努利（一次 0/1，参数 p）、二项（n 次里的成功数，均值 np、方差 np(1−p)）、泊松（单位时间或空间的计数，均值=方差=λ）、几何与负二项（等待到第 k 次成功）、均匀。先问「我的数据是计数、比例还是时长」，再挑分布族。",
        "连续族：均匀、指数（无记忆的间隔时间）、正态（钟形，一倍标准差约 68%、两倍约 95%）、对数正态（收入、规模、时延常常是它）、Beta（比例的比例）、Dirichlet（softmax 向量的先验）。要读的是尾部行为：重尾分布的均值与方差不稳定，样本一多结论就飘。",
        "正态无处不在有三条数学理由：独立正量之和仍是正态；多元高斯的边际与条件分布仍是高斯；它的形状完全由 μ 与 σ 决定。于是「假设高斯」在噪声层面给出 MSE 损失（m4-5 的 MLE），在先验层面给出 L2/权重衰减（m4-2 的 MAP）。同时它极不稳健，所以 Huber 与分位数损失不是可选项。",
        "大数定律说：样本均值随 n 增大收敛到期望。注意它只承诺「会到」，不承诺「多快到」，也不承诺「中间不抖」——掷 5 次硬币出 4 正 1 反毫不奇怪。把这条定律读成「样本多一点就自然准了」，是最常见的一次误读。",
        "中心极限定理补上「形状」：独立同分布、方差有限的随机变量，其标准化和的分布趋于正态。它回答了三件事：为什么样本均值看起来正态、为什么误差看起来正态、以及为什么 95% 置信区间可以写成均值 ± 1.96·SE——这是几乎所有显著性检验的入场券。",
        "收敛速度是 1/√n，这条量叫标准误：SE = σ/√n。想把误差减半必须付出 4 倍样本，想要 10 倍精度要 100 倍数据。它直接换算成预算：评估集要多大才能分辨 1% 的指标差异、蒙特卡洛与解码采样要跑多少次才值得一提小数点后两位——都是同一道算术题。",
        "CLT 的前提不能省：方差无限（柯西分布、极端重尾）时均值不趋于正态；样本之间强相关（同一用户的多条曝光、同一文档的多个切片）时「有效样本量」远小于名义条数。所以要按用户或文档分组抽样、用分块 bootstrap 或聚类稳健方差，否则误差被系统性低估，p 值一片「显著」（见 m4-6）。",
        "衔接：会抽样就要会说「这个估计有多可信」。下一节的最大似然把参数估计正式接上，并给出交叉熵损失的来源；收口课 m4-6 再把它做成一次完整的对比实验判读。"
      ],
      summary_en: [
        "Pick a discrete family by the shape of the data: Bernoulli (one 0/1 trial with rate p), binomial (successes in n trials, mean np and variance np(1−p)), Poisson (counts per unit time or space, mean = variance = λ), geometric and negative binomial (waiting until the k-th success), uniform. Ask first whether the quantity is a count, a proportion or a duration, then choose the family.",
        "Continuous families: uniform, exponential (memoryless inter-arrival times), normal (bell shaped, roughly 68 percent within one sigma and 95 percent within two), log-normal (income, size, latency), Beta (a proportion of a proportion), Dirichlet (a prior over softmax vectors). What you read off is the tail: with heavy tails the mean and variance are unstable and conclusions drift as the sample grows.",
        "Gaussians are everywhere for three mathematical reasons: a sum of independent Gaussians is Gaussian, marginals and conditionals of a multivariate Gaussian are Gaussian, and its shape is fully pinned by μ and σ. So 'assume Gaussian' yields MSE at the level of noise (m4-5's MLE) and L2 or weight decay at the level of priors (m4-2's MAP). It is also profoundly non-robust, which is why Huber and quantile losses are not optional extras.",
        "The law of large numbers says the sample mean converges to the expectation as n grows. Note what it promises and what it does not: it promises arrival, not speed, and not a smooth path — four heads in five flips is unremarkable. Reading it as 'just take a bit more data and it will be accurate' is its most common misuse.",
        "The central limit theorem supplies the shape: for independent, identically distributed variables with finite variance, the standardised sum tends to a normal distribution. It answers why sample means look Gaussian, why errors look Gaussian, and why a 95 percent interval may be written as mean plus or minus 1.96 standard errors — the admission ticket to nearly every significance test.",
        "The rate is 1/√n, and that quantity is the standard error, σ over root n. Halving the error costs four times the samples and a ten-fold precision gain costs a hundred times the data. That converts straight into budget: how large an evaluation set is needed to resolve a 1 percent metric difference, how many Monte Carlo or decoding samples justify two decimal places — all the same arithmetic.",
        "The hypotheses are not decoration: with infinite variance (Cauchy, extreme heavy tails) the mean does not approach a normal law, and when samples are correlated (many impressions of one user, many chunks of one document) the effective sample size is far below the nominal count. So group and stratify your sampling and use block or cluster bootstrap; otherwise error bars are systematically too small and every p-value shouts 'significant' (m4-6).",
        "Bridge: once you can sample, you must say how much the estimate is worth. The next section, maximum likelihood, formally connects parameter estimation and hands you the origin of the cross-entropy loss; the closing section m4-6 turns it all into one complete read-out of a comparison experiment."
      ],
      code: `import numpy as np

rng = np.random.default_rng(0)
# 每次抽 n 个均匀样本求平均，重复 2000 次：这就是「重复实验」的模拟
for n in [5, 30, 200, 5000]:
    means = rng.uniform(size=(2000, n)).mean(axis=1)
    # 均值约 0.5，标准差按 1/√n 缩小，理论值是 (1/√12)/√n
    print(n, round(float(means.mean()), 4), round(float(means.std()), 4),
          round((1 / np.sqrt(12)) / np.sqrt(n), 4))
# 计数用泊松，0/1 次数用二项，连续量用正态：先问数据是什么形状
print(rng.poisson(2.0, 5), rng.binomial(10, 0.3, 5), rng.normal(0, 1, 3))
# 把若干个均匀变量相加：分布从方形逐渐变成钟形
s2 = rng.uniform(-1, 1, size=(20000, 2)).sum(axis=1)
s12 = rng.uniform(-1, 1, size=(20000, 12)).sum(axis=1)
print(np.percentile(s2, [5, 50, 95]), np.percentile(s12, [5, 50, 95]))
# 重尾的柯西分布：均值不收敛，加大样本也不会稳定下来
for n in [10, 1000]:
    print(n, round(float(rng.standard_cauchy(n).mean()), 3))`,
      pit: "用名义样本量算标准误：例如用 20000 条用户评论估计满意度，而同一用户平均贡献 20 条。真实独立单元只有 1000 个用户，误差被低估约 √20 倍，置信区间窄得像假消息。规则是先确认「谁是独立的一次试验」，并按它分组做 bootstrap、按用户划分训练与验证集——这一条同时也是数据泄漏的头号来源。",
      pit_en: "Computing the standard error from the nominal sample size: 20000 reviews where each user contributes 20 on average contain only about 1000 independent units, so the error is understated by roughly a factor of root 20 and the confidence interval is fiction. Identify what counts as one independent trial first, then bootstrap by group and split train and validation by user as well — this single mistake is also the leading source of data leakage.",
      ex: {
        q: "为什么「样本够多就自然准确」这句话是错的？",
        a: "因为大数定律只承诺收敛而不承诺速度，真正的定量结论来自中心极限定理给出的 1/√n：误差减半需要四倍样本。而且前提是方差有限且样本近似独立——重尾会让均值抖个不停，分组相关会让有效样本量骤减，有偏抽样更会让大样本稳定地收敛到错的地方。",
        q_en: "Why is 'enough data makes it accurate automatically' wrong?",
        a_en: "Because the law of large numbers promises convergence without promising a rate; the quantitative content comes from the central limit theorem's 1/√n, so halving the error costs four times the samples. And its premises are finite variance and approximate independence — heavy tails keep the mean jittering, clustered samples collapse the effective size, and a biased sampling frame makes a large sample converge confidently onto the wrong place."
      }
    },

    "m4-5": {
      min: 14,
      summary: [
        "似然 L(θ) = P(数据 | θ)：表达式与概率一模一样，但自变量换成了参数。所以「给定参数时数据的概率」与「给定数据时参数的似然」不是同一件事，不能互相解释；MLE 也不给参数的不确定性——那是贝叶斯/MAP 或 bootstrap 的活。",
        "MLE 就是「选让观测数据最不出乎意料的参数」：最大化所有样本 log 概率之和。取对数是必须的（连乘变连加、可分解、可求导）。对高斯写开就能看到：均值的最优估计就是样本均值，方差的最优估计是平方偏差的均值（除以 n，因而有偏）——这正是 np.var 默认 ddof=0 的来历。",
        "本站最重要的一条推导：类别用 softmax 表示概率、样本相互独立，则对数似然是「正确类 log 概率之和」；取负并除以样本数就是交叉熵。所以「最小化 CE 损失」不是玄学配方，而是「最大似然」换了个写法；log-softmax 里那个「先减最大值」就是这个求和的稳定实现（见 m4-1）。",
        "交叉熵 = 熵 + KL 散度，而 KL 非负、仅当两分布相同才为 0。因此 CE 的下界是数据自身的熵（不可约损失：标签噪声与世界真实的不确定性），怎么努力都减不掉；两个模型的 CE 差值，就是它们在 KL 意义下离真实分布还差多少。这也是「为什么 loss 降不到 0」的正经答案。",
        "理论保证与它的限度：在正则条件下 MLE 相合、渐近正态，并达到 Cramér–Rao 下界（Fisher 信息的逆），所以它是「渐近最有效」的估计量——这也是「用 CE 训练 + 温度缩放校准」这一整套流程的底气。但小样本时相合性帮不上忙，偏差与方差都得单独测（bootstrap 或显式修正）。",
        "数值实现（必考）：softmax 与 CE 必须合并成 log-softmax 实现（减最大值后做 logsumexp）；对概率做 clip 保下限会把梯度真的截成 0，要知道代价；标签含硬 0/1 时 CE 的惩罚无界，所以用标签平滑或 focal loss 换稳健性；混合精度下 logsumexp 与归约务必在 fp32 做。",
        "建模层的三个陷阱：类别极不平衡时 MLE 会牺牲少数类（要么重加权损失，要么换 PR-AUC 这类指标）；MLE 只负责拟合分布、不负责公平；多任务把不同损失直接相加，等于隐式给了不等权重（各目标的似然尺度不同），要显式加权或用不确定性加权。",
        "衔接：估完参数还剩最后一个问题——「这个差别是真的吗」。收口课 m4-6 会把抽样分布、置信区间与 p 值一次走完，并指出 p 值最常见的几种误读。"
      ],
      summary_en: [
        "The likelihood L(θ) = P(data | θ) is syntactically identical to a probability but with the parameter as the variable. So 'probability of the data given the parameter' and 'likelihood of the parameter given the data' are different statements that cannot be read off each other, and MLE says nothing about parameter uncertainty — that belongs to Bayes/MAP or to a bootstrap.",
        "MLE means 'choose the parameter under which the observed data is least surprising': maximise the sum of log probabilities over samples. The logarithm is mandatory — products become sums, so the objective decomposes and differentiates. Expand it for a Gaussian and the optimum mean is exactly the sample mean while the optimum variance is the mean squared deviation with division by n, hence biased, which is precisely the origin of np.var's default ddof=0.",
        "The single most important derivation on this site: represent class probabilities with a softmax over independent samples, and the log-likelihood is the sum of log p(correct class); negate it and divide by the sample count and you have cross-entropy. Minimising CE loss is therefore not a recipe but maximum likelihood wearing another name, and the subtract-the-max inside log-softmax is just the stable implementation of that sum (see m4-1).",
        "Cross-entropy equals entropy plus KL divergence, and KL is non-negative and zero only when the two distributions match. So the floor of CE is the data's own entropy — the irreducible loss from label noise and genuine world uncertainty, which no model can remove — and the gap between two models' CE is literally how much further one of them still sits from the truth. That is the honest answer to 'why doesn't my loss reach zero'.",
        "Guarantees and their limits: under regularity conditions the MLE is consistent, asymptotically normal and attains the Cramér–Rao bound (the inverse Fisher information), i.e. asymptotically efficient — the backing for the whole 'train with CE, then temperature-scale to calibrate' routine. None of that rescues you at small n, where bias and variance must be measured separately (bootstrap or explicit corrections).",
        "Implementation, exam-grade: fuse softmax with cross-entropy into one log-softmax (subtract the max, then logsumexp); clipping probabilities to a floor genuinely zeroes the gradient, so do it knowingly; hard 0/1 labels make CE punish without bound, which is what label smoothing or focal loss buy back; and under mixed precision, do logsumexp and the reduction in fp32.",
        "Three modelling-level traps: with severe class imbalance the MLE sacrifices the minority class (reweight the loss, or switch to PR-AUC-style metrics); MLE fits a distribution and is under no obligation to be fair; and naively summing multi-task losses imposes unequal implicit weights because different objectives live on different likelihood scales, so weight them explicitly or by uncertainty.",
        "Bridge: after estimation one question remains — is this difference real? The closing section m4-6 walks sampling distributions, confidence intervals and the p-value in one pass and names the most common misreadings of that last number."
      ],
      code: `import numpy as np

def log_softmax(logits):
    # 先减最大值：exp 不再溢出，归一化结果完全不变
    m = logits - logits.max(axis=1, keepdims=True)
    return m - np.log(np.exp(m).sum(axis=1, keepdims=True))

def cross_entropy(y_true, logits):
    # 负对数似然的平均：这就是「最小化 CE 等于最大似然」的实现
    lp = log_softmax(logits)
    return float(-np.mean((y_true * lp).sum(axis=1)))

y = np.array([[1.0, 0.0], [0.0, 1.0]])
logits = np.array([[2.0, -1.0], [0.5, 0.4]])
print(cross_entropy(y, logits))
# 极端 logits 下不合并实现就会溢出：先减最大值是唯一可靠的做法
print(cross_entropy(np.array([[1.0, 0.0]]), np.array([[1000.0, -1000.0]])))
# 标签是硬 0/1 时惩罚无界：标签平滑把目标分布从一角挪开
eps = 0.1
soft = y * (1 - eps) + eps / y.shape[1]
print(cross_entropy(soft, logits))
# 先 softmax 再取 log 还顺手 clip：小概率被归 0，梯度真的消失了
p = np.clip(np.exp(log_softmax(np.array([[-30.0, 0.0]]))), 1e-12, 1.0)
print(p, -np.log(p)[0, 0])`,
      pit: "先算 softmax 再取 log、还顺手 clip 到 1e-12：在 float32 里 softmax 会把很小的概率直接归 0，clip 之后 loss 变成有限值，但那些样本的梯度精确为 0——模型再也不学困难样本。表面现象是「训练很稳，长尾一塌糊涂」。正确做法是永远用合并的 log-softmax（或框架里的 CrossEntropyLoss），并在 fp32 里做归约。",
      pit_en: "Computing softmax, then taking the log, then clipping to 1e-12: in float32 the softmax flushes small probabilities to zero, and after clipping the loss looks finite while those samples carry exactly zero gradient forever — the model stops learning hard examples. The visible symptom is 'stable training, hopeless tail'. Always use the fused log-softmax (your framework's CrossEntropyLoss) and reduce in fp32.",
      ex: {
        q: "为什么「最大化对数似然」和「最小化 KL 散度」在分类任务里是同一件事？",
        a: "因为交叉熵等于数据分布的熵加上模型与数据之间的 KL，而那个熵与参数无关、是一个常数，所以最小化交叉熵与最小化 KL 只差一个常数；又因为交叉熵就是负对数似然的平均，三者互相等价。区别只在解释：似然讲「数据不出乎意料」，KL 讲「与真实分布差多远」。",
        q_en: "Why are 'maximising log-likelihood' and 'minimising KL divergence' the same thing for classification?",
        a_en: "Because cross-entropy is the data distribution's entropy plus the KL from data to model, and that entropy does not depend on θ — it is a constant — so minimising cross-entropy and minimising KL differ by that constant; and since cross-entropy is the average negative log-likelihood, all three coincide. Only the reading differs: likelihood says 'the data is unsurprising', KL says 'this far from the truth'."
      }
    },

    "m4-6": {
      title: "综合重构：一次 A/B 对比从抽样走到 p 值",
      title_en: "Synthesis: One A/B Comparison, from Sampling to the p-value",
      min: 15,
      target: "能就「新模型点击率更高吗」这一问题，走完抽样分布、标准误、置信区间、检验统计量、p 值与效应量的完整判读，并指出多重比较与分组泄漏会让结论怎样失效。",
      target_en: "Answer 'is the new model's click rate higher?' by walking the full read-out — sampling distribution, standard error, confidence interval, test statistic, p-value and effect size — and stating how multiple comparisons and grouped leakage invalidate the conclusion.",
      summary: [
        "问题：新旧两个模型各 4000 次曝光，点击率 10.0% 对 11.5%，这个提升是真的吗？一路走完「抽样分布 → 标准误 → 置信区间 → 检验统计量 → p 值 → 效应量与决策」，把 ma4 五节全用上。",
        "先想「重复实验会怎样」：用同规模数据重复 2000 次，两比例之差会形成近似钟形的分布（m4-4 的中心极限定理），它的标准差就是差的标准误 SE。SE 才是「噪声有多大」的那个数字，任何单次观测本身都是一个随机量。",
        "z 等于差除以 SE，这里大约 2.2，读作「观测到的差异相当于多少个噪声单位」。这是理解 p 值唯一健康的入口：它是把观测差异放到原假设的抽样分布上去比位置，而不是给「模型好坏」打分。",
        "p 值 = 在原假设为真时观察到「这么极端或更极端」结果的概率，这里约 0.03。它不是「新模型更好的概率」，不是「差异的大小」，不是「结果重要的概率」，也不是「1 减去犯错概率」——这几种误读在论文与评审里都极常见。",
        "显著不等于重要：n = 4×10⁵ 时 0.2 个百分点也能极显著，n = 4×10³ 时 1.5 个百分点只是边缘。汇报的正确顺序是效应量加置信区间（例如提升 1.5 个百分点、95% CI 大约 0.15 到 2.85），p 值当附注；最终决策还要加成本与风险，统计显著只是必要条件。",
        "多重比较是 p 值误用的主战场：换 20 个随机种子、20 个子集各测一次，按 α = 0.05 平均会有一次纯噪声「显著」（族错误率 1 − 0.95²⁰ ≈ 64%）。对策是 Bonferroni 或 Benjamini–Hochberg 校正，更好的办法是事先登记主指标与实验数量，然后不再改动。",
        "本章坑清单：把配对数据当独立样本（同一用户多次曝光必须按用户聚类或分块 bootstrap，见 m4-4）；把 0.05 当自然常数；在 n·p 太小的区域仍用正态近似；靠加样本量「熬出显著」；以及反复查看测试集造成的隐性泄漏——看一次调一次，最终分数就不再是估计而是拟合。",
        "衔接：ma4 到这里收口，也是整段「数学基石」（ma1 到 ma4）的收口。下一章 sp1 会把这一路的工具——数组、形状、广播与 NumPy 习惯——当作默认语言继续用；ml1 与 dl1 里遇到的 MSE、交叉熵、权重衰减、梯度与评估集大小，都能回接到本章某个式子上。"
      ],
      summary_en: [
        "The question: 4000 impressions each for an old and a new model, click rates 10.0 versus 11.5 percent — is the lift real? The route runs sampling distribution, standard error, confidence interval, test statistic, p-value, effect size and decision, and it uses all five earlier sections of ma4.",
        "Start by imagining the repeated experiment: replicate 2000 times at the same size and the distribution of the difference in proportions is approximately bell-shaped (the central limit theorem of m4-4), whose standard deviation is the standard error of that difference. The standard error is the number that means 'how big is the noise'; any single observation is itself a random draw.",
        "The test statistic is the difference divided by its standard error, about 2.2 here, read as 'the observed gap is this many noise units'. That is the only healthy entry point to the p-value: it places the observed difference inside the null model's sampling distribution instead of scoring how good the model is.",
        "The p-value is the probability, assuming the null hypothesis true, of seeing something at least this extreme — about 0.03 here. It is not the probability the new model is better, not the size of the difference, not the probability the result matters, and not one minus the chance of being wrong; all four of those misreadings appear routinely in papers and reviews.",
        "Significant is not important: with n = 4e5 a 0.2 percentage-point lift can be highly significant, while with n = 4e3 a 1.5 point lift is marginal. Report effect size plus interval first (a 1.5 point lift with a 95 percent interval roughly from 0.15 to 2.85) and treat the p-value as a footnote; the decision additionally needs cost and risk, since statistical significance is only ever a necessary condition.",
        "Multiple comparisons are where p-values get abused most: run twenty seeds or twenty subsets and at α = 0.05 you expect about one pure-noise 'significant' result, since the family-wise error rate is 1 − 0.95²⁰, about 64 percent. Bonferroni or Benjamini–Hochberg correction helps; better, pre-register the primary metric and the number of comparisons and then leave them alone.",
        "This chapter's trap list: treating paired data as independent (many impressions per user must be clustered or block-bootstrapped, m4-4); treating 0.05 as a law of nature; using a normal approximation where n·p is too small; adding samples until significance appears; and the silent leakage of repeatedly peeking at the test set, after which the number is no longer an estimate but a fit.",
        "Bridge: ma4 closes here, which also closes the mathematical foundation ma1 through ma4. The next chapter, sp1, keeps using this route's tooling — arrays, shapes, broadcasting and NumPy habits — as its default language, and every MSE, cross-entropy, weight decay, gradient and evaluation-set size you meet in ml1 and dl1 traces back to some line in these four chapters."
      ],
      code: `import math
import numpy as np

rng = np.random.default_rng(0)
# 旧模型点击率 10%，新模型真实提升 1.5 个百分点
a = rng.binomial(1, 0.100, size=4000)
b = rng.binomial(1, 0.115, size=4000)
pa, pb = a.mean(), b.mean()
# 两比例差的标准误：这就是「噪声有多大」的那个数字
se = math.sqrt(pa * (1 - pa) / len(a) + pb * (1 - pb) / len(b))
z = (pb - pa) / se
print(pb - pa, se, z)
# p 值：原假设为真时，出现这么极端或更极端结果的概率
p_value = 2 * (1 - 0.5 * (1 + math.erf(abs(z) / math.sqrt(2))))
print(p_value)
# 置信区间才回答「大概提升多少」，p 值不回答这个
print((pb - pa) - 1.96 * se, (pb - pa) + 1.96 * se)
# 重复实验：重抽 2000 次，看差异的抽样分布到底宽到什么程度
boot = np.array([rng.binomial(1, pb, 4000).mean() - rng.binomial(1, pa, 4000).mean()
                 for _ in range(2000)])
print(np.percentile(boot, [2.5, 97.5]))
# 多重比较：测 20 个纯噪声种子，平均会有几个「显著」
flags = [2 * (1 - 0.5 * (1 + math.erf(abs(v) / math.sqrt(2)))) < 0.05
         for v in rng.normal(size=20)]
print(sum(flags), 1 - 0.95 ** 20)`,
      pit: "边看测试集边调参：每次「换一下再看一眼」都是在用同一批数据同时做估计与选择，几轮之后测试集上的分数已经是对该测试集的拟合，不再是泛化能力的估计。表现为内部刷得很高、上线掉一大截。对策：留出一次性的最终测试集（只允许评估一次并记录日期）、调参一律用交叉验证、并在结论里报告你一共做过多少次评估。",
      pit_en: "Tuning while watching the test set: every 'change one thing and take a look' uses the same data for both estimation and selection, so after a few rounds the test score is a fit to that test set rather than an estimate of generalisation — a high internal number and a visible drop in production. Countermeasures: quarantine a final test set allowed exactly one evaluation (and date it), do all selection by cross-validation, and report how many evaluations you ran.",
      ex: {
        q: "为什么「加大样本量直到 p < 0.05」不是一种可接受的实验设计？",
        a: "因为在这条停止规则下，第一类错误率不再是名义的 5%：只要真差异不为 0，样本足够多时必然显著；而即使真差异恰好为 0，反复窥视也总会撞上一次显著。所以必须事先固定样本量与检验次数，或者改用为序贯观察设计的 always-valid 检验。",
        q_en: "Why is 'keep adding samples until p < 0.05' not an acceptable design?",
        a_en: "Because under that stopping rule the type-I error rate is no longer the nominal 5 percent: any non-zero true difference becomes significant with enough samples, and even if the difference is exactly zero, repeated peeking will eventually land on a significant result. Either fix the sample size and the number of looks in advance, or use an always-valid sequential test designed for exactly this."
      }
    }
  },

  /* ---------- 题库：对准本层新增知识点，每章 4 题（含 1 判断 + 1 填空） ---------- */
  quizAdd: {
    ma3: [
      {
        q: "用中心差商做梯度检查时，把步长设成 1e-16 会发生什么？",
        o: ["精度更高，因为截断误差更小", "f(x+h) 与 f(x) 在 float64 下相等，差商变成 0 或纯噪声", "结果不变，因为浮点精度足够", "会自动降级成前向差商"],
        a: 1,
        why: "误差是截断项 O(h²) 与舍入项 O(eps/h) 之和，最优步长在 eps 的立方根（约 6e-6）附近；h 小于机器精度时两个浮点数相等，减法把有效位全部吃掉，于是数值梯度变成 0 或噪声，看起来「梯度全零」。",
        q_en: "What happens if you set the step to 1e-16 when gradient-checking with central differences?",
        o_en: ["Precision improves because truncation error shrinks", "f(x+h) equals f(x) in float64, so the quotient becomes 0 or pure noise", "Nothing changes, float precision is plenty", "It silently falls back to a forward difference"],
        why_en: "Total error is truncation O(h²) plus rounding O(eps/h), minimised near the cube root of eps (about 6e-6); below machine precision the two evaluations are literally the same float, the subtraction cancels every significant digit, and the numerical gradient collapses to 0 or noise."
      },
      {
        q: "对二次损失做梯度下降，曲率（Hessian 特征值）分别是 2 与 20。下列说法正确的是？",
        o: ["只要步率为正就收敛", "上限约 0.1（2/λmax），最快点约 0.091（2/(λmin+λmax)）", "步率越小收敛越快", "步率应取 λmax 本身"],
        a: 1,
        why: "收敛条件是 η < 2/λmax = 0.1；渐近最优是 2/(λmin+λmax) ≈ 0.0909，此时两个方向的收缩率相同。再小只会「稳而慢」，超过 0.1 就在最大曲率方向上发散。",
        q_en: "For gradient descent on a quadratic whose Hessian eigenvalues are 2 and 20, which statement is correct?",
        o_en: ["Any positive rate converges", "The ceiling is about 0.1 (2/λmax) and the fastest point about 0.091 (2/(λmin+λmax))", "A smaller rate always converges faster", "The rate should be λmax itself"],
        why_en: "Convergence demands η < 2/λmax = 0.1, and the asymptotically best value is 2/(λmin+λmax) ≈ 0.0909, where both directions contract equally. Going smaller buys stability, not speed; exceeding 0.1 diverges along the sharpest curvature."
      },
      {
        q: "判断：损失函数在某点梯度为 0，就说明该点是局部极小值。",
        type: "judge", a: 1,
        why: "梯度为 0 只说明是驻点，可能是极小、极大或鞍点；高维问题里鞍点比局部极小常见得多。判据是 Hessian 的特征值符号：全正为严格局部极小，有正有负为鞍点。",
        q_en: "True or false: a zero gradient at a point proves it is a local minimum.",
        why_en: "False. A zero gradient only marks a stationary point — minimum, maximum or saddle — and in high dimensions saddles vastly outnumber local minima. The discriminator is the sign pattern of the Hessian's eigenvalues: all positive for a strict local minimum, mixed for a saddle."
      },
      {
        q: "把损失做二阶泰勒近似 ½f''Δ² + f'Δ，令导数为 0 解出的最优步长是 Δ* = −f' 除以 ______（填「二阶导」或那个矩阵的名字）。",
        type: "fill", ans: ["f''", "二阶导", "二阶导数", "海森", "海森矩阵", "Hessian", "hessian"],
        why: "这就是牛顿步（多元时是 −H⁻¹g）：曲率越大步长自动越小。二阶模型有最低点所以步长可推导；一阶模型是平面，必须人为规定步长，也就是学习率。",
        q_en: "Setting the derivative of the second-order Taylor model ½f''Δ² + f'Δ to zero gives the optimal step Δ* = −f' divided by ______ (name the second derivative or the matrix).",
        why_en: "That is the Newton step, −f'/f'' or multivariately −H⁻¹g: larger curvature automatically shortens the step. A second-order model has a bottom so the step can be derived, whereas a first-order model is a plane and forces you to impose a step length — a learning rate."
      }
    ],
    ma4: [
      {
        q: "某病患病率 0.1%，某检测灵敏度 99%、特异度 95%。一个人检测阳性，他真患病的概率最接近？",
        o: ["约 99%", "约 2%", "约 50%", "约 19%"],
        a: 1,
        why: "P(病|阳) = 0.99×0.001 /(0.99×0.001 + 0.05×0.999) ≈ 0.02。分母里假阳性的绝对数量（约 5% 的健康人群）远大于真阳性，所以「检测很准」说的是 P(阳|病)，与你要的 P(病|阳) 方向相反。",
        q_en: "A disease has prevalence 0.1 percent; a test has sensitivity 99 percent and specificity 95 percent. Given a positive result, the probability of actually having the disease is closest to?",
        o_en: ["About 99 percent", "About 2 percent", "About 50 percent", "About 19 percent"],
        why_en: "P(disease|positive) = 0.99*0.001 / (0.99*0.001 + 0.05*0.999) ≈ 0.02: the absolute count of false positives (about 5 percent of the healthy 99.9 percent) dwarfs the true positives. 'The test is accurate' describes P(positive|disease), the opposite direction from the one you asked about."
      },
      {
        q: "为什么分类任务里「最小化交叉熵」等价于「最大似然」？",
        o: ["因为两者都落在 [0,1] 区间", "因为交叉熵就是负对数似然的平均，两者只差符号与一个常数", "因为交叉熵恒等于 KL 散度", "因为 softmax 是凸函数"],
        a: 1,
        why: "softmax 给出类别概率、样本独立时，对数似然是「正确类 log 概率之和」；取负并平均就是交叉熵。而交叉熵 = 数据熵 + KL，其中熵与参数无关，所以最小化 CE、最小化 KL、最大化似然三者等价。",
        q_en: "Why does 'minimising cross-entropy' equal 'maximum likelihood' in classification?",
        o_en: ["Because both live in [0,1]", "Because cross-entropy is the average negative log-likelihood, differing only by sign and an additive constant", "Because cross-entropy is identical to KL divergence", "Because softmax is convex"],
        why_en: "With a softmax giving class probabilities and independent samples, the log-likelihood is the sum of log p(correct class); negate and average it and you have cross-entropy. And since CE = the data's entropy plus KL(p_data ‖ q_θ), with the entropy independent of the parameters, minimising CE, minimising KL and maximising likelihood are one objective."
      },
      {
        q: "判断：p = 0.03 意味着「新模型优于旧模型的概率是 97%」。",
        type: "judge", a: 1,
        why: "p 值是在原假设为真的前提下「观察到这么极端或更极端结果」的概率，既不涉及备择假设为真的概率，也不衡量效应大小。想要「更好的概率」需要贝叶斯后验，或至少把先验明确写出来。",
        q_en: "True or false: p = 0.03 means there is a 97 percent chance the new model is better.",
        why_en: "False. A p-value is the probability of data at least this extreme assuming the null hypothesis; it says nothing about the probability the alternative is true and nothing about effect size. Getting 'the probability it is better' requires a Bayesian posterior, or at least an explicitly stated prior."
      },
      {
        q: "大量独立同分布随机变量的平均值，其抽样分布随样本量增大趋近 ______ 分布（填名字），而误差按 1/√n 缩小。",
        type: "fill", ans: ["正态", "高斯", "normal", "gaussian"],
        why: "这是中心极限定理的内容，也是 95% 置信区间写成均值 ± 1.96·SE 的依据。前提是方差有限且样本近似独立——重尾或分组相关时结论不成立。",
        q_en: "The sampling distribution of a mean of many independent, identically distributed variables approaches the ______ distribution as n grows, while the error shrinks at rate 1/√n.",
        why_en: "That is the central limit theorem, which is also why a 95 percent interval is written as mean ± 1.96·SE. The premises are finite variance and approximate independence; heavy tails or clustered samples break the conclusion."
      }
    ]
  },

  /* ---------- 词典：分类统一「AI 数学基础」，与既有名词查重 ---------- */
  terms: [
    { term: "差商", term_en: "Finite Difference Quotient", cat: "AI 数学基础",
      short: "用 (f(x+h) − f(x))/h 近似导数，是数值梯度检查的基本工具。",
      short_en: "Approximating a derivative by (f(x+h) − f(x))/h, the workhorse of numerical gradient checks.",
      detail: ["误差由截断项 O(h) 与舍入项 O(eps/h) 相加，所以存在最优步长而非越小越好。", "中心差商消掉一阶误差项，最优步长约 eps 的立方根，梯度检查一律用它。"],
      detail_en: ["Truncation O(h) and rounding O(eps/h) add up, so an optimal step exists and smaller is not better.", "Central differences cancel the first-order term, with an optimal step near the cube root of eps, which is why gradient checking uses them."],
      vs: "差商是数值近似，自动求导给出的是精确到机器精度的解析导数。",
      vs_en: "A difference quotient is a numerical approximation; autodiff yields the analytic derivative up to machine precision." },
    { term: "梯度检查", term_en: "Gradient Checking", cat: "AI 数学基础",
      short: "用中心差商算出数值梯度，与反向传播的解析梯度逐元素对拍。",
      short_en: "Comparing a central-difference numerical gradient with the analytic one from backpropagation, element by element.",
      detail: ["比较相对误差而不是绝对误差；1e-7 量级算通过，1e-3 已经不可信。", "必须关掉 dropout 等随机层并固定种子，否则两次前向本身就不同。"],
      detail_en: ["Compare relative rather than absolute error; around 1e-7 passes and 1e-3 already fails.", "Stochastic layers must be off and the seed fixed, or the two forwards are simply different runs."],
      vs: "梯度检查验证「实现对不对」，不验证「梯度有没有用」。",
      vs_en: "Gradient checking tests whether the implementation is right, not whether the gradient is useful." },
    { term: "鞍点", term_en: "Saddle Point", cat: "AI 数学基础",
      short: "梯度为 0 但既有上升方向又有下降方向的驻点。",
      short_en: "A stationary point with both upward and downward directions — gradient zero, not an extremum.",
      detail: ["判据是 Hessian 特征值有正有负；高维问题里鞍点远比局部极小常见。", "一阶方法在鞍点处靠数据噪声推走，纯梯度下降理论上可以无限期停留。"],
      detail_en: ["The test is a Hessian with mixed-sign eigenvalues; in high dimensions saddles vastly outnumber local minima.", "First-order methods get shoved off saddles by gradient noise; on pure gradient descent they could stall indefinitely."],
      vs: "局部极小是各方向都上升，鞍点是方向有升有降，平台是曲率接近 0。",
      vs_en: "A local minimum rises in every direction, a saddle rises in some and falls in others, a plateau barely curves at all." },
    { term: "海森矩阵", term_en: "Hessian Matrix", cat: "AI 数学基础",
      short: "二阶偏导排成的对称矩阵，描述函数在各方向上的曲率。",
      short_en: "The symmetric matrix of second partials, encoding curvature in every direction.",
      detail: ["正定意味着该驻点是严格局部极小；特征值范围决定学习率上限。", "n 个参数要存 n² 项，所以实践中用拟牛顿或 Hessian-向量积来「测」曲率而不是存它。"],
      detail_en: ["Positive definite means the stationary point is a strict local minimum, and the eigenvalue range caps the learning rate.", "n parameters cost n² entries, so practice measures curvature with quasi-Newton updates or Hessian-vector products instead of storing it."],
      vs: "梯度给方向，Hessian 给曲率；一阶方法用前者，牛顿法用两者。",
      vs_en: "The gradient gives a direction, the Hessian gives curvature; first-order methods use the former, Newton's method both." },
    { term: "凸函数", term_en: "Convex Function", cat: "AI 数学基础",
      short: "任意弦不低于函数图像，等价于二阶导非负或 Hessian 半正定。",
      short_en: "Every chord lies on or above the graph, equivalently a non-negative second derivative or a positive semi-definite Hessian.",
      detail: ["凸问题里任何局部极小都是全局极小，所以「换个初始化结果不同」不该发生。", "线性/逻辑回归、岭回归是凸的；神经网络不是，凸性只在逐层近似意义上有用。"],
      detail_en: ["On convex problems every local minimum is global, so 'different initialisation, different answer' cannot legitimately occur.", "Linear and logistic regression and ridge are convex; neural networks are not, so convexity only helps layer-wise approximations."],
      vs: "凸是「形状保证唯一最优」，光滑是「可导保证线性近似可用」，两回事。",
      vs_en: "Convexity guarantees one optimum; smoothness guarantees the linear approximation is usable. Separate properties." },
    { term: "基率谬误", term_en: "Base-Rate Fallacy", cat: "AI 数学基础",
      short: "只看条件似然、忽略先验概率，从而把阳性直接当成患病的错误推理。",
      short_en: "Reading a positive test as the disease by weighing the likelihood while ignoring the prior.",
      detail: ["患病率 0.1%、准确率 99% 时，阳性后验只有约 2%：假阳性的绝对数量压倒真阳性。", "对应到机器学习：类别极不平衡时只看 precision 会严重高估，必须连同基率一起报告。"],
      detail_en: ["With 0.1 percent prevalence and 99 percent accuracy a positive carries only about 2 percent disease probability, because false positives numerically swamp true ones.", "The machine-learning twin: on highly imbalanced classes, quoting precision alone overstates performance; report it next to the base rate."],
      vs: "基率是 P(A)，似然是 P(B|A)，后验是 P(A|B)：三者不可互相替代。",
      vs_en: "The base rate is P(A), the likelihood P(B|A), the posterior P(A|B); none substitutes for another." },
    { term: "共轭先验", term_en: "Conjugate Prior", cat: "AI 数学基础",
      short: "与似然搭配后后验仍落在同一分布族里，更新变成参数相加。",
      short_en: "A prior that keeps the posterior in the same family as the likelihood, reducing updating to addition.",
      detail: ["Beta 配二项：后验是 Beta(α+成功数, β+失败数)，等价于「带上历史再算」。", "它也是拉普拉斯平滑的来源：α=β=1 就是均匀先验，0 次点击不再被估成 0%。"],
      detail_en: ["Beta with a binomial gives Beta(α+successes, β+failures), i.e. compute with your history folded in.", "That is also where Laplace smoothing comes from: α=β=1 is a uniform prior, so zero clicks is no longer an estimate of zero."],
      vs: "共轭先验是「代数上方便」的选择，信息先验是「业务上诚实」的选择。",
      vs_en: "A conjugate prior is chosen for algebraic convenience; an informative prior for factual honesty." },
    { term: "标准误", term_en: "Standard Error", cat: "AI 数学基础",
      short: "估计量（如样本均值）的抽样分布标准差，等于 σ/√n。",
      short_en: "The standard deviation of an estimator's sampling distribution, sigma over root n for a mean.",
      detail: ["误差减半要 4 倍样本：它是所有「评估集要多大」问题的算术根源。", "样本分组相关时要按有效样本量算，否则标准误被系统性低估。"],
      detail_en: ["Halving the error costs four times the samples: it is the arithmetic behind every 'how big should the evaluation set be' question.", "With clustered data use the effective sample size, otherwise the standard error is understated."],
      vs: "标准差描述数据本身的散布，标准误描述估计的不确定性。",
      vs_en: "Standard deviation describes how the data spreads; standard error describes how unsure the estimate is." },
    { term: "中心极限定理", term_en: "Central Limit Theorem", cat: "AI 数学基础",
      short: "独立同分布、方差有限的变量取平均，抽样分布趋于正态。",
      short_en: "The mean of independent, identically distributed finite-variance variables becomes normal in distribution.",
      detail: ["它给出形状与速度：均值近似正态、误差按 1/√n 缩小，置信区间由此而来。", "大数定律只说「会收敛」，中心极限定理才说「长什么样、有多快」。"],
      detail_en: ["It supplies both the shape and the rate: the mean is approximately normal and the error shrinks at 1/√n, which is where intervals come from.", "The law of large numbers only promises convergence; the central limit theorem says what the distribution looks like and how fast it tightens."],
      vs: "大数定律讲极限值，中心极限定理讲极限分布。",
      vs_en: "The law of large numbers names the limit value; the central limit theorem names the limiting distribution." },
    { term: "p 值", term_en: "p-value", cat: "AI 数学基础",
      short: "原假设为真时，观察到当前或更极端结果的概率。",
      short_en: "The probability, assuming the null hypothesis, of data at least this extreme.",
      detail: ["它不是「假设为真的概率」，不是效应大小，也不是「结果重要的概率」。", "多重比较与边看边加样本都会让它失效：名义 5% 的错误率会涨到几十个百分点。"],
      detail_en: ["It is not the probability a hypothesis is true, not an effect size, and not the probability the result matters.", "Multiple comparisons and peeking-while-growing the sample break it: the nominal 5 percent error rate climbs by tens of points."],
      vs: "p 值回答「是不是噪声」，效应量与置信区间回答「差多少、大概范围」。",
      vs_en: "The p-value asks 'is this noise'; effect size and interval answer 'how big, and roughly within what range'." }
  ],

  achievements: [
    { id: "ma_gradient", icon: "📉", name: "梯度手感", name_en: "Gradient Instinct",
      desc: "完成 ma3 · 微积分基础 全部课节", desc_en: "Finish every lesson of ma3 Calculus Basics",
      check: ["ma3"] },
    { id: "ma_inference", icon: "🎲", name: "不确定性读者", name_en: "Reader of Uncertainty",
      desc: "完成 ma4 · 概率与统计 全部课节", desc_en: "Finish every lesson of ma4 Probability & Statistics",
      check: ["ma4"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "同一个函数：解析导数是 3x²-2，在 x=1 处应当等于 1.0": "same function: the analytic derivative is 3x²-2, which should give 1.0 at x=1",
    "前向差商：h 太小会让 f(x+h) 与 f(x) 变成同一个浮点数": "forward quotient: too small an h makes f(x+h) and f(x) the same float",
    "中心差商：截断误差从 O(h) 降到 O(h²)，同量级步长下明显更准": "central quotient: truncation drops from O(h) to O(h²), clearly better at the same step size",
    "机器 eps 决定一切：float64 约 2.2e-16，最优步长在平方根与立方根量级": "machine eps decides everything: about 2.2e-16 in float64, so the best step is a square or cube root of it",
    "不可导点：abs 在 0 处前向差商给 1、中心差商给 0，两者都不是导数": "a non-differentiable point: at 0 the forward quotient says 1 and the central one says 0, and neither is the derivative",
    "单个神经元的激活：把任意实数压进 0 到 1": "one neuron's activation: squeezes any real number into (0,1)",
    "平方损失：前面的 0.5 让求导后系数刚好为 1": "squared loss: the leading 0.5 makes the differentiated coefficient exactly 1",
    "反向：三段局部导数从后往前连乘，就是链式法则": "backward: multiply the three local derivatives from back to front — the chain rule",
    "sigmoid 的导数只依赖它自己的输出，最大只有 0.25": "sigmoid's derivative depends only on its own output and peaks at 0.25",
    "梯度形状必须与参数一致：这条断言能挡住大多数广播错误": "the gradient's shape must match the parameter's: this assert blocks most broadcast mistakes",
    "梯度检查：每次只拨一个参数，用中心差商当金标准": "gradient check: nudge one parameter at a time and treat the central quotient as gold standard",
    "比相对误差不比绝对误差：1e-7 量级才算实现正确": "compare relative error, not absolute: around 1e-7 is what 'implemented correctly' looks like",
    "一个椭圆碗：y 方向的曲率是 x 方向的 3 倍": "an elliptical bowl: curvature along y is three times that along x",
    "梯度：把各偏导拼成向量，指向上升最快的方向": "the gradient: partials assembled into a vector, pointing uphill fastest",
    "方向导数等于梯度点乘单位方向：最大值为 ‖g‖，出现在梯度方向上": "the directional derivative is the gradient dotted with a unit direction: maximal at ‖g‖, in the gradient's own direction",
    "与梯度垂直的方向上，一阶近似下函数值不变：那就是等高线的切向": "perpendicular to the gradient the function does not change to first order: that is the tangent to the contour",
    "负梯度下降：在扁碗里几乎只是横着走，下一步甩回另一边，形成锯齿": "descending along minus the gradient: in a flat bowl it mostly moves sideways and swings back, tracing a zig-zag",
    "条件数为 10 的二次碗：两个方向的曲率分别是 2 与 20": "a quadratic bowl with condition number 10: curvatures 2 and 20",
    "更新式：参数减去学习率乘梯度": "the update: parameters minus the learning rate times the gradient",
    "上限 2/λmax 等于 0.1：η=0.11 直接发散；最快点 2/(λmin+λmax) 约 0.0909": "the ceiling 2/λmax is 0.1: η=0.11 diverges outright, and the fastest point 2/(λmin+λmax) is about 0.0909",
    "梯度裁剪：只缩长度、不改方向": "gradient clipping: shortens only, never turns",
    "动量：低曲率方向累积、高曲率方向抵消，专治锯齿": "momentum: accumulates along low-curvature directions and cancels along sharp ones, an antidote to zig-zag",
    "指数函数：每一阶导数都是它自己，是最好的泰勒教具": "the exponential: every derivative is itself, the best teaching aid for Taylor series",
    "n 阶泰勒多项式在 0 附近的逼近": "the degree-n Taylor polynomial approximating near 0",
    "越远离展开点，需要越高阶才追得上：局部近似只保证局部": "the farther from the expansion point, the higher the order needed: a local approximation is only local",
    "二阶模型的最低点：最优步长等于负的一阶导除以二阶导，这就是牛顿步": "the bottom of the second-order model: the optimal step is minus the first derivative over the second — the Newton step",
    "曲率大就步子小，曲率趋于 0 则步长失去约束，必须退回一阶或加信任域": "large curvature means a small step; as curvature goes to 0 the step is unbounded and you need a trust region or a fallback to first order",
    "一维凸性检查：x 的四次方的二阶导 12x² 处处非负，所以是凸函数": "a 1-D convexity check: the second derivative of x to the fourth is 12x², non-negative everywhere, hence convex",
    "连续期望就是积分：均匀分布下 x 的平方在 0 到 1 的积分等于三分之一": "a continuous expectation is an integral: the mean of x squared under a uniform law on [0,1] is one third",
    "0.5 让平方项求导后系数刚好为 1": "the 0.5 makes the coefficient exactly 1 after differentiating",
    "反向：三段局部导数连乘，形状与参数一致": "backward: three local derivatives multiplied, shape matching the parameter",
    "中心差商：逐个参数拨动，其余保持不动": "central quotient: nudge one parameter at a time, hold the rest",
    "相对误差到 1e-7 量级才算实现正确：比的是相对量而不是绝对量": "only around 1e-7 relative error counts as correct: compare magnitudes relatively, not absolutely",
    "以曲率 2 与 20 为例：稳定上限 2/λmax、最快点 2/(λmin+λmax)，一次算清省掉整晚试错": "curvatures 2 and 20 as the example: the stability ceiling 2/λmax and the fastest point 2/(λmin+λmax), computed once instead of tuned all night",
    "步长过大时是发散、震荡还是只是爬不动，取决于曲率与初值：打印才看得见": "whether an oversized step diverges, oscillates or merely crawls depends on curvature and start point: printing is what makes it visible",
    "一个离散分布：全部非负，加起来等于 1": "a discrete distribution: all non-negative and summing to 1",
    "大数定律：频率会收敛到真实概率，但「多快」要等中心极限定理来回答": "law of large numbers: frequencies converge to the true probabilities, but 'how fast' is answered only by the central limit theorem",
    "行是是否下雨，列是是否带伞：这是联合分布": "rows are rain or no rain, columns umbrella or none: this is the joint distribution",
    "条件概率等于联合除以对应的边缘：下雨天里带伞的比例": "conditional probability is the joint divided by the matching marginal: the share of umbrella-carriers among rainy days",
    "概率连乘必然下溢：搬到 log 域做加法": "products of probabilities underflow for sure: move to the log domain and add",
    "归一化用 logsumexp：先减最大值，再 exp、求和、取 log": "normalise with logsumexp: subtract the max, exponentiate, sum, then take the log",
    "垃圾邮件：先验 1%，关键词在垃圾里出现率 60%、在正常邮件里 2%": "spam filter: prior 1 percent, the keyword appears in 60 percent of spam and 2 percent of ham",
    "医疗筛查同款：假阳性的绝对数量远大于真阳性，所以阳性未必患病": "the same arithmetic as medical screening: false positives vastly outnumber true ones, so a positive need not mean disease",
    "先验换成 5% 与 30%：同一个「准确」的检测，结论完全取决于基率": "change the prior to 5 and 30 percent: the same 'accurate' test, and the conclusion rides entirely on the base rate",
    "Beta 先验：alpha-1 次成功、beta-1 次失败；后验参数就是两者相加": "Beta prior: α−1 successes and β−1 failures; the posterior parameters are just the sums",
    "不平滑时 0 次点击会被判成 0%，新广告永远爬不起来": "without smoothing, zero clicks is read as 0 percent and a new ad can never climb",
    "与 x 相关的变量：噪声幅度由目标相关系数反推出来": "a variable correlated with x: the noise amplitude is back-solved from the target correlation",
    "np.var 默认除 n（ddof=0），np.cov 默认除 n-1（ddof=1）：两边默认值不一致": "np.var divides by n (ddof=0) while np.cov divides by n-1 (ddof=1): their defaults disagree",
    "协方差矩阵：对角是方差，非对角是两两协方差，且对称半正定": "the covariance matrix: variances on the diagonal, pairwise covariances off it, symmetric and positive semi-definite",
    "零相关不等于无关：对称取样下 x 与 x 的平方的相关是 0": "zero correlation is not independence: over a symmetric sample, x and x squared are uncorrelated",
    "尺度翻倍，方差翻四倍：这就是必须先标准化的理由": "double the scale, quadruple the variance: the reason to standardise first",
    "与噪声的相关约 0：任何「相关很小」的结论都要先排除分组与非线性": "correlation with pure noise is about 0: any 'barely correlated' claim must first rule out clustering and nonlinearity",
    "每次抽 n 个均匀样本求平均，重复 2000 次：这就是「重复实验」的模拟": "average n uniform draws, repeated 2000 times: a simulation of 'rerunning the experiment'",
    "均值约 0.5，标准差按 1/√n 缩小，理论值是 (1/√12)/√n": "the mean is about 0.5 and the spread shrinks as 1/√n; the theory value is (1/√12)/√n",
    "计数用泊松，0/1 次数用二项，连续量用正态：先问数据是什么形状": "counts go to Poisson, success counts to binomial, continuous quantities to the normal: ask the shape of the data first",
    "把若干个均匀变量相加：分布从方形逐渐变成钟形": "add several uniform variables: the distribution morphs from a box into a bell",
    "重尾的柯西分布：均值不收敛，加大样本也不会稳定下来": "the heavy-tailed Cauchy: its mean does not converge and more samples do not settle it",
    "先减最大值：exp 不再溢出，归一化结果完全不变": "subtract the max first: exp no longer overflows and the normalised result is unchanged",
    "负对数似然的平均：这就是「最小化 CE 等于最大似然」的实现": "the mean negative log-likelihood: this is 'minimising CE equals maximising likelihood' in code",
    "极端 logits 下不合并实现就会溢出：先减最大值是唯一可靠的做法": "with extreme logits an unfused implementation overflows: subtracting the max is the only dependable way",
    "标签是硬 0/1 时惩罚无界：标签平滑把目标分布从一角挪开": "hard 0/1 labels make the penalty unbounded: label smoothing moves the target off the corner",
    "先 softmax 再取 log 还顺手 clip：小概率被归 0，梯度真的消失了": "softmax then log then clip: small probabilities flush to zero and their gradient genuinely disappears",
    "旧模型点击率 10%，新模型真实提升 1.5 个百分点": "old model clicks at 10 percent, the new one is truly 1.5 points better",
    "两比例差的标准误：这就是「噪声有多大」的那个数字": "the standard error of the difference of two proportions: the number that means 'how big is the noise'",
    "p 值：原假设为真时，出现这么极端或更极端结果的概率": "the p-value: the probability of a result this extreme or more so, given the null hypothesis",
    "置信区间才回答「大概提升多少」，p 值不回答这个": "the confidence interval answers 'roughly how much lift'; the p-value does not",
    "重复实验：重抽 2000 次，看差异的抽样分布到底宽到什么程度": "replicate the experiment: resample 2000 times to see how wide the sampling distribution really is",
    "多重比较：测 20 个纯噪声种子，平均会有几个「显著」": "multiple comparisons: test 20 pure-noise seeds and count how many come out 'significant'"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_MA34);
