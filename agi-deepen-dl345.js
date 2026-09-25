/* ================================================================
 * R0:hello agi · 课程深化层 ⑬（dl3 CNN 与计算机视觉 / dl4 序列模型与注意力 / dl5 生成模型与 Transformer）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把结构建模三章从每节 3 要点深化到 7~8 要点，仍然盯住那三件事——
 *       「训练为什么不动 / 为什么会崩 / 为什么分数是假的」。dl3 补卷积省参数的定量
 *       理由、输出尺寸公式与差一错误、感受野、分组与深度可分离、冻结主干时 BN 仍被
 *       改写、增强不许改标签语义、小 batch 下 BN 的抖动、分类/检测/分割的指标差异；
 *       dl4 补定长输入的局限、RNN 沿时间连乘的梯度、门与遗忘门偏置初始化、teacher
 *       forcing 与曝光偏差、seq2seq 瓶颈、sqrt(d) 缩放、padding mask 与长度对齐、解码策略；
 *       dl5 补因果掩码、平方复杂度、多头在做什么、三段式各自代价、VAE/GAN/扩散分别在
 *       优化什么、量化/蒸馏/剪枝各牺牲什么、以及困惑度与人评为什么不可信。
 *       三章各加一节「综合重构」收口课。
 * 写法沿用 agi-deepen-s12.js：既有课节不写 title；新课写 title/target；
 * order 覆盖全部既有 id；code 里的中文注释全部登记在 codeComments。
 * 所有示例纯本地离线：只用随机张量与内存里造的数据，不下载权重、不联网、无服务端。
 * ================================================================ */

