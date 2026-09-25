/* ================================================================
 * R0:hello agi · 课程深化层 ①：结构体与枚举（s8）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把 s8 从「5 节 × 3 要点」的介绍式内容，深化为「14 节 × 7~8 要点」的
 *       结构化教学：成员与内存布局 → 结构体指针 → 传参策略 → 动态与浅拷贝 →
 *       枚举（含 enum class）→ 联合体（含类型双关）→ 类型别名与推导 →
 *       struct 与 class 的唯一区别 → 综合重构。
 *
 * 叠加层约定：不改 index.html 里的原始 CURRICULUM 文本，
 *   由主页面的「深化合并」逻辑替换 lessons（按 order 重排）、追加 quiz 与名词。
 *   ★ 既有课节 id（8-1…8-5）与标题保持不变 → 老进度零迁移；新节使用新 id（8-6…8-14）。
 * ================================================================ */

/* 课节重编号迁移表：旧 id → 新 id（页面合并时迁移学习进度，幂等） */
const DEEPEN_RENUMBER = {"8-1":"8-1","8-2":"8-2","8-6":"8-3","8-7":"8-4","8-8":"8-5","8-9":"8-6","8-3":"8-7","8-11":"8-8","8-4":"8-9","8-12":"8-10","8-5":"8-11","8-13":"8-12","8-10":"8-13","8-14":"8-14","9-1":"9-1","9-2":"9-2","9-8":"9-3","9-3":"9-4","9-9":"9-5","9-4":"9-6","9-10":"9-7","9-5":"9-8","9-6":"9-9","9-11":"9-10","9-7":"9-11","9-12":"9-12","10-1":"10-1","10-2":"10-2","10-9":"10-3","10-3":"10-4","10-4":"10-5","10-10":"10-6","10-5":"10-7","10-11":"10-8","10-6":"10-9","10-7":"10-10","10-8":"10-11","10-12":"10-12"};

