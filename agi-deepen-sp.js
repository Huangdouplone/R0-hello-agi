/* ================================================================
 * R0:hello agi · 课程深化层（sp1 NumPy 数组计算 / sp2 Pandas 与可视化 / sp3 Jupyter 数据项目）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「Python 数据工具链」三章从每节 3 要点深化到 7~8 要点，重心放在两件小事上——
 *       「为什么会慢」（解释器逐元素开销、dtype 退化、非连续内存、临时数组）与
 *       「为什么会悄悄算错」（视图/副本、广播静默扩容、dtype 回绕、NaN 传染、
 *       索引对不齐、链式索引写入丢失、连接键重复、notebook 隐藏状态）。
 *       三章各加一节「综合重构」收口课，章首点明前置章、章末指向下一章。
 * 写法沿用 agi-deepen-s12.js / agi-deepen-ml12.js：既有课节不写 title；新课写
 *       title/title_en/target/target_en；order 覆盖全部既有 id；Python 的中文注释一律
 *       单独成行并全部登记在 codeComments；所有示例纯本地离线（内联小表 / np.random）。
 * ================================================================ */

const DEEPEN_SP = {
  stages: ["sp1", "sp2", "sp3"],

  order: {
    sp1: ["sp1-1", "sp1-2", "sp1-3", "sp1-4", "sp1-5", "sp1-6"],
    sp2: ["sp2-1", "sp2-2", "sp2-3", "sp2-4", "sp2-5", "sp2-6"],
    sp3: ["sp3-1", "sp3-2", "sp3-3", "sp3-4", "sp3-5"]
  },

  lessons: {

    /* ===================== sp1 NumPy 数组计算 ===================== */
    "sp1-1": {
      min: 13,
      summary: [
        "衔接 py1/py2：你已经会用 list 和 for 循环处理数据，这一章开始换一种底层模型——ndarray 是「一块连续内存 + 一份解释规则」，buffer 里只有原始字节，dtype / shape / strides 三个元信息才决定它是怎么被读出来的。",
        "dtype 规定每个元素占几字节、按什么格式解释、以及参与运算时走哪条机器码：int8 与 float64 的同一个位模式完全是两个数，这也是「同类型」要求的根源。",
        "strides 是「沿某个轴走一步要跨多少字节」：a[1,1] 的地址 = 首地址 + 1×strides[0] + 1×strides[1]。想通这一点，转置、切片步长、reshape 是否拷贝就全都能自己推出来。",
        "转置 a.T 一个字节都不搬，只把 shape 和 strides 交换——所以它几乎免费，但代价是内存访问不再连续，后面的循环会明显变慢；这就是「免费的视图」与「变慢的计算」并存。",
        "Python list 存的是散落堆上的对象指针，逐元素相加要先解箱再装箱；ndarray 因为同 dtype 才敢连续存放，才能整块交给 C 和 SIMD——这是 NumPy 快的物理前提。",
        "装不进同一个 dtype 就露馅：数字和字符串混排会被统一成定长字符串（dtype 形如 <U21），sum 当场报错；真正退化成 object 的是往里塞 list/dict/None 的数组，它变回指针数组，向量化彻底失效，速度掉到纯 Python 循环的水平。",
        "默认整数 dtype 是平台相关的：同样写 np.array([1])，Windows 上是 int32、Linux/macOS 上是 int64——一份会溢出的代码和一份不会溢出的代码，可能只是换了一台机器。",
        "dtype 溢出静默回绕：uint8 的 255 加 1 变成 0，无符号数被减成负数会变成天文数字，最多换来一条 RuntimeWarning，结果照样往下传。记住 NumPy 的算术是按 dtype 走的，不是按「数学」走的。"
      ],
      summary_en: [
        "Picking up py1/py2: you already process data with lists and for loops; this chapter swaps the underlying model. An ndarray is 'one contiguous block of memory plus a set of interpretation rules' — the buffer holds raw bytes only, and dtype / shape / strides are what decide how those bytes are read.",
        "dtype fixes bytes-per-element, the bit pattern's meaning and which machine code runs on it: the same bits in int8 and float64 are two different numbers, which is exactly why 'one dtype everywhere' is required.",
        "strides say how many bytes a step along each axis covers: address of a[1,1] = base + 1*strides[0] + 1*strides[1]. Once that clicks, transposes, strided slices and whether reshape copies become things you can derive yourself.",
        "a.T moves zero bytes — it just swaps shape and strides — so it is nearly free, but access is no longer contiguous and the loop after it gets visibly slower. That is the 'free view, slow compute' trade in one example.",
        "A Python list stores pointers to objects scattered over the heap, so adding elementwise means unboxing and reboxing; an ndarray can only be contiguous because it is homogeneous, and only then can the whole block be handed to C and to SIMD. That is the physical reason NumPy is fast.",
        "The mask slips when elements do not share a dtype: mixing numbers with strings coerces everything to a fixed-width string (a dtype like <U21) and sum fails outright; the real object dtype comes from putting lists, dicts or None inside, which turns the array back into a pointer array and drops throughput to plain-Python loop speed.",
        "The default integer dtype is platform-dependent: np.array([1]) is int32 on Windows but int64 on Linux/macOS, so one machine overflows and the other does not with literally the same source file.",
        "dtype overflow wraps in silence: uint8 255 + 1 becomes 0, and an unsigned value pushed below zero becomes a huge positive number. At best you get one RuntimeWarning; the value still flows downstream. NumPy arithmetic obeys the dtype, not mathematics."
      ],
      code: `import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.int16)
# 元信息三件套：同一块字节，换一套解释规则就是另一个数组
print(a.shape, a.ndim, a.dtype, a.itemsize, a.nbytes)
# strides：沿轴 0 走一步跨 6 字节，沿轴 1 走一步跨 2 字节
print(a.strides)
# 转置只交换 shape 与 strides，一个字节都不搬，但访问不再连续
print(a.T.shape, a.T.strides, a.T.base is a)
# 数字混进字符串：整列被统一成定长字符串，算术当场失效
mixed = np.array([1, 2, "3"])
print(mixed.dtype, mixed)
# 放不进同一种 dtype 的元素退化成 object：又变回指针数组
obj = np.array([[1, 2], [3]], dtype=object)
print(obj.dtype)
# 窄整型的算术按 dtype 回绕：只给一条告警，数值照错下去
u = np.array([250, 255], dtype=np.uint8)
print(u + 10)
# sum 会替窄整型换成平台整数累加器，cumsum 却原样保留 dtype
w = np.ones(300, dtype=np.uint8)
print(w.sum(), w.cumsum()[-1])`,
      pit: "没有显式写 dtype 就默认「它一定是 64 位」：Windows 上默认 int32，把两个 10 万相乘再累加就会回绕成负数；同一份代码在 Linux 笔记本上跑对、在实验室 Windows 机器上跑错，查半天以为是版本问题。数值管线里凡是可能变大的整数列，要么显式写 int64，要么从一开始就用 float64。",
      pit_en: "Assuming the default integer is 64-bit when you never wrote a dtype: on Windows it is int32, so multiplying two 100k-scale values and accumulating wraps into negative territory. The same file works on a Linux laptop and lies on the lab's Windows machine, and you blame the version. For any integer column that can grow, write int64 explicitly or start in float64.",
      ex: {
        q: "为什么 a.T 几乎不花时间，紧接其后对 a.T 做的逐行运算却明显变慢？",
        a: "因为转置只是交换了 shape 与 strides 的元信息、没有移动内存，而沿「新的行方向」遍历时要按更大的步长跳跃访问，CPU 预取与缓存行都失效，慢的是访存而不是转置本身。",
        q_en: "Why does a.T cost almost nothing while the row-wise operation right after it is clearly slower?",
        a_en: "The transpose only swaps the shape and strides metadata and moves no memory; walking the 'new rows' then jumps with a large stride, so cache lines and hardware prefetch stop helping. The cost is in memory access, not in the transpose."
      }
    },

    "sp1-2": {
      min: 14,
      summary: [
        "创建函数各有脾气：zeros/ones/full 是明确初始化，arange 用浮点步长会因舍入少给你最后一个元素（要等间距就用 linspace），empty 干脆不初始化——读它拿到的是上一块内存留下的垃圾值。",
        "基本切片（`a[1:5]`、`a[:, 0]`、`a[::2]`）返回视图，`v.base is a` 为真，写 v 就是写 a；越界切片不报错，只给你更短甚至空的结果，这一点和 list 一致但更容易被忽略。",
        "花式索引（整数数组或布尔数组当索引）返回副本，改它原数组一动不动——「我明明改了」却没有任何反应，是这一节最贵的一种事故；要写回必须一次到位地 `a[idx] = 值`。",
        "重复下标只会被写一次：`d[[0,0,3]] += 1` 里 d[0] 只加 1，因为 NumPy 先把选中元素取成副本、算完再整体写回；做计数、做梯度累加必须改用 `np.add.at(d, idx, 1)`，它才逐次写回。",
        "降维还是保形是两回事：`a[0]` 少一个轴，`a[[0]]` 仍是二维；聚合时加 `keepdims=True` 保住被压掉的轴，后面把均值减回去广播才对得上。",
        "reshape 与 order：order='C' 按行读、order='F' 按列读，同一个数组两种展开结果不同；`a.T.reshape(-1)` 会静默换序，它等价于 `a.flatten(order='F')`——这类 bug 数值上合法、形状上正确，只有语义错了。",
        "reshape 有时是视图有时是拷贝，判据是内存连不连续：`flatten()` 一定拷贝，`ravel()` 连续时给视图；对转置或带步长的切片做 reshape/astype 会隐式整块拷贝，性能与内存同时翻倍，需要时显式 `np.ascontiguousarray`。",
        "单元素索引返回的是 NumPy 标量（如 np.float64），它不是 Python float：`json.dumps` 会直接报「not JSON serializable」，`isinstance(x, float)` 在部分平台也不成立；要交给下游就 `float(x)` 或 `.item()`。"
      ],
      summary_en: [
        "The constructors have temperaments: zeros/ones/full initialise explicitly, arange with a float step can drop the last element to rounding (use linspace when you want even spacing), and empty initialises nothing — reading it returns whatever the previous tenant of that memory left behind.",
        "Basic slicing (`a[1:5]`, `a[:, 0]`, `a[::2]`) returns a view: `v.base is a` is true and writing v writes a. Out-of-range slices raise nothing and simply give a shorter or empty result — same as lists, but easier to miss.",
        "Fancy indexing (an integer or boolean array as index) returns a copy, so mutating it leaves the original untouched — the 'I clearly changed it, nothing happened' accident, and the expensive one in this lesson. Writing back has to happen in one shot: `a[idx] = value`.",
        "Repeated indices are written once: in `d[[0,0,3]] += 1`, d[0] only gains 1, because NumPy takes a copy of the selected elements, computes, then writes the whole thing back. Counting and gradient accumulation need `np.add.at(d, idx, 1)`, which really writes back per element.",
        "Dropping an axis and keeping it are different acts: `a[0]` loses one axis, `a[[0]]` stays 2-D. Add `keepdims=True` to a reduction to keep the collapsed axis, or subtracting that mean afterwards will not broadcast.",
        "reshape and order: order='C' reads row-major, order='F' column-major, so the same array unrolls two different ways; `a.T.reshape(-1)` silently reorders and equals `a.flatten(order='F')` — numbers valid, shape correct, semantics wrong. That class of bug never raises.",
        "reshape is sometimes a view and sometimes a copy, and the deciding factor is contiguity: `flatten()` always copies, `ravel()` gives a view when contiguous. Reshaping or re-casting a transposed or strided slice forces a full implicit copy, doubling both time and memory; fix it deliberately with `np.ascontiguousarray`.",
        "Single-element indexing returns a NumPy scalar such as np.float64, not a Python float: `json.dumps` raises 'not JSON serializable' and `isinstance(x, float)` may be false; convert with `float(x)` or `.item()` before handing it downstream."
      ],
      code: `import numpy as np

a = np.arange(10)
v = a[2:5]
# 基本切片是视图：base 指回原数组，写它等于写原数组
v[0] = 99
print(a)
c = a[[2, 5, 8]]
# 花式索引是副本：改它原数组一动不动
c[0] = -1
print(a[2])
idx = np.array([0, 0, 3])
d = np.zeros(5)
# 重复下标只写一次，+= 也是「取副本、算完再整体写回」
d[idx] += 1
print(d)
# 真的要逐次累加就用 ufunc.at
np.add.at(d, idx, 1)
print(d)
m = np.arange(6).reshape(2, 3)
# axis=1 压掉列轴得到 (2,)，与 (2,3) 从右往左比是 3 对 2，直接报错
# print(m - m.mean(axis=1))
# keepdims 保住那个轴，广播才对得上
print(m - m.mean(axis=1, keepdims=True))
# 转置之后 reshape 会静默换序：等价于按列展开
print(np.arange(4).reshape(2, 2).T.reshape(-1))
# NumPy 标量不是 Python float，交给序列化之前先取出来
s = m[0, 0]
print(type(s).__name__, float(s))`,
      pit: "切片视图被当成「局部变量」长期持有：`sub = df_arr[:100]` 之后原数组再也无法被回收（视图攥着整块 buffer），你以为只留了 100 个元素，其实留了几百万；同时任何对 sub 的写入都在改原件。要么尽早 `.copy()`，要么干脆别把视图存进长生命周期对象。",
      pit_en: "Holding a sliced view as if it were a local variable: after `sub = df_arr[:100]` the original can never be freed (the view pins the whole buffer), so you think you kept 100 elements but you kept millions — and every write to sub mutates the original. Either `.copy()` early or do not store views in long-lived objects.",
      ex: {
        q: "同样是从数组里挑元素，为什么 `a[1:4]` 的修改会反映到 a，而 `a[[1,2,3]]` 的修改不会？",
        a: "因为前者是连续区间、可以直接用原 buffer 加偏移和步长描述，所以返回视图；后者挑出的元素在内存里不连续，必须复制到一块新内存才能形成规则数组，于是返回副本。",
        q_en: "Both pick elements out of an array — why does mutating `a[1:4]` show up in a while mutating `a[[1,2,3]]` does not?",
        a_en: "A contiguous range is describable by an offset plus strides into the same buffer, so it returns a view; scattered indices are not contiguous in memory, so they must be gathered into a fresh block to form a regular array, hence a copy."
      }
    },

    "sp1-3": {
      min: 15,
      summary: [
        "向量化为什么快：Python 的 for 每转一圈都要「从指针盒子取出对象 → 判断类型 → 找到对应的加法 → 把结果装箱成新对象」，解释器本身的开销比一次加法大一到两个数量级；ufunc 把这层循环搬进 C，拿到 dtype 就跑一段编译好的机器码。",
        "除了省掉解释器，向量化还顺带吃到两个硬件红利：元素连续存放让 CPU 预取命中、SIMD 指令一条处理多个数；用 list 时指针到处跳，这两条全享受不到，所以「换成 NumPy 就快」不是魔法，是访存模式变了。",
        "但别把倍数当承诺：几万元素以上才可能拉开几十到几百倍，几个数的短数组上 NumPy 反而更慢（分配与函数调用固定成本占大头）；性能问题一律先测再改。",
        "整数运算是习惯冲突区：NumPy 里 `/` 永远给浮点结果，真正会咬人的是 `//`——它是向下取整而不是向零截断，`-3 // 2 == -2`；而纯 Python 整数的除法、以及先整数除再转浮点，都会把小数部分提前丢掉。",
        "聚合函数的 axis 语义只有一句话：写下来的那个轴被压掉。`axis=0` 压掉第 0 轴（行方向）→ 每列一个值；`axis=1` 压掉第 1 轴（列方向）→ 每行一个值；记不住就想「结果里少掉哪个 shape」。",
        "NaN 是传染体：一个 NaN 就让 mean/sum/sort 的结果整体变 NaN，而且不报错；`nanmean/nansum` 才会跳过它，但它对「全 NaN 的切片」会给出一条 RuntimeWarning 并返回 NaN，这个 NaN 会安静地一路带进模型。",
        "`out=` 与原地运算能省掉与输入等宽的巨大临时数组：`np.multiply(x, 2.0, out=buf)` 不产生新对象，`x += 1` 也是原地；但原地写会同时改掉共享同一 buffer 的那些视图，且 out 与被读区域重叠时行为不保证，别拿它当「一律更快」。",
        "什么时候不该向量化：需要逐元素分支且后一步依赖前一步结果（真串行）、想中途 break、或者代码是给别人读的原型——这时可读性与可调试性比几十倍的速度更值钱，先把算法跑对再优化那一两个热点。"
      ],
      summary_en: [
        "Why vectorisation is fast: every turn of a Python for loop means 'pull the object out of its pointer box, work out its type, dispatch the right add, box the result into a new object', and that interpreter overhead is one to two orders of magnitude larger than one addition; a ufunc moves the loop into C and runs compiled machine code for the known dtype.",
        "Beyond dropping the interpreter, vectorisation collects two hardware bonuses for free: contiguous elements hit the prefetcher and SIMD instructions handle several numbers per instruction. A list of scattered pointers gets neither, so 'swap in NumPy and it is faster' is not magic — the access pattern changed.",
        "Do not treat the speedup as a promise: the tens-or-hundreds factor only appears above tens of thousands of elements, and on a handful of numbers NumPy is slower because allocation and call overhead dominate. Measure before you optimise, always.",
        "Integer arithmetic is where habits collide: in NumPy `/` always yields floats, so the real bite comes from `//`, which floors rather than truncates toward zero (`-3 // 2 == -2`); plain Python integer division, and dividing in integers before casting, discard the fraction even earlier.",
        "Axis semantics for reductions fit in one line: the axis you name is the axis that disappears. `axis=0` collapses rows so you get one value per column; `axis=1` collapses columns for one value per row. When in doubt, ask which entry of shape is being removed.",
        "NaN is contagious: a single NaN turns the whole mean/sum/sort result into NaN without complaining; `nanmean/nansum` skip it, but on an all-NaN slice they emit a RuntimeWarning and return NaN, and that NaN rides quietly all the way into your model.",
        "`out=` and in-place operators kill temporary arrays the same size as the input: `np.multiply(x, 2.0, out=buf)` allocates nothing and `x += 1` is in-place too — but writing in place also changes every view sharing that buffer, and overlapping output with the region being read is not guaranteed, so it is not a free win.",
        "When not to vectorise: per-element branches where each step depends on the previous one (genuinely serial), early exit via break, or prototype code people must read. There, clarity and debuggability outweigh the speedup — get the algorithm right first, then optimise the one or two hot spots."
      ],
      code: `import numpy as np

x = np.arange(1_000_000, dtype=np.float64)
# 循环版：每个元素都要拆对象、查类型、再装箱，解释器开销远大于乘法
acc = 0.0
for i in range(x.size):
    acc += x[i] * 1.5
# 向量版：同一件事，循环由 C 完成，还吃到连续访存与 SIMD
vec = x * 1.5
print(round(acc) == round(float(vec.sum())))
# NumPy 里的除法：单斜杠永远给浮点，双斜杠才是向下取整
print(np.array([5.0]) / np.array([2.0]), -3 // 2)
# 想让整数走浮点除，就把其中一边写成浮点字面量
print(1.0 * np.arange(5) // 2)
# 轴语义：axis=0 压掉行轴＝逐列，axis=1 压掉列轴＝逐行
m = np.arange(6).reshape(2, 3)
print(m.sum(axis=0), m.sum(axis=1))
# 一个 NaN 传染整个结果，nan 系列函数才跳过它
bad = np.array([1.0, np.nan, 3.0])
print(bad.mean(), np.nanmean(bad))
# 全 NaN 的切片：告警加 NaN，它会一路带到下游
print(np.nanmean(np.array([np.nan, np.nan])))
# out= 复用同一块内存，省掉一个与输入等宽的临时数组
buf = np.empty_like(x)
np.multiply(x, 2.0, out=buf)
print(buf[0], buf[-1])`,
      pit: "「向量化了所以一定省内存」是反的：`((a * b) + c) / d` 这种链式表达式会为每一步分配一个和输入同宽度的临时数组，亿级 float64 上几行就能吃掉几 GB 内存，表现为莫名其妙的 MemoryError 或机器卡死。链式计算要么拆成 `out=` 的原地步骤，要么按块（chunk）处理。",
      pit_en: "'It is vectorised, so it must be memory-cheap' is backwards: a chained expression like `((a * b) + c) / d` allocates one input-sized temporary per step, and on a hundred-million-element float64 array a few lines eat gigabytes — the symptom is a mystery MemoryError or a frozen machine. Break the chain into in-place steps with `out=`, or process in chunks.",
      ex: {
        q: "为什么把 Python 循环换成 NumPy 之后，同样的算式有时反而更慢？",
        a: "因为向量化每一步都有固定的分配与遍历成本，元素太少时它盖不过解释器省下的那点开销；而且中间结果的分配和内存带宽会成为新瓶颈，所以要看数组规模再决定。",
        q_en: "After replacing a Python loop with NumPy, why can the same formula sometimes get slower?",
        a_en: "Each vectorised step pays fixed allocation and traversal cost, which the saved interpreter overhead cannot cover when there are few elements; allocation and memory bandwidth then become the new bottleneck. The array size decides."
      }
    },

    "sp1-4": {
      min: 13,
      summary: [
        "广播规则只有两条：形状从最后一个轴往前逐个比，相等或其中一个是 1 就算对得上；轴数不够就在左边补 1。设计目的是「不用真的复制就能让形状不同的小数组参与大数组运算」，比如给每列加一个偏置。",
        "广播不会先造大数组：它把长度为 1 的那条轴的 strides 设成 0，于是同一块内存被反复读——`np.broadcast_to(v, (n, m))` 出来的视图 nbytes 还是原来那点的量，代价全在访存上。",
        "但「偷偷产生的拷贝」在运算这一步：任何 ufunc 都必须输出一个完整的、新分配的 ndarray，`X + v` 在 (n,m) 上就是 n×m 个元素的新内存。省下的只是输入侧，输出侧一分没省。",
        "最高频的形状事故是 `(n,)` 与 `(n,1)` 相减：从右往左比 n 对 n 合法，于是得到 (n,n) 的外积式结果——不报错、形状合法、语义完全不是你想要的成对差。两个一维数组长度不同才会报错，所以「对不齐却算出来了」比报错更危险。",
        "一维形状本身是模糊的：`v.shape == (m,)` 既不是行向量也不是列向量，只有 `(1, m)` 与 `(m, 1)` 才是。跨维计算之前先 `print(x.shape)`，用 `x[:, None]` 或 `reshape(-1, 1)` 把意图写出来。",
        "减均值这类操作必须让轴对上：`X - X.mean(axis=0)` 天然正确（每列一个数，沿行方向广播）；`X - X.mean(axis=1)` 会报 could not broadcast，要么 `keepdims=True`，要么显式补一轴。报错其实是运气好——只有当 n 恰好等于 m 时它才会静默算错。",
        "广播只会拉伸长度为 1 的轴，所以任何你不想被拉伸的轴都不能是 1：`(1,3)` 与 `(3,1)` 于是得到 (3,3)。反过来，把行向量硬写成 `(1,m)` 数值上正确、读起来是负担，用 `x[None, :]` 更清楚。",
        "排查广播问题的手法：在代码里把每步的形状写成注释 `# (n,m) - (m,) -> (n,m)`，或临时 `print(arr.shape)`；把形状当作接口契约的一部分，就像 C++ 里把单位写进变量名一样。"
      ],
      summary_en: [
        "Broadcasting has two rules only: compare shapes from the last axis backwards, and axes match when they are equal or one of them is 1; missing axes are prepended as 1s. The design goal is letting differently shaped small arrays join big operations without an actual copy, such as adding one bias per column.",
        "Broadcasting does not materialise the big array first: it sets the stride of the length-1 axis to 0 so the same bytes are read repeatedly — the view from `np.broadcast_to(v, (n, m))` still reports the original tiny nbytes, and the whole cost is in memory access.",
        "The quiet copy happens at the operation: any ufunc must produce a complete freshly allocated ndarray, so `X + v` on an (n,m) input allocates n*m elements. What you saved is on the input side; the output side is not saved at all.",
        "The most frequent shape accident is `(n,)` minus `(n,1)`: comparing right-to-left finds n against n, which is legal, and you get an (n,n) outer-product-shaped result — no error, a legal shape, and semantics that are not the pairwise difference you wanted. Two 1-D arrays of different lengths do raise; 'it lined up and produced something wrong' is far worse than an exception.",
        "A 1-D shape is inherently ambiguous: `v.shape == (m,)` is neither a row nor a column vector; only `(1, m)` and `(m, 1)` say which. Print `x.shape` before cross-dimensional work and write the intent with `x[:, None]` or `reshape(-1, 1)`.",
        "Mean-subtraction has to line up on the right axis: `X - X.mean(axis=0)` just works (one number per column, broadcast down the rows) while `X - X.mean(axis=1)` raises 'could not broadcast' until you add `keepdims=True` or an explicit new axis. Raising is good luck here — when n happens to equal m it computes the wrong thing silently.",
        "`(1,3)` with `(3,1)` gives (3,3), and length-1 axes are the only ones that may be stretched — so every axis you do not want stretched must not be 1. Conversely, spelling a row vector as `(1,m)` is numerically fine but costs the reader; `None` is clearer.",
        "Debugging habit for broadcasting: write the shapes as a comment at each step, `# (n,m) - (m,) -> (n,m)`, or sprinkle temporary `print(arr.shape)` calls. Treat shape as part of the interface contract, the way you would put units into a C++ variable name."
      ],
      code: `import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(4, 3))
# (4,3) 与 (3,)：从右往左 3 对 3 合法，左轴补 1，等于每列减同一个数
print((X - X.mean(axis=0)).shape)
# (4,3) 与 (4,)：从右往左 3 对 4 不合法，报错其实是帮了你
# print(X - X.mean(axis=1))
print((X - X.mean(axis=1, keepdims=True)).shape)
col = np.array([[1.0], [2.0]])
row = np.array([10.0, 20.0, 30.0])
# (2,1) 与 (3,)：两轴都对得上，结果是 2x3 的外积式矩阵
print(col + row)
# 广播视图不复制：那条被拉伸的轴步长为 0，而且是只读的
b = np.broadcast_to(row, (2, 3))
print(b.strides, b.flags.writeable, b.nbytes)
# 但运算结果一定是一份全新的完整数组，n*m 的内存就是这么花掉的
print((col + row).nbytes)
# 把形状写成注释，是这类 bug 唯一可靠的防线`,
      pit: "忘了列向量与行向量的区别：手里那份 `s.shape == (n,)` 本来要减到 (n,m) 表的每一行上，就必须是 (n,1)；直接相减时只要 m 与 n 相等，NumPy 就把它当成「减到每一列上」，不报错地给你一张每列被不同偏移处理过的矩阵。凡是准备和二维表做算术的一维量，先 `[:, None]` 显式加轴，形状对不上就会老老实实报错。",
      pit_en: "Confusing a column vector with a row vector: a 1-D `s` of shape (n,) meant to be subtracted row-wise from an (n,m) table has to become (n,1); subtract it as-is and, whenever m equals n, NumPy happily reads it as a per-column offset and returns a matrix with no error. Add the axis explicitly with `[:, None]` for any 1-D quantity about to meet a 2-D one, so mismatches raise honestly.",
      ex: {
        q: "广播明明「不复制」，为什么 NumPy 官方还要提醒广播会撑爆内存？",
        a: "因为省下的只是把输入虚拟拉伸的那一步，运算仍要写出一份形状为广播结果的完整新数组；对 (n,m) 做逐元素运算就是 n*m 份内存，输入是视图、输出是实体。",
        q_en: "If broadcasting does not copy, why does NumPy still warn that broadcasting can blow up memory?",
        a_en: "Only the virtual stretch of the inputs is free; the operation still writes one full new array with the broadcast shape. Elementwise work on (n,m) costs n*m of real memory — the inputs are views, the output is matter."
      }
    },

    "sp1-5": {
      min: 12,
      summary: [
        "`*` 是逐元素乘、`@` 才是矩阵乘（`np.dot`/`np.matmul` 等价）。真正的阴险处在于两者常常都能算：A 是 (n,k)、w 是 (k,) 时 `A * w` 也能广播成 (n,k)，形状合法、值全错，而且这是「模型输出不对但没有任何报错」的头号来源之一。",
        "批量化是向量化的主战场：`X @ w` 一次算完 n 个样本的加权和，正是 ml1 里线性模型的前向；要写更复杂的缩并就用 `np.einsum('ij,j->i', X, w)`，它把轴名字写在脸上，比反复 reshape 猜方向可靠得多。",
        "`np.linalg` 提供 inv/solve/eig/svd/norm 等。数值线性的第一条实践规则是「不要真的求逆」：解 Ax=b 用 `np.linalg.solve(A, b)`，它更快、更稳，也不会有「逆矩阵乘回来又差一点」的二次舍入。",
        "条件数是可信度仪表：`np.linalg.cond(A)` 表示输入误差最大会被放大多少倍，结果的有效位数大约损失 log10(cond)。cond 是 1e8 时你的 float64 只剩七八位可信数字——它不报错，只是安静地不准。",
        "SVD 是降维与压缩的地基（PCA、推荐里的低秩近似都在它上面）：`U, s, Vt = np.linalg.svd(A, full_matrices=False)`；只要奇异值时传 `compute_uv=False` 会快很多。奇异值从大到小的衰减形状本身就是「有多少个有效方向」的答案。",
        "随机数要有「流」的概念：老写法 `np.random.seed` 动的是全局状态，任何第三方库共用它，于是你的种子会被别人悄悄改；新写法 `rng = np.random.default_rng(42)` 把发生器做成显式对象传下去，谁用哪条流一目了然。",
        "可复现不止固定种子：dtype（float32 与 float64 的随机数序列不同）、并行归约的相加顺序、不同 BLAS/编译选项都会让结果在最后几位不同。所以浮点比较一律用 `np.allclose(a, b)`，别写 `a == b`，也别把「差 1e-9」当成 bug。",
        "权重初始化的 NumPy 写法就是上面这些的组合：`randn(...) * 0.01` 之类的小随机初始化，是为了同时打破对称（全同权重会让所有神经元梯度一样、永远学不出差别）和避免把激活推进饱和区（太大则导数≈0）。"
      ],
      summary_en: [
        "`*` is elementwise product and `@` is the matrix product (equivalently np.dot / np.matmul). The trap is that both often compute: with A of shape (n,k) and w of shape (k,), `A * w` also broadcasts to (n,k) — a legal shape, entirely wrong values, and one of the top causes of 'my model outputs garbage and nothing raised'.",
        "Batching is where vectorisation earns its keep: `X @ w` computes the weighted sum for n samples in one call, which is exactly the forward pass of the linear model in ml1. For messier contractions use `np.einsum('ij,j->i', X, w)` — it names the axes in the source instead of making you guess directions through reshapes.",
        "np.linalg offers inv/solve/eig/svd/norm. The first practical rule of numerical linear algebra is 'never actually invert': solve Ax=b with `np.linalg.solve(A, b)`, which is faster, more stable, and avoids the second round of rounding from multiplying by an inverse.",
        "The condition number is your credibility gauge: `np.linalg.cond(A)` says how much input error can be amplified, and you lose about log10(cond) significant digits from the result. At cond = 1e8 a float64 answer has only seven or eight trustworthy digits — no error, just quiet inaccuracy.",
        "SVD is the substrate of dimensionality reduction and compression (PCA and low-rank recommenders sit on it): `U, s, Vt = np.linalg.svd(A, full_matrices=False)`, and pass `compute_uv=False` when you only need the singular values. The decay shape of s across indices is itself the answer to 'how many effective directions are there'.",
        "Think of randomness as streams: the old `np.random.seed` mutates global state that every third-party library also shares, so your seed can be silently changed by someone else. The modern form `rng = np.random.default_rng(42)` hands you an explicit object to pass down, so it is obvious which stream each part draws from.",
        "Reproducibility is more than a fixed seed: dtype (float32 and float64 draw different sequences), the summation order inside parallel reductions, and different BLAS or compiler flags all change the last digits. Compare with `np.allclose(a, b)`, never `a == b`, and do not treat a 1e-9 difference as a bug.",
        "Weight initialisation is just these facts combined: a small-random draw such as `randn(...) * 0.01` simultaneously breaks symmetry (identical weights give every neuron the same gradient, so they never specialise) and keeps activations out of the saturated region (too large and the derivative is about zero)."
      ],
      code: `import numpy as np

A = np.array([[1.0, 2.0], [3.0, 4.0]])
w = np.array([1.0, 10.0])
# 逐元素乘会广播成 (2,2)，矩阵乘是 (2,2)@(2,) -> (2,)：两者都不报错
print(A * w)
print(A @ w)
# 显式点出轴名字，比反复 reshape 更不容易搞错方向
print(np.einsum("ij,j->i", A, w))
b = np.array([1.0, 1.0])
# 解方程用 solve，别写成 inv(A) @ b：更少运算也少一次舍入
print(np.linalg.solve(A, b))
# 条件数越大越危险：它告诉你结果还能信几位
print(np.linalg.cond(A), np.linalg.cond(np.array([[1.0, 2.0], [2.0, 4.000001]])))
U, s, Vt = np.linalg.svd(A, full_matrices=False)
print(s)
rng = np.random.default_rng(42)
# 同一条流按顺序取数；重跑这一段才会完全一致
print(rng.normal(size=3))
# 换一个同样 seed 的新发生器，得到的是同一段数
print(np.random.default_rng(42).normal(size=3))
# 浮点比较一律用 allclose：并行归约的相加顺序就会改最后几位
print(np.allclose(A @ np.eye(2), A))`,
      pit: "把 `np.random.seed(0)` 当项目级可复现的全部：它只固定了 NumPy 的全局流，pandas 的 `sample`、sklearn 的 `train_test_split`、以及任何库内部自己 new 的发热器都不受它影响；换个方向也一样错——只固定了种子却没固定数据文件的版本。真正要复现的每个随机点都得显式拿到 `random_state=` 或自己的 `rng`。",
      pit_en: "Treating `np.random.seed(0)` as the whole of project reproducibility: it pins only NumPy's global stream, leaving pandas' `sample`, sklearn's `train_test_split` and any library that builds its own generator untouched. The mirror mistake is pinning seeds but not the data file version. Every place that consumes randomness needs its own explicit `random_state=` or `rng`.",
      ex: {
        q: "为什么 `A * w`（A 是 (n,k)、w 是 (k,)）通常不报错却算错了？什么写法能让它报错？",
        a: "因为广播规则允许 (n,k) 与 (k,) 沿列方向对齐，结果形状合法但每个元素只是被缩放而不是求和；写成 `A @ w` 就得到 (n,)，或者把 w 摆成 (k,1) 让形状约束真的生效，错就会以异常的形式暴露。",
        q_en: "Why does `A * w` (A of shape (n,k), w of shape (k,)) usually not raise yet compute the wrong thing, and which spelling would raise?",
        a_en: "Broadcasting happily aligns (n,k) with (k,) along the columns, so the shape is legal while each element is merely scaled instead of summed. Writing `A @ w` yields (n,), and reshaping w to (k,1) makes the shape constraint bite, so mistakes surface as exceptions."
      }
    },

    "sp1-6": {
      title: "综合重构：把 for 循环安全地翻译成 ndarray",
      title_en: "Synthesis: Translating a for Loop into ndarray, Safely",
      min: 15,
      target: "拿到一段 Python 循环数值代码，能改写成向量版本，并在改写前后逐项确认 dtype、shape、视图/副本、NaN 策略与随机流；能用 allclose 证明两版等价。",
      target_en: "Given a numeric Python loop, rewrite it as vectorised code while checking dtype, shape, view-vs-copy, NaN policy and the random stream; prove the two versions agree with allclose.",
      summary: [
        "本章前置是 py1/py2（列表、循环、函数）与一点 ma1 的矩阵语言；到这里你已经有了「连续内存 + 元信息」这一条主线，可以回答所有「为什么慢」与「为什么悄悄错」。",
        "重写四步固定动作：先用循环版把结果算对并打印几个样本值 → 写下每步的形状注释 → 换成向量版 → 用 `np.testing.assert_allclose` 对比两版。少了第三步你就在猜，少了第四步你就在赌。",
        "dtype 自查清单：默认整数在 Windows 是 int32；可能变大的量显式写 int64 或 float64；窄整型的 `cumsum`、`*`、`+` 一律按 dtype 回绕，只有 `sum` 给你换了累加器。",
        "视图/副本自查清单：切片是视图、fancy index 是副本、`reshape` 看连不连续、`flatten` 一定是副本；写回必须一次到位，重复下标要用 `np.add.at`。判据用 `x.base` 和 `x.flags['C_CONTIGUOUS']`，别靠记忆。",
        "轴与广播自查清单：每个一维量在遇到二维表之前先 `[:, None]`；聚合配 `keepdims=True`；把 `(n,)` 与 `(n,1)` 当成两种不同类型，永远不要把形状当作「反正能算」。",
        "NaN 与可复现：进入聚合前明确策略（`nanmean` 还是先补指示列）；随机统一走一条显式 `rng = np.random.default_rng(seed)`，并把 seed 与数据指纹一起打印出来。",
        "常见翻车复盘（本章五个）：整型回绕成负 / object dtype 让速度掉回循环 / fancy index 改了没反应 / 广播把 (n,) 悄悄撑成 (n,n) / 一个 NaN 让整张聚合表变 NaN。这五条都能用一行打印验证，别等下次再推。",
        "衔接 sp2：真实世界给你的不是整齐的方阵，而是带列名、带缺失、索引还可能对不齐的表；下一章 pandas 会把「形状对齐」换成「标签对齐」，那是另一类静默错误的发生地。"
      ],
      summary_en: [
        "This chapter assumed py1/py2 (lists, loops, functions) plus a little of ma1's matrix language; with the 'contiguous memory plus metadata' thread in hand you can now answer every 'why is it slow' and 'why is it quietly wrong'.",
        "A fixed four-step rewrite: compute the loop version correctly and print a few sample values → write down the shape of each step as a comment → produce the vectorised version → compare the two with `np.testing.assert_allclose`. Without the third step you are guessing; without the fourth you are gambling.",
        "dtype checklist: the default integer is int32 on Windows; write int64 or float64 explicitly for anything that can grow; for narrow integers `cumsum`, `*` and `+` all wrap in the dtype, and only `sum` quietly swaps in a wider accumulator.",
        "View/copy checklist: slices are views, fancy indices are copies, reshape depends on contiguity, flatten always copies; write back in one statement, and use `np.add.at` for repeated indices. Decide with `x.base` and `x.flags['C_CONTIGUOUS']` instead of from memory.",
        "Axis and broadcast checklist: give every 1-D quantity a `[:, None]` before it meets a 2-D one; pair reductions with `keepdims=True`; treat `(n,)` and `(n,1)` as different types, and never treat shape as 'well, it will compute'.",
        "NaN and reproducibility: decide the policy before aggregating (nanmean, or an indicator column first); route all randomness through one explicit `rng = np.random.default_rng(seed)` and print the seed together with a fingerprint of the data.",
        "Retrospective of this chapter's five classic failures: integers wrapping negative, an object dtype collapsing throughput back to loop speed, a fancy-index write that changes nothing, broadcasting silently stretching (n,) into (n,n), and one NaN turning a whole aggregate table into NaN. Each is one print away from being confirmed — do not re-derive them next time.",
        "Bridge to sp2: real data is not a tidy square matrix but a table with column names, missing values and indexes that may not line up; pandas replaces 'shape alignment' with 'label alignment', which is where a different family of silent errors lives."
      ],
      code: `import numpy as np

data = np.random.default_rng(7).normal(size=20000)
w = 5
# 第一步：循环版先保证「对」，它是后面所有对比的参照物
loop = np.empty(data.size - w + 1)
for i in range(loop.size):
    loop[i] = data[i:i + w].mean()
# 第二步：向量版用前缀和做同一件事，只扫一遍内存
c = np.concatenate(([0.0], np.cumsum(data, dtype=np.float64)))
vec = (c[w:] - c[:-w]) / w
# 第三步：形状与 dtype 先打印出来，再谈等价
print(vec.shape, vec.dtype)
# 第四步：等价性用 allclose，别用 ==，浮点相加顺序不同就有末位差
assert vec.shape == loop.shape
np.testing.assert_allclose(vec, loop, rtol=1e-12, atol=1e-12)
# 收口自查：这条向量化有没有偷偷多出内存
print("temps:", vec.nbytes / data.nbytes)
print("done", float(vec[0]), float(loop[0]))`,
      pit: "重写时只测「快了多少」不测「还相不相等」：向量化版本为了对齐形状多用了 `-1`、`keepdims` 或浮点常数，结果差了一个元素或一位小数，跑起来照样快——性能测试全绿，下游模型却一直在吃错数据。任何向量重写都必须带一条 assert_allclose，而且要拿非零长度、包含负数与 NaN 的输入去跑。",
      pit_en: "Benchmarking only the speed of a rewrite and never its equality: the vectorised version shifts by one element or one decimal while fixing shapes with `-1`, keepdims or float constants, still runs fast, and every performance test passes — while the model downstream eats wrong data. Every vectorising rewrite needs an assert_allclose, run on non-trivial input that contains negatives and NaNs.",
      ex: {
        q: "为什么收口课要求「先写循环版」而不是直接从向量版开始？",
        a: "因为循环版是可执行的规格说明：它慢但语义清楚，是判断向量版对不对的唯一参照；省掉它，向量化里任何一个 off-by-one 或轴搞反都会变成「看起来合理」的长期 bug。",
        q_en: "Why does this synthesis lesson insist on writing the loop version first?",
        a_en: "Because the loop is an executable specification: slow but semantically obvious, and the only reference for whether the vectorised form is right. Skip it and any off-by-one or reversed axis in the vectorised code becomes a long-lived 'looks reasonable' bug."
      }
    }
,

    /* ===================== sp2 Pandas 与可视化 ===================== */
    "sp2-1": {
      min: 13,
      summary: [
        "衔接 sp1：Series 就是「一条 ndarray + 一套标签」，DataFrame 就是「一组共享同一个 index 的 Series」。列与列 dtype 可以不同，但每一列内部仍是 sp1 那种连续数组——除非它是 object 列。",
        "Pandas 与 NumPy 最大的行为分界是「按什么对齐」：NumPy 按位置（形状），Pandas 按标签（index）。两个 index 不同的 Series 相加，会先取标签并集，再对配不上的位置静默填 NaN——不报错、不告警，只给你一列空值。",
        "因此「行数对得上但内容错位」在 Pandas 里根本不会报错：它们只看标签。位置才有意义时用 `to_numpy()` 或先 `reset_index(drop=True)`，两套对齐规则不要在同一个表达式里混着使。",
        "筛选后的 index 会保留原标签（`df[df.a>2]` 出来的 index 是 1、4、7…），这不是脏东西：它就是「这一行原来是谁」。随手 `reset_index(drop=True)` 会打断与另一张表的对齐，也丢掉追溯能力。",
        "取列有两种写法但只有一种安全：`df[\"min\"]` 永远给你那一列，而 `df.min` 会先撞上 DataFrame 的同名方法（min/size/T/max/index 都是雷区），拿到的是函数不是数据。列名一律用中括号取。",
        "一列里混进装不进同一 dtype 的值（数字混字符串、混 None、混 list）就退化成 object：运算全部回到 Python 层的逐元素调用，比 ndarray 慢两个数量级，而且很多聚合函数直接报错。读入时就用 `dtype=` 定死。",
        "缺失有三种长相且行为不同：`np.nan`（浮点专属）、`None`（object 列）、`pd.NA`（可空整型等扩展 dtype）。共同点是都不能用 `==` 判：`np.nan != np.nan` 恒成立，判缺失只能 `isna()`／`notna()`。",
        "把 DataFrame 当成「有标签的字典 + 行索引」而不是 Excel：单元格没有公式、行列都有名字、任何跨表操作都是一次连接。带着这个模型去读后面的 groupby 与 merge，会省掉一大半困惑。"
      ],
      summary_en: [
        "Continuing from sp1: a Series is 'one ndarray plus a set of labels', and a DataFrame is 'a group of Series sharing one index'. Columns may have different dtypes, but inside a column it is still the contiguous sp1 layout — unless that column is object dtype.",
        "The behavioural fault line between pandas and NumPy is what they align on: positions (shape) versus labels (index). Adding two Series with different indexes first takes the union of labels and then silently fills NaN wherever nothing matches — no error, no warning, just a column of holes.",
        "So 'right number of rows, wrong pairing' never raises in pandas: it only looks at labels. When position is what you meant, use `to_numpy()` or `reset_index(drop=True)` first, and never mix the two alignment rules inside one expression.",
        "Filtering keeps the original labels (`df[df.a>2]` still carries index 1, 4, 7...). That is not dirt — it is 'which row was this'. Reaching for `reset_index(drop=True)` breaks alignment with other tables and destroys traceability.",
        "Two ways to grab a column, only one of them safe: `df[\"min\"]` always gives the column, while `df.min` hits DataFrame's own method of that name first (min/size/T/max/index are landmines) and hands you a function instead of data. Take columns with brackets, always.",
        "A column that cannot share one dtype (numbers with strings, with None, with lists) degrades to object: every operation falls back to per-element Python calls, two orders of magnitude slower than an ndarray, and many aggregations simply fail. Pin it with `dtype=` at read time.",
        "Missingness has three appearances with different behaviour: `np.nan` (floats only), `None` (object columns), `pd.NA` (nullable extension dtypes such as Int64). None of them can be tested with `==`, because `np.nan != np.nan` holds always; use `isna()` / `notna()`.",
        "Treat a DataFrame as 'a dict of Series with a row index', not as a spreadsheet: cells hold no formulas, both axes have names, and every cross-table operation is a join. Read groupby and merge with that model and most of the confusion disappears."
      ],
      code: `import numpy as np
import pandas as pd

sales = pd.Series([10.0, 20.0, 30.0], index=["bj", "sh", "gz"])
cost = pd.Series([5.0, 6.0, 7.0], index=["sh", "gz", "cd"])
# 相加先按标签对齐，配不上的位置静默补 NaN：这是 Pandas 与 NumPy 的分水岭
print((sales - cost).to_dict())
# 确实要按位置配对时，先把标签拿掉，两边同时拿掉
fixed = sales.reset_index(drop=True) - cost.reset_index(drop=True)
print(fixed.tolist())
df = pd.DataFrame({"math": [90, 80], "class": ["A", "B"], "min": [60, 70]})
# 列名撞上 DataFrame 自带的属性时，点号写法拿到的是方法而不是数据
print(df["min"].tolist(), callable(df.min))
# 一列里混进字符串就退化成 object，向量化当场失效
dirty = pd.Series([1, 2, "3"])
print(dirty.dtype)
# 判缺失只能用 isna：NaN 不等于自己，用 == 判永远是 False
one = pd.Series([np.nan])
print(one.eq(np.nan).tolist(), one.isna().tolist())
# 筛选后 index 保留原标签，这不是脏数据，是「这一行原来是谁」
print(df.loc[df["math"] > 85].index.tolist())`,
      pit: "把 `reset_index(drop=True)` 当成「清理没用的索引」的例行动作：一旦两张表曾经按标签配对，你抹掉其中一张的标签，它们就从按名字对齐退化成按第几行对齐——列顺序一变，结果整个错位，而且 pandas 不会有任何意见。只有在你确认「位置就是语义」的时候才 drop。",
      pit_en: "Treating `reset_index(drop=True)` as routine index tidying: the moment two tables were meant to pair by label, erasing one table's labels downgrades alignment from 'by name' to 'by row number' — shuffle the row order and everything pairs with the wrong partner, silently. Only drop when you are sure position is the semantics.",
      ex: {
        q: "为什么两个长度相同、内容正确的 Series 相减，结果里全是 NaN？",
        a: "因为 Pandas 按 index 标签配对而不是按位置，长度相同但标签集合不相交时，每个位置都「配不上」，于是全部被填成缺失值；改成 `.to_numpy()` 或先对齐 index 才是你想要的减法。",
        q_en: "Why does subtracting two Series of the same length with correct contents give all NaN?",
        a_en: "Because pandas pairs by index label, not by position: equal lengths with disjoint labels means nothing matches, so every slot becomes missing. Use `.to_numpy()`, or align the indexes first, to get the subtraction you meant."
      }
    },

    "sp2-2": {
      min: 15,
      summary: [
        "`read_csv` 的四件必须显式说的事情：`dtype`（保护 ID/邮编的前导零）、`parse_dates`（不然日期是一串字符串，不能做时间运算）、`encoding`／`encoding_errors`、`na_values`（业务里「-」「NULL」「#N/A」都代表缺失但默认不认识）。先 `nrows=2000` 试读一次，看清 dtype 与缺失再定契约。",
        "编码问题有两副面孔：GBK 文件按 UTF-8 读会抛 UnicodeDecodeError（可诊断），而 Windows Excel 导出的 CSV 常带 BOM，用 `utf-8` 读会让第一个列名前面挂一个不可见字符（`\"\\ufeffid\"`），于是 `df[\"id\"]` KeyError。用 `utf-8-sig` 更保险。",
        "`to_csv` 默认会把索引多写成一列无名行号，用 `index=False`；写给 Excel 打开的中文文件用 `encoding=\"utf-8-sig\"`，否则对端看到的就是乱码。写出前后各打印一次 `shape`，别让「覆盖写」把上游清掉。",
        "布尔过滤的两个语法雷：条件必须各自加括号 `(df.a > 2) & (df.b < 5)`，因为 `&` 的优先级低于比较运算，不加括号常被解析成链式比较，多数时候抛「truth value of a Series is ambiguous」，偶尔只给你错的行；`and/or/not` 在 Pandas 里几乎永远是错的。",
        "`loc` 按标签、`iloc` 按位置，而两者的切片端点规则不一样：`loc[\"a\":\"c\"]` 含头含尾，`iloc[0:3]` 含头不含尾。这是全 Pandas 最稳定的静默差一错误来源，写复合切片时先在脑子里跑一遍。",
        "`SettingWithCopyWarning` 的真正成因不是「你在改副本」这么笼统：`df[df.a>2][\"b\"] = 0` 里第一个中括号产生的中间对象可能是视图也可能是副本，取决于内存布局与优化，pandas 无法保证第二步的写入能落到原件。正解是把行列一次写完：`df.loc[df.a>2, \"b\"] = 0`。",
        "复制语义（copy-on-write）打开后（pandas 2.x 可选、3.0 起默认）这条警告会消失——但那种链式写法依然什么都改不到。「警告没了」不等于「代码对了」，别把语义变更当成免错金牌。",
        "大表进内存前先做三件事：`usecols` 只读需要的列、把低基数字符串列转 `category`（内存与 groupby 都受益）、用 `memory_usage(deep=True).sum()` 看谁在吃内存；真的大到放不下就用 `chunksize` 迭代聚合，而不是指望 Pandas 变魔术。"
      ],
      summary_en: [
        "Four things read_csv needs you to say explicitly: `dtype` (protects leading zeros in ids and postcodes), `parse_dates` (otherwise a date is just a string and cannot do time arithmetic), `encoding`/`encoding_errors`, and `na_values` (business files use '-', 'NULL', '#N/A' for missing and the defaults do not know them). Trial-read with `nrows=2000`, inspect dtypes and missingness, then fix the contract.",
        "Encoding has two faces: reading a GBK file as UTF-8 raises UnicodeDecodeError, which is at least diagnosable, while Excel-on-Windows CSVs usually carry a BOM, so `utf-8` leaves an invisible character glued to the first column name ('\\ufeffid') and `df[\"id\"]` raises KeyError. `utf-8-sig` is the safer default.",
        "`to_csv` writes the index as an extra nameless column unless you pass `index=False`; files destined for Excel with Chinese text need `encoding=\"utf-8-sig\"` or the recipient sees mojibake. Print `shape` before and after so an overwrite cannot silently gut the upstream file.",
        "Two syntax mines in boolean filtering: each condition needs its own parentheses, `(df.a > 2) & (df.b < 5)`, because `&` binds looser than comparison — without them Python often forms a chained comparison, which usually raises 'truth value of a Series is ambiguous' and occasionally just returns the wrong rows. and/or/not are almost always wrong in pandas.",
        "`loc` is label-based, `iloc` position-based, and their slicing endpoints differ: `loc[\"a\":\"c\"]` includes both ends while `iloc[0:3]` excludes the last. This is the steadiest source of silent off-by-one errors in the whole library, so rehearse it before writing a compound slice.",
        "The real cause of SettingWithCopyWarning is narrower than 'you mutated a copy': in `df[df.a>2][\"b\"] = 0` the object produced by the first bracket may be a view or a copy depending on memory layout and optimisations, so pandas cannot promise the second write reaches the original. The fix is one statement covering rows and columns: `df.loc[df.a>2, \"b\"] = 0`.",
        "With copy-on-write enabled (opt-in in pandas 2.x, default from 3.0) that warning disappears — but the chained assignment still changes nothing. 'The warning is gone' is not 'the code is right'; do not read a semantics change as a free pass.",
        "Before a big table hits memory, do three things: `usecols` to read only what you need, cast low-cardinality strings to `category` (both memory and groupby benefit), and check `memory_usage(deep=True).sum()` to see who is eating the heap. If it genuinely does not fit, aggregate with `chunksize` instead of hoping pandas performs magic."
      ],
      code: `import io
import pandas as pd

csv_text = "id,math,city\\n007,90,A\\n008,,B\\n009,85,C\\n"
# 试读先看 dtype 与缺失：ID 列必须显式指定 str，否则前导零被吃掉
peek = pd.read_csv(io.StringIO(csv_text))
print(peek["id"].tolist())
df = pd.read_csv(io.StringIO(csv_text), dtype={"id": str}, na_values=[""])
print(df["id"].tolist(), df.shape)
# 一次 .loc 同时定位行条件与列，不要写成 df[df.math>86]["math"] = 0
df.loc[df["math"] > 86, "math"] = 86
print(df["math"].tolist())
# 布尔条件各自加括号：& 的优先级低于比较运算
mask = (df["math"] >= 86) & (df["city"] == "B")
print(df.loc[mask, "id"].tolist())
# loc 含头含尾、iloc 含头不含尾：这是最稳定的差一错误来源
print(df.loc[0:1, "id"].tolist(), df.iloc[0:1]["id"].tolist())
# 行数账本：每一步都留下 shape 与缺失数，才对得上谁被丢了
print(df.shape, df.isna().sum().to_dict())
# 低基数列转 category，内存与分组都受益
print(df["city"].astype("category").dtype)`,
      pit: "只写了 `encoding=\"utf-8\"` 就以为读对了：文件其实编码没错，但缺失值用 `-` 或 `NULL` 表示，默认解析器把它们当字符串，于是整列退化成 object、均值算不出来、模型侧报「could not convert string to float」。读到数值列先跑一句 `pd.to_numeric(col, errors=\"coerce\").isna().sum()`，看被强制成缺失的到底有几条。",
      pit_en: "Believing the file is fine because you typed encoding='utf-8': the encoding was never the problem — missing values were written as '-' or 'NULL', the default parser kept them as strings, so the column stayed object, the mean came back wrong and the model side said 'could not convert string to float'. For every numeric column, immediately run pd.to_numeric(col, errors='coerce').isna().sum() and see how many rows were coerced away.",
      ex: {
        q: "为什么同样的 `df[df.a>2][\"b\"] = 0` 有时真的能改掉原表，却仍然是错的写法？",
        a: "因为第一个中括号返回视图还是副本取决于内存布局与 pandas 的优化路径，能改掉只是碰巧走成了视图；依赖未定义行为的代码在升级、换 dtype、换数据规模的那一天就会静默失效。",
        q_en: "Why is `df[df.a>2][\"b\"] = 0` sometimes actually effective on the original table, and still the wrong thing to write?",
        a_en: "Whether the first bracket hands back a view or a copy depends on memory layout and pandas' internal optimisations, so 'it worked' just means it happened to be a view this time. Code that relies on undefined behaviour goes quiet the day you upgrade, change a dtype or change the data size."
      }
    },

    "sp2-3": {
      min: 14,
      summary: [
        "groupby 只做三件事（split-apply-combine）：按键把行分到各组、对每组独立跑同一个函数、把结果按「组的键」拼回来。理解成「按标签重新分箱后各自计算再对齐回去」，后面的 transform 与 merge 就都不神秘。",
        "`as_index=True`（默认）把分组键变成结果的索引，`as_index=False` 或事后 `reset_index()` 才让它回到普通列。两种写法的数值一模一样、形状不一样，而形状决定了你能不能直接和原表拼接——这一层选错，就变成一次莫名的 NaN 对齐事故。",
        "agg 是「每组压成一行」，transform 是「把每组的结果广播回原来每一行」（返回长度与原表相同、按 index 对齐），filter 是「按组条件决定整组要不要留」。算组内占比、组内去均值（组内标准化）必须用 transform，用 agg 会得到对不上的短表。",
        "键里含 NaN 的行默认被整组丢掉（`dropna=True`），这是「分组后行数变少」的头号原因；`df.groupby(k).size().sum() != len(df)` 就是它。想知道有多少行被丢，用 `dropna=False` 再对比。",
        "类别列当分组键时默认 `observed=False`，会为「所有可能的类别组合」都造一行，多键组合下笛卡尔积会瞬间造出大量空组（全是 NaN 或 0）；只要实际出现过的组就传 `observed=True`。这是「表突然变大」的经典成因。",
        "多键写列表 `groupby([\"class\", \"subject\"])`；只有一根键但写成列表 `groupby([\"class\"])` 会得到列是列表的 DataFrame 结果，比 `groupby(\"class\")` 多一层——下游 `g.mean()[\"score\"]` 的写法就得跟着改。",
        "聚合函数选错等于换指标：`mean` 对少数派不敏感、`median` 抗离群、`count/size/nunique` 各不相同（size 数行、count 数非缺失、nunique 数去重值）；`agg` 里用命名聚合 `avg=(\"score\",\"mean\")` 一次性算多个并顺手起好列名。",
        "分组聚合是数据泄漏的常见入口：一旦你用「全量数据的组均值」当特征（比如按用户 ID 求平均消费），测试集的信息就被提前用掉了。正确做法是只在训练集上 groupby，把结果当映射贴回测试集，并保留时间切分的纪律（ml1 会正面展开）。"
      ],
      summary_en: [
        "groupby performs exactly three acts (split-apply-combine): partition rows into groups by the key, run the same function on each group independently, then stitch results back keyed by the group label. Read it as 're-bucket, compute per bucket, align back' and transform and merge stop being mysterious.",
        "`as_index=True` (the default) turns the grouping keys into the result's index; `as_index=False` or a later `reset_index()` puts them back as ordinary columns. The numbers are identical, the shapes differ — and the shape decides whether you can join straight onto the original table. Choose wrong there and you get a mystery NaN alignment.",
        "agg collapses each group to one row; transform broadcasts each group's answer back onto its original rows (same length as the input, aligned by index); filter decides whole groups in or out. Within-group shares and within-group demeaning (group-wise standardisation) require transform — with agg you get a short table that no longer lines up.",
        "Rows whose key is NaN are dropped as a group by default (`dropna=True`), the leading cause of 'where did my rows go'. `df.groupby(k).size().sum() != len(df)` is that effect; re-run with `dropna=False` to count what was discarded.",
        "With a categorical key, `observed=False` is the default, so one row is produced for every possible combination of categories — under multiple keys the Cartesian product suddenly fills your table with empty groups. Pass `observed=True` to keep only combinations that actually occur. That is the classic 'my table got bigger for no reason'.",
        "Several keys are a list: `groupby([\"class\", \"subject\"])`. A single key also written as a list, `groupby([\"class\"])`, returns a DataFrame whose columns are that list — one level deeper than `groupby(\"class\")`, so downstream `g.mean()[\"score\"]` has to change too.",
        "Picking the wrong aggregation is picking the wrong metric: mean is blind to minorities, median resists outliers, and size/count/nunique are three different questions (rows / non-missing values / distinct values). Named aggregation, `avg=(\"score\",\"mean\")`, computes several at once and names the columns for you.",
        "Group aggregation is a common entry point for data leakage: as soon as a feature is 'the group mean over the whole dataset' (say average spend per user id), information from the test set has already been consumed. Groupby on the training set only, paste the result back onto the test set as a mapping, and keep the time-split discipline — ml1 opens this up."
      ],
      code: `import pandas as pd

df = pd.DataFrame({
    "class": ["A", "A", "B", "B", None],
    "subject": ["math", "eng", "math", "eng", "math"],
    "score": [90.0, 70.0, 60.0, 80.0, 50.0],
})
# agg 把每组压成一行；as_index=False 让分组键留在普通列里，方便后面拼接
g = df.groupby("class", as_index=False).agg(avg=("score", "mean"), n=("score", "size"))
print(g)
# transform 把每组的结果广播回每一行，长度不变：组内占比就靠它
df["share"] = df["score"] / df.groupby("class")["score"].transform("sum")
# 键里的 NaN 默认整行被丢：分组后的行数和原表对不上就是这里
print(len(df), df.groupby("class").size().sum(), df.groupby("class", dropna=False).size().sum())
# filter 决定整组留不留，agg 只压行，两者不能互相替代
print(df.groupby("class", dropna=False).filter(lambda t: len(t) > 1)["class"].tolist())
# size 数行、count 数非缺失、nunique 数去重值：三个不同的问题
print(df.groupby("class").agg(rows=("score", "size"), vals=("score", "count"), kinds=("subject", "nunique")))
# 分组后想接着排序取名次：rank 也是 transform 家族的形状
df["rank_in_class"] = df.groupby("class")["score"].rank(ascending=False)
print(df[["class", "score", "share", "rank_in_class"]])`,
      pit: "只看 groupby 结果的数值、不看它是索引还是列：`g = df.groupby(\"class\").mean()` 的 index 是 class，而原表 df 的 index 是学生行号，直接 `df[\"avg\"] = g[\"score\"]` 会按 index 对齐、整列变成 NaN（或错位复制）。写回原表要么 `transform`，要么 `merge`，要么先 `set_index(\"class\")`，三选一但必须显式。",
      pit_en: "Reading a groupby result for its numbers while ignoring whether the key is an index or a column: `g = df.groupby(\"class\").mean()` is indexed by class while df is indexed by student row, so `df[\"avg\"] = g[\"score\"]` aligns on index and yields a column of NaN (or a shifted copy). Writing back needs transform, or an explicit merge, or set_index(\"class\") first — pick one, but say it out loud.",
      ex: {
        q: "同样一句「按班级求平均分」，为什么 `groupby(...).mean()` 不能直接赋值回原表，`transform(\"mean\")` 就可以？",
        a: "因为前者每个班只产出一行、索引变成了班级，与原表的行索引对不上；后者把组内的均值广播回该组的每一行，返回与原表完全相同的 index，所以按标签对齐天然成立。",
        q_en: "For the same 'average score per class', why can't `groupby(...).mean()` be assigned straight back to the original table while `transform(\"mean\")` can?",
        a_en: "The former emits one row per class and re-indexes by class, which no longer matches the original row index; the latter broadcasts each group mean back onto every row of that group and returns the original index unchanged, so label alignment holds automatically."
      }
    },

    "sp2-4": {
      min: 15,
      summary: [
        "清洗的第一步不是填值，而是记账：`isna().mean().sort_values(ascending=False)` 出一张缺失率表，配合每列影响的行数与「整行缺多少个字段」的分布。没有这张表，任何策略都是撞运气。",
        "先问「为什么缺」再决定怎么填，因为缺失机制分三种：完全随机（仪器抖一下，填什么都不引入系统偏差）、与别的观测变量相关（新设备更容易丢读数，可以按设备分组填）、与缺失值本身相关（高收入者不填收入）——第三种下任何填充都是在造假，只能保留缺失信息并把它写进结论。",
        "`fillna(0)` 最危险之处在于 0 是有含义的数：它把「不知道」变成「确实没有」，均值、占比、相关系数全被系统性拉低。同理 `fillna(均值)` 会压低方差、抹掉与缺失相关的那部分相关性，还会把缺失伪装成正常样本让下游再也看不出问题。",
        "指示列是最便宜也最常被跳过的一步：`df[\"age_missing\"] = df[\"age\"].isna()`。缺失本身常常就是特征（新客户没有历史、老年机上报不了字段），树模型能直接用它；没有指示列，你就把这条信息永久销毁了。",
        "看缺失的行内分布再决定删还是留：`df.isna().sum(axis=1).value_counts()` 告诉你是「每行缺一次」（可以插值/填中位数）还是「某些行整段空白」（多半是管线 bug 或半条记录，删之前先回源确认）。删行的代价要用「少了多少有效样本、剩余样本还有没有代表性」来算。",
        "异常值分两种：录错的（年龄 200、日期 1970、金额 -1）要按规则修或删，真实的极端值（一个大客户占了 80% 流水）是信息，删掉它等于把问题答成另一个。用分位数或 MAD 找候选，逐条回源判断，别一把梭 clip。",
        "`astype` 是丢数据的静默通道：`astype(int)` 向零截断（0.9 变 0、-0.9 变 0）、超范围时回绕；`astype(str)` 把 NaN 变成字符串 \"nan\"，从此 `isna()` 永远返回 False，缺失被彻底藏起来；转 `category` 会引入自己的序与编码。每次 astype 前后各打一次 `isna().sum()`。",
        "清洗必须是能重跑的代码而不是手点：写成一条链式管道，每一步后面跟一句 assert（行数、列数、缺失数、取值范围），把「预期」写进代码里。任何在编辑器里做的修改，三个月后重新读那份数据时都不存在了。"
      ],
      summary_en: [
        "The first cleaning step is not filling values but keeping accounts: emit a missingness table with `isna().mean().sort_values(ascending=False)`, plus rows affected per column and the distribution of 'how many fields are blank in this row'. Without that table every policy is guesswork.",
        "Ask why it is missing before deciding how to fill, because mechanisms differ: missing completely at random (a sensor hiccup — filling is harmless), missing conditional on other observed fields (newer devices drop readings more often — fill per device), and missing related to the value itself (high earners skip the income box) — under that last one any fill is fabrication, so preserve the missingness as information and say so in the conclusion.",
        "`fillna(0)` is dangerous precisely because 0 carries meaning: it turns 'unknown' into 'genuinely none', and pulls means, shares and correlations systematically downward. Likewise `fillna(mean)` shrinks variance, erases the correlation between missingness and other fields, and disguises holes as ordinary rows so nothing downstream can see them.",
        "The indicator column is the cheapest step and the one most often skipped: `df[\"age_missing\"] = df[\"age\"].isna()`. Missingness is frequently the feature (new customers have no history, old handsets fail to report a field) and tree models use it directly; without the flag you destroy that information permanently.",
        "Decide delete-versus-keep from the within-row distribution: `df.isna().sum(axis=1).value_counts()` shows whether each row is missing one field (interpolate or fill the median) or some rows are blank across the board (probably a pipeline bug or a half-written record — confirm at source before deleting). The cost of dropping is measured in usable rows lost and whether the remainder is still representative.",
        "Outliers come in two kinds: entry errors (age 200, date 1970, amount -1) that you repair or delete by rule, and genuine extremes (one whale accounting for 80% of revenue) that are information — deleting them answers a different question. Use quantiles or MAD to find candidates, then check each against the source; do not clip in bulk.",
        "`astype` is a silent data-loss channel: `astype(int)` truncates toward zero (0.9 becomes 0, -0.9 becomes 0) and wraps out of range; `astype(str)` turns NaN into the string \"nan\", after which `isna()` never returns False again and the missingness is fully hidden; casting to category brings its own ordering and codes. Print `isna().sum()` on both sides of every astype.",
        "Cleaning has to be re-runnable code, not manual edits: one chained pipeline with an assert after each step (row count, column count, missing count, value range) so the expectation lives in the file. Anything you did by hand in a spreadsheet is gone the moment someone reloads that data in three months."
      ],
      code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "income": ["12,000", "8000", None, "-"],
    "age": [30.0, 41.0, np.nan, 25.0],
})
# 记账：每列缺多少比例，先于任何填充决策
print((df.isna().mean() * 100).round(1).to_dict())
# 字符串脏值让整列留在 object，用 to_numeric 换它成 NaN，并数清被换掉几条
income = pd.to_numeric(df["income"].str.replace(",", ""), errors="coerce")
print(income.dtype, int(income.isna().sum()))
# 指示列：先把「缺不缺」这件事存成特征，再谈怎么填
df["income_missing"] = income.isna()
# 缺失的行内分布：每行只缺一次可以填，整行空白要回源查
print(df.isna().sum(axis=1).value_counts().to_dict())
# 中位数比均值抗离群，但填之前必须已经决定「缺失本身已记录」
df["income_f"] = income.fillna(income.median())
print(df["income_f"].tolist(), int(df["income_f"].isna().sum()))
# astype(str) 的代价：NaN 变成 \"nan\" 字符串，从此再也查不出缺失
hidden = df["income"].astype(str)
print(hidden.tolist(), int(hidden.isna().sum()))
# 清洗要留下账本：每一步之后 assert 一次，别人重跑时才会发声
assert len(df) == 4 and df["income_f"].isna().sum() == 0
print("clean ok", df.shape)`,
      pit: "把「缺失」当成「0」或当成「平均」之前没看缺失是否与结果变量有关：例如设备越旧越容易丢读数，而你按全量中位数填，等于告诉模型「这台旧设备的读数和中位数一样新」，缺失与故障之间的相关被抹平，模型对老设备的表现永远不会被学到。先看缺失组与非缺失组在别的列上差多少，再决定填充粒度（全量/分组/条件）。",
      pit_en: "Treating missing as 0 or as the mean without checking whether the missingness depends on the outcome: older devices drop readings more often, so filling with the global median tells the model 'this old device reads as fresh as the median', erasing the link between missingness and failure — the model will never learn how old devices behave. Compare the missing and non-missing groups on other columns first, then choose the filling granularity (global / per group / conditional).",
      ex: {
        q: "为什么 `df[\"x\"].fillna(df[\"x\"].mean())` 会让后面的相关系数和方差都偏小？",
        a: "因为填入的值恰好等于均值，对这些行来说离差是 0：方差直接被压低，而 x 与其它列的协方差只在「两边都不缺」的行上有贡献，等于人为削弱了真实关系。",
        q_en: "Why does `df[\"x\"].fillna(df[\"x\"].mean())` make the later variance and correlations too small?",
        a_en: "Because each imputed value equals the mean and contributes zero deviation, so variance shrinks outright, and the covariance with other columns only gets contributions from rows where both are observed — the real relationship is artificially attenuated."
      }
    },

    "sp2-5": {
      min: 14,
      summary: [
        "画图之前先写下这张图要回答的问题，并据此选图型：比较大小用柱、看分布用直方图/箱线、看关系用散点、看趋势用折线、看构成才用堆叠或饼图（饼放最后）。问题没定，图再漂亮也只是装饰，而且往往自证偏见。",
        "两条 API 要分清：`plt.plot(...)` 走的是隐式状态机（画到「当前轴」上），`fig, ax = plt.subplots(...)` 是显式对象。多子图、往已有的轴上叠加、或者把画图写进函数里，只能用后者——否则你会看到图跑到别人的轴上，或者函数返回 None。",
        "柱状图的 y 轴必须从 0 开始：柱长是「长度编码」，起点抬到 60 之后 2% 的差能看起来像 5 倍。折线图可以截断 y 轴（它编码的是变化率而不是长度），但必须在图上写明，并且不要把截断图的斜率拿去和别的图比陡缓。",
        "双 y 轴是一台制造伪相关的机器：两条毫无关系的曲线被同一根横轴暗示成同步，而且两根轴各自缩放，你想让拐点重合就能让它们重合。真要比较不同尺度的量，就归一化到同一根轴，或画成上下两个共享 x 的子图。",
        "数字要带不确定性：把 n、时间窗、误差棒或置信区间画进图里。只有均值的折线会把噪声讲成趋势，样本量差 10 倍的组并排画柱状图也是误导——视觉平等不等于统计可比。",
        "中文标签在 matplotlib 默认字体下会变成方块：需要显式设置 `plt.rcParams[\"font.sans-serif\"]`（Windows 常见 Microsoft YaHei/SimHei，macOS 用 Arial Unicode MS/PingFang）并关掉 `axes.unicode_minus`。这是渲染端配置问题，与数据无关，所以别把它当成「图坏了」。",
        "分箱会造出假象：直方图换 bins 就能把双峰变单峰，所以分布至少看两个 bin 数，或者直接叠加 ECDF／箱线图。同理，`hist` 的密度与计数两种纵轴不要混在一张图里比。",
        "训练监控曲线有固定看法：loss 与 acc 分放上下两个共享 x 的子图；先看是不是数据或学习率的问题（loss 完全不降、剧烈抖动、先降后升），再怀疑模型容量。图的存在意义是让你 10 秒内看出「这次跑的不正常」，不是好看。"
      ],
      summary_en: [
        "Write down the question the figure must answer, then pick the chart type for it: bars to compare, histogram or box plot for distribution, scatter for relationship, line for trend, stacked or pie for composition (pie last). Without a question the figure is decoration, and frequently confirmation bias with a legend.",
        "Keep the two APIs apart: `plt.plot(...)` drives an implicit state machine that draws on 'the current axes', while `fig, ax = plt.subplots(...)` gives explicit objects. Multiple subplots, overlaying onto an existing axes, or drawing inside a function require the latter — otherwise your lines land on someone else's axes and your function returns None.",
        "A bar chart's y axis must start at 0: bar length is a length encoding, and lifting the baseline to 60 makes a 2% gap look like 5x. A line chart may truncate its y axis (it encodes rate of change, not length) but the truncation has to be labelled, and its slope must not be compared against another chart's.",
        "Dual y axes are a correlation-manufacturing machine: two unrelated series are implied to move together by the shared x axis, and because each axis scales independently you can align their kinks deliberately. To compare quantities of different scale, normalise onto one axis or stack two subplots sharing x.",
        "Put uncertainty on the figure: n, the time window, error bars or confidence bands. A line of means turns noise into trend, and bars side by side for groups whose sample sizes differ 10-fold are equally misleading — visual equality is not statistical comparability.",
        "Chinese labels render as empty boxes under matplotlib's default font: set `plt.rcParams[\"font.sans-serif\"]` explicitly (Microsoft YaHei or SimHei on Windows, Arial Unicode MS or PingFang on macOS) and switch off `axes.unicode_minus`. That is a rendering configuration issue, not a data problem, so do not call the figure broken.",
        "Binning invents structure: changing bins turns a bimodal histogram unimodal, so look at a distribution under at least two bin widths, or overlay an ECDF or box plot. Likewise do not compare a density axis against a count axis inside one figure.",
        "Training curves have a fixed reading protocol: loss and accuracy in two stacked subplots sharing x; suspect the data or the learning rate (loss flat, violently jittery, or falling then rising) before suspecting model capacity. The point of the plot is to see 'this run is wrong' in ten seconds, not to look nice."
      ],
      code: `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

# 中文标题要显式指定本机字体，否则显示成方块：这是渲染端问题不是数据问题
plt.rcParams["font.sans-serif"] = ["Microsoft YaHei", "SimHei", "Arial Unicode MS"]
plt.rcParams["axes.unicode_minus"] = False
rng = np.random.default_rng(1)
loss = np.exp(-np.linspace(0, 4, 60)) + rng.normal(0, 0.02, 60)
acc = np.clip(0.4 + 0.55 * np.linspace(0, 1, 60), 0, 1)
# 尺度不同的两条曲线：上下两个共享 x 的子图，而不是左右各一根 y 轴
fig, axes = plt.subplots(2, 1, figsize=(6, 5), sharex=True)
axes[0].plot(loss, color="tab:blue")
axes[0].set_ylabel("loss")
axes[0].set_title("训练曲线（n=60 个 epoch，seed=1）")
axes[1].plot(acc, color="tab:orange")
axes[1].set_ylabel("accuracy")
axes[1].set_xlabel("epoch")
fig.tight_layout()
fig.savefig("curves.png", dpi=110)
# 柱状图从 0 开始：截断基线会让 1.5 个百分点的差看起来像 5 倍
rates = [0.615, 0.630, 0.624]
fig2, ax2 = plt.subplots(figsize=(4, 3))
ax2.bar(["A", "B", "C"], rates)
ax2.set_ylim(0, 0.8)
# 标题写结论而不是写栏目名，读者先读标题再读图
ax2.set_title("B 组转化率高 1.5 个百分点")
fig2.savefig("bars.png", dpi=110)
plt.close("all")
print("saved two figures", loss.size)`,
      pit: "把两条尺度完全不同的指标画在同一根 y 轴上「省事」，或者画成双 y 轴「好看」：前者的第二条曲线会被压成一条贴底的直线，后者的两条线想让它俩同步就能同步。真实做法是共享 x 的两个子图、或者各除以自身起点变成百分比后再同轴比较，并在标题里写清口径。",
      pit_en: "Squeezing two metrics of very different scale onto one y axis 'to save a panel', or splitting them across dual axes 'because it looks better': in the first case the second series flattens into a line stuck to the floor, in the second you can force the two curves to move together by rescaling. Use two subplots sharing x, or normalise both to their own start and compare on one axis — and state the convention in the title.",
      ex: {
        q: "为什么折线图可以截断 y 轴，柱状图却几乎不可以？",
        a: "因为折线图的视觉编码是「点的位置与变化趋势」，截断只改变基线不改相对变化；柱状图用长度编码大小，起点抬高会让比例失真，读者按长度比出的倍数和真实倍数完全不同。",
        q_en: "Why may a line chart truncate its y axis while a bar chart essentially may not?",
        a_en: "A line chart encodes positions and change, so moving the baseline leaves the relative change intact; a bar chart encodes magnitude as length, so lifting the start distorts ratios and the multiple a reader eyeballs has nothing to do with the true one."
      }
    },

    "sp2-6": {
      title: "综合重构：从脏表到可信结论的流水线",
      title_en: "Synthesis: A Pipeline from Dirty Table to Trusted Conclusion",
      min: 15,
      target: "能把读入、清洗、分组、连接、画图串成一条可重跑的 pandas 管道，并在每一步留下行数、缺失数与口径的账本；能说出五种典型静默错误各在哪一步被拦住。",
      target_en: "Chain loading, cleaning, grouping, joining and plotting into one re-runnable pandas pipeline, leaving an account of row counts, missingness and metric definitions at every step; and say which step catches each of the five classic silent errors.",
      summary: [
        "本章前置是 sp1（Series 底层就是 ndarray，广播与 dtype 的脾气一路带过来）；到这一节你已经把散点操作连成了一条线，它的价值在下一步——把它住进可重跑的工作区。",
        "固定顺序背下来：读入即定契约（dtype/parse_dates/na_values）→ 行数与缺失账本 → 缺失机制判断与指示列 → 分组聚合回答每个子问题 → 连接前验证键的唯一性 → 每张图先答题 → 结论三句话带口径。顺序颠倒就是自找 bug。",
        "merge 的四种连接要按「哪边允许丢行」来选：inner 只留两边都有的、left 保住左表全部（右表配不上就是 NaN）、outer 两边都不丢（行数会变大）、cross 是笛卡尔积（只用于穷举，且必须先算得起来）。想知道「丢了多少、为什么丢」，加 `indicator=True` 再数 `_merge` 三种取值。",
        "行数爆炸的唯一防线是连接前验证：`df.key.is_unique`、以及把意图写进 `validate=\"one_to_one\"/\"one_to_many\"/\"many_to_one\"`，不满足时 Pandas 直接抛 MergeError 而不是安静地把表放大十倍。多对多是合法操作，但必须是你有意为之。",
        "五类静默错误复盘（本章专属）：标签对不齐产生 NaN / 链式索引写入丢失 / 连接键重复导致行爆炸 / astype 把数据或缺失藏起来 / 截断坐标轴夸大差异。它们的共同点是「没有任何异常」，所以只能靠 assert 与账本来拦。",
        "把预期写成断言而不是注释：`assert len(m) == len(left)`、`assert df[\"y\"].notna().all()`、`assert (df[\"age\"] >= 0).all()`。断言是会在别人重跑时代你说话的注释。",
        "口径必须随数字一起流动：每个指标写成「怎么算的 + 在哪些行上算的 + 缺失怎么处理」，否则同一个词在两张表里是两个意思，汇报时才发现两套数字打不起来。",
        "衔接 sp3：现在这条管道已经值得被反复运行了，下一步把它放进 Jupyter——那里有状态、有执行顺序、有环境，三个新变量会把「可复现」变成一门需要纪律的手艺。"
      ],
      summary_en: [
        "This chapter built on sp1 (a Series is an ndarray underneath, and broadcasting and dtype habits carry all the way through); by this lesson you have joined the scattered operations into one line, which earns the next step: giving it a home in a re-runnable workspace.",
        "Memorise the fixed order: fix the contract on load (dtype/parse_dates/na_values) → account for rows and missingness → judge the missingness mechanism and add indicators → answer each sub-question with groupby → verify key uniqueness before any join → make every figure answer a question → three-sentence conclusion with definitions. Reorder that list and you are manufacturing bugs.",
        "Pick among the four merge kinds by asking which side may lose rows: inner keeps only what both sides have, left preserves every left row (right misses become NaN), outer loses nothing and grows the table, cross is a Cartesian product (only for exhaustive grids you can afford). To see how much was lost and why, pass `indicator=True` and count the three values of `_merge`.",
        "The only defence against row explosion is verifying before joining: `df.key.is_unique`, plus stating the intent as `validate=\"one_to_one\"/\"one_to_many\"/\"many_to_one\"` so pandas raises MergeError instead of quietly making your table ten times bigger. many-to-many is a legal operation, but it has to be deliberate.",
        "Retrospective of this chapter's five silent failures: labels that do not align producing NaN, chained-index writes that go nowhere, duplicate join keys exploding the row count, astype hiding data or missingness, and a truncated axis inflating a difference. They share one property — no exception is ever raised — so only asserts and account-keeping can stop them.",
        "Write expectations as assertions, not comments: `assert len(m) == len(left)`, `assert df[\"y\"].notna().all()`, `assert (df[\"age\"] >= 0).all()`. An assertion is a comment that speaks up when somebody else reruns the code.",
        "Definitions have to travel with the numbers: write every metric as 'how it is computed + over which rows + how missing values were handled', otherwise the same word means two things in two tables and you discover the two sets of numbers cannot be reconciled while presenting.",
        "Bridge to sp3: this pipeline is now worth running repeatedly, so the next step moves it into Jupyter — where state, execution order and environments, three new variables, turn 'reproducible' into a discipline."
      ],
      code: `import io
import pandas as pd

orders = pd.read_csv(io.StringIO("uid,amount,date,channel\\n1,30,2026-01-05,app\\n2,50,2026-01-06,web\\n1,20,2026-01-09,app\\n2,15,2026-02-02,web\\n"),
    dtype={"uid": str, "channel": "category"}, parse_dates=["date"])
users = pd.read_csv(io.StringIO("uid,city\\n1,A\\n2,B\\n3,C\\n"), dtype={"uid": str})
# 连接前先验证唯一性，并把意图写进 validate：多对多会当场报错而不是放大行数
print("users key unique:", users["uid"].is_unique)
m = orders.merge(users, on="uid", how="left", validate="many_to_one", indicator=True)
# 行数账本：左表几行，合并后就该几行，多出来的都是键重复
assert len(m) == len(orders)
print(m["_merge"].value_counts().to_dict(), int(m.isna().sum().sum()))
# 清洗与聚合串成一条可重跑的管道，每步都留下中间结果
by_cell = (m.assign(month=m["date"].dt.strftime("%Y-%m"))
           .groupby(["month", "city"], as_index=False, observed=True)
           .agg(gmv=("amount", "sum"), orders_n=("amount", "size")))
print(by_cell)
# 口径与结论一起打印：数字离开定义就没有意义
best = by_cell.loc[by_cell["gmv"].idxmax()]
print("answer:", best["month"], best["city"], best["gmv"], "n =", len(m))
# 导出给下一环使用：写盘时把索引关掉，别给自己制造一列无名行号
by_cell.to_csv("by_cell.csv", index=False)
print("written", by_cell.shape)`,
      pit: "合并时只验证了主表的键唯一，忘了看被连接那张表：右表的 uid 有重复（同一个人有两条地址记录），left join 之后主表每一行都被复制成几份，指标随之翻倍，但数值看着仍然「合理」。合并前后各打印一次 `len()` 与 `df[key].is_unique`，并用 `validate=` 把关系写死。",
      pit_en: "Checking uniqueness only on the driving table and forgetting the one you join onto: the right table has repeated uids (two address rows per person), so after the left join every driving row is duplicated, every metric doubles — and the numbers still look plausible. Print len() and df[key].is_unique on both sides of every join, and pin the relationship with validate=.",
      ex: {
        q: "为什么「先验证键唯一再 merge」比「merge 完再看行数对不对」更可靠？",
        a: "因为行爆炸之后再修就要回答「哪几行是复制出来的」，而复制行在数值上和原行无法区分；把检查前移成契约（validate 参数）能让错误以异常形式出现在发生的那一刻，而不是三张表之后。",
        q_en: "Why is 'verify key uniqueness before merging' more reliable than 'check the row count afterwards'?",
        a_en: "Once rows have exploded you must answer 'which duplicates came from the join', and a duplicated row is numerically indistinguishable from its twin. Moving the check forward turns it into a contract, so the failure surfaces as an exception at the moment it happens instead of three tables later."
      }
    }
