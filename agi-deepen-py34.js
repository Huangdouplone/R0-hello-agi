/* ================================================================
 * R0:hello agi · 课程深化层 PY34（py3 函数、模块与文件 / py4 面向对象与常用库）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把 Python 路线的后两章从每节 3 要点深化到 7~8 要点，补上「是什么 / 为什么这样
 *       设计 / 什么时候会出错」，并且每节至少一条与 C++ 路线的对照（同一问题的两种语言
 *       代价），最后为两章各加一节「综合重构」收口课（p3-6 / p4-6）。
 * 写法约定（沿用格式样板）：
 *   1) 既有课节不写 title —— 合并时自动沿用主数据标题；
 *   2) 新增课节写 title / title_en / target / target_en，并出现在 order 里；
 *   3) 所有示例注释一律单独起行（Python 的 # 只有行首才会被英文模式翻译）；
 *   4) 多章文件：order 与 quizAdd 都写成 {sid:[...]}，desc/goal 不生效；
 *   5) code 里的中文注释全部在 codeComments 给出英文映射。
 * ================================================================ */

const DEEPEN_PY34 = {
  stages: ["py3", "py4"],

  order: {
    py3: ["p3-1", "p3-2", "p3-3", "p3-4", "p3-5", "p3-6"],
    py4: ["p4-1", "p4-2", "p4-3", "p4-4", "p4-5", "p4-6"]
  },

  lessons: {

    /* ===================== py3 函数、模块与文件 ===================== */
    "p3-1": {
      min: 13,
      summary: [
        "`def` 是一条**可执行语句**（前置：py2 的 list / dict / str 与 if / for 就是本章全部例子的原料）：解释器运行到它才编译函数体、创建函数对象，所以函数能写在 if/for 里、能被工厂函数动态生成——C++ 没有这种自由度。",
        "默认值在 `def` 执行的那一刻求值**一次**，并作为活对象挂在 `f.__defaults__` 上：`def add(x, bucket=[])` 里那个列表被所有调用共用，第二次调用就能看到上次的残留。",
        "可选的列表/字典参数一律用 `None` 作哨兵：`def add(x, bucket=None)` 然后在函数体里 `if bucket is None: bucket = []`，把「每次都要全新的」这层语义显式写出来。",
        "函数是一等对象：可以存进字典（`handlers = {\"sum\": sum}`）、当参数传（`sorted(xs, key=f)`）、当返回值返回；装饰器、回调、策略表全都建立在这一条上。",
        "参数顺序是硬规则：位置参数 → `*args` → 仅关键字参数（`*,` 之后）→ 带默认值的参数 → `**kwargs`；调用时 `f(b=2)` 按名字填，名字拼错不会报错，只会静默落进 `**kwargs`。",
        "`*args/**kwargs` 让「原样转发给另一个函数」一行可写，代价是签名不再自描述：IDE 补全、类型检查、误用检测同时失效，所以只在包装层和装饰器里用。",
        "`return` 省略时函数返回 None；`return a, b` 其实返回一个**元组**，调用方 `x, y = f()` 是解包而不是语言支持多返回值——所以「返回三个接两个」这种代码能跑，只是跑不长久。",
        "与 C++ 对照：C++ 的默认实参写在声明里、编译期定死、每个编译单元各复制一份，类型不符当场编译失败；Python 的默认值是运行期对象（会共享、能被改），形参类型只是注解且不强制——同一份「灵活」换来的是错误延后到运行时才炸。"
      ],
      summary_en: [
        "'def' is an executable statement (prerequisite: py2's list / dict / str and if / for are the raw material of every example in this chapter): the body is only compiled and the function object only created when the interpreter reaches it, so functions can be defined inside if/for and manufactured by factory functions — a freedom C++ does not offer.",
        "A default value is evaluated exactly once, when the 'def' runs, and stays alive as an object in f.__defaults__: the list in 'def add(x, bucket=[])' is shared by every call, so the second call still sees the first call's leftovers.",
        "For optional list/dict parameters always use None as a sentinel: 'def add(x, bucket=None)' plus 'if bucket is None: bucket = []' inside — that is how you spell 'a fresh container every time' explicitly.",
        "Functions are first-class values: store them in dicts (handlers = {\"sum\": sum}), pass them as arguments (sorted(xs, key=f)), return them from other functions — decorators, callbacks and strategy tables all rest on this.",
        "Parameter order is enforced: positional -> *args -> keyword-only (after *) -> defaulted -> **kwargs. A call like f(b=2) fills by name, and a misspelled name raises nothing; it just lands quietly in **kwargs.",
        "*args/**kwargs make 'forward everything unchanged' a one-liner, but the signature stops describing itself: editor completion, type checking and misuse detection all go away together, so keep them for wrappers and decorators.",
        "Omitting return yields None; 'return a, b' returns a tuple, and 'x, y = f()' is unpacking, not a multi-return feature — which is why 'return three, unpack two' still runs, just not for long.",
        "Versus C++: a C++ default argument is written in the declaration, frozen at compile time and copied into every translation unit, and a type mismatch fails the build; a Python default is a live runtime object (shareable, mutable) and parameter types are only annotations that nothing enforces — the same flexibility, paid for with errors that surface at run time."
      ],
      code: `# 默认值只在 def 执行的那一刻求值一次，之后一直复用同一个对象
# 反面写法：可变默认值被所有调用共享
def add_score(name, bucket=[]):
    bucket.append(name)
    return bucket

# 正确写法：None 作哨兵，要独立列表由调用方自己带进来
def add_score_ok(name, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(name)
    return bucket

# 参数顺序硬规则：位置参数、*args、仅关键字参数、默认值、**kwargs
def make_user(city, *rest, role="reader", **extra):
    return city, rest, role, extra

def avg(*nums):
    # 任意多个数：这就是「一等对象 + 可变参数」组合出来的用法
    if not nums:
        return 0.0
    return sum(nums) / len(nums)

if __name__ == "__main__":
    print(add_score("a"))
    print(add_score("b"))
    print(add_score_ok("a"), add_score_ok("b"))
    print(make_user("成都", 1, 2, vip=True))
    print(avg(90, 85, 77))
    print(add_score.__defaults__)`,
      pit: "把「每次调用都该是全新的」东西写成可变默认值（`[]`、`{}`、`set()`、甚至 `datetime.now()`）：第一次调用完全正常，第二次开始带着上次的状态；在长驻的 Web 进程里它还会一路累积，最后变成一个查不出来源的内存泄漏。",
      pit_en: "Using a mutable default for something that should be fresh every call ([], {}, set(), even datetime.now()): the first call looks fine, the second starts out with the previous state, and in a long-lived web process it keeps accumulating into a memory leak nobody can trace.",
      ex: {
        q: "为什么 `def f(a=[])` 的默认列表会在多次调用之间共享，而 `def f(a=5)` 看不出「共享 5」？",
        a: "默认值只在 `def` 执行时创建一次并挂在函数对象上：可变对象被原地 `append` 就留下了状态，而整数不可变，任何「改动」都是换成一个新对象，所以共享看不见。",
        q_en: "Why is the default list in 'def f(a=[])' shared across calls while 'def f(a=5)' shows no sign of sharing 5?",
        a_en: "The default is built once at def time and lives on the function object: mutating the list in place leaves state behind, whereas an int is immutable, so every 'change' swaps in a new object and the sharing stays invisible."
      }
    },

    "p3-2": {
      min: 12,
      summary: [
        "Python 按 LEGB 四层找名字：Local（当前函数）→ Enclosing（外层函数）→ Global（模块）→ Builtin；查找发生在**运行到那一行时**，所以名字写错只会在真正执行到它时报 NameError。",
        "有一条硬规则最容易撞：函数体内**只要出现过对该名字的赋值**，它在整个函数里都是局部变量——于是 `count += 1` 之前的读取不会去拿全局那份，而是抛 UnboundLocalError。",
        "要写外层名字必须显式声明：`global n` 操作模块级变量（几乎总是设计坏味道：函数不再自洽、测试无从下手），`nonlocal n` 只绑定最近一层外层函数的变量，是闭包计数器与累加器的正规写法。",
        "闭包捕获的是**变量本身**（一个 cell），不是定义那一刻的值：外层变量后来变了，内层函数读到的是新值——这就是晚绑定，也是它和「传参拷贝」的分水岭。",
        "经典事故：`[lambda: i for i in range(3)]` 三个函数全都返回 2。要钉住当时的值就借默认参数（`lambda i=i: i`，它在 def 时求值）或用 `functools.partial`。",
        "`lambda` 只能是一个表达式：没有语句、没有断言、没有类型注解、不能多行；它适合 `sorted(words, key=lambda w: len(w))` 这类一次性回调，超过一行就换 `def`，而且 traceback 里函数名比 `<lambda>` 好定位得多。",
        "类体不在 LEGB 链上：方法里直接写 `COUNT` 引用类变量会 NameError，必须写 `self.COUNT` 或 `ClassName.COUNT`——这是 py3 的作用域规则和 py4 的类撞在一起时最常踩的坑。",
        "与 C++ 对照：C++ 的 lambda 用捕获列表逐个回答「捕获谁、按值还是按引用」（`[x]` 拷贝、`[&x]` 引用，按引用捕获局部变量再带出作用域就是悬空引用 UB）；Python 闭包一律按引用捕获、没有按值捕获的语法，只能靠默认参数变通——好处是对象被引用计数/GC 保活不会悬空，代价是「我以为已经拷了一份」的意外共享。"
      ],
      summary_en: [
        "Python resolves names through LEGB: Local (this function), Enclosing (outer functions), Global (the module), Builtins — and it resolves them at the moment that line runs, so a typo only surfaces as NameError when execution actually reaches it.",
        "The rule people hit hardest: if a name is assigned anywhere in a function body, it is local for the whole body, so reading it before 'count += 1' does not fall back to the global one — it raises UnboundLocalError.",
        "Writing to an outer name needs a declaration: 'global n' targets the module-level binding (almost always a design smell: the function stops being self-contained and gets hard to test), while 'nonlocal n' binds exactly one enclosing function's variable, which is the proper way to write closure counters and accumulators.",
        "A closure captures the variable itself (a cell), not the value at definition time: if the outer variable later changes, the inner function sees the new value — that is late binding, and the line separating it from pass-by-copy.",
        "The classic accident: [lambda: i for i in range(3)] gives three functions that all return 2. Pin the current value with a default argument (lambda i=i: i, evaluated at def time) or with functools.partial.",
        "A lambda is one expression only: no statements, no assertions, no annotations, no line breaks. It fits throwaway callbacks such as sorted(words, key=lambda w: len(w)); past one line, use def — and a real function name in a traceback beats the bare '<lambda>' every time.",
        "A class body is not part of the LEGB chain: naming a class variable as plain COUNT inside a method raises NameError, you must write self.COUNT or ClassName.COUNT — the most common collision between py3 scope rules and py4 classes.",
        "Versus C++: a C++ lambda answers 'whom do I capture, by value or by reference' per capture ([x] copies, [&x] refers, and referring to a local that already left scope is dangling UB); Python closures always capture by reference with no by-value syntax, only the default-argument workaround — nothing dangles because the refcount/GC keeps the object alive, but 'I thought that was a copy' becomes a shared-state surprise."
      ],
      code: `count = 0

def counter_step():
    # 只因为这一行有赋值，count 在整个函数里都算局部名字
    # 想改全局那份必须写 global count
    global count
    count += 1
    return count

def make_counter():
    n = 0
    def step():
        # nonlocal 才是「改外层那个变量」的正确声明
        nonlocal n
        n += 1
        return n
    return step

def late_binding():
    # 三个 lambda 捕获的是同一个 i，循环停下来时 i 已经是 2
    return [lambda: i for i in range(3)]

def early_binding():
    # 默认参数在 def 执行时求值，于是把当时的值钉住了
    return [lambda i=i: i for i in range(3)]

if __name__ == "__main__":
    c = make_counter()
    print(c(), c(), c())
    print([f() for f in late_binding()])
    print([f() for f in early_binding()])
    words = ["pear", "fig", "banana"]
    print(sorted(words, key=lambda w: len(w)))
    print(counter_step(), count)`,
      pit: "在循环里创建回调（按钮绑定、`key=` 函数、异步任务）时以为闭包「按值记住」了循环变量：结果所有回调共享同一个变量，点哪个按钮都执行最后一次那个值，表现成「三个按钮行为完全一样」，而代码看起来一人一份。",
      pit_en: "Creating callbacks inside a loop (button handlers, key= functions, async tasks) while assuming the closure froze the loop variable: every callback shares the one variable, so all of them act on the last value and three buttons behave identically — while the code reads as if each got its own.",
      ex: {
        q: "为什么 Python 不肯把 `count += 1` 自动理解成「改全局变量」，而非要 `global`？",
        a: "因为赋值同时承担「创建局部变量」的职责：允许它顺便写全局，就无法在一个函数里区分「建个本地的」和「改模块状态」，所以规则定为「赋值即局部，要改外层必须声明」。",
        q_en: "Why will Python not read 'count += 1' as 'modify the global' and insist on 'global'?",
        a_en: "Because assignment also means 'create a local': letting it write globally as well would make one function unable to distinguish 'make a local' from 'mutate module state', so the rule is assignment defines a local, and touching an outer binding must be declared."
      }
    },

    "p3-3": {
      min: 13,
      summary: [
        "`import x` 是**运行期语句**而不是编译期指令：解释器找到 x.py、从头到尾**执行一遍它的顶层代码**、把生成的模块对象缓存进 `sys.modules`；第二次 import 只是查缓存取名字，几乎不花钱。",
        "「import 有副作用」正是上一条的直接后果：模块顶层读文件、连数据库、打印、建全局单例，都会在别人只是想 import 你的模块时发生——测试、CLI 和循环导入事故大多源自这一行。",
        "`if __name__ == \"__main__\":` 是 Python 的 main 守卫：直接运行时 `__name__` 等于 `\"__main__\"`，被 import 时等于模块名，所以演示与自测代码只有手动运行才执行；把「要做的事」放函数里、把「何时做」放守卫里。",
        "包是带 `__init__.py` 的目录（3.3+ 有无初始化包，但工程上仍建议显式写）：`import a.b.c` 会依次执行 a 与 a.b 的 `__init__.py`，`from a import *` 能找到哪些名字由 `__init__.py` 里的 `__all__` 决定。",
        "三种 import 写法的取舍：`import statistics`（保留命名空间、冲突最少，推荐）、`from statistics import mean`（调用短，但要保证不撞名）、`from x import *`（把命名空间搅浑，看不出名字来自哪，模块里一律禁用）。",
        "循环导入的成因是「A 顶层要 B、B 顶层又要 A」，而 import 必须拿到一个已经执行完的模块：按优先级解耦——把共同依赖抽到第三个模块、退化成 `import b` 晚点用 `b.x`、最后才把 import 挪进函数体延迟执行。",
        "第三方库被 `pip install` 装进**当前那个解释器**的 site-packages，所以虚拟环境不是可选项：`python -m venv .venv` 建隔离环境，`requirements.txt` 里把版本钉住（`==` 或 `~=`），否则今天能跑的代码明天换个 numpy 就崩，也换不了 CUDA 组合。",
        "与 C++ 对照：C++ 的 `#include` 是编译期文本复制，每个编译单元重复解析、错误在编译期暴露、换库要重新编译链接；Python 的 import 在运行期绑定对象，`math.squt` 拼错要到那行真跑到才 AttributeError——所以 mypy/pyright 与 `python -m compileall` 是在替你把编译期那一课补回来。"
      ],
      summary_en: [
        "'import x' is a runtime statement, not a compile-time directive: the interpreter locates x.py, runs its top-level code start to finish, and caches the resulting module object in sys.modules; the second import is a dict lookup and costs almost nothing.",
        "The consequence is that imports have side effects: a module that reads a file, opens a database connection, prints, or builds a global singleton at top level does all of it the moment someone merely imports it — most test, CLI and circular-import incidents start there.",
        "'if __name__ == \"__main__\":' is Python's main guard: __name__ equals '__main__' when you run the file and the module name when it is imported, so demo and self-test code runs only on an explicit run — keep 'what to do' in functions and 'when to do it' in the guard.",
        "A package is a directory with __init__.py (namespace packages exist since 3.3, but write the file anyway in real projects): 'import a.b.c' executes a/__init__.py and a/b/__init__.py in turn, and 'from a import *' can only see what __all__ in __init__.py lists.",
        "Trade-offs among the three import styles: 'import statistics' keeps the namespace and rarely collides (preferred); 'from statistics import mean' shortens call sites but can clash; 'from x import *' muddies the namespace so nobody knows where a name came from — never in a module.",
        "A circular import happens because A imports B at top level while B imports A at top level, and an import needs a module that has already finished executing. Fix it in this order: pull the shared dependency into a third module, fall back to 'import b' and use b.x later, and only then move an import inside a function to defer it.",
        "pip installs third-party code into the site-packages of whichever interpreter you invoked, so a virtual environment is not optional: create one with 'python -m venv .venv', pin versions in requirements.txt (== or ~=), or today's working script breaks tomorrow on a numpy bump and cannot move to another CUDA combination.",
        "Versus C++: #include copies text at compile time, every translation unit re-parses it, errors surface at compile time and swapping a library means recompiling and relinking; import binds objects at run time, so a misspelled math.squt only raises AttributeError when that line runs — which is exactly the compile-time lesson mypy/pyright and 'python -m compileall' are there to give back."
      ],
      code: `# 终端里的一次性环境准备，不是 .py 里的代码
python -m venv .venv
# Windows 用虚拟环境目录下的 activate 脚本，Linux 与 macOS 用下面这行
source .venv/bin/activate
pip install requests
# 把当前环境的版本钉死，同事和明天的你才能复现
pip freeze > requirements.txt

# demo.py —— main 守卫让「被 import」和「被运行」走两条路
import statistics
from pathlib import Path

CACHE = {}

def load_scores(path):
    # 有副作用的动作放在函数里，绝不写在模块顶层
    raw = Path(path).read_text(encoding="utf-8")
    return [float(x) for x in raw.split()]

if __name__ == "__main__":
    print(statistics.mean([90, 85, 77]))`,
      pit: "在项目根目录放一个叫 `random.py`（或 `json.py`、`email.py`）的练习文件：脚本所在目录排在 `sys.path` 最前面，于是 `import random` 命中的是你那份空壳，`random.randint` 突然不存在，而报错看起来像标准库坏了——这类 bug 搜索起来最费时间。",
      pit_en: "Keeping an exercise file named random.py (or json.py, email.py) in the project root: the script's own folder comes first on sys.path, so 'import random' binds your empty stub and random.randint suddenly does not exist while the error looks like a broken standard library — the slowest class of bug to search for.",
      ex: {
        q: "把 import 从文件顶部挪进函数内部为什么能「治好」循环导入，但它不该是首选方案？",
        a: "因为函数体只在被调用时执行，那时两个模块都已加载完毕；代价是模块间的依赖关系从文件头上消失了，读代码的人看不出耦合，所以应该先拆出共同依赖。",
        q_en: "Why does moving an import from the top of a file into a function 'cure' a circular import, and why is it still not the first choice?",
        a_en: "Because a function body only runs on call, by which time both modules have finished loading; the price is that the dependency no longer appears in the file header, so readers cannot see the coupling — extract the shared dependency first."
      }
    },

    "p3-4": {
      min: 14,
      summary: [
        "磁盘上的文本只是一串字节，`encoding` 是「字节 ↔ 字符」之间唯一的翻译表：不写它就用平台默认（Windows 常见 cp936/cp1252，Linux/macOS 是 UTF-8），同一份代码在两台机器上结果不同——「我这边是好的」的标准成因。",
        "`open()` 的模式串要看懂再写：`r` 只读（文件不存在报 FileNotFoundError）、`w` **先把文件截断成空**再写（原内容当场没了）、`a` 追加、`x` 独占创建（已存在就报错，适合做「只允许跑一次」）、`b` 二进制、`+` 读写。",
        "`with open(p, \"w\", encoding=\"utf-8\") as f:` 是上下文管理器：进入时调 `__enter__` 拿文件对象，离开块时调 `__exit__` **必定** close——包括中途抛异常、包括从块里 `return` 出去的那条路径，手写 close 做不到这么完备。",
        "`with` 只保证「关闭」，不保证「已经落盘」：写入先进缓冲区，close 或 flush 时才交给操作系统；真要立刻持久化才需要 `f.flush()` 加 `os.fsync(f.fileno())`，否则崩溃时最后一段内容可能不在盘上。",
        "大文件禁止 `read()` / `readlines()` 一口吞：`for line in f:` 是文件对象的**惰性迭代**，一次只读一行，处理几 GB 日志内存也是常数；二进制用 `f.read(1024 * 1024)` 分块读。",
        "`pathlib.Path` 取代字符串拼路径：`p.read_text(encoding=\"utf-8\")` 一行读完、`p.parent.mkdir(parents=True, exist_ok=True)` 建目录、`p.with_suffix(\".json\")` 换扩展名、`p.exists()` 判断——分隔符、相对路径、跨平台都不用来记。",
        "结构化数据交给 `json` 和 `csv`，别手写拼接：`json.dump(obj, f, ensure_ascii=False, indent=2)` 才输出中文而不是 Unicode 转义；`csv.DictReader` 要配 `open(..., newline=\"\")`，否则 Windows 上会多出空行；大结果先流式写 `out.tmp` 再 `replace()` 原子改名，中途崩溃不会留下半成品覆盖旧数据。",
        "与 C++ 对照：C++ 的 `std::ofstream` 靠析构自动 close（RAII），离开作用域必然刷新，而且流里只有字节、编码要么自己保证 UTF-8 要么交给 locale；Python 把文本层和字节层明确分开（text/binary 两种模式、`str` 与 `bytes` 两种类型），换来「必须想一次编码」的清醒，代价是忘了 `with` 就只能等垃圾回收替你关文件句柄。"
      ],
      summary_en: [
        "Text on disk is only bytes; encoding is the single translation table between bytes and characters. Omit it and you inherit the platform default (cp936/cp1252 on Windows, UTF-8 on Linux/macOS), so identical code yields different files on two machines — the textbook cause of 'it works on my box'.",
        "Read the open() mode before writing it: 'r' read-only (FileNotFoundError if absent), 'w' truncates the file to zero bytes first (old content is gone on the spot), 'a' appends, 'x' creates exclusively (errors if it exists, good for run-once files), 'b' binary, '+' read and write.",
        "'with open(p, \"w\", encoding=\"utf-8\") as f:' is a context manager: __enter__ hands you the file object on the way in and __exit__ closes it on the way out — including when an exception fires and including a return that leaves the block, which hand-written close() rarely guarantees.",
        "with guarantees closing, not flushing to platter: writes sit in a buffer until close or flush, so a crash can lose the tail; only where that matters do you add f.flush() plus os.fsync(f.fileno()).",
        "Never swallow a big file with read() or readlines(): 'for line in f:' is lazy iteration over the file object, one line at a time, so memory stays constant even on gigabytes of logs; for binary, read in blocks such as f.read(1024 * 1024).",
        "Prefer pathlib.Path over string concatenation: p.read_text(encoding=\"utf-8\") reads a whole file in one line, p.parent.mkdir(parents=True, exist_ok=True) creates folders, p.with_suffix(\".json\") swaps the extension, p.exists() checks — separators, relative paths and cross-platform quirks stop being memorised.",
        "Hand structured data to json and csv instead of gluing strings: json.dump(obj, f, ensure_ascii=False, indent=2) writes real Chinese rather than escape sequences, csv.DictReader needs open(..., newline=\"\") or Windows grows blank lines, and large results should stream into out.tmp then be renamed atomically so a crash cannot leave a half-written file replacing good data.",
        "Versus C++: std::ofstream closes itself in its destructor (RAII) and flushes when the scope ends, and the stream carries only bytes — encoding is either your UTF-8 discipline or the locale; Python separates the text and binary layers (two modes, str versus bytes), which forces you to think about encoding once and pays for it by leaving file handles to the garbage collector when you forget with."
      ],
      code: `import csv
import json
from pathlib import Path

SRC = Path("data/scores.csv")

def read_lines(path):
    # 惰性逐行：文件多大都不影响内存占用
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            yield line.rstrip()

def read_csv(path):
    # newline 交给 csv 模块自己处理，Windows 上才不会多出空行
    with open(path, "r", encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))

def dump_json(obj, path):
    out = Path(path)
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_suffix(".tmp")
    # ensure_ascii 关掉才写中文，而不是转义序列
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    # 原子替换：中途崩溃也不会留下半成品盖掉旧结果
    tmp.replace(out)

if __name__ == "__main__":
    rows = read_csv(SRC)
    dump_json({"count": len(rows)}, "out/summary.json")`,
      pit: "`w` 模式在 `open()` 那一刻就把文件清空了——不是你 `write()` 失败才丢的。先打开输出文件、后面才计算数据的写法，一旦中途抛异常，原始数据已经没了；要么先算完再开文件，要么写临时文件再改名。",
      pit_en: "'w' empties the file at the moment open() runs, not when write() fails. Any code that opens the output first and computes afterwards has already destroyed the original contents if it raises halfway; compute first, or write a temp file and rename.",
      ex: {
        q: "`read_lines` 是个生成器，为什么文件句柄可能比你预期的更晚关闭？",
        a: "因为 `with` 的 `__exit__` 只在生成器跑到结尾或被 close 时才执行；只取前几行就把生成器丢掉，文件会一直开着，直到引用计数归零触发清理。",
        q_en: "read_lines is a generator — why may its file handle stay open longer than you expect?",
        a_en: "Because the with-block's __exit__ runs only when the generator reaches the end or is closed; consume a few lines and drop the generator and the file stays open until the reference count finally drops to zero."
      }
    },

    "p3-5": {
      min: 12,
      summary: [
        "Python 的异常是**对象**：`raise ValueError(\"x\")` 抛一个实例，`except ValueError as e` 按类型匹配，处理者沿调用栈向外找；一路没人接就打印 traceback 并以非 0 退出码结束——结构和 C++ 的 throw/catch 同构，但 Python 用得频繁得多。",
        "层级必须看清：`BaseException` ← `Exception` ← `OSError` / `ValueError` / `TypeError` …；`KeyboardInterrupt` 和 `SystemExit` 直接继承 `BaseException`，所以 `except Exception` 接不住 Ctrl+C，而裸 `except:`（或 `except BaseException`）连「用户要退出」一起吞掉。",
        "捕获粒度要能回答「这里为什么会出错」：`except FileNotFoundError` 处理「配置还没生成」、`except json.JSONDecodeError` 处理「文件在但内容坏了」；两条恢复路径不同就不能合并成一句 `except Exception: print(\"出错了\")`。",
        "`else` 只在 try 块**没抛异常**时执行，适合放「成功了才做的事」（它里面的异常不会被自己的 except 吞掉）；`finally` 无论如何都执行，包括从 try 里 `return` 出去之后——而 `finally` 里再写 `return` 会把正在传播的异常直接丢掉，这是语言级地雷。",
        "重抛与因果链：裸 `raise` 原样重抛并保留栈信息，`raise ConfigError(msg) from e` 会留下「由哪个异常引起」的原因链；只写 `raise ConfigError(str(e))` 会抹掉原始类型和出错行号，排查时链条断在半路。",
        "Python 的惯用风格是 EAFP（先做，失败再处理）而不是 LBYL（先检查再做）：`try: v = int(s)` 比 `if s.isdigit()` 更准（能处理 `-3` 和空格），也没有「检查完到使用之间文件被别的进程改了」的竞态；`dict.get(k, default)` 和 `contextlib.suppress(FileNotFoundError)` 是它的轻量版。",
        "自定义异常：从 `Exception` 派生、名字以 `Error` 结尾、在模块顶层导出一个小区分层级（`AppError` → `DataError` / `NetError`）；库要把错误抛出去让调用方决策，而不是自己 print 一句然后返回 None。",
        "与 C++ 对照：C++ 用零成本异常模型，不抛时几乎没有开销，但一抛出就要走栈展开、且大量底层接口约定 no-throw，所以性能路径普遍改用 `std::error_code` / `std::expected`；Python 抛出要构造对象并采集栈（相对更慢），可语言本身就拿异常驱动控制流（`for` 靠 `StopIteration` 结束），所以「用异常做流程控制」在 Python 是正常写法，在 C++ 是禁忌。"
      ],
      summary_en: [
        "A Python exception is an object: raise ValueError('x') throws an instance, except ValueError as e matches by type, and handlers are searched outward along the call stack; if nobody catches it, the traceback prints and the process exits non-zero — structurally like C++ throw/catch, but used far more often in Python.",
        "Know the hierarchy: BaseException <- Exception <- OSError / ValueError / TypeError ...; KeyboardInterrupt and SystemExit derive straight from BaseException, so 'except Exception' will not swallow Ctrl+C while a bare 'except:' (or except BaseException) swallows the user's wish to quit too.",
        "Granularity should answer 'why can this fail here': FileNotFoundError means 'the config was never created', json.JSONDecodeError means 'the file exists but its content is broken'; two different recoveries must not collapse into one 'except Exception: print(\"something failed\")'.",
        "else runs only when the try block raised nothing, ideal for 'do this on success' (its own exceptions are not swallowed by your except); finally always runs, even after a return escapes the try — and a return inside finally discards the exception in flight, a language-level landmine.",
        "Re-raising and causality: a bare 'raise' rethrows unchanged with its stack, 'raise ConfigError(msg) from e' records which exception caused this one; writing only raise ConfigError(str(e)) erases the original type and line number, breaking the trail halfway.",
        "The idiomatic style is EAFP (do it, handle failure) rather than LBYL (check first): 'try: v = int(s)' beats 'if s.isdigit()' because it also handles '-3' and whitespace and leaves no window between check and use (TOCTOU); dict.get(k, default) and contextlib.suppress(FileNotFoundError) are its lightweight forms.",
        "Custom exceptions: derive from Exception, name them with an Error suffix, export a small module-level hierarchy (AppError -> DataError / NetError); a library throws and lets the caller decide, instead of printing a line and returning None.",
        "Versus C++: C++ uses a zero-cost model, so nothing is paid until something throws, but throwing unwinds the stack and many low-level APIs promise no-throw, which is why hot paths return std::error_code or std::expected; Python builds an object and captures the stack (comparatively slow), yet the language itself drives control flow with exceptions (a for loop ends on StopIteration), so exceptions-as-control-flow is normal Python and a taboo in C++."
      ],
      code: `import json
import traceback
from pathlib import Path

class AppConfigError(Exception):
    # 库只抛类型明确的异常，怎么处理留给调用方
    pass

def load_config(path):
    p = Path(path)
    try:
        raw = p.read_text(encoding="utf-8")
        data = json.loads(raw)
    except FileNotFoundError as e:
        # from e 保留原因链，traceback 会写明这是由上一个异常引起的
        raise AppConfigError("配置文件不存在：" + str(p)) from e
    except json.JSONDecodeError as e:
        raise AppConfigError("配置文件不是合法 JSON") from e
    else:
        # 成功了才做的事放 else，不要塞进 try 里被自己的 except 吞掉
        print("loaded", p.name)
    return data

if __name__ == "__main__":
    try:
        cfg = load_config("app.json")
    except AppConfigError as e:
        print("启动失败：", type(e).__name__, e)
    except Exception:
        # 兜底放最后，而且要么记日志要么裸 raise，绝不写 pass
        print("未预期的错误：", traceback.format_exc())
        raise`,
      pit: "写 `except Exception:` 后面跟 `pass`（或只 print 一句话）：程序「不崩了」，实际是数据没写进去、缓存没刷新、状态停在中间。半年后你面对一套「有时对有时错」的系统，唯一能确定的是异常曾经被吃掉过，而现场没有留下任何痕迹。",
      pit_en: "Writing 'except Exception:' followed by pass (or a lone print): the program stops crashing, but the data never landed, the cache never refreshed and the state is stuck mid-way. A year later you maintain a system that is 'sometimes right', and the only certainty is that exceptions were eaten with no trace left behind.",
      ex: {
        q: "为什么「先 `if p.exists()` 再 `open(p)`」反而不如直接 `try: open(p)`？",
        a: "因为检查和使用之间存在窗口期，文件可能在这两步之间被删除或替换（TOCTOU 竞态），而 `try/except FileNotFoundError` 一次原子地解决问题，还少一次系统调用。",
        q_en: "Why is 'if p.exists()' followed by open(p) worse than just try: open(p)?",
        a_en: "Because a window opens between check and use: the file can be deleted or swapped in those two steps (TOCTOU), whereas try/except FileNotFoundError settles it atomically and costs one fewer system call."
      }
    },

    "p3-6": {
      title: "综合重构：把函数、模块、文件串成一个能跑的脚本",
      title_en: "Synthesis: Wiring Functions, Modules and Files Into a Working Script",
      min: 15,
      target: "能独立搭出「逐行读文本 → 纯函数清洗 → 聚合统计 → JSON 原子落盘」的小工具，并逐条口头自查本章六个高频翻车点。",
      target_en: "Build a small tool that reads text line by line, cleans it with pure functions, aggregates and writes JSON atomically — then talk through this chapter's six recurring failures from memory.",
      summary: [
        "本章只有一条数据流值得背下来：读（`with` + 显式 `encoding=\"utf-8\"` + 惰性逐行）→ 清洗（纯函数，可选参数用 None 哨兵）→ 聚合（dict / Counter）→ 写（先 `.tmp` 再 `replace()` 原子改名）。四步各一个函数，`main()` 只负责接线，超过 40 行的 main 就是设计信号。",
        "最小可运行结构：`tool/` 包目录 + `tool/__init__.py` + `tool/cli.py`（末尾放 `if __name__ == \"__main__\":`）+ 版本钉住的 `requirements.txt` + `data/`；用 `python -m tool.cli` 运行，相对导入与路径解析才不会变成玄学。",
        "六个高频翻车点自查：可变默认参数被所有调用共享 / 闭包晚绑定拿到最后一次的值 / import 触发模块顶层副作用 / `w` 模式在打开那一刻清空原文件 / 忘了 `encoding` 换机器就乱码 / `except Exception: pass` 吞掉真 bug。每一条都能在前面五节里找到对应的代码形状。",
        "把自查升级成可执行动作：默认参数一律写 `=None`；`encoding` 抽成模块常量只出现一次；except 至少要 `raise` 或记日志；输出统一走临时文件 + `replace()`；文件一律 `for line in f` 而不是 `readlines()`；脚本开头用一段注释写清它读什么、写什么、失败时怎样。",
        "与 C++ 路线的总账（同一件事、两种代价）：`#include` 编译期文本复制 vs `import` 运行期执行一次并缓存；RAII 析构的确定性释放 vs `with` 的确定性退出；函数签名与模板重载在编译期定死 vs `*args/**kwargs` 运行期鸭子式接收；退出码与 `std::error_code` vs 异常驱动控制流；头文件加构建清单管依赖 vs venv 加 requirements 管依赖。",
        "什么时候该回头补：脚本超过三百行、函数互相 import、开始想「要不要写个类」——说明需要下一章的组织方式；慢到不能接受时先换数据结构和算法，再上 NumPy 向量化（sp1），真的需要控制内存布局和毫秒级延迟才回到 C++ 路线。",
        "前置与去向：本章的输入全是 py2 的 list / dict / str 与切片、条件与循环，输出直接喂给 py4（把函数升级成对象、把 dict 升级成 dataclass）；C++ 路线的对应章节是 s5 函数与 s15 文件操作——两条线在这里练的是同一套工程直觉，只是拼写不同。"
      ],
      summary_en: [
        "One data pipeline is worth memorising from this chapter: read (with + explicit encoding=\"utf-8\" + lazy line iteration) -> clean (pure functions, None sentinels for optional args) -> aggregate (dict / Counter) -> write (a .tmp file then an atomic replace). One function per stage, main() only wires them, and a main longer than forty lines is a design signal.",
        "The minimal runnable layout: a tool/ package with tool/__init__.py, tool/cli.py ending in 'if __name__ == \"__main__\":', a pinned requirements.txt and a data/ folder; run it as 'python -m tool.cli' so relative imports and path resolution stop being guesswork.",
        "Six recurring failures to self-check: a mutable default shared by all calls / a late-binding closure that only sees the last value / an import that triggers top-level side effects / 'w' mode truncating the source the instant open() runs / a missing encoding that garbles text on another machine / 'except Exception: pass' that swallows the real bug. Each maps back to a code shape in the five earlier lessons.",
        "Turn the checklist into defaults: optional args are always =None; encoding appears exactly once as a module constant; every except either re-raises or logs; all output goes through a temp file plus replace(); files are read with 'for line in f' rather than readlines(); the script header states in prose what it reads, what it writes and what failure looks like.",
        "The running total against the C++ track (same problem, two price tags): #include copies text at compile time versus import executing once and caching; RAII destructors give deterministic release versus with giving deterministic exit; signatures and template overloads are frozen at compile time versus *args/**kwargs accepting anything at run time; exit codes and std::error_code versus exception-driven control flow; headers plus a build list versus venv plus requirements.txt for dependency management.",
        "When to come back and re-read: the script passes three hundred lines, functions import each other, or you start wondering about a class — that is next chapter's job. When it is too slow, change data structures and algorithms first, then vectorise with NumPy (sp1); only genuine memory-layout and millisecond budgets justify switching back to the C++ track.",
        "Prerequisites and where this goes: everything in this chapter is fed by py2 (list / dict / str, slicing, conditions, loops) and feeds py4 (functions become objects, dicts become dataclasses); on the C++ track the counterparts are s5 functions and s15 file I/O — the two routes drill the same engineering instinct with different spelling."
      ],
      code: `# stats.py —— 本章骨架的完整落地：读、清洗、聚合、写，各占一个函数
import json
from collections import Counter
from pathlib import Path

ENCODING = "utf-8"

def parse_line(line):
    # 纯函数：一行文本换成 dict 或 None，不碰文件也不改全局
    parts = line.strip().split(",")
    if len(parts) != 2:
        return None
    name, raw = parts
    try:
        score = int(raw)
    except ValueError:
        return None
    return {"name": name.strip(), "score": score}

def read_rows(path):
    # 惰性逐行，文件大小不影响这一层的内存
    with open(path, "r", encoding=ENCODING) as f:
        for line in f:
            row = parse_line(line)
            if row is not None:
                yield row

def summarize(rows):
    total = 0
    counter = Counter()
    for r in rows:
        total += r["score"]
        counter[r["name"]] += 1
    n = sum(counter.values())
    return {"count": n, "avg": round(total / n, 2) if n else 0.0,
            "top": counter.most_common(3)}

def write_json(obj, path):
    out = Path(path)
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_suffix(".tmp")
    with open(tmp, "w", encoding=ENCODING) as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    # 原子替换：中途崩溃时旧结果仍然完整可用
    tmp.replace(out)

if __name__ == "__main__":
    result = summarize(read_rows("data/scores.csv"))
    write_json(result, "out/summary.json")
    print(result)`,
      pit: "把「能跑」当「完成」：脚本在你这台机器、这份数据上跑通了就提交，于是换机器时因为缺 `encoding` 读出乱码、因为没 pin 版本装上不兼容的库、因为 `w` 模式把别人手工整理的源数据清空。收口课要交付的是这三件事——可复现的运行方式、写清楚的数据契约、错了能发现的日志。",
      pit_en: "Treating 'it ran' as 'it is done': the script works on your machine with your file, so you commit, and on another machine it reads mojibake for want of an encoding, installs an incompatible library for want of a pin, and wipes someone's hand-cleaned source data with 'w' mode. What this closing lesson actually delivers is three things — a reproducible way to run it, a written data contract, and logs that make failure visible.",
      ex: {
        q: "为什么这一章的四步要严格分成四个函数，而不是写成一段顺流而下的脚本？",
        a: "因为分开之后每一步都能单独喂假数据测试（清洗函数只吃字符串、聚合函数只吃可迭代对象），而一体化的脚本要验证任何一步都必须先造出完整文件，成本差一个数量级。",
        q_en: "Why split the four stages into four functions instead of one straight-line script?",
        a_en: "Because once separated, each stage can be fed fake data on its own (the cleaner takes a string, the aggregator takes any iterable), while an all-in-one script forces you to build a complete file before you can test any single part — an order of magnitude more expensive."
      }
    },

    /* ===================== py4 面向对象与常用库 ===================== */
    "p4-1": {
      min: 13,
      summary: [
        "`class` 同样是运行期语句（承接 py3：类里的方法就是 p3-1 的函数对象，`self.__dict__` 就是 py2 的 dict，前两章是读懂它的钥匙）：类体执行完得到一个类对象（`type` 的实例），里面的赋值成为**类属性**、`def` 成为挂在类上的函数——这些都能用 `Cls.__dict__` 亲眼看到，别把它当成编译期的蓝图。",
        "`self` 不是关键字，只是「第一个位置参数」的约定名：`obj.m(3)` 实际执行的是 `Cls.m(obj, 3)`，所以漏写 self 报的是「takes 1 positional argument but 2 were given」，而显式写 `Cls.m(obj, 3)` 完全合法——理解这一条，绑定方法就不再神秘。",
        "属性查找顺序是「实例字典 → 类字典 → 基类链」：`obj.x` 读得到类属性，但 `obj.x = 1` 是**在实例上新建**一个 x，永远不会改动类上那份；把「读」和「写」误当成同一件事，是所有共享状态 bug 的起点。",
        "类属性放可变对象就是埋雷：`class Cache: hits = []` 之后在方法里 `self.hits.append(k)` 改的正是类上那个列表，所有实例（包括以后新建的）一起看见它变长；可变状态必须在 `__init__` 里 `self.hits = []` 各自新建。",
        "`__init__` 不是构造函数而是**初始化器**：它收到一个已经创建好的实例、负责填字段、返回 None；真正的创建由 `__new__`（静态方法，分配对象并返回实例）完成，只有不可变类型的子类、单例和元编程才会碰它，而 `__init__` 里 `return 别的东西` 会立刻 TypeError。",
        "`__repr__` 写给开发者（形如 `Point(x=1, y=2)`，能照抄重建），`__str__` 写给终端用户；只写 `__repr__` 时 `print` 会退用它，反之不会。不写 `__repr__` 的调试输出是 `<__main__.Point object at 0x7f...>`，等于什么也没说。",
        "自省优先于猜测：`isinstance(x, C)` 认继承关系（注意 `bool` 是 `int` 的子类，`isinstance(True, int)` 为真，这是常考陷阱），`type(x) is C` 只认同一个类；`vars(obj)` 看实例字典、`dir(obj)` 看可见名字，比翻源码快得多。",
        "与 C++ 对照：C++ 成员函数的 `this` 是编译器塞进去的隐式参数，既漏不掉也不能手写，用错对象调成员是未定义行为；Python 的 self 是运行期的普通第一参数，可以漏（当场 TypeError）、可以显式传、甚至可以传错类型（撑到方法体内某行才炸）。内存上 C++ 对象是紧凑布局、成员偏移编译期定死，Python 每个实例自带一张哈希表 `__dict__`，灵活到能随手加字段，但每对象多几十字节起步——这正是 `__slots__` 存在的理由。"
      ],
      summary_en: [
        "'class' is also a runtime statement (continuing from py3: a method is just the p3-1 function object, and self.__dict__ is just a py2 dict — the two earlier chapters are the key to reading this one): running the body yields a class object (an instance of type), where assignments become class attributes and defs become functions stored on the class — all visible in Cls.__dict__, so do not picture it as a compile-time blueprint.",
        "self is not a keyword but a conventional name for the first positional parameter: obj.m(3) really executes Cls.m(obj, 3), which is why forgetting self produces 'takes 1 positional argument but 2 were given' and why calling Cls.m(obj, 3) explicitly is perfectly legal — once this clicks, bound methods stop being mysterious.",
        "Attribute lookup walks instance dict -> class dict -> base class chain: obj.x can read a class attribute, but obj.x = 1 creates a new x on the instance and never touches the class copy; confusing the read with the write is where every shared-state bug begins.",
        "A mutable class attribute is a buried mine: after 'class Cache: hits = []', a method doing self.hits.append(k) mutates the single list on the class, and every instance — including ones created later — watches it grow. Mutable state must be created per instance inside __init__.",
        "__init__ is an initialiser, not a constructor: it receives an already-created instance, fills fields and returns None; creation itself is __new__ (a static method that allocates and returns the instance), which only immutable subclasses, singletons and metaprogramming should touch — and returning anything other than None from __init__ raises TypeError immediately.",
        "__repr__ is written for developers (something like Point(x=1, y=2) you could paste back) and __str__ for end users; print falls back to __repr__ when __str__ is missing, never the other way round. Without __repr__ your debugger output is '<__main__.Point object at 0x7f...>', which says nothing.",
        "Prefer introspection over guessing: isinstance(x, C) honours inheritance (and bool really is a subclass of int, so isinstance(True, int) is True — a favourite gotcha), while 'type(x) is C' accepts one exact class; vars(obj) shows the instance dict and dir(obj) shows visible names, both far faster than scrolling through source.",
        "Versus C++: this is an implicit parameter the compiler injects — you cannot omit it, cannot write it yourself, and invoking a member on the wrong object is undefined behaviour — whereas Python's self is an ordinary runtime parameter you can forget (instant TypeError), pass explicitly, or even pass with the wrong type (surviving until some line inside the method). C++ objects are compact with member offsets fixed at compile time; every Python instance carries a hash table called __dict__, so you may bolt on attributes at any moment but pay tens of bytes per object — which is exactly what __slots__ is for."
      ],
      code: `class Cart:
    # 反面示范：可变对象放在类属性上，整个类共享同一份
    shared_items = []

    def __init__(self, owner):
        self.owner = owner
        # 每个实例自己的列表必须在这里新建
        self.items = []

    def add(self, name):
        self.items.append(name)

    def add_by_mistake(self, name):
        # 少了上一行的初始化，append 就落到类属性那份，别的实例也看得见
        Cart.shared_items.append(name)

    def __repr__(self):
        return "Cart(owner={!r}, items={!r})".format(self.owner, self.items)

class Point:
    COUNT = 0

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def show(self):
        # 类体不在 LEGB 链上，方法里必须写类名或 self 才拿得到 COUNT
        return Point.COUNT

if __name__ == "__main__":
    c1 = Cart("甲")
    c2 = Cart("乙")
    c1.add("键盘")
    c2.add_by_mistake("鼠标")
    print(c1, c2)
    print(Cart.shared_items)
    print(isinstance(True, int), isinstance(1, bool))
    print(Point(1, 2).show(), vars(c1))`,
      pit: "把可变默认值写在类属性上（`items = []`）或方法签名上（`def __init__(self, items=[])`），实例看起来各有一份，实际共用同一个列表：A 用户加的商品出现在 B 用户的购物车里。判据很简单——凡是「每个对象自己一份」的可变字段，只能在 `__init__` 里赋。",
      pit_en: "Putting a mutable default on a class attribute (items = []) or in a signature (def __init__(self, items=[])) means instances look separate but share one list, so user A's product shows up in user B's cart. The rule is simple: any mutable field that belongs to one object must be assigned inside __init__.",
      ex: {
        q: "`obj.total += 1` 为什么常常没有改到类属性 `total`？",
        a: "因为 augmented assignment 会先读（读到类属性那份）再写，而写永远发生在实例字典上，于是第一次就创建了一个同名的实例属性，类上那份从头到尾没动。",
        q_en: "Why does 'obj.total += 1' usually leave the class attribute total untouched?",
        a_en: "Because augmented assignment reads first (landing on the class attribute) and then writes, and writes always go into the instance dict — so the very first += creates an instance attribute of the same name while the class one never changes."
      }
    },

    "p4-2": {
      min: 12,
      summary: [
        "Python 的封装是**约定**而非强制：`_x` 表示「内部实现、外部别依赖」（`from m import *` 会跳过下划线开头的名字），`__x` 触发名称改写变成 `_Cls__x`，它防的是子类撞名，不是越权访问。",
        "真正该保护的是**不变量**：余额不能为负、起止日期要有序、缓存必须随字段失效。把这些校验收进方法或 setter，让对象在任何时刻都处于合法状态；「把字段藏起来」只是手段，不是目的。",
        "`@property` 把方法伪装成属性：读 `obj.area` 实际执行函数，`@area.setter` 里做校验，不写 setter 它就是只读字段。它最大的价值是**接口不变**——从公开字段改成计算字段，调用方一行都不用改。",
        "property 有两个真实陷阱：里面访问尚未赋值的字段时抛的 AttributeError 会被属性查找协议当成「这层没找到」而静默降级；以及它每次访问都重新计算，昂贵计算要缓存（`functools.cached_property`），而缓存立刻带来失效问题。",
        "三种方法各有分工：实例方法（`self`，读写状态）、`@classmethod`（`cls`，工厂方法与可继承的构造入口，如 `Event.from_row(row)`）、`@staticmethod`（没有隐式参数，只是住在类命名空间里的普通函数；如果从来不用 self 和 cls，通常说明它应该是模块级函数）。",
        "这套机制的底座是描述器协议：`__get__` / `__set__` 让 property、classmethod、方法绑定统一成「属性访问时发生了什么」，`__getattr__` 负责转发（代理对象、ORM 字段、懒加载都靠它）；所以 `obj.x = 1` 究竟去了哪里是有完整规则的，不是玄学。",
        "别把「私有」当安全边界：`obj._Cls__x`、`vars(obj)`、`pickle` 全都绕得过去；安全必须在进程外做（输入校验、权限判定、沙箱）。下划线解决的是协作问题——「谁有资格改这个字段」，不是敌手问题。",
        "与 C++ 对照：C++ 的 private 由编译器强制执行（除 friend 与 UB 外无处可访问），代价是成员布局进入 ABI，改一个私有字段常常要重编所有包含该头文件的单元；Python 没有任何编译期访问检查，重构字段无需通知调用方重编，但「请勿触碰」只能靠约定和 code review——一个把自由留给运行期，一个把保证前移到编译期。"
      ],
      summary_en: [
        "Encapsulation in Python is convention, not enforcement: _x means 'internal, do not depend on this' (from m import * skips leading-underscore names) and __x is rewritten to _Cls__x, which guards against subclass name clashes, not against unauthorized access.",
        "What really needs protecting is the invariant: balance cannot go negative, start must precede end, the cache must fall out of sync when a field changes. Fold those checks into methods or setters so the object is legal at every instant; hiding fields is the means, not the goal.",
        "@property dresses a method up as an attribute: obj.area executes a function, @area.setter validates on write, and omitting the setter makes it read-only. Its biggest payoff is interface stability — turning a stored field into a computed one requires zero changes at call sites.",
        "Properties have two real traps: an AttributeError raised inside one (from a field not yet assigned) is interpreted by the lookup protocol as 'not found here' and silently degrades, and a property recomputes on every access, so expensive work needs caching (functools.cached_property) — which immediately introduces a staleness problem.",
        "The three method flavours split the work: instance methods (self, reading and writing state), classmethods (cls, factory constructors that keep working under inheritance, e.g. Event.from_row(row)) and staticmethods (no implicit parameter at all, just a plain function living in the class namespace; if it never uses self or cls, it probably belongs at module level).",
        "The substrate is the descriptor protocol: __get__ / __set__ unify property, classmethod and method binding into one question — 'what happens when this attribute is accessed' — and __getattr__ handles forwarding (proxies, ORM fields, lazy loading all rely on it), so where obj.x = 1 actually goes has complete rules, not folklore.",
        "Do not treat 'private' as a security boundary: obj._Cls__x, vars(obj) and pickle all route around it; security must live outside the process (input validation, permission checks, sandboxing). Underscores settle a collaboration question — who is allowed to change this field — not an adversary question.",
        "Versus C++: private is compiler-enforced (inaccessible except through friend or undefined behaviour), and the price is that member layout becomes part of the ABI, so changing one private field often forces a rebuild of every translation unit including that header; Python performs no compile-time access check, so refactoring a field never asks callers to rebuild, but 'do not touch' survives only as convention and review — one language keeps the freedom at run time, the other buys the guarantee up front at compile time."
      ],
      code: `class Order:
    def __init__(self, no, amount):
        self.no = no
        self._discount = 0.0
        # 先走 setter 再存字段，构造出来的对象就已经合法
        self.amount = amount

    def _check(self, value):
        # 校验只有一份，构造、赋值、外部改都走这里
        if value < 0:
            raise ValueError("金额不能为负")
        return float(value)

    @property
    def amount(self):
        return self._amount

    @amount.setter
    def amount(self, value):
        self._amount = self._check(value)

    @property
    def final_price(self):
        # 只读接口：没有 setter，赋值会 AttributeError
        # 每次访问都重算，昂贵逻辑不要塞进这里
        return round(self._amount * (1 - self._discount), 2)

    @classmethod
    def from_row(cls, row):
        # 工厂方法：知道怎么从一行原始数据把自己造出来
        return cls(row["no"], float(row["amount"]))

if __name__ == "__main__":
    o = Order.from_row({"no": "A-1", "amount": "199"})
    o.amount = 200
    print(o.final_price, isinstance(o, Order))
    # 只读字段写不进去，下一行会抛 AttributeError
    # o.final_price = 100
    # 负数当场被拦下，对象不会进入非法状态
    # o.amount = -5`,
      pit: "把 `__x` 当成安全机制：名称改写只是让子类不撞名，外部用 `obj._Cls__x`、`vars(obj)` 或 `pickle` 照样读写；如果某段代码依赖「私有字段不可见」来做权限判断或密钥保护，它其实完全没有保护——真正的外部边界必须自己做校验。",
      pit_en: "Treating __x as a security mechanism: name mangling only prevents subclass clashes; obj._Cls__x, vars(obj) and pickle all read and write it anyway. Any permission check or secret protection that relies on 'callers cannot see this field' is protecting nothing — real boundaries have to be enforced by your own validation.",
      ex: {
        q: "为什么 property 里访问一个尚未赋值的字段，报的是「没有这个属性」而不是它内部的错误？",
        a: "因为属性查找把 AttributeError 解释成「这一层没找到」的信号，会继续沿着类与基类往下找，全部落空后才把 AttributeError 交给调用方，于是内部的初始化缺失被伪装成了属性不存在。",
        q_en: "Why does a property reading an unassigned field report 'no such attribute' instead of the error inside it?",
        a_en: "Because attribute lookup treats AttributeError as the signal for 'not found at this layer' and keeps walking the class and base classes; only after all of them miss does it hand the AttributeError to the caller, so a missing initialisation inside the property is disguised as a nonexistent attribute."
      }
    },

    "p4-3": {
      min: 13,
      summary: [
        "继承只做两件事：属性查找沿 `__mro__` 链（这里没有就往父类走）+ 让 `isinstance` / `issubclass` 成立。它不带来任何性能或内存收益，所以判断标准只剩一个：这是不是真的 is-a。",
        "`super()` 的语义不是「父类」而是「MRO 上的下一个」：只要每一层都调用 `super().__init__()`，菱形结构里最顶层的 `object.__init__` 恰好执行一次；漏写一环，排在它后面的所有类就全被跳过，表现为「父类字段莫名其妙是空的」。",
        "MRO 由 C3 线性化算出，`Cls.__mro__` 可以直接打印验证；`class D(B, A)` 与 `class D(A, B)` 决定同一个名字先命中谁，若约束冲突排不出线性化，Python 当场 `TypeError: Cannot create a consistent method resolution order`，不会偷偷替你猜一个顺序。",
        "通行约定是 Mixin 写在左边、主基类写在右边（`class View(JsonMixin, BaseView)`），Mixin 不假设自己排在初始化链首位、也不该有自己的 `__init__` 依赖；继承层级超过三层就该停下来问一句：是不是设计歪了。",
        "重写必须守住里氏替换：参数不能收紧、返回类型不能变窄、不能新增调用方没被告知的异常。否则 `isinstance` 全过但行为不同，这类 bug 只在重构后、被多态调用的地方冒出来，是深继承系统里最贵的一种。",
        "组合优于继承的可执行判据：想「复用实现」而不是「确实是一种」，就把对象放进字段并显式转发方法（或用 `__getattr__` 委托）。继承会把父类的私有细节、初始化顺序、以后新增的方法一起接过来，改动半径远大于委托。",
        "抽象基类把接口约定变成运行期检查：`class Shape(ABC)` 加 `@abstractmethod` 之后，子类漏实现就在实例化时 `TypeError: Can't instantiate abstract class`；配合 `__len__` / `__iter__` / `__getitem__` 与 `collections.abc`，可以接受任何「长得像容器」的对象而不必真是 list。框架基类（PyTorch 的 `nn.Module`、`Dataset`）是模板方法模式：只让你覆写它预留的钩子。",
        "与 C++ 对照：C++ 默认不可覆写，要 `virtual` 才进虚表、`override` 让编译器替你确认签名对上，纯虚函数才得到抽象类，多继承还要当心菱形（两份基类子对象）和按值传参造成的对象切片；Python 所有方法默认可覆写（按名字在 MRO 上查，没有虚表这回事），变量存引用所以不存在切片，代价是拼错父类方法名要到运行时才报 AttributeError，而 C++ 的 `override` 在编译期就告诉你「你没覆上」。"
      ],
      summary_en: [
        "Inheritance does exactly two things: attribute lookup walks the __mro__ chain (missing here, try the parent) and it makes isinstance / issubclass true. It buys no performance or memory benefit, so the only remaining test is whether this really is an is-a.",
        "super() means 'the next one on the MRO', not 'the parent': if every layer calls super().__init__(), the top object.__init__ runs exactly once even in a diamond; skip one link and every class behind it is silently passed over, which shows up as parent fields mysteriously empty.",
        "The MRO comes from C3 linearisation and you can print Cls.__mro__ to check it. 'class D(B, A)' versus 'class D(A, B)' decides which class a name resolves to first, and if the constraints admit no linearisation Python raises TypeError: Cannot create a consistent method resolution order on the spot rather than guessing an order for you.",
        "The working convention puts mixins on the left and the main base on the right (class View(JsonMixin, BaseView)); a mixin must not assume it initialises first and should not depend on its own __init__. Beyond three levels of inheritance, stop and ask whether the design has tilted.",
        "Overrides must honour Liskov substitution: no tightened parameters, no narrowed return type, no exceptions the caller was never told about. Otherwise isinstance passes while behaviour differs — the kind of bug that appears only after a refactor, wherever the polymorphic call is made, and the priciest kind in deep hierarchies.",
        "An actionable rule for composition over inheritance: if you want to reuse an implementation rather than declare an is-a, hold the object in a field and forward methods explicitly (or delegate via __getattr__). Inheritance also takes the parent's private details, its initialisation order and any method added to it later, so its blast radius is far larger than delegation.",
        "Abstract base classes turn an interface contract into a runtime check: with class Shape(ABC) and @abstractmethod, a subclass that forgets an implementation fails at instantiation with TypeError: Can't instantiate abstract class. Pair __len__ / __iter__ / __getitem__ with collections.abc and you can accept anything container-shaped instead of insisting on list. Framework bases (PyTorch's nn.Module, Dataset) are template method: you may only override the hooks they left open.",
        "Versus C++: nothing is overridable by default — virtual puts a function in the vtable, override lets the compiler confirm the signature actually matches, and only pure virtuals give you an abstract class, while multiple inheritance adds diamond (two base subobjects) and object slicing when you pass by value. In Python every method is overridable (lookup by name along the MRO, no vtable involved) and, since variables hold references, slicing cannot happen; the price is that a misspelled parent method only raises AttributeError at run time, where C++'s override tells you at compile time that you never overrode anything."
      ],
      code: `from abc import ABC, abstractmethod

class Shape(ABC):
    def __init__(self, name):
        self.name = name

    @abstractmethod
    def area(self):
        ...

    def describe(self):
        return self.name + " 的面积是 " + str(round(self.area(), 2))

class Rect(Shape):
    def __init__(self, w, h):
        # super() 是「沿 MRO 问下一个」，不是「调父类」
        super().__init__("Rect")
        self.w = w
        self.h = h

    def area(self):
        return self.w * self.h

class Square(Rect):
    def __init__(self, side):
        # 漏掉这一行，name 就永远停在没被赋值的状态
        super().__init__(side, side)

class Badge:
    # 组合：把能力作为字段拿进来，而不是靠继承复用实现
    def __init__(self, shape):
        self.shape = shape

    def show(self):
        return "badge -> " + self.shape.describe()

if __name__ == "__main__":
    s = Square(3)
    print(s.describe())
    print(Badge(Rect(3, 4)).show())
    print([c.__name__ for c in Square.__mro__])
    # 抽象方法没实现，实例化当场报错而不是运行到那行才炸
    # Shape("x")`,
      pit: "重写时「顺手改了签名」：父类是 `def save(self, path=None)`，子类写成 `def save(self, path)` 或改成抛新异常——静态上完全合法，运行时调用方一旦按默认参数或不接异常来用就当场炸，而且只在多态那条分支上炸，测试常常覆盖不到。",
      pit_en: "Changing the signature while overriding: the parent has def save(self, path=None) and the subclass writes def save(self, path) or starts raising a new exception. Nothing complains statically, but at run time any caller relying on the default or not expecting the exception blows up — on the polymorphic branch only, which is exactly where tests rarely reach.",
      ex: {
        q: "为什么每一层都写 `super().__init__()` 在菱形继承里是必须的，而不是礼节性代码？",
        a: "因为 super() 按 MRO 把链一节节传下去，任何一层漏写，链条就在它身后断掉，后面的类（包括共享的那个基类）都不会被初始化，同时也没有任何报错提示。",
        q_en: "Why is calling super().__init__() at every level mandatory in diamond inheritance rather than polite boilerplate?",
        a_en: "Because super() hands the chain to the next class on the MRO; if one level omits the call the chain simply stops there, so every class behind it — including the shared base — never initialises, and nothing warns you."
      }
    },

    "p4-4": {
      min: 13,
      summary: [
        "推导式是**表达式**（有值、能嵌在函数调用里），它比等价的 `for` + `append` 快，因为不必每轮再查一次 `append` 属性；但可读上限是「一层循环 + 一个条件」，两三层嵌套或带副作用的推导式应该换回普通循环。",
        "Python 3 里推导式自带作用域：`[i for i in range(3)]` 跑完之后 `i` 并不是 2（在函数里甚至是未定义），所以想在推导式里「顺手改外层变量」是行不通的——那是 p3-2 的作用域规则在把关。",
        "三种推导式语义不同：列表推导保留顺序与重复；集合推导 `{x for ...}` 会**静默去重**（结果条数变少）；字典推导 `{k: v for ...}` 遇到重复键时**后者覆盖前者**——把 id 当键却喂进重复 id，数据就这样无声消失了。",
        "生成器表达式 `(...)` 只保存迭代状态、不保存数据：`sum(x * x for x in range(10 ** 8))` 内存基本恒定；换成方括号会先构造一个上亿元素的列表（好几个 GB）——这一对在数据处理里是生死线。",
        "生成器函数是「调用即得到惰性对象」：`gen = nums()` 时函数体一行都没执行，第一次 `next(gen)` 才跑到下一个 `yield` 并在那里挂起、局部变量原样留着；所以生成器里放打印、写文件、发消息时，「忘了消费」就等于什么都没做。",
        "生成器是一次性消耗品：耗尽后 `for` 静默地循环零次（不报错）、`next()` 抛 `StopIteration`；要遍历两次就先 `list()` 固定下来，或者把源头做成「每次调用返回新生成器」的函数；`len(gen)` 和下标 `gen[0]` 都不存在。",
        "可以串成管道：`g1 = (parse(l) for l in lines if l.strip())`、`g2 = (r[\"score\"] for r in g1)`、最后 `sum(g2)`——整条链内存恒定。`yield from` 负责把子生成器摊平，`send()` / `close()` / `GeneratorExit` 是它的协程那一面；提前 `break` 时生成器会被关闭，其中的 `finally` 仍然执行。",
        "与 C++ 对照：C++ 要做同样的惰性序列，得写迭代器类或用 C++20 ranges/view（`views::filter | views::transform`），语法成本高得多，但零额外堆分配、可内联、能被向量化；Python 生成器由编译器替你把函数体拆成状态机，写起来几乎免费，可每次 `next` 都是一层解释器调用加一次对象装箱，吞吐差一到两个数量级——省内存与跑得快是两条不同的路。"
      ],
      summary_en: [
        "A comprehension is an expression (it has a value and nests inside calls) and it beats the equivalent for-plus-append loop because the append attribute is not looked up every round; its readability ceiling, though, is one loop plus one condition — two nested levels or a comprehension with side effects should go back to being a loop.",
        "In Python 3 a comprehension has its own scope: after [i for i in range(3)] the name i is not 2 (inside a function it may not exist at all), so 'while I am here, update the outer variable' does not work — that is py3's scoping rule holding the door.",
        "The three comprehension kinds differ: a list keeps order and duplicates, a set comprehension {x for ...} deduplicates silently (the count drops), and a dict comprehension {k: v for ...} lets the later value overwrite the earlier one for a repeated key — feed it duplicate ids and rows vanish without a sound.",
        "A generator expression (...) stores iteration state, not data, so sum(x * x for x in range(10 ** 8)) keeps memory flat, whereas square brackets first build a list of a hundred million elements (several gigabytes); in data work that pair of brackets is the difference between running and dying.",
        "Calling a generator function hands back a lazy object: with gen = nums() not one line of the body has run, and the first next(gen) executes up to the next yield and suspends there with its locals intact — which is why print, file writes or messages queued inside a generator simply never happen if nobody consumes it.",
        "A generator is single-use: once exhausted a for loop over it iterates zero times (silently, no error) and next() raises StopIteration; to traverse twice, freeze it with list() first, or make the source a function that returns a fresh generator each call; neither len(gen) nor gen[0] exists.",
        "Generators compose into pipelines: g1 = (parse(l) for l in lines if l.strip()), g2 = (r[\"score\"] for r in g1), then sum(g2) with constant memory across the whole chain. yield from flattens a sub-generator, send() / close() / GeneratorExit are its coroutine face, and breaking out early closes the generator while its finally still runs.",
        "Versus C++: the same lazy sequence in C++ means writing an iterator class or using C++20 ranges and views (views::filter | views::transform) — far more syntax, but no extra heap allocation, inlinable and vectorisable; a Python generator has the compiler turn your function body into a state machine for nearly free, yet every next() is an interpreter round trip plus boxed objects, one or two orders of magnitude lower in throughput. Saving memory and running fast are different roads."
      ],
      code: `from pathlib import Path

def parse_rows(lines):
    # 生成器：只有被消费时才干活，全程不构造大列表
    for line in lines:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        name, _, raw = line.partition(",")
        yield {"name": name, "score": int(raw)}

def names_from(path):
    with open(path, "r", encoding="utf-8") as f:
        # 三层惰性管道：读文件、过滤、取字段，内存与文件大小无关
        valid = (r for r in parse_rows(f) if r["score"] >= 0)
        return [r["name"] for r in valid]

if __name__ == "__main__":
    squares = (x * x for x in range(5))
    print(sum(squares))
    print(list(squares))
    words = ["a", "bb", "ccc", "bb"]
    print({w: len(w) for w in words})
    print({len(w) for w in words})
    print(names_from(Path("data.txt")))`,
      pit: "把生成器当容器用了两次：第一次 `sum(gen)` 或 `for` 之后它已经耗尽，第二次 `for` 静默地循环零次、`next()` 抛 StopIteration——在统计代码里表现为「结果怎么全是 0」而没有任何报错。要复用就先 `list()`，或者做成每次返回新生成器的函数。",
      pit_en: "Using a generator twice as if it were a container: after sum(gen) or one for loop it is exhausted, so the second for loop silently iterates zero times and next() raises StopIteration — in analytics code that reads as 'why is every result 0' with no error anywhere. Freeze it with list() first, or expose a function that returns a fresh generator each time.",
      ex: {
        q: "为什么 `sum(x * x for x in range(10 ** 8))` 内存不涨，而 `[x * x for x in range(10 ** 8)]` 会把机器打死？",
        a: "因为前者只在 `sum` 每次索要一个值时算一个（生成器保存的是 range 的迭代状态），后者要先把一亿个整数对象全部装进列表再交给 `sum`，凭空多出一份完整的中间容器。",
        q_en: "Why does sum(x * x for x in range(10 ** 8)) keep memory flat while [x * x for x in range(10 ** 8)] brings the machine down?",
        a_en: "The former computes one value each time sum asks for one (the generator only carries the range's iteration state), while the materialises a hundred million integer objects into a list before sum ever starts — a full intermediate container for nothing."
      }
    },

    "p4-5": {
      min: 14,
      summary: [
        "`collections` 补的是内置容器差的最后一步：`defaultdict(list)` 省掉「键不存在要先建表」，`Counter(words).most_common(5)` 一行词频，`deque` 两端 O(1)（`list.pop(0)` 是 O(n)，这是最常见的一类性能坑），`namedtuple` 给元组字段名且不可变，`ChainMap` 把多层默认值叠起来查。",
        "`@dataclass` 是「少写样板」的正解：自动生成 `__init__` / `__repr__` / `__eq__`，`frozen=True` 换来不可变（也才可能被 hash），而 `field(default_factory=list)` 正是可变默认值的官方修法——直接写 `items: list = []` 会在类定义时就 TypeError，这是设计者故意拦下来的。",
        "`itertools` 提供惰性组合件：`chain` 串起多个可迭代对象、`product` / `combinations` / `permutations` 做枚举、`islice` 惰性取前 N（生成器不能下标）、`accumulate` 求前缀和；而 `groupby` **要求数据已按同一个键排好序**，否则同一个键会被拆成好几段，看起来像漏统计。",
        "`functools` 是函数式那一半：`partial` 预置参数（顺手也能解决晚绑定）、`lru_cache(maxsize=None)` 一行做记忆化（参数必须可哈希；拿来装饰方法会因 `self` 长期住在全局缓存里而拖住整个实例）、`reduce`、`cached_property`、`total_ordering` 少写四个比较方法。",
        "`datetime` 只有两条铁律，但违反任何一条都会出事故：只用带时区的时间（`datetime.now(timezone.utc)`；naive 与 aware 相减直接 TypeError，两个 naive 跨机器比较则算错），以及存储与日志一律 UTC + ISO 8601 字符串、只在展示层 `.astimezone()` 转本地。",
        "日期时间还要配上下工具：`strptime` / `strftime` 负责和字符串互转（`%Y-%m-%d %H:%M`），跨月跨年加减用 `timedelta` 或 dateutil 的 `relativedelta`（别按「一个月 30 天」自己算），时间戳用 `timestamp()` 与 `fromtimestamp(ts, tz=...)`，不要拿秒数硬除以 86400 再假定对齐到零点。",
        "`json` 已经是模型输入输出、工具调用与配置文件的事实格式：`dumps` / `loads` 作用于字符串、`dump` / `load` 作用于文件对象（`ensure_ascii=False` 才写中文）；`datetime` 和自定义对象不是 JSON 类型，必须显式转成 ISO 字符串或用 `default=` / 自定义 `JSONEncoder`，别指望它自己猜。",
        "「标准库优先」的判据与 C++ 对照：先查 `statistics` / `bisect` / `heapq` / `re` / `textwrap` 里有没有，再考虑第三方（每多一个依赖就多一份锁定与漏洞面），最后才自己写；C++ 的 STL 给的是容器与算法（`vector` / `unordered_map` / `std::accumulate`），日期时区要等到 C++20 `<chrono>` 才像样、JSON 基本靠第三方库加包管理器——Python 的「电池全含」在这两章里最能省时间，也最容易让人忘记它换来的是运行期动态类型。"
      ],
      summary_en: [
        "collections fills in the last step the built-in containers miss: defaultdict(list) removes 'create the list if the key is absent', Counter(words).most_common(5) is one-line frequency, deque gives O(1) at both ends (list.pop(0) is O(n) — the most common performance hole in Python), namedtuple adds field names to an immutable tuple, and ChainMap stacks several default layers into one lookup.",
        "@dataclass is the right answer to 'I am writing boilerplate again': it generates __init__, __repr__ and __eq__, frozen=True buys immutability (and only then can the object be hashed), and field(default_factory=list) is the official fix for mutable defaults — writing items: list = [] raises TypeError at class-definition time, on purpose.",
        "itertools supplies lazy building blocks: chain joins iterables, product / combinations / permutations enumerate, islice lazily takes the first N (a generator cannot be indexed), accumulate computes running sums — but groupby requires the data to be sorted by that same key, otherwise one key shatters into several runs and it looks like undercounting.",
        "functools is the functional half: partial pre-fills arguments (and incidentally cures late binding), lru_cache(maxsize=None) memoises in one line provided the arguments are hashable (applied to a method it pins every self into a global cache and keeps whole instances alive), plus reduce, cached_property and total_ordering to avoid writing four comparison methods.",
        "datetime has only two iron rules, and breaking either causes an incident: work exclusively in timezone-aware times (datetime.now(timezone.utc); aware minus naive raises TypeError immediately, and two naive times compare wrongly across machines), and store or log in UTC as ISO 8601 strings, converting with .astimezone() only at the display layer.",
        "Give datetimes the right helpers: strptime / strftime convert to and from text (%Y-%m-%d %H:%M), use timedelta or dateutil's relativedelta for month and year arithmetic instead of assuming a thirty-day month, and use timestamp() / fromtimestamp(ts, tz=...) rather than dividing seconds by 86400 and hoping it aligns to midnight.",
        "json is already the de facto format for model input and output, tool calls and configuration: dumps / loads work on strings while dump / load work on file objects (ensure_ascii=False is what writes real Chinese); datetimes and custom objects are not JSON types, so convert them to ISO strings explicitly or supply default= / a custom JSONEncoder instead of hoping the library guesses.",
        "The battery-included rule, versus C++: check statistics / bisect / heapq / re / textwrap first, then third-party packages (every dependency adds a pin and a CVE surface), and only then write it yourself; C++'s STL offers containers and algorithms (vector, unordered_map, std::accumulate), but usable timezone arithmetic only arrives with <chrono> in C++20 and JSON means a third-party library plus a package manager — Python's included batteries save the most time in these two chapters and are also the easiest way to forget the dynamic runtime typing they were bought with."
      ],
      code: `import json
from collections import Counter, defaultdict, deque, namedtuple
from dataclasses import dataclass, field
from datetime import datetime, timezone
from itertools import groupby, islice

@dataclass(frozen=True)
class Event:
    # frozen 才可能被 hash；不可变记录首选它
    name: str
    ts: datetime
    tags: tuple = ()

@dataclass
class Bucket:
    name: str
    # 可变默认值必须由 default_factory 每次新建，写 [] 会当场报错
    items: list = field(default_factory=list)

Point = namedtuple("Point", "x y")

def best_by_name(rows):
    # defaultdict 省掉「键不存在先建表」那三行
    by = defaultdict(list)
    for r in rows:
        by[r["name"]].append(r["score"])
    return {n: max(v) for n, v in by.items()}

if __name__ == "__main__":
    now = datetime.now(timezone.utc)
    print(Event("启动", now))
    print(json.dumps({"name": "启动", "ts": now.isoformat()}, ensure_ascii=False))
    rows = [{"name": "甲", "score": 9}, {"name": "乙", "score": 5}, {"name": "甲", "score": 7}]
    print(best_by_name(rows))
    print(Counter(r["name"] for r in rows).most_common(1))
    b = Bucket("临时")
    b.items.append(1)
    print(b, Point(1, 2))
    print(list(islice(range(10 ** 9), 3)))
    q = deque([1, 2, 3], maxlen=2)
    q.appendleft(9)
    print(q, [k for k, _ in groupby("aba")])`,
      pit: "`json.dumps` 撞上 `datetime` 就抛 `TypeError: Object of type datetime is not JSON serializable`，很多人顺手加一个 `default=str` 一把梭——时间字段确实写出去了，但变成了没人认得的格式，下游解析要么失败要么静默算错。序列化格式是契约的一部分，要显式转成 ISO 字符串。",
      pit_en: "json.dumps raises TypeError: Object of type datetime is not JSON serializable, and the reflex fix is default=str to sweep it under the rug — the timestamp is written, but in a format nobody recognises, so the parser downstream either fails or quietly computes the wrong thing. Serialisation format is part of the contract: convert to an ISO string explicitly.",
      ex: {
        q: "为什么 `groupby` 在按别的字段排过序的数据上会给出奇怪结果？",
        a: "因为它做的是「相邻同键归一组」而不是全局聚合，只有排序键与分组键一致时才等价于分组，否则同一个键被拆成多段，看着就像漏统计。",
        q_en: "Why does groupby behave strangely on data sorted by some other field?",
        a_en: "Because it groups adjacent equal keys rather than aggregating globally: it matches real grouping only when the sort key equals the group key, otherwise one key shatters into several runs and looks like undercounting."
      }
    },

    "p4-6": {
      title: "综合重构：从脚本到小系统——类、生成器与标准库的选型清单",
      title_en: "Synthesis: From Script to Small System — A Selection Checklist",
      min: 15,
      target: "面对一个真实小需求，能一次说清该用 dataclass、类、生成器还是标准库结构，并讲出每个选择的代价与内存影响。",
      target_en: "Given a real small requirement, choose between a dataclass, a class, a generator or a stdlib structure in one pass — and state the cost and memory consequence of each choice.",
      summary: [
        "收口第一问是「这里真的需要类吗」：只有当数据带**不变量 + 生命周期 + 一组互相依赖的行为**才值得写 `class`；纯粹一组字段用 `@dataclass`，只读记录用 `namedtuple`，函数就够用时别为了「看起来 OO」再包一层——多出来的每个对象都是一份 `__dict__`。",
        "第二问是「这个结构会被复制多少份」：Python 实例默认自带 `__dict__`（一张哈希表），造几万个对象时内存直接爆掉；`@dataclass(slots=True)` 或手写 `__slots__` 把属性定成槽位，省下大半内存并顺手禁止运行时加字段，代价是不能塞任意属性、多继承时槽位可能冲突。",
        "第三问是「它能进 set / 当 dict 的键吗」：`__eq__` 与 `__hash__` 必须一起考虑——自己定义了 `__eq__` 之后 Python 会把 `__hash__` 置为 None（对象立刻不可哈希），要既可比较又可放进集合就得两个都写，规则是「相等 ⟹ 哈希相等」；`frozen=True` 的 dataclass 会自动给一套一致的。",
        "第四问是「这条数据流要不要惰性」：能一次读进内存就用 list / dict（好懂、能反复遍历、断点好打）；文件大到不可控就一路生成器到底（p3-4 的逐行 + p4-4 的管道），并接受它的两张税单——只能遍历一次、异常发生在消费的那一刻而不是调用的那一刻。",
        "魔术方法只需记住这五组：`__init__`（初始化）、`__repr__`（给开发者看）、`__eq__` 与 `__hash__`（比较与可哈希）、`__len__` / `__iter__` / `__getitem__`（容器协议，配 `collections.abc` 就能被 for、切片和 `in` 接受）、`__enter__` / `__exit__`（p3-4 的 `with` 就是它的语法糖）；不必背全，关键是理解「协议 = 方法名约定」。",
        "本章高频翻车复盘（八条，能当场口头解释才算过关）：方法漏 `self` / 可变默认值写在类属性或 `def __init__(self, x=[])` / 漏调 `super().__init__()` / 多继承顺序写反导致 MRO 意外 / 生成器被遍历第二次 / naive 与 aware 时间比较 / 自定义 `__eq__` 后对象塞不进 set / `except Exception: pass` 把上面所有问题都掩盖掉。",
        "补课：静态检查。类型注解在运行时**什么都不做**（只存进 `__annotations__`），要 `mypy` 或 `pyright` 才真的检查；`list[int]`（3.9+）、`int | None`（3.10+）、`Protocol`（结构化子类型：不继承也能多态，手感接近 C++ 模板的「有这个操作就行」），`@dataclass(slots=True)` + 注解是今天 Python 项目的主流起点。",
        "去向与衔接：py4 收尾，你已经具备读 PyTorch 源码的基本能力（`nn.Module`、`Dataset`、`__len__` / `__getitem__` 全在本章）；Python 路线下一步是 ma1 线性代数与 sp1 NumPy，C++ 路线的对应章节是 s9 / s10 面向对象——同一个概念两套拼写，两边都学完会互相加固；真要把热点搬去 C++ 时，再回去读 s10 的虚函数与 s17 的现代特性会有全新的体感。"
      ],
      summary_en: [
        "Closing question one: is a class actually needed? Only when the data carries an invariant, a lifecycle and a set of interdependent behaviours; for a bundle of fields use @dataclass, for a read-only record use namedtuple, and never wrap something a function already handles in the name of looking object-oriented — every extra object costs you a __dict__.",
        "Question two: how many copies of this structure will exist? Python instances carry a __dict__ hash table by default, so tens of thousands of them blow the memory budget; @dataclass(slots=True) or a hand-written __slots__ turns attributes into fixed slots, saving most of that memory and forbidding bolt-on attributes — the cost being no arbitrary fields and possible slot clashes under multiple inheritance.",
        "Question three: can it live in a set or act as a dict key? __eq__ and __hash__ must be decided together: defining __eq__ makes Python set __hash__ to None, instantly unhashable, so an object that is both comparable and storable needs both written under the rule 'equal implies equal hash'; a frozen dataclass hands you a consistent pair for free.",
        "Question four: should this data flow be lazy? If it fits in memory, use list / dict — easier to read, re-traversable, friendly to breakpoints. If the file is unbounded, keep the whole chain on generators (p3-4 line iteration plus p4-4 pipelines) and accept its two taxes: one traversal only, and exceptions that fire at consumption time rather than at call time.",
        "Five groups of dunder methods are enough: __init__ (setup), __repr__ (for developers), __eq__ with __hash__ (comparison and hashability), __len__ / __iter__ / __getitem__ (the container protocol that, with collections.abc, makes for, slicing and in all work), and __enter__ / __exit__ (the machinery behind p3-4's with). The point is not memorisation but understanding that a protocol is a naming convention.",
        "This chapter's failure retrospective, eight items you should be able to recite: forgetting self in a method / a mutable default on a class attribute or in def __init__(self, x=[]) / skipping super().__init__() / writing base classes in the wrong order and getting an unexpected MRO / traversing a generator twice / comparing naive with aware datetimes / defining __eq__ and then failing to put objects in a set / swallowing all of the above with except Exception: pass.",
        "One more course: static checking. Type annotations do nothing at run time (they merely land in __annotations__), and only mypy or pyright actually check them; learn list[int] (3.9+), int | None (3.10+) and Protocol (structural subtyping — polymorphism without inheritance, close in feel to a C++ template's 'any type that supports these operations'); @dataclass(slots=True) plus annotations is the mainstream starting point for a Python project today.",
        "Where this leaves you: py4 is done and you can now read PyTorch source at a basic level (nn.Module, Dataset, __len__ / __getitem__ all came from this chapter); the Python track continues into ma1 linear algebra and sp1 NumPy, while the C++ counterparts are s9 and s10 object orientation — one set of concepts in two spellings, and learning both sides reinforces each. When you finally move a hot loop to C++, rereading s10 virtual functions and s17 modern features will feel entirely new."
      ],
      code: `# 收口示范：dataclass 建模 + 生成器流式 + 协议式多态 + 异常翻译
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Protocol

class Exportable(Protocol):
    # 不靠继承的多态：只要有 to_row，就能被这条流水线接受
    def to_row(self) -> list:
        ...

@dataclass(slots=True)
class Sample:
    # slots 省下每个实例一张 __dict__，代价是不能随手加字段
    idx: int
    text: str
    label: str = "unknown"

    def to_row(self) -> list:
        return [self.idx, self.text, self.label]

    def __str__(self) -> str:
        # __repr__ 由 dataclass 生成，给开发者看；__str__ 给用户看
        return "{}:{}".format(self.idx, self.label)

def parse(path: Path) -> Iterable[Sample]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            for i, line in enumerate(f):
                parts = line.strip().split("\\t")
                if len(parts) < 2:
                    raise ValueError("第 {} 行字段不足".format(i + 1))
                yield Sample(idx=i, text=parts[0], label=parts[1])
    except OSError as e:
        # 把底层异常翻译成领域异常，同时保留原因链
        raise RuntimeError("读不到标注文件：" + str(path)) from e

def export(items: Iterable[Exportable], path: Path) -> int:
    n = 0
    tmp = path.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        for it in items:
            f.write(json.dumps(it.to_row(), ensure_ascii=False) + "\\n")
            n += 1
    tmp.replace(path)
    return n

if __name__ == "__main__":
    print(export(parse(Path("data.txt")), Path("out.jsonl")))`,
      pit: "为了「显得 OO」把一切都包成类：三个静态方法、一点状态都没有的类只是把函数挪了个家，却额外付出对象创建、`__dict__` 内存和 `self` 心智成本；反过来，用到处共享可变全局字典时才想起封装，也已经晚了。判据只有一条：有没有需要维护的不变量。",
      pit_en: "Wrapping everything in a class to look object-oriented: three static methods and no state is just functions that moved house, and you still pay for object creation, __dict__ memory and the self tax — while the opposite failure, only adding encapsulation once a globally shared mutable dict is trampling itself, comes far too late. One criterion decides it: is there an invariant to maintain?",
      ex: {
        q: "为什么自定义 `__eq__` 之后，实例会突然不能放进 set，而且报错信息里没有任何提示？",
        a: "因为语言认定「你已经接管了相等判断，默认按 id 算的哈希就不再可信」，于是自动把 `__hash__` 设成 None，对象当场变成不可哈希；要恢复就得同时定义 `__hash__`，并保证相等的对象哈希也相等。",
        q_en: "Why does defining __eq__ make instances suddenly unusable in a set, with nothing in the error pointing at the cause?",
        a_en: "Because the language reasons that once you own equality, the default id-based hash is no longer trustworthy, so it silently sets __hash__ to None and the object becomes unhashable; to restore it you must define __hash__ too and keep equal objects hashing equal."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择/判断/填空混排） ---------- */
  quizAdd: {
    py3: [
      {
        q: "关于 `def add(x, bucket=[])`，下列说法正确的是？",
        o: ["每次调用都会新建一个空列表作为默认值", "默认列表在 def 执行时创建一次，被所有调用共享", "只有第一次调用才会用到默认值", "Python 禁止可变对象作默认值，定义时就报错"],
        a: 1,
        why: "默认值在 def 语句执行的那一刻求值一次并挂在函数对象的 __defaults__ 上，之后的每次调用复用同一个列表对象，于是上一次的残留会带进下一次。",
        q_en: "Which statement about 'def add(x, bucket=[])' is correct?",
        o_en: ["A fresh empty list is built for every call", "The list is created once when the def runs and shared by all calls", "Only the first call ever uses the default", "Python forbids mutable defaults and errors at definition time"],
        why_en: "The default is evaluated once, when the def statement executes, and stays on the function object in __defaults__, so every call reuses that same list and carries the previous call's leftovers."
      },
      {
        q: "cfg.py 的模块顶层写着 `DATA = open('a.txt').read()`。别人第一次 `import cfg` 时会发生什么？",
        o: ["什么都不会发生，import 只读取声明", "会真的执行这一行去读文件，之后再次 import 则从 sys.modules 取缓存不再执行", "会真的执行这一行，并且每次 import 都重新读一次文件", "必须显式调用 cfg.load() 这一行才执行"],
        a: 1,
        why: "import 是运行期语句：模块的顶层代码在第一次导入时从头到尾执行一遍，之后模块对象被缓存在 sys.modules 里，重复导入只是取名字。",
        q_en: "cfg.py has DATA = open('a.txt').read() at module top level. What happens the first time someone runs 'import cfg'?",
        o_en: ["Nothing; import only reads declarations", "That line really executes and reads the file, and later imports reuse the sys.modules cache", "That line executes and the file is re-read on every single import", "Nothing runs until someone calls cfg.load() explicitly"],
        why_en: "import is a runtime statement: top-level module code runs start to finish on the first import, and the resulting module object is cached in sys.modules so later imports just look up names."
      },
      {
        q: "判断：写了 `except Exception:` 就能接住用户按 Ctrl+C 产生的中断。",
        type: "judge", a: 1,
        why: "KeyboardInterrupt 直接继承 BaseException 而不是 Exception，所以 except Exception 抓不到它；反过来用 except BaseException 或裸 except 会把退出信号一起吞掉，这正是 bare except 的第二层危害。",
        q_en: "True or false: writing 'except Exception:' also catches the interrupt produced by Ctrl+C.",
        why_en: "False. KeyboardInterrupt derives straight from BaseException, not Exception, so except Exception misses it; conversely except BaseException or a bare except swallows the user's quit signal too, which is the second harm of bare except."
      },
      {
        q: "Python 里用来区分「脚本被直接运行」和「被 import」的那个字符串常量是 ______（填双下划线名字对应的值）。",
        type: "fill", ans: ["__main__"],
        why: "直接运行时模块的 __name__ 等于字符串 '__main__'，被导入时等于模块名，因此 if __name__ == \"__main__\": 里的代码只在手动运行时执行。",
        q_en: "The string value that distinguishes 'run directly' from 'imported' is ______.",
        why_en: "When a file is run directly its __name__ equals the string '__main__'; when imported it equals the module name, which is what makes if __name__ == \"__main__\": work."
      }
    ],
    py4: [
      {
        q: "`class Cache: hits = []`，方法里写 `self.hits.append(k)`，结果是？",
        o: ["每个实例各自得到一个空列表", "所有实例共享类上那一个列表，append 会互相看得见", "运行到那行时抛 TypeError", "Python 禁止类属性是列表"],
        a: 1,
        why: "实例字典里没有 hits，属性查找落到类属性上，而 append 是原地修改，改的正是类上那一份；可变状态必须在 __init__ 里赋给 self。",
        q_en: "Given 'class Cache: hits = []' and self.hits.append(k) inside a method, what happens?",
        o_en: ["Each instance gets its own empty list", "All instances share the single list on the class and see each other's appends", "It raises TypeError at that line", "Python forbids a list as a class attribute"],
        why_en: "The instance dict has no hits, so lookup falls through to the class attribute, and append mutates in place — the class's one and only list. Mutable per-object state has to be assigned to self inside __init__."
      },
      {
        q: "关于 `__eq__` 与 `__hash__`，下列说法正确的是？",
        o: ["自定义 __eq__ 后若不定义 __hash__，实例默认变成不可哈希", "自定义 __eq__ 后 __hash__ 会自动跟着改变", "只要两个对象相等，它们的哈希可以任意不同", "不可哈希的对象依然能放进 set"],
        a: 0,
        why: "定义 __eq__ 会让 Python 把 __hash__ 置为 None（默认按 id 算的哈希不再可信），对象因此不能进 set 或当 dict 键；规则是相等必须蕴含哈希相等。",
        q_en: "Which statement about __eq__ and __hash__ is correct?",
        o_en: ["Defining __eq__ without __hash__ makes instances unhashable by default", "Defining __eq__ automatically updates __hash__ to match", "Equal objects are allowed to have different hashes", "Unhashable objects can still be stored in a set"],
        why_en: "Defining __eq__ sets __hash__ to None because the default id-based hash is no longer trustworthy, so instances can no longer go into a set or act as dict keys; equality must imply equal hashes."
      },
      {
        q: "判断：`super()` 的作用就是「调用直接父类的方法」。",
        type: "judge", a: 1,
        why: "super() 的实际语义是「沿 MRO 问下一个」，在多继承与菱形结构里，下一个不一定是直接父类；正因如此每一层都调用 super() 才能保证每个类恰好被执行一次。",
        q_en: "True or false: super() simply calls the method of the direct parent class.",
        why_en: "False. super() means 'ask the next class on the MRO', and under multiple or diamond inheritance that next class is not necessarily the direct parent; that is exactly why calling super() at every level makes each class run exactly once."
      },
      {
        q: "为了让成千上万个实例不再各自携带一张 `__dict__`，可以在类里定义特殊属性 ______（填双下划线名字）。",
        type: "fill", ans: ["__slots__"],
        why: "__slots__ 把允许的属性固定成槽位，省下实例字典的开销并禁止运行时随手加字段；dataclass 的 slots=True 就是它的封装。",
        q_en: "To stop thousands of instances from each carrying a __dict__, define the special class attribute ______.",
        why_en: "__slots__ fixes the permitted attributes into slots, removing the per-instance dict and forbidding bolt-on attributes; dataclass(slots=True) is just a wrapper around it."
      }
    ]
  },

  /* ---------- 词典：Python 双路线章统一用「基础概念」分类 ---------- */
  terms: [
    { term: "一等对象", term_en: "First-Class Object", cat: "基础概念",
      short: "能赋值、能存进容器、能当参数传、能当返回值返回的值；Python 里函数与类都是这样的对象。",
      short_en: "A value you can assign, store in a container, pass as an argument and return from a function; in Python even functions and classes are such objects.",
      detail: ["函数对象上还能读到 __defaults__、__code__、__name__，因为 def 只是创建了一个普通对象并给它起了名字。", "回调、策略表、装饰器、闭包全都建立在「函数是值」这一条上；C++ 要做得靠函数指针或 std::function，且签名必须在类型系统里对上。"],
      detail_en: ["A function object exposes __defaults__, __code__ and __name__, because def merely created an ordinary object and bound a name to it.", "Callbacks, strategy tables, decorators and closures all rest on functions being values; in C++ the same needs function pointers or std::function, and the signature has to line up in the type system."],
      vs: "一等对象说的是「能不能当值用」，动态类型说的是「变量能不能换类型」，两者独立但常一起出现。",
      vs_en: "First-class describes whether something can be used as a value; dynamic typing describes whether a variable can change type. Independent ideas that usually travel together." },
    { term: "可变默认参数", term_en: "Mutable Default Argument", cat: "基础概念",
      short: "函数签名上写 `[]`、`{}`、`set()` 作默认值，会被所有调用共享同一个对象。",
      short_en: "Using [], {} or set() as a signature default, so every call ends up sharing one and the same object.",
      detail: ["根因是默认值只在 def 执行时求值一次，之后挂在函数对象上；原地修改（append、update）就会把状态留在调用之间。", "标准解法是把默认写成 None 并在函数体内新建，或使用 dataclass 的 field(default_factory=...)；直接写可变默认值在 dataclass 里是定义期 TypeError。"],
      detail_en: ["The root cause is that a default is evaluated once at def time and lives on the function object, so in-place mutation (append, update) leaves state between calls.", "The standard fix is a None sentinel plus a fresh container in the body, or field(default_factory=...) in a dataclass; writing a mutable default there is a TypeError at class-definition time."],
      vs: "可变默认参数是「共享发生得无声无息」，类属性放可变对象是「共享发生在对象之间」，成因同一、表现不同。",
      vs_en: "A mutable default shares silently between calls; a mutable class attribute shares between instances. Same root cause, different symptom." },
    { term: "晚绑定", term_en: "Late Binding", cat: "基础概念",
      short: "闭包捕获变量本身而不是定义那一刻的值，值在函数被调用时才确定。",
      short_en: "A closure captures the variable, not its value at definition time, so the value is settled only when the call happens.",
      detail: ["典型事故是循环里创建的回调全部读到循环变量的最后一个值；把值钉住要靠默认参数（def 时求值）或 functools.partial。", "C++ 的 lambda 用捕获列表显式区分 [x] 按值与 [&x] 按引用，按引用捕获带出作用域还会留下悬空引用；Python 只有按引用这一种。"],
      detail_en: ["The classic incident is callbacks built inside a loop all reading the loop variable's final value; pin the value with a default argument (evaluated at def time) or functools.partial.", "C++ lambdas separate [x] capture-by-value from [&x] capture-by-reference explicitly, and carrying a reference out of scope dangles; Python only has the by-reference flavour."],
      vs: "晚绑定讲「何时取值」，可变默认参数讲「对象被谁共用」，两条规则叠在 lambda 上就会出最怪的现象。",
      vs_en: "Late binding is about when a value is read; mutable defaults are about who shares one object. Stack the two rules inside a lambda and you get the weirdest bugs." },
    { term: "循环导入", term_en: "Circular Import", cat: "基础概念",
      short: "A 顶层 import B、B 顶层又 import A，导致其中一个模块还没执行完就被取名字。",
      short_en: "A imports B at top level while B imports A at top level, so one of them is asked for a name before it finished executing.",
      detail: ["报错形态是 ImportError 或 AttributeError，且现象会随「先运行哪个文件」而变，这是它最难查的地方。", "解法按优先级：把共同依赖抽到第三个模块、改成 import 模块名晚点用、只从 TYPE_CHECKING 块引入类型、最后才把 import 挪进函数体。"],
      detail_en: ["It surfaces as ImportError or AttributeError and changes shape depending on which file you run first, which is what makes it so hard to pin down.", "Fix it in order of preference: extract the shared dependency into a third module, import the module and use it later, pull type-only names in behind TYPE_CHECKING, and only as a last resort move an import inside a function."],
      vs: "循环导入是「运行期初始化顺序」问题，C++ 的头文件循环包含是「编译期声明」问题，后者靠前向声明与 include guard 解决。",
      vs_en: "Circular imports are a runtime initialisation-order problem; circular header inclusion in C++ is a compile-time declaration problem solved by forward declarations and include guards." },
    { term: "上下文管理器", term_en: "Context Manager", cat: "基础概念",
      short: "实现 __enter__ 与 __exit__ 的对象，用 with 把「获取」和「释放」强制配对。",
      short_en: "An object implementing __enter__ and __exit__, so with can force acquisition and release to pair up.",
      detail: ["它的可靠性来自「离开块的每条路径都执行 __exit__」，包括抛异常和 return；这就是它优于手写 close 的地方。", "contextlib 里的 contextmanager / suppress / closing 可以在不写类的情况下造一个管理器；锁、事务、临时目录、测试桩全都用它。"],
      detail_en: ["Its reliability comes from __exit__ running on every path out of the block, exceptions and returns included — the exact place hand-written close() falls short.", "contextlib provides contextmanager, suppress and closing so you can build one without defining a class; locks, transactions, temp directories and test stubs all use it."],
      vs: "与 C++ 的 RAII 目标相同（配对释放），手段不同：RAII 绑在对象生命周期上，with 绑在代码块的进出上。",
      vs_en: "Both aim at paired release like C++ RAII, but the hook differs: RAII hangs off an object's lifetime, with hangs off entering and leaving a block." },
    { term: "依赖锁定", term_en: "Dependency Locking", cat: "基础概念",
      short: "把第三方库的具体版本号写进文件，保证今天和别人的环境完全一样。",
      short_en: "Recording exact third-party versions in a file so today's environment matches anyone else's.",
      detail: ["Python 的常见形态是 venv 加 requirements.txt（pip freeze 或手工 pin），更严格的做法连哈希一起锁，防的是包被篡改。", "它解决的是「解释器装到哪、装什么版本」，C++ 的对应问题是「头文件在哪、链接哪个库、abi 是否兼容」，靠 vcpkg 或 Conan 加构建系统。"],
      detail_en: ["The usual Python shape is a venv plus requirements.txt (from pip freeze or hand-pinned), and the strict form records hashes too, guarding against tampered packages.", "It answers 'which interpreter, which versions'; C++ asks 'where are the headers, which library gets linked, is the ABI compatible' and answers with vcpkg or Conan plus a build system."],
      vs: "虚拟环境管「隔离」，依赖锁定管「可复现」，只做前一件事照样会在别人机器上崩。",
      vs_en: "A virtual environment gives isolation, locking gives reproducibility; do only the first and the project still breaks on someone else's machine." },
    { term: "鸭子类型", term_en: "Duck Typing", cat: "基础概念",
      short: "不看继承关系与声明，只看对象有没有对方要用的那些方法与属性。",
      short_en: "Judging an object not by its declared type or inheritance but by whether it has the methods and attributes being used.",
      detail: ["所以 `len(x)` 只要求 x 有 __len__，不要求它是 list；`Protocol` 与 `typing` 注解把这套约定写成可检查的形式，但运行时不强制。", "C++ 的模板是编译期鸭子类型（有这个操作就能实例化），虚函数式多态则要求显式继承与 override；Python 全都按名字在运行期查。"],
      detail_en: ["So len(x) only asks x to provide __len__, not to be a list; Protocol and typing annotations express these contracts in checkable form, though nothing enforces them at run time.", "C++ templates are compile-time duck typing (any type supporting the operations instantiates them), while virtual polymorphism demands explicit inheritance and override; Python resolves everything by name at run time."],
      vs: "鸭子类型是运行期按行为接受对象，抽象基类是运行期按名字检查接口，两者常配合使用。",
      vs_en: "Duck typing accepts objects by behaviour at run time; an abstract base class checks interface names at run time — the two are commonly paired." },
    { term: "魔术方法", term_en: "Dunder Method", cat: "基础概念",
      short: "形如 __init__、__len__、__eq__ 的双下划线方法，把对象接进语言内建协议。",
      short_en: "Double-underscore methods such as __init__, __len__ and __eq__ that plug an object into the language's built-in protocols.",
      detail: ["for、in、切片、with、+ 比较这些语法本质都是「去对象上找一个约定名字的方法」，所以协议不需要基类也能实现。", "写自定义 __eq__ 会让 __hash__ 变成 None（对象随之不可哈希），这是魔术方法之间必须成对维护的最典型例子。"],
      detail_en: ["for, in, slicing, with and + are all sugar for 'go look for a method with this conventional name on the object', so a protocol can be implemented without inheriting anything.", "Defining __eq__ sets __hash__ to None, making instances unhashable — the clearest example of dunder methods that must be maintained in pairs."],
      vs: "魔术方法是语言约定的协议入口，普通方法是你自己起的名字；前者决定对象能被哪些语法接受。",
      vs_en: "Dunder methods are protocol entry points the language dictates; ordinary methods carry names you invented. Only the first kind decides which syntax your object can be used with." },
    { term: "方法解析顺序", term_en: "Method Resolution Order", cat: "基础概念",
      short: "多继承时属性与方法沿哪条链查找，由 C3 线性化算出，可用 __mro__ 打印。",
      short_en: "The chain attribute and method lookup follows under multiple inheritance, computed by C3 linearisation and printable via __mro__.",
      detail: ["super() 的含义就是「沿这条链问下一个」，所以每个类恰好被走到一次，前提是每一层都记得调用它。", "线性化排不出来时 Python 在 class 语句执行时就报 TypeError，不会退化成任意顺序；C++ 的菱形继承则要手写 virtual 继承来避免两份基类子对象。"],
      detail_en: ["super() means 'ask the next class on this chain', so each class is visited exactly once — provided every level remembers to call it.", "When no linearisation exists, the class statement itself raises TypeError instead of quietly picking some order; in C++ the diamond needs virtual inheritance to avoid two base subobjects."],
      vs: "MRO 决定「找名字」的顺序，C3 线性化决定「这条顺序是否自洽」，两者一起解释多继承的行为。",
      vs_en: "The MRO fixes the order in which names are sought; C3 linearisation decides whether such an order is consistent at all — together they explain multiple inheritance." },
    { term: "名称改写", term_en: "Name Mangling", cat: "基础概念",
      short: "类里以双下划线开头（且不以双下划线结尾）的名字被重写成 _Cls__x。",
      short_en: "A name in a class starting with two underscores and not ending with them is rewritten to _Cls__x.",
      detail: ["它的目的只有一个：让子类的字段不会撞掉父类的同名字段，属于继承安全，不是访问控制。", "外部仍然可以用 obj._Cls__x、vars(obj)、pickle 拿到它，所以把它当安全边界（密钥、权限判定）是彻底的误用。"],
      detail_en: ["It exists for exactly one reason: a subclass field should not silently overwrite its parent's — inheritance safety, not access control.", "Outsiders can still reach it via obj._Cls__x, vars(obj) or pickle, so treating it as a security boundary (secrets, permission checks) is a plain misuse."],
      vs: "单下划线是给人看的「别碰」提醒，双下划线是编译器级别的名字重写；前者可 lint，后者只是改名。",
      vs_en: "A single underscore is a human-facing 'hands off' marker; a double underscore is an actual renaming performed by the language. The first is lintable, the second is only a name change." },
    { term: "数据类", term_en: "dataclass", cat: "基础概念",
      short: "用 @dataclass 装饰带注解的类，自动生成 __init__、__repr__、__eq__ 等样板方法。",
      short_en: "Decorating an annotated class with @dataclass so the boilerplate __init__, __repr__ and __eq__ are generated for you.",
      detail: ["frozen=True 让它不可变（因此可以安全 hash），slots=True 让它不再自带实例字典，default_factory 是可变默认字段的正确写法。", "它只解决「一组字段」；一旦需要不变量校验、生命周期或行为方法，就该写普通类并用 property 收紧接口。"],
      detail_en: ["frozen=True makes it immutable (and therefore safely hashable), slots=True drops the per-instance dict, and default_factory is the correct way to declare a mutable default field.", "It handles 'a bundle of fields' only; once you need invariant checks, a lifecycle or behaviour, write a normal class and tighten the interface with property."],
      vs: "dataclass 与 namedtuple 都是记录型容器：前者可变可加方法、字段类型可注解，后者不可变更省内存但功能更窄。",
      vs_en: "Both dataclass and namedtuple are record containers: the first is mutable, extensible and annotatable, the second is immutable, leaner and considerably narrower." },
    { term: "惰性求值", term_en: "Lazy Evaluation", cat: "基础概念",
      short: "表达式在被真正需要之前不计算；生成器表达式与 itertools 是 Python 里的主要载体。",
      short_en: "An expression is not computed until something actually needs it; generator expressions and itertools are Python's main carriers.",
      detail: ["它换来的核心收益是内存恒定：几 GB 的日志可以在链式过滤、映射、聚合之后仍以常数内存处理完。", "两张税单是「只能遍历一次」和「副作用推迟到消费时发生」，异常的位置也会从定义处移到消费处，调试时要想清楚链条现在跑到哪。"],
      detail_en: ["The payoff is constant memory: gigabytes of logs can run through chained filtering, mapping and aggregation without growing.", "The two taxes are single traversal and side effects deferred to consumption, and exceptions move from the definition site to the consumption site, so debugging means knowing exactly how far the chain has run."],
      vs: "惰性求值解决「什么时候算」，生成器解决「怎么把一段过程写成可中断的东西」，两者常配合但不等价。",
      vs_en: "Lazy evaluation answers when to compute; generators answer how to write a process as something interruptible. They pair often but are not the same idea." }
  ],

  achievements: [
    { id: "py_func_files", icon: "📦", name: "函数与文件通关", name_en: "Functions & Files Cleared",
      desc: "完成 py3 · 函数、模块与文件 全部课节", desc_en: "Finish every lesson of py3 Functions, Modules & Files",
      check: ["py3"] },
    { id: "py_oop_ready", icon: "🧩", name: "面向对象上手", name_en: "Object-Oriented Ready",
      desc: "完成 py4 · 面向对象与常用库 全部课节", desc_en: "Finish every lesson of py4 OOP & the Standard Library",
      check: ["py4"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "默认值只在 def 执行的那一刻求值一次，之后一直复用同一个对象": "a default is evaluated once, when the def runs, and that same object is reused forever",
    "反面写法：可变默认值被所有调用共享": "bad version: a mutable default shared by every call",
    "正确写法：None 作哨兵，要独立列表由调用方自己带进来": "good version: None as sentinel; callers pass their own list",
    "参数顺序硬规则：位置参数、*args、仅关键字参数、默认值、**kwargs": "hard order: positional, *args, keyword-only, defaulted, **kwargs",
    "任意多个数：这就是「一等对象 + 可变参数」组合出来的用法": "any number of arguments: what first-class values plus *args buy you",
    "只因为这一行有赋值，count 在整个函数里都算局部名字": "one assignment anywhere makes the name local for the whole function",
    "想改全局那份必须写 global count": "to touch the global binding you must write 'global count'",
    "nonlocal 才是「改外层那个变量」的正确声明": "nonlocal is the correct declaration for 'change the outer variable'",
    "三个 lambda 捕获的是同一个 i，循环停下来时 i 已经是 2": "all three lambdas share the one i, which is already 2 when the loop ends",
    "默认参数在 def 执行时求值，于是把当时的值钉住了": "a default argument is evaluated at def time, pinning the current value",
    "终端里的一次性环境准备，不是 .py 里的代码": "one-off environment setup in the terminal, not code inside a .py",
    "Windows 用虚拟环境目录下的 activate 脚本，Linux 与 macOS 用下面这行": "on Windows run the activate script inside the venv folder; on Linux/macOS use the next line",
    "把当前环境的版本钉死，同事和明天的你才能复现": "pin the exact versions so colleagues and tomorrow-you can reproduce it",
    "demo.py —— main 守卫让「被 import」和「被运行」走两条路": "demo.py — the main guard splits 'imported' from 'run'",
    "有副作用的动作放在函数里，绝不写在模块顶层": "side-effecting work lives in functions, never at module top level",
    "惰性逐行：文件多大都不影响内存占用": "lazy line iteration: memory stays flat no matter the file size",
    "newline 交给 csv 模块自己处理，Windows 上才不会多出空行": "leave newline handling to the csv module or Windows adds blank lines",
    "ensure_ascii 关掉才写中文，而不是转义序列": "turn ensure_ascii off to write real characters instead of escapes",
    "原子替换：中途崩溃也不会留下半成品盖掉旧结果": "atomic replace: a crash cannot leave a half-written file over the good one",
    "库只抛类型明确的异常，怎么处理留给调用方": "a library raises precisely typed errors and lets callers decide",
    "from e 保留原因链，traceback 会写明这是由上一个异常引起的": "'from e' keeps the cause chain in the traceback",
    "成功了才做的事放 else，不要塞进 try 里被自己的 except 吞掉": "success-only work goes in else, where your own except cannot swallow it",
    "兜底放最后，而且要么记日志要么裸 raise，绝不写 pass": "the catch-all goes last and either logs or re-raises — never pass",
    "stats.py —— 本章骨架的完整落地：读、清洗、聚合、写，各占一个函数": "stats.py — this chapter's skeleton in full: read, clean, aggregate, write, one function each",
    "纯函数：一行文本换成 dict 或 None，不碰文件也不改全局": "pure function: a line in, a dict or None out; no files, no globals",
    "惰性逐行，文件大小不影响这一层的内存": "lazy line by line, so file size does not touch memory here",
    "原子替换：中途崩溃时旧结果仍然完整可用": "atomic replace: the old result stays intact if this crashes",
    "反面示范：可变对象放在类属性上，整个类共享同一份": "bad example: a mutable object on a class attribute, shared by the whole class",
    "每个实例自己的列表必须在这里新建": "each instance's own list must be created right here",
    "少了上一行的初始化，append 就落到类属性那份，别的实例也看得见": "skip that initialisation and append lands on the class list, visible to every instance",
    "类体不在 LEGB 链上，方法里必须写类名或 self 才拿得到 COUNT": "a class body is not in the LEGB chain: reach COUNT via the class name or self",
    "先走 setter 再存字段，构造出来的对象就已经合法": "go through the setter so the object is already legal once built",
    "校验只有一份，构造、赋值、外部改都走这里": "one place validates: construction, assignment and external writes all come here",
    "只读接口：没有 setter，赋值会 AttributeError": "read-only interface: no setter, so assigning raises AttributeError",
    "每次访问都重算，昂贵逻辑不要塞进这里": "recomputed on every access — keep expensive work out of here",
    "工厂方法：知道怎么从一行原始数据把自己造出来": "factory method: knows how to build itself from one raw row",
    "只读字段写不进去，下一行会抛 AttributeError": "a read-only field rejects writes; the next line raises AttributeError",
    "负数当场被拦下，对象不会进入非法状态": "a negative is stopped on the spot, so the object never becomes illegal",
    "super() 是「沿 MRO 问下一个」，不是「调父类」": "super() asks the next class on the MRO; it is not 'call the parent'",
    "漏掉这一行，name 就永远停在没被赋值的状态": "omit this line and name stays forever unassigned",
    "组合：把能力作为字段拿进来，而不是靠继承复用实现": "composition: hold the capability as a field instead of inheriting the implementation",
    "抽象方法没实现，实例化当场报错而不是运行到那行才炸": "an unimplemented abstract method fails at instantiation, not later at the call",
    "生成器：只有被消费时才干活，全程不构造大列表": "a generator: it works only when consumed and never builds a big list",
    "三层惰性管道：读文件、过滤、取字段，内存与文件大小无关": "a three-layer lazy pipeline: read, filter, project — memory independent of file size",
    "frozen 才可能被 hash；不可变记录首选它": "only a frozen instance can be hashed; the default choice for an immutable record",
    "可变默认值必须由 default_factory 每次新建，写 [] 会当场报错": "mutable defaults need default_factory; writing [] is rejected on the spot",
    "defaultdict 省掉「键不存在先建表」那三行": "defaultdict removes the three lines that create the list for a missing key",
    "收口示范：dataclass 建模 + 生成器流式 + 协议式多态 + 异常翻译": "closing demo: dataclass modelling + generator streaming + protocol polymorphism + exception translation",
    "不靠继承的多态：只要有 to_row，就能被这条流水线接受": "polymorphism without inheritance: anything with to_row fits this pipeline",
    "slots 省下每个实例一张 __dict__，代价是不能随手加字段": "slots drop the per-instance __dict__; the price is no bolt-on attributes",
    "__repr__ 由 dataclass 生成，给开发者看；__str__ 给用户看": "__repr__ is generated for developers; __str__ is written for end users",
    "把底层异常翻译成领域异常，同时保留原因链": "translate the low-level error into a domain error and keep the cause chain"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_PY34);