const DEEPEN_S8 = {
  stage: "s8",
  desc: "从数据打包到内存布局：结构体、枚举、联合体与类型别名，并打通「struct → class」的观念桥梁",
  desc_en: "From data packing to memory layout: struct, enum, union and type aliases — plus the bridge from struct to class",
  goal: "能设计结构体并说清它的内存布局，用指针/引用正确地传递它，知道何时该把 struct 升级成 class，并会用 enum class 与 union 表达受限取值。",
  goal_en: "Design structs and explain their memory layout, pass them correctly by pointer/reference, know when to promote a struct into a class, and use enum class / union to express constrained values.",

  order: ["8-1","8-2","8-3","8-4","8-5","8-6","8-7","8-8","8-9","8-10","8-11","8-12","8-13","8-14"],

  lessons: {
        "8-1": {
      title: "struct 结构体", title_en: "struct: Packing Data Together", min: 12,
      summary: [
        "struct 把多个不同类型的数据捆成一个新类型——它定义的是「类型」而不是变量，定义之后才用它声明变量。",
        "成员（member）就是结构体内部的变量；用「对象.成员」访问，读与写都走这个点号。",
        "三种初始化：聚合初始化 Student s{\"Tom\", 17}（推荐，顺序对应声明顺序）、逐成员赋值、同类型拷贝。",
        "结构体是值类型：a = b 是逐成员复制，之后改 a 不影响 b——这与后面要讲的指针语义形成对照。",
        "定义末尾的分号不能少（};）——这是初学者最常见的编译错误来源，报错信息通常出现在下一行，很容易误判。",
        "结构体可以定义在函数外（类型全局可见）或函数内（仅本函数可见）；跨文件复用时放进头文件。",
        "struct 的默认访问级别是 public（class 是 private），这是两者唯一的实质差别（8-13 专门展开）。",
        "衔接：本章默认你已掌握 s7 的指针、引用与 new/delete；下一章将把 struct 正式升级为类。"
      ],
      summary_en: [
        "A struct bundles values of different types into one new type — it defines a *type*, not a variable.",
        "Members are the variables inside it; access them with object.member for both reading and writing.",
        "Three ways to initialise: aggregate (Student s{\"Tom\", 17}, order follows declaration), member-by-member assignment, or copying a same-type object.",
        "A struct is a value type: a = b copies member by member, so later edits to a do not affect b.",
        "Never forget the trailing semicolon after }; — the most common beginner compile error, and the message often points at the next line.",
        "Define types outside functions (visible in the file) or inside (local to that function); put shared ones in a header.",
        "A struct's default access level is public (class defaults to private) — the only real difference, covered in 8-13.",
        "Bridge: this chapter assumes s7 — pointers, references and new/delete; the next chapter promotes struct into a class."
      ],
      code: "struct Student {\n  std::string name;\n  int age = 0;               // 类内默认值（C++11）\n};\n\nStudent a{\"Tom\", 17};         // 聚合初始化：按声明顺序\nStudent b = a;                 // 值拷贝：逐成员复制\nb.age = 18;                    // 改 b 不影响 a\nstd::cout << a.name << a.age;  // Tom17",
      pit: "忘了结构体定义末尾的分号；或聚合初始化时把顺序写反导致类型不匹配（编译器会报「无法从 double 转换到 std::string」这类看似无关的错）。",
      pit_en: "Forgetting the semicolon after the struct definition, or writing aggregate initialisers in the wrong order — the compiler then reports a confusing type-conversion error.",
      ex: {
        q: "为什么说 struct 定义的是类型而不是变量？",
        a: "声明结构体只是描述了「这类数据长什么样」，此时不占内存；用它声明变量或 new 之后，才真正有对象与内存。",
        q_en: "Why does a struct define a type rather than a variable?",
        a_en: "Declaring a struct only describes the shape of such data and allocates nothing; memory exists only once you declare a variable or use new."
      }
    },

    "8-2": {
      title: "结构体数组与嵌套", title_en: "Arrays of structs & nesting", min: 10,
      summary: [
        "结构体数组 = 每个元素都是一个结构体对象，用 cls[i].score 访问；下标与成员之间是两个层次。",
        "数组元素默认是未初始化的（内置类型成员值不确定），务必「先赋值再读」，或写成 Student cls[30]{} 做值初始化。",
        "嵌套：成员本身可以是另一个结构体（如 Date birthday），访问链写成 s.birthday.year。",
        "遍历优先用范围 for：for (const auto &s : cls)——加 & 避免逐个拷贝，加 const 防止误改。",
        "常用套路三件套：累加统计、查找极值、按字段排序（配 std::sort 与 lambda 比较器）。",
        "嵌套层数一般不超过两层；超过两层通常说明应该把内层抽成独立类型，否则访问链太长、语义也不清。",
        "规模不确定时改用 std::vector<Student>：可动态增长、自带 size、拷贝语义清晰；原生数组在学完 STL 后应逐渐退场。"
      ],
      summary_en: [
        "An array of structs holds one struct object per element: cls[i].score has two levels (index then member).",
        "Elements are default-initialised (built-in members hold indeterminate values); assign before reading, or write Student cls[30]{} to value-initialise.",
        "Nesting: a member can itself be a struct (e.g. Date birthday), giving access chains like s.birthday.year.",
        "Prefer range-for with const auto &s — the reference avoids copies, const prevents accidental writes.",
        "The three everyday patterns: accumulate, find the extreme, and sort by a field (with std::sort and a lambda comparator).",
        "Keep nesting to about two levels; deeper usually means the inner type deserves its own definition.",
        "When the size is unknown, use std::vector<Student>: it grows, knows its size, and has clean copy semantics."
      ],
      code: "struct Date { int y, m, d; };\nstruct Student { std::string name; double score; Date born; };\n\nStudent cls[3]{{ \"Tom\", 88.5, {2007,3,1} },\n               { \"Ann\", 92.0, {2007,7,9} },\n               { \"Bob\", 76.0, {2006,12,20} }};\n\ndouble sum = 0; for (const auto &s : cls) sum += s.score;\nstd::sort(cls, cls + 3,\n  [](const Student &a, const Student &b) { return a.score > b.score; });",
      pit: "拿未初始化的结构体数组直接累加，结果里混进垃圾值——Student cls[30]; 并不会自动清零，必须显式初始化。",
      pit_en: "Accumulating over an uninitialised array of structs mixes garbage into the result — Student cls[30]; does not zero anything.",
      ex: {
        q: "范围 for 里为什么要写 const auto &s 而不是 auto s？",
        a: "不带 & 会为每个元素做一次完整拷贝（大结构体开销明显）；不加 const 则可能在遍历中误改数据。两者一起写才既高效又安全。",
        q_en: "Why write const auto &s in a range-for instead of auto s?",
        a_en: "Without &, every element is copied in full; without const, the loop may accidentally modify data. Together they are both fast and safe."
      }
    },

    "8-3": {
      title: "结构体成员深入：内存布局、对齐与填充", title_en: "Struct memory layout: alignment & padding", min: 14,
      summary: [
        "成员在内存里按声明顺序连续排列，结构体总大小 = 各成员大小之和 + 为对齐插入的空隙（padding）。",
        "对齐规则：每个成员的起始地址必须是它自身大小的整数倍，因此编译器会在成员之间插入空白字节来满足这个要求。",
        "结果就是 sizeof 常常大于成员大小之和：struct { char c; int i; } 在 64 位平台上通常是 8 字节，而不是 5。",
        "编译器还会做「尾部填充」，把总大小凑成对齐值的整数倍——这样结构体数组里每个元素都天然对齐，访问更快。",
        "用 #pragma pack(1) 或 __attribute__((packed)) 可以取消填充，代价是访问变慢，在某些平台还会因未对齐访问直接崩溃；只在协议/文件格式确有必要时使用。",
        "把成员按「从大到小」排列通常能得到更紧凑的布局——这是零成本的结构体瘦身技巧。",
        "offsetof(类型, 成员) 能取到成员相对起始地址的字节偏移，配合 sizeof 可以验证你对布局的假设，也是二进制读写/字段遍历的基础。"
      ],
      summary_en: [
        "Members are laid out contiguously in declaration order; sizeof = sum of members + padding inserted for alignment.",
        "Alignment rule: each member must start at an address that is a multiple of its own size, so the compiler inserts blank bytes.",
        "As a result sizeof is often larger than the sum: struct { char c; int i; } is typically 8 bytes, not 5.",
        "Tail padding rounds the total up to a multiple of the alignment, keeping every element of an array aligned.",
        "#pragma pack(1) / __attribute__((packed)) removes padding — slower access, and misaligned access can crash on some platforms. Use only for wire/file formats.",
        "Ordering members from largest to smallest usually yields a tighter layout — a zero-cost size optimisation.",
        "offsetof(Type, member) gives byte offsets; together with sizeof it validates your layout assumptions and underpins binary I/O."
      ],
      code: "struct A { char c; int i; };        // sizeof = 8（3 字节填充）\nstruct B { int i; char c; };        // sizeof = 8（尾部填充）\nstruct C { char c; int i; } __attribute__((packed));  // sizeof = 5\n\nstd::cout << sizeof(A) << \" \" << offsetof(A, i);   // 8 4\nstd::cout << sizeof(C);                              // 5（但访问更慢）",
      pit: "想当然地认为「结构体大小 = 成员大小之和」，于是用 memcpy 或二进制读写整块内存——一旦布局含填充，字段就会错位。跨平台读写前先核对 sizeof 与 offsetof。",
      pit_en: "Assuming sizeof equals the sum of members, then memcpy-ing or binary-reading the whole block — any padding shifts your fields. Check sizeof and offsetof before binary I/O.",
      ex: {
        q: "为什么把成员从大到小排列能更紧凑？",
        a: "大成员先占位，后面小成员的对齐要求低，容易被塞进大成员之后剩余的空隙里；反过来（小成员在前）则会产生更多需要用填充补齐的缝隙。",
        q_en: "Why does ordering members large-to-small save space?",
        a_en: "Large members claim space first; smaller ones need less alignment and fit into the gaps left behind. The reverse order creates more gaps that must be padded."
      }
    },

    "8-4": {
      title: "结构体指针与 -> 运算符", title_en: "Pointers to structs and the -> operator", min: 14,
      summary: [
        "结构体指针保存的是结构体对象的地址：Student *p = &s; 它本身只占一个指针大小，不拷贝数据。",
        "通过指针访问成员必须用 ->：p->name 完全等价于 (*p).name；写成 *p.name 是错的，因为 . 的优先级高于 *。",
        "指针传递的实质是「共享」：函数里通过 p->score = 90 改动的是原对象本身，而不是副本。",
        "这是大结构体在函数间传递的首选方式（或引用）：避免整体拷贝，也让修改意图显式可读。",
        "空指针与悬空指针是结构体指针最常见的崩溃来源：使用前判空 if (p)，对象销毁后立即把指针置空。",
        "结构体里可以有「指向同类型结构体」的指针成员，这正是链表、树等数据结构的基础（见 dsl 章）。",
        "与引用对比：引用必须绑定且不能改绑、用法更接近对象；指针可以为空、可以改指、可参与算术。按「是否需要可空与可重定向」来选。"
      ],
      summary_en: [
        "A struct pointer stores an address: `Student *p = &s;` — it costs one pointer and copies no data.",
        "Member access through a pointer uses `->`: `p->name` is exactly `(*p).name`. Writing `*p.name` is wrong because `.` binds tighter than `*`.",
        "Passing a pointer means sharing: `p->score = 90` inside a function changes the original object, not a copy.",
        "This (or a reference) is how large structs should travel between functions.",
        "Null and dangling pointers cause most struct-pointer crashes: check `if (p)` and null out pointers right after the object dies.",
        "A struct may hold a pointer to the same struct type — the basis of linked lists and trees (see the dsl chapter).",
        "Versus references: references must bind and cannot be rebound, and read like objects; pointers can be null, rebind, and take part in arithmetic."
      ],
      code: "Student s{\"Tom\", 88.5};\nStudent *p = &s;\n\np->score = 95.0;                    // 等价于 (*p).score = 95.0\nstd::cout << p->name << p->score;   // Tom 95\n\nStudent *arr = new Student[3];      // 结构体数组的指针\narr[0].name = \"Ann\";                // 数组元素用 . ；裸指针用 ->\narr[1].score = 90;\ndelete[] arr;",
      pit: "把 *p.name 当成「通过指针取成员」——因优先级问题它实际是 *(p.name)，编译不通过；另外对空/已释放的指针解引用会直接段错误。",
      pit_en: "Writing `*p.name` as if it accessed a member through a pointer — precedence makes it `*(p.name)`. Dereferencing a null or freed pointer segfaults.",
      ex: {
        q: "p->name 与 (*p).name 为什么等价？",
        a: "-> 就是为「通过指针访问成员」提供的语法糖：先解引用得到对象，再取成员；两者编译后完全相同。",
        q_en: "Why are `p->name` and `(*p).name` equivalent?",
        a_en: "`->` is sugar for dereference-then-member; the two compile to exactly the same thing."
      }
    },

    "8-5": {
      title: "结构体与函数：值传递 / 指针 / const 引用", title_en: "Passing structs: value, pointer, const reference", min: 12,
      summary: [
        "默认是值传递：函数拿到的是副本，函数里怎么改都不影响调用者——安全，但大结构体会付出整体拷贝的代价。",
        "需要修改调用者时传指针或非 const 引用；需要「只读且不拷贝」时传 const 引用（const Student &s），这是最常用的形式。",
        "选型口诀：要改 → 引用/指针；只读 → const 引用；结构极小（如两个 int）才考虑值传递。",
        "返回结构体是安全的（值语义），现代编译器还会做返回值优化（RVO），通常不会产生多余拷贝。",
        "「参数 const 引用 + 返回值」是大对象进出函数的通用写法，既高效又不牺牲可读性。",
        "const 引用会让函数内部无法修改成员——编译器直接报错。这不是麻烦，而是有意给你加的一道保护。",
        "结构体作参数还涉及「谁拥有数据」：能不改就不改，要改就用非 const 引用把意图写在签名上。"
      ],
      summary_en: [
        "By default arguments are passed by value: the function gets a copy, so changes never reach the caller — safe, but large structs pay a full copy.",
        "To modify the caller's object pass a pointer or a non-const reference; for read-only without copying pass a `const T&` — the most common form.",
        "Rule of thumb: modify → reference/pointer; read-only → const reference; tiny structs (two ints) may go by value.",
        "Returning a struct by value is safe and modern compilers apply return-value optimisation, so no extra copy usually happens.",
        "`const T&` in, value out is the general pattern for large objects crossing function boundaries.",
        "A const reference prevents the function from modifying members — the compiler enforces it. That is protection, not friction.",
        "It is also about ownership: don't modify what you don't need to, and make the intent explicit in the signature."
      ],
      code: "double avg(const std::vector<Student> &v) {        // 只读 + 不拷贝\n  double sum = 0;\n  for (const auto &s : v) sum += s.score;\n  return v.empty() ? 0 : sum / v.size();\n}\nvoid bump(Student &s, double d) { s.score += d; }   // 要改 -> 非 const 引用\nvoid print(const Student &s) { std::cout << s.name; } // 只读 -> const 引用",
      pit: "把大结构体按值传进频繁调用的函数（每次调用都整体拷贝）；或者签名写了 const 引用，函数体里却想改数据——前者慢，后者根本编译不过。",
      pit_en: "Passing big structs by value into hot functions copies everything each call; conversely, declaring a const reference but then trying to modify it will not compile.",
      ex: {
        q: "什么情况下适合按值传递结构体？",
        a: "结构很小（几个标量，拷贝成本低于间接访问）或函数确实需要一份可自由修改的副本时；其余情况优先 const 引用。",
        q_en: "When is passing a struct by value appropriate?",
        a_en: "When it is tiny (copying costs less than indirection) or the function genuinely needs a freely modifiable copy; otherwise prefer a const reference."
      }
    },

    "8-6": {
      target: "能正确 new/delete 一个动态结构体，并说清浅拷贝为什么会导致重复释放。", target_en: "Allocate and free a dynamic struct correctly, and explain why a shallow copy causes a double free.",
      title: "动态结构体：new/delete 与浅拷贝陷阱", title_en: "Dynamic structs: new/delete and shallow-copy traps", min: 14,
      summary: [
        "用 new Student{...} 在堆上创建结构体得到指针；用完必须 delete（数组用 delete[]），否则内存泄漏。",
        "结构体成员里若有指向动态内存的指针，默认拷贝只复制指针值（浅拷贝）→ 两个对象指向同一块内存。",
        "浅拷贝的三个后果：改一个影响另一个、析构时同一块内存被释放两次（double free，直接崩溃）、原对象释放后另一个变成悬空指针。",
        "三条出路：改用智能指针（推荐，见 s17）、用 = delete 禁用拷贝、或自己写拷贝构造/赋值实现深拷贝（见 s9-7）。",
        "现代 C++ 的正解是尽量不用手工 new/delete：用 std::vector<Student> 与值语义，让拷贝与释放自动正确。",
        "悬空指针：delete 之后原指针仍指向已释放内存，继续使用属于未定义行为；delete 后立刻置空是好习惯。",
        "定位泄漏的实用手段：把 new/delete 成对注释掉做对照实验，或用 valgrind / AddressSanitizer 跑一遍。"
      ],
      summary_en: [
        "`new Student{...}` creates a struct on the heap and yields a pointer; you must `delete` it (or `delete[]` for arrays) or leak.",
        "If a struct member is a raw pointer to dynamic memory, the default copy duplicates only the pointer (a shallow copy) — two objects share one block.",
        "Three consequences: edits leak across objects, the block is freed twice (double free → crash), and one object becomes dangling after the other dies.",
        "Three ways out: use smart pointers (preferred, see s17), delete the copy operations, or hand-write a deep copy (see s9-7).",
        "The modern answer is to avoid manual new/delete: hold values in std::vector and let copying and freeing be automatic.",
        "Dangling pointer: after `delete`, the pointer still refers to freed memory and using it is undefined behaviour — null it immediately.",
        "To find leaks, pair up new/delete and comment them out as a control, or run valgrind / AddressSanitizer."
      ],
      code: "struct Row { std::string name; int *data; };   // 含裸指针成员 -> 危险\nRow a{\"x\", new int[3]{1,2,3}};\nRow b = a;                                     // 浅拷贝：b.data 与 a.data 是同一块\ndelete[] a.data;\ndelete[] b.data;                               // 💥 double free\n\n// 正确方向：让成员自己管理资源\nstruct Safe { std::string name; std::vector<int> data; };",
      pit: "结构体里放了裸指针成员却仍按值拷贝——两份对象共享同一块内存，释放两次必然崩溃，而且这种 bug 往往延迟到程序退出时才出现。",
      pit_en: "Copying a struct that owns a raw pointer by value — both objects share the block, so the second free crashes, often only at exit.",
      ex: {
        q: "为什么说「结构体里放裸指针成员」是一个危险信号？",
        a: "默认的拷贝、赋值、析构都会逐个成员处理，指针成员会导致资源被共享与重复释放；要安全就必须自己接管（或换用 RAII 类型成员）。",
        q_en: "Why is a raw pointer member in a struct a red flag?",
        a_en: "Default copy, assignment and destruction treat members one by one; a pointer member leads to shared resources and double frees unless you take over the semantics."
      }
    },

    "8-7": {
      target: "能用 enum 给一组取值命名，并让它参与判断与数组下标。", target_en: "Name a set of values with enum and use them in conditions and as array indices.",
      title: "enum 枚举", title_en: "enum: naming the constants", min: 10,
      summary: [
        "enum 用名字代替魔法数字，让常量自己说明含义：enum Color { RED, GREEN, BLUE };",
        "默认从 0 开始递增；可以显式给某个成员赋值，它后面的成员从该值继续递增。",
        "枚举本质是整型，会隐式转成 int，因此能比较大小、参与算术——灵活，但也容易被误用。",
        "普通枚举的成员名会泄漏到外层作用域，因此命名建议加前缀（Color_RED），或直接改用 enum class（8-11）。",
        "适合所有「固定且有限」的取值集合：状态机、选项、协议字段、错误码。",
        "想打印枚举名可以配一张字符串表（数组），这也是调试时最顺手的做法。",
        "不要把枚举当作通用整数：需要算术时应显式转换，避免把两个语义不同的枚举混在一起计算。"
      ],
      summary_en: [
        "enum replaces magic numbers with self-explaining names: `enum Color { RED, GREEN, BLUE };`",
        "Values start at 0 and increase; assigning one explicitly makes its successors continue from there.",
        "An enum is essentially an integer and converts to int implicitly, so comparisons and arithmetic work — convenient but easy to misuse.",
        "Plain enum members leak into the enclosing scope, so use a prefix (Color_RED) or switch to enum class (8-11).",
        "Perfect for any fixed, finite set of values: states, options, protocol fields, error codes.",
        "Printing names is easiest with a parallel string table — the friendliest debugging trick.",
        "Don't treat enums as general integers: convert explicitly when arithmetic is really needed."
      ],
      code: "enum Color { RED, GREEN = 5, BLUE };     // RED=0, GREEN=5, BLUE=6\nconst char *name[] = { \"RED\", \"GREEN\", \"BLUE\" };\n\nColor c = BLUE;\nstd::cout << name[c];                       // BLUE\nif (c == GREEN) { /* 用名字比较，而不是 5 */ }",
      pit: "用裸整数与枚举混比（if (c == 5) 而不是 if (c == GREEN)）：可读性没了，日后改动枚举取值时也极易漏改。",
      pit_en: "Comparing against raw integers (`if (c == 5)`) instead of the enumerator (`if (c == GREEN)`) destroys readability and breaks silently when values change.",
      ex: {
        q: "enum 相比 #define 常量好在哪？",
        a: "枚举有类型、有作用域、调试时可见名字，一组相关取值集中在定义处，调整时只需改一处。",
        q_en: "How is an enum better than #define constants?",
        a_en: "Enums are typed, scoped, visible in the debugger, and keep related values together in one definition."
      }
    },

    "8-8": {
      target: "能在新代码里默认使用 enum class，并说清它与普通 enum 的两处差别：作用域与隐式转整数。", target_en: "Default to enum class and state its two differences from plain enum: scoping and no implicit conversion to int.",
      title: "enum class：作用域枚举与底层类型", title_en: "enum class: scoped enums & underlying type", min: 10,
      summary: [
        "C++11 的 enum class 把成员限制在枚举自身的作用域内：必须写 Color::RED，不再污染外层命名空间。",
        "它不会隐式转成整数——需要时得显式 static_cast<int>(c)，从此杜绝「枚举与整数混算」这类错误。",
        "可以指定底层类型：enum class Byte : unsigned char { ... }; 用来控制大小与符号，协议与位域场景常用。",
        "普通 enum 也能指定底层类型，但「作用域 + 不隐式转换」这两个改进只属于 enum class。",
        "新代码默认选 enum class；只有需要与旧代码或裸整数互通时才退回普通 enum。",
        "配合 switch 时，编译器能对遗漏的枚举分支给出警告，减少漏写导致的行为缺口。",
        "因为是独立作用域，多个模块各自的「状态」枚举可以用同名成员而互不冲突，模块化时很省心。"
      ],
      summary_en: [
        "C++11 `enum class` confines members to the enum's own scope: you must write Color::RED, so nothing pollutes the enclosing namespace.",
        "It does not convert to int implicitly — use `static_cast<int>(c)` when you really mean it, which eliminates accidental mixing.",
        "You can pin the underlying type: `enum class Byte : unsigned char { ... };` to control size and signedness (protocols, bitfields).",
        "Plain enums can also declare an underlying type, but scoping and no-implicit-conversion belong to enum class alone.",
        "Default to enum class in new code; fall back to plain enum only for interop with legacy or raw integers.",
        "With switch, compilers warn about missing enumerators, catching gaps in handling.",
        "Because scopes are separate, different modules can define same-named enumerators without clashing."
      ],
      code: "enum class Color : unsigned char { RED, GREEN, BLUE };\n\nColor c = Color::GREEN;\nint v = static_cast<int>(c);          // 必须显式转换\n// int x = Color::RED;                // ✗ 编译错误：不会隐式转换\n\nswitch (c) {\n  case Color::RED:   /* ... */ break;\n  case Color::GREEN: /* ... */ break;\n  default: break;\n}",
      pit: "在 enum class 上直接做算术或与整数比较而不写 static_cast，编译不过——这不是编译器苛刻，而是它刻意提供的保护。",
      pit_en: "Doing arithmetic or integer comparison on an enum class without static_cast fails to compile — that is deliberate protection, not a nuisance.",
      ex: {
        q: "enum class 相比普通 enum 的两个主要改进？",
        a: "①成员名收进自身作用域，不污染外层；②不隐式转换成整数，强制显式转换、显著减少误用。",
        q_en: "Two main improvements of enum class over plain enum?",
        a_en: "Members are scoped to the enum, and there is no implicit conversion to int — forcing explicit casts and preventing misuse."
      }
    },

    "8-9": {
      target: "能说明 union 的内存共享语义，并判断哪些成员类型不能放进 union。", target_en: "Explain union's shared storage and recognise which member types are not allowed in one.",
      title: "union 联合体", title_en: "union: sharing one block of memory", min: 10,
      summary: [
        "union 的所有成员共享同一段内存，因此它的大小等于最大成员的大小（再按对齐向上取整）。",
        "同一时刻只有「最后写入的那个成员」有效；读其它成员相当于把这段字节按另一种类型解释。",
        "主要用途是省内存（同一块空间在不同时刻存不同类型）与底层协议/格式解析。",
        "使用时要清楚「现在读的是哪个成员」——经典做法配一个 enum 标记当前类型（tagged union）。",
        "匿名 union（在结构体里不写名字）能让成员像普通结构体成员一样直接访问，常用于紧凑的数据表示。",
        "含非平凡构造/析构的类型（如 std::string）放进 union 需要手工管理生命周期——这是 union 最容易出事的地方。",
        "现代 C++ 更推荐 std::variant（类型安全的联合体），union 主要留给与 C / 硬件打交道的场景。"
      ],
      summary_en: [
        "All members of a union share one block of memory, so its size equals the largest member (rounded up to alignment).",
        "Only the most recently written member is valid; reading another reinterprets those same bytes.",
        "Main uses: saving memory (different types at different times) and low-level protocol/format parsing.",
        "You must track which member is active — classically with a companion enum (a tagged union).",
        "An anonymous union lets members be accessed as if they were struct members — handy for compact representations.",
        "Types with non-trivial construction/destruction (std::string) need manual lifetime management inside a union — the usual source of bugs.",
        "Modern C++ prefers std::variant (a type-safe union); union is mostly for C and hardware interop."
      ],
      code: "union U { int i; float f; char bytes[4]; };   // sizeof = 4\n\nU u;\nu.f = 1.0f;\nprintf(\"%08x\", u.i);                          // 按 int 解释同一段字节\n\nstruct Tagged {                                 // 带标记的 union\n  enum { I, F } kind;\n  union { int i; float f; };\n};",
      pit: "写入一个成员后去读另一个成员——结果依赖平台与编译器（不是随机，但也不可移植），别拿它做正经的数值转换。",
      pit_en: "Writing one member then reading another depends on the platform and compiler — not random, but not portable. Never use it for real numeric conversion.",
      ex: {
        q: "union 的大小由什么决定？",
        a: "由最大的那个成员决定，并按该成员的对齐要求向上取整（所以也可能比最大成员略大）。",
        q_en: "What determines a union's size?",
        a_en: "The largest member, rounded up to satisfy that member's alignment requirement."
      }
    },

    "8-10": {
      target: "能解释用 union 做类型双关为什么是未定义行为，给出安全替代并检测平台端序。", target_en: "Explain why union type punning is undefined behaviour, name the safe alternatives, and detect the platform's endianness.",
      title: "union 进阶：类型双关、端序与 variant", title_en: "union in depth: type punning, endianness, variant", min: 12,
      summary: [
        "「类型双关」（type punning）指把同一段内存用不同类型去读；union 是最直观的写法，但在 C++ 里读未激活成员属于未定义行为（多数编译器宽容，优化后可能变化）。",
        "安全的替代：std::bit_cast<T>(x)（C++20）、用 memcpy 拷到目标类型、或直接做数值转换。",
        "端序（endianness）：同一段字节在小端与大端机器上的解释顺序不同，跨平台协议必须显式约定并做转换。",
        "检测本机端序的常用手法：把 uint16_t 的 1 的首字节读出来，得到 1 是小端、0 是大端。",
        "序列化协议头时「union + 结构体 + 位域」是很常见的组合，但务必同时注意对齐与端序两个陷阱。",
        "需要表达「一个值可能是多种类型」时优先 std::variant：它会记录当前类型，取错类型会抛异常而不是静默读错。",
        "记住原则：union 是底层工具；业务代码里出现 union，通常说明该用 variant 或重新设计数据结构。"
      ],
      summary_en: [
        "Type punning means reinterpreting the same bytes as a different type. A union is the most direct way, but reading an inactive member is undefined behaviour in C++ (often tolerated, not guaranteed).",
        "Safe alternatives: `std::bit_cast<T>(x)` (C++20), `memcpy` into the target type, or a real numeric conversion.",
        "Endianness: the same bytes are interpreted in a different order on little- and big-endian machines; cross-platform protocols must state and convert it.",
        "A common endianness probe: read the first byte of a uint16_t(1) — 1 means little-endian, 0 means big-endian.",
        "Protocol headers often combine union, struct and bitfields — mind both alignment and endianness.",
        "When a value may take several types, prefer std::variant: it tracks the active type and throws instead of silently misreading.",
        "Rule: union is a low-level tool. Finding one in business code usually means you want variant or a redesign."
      ],
      code: "uint16_t x = 1;\nbool littleEndian = *(uint8_t*)&x == 1;        // 小端：低字节在前\n\n// 位级转换用 bit_cast 而不是 union\n// float f = 1.0f;  auto bits = std::bit_cast<uint32_t>(f);\n\nstd::variant<int, std::string> v = \"hi\";      // 类型安全版 union\nstd::cout << std::get<std::string>(v);",
      pit: "用 union 把 float 当 int 读来做位运算小技巧，在开启优化或换编译器后结果可能变化——需要位级转换请用 bit_cast。",
      pit_en: "Using a union to read a float as an int for bit tricks can change behaviour under optimisation or a different compiler — use bit_cast for bit-level conversion.",
      ex: {
        q: "为什么说 union 读未激活成员是未定义行为？",
        a: "标准只保证「最后写入的成员」有效，其它成员的解释依赖实现；优化器也会据此做假设，结果不可靠且不可移植。",
        q_en: "Why is reading an inactive union member undefined behaviour?",
        a_en: "The standard only guarantees the last written member; other interpretations are implementation-defined, and optimisers may assume otherwise."
      }
    },

    "8-11": {
      target: "会用 using/typedef 给复杂类型起短名，并能读懂别人写的别名。", target_en: "Give complex types shorter names with using/typedef and read other people's aliases.",
      title: "类型别名 typedef 与 using", title_en: "Type aliases: typedef & using", min: 10,
      summary: [
        "类型别名给复杂类型起短名：using ll = long long;  using StudentList = std::vector<Student>;",
        "C++ 推荐 using 新名 = 旧名;（可读性更好，且支持别名模板）；typedef 在旧代码里仍然大量存在。",
        "别名的价值是「一处改名、全局生效」：把冗长的容器类型抽成 StudentList，日后换容器只改一行。",
        "别名不创建新类型：using Meter = double; 与 double 完全等价，编译器不会帮你区分米和秒——需要强类型得用 struct/class 包一层。",
        "最常用的三个场景：函数指针、容器迭代器、复杂模板类型。",
        "C++11 起 using 可以定义别名模板（typedef 做不到），这是写泛型代码的常用手法。",
        "命名建议：别名首字母大写，集中放在头文件里定义，避免各处重复书写。"
      ],
      summary_en: [
        "A type alias gives a complex type a short name: `using ll = long long;`, `using StudentList = std::vector<Student>;`",
        "Prefer `using name = type;` in C++ (clearer and supports alias templates); typedef survives in legacy code.",
        "The value is one-place renaming: extract a verbose container type into StudentList and a future change touches one line.",
        "An alias creates no new type: `using Meter = double;` is exactly double, so the compiler won't stop you adding metres to seconds.",
        "Three frequent uses: function pointers, container iterators, and gnarly template types.",
        "Since C++11 `using` can define alias templates (typedef cannot) — common in generic code.",
        "Convention: capitalise alias names and define them in one place, typically a header."
      ],
      code: "using ll = long long;\nusing StudentList = std::vector<Student>;\nusing Iter = StudentList::iterator;      // 迭代器别名\ntypedef unsigned int uint;               // 旧写法，效果相同\n\ntemplate <class T>\nusing Vec = std::vector<T>;              // 别名模板（typedef 做不到）",
      pit: "用别名把语义不同的类型藏起来（Meter 与 Second 都是 double），编译器无法阻止你把它们相加——真需要区分就用独立类型。",
      pit_en: "Hiding semantically different types behind one alias (Meter and Second both double) lets the compiler happily add them — use distinct types when it matters.",
      ex: {
        q: "类型别名能给代码带来什么实际好处？",
        a: "把冗长类型名集中到一处，降低阅读成本，并让「换实现」只改一行——本质是降低耦合。",
        q_en: "What practical benefit do type aliases give?",
        a_en: "They centralise verbose type names, cut reading cost, and make swapping implementations a one-line change."
      }
    },

    "8-12": {
      target: "能判断 auto/decltype 推导出的实际类型，并说清什么时候不该用 auto。", target_en: "Predict the type that auto/decltype deduce and know when not to use auto.",
      title: "auto / decltype / 类型推导", title_en: "auto, decltype & type deduction", min: 10,
      summary: [
        "auto 让编译器从初始化表达式推导变量类型，减少冗长的类型书写，收益最大的是迭代器。",
        "auto 推导的是「值类型」——会丢弃引用与顶层 const；要保留就写 const auto &、auto & 或 auto &&。",
        "最常用组合：for (const auto &x : v)、auto it = m.find(k)。",
        "decltype(expr) 得到表达式的确切类型（保留引用与 const），常用于模板与泛型代码。",
        "decltype(auto) 与尾置返回类型（-> decltype(...)）能让函数的返回类型完全由推导决定，写泛型包装时很有用。",
        "auto 不是「弱类型」：推导结果在编译期就固定，并有完整类型检查；它省的是书写，不是类型。",
        "别滥用：类型不直观时显式写出来更利于阅读（例如 auto x = compute(); 看不出是 int 还是 double 时，写明更好）。"
      ],
      summary_en: [
        "`auto` deduces a variable's type from its initialiser; the biggest win is iterator types.",
        "auto deduces a value type — it drops references and top-level const. Write `const auto &` or `auto &` to keep them.",
        "Most common combinations: `for (const auto &x : v)` and `auto it = m.find(k)`.",
        "`decltype(expr)` yields the exact type of an expression, references and const included — handy in templates.",
        "`decltype(auto)` and trailing return types (`-> decltype(...)`) let a function's return type be fully deduced.",
        "auto is not weak typing: the deduced type is fixed at compile time and fully checked. It saves typing, not types.",
        "Don't overuse it — when the type is not obvious, spelling it out reads better."
      ],
      code: "std::map<std::string, int> m{{ \"a\", 1 }};\nauto it = m.find(\"a\");              // 迭代器：类型名极长\nfor (const auto &p : m) std::cout << p.second;\n\nconst auto &[k, v] = *it;            // C++17 结构化绑定\ndecltype(m) m2;                      // 与 m 同类型",
      pit: "用 auto 接一个返回引用的函数，结果得到的是副本（引用被丢掉）；本意要是引用，请写 auto & 或 decltype(auto)。",
      pit_en: "Using plain auto to receive a function that returns a reference silently copies; write `auto &` or `decltype(auto)` when you meant a reference.",
      ex: {
        q: "auto 与 decltype 的关键差别？",
        a: "auto 按「值」推导，会丢弃引用与顶层 const；decltype 保留表达式的完整类型信息（含引用与 const）。",
        q_en: "Key difference between auto and decltype?",
        a_en: "auto deduces a value type (dropping references and top-level const); decltype preserves the expression's exact type."
      }
    },

    "8-13": {
      target: "能一句话讲清 struct 与 class 的唯一区别，并据此决定一个类型该写成哪种。", target_en: "State the only difference between struct and class and use it to decide which to write.",
      title: "struct 与 class：唯一的区别", title_en: "struct vs class: the only difference", min: 10,
      summary: [
        "在 C++ 里 struct 与 class 只差**默认访问级别**：struct 的成员与继承默认 public，class 默认 private。",
        "也就是说 `struct S { int x; };` 与 `class S { public: int x; };` 几乎等价；成员函数、构造析构、继承、多态、模板等能力完全一样。",
        "行业惯例（不是语法要求）：纯数据用 struct，带行为与不变式的用 class。",
        "接口设计中常见组合：用 struct 做数据传输对象 / 配置 / 坐标点，用 class 做「有状态、需要保护内部一致性」的对象。",
        "标准库也遵循类似取向：有的类型偏数据（成员全部通过公开接口访问），自定义的小数据点则常用 struct。",
        "从 struct 升级为 class 是平滑的：把成员挪到 private、补构造函数与访问器即可，调用方写法基本不变。",
        "记住一句话：选择依据是「是否需要封装与不变式」，而不是「哪个更高级」。"
      ],
      summary_en: [
        "In C++, struct and class differ only in **default access level**: struct members (and base classes) default to public, class to private.",
        "So `struct S { int x; };` and `class S { public: int x; };` are nearly identical; member functions, constructors, inheritance, polymorphism and templates are all available to both.",
        "Convention (not syntax): plain data → struct; behaviour with invariants → class.",
        "A common split: structs for data-transfer objects, configuration and coordinates; classes for stateful objects whose internal consistency must be protected.",
        "The standard library follows a similar spirit, and small user-defined value types are often structs.",
        "Promoting a struct to a class is smooth: move members to private, add a constructor and accessors; call sites barely change.",
        "One line to remember: choose by whether you need encapsulation, not by which keyword sounds more advanced."
      ],
      code: "struct Point { double x, y; };          // 被动数据：公开即可\n\nclass Account {                          // 需要保护不变式 -> class\npublic:\n  explicit Account(double init) : bal_(init) {}\n  double balance() const { return bal_; }\n  void deposit(double v) { if (v > 0) bal_ += v; }   // 拒绝非法状态\nprivate:\n  double bal_{0};\n};",
      pit: "以为「class 比 struct 高级 / 更面向对象」，于是给纯数据结构也套上 class 再写一堆 getter/setter——只增加了噪声，没有增加任何安全。",
      pit_en: "Believing class is 'more advanced' and wrapping plain data in a class with getters and setters — that adds noise, not safety.",
      ex: {
        q: "struct 与 class 在 C++ 中真正的区别是什么？",
        a: "只有默认访问级别（以及默认继承方式）不同：struct 默认 public，class 默认 private；其它能力完全一致。",
        q_en: "What is the real difference between struct and class in C++?",
        a_en: "Only the default access level (and default inheritance): struct defaults to public, class to private. Everything else is identical."
      }
    },

    "8-14": {
      target: "能从需求出发设计一个 struct：定成员、算布局、选传参方式，并判断何时该升级成 class。", target_en: "Design a struct from requirements: choose members, reason about layout, pick a passing strategy, and know when to promote it to a class.",
      title: "本章综合：从一个 struct 到一次重构", title_en: "Chapter wrap-up: from struct to a small type", min: 16,
      summary: [
        "目标：把「学生成绩」从最朴素的散变量，逐步演进成一个可维护的小类型——这条路径就是真实项目里最常见的演进。",
        "第一步（数据聚合）：struct Student{name, score}，用数组或 vector 管理多个学生，先把功能跑通。",
        "第二步（表达约束）：成员转私有 + 构造函数校验（分数 0~100），让「非法状态」从入口就被拒绝。",
        "第三步（行为就近）：把「求平均」「排名」「是否及格」变成成员函数或就近的自由函数，避免同一逻辑散落多处。",
        "第四步（消除隐式拷贝与共享陷阱）：用 const 引用传参、用 vector 取代裸数组、必要时用智能指针。",
        "第五步（可扩展）：用枚举表达状态、用运算符重载支持比较与输出，代码开始像一个「真正的小类型」。",
        "自检清单：改一个字段要动几处？有没有可能出现非法状态？函数参数是否在无意拷贝？——这三个问题的答案就是你的重构方向。"
      ],
      summary_en: [
        "Goal: evolve 'student scores' from loose variables into a maintainable small type — the same path real projects take.",
        "Step 1 (aggregate): struct Student{name, score}, managed in an array or vector — get it working first.",
        "Step 2 (constraints): make members private and validate in the constructor (score 0–100), so illegal states are rejected at the door.",
        "Step 3 (behaviour nearby): average, ranking and pass/fail become members or nearby free functions instead of scattered logic.",
        "Step 4 (kill accidental copies and sharing): pass by const reference, prefer vector over raw arrays, use smart pointers when ownership is shared.",
        "Step 5 (extensibility): express state with an enum and support comparison/printing via operator overloading — now it behaves like a real type.",
        "Self-check: how many places change when a field changes? Can an illegal state exist? Are parameters being copied by accident? The answers point to your refactor."
      ],
      code: "class Student {\npublic:\n  Student(std::string n, double s) : name_(std::move(n)), score_(s) {\n    if (s < 0 || s > 100) throw std::invalid_argument(\"score out of range\");\n  }\n  const std::string &name() const { return name_; }\n  double score() const { return score_; }\n  bool pass() const { return score_ >= 60; }\nprivate:\n  std::string name_;\n  double score_;\n};\n\nbool operator<(const Student &a, const Student &b) { return a.score() < b.score(); }\nstd::vector<Student> v{{ \"Tom\", 88.5 }, { \"Ann\", 92 }};\nstd::sort(v.begin(), v.end());",
      pit: "一上来就追求「完美的类设计」，结果把简单问题复杂化；正确顺序是先让数据与流程跑通，再逐步把约束与行为收进类型。",
      pit_en: "Chasing a perfect class design up front over-complicates a simple problem; get the data and flow working, then pull constraints and behaviour into the type.",
      ex: {
        q: "把 struct 升级为 class 的动机通常是什么？",
        a: "需要保护内部不变式（拒绝非法状态）、隐藏实现细节、把行为与数据绑在一起——也就是真正需要封装的时候。",
        q_en: "What usually motivates promoting a struct to a class?",
        a_en: "A real need for encapsulation: protecting invariants, hiding implementation, and binding behaviour to data."
      }
    }
  },

  quizAdd: [
    { q: "struct { char c; int i; } 在 64 位平台上 sizeof 通常是？", o: ["5", "8", "4", "16"], a: 1,
      why: "为满足 int 的 4 字节对齐，编译器会在 c 之后插入 3 字节填充，总大小 8。",
      why_en: "To satisfy int's 4-byte alignment the compiler inserts 3 padding bytes after c, so the total size is 8.",
      q_en: "What is sizeof(struct { char c; int i; }) typically on a 64-bit platform?", o_en: ["5", "8", "4", "16"] },
    { q: "通过结构体指针访问成员应使用哪个运算符？", o: [".", "->", "::", "*"], a: 1,
      why: "指针用 ->，它等价于先解引用再取成员 (*p).name。",
      why_en: "Pointers use ->, which is exactly (*p).name written the other way.",
      q_en: "Which operator accesses a member through a struct pointer?", o_en: ["`.`", "`->`", "`::`", "`*`"] },
    { q: "函数希望「只读且不拷贝」地接收一个大结构体，应使用？", o: ["按值传 Student", "Student&", "const Student&", "Student*"], a: 2,
      why: "const 引用既避免拷贝，又承诺不修改调用者的对象。",
      why_en: "A const reference avoids the copy and promises not to modify the caller's object.",
      q_en: "To receive a large struct read-only without copying, use?", o_en: ["By value", "Student&", "const Student&", "Student*"] },
    { q: "enum class 相比普通 enum 的关键改进是？", o: ["更省内存", "作用域受限且不隐式转整数", "可以继承", "速度更快"], a: 1,
      why: "enum class 的成员需要 Color::RED 限定，且必须 static_cast 才能转成整数。",
      why_en: "enum class members need a Color::RED qualifier and only convert to int through static_cast.",
      q_en: "The key improvements of enum class over plain enum?", o_en: ["Smaller memory", "Scoped and no implicit int conversion", "It can be inherited", "Faster"] },
    { q: "结构体里含裸指针成员并按值拷贝，最直接的后果是？", o: ["编译错误", "两份对象共享同一块内存，可能重复释放", "自动深拷贝", "内存变多"], a: 1,
      why: "默认拷贝是浅拷贝，只复制指针值，析构时会 double free。",
      why_en: "The default copy is shallow: it copies the pointer value, so destruction frees the same memory twice.",
      q_en: "Copying a struct that owns a raw pointer by value most directly causes?", o_en: ["A compile error", "Two objects sharing one block and a possible double free", "An automatic deep copy", "More memory use"] },
    { q: "关于 union，下列说法正确的是？", o: ["所有成员同时有效", "大小等于成员大小之和", "同一时刻只有最后写入的成员有效", "可以放 std::string 且无需特殊处理"], a: 2,
      why: "union 成员共享内存，只有最后写入的成员是有效的；含非平凡构造/析构的类型需要手工管理生命周期。",
      why_en: "Union members share storage, so only the last one written is valid; types with non-trivial construction or destruction need manual lifetime management.",
      q_en: "Which statement about union is correct?", o_en: ["All members are simultaneously valid", "Its size is the sum of members", "Only the last written member is valid", "std::string is fine with no special handling"] }
  ],

  terms: [
    { term: "内存对齐", term_en: "Memory Alignment", cat: "C++ 系统深入",
      short: "成员的起始地址必须是自身大小的整数倍，编译器为此插入填充字节。",
      short_en: "A member must start at an address that is a multiple of its size; the compiler inserts padding bytes for this.",
      detail: ["对齐让 CPU 能用一次总线周期读到数据，未对齐访问可能变慢甚至崩溃。", "offsetof 与 sizeof 是核对布局的两个工具。"],
      detail_en: ["Alignment lets the CPU fetch a member in one bus cycle; misaligned access can be slower or even fault.", "sizeof and offsetof are the two tools for checking a layout."],
      vs: "对齐换速度，packed 换空间。", vs_en: "Alignment buys speed; packing buys space." },
    { term: "填充字节", term_en: "Padding", cat: "C++ 系统深入",
      short: "为满足对齐要求而在成员之间或末尾插入的空白字节。",
      short_en: "Blank bytes inserted between members or at the end to satisfy alignment.",
      detail: ["填充不计入成员大小，但计入 sizeof。", "成员从大到小排列通常能减少填充。"],
      detail_en: ["Padding is not part of any member but it does count toward sizeof.", "Declaring members from largest to smallest usually reduces padding."],
      vs: "填充是布局的副产品，packed 才会取消它。", vs_en: "Padding is a layout side effect; packed removes it." },
    { term: "浅拷贝", term_en: "Shallow Copy", cat: "C++ 系统深入",
      short: "逐成员复制；指针成员只复制地址，导致两份对象共享同一块内存。",
      short_en: "Member-wise copying; pointer members copy only the address, so two objects share one block.",
      detail: ["后果：互相影响、重复释放、悬空指针。", "默认的拷贝构造与赋值都是浅拷贝。"],
      detail_en: ["Consequences: the two objects affect each other, memory is freed twice, pointers dangle.", "The default copy constructor and copy assignment are both shallow."],
      vs: "浅拷贝共享资源，深拷贝各自独立。", vs_en: "Shallow copies share; deep copies are independent." },
    { term: "深拷贝", term_en: "Deep Copy", cat: "C++ 系统深入",
      short: "为指针成员重新分配内存并复制内容，使两个对象完全独立。",
      short_en: "Reallocates and copies the pointed-to data so the two objects are fully independent.",
      detail: ["手写时要同时处理自赋值与异常安全。", "更省心的办法是让成员自己用 RAII 类型。"],
      detail_en: ["Hand-writing one means also handling self-assignment and exception safety.", "The easier route is letting members be RAII types that copy themselves."],
      vs: "深拷贝解决共享，移动语义解决拷贝。", vs_en: "Deep copy fixes sharing; move semantics avoids copying." },
    { term: "三法则 / 五法则", term_en: "Rule of Three / Five", cat: "C++ 系统深入",
      short: "需要自定义析构、拷贝构造、拷贝赋值之一时，通常三个都要；C++11 后加上移动操作成为五法则。",
      short_en: "If you need any of destructor, copy constructor or copy assignment, you usually need all three — plus moves, making five in C++11.",
      detail: ["因为它们共同管理同一份资源。", "「零法则」更省心：成员都用现成的 RAII 类型，五个函数一个都不用写。"],
      detail_en: ["Because all of them exist to manage the same single resource.", "The rule of zero is nicer: use ready-made RAII members and write none of the five."],
      vs: "三/五法则管手写资源类，零法则管现代写法。", vs_en: "The rule of three/five is for hand-written resource classes; the rule of zero is the modern default." },
    { term: "RAII", term_en: "RAII", cat: "C++ 系统深入",
      short: "资源获取即初始化：构造时获取、析构时释放，把资源生命周期绑到对象生命周期。",
      short_en: "Resource acquisition is initialisation: acquire in the constructor, release in the destructor.",
      detail: ["异常路径也会正确释放（栈展开保证析构）。", "例子：string、vector、fstream、lock_guard、unique_ptr。"],
      detail_en: ["Resources are released on the exception path too, because unwinding runs destructors.", "Examples: string, vector, fstream, lock_guard, unique_ptr."],
      vs: "RAII 从结构上消除泄漏，手工成对释放靠自觉。", vs_en: "RAII removes leaks structurally; manual pairs rely on discipline." },
    { term: "类型双关", term_en: "Type Punning", cat: "C++ 系统深入",
      short: "把同一段内存用不同类型去解释（如用 union 把 float 当 int 读）。",
      short_en: "Reinterpreting the same bytes as another type (e.g. reading a float as an int through a union).",
      detail: ["C++ 里读未激活的 union 成员属于未定义行为。", "安全替代：bit_cast（C++20）或 memcpy。"],
      detail_en: ["In C++ reading an inactive union member is undefined behaviour.", "Safe alternatives: std::bit_cast (C++20) or memcpy."],
      vs: "类型双关看字节，类型转换看数值。", vs_en: "Punning reinterprets bytes; conversion changes the value." },
    { term: "端序", term_en: "Endianness", cat: "C++ 系统深入",
      short: "多字节数据在内存里的字节顺序：小端低位在前，大端高位在前。",
      short_en: "Byte order of multi-byte data: little-endian puts the low byte first, big-endian the high byte first.",
      detail: ["跨平台协议必须显式约定并转换。", "检测手法：读 uint16_t(1) 的首字节。"],
      detail_en: ["Cross-platform protocols must state the byte order explicitly and convert.", "Detection trick: read the first byte of a uint16_t holding 1."],
      vs: "端序影响字节的解释，对齐影响字节的位置。", vs_en: "Endianness orders bytes; alignment positions them." },
    { term: "const 正确性", term_en: "const Correctness", cat: "C++ 系统深入",
      short: "把「只读」写进类型系统：const 成员函数与 const 引用让误改在编译期被发现。",
      short_en: "Encoding read-only intent in the type system so accidental writes are caught at compile time.",
      detail: ["const 成员函数里的 this 是 const 指针。", "逻辑上不算改状态的缓存可用 mutable。"],
      detail_en: ["Inside a const member function, this is a pointer to const.", "Caches that are not observable state may be marked mutable."],
      vs: "const 是承诺，mutable 是受控的例外。", vs_en: "const is a promise; mutable is a controlled exception." },
    { term: "不变量", term_en: "Invariant", cat: "C++ 系统深入",
      short: "对象必须始终成立的条件（余额非负、状态合法）。",
      short_en: "A condition that must always hold for an object (balance non-negative, state valid).",
      detail: ["构造函数负责建立，成员函数负责维持。", "封装的真正目的就是守住不变量。"],
      detail_en: ["Constructors establish it; member functions must maintain it.", "Protecting the invariant is the real purpose of encapsulation."],
      vs: "不变量是「永远成立」，校验是「入口检查」。", vs_en: "An invariant always holds; validation happens at the door." },
    { term: "封装", term_en: "Encapsulation", cat: "C++ 系统深入",
      short: "对外承诺稳定接口，对内自由实现——接口不变则内部可任意重写。",
      short_en: "Promise a stable interface and keep implementation free to change.",
      detail: ["成员私有、只暴露必要方法、不返回内部指针或可变引用。", "每暴露一个接口就多一份长期维护义务。"],
      detail_en: ["Members private, expose only the methods needed, never return internal pointers or mutable references.", "Every public interface you publish is another long-term maintenance duty."],
      vs: "封装是设计接口，不是把变量改个名字。", vs_en: "Encapsulation is interface design, not renaming a variable." },
    { term: "作用域枚举", term_en: "Scoped Enum", cat: "C++ 系统深入",
      short: "enum class：成员需用 Color::RED 限定，且不隐式转成整数。",
      short_en: "enum class: members need Color::RED qualification and never convert to int implicitly.",
      detail: ["可指定底层类型控制大小与符号。", "新代码默认选它，普通 enum 留给互通场景。"],
      detail_en: ["You can fix the underlying type to control size and signedness.", "Choose it by default in new code; plain enum is for interop."],
      vs: "作用域枚举更安全，普通枚举更宽松。", vs_en: "Scoped enums are safer; plain enums are looser." }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "类内默认值（C++11）": "in-class default member value (C++11)",
    "聚合初始化：按声明顺序": "aggregate initialisation: in declaration order",
    "值拷贝：逐成员复制": "value copy: member by member",
    "改 b 不影响 a": "editing b leaves a alone",
    "sizeof = 8（3 字节填充）": "sizeof = 8 (3 bytes of padding)",
    "sizeof = 8（尾部填充）": "sizeof = 8 (tail padding)",
    "5（但访问更慢）": "5 (but access is slower)",
    "等价于 (*p).score = 95.0": "the same as (*p).score = 95.0",
    "结构体数组的指针": "a pointer to an array of structs",
    "数组元素用 . ；裸指针用 ->": "array elements use . ; a bare pointer uses ->",
    "只读 + 不拷贝": "read-only + no copying",
    "要改 -> 非 const 引用": "needs to modify -> non-const reference",
    "只读 -> const 引用": "read-only -> const reference",
    "含裸指针成员 -> 危险": "holds a raw pointer member -> dangerous",
    "浅拷贝：b.data 与 a.data 是同一块": "shallow copy: b.data and a.data are the same block",
    "正确方向：让成员自己管理资源": "the right direction: let the members own their resources",
    "必须显式转换": "an explicit cast is required",
    "int x = Color::RED;                // ✗ 编译错误：不会隐式转换": "int x = Color::RED;                // ✗ compile error: no implicit conversion",
    "按 int 解释同一段字节": "reads the very same bytes as an int",
    "带标记的 union": "a tagged union",
    "小端：低字节在前": "little-endian: low byte first",
    "位级转换用 bit_cast 而不是 union": "use bit_cast, not a union, for bit-level conversion",
    "类型安全版 union": "the type-safe version of union",
    "迭代器别名": "an iterator alias",
    "旧写法，效果相同": "the old spelling, exactly the same effect",
    "别名模板（typedef 做不到）": "an alias template (typedef cannot do this)",
    "迭代器：类型名极长": "iterator: the type name is enormous",
    "C++17 结构化绑定": "C++17 structured binding",
    "与 m 同类型": "the same type as m",
    "被动数据：公开即可": "passive data: public is enough",
    "需要保护不变式 -> class": "must protect an invariant -> class",
    "拒绝非法状态": "rejects illegal states"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_S8);