,

    /* ===================== sp3 Jupyter 数据项目 ===================== */
    "sp3-1": {
      min: 13,
      summary: [
        "衔接 sp1/sp2：前两章的工具都是「无状态」的——同一段代码在哪跑都该给同一个结果。Notebook 加了第三样东西：代码、输出之外还有一个活着的工作区，而它正是所有麻烦的来源。",
        "kernel 是一个独立的 Python 进程，你的全部变量、已导入的模块、打开的文件句柄都住在它里面；单元格只是把代码文本发过去执行、再把结果收回来。关掉标签页 kernel 往往还活着，换 kernel 则一切归零。",
        "`In [ ]` 与 `In [12]` 是执行序号不是行号：方框为空代表这个 cell 从未运行过。读别人 notebook 的第一个动作就是检查序号是否严格递增、有没有空号——「代码在、结果没有」就是它的样子。",
        "乱序执行毁掉的是可复现性而不是正确性：典型剧本是 `df = pd.concat([df, extra])` 被顺手重跑一次，df 多出 10 行且没有任何提示；或者删掉了定义 cell、后面的 cell 还在用内存里那份旧值，于是结果是三份之前的状态叠出来的。",
        "诊断与清理的手感：`%who`/`%whos` 看还有什么名字活着、`dhist` 列执行历史、`%reset -f` 清命名空间（但它不清 `sys.modules`，已导入的模块仍被缓存）。唯一可信的验收是「重启内核 + 全部重新运行」。",
        "环境是第三层状态：同一个包名在几个虚拟环境里可能是几个不同版本。先 `print(sys.executable)` 确认当前 kernel 用的是哪个解释器，再 `%pip list` 对齐；在 notebook 里装包要写成 `!{sys.executable} -m pip install 包名`，让解释器自己决定装到哪，否则常常装进了另一个环境而这个 kernel 依然找不到。",
        "依赖要锁且要够细：`requirements.txt` 写直接依赖并带上主版本（NumPy 1.x 与 2.x 的标量提升规则不同、pandas 2.x 与 3.0 的复制语义不同，这些都会改变你的数值结果），再附一行 `python -V`。只写包名的清单挡不住传递依赖漂移。",
        "别忘了全局配置的残留：`np.random.seed`、matplotlib 的 `rcParams`、被 monkey-patch 的库函数、以及你在某个 cell 里改过的 pandas 选项，都会在 cell 之间继续生效。所以「这一段单独跑没问题」在 notebook 里的说服力比在脚本里弱得多。"
      ],
      summary_en: [
        "Continuing from sp1/sp2: those tools were stateless — the same code should give the same result wherever it runs. A notebook adds a third thing beyond code and outputs: a live workspace, and that is where all the trouble comes from.",
        "The kernel is a separate Python process holding all your variables, imported modules and open file handles; a cell merely ships its text over for execution and collects the result back. Closing the tab often leaves the kernel alive, while switching kernels resets everything.",
        "`In [ ]` and `In [12]` are execution counters, not line numbers: an empty bracket means that cell never ran. The first thing to do with somebody else's notebook is check that the counters increase strictly and that none are blank — 'code there, result missing' is exactly what that looks like.",
        "Out-of-order execution destroys reproducibility rather than correctness. The standard script: `df = pd.concat([df, extra])` gets rerun once in passing and df silently gains ten rows; or a definition cell is deleted while later cells keep using the stale object still in memory, so the output is a stack of three previous states.",
        "Diagnostic reflexes: `%who`/`%whos` list what names are still alive, `dhist` shows execution history, `%reset -f` clears the namespace (but not `sys.modules`, so imported modules stay cached). The only trustworthy acceptance test is 'restart the kernel and run all'.",
        "The environment is the third layer of state: one package name can mean several versions across virtualenvs. Print `sys.executable` first to see which interpreter this kernel really uses, then reconcile with `%pip list`; installing from a notebook must go through that same executable, otherwise the package lands in a different environment.",
        "Pin dependencies, and pin them finely enough: list direct dependencies with their major versions in requirements.txt (NumPy 1.x vs 2.x differ in scalar promotion, pandas 2.x vs 3.0 differ in copy semantics, and both change your numbers), plus one line of `python -V`. A bare list of package names cannot stop transitive drift.",
        "Do not forget global configuration residue: `np.random.seed`, matplotlib's `rcParams`, monkey-patched library functions and pandas options you toggled in some cell all stay in force between cells. 'This cell runs fine on its own' therefore carries far less weight in a notebook than in a script."
      ],
      code: `import sys
import numpy as np
import pandas as pd

# 第一个 cell：环境、版本与种子先交代清楚，别人重跑才拿得到同一份数据
print(sys.executable, sys.version.split()[0], np.__version__, pd.__version__)
CFG = dict(seed=42, n=2000)
rng = np.random.default_rng(CFG["seed"])
df = pd.DataFrame({"x": rng.normal(size=CFG["n"])})
# 危险动作：这个 cell 每重跑一次就多拼一次，行数悄悄翻倍而且毫不报错
df = pd.concat([df, df.tail(10)], ignore_index=True)
print(len(df), int(df["x"].isna().sum()))
# 谁还活着：%who 只列名字，%whos 连类型与值一起列
# %whos
# 清命名空间，但它不清 sys.modules，已 import 的模块仍然缓存着
# %reset -f
# 环境核对：先看解释器是不是你以为的那一个，再看包版本
# !{sys.executable} -m pip list
# 唯一可信的验收：重启内核、全部重新运行，检查序号严格递增且没有空号
print("cfg", CFG)`,
      pit: "把 `.ipynb` 里存着的输出当成「结果的证据」：文件里保存的是最后一次成功运行的产物，而代码在此之后又被改过、某些 cell 从未重跑。于是你分享出去的东西在别人的机器上算出另一个数，或者干脆跑不起来——因为在你的 kernel 里，正确答案依赖三个已经不存在的 cell。",
      pit_en: "Trusting the stored outputs in a .ipynb as evidence of the result: what the file keeps is the artefact of the last successful run, while the code was edited afterwards and some cells never re-ran. The copy you share produces different numbers on another machine, or does not run at all, because on your kernel the right answer depended on three cells that no longer exist.",
      ex: {
        q: "为什么 `%reset -f` 清干净了变量，改了代码的模块却仍然在用旧逻辑？",
        a: "因为它只清命名空间里的名字，Python 的模块缓存 `sys.modules` 还在，`import` 语句会直接命中缓存而不重新读文件；要让新代码生效得 `importlib.reload`（并重新执行 from-import），或者干脆重启内核。",
        q_en: "After `%reset -f` wiped the variables, why does an edited module still run the old logic?",
        a_en: "It only clears names in the namespace; Python's sys.modules cache survives, so an import statement hits the cache instead of re-reading the file. You need importlib.reload (plus re-running the from-import), or a kernel restart."
      }
    },

    "sp3-2": {
      min: 12,
      summary: [
        "五段结构（问题 / 数据 / 方法 / 结果 / 局限）是 notebook 的骨架：Markdown 单元负责「为什么这样决定」，代码单元负责「怎么做」。读者先靠文字判断可信度，再决定要不要读代码——没有文字说明的 notebook 只有一份执行日志。",
        "魔法命令把 notebook 变成测量台：`%%time` 与 `%timeit` 把「我觉得这段慢」变成可比较的数字，`%who/%whos` 查状态，`%env` 看环境变量，`%debug` 在异常事后取栈，`!命令` 直接调系统。它们是 notebook 相对脚本的真实增量之一。",
        "图的显示是前端行为而不是数据行为：`%matplotlib inline`（新 kernel 默认已开）把图画进单元输出，`plt.show()` 提交当前图，`InlineBackend.figure_format` 控制清晰度；`Agg` 这类无界面后端适合只出文件的批处理，但那时你在 notebook 里就看不到图了。",
        "重复三次的逻辑就该提炼成 `pipeline.py`：可被 import、可被单测、可被别的 notebook 复用、diff 干净。判断标准很硬——同一段代码你复制到第二个 cell 的那一刻，它就已经该是一个函数了。",
        "import 重载是这里最硬的坑：`importlib.reload(P)` 只更新「通过 `P.foo` 访问」的那份函数对象；如果你之前写过 `from pipeline import clean`，名字 `clean` 仍指向旧函数，除非重新执行那行 import。`%load_ext autoreload` + `%autoreload 2` 能自动做这件事，但对 C 扩展与已导入的常量不一定有效。",
        "Markdown 不能替代断言：写「这里应该是 3000 行」不会在数据变化时报警，`assert len(df) == 3000` 会。把预期写成代码，是「实验记录」与「可信报告」的分界线，也是上面那个函数能搬进 .py 的前提。",
        "`.ipynb` 的本体是 JSON：单元输出里夹着 base64 图片，git diff 会淹没在噪声里、合并冲突几乎无解。对策是「代码版清空输出提交、分析版留输出」，或用 jupytext 同时维护一份 `#.py` 的成对格式让评审看得见逻辑。",
        "单元顺序本身就是文档：配置与种子放在最上一个 cell，数据路径集中定义，不允许在中间某个 cell 偷偷改 seed 或覆写全局变量；确实要做两组实验，就复制一份 notebook 并在标题里写清差别。"
      ],
      summary_en: [
        "The five-part skeleton (question / data / method / results / limitations) holds the notebook together: Markdown says 'why this decision', code says 'how'. Readers judge credibility from the prose before deciding whether to read the code, and a notebook without prose is just an execution log.",
        "Magics turn the notebook into a measuring bench: `%%time` and `%timeit` replace 'I think this part is slow' with comparable numbers, `%who/%whos` inspect state, `%env` shows environment variables, `%debug` recovers a traceback after the fact, and `!cmd` reaches the shell. This is one of the genuine gains over a plain script.",
        "Figure display is front-end behaviour, not data behaviour: `%matplotlib inline` (on by default in modern kernels) draws into the cell output, `plt.show()` flushes the current figure, and `InlineBackend.figure_format` controls sharpness. A headless backend like Agg suits batch file generation — but then the notebook shows you nothing.",
        "Logic you have repeated three times belongs in pipeline.py, where it can be imported, unit-tested, reused by another notebook and diffed cleanly. The test is blunt: the moment you paste the same block into a second cell, it should already have been a function.",
        "Import reloading is the hardest trap here: `importlib.reload(P)` refreshes only functions reached as `P.foo`; if you earlier wrote `from pipeline import clean`, the name `clean` still points at the old function object until you re-run that import line. `%load_ext autoreload` plus `%autoreload 2` automates it but does not reliably cover C extensions or already-imported constants.",
        "Markdown is not an assertion: writing 'this should be 3000 rows' raises nothing when the data changes, while `assert len(df) == 3000` does. Turning expectations into code is the line between lab notes and a trustworthy report, and it is also what makes that function portable into a .py.",
        "A .ipynb is JSON underneath, with base64 images embedded in outputs, so git diff drowns in noise and merge conflicts are close to hopeless. Either commit the code-only version with outputs cleared and keep a separate analysed version with outputs, or pair the notebook with a jupytext `#.py` so reviewers can read the logic.",
        "Cell order is documentation in itself: configuration and seeds live in the top cell, data paths are defined once, and no middle cell is allowed to quietly reassign the seed or overwrite globals. Two experiments really do need two notebooks — copy one and write the difference in the title."
      ],
      code: `# pipeline.py：把重复三次的逻辑搬出 notebook，它才能被 import、被单测
import pandas as pd


def clean(df):
    out = df.copy()
    out["amount"] = pd.to_numeric(out["amount"].str.replace(",", ""), errors="coerce")
    # 校验写成代码：别人重跑时它会说话，Markdown 里写「应该正好 3000 行」不会
    assert len(out) == 3000, "row count violates the data contract"
    return out


# 下面是 notebook 里的一个 cell：上面那份逻辑已经住在 pipeline.py 里
import importlib
import pipeline
from pipeline import clean

# 改完 pipeline.py 只 reload：模块属性是新的，本地绑定的 clean 仍是旧函数对象
P = importlib.reload(pipeline)
print(clean is P.clean)
# 重新执行一次 from-import 才拿得到新版，更省事的是让魔法命令自动做
# %load_ext autoreload
# %autoreload 2
raw = pd.DataFrame({"amount": ["1", "2,0", "-", None] * 750})
print(len(P.clean(raw)))`,
      pit: "在 notebook 里定义好函数、就直接以为它「已经是模块的一部分」：别的 notebook 复制粘贴这份定义、脚本里 import 一个并不存在的 `pipeline`、或者线上跑的是三天前那份拷贝。notebook 里定义的代码只活在这一个 kernel 里，跨出这个文件就必须落成 .py 并被版本控制。",
      pit_en: "Defining a function in a notebook and assuming it is now 'part of the module': another notebook copy-pastes the definition, a script imports a pipeline module that does not exist, and production runs the copy from three days ago. Code defined in a notebook lives only in this one kernel; the moment it must cross a file boundary it has to become a tracked .py.",
      ex: {
        q: "为什么把逻辑搬进 `pipeline.py` 之后，notebook 反而更容易出「看不见的 bug」？怎么防？",
        a: "因为模块被缓存在 `sys.modules` 里，你改了 .py 却不一定重新加载，kernel 跑的是旧版本而文件已经是新版本，两边看起来一模一样。防法是 autoreload 扩展、或养成「改完模块就重启内核重跑」的习惯，并在关键函数里打印版本标记。",
        q_en: "After moving logic into pipeline.py, why does the notebook become more prone to invisible bugs, and how do you guard against it?",
        a_en: "Because the module is cached in sys.modules: you edit the .py but the kernel may keep running the old version, so the file and the live process disagree while both look correct. Guard with the autoreload extension, or restart and re-run after editing, and print a version marker from the key function."
      }
    },

    "sp3-3": {
      min: 15,
      summary: [
        "问题要写成可判定的句子：谁、什么时间窗、预测或解释什么、什么指标算过关。「分析一下用户流失」不是问题；「上月活跃用户中，未来 30 天不再登录的是谁，留出集 AUC 要到 0.75」才是——只有后者能决定要哪些数据和怎么切分。",
        "数据契约先落在纸上再动手：字段清单、来源与更新频率、每列允许的缺失率、取值范围与单位。然后跑 `df.info()` 与 `df.describe()` 逐项核对：不符合契约的是 bug，不是「数据一直就这样」。",
        "标准流程是「明确问题 → 取数 → 清洗 → EDA → 基线 → 建模/深入分析 → 结论」，而顺序里最容易被跳掉的两步恰恰是契约核对与基线：跳掉它们的人通常靠反复换模型来掩盖一个数据问题。",
        "先切分再清洗，且切分方式必须匹配数据结构：截面数据用分层随机切（`stratify=y` 保住类别比例），时间序列必须按时间切并留出「特征窗 / 标签窗」的间隙。在全量上算均值、编码、标准化都是泄漏——模型提前看了答案，线下指标好、线上不涨。",
        "基线先行有四重作用：给改进设定门槛、暴露标签是否写反、告诉你类别不平衡有多严重、并且当你的复杂模型只比基线高 0.2 个点时，它就是结论本身。基线好得离谱（例如 0.99）几乎总是泄漏信号而不是好消息。",
        "EDA 是固定动作而不是灵感：一列一行（缺失率、基数、唯一值前几名、分布、不可能的值），一行一图。重点盯三类异常——不可能的值（年龄 200、日期 1970）、重复的行（同主键多份）、时间序列上的断层与跳变，它们解释了你后面一半的建模失败。",
        "参数与种子进代码不进记忆：`CFG = dict(seed=42, holdout=0.25, cutoff=...)` 放在最上一个 cell，所有下游引用它，结论之前 `print(CFG)`。这一行打印能省掉未来一次「我们当时到底用了什么参数」的争论，也让两张表的差别可解释。",
        "版本化三件事并写进结论块：数据（快照日期 + 文件哈希）、参数（CFG 与库版本）、结论（固定格式的输出 + 断言）。三样齐了，别人才可能判断你的结论是稳定的还是一次巧合；缺一样，你的 notebook 就是一个人的私物。"
      ],
      summary_en: [
        "State the question as a decidable sentence: who, over what time window, predicting or explaining what, and which metric counts as passing. 'Analyse churn' is not a question; 'among last month's active users, who will not log in during the next 30 days, reaching AUC 0.75 on the holdout' is — only the latter tells you which data to pull and how to split.",
        "Write the data contract before touching anything: field list, source and refresh cadence, allowed missing rate per column, value ranges and units. Then run `df.info()` and `df.describe()` and check each item: a violation is a bug, not 'the data has always been like this'.",
        "The standard route is question → data → cleaning → EDA → baseline → modelling or deeper analysis → conclusion, and the two steps people skip are exactly the contract check and the baseline. Those who skip them tend to cover a data problem with a string of model swaps.",
        "Split before you clean, and make the split match the structure of the data: cross-sectional tables need a stratified random split (stratify=y preserves class mix), time series must be split in time with a deliberate gap between feature window and label window. Computing means, encodings or scalings on the full data is leakage — the model saw the answer, offline metrics look great and nothing moves online.",
        "A baseline earns its place four times over: it sets the bar your model must beat, exposes reversed labels, quantifies the class imbalance, and if your elaborate model wins by 0.2 points then the baseline is the conclusion. A suspiciously perfect baseline (0.99) is almost always a leakage signal, not good news.",
        "EDA is a fixed routine, not a flash of insight: one line per column (missing rate, cardinality, top values, distribution, impossible values) and one chart per row. Hunt three anomaly classes — impossible values (age 200, date 1970), duplicated rows under the same key, and gaps or jumps along the time axis — because they explain half of your later modelling failures.",
        "Parameters and seeds go into code, not into memory: put `CFG = dict(seed=42, holdout=0.25, cutoff=...)` in the top cell, reference it everywhere downstream, and `print(CFG)` before the conclusion. That single line saves you a future argument about what you actually ran, and makes the difference between two tables explainable.",
        "Version three things and put them in the conclusion block: data (snapshot date plus file hash), parameters (CFG and library versions), conclusions (a fixed-format output with assertions). With all three someone else can tell a stable finding from a lucky draw; without them your notebook is a private object."
      ],
      code: `import hashlib
import numpy as np
import pandas as pd

# 配置与种子放在最上一个 cell：下游全部引用它，而不是各自再写一遍字面量
CFG = dict(seed=42, holdout=0.25, cutoff="2026-02-01")
rng = np.random.default_rng(CFG["seed"])
n = 400
df = pd.DataFrame({
    "tenure": rng.integers(0, 60, n),
    "tickets": rng.integers(0, 8, n),
    "churn": rng.integers(0, 2, n),
})
# 数据指纹：同一份输入才会得到同一个哈希，把它写进结论块当版本
fp = hashlib.md5(pd.util.hash_pandas_object(df).values.tobytes()).hexdigest()[:8]
# 先切分再清洗：时间序列按时间切，随机打乱等于把未来喂给过去
cut = int(n * (1 - CFG["holdout"]))
train, test = df.iloc[:cut].copy(), df.iloc[cut:].copy()
# 泄漏写法（故意留作反例）：在全量上算均值之后再切分
# mu_all = df["tenure"].mean()
mu = train["tenure"].mean()
# 基线：无脑猜「不流失」的准确率，模型必须先跨过它才有资格谈改进
baseline = 1.0 - float(df["churn"].mean())
print("data", fp, "train", len(train), "test", len(test), "baseline", round(baseline, 3), "mu", round(mu, 3))
assert len(train) + len(test) == n
print(CFG)`,
      pit: "为了「让数据更干净」先做一次全局去重和全局标准化，然后再切分训练/测试：这两步都可能把测试集的信息带进训练集（去重保留了哪一条、标准化的均值和方差来自谁）。正确顺序是切分在前，所有统计量只在训练集上拟合，再原样变换到测试集——测试集应当从头到尾只被「看过」一次。",
      pit_en: "Doing a global dedupe and a global scaling first 'to clean the data', and only then splitting train/test: both steps can carry test-set information into training (which duplicate survived, whose mean and variance defined the scaling). Split first, fit every statistic on the training set only, then apply the same transform to the test set — which should be looked at exactly once.",
      ex: {
        q: "为什么「先切分再清洗」在没有模型的纯分析项目里也成立？",
        a: "因为你要回答的是「站在当时能不能得出这个结论」。清洗规则（异常值判定、按分组填的均值、类别编码）只要用到了未来窗口的数据，结论就带了后见之明；先切分能让所有统计量都限制在观察窗内。",
        q_en: "Why does 'split before cleaning' also hold in a pure analysis project with no model?",
        a_en: "Because the question is whether the conclusion was reachable at that moment. Any cleaning rule (outlier thresholds, group means used for imputation, category encodings) that draws on data from the later window smuggles hindsight in; splitting first confines every statistic to the observation window."
      }
    },

    "sp3-4": {
      min: 12,
      summary: [
        "结论先行不是修辞偏好而是效率：决策者只需要「是什么、多可信、下一步做什么」三件事，方法与附录往后放。「我做了 A、B、C」是过程记录，任何一份以过程开头的报告都会被追问同一个问题——所以呢？",
        "每张图的标题写成结论句：「高价段复购率低 12 个百分点」优于「复购率分布」。读者先看标题决定要不要看图，标题写栏目名等于把判断责任推回给读者，也等于把最重要的信息藏在图注里。",
        "措辞纪律是数据人的职业底线：相关就说「相关」或「在控制 X 之后仍然……」，要说「导致」就得拿出实验证据（A/B、断点、工具变量）。分析项目最常见的损失不是算错，而是说得太满——一次过度的因果表述可以让整份报告失去信用。",
        "每个数字都要带口径：n、时间窗、是否去重、缺失率与处理方式、随机种子。同一个词在两张表里是两个意思时，两套数字永远对不上；把口径写进一个固定的「口径表」单元，让所有下游引用它而不是重新解释一遍。",
        "导出是本地能力，不依赖网络：`jupyter nbconvert --to html report.ipynb` 出静态版给不装环境的人看，PDF 需要本机转换器（缺就退回 HTML）。导出版必须带上图与关键表——一份只剩代码单元和空白输出的 HTML 等于没交付。",
        "提交前的三连动作：重启内核并全部重新运行（确认能一键复现）→ 决定这份是「分析版（留输出）」还是「代码版（清空输出）」并保持一致 → 扫一遍绝对路径与敏感信息（`/Users/...`、`C:\\Users\\...`、手机号、内网主机名、任何看起来像 key 的串）。",
        "进仓库的最小礼节决定了别人能不能用你的项目：README 里三条命令跑通、数据说明（来源/字段/许可/能不能随仓库分发）、`.gitignore` 掉 `*.ipynb_checkpoints/`（这个几乎每个人都误提交过一次）、以及一张「结果长什么样」的截图或摘要。",
        "汇报前的两个自检问题：换个随机种子或换个时间窗，结论还在吗？去掉贡献最大的那一组数据，结论会不会翻转？两个都答不上来，说明你手上是一次抽样而不是一个结论——把这句话写进「局限」段落，比任何修饰都更让人信任。"
      ],
      summary_en: [
        "Conclusion-first is efficiency, not rhetoric: a decision-maker needs 'what, how confident, what next', with method and appendices behind. 'I did A, B and C' is a process log, and every report that opens with process invites the same question — so what?",
        "Write each figure's title as a conclusion sentence: 'repurchase is 12 points lower in the high-price tier' beats 'repurchase distribution'. Readers decide whether to look at the figure from its title, so a label-style title hands the judgement back and buries the finding in the caption.",
        "Verbal discipline is a professional floor: say 'correlated' or 'still holds after controlling for X', and only say 'causes' when you can produce an experiment (A/B, regression discontinuity, instrumental variable). The commonest failure of analysis projects is not a wrong number but an overstated one — one careless causal claim can cost the whole report its credibility.",
        "Every number carries its definition: n, time window, deduped or not, missing rate and treatment, random seed. When the same word means two things in two tables the numbers can never be reconciled, so write the definitions into one fixed 'metric contract' cell and have everything downstream reference it instead of re-explaining.",
        "Exporting is a local capability needing no network: `jupyter nbconvert --to html report.ipynb` gives a static version for readers with no environment, and PDF needs a local converter (fall back to HTML when it is missing). The exported file must include figures and key tables — an HTML of empty code cells is not a delivery.",
        "The three moves before committing: restart the kernel and run all (proving one-click reproducibility), decide whether this file is the analysed version (outputs kept) or the code version (outputs cleared) and stay consistent, then scan for absolute paths and secrets (`/Users/...`, C:\\Users\\..., phone numbers, internal hostnames, anything that looks like a key).",
        "Minimum repository manners decide whether anyone can reuse your work: three README commands that actually run, a data note (source, fields, licence, whether it may be distributed), a .gitignore covering `*.ipynb_checkpoints/` (almost everyone commits it once), and one screenshot or summary of what the results look like.",
        "Two self-checks before presenting: does the finding survive a different seed or a different time window? Does it flip if you remove the single biggest contributing group? If you cannot answer, you are holding one sample rather than a conclusion — writing that into the limitations section earns more trust than any polish."
      ],
      code: `import json
import numpy as np
import pandas as pd

rng = np.random.default_rng(42)
n = 300
df = pd.DataFrame({"city": rng.integers(0, 3, n), "buy": rng.integers(0, 2, n)})
rate = df.groupby("city")["buy"].mean().sort_values(ascending=False)
# 结论块的固定格式：问题、口径、样本量、缺失、数字，五件一件都不能少
report = {
    "question": "purchase rate gap across three cities",
    "metric": "buy.mean() per city, no dedup, window 2026-01",
    "n": int(n),
    "missing": int(df.isna().sum().sum()),
    "result": {str(k): round(float(v), 3) for k, v in rate.items()},
}
print(json.dumps(report, ensure_ascii=False, indent=2))
# 换子样本看结论还在不在：区间很宽说明你手里只有一次抽样，不是结论
gaps = []
for s in (1, 2, 3, 4, 5):
    d = df.sample(frac=0.6, random_state=s)
    r = d.groupby("city")["buy"].mean()
    gaps.append(float(r.max() - r.min()))
print("gap range", round(min(gaps), 3), "to", round(max(gaps), 3))
# 导出静态版给不装环境的读者：本机命令，不联网
# jupyter nbconvert --to html report.ipynb
# 提交前扫一遍绝对路径与敏感串：这是最常见的泄露来源
# git grep -n "Users" -- "*.ipynb"`,
      pit: "把「重启并全部运行」留到交付之后：导出的 HTML/PDF 里带着旧输出，甚至某几个 cell 在干净内核上会报错，你却在 README 里写了「一键复现」。交付前的正确顺序是先干净重跑一次、确认最后一屏结论与正文一致，再导出、再提交——顺序反过来时，你分享的是历史而不是结果。",
      pit_en: "Deferring 'restart and run all' until after delivery: the exported HTML carries stale outputs, some cells would even error on a clean kernel, and yet the README promises one-click reproduction. Run everything clean first, confirm the final screen matches the text, then export and commit — reversed, you are shipping history instead of results.",
      ex: {
        q: "为什么「样本量」必须和百分比一起出现在结论里？",
        a: "因为没有 n 的百分比无法判断可信度：3 个人里 2 个复购（66.7%）与 3000 人里 2000 个复购（66.7%）说的是两件事，前者可能完全是抽样噪声。",
        q_en: "Why must the sample size appear next to every percentage in the conclusion?",
        a_en: "A percentage without n cannot be judged: 2 of 3 repurchasing (66.7%) and 2000 of 3000 (66.7%) are different statements, and the first may be pure sampling noise."
      }
    },

    "sp3-5": {
      title: "综合重构：可复现性验收清单，以及什么时候离开 notebook",
      title_en: "Synthesis: A Reproducibility Checklist, and When to Leave the Notebook",
      min: 15,
      target: "能拿出一份别人从零跑通的复现清单（环境、数据、参数、种子、结论五样），说出 notebook 三种不可复现来源及对策，并判断哪些逻辑该沉淀成 .py 模块与测试。",
      target_en: "Produce a checklist that lets a stranger run the project from scratch (environment, data, parameters, seeds, conclusions), name the three sources of notebook irreproducibility with their countermeasures, and decide which logic must graduate into a tested .py module.",
      summary: [
        "把三章连起来看：sp1 给了「形状与 dtype 的确定性」，sp2 给了「标签对齐与账本」，sp3 补上第三样「状态」。可复现的数据工作 = 数值确定（sp1）+ 口径确定（sp2）+ 过程确定（sp3），少一样都只能叫「我这边跑通过」。",
        "五条验收清单，逐条要能当场演示：① 全新内核 Run All 一路跑到结论；② `pip install -r requirements.txt` 能在新虚拟环境里重建（含解释器版本）；③ 数据能被指名（快照日期 + 哈希 + 来源）；④ 每个随机点都能追溯到一个种子；⑤ 结论块里的数字带口径与 n。",
        "不可复现只有三种来源，分类的价值在于对策完全不同：状态（乱序执行、残留变量与模块缓存 → 重启内核）、环境（同名不同包、库大版本语义变了 → 锁环境与主版本）、数据（文件悄悄换了版本而代码不知道 → 快照与哈希）。",
        "什么时候该离开 notebook，六条信号：同一段代码复制到第二个 cell、这个函数被别的 notebook 也需要、需要单元测试、需要被人评审 diff、需要长时间运行且要断点续跑、需要被命令行或调度器调用。命中任意一条，就把那块逻辑搬进 .py。",
        "但别追求一次搬完：留一个「探索区」notebook（允许脏、允许重跑错、允许半途放弃），旁边放「正式区」的 `pipeline.py` 加一个薄薄的驱动 notebook。分界线是一句主观但有效的话——「这段逻辑我已经确信」，确信了就沉淀，没确信就继续脏着。",
        "本章五坑复盘：删了定义 cell 后面还在用旧值 / `from x import f` 后 reload 不生效 / 重跑 `pd.concat([df, ...])` 让数据翻倍 / 全局 `np.random.seed` 被第三方库改走 / 提交了带 base64 输出的 ipynb 导致无法评审。每一条的对策都是一句「重启并全部运行」，加上把预期写成 assert。",
        "收口动作固化成一个脚本：`repro_check.py` 导入你的模块、带断言地重算核心数字、把 CFG 与库版本打印出来。把它当冒烟测试跑（改完代码先跑它），而不是每次手动点十几个 cell——自动化验证的价值在于你愿意频繁运行它。",
        "指向下一章：工具链到此齐了——NumPy 管数值、pandas 管表、notebook 管叙事与状态。ml1 会把 sp3-3 里那半页「先切分再清洗、基线、泄漏」升级成机器学习的正式流程：泛化误差、交叉验证与训练/推理差异，都会建立在你今天写下的这份可复现底座上。"
      ],
      summary_en: [
        "Read the three chapters together: sp1 gave certainty of shape and dtype, sp2 gave label alignment and account-keeping, sp3 adds the third ingredient, state. Reproducible data work = numeric certainty (sp1) + definitional certainty (sp2) + procedural certainty (sp3); drop one and all you have is 'it ran on my machine'.",
        "Five acceptance items, each demonstrable on the spot: 1) a fresh kernel runs top to bottom to the conclusion; 2) `pip install -r requirements.txt` rebuilds the environment in a new virtualenv, interpreter version included; 3) the data is nameable (snapshot date + hash + source); 4) every random draw traces back to one seed; 5) every number in the conclusion carries its definition and n.",
        "Irreproducibility has only three sources, and the classification matters because the countermeasures are unrelated: state (out-of-order execution, leftover variables and module caches — fix by restarting the kernel), environment (same package name different version, major-version semantic changes — fix by pinning), data (the file changed silently and the code never noticed — fix with snapshots and hashes).",
        "Six signals that it is time to leave the notebook: you pasted the same block into a second cell, another notebook needs this function too, you need unit tests, someone needs to review a diff, the run is long and must resume, or a CLI or scheduler must call it. Any one of them means that logic belongs in a .py.",
        "But do not move everything at once: keep an exploration notebook, allowed to be messy and abandoned halfway, next to the formal pipeline.py plus a thin driver notebook. The boundary is one subjective but effective sentence — 'I am now sure about this logic'. Sure means graduate it; unsure means keep it dirty.",
        "Retrospective of this chapter's five pits: a definition cell deleted while later cells still used the old object; reload having no effect on names bound by `from x import f`; re-running `pd.concat([df, ...])` and doubling the data; the global `np.random.seed` being changed under you by a third-party library; committing an ipynb full of base64 output so nobody can review it. The countermeasure for all five is 'restart and run all', plus turning expectations into asserts.",
        "Freeze the closing move as a script: repro_check.py imports your module, recomputes the key numbers with assertions, and prints CFG with library versions. Run it as a smoke test whenever you change code instead of clicking a dozen cells by hand — automated checks are only valuable at the frequency you actually run them.",
        "Bridge to the next chapter: the toolchain is complete — NumPy for numbers, pandas for tables, the notebook for narrative and state. ml1 promotes those half-page rules from sp3-3 (split before cleaning, baselines, leakage) into the formal machinery of machine learning: generalisation error, cross-validation and the train/serve gap all stand on the reproducible base you wrote today."
      ],
      code: `# 项目骨架：notebook 负责讲道理，.py 负责做事，check 负责让道理不腐烂
# proj/
#   notebook.ipynb     探索与叙事，允许脏
#   pipeline.py        沉淀下来的函数，可 import、可测试
#   repro_check.py     本节的收口动作：断言式冒烟测试
#   requirements.txt   直接依赖与主版本
#   README.md          三条命令跑通
import numpy as np
import pandas as pd
import pipeline

# 每次跑之前把环境与参数打印出来：结论离开这些数字就没有意义
print("numpy", np.__version__, "pandas", pd.__version__)
CFG = dict(seed=42)
rng = np.random.default_rng(CFG["seed"])
raw = pd.DataFrame({"amount": ["1", "2,0", "-", None] * 750})
first = pipeline.clean(raw)["amount"].sum()
again = pipeline.clean(raw)["amount"].sum()
# 同一份输入连跑两次必须同一个数：不一致就先查状态、种子、数据这三处
assert first == again, "same input gave two different numbers"
# 换一份等价输入，行数不该变：这是最便宜的一条语义测试
assert pipeline.clean(raw).shape[0] == 3000
print("repro check ok", round(float(first), 2))`,
      pit: "把「可复现」理解成「我这台机器上还能跑出来」：三个月后你的环境已经被别的项目改动、数据文件被覆盖过一次、种子写在某个已删掉的 cell 里——原来的结果就成了不可追认的孤本。可复现是写给「陌生人在干净机器上」的属性，凡是只依赖你这台机器状态的部分，都要显式落成文件（requirements、快照、CFG）。",
      pit_en: "Reading 'reproducible' as 'it still runs on my machine': three months later the environment has been perturbed by other projects, the data file was overwritten once, and the seed lived in a cell you deleted — the original result becomes an untraceable artefact. Reproducibility is a property for a stranger on a clean machine, so anything currently relying on your machine's state must become a file (requirements, snapshot, CFG).",
      ex: {
        q: "为什么「清空输出提交」和「保留输出提交」需要明确选一个，而不是随手？",
        a: "因为两者对读者的承诺不同：带输出等于声明「这份输出与代码在同一个内核状态下是一致的」，清空输出等于声明「请自己跑」。混着提交时，读者无法判断哪些输出是新鲜的，可复现性检查也就无从做起。",
        q_en: "Why must you deliberately choose between committing cleared outputs and committed outputs, rather than doing whatever happened?",
        a_en: "Each makes a different promise to the reader: kept outputs assert that 'these results match this code under one kernel state', cleared outputs say 'run it yourself'. Mixed commits leave readers unable to tell which outputs are fresh, and no reproducibility check can even start."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择/判断/填空混排） ---------- */
  quizAdd: {
    sp1: [
      {
        q: "关于 `a[1:4]` 与 `a[[1, 2, 3]]` 的返回值，下列说法正确的是？",
        o: ["两者都返回副本，改哪个都不影响 a", "前者返回视图、后者返回副本", "前者返回副本、后者返回视图", "两者都返回视图，改哪个都会影响 a"],
        a: 1,
        why: "连续区间能用原 buffer 加偏移与步长描述，所以是视图；花式索引选出的元素在内存里不连续，必须复制到新内存，所以是副本。副本上的修改不会回写。",
        q_en: "Which statement about `a[1:4]` and `a[[1, 2, 3]]` is correct?",
        o_en: ["Both return copies, so neither affects a", "The first returns a view, the second a copy", "The first returns a copy, the second a view", "Both return views, so either one writes through to a"],
        why_en: "A contiguous range is describable by an offset plus strides into the original buffer, hence a view; fancy indices pick non-adjacent elements that must be gathered into fresh memory, hence a copy that never writes back."
      },
      {
        q: "`np.array([250, 255], dtype=np.uint8) + 10` 的结果是？",
        o: ["array([260, 265])", "array([4, 9])", "抛出 OverflowError", "array([0, 0])"],
        a: 1,
        why: "算术按 dtype 进行，结果仍是 uint8，超过 255 的部分按模 256 回绕；NumPy 最多给一条 RuntimeWarning，不会中断程序。",
        q_en: "What does `np.array([250, 255], dtype=np.uint8) + 10` evaluate to?",
        o_en: ["array([260, 265])", "array([4, 9])", "It raises OverflowError", "array([0, 0])"],
        why_en: "Arithmetic follows the dtype, so the result stays uint8 and values above 255 wrap modulo 256. At most NumPy emits a RuntimeWarning; nothing stops."
      },
      {
        q: "判断：`np.nanmean(x)` 对一整段全是 NaN 的数据会返回 0。",
        type: "judge", a: 1,
        why: "它会给出 NaN 并伴随一条 RuntimeWarning（Mean of empty slice）。这个 NaN 会安静地向下游传播，所以聚合前要检查有效样本数，而不是指望它给个中性值。",
        q_en: "True or false: `np.nanmean(x)` returns 0 when the whole slice is NaN.",
        why_en: "False. It returns NaN with a RuntimeWarning ('Mean of empty slice'), and that NaN propagates quietly downstream — check the valid-sample count instead of hoping for a neutral value."
      },
      {
        q: "要对二维矩阵 m「每一行各自求和」，应写 `np.sum(m, axis=____)`（填数字）。",
        type: "fill", ans: ["1"],
        why: "写下来的那个轴被压掉：axis=1 压掉列轴，每行留一个和；axis=0 压掉行轴，得到每列的和。",
        q_en: "To sum each row of a 2-D matrix m, you write `np.sum(m, axis=____)` (a number).",
        why_en: "The axis you name is the axis that disappears: axis=1 collapses the columns, leaving one sum per row, while axis=0 collapses the rows for per-column sums."
      }
    ],
    sp2: [
      {
        q: "两个 index 不完全相同的 Series 相加，结果是？",
        o: ["按位置配对，多出来的截断", "按标签取并集对齐，配不上的位置为 NaN", "直接抛出 ValueError", "自动 reset_index 后按位置相加"],
        a: 1,
        why: "Pandas 的算术按 index 标签对齐，长度相同但标签不相交时会静默产生大量 NaN，这是它区别于 NumPy 的核心行为。",
        q_en: "What happens when you add two Series whose indexes are not identical?",
        o_en: ["They pair by position and the extra entries are truncated", "They align on the union of labels, with NaN where nothing matches", "It raises ValueError", "Pandas resets the index first and pairs by position"],
        why_en: "pandas arithmetic aligns on index labels, so equal lengths with partly disjoint labels silently produce NaN — the core behavioural difference from NumPy."
      },
      {
        q: "`df.groupby('k').size().sum()` 比 `len(df)` 小，最可能的原因是？",
        o: ["分组键里有 NaN，那些行被默认丢掉", "size 只统计第一个分组", "df 里有重复行被自动去掉", "groupby 会自动做去重"],
        a: 0,
        why: "groupby 默认 dropna=True，键为缺失值的整行不进入任何组；确认办法是用 dropna=False 再对比一次行数。",
        q_en: "`df.groupby('k').size().sum()` comes out smaller than `len(df)`. Most likely cause?",
        o_en: ["Some keys are NaN and those rows are dropped by default", "size only counts the first group", "Duplicate rows were removed automatically", "groupby deduplicates by itself"],
        why_en: "groupby defaults to dropna=True, so rows whose key is missing join no group at all; confirm by re-running with dropna=False and comparing row counts."
      },
      {
        q: "判断：开启 copy-on-write 之后不再出现 SettingWithCopyWarning，所以 `df[mask][\"col\"] = v` 成了推荐写法。",
        type: "judge", a: 1,
        why: "警告消失只是因为副本语义变成明确的：这条链式写法仍然只写到临时对象上，原表照旧不变。正确写法始终是一次完成的 `df.loc[mask, \"col\"] = v`。",
        q_en: "True or false: with copy-on-write the SettingWithCopyWarning disappears, so `df[mask][\"col\"] = v` becomes the recommended style.",
        why_en: "False. The warning vanishes only because copy semantics become explicit; the chained assignment still writes to a temporary and the original table is unchanged. The right form stays the one-shot `df.loc[mask, \"col\"] = v`."
      },
      {
        q: "合并两张表时，用哪个参数能让「连接关系的假设不成立」时直接报错，而不是静默放大行数？填参数名。",
        type: "fill", ans: ["validate", "validate=", "validate=\"one_to_one\""],
        why: "`merge(..., validate=\"one_to_many\")` 之类会把「谁是主键」写成契约，键有重复时抛 MergeError；行爆炸因此在发生的那一刻被拦住。",
        q_en: "Which merge argument makes a violated join-cardinality assumption raise instead of silently inflating the row count? Give the parameter name.",
        why_en: "Passing validate=\"one_to_many\" (and friends) turns 'who is the key' into a contract, so duplicated keys raise MergeError and the explosion is caught at the moment it would happen."
      }
    ],
    sp3: [
      {
        q: "下面哪个现象最能说明「notebook 的隐藏状态已经被污染」？",
        o: ["某个 cell 运行时间比上次长", "单元格执行序号跳号，且结果与代码顺序不一致", "内核内存占用较高", "某个 cell 报错"],
        a: 1,
        why: "序号跳号说明有 cell 从未运行或被重排，后面用到的变量来自更早的一份状态；这类结果在数值上看着完全正常，只能靠重启并全部重跑来排除。",
        q_en: "Which symptom best indicates that a notebook's hidden state has been corrupted?",
        o_en: ["A cell took longer than last time", "Execution counters skip numbers and results disagree with the code order", "The kernel uses a lot of memory", "One cell raises an error"],
        why_en: "Skipped counters mean cells never ran or were reordered, so later variables come from an older state; those numbers look perfectly reasonable and can only be ruled out by restart-and-run-all."
      },
      {
        q: "`importlib.reload(P)` 之后，先前用 `from P import f` 绑定的名字 `f` 指向什么？",
        o: ["重载后的新函数", "仍然指向旧的函数对象", "None，需要重新导入才存在", "自动变成模块 P 本身"],
        a: 1,
        why: "reload 更新的是模块对象里的属性，而 from-import 已经把旧函数对象绑到了本地名字上；要拿新版必须重新执行那行 import，或用 autoreload。",
        q_en: "After `importlib.reload(P)`, what does a name previously bound by `from P import f` refer to?",
        o_en: ["The reloaded function", "Still the old function object", "None until you import again", "The module object P itself"],
        why_en: "reload refreshes the attributes inside the module object, while from-import already bound the old function to your local name; get the new one by re-running the import, or use autoreload."
      },
      {
        q: "判断：只要 Markdown 写得足够完整，交付 notebook 前就不必重启内核重跑。",
        type: "judge", a: 1,
        why: "Markdown 描述的是你以为的执行过程，而文件里的输出来自实际的执行顺序。只有「重启内核 + 全部重新运行」能证明这套代码在干净状态下真能产出这些结论。",
        q_en: "True or false: complete Markdown documentation removes the need to restart the kernel and re-run before delivery.",
        why_en: "False. The prose describes the run you believe you performed, while the stored outputs come from the run you actually performed. Only 'restart the kernel and run all' proves the code produces those conclusions from a clean state."
      },
      {
        q: "清空当前内核命名空间的魔法命令是 `%____`（填命令名，不含百分号）。",
        type: "fill", ans: ["reset"],
        why: "`%reset -f` 删掉全部变量但不动 sys.modules，因此已导入的模块仍是缓存里的旧版本；要彻底干净还得重启内核。",
        q_en: "The magic that clears the current kernel namespace is `%____` (command name, no percent sign).",
        why_en: "%reset -f drops all variables but leaves sys.modules alone, so imported modules stay at their cached version; a kernel restart is still needed for a truly clean slate."
      }
    ]
  },

  /* ---------- 词典：与 base-terms.txt 及其它深化文件均不重名 ---------- */
  terms: [
    { term: "内存步长", term_en: "Strides", cat: "基础概念",
      short: "沿某个轴前进一格需要跨过的字节数，决定数组如何解读同一块内存。",
      short_en: "Bytes crossed to advance one step along an axis; they decide how the buffer is read.",
      detail: ["转置、带步长的切片与共享 buffer 的视图只改 shape 和 strides，不搬动任何数据。", "某条轴的步长为 0 表示它被广播拉伸：同一块内存被反复读取，不占额外空间。"],
      detail_en: ["Transposes, strided slices and shared-buffer views change only shape and strides and move no data.", "A stride of 0 on an axis means it is broadcast-stretched: the same bytes are read again and again with no extra space."],
      vs: "步长说明「怎么读这块内存」，dtype 说明「每个元素是什么」。",
      vs_en: "Strides say how the memory is read; dtype says what each element is." },
    { term: "数组视图", term_en: "Array View", cat: "基础概念",
      short: "与原数组共用同一块内存的数组，写视图等于写原件。",
      short_en: "An array sharing the original buffer, so writing the view writes the original.",
      detail: ["基本切片、转置、连续时的 reshape 都返回视图，判据是 x.base 是否非空。", "视图会钉住整块底层内存：切出 100 个元素，原数组的几百万个元素也无法释放。"],
      detail_en: ["Basic slicing, transposes and reshape on contiguous data return views; the test is whether x.base is non-null.", "A view pins the whole underlying buffer: slice out 100 elements and the original millions can never be freed."],
      vs: "视图共享内存、副本独占内存，两者的副作用方向正好相反。",
      vs_en: "A view shares memory and a copy owns it; the direction of side effects is opposite." },
    { term: "花式索引", term_en: "Fancy Indexing", cat: "基础概念",
      short: "用整数数组或布尔数组当索引，结果总是新分配的副本。",
      short_en: "Indexing with an integer or boolean array, which always yields a fresh copy.",
      detail: ["a[[1,2,3]] 与 a[a>0] 都是花式索引，改它们不会影响原数组。", "重复下标在 += 时只被写一次，需要真正的累加语义要用 np.add.at。"],
      detail_en: ["Both a[[1,2,3]] and a[a>0] are fancy indexing, and mutating them leaves the original untouched.", "Repeated indices are written only once under +=; genuine accumulation needs np.add.at."],
      vs: "花式索引按「选中的元素」组织，基本切片按「连续区间加步长」描述。",
      vs_en: "Fancy indexing enumerates chosen elements; basic slicing describes a contiguous run with a stride." },
    { term: "窄整型回绕", term_en: "Narrow Integer Wraparound", cat: "基础概念",
      short: "int8/uint8 这类窄整型的算术按自身位宽绕回，不报错只给告警。",
      short_en: "Arithmetic on narrow integers wraps within its own width, warning at most.",
      detail: ["uint8 的 255 加 1 变成 0，无符号数被减成负数会变成巨大正数。", "sum 会为窄整型换成平台整数累加器，但 cumsum、加、乘一律原样保留 dtype。"],
      detail_en: ["uint8 255 plus 1 becomes 0, and an unsigned value pushed below zero becomes a huge positive number.", "sum silently swaps in a platform-int accumulator for narrow integers, but cumsum, + and * all keep the dtype."],
      vs: "回绕是位宽问题，类型提升才是精度问题；前者突然错，后者慢慢错。",
      vs_en: "Wraparound is a width problem and promotion a precision problem: the first snaps, the second drifts." },
    { term: "空值传染", term_en: "NaN Contagion", cat: "训练与数据",
      short: "一个 NaN 就让整条聚合结果变成 NaN，且默认不报错。",
      short_en: "A single NaN turns the whole aggregate into NaN, silently by default.",
      detail: ["mean/sum/sort 都会被传染，只有 nanmean/nansum 一类函数会跳过它。", "全 NaN 的切片会让 nanmean 返回 NaN 并告警，这个值会一路带进模型特征。"],
      detail_en: ["mean, sum and sort are all infected; only the nan-skipping variants ignore it.", "An all-NaN slice makes nanmean return NaN with a warning, and that value rides into your features."],
      vs: "空值传染是计算语义问题，缺失机制是数据生成问题，两者要分别处理。",
      vs_en: "Contagion is a computation-semantics problem; the missingness mechanism is a data-generation problem. Handle them separately." },
    { term: "随机数流", term_en: "Random Stream", cat: "训练与数据",
      short: "由一个发生器对象持有的确定性取数序列，显式传递才可追溯。",
      short_en: "A deterministic draw sequence owned by a generator object; traceable only when passed explicitly.",
      detail: ["np.random.seed 改的是全局状态，任何第三方库共用它，因此你的种子可能被别人改掉。", "np.random.default_rng(seed) 给你一个可传递的对象，每个随机消耗点都能追溯到同一条流。"],
      detail_en: ["np.random.seed mutates global state shared by every third-party library, so your seed can be changed by someone else.", "np.random.default_rng(seed) gives a passable object so each draw traces back to one stream."],
      vs: "种子决定起点，流决定谁在用它；只固定前者不足以复现。",
      vs_en: "A seed fixes the start, a stream fixes who draws from it; fixing only the first is not enough to reproduce." },
    { term: "索引对齐", term_en: "Index Alignment", cat: "基础概念",
      short: "Pandas 运算前按标签配对，配不上就补缺失值。",
      short_en: "pandas pairs operands by label before computing, filling NaN where nothing matches.",
      detail: ["两个长度相同、标签不相交的 Series 相减会得到全 NaN，且不报错。", "写回原表时结果的索引是分组键还是行号，决定了赋值会不会整列错位。"],
      detail_en: ["Subtracting two equal-length Series with disjoint labels gives all NaN with no complaint.", "Whether a result is indexed by group key or by row number decides whether assigning it back lines up."],
      vs: "NumPy 按位置（形状）对齐，Pandas 按标签对齐；混用是 bug 高发地。",
      vs_en: "NumPy aligns by position and shape, pandas by label; mixing the two in one expression is where bugs breed." },
    { term: "链式索引", term_en: "Chained Indexing", cat: "基础概念",
      short: "连续两次取中括号再赋值，中间对象可能是副本。",
      short_en: "Two back-to-back bracket operations followed by assignment, where the middle object may be a copy.",
      detail: ["df[mask][\"col\"] = v 是警告 SettingWithCopyWarning 的成因，正解是一次写完的 df.loc[mask, \"col\"] = v。", "开启复制语义后警告消失，但这条写法依然改不到原表，别把语义变更当成许可。"],
      detail_en: ["df[mask][\"col\"] = v is what triggers SettingWithCopyWarning; the fix is the single-shot df.loc[mask, \"col\"] = v.", "Under copy-on-write the warning disappears but the chained write still changes nothing; do not read the semantics change as permission."],
      vs: "链式索引是「读没问题、写不可靠」，链式选择用于读取时是完全合法的。",
      vs_en: "Chained indexing is safe for reading and unreliable for writing; chained selection to read values is perfectly legal." },
    { term: "拆分-应用-合并", term_en: "Split-Apply-Combine", cat: "基础概念",
      short: "分组计算的三段模型：按键分箱、每组独立计算、按键拼回。",
      short_en: "The three-stage model of grouping: partition by key, compute per group, stitch back by key.",
      detail: ["agg 把每组压成一行，transform 把每组结果广播回原行，filter 决定整组留不留。", "合并那一步按索引对齐，所以 as_index 的取舍直接决定输出形状。"],
      detail_en: ["agg collapses each group to one row, transform broadcasts each group's answer back onto its rows, filter keeps or drops whole groups.", "The combine step aligns on index, so the as_index choice directly determines the output shape."],
      vs: "它描述分组计算的形状变化，向量化描述同一形状下的执行方式。",
      vs_en: "It describes the shape changes of grouped computation; vectorisation describes how the same shape is executed." },
    { term: "连接键重复", term_en: "Duplicate Join Keys", cat: "训练与数据",
      short: "被连接一侧的键不唯一，导致左表每行被复制成多份。",
      short_en: "Keys repeating on the joined side, so every driving row is duplicated.",
      detail: ["行数爆炸之后复制行与原行在数值上无法区分，指标翻倍却看着仍然合理。", "对策是连接前检查 is_unique，并把关系写进 merge 的 validate 参数。"],
      detail_en: ["After the explosion a duplicated row is numerically indistinguishable from its twin, so metrics double while still looking sane.", "Countermeasures: check is_unique before joining and state the relationship in the validate argument."],
      vs: "连接键重复改变的是行数，缺失值改变的是同一行里的内容。",
      vs_en: "Duplicate keys change the row count; missing values change the contents of the same row." },
    { term: "缺失指示列", term_en: "Missingness Indicator", cat: "训练与数据",
      short: "把「这一格原本缺不缺」单独存成一列特征。",
      short_en: "A separate feature column recording whether the cell was originally missing.",
      detail: ["任何填充都会销毁缺失本身携带的信息，指示列是唯一把它留下的手段。", "缺失常与设备型号、注册时间、收入水平相关，树模型能直接利用这一列。"],
      detail_en: ["Any imputation destroys the information carried by missingness; the indicator is the only way to keep it.", "Missingness often correlates with device model, signup cohort or income, and tree models use the column directly."],
      vs: "指示列保留「缺不缺」，填充值处理「缺了怎么算」。",
      vs_en: "The indicator preserves whether it was missing; imputation decides what to compute with." },
    { term: "双轴图", term_en: "Dual-Axis Chart", cat: "评测与安全",
      short: "同一张图里放两根独立缩放的 y 轴。",
      short_en: "One figure carrying two independently scaled y axes.",
      detail: ["两条无关曲线被同一根横轴暗示成同步，且缩放自由度高到能让拐点重合。", "替代方案是共享 x 的上下子图，或者归一化之后画在同一根轴上。"],
      detail_en: ["Two unrelated series are implied to move together by the shared x axis, and the free scaling lets you align their kinks deliberately.", "Alternatives: stacked subplots sharing x, or normalise both and plot them on one axis."],
      vs: "截断坐标轴夸大差值，双轴图制造相关；前者骗尺度，后者骗因果。",
      vs_en: "A truncated axis exaggerates a gap while dual axes manufacture a correlation: one cheats scale, the other cheats causality." },
    { term: "计算内核", term_en: "Notebook Kernel", cat: "基础概念",
      short: "为 notebook 执行代码的独立进程，持有变量与已导入模块。",
      short_en: "The separate process that executes notebook code and holds variables plus imported modules.",
      detail: ["关闭标签页通常不会杀掉内核，换内核则一切状态归零。", "先打印 sys.executable 才能确认这个内核用的是哪个环境与解释器。"],
      detail_en: ["Closing the tab usually leaves the kernel alive; switching kernels resets every state.", "Print sys.executable to learn which environment and interpreter this kernel really uses."],
      vs: "内核是执行状态，notebook 文件是文本与历史输出的快照。",
      vs_en: "The kernel is the live execution state; the notebook file is a snapshot of text plus past outputs." },
    { term: "隐藏执行状态", term_en: "Hidden Execution State", cat: "基础概念",
      short: "由单元格执行顺序决定、却不出现在代码文本里的那份状态。",
      short_en: "State determined by cell execution order that never appears in the code text.",
      detail: ["跳着跑、重跑某个 cell、删掉定义 cell 都可能让结果与代码不一致。", "唯一可靠的排除法是重启内核并全部重新运行，然后检查执行序号。"],
      detail_en: ["Out-of-order runs, re-running one cell or deleting a definition cell can all desynchronise results from code.", "The only reliable exclusion is restart-and-run-all followed by a check of the execution counters."],
      vs: "隐藏执行状态在 notebook 里，随机数流在代码里；前者要重启、后者要固定种子。",
      vs_en: "Hidden execution state lives in the notebook, random streams live in the code; the first needs a restart, the second a seed." },
    { term: "模块重载", term_en: "Module Reloading", cat: "基础概念",
      short: "在同一个进程里重新执行 .py 文件并刷新模块属性。",
      short_en: "Re-executing a .py in the same process to refresh the module's attributes.",
      detail: ["importlib.reload 只更新模块对象里的名字，不更新已经 from-import 到本地的绑定。", "autoreload 扩展能在每个 cell 前自动重载，但对 C 扩展与已导入常量不一定有效。"],
      detail_en: ["importlib.reload updates names inside the module object but not bindings already copied out by from-import.", "The autoreload extension reloads before each cell but cannot reliably cover C extensions or imported constants."],
      vs: "重载解决「进程里代码不新鲜」，版本锁定解决「装的不是那一版」。",
      vs_en: "Reloading fixes stale code inside the process; version pinning fixes the package not being the version you think." },
    { term: "数据快照", term_en: "Data Snapshot", cat: "训练与数据",
      short: "分析所用那份数据在某一刻的固定副本，带日期与指纹。",
      short_en: "A frozen copy of the data used by an analysis, dated and fingerprinted.",
      detail: ["文件哈希能区分「代码变了」和「数据变了」，否则每次结果不同都无从解释。", "不能随仓库分发的大数据，至少要留下取数 SQL、导出日期与行数。"],
      detail_en: ["A file hash separates 'the code changed' from 'the data changed'; without it no differing result is explainable.", "For data you cannot ship, keep at least the extraction query, the export date and the row count."],
      vs: "快照固定输入，依赖锁定固定程序；两者合起来才叫可复现。",
      vs_en: "A snapshot freezes the input, dependency pinning freezes the program; only together do they make reproduction." },
    { term: "基线对照", term_en: "Baseline", cat: "训练与数据",
      short: "用最省事的办法先算出一个可比较的结果，作为一切改进的门槛。",
      short_en: "The cheapest comparable result, computed first, that every improvement must beat.",
      detail: ["类别不平衡时多数类准确率常常高得离谱，没有基线就会误判模型有效。", "基线效果好得不合理时，第一反应应该是查泄漏而不是庆祝。"],
      detail_en: ["Under class imbalance the majority-class accuracy can look impressive, so without a baseline you credit a model that adds nothing.", "When the baseline is implausibly good, check for leakage before celebrating."],
      vs: "基线衡量「有没有超过不努力」，交叉验证衡量「稳不稳」。",
      vs_en: "A baseline measures whether you beat doing nothing; cross-validation measures whether it holds." },
    { term: "环境锁定", term_en: "Environment Pinning", cat: "训练与数据",
      short: "把解释器版本与依赖主版本写成文件，换机器也能原样重建。",
      short_en: "Recording the interpreter version and dependency majors in files so another machine rebuilds them exactly.",
      detail: ["NumPy 1.x/2.x 的标量提升与 pandas 2.x/3.0 的复制语义都会改变数值结果，因此主版本必须记。", "只写包名的清单挡不住传递依赖漂移，配合虚拟环境与安装命令才完整。"],
      detail_en: ["Scalar promotion in NumPy 1.x versus 2.x and copy semantics in pandas 2.x versus 3.0 change numbers, so majors must be recorded.", "A bare list of package names cannot stop transitive drift; pair it with a virtualenv and the install command."],
      vs: "环境锁定固定包与解释器，依赖锁定只固定包；前者范围更大一层。",
      vs_en: "Environment pinning fixes packages and the interpreter; dependency pinning fixes packages only — the first is one layer wider." }
  ],

  achievements: [
    { id: "loop_translator", icon: "🧮", name: "循环翻译官", name_en: "Loop Translator",
      desc: "完成 sp1 · NumPy 数组计算 全部课节", desc_en: "Finish every lesson of sp1 NumPy Array Computing",
      check: ["sp1"] },
    { id: "table_auditor", icon: "🧹", name: "表格审计员", name_en: "Table Auditor",
      desc: "完成 sp2 · Pandas 与可视化 全部课节", desc_en: "Finish every lesson of sp2 Pandas and Visualisation",
      check: ["sp2"] },
    { id: "repro_keeper", icon: "🔁", name: "复现守门人", name_en: "Reproducibility Keeper",
      desc: "完成 sp3 · Jupyter 数据项目 全部课节", desc_en: "Finish every lesson of sp3 Jupyter Data Project",
      check: ["sp3"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "元信息三件套：同一块字节，换一套解释规则就是另一个数组": "the metadata trio: same bytes, another interpretation, another array",
    "strides：沿轴 0 走一步跨 6 字节，沿轴 1 走一步跨 2 字节": "strides: one step along axis 0 crosses 6 bytes, along axis 1 crosses 2",
    "转置只交换 shape 与 strides，一个字节都不搬，但访问不再连续": "the transpose only swaps shape and strides, moves no bytes, and makes access non-contiguous",
    "数字混进字符串：整列被统一成定长字符串，算术当场失效": "numbers mixed with text: everything becomes fixed-width strings and arithmetic dies",
    "放不进同一种 dtype 的元素退化成 object：又变回指针数组": "elements that share no dtype degrade to object: a pointer array again",
    "窄整型的算术按 dtype 回绕：只给一条告警，数值照错下去": "narrow-integer arithmetic wraps in its own dtype: one warning, wrong values anyway",
    "sum 会替窄整型换成平台整数累加器，cumsum 却原样保留 dtype": "sum swaps in a platform-int accumulator for narrow integers; cumsum keeps the dtype",
    "基本切片是视图：base 指回原数组，写它等于写原数组": "basic slicing gives a view: base points back, so writing it writes the original",
    "花式索引是副本：改它原数组一动不动": "fancy indexing gives a copy: change it and the original never moves",
    "重复下标只写一次，+= 也是「取副本、算完再整体写回」": "repeated indices are written once: gather, compute, then write the whole thing back",
    "真的要逐次累加就用 ufunc.at": "for genuine per-element accumulation use ufunc.at",
    "axis=1 压掉列轴得到 (2,)，与 (2,3) 从右往左比是 3 对 2，直接报错": "axis=1 collapses columns leaving (2,); against (2,3) that is 3 versus 2, so it raises",
    "keepdims 保住那个轴，广播才对得上": "keepdims retains that axis so broadcasting lines up again",
    "转置之后 reshape 会静默换序：等价于按列展开": "reshaping a transpose silently reorders: it equals a column-major flatten",
    "NumPy 标量不是 Python float，交给序列化之前先取出来": "a NumPy scalar is not a Python float; unwrap it before serialising",
    "循环版：每个元素都要拆对象、查类型、再装箱，解释器开销远大于乘法": "loop version: unbox, type-check and rebox each element — interpreter cost dwarfs the multiply",
    "向量版：同一件事，循环由 C 完成，还吃到连续访存与 SIMD": "vector version: the same work, looped in C, plus contiguous access and SIMD",
    "NumPy 里的除法：单斜杠永远给浮点，双斜杠才是向下取整": "division in NumPy: one slash always gives floats, two slashes floor",
    "想让整数走浮点除，就把其中一边写成浮点字面量": "to get true division from integers, write one side as a float literal",
    "轴语义：axis=0 压掉行轴＝逐列，axis=1 压掉列轴＝逐行": "axis semantics: axis=0 collapses rows (per column), axis=1 collapses columns (per row)",
    "一个 NaN 传染整个结果，nan 系列函数才跳过它": "one NaN infects the whole result; only the nan-skipping variants ignore it",
    "全 NaN 的切片：告警加 NaN，它会一路带到下游": "an all-NaN slice: a warning plus NaN, which travels downstream",
    "out= 复用同一块内存，省掉一个与输入等宽的临时数组": "out= reuses one buffer and skips a temporary as wide as the input",
    "(4,3) 与 (3,)：从右往左 3 对 3 合法，左轴补 1，等于每列减同一个数": "(4,3) with (3,): 3 against 3 is legal, the left axis is padded to 1, so each column loses the same number",
    "(4,3) 与 (4,)：从右往左 3 对 4 不合法，报错其实是帮了你": "(4,3) with (4,): 3 against 4 is illegal, and the error is doing you a favour",
    "(2,1) 与 (3,)：两轴都对得上，结果是 2x3 的外积式矩阵": "(2,1) with (3,): both axes match, and the result is a 2x3 outer-product grid",
    "广播视图不复制：那条被拉伸的轴步长为 0，而且是只读的": "a broadcast view copies nothing: the stretched axis has stride 0 and is read-only",
    "但运算结果一定是一份全新的完整数组，n*m 的内存就是这么花掉的": "but the operation still allocates one full new array — that is where n*m memory goes",
    "把形状写成注释，是这类 bug 唯一可靠的防线": "writing shapes as comments is the only reliable defence against this bug class",
    "逐元素乘会广播成 (2,2)，矩阵乘是 (2,2)@(2,) -> (2,)：两者都不报错": "elementwise product broadcasts to (2,2), matmul gives (2,); neither one complains",
    "显式点出轴名字，比反复 reshape 更不容易搞错方向": "naming the axes explicitly beats guessing directions through repeated reshapes",
    "解方程用 solve，别写成 inv(A) @ b：更少运算也少一次舍入": "solve the system directly instead of inv(A) @ b: fewer flops, one less rounding",
    "条件数越大越危险：它告诉你结果还能信几位": "the larger the condition number the more dangerous: it says how many digits survive",
    "同一条流按顺序取数；重跑这一段才会完全一致": "draws come in order from one stream; only re-running this gives the same numbers",
    "换一个同样 seed 的新发生器，得到的是同一段数": "a fresh generator with the same seed replays the same numbers",
    "浮点比较一律用 allclose：并行归约的相加顺序就会改最后几位": "always compare floats with allclose: parallel reduction order changes the last digits",
    "第一步：循环版先保证「对」，它是后面所有对比的参照物": "step 1: the loop version establishes correctness and becomes the reference for everything after",
    "第二步：向量版用前缀和做同一件事，只扫一遍内存": "step 2: the vector version does the same with prefix sums, one pass over memory",
    "第三步：形状与 dtype 先打印出来，再谈等价": "step 3: print shape and dtype before discussing equivalence",
    "第四步：等价性用 allclose，别用 ==，浮点相加顺序不同就有末位差": "step 4: prove equivalence with allclose, not ==; summation order moves the last digits",
    "收口自查：这条向量化有没有偷偷多出内存": "closing self-check: did this vectorisation quietly allocate extra memory",
    "相加先按标签对齐，配不上的位置静默补 NaN：这是 Pandas 与 NumPy 的分水岭": "arithmetic aligns on labels first and fills NaN silently where nothing matches: the watershed between pandas and NumPy",
    "确实要按位置配对时，先把标签拿掉，两边同时拿掉": "when position really is the semantics, drop the labels on both sides",
    "列名撞上 DataFrame 自带的属性时，点号写法拿到的是方法而不是数据": "when a column name collides with a DataFrame attribute, dot access returns the method, not the data",
    "一列里混进字符串就退化成 object，向量化当场失效": "one string in a numeric column makes it object and vectorisation is gone",
    "判缺失只能用 isna：NaN 不等于自己，用 == 判永远是 False": "test missingness only with isna: NaN never equals itself, so == is always False",
    "筛选后 index 保留原标签，这不是脏数据，是「这一行原来是谁」": "filtering keeps the original labels: that is not dirt, it is 'which row was this'",
    "试读先看 dtype 与缺失：ID 列必须显式指定 str，否则前导零被吃掉": "trial-read to inspect dtypes and missingness: id columns must be str or leading zeros vanish",
    "一次 .loc 同时定位行条件与列，不要写成 df[df.math>86][\"math\"] = 0": "one .loc that picks rows and columns together; never write df[df.math>86][\"math\"] = 0",
    "布尔条件各自加括号：& 的优先级低于比较运算": "parenthesise each boolean condition: & binds looser than comparison",
    "loc 含头含尾、iloc 含头不含尾：这是最稳定的差一错误来源": "loc includes both ends, iloc excludes the last: the steadiest off-by-one source",
    "行数账本：每一步都留下 shape 与缺失数，才对得上谁被丢了": "row ledger: keep shape and missing counts at every step to see who was dropped",
    "低基数列转 category，内存与分组都受益": "cast low-cardinality columns to category; memory and groupby both benefit",
    "agg 把每组压成一行；as_index=False 让分组键留在普通列里，方便后面拼接": "agg collapses each group to one row; as_index=False keeps the keys as ordinary columns for later joins",
    "transform 把每组的结果广播回每一行，长度不变：组内占比就靠它": "transform broadcasts each group's answer back onto its rows at the same length: within-group shares need it",
    "键里的 NaN 默认整行被丢：分组后的行数和原表对不上就是这里": "rows with a NaN key are dropped by default: this is why grouped rows fewer than the table",
    "filter 决定整组留不留，agg 只压行，两者不能互相替代": "filter keeps or drops whole groups, agg only collapses rows; they are not interchangeable",
    "size 数行、count 数非缺失、nunique 数去重值：三个不同的问题": "size counts rows, count non-missing values, nunique distinct ones: three different questions",
    "分组后想接着排序取名次：rank 也是 transform 家族的形状": "to keep ranking after grouping: rank also returns the transform-shaped result",
    "记账：每列缺多少比例，先于任何填充决策": "bookkeeping: the per-column missing rate comes before any imputation decision",
    "字符串脏值让整列留在 object，用 to_numeric 换它成 NaN，并数清被换掉几条": "dirty strings keep the column at object; to_numeric turns them into NaN — count how many",
    "指示列：先把「缺不缺」这件事存成特征，再谈怎么填": "indicator column: store whether it was missing as a feature before deciding what to fill",
    "缺失的行内分布：每行只缺一次可以填，整行空白要回源查": "within-row missingness: one blank per row can be filled, a wholly blank row goes back to source",
    "中位数比均值抗离群，但填之前必须已经决定「缺失本身已记录」": "the median resists outliers better than the mean, but only after missingness itself is recorded",
    "astype(str) 的代价：NaN 变成 \"nan\" 字符串，从此再也查不出缺失": "the cost of astype(str): NaN becomes the string \"nan\" and is never detectable again",
    "清洗要留下账本：每一步之后 assert 一次，别人重跑时才会发声": "cleaning needs a ledger: assert after each step so it speaks up when others re-run",
    "中文标题要显式指定本机字体，否则显示成方块：这是渲染端问题不是数据问题": "Chinese titles need a local font explicitly, or they render as boxes: a rendering issue, not a data issue",
    "尺度不同的两条曲线：上下两个共享 x 的子图，而不是左右各一根 y 轴": "two series of different scale: stacked subplots sharing x, not one y axis per side",
    "柱状图从 0 开始：截断基线会让 1.5 个百分点的差看起来像 5 倍": "bars start at zero: a truncated baseline makes a 1.5-point gap look fivefold",
    "标题写结论而不是写栏目名，读者先读标题再读图": "put the finding in the title, not the column name: readers scan the title before the figure",
    "连接前先验证唯一性，并把意图写进 validate：多对多会当场报错而不是放大行数": "verify uniqueness before joining and state the intent in validate: many-to-many raises instead of inflating rows",
    "行数账本：左表几行，合并后就该几行，多出来的都是键重复": "row ledger: as many rows out as the left table in; everything above that is duplicate keys",
    "清洗与聚合串成一条可重跑的管道，每步都留下中间结果": "chain cleaning and aggregation into one re-runnable pipeline, keeping every intermediate",
    "口径与结论一起打印：数字离开定义就没有意义": "print the definition with the conclusion: a number without it means nothing",
    "导出给下一环使用：写盘时把索引关掉，别给自己制造一列无名行号": "exporting for the next stage: pass index=False or you invent a nameless row-number column",
    "第一个 cell：环境、版本与种子先交代清楚，别人重跑才拿得到同一份数据": "first cell: state the environment, versions and seed, so a re-run gets the same data",
    "危险动作：这个 cell 每重跑一次就多拼一次，行数悄悄翻倍而且毫不报错": "dangerous move: every re-run appends again, doubling the rows with no complaint",
    "谁还活着：%who 只列名字，%whos 连类型与值一起列": "what is still alive: %who lists names, %whos adds types and values",
    "清命名空间，但它不清 sys.modules，已 import 的模块仍然缓存着": "clears the namespace but not sys.modules, so imported modules stay cached",
    "环境核对：先看解释器是不是你以为的那一个，再看包版本": "environment check: confirm the interpreter is the one you think, then the package versions",
    "唯一可信的验收：重启内核、全部重新运行，检查序号严格递增且没有空号": "the only trustworthy acceptance test: restart, run all, and see strictly increasing counters with no blanks",
    "pipeline.py：把重复三次的逻辑搬出 notebook，它才能被 import、被单测": "pipeline.py: logic repeated three times leaves the notebook so it can be imported and unit-tested",
    "改完 pipeline.py 只 reload：模块属性是新的，本地绑定的 clean 仍是旧函数对象": "editing pipeline.py then only reloading: the module attribute is new, your local clean is still the old function object",
    "校验写成代码：别人重跑时它会说话，Markdown 里写「应该正好 3000 行」不会": "turn checks into code: it speaks up when someone re-runs, while Markdown saying 'should be exactly 3000 rows' stays silent",
    "下面是 notebook 里的一个 cell：上面那份逻辑已经住在 pipeline.py 里": "the lines below are one notebook cell: the logic above now lives in pipeline.py",
    "重新执行一次 from-import 才拿得到新版，更省事的是让魔法命令自动做": "re-run the from-import to get the new version; the magics can do it for you automatically",
    "配置与种子放在最上一个 cell：下游全部引用它，而不是各自再写一遍字面量": "configuration and seed in the top cell: everything references them instead of repeating literals",
    "数据指纹：同一份输入才会得到同一个哈希，把它写进结论块当版本": "data fingerprint: the same input yields the same hash, so write it into the conclusion as a version",
    "先切分再清洗：时间序列按时间切，随机打乱等于把未来喂给过去": "split before cleaning: time series split in time; shuffling randomly feeds the future to the past",
    "泄漏写法（故意留作反例）：在全量上算均值之后再切分": "leaking form (kept deliberately as a counter-example): compute means on the full data, then split",
    "基线：无脑猜「不流失」的准确率，模型必须先跨过它才有资格谈改进": "baseline: the accuracy of always guessing 'no churn'; a model must clear it before claiming improvement",
    "结论块的固定格式：问题、口径、样本量、缺失、数字，五件一件都不能少": "a fixed conclusion block: question, definition, n, missingness, numbers — none may be missing",
    "换子样本看结论还在不在：区间很宽说明你手里只有一次抽样，不是结论": "resample and see whether the finding survives: a wide range means you hold one draw, not a conclusion",
    "导出静态版给不装环境的读者：本机命令，不联网": "export a static version for readers with no environment: a local command, no network",
    "提交前扫一遍绝对路径与敏感串：这是最常见的泄露来源": "scan for absolute paths and sensitive strings before committing: the commonest leak source",
    "项目骨架：notebook 负责讲道理，.py 负责做事，check 负责让道理不腐烂": "project skeleton: the notebook argues, the .py does the work, the check keeps the argument from rotting",
    "notebook.ipynb     探索与叙事，允许脏": "notebook.ipynb     exploration and narrative, allowed to be messy",
    "pipeline.py        沉淀下来的函数，可 import、可测试": "pipeline.py        the settled functions: importable and testable",
    "repro_check.py     本节的收口动作：断言式冒烟测试": "repro_check.py     this lesson's closing move: an assertion-driven smoke test",
    "requirements.txt   直接依赖与主版本": "requirements.txt   direct dependencies with their majors",
    "README.md          三条命令跑通": "README.md          three commands that actually run",
    "每次跑之前把环境与参数打印出来：结论离开这些数字就没有意义": "print the environment and parameters on every run: conclusions without them are meaningless",
    "同一份输入连跑两次必须同一个数：不一致就先查状态、种子、数据这三处": "the same input twice must give the same number: otherwise inspect state, seed and data in that order",
    "换一份等价输入，行数不该变：这是最便宜的一条语义测试": "for an equivalent input the row count must not change: the cheapest semantic test there is"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_SP);

