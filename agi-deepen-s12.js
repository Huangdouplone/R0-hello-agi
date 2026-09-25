/* ================================================================
 * R0:hello agi · 课程深化层 ⑤（s1 准备与启航 / s2 变量与基本类型）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「编程启航段」从每节 3 要点深化到 6~7 要点，补齐「是什么 / 为什么这样
 *       设计 / 什么时候会出错」三件事，并为两章各加一节「综合重构」收口课。
 * 写法约定（本文件同时是后续批次的格式样板）：
 *   1) 既有课节不写 title —— 合并时自动沿用主数据标题，从机制上杜绝「标题被改写」；
 *   2) 新课必须写 title / target / target_en，并且出现在 order 里才会插入；
 *   3) order 必须包含该章全部既有 id（漏写＝该节掉到章尾，校验器会报错）；
 *   4) 多章文件：quizAdd 用 {sid:[...]}，order 用 {sid:[...]}，desc/goal 不生效；
 *   5) code 里的中文注释必须在 codeComments 里给出英文映射，否则英文模式漏中文；
 *   6) 英文条数与中文严格一致（页面合并时会同步写 LESSON_EN，防 lang-en.js 刷回）。
 * ================================================================ */

const DEEPEN_S12 = {
  stages: ["s1", "s2"],

  order: {
    s1: ["1-1", "1-2", "1-3", "1-4", "1-5", "1-6"],
    s2: ["2-1", "2-2", "2-3", "2-4", "2-5", "2-6"]
  },

  lessons: {

    /* ===================== s1 准备与启航 ===================== */
    "1-1": {
      min: 12,
      summary: [
        "C++ 同时给你「对硬件的控制力」和「组织大代码的能力」：既能管到每一个字节，也能用类、命名空间、模板把十万行代码拆开管理。",
        "它编译成机器码直接跑在 CPU 上，中间没有虚拟机或解释器——这是它快的根本原因，也是它要你自己管内存的根本原因。",
        "典型战场是「性能或实时性本身就是产品」的地方：游戏引擎、操作系统与驱动、浏览器与数据库内核、高频交易、嵌入式与机器人。",
        "学 C++ 的额外收益是被迫理解内存、栈与堆、编译与链接——这些别的语言替你藏起来了，学完再换任何语言都会觉得通透。",
        "标准大约三年一版（C++11/14/17/20/23）。本课以 C++17 为基线，把 C++11 的语法当作默认武器；老代码和面试里 C++98 写法仍常见。",
        "什么时候不该选 C++：业务 CRUD、脚本胶水、要一周上线的原型——用 Python/Go 交付快得多；C++ 的成本是开发速度和人才门槛。",
        "衔接：本章只做三件事——装好环境、跑通程序、建立「编辑→编译→运行」的心智模型；语法从 s2 开始，指针与内存在 s7 正面展开。"
      ],
      summary_en: [
        "C++ gives you hardware control *and* the tools to organise large code: you can manage every byte, and split 100k lines with classes, namespaces and templates.",
        "It compiles to machine code that runs directly on the CPU — no VM or interpreter in between. That is why it is fast, and also why you manage memory yourself.",
        "Its typical ground is where performance or real-time behaviour *is* the product: game engines, OS and drivers, browser and database cores, trading, embedded and robotics.",
        "The side benefit of learning C++ is being forced to understand memory, stack and heap, compilation and linking — other languages hide those from you.",
        "The standard moves roughly every three years (C++11/14/17/20/23). This course uses C++17 as the baseline and treats C++11 syntax as default; C++98 style still shows up in legacy code and interviews.",
        "When not to pick C++: business CRUD, glue scripts, prototypes that must ship in a week — Python or Go deliver far faster; C++ costs development speed and people.",
        "Bridge: this chapter only needs to set up the environment, run one program, and build the edit → compile → run mental model; syntax starts in s2, memory and pointers land in s7."
      ],
      code: `#include <iostream>
int main() {
    // 编译期就算出来：constexpr 不产生任何运行时开销
    constexpr int N = 1000 * 1000;
    std::cout << "C++ 把「什么时候算」的选择权交给你\\n";
    return 0;   // 0 表示正常结束，非 0 常被脚本当作失败
}`,
      pit: "把「C++ 很难」当成放弃的理由，或者一上来就追最新特性、写炫技模板——真正卡住新手的从来是内存模型和编译模型没建立，于是 200 行模板报错完全看不懂。",
      pit_en: "Quitting because 'C++ is hard', or chasing the newest features and clever templates first — what actually blocks beginners is a missing memory/compilation model, which makes 200-line template errors unreadable.",
      ex: {
        q: "为什么 C++ 程序要自己管理内存，而 Python 不用？",
        a: "C++ 把对象直接放在栈或堆上并交给你，没有垃圾回收器替你扫描，因此换来可预测的性能和更小的资源占用。",
        q_en: "Why must a C++ program manage memory while Python does not?",
        a_en: "C++ puts objects straight on the stack or heap and hands them to you; there is no GC scanning for you, which buys predictable performance and a smaller footprint."
      }
    },

    "1-2": {
      min: 12,
      summary: [
        "三件套各管一段：编辑器只处理文本，编译器把 .cpp 变成机器码，调试器让你单步看变量与内存——缺一个都会有人以为「工具没装好」。",
        "编译器家族都能编同一份标准代码：Windows 上 MinGW-w64(g++) 或 MSVC(cl)，macOS 上 clang++，Linux 上 g++/clang++；差别在命令行开关和链接的库。",
        "「装好了」不等于「能用」：命令行必须能找到编译器。`g++ --version` 报「不是内部或外部命令」是 PATH 没配对，不是编译器坏了。",
        "在线编译器（onlinegdb、godbolt）适合零安装跑通第一份代码、以及查看编译器生成的汇编；多文件、调试和第三方库会很快撞墙。",
        "VS Code 本身不带编译器：必须再装 C/C++ 扩展 *并* 准备一个真实编译器，还要让配置里的路径指向它——这就是「装了 VS Code 却说没有 C++」的真相。",
        "第一次就把编译选项固定为 `-std=c++17 -Wall -Wextra -g`：警告全开、保留调试符号。等工程大了再补，等于把整个项目重编一遍。",
        "衔接：环境通了就可以在 1-3 写第一个程序；装完还跑不起来的话，先回到这一节把「编译器能不能被找到」验证到底。"
      ],
      summary_en: [
        "Three tools, three jobs: the editor only handles text, the compiler turns .cpp into machine code, the debugger lets you step through variables and memory — missing any one feels like 'the toolchain is broken'.",
        "Every family compiles the same standard code: MinGW-w64 (g++) or MSVC (cl) on Windows, clang++ on macOS, g++/clang++ on Linux; they differ in flags and in which libraries they link.",
        "'Installed' is not 'usable': the command line must be able to find the compiler. 'g++ is not recognised' means PATH is wrong, not that the compiler is broken.",
        "Online compilers (onlinegdb, godbolt) are perfect for zero-install first runs and for reading generated assembly; multi-file builds, debugging and third-party libraries hit a wall fast.",
        "VS Code ships no compiler: you also need the C/C++ extension *and* a real compiler, with settings pointing at it — that is the whole story behind 'I installed VS Code but have no C++'.",
        "Fix your flags from day one: -std=c++17 -Wall -Wextra -g — all warnings on, debug symbols kept. Adding them later means rebuilding the whole project.",
        "Bridge: with the environment working you can write your first program in 1-3; if it still fails, come back here and prove the compiler is actually reachable."
      ],
      code: `// 检查顺序：先确认工具存在，再编译，最后运行
// 1) 编译器找得到吗
g++ --version
// 2) 打开全部警告再编译
g++ -std=c++17 -Wall -Wextra -g main.cpp -o main
// 3) 运行：Windows 下写 main.exe
./main
// 若第 1 步报「不是内部或外部命令」：把 g++ 所在目录加入 PATH 后重开终端`,
      pit: "在同一个终端里改完 PATH 立刻试，还是会报找不到——环境变量只对新开的进程生效，必须重开终端（IDE 也要重启）才能读到新 PATH。",
      pit_en: "Editing PATH and retrying in the same terminal still fails: environment variables only reach newly started processes, so reopen the terminal (and restart the IDE).",
      ex: {
        q: "为什么建议一开始就加 -Wall -Wextra，而不是等出错再加？",
        a: "警告是免费的静态检查，未初始化和有符号/无符号比较这类警告几乎必然是真 bug；存量代码越少，清警告的成本越低。",
        q_en: "Why turn on -Wall -Wextra from the start instead of after something breaks?",
        a_en: "Warnings are free static analysis — uninitialised values and signed/unsigned comparisons are almost always real bugs, and clearing them is cheapest while the code is small."
      }
    },

    "1-3": {
      min: 11,
      summary: [
        "`#include <iostream>` 是预处理指令：把标准输入输出库的声明复制进来，行末**没有分号**；漏掉它，cout 就是一个没见过的名字。",
        "`int main(){}` 是操作系统约定唯一会调用的函数；返回 int 不是装饰，它把退出码交给 shell 或父进程。",
        "`std::` 是命名空间限定，标准库所有名字都在 std 里。初学阶段不建议 `using namespace std;`——它会让你分不清哪些名字是自己起的。",
        "`std::cout << \"Hi\" << std::endl;` 里的 `<<` 可以一直接下去：流把左边的对象和右边的内容串起来；字符串必须用双引号，单引号是单个 char。",
        "`std::endl` 换行并刷新缓冲区，`'\\n'` 只换行。大量输出时 endl 的刷新代价明显更高；只有需要「立刻看见」（提示语、日志）才用它。",
        "分号、括号、引号是新手 90% 编译错误的来源；而且报错行号经常指向**下一行**——学会读第一条错误，而不是最后一条。",
        "衔接：跑通之后，1-4 解释这一屏代码到底怎么变成磁盘上的可执行文件。"
      ],
      summary_en: [
        "'#include <iostream>' is a preprocessor directive that copies the I/O declarations in — and takes no semicolon; without it, cout is an unknown name.",
        "'int main(){}' is the one function the OS is guaranteed to call; the int return is not decoration, it hands an exit code back to the shell or parent process.",
        "'std::' is a namespace qualifier — every standard library name lives in std. Avoid 'using namespace std;' while learning: it hides which names are yours.",
        "The '<<' in 'std::cout << \"Hi\" << std::endl;' chains indefinitely: the stream glues the object on the left to each item on the right. Strings need double quotes; single quotes are one char.",
        "std::endl newline-plus-flush versus '\\n' newline-only. Under heavy output endl's flushing is measurably costlier; use it when the user must see the line right now.",
        "Semicolons, brackets and quotes cause about 90% of beginner compile errors, and the reported line is often the *next* one — read the first error, not the last.",
        "Bridge: once this runs, 1-4 explains how the code on screen became an executable file on disk."
      ],
      code: `#include <iostream>
int main() {
    std::cout << "Hello, World!" << '\\n';    // '\\n' 比 endl 少一次刷新
    std::cout << "编号：" << 2026 << " 级\\n"; // << 可以一直串，数字自动转成文本
    std::cout << "第一行" << std::endl;       // 需要立刻看到时才用 endl
    return 0;                                // 0 = 成功，可在 shell 里读到
}`,
      pit: "把字符串写成单引号 `'Hello'` 或多字符常量，编译器会报「超出字符常量范围」这类奇怪的错；也可能顺手写 `cout Hello;` 少了 `<<`——错误信息会指向完全不同的位置。",
      pit_en: "Writing 'Hello' with single quotes triggers a baffling 'character constant too long' error, and forgetting the << (cout Hello;) points the diagnostic somewhere else entirely.",
      ex: {
        q: "`return 0;` 删掉会发生什么？为什么？",
        a: "对 main 来说多数编译器仍按成功返回 0 处理（标准对 main 有特殊规定），但你会丢掉「退出码」这个明确信号；养成显式 return 0 的习惯更稳。",
        q_en: "What happens if you delete 'return 0;' and why?",
        a_en: "For main the standard special-cases it, so most compilers still exit 0 — but you lose the explicit signal, so writing return 0 stays the safer habit."
      }
    },

    "1-4": {
      min: 12,
      summary: [
        "四个阶段：预处理（展开 #include/#define）→ 编译（每个 .cpp 翻成目标文件 .o/.obj）→ 链接（把目标文件与库拼成可执行文件）→ 运行（系统装载并调用 main）。",
        "每个 .cpp 单独编译成一个目标文件，链接器按名字对接——这正是「函数定义在 a.cpp、调用在 b.cpp」能成立的原因。",
        "「改了代码没生效」几乎总是没重新编译或跑的是旧文件；「undefined reference」是链接期找不到定义：只声明没实现，或那个 .cpp 没进构建清单。",
        "头文件里的**定义**会被每个包含它的 .cpp 各复制一份 → 链接期重复定义。这就是要写 include guard、以及「定义放 .cpp、声明放 .h」的原因。",
        "报错分两类：编译错误（语法/类型，通常带行号）与链接错误（名字对不上，通常没有行号）——看到 undefined reference 先查构建清单，别去改语法。",
        "调试版和发布版的差别只是选项：`-g` 留调试信息、`-O0` 便于单步；`-O2` 才快，但可能让变量「消失」、断点乱跳——性能问题与逻辑问题要用不同的构建。",
        "衔接：s5 会正式讲头文件与 include guard，s18 会把这条流水线做成一个真正的多文件项目。"
      ],
      summary_en: [
        "Four stages: preprocess (expand #include/#define) → compile (each .cpp becomes a .o/.obj) → link (join objects and libraries into one executable) → run (the OS loads it and calls main).",
        "Each .cpp compiles separately and the linker matches names — that is why a function can be declared in one file and called from another.",
        "'My change had no effect' almost always means you did not rebuild or ran the old binary; 'undefined reference' means the linker found no definition: declared but not implemented, or that .cpp never entered the build.",
        "A *definition* in a header is copied into every .cpp that includes it, so the linker reports multiple definitions — hence include guards and 'declaration in .h, definition in .cpp'.",
        "Errors come in two flavours: compile errors (syntax/types, usually with a line) and link errors (names that do not match, usually no line) — on undefined reference, check the build list first, not the syntax.",
        "Debug vs release is just flags: -g keeps debug info and -O0 keeps stepping honest; only -O2 is fast, but variables may 'vanish' and breakpoints jump around — use a different build for perf vs logic bugs.",
        "Bridge: s5 covers headers and include guards properly, and s18 turns this pipeline into a real multi-file project."
      ],
      code: `// 一条 g++ 命令其实做了四件事
// 只编译不链接：停在目标文件，缺定义也照样通过
g++ -c main.cpp -o main.o
// 链接：把目标文件和标准库拼成可执行文件
g++ main.o utils.o -o app
// 上面两步的合并写法
g++ main.cpp utils.cpp -o app
// 故意留一个只声明没实现的函数，观察两种报错的区别：
// 编译期 error: 'foo' was not declared in this scope —— 语法层，带行号
// 链接期 error: undefined reference to 'foo' —— 名字层，没有行号`,
      pit: "新增了一个 .cpp 却只改了 IDE 的项目文件、没改 Makefile/CMakeLists（或反之），于是链接期报 undefined reference；这类 bug 的根因在构建清单，不在代码。",
      pit_en: "Adding a new .cpp but only updating the IDE project (or only CMakeLists) leaves the linker with undefined reference — the bug lives in the build list, not in the code.",
      ex: {
        q: "为什么「只编译不链接」（g++ -c）能成功，但运行时却报找不到符号？",
        a: "编译只检查本文件语法与声明是否自洽，函数体是否存在它不管；把名字对上、地址填好是链接阶段的工作。",
        q_en: "Why can 'compile only' (g++ -c) succeed while running fails with a missing symbol?",
        a_en: "Compilation only checks that this file is self-consistent with its declarations; whether a body exists is the linker's problem."
      }
    },

    "1-5": {
      min: 10,
      summary: [
        "`//` 到行尾，`/* */` 跨行——而 `/* */` **不能嵌套**：中间再出现一个 `*/` 注释就提前结束，报错落在完全无关的行上。",
        "注释解释「为什么」和「坑」，代码本身解释「是什么」。`i++; // i 加一` 这种复述式注释是负资产：改代码时它最先腐烂，还骗人。",
        "`TODO/TBD/FIXME` 加姓名和日期才是有效标记（`// TODO(huangdou, 2026-09): 等 s15 学完文件再补持久化`），否则它永远留在代码里。",
        "公开的接口值得写文档注释（Doxygen 的 `/// @brief`、`/** ... */`），工具能把它们收集成 API 文档；私有实现细节用普通注释就够。",
        "风格不是审美而是协作问题：Google / LLVM / Chromium 各有 style guide，重点是团队选一个并用 clang-format 强制执行。",
        "项目里放一份 `.clang-format`，保存即格式化——评审 diff 只剩真实改动，不掺缩进与花括号之争。",
        "命名要把角色写出来：类型 PascalCase、函数与变量 camelCase 或 snake_case、常量全大写；定了就别在同一个文件里混用两套。"
      ],
      summary_en: [
        "'//' runs to end of line and '/* */' spans lines — but '/* */' does not nest: a second '*/' inside ends the comment early, and the error appears on an unrelated line.",
        "Comments explain why and where the traps are; the code explains what. 'i++; // adds one' is a negative asset: it rots first and it lies.",
        "A TODO only works with an owner and a date ('// TODO(huangdou, 2026-09): persist after s15'); otherwise it stays in the code forever.",
        "Public interfaces deserve doc comments (Doxygen '/// @brief', '/** ... */') so tooling can generate API docs; plain comments are enough inside.",
        "Style is a collaboration problem, not an aesthetic one: Google / LLVM / Chromium each publish a guide — pick one as a team and enforce it with clang-format.",
        "Keep a .clang-format in the repo and format on save, so review diffs contain real changes instead of indentation arguments.",
        "Let names carry roles: PascalCase types, camelCase or snake_case functions and variables, ALL_CAPS constants — and do not mix two conventions in one file."
      ],
      code: `/* 多行注释块：
   用来写「为什么这样设计」，
   而不是复述代码在做什么 */
int score = 0;   // 为什么是 0：未初始化的累加器是未定义行为的入口

// TODO(huangdou, 2026-09): s15 学完文件读写后补上持久化

/**
 * @brief 求两数之和（Doxygen 风格，公开接口值得写）
 * @param a 左操作数
 * @param b 右操作数
 */
int add(int a, int b) { return a + b; }`,
      pit: "把注释掉的大段旧代码留在仓库里当「保险」——半年后没人敢删，也没人知道它为什么还在。要留历史就交给版本控制，代码里只留现在的真相。",
      pit_en: "Leaving big blocks of commented-out code as insurance: a year later nobody dares delete it and nobody knows why it is there. Version control keeps history; the file keeps only current truth.",
      ex: {
        q: "什么样的注释最危险？",
        a: "过期但看起来权威的注释。它会让人相信「代码应该这么做」，从而在错误前提上继续改；所以注释要么写为什么，要么就别写。",
        q_en: "Which kind of comment is the most dangerous?",
        a_en: "A stale comment that still reads as authoritative — it convinces people the code is right and they build on a false premise. Write the why, or write nothing."
      }
    },

    "1-6": {
      title: "综合重构：跑通一条可重复的工程流水线",
      title_en: "Synthesis: A Repeatable Engineering Pipeline",
      min: 14,
      target: "能独立搭出「目录 + 编译命令 + 版本管理」的最小工程骨架，并在新机器上凭 README 三条命令把程序重新跑起来。",
      target_en: "Build a minimal project skeleton (folders + build command + version control) and bring the program back up on a fresh machine from three README commands.",
      summary: [
        "把 1-2 到 1-5 串成一条固定动作：建目录 → 写 main.cpp → 用 `-std=c++17 -Wall -Wextra -g` 编译 → 运行 → 改一行再重编，亲眼确认「不重编就没有新结果」。",
        "最小工程骨架：src/ 放 .cpp，include/ 放 .h，build/ 放产物，README.md 写清编译命令。这三分钟的结构会在 s18 的项目里救你一次。",
        "读报错要抓三层：文件与行号 → 错误类型与关键名 → 编译器给的修复建议；第一条错误最重要，后面的多半是它的连锁反应。",
        "把警告当 bug 处理：先清空 `-Wall -Wextra` 的存量警告，再考虑 `-Werror`。未初始化、有符号/无符号比较这两类警告几乎必然是真问题。",
        "建立「改→编→跑→看」的小循环肌肉：一次只改一处，改完就跑；一次改十处再编，出错时你无法判断是哪一处引入的。",
        "版本控制现在就该进：`git init` + `.gitignore`（忽略 build/ 与 *.o、*.obj），比任何「以后再说」都便宜，也比任何备份目录可靠。",
        "本章达标线（自查用）：换一台新机器、换一个编译器，只要照 README 的三条命令就能跑起来——这才是「环境真的会装了」。"
      ],
      summary_en: [
        "Chain 1-2 to 1-5 into one fixed loop: create a folder → write main.cpp → build with -std=c++17 -Wall -Wextra -g → run → change one line and rebuild, and watch that no rebuild means no new result.",
        "Minimal skeleton: src/ for .cpp, include/ for .h, build/ for outputs, README.md stating the build command. Those three minutes will save you once in the s18 project.",
        "Read a diagnostic in three layers: file and line → error kind and the offending name → the compiler's suggested fix. The first error matters most; the rest are usually its fallout.",
        "Treat warnings as bugs: clear the existing -Wall -Wextra noise before you consider -Werror. Uninitialised values and signed/unsigned comparisons are almost always real defects.",
        "Train the edit → build → run → observe loop: change one thing and run. Ten changes before a build and you cannot tell which one broke it.",
        "Version control starts now: git init plus a .gitignore (build/, *.o, *.obj) is cheaper than any 'later' and more reliable than any backup folder.",
        "Bar for this chapter (self-check): on a new machine with a different compiler, three README commands bring the program back up — that is what 'I can set up an environment' really means."
      ],
      code: `// 一次到位的最小骨架（在项目根目录执行）
mkdir -p src include build
git init
printf 'build/\\n*.o\\n*.obj\\n' > .gitignore
// README 里要能一句话复现的三条命令
g++ -std=c++17 -Wall -Wextra -g src/*.cpp -o build/app
./build/app
// 打印上一步的退出码：0 才算真的跑通
echo $?`,
      pit: "把编译产物（build/、*.o、可执行文件）也提交进 git：换机器后旧产物比新代码还新，链接器和编译器会给出你完全解释不了的结果。",
      pit_en: "Committing build outputs (build/, *.o, executables): on another machine the stale artefacts look newer than the code, and the linker produces results you cannot explain.",
      ex: {
        q: "为什么「换台机器还能跑」比「我这台能跑」更接近工程能力？",
        a: "因为前者逼你把隐含依赖（编译器版本、PATH、库、构建命令）显式写出来；隐含依赖一旦写清，问题就从玄学变成了配置。",
        q_en: "Why is 'it also runs on another machine' closer to engineering than 'it runs on mine'?",
        a_en: "Because the former forces you to make hidden dependencies (compiler version, PATH, libraries, build command) explicit; once they are written down, mystery becomes configuration."
      }
    },

    /* ===================== s2 变量与基本类型 ===================== */
    "2-1": {
      min: 11,
      summary: [
        "声明的本质是向编译器要一块**指定大小、指定解释规则**的内存并起名字：`int score = 0;` 里的 int 决定占几字节、按什么格式看这串位。",
        "C++ 是静态强类型：类型在编译期定死且不会变，`score = \"abc\";` 直接编译失败，而不是运行到那行才炸——这是很多运行期 bug 根本不会出现的原因。",
        "三种初始化写法：`= 0`、`(0)`、`{0}`。`{}` 是统一初始化，能拦住窄化（把 3.9 塞进 int 会报错），默认用它最安全。",
        "未初始化的局部变量是垃圾值：读它就是未定义行为——可能读到 0，也可能是上一次栈帧的残留，「跑十次都对、换台机器就崩」是标准剧本。",
        "名字是写给人看的：`d` 三天后没人知道是 days 还是 discount；单字母只留给 i/j/k 这类循环计数器。",
        "变量尽量在第一次使用的地方声明，作用域越小越好——这和 2-5 作用域、s9 封装其实是同一条原则的三个尺度。",
        "衔接：会声明之后，2-2 讨论「该选哪种类型」，2-4 讨论「类型之间怎么转才不会悄悄丢值」。"
      ],
      summary_en: [
        "A declaration asks the compiler for memory of a fixed size and interpretation and names it: in 'int score = 0;', int decides how many bytes and how to read those bits.",
        "C++ is statically and strongly typed: the type is fixed at compile time, so 'score = \"abc\";' fails to compile instead of exploding at runtime — which is why whole classes of runtime bugs never appear.",
        "Three init forms: '= 0', '(0)', '{0}'. Braces are uniform initialisation and block narrowing (3.9 into an int becomes a compile error), so use them by default.",
        "An uninitialised local holds garbage: reading it is undefined behaviour — maybe 0, maybe the previous stack frame's leftovers. 'Works ten times, crashes on another machine' is the standard script.",
        "Names are for humans: nobody remembers whether 'd' is days or discount three days later. Reserve single letters for counters like i/j/k.",
        "Declare variables close to first use and keep scope small — that is the same principle as 2-5 scope and s9 encapsulation at three different scales.",
        "Bridge: once you can declare, 2-2 picks the right type and 2-4 converts between types without silently losing values."
      ],
      code: `int main() {
    int count = 0;          // 推荐：声明即初始化
    double avg{0.0};        // 统一初始化，还能防窄化
    int narrow = 3.9;       // 隐式截断成 3，多数编译器只给一条警告
    // 换成大括号立刻是编译错误：这才是我们想要的保护
    // int strict{3.9};
    // 打开下面两行：可能编过，但读的是垃圾值
    // int bad; std::cout << bad;
    return 0;
}`,
      pit: "`int a, b = 0;` 只初始化了 b，a 仍是垃圾值——逗号声明里等号只贴着自己那一个变量，这是「看起来初始化了其实没有」的经典写法。",
      pit_en: "'int a, b = 0;' initialises only b; a stays garbage. In a comma declaration the '=' binds to its own declarator only — a classic 'looks initialised, is not'.",
      ex: {
        q: "为什么 `{}` 初始化能防住窄化，而 `=` 不能？",
        a: "列表初始化有专门规则：可能丢失信息的转换（浮点转整数、long 转 short）会被判为非法；`=` 走普通隐式转换，编译器默默截断。",
        q_en: "Why does brace initialisation block narrowing while '=' does not?",
        a_en: "List-initialisation has an extra rule: conversions that could lose information (float to int, long to short) are ill-formed, whereas '=' takes the implicit conversion and truncates quietly."
      }
    },

    "2-2": {
      min: 13,
      summary: [
        "整数族按**范围**选：char(8 位) < short < int(通常 32 位) < long(Windows 32 / Linux 64) < long long(64 位)；int 的上下限约 ±21 亿。",
        "浮点族按**精度**选：float 约 6~7 位有效数字，double 约 15~16 位。默认写 double，除非要省内存或硬件只支持 float。",
        "整数没有误差但会溢出：超界后按补码回绕变成负数，编译器不报错——「结果看着合理其实完全错」最常见于这里。",
        "浮点不会回绕但有误差：0.1 + 0.2 不等于 0.3；比较要用 `fabs(a - b) < 1e-9`，钱要存成整数「分」，别用 double 记账。",
        "char 本质是个小整数（ASCII）：`'7' - '0' == 7`；char/short/bool 参与运算时会先提升为 int，别假设结果还是原来的类型。",
        "有符号与无符号混算（int 与 unsigned）是隐藏地雷：无符号减成负数会变成天文数字，`for (unsigned i = n; i-- > 0;)` 这类写法要格外小心。",
        "尺寸用 `sizeof` 现场查，别背：标准只规定下限，跨平台会变；需要精确位宽时用 `<cstdint>` 里的 int32_t / uint64_t。"
      ],
      summary_en: [
        "Pick integers by range: char (8 bits) < short < int (usually 32) < long (32 on Windows, 64 on Linux) < long long (64); int spans roughly +/-2.1 billion.",
        "Pick floats by precision: float gives about 6-7 significant digits, double about 15-16. Default to double unless memory or the hardware says otherwise.",
        "Integers have no rounding but do overflow: past the limit they wrap in two's complement into negative values with no error — the classic 'plausible but wrong' result.",
        "Floats never wrap but do round: 0.1 + 0.2 != 0.3, so compare with fabs(a - b) < 1e-9 and store money as integer cents, not double.",
        "char is really a small integer (ASCII): '7' - '0' == 7; char/short/bool promote to int inside expressions, so do not assume the result keeps its original type.",
        "Mixing signed and unsigned is a buried mine: an unsigned that goes below zero becomes a huge number, and shapes like 'for (unsigned i = n; i-- > 0;)' need care.",
        "Query sizes with sizeof instead of memorising them: the standard only sets lower bounds, so they vary by platform; use int32_t / uint64_t from <cstdint> when width must be exact."
      ],
      code: `#include <cstdint>
#include <cmath>
int main() {
    int edge = 2147483647;      // int 的上限附近
    // edge + 1 会回绕成负数：不报错，但结果完全错
    long long big = 10000000000LL;  // 超 int 范围：必须 long long 并加 LL 后缀
    int32_t exact = 5;          // 需要「正好 32 位」时写 int32_t
    char c = '9';
    int digit = c - '0';        // 靠 ASCII 连续性把字符变数字
    double a = 0.1 + 0.2;
    bool ok = std::fabs(a - 0.3) < 1e-9;   // 浮点比较：比差值，不判相等
    std::cout << sizeof(int) << sizeof(double) << '\\n';  // 平台相关，自己查
    return 0;
}`,
      pit: "`0.1 + 0.2 == 0.3` 判为 false 后有人改用 float 想「精度低一点就正好」——误差跟位数无关，只要用浮点，比较就必须走差值或整数分。",
      pit_en: "After 0.1 + 0.2 == 0.3 comes out false, some switch to float hoping 'less precision is exact' — rounding does not care about width; with floats compare a difference or use integer cents.",
      ex: {
        q: "存「一个人的年龄」和「全国人口」分别选什么类型？为什么？",
        a: "年龄用 int（远小于 21 亿，且要参与算术）；人口约十几亿到 80 亿级别，一旦可能超 int 就直接 long long，别赌上限。",
        q_en: "Which types for a person's age versus a country's population, and why?",
        a_en: "Age: int, far below 2.1 billion and used in arithmetic. Population can pass the int range, so take long long instead of betting on the limit."
      }
    },

    "2-3": {
      min: 11,
      summary: [
        "`const` 的语义是「承诺只读」：编译期禁止再赋值，把意图写进类型里，比注释可信得多，也比口头约定可检查。",
        "const 必须初始化——`const int x;` 是编译错误：它一生只能被赋一次值，就是声明这一次。",
        "`constexpr` 更强：值在**编译期**就算出来，可以当数组长度、模板参数；只有运行期才知道的量（读入的配置）只能用 const。",
        "魔法数字要变名字：代码里的 3.14159、86400、0.006 换成 `constexpr double PI`、`constexpr int SECONDS_PER_DAY`——见名知义且一处改全局生效。",
        "const 也会出现在函数与引用上：`const std::string&` 参数（只读又不拷贝）、`int sum() const` 成员函数（不改对象），那是 s5 和 s9 的重点，现在先建立「只读就标 const」的直觉。",
        "编译器会对常量做常量折叠，`constexpr` 的算式不占运行时间——所以「为了性能把结果写死」通常没必要，写清楚更重要。",
        "命名习惯：全局常量与配置用全大写加下划线（MAX_LEVEL），函数内的临时 const 用普通驼峰——一眼区分「策略」和「这次计算用的值」。"
      ],
      summary_en: [
        "const means 'promised read-only': assignment is illegal at compile time, so the intent lives in the type instead of a comment — checkable, unlike a verbal agreement.",
        "const must be initialised: 'const int x;' is a compile error, because a const is assigned exactly once in its life, at declaration.",
        "constexpr is stronger: the value is computed at compile time, so it can size arrays and fill template parameters; anything only known at runtime takes plain const.",
        "Name the magic numbers: replace 3.14159, 86400, 0.006 with constexpr double PI or constexpr int SECONDS_PER_DAY — self-documenting, and one edit applies everywhere.",
        "const also decorates functions and references: a const std::string& parameter (read-only, no copy) and int sum() const (does not touch the object) — s5 and s9 details, but build the 'if it is read-only, mark it' reflex now.",
        "The compiler folds constants anyway, so constexpr arithmetic costs no runtime — hard-coding a result 'for speed' is rarely needed; being clear is better.",
        "Naming: ALL_CAPS for global constants and configuration (MAX_LEVEL), ordinary camelCase for a const local — it separates 'policy' from 'a value for this computation'."
      ],
      code: `constexpr double PI = 3.14159265358979;
constexpr int MAX_LEVEL = 10;
const int limit = MAX_LEVEL * 2;   // 编译期算得出来，也允许运行期初始化

int main() {
    // 编译错误：常量不可改，这正是它的价值
    // MAX_LEVEL = 3;
    int arr[MAX_LEVEL];            // 只有编译期常量才能当数组长度
    double r = 2.0, area = PI * r * r;
    return 0;
}`,
      pit: "把 `const` 放在不同位置含义完全不同：`const int* p` 是指向的内容不可改，`int* const p` 是指针本身不可改。这一层留到 s7 正面处理，但先别以为「const 只有一种写法」。",
      pit_en: "Where you put const changes its meaning: const int* p keeps the pointee read-only, int* const p keeps the pointer itself read-only. s7 handles this head-on, but do not assume there is only one const form.",
      ex: {
        q: "同一个「圆的半径」，什么时候该用 const，什么时候该用 constexpr？",
        a: "半径来自输入（用户填、文件读）就只能 const；写死在代码里、且要用于数组长度或模板参数时用 constexpr。",
        q_en: "For a circle's radius, when is const right and when is constexpr?",
        a_en: "If the radius comes from input, plain const; if it is written in the code and feeds an array bound or template argument, use constexpr."
      }
    },

    "2-4": {
      min: 12,
      summary: [
        "隐式转换很方便也会咬人：int→double 自动发生；double→int 静默截断小数；char→int 得到 ASCII 码而不是它表示的数字。",
        "整数除法是新手第一颗雷：`5/2 == 2`，`1/2 * 3.14` 直接归零。只要有一边是浮点，才会走浮点除法。",
        "显式转换首选 `static_cast<T>(x)`：意图写在代码里，评审看得懂，也方便 grep 出所有转换点。",
        "C 风格强转 `(int)x` 更宽松，还能悄悄做掉指针与 const 相关的危险转换——初学阶段一律用 static_cast。",
        "混合表达式按等级提升（int→unsigned→long→float→double）：`a * 0.5` 会把 a 升成 double 再乘；无符号与有符号混算时结果可能变成巨大的无符号数。",
        "浮点转整数是「向零截断」不是四舍五入：`static_cast<int>(-2.7) == -2`；要四舍五入先 `std::round` 再转。",
        "转换链要守住精度顺序：`static_cast<double>(a)/b` 与 `a/static_cast<double>(b)` 都对，`static_cast<double>(a/b)` 错——先做了整数除法，后面再转已经晚了。"
      ],
      summary_en: [
        "Implicit conversion is convenient but biting: int to double happens silently, double to int truncates, char to int yields the ASCII code rather than the digit it shows.",
        "Integer division is the first landmine: 5/2 == 2, and 1/2 * 3.14 collapses to zero. You only get floating-point division if one side is floating-point.",
        "Prefer static_cast<T>(x): the intent is in the code, reviewers see it, and you can grep every conversion.",
        "C-style (int)x is looser and can quietly perform dangerous pointer and const casts — while learning, use static_cast everywhere.",
        "Mixed expressions promote by rank (int to unsigned to long to float to double): a * 0.5 lifts a to double first; mixing signed with unsigned can turn the result into a huge unsigned value.",
        "Float to int truncates toward zero, not to nearest: static_cast<int>(-2.7) == -2; use std::round before casting when you mean rounding.",
        "Keep the precision order in the cast chain: static_cast<double>(a)/b and a/static_cast<double>(b) are right, static_cast<double>(a/b) is wrong — the integer division already happened."
      ],
      code: `#include <cmath>
int main() {
    int a = 5, b = 2;
    double r1 = a / b;                        // 2.0：先整数除法，0.5 已经没了
    double r2 = static_cast<double>(a) / b;    // 2.5：正确写法
    double r3 = a * 0.5;                      // 2.5：0.5 让 a 自动升成 double
    int back = static_cast<int>(-2.7);        // -2：向零截断
    int rounded = static_cast<int>(std::round(-2.7));  // -3：先四舍五入再转
    char c = '9';
    int wrong = c;                            // 57：ASCII 码
    int right = c - '0';                      // 9：想拿数字就减去 '0'
    return 0;
}`,
      pit: "百分比、平均值这类计算最容易翻车：`count / total * 100` 在整数里几乎恒为 0。正确姿势是先转成 double 再算（`100.0 * count / total`），别指望编译器替你想到。",
      pit_en: "Percentages and averages break first: count / total * 100 in integers is nearly always 0. Convert up front (100.0 * count / total) — do not expect the compiler to read your intent.",
      ex: {
        q: "`static_cast<double>(a / b)` 和 `static_cast<double>(a) / b` 差别在哪？",
        a: "前者先把整数除法做完（小数部分已丢弃）再转类型，等于把错误结果包装一下；后者先把 a 升成 double，除法本身按浮点走。",
        q_en: "What is the difference between static_cast<double>(a / b) and static_cast<double>(a) / b?",
        a_en: "The first performs the integer division (already truncated) and only then changes the type, dressing up a wrong answer; the second lifts a to double first so the division itself is floating-point."
      }
    },

    "2-5": {
      min: 11,
      summary: [
        "作用域就是一个名字可见的区间，通常是一对 `{}`；块结束时其中的局部对象立即销毁——这是后面所有生命周期问题的地基。",
        "同名时内层遮蔽外层（shadowing）：`int x=1; { int x=2; }` 里内层是另一个变量，外层毫不知情；内层块一结束，x 又回到 1。",
        "遮蔽看着无害其实危险：编译器默认不提醒（要显式开 `-Wshadow`），函数参数与局部变量同名时尤其难查。",
        "局部变量住在栈上，函数返回就没了：返回局部变量的指针或引用必然悬空——这是 s5 返回值与 s7 指针章的核心伏笔。",
        "全局/静态变量活到程序结束，且默认零初始化；拿它们当「临时共享通道」会让函数不再自洽，测试时无从下手。",
        "`for (int i = 0; ...)` 里声明的 i 只属于这个循环，所以两个 for 各写一个 i 完全安全——这是推荐的写法，而不是巧合。",
        "经验法则只有一个字：小。声明离使用越近、作用域越小，读代码和查 bug 的成本越低——作用域是免费的防御手段。"
      ],
      summary_en: [
        "A scope is the region where a name is visible, usually a pair of braces; objects inside die at the closing brace — this is the ground under every lifetime question later.",
        "Same name inner shadows outer: in 'int x=1; { int x=2; }' the inner x is a different variable and the outer one never hears about it; after the block, x is 1 again.",
        "Shadowing looks harmless but bites: the compiler stays quiet by default (-Wshadow must be asked for), and a local that hides a parameter is especially hard to spot.",
        "Locals live on the stack and die at return: returning a pointer or reference to one always dangles — the setup for s5 return values and s7 pointers.",
        "Globals and statics live until the program ends and are zero-initialised by default; using them as an ad-hoc sharing channel destroys function independence and makes testing painful.",
        "The i declared in 'for (int i = 0; ...)' belongs only to that loop, so two loops each writing int i is perfectly safe — that is the recommended style, not an accident.",
        "One rule of thumb: small. The closer a declaration is to its use and the smaller its scope, the cheaper reading and debugging become — scope is free protection."
      ],
      code: `#include <iostream>
int main() {
    int x = 1;
    {
        int x = 2;        // 遮蔽：另一个变量，默认没有任何提醒
        x += 10;
    }                     // 内层 x 在这一行销毁
    std::cout << x;       // 1：外层从头到尾没被动过

    for (int i = 0; i < 3; ++i) { /* ... */ }
    for (int i = 0; i < 3; ++i) { /* ... */ }   // 两个 i 互不干扰
    // 编译错误：循环外根本没有 i 这个名字
    // std::cout << i;
    return 0;
}`,
      pit: "在 `if` 的花括号里定义了变量，出了 `}` 还想用——编译期就报错；但更隐蔽的是外层同名变量还在，于是「改了内层、读的是外层」，值永远不动。",
      pit_en: "Defining a variable inside an if-block and using it after the closing brace is a compile error; subtler is when an outer same-named variable still exists — you write to the inner one and read the outer one, and the value never moves.",
      ex: {
        q: "为什么「能小就小」在 C++ 里比在有些语言里更重要？",
        a: "因为 C++ 的对象离开作用域就真的销毁（析构立即执行），作用域直接决定资源什么时候被释放；范围越大，悬空与泄漏的机会越多。",
        q_en: "Why does 'keep it small' matter more in C++ than in some other languages?",
        a_en: "Because a C++ object really dies at the end of its scope — destructors run right there — so scope decides when resources are released; wider scope means more chances to dangle or leak."
      }
    },

    "2-6": {
      title: "综合重构：类型选型与初始化清单",
      title_en: "Synthesis: A Type-and-Initialisation Checklist",
      min: 14,
      target: "拿到需求能一次说清每个数据的类型、是否 const、作用域，并能说出每种选择对应的出错方式。",
      target_en: "Given a requirement, state each datum's type, whether it is const, and its scope — and name the failure mode of every choice made.",
      summary: [
        "收口三问：这条数据范围多大（决定类型）→ 会不会变（决定 const/constexpr）→ 谁会读它（决定作用域）。三问答完，s2 的内容就用完了。",
        "选型速查：整数默认 int，可能超 21 亿立刻 long long，要精确位宽用 int32_t/uint64_t；小数一律 double；字符 char；真假 bool。",
        "三条铁律：声明即初始化；用 `{}` 防窄化；除法前先看两边是什么类型。这三条能挡掉本章 90% 的 bug。",
        "把 2-1 到 2-5 拼成一个骨架：常量放文件顶部（全大写）、变量在函数内靠近使用处、输出统一 `std::cout` 配 `'\\n'`。",
        "常见翻车复盘：整数除法归零 / 溢出回绕成负 / 读未初始化的垃圾值 / 遮蔽导致改内层读外层 / 0.1+0.2 判相等失败。",
        "自测方法：给可疑表达式加一行 `std::cout` 打印中间值，比盯着代码看有效得多——这正是 sdbg 调试章要正式化的习惯。",
        "衔接：s3 会用这些类型做运算与输入输出，s4 引入判断与循环；两章合起来就够写出第一个真正有意义的小程序。"
      ],
      summary_en: [
        "Closing three questions: how big is this datum (chooses the type), can it change (chooses const/constexpr), who reads it (chooses scope). Answer all three and s2 is done.",
        "Quick chart: int by default, long long the moment 2.1 billion is in reach, int32_t/uint64_t for exact widths, double for fractions, char for characters, bool for truth.",
        "Three iron rules: initialise at declaration; use braces to block narrowing; check both operand types before dividing. These three kill 90% of this chapter's bugs.",
        "Assemble 2-1 to 2-5 into a skeleton: constants at the top of the file in ALL_CAPS, variables near first use, output via std::cout with '\\n'.",
        "Failure retrospective: integer division collapsing to zero, overflow wrapping negative, reading garbage, shadowing so you write inner and read outer, comparing 0.1 + 0.2 to 0.3.",
        "Self-test habit: print the intermediate value with std::cout instead of staring at the code — exactly what the sdbg debugging chapter will formalise.",
        "Bridge: s3 computes and does I/O with these types, s4 adds decisions and repetition; together they are enough for your first meaningful little program."
      ],
      code: `#include <iostream>
#include <cmath>
constexpr double TAX = 0.06;      // 会变的话就只是 const，不会变就该 constexpr

int main() {
    int count = 0;                // 铁律 1：声明即初始化
    int total = 0;
    std::cout << "输入两件商品的数量与总数：";
    std::cin >> count >> total;

    double pct = 100.0 * count / total;      // 铁律 3：先确认类型再除法
    int price = static_cast<int>(std::round(19.99 * (1 + TAX)));  // 钱用整数「分」思维
    // 铁律 2 的反例：遮蔽
    // { int price = 0; }

    std::cout << "占比 " << pct << "%，含税价 " << price << " 元\\n";
    return 0;
}`,
      pit: "清单写完了却只在脑子里过一遍——下次遇到「结果怎么是 0」还是要重新推。把这三问变成动笔动作（写下类型和作用域），才是这一章真正要养成的习惯。",
      pit_en: "Running the checklist only in your head means you re-derive everything the next time a result comes out 0. Writing the type and scope down is the habit this chapter is actually after.",
      ex: {
        q: "这三问里哪一问最容易在真实项目里被忽略？",
        a: "「谁会读它」——作用域与可见性问题在单人小项目里几乎无感，一到多人协作或加测试，全局可变状态立刻变成难查的耦合。",
        q_en: "Which of the three questions gets skipped most in real projects?",
        a_en: "'Who reads it' — scope barely matters in a solo toy project, but as soon as collaborators or tests appear, mutable global state turns into hard-to-trace coupling."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择/判断/填空混排） ---------- */
  quizAdd: {
    s1: [
      {
        q: "关于 C++ 的编译产物，下列说法正确的是？",
        o: ["编译后仍需解释器逐行执行", "直接编译成机器码由 CPU 执行", "必须依赖虚拟机管理内存", "只能在 Linux 上运行"],
        a: 1,
        why: "C++ 编译出的是机器码可执行文件，运行时没有解释器或虚拟机夹在中间，这也是它需要你自己管内存的原因。",
        q_en: "Which statement about a C++ build product is correct?",
        o_en: ["It still needs an interpreter to run line by line", "It compiles straight to machine code executed by the CPU", "It must rely on a VM for memory management", "It only runs on Linux"],
        why_en: "C++ produces a native executable with no interpreter or VM at run time — the same reason memory management is yours."
      },
      {
        q: "`g++ main.cpp -o main` 跑完后你又改了代码，但没有重新编译，直接运行 ./main，结果是？",
        o: ["编译报错", "运行的仍是上一次编译的旧版本", "自动重新编译后再运行", "运行新版本但可能不稳定"],
        a: 1,
        why: "可执行文件是上次编译的产物，源码改动不会自动生效；「改了没反应」几乎都是忘了重新编译。",
        q_en: "After 'g++ main.cpp -o main' you edit the code but do not rebuild and run ./main. What happens?",
        o_en: ["A compile error", "The previously compiled binary still runs", "It rebuilds automatically first", "The new version runs but may be unstable"],
        why_en: "The executable is the artefact of the last build; source edits never apply on their own. 'I changed it but nothing happened' is almost always a missed rebuild."
      },
      {
        q: "判断：`std::endl` 和 `'\\n'` 完全等价，用哪个都一样。",
        type: "judge", a: 1,
        why: "endl 除了换行还会刷新输出缓冲区；大量输出时这会明显拖慢速度，只有需要立刻看到内容时才用它。",
        q_en: "True or false: std::endl and '\\n' are exactly equivalent.",
        why_en: "False. endl also flushes the output buffer, which measurably slows heavy output; reach for it only when the line must appear immediately."
      },
      {
        q: "C++ 程序的入口函数名是 ______（填英文）。",
        type: "fill", ans: ["main"],
        why: "操作系统约定调用的入口是 main；大小写敏感，写成 Main 会链接失败。",
        q_en: "The entry function of a C++ program is named ______.",
        why_en: "The OS calls main; it is case-sensitive, so Main fails at link time."
      }
    ],
    s2: [
      {
        q: "下面哪个表达式的结果**不是** 2.5？",
        o: ["static_cast<double>(5) / 2", "5 * 0.5", "5 / 2 * 1.0", "5.0 / 2"],
        a: 2,
        why: "5 / 2 先按整数除法得到 2，再乘 1.0 只会得到 2.0；转换必须发生在除法之前。",
        q_en: "Which expression does NOT evaluate to 2.5?",
        o_en: ["static_cast<double>(5) / 2", "5 * 0.5", "5 / 2 * 1.0", "5.0 / 2"],
        why_en: "5 / 2 is integer division first (2), and multiplying by 1.0 afterwards only gives 2.0 — the conversion has to happen before the division."
      },
      {
        q: "要存一个可能超过 30 亿的人数，应选？",
        o: ["int", "short", "long long", "float"],
        a: 2,
        why: "int 约 ±21 亿，30 亿会溢出回绕；float 只有 6~7 位有效数字，精确计数不能用它。",
        q_en: "Which type stores a headcount that may exceed 3 billion?",
        o_en: ["int", "short", "long long", "float"],
        why_en: "int tops out near 2.1 billion and would wrap; float has only 6-7 significant digits, so it cannot hold an exact count."
      },
      {
        q: "判断：`int a, b = 0;` 之后 a 的值是 0。",
        type: "judge", a: 1,
        why: "等号只贴着自己那一个声明符，a 仍未初始化，读它是未定义行为。要么写 `int a = 0, b = 0;`，要么用 `int a{}, b{};`。",
        q_en: "True or false: after 'int a, b = 0;', a holds 0.",
        why_en: "False. The '=' binds only to its own declarator, so a stays uninitialised and reading it is undefined behaviour — write int a = 0, b = 0; or int a{}, b{};."
      },
      {
        q: "希望「3.9 赋给 int 时直接编译报错」，应使用哪种初始化写法？填括号里的符号（如 () 或 {}）。",
        type: "fill", ans: ["{}", "花括号", "大括号", "braces", "brace"],
        why: "列表初始化会拒绝窄化转换，把 double 塞进 int 变成编译错误；= 和 () 都只是默默截断。",
        q_en: "To make '3.9 into an int' a compile error, which initialisation form do you use? Answer with the bracket pair (e.g. () or {}).",
        why_en: "List-initialisation rejects narrowing, so a double into an int becomes ill-formed; both = and () just truncate silently."
      }
    ]
  },

  /* ---------- 词典：原地 push，分类统一为「C++ 语言地基」 ---------- */
  terms: [
    { term: "编译单元", term_en: "Translation Unit", cat: "C++ 语言地基",
      short: "一个 .cpp 连同它包含的所有头文件，构成一次独立编译的单位。",
      short_en: "One .cpp together with every header it includes, compiled as a single unit.",
      detail: ["链接器按名字在不同编译单元之间对接，所以重复定义会在链接期爆炸。", "新增 .cpp 却忘了加进构建清单，是最典型的 undefined reference 来源。"],
      detail_en: ["The linker matches names across translation units, which is why duplicate definitions explode at link time.", "Adding a .cpp but not to the build list is the classic source of undefined reference."],
      vs: "编译单元管「一次编译多大范围」，作用域管「一个名字在哪可见」。",
      vs_en: "A translation unit bounds one compilation; a scope bounds one name." },
    { term: "链接错误", term_en: "Link Error", cat: "C++ 语言地基",
      short: "名字找不到定义或重复定义，报错通常没有行号。",
      short_en: "A name with no definition, or with two — usually reported without a line number.",
      detail: ["看到 undefined reference 先查构建清单与实现文件，不要改语法。", "「error was not declared in this scope」是编译错误，两类要分开处理。"],
      detail_en: ["On undefined reference, check the build list and the implementation file rather than the syntax.", "'Not declared in this scope' is a compile error; keep the two categories apart."],
      vs: "编译错误查语法，链接错误查名字来源。",
      vs_en: "Debug compile errors for syntax, link errors for where a name comes from." },
    { term: "未定义行为", term_en: "Undefined Behaviour", cat: "C++ 语言地基",
      short: "标准不规定结果的操作，例如读未初始化变量、越界访问。",
      short_en: "An operation the standard places no constraint on, such as reading an uninitialised variable or indexing out of bounds.",
      detail: ["UB 最坏的地方是「这次跑对了」：优化级别、编译器、机器一变结果就变。", "编译器还会反过来利用「你不会有 UB」做优化，于是 bug 被放大成不可思议的现象。"],
      detail_en: ["The worst property of UB is that it can appear to work: results shift with optimisation level, compiler and machine.", "The compiler also assumes you have no UB and optimises accordingly, turning a small bug into a bizarre one."],
      vs: "未定义行为是「结果不可预测」，实现定义行为是「由编译器规定但可查」。",
      vs_en: "Undefined behaviour has no predictable result; implementation-defined behaviour is decided by the compiler but documented." },
    { term: "窄化转换", term_en: "Narrowing Conversion", cat: "C++ 语言地基",
      short: "可能丢信息的转换，如 double→int；用 {} 初始化会被编译器拒绝。",
      short_en: "A conversion that can lose information, such as double to int; brace initialisation rejects it.",
      detail: ["`= 3.9` 与 `(3.9)` 都会默默截断，只有 `{3.9}` 报错。", "统一初始化的最大价值就是把窄化变成编译期问题。"],
      detail_en: ["Both '= 3.9' and '(3.9)' truncate quietly; only '{3.9}' is an error.", "That is the main payoff of uniform initialisation: narrowing becomes a compile-time issue."],
      vs: "窄化怕丢精度，溢出怕丢范围。",
      vs_en: "Narrowing risks precision; overflow risks range." },
    { term: "溢出回绕", term_en: "Integer Wraparound", cat: "C++ 语言地基",
      short: "整数超出表示范围后按补码绕回另一端，编译器不报错。",
      short_en: "An integer passing its range wraps to the other end in two's complement, with no error.",
      detail: ["「结果看着合理却完全错」最常见的来源，尤其是累加与乘法。", "对策：估算上限、用 long long、必要时先转 double 再算。"],
      detail_en: ["The leading cause of 'plausible but wrong' answers, especially in sums and products.", "Countermeasures: estimate the bound, use long long, or widen to double before multiplying."],
      vs: "浮点是误差累积，整数是突然回绕。",
      vs_en: "Floats drift with rounding error; integers snap around all at once." },
    { term: "变量遮蔽", term_en: "Name Shadowing", cat: "C++ 语言地基",
      short: "内层作用域声明同名变量，悄悄盖住外层那份。",
      short_en: "An inner scope declares the same name and quietly hides the outer one.",
      detail: ["编译器默认不提醒，需显式开 -Wshadow。", "函数参数与局部变量同名最难查，因为「改了但值不动」。"],
      detail_en: ["The compiler stays silent unless you ask for -Wshadow.", "A local shadowing a parameter is the hardest to spot: you write, yet nothing changes."],
      vs: "遮蔽是两个变量，重名冲突是同一个变量的重复定义。",
      vs_en: "Shadowing means two variables; redefinition clashes one name against two definitions." },
    { term: "浮点舍入误差", term_en: "Floating-Point Rounding Error", cat: "C++ 语言地基",
      short: "二进制无法精确表示多数十进制小数，导致 0.1+0.2≠0.3。",
      short_en: "Binary cannot represent most decimal fractions, so 0.1 + 0.2 != 0.3.",
      detail: ["比较要用差值阈值（如 1e-9），不要判相等。", "金额、计数这类要求精确的量用整数「分」存。"],
      detail_en: ["Compare with a tolerance such as 1e-9 instead of equality.", "Store money and exact counts as integer cents."],
      vs: "溢出是范围问题，舍入是表示问题。",
      vs_en: "Overflow is about range; rounding is about representation." },
    { term: "clang-format", term_en: "clang-format", cat: "C++ 语言地基",
      short: "按配置文件自动排版 C++ 代码的官方工具。",
      short_en: "The official tool that reformats C++ according to a config file.",
      detail: ["仓库里放 .clang-format，保存即格式化，评审 diff 只剩真实改动。", "风格之争交给工具，比人工统一可靠。"],
      detail_en: ["Keep a .clang-format in the repo and format on save so review diffs show real changes only.", "Automating style beats keeping humans consistent."],
      vs: "clang-format 管排版，clang-tidy 管写法质量。",
      vs_en: "clang-format handles layout; clang-tidy handles code quality." }
  ],

  achievements: [
        { id: "type_sense", icon: "🔢", name: "类型手感", name_en: "Type Instinct",
      desc: "完成 s2 · 变量与基本类型 全部课节", desc_en: "Finish every lesson of s2 Variables & Basic Types",
      check: ["s2"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "编译期就算出来：constexpr 不产生任何运行时开销": "folded at compile time: constexpr costs nothing at run time",
    "0 表示正常结束，非 0 常被脚本当作失败": "0 means success; non-zero is usually read as failure",
    "检查顺序：先确认工具存在，再编译，最后运行": "Check order: confirm the tool exists, then build, then run",
    "1) 编译器找得到吗": "1) Is the compiler reachable?",
    "2) 打开全部警告再编译": "2) Build with every warning enabled",
    "3) 运行：Windows 下写 main.exe": "3) Run: on Windows type main.exe",
    "若第 1 步报「不是内部或外部命令」：把 g++ 所在目录加入 PATH 后重开终端": "If step 1 says 'not recognized', add g++'s folder to PATH and reopen the terminal",
    "'\\n' 比 endl 少一次刷新": "'\\n' skips the flush that endl performs",
    "<< 可以一直串，数字自动转成文本": "<< chains on; numbers are converted to text",
    "需要立刻看到时才用 endl": "use endl only when the line must appear now",
    "0 = 成功，可在 shell 里读到": "0 = success, readable from the shell",
    "一条 g++ 命令其实做了四件事": "One g++ command actually does four things",
    "只编译不链接：停在目标文件，缺定义也照样通过": "Compile without linking: stops at the object file, missing definitions still pass",
    "链接：把目标文件和标准库拼成可执行文件": "Link: joins objects and the standard library into one executable",
    "上面两步的合并写法": "the two steps above in a single command",
    "故意留一个只声明没实现的函数，观察两种报错的区别：": "Leave a function declared but undefined and compare the two error kinds:",
    "编译期 error: 'foo' was not declared in this scope —— 语法层，带行号": "compile error: 'foo' was not declared in this scope — syntax layer, with a line number",
    "链接期 error: undefined reference to 'foo' —— 名字层，没有行号": "link error: undefined reference to 'foo' — name layer, no line number",
    "为什么是 0：未初始化的累加器是未定义行为的入口": "why 0: an uninitialised accumulator is a gateway to undefined behaviour",
    "TODO(huangdou, 2026-09): s15 学完文件读写后补上持久化": "TODO(huangdou, 2026-09): add persistence after the s15 file chapter",
    "一次到位的最小骨架（在项目根目录执行）": "the minimal skeleton in one go (run at the project root)",
    "README 里要能一句话复现的三条命令": "three README commands that reproduce everything",
    "打印上一步的退出码：0 才算真的跑通": "print the previous exit code: only 0 counts as working",
    "推荐：声明即初始化": "recommended: initialise at declaration",
    "统一初始化，还能防窄化": "uniform initialisation, also blocks narrowing",
    "隐式截断成 3，多数编译器只给一条警告": "silently truncated to 3; most compilers only warn",
    "换成大括号立刻是编译错误：这才是我们想要的保护": "with braces this is an instant compile error — the protection we want",
    "打开下面两行：可能编过，但读的是垃圾值": "uncomment these two: it may compile, but you read garbage",
    "int 的上限附近": "just below int's upper bound",
    "edge + 1 会回绕成负数：不报错，但结果完全错": "edge + 1 wraps negative: no error, completely wrong answer",
    "超 int 范围：必须 long long 并加 LL 后缀": "beyond int: needs long long plus the LL suffix",
    "需要「正好 32 位」时写 int32_t": "use int32_t when exactly 32 bits are required",
    "靠 ASCII 连续性把字符变数字": "relies on ASCII being contiguous to get a digit",
    "浮点比较：比差值，不判相等": "float comparison: test the difference, never equality",
    "平台相关，自己查": "platform-dependent: ask sizeof",
    "编译期算得出来，也允许运行期初始化": "foldable at compile time, runtime init is legal too",
    "编译错误：常量不可改，这正是它的价值": "compile error: a constant cannot change — that is its value",
    "只有编译期常量才能当数组长度": "only a compile-time constant can size an array",
    "2.0：先整数除法，0.5 已经没了": "2.0: integer division ran first, the 0.5 is gone",
    "2.5：正确写法": "2.5: the right way",
    "2.5：0.5 让 a 自动升成 double": "2.5: 0.5 promotes a to double automatically",
    "-2：向零截断": "-2: truncated toward zero",
    "-3：先四舍五入再转": "-3: rounded first, then cast",
    "57：ASCII 码": "57: the ASCII code",
    "9：想拿数字就减去 '0'": "9: subtract '0' to get the digit",
    "遮蔽：另一个变量，默认没有任何提醒": "shadowing: a different variable, silently",
    "内层 x 在这一行销毁": "the inner x dies on this line",
    "1：外层从头到尾没被动过": "1: the outer one was never touched",
    "两个 i 互不干扰": "the two i's never collide",
    "编译错误：循环外根本没有 i 这个名字": "compile error: there is no i outside the loop",
    "会变的话就只是 const，不会变就该 constexpr": "if it changes use const; if it never changes, constexpr",
    "铁律 1：声明即初始化": "rule 1: initialise at declaration",
    "铁律 3：先确认类型再除法": "rule 3: check the types before dividing",
    "钱用整数「分」思维": "money: think in integer cents",
    "铁律 2 的反例：遮蔽": "counter-example of rule 2: shadowing"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_S12);
