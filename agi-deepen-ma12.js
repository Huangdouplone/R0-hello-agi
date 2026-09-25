/* ================================================================
 * R0:hello agi · 课程深化层 ⑫（ma1 线性代数 I · 向量与矩阵 / ma2 线性代数 II · 空间与特征）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「数学基石」前半段（ma1/ma2）从每节 3 要点深化到 8 要点，核心是把
 *       「数学符号 ↔ 代码 ↔ AI 里的用途」三条线对齐，并把数值陷阱（形状、内存布局、
 *       条件数、dtype、秩容差）讲到能自查的程度；两章各加一节「综合重构」收口课。
 * 写法约定（沿用已验收的 s12 样板）：
 *   1) 既有课节不写 title —— 合并时自动沿用主数据标题；
 *   2) 新课（m1-6 / m2-6）写 title / title_en / target / target_en，并且出现在 order 里；
 *   3) order 覆盖两章全部既有 id + 新增 id；quizAdd 用 {sid:[...]}；
 *   4) code 用 NumPy / 纯 Python，中文注释一律单独成行（行首 #），全部进 codeComments；
 *   5) summary_en 条数与中文严格相等且不含中文。
 * ================================================================ */

const DEEPEN_MA12 = {
  stages: ["ma1", "ma2"],

  order: {
    ma1: ["m1-0", "m1-1", "m1-2", "m1-3", "m1-4", "m1-5", "m1-6"],
    ma2: ["m2-1", "m2-2", "m2-3", "m2-4", "m2-5", "m2-6"]
  },

  lessons: {
    "m1-0": {
      title: "给 C++ 学习者的 Python 速成", title_en: "A C++ Learner's Python Primer", min: 14,
      target: "能用 Python 读懂并写出本站 AI 段需要的最小语法，并说清它与 C++ 在内存模型、除法方向、整数溢出上的三处关键差异。",
      target_en: "Read and write the minimal Python this site's AI track needs, and name the three key differences from C++: memory model, division direction and integer overflow.",
      summary: [
        "为什么 C++ 路线也要会一点 Python：本站数学与 AI 段（ma/sp/ml/dl/agi）的示例一律用 Python 写，因为这一段考的是算法与数值，不是语言——换工具不等于转方向。",
        "三分钟对照：`int x = 5;` 变成 `x = 5`（没有类型声明），`for (int i=0;i<n;i++)` 变成 `for i in range(n)`，花括号代码块变成缩进。",
        "最本质的差别是内存模型：C++ 里变量是一块内存，Python 里变量是一个绑定——`a = b` 不复制对象，只是多挂一个名字，改 b 指向的对象 a 也跟着变。",
        "整数没有溢出回绕：Python 的 int 是任意精度，`2 ** 100` 直接算得出来；同一段逻辑搬到 C++ 就得自己判断该用 long long 还是大数库。",
        "除法方向不同，这是移植时最容易翻车的一处：C++ 的 `-7 / 2` 向零截断得 `-3`，Python 的 `-7 // 2` 向下取整得 `-4`；`%` 的符号也跟着变。",
        "列表与字典对应 vector 与 map，但动态类型让你无法从声明读出元素类型——类型信息只能靠命名、注释和断言表达，这正是 C++ 编译器免费给你的东西。",
        "运行方式也不同：C++ 要编译链接，Python 直接解释执行；报错是 traceback（带调用栈）而不是编译诊断，学会读它是这一段的基本功。",
        "衔接：下一节 m1-1 起，每个公式都会配一段可本机运行的 Python；某行语法卡住时，回到这一节的对照表查。"
      ],
      summary_en: [
        "Why a C++ track needs some Python: every example in the math and AI chapters (ma/sp/ml/dl/agi) is written in Python, because that stretch tests algorithmic thinking, not language syntax — changing tools is not changing direction.",
        "Three-minute mapping: 'int x = 5;' becomes 'x = 5' with no type declaration, 'for (int i=0;i<n;i++)' becomes 'for i in range(n)', and braces become indentation.",
        "The deepest difference is the memory model: a C++ variable is a block of memory, a Python variable is a binding — 'a = b' copies no object, it just adds another name pointing at the same one.",
        "Integers never wrap: Python ints have arbitrary precision, so 2 ** 100 just works; porting the same logic to C++ forces you to choose long long or a bignum library.",
        "Division rounds the other way, the classic porting trap: C++'s -7 / 2 truncates toward zero to -3, while Python's -7 // 2 floors to -4 — and the sign of % follows suit.",
        "list and dict stand in for vector and map, but dynamic typing hides the element type in a way a C++ declaration never does; you must express it through naming, comments and assertions.",
        "Execution differs too: C++ compiles and links, Python runs directly, and failures arrive as a traceback with a call stack rather than a compile diagnostic — reading one is a basic skill here.",
        "Bridge: from m1-1 every formula comes with runnable Python; when a line of syntax blocks you, come back to this mapping table."
      ],
      code: `# 五分钟 C++ 到 Python 的对照（本机 python3 直接运行）
x = 5
# 上面这行对应 int x = 5;，但没有类型声明
names = ["a", "b"]
# 对应 std::vector，元素类型只能靠命名与注释表达
for i in range(3):
    # 对应 for (int i = 0; i < 3; i++)
    print(i, names[i % 2])
# 下面这行打印 -4 与 -3.5：Python 的整除向下取整，而 C++ 的 -7 除以 2 得 -3
print(-7 // 2, -7 / 2)
print(2 ** 100)
# 任意精度整数，C++ 需要 long long 或大数库
d = {"k": 1}
print(d.get("missing"))
# 返回 None；若在 C++ 用 map 的下标访问，会静默插入默认值`,
      pit: "把 C++ 直觉原样搬过来：以为 `a = b` 会复制（其实只是多一个名字，改对象两个名字都变），或以为 `//` 与 C++ 的整数除法同向（负数时一个向下取整、一个向零截断）。",
      pit_en: "Porting C++ intuition: assuming 'a = b' copies (it only adds a name, so mutating the object shows through both) and assuming '//' matches C++ integer division (one floors, the other truncates toward zero).",
      ex: {
        q: "为什么本站 AI 段用 Python 举例，而不是继续用 C++？",
        a: "因为这一段的目标是算法与数值本身，Python 能把样板压到最少；语言不是这一段要考的东西，需要 C++ 实现时会另外说明。",
        q_en: "Why does the AI track use Python instead of staying in C++?",
        a_en: "Because that stretch is about algorithms and numerics, and Python minimises boilerplate; where a C++ implementation matters, it is called out separately."
      }
    },

    

    /* ===================== ma1 线性代数 I · 向量与矩阵 ===================== */
    "m1-1": {
      min: 12,
      summary: [
        "向量就是一串有序数，同一个对象有两种读法：代数上是分量列表，几何上是空间里的箭头——长度和方向是它的全部信息，所以它既能装「一条样本的特征」，也能装「一个词的语义」。",
        "加法=分量相加、数乘=整体缩放，几何上就是箭头首尾相接与等比伸缩；因此「用户向量 = 0.7·电影A + 0.3·电影B」这类平均不是比喻，它严格落在两个箭头张成的方向上。",
        "点积 a·b = Σaᵢbᵢ = |a||b|cosθ，一个式子两种身份：既是「对应分量乘起来再求和」的算法，也是「b 在 a 方向上的投影长度 × |a|」的几何算子——最小二乘、PCA、注意力打分全都建在这一条上。",
        "余弦相似度 = 点积除以两个模长，把长度约掉只剩方向。推荐与检索默认用它，因为「同一部片子被看 100 次和被看 1 次」方向相同而点积差 100 倍；换成欧氏距离就会同时惩罚方向和长度，选错度量等于选错整个召回系统。",
        "点积的符号是可读的：>0 夹角为锐（同向成分）、=0 正交（互相不投影，ML 里读作「无重叠/线性无关」）、<0 钝角（反向）。但正交不等于无关——X 与 X² 可以完全正交却强相关，这条要在 m4-3 再撞一次。",
        "会出错的地方（一）：零向量。余弦的分母含模长，空 embedding 或被全零 padding 占位的行会得到 0/0 = nan，nan 顺着排序一路传染，页面表现成「某些条目永远排在最后」且没有任何报错；线上一律先过滤空向量或给分母加 eps。",
        "会出错的地方（二）：dtype 与累加顺序。点积本质是一次求和，int32 上做长向量点积会溢出回绕、float32 下累加顺序不同结果就不同；「相似度每天差最后一位」多半是这个，而不是模型不稳。",
        "衔接：这一节是 ma1 乃至整条 AI 路线的地基。走 Python 路线的人已有 py1~py4 打底；走 C++ 路线的人刚学完 s1~s18 与算法段，请先看下一节 m1-0 的 Python 速成对照，再回到这里。下一节把这些数排成表——矩阵——并解释为什么「形状」比「数值」更容易错。"
      ],
      summary_en: [
        "A vector is an ordered list of numbers, and the same object reads two ways: algebraically a list of components, geometrically an arrow in space. Length and direction are all it carries, which is why one vector can hold 'a row of features' just as well as 'the meaning of a word'.",
        "Addition is componentwise and scalar multiplication is uniform scaling — geometrically, tip-to-tail arrows and a zoom. So 'user vector = 0.7*filmA + 0.3*filmB' is not a metaphor: the result provably lies in the direction spanned by those two arrows.",
        "The dot product a.b = sum of a_i*b_i = |a||b|cos(theta) wears two hats at once: an algorithm (multiply matching components, then sum) and a geometric operator (the projection of b onto a, scaled by |a|). Least squares, PCA and attention scores all rest on that single identity.",
        "Cosine similarity divides the dot product by both lengths, cancelling magnitude and leaving direction. Retrieval and recommendation default to it because 'a title watched 100 times' and 'the same title watched once' share a direction yet differ 100-fold in dot product; Euclidean distance punishes direction and magnitude together, and picking the wrong metric quietly picks the wrong retrieval system.",
        "The sign of a dot product is readable: positive means an acute angle (agreement), zero means orthogonal (no projection onto each other, 'no linear overlap' in ML), negative means an obtuse angle. Orthogonal still does not mean unrelated — X and X squared can be perfectly orthogonal yet strongly dependent, which m4-3 revisits.",
        "Failure mode one: the zero vector. Cosine's denominator contains norms, so an empty embedding or an all-zero padded row yields 0/0 = nan, and nan propagates through ranking with no error at all — the symptom is 'these items always sort last'. Filter empty vectors or add eps to the denominator before shipping.",
        "Failure mode two: dtype and summation order. A dot product is a reduction: an int32 accumulator over a long vector wraps around, and float32 gives different answers for different orders. 'My similarity changes in the last digit every day' is usually this, not model instability.",
        "Bridge: this section is the ground under ma1 and the whole AI track; the only prerequisite is Python from py1-py4 (on the C++ route it sits after s8). Next we arrange those numbers into tables — matrices — and explain why 'shape' breaks code more often than 'value' does."
      ],
      code: `import numpy as np

a = np.array([1.0, 2.0, 3.0])
# b 与 a 方向差得远，但长度不小：点积可以很大
b = np.array([2.0, 0.0, 0.0])
# c 与 a 完全同向，只是短了一截：点积小、余弦却满分
c = 0.1 * a

def cos(u, v):
    # 余弦相似度：点积除以两个模长，只留方向
    return u @ v / (np.linalg.norm(u) * np.linalg.norm(v))

# 按点积排序会选 b，按方向排序必须选 c：推荐要的是后者
print(a @ b, a @ c, cos(a, b), cos(a, c))
# 零向量让分母为 0：得 nan 且不抛异常，只能提前过滤
print(cos(a, np.zeros(3)))
# 同一次累加，位宽不同末位就不同：相似度别较真最后一位
xs = np.full(1000, 0.1, dtype=np.float32)
print(xs.sum(dtype=np.float64) - xs.sum())`,
      pit: "把相似度分数的分母写成「两个模长之积」却忘了零向量：nan 不报错、不抛异常，只会顺着 argsort 把某些条目永久沉底，于是你花半天调模型，其实只是有一批用户的 embedding 是全零（新注册用户没有行为记录）。正确做法是上线前断言模长大于 eps，或者对空向量直接返回 0 分并记录。",
      pit_en: "Writing the denominator as a product of two norms and forgetting the zero vector: nan raises no error, it just sinks those rows to the bottom of every argsort, so you spend half a day tuning the model when the real cause is all-zero embeddings for users with no history. Assert norm > eps before scoring, or return an explicit 0 for empty vectors and log it.",
      ex: {
        q: "为什么点积为 0 不等于「两个向量毫无关系」？在推荐里该用哪个度量？",
        a: "点积为 0 只说明两者在「线性投影」意义上互不重叠，非线性依赖（例如 x 与 x²）照样可以零投影；推荐里若要忽略行为强度只看方向就用余弦，若强度本身就是信号（播放次数、时长）就用点积或欧氏距离，并先做归一化控制尺度。",
        q_en: "Why does a zero dot product not mean 'these two vectors are unrelated', and which metric should a recommender use?",
        a_en: "A zero dot product only says the two do not overlap under linear projection; a nonlinear dependence (x versus x squared) can still project to zero. In recommendation, use cosine when strength must be ignored and direction is the signal; use dot product or Euclidean distance when strength itself carries information (plays, watch time), normalising first to keep the scale honest."
      }
    },

    "m1-2": {
      min: 13,
      summary: [
        "矩阵是 m×n 的数表，程序里它的第一属性是 shape 而不是内容；`A.shape == (2, 3)` 读作「2 行 3 列」，AI 的通用约定是「行=样本、列=特征」，一旦反了就得上后面每个乘法都补一个 .T。",
        "矩阵加法与标量乘都是逐元素，严格来说要求形状完全相同；但 NumPy 用广播（broadcasting）在多数不等形的场合不报错而是「按尾部维对齐后复制」：(2,3)+(3,) 是每一列各加一份，(2,3)+(2,) 直接报错，因为对齐的是最后一个维度。",
        "为什么形状比数值更容易错：数值错了结果离谱，一眼看得见；广播错了结果照样是一个形状合法的矩阵，只是每一格都是错的值。深度学习里绝大多数 bug 属于后者，所以「每写三步 print 一次 .shape」不是洁癖而是必需。",
        "转置 Aᵀ 行列互换，(2,3)→(3,2)；它满足 (AB)ᵀ = BᵀAᵀ——顺序要翻过来，这是推反向传播与矩阵求导时最常写错的一条。",
        "NumPy 的 .T 不复制数据，只交换步长（strides）：`A.T.base is A` 为真，所以写转置就是写原数组；要一份真正独立的副本必须显式 .copy()。视图语义让转置是 O(1) 的，也正是「我以为我在改副本」这类静默数据污染的来源。",
        "行主序（C order）与列主序（Fortran order）：NumPy 默认把一行连续存放，所以取一行是连续内存、缓存命中率高，取一列要跨行跳读；同一个矩阵按列累加能慢上数倍——这是「算法一样、写法不同、速度差 5 倍」的头号原因，BLAS 内核就是围绕这条组织的。",
        "两种布局还解释了形状之外的隐性成本：`A.T @ B` 与 `A @ B.T` 数学上并不等价、但常被混写成「看起来一样」，而 `np.ascontiguousarray` 花一次拷贝换来后续访问连续——性能剖析里这条经常是拐点。",
        "衔接：形状、广播、转置、内存布局是本章的工具，下一节用它们做真正的运算——矩阵乘法与它代表的线性变换。"
      ],
      summary_en: [
        "A matrix is an m-by-n table whose first property in code is its shape, not its contents; 'A.shape == (2, 3)' reads 'two rows, three columns', and the AI convention is rows = samples, columns = features. Break that convention and every later multiplication needs an extra .T.",
        "Matrix addition and scalar multiplication are elementwise and formally demand identical shapes — but NumPy's broadcasting refuses only sometimes: it aligns trailing dimensions, so (2,3)+(3,) adds one copy per column while (2,3)+(2,) errors out because the last axis (3 versus 2) does not match.",
        "Why shape beats value as a source of bugs: a wrong value produces an obviously wrong matrix, while a wrong broadcast still produces a perfectly shaped matrix in which every cell is wrong. Most deep-learning bugs are the second kind, so printing .shape every few lines is not tidiness, it is defence.",
        "Transposing swaps rows and columns, (2,3) becomes (3,2), and it obeys (AB)ᵀ = BᵀAᵀ — the order flips, which is the single most-miswritten identity in backpropagation and matrix-calculus derivations.",
        "NumPy's .T copies nothing; it only swaps strides. 'A.T.base is A' is True, so writing through a transpose writes through the original; a genuinely independent copy needs an explicit .copy(). That view semantics is why transposing is O(1) — and why 'I thought I was editing a copy' silently corrupts data.",
        "Row-major (C order) versus column-major (Fortran order): NumPy stores a row contiguously by default, so taking a row is a sequential read the cache loves while taking a column strides across rows. Summing the same matrix column-wise can be several times slower — the leading cause of 'identical algorithm, five times the runtime', and exactly what BLAS kernels are built around.",
        "Layout also explains costs invisible in the shapes: 'A.T @ B' and 'A @ B.T' are not algebraically the same yet are routinely swapped as if they were, and np.ascontiguousarray buys one copy in exchange for contiguous access later — a line that frequently shows up as the knee in a profile.",
        "Bridge: shape, broadcasting, transpose and memory layout are this chapter's tools. The next section uses them for real work — matrix multiplication and the linear transformation it represents."
      ],
      code: `import numpy as np

# 先看形状：2 行 3 列，约定行是样本、列是特征
A = np.arange(6).reshape(2, 3)
B = np.ones((2, 3))
print((A + B).shape)
# 与长度为 3 的向量相加：按尾部维对齐，等于每列各加一份
print((A + np.ones(3)).shape)
# 换成长度 2 报错，但改成 (2,1) 又能加了：这次是每行各加一份
try:
    print((A + np.ones(2)).shape)
except ValueError:
    print("broadcast error")
print((A + np.ones((2, 1))).shape)

# 转置只是换个看法：不复制数据，只交换步长
T = A.T
# True 与 False：T 是 A 的视图，写它会写到原件上
print(T.base is A, T.flags.owndata)
print(A[1, 0])
T[0, 1] = 99
# 99：这就是「我以为我在改副本」
print(A[1, 0])
# 想要独立副本必须显式 copy
C = A.T.copy()
C[0, 1] = 0
print(A[1, 0])
# 连续化花一次拷贝，换后续按行按列访问的速度
print(A.T.strides, np.ascontiguousarray(A.T).strides)`,
      pit: "把 `A.T` 当副本用：`tmp = A.T; tmp[0, 1] = 0` 之后 A 自己也变了，而且只有写到「转置视图」上时才发生，所以复现极不稳定。规则很简单——凡是要就地修改，先 `.copy()`；凡是只读，就别 copy，白白多占一份内存。",
      pit_en: "Treating A.T as a copy: after 'tmp = A.T; tmp[0, 1] = 0' the original A has changed too, and because this only bites when you write through a transposed view it reproduces erratically. The rule is one line: copy() before any in-place edit, and skip the copy when you only read — otherwise you pay a full extra buffer for nothing.",
      ex: {
        q: "为什么 `X + bias` 有时不报错却算出完全错误的结果？",
        a: "因为广播按「尾部维」对齐：bias 长度恰好等于特征数时每行各加一份，语义正确；如果 bias 长度等于样本数，尾部维不匹配会报错，但当两者都是方阵或其中一维为 1 时，广播会成功而加错方向，形状仍是合法矩阵，只能靠 assert shape 拦住。",
        q_en: "Why can 'X + bias' run without an error and still compute something entirely wrong?",
        a_en: "Because broadcasting aligns trailing axes: a bias whose length equals the feature count is added once per row and the semantics are right; a bias whose length equals the sample count errors out, but when both sides are square or one axis is 1 the broadcast succeeds in the wrong direction, still yields a legal shape, and only an explicit shape assert catches it."
      }
    },

    "m1-3": {
      min: 14,
      summary: [
        "矩阵乘法要三种看法同时装在脑子里：① 结果的 (i,j) 格 = A 的第 i 行点乘 B 的第 j 列；② 结果的每一列 = 以 B 对应列的系数对 A 各列做线性组合（矩阵乘就是「换基/组合列」）；③ A 本身是一个线性变换，AB 读作「先做 B 再做 A」，而 A 的每一列正是基向量被变换后的落点。",
        "形状规则是最好用的读法：(m,k)@(k,n)→(m,n)，内维必须相等、外维直接给出结果形状。会背这条就不用记「谁转置」——写错时先看内维对不对，比看数值快得多。",
        "不满足交换律：AB 与 BA 常常连形状都不同；线性变换的复合是顺序敏感的（先旋转再缩放 ≠ 先缩放再旋转）。所以网络层写反顺序不是「结果差一点」，而是在算另一个函数。",
        "满足结合律与分配律：(AB)C = A(BC)（浮点上只是近似成立）。这条在工程上直接换成钱：(1000×64)@(64×32)@(32×1)，先乘前两个约 4.1×10⁶ 次乘加，先乘后两个只需约 4×10³ 再加 1.3×10⁵——同一道题，差三十多倍。",
        "复杂度：朴素 (m,k)@(k,n) 是 2mkn 次浮点乘加、产出 mn 个格子。这就是「参数量 × 样本数 ≈ 算力预算」的来源，也是为什么 Transformer 把序列长度那一维的二次项当成命根子来抠。",
        "三种写法的分工：`A @ B`、`np.matmul(A, B)`（对 2-D 与 np.dot 等价，支持 batch 维）、`np.dot`（1-D×1-D 给内积、高维时收缩的是 A 的最后一维与 B 的倒数第二维）；而 `A * B` 是逐元素乘，形状兼容时 NumPy 一声不吭给你个「合法但错」的矩阵。",
        "批量维：`np.matmul` 允许 (batch,m,k)@(batch,k,n)，把 batch 当成隐式循环；(batch,m,k)@(k,n) 会把后两维修 broadcast 对齐。做深度学习时「矩阵乘写在最内、批量维留在最外」是让内存布局与 kernel 都最省心的写法。",
        "衔接：这一节把「算子」讲完；下一节问它的逆问题——已知输出反推输入，也就是解线性方程组，以及为什么工程上绝不真的求逆。"
      ],
      summary_en: [
        "Hold three readings of a matrix product at once: (i) entry (i,j) is row i of A dotted with column j of B; (ii) each column of the result is a linear combination of A's columns with coefficients from the matching column of B, i.e. multiplication recombines columns; (iii) A itself is a linear map, AB means 'do B first, then A', and A's columns are exactly where the basis vectors land.",
        "The shape rule is the reading that pays: (m,k)@(k,n) gives (m,n), inner dimensions must match and the outer two are the answer. Master it and you stop memorising 'who gets transposed' — checking inner dimensions is far faster than checking numbers.",
        "Matrix multiplication is not commutative: AB and BA often do not even share a shape. Composition of linear maps is order-sensitive (rotate-then-scale is not scale-then-rotate), so writing two layers in the wrong order does not 'shift the result a bit', it evaluates a different function.",
        "It is associative and distributive: (AB)C = A(BC) (only approximately in floating point, but the cost difference is exact). For (1000x64)@(64x32)@(32x1), multiplying the first two first costs about 4.1e6 multiply-adds; doing the last two first costs about 4e3 plus 1.3e5 — thirty-some times cheaper on the same problem.",
        "Cost: naive (m,k)@(k,n) is 2mkn floating-point multiply-adds producing mn cells. That identity is why 'parameters times samples' is the compute budget, and why the quadratic term in sequence length dominates Transformer engineering.",
        "Know which call to use: 'A @ B' and np.matmul(A, B) agree for 2-D and support a batch dimension; np.dot contracts A's last axis with B's second-to-last (so it differs on higher ranks, and on two 1-D vectors it is just an inner product); 'A * B' is elementwise, and when shapes happen to broadcast NumPy silently returns a legal-shaped, wholly wrong matrix.",
        "Batching: np.matmul accepts (batch,m,k)@(batch,k,n) and treats batch as an implicit loop, while (batch,m,k)@(k,n) broadcasts over the trailing two axes. In deep learning, keeping the matrix product on the inner axes and the batch axis outermost is what makes both memory layout and kernels cheap.",
        "Bridge: the operator is now settled. The next section asks its inverse problem — recovering the input from the output, i.e. solving linear systems, and why production code never really inverts."
      ],
      code: `import numpy as np

# 内维必须相等：(2,3) 乘 (3,4) 得到 (2,4)
A = np.arange(6).reshape(2, 3).astype(float)
B = np.arange(12).reshape(3, 4).astype(float)
C = A @ B
# 看法一：结果的 (1,2) 格等于 A 的第 1 行点乘 B 的第 2 列
print(C[1, 2], A[1] @ B[:, 2])
# 看法二：结果每一列都是 A 各列的线性组合，系数取自 B 的对应列
comb = B[0, 2] * A[:, 0] + B[1, 2] * A[:, 1] + B[2, 2] * A[:, 2]
print(np.allclose(comb, C[:, 2]))
# 看法三的产物：结合律让结果相同，代价却差一个数量级
print(np.allclose((A @ B) @ np.ones((4, 5)), A @ (B @ np.ones((4, 5)))))

# 固定种子，形状与性能的实验才可复现
rng = np.random.default_rng(0)
X = rng.normal(size=(1000, 64))
W = rng.normal(size=(64, 32))
y = rng.normal(size=(32, 1))
# 两种括号顺序形状一样：先算 W 乘 y 只要几千次乘加，先算 X 乘 W 要四百万次
print(((X @ W) @ y).shape, (X @ (W @ y)).shape)
# 浮点下两者只差最后一位：结合律在数值上是「近似」成立的
print(np.max(np.abs(((X @ W) @ y) - (X @ (W @ y)))))`,
      pit: "把 `*` 当矩阵乘写进网络层：`X * W` 在形状兼容时不报错，而是逐元素（外加广播）出一个形状「看起来很对」的矩阵，loss 照样下降、只是永远学不好。防法有两个：写单元测试断言 `(X @ W).shape`，以及在关键乘法前先 `assert X.shape[-1] == W.shape[0]`。",
      pit_en: "Writing '*' where a matrix product belongs: 'X * W' does not error when the shapes happen to broadcast — it returns an elementwise matrix with a shape that 'looks right', the loss still falls, and the model simply never learns. Two guards: a unit test asserting (X @ W).shape, and 'assert X.shape[-1] == W.shape[0]' before every important multiplication.",
      ex: {
        q: "什么情况下 `(X @ W) @ y` 与 `X @ (W @ y)` 的结果一样但速度差一个数量级？",
        a: "当 X 很「宽」（样本多）、y 很「窄」（输出维度小）时：先算 W @ y 的代价是 2·k·n·1，再把结果作用到 X 上只花 2·m·k·1；先算 X @ W 则要付出完整的 2·m·k·n。所以推理/打分这类「一列向量」的场景一定要从右往左乘。",
        q_en: "When do '(X @ W) @ y' and 'X @ (W @ y)' give the same answer at wildly different speeds?",
        a_en: "When X is wide (many samples) and y is narrow (few output dims): W @ y costs 2*k*n*1 and applying that to X then costs 2*m*k*1, whereas X @ W first pays the full 2*m*k*n. That is why scoring and inference, which end in a single column vector, must always be multiplied right-to-left."
      }
    },

    "m1-4": {
      min: 13,
      summary: [
        "单位阵 I 是「什么都不改」的变换（对角为 1、其余为 0），代码里是 `np.eye(n)`；它在 AI 中以两种形式反复出现：残差连接的 I + f(·)，以及正则化项里的 λI——两者都是「把矩阵拉回可逆、拉回良态」。",
        "逆矩阵的定义是 AA⁻¹ = A⁻¹A = I，几何上就是把那次变换完整撤销。只有方阵且满秩（行列式非 0）才谈得上逆；一旦退化，「撤销」根本不存在——一整个平面被压成一条线，就不可能从线上复原出平面。",
        "线性回归闭式解 β = (XᵀX)⁻¹Xᵀy 里那个「逆」是教科书写法；真正的需求只是解方程 (XᵀX)β = Xᵀy。区别在于：我们从来不需要那个逆矩阵本身，也不需要把它真的存进内存。",
        "别真的求逆，三条理由：时间上 `solve` 做一次 LU/Cholesky 分解再回代（O(n³) + O(n²)），而显式求逆要多付一次 n³ 的矩阵乘法，实测慢 2~3 倍；精度上逆的元素可以远大于原矩阵、误差被二次放大；扩展性上 `solve` 还能一次吃多组右端项 b。",
        "条件数 cond(A) = σmax/σmin ≈ ‖A‖·‖A⁻¹‖ 才是「这道题能不能算」的判据：它表示输入 1% 的相对误差最多能让输出错多少倍。cond = 1e12 时，双精度只剩三四个有效位，`solve` 交回来的一串数字看着完整，其实全是噪声。",
        "判奇异不要用行列式：det 随矩阵尺度按维度次方变化（10·I₂ 的 det = 100，200 维时是 10²⁰⁰ 直接溢出），所以「det 很小」完全可能只是矩阵本身很小。正确的工具是 `matrix_rank`、`cond` 与最小奇异值（都要带容差）。",
        "超定与欠定是常态：m > n 时一般无精确解，用最小二乘 `lstsq`；列共线导致秩亏时，要么用基于 SVD 的 `pinv` 取最小范数解，要么加岭正则 (XᵀX + λI)β = Xᵀy —— λI 就是把条件数拉回可控范围，这也是「正则化」最朴素的数值理由。",
        "衔接：手算部分到此结束。下一节全部换成 NumPy 跑一遍，把「形状、运算符、dtype」这三类坑逐条撞一次，让报错自己出现在你眼前。"
      ],
      summary_en: [
        "The identity matrix is the 'change nothing' transform (ones on the diagonal, zeros elsewhere), written np.eye(n) in code. In AI it reappears in two shapes: the I + f(.) of residual connections, and the lambda*I of a regulariser — both mean 'pull the matrix back toward invertible and well-conditioned'.",
        "An inverse is defined by AA⁻¹ = A⁻¹A = I and geometrically undoes the transform completely. Only a square, full-rank matrix (non-zero determinant) has one; once the map collapses a plane onto a line there is no undo to be found, in principle rather than numerically.",
        "The beta = (XᵀX)⁻¹Xᵀy of a linear-regression closed form is textbook notation; the actual need is to solve (XᵀX)beta = Xᵀy. The difference matters: the inverse matrix itself is never wanted and should never be materialised in memory.",
        "Never invert for real, for three reasons. Time: solve performs one LU/Cholesky factorisation plus back-substitution (O(n³) then O(n²)), while an explicit inverse pays an extra n³ matrix product and measures 2-3x slower. Accuracy: entries of A⁻¹ can vastly exceed those of A, doubling the error growth. Reach: solve also accepts many right-hand sides at once.",
        "The real test of 'can this be computed' is the condition number cond(A) = sigma_max/sigma_min, roughly the product of ||A|| and ||A⁻¹||: it says how much output error one percent of input error buys. At cond = 1e12 double precision keeps three or four significant digits, so the vector solve returns looks complete but is mostly noise.",
        "Do not diagnose singularity with the determinant: det scales like the matrix to the power of the dimension (det of 10*I_2 is 100, of 10*I_200 it is 10^200 and overflows), so 'tiny determinant' may just mean 'small matrix'. Use matrix_rank, cond and the smallest singular value — each with an explicit tolerance.",
        "Over- and under-determined systems are the normal case: with m greater than n there is usually no exact solution, so use least squares (lstsq); when collinear columns make the matrix rank-deficient, either take the minimum-norm solution with the SVD-based pinv or add ridge, (XᵀX + λI)beta = Xᵀy — that λI exists precisely to drag the condition number back into range, which is the most plain-spoken justification for regularisation there is.",
        "Bridge: the hand-computation part ends here. The next section runs all of it in NumPy and deliberately walks into the three failure families — shape, operator and dtype — so the errors show up in front of you."
      ],
      code: `import numpy as np

A = np.array([[4.0, 1.0], [1.0, 3.0]])
b = np.array([1.0, 2.0])
# 教科书写法：先造出整个逆矩阵，再乘一次
x1 = np.linalg.inv(A) @ b
# 工程写法：一次分解加回代，更快也更准
x2 = np.linalg.solve(A, b)
print(np.abs(x1 - x2).max())
# 定义核对：A 乘它的逆等于单位阵
print(np.allclose(A @ np.linalg.inv(A), np.eye(2)))

# 两行几乎相同：一个病态矩阵
near = np.array([[1.0, 1.0], [1.0, 1.0 + 1e-12]])
# 条件数约 4e12：双精度只剩三四位有效数字可信
print(np.linalg.cond(near))
# 行列式约 1e-12：「小」本身不构成可靠判据
print(np.linalg.det(near))
# 带容差的秩才是稳的判据
print(np.linalg.matrix_rank(near))

rng = np.random.default_rng(0)
X = rng.normal(size=(50, 3))
yv = X @ np.array([1.0, -2.0, 0.5]) + 0.1 * rng.normal(size=50)
# 超定：用最小二乘，而不是把 X 转置乘 X 再求逆那一套
beta = np.linalg.lstsq(X, yv, rcond=None)[0]
# 加 λI 把条件数拉回来：这就是岭回归的数值意义
beta_ridge = np.linalg.solve(X.T @ X + 1e-3 * np.eye(3), X.T @ yv)
print(beta, beta_ridge)`,
      pit: "在线性回归里手写 `np.linalg.inv(X.T @ X) @ X.T @ y`：先构造 XᵀX 会把条件数平方（cond(XᵀX) = cond(X)²），再乘一个逆又把误差放大一次，最后你得到一组「系数符号随数据小幅扰动就翻转」的模型，却以为是自己特征做得不好。一行 `np.linalg.lstsq(X, y)` 或岭正则版 solve 就能避开整条链。",
      pit_en: "Hand-writing np.linalg.inv(X.T @ X) @ X.T @ y for linear regression: forming XᵀX squares the condition number (cond(XᵀX) = cond(X)²) and then the explicit inverse amplifies the error again, so you end up with coefficients whose signs flip under a small data perturbation and you blame your feature work. One call to np.linalg.lstsq(X, y) — or the ridge variant via solve — removes the whole chain.",
      ex: {
        q: "为什么「求解 Ax=b」比「先求 A⁻¹ 再乘 b」在数值上更准？",
        a: "因为解方程只需把 A 做一次带主元选择的分解再回代，误差按 cond(A) 的一次方量级传播；显式求逆要多算 n³ 次乘加、还要把每个元素都放大成可能的巨值，误差与耗时都按更高阶累积。",
        q_en: "Why is solving Ax=b numerically more accurate than computing A⁻¹ and multiplying by b?",
        a_en: "Because solving only factors A once (with pivoting) and back-substitutes, so error grows like a single power of cond(A); an explicit inverse adds another n³ of multiply-adds and inflates entries into potentially huge values, accumulating both more error and more time."
      }
    },

    "m1-5": {
      min: 12,
      summary: [
        "`@` 与 `*` 的语义分工：`W @ x` 是加权求和（一层神经元的全部工作），`W * x` 是逐元素乘（掩码、缩放、dropout 用的都是它）；形状能广播时 NumPy 绝不报错，只给你「合法形状下的错值」——所以查错顺序永远是先看运算符、再看数值。",
        "前向传播一句话说完：y = W @ x + b，其中 W 形状 (输出维, 输入维)、x 是 (输入维,)、b 广播加到每个输出上。批量时改写成 X @ Wᵀ，即 (batch,in)@(in,out)→(batch,out)；这正是 nn.Linear 内部按 (out,in) 存权重、算的时候转置的原因。",
        "`np.linalg` 是这一章的工具箱：solve / inv / lstsq / pinv / det / slogdet / matrix_rank / eig / eigh / svd / norm / cond。同一件事往往有「教学写法」和「工程写法」两种，本课一律选后者（解方程用 solve、判退化用 matrix_rank、降维用 svd）。",
        "dtype 的静默陷阱：`acc = np.zeros(3, dtype=int); acc[0] = 0.7` 得到 0——按目标 dtype 截断，不报错；`np.array([1, 2, 3]).sum()` 在大向量上用平台整数累加会溢出回绕，需要 `sum(dtype=np.float64)` 或建数组时就给 int64。",
        "就地运算更严格：`h *= 0.5` 对整数数组在旧版 NumPy 里静默截断、在新版直接抛 casting 错误。两种行为都不该依赖；而且 in-place 会破坏自动求导需要的中间值——省内存与能反向传播是有冲突的。",
        "位宽与可复现：训练常用 float32（甚至 bf16）省显存，但相似度、对数似然这类长累加要留 float64 或用成对求和；跑实验必须 `np.random.default_rng(seed)` 固定种子，否则你今天对齐好的形状明天换一批数据就散架。",
        "形状自查三件套：`print(a.shape)`、`assert a.shape == expected`、以及 `a[np.newaxis, :]` 手动升一维来控制广播方向。把 assert 写进代码，比在梯度里 debug「转置忘啦」早一步。",
        "衔接：ma1 收在「会算」。ma2 换问题——同样这块矩阵，我们不再问怎么乘，而问它到底携带了几个独立方向（秩）、哪些方向只是被放大（特征值），最后落到 PCA 降维。"
      ],
      summary_en: [
        "The division of labour: 'W @ x' is a weighted sum (which is all a layer does) while 'W * x' is elementwise (masks, gains, dropout). When shapes happen to broadcast, NumPy never complains — it hands you wrong values in a legal shape. So debug order is always: operator first, numbers second.",
        "The forward pass in one line: y = W @ x + b, with W shaped (out, in), x shaped (in,), and b broadcast onto every output. Batched it becomes X @ Wᵀ, i.e. (batch,in)@(in,out) giving (batch,out) — which is exactly why nn.Linear stores weights as (out, in) and transposes at use time.",
        "np.linalg is this chapter's toolbox: solve / inv / lstsq / pinv / det / slogdet / matrix_rank / eig / eigh / svd / norm / cond. Most tasks have both a textbook and an engineering spelling, and this course always takes the latter — solve for systems, matrix_rank for degeneracy, svd for dimensionality reduction.",
        "Silent dtype traps: 'acc = np.zeros(3, dtype=int); acc[0] = 0.7' stores 0 — the cast follows the destination and no error is raised — and summing a huge integer array accumulates in the platform int and wraps, so ask for sum(dtype=np.float64) or build the array as int64 from the start.",
        "In-place is stricter: 'h *= 0.5' on an integer array truncated silently in old NumPy and raises a casting error in new NumPy. Neither behaviour is worth relying on, and in-place edits also destroy the intermediates automatic differentiation needs — saving memory and being differentiable are in genuine tension.",
        "Precision and reproducibility: training favours float32 (even bf16) to save memory, but long reductions such as similarity and log-likelihood deserve float64 or pairwise summation; and any experiment needs np.random.default_rng(seed), otherwise the shape alignment that passed today collapses on tomorrow's data.",
        "Three self-check habits: print(a.shape), assert a.shape == expected, and a[np.newaxis, :] to insert the axis you need and steer the broadcast direction. Writing the assert into the code is one step earlier than debugging 'I forgot a transpose' inside a gradient.",
        "Bridge: ma1 ends at 'I can compute'. ma2 changes the question — for the same matrix, not how to multiply it but how many independent directions it carries (rank), which directions it merely stretches (eigenvalues), and finally PCA as dimensionality reduction."
      ],
      code: `import numpy as np

# W 形状 (3,2)：3 个输出神经元、2 个输入
W = np.array([[0.5, -0.2], [0.1, 0.3], [0.7, 0.0]])
x = np.array([1.0, 2.0])
# 前向：(3,2)@(2,) 得到 (3,)，一层的全部工作就是加权求和
print(W @ x)
# 换成星号：广播后逐元素乘，形状看着也合理，语义完全不对
print((W * x).shape)
# 批量 100 个样本：转置权重，偏置靠广播加到每一行
X = np.tile(x, (100, 1))
b = np.ones(3)
print((X @ W.T + b).shape)
# 整数数组的 dtype 已经定了：赋值按目标类型截断且不报错
h = np.array([1, 2, 3])
h[0] = 0.7
print(h)
# int32 累加会回绕，NumPy 不会自动升到 int64
big = np.full(3, 10 ** 6, dtype=np.int32)
print(big.sum(), (big * big).sum())
# 长累加换位宽，末位差很多：相似度与似然要留 float64
xs = np.full(200000, 0.1, dtype=np.float32)
print(xs.sum(dtype=np.float64) - xs.sum())
# 就地乘要求类型相容：旧版截断、新版报错，两种都别依赖
try:
    h *= 0.5
except TypeError:
    print("casting error")
# 手动升一维来控制广播方向：先想清楚要加到行还是加到列
print((X + x[np.newaxis, :]).shape, (X.T + x[:, np.newaxis]).shape)`,
      pit: "只在验证集上跑一次就相信结果：dtype（int32 累加）、位宽（float32 求和顺序）和随机种子三者任一没固定，两次跑的差异就足以把你的结论推翻。最低成本的防护是把随机源集中成 `rng = np.random.default_rng(seed)` 一路传下去，并在测试里断言关键量的相对误差。",
      pit_en: "Trusting a result after one validation run: if dtype (int32 accumulation), precision (float32 summation order) or the seed is left unfixed, the run-to-run gap is easily large enough to invert your conclusion. The cheap defence is one rng = np.random.default_rng(seed) passed all the way down, plus tests asserting relative error on the quantities you care about.",
      ex: {
        q: "为什么 `nn.Linear` 存的是 (out_features, in_features) 而不是训练时常用的 (in, out)？",
        a: "因为参数初始化与权重的行/列语义按「每个输出神经元一行」更自然（每行的入边权重聚在一起），而矩阵乘在批量样本上要用 X @ Wᵀ；两种写法只差一次转置，但要清楚转置的是视图、代价是内存不连续。",
        q_en: "Why does nn.Linear store (out_features, in_features) rather than the (in, out) that batched training seems to want?",
        a_en: "Because parameter initialisation and the row/column meaning of weights read more naturally as 'one row per output neuron' (its incoming edges stay together), while batched multiplication needs X @ Wᵀ. The two spellings differ only by a transpose — and that transpose is a view whose price is non-contiguous memory."
      }
    },

    "m1-6": {
      title: "综合重构：一道题从手算走到 NumPy",
      title_en: "Synthesis: One Problem, From Hand Computation to NumPy",
      min: 15,
      target: "能用一个推荐打分的小例子，从手算点积一路推到批量矩阵乘、再用 solve/lstsq 拟合权重并检查条件数，并说清每一步在代码里对应哪一行、判据来自哪个数。",
      target_en: "Using one small recommender-scoring example, walk from a hand-computed dot product through batched matrix products to fitting weights with solve/lstsq while inspecting the condition number — and say which line of code and which number justifies each step.",
      summary: [
        "题目：3 个用户对 4 部片打分，要算「用户与影片的相似度」，并回答「能不能用少量特征反推评分」。这一道题把 m1-1 到 m1-5 全用上了，也构成本层的自查工具。",
        "第一步手算：只取两个用户，纸上写一次点积与余弦，确认「符号=方向、模长=强度」。30 秒手算换来的直觉，比任何一次库函数调用都耐用；它也是你后面判断代码是否算错的唯一基准。",
        "第二步摆成矩阵：评分矩阵 R 是 (3,4)，用户向量 U 是 (3,k)、影片向量 V 是 (4,k)，预测 R̂ = U @ Vᵀ。先检查形状：(3,k)@(k,4)→(3,4)，形状对不上语义一定不对；这就是「形状优先」的肌肉训练。",
        "第三步用第二种看法验证：结果的第 j 列应该等于 V 的各列以 R 的第 j 行为系数的组合。用 `np.allclose` 把这条断言写成测试，从此你不再靠「看着差不多」判断矩阵乘是否写对。",
        "第四步丢掉求逆：要用特征拟合权重，写 `lstsq` 或岭正则版 `solve`，不要写 `inv(X.T @ X) @ X.T @ y`；顺手打印 `cond` 与 `matrix_rank`，看到条件数上到 1e10 以上，就知道下一步该加 λI 或者丢共线特征，而不是继续调学习率。",
        "第五步处理数据本身：零向量、缺失值（nan）必须在进矩阵之前处理——nan 会顺着一次广播污染整块结果且不报错；然后固定随机种子重跑两遍，确认你的结论不是位宽与累加顺序给的假象。",
        "本章复盘清单（真正要背的东西）：① 先看 shape 再看数值；② `@` 还是 `*` 要有意识地选；③ 转置是视图，改它会改原件；④ 别求逆，用 solve/lstsq；⑤ 判退化用 rank/cond，不用 det；⑥ 累加注意 dtype 与位宽；⑦ 随机必带种子。",
        "衔接 ma2：ma1 结束在「会算」，ma2 要问的是「这块矩阵到底有几个独立方向」。秩、行列式、特征值、SVD 与 PCA，全都是在回答同一个问题的不同侧面。"
      ],
      summary_en: [
        "The problem: 3 users rate 4 titles; compute user-title similarity and then answer whether a few features can recover the ratings. This single thread uses m1-1 through m1-5 and doubles as this layer's self-check.",
        "Step one, by hand: take two users and write out a dot product and a cosine on paper, confirming 'sign is direction, magnitude is strength'. Thirty seconds of hand arithmetic buys intuition that outlives any library call, and it is your only baseline for deciding later whether the code is wrong.",
        "Step two, lay it out as matrices: ratings R is (3,4), user factors U is (3,k), item factors V is (4,k), prediction R-hat = U @ Vᵀ. Check the shapes first: (3,k)@(k,4) gives (3,4). If the shapes disagree, the semantics cannot be right — that is the drill this chapter is really about.",
        "Step three, verify with the second reading: column j of the result must equal V's columns combined with row j of R as coefficients. Turn that assertion into a test with np.allclose and you never again judge a matrix product by 'looks about right'.",
        "Step four, drop the inverse: fit weights with lstsq or a ridge-flavoured solve, never with inv(X.T @ X) @ X.T @ y. Print cond and matrix_rank on the way past; once the condition number crosses 1e10 the next move is lambda*I or removing collinear features, not more learning-rate tinkering.",
        "Step five, handle the data itself: zero vectors and missing values must be dealt with before anything enters a matrix — one nan rides a broadcast into an entire block and never raises. Then fix the seed and rerun twice, so your conclusion is not an artefact of precision and summation order.",
        "Chapter retrospective (the part worth memorising): 1) shape before values; 2) '@' or '*', decided consciously; 3) a transpose is a view and writes through it; 4) never invert — solve/lstsq; 5) rank and cond detect degeneracy, det does not; 6) watch dtype and bit width in every reduction; 7) always seed the randomness.",
        "Into ma2: ma1 ended at 'I can compute'. ma2 asks how many independent directions this matrix actually carries. Rank, determinant, eigenvalues, SVD and PCA are all answers to that one question from different angles."
      ],
      code: `import numpy as np

# 3 个用户、4 部片的评分矩阵：先看形状再看数值
R = np.array([[5.0, 3.0, 4.0, 2.0],
              [4.0, 0.0, 5.0, 1.0],
              [1.0, 5.0, 0.0, 4.0]])
u0 = R[0]
# 影片向量按列取，与「行是样本」的约定一致
i0, i1 = R[:, 0], R[:, 1]

def cos(u, v):
    return float(u @ v / (np.linalg.norm(u) * np.linalg.norm(v)))

# 手算基准：点积给强度、余弦给方向，后面所有库的结果都要能对回这里
print(u0 @ i0, u0 @ i1, cos(u0, i0), cos(u0, i1))

# 固定种子，低秩分解才可复现
rng = np.random.default_rng(7)
U = rng.normal(size=(3, 2))
V = rng.normal(size=(4, 2))
# 批量矩阵乘：(3,2)@(2,4) 回到评分矩阵的形状
Rhat = U @ V.T
# 用「列的组合」这一看法交叉验证，从此不靠「看着差不多」
print(np.allclose(Rhat[:, 0], V @ U[:, 0]))
# 形状断言写进代码，比事后 debug 早一步
assert Rhat.shape == R.shape

# 同一物理量存两遍：完全共线的设计矩阵
feet = np.array([1.0, 2.0, 3.0])
X = np.column_stack([feet, 12 * feet, np.array([170.0, 175.0, 180.0])])
yv = X @ np.array([1.0, 1.0, 1.0])
# 秩 2、条件数爆表：先体检，再谈求解
print(np.linalg.matrix_rank(X), np.linalg.cond(X.T @ X))
# 超定又秩亏：最小二乘给最小范数解
beta = np.linalg.lstsq(X, yv, rcond=None)[0]
# 加 λI 把条件数拉回可控：正则化的数值理由
beta_ridge = np.linalg.solve(X.T @ X + 1e-2 * np.eye(3), X.T @ yv)
print(beta, beta_ridge)`,
      pit: "只验证「形状对不对」就上线：本节的例子说明形状合法也可能条件数极烂、秩亏、或者数据里混着 nan。收口检查必须三件一起做——shape 断言、`matrix_rank`/`cond` 数值体检、以及一次全零与一次含 nan 的对抗样本；缺任何一件，bug 都会在生产环境里替你补齐。",
      pit_en: "Shipping after checking only that the shapes fit: this section's example shows that a legal shape can still hide a broken condition number, a rank deficiency or a stray nan. The closing check must run all three at once — a shape assertion, a numeric physical (matrix_rank/cond), and one adversarial pass with an all-zero row and one with a nan. Skip any one and production will supply it for you.",
      ex: {
        q: "为什么这一节坚持要「先手算、再用 np.allclose 交叉验证」，而不直接信任库函数？",
        a: "因为库函数保证的是它自己的算法正确，不保证你把「行是样本还是列是样本」的约定用对了；只有手算基准加上两种看法互为对拍，才能把「语义错」从「数值错」里分离出来。",
        q_en: "Why insist on hand-computing first and then cross-checking with np.allclose instead of trusting the library outright?",
        a_en: "Because a library guarantees its own arithmetic, not your convention about whether rows or columns are the samples. Only a hand-computed baseline plus two independent readings cross-checking each other separates a semantic mistake from a numerical one."
      }
    },

    /* ===================== ma2 线性代数 II · 空间与特征 ===================== */
    "m2-1": {
      min: 12,
      summary: [
        "线性组合=若干向量各乘系数再相加；「能不能被组合出来」就是冗余的定义：v₂ = 2v₁ 时第二个向量不带来任何新方向，只是把同一个方向说两遍。",
        "线性相关的严格表述是：存在不全为 0 的 c 使 Σcᵢvᵢ = 0，也就是矩阵方程 Vc = 0 有非零解。于是判据链打通了——线性无关 ⇔ 只有零解 ⇔ 列满秩；它把「有没有冗余」这种模糊问题换成了「解方程 + 求秩」这种可计算问题。",
        "极大无关组与基：一组「最少但够用」的向量能表出整个空间，并且任何极大无关组的个数都相同——那个共同的个数就是维数。所以「空间的维数」与「冗余有多少」是同一枚硬币的两面。",
        "NumPy 的判据分工：`matrix_rank(V)` 给带容差的秩、`lstsq` 的返回值里附赠秩与奇异值、`solve` 在奇异时直接抛 LinAlgError。不要用「det 接近 0」或「解出来的系数很大」来判断相关，那些是症状不是判据。",
        "工程里的共线长什么样：同一物理量存两遍（feet 与 inches）、one-hot 编码忘丢一类（列和恒为 1）、高次多项式特征、时间序列的相邻滞后项。它们的共同结果都是让 XᵀX 接近奇异。",
        "后果是可以量化的：完全共线 → (XᵀX) 不可逆，闭式解直接失败；近似共线 → 回归系数的标准误爆炸、符号随样本抖动（今天正、明天负），交叉验证看起来还行而线上不稳。这才是正则化与降维的真实动机，而不是「书上说要降维」。",
        "数值现实：浮点世界里没有「严格为 0」，秩是一个带容差的概念——同一个矩阵在 `rcond=None` 与 `rcond=1e-12` 下秩可以差 1。所以报告秩的时候必须把容差一起写出来，否则「秩=5」这句话没有信息量。",
        "衔接：ma1 教的是「怎么算」，从这一节起我们问「有多少信息」。下一节把答案压成一个数——秩——并给它配上几何伙伴行列式。"
      ],
      summary_en: [
        "A linear combination scales several vectors and adds them, and 'can it be produced by the others' is exactly what redundancy means: when v2 = 2*v1 the second vector contributes no new direction, it merely repeats the first.",
        "Linear dependence stated precisely: there exist coefficients c, not all zero, with the sum of c_i*v_i equal to zero, i.e. Vc = 0 has a non-trivial solution. That completes the chain of tests — independent if and only if only the zero solution exists if and only if the columns are full rank — turning the vague 'is there redundancy' into the computable 'solve a system and take a rank'.",
        "A maximal independent set is a basis: a smallest sufficient collection of vectors that spans the space, and every such collection has the same size — that size is the dimension. So 'how many dimensions' and 'how much redundancy' are two faces of one coin.",
        "Division of labour in NumPy: matrix_rank(V) gives a tolerated rank, lstsq returns rank and singular values as extras, and solve raises LinAlgError on a singular matrix. Do not use 'the determinant is near zero' or 'the fitted coefficients are huge' as the test; those are symptoms, not criteria.",
        "Collinearity in real feature tables: the same physical quantity stored twice (feet and inches), one-hot encodings that forgot to drop a category (columns summing to one), high-degree polynomial features, and adjacent lags of a time series. All of them end in the same place: XᵀX close to singular.",
        "And the damage is measurable: exact collinearity makes (XᵀX) non-invertible so the closed form fails outright; near collinearity blows up standard errors so coefficient signs flicker with the sample (positive today, negative tomorrow) while cross-validation still looks fine and production does not. That, not 'the textbook says reduce', is the real motivation for regularisation and dimensionality reduction.",
        "Numerical reality: floating point has no 'exactly zero', so rank is a tolerated notion — the same matrix can differ by one in rank between rcond=None and rcond=1e-12. Always report the tolerance together with the rank, otherwise 'rank = 5' carries no information.",
        "Bridge: ma1 was about computing; from here we ask how much information is present. The next section compresses the answer into one number — rank — and gives it its geometric partner, the determinant."
      ],
      code: `import numpy as np

v1 = np.array([1.0, 2.0])
# v2 是 v1 的两倍：不带来任何新方向
v2 = np.array([2.0, 4.0])
v3 = np.array([0.0, 1.0])
# 把向量按列拼成矩阵，冗余就变成「秩小于列数」
M = np.column_stack([v1, v2, v3])
print(M.shape, np.linalg.matrix_rank(M))
# lstsq 顺手给秩与奇异值：小奇异值就是冗余的直接证据
sol, resid, rank, sv = np.linalg.lstsq(M, np.array([1.0, 1.0]), rcond=None)
print(rank, sv)
# 残差接近 0：目标向量本来就在列空间里，也就是可被线性表出
print(M @ sol, resid)

# 同一物理量存两遍，是特征表里最常见的共线
feet = np.array([1.0, 2.0, 3.0])
X = np.column_stack([feet, 12 * feet, np.array([170.0, 175.0, 180.0])])
print(np.linalg.matrix_rank(X), np.linalg.cond(X.T @ X))
# 列和恒为 1：one-hot 不丢参照类，秩必定亏
onehot = np.array([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0],
                   [0.0, 0.0, 1.0], [1.0, 0.0, 0.0]])
print(onehot.sum(axis=0))`,
      pit: "把 one-hot 之后的全部列直接喂给带闭式解的模型：k 个互斥类别的 k 列之和恒等于常数列，于是 X 必然秩亏、XᵀX 必然奇异。有截距的模型（线性回归、逻辑回归）一定要丢掉一个参照类别，或者关掉截距——两者都做会同时把可解释性和数值稳定性一起丢掉。",
      pit_en: "Feeding every one-hot column into a model with a closed form: the k columns of a k-way exclusive category sum to the constant column, so X is necessarily rank-deficient and XᵀX necessarily singular. With an intercept present you must drop a reference category, or switch the intercept off — doing both destroys interpretability and stability at the same time.",
      ex: {
        q: "为什么「近似共线」比「完全共线」在工程上更危险？",
        a: "完全共线会直接报错或给出明显异常，逼你处理；近似共线一切照常运行，只是系数标准误变大、符号随数据翻覆，离线指标看不出问题，等到线上分布稍微移动才暴露成「模型莫名其妙变差」。",
        q_en: "Why is near-collinearity more dangerous in practice than exact collinearity?",
        a_en: "Exact collinearity throws an error or an obviously absurd fit, forcing you to act. Near collinearity runs happily while inflating standard errors and letting coefficient signs flip with the sample; offline metrics stay clean and only a small production shift exposes it as 'the model went bad for no reason'."
      }
    },

    "m2-2": {
      min: 13,
      summary: [
        "秩有四五个等价定义：列空间的维数 = 无关列数 = 无关行数 = 非零奇异值的个数 = 最大非奇异子块的阶数。行秩等于列秩并不显然，而在浮点世界里唯一稳的定义是「按容差数非零奇异值」，因为那正是 `matrix_rank` 的实现。",
        "秩是「有效信息量」，也是模型容量指标：一个 1000×512 的 embedding 表如果秩只有 8，所有行其实都躺在 8 维子空间里，再多参数也不会带来新的可分方向。低秩适配（LoRA）、矩阵补全、推荐的双因子模型全部建立在「真实结构是低秩的」这一假设上。",
        "行列式的几何意义：det(A) 是单位体积被 A 变换后的带符号倍数。|det|>1 体积放大、<1 压缩、=0 把空间压扁（降维发生、逆不存在）、<0 表示翻转了定向（镜像）。",
        "为什么不能用 det 判奇异：det 是所有奇异值的乘积，随维度呈指数尺度变化。把可逆矩阵整体除以 100，200 维时 det 变成 10⁻⁴⁰⁰ 下溢为 0——矩阵依然完全可逆。「det 很小」这句话本身没有含义。",
        "要真用行列式就用 `slogdet`（返回符号与 log|det|，把连乘变连加）：多元高斯的归一化常数、似然比、行列式点过程都在算 log det，否则第 20 维就溢出到不可用。",
        "秩亏的处置：Ax=b 要么无解要么无穷多解。最小二乘给出「残差最小」的解，`pinv`（基于 SVD，丢掉小于容差的奇异值）给出其中范数最小的那个；或者加 λI 把秩补回来——这与 m1-4 的岭回归是同一个动作的两种说法。",
        "四个数字是一条因果链：秩 ↓ → 奇异值谱贴近 0 → cond ↑ → det 相对变小 → 可逆性与数值稳定性变差。它们是同一个「退化」现象的四种读法，代码里分别对应 rank / svd / cond / slogdet 四个调用；诊断时哪个方便用哪个，但结论必须一致。",
        "衔接：秩回答「有几个方向」，下一节回答「哪些方向被变换只是放大而没有拧转」——特征值与特征向量，以及不用分解就能逼近它们的幂迭代。"
      ],
      summary_en: [
        "Rank has several equivalent definitions: dimension of the column space = number of independent columns = number of independent rows = count of non-zero singular values = order of the largest non-singular minor. Row rank equalling column rank is not obvious, and in floating point the only stable definition is 'count singular values above a tolerance', because that is literally how matrix_rank is implemented.",
        "Rank is effective information and also a capacity measure: if a 1000x512 embedding table has rank 8, every row lies in an 8-dimensional subspace and no amount of extra parameter adds a new separable direction. Low-rank adaptation (LoRA), matrix completion and two-factor recommenders all stand on the assumption that the true structure is low rank.",
        "The determinant's geometry: det(A) is the signed factor by which A rescales volume. Absolute value above 1 expands, below 1 squeezes, exactly zero flattens the space (dimension is lost and no inverse exists), and a negative sign means orientation is mirrored.",
        "Why det cannot detect singularity: it is the product of all singular values and so scales exponentially with dimension. Divide an invertible matrix by 100 in 200 dimensions and det underflows to 0 — the matrix is still perfectly invertible. 'The determinant is small' is not by itself a meaningful sentence.",
        "When you genuinely need it, use slogdet (sign plus log|det|, turning products into sums): multivariate Gaussian normalisers, likelihood ratios and determinantal point processes all compute log det, because plain det overflows around the twentieth dimension.",
        "Handling rank deficiency: Ax = b has either no solution or infinitely many. Least squares returns a minimum-residual solution, pinv (SVD-based, discarding singular values below a tolerance) returns the smallest-norm one among them, and adding λI restores the rank — the same move ridge regression describes under another name.",
        "The four numbers form one causal chain: rank down, singular values crowd toward zero, condition number up, determinant relatively tiny, invertibility and stability worse. They are four readings of the same degeneracy, mapped to rank / svd / cond / slogdet in code; use whichever is convenient, but demand consistent conclusions.",
        "Bridge: rank says how many directions exist. The next section asks which directions a transform merely stretches instead of twisting — eigenvalues and eigenvectors, plus power iteration, which reaches them without any decomposition."
      ],
      code: `import numpy as np

A = np.array([[2.0, 1.0], [1.0, 2.0]])
# det 给体积倍数；slogdet 给符号与对数，把连乘变成连加
print(np.linalg.det(A), np.linalg.slogdet(A))
S = np.array([[1.0, 2.0], [2.0, 4.0]])
# 第二行是第一行的两倍：面积被压成一条线，秩 1、det 0
print(np.linalg.det(S), np.linalg.matrix_rank(S))
E = 10 * np.eye(2)
# det 随尺度按维度次方增长，所以「det 很大」不代表矩阵健康
print(np.linalg.det(E))
# 把满秩矩阵整体缩小：det 下溢成 0，可逆性一点没变
D = 0.01 * np.eye(200)
print(np.linalg.matrix_rank(D), np.linalg.det(D))
# 真要用到行列式，就取它的符号与对数
print(np.linalg.slogdet(D))
# 秩的真面目：按容差数非零奇异值
sv = np.linalg.svd(A, compute_uv=False)
print(sv, int((sv > 1e-12).sum()))`,
      pit: "在诊断脚本里写 `if abs(np.linalg.det(X)) < 1e-8: print('奇异')`：这条判断在维度变化时会给出相反结论——同一批特征，20 维时 det 远大于阈值、200 维时一个正常矩阵的 det 也能小到 1e-50。改用 `matrix_rank`/`cond`，并把容差写成相对量（例如 `tol = sv.max() * max(shape) * eps`）。",
      pit_en: "Writing 'if abs(np.linalg.det(X)) < 1e-8: report singular' in a diagnostic: that test flips its verdict with dimension — the same features give a huge det at 20 dims and a tiny det at 200 dims even for a well-conditioned matrix. Use matrix_rank/cond instead, and make the tolerance relative (e.g. tol = sv.max() * max(shape) * eps).",
      ex: {
        q: "为什么说「秩是带容差的概念」？同一矩阵怎么会算出不同的秩？",
        a: "因为浮点上永远存在极小但不为 0 的奇异值，判秩必须给一个阈值；NumPy 的默认阈值与最大奇异值和矩阵形状有关，手动改 rcond/tol 就会让结果上下跳动，所以秩必须连同容差一起报告才有意义。",
        q_en: "Why is rank 'a notion with a tolerance', and how can one matrix have two different ranks?",
        a_en: "Because in floating point there are always tiny but non-zero singular values, so ranking requires a threshold. NumPy's default scales with max(shape) * largest singular value * machine eps, and changing rcond/tol moves the reported rank — which is why a rank is meaningless without its tolerance alongside it."
      }
    },

    "m2-3": {
      min: 14,
      summary: [
        "Av = λv 是本章最该内化的一行：v 经过 A 作用后方向不变（只被缩放 λ 倍）。特征向量是这个变换「天然对齐的方向」，把坐标轴换到它们上面，矩阵就退化成逐轴缩放——这就是对角化，也是「换一组坐标系让问题变简单」的精确形式。",
        "求特征值有两条路：解 det(A − λI) = 0（纸上有意义、数值上无意义）；或者幂迭代——任取非零 v，反复做 v ← A v / ‖v‖。每乘一次 A，各方向的分量按各自的 λ 缩放，最大特征值的方向必然在若干步后胜出；收敛速度由 |λ₂/λ₁| 决定，比值越接近 1 越慢。",
        "幂迭代不是教学玩具：PageRank 就是对网页转移矩阵做幂迭代（主特征向量＝页面重要度）；PCA 的主方向也能用它求；而任何「重复应用同一个线性算子」的系统（迭代法、马尔可夫链、RNN 的多步传播），主角都是主特征值。",
        "什么时候特征向量不存在或不好用：非对称矩阵可以有复特征值。90° 旋转把每个实方向都拧走了，特征值是 ±i，这时「模长」解释成每步放大倍数、「辐角」解释成旋转速率。实对称矩阵则保证特征值全为实数、不同特征值的特征向量互相正交，因此可以正交对角化 A = VΛVᵀ。",
        "对称正定（所有 λ > 0，等价于任意非零 x 满足 xᵀAx > 0）的机器含义是「每个方向上曲率都朝上」：损失函数的 Hessian 在某点正定 ⇒ 该点是严格局部极小（ma3 会正式用到）；λmin > 0 还同时保证可逆，且条件数就是 λmax/λmin。",
        "谱半径与训练稳定性：当 W 以 W^k 的形式反复出现（RNN 跨时间步、深度网络的逐层传播），‖W^k‖ 的增长由 |λ|max 决定——大于 1 就指数爆炸、小于 1 就指数消失。这就是 RNN 梯度消失/爆炸的线性代数版本，正交初始化、梯度裁剪、残差连接都是在对付这一个数。",
        "代码分工：`eig` 处理一般矩阵（可能给复数、不保证排序、数值最不稳）；`eigh` 专用于对称/厄米矩阵（实数、升序、更快更稳）；`svd` 对任意形状都能做且奇异值永远非负实数。规则：对称就用 `eigh`，不是方阵就根本没有特征值、只有奇异值（m2-4 展开）。",
        "衔接：方向与缩放都有了，下一节把「换到特征方向」这件事用在真实数据上——对角化、PCA 与 SVD，也就是本章的落点。"
      ],
      summary_en: [
        "Av = λv is the line to internalise in this chapter: after A acts, v keeps its direction and is merely stretched by λ. Eigenvectors are the directions a transform is naturally aligned with; move the axes onto them and the matrix degenerates into per-axis scalings — that is diagonalisation, the precise form of 'change coordinates until the problem is easy'.",
        "Two routes to eigenvalues: solve det(A − λI) = 0 (meaningful on paper, meaningless numerically), or run power iteration — start from any non-zero v and repeat v ← Av/‖v‖. Each multiplication rescales each direction by its own λ, so the dominant eigenvector must win after a few steps; convergence runs at rate |λ2/λ1|, and the closer that ratio is to 1 the slower it crawls.",
        "Power iteration is not a teaching toy: PageRank is power iteration on the web transition matrix (the dominant eigenvector is page importance); PCA's leading direction can be found the same way; and any system that applies one linear operator repeatedly — iterative solvers, Markov chains, RNN unrolling — is governed by its dominant eigenvalue.",
        "When eigenvectors do not exist or do not help: non-symmetric matrices can have complex eigenvalues. A 90-degree rotation twists every real direction, so its eigenvalues are ±i, where the modulus reads as per-step growth and the argument as rotation rate. Real symmetric matrices guarantee real eigenvalues and mutually orthogonal eigenvectors, hence an orthogonal diagonalisation A = VΛVᵀ.",
        "Symmetric positive definite (all λ greater than 0, equivalently xᵀAx positive for every non-zero x) means operationally: curvature points upward in every direction. A positive-definite Hessian at a point makes it a strict local minimum (ma3 uses this formally); λmin above zero also guarantees invertibility, and the condition number is exactly λmax/λmin.",
        "Spectral radius versus training stability: whenever W appears as W raised to the k (RNN steps, depth-wise propagation), the growth of its norm is set by the largest |λ| — above 1 it explodes exponentially, below 1 it vanishes exponentially. That is the linear-algebra version of the RNN exploding/vanishing gradient story, and orthogonal initialisation, gradient clipping and residual connections are all treatments for this one number.",
        "Who does what in code: eig handles general matrices (may return complex values, unordered, least stable); eigh is specialised for symmetric or Hermitian input (real, ascending, faster and stabler); svd works on any shape and its singular values are always real and non-negative. Rule: symmetric means eigh; non-square matrices have no eigenvalues at all, only singular values — developed in m2-4.",
        "Bridge: directions and stretch factors are in hand. The next section applies 'move onto the eigen-directions' to real data — diagonalisation, PCA and SVD, which is where this chapter lands."
      ],
      code: `import numpy as np

# 对称矩阵：特征值必为实数，特征向量互相正交
A = np.array([[2.0, 1.0], [1.0, 2.0]])
# eigh 专用于对称阵，比 eig 稳、快，且按升序返回特征值
lam, V = np.linalg.eigh(A)
print(lam)
# 核对定义式：方向不变，只被缩放 3 倍
print(np.allclose(A @ V[:, 1], 3.0 * V[:, 1]))
# 正交归一：转置就是逆，于是可以正交对角化
print(V.T @ V)
print(np.allclose(V @ np.diag(lam) @ V.T, A))

# 旋转把每个实方向都拧走：特征值是共轭复数，没有实特征向量
R = np.array([[0.0, -1.0], [1.0, 0.0]])
print(np.linalg.eigvals(R))

# 幂迭代：乘一次、归一化一次，收敛到主特征向量
v = np.array([1.0, 0.0])
for _ in range(30):
    v = A @ v
    v = v / np.linalg.norm(v)
# 收敛快慢只看 |λ2/λ1|，这里等于三分之一
print(v, lam[-1])

# 谱半径大于 1：重复作用后按指数放大，这是梯度爆炸的线性版本
W = np.array([[0.9, 0.0], [0.0, 1.1]])
print(np.linalg.matrix_power(W, 40)[1, 1])`,
      pit: "对对称矩阵用 `eig`：结果里的特征向量可能不再是正交组（重根时尤其明显），还会带复数尾巴，后面把 `V.T` 当逆用就悄悄错了。对称/厄米输入一律走 `eigh`；另外返回顺序也不保证一致（`eigh` 升序、`eig` 无序），取「最大特征值」必须自己 `argmax`，别假设 `v[:, -1]` 就是主方向。",
      pit_en: "Calling eig on a symmetric matrix: the returned eigenvectors may stop being an orthogonal set (worst with repeated roots), arrive with a complex tail, and treating V.T as the inverse then goes quietly wrong. Route symmetric/Hermitian input through eigh, and never trust ordering either — eigh sorts ascending while eig promises nothing, so take the dominant direction with an explicit argmax rather than assuming v[:, -1].",
      ex: {
        q: "为什么幂迭代收敛到的是「最大特征值」的方向，而且有时快有时极慢？",
        a: "把初始向量按特征向量拆开，每乘一次 A 各分量乘上自己的 λ；迭代 k 次后比值变成 (λᵢ/λ₁) 的 k 次方，只要绝对值小于 λ₁ 就被压掉。所以收敛速度由次大与最大的比决定——两者接近时（例如转移矩阵谱半径为 1 而第二特征值 0.999）需要上千步。",
        q_en: "Why does power iteration converge to the largest eigenvalue's direction, and why is it sometimes lightning fast and sometimes glacial?",
        a_en: "Expand the start vector in the eigenbasis: each multiplication scales each component by its own λ, so after k steps the ratios are (λi/λ1) to the k and everything with smaller modulus is crushed. Hence the rate is |λ2/λ1| — when the top two are close (a Markov matrix with spectral radius 1 and second eigenvalue 0.999) it takes thousands of iterations."
      }
    },

    "m2-4": {
      min: 13,
      summary: [
        "对角化 A = VΛV⁻¹：先换到特征坐标（V⁻¹）、各轴独立缩放（Λ）、再换回原坐标（V）。只有对称矩阵才有 V⁻¹ = Vᵀ，那时数值与推导同时变简单——而协方差矩阵恰好是对称的，这就是 PCA 好算的根本原因。",
        "PCA 有两条等价定义：① 找一组正交方向使投影后的方差最大；② 使投影后丢掉的重构均方误差最小。两者都归结为对 Σ = XᵀX/(n−1) 做特征分解，取最大的若干个特征值对应的特征向量。",
        "实现步骤：中心化（减列均值）→ 求 Σ → `eigh` → 按特征值降序取前 k 个 → 投影 Y = X @ V_k。中心化漏掉是最常见的 PCA bug：不减均值时，第一主成分会指向数据重心而不是最大方差方向，投影出来的前几维全是「常量偏移」。",
        "SVD 与 PCA 的关系：对中心化后的 X 直接做 `svd`，右奇异向量 Vt 的行就是主成分，奇异值平方除以 (n−1) 就是协方差矩阵的特征值。走 SVD 更好，因为你不必构造 XᵀX——那会让条件数平方（cond(XᵀX) = cond(X)²），小方向上的噪声被放大到能污染主方向。",
        "解释方差比 λᵢ/Σλ（等价于 sᵢ²/Σs²）才是「留几维」的实用依据：配合碎石图或累积阈值（例如 95%）来定 k。但阈值本身是业务决定，不是数学结论；报告时要同时给出保留维度与该比例，否则「降到 50 维」这句话无法复现。",
        "降维丢了什么：丢的是方差最小的方向。可是「方差小 ≠ 不重要」——少数类的可分信号常常正好藏在方差很小的方向上，所以无监督 PCA 用于分类任务可能把类别信息直接剪掉；此外相关/共线特征会被合并成主成分，代价是失去可解释语义（第三主成分没人能命名）。",
        "什么时候 PCA 会骗你：它对尺度敏感（米和厘米混放时主成分跟着单位走，务必先标准化）；它只抓线性结构（环形/流形数据要用非线性方法，而它们连「投影回去」都做不到）；当特征数远大于样本数时 Σ 必然秩亏，此时前几个主成分可能主要由噪声构成，要用随机化 SVD 或先做特征筛选。",
        "衔接：秩、特征与降维都到位了。下一节给它们配一把可测量的尺——范数与距离——这也是正则化、损失函数和相似度在数学上的共同名字。"
      ],
      summary_en: [
        "Diagonalisation A = VΛV⁻¹: move into eigen-coordinates (V⁻¹), scale each axis independently (Λ), then move back (V). Only symmetric matrices get V⁻¹ = Vᵀ, and then both the algebra and the numerics simplify at once — the covariance matrix happens to be symmetric, which is the deep reason PCA is cheap.",
        "PCA has two equivalent definitions: find orthonormal directions maximising projected variance, or minimise the mean-square reconstruction error lost by projecting. Both reduce to an eigendecomposition of Σ = XᵀX/(n−1), keeping the eigenvectors of the largest eigenvalues.",
        "The recipe: centre (subtract column means) → form Σ → eigh → sort eigenvalues descending → take the top k → project Y = X @ V_k. Skipping centring is the classic PCA bug: without subtracting the mean the first component points at the data's centroid rather than its widest spread, and the leading coordinates encode a constant offset.",
        "SVD's relation to PCA: run svd on the centred X directly and the rows of Vt are the principal components, while squared singular values divided by (n−1) are exactly the covariance eigenvalues. SVD is the better route because it never forms XᵀX, which would square the condition number (cond(XᵀX) = cond(X)²) and amplify noise in the small directions until it contaminates the leading ones.",
        "The explained-variance ratio λi over the sum of λ (equivalently s squared over the sum of s squared) is the practical basis for choosing k, usually read off a scree plot or a cumulative cut such as 95 percent. The threshold itself is a business decision, not a theorem — report both the retained dimensionality and the ratio, otherwise 'we reduced to 50 dims' cannot be reproduced.",
        "What reduction throws away: the lowest-variance directions. But small variance is not unimportant — the signal separating a rare class often lives precisely in a thin direction, so unsupervised PCA on a classification task can cut away exactly what you needed. Correlated features also get merged into components, and the price is interpretability: nobody can name the third principal component.",
        "When PCA lies to you: it is scale-sensitive (mix metres and centimetres and the components follow the units — standardise first); it captures only linear structure (ring or manifold data needs nonlinear methods, which cannot even project back); and when features vastly outnumber samples, Σ is necessarily rank-deficient and the top components may be mostly noise, so reach for randomised SVD or filter features first.",
        "Bridge: rank, eigenstructure and reduction are in place. The next section hands them a measurable ruler — norms and distances, which is also the shared mathematical name for regularisation, loss and similarity."
      ],
      code: `import numpy as np

rng = np.random.default_rng(0)
# 一个共同潜因子：真正的信号在这里，两个观测都是它的含噪版本
t = rng.normal(size=500)
X = np.column_stack([t + 0.1 * rng.normal(size=500),
                     2 * t + 0.1 * rng.normal(size=500)])
# 中心化：不减均值时第一主成分会指向数据重心
X = X - X.mean(axis=0)
# 协方差矩阵，除 n-1 与 np.cov 的默认一致
C = X.T @ X / (len(X) - 1)
w, V = np.linalg.eigh(C)
# 直接对数据做 SVD：不必构造 X 转置乘 X
U, s, Vt = np.linalg.svd(X, full_matrices=False)
# 两条路给出同一组各方向方差：奇异值平方除以 n-1 就是特征值
print(w, s * s / (len(X) - 1))
# 解释方差比：选 k 的唯一实用依据
print(s * s / (s * s).sum())
# 投影到主成分坐标：形状不变，含义换成方向
Y = X @ Vt.T
print(np.var(Y, axis=0, ddof=1))
# 主成分两两不相关，这是 PCA 的卖点
print(np.corrcoef(Y.T)[0, 1])
# 构造协方差会让条件数平方：改用 SVD 的量化理由
print(np.linalg.cond(X.T @ X), np.linalg.cond(X))`,
      pit: "用 `np.linalg.eig(np.cov(X.T))` 来做 PCA 然后按 `V[:, 0]` 当第一主成分：`eig` 不保证排序，`V[:, 0]` 可能是最小方差方向，于是你的二维投影看着像噪声却怎么也对不上别人的图。要么显式 `argsort` 降序、要么改用 `eigh`（升序，取最后几列）、要么直接 SVD（Vt 的行天生按奇异值降序）。",
      pit_en: "Doing PCA with np.linalg.eig(np.cov(X.T)) and then treating V[:, 0] as the first component: eig makes no ordering promise, so that column can be the smallest-variance direction, and your 2-D projection looks like noise while refusing to match anybody else's plot. Either argsort explicitly in descending order, switch to eigh (ascending, take the last columns), or use SVD, whose Vt rows come pre-sorted by singular value.",
      ex: {
        q: "同样能拿到主成分，为什么数值上更推荐 SVD 而不是对协方差矩阵做特征分解？",
        a: "因为构造 XᵀX 会把条件数平方：接近数值零的小奇异值被平方后可能低于可表示精度，方向信息在数值上被摧毁，于是本该是噪声的方向挤进前列；SVD 直接对 X 操作，避免这次平方，也顺带避开「特征分解假设矩阵半正定」这个前提。",
        q_en: "Both routes yield principal components, so why is SVD the numerically preferred one over an eigendecomposition of the covariance?",
        a_en: "Because forming XᵀX squares the condition number: small singular values get squared below usable precision, so directional information is destroyed numerically and directions that should be noise push their way into the front. SVD works directly on X, avoids that squaring, and also sidesteps the assumption that the matrix be positive semi-definite."
      }
    },

    "m2-5": {
      min: 12,
      summary: [
        "范数三公理：只有零向量为 0、齐次 ‖tx‖ = |t|‖x‖、三角不等式。有了范数，「距离」就是把差向量塞进范数——所以 L1/L2/L∞ 是一族而不是一个，它们都合法，只是量的东西不同。",
        "L2（欧氏）最常用、可微、旋转不变；L1 是绝对值之和、在原点不可微、单位球是菱形；L∞ 只看最大分量（矩阵无穷范数、梯度上界都靠它）；L0 数非零分量个数，它不满足齐次性，因此不是范数，只是计数——这个区别决定了 L0 的组合优化是 NP 难，而 L1 可以作为凸松弛来解。",
        "为什么 L1 给出稀疏解：把「约束 ‖θ‖ ≤ r」画成单位球与损失等高线相切，L2 的球面光滑、切点几乎总在象限内部（只是整体推小）；L1 的菱形有落在坐标轴上的尖角，切点常正好落在轴上，于是若干分量恰好为 0。几何直觉比公式好用，也解释了「L2 让权重变小、L1 让权重消失」。",
        "训练里的对应关系要一次记住：L2 正则 = 权重衰减，等价于高斯先验的 MAP；L1 正则 = Lasso，等价于拉普拉斯先验；弹性网是两者混合。损失里的 ‖ŷ − y‖₂² 就是 MSE（高斯噪声下的 MLE，见 m4-5），L1 损失与 Huber 损失更抗离群点，因为它不让单点误差被平方放大。",
        "矩阵范数：‖A‖ = max ‖Ax‖/‖x‖，等于最大奇异值——它告诉你「一次作用最多能把向量放大多少倍」；‖A⁻¹‖ 反过来说最小能压多少。于是条件数 cond(A) = ‖A‖·‖A⁻¹‖ = σmax/σmin，一个数同时管住求解误差、迭代收敛与梯度稳定（m1-4、m3-4 都引它）。",
        "距离的选择就是模型假设：余弦只看方向（检索/推荐默认）、点积兼顾方向与强度（对热门 item 天然偏置）、欧氏同时惩罚方向与强度（KNN、k-means 默认，必须先标准化）、曼哈顿对单维异常更稳。换距离常常比换模型见效更快，也更便宜。",
        "实现层的坑：算范数用 `np.linalg.norm` 而不是自己 `sum(x**2) ** 0.5`（大数平方会溢出，`norm` 内部做了缩放）；归一化前查零向量防 nan；MSE 对离群点是平方放大，float32 下长向量累加还要考虑顺序；比较两组相似度分数之前，先确认它们在同一尺度（未归一化的 embedding 之间比 0.9 与 0.3 毫无意义）。",
        "衔接：ma2 的三件事——方向、秩、范数——到下一节的收口课合成一张自查清单，顺手把条件数与数值稳定一起复盘，再进 ma3 的梯度世界。"
      ],
      summary_en: [
        "Three norm axioms: only the zero vector has size 0, homogeneity of ‖tx‖ equals |t| times ‖x‖, and the triangle inequality. Given a norm, 'distance' is just the norm of the difference — so L1/L2/L-infinity are a family, not a single thing: all legal, each measuring something different.",
        "L2 (Euclidean) is the default: differentiable and rotation-invariant. L1, the sum of absolute values, is non-differentiable at the origin and its unit ball is a diamond. L-infinity looks only at the largest component (matrix infinity-norms and gradient bounds use it). L0 counts non-zeros, fails homogeneity, so it is not a norm at all — and that is exactly why L0-constrained problems are NP-hard while their L1 relaxation stays convex and solvable.",
        "Why L1 is sparse: draw the constraint set against the loss contours. The L2 ball is smooth, so tangency lands in the interior of a quadrant (weights shrink uniformly). The L1 diamond has corners sitting on the axes, so tangency frequently lands on a vertex and some coordinate becomes exactly zero. The picture beats the formula, and it explains 'L2 makes weights small, L1 makes them vanish'.",
        "Memorise the training-time correspondences in one go: L2 regularisation equals weight decay equals MAP with a Gaussian prior; L1 equals Lasso equals a Laplace prior; the elastic net mixes both. The squared norm of prediction minus label inside a loss is MSE, i.e. the MLE under Gaussian noise (see m4-5), while L1 and Huber losses resist outliers because they refuse to square a single large error.",
        "Matrix norms: the operator norm is the maximum stretch, equal to the largest singular value, and it answers 'how much can one application magnify a vector'; the norm of the inverse answers the opposite. Hence cond(A) is that product and also sigma_max over sigma_min, a single number governing solve error, iterative convergence and gradient stability at once (invoked in m1-4 and m3-4).",
        "Choosing a distance is choosing model assumptions: cosine sees direction only (the retrieval/recommendation default), dot product sees direction plus strength (which biases toward popular items), Euclidean punishes both (the KNN and k-means default, but only after standardising), Manhattan is sturdier against a single wild coordinate. Switching metric often beats switching model, and costs far less.",
        "Implementation traps: call np.linalg.norm rather than a hand-rolled square-root-of-sum-of-squares, because squaring large values overflows while norm rescales internally; check for the zero vector before normalising; remember that MSE amplifies outliers quadratically and that float32 reductions depend on order; and never compare two similarity scores before confirming they live on the same scale — 0.9 versus 0.3 across un-normalised embeddings is meaningless.",
        "Bridge: this chapter's three objects — direction, rank and norm — get folded into one self-check list in the closing section, together with a retrospective on condition numbers and numerical stability, before ma3 opens the world of gradients."
      ],
      code: `import numpy as np

x = np.array([3.0, -4.0])
# L2 等于 5、L1 等于 7、无穷范数等于 4、L0 等于 2（L0 只是计数，不是范数）
print(np.linalg.norm(x), np.abs(x).sum(), np.abs(x).max(), int((x != 0).sum()))
# 自己写平方求和：大数先溢出成 inf，而 norm 内部做了缩放
big = np.array([1e200, 1e200, 1e200])
print(np.sqrt((big ** 2).sum()), np.linalg.norm(big))
# 正则化的两种写法：L2 平方把权重整体推小，L1 把小权重推到 0
g = np.array([1e-4, 2e-4])
print(np.linalg.norm(g) ** 2, np.abs(g).sum())
# 条件数等于范数乘逆的范数，也等于最大奇异值除以最小奇异值
A = np.array([[1.0, 2.0], [0.0, 3.0]])
print(np.linalg.cond(A), np.linalg.norm(A, 2) * np.linalg.norm(np.linalg.inv(A), 2))
# 同方向不同强度：点积与欧氏距离都会被骗，余弦不会
a = np.array([1.0, 1.0])
bb = np.array([3.0, 3.0])
print(a @ bb, (a @ bb) / (np.linalg.norm(a) * np.linalg.norm(bb)), np.linalg.norm(a - bb))
# 梯度裁剪：只缩长度、不改方向
gvec = np.array([3.0, 4.0])
print(gvec * min(1.0, 1.0 / np.linalg.norm(gvec)))`,
      pit: "在未归一化的 embedding 上混用距离并且跨批次比较分数：同一批数据里点积会因为「行为量大的 item 模长长」而系统性霸榜（热度偏置），换一批数据后 0.8 分与昨天的 0.6 分根本不可比。要么全部 L2 归一化后用余弦（分数落在负一到正一之间，跨批次可比），要么明确保留模长并单独处理热度项，别在两套尺度之间来回切。",
      pit_en: "Mixing metrics on un-normalised embeddings and comparing scores across batches: within one batch the dot product lets high-magnitude (popular, heavily-acted) items dominate for structural reasons, and next week's 0.8 is not comparable to yesterday's 0.6. Either normalise everything to L2 and use cosine (scores live between -1 and 1 and cross-batch comparison is legitimate), or keep the magnitude deliberately and handle popularity as its own term — but do not hop between the two scales.",
      ex: {
        q: "为什么 L2 正则几乎不会把权重变成真正的 0，而 L1 会？",
        a: "因为在「约束范数不超过 r」的几何里，损失等高线与 L2 光滑球面的切点一般落在所有分量都非零的位置，只是整体缩小；而 L1 菱形/八面体的顶点恰好在坐标轴上，一旦切在顶点，就有分量精确等于 0，这就是稀疏解的来源（也对应次梯度在 0 处刚好抵消损失梯度）。",
        q_en: "Why does L2 regularisation almost never drive a weight to exactly 0 while L1 does?",
        a_en: "In the geometry of a 'norm at most r' constraint, a loss contour touching the smooth L2 sphere usually contacts it off the axes, so every coordinate merely shrinks. The L1 diamond's vertices sit exactly on the axes, so when tangency lands on a vertex some coordinate is precisely zero — the same fact expressed as a subgradient cancelling the loss gradient exactly at 0."
      }
    },

    "m2-6": {
      title: "综合重构：从一张特征表到主成分的自查链",
      title_en: "Synthesis: From a Feature Table to Principal Components, with a Self-Check Chain",
      min: 15,
      target: "能对一份真实特征表一次走完「中心化 → 检查共线与秩 → 协方差与特征分解 → 改用 SVD 做 PCA → 读解释方差比定维度 → 用条件数决定要不要正则」，并说出每个判断依据来自哪一个数值。",
      target_en: "Run one real feature table through centreing, collinearity and rank, a covariance eigendecomposition, an SVD-based PCA, an explained-variance cut for the target dimensionality, and a condition-number decision on regularisation — naming the exact number behind each judgement.",
      summary: [
        "整章的链条只有一句话：数据表 X → 中心化 → Σ = XᵀX/(n−1) → 特征分解（或直接 SVD）→ 按特征值降序取方向 → 投影。每一步都有一个「体检数值」配着，本节把配对关系钉死。",
        "体检表：`X.mean(axis=0)` 与 `X.std(axis=0)`（有没有列几乎为常数）、`matrix_rank(X)`（独立方向数）、`svd(X, compute_uv=False)`（奇异值谱）、`sv[0]/sv[-1]`（病态程度）、`sv**2/(sv**2).sum()`（解释方差比）。这五个数一次打印，省掉后面 80% 的争论。",
        "翻车复盘（真实会发生的顺序）：忘记中心化 → 第一主成分指向重心；忘记标准化 → 主成分跟着单位走；用 `eig` 又假设它有序 → 挑错方向；构造 XᵀX → 条件数平方、噪声方向挤进前列；one-hot 没丢参照类 → 秩必亏；样本太少而特征太多 → 前几个主成分其实是噪声。",
        "「留几维」的正确决策流程：先看累积解释比例（例如 90%），再看这些方向是否与业务可解释性相符，最后用下游任务的真实指标验收——三者不一致时，以任务指标为准并记进实验记录。PCA 不是自动变好的咒语，它只是「用方差换维度」的显式交易。",
        "把 ma1 与 ma2 缝起来：秩是列方向的个数（m2-1/m2-2）、奇异值是这些方向上的缩放倍数（m2-3 里特征值在非对称情形下的替身）、条件数是最大与最小的比（m1-4 的判据）、范数是这一切的度量尺（m2-5）。同一块矩阵，四个问题，一次答完。",
        "数值稳定的三条硬规则：解方程一律 `lstsq`/`solve`（必要时岭正则），不写 `inv`；做 PCA 一律 `svd(X)`，不构造 `X.T @ X`；判退化一律 `matrix_rank`/`cond` 并写明容差，不用 `det`。把这三条抄进团队的 code review 清单。",
        "自查实验（值得亲手跑一次）：把某一列乘 100，观察主成分如何跳到那一列；把两列做成相关性 0.999，观察条件数与系数符号的抖动；把样本数降到特征数以下，观察奇异值谱尾部如何贴地。这三个开关能让你把本章「看见」而不是「记住」。",
        "衔接 ma3：本章学会了「矩阵把哪些方向放大多少倍」（λ 与 σ）。ma3 问的是「参数挪一点，损失动多少」——把同一套语言指向函数的斜面，得到梯度、方向导数与链式法则，也就是所有模型训练的引擎。"
      ],
      summary_en: [
        "The whole chapter is one sentence: table X, centre it, form Σ = XᵀX/(n−1), eigendecompose (or go straight to SVD), take directions in descending eigenvalue order, project. Every step has its own health-check number, and this section pins the pairing down.",
        "The check-up list: X.mean(axis=0) and X.std(axis=0) (is some column nearly constant), matrix_rank(X) (how many independent directions), the singular-value spectrum from svd(X, compute_uv=False), sv[0]/sv[-1] (how pathological), and the squared spectrum normalised (explained variance). Print those five once and skip eighty percent of later arguments.",
        "Failure retrospective in the order it actually happens: no centring and the first component points at the centroid; no standardising and components follow the units; eig plus an assumed ordering and you pick the wrong direction; forming XᵀX squares the condition number so noise directions jump the queue; one-hot without a dropped reference guarantees rank deficiency; too few samples for too many features and the leading components are noise.",
        "The right way to choose k: read the cumulative explained-variance cut (say 90 percent), then check whether those directions survive business interpretation, then accept or reject with the downstream task metric. When the three disagree, the task metric wins and must be recorded. PCA is not a blessing that automatically improves things; it is an explicit trade of variance for dimensionality.",
        "Stitching ma1 to ma2: rank is the number of column directions (m2-1/m2-2), singular values are the stretch factors along them (the stand-in for eigenvalues once a matrix is not symmetric, m2-3), the condition number is their ratio (m1-4's test), and the norm is the ruler under all of it. One matrix, four questions, answered in a single pass.",
        "Three hard rules for numerical stability: always solve with lstsq or solve (ridge when needed) and never call inv; always do PCA with svd(X) rather than X.T @ X; always detect degeneracy with matrix_rank or cond plus a stated tolerance, never with det. Copy these three lines into the team's review checklist.",
        "A self-check experiment worth running by hand: multiply one column by 100 and watch the components jump onto it; make two columns correlate at 0.999 and watch the condition number and coefficient signs thrash; drop the sample count below the feature count and watch the tail of the singular-value spectrum hug the floor. Those three switches turn this chapter from memorised into seen.",
        "Into ma3: this chapter learned which directions a matrix stretches and by how much (λ and σ). ma3 asks how much the loss moves when a parameter moves — aiming the same language at the slope of a function to get gradients, directional derivatives and the chain rule, which is the engine under every model trained later."
      ],
      code: `import numpy as np

rng = np.random.default_rng(0)
# 身高（厘米）：单凭量级就足以劫持主成分
h_cm = rng.normal(170, 8, size=200)
# 与它完全共线的另一列，只是换了单位
h_m = h_cm / 100.0
# 体重：与身高相关，但不是同一个物理量
w_kg = rng.normal(65, 10, size=200)
X = np.column_stack([h_cm, h_m, w_kg])
# 体检 1：先看均值与标准差，有没有列几乎是常数
print(X.mean(axis=0), X.std(axis=0))
# 体检 2：先中心化，再谈方差
Xc = X - X.mean(axis=0)
sv = np.linalg.svd(Xc, compute_uv=False)
# 体检 3 与 4：奇异值谱与条件数，尾部贴地就是冗余
print(sv, sv[0] / sv[-1])
# 体检 5：解释方差比，决定留几维
print(sv ** 2 / (sv ** 2).sum())
print(np.linalg.matrix_rank(Xc), np.linalg.det(Xc.T @ Xc))
# Vt 的行天生按重要度降序，省去自己排序
Vt = np.linalg.svd(Xc, full_matrices=False)[2]
Y = Xc @ Vt.T
# 主成分两两不相关：这是 PCA 承诺给你的东西
print(np.round(np.corrcoef(Y.T), 3))
# 把一列放大 100 倍，主成分立刻跳过去：尺度敏感当场可见
Xg = Xc * np.array([100.0, 1.0, 1.0])
print(np.linalg.svd(Xg - Xg.mean(axis=0), compute_uv=False)[0])`,
      pit: "把这一章的结论当成「先跑 PCA 再建模」的固定流程：真实顺序应当是先明确任务与尺度、再看共线性与秩、最后才决定要不要降维。很多情况下正确解法是删掉重复列、标准化、加正则，而不是上一个 PCA——因为 PCA 优化的目标是方差，而你的任务目标是判别；两者方向不一致时，PCA 会主动丢掉你的信号。",
      pit_en: "Treating this chapter as a fixed 'PCA then model' pipeline: the real order is task and scale first, collinearity and rank second, dimensionality reduction last. The correct move is often deleting duplicated columns, standardising and adding a regulariser instead of PCA — because PCA optimises variance while your task optimises discrimination, and when those disagree PCA will happily discard exactly your signal.",
      ex: {
        q: "同一块数据，为什么 `svd(Xc)` 与 `eigh(Xc.T @ Xc / (n-1))` 给出的主成分偶尔在尾部差很多？",
        a: "因为两者理论上等价（Vt 的行就是特征向量，s²/(n−1) 就是特征值），但后者先把条件数平方：接近数值零的小奇异值被平方后落到可表示精度以下，尾部方向就退化成随机正交基；主方向不受影响，所以只在尾部分歧——而那份分歧本身就说明那几维没有信息。",
        q_en: "For the same data, why do svd(Xc) and eigh(Xc.T @ Xc / (n-1)) sometimes disagree strongly in the tail?",
        a_en: "Because they are theoretically identical (the Vt rows are the eigenvectors and s²/(n−1) the eigenvalues), but the second route squares the condition number: near-zero singular values get squared below representable precision and those tail directions become an arbitrary orthonormal basis. The leading directions are untouched, so the disagreement appears only in the tail — which itself is evidence that those dimensions carried no information."
      }
    }
  },

  /* ---------- 题库：对准本层新增知识点，每章 4 题（含 1 判断 + 1 填空） ---------- */
  quizAdd: {
    ma1: [
      {
        q: "X 形状 (100, 8)，v 形状 (8,)，w 形状 (100,)。下面哪种写法**不会报错但结果语义错了**？",
        o: ["X @ v 得到 (100,)", "X * v 得到 (100, 8)", "X + w[:, None] 得到 (100, 8)", "先 assert X.shape[-1] == v.shape[0] 再做 X @ v"],
        a: 1,
        why: "X * v 会把 v 沿行方向广播成逐元素乘（每列各乘一份），形状合法但根本不是「加权求和」；想要加权和必须用 @。广播类 bug 的共性就是：不报错、形状仍合理、每一格都是错的。",
        q_en: "X has shape (100, 8), v has shape (8,) and w has shape (100,). Which form raises no error yet computes the wrong semantics?",
        o_en: ["X @ v giving (100,)", "X * v giving (100, 8)", "X + w[:, None] giving (100, 8)", "asserting X.shape[-1] == v.shape[0] before X @ v"],
        why_en: "X * v broadcasts v across the rows and multiplies elementwise — a legal shape whose every cell is wrong, because a weighted sum needs @. Broadcast bugs always look like this: no error, plausible shape, wrong values."
      },
      {
        q: "同一个 2000×2000 的 float64 矩阵，按行累加比按列累加快好几倍，根本原因是？",
        o: ["按列累加需要更多浮点运算次数", "NumPy 默认行主序存储，取列要跨行跳读，缓存命中率低", "只有按行累加能被编译器自动向量化", "列累加必然触发一次隐式转置复制"],
        a: 1,
        why: "NumPy 默认 C order（行主序）：一行的数据在内存里连续，取行是顺序读、取列是跨步读。运算次数两种写法完全相同，差距来自内存访问局部性——BLAS 与张量库的设计核心就是这件事。",
        q_en: "Why can summing a 2000x2000 float64 matrix row-wise be several times faster than column-wise?",
        o_en: ["Column-wise summation performs more floating-point operations", "NumPy stores row-major by default, so columns stride across memory and cache hit rates collapse", "Only row-wise loops can be auto-vectorised", "Column summation always forces an implicit transpose copy"],
        why_en: "NumPy defaults to C (row-major) order: a row is contiguous, so reading a row is sequential while reading a column strides across memory. The operation count is identical — the gap is memory locality, which is precisely what BLAS and tensor libraries are engineered around."
      },
      {
        q: "判断：为了求解 Ax = b，先 `np.linalg.inv(A) @ b` 与直接 `np.linalg.solve(A, b)` 在耗时与精度上等价。",
        type: "judge", a: 1,
        why: "solve 只做一次带主元的分解再加回代（O(n³)+O(n²)），误差按 cond(A) 的一次方传播；显式求逆要多付一次 n³ 的矩阵乘法，且逆矩阵元素可能远大于原矩阵，耗时约 2~3 倍、误差累积更快。工程上「解方程绝不求逆」。",
        q_en: "True or false: for solving Ax = b, 'np.linalg.inv(A) @ b' and 'np.linalg.solve(A, b)' cost and behave the same.",
        why_en: "False. solve performs one pivoted factorisation plus back-substitution (O(n³) then O(n²)) with error growing like a single power of cond(A); an explicit inverse pays an extra n³ matrix product and can contain entries far larger than A, so it is roughly 2-3x slower and accumulates error faster. Never invert in order to solve."
      },
      {
        q: "要判断一个方阵在数值上「是否接近不可逆」，应看的指标是 ______（两个字术语，等于最大奇异值与最小奇异值之比）。",
        type: "fill", ans: ["条件数", "cond", "condition number"],
        why: "条件数 cond = σmax/σmin 直接表示「输入 1% 相对误差最多换来输出多少相对误差」，它是相对量、不受矩阵整体尺度影响；而行列式随维度呈指数尺度变化，「det 很小」可能只是矩阵很小。",
        q_en: "The metric for deciding whether a square matrix is numerically close to non-invertible is ______, defined as the ratio of largest to smallest singular value.",
        why_en: "The condition number, cond = σmax/σmin, states directly how much output error one percent of input error buys, and it is scale-relative. The determinant, by contrast, changes exponentially with dimension, so a tiny det may just mean a small matrix."
      }
    ],
    ma2: [
      {
        q: "做 PCA 时优先对「中心化后的数据矩阵」直接做 SVD，而不是对协方差矩阵做特征分解，主要理由是？",
        o: ["SVD 能自动完成标准化", "构造 XᵀX 会把条件数平方，噪声方向可能挤进主成分前列", "SVD 不需要中心化这一步", "特征分解只能用于非方阵"],
        a: 1,
        why: "两条路理论等价（Vt 的行即主成分，s²/(n−1) 即特征值），但构造 XᵀX 会把小奇异值平方到低于可表示精度，尾部方向退化成随机正交基；SVD 避免这次平方，也不需要假设矩阵半正定。",
        q_en: "Why is SVD on the centred data matrix preferred over an eigendecomposition of the covariance when doing PCA?",
        o_en: ["SVD standardises the data automatically", "Forming XᵀX squares the condition number, letting noise directions jump into the leading components", "SVD needs no centring step", "Eigendecomposition only applies to non-square matrices"],
        why_en: "The two routes are theoretically identical (Vt rows are the components, s²/(n−1) the eigenvalues), but forming XᵀX squares the small singular values below usable precision, so the tail becomes an arbitrary orthonormal basis. SVD avoids that squaring and never assumes positive semi-definiteness."
      },
      {
        q: "幂迭代收敛到主特征向量的快慢主要由什么决定？",
        o: ["初始向量的维度", "次大与最大特征值之比 |λ2/λ1|", "矩阵行列式的大小", "矩阵是否对称"],
        a: 1,
        why: "把初值按特征向量展开后，各分量的比值按 (λᵢ/λ₁) 的 k 次方衰减；|λ2/λ1| 越接近 1 收敛越慢（转移矩阵第二特征值 0.999 时要上千步）。对称性影响的是特征值是否为实数、特征向量是否正交，而不是收敛速率。",
        q_en: "What determines how fast power iteration converges to the dominant eigenvector?",
        o_en: ["The dimension of the starting vector", "The ratio |λ2/λ1| of second to largest eigenvalue", "The size of the determinant", "Whether the matrix is symmetric"],
        why_en: "Expanding the start vector in the eigenbasis, component ratios decay like (λi/λ1) to the k, so |λ2/λ1| near 1 means crawling (a Markov matrix with second eigenvalue 0.999 needs thousands of steps). Symmetry decides reality of eigenvalues and orthogonality of vectors, not the rate."
      },
      {
        q: "判断：`np.linalg.matrix_rank(M)` 返回的秩与调用时用的容差无关，因此可以直接当作「独立列数」写进报告。",
        type: "judge", a: 1,
        why: "浮点上没有严格为 0 的奇异值，秩的定义就是「大于容差的非零奇异值个数」；默认容差与最大奇异值和矩阵形状有关，手动改 rcond/tol 会让结果上下浮动，所以报告秩必须连容差一起写。",
        q_en: "True or false: the rank returned by np.linalg.matrix_rank(M) is independent of the tolerance used, so it can be reported as 'number of independent columns' as-is.",
        why_en: "False. Floating point has no exactly-zero singular values; rank means 'how many singular values exceed a tolerance'. The default tolerance scales with the largest singular value and the shape, so overriding rcond/tol shifts the answer, and a rank without its tolerance is not a reportable fact."
      },
      {
        q: "在正则化里，能把部分权重精确压成 0（起特征选择作用）的是 ______ 范数（填一个数字）。",
        type: "fill", ans: ["1", "L1", "l1"],
        why: "L1 的单位球有落在坐标轴上的尖角，与损失等高线相切时切点常正好在轴上，于是某些分量精确为 0；L2 球面光滑，只能把权重整体推小。L0 才真正数非零个数，但它不是范数、优化是 NP 难，L1 是它的凸松弛。",
        q_en: "In regularisation, it is the ______ norm that can push some weights to exactly zero and thus select features (fill in a number).",
        why_en: "L1: its unit ball has vertices sitting on the axes, so tangency with a loss contour often lands exactly on an axis and some coordinate becomes zero, whereas the smooth L2 sphere only shrinks weights uniformly. L0 really counts non-zeros but is not a norm and its optimisation is NP-hard; L1 is the convex relaxation."
      }
    ]
  },

  /* ---------- 词典：分类统一「AI 数学基础」，与既有名词查重 ---------- */
  terms: [
    { term: "余弦相似度", term_en: "Cosine Similarity", cat: "AI 数学基础",
      short: "点积除以两个向量的模长，只保留方向信息、约掉长度。",
      short_en: "The dot product divided by both lengths, keeping direction and cancelling magnitude.",
      detail: ["检索与推荐默认用它：同一内容被消费 100 次与 1 次方向相同，点积却差 100 倍。", "分母含模长，零向量会得到 0/0 = nan 且不报错，必须先过滤或给分母加 eps。"],
      detail_en: ["Retrieval and recommendation default to it: the same content consumed 100 times and once share a direction, yet differ a hundred-fold in dot product.", "Its denominator is a norm, so a zero vector yields 0/0 = nan silently — filter empties or add eps."],
      vs: "点积兼顾方向与强度，余弦只看方向，欧氏距离同时惩罚两者。",
      vs_en: "Dot product mixes direction and strength; cosine keeps direction only; Euclidean distance punishes both." },
    { term: "广播规则", term_en: "Broadcasting", cat: "AI 数学基础",
      short: "NumPy 按「尾部维」对齐并在必要时复制小数组来完成逐元素运算。",
      short_en: "NumPy aligns trailing axes and replicates the smaller array as needed for elementwise work.",
      detail: ["(2,3)+(3,) 每列各加一份，(2,3)+(2,) 报错，因为对齐的是最后一维。", "最危险的形态是不报错而语义错：形状仍然合法，每一格却是错值。"],
      detail_en: ["(2,3)+(3,) adds one copy per column while (2,3)+(2,) errors, since the trailing axis is what aligns.", "The dangerous case is silent semantic error: the output shape stays legal while every cell is wrong."],
      vs: "广播管逐元素运算的形状，矩阵乘只要求内维相等。",
      vs_en: "Broadcasting governs elementwise shapes; matrix products only require the inner dimensions to match." },
    { term: "行主序", term_en: "Row-major Order", cat: "AI 数学基础",
      short: "矩阵在内存里按行连续存放（C order），NumPy 的默认布局。",
      short_en: "Storing a matrix row by row in contiguous memory (C order), NumPy's default layout.",
      detail: ["取行是顺序读、取列是跨步读，同一算法按列累加可慢数倍。", "转置只交换步长不复制数据，代价被推迟到实际访问时。"],
      detail_en: ["Reading a row is sequential while reading a column strides, so the same algorithm can be several times slower column-wise.", "A transpose only swaps strides and copies nothing; the cost is deferred to the accesses themselves."],
      vs: "行主序是数组的内存布局约定，端序是一个数值内部字节的排列，层级不同。",
      vs_en: "Row-major is a layout convention for arrays; endianness orders the bytes within one value. Different levels." },
    { term: "条件数", term_en: "Condition Number", cat: "AI 数学基础",
      short: "最大奇异值与最小奇异值之比，衡量问题对扰动的敏感程度。",
      short_en: "Largest singular value over smallest: how sensitive a problem is to perturbation.",
      detail: ["cond 等于 1e12 意味着双精度只剩三四个有效位可信。", "构造 XᵀX 会让条件数平方，这是 PCA 选 SVD 的核心理由。"],
      detail_en: ["A condition number of 1e12 leaves double precision only three or four trustworthy digits.", "Forming XᵀX squares the condition number, which is the core reason PCA should use SVD."],
      vs: "条件数说「误差会放大多少倍」，范数说「一步最多能放大多少倍」。",
      vs_en: "The condition number says how much error is amplified; a norm says how much a single application can stretch." },
    { term: "线性变换", term_en: "Linear Map", cat: "AI 数学基础",
      short: "满足可加与齐次的映射，有限维下完全由一个矩阵描述。",
      short_en: "An additive, homogeneous map which in finite dimensions is fully described by a matrix.",
      detail: ["矩阵的每一列是基向量被变换后的落点，因此读矩阵就是读一次空间拉伸。", "AB 读作「先做 B 再做 A」，复合顺序敏感所以矩阵乘不交换。"],
      detail_en: ["Each column is where a basis vector lands, so reading a matrix means reading one stretch of space.", "AB means 'do B, then A'; composition is order-sensitive, hence multiplication does not commute."],
      vs: "线性变换必须把原点留在原地；再加一个偏置 b 就是仿射变换，即 nn.Linear 做的事。",
      vs_en: "A linear map fixes the origin; adding a bias b makes it affine, which is exactly what nn.Linear computes." },
    { term: "秩亏", term_en: "Rank Deficiency", cat: "AI 数学基础",
      short: "矩阵的秩小于行/列数，意味着存在可被其他列表出的冗余方向。",
      short_en: "Rank below the number of rows or columns: some direction is redundant.",
      detail: ["one-hot 不丢参照类、同一物理量存两遍，都会让设计矩阵秩亏。", "秩亏时 XᵀX 不可逆；用 pinv 取最小范数解，或加 λI 把秩补回来。"],
      detail_en: ["Keeping every one-hot column, or storing one quantity twice, makes the design matrix rank-deficient.", "Then XᵀX is non-invertible; take the minimum-norm solution with pinv, or restore rank with λI."],
      vs: "秩亏是完全冗余，病态（高条件数）是接近冗余。",
      vs_en: "Rank deficiency is exact redundancy; ill-conditioning is near redundancy." },
    { term: "幂迭代", term_en: "Power Iteration", cat: "AI 数学基础",
      short: "反复乘矩阵并归一化，收敛到主特征向量的极简算法。",
      short_en: "Repeatedly multiply and renormalise to converge on the dominant eigenvector.",
      detail: ["收敛速率由 |λ2/λ1| 决定，PageRank 与主成分求解都在用它。", "它避开完整特征分解，也顺带说明「重复施加同一算子」为何由谱半径支配。"],
      detail_en: ["Convergence runs at |λ2/λ1|; PageRank and leading-component solvers use it.", "It dodges a full eigendecomposition and explains why repeated application of an operator is governed by its spectral radius."],
      vs: "幂迭代只给最大特征对，完整特征分解给出全部方向。",
      vs_en: "Power iteration yields only the dominant pair; a full eigendecomposition yields every direction." },
    { term: "正定矩阵", term_en: "Positive-definite Matrix", cat: "AI 数学基础",
      short: "对称且所有特征值为正，等价于任意非零 x 使 xᵀAx 大于 0。",
      short_en: "Symmetric with all eigenvalues positive, equivalently xᵀAx is positive for every non-zero x.",
      detail: ["Hessian 正定意味着该驻点是严格局部极小，这是二阶优化判据。", "最小特征值大于 0 保证可逆，条件数就是最大与最小之比。"],
      detail_en: ["A positive-definite Hessian makes a stationary point a strict local minimum — the second-order test.", "A smallest eigenvalue above zero guarantees invertibility, and the condition number is the ratio to the largest."],
      vs: "半正定允许特征值为 0（协方差矩阵就是），正定要求严格大于 0。",
      vs_en: "Positive semi-definite allows zero eigenvalues (a covariance does); positive definite demands strictly greater than zero." },
    { term: "奇异值分解", term_en: "Singular Value Decomposition", cat: "AI 数学基础",
      short: "把任意矩阵写成「正交旋转 + 逐轴缩放 + 正交旋转」，奇异值非负实数。",
      short_en: "Any matrix as rotation, per-axis scaling, rotation; singular values are real and non-negative.",
      detail: ["对中心化数据直接做 SVD 就是 PCA，不必构造协方差矩阵。", "秩等于按容差计数的非零奇异值，这是浮点上唯一稳的秩定义。"],
      detail_en: ["SVD of the centred data is PCA, with no covariance matrix to build.", "Rank is the tolerated count of non-zero singular values, the only stable definition in floating point."],
      vs: "特征值只属于方阵且可能为复数；奇异值对任意形状存在且非负。",
      vs_en: "Eigenvalues need a square matrix and can be complex; singular values exist for any shape and are non-negative." },
    { term: "范数族", term_en: "Norm Family", cat: "AI 数学基础",
      short: "L1、L2、L∞ 都满足范数三公理，量的东西不同、单位球形状不同。",
      short_en: "L1, L2 and L-infinity all satisfy the axioms but measure different things with different ball shapes.",
      detail: ["L1 的尖角落在坐标轴上，给出稀疏解；L2 球面光滑，只把权重整体推小。", "L0 只数非零个数、不满足齐次性，严格说不是范数，L1 是它的凸松弛。"],
      detail_en: ["L1's corners sit on the axes and give sparse solutions; the smooth L2 sphere only shrinks weights.", "L0 merely counts non-zeros and fails homogeneity, so it is not a norm; L1 is its convex relaxation."],
      vs: "向量范数管「这个向量多大」，矩阵范数管「一步最多放大多少倍」。",
      vs_en: "A vector norm sizes a vector; a matrix norm bounds how much one application can stretch." }
  ],

  achievements: [
    { id: "ma_vec_matrix", icon: "🧮", name: "矩阵手感", name_en: "Matrix Instinct",
      desc: "完成 ma1 · 线性代数 I 向量与矩阵 全部课节", desc_en: "Finish every lesson of ma1 Linear Algebra I",
      check: ["ma1"] },
    { id: "ma_space_spectrum", icon: "🪞", name: "空间与谱", name_en: "Space and Spectrum",
      desc: "完成 ma2 · 线性代数 II 空间与特征 全部课节", desc_en: "Finish every lesson of ma2 Linear Algebra II",
      check: ["ma2"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "五分钟 C++ 到 Python 的对照（本机 python3 直接运行）": "Five-minute C++ to Python mapping (runs on a local python3)",
    "上面这行对应 int x = 5;，但没有类型声明": "Maps to int x = 5; in C++, but with no type declaration",
    "对应 std::vector，元素类型只能靠命名与注释表达": "Like std::vector, except the element type lives only in naming and comments",
    "对应 for (int i = 0; i < 3; i++)": "Like for (int i = 0; i < 3; i++)",
    "下面这行打印 -4 与 -3.5：Python 的整除向下取整，而 C++ 的 -7 除以 2 得 -3": "Prints -4 and -3.5: Python floor-divides, whereas C++ -7 / 2 gives -3",
    "任意精度整数，C++ 需要 long long 或大数库": "Arbitrary-precision integer; C++ needs long long or a bignum library",
    "返回 None；若在 C++ 用 map 的下标访问，会静默插入默认值": "Returns None; C++ map subscript would silently insert a default",
    "b 与 a 方向差得远，但长度不小：点积可以很大": "far from a in direction but not in length, so the dot product can still be large",
    "c 与 a 完全同向，只是短了一截：点积小、余弦却满分": "exactly the same direction as a, just shorter: small dot product, perfect cosine",
    "余弦相似度：点积除以两个模长，只留方向": "cosine similarity: divide the dot product by both lengths, keep direction only",
    "按点积排序会选 b，按方向排序必须选 c：推荐要的是后者": "ranking by dot product picks b, ranking by direction must pick c — recommenders want the latter",
    "零向量让分母为 0：得 nan 且不抛异常，只能提前过滤": "a zero vector makes the denominator 0: you get nan with no exception, so filter it out first",
    "同一次累加，位宽不同末位就不同：相似度别较真最后一位": "the same reduction differs in the last digit by bit width — do not chase it",
    "先看形状：2 行 3 列，约定行是样本、列是特征": "shape first: 2 rows, 3 columns, by convention rows are samples and columns are features",
    "与长度为 3 的向量相加：按尾部维对齐，等于每列各加一份": "adding a length-3 vector: trailing axes align, so each column gets one copy",
    "换成长度 2 报错，但改成 (2,1) 又能加了：这次是每行各加一份": "length 2 errors, but reshaping to (2,1) broadcasts again — this time one copy per row",
    "转置只是换个看法：不复制数据，只交换步长": "a transpose is only a different reading: no data copied, just strides swapped",
    "True 与 False：T 是 A 的视图，写它会写到原件上": "True and False: T is a view of A, so writing to it writes to the original",
    "99：这就是「我以为我在改副本」": "99 — this is what 'I thought I was editing a copy' looks like",
    "想要独立副本必须显式 copy": "an independent copy needs an explicit copy()",
    "连续化花一次拷贝，换后续按行按列访问的速度": "contiguity costs one copy and buys speed for the accesses that follow",
    "内维必须相等：(2,3) 乘 (3,4) 得到 (2,4)": "inner dimensions must match: (2,3) times (3,4) gives (2,4)",
    "看法一：结果的 (1,2) 格等于 A 的第 1 行点乘 B 的第 2 列": "reading one: entry (1,2) is row 1 of A dotted with column 2 of B",
    "看法二：结果每一列都是 A 各列的线性组合，系数取自 B 的对应列": "reading two: each result column is a linear combination of A's columns, coefficients from B",
    "看法三的产物：结合律让结果相同，代价却差一个数量级": "the third reading's payoff: association keeps the answer, changes the cost by an order of magnitude",
    "固定种子，形状与性能的实验才可复现": "fix the seed so shape and performance experiments reproduce",
    "两种括号顺序形状一样：先算 W 乘 y 只要几千次乘加，先算 X 乘 W 要四百万次": "same shape either way: W times y costs a few thousand multiply-adds, X times W costs four million",
    "浮点下两者只差最后一位：结合律在数值上是「近似」成立的": "in floating point the two differ in the last digit: association holds only approximately",
    "教科书写法：先造出整个逆矩阵，再乘一次": "textbook spelling: build the whole inverse first, then multiply",
    "工程写法：一次分解加回代，更快也更准": "engineering spelling: one factorisation plus back-substitution, faster and more accurate",
    "定义核对：A 乘它的逆等于单位阵": "definition check: A times its inverse is the identity",
    "两行几乎相同：一个病态矩阵": "two nearly identical rows: an ill-conditioned matrix",
    "条件数约 4e12：双精度只剩三四位有效数字可信": "condition number about 4e12: double precision leaves three or four trustworthy digits",
    "行列式约 1e-12：「小」本身不构成可靠判据": "determinant about 1e-12: 'small' on its own is not a reliable test",
    "带容差的秩才是稳的判据": "a tolerated rank is the stable criterion",
    "超定：用最小二乘，而不是把 X 转置乘 X 再求逆那一套": "over-determined: use least squares, not the form-XᵀX-then-invert routine",
    "加 λI 把条件数拉回来：这就是岭回归的数值意义": "adding λI drags the condition number back: that is what ridge means numerically",
    "W 形状 (3,2)：3 个输出神经元、2 个输入": "W is (3,2): three output neurons, two inputs",
    "前向：(3,2)@(2,) 得到 (3,)，一层的全部工作就是加权求和": "forward: (3,2)@(2,) gives (3,); a weighted sum is all one layer does",
    "换成星号：广播后逐元素乘，形状看着也合理，语义完全不对": "with the star it broadcasts elementwise: the shape still looks fine, the semantics are wrong",
    "批量 100 个样本：转置权重，偏置靠广播加到每一行": "a batch of 100 samples: transpose the weights, and the bias rides a broadcast onto each row",
    "整数数组的 dtype 已经定了：赋值按目标类型截断且不报错": "the integer dtype is fixed: assignment truncates to it without complaining",
    "int32 累加会回绕，NumPy 不会自动升到 int64": "int32 accumulation wraps around; NumPy will not widen to int64 for you",
    "长累加换位宽，末位差很多：相似度与似然要留 float64": "over a long reduction the bit width shows: keep float64 for similarity and likelihood",
    "就地乘要求类型相容：旧版截断、新版报错，两种都别依赖": "in-place multiplication demands compatible dtypes: old versions truncated, new ones raise — rely on neither",
    "手动升一维来控制广播方向：先想清楚要加到行还是加到列": "insert an axis by hand to steer the broadcast: decide rows or columns first",
    "3 个用户、4 部片的评分矩阵：先看形状再看数值": "a 3-user, 4-title rating matrix: shape first, numbers second",
    "影片向量按列取，与「行是样本」的约定一致": "item vectors come out of columns, consistent with 'rows are samples'",
    "手算基准：点积给强度、余弦给方向，后面所有库的结果都要能对回这里": "hand baseline: dot gives strength, cosine gives direction; every library result must reconcile with this",
    "固定种子，低秩分解才可复现": "fix the seed so the low-rank factorisation reproduces",
    "批量矩阵乘：(3,2)@(2,4) 回到评分矩阵的形状": "batched product: (3,2)@(2,4) lands back on the rating matrix's shape",
    "用「列的组合」这一看法交叉验证，从此不靠「看着差不多」": "cross-check with the 'combination of columns' reading instead of 'close enough'",
    "形状断言写进代码，比事后 debug 早一步": "put the shape assert in the code: one step ahead of debugging it later",
    "同一物理量存两遍：完全共线的设计矩阵": "the same quantity stored twice: a perfectly collinear design matrix",
    "秩 2、条件数爆表：先体检，再谈求解": "rank 2 and a huge condition number: run the physical before solving",
    "超定又秩亏：最小二乘给最小范数解": "over-determined and rank-deficient: least squares returns the minimum-norm solution",
    "加 λI 把条件数拉回可控：正则化的数值理由": "λI pulls the condition number back into range: the numerical case for regularisation",
    "v2 是 v1 的两倍：不带来任何新方向": "v2 is twice v1: it contributes no new direction",
    "把向量按列拼成矩阵，冗余就变成「秩小于列数」": "stack vectors as columns and redundancy becomes 'rank below the column count'",
    "lstsq 顺手给秩与奇异值：小奇异值就是冗余的直接证据": "lstsq hands back rank and singular values: small ones are direct evidence of redundancy",
    "残差接近 0：目标向量本来就在列空间里，也就是可被线性表出": "a residual near 0 means the target was in the column space all along, i.e. linearly expressible",
    "同一物理量存两遍，是特征表里最常见的共线": "storing one quantity twice is the most common collinearity in feature tables",
    "列和恒为 1：one-hot 不丢参照类，秩必定亏": "columns summing to one: keep every one-hot column and the rank must fall short",
    "det 给体积倍数；slogdet 给符号与对数，把连乘变成连加": "det gives the volume factor; slogdet gives sign and log, turning products into sums",
    "第二行是第一行的两倍：面积被压成一条线，秩 1、det 0": "the second row doubles the first: area collapses to a line, rank 1 and det 0",
    "det 随尺度按维度次方增长，所以「det 很大」不代表矩阵健康": "det grows to the power of the dimension, so a large det does not mean a healthy matrix",
    "把满秩矩阵整体缩小：det 下溢成 0，可逆性一点没变": "shrink a full-rank matrix overall: det underflows to 0 while invertibility is untouched",
    "真要用到行列式，就取它的符号与对数": "when you really need a determinant, take its sign and logarithm",
    "秩的真面目：按容差数非零奇异值": "rank's real face: counting singular values above a tolerance",
    "对称矩阵：特征值必为实数，特征向量互相正交": "symmetric matrix: eigenvalues are real and eigenvectors mutually orthogonal",
    "eigh 专用于对称阵，比 eig 稳、快，且按升序返回特征值": "eigh is built for symmetric input: stabler and faster than eig, eigenvalues ascending",
    "核对定义式：方向不变，只被缩放 3 倍": "checking the definition: direction unchanged, stretched by 3",
    "正交归一：转置就是逆，于是可以正交对角化": "orthonormal: the transpose is the inverse, hence orthogonal diagonalisation",
    "旋转把每个实方向都拧走：特征值是共轭复数，没有实特征向量": "a rotation twists every real direction: conjugate complex eigenvalues, no real eigenvectors",
    "幂迭代：乘一次、归一化一次，收敛到主特征向量": "power iteration: multiply, renormalise, converge to the dominant eigenvector",
    "收敛快慢只看 |λ2/λ1|，这里等于三分之一": "speed depends only on |λ2/λ1|, which is one third here",
    "谱半径大于 1：重复作用后按指数放大，这是梯度爆炸的线性版本": "spectral radius above 1: repeated application grows exponentially — the linear-algebra twin of gradient explosion",
    "一个共同潜因子：真正的信号在这里，两个观测都是它的含噪版本": "one shared latent factor: the real signal, of which both columns are noisy views",
    "中心化：不减均值时第一主成分会指向数据重心": "centring: without subtracting the mean the first component points at the centroid",
    "协方差矩阵，除 n-1 与 np.cov 的默认一致": "covariance matrix, dividing by n-1 as np.cov does by default",
    "直接对数据做 SVD：不必构造 X 转置乘 X": "SVD straight on the data: no need to build XᵀX",
    "两条路给出同一组各方向方差：奇异值平方除以 n-1 就是特征值": "both routes give the same per-direction variances: squared singular values over n-1 are the eigenvalues",
    "解释方差比：选 k 的唯一实用依据": "explained-variance ratio: the only practical basis for choosing k",
    "投影到主成分坐标：形状不变，含义换成方向": "project into principal coordinates: same shape, now meaning directions",
    "主成分两两不相关，这是 PCA 的卖点": "principal components are pairwise uncorrelated — PCA's selling point",
    "构造协方差会让条件数平方：改用 SVD 的量化理由": "building the covariance squares the condition number: the quantified reason to use SVD",
    "L2 等于 5、L1 等于 7、无穷范数等于 4、L0 等于 2（L0 只是计数，不是范数）": "L2 is 5, L1 is 7, the infinity norm is 4, L0 is 2 — L0 only counts, it is not a norm",
    "自己写平方求和：大数先溢出成 inf，而 norm 内部做了缩放": "hand-rolled sum of squares overflows large values to inf; norm rescales internally",
    "正则化的两种写法：L2 平方把权重整体推小，L1 把小权重推到 0": "two regularisers: squared L2 shrinks weights wholesale, L1 drags small ones to 0",
    "条件数等于范数乘逆的范数，也等于最大奇异值除以最小奇异值": "the condition number is the norm times the norm of the inverse, also largest over smallest singular value",
    "同方向不同强度：点积与欧氏距离都会被骗，余弦不会": "same direction, different strength: dot product and Euclidean distance are both fooled, cosine is not",
    "梯度裁剪：只缩长度、不改方向": "gradient clipping: shorten only, never change direction",
    "身高（厘米）：单凭量级就足以劫持主成分": "height in centimetres: magnitude alone is enough to hijack the components",
    "与它完全共线的另一列，只是换了单位": "a column perfectly collinear with it, merely in other units",
    "体重：与身高相关，但不是同一个物理量": "weight: correlated with height but a different quantity",
    "体检 1：先看均值与标准差，有没有列几乎是常数": "check-up 1: means and standard deviations first — is some column nearly constant?",
    "体检 2：先中心化，再谈方差": "check-up 2: centre first, then talk about variance",
    "体检 3 与 4：奇异值谱与条件数，尾部贴地就是冗余": "check-ups 3 and 4: the singular-value spectrum and the condition number — a tail hugging the floor is redundancy",
    "体检 5：解释方差比，决定留几维": "check-up 5: explained variance, which decides how many dimensions to keep",
    "Vt 的行天生按重要度降序，省去自己排序": "Vt's rows already come in descending importance, so no manual sorting",
    "主成分两两不相关：这是 PCA 承诺给你的东西": "principal components are pairwise uncorrelated: PCA's promise to you",
    "把一列放大 100 倍，主成分立刻跳过去：尺度敏感当场可见": "blow one column up 100-fold and the leading component jumps to it: scale sensitivity on display"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_MA12);
