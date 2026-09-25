/* ================================================================
 * R0:hello agi · 课程深化层 ④（s5–s7）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把 s5 函数 / s6 数组与字符串 / s7 指针与引用 从「3 要点」深化到「6~7 要点」。
 * ★ id 与标题必须照抄主数据（本层只替换内容，不改标题）。
 * 五件套：quizAdd（每章 +3）、terms、minMap（全站遍历，由页面在深化合并后调用）。
 * ================================================================ */

const DEEPEN_AGENT_D = {
  stages: ["s5", "s6", "s7"],

  lessons: {

    /* ===== s5 函数 ===== */
    "5-1": {
      title: "函数的定义与调用", title_en: "Defining & Calling Functions", min: 12,
      summary: [
        "函数是「输入 → 处理 → 输出」的封装：参数是输入，返回值是输出，函数体是处理逻辑。",
        "定义三要素：返回类型 + 函数名 + 参数列表；调用时只需函数名和实参，编译器按签名匹配。",
        "函数必须「先声明后使用」——如果定义写在调用之后，需要在前面加一行原型声明（只有分号没有函数体）。",
        "函数名是动词短语（calcSum / printReport），一看就知道做什么；一个函数只做一件事，太长就拆。",
        "调用时发生「控制流跳转」：程序跳到函数体执行，遇到 return 或函数末尾就跳回调用处继续。",
        "实参和形参是两个变量：实参是调用者给的值，形参是函数内的副本（值传递时）——改形参不影响实参。",
        "函数越小越好测试：如果一个函数需要用「并且」才能描述完，就该拆了。"
      ,
        "衔接：本章假设你已经熟练使用 s4 的分支与循环——函数要做的，正是把这些判断和重复收进一个有名字、可测试的地方。"],
      summary_en: [
        "A function encapsulates input → processing → output: parameters are the input, the return value is the output, and the body is the logic.",
        "Three parts: return type + name + parameter list; the compiler matches calls by signature.",
        "Functions must be declared before use — if defined after the call site, add a prototype (signature with semicolon, no body).",
        "Name functions with verb phrases (calcSum / printReport); one function does one thing — split if too long.",
        "A call jumps control to the body; return or falling off the end jumps back to the caller.",
        "Arguments and parameters are different variables: the argument is what the caller provides, the parameter is a copy inside the function (for by-value).",
        "Smaller functions are easier to test: if you need 'and' to describe what a function does, split it."
      ,
        "Bridge: this chapter assumes you are comfortable with s4's branches and loops — a function is exactly where that repeated logic gets parked under a testable name."],
      code: "// 原型声明（定义在后面时必须有）\nint add(int a, int b);\n\nint main() {\n    int r = add(3, 5);       // 调用\n    std::cout << r;           // 8\n    return 0;\n}\n\n// 定义\nint add(int a, int b) {\n    return a + b;\n}",
      pit: "把函数定义写在 main 后面但忘了在前面加原型声明——编译器按顺序读代码，读到调用时还不认识这个名字，报「未声明的标识符」。",
      pit_en: "Defining a function after main without a prototype — the compiler reads top-down and reports an undeclared identifier at the call site.",
      ex: {
        q: "函数的「声明」和「定义」有什么区别？",
        a: "声明只有签名（告诉编译器这个名字存在）；定义有函数体（真正的实现）。声明可以有多次，定义只能有一次。",
        q_en: "What is the difference between a declaration and a definition?",
        a_en: "A declaration has only the signature (telling the compiler the name exists); a definition has the body. Declare many times, define once."
      }
    },

    "5-2": {
      title: "参数传递：值 vs 引用", title_en: "Passing by Value vs Reference",
      summary: [
        "值传递：函数收到的是实参的**副本**，函数内怎么改都不影响调用者——安全，但大对象会付出拷贝代价。",
        "引用传递：函数拿到的是实参本身的别名，修改直接影响调用者——高效且可以「带回来」结果。",
        "选型口诀：要改 → 引用/指针；只读大对象 → const 引用（不拷贝又保护数据）；小类型 → 值传递即可。",
        "引用参数的本质是「隐式指针」：编译器自动传地址，调用方写法与值传递一样——**既高效又好看**。",
        "需要在函数内修改调用者变量的典型场景：swap、填充结构体、读取输入到缓冲区。",
        "传数组时总是退化为指针（不拷贝），所以数组参数要额外传长度或用 std::vector / std::array 代替。"
      ],
      summary_en: [
        "By value: the function receives a **copy** of the argument; changes never affect the caller — safe but costly for large objects.",
        "By reference: the function gets an alias to the actual argument; modifications directly affect the caller — efficient and allows 'returning' results.",
        "Selection rule: modify → reference/pointer; read-only large object → const reference (no copy, data protected); small types → by value is fine.",
        "A reference parameter is essentially an implicit pointer: the compiler passes the address automatically, and the call site looks like by-value — efficient and readable.",
        "Typical modify-through-parameter scenarios: swap, filling a struct, reading input into a buffer.",
        "Arrays always decay to pointers (no copy), so pass the length too — or use std::vector / std::array instead."
      ],
      code: "void swap(int &a, int &b) {         // 引用传递：改的是原变量\n    int tmp = a; a = b; b = tmp;\n}\n\nvoid print(const std::string &s) {   // const 引用：只读 + 不拷贝\n    std::cout << s;\n}\n\nvoid byVal(int x) { x = 99; }        // 值传递：改的是副本\n\nint main() {\n    int a = 1, b = 2;\n    swap(a, b);                      // a=2, b=1\n    byVal(a);                        // a 不变\n}",
      pit: "想通过函数修改调用者的变量，却用了值传递——函数里改的是副本，调用者的值纹丝不动，而且编译器不报错。",
      pit_en: "Trying to modify the caller's variable via by-value passing silently modifies only the copy; the compiler does not warn.",
      ex: {
        q: "const 引用参数的好处是什么？",
        a: "既避免大对象的整体拷贝（高效），又承诺不修改数据（安全），还能接收临时对象。",
        q_en: "What are the benefits of a const reference parameter?",
        a_en: "No copy overhead, a promise not to modify, and it can accept temporaries."
      }
    },

    "5-3": {
      title: "返回值与 void", title_en: "Return Values & void",
      summary: [
        "return 做两件事：**把值带回调用处** + **结束函数执行**——return 之后的所有代码都不会执行。",
        "void 函数没有返回值，可以写 `return;` 提前退出（不带值），也可以省略（函数体结束自动返回）。",
        "返回类型必须与 return 表达式**兼容**（可隐式转换），否则编译器报错；返回类型写在函数名前面。",
        "返回局部变量的**值**是安全的（拷贝出去）；但返回局部变量的**指针或引用**是灾难——局部变量已销毁，指针悬空。",
        "结构体/类可以按值返回：现代编译器会做返回值优化（RVO），通常不产生额外拷贝。",
        "函数如果没有 return 语句，非 void 函数的行为是未定义的——编译器通常给警告，务必开启并处理。"
      ],
      summary_en: [
        "return does two things: **brings a value back to the caller** and **ends the function** — code after return never runs.",
        "void functions have no return value; `return;` exits early without a value, or omit it entirely.",
        "The return type must be **compatible** with the return expression (implicit conversion allowed), declared before the function name.",
        "Returning a local variable **by value** is safe (copied out); returning a **pointer or reference** to a local is a disaster — the local is destroyed, the pointer dangles.",
        "Structs/classes can be returned by value: modern compilers apply RVO, usually with no extra copy.",
        "A non-void function without a return statement is undefined behaviour — enable compiler warnings and fix them."
      ],
      code: "int max(int a, int b) {\n    return (a > b) ? a : b;\n    // 这里的代码永远不会执行\n}\n\nvoid greet() {\n    std::cout << \"Hello\";\n    // void 可以不写 return，或写 return; 提前退出\n}\n\n// ✗ 返回局部变量的引用\n// int& bad() { int x = 1; return x; }  // 悬空引用",
      pit: "返回局部变量的指针或引用——函数返回后局部变量销毁，指针指向已回收的内存，后续读取是未定义行为。",
      pit_en: "Returning a pointer or reference to a local variable — the variable is destroyed on return, and reading it later is undefined behaviour.",
      ex: {
        q: "为什么「返回局部变量的值」安全而「返回局部变量的引用」危险？",
        a: "按值返回会拷贝一份数据出去，调用方拿到的与局部变量无关；返回引用只是传了地址，局部变量销毁后地址无效。",
        q_en: "Why is returning a local by value safe but by reference dangerous?",
        a_en: "By value copies out; by reference passes the address, which dangles once the local is destroyed."
      }
    },

    "5-4": {
      title: "函数重载", title_en: "Function Overloading",
      summary: [
        "同名函数可以有多个版本，只要**参数列表不同**（参数个数或类型）——编译器根据调用时的实参自动匹配。",
        "重载解决的是「同一操作、不同类型」的场景：print(int) / print(double) / print(string) 比 printInt / printDouble / printStr 更直观。",
        "**返回类型不能作为重载依据**：int f() 和 double f() 不构成重载，编译器报错。",
        "匹配规则：先找精确匹配，再找提升匹配（int→double），再找标准转换——如果多个版本都「同样好」，编译器报二义性错误。",
        "重载 + 默认参数要小心：add(int, int) 和 add(int, int, int = 0) 同时存在，调 add(1,2) 时编译器不知道该调哪个。",
        "C++11 的 `= delete` 可以显式禁止某个重载版本被调用——例如禁止用 double 调用本应只接受 int 的函数。"
      ],
      summary_en: [
        "Same-named functions can have multiple versions as long as the **parameter list differs** (count or type); the compiler matches by actual arguments.",
        "Overloading solves 'same operation, different types': print(int) / print(double) / print(string) is more intuitive than printInt / printDouble / printStr.",
        "**Return type alone cannot distinguish overloads**: int f() and double f() are a compile error.",
        "Matching: exact match first, then promotions (int→double), then standard conversions — if multiple are 'equally good' the compiler reports ambiguity.",
        "Overloads + default parameters can clash: add(int,int) and add(int,int,int=0) together make add(1,2) ambiguous.",
        "C++11 `= delete` explicitly forbids calling a version — e.g. forbid double for an int-only function."
      ],
      code: "void print(int v)    { std::cout << v; }\nvoid print(double v) { std::cout << v; }\nvoid print(const char *v) { std::cout << v; }\n\n// ✗ 返回类型不同不构成重载\n// int calc(int x) { return x; }\n// double calc(int x) { return x; }",
      pit: "以为「参数名不同」或「返回类型不同」就构成重载——都不行！重载的唯一依据是参数列表（个数或类型）。",
      pit_en: "Thinking different parameter names or return types constitute overloads — neither works; only the parameter list counts.",
      ex: {
        q: "为什么返回类型不能作为重载依据？",
        a: "调用时可以不接收返回值（如单独一行 f(x)），编译器此时无法从上下文推断你要哪个返回类型，所以返回类型不参与重载解析。",
        q_en: "Why can't return types distinguish overloads?",
        a_en: "Calls can ignore the return value (a bare f(x) statement), so the compiler cannot infer which return type you meant."
      }
    },

    "5-5": {
      title: "默认参数", title_en: "Default Parameters",
      summary: [
        "默认参数让调用方「少传几个也没事」：`void greet(std::string name, int times = 1)` 调 greet(\"Tom\") 时 times 自动取 1。",
        "默认值只能从**右往左**连续给：可以 void f(int a, int b = 2, int c = 3)，不能 void f(int a = 1, int b)——后者跳过了 b。",
        "默认值写在**声明**（头文件）里，定义（源文件）里**不重复写**——重复写是编译错误。",
        "默认值应该是「90% 的调用都用它」的值：如果调用方有一半要传非默认值，说明这个默认值选错了。",
        "默认参数与函数重载配合：有时候用两个重载比一个带默认参数的函数更清晰。",
        "调用时不能跳过中间的参数直接给后面的：greet(\"Tom\", , 3) 语法不允许——只能从左往右连续省略。"
      ],
      summary_en: [
        "Default parameters let callers omit trailing arguments: `void greet(std::string name, int times = 1)` — greet(\"Tom\") uses times = 1.",
        "Defaults must fill from **right to left**: f(int a, int b = 2, int c = 3) is fine, but f(int a = 1, int b) skips b and is illegal.",
        "Write defaults in the **declaration** (header), not the **definition** (source) — repeating them is a compile error.",
        "The default should be the value used by 90% of callers: if half the calls pass non-default values, the default is wrong.",
        "Default parameters vs overloads: sometimes two overloads are clearer than one function with defaults.",
        "You cannot skip a middle argument: greet(\"Tom\", , 3) is not allowed — omission is strictly left-to-right."
      ],
      code: "void greet(std::string name, int times = 1, bool loud = false) {\n    for (int i = 0; i < times; ++i)\n        std::cout << (loud ? \"HELLO \" : \"Hello \") << name;\n}\n\ngreet(\"Tom\");               // Hello Tom\ngreet(\"Ann\", 2);            // Hello Ann Hello Anngreet(\"Bob\", 1, true);      // HELLO Bob",
      pit: "默认参数不连续（中间的没给默认值，后面的给了）——编译器直接报错，但报错信息可能不够直观。",
      pit_en: "Non-continuous defaults (a middle parameter lacks a default while a later one has one) is a compile error.",
      ex: {
        q: "为什么默认值要「从右往左」连续？",
        a: "因为调用时省略参数只能从右往左；如果中间有参数没有默认值，编译器无法确定调用时省略的是哪个参数。",
        q_en: "Why must defaults fill right-to-left?",
        a_en: "Callers omit from the right; if a middle parameter lacks a default, the compiler cannot resolve which argument was omitted."
      }
    },

    "5-6": {
      title: "递归", title_en: "Recursion",
      summary: [
        "递归是函数调用自己：把大问题拆成结构相同的子问题，直到子问题小到可以直接回答（**终止条件**）。",
        "递归的两个必要条件：**终止条件**（防止无限递归）+ **递推关系**（f(n) 与 f(n-1) 的关系）——缺一就是栈溢出。",
        "每次递归调用都会在**调用栈**上压一个新的栈帧（参数、局部变量），递归太深会耗尽栈空间（默认约 1~8MB）。",
        "适合递归的场景：树/嵌套结构遍历、分治（归并排序、二分）、数学定义本身就是递归的（阶乘、斐波那契）。",
        "尾递归（递归调用是函数的最后一个操作）理论上可被编译器优化成循环，但 C++ 编译器不保证做——深度递归应改为迭代。",
        "递归的常见坑：忘记写终止条件、终止条件写错（差一）、重复计算（如朴素斐波那契的指数级复杂度——用记忆化或改为迭代解决）。"
      ],
      summary_en: [
        "Recursion means a function calling itself: break a big problem into same-shaped sub-problems until they are trivial (**base case**).",
        "Two requirements: a **base case** (prevents infinite recursion) and a **recursive relation** (how f(n) relates to f(n-1)) — miss either and the stack overflows.",
        "Each recursive call pushes a **stack frame** (parameters, locals); deep recursion exhausts the stack (typically 1–8MB).",
        "Good fits: tree/nested traversal, divide-and-conquer (merge sort, binary search), problems defined recursively (factorial, Fibonacci).",
        "Tail recursion (the recursive call is the last operation) can theoretically become a loop, but C++ compilers do not guarantee it — convert deep recursion to iteration.",
        "Common pitfalls: forgetting the base case, off-by-one in the base case, and redundant computation (naive Fibonacci is exponential — memoise or iterate)."
      ],
      code: "int factorial(int n) {\n    if (n <= 1) return 1;           // 终止条件\n    return n * factorial(n - 1);    // 递推\n}\n// factorial(5) = 5 * 4 * 3 * 2 * 1 = 120",
      pit: "终止条件写成了 n == 0 但调用时传了负数——永远达不到终止条件，栈溢出崩溃；应该写 n <= 1 做防御。",
      pit_en: "Writing the base case as n == 0 but calling with a negative number — the base case is never reached, causing a stack overflow; use n <= 1 defensively.",
      ex: {
        q: "递归的「终止条件」为什么叫终止条件而不是结束条件？",
        a: "它不是让函数结束，而是让递归「不再继续展开」——到达这个条件后函数开始逐层返回，就像拉上了一根线的最后一环。",
        q_en: "Why is the base case called a base case rather than an end condition?",
        a_en: "It stops further expansion and starts the unwinding — the recursion returns layer by layer from that point."
      }
    },

    "5-7": {
      title: "作用域与存储周期", title_en: "Scope & Storage Duration",
      summary: [
        "**作用域**决定名字在哪里可见：局部作用域（花括号内）、全局作用域（文件级）、类作用域、命名空间作用域。",
        "**存储周期**决定变量活多久：自动存储（栈上，出作用域销毁）、静态存储（程序整个生命周期）、动态存储（堆，手动管理）。",
        "局部变量默认自动存储：每次进入作用域重新创建、退出销毁——两次调用之间值不保留。",
        "**static 局部变量**只在首次进入时初始化一次，之后每次调用保留上次的值——用它做计数器或缓存，不需要全局变量。",
        "全局变量在程序启动时创建、结束时销毁，所有函数可见——但过多全局变量会让函数之间的依赖变得隐晦且难以测试。",
        "内层作用域的同名变量会**遮蔽**外层的——编译器通常不警告，排查 bug 时要留意到底在用哪个变量。"
      ],
      summary_en: [
        "**Scope** determines where a name is visible: local (inside braces), global (file-level), class scope, namespace scope.",
        "**Storage duration** determines how long a variable lives: automatic (stack, destroyed at scope exit), static (program lifetime), dynamic (heap, manual).",
        "Locals default to automatic storage: recreated on entry, destroyed on exit — values do not persist between calls.",
        "**static locals** initialise only on first entry and persist across calls — good for counters or caches without globals.",
        "Globals are created at program start and destroyed at exit, visible to all functions — but too many make implicit dependencies and testing hard.",
        "A same-named variable in an inner scope **shadows** the outer one — compilers usually do not warn; watch for it when debugging."
      ],
      code: "int counter() {\n    static int n = 0;     // 只初始化一次\n    return ++n;\n}\n\ncounter();  // 1\ncounter();  // 2\ncounter();  // 3\n\nint x = 10;               // 全局\nvoid f() { int x = 20;    // 局部，遮蔽全局\n    std::cout << x;       // 20\n    std::cout << ::x;     // 10（:: 访问全局）\n}",
      pit: "内层作用域定义了与外层同名的变量，以为自己在改外层的——实际上改的是内层的副本，退出后外层值不变。",
      pit_en: "Defining a same-named variable in an inner scope while thinking you are modifying the outer one — you are actually modifying the inner copy.",
      ex: {
        q: "static 局部变量与全局变量的区别是什么？",
        a: "static 局部变量只在本函数内可见（作用域受限），但生命周期与全局一样长；它兼具「持久」和「封装」两个好处。",
        q_en: "How does a static local differ from a global?",
        a_en: "A static local is visible only inside its function but lives as long as a global — persistence plus encapsulation."
      }
    },

    "5-8": {
      title: "inline 内联函数", title_en: "inline Functions",
      summary: [
        "inline 是给编译器的**建议**：把函数体在调用处展开（像宏一样），省去函数调用的开销（压栈、跳转、弹栈）。",
        "它适合**短小且频繁调用**的函数（如 getter、简单计算）；对大函数 inline 反而会让代码膨胀，通常被编译器拒绝。",
        "现代编译器比人更懂什么时候该内联：**开了优化（-O2）后，编译器会自动内联**合适的函数，不管你有没有写 inline。",
        "inline 函数的定义必须放在头文件里（每个使用它的编译单元都要看到完整定义），否则链接错误。",
        "inline 与宏的区别：宏是文本替换（不检查类型、有副作用风险），inline 是真正的函数（类型安全、可调试）。",
        "C++17 的 **inline 变量**：允许在头文件中定义变量而不会导致多重定义链接错误（以前只能用 static 变通）。"
      ],
      summary_en: [
        "inline is a **hint** to the compiler: expand the body at the call site (like a macro), saving call overhead (push, jump, pop).",
        "Best for **short, frequently called** functions (getters, simple math); inlining large functions bloats code and is usually rejected.",
        "Modern compilers know better: **with optimisation (-O2), suitable functions are inlined automatically** whether or not you write inline.",
        "inline function definitions must be in headers (every translation unit needs the full body), or you get link errors.",
        "inline vs macros: macros are textual substitution (no type checking, side-effect risks); inline is a real function (type-safe, debuggable).",
        "C++17 **inline variables**: define variables in headers without multiple-definition link errors (previously needed static workarounds)."
      ],
      code: "inline int square(int x) { return x * x; }\n// 调用 square(5) 展开为 5 * 5\n// 与宏的区别：\n#define SQUARE(x) ((x) * (x))     // 宏：不安全\n// SQUARE(a++) 展开为 ((a++) * (a++)) → a 被加两次！\n// inline 没有这个问题",
      pit: "以为写了 inline 编译器就一定会内联——编译器有自己的判断（函数太大、有递归、有虚调用都可能拒绝）；inline 只是一个建议。",
      pit_en: "Assuming inline forces inlining — the compiler may reject it for large, recursive or virtual functions; inline is only a hint.",
      ex: {
        q: "inline 函数与宏有什么本质区别？",
        a: "inline 是真正的函数（类型安全、参数只求值一次、可调试），宏是文本替换（不检查类型、副作用可能重复求值）。",
        q_en: "What is the essential difference between inline functions and macros?",
        a_en: "inline is a real function (type-safe, arguments evaluated once, debuggable); macros are textual substitution with all its pitfalls."
      }
    },

    "5-9": {
      title: "头文件与分文件编写", title_en: "Headers & Multi-file Projects",
      summary: [
        "头文件（.h/.hpp）放**声明**：函数原型、类定义、常量、模板——它是「这个模块能做什么」的说明书。",
        "源文件（.cpp）放**实现**：函数体、变量定义——它是「怎么做」的细节，编译后生成目标文件。",
        "头文件必须加 **include guard**（#ifndef / #define / #endif）或 `#pragma once`，防止被重复包含导致重定义错误。",
        "#include <> 用于系统头文件，#include \"\" 用于项目头文件——编译器搜索路径不同。",
        "头文件里不要写函数定义（inline 除外）和全局变量定义——否则多个源文件包含它时会报「重定义」链接错误。",
        "依赖方向要单向：A 的头文件包含 B 的头文件，B 就不要反过来包含 A——循环包含是编译时间爆炸和链接错误的常见来源。"
      ,
        "去向：s6 要把成批数据交给函数，数组和字符串会第一次逼你回答「传进去的到底是什么」。"],
      summary_en: [
        "Headers (.h/.hpp) hold **declarations**: prototypes, class definitions, constants, templates — the 'what can this module do' manual.",
        "Source files (.cpp) hold **implementations**: function bodies, variable definitions — the 'how' details, compiled into object files.",
        "Headers must have **include guards** (#ifndef/#define/#endif) or `#pragma once` to prevent redefinition from multiple inclusion.",
        "#include <> for system headers, #include \"\" for project headers — different search paths.",
        "Do not put function definitions (except inline) or global variable definitions in headers — multiple inclusion causes redefinition link errors.",
        "Keep dependencies one-way: if A's header includes B's, B must not include A — circular includes cause build-time explosions and link errors."
      ,
        "Next: s6 hands batches of data to functions, and arrays finally force the question 'what exactly got passed?'."],
      code: "// math_utils.h（头文件）\n#ifndef MATH_UTILS_H\n#define MATH_UTILS_H\n\nint add(int a, int b);\ndouble avg(const double *arr, int n);\n\n#endif\n\n// math_utils.cpp（源文件）\n#include \"math_utils.h\"\n\nint add(int a, int b) { return a + b; }\ndouble avg(const double *arr, int n) { /* ... */ }",
      pit: "头文件里忘了加 include guard——同一个头文件被多个源文件间接包含时，出现「重定义」链接错误，而且报错指向的是头文件第二行，很难定位。",
      pit_en: "Forgetting include guards causes 'redefinition' link errors when the header is included through multiple paths — and the error points to line 2 of the header, not the real cause.",
      ex: {
        q: "为什么头文件里只放声明不放定义？",
        a: "多个源文件包含同一个头文件时，如果头文件里有函数定义或全局变量定义，链接器会看到多份同名实体，报「重定义」错误。",
        q_en: "Why headers contain declarations but not definitions?",
        a_en: "Multiple source files including the same header with definitions produce multiple identical entities, causing 'redefinition' link errors."
      }
    },

    /* ===== s6 数组与字符串 ===== */
    "6-1": {
      title: "一维数组", title_en: "One-dimensional Arrays", min: 12,
      summary: [
        "数组是**同类型元素的连续存储**：类型 名[长度]，下标从 0 开始，最后一个元素是 名[长度-1]。",
        "数组大小必须在**编译期确定**（或用常量），不能是运行时的变量——需要动态大小请用 std::vector。",
        "初始化方式：int a[5] = {1,2,3,4,5}（全量）；int a[5] = {1,2}（剩余自动补 0）；int a[] = {1,2,3}（编译器自动推大小）。",
        "数组名在大多数表达式中**退化为指向首元素的指针**—— sizeof(数组名) 是例外，返回整个数组的字节数。",
        "数组没有边界检查：访问 a[5]（长度为 5 的数组）不会报编译错误，但结果是未定义行为——这是缓冲区溢出的根源。",
        "数组不能整体赋值或拷贝（a = b 不行），也不能直接比较——需要逐元素操作或改用 std::array / std::vector。",
        "传数组给函数时退化为指针，**丢失长度信息**——必须额外传长度参数，或改用 std::vector（自带 size()）。"
      ,
        "衔接：s5 让你能把逻辑写成函数，本章把成批数据交给它们——第一件事是发现数组当参数会丢掉长度。"],
      summary_en: [
        "An array is **contiguous storage of same-type elements**: type name[length], 0-indexed, last element at name[length-1].",
        "The size must be a **compile-time constant** (or constant expression); for runtime sizes use std::vector.",
        "Initialisation: int a[5] = {1,2,3,4,5} (full); int a[5] = {1,2} (rest zeroed); int a[] = {1,2,3} (size deduced).",
        "The array name **decays to a pointer** to the first element in most expressions — sizeof(arrayName) is the exception, giving total bytes.",
        "No bounds checking: a[5] on a length-5 array compiles silently but is undefined behaviour — the root of buffer overflows.",
        "Arrays cannot be assigned or copied as a whole (a = b is illegal) or compared directly — use element-wise ops or std::array / std::vector.",
        "Passing an array to a function decays to a pointer, **losing the length** — pass the size separately or use std::vector (has size())."
      ,
        "Bridge: s5 gave you functions; this chapter feeds them batches of data, starting with the discovery that an array parameter loses its length."],
      code: "int a[5] = {1, 2, 3, 4, 5};\nint b[]  = {10, 20, 30};       // 编译器推大小 = 3\nint c[5] = {0};                 // 全部初始化为 0\n\nstd::cout << sizeof(a) / sizeof(a[0]);  // 5（元素个数）\n// a[5] = 99;                  // ✗ 越界，未定义行为",
      pit: "访问越界的数组元素——编译器不报错、运行时可能不崩溃，但结果不可预测，甚至可能悄悄破坏相邻变量。",
      pit_en: "Out-of-bounds access compiles silently, may not crash, but corrupts adjacent variables unpredictably.",
      ex: {
        q: "为什么「数组名可以作为指针使用」但「sizeof(数组名) 不等于指针大小」？",
        a: "数组名在表达式中退化为指针（指向首元素），但 sizeof 是编译期操作，直接返回整个数组的字节数——这是语言标准的特殊规定。",
        q_en: "Why does the array name decay to a pointer but sizeof gives the array size?",
        a_en: "Decay happens in expressions, but sizeof is a compile-time operator returning the total array bytes by language rule."
      }
    },

    "6-2": {
      title: "多维数组", title_en: "Multi-dimensional Arrays", min: 10,
      summary: [
        "多维数组是「数组的数组」：int a[3][4] 表示 3 行 4 列，共 12 个元素，在内存中**按行优先连续排列**。",
        "初始化可分层：int a[2][3] = {{1,2,3},{4,5,6}}；也可以平铺 int a[2][3] = {1,2,3,4,5,6}（不推荐，可读性差）。",
        "遍历用嵌套循环：外层行、内层列；**内层循环遍历连续内存**（行优先），效率更高（缓存友好）。",
        "二维数组传给函数时必须指定列数：void f(int a[][4], int rows)——列数是类型的一部分，不能省略。",
        "多维数组的 sizeof：sizeof(a) = 总字节数，sizeof(a[0]) = 一行的字节数——可用它计算行列数。",
        "更灵活的替代方案：std::vector<std::vector<int>>（锯齿数组，每行长度可不同）或用一维数组手动模拟（index = row * cols + col）。"
      ],
      summary_en: [
        "A multi-dimensional array is an 'array of arrays': int a[3][4] = 3 rows × 4 columns, stored **row-major contiguous**.",
        "Initialise hierarchically: int a[2][3] = {{1,2,3},{4,5,6}}; or flat {1,2,3,4,5,6} (not recommended for readability).",
        "Traverse with nested loops: outer for rows, inner for columns — **the inner loop touches contiguous memory** (row-major, cache-friendly).",
        "Passing to a function requires the column count: void f(int a[][4], int rows) — the column count is part of the type.",
        "sizeof: sizeof(a) = total bytes; sizeof(a[0]) = one row — useful for computing dimensions.",
        "More flexible alternatives: std::vector<std::vector<int>> (jagged rows) or a 1D array with manual indexing (index = row * cols + col)."
      ],
      code: "int a[3][4] = {\n    { 1,  2,  3,  4},\n    { 5,  6,  7,  8},\n    { 9, 10, 11, 12}\n};\n\nfor (int i = 0; i < 3; ++i) {\n    for (int j = 0; j < 4; ++j)\n        std::cout << a[i][j] << \" \";\n    std::cout << \"\\n\";\n}",
      pit: "遍历多维数组时把内外循环写反——列优先遍历不连续内存，缓存命中率大幅下降，大数组时性能可能差 5~10 倍。",
      pit_en: "Swapping the nested loop order traverses non-contiguous memory, destroying cache locality — 5–10× slower for large arrays.",
      ex: {
        q: "为什么「行优先遍历」比「列优先遍历」快？",
        a: "多维数组按行优先连续存储，内层遍历列时内存地址是连续的，CPU 缓存命中率高；列优先跳行访问则每次都跨越缓存行。",
        q_en: "Why is row-major traversal faster than column-major?",
        a_en: "Row-major order touches contiguous addresses, keeping the cache warm; column-major jumps across cache lines."
      }
    },

    "6-3": {
      title: "C 风格字符串", title_en: "C-style Strings", min: 10,
      summary: [
        "C 风格字符串是**以 \\0 结尾的字符数组**：char s[] = \"hello\" 实际有 6 个元素（5 字符 + 1 个 \\0）。",
        "\\0（空字符）标记字符串结束——没有它，strlen 和 printf 会一直读到内存非法位置。",
        "常用函数（cstring 头文件）：strlen（长度，不含 \\0）、strcpy（复制）、strcat（拼接）、strcmp（比较，0 表示相等）。",
        "strcmp 的返回值含义：负数表示 s1 < s2，0 表示相等，正数表示 s1 > s2——**判断相等必须写 strcmp(a, b) == 0**，不能写 a == b（那是在比地址）。",
        "C 风格字符串的缺陷：必须手动管理大小（缓冲区溢出风险）、没有自动扩容、拼接效率低。",
        "现代 C++ 强烈推荐用 std::string 代替 C 风格字符串——自动管理内存、自动扩容、有丰富的成员函数。"
      ],
      summary_en: [
        "A C-style string is a **character array terminated by \\0**: char s[] = \"hello\" has 6 elements (5 chars + \\0).",
        "The \\0 (null terminator) marks the end — without it, strlen and printf read past the buffer into invalid memory.",
        "Common functions (cstring header): strlen (length, excluding \\0), strcpy (copy), strcat (concatenate), strcmp (compare, 0 means equal).",
        "strcmp returns negative if s1 < s2, 0 if equal, positive if s1 > s2 — **always test strcmp(a,b) == 0**, never a == b (that compares addresses).",
        "C-style string weaknesses: manual size management (buffer overflow risk), no auto-growth, inefficient concatenation.",
        "Modern C++ strongly prefers std::string — automatic memory, auto-growth, rich member functions."
      ],
      code: "char s1[] = \"hello\";           // 6 元素（含 \\0）\nchar s2[10];\nstrcpy(s2, s1);                 // 复制\nstrcat(s2, \" world\");           // 拼接\n\nif (strcmp(s1, \"hello\") == 0)   // ✓ 正确的比较\nif (s1 == \"hello\")              // ✗ 比较的是地址！",
      pit: "用 == 比较两个 C 风格字符串——比较的是数组首地址而不是内容，即使内容相同结果也是 false。",
      pit_en: "Using == on C-style strings compares addresses, not content — always false even for identical text.",
      ex: {
        q: "为什么 C 风格字符串需要 \\0 结尾？",
        a: "因为 C 语言不存储字符串长度；\\0 是唯一的「到此结束」标记，所有标准库函数（strlen/strcpy/printf）都依赖它确定边界。",
        q_en: "Why does a C-style string need \\0?",
        a_en: "C does not store the length; \\0 is the only end marker that strlen, strcpy and printf all rely on."
      }
    },

    "6-4": {
      title: "std::string 基础", title_en: "std::string Basics", min: 12,
      summary: [
        "std::string 是一个**动态管理字符的类**：自动分配内存、自动扩容、自动在末尾维护 \\0——不需要手动管理大小。",
        "初始化方式：std::string s = \"hello\"、std::string s(5, 'x')（5 个 x）、std::string s(s1)（拷贝）。",
        "基本操作：s.size() 或 s.length()（长度）、s.empty()（是否为空）、s[i] 或 s.at(i)（访问第 i 个字符，at 会做边界检查）。",
        "可以直接用 == / < / > 比较内容（按字典序），用 + 拼接，用 += 追加——这些操作对 C 风格字符串都要手动写函数。",
        "s.c_str() 返回 C 风格字符串指针（const char *），用于调用需要 C 字符串的旧接口——但指针在 string 修改后可能失效。",
        "std::string 的内存布局与 vector 类似：连续存储 + 容量与大小分离——有 reserve() 可以预分配避免反复扩容。"
      ],
      summary_en: [
        "std::string is a **class that dynamically manages characters**: auto-allocation, auto-growth, automatic \\0 maintenance.",
        "Initialisation: std::string s = \"hello\", std::string s(5, 'x') (5 x's), std::string s(s1) (copy).",
        "Basic ops: s.size() or s.length(), s.empty(), s[i] or s.at(i) (at performs bounds checking).",
        "Direct == / < / > compare content lexicographically, + concatenates, += appends — all require manual functions for C-style strings.",
        "s.c_str() returns a C-style pointer (const char *) for legacy APIs — but it may be invalidated by string modifications.",
        "Memory layout is like vector: contiguous + capacity vs size separation — reserve() pre-allocates to avoid repeated reallocation."
      ],
      code: "std::string s = \"hello\";\nstd::cout << s.length();         // 5\n\ns += \" world\";                   // 追加\ns[0] = 'H';                       // 修改第一个字符\n\nif (s == \"Hello world\")          // 内容比较\n    std::cout << \"match\";\n\nconst char *c = s.c_str();       // 传给 C 风格接口",
      pit: "调用 c_str() 后又修改了 string——C 风格指针可能已经失效（指向被释放的旧内存），继续使用是未定义行为。",
      pit_en: "Calling c_str() and then modifying the string invalidates the pointer — using it afterwards is undefined behaviour.",
      ex: {
        q: "std::string 相比 C 风格字符串最大的优势是什么？",
        a: "自动管理内存：不需要预估大小、不需要手动分配释放、拼接和比较都有现成操作——把精力从「内存管理」解放到「业务逻辑」。",
        q_en: "What is std::string's biggest advantage over C-style strings?",
        a_en: "Automatic memory management: no size estimation, no manual allocation, built-in concatenation and comparison."
      }
    },

    "6-5": {
      title: "string 常用操作", title_en: "Common String Operations",
      summary: [
        "查找：s.find(\"子串\") 返回首次出现的下标（找不到返回 string::npos）；rfind 从后往前找。",
        "截取：s.substr(pos, len) 从 pos 开始取 len 个字符；省略 len 则取到末尾。",
        "插入与删除：s.insert(pos, str) 在 pos 处插入、s.erase(pos, len) 删除、s.replace(pos, len, newStr) 替换。",
        "判断：s.starts_with(\"pre\")（C++20）、s.contains(\"sub\")（C++23）；旧版本用 s.find(...) == 0 代替 starts_with。",
        "遍历字符：for (char c : s) 逐字符处理；for (char &c : s) 可修改字符。",
        "分割字符串没有内置函数：需要手动写（find + substr 循环），或用 std::getline + istringstream。"
      ],
      summary_en: [
        "Search: s.find(\"sub\") returns the first index (string::npos if absent); rfind searches from the end.",
        "Substrings: s.substr(pos, len) takes len characters from pos; omit len to go to the end.",
        "Insert/erase/replace: s.insert(pos, str), s.erase(pos, len), s.replace(pos, len, newStr).",
        "Predicates: s.starts_with(\"pre\") (C++20), s.contains(\"sub\") (C++23); older code uses s.find(...) == 0 for starts_with.",
        "Character iteration: for (char c : s) reads; for (char &c : s) modifies.",
        "No built-in split: write it manually (find + substr loop) or use std::getline with istringstream."
      ],
      code: "std::string s = \"hello world\";\n\nauto pos = s.find(\"world\");           // 6\nif (pos != std::string::npos)\n    std::cout << s.substr(pos);        // \"world\"\n\ns.replace(0, 5, \"HELLO\");             // \"HELLO world\"\ns.erase(5);                            // \"HELLO\"\n\nint num = std::stoi(\"42\");             // 字符串 → int\nstd::string str = std::to_string(42);  // int → 字符串",
      pit: "find 返回 string::npos 时用 int 接收——npos 是无符号极大值，转成 int 会变成 -1，但如果后续和 string::npos 比较就不对了；应该用 auto 或 size_t 接收。",
      pit_en: "Storing find()'s result in an int truncates string::npos; use auto or size_t to preserve the sentinel value.",
      ex: {
        q: "string::npos 是什么？",
        a: "一个静态常量（类型为 size_t），表示「没找到」；它的值是 size_t 的最大值，所有合法下标都小于它——所以 find 的返回值用 npos 判断即可区分找到与没找到。",
        q_en: "What is string::npos?",
        a_en: "A static constant (size_t max) meaning 'not found'; every valid index is less than it, so comparing find() against npos distinguishes found from absent."
      }
    },

    "6-6": {
      title: "数字与字符串互转", title_en: "Number ↔ String Conversion",
      summary: [
        "字符串 → 数字（C++11 起首选）：std::stoi（int）、std::stol（long）、std::stof（float）、std::stod（double）。",
        "数字 → 字符串：std::to_string(42) 返回 \"42\"；std::to_string(3.14) 返回 \"3.140000\"（精度固定，需要格式控制请用 ostringstream）。",
        "旧方法（C 风格）：atoi / atof（出错返回 0，无法区分「真的是 0」和「解析失败」）；std::stoi 会抛异常，更容易正确处理。",
        "stringstream 万能转换：既能字符串→数字，也能数字→字符串，还能拼接多种类型——但性能不如专用函数。",
        "转换失败的处理：std::stoi 会抛 std::invalid_argument（不是数字）或 std::out_of_range（超出范围）——用 try-catch 捕获。",
        "格式化输出：ostringstream 配合 std::fixed / setprecision 控制小数位数，比 to_string 更灵活。"
      ,
        "去向：s7 正面讲地址与指针，上一节「数组退化成指针」留下的疑问在那里解开。"],
      summary_en: [
        "String → number (C++11 preferred): std::stoi (int), std::stol (long), std::stof (float), std::stod (double).",
        "Number → string: std::to_string(42) gives \"42\"; std::to_string(3.14) gives \"3.140000\" (fixed precision — use ostringstream for formatting).",
        "Legacy: atoi / atof return 0 on failure (cannot distinguish from a real 0); std::stoi throws exceptions for proper error handling.",
        "stringstream is universal: both directions plus mixed-type concatenation — but slower than dedicated functions.",
        "Failure handling: std::stoi throws std::invalid_argument (not a number) or std::out_of_range (too large) — catch with try-catch.",
        "Formatting: ostringstream with std::fixed / setprecision controls decimal places more flexibly than to_string."
      ,
        "Next: s7 tackles addresses and pointers head-on, which is where the array-decay question from this chapter gets answered."],
      code: "int a = std::stoi(\"42\");\ndouble d = std::stod(\"3.14\");\nstd::string s = std::to_string(100);\n\n// 带格式控制\nstd::ostringstream oss;\noss << std::fixed << std::setprecision(2) << 3.14159;\nstd::string formatted = oss.str();    // \"3.14\"\n\n// 安全转换\ntry { int x = std::stoi(\"abc\"); }\ncatch (const std::invalid_argument &e) { /* 不是数字 */ }",
      pit: "用 atoi 解析「abc」——它返回 0 而不报错，无法区分「真的是 0」和「解析失败」；用 std::stoi 并捕获异常。",
      pit_en: "atoi(\"abc\") returns 0 silently — indistinguishable from a real 0; use std::stoi with try-catch.",
      ex: {
        q: "std::stoi 和 atoi 的关键区别是什么？",
        a: "stoi 失败时抛异常（可捕获、可区分错误类型），atoi 失败时返回 0（静默、无法区分）；stoi 还能报告解析到哪个字符停止。",
        q_en: "Key difference between std::stoi and atoi?",
        a_en: "stoi throws on failure (catchable, typed); atoi silently returns 0 with no error signal."
      }
    },

    /* ===== s7 指针与引用 ===== */
    "7-1": {
      title: "内存地址与取地址 &", title_en: "Memory Addresses & Address-of (&)",
      summary: [
        "每个变量都存储在内存的某个位置，那个位置有一个**编号**——就是内存地址，用 & 运算符可以取到。",
        "&x 返回的是 x 的**地址**（类型为「指向 x 类型的指针」），不是 x 的值——这是理解指针的第一步。",
        "地址通常用十六进制表示（如 0x7ffd3b4a2c）；每次运行地址可能不同（操作系统随机化地址空间以提高安全性）。",
        "不同类型的变量占不同大小的内存：char 1 字节、int 通常 4 字节、double 通常 8 字节、指针在 64 位系统上通常 8 字节。",
        "& 对不同变量取到的地址差值反映了它们的大小：相邻 int 变量的地址通常差 4 字节。",
        "「指针就是一个存储地址的变量」——它本身也占内存（8 字节），也有自己的地址——这个「递归」是理解二级指针的关键。"
      ,
        "衔接：s6 里数组名已经悄悄变成了地址，本章把这件事讲透——地址、解引用、指针算术与生命周期。"],
      summary_en: [
        "Every variable lives at a **numbered location** in memory — its address, obtained with the & operator.",
        "&x returns x's **address** (typed as 'pointer to x's type'), not x's value — the first step to understanding pointers.",
        "Addresses display in hex (e.g. 0x7ffd3b4a2c); they may differ between runs due to address space randomisation.",
        "Different types occupy different sizes: char 1 byte, int typically 4, double typically 8, pointers typically 8 on 64-bit systems.",
        "Address differences between adjacent variables reflect their sizes: consecutive int variables are usually 4 bytes apart.",
        "'A pointer is a variable that stores an address' — it occupies memory (8 bytes) and has its own address — this recursion is the key to pointer-to-pointer."
      ,
        "Bridge: in s6 the array name already turned into an address; this chapter makes that explicit — addresses, dereferencing, pointer arithmetic and lifetime."],
      code: "int x = 42;\ndouble d = 3.14;\n\nstd::cout << &x;       // 0x7ffd...（地址，每次运行可能不同）\nstd::cout << &d;       // 另一个地址\n\n// 地址差值反映大小\nint y = 10;\nstd::cout << (&y - &x);   // 相差几个 int（1，如果相邻）",
      pit: "把 &x 的返回值当成 x 的值打印，看到一串十六进制数字以为是乱码——那其实是内存地址，是合法且有意义的。",
      pit_en: "Mistaking &x's output (a hex address) for garbage — it is a legitimate memory address.",
      ex: {
        q: "& 运算符返回的「地址」本质上是什么？",
        a: "就是一个无符号整数（内存编号），它唯一标识了变量在内存中的位置；指针变量就是存储这个整数的变量。",
        q_en: "What is an address, essentially?",
        a_en: "An unsigned integer (a memory location number) that uniquely identifies where a variable lives; a pointer stores that integer."
      }
    },

    "7-2": {
      title: "指针的定义与解引用 *", title_en: "Pointer Definition & Dereference (*)",
      summary: [
        "指针是「存储另一个变量地址的变量」：int *p = &x; 表示 p 存储了 x 的地址——通过 p 可以间接访问和修改 x。",
        "解引用（*p）是「跟随指针找到它指向的变量」——读写 *p 就是读写 x 本身，不是副本。",
        "定义时的 * 和使用时的 * 含义不同：int *p（* 表示 p 是指针类型）；*p = 10（* 表示解引用/跟随指针）。",
        "未初始化的指针（野指针）指向随机地址——解引用它是未定义行为，可能崩溃也可能悄悄破坏数据。",
        "空指针（nullptr）是「不指向任何对象」的指针——解引用空指针必然崩溃（通常是被操作系统终止），但它是**可检测的**（if (p) 判断）。",
        "初始化指针的最佳实践：**定义时就初始化**（指向已有变量或 nullptr），永远不要留一个未初始化的指针。"
      ],
      summary_en: [
        "A pointer is 'a variable that stores another variable's address': int *p = &x; — through p you indirectly access and modify x.",
        "Dereferencing (*p) means 'follow the pointer to the variable it points to' — reading or writing *p operates on x itself, not a copy.",
        "The * has different meanings in definition and use: int *p (p is a pointer type); *p = 10 (dereference/follow).",
        "An uninitialised pointer (wild pointer) points to a random address — dereferencing is undefined behaviour.",
        "A null pointer (nullptr) points to no object — dereferencing crashes, but it is **detectable** (if (p)).",
        "Best practice: **initialise pointers at definition** (to a valid variable or nullptr); never leave a pointer uninitialised."
      ],
      code: "int x = 42;\nint *p = &x;         // p 存储了 x 的地址\n\nstd::cout << *p;     // 42（解引用：跟随指针找到 x）\n*p = 100;            // 通过指针修改 x\nstd::cout << x;      // 100（x 被改了！）\n\nint *q = nullptr;    // 空指针\nif (q) { /* 安全检查 */ }",
      pit: "解引用未初始化的指针或空指针——程序可能立刻崩溃，也可能悄无声息地修改了无关数据（取决于操作系统和内存布局），后者更危险。",
      pit_en: "Dereferencing an uninitialised or null pointer — it may crash immediately or silently corrupt unrelated data; the silent case is worse.",
      ex: {
        q: "*p = 100 为什么能修改 x 的值？",
        a: "p 存储的是 x 的地址；*p 告诉编译器「去 p 指向的那个位置写入 100」，而那个位置就是 x 的内存——所以 x 变成了 100。",
        q_en: "Why does *p = 100 change x?",
        a_en: "p stores x's address; *p tells the compiler to write 100 at that address, which is x's memory — so x becomes 100."
      }
    },

    "7-3": {
      title: "指针与数组", title_en: "Pointers & Arrays",
      summary: [
        "数组名在大多数表达式中**退化为指向首元素的指针**：int a[5] 里 a 等价于 &a[0]——所以可以用指针遍历数组。",
        "a[i] 的本质就是 *(a + i)：下标运算符只是指针算术的语法糖——这解释了为什么数组下标从 0 开始。",
        "指针与数组的关键区别：sizeof(数组名) 返回整个数组的字节数，sizeof(指针) 返回 8（64 位）——退化的边界就在这里。",
        "数组传给函数时退化为指针，**丢失长度信息**——所以函数签名需要额外传长度，或者改为传 std::vector（自带 size）。",
        "指针可以指向数组的任意元素（不只是首元素）：int *p = &a[2]; 然后 p[0] 就是 a[2]。",
        "用指针遍历数组是底层高效的做法（for (int *p = a; p < a + 5; ++p)），但范围 for（for (int x : a)）更安全更现代。"
      ],
      summary_en: [
        "The array name **decays to a pointer to its first element** in most expressions: in int a[5], a ≡ &a[0] — enabling pointer-based traversal.",
        "a[i] is essentially *(a + i): the subscript operator is syntactic sugar for pointer arithmetic — explaining why indices start at 0.",
        "Key difference: sizeof(arrayName) returns total array bytes; sizeof(pointer) returns 8 (on 64-bit) — decay stops here.",
        "Arrays decay to pointers when passed to functions, **losing length info** — pass the size separately or use std::vector (has size()).",
        "A pointer can point to any element: int *p = &a[2]; then p[0] is a[2].",
        "Pointer-based traversal (for (int *p = a; p < a + 5; ++p)) is efficient but range-for (for (int x : a)) is safer and more modern."
      ],
      code: "int a[5] = {10, 20, 30, 40, 50};\nint *p = a;             // 退化为 &a[0]\n\nstd::cout << p[2];       // 30（等价于 *(p + 2) = a[2]）\nstd::cout << *(a + 3);   // 40（等价于 a[3]）\n\n// 遍历\nfor (int i = 0; i < 5; ++i)\n    std::cout << *(p + i);   // 10 20 30 40 50",
      pit: "以为传数组给函数时是按值拷贝的——实际退化为指针，函数内修改「数组元素」会直接影响原数组。",
      pit_en: "Assuming array parameters are copied by value — they decay to pointers, so modifications inside the function affect the original.",
      ex: {
        q: "数组名和指针有什么区别？",
        a: "数组名在表达式中退化为指针，但它本质上还是数组（sizeof 不同、不能重新赋值）；指针是独立的变量，可以重新指向。",
        q_en: "What is the difference between an array name and a pointer?",
        a_en: "The array name decays to a pointer but is still an array (sizeof differs, cannot reassign); a pointer is an independent variable."
      }
    },

    "7-4": {
      title: "指针算术", title_en: "Pointer Arithmetic",
      summary: [
        "指针加 1 不是地址加 1 字节，而是**加一个所指向类型的大小**——int *p 加 1，地址增加 4 字节；double *p 加 1，地址增加 8 字节。",
        "这就是为什么指针有类型：**类型决定了「步长」**——没有类型（void *）就无法进行算术运算。",
        "p + n 指向 p 后面第 n 个元素；p - n 指向前面第 n 个；p2 - p1 得到两个指针之间的**元素个数**（不是字节数）。",
        "两个指针相减只在它们指向**同一个数组**时才有意义——指向不同数组的指针相减是未定义行为。",
        "指针比较（<、>、==）也只在同一数组内有意义：比较地址的高低可以判断遍历是否越界。",
        "void * 是「无类型指针」：可以存储任何类型的地址，但不能解引用或做算术——通常用于底层内存操作函数（如 memcpy）的参数。"
      ],
      summary_en: [
        "Adding 1 to a pointer advances by **one element size**, not one byte — int *p advances 4 bytes, double *p advances 8.",
        "This is why pointers have types: **the type determines the step size** — void * cannot do arithmetic because the size is unknown.",
        "p + n points to the nth element after p; p - n to the nth before; p2 - p1 gives the **element count** between them (not bytes).",
        "Subtracting pointers is meaningful only within the **same array** — subtracting pointers to different arrays is undefined behaviour.",
        "Pointer comparison (<, >, ==) is also only meaningful within the same array: address order can detect traversal overflow.",
        "void * is a 'typeless pointer': it can store any address but cannot be dereferenced or incremented — used in low-level functions like memcpy."
      ],
      code: "int a[5] = {0, 10, 20, 30, 40};\nint *p = a;               // &a[0]\nint *q = p + 3;            // &a[3]\n\nstd::cout << *q;           // 30\nstd::cout << q - p;         // 3（相差 3 个元素）\n\np += 2;                     // 移到 a[2]\nstd::cout << *p;           // 20",
      pit: "对 void* 指针做算术运算——编译器不知道步长是多少，直接报错；需要先转换为具体类型再运算。",
      pit_en: "Doing arithmetic on void* — the step size is unknown; cast to a concrete type first.",
      ex: {
        q: "为什么 p+1 的实际地址增量取决于指针类型？",
        a: "p+1 的语义是「下一个元素」，不是「下一个字节」；编译器根据指针类型的大小自动乘以步长。",
        q_en: "Why does p+1's address increment depend on the pointer type?",
        a_en: "p+1 means 'the next element', not 'the next byte'; the compiler multiplies by the type's size."
      }
    },

    "7-5": {
      title: "引用（左值引用）", title_en: "References (Lvalue)",
      summary: [
        "引用是变量的**别名**：int &r = x; 之后 r 和 x 是同一个东西——改 r 就是改 x，取地址也相同。",
        "引用必须在**定义时初始化**，且**不能改绑**到另一个变量——一旦绑定终身不变（这是它和指针最大的区别）。",
        "引用没有「空引用」：它必须绑定到一个有效的变量——这消除了指针的空值问题，也更安全。",
        "引用作为函数参数是最常见的用法：void f(int &x) 让函数能修改调用者的变量，调用方写法与值传递一样自然。",
        "引用作为返回值：可以让函数出现在赋值号左边（arr[i] = 5 的本质就是 operator[] 返回引用）。",
        "引用本质上也是通过指针实现的（编译器层面），但语法上「隐藏」了指针操作——更安全、更简洁。"
      ],
      summary_en: [
        "A reference is an **alias** for a variable: after int &r = x, r and x are the same thing — modifying r modifies x, and their addresses are identical.",
        "References must be **initialised at definition** and **cannot rebind** — once bound, forever bound (the biggest difference from pointers).",
        "No 'null reference' exists: a reference must bind to a valid object — eliminating the null problem and making it safer than pointers.",
        "Reference parameters are the most common use: void f(int &x) lets the function modify the caller's variable, with natural call-site syntax.",
        "References as return values allow assignment to the return (arr[i] = 5 works because operator[] returns a reference).",
        "Under the hood references are implemented with pointers, but the syntax hides pointer operations — safer and cleaner."
      ],
      code: "int x = 10;\nint &r = x;       // r 是 x 的别名\n\nr = 20;            // x 变成 20\nstd::cout << x;     // 20\nstd::cout << &r;     // 和 &x 相同\n\n// ✗ 不能改绑\n// int y = 30;\n// r = &y;          // 这不是改绑，是把 y 的值赋给 x",
      pit: "以为 r = y 是「让 r 改绑到 y」——实际是把 y 的**值**赋给 r（也就是赋给 x），r 从始至终绑定的是 x。",
      pit_en: "Thinking r = y rebinds r to y — it actually assigns y's **value** to r (and thus to x); r is bound to x forever.",
      ex: {
        q: "引用和指针的三个关键区别是什么？",
        a: "①引用必须初始化，指针可以先声明后赋值；②引用不能改绑，指针可以重新指向；③引用没有空值，指针可以是 nullptr。",
        q_en: "Three key differences between references and pointers?",
        a_en: "References must be initialised (pointers can wait), cannot rebind (pointers can re-point), and have no null state (pointers can be nullptr)."
      }
    },

    "7-6": {
      title: "const 与指针/引用", title_en: "const with Pointers & References",
      summary: [
        "const 和指针组合有三种形式：**指向常量的指针**（const int *p，不能通过 p 改值但可以改 p 的指向）、**常量指针**（int *const p，p 不能改指向但可以改值）、**两者都常**（const int *const p）。",
        "记忆技巧：**const 在 \* 左边修饰「值」，const 在 \* 右边修饰「指针本身」**。",
        "指向 const 的指针可以接收非 const 变量的地址——这是安全的（只是承诺不通过这个指针改）。",
        "const 引用（const int &r）是最常见的参数传递方式：不拷贝、不修改、还能接收临时对象。",
        "const 成员函数的 this 指针是 const 的——所以不能修改成员变量（除非成员声明为 mutable）。",
        "从非 const 到 const 是安全转换（加限制），从 const 到非 const 需要显式 const_cast（通常是设计问题的信号）。"
      ],
      summary_en: [
        "Three pointer-const combinations: **pointer to const** (const int *p — cannot modify value through p, can re-point), **const pointer** (int *const p — cannot re-point, can modify value), **both const** (const int *const p).",
        "Mnemonic: **const to the left of * protects the value; const to the right of * protects the pointer itself**.",
        "A pointer-to-const can accept the address of a non-const variable — safe (just a promise not to modify through it).",
        "Const references (const int &r) are the most common parameter form: no copy, no modification, and they accept temporaries.",
        "In a const member function, this is a const pointer — members cannot be modified (unless declared mutable).",
        "Adding const (non-const → const) is safe; removing it requires const_cast — usually a design smell."
      ],
      code: "int x = 10, y = 20;\nconst int *p1 = &x;      // 指向常量：*p1 不能改\n// *p1 = 99;             // ✗ 编译错误\np1 = &y;                  // ✓ 可以改指向\n\nint *const p2 = &x;       // 常量指针：p2 不能改指向\n*p2 = 99;                  // ✓ 可以改值\n// p2 = &y;               // ✗ 编译错误\n\nconst int *const p3 = &x; // 两者都不能改",
      pit: "const 位置记混：把 const int *p 和 int *const p 弄反——前者不能改值但能改指向，后者能改值但不能改指向。",
      pit_en: "Mixing up const int *p and int *const p — the former protects the value, the latter protects the pointer itself.",
      ex: {
        q: "为什么「函数参数用 const 引用」是最常见的传递方式？",
        a: "它同时满足三个需求：不拷贝（高效）、不修改（安全）、能接收临时对象（灵活）——这是 const 引用独有的组合优势。",
        q_en: "Why is const reference the most common parameter form?",
        a_en: "It satisfies three needs simultaneously: no copy (efficient), no modification (safe), and accepts temporaries (flexible)."
      }
    },

    "7-7": {
      title: "动态内存 new / delete", title_en: "Dynamic Memory: new / delete",
      summary: [
        "栈上的变量大小和生命周期固定（编译期确定）；**堆**上的内存由程序员手动管理：new 分配，delete 释放。",
        "new 做两件事：**分配内存** + **调用构造函数**（对类类型）；delete 做两件事：**调用析构函数** + **释放内存**。",
        "new 返回**指针**（堆内存的地址），不是对象本身——通过解引用或 -> 来使用。",
        "new[] 分配数组，必须用 **delete[]** 释放（不是 delete）——混用是未定义行为。",
        "忘记 delete → 内存泄漏（程序运行越久占用越多）；重复 delete → 崩溃；delete 栈上变量 → 崩溃。",
        "现代 C++ 的核心原则：**尽量不用裸 new/delete**——用 std::vector、std::string、std::unique_ptr 等 RAII 类型自动管理。"
      ],
      summary_en: [
        "Stack variables have fixed size and lifetime (compile-time); **heap** memory is managed manually: new allocates, delete frees.",
        "new does two things: **allocate memory** + **call the constructor** (for classes); delete: **call the destructor** + **free memory**.",
        "new returns a **pointer** (the heap address), not the object itself — use via dereference or ->.",
        "new[] allocates arrays and must be freed with **delete[]** (not delete) — mixing them is undefined behaviour.",
        "Forgetting delete → memory leak (growing footprint); double delete → crash; deleting a stack variable → crash.",
        "The core modern C++ principle: **avoid raw new/delete** — use RAII types (std::vector, std::string, std::unique_ptr) for automatic management."
      ],
      code: "int *p = new int(42);        // 单个 int\nint *arr = new int[10];       // 数组\n\n*p = 100;\narr[0] = 1;\n\ndelete p;                      // 释放单个\ndelete[] arr;                   // 释放数组（注意 []）\n\n// 现代 C++ 替代\nauto up = std::make_unique<int>(42);   // 自动释放\nauto vec = std::vector<int>(10);       // 自动管理",
      pit: "new[] 分配数组但用 delete 释放（没有 []）——对于含析构函数的类类型，只析构第一个元素，其余的析构函数不会被调用，资源泄漏。",
      pit_en: "Allocating with new[] but freeing with delete (no []) — only the first element's destructor runs, leaking resources for the rest.",
      ex: {
        q: "为什么说「尽量不用裸 new/delete」？",
        a: "裸 new/delete 需要人工配对，忘记或异常路径漏掉就泄漏；RAII 类型（vector/string/智能指针）自动管理，从结构上消除泄漏的可能。",
        q_en: "Why avoid raw new/delete?",
        a_en: "Manual pairing is error-prone; RAII types manage automatically, structurally eliminating leaks."
      }
    },

    "7-8": {
      title: "内存泄漏与悬空指针", title_en: "Memory Leaks & Dangling Pointers",
      summary: [
        "内存泄漏 = new 了但没 delete——程序运行越久占用越多，最终耗尽内存；泄漏的内存**无法回收**直到进程结束。",
        "悬空指针 = delete 之后继续使用指针——指针存储的地址已经被释放，读取或写入是未定义行为（可能崩溃也可能静默破坏数据）。",
        "两者的关系：delete 后置空指针可以避免悬空使用，但如果忘了 delete 则是泄漏——所以不能只靠「记得 delete」来同时解决两个问题。",
        "异常是泄漏的常见原因：new 之后如果抛异常，delete 就不会执行——用 RAII（智能指针/容器）可以从结构上解决。",
        "检测工具：AddressSanitizer（编译选项 -fsanitize=address）、Valgrind——开发阶段定期跑，不要等到上线后。",
        "现代 C++ 的解决方案：**std::unique_ptr**（独占所有权，自动释放）、**std::shared_ptr**（共享所有权，引用计数）——用这些替代裸指针，泄漏和悬空问题从结构上消失。"
      ],
      summary_en: [
        "Memory leak = allocated but never freed — the program grows until memory is exhausted; leaked memory **cannot be reclaimed** until process exit.",
        "Dangling pointer = using a pointer after its target was freed — reading or writing is undefined behaviour (may crash or silently corrupt).",
        "Their relationship: nulling after delete prevents dangling use, but forgetting delete causes leaks — 'remember to delete' cannot solve both.",
        "Exceptions are a common cause: new followed by a throw skips delete — RAII (smart pointers/containers) solves this structurally.",
        "Detection tools: AddressSanitizer (-fsanitize=address), Valgrind — run during development, not after launch.",
        "Modern C++ solution: **std::unique_ptr** (exclusive, auto-free), **std::shared_ptr** (shared, reference-counted) — leaks and dangling vanish structurally."
      ],
      code: "void leaky() {\n    int *p = new int[100];\n    if (error) throw std::runtime_error(\"oops\");   // ✗ p 泄漏\n    delete[] p;\n}\n\nvoid safe() {\n    auto p = std::make_unique<int[]>(100);\n    if (error) throw std::runtime_error(\"oops\");   // ✓ 自动释放\n}",
      pit: "delete 之后把指针设为 nullptr 但忘了先 save 旧数据——正确顺序是：先用完数据 → delete → 置空；不是先置空再想办法读。",
      pit_en: "Nulling the pointer before saving its data — the order is: finish using → delete → null; not null first then try to read.",
      ex: {
        q: "内存泄漏和悬空指针哪个更容易被发现？",
        a: "悬空指针通常立刻崩溃（容易发现）；内存泄漏是渐进的（难以发现），往往要靠工具或用户反馈才能定位。",
        q_en: "Which is easier to detect: memory leaks or dangling pointers?",
        a_en: "Dangling pointers usually crash immediately (easy to spot); leaks are gradual and need tools or user feedback."
      }
    },

    "7-9": {
      title: "内存分区模型（内存四区）", title_en: "Memory Layout: Four Regions",
      summary: [
        "C++ 程序的内存分为四个区域：**代码区**（程序指令）、**全局/静态区**（全局变量和 static 变量）、**栈区**（局部变量和函数调用信息）、**堆区**（new 分配的内存）。",
        "栈区的特点：自动分配释放、速度快、大小有限（通常 1~8MB）——超出就是栈溢出（典型于过深递归或超大局部数组）。",
        "堆区的特点：手动分配释放、速度较慢、大小灵活（受限于系统内存）——用 new/delete 或智能指针管理。",
        "栈和堆的增长方向相反：栈从高地址向低地址增长，堆从低地址向高地址增长——两者之间的空间就是可用内存。",
        "全局/静态区的变量在程序启动时初始化、结束时销毁——生命周期与 main 函数一样长。",
        "理解内存分区 helps：解释为什么局部变量不能太大（栈有限）、为什么 new 的内存要 delete（堆不自动释放）、为什么全局变量不需要 delete（自动管理）。"
      ,
        "去向：s8 用结构体把这些字节组织成一个类型，指针、new/delete 与浅拷贝会在里面反复出现。"],
      summary_en: [
        "C++ memory has four regions: **code** (instructions), **global/static** (globals and statics), **stack** (locals and call info), **heap** (new allocations).",
        "Stack traits: auto-allocated/freed, fast, limited size (1–8MB) — exceeding it is a stack overflow (deep recursion, huge local arrays).",
        "Heap traits: manual allocation/free, slower, flexible (limited by system memory) — managed via new/delete or smart pointers.",
        "Stack and heap grow toward each other: stack from high addresses down, heap from low addresses up — the gap is available memory.",
        "Global/static variables are initialised at program start and destroyed at exit — they live as long as main.",
        "Understanding the layout explains: why locals cannot be huge (stack is limited), why new needs delete (heap is not auto-freed), why globals need no delete."
      ,
        "Next: s8 organises those bytes into a type with structs, where pointers, new/delete and shallow copies keep recurring."],
      code: "int g_var = 10;              // 全局区\n\nvoid f() {\n    int l_var = 20;            // 栈区\n    static int s_var = 30;     // 全局区（static 局部）\n    int *h_var = new int(40);  // 堆区\n    delete h_var;\n}",
      pit: "在栈上分配超大数组（如 int arr[10000000]，约 40MB）——栈通常只有 1~8MB，直接栈溢出崩溃；大数组应该用堆（new / vector）。",
      pit_en: "Allocating a huge array on the stack (e.g. int arr[10000000], ~40MB) overflows the 1–8MB stack; use the heap (new / vector) for large arrays.",
      ex: {
        q: "为什么递归太深会导致栈溢出？",
        a: "每次函数调用都会在栈上压入一个栈帧（参数、返回地址、局部变量）；递归不终止就不断压栈，直到超出栈的容量上限。",
        q_en: "Why does deep recursion overflow the stack?",
        a_en: "Each call pushes a frame (parameters, return address, locals); unlimited recursion fills the stack capacity."
      }
    }
  },

  /* ---------- 题库：每章 +3 ---------- */
  quizAdd: {
    s5: [
      { q: "函数重载的判断依据是？", o: ["返回类型不同", "参数个数或类型不同", "函数名长度", "是否为 inline"], a: 1,
        why: "重载唯一依据是参数列表；返回类型不参与重载解析。", type: "choice",
        q_en: "What decides whether two functions are overloads?",
        o_en: ["Different return types", "A different parameter count or types", "The length of the function name", "Whether it is inline"],
        why_en: "Only the parameter list makes an overload; the return type plays no part in overload resolution." },
      { q: "默认参数必须从___往___连续给出。", o: [], type: "fill",
        ans: ["右左", "从右往左", "右往左", "从右到左", "右到左", "从右向左", "右左顺序", "rightleft", "right to left", "right-to-left"],
        why: "调用时省略只能从右往左，因此默认值也必须从右往左连续。",
        q_en: "Default arguments must be supplied continuously from ______ to ______.",
        why_en: "Callers can only omit arguments from the right, so defaults must be filled in right to left." },
      { q: "static 局部变量只初始化一次，之后每次调用保留上次的值。", o: ["正确", "错误"], a: 0,
        why: "static 局部变量的生命周期与程序一样长，但作用域限于本函数。", type: "judge",
        q_en: "A static local variable is initialised only once and keeps its value across later calls.",
        why_en: "True. Its lifetime lasts as long as the program, while its scope stays inside that one function." }
    ],
    s6: [
      { q: "长度为 5 的数组，访问 a[5] 会怎样？", o: ["编译错误", "运行时崩溃", "未定义行为（可能不崩溃）", "自动扩容"], a: 2,
        why: "数组不做边界检查，越界是未定义行为——可能崩溃也可能悄悄破坏相邻数据。", type: "choice",
        q_en: "What happens when you access a[5] in an array of length 5?",
        o_en: ["A compile error", "A crash at run time", "Undefined behaviour (it may not crash)", "The array grows automatically"],
        why_en: "Arrays do no bounds checking, so indexing past the end is undefined behaviour — it may crash or quietly corrupt neighbours." },
      { q: "比较两个 C 风格字符串的内容是否相同，应该用？", o: ["s1 == s2", "strcmp(s1, s2) == 0", "s1 = s2", "strlen(s1) == strlen(s2)"], a: 1,
        why: "== 比较的是地址；strcmp 按字典序比较内容，返回 0 表示相等。", type: "choice",
        q_en: "How do you test two C-style strings for equal content?",
        o_en: ["s1 == s2", "strcmp(s1, s2) == 0", "s1 = s2", "strlen(s1) == strlen(s2)"],
        why_en: "== compares addresses; strcmp compares content lexicographically and returns 0 when they are equal." },
      { q: "std::stoi 解析「abc」的结果是？", o: ["返回 0", "抛出异常", "返回 -1", "返回空字符串"], a: 1,
        why: "stoi 失败时抛出 std::invalid_argument 异常，可以用 try-catch 捕获处理。", type: "choice",
        q_en: "What does std::stoi(\"abc\") do?",
        o_en: ["Returns 0", "Throws an exception", "Returns -1", "Returns an empty string"],
        why_en: "stoi throws std::invalid_argument on failure, which you handle with try-catch." }
    ],
    s7: [
      { q: "int *p 加 1 后，地址增加多少字节（64 位系统，int 为 4 字节）？", o: ["1", "4", "8", "取决于编译器"], a: 1,
        why: "指针算术以所指向类型的大小为步长；int 是 4 字节所以增加 4。", type: "choice",
        q_en: "After p + 1 for an int *p, how many bytes is the address advanced (64-bit system, int is 4 bytes)?",
        o_en: ["1", "4", "8", "It depends on the compiler"],
        why_en: "Pointer arithmetic steps by the size of the pointee; int is 4 bytes, so it advances 4." },
      { q: "引用一旦绑定到某个变量后，是否可以改绑到另一个变量？", o: ["可以", "不可以", "用 const 可以", "用指针间接可以"], a: 1,
        why: "引用是别名，绑定后终身不变——这是它与指针最关键的区别之一。", type: "judge",
        o_en: ["Yes", "No", "Yes if it is const", "Yes indirectly through a pointer"],
        q_en: "Once a reference is bound to a variable, it can be rebound to another one.",
        why_en: "False. A reference is an alias and stays bound for life — the sharpest difference from a pointer." },
      { q: "递归函数缺少终止条件会导致什么后果？", o: ["编译错误", "返回默认值", "栈溢出（不断压栈直到耗尽栈空间）", "自动转为循环"], a: 2,
        why: "每次递归调用都压入一个栈帧，无限递归最终超出栈容量导致崩溃。", type: "choice",
        q_en: "What is the consequence of a recursive function with no base case?",
        o_en: ["A compile error", "It returns a default value", "Stack overflow (frames pile up until the stack is exhausted)", "It turns into a loop automatically"],
        why_en: "Every call pushes a stack frame, so unbounded recursion exceeds the stack capacity and crashes." }
    ]
  },

  /* ---------- 词典扩展 ---------- */
  terms: [
    { term: "函数重载", term_en: "Function Overloading", cat: "C++ 系统深入", short: "同名函数通过不同的参数列表实现不同版本的调用。",
      short_en: "Same-named functions with different parameter lists.",
      detail: ["返回类型不参与重载解析。", "匹配顺序：精确 → 提升 → 标准转换，多义则报错。"],
      detail_en: ["The return type does not participate in overload resolution.", "Matching order: exact -> promotion -> standard conversion; ambiguity is an error."],
      vs: "重载是编译期匹配，虚函数是运行期分派。", vs_en: "Overloading is compile-time dispatch; virtual functions are runtime." },
    { term: "栈帧", term_en: "Stack Frame", cat: "C++ 系统深入", short: "每次函数调用在栈上分配的内存块，包含参数、返回地址和局部变量。",
      short_en: "Memory per function call on the stack: parameters, return address, locals.",
      detail: ["栈帧的大小在编译期确定。", "递归深度受栈容量限制（通常 1~8MB）。"],
      detail_en: ["A frame's size is determined at compile time.", "Recursion depth is capped by stack capacity (typically 1-8 MB)."],
      vs: "栈帧自动管理，堆内存手动管理。", vs_en: "Stack frames auto-manage; heap memory is manual." },
    { term: "内存四区", term_en: "Memory Regions", cat: "C++ 系统深入", short: "代码区、全局/静态区、栈区、堆区。",
      short_en: "Code, global/static, stack, and heap regions.",
      detail: ["栈从高地址向低地址增长，堆相反。", "全局/静态变量生命周期与程序一样长。"],
      detail_en: ["The stack grows from high to low addresses; the heap grows the other way.", "Global and static variables live as long as the program."],
      vs: "栈自动快但有限，堆灵活但需手动。", vs_en: "Stack is fast but limited; heap is flexible but manual." },
    { term: "退化", term_en: "Array Decay", cat: "C++ 系统深入", short: "数组名在表达式中自动转为指向首元素的指针。",
      short_en: "The array name automatically becomes a pointer to its first element in expressions.",
      detail: ["sizeof(数组名) 是例外，返回整个数组的字节大小。", "传参时也退化，丢失长度信息。"],
      detail_en: ["sizeof(array name) is the exception — it still reports the whole array.", "Parameters decay too, which is why length information is lost."],
      vs: "退化后丢失大小信息，std::array 保留。", vs_en: "Decay loses the size; std::array keeps it." },
    { term: "缓冲区溢出", term_en: "Buffer Overflow", cat: "C++ 系统深入", short: "向数组写入超出其边界的 数据，破坏相邻内存。",
      short_en: "Writing beyond an array's bounds, corrupting adjacent memory.",
      detail: ["C++ 原生数组不做边界检查。", "用 .at() 或 std::vector 可以获得边界检查。"],
      detail_en: ["Native C++ arrays perform no bounds checking.", "Use .at() or std::vector to get checked access."],
      vs: "溢出是安全漏洞的根源，边界检查是防线。", vs_en: "Overflow is a security root cause; bounds checking is the defence." },
    { term: "悬空引用", term_en: "Dangling Reference", cat: "C++ 系统深入", short: "引用绑定的对象已经被销毁，但引用仍然存在。",
      short_en: "A reference whose bound object has been destroyed.",
      detail: ["返回局部变量的引用是典型场景。", "引用没有空值检查，悬空后无法检测。"],
      detail_en: ["Returning a reference to a local is the classic case.", "A reference has no null check, so a dangling one cannot be detected."],
      vs: "悬空指针可置空检测，悬空引用无法检测。", vs_en: "Dangling pointers can be nulled and tested; dangling references cannot." },
    { term: "重定义", term_en: "Redefinition", cat: "C++ 系统深入", short: "同一个函数或变量被定义了多次，链接器无法选择。",
      short_en: "The same function or variable defined multiple times — the linker cannot choose.",
      detail: ["头文件里定义函数（非 inline）是典型原因。", "用 include guard 或 #pragma once 防止。"],
      detail_en: ["Defining a function (not inline) in a header is the typical cause.", "Use include guards or #pragma once."],
      vs: "重定义是链接错误，重复声明无害。", vs_en: "Redefinition is a link error; repeated declarations are harmless." }
  ],

  /* ---------- 学习节奏 ---------- */
  minMap: {
    "5-1": 12, "5-2": 14, "5-3": 8, "5-4": 10, "5-5": 8, "5-6": 14, "5-7": 12, "5-8": 8, "5-9": 12,
    "6-1": 12, "6-2": 10, "6-3": 10, "6-4": 12, "6-5": 12, "6-6": 10,
    "7-1": 10, "7-2": 14, "7-3": 12, "7-4": 12, "7-5": 10, "7-6": 12, "7-7": 12, "7-8": 12, "7-9": 12
  },

  /* ---------- 成就扩展 ---------- */
  achievements: [
    { id: "func_master", icon: "🔧", name: "函数工匠", name_en: "Function Craftsman",
      desc: "完成 s5 · 函数 全部课节", desc_en: "Finish all lessons of s5 Functions",
      check: ["s5"] },
    { id: "data_ninja", icon: "📦", name: "数据忍者", name_en: "Data Ninja",
      desc: "完成 s6 · 数组与字符串 全部课节", desc_en: "Finish all lessons of s6 Arrays & Strings",
      check: ["s6"] },
    { id: "ptr_adept", icon: "→", name: "指针行者", name_en: "Pointer Walker",
      desc: "完成 s7 · 指针与引用 全部课节", desc_en: "Finish all lessons of s7 Pointers & References",
      check: ["s7"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "原型声明（定义在后面时必须有）": "prototype declaration (required when the definition comes later)",
    "调用": "the call",
    "定义": "the definition",
    "引用传递：改的是原变量": "by reference: the original variable is edited",
    "const 引用：只读 + 不拷贝": "const reference: read-only + no copy",
    "值传递：改的是副本": "by value: only the copy is edited",
    "a 不变": "a stays the same",
    "这里的代码永远不会执行": "nothing below here ever runs",
    "void 可以不写 return，或写 return; 提前退出": "void may omit return, or use a bare return; to exit early",
    "✗ 返回局部变量的引用": "✗ returns a reference to a local variable",
    "int& bad() { int x = 1; return x; }  // 悬空引用": "int& bad() { int x = 1; return x; }  // dangling reference",
    "✗ 返回类型不同不构成重载": "✗ a different return type is not an overload",
    "终止条件": "base case",
    "递推": "recursive step",
    "只初始化一次": "initialised only once",
    "全局": "global",
    "局部，遮蔽全局": "local: shadows the global one",
    "10（:: 访问全局）": "10 (:: reaches the global)",
    "调用 square(5) 展开为 5 * 5": "the call square(5) expands to 5 * 5",
    "与宏的区别：": "how it differs from a macro:",
    "宏：不安全": "macro: unsafe",
    "SQUARE(a++) 展开为 ((a++) * (a++)) → a 被加两次！": "SQUARE(a++) expands to ((a++) * (a++)) -> a is incremented twice!",
    "inline 没有这个问题": "inline has no such problem",
    "math_utils.h（头文件）": "math_utils.h (header)",
    "math_utils.cpp（源文件）": "math_utils.cpp (source file)",
    "编译器推大小 = 3": "the compiler deduces the size = 3",
    "全部初始化为 0": "every element is zero-initialised",
    "5（元素个数）": "5 (the element count)",
    "a[5] = 99;                  // ✗ 越界，未定义行为": "a[5] = 99;                  // ✗ out of bounds, undefined behaviour",
    "6 元素（含 \\0）": "6 elements (the null terminator counts too)",
    "复制": "copy",
    "拼接": "concatenate",
    "✓ 正确的比较": "✓ the correct comparison",
    "✗ 比较的是地址！": "✗ this compares addresses!",
    "追加": "append",
    "修改第一个字符": "change the first character",
    "内容比较": "compare by content",
    "传给 C 风格接口": "hand it to a C-style API",
    "字符串 → int": "string -> int",
    "int → 字符串": "int -> string",
    "带格式控制": "with formatting control",
    "安全转换": "safe conversion",
    "0x7ffd...（地址，每次运行可能不同）": "0x7ffd... (an address; it can differ every run)",
    "另一个地址": "another address",
    "地址差值反映大小": "the gap between addresses reveals the size",
    "相差几个 int（1，如果相邻）": "how many ints apart (1 when adjacent)",
    "p 存储了 x 的地址": "p stores the address of x",
    "42（解引用：跟随指针找到 x）": "42 (dereference: follow the pointer to x)",
    "通过指针修改 x": "modify x through the pointer",
    "100（x 被改了！）": "100 (x really changed!)",
    "空指针": "a null pointer",
    "退化为 &a[0]": "decays to &a[0]",
    "30（等价于 *(p + 2) = a[2]）": "30 (the same as *(p + 2), i.e. a[2])",
    "40（等价于 a[3]）": "40 (the same as a[3])",
    "遍历": "traverse",
    "3（相差 3 个元素）": "3 (three elements apart)",
    "移到 a[2]": "moves to a[2]",
    "r 是 x 的别名": "r is an alias of x",
    "x 变成 20": "x becomes 20",
    "和 &x 相同": "the same address as &x",
    "✗ 不能改绑": "✗ a reference cannot rebind",
    "r = &y;          // 这不是改绑，是把 y 的值赋给 x": "r = &y;          // not a rebind: this assigns y's value to x",
    "指向常量：*p1 不能改": "pointer to const: *p1 cannot be written",
    "*p1 = 99;             // ✗ 编译错误": "*p1 = 99;             // ✗ compile error",
    "✓ 可以改指向": "✓ re-pointing is allowed",
    "常量指针：p2 不能改指向": "const pointer: p2 cannot re-point",
    "✓ 可以改值": "✓ writing the value is allowed",
    "p2 = &y;               // ✗ 编译错误": "p2 = &y;               // ✗ compile error",
    "两者都不能改": "neither the value nor the target can change",
    "单个 int": "a single int",
    "数组": "an array",
    "释放单个": "free the single object",
    "释放数组（注意 []）": "free the array (note the [])",
    "现代 C++ 替代": "the modern C++ replacement",
    "自动释放": "freed automatically",
    "自动管理": "managed automatically",
    "✗ p 泄漏": "✗ p leaks",
    "✓ 自动释放": "✓ freed automatically",
    "全局区": "global area",
    "栈区": "stack area",
    "全局区（static 局部）": "global area (static local)",
    "堆区": "heap area"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_AGENT_D);
