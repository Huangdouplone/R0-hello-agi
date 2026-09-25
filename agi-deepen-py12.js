/* ================================================================
 * R0:hello agi · 课程深化层 ⑨（py1 Python 环境与首程 / py2 数据类型与控制流）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把本站另一条路线（Python）的入门两章从每节 3 要点深化到 8 要点，并新增两节收口课
 *       p1-6 / p2-6。双路线是本站的核心特色，因此**每一节课都至少有一条「Python 与 C++ 对照」
 *       要点**（中英各一份、同一条下标），章末收口课再把对照汇总成一张速查表。
 *       py1 侧重环境与解释器、第一个程序、动态类型 vs 静态类型、缩进即语法、注释与文档字符串；
 *       py2 侧重数字与运算、字符串与编码、列表/字典/集合、推导式、条件与循环、range 的惰性、
 *       以及异常初步。基线 Python 3.11+，示例统一可直接运行。
 * 写法约定：既有课节不写 title（沿用主数据标题）；新课写 title/title_en/target/target_en；
 *          order 覆盖全部既有 id + 新增 id；code 里的中文注释全部进 codeComments
 *          （Python 的注释行一律单独成行，且行内不写双斜杠，免得映射键被切碎）。
 * ================================================================ */

const DEEPEN_PY12 = {
  stages: ["py1", "py2"],

  order: {
    py1: ["p1-1", "p1-2", "p1-3", "p1-4", "p1-5", "p1-6"],
    py2: ["p2-1", "p2-2", "p2-3", "p2-4", "p2-5", "p2-6"]
  },

  lessons: {

    /* ===================== py1 Python 环境与首程 ===================== */
    "p1-1": {
      min: 12,
      summary: [
        "Python 把「先跑起来」放在「先想清楚」前面：源码不产出可执行文件（严格说是先编译成字节码、再由 CPython 解释执行），改一行存盘就能重跑，反馈环是秒级——这正是数据探索与模型实验最需要的性质。",
        "语法接近伪代码：没有分号、没有花括号、变量不用声明类型，读一段 Python 的成本明显低于读同等功能的 C++；代价是「光看代码猜不出类型」，得靠命名规范、类型注解和测试把这部分信息补回来。",
        "AI 生态才是它真正的护城河：NumPy / PyTorch / scikit-learn / Hugging Face 全部 Python-first。但别把这读成「Python 快」——这些库的热路径写在 C/C++/CUDA 里，Python 只负责胶水、调度与表达。",
        "解释执行加全局解释器锁（GIL）决定了它的性能画像：单核纯 Python 循环常比编译后的 C++ 慢 10~100 倍，多线程做 CPU 密集任务也无法真正并行；要并行就上多进程，或者用已经在工作时释放 GIL 的库。",
        "什么时候选 Python：探索、原型、数据处理、训练脚本、工具与胶水；什么时候该回到 C++：延迟敏感、内存受限、要交付给别人链接的库、嵌入式与高频内层循环。这是判断，不是信仰。",
        "【Python 与 C++ 对照】同一件「累加 0 到 n-1」的活：C++ 要 `#include`、`int main()`、显式类型，`g++ -O2` 编译后再运行；Python 三行存盘直接跑。代价是同一算法纯 Python 版可能慢几十倍——Python 用开发速度换运行速度，C++ 反过来。所以 Python 里「跑不动」的正确反应是「把这段向量化或挪进扩展」，而不是「当初不该用 Python」。",
        "环境是 Python 的第一道坑：一台机器上常同时有系统 python3、conda、venv、pyenv 多个解释器，`pip install` 装到哪一个，完全由「当前这个 python 是谁」决定。养成先跑 `python -V` 再确认 `which python`（Windows 用 `where python`）的习惯，比任何技巧都省事。",
        "衔接：本节不需要任何前置知识，是 Python 路线的第一站（若你已走完 s1/s2，每节最后的对照点会告诉你同一件事在 C++ 里长什么样）。p1-2 写第一个程序，p1-6 把整条对照线收成一张表。"
      ],
      summary_en: [
        "Python puts 'get it running' ahead of 'think it through': the source produces no executable (strictly, it is compiled to bytecode and then interpreted by CPython), so one saved edit is immediately runnable and the feedback loop is seconds — precisely what exploration and model experiments need.",
        "The syntax reads like pseudocode: no semicolons, no braces, no type declarations, so a page of Python costs less to read than the same page of C++. The bill comes as 'you cannot tell the types from the code', and naming discipline, type hints and tests are how you pay it back.",
        "The AI ecosystem is the real moat: NumPy, PyTorch, scikit-learn and Hugging Face are all Python-first. Do not read that as 'Python is fast' — the hot paths inside those libraries are C, C++ or CUDA, with Python supplying glue, scheduling and expressiveness.",
        "Interpretation plus the Global Interpreter Lock defines its performance shape: a plain Python loop is often 10-100x slower than optimised C++, and threads cannot truly parallelise CPU-bound work. Use processes to parallelise, or libraries that release the GIL while they work.",
        "Pick Python for exploration, prototypes, data wrangling, training scripts and tooling glue; go back to C++ when latency matters, memory is tight, you must ship a library others link against, or there is an embedded or hot inner loop. It is an engineering judgement, not a religion.",
        "Python versus C++: the same 'sum 0 to n-1' needs includes, int main(), explicit types and a g++ -O2 build before it runs in C++, but only three saved lines in Python. The price is that the pure-Python version can be tens of times slower for the same algorithm — Python trades run time for development time and C++ the other way round. So 'too slow' in Python should trigger 'vectorise it or move it into an extension', never 'I should not have used Python'.",
        "The environment is Python's first trap: a machine typically holds system python3, conda, a venv and pyenv at once, and where `pip install` lands depends entirely on which python is current. Making a habit of `python -V` followed by `which python` (where python on Windows) saves more time than any cleverness.",
        "Bridge: this lesson needs no prerequisite — it is the entry to the Python track (if you already did s1 and s2, the comparison point at the end of each lesson shows you the C++ shape of the same idea). p1-2 writes the first program, and p1-6 gathers every comparison into one sheet."
      ],
      code: `# 同一件事的两种写法：累加 0 到 n-1
# Python：存盘就能跑，看不到编译这一步
n = 1000
total = 0
for i in range(n):
    total += i
print(f"Python 求和结果：{total}")

# 与 C++ 对照，同一件事在那边长这样（放在注释里）：
# #include <numeric>
# #include <vector>
# std::vector<int> v(n);
# std::iota(v.begin(), v.end(), 0);
# long long total = std::accumulate(v.begin(), v.end(), 0LL);
# 差别不在结果，而在「谁在算、什么时候算」
# Python 每一次加号都要先查对象类型再走魔术方法，这就是慢的来处`,
      pit: "以为「装好 Python 就只有一个 Python」：用 `pip install numpy` 装进 A 环境、却用 B 环境跑脚本，得到 ModuleNotFoundError，再装一次还是找不到——因为 pip 和 python 根本不属于同一个解释器。检查顺序必须是 `python -V` → `python -m pip --version` → `python -m pip install`（用 `-m` 把 pip 钉死在当前解释器上）。",
      pit_en: "Assuming 'Python installed' means 'one Python': pip installs numpy into environment A while the script runs in environment B, so ModuleNotFoundError survives a second install because pip and python are not the same interpreter. Check in this order: python -V, then python -m pip --version, then always install with python -m pip so pip is pinned to that interpreter.",
      ex: {
        q: "为什么说「Python 的 AI 生态很强」并不等于「Python 跑得快」？",
        a: "因为那些库把数值热路径实现在 C/C++/CUDA 扩展里，Python 只负责组装与调度；你调用的一行 `a @ b` 背后是几百万次矩阵乘在原生代码里跑，而一旦把这循环手写回纯 Python，同样的计算就慢回几十倍。",
        q_en: "Why does 'Python has a strong AI ecosystem' not mean 'Python is fast'?",
        a_en: "Because those libraries implement the numeric hot paths in C, C++ or CUDA extensions and Python only assembles and schedules them: one line like a @ b drives millions of native multiplications, but hand-write the same loop in pure Python and the computation falls back to tens of times slower."
      }
    },

    "p1-2": {
      min: 11,
      summary: [
        "`print()` 是一个普通函数而不是语言关键字：它可以收任意多个位置参数，用 `sep=` 控制分隔符（默认单个空格）、`end=` 控制结尾（默认换行符）、`file=` 选输出流、`flush=` 决定是否立刻推出缓冲区。",
        "字符串单引号与双引号完全等价，三个连写就是多行字符串；这点和 C++ 恰好相反——C++ 里只有双引号是字符串字面量，单引号是**一个** char，写错引号会撞到类型错误，而 Python 只会得到不同长度的文本。",
        "f-string（`f\"{a:.2f} {b:>10}\"`）是 3.6 年之后的默认选择：表达式原样写进花括号，冒号后面跟格式化说明符（小数位数、宽度、对齐、千分位）。`.format()` 与早年的 `%` 属于历史层积，读旧代码要认得，写新代码统一用 f-string。",
        "print 默认是行缓冲（连到终端时）：输出一行看得见一行；一旦重定向到文件或管道就变成块缓冲，攒满才落盘。调试时「日志怎么半天不出来」多数不是卡死而是缓冲，解决办法是 `flush=True`、`print(..., file=sys.stderr)` 或整个解释器加 `-u`。",
        "报错信息是可读的：Python 的 traceback 从最后一行往上读，并且会把出错那行的源码打印出来——这是解释器送的福利；C++ 的崩溃只给你地址和栈帧，还得挂上调试符号才知道行号。",
        "【Python 与 C++ 对照】C++ 用两个不同符号区分「换行」和「刷新」：`std::endl` 是换行加刷新、`'\\n'` 只是换行；Python 把同一件事拆成两个正交参数——`end` 管结尾、`flush` 管刷新，所以「换行但别刷」和「刷但别换行」都能表达。两种语言都把「写内容」与「推给设备」分开，只是一个做成符号、一个做成参数。",
        "`input()` 和 `print()` 是一对：前者永远返回字符串（p1-4 专门讲），所以「打印时看着是数字、算起来是字符串」是这一节埋下的第一个坑。",
        "衔接：p1-3 引入变量，那时「名字」与「值」的关系会推翻你在 C++ 里建立的「变量是一块内存」的直觉；本节先把输出练到不用想。"
      ],
      summary_en: [
        "print() is an ordinary function, not a keyword: it accepts any number of positional arguments, with sep= for the separator (a single space by default), end= for the tail (a newline by default), file= for the stream, and flush= to decide whether bytes leave immediately.",
        "Single and double quotes are interchangeable for strings, and three of them in a row give a multi-line literal. C++ is the opposite: a double-quoted literal is a string and a single-quoted one is a char, so the wrong quote is a type error there but only a different length or content in Python.",
        "f-strings (f\"{a:.2f} {b:>10}\") have been the default since 3.6: write the expression straight inside the braces and put the format specifier after a colon (precision, width, alignment, thousands separator). .format() and the ancient % operator are historical layers you must recognise in other people's code; write new code with f-strings.",
        "print defaults to line buffering when attached to a terminal, so each line appears as it is written; redirect to a file or pipe and buffering becomes block-sized, so output arrives in chunks. 'Why is my log empty' during debugging is usually the buffer and not a hang — fix it with flush=True, print(..., file=sys.stderr), or start the interpreter with -u.",
        "Error messages are readable: a Python traceback is read from the last line upwards and prints the offending source line, a gift from the interpreter; a C++ crash hands you an address and stack frames, and you need debug symbols to recover the line number.",
        "Python versus C++: C++ uses two different symbols to separate newline from flush, std::endl doing both and the escape for a bare newline. Python splits the same duty into two orthogonal arguments, end for the tail and flush for the buffer, so 'newline without flush' and 'flush without newline' are both expressible. Both languages separate 'write the content' from 'push it to the device'; one does it with distinct symbols, the other with parameters.",
        "input() and print() are a pair: the former always returns a string (p1-4 is devoted to it), so 'looks like a number on screen, behaves like a string in arithmetic' is the first trap planted by this lesson.",
        "Bridge: p1-3 introduces variables, where the relation between a name and its value overturns the C++ intuition that a variable is a box of memory; for now, drill output until it costs no thought."
      ],
      code: `import sys

name, score = "黄豆", 92.5
print("Hello, AGI")
print("多个参数", "逗号自动加空格")
# end 参数管结尾，默认是一个换行符
print("不换行", end="|")
print("接着同一行")
# sep 参数管分隔符
print("2026", "09", "24", sep="-")
# flush 参数管刷新：重定向到文件时才看得出它的价值
print("立刻可见", flush=True)
# f-string：花括号里是表达式，冒号后面是格式说明
print(f"{name} 的分数 {score:.1f}，宽 14 列右对齐->{score:>14.2f}<")
# 与 C++ 对照：std::endl 等于换行加刷新，裸换行符只换行
# Python 把这两件事做成了两个互不干扰的参数
print("写到 stderr 就不怕被重定向吞掉", file=sys.stderr)`,
      pit: "用 `print(a, b)` 打印完就以为「两个值贴在了一起」：其实默认 `sep=\" \"` 会插一个空格，判题或对比输出文件时常因此差一个空格而 WA；同理 `end` 默认是换行符，循环里忘了写 `end=\"\"` 就会打出一竖列。跨语言迁移时这条更常见：C++ 的 `cout << a << b;` 是紧贴的，Python 的 `print(a, b)` 中间有缝。",
      pit_en: "Assuming print(a, b) glues the two values together: the default sep is a single space, so judges and diff tools reject the output over one missing blank. Likewise end defaults to a newline, so a loop without end=\"\" prints one tall column. The cross-language version of this bites more often: cout << a << b is tight, print(a, b) has a seam.",
      ex: {
        q: "为什么把程序输出重定向到文件后，日志看起来「慢半拍」甚至空着？",
        a: "因为非终端输出走块缓冲，内容攒满缓冲区或进程结束才落盘；`flush=True`、写到 stderr 或用 `python -u` 都能让它立刻出去，而 `std::endl` 在 C++ 里做的是同一件事——只是它把换行和刷新绑成了一个动作。",
        q_en: "Why does the log look one step behind, or empty, once you redirect the program's output to a file?",
        a_en: "Because output to anything other than a terminal is block-buffered, so text lands only when the buffer fills or the process exits. flush=True, writing to stderr, or python -u all push it out immediately, and std::endl in C++ does the same job — it just fuses flushing to the newline."
      }
    },

    "p1-3": {
      min: 13,
      summary: [
        "Python 的变量是「贴在对象上的标签」，不是「装着值的盒子」：`a = 1` 让名字 a 指向一个 int 对象，`a = \"hi\"` 只是把标签撕下来贴到另一个对象上。这是动态类型的底层图景，也是后面所有「别名」问题的源头。",
        "四个基础类型要分清性质：int 是任意精度（不会回绕，代价是更占内存、运算更慢）、float 就是 C 的 double（IEEE 754，同样有 0.1+0.2≠0.3）、str 是不可变序列、bool 是 int 的子类（`True + True == 2` 合法，但这在生产代码里是可读性事故）。",
        "动态类型不等于「没有类型」：类型属于对象而不属于变量，`\"3\" + 3` 一定会报错，只是报错时机在运行时而不是编译时。查类型用 `isinstance(x, int)` 而不是 `type(x) == int`——后者会把 bool 判错、把子类判错。",
        "C++ 是静态类型：类型在编译期就定死，错了编不过，但优化器也因此知道得早；Python 把这份确定性换成灵活，把「发现错误」的责任交还给测试与运行时。两种取舍没有免费的那种。",
        "【Python 与 C++ 对照】同一个「从 1 累加到 10⁹ 再乘自己」：C++ 用 `int` 会溢出回绕（有符号溢出还是未定义行为），Python 的 int 会自动加长、结果一定对，但同样的循环慢几十倍——「Python 不会溢出」和「Python 慢」是同一枚硬币的两面，变长存储就是它的价格。",
        "CPython 会缓存小整数（-5 到 256 复用同一对象），于是 `is` 与 `==` 分道：`256 + 1 is 257` 可能为真、`1000 is 1000` 可能为假。规则只有一条就够：判值用 `==`，`is` 只用来和 `None` 比。",
        "类型注解（`def f(x: int) -> float:`、`items: list[int] = []`）从 3.5 起进入语言，运行时完全不检查，但 IDE 与 mypy 能提前抓错——给动态语言补一节静态类型课，是性价比最高的工程投资。",
        "命名与内置函数冲突是隐形事故：不要用 `list`、`dict`、`id`、`sum`、`max` 当变量名，那会遮蔽同名内置函数，症状诡异（「sum 突然不能调用了」）。PEP8 风格：变量与函数 snake_case、类 PascalCase、常量全大写。衔接 p1-4：接下来看数据怎么从外面进来。"
      ],
      summary_en: [
        "A Python variable is a label stuck on an object, not a box holding a value: a = 1 points the name at an int object, and a = \"hi\" just moves the label to a different object. That is the machinery behind dynamic typing and the origin of every aliasing bug later.",
        "Know which of the four basics behaves how: int has arbitrary precision (it never wraps, but costs more memory and time), float is exactly C's double (IEEE 754, so 0.1 + 0.2 != 0.3 there too), str is an immutable sequence, and bool is a subclass of int (True + True == 2 is legal, which in production code is a readability accident).",
        "Dynamic does not mean untyped: a type belongs to the object rather than the variable, so \"3\" + 3 always fails — only at run time instead of compile time. Test with isinstance(x, int) rather than type(x) == int, since the latter misjudges bool and every subclass.",
        "C++ is statically typed: types are fixed before compilation, wrong ones never build, and the optimiser profits from knowing early. Python trades that certainty for flexibility and hands the job of finding errors back to you, as tests and exceptions. Neither side of the trade is free.",
        "Python versus C++: sum 1 to 10^9 and multiply the result by itself and C++'s int wraps (signed overflow is undefined behaviour), while Python's int silently grows and returns the mathematically right answer — but the same loop runs tens of times slower. 'Python never overflows' and 'Python is slow' are two faces of one coin, and arbitrary-precision storage is the price.",
        "CPython caches small integers (the same object is reused from -5 to 256), which drives is and == apart: 256 + 1 is 257 may be true while 1000 is 1000 may be false. One rule suffices: compare values with == and reserve is for None.",
        "Type hints (def f(x: int) -> float:, items: list[int] = []) entered the language in 3.5 and are ignored at run time, yet IDEs and mypy use them to catch errors early — the best value-for-money way to bolt a little static typing onto a dynamic language.",
        "Shadowing a builtin is a silent accident: never name a variable list, dict, id, sum or max, because you then hide the builtin and get bizarre symptoms such as 'sum is suddenly not callable'. PEP 8 style: snake_case for names and functions, PascalCase for classes, ALL_CAPS for constants. Bridge to p1-4: next comes data arriving from outside."
      ],
      code: `# 变量是贴在对象上的标签，不是装值的盒子
a = 123
print(type(a).__name__, a.bit_length())
# 动态类型：换的是标签，不是盒子
a = "现在我是字符串"
print(type(a).__name__, len(a))
# 大整数不会溢出，这一行在 C++ 里必然回绕
big = 2 ** 100
print(big > 2 ** 64)
# 浮点仍是 IEEE 754 双精度，和 C++ 一样有表示误差
print(0.1 + 0.2 == 0.3, abs((0.1 + 0.2) - 0.3))
# is 比的是同一个对象，== 比的是值；只有和 None 比才该用 is
x = None
print(x is None, isinstance(True, int), bool([]), bool([0]))
# 类型注解只是提示，运行时一句也不检查
total: int = 0
def twice(n: int) -> int:
    return n * 2
print(twice(21), total)
# 与 C++ 对照：静态类型在编译期就挡住混用，动态类型要到这一行被执行才炸
# 好处是能写 list[dict[str, float]] 这种混合结构毫无摩擦，代价是测试不能省`,
      pit: "把 `is` 当「相等」用：`a is b` 判的是「同一个对象」，小整数被缓存时会给你正确答案，换个大数或字符串就突然 False——bug 只在数据变大时出现，最难复现。同族错误是把 `type(x) == int` 当真判（bool 也是 int 的子类，会误判）与用 `l`、`O`、`I` 做变量名（和 1、0 长一样）。",
      pit_en: "Using is as equality: a is b tests object identity, so cached small ints make it look right until a larger number or string turns it suddenly False — a bug that only appears when the data grows, which is the worst kind to reproduce. Sibling errors are type(x) == int as a real test (bool is a subclass of int, so it misjudges) and single-letter names like l, O and I that are indistinguishable from 1 and 0.",
      ex: {
        q: "为什么 `a = 1; a = \"hi\"` 在 Python 里合法，而在 C++ 里同样的写法直接编不过？",
        a: "因为 Python 的类型属于对象、变量只是名字，重新赋值只是换了标签指向；C++ 的类型属于变量，一个 `int a` 就是编译器分配好的固定宽度存储，不能中途变成字符串。前者灵活、后者可优化且能提前挡住错误。",
        q_en: "Why is 'a = 1; a = \"hi\"' legal in Python but a compile error in C++?",
        a_en: "In Python the type belongs to the object and a variable is only a name, so reassignment just moves the label; in C++ the type belongs to the variable, so an int declaration is a fixed-width piece of storage that cannot become a string. Flexibility versus early errors and better code generation."
      }
    },

    "p1-4": {
      min: 11,
      summary: [
        "`input()` 的返回值永远是字符串，不管屏幕上敲的是 12 还是 3.14——这是「我明明加了个数字怎么变拼接」这类错误的总根源；想要数字，必须显式 `int(input())` 或 `float(input())`。",
        "转换函数比想象中挑剔：`int(\" 12 \")` 合法（自动去首尾空白）、`int(\"1_000\")` 合法（下划线分组）、`int(\"12.5\")` 反而报错（不能从小数串直接得整数）、`int(\"1,000\")` 也报错。要容错就先 `strip()`，再用 `try/except ValueError` 兜住。",
        "一次读多个数的标准动作是 `a, b = map(int, input().split())`：`split()` 按任意空白切词，`map` 惰性地把 int 逐个套上去，左侧解包接住。读不定长的一行则用 `list(map(float, line.split()))`。",
        "【Python 与 C++ 对照】同一处「读两个整数」：C++ 的 `cin >> a >> b` 按声明类型自动解析，遇到非法字符会把流置入 fail 状态、之后的读全部失效却不抛异常（还要手动 `clear()`/`ignore()`）；Python 的 `input()` 什么都不猜，转换失败当场抛 ValueError，绝不留坏状态。前者「自动但会静默变坏」，后者「手动但一定大声报错」——这两句分别是两门语言读入 bug 的总纲。",
        "批量读入要换姿势：判题或大文件里 `sys.stdin.read().split()` 一次读全量再切词，比在循环里逐行 `input()` 快得多（`input()` 每次都有交互与提示开销）；读到结尾时 `input()` 抛 EOFError，用 read 全量取就完全绕开这个问题。",
        "绝对不要用 `eval(input())` 把用户输入当代码执行：它对 `\"__import__('os').system('rm -rf /')\"` 这类字符串毫无抵抗力。真要接受表达式，就自己解析或用只认字面量的 `ast.literal_eval`。",
        "数字以外的转换同样值得记：`int(\"ff\", 16)` 按进制解析、`hex(255)` 反向、`chr(65)` 与 `ord(\"A\")` 对应 C++ 的 char 与整数互转（但 `chr` 只吃 0 到 0x10FFFF）、`float(\"inf\")` 与 `float(\"nan\")` 直接给出特殊值。",
        "衔接：能读能写之后，p1-5 讲注释与风格——那是 Python 里少数「不写也能跑、写了才能协作」的东西。进入 py2 后本节教训会重演一次：`input().split()` 给你的永远是字符串列表，忘了转类型就在运算现场等着炸。"
      ],
      summary_en: [
        "input() always returns a string, whether the user typed 12 or 3.14 — the single root of every 'I added two numbers and got concatenation' bug. If you want a number, write int(input()) or float(input()) yourself.",
        "The converters are fussier than they look: int(\" 12 \") works (surrounding whitespace is dropped), int(\"1_000\") works (underscore grouping), but int(\"12.5\") raises (a decimal string is not an integer string) and int(\"1,000\") raises too. Be robust by stripping first and wrapping in try/except ValueError.",
        "The idiomatic way to read several values is a, b = map(int, input().split()): split() cuts on arbitrary whitespace, map lazily applies int to each piece, and tuple unpacking catches them. For a variable-length line use list(map(float, line.split())).",
        "Python versus C++ for the same 'read two integers': cin >> a >> b parses according to the declared types, and on a bad character puts the stream into a fail state where every later read silently fails unless you clear() and ignore() it by hand. Python's input() guesses nothing; a failed conversion raises ValueError right there and never leaves broken state behind. 'Automatic but silently rots' versus 'manual but always loud' is the summary of input bugs in each language.",
        "Change the technique for bulk input: in judges and large files, sys.stdin.read().split() slurps everything once and is far faster than calling input() inside a loop (each call pays interaction and prompt overhead), and it sidesteps the EOFError that input() raises at end of stream.",
        "Never run eval(input()) on user text: it happily executes something like an os.system call buried in the string. If you really must accept an expression, parse it yourself or use ast.literal_eval, which only understands literals.",
        "Conversions beyond decimal integers are worth knowing: int(\"ff\", 16) parses by base, hex(255) goes the other way, chr(65) and ord(\"A\") mirror C++'s char-to-int round trip (with chr restricted to 0..0x10FFFF), and float(\"inf\") or float(\"nan\") give you the special values directly.",
        "Bridge: with reading and writing working, p1-5 covers comments and style — one of the few things in Python that runs either way but decides whether others can collaborate with you. The lesson of this section returns in py2: input().split() always hands you strings, and forgetting to convert detonates at the arithmetic site."
      ],
      code: `# input 的返回值永远是字符串，屏幕上看着像数字也没用
raw = input("输入一个整数：")
# 忘了转换就会变成字符串拼接，这是本章最高频的错误
n = int(raw)
print(n + 3)
# 一行读两个数：split 切词、map 惰性转换、左侧解包
a, b = map(int, "12 34".split())
print(a + b)
# 转换失败抛 ValueError，用 try 兜住而不是让程序崩
try:
    x = int("12.5")
except ValueError as err:
    print("这样转不行：", err)
# 空白与进位制：这些都能转，注意逗号不行
print(int(" 42 "), int("ff", 16), int("1_000"))
# 与 C++ 对照：cin 会按声明类型自动解析，失败时只把流置为 fail 状态
# Python 什么都不猜，出错直接抛异常，绝不会留下半坏的状态继续跑
print("当前读到的所有词：", "a 1 b 2".split())`,
      pit: "`input()` 拿到的字符串直接参与运算：`\"12\" + 3` 抛 TypeError 还算客气，`\"12\" + \"3\"` 得到 `\"123\"` 才是杀手——它不报错，还长得像答案。判题里更常见的是漏了 `int()` 之后排序变成字典序（`\"10\" < \"9\"`）。习惯做法是读入这一行立刻转换，绝不让字符串活到下一个语句。",
      pit_en: "Feeding input()'s string straight into arithmetic: \"12\" + 3 raising TypeError is the polite case; \"12\" + \"3\" yielding \"123\" is the killer, because it runs, looks plausible and is wrong. In judges the same slip turns a sort into lexicographic order, where \"10\" < \"9\". Convert on the very line you read, and never let an unparsed string survive to the next statement.",
      ex: {
        q: "为什么 Python 宁可让你多写一次 `int()`，也不像 C++ 那样自动按类型解析输入？",
        a: "因为 Python 的输入函数与变量的动态类型一致：解释器在读入时刻并不知道、也不猜你打算把它当什么用，把意图写成显式转换就消除了歧义；C++ 必须依赖声明类型来解析，代价是解析失败时只留下一个安静的坏流状态。",
        q_en: "Why does Python make you write int() again instead of parsing input by type the way C++ does?",
        a_en: "Because that fits Python's dynamic model: at read time the interpreter neither knows nor guesses what you intend the text to be, so making the intent explicit removes all ambiguity. C++ must parse against a declared type, and the price is that a failed parse leaves a quietly broken stream instead of an error."
      }
    },

    "p1-5": {
      min: 11,
      summary: [
        "`#` 到行尾就是注释，Python 没有 C++ 那种跨行的块注释语法；要大段说明要么每行一个 `#`，要么写一个不赋值的三引号字符串（习惯上当块注释用，但它其实是会被求值的字面量）。",
        "文档字符串（docstring）写在模块、类或函数的第一条语句位置：`f.__doc__` 读得到、`help(f)` 会显示、Sphinx 等文档工具靠它生成 API 手册——C++ 里没有对应物，那边要写 Doxygen 注释再跑外部工具链。",
        "docstring 的通行格式是一行摘要（祈使句、首字母大写、句号结尾）+ 空行 + 详细说明，参数与返回按 Google 或 NumPy 风格列出来。给公开接口写，不给 `i += 1` 写。",
        "注释只解释「为什么」与「哪里有坑」，代码本身解释「是什么」；复述式注释（把代码用中文再说一遍）是最先腐烂、最爱骗人的一种——它改不动，但会一直声称代码在干别的事。",
        "PEP8 的硬约束就那几条：缩进 4 空格、一行控制在 79~100 字符内、运算符两侧留空格、import 分「标准库 / 第三方 / 本地」三组放文件顶部；别用 `l`、`O`、`I` 做变量名（和 1、0 难分辨）。",
        "【Python 与 C++ 对照】C++ 用花括号决定代码块，缩进纯粹是给程序员看的装饰；Python 的缩进**就是语法本身**。所以「Tab 与空格混用」在 C++ 里顶多算难看，在 Python 里直接 IndentationError/TabError，而且报错行常常落在很后面的一行。团队统一 4 空格、编辑器打开「显示空白字符」，是唯一稳的解法。",
        "命名风格是两个世界的路标：Python 一律 snake_case 的函数与变量、PascalCase 的类、全大写常量；C++ 常见 PascalCase 类型 + camelCase 或 snake_case 成员。跨语言读代码时，光看名字写法就能判断「我现在在哪条路线上」。",
        "工具链把风格问题彻底外包：`black` 统一排版、`ruff` 或 `flake8` 查 PEP8、`mypy` 查类型注解、`isort` 排 import——职责相当于 C++ 的 clang-format 加 clang-tidy。风格交给工具，人和人之间才只剩下逻辑之争。衔接 p1-6：下一节把 py1 五节与 C++ 的对照点收成一张清单。"
      ],
      summary_en: [
        "A hash to end of line is a comment, and Python has no block-comment syntax like C++'s slash-star. For long prose, either put a hash on every line or write an unassigned triple-quoted string — conventionally used as a block comment, though it really is an evaluated literal.",
        "A docstring sits as the first statement of a module, class or function: f.__doc__ returns it, help(f) displays it, and tools like Sphinx build API manuals from it. C++ has no equivalent; there you write Doxygen comments and then run a separate toolchain.",
        "The conventional docstring shape is a one-line summary (imperative mood, capitalised, ending with a period), a blank line, then detail, with parameters and returns listed in Google or NumPy style. Write it for public interfaces, not for i += 1.",
        "Comments explain why and where the traps are; the code explains what. Restating the code in prose is the worst kind — it cannot keep up with edits and goes on insisting the code does something else.",
        "PEP 8's hard rules are few: four-space indentation, lines within roughly 79 to 100 characters, spaces around operators, imports grouped as standard library, third party, local at the top of the file; and no single-letter names l, O or I, which are indistinguishable from 1 and 0.",
        "Python versus C++: C++ decides blocks with braces and treats indentation as decoration for humans, while in Python indentation is the syntax itself. Mixing tabs and spaces is therefore merely ugly in C++ but a hard IndentationError or TabError in Python, often reported on a line far below the culprit. One team-wide four-space rule plus visible whitespace in the editor is the only stable fix.",
        "Naming style is a border sign between the two worlds: Python uses snake_case for functions and variables, PascalCase for classes, ALL_CAPS for constants; C++ commonly pairs PascalCase types with camelCase or snake_case members. Reading code across languages, the spelling alone tells you which track you are on.",
        "The toolchain outsources style completely: black formats, ruff or flake8 check PEP 8, mypy checks annotations, isort orders imports — the counterparts of clang-format and clang-tidy. Once tools own the style, the only arguments left between people are about logic. Bridge to p1-6: the next lesson compresses py1's five comparisons into one checklist."
      ],
      code: `# 单行注释：井号到行尾，Python 没有跨行的块注释语法

def bmi(weight: float, height: float) -> float:
    """计算身体质量指数。

    这段文档字符串会被 help(bmi) 显示，也能被 bmi.__doc__ 读到。
    参数含义、单位与边界条件写在这里，而不是散落在注释堆里。
    """
    # 为什么写成幂而不是乘法：改公式时只有一处需要动
    return weight / height ** 2

# 反例式的教训：注释写着「初始化累加器」，而下一行早已换成了别的变量
total = 0
MAX_RETRY = 3
# PEP8：模块级常量全大写，函数与变量用蛇形命名，类用帕斯卡命名
print(bmi(70.0, 1.75))
print(bmi.__doc__.splitlines()[0])
# 与 C++ 对照：那边的块由花括号决定，这边的块由缩进决定
# 所以缩进错一格在 C++ 里只是难看，在这里是语法错误或逻辑错位`,
      pit: "缩进「看起来对齐」但混用了 Tab 与空格：Python 3 直接拒绝这种不一致（TabError），而更阴险的是同用空格时错一格却不报错——`if` 块里少缩进一行的那句变成了「循环外执行一次」，程序跑得很欢，结果全错。C++ 里同样的错位只是难看，因为语义由花括号决定；这就是为什么 Python 必须开编辑器「显示空白字符」并把设置写进 `.editorconfig`。",
      pit_en: "Indentation that looks aligned but mixes tabs and spaces: Python 3 rejects the inconsistency outright with TabError, and the subtler failure is spaces-only with one level off — no error, but the statement you meant to be inside the block now runs once outside it, cheerfully producing wrong results. The same misalignment in C++ is only cosmetic because braces own the semantics, which is why a Python project must show whitespace in the editor and pin it in .editorconfig.",
      ex: {
        q: "为什么 Python 把注释性说明做成「文档字符串」这种语言特性，而 C++ 只给注释？",
        a: "因为 Python 是运行时可自省的语言：函数与类是对象，第一段字符串字面量会被解释器收进 `__doc__` 属性，于是 `help()`、IDE 悬浮提示和文档生成器都能在**运行时**读到它；C++ 的注释在预处理阶段就被抹掉，只能靠外部工具抽取。",
        q_en: "Why does Python make documentary comments a language feature while C++ only has comments?",
        a_en: "Because Python is introspectable at run time: functions and classes are objects and their leading string literal is stored in the __doc__ attribute, so help(), IDE tooltips and doc generators can read it while the program runs. C++ comments are erased during preprocessing, so anything resembling them needs an external extractor."
      }
    },

    "p1-6": {
      title: "综合重构：Python 起步与 C++ 对照清单",
      title_en: "Synthesis: A Python Start-Up Checklist, Compared with C++",
      min: 15,
      target: "能一次跑通「环境确认 → 写文件 → 运行 → 读入数据 → 输出结果」的完整回路，并对手头这个任务说清该用 Python 还是 C++、理由是什么。",
      target_en: "Run the whole loop end to end — confirm the interpreter, write a file, execute it, read data, emit output — and say which language the task at hand belongs to, with a reason.",
      summary: [
        "起步回路只有五步，但每一步都有一个专属坑：① `python -V` 与 `which python` 确认解释器是谁；② 文件用 `.py` 且存成 UTF-8（Python 3 默认源码即 UTF-8，Windows 上老编辑器另存为 GBK 会立刻报编码错）；③ 用 `python 文件名.py` 而不是在交互解释器里贴代码；④ 输出交给 `print`，需要立刻看到就加 `flush=True`；⑤ 读入交给 `input()`，并且**当场**转类型。",
        "「同一件事的两种写法」速查第一组（输入输出）：C++ 的 `cout << a << ' ' << b << endl;` 对 Python 的 `print(a, b)`（自动加空格、自动换行）；`cin >> a >> b` 对 `a, b = map(int, input().split())`；格式化 `printf(\"%.2f\", x)` 对 `f\"{x:.2f}\"`。两边的差异都不在能力，而在「谁替你操心分隔与类型」。",
        "「两种写法」第二组（程序骨架）：C++ 必须有 `#include`、`int main()`、返回码与编译步骤；Python 文件里的语句就是「主程序」，从上往下执行，函数定义不执行、调用才执行。所以 Python 里那句 `if __name__ == \"__main__\":` 是「这段只在我直接跑它时执行」，等价于 C++ 里 main 的角色，但它是约定而不是强制。",
        "「两种写法」第三组（类型与内存）：C++ 的 `int` 是 4 字节、溢出回绕（且是有符号溢出未定义行为）、`double` 与 Python 的 float 同构；Python 的 int 变长不溢出、变量是标签、复制要靠显式动作。这一组差异会在 py2 的列表章节长成最大的那个坑，现在先把「赋值不等于复制」记成肌肉记忆。",
        "什么时候该切换到另一条路线，判据写成三条就够用：① 一次运行的墙钟时间是不是产品的一部分（是 → C++）；② 数据是不是必须装进固定内存、或者要被别的程序链接（是 → C++）；③ 迭代频率是不是远高于运行成本（是 → Python）。三条冲突时，先用 Python 跑通并量一遍，再决定把哪一段搬去 C++。",
        "本批高频翻车复盘：pip 与 python 不是同一个解释器（ModuleNotFoundError 装了三次）、`input()` 忘了转类型（拼接不报错）、把 `is` 当相等（大整数才翻车）、用内置名当变量（`sum` 突然不能调用）、Tab 与空格混用（TabError 或错位）、`print(a, b)` 里那个多余空格（判题 WA）、`eval(input())`（安全洞）。这七条都能在这五节里找到出处。",
        "自测方法就一个：把 py1 的代码全部关掉重打一遍，然后刻意制造四种异常输入（空行、纯空格、带小数点的整数、带逗号的数字），看自己是不是每一处都用 `try/except` 或提前 `strip()` 挡住了。能在 10 分钟内把这段回路默写出来，说明起步合格。",
        "衔接 py2：容器与控制流。届时「Python 与 C++ 对照」会从一条要点升级成主线——列表对应 vector 但语义是引用、字典对应 unordered_map 但键值语义完全不同、for 遍历的是元素而不是下标；p2-6 会把两张表合成一张总表。"
      ],
      summary_en: [
        "The start-up loop has five steps and each has its own trap: confirm the interpreter with python -V and which python; save the file as .py in UTF-8 (Python 3 treats source as UTF-8 by default, so an editor that saves GBK on Windows fails instantly); run it as python file.py rather than pasting code into the interactive prompt; print output, adding flush=True when it must appear now; and read with input(), converting the type on that very line.",
        "Comparison sheet one, input and output: C++'s cout chain maps to print(a, b), which inserts the separator and the newline for you; cin >> a >> b maps to a, b = map(int, input().split()); printf(\"%.2f\", x) maps to an f-string with :.2f. The difference is not capability but who takes responsibility for separators and types.",
        "Sheet two, program skeleton: C++ demands includes, int main(), a return code and a build step; in Python the statements in the file are the main program, executed top to bottom, with definitions inert until called. So the if __name__ == \"__main__\" guard is the convention that plays main's role — a promise, not a compiler-enforced boundary.",
        "Sheet three, types and memory: a C++ int is four bytes, wraps on overflow and signed overflow is undefined behaviour, while double matches Python's float exactly; Python's int grows without bound, a variable is a label and copying must be asked for explicitly. This group blossoms into py2's biggest pitfall with lists, so engrave 'assignment is not copying' now.",
        "Three tests decide when to switch tracks: is wall-clock time per run part of the product (then C++); must the data fit fixed memory or be linked by other programs (then C++); does iteration cost dominate run cost (then Python). When the tests conflict, build it in Python first, measure, and only then move the hot part.",
        "Retrospective on this batch's recurring failures: pip and python pointing at different interpreters (ModuleNotFoundError survived three installs), input() left unconverted (concatenation that does not raise), is used as equality (fails only for big ints), builtins shadowed by variables (sum suddenly uncallable), tabs mixed with spaces (TabError or silent misalignment), the extra space inside print(a, b) (judged wrong answer), and eval(input()) as a security hole. All seven trace back to these five lessons.",
        "The only honest self-test: retype every py1 snippet from memory, then feed it four hostile inputs — an empty line, pure spaces, a decimal-looking integer, a comma-grouped number — and check that strip() or try/except catches each one. Reproducing the loop in ten minutes means the start-up is complete.",
        "Bridge to py2: containers and control flow, where the C++ comparison is promoted from one bullet to the main thread — list is vector-shaped but reference-semantics, dict is unordered_map-shaped but with different key and value rules, for yields elements rather than indices. p2-6 then merges both sheets into one master table."
      ],
      code: `import sys

# 起步回路的完整一遍：确认环境、读入、转换、计算、输出
# 第一步在 shell 里做：python -V 与 which python，两个都要看一眼
def read_numbers(prompt: str) -> list:
    """读一行并转成浮点数列表；失败就返回空列表而不是抛出去。"""
    try:
        line = input(prompt)
    except EOFError:
        return []
    # 注意：split 之后每个元素仍是字符串，必须 map 转换
    return list(map(float, line.replace(",", " ").split()))

def main() -> int:
    print(f"解释器：{sys.version_info.major}.{sys.version_info.minor}")
    nums = read_numbers("输入若干数字，逗号或空格分隔：")
    if not nums:
        # 与 C++ 对照：cin 失败时只会静默留下坏流，这里必须自己判空
        print("没读到数字，退出码 1", file=sys.stderr, flush=True)
        return 1
    total = sum(nums)
    print(f"个数 {len(nums)}，和 {total:.2f}，均值 {total / len(nums):.2f}")
    # 整数在 Python 里不会溢出，这一行在 C++ 里必须换 long long
    print("指数爆炸演示：", 2 ** 64)
    return 0

# 只有直接运行本文件时才执行 main，被 import 时不执行
if __name__ == "__main__":
    sys.exit(main())`,
      pit: "把 Python 当「不用想类型的 C++」写：所有语法都对、程序照跑，但类型错误只在特定输入下才出现（例如某一行数据里混进一个字符串），于是测试环境一切正常、生产第一次遇到脏数据就崩。对策是**在入口就把类型钉死**：读入立刻转换、函数写类型注解、跑一遍 `mypy`，而不是指望动态类型「反正会报错」。",
      pit_en: "Writing Python as 'C++ without type thinking': every line is legal, the program runs, and the type error only surfaces on a specific input (one string that slipped into a numeric row), so tests pass and the first dirty record in production crashes. The countermeasure is nailing types at the boundary — convert on read, annotate signatures, and run mypy — not trusting dynamic typing to complain loudly in time.",
      ex: {
        q: "为什么 `if __name__ == \"__main__\":` 在 Python 里几乎是标配，而 C++ 不需要类似写法？",
        a: "因为 Python 里「模块被 import」和「文件被直接运行」用的是同一份顶层代码，解释器会真的执行它；这个判断让文件既能当脚本跑、又能当库被别人 import 而不产生副作用。C++ 没有「import 就执行文件」这件事，入口只由链接器认 main，所以不需要这层区分。",
        q_en: "Why is the if __name__ == \"__main__\" guard idiomatic Python when C++ needs nothing similar?",
        a_en: "Because a Python module executes its top-level code identically whether it is imported or run directly, so the guard lets one file act as both a script and an importable library without side effects. C++ has no 'import runs the file' step at all — the linker simply looks for main — so no such distinction is required."
      }
    },

    /* ===================== py2 数据类型与控制流 ===================== */
    "p2-1": {
      min: 12,
      summary: [
        "`+ - *` 与 C++ 完全一致；不同处在于幂：Python 有专门的 `**` 运算符（`2 ** 10` 是 1024，且**右结合**，`2 ** 3 ** 2` 是 512），`** 0.5` 就是开平方——这些都是 C++ 里要请 `std::pow` 出山才能做的事。",
        "`/` 永远返回 float（`4 / 2` 是 2.0 而不是 2），想要整除必须显式写 `//`。这条规则一举消灭了 C++ 里「两个 int 相除静默截断」的头号 bug，代价是你每次要整数都得自己写对。",
        "`//` 是**向负无穷**取整而不是向零截断：`-7 // 2 == -4`（C++ 里 `-7 / 2 == -3`）；配套地，`%` 的结果符号跟随**除数**：`-7 % 2 == 1`（C++ 里是 `-1`）。做「奇偶判断、分桶、环形索引」时如果数据可能为负，这两条差异会让你移植过去的代码悄悄错一半。",
        "内置函数比运算符更多：`abs / min / max / sum / divmod / round`。特别注意 `round(2.5) == 2`——Python 3 用「银行家舍入」（.5 时向偶数靠），而 C++ 的 `std::round` 永远远离零；同名的「四舍五入」在两种语言里根本不是同一个函数。",
        "float 就是 C++ 的 double：IEEE 754、约 15~16 位有效数字、`0.1 + 0.2 != 0.3`、有 `inf` 也有 `nan`（而且 `nan != nan`）。要精确十进制用 `decimal.Decimal`，涉及金额就直接存整数「分」——这个结论在两条路线上一字不改。",
        "int 是任意精度：`2 ** 1000` 当场算得出来，永不溢出，密码学与组合数靠这条活着。但要用 NumPy 加速时，元素会退化成定长 `int64`，**溢出又回来了**——「Python 不溢出」只在纯 Python 对象上成立，这一点踩过一次就忘不了。",
        "【Python 与 C++ 对照】同一个「第 100 个斐波那契数」：C++ 的 `long long` 在第 93 项就开始回绕，给你一个负数；Python 的 int 自动加长，答案正确。反过来，同一个 `n = 10⁸` 的求和循环：C++ 零点几秒，纯 Python 十几秒。数值语义 Python 更安全、数值性能 C++ 更实在——这就是两条路线最朴素的分工。",
        "优先级与结合性照旧要括号：`-2 ** 2 == -4`（幂先于一元负号），`//` 与 `*` 同级、从左到右，`**` 右结合。记不住就加括号——省下的括号最后都会变成排查时间。衔接 p2-2：数字说完，开始处理「一串字符」。"
      ],
      summary_en: [
        "Addition, subtraction and multiplication behave exactly as in C++; the difference is exponentiation, which has its own ** operator (2 ** 10 is 1024 and it is right-associative, so 2 ** 3 ** 2 is 512) and ** 0.5 for a square root — all of which in C++ require calling std::pow.",
        "Slash always yields a float (4 / 2 is 2.0, not 2), and integer division must be written explicitly with the floor operator. This single rule deletes C++'s number-one bug, silent truncation between two ints, at the price of making you type the right operator every time you want a quotient that is an int.",
        "Floor division rounds toward minus infinity, not toward zero: -7 // 2 is -4 where C++ gives -3, and modulo follows the sign of the divisor, so -7 % 2 is 1 where C++ gives -1. Parity tests, bucketing and ring-buffer indices written for negative inputs are the places where a ported C++ snippet quietly goes wrong half the time.",
        "Built-ins outnumber operators: abs, min, max, sum, divmod and round. Note especially round(2.5) == 2 — Python 3 uses banker's rounding, snapping halves to the nearest even number — while C++'s std::round always rounds away from zero, so 'rounding to nearest' is not the same function in the two languages.",
        "A float is exactly a C++ double: IEEE 754, about 15-16 significant digits, 0.1 + 0.2 != 0.3, with inf and also nan (and nan != nan). Use decimal.Decimal when you need exact decimals, and store money in integer cents — that conclusion is identical on both tracks.",
        "int has arbitrary precision, so 2 ** 1000 comes out exactly and cryptography and combinatorics depend on it. But once you accelerate with NumPy the elements degrade to fixed-width int64 and overflow returns — 'Python never overflows' holds only for pure Python objects, a lesson nobody forgets twice.",
        "Python versus C++: the 100th Fibonacci number overflows a C++ long long from about the 93rd term onwards and hands back a negative, while Python's int just grows and stays correct. Conversely, a sum over 10^8 items takes a fraction of a second in C++ and tens of seconds in plain Python. Safer numeric semantics on one side, real numeric performance on the other — the plainest division of labour between the two tracks.",
        "Precedence still needs parentheses: -2 ** 2 is -4 because exponentiation binds tighter than unary minus, floor division shares a level with multiplication and goes left to right, and the power operator goes right to left. When in doubt, add brackets; the parentheses you skip are paid back in debugging time. Bridge to p2-2: numbers done, now a run of characters."
      ],
      code: `# 幂与开平方：C++ 里要请 std::pow，这里直接是运算符
print(2 ** 10, (2 ** 10) ** 0.5, 2 ** 3 ** 2)
# 斜杠永远给浮点数，整除要用双斜杠运算符
print(4 / 2, 4 // 2, type(4 / 2).__name__)
# 整除向负无穷取整，余数符号跟除数：与 C++ 的向零截断不同
print(-7 // 2, -7 % 2)
# round 是银行家舍入，半奇数会靠向偶数
print(round(2.5), round(3.5), round(-2.5))
# 浮点仍有表示误差；要精确十进制用 Decimal，金额存成整数分
print(0.1 + 0.2, abs(0.1 + 0.2 - 0.3) < 1e-12)
# int 任意精度：这一行在 C++ 里必然回绕成负数
print(2 ** 64 + 1)
# 与 C++ 对照：同一段循环求和，C++ 零点几秒，纯 Python 要十几秒
# 数值语义这边更安全，数值性能那边更实在，这就是两条路线的分界
print(-2 ** 2, 7 / 2, 7 // 2, divmod(7, 2))`,
      pit: "把 C++ 的「整数除法自动截断」习惯搬过来：`(n / 2)` 写成 `n / 2` 之后拿到的是 3.0 而不是 3，接下来它被送去当列表下标 —— TypeError: list indices must be integers。反过来更阴险：负数场景下 `//` 与 C++ 的 `/` 取整方向不同，用 `(i % n)` 做环形索引时，`i = -1` 在 Python 里得到合法的最后一格、在 C++ 里得到 -1（越界）。跨语言移植任何带取整/取模的代码，第一件事是拿负数测一遍。",
      pit_en: "Carrying over C++'s 'integer division truncates for free' habit: n / 2 now yields 3.0 instead of 3, and the next place it is used is a list index — TypeError: list indices must be integers. The negative case is nastier, because // floors while C++ truncates toward zero, so i % n with i = -1 gives you a legal last slot in Python but -1 (out of bounds) in C++. When porting any rounding or modulo code between the languages, test negative operands first.",
      ex: {
        q: "为什么 Python 要故意让 `/` 永远返回浮点数，而不像 C++ 那样「两个整数相除得整数」？",
        a: "因为「1/2 == 0」是 C++ 新手 bug 排行榜第一名的来源，Python 选择把截断这个决定权显式交给写代码的人（想用整除就写双斜杠），用一次额外按键换掉一整类静默错误；代价是想要整数时必须自己写对，以及别忘了 `//` 的取整方向和 C++ 不一样。",
        q_en: "Why does Python deliberately make '/' always return a float instead of C++'s 'int divided by int yields int'?",
        a_en: "Because 1/2 == 0 tops the chart of beginner bugs in C++, so Python hands the truncation decision back to the author explicitly — write the floor operator if you meant it — trading one extra keystroke for a whole class of silent errors. The cost is that you must type the floor operator correctly, and remember that its rounding direction differs from C++."
      }
    },

    "p2-2": {
      min: 13,
      summary: [
        "str 是**不可变**字符序列：`s[0]` 取到的是一个新建的单字符 str（不是引用），任何「修改」都会产生新对象，`s[0] = \"x\"` 直接 TypeError。真要改，就先 `list(s)`、改完再 `\"\".join(...)`。",
        "切片 `s[start:stop:step]` 含头不含尾；越界不报错而是自动截短，所以 `s[3:100]` 是安全的；`step` 为负就是反向，`s[::-1]` 是标准反转写法；索引可以是负数，`s[-1]` 是最后一个字符。",
        "常用方法成组记：`split()/rsplit()`（不传参时按任意空白切并丢掉空串）、`join()`（注意主语是**分隔符**：`\",\".join(parts)`）、`strip()/lstrip()/rstrip()`、`startswith/endswith`（可以传元组一次判多个）、`replace/find/count/splitlines`。`upper/lower/casefold` 里做大小写无关匹配要用 `casefold`。",
        "编码是 Python 3 与 C++ 分岔最大的地方：`str` 是 Unicode 文本（一串码点），`bytes` 才是字节。`len(\"中文\") == 2` 但 `len(\"中文\".encode(\"utf-8\")) == 6`；读写文件要显式 `open(p, encoding=\"utf-8\")`，因为 Windows 上的默认编码不是 UTF-8，不写就会在换机器时炸。",
        "【Python 与 C++ 对照】C++ 的 `std::string` 存的是**字节**（通常装着 UTF-8 编码的文本），`size()` 给字节数、`s[i]` 给一个 `char`，所以「按字符遍历中文」在 C++ 里必须自己解 UTF-8，而在 Python 里天然正确。同一条字符串，两边「长度」的定义就不一样——这是所有跨语言文本处理 bug 的总纲。",
        "另一处对照同样关键：Python 的下标与切片越界会抛 `IndexError` 或直接截短，C++ 的 `v[i]`/`s[i]` 越界是**未定义行为**（只有 `.at()` 会抛）。Python 这份保险不是免费的——它来自每次访问前后的边界检查与对象协议，正是运行时开销的一部分来源。",
        "循环里做 `s += x` 是 O(n²)：str 不可变，每次拼接都要整体复制一遍。正确写法是 `parts.append(x)` 最后 `\"\".join(parts)`，只复制一次。这与 C++ 里 `std::string` 靠 `reserve`/倍增容量做均摊增长是同一个问题，区别是 C++ 替你把均摊做了、Python 没有。",
        "不可变的第二个后果是「别名安全」：对 str 而言 `a = b` 之后谁也改不动谁（因为根本没有「改」这条路），所以字符串不会出 py2-3 那种事故。格式化优先 f-string（`f\"{s:>10}|{n:05d}\"`），需要模板时再退回 `.format()`。衔接 p2-3：接下来正式进入可变容器，也就是 Python 第一课「赋值不是拷贝」。"
      ],
      summary_en: [
        "str is an immutable character sequence: s[0] returns a freshly built one-character string rather than a reference, any 'modification' creates a new object, and assigning into s[0] raises TypeError outright. To really edit, convert with list(s), change that, and join it back.",
        "Slicing s[start:stop:step] includes the start and excludes the stop; out-of-range bounds are clipped instead of raising, so s[3:100] is safe; a negative step reverses, which makes s[::-1] the idiomatic reversal; and indices may be negative, with s[-1] the last character.",
        "Learn the methods in families: split/rsplit (with no argument they cut on arbitrary whitespace and drop empty pieces), join (note that the subject is the separator), strip/lstrip/rstrip, startswith/endswith (both accept a tuple to test several prefixes at once), replace/find/count/splitlines. For case-insensitive matching use casefold, not lower.",
        "Encoding is where Python 3 and C++ diverge most: str is Unicode text, a sequence of code points, and bytes is what holds bytes. len of a two-character Chinese string is 2 but its UTF-8 encoding is 6 bytes, and files must be opened with an explicit encoding='utf-8' because the Windows default is not UTF-8 — otherwise it breaks on someone else's machine.",
        "Python versus C++: a C++ std::string stores bytes (typically UTF-8-encoded text), so size() counts bytes and s[i] yields a char, meaning character-wise iteration over Chinese text requires manual UTF-8 decoding there while Python gives it for free. The two languages do not even share a definition of 'length' for the same text, which is the master key to cross-language string bugs.",
        "The second comparison matters just as much: an out-of-range index or slice in Python raises IndexError or silently clips, whereas v[i] or s[i] past the end in C++ is undefined behaviour (only .at() throws). That insurance is not free — it is paid for by bounds checks and the object protocol on every access, which is part of the runtime overhead.",
        "s += x inside a loop is O(n^2): strings are immutable, so each concatenation copies everything built so far. Append to a list and join once at the end instead. This is the same problem C++ solves with std::string's doubling capacity and reserve; the difference is that C++ gives you amortised growth and Python does not.",
        "Immutability's second consequence is safe aliasing: after a = b for strings neither side can change, because there is no mutating operation to call, so the accident waiting in p2-3 cannot happen here. Prefer f-strings for formatting and fall back to .format() when you need a reusable template. Bridge to p2-3: mutable containers next, where assignment turns out not to be copying."
      ],
      code: `s = "Hello, 世界"
# 索引与负索引：越界会抛异常，而不是像 C++ 那样读到脏内存
print(s[0], s[-1])
# 切片含头不含尾，越界的另一端会被自动截短
print(s[7:], s[0:5:2], s[3:100])
# 步长为负就是反向，这是最地道的反转写法
print(s[::-1])
# 字符串不可变：想改就先转 list，改完再拼回去
chars = list(s)
chars[0] = "h"
print("".join(chars))
# 编码分岔：str 是文本、bytes 才是字节，两者的长度不是一回事
print(len(s), len(s.encode("utf-8")), len("中"))
# 循环里拼接是平方代价，追加到列表再 join 才是线性
parts = []
for w in "a b   c".split():
    parts.append(w.upper())
print("-".join(parts))
# 与 C++ 对照：std::string 存字节、越界访问是未定义行为
# Python 的 str 是码点序列、越界安全，保险费收在运行时开销里
print("csv" in s.lower(), s.replace("世界", "AGI"), ",".join(["x", "y"]))`,
      pit: "在 Windows 上不写 `encoding=\"utf-8\"` 就读文件：本地用 GBK 默认编码跑得好好的，换到 Linux 服务器或同事机器上立刻 `UnicodeDecodeError`；反过来写出去的文件也可能带上 BOM 或 CRLF，被下一个程序读成多出来的字符。规矩只有一条：**只要文件里有非 ASCII 文本，就在 `open()` 里把编码写死**，读文本用 `newline=\"\"` 或默认按平台处理行尾时要心里有数。",
      pit_en: "Reading files without encoding='utf-8' on Windows: everything works locally because the default is GBK, then the same script dies with UnicodeDecodeError on a Linux server or a colleague's laptop; the file you wrote may equally carry a BOM or CRLF that the next reader sees as extra characters. The one rule is to pin the encoding in open() whenever non-ASCII text is involved, and to know what your newline handling is doing.",
      ex: {
        q: "为什么 `len(\"中文\")` 是 2，而文件在磁盘上占了 6 个字节？这两种「长度」分别对应 C++ 里的什么？",
        a: "因为 Python 的 str 存的是码点（每个人类字符一个元素），而文件里存的是 UTF-8 编码后的字节，中文常用 3 字节编一个；对应到 C++，前者要自己解码计数才拿得到，后者正是 `std::string::size()` 给的那个数——所以 C++ 里数「字数」必须显式做编码转换。",
        q_en: "Why is len of a two-character Chinese string 2 while the same text occupies 6 bytes on disk, and what do those two lengths correspond to in C++?",
        a_en: "Because a Python str holds code points, one element per human character, whereas a file stores UTF-8-encoded bytes and a Chinese character usually takes three; in C++ the second number is exactly what std::string::size() returns, and the first one you can only get by decoding explicitly — which is why counting characters in C++ means doing the encoding conversion yourself."
      }
    },

    "p2-3": {
      min: 13,
      summary: [
        "list 是「存放引用的可变有序序列」，可以混装任意类型。它的形状更像「指针数组」而不是「值数组」：元素本体是堆上的对象，槽位里只有指针——这解释了为什么 append 便宜、为什么大列表比同规模的 `std::vector<int>` 占几倍内存、为什么遍历时会指针追逐。",
        "复杂度按「尾快手慢」记：`append` 均摊 O(1)（同样是倍增扩容，和 vector 一回事）、`pop()` O(1)；但 `pop(0)` 与 `insert(0, x)` 要整体搬，是 O(n)——需要队列就用 `collections.deque`（两端都 O(1)），别拿 list 假装队列。索引 O(1)、切片 O(切片长度)、`in` 是 O(n) 线性扫（换成 set/dict 才是 O(1)）。",
        "推导式 `[f(x) for x in seq if cond]` 是 map + filter 的可读写法：比手写 append 循环略快（不用反复查方法名）、比 `list(map(lambda ...))` 好读。纪律是一条：一层转换加一层过滤可以写，嵌套三层或里面塞 try 就退回 for。",
        "【Python 与 C++ 对照】C++ 里 `vector<int> b = a;` 是**深拷贝**（真的复制 n 个 int，改 b 不影响 a）；Python 里 `b = a` 只是给同一个 list 多贴一张标签，`b[0] = 9` 会把 a 一起改掉。要一份独立的必须显式写：`a.copy()`、`a[:]` 或 `list(a)` 是浅拷贝（新容器、元素仍共享），嵌套结构要 `copy.deepcopy`。这是从 C++ 转过来最惨的一课，也是面试最爱考的一课。",
        "浅拷贝只复制一层，所以内层仍共享：`matrix = [[0]*3]*3` 造出的「三行」其实是同一个 list 对象的三个标签，改 `matrix[0][0]` 三行全变；正确写法是 `[[0]*3 for _ in range(3)]`——推导式每轮都新建对象，这正是它比 `*n` 安全的根本原因。",
        "排序有两条路：`a.sort()` 原地、**返回 None**；`sorted(a)` 生成新列表、原列表不动。两者都稳定（Timsort），都支持 `key=`（按字段排：`sorted(recs, key=lambda r: r.score)`）与 `reverse=`。把 `a = a.sort()` 写出来就会拿到 None，属于新手三大错觉之一；C++ 的 `std::sort` 只有原地这一种形态。",
        "`tuple` 才是 C++ 里 `std::array`/`std::pair` 的对应物：不可变、可哈希、能当 dict 的键，`a, b = b, a` 是标准交换写法（不需要 temp 变量）。想要「有小名字的记录」就用 `namedtuple` 或 `dataclass`，它们顶替 C++ 的小 struct。",
        "顺手记住三件套：`enumerate`（要下标就别手写 `range(len(x))`）、`zip`（并行遍历，长度不等默认截断，3.10+ 可写 `strict=True` 让它报错）、`any/all`（惰性短路，等价于手写标志位循环）。衔接 p2-4：接下来是不看顺序、只看「在不在」的两兄弟，也是 dsg 里 visited 集合的正确实现。"
      ],
      summary_en: [
        "A list is a mutable ordered sequence of references and may mix types freely. Its shape is closer to an array of pointers than to an array of values: the objects live on the heap and the slots hold pointers, which is why append is cheap, why a big list costs several times the memory of the same std::vector<int>, and why traversal involves pointer chasing.",
        "Memorise the costs as 'fast at the tail, slow at the head': append is amortised O(1) (same doubling growth as a vector) and pop() is O(1), but pop(0) and insert(0, x) shift everything and cost O(n) — use collections.deque when you need a queue, because both of its ends are O(1). Indexing is O(1), slicing is O(length of the slice), and in is a linear scan; only set and dict get you O(1) membership.",
        "The comprehension [f(x) for x in seq if cond] is the readable form of map plus filter: marginally faster than an append loop (no repeated attribute lookup) and clearer than list(map(lambda ...)). One discipline: a single transformation with a single filter is fine, but three nested levels or a try inside means go back to a for loop.",
        "Python versus C++: in C++ the declaration vector<int> b = a genuinely deep-copies, allocating n ints so that editing b never touches a; in Python b = a only sticks another label on the same list, and b[0] = 9 changes a as well. An independent copy must be requested explicitly: a.copy(), a[:] or list(a) give a shallow copy (new container, shared elements) and nested structures need copy.deepcopy. This is the most painful lesson for anyone arriving from C++ and the most commonly asked one.",
        "A shallow copy copies one level only, so the inner lists stay shared: matrix = [[0]*3]*3 builds three labels on one and the same inner list, and touching matrix[0][0] changes all three rows. The correct form is [[0]*3 for _ in range(3)], because a comprehension constructs a fresh object each round — that is precisely why it is safer than multiplication.",
        "Sorting has two roads: a.sort() is in place and returns None, sorted(a) builds a new list and leaves the original alone. Both are stable (Timsort) and both take key= (sort by field with a lambda) and reverse=. Writing a = a.sort() gives you None, one of the three classic beginner illusions; std::sort, by contrast, only exists in the in-place form.",
        "The tuple, not the list, is the counterpart of C++'s std::array and std::pair: immutable, hashable, usable as a dict key, and a, b = b, a is the idiomatic swap with no temporary. For records with named fields use namedtuple or dataclass, which stand in for small C++ structs.",
        "Three helpers worth knowing by heart: enumerate (never hand-write range(len(x)) when you want indices), zip (parallel iteration, which truncates to the shorter input unless you pass strict=True in 3.10+), and any/all (short-circuiting and lazy, replacing a loop with a flag variable). Bridge to p2-4: the two siblings that ignore order and only ask 'is it in there', which is also the correct implementation of the visited set in dsg."
      ],
      code: `# 列表存的是引用，形态上更像装指针的容器而不是装值的容器
nums = [3, 1, 4, 1, 5, 9, 2, 6]
nums.append(9)
nums.pop()
# 头部操作是线性代价，真要队列请换 deque
first = nums.pop(0)
# 赋值只是多贴一张标签，不是拷贝
alias = nums
alias[0] = 999
# 想要独立的一份：浅拷贝只复制一层容器
shallow = nums[:]
# 推导式每轮都新建对象，所以它比乘法复制安全
fresh = [x for x in shallow]
# 二维数组的经典坑：星号会让三行共用同一个对象
bad = [[0] * 3] * 3
good = [[0] * 3 for _ in range(3)]
bad[0][0] = 1
print(bad[1], good[1])
# 原地排序返回 None，生成新列表用 sorted；key 顶替 C++ 的比较器
sorted_nums = sorted(nums)
print(alias is nums, first, sorted_nums[:3], len(nums))
# 与 C++ 对照：vector 赋值真的复制元素，Python 赋值只复制引用
# 这一条差异制造出的 bug，比 Python 里其他所有坑加起来还多
print([x * x for x in range(5) if x % 2 == 0], list(zip(\"ab\", range(3))))`,
      pit: "`b = a` 之后以为拿到了副本：函数里对参数 `lst.append(...)`，调用方的列表跟着变长——这在 C++ 里除非你显式传引用否则根本写不出来，而 Python 里是默认行为。对策三选一：函数开头 `data = list(data)` 自保、签名上写明「本函数会原地修改」、或者干脆返回新对象而不改参数。嵌套结构还要 `copy.deepcopy`，浅拷贝只挡一层。",
      pit_en: "Assuming b = a handed you a copy: an append inside a function grows the caller's list too — something you could not even write in C++ without explicitly taking a reference, yet it is the default here. Choose one of three defences: copy at the top of the function with data = list(data), state in the signature that the function mutates its argument, or return a new object and never touch the parameter. For nested structures you need copy.deepcopy, because a shallow copy stops only one level.",
      ex: {
        q: "为什么 `[[0]*3]*3` 造出的矩阵不能按行独立修改，而 `[[0]*3 for _ in range(3)]` 可以？",
        a: "因为 `*` 对外层列表做的是「把同一个内层对象的引用重复三次」，三行是同一个 list；而推导式的每一轮都会重新执行 `[0]*3`，因而真的构造出三个独立的内层列表。前者改一个格子三行齐变，后者互不影响。",
        q_en: "Why can the matrix built with [[0]*3]*3 not be edited row by row, while the comprehension version can?",
        a_en: "Because multiplying a list replicates references to one and the same inner list, so all three rows are the same object; a comprehension evaluates [0]*3 afresh on every round, really producing three separate inner lists. Edit one cell in the first and all rows move; in the second they are independent."
      }
    },

    "p2-4": {
      min: 13,
      summary: [
        "dict 是一张哈希表：键唯一、且必须是**可哈希**对象（str、int、tuple、frozenset 可以；list、dict、set 不行，因为它们可变、哈希会随内容变）。从 Python 3.7 起「保持插入顺序」是语言规范的一部分，不再只是 CPython 的实现巧合。",
        "取值三件套要分清风声：`d[k]` 在键不存在时抛 KeyError；`d.get(k, default)` 返回缺省值、不改动字典；`d.setdefault(k, 0)` 读不到就把值写进去并返回。计数的标准写法是 `d[w] = d.get(w, 0) + 1`，生产代码里直接用 `collections.Counter`（还白送 `most_common(k)`）。",
        "set 同样是哈希表，只是只存键：去重写 `set(nums)`、成员判断 O(1)、并交差补用 `| & - ^`。它就是「visited 集合」的正确实现——dsg 那一章的 BFS/DFS 标记在 Python 里就该是一个 set；写成 `if v in visited_list` 会把每一步变成 O(n) 扫描，整道题从线性退化成立方。",
        "【Python 与 C++ 对照】`std::unordered_map<string,int>` 与 Python 的 dict 是同一类结构，差别全在语义：C++ 的 `m[k]` 在键不存在时**静默插入**一个默认值（只读代码常常因此被改坏，只查询要用 `find/count/at`），Python 的 `d[k]` 直接抛 KeyError；C++ 是值语义、可哈希是**类型**的属性，Python 是引用语义、可哈希是**对象**的属性。两边共同的地雷是「结构在遍历中变化」：C++ 表现为插入触发 rehash、迭代器失效；Python 表现为 `RuntimeError: dictionary changed size during iteration`。",
        "遍历 dict 时按需要选视图：`.items()` 同时拿键和值、`.keys()/.values()` 只拿一边；`.items()` 在 Python 3 里是**惰性视图**而不是拷贝，字典变了视图跟着变。要「按值排序」就 `sorted(d.items(), key=lambda kv: -kv[1])`；要「遍历中删键」就先 `for k in list(d):` 物化一份键列表。",
        "可哈希的隐含契约是「值不变则哈希不变」：所以 list 不能当键，而 tuple 只要所有元素都可哈希就能当键；自定义类默认按 `id` 哈希，一旦你重写了 `__eq__` 就必须同时重写 `__hash__`，否则要么 TypeError、要么对象进错桶「明明放进去却找不到」。",
        "复杂度与内存直觉：dict 的均摊 O(1) 靠装载因子和 rehash 换来，代价是指针式内存与对象头开销——Python 的 dict 比 C++ 的 unordered_map 占内存得多（几倍量级），存 10⁷ 条键值时往往是 Python 先 OOM。这时正确的解法是换成 numpy 数组/结构化数组，或者干脆回到 C++ 侧实现。",
        "异常初步（py3-5 会正式展开）：`try / except KeyError as e / else / finally` 四段各有分工——`else` 只在没抛异常时执行、`finally` 一定执行。Python 的惯用风格叫 EAFP（先做，出错再处理），C++ 更常见 LBYL（先检查，再动手）；`d.get()` 与 `try/except` 两条路今天都算地道，但要知道异常有成本，别把它写进内层循环。衔接 p2-5：容器就位，接下来讲怎么走它们。"
      ],
      summary_en: [
        "A dict is a hash table: keys are unique and must be hashable (str, int, tuple and frozenset qualify; list, dict and set do not, because being mutable means their hash would drift with their content). Since Python 3.7, insertion order is part of the language specification rather than a CPython implementation accident.",
        "The three ways to read differ in how loudly they fail: d[k] raises KeyError for an absent key, d.get(k, default) returns a fallback and leaves the dict untouched, and d.setdefault(k, 0) writes the value when missing and returns it. The idiomatic counter is d[w] = d.get(w, 0) + 1, and production code just reaches for collections.Counter, which also throws in most_common(k).",
        "A set is the same hash table storing only keys: set(nums) deduplicates, membership is O(1), and | & - ^ give union, intersection, difference and symmetric difference. It is the correct implementation of a visited set — the BFS and DFS marking in dsg should be a set here; writing 'if v in visited_list' turns every step into a linear scan and the whole traversal from linear into cubic.",
        "Python versus C++: unordered_map and dict are the same data structure whose differences are all semantic. In C++, m[k] silently inserts a default-constructed value when the key is absent (so read-only code quietly mutates the map; use find, count or at to query), while Python's d[k] raises KeyError. C++ has value semantics and hashability as a property of the type; Python has reference semantics and hashability as a property of the object. The shared minefield is changing the structure during iteration: in C++ an insertion triggers rehash and invalidates iterators, in Python it raises RuntimeError: dictionary changed size during iteration.",
        "Pick the view you need when iterating: .items() yields pairs, .keys() and .values() yield one side, and in Python 3 these are lazy views rather than copies, so they track later mutations of the dict. Sort by value with sorted(d.items(), key=lambda kv: -kv[1]), and delete while iterating by materialising keys first with for k in list(d).",
        "Hashability carries an implicit contract: the hash must not change while the value is used as a key. That is why a list cannot be a key while a tuple can, provided every element is hashable; user-defined classes hash by id by default, and the moment you override __eq__ you must also override __hash__, or you get either a TypeError or an object filed in the wrong bucket — 'I put it in, but it cannot be found'.",
        "Complexity and memory intuition: the amortised O(1) of a dict is bought with load factors and rehashing, and paid for in pointer-chasing memory and object headers, so a Python dict costs several times what the same unordered_map costs in C++ — with 10^7 entries it is usually Python that hits OOM first. The right answers then are numpy arrays or structured arrays, or moving that piece back to the C++ side.",
        "Exceptions, first pass (py3-5 develops this): try / except KeyError as e / else / finally each have a job — else runs only when nothing was raised, finally always runs. Python's idiomatic style is EAFP (do it, handle the failure), where C++ more often uses LBYL (check first, then act); both d.get() and try/except are respectable today, just remember that raising has a cost and does not belong in an inner loop. Bridge to p2-5: with the containers in place, next is how to walk them."
      ],
      code: `# 字典是哈希表：键唯一且必须可哈希，3.7 起保持插入顺序
counts = {}
for w in "the quick brown fox the lazy dog the".split():
    counts[w] = counts.get(w, 0) + 1
print(counts["the"], counts.get("owl", 0))
# 直接取不存在的键会抛 KeyError，get 才是安静的那一个
# 按值排序要显式给出 key，这就是 C++ 比较器的位置
for k, v in sorted(counts.items(), key=lambda kv: -kv[1])[:3]:
    print(k, v)
# 集合：去重与成员判断都是常数代价
seen = set(counts)
print(len(seen), "fox" in seen, "owl" in seen)
# 列表不可哈希所以不能当键，元组可以
pairs = {(1, 2): "ok"}
# 遍历途中改字典会抛异常，先物化一份键列表再删
for k in list(counts):
    if counts[k] == 1:
        del counts[k]
print(len(counts), pairs[(1, 2)])
# 与 C++ 对照：unordered_map 的方括号会静默插入默认值，这里选择大声报错
# 两边共有的坑是结构变化：那边迭代器失效，这边直接拒绝你改
try:
    print(counts["owl"])
except KeyError:
    print("键不存在，我早就知道会有这一天")`,
      pit: "在遍历字典时增删键：`for k, v in d.items(): if v == 0: del d[k]` 当场抛 `RuntimeError: dictionary changed size during iteration`；更隐蔽的是「遍历列表时删除元素」——那不抛异常，只是**跳过**下一个元素（索引已经错位），行为跟 C++ 里边遍历边 `erase` 不接返回值一模一样地错。正确写法都是先物化：`for k in list(d)` 或推导式重建 `d = {k: v for k, v in d.items() if v}`。",
      pit_en: "Adding or deleting keys while iterating: for k, v in d.items(): del d[k] raises RuntimeError: dictionary changed size during iteration. The sneakier version is deleting from a list while iterating it — no exception at all, it simply skips the next element because the indices shifted, behaving exactly like erase-without-capturing-the-return-value in C++. Both are fixed by materialising first (for k in list(d)) or rebuilding with a comprehension.",
      ex: {
        q: "为什么 `list` 不能当 dict 的键，而 `tuple` 可以？如果元组里装了一个列表呢？",
        a: "因为哈希表的桶位置由键的哈希值决定，而 list 可变、内容一变哈希就变，会「掉进别的桶」再也找不回来；tuple 不可变、通常哈希稳定，所以可以当键——但只要它内部装着那个 list，`hash()` 就会当场抛 TypeError，因为求哈希会递归到元素上。",
        q_en: "Why can a tuple be a dict key while a list cannot, and what happens if the tuple contains a list?",
        a_en: "Because a hash table files a key in a bucket chosen by its hash, and a list is mutable, so its hash could change after insertion and the key would end up in the wrong bucket, unreachable. A tuple is immutable and therefore normally has a stable hash — but if one of its elements is a list, hash() raises TypeError on the spot, since computing the hash recurses into the elements."
      }
    },

    "p2-5": {
      min: 13,
      summary: [
        "`if / elif / else` 每段以冒号结尾、由缩进界定；没有圆括号要求，也没有传统 `switch`——3.10 的 `match/case` 做的是**结构化解构**（能拆序列、拆字典、拆对象属性并绑定名字），比 C++ 的 switch 强得多，但语义并不等价。",
        "真值判定是 Python 独有的坑：空串、空列表、空 dict、0、0.0、`None`、`False` 都是假，其余为真，所以 `if lst:` 就是「非空」的地道写法。C++ 里只有标量与可转换类型能进条件、`if (vec)` 直接编不过；移植时把「容器判空」简写成 `if x:` 是好事，但把「可能等于 0 的数值」当存在性判断就是事故现场。",
        "`for x in seq` 遍历的是**元素本身**（协议上是先取迭代器再逐个 `next`），不是 C++ 的经典 `for (int i = 0; i < n; ++i)` 下标循环；要下标就用 `enumerate`，两个序列并行就用 `zip`。手写 `for i in range(len(a))` 不算错，但会被读代码的人当成你没学过 Python。",
        "`while` 与 C++ 同义，但没有「条件里赋值」这种写法：`while (line := f.readline()):` 用的是 3.8 的海象运算符，读旧代码要认得，写不写看团队约定（它的好处是避免把同一个调用写两遍）。",
        "`break` / `continue` 与 C++ 完全一致；Python 还多一个 `for/while … else`：**整个循环没有被 break 过**才执行 else 分支，用来优雅表达「找遍了都没找到」。它很容易读错，团队里要么统一用、要么统一不用，半生不熟最危险。",
        "`range` 是惰性序列而不是列表：`range(10**12)` 不占内存、可以多次迭代、支持索引与 `len()`，只有 `list(range(n))` 才真的把 n 个对象全造出来。默认含头不含尾、步长可负（`range(n-1, -1, -1)` 是倒着走）。这与 C++20 的 `std::views::iota` 思路一致，差别是 Python 内置就有、你从第一天起就能用。",
        "【Python 与 C++ 对照】同一个「遍历数组求和」：C++ 的范围 for 编译成指针递增、缓存友好、类型编译期已知；Python 的 `for v in lst:` 每一步都要解引用取 PyObject、查类型、走 `__add__` 魔术方法，实测差 30~100 倍。因此 Python 里的「性能优化第一步」几乎永远是——把这段循环换成 numpy 向量化或 C++/Cython 扩展，而不是把循环本身写得更精巧。",
        "推导式与循环的边界：一层转换/过滤写成推导式（更快也更好读），需要多条语句、异常处理或副作用就老老实实写 for；嵌套超过两层就抽成函数。`sum(x*x for x in a)` 传的是**生成器表达式**（不落地列表，省内存），而 `sum([x*x for x in a])` 会先建整表——这是同一行代码里最容易忽略的一个字。衔接 p2-6：下一节把两章的对照汇总成一张总表。"
      ],
      summary_en: [
        "if / elif / else end each clause with a colon and are delimited by indentation; there is no need for parentheses and no traditional switch. The match/case added in 3.10 performs structural destructuring (splitting sequences, dicts and object attributes while binding names), which is far more capable than a C++ switch yet not the same thing.",
        "Truthiness is a Python-only hazard: empty strings, empty lists, empty dicts, 0, 0.0, None and False are all false and everything else is true, so 'if lst:' is the idiomatic emptiness test. In C++ only scalars and convertible types can stand in a condition, so if (vec) does not compile at all; simplifying 'not empty' to 'if x:' is a good habit when porting, but treating a numeric value that might legitimately be 0 as an existence check is the accident waiting to happen.",
        "for x in seq yields the elements themselves (by protocol: obtain an iterator, then call next repeatedly), which is not C++'s classic indexed loop over 0..n-1. Reach for enumerate when you need positions and zip when two sequences run in parallel. Writing for i in range(len(a)) is legal but reads to others as if you had never learned Python.",
        "while means the same as in C++, except that assignment inside a condition is not an option: the walrus operator from 3.8 makes while (line := f.readline()) possible, and you should recognise it in existing code even if your team bans writing it — its value is avoiding the same call written twice.",
        "break and continue behave exactly as in C++; Python adds a for/while ... else clause whose body runs only if the loop finished without hitting break, which expresses 'searched everywhere, found nothing' elegantly. It is very easy to misread, so a team should either use it consistently or never; the half-adopted version is the dangerous one.",
        "range is a lazy sequence, not a list: range(10**12) uses no memory to speak of, can be iterated many times, supports indexing and len(), and only list(range(n)) actually materialises n objects. It excludes the stop by default and accepts a negative step, with range(n-1, -1, -1) walking backwards. This mirrors C++20's std::views::iota in spirit; the difference is that Python has had it since day one.",
        "Python versus C++: the same 'sum an array' loop compiles in C++ into pointer bumps with known types and friendly cache behaviour, whereas each round of for v in lst dereferences a PyObject, checks its type and dispatches the addition dunder, which measures 30-100x slower. Hence the first move in Python optimisation is almost always to replace the loop with a vectorised numpy call or a C++/Cython extension, not to write the loop more cleverly.",
        "Know where comprehensions stop helping: one transformation plus one filter belongs in a comprehension (faster and clearer), while several statements, exception handling or side effects belong in a plain for loop, and more than two nesting levels should become a function. sum(x*x for x in a) passes a generator expression and never materialises the list, whereas sum([x*x for x in a]) builds the whole table first — the single character that is easiest to overlook in an otherwise identical line. Bridge to p2-6: the next lesson merges both chapters into one comparison table."
      ],
      code: `scores = [55, 92, 78, 40, 66]
# 真值判定：空容器、0、None 都是假，所以这样写就是判非空
if scores:
    print("有数据")
# 直接遍历元素；要下标就交给 enumerate
for i, v in enumerate(scores):
    if v < 60:
        print(i, v, "不及格")
# 两个序列并行遍历用 zip，长度不等时默认按短的来
for name, v in zip(["A", "B", "C", "D", "E"], scores):
    print(name, v, end=" ")
print()
# range 是惰性序列：这么写不会真的造出一亿个数
print(len(range(10 ** 8)), list(range(0, 10, 3)))
# while 加海象运算符：条件里顺便取值
n = 0
while n < 3:
    n += 1
# for 配 else：整个循环没被 break 过才走 else 分支
for v in scores:
    if v > 100:
        break
else:
    print("没有任何一个超过 100")
# 生成器表达式不落地列表，方括号版本会先把整张表建出来
print(sum(x * x for x in scores), max(scores), min(scores))
# 与 C++ 对照：这里的 for 每轮都要解对象、查类型、走魔术方法
# 所以性能不够时该换成向量化，而不是把循环写得更精巧`,
      pit: "`if x:` 当成「x 存在」来写，结果 x 是合法的 0、空串或空列表：`if count:` 在 count 为 0 时和 count 为 None 时走同一分支，把「计数为零」误判成「没读到数据」。真要跟 None 区分就得写 `if x is not None:`。另一半边的坑是 `if x = 5:`——Python 里条件中不能赋值，会直接 SyntaxError，从 C++ 过来的人第一次都会撞上。",
      pit_en: "Reading 'if x:' as 'x exists' when x may legitimately be 0, an empty string or an empty list: 'if count:' takes the same branch for count == 0 and count is None, so a genuine zero count is misread as missing data. If you must distinguish None, write 'if x is not None:'. The other half of this pit is 'if x = 5:' — assignment is not allowed in a condition, so you get a SyntaxError, and every C++ transplant hits it once.",
      ex: {
        q: "`for i, v in enumerate(x)` 与 `for i in range(len(x))` 结果一样，为什么前者更地道？",
        a: "因为 enumerate 直接走迭代器协议、不经过下标访问，对任何可迭代对象（生成器、字典、文件行）都成立，而 `range(len(x))` 要求对象支持下标和长度、每轮还要做一次索引；前者读起来就是「边要序号边要值」，后者读起来是「我在用 C++ 的姿势写 Python」。",
        q_en: "Both for i, v in enumerate(x) and for i in range(len(x)) give the same pairs, so why is the first considered idiomatic?",
        a_en: "Because enumerate uses the iterator protocol directly, never indexing, and works on any iterable — generators, dicts, file lines — whereas range(len(x)) demands an object with a length and an index operation and pays a subscript on every round. The first reads as 'give me position and value', the second reads as someone writing Python in C++ posture."
      }
    },

    "p2-6": {
      title: "综合重构：Python 与 C++ 双路线对照总表",
      title_en: "Synthesis: The Master Comparison Table, Python and C++",
      min: 15,
      target: "能对同一份需求同时给出 Python 版与 C++ 版的写法，说清两边的语义差异、性能差在哪一层，并据此决定这段代码该落在哪条路线上。",
      target_en: "For one requirement, produce both the Python and the C++ form, say where the semantics differ and at which layer the cost appears, and choose the track accordingly.",
      summary: [
        "收口三问，先问再写：① 这次运行的墙钟时间是不是产品的一部分？② 数据必须装进固定内存、或者要被别的程序链接吗？③ 我改一次代码的迭代成本，是否远高于它跑一次的机器成本？三问里有两问答「是」，就该考虑 C++；三问全答「否」，Python 是更便宜的选择。",
        "对照总表·骨架与 IO：C++ 的 `#include` + `int main()` + 编译链接，对应 Python 的「文件顶层语句即主程序」+ `if __name__ == \"__main__\":`；`cout << a << b` 对应 `print(a, b)`（中间多一个空格）；`cin >> a` 对应 `int(input())`（类型必须自己写）；`printf(\"%.2f\", x)` 对应 `f\"{x:.2f}\"`。差异的实质是「谁负责分隔、换行与类型」。",
        "对照总表·类型与容器：`int`（定宽、会回绕）对 `int`（变长、不溢出）；`double` 对 `float`（同一物）；`std::vector<T>` 对 `list`（但那是引用数组，赋值即别名）；`std::array/pair` 对 `tuple`；`std::unordered_map` 对 `dict`（键值语义与「方括号是否插入」不同）；`std::set` 对 `set`；`std::string` 存字节、Python 的 `str` 存码点，`bytes` 才对得上 `std::string`。",
        "对照总表·算法与排序：`std::sort` 原地、不稳定、要比较器对象，对 `list.sort()` 原地、**稳定**、用 `key=` 函数（注意键函数与比较器不同：Python 的 key 是「先算一次再排」，等于 C++ 里自己预先算好排序键）；`std::stable_sort` 对 `sorted(...)`（都稳定）；`std::nth_element` 在 Python 标准库里没有对应物，要用 `heapq.nsmallest(k, xs)`（堆，O(n log k)）或先排序——这也是 Python 路线少了一格的选型表。",
        "语义差最容易踩的三条，全部与「取整与边界」有关：`//` 向负无穷、C++ 的 `/` 向零；`%` 符号跟除数、C++ 跟被除数；`round` 是银行家舍入、`std::round` 远离零。再加一条边界：Python 越界抛异常或自动截短，C++ 越界是未定义行为。跨语言移植任何分桶、环形索引、四舍五入的代码，必须拿负数与 0.5 各测一遍。",
        "引用与拷贝是第一条真正的分水岭：C++ 是值语义（`auto b = a;` 复制一切），Python 是引用语义（`b = a` 只多一张标签）。所以 Python 要求你显式表达意图：`a.copy()` / `a[:]` / `list(a)` 浅拷贝一层，`copy.deepcopy` 才递归，函数参数默认「传对象引用」，可变默认参数（`def f(x=[])`）是经典陷阱。这一格差异能解释你未来一半的诡异 bug。",
        "性能差的来源要说得出口：每个数值都是一个带类型指针与引用计数的堆对象；每次 `+` 都要走一次魔术方法分派；每次下标都要边界检查；容器存的是指针，遍历伴随间接寻址与缓存不友好。量级就是 10~100 倍。解法按性价比排序：换成 numpy 向量化（等于把循环交给 C）→ 用内置聚合（`sum/any/map`）→ `@dataclass(slots=True)`/`__slots__` 省内存 → 仍是瓶颈就写 C++/Cython 扩展。**最后才是换语言。**",
        "复盘清单（把两章的坑各挑一条记住）：pip 装错解释器 / `input()` 没转类型 / 把 `is` 当相等 / 用内置名当变量 / Tab 与空格混用 / `b = a` 当拷贝 / `[[0]*3]*3` 三行共享 / 遍历中改字典 / `if x:` 误判 0 / 循环里 `s += x` 平方复杂度 / `a = a.sort()` 拿到 None。全部能答上，Python 入门两条线就算收口；接下来 py3 进入函数、模块、文件与异常，那也是「两条路线开始分岔成两套工程方法」的地方。"
      ],
      summary_en: [
        "Three closing questions, asked before writing any code: is wall-clock time of one run part of the product; must the data fit fixed memory, or be linked by another program; does my iteration cost dwarf the machine cost of a single run. Two yes answers point at C++; three no answers make Python the cheaper choice.",
        "Sheet, skeleton and IO: includes plus int main() plus a link step versus 'the file's top-level statements are the program' plus the __main__ guard; cout << a << b versus print(a, b), which inserts a space you have to write yourself; cin >> a versus int(input()), where you must name the type; printf with a format string versus an f-string. The real difference is who owns separators, newlines and types.",
        "Sheet, types and containers: fixed-width wrapping int versus arbitrary-precision int; double versus float (the same thing); std::vector versus list, except that the list is an array of references so assignment aliases; std::array and pair versus tuple; unordered_map versus dict, which differ on key semantics and on whether subscripting inserts; std::set versus set; and std::string holds bytes, which matches Python's bytes, not its str of code points.",
        "Sheet, algorithms and sorting: std::sort is in place, unstable and takes a comparator, while list.sort() is in place, stable and takes a key function — and a key function is not a comparator, since it is evaluated once per element, like precomputing sort keys in C++; sorted(...) is the stable counterpart of std::stable_sort; and there is no nth_element in the Python standard library, so Top-K goes through heapq.nsmallest(k, xs) at O(n log k) or a full sort — one fewer row in Python's selection table.",
        "Three semantic traps, all about rounding and boundaries: floor division rounds toward minus infinity where C++ truncates toward zero; modulo follows the divisor here and the dividend there; round uses banker's rounding while std::round goes away from zero. Add the boundary rule: out of range in Python raises or clips, in C++ it is undefined behaviour. Any ported bucketing, ring-index or rounding code must be tested with a negative value and with a .5.",
        "References versus values are the first real watershed: C++ has value semantics, so copying a variable copies everything, while Python has reference semantics, so b = a only adds a label. Python therefore demands explicit intent: copy(), slicing or list(a) for a one-level shallow copy, copy.deepcopy for nested structures, arguments passed as object references by default, and the mutable default parameter as the classic trap. This one row explains half of your future mysterious bugs.",
        "Name the source of the performance gap: every number is a heap object with a type pointer and a reference count; every addition dispatches through a dunder method; every subscript runs a bounds check; containers store pointers, so traversal means indirection and cache misses. That is where 10-100x lives. Countermeasures in value-for-money order: vectorise with numpy (hand the loop to C), use built-in aggregates, shrink objects with slots, and only then write a C++ or Cython extension. Switching languages is the last option, not the first.",
        "Retrospective list, one pit per lesson: pip installed into the wrong interpreter; input() left unconverted; is mistaken for equality; a builtin shadowed by a variable; tabs mixed with spaces; b = a believed to be a copy; [[0]*3]*3 sharing one row; the dict mutated during iteration; 'if x:' misreading a legitimate 0; s += x inside a loop costing O(n^2); and a = a.sort() yielding None. Answer all eleven and the Python entry track is closed; py3 opens functions, modules, files and exceptions, which is where the two tracks turn into two engineering methodologies."
      ],
      code: `# 收口练习：同一份需求，两条路线各写一遍，再比较代价
# 需求：读入若干成绩，按分数从高到低输出前 3 名（同分按姓名字典序）
data = [("A", 88), ("B", 95), ("C", 88), ("D", 73), ("E", 95)]

# Python 版：key 是「先算排序键再排」，而且排序天然稳定
ranked = sorted(data, key=lambda kv: (-kv[1], kv[0]))
print("前三名：", ranked[:3])

# 只要前 k 个时用堆，避免整表排序：这就是 nth_element 缺席的补偿
import heapq
print("堆取前 3：", heapq.nsmallest(3, range(len(data)), key=lambda i: (-data[i][1], data[i][0])))

# 计数器：C++ 里要手写 unordered_map 的查找再插入，这里一行
from collections import Counter
print("分数分布：", Counter(s for _, s in data))

# 与 C++ 对照，同一件事在那边长这样（放在注释里）：
# std::vector<std::pair<std::string,int>> data = ...
# std::stable_sort(data.begin(), data.end(),
#     [](auto& x, auto& y) { if (x.second != y.second) return x.second > y.second; return x.first < y.first; });
# Top-K 在 C++ 里有现成的 nth_element 与 partial_sort，Python 只能靠堆
# 两边的复杂度同为 O(n log n)，差的是常数与那句「谁在比较」
print("引用检查：", data is ranked[:0], ranked[0][1] // 10)`,
      pit: "把 C++ 的比较器习惯直接搬成 Python 的 `key`：写了 `sorted(xs, key=lambda a, b: a[1] < b[1])`——Python 的 key 只接受**一个**参数、返回排序依据，两参数版本会当场 TypeError；想要「先按 A 再按 B」就返回元组 `(-score, name)`（这也是为什么负号能让整数部分变成降序）。真要自定义比较逻辑，才用 `functools.cmp_to_key`。同族错误是把 `sorted()` 写成 `list.sort()` 后又去接返回值，拿到 None。",
      pit_en: "Porting a C++ comparator straight into Python's key: sorted(xs, key=lambda a, b: a[1] < b[1]) fails with TypeError, because key takes exactly one argument and returns the sort value; for multi-field order return a tuple such as (-score, name), which is also why a minus sign turns the integer part into descending order. Only when you truly need comparator semantics do you wrap it in functools.cmp_to_key. The sibling error is calling list.sort() and then assigning its return value, which is None.",
      ex: {
        q: "为什么「Python 慢」的正确解药通常不是换语言，而是换实现层次？",
        a: "因为慢的是**解释器的循环与动态分派**，而不是语言能表达的计算：把同一算法交给 numpy（在 C/Fortran 里跑循环）或写成 C++ 扩展，就能在保留 Python 上层表达力的同时拿回原生性能；真正必须换语言的只有「延迟或内存本身是产品」的场合。",
        q_en: "Why is the right cure for 'Python is slow' usually a different layer rather than a different language?",
        a_en: "Because what is slow is the interpreter's loop and dynamic dispatch, not the computation being expressed: hand the same algorithm to numpy, whose loops run in C or Fortran, or wrap it as a C++ extension, and you recover native performance while keeping Python as the expression layer. Only cases where latency or memory footprint is itself the product genuinely require changing languages."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择 / 判断 / 填空混排） ---------- */
  quizAdd: {
    py1: [
      {
        q: "关于 Python 与 C++ 的执行模型，下列说法正确的是？",
        o: ["两者都必须在运行前编译成机器码", "Python 通常先编译成字节码再由解释器执行，C++ 编译成机器码直接跑", "C++ 程序必须依赖虚拟机管理内存", "Python 不需要任何编译步骤，源码被逐字符解释"],
        a: 1,
        why: "Python 会先把源码编译成字节码（.pyc 可缓存），再由 CPython 解释器执行；C++ 编译链接成原生可执行文件。这也解释了为什么 Python 改一行就能跑，而 C++ 要重新构建。",
        q_en: "Which statement about the execution models of Python and C++ is correct?",
        o_en: ["Both must be compiled to machine code before running", "Python is normally compiled to bytecode and then interpreted, while C++ compiles to machine code that runs directly", "C++ programs require a virtual machine for memory management", "Python has no compilation step at all and is interpreted character by character"],
        why_en: "Python compiles source to bytecode first (cached as .pyc) and then runs it under the CPython interpreter, while C++ produces a native executable. That is why a saved edit is instantly runnable in Python but needs a rebuild in C++."
      },
      {
        q: "判断：因为 Python 是动态类型语言，所以 `\"3\" + 3` 会自动把 3 转成字符串再拼接。",
        type: "judge", a: 1,
        why: "动态类型不等于自动转换。Python 里类型属于对象，str 与 int 相加会抛 TypeError；能自动拼接的只有同为 str 的操作数，或者显式 `\"3\" + str(3)`。",
        q_en: "True or false: because Python is dynamically typed, \"3\" + 3 automatically converts 3 to a string and concatenates.",
        why_en: "False. Dynamic typing is not implicit conversion. Types belong to objects, so str plus int raises TypeError; only two strings concatenate, otherwise convert explicitly with str(3)."
      },
      {
        q: "要判断 x 是不是 None，Python 的惯用写法是 `x ______ None`（填一个英文关键字）。",
        type: "fill", ans: ["is", "is not"],
        why: "None 是全局唯一对象，判它用身份比较 is 最直接也最快；`==` 会去调用对象的比较方法，可能被自定义类改写而给出意外结果。反过来，判值相等一律用 ==，不要拿 is 比数字或字符串。",
        q_en: "To test whether x is None, the idiomatic Python form is 'x ______ None' (fill in one English keyword).",
        why_en: "None is a singleton, so identity comparison with is is both the clearest and the fastest test; == would call the object's comparison hook, which a custom class can override to surprising effect. Conversely, always compare values with == and never use is on numbers or strings."
      },
      {
        q: "关于 Python 的性能与 AI 生态，下列哪项**不**正确？",
        o: ["PyTorch、NumPy 等库的数值热路径大多实现在 C/C++/CUDA 里", "GIL 使得多线程无法在纯 Python 的 CPU 密集任务上真正并行", "纯 Python 的循环通常比编译优化后的 C++ 慢一到两个数量级", "Python 生态强，说明它作为语言本身的执行效率高于 C++"],
        a: 3,
        why: "生态强与单语言执行效率是两件事：Python 提供的是表达力与胶水层，真正的算力来自原生扩展与向量化；把「库多」读成「跑得快」是选错路线的常见起点。前三条都是事实。",
        q_en: "Which statement about Python's performance and AI ecosystem is NOT correct?",
        o_en: ["The numeric hot paths of PyTorch and NumPy are mostly implemented in C, C++ or CUDA", "The GIL prevents threads from truly parallelising CPU-bound pure-Python work", "A pure-Python loop is typically one to two orders of magnitude slower than optimised C++", "Python's strong ecosystem means the language itself executes faster than C++"],
        why_en: "Ecosystem strength and per-language execution speed are different claims: Python supplies expressiveness and glue while the real throughput comes from native extensions and vectorisation. Reading 'many libraries' as 'runs faster' is where a wrong track choice starts. The other three statements are facts."
      }
    ],
    py2: [
      {
        q: "表达式 `-7 // 2` 与 `-7 % 2` 的结果分别是？",
        o: ["-4 和 1", "-3 和 -1", "-4 和 -1", "-3 和 1"],
        a: 0,
        why: "Python 的整除向负无穷取整，余数符号跟随除数，所以是 -4 与 1；选项里的 -3 与 -1 正是 C++ 里 `-7 / 2` 与 `-7 % 2` 的结果——移植带负数的分桶或环形索引代码时必须测一遍。",
        q_en: "What are the results of -7 // 2 and -7 % 2 respectively?",
        o_en: ["-4 and 1", "-3 and -1", "-4 and -1", "-3 and 1"],
        why_en: "Python floors toward minus infinity and lets the remainder follow the sign of the divisor, giving -4 and 1; the -3 and -1 pair is exactly what C++ yields for -7 / 2 and -7 % 2 — which is why any ported bucketing or ring-index code needs a negative test case."
      },
      {
        q: "判断：`b = a`（a 是列表）之后修改 `b[0]` 不会影响 a，因为 Python 的赋值会拷贝整个列表。",
        type: "judge", a: 1,
        why: "Python 的赋值只创建新的名字绑定，a 与 b 指向同一个 list 对象，改一个另一个跟着变。要一份独立的必须显式浅拷贝（a.copy()、a[:]、list(a)）或深拷贝（copy.deepcopy）。这与 C++ 的 `auto b = a;` 语义正好相反。",
        q_en: "True or false: after b = a (with a a list), changing b[0] cannot affect a because Python's assignment copies the whole list.",
        why_en: "False. Assignment only binds another name to the same list object, so a and b change together. An independent copy must be asked for: a.copy(), a[:] or list(a) for a shallow copy, or copy.deepcopy for nested data. This is the opposite of C++'s auto b = a."
      },
      {
        q: "Python 3 里 `round(2.5)` 的结果是 ______。",
        type: "fill", ans: ["2", "2.0"],
        why: "Python 3 采用银行家舍入，.5 时向最近的偶数靠，所以 2.5 变 2、3.5 变 4；而 C++ 的 std::round 永远远离零，2.5 会得 3。同名的「四舍五入」在两种语言里不是同一个函数。",
        q_en: "In Python 3, the result of round(2.5) is ______.",
        why_en: "Python 3 uses banker's rounding, snapping a .5 to the nearest even number, so 2.5 becomes 2 while 3.5 becomes 4; std::round in C++ always rounds away from zero and gives 3. The same-named 'round to nearest' is not the same function in the two languages."
      },
      {
        q: "关于 `range(10 ** 12)`，下列哪项正确？",
        o: ["它会立刻占用约 8TB 内存", "它是惰性的整数序列对象，本身几乎不占额外内存，且可反复迭代", "它等价于 `list(range(10 ** 12))`", "它只能被迭代一次，第二次为空"],
        a: 1,
        why: "range 只存起点、终点与步长，按需计算每个值，支持 len() 与索引；把它转成 list 才真的把每个对象造出来。这是 Python 版的 views::iota 思路，也是「含头不含尾」写法的来源。",
        q_en: "Which statement about range(10 ** 12) is correct?",
        o_en: ["It immediately consumes roughly 8 TB of memory", "It is a lazy integer sequence object using almost no extra memory and can be iterated repeatedly", "It is equivalent to list(range(10 ** 12))", "It can only be iterated once and yields nothing the second time"],
        why_en: "A range stores only start, stop and step, computing values on demand and supporting len() and indexing; converting it to a list is what actually materialises every object. It is Python's version of the views::iota idea, and the source of the half-open convention."
      }
    ]
  },

  /* ---------- 词典：py1 6 条 + py2 6 条，分类统一为「基础概念」 ---------- */
  terms: [
    { term: "解释型语言", term_en: "Interpreted Language", cat: "基础概念",
      short: "源码先编译成字节码、再由解释器执行，改一行即可重跑。",
      short_en: "Source is compiled to bytecode and run by an interpreter, so a single edit is immediately runnable.",
      detail: ["反馈环是秒级，适合探索与原型；代价是运行时开销与较晚的错误暴露。", "C++ 是编译型：构建时间长，但类型与优化在编译期就确定。"],
      detail_en: ["The feedback loop takes seconds, which suits exploration and prototypes, at the cost of runtime overhead and later error reporting.", "C++ is compiled: builds take longer, but types and optimisation decisions are settled before anything runs."],
      vs: "解释型换开发速度，编译型换运行速度，两者的选择取决于哪个成本更贵。",
      vs_en: "Interpretation buys development speed, compilation buys run speed; the choice depends on which cost you pay more dearly." },
    { term: "动态类型", term_en: "Dynamic Typing", cat: "基础概念",
      short: "类型属于对象而不属于变量，同一变量可先后指向不同类型。",
      short_en: "Types belong to objects rather than variables, so one name may point at different types over time.",
      detail: ["它不等于「没有类型」：str 与 int 混用依然抛 TypeError，只是时机在运行时。", "类型注解与 mypy 能在保留灵活性的同时补回一部分静态检查。"],
      detail_en: ["It is not 'untyped': mixing str and int still raises TypeError, only later, at run time.", "Type hints plus mypy restore part of the static checking without giving up the flexibility."],
      vs: "静态类型把错误提前到编译期，动态类型把错误推迟到运行时、把自由留给作者。",
      vs_en: "Static typing moves errors earlier, to compile time; dynamic typing moves them later, to run time, and gives the author more freedom in between." },
    { term: "缩进块", term_en: "Indentation-Delimited Blocks", cat: "基础概念",
      short: "Python 用缩进决定代码块归属，冒号开启一个块。",
      short_en: "Python uses indentation to decide block membership, with a colon opening each block.",
      detail: ["混用 Tab 与空格会触发 TabError；错缩进一格可能不报错，只是逻辑跑偏。", "C++ 的块由花括号决定，缩进只是给人看的装饰，所以同一错误在那边无害、在这边致命。"],
      detail_en: ["Mixing tabs and spaces raises TabError, and one wrong space may not raise at all — it just moves a statement out of the block.", "In C++ braces own the block and indentation is decoration, so the same slip is harmless there and fatal here."],
      vs: "缩进在 Python 里是语法，在 C++ 里是风格。",
      vs_en: "Indentation is syntax in Python and style in C++." },
    { term: "文档字符串", term_en: "Docstring", cat: "基础概念",
      short: "写在模块、类或函数第一条语句位置的字符串，运行时可读。",
      short_en: "A string placed as the first statement of a module, class or function, readable at run time.",
      detail: ["被 __doc__ 保存、被 help() 显示、被 Sphinx 之类工具汇编成 API 手册。", "C++ 没有对应机制，要靠 Doxygen 注释加外部工具在编译前提取。"],
      detail_en: ["Stored in __doc__, shown by help(), and collected by tools like Sphinx into API manuals.", "C++ has no counterpart; Doxygen comments plus an external extractor are the equivalent."],
      vs: "注释给读源码的人看，文档字符串同时给运行时的工具看。",
      vs_en: "Comments serve the reader of the source; docstrings also serve tools running against the live object." },
    { term: "类型注解", term_en: "Type Hints", cat: "基础概念",
      short: "写在参数、返回值与变量上的类型提示，运行时不检查。",
      short_en: "Type hints on parameters, returns and variables, enforced by nothing at run time.",
      detail: ["解释器完全不检查，但 IDE、mypy、pyright 能在跑之前抓错。", "写法如 def f(x: int) -> float，容器可写 list[dict[str, float]]。"],
      detail_en: ["The interpreter ignores them entirely, while IDEs, mypy and pyright use them to catch errors before anything runs.", "Typical forms are def f(x: int) -> float and container types such as list[dict[str, float]]."],
      vs: "注解是给人和工具看的契约，不是运行时的护栏。",
      vs_en: "Hints are a contract for humans and tools, not a runtime guard rail." },
    { term: "全局解释器锁", term_en: "Global Interpreter Lock", cat: "基础概念",
      short: "CPython 里保护内部状态的一把大锁，让多线程无法并行执行字节码。",
      short_en: "One big lock in CPython protecting internal state, which stops threads from executing bytecode in parallel.",
      detail: ["IO 等待时锁会释放，所以网络与磁盘密集型多线程有效；CPU 密集就换多进程。", " NumPy 等库在原生代码里干活时常释放锁，因此仍能用满多核。"],
      detail_en: ["The lock is released during IO waits, so threading still helps network and disk workloads; use processes for CPU-bound work.", "Libraries such as NumPy release the lock while running native code, so they still fill all cores."],
      vs: "GIL 限制的是并行执行，不是并发调度；多线程仍然能交替推进。",
      vs_en: "The GIL limits parallel execution, not concurrent scheduling; threads still take turns." },
    { term: "切片", term_en: "Slicing", cat: "基础概念",
      short: "s[start:stop:step] 取子序列，含头不含尾、越界自动截短。",
      short_en: "s[start:stop:step] takes a subsequence, half-open and clipped instead of raising when out of range.",
      detail: ["负索引从末尾数，step 为负即反向，s[::-1] 是标准反转。", "C++ 的 under 没有这种安全语义，越界访问是未定义行为。"],
      detail_en: ["Negative indices count from the end, a negative step reverses, and s[::-1] is the idiomatic reversal.", "C++ has no equivalent safety: indexing past the end is undefined behaviour."],
      vs: "切片返回新对象（浅拷贝一层），索引返回元素本身。",
      vs_en: "A slice builds a new container copying one level, while an index hands back the element itself." },
    { term: "推导式", term_en: "Comprehension", cat: "基础概念",
      short: "一行表达「由序列造序列」：转换加过滤，可读且略快于手写循环。",
      short_en: "A one-line way to build a sequence from another: a transformation plus a filter, clearer and slightly faster than a manual loop.",
      detail: ["每轮都新建内层对象，所以 [[0]*3 for _ in range(3)] 比 [[0]*3]*3 安全。", "超过两层嵌套或里面需要 try，就退回普通 for。"],
      detail_en: ["Each round constructs a fresh inner object, which is why the comprehension form of a 2D list is safe and the multiplication form is not.", "Beyond two nesting levels, or whenever a try is needed, go back to a plain loop."],
      vs: "推导式产出列表，生成器表达式惰性产出且不占内存。",
      vs_en: "A comprehension produces a list; a generator expression yields lazily and uses no extra memory." },
    { term: "可变与不可变类型", term_en: "Mutable and Immutable Types", cat: "基础概念",
      short: "list/dict/set 可变，int/float/str/tuple 不可变；可变性决定别名风险与可否哈希。",
      short_en: "list, dict and set are mutable; int, float, str and tuple are not — mutability decides both aliasing risk and hashability.",
      detail: ["只有不可变对象才可哈希，所以 list 不能当 dict 的键、tuple 通常可以。", "函数里改可变参数会影响调用方；可变默认参数是经典陷阱。"],
      detail_en: ["Only immutable objects are hashable, which is why a list cannot be a dict key while a tuple generally can.", "Mutating a list argument inside a function changes the caller's data, and a mutable default argument is the classic trap."],
      vs: "不可变的「修改」产生新对象，可变的修改就地生效并被所有标签看见。",
      vs_en: "'Changing' an immutable value builds a new object; changing a mutable one happens in place and is visible through every label." },
    { term: "变量绑定", term_en: "Name Binding", cat: "基础概念",
      short: "赋值不是把值装进盒子，而是把名字贴到对象上。",
      short_en: "Assignment does not put a value into a box; it sticks a name onto an object.",
      detail: ["因此 b = a 只多一张标签，两者共享同一对象，改一个另一个跟着变。", "要独立副本必须显式浅拷贝或深拷贝；这与 C++ 的值语义正好相反。"],
      detail_en: ["Hence b = a adds another label over the same object, and editing one is visible through the other.", "An independent copy needs an explicit shallow or deep copy — the exact opposite of C++'s value semantics."],
      vs: "is 比较标签是否指向同一对象，== 比较对象的值是否相等。",
      vs_en: "is asks whether two labels point at the same object; == asks whether the values agree." },
    { term: "可哈希对象", term_en: "Hashable Object", cat: "基础概念",
      short: "能算出稳定哈希值且支持等值比较的对象，才能当 dict 的键或放进 set。",
      short_en: "An object with a stable hash and equality support can serve as a dict key or live in a set.",
      detail: ["哈希不稳定就会「进错桶」，所以可变类型不可哈希。", "重写 __eq__ 必须同时重写 __hash__，否则要么报错要么查不到。"],
      detail_en: ["An unstable hash files the object in the wrong bucket, which is precisely why mutable types are unhashable.", "Overriding __eq__ obliges you to override __hash__ too, or you get either a TypeError or lookups that miss."],
      vs: "可哈希是对象的性质；C++ 里哈希是类型经 std::hash 提供的性质。",
      vs_en: "Hashability is a property of the object in Python, whereas in C++ hashing is a property of the type via std::hash." },
    { term: "惰性序列", term_en: "Lazy Sequence", cat: "基础概念",
      short: "range、字典视图与生成器只在需要时算出元素，因此规模再大也不占内存。",
      short_en: "range, dict views and generators compute elements only when needed, so enormous sizes cost no memory.",
      detail: ["range 支持 len() 与索引，但绝不落地成列表。", "C++20 的 ranges 与 views::iota 是同一思路，Python 从第一版起内置。"],
      detail_en: ["A range supports len() and indexing without ever materialising its elements.", "C++20 ranges and views::iota follow the same idea; Python has shipped it from the start."],
      vs: "惰性对象省内存但不能重复随机访问所有历史值，列表则相反。",
      vs_en: "A lazy object saves memory but holds no materialised history, while a list does the opposite." }
  ],

  achievements: [
    { id: "py_route_start", icon: "🐍", name: "双路线起步", name_en: "Dual-Track Starter",
      desc: "完成 py1 · Python 环境与首程 全部课节", desc_en: "Finish every lesson of py1 Python Setup & First Program",
      check: ["py1"] },
    { id: "py_data_fluent", icon: "🧺", name: "容器与流程通", name_en: "Containers and Control Flow",
      desc: "完成 py2 · 数据类型与控制流 全部课节", desc_en: "Finish every lesson of py2 Data Types and Control Flow",
      check: ["py2"] }
  ],

    codeComments: {
    "同一件事的两种写法：累加 0 到 n-1": "One task, two languages: summing 0 to n-1",
    "Python：存盘就能跑，看不到编译这一步": "Python: save the file and run it, with no visible build step",
    "与 C++ 对照，同一件事在那边长这样（放在注释里）：": "Compared with C++, the same job looks like this over there (kept in comments):",
    "差别不在结果，而在「谁在算、什么时候算」": "The difference is not the answer but who computes it and when",
    "Python 每一次加号都要先查对象类型再走魔术方法，这就是慢的来处": "every plus sign in Python checks the object type and dispatches a dunder method, and that is where the slowness comes from",
    "end 参数管结尾，默认是一个换行符": "end controls what is written after the values, a newline by default",
    "sep 参数管分隔符": "sep controls what goes between the values",
    "flush 参数管刷新：重定向到文件时才看得出它的价值": "flush controls pushing bytes out now: its value only shows once output is redirected to a file",
    "f-string：花括号里是表达式，冒号后面是格式说明": "f-string: an expression inside the braces, a format specifier after the colon",
    "与 C++ 对照：std::endl 等于换行加刷新，裸换行符只换行": "Compared with C++: std::endl means newline plus flush, while a bare escape is only a newline",
    "Python 把这两件事做成了两个互不干扰的参数": "Python splits those two duties into two independent arguments",
    "变量是贴在对象上的标签，不是装值的盒子": "a variable is a label on an object, not a box containing a value",
    "动态类型：换的是标签，不是盒子": "dynamic typing: the label moves, the box never existed",
    "大整数不会溢出，这一行在 C++ 里必然回绕": "big integers never overflow; this line would certainly wrap in C++",
    "浮点仍是 IEEE 754 双精度，和 C++ 一样有表示误差": "floats are still IEEE 754 doubles, with the same representation error as in C++",
    "is 比的是同一个对象，== 比的是值；只有和 None 比才该用 is": "is compares object identity, == compares values; only None deserves is",
    "类型注解只是提示，运行时一句也不检查": "type hints are advice only; the runtime checks not a word of them",
    "与 C++ 对照：静态类型在编译期就挡住混用，动态类型要到这一行被执行才炸": "Compared with C++: static typing blocks the mix at compile time, dynamic typing waits until this line actually runs",
    "好处是能写 list[dict[str, float]] 这种混合结构毫无摩擦，代价是测试不能省": "the payoff is zero-friction structures like list[dict[str, float]]; the price is that tests are not optional",
    "input 的返回值永远是字符串，屏幕上看着像数字也没用": "input always returns a string, however numeric it looks on screen",
    "忘了转换就会变成字符串拼接，这是本章最高频的错误": "forget the conversion and addition becomes concatenation, the most frequent error in this chapter",
    "一行读两个数：split 切词、map 惰性转换、左侧解包": "two numbers from one line: split cuts tokens, map converts lazily, unpacking catches them",
    "转换失败抛 ValueError，用 try 兜住而不是让程序崩": "a failed conversion raises ValueError; catch it with try instead of crashing",
    "空白与进位制：这些都能转，注意逗号不行": "whitespace and bases: all of these convert, but a comma does not",
    "与 C++ 对照：cin 会按声明类型自动解析，失败时只把流置为 fail 状态": "Compared with C++: cin parses by declared type and, on failure, merely puts the stream into a fail state",
    "Python 什么都不猜，出错直接抛异常，绝不会留下半坏的状态继续跑": "Python guesses nothing: it raises instead of leaving broken state behind to keep running",
    "单行注释：井号到行尾，Python 没有跨行的块注释语法": "a comment runs from the hash to end of line; Python has no block-comment syntax",
    "为什么写成幂而不是乘法：改公式时只有一处需要动": "why a power rather than a multiplication: only one place to edit when the formula changes",
    "反例式的教训：注释写着「初始化累加器」，而下一行早已换成了别的变量": "a lesson in the bad style: the comment still says 'initialise the accumulator' while the line below has moved on",
    "PEP8：模块级常量全大写，函数与变量用蛇形命名，类用帕斯卡命名": "PEP 8: module constants in caps, functions and variables in snake_case, classes in PascalCase",
    "与 C++ 对照：那边的块由花括号决定，这边的块由缩进决定": "Compared with C++: braces own the block there, indentation owns it here",
    "所以缩进错一格在 C++ 里只是难看，在这里是语法错误或逻辑错位": "so one wrong space is only ugly in C++ and a syntax error or shifted logic here",
    "起步回路的完整一遍：确认环境、读入、转换、计算、输出": "the start-up loop in full: confirm the environment, read, convert, compute, output",
    "第一步在 shell 里做：python -V 与 which python，两个都要看一眼": "step one happens in the shell: check both python -V and which python",
    "注意：split 之后每个元素仍是字符串，必须 map 转换": "note: after split every piece is still a string, so map must convert them",
    "与 C++ 对照：cin 失败时只会静默留下坏流，这里必须自己判空": "Compared with C++: cin leaves a silently broken stream, so here you must test for emptiness yourself",
    "整数在 Python 里不会溢出，这一行在 C++ 里必须换 long long": "integers never overflow in Python; the same line would need long long in C++",
    "只有直接运行本文件时才执行 main，被 import 时不执行": "run main only when this file is executed directly, not when it is imported",
    "幂与开平方：C++ 里要请 std::pow，这里直接是运算符": "powers and square roots: C++ needs std::pow, this has an operator",
    "斜杠永远给浮点数，整除要用双斜杠运算符": "the slash always yields a float; integer division needs the double-slash operator",
    "整除向负无穷取整，余数符号跟除数：与 C++ 的向零截断不同": "floor division rounds to minus infinity and the remainder follows the divisor, unlike C++ truncation toward zero",
    "round 是银行家舍入，半奇数会靠向偶数": "round uses banker's rounding, so a halfway value snaps to the even neighbour",
    "浮点仍有表示误差；要精确十进制用 Decimal，金额存成整数分": "floats still carry representation error; use Decimal for exact decimals and integer cents for money",
    "int 任意精度：这一行在 C++ 里必然回绕成负数": "arbitrary-precision int: this line would surely wrap negative in C++",
    "与 C++ 对照：同一段循环求和，C++ 零点几秒，纯 Python 要十几秒": "Compared with C++: the same summing loop takes a fraction of a second there and tens of seconds here in pure Python",
    "数值语义这边更安全，数值性能那边更实在，这就是两条路线的分界": "safer numeric semantics on this side, real numeric performance on that one — that is the boundary between the two tracks",
    "索引与负索引：越界会抛异常，而不是像 C++ 那样读到脏内存": "indexing and negative indices: out of range raises, instead of reading garbage memory as in C++",
    "切片含头不含尾，越界的另一端会被自动截短": "a slice includes its start and excludes its stop, and the far bound is clipped automatically",
    "步长为负就是反向，这是最地道的反转写法": "a negative step walks backwards, which is the idiomatic reversal",
    "字符串不可变：想改就先转 list，改完再拼回去": "strings are immutable: to edit, turn it into a list first and join it back afterwards",
    "编码分岔：str 是文本、bytes 才是字节，两者的长度不是一回事": "the encoding fork: str is text and bytes are bytes, and their lengths are not the same quantity",
    "循环里拼接是平方代价，追加到列表再 join 才是线性": "concatenating in a loop is quadratic; append then join is linear",
    "与 C++ 对照：std::string 存字节、越界访问是未定义行为": "Compared with C++: std::string stores bytes and indexing past the end is undefined behaviour",
    "Python 的 str 是码点序列、越界安全，保险费收在运行时开销里": "a Python str is a sequence of code points and out-of-range access is safe; the premium is collected inside the runtime overhead",
    "列表存的是引用，形态上更像装指针的容器而不是装值的容器": "a list stores references, so it resembles a container of pointers rather than of values",
    "头部操作是线性代价，真要队列请换 deque": "operations at the head cost linearly; switch to deque if you really need a queue",
    "赋值只是多贴一张标签，不是拷贝": "assignment only adds another label; it is not a copy",
    "想要独立的一份：浅拷贝只复制一层容器": "for an independent one: a shallow copy duplicates one container level only",
    "推导式每轮都新建对象，所以它比乘法复制安全": "a comprehension constructs a fresh object each round, which is why it is safer than replication with the star operator",
    "二维数组的经典坑：星号会让三行共用同一个对象": "the classic 2D trap: the star operator makes all three rows the same object",
    "原地排序返回 None，生成新列表用 sorted；key 顶替 C++ 的比较器": "the in-place sort returns None and sorted builds a new list; key stands where C++ puts a comparator",
    "与 C++ 对照：vector 赋值真的复制元素，Python 赋值只复制引用": "Compared with C++: assigning a vector really copies the elements, assigning a list copies only the reference",
    "这一条差异制造出的 bug，比 Python 里其他所有坑加起来还多": "this single difference produces more bugs than every other Python pit combined",
    "字典是哈希表：键唯一且必须可哈希，3.7 起保持插入顺序": "a dict is a hash table: keys are unique and must be hashable, and since 3.7 insertion order is preserved",
    "直接取不存在的键会抛 KeyError，get 才是安静的那一个": "subscripting an absent key raises KeyError; get is the quiet one",
    "按值排序要显式给出 key，这就是 C++ 比较器的位置": "sorting by value needs an explicit key, which is exactly where a C++ comparator would go",
    "集合：去重与成员判断都是常数代价": "a set: deduplication and membership both cost constant time",
    "列表不可哈希所以不能当键，元组可以": "a list is unhashable and cannot be a key; a tuple can",
    "遍历途中改字典会抛异常，先物化一份键列表再删": "mutating a dict during iteration raises, so materialise the keys first and then delete",
    "与 C++ 对照：unordered_map 的方括号会静默插入默认值，这里选择大声报错": "Compared with C++: the brackets of unordered_map silently insert a default value, while here it is decided to fail loudly",
    "两边共有的坑是结构变化：那边迭代器失效，这边直接拒绝你改": "the shared pit is structural change: iterator invalidation there, an outright refusal here",
    "真值判定：空容器、0、None 都是假，所以这样写就是判非空": "truthiness: empty containers, 0 and None are all false, so this is the emptiness test",
    "直接遍历元素；要下标就交给 enumerate": "iterate the elements directly; hand indices to enumerate",
    "两个序列并行遍历用 zip，长度不等时默认按短的来": "walk two sequences in parallel with zip, which follows the shorter one by default",
    "range 是惰性序列：这么写不会真的造出一亿个数": "range is lazy: this line does not really build a hundred million numbers",
    "while 加海象运算符：条件里顺便取值": "while with the walrus operator: fetch the value inside the condition",
    "for 配 else：整个循环没被 break 过才走 else 分支": "for with else: the else clause runs only if the loop was never broken",
    "生成器表达式不落地列表，方括号版本会先把整张表建出来": "a generator expression never materialises the list, while the bracketed version builds the whole table first",
    "与 C++ 对照：这里的 for 每轮都要解对象、查类型、走魔术方法": "Compared with C++: each round of this for dereferences an object, checks its type and dispatches a dunder method",
    "所以性能不够时该换成向量化，而不是把循环写得更精巧": "so when performance falls short, vectorise instead of writing the loop more cleverly",
    "收口练习：同一份需求，两条路线各写一遍，再比较代价": "closing exercise: write the same requirement once per track, then compare the costs",
    "需求：读入若干成绩，按分数从高到低输出前 3 名（同分按姓名字典序）": "requirement: read scores and print the top 3 by descending score, ties broken by name",
    "Python 版：key 是「先算排序键再排」，而且排序天然稳定": "the Python version: key precomputes the sort value, and the sort is stable by default",
    "只要前 k 个时用堆，避免整表排序：这就是 nth_element 缺席的补偿": "for only the first k, use a heap to avoid sorting everything: this compensates for the absence of nth_element",
    "计数器：C++ 里要手写 unordered_map 的查找再插入，这里一行": "counting: C++ needs a hand-written find-then-insert on unordered_map, here it is one line",
    "Top-K 在 C++ 里有现成的 nth_element 与 partial_sort，Python 只能靠堆": "Top-K has ready-made nth_element and partial_sort in C++, and only a heap here",
    "两边的复杂度同为 O(n log n)，差的是常数与那句「谁在比较」": "both sides are O(n log n); what differs is the constant and the answer to 'who does the comparing'"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_PY12);
