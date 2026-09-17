/*
 * R0:hello agi · 编程实战扩容层（第二批：每阶段再 +2 道）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 *
 * 目的：把每阶段的实战题从 3 道（原 1 + agi-lab-extra.js 2）提升到 5 道，
 *       提高「动手写代码 / 动手推导」在整站学习量中的比重。
 *
 * 合并方式（零侵入，不改 cpp-extra-data.js / agi-lab-extra.js）：
 *   本文件在 index.html 中于 agi-lab-extra.js 之后、合并 IIFE 之前加载，
 *   直接把 L 折进 window.AGI_LAB_EXTRA，既有合并逻辑照常 concat 进 stage.labs
 *   （labs[0] 始终是原 stage.lab，旧进度键不受影响）。
 *
 * 字段与原实战一致：{ t, req:[], starter, hint, xp, mode?, t_en, req_en, hint_en }
 *   mode:"text" 表示「手算 / 描述 / 设计」型实战，不产出可运行代码。
 */
(function () {
  var L = {};
/* ---------- C++ 主线：基础语法篇 ---------- */
L["s1"] = [
 {t:"用编译错误练手",t_en:"Practice with Compile Errors",mode:"text",
  req:["故意写出 3 个经典错误：漏分号、漏头文件、main 拼错成 mian","逐个编译并抄下真实的报错原文（含行号）","对每个错误用一句话说明「编译器在抱怨什么」"],
  req_en:["Write three classic errors on purpose: a missing semicolon, a missing include, a typo in main","Compile each one and copy the real error text with its line number","Explain in one sentence what the compiler is actually complaining about"],
  starter:"#include <iostream>\nint main(){ std::cout << \"hi\" }\n// 1) 少一个分号  2) 把 main 写成 mian  3) 删掉 #include",
  hint:"报错里最关键的是「文件名:行号」与第一个 error 的关键词，链接错误则要往下看 undefined reference。",
  hint_en:"Focus on file:line and the first error keyword; for link errors look for undefined reference.",
  xp:30},
 {t:"编译参数实验：-Wall -Wextra -O2",t_en:"Compile Flag Experiments",
  req:["写一段有未使用变量与有符号无符号比较的代码","分别用不加参数、-Wall、-Wall -Wextra 编译，记录警告条数","加上 -O2 再编译，观察警告或行为是否变化"],
  req_en:["Write code with an unused variable and a signed/unsigned comparison","Compile with no flags, with -Wall and with -Wall -Wextra, and count the warnings","Add -O2 and see whether warnings or behaviour change"],
  starter:"#include <iostream>\nint main(){\n    int unused = 42;\n    unsigned u = 1;\n    std::cout << (u > -1) << std::endl;\n    return 0;\n}",
  hint:"-Wall -Wextra 能把大量潜在 bug 变成编译期警告；「u > -1」为假正是有符号转无符号的陷阱。",
  hint_en:"-Wall -Wextra surfaces latent bugs early; u > -1 being false is the signed-to-unsigned trap.",
  xp:30}
];
L["s2"] = [
 {t:"用类型转换写一个安全的输入解析器",t_en:"Safe Input Parser with Conversions",
  req:["读入一行文本，尝试解析成整数；失败时给出提示并允许重试","解析成功后再尝试转成 double，打印两种表示的差异","用一个函数返回 bool 与解析结果（引用参数或 optional）"],
  req_en:["Read a line, try to parse it as an int and offer a retry on failure","On success convert to double and print how both representations differ","Return success plus the parsed value from one function using a reference or optional"],
  starter:"#include <iostream>\n#include <string>\n#include <optional>\n\nstd::optional<long long> parse(const std::string& s){\n    try { return std::stoll(s); } catch (...) { return std::nullopt; }\n}\n\nint main(){ std::string line; std::cin >> line; auto v = parse(line); std::cout << (v ? *v : -1) << std::endl; }",
  hint:"std::stoll 遇到非法输入会抛 std::invalid_argument，用 optional 表达「可能没有值」比哨兵值更清晰。",
  hint_en:"std::stoll throws on bad input; optional expresses absence more clearly than a sentinel value.",
  xp:30},
 {t:"溢出与精度边界测试",t_en:"Overflow and Precision Boundaries",
  req:["打印 int 与 long long 的最大最小值，并观察加一的结果","累加 0.1 一百次后与 10.0 比较是否相等，说明结论","改用整数分（以分为单位）实现同样的累加，验证结果精确"],
  req_en:["Print int and long long limits and observe what adding one does","Sum 0.1 a hundred times, compare with 10.0 and explain the result","Redo the sum using integer cents and confirm it is exact"],
  starter:"#include <iostream>\n#include <limits>\nint main(){\n    std::cout << std::numeric_limits<int>::max() << std::endl;\n    double s = 0;\n    for (int i = 0; i < 100; i++) s += 0.1;\n    std::cout << (s == 10.0) << \" \" << s << std::endl;\n    long long cents = 0;\n    for (int i = 0; i < 100; i++) cents += 10;\n    std::cout << cents << std::endl;\n}",
  hint:"涉及金钱与精确计数的场景，一律用整数最小单位或定点数，别用浮点。",
  hint_en:"For money and exact counting use the smallest integer unit or fixed point, never floats.",
  xp:30}
];
L["s3"] = [
 {t:"格式化一张对齐的成绩单",t_en:"A Formatted Score Table",
  req:["用 iomanip 设置列宽、左对齐与定点小数精度","输出表头、分隔线与三行数据，列宽严格对齐","最后一列显示百分比，保留一位小数"],
  req_en:["Use iomanip to set field width, left alignment and fixed precision","Print a header, a separator and three rows with strictly aligned columns","Show a percentage column with one decimal place"],
  starter:"#include <iostream>\n#include <iomanip>\nint main(){\n    std::cout << std::left << std::setw(10) << \"姓名\" << std::setw(8) << \"分数\" << std::endl;\n    std::cout << std::fixed << std::setprecision(1) << 95.5 / 100 * 100 << \"%\" << std::endl;\n    return 0;\n}",
  hint:"setw 只对紧随其后的一个输出项生效；fixed 与 setprecision 一旦设置会持续生效。",
  hint_en:"setw applies only to the next item, while fixed and setprecision stay in effect.",
  xp:30},
 {t:"处理混合运算符的表达式求值",t_en:"Mixed-Operator Expression Evaluation",
  req:["写出 5 个含 %、/、++、?: 的表达式并先手算结果","把表达式写入程序打印，对照手算结果找出判断错误","对每个错误说明是优先级问题还是求值顺序问题"],
  req_en:["Write five expressions using %, /, ++ and ?: and predict each result by hand","Print them in a program and compare with your predictions","For each mismatch, explain whether precedence or evaluation order was the issue"],
  starter:"#include <iostream>\nint main(){\n    int a = 7, b = 2;\n    std::cout << a / b << \" \" << a % b << \" \" << a / 2.0 << std::endl;\n    int c = 1;\n    std::cout << c++ + ++c << std::endl;\n}",
  hint:"同一表达式里对同一变量既读又写属于 UB，这类题目的正确做法是拆成多条语句。",
  hint_en:"Reading and writing the same variable in one expression is UB; split it into separate statements.",
  xp:30}
];
L["s4"] = [
 {t:"打印菱形与数字金字塔",t_en:"Diamond and Number Pyramid",
  req:["用嵌套循环打印一个 n 行的数字金字塔（1、12、123…）","再打印一个 2n-1 行的菱形，上下两部分共用一段逻辑","把三个图形封装成函数，main 里只负责调用"],
  req_en:["Print an n-line number pyramid (1, 12, 123, ...) with nested loops","Print a diamond of 2n-1 lines reusing one helper for both halves","Wrap each shape in a function and keep main to plain calls"],
  starter:"#include <iostream>\n#include <string>\n\nvoid pyramid(int n){\n    for (int i = 1; i <= n; i++){\n        std::cout << std::string(n - i, ' ');\n        for (int j = 1; j <= i; j++) std::cout << j;\n        std::cout << std::endl;\n    }\n}\n\nint main(){ pyramid(5); }",
  hint:"先算空格数再算内容数，把「每行的规律」写成关于行号 i 的表达式，循环就好写了。",
  hint_en:"Compute leading spaces then content; expressing each row as a function of i makes the loops trivial.",
  xp:30},
 {t:"用循环实现一个小统计程序",t_en:"A Loop-based Statistics Program",
  req:["不断读入整数直到输入 0 结束（0 不计入）","统计个数、总和、最大值与最小值，并处理「一个都没输入」的情况","输出时立刻给出平均值，保留两位小数"],
  req_en:["Read integers until a sentinel 0 arrives (excluded from statistics)","Track count, sum, max and min and handle the empty-input case","Print the average immediately with two decimals"],
  starter:"#include <iostream>\nint main(){\n    int x, n = 0, mx = 0, mn = 0;\n    long long sum = 0;\n    while (std::cin >> x && x != 0){ /* 更新统计量 */ }\n    std::cout << n << \" \" << sum << std::endl;\n}",
  hint:"最大值最小值要先判断 n == 0 才能初始化，否则第一项就没有比较基准。",
  hint_en:"Initialise min and max only after the first value, otherwise there is nothing to compare against.",
  xp:30}
];
L["s5"] = [
 {t:"用重载写一组 print 函数",t_en:"A Family of Overloaded print Functions",
  req:["为重载 print 支持 int、double、std::string 与 vector<int>","比较重载与函数模板两种实现的代码量与易读性","尝试用只有一个类型不同的两个重载制造编译错误，说明原因"],
  req_en:["Overload print for int, double, std::string and vector<int>","Compare the code size and readability with a template implementation","Create a compile error with two overloads differing only in return type and explain it"],
  starter:"#include <iostream>\n#include <string>\n#include <vector>\nvoid print(int v){ std::cout << v << std::endl; }\nvoid print(double v){ std::cout << v << std::endl; }\nvoid print(const std::string& s){ std::cout << s << std::endl; }\nvoid print(const std::vector<int>& v){ for (int x : v) std::cout << x << ' '; std::cout << std::endl; }\nint main(){ print(1); print(2.5); print(\"hi\"); print(std::vector<int>{1,2}); }",
  hint:"重载决议只看参数列表（含常量性），返回类型不参与；模板则能一次覆盖所有类型。",
  hint_en:"Overload resolution uses parameter lists only; a template covers all types at once.",
  xp:30},
 {t:"递归、迭代与尾调用的对比",t_en:"Recursion vs Iteration",
  req:["用递归与迭代分别实现求和与阶乘","对 n=25 各跑一次（注意递归深度与溢出）","改用 long long 或大数思路，说明溢出发生的临界点"],
  req_en:["Implement sum and factorial both recursively and iteratively","Run both for n = 25 and watch recursion depth and overflow","Switch to long long and identify where overflow starts"],
  starter:"#include <iostream>\nlong long fact_iter(int n){ long long r = 1; for (int i = 2; i <= n; i++) r *= i; return r; }\nlong long fact_rec(int n){ return n <= 1 ? 1 : n * fact_rec(n - 1); }\nint main(){ std::cout << fact_iter(10) << \" \" << fact_rec(10) << std::endl; }",
  hint:"20! 已经超出 long long 的范围，这是练习「先判断边界再动手」的好例子。",
  hint_en:"20! already exceeds long long, a good prompt to check boundaries before coding.",
  xp:30}
];
L["s6"] = [
 {t:"用 std::array 与 std::string 重做成绩管理",t_en:"Score Management with array and string",
  req:["用 std::array<std::string,5> 存 5 个名字，用另一个数组存分数","写函数求平均分、最高分对应的名字","用 range-for 替代所有下标循环，比较代码可读性"],
  req_en:["Store five names in std::array<std::string,5> and their scores in another","Write functions for the average and for the top scorer's name","Replace every index loop with range-for and compare readability"],
  starter:"#include <array>\n#include <iostream>\n#include <string>\nint main(){\n    std::array<std::string, 3> names{\"A\", \"B\", \"C\"};\n    std::array<int, 3> scores{80, 95, 70};\n    for (std::size_t i = 0; i < names.size(); i++) std::cout << names[i] << scores[i] << std::endl;\n}",
  hint:"std::array 知道自己的长度且支持 size()，比裸数组更安全，也不会退化成指针。",
  hint_en:"std::array knows its length and never decays to a pointer, unlike a raw array.",
  xp:30},
 {t:"手写一个字符串分词器",t_en:"A Hand-written Tokenizer",
  req:["把一行文本按空白切分成 vector<std::string>（不使用 stringstream）","再用 istringstream 实现同一功能，比较两种写法","统计分词结果并打印最长的一个词"],
  req_en:["Split a line into vector<std::string> by whitespace without stringstream","Do it again with istringstream and compare the two","Count the tokens and print the longest one"],
  starter:"#include <iostream>\n#include <sstream>\n#include <string>\n#include <vector>\nint main(){\n    std::string line = \"to be or not to be\";\n    std::istringstream in(line);\n    std::vector<std::string> tokens;\n    std::string w;\n    while (in >> w) tokens.push_back(w);\n    std::cout << tokens.size() << std::endl;\n}",
  hint:">> 运算符默认按空白切分，这比手写状态机简洁得多，但要处理标点时仍得自己扫描。",
  hint_en:">> splits on whitespace by default, far simpler than a state machine, but punctuation needs manual work.",
  xp:30}
];
L["s7"] = [
 {t:"指针与引用传参对照实验",t_en:"Pointers vs References in Parameters",
  req:["写三版交换函数：值传递、指针传递、引用传递","各调用一次并打印结果，说明为什么只有后两版生效","再写一个「交换两个 vector」的版本，比较拷贝成本"],
  req_en:["Write swap three ways: by value, by pointer and by reference","Call each once, print the results and explain why only two work","Add a version swapping two vectors and compare the copy cost"],
  starter:"#include <iostream>\n#include <vector>\nvoid byVal(int a, int b){ int t = a; a = b; b = t; }\nvoid byPtr(int* a, int* b){ int t = *a; *a = *b; *b = t; }\nvoid byRef(int& a, int& b){ int t = a; a = b; b = t; }\nint main(){ int x = 1, y = 2; byVal(x, y); std::cout << x << y; byRef(x, y); std::cout << x << y; }",
  hint:"值传递改的是副本；引用与指针都能改到原对象，引用写起来更安全、指针更明确「可能为空」。",
  hint_en:"By value edits a copy; references and pointers both reach the original, references being safer.",
  xp:30},
 {t:"用 new/delete 与智能指针各写一遍动态数组",t_en:"Dynamic Arrays: Raw vs Smart Pointers",
  req:["用 new[] 申请 10 个 int，填充后求和使用 delete[] 释放","改用 std::unique_ptr<int[]> 与管理同样逻辑，比较代码行数","故意漏掉 delete，说明用什么工具能检测出泄漏"],
  req_en:["Allocate ten ints with new[], fill and sum them, then delete[]","Rewrite with std::unique_ptr<int[]> and compare line counts","Deliberately skip delete and name a tool that would detect the leak"],
  starter:"#include <iostream>\n#include <memory>\nint main(){\n    int* raw = new int[10];\n    for (int i = 0; i < 10; i++) raw[i] = i;\n    int s = 0;\n    for (int i = 0; i < 10; i++) s += raw[i];\n    delete[] raw;\n    auto up = std::make_unique<int[]>(10);\n    std::cout << s << std::endl;\n}",
  hint:"智能指针把释放动作绑在对象生命周期上，异常路径也不会漏掉释放。",
  hint_en:"Smart pointers tie release to the object lifetime, covering exception paths too.",
  xp:30}
];
L["s8"] = [
 {t:"用结构体 + 枚举做一个任务清单",t_en:"A Task List with struct and enum",
  req:["定义 Priority 枚举（低/中/高）与 Task 结构体（标题、优先级、是否完成）","用 vector<Task> 存 5 条任务并打印带优先级标签的清单","用 sort 按优先级降序、同优先级按标题排序"],
  req_en:["Define a Priority enum and a Task struct with title, priority and done","Store five tasks in a vector and print a list with priority labels","Sort by priority descending, then by title"],
  starter:"#include <algorithm>\n#include <iostream>\n#include <string>\n#include <vector>\nenum class Pri { Low, Mid, High };\nstruct Task { std::string title; Pri pri; bool done; };\nint main(){\n    std::vector<Task> v{{\"写作业\", Pri::High, false}, {\"跑步\", Pri::Low, true}};\n    std::sort(v.begin(), v.end(), [](const Task& a, const Task& b){ return a.pri > b.pri; });\n    for (const auto& t : v) std::cout << t.title << std::endl;\n}",
  hint:"enum class 有作用域、不隐式转 int，比传统 enum 更安全，比较时也要显式写 Pri::High。",
  hint_en:"enum class is scoped and does not convert implicitly, safer than a plain enum.",
  xp:30},
 {t:"用 struct 布局观察内存对齐",t_en:"Observing Struct Layout and Padding",
  req:["写三个成员顺序不同但内容相同的结构体，打印各自的 sizeof","用 offsetof 打印每个成员的偏移，画出内存布局","调整成员顺序让结构体变小，并解释对齐规则"],
  req_en:["Write three structs with the same members in different orders and print their sizeof","Use offsetof to print each member's offset and sketch the layout","Reorder members to shrink the struct and explain the alignment rule"],
  starter:"#include <cstddef>\n#include <iostream>\nstruct A { char c; int i; char d; };\nint main(){\n    std::cout << sizeof(A) << std::endl;\n    std::cout << offsetof(A, c) << \" \" << offsetof(A, i) << \" \" << offsetof(A, d) << std::endl;\n}",
  hint:"把大的成员放前面通常能减少填充；对齐让访问更快，代价是浪费一点空间。",
  hint_en:"Putting larger members first usually reduces padding; alignment trades space for speed.",
  xp:30}
];
L["s9"] = [
 {t:"写一个带不变式校验的账户类",t_en:"An Account Class with Invariants",
  req:["成员私有，提供 deposit / withdraw / balance 三个接口","withdraw 超额时抛异常，保证余额永不为负","写一个 checkInvariant() 私有方法在所有改动后调用"],
  req_en:["Keep members private and expose deposit, withdraw and balance","Throw when withdrawing more than the balance so it can never go negative","Add a private checkInvariant() called after every mutation"],
  starter:"#include <iostream>\n#include <stdexcept>\nclass Account {\n    long long balance_ = 0;\n    void check() const { if (balance_ < 0) throw std::logic_error(\"negative\"); }\npublic:\n    void deposit(long long v){ if (v <= 0) throw std::invalid_argument(\"bad amount\"); balance_ += v; check(); }\n    long long balance() const { return balance_; }\n};\nint main(){ Account a; a.deposit(100); std::cout << a.balance(); }",
  hint:"把「余额不能为负」写成显式校验函数，任何改动后都调用一次，不变式就守得住。",
  hint_en:"Encoding the invariant as an explicit check called after every change keeps it honest.",
  xp:30},
 {t:"用移动语义优化的字符串缓冲类",t_en:"A Buffer Class Optimised with Move Semantics",
  req:["写一个持有 char* 缓冲的类，实现构造、析构、拷贝构造与移动构造","在每个特殊成员函数里打印日志，观察各被调用几次","把类放进 vector 并多次 push_back，统计拷贝与移动的次数"],
  req_en:["Write a class owning a char* buffer with constructor, destructor, copy and move","Log inside each special member and count how often each runs","Push several instances into a vector and count copies versus moves"],
  starter:"#include <cstring>\n#include <iostream>\nclass Buf {\n    char* p_ = nullptr; std::size_t n_ = 0;\npublic:\n    explicit Buf(std::size_t n) : p_(new char[n]), n_(n) {}\n    Buf(const Buf& o) : p_(new char[o.n_]), n_(o.n_) { std::memcpy(p_, o.p_, n_); std::cout << \"copy\\n\"; }\n    Buf(Buf&& o) noexcept : p_(o.p_), n_(o.n_) { o.p_ = nullptr; o.n_ = 0; std::cout << \"move\\n\"; }\n    ~Buf(){ delete[] p_; }\n};\nint main(){ Buf a(4); Buf b = std::move(a); }",
  hint:"移动构造要标记 noexcept，否则 vector 扩容时出于异常安全考虑会退而选择拷贝。",
  hint_en:"Mark the move constructor noexcept or vector falls back to copying for exception safety.",
  xp:30}
];
L["s10"] = [
 {t:"用抽象基类重构 if-else 分支",t_en:"Refactoring if-else Chains into Polymorphism",
  req:["写一段用字符串比较决定行为的 if-else 链（3 个分支）","改写成抽象基类 + 三个派生类，用工厂函数按名字创建对象","统计重构前后新增一个分支需要改动几处代码"],
  req_en:["Write an if-else chain keyed on strings with three branches","Refactor to an abstract base plus three derived classes created by a factory","Count how many places need changes to add a branch before and after"],
  starter:"#include <iostream>\n#include <memory>\n#include <string>\nstruct Op { virtual ~Op() = default; virtual int run(int a, int b) const = 0; };\nstruct Add : Op { int run(int a, int b) const override { return a + b; } };\nstd::unique_ptr<Op> make(const std::string& n){ if (n == \"add\") return std::make_unique<Add>(); return nullptr; }\nint main(){ auto o = make(\"add\"); if (o) std::cout << o->run(1, 2); }",
  hint:"多态的价值就是把「分支散落各处」变成「新增一个类」，符合开闭原则。",
  hint_en:"Polymorphism turns scattered branching into adding one class, following the open-closed principle.",
  xp:30},
 {t:"用虚函数表验证动态绑定",t_en:"Verifying Dynamic Binding",
  req:["写基类虚函数与派生类重写，用基类指针分别指向两种对象调用","把基类函数改成非虚，再跑一次，对比输出","在构造函数里调用虚函数，解释为什么得到的是基类版本"],
  req_en:["Write a base virtual function and a derived override, then call through a base pointer","Make the base function non-virtual, run again and compare the output","Call a virtual function from a constructor and explain why the base version runs"],
  starter:"#include <iostream>\nstruct B { virtual void f() const { std::cout << \"B\\n\"; } };\nstruct D : B { void f() const override { std::cout << \"D\\n\"; } };\nint main(){ B b; D d; B* p = &d; p->f(); B& r = d; r.f(); }",
  hint:"构造期间派生部分还没建立，虚表仍指向基类版本，所以构造函数里调虚函数不会多态。",
  hint_en:"During construction the derived part does not exist yet, so the vtable still points at the base version.",
  xp:30}
];
L["s11"] = [
 {t:"写一个泛型 maxOf 并加约束",t_en:"A Generic maxOf with Constraints",
  req:["写函数模板 maxOf(a, b)，支持任意可比较类型","用 std::string 与自定义结构体重载 operator< 各调用一次","用 C++20 的 concept 限定模板参数必须支持小于比较"],
  req_en:["Write a function template maxOf(a, b) for any comparable type","Call it with std::string and with a custom struct overloading operator<","Constrain the template parameter with a C++20 concept requiring less-than"],
  starter:"#include <iostream>\n#include <string>\ntemplate <typename T>\nconst T& maxOf(const T& a, const T& b){ return (a < b) ? b : a; }\nint main(){ std::cout << maxOf(3, 5) << maxOf(std::string(\"a\"), std::string(\"b\")); }",
  hint:"模板里用 < 就能工作，报错信息难读时可加 concept 让约束在签名处直接体现。",
  hint_en:"Using < inside the template works, but a concept moves the constraint into the signature.",
  xp:30},
 {t:"类模板特化：一个通用的打印器",t_en:"Class Template Specialisation",
  req:["写 Printer<T> 模板，默认打印「值: xxx」","为 bool 做全特化，打印「是 / 否」而不是 1 / 0","为指针类型做偏特化，打印地址与解引用值"],
  req_en:["Write a Printer<T> template printing value: xxx by default","Fully specialise it for bool to print yes/no instead of 1/0","Partially specialise for pointers printing both address and pointee"],
  starter:"#include <iostream>\ntemplate <typename T> struct Printer { static void show(const T& v){ std::cout << \"value: \" << v << std::endl; } };\ntemplate <> struct Printer<bool> { static void show(bool v){ std::cout << (v ? \"yes\" : \"no\") << std::endl; } };\nint main(){ Printer<int>::show(1); Printer<bool>::show(true); }",
  hint:"全特化针对具体类型，偏特化针对一族类型（如指针、容器）；两者都是编译期选择。",
  hint_en:"Full specialisation targets one type, partial targets a family; both resolve at compile time.",
  xp:30}
];
L["s12"] = [
 {t:"对比几种顺序容器的插入成本",t_en:"Insertion Cost Across Sequence Containers",
  req:["对 vector / deque / list 各在头部插入 50000 个元素并计时","再对三者各做一次随机访问 50000 次并计时","根据两组数据说明「该用哪个容器」的判断依据"],
  req_en:["Time head insertion of 50000 elements into vector, deque and list","Time 50000 random accesses on each","Use both results to state when each container should be chosen"],
  starter:"#include <chrono>\n#include <deque>\n#include <iostream>\n#include <list>\n#include <vector>\ntemplate <typename C> long long headInsert(int n){\n    C c; auto t = std::chrono::steady_clock::now();\n    for (int i = 0; i < n; i++) c.insert(c.begin(), i);\n    return std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - t).count();\n}\nint main(){ std::cout << headInsert<std::vector<int>>(50000) << \" \" << headInsert<std::list<int>>(50000) << std::endl; }",
  hint:"vector 头部插入要整体搬移，复杂度 O(n)；list 改指针即 O(1)，但随机访问是 O(n)。",
  hint_en:"Head insertion into vector is O(n) due to shifting; list is O(1) but random access is O(n).",
  xp:30},
 {t:"vector 扩容策略观察实验",t_en:"Observing vector Capacity Growth",
  req:["不断 push_back，记录每次 capacity 变化的值","预测下一次扩容的时机并验证（观察是否为 2 倍增长）","用 reserve 预先分配后重跑一次，比较扩容次数"],
  req_en:["Push back repeatedly and record every capacity change","Predict when the next growth happens and verify the factor","Preallocate with reserve, rerun and compare the number of reallocations"],
  starter:"#include <iostream>\n#include <vector>\nint main(){\n    std::vector<int> v;\n    std::size_t last = 0;\n    for (int i = 0; i < 40; i++){\n        v.push_back(i);\n        if (v.capacity() != last){ std::cout << i << \" -> \" << v.capacity() << std::endl; last = v.capacity(); }\n    }\n}",
  hint:"提前 reserve 到大致需要的容量，能一次性避免多次重新分配与元素搬迁。",
  hint_en:"Reserving the expected size up front avoids repeated reallocation and element moves.",
  xp:30}
];
L["s13"] = [
 {t:"用 map/set 完成去重与计数的组合任务",t_en:"Dedup and Count with map and set",
  req:["给一组含重复的字符串，用 set 去重后打印个数","用 map 统计每个字符串出现次数并按次数降序输出","用 unordered_map 重做计数，比较十万条数据下的耗时"],
  req_en:["Deduplicate a list of strings with a set and print the count","Count occurrences with a map and print them by count descending","Repeat the counting with unordered_map and compare timings on 100k items"],
  starter:"#include <algorithm>\n#include <iostream>\n#include <map>\n#include <set>\n#include <string>\n#include <vector>\nint main(){\n    std::vector<std::string> v{\"a\", \"b\", \"a\", \"c\", \"b\", \"a\"};\n    std::set<std::string> uniq(v.begin(), v.end());\n    std::map<std::string, int> cnt;\n    for (const auto& s : v) cnt[s]++;\n    std::cout << uniq.size() << \" \" << cnt[\"a\"] << std::endl;\n}",
  hint:"map 有序但插入慢一些，unordered_map 平均 O(1) 但无序；按需选择。",
  hint_en:"map keeps order at some insertion cost; unordered_map is average O(1) but unordered.",
  xp:30},
 {t:"统计单词首字母分布",t_en:"Distribution of Initial Letters",
  req:["读入一段英文文本，统计以每个字母开头的单词数","用 map<char,int> 计数，只统计字母、忽略大小写","按字母顺序打印分布，并找出出现最多的首字母"],
  req_en:["Read an English text and count words by their first letter","Count in a map<char,int>, considering letters only and ignoring case","Print the distribution in alphabetical order and the most common initial"],
  starter:"#include <cctype>\n#include <iostream>\n#include <map>\n#include <sstream>\n#include <string>\nint main(){\n    std::istringstream in(\"To be or not to be that is the question\");\n    std::map<char, int> d;\n    std::string w;\n    while (in >> w) d[std::tolower(w[0])]++;\n    for (auto [c, n] : d) std::cout << c << \" \" << n << std::endl;\n}",
  hint:"std::tolower 要包含 <cctype> 并转成 unsigned char，避免负值传入造成 UB。",
  hint_en:"Include <cctype> and cast to unsigned char before tolower to avoid UB on negative values.",
  xp:30}
];
L["s14"] = [
 {t:"用算法库重写三个手写循环",t_en:"Replacing Three Hand-written Loops",
  req:["把「求最大值」「统计满足条件的个数」「找出第一个符合条件的元素」改用算法","分别用 max_element、count_if、find_if 实现","对同一份数据比较手写循环与算法版本的可读性"],
  req_en:["Replace max, count-if and find-first loops with algorithms","Implement them with max_element, count_if and find_if","Compare readability of hand-written loops versus algorithm calls"],
  starter:"#include <algorithm>\n#include <iostream>\n#include <vector>\nint main(){\n    std::vector<int> v{3, 7, 1, 9, 4};\n    auto mx = std::max_element(v.begin(), v.end());\n    int odd = static_cast<int>(std::count_if(v.begin(), v.end(), [](int x){ return x % 2; }));\n    auto first = std::find_if(v.begin(), v.end(), [](int x){ return x > 5; });\n    std::cout << *mx << \" \" << odd << \" \" << (first != v.end() ? *first : -1) << std::endl;\n}",
  hint:"find_if 返回迭代器，必须与 end() 比较后再解引用，否则越界。",
  hint_en:"find_if returns an iterator; compare with end() before dereferencing.",
  xp:30},
 {t:"用 lambda + 算法做数据筛选管道",t_en:"A Filter Pipeline with Lambdas",
  req:["对一组学生数据依次做过滤、变换、排序、取前 3","统计每一步之后剩余的元素个数并打印","把其中一步改成用 vector 的成员函数实现，比较写法"],
  req_en:["Filter, transform, sort and take the top 3 of a student dataset","Print the remaining element count after each step","Reimplement one step with a vector member function and compare"],
  starter:"#include <algorithm>\n#include <iostream>\n#include <string>\n#include <vector>\nstruct S { std::string n; int p; };\nint main(){\n    std::vector<S> v{{\"a\", 60}, {\"b\", 90}, {\"c\", 75}, {\"d\", 40}};\n    std::vector<S> pass;\n    std::copy_if(v.begin(), v.end(), std::back_inserter(pass), [](const S& s){ return s.p >= 60; });\n    std::sort(pass.begin(), pass.end(), [](const S& a, const S& b){ return a.p > b.p; });\n    for (const auto& s : pass) std::cout << s.n << std::endl;\n}",
  hint:"copy_if 写入需要 back_inserter，直接传 pass.begin() 会越界写入。",
  hint_en:"copy_if needs back_inserter, otherwise it writes past the end of an empty vector.",
  xp:30}
];
L["s15"] = [
 {t:"用文件流做一个迷你记账程序",t_en:"A Mini Ledger with File Streams",
  req:["把若干条「日期 金额」记录写入文件，再读回来解析成结构体","计算总额并按日期排序输出","处理文件不存在、格式错误两种异常情况"],
  req_en:["Write date-amount records to a file and read them back into structs","Compute the total and print sorted by date","Handle a missing file and malformed records gracefully"],
  starter:"#include <fstream>\n#include <iostream>\n#include <sstream>\n#include <string>\n#include <vector>\nint main(){\n    std::ofstream out(\"ledger.txt\");\n    out << \"2026-01-01 12.5\\n2026-01-02 -3\\n\";\n    out.close();\n    std::ifstream in(\"ledger.txt\");\n    if (!in){ std::cerr << \"无法打开文件\\n\"; return 1; }\n    std::string line;\n    while (std::getline(in, line)) std::cout << line << std::endl;\n}",
  hint:"写入后要 close 或让流离开作用域，确保缓冲区落盘再读取。",
  hint_en:"Close the stream or let it go out of scope before reading, so buffered data is flushed.",
  xp:30},
 {t:"统计一个大文件的行数与词数",t_en:"Counting Lines and Words in a Large File",
  req:["逐行读取一个较大的文本文件，统计行数与单词数","不要一次把整个文件读进内存（用 getline 流式处理）","记录并打印处理耗时，改一次缓冲区大小再比较"],
  req_en:["Stream a large text file line by line, counting lines and words","Avoid loading the whole file into memory by using getline","Measure the elapsed time and compare after changing the buffer size"],
  starter:"#include <chrono>\n#include <fstream>\n#include <iostream>\n#include <sstream>\n#include <string>\nint main(){\n    std::ifstream in(\"big.txt\");\n    if (!in) { std::cout << \"no file\\n\"; return 0; }\n    long long lines = 0, words = 0;\n    std::string line, w;\n    while (std::getline(in, line)){ lines++; std::istringstream ss(line); while (ss >> w) words++; }\n    std::cout << lines << \" \" << words << std::endl;\n}",
  hint:"流式处理的内存占用与文件大小无关，这是处理超大文件的标准做法。",
  hint_en:"Streaming keeps memory independent of file size, the standard approach for huge files.",
  xp:30}
];
L["s16"] = [
 {t:"设计一套异常安全的分层结构",t_en:"A Layered Exception-safe Design",
  req:["定义三层：输入解析层、业务逻辑层、输出层，各自可能抛出不同异常","在业务层捕获解析异常并转换成语义更明确的业务异常","在 main 统一捕获并给出面向用户的提示，不泄露实现细节"],
  req_en:["Define three layers: parsing, business logic and output, each throwing different exceptions","Catch parsing exceptions in the business layer and translate them to domain errors","Catch centrally in main and show a user-facing message without leaking internals"],
  starter:"#include <iostream>\n#include <stdexcept>\nstruct ParseErr : std::runtime_error { using std::runtime_error::runtime_error; };\nstruct DomainErr : std::runtime_error { using std::runtime_error::runtime_error; };\nint main(){\n    try { throw ParseErr(\"bad token\"); }\n    catch (const ParseErr&) { throw DomainErr(\"输入格式不正确\"); }\n}",
  hint:"分层转换异常能让上层不必知道底层细节，但转换时最好用嵌套异常保留原始信息。",
  hint_en:"Translating exceptions insulates upper layers, but keep the original via nested exceptions.",
  xp:30},
 {t:"用 RAII 写一个异常安全的锁守卫",t_en:"An Exception-safe Lock Guard",
  req:["写一个 ScopeGuard 类，构造时执行动作、析构时执行补偿动作","在其中抛出异常，验证补偿动作依然执行","与标准库的 lock_guard 对比，说明它们共同的思路"],
  req_en:["Write a ScopeGuard executing an action on construction and a compensating one on destruction","Throw inside its scope and verify the compensating action still runs","Compare with std::lock_guard and state the shared principle"],
  starter:"#include <functional>\n#include <iostream>\nclass Guard {\n    std::function<void()> onExit_;\npublic:\n    explicit Guard(std::function<void()> f) : onExit_(std::move(f)) { std::cout << \"enter\\n\"; }\n    ~Guard(){ onExit_(); }\n};\nint main(){\n    Guard g([]{ std::cout << \"revoked\\n\"; });\n}",
  hint:"把「清理」写进析构函数，异常、提前 return、正常结束三种路径就都覆盖了。",
  hint_en:"Putting cleanup in the destructor covers exceptions, early returns and normal exit alike.",
  xp:30}
];
L["s17"] = [
 {t:"用智能指针改造一段旧代码",t_en:"Modernising Legacy Code with Smart Pointers",
  req:["把一段用裸 new/delete 管理对象树（父子指针）的代码改成智能指针","父指向子用 unique_ptr，子回指父用裸指针或 weak_ptr，说明理由","用 ASan 或 valgrind 验证改造后没有泄漏与重复释放"],
  req_en:["Convert a raw new/delete object tree into smart pointers","Use unique_ptr for parent-to-child and a raw or weak pointer back to the parent, explaining why","Verify with ASan or valgrind that there are no leaks or double frees"],
  starter:"#include <iostream>\n#include <memory>\n#include <vector>\nstruct Node {\n    int v = 0;\n    std::vector<std::unique_ptr<Node>> kids;\n    Node* parent = nullptr;\n};\nint main(){\n    auto root = std::make_unique<Node>();\n    auto c = std::make_unique<Node>();\n    c->parent = root.get();\n    root->kids.push_back(std::move(c));\n    std::cout << root->kids.size() << std::endl;\n}",
  hint:"所有权是唯一的（unique_ptr 向下），反向引用只是观察（裸指针或 weak_ptr），这样既无环也不会双重释放。",
  hint_en:"Ownership flows down via unique_ptr while back references merely observe, avoiding cycles and double frees.",
  xp:30},
 {t:"用 auto、范围 for、结构化绑定重写一段老代码",t_en:"Modernising with auto, Range-for and Structured Bindings",
  req:["找一段含显式迭代器与类型名的旧式循环，逐项改为现代写法","把 map 的遍历改成结构化绑定，把迭代器循环改成范围 for","记录改动前后行数，并说明哪些改动是可读性、哪些是性能"],
  req_en:["Take an old-style loop with explicit iterators and type names and modernise it step by step","Use structured bindings for map iteration and range-for for container loops","Record the line-count change and classify each edit as readability or performance"],
  starter:"#include <iostream>\n#include <map>\n#include <string>\nint main(){\n    std::map<std::string, int> m{{\"a\", 1}, {\"b\", 2}};\n    for (std::map<std::string, int>::const_iterator it = m.begin(); it != m.end(); ++it)\n        std::cout << it->first << it->second << std::endl;\n    for (const auto& [k, v] : m) std::cout << k << v << std::endl;\n}",
  hint:"范围 for 里的 auto& 要写 const 引用避免拷贝；结构化绑定按声明顺序对应成员。",
  hint_en:"Use const references in range-for to avoid copies; structured bindings follow member order.",
  xp:30}
];
L["s18"] = [
 {t:"把命令行计算器拆成多个文件",t_en:"Splitting a CLI Calculator into Files",
  req:["拆成 main.cpp、parser.cpp、eval.cpp 与对应头文件","用 CMake 或直接 g++ 多文件编译，保证能一次构建成功","给每个模块加一条简单的 assert 自测"],
  req_en:["Split into main.cpp, parser.cpp, eval.cpp plus headers","Build all files at once with CMake or a single g++ invocation","Add a simple assert-based self test per module"],
  starter:"// parser.h\ndouble parse(const std::string& expr);\n\n// eval.h\ndouble eval(const std::string& expr);\n\n// main.cpp  读取表达式 -> parse -> eval -> 输出",
  hint:"头文件只放声明并用 include guard；实现放 .cpp，避免重复定义链接错误。",
  hint_en:"Headers hold declarations with include guards; implementations live in .cpp to avoid duplicate symbols.",
  xp:30},
 {t:"为项目写一份可复现的构建说明",t_en:"A Reproducible Build Guide",
  req:["写一份 README 片段，包含依赖、构建、运行、测试四部分","给出精确命令与预期输出，让另一个人照着就能跑通","列出两个常见构建错误的排查方法"],
  req_en:["Write a README section covering dependencies, build, run and test","Give exact commands plus expected output so someone else can reproduce it","List troubleshooting for two common build errors"],
  starter:"# 构建\n#   cmake -S . -B build && cmake --build build\n# 运行\n#   ./build/app\n# 常见问题\n#   1) 找不到头文件 -> 检查 include 路径\n#   2) undefined reference -> 检查是否漏加源文件",
  hint:"「可复现」的检验标准是：换一台干净机器，照文档做能一次性成功。",
  hint_en:"Reproducible means a clean machine following the document succeeds on the first try.",
  xp:30}
];
L["sdbg"] = [
 {t:"把崩溃日志翻译成修复方案",t_en:"Turning a Crash Log into a Fix",mode:"text",
  req:["给出一段含空指针解引用与越界的崩溃日志（可自己构造）","按「触发位置—直接原因—根因—修复方案」四段写出分析","修复后用同样的输入复现一次，确认不再崩溃"],
  req_en:["Take a crash log containing a null dereference and an out-of-bounds access (construct one if needed)","Write the analysis as trigger location, direct cause, root cause and fix","Rerun with the same input to confirm the crash is gone"],
  starter:"// 示例崩溃现场\nint* p = find(arr, n, target);   // 可能返回 nullptr\n*p = 42;                          // 段错误\n\n// 分析：1) 触发位置  2) 直接原因  3) 根因  4) 修复方案",
  hint:"段错误几乎总能归结为「用了不该用的地址」，先确认指针来源，再看是否越界。",
  hint_en:"Segfaults almost always mean using an invalid address; check where the pointer came from, then bounds.",
  xp:35},
 {t:"为一段可疑代码写最小复现",t_en:"Building a Minimal Reproducer",mode:"text",
  req:["拿一段 50 行以上、行为异常的程序，删到只剩能复现问题的最少代码","记录每一步删掉了什么、问题是否仍然存在","用二分注释法把可疑范围缩小到 10 行以内"],
  req_en:["Take a 50-line misbehaving program and cut it down to the minimum that still reproduces","Record what each deletion removed and whether the bug persisted","Use binary commenting to narrow the suspect range to under ten lines"],
  starter:"// 步骤：1) 备份原文件  2) 注释掉后半段看是否复现  3) 逐步缩小\n// 记录表：\n// 删除内容 | 是否仍复现 | 结论",
  hint:"最小复现本身就是最有价值的调试产物，它常常让根因自己浮出来。",
  hint_en:"The minimal reproducer is itself the most valuable debugging artifact and often reveals the cause.",
  xp:35}
];
L["sbw"] = [
 {t:"用位运算实现的权限开关",t_en:"Permission Flags with Bit Operations",
  req:["用 1<<0..3 表示读、写、执行、删除四个权限位","实现 grant/revoke/has 三个操作，并支持「只改这一位」","打印权限组合的数字值与二进制字符串"],
  req_en:["Represent read, write, execute and delete as bits 1<<0..3","Implement grant, revoke and has, each changing only its own bit","Print each permission set as both a number and a binary string"],
  starter:"#include <bitset>\n#include <iostream>\nconst int R = 1 << 0, W = 1 << 1;\nint main(){\n    int perm = 0;\n    perm |= R | W;\n    perm &= ~W;\n    std::cout << std::bitset<4>(perm) << \" \" << (bool)(perm & R) << std::endl;\n}",
  hint:"授权用 |=，撤销用 &= ~(mask)，判断用 (perm & mask) != 0，三个惯用法记住就够用。",
  hint_en:"Grant with |=, revoke with &= ~(mask) and test with (perm & mask) != 0.",
  xp:35},
 {t:"位运算经典题：找出落单的数",t_en:"Finding the Lone Number",
  req:["用异或实现「只有一个数出现一次、其余成对」的求解","构造三组测试数据验证结果，包括单个元素、负数","再用哈希表实现一遍，比较时间复杂度与空间复杂度"],
  req_en:["Solve the single-number problem with XOR","Verify on three datasets including a single element and negatives","Solve it again with a hash map and compare time and space complexity"],
  starter:"#include <iostream>\n#include <vector>\nint lone(const std::vector<int>& v){ int x = 0; for (int n : v) x ^= n; return x; }\nint main(){ std::cout << lone({4, 1, 2, 1, 2}) << std::endl; }",
  hint:"异或满足交换律与结合律，成对的数互相抵消为 0，剩下的一定是落单的那个。",
  hint_en:"XOR is commutative and associative, so pairs cancel to zero leaving the lone value.",
  xp:35}
];
L["srec"] = [
 {t:"用递归画汉诺塔并统计步数",t_en:"Hanoi: Recursion and Step Counting",
  req:["实现 hanoi(n, from, to, via)，打印每一步的移动","统计 n=3、5、10 的移动次数并与公式 2^n-1 对照","把打印改成计数，验证 n=25 时程序不会爆栈"],
  req_en:["Implement hanoi(n, from, to, via) printing each move","Count the moves for n = 3, 5, 10 and compare with 2^n - 1","Replace printing with counting and confirm n = 25 does not blow the stack"],
  starter:"#include <iostream>\nlong long steps = 0;\nvoid hanoi(int n, char a, char c, char b){\n    if (n == 0) return;\n    hanoi(n - 1, a, b, c);\n    steps++;\n    hanoi(n - 1, b, c, a);\n}\nint main(){ hanoi(10, 'A', 'C', 'B'); std::cout << steps << std::endl; }",
  hint:"汉诺塔的步数是 2^n-1，n 稍大就会变得很大，用 long long 才装得下。",
  hint_en:"Hanoi needs 2^n - 1 moves, so use long long for even modest n.",
  xp:35},
 {t:"用回溯生成全排列",t_en:"Generating Permutations with Backtracking",
  req:["用回溯生成 1..n 的全部排列并打印总数（验证为 n!）","在递归中显式做「选择」与「撤销选择」两步","加一个剪枝条件（如首元素不能是偶数），统计剪枝后数量"],
  req_en:["Generate all permutations of 1..n with backtracking and verify the count equals n!","Make the choose and undo steps explicit in the recursion","Add a pruning rule (say the first element cannot be even) and count the remainder"],
  starter:"#include <iostream>\n#include <vector>\nint n = 3;\nstd::vector<int> cur;\nstd::vector<bool> used;\nlong long total = 0;\nvoid dfs(){\n    if ((int)cur.size() == n){ total++; return; }\n    for (int i = 1; i <= n; i++){\n        if (used[i]) continue;\n        used[i] = true; cur.push_back(i);\n        dfs();\n        cur.pop_back(); used[i] = false;\n    }\n}\nint main(){ used.assign(n + 1, false); dfs(); std::cout << total << std::endl; }",
  hint:"回溯的骨架就是「标记—递归—还原」，漏掉还原会让后续分支带着脏状态运行。",
  hint_en:"Backtracking is mark, recurse, unmark; missing the unmark corrupts later branches.",
  xp:35}
];
L["sdp"] = [
 {t:"爬楼梯的三种实现对比",t_en:"Climbing Stairs Three Ways",
  req:["用朴素递归、记忆化递归、自底向上迭代三种方式求解","对 n=35 各跑一次并计时，比较差异","把空间优化到 O(1)，说明状态压缩的思路"],
  req_en:["Solve climbing stairs with plain recursion, memoised recursion and bottom-up iteration","Run all three for n = 35 and compare timings","Reduce the space to O(1) and explain the state compression"],
  starter:"#include <iostream>\n#include <vector>\nlong long memo_dfs(int n, std::vector<long long>& m){\n    if (n <= 2) return n;\n    if (m[n]) return m[n];\n    return m[n] = memo_dfs(n - 1, m) + memo_dfs(n - 2, m);\n}\nint main(){ std::vector<long long> m(40, 0); std::cout << memo_dfs(35, m) << std::endl; }",
  hint:"朴素递归是 O(2^n)，记忆化后降到 O(n)；只依赖前两个状态时可以把数组压缩成两个变量。",
  hint_en:"Plain recursion is O(2^n), memoising gives O(n), and depending only on two states allows O(1) space.",
  xp:40},
 {t:"最长递增子序列练手",t_en:"Longest Increasing Subsequence",
  req:["用 O(n²) 的动态规划求出长度，并打印实际选中的子序列","构造含重复元素、全降序、全升序三类测试数据","说明为什么「贪心取最小结尾」配合二分能做到 O(n log n)"],
  req_en:["Compute the length with O(n^2) DP and print the chosen subsequence","Test on data with duplicates, fully descending and fully ascending","Explain how the greedy smallest-tail idea with binary search gives O(n log n)"],
  starter:"#include <algorithm>\n#include <iostream>\n#include <vector>\nint main(){\n    std::vector<int> a{10, 9, 2, 5, 3, 7, 101, 18};\n    std::vector<int> dp(a.size(), 1);\n    int best = 1;\n    for (std::size_t i = 1; i < a.size(); i++)\n        for (std::size_t j = 0; j < i; j++)\n            if (a[j] < a[i]){ dp[i] = std::max(dp[i], dp[j] + 1); best = std::max(best, dp[i]); }\n    std::cout << best << std::endl;\n}",
  hint:"状态定义为「以 i 结尾的最长递增子序列长度」，转移就只需要往前找所有更小的元素。",
  hint_en:"Define the state as the LIS length ending at i, then transition from all smaller earlier elements.",
  xp:40}
];
L["dsl"] = [
 {t:"手写单链表并实现反转",t_en:"Hand-written Linked List and Reversal",
  req:["实现 push_back、print、reverse 三个函数（含内存释放）","用三个指针完成反转，打印反转前后的序列","用 ASan 或逐个 new/delete 核对，确认无泄漏"],
  req_en:["Implement push_back, print and reverse plus memory release","Reverse with three pointers and print before and after","Verify with ASan or careful bookkeeping that nothing leaks"],
  starter:"#include <iostream>\nstruct Node { int v; Node* next; };\nNode* push(Node* h, int v){ return new Node{v, h}; }\nNode* reverse(Node* h){\n    Node* prev = nullptr;\n    while (h){ Node* nx = h->next; h->next = prev; prev = h; h = nx; }\n    return prev;\n}\nint main(){ Node* h = nullptr; for (int i = 1; i <= 5; i++) h = push(h, i); h = reverse(h); while (h){ std::cout << h->v; h = h->next; } }",
  hint:"反转的关键是先用 nx 存住后继，再改 h->next，否则会断链丢节点。",
  hint_en:"Save the successor in nx before rewiring h->next, or the chain is lost.",
  xp:35},
 {t:"复杂度实测：O(n)、O(n log n)、O(n²)",t_en:"Measuring O(n), O(n log n) and O(n^2)",
  req:["实现三个函数分别对应线性、对数线性、平方复杂度","对 n=1000/2000/4000 各计时并记录数据","用比值法判断实测增长是否符合预期阶数"],
  req_en:["Implement one function each for linear, linearithmic and quadratic complexity","Time them at n = 1000, 2000, 4000 and record the numbers","Use ratios to check whether growth matches the expected order"],
  starter:"#include <chrono>\n#include <iostream>\n#include <vector>\nlong long linear(int n){ long long s = 0; for (int i = 0; i < n; i++) s += i; return s; }\nlong long quad(int n){ long long s = 0; for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) s++; return s; }\nint main(){ std::cout << linear(1000) << quad(1000) << std::endl; }",
  hint:"把 n 翻倍后耗时大约翻几倍，就能反推阶数：线性约 2 倍，平方约 4 倍，对数线性略高于 2 倍。",
  hint_en:"Doubling n reveals the order: about 2x for linear, 4x for quadratic, slightly over 2x for n log n.",
  xp:35}
];
L["dsk"] = [
 {t:"用栈实现括号匹配与表达式求值",t_en:"Bracket Matching and Expression Evaluation",
  req:["用栈判断含三种括号的字符串是否匹配","扩展成把后缀表达式（逆波兰式）求值","再用栈把中缀表达式转成后缀表达式"],
  req_en:["Use a stack to validate a string with three kinds of brackets","Extend it to evaluate a postfix (RPN) expression","Use a stack again to convert infix to postfix"],
  starter:"#include <iostream>\n#include <stack>\n#include <string>\nbool ok(const std::string& s){\n    std::stack<char> st;\n    for (char c : s){\n        if (c == '(' || c == '[' || c == '{') st.push(c);\n        else { if (st.empty()) return false; st.pop(); }\n    }\n    return st.empty();\n}\nint main(){ std::cout << ok(\"(()[])\") << ok(\"(()\") << std::endl; }",
  hint:"完整的实现还要检查右括号与栈顶是否同类，否则「(]」会被误判为合法。",
  hint_en:"A full version must also match the bracket types, or (] is wrongly accepted.",
  xp:35},
 {t:"手写一个简易哈希表",t_en:"A Hand-written Hash Table",
  req:["用「数组 + 链表」实现 put、get、remove 三个操作","实现哈希函数与负载因子，超过 0.75 时扩容重哈希","与 std::unordered_map 在 10 万次插入下比较耗时"],
  req_en:["Implement put, get and remove with an array of buckets holding linked lists","Implement the hash function and rehash when the load factor exceeds 0.75","Compare timings with std::unordered_map over 100k insertions"],
  starter:"#include <iostream>\n#include <list>\n#include <string>\n#include <vector>\nclass HMap {\n    std::vector<std::list<std::pair<std::string, int>>> b_{8};\n    std::size_t hash(const std::string& s) const { return std::hash<std::string>{}(s) % b_.size(); }\npublic:\n    void put(const std::string& k, int v){ auto& l = b_[hash(k)]; for (auto& p : l) if (p.first == k){ p.second = v; return; } l.emplace_back(k, v); }\n    int get(const std::string& k){ for (auto& p : b_[hash(k)]) if (p.first == k) return p.second; return -1; }\n};\nint main(){ HMap m; m.put(\"a\", 1); std::cout << m.get(\"a\") << std::endl; }",
  hint:"扩容时要重新计算每个元素的桶位置，不能简单搬移，否则哈希与桶数不匹配。",
  hint_en:"Rehashing must recompute each bucket index, not merely copy the chains over.",
  xp:35}
];
L["dst"] = [
 {t:"用 BST 实现插入、查找与遍历",t_en:"BST Insert, Search and Traversal",
  req:["实现 BST 的插入、contains 与中序遍历（递归版）","再写一个非递归的查找版本，比较两种写法","按有序与随机两种顺序插入同样数据，打印树高差异"],
  req_en:["Implement insert, contains and in-order traversal recursively for a BST","Add an iterative search and compare it with recursion","Insert the same data in sorted and random order and compare tree heights"],
  starter:"#include <iostream>\nstruct Node { int v; Node* l = nullptr; Node* r = nullptr; };\nNode* insert(Node* t, int v){\n    if (!t) return new Node{v};\n    if (v < t->v) t->l = insert(t->l, v); else t->r = insert(t->r, v);\n    return t;\n}\nvoid inorder(Node* t){ if (!t) return; inorder(t->l); std::cout << t->v; inorder(t->r); }\nint main(){ Node* root = nullptr; for (int v : {5, 3, 8, 1}) root = insert(root, v); inorder(root); }",
  hint:"有序插入会让 BST 退化成链表（树高 = n），这也是平衡树存在的理由。",
  hint_en:"Sorted insertion degrades the BST to a list of height n, the reason balanced trees exist.",
  xp:35},
 {t:"用堆解决 Top-K 与中位数问题",t_en:"Top-K and Running Median with Heaps",
  req:["用 priority_queue 求一组数中的最大 K 个","用两个堆（大顶 + 小顶）实现数据流中位数","对 10 万条数据流式处理，比较堆方案与全排序的耗时"],
  req_en:["Find the largest K numbers with priority_queue","Maintain a running median using one max-heap and one min-heap","Stream 100k numbers and compare the heap approach with full sorting"],
  starter:"#include <iostream>\n#include <queue>\n#include <vector>\nint main(){\n    std::vector<int> a{3, 1, 4, 1, 5, 9, 2, 6};\n    std::priority_queue<int> pq(a.begin(), a.end());\n    for (int i = 0; i < 3; i++){ std::cout << pq.top() << ' '; pq.pop(); }\n}",
  hint:"求最大 K 个用小顶堆维护大小为 K 的候选集，复杂度是 O(n log K) 而不是 O(n log n)。",
  hint_en:"Keep a min-heap of size K for the top K, giving O(n log K) instead of O(n log n).",
  xp:35}
];
L["dsg"] = [
 {t:"用 DFS/BFS 求岛屿数量与最大面积",t_en:"Islands: Count and Largest Area",
  req:["给定 0/1 网格，用 DFS 统计连通块（岛屿）数量","同时求出最大的岛屿面积并打印","改用 BFS 实现，比较两种写法的代码结构"],
  req_en:["Given a 0/1 grid, count connected components (islands) with DFS","Also compute the largest island's area","Reimplement with BFS and compare the code structure"],
  starter:"#include <iostream>\n#include <vector>\nint n = 4, m = 5;\nstd::vector<std::vector<int>> g{{\n    {1,1,0,0,0},{1,1,0,0,0},{0,0,1,0,0},{0,0,0,1,1}}};\nint dfs(int i, int j){\n    if (i < 0 || j < 0 || i >= n || j >= m || g[i][j] == 0) return 0;\n    g[i][j] = 0;\n    return 1 + dfs(i+1, j) + dfs(i-1, j) + dfs(i, j+1) + dfs(i, j-1);\n}\nint main(){ int cnt = 0, mx = 0; for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) if (g[i][j]){ cnt++; mx = std::max(mx, dfs(i, j)); } std::cout << cnt << \" \" << mx; }",
  hint:"DFS 遍历过程中直接把访问过的格子置 0，就等价于 visited 标记，省一个数组。",
  hint_en:"Setting visited cells to 0 doubles as the visited marker, saving an array.",
  xp:35},
 {t:"用 BFS 求无权图最短路径并输出路径",t_en:"BFS Shortest Path with Reconstruction",
  req:["用邻接表建图，用 BFS 求起点到所有点的最短距离","用 prev 数组记录前驱，回溯输出一条具体路径","处理起点与终点不连通的情况"],
  req_en:["Build a graph with adjacency lists and run BFS from a source","Record predecessors to reconstruct one concrete path","Handle the unreachable target case"],
  starter:"#include <iostream>\n#include <queue>\n#include <vector>\nint main(){\n    int n = 6;\n    std::vector<std::vector<int>> g(n);\n    auto add = [&](int a, int b){ g[a].push_back(b); g[b].push_back(a); };\n    add(0,1); add(0,2); add(1,3); add(2,4); add(3,5); add(4,5);\n    std::vector<int> dist(n, -1), prev(n, -1);\n    std::queue<int> q; q.push(0); dist[0] = 0;\n    while (!q.empty()){ int u = q.front(); q.pop(); for (int v : g[u]) if (dist[v] < 0){ dist[v] = dist[u] + 1; prev[v] = u; q.push(v); } }\n    std::cout << dist[5] << std::endl;\n}",
  hint:"BFS 首次访问某点时的层数就是最短距离；dist 同时充当 visited 标记。",
  hint_en:"The layer of first discovery is the shortest distance; dist doubles as the visited marker.",
  xp:35}
];
L["dsa"] = [
 {t:"手写快排与归并并对比稳定性",t_en:"Quick Sort vs Merge Sort",
  req:["手写快速排序（含随机基准）与归并排序","用含重复元素的数据测试，验证归并排序稳定、快排不稳定","统计并打印两者的递归深度或比较次数"],
  req_en:["Hand-write quick sort with a random pivot and merge sort","Test on data with duplicates and verify merge sort is stable while quick sort is not","Count and print recursion depth or comparison counts"],
  starter:"#include <iostream>\n#include <random>\n#include <vector>\nvoid qsort_rec(std::vector<int>& a, int l, int r){\n    if (l >= r) return;\n    int i = l, j = r, p = a[l + rand() % (r - l + 1)];\n    while (i <= j){\n        while (a[i] < p) i++;\n        while (a[j] > p) j--;\n        if (i <= j) std::swap(a[i++], a[j--]);\n    }\n    qsort_rec(a, l, j); qsort_rec(a, i, r);\n}\nint main(){ std::vector<int> a{5,3,8,1,9,2}; qsort_rec(a, 0, a.size()-1); for (int x : a) std::cout << x; }",
  hint:"随机基准能有效避免「已排序输入」导致的最坏 O(n²) 退化。",
  hint_en:"A random pivot avoids the O(n^2) worst case on already sorted input.",
  xp:40},
 {t:"二分查找及其两种变体",t_en:"Binary Search and Two Variants",
  req:["实现基础二分查找（返回下标或 -1）","实现「第一个大于等于目标」的下界查找","实现「最后一次出现」的上界查找，并用重复元素数据验证"],
  req_en:["Implement basic binary search returning an index or -1","Implement lower_bound: the first element not less than the target","Implement upper_bound for the last occurrence and verify on duplicated data"],
  starter:"#include <iostream>\n#include <vector>\nint search(const std::vector<int>& a, int x){\n    int lo = 0, hi = (int)a.size() - 1;\n    while (lo <= hi){\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] == x) return mid;\n        if (a[mid] < x) lo = mid + 1; else hi = mid - 1;\n    }\n    return -1;\n}\nint main(){ std::vector<int> a{1,3,5,7,9}; std::cout << search(a, 7) << std::endl; }",
  hint:"mid 写成 lo + (hi - lo) / 2 可以避免 lo + hi 溢出；边界变体的关键是判等时的取舍。",
  hint_en:"mid as lo + (hi - lo)/2 avoids overflow; the trick in boundary variants is what you do on equality.",
  xp:40}
];
L["eng"] = [
 {t:"从零完成一次 Git 协作流程",t_en:"A Full Git Collaboration Flow",
  req:["在本地建仓库，完成 add/commit/log 三个基本操作","建一个分支做修改，再合并回主分支并处理一次冲突","用 .gitignore 排除构建产物，确认 status 干净"],
  req_en:["Create a local repo and practise add, commit and log","Create a branch, make a change, merge back and resolve one conflict","Add a .gitignore for build output and confirm status is clean"],
  starter:"# git init && git add . && git commit -m \"init\"\n# git switch -c feature\n# git switch main && git merge feature\n# 冲突时：编辑文件 -> git add -> git commit",
  hint:"合并冲突不是错误，而是需要人来做决策的地方；解决后要 git add 标记为已解决。",
  hint_en:"A merge conflict is a decision point, not an error; git add marks it resolved.",
  xp:35},
 {t:"用 CMake 组织一个可测试的多文件工程",t_en:"A Testable Multi-file CMake Project",
  req:["写 CMakeLists.txt 定义可执行目标与库目标","把库单独成 target，让测试可执行文件链接它","用 add_test 注册测试并跑通 ctest"],
  req_en:["Write a CMakeLists.txt defining an executable and a library target","Keep the library separate so the test binary can link it","Register tests with add_test and run them via ctest"],
  starter:"cmake_minimum_required(VERSION 3.16)\nproject(demo CXX)\nset(CMAKE_CXX_STANDARD 17)\nadd_library(core src/core.cpp)\ntarget_include_directories(core PUBLIC include)\nadd_executable(app src/main.cpp)\ntarget_link_libraries(app PRIVATE core)\nenable_testing()\n# add_test(NAME basic COMMAND app)",
  hint:"把逻辑放进库、把 I/O 留在可执行文件里，是让代码可测试的关键一步。",
  hint_en:"Putting logic in a library and keeping I/O in the executable is what makes code testable.",
  xp:35},
 {t:"给工程补上单元测试",t_en:"Add Unit Tests to the Project",
  req:["为前面的库目标写 3 个测试用例：正常值、边界值、异常路径各一个","用 assert 或 GTest 把测试跑起来，让全部用例通过","故意改坏一处实现，确认测试能立刻报出失败"],
  req_en:["Write three test cases for the library target: normal, boundary and failure path","Run them with assert or GTest and make them all pass","Break one implementation detail on purpose and confirm the tests go red at once"],
  starter:"#include <cassert>\nint add(int a, int b);\n\nvoid test_add(){\n    assert(add(1, 2) == 3);      // 正常\n    assert(add(0, 0) == 0);      // 边界\n    assert(add(-1, 1) == 0);     // 正负\n}\n\nint main(){ test_add(); }",
  hint:"好测试先红后绿：先写用例（期望它会失败），再写实现让它通过。",
  hint_en:"Good tests fail first: write the case expecting red, then make it green.",
  xp:35}
];
L["career"] = [
 {t:"用 STAR 把项目经历改写成简历条目",t_en:"Rewriting a Project Bullet with STAR",mode:"text",
  req:["挑一个自己做过的项目，按背景-任务-行动-结果四段写成 4 行","结果部分必须含至少两个可量化指标","把整段压缩成简历上不超过三行的条目"],
  req_en:["Pick a project and write four lines covering situation, task, action and result","Include at least two quantified metrics in the result line","Compress the whole thing into a three-line resume bullet"],
  starter:"// 背景：项目规模 / 你的角色\n// 任务：要解决的具体问题\n// 行动：你做了什么技术决策\n// 结果：量化指标（性能、耗时、覆盖率…）",
  hint:"面试官追问的通常正是你写下的数字，所以每个指标都要能解释清楚测法。",
  hint_en:"Interviewers probe the numbers you write, so every metric must be defensible.",
  xp:30},
 {t:"限时手写两道高频题并自评",t_en:"Two Timed Interview Questions",mode:"text",
  req:["限时各 20 分钟完成：链表反转与两数之和","写完立刻用边界用例自测（空输入、单元素、重复值）","按「思路清晰度、边界处理、复杂度分析」三项自评打分"],
  req_en:["Solve linked-list reversal and two-sum in 20 minutes each","Self-test immediately with empty input, a single element and duplicates","Score yourself on clarity, edge cases and complexity analysis"],
  starter:"// 两数之和：\n//   暴力 O(n^2)  -> 哈希表 O(n)\n// 自评表：\n//   思路 | 边界 | 复杂度 | 备注",
  hint:"先说出 O(n²) 的暴力解法再优化到 O(n)，比一上来就写最优解更能体现思考过程。",
  hint_en:"State the brute force first then optimise; it shows your reasoning better than jumping to the best answer.",
  xp:30}
];
/* ---------- Python 路线 ---------- */
L["py1"] = [
 {t:"用 f-string 做一张对齐的个人名片",t_en:"An Aligned Card with f-strings",
  req:["用 input 读入昵称、城市、每天学习时长","用 f-string 输出一张至少 6 行、左右对齐的名片","数字列右对齐、文字列左对齐，用格式说明符控制宽度"],
  req_en:["Read nickname, city and daily study hours with input","Print an aligned card of at least six lines using f-strings","Right-align numeric columns and left-align text columns with format specifiers"],
  starter:"name = input(\"昵称: \")\ncity = input(\"城市: \")\nhours = float(input(\"每天学习小时: \"))\n\nprint(\"=\" * 26)\nprint(f\"{'昵称':<10}{name:<12}\")\nprint(f\"{'城市':<10}{city:<12}\")\nprint(f\"{'每天':<10}{hours:>6.1f} 小时\")\nprint(\"=\" * 26)",
  hint:"格式说明符写在冒号后：{x:<10} 左对齐宽度 10，{y:>8.2f} 右对齐并保留两位小数。",
  hint_en:"Specifiers follow the colon: {x:<10} left-aligns in width 10 and {y:>8.2f} right-aligns with two decimals.",
  xp:30},
 {t:"判断闰年并打印一个月历",t_en:"Leap Year Check and a Month Calendar",
  req:["写 is_leap(y) 判断闰年（能被 4 整除且不能被 100 整除，或能被 400 整除）","用 calendar 模块打印某月的日历，再用自写逻辑打印一次对比","对 1900、2000、2024 三个年份验证判断结果"],
  req_en:["Write is_leap(y) for the divisible-by-4-but-not-100-unless-400 rule","Print a month with the calendar module and with your own logic, then compare","Verify the judgement on 1900, 2000 and 2024"],
  starter:"import calendar\n\ndef is_leap(y):\n    return (y % 4 == 0 and y % 100 != 0) or y % 400 == 0\n\nprint(is_leap(1900), is_leap(2000), is_leap(2024))\nprint(calendar.month(2026, 2))",
  hint:"1900 不是闰年、2000 是闰年，这两个特例正是检验规则是否写全的最好样本。",
  hint_en:"1900 is not a leap year while 2000 is; these two cases test whether the rule is complete.",
  xp:30}
];
L["py2"] = [
 {t:"用字典列表做学生成绩分析",t_en:"Student Analysis with List of Dicts",
  req:["用含姓名与三科分数的字典列表表示 5 名学生","用列表推导与 sum/max 求总分排名与各科平均分","找出总分最高与最低的学生，打印成一段结论"],
  req_en:["Represent five students as a list of dicts with a name and three scores","Use comprehensions with sum and max to rank totals and average each subject","Find the top and bottom students and print a conclusion"],
  starter:"students = [\n    {\"name\": \"小明\", \"scores\": [88, 92, 76]},\n    {\"name\": \"小红\", \"scores\": [95, 81, 88]},\n]\nfor s in sorted(students, key=lambda x: sum(x[\"scores\"]), reverse=True):\n    print(s[\"name\"], sum(s[\"scores\"]))",
  hint:"sorted 的 key 参数可以传函数，lambda 是写一次性排序键最方便的方式。",
  hint_en:"sorted takes a key function, and a lambda is the handiest one-off sort key.",
  xp:30},
 {t:"用切片与推导式做文本清洗",t_en:"Text Cleaning with Slicing and Comprehensions",
  req:["把一段含多余空格与大小写混杂的文本规范化成统一格式","用推导式去掉标点、把首字母大写","统计清洗前后字符数的变化并打印"],
  req_en:["Normalise a messy text with extra spaces and mixed case","Strip punctuation and capitalise words with comprehensions","Print how the character count changed"],
  starter:"import re\ntext = \"  Hello, WORLD!!  this is   a   Test. \"\nwords = [w for w in re.sub(r'[^\\w\\s]', '', text).split()]\nprint(' '.join(w.capitalize() for w in words))",
  hint:"正则 re.sub 只做一次替换比逐字符判断简洁得多；split() 不传参会自动合并连续空白。",
  hint_en:"A single re.sub beats per-character checks, and split() without arguments collapses whitespace.",
  xp:30}
];
L["py3"] = [
 {t:"把函数与文件读写组合成统计工具",t_en:"Combining Functions with File IO",
  req:["写 count_words(path) 返回词频字典，内部用 with 打开文件","支持传一个 stopwords 参数过滤常见虚词","写 main 打印前 5 名并把结果写入 report.txt"],
  req_en:["Write count_words(path) returning a frequency dict using with for the file","Accept a stopwords parameter to filter out common function words","Have main print the top 5 and also write them to report.txt"],
  starter:"from collections import Counter\nfrom pathlib import Path\n\ndef count_words(path, stopwords=()):\n    text = Path(path).read_text(encoding=\"utf-8\").lower()\n    words = [w.strip(\".,!?\") for w in text.split()]\n    return Counter(w for w in words if w and w not in stopwords)\n\nprint(count_words(__file__).most_common(3))",
  hint:"把默认值写成不可变的元组而不是列表，可以避免共享默认值带来的累积副作用。",
  hint_en:"Use an immutable tuple as the default rather than a list to avoid shared-state bugs.",
  xp:30},
 {t:"写一个健壮的 CSV 读取器",t_en:"A Robust CSV Reader",
  req:["用 csv.DictReader 读取一个含表头的 CSV，打印每行姓名","跳过表头缺失或行数不足的坏行，并统计坏行数","把有效数据按某一列排序后写回 cleaned.csv"],
  req_en:["Read a CSV with headers using csv.DictReader and print each name","Skip and count malformed rows missing fields","Sort valid rows by one column and write cleaned.csv"],
  starter:"import csv\nfrom pathlib import Path\n\np = Path(\"data.csv\")\np.write_text(\"name,score\\nA,90\\nB,85\\n,77\\n\", encoding=\"utf-8\")\nwith p.open(encoding=\"utf-8\", newline=\"\") as f:\n    for row in csv.DictReader(f):\n        print(row)",
  hint:"打开 CSV 一定要用 newline=\"\"，否则 Windows 上会出现空行；DictReader 的键就是表头。",
  hint_en:"Open CSVs with newline=\"\" to avoid blank lines on Windows; DictReader keys are the header row.",
  xp:30}
];
L["py4"] = [
 {t:"用类实现一个待办清单（含持久化）",t_en:"A Todo List Class with Persistence",
  req:["定义 TodoList 类，含 add/done/remove/list 四个方法","用 json 把数据保存到文件并在启动时加载","用 __str__ 让 print(todos) 输出可读的清单"],
  req_en:["Define TodoList with add, done, remove and list methods","Persist to JSON on change and load on startup","Implement __str__ so printing the object shows a readable list"],
  starter:"import json\nfrom pathlib import Path\n\nclass TodoList:\n    def __init__(self, path=\"todos.json\"):\n        self.path = Path(path)\n        self.items = json.loads(self.path.read_text(encoding=\"utf-8\")) if self.path.exists() else []\n\n    def add(self, text):\n        self.items.append({\"text\": text, \"done\": False})\n        self.save()\n\n    def save(self):\n        self.path.write_text(json.dumps(self.items, ensure_ascii=False, indent=2), encoding=\"utf-8\")",
  hint:"ensure_ascii=False 能让中文以原样写入而不是 \\uXXXX 转义，文件更易读。",
  hint_en:"ensure_ascii=False writes Chinese literally instead of \\uXXXX escapes.",
  xp:30},
 {t:"继承与多态：一个图形面积计算器",t_en:"Shape Area Calculator",
  req:["定义抽象基类 Shape，用 abc.ABC 与 @abstractmethod 约束接口","派生 Circle、Rectangle、Triangle，各自实现 area 与 describe","把图形放进列表统一遍历，按面积排序输出"],
  req_en:["Define an abstract Shape using abc.ABC and @abstractmethod","Derive Circle, Rectangle and Triangle implementing area and describe","Iterate a list of shapes and print them sorted by area"],
  starter:"from abc import ABC, abstractmethod\nimport math\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): ...\n\nclass Circle(Shape):\n    def __init__(self, r): self.r = r\n    def area(self): return math.pi * self.r ** 2\n\nprint(round(Circle(1).area(), 2))",
  hint:"抽象类无法直接实例化，这能在运行前就拦住「忘了实现接口方法」的错误。",
  hint_en:"Abstract classes cannot be instantiated, catching missing implementations early.",
  xp:30}
];
/* ---------- 数学基础篇（手算型） ---------- */
L["ma1"] = [
 {t:"手算三个矩阵运算并验证",t_en:"Three Matrix Operations by Hand",mode:"text",
  req:["对给定的 2×3 与 3×2 矩阵手算乘积，写出每一步的行列点积","手算一个 2×2 矩阵的行列式与转置","再用 NumPy 复核三个结果，说明手算与代码的对应关系"],
  req_en:["Multiply a 2x3 and a 3x2 matrix by hand, writing each row-column dot product","Compute a 2x2 determinant and its transpose by hand","Verify all three with NumPy and map the hand steps to the code"],
  starter:"# A = [[1,2,3],[4,5,6]]   B = [[7,8],[9,10],[11,12]]\n# AB 的第 (1,1) 项 = 1*7 + 2*9 + 3*11 = ?\n# 请把 AB 的 4 项都算出来，再用以下代码校验\n# import numpy as np\n# print(np.array([[1,2,3],[4,5,6]]) @ np.array([[7,8],[9,10],[11,12]]))",
  hint:"矩阵乘法是「左矩阵的行」点乘「右矩阵的列」，结果形状是 (左行数, 右列数)。",
  hint_en:"Matrix multiplication dots a row of the left with a column of the right; the shape is (rows_left, cols_right).",
  xp:40},
 {t:"用 NumPy 实现一个相似度排序器",t_en:"A Similarity Ranker with NumPy",
  req:["构造 5 个 3 维向量，计算它们两两的余弦相似度矩阵","对给定的查询向量，按相似度降序输出前 3 个","用纯 Python 循环实现同一计算，比较代码长度与运行速度"],
  req_en:["Build five 3-D vectors and compute the pairwise cosine similarity matrix","For a query vector, print the top 3 by similarity","Reimplement with pure Python loops and compare length and speed"],
  starter:"import numpy as np\n\nv = np.array([[1,0,0],[0,1,0],[1,1,0],[1,2,3],[2,1,0]], dtype=float)\nnorm = v / np.linalg.norm(v, axis=1, keepdims=True)\nsim = norm @ norm.T\nq = np.array([1, 1, 0], dtype=float)\nq = q / np.linalg.norm(q)\nprint(np.argsort(-(norm @ q))[:3])",
  hint:"余弦相似度就是归一化后的点积；np.argsort(-x) 是按降序取下标最简便的写法。",
  hint_en:"Cosine similarity is the dot product after normalising; np.argsort(-x) gives descending order.",
  xp:40}
];
L["ma2"] = [
 {t:"手算秩与特征值，理解不可逆",t_en:"Rank and Eigenvalues by Hand",mode:"text",
  req:["对两个 2×2 矩阵手算行列式并判断是否可逆","手算一个上三角矩阵的特征值（对角元即特征值）","用 NumPy 验证行列式、秩与特征值，说明三者关系"],
  req_en:["Compute the determinant of two 2x2 matrices by hand and decide invertibility","Work out the eigenvalues of an upper triangular matrix (the diagonal entries)","Verify determinant, rank and eigenvalues with NumPy and relate the three"],
  starter:"# A = [[2,0],[0,3]]   B = [[1,2],[2,4]]\n# det(A)=? det(B)=? 哪个不可逆？\n# B 的秩是多少？为什么？\n# import numpy as np\n# print(np.linalg.det(B), np.linalg.matrix_rank(B), np.linalg.eigvals(B))",
  hint:"det 为 0 等价于秩不满、行向量线性相关、矩阵把空间压扁，因此不可逆。",
  hint_en:"Det 0 means rank deficient, linearly dependent rows and collapsed space, hence not invertible.",
  xp:40},
 {t:"用 SVD 做一次降维实验",t_en:"A Dimensionality Reduction Experiment with SVD",
  req:["构造一个 6×4 的数据矩阵并做中心化","用 SVD（或 PCA）降到 2 维，打印解释方差比","说明保留前两个主成分损失了多少信息"],
  req_en:["Build a 6x4 data matrix and centre it","Reduce to 2 dimensions with SVD or PCA and print the explained variance ratio","State how much information the first two components retain"],
  starter:"import numpy as np\n\nX = np.random.default_rng(0).normal(size=(6, 4))\nXc = X - X.mean(axis=0)\nU, S, Vt = np.linalg.svd(Xc, full_matrices=False)\nratio = S ** 2 / (S ** 2).sum()\nprint(np.round(ratio[:2].sum(), 4))",
  hint:"解释方差比就是奇异值平方的占比；前两个成分占比越高，降到 2 维损失越小。",
  hint_en:"Explained variance ratio is the squared singular values' share; a higher share means less loss.",
  xp:40}
];
L["ma3"] = [
 {t:"手算偏导与梯度下降一步",t_en:"Partial Derivatives and One Gradient Step",mode:"text",
  req:["对 f(x,y)=x²+3xy+y² 手算两个偏导","在点 (1,1) 处代入得到梯度，用 η=0.1 走一步并算出新点","用数值差分或代码复核手算的梯度与新点"],
  req_en:["Compute both partial derivatives of f(x,y)=x^2+3xy+y^2 by hand","Evaluate the gradient at (1,1), take one step with η=0.1 and get the new point","Verify the gradient and new point numerically or in code"],
  starter:"# f = x^2 + 3xy + y^2\n# df/dx = ?   df/dy = ?\n# 在 (1,1)：grad = (?, ?)\n# 新点 = (1,1) - 0.1 * grad = (?, ?)\n# 复核：数值差分 (f(x+h,y)-f(x,y))/h",
  hint:"偏导就是把另一个变量当常数求导；梯度下降是沿负梯度方向走一步，η 决定步长。",
  hint_en:"A partial derivative treats the other variable as constant; gradient descent steps along the negative gradient scaled by η.",
  xp:40},
 {t:"用 NumPy 手写一维梯度下降",t_en:"One-Dimensional Gradient Descent in NumPy",
  req:["对 f(x)=(x-3)²+1 手写梯度下降，观察 x 收敛到 3","分别用 η=0.01、0.1、1.1 各跑 20 步，记录最终 x","解释 η 过大时为什么发散"],
  req_en:["Hand-code gradient descent on f(x)=(x-3)^2+1 and watch x converge to 3","Run 20 steps with η = 0.01, 0.1 and 1.1 and record the final x","Explain why an oversized η diverges"],
  starter:"def f(x): return (x - 3) ** 2 + 1\ndef grad(x): return 2 * (x - 3)\n\nx = 0.0\nfor step in range(20):\n    x -= 0.1 * grad(x)\nprint(round(x, 6))",
  hint:"二次函数的稳定步长上限是 1/L（L 为二阶导上界），本例 L=2，所以 η>1 就会发散。",
  hint_en:"For a quadratic the stable step is below 1/L; here L=2, so η>1 diverges.",
  xp:40}
];
L["ma4"] = [
 {t:"用贝叶斯定理算一次诊断概率",t_en:"A Bayesian Diagnosis Calculation",mode:"text",
  req:["已知发病率 1%、检测灵敏度 99%、特异度 95%","手算「检测阳性时真患病」的后验概率","用全概率公式验证分母，再用代码复核结果"],
  req_en:["Given a 1% prevalence, 99% sensitivity and 95% specificity","Compute by hand the posterior probability of disease given a positive test","Verify the denominator with the law of total probability and check with code"],
  starter:"# P(D)=0.01  P(+|D)=0.99  P(+|~D)=0.05\n# P(+)=P(+|D)P(D)+P(+|~D)P(~D)=?\n# P(D|+) = P(+|D)P(D) / P(+)\n# 结论：阳性也只有约 ?% 的概率真的患病",
  hint:"低发病率时假阳性会主导分母，这正是「罕见病筛查阳性也要复检」的数学原因。",
  hint_en:"With low prevalence false positives dominate the denominator, the maths behind re-testing rare conditions.",
  xp:40},
 {t:"用模拟验证期望与方差",t_en:"Verifying Expectation and Variance by Simulation",
  req:["用随机模拟估计两个骰子点数和、以及几何分布的期望","与理论值比较，观察模拟次数从 100 增到 10 万时误差如何变化","画出或打印误差随样本数变化的趋势"],
  req_en:["Simulate the sum of two dice and a geometric distribution to estimate their means","Compare with theory and watch the error as samples grow from 100 to 100000","Print or sketch how the error shrinks with sample size"],
  starter:"import numpy as np\nrng = np.random.default_rng(0)\nfor n in [100, 1000, 10000, 100000]:\n    s = rng.integers(1, 7, size=(n, 2)).sum(axis=1)\n    print(n, round(s.mean(), 4), \"theory 7\")",
  hint:"大数定律保证了样本均值会收敛到期望，但收敛速度是 1/sqrt(n)，所以误差下降得很慢。",
  hint_en:"The law of large numbers guarantees convergence but at 1/sqrt(n), so errors shrink slowly.",
  xp:40}
];
/* ---------- 数据工具篇 ---------- */
L["sp1"] = [
 {t:"用向量化替代三重循环",t_en:"Replacing Triple Loops with Vectorisation",
  req:["用嵌套循环计算两个矩阵乘积，再与 @ 的结果对比正确性","对 200×200 矩阵分别计时，记录加速比","说明广播与连续内存为什么能带来数量级提升"],
  req_en:["Multiply two matrices with nested loops and compare against the @ operator","Time both on 200x200 matrices and record the speedup","Explain why broadcasting and contiguous memory give order-of-magnitude gains"],
  starter:"import numpy as np, time\nA = np.random.rand(200, 200); B = np.random.rand(200, 200)\n\nt = time.perf_counter()\nC = np.zeros((200, 200))\nfor i in range(200):\n    for j in range(200):\n        for k in range(200):\n            C[i, j] += A[i, k] * B[k, j]\nprint(\"loop\", round(time.perf_counter() - t, 3))\n\nt = time.perf_counter(); D = A @ B; print(\"matmul\", round(time.perf_counter() - t, 4))\nprint(np.allclose(C, D))",
  hint:"向量化把解释器层的循环推到编译好的底层循环，省掉大量对象创建与类型检查。",
  hint_en:"Vectorisation pushes loops into compiled code, removing object creation and type checks.",
  xp:35},
 {t:"用布尔索引与掩码清洗数组",t_en:"Cleaning Arrays with Boolean Masks",
  req:["生成含异常值与缺失值（nan）的一维数组","用掩码把负值替换为 0、把 nan 替换为该列均值","用 where 与 clip 各实现一次，比较两种写法"],
  req_en:["Generate a 1-D array containing outliers and nan values","Use a mask to clamp negatives to 0 and replace nan with the mean","Implement it once with where and once with clip, then compare"],
  starter:"import numpy as np\na = np.array([1.0, -3.0, np.nan, 5.0, -0.5, 7.0])\nmask = np.isnan(a)\na[mask] = np.nanmean(a)\na = np.where(a < 0, 0, a)\nprint(a)",
  hint:"np.isnan 返回布尔数组可直接当索引；nanmean 会忽略 nan 再求均值。",
  hint_en:"np.isnan returns a boolean array usable as a mask, and nanmean ignores nan values.",
  xp:35}
];
L["sp2"] = [
 {t:"用 Pandas 完成一次完整清洗",t_en:"A Full Clean-up with Pandas",
  req:["构造含缺失值、重复行与错误类型的数据表","依次处理：删除重复、填充缺失、转换类型、修正异常值","打印清洗前后行数、缺失数与类型信息做对比"],
  req_en:["Build a table containing missing values, duplicate rows and wrong types","Clean it step by step: drop duplicates, fill missing, cast types, fix outliers","Print before and after row counts, missing counts and dtypes"],
  starter:"import pandas as pd, numpy as np\ndf = pd.DataFrame({\"name\": [\"a\", \"b\", \"a\", None], \"score\": [90, np.nan, 90, 77]})\nprint(df.shape, df.isna().sum().sum())\ndf = df.drop_duplicates().dropna(subset=[\"name\"])\ndf[\"score\"] = df[\"score\"].fillna(df[\"score\"].mean())\nprint(df)",
  hint:"清洗顺序会影响结果：先去重再填均值，比先填均值再去重要更合理。",
  hint_en:"Order matters: dropping duplicates before imputing the mean is usually the right sequence.",
  xp:35},
 {t:"分组聚合与透视表",t_en:"Group-by Aggregation and a Pivot Table",
  req:["用一份含班级、科目、分数的数据做分组统计","分别用 groupby.agg 求均值与最大最小，用 pivot_table 做交叉表","把结果导出为 CSV 并打印前几行"],
  req_en:["Aggregate a dataset of class, subject and score by groups","Use groupby.agg for mean, max and min, and pivot_table for a cross table","Export the result to CSV and print the head"],
  starter:"import pandas as pd\ndf = pd.DataFrame({\"cls\": [\"A\",\"A\",\"B\",\"B\"], \"subject\": [\"数学\",\"英语\",\"数学\",\"英语\"], \"score\": [90, 80, 70, 95]})\nprint(df.groupby(\"cls\")[\"score\"].agg([\"mean\", \"max\", \"min\"]))\nprint(df.pivot_table(index=\"cls\", columns=\"subject\", values=\"score\", aggfunc=\"mean\"))",
  hint:"groupby 的 agg 能一次算出多个统计量；pivot_table 把「行-列-值」三个维度一次展开。",
  hint_en:"agg computes several statistics at once and pivot_table lays out row, column and value in one go.",
  xp:35}
];
L["sp3"] = [
 {t:"设计一份可复现的数据分析报告",t_en:"Designing a Reproducible Analysis Report",mode:"text",
  req:["把「读数据→清洗→分析→可视化→结论」五步写成 Notebook 大纲","为每步规定输入、输出与失败时的处理方式","说明如何让别人 clone 后一键跑通（依赖、随机种子、相对路径）"],
  req_en:["Outline an analysis notebook as read, clean, analyse, visualise, conclude","Specify input, output and failure handling for each step","Explain how someone can clone and rerun it with one command"],
  starter:"# 1 读数据  -> raw.csv（相对路径）\n# 2 清洗    -> df_clean（记录行数变化）\n# 3 分析    -> 关键指标表\n# 4 可视化  -> 图 1/图 2\n# 5 结论    -> 3 条可执行结论\n# 复现要求：requirements.txt + 固定随机种子 + 相对路径",
  hint:"把随机种子固定、路径写成相对路径、依赖写进 requirements.txt，是可复现的三件必需品。",
  hint_en:"A fixed seed, relative paths and a requirements file are the three must-haves for reproducibility.",
  xp:35},
 {t:"用 Matplotlib 画出三张诊断图",t_en:"Three Diagnostic Plots with Matplotlib",
  req:["画一张损失曲线（含训练与验证两条线）","画一张特征分布直方图与一张散点图","给每张图加上标题、坐标轴标签与图例"],
  req_en:["Plot a loss curve with training and validation lines","Plot a feature histogram and a scatter plot","Add titles, axis labels and legends to each figure"],
  starter:"import matplotlib\nmatplotlib.use(\"Agg\")\nimport matplotlib.pyplot as plt\n\nplt.figure()\nplt.plot([3, 2, 1.5, 1.2], label=\"train\")\nplt.plot([3.2, 2.4, 2.0, 1.9], label=\"val\")\nplt.title(\"loss\"); plt.xlabel(\"epoch\"); plt.ylabel(\"loss\"); plt.legend()\nplt.savefig(\"loss.png\")",
  hint:"验证损失在训练损失继续下降时回升，就是过拟合最直观的信号。",
  hint_en:"Validation loss rising while training loss keeps falling is the clearest overfitting signal.",
  xp:35}
];
/* ---------- 机器学习篇 ---------- */
L["ml1"] = [
 {t:"手写线性回归的梯度下降",t_en:"Linear Regression by Hand",
  req:["用 NumPy 手写单变量线性回归的梯度下降（不调用 sklearn）","画出或打印损失随迭代下降的序列","与 sklearn 的结果比较斜率与截距是否接近"],
  req_en:["Hand-code single-variable linear regression with NumPy gradient descent","Print or plot the loss sequence over iterations","Compare slope and intercept with sklearn's fit"],
  starter:"import numpy as np\nX = np.array([1, 2, 3, 4, 5], dtype=float)\ny = 2 * X + 1\nw, b = 0.0, 0.0\nfor _ in range(2000):\n    yp = w * X + b\n    w -= 0.01 * np.mean((yp - y) * X) * 2\n    b -= 0.01 * np.mean(yp - y) * 2\nprint(round(w, 3), round(b, 3))",
  hint:"梯度就是对损失求偏导后取平均；学习率太大会震荡、太小收敛慢，可以两种都试。",
  hint_en:"The gradient is the averaged partial derivative; a large learning rate oscillates and a small one crawls.",
  xp:35},
 {t:"用交叉验证评估模型稳定性",t_en:"Assessing Stability with Cross-validation",
  req:["对一个回归模型做 5 折交叉验证，记录每折的评分","打印平均分与标准差，说明标准差的意义","换一个更复杂的模型再跑一次，比较波动大小"],
  req_en:["Run 5-fold cross-validation on a regression model and record each fold's score","Print the mean and standard deviation and explain what the spread means","Try a more complex model and compare the volatility"],
  starter:"from sklearn.datasets import make_regression\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import cross_val_score\n\nX, y = make_regression(n_samples=200, n_features=3, noise=15, random_state=0)\ns = cross_val_score(LinearRegression(), X, y, cv=5, scoring=\"r2\")\nprint(s.round(3), round(s.mean(), 3), round(s.std(), 3))",
  hint:"各折分数波动大说明模型对数据切分敏感，可能是不稳定或数据量不足的信号。",
  hint_en:"Large fold-to-fold variance means the model is sensitive to the split, a sign of instability or too little data.",
  xp:35}
];
L["ml2"] = [
 {t:"从混淆矩阵算全套分类指标",t_en:"Full Metrics from a Confusion Matrix",
  req:["在类别不平衡的数据上训练一个分类器并输出混淆矩阵","手算并打印精确率、召回率、F1 与准确率","用分类报告复核手算结果，解释准确率虚高的原因"],
  req_en:["Train a classifier on imbalanced data and print the confusion matrix","Compute precision, recall, F1 and accuracy by hand and print them","Verify with classification_report and explain the inflated accuracy"],
  starter:"from sklearn.datasets import make_classification\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import confusion_matrix, classification_report\nfrom sklearn.model_selection import train_test_split\n\nX, y = make_classification(n_samples=1000, weights=[0.95, 0.05], random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, stratify=y, random_state=0)\nm = LogisticRegression(max_iter=1000).fit(Xtr, ytr)\nprint(confusion_matrix(yte, m.predict(Xte)))\nprint(classification_report(yte, m.predict(Xte)))",
  hint:"stratify=y 保证训练与测试的正负比例一致，类别不平衡时这一步非常关键。",
  hint_en:"stratify=y keeps class proportions in both splits, essential for imbalanced data.",
  xp:35},
 {t:"用阈值扫描画出 ROC 并解读 AUC",t_en:"Threshold Sweep and ROC",
  req:["用 predict_proba 取得正类概率，扫描阈值算出一组 TPR 与 FPR","画出 ROC 曲线或用代码打印若干关键点","计算 AUC，并说明为什么业务上有时会选非 0.5 的阈值"],
  req_en:["Get positive-class probabilities and sweep thresholds to compute TPR and FPR","Plot the ROC curve or print key points","Compute AUC and explain why a threshold other than 0.5 is sometimes chosen"],
  starter:"import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import roc_auc_score, roc_curve\nfrom sklearn.model_selection import train_test_split\n\nX, y = make_classification(n_samples=1000, random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, random_state=0)\nm = LogisticRegression().fit(Xtr, ytr)\np = m.predict_proba(Xte)[:, 1]\nfpr, tpr, thr = roc_curve(yte, p)\nprint(round(roc_auc_score(yte, p), 3))",
  hint:"召回优先（如疾病筛查）就降低阈值，精确率优先（如垃圾邮件拦截）就提高阈值。",
  hint_en:"Lower the threshold when recall matters (screening) and raise it when precision matters (spam blocking).",
  xp:35}
];
L["ml3"] = [
 {t:"对比标准化与不做标准化的模型表现",t_en:"Standardisation vs Raw Features",
  req:["用同一数据集分别在标准化前后训练 KNN 与逻辑回归","记录两次的准确率与收敛迭代次数","说明哪类模型对量纲敏感、哪类不敏感"],
  req_en:["Train KNN and logistic regression with and without standardisation on the same data","Record accuracy and convergence iterations for both","Explain which models care about scale and which do not"],
  starter:"from sklearn.datasets import make_classification\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.model_selection import cross_val_score\n\nX, y = make_classification(n_samples=600, n_features=10, random_state=0)\nX[:, 0] *= 1000\nprint(cross_val_score(KNeighborsClassifier(), X, y, cv=5).mean())\nprint(cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier()), X, y, cv=5).mean())",
  hint:"KNN 依赖距离、SVM 与梯度类模型依赖量纲，树模型则对特征缩放不敏感。",
  hint_en:"KNN and SVM care about scale while tree models do not.",
  xp:35},
 {t:"用网格搜索与正则化调参",t_en:"Tuning with Grid Search and Regularisation",
  req:["对逻辑回归做网格搜索，比较 L1 与 L2 两种正则","打印最优参数与对应的交叉验证分数","比较 L1 与 L2 训练出的权重中为 0 的个数"],
  req_en:["Grid search a logistic regression over L1 and L2 penalties","Print the best parameters and the corresponding CV score","Compare how many weights are exactly zero under L1 versus L2"],
  starter:"import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import GridSearchCV\n\nX, y = make_classification(n_samples=500, n_features=20, random_state=0)\ng = GridSearchCV(LogisticRegression(max_iter=2000, solver=\"liblinear\"),\n                 {\"penalty\": [\"l1\", \"l2\"], \"C\": [0.1, 1, 10]}, cv=5)\ng.fit(X, y)\nprint(g.best_params_, round(g.best_score_, 3))\nprint(np.sum(g.best_estimator_.coef_ == 0))",
  hint:"L1 会把不重要的权重压到恰好为 0，因此天然具备特征选择的效果。",
  hint_en:"L1 drives unimportant weights exactly to zero, giving built-in feature selection.",
  xp:35}
];
L["ml4"] = [
 {t:"随机森林与单棵树的对比",t_en:"Random Forest vs a Single Tree",
  req:["分别训练单棵决策树与随机森林，比较交叉验证分数","打印随机森林的特征重要性并排序","把树的数量从 10 增到 200，观察分数与耗时的变化"],
  req_en:["Train a single tree and a random forest and compare cross-validation scores","Print and rank the forest's feature importances","Vary n_estimators from 10 to 200 and observe score and runtime"],
  starter:"import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.tree import DecisionTreeClassifier\n\nX, y = make_classification(n_samples=800, n_features=12, random_state=0)\nprint(cross_val_score(DecisionTreeClassifier(random_state=0), X, y, cv=5).mean().round(3))\nm = RandomForestClassifier(n_estimators=100, random_state=0)\nprint(cross_val_score(m, X, y, cv=5).mean().round(3))\nm.fit(X, y)\nprint(np.argsort(-m.feature_importances_)[:3])",
  hint:"树越多通常越稳但收益递减，而且耗时线性增长，常用 100~500 棵作为折中。",
  hint_en:"More trees are steadier but with diminishing returns and linear cost; 100 to 500 is a common compromise.",
  xp:40},
 {t:"k-means 聚类与肘部法选 k",t_en:"k-means and the Elbow Method",
  req:["对无标签数据做 k-means，k 从 2 试到 8","记录每个 k 的惯性（inertia）并找出肘部位置","用 PCA 把数据降到 2 维打印簇心坐标，解释聚类结果"],
  req_en:["Cluster unlabeled data with k-means for k from 2 to 8","Record inertia for each k and identify the elbow","Use PCA to reduce to 2-D, print centroids and interpret the clusters"],
  starter:"from sklearn.cluster import KMeans\nfrom sklearn.datasets import make_blobs\n\nX, _ = make_blobs(n_samples=500, centers=4, random_state=0)\nfor k in range(2, 8):\n    m = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)\n    print(k, round(m.inertia_, 1))",
  hint:"惯性总是随 k 增大而下降，肘部法找的是「下降速度明显变缓」的那个拐点。",
  hint_en:"Inertia always decreases with k; the elbow is where the decline suddenly flattens.",
  xp:40}
];
/* ---------- 深度学习篇 ---------- */
L["dl1"] = [
 {t:"用 NumPy 实现一个单层感知机",t_en:"A Single-layer Perceptron in NumPy",
  req:["实现前向计算、sigmoid 激活与梯度更新三步","在简单的二维二分类数据上训练到损失下降","把决策边界上的点标出来，验证分类效果"],
  req_en:["Implement forward pass, sigmoid activation and a gradient update","Train on a simple 2-D binary classification set until the loss drops","Mark the decision boundary and verify the classification"],
  starter:"import numpy as np\n\nX = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)\ny = np.array([0, 0, 0, 1], dtype=float)\nw = np.zeros(2); b = 0.0\nfor _ in range(5000):\n    z = X @ w + b\n    p = 1 / (1 + np.exp(-z))\n    g = p - y\n    w -= 0.5 * X.T @ g / len(X)\n    b -= 0.5 * g.mean()\nprint((p > 0.5).astype(int))",
  hint:"这就是 AND 门，单层感知机可以解决线性可分问题（XOR 则不行，需要隐藏层）。",
  hint_en:"This is the AND gate; a single layer handles linearly separable tasks, XOR needs a hidden layer.",
  xp:40},
 {t:"对比三种激活函数的形状与导数",t_en:"Comparing Three Activation Functions",
  req:["在一个区间上绘制或打印 sigmoid、tanh、ReLU 的取值","同时打印它们的导数，找出零点与饱和区","说明为什么隐藏层默认选 ReLU 而不是 sigmoid"],
  req_en:["Print or plot sigmoid, tanh and ReLU over a range","Print their derivatives and locate zeros and saturation regions","Explain why ReLU is the default for hidden layers"],
  starter:"import numpy as np\nx = np.linspace(-3, 3, 7)\nprint(\"sigmoid\", np.round(1 / (1 + np.exp(-x)), 3))\nprint(\"tanh   \", np.round(np.tanh(x), 3))\nprint(\"relu   \", np.round(np.maximum(0, x), 3))\nprint(\"tanh'\", np.round(1 - np.tanh(x) ** 2, 3))",
  hint:"sigmoid 与 tanh 在两端导数趋近 0，多层叠加后梯度连乘会迅速消失，ReLU 正区间导数恒为 1。",
  hint_en:"Sigmoid and tanh saturate at both ends, so stacked layers kill gradients; ReLU keeps derivative 1 on the positive side.",
  xp:40}
];
L["dl2"] = [
 {t:"用 PyTorch 手写一个线性回归训练循环",t_en:"A PyTorch Linear Regression Loop",
  req:["用 torch 张量构造数据与参数，手写前向、损失、反向、更新四步","每 100 步打印一次 loss，确认持续下降","解释为什么每步都要先 zero_grad"],
  req_en:["Build tensors for data and parameters and hand-write forward, loss, backward and update","Print the loss every 100 steps and confirm it decreases","Explain why zero_grad must be called each step"],
  starter:"import torch\n\nX = torch.arange(1., 6.)\ny = 2 * X + 1\nw = torch.zeros(1, requires_grad=True)\nb = torch.zeros(1, requires_grad=True)\nopt = torch.optim.SGD([w, b], lr=0.02)\nfor i in range(1000):\n    loss = ((w * X + b - y) ** 2).mean()\n    opt.zero_grad(); loss.backward(); opt.step()\n    if i % 200 == 0: print(i, round(loss.item(), 4))\nprint(w.item(), b.item())",
  hint:"backward 会把梯度累加到 .grad 上，所以每步必须先 zero_grad 清零。",
  hint_en:"backward accumulates into .grad, so zero_grad must clear it each step.",
  xp:40},
 {t:"用 nn.Module 组织一个两层分类网络",t_en:"A Two-layer Classifier as nn.Module",
  req:["定义继承 nn.Module 的类，包含两个 Linear 层与激活函数","写训练循环并打印每个 epoch 的训练损失与准确率","保存模型参数到文件并重新加载，验证预测一致"],
  req_en:["Define a class subclassing nn.Module with two Linear layers and an activation","Write the training loop printing loss and accuracy per epoch","Save the parameters, reload them and verify identical predictions"],
  starter:"import torch\nimport torch.nn as nn\n\nclass Net(nn.Module):\n    def __init__(self, d_in, d_hidden, d_out):\n        super().__init__()\n        self.fc1 = nn.Linear(d_in, d_hidden)\n        self.fc2 = nn.Linear(d_hidden, d_out)\n\n    def forward(self, x):\n        return self.fc2(torch.relu(self.fc1(x)))\n\nnet = Net(4, 8, 2)\nprint(sum(p.numel() for p in net.parameters()))",
  hint:"forward 里不要调用 softmax，CrossEntropyLoss 内部已包含 log_softmax，重复会算错。",
  hint_en:"Do not apply softmax in forward: CrossEntropyLoss already includes log_softmax.",
  xp:40}
];
L["dl3"] = [
 {t:"观察卷积核与特征图尺寸变化",t_en:"Watching Kernels and Feature Map Sizes",
  req:["用 nn.Conv2d 对一张随机图片做卷积，打印输入与输出的形状","改变 kernel_size、stride、padding，用公式核对输出尺寸","堆两个卷积层与一个池化层，列出每层输出的形状"],
  req_en:["Convolve a random image with nn.Conv2d and print input and output shapes","Vary kernel_size, stride and padding and verify with the size formula","Stack two convolutions and a pooling layer and list each output shape"],
  starter:"import torch\nimport torch.nn as nn\n\nx = torch.randn(1, 3, 32, 32)\nc = nn.Conv2d(3, 8, kernel_size=3, stride=1, padding=1)\ny = c(x)\nprint(x.shape, y.shape)\np = nn.MaxPool2d(2)\nprint(p(y).shape)",
  hint:"输出尺寸 = (输入 + 2×padding - kernel) / stride + 1，写代码前先算一遍能省很多调试时间。",
  hint_en:"Output size is (input + 2*padding - kernel)/stride + 1; computing it first saves debugging time.",
  xp:40},
 {t:"用迁移学习微调一个小图像分类器",t_en:"Fine-tuning with Transfer Learning",
  req:["加载预训练模型，替换最后一层为你的类别数","只训练新加的那一层，再解冻全部参数训练一轮比较效果","打印可训练参数数量占总参数的比例"],
  req_en:["Load a pretrained model and replace the final layer for your number of classes","Train only the new layer, then unfreeze everything for another epoch and compare","Print the share of trainable parameters"],
  starter:"import torch\nimport torch.nn as nn\nimport torchvision.models as models\n\nm = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)\nfor p in m.parameters():\n    p.requires_grad = False\nm.fc = nn.Linear(m.fc.in_features, 5)\ntrainable = sum(p.numel() for p in m.parameters() if p.requires_grad)\ntotal = sum(p.numel() for p in m.parameters())\nprint(trainable, round(trainable / total, 4))",
  hint:"冻结骨干只训练分类头，小数据集上又快又稳；需要时可再解冻最后几层做微调。",
  hint_en:"Freezing the backbone and training the head is fast and stable on small data; unfreeze a few layers later if needed.",
  xp:40}
];
L["dl4"] = [
 {t:"描述 RNN 的隐状态更新过程",t_en:"Describing the RNN Hidden State Update",mode:"text",
  req:["写出 h_t 与 h_{t-1}、x_t 的关系式，并说明各符号含义","针对一个 4 步序列手工推演一次隐状态的传播","说明普通 RNN 在长序列上会遇到什么问题、为什么"],
  req_en:["Write the relation between h_t, h_{t-1} and x_t and define each symbol","Manually propagate the hidden state across a four-step sequence","Explain what breaks in plain RNNs on long sequences and why"],
  starter:"# h_t = tanh(W_h h_{t-1} + W_x x_t + b)\n# 逐步推演：h_1 -> h_2 -> h_3 -> h_4\n# 反向传播时梯度连乘 -> 若系数 < 1 则梯度消失",
  hint:"梯度是连乘的，系数反复相乘会指数衰减或爆炸，这就是 LSTM 与门控机制要解决的问题。",
  hint_en:"Gradients multiply along the chain, decaying or exploding exponentially, which gating mechanisms address.",
  xp:45},
 {t:"用手写注意力算一次加权求和",t_en:"Hand-computing Attention Weights",mode:"text",
  req:["给定 3 个 Key 向量与 1 个 Query，手算点积相似度","对相似度做 softmax 得到权重，再对 Value 加权求和","用 NumPy 复核手算结果，说明缩放因子 1/sqrt(d) 的作用"],
  req_en:["Given three Key vectors and one Query, compute the dot-product similarities by hand","Apply softmax to get weights and compute the weighted sum of Values","Verify with NumPy and explain the role of the 1/sqrt(d) scaling factor"],
  starter:"import numpy as np\nQ = np.array([1, 0]); K = np.array([[1, 0], [0, 1], [1, 1]], dtype=float)\nV = np.array([[1, 0], [0, 1], [2, 2]], dtype=float)\ns = K @ Q\nw = np.exp(s) / np.exp(s).sum()\nprint(w, w @ V)",
  hint:"除以 sqrt(d) 是为了防止维度变大时点积过大、softmax 饱和导致梯度极小。",
  hint_en:"Dividing by sqrt(d) stops large dot products from saturating softmax and killing gradients.",
  xp:45}
];
L["dl5"] = [
 {t:"画出或描述 Transformer 的编码器结构",t_en:"Sketching the Transformer Encoder",mode:"text",
  req:["按输入顺序列出编码器一个 block 的内部模块（含残差与归一化）","标注多头注意力中 Q、K、V 的来源与形状变化","说明位置编码为什么必要、如果去掉会怎样"],
  req_en:["List the modules inside one encoder block in order, including residual and normalisation","Annotate where Q, K and V come from in multi-head attention and how shapes change","Explain why positional encoding is needed and what breaks without it"],
  starter:"# 输入 -> 位置编码 ->\n#   [多头自注意力 -> 残差+LayerNorm -> 前馈网络 -> 残差+LayerNorm] x N\n# Q/K/V 都来自同一输入序列（自注意力）\n# 去掉位置编码：注意力对顺序不敏感，词序信息丢失",
  hint:"自注意力本身是置换等变的，位置信息完全靠位置编码注入，这是它和 RNN 的关键差别。",
  hint_en:"Self-attention is permutation-equivariant, so order must be injected by positional encodings.",
  xp:45},
 {t:"对比 GPT 与 BERT 的预训练目标",t_en:"GPT vs BERT Pretraining Objectives",mode:"text",
  req:["分别写出 GPT 与 BERT 的预训练目标（下一词预测 / 掩码预测）","说明各自使用 Transformer 的哪一部分、注意力掩码有何不同","各举一个适合用它们的下游任务，并说明理由"],
  req_en:["Write out the pretraining objective of GPT (next-token) and BERT (masked prediction)","State which part of the Transformer each uses and how the attention mask differs","Give one downstream task suited to each and justify the choice"],
  starter:"# GPT: 解码器 + 因果掩码，只能看左侧 -> 生成/对话\n# BERT: 编码器 + 双向注意力，随机遮盖 15% -> 分类/抽取/匹配\n# 思考：为什么 BERT 不适合直接做长文本生成？",
  hint:"误差反向传播的目标不同决定能力不同：只能看左侧的模型适合生成，双向的模型擅长理解。",
  hint_en:"What the model may attend to decides its strength: left-only for generation, bidirectional for understanding.",
  xp:45}
];
/* ---------- AGI 前沿篇 ---------- */
L["agi1"] = [
 {t:"用 Q-learning 解一个网格世界",t_en:"Q-learning in a Grid World",
  req:["实现 4×4 网格：起点、终点、一步 -1 的奖励","用 Q-learning 迭代更新 Q 表，打印最优策略箭头","改变学习率与探索率，观察收敛速度差异"],
  req_en:["Implement a 4x4 grid with a start, a goal and a -1 step reward","Iterate Q-learning to fill the Q table and print the greedy policy as arrows","Vary learning rate and exploration and observe convergence speed"],
  starter:"import numpy as np\nn = 4\ngoal = (0, 3)\nQ = np.zeros((n, n, 4))\nacts = [(-1, 0), (1, 0), (0, -1), (0, 1)]\nfor _ in range(5000):\n    s = (3, 0)\n    for _ in range(50):\n        a = np.random.randint(4)\n        dr, dc = acts[a]\n        ns = (min(max(s[0] + dr, 0), n - 1), min(max(s[1] + dc, 0), n - 1))\n        r = 10 if ns == goal else -1\n        Q[s[0], s[1], a] += 0.1 * (r + 0.9 * Q[ns[0], ns[1]].max() - Q[s[0], s[1], a])\n        s = ns\nprint(Q[3, 0].round(2))",
  hint:"Q 表更新只用到一步经验，这就是时序差分；不停采样后它对最优价值的估计会逐步收敛。",
  hint_en:"The update uses one step of experience, which is temporal difference learning and converges with sampling.",
  xp:45},
 {t:"描述 RLHF 的三阶段流程",t_en:"Describing the Three Stages of RLHF",mode:"text",
  req:["写出 RLHF 的三个阶段：SFT、奖励模型训练、强化学习微调","说明每个阶段的输入输出数据分别是什么、来自哪里","指出 RLHF 相比纯 SFT 解决了什么问题、又带来了什么新风险"],
  req_en:["Write the three stages of RLHF: SFT, reward modelling, and RL fine-tuning","State the input and output data of each stage and where it comes from","Explain what RLHF solves versus pure SFT and what new risks it introduces"],
  starter:"# 1) SFT：人类示范 -> 有监督微调\n# 2) RM：对同一 prompt 的多个回答排序 -> 训练打分模型\n# 3) RL：用 RM 当奖励，做 PPO 等策略优化\n# 风险：奖励黑客、对齐税、标注偏见",
  hint:"奖励模型只是人类偏好的代理，模型可能学会「讨好打分器」而不是真正有用，这就是奖励黑客。",
  hint_en:"The reward model is only a proxy for human preference, so the policy may game the scorer instead of being helpful.",
  xp:45}
];
L["agi2"] = [
 {t:"设计一个可落地的 RAG 流程",t_en:"Designing a Practical RAG Pipeline",mode:"text",
  req:["写出 RAG 的完整链路：切分、嵌入、检索、重排、拼接、生成","为每一步指定输入输出与失败时的降级策略","说明如何评估这套 RAG 的效果（检索命中率、答案忠实度）"],
  req_en:["Write the full RAG chain: chunking, embedding, retrieval, reranking, prompt assembly, generation","Specify input, output and a fallback for each step","Explain how to evaluate it with retrieval hit rate and answer faithfulness"],
  starter:"# 切分：按语义/长度分块（重叠 10%~20%）\n# 嵌入：向量化入库\n# 检索：top-k 相似度\n# 重排：cross-encoder 精排\n# 生成：带引用约束的 prompt\n# 评估：召回率 + 忠实度 + 无答率",
  hint:"没有评估指标的 RAG 只能靠感觉调参，先把召回率与忠实度两个指标定下来。",
  hint_en:"Without metrics RAG tuning is guesswork; define retrieval recall and answer faithfulness first.",
  xp:45},
 {t:"用提示词工程改进一次问答质量",t_en:"Improving Answers with Prompt Engineering",
  req:["对同一个问题分别用「直接提问」「角色设定」「思维链」三种提示词各问一次","对比三次答案的完整性、准确性与可核查性","设计一个含格式约束（如必须输出 JSON）的提示词并验证"],
  req_en:["Ask the same question with direct, role-based and chain-of-thought prompts","Compare completeness, accuracy and verifiability across the three answers","Design a prompt with a format constraint such as required JSON output and verify it"],
  starter:"# 版本一：直接提问\n# 版本二：你现在是一位资深审稿人，请…\n# 版本三：请一步步分析，先列出条件再给出结论\n# 版本四：只输出 JSON：{\"结论\": \"\", \"理由\": []}",
  hint:"思维链提升复杂推理，格式约束提升可解析性，两者常常一起用。",
  hint_en:"Chain-of-thought improves complex reasoning and format constraints improve parseability; combine them.",
  xp:45}
];
L["agi3"] = [
 {t:"设计一个带工具调用的 Agent 循环",t_en:"Designing an Agent Loop with Tools",mode:"text",
  req:["定义三种工具（查天气、算表达式、搜资料）的名称与参数模式","写出「思考-调用-观察-再思考」的循环终止条件","设计工具报错或超时时的重试与降级策略"],
  req_en:["Define three tools (weather, calculator, search) with their parameter schemas","Write the loop's termination condition for think-act-observe-rethink","Design retry and fallback when a tool errors or times out"],
  starter:"# 工具模式（示例）\n#   get_weather{city}\n#   calc{expr}\n#   search{query}\n# 循环：需要信息 -> 选工具 -> 观察结果 -> 更新计划\n# 终态：任务完成 / 达到最大步数 / 连续失败 2 次",
  hint:"工具描述与参数模式写清楚，模型才能正确选择；参数校验与超时保护必须放在工具侧。",
  hint_en:"Clear tool schemas drive correct selection, while validation and timeouts must live on the tool side.",
  xp:45},
 {t:"用 CLIP 思路做一次零样本图文匹配",t_en:"Zero-shot Image-text Matching with CLIP",mode:"text",
  req:["写出用文本 embedding 与图像 embedding 做匹配的完整步骤","说明「零样本」在这里具体指什么、为什么能成立","给出一段伪代码：构造候选标签、取最大相似度、输出类别"],
  req_en:["Write the full steps for matching text embeddings against image embeddings","Explain what zero-shot means here and why it works","Give pseudocode: build candidate labels, take the argmax similarity, output the class"],
  starter:"# 1) 为候选类别构造文本模板：\"a photo of a {label}\"\n# 2) 文本编码器得到文本向量，图像编码器得到图像向量\n# 3) 分别归一化后做点积得到相似度\n# 4) argmax 得到预测类别（未针对该任务训练过 = 零样本）",
  hint:"多模板取平均能明显提升鲁棒性，这是 CLIP 零样本分类的常用技巧。",
  hint_en:"Averaging several prompt templates noticeably improves robustness in CLIP zero-shot classification.",
  xp:45}
];
L["agi4"] = [
 {t:"做一次模型量化的效果评估",t_en:"Evaluating Model Quantisation",mode:"text",
  req:["列出量化的两种常见做法（训练后量化 / 量化感知训练）","记录量化前后模型体积、推理延迟与精度的变化","说明什么场景可以接受量化带来的精度损失"],
  req_en:["List two common approaches: post-training quantisation and quantisation-aware training","Record size, latency and accuracy before and after quantisation","Explain when the accuracy drop is acceptable"],
  starter:"# 体积：FP32 -> INT8 理论缩小 4 倍\n# 延迟：通常下降，但需实测（受算子支持影响）\n# 精度：一般小幅下降，个别任务明显\n# 场景：端侧部署、高并发推理、成本敏感场景",
  hint:"量化收益必须在目标硬件上实测，理论压缩比与真实延迟差异常常很大。",
  hint_en:"Quantisation gains must be measured on the target hardware; theory and reality often diverge.",
  xp:45},
 {t:"制定一份可执行的 AGI 学习路线",t_en:"Writing an Actionable AGI Learning Plan",mode:"text",
  req:["按季度列出四个阶段目标，每阶段写清「做什么项目」而不是「学什么知识」","为每阶段规定一个可验证的交付物与自查标准","指定每周固定投入时间与遇到瓶颈时的求助路径"],
  req_en:["Lay out four quarterly goals, each phrased as a project rather than a topic","Give each stage a verifiable deliverable and a self-check criterion","Set a weekly time budget and a route for help when stuck"],
  starter:"# Q1 编程与数学打底 -> 交付：一个从零手写的线性回归 + 博客笔记\n# Q2 机器学习与数据 -> 交付：一个端到端数据集分析与建模项目\n# Q3 深度学习 -> 交付：复现一个小型 Transformer 并训练到收敛\n# Q4 AGI 前沿与工程 -> 交付：一个带评估的 RAG 或 Agent 小应用",
  hint:"把目标写成交付物，才能被检验、被展示，也才能形成可持续的正反馈。",
  hint_en:"Framing goals as deliverables makes them verifiable, showable and motivating.",
  xp:45}
];

  Object.keys(L).forEach(function (k) {
    window.AGI_LAB_EXTRA = window.AGI_LAB_EXTRA || {};
    window.AGI_LAB_EXTRA[k] = (window.AGI_LAB_EXTRA[k] || []).concat(L[k]);
  });
})();
