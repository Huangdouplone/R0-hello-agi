/* ================================================================
 * R0:hello agi · 课程深化层 ②：面向对象基础（s9）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把 s9 从「7 节 × 3 要点」深化为「12 节 × 6~7 要点」：
 *       类与对象 → 访问控制 → 封装与不变量 → 构造函数（初始化列表/委托/explicit）
 *       → 析构与 RAII → this → 静态成员 → const 正确性 → 深浅拷贝 → 三/五法则与移动语义。
 *
 * 叠加层约定同 agi-deepen-s8.js：既有 id（9-1…9-7）保留，新增节用新 id（9-8…9-12）。
 * ================================================================ */

const DEEPEN_S9 = {
  stage: "s9",
  desc: "从「会用类」到「会设计类」：封装与不变量、构造析构、const 正确性、拷贝与移动语义",
  desc_en: "From using classes to designing them: encapsulation and invariants, construction, const correctness, copy and move semantics",
  goal: "能设计带不变式的类，正确使用初始化列表、this、静态成员与 const 成员函数，并说清默认拷贝什么时候会出错、RAII 如何消除资源泄漏。",
  goal_en: "Design classes with invariants, use initialiser lists, this, static members and const member functions correctly, and explain when default copying breaks and how RAII removes leaks.",

  order: ["9-1","9-2","9-3","9-4","9-5","9-6","9-7","9-8","9-9","9-10","9-11","9-12"],

  lessons: {
        "9-1": {
      title: "类与对象", title_en: "Classes and objects", min: 12,
      summary: [
        "类是「自定义类型 + 行为」的蓝图；对象是它的实例，每个对象拥有独立的一份成员数据。",
        "类体内的成员函数可以直接访问成员变量，不需要传参——调用时编译器会自动把当前对象传进去（就是 this）。",
        "成员函数定义在类外时写成 返回值 类名::函数名(...)，告诉编译器它属于哪个类。",
        "创立对象 = 分配内存 + 执行构造函数；对象销毁 = 执行析构函数 + 回收内存，这两步都由编译器保证成对发生。",
        "类与结构体一样是值类型：A b = a; 是逐成员拷贝（除非你自定义了拷贝语义）。",
        "声明与实现分离（头文件放声明、源文件放实现）是 C++ 工程化的基础，可避免重复定义与编译依赖蔓延。",
        "判断「要不要建类」的标准：这组数据是否需要被保护的约束、是否有明确的行为、是否会被多处复用。",
        "衔接：上一章用 struct 与 class 的区别收尾；本章从类与对象开始，把封装落到代码。"
      ],
      summary_en: [
        "A class is a blueprint for a user-defined type plus behaviour; an object is an instance with its own copy of the data members.",
        "Member functions access members directly — the compiler implicitly passes the current object (this).",
        "Out-of-class definitions use ReturnType ClassName::func(...) to say which class they belong to.",
        "Creating an object = allocate + run the constructor; destroying = run the destructor + free — always paired by the compiler.",
        "Like structs, classes are value types: A b = a; copies member by member unless you define otherwise.",
        "Separating declaration (header) from definition (source) is the basis of C++ build hygiene.",
        "Ask before creating a class: does this data need protected invariants, clear behaviour, and reuse in several places?",
        "Bridge: last chapter closed with struct vs class; this one starts classes and objects, turning encapsulation into code."
      ],
      code: "class Counter {\npublic:\n  void inc();                        // 声明\n  int value() const { return n_; }\nprivate:\n  int n_{0};\n};\n\nvoid Counter::inc() { ++n_; }        // 类外定义：必须写 Counter::\n\nCounter c;\nc.inc();\nstd::cout << c.value();",
      pit: "在类外定义成员函数时漏写「类名::」，函数就变成了普通自由函数——链接时反而报「未定义引用」这类链接错误。",
      pit_en: "Omitting ClassName:: in an out-of-class definition turns it into an unrelated free function; the link error points far from the real cause.",
      ex: {
        q: "成员函数为什么能直接使用成员变量名？",
        a: "因为调用时编译器隐式传入了 this（当前对象地址），成员访问实际上等价于 this->成员。",
        q_en: "Why can a member function use member names directly?",
        a_en: "The compiler implicitly passes this, so member access is really this->member."
      }
    },

    "9-2": {
      title: "访问修饰符", title_en: "Access specifiers", min: 10,
      summary: [
        "public / protected / private 决定「谁能访问」：public 给所有代码，private 只给本类，protected 给本类与派生类。",
        "默认值：class 是 private，struct 是 public；书写时想切换级别，再写一次修饰符即可。",
        "它的意义是「接口与实现分离」：暴露出去的是承诺，藏起来的是可以随时改的实现细节。",
        "成员数据一般设为 private，只通过成员函数读写——只有这样才可能在读写时做校验、守住不变量。",
        "友元（friend）能临时开一扇门，但它破坏封装，应尽量少用（s10 详述）。",
        "修饰符可以分段、重复出现，但把 public 接口统一放类顶部是通行做法，阅读时一眼看到能力清单。",
        "最常见的误用是把成员全部 public，等于放弃封装：之后任何外部改动都可能破坏对象内部一致性。"
      ],
      summary_en: [
        "public / protected / private decide who may access: public for everyone, private for the class itself, protected for the class and its derived classes.",
        "Defaults: class is private, struct is public; write the specifier again to switch back.",
        "The point is separating interface from implementation: what is exposed is a promise, what is hidden can change freely.",
        "Data members are usually private with member functions as the only route in — that is what makes validation and invariants possible.",
        "friend can open a door temporarily but breaks encapsulation — use sparingly (see s10).",
        "Specifiers may repeat; putting the public interface at the top is the common convention so the capability list is visible at a glance.",
        "The classic misuse is making everything public, which abandons encapsulation entirely."
      ],
      code: "class Account {\npublic:                              // 接口（承诺）\n  double balance() const { return bal_; }\n  void deposit(double v);\nprivate:                             // 实现（可改）\n  double bal_{0};\n  bool valid(double v) const { return v > 0; }\n};\n\ninline void Account::deposit(double v) { if (valid(v)) bal_ += v; }",
      pit: "给每个成员都写一对 getter/setter，就以为实现了封装——真正的封装是「不暴露能破坏不变式的入口」，而不是把变量名换一种写法。",
      pit_en: "Writing a getter/setter pair for every member is not encapsulation; real encapsulation is not exposing entries that can break invariants.",
      ex: {
        q: "把成员设为 private 的实际收益是什么？",
        a: "外部只能通过你设计的入口修改状态，于是你获得了「校验与维持不变式」的机会——这是软件可维护性的核心。",
        q_en: "What is the practical benefit of private members?",
        a_en: "External code can only change state through the entries you designed, giving you a place to validate and keep invariants."
      }
    },

    "9-3": {
      title: "封装：接口与实现的分离", title_en: "Encapsulation: Separating Interface from Implementation", min: 12,
      summary: [
        "封装的本质不是「藏起来」，而是「承诺一个稳定的接口」——接口不变，内部实现可以任意重写。",
        "判断接口好坏的一句话标准：能否用一句话说明这个类负责什么？调用方是否不必了解内部结构？",
        "具体手法：成员私有、只暴露必要方法、返回 const 引用或值而不返回内部指针、不提供能绕过校验的 setter。",
        "「不变量」（invariant）是对象必须始终成立的条件（余额非负、状态机处于合法状态）：构造函数负责建立，成员函数负责维持。",
        "不要通过接口暴露内部容器（比如返回 std::vector&），否则调用方能任意改动内部结构；返回副本或只读视图。",
        "接口要避免「为未来可能的需求」提前暴露——每暴露一个方法就多一份长期维护义务。",
        "自检方法：把所有 public 成员读一遍，如果外部能靠它们让对象进入非法状态，说明封装有洞。"
      ],
      summary_en: [
        "Encapsulation is not hiding for its own sake — it is promising a stable interface while the implementation stays free to change.",
        "A one-sentence test: can you state what this class is responsible for, and does the caller need to know its internals?",
        "Techniques: private members, only the necessary methods, return const references or values rather than internal pointers, no setters that bypass validation.",
        "An invariant is a condition that must always hold (balance non-negative, state valid): the constructor establishes it and member functions maintain it.",
        "Never expose internal containers (e.g. returning std::vector&), or callers can corrupt the structure — return a copy or a read-only view.",
        "Avoid exposing methods 'just in case'; every public method is a long-term maintenance obligation.",
        "Self-check: walk the public members — can external code drive the object into an illegal state? If so, encapsulation has a hole."
      ],
      code: "class Stack {                         // 只暴露栈该有的行为\npublic:\n  void push(int v) { v_.push_back(v); }\n  int pop() {\n    if (empty()) throw std::out_of_range(\"pop on empty stack\");\n    int v = v_.back(); v_.pop_back(); return v;\n  }\n  bool empty() const { return v_.empty(); }\n  std::size_t size() const { return v_.size(); }\nprivate:\n  std::vector<int> v_;                // 内部结构对外不可见\n};",
      pit: "一边把成员设成 private，一边提供 int* raw() 这类接口——封装形同虚设，外部照样能改坏内部状态。",
      pit_en: "Making members private but exposing int* raw() defeats the purpose entirely.",
      ex: {
        q: "「接口稳定、实现自由」为什么对长期维护极其重要？",
        a: "调用方只依赖接口，内部重构不会波及调用方，改动成本与引入 bug 的风险都大幅下降。",
        q_en: "Why does 'stable interface, free implementation' matter so much long term?",
        a_en: "Callers depend only on the interface, so internal refactoring does not ripple outward — far lower cost and risk."
      }
    },

    "9-4": {
      title: "构造函数", title_en: "Constructors", min: 12,
      summary: [
        "构造函数在对象创建时自动调用，唯一职责是把对象初始化到一个合法可用的状态；名字与类同名、没有返回类型。",
        "初始化列表（member initializer list）在进入函数体之前初始化成员，比在函数体里赋值更高效，对 const/引用成员则是必须的。",
        "成员的初始化顺序由**声明顺序**决定，与初始化列表的书写顺序无关——顺序写反会造成「用未初始化的成员去初始化另一个」。",
        "默认构造、带参构造、拷贝构造各司其职；一旦写了带参构造，编译器就不再生成默认构造（需要时写 = default 要回来）。",
        "explicit 阻止单参构造被隐式用作类型转换，避免「一个整数悄悄变成对象」这类意外。",
        "委托构造（一个构造函数调用同类的另一个构造函数）用来消除重复的初始化代码。",
        "判断是否必须用初始化列表的硬性依据：类里有引用成员或 const 成员。"
      ],
      summary_en: [
        "A constructor runs automatically at creation; its job is to bring the object into a valid, usable state. Same name as the class, no return type.",
        "A member initialiser list runs before the body — more efficient than assignment inside the body, and mandatory for const/reference members.",
        "Initialisation order follows **declaration order**, not the order you write in the list; getting this wrong means initialising one member from another that is not ready.",
        "Default, parameterised and copy constructors each have a role; once you write a parameterised one the compiler stops generating the default (write `= default` to restore it).",
        "`explicit` blocks a single-argument constructor from being used as an implicit conversion.",
        "Delegating constructors call another constructor of the same class to avoid duplicated initialisation.",
        "Hard rule for initialiser lists: reference members and const members leave you no choice."
      ],
      code: "class Student {\npublic:\n  Student() = default;                                      // 显式要回默认构造\n  explicit Student(std::string n) : name_(std::move(n)) {}   // explicit 防隐式转换\n  Student(std::string n, double s) : Student(std::move(n)) { setScore(s); }  // 委托构造\nprivate:\n  std::string name_;                                        // 先声明 → 先初始化\n  double score_{0};\n  void setScore(double s) {\n    if (s < 0 || s > 100) throw std::invalid_argument(\"score out of range\");\n    score_ = s;\n  }\n};",
      pit: "在构造函数体里「赋值」而不是用初始化列表：成员先被默认构造一次再被覆盖，多一次构造开销；而 const 成员与引用成员会直接编译不过。",
      pit_en: "Assigning in the body instead of using the initialiser list default-constructs then overwrites (extra work), and const/reference members will not compile at all.",
      ex: {
        q: "为什么初始化顺序以声明顺序为准？",
        a: "对象的内存按声明顺序构造，这是标准规定；初始化列表只决定「怎么写初始化表达式」，不改变实际构造顺序。",
        q_en: "Why does initialisation follow declaration order?",
        a_en: "The standard defines construction in declaration order; the initialiser list only says how, not when."
      }
    },

    "9-5": {
      title: "初始化列表与委托构造", title_en: "Initialiser lists & delegating constructors", min: 10,
      summary: [
        "写法：冒号后面、函数体之前——Student(std::string n) : name_(std::move(n)), score_(0) {}",
        "三个必须用的场景：const 成员、引用成员、以及没有默认构造函数的类类型成员。",
        "配合 std::move 可以把临时字符串「搬」进成员，避免一次深拷贝（移动语义见 9-12）。",
        "委托构造让一个构造函数把初始化交给另一个构造函数，消除复制粘贴的初始化逻辑。",
        "C++11 起支持类内成员默认值（double score_{0};）：初始化列表优先，没有列表时用类内默认值。",
        "编译器的 -Wreorder 警告能自动发现「初始化列表顺序与声明顺序不一致」这类隐患，建议开启。",
        "一句话总结：能在初始化列表里完成的，就不要拖到函数体里做。"
      ],
      summary_en: [
        "Syntax: after the colon, before the body — `Student(std::string n) : name_(std::move(n)), score_(0) {}`.",
        "Three mandatory cases: const members, reference members, and class-type members without a default constructor.",
        "Pairing with std::move moves a temporary string into the member and avoids a deep copy (see 9-12).",
        "Delegating constructors hand initialisation to another constructor, removing copy-pasted setup.",
        "Since C++11 you can give in-class default member values; the list wins when present.",
        "The compiler's -Wreorder warning catches list/declaration order mismatches — turn it on.",
        "Summary: whatever can happen in the initialiser list should not happen in the body."
      ],
      code: "class Rect {\npublic:\n  Rect(double w, double h) : w_(w), h_(h) {}\n  Rect() : Rect(1, 1) {}                  // 委托：默认 1x1\n  Rect(const Rect &) = default;           // 显式要拷贝构造\nprivate:\n  const double w_;                        // const 成员 → 必须用初始化列表\n  double h_{1};\n};",
      pit: "初始化列表里把成员顺序写反（例如先写 b_ 再写 a_），编译器按声明顺序执行，结果与直觉不符却很难察觉。",
      pit_en: "Writing the list out of declaration order quietly produces a different result than the code suggests.",
      ex: {
        q: "哪些成员必须在初始化列表里初始化？",
        a: "const 成员、引用成员，以及没有默认构造函数的类类型成员——它们没有「先默认构造再赋值」这条路可走。",
        q_en: "Which members must be initialised in the list?",
        a_en: "const members, reference members, and class-type members with no default constructor."
      }
    },

    "9-6": {
      title: "析构函数", title_en: "Destructors", min: 10,
      summary: [
        "析构函数在对象生命周期结束时自动调用，用来释放该对象持有的资源：内存、文件句柄、锁、连接。",
        "名字是 ~类名()，无参数、无返回值、不能重载——一个类只有一个析构函数。",
        "类不持有需要手工释放的资源时可以不写析构（编译器生成空的）；一旦出现 new，就必须配对 delete 或改用智能指针。",
        "析构顺序与构造顺序相反：后构造的先析构，这在成员之间有依赖关系时很重要。",
        "若类会被继承，且可能通过基类指针删除派生对象，基类析构必须是 virtual（见 s10-8），否则派生部分不会被析构。",
        "析构函数里不要让异常逃出去（C++11 起析构默认 noexcept）——释放失败应记录而不是抛出。",
        "判断是否需要析构的提问方式：「它拥有什么需要归还的东西？」——拥有资源才需要析构。"
      ],
      summary_en: [
        "A destructor runs automatically at the end of an object's life to release what it owns: memory, file handles, locks, connections.",
        "It is `~ClassName()`, takes no arguments, returns nothing and cannot be overloaded — one per class.",
        "If the class owns nothing to release you can omit it; once `new` appears you must pair `delete` or switch to smart pointers.",
        "Destruction runs in reverse order of construction — relevant when members depend on each other.",
        "If the class can be inherited and deleted through a base pointer, the base destructor must be virtual (s10-8).",
        "Never let an exception escape a destructor (noexcept since C++11) — log the failure instead.",
        "Ask: what does this object own that must be returned? Owning resources is what requires a destructor."
      ],
      code: "class FileGuard {\npublic:\n  explicit FileGuard(const char *p) : f_(std::fopen(p, \"r\")) {}\n  ~FileGuard() { if (f_) std::fclose(f_); }     // 离开作用域自动关闭\n  FileGuard(const FileGuard &) = delete;         // 禁止拷贝，避免重复关闭\n  FileGuard &operator=(const FileGuard &) = delete;\n  bool ok() const { return f_ != nullptr; }\nprivate:\n  std::FILE *f_{nullptr};\n};",
      pit: "在析构函数里抛异常：栈展开过程中再有异常逃出会直接终止程序，比泄漏更难排查。",
      pit_en: "Throwing from a destructor during stack unwinding terminates the program — harder to diagnose than a leak.",
      ex: {
        q: "基类析构函数为什么必须是 virtual？",
        a: "通过基类指针 delete 派生对象时，只有虚析构才能让派生类的析构也被调用，否则派生部分的资源会泄漏。",
        q_en: "Why must a base destructor be virtual?",
        a_en: "Deleting a derived object through a base pointer only runs the derived destructor if the base destructor is virtual."
      }
    },

    "9-7": {
      title: "RAII 与资源生命周期", title_en: "RAII and resource lifetime", min: 12,
      summary: [
        "RAII = 资源获取即初始化：把资源的生命周期绑定到对象的生命周期——构造时获取、析构时释放。",
        "它解决的是「忘记释放」与「异常路径漏释放」：无论正常返回还是抛异常，栈对象的析构都会执行。",
        "标准库里的 RAII 例子：std::string、std::vector、std::fstream、std::lock_guard、std::unique_ptr。",
        "写 RAII 类的要点：构造负责获取（失败就抛异常）、析构负责释放（不抛异常）、拷贝语义必须明确（通常禁用或实现深拷贝/移动）。",
        "std::lock_guard 是最有说服力的例子：构造时加锁、析构时解锁，从此不可能忘记解锁。",
        "有了 RAII，代码里几乎不再需要手写 delete——这也是「现代 C++ 少用裸 new」的根本原因。",
        "排查泄漏的思路：凡是「成对出现」的操作（new/delete、open/close、lock/unlock），都应该被包进一个 RAII 类。"
      ],
      summary_en: [
        "RAII ties a resource's lifetime to an object's lifetime: acquire in the constructor, release in the destructor.",
        "It removes 'forgot to release' and 'leaked on the exception path': destructors of stack objects always run.",
        "Standard-library examples: std::string, std::vector, std::fstream, std::lock_guard, std::unique_ptr.",
        "To write one: acquire in the constructor (throw on failure), release in the destructor (never throw), and define copy semantics deliberately.",
        "std::lock_guard is the most convincing example: locks on construction, unlocks on destruction — impossible to forget.",
        "With RAII you almost never write delete by hand — the real reason modern C++ avoids raw new.",
        "Debugging rule: any paired operation (new/delete, open/close, lock/unlock) belongs inside an RAII class."
      ],
      code: "void work(const std::string &path) {\n  std::ifstream in(path);              // RAII：离开作用域自动关闭\n  std::lock_guard<std::mutex> lk(mtx); // RAII：异常路径也会解锁\n  std::vector<int> buf(1024);          // RAII：自动释放堆内存\n  if (!in) throw std::runtime_error(\"open failed\");   // 抛异常也不会泄漏\n  // ... 不需要任何 cleanup 代码\n}",
      pit: "手工成对书写 new/delete、lock/unlock：一旦中间提前 return 或抛异常，就漏掉释放或死锁——这类 bug 用 RAII 可以从结构上消除。",
      pit_en: "Manual new/delete or lock/unlock pairs leak or deadlock on an early return or throw — RAII removes the class of bug entirely.",
      ex: {
        q: "RAII 为什么天然具备异常安全性？",
        a: "栈展开保证局部对象的析构一定被调用：无论正常返回还是抛异常，资源都会被释放。",
        q_en: "Why is RAII inherently exception-safe?",
        a_en: "Stack unwinding guarantees destructors run, whether the function returns normally or throws."
      }
    },

    "9-8": {
      target: "能说出 this 什么时候出现、为什么 const 成员函数里的 this 是指向 const 的指针。", target_en: "Say when this is used and why it is a pointer-to-const inside a const member function.",
      title: "this 指针", title_en: "The this pointer", min: 10,
      summary: [
        "每个非静态成员函数都有一个隐式的 this 指针，指向「调用这个函数的对象」。",
        "用途一：区分成员与同名的参数或局部变量（this->score = score;）。",
        "用途二：返回自身以支持链式调用（return *this;）。",
        "用途三：在成员函数里把自身传出去（注册回调、自注册到容器），但要格外注意对象生命周期。",
        "静态成员函数没有 this（它不属于任何对象），因此在里面不能直接访问非静态成员。",
        "const 成员函数里的 this 是「指向 const 对象的指针」，所以不能修改成员——这正是 const 正确性的底层机制（9-11）。",
        "不要返回指向局部对象的引用，也不要把 this 存到比对象存活更久的地方。"
      ],
      summary_en: [
        "Every non-static member function has an implicit `this` pointing at the object it was called on.",
        "Use one: disambiguate a member from a same-named parameter (`this->score = score;`).",
        "Use two: return `*this` to enable chained calls.",
        "Use three: hand the object out (callbacks, self-registration) — watch the lifetime carefully.",
        "Static member functions have no this, so they cannot touch non-static members directly.",
        "In a const member function, this points to a const object, which is exactly why members cannot be modified (9-11).",
        "Never return a reference to a local, and never store this beyond the object's lifetime."
      ],
      code: "class Buf {\npublic:\n  Buf &append(const std::string &s) { data_ += s; return *this; }   // 链式调用\n  Buf &set(int n) { this->n_ = n; return *this; }                   // 区分同名参数\n  int n() const { return n_; }                                      // this 是 const Buf*\nprivate:\n  std::string data_; int n_{0};\n};\n\nBuf b;\nb.append(\"a\").append(\"b\").set(3);",
      pit: "成员函数返回 *this 的引用，但对象是局部变量——调用方拿到的是悬空引用；链式调用要确保被调用对象仍然存活。",
      pit_en: "Returning a reference to `*this` from a function whose object is a temporary gives the caller a dangling reference.",
      ex: {
        q: "静态成员函数里为什么不能用 this？",
        a: "静态成员函数不属于任何对象、没有隐含的调用对象，因此根本不存在 this。",
        q_en: "Why can't a static member function use this?",
        a_en: "It belongs to no object, so there is no implicit call target and no this."
      }
    },

    "9-9": {
      target: "能用 static 成员表达「属于类而不属于对象」的数据与函数，并避开初始化与共享的坑。", target_en: "Use static members for data and functions that belong to the class, avoiding the initialisation and sharing traps.",
      title: "静态成员 static", title_en: "Static members", min: 10,
      summary: [
        "静态成员变量属于**类**而不属于对象：所有对象共享同一份，常用于计数器、共享配置、单例实例。",
        "静态成员变量必须在类外定义一次（C++17 起可用 inline static 在类内直接定义）——忘了定义会得到链接错误。",
        "静态成员函数没有 this，只能访问静态成员，通常用作「类级别的工具方法」或工厂方法。",
        "类的静态常量（static constexpr）适合定义类的常量，编译期即可使用。",
        "访问方式：类名::成员 更能表达「这是类级别的」，用对象访问虽合法但不推荐。",
        "注意初始化顺序问题：不同编译单元里的静态变量初始化顺序不确定，不要让它们互相依赖。",
        "单例模式是静态成员的典型应用，但要注意线程安全与可测试性——能不单例就不单例。"
      ],
      summary_en: [
        "A static data member belongs to the class, not to objects: all objects share one copy — counters, shared config, singletons.",
        "It must be defined once outside the class (or `inline static` in-class since C++17); forgetting the definition yields a link error.",
        "Static member functions have no this and can only touch static members; typically class-level utilities or factories.",
        "`static constexpr` members make good class constants, usable at compile time.",
        "Access as `ClassName::member` to express that it is class-level; via an object is legal but discouraged.",
        "Beware static initialisation order across translation units — do not let statics depend on each other.",
        "Singletons are the classic use of static members, but consider thread safety and testability — prefer not to."
      ],
      code: "class Counter {\npublic:\n  Counter() { ++count_; }\n  ~Counter() { --count_; }\n  static int alive() { return count_; }        // 静态成员函数\nprivate:\n  static int count_;                            // 声明\n};\n\nint Counter::count_ = 0;                        // 定义（必须有且只有一处）",
      pit: "只写了静态成员变量的声明而忘了类外定义：编译能过，链接时报 undefined reference，错误信息完全看不出原因。",
      pit_en: "Declaring a static member but never defining it compiles and then fails to link with an unhelpful undefined reference.",
      ex: {
        q: "静态成员变量为什么必须在类外定义一次？",
        a: "类内只是声明；必须由某个编译单元为它分配实际存储。C++17 的 inline static 把这一步自动化了。",
        q_en: "Why must a static data member be defined outside the class?",
        a_en: "The in-class line is only a declaration; some translation unit must allocate the storage. C++17 inline static does it for you."
      }
    },

    "9-10": {
      target: "会给不改变状态的成员函数加 const，并解释 const 对象为什么只能调用它们。", target_en: "Mark non-mutating member functions const and explain why const objects can only call those.",
      title: "常量成员函数与 const 正确性", title_en: "Const member functions & const correctness", min: 10,
      summary: [
        "在成员函数参数表后加 const（int value() const;）表示它不修改对象状态，于是可以在 const 对象/const 引用上调用。",
        "const 正确性的意义：把「只读」写进类型系统，编译期就能拦住误改，也让接口意图一目了然。",
        "const 成员函数里的成员变量不可改；mutable 成员是唯一例外（用于缓存等「逻辑上不算状态改变」的成员）。",
        "传参优先 const T&：既能接收临时对象（右值），又承诺不改，是 C++ 最常见的参数形式。",
        "重载 on const：同一个函数常写 const 与非 const 两个版本，分别返回 const 引用与可写引用。",
        "若成员函数逻辑上不改状态但需要更新内部缓存，用 mutable 而不是去掉 const。",
        "自检清单：所有不该改数据的方法都加 const 了吗？参数里的大对象都用 const 引用了吗？"
      ],
      summary_en: [
        "Adding const after the parameter list (`int value() const;`) promises no modification, so it can be called on const objects and references.",
        "Const correctness encodes read-only intent in the type system, catching accidental writes at compile time.",
        "Members cannot change inside a const member function; `mutable` is the controlled exception (caches and similar).",
        "Prefer `const T&` parameters: they accept temporaries and promise not to modify — the most common parameter form in C++.",
        "Overload on const: provide both a const and a non-const version returning a const reference and a mutable one.",
        "If a function logically does not change state but must refresh a cache, use mutable rather than dropping const.",
        "Checklist: have all read-only methods got const? Are large parameters passed by const reference?"
      ],
      code: "class Buf {\npublic:\n  int size() const { return n_; }                         // 可在 const 对象上调用\n  std::string &at(int i) { return data_[i]; }             // 非 const：可写\n  const std::string &at(int i) const { return data_[i]; }  // const 重载：只读\nprivate:\n  std::vector<std::string> data_;\n  int n_{0};\n  mutable int cacheHits_{0};                              // 逻辑上不算改状态\n};\n\nvoid show(const Buf &b) { std::cout << b.size(); }        // 只能调用 const 成员",
      pit: "因为「const 对象上调用不了」就把方法的 const 删掉——这把「接口没说清」变成了「接口失去保护」；正确做法是把该加 const 的地方补上。",
      pit_en: "Deleting const because it blocked a call converts an unclear interface into an unprotected one; add const where it belongs instead.",
      ex: {
        q: "const 成员函数对接口设计有什么价值？",
        a: "它把「只读」变成编译期可检查的承诺：调用方敢传 const 引用，任何误改都会被编译器拦住。",
        q_en: "What is the design value of const member functions?",
        a_en: "They turn 'read-only' into a compile-time promise, so callers can pass const references and mistakes are caught by the compiler."
      }
    },

    "9-11": {
      target: "能判断一个类的默认拷贝是深还是浅，并写出正确的深拷贝版本。", target_en: "Tell whether a class copies deeply by default and write a correct deep copy.",
      title: "深拷贝与浅拷贝", title_en: "Deep vs shallow copy", min: 12,
      summary: [
        "默认拷贝构造/赋值做「逐成员拷贝」：对普通成员是正确的，对指针成员只复制指针（浅拷贝）——两份对象共享同一块内存。",
        "浅拷贝的三类后果：改动互相影响、重复释放（double free）、原对象释放后另一个变成悬空指针。",
        "深拷贝 = 在拷贝构造里为指针成员重新分配内存并复制内容，使两个对象彼此独立。",
        "一旦写了拷贝构造，通常也要写拷贝赋值与析构——这合称「三法则」；C++11 之后还要考虑移动构造/赋值（五法则，见 9-12）。",
        "拷贝赋值要先处理自赋值（if (this == &other) return *this;），再释放旧资源、分配新资源（或直接 copy-and-swap）。",
        "更省心的做法是让成员用 vector/string/智能指针，让默认拷贝语义自动正确——这是「优先用值语义」的现实理由。",
        "确定不需要拷贝时用 = delete 显式禁用，远比留一个隐式浅拷贝安全。"
      ],
      summary_en: [
        "The default copy constructor/assignment copies member by member: correct for ordinary members, but for pointer members it copies only the pointer (shallow) — two objects share one block.",
        "Three consequences: edits leak across objects, the block is freed twice, and one object dangles after the other dies.",
        "A deep copy reallocates and copies the pointed-to data so the objects are independent.",
        "Once you write a copy constructor you usually also need copy assignment and a destructor — the rule of three (plus moves in C++11, see 9-12).",
        "Copy assignment must handle self-assignment first, then release the old resource and acquire the new (or use copy-and-swap).",
        "Easier: hold vector/string/smart pointers as members and let the defaults be correct — the practical reason to prefer value semantics.",
        "When copying is genuinely unwanted, `= delete` is far safer than an implicit shallow copy."
      ],
      code: "class Buffer {\npublic:\n  explicit Buffer(std::size_t n) : n_(n), p_(new int[n]()) {}\n  Buffer(const Buffer &o) : n_(o.n_), p_(new int[o.n_]) {         // 深拷贝\n    std::copy(o.p_, o.p_ + n_, p_);\n  }\n  Buffer &operator=(const Buffer &o) {\n    if (this == &o) return *this;                                  // 自赋值保护\n    int *np = new int[o.n_]; std::copy(o.p_, o.p_ + o.n_, np);\n    delete[] p_; p_ = np; n_ = o.n_; return *this;\n  }\n  ~Buffer() { delete[] p_; }\nprivate:\n  std::size_t n_; int *p_;\n};",
      pit: "有指针成员却不写拷贝构造：默认浅拷贝导致 double free，而且这类崩溃往往只在特定数据下触发，极难复现与定位。",
      pit_en: "Owning a pointer member without writing a copy constructor leads to double frees that surface only under specific data — painful to reproduce.",
      ex: {
        q: "「三法则」说的是什么？",
        a: "如果一个类需要自定义析构、拷贝构造、拷贝赋值中的任意一个，通常三个都需要——因为它们管理的是同一份资源。",
        q_en: "What does the rule of three say?",
        a_en: "If a class needs any one of destructor, copy constructor or copy assignment, it usually needs all three — they manage the same resource."
      }
    },

    "9-12": {
      target: "能根据资源归属决定要不要写析构/拷贝/移动，或用 RAII 成员做到零法则。", target_en: "Decide from resource ownership whether to write destructor/copy/move — or reach the rule of zero with RAII members.",
      title: "三/五法则与移动语义初见", title_en: "Rule of three/five and move semantics", min: 14,
      summary: [
        "三法则：析构、拷贝构造、拷贝赋值要么都不写、要么都写；C++11 加入移动构造与移动赋值后扩展为五法则。",
        "移动语义的核心是「偷走而不是复制」：把源对象的资源指针转移过来，并把源置空，从而避免一次深拷贝。",
        "触发时机：用 std::move 显式声明「这个对象我不要了」，或传入/返回临时对象（右值）时自动匹配移动构造。",
        "移动构造签名：Buffer(Buffer &&o) noexcept : p_(o.p_), n_(o.n_) { o.p_ = nullptr; o.n_ = 0; }",
        "移动构造应标 noexcept：容器扩容时只有在「移动不抛异常」的前提下才会选择移动而非拷贝。",
        "空类可以写 = default（要编译器生成）或 = delete（禁用）；最省心的是「零法则」——成员都用现成的 RAII 类型，五个函数一个都不用写。",
        "实践顺序：先想零法则（用 vector/string/unique_ptr 成员）→ 需要独占资源再写移动 → 最后才考虑手写拷贝。",
        "衔接：类的生命周期与拷贝/移动语义已齐；下一章（s10）进入继承与多态。",
      ],
      summary_en: [
        "The rule of three: destructor, copy constructor and copy assignment come in a set. C++11 adds move construction and move assignment — the rule of five.",
        "Move semantics steals instead of copying: transfer the resource pointer and null the source, avoiding a deep copy.",
        "Triggered by std::move (an explicit 'I am done with this') or by temporaries/rvalues.",
        "Move constructor shape: Buffer(Buffer &&o) noexcept : p_(o.p_), n_(o.n_) { o.p_ = nullptr; o.n_ = 0; }",
        "Mark moves noexcept: containers only move on reallocation if moving cannot throw.",
        "Classes can = default or = delete these functions; easiest of all is the rule of zero — members are RAII types and you write none of the five.",
        "Order of preference: rule of zero (vector/string/unique_ptr members) → write moves if you own an exclusive resource → hand-written copies last.",
        "Bridge: lifetimes and copy/move semantics are in place; next is s10 — inheritance and polymorphism.",
      ],
      code: "class Buffer {\npublic:\n  Buffer(Buffer &&o) noexcept : p_(o.p_), n_(o.n_) { o.p_ = nullptr; o.n_ = 0; }   // 窃取资源\n  Buffer &operator=(Buffer &&o) noexcept {\n    if (this != &o) { delete[] p_; p_ = o.p_; n_ = o.n_; o.p_ = nullptr; o.n_ = 0; }\n    return *this;\n  }\n  // 拷贝构造/赋值见 9-7；析构见 9-4\nprivate:\n  std::size_t n_{0}; int *p_{nullptr};\n};\n\nstd::vector<Buffer> v;\nv.push_back(Buffer(1024));          // 优先走移动，而不是深拷贝",
      pit: "用了 std::move 之后还去读源对象，以为它仍有值——被移动后的对象处于「有效但未指定」状态，只能销毁或重新赋值。",
      pit_en: "Reading a source after std::move assumes it still holds a value; a moved-from object is valid but unspecified — destroy or reassign it.",
      ex: {
        q: "移动构造为什么要尽量标 noexcept？",
        a: "vector 扩容时若移动可能抛异常，为了强异常安全它会退回拷贝；标上 noexcept 才能真正享受到移动的性能收益。",
        q_en: "Why should a move constructor be noexcept?",
        a_en: "On reallocation, vector falls back to copying if moving may throw — noexcept is what unlocks the performance win."
      }
    }
  },

  quizAdd: [
    { q: "成员初始化顺序由什么决定？", o: ["初始化列表的书写顺序", "成员的声明顺序", "构造函数参数顺序", "编译器随机决定"], a: 1,
      why: "对象按声明顺序构造；初始化列表只决定怎么写表达式，不改变实际顺序。",
      why_en: "Members are constructed in declaration order; the initialiser list only writes the expressions, it does not reorder them.",
      q_en: "What determines the order of member initialisation?", o_en: ["The order written in the initialiser list", "The declaration order", "The constructor parameter order", "The compiler decides randomly"] },
    { q: "哪些成员必须放在初始化列表里初始化？", o: ["所有 double 成员", "const 成员与引用成员", "只有数组", "静态成员"], a: 1,
      why: "const 与引用成员没有「默认构造再赋值」这条路，必须直接在初始化列表里构造。",
      why_en: "const and reference members have no 'default-construct then assign' path — they must be constructed right in the initialiser list.",
      q_en: "Which members must be initialised in the initialiser list?", o_en: ["All double members", "const and reference members", "Only arrays", "Static members"] },
    { q: "在成员函数参数表后加 const 的作用是？", o: ["让函数跑得更快", "承诺不修改对象状态，可在 const 对象上调用", "禁止重载", "把成员变成常量"], a: 1,
      why: "const 成员函数不会修改成员（mutable 除外），因此可以在 const 对象/引用上调用。",
      why_en: "A const member function does not modify members (mutable aside), so it can be called on const objects and references.",
      q_en: "What does a trailing const on a member function do?", o_en: ["Makes it faster", "Promises not to modify the object, so it works on const objects", "Prevents overloading", "Makes members constant"] },
    { q: "需要自定义析构函数的类，通常还需要自定义？", o: ["静态成员", "拷贝构造与拷贝赋值", "友元函数", "运算符 new"], a: 1,
      why: "这就是三法则：三者共同管理同一份资源，缺一个就会导致共享或重复释放。",
      why_en: "That is the rule of three: the three functions manage one resource, and missing any of them causes sharing or double release.",
      q_en: "A class needing a custom destructor usually also needs?", o_en: ["Static members", "Copy constructor and copy assignment", "A friend function", "operator new"] },
    { q: "移动语义带来的主要收益是？", o: ["类型更安全", "避免拷贝、直接转移资源", "自动释放内存", "支持多态"], a: 1,
      why: "移动构造窃取源对象的资源并把源置空，省掉一次深拷贝。",
      why_en: "The move constructor steals the source's resource and leaves it empty, saving one deep copy.",
      q_en: "The main benefit of move semantics?", o_en: ["Safer types", "Avoids copying by transferring resources", "Automatic memory release", "Polymorphism"] },
    { q: "关于 RAII，下列说法正确的是？", o: ["它需要手写 delete", "构造获取资源、析构释放资源，异常路径也安全", "只能用于内存", "必须配合智能指针才能用"], a: 1,
      why: "RAII 把资源生命周期绑到对象生命周期，栈展开保证析构一定执行。",
      why_en: "RAII binds resource lifetime to object lifetime, and stack unwinding guarantees the destructor runs.",
      q_en: "Which statement about RAII is correct?", o_en: ["It requires manual delete", "Acquire in the constructor, release in the destructor — exception-safe", "Only works for memory", "It needs smart pointers to work"] }
  ],

  terms: [
    { term: "构造函数", term_en: "Constructor", cat: "C++ 系统深入",
      short: "对象创建时自动调用，负责把对象初始化到合法可用状态。",
      short_en: "Runs automatically at creation to bring the object into a valid, usable state.",
      detail: ["初始化列表在函数体之前执行，const/引用成员必须用它。", "explicit 阻止单参构造被隐式用作转换。"],
      detail_en: ["The member-initialiser list runs before the body; const and reference members need it.", "explicit stops a one-argument constructor from acting as an implicit conversion."],
      vs: "构造函数建立不变量，成员函数维持它。", vs_en: "Constructors establish invariants; member functions maintain them." },
    { term: "析构函数", term_en: "Destructor", cat: "C++ 系统深入",
      short: "对象销毁时自动调用，释放它持有的资源。",
      short_en: "Runs at destruction to release what the object owns.",
      detail: ["析构顺序与构造顺序相反。", "基类析构必须 virtual，否则派生部分不会析构。"],
      detail_en: ["Destruction happens in reverse construction order.", "A base-class destructor must be virtual or the derived part never destructs."],
      vs: "构造获取，析构归还。", vs_en: "Constructors acquire; destructors return." },
    { term: "移动语义", term_en: "Move Semantics", cat: "C++ 系统深入",
      short: "转移资源而不是复制内容，避免昂贵的深拷贝。",
      short_en: "Transferring resources instead of copying data, avoiding expensive deep copies.",
      detail: ["由 std::move 或右值（临时对象）触发。", "移动构造应标 noexcept，容器扩容才会优先用它。"],
      detail_en: ["Triggered by std::move or by an rvalue (a temporary).", "Mark the move constructor noexcept, otherwise containers prefer copying when growing."],
      vs: "拷贝复制一份，移动偷走一份。", vs_en: "Copy duplicates; move steals." },
    { term: "初始化列表", term_en: "Initialiser List", cat: "C++ 系统深入",
      short: "构造函数冒号后、函数体前的成员初始化区域。",
      short_en: "The member-initialisation region between the colon and the constructor body.",
      detail: ["在函数体之前执行，避免「先默认构造再赋值」。", "const 与引用成员必须在此初始化。"],
      detail_en: ["Runs before the body, avoiding default-construct-then-assign.", "const and reference members must be initialised here."],
      vs: "初始化列表是构造，函数体赋值是覆盖。", vs_en: "The list constructs; body assignment overwrites." },
    { term: "委托构造", term_en: "Delegating Constructor", cat: "C++ 系统深入",
      short: "一个构造函数把初始化工作交给同类的另一个构造函数。",
      short_en: "One constructor handing initialisation to another of the same class.",
      detail: ["消除重复的初始化代码。", "被委托的构造函数先执行完，再进入当前函数体。"],
      detail_en: ["Removes duplicated initialisation code across constructors.", "The delegated constructor finishes completely before the current body runs."],
      vs: "委托构造消除重复，初始化列表做具体赋值。", vs_en: "Delegation removes duplication; the list does the assignment." },
    { term: "友元", term_en: "friend", cat: "C++ 系统深入",
      short: "允许其他类或函数访问本类的私有成员。",
      short_en: "Grants another class or function access to private members.",
      detail: ["它破坏封装，应尽量少用。", "常见于运算符重载与测试辅助。"],
      detail_en: ["It deliberately breaks encapsulation, so use it sparingly.", "Typical cases are operator overloads and test helpers."],
      vs: "友元是受控的特权，public 是全面公开。", vs_en: "friend is controlled privilege; public is full exposure." },
    { term: "可变成员", term_en: "mutable", cat: "C++ 系统深入",
      short: "允许在 const 成员函数里修改的成员，用于缓存等逻辑上不算状态改变的数据。",
      short_en: "A member modifiable inside const member functions — for caches and similar logical non-state.",
      detail: ["滥用 mutable 会让 const 承诺失真。", "只应用于「外部不可观测」的成员。"],
      detail_en: ["Abusing mutable voids the const promise.", "Reserve it for members that are not observable from outside."],
      vs: "const 是规则，mutable 是受控的例外。", vs_en: "const is the rule; mutable is a controlled exception." },
    { term: "零法则", term_en: "Rule of Zero", cat: "C++ 系统深入",
      short: "让成员都用现成的 RAII 类型，自身不写析构/拷贝/移动。",
      short_en: "Let members be RAII types so you write none of the destructor/copy/move functions.",
      detail: ["最省心也最不容易出错的写法。", "std::vector、std::string、智能指针就是为此存在。"],
      detail_en: ["The least effort and the hardest way to get it wrong.", "std::vector, std::string and the smart pointers exist for exactly this."],
      vs: "零法则靠组合，三/五法则靠手写。", vs_en: "The rule of zero composes; the rule of three/five hand-writes." },
    { term: "显式构造", term_en: "explicit", cat: "C++ 系统深入",
      short: "禁止单参构造被用作隐式类型转换。",
      short_en: "Blocks a single-argument constructor from acting as an implicit conversion.",
      detail: ["避免「一个整数悄悄变成对象」这类意外。", "若确实想要隐式转换才不加。"],
      detail_en: ["Prevents accidents like an integer quietly becoming an object.", "Leave it off only when an implicit conversion is what you want."],
      vs: "explicit 要你写全，隐式转换图省事。", vs_en: "explicit makes you say it; implicit conversion saves keystrokes." },
    { term: "类与对象", term_en: "Class & Object", cat: "C++ 系统深入",
      short: "类是类型蓝图，对象是它的实例，各自持有一份成员数据。",
      short_en: "A class is the blueprint; an object is an instance with its own data.",
      detail: ["创建 = 分配 + 构造；销毁 = 析构 + 回收。", "类是值类型，拷贝默认逐成员进行。"],
      detail_en: ["Creating = allocate + construct; destroying = destruct + reclaim.", "A class is a value type; copying is member-wise by default."],
      vs: "类描述「会有什么」，对象是「具体的这一个」。", vs_en: "A class describes what exists; an object is a concrete one." }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "声明": "a declaration",
    "类外定义：必须写 Counter::": "out-of-class definition: Counter:: is mandatory",
    "接口（承诺）": "the interface (the promise)",
    "实现（可改）": "the implementation (free to change)",
    "只暴露栈该有的行为": "exposes only the behaviour a stack should have",
    "内部结构对外不可见": "the internal structure is invisible from outside",
    "显式要回默认构造": "asks the default constructor back explicitly",
    "explicit 防隐式转换": "explicit blocks the implicit conversion",
    "委托构造": "a delegating constructor",
    "先声明 → 先初始化": "declared first -> initialised first",
    "委托：默认 1x1": "delegating: defaults to 1x1",
    "显式要拷贝构造": "the copy constructor asked for explicitly",
    "const 成员 → 必须用初始化列表": "const member -> the initialiser list is mandatory",
    "离开作用域自动关闭": "closes automatically at scope exit",
    "禁止拷贝，避免重复关闭": "copying forbidden, so nothing closes twice",
    "RAII：离开作用域自动关闭": "RAII: closes when the scope ends",
    "RAII：异常路径也会解锁": "RAII: unlocks on the exception path too",
    "RAII：自动释放堆内存": "RAII: frees the heap memory by itself",
    "抛异常也不会泄漏": "throwing here still leaks nothing",
    "... 不需要任何 cleanup 代码": "... no cleanup code is needed at all",
    "链式调用": "chained calls",
    "区分同名参数": "tells a same-named parameter apart",
    "this 是 const Buf*": "this is a const Buf*",
    "静态成员函数": "a static member function",
    "定义（必须有且只有一处）": "the definition: exactly one, and it is required",
    "可在 const 对象上调用": "callable on a const object",
    "非 const：可写": "non-const: writable",
    "const 重载：只读": "const overload: read-only",
    "逻辑上不算改状态": "logically not a change of state",
    "只能调用 const 成员": "only const member functions are allowed here",
    "深拷贝": "deep copy",
    "自赋值保护": "self-assignment guard",
    "窃取资源": "steals the resource",
    "拷贝构造/赋值见 9-7；析构见 9-4": "copy constructor/assignment: see 9-7; destructor: see 9-4",
    "优先走移动，而不是深拷贝": "takes the move path instead of a deep copy"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_S9);