const DEEPEN_DL345 = {
  stages: ["dl3", "dl4", "dl5"],

  order: {
    dl3: ["dl3-1", "dl3-2", "dl3-3", "dl3-4", "dl3-5"],
    dl4: ["dl4-1", "dl4-2", "dl4-3", "dl4-4", "dl4-5"],
    dl5: ["dl5-1", "dl5-2", "dl5-3", "dl5-4", "dl5-5"]
  },

  lessons: {

    /* ===================== dl3 CNN 与计算机视觉 ===================== */
    "dl3-1": {
      min: 14,
      summary: [
        "卷积省参数靠两条假设同时成立：局部性（相邻像素才有关联）与权值共享（同一个核在图上每处都用一遍）。少了任何一条都不省——只局部不共享就是「每个位置一套小权重」，只共享不局部就是全连接。",
        "把「省」写成数字才有意义：32×32×3 的输入接 64 个输出单元，全连接要 3·32·32·64 + 64 ≈ 19.7 万参数，5×5 卷积只要 5·5·3·64 + 64 = 4,864，而且卷积这个数字不随图像变大而增加——核只有一份。",
        "输出尺寸公式是 out = floor((in + 2p − k)/s) + 1。那个 +1 与 floor 是差一错误的产地：in=32、k=3、s=2、p=1 得到 (32+2−3)//2 + 1 = 16，而不是直觉里的「除以 2 等于 16.5 取 16」。写代码前先把每层的尺寸算一遍，比事后调 padding 快十倍。",
        "'same' 填充是一个约定而不是唯一解：它的目标是让输出 ≈ 输入尺寸，但 k 为偶数或 s > 1 时两侧留不下对称的边距，框架只能把多出来的那一像素放到右侧/下侧。于是做转置卷积上采样时会出现半像素错位——这也是很多分割网络边缘糊掉的原因。",
        "通道是「特征种类数」，不是颜色数：卷积核的深度必须等于输入通道数 Cin，输出通道数就等于核的个数。所以一层 Conv2d 的参数量是 k·k·Cin·Cout + Cout，1×1 卷积则是纯粹跨通道的线性组合（Cin·Cout + Cout），用来升/降维。",
        "感受野是「输出上一个像素回头看多大范围」：两层 3×3（stride 1）等效于 5×5，三层等效 7×7，但参数与非线性都更划算——这就是 VGG 只用 3×3 的理由。感受野必须大于你要判别的目标，否则模型根本看不到完整的物体。",
        "分组卷积（groups = g）把每个核的深度限制在 Cin/g，参数量除以 g；深度可分离卷积是它的极端形式：groups = Cin 的逐通道卷积（k·k·Cin）再加一层 1×1 逐点卷积（Cin·Cout）。省下一个数量级，代价是每个核再也看不到全部通道，通道之间的交流只能靠那层 1×1，特征能力有实打实的损失。",
        "衔接：本章前置是 dl1（激活、初始化、残差为何救梯度）与 dl2（形状、device、训练循环）；下一节 dl3-2 处理「维度顺序」这个 CNN 最常见的 bug 现场。"
      ],
      summary_en: [
        "Convolutions save parameters because two assumptions hold together: locality (only neighbours interact) and weight sharing (one kernel is reused at every position). Drop either one and the saving vanishes - local but unshared is a separate mini-weight set per position, shared but global is a fully connected layer.",
        "'Saves' only means something as a number: from a 32x32x3 input to 64 output units a dense layer needs about 197,000 weights, a 5x5 convolution 4,864 - and the convolution number never grows with image size, because there is still exactly one kernel.",
        "The size rule is out = floor((in + 2p - k)/s) + 1. The +1 and the floor are where off-by-one errors are born: with in=32, k=3, s=2, p=1 you get (32+2-3)//2 + 1 = 16, not the intuitive 'half of 32 is 16'. Computing every layer's size before coding beats fixing padding afterwards.",
        "'same' padding is a convention, not a unique answer: it aims for output roughly equal to input, but even kernels and strides above 1 cannot leave symmetric margins, so the framework parks the spare pixel on the right/bottom. That half-pixel offset is why transposed-convolution upsampling produces the blurry boundaries so common in segmentation.",
        "Channels are 'how many kinds of feature', not 'how many colours': a kernel's depth must equal the input channel count and the number of kernels sets the output channels, so a Conv2d costs k*k*Cin*Cout + Cout. A 1x1 convolution is a pure cross-channel linear combination, Cin*Cout + Cout, used to lift or project dimensions.",
        "The receptive field is how large an input region one output pixel looks back at: two 3x3 layers with stride 1 act like a 5x5, three like a 7x7, at lower cost and with more nonlinearity - VGG's whole argument. Your receptive field must exceed the object you are classifying, or the model literally never sees it.",
        "Grouped convolution caps each kernel at Cin/g input channels and divides the parameter count by g; depthwise separable convolution is the extreme - a depthwise pass with groups = Cin (k*k*Cin) plus one 1x1 pointwise pass (Cin*Cout). That is an order of magnitude cheaper, and the price is that no kernel ever sees all channels at once, so cross-channel mixing depends on that single 1x1, which is a real loss of expressiveness.",
        "Bridge: this chapter presumes dl1 (activations, initialisation, why residuals rescue gradients) and dl2 (shapes, devices, the training loop). dl3-2 walks into the most frequent bug scene in CNNs, the axis order."
      ],
      code: `import torch
import torch.nn as nn

def out_size(size, k, s, p):
    # 输出边长 = floor((in + 2p - k) / s) + 1，那个 +1 就是最容易漏的一项
    return (size + 2 * p - k) // s + 1

for k, s, p in [(3, 1, 0), (3, 1, 1), (3, 2, 1), (5, 2, 1), (7, 2, 3)]:
    print("k", k, "s", s, "p", p, "->", out_size(32, k, s, p))

x = torch.randn(2, 3, 32, 32)
# 同样的 64 个输出单元：全连接与 5x5 卷积的参数量差一个数量级
fc = nn.Linear(3 * 32 * 32, 64)
conv = nn.Conv2d(3, 64, 5)
print("dense", sum(p.numel() for p in fc.parameters()), "conv", sum(p.numel() for p in conv.parameters()))
print("conv out", tuple(conv(x).shape))

# 深度可分离：groups=Cin 让每个核只看一个通道，再用 1x1 跨通道混合
dw = nn.Conv2d(64, 64, 3, padding=1, groups=64)
pw = nn.Conv2d(64, 128, 1)
plain = nn.Conv2d(64, 128, 3, padding=1)
n_dw = sum(p.numel() for p in dw.parameters()) + sum(p.numel() for p in pw.parameters())
print("depthwise+pointwise", n_dw, "plain 3x3", sum(p.numel() for p in plain.parameters()))`,
      pit: "把参数量当成计算量来看，于是以为「深度可分离卷积只有 1/8 参数所以快 8 倍」。省下来的是权重读写，但逐通道卷积的访存模式极差（每个核只服务一个通道），在很多硬件上它的耗时占比反而上升；而且它把 H·W 那份乘加留在了前面的层里。衡量前向成本要按乘加数（MACs ≈ k·k·Cin·Cout·H·W）而不是按参数量算。",
      pit_en: "Reading parameter count as compute and concluding 'depthwise separable has an eighth of the weights so it is eight times faster'. What shrinks is weight traffic, while the depthwise pass has terrible memory behaviour (one kernel serves exactly one channel), so on many accelerators its share of the time rises and the k*k*Cin*Cout*H*W work is still paid elsewhere. Measure forward cost in MACs, not parameters.",
      ex: {
        q: "为什么 1×1 卷积既被叫作「卷积」又被当作「降维层」？",
        a: "因为核尺寸是 1 时没有任何空间滑动可言，它退化成在每个像素位置上对 Cin 个通道做一次线性变换——相当于一个逐位置共享的全连接层，所以既保留卷积的形状接口，又能自由改变通道数。",
        q_en: "Why is a 1x1 convolution called a convolution and used as a dimensionality reducer?",
        a_en: "With a kernel of size 1 there is no spatial sliding left, so it degenerates into one linear map over the Cin channels at every pixel - a position-shared fully connected layer, which keeps the convolution interface while letting the channel count change freely."
      }
    },

    "dl3-2": {
      min: 12,
      summary: [
        "PyTorch 的图像张量是 (B, C, H, W)，numpy/PIL 是 (H, W, C)，cv2 还是 BGR。三套约定互不报错地共存，所以「图看起来是碎的 / 颜色是反的」这类问题必须在转换处显式 permute，而不是指望框架替你猜。",
        "最危险的不是报错而是「恰好合法」：当某两个维度的数值碰巧相等时，顺序写错的张量尺寸完全通过检查，conv 照算、loss 照降，只是永远学不出东西。唯一的防线是 forward 里的 `assert x.shape == (B, C, H, W)`，它便宜到没有理由不写。",
        "`view` 只改解释方式、不搬数据：把 (B,H,W,C) 直接 view 成 (B,C,H,W)，元素总数一致所以不会报错，但同一个像素的通道被拆散到空间维上——图就变成噪点。要换轴必须用 permute（必要时再 contiguous）。",
        "池化的真实作用是「无可学参数的下采样」：最大池化留最强响应（这个特征在不在），平均池化留总量（这类特征有多少）。它换来更小的分辨率、更大的等效感受野和约 k 步的平移容忍，代价是丢掉精确位置——所以分割与姿态这类要定位的任务通常少用池化。",
        "池化给的不是平移不变性而是平移容忍度，而且只有约一个窗口的幅度。真正的位置不变性要靠数据增强把位移样本喂进去；把「有池化所以位置无关」写进设计假设，会在大位移数据上被打脸。",
        "现代网络更常用 stride 卷积代替池化下采样：它没有独立参数、可与主干一起优化、在 GPU 上的核融合也更友好。MaxPool 仍然在浅层的边缘响应压缩里有价值，但它不再是唯一选项。",
        "通道与分辨率是一把剪刀：典型 CNN 里每把 H/W 减半一次就把通道翻倍，于是 k²·Cin·Cout·H·W 大致守恒。这解释了两件事——为什么计算集中在浅层（分辨率高），而参数集中在深层与展平头（通道多）；也解释了为什么把最后的全连接头换成全局平均池化能砍掉几个数量级的参数。",
        "衔接：维度与尺寸能管住了，下一节 dl3-3 才谈「怎么把层堆成一个可训练的深度网络」，以及残差为什么是那条救命线。"
      ],
      summary_en: [
        "PyTorch images are (B, C, H, W), numpy and PIL are (H, W, C), and cv2 adds BGR on top. All three conventions coexist without complaining, so 'the image looks shredded' or 'the colours are inverted' has to be fixed with an explicit permute at the boundary rather than by hoping the framework guesses.",
        "The dangerous case is not the error but the accident: when two dimensions happen to be numerically equal, a tensor with the axes in the wrong order passes every shape check, the convolution runs, the loss falls - and the model learns nothing. The only defence is 'assert x.shape == (B, C, H, W)' inside forward, which is far too cheap to skip.",
        "view reinterprets without moving data: turning (B, H, W, C) into (B, C, H, W) with view changes nothing about the underlying bytes, so each pixel's channels get scattered across the spatial axes and the image becomes noise. Reordering axes needs permute, plus contiguous if a view is required afterwards.",
        "Pooling's real job is parameter-free downsampling: max keeps the strongest response (is this feature present), average keeps the total (how much of it is around). You trade exact position for a smaller map, a larger effective receptive field and roughly k pixels of shift tolerance - which is why localisation tasks such as segmentation and pose use it sparingly.",
        "Pooling buys shift tolerance of about one window, not shift invariance. Real positional robustness comes from augmentation that feeds in shifted examples; treating 'there is a pool so position does not matter' as a design assumption gets punished the first time objects move a long way.",
        "Modern networks prefer strided convolution for downsampling: it adds no separate parameters, is optimised jointly with the trunk and fuses better on a GPU. MaxPool still earns its place compressing shallow edge responses, but it is no longer the only option.",
        "Channels and resolution are a pair of scissors: typical CNNs double the channel count each time they halve H and W, so k*k*Cin*Cout*H*W stays roughly constant. That explains why compute concentrates in the early high-resolution layers while parameters concentrate late and in the flatten head - and why replacing that head with global average pooling deletes several orders of magnitude of weights.",
        "Bridge: once axes and sizes are under control, dl3-3 asks how to stack layers into a trainable deep network and why the residual connection is the life line."
      ],
      code: `import torch
import torch.nn as nn

conv = nn.Conv2d(3, 8, 3, padding=1)
hwc = torch.arange(2 * 4 * 4 * 3, dtype=torch.float32).view(2, 4, 4, 3)

# 顺序错的张量常常"尺寸刚好合法"，view 更是连报错的机会都不给
wrong = hwc.view(2, 3, 4, 4)
right = hwc.permute(0, 3, 1, 2)
print("view keeps bytes:", tuple(wrong.shape), "first 4 flat:", [float(v) for v in wrong.flatten()[:4]])
print("permute really moves:", tuple(right.shape), "first 4 flat:", [float(v) for v in right.flatten()[:4]])

x = right.contiguous()
print("conv ok", tuple(conv(x).shape))
try:
    conv(hwc)
except RuntimeError as err:
    # 这条报错在说通道数，不在说你想问的"我的图为什么是碎的"
    print("rejected:", str(err)[:66])

# 池化 vs 全局池化：一个保留局部最强响应，一个把空间整体抹平
print("maxpool", tuple(nn.MaxPool2d(2)(conv(x)).shape))
print("gap", tuple(nn.AdaptiveAvgPool2d(1)(conv(x)).shape))
# 展平头与 GAP 头的参数量差多少（512 通道、8x8 分辨率、10 类）
print("flatten head", 512 * 8 * 8 * 10 + 10, "gap head", 512 * 10 + 10)`,
      pit: "用 `view` 换轴。view 只重新解释同一块内存，把 (B,H,W,C) 说成 (B,C,H,W) 时元素总数不变所以一句错都不报，但每个像素的通道已经被打散到不同空间位置上——模型收到的是噪点图。换轴顺序必须 `permute`/`transpose`，需要连续内存时再补 `contiguous()`；改完之后**画一张图肉眼看看**，这一步比任何断言都直接。",
      pit_en: "Reordering axes with view. view only re-reads the same buffer, so describing (B,H,W,C) as (B,C,H,W) keeps the element count and raises nothing - while every pixel's channels have been smeared across unrelated positions and the model is being handed noise. Axis order changes go through permute/transpose, with contiguous() if a view is needed afterwards, and the check afterwards is to render one image and look at it, which beats any assertion.",
      ex: {
        q: "为什么「通道数越多、分辨率越小」时总计算量反而大致不变？增加通道还有什么意义？",
        a: "因为每层的乘加数约等于 k²·Cin·Cout·H·W，把 H·W 除以 4 的同时把通道乘 2，两边相抵后总量近似守恒；增加通道买的是「同一分辨率下能记住多少种特征」，也就是表示宽度，而不是视野大小。",
        q_en: "If more channels at lower resolution leaves total compute roughly flat, what do extra channels buy?",
        a_en: "Per-layer work is about k*k*Cin*Cout*H*W, so dividing H*W by four while multiplying channels by two roughly cancels. Extra channels buy representational width - how many distinct features can be tracked at a given position - not a wider view of the image."
      }
    },

    "dl3-3": {
      min: 13,
      summary: [
        "所有现代视觉网络都是同三段：卷积块（conv → 归一化 → 激活，重复若干次）堆到很深 → 全局池化把空间抹平 → 线性头出类别。看懂这个骨架之后，LeNet 到 ResNet 的差别只是「块内怎么排、块间怎么连」。",
        "深度是买来的、不是白给的：VGG 用 16~19 层证明「更深确实更强」，代价是参数几乎全堆在第一层全连接（7·7·512·4096 ≈ 1 亿），这也直接催生了后来用全局平均池化替换展平头的做法。",
        "BatchNorm 比很多「新结构」更早地改变了可训练深度：它把每层输入的均值方差钉住，于是损失面更平滑、学习率可以开得更大、初始化不再敏感。回看历史，ResNet 之前让 CNN 从 8 层走到几十层的其实是归一化。",
        "ResNet 的残差 y = F(x) + x 做对了两件事：一是把目标从「学一个映射」改成「学一个修正量」，恒等映射落在 F=0 这个容易到达的点上；二是让 ∂y/∂x = I + ∂F/∂x，链式法则里多出一条不乘权重的恒等捷径。这就是 dl1-5 那条公式在视觉上的兑现。",
        "残差用错的三种典型：通道对不上时捷径必须加 1×1 投影，否则 add 会靠广播得到一个「尺寸恰好合法」的错结果；把 add 写成 cat 会让通道逐块翻倍、后续层全部要跟着改；以及 pre-activation（先 norm+relu 再进卷积）和 post-activation 的顺序混用，两者梯度行为不同，同一个模型里混着写很容易训不动。",
        "bottleneck（1×1 降维 → 3×3 → 1×1 升维）存在的理由是省计算：把 3×3 那一步的通道从 256 压到 64，那层的乘加数就除以 4。ResNet-50 的「50」绝大部分是这种结构；同时它也是迁移学习里最常用的骨干，因为它的输出特征既语义充分又便宜。",
        "层数不是越深越好，152 层相对 50 层的增益远小于它的工程代价（显存、训练时间、调试难度）。选骨干的判断依据只有一条：你的数据量与预算能否喂饱它——小数据上更深往往只是更容易过拟合。",
        "衔接：结构会选了，但小数据集上从零训 50 层几乎必然失败，所以下一节 dl3-4 谈「站在别人训好的权重上」以及增强为什么不能随便加。"
      ],
      summary_en: [
        "Every modern vision network is the same three segments: convolutional blocks (conv, normalise, activate, repeated) stacked deep, global pooling to flatten space, then a linear head. Once that skeleton is visible, the difference from LeNet to ResNet is only how the inside of a block is arranged and how blocks are wired.",
        "Depth is bought, not free: VGG proved with 16-19 layers that deeper really is better, at the price of dumping almost all parameters into the first fully connected layer (7*7*512*4096, about 100 million), which is exactly what motivated replacing the flatten head with global average pooling.",
        "BatchNorm changed trainable depth earlier than most 'new architectures' did: pinning each layer's mean and variance smooths the loss surface, lets the rate run larger and makes initialisation irrelevant. In hindsight it was normalisation, not ResNet, that carried CNNs from eight layers to several dozen.",
        "y = F(x) + x gets two things right. It changes the objective from 'learn a mapping' to 'learn a correction', so the identity map sits at the easily reachable point F = 0; and it makes dy/dx = I + dF/dx, adding an identity shortcut that multiplies no weights. That is dl1-5's formula cashed out in vision.",
        "Three ways to misuse a residual: when channels differ the shortcut needs a 1x1 projection, otherwise the addition leans on broadcasting and produces a legal-shaped but wrong result; writing cat instead of add doubles channels block after block and breaks every later layer; and mixing pre-activation (norm and relu before the convolution) with post-activation in one model, even though their gradient behaviour differs, is a reliable way to end up with something that will not train.",
        "The bottleneck (1x1 down, 3x3, 1x1 up) exists to save compute: squeezing the 3x3 step from 256 to 64 channels divides that layer's multiply-adds by four. Most of ResNet-50's fifty layers are this shape, which is also why it is the workhorse transfer-learning trunk - semantic features at a bargain.",
        "Deeper is not better by default: 152 layers buy far less than 50 while costing far more in memory, wall-clock time and debuggability. The only honest criterion for a trunk is whether your data and budget can feed it; on small data, more depth usually means more overfitting.",
        "Bridge: you can now pick a structure, but training fifty layers from scratch on a small dataset nearly always fails, so dl3-4 is about standing on somebody else's trained weights and about why augmentation cannot be added freely."
      ],
      code: `import torch
import torch.nn as nn

class Block(nn.Module):
    def __init__(self, c):
        super().__init__()
        self.conv1 = nn.Conv2d(c, c, 3, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(c)
        self.conv2 = nn.Conv2d(c, c, 3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(c)

    def forward(self, x):
        # pre-activation：先 norm+relu 再进卷积，梯度路径与 post-activation 不同
        y = torch.relu(self.bn1(self.conv1(x)))
        y = self.bn2(self.conv2(y))
        return torch.relu(y + x)

plain = nn.Sequential(nn.Conv2d(8, 8, 3, padding=1, bias=False), nn.BatchNorm2d(8), nn.ReLU(),
                      nn.Conv2d(8, 8, 3, padding=1, bias=False), nn.BatchNorm2d(8))
x = torch.randn(4, 8, 16, 16)
print("residual", sum(p.numel() for p in Block(8).parameters()),
      "plain", sum(p.numel() for p in plain.parameters()), "same weights, different wiring")

# 通道对不上时必须给捷径配 1x1 投影，否则 add 只能靠广播硬凑
proj = nn.Conv2d(8, 16, 1, bias=False)
print("shortcut projection turns 8 channels into", tuple(proj(x).shape))

# 小 batch 下 BatchNorm 会直接罢工：一个样本没有方差可估
bn = nn.BatchNorm2d(8)
bn.train()
try:
    bn(torch.randn(1, 8, 16, 16))
except ValueError as err:
    print("batch of one in train mode:", str(err)[:62])`,
      pit: "把残差的 `+ x` 写成 `torch.cat([y, x], 1)` 并且只改了后续第一层的通道数：前面几层照样跑、参数照样动、loss 照样降，但通道每过一块就翻一倍，越往后越吃显存，而且捷径被稀释。这类「也能训」的结构错误只能靠打印每层形状与参数量发现——所以 `sum(p.numel() for p in model.parameters())` 这一行值得常驻在你的训练脚本开头。",
      pit_en: "Writing the residual as torch.cat([y, x], 1) and adjusting only the very next layer's channel count: earlier blocks still run, parameters still move, loss still falls, but channels double at every block, memory climbs downstream and the shortcut gets diluted. Structural errors of this 'it also trains' kind surface only by printing per-layer shapes and counts, which is why sum(p.numel() for p in model.parameters()) deserves a permanent place at the top of the training script.",
      ex: {
        q: "为什么 ResNet 能让 100 层以上的网络训练起来，而不只是「理论上不消失」？",
        a: "因为恒等捷径同时改善了前向与反向：前向上未修正的信号可以原封不动传到深层，浅层学到的特征不会被后面的层冲散；反向上至少有一条不经过任何权重矩阵的通路，梯度下限被抬起来。两者叠加才让深网的起点（F≈0 时）就是「已经能跑通恒等映射」，训练只需要在这个好起点上做修正。",
        q_en: "Why does ResNet make 100+ layer networks trainable, beyond the theory that gradients merely stop vanishing?",
        a_en: "Because the identity improves the forward pass as well: unmodified signal reaches deep layers intact, so early features are not washed out, and the gradient gains at least one path that touches no weight matrix. Together they mean the starting point of a deep network - where F is near zero - already implements the identity map, so training only has to correct a good solution rather than find one."
      }
    },

    "dl3-4": {
      min: 14,
      summary: [
        "迁移学习的三步与判据：换掉最后的分类头 → 先只训头（主干冻结）跑几十个 epoch → 数据够多才用小学习率解冻整体。数据越少越该只训头；几千张图去微调整个 ResNet-50，通常只是把预训练权重换成过拟合。",
        "冻结主干最坑的地方在框架层：`p.requires_grad_(False)` 只关掉梯度，**不关掉 BatchNorm 的运行统计更新**。冻结层只要还处在 train 模式，它的 running_mean/running_var 就会被你的小数据重新写一遍，把预训练时积累的统计量破坏掉——所以必须把那几层显式切成 eval()。这正是「我明明冻了主干，效果却一塌糊涂」的标准答案。",
        "预训练权重的「契约」不只是权重本身，还包括预处理：ImageNet 的 resize 尺寸、RGB 顺序、以及那组 mean/std 归一化。跳过归一化等于给模型看一张它从未见过的分布，浅层立刻饱和；把 BGR 当 RGB 喂进去，分数会低到你想不通。这些常数要当成权重的一部分来对待。",
        "数据增强不许改变标签语义：左右翻转对「这是不是猫」成立，对「方向盘在左还是右」「这条血管在左侧还是右侧」「OCR 的文字」就是错的；数字 6 旋转 180° 变成另一个可读符号。写增强之前先回答一个问题——这个标签对哪些变换不变？答不上来就别加。",
        "增强要放在 Dataset 的 `__getitem__` 里每 epoch 现算，而不是在加载后一次性做完。一次做完等于把随机性固化，实质上把数据集缩小成「增强后的那一份」；放在取数时才算得出「同一张图每个 epoch 看到不同版本」的效果。代价是 CPU 解码与增强会先于 GPU 成为瓶颈（呼应 dl2-5）。",
        "增强强度是超参，而且能致命：过强的色彩抖动、过大的随机裁剪比例、MixUp/CutMix 这类混合标签的操作，都会让验证分数长时间不动。尤其是 MixUp——它把两张图的标签按 λ 混起来，你如果还在用只接受整数类别的交叉熵，训的是错的目标，必须先换成 soft-label 损失。",
        "验证集永远不做随机增强，只做确定性的 resize 与 center crop。给验证集加随机性等于把评估变成一个随机变量，两个 epoch 的分数差可能纯粹来自随机裁剪的运气。测试时的多裁剪平均（TTA）是另一回事，可以用，但必须如实写清「这个数字带 TTA」，否则别人复现不出来。",
        "什么时候分数是假的（迁移学习专属两条）：一是为了「统一归一化」在全量数据上统计 mean/std，把验证集的信息混进了预处理；二是近重复图片（连拍帧、同一张图的不同裁剪/尺寸）同时落在训练与验证切分里。这两条正是 ml3 的泄漏在视觉里的形态，而且都不容易被察觉。"
      ],
      summary_en: [
        "Transfer learning is three steps with one criterion: swap the classification head, train only the head with the trunk frozen for a few dozen epochs, then unfreeze with a small rate if - and only if - you have enough data. The less data you have, the more you should keep training only the head; fine-tuning all of ResNet-50 on a few thousand images usually just converts pretrained weights into overfitting.",
        "The nastiest part of freezing lives at the framework level: requires_grad_(False) stops gradients but does not stop BatchNorm updating its running statistics. Any frozen layer still in train mode rewrites running_mean and running_var from your small dataset, destroying what pretraining accumulated - so those modules must be put into eval() explicitly. That is the textbook answer to 'I froze the backbone and somehow made everything worse'.",
        "A pretrained model's contract is not only its weights but its preprocessing: the resize length, the RGB order, and that specific mean/std normalisation. Skipping normalisation shows the network a distribution it never saw and saturates the early layers; feeding BGR where RGB is expected costs you accuracy you cannot explain. Treat those constants as part of the checkpoint.",
        "Augmentation may not change label semantics: horizontal flipping is fine for 'is this a cat' and wrong for 'is the steering wheel left- or right-hand', 'which side is this artery on', or any text recognition; rotating a digit 6 by 180 degrees turns it into something else. Before adding a transform, answer one question - which transformations does this label actually ignore? If you cannot answer, do not add it.",
        "Augmentation belongs inside the Dataset's __getitem__, evaluated per epoch, not applied once after loading. Doing it once freezes the randomness and effectively shrinks your dataset to exactly that one transformed copy; only per-access application gives the intended 'same image, different view every epoch'. The cost is that CPU decode and augmentation become the bottleneck before the GPU does (dl2-5 again).",
        "Augmentation strength is a hyper-parameter that can kill a run: excessive colour jitter, too aggressive random cropping, or label-mixing tricks like MixUp and CutMix all leave the validation score flat for a long time. MixUp especially blends two labels by lambda, so if your loss still insists on an integer class index you are optimising the wrong objective - a soft-label loss has to come first.",
        "The validation set never gets random augmentation; only deterministic resize and centre crop. Randomising validation turns the metric into a random variable whose epoch-to-epoch difference may be pure crop luck. Test-time augmentation by averaging several crops is a different, legitimate thing - but you must report that the number includes TTA or nobody can reproduce it.",
        "When the score is fake (two transfer-specific cases): computing mean/std over the full dataset 'for consistent normalisation', which folds validation information into the preprocessing; and near-duplicate images - burst frames, different crops or resolutions of the same photo - landing on both sides of the split. These are exactly the ml3 leaks in their visual form, and both are easy to miss."
      ],
      code: `import torch
import torch.nn as nn

torch.manual_seed(0)
backbone = nn.Sequential(nn.Conv2d(3, 16, 3, padding=1), nn.BatchNorm2d(16), nn.ReLU(),
                         nn.AdaptiveAvgPool2d(1), nn.Flatten())
model = nn.Sequential(backbone, nn.Linear(16, 4))

# 冻结主干只是关掉梯度，BN 的运行统计仍然会在 train 模式下被你的数据改写
for p in backbone.parameters():
    p.requires_grad_(False)
model.train()
before = backbone[1].running_var.detach().clone()
for _ in range(3):
    model(torch.randn(8, 3, 16, 16)).pow(2).mean().backward()
print("frozen but BN moved:", not torch.equal(before, backbone[1].running_var))

# 要真的冻住，那几层还得单独切回 eval
backbone.eval()
before = backbone[1].running_var.detach().clone()
for _ in range(3):
    model(torch.randn(8, 3, 16, 16)).pow(2).mean().backward()
print("after eval() BN holds:", torch.equal(before, backbone[1].running_var))

# 预训练归一化是权重契约的一部分：尺度差 255 倍会让浅层直接饱和
raw = torch.rand(2, 3, 32, 32) * 255.0
mean = torch.tensor([0.485, 0.456, 0.406]).view(1, 3, 1, 1)
std = torch.tensor([0.229, 0.224, 0.225]).view(1, 3, 1, 1)
norm = (raw / 255.0 - mean) / std
print("raw abs mean", round(float(raw.abs().mean()), 2), "normalised", round(float(norm.abs().mean()), 3))`,
      pit: "把验证集也送进去算归一化常数（或者用 `StandardScaler` 在全量上 fit），然后在报告里写下那份漂亮的分数：预处理已经见过验证集，指标越高越可疑。正确做法是统计量只在训练切分上算，然后原样应用到验证与测试；对图像来说，用预训练权重自带的那组 mean/std 通常既更准又天然没有泄漏。",
      pit_en: "Computing normalisation constants with the validation set in the pool (or fitting a StandardScaler on everything) and then reporting the flattering number: the preprocessing has already seen validation, so the higher the score the more suspicious it is. Estimate statistics on the training split only and apply them unchanged; for images, the pretrained model's own mean/std is both more accurate and leak-free by construction.",
      ex: {
        q: "为什么「冻结主干」必须同时做两件在别处不会同时出现的事？",
        a: "因为 PyTorch 把「学不学」和「怎么算」拆成了两个开关：requires_grad 管前者（要不要参与求导、要不要被优化器收进去），train/eval 管后者（dropout 要不要丢、BatchNorm 用 batch 统计还是 running 统计）。冻结一个模块时两个都得处理，否则会出现「不学梯度但统计量照样被改写」这种半冻结状态。",
        q_en: "Why does freezing a backbone require two actions that do not normally come in pairs?",
        a_en: "Because PyTorch splits 'is it learned' from 'how does it compute': requires_grad governs the first (gradients and whether the optimiser collects it), train/eval governs the second (whether dropout fires, whether BatchNorm uses batch or running statistics). Freeze one module and you must set both, or you end up half-frozen - no gradients, but statistics still being rewritten."
      }
    },

    "dl3-5": {
      title: "综合重构：一个视觉任务从数据到指标的自查表",
      title_en: "Synthesis: A Vision Checklist from Pixels to Metrics",
      min: 15,
      target: "接到一个图像任务时，能在动手前定下任务类型、指标与数据切分规则，并用一张自查表把「不动 / 崩 / 假分数」三类问题各自的第一嫌疑点列出来。",
      target_en: "Given an image task, fix the task type, metric and split rules before writing code, and use one checklist to name the prime suspect for each of the three failure families - stalled, exploding, fake score.",
      summary: [
        "先定任务再选结构：分类（一张图一个标签）、检测（若干个框加类别，必须定位）、分割（每个像素一类）。三者的输出形状、标注格式、指标、增强策略、甚至「能不能随机裁剪」都不一样——把检测当分类做（只判「图里有没有」）是最贵的一类方向错误，因为业务真正要的是位置。",
        "指标必须跟着任务定，而且要背下来：分类看 top-1/top-5 与精确率-召回；检测看给定 IoU 阈值下的 mAP（@0.5 与 @0.5:0.95 是两个难度完全不同的数字）；分割看 mIoU/Dice。同一份预测换个指标可以同时变好和变差，所以换指标必然要换基线重跑，不能只换个数字。",
        "数据侧清单四问：类别分布是否失衡（决定损失要不要加权）；标注一致性如何（同一批人还是多个人标的，分割边界差异会直接体现在 IoU 上）；有没有近重复（连拍帧、同图不同分辨率，最容易跨切分泄漏）；尺寸分布长什么样（决定 resize 与 batch 内是否要 padding）。回答完再画一张 8×8 的增强网格肉眼看一遍——这是发现「增强把标签改坏了」的唯一低成本手段。",
        "结构侧清单：输入尺寸能不能被下采样链整除（分割网络常做 16/32 倍下采样，输入不是 32 的倍数时要么报错要么被悄悄 pad，边缘指标就糊在这里）；感受野是否大于目标（卫星图里判一辆车，主干感受野太大反而会把上下文混进来）；参数量与显存预算（dl2-5 那笔账）。",
        "训练侧清单把 dl2 全部复用：主干与头分两组学习率（主干小、头大）、冻结主干时切 eval、混合精度与梯度裁剪、以及「先只训头若干 epoch 再解冻」的两阶段策略。这里最常见的「不动」不是超参问题，而是预处理违约——归一化那组常数与权重不匹配。",
        "可视化与 Grad-CAM 的直觉：把最后一层特征图的通道梯度当作权重，去加权那张图的激活，就得到「模型在看哪里」。它最有用的地方是证伪——热力图落在水印、标尺、拍摄背景上，说明数据里有捷径；但它不能证明模型是对的：CAM 看着漂亮、模型其实在记「这张照片是哪个科室拍的」，是极常见的情况。",
        "三张表的视觉版收口：假分数——近重复泄漏、用验证集算统计量、指标口径不同（@0.5 与 @0.5:0.95 混着报）、类别不平衡下只报准确率；崩——fp16 下检测回归目标的极端值、异常标注尺寸（框超出图像边界）、学习率对解冻后的主干太大；不动——冻结的 BN 在改写统计、归一化契约违约、增强强到把标签读不出来。",
        "指向下一章：CNN 把「空间」处理得很干净，但它有两个前提在序列上都不成立——长度固定（或必须补齐）与「相邻才有关系」。dl4 处理的就是没有这两条假设时该怎么办：顺序、时间、以及变长。"
      ],
      summary_en: [
        "Decide the task before the architecture: classification (one label per image), detection (several boxes plus classes, position is the point) and segmentation (a class per pixel) differ in output shape, annotation format, metric, augmentation policy, and even in whether random cropping is allowed. Doing detection as classification - only deciding 'is it in the picture' - is the most expensive directional error, because the business wanted the location.",
        "Metrics follow the task and should be memorised: top-1/top-5 with precision-recall for classification; mAP at a stated IoU threshold for detection, where @0.5 and @0.5:0.95 are two very different difficulties; mIoU or Dice for segmentation. The same predictions can improve on one metric and worsen on another, so changing the metric means rerunning the baselines, not just quoting a new number.",
        "Four data questions: is the class distribution imbalanced (decides whether the loss needs weights); how consistent are the annotations (one annotator or many - on segmentation that difference shows up directly in IoU); are there near-duplicates (burst frames, the same photo at different resolutions, the easiest way to cross a split); and what does the size distribution look like (decides resize and intra-batch padding). Then render an 8x8 grid of augmented samples and look at it - the only cheap way to catch augmentation that has corrupted the label.",
        "Structure questions: does the input size divide by the downsampling chain (segmentation nets often stride by 16 or 32, and an input that is not a multiple either errors out or gets silently padded, which is exactly where boundary metrics bleed); is the receptive field matched to the object size (detecting a car in satellite imagery with an enormous field of view drowns the target in context); and the parameter and memory budget from dl2-5.",
        "The training list is reused wholesale from dl2: separate learning rates for trunk and head, eval() on frozen layers, mixed precision and gradient clipping, and a two-stage schedule of 'head only for a few epochs, then unfreeze'. The most common 'stalled' here is not a hyper-parameter problem but a preprocessing breach - normalisation constants that do not match the weights.",
        "The Grad-CAM intuition: use each channel's gradient at the last feature map as a weight over that map's activations and you get 'where the model looked'. Its value is falsification - a heatmap sitting on the watermark, the ruler or the background proves there is a shortcut in the data. It cannot prove the model is right: a beautiful CAM on a model that is really memorising which ward the photo came from is a common story.",
        "The three tables, vision edition. Fake scores: near-duplicate leakage, statistics computed with validation included, mixed metric definitions (reporting @0.5 next to @0.5:0.95), accuracy under class imbalance. Exploding: extreme regression targets under fp16, annotation boxes outside the image bounds, a learning rate too large once the trunk is unfrozen. Stalled: a frozen-but-still-updating BatchNorm, a broken normalisation contract, augmentation strong enough that the label is unreadable.",
        "Bridge to dl4: CNNs handle space beautifully, but on two assumptions that sequences break - fixed length (or padding to one) and 'only neighbours matter'. dl4 is what to do when neither holds: order, time, and variable length."
      ],
      code: `import torch

def receptive_field(stages):
    # stages 由浅到深给 (kernel, stride)；r 是感受野，j 是累计步长
    r, j = 1, 1
    for k, s in reversed(stages):
        r += (k - 1) * j
        j *= s
    return r

print("two 3x3 s1  :", receptive_field([(3, 1), (3, 1)]))
print("one 5x5 s1  :", receptive_field([(5, 1)]))
print("3x3 s1 + 3x3 s2 + 3x3 s1:", receptive_field([(3, 1), (3, 2), (3, 1)]))

def iou(a, b):
    # IoU 是检测指标的最小单元：交集比并集，通常要到 0.5 才算命中一个目标
    inter = (torch.minimum(a[2:], b[2:]) - torch.maximum(a[:2], b[:2])).clamp(min=0).prod()
    union = (a[2:] - a[:2]).prod() + (b[2:] - b[:2]).prod() - inter
    return float(inter / union)

print("IoU", round(iou(torch.tensor([0., 0., 2., 2.]), torch.tensor([1., 1., 3., 3.])), 4))
print("IoU", round(iou(torch.tensor([0., 0., 2., 2.]), torch.tensor([1.9, 1.9, 3.9, 3.9])), 4))

# 三种任务的输出形状完全不同，混用等于换了一件事
print("class logits", tuple(torch.randn(4, 10).shape),
      "| boxes", tuple(torch.rand(4, 6, 4).shape),
      "| per-pixel classes", tuple(torch.randn(4, 10, 32, 32).shape))`,
      pit: "拿 mAP@0.50 与 mAP@0.50:0.95 互相替代着汇报，或者换评估实现（不同代码库的 NMS 阈值、面积定义、是否忽略截断目标）之后不和旧数字并列重跑：这两个数常常差十几个点，于是「我们比上一版好」和「换了个评测器」在表格里长得一模一样。任何指标都必须同时钉死「定义 + 实现 + 版本」。",
      pit_en: "Reporting mAP@0.50 and mAP@0.50:0.95 interchangeably, or switching evaluation implementations (different NMS thresholds, area definitions, whether truncated objects count) without rerunning the old numbers side by side: the two commonly differ by ten-plus points, so 'better than last version' and 'different evaluator' look identical in the table. Every metric needs its definition, implementation and version pinned alongside it.",
      ex: {
        q: "为什么「画一张增强样本网格肉眼看」这件事的收益高于再多调一轮超参？",
        a: "因为它一次性验证的是整条数据假设——标签语义是否被增强破坏、边界是否被裁掉、归一化后图像是否还是能看的分布；这些都是「结构性错误」，超参搜索既看不见也修不了，而它们恰恰是分数长期不动的最常见根因。",
        q_en: "Why does eyeballing one grid of augmented samples pay off better than another round of hyper-parameter search?",
        a_en: "Because it checks the whole data hypothesis at once - whether augmentation broke label semantics, cropped away the object, or left an unrecognisable distribution after normalisation. Those are structural faults that a hyper-parameter sweep can neither see nor fix, and they are the usual reason a score never moves."
      }
    },

    /* ===================== dl4 序列模型与注意力 ===================== */
    "dl4-1": {
      min: 13,
      summary: [
        "为什么全连接吃不了序列：它的输入维度是写死的，而文本、语音、时序的长度天然可变；补齐到最长既浪费参数又抹掉了位置语义（同一个权重在第 3 位和第 300 位代表完全不同的东西）。RNN 的答案是「同一组权重在时间上复用」——这其实就是序列版的权值共享。",
        "隐状态是这条设计的核心：h_t = act(W_h·h_{t−1} + W_x·x_t + b)。它是一张固定长度的「记忆纸条」，容量恒定、每个时间步都被覆写一次。这既让 RNN 能处理任意长度，也正是它遗忘的原因——纸条大小不随输入增长。",
        "串行是结构自带的：第 t 步依赖 t−1，因此训练一个长度 T 的序列，墙钟时间随 T 线性增长、且无法像卷积那样把 T 摊平成并行的大矩阵乘。「并行度」这一条是后来 Transformer 胜出的直接工程原因，比表达能力更早发挥作用。",
        "梯度沿时间连乘是同一条公式换了变量：∂h_T/∂h_t = Π_{k=t+1..T} W_hᵀ·diag(act′(z_k))。这里「层数」等于时间步数，一条 200 词的序列就等于一个 200 层网络——所以 RNN 的消失/爆炸比前馈网络更凶，也更早成为它的天花板。",
        "判别方法还是逐层打印梯度范数（dl1-5 那招）：对短序列正常、长序列梯度趋零，就是沿时间消失；梯度范数出现周期性尖峰、loss 突然 NaN，就是爆炸。爆炸的第一处置是 clip_grad_norm_（1~5 之间起步），消失则要么入门要么加残差。",
        "四种输入/输出形态要分得清：一对一（定长图像分类）、多对一（整句情感、时序预测）、多对多（逐帧标注、词性）、序列到序列（翻译）。多对一里「取最后一个 h」还是「对全部 h 做均值」差别可观（后者常更稳），要当成超参试而不是想当然。",
        "双向 RNN 只能用在你已经拥有整条序列的任务上（分类、标注、检索编码）；生成任务不可能双向，因为后文还没生成。这一条直接决定了 dl5-4 里 BERT 类与 GPT 类的分工边界。",
        "衔接：本章前置是 dl1（激活与初始化、梯度连乘）和 dl2（变长数据、mask 与 batch 的组织）。门的想法顺理成章——给这条纸条装一个可学习的开关，下一节 dl4-2 展开。"
      ],
      summary_en: [
        "A dense layer cannot eat a sequence because its input width is fixed while text, audio and time series are not. Padding everything to the longest wastes parameters and erases position, since the same weight means different things at slot 3 and slot 300. The RNN answer is to reuse one weight set across time - which is really weight sharing applied to the sequence axis.",
        "The hidden state is the core of that design: h_t = act(W_h h_{t-1} + W_x x_t + b), a memory slip of fixed size that is overwritten once per step. That single choice is what lets an RNN take any length and what makes it forget - the slip never grows with the input.",
        "Serialism is structural: step t needs t-1, so training a length-T sequence costs wall-clock time linear in T and cannot be flattened into one big parallel matmul the way a convolution can. Parallelism, not expressiveness, is the more immediate engineering reason Transformer later won.",
        "Gradients multiplying along time is the same formula with a changed variable: dh_T/dh_t is a product over steps of W_h transpose times a diagonal of activation derivatives. Here 'number of layers' equals the number of time steps, so a 200-word sentence is a 200-layer network - which is why RNNs hit vanishing and exploding gradients harder, and earlier, than feedforward nets.",
        "The diagnosis is still per-layer gradient norms (the dl1-5 move): fine on short sequences and shrinking to zero on long ones means vanishing in time; periodic spikes in the norm and a sudden NaN mean exploding. Exploding gets clip_grad_norm_ (start between 1 and 5); vanishing needs gates or residuals.",
        "Keep the four shapes straight: one-to-one (fixed-length classification), many-to-one (sentence sentiment, time-series forecasting), many-to-many (per-frame labelling, POS tagging) and sequence-to-sequence (translation). Inside many-to-one, taking the last h versus averaging all h can differ enough that it deserves to be a hyper-parameter, not an assumption.",
        "A bidirectional RNN is only legal where the whole sequence already exists - classification, labelling, retrieval encoders; generation can never be bidirectional because the future tokens do not exist yet. That single line draws the BERT-versus-GPT division of labour in dl5-4.",
        "Bridge: this chapter builds on dl1 (activations, initialisation, products of gradients) and dl2 (variable-length data, masks, batching). The idea of a gate follows naturally - put a learnable switch on that memory slip - which is dl4-2."
      ],
      code: `import torch
import torch.nn as nn

torch.manual_seed(0)
# 定长约束：全连接层的输入宽度是写死的，变长文本必须先补齐
fc = nn.Linear(50, 10)
try:
    fc(torch.randn(4, 37))
except RuntimeError as err:
    print("fixed width:", str(err)[:58])

def chain_gain(std, T):
    # 把 h_0 当成叶子，它的梯度就是那条沿时间连乘链的总读数
    torch.manual_seed(1)
    wh = torch.randn(8, 8) * std
    u = torch.randn(8, 8) * 0.5
    x = torch.randn(T, 8, 8)
    h0 = torch.zeros(8, requires_grad=True)
    h = h0
    for t in range(T):
        # 每一步都乘同一个 W_h：时间步在这里扮演的就是"层数"
        h = torch.tanh(h @ wh + x[t] @ u)
    h.sum().backward()
    return float(h0.grad.detach().norm())

for std in (0.5, 0.9, 1.4):
    print("W_h std", std, "| T=10 ->", "%.1e" % chain_gain(std, 10), "| T=60 ->", "%.1e" % chain_gain(std, 60))

# 双向只能用在"整条序列都在手上"的任务
birnn = nn.GRU(4, 16, batch_first=True, bidirectional=True)
out, _ = birnn(torch.randn(2, 9, 4))
print("bidirectional out", tuple(out.shape), "- every position sees both sides")`,
      pit: "把「序列模型」和「时间序列预测」划等号，于是不做平稳性检查就直接开训，结果模型学到的主要是这条序列的均值漂移。RNN/LSTM 表达的是「给定过去预测下一步」的条件关系，趋势、季节性、以及样本切分的时序边界（绝不能随机打乱）都得先处理干净；否则验证分数漂亮，只是因为你把未来放进了训练。",
      pit_en: "Equating 'sequence model' with 'time-series forecasting', training without checking stationarity, and ending up with a model that mostly reproduces the drift in the mean. Recurrent nets learn a conditional 'given the past, what comes next' relationship; trend, seasonality and above all the temporal split (never shuffle a time series) have to be handled first - otherwise the validation score is pretty only because the future leaked into training.",
      ex: {
        q: "为什么「隐状态容量固定」既是优点又是缺陷，而不是单纯的实现偷懒？",
        a: "因为它是唯一一个让模型能接受任意长度输入的机制：无论输入 5 步还是 5000 步，都压缩到同一个向量里，参数量与长度无关。而代价正好来自同一件事——信息通道宽度不随输入增长，所以长输入的总信息量必然被丢弃一部分，这是容量约束，不是训练不足。",
        q_en: "Why is a fixed-capacity hidden state both the feature and the flaw, rather than lazy engineering?",
        a_en: "It is the one mechanism that lets a model accept any length: 5 steps or 5000 both compress into the same vector, so parameters stay independent of length. The cost comes from that very property - the channel width does not grow with the input, so a long input must lose information. That is a capacity law, not insufficient training."
      }
    },

    "dl4-2": {
      min: 13,
      summary: [
        "LSTM 的关键不是「有三个门」，而是多了一条 cell state：c_t = f_t ⊙ c_{t−1} + i_t ⊙ c̃_t。这是一条几乎只做加减的传送带，遗忘门接近 1 时梯度可以沿着它穿过许多步而几乎不衰减——这正是残差思想在序列上的版本。",
        "三个门各在解决一个具体问题：遗忘门决定旧记忆保留多少、输入门决定新信息写入多少、输出门决定这份记忆此刻被读出来多少。它们都是 sigmoid 加权的 0~1 标量场，处处可微，所以「记多少、忘多少」本身变成了可被梯度学习的对象——这是相对 RNN 硬覆写的本质改变。",
        "遗忘门偏置初始化为 1（或 2）是 LSTM 能训起来的隐藏要点：默认偏置为 0 时 sigmoid 给出 0.5，等于一开始就默认「忘掉一半」，早期梯度被这条衰减链磨掉，长依赖根本学不到。把 bias 的那一段抬到 1 后起步阶段默认「先记住」。忘记这行代码的小 LSTM 常常表现为「完全学不到 20 步以外的东西」。",
        "GRU 把它简化成两个门（重置门、更新门）并去掉独立的 cell state，参数量约为 LSTM 的 3/4；在小数据上常常持平甚至更好，因为它少一组参数去喂。工程上把 GRU 当默认起点是合理决策，不是妥协。",
        "框架的 nn.LSTM 比你自己写 for 循环快 5~20 倍：cuDNN 把整个序列融合成几个大矩阵乘，而手写循环在 GPU 上被核启动开销支配。所以「结构一模一样、训练时间差一个数量级」通常不是随机数的问题，而是你在手写循环。",
        "变长序列必须打包：pack_padded_sequence / pad_packed_sequence。不打包时，padding 位置同样会被当成真实时间步更新隐状态，最终 h 里混进了「读了一串零之后」的状态；打包后每条序列只算自己的长度，h 才是真正的首/末步。批量还要求按长度降序排序（或者用 enforce_sorted=False 让框架代劳）。",
        "teacher forcing 与曝光偏差：训练时第 t 步的输入是**真值**的第 t−1 步，模型从不需要处理「自己前面错了怎么办」。推理时输入是自己的输出，一步错就顺着条件分布继续错下去，长序列上呈雪崩状。缓解手段是 scheduled sampling（按概率混入模型自己的输出），但它会让训练变不稳，通常最后再上。",
        "什么时候分数是假的（序列专属）：训练与验证都用 teacher forcing 算出的 loss，是「每步条件概率」的均值，它和自由运行生成的质量不同向。用这个数字去汇报「模型能写多好的句子」，是这一节最主要的坑。"
      ],
      summary_en: [
        "The heart of an LSTM is not 'three gates' but the extra cell state: c_t = f_t * c_{t-1} + i_t * c-tilde_t. That is a conveyor belt doing almost only addition and subtraction, so when the forget gate sits near one the gradient rides along it for many steps barely attenuated - the residual idea re-invented on the time axis.",
        "Each gate answers a specific question: forget decides how much old memory survives, input decides how much new information is written, output decides how much of that memory is read out right now. All three are differentiable sigmoid fields between 0 and 1, so 'how much to keep, how much to drop' becomes something gradients can learn - the real break from an RNN's hard overwrite.",
        "Initialising the forget-gate bias to 1 (or 2) is a hidden prerequisite for LSTM training: with the default bias of 0 the gate opens at 0.5, i.e. 'forget half of everything' from step one, and the early decay chain grinds long-range gradients to nothing. Raising that slice of the bias makes the default 'remember first'. A small LSTM missing that one line characteristically cannot learn dependencies beyond twenty steps.",
        "GRU compresses this into two gates (reset and update) with no separate cell state and about three quarters of the parameters, and on small data it often matches or beats LSTM precisely because there is less to feed. Treating GRU as the default starting point is sound engineering, not compromise.",
        "The framework's nn.LSTM runs 5-20 times faster than your hand-written loop because cuDNN fuses the whole sequence into a few large matmuls, while a python loop on a GPU is dominated by kernel launch overhead. When two identical architectures differ by an order of magnitude in wall-clock time, it is usually because somebody wrote a for loop.",
        "Variable lengths must be packed with pack_padded_sequence and pad_packed_sequence. Unpacked, padding positions update the hidden state like any real step, so the final h contains the state after chewing through a run of zeros; packed, each sequence only runs its own length and h really is its first/last step. Batching then wants lengths sorted descending, or enforce_sorted=False to let the framework handle it.",
        "Teacher forcing creates exposure bias: during training step t is fed the ground-truth step t-1, so the model never has to cope with its own earlier mistakes. At inference it is fed its own output, one wrong token derails the conditional distribution and the error compounds down long sequences. Scheduled sampling - mixing the model's own outputs in with some probability - helps but destabilises training, so it usually comes last.",
        "When the sequence score is fake: a loss computed with teacher forcing on both training and validation is an average per-step conditional likelihood and does not move with free-running generation quality. Quoting that number as 'how well the model writes' is this section's principal trap."
      ],
      code: `import torch
import torch.nn as nn

torch.manual_seed(0)
rnn = nn.RNN(4, 16, batch_first=True)
lstm = nn.LSTM(4, 16, batch_first=True)
x = torch.randn(3, 9, 4)
h_out, _ = rnn(x)
s_out, (hn, cn) = lstm(x)
print("rnn", tuple(h_out.shape), "lstm", tuple(s_out.shape), "cell", tuple(cn.shape))
print("lstm params", sum(p.numel() for p in lstm.parameters()), "rnn params", sum(p.numel() for p in rnn.parameters()))

# 遗忘门偏置默认是 0（sigmoid=0.5），起步就在"忘掉一半"
with torch.no_grad():
    # bias_hh 的后 1/4 段就是遗忘门那一段
    lstm.bias_hh_l0[16:32].fill_(1.0)
print("forget-gate bias now", lstm.bias_hh_l0[16:18].tolist())

# 变长：不打包的话，padding 步会继续改写隐状态
lens = torch.tensor([9, 4, 2])
packed = nn.utils.rnn.pack_padded_sequence(x, lens, batch_first=True, enforce_sorted=False)
h_pack = lstm(packed)[1][0][0].detach()
h_pad = lstm(x)[1][0][0].detach()
# 只有被补齐的那两条被污染，第一条长度正好等于 T，差值为 0
print("drift per sample:", [round(float((h_pack[i] - h_pad[i]).abs().max()), 4) for i in range(3)])`,
      pit: "打包之后忘了 `pad_packed_sequence`，或者把打包前的完整张量和打包后的输出混着用：形状看着差不多，但每条序列的时间轴已经不对齐，跨样本逐位置算 loss 时就把第 3 条序列的第 1 步当成第 7 步来罚。另一个同样常见的：`batch_first` 忘了设，默认布局是 (T, B, D)，于是「第一个维度是 batch」的一切假设全部落空——这类 bug 常常不报错，只是分数莫名其妙差一截。",
      pit_en: "Packing without later calling pad_packed_sequence, or mixing the padded input with the packed output: the shapes look close enough, but the time axes no longer line up per sequence, so a per-position loss punishes step 1 of the third sequence as if it were step 7. Equally common: forgetting batch_first, leaving the default layout (T, B, D) while every one of your assumptions says the first axis is the batch - often no error at all, just a score that is inexplicably worse.",
      ex: {
        q: "为什么「遗忘门偏置初始化」这么一个小改动能决定 LSTM 能不能学长依赖？",
        a: "因为 c_t = f_t·c_{t−1} + ... 里的 f_t 直接就是这条加法路径的乘数：初值为 0 时 f≈0.5，等价于每步把已存信息减半，20 步之后梯度只剩 1e-6 量级；偏置抬到 1 后 f≈0.73，同样的连乘要衰减一百步才降到那个水平，而这段窗口正是长依赖所在。它是把「默认行为」从遗忘改成保存。",
        q_en: "Why can such a small change as the forget-gate bias decide whether an LSTM learns long dependencies at all?",
        a_en: "Because f_t in c_t = f_t * c_{t-1} + ... is literally the multiplier on that additive path. With a zero bias, f is about 0.5, which halves stored information every step and leaves only 1e-6 of the gradient after twenty steps; with the bias at 1, f is about 0.73 and the same product takes roughly a hundred steps to decay that far - and that window is exactly where long dependencies live. The change is a switch of default behaviour, from forgetting to retaining."
      }
    },

    "dl4-3": {
      min: 14,
      summary: [
        "注意力就是「内容决定的加权求和」：α = softmax(QKᵀ/√d)，输出 αV。它与固定权重平均的区别在于权重由查询和键的内容现算，因此它能充当一次可微的软检索——这也是「注意力不是魔法，只是一个学出来的权重」这句话的准确说法。",
        "为什么要除以 √d：两个 d 维随机向量的点积方差约为 d。不缩放时，d=64 的分数会轻松达到十几，softmax 落进饱和区，梯度几乎为 0——于是「注意力一加就训不动」。这是 dl1-2 那个饱和问题在注意力里的重现，也是它最容易被忽略的一处数值细节。",
        "Q/K/V 三个投影各自的角色要分清：Q 是「我要找什么」，K 是「我有哪些可被匹配的特征」，V 是「匹配上之后我交付什么」。三者都来自同一个 x，但用三个不同的矩阵——如果省成一个（Q=K），注意力矩阵永远对称且对角占优，每个位置最强地注意自己，信息交流反而被压制。",
        "注意力一次解决了 RNN 的两个痛点：任意两个位置的距离都是 1（长依赖不再靠连乘存活），以及所有位置可并行计算（不再串行）。前者是表达能力的胜利，后者是工程上的胜利——而且第二点在扩大规模时更早成为决定因素（dl5-2 接这条）。",
        "软注意力处处可微所以能用梯度下降训；硬注意力（只挑一个位置）不可微，得走强化学习或直通估计（呼应 agi1）。历史上硬注意力输在训练成本上，而不是效果上。",
        "padding mask 必须加在 softmax **之前**，而且要用 −inf 量级的负数（实践中 `masked_fill(mask, float('-inf'))`），这样那些位置的 softmax 权重才严格为 0。加在 softmax 之后、或者只减一个小常数，padding 仍会分到可观的权重、稀释真实信号；更糟的是 loss 看起来照样下降。",
        "长度对齐是 bug 高发区：注意力分数张量的形状是 (B, h, T_q, T_k)，于是有两种 mask——(B,1,1,T_k) 屏蔽「被看的键」（padding），(1,1,T_q,T_k) 屏蔽「不允许看的未来位置」（因果）。把这两者的形状互换，广播会悄悄给你算出一个错的东西，而它不一定报错。",
        "衔接：注意力权重常被当作解释性证据，但权重大只说明「这一路的分数高」，不说明「这个输入在因果上重要」，多头平均之后更不可靠（dl3-5 的 Grad-CAM 同理）。下一节 dl4-4 把它装进 seq2seq，看看编码-解码结构里它到底补了哪块短板。"
      ],
      summary_en: [
        "Attention is a weighted sum whose weights come from content: alpha = softmax(QK^T / sqrt(d)) and the output is alpha V. Unlike a fixed averaging kernel, the weights are computed from the query and the keys on the spot, which makes it a differentiable soft retrieval - that is the precise meaning of 'attention is not magic, just learned weights'.",
        "The sqrt(d) is not cosmetic: the dot product of two random d-dimensional vectors has variance about d, so unscaled scores at d=64 routinely reach the teens, softmax saturates and the gradient collapses to almost nothing - which is exactly the experience of 'the moment I added attention, training froze'. It is dl1-2's saturation problem reappearing inside attention.",
        "Separate the three projections: Q is 'what am I looking for', K is 'what matchable features do I offer', V is 'what I hand over once matched'. All three come from the same x but through different matrices. Merge them into one (Q = K) and the score matrix is permanently symmetric with a dominant diagonal, so every position attends hardest to itself and cross-position communication is suppressed instead of enabled.",
        "Attention kills two RNN problems at once: the distance between any two positions is one (long dependencies survive without repeated multiplication), and all positions compute in parallel (no serial chain). The first is the expressiveness win; the second is the engineering win, and it is the one that bites earlier as you scale up (dl5-2 continues this).",
        "Soft attention is differentiable everywhere, so plain gradient descent trains it. Hard attention - picking exactly one position - is not, and needs reinforcement learning or a straight-through estimator (see agi1). Hard attention lost on training cost, not on quality.",
        "A padding mask must be applied before the softmax and with -inf-magnitude values (in practice masked_fill(mask, float('-inf'))) so those positions get exactly zero weight. Adding it after the softmax, or merely subtracting a small constant, still lets padding collect real weight and dilute the signal - and the loss keeps falling, so you never notice.",
        "Length alignment is where the bugs breed: the score tensor is (B, h, T_q, T_k), which admits two different masks - (B,1,1,T_k) to hide keys that do not exist (padding), and (1,1,T_q,T_k) to forbid looking at future positions (causality). Swap their shapes and broadcasting quietly computes something wrong that does not necessarily raise.",
        "Bridge: attention weights get read as explanations, but a large weight only says 'this score is high', not 'this input is causally important', and averaging over heads makes that worse (as with Grad-CAM in dl3-5). dl4-4 fits attention into seq2seq and shows precisely which shortcoming it repairs."
      ],
      code: `import math
import torch

torch.manual_seed(0)

def attention(q, k, v, scale=True, mask=None):
    s = q @ k.transpose(-1, -2)
    if scale:
        # 点积的方差约为 d，不除以 sqrt(d) 时 softmax 会落进饱和区
        s = s / math.sqrt(q.size(-1))
    if mask is not None:
        # mask 必须在 softmax 之前加，且用 -inf，权重才会严格为 0
        s = s.masked_fill(mask, float("-inf"))
    p = torch.softmax(s, -1)
    return p @ v, p

for d in (8, 256):
    # Q 与 K 必须是不同的投影：同一份数据会让对角线占优，看不出饱和差异
    q, k = torch.randn(1, 32, d), torch.randn(1, 32, d)
    _, ps = attention(q, k, q, scale=True)
    _, pu = attention(q, k, q, scale=False)
    print("d", d, "scaled max weight", round(float(ps.max()), 4), "unscaled max weight", round(float(pu.max()), 4))

# padding mask：真实键与补齐键混在一批里，不屏蔽时 pad 会分走权重
pad = torch.tensor([[False, False, False, True, True]])
t = torch.randn(1, 5, 16)
_, p_nomask = attention(t, t, t, mask=None)
_, p_mask = attention(t, t, t, mask=pad)
print("weight leaked to padding:", round(float(p_nomask[..., -1].mean()), 4))
print("after masking:", round(float(p_mask[..., -1].mean()), 6))`,
      pit: "用 `torch.where(mask, s, -1e9)` 的 fp16 版本，或者在 softmax 之后把 padding 列置零再「重归一」：前者在 fp16 下 −1e9 会溢出成 −inf，一整行变成 nan；后者数学上等价于「先把权重给过 pad 再强行收回」，与真正屏蔽并不相同，pad 仍然改变了其他位置的相对分配。正确做法只有一个——softmax 之前 `masked_fill` 成 −inf。",
      pit_en: "Using where(mask, s, -1e9) in fp16, or zeroing the padding columns after the softmax and renormalising. The first overflows -1e9 to -inf in half precision and the whole row becomes nan; the second is only 'hand the weight to padding, then take it back by force', which is not the same as blocking it - the padding still distorted how the remaining positions divided their attention. There is one correct move: masked_fill with -inf before the softmax.",
      ex: {
        q: "既然 softmax 会把大的分数压倒性地选中，为什么注意力还要保留 softmax 而不是直接用归一化点积？",
        a: "因为 softmax 提供了两个必需性质：一是处处可微且和为 1，使「加权求和」的系数成为合法的概率组合，输出不会随序列长度变尺度；二是它的锐度随分数差距自动增长，模型可以通过放大 QK 的尺度来实现「从软到硬」的连续过渡，而线性归一化做不到这种可调的锐度。",
        q_en: "If softmax already picks the largest score, why not just normalise the dot products instead?",
        a_en: "Because softmax supplies two needed properties: it is differentiable and sums to one, so the mixing coefficients are a genuine convex combination and the output scale stays independent of sequence length; and its sharpness grows automatically with the score gap, letting the model slide continuously from soft to hard by simply scaling QK - something plain normalised weighting cannot do."
      }
    },

    "dl4-4": {
      min: 14,
      summary: [
        "无注意力的 seq2seq 把所有信息压进一个固定向量：5 个词和 50 个词用同一条通道，长句必然丢信息——这是容量层面的必然（ma1 的秩在这里的直观版），不是「训练久一点就好」。带注意力后解码器每步对编码器所有位置「回头看」，瓶颈才解除。",
        "训练目标是「每个目标位置一次交叉熵」，形状为 (B, T, V)。padding 位置必须用 `ignore_index` 排除，否则「学会输出 <pad>」会吃掉大部分梯度信号，模型把容量浪费在无意义的终止符上；同时按 token 平均还是按句子平均，也会显著改变长短句的相对权重。",
        "自回归解码的错误累积：第 t 步的输入是自己的输出，所以早期的小偏差会以乘法方式传播到后面，序列越长偏得越远。长度惩罚（beam 分数除以 L^α）、重复惩罚都是针对这一现象的补丁——它们改变的是搜索行为，不是模型本身，别把它当成「模型变好了」。",
        "解码策略清单：greedy 每步取最大，容易陷入重复死循环；beam search 保留 k 条假设，翻译常用但在开放生成里显得过于平淡（它系统性偏好高频、安全的续写）；temperature 缩放 logits（T 趋近 0 近似 greedy，T 大更发散）；top-k 截断长尾；top-p（核采样）按累计概率动态截断，是现在开放生成的默认。这些不是「更聪明的解码」，而是对分布形状的不同选择。",
        "训练与推理的计算方式根本不同：训练有 teacher forcing，所有位置一次前向并行算完；推理必须一步步来，延迟随输出长度线性增长。这条错配是所有序列模型上线后的性能瓶颈，也是 dl5-2 里 KV 缓存存在的唯一理由。",
        "评估指标要诚实：BLEU/ROUGE 度量的是 n-gram 重叠，同义改写会被扣分、语序不同但意思正确的译文也会被扣分。所以「验证 loss 一直在降但 BLEU 不动」并不矛盾——你优化的是 token 级条件概率，它评的是短语级一致性。真要判断质量，必须留一部分人评样本作锚。",
        "seq2seq 的结构里最容易写错的是**两个方向的长度不同**：解码器自注意力的 T_q = T_k = 目标长度，交叉注意力的 T_q = 目标长度、T_k = 源长度，padding mask 分别来自源侧与目标侧。把源侧 mask 拿去遮目标侧的位置，广播之后形状仍然合法，分数却全是假的。",
        "指向 dl5：把「循环」这个骨架整个拆掉，只留注意力与残差——下一站是 Transformer，它同时继承这一节所有关于 mask 与长度对齐的细节，并加上两个新问题：顺序信息丢失、复杂度平方增长。"
      ],
      summary_en: [
        "Seq2seq without attention squeezes everything into one fixed vector: five words and fifty words share the same channel, so long inputs must lose information. That is a capacity fact (rank from ma1 in intuitive form), not something longer training fixes. Attention releases the bottleneck by letting the decoder look back at every encoder position each step.",
        "The training objective is one cross-entropy per target position, shaped (B, T, V). Padding positions must be excluded with ignore_index, otherwise 'learn to emit <pad>' eats most of the gradient and the model wastes capacity on a meaningless terminator; and averaging per token versus per sentence visibly reweights short against long examples.",
        "Autoregressive decoding accumulates error: step t consumes its own output, so small early mistakes propagate multiplicatively and the longer the output the further it drifts. Length penalty (dividing the beam score by L^alpha) and repetition penalty are patches on that symptom - they change the search, not the model, so do not book them as a quality improvement.",
        "The decoding menu: greedy takes the argmax each step and falls into repetition loops; beam search keeps k hypotheses, works well for translation but reads dull in open generation because it systematically prefers safe, high-frequency continuations; temperature rescales logits (near zero it approximates greedy, large values spread mass); top-k truncates the tail; top-p (nucleus) truncates by cumulative probability and is today's default for open generation. None of these is 'smarter decoding' - they are different shapes imposed on the same distribution.",
        "Training and inference compute differently in kind: teacher forcing lets every position be evaluated in one parallel forward, while inference must go one step at a time and latency grows linearly with output length. That mismatch is the performance wall every sequence model hits in production, and it is the sole reason KV caching exists in dl5-2.",
        "Choose metrics honestly: BLEU and ROUGE measure n-gram overlap, so paraphrases and correct-but-reordered translations get punished. 'Validation loss keeps falling while BLEU sits still' is therefore not a contradiction - you optimise a token-level conditional likelihood, it scores phrase-level agreement. Keep a human-rated sample as an anchor if the number is going to matter.",
        "The most-mistaken detail in a seq2seq implementation is that the two directions have different lengths: in decoder self-attention T_q = T_k = target length, while in cross-attention T_q is the target length and T_k the source length, and the padding masks come from opposite sides. Apply a source mask to target positions and broadcasting still yields legal shapes with entirely fake numbers.",
        "Bridge to dl5: remove the recurrent skeleton altogether and keep only attention plus residuals. Transformer inherits every mask and alignment detail from this section and adds two of its own - order information is gone, and cost grows quadratically with length."
      ],
      code: `import torch
import torch.nn as nn

torch.manual_seed(0)
V, D, T = 12, 16, 60
# 一条随机游走：下一步只能 +1 或 +2，两种可能各半——所以永远有不可消除的不确定性
seq = [0]
for _ in range(T - 1):
    seq.append((seq[-1] + int(torch.randint(1, 3, (1,)))) % V)
seq = torch.tensor(seq)
x, y = seq[:-1], seq[1:]
emb = nn.Embedding(V, D)
head = nn.Linear(D, V)
opt = torch.optim.Adam(list(emb.parameters()) + list(head.parameters()), lr=0.05)
loss_fn = nn.CrossEntropyLoss()

for _ in range(500):
    # teacher forcing：真前缀一次喂进去，所有位置并行算 loss
    loss = loss_fn(head(emb(x)), y)
    opt.zero_grad()
    loss.backward()
    opt.step()
# 这条随机游走的固有不确定性是 ln(2)=0.693：低于它说明模型已经记住了这条具体路径
print("teacher forcing loss", round(float(loss.detach()), 4), "ln2 =", round(float(torch.log(torch.tensor(2.0))), 4))

# 自由运行：每一步都仍然合法，但整条路径和参照序列早就分岔了
out = [0]
with torch.no_grad():
    for _ in range(12):
        out.append(int(head(emb(torch.tensor(out[-1]))).argmax()))
print("reference    ", seq[:13].tolist())
print("free running ", out)

def decode(logits, how, temperature=1.0, top_p=0.0):
    lg = logits / temperature
    if top_p:
        # 核采样：按累计概率动态截断，长尾在低熵位置会被自动收短
        p, idx = torch.sort(torch.softmax(lg, -1), descending=True)
        keep = p.cumsum(-1) - p <= top_p
        lg = lg.masked_fill(~torch.zeros_like(keep).scatter(0, idx, keep), float("-inf"))
    if how == "greedy":
        return int(lg.argmax())
    return int(torch.multinomial(torch.softmax(lg, -1), 1))

row = head(emb(torch.tensor(3))).detach()
print("greedy", decode(row, "greedy"), "| sampled", decode(row, "sample"), "| top_p", decode(row, "sample", 1.0, 0.95))`,
      pit: "把训练时的 teacher forcing loss 与自由运行的生成质量放在同一张表里汇报，甚至只报前者：前者是「给定真前缀的下一步条件概率」，后者依赖模型在自己产生的（可能已经偏离的）前缀上继续。数字可以一个是 0.2、一个读不通。更隐蔽的版本是「验证集也用了 teacher forcing 来算准确率」，于是你挑出来的最佳 epoch 只是最会念答案那一版。",
      pit_en: "Reporting teacher-forced training loss side by side with free-running quality, or reporting only the former: one is the conditional next-step likelihood given a true prefix, the other rides on prefixes the model produced itself and which may already have drifted. The loss can read 0.2 while the text is unreadable. The subtler version is computing validation accuracy under teacher forcing, in which case the 'best epoch' you selected is simply the one best at reading the answer key aloud.",
      ex: {
        q: "为什么 beam search 在机器翻译上有效，却在对话/创意写作里显得平淡？",
        a: "因为 beam search 是在近似最大化整句联合概率，而高联合概率的句子几乎总是高频、安全的模板句；翻译有唯一正确答案、这个目标与评价一致，而开放生成的「好」包含多样性，联合概率最高恰恰不是它想要的。这不是 beam 的 bug，而是目标函数与任务不匹配。",
        q_en: "Why does beam search help machine translation yet make dialogue and creative writing dull?",
        a_en: "Beam search approximately maximises the joint probability of the whole sentence, and the highest-joint-probability sentences are almost always the safe, high-frequency templates. Translation has one right answer so that objective matches the task; in open generation 'good' includes diversity, and maximum joint probability is exactly what the task does not want. That is an objective-task mismatch, not a beam bug."
      }
    },

    "dl4-5": {
      title: "综合重构：一条序列从长度对齐到解码策略的自查表",
      title_en: "Synthesis: A Sequence Checklist from Alignment to Decoding",
      min: 15,
      target: "拿到一个序列任务时，能在动手前用四个问题定下模型骨架，并逐项核对长度、mask、解码与指标四类细节；能说清序列模型特有的「不动 / 崩 / 假分数」各自的第一嫌疑。",
      target_en: "Given a sequence task, settle the architecture with four questions before coding, then verify length, masks, decoding and metrics item by item - and name the prime suspect for each sequence-specific failure family: stalled, exploding, fake score.",
      summary: [
        "四个建模问题决定骨架：输入是定长还是变长？是每个位置都要输出还是只在末尾输出？任务能不能用未来信息（决定单向还是双向）？标签是否逐位置对齐到输入？这四问答完，「选 RNN 还是注意力、要不要 encoder-decoder」基本就定了，剩下的才是超参。",
        "长度清单：max_len 用覆盖率来定（取长度分布的 95 分位，而不是取最长），因为长尾那几条往往会让整个 batch 被补齐得很浪费；padding 在左还是右要按用途决定（生成任务常左 padding，好让最后一个真实 token 紧贴输出位置）；以及三条 mask 是否都写对了——padding mask（键侧）、causal mask（查询侧）、loss 的 ignore_index（目标侧）。",
        "形状清单（把 dl2-1 的习惯用到序列上）：embedding 出来 (B, T, E)，RNN 输出 (B, T, H) 或老写法 (T, B, H)——`batch_first` 是这一节最容易忘的开关；注意力分数 (B, h, T_q, T_k)。在 forward 里逐段 assert 一次，比在 loss 变 NaN 之后回头查快一个数量级。",
        "训练稳定性：梯度裁剪（序列模型几乎必开，因为沿时间连乘放大了尖峰）、学习率 warmup、label smoothing。label smoothing 对翻译常有明显收益，但它刻意让概率失真，所以任何需要「概率本身可信」的下游（校准、阈值判定、检索打分）都不能用它——这是一次典型的「指标换校准」交易。",
        "诊断「不动」的序列专属顺序：先看 mask 是不是整行 True 把全部键都屏蔽了（softmax 面对一行 −inf 只会给出 nan）；再看 ignore_index 是不是漏写，导致模型在学输出 pad；再看 padding 占比是不是高到真实信号被稀释（超过一半就是警报）；最后才是深度与学习率。",
        "诊断「崩」：一条异常长的样本会让整个 batch 的激活尺寸尖峰，显存忽高忽低、偶发 OOM——按长度分桶或截断即可；梯度爆炸用裁剪（1~5）；关掉 teacher forcing 之后立刻发散是正常现象，要按调度慢慢关，而不是期望它一步切换。",
        "诊断「假分数」：teacher forcing 的 loss 当生成质量（见 dl4-4）、BLEU/ROUGE 与人工判断不同向、验证集按随机切分而非按时间切分（时序任务里的未来泄漏）、以及解码参数没固定导致「换了个 temperature」被当成「模型变好了」。",
        "指向 dl5：注意力已经把「长依赖」这件事解决了，但它留下两个未收的账——它本身不知道顺序，以及它要为每对位置算一次相似度所以成本是平方。dl5-1 先把「生成模型到底在优化什么」讲清，dl5-2、dl5-3 再正面还这两笔账。"
      ],
      summary_en: [
        "Four modelling questions settle the architecture: fixed or variable length; one output at the end or one per position; is future information available (which decides unidirectional versus bidirectional); and are labels aligned to input positions. Once answered, 'RNN or attention, encoder-decoder or not' is mostly decided and what remains is tuning.",
        "Length list: choose max_len by coverage (the 95th percentile of the length distribution, not the maximum) because the long tail pads the whole batch wastefully; decide the padding side by use (left padding is common for generation so the last real token sits right next to the output position); and check all three masks - padding on the key side, causal on the query side, ignore_index on the target side.",
        "Shape list, applying the dl2-1 habit to sequences: embeddings give (B, T, E), an RNN gives (B, T, H) or in the older layout (T, B, H) - batch_first is the most-forgotten switch in this chapter - and attention scores are (B, h, T_q, T_k). Asserting each segment once inside forward is an order of magnitude faster than tracing NaN back later.",
        "Stability: gradient clipping (nearly mandatory for sequences, because products along time amplify spikes), learning-rate warmup, label smoothing. Smoothing often helps translation measurably but deliberately falsifies probabilities, so any downstream that needs trustworthy numbers - calibration, threshold decisions, retrieval scoring - must not use it. That is a classic trade of metrics for calibration.",
        "Sequence-specific triage for 'stalled': first check whether the mask is all-True for a row, blocking every key (a softmax over a row of minus infinities returns nan, or uniform depending on the implementation); then whether ignore_index was left out so the model spends its gradient learning to emit pad; then whether the padding fraction is so high that real signal is diluted (over half is an alarm); only then depth and learning rate.",
        "Triage for 'exploding': one abnormally long sample spikes the activation size for the whole batch, so memory oscillates and OOMs intermittently - bucket by length or truncate; use clipping in the 1-5 range for gradient explosions; and expect divergence the moment teacher forcing is removed, which is why it is withdrawn on a schedule rather than switched off.",
        "Triage for 'fake scores': reading teacher-forced loss as generation quality (dl4-4), BLEU/ROUGE pointing away from human judgement, splitting randomly instead of temporally in a time-series task (which is future leakage), and leaving decoding parameters unpinned so a temperature change gets reported as a model improvement.",
        "Bridge to dl5: attention has solved long dependencies but left two bills unpaid - it has no notion of order, and it costs one similarity per pair of positions, hence quadratic scaling. dl5-1 first clarifies what a generative model is even optimising; dl5-2 and dl5-3 then pay those two bills head-on."
      ],
      code: `import math
import torch
import torch.nn.functional as F

torch.manual_seed(0)
V, D, T, pad = 10, 8, 6, 0
# 三条 mask 各管一处：键侧 padding、查询侧 causal、目标侧 ignore_index
x = torch.randint(1, V, (4, T))
x[1, 3:] = pad
x[2, 5:] = pad
key_mask = (x != pad)[:, None, None, :]
q = k = torch.randn(4, 1, T, D)
scores = q @ k.transpose(-1, -2) / math.sqrt(D)
p_open = torch.softmax(scores, -1)
p_masked = torch.softmax(scores.masked_fill(~key_mask, float("-inf")), -1)
print("weight on a padded key:", round(float(p_open[1:3, :, :, -1].mean()), 4), "->", round(float(p_masked[1:3, :, :, -1].mean()), 6))
# 一整个 batch 都被屏蔽时，softmax 只可能给出均匀分布或 nan，模型从此不动
print("all-masked row:", torch.softmax(torch.full((1, V), float("-inf")), -1).flatten()[:2].tolist())

logits = torch.randn(4, T, V)
# 忘记 ignore_index 时，近一半位置在罚"没输出 pad"，loss 虚高且方向错
naive = F.cross_entropy(logits.transpose(1, 2), x)
fixed = F.cross_entropy(logits.transpose(1, 2), x, ignore_index=pad)
print("loss counting pads", round(float(naive), 4), "ignoring pads", round(float(fixed), 4))

# 按长度分桶能压住显存尖峰：同一 batch 里长度差 10 倍就是浪费 10 倍
lengths = torch.tensor([120, 3, 4, 200, 5, 6])
print("padded to max:", int(lengths.max()) * len(lengths), "vs bucketed:", int(lengths.sum()))`,
      pit: "在验证阶段把 mask 全部设成 True 来「保险地看看会不会报错」——代码跑通、loss 是个正常的数，只是模型从此什么都不学：softmax 面对一行 −inf 只会给出 nan（有些实现退化成均匀分布），注意力于是退化成「对所有位置取平均」。这类「全屏蔽」错误几乎不会崩，只会不动，所以最容易被误诊成学习率或模型容量问题。查它只要一行：`assert mask.any(-1).all()`。",
      pit_en: "Setting every mask entry to True during validation 'just to be safe'. It runs, the loss looks like a normal number, and the model learns nothing: a softmax over a row of minus infinities yields a uniform (or nan) distribution, degrading attention into a plain average over all positions. Total-masking failures never crash, they just stall, which is why they get misdiagnosed as learning-rate or capacity problems. One line catches them: assert mask.any(-1).all().",
      ex: {
        q: "为什么序列模型比前馈网络更需要「按步数而不是按 epoch」来对齐两次实验？",
        a: "因为序列模型的一个 epoch 里成本变化极大：批量按长度分桶、drop_last、变长打包都会改变一个 epoch 实际执行了多少次 step；再叠加沿时间的连乘使收敛速度对序列长度敏感，只有「第 N 次参数更新」才是可比的锚点。",
        q_en: "Why do sequence experiments need aligning by steps rather than by epochs even more than feedforward ones?",
        a_en: "Because the cost of one epoch swings wildly for sequences: length bucketing, drop_last and packing all change how many steps an epoch actually contains, and products along time make convergence speed itself length-dependent. Only the Nth parameter update is a comparable anchor."
      }
    },

    /* ===================== dl5 生成模型与 Transformer ===================== */
    "dl5-1": {
      min: 14,
      summary: [
        "判别式模型学 P(y|x)，生成式学 P(x)：前者输出「这是哪一类」，后者要能「造出一个新的 x」。这就是为什么最强的分类器也不会画图——它压根没有被要求建模数据的分布。",
        "VAE 优化的是 ELBO（证据下界）= 重构误差 + KL(q(z|x) ‖ p(z))：编码器输出 μ 与 logσ²（用对数方差是为了恒正且数值稳定），采样时 z = μ + σ ⊙ ε 把随机性挪到与参数无关的 ε 上，梯度才能穿过「采样」这个动作——这就是重参数化技巧，也是 VAE 可训的关键。",
        "普通自编码器不能当生成模型，原因不在容量而在结构：它的隐空间没有任何约束，训练点之外 decode 出来是垃圾，所以无法「随便抽一个 z 就得到新样本」。KL 项就是把隐空间拉向标准正态的代价，而它也正好是 VAE 生成图偏糊的原因（分布被强行摊平）。",
        "GAN 优化的不是一个损失而是两个：生成器想让判别器判错，判别器想分辨真假。所以 GAN 的 loss 数值没有可比性——判别器损失降到接近 0 意味着它已经完美、生成器彻底学不到东西，那是训练失败而不是成功。「看 loss 曲线判断 GAN 训得怎么样」这件事本身就不成立。",
        "模式崩溃与它的判别方法：生成器一旦发现某几种样本能骗过判别器，就只造那几种。诊断要看**样本多样性**（近重复率、类分布是否塌成几类），不是看 loss。缓解手段包括特征匹配、minibatch 判别、调整 D/G 更新比例——都是在治博弈的稳定性，不是在提高分布拟合的上界。",
        "扩散模型优化的是一个朴素的、稳定的回归目标：给数据逐步加噪到高斯，训练一个网络从带噪输入预测注入的噪声 ε，损失就是 MSE。它没有对抗博弈，所以好训得多；代价在推理侧——采样要走几十到上千次前向。一句话概括三者：VAE 快而糊，GAN 锐而不稳，扩散稳而慢。",
        "三者怎么选只看你要什么：要可控插值与似然近似（VAE）、要单步高质量采样（GAN）、要覆盖面与稳定性且能接受慢（扩散）。而 dl5-2 之后的大模型走的是另一条生成路线：把 P(x) 拆成逐 token 条件概率的连乘，用一个可精确算 likelihood 的自回归模型来做生成。",
        "衔接：本章前置是 dl4（注意力、mask、自回归解码）与 ma4（条件概率、KL 散度）。下一节 dl5-2 把注意力做成可以一层层堆的骨架，并正面处理「平方复杂度」这笔账。"
      ],
      summary_en: [
        "Discriminative models learn P(y|x), generative models learn P(x): the first answers 'which class', the second must be able to produce a new x. That is exactly why the strongest classifier cannot draw - modelling the data distribution was never part of its job.",
        "A VAE optimises the ELBO: reconstruction error plus KL(q(z|x) || p(z)). The encoder emits mu and log-variance (logs keep it positive and numerically stable), and sampling uses z = mu + sigma * eps, which moves the randomness onto eps, an expression with no parameters in it, so gradients can flow through the act of sampling. That is the reparameterisation trick, and it is what makes a VAE trainable.",
        "A plain autoencoder is not a generative model because of structure, not capacity: its latent space is unconstrained, so decoding a point the training never visited gives garbage, and 'draw a random z and get a new sample' is impossible. The KL term is the price paid for dragging the latent space toward a standard normal - and it is also precisely why VAE images come out blurry.",
        "A GAN optimises two losses in opposition, not one: the generator wants the discriminator wrong, the discriminator wants to tell them apart. Therefore GAN loss values are not comparable across runs - a discriminator loss falling toward zero means it has won and the generator has stopped learning, which is failure, not success. Judging a GAN by its loss curve is simply not available.",
        "Mode collapse and how to spot it: once the generator finds a few samples that fool the discriminator, it produces only those. The diagnosis is diversity (near-duplicate rate, whether the class histogram has collapsed), never the loss. Feature matching, minibatch discrimination and retuning the D/G update ratio are stabilisers for the game; they do not raise the ceiling on distribution fit.",
        "Diffusion optimises a plain, stable regression target: gradually noise the data into a Gaussian and train a network to predict the injected noise from the noisy input, with an MSE loss. No game, so it trains far more easily; the bill lands on inference, where sampling takes tens to hundreds of forward passes. One line each: VAE fast but blurry, GAN sharp but unstable, diffusion stable but slow.",
        "Pick by what you need: controllable interpolation and a likelihood approximation (VAE), single-step high-quality samples (GAN), coverage and trainability where slow sampling is acceptable (diffusion). The large models from dl5-2 onward take a fourth route: factor P(x) into a product of per-token conditionals and model it autoregressively, with likelihoods computed exactly.",
        "Bridge: this chapter presumes dl4 (attention, masks, autoregressive decoding) and ma4 (conditional probability, KL divergence). dl5-2 turns attention into a stackable layer and confronts the quadratic-cost bill directly."
      ],
      code: `import torch
import torch.nn as nn

torch.manual_seed(0)
# 两个簇加一点噪声：数据本身有结构，重构与 KL 才会真的互相拉扯
x = ((torch.rand(64, 1) > 0.5).float() * 2 - 1) + torch.randn(64, 4) * 0.2
enc = nn.Linear(4, 8)
dec = nn.Linear(4, 4)
opt = torch.optim.Adam(list(enc.parameters()) + list(dec.parameters()), lr=0.05)

def vae_loss(xb):
    mu, logvar = enc(xb).chunk(2, dim=1)
    # 用 logvar 而不是 std：恒正、数值稳，随机性挪到 eps 上梯度才穿得过采样
    std = torch.exp(0.5 * logvar)
    z = mu + std * torch.randn_like(std)
    recon = ((dec(z) - xb) ** 2).mean()
    # KL 项把隐空间拉向标准正态，这正是"能随机采样"所付的代价
    kl = -0.5 * (1 + logvar - mu.pow(2) - logvar.exp()).mean()
    return recon + 1e-2 * kl, recon, kl

for _ in range(400):
    opt.zero_grad()
    loss, recon, kl = vae_loss(x)
    loss.backward()
    opt.step()
print("recon", round(float(recon.detach()), 4), "kl", round(float(kl.detach()), 5))
with torch.no_grad():
    print("sample from the prior", tuple(dec(torch.randn(3, 4)).shape))

# 扩散目标就是一个朴素的去噪 MSE：预测注入的噪声，而不是直接造图
x0 = torch.randn(16, 4)
noise = torch.randn(16, 4)
eps_hat = nn.Linear(4, 4)(x0 + noise)
print("diffusion loss", round(float(((eps_hat - noise) ** 2).mean().detach()), 4))

# GAN 的 loss 数值不可比：判别器完胜时它的 loss 最小，而那正是生成器学不动的时刻
for p in (0.5, 0.9, 0.9999):
    d_real = torch.tensor(p)
    d_fake = torch.tensor(1 - p)
    print("D(real) =", p, "D loss", round(float(-(d_real.log() + (1 - d_fake).log())), 4))`,
      pit: "拿 VAE/GAN/扩散的 loss 数值互相比较来决定用哪个：三者的 loss 根本不在同一把尺上——VAE 的重构项随数据尺度线性变化，GAN 的 loss 是博弈状态的读数，扩散的 MSE 依赖你选的噪声调度。换一套预处理或换一组 β 档位，排名就能倒过来。选模型要靠采样质量与预算，不能靠「谁的 loss 更小」。",
      pit_en: "Ranking VAE, GAN and diffusion by their loss numbers. They are not on the same scale: VAE reconstruction tracks the data scale linearly, GAN loss is a reading of the game's state, diffusion MSE depends on the chosen noise schedule. Change the preprocessing or the beta schedule and the ordering flips. Choose by sample quality and budget, never by 'whose loss is smaller'.",
      ex: {
        q: "为什么 VAE 一定要重参数化，而不能直接 `z = mu + std * torch.randn(std.shape)` 再让梯度回传？",
        a: "因为「采样」这个动作本身对 z 没有可导的映射，梯度不知道「z 稍微变一点会怎样」；写成 eps 与参数相乘的形式后，随机性被隔离到与参数无关的 eps 上，mu 与 std 就是普通乘法路径上的因子，链式法则照常成立。后者那行代码在单变量高斯上碰巧也能反传，但它只是这一特定形式的特例，一旦换分布（Gumbel、离散隐变量）就必须自己推梯度。",
        q_en: "Why must a VAE reparameterise instead of just sampling z and backpropagating?",
        a_en: "Because sampling as an operation has no differentiable map onto z, so the gradient cannot tell what a small change in z would do. Writing it as eps multiplied by the parameters isolates randomness in eps, which carries no parameters, leaving mu and std as ordinary factors on a multiplicative path so the chain rule applies unchanged. That ad-hoc line happens to work for a diagonal Gaussian, but it is only a special case and must be re-derived for other distributions such as Gumbel or discrete latents."
      }
    },

    "dl5-2": {
      min: 15,
      summary: [
        "Self-Attention 就是把注意力做成一层网络：Q/K/V 三个投影都来自同一个输入，每个位置都当一次查询去和所有位置（包括自己）的键算相似度，输出是对全序列的「加权理解」。输出与输入同形状 (B, T, d)，所以它能像卷积一样一层层堆。",
        "因果掩码是自回归模型的命门：预测第 t 个 token 时只允许看 1..t，做法是在 softmax 之前把上三角全部填 −inf。忘了它，模型在训练时可以偷看答案，loss 会降得极快、分数漂亮得离谱，而推理时逐字生成完全不可用——「训练分数极好而生成一塌糊涂」这一症状的头号原因就是它。",
        "复杂度随长度平方增长是一笔要会算的账：注意力分数张量有 B·h·T² 个元素。取 B=1、h=32、T=8192、fp16，一层就是 32·8192²·2 ≈ 4.3 GB——这就是「上下文翻倍、显存也跟着涨」的算术来源（元素数是 4 倍关系）。三条缓解路径的取舍要分清：只算下三角省一半常数但仍是平方；FlashAttention 靠分块让这个矩阵从不落盘，省的是显存与带宽而不是计算量；滑窗、稀疏、低秩则真的改变表达能力。",
        "多头注意力在做什么：把 d 维切成 h 份，每份在自己的低维子空间里做一次独立注意力再拼接。为什么不是一个大的 softmax 就够：单个 softmax 只能给出一个归一的分布，也就是「一种关系模式」；而一个词同时要表达指代、句法修饰、邻近、话题关联等多种关系，多头让它们并行存在。每头降到 d/h 正是为了让总成本不变。",
        "FFN 才是参数大头：一层里注意力占 4d²，逐位置前馈（通常扩展到 4d）占 8d²，所以约 2/3 的参数在 FFN 里。直觉分工是「注意力负责交流，FFN 负责计算与存储」，这也是剪枝和蒸馏大多从 FFN 下手的结构性原因（dl5-4 展开）。",
        "残差与归一化的位置不是小事：Post-LN（子层之后 norm）梯度要穿过每一层的变换，深了就需要 warmup；Pre-LN（先 norm 再进子层）给梯度留了一条更干净的路，训练稳得多但最终质量常略逊。这就是 dl1-5「残差给梯度一条恒等路」在 Transformer 里的具体落点。",
        "推理侧的 KV 缓存与训练侧的因果掩码是同一件事的两面：自回归生成时每步的 K/V 不随新 token 改变，缓存下来就把「每步重算全序列」变成「只算一步」，代价是显存随上下文与并发数线性增长——这正是 LLM 服务「并发一高就 OOM」的根因。注意缓存的是 K/V 而不是注意力权重，而且缓存一旦建立就不能再对全局序列做重排（那是长上下文扩展要另解决的问题）。",
        "衔接：一层 Transformer 已经齐了，但它现在对「谁在前谁在后」毫无概念。dl5-3 补位置编码与编解码全结构。"
      ],
      summary_en: [
        "Self-attention is attention made into a layer: all three projections Q, K and V come from the same input, every position acts as a query against every key including its own, and the output is a weighted understanding of the whole sequence. It maps (B, T, d) to (B, T, d), so it stacks layer upon layer exactly like convolution.",
        "The causal mask is the life line of an autoregressive model: predicting token t may only look at positions 1..t, implemented by filling the upper triangle with -inf before the softmax. Leave it out and the model reads the answer key during training - loss falls beautifully, scores look absurd - while token-by-token generation at inference is completely useless. 'Superb training score, gibberish output' is almost always this.",
        "Quadratic cost is arithmetic you must be able to do: the score tensor holds B*h*T^2 elements. With B=1, h=32, T=8192 in fp16, one layer is 32*8192*8192*2 bytes, about 4.3 GB. That is the real source of 'double the context and memory balloons'. Know which mitigation buys what: computing only the lower triangle halves a constant but stays quadratic; FlashAttention tiles the computation so the full matrix never lands in memory, saving memory and bandwidth rather than arithmetic; sliding-window, sparse and low-rank schemes genuinely trade expressive power.",
        "Multi-head attention splits d into h chunks and runs one small attention per chunk, then concatenates. One big softmax is not enough because a single normalised distribution expresses one relation type, while a word simultaneously carries reference, syntactic dependency, locality and topic relations; multiple heads let them coexist. Reducing each head to d/h is precisely what keeps the total cost unchanged.",
        "The FFN is where the parameters are: attention costs 4d^2 per layer while a positionwise feed-forward with a 4x expansion costs 8d^2, so about two thirds of the weights live in the FFN. The intuitive division - attention communicates, FFN computes and stores - is exactly why pruning and distillation usually start there (dl5-4 develops this).",
        "Where you put the normalisation is not a detail: Post-LN forces the gradient through every sublayer transform, so depth demands warmup; Pre-LN normalises before entering each sublayer, leaves a cleaner gradient path and trains far more stably, though often slightly worse in final quality. This is dl1-5's 'residuals give the gradient an identity path' in its Transformer form.",
        "The inference-side KV cache and the training-side causal mask are two faces of one fact: during autoregressive generation each step's K and V never change for earlier tokens, so caching turns 'recompute the whole sequence every step' into 'compute one step' - at the price of memory that grows linearly with context and concurrency, which is precisely why LLM serving OOMs under load. Cache K and V, not attention weights, and note that once a cache exists you can no longer re-order the sequence globally, which is a separate long-context problem.",
        "Bridge: one Transformer layer is now complete, yet it has no idea which token came first. dl5-3 adds positional encoding and the full encoder-decoder arrangement."
      ],
      code: `import math
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)
B, T, D, H = 2, 16, 64, 8
d = D // H
x = torch.randn(B, T, D)
q, k, v = nn.Linear(D, 3 * D)(x).chunk(3, dim=-1)
# (B,T,D) 拆成 (B,H,T,d)：多头只是把特征维换成"更多头 + 每头更窄"
qh, kh, vh = (t.reshape(B, T, H, d).transpose(1, 2) for t in (q, k, v))
scores = qh @ kh.transpose(-1, -2) / math.sqrt(d)
# 因果掩码必须在 softmax 之前把上三角填 -inf，否则第 t 位能看见未来的答案
causal = torch.triu(torch.ones(T, T, dtype=torch.bool), diagonal=1)
p = torch.softmax(scores.masked_fill(causal, float("-inf")), -1)
out = (p @ vh).transpose(1, 2).reshape(B, T, D)
print("attn out", tuple(out.shape), "| each row sums to 1:", bool(torch.allclose(p.sum(-1), torch.ones_like(p.sum(-1)))))
print("position 0 leaked to the future:", round(float(p[0, 0, 0, 1].detach()), 6))

# 用框架实现核对一遍：is_causal=True 时第 0 位只能看自己，输出必须等于 v 的第 0 行
ref = F.scaled_dot_product_attention(qh, kh, vh, is_causal=True)
print("custom == SDPA:", bool(torch.allclose(ref.transpose(1, 2).reshape(B, T, D), out, atol=1e-5)))
print("row 0 equals v[0]:", bool(torch.allclose(ref[:, :, :1], vh[:, :, :1], atol=1e-6)))

# 上下文翻倍时分数矩阵的字节数是 4 倍关系，这就是长上下文的显存账
for n in (1024, 2048, 4096, 8192):
    print("T", n, "scores fp16 per layer (B=1,H=32):", round(32 * n * n * 2 / 2**30, 2), "GiB")`,
      pit: "把 mask 传给了 `attn_mask=` 却以为它是 padding mask，或者在批内长度不齐时只传 causal 忘了 padding：SDPA 的 attn_mask 既接受「布尔可见性」也接受「加性偏置」，形状 (B,1,T,T)、(1,1,T,T)、(T,T) 都会广播成功。于是你的 padding mask 被当成逐位置的可见性矩阵用，序列里每个 pad 都在真实地参与注意力——分数照样降，指标照样涨，只是全都不可信。",
      pit_en: "Passing something to attn_mask believing it is a padding mask, or sending only the causal mask when batch lengths differ. SDPA's attn_mask accepts both boolean visibility and additive bias, and shapes (B,1,T,T), (1,1,T,T) and (T,T) all broadcast happily, so your padding mask silently gets used as a per-position visibility matrix and every pad really does participate in attention. The loss still falls, the metric still rises, and neither means anything.",
      ex: {
        q: "为什么 FlashAttention 说「不减少计算量」却还能明显加速？",
        a: "因为注意力的真实瓶颈是显存带宽而不是浮点次数：朴素实现要把 T×T 的分数矩阵完整写回显存再读回来做 softmax。FlashAttention 用分块与在线 softmax 让这个矩阵从不落盘，省掉的是读写量，所以墙钟时间下降而 FLOPs 基本不变——这也解释了为什么它省显存却不改平方复杂度。",
        q_en: "If FlashAttention does not reduce arithmetic, why is it clearly faster?",
        a_en: "Because attention's real bottleneck is memory bandwidth, not floating-point count: the naive version writes the whole T by T score matrix to memory and reads it back for softmax. FlashAttention tiles the work and runs softmax online so that matrix never lands in memory, cutting traffic while FLOPs stay roughly the same - which is also why it saves memory yet keeps quadratic complexity."
      }
    },

    "dl5-3": {
      min: 15,
      summary: [
        "一层 Transformer 的全部零件：多头自注意力 + 逐位置 FFN，每个子层外面各套一条残差与一次归一化。编码器 N 层堆这个，解码器多插一个「看编码器输出」的交叉注意力子层——因为源语言与目标语言的位置根本不对应，中间必须有一个可学习的检索接口。",
        "注意力本身是置换等变的：把输入顺序打乱，输出只是被同样打乱。也就是说模型对「谁在前」完全无感（单层来看甚至等价于一个词袋的加权和）。所以顺序信息必须显式注入——这就是位置编码存在的唯一理由，不是可选项。",
        "位置编码的三代演进要记住代价：正弦编码把位置写进不同频率的三角函数里，理论上能外推；学习式绝对编码就是一张 (max_len, d) 的嵌入表，超过训练长度时根本没有对应行可取（索引直接越界）；RoPE 把位置变成对 Q/K 的旋转，天然表达相对距离、长度外推好得多，ALiBi 则直接在分数上加距离偏置。「把上下文从 2k 拉到 32k」不是改一个常数，而是要动这里的一整条机制。",
        "三种 mask 在标准编解码结构里各有归属：编码器自注意力只有 padding mask（源侧）；解码器自注意力是因果 mask（目标侧）叠加目标 padding mask；交叉注意力用源侧 padding mask 而**不需要**因果 mask。少任何一层的结果不是报错而是「分数虚高」，因为模型在训练时偷看了它推理时看不到的东西。",
        "训练可以完全并行而推理不行：teacher forcing 加上因果 mask，让解码器一次前向就把所有位置的损失都算完；而生成时必须一 token 一步。这条错配是 LLM 服务优化的主战场——批处理、连续批处理、KV 缓存、推测解码都是在还这笔债。",
        "参数量要会粗算：嵌入表 V×d 常常是最大的一块（5 万词表、d=4096 就是 2 亿参数）；每层注意力 4d²、FFN 约 8d²（4× 扩展），所以 L 层 ≈ 12Ld²。这两条加起来就是所有「这个模型多大」的心算基础，也是 dl5-2 那条「FFN 才是参数大头」的定量版。",
        "崩的典型来源：深层残差支路的方差会随层数累积，所以长网络的残差分支要做缩放初始化（按 1/√(2N) 之类）；fp16 训练时 logits 与注意分数容易溢出，需要减最大值或改用 bf16；某些头会把注意力塌到一个位置上（熵极低），表现为 loss 平台期与生成重复——这些都能回到 dl1-5 与 dl2-6 的通用手段：打印每层梯度范数 + 梯度裁剪。",
        "指向 dl5-4：结构与参数量都清楚了，剩下的问题是「用什么目标把它喂成一个会说话的模型」——预训练目标决定了它能干什么，也决定了它不能干什么。"
      ],
      summary_en: [
        "One Transformer layer in full: multi-head self-attention plus a positionwise FFN, each wrapped in its own residual and normalisation. The encoder stacks N of these; the decoder inserts one extra sublayer that attends to the encoder output - cross-attention - because positions in the two languages simply do not correspond and a learnable retrieval interface has to sit between them.",
        "Attention is permutation-equivariant: shuffle the input and the output is shuffled identically. The model is entirely indifferent to which token came first, and a single layer is effectively a bag-of-words mixture. Order therefore has to be injected by hand - the one and only reason positional encoding exists. It is not optional.",
        "Remember positional schemes by their cost, not their dates. Sinusoidal encoding writes position into triangular functions of different frequencies and can extrapolate in principle; learned absolute encoding is just a lookup table of shape (max_len, d), and past the trained length there is no row to fetch, so the index goes out of range; RoPE rotates Q and K by position, which expresses relative distance naturally and extrapolates far better, while ALiBi adds a distance bias straight onto the scores. Stretching context from 2k to 32k is not changing a constant, it is replacing this entire mechanism.",
        "Three masks, three homes: encoder self-attention uses only the source padding mask; decoder self-attention uses the causal mask plus the target padding mask; cross-attention uses the source padding mask and must not use causality. Missing any one does not crash - it inflates the score, because the model saw during training what it cannot see at inference.",
        "Training parallelises completely while inference cannot: teacher forcing plus the causal mask lets one decoder forward pass score every position, whereas generation must emit one token at a time. That mismatch is the main battleground of LLM serving - batching, continuous batching, KV caching and speculative decoding are all repaying this debt.",
        "Hand-arithmetic for size: the embedding table V*d is often the largest single block (50k tokens at d=4096 is 200 million parameters), and each layer costs 4d^2 for attention plus about 8d^2 for a 4x-expanded FFN, so L layers are roughly 12*L*d^2. Those two lines are the whole answer to 'how big is this model', and the quantitative version of dl5-2's claim that the FFN holds the parameters.",
        "Where it breaks: variance accumulates along deep residual branches, so long networks want the residual path scaled down at initialisation (by something like 1/sqrt(2N)); fp16 training lets logits and attention scores overflow, which needs the max-subtraction trick or bf16; and individual heads can collapse onto one position, showing up as a loss plateau plus repetitive generation. All of these reduce to the general tools from dl1-5 and dl2-6: per-layer gradient norms and clipping.",
        "Bridge to dl5-4: structure and parameter counts are settled; the remaining question is what objective turns it into something that can talk. The pretraining target decides what the model can do - and equally what it cannot."
      ],
      code: `import math
import torch
import torch.nn as nn

torch.manual_seed(0)

def sinusoid(T, d):
    pos = torch.arange(T).unsqueeze(1).float()
    div = torch.exp(torch.arange(0, d, 2).float() * (-math.log(10000.0) / d))
    pe = torch.zeros(T, d)
    # 偶数列用 sin、奇数列用 cos：同一对坐标才能唯一确定一个位置
    pe[:, 0::2] = torch.sin(pos * div)
    pe[:, 1::2] = torch.cos(pos * div)
    return pe

x = torch.randn(3, 5, 16)
shuffled = x[:, torch.randperm(5)]
# 没有位置编码时，池化后的表示对顺序完全无感——注意力本质上也是如此
print("order invisible to a pooled bag:", bool(torch.allclose(x.mean(1), shuffled.mean(1))))
pe = sinusoid(5, 16)
print("neighbouring rows differ:", round(float((pe[0] - pe[1]).abs().mean()), 4))

# 学习式绝对位置编码只有一张 max_len 行的表，超出就没有对应行可取
learned = nn.Embedding(8, 16)
try:
    learned(torch.tensor([9]))
except (IndexError, RuntimeError) as err:
    print("past the trained length:", str(err)[:44])

# 一层里的参数分配：注意力 4d^2，FFN（4x 扩展）8d^2
d = 512
print("attention", 4 * d * d, "ffn", 2 * 4 * d * d, "ffn/attn", round(2 * 4 * d * d / (4 * d * d), 1))`,
      pit: "把「训练用 512、推理想跑 2048」当成一行配置改动：绝对位置编码表只有 512 行，越界时要么直接索引报错，要么被偷偷 clamp/循环复用，于是第 600 个 token 拿到的位置向量与第 80 个相同，模型把它当成同一个位置来理解。长度外推是有代价的机制问题（位置插值、RoPE base 缩放、滑动窗口），不是容量参数。",
      pit_en: "Treating 'trained at 512, serve at 2048' as a config edit. An absolute positional table has only 512 rows, so beyond that you either get an index error or a silent clamp/reuse, and token 600 receives the same position vector as token 80 - which the model then reads as the same place. Length extrapolation is a mechanism problem with a price (positional interpolation, RoPE base scaling, sliding windows), not a capacity knob.",
      ex: {
        q: "为什么交叉注意力不需要因果掩码，而解码器自注意力必须有？",
        a: "因为两者「未来」的含义不同：解码器自注意力的键和值就是它自己要生成的同一段序列，看见未来等于抄答案，必须严格屏蔽；交叉注意力的键来自编码器输出——源端句子在解码之前已经完整给定，是输入而不是答案，所以全部位置天然可读，只需要屏蔽 padding。",
        q_en: "Why does cross-attention not need a causal mask while decoder self-attention must have one?",
        a_en: "Because 'future' means different things. In decoder self-attention the keys are the very sequence being generated, so seeing ahead is reading the answer key and must be blocked absolutely. In cross-attention the keys come from the encoder - the source sentence, fully available before decoding starts, an input rather than a target - so every position is legitimately readable and only padding needs masking."
      }
    },

    "dl5-4": {
      min: 15,
      summary: [
        "预训练目标决定下游形态：BERT 用掩码语言建模（遮住 15% 让模型猜回来），每个位置能看到双向上下文，所以表征强、生成弱；GPT 用因果语言建模，天生会续写但每个位置只见过去。记住「结构（编码器/解码器）」与「目标（双向/单向）」是两件事，把它们混着说是最常见的概念错误。",
        "「为什么最后是自回归解码器赢」不是因为它注意力更强，而是因为**目标与任务合一**：预测下一个 token 这一个目标就能吃下海量无标注文本，并且生成时用的目标与训练时的目标完全相同；而编码器路线每换一个任务就要换头、换目标、造标注。统一目标的工程红利比零点几个百分点的结构优势重要得多。",
        "三段式的成本各不相同：预训练烧的是算力与数据规模；微调烧的是标签质量，并带来灾难性遗忘（学了新任务、丢了旧能力，要靠小学习率、数据回放或只训部分参数来压制）；对齐烧的是偏好数据与奖励模型的质量，风险是「迎合评审」而非真的变好（agi12 的奖励黑客正是这件事）。三段不能互相替代——没有预训练就微调，等于在随机权重上硬训。",
        "缩放定律的直觉与它的局限：损失随参数量、数据量、算力近似按幂律下降，配比大致遵循「每个参数约 20 个 token」的口径，因此只堆参数不堆数据会迅速失去收益。但要清醒：幂律说的是**损失**，不是能力。能力有涌现与阈值效应，用 loss 外推「它会解中学几何题」是过度解读（详细展开在 agi12）。",
        "困惑度是什么、以及它怎么骗人：PPL = exp(平均 NLL)，是一个 token 级指标。它的第一个陷阱是「换分词器就完全不可比」——同一段文本切成 6 个还是 3 个 token，分母变了，数字就变了；第二个陷阱是它奖励「像人类文本」而不是「事实正确」，所以低困惑度的模型照样能一本正经地编造。这是「分数是假的」在大模型上的典型形态。",
        "压缩三件套各牺牲一样东西，要分得清：量化把权重（有时连激活）降到 int8/fp4，省显存与带宽，代价是精度且对少数离群权重特别敏感，需要 per-channel/per-group 与校准集；蒸馏让小模型学大模型的软标签，能学到难从硬标签里读的类间关系，但容易只学到风格、丢掉长尾与新颖性；剪枝去掉小权重或整个头，非结构化剪枝要稀疏硬件才真的加速，结构化剪枝省得多也伤得多。三者可叠加，叠加后误差不会简单相加，必须逐项回归测试。",
        "评测的不可靠是三件事叠加：自动指标与人评相关性有限；基准污染（测试题混进预训练语料，agi34 已展开）让「分数」变成记忆测试；人评自身有偏——评分者不一致、位置偏好（先看到的更容易被选中）、长度偏好（长回答更容易拿高分）。所以任何一次「我们更好」都必须说明：同指标、同实现、同评测集、无重叠、且有人评锚点。",
        "指向 dl5-5 与 agi 段：到这里，「结构 + 目标 + 压缩」都齐了。下一节把「生成质量与评测可信度」收口成一张表；再往后，agi2 讲怎么把这样一个模型接成可用的应用，agi3 讲工具调用与智能体——它们面对的还是这两笔账：显存与评测。"
      ],
      summary_en: [
        "The pretraining target decides the downstream shape: BERT uses masked language modelling (hide 15 percent, guess it back) so every position enjoys bidirectional context - strong representations, weak generation; GPT uses causal language modelling so it writes naturally but each position sees only the past. Structure (encoder versus decoder) and objective (bidirectional versus unidirectional) are two different axes, and conflating them is the most common conceptual error here.",
        "The decoder did not win because its attention is stronger but because objective and task became one thing: predicting the next token consumes enormous unlabelled text and is exactly what generation needs at inference. Encoder routes must swap heads, swap objectives and buy labels for every new task. The engineering dividend of a single objective outweighs structural advantages of a fraction of a percent.",
        "The three stages bill differently. Pretraining bills compute and corpus size. Fine-tuning bills label quality and brings catastrophic forgetting - new task learned, old capability lost - which is suppressed with small rates, data replay or partial-parameter training. Alignment bills preference data and reward-model quality, and its risk is pleasing the judge rather than getting better (reward hacking in agi12 is precisely this). None of the three substitutes for another: fine-tuning without pretraining is training on random weights.",
        "Scaling-law intuition and its limit: loss falls roughly as a power law in parameters, data and compute, with a ratio around twenty tokens per parameter, so growing parameters without growing data loses benefit fast. But stay clear-headed: the power law speaks about loss, not capability. Capabilities emerge with threshold effects, so extrapolating 'it will solve school geometry' from a loss curve is over-reading (agi12 develops this).",
        "Perplexity is exp(average NLL), a token-level quantity, and it lies in two ways. First, it is not comparable across tokenisers: the same passage split into six or three tokens changes the denominator and hence the number. Second, it rewards 'resembling human text', not 'being factually correct', so a low-perplexity model can still fabricate with total confidence. That is the fake-score failure in its large-model costume.",
        "The three compression tools each sacrifice something distinct, so keep them apart. Quantisation drops weights (sometimes activations) to int8 or fp4, saving memory and bandwidth at the cost of accuracy, with particular sensitivity to a handful of outlier weights that needs per-channel or per-group scales and a calibration set. Distillation trains a small student on the teacher's soft labels, capturing inter-class relations that hard labels hide, but it often learns style while losing tail and novelty. Pruning removes small weights or whole heads; unstructured sparsity only speeds up on sparse hardware, while structured pruning saves more and hurts more. They stack, and stacked error is not additive, so re-test each axis separately.",
        "Unreliable evaluation is three things piled up: automatic metrics correlate only loosely with humans; benchmark contamination (test items inside the pretraining corpus, covered in agi34) turns a score into a memory test; and human evaluation itself is biased - rater disagreement, position bias towards whatever is read first, and length bias towards longer answers. So every claim of 'better than' must state: same metric, same implementation, same set, no overlap, plus a human anchor.",
        "Bridge to dl5-5 and the agi track: structure, objective and compression are now all on the table. The next section closes out generation quality and evaluation trustworthiness into one checklist; agi2 turns such a model into a usable application and agi3 into tool-calling agents - and both still face the same two bills, memory and evaluation."
      ],
      code: `import math
import torch

# 困惑度只在同一个分词器内部可比：总 NLL 不变，切分方式变它就变
total_nll = 6.89
for n in (6, 3):
    print("tokens", n, "per-token perplexity", round(math.exp(total_nll / n), 2))

# 温度只改变分布形状，不会改变模型"知道"多少
logits = torch.tensor([3.0, 1.0, 0.0, -1.0])
for t in (0.3, 1.0, 3.0):
    p = torch.softmax(logits / t, -1)
    print("T", t, [round(float(v), 3) for v in p], "entropy", round(float(-(p * (p + 1e-12).log()).sum()), 3))

# 部署侧的硬账：权重按 参数量 x 每参数字节；KV 缓存随层数、上下文与并发线性增长
def weight_bytes(params, bits=16):
    return params * bits // 8

def kv_bytes(layers, kv_heads, head_dim, ctx, seqs, bits=16):
    # 那个 2 是 K 与 V 两份，缓存里不含注意力权重本身
    return 2 * layers * kv_heads * head_dim * ctx * seqs * bits // 8

P = 7_000_000_000
print("7B fp16", round(weight_bytes(P) / 2**30, 1), "GiB | int8", round(weight_bytes(P, 8) / 2**30, 1), "GiB | int4", round(weight_bytes(P, 4) / 2**30, 1), "GiB")
print("KV per 4k sequence", round(kv_bytes(32, 8, 128, 4096, 1) / 2**30, 2), "GiB")
print("KV at 32 concurrent", round(kv_bytes(32, 8, 128, 4096, 32) / 2**30, 1), "GiB")`,
      pit: "用「换了更小的模型后困惑度只涨了一点」来论证蒸馏很成功，却不做任务级回归：困惑度是对整体 token 分布的平均度量，它会对「罕见的多步推理」「超长上下文定位」「代码里的严格语法」这三类能力最不敏感，而它们恰恰是掉点最狠的地方。压缩之后必须逐项跑原来能过的用例，尤其是长上下文与结构化输出。",
      pit_en: "Arguing that distillation worked because perplexity barely moved after shrinking the model, without task-level regression. Perplexity averages over the whole token distribution and is least sensitive exactly where models degrade first - rare multi-step reasoning, long-context retrieval, and syntactically strict code. After any compression, rerun the cases the old model passed, with emphasis on long context and structured output.",
      ex: {
        q: "为什么「预训练 → 微调 → 对齐」不能跳步，也不能调换顺序？",
        a: "因为三段各自提供的东西不同且互相依赖：预训练给出通用表征与世界知识（没有它，微调只是在拟合一个小数据集的分布）；微调把通用能力对齐到具体任务的格式与标签（没有它，对齐阶段没有稳定的行为基座可塑造）；对齐塑造的是「按人类偏好输出」而不是「知道更多」。跳过预训练等于从零学语言，跳过微调直接对齐则常常把模型训成「礼貌但不会干活」。",
        q_en: "Why can the three stages not be skipped or reordered?",
        a_en: "Because each contributes something the others cannot. Pretraining supplies general representations and world knowledge; without it fine-tuning merely fits one small dataset's distribution. Fine-tuning aligns that generality onto a task's format and labels; without it the alignment stage has no stable behavioural base to shape. Alignment sculpts 'output in line with preferences', not 'know more'. Skipping pretraining means learning language from scratch; skipping straight to alignment tends to produce a model that is polite and useless."
      }
    },

    "dl5-5": {
      title: "综合重构：从「能生成」到「分数可信」",
      title_en: "Synthesis: From Generating to Scoring Honestly",
      min: 15,
      target: "能对一个生成式模型给出可辩护的评价：说清它在优化什么、采样参数固定在哪、评测集与训练数据是否重叠、以及哪些分数只是过程指标；并算清部署它的显存与延迟账。",
      target_en: "Give a defensible verdict on a generative model: state what it optimises, which sampling parameters were pinned, whether the eval set overlaps the training data, and which numbers are merely process metrics - plus the memory and latency arithmetic of serving it.",
      summary: [
        "本章的一条主线收束成三句话：dl5-1 说明生成模型在优化什么（分布，而不是某个类别）；dl5-2/5-3 说明 Transformer 怎么把序列建模做成可堆叠、可并行的一层（并欠下顺序与平方复杂度两笔账）；dl5-4 说明用什么目标喂它、以及压缩与部署决定了它能不能落地。这三段合起来就是「现代大模型的地基」。",
        "先破一个最常见的误解：采样温度与幻觉无关。temperature/top-p 只改变输出分布的形状（更发散或更保守），它们不会让模型「知道更多事实」。把温度从 0.2 调到 0.8 然后抱怨「开始胡说八道」，因果是反的——幻觉来自训练目标（最大化似然，而非事实性）与知识缺口，温度只是让它更早暴露。要真的减少幻觉，得动检索、工具调用与拒答训练（agi2/agi3），而不是动那个旋钮。",
        "评测不可靠的三层要分层控制：自动指标层（困惑度、BLEU/ROUGE 与人类判断相关性有限，且换实现换分词就会漂移）；数据层（基准污染，测试题混进训练语料，分数变成记忆测试，agi34 已展开）；人评层（评分者不一致、位置偏好、长度偏好——长回答天然更容易拿高分）。任何一层没被控制，「我们更好」这句话就不成立。",
        "LLM 当评审（自动打分）是省钱的折中而不是免检答案：它便宜、可扩，但会偏向自家模型、偏向长答案，还会被措辞带偏。至少要做三件事——候选顺序随机交换、多个不同源的评审模型、以及抽 50~100 条做人工锚定，并报告三者的一致率。它评的是「看起来好不好」，不是「做对了没有」。",
        "把三段式的成本自查表随身带上：预训练问「拿不拿得到足够多且干净的无标注语料，以及付得起的算力」；微调问「标签有多少、质量如何、旧能力会不会被冲掉、评测集要不要跟着更新」；对齐问「偏好数据是谁的偏好、奖励模型会被怎么钻空子」。任何一段的答案是「不知道」，就不要开始那一段。",
        "部署侧的硬账（把 dl2-5 与 dl5-2 合起来算）：显存 = 权重（参数量 × 每参数字节）+ KV 缓存（2 × 层数 × kv 头数 × 头维 × 上下文 × 并发）+ 激活与碎片。粗算一个 7B fp16：权重约 13 GiB，4k 上下文下每条序列的 KV 缓存约 0.5 GiB，32 路并发就是 16 GiB——「装得下模型」与「扛得住并发」是两个不同的问题，后者常常先炸。延迟则受串行解码支配，吞吐才是受带宽支配。",
        "一份「我的生成模型是否可信」清单，逐条打勾：训练与推理的 mask 与位置编码完全一致；解码策略（greedy/beam/temperature/top-p、随机种子）固定并写进报告；评测集与训练数据做过 n-gram 查重；同一结论至少换两三个指标且并排给出基线；有至少一批人评样本作锚；失败样本能用同一份配置复现。缺一条，分数就降一级可信度。",
        "指向 agi 段：到这里 dl1~dl5 的地基完成——从单个神经元、一个训练循环、卷积、序列建模，一直到一个可部署的 Transformer。接下来 agi1 讲怎么从奖励里学决策（并把「指标会被钻空子」这件事推到极致），agi2 把模型接成应用，agi3 讲多模态与智能体。你在 dl5 学会的两件事——算显存、怀疑分数——正是那三章的工程起点。"
      ],
      summary_en: [
        "The chapter's thread closes in three sentences. dl5-1 said what a generative model optimises - the distribution, not a class. dl5-2 and dl5-3 showed how Transformer turns sequence modelling into a stackable, parallel layer, while taking on two debts, order and quadratic cost. dl5-4 covered what objective feeds it and how compression and serving decide whether it can ship. Together those three are the foundation of every modern large model.",
        "Break the most common misconception first: sampling temperature has nothing to do with hallucination. temperature and top-p only reshape the output distribution - more diffuse or more conservative - they cannot make the model know more facts. Turning the temperature from 0.2 up to 0.8 and then complaining that it 'started making things up' inverts causality; hallucination comes from the training objective (maximum likelihood, not factuality) and from knowledge gaps, and temperature only exposes it earlier. Reducing it means retrieval, tools and refusal training (agi2/agi3), not that knob.",
        "Control the three layers of unreliable evaluation separately. Metric layer: perplexity, BLEU and ROUGE correlate only loosely with humans and drift when you change the implementation or tokeniser. Data layer: benchmark contamination, where test items sit inside the training corpus, turns a score into a memory test (agi34). Human layer: rater disagreement, position bias and length bias, since longer answers win more points. If any one layer is uncontrolled, 'we are better' does not hold.",
        "LLM-as-judge is a cheap compromise, not a free pass: it scales, but it favours its own family, favours length, and is swayed by phrasing. Minimum hygiene: randomise candidate order, use several judges that are not from the same source as the system under test, hand-rate 50-100 items as an anchor, and report the agreement rate. It scores 'looks good', not 'got it right'.",
        "Carry the three-stage cost checklist: for pretraining ask whether you can get enough clean unlabelled text and afford the compute; for fine-tuning ask how many labels you have, how clean they are, what old capability forgetting costs you and whether the eval set has to be refreshed; for alignment ask whose preferences the data encodes and how the reward model will be gamed. If the answer to any of those is 'unknown', do not start that stage.",
        "The serving arithmetic, joining dl2-5 and dl5-2: memory = weights (parameters times bytes per parameter) + KV cache (2 times layers times kv heads times head dim times context times concurrency) + activations and fragmentation. For a 7B model in fp16, weights are about 13 GiB and a 4k-context sequence costs roughly 0.5 GiB of cache, so 32 concurrent sequences add 16 GiB. 'It fits' and 'it serves' are different questions, and the second usually fails first. Latency is bound by the serial decode loop; throughput is bound by bandwidth.",
        "A trustworthiness checklist, tick each line: masks and positional encoding identical between training and inference; decoding policy (greedy/beam/temperature/top-p and the seed) pinned and written into the report; the evaluation set n-gram checked against training data; at least two or three metrics side by side with baselines; a batch of human ratings as an anchor; failures reproducible from the same config. Miss one and the score drops a grade of credibility.",
        "Bridge to the agi track: dl1-dl5 are now complete - from a single neuron, through a training loop, convolutions and sequence modelling, to a deployable Transformer. agi1 teaches learning from reward (and pushes 'metrics get gamed' to its extreme), agi2 wires a model into an application, agi3 covers multimodal input and agents. The two habits built in dl5 - budgeting memory and distrusting scores - are exactly where those three chapters start."
      ],
      code: `import torch

# 评测可信度自查第一关：训练集与评测集做词级 n-gram 查重，命中就说明分数不可信
def word_grams(s, n=5):
    w = s.lower().split()
    return {tuple(w[i:i + n]) for i in range(max(len(w) - n + 1, 0))}

train = ["the model learns to predict the next token in a sequence",
         "convolution output size follows one simple formula"]
evalset = ["the model learns to predict the next word in a sequence",
           "a completely unrelated evaluation sentence used for testing"]
for e in evalset:
    shared = max((len(word_grams(t) & word_grams(e)) for t in train), default=0)
    print("shared 5-grams", shared, "|", e[:44])

# 采样配置必须被钉住：同一份 logits，四种设置给出四种分布
logits = torch.tensor([2.0, 1.5, 1.0, 0.5, 0.0])
p0 = torch.softmax(logits, -1)
srt, idx = torch.sort(p0, descending=True)
keep = srt.cumsum(-1) - srt <= 0.9
# 核采样保留的是"累计概率刚过 0.9"的最小前缀，其余位置在 softmax 前置为 -inf
keep_back = torch.zeros_like(keep).scatter(0, idx, keep)
for name, lg in (("plain", logits),
                 ("T=0.5", logits / 0.5),
                 ("T=2", logits / 2.0),
                 ("top-p 0.9", logits.masked_fill(~keep_back, float("-inf")))):
    p = torch.softmax(lg, -1)
    entropy = float(-(p * (p + 1e-12).log()).sum())
    print(name, "top1", int(p.argmax()), "max prob", round(float(p.max()), 3), "entropy", round(entropy, 3))

# 一致性检查：训练与推理用的因果掩码必须是同一个东西
T = 5
causal = torch.triu(torch.ones(T, T, dtype=torch.bool), diagonal=1)
print("row 0 visible keys:", (~causal[0]).tolist())`,
      pit: "把「换了更低的温度，评测分数涨了」当成模型变强，并写进版本对比表：温度改变的是分布形状，同一条数据在 T=0.2 与 T=1.0 下的分数可以差很多，而模型权重一个都没变。任何一次对比都必须先把解码配置钉死（同一 temperature、同一 top-p、同一 seed、同一最大长度），否则你比较的是两个解码器而不是两个模型。",
      pit_en: "Reading 'I lowered the temperature and the score went up' as a stronger model and putting it in the version table. Temperature reshapes the distribution, so the same item can score very differently at T=0.2 and T=1.0 while not one weight has changed. Every comparison must pin the decoding config first - same temperature, same top-p, same seed, same max length - otherwise you are comparing two decoders, not two models.",
      ex: {
        q: "为什么「训练/推理一致性」在生成模型里比在分类模型里重要得多？",
        a: "因为生成模型的输入是它自己上一步的输出，任何一处训练与推理不一致（mask 不同、位置编码偏移、padding 侧不同、dropout 没关）都会被下一步继续放大，形成系统性偏移；而分类模型只做一次前向，同样的不一致通常只带来一次可测量的小偏差。这也是为什么自查表要把「mask 与位置编码完全一致」放在第一位。",
        q_en: "Why does train/inference consistency matter far more for generative models than for classifiers?",
        a_en: "Because a generative model's input at step t is its own output at step t-1, so any mismatch between training and inference - a different mask, an offset in positions, padding on the other side, dropout left on - compounds into the next step and drifts systematically. A classifier runs one forward pass, where the same mismatch costs one small measurable bias. That is why the checklist puts 'masks and positions identical' first."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择/判断/填空混排） ---------- */
  quizAdd: {
    dl3: [
      {
        q: "输入边长 32，卷积核 k=3、步长 s=2、填充 p=1，输出边长是？",
        o: ["15", "16", "17", "32"],
        a: 1,
        why: "公式是 floor((32 + 2·1 − 3)/2) + 1 = floor(31/2) + 1 = 15 + 1 = 16。漏掉那个 +1 会得到 15，忘了填充则会得到 15 与 16 之间的其它错值。",
        q_en: "With input side 32, kernel k=3, stride s=2 and padding p=1, what is the output side?",
        o_en: ["15", "16", "17", "32"],
        why_en: "floor((32 + 2*1 - 3)/2) + 1 = floor(31/2) + 1 = 15 + 1 = 16. Dropping the +1 gives 15, which is the most common off-by-one here."
      },
      {
        q: "把主干所有参数设为 requires_grad_(False)，但整个模型仍在 model.train() 下训练，会发生什么？",
        o: ["完全冻结，没有任何变化", "BatchNorm 的 running_mean/running_var 仍被你的数据改写", "模型自动切到 eval 模式", "参数量翻倍"],
        a: 1,
        why: "requires_grad 只管「要不要梯度」，train/eval 才管「BN 用 batch 统计还是 running 统计、dropout 是否生效」。冻结主干必须两件事一起做，否则预训练统计量会被小数据覆盖。",
        q_en: "You set every backbone parameter to requires_grad_(False) but keep the whole model in model.train(). What happens?",
        o_en: ["Nothing changes; it is fully frozen", "BatchNorm running_mean/running_var are still rewritten by your data", "The model switches to eval mode automatically", "The parameter count doubles"],
        why_en: "requires_grad only governs gradients; train/eval governs whether BN uses batch or running statistics and whether dropout fires. Freezing needs both, otherwise your small dataset overwrites the pretrained statistics."
      },
      {
        q: "判断：深度可分离卷积把参数量降到 k²·Cin + Cin·Cout，因此它与普通卷积的表达能力完全等价。",
        type: "judge", a: 1,
        why: "省的是参数，也砍掉了通道的联合观察：逐通道阶段每个核只能看到一个通道，通道之间只能靠后面那层 1×1 线性混合，跨通道的高阶组合能力实实在在下降了。",
        q_en: "True or false: because depthwise separable convolution reduces parameters to k²*Cin + Cin*Cout, it is exactly as expressive as a normal convolution.",
        why_en: "False. The saving comes from removing joint channel viewing: in the depthwise stage each kernel sees one channel only, and channels meet solely through the following 1x1 linear mix, so higher-order cross-channel combinations really are lost."
      },
      {
        q: "卷积输出边长公式为 out = floor((in + 2p − k)/s) + ______（填数字）。",
        type: "fill", ans: ["1", "一"],
        why: "起点是「第一个窗口本身占一个位置」，所以必须加 1；把整除当作最终结果是最常见的差一错误。",
        q_en: "The convolution size rule is out = floor((in + 2p - k)/s) + ______ (fill in a digit).",
        why_en: "The first window already occupies one output position, so the +1 is mandatory; treating the integer division as the whole answer is the classic off-by-one."
      }
    ],
    dl4: [
      {
        q: "注意力分数为什么要除以 sqrt(d)（d 为每维向量长度）？",
        o: ["为了让输出落在 0~1 之间", "点积方差约为 d，不缩放会让 softmax 进入饱和区、梯度趋零", "为了减少计算量", "为了让注意力矩阵对称"],
        a: 1,
        why: "两个 d 维随机向量的点积方差约等于 d，分数随 d 变大而变大，softmax 变得极硬，梯度几乎为 0——这正是「注意力一加就训不动」的原因。",
        q_en: "Why are attention scores divided by sqrt(d)?",
        o_en: ["To keep outputs between 0 and 1", "Dot-product variance grows about linearly with d, so without scaling softmax saturates and gradients vanish", "To reduce computation", "To make the attention matrix symmetric"],
        why_en: "The dot product of two random d-dimensional vectors has variance about d; unscaled scores push softmax into its hard, near-zero-gradient regime, which is exactly why attention can freeze training."
      },
      {
        q: "训练时第 t 步喂真值、推理时喂模型自己的输出，这种不一致带来的问题叫什么？",
        o: ["梯度消失", "曝光偏差", "数据泄漏", "过拟合"],
        a: 1,
        why: "即 exposure bias：模型从未学过「在自己已经出错的序列上继续」，所以推理时一步错就雪崩。可用 scheduled sampling 缓解。",
        q_en: "Training feeds ground-truth tokens at step t while inference feeds the model's own output. What is this mismatch called?",
        o_en: ["Vanishing gradient", "Exposure bias", "Data leakage", "Overfitting"],
        why_en: "Exposure bias: the model never learns to recover from its own earlier mistakes, so one wrong token at inference cascades. Scheduled sampling is the usual mitigation."
      },
      {
        q: "判断：长度为 T 的 RNN 在反向传播时，梯度要沿时间连乘 T 次权重，相当于穿过一个 T 层的前馈网络。",
        type: "judge", a: 0,
        why: "∂h_T/∂h_t 是 T−t 个 W_h 与激活导数的乘积，所以「时间步」在梯度公式里就扮演「层数」，这也是 RNN 比同深度前馈网络更容易消失/爆炸的根本原因。",
        q_en: "True or false: backpropagating through an RNN of length T multiplies the gradient by the weight T times, as if traversing a T-layer feedforward network.",
        why_en: "True. dh_T/dh_t is a product of T-t copies of W_h times activation derivatives, so time steps act as layers in the gradient formula - the real reason RNNs vanish or explode more readily than equally deep feedforward nets."
      },
      {
        q: "PyTorch 里避免 padding 步污染最终隐状态的函数叫 ______（填函数名）。",
        type: "fill", ans: ["pack_padded_sequence", "pack_padded_sequence()"],
        why: "它让每条序列只计算自己的长度，配合 pad_packed_sequence 还原；不打包时 padding 会被当成真实时间步继续改写隐状态。",
        q_en: "The PyTorch function that stops padding steps from contaminating the final hidden state is called ______.",
        why_en: "pack_padded_sequence lets each sequence run only its own length, with pad_packed_sequence to restore it; unpadded, padding positions update the state like any real step."
      }
    ],
    dl5: [
      {
        q: "训练自回归 Transformer 时忘记加因果掩码，最典型的表现是？",
        o: ["显存立刻爆炸", "训练 loss 极低、分数漂亮，但生成结果完全不可用", "报维度不匹配错误", "收敛变慢但结果正常"],
        a: 1,
        why: "没有掩码时第 t 位可以直接看到第 t+1 位的答案，训练任务被「抄答案」完成；推理时未来不存在，模型就什么都不会生成。",
        q_en: "What is the typical symptom of forgetting the causal mask when training an autoregressive Transformer?",
        o_en: ["Memory explodes immediately", "Training loss is extremely low and scores look great, but generated output is useless", "A dimension mismatch error", "Slower convergence but normal results"],
        why_en: "Without the mask, position t can read the answer at t+1, so training becomes copywork; at inference the future does not exist and the model can produce nothing sensible."
      },
      {
        q: "关于困惑度（perplexity），下列说法正确的是？",
        o: ["它越低说明模型陈述的事实越正确", "同一文本换一种分词方式，数字仍然可比", "它是 token 级指标，换分词器就不可比，且只奖励「像人写的」", "它可以替代人工评测"],
        a: 2,
        why: "PPL = exp(平均 NLL)，分母是 token 数，所以换分词器就换了口径；它衡量的是与人类文本的相似程度，与事实性无关。",
        q_en: "Which statement about perplexity is correct?",
        o_en: ["Lower means more factually correct", "The number stays comparable across tokenisations of the same text", "It is a token-level metric, incomparable across tokenisers, and rewards looking human", "It can replace human evaluation"],
        why_en: "Perplexity is exp(mean NLL) per token, so changing the tokeniser changes the denominator and the meaning; it measures resemblance to human text, not correctness."
      },
      {
        q: "判断：把采样温度从 0.8 降到 0.2 可以让模型少编造事实。",
        type: "judge", a: 1,
        why: "温度只对 logits 缩放，改变的是分布的锐度与多样性，模型的参数与知识一点没变。幻觉来自训练目标与知识缺口，要减它得靠检索、工具与拒答训练。",
        q_en: "True or false: lowering the sampling temperature from 0.8 to 0.2 makes the model invent fewer facts.",
        why_en: "False. Temperature only rescales logits, changing distribution sharpness while the parameters and knowledge stay identical. Hallucination comes from the training objective and knowledge gaps, and is addressed with retrieval, tools and refusal training."
      },
      {
        q: "序列长度 T 翻倍时，自注意力分数矩阵的元素数变成原来的 ______ 倍（填数字）。",
        type: "fill", ans: ["4", "四"],
        why: "分数矩阵是 T×T（还要乘 batch 与头数），所以元素数随长度平方增长；这是长上下文显存与成本问题的根源。",
        q_en: "When the sequence length T doubles, the number of entries in the self-attention score matrix becomes ______ times larger.",
        why_en: "The score matrix is T by T (times batch and heads), so entries grow quadratically - the root of long-context memory and cost."
      }
    ]
  },

  /* ---------- 词典：分类只用 训练与数据 / 基础概念 / 应用与智能体 / 评测与安全 ---------- */
  terms: [
    { term: "感受野", term_en: "Receptive Field", cat: "基础概念",
      short: "输出上一个像素回头看时，能覆盖到的输入区域大小。",
      short_en: "How large an input region one output pixel can see back at.",
      detail: ["两层 3×3（步长 1）等效 5×5、三层等效 7×7，比一层 7×7 参数更少、非线性更多。", "感受野小于目标时模型根本看不到完整物体，这属于结构问题，调学习率救不回来。"],
      detail_en: ["Two 3x3 layers with stride 1 act like a 5x5 and three like a 7x7, with fewer parameters and more nonlinearity than a single 7x7.", "If the field is smaller than the object, the model literally never sees it whole - a structural fault no learning rate can rescue."],
      vs: "感受野管「看多大」，通道数管「记住多少种特征」。",
      vs_en: "The receptive field bounds how much is seen; the channel count bounds how many features are held." },
    { term: "权值共享", term_en: "Weight Sharing", cat: "基础概念",
      short: "同一份卷积核在图像每个位置上重复使用，参数量与尺寸无关。",
      short_en: "One kernel is reused at every position, so parameters do not depend on image size.",
      detail: ["它和局部性一起才让卷积省参数：只局部不共享等于每套小权重一份，只共享不局部就是全连接。", "RNN 把同一组权重沿时间复用，是同一想法换了轴；这也是它能吃任意长度的原因。"],
      detail_en: ["Locality must hold alongside it: local without shared is one small weight set per position, shared without local is a dense layer.", "An RNN reuses one weight set along time - the same idea on another axis, and the reason it accepts any length."],
      vs: "权值共享换来参数与尺寸无关，代价是放弃位置特异性。",
      vs_en: "Weight sharing buys size-independent parameters at the cost of position specificity." },
    { term: "输出尺寸公式", term_en: "Conv Output Size Rule", cat: "训练与数据",
      short: "out = floor((in + 2p − k)/s) + 1，CNN 差一错误的唯一来源。",
      short_en: "out = floor((in + 2p - k)/s) + 1, the sole source of off-by-one errors in CNNs.",
      detail: ["漏掉 +1、把 floor 当成四舍五入、忘记 padding 只加 2p，是三个最常见错法。", "分割网络的 16/32 倍下采样要求输入是 32 的倍数，否则会被悄悄 pad，边缘指标糊在这里。"],
      detail_en: ["Forgetting the +1, reading floor as round, or treating padding as +p instead of +2p are the three usual mistakes.", "A 16- or 32-fold downsampling chain wants an input divisible by 32, otherwise it gets silently padded and boundary metrics bleed right there."],
      vs: "尺寸公式管形状对不对，padding 约定管那多余的一像素放哪。",
      vs_en: "The size rule checks whether shapes are right; the padding convention decides where the spare pixel lands." },
    { term: "深度可分离卷积", term_en: "Depthwise Separable Convolution", cat: "训练与数据",
      short: "逐通道卷积加 1×1 逐点卷积，参数降一个数量级但表达能力有损。",
      short_en: "A depthwise pass plus a 1x1 pointwise pass: an order of magnitude fewer parameters, with a real loss of expressiveness.",
      detail: ["参数量从 k²·Cin·Cout 降到 k²·Cin + Cin·Cout，但没有任何核能同时看到全部通道。", "省的是权重而不是访存：逐通道阶段访存模式差，实测加速往往远小于参数比。"],
      detail_en: ["Parameters drop from k*k*Cin*Cout to k*k*Cin + Cin*Cout, but no kernel ever sees all channels together.", "What shrinks is weight traffic, not memory access: the depthwise stage streams badly, so measured speedups fall well short of the parameter ratio."],
      vs: "分组卷积是它的一般形式（groups=g），1×1 卷积则负责把分开的通道重新混起来。",
      vs_en: "Grouped convolution is the general form (groups=g); the 1x1 is what remixes the channels afterwards." },
    { term: "迁移学习", term_en: "Transfer Learning", cat: "训练与数据",
      short: "站在预训练权重上只训（或少训）剩余部分，小数据的默认选择。",
      short_en: "Starting from pretrained weights and training only the rest, or as little of it as possible - the default for small data.",
      detail: ["判据只有一条：数据越少越该只训头；解冻要配小学习率并监控灾难性遗忘。", "预训练权重自带一份「契约」：resize 尺寸、通道顺序与那组 mean/std，违约会让分数莫名地低。"],
      detail_en: ["One rule governs it: the less data, the more you should train only the head; unfreezing needs a small rate and catastrophic-forgetting checks.", "A checkpoint ships with a contract - resize length, channel order and its mean/std - and breaking it produces mysteriously bad accuracy."],
      vs: "迁移学习换的是任务头，数据增强换的是同一批样本的视图，两者解决的不是同一个瓶颈。",
      vs_en: "Transfer learning swaps the task head; augmentation swaps views of the same samples. They fix different bottlenecks." },
    { term: "隐状态", term_en: "Hidden State", cat: "基础概念",
      short: "RNN 沿时间传递的固定长度向量，既是它的容量也是它的瓶颈。",
      short_en: "The fixed-length vector an RNN carries through time - simultaneously its capacity and its bottleneck.",
      detail: ["容量不随输入长度增长，所以长输入必然丢信息，这是数学约束而非训练不足。", "它每步被覆写一次，所以「遗忘」不是缺陷而是设计；注意力把这条通道换成了「随时回看」。"],
      detail_en: ["Its capacity does not grow with the input, so long inputs must lose information - a capacity law, not undertraining.", "It is overwritten every step, so forgetting is the design rather than a defect; attention replaces that channel with looking back on demand."],
      vs: "隐状态是「压缩后的过去」，注意力缓存是「原样保留的过去」。",
      vs_en: "A hidden state is a compressed past; an attention cache is the past kept verbatim." },
    { term: "门控", term_en: "Gating", cat: "基础概念",
      short: "用 sigmoid 输出的 0~1 连续系数乘在信息通路上，决定记多少忘多少。",
      short_en: "A sigmoid output between 0 and 1 multiplies an information path, deciding how much to keep and how much to drop.",
      detail: ["门的可微性让「记住多少」本身成为可被梯度学习的对象，这是 LSTM 相对 RNN 的本质改变。", "遗忘门偏置初值抬到 1 才让起步阶段默认「保存」，否则等于每步先减半。"],
      detail_en: ["Differentiability makes 'how much to keep' something gradients can learn, which is the essential change from an RNN to an LSTM.", "Raising the forget-gate bias to 1 makes retention the default at the start; otherwise every step halves what it stored."],
      vs: "门控缩放的是「信息量」，残差提供的是「梯度通路」，两者常一起出现但作用不同。",
      vs_en: "Gates scale information flow; residuals provide a gradient highway. They often co-occur but do different jobs." },
    { term: "曝光偏差", term_en: "Exposure Bias", cat: "训练与数据",
      short: "训练见真前缀、推理见自己前缀，导致错误沿序列累积。",
      short_en: "Training sees true prefixes while inference sees its own, so errors compound along the sequence.",
      detail: ["teacher forcing 让训练高效可并行，代价是模型从未学过从自己的错误里恢复。", "teacher forcing 下的 loss 是「每步条件概率」，它和自由运行生成质量不同向，不能并列汇报。"],
      detail_en: ["Teacher forcing makes training efficient and parallel, at the price of never teaching the model to recover from its own mistakes.", "A teacher-forced loss is a per-step conditional likelihood and does not move with free-running quality, so the two must not be reported as one."],
      vs: "曝光偏差是训练/推理输入分布的差异，数据泄漏是训练/验证样本的差异。",
      vs_en: "Exposure bias is a train/inference input-distribution gap; leakage is a train/validation sample gap." },
    { term: "位置编码", term_en: "Positional Encoding", cat: "基础概念",
      short: "把顺序信息注入置换等变注意力的那一套机制，不是可选项。",
      short_en: "Whatever injects order into a permutation-equivariant attention - not an optional extra.",
      detail: ["学习式绝对编码是一张 (max_len, d) 的表，超出长度就无行可取；RoPE 与 ALiBi 才让长度外推成为可能。", "正弦编码不是「更老的方案」，它的问题在于实践中外推同样会退化，而它没有相对距离的直接表达。"],
      detail_en: ["A learned absolute scheme is a table of (max_len, d) rows with nothing to fetch past the trained length; RoPE and ALiBi are what make extrapolation possible.", "Sinusoidal encoding is not merely 'older': it degrades in practice too, and it offers no direct representation of relative distance."],
      vs: "位置编码管「谁在前」，因果掩码管「能看谁」，两者都作用在注意力上但互不替代。",
      vs_en: "Positional encoding says which came first; the causal mask says who may be looked at. Both touch attention, neither replaces the other." },
    { term: "填充掩码", term_en: "Padding Mask", cat: "训练与数据",
      short: "在 softmax 之前把补齐位置的分数设为 −inf，使其权重严格为 0。",
      short_en: "Setting padded scores to -inf before the softmax so their weight is exactly zero.",
      detail: ["必须加在 softmax 之前；事后置零再归一，与真正屏蔽在数学上并不等价。", "整行被屏蔽时 softmax 只会给出 nan，表现为「模型一动不动而不报错」，用 assert mask.any(-1).all() 拦。"],
      detail_en: ["It belongs before the softmax; zeroing columns afterwards and renormalising is not the same arithmetic.", "If a whole row is masked, softmax returns nan, giving the 'stalled without error' symptom - assert mask.any(-1).all() catches it."],
      vs: "padding mask 屏蔽不存在的键（形状沿 T_k），causal mask 屏蔽未来的位置（形状沿 T_q×T_k）。",
      vs_en: "A padding mask hides keys that do not exist (along T_k); a causal mask hides positions that have not happened (along T_q by T_k)." },
    { term: "因果掩码", term_en: "Causal Mask", cat: "训练与数据",
      short: "把注意力分数矩阵的上三角设为 −inf，禁止第 t 位看未来。",
      short_en: "Filling the upper triangle of the score matrix with -inf so position t cannot look ahead.",
      detail: ["忘掉的后果不是报错而是「训练分数极好而生成完全不可用」，是自回归模型最贵的一类 bug。", "交叉注意力不需要它：源端句子是输入而不是答案，只需要屏蔽 padding。"],
      detail_en: ["Omitting it does not crash; it yields superb training scores and unusable generation, the most expensive class of autoregressive bug.", "Cross-attention does not need one: the source sentence is an input, not the answer, so only padding is masked."],
      vs: "因果掩码是训练/推理必须一致的约束，temperature 只是推理时的分布整形，两者层级不同。",
      vs_en: "The causal mask is a constraint training and inference must share; temperature merely reshapes the distribution at inference. Different levels entirely." },
    { term: "多头注意力", term_en: "Multi-Head Attention", cat: "基础概念",
      short: "把 d 维切成 h 份各做一种关系模式，每头降到 d/h 以保持总成本。",
      short_en: "Split d into h chunks, each capturing one relation type, each head narrowed to d/h so total cost holds.",
      detail: ["一个 softmax 只能给出一归一分布，也就是单一关系模式，这是多头存在的硬理由。", "头数不是越多越好：头太窄时每个子空间表达力不足，且推理时 KV 缓存按头数线性增长。"],
      detail_en: ["One softmax yields exactly one normalised distribution, i.e. one relation pattern - the hard reason heads must be multiple.", "More heads is not better: too-narrow heads lose sub-space expressiveness, and the KV cache grows linearly with head count at inference."],
      vs: "多头是「并行多种关系」，通道数是 CNN 里「并行多种特征」，同一思想的两种实现。",
      vs_en: "Heads parallelise relation types the way CNN channels parallelise feature types - the same idea implemented twice." },
    { term: "二次复杂度", term_en: "Quadratic Cost", cat: "基础概念",
      short: "注意力要为每对位置算一次相似度，成本随长度平方增长。",
      short_en: "Attention computes one similarity per pair of positions, so cost grows quadratically with length.",
      detail: ["分数矩阵元素数是 B·h·T²：T 翻倍就是 4 倍，fp16 下每层的字节数可以直接口算。", "分块实现省的是显存与带宽，下三角只省常数；真正改变复杂度阶数要靠滑窗、稀疏或低秩，而那会牺牲表达能力。"],
      detail_en: ["The score tensor holds B*h*T^2 entries, so doubling T means four times as much, and the fp16 byte count of one layer is pure arithmetic.", "Tiling saves memory and bandwidth, and using only the lower triangle saves a constant; only sliding windows, sparsity or low rank change the order, and they buy it with expressiveness."],
      vs: "二次的是「成对相似度」这一件事，FFN 的成本随长度只是线性增长。",
      vs_en: "The quadratic term is the pairwise similarity only; the FFN scales linearly with length." },
    { term: "知识蒸馏", term_en: "Knowledge Distillation", cat: "训练与数据",
      short: "让小模型拟合大模型的软标签，而不是只拟合硬类别。",
      short_en: "Training a small student to match a large teacher's soft labels rather than the hard class alone.",
      detail: ["软标签里带着类间关系（哪个类别「有点像」），这是硬标签读不出来的信息。", "容易只学到风格而丢长尾与新颖性，所以压缩之后必须做任务级回归，不能只看整体指标。"],
      detail_en: ["Soft labels carry inter-class resemblance, information a hard label simply does not contain.", "The student tends to copy style while losing tail and novelty, so compression needs task-level regression rather than one aggregate metric."],
      vs: "蒸馏牺牲的是长尾分布，量化牺牲的是数值精度，剪枝牺牲的是结构容量。",
      vs_en: "Distillation trades away tail distribution, quantisation trades numerical precision, pruning trades structural capacity." },
    { term: "困惑度", term_en: "Perplexity", cat: "评测与安全",
      short: "exp(平均 NLL)，token 级指标，只奖励「像人写的」。",
      short_en: "exp(mean NLL), a token-level metric that rewards resembling human text.",
      detail: ["分词器不同就完全不可比：同一段文本切成几个或很多 token，分母就变了。", "它与事实性无关，低困惑度的模型照样能自信地编造，所以不能替代任务级评测与人评。"],
      detail_en: ["Different tokenisers make it incomparable: the same passage split into more or fewer tokens changes the denominator.", "It has no relation to factuality, so a low-perplexity model can fabricate confidently; it never replaces task evaluation and human anchors."],
      vs: "困惑度是过程指标，任务分数才是结果指标，两者可以反向而动。",
      vs_en: "Perplexity is a process metric and task scores are outcome metrics; they can move in opposite directions." }
  ],

  achievements: [
    { id: "shape_accountant", icon: "🔷", name: "尺寸核算员", name_en: "Shape Accountant",
      desc: "完成 dl3 · CNN 与计算机视觉 全部课节", desc_en: "Finish every lesson of dl3 CNN and Computer Vision",
      check: ["dl3"] },
    { id: "sequence_architect", icon: "🧵", name: "序列结构设计师", name_en: "Sequence Architect",
      desc: "完成 dl4 + dl5 · 从注意力到 Transformer", desc_en: "Finish dl4 and dl5, from attention to the Transformer",
      check: ["dl4", "dl5"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "输出边长 = floor((in + 2p - k) / s) + 1，那个 +1 就是最容易漏的一项": "output side = floor((in + 2p - k) / s) + 1, and that +1 is the term everyone drops",
    "同样的 64 个输出单元：全连接与 5x5 卷积的参数量差一个数量级": "the same 64 output units: dense and 5x5 convolution differ by an order of magnitude in parameters",
    "深度可分离：groups=Cin 让每个核只看一个通道，再用 1x1 跨通道混合": "depthwise separable: groups=Cin confines each kernel to one channel, then a 1x1 mixes across channels",
    "顺序错的张量常常\"尺寸刚好合法\"，view 更是连报错的机会都不给": "a wrongly ordered tensor is often 'legal by coincidence', and view does not even leave room for an error",
    "这条报错在说通道数，不在说你想问的\"我的图为什么是碎的\"": "this message is about channel count, not about the question you asked, which is why your image looks shredded",
    "池化 vs 全局池化：一个保留局部最强响应，一个把空间整体抹平": "pooling versus global pooling: one keeps the strongest local response, the other averages space away",
    "展平头与 GAP 头的参数量差多少（512 通道、8x8 分辨率、10 类）": "how much a flatten head costs versus a GAP head (512 channels, 8x8 map, 10 classes)",
    "pre-activation：先 norm+relu 再进卷积，梯度路径与 post-activation 不同": "pre-activation: norm and relu before the convolution, which gives a different gradient path than post-activation",
    "通道对不上时必须给捷径配 1x1 投影，否则 add 只能靠广播硬凑": "when channels differ the shortcut needs a 1x1 projection, otherwise the addition can only fake it with broadcasting",
    "小 batch 下 BatchNorm 会直接罢工：一个样本没有方差可估": "BatchNorm refuses to work with a batch of one: a single sample offers no variance to estimate",
    "冻结主干只是关掉梯度，BN 的运行统计仍然会在 train 模式下被你的数据改写": "freezing the backbone only stops gradients; in train mode BN still rewrites its running statistics from your data",
    "要真的冻住，那几层还得单独切回 eval": "to really freeze them, those layers also have to be switched back to eval",
    "预训练归一化是权重契约的一部分：尺度差 255 倍会让浅层直接饱和": "pretrained normalisation is part of the contract: a 255-fold scale difference saturates the early layers outright",
    "stages 由浅到深给 (kernel, stride)；r 是感受野，j 是累计步长": "stages list (kernel, stride) from shallow to deep; r is the receptive field, j the accumulated stride",
    "IoU 是检测指标的最小单元：交集比并集，通常要到 0.5 才算命中一个目标": "IoU is the atom of detection metrics: intersection over union, usually needing 0.5 to count as a hit",
    "三种任务的输出形状完全不同，混用等于换了一件事": "the three tasks have completely different output shapes; mixing them up means solving another problem",
    "定长约束：全连接层的输入宽度是写死的，变长文本必须先补齐": "the fixed-length constraint: a dense layer's input width is hard-coded, so variable text must be padded first",
    "把 h_0 当成叶子，它的梯度就是那条沿时间连乘链的总读数": "treat h_0 as a leaf: its gradient is the total reading of that product chain along time",
    "每一步都乘同一个 W_h：时间步在这里扮演的就是\"层数\"": "every step multiplies by the same W_h: time steps are playing the role of layers here",
    "双向只能用在\"整条序列都在手上\"的任务": "bidirectional is only for tasks where the whole sequence is already in hand",
    "遗忘门偏置默认是 0（sigmoid=0.5），起步就在\"忘掉一半\"": "the forget-gate bias defaults to 0 (sigmoid = 0.5), so it starts out forgetting half of everything",
    "bias_hh 的后 1/4 段就是遗忘门那一段": "the last quarter of bias_hh is exactly the forget gate",
    "变长：不打包的话，padding 步会继续改写隐状态": "variable length: without packing, padding steps keep rewriting the hidden state",
    "只有被补齐的那两条被污染，第一条长度正好等于 T，差值为 0": "only the two padded sequences are contaminated; the first really has length T, so its delta is zero",
    "点积的方差约为 d，不除以 sqrt(d) 时 softmax 会落进饱和区": "dot-product variance is about d, so without dividing by sqrt(d) the softmax lands in its saturated zone",
    "mask 必须在 softmax 之前加，且用 -inf，权重才会严格为 0": "the mask goes in before the softmax, and only with -inf does the weight become exactly zero",
    "Q 与 K 必须是不同的投影：同一份数据会让对角线占优，看不出饱和差异": "Q and K must be different projections: identical inputs make the diagonal dominate and hide the saturation difference",
    "padding mask：真实键与补齐键混在一批里，不屏蔽时 pad 会分走权重": "padding mask: real and padded keys sit in the same batch, and unmasked, padding takes its share of the weight",
    "一条随机游走：下一步只能 +1 或 +2，两种可能各半——所以永远有不可消除的不确定性": "a random walk whose next step is +1 or +2 with even odds, so some uncertainty can never be removed",
    "teacher forcing：真前缀一次喂进去，所有位置并行算 loss": "teacher forcing: feed the true prefix in one go and score every position in parallel",
    "这条随机游走的固有不确定性是 ln(2)=0.693：低于它说明模型已经记住了这条具体路径": "the walk's intrinsic uncertainty is ln(2) = 0.693; below it, the model has memorised this particular path",
    "自由运行：每一步都仍然合法，但整条路径和参照序列早就分岔了": "free running: every step still looks legal, but the path diverged from the reference long ago",
    "核采样：按累计概率动态截断，长尾在低熵位置会被自动收短": "nucleus sampling: truncate by cumulative probability, so the tail shrinks automatically where the distribution is peaked",
    "三条 mask 各管一处：键侧 padding、查询侧 causal、目标侧 ignore_index": "three masks, three jobs: padding on the key side, causal on the query side, ignore_index on the target side",
    "一整个 batch 都被屏蔽时，softmax 只可能给出均匀分布或 nan，模型从此不动": "when a whole row is masked, softmax can only return uniform or nan, and the model stops moving",
    "忘记 ignore_index 时，近一半位置在罚\"没输出 pad\"，loss 虚高且方向错": "forget ignore_index and nearly half the positions are punished for not emitting pad, inflating the loss in the wrong direction",
    "按长度分桶能压住显存尖峰：同一 batch 里长度差 10 倍就是浪费 10 倍": "bucketing by length caps the memory spikes: a 10x length spread inside one batch is a 10x waste",
    "两个簇加一点噪声：数据本身有结构，重构与 KL 才会真的互相拉扯": "two clusters plus a little noise: only structured data makes reconstruction and KL genuinely pull against each other",
    "用 logvar 而不是 std：恒正、数值稳，随机性挪到 eps 上梯度才穿得过采样": "use logvar not std: positive by construction and numerically stable, and moving randomness onto eps is what lets gradients pass the sampling",
    "KL 项把隐空间拉向标准正态，这正是\"能随机采样\"所付的代价": "the KL term drags the latent space toward a standard normal, which is precisely the price of being able to sample at random",
    "扩散目标就是一个朴素的去噪 MSE：预测注入的噪声，而不是直接造图": "the diffusion objective is a plain denoising MSE: predict the injected noise rather than draw the image directly",
    "GAN 的 loss 数值不可比：判别器完胜时它的 loss 最小，而那正是生成器学不动的时刻": "GAN loss values are not comparable: the discriminator's loss is smallest when it has totally won, which is exactly when the generator learns nothing",
    "(B,T,D) 拆成 (B,H,T,d)：多头只是把特征维换成\"更多头 + 每头更窄\"": "splitting (B,T,D) into (B,H,T,d): multiple heads just trades feature width for more, narrower heads",
    "因果掩码必须在 softmax 之前把上三角填 -inf，否则第 t 位能看见未来的答案": "the causal mask must fill the upper triangle with -inf before the softmax, otherwise position t reads the future answer",
    "用框架实现核对一遍：is_causal=True 时第 0 位只能看自己，输出必须等于 v 的第 0 行": "cross-check against the framework: with is_causal=True, position 0 sees only itself, so its output must equal row 0 of v",
    "上下文翻倍时分数矩阵的字节数是 4 倍关系，这就是长上下文的显存账": "doubling the context quadruples the score matrix bytes - that is the whole long-context memory bill",
    "偶数列用 sin、奇数列用 cos：同一对坐标才能唯一确定一个位置": "sine on even columns, cosine on odd, so a pair of coordinates pins down one position uniquely",
    "没有位置编码时，池化后的表示对顺序完全无感——注意力本质上也是如此": "without positional encoding a pooled representation is blind to order - and attention is essentially the same",
    "学习式绝对位置编码只有一张 max_len 行的表，超出就没有对应行可取": "a learned absolute encoding is a table with max_len rows, and past that there is no row to fetch",
    "一层里的参数分配：注意力 4d^2，FFN（4x 扩展）8d^2": "parameter split inside one layer: attention 4d^2, FFN with a 4x expansion 8d^2",
    "困惑度只在同一个分词器内部可比：总 NLL 不变，切分方式变它就变": "perplexity is comparable only within one tokeniser: total NLL is fixed, but change the split and the number moves",
    "温度只改变分布形状，不会改变模型\"知道\"多少": "temperature only reshapes the distribution; it changes nothing about what the model knows",
    "部署侧的硬账：权重按 参数量 x 每参数字节；KV 缓存随层数、上下文与并发线性增长": "the serving arithmetic: weights are parameters times bytes per parameter, and the KV cache grows linearly with layers, context and concurrency",
    "那个 2 是 K 与 V 两份，缓存里不含注意力权重本身": "that factor 2 is the K and V copies; attention weights themselves are never cached",
    "评测可信度自查第一关：训练集与评测集做词级 n-gram 查重，命中就说明分数不可信": "trustworthiness check one: n-gram the evaluation set against the training data at word level - any hit makes the score untrustworthy",
    "采样配置必须被钉住：同一份 logits，四种设置给出四种分布": "the sampling config must be pinned: the same logits give four different distributions under four settings",
    "核采样保留的是\"累计概率刚过 0.9\"的最小前缀，其余位置在 softmax 前置为 -inf": "nucleus sampling keeps the shortest prefix whose cumulative probability passes 0.9 and sets everything else to -inf before the softmax",
    "一致性检查：训练与推理用的因果掩码必须是同一个东西": "consistency check: the causal mask used at training and at inference must be the very same object"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_DL345);
