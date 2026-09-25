/* ================================================================
 * R0:hello agi · 课程深化层 ⑫（dl1 神经网络基础 / dl2 PyTorch 实战训练）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把深度学习入门两章从每节 3 要点深化到 7~8 要点，教学重心固定在三件事上——
 *       「训练为什么不动」「为什么会崩」「为什么分数是假的」。dl1 补齐非线性激活、
 *       链式法则、梯度消失/爆炸、初始化尺度、lr×batch×步数、归一化层、dropout 与
 *       优化器差异；dl2 补齐 device/dtype、计算图与 requires_grad、zero_grad、
 *       train()/eval()、no_grad 与 inference_mode、DataLoader、显存来源、混合精度与
 *       梯度裁剪、state_dict 与可复现。两章各加一节「综合重构」收口课。
 * 写法沿用 agi-deepen-s12.js：既有课节不写 title；新课写 title/target；
 * order 覆盖全部既有 id；code 里的中文注释全部登记在 codeComments。
 * 所有示例纯本地离线：只用随机张量与内存里造的数据，不下载数据集、不联网、无服务端。
 * ================================================================ */

const DEEPEN_DL12 = {
  stages: ["dl1", "dl2"],

  order: {
    dl1: ["dl1-1", "dl1-2", "dl1-3", "dl1-4", "dl1-5", "dl1-6"],
    dl2: ["dl2-1", "dl2-2", "dl2-3", "dl2-4", "dl2-5", "dl2-6"]
  },

  lessons: {

    /* ===================== dl1 神经网络基础 ===================== */
    "dl1-1": {
      min: 13,
      summary: [
        "一个神经元就做两件事：先算仿射变换 z = W·x + b，再逐元素过一遍非线性 a = act(z)。偏置不是装饰——没有 b，所有分界面都被钉死在过原点上，「阈值」这件事就表达不出来。",
        "为什么必须有非线性：两层没有激活的网络是 W₂(W₁x) = (W₂W₁)x，乘积仍是一个矩阵，等于一层。也就是说，不装激活的话，堆 100 层也只能画出直线和超平面——「深」的全部意义来自那个 act。",
        "深度和宽度是两种花钱方式：理论上「足够宽的一层」就能逼近任意连续函数（万能逼近），但所需宽度可能随任务指数增长；实践中深而窄通常更省参数、也更好优化，因为深层能复用中间表示。",
        "从感知机到多层网络的关键一步是可导性：感知机用阶跃函数，阶跃处导数为 0 或未定义，梯度下降根本走不动；换成 sigmoid/ReLU 之后「多层 + 梯度」才成立——这是经典机器学习通往深度学习的那道门，也是 dl1-4 反向传播能存在的前提。",
        "参数量必须能口算：一层 = in×out + out。784→256 就是 200,800 个参数，比「一点点权重」的直觉大两个数量级；显存预算、过拟合风险、初始化尺度，全都从这条算式起步。",
        "形状约定本身就是 bug 源：约定批量在前 (B, in)、权重存成 (in, out)，那么前向是 X @ W。如果哪天写成 X @ W.T 而 in 恰好等于 out，尺寸完全对得上、不报任何错，你只是在另一个坐标系里学了一个转置过的模型。",
        "一层线性变换的输出只能落在 W 的列空间里（呼应 ma1 的秩）：out < in 时信息被不可逆地压掉，out > in 才有升维余地。这也是「通道数不能乱设」的数学理由，而不只是调参口味。",
        "衔接：本章前置是 ml1（梯度下降与损失）、ml2（交叉熵）、ma1（矩阵乘与秩）、ma3（链式法则）；下一节 dl1-2 正面回答「激活函数到底怎么选」。"
      ],
      summary_en: [
        "A neuron does exactly two things: form z = W.x + b, then apply a nonlinearity elementwise, a = act(z). The bias is not decoration - without it every decision boundary is forced through the origin and 'threshold' cannot be expressed at all.",
        "Why nonlinearity is mandatory: a two-layer net without activation computes W2(W1 x) = (W2 W1) x, and a product of matrices is still one matrix. So with no activation, 100 layers can only ever draw straight lines - everything depth buys you comes from that act().",
        "Depth and width are two ways to spend the same budget: in theory one sufficiently wide layer approximates any continuous function, but the width needed can grow exponentially with the task; in practice deep-and-narrow usually costs fewer parameters and optimises better because intermediate representations get reused.",
        "The step from a perceptron to a multilayer net is differentiability: a perceptron uses a step function whose derivative is 0 or undefined, so gradient descent cannot move; switching to sigmoid/ReLU is what makes 'many layers + gradients' work, and it is the premise of backprop in dl1-4.",
        "Count parameters by hand: one layer is in*out + out, so 784 to 256 is 200,800 numbers - two orders of magnitude more than the intuition of 'a few weights'. Memory budget, overfitting risk and initialisation scale all start from that arithmetic.",
        "The shape convention is itself a bug source: with the batch first (B, in) and weights stored (in, out), the forward pass is X @ W. Write X @ W.T on a square layer and the shapes still match perfectly, nothing complains - you are just learning a transposed model in another coordinate system.",
        "A linear layer can only output vectors inside the column space of W (the rank idea from ma1): out < in throws information away irreversibly, out > in is what makes lifting possible. That is the mathematical reason channel counts are not free, not merely taste.",
        "Bridge: this chapter presumes ml1 (gradient descent and losses), ml2 (cross-entropy), ma1 (matrix products and rank) and ma3 (the chain rule); dl1-2 answers the question of how to actually pick an activation."
      ],
      code: `import numpy as np

# 一个神经元：先仿射，再逐元素过非线性；偏置让分界面能离开原点
x = np.array([0.6, -1.2, 2.0])
W = np.array([[0.1, 0.4, -0.3], [0.7, -0.2, 0.5]])
b = np.array([0.05, -0.1])
z = W @ x + b
# ReLU 这一步才是「非线性」的全部来源，前面那段只是直线
a = np.maximum(0, z)
print("z", np.round(z, 3), "a", np.round(a, 3))

# 参数量口算：in*out + out，显存与过拟合都从这条算式起步
print("params", W.size + b.size)

rng = np.random.default_rng(0)
W1 = rng.normal(size=(3, 4))
W2 = rng.normal(size=(4, 5))
deep = x @ W1 @ W2
flat = x @ (W1 @ W2)
# 关键实验：两层「不加激活」的网络和一层数值上完全一样
print("linear stack == single layer:", bool(np.allclose(deep, flat)))`,
      pit: "把「层数不够」当成模型不行的原因，于是一路加深却仍然不加激活（或者反过来在输出层后面补一个 ReLU 想「再非线性一下」）。前者只是在重复算同一个线性映射，加深一百层参数变多、表达能力一点没变；后者会把输出压成非负，多分类 logits 立刻失去负数区间，loss 卡在一个奇怪的平台上不动。",
      pit_en: "Blaming 'not enough layers' and stacking depth without activations - or adding a ReLU after the output layer 'for extra nonlinearity'. The first just recomputes the same linear map with more parameters and zero extra expressiveness; the second forces the output non-negative, robs classification logits of their negative range, and parks the loss on a strange plateau.",
      ex: {
        q: "为什么「多层线性等价于单层」这件事必须用矩阵乘法结合律来说明，而不是靠感觉？",
        a: "因为结合律给出的是恒等而不是近似：W₂(W₁x) 与 (W₂W₁)x 对任意输入都相等，所以任何「只由线性层组成」的网络都存在一个单层的完全等价替身，深度在这里没有任何收益。",
        q_en: "Why must 'several linear layers equal one' be argued with associativity rather than intuition?",
        a_en: "Because associativity gives an identity, not an approximation: W2(W1 x) equals (W2 W1) x for every input, so any network made only of linear layers has an exactly equivalent one-layer twin, and depth buys nothing there."
      }
    },

    "dl1-2": {
      min: 13,
      summary: [
        "ReLU = max(0, z)：正侧导数恒为 1（连乘不衰减）、负侧为 0（单侧抑制），计算便宜且不饱和，所以它是默认答案；记住「默认」不等于「无条件」，它有三个代价在下面。",
        "梯度消失的机制就是一串导数连乘：sigmoid 的导数最大只有 0.25，tanh 最大是 1 但同样在两端饱和；网络越深，0.25 的 n 次方就越大次方地趋零，于是浅层参数几乎收不到更新信号——这就是「越深越不动」的算术来源。",
        "ReLU 的第一颗雷是「死亡神经元」：某个单元的输入长期为负，它的梯度就恒为 0，从此永远不会再被更新，这个位置等于报废。学习率过大是主要成因（一步把偏置推到负侧回不来），LeakyReLU/GELU 是常见的补救。",
        "ReLU 输出全非负，会让下一层权重的梯度在同一批数据里被朝同一个符号一致拉动，更新方向因此发抖；这解释了为什么激活之后常常紧跟一个归一化层（dl1-5），也解释了为什么有些结构偏爱零中心的 tanh。",
        "输出层与损失必须成对：二分类用 sigmoid + BCE，多分类用 softmax + 交叉熵。但框架里的 CrossEntropyLoss 内部已经做了 log-softmax，你自己再 softmax 一次等于对概率再取一次概率——logits 再大也被重新归一回一个有下界的窄带里，loss 压不下去、梯度同时趋零。这是「照理该对」却训不动的头号错误。",
        "数值稳定性是激活函数的一半内容：softmax 不减最大值时 exp(1000) 直接溢出成 inf；sigmoid 在大负数处下溢为 0，于是 log(0) = -inf。所以要用 binary_cross_entropy_with_logits 这类「带 logits」版本，而不是自己手写 sigmoid 再把概率喂进去。",
        "选激活的依据是「这一层输出要满足什么约束」而不是「哪个更新」：门控要 0~1 所以是 sigmoid；要零中心的循环状态用 tanh；Transformer 的 FFN 用 GELU/SwiGLU；输出是分布就交给 softmax 并配合温度缩放。",
        "什么时候该怀疑激活：loss 变成 NaN（饱和/溢出）、梯度全为 0（死 ReLU 或双 softmax）、或分数极低且怎么调 lr 都没反应（输出层与损失没配对）。这三条症状分别指向不同的修法，先分清是哪一种再动代码。"
      ],
      summary_en: [
        "ReLU = max(0, z): the positive side has derivative exactly 1 so products do not decay, the negative side is single-sided suppression, it is cheap and never saturates, which is why it is the default - but 'default' is not 'free', and the next three points are its bill.",
        "Vanishing gradients are one line of arithmetic: the derivative of sigmoid peaks at 0.25 and tanh peaks at 1 yet still saturates at both ends, so stacking n of them multiplies n factors below 1 and the early layers stop receiving any update signal.",
        "ReLU's first landmine is the dead unit: if a neuron's input stays negative, its gradient is identically 0 forever and that unit is simply wasted. Too large a learning rate is the usual cause, since one big step can push its bias to the negative side permanently; LeakyReLU and GELU are the common repairs.",
        "ReLU outputs are all non-negative, so within one batch the gradient of the next layer's weights gets dragged in the same sign for every sample, making updates jitter. That is why an activation is usually followed by a normalisation layer (dl1-5), and why some architectures prefer zero-centred tanh.",
        "Output layer and loss must come as a pair: sigmoid with BCE for binary, softmax with cross-entropy for multi-class. But the framework's CrossEntropyLoss already contains log-softmax, so applying softmax yourself takes a probability of a probability - no matter how large the logits, the result is renormalised back into a narrow band with a hard floor, so the loss cannot descend and the gradient evaporates at the same time. This is the number-one reason a 'seemingly correct' setup will not train.",
        "Half of activation functions is numerical stability: softmax without subtracting the max overflows exp(1000) to inf, and sigmoid underflows to 0 on large negatives so log(0) becomes -inf. Use the with-logits variants instead of writing sigmoid yourself and feeding the probability in.",
        "Pick an activation by asking what constraint that layer's output must satisfy, not which one is newest: gates need 0-1 so sigmoid; a zero-centred recurrent state wants tanh; Transformer FFNs use GELU or SwiGLU; a distribution comes from softmax with a temperature on top.",
        "When to suspect the activation: loss turns NaN (saturation or overflow), gradients are all zero (dead ReLU or double softmax), or the score stays terrible no matter the learning rate (output layer not paired with the loss). Those three symptoms have three different fixes, so identify yours before editing."
      ],
      code: `import numpy as np

def softmax(v):
    # 减去最大值不改变结果，却把指数全部压回可表示区间
    e = np.exp(v - np.max(v))
    return e / e.sum()

z = np.linspace(-6, 6, 13)
sig = 1 / (1 + np.exp(-z))
# sigmoid 的导数在 z=0 处取到全局最大 0.25，再也没有更大的了
print("max sigmoid grad", float((sig * (1 - sig)).max()))
# 反向传播要把每层激活的导数连乘，层数就是指数
print("5 layers", 0.25 ** 5, "20 layers", 0.25 ** 20)

logits = np.array([1000.0, 1001.0, 999.0])
with np.errstate(over="ignore", invalid="ignore"):
    # 不做减法的 softmax：exp 溢出成 inf，inf/inf 变成 nan
    naive = np.exp(logits) / np.exp(logits).sum()
print("naive", naive, "safe", np.round(softmax(logits), 4))

# 双重 softmax：logit 已经很有把握（10 对 0），再过一次就退回近似均匀
p = softmax(np.array([10.0, 0.0, 0.0]))
p2 = softmax(p)
print("once", np.round(p, 5), "twice", np.round(p2, 5))
# 三类的下界就是 -log(e/(e+2)) 约 0.55：logit 再大也压不过它，梯度同时趋零
print("loss floor", round(float(-np.log(p2[0])), 4))`,
      pit: "手写 `loss = -(y * np.log(softmax(z))).mean()` 而不是用框架的 CrossEntropyLoss：看起来是同一件事，实际差了十万八千里——尾部类别的概率会被压到 1e-40 以下（float32 干脆给 0），log 之后就是 -inf，训练几步 loss 变 NaN，而你去查数据、查学习率都查不出来。把两个算子合成一个（log_softmax）才是数值稳定的写法，这不是风格问题。",
      pit_en: "Writing 'loss = -(y * log(softmax(z))).mean()' by hand instead of using the framework's CrossEntropyLoss: identical on paper, very different in practice. Softmax pushes small logits below 1e-40, log of that is -inf, the loss goes NaN a few steps in, and no amount of inspecting data or learning rate finds it. Fusing the two ops into log_softmax is a numerical requirement, not a style preference.",
      ex: {
        q: "既然 sigmoid 会饱和，为什么 LSTM 的门还全用 sigmoid？",
        a: "因为门需要的正是「饱和」：它想输出一个接近 0 或接近 1 的开关值来控制信息通断，饱和区恰好提供这种硬开关；而主干信息通路走的是加法（cell state），不依赖门的梯度放大，所以饱和不会拖垮长程梯度。",
        q_en: "If sigmoid saturates, why are LSTM gates all sigmoid?",
        a_en: "Because saturation is exactly what a gate wants: it must emit something near 0 or near 1 to switch information on and off, and the saturated ends give that. The information itself travels along the additive cell state, which does not rely on the gate's gradient being large, so saturated gates do not kill long-range gradients."
      }
    },

    "dl1-3": {
      min: 12,
      summary: [
        "前向传播就是逐层复合：a⁽ˡ⁾ = act(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾)。每一层的中间结果叫「激活值」，它不是用完就丢的临时数——反向传播要原封不动地把它们再拿出来用一遍，这是「前向必须缓存」的全部理由。",
        "形状追踪是深度学习第一课：(B, in) @ (in, out) → (B, out)。批量在前、特征在后是 PyTorch 的约定；任何一层尺寸不匹配时，报错常常落在好几层之后，所以养成「每层 print 一次 shape」的习惯比事后读堆栈快得多。",
        "广播是形状 bug 的头号产地：(B, out) + (out,) 是你要的（偏置沿批量方向复制）；但 (B, out) + (B, 1) 会把「每个样本自己的一个标量」整行加上去，尺寸合法、语义全错。宁可多写一次 unsqueeze 或 reshape，也不要依赖隐式广播。",
        "显存的四块来源是参数、梯度、优化器状态和激活值，其中激活值通常最大：它随 batch size 与深度线性增长，因为它必须一直存到反向用完。这解释了「模型才几十 MB，显存却爆 8 GB」这种看起来矛盾的现象（dl2-5 正面算这笔账）。",
        "推理与验证只要预测值，就该把前向包在不建图的模式里（torch.no_grad / inference_mode），否则每张验证图都被挂在训练图上，显存只涨不降——「第一个 epoch 正常、第二个 epoch OOM」多半是这里。",
        "先在小例子上手算再写代码：2 输入、1 隐层 2 单元、1 输出的网络，用纸笔算一遍 z 和 a，再用 assert 逐层比对代码。前向错一步，损失、梯度、更新全部跟着错，而且症状出现在离错误很远的地方，事后无从倒推。",
        "尺度问题在前向就会现形：输入没做归一化、或者权重用方差 1 的 randn 初始化，激活的标准差会逐层成倍放大或塌缩，几层之后不是 inf 就是 0。所以「打印每层激活的均值和标准差」是判断初始化是否合理的最快手段，它早于任何梯度分析（dl1-5 接这一条）。",
        "衔接：前向只负责「算出预测」，损失把它压成一个标量；让这个标量去驱动一万个参数各自动一步，是 dl1-4 反向传播要解决的事。"
      ],
      summary_en: [
        "The forward pass is function composition layer by layer: a(l) = act(W(l) a(l-1) + b(l)). Each layer's intermediate result, the activation, is not a scratch value you may discard - backprop needs exactly those numbers again, which is the whole reason the forward pass must cache them.",
        "Shape tracking is deep learning's first practical skill: (B, in) @ (in, out) gives (B, out), batch first and features last is the PyTorch convention. A mismatch at layer 3 usually surfaces as an error after layer 7, so printing shape once per layer beats reading a stack trace afterwards.",
        "Broadcasting produces the majority of shape bugs: (B, out) + (out,) is what you mean, the bias copied along the batch. But (B, out) + (B, 1) adds each sample's own scalar across its whole row - perfectly legal shapes, completely wrong semantics. Write the extra unsqueeze instead of trusting implicit broadcasting.",
        "Memory has four sources - parameters, gradients, optimiser states and activations - and activations are normally the largest: they grow linearly in batch size and depth because they must survive until backward uses them. That is the resolution of 'my model is 40 MB but training needs 8 GB' (dl2-5 does that arithmetic properly).",
        "Inference and validation only need numbers, so wrap them in a no-grad mode (torch.no_grad or inference_mode); otherwise every validation graph hangs off the training graph and memory only climbs. 'Epoch one fine, epoch two OOM' is usually this.",
        "Hand-compute a tiny case before coding: 2 inputs, one hidden layer of 2 units, 1 output - work out z and a on paper, then assert each layer against the code. One wrong step forward corrupts the loss, every gradient and every update, and the symptom shows up far from the cause, which makes it impossible to walk back later.",
        "Scale problems are visible already in the forward pass: unscaled inputs, or randn weights with variance 1, make activation standard deviations double or collapse layer after layer until they are inf or 0. So printing each layer's mean and std is the fastest initialisation check there is, and it precedes any gradient analysis (dl1-5 picks this up).",
        "Bridge: the forward pass only produces a prediction and the loss squeezes it into one scalar; making that scalar move ten thousand parameters correctly is what dl1-4 backpropagation is for."
      ],
      code: `import numpy as np

rng = np.random.default_rng(0)
B, D = 64, 784
x = rng.normal(size=(B, D))

def forward(scale_rule, label):
    a = x
    parts = []
    for fan_in, fan_out in [(784, 256), (256, 128), (128, 64)]:
        # 尺度必须按每层的 fan_in 单独算，用一个全局常数本身就是一种错
        std = 1.0 if scale_rule == "randn" else (2 / fan_in) ** 0.5
        W = rng.normal(scale=std, size=(fan_in, fan_out))
        a = np.maximum(0, a @ W)
        # 每层只盯一个数：激活的标准差，它比 loss 更早暴露问题
        assert a.shape == (B, fan_out)
        parts.append(round(float(a.std()), 3))
    print(label, "std per layer", parts)

# 形状对、语义错的典型：方阵层写成 X @ W.T 时尺寸照样合法，只能靠 assert 拦
square = rng.normal(size=(16, 16))
left = x[:, :16] @ square
right = x[:, :16] @ square.T
print("both shapes legal:", tuple(left.shape), tuple(right.shape), "same values?", bool(np.allclose(left, right)))

# 方差 1 的初始化：std 每层乘上约 sqrt(fan_in)，第三层就冲到上千
forward("randn", "randn init  ")
# 逐层按 Kaiming 的 sqrt(2/fan_in) 缩放：每层 std 才留在同一量级
forward("kaiming", "kaiming init")`,
      pit: "把标签张量的形状写成 (B,) 还是 (B, 1) 无所谓：算 MSE 或做广播比较时，(B,1) 与 (B,) 会相推出一个 (B, B) 的矩阵，代码不报错、loss 变成一个诡异的数、显存还莫名翻倍。所有「两个一维张量做 elementwise 运算」的地方都要显式 reshape 成同一形状。",
      pit_en: "Assuming (B,) and (B, 1) label shapes are interchangeable: broadcast a (B, 1) against a (B,) and you get a B by B matrix - no error, a nonsense loss, and memory mysteriously doubles. Any elementwise op between two one-dimensional tensors needs an explicit common shape.",
      ex: {
        q: "为什么「梯度还没算，前向的激活标准差就已经能诊断训练」？",
        a: "因为参数更新的大小是损失对参数梯度的函数，而梯度里每一项都带着前向激活值作为因子；激活塌成 0 时梯度必然为 0，激活爆到 inf 时梯度必然是 NaN，所以前向分布是梯度健康度的上游指标。",
        q_en: "Why can the forward pass's activation standard deviation diagnose training before you ever compute a gradient?",
        a_en: "Because every gradient term carries a forward activation as a factor: if activations collapse to zero the gradient must be zero, if they blow up to infinity the gradient must be NaN, so the forward distribution is an upstream indicator of gradient health."
      }
    },

    "dl1-4": {
      min: 14,
      summary: [
        "反向传播的目标只有一个：求 ∂L/∂W 对每一个参数张量。做法是链式法则的记账——定义 δ⁽ˡ⁾ 为「损失对本层预激活 z⁽ˡ⁾ 的梯度」，则 δ⁽ˡ⁾ = (W⁽ˡ⁺¹⁾ᵀ δ⁽ˡ⁺¹⁾) ⊙ act′(z⁽ˡ⁾)，而 ∂L/∂W⁽ˡ⁾ = δ⁽ˡ⁾ 乘上该层输入。每层只需要上游信号和本层前向缓存。",
        "「反向」这个词来自依赖方向：δ⁽ˡ⁾ 里有 δ⁽ˡ⁺¹⁾，所以必须先算输出层再往回走。这也是前向必须把激活全部留着的代价——用显存换一次遍历的时间，而不是把每层重算一遍。",
        "梯度检查是唯一可信的验证手段：拿中心差分 (L(w+ε) − L(w+ε 的反方向))/2ε 与解析梯度对比，相对误差应到 1e-6 量级；只要超过 1e-4，就一定是你的反向写错了，而不是「数值有点漂」。它贵（每个参数两次前向），所以只在调试时开。",
        "断链的症状有两种：如果只有部分路径被剪断，参数一动不动、loss 恒定；如果整个 loss 都脱离了图，backward 会直接抛 element 0 of tensors does not require grad and does not have a grad_fn。常见断点有 .detach()、.numpy()、int(x)/float(x)、x.data、以及在 torch.no_grad() 里做的赋值；还有一种更隐蔽的——把中间张量存进普通 python list 后又整体覆盖，图上留的不是你更新的那条路径。",
        "NaN 与极大梯度各有来源：NaN 多半是 log(0)、0/0，或 fp16 溢出；梯度范数周期性尖峰则是损失尺度、初始化或异常样本造成。定位方法统一是「先打印梯度范数，再逐层拆开」，不要靠改学习率碰运气。",
        "区分两种梯度：对参数的梯度用来更新模型；对输入的梯度（∂L/∂x）用来分析——显著图、对抗样本都走这条路。把两者搞混的典型后果是「我以为在裁剪参数梯度，其实把输入也裁了」，模型行为诡异但查不出错。",
        "python 的 if 与内建 max/sum 会把计算变成标量：`if x > 0:` 里 x 是张量时会立刻求值成 python bool，链子当场断掉；张量上的逐元素条件要用框架算子（如 F.relu 而不是 max(0, x)），否则 autograd 看到的只是一串常数。",
        "衔接：把 dl1-1 那个两层网络用链式法则手推出四个梯度表达式（∂L/∂W₁、∂L/∂b₁、∂L/∂W₂、∂L/∂b₂），再和框架的 autograd 对齐——这个心智模型是 dl2 之后所有「框架为什么这样表现」问题的诊断基础。"
      ],
      summary_en: [
        "Backpropagation has one job: get dL/dW for every parameter tensor. It is bookkeeping with the chain rule - define delta(l) as the gradient of the loss into that layer's pre-activation, then delta(l) = (W(l+1) transpose delta(l+1)) * act'(z(l)), and dL/dW(l) is delta(l) times the layer's input. Each layer needs only the signal from above plus its own forward cache.",
        "The word 'backward' names the dependency direction: delta(l) contains delta(l+1), so the output layer must be done first and the walk proceeds in reverse. That is exactly why the forward pass keeps every activation - memory is traded for a single traversal instead of recomputing each layer.",
        "The gradient check is the only trustworthy verification: compare the analytic gradient with the central difference of the loss and demand roughly 1e-6 relative error; anything above 1e-4 means your backward is wrong, not that numerics are a bit wobbly. It is expensive (two forward passes per parameter) so it runs only while debugging.",
        "A severed chain shows up two ways: if only part of the path is cut, parameters never move and the loss stays constant; if the whole loss leaves the graph, backward itself raises 'element 0 of tensors does not require grad and does not have a grad_fn'. Usual cuts are .detach(), .numpy(), int(x)/float(x), x.data, and assignments made inside torch.no_grad(). A subtler one: stashing intermediates in a plain python list and reassigning them, so the graph traversed is not the path you updated.",
        "NaN and huge gradients come from different places: NaN is usually log(0), 0/0, or fp16 overflow, while periodic spikes in gradient norm come from loss scale, initialisation or outlier rows. The single procedure for both is to print gradient norms per layer and bisect - never retune the learning rate and hope.",
        "Keep the two gradients apart: the one with respect to parameters updates the model, the one with respect to the input is for analysis such as saliency maps and adversarial examples. The classic confusion is clipping what you believed was the parameter gradient while actually touching the input, which leaves the model behaving strangely with no visible error.",
        "Python's if and the built-in max/sum collapse a tensor into a scalar: 'if x > 0:' on a tensor forces it to a python bool and the chain ends right there. Elementwise conditions on tensors must use framework ops (F.relu, not max(0, x)), otherwise autograd sees nothing but constants.",
        "Bridge: take the two-layer net from dl1-1 and hand-derive all four gradient expressions (dL/dW1, dL/db1, dL/dW2, dL/db2), then line them up against the framework's autograd - that mental model is what every 'why does the framework behave like this' question in dl2 reduces to."
      ],
      code: `import numpy as np

rng = np.random.default_rng(0)
x = rng.normal(size=(8, 4))
y = rng.normal(size=(8, 1))
W1 = rng.normal(size=(4, 6)) * 0.5
b1 = np.zeros(6)
W2 = rng.normal(size=(6, 1)) * 0.5
b2 = np.zeros(1)

def forward():
    z1 = x @ W1 + b1
    a1 = np.maximum(0, z1)
    return z1, a1, a1 @ W2 + b2

def analytic():
    # 反向用的就是这份前向缓存，z1/a1 必须和算 loss 那次前向完全一致
    z1, a1, z2 = forward()
    dz2 = 2 * (z2 - y) / y.size
    dW2 = a1.T @ dz2
    db2 = dz2.sum(0)
    # 链式法则：误差先送回头一层的预激活，再乘 ReLU 的导数
    dz1 = (dz2 @ W2.T) * (z1 > 0)
    dW1 = x.T @ dz1
    db1 = dz1.sum(0)
    return [dW1, db1, dW2, db2]

params = [W1, b1, W2, b2]
eps = 1e-5
for idx, p in enumerate(params):
    flat = p.ravel()
    num = np.zeros(p.size)
    for j in range(flat.size):
        keep = flat[j]
        flat[j] = keep + eps
        hi = ((forward()[2] - y) ** 2).mean()
        flat[j] = keep - eps
        lo = ((forward()[2] - y) ** 2).mean()
        flat[j] = keep
        # 中心差分：单侧差分会把误差放大一个数量级
        num[j] = (hi - lo) / (2 * eps)
    ana = analytic()[idx].ravel()
    rel = float(np.abs(num - ana).max() / (np.abs(num).max() + 1e-12))
    print("param", idx, "max relative grad error", f"{rel:.2e}")`,
      pit: "在 `for` 循环里用 python 的 `if loss > 1.0: break` 或者把 loss 存进 list 后再 `sum(losses).backward()`：前者会触发一次同步求值（GPU 上尤其慢），后者把已经释放的计算图重新拼起来，第二次 backward 会报「穿过已释放的图」。正确做法是每步单独 backward，或明确用 retain_graph（但通常说明循环结构写错了）。",
      pit_en: "Writing 'if loss > 1.0: break' inside the loop, or collecting losses into a list and calling sum(losses).backward() once: the first forces a device sync (painfully slow on a GPU), the second tries to traverse graphs whose buffers were already freed. Backprop once per step, and treat a craving for retain_graph as a smell in your loop structure.",
      ex: {
        q: "为什么梯度检查时要把参数全部展开成一维向量逐个扰动，而不是随机抽几个？",
        a: "因为反向的 bug 常常只落在某一个分支或某一层上（例如只有偏置算错），随机抽样很容易全部落在正确的方向上；小网络必须逐个查，大网络才退化成「分层抽若干个、每层多抽几个」。",
        q_en: "Why perturb every parameter one at a time in a gradient check instead of sampling a few at random?",
        a_en: "Because backward bugs typically live in one branch or one layer - say only the bias term is wrong - and random sampling can easily miss it entirely. Exhaustive perturbation on small nets is exactly the point; large nets fall back to stratified sampling with several probes per layer."
      }
    },

    "dl1-5": {
      min: 15,
      summary: [
        "SGD 只做 w ← w − η·g；momentum 再加一条速度 v ← μv + g，然后 w ← w − η·v。它把梯度做了指数滑动平均：在窄谷里来回抖的分量互相抵消，方向一致的分量被累积放大，所以既能加速又能抑制震荡——μ 通常 0.9，意味着它记的是最近约 10 步。",
        "Adam = momentum + 逐参数自适应步长（一阶矩 m̂ 除以二阶矩 v̂ 的平方根），所以它对参数尺度不敏感、默认 lr≈1e-3 就能跑。代价有两条：每个参数要多存两份状态（显存翻倍），而且在 CV 任务上泛化常常不如调好的 SGD+momentum——「Adam 更先进」不是结论，是一句口号。",
        "weight decay 与 L2 正则不是一回事：只有在朴素 SGD 里二者完全等价。换成 Adam 后，L2 项会先被塞进梯度、再被自适应步长重新缩放一次，正则强度与梯度大小耦合起来；AdamW 把衰减从梯度里拆出来直接作用在权重上（w ← w − ηλw），这才是「 decay 名不虚传」的版本。",
        "batch size、学习率与总步数三者互相咬合：一个 epoch 的步数 = 样本数 ÷ batch size，改 batch 就改了总步数；大 batch 的梯度噪声小、能支撑更大的 lr（近似线性缩放），但绝对步数变少。所以比较两次实验时必须按「优化步数」而不是「epoch 数」对齐——只改 batch 不改 lr 是「训练突然不动」最常见的答案。",
        "梯度消失/爆炸有三种成因：饱和激活（sigmoid 的 0.25 连乘）、深度本身（连乘次数）、权重偏大（每层乘上 ‖W‖ > 1）。判别动作只有一个——逐层打印梯度范数：深层显著小于浅层就是消失，越靠浅层越指数增长就是爆炸。这一步做完才谈得上选药方。",
        "残差为什么能救：y = x + F(x) 使 ∂y/∂x = I + ∂F/∂x，链式法则里多出一条恒等捷径。展开 20 层后，梯度里至少保留一条「不被任何 W 缩放」的通路，于是深度不再等于连乘次数。这就是 dl3-3 的 ResNet 和 dl5-3 的 Transformer 都把残差当骨架的根本原因。",
        "初始化尺度是「方差不爆炸也不塌缩」的约束：Xavier 用 1/fan_in（配 tanh），Kaiming 用 2/fan_in（配 ReLU，那个 2 补回被负半轴砍掉的方差）。太小的初始化不会让训练「慢一点」，而是让信号逐层衰减到 0，等价于网络不存在；太大则第一步就飞出可信区间。归一化层（BatchNorm/LayerNorm）解决的是同一件事的另一半：把每层输入拉回均值 0 方差 1 再用学出来的 γ/β 缩放，使损失面更平滑、可以开更大 lr、对初始化不再敏感；LayerNorm 在特征维上归一，与 batch 无关，因此适合变长序列与小 batch。注意它不解决饱和激活本身带来的梯度压扁。",
        "dropout 只在训练时生效：训练时随机丢掉比例 p、并把留下的除以 1−p（inverted dropout），推理时既不丢也不缩放，因为期望已经被那次除法校正过了。所以推理前必须切回 eval 模式——忘了切等于又乘了一次 1/(1−p)，输出概率系统性偏大；而反过来在训练时忘了开 dropout，等于把正则整项关掉。"
      ],
      summary_en: [
        "Plain SGD is only w -= eta*g; momentum adds a velocity v = mu*v + g and then w -= eta*v, which is an exponential moving average of gradients: components that oscillate across a narrow valley cancel while consistent components accumulate, so it both speeds up and damps ringing. mu near 0.9 means roughly the last ten steps are remembered.",
        "Adam is momentum plus a per-parameter step size (first moment over the square root of the second moment), so it is insensitive to parameter scale and runs off lr around 1e-3. The bill has two lines: two extra state tensors per parameter, doubling memory, and on vision it often generalises worse than a well-tuned SGD with momentum. 'Adam is more advanced' is a slogan, not a finding.",
        "Weight decay is not L2 regularisation: the two coincide only under vanilla SGD. Inside Adam an L2 term enters the gradient and is then rescaled again by the adaptive factor, coupling regularisation strength to gradient magnitude; AdamW pulls decay out of the gradient and applies it straight to the weights, which is the version whose name means what it says.",
        "Batch size, learning rate and total steps bite each other: steps per epoch are dataset size divided by batch size, so changing the batch silently changes the step count. Large batches have less gradient noise and tolerate a larger rate (rough linear scaling) while giving fewer absolute steps - so two runs must be compared by optimiser steps, not epochs. Changing batch size without touching lr is the single most common explanation for 'training just stopped moving'.",
        "Vanishing and exploding gradients have three causes: saturating activations (that 0.25 product), depth itself (how many factors), and too-large weights (each layer multiplies by a norm above 1). The one diagnostic is to print per-layer gradient norms: deep much smaller than shallow means vanishing, growing exponentially towards the input means exploding. Do this before choosing a remedy.",
        "Why residuals save you: y = x + F(x) gives dy/dx = I + dF/dx, which inserts an identity shortcut into the chain. Expanded over twenty layers the gradient retains at least one path that no W rescales, so depth stops being equal to a product count - the reason both ResNet (dl3-3) and the Transformer (dl5-3) are built on residuals.",
        "Initialisation scale is the constraint that variance neither explodes nor collapses: Xavier uses 1/fan_in (for tanh), Kaiming 2/fan_in (for ReLU, that factor 2 restoring the variance thrown away by the negative half). Too small does not merely train slower - it decays the signal to nothing, which is as if the network were absent; too large flies out of the plausible range on step one. Normalisation layers handle the other half of the same problem: BatchNorm returns each layer's input to zero mean and unit variance and then rescales with learned gamma/beta, flattening the loss surface so larger rates work and initialisation stops mattering; LayerNorm does it over the feature axis, independent of batch, which is what variable-length sequences and tiny batches need. It does not undo the squashing caused by a saturating activation itself.",
        "Dropout is active only during training: with probability p a unit is dropped and survivors are divided by 1-p (inverted dropout), so at inference you neither drop nor rescale - the expectation was already fixed by that division. Which is why inference must switch to eval mode: forgetting doubles the 1/(1-p) factor and every probability comes out systematically large, while forgetting to turn dropout on during training deletes the regulariser outright."
      ],
      code: `import numpy as np

rng = np.random.default_rng(0)

def probe(depth, std, act, residual):
    Ws = [rng.normal(scale=std, size=(32, 32)) for _ in range(depth)]
    a = rng.normal(size=(32,))
    cache = []
    for W in Ws:
        z = a @ W
        h = np.maximum(z, 0.0) if act == "relu" else np.tanh(z)
        cache.append((z, h))
        # 残差那条加法路径就是 "I +" 的来源
        a = h + a if residual else h
    g = np.ones(32)
    norms = []
    for i in range(depth - 1, -1, -1):
        z, h = cache[i]
        dact = (z > 0).astype(float) if act == "relu" else (1 - h * h)
        step = (g * dact) @ Ws[i].T
        g = g + step if residual else step
        norms.append(float(np.linalg.norm(g)))
    # 只看两端：最浅层与最深层的梯度范数差多少个数量级
    return f"{norms[0]:.2e} -> {norms[-1]:.2e}"

# 同一副 20 层网络只改初始化尺度：偏小梯度掉到 1e-7，偏大则冲到上千
for std in (0.1, 0.25, 0.35):
    print("relu std", std, "plain   ", probe(20, std, "relu", False))
# 加上残差后，连 std=0.1 这种「偏小」配置都不再消失（1e-7 变成 1e2）
# 但残差救不了偏大：std=0.35 时前向本身就逐层放大，恒等路帮不上忙
for std in (0.1, 0.35):
    print("relu std", std, "residual", probe(20, std, "relu", True))`,
      pit: "把 dropout 和 batch size 一起改：p 从 0.2 提到 0.5、batch 从 64 降到 8，然后发现「分数掉了，说明 dropout 太重」。实际上小 batch 本身就让 BN 统计变噪、等效学习率变化，两个变量同时动，你永远无法归因。同理，把 weight_decay 加在朴素 SGD 上却抱怨「Adam 里正则不生效」，那是把它当同一个东西用了。",
      pit_en: "Changing dropout and batch size together - p from 0.2 to 0.5 while batch drops 64 to 8 - and concluding 'the score fell, so dropout was too strong'. The smaller batch alone already makes BN statistics noisy and shifts the effective learning rate; with two variables moving, attribution is impossible. Same category of error: adding weight_decay under plain SGD and then complaining it 'does not work in Adam', as if the two were the same knob.",
      ex: {
        q: "为什么残差网络里即使把每层权重初始化得很小，训练仍然能推进，而普通深网不行？",
        a: "因为恒等捷径让梯度至少有一条不做乘法的通路，信号与误差都能直达任意深度；普通深网的梯度必须穿过全部 W 的乘积，权重偏小就等价于把这条乘积压成 0，越深越没有更新信号。",
        q_en: "Why can a residual net still train with very small weights when a plain deep net cannot?",
        a_en: "Because the identity shortcut guarantees one path that involves no multiplication, so both signal and error reach any depth directly. In a plain deep net every gradient must pass through the product of all W's, so small weights shrink that product to nothing and the early layers receive no update."
      }
    },

    "dl1-6": {
      title: "综合重构：训练不动、会崩、分数是假的，三张排查表",
      title_en: "Synthesis: Three Checklists - Stalled, Exploding, and Fake Scores",
      min: 15,
      target: "面对一个不收敛或「好得可疑」的网络，能按固定顺序在 10 分钟内定位到原因属于「不动 / 崩 / 假分数」三类中的哪一类，并说清依据是哪条机制。",
      target_en: "Given a network that will not converge, or one that looks too good, triage it within ten minutes into stalled / exploding / fake-score using a fixed order, and name the mechanism each verdict rests on.",
      summary: [
        "先分类再动手：「不动」是梯度太小或被抵消（症状：loss 几乎水平、参数几乎不变）；「崩」是梯度太大或数值溢出（症状：loss 剧烈锯齿或直接 NaN）；「假分数」是评估流程的问题，模型和训练可能都完全正常。三类的第一嫌疑完全不同，混在一起查就是无头苍蝇。",
        "「不动」排查表（按成本从低到高）：学习率是不是差了一个数量级；特征与标签尺度是否统一（呼应 ml1-3）；loss.backward() 与 optimizer.step() 是否都写了；参数是不是真的 requires_grad（自定义 Module 忘了 super().__init__、用普通 list 存子层）；激活是否饱和；最后才是容量不够。逐层打印梯度范数是这张表的通用钥匙。",
        "「崩」排查表：loss=NaN 的三种来源是 log(0)、exp 溢出、梯度爆炸，先打印梯度范数就能分开；是不是做了双重 softmax；类别标签是否越界（交叉熵要求标签从 0 开始且小于 num_classes，把「第 1 类」编号成 1..C 会让最后一类永远学不到甚至直接报错）；混合精度下 fp16 溢出必须配 GradScaler，否则梯度被 inf 污染。",
        "「分数是假的」排查表：数据泄漏（同一实体同时出现在训练与验证；标准化参数在全量上 fit）；验证集被用来挑超参因而已被消耗；推理时忘了切 eval 模式（dropout/BN 行为不对）；只报训练分数；类别不平衡时只看准确率；随机种子没固定，于是「提升了 0.3%」完全在噪声范围内。这张表在 ml3 已经出现过一次，神经网络只是让它更贵。",
        "损失与指标是两件事：loss 是可微的过程量（交叉熵惩罚的是概率分配本身），指标是人真正关心的结果量（accuracy 只看 top-1 排序、且不可微）。所以会出现 loss 降而 acc 不动（概率还在变得更自信但排序没变），也会出现 acc 涨而 loss 变差（边界样本被押得更重）。两条曲线必须同时看，且都在验证集上。",
        "把 dl1 五节拼成一条最小通路：用随机生成的可分数据，在 NumPy 里手写一个两层 MLP 训到收敛——神经元与激活（dl1-1/2）、前向（dl1-3）、反向与梯度检查（dl1-4）、优化器与初始化（dl1-5）。这条不依赖任何框架的通路，是你以后判断「框架有没有骗我」的唯一参照物。",
        "养成一次只改一件事的习惯，并留下「改动前分数」的日志。同时改 lr 和网络宽度，结果变好了你不知道该保留哪一半，变坏了更不知道是哪一半的错；可复现性从这一条开始，而不是从 dl2-6 的 seed 才开始。",
        "衔接下一章：dl1 的机制在 dl2 会变成四行代码——但机制不清时，那四行坏掉你完全看不出来。dl2 的重点是分清「框架替我做了什么」与「哪一步必须由我负责」：计算图、梯度累加、train/eval、显存与保存。"
      ],
      summary_en: [
        "Classify before touching anything. Stalled means the gradient is too small or cancelled (loss nearly flat, weights barely move); exploding means the gradient is too large or numerically out of range (jagged loss, then NaN); a fake score is a problem in the evaluation pipeline while model and training may both be fine. The prime suspects differ completely, so investigating all three at once is how you wander.",
        "Stalled checklist, cheapest first: is the learning rate off by an order of magnitude; are features and labels on a comparable scale (ml1-3 again); are both loss.backward() and optimizer.step() actually present; do the parameters really have requires_grad (a custom Module that skipped super().__init__, or layers kept in a plain list); is the activation saturated; and only then capacity. Per-layer gradient norms unlock every row of that table.",
        "Exploding checklist: loss = NaN has three sources - log(0), exp overflow, exploding gradient - and printing the gradient norm separates them immediately; is softmax applied twice; are class labels in range (cross-entropy wants 0-based and strictly below num_classes, so numbering classes 1..C silently or loudly kills the last one); and under mixed precision, fp16 overflow needs a GradScaler or inf pollutes every gradient.",
        "Fake-score checklist: leakage (the same entity on both sides of the split, scaler fitted on all the data); a validation set already consumed by hyper-parameter picking; forgetting eval mode at inference so dropout and BN behave wrongly; quoting training scores; reporting accuracy under class imbalance; and no fixed seed, which makes 'plus 0.3 percent' entirely inside the noise band. ml3 already handed you this table; neural networks only make it more expensive.",
        "Loss and metric are different objects: loss is a differentiable process quantity (cross-entropy punishes the probability assignment itself), the metric is the outcome people care about (accuracy reads only top-1 order and is not differentiable). Hence loss can fall while accuracy sits still - probabilities keep sharpening without re-ordering - and accuracy can rise while loss worsens because hard boundary cases got punished more. Plot both, always on validation data.",
        "Assemble dl1's five sections into one minimal working path: a hand-written two-layer MLP in NumPy, trained to convergence on synthetic separable data - neuron and activation (dl1-1/2), forward (dl1-3), backward plus gradient check (dl1-4), optimiser and initialisation (dl1-5). That framework-free path is the only reference you will have for 'is the library lying to me'.",
        "Change exactly one thing per run and log the score before the change. Tune the learning rate and the width together and a better result tells you nothing about which half to keep, while a worse one tells you nothing about which half to blame. Reproducibility starts here, not at dl2-6's seeding.",
        "Bridge to dl2: everything in dl1 becomes four lines of code there - and when the mechanisms are unclear, four broken lines are precisely what you cannot see. dl2's real subject is the boundary between 'what the framework does for me' and 'what is my job': the graph, gradient accumulation, train/eval, memory and checkpoints."
      ],
      code: `import numpy as np

rng = np.random.default_rng(0)
N = 400
# 完全离线：圆内/圆外两类，一条直线必然学不动，只能靠隐层折弯
X = rng.uniform(-2, 2, size=(N, 2))
y = ((X ** 2).sum(1) > 2.0).astype(np.int64)
idx = rng.permutation(N)
tr, va = idx[:300], idx[300:]

# Kaiming 尺度 sqrt(2/fan_in)：那个 2 补回被 ReLU 负半轴砍掉的方差
W1 = rng.normal(scale=(2 / 2) ** 0.5, size=(2, 16))
b1 = np.zeros(16)
W2 = rng.normal(scale=(2 / 16) ** 0.5, size=(16, 2))
b2 = np.zeros(2)

def logits(Xb):
    return np.maximum(0, Xb @ W1 + b1) @ W2 + b2

def score(Xb, yb):
    lg = logits(Xb) - logits(Xb).max(1, keepdims=True)
    p = np.exp(lg) / np.exp(lg).sum(1, keepdims=True)
    ce = float(-np.log(p[np.arange(len(yb)), yb] + 1e-12).mean())
    return ce, float((p.argmax(1) == yb).mean())

lr = 0.2
for step in range(400):
    h = np.maximum(0, X[tr] @ W1 + b1)
    lg = logits(X[tr])
    lg = lg - lg.max(1, keepdims=True)
    p = np.exp(lg) / np.exp(lg).sum(1, keepdims=True)
    dz2 = (p - np.eye(2)[y[tr]]) / len(tr)
    dW2, db2 = h.T @ dz2, dz2.sum(0)
    # 误差送回隐层时要乘 ReLU 的导数，这一步漏了就没有「反向」可言
    dz1 = (dz2 @ W2.T) * (h > 0)
    dW1, db1 = X[tr].T @ dz1, dz1.sum(0)
    # 四处一起更新，别顺手改其中某一处的步长，否则归因就没了
    for P, G in ((W1, dW1), (b1, db1), (W2, dW2), (b2, db2)):
        P -= lr * G
    if step % 100 == 0:
        tl, ta = score(X[tr], y[tr])
        vl, vac = score(X[va], y[va])
        print("step", step, "train", round(tl, 3), round(ta, 3), "| val", round(vl, 3), round(vac, 3))`,
      pit: "看到「验证 loss 已经不再下降、还在小幅上翘」就直接在最好的那个 epoch 收工并汇报那个数字：这一步等价于用验证集做了模型选择，于是这个数字不再是泛化误差的无偏估计。要么预留一份从未参与任何决策的测试集，要么用交叉验证；否则上线时你一定会看到分数掉回来。",
      pit_en: "Quitting the moment validation loss stops falling and quoting that best epoch as the result: that already uses validation for model selection, so the number is no longer an unbiased estimate of generalisation. Reserve a test set that took part in no decision, or use cross-validation - otherwise production will show the drop you did not measure.",
      ex: {
        q: "为什么「loss 明显在降但 accuracy 一直不动」不一定是 bug？",
        a: "因为两者衡量的东西不同：交叉熵惩罚整个概率分布，而 accuracy 只看 argmax 对不对。模型可以在不改变任何一次排序的前提下持续变得更自信（loss 下降），也可以在少数边界样本上改变排序而让 accuracy 跳一格；要判断是否真的在学，应该看校准或 AUC 这类中间指标。",
        q_en: "Why is 'loss clearly falling while accuracy never moves' not necessarily a bug?",
        a_en: "Because they measure different things: cross-entropy scores the whole distribution while accuracy only reads argmax. A model can grow arbitrarily confident without re-ordering a single prediction, dropping loss with accuracy frozen, and it can also flip one borderline case to move accuracy by one notch. Look at calibration or AUC to tell learning from re-arranging."
      }
    },

    /* ===================== dl2 PyTorch 实战训练 ===================== */
    "dl2-1": {
      min: 12,
      summary: [
        "tensor 与 ndarray 的差别不是「能不能上 GPU」这么笼统，而是三条独立属性：device（在哪算）、dtype（几位什么类型）、grad_fn（是否挂在计算图上）。三者各自会独立出错，所以各自要独立检查。",
        "「CPU 上训练、GPU 上推理」这类错误的真身是设备不一致：模型在 cuda 而数据在 cpu 会立刻报错，这是好事；难的是相反方向——推理脚本里忘了 .to(device)，程序在 CPU 上跑得又慢又对，跑一小时你还以为卡在死循环。带梯度的张量跨设备赋值则会被 PyTorch 拦住，不会静默。",
        "dtype 的第一课是「造张量时类型会被猜错」：torch.tensor([1, 2]) 是 int64，torch.rand(3) 才是 float32。把整数列表当成特征喂进 nn.Linear，报的是「mat1 and mat2 must have the same dtype, but got Long and Float」（旧版本写作 expected scalar type Float），而它真正在说的是「你建张量那行写错了」。",
        "PyTorch 不会自动混精度：参数是 float64 而输入是 float32 时直接报错而不是悄悄转换（这一点与 NumPy 的隐式提升不同）。这个「不迁就」是好事——它把数值精度的决定权交回给你，因为一次隐式提升可能让显存与延迟同时翻倍。",
        "`.to()` 的语义要记牢：对张量它返回新张量（同设备时可能返回自身），不写回变量等于什么都没做；对模块它原地修改并返回 self。这两种不一样，所以 `x.to(device)` 是无效代码、`model.to(device)` 是有效代码——这是最典型的「看起来执行了其实没有」。",
        "view 与 reshape 的区别是连续性：view 只是换一种解释方式、要求内存连续；transpose/permute/切片之后张量常常不连续，view 就会抛错。reshape 会在需要时自动拷贝，所以更宽容——但也正因为它悄悄拷贝，热循环里用 reshape 可能带来可测量的开销，先 .contiguous() 再 view 才让成本显式。",
        "与 NumPy 互转的三件套 `.detach().cpu().numpy()` 缺一不可：带梯度的张量不能转 numpy（要 detach），GPU 上的张量不能转 numpy（要 cpu），转完还要 .numpy()。这三步各自挡住一个报错，也各自说明一件事——张量身上背着图和设备的包袱。",
        "衔接：形状与设备只是「能不能跑」，下一节 dl2-2 讲「为什么会自动有梯度」——计算图与 requires_grad，以及 zero_grad 为什么会毁掉你的训练。"
      ],
      summary_en: [
        "The gap between tensor and ndarray is not a vague 'can it use a GPU' but three independent attributes: device (where it computes), dtype (how many bytes of what kind) and grad_fn (whether it hangs off a computation graph). Each fails on its own, so each gets checked on its own.",
        "'Train on CPU, infer on GPU' is really device mismatch, and the loud version - model on cuda, data on cpu - is the cheap one. The quiet version is a missing .to(device) in the inference script, which runs perfectly on the CPU at a tenth the speed and looks like a hang. Cross-device assignment into a tensor that tracks gradients is caught by PyTorch, so it is not the silent case.",
        "The dtype lesson starts where tensors are made: torch.tensor([1, 2]) is int64 while torch.rand(3) is float32. Feed those integer features into nn.Linear and the complaint 'mat1 and mat2 must have the same dtype, but got Long and Float' is really pointing at the line where you built the tensor.",
        "PyTorch refuses silent mixed precision: float64 parameters with float32 input raise an error instead of promoting, unlike NumPy's implicit upcasting. That unhelpful-looking strictness is a favour, because one hidden promotion can double both memory and latency.",
        "Remember what .to() returns: on a tensor it yields a tensor (itself when already on the target device), so writing x.to(device) without assignment does literally nothing; on a module it mutates in place and returns self. Hence 'x.to(device)' is dead code while 'model.to(device)' works - the classic statement that ran but changed nothing.",
        "view versus reshape is a question of contiguity: view only reinterprets the same buffer and needs it contiguous, so after transpose, permute or slicing it often throws. reshape copies when it must, which is more forgiving but also silently expensive in a hot loop; calling .contiguous() before view keeps that cost visible.",
        "The three-step dance .detach().cpu().numpy() has no optional part: a tensor tracking gradients cannot become a numpy array (detach), a GPU tensor cannot either (cpu), and the last call is what actually produces the ndarray. Each step guards a different error, and together they say a tensor carries a graph and a device around with it.",
        "Bridge: shapes and devices only decide whether the code runs. dl2-2 is about why gradients appear by themselves - the graph and requires_grad, and how forgetting zero_grad quietly wrecks training."
      ],
      code: `import torch

x = torch.tensor([1, 2, 3])
# 整数列表会被猜成 int64，而网络参数默认是 float32
print("dtype", x.dtype, "device", x.device)
w = torch.randn(4, 3)
try:
    w @ x
except RuntimeError as err:
    # 报错只说类型，不会告诉你是哪一行造的张量
    print("failed:", str(err).split(".")[0][:58])
print("fixed", tuple((w @ x.float()).shape))

# view 只换解释方式，要求内存连续；transpose 之后不再连续
img = torch.randn(2, 3, 4, 5).transpose(1, 3)
print("contiguous?", img.is_contiguous())
try:
    img.view(2, -1)
except RuntimeError:
    print("view refused, reshape would copy instead")
print("reshape", tuple(img.reshape(2, -1).shape))

# 与 numpy 互转：detach 与 cpu 两步都不能省
t = torch.randn(3, requires_grad=True) * 2
try:
    t.numpy()
except RuntimeError as err:
    print("needs detach first:", str(err).split(":")[0][:48])
print("ok", t.detach().numpy().shape)`,
      pit: "写了 `x = x.to(device)` 却把 device 定义成 `torch.device(\"cuda\")` 而机器上其实没有 GPU：报错是一长串 Torch not compiled with CUDA enabled 或者 Found no NVIDIA driver，看起来像「代码坏了」，实际是环境不匹配。正确写法是先探测 `torch.cuda.is_available()` 再决定，或者干脆用 \"cpu\"，把环境判断写成一行而不是靠猜。",
      pit_en: "Writing x = x.to(device) with device = torch.device('cuda') on a machine with no GPU: you get a wall of 'Torch not compiled with CUDA enabled' or 'Found no NVIDIA driver' that reads like broken code but is an environment mismatch. Probe torch.cuda.is_available() first, or just say cpu - make the check one line instead of an assumption.",
      ex: {
        q: "为什么 `model.to(device)` 可以不写回变量，而 `x.to(device)` 必须写回？",
        a: "因为 nn.Module.to 会原地替换每个参数的数据（内部逐参数做迁移并返回 self），改的是对象本身；而张量的 to 是纯函数式的，返回一个新的存储，不写回就等于丢弃了结果，原张量仍在旧设备上。",
        q_en: "Why may model.to(device) ignore the return value while x.to(device) must not?",
        a_en: "Because Module.to migrates each parameter's storage in place (it returns self as a convenience), so the object itself changes; a tensor's to is functional - it returns a different storage, and dropping the result leaves the original tensor where it was."
      }
    },

    "dl2-2": {
      min: 14,
      summary: [
        "计算图是从叶子（requires_grad=True 的张量）出发逐步构建的：每个算子记下自己是谁的子节点。这意味着「有没有梯度」取决于两件事——源头是否 requires_grad，以及这条路径在当前模式下是否被记录，两个条件缺一个就拿不到 .grad。",
        "只有叶子的 .grad 会被保留并累加；中间张量的 .grad 默认是 None。所以「我 print 中间激活的梯度为什么是 None」不是 bug——要看中间量得用 register_hook，或者直接 torch.autograd.grad(loss, 中间张量)。",
        "图是一次性的：反向之后非叶子的中间结果立即释放（省显存），第二次 backward 穿过同一张图就报 Trying to backward through the graph a second time。能填 retain_graph=True 但通常说明你的循环结构写错了——比如把多个 batch 的 loss 攒起来一起反传。",
        "`.grad` 是累加语义，这是设计而不是遗漏：PyTorch 让梯度自动相加，才使得「梯度累积模拟大 batch」这类技巧只需删掉一行代码。代价就是每个 step 必须显式 zero_grad()；忘记的症状是梯度越叠越大、更新方向被历史 batch 污染，前期看起来正常、中后期开始发散。新版默认 set_to_none=True，是把梯度张量释放而不是填 0，更省显存也更快。",
        "no_grad 与 inference_mode 都要用，但语义不同：no_grad 只关掉图记录，张量仍然带着版本计数；inference_mode 更彻底（连版本追踪都省掉），推理更快更省，但产出的张量是「推理张量」，之后不能参与训练或被塞进缓存/buffer，否则报 Inference tensors cannot be saved for backward。把它存下来做特征复用是最典型的踩法。",
        "反向要标量：backward() 不接受非标量张量（除非显式传 gradient=）。最常见的犯法是「对每个样本分别 backward」——正确做法是先 mean/sum 再反传。注意 mean 与 sum 会让等效学习率相差 batch_size 倍，这也是换 batch size 时最容易漏改的一处。",
        "断链的清单要背下来：.detach()、.data、.numpy()、int(x)/float(x)、在 no_grad 里做的赋值、以及把参数用普通 python 容器存起来。症状统一是 loss 完全不动或参数一直是初始值；验证方法只有一句——打印 optimizer 里参数的 .grad 是不是 None。",
        "衔接：把 dl1-4 手推的那个两层网络的梯度，用 torch.autograd.grad(loss, W1) 打出来对比——两者一致之后，你才敢把整条反向交给框架；这也是接下来 nn.Module 与训练循环的前提。"
      ],
      summary_en: [
        "The graph is built outward from leaves that carry requires_grad=True, each operator recording its children, so 'will there be a gradient' has two independent conditions: does the source need gradients, and is this path being recorded right now. Fail either and .grad never arrives.",
        "Only leaves accumulate .grad; an intermediate tensor's .grad stays None. So printing the gradient of a mid-layer activation and getting None is not a bug - inspect intermediates with register_hook or with torch.autograd.grad(loss, that_tensor).",
        "The graph is single-use: buffers of non-leaf nodes are freed as soon as backward passes them, so a second backward through the same graph raises 'Trying to backward through the graph a second time'. retain_graph=True exists, but wanting it usually means the loop is wrong - e.g. accumulating several batches' losses before one backward.",
        "Gradients accumulate by design, not by omission: PyTorch adds them so that tricks like gradient accumulation for a pseudo-large batch cost nothing to write. The price is a mandatory zero_grad each step; forget it and stale gradients pile up, the update direction gets contaminated by earlier batches, and the run looks fine for a while before diverging. Modern defaults pass set_to_none=True, freeing the gradient tensors instead of filling them with zero - cheaper in memory and faster.",
        "no_grad and inference_mode both suppress the graph but not identically: no_grad only stops recording while version counters remain, inference_mode additionally drops version tracking for speed and memory, and its outputs are inference tensors that may not later be saved for backward or fed into training. Caching them as reusable features is the classic way to trip it.",
        "backward needs a scalar unless you hand it an explicit gradient. The usual slip is calling backward separately per sample - aggregate with mean or sum first. And note mean versus sum changes the effective learning rate by a factor of batch size, the easiest thing to miss when you change batch size.",
        "Memorise the list of chain-cuts: .detach(), .data, .numpy(), int(x)/float(x), assignments made inside no_grad, and parameters parked in a plain python container. The symptom is always the same - loss frozen, weights still at their initial values - and the one check that finds it is printing whether each parameter's .grad is None.",
        "Bridge: print torch.autograd.grad(loss, W1) for the two-layer net you derived by hand in dl1-4 and compare. Once they agree you can hand the whole backward pass to the framework - that is the trust dl2-3 and dl2-4 are built on."
      ],
      code: `import torch

w = torch.randn(3, 1, requires_grad=True)
x = torch.ones(2, 3)
h = x @ w

# 中间张量不是叶子：它的 .grad 不会被填，要看得用 retain_grad 或 autograd.grad
print("h is leaf?", h.is_leaf)
h.sum().backward()
print("grad after step 1", w.grad.flatten().tolist())

# 忘记 zero_grad：第二个 batch 的梯度直接叠在旧的上面
(x @ w).sum().backward()
print("grad accumulated", w.grad.flatten().tolist())
w.grad = None
(x @ w).sum().backward()
print("grad after clearing", w.grad.flatten().tolist())

# 图是一次性的，第二次穿过同一张图就被拒绝
try:
    y1 = (x @ w).sum()
    y1.backward()
    y1.backward()
except RuntimeError as err:
    print("second backward:", str(err).split(".")[0][:52])

# detach 把这一段剪断：下游照常反传，但梯度走到这里就停了，回不到 v
v = torch.ones(2, requires_grad=True)
bias = torch.zeros(2, requires_grad=True)
((v * 2).detach() + bias).sum().backward()
print("bias got", bias.grad.flatten().tolist(), "but v.grad is", v.grad)`,
      pit: "自己手写 `for p in model.parameters(): p.grad = torch.zeros_like(p)` 来清零：它给每个参数凭空分配一个全零梯度张量，比 `zero_grad(set_to_none=True)` 多占一份显存、还打乱缓存复用；更糟的是那些本该被跳过的冻结参数从此「有梯度了」，于是 weight decay 每步都作用在它们身上（dl2-3 会正面演示这条）。另一类同样致命的写法是把 `zero_grad()` 放在 backward 之后、step 之前——不报错，只是把刚算出来的梯度原地扔掉。",
      pit_en: "Hand-writing 'for p in model.parameters(): p.grad = torch.zeros_like(p)' to clear gradients: it conjures an all-zero gradient buffer for every parameter, costing an extra full copy versus zero_grad(set_to_none=True) and defeating cache reuse. Worse, parameters that should have been skipped now 'have a gradient', so weight decay acts on your frozen weights every step (dl2-3 demonstrates exactly that). The equally fatal variant is calling zero_grad() after backward but before step - no error at all, the fresh gradient is simply discarded.",
      ex: {
        q: "为什么 PyTorch 选择「梯度累加」而不是「每次 backward 自动覆盖」？",
        a: "因为累加让一批实用技巧几乎零成本：梯度累积模拟大 batch、多个 loss 分支共用一次反传、以及把反传拆到 minibatch 的多个片段上，全都依赖「backward 只做加法」这一条语义；代价是把清零责任交给使用者。",
        q_en: "Why did PyTorch choose gradient accumulation over overwriting .grad on every backward?",
        a_en: "Because addition makes several practical tricks free: simulating a large batch by accumulating, sharing one backward across multiple loss terms, splitting a step across sub-batches - all rest on 'backward only adds'. The cost is that clearing becomes the user's job."
      }
    },

    "dl2-3": {
      min: 13,
      summary: [
        "继承 nn.Module 的真正目的不是「有个 forward 可调」，而是注册：子模块进 _modules、nn.Parameter 进 _parameters。没有登记，.to(device) 搬不动、parameters() 是空的、state_dict() 存不下——而模型「照样能跑」，这是它最危险的地方。",
        "用普通 python list 存层是本章最阴的 bug：`self.layers = [nn.Linear(...), ...]` 前向完全正确，但 model.parameters() 返回空，于是优化器拿到一个空列表、loss.backward() 无处可写、参数一动不动，而没有任何一行代码报错。nn.ModuleList / nn.Sequential 才是替代品。",
        "__init__ 里必须先 super().__init__()：否则注册机制尚不存在，给 self.fc 赋值 nn.Linear 时会抛 cannot assign 类错误（或更早在属性 setter 上炸）。这条与上一条是同一枚硬币的两面——都源于 nn.Module 重写了 __setattr__。",
        "forward 里不要写死 batch：用 -1 或 x.size(0) 推导。`x.view(B, -1)` 在 B 也被写死时，验证 batch 与训练 batch 不同就会报错；`flatten(1)` 通常比 `view(x.shape[0], -1)` 更安全，因为它不要求内存连续。",
        "参数量要在建完模型后立刻口算并核对：nn.Linear 是 in×out + out，nn.Conv2d 是 k·k·Cin·Cout + Cout。sum(p.numel() for p in model.parameters()) 这一行应该成为每个训练脚本的第一行输出——显存预算、过拟合风险、能不能塞进你的卡，全从这里开始。",
        "各层的默认初始化不一样，而且未必合你意：nn.Linear 用 a=√5 的 kaiming_uniform，等效方差偏小，深层堆叠或 Transformer 里通常会明显拖慢收敛，所以大模型都自己写一遍初始化。别默认「框架已经帮你选好了」。",
        "冻结主干的正确写法有两半：`for p in backbone.parameters(): p.requires_grad_(False)` 关掉梯度，同时优化器只收 `if p.requires_grad` 的参数。别以为关了就万事大吉——清零只处理「已经有 .grad」的参数，所以如果冻结发生在第一次 backward 之后（.grad 已经分配好），或者用了 set_to_none=False 把旧梯度填成零，weight decay 会照样作用在这些「冻结」参数上：AdamW 的衰减直接写在权重上、与梯度无关，几十步就能把预训练权重拉走两成。",
        "衔接：模块会建、参数会算之后，下一节 dl2-4 把 zero_grad / backward / step 与 train/eval 组装成那个必须写对顺序的训练循环。"
      ],
      summary_en: [
        "Subclassing nn.Module is really about registration, not about having a callable forward: submodules land in _modules and nn.Parameter values in _parameters. Unregistered parts are skipped by .to(device), invisible to parameters(), missing from state_dict() - and yet the model still runs, which is exactly what makes this dangerous.",
        "Keeping layers in a plain python list is the sneakiest bug of this chapter: self.layers = [nn.Linear(...), ...] forwards perfectly, but model.parameters() comes back empty, so the optimiser is handed nothing, loss.backward() has nowhere to write, and no line of your code complains. nn.ModuleList or nn.Sequential are the replacements.",
        "super().__init__() must come first: before it exists, the registration machinery does not, and assigning an nn.Linear to self.fc raises a cannot-assign error - or dies earlier in the property setter. Both that and the previous point are two faces of one fact: nn.Module overrides __setattr__.",
        "Do not hard-code the batch in forward; derive it with -1 or x.size(0). A hard-coded B in x.view(B, -1) breaks the moment validation uses a different batch size, and flatten(1) is usually safer than view(x.shape[0], -1) because it does not demand contiguity.",
        "Recount parameters the moment the model exists: nn.Linear is in*out + out, nn.Conv2d is k*k*Cin*Cout + Cout. That one line, sum(p.numel() for p in model.parameters()), should be the first thing every training script prints - memory budget, overfitting risk and 'will it fit my card' all start there.",
        "Default initialisation differs per layer and is not always what you want: nn.Linear uses kaiming_uniform with a = sqrt(5), whose effective variance is small enough to slow convergence in deep stacks and Transformers, which is why large models write their own init. Never assume the framework already chose well.",
        "Freezing a backbone has two halves: requires_grad_(False) on its parameters, and an optimiser built only from parameters where requires_grad is true. Do not stop at the first half - zeroing only touches parameters that already own a .grad, so if you freeze after the first backward (the buffers exist), or clear with set_to_none=False (they become zeros), weight decay keeps acting on your 'frozen' weights. AdamW's decay is written straight onto the weights, independent of any gradient, and a few dozen steps can move pretrained weights by twenty percent.",
        "Bridge: with modules registered and parameters counted, dl2-4 assembles zero_grad, backward, step and train/eval into the training loop whose order you must get right."
      ],
      code: `import torch
import torch.nn as nn

# 错：普通 list 存子层，nn.Module 完全不知道它们存在
class Broken(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = [nn.Linear(4, 8), nn.Linear(8, 2)]

    def forward(self, x):
        for m in self.layers:
            x = m(x)
        return x

# 对：ModuleList 会登记进 _modules，to/parameters/state_dict 才有效
class Fixed(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.ModuleList([nn.Linear(4, 8), nn.Linear(8, 2)])

    def forward(self, x):
        for m in self.layers:
            x = m(x)
        return x

b, f = Broken(), Fixed()
print("broken params", sum(p.numel() for p in b.parameters()))
print("fixed params", sum(p.numel() for p in f.parameters()))
print("broken state_dict keys", list(b.state_dict()), "fixed", len(f.state_dict()))

# 冻结主干：先反传一次让 .grad 被分配，再冻结，之后每步仍在被 weight decay 拉走
backbone = nn.Linear(4, 4)
head = nn.Linear(4, 2)
opt = torch.optim.AdamW(list(backbone.parameters()) + list(head.parameters()), lr=0.1, weight_decay=0.1)
head(backbone(torch.randn(8, 4))).pow(2).mean().backward()
opt.step()
for p in backbone.parameters():
    p.requires_grad_(False)
before = backbone.weight.detach().clone()
for _ in range(20):
    # 清零只碰「已经有 .grad」的参数，这里那份全零张量还在，于是衰减照旧执行
    opt.zero_grad(set_to_none=False)
    head(backbone(torch.randn(8, 4))).pow(2).mean().backward()
    opt.step()
print("frozen backbone drifted by", round(float((backbone.weight - before).abs().max()), 4))`,
      pit: "忘了 `super().__init__()`，或者反过来把子模块赋给了 `self.__dict__`／类属性而不是实例属性：前者报错还算响亮，后者会静默地不进 _modules，于是 `model.to(\"cuda\")` 之后那层的权重仍在 CPU 上，第一次前向就报 devices not same。检查办法很确定：`print(list(dict(model.named_children())))` 与 `len(model.state_dict())`，两者少了一项就是注册漏了。",
      pit_en: "Skipping super().__init__(), or assigning submodules somewhere they never reach _modules (class attribute, __dict__ hack). The first fails loudly; the second fails quietly, so after model.to('cuda') that layer's weights are still on the CPU and the first forward raises 'Expected all tensors to be on the same device'. The check is deterministic: print dict(model.named_children()) and len(model.state_dict()) - anything missing there was never registered.",
      ex: {
        q: "为什么 `model.eval()` 不会改变 `requires_grad`，而 `requires_grad_(False)` 也不会改变 dropout 行为？",
        a: "因为它们控制的是两件正交的事：eval/train 只切换 dropout 与 batchnorm 这类「行为依赖阶段」的层的运行方式，requires_grad 控制的是「这个张量要不要参与求导、要不要被建图」。所以冻结主干时两件事都得做，验证时也得两件事分别确认。",
        q_en: "Why does model.eval() leave requires_grad alone, and why does requires_grad_(False) leave dropout behaviour alone?",
        a_en: "Because they are orthogonal switches: train/eval only changes how layers whose behaviour depends on the phase - dropout, batchnorm - run, while requires_grad decides whether a tensor participates in autograd at all. Freezing a backbone needs both actions, and validation needs both checked separately."
      }
    },

    "dl2-4": {
      min: 14,
      summary: [
        "标准循环的骨架是六步：model.train(train) → 取 batch → zero_grad → 前向 → 算 loss → backward → step。每一步都能对应回 dl1 的一个机制，而「少了哪一步会怎样」是要能背出来的：缺 zero_grad 就累加、缺 backward 参数不动、缺 step 只算不用、缺 train() 则 dropout/BN 用错模式。",
        "train()/eval() 只影响 dropout 与 batchnorm 两类层，**不影响梯度**。这是最多人误解的一条：`model.eval()` 之后依然可以 backward、依然会更新参数。所以「验证时不小心反传了」不会因为写了 eval() 而被救回来，必须另外关掉梯度。",
        "验证循环必须不反传：包在 `torch.no_grad()` 里，且一句 backward 都不写。两种症状分别是——验证第一个 batch 就把显存打满（验证图叠在训练图上），以及验证梯度污染 .grad 使下一个 step 被平均错。用 `torch.set_grad_enabled(train)` 一个开关管两阶段是更干净的写法。",
        "指标累计是显存泄漏的常见出口：把带梯度的 loss 张量塞进 list（`losses.append(loss)`）会让整张图一直被引用，显存每 step 只涨不落；正确写法是 `losses.append(loss.item())` 或 `loss.detach()`。这也是「第二个 epoch OOM」最典型的真身之一。",
        "zero_grad 与 step 的顺序有两种都对的写法：先 zero 再 backward 再 step，或 step 之后再 zero（PyTorch 官方新示例常用后者）。错的写法只有一种：backward 之后、step 之前 zero。顺序本身不重要，重要的是「清零必须发生在两次 backward 之间」。",
        "batch 大小的变化会从三处咬你：最后一批尺寸不足（drop_last=False 时可能只剩 1 条，BN 会抛 Expected more than 1 value per channel）；loss 用 sum 时等效学习率随 batch 线性变化；以及 lr 调度器是按 step 计数的，换 batch 就换了一个 epoch 的总步数。",
        "以验证指标挑选「最佳权重」是合理做法，但要如实记账：这个数字已经被验证集消耗过，不能再当作无偏的泛化估计（呼应 dl1-6 与 ml3 的泄漏）。要么另留测试集，要么交叉验证；同时把「最佳 epoch」「最终 epoch」两份权重都存下来。",
        "衔接：循环写对了只是「能训」，能不能训得快、训得下（batch、数据管道、显存）是 dl2-5 的主题。"
      ],
      summary_en: [
        "The loop skeleton is six moves: model.train(train), fetch a batch, zero_grad, forward, loss, backward, step. Each maps back to one mechanism from dl1, and you should be able to recite what each omission costs - no zero_grad means accumulation, no backward means frozen weights, no step means computing gradients you never use, no train() means dropout and BN run in the wrong mode.",
        "train()/eval() only affect dropout and batchnorm layers; they do not touch gradients. That is the most misunderstood line in the chapter: after model.eval() you can still call backward and still move parameters. So an accidental backward during validation is not prevented by eval().",
        "The validation pass must not backpropagate: wrap it in torch.no_grad() and write no backward at all. The two symptoms of getting this wrong are 'memory fills up on the very first validation batch' (a validation graph stacked on the training graph) and 'the next step's gradients are contaminated by the validation set'. torch.set_grad_enabled(train) drives both from a single switch.",
        "Metric accumulation is a standard memory leak: losses.append(loss) keeps the graph alive, so allocated memory climbs every step and never falls; append loss.item() or loss.detach() instead. That is one of the two usual culprits behind 'epoch two died with OOM'.",
        "There are two correct orderings around zero_grad: clear before backward then step, or clear after step (the style in newer official examples). Exactly one ordering is wrong - clearing after backward but before step. The order itself matters less than the invariant: clearing must happen between two backwards.",
        "Changing batch size bites from three places: the last ragged batch may hold one sample, and BatchNorm then raises 'Expected more than 1 value per channel'; a summed loss makes the effective learning rate proportional to batch size; and schedulers count steps, so a new batch size silently changes the number of steps per epoch.",
        "Selecting the 'best weights' by validation metric is legitimate but must be recorded honestly: that number has already been consumed by validation and is no longer an unbiased generalisation estimate (dl1-6 and ml3 again). Keep a real test set or cross-validate, and save both the best and the final checkpoints.",
        "Bridge: a correct loop only means you can train. Whether you can train fast and fit it at all - batching, the input pipeline, memory - is dl2-5."
      ],
      code: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(0)
# 完全离线：随机张量造一个可学的二分类，不碰任何下载
X = torch.randn(800, 8)
y = (X[:, 0] * 2.0 - X[:, 3] * 1.5 + torch.randn(800) * 0.3 > 0).long()
loader = DataLoader(TensorDataset(X, y), batch_size=64, shuffle=True)
model = nn.Sequential(nn.Linear(8, 32), nn.ReLU(), nn.Dropout(0.2), nn.Linear(32, 2))
opt = torch.optim.AdamW(model.parameters(), lr=1e-2)
loss_fn = nn.CrossEntropyLoss()

def run(train: bool):
    # train 只决定 dropout/BN 的行为，梯度开关要另外用 set_grad_enabled 控制
    model.train(train)
    total, correct, n = 0.0, 0, 0
    with torch.set_grad_enabled(train):
        for xb, yb in loader:
            if train:
                opt.zero_grad()
            logits = model(xb)
            loss = loss_fn(logits, yb)
            if train:
                loss.backward()
                opt.step()
            # 记账前先 detach：把带梯度的 loss 存下来会让整张图一直被持有
            value = loss.detach()
            total += float(value) * len(yb)
            correct += int((logits.detach().argmax(1) == yb).sum())
            n += len(yb)
    return total / n, correct / n

for epoch in range(6):
    tr_loss, tr_acc = run(True)
    va_loss, va_acc = run(False)
    # 训练与验证两条曲线一起看，只看 loss 或只看 acc 都会误判
    print(epoch, round(tr_loss, 3), round(tr_acc, 3), "| val", round(va_loss, 3), round(va_acc, 3))`,
      pit: "把验证集也做成 `shuffle=True`：分数仍然能算，但每个 epoch 的验证 batch 组合不同，于是「按 step 计数的 lr 调度」「按 batch 统计的指标均值」全部漂移，两次实验差 0.5% 你以为是模型改好了，其实是打乱顺序变了。另一个同样常见的：在 `with torch.no_grad():` 里调用 `optimizer.step()`——它不会报错，只是梯度一直是 None，什么也没更新。",
      pit_en: "Shuffling the validation set: scores still compute, but the per-epoch batch composition changes, so anything counted per step (lr schedules) and any batch-mean statistic drifts, and a 0.5 percent difference between two runs is the shuffle order rather than your improvement. Equally common: calling optimizer.step() inside torch.no_grad() - no error is raised, grad just stays None forever and nothing updates.",
      ex: {
        q: "为什么验证阶段用 `model.eval()` 之外还必须额外关梯度，而训练阶段用 `model.train()` 之外不需要额外开梯度？",
        a: "因为开图是默认状态：训练时梯度本来就在记录，train() 只是把 dropout/BN 切回训练行为，不需要「再开一次」；而验证时你确实算出了 loss（默认也会建图），必须显式停止记录才不会把验证图挂到训练图上——这两种不对称来自「建图是默认、eval 不管建图」。",
        q_en: "Why must validation turn gradients off explicitly while training does not need to turn them on explicitly?",
        a_en: "Because graph building is the default state: during training gradients are already being recorded, so train() only restores dropout/BN behaviour and there is nothing to switch on. During validation you still compute a loss, and by default that builds a graph, so recording must be stopped explicitly or the validation graph hangs off the training one - the asymmetry comes from 'building is on by default, eval changes nothing about it'."
      }
    },

    "dl2-5": {
      min: 13,
      summary: [
        "设备管理的正确姿势是「模型搬一次、数据每批搬」：先 `device = torch.device(\"cuda\" if torch.cuda.is_available() else \"cpu\")`，`model.to(device)` 在优化器建立之前做一次；每个 batch 开头 `xb.to(device)`。优化器在 `.to()` 之后再建，可避免参数对象被替换后优化器指向旧张量。",
        "输入管道经常比计算更慢：数据在 CPU 上解码增强、GPU 只在前向时忙一下，于是 GPU 利用率像心电图。`num_workers > 0` 让子进程提前准备下一批，`pin_memory=True` 只对「CPU 张量搬到 GPU」有意义（页锁定内存让那次拷贝可以异步）。先用「只跑 DataLoader 不跑模型」测一下管道吞吐，再决定优化哪个瓶颈。",
        "`shuffle=True` 只属于训练集：验证与测试打乱不会报错，但会让按 step 计数的一切漂移（见 dl2-4），也让可视化对不上。`drop_last=True` 能躲开 batch=1 时 BN 的报错，代价是每个 epoch 少若干样本、总步数变化，比较 lr 调度时必须一起记账。",
        "`num_workers > 0` 会起子进程，Windows/macOS 的 spawn 语义要求脚本主体包在 `if __name__ == \"__main__\":` 里，否则递归起进程直到爆掉；worker 内部有独立的随机流，`torch.manual_seed` 管不到它们，要固定每个 worker 的增强随机性得写 `worker_init_fn`。这也是「同一份代码在 Linux 能跑、在 Windows 卡住」的常见原因。",
        "Dataset 与 DataLoader 的分工决定了增强的有效性：`__getitem__` 每次被调用时现做增强，所以同一个样本每个 epoch 看到的是不同版本；若在 Dataset 外面一次性做完，等于把随机性固化、把数据集缩小成「增强后的那一份」。归一化这类确定性的变换放在外面（或用 TensorDataset 预先算好）反而更快。",
        "TensorDataset 是「完全离线」的标准替身：把 numpy 数组 `torch.from_numpy(A).float()` 作特征、标签 `.long()`，两个张量装进去就有可用的 DataLoader。dtype 必须对上——交叉熵的 target 要 int64，喂 float 会报 expected target dtype to be Long or Byte；特征要 float32，int64 会报 mat1 and mat2 must have the same dtype（正是 dl2-1 那条）。",
        "显存的四笔账要会算：参数 + 梯度（与参数等大）+ 优化器状态（AdamW 每个参数两份 fp32，约 2 倍参数量）+ 激活值（随 batch 与深度增长，通常是大头）。fp32 训练一个 25M 参数的模型，仅前三项就约 25M×4×4 = 400 MB。定位手段：`torch.cuda.memory_allocated()` 与 `max_memory_allocated()` 分别看「当前/峰值」，再把 forward 分段插打印做二分。",
        "处置顺序也是按成本排的：先查有没有 no_grad 漏写、有没有被 list 持有的 loss（零成本）；再降 batch 或开梯度累积（等效 batch = batch × 累积步数，但总步数要按累积次数折算）；再上混合精度（dl2-6）；最后才是换模型。跳过前两步直接砍模型，是把工程问题当算法问题解。"
      ],
      summary_en: [
        "Device hygiene is 'move the model once, move each batch every batch': set device = torch.device('cuda' if torch.cuda.is_available() else 'cpu'), call model.to(device) once before constructing the optimiser, then xb.to(device) at the top of the loop. Building the optimiser after .to() avoids holding stale parameter objects.",
        "The input pipeline is often the bottleneck, not the math: data decodes and augments on the CPU while the GPU flashes only during forward, so utilisation looks like an ECG. num_workers > 0 prefetches the next batch and pin_memory=True only matters for CPU-to-GPU copies, where page-locked memory lets that copy overlap. Measure DataLoader throughput with no model at all before deciding what to optimise.",
        "shuffle=True belongs to the training set only: shuffling validation raises nothing but makes every per-step quantity drift (see dl2-4) and breaks visual comparisons. drop_last=True dodges the batch-of-one BatchNorm crash at the cost of dropping samples and changing the step count, which must be accounted for whenever you compare schedules.",
        "num_workers > 0 spawns processes, and spawn semantics on Windows and macOS require the script body to sit inside 'if __name__ == \"__main__\":' or processes recurse until the machine gives out. Workers own separate RNG streams, so torch.manual_seed does not reach them - per-worker augmentation seeding needs worker_init_fn. That is the usual reason 'this code works on Linux and hangs on Windows'.",
        "The Dataset/DataLoader split decides whether augmentation works at all: doing it inside __getitem__ means every epoch sees a fresh variant of the same sample, whereas augmenting once outside the Dataset freezes the randomness and shrinks your dataset to exactly that one transformed copy. Deterministic steps such as normalisation belong outside (or precomputed into a TensorDataset) precisely because they are faster.",
        "TensorDataset is the standard fully-offline stand-in: torch.from_numpy(A).float() for features and .long() for labels give you a working DataLoader immediately. The dtypes must be right - cross-entropy targets want int64 and complain about a Long expectation when you feed floats, while features want float32 and raise 'expected scalar type Float' for int64, exactly the dl2-1 trap.",
        "Memory is four separate ledgers: parameters, gradients (same size as parameters), optimiser state (AdamW keeps two fp32 buffers per parameter, about 2x the parameter bytes) and activations (growing with batch and depth, usually the biggest of the four). Training a 25M-parameter model in fp32 costs roughly 25M*4*4 = 400 MB before a single activation. Localise with torch.cuda.memory_allocated() versus max_memory_allocated(), then bisect by printing between forward stages.",
        "Repair in cost order: first check for a missing no_grad and for losses held in a list (free); then shrink the batch or use gradient accumulation (effective batch = batch times accumulation steps, and total steps must be divided accordingly); then mixed precision (dl2-6); only then reach for a smaller model. Skipping straight to shrinking the model means you solved an engineering problem as if it were an algorithmic one."
      ],
      code: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

# 离线数据：全部在内存里造，不下载、不联网
X = torch.randn(2048, 20)
y = (X[:, 0] + X[:, 7] * 0.5 + torch.randn(2048) * 0.2 > 0).long()
data = TensorDataset(X, y)
train_loader = DataLoader(data, batch_size=64, shuffle=True, drop_last=True)
val_loader = DataLoader(data, batch_size=256, shuffle=False)
print("train steps per epoch", len(train_loader), "val steps", len(val_loader))

model = nn.Sequential(nn.Linear(20, 256), nn.ReLU(), nn.Linear(256, 256), nn.ReLU(), nn.Linear(256, 2))
opt = torch.optim.AdamW(model.parameters(), lr=1e-3)

def bytes_of(t):
    return t.numel() * t.element_size()

# 先完整走一步，梯度与优化器状态才会真正被分配出来，否则读到的都是 0
model(torch.randn(64, 20)).pow(2).mean().backward()
opt.step()
p = sum(bytes_of(t) for t in model.parameters())
g = sum(bytes_of(t.grad) for t in model.parameters() if t.grad is not None)
s = sum(bytes_of(v) for st in opt.state.values() for v in st.values() if torch.is_tensor(v))
print("parameter bytes", p, "grad bytes", g, "optimizer state bytes", s)
# AdamW 每参数两份状态，所以固定开销约 (1 + 1 + 2) = 4 倍参数量；激活值另算
print("ratio to parameters", round((p + g + s) / p, 2))
print("labels must be int64:", y.dtype, "features float32:", X.dtype)`,
      pit: "为了「充分利用 GPU」把 batch 从 64 提到 1024，却没同步把学习率乘上去：等效学习率被摊薄了 16 倍，loss 像是冻住一样几乎不动，你于是怀疑模型容量不够、开始加层。另一个同批次的坑：`num_workers=8` 在 Windows 上不加 `if __name__ == \"__main__\":` 保护，程序会直接卡住或无限递归起进程，看起来像「PyTorch 装了个坏版本」。",
      pit_en: "Raising batch from 64 to 1024 to 'use the GPU properly' without scaling the learning rate: the effective step shrinks sixteen-fold, the loss looks frozen, and you conclude the model lacks capacity and start adding layers. From the same family: setting num_workers=8 on Windows without an 'if __name__ == \"__main__\":' guard, which hangs or recursively spawns processes until the machine dies and reads like a broken PyTorch install.",
      ex: {
        q: "为什么梯度累积能作为大 batch 的替代，但它并不是「完全等价」？",
        a: "因为它把若干个小 batch 的梯度累加起来再 step，一次更新的求和与直接大 batch 数学上同向，但 BatchNorm 的统计量仍然只按小 batch 计算，且每个小 batch 都前向了多次，所以归一化行为与真实大 batch 不同；此外每个累积片段都要正确管理 zero_grad 的位置。",
        q_en: "Why is gradient accumulation a substitute for a large batch rather than an exact equivalent?",
        a_en: "Summing the gradients of several small batches before stepping gives an update in the same direction as a genuine large batch, but BatchNorm statistics are still estimated per small batch and the forward runs several times, so the normalisation behaviour differs; and zero_grad must be placed correctly at the accumulation boundary."
      }
    },

    "dl2-6": {
      title: "综合重构：可复现地训练一次，并且把它保存下来",
      title_en: "Synthesis: Reproducing a Run and Saving It Properly",
      min: 15,
      target: "能独立完成一次「可交接」的训练：固定全部随机源、算清显存预算、用 state_dict 存档续训、按正确顺序做混合精度与梯度裁剪，并说清这个分数在什么条件下才可复现。",
      target_en: "Deliver a hand-off-ready training run: fix every random source, budget memory explicitly, checkpoint via state_dict, order mixed precision and gradient clipping correctly, and state under exactly which conditions the reported score reproduces.",
      summary: [
        "随机源不止一个：python 的 random、numpy、torch CPU、torch CUDA、以及每个 DataLoader worker 自己的流。`torch.manual_seed` 只盖住其中一路，所以「设了 seed 还是不复现」多半是 worker 或 numpy 在动。要用一个 set_seed 函数一次管全，并明白 `torch.use_deterministic_algorithms(True)` 的代价是关掉一些更快的实现——变慢是它的正常表现，不是坏掉了。",
        "「复现」分两种，目标要写清楚：同机同版本重跑，固定 seed 就够；跨硬件或跨框架版本，浮点加法不满足结合律、cuDNN 会按机器挑 kernel，逐位一致基本不可能。第二种的合理目标是「分布一致」——用区间和多次运行均值比较，而不是等号。",
        "保存 `state_dict()` 而不是整个模型：只存参数与 buffer，不依赖类定义的路径，换机器、重构代码都还打得开。`torch.save(model, path)` 走 pickle，要求加载端能按原路径 import 到同一个类，这在真实项目里几乎必然坏。",
        "buffer 是最容易被漏掉的一半：BatchNorm 的 running_mean/running_var 存在 buffer 里而不是 parameters 里，所以 `state_dict()` 会带上它们、而只挑 `p.data` 自己存权重就会丢。丢了它的症状是「训练时分数很好，推理一塌糊涂」，因为推理用的统计量还是初始值。",
        "恢复要看 `load_state_dict` 的返回值：它报告 missing 与 unexpected keys，忽略这个返回值等于忽略一张形状不匹配的通知单。要真正续训，优化器状态、当前 epoch、lr 调度器状态和随机种子都得一起存——只存模型权重然后重跑优化器，等于把动量与前二阶矩清零。",
        "混合精度的正确四步：`autocast()` 包前向与 loss、`scaler.scale(loss).backward()`、`scaler.step(optimizer)`（它内部已经做了 unscale 与真正的 step，不要再手写一次 optimizer.step()）、最后 `scaler.update()`。顺序上的硬约束是：要裁剪梯度就必须先 `scaler.unscale_(optimizer)`，否则你裁的是被放大过的梯度，裁剪阈值形同虚设。",
        "梯度裁剪是「只缩步长、不改方向」：`clip_grad_norm_` 计算全体参数拼接后的总范数，超过阈值时等比缩小。它治爆炸，不治消失，也不能替代 lr 调度。序列与 Transformer 模型几乎必开（dl4-5、dl5-3 会解释为什么那里特别容易爆）。",
        "一份「实验可交接」清单：代码版本 + 配置（lr、batch、seed、模型宽度与层数）+ 训练曲线（train/val 两条 loss 与两条指标）+ 最佳与最终两份权重 + 硬件与框架版本。缺任何一项，三个月后的你就无法向任何人解释这个分数是怎么来的。收口一句：dl1~dl2 到此封死了「一个 MLP 能被可靠地训练、诊断、复现和保存」；下一章 dl3 换的只是结构（卷积），训练机制整套复用，所以 dl3 的新坑全部长在空间尺寸与形状上。"
      ],
      summary_en: [
        "There is more than one random source: python's random, numpy, torch CPU, torch CUDA, plus each DataLoader worker's own stream. torch.manual_seed covers only one of them, so 'I seeded it and still cannot reproduce' is usually numpy or a worker. Write one set_seed that handles all of them, and accept that torch.use_deterministic_algorithms(True) costs speed because it disables faster kernels - being slower is its normal behaviour, not a defect.",
        "Reproducibility has two targets and you should say which one you mean: rerunning on the same machine and version only needs seeds; across hardware or library versions, floating-point addition is not associative and cuDNN picks kernels per device, so bitwise identity is effectively impossible. For the second, the honest goal is 'same distribution' - compare intervals and repeated-run means, never with an equals sign.",
        "Save state_dict(), not the whole model: it stores parameters and buffers only and depends on no import path, so another machine or a refactored class layout still opens it. torch.save(model, path) pickles the object and demands the identical class at the identical path on load, which fails in real projects almost always.",
        "Buffers are the half people drop: BatchNorm's running_mean and running_var live in buffers, not parameters, so state_dict carries them but a hand-rolled 'save all p.data' loop silently loses them. The symptom is 'great numbers during training, garbage at inference', because inference is still using the initial statistics.",
        "Read what load_state_dict returns: it reports missing and unexpected keys, and ignoring that return value is ignoring a shape-mismatch notice. To truly resume training you must also store optimiser state, the current epoch, the scheduler state and the seeds - keeping weights alone restarts momentum and second moments from zero.",
        "Mixed precision has four steps in a fixed order: wrap forward and loss in autocast(), call scaler.scale(loss).backward(), then scaler.step(optimizer) - which already unscales and performs the real step, so do not add your own optimizer.step() - and finally scaler.update(). The hard ordering constraint is that clipping requires an explicit scaler.unscale_(optimizer) first, otherwise you clip amplified gradients and the threshold means nothing.",
        "Gradient clipping shrinks the step, never the direction: clip_grad_norm_ computes the total norm over all flattened parameters and scales everything down proportionally past the threshold. It cures explosion, not vanishing, and does not replace a schedule. Sequence and Transformer models nearly always need it (dl4-5 and dl5-3 explain why they explode so readily).",
        "A hand-off checklist for any experiment: code version, config (lr, batch, seed, width, depth), curves (train and val for both loss and metric), both best and final checkpoints, and the hardware and library versions. Miss one item and in three months you cannot explain that score to anyone. Closing note: dl1 and dl2 together make 'an MLP can be trained, diagnosed, reproduced and stored reliably' a settled matter; dl3 changes only the structure to convolutions, reusing every training mechanism, which is why all its new traps live in spatial sizes and shapes."
      ],
      code: `import io
import random

import numpy as np
import torch
import torch.nn as nn

def set_seed(seed=0):
    # 复现要一次管住多路随机源，torch.manual_seed 只覆盖其中一路
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)

set_seed(0)
model = nn.Sequential(nn.Linear(8, 32), nn.ReLU(), nn.BatchNorm1d(32), nn.Linear(32, 2))
opt = torch.optim.AdamW(model.parameters(), lr=1e-2)
print("state_dict entries", len(model.state_dict()))
# 只看 keys 就能发现 BN 的 running_mean/var 属于 buffer，不在 parameters 里
print("buffers", [k for k in model.state_dict() if "running" in k])

out = model(torch.randn(64, 8))
out.pow(2).mean().backward()
# 裁剪必须在 unscale 之后；纯 fp32 没有 scaler 时可以直接裁
gnorm = float(nn.utils.clip_grad_norm_(model.parameters(), 1.0))
opt.step()
opt.zero_grad()
print("total grad norm before clip", round(gnorm, 3))

buf = io.BytesIO()
torch.save({"model": model.state_dict(), "opt": opt.state_dict(), "epoch": 3, "seed": 0}, buf)
buf.seek(0)
ckpt = torch.load(buf, weights_only=False)
fresh = nn.Sequential(nn.Linear(8, 32), nn.ReLU(), nn.BatchNorm1d(32), nn.Linear(32, 2))
info = fresh.load_state_dict(ckpt["model"])
opt.load_state_dict(ckpt["opt"])
# 这个返回值是形状对不上的通知书，空列表才代表真的接上了
print("missing", info.missing_keys, "unexpected", info.unexpected_keys)`,
      pit: "用 `torch.load(path)` 加载一个自己三个月前存的、包含自定义类或 numpy 标量的 checkpoint，在新版 PyTorch 上被 `weights_only=True` 拦住，于是顺手改成 `weights_only=False` 来「绕过」：那等于关闭了 pickle 的防护，对任何来源不明的权重都不该这么做。正解是把 checkpoint 写成纯张量字典（模型、优化器、epoch、配置分开存），既不触发警告也不需要放弃防护。",
      pit_en: "torch.load on a three-month-old checkpoint containing a custom class or numpy scalars gets blocked by the new weights_only=True default, so you flip weights_only=False to 'fix' it: that switches off the pickle guard and must never happen for weights of unclear origin. The right repair is to store a plain tensor dictionary - model, optimiser, epoch, config in separate keys - which triggers no warning and needs no loss of protection.",
      ex: {
        q: "为什么「混合精度 + 梯度裁剪」里必须显式调用 scaler.unscale_(optimizer)？",
        a: "因为 scaler 为了能在 fp16 下安全表示梯度，会把 loss 乘上一个很大的缩放因子，此时 .grad 里存的是被放大过的值；裁剪判断的是范数阈值，不先还原就直接裁，等于用错误的尺度做决定，而 scaler.step 内部才会自动 unscale。",
        q_en: "Why does 'mixed precision plus gradient clipping' require an explicit scaler.unscale_(optimizer)?",
        a_en: "Because the scaler multiplies the loss by a large factor so fp16 can represent the gradients at all, which means .grad currently holds scaled values; clipping compares against a norm threshold, so acting before the inverse scaling makes the decision in the wrong units - and the automatic unscale only happens inside scaler.step."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择/判断/填空混排） ---------- */
  quizAdd: {
    dl1: [
      {
        q: "把一个 20 层的网络每层都只保留线性变换（不加任何激活），最可能的结果是？",
        o: ["层数足够多就能逼近任意非线性函数", "数学上等价于单层线性变换，表达能力不增", "梯度消失更严重但结果仍会变好", "参数越多泛化必然越好"],
        a: 1,
        why: "矩阵乘积仍是矩阵，W₂₀(...(W₁x)) = (W₂₀...W₁)x，对任意输入都成立，所以没有激活就没有任何额表达能力，只是把一次乘法拆成二十次。",
        q_en: "What happens if a 20-layer network keeps only linear transforms with no activation between them?",
        o_en: ["Twenty layers can still approximate any nonlinear function", "It is mathematically one linear map, with no extra expressiveness", "Vanishing gradients but a better fit", "More parameters always generalise better"],
        why_en: "A product of matrices is a matrix: W20(...W1 x) equals (W20...W1) x for every input, so without activations the depth buys nothing but twenty multiplications."
      },
      {
        q: "训练时 loss 一切正常，切换到推理后输出的概率系统性偏大（普遍偏离训练时观察到的数值），最可能的原因是？",
        o: ["学习率太大", "忘了调用 model.eval()，dropout 仍在生效", "batch size 太小", "权重初始化方差偏小"],
        a: 1,
        why: "dropout 采用 inverted 方案，训练时把保留单元除以 1-p，推理时应当既不丢弃也不再缩放；若推理仍在训练模式，等于对同一份输出又丢又缩，数值分布整体偏移。",
        q_en: "Training loss looks fine, but at inference every output probability is systematically larger than during training. The likeliest cause?",
        o_en: ["Learning rate too high", "model.eval() was never called so dropout is still active", "Batch size too small", "Initialisation variance too small"],
        why_en: "Inverted dropout divides survivors by 1-p during training and expects inference to do neither dropping nor rescaling. Leaving the module in train mode at inference both drops and rescales again, shifting the whole distribution."
      },
      {
        q: "判断：在 Adam 里加上 weight_decay 与在损失函数里加 L2 正则项，效果完全等价。",
        type: "judge", a: 1,
        why: "只有在朴素 SGD 下二者等价。Adam 里 L2 项先进梯度、再被自适应步长重新缩放，正则强度与梯度大小耦合；AdamW 把衰减从梯度里拆出来直接作用在权重上才是原意。",
        q_en: "True or false: setting weight_decay in Adam is exactly equivalent to adding an L2 term to the loss.",
        why_en: "False. The two coincide only under vanilla SGD. In Adam the L2 term enters the gradient and is then rescaled by the adaptive factor, coupling regularisation strength to gradient magnitude; AdamW applies decay straight to the weights, which is the intended behaviour."
      },
      {
        q: "sigmoid 函数导数的最大值是 ______（用小数填写）。",
        type: "fill", ans: ["0.25", ".25", "1/4"],
        why: "σ'(z) = σ(z)(1−σ(z))，在 z=0 时取到最大值 0.25。反向传播要把每层这个因子连乘，n 层之后最多只剩 0.25ⁿ，这就是 sigmoid 深网梯度消失的算术根源。",
        q_en: "The maximum value of the derivative of the sigmoid function is ______ (give a decimal).",
        why_en: "sigma'(z) = sigma(z)(1 - sigma(z)), peaking at 0.25 when z = 0. Backprop multiplies one such factor per layer, so n layers leave at most 0.25 to the n - the arithmetic root of vanishing gradients in deep sigmoid nets."
      }
    ],
    dl2: [
      {
        q: "模型用普通 python list 保存子层（self.layers = [nn.Linear(...), ...]），会出现哪种现象？",
        o: ["前向直接报错", "parameters() 返回空，优化器无事可做，loss 不动但全程无报错", "自动转成 ModuleList，行为不变", "state_dict 会保存但 to(device) 无效"],
        a: 1,
        why: "nn.Module 靠 __setattr__ 把子模块登记进 _modules，普通 list 不会触发登记，所以参数对框架完全不可见：前向能跑，但迁移、求梯度、存档都跳过它们。",
        q_en: "What happens when submodules are kept in a plain python list (self.layers = [nn.Linear(...), ...])?",
        o_en: ["The forward pass errors out immediately", "parameters() comes back empty, the optimiser has nothing to update, and the loss never moves without any error", "It is silently converted to ModuleList with identical behaviour", "state_dict still saves them but to(device) skips them"],
        why_en: "nn.Module registers children through __setattr__ into _modules, and a plain list never triggers that, so the framework cannot see those weights: forward works while device migration, gradients and checkpointing all skip them."
      },
      {
        q: "把验证循环只写了 `model.eval()` 而没有 `no_grad()`，最直接的两个后果是？",
        o: ["梯度错误地累加进 .grad，且验证图持续占用显存", "结果数值会变，其它不变", "BatchNorm 会重新训练", "学习率被自动缩小"],
        a: 0,
        why: "eval() 只切换 dropout/BN 的行为，不影响是否建图。所以验证时算出的 loss 仍会构建计算图并（若调用 backward）把梯度叠加进 .grad，显存也会在第一个验证 batch 被顶满。",
        q_en: "Validating with only model.eval() and no no_grad() has which two direct consequences?",
        o_en: ["Gradients wrongly accumulate into .grad, and the validation graph keeps occupying memory", "Only the numbers change slightly", "BatchNorm starts retraining itself", "The learning rate shrinks automatically"],
        why_en: "eval() switches dropout and BN behaviour only; it says nothing about graph building. So the validation loss still builds a graph, any backward there adds into .grad, and memory peaks on the first validation batch."
      },
      {
        q: "判断：`x.to(device)` 不写回变量也能把张量搬到目标设备上。",
        type: "judge", a: 1,
        why: "张量的 to 返回新张量（同设备时可能返回自身），不写回等于丢弃结果；只有 nn.Module.to 是原地迁移并返回 self，两者行为不同，这条最容易记混。",
        q_en: "True or false: x.to(device) moves the tensor even if you do not assign the result back.",
        why_en: "False. A tensor's to returns a new tensor (possibly itself when already on the target), so dropping the return value changes nothing. Only Module.to mutates parameters in place and returns self - the two are easy to conflate."
      },
      {
        q: "交叉熵损失要求分类标签张量的 dtype 是 ______（填 PyTorch 类型名，如 float32 那种写法）。",
        type: "fill", ans: ["int64", "torch.int64", "long", "torch.long", "int"],
        why: "PyTorch 的 nn.CrossEntropyLoss 接受 (B,) 的整数类别下标，类型是 int64（LongTensor）；用 float 造标签会直接报类型错误，用 torch.tensor([1,2]) 之外从 numpy 转来时也要显式 .long()。",
        q_en: "The dtype PyTorch's cross-entropy loss expects for class labels is ______ (write it the way PyTorch names it).",
        why_en: "nn.CrossEntropyLoss takes integer class indices of shape (B,) in int64 (LongTensor). Float labels raise a type error, and arrays coming from numpy need an explicit .long()."
      }
    ]
  },

  /* ---------- 词典：分类只用 训练与数据 / 基础概念 / 应用与智能体 / 评测与安全 ---------- */
  terms: [
    { term: "非线性激活", term_en: "Nonlinear Activation", cat: "基础概念",
      short: "夹在线性层之间的逐元素函数，是深度网络表达力的唯一来源。",
      short_en: "An elementwise function inserted between linear layers; the sole source of a deep network's expressiveness.",
      detail: ["去掉全部激活，任意深度的网络都塌回一个线性映射，参数只增加计算量。", "激活选错的典型症状分三种：NaN（饱和溢出）、梯度恒 0（死 ReLU）、分数极低（输出层与损失没配对）。"],
      detail_en: ["Remove every activation and any depth collapses back to one linear map, so extra parameters add only arithmetic.", "The three activation symptoms are distinct: NaN from saturation and overflow, identically zero gradients from dead ReLU, and a stubbornly low score when the output layer does not match the loss."],
      vs: "激活函数提供非线性，归一化层提供尺度稳定，两者经常被混为一谈。",
      vs_en: "Activations supply nonlinearity; normalisation supplies scale stability. The two are routinely confused." },
    { term: "梯度消失", term_en: "Vanishing Gradient", cat: "训练与数据",
      short: "误差信号沿深度连乘后趋零，浅层参数几乎不再更新。",
      short_en: "The error signal shrinks toward zero when multiplied layer after layer, so early parameters stop updating.",
      detail: ["三条成因：饱和激活（sigmoid 导数上限 0.25）、层数本身、每层权重范数小于 1。", "判别动作是逐层打印梯度范数；解法是残差、归一化与合适的初始化，而不是先降学习率。"],
      detail_en: ["Three causes: saturating activations (sigmoid peaks at 0.25), sheer depth, and per-layer weight norms below one.", "The diagnostic is per-layer gradient norms; the remedies are residuals, normalisation and a matched initialisation scale - not first lowering the learning rate."],
      vs: "消失是连乘趋零，爆炸是连乘趋无穷，两者是同一条公式的两端。",
      vs_en: "Vanishing is the product tending to zero, exploding is the same product tending to infinity - one formula, both ends." },
    { term: "死亡 ReLU", term_en: "Dead ReLU", cat: "训练与数据",
      short: "某单元输入长期为负，梯度恒 0 从此永不更新。",
      short_en: "A unit whose input stays negative, whose gradient is identically zero and which therefore never updates again.",
      detail: ["主要成因是学习率过大：一步把偏置推到负侧再也回不来。", "验证方法是统计每层激活为 0 的比例；换 LeakyReLU/GELU 只是补救，先把学习率降下来才是治因。"],
      detail_en: ["The usual trigger is too large a learning rate: one step pushes the bias negative permanently.", "Check the fraction of zero activations per layer. LeakyReLU or GELU are repairs; lowering the rate treats the cause."],
      vs: "死 ReLU 是永久失效，梯度消失是所有单元都还在但信号极小。",
      vs_en: "A dead ReLU unit is permanently out; vanishing gradients leave every unit alive but the signal is tiny." },
    { term: "权重初始化尺度", term_en: "Initialisation Scale", cat: "训练与数据",
      short: "让每层激活方差不放大也不塌缩的权重标准差取法。",
      short_en: "Choosing weight standard deviations so each layer's activation variance neither grows nor collapses.",
      detail: ["Xavier 用 1/fan_in 配 tanh；Kaiming 用 2/fan_in 配 ReLU，多出的 2 补回被负半轴砍掉的方差。", "初始化偏小不会让训练「慢一点」，而是让信号逐层归零，等价于网络不存在。"],
      detail_en: ["Xavier uses 1/fan_in for tanh; Kaiming uses 2/fan_in for ReLU, that extra 2 restoring the variance the negative half throws away.", "Too small does not merely slow training - it decays the signal to nothing layer by layer, which is as if the network were absent."],
      vs: "初始化管起点，归一化层管每一步之后，两者都在治同一个尺度问题。",
      vs_en: "Initialisation fixes the starting point; normalisation fixes it after every step. Both treat the same scale problem." },
    { term: "归一化层", term_en: "Normalisation Layer", cat: "训练与数据",
      short: "把每层输入拉回均值 0 方差 1，再用学出来的 γ/β 重缩放。",
      short_en: "Rescaling each layer's input to zero mean and unit variance, then re-scaling with learned gamma and beta.",
      detail: ["BatchNorm 沿 batch 统计，因此依赖 batch size 且训练/推理行为不同；LayerNorm 沿特征统计，与 batch 无关，适合变长序列。", "它使损失面更平滑、允许更大学习率、对初始化不再敏感，但不解决饱和激活带来的梯度压扁。"],
      detail_en: ["BatchNorm estimates over the batch, so it depends on batch size and behaves differently at train and inference; LayerNorm normalises over features, which suits variable-length sequences.", "It flattens the loss surface, tolerates larger rates and removes sensitivity to initialisation, but does not undo the squashing caused by a saturating activation."],
      vs: "特征标准化作用在输入数据上，归一化层作用在网络内部的中间激活上。",
      vs_en: "Feature standardisation acts on the input data; a normalisation layer acts on intermediate activations inside the network." },
    { term: "权重衰减", term_en: "Weight Decay", cat: "训练与数据",
      short: "每步按 w ← w − ηλw 直接缩小权重，与梯度大小无关。",
      short_en: "Shrinking weights every step by w -= eta*lambda*w, independently of gradient magnitude.",
      detail: ["只有朴素 SGD 下它与 L2 正则完全等价；Adam 里 L2 会被自适应步长再次缩放，AdamW 才还原了衰减本意。", "优化器若收进了 requires_grad=False 的参数，衰减依然会作用于它们，这是「冻结却仍被改掉」的原因。"],
      detail_en: ["Under vanilla SGD it is exactly L2 regularisation; inside Adam the L2 term is rescaled by the adaptive factor, and AdamW restores the intended meaning.", "Decay still acts on parameters held by the optimiser with requires_grad=False, which is why a frozen backbone can slowly drift."],
      vs: "L2 是往梯度里加一项，weight decay 是往权重上减一份。",
      vs_en: "L2 adds a term to the gradient; weight decay subtracts a share from the weights." },
    { term: "计算图", term_en: "Computation Graph", cat: "基础概念",
      short: "autograd 从 requires_grad 叶子出发逐算子记下的有向图。",
      short_en: "The directed graph autograd builds operator by operator outward from tensors that need gradients.",
      detail: ["图默认用后即焚：非叶子节点的中间张量在反向时即释放，所以第二次 backward 会报错。", "任何 detach、转 numpy、取 python 标量的操作都会让某个节点脱离图，表现是「参数一动不动」。"],
      detail_en: ["The graph is disposable by default: non-leaf buffers are freed during backward, which is why a second backward fails.", "Detach, converting to numpy or pulling out a python scalar removes a node from the graph, and the symptom is 'my parameters never move'."],
      vs: "计算图决定「能不能自动求导」，requires_grad 只是它的入场许可。",
      vs_en: "The graph decides whether autograd can run; requires_grad is merely the ticket in." },
    { term: "训练与评估模式", term_en: "Train and Eval Mode", cat: "训练与数据",
      short: "model.train()/eval() 只切换 dropout 与 BatchNorm 的行为。",
      short_en: "model.train() and eval() switch only the behaviour of dropout and BatchNorm.",
      detail: ["它不影响是否建图、不影响 requires_grad，所以 eval() 之后照样能 backward 并更新参数。", "BatchNorm 在 eval 下用 running 统计量，这正是 buffer 必须一起存进 state_dict 的原因。"],
      detail_en: ["It changes neither graph building nor requires_grad, so backward after eval() still moves parameters.", "In eval mode BatchNorm uses the running statistics, which is exactly why buffers belong in state_dict."],
      vs: "模式管「这一层怎么算」，no_grad 管「要不要记账」，两件事各一套开关。",
      vs_en: "Mode controls how a layer computes; no_grad controls whether bookkeeping happens. Two separate switches for two separate jobs." },
    { term: "no_grad 上下文", term_en: "no_grad Context", cat: "训练与数据",
      short: "临时停止建图，用于推理与验证以省显存。",
      short_en: "Temporarily disabling graph construction during inference and validation to save memory.",
      detail: ["inference_mode 更彻底（连版本计数都省），但它产出的张量不能再参与训练或被缓存复用。", "在 no_grad 里调用 optimizer.step() 不报错，只是 .grad 一直是 None，什么也没更新。"],
      detail_en: ["inference_mode goes further and drops version tracking too, but its tensors may not later take part in training or be cached for reuse.", "Calling optimizer.step() inside no_grad raises nothing - grad simply stays None, so nothing happens."],
      vs: "detach 断开单个张量，no_grad 关掉一整个代码块内的记录。",
      vs_en: "detach cuts one tensor; no_grad switches off recording for a whole block." },
    { term: "显存预算", term_en: "Memory Budget", cat: "训练与数据",
      short: "参数 + 梯度 + 优化器状态 + 激活值四笔账的合计。",
      short_en: "The sum of four ledgers: parameters, gradients, optimiser states and activations.",
      detail: ["fp32 下 AdamW 的固定开销约为参数量的 4 倍字节数，激活通常才是大头，因为它随 batch 与深度增长。", "被 python list 长期持有的 loss 张量会让显存每个 step 只涨不落，这是「第二个 epoch OOM」的常见真身。"],
      detail_en: ["In fp32, AdamW's fixed cost is about four times the parameter bytes, yet activations are usually the largest share because they scale with batch and depth.", "Loss tensors parked in a python list keep their graphs alive, so memory only climbs step by step - a usual cause of 'OOM on the second epoch'."],
      vs: "参数量决定「装得下模型」，显存预算决定「跑得动训练」。",
      vs_en: "Parameter count decides whether the model fits; the memory budget decides whether training fits." },
    { term: "混合精度训练", term_en: "Mixed Precision Training", cat: "训练与数据",
      short: "前向用 fp16/bf16 算、部分统计仍用 fp32，配合 loss 缩放反传。",
      short_en: "Computing the forward pass in fp16/bf16 with fp32 kept where it matters, and scaling the loss before backward.",
      detail: ["顺序硬约束：autocast 包前向，scaler.scale(loss).backward()，要裁剪必须先 scaler.unscale_()，再 scaler.step() 与 update()。", "fp16 动态范围窄、小梯度会下溢为 0，所以需要缩放；bf16 范围与 fp32 相同但精度低，通常不需要 scaler。"],
      detail_en: ["The ordering is rigid: autocast around the forward, scaler.scale(loss).backward(), an explicit scaler.unscale_() before any clipping, then scaler.step() and scaler.update().", "fp16's narrow range underflows small gradients to zero, hence the scaling; bf16 matches fp32's range but not its precision and usually needs no scaler."],
      vs: "混合精度省的是显存与带宽，量化省的是部署时的权重体积，两者阶段不同。",
      vs_en: "Mixed precision saves memory and bandwidth while training; quantisation saves weight volume at deployment. Different stages." },
    { term: "state_dict 快照", term_en: "state_dict Checkpoint", cat: "训练与数据",
      short: "只存参数与 buffer 的字典，跨机器与重构仍可加载。",
      short_en: "A dictionary of parameters and buffers that still loads across machines and refactors.",
      detail: ["只挑 p.data 自己存档会丢掉 BN 的 running 统计，症状是训练分数好、推理一塌糊涂。", "load_state_dict 的返回值列出 missing/unexpected keys，忽略它等于忽略一张形状不匹配的通知书。"],
      detail_en: ["Saving only p.data throws away BatchNorm's running statistics, which is why training scores look fine while inference collapses.", "load_state_dict returns the missing and unexpected keys; ignoring it is ignoring a shape-mismatch notice."],
      vs: "state_dict 存「学到了什么」，pickle 整个模型还绑定了「代码长在哪」。",
      vs_en: "A state_dict stores what was learned; pickling the model also pins down where its code lives." }
  ],

  achievements: [
    { id: "backprop_by_hand", icon: "🧮", name: "手推反向传播", name_en: "Backprop By Hand",
      desc: "完成 dl1 · 神经网络基础 全部课节", desc_en: "Finish every lesson of dl1 Neural Network Basics",
      check: ["dl1"] },
    { id: "reproducible_run", icon: "🔬", name: "可复现实验员", name_en: "Reproducible Experimenter",
      desc: "完成 dl2 · PyTorch 实战训练 全部课节", desc_en: "Finish every lesson of dl2 PyTorch Training in Practice",
      check: ["dl2"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "一个神经元：先仿射，再逐元素过非线性；偏置让分界面能离开原点": "one neuron: affine first, then an elementwise nonlinearity; the bias lets the boundary leave the origin",
    "ReLU 这一步才是「非线性」的全部来源，前面那段只是直线": "this ReLU is the entire source of 'nonlinear' - everything before it is a straight line",
    "参数量口算：in*out + out，显存与过拟合都从这条算式起步": "count parameters by heart: in*out + out; memory and overfitting both start here",
    "关键实验：两层「不加激活」的网络和一层数值上完全一样": "key experiment: two layers with no activation are numerically identical to one layer",
    "减去最大值不改变结果，却把指数全部压回可表示区间": "subtracting the max changes nothing but pulls every exponent back into range",
    "sigmoid 的导数在 z=0 处取到全局最大 0.25，再也没有更大的了": "the sigmoid derivative peaks at 0.25 when z=0 and never exceeds it",
    "反向传播要把每层激活的导数连乘，层数就是指数": "backprop multiplies one activation derivative per layer, so depth is the exponent",
    "不做减法的 softmax：exp 溢出成 inf，inf/inf 变成 nan": "softmax without the shift: exp overflows to inf, inf/inf becomes nan",
    "双重 softmax：logit 已经很有把握（10 对 0），再过一次就退回近似均匀": "double softmax: even a confident logit pair (10 versus 0) is flattened back toward uniform",
    "三类的下界就是 -log(e/(e+2)) 约 0.55：logit 再大也压不过它，梯度同时趋零": "with three classes the floor is -log(e/(e+2)) about 0.55; no logit gets under it, and the gradient dies meanwhile",
    "尺度必须按每层的 fan_in 单独算，用一个全局常数本身就是一种错": "the scale must be computed per layer from its own fan_in; one global constant is already a mistake",
    "每层只盯一个数：激活的标准差，它比 loss 更早暴露问题": "watch one number per layer: the activation standard deviation, which betrays trouble before the loss does",
    "形状对、语义错的典型：方阵层写成 X @ W.T 时尺寸照样合法，只能靠 assert 拦": "right shapes, wrong semantics: on a square layer X @ W.T stays legal, so only an assert can catch it",
    "方差 1 的初始化：std 每层乘上约 sqrt(fan_in)，第三层就冲到上千": "variance-1 init: std is multiplied by about sqrt(fan_in) each layer, past a thousand by layer three",
    "逐层按 Kaiming 的 sqrt(2/fan_in) 缩放：每层 std 才留在同一量级": "scaling per layer by Kaiming's sqrt(2/fan_in) is what keeps every std in the same band",
    "反向用的就是这份前向缓存，z1/a1 必须和算 loss 那次前向完全一致": "backward reuses exactly this forward cache; z1 and a1 must match the forward that produced the loss",
    "链式法则：误差先送回头一层的预激活，再乘 ReLU 的导数": "chain rule: carry the error back to the previous pre-activation, then multiply by the ReLU derivative",
    "中心差分：单侧差分会把误差放大一个数量级": "central difference: a one-sided difference inflates the error by an order of magnitude",
    "残差那条加法路径就是 \"I +\" 的来源": "that additive path in the residual is where the 'I +' comes from",
    "只看两端：最浅层与最深层的梯度范数差多少个数量级": "look only at the ends: how many orders of magnitude separate the shallowest and deepest gradient norms",
    "同一副 20 层网络只改初始化尺度：偏小梯度掉到 1e-7，偏大则冲到上千": "same 20-layer net, only the init scale changes: too small drops the gradient to 1e-7, too large blows past a thousand",
    "加上残差后，连 std=0.1 这种「偏小」配置都不再消失（1e-7 变成 1e2）": "with residuals even the too-small std=0.1 stops vanishing (1e-7 becomes 1e2)",
    "但残差救不了偏大：std=0.35 时前向本身就逐层放大，恒等路帮不上忙": "but residuals cannot rescue too-large: at std=0.35 the forward itself grows per layer, and the identity path does not help",
    "完全离线：圆内/圆外两类，一条直线必然学不动，只能靠隐层折弯": "fully offline: inside-versus-outside a circle, which no straight line can fit - only a hidden layer can bend it",
    "Kaiming 尺度 sqrt(2/fan_in)：那个 2 补回被 ReLU 负半轴砍掉的方差": "Kaiming scale sqrt(2/fan_in): that factor 2 restores the variance ReLU's negative half throws away",
    "误差送回隐层时要乘 ReLU 的导数，这一步漏了就没有「反向」可言": "carrying the error into the hidden layer means multiplying by the ReLU derivative; skip it and there is no backward pass at all",
    "四处一起更新，别顺手改其中某一处的步长，否则归因就没了": "update all four together; do not tweak one step length in passing, or attribution is gone",
    "整数列表会被猜成 int64，而网络参数默认是 float32": "an integer list becomes int64, while network parameters default to float32",
    "报错只说类型，不会告诉你是哪一行造的张量": "the message only names the dtype, never the line that built the tensor",
    "view 只换解释方式，要求内存连续；transpose 之后不再连续": "view only reinterprets the buffer and needs it contiguous; after transpose it no longer is",
    "与 numpy 互转：detach 与 cpu 两步都不能省": "converting to numpy: neither the detach nor the cpu step can be skipped",
    "中间张量不是叶子：它的 .grad 不会被填，要看得用 retain_grad 或 autograd.grad": "an intermediate is not a leaf: its .grad stays unset - use retain_grad or autograd.grad to see it",
    "忘记 zero_grad：第二个 batch 的梯度直接叠在旧的上面": "forgetting zero_grad: the second batch's gradient lands straight on top of the first",
    "图是一次性的，第二次穿过同一张图就被拒绝": "the graph is single-use; a second pass through it is refused",
    "detach 把这一段剪断：下游照常反传，但梯度走到这里就停了，回不到 v": "detach cuts this segment: backward still runs downstream, but the gradient stops here and never reaches v",
    "错：普通 list 存子层，nn.Module 完全不知道它们存在": "wrong: layers in a plain list, so nn.Module never learns they exist",
    "对：ModuleList 会登记进 _modules，to/parameters/state_dict 才有效": "right: ModuleList registers them into _modules, so to/parameters/state_dict all work",
    "冻结主干：先反传一次让 .grad 被分配，再冻结，之后每步仍在被 weight decay 拉走": "freezing a backbone: backward once first so .grad exists, then freeze - every later step still drags the weights via decay",
    "清零只碰「已经有 .grad」的参数，这里那份全零张量还在，于是衰减照旧执行": "zeroing only touches parameters that already own a .grad; the all-zero buffer is still here, so decay proceeds",
    "完全离线：随机张量造一个可学的二分类，不碰任何下载": "fully offline: a learnable binary task from random tensors, no downloads involved",
    "train 只决定 dropout/BN 的行为，梯度开关要另外用 set_grad_enabled 控制": "train only governs dropout and BN behaviour; the gradient switch is a separate set_grad_enabled",
    "记账前先 detach：把带梯度的 loss 存下来会让整张图一直被持有": "detach before bookkeeping: keeping a live loss tensor holds its whole graph alive",
    "训练与验证两条曲线一起看，只看 loss 或只看 acc 都会误判": "read training and validation curves together; loss alone or accuracy alone both mislead",
    "离线数据：全部在内存里造，不下载、不联网": "offline data: everything is built in memory, nothing downloaded, no network",
    "先完整走一步，梯度与优化器状态才会真正被分配出来，否则读到的都是 0": "take one full step first - only then are gradients and optimiser state really allocated, otherwise you read zeros",
    "AdamW 每参数两份状态，所以固定开销约 (1 + 1 + 2) = 4 倍参数量；激活值另算": "AdamW keeps two states per parameter, so the fixed cost is about (1+1+2) = 4x the parameter bytes; activations come on top",
    "复现要一次管住多路随机源，torch.manual_seed 只覆盖其中一路": "reproducing means controlling several random sources at once; torch.manual_seed covers only one",
    "只看 keys 就能发现 BN 的 running_mean/var 属于 buffer，不在 parameters 里": "the keys alone reveal that BN's running_mean/var are buffers, not parameters",
    "裁剪必须在 unscale 之后；纯 fp32 没有 scaler 时可以直接裁": "clipping must come after unscale; in plain fp32 with no scaler you can clip directly",
    "这个返回值是形状对不上的通知书，空列表才代表真的接上了": "this return value is the shape-mismatch notice; only empty lists mean it truly connected"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_DL12);
