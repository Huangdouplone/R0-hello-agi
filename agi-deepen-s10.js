/* ================================================================
 * R0:hello agi · 课程深化层 ③：面向对象进阶（s10）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把 s10 从「8 节 × 3 要点」深化为「12 节 × 6~7 要点」：
 *       继承与访问控制 → 构造顺序 → 多态与虚函数 → 抽象类与接口设计
 *       → 运算符重载 → 友元 → 菱形继承 → 虚析构 → 综合设计。
 * 叠加层约定同 s8/s9：既有 id 10-1…10-8 保留，新增节 10-9…10-12。
 * ================================================================ */

const DEEPEN_S10 = {
  stage: "s10",
  desc: "从继承到多态：构造顺序、虚函数机制、抽象接口、运算符重载与虚析构",
  desc_en: "From inheritance to polymorphism: construction order, virtual dispatch, abstract interfaces, operator overloading and virtual destructors",
  goal: "能用继承表达「是一种」关系，说清虚函数表的运行期分发过程，设计出稳定的抽象接口，并避开切片、对象切片与虚析构缺失这些经典坑。",
  goal_en: "Express is-a relationships with inheritance, explain virtual dispatch, design stable abstract interfaces, and avoid slicing and missing virtual destructors.",

  order: ["10-1","10-2","10-3","10-4","10-5","10-6","10-7","10-8","10-9","10-10","10-11","10-12"],

  lessons: {
        "10-1": {
      title: "继承", title_en: "Inheritance", min: 12,
      summary: [
        "继承表达「是一种」（is-a）关系：派生类自动拥有基类的成员，并可在此基础上扩展或改写。",
        "语法 class Derived : public Base，派生类既能用基类的 public/protected 成员，也能添加自己的成员与行为。",
        "继承的收益是复用与多态；代价是耦合——基类一改，所有派生类都可能受影响，所以基类要设计得克制而稳定。",
        "优先组合而非继承：如果关系是「有一个」（has-a，如汽车有引擎），用成员变量而不是继承。",
        "派生类无法访问基类的 private 成员——这是有意的封装保护，需要暴露就给 protected 或提供受保护的接口。",
        "基类与派生类的构造函数/析构函数会自动链式调用：先构造基类再构造派生类，析构顺序相反。",
        "判断是否该继承的三问：是「是一种」关系吗？基类真的能替代派生类吗？不继承会不会更简单？",
        "衔接：上一章的构造/析构/拷贝是本章继承体系的地基。"
      ],
      summary_en: [
        "Inheritance models an is-a relationship: the derived class automatically has the base members and can extend or override them.",
        "Syntax: class Derived : public Base — the derived class uses public/protected base members and adds its own.",
        "The benefits are reuse and polymorphism; the cost is coupling — change the base and every derived class may be affected.",
        "Prefer composition to inheritance: if the relation is has-a (a car has an engine), use a member, not a base class.",
        "A derived class cannot touch private base members — deliberate encapsulation; expose protected or a protected interface when needed.",
        "Constructors and destructors chain automatically: base first, then derived; destruction runs in reverse.",
        "Three questions before inheriting: is it an is-a? can the base truly substitute for the derived? would composition be simpler?",
        "Bridge: last chapter — constructors, destructors and copying — is the foundation for the inheritance system here."
      ],
      code: "class Shape {\npublic:\n  Shape(std::string n) : name_(std::move(n)) {}\n  const std::string &name() const { return name_; }\nprotected:\n  std::string name_;                     // 派生类可用\n};\n\nclass Circle : public Shape {\npublic:\n  Circle(double r) : Shape(\"circle\"), r_(r) {}   // 先构造基类\n  double area() const { return 3.14159 * r_ * r_; }\nprivate:\n  double r_;\n};",
      pit: "为了「复用几个函数」而继承：典型的错误动机，会把 is-a 关系搞坏；只想复用代码应该用组合或自由函数。",
      pit_en: "Inheriting just to reuse a few functions corrupts the is-a relationship; composition or free functions serve reuse better.",
      ex: {
        q: "「是一种」与「有一个」在代码上分别对应什么？",
        a: "「是一种」用继承（class Circle : public Shape），「有一个」用成员变量（class Car { Engine e; }）。",
        q_en: "How do is-a and has-a map to code?",
        a_en: "is-a → inheritance; has-a → a member variable."
      }
    },

    "10-2": {
      title: "访问控制与继承", title_en: "Access control & inheritance", min: 10,
      summary: [
        "继承方式决定「基类的 public/protected 成员在派生类里变成什么」：public 继承保持不变（最常用），protected 继承降为 protected，private 继承降为 private。",
        "约定俗成的用法：public 继承表达 is-a（会被外部当作基类使用）；protected/private 继承其实是「实现复用」，语义更接近组合。",
        "protected 是一把双刃剑：它把内部结构暴露给所有派生类，基类也就很难再改；能 private 就别 protected。",
        "派生类可以「收窄」但不能放宽基类成员的可见性：public 成员可以被隐藏但不能被改成 public 之外的更宽级别。",
        "名字查找：派生类同名成员会隐藏基类成员（不是重载），要用基类版本得写 Base::func() 或 using Base::func;。",
        "常见坑：在派生类里写同名非虚函数「覆盖」基类函数，实际只是隐藏，多态调用仍然走基类版本。",
        "设计建议：对外接口尽量少用 protected，多用「受保护的纯虚钩子」把扩展点显式化。"
      ],
      summary_en: [
        "The inheritance specifier decides what base members become inside the derived class: public keeps access (the common case), protected downgrades to protected, private downgrades to private.",
        "Convention: public inheritance means is-a (used polymorphically); protected/private inheritance is really implementation reuse and behaves more like composition.",
        "protected is double-edged: it exposes internals to every derived class, making the base hard to change — prefer private.",
        "A derived class can narrow but never widen accessibility of base members.",
        "Name lookup: a same-named member in the derived class hides the base one (not an overload); call Base::func() or add using Base::func;.",
        "Classic trap: writing a same-named non-virtual function 'overrides' nothing — it merely hides, and polymorphic calls still reach the base.",
        "Design tip: keep protected surface small and expose extension points as protected virtual hooks."
      ],
      code: "class Base {\npublic:\n  void f() { std::cout << \"Base::f\"; }\nprotected:\n  int data_{0};\n};\n\nclass D : public Base {\npublic:\n  using Base::f;              // 把基类 f 重新引入，避免被隐藏\n  void f(int) { /* 新增重载，而不是覆盖 */ }\n};\n\nclass ImplOnly : private Base {};   // 私有继承：复用实现，不暴露 is-a 关系",
      pit: "以为写了同名函数就实现了「覆盖」——如果基类函数不是 virtual，那只是名字隐藏，通过基类指针调用仍然执行基类版本。",
      pit_en: "Assuming a same-named function overrides: without virtual it only hides, and calls through a base pointer still run the base version.",
      ex: {
        q: "public 继承与 private 继承分别表达什么？",
        a: "public 继承表达「是一种」，派生对象可以当基类用；private 继承只是复用实现，外部看不到基类关系（更接近组合）。",
        q_en: "What do public and private inheritance express?",
        a_en: "Public inherits is-a (usable as the base); private is implementation reuse only, closer to composition."
      }
    },

    "10-3": {
      title: "构造顺序与基类初始化", title_en: "Construction order & base initialisation", min: 10,
      summary: [
        "构造顺序是固定的：先基类，再按声明顺序构造成员，最后执行派生类自己的构造函数体。",
        "因此派生类构造函数必须把基类初始化写进初始化列表：Circle(double r) : Shape(\"circle\"), r_(r) {}",
        "如果基类没有默认构造函数，派生类就「必须」显式调用基类构造函数——这是编译期的硬性要求。",
        "析构顺序完全相反：派生类析构函数体先执行，然后成员逆序析构，最后基类析构。",
        "构造期不要调用虚函数：此时派生类部分尚未构造，虚函数会解析到基类版本（语言规定，不是 bug）。",
        "同理，构造期不要把自己（this）传出去注册回调——对象还没构造完，使用者会看到半成品。",
        "记忆方法：构造像「从地基往上盖」，析构像「从屋顶往下拆」——所以基类先构造、最后析构。"
      ],
      summary_en: [
        "Construction order is fixed: base class first, then members in declaration order, then the derived constructor body.",
        "A derived constructor therefore initialises its base in the initialiser list: Circle(double r) : Shape(\"circle\"), r_(r) {}",
        "If the base has no default constructor the derived class must call a base constructor explicitly — enforced at compile time.",
        "Destruction is exactly reversed: derived body, then members in reverse order, then the base.",
        "Do not call virtual functions during construction: the derived part is not built yet, so the base version runs by language rule.",
        "Likewise, don't pass this out to register callbacks during construction — observers would see a half-built object.",
        "Mental model: construction builds from the foundation up; destruction dismantles from the roof down."
      ],
      code: "class Base {\npublic:\n  explicit Base(int v) : v_(v) { std::cout << \"Base \"; }   // 没有默认构造\n  virtual ~Base() { std::cout << \"~Base \"; }\nprivate:\n  int v_;\n};\n\nclass D : public Base {\npublic:\n  D() : Base(42), s_(\"d\") { std::cout << \"D \"; }          // 必须显式初始化基类\nprivate:\n  std::string s_;                                        // 声明顺序决定构造顺序\n};",
      pit: "在基类构造函数里调用虚函数想做「多态初始化」——实际总是执行基类版本，派生类的成员此时还不存在，强行使用就是未定义行为。",
      pit_en: "Calling a virtual function in a base constructor for 'polymorphic init' always runs the base version; the derived members do not exist yet.",
      ex: {
        q: "为什么基类没有默认构造时，派生类必须显式调用基类构造？",
        a: "因为构造必须先构造基类子对象，而唯一的构造方式就是你指定的那个带参构造——编译器找不到「默认的」那条路。",
        q_en: "Why must a derived constructor explicitly call the base when it has no default constructor?",
        a_en: "The base sub-object must be constructed first, and the only available constructor is the one you supply."
      }
    },

    "10-4": {
      title: "多态与虚函数 virtual", title_en: "Polymorphism & virtual functions", min: 12,
      summary: [
        "多态 = 同一个接口调用，在运行期根据对象的真实类型执行不同实现。这是面向对象里最有价值的一点。",
        "实现条件三件套：基类函数声明 virtual、派生类重写（override）、并通过基类指针或引用调用。",
        "机制上，对象里会带一个虚函数表指针，调用时按表查找真正要执行的函数——因此虚调用比普通调用稍慢（一次间接寻址）。",
        "只有指针/引用才有多态：按值传递基类会发生「对象切片」（derived 部分被切掉），只剩基类子对象。",
        "重写要求签名完全一致；加 override 关键字可让编译器帮你检查是否真的重写了（写错拼写会立刻报错）。",
        "派生类重写函数默认也是虚的，但显式写 virtual 或 override 更清晰，也是团队规范常见做法。",
        "经验：只有「需要被替换的实现」才设成虚函数；接口里到处都是虚函数往往意味着设计还没想清楚。"
      ],
      summary_en: [
        "Polymorphism means one interface call dispatches to different implementations at runtime based on the real object type — the most valuable part of OOP.",
        "Three requirements: declare the base function virtual, override it in the derived class, and call through a base pointer or reference.",
        "Mechanically, the object carries a vtable pointer and the call is resolved through the table — slightly slower than a direct call (one indirection).",
        "Only pointers/references are polymorphic: passing a derived object by value slices it, leaving just the base sub-object.",
        "Overriding requires an identical signature; `override` makes the compiler verify it, catching typos immediately.",
        "Overrides are virtual implicitly, but writing virtual or override explicitly is clearer and common in team style guides.",
        "Rule of thumb: make only the parts that must be replaceable virtual; virtual everywhere usually means the design is unsettled."
      ],
      code: "class Shape {\npublic:\n  virtual double area() const { return 0; }   // 接口\n  virtual ~Shape() = default;                 // 见 10-8\n};\n\nclass Circle : public Shape {\npublic:\n  explicit Circle(double r) : r_(r) {}\n  double area() const override { return 3.14159 * r_ * r_; }   // 重写\nprivate:\n  double r_;\n};\n\nvoid printArea(const Shape &s) { std::cout << s.area(); }   // 引用：多态生效\nstd::vector<std::unique_ptr<Shape>> v;\nv.push_back(std::make_unique<Circle>(1.0));\nfor (const auto &p : v) std::cout << p->area();",
      pit: "把派生对象按值传给 Shape 参数——对象切片，多态失效且派生部分的数据被丢弃，编译器往往一声不吭。",
      pit_en: "Passing a derived object by value into a Shape parameter slices it: polymorphism stops working and the derived data is discarded, usually silently.",
      ex: {
        q: "为什么多态必须通过指针或引用？",
        a: "只有指针/引用才保留对象的真实类型信息；按值传递会构造一个基类副本（切片），运行期已无从得知原本是派生类。",
        q_en: "Why does polymorphism require pointers or references?",
        a_en: "Only pointers/references keep the real type; passing by value builds a base copy (a slice) and the dynamic type is lost."
      }
    },

    "10-5": {
      title: "纯虚函数与抽象类", title_en: "Pure virtual functions & abstract classes", min: 10,
      summary: [
        "纯虚函数写 virtual double area() const = 0; 表示「这个接口必须由派生类实现」。",
        "含纯虚函数的类叫抽象类，不能实例化；它只负责定义接口与公共部分。",
        "抽象类的价值在于「先定契约、再谈实现」：调用方只依赖抽象接口，不关心有多少种实现。",
        "派生类若没有实现全部纯虚函数，它本身仍是抽象类，不能被实例化——编译器会直接拦住。",
        "抽象类通常只提供 public 接口与 protected 数据，并把析构函数设为 virtual（10-8）。",
        "接口类（只有纯虚函数、没有数据成员）是常见形态，相当于其他语言里的 interface。",
        "实用建议：抽象类的接口一旦发布就尽量别改（加纯虚函数会破坏所有现有派生类），要扩展优先加「带默认实现的虚函数」。"
      ],
      summary_en: [
        "A pure virtual function `virtual double area() const = 0;` says the derived class must implement it.",
        "A class with a pure virtual function is abstract and cannot be instantiated; it defines the interface and common parts.",
        "The value is contract-first design: callers depend on the interface, not on how many implementations exist.",
        "A derived class that misses any pure virtual is still abstract and cannot be instantiated — the compiler blocks it.",
        "Abstract classes usually expose public interfaces, protected data, and a virtual destructor (10-8).",
        "An interface class (pure virtuals only, no data) is a common shape, equivalent to an interface in other languages.",
        "Practical advice: freeze published interfaces — adding a pure virtual breaks every existing derived class; extend with a virtual that has a default body."
      ],
      code: "class Shape {                    // 抽象类：只定义契约\npublic:\n  virtual double area() const = 0;\n  virtual std::string name() const = 0;\n  virtual ~Shape() = default;\n};\n\nclass Square : public Shape {\npublic:\n  explicit Square(double a) : a_(a) {}\n  double area() const override { return a_ * a_; }\n  std::string name() const override { return \"square\"; }\nprivate:\n  double a_;\n};\n\n// Shape s;                       // ✗ 抽象类不能实例化\nvoid describe(const Shape &s) { std::cout << s.name() << \" \" << s.area(); }",
      pit: "抽象类里把析构函数忘了写 virtual：通过基类指针 delete 派生对象时，派生类的析构不会执行。",
      pit_en: "Forgetting a virtual destructor in an abstract class: deleting a derived object through a base pointer skips the derived destructor.",
      ex: {
        q: "抽象类为什么不能实例化？",
        a: "它有未实现的接口（纯虚函数），实例化出来也无法完整工作；语言层面直接禁止，属于设计意图的强制表达。",
        q_en: "Why can't an abstract class be instantiated?",
        a_en: "It has unimplemented interface parts (pure virtuals), so an instance could not work — the language forbids it by design."
      }
    },

    "10-6": {
      title: "接口设计与多态用法", title_en: "Designing interfaces & applying polymorphism", min: 12,
      summary: [
        "接口设计的核心问题：调用方需要什么？把「需要的能力」写成虚函数，而不是把实现细节暴露出来。",
        "常用手法是「依赖抽象而非具体」：函数参数收 Shape& 或接口指针，于是新增图形不需要改动已有代码（开闭原则的直观体现）。",
        "多态与容器配合：用 unique_ptr<Shape> 的 vector 存不同派生对象，遍历时统一调用虚函数。",
        "注意所有权：多态容器里存指针/智能指针而不是值（值会切片）；shared_ptr 与 unique_ptr 的取舍取决于是否共享所有权。",
        "虚函数与默认实现：接口方法给一个合理的默认实现（而非纯虚）能在不破坏派生类的前提下扩展接口。",
        "不要为了多态而多态：只有存在「同一接口、多种实现」时才引入继承；否则普通函数与模板往往更简单。",
        "自检：如果新增一种实现需要修改调用方代码，说明抽象没做对，耦合点还在具体类型上。"
      ],
      summary_en: [
        "The core question in interface design: what does the caller need? Express that capability as virtual functions, not implementation detail.",
        "Depend on abstractions: take `Shape&` or an interface pointer, so adding a new shape requires no change to existing code.",
        "Polymorphism plus containers: hold `unique_ptr<Shape>` in a vector of different derived objects and call the virtual function uniformly.",
        "Mind ownership: polymorphic containers hold pointers/smart pointers, not values (values slice); unique vs shared depends on sharing.",
        "Default implementations: giving an interface method a sensible default body lets you extend the interface without breaking derived classes.",
        "Don't use polymorphism for its own sake — only when one interface has several implementations; templates and free functions are often simpler.",
        "Self-check: if adding an implementation forces changes in the caller, the abstraction is leaking the concrete type."
      ],
      code: "class Exporter {                    // 抽象接口\npublic:\n  virtual ~Exporter() = default;\n  virtual void write(const std::string &line) = 0;\n  virtual std::string ext() const = 0;\n};\n\nclass CsvExporter : public Exporter {\npublic:\n  void write(const std::string &l) override { /* ... */ }\n  std::string ext() const override { return \".csv\"; }\n};\n\nstd::vector<std::unique_ptr<Exporter>> outs;   // 多态容器\nouts.push_back(std::make_unique<CsvExporter>());\nfor (auto &o : outs) o->write(\"data\");          // 统一调用，无需分支",
      pit: "多态容器里存值 vector<Shape>——对象切片，所有元素都退化成基类，虚函数永远走基类版本；必须存指针或智能指针。",
      pit_en: "Storing values in a polymorphic container slices them all into the base type; store pointers or smart pointers instead.",
      ex: {
        q: "「新增实现不改调用方」靠什么实现？",
        a: "调用方只依赖抽象接口（基类引用/指针），具体类型在创建时决定；新增实现只是多一个派生类，调用链完全不变。",
        q_en: "What makes 'add an implementation without touching callers' possible?",
        a_en: "Callers depend only on the abstract interface; new implementations are just new derived classes, so the call path never changes."
      }
    },

    "10-7": {
      title: "运算符重载", title_en: "Operator overloading", min: 10,
      summary: [
        "运算符重载让自定义类型像内置类型一样参与运算：+ 做加法、< 做比较、<< 做输出。写法是 operator+ 这样的函数名。",
        "选择的准则：只在语义自然时重载（a + b 真的像加法）；滥用运算符重载是 C++ 里最容易被批评的行为之一。",
        "成员形式 vs 自由函数：需要左操作数是自定义类型时才做成员（如 +=、[]、()）；对称的二元运算（+、==、<）通常写成自由函数。",
        "把常用运算符成组实现：写 == 就顺手写 !=；写 < 就顺手写 >、<=、>=（C++20 的 <=> 三路比较能一次生成全部比较）。",
        "赋值运算符 operator= 是最特殊的重载：要处理自赋值、释放旧资源、并返回 *this 以支持链式赋值（见 10-11）。",
        "const 正确性：比较类运算符不应修改操作数，参数用 const 引用、函数标 const（成员时）。",
        "输出运算符 << 必须写成自由函数（左操作数是 ostream），并返回 ostream& 以支持 cout << a << b。"
      ],
      summary_en: [
        "Operator overloading lets your type take part in expressions like built-ins: + adds, < compares, << prints — implemented as functions named operator+.",
        "Choose wisely: overload only when the semantics are natural (a + b should feel like addition); abuse is one of C++'s most criticised habits.",
        "Member vs free function: use a member when the left operand is your type (+=, [], ()); symmetric binaries (+, ==, <) are usually free functions.",
        "Implement operators in groups: if you write ==, write !=; if you write <, write >, <=, >= (C++20's <=> generates them all).",
        "operator= is the most special: handle self-assignment, release old resources, return *this for chaining (see 10-11).",
        "Const correctness: comparison operators should not modify operands — take const references and mark the member const.",
        "operator<< must be a free function (left operand is ostream) returning ostream& so that cout << a << b works."
      ],
      code: "struct Point {\n  double x, y;\n};\n\nPoint operator+(const Point &a, const Point &b) { return { a.x + b.x, a.y + b.y }; }\nbool operator==(const Point &a, const Point &b) { return a.x == b.x && a.y == b.y; }\nbool operator!=(const Point &a, const Point &b) { return !(a == b); }\n\nstd::ostream &operator<<(std::ostream &os, const Point &p) {\n  return os << \"(\" << p.x << \", \" << p.y << \")\";\n}\n\nPoint a{1, 2}, b{3, 4};\nstd::cout << a + b;          // (4, 6)",
      pit: "重载了 + 却让它的行为不像加法（例如做字符串拼接以外的事），或者重载 && 破坏短路求值——都属「能编译但危险」的做法。",
      pit_en: "Overloading + to do something unlike addition, or overloading && and breaking short-circuit evaluation — legal but dangerous.",
      ex: {
        q: "为什么输出运算符 << 必须写成自由函数？",
        a: "因为左操作数是 std::ostream 而不是你的类；成员函数只能让「你的类型」出现在左边，因此 << 与 >> 都得写成自由函数。",
        q_en: "Why must operator<< be a free function?",
        a_en: "Its left operand is std::ostream, not your type; members always put your type on the left."
      }
    },

    "10-8": {
      title: "拷贝赋值运算符与三法则", title_en: "Copy assignment & the rule of three", min: 12,
      summary: [
        "operator= 定义「对象之间赋值」的语义：签名常写 T &operator=(const T &other)。",
        "三件事必须做对：① 自赋值保护（if (this == &other) return *this;）② 释放旧资源 ③ 复制新资源并返回 *this。",
        "异常安全更好的写法是 copy-and-swap：先按值拷一份临时对象，再与自身交换——拷贝失败时原对象不受影响。",
        "三法则：析构、拷贝构造、拷贝赋值三者通常要一起写，因为它们管理同一份资源。",
        "五法则（C++11）再加上移动构造与移动赋值；能「零法则」就零法则（成员都用 RAII 类型，五者一个都不写）。",
        "派生类的赋值运算符要记得调用基类的 operator=（Base::operator=(other);），否则基类部分不会被赋值。",
        "禁用拷贝的标准写法：T(const T &) = delete; T &operator=(const T &) = delete;"
      ],
      summary_en: [
        "operator= defines assignment between objects; the usual signature is `T &operator=(const T &other)`.",
        "Three things must be right: self-assignment protection, releasing the old resource, copying the new one, and returning *this.",
        "Copy-and-swap is more exception-safe: copy into a temporary by value, then swap — a failed copy leaves the original untouched.",
        "Rule of three: destructor, copy constructor and copy assignment usually go together because they manage the same resource.",
        "The rule of five adds move construction and move assignment; prefer the rule of zero (RAII members, none of the five).",
        "A derived assignment operator must call the base one (`Base::operator=(other);`) or the base part is never assigned.",
        "To forbid copying: `T(const T &) = delete; T &operator=(const T &) = delete;`"
      ],
      code: "class Buffer {\npublic:\n  Buffer(std::size_t n) : n_(n), p_(new int[n]()) {}\n  Buffer(const Buffer &o) : n_(o.n_), p_(new int[o.n_]) { std::copy(o.p_, o.p_ + n_, p_); }\n  Buffer &operator=(Buffer o) {              // 按值传参 → copy-and-swap\n    swap(o);\n    return *this;\n  }\n  void swap(Buffer &o) noexcept { std::swap(p_, o.p_); std::swap(n_, o.n_); }\n  ~Buffer() { delete[] p_; }\nprivate:\n  std::size_t n_; int *p_;\n};",
      pit: "赋值运算符里漏掉自赋值保护：a = a 时先释放了自己的资源再去读它，典型的「自己把自己删了」崩溃。",
      pit_en: "Omitting self-assignment protection means `a = a` frees your own resource and then reads it — a classic self-inflicted crash.",
      ex: {
        q: "copy-and-swap 为什么更安全？",
        a: "拷贝发生在临时对象上，失败就抛异常，原对象完全没被动过；成功后再用不会抛异常的 swap 交换，天然满足强异常安全与自赋值保护。",
        q_en: "Why is copy-and-swap safer?",
        a_en: "The copy happens in a temporary and can fail without touching the original; the swap is noexcept, giving strong exception safety and self-assignment safety."
      }
    },

    "10-9": {
      target: "能在确有必要时开放最小范围的友元，并解释它为什么是例外而非常规手段。", target_en: "Grant the smallest necessary friendship when truly needed, and explain why it stays an exception.",
      title: "友元 friend", title_en: "friend", min: 8,
      summary: [
        "friend 让指定的函数或类访问本类的 private/protected 成员——相当于「定向开放的特权」。",
        "典型用途只有两类：运算符重载（如 operator<< 需要读私有成员）与需要紧密协作的成对类。",
        "friend 关系不是双向的：A 声明 B 是友元，只表示 B 能看 A 的私有成员，反过来不成立。",
        "友元也不可继承：派生类不会因为基类的友元而获得访问权限。",
        "它的代价是打破封装，因此能靠公开接口实现就别用友元；把 friend 当成「设计欠债」的信号更合适。",
        "更好的替代：提供必要的公有访问器、把需要协作的逻辑做成成员函数、或把关系紧的类合并/重构。",
        "若确实要用，建议在类定义里集中书写并加注释说明原因，方便日后审计与重构。"
      ],
      summary_en: [
        "friend grants a specific function or class access to private/protected members — a targeted privilege.",
        "Two legitimate uses: operator overloading (operator<< needs private members) and tightly coupled pairs of classes.",
        "Friendship is not mutual: A declaring B a friend lets B see A's privates, not the reverse.",
        "Friendship is not inherited: a derived class gains nothing from the base's friends.",
        "The cost is broken encapsulation — prefer public interfaces, and treat friend as a signal of design debt.",
        "Better alternatives: add the necessary public accessor, make the collaborating logic a member, or merge/refactor the two classes.",
        "If you must use it, group friend declarations together with a comment explaining why, for future refactoring."
      ],
      code: "class Matrix {\npublic:\n  explicit Matrix(int n) : n_(n) {}\n  friend std::ostream &operator<<(std::ostream &os, const Matrix &m);   // 只放行这一个函数\n  friend class MatrixTest;                                             // 成对协作（谨慎）\nprivate:\n  int n_;\n  double *data_{nullptr};\n};\n\nstd::ostream &operator<<(std::ostream &os, const Matrix &m) {\n  return os << \"Matrix(\" << m.n_ << \")\";      // 需要 private 成员\n}",
      pit: "为了「省事」把需要访问私有成员的逻辑做成友元类，等于把封装凿了个洞；通常说明这个类该提供更合适的公开接口。",
      pit_en: "Using a friend class to save effort punches a hole in encapsulation; usually the class should expose a better public interface.",
      ex: {
        q: "友元关系能被继承或传递吗？",
        a: "都不能：友元既不可继承，也不双向。它是针对具体函数/类的一次性授权。",
        q_en: "Is friendship inherited or mutual?",
        a_en: "Neither. It is a one-off grant to a specific function or class."
      }
    },

    "10-10": {
      target: "能识别菱形继承带来的二义与状态重复，并用虚继承或组合把它化解。", target_en: "Spot the ambiguity and duplicated state of diamond inheritance, and resolve it with virtual inheritance or composition.",
      title: "菱形继承与虚继承", title_en: "Diamond inheritance & virtual inheritance", min: 10,
      summary: [
        "多继承下如果两条路径指向同一个基类（D 继承 B1、B2，而 B1、B2 又都继承 A），就形成菱形继承。",
        "结果是 D 里有两份 A 的子对象，出现二义性与数据冗余：d.a_member 无法直接解析，必须写 B1::a_member 限定。",
        "虚继承（class B1 : virtual public A）让 A 只保留一份共享子对象，从而消除二义性与冗余。",
        "虚继承有代价：B1 的大小增加（需要指向共享基类的指针），构造顺序也更复杂，虚基类由最终派生类初始化。",
        "实践结论：菱形继承在业务代码里几乎总是「设计过深」的信号。优先改成组合，或用「接口类 + 单继承」的扁平结构。",
        "如果确实需要多继承，让多个基类都是「无数据的接口类」最安全，可以完全避开菱形问题。",
        "记住标准库的取向：绝大多数容器与算法都不靠深继承，而是靠模板与组合。"
      ],
      summary_en: [
        "With multiple inheritance, if two paths reach the same base (D inherits B1 and B2, both inheriting A) you get diamond inheritance.",
        "D then holds two A sub-objects: ambiguity and duplicated data — `d.a_member` cannot resolve without B1:: qualification.",
        "Virtual inheritance (`class B1 : virtual public A`) keeps a single shared A sub-object, removing ambiguity and duplication.",
        "It costs: B1 grows (a pointer to the shared base) and construction is more involved — the virtual base is initialised by the most derived class.",
        "In practice a diamond almost always signals over-deep design. Prefer composition, or a flat 'interface class + single inheritance' structure.",
        "If multiple inheritance is truly needed, make every base a data-free interface class — that avoids diamonds entirely.",
        "Note the standard library's stance: containers and algorithms rely on templates and composition, not deep hierarchies."
      ],
      code: "struct A { int v{0}; };\nstruct B1 : virtual public A {};     // 虚继承\nstruct B2 : virtual public A {};\nstruct D : public B1, public B2 {};\n\nD d;\nd.v = 1;                             // 只有一份 A，无二义性\n\n// 不用虚继承时：d.v 编译错误（B1::v 还是 B2::v？），且存在两份 A",
      pit: "以为多继承只是把多个基类「拼起来」——不少写 virtual 就会同时得到二义性错误与两份基类子对象，改起来牵一动百。",
      pit_en: "Assuming multiple inheritance simply merges bases: without virtual you get ambiguity errors and two base sub-objects, costly to untangle later.",
      ex: {
        q: "虚继承解决了什么问题？",
        a: "它让共同的基类在最终对象里只保留一份，消除菱形继承带来的二义性与数据冗余。",
        q_en: "What does virtual inheritance solve?",
        a_en: "It keeps a single shared base sub-object, removing the ambiguity and duplication of diamond inheritance."
      }
    },

    "10-11": {
      target: "能给会被继承的基类写对虚析构，并说清漏掉时通过基类指针 delete 的后果。", target_en: "Write a correct virtual destructor for an inheritable base and explain what deleting through a base pointer does without one.",
      title: "虚析构函数", title_en: "Virtual destructors", min: 10,
      summary: [
        "只要类可能被当作基类使用（有多态删除的可能），析构函数就必须声明 virtual。",
        "原因：delete 一个基类指针时，非虚析构只调用基类析构，派生类新增的资源不会被释放——静默泄漏。",
        "规则简化版：一个类只要「有虚函数」或者「会被继承」，就把析构写成 virtual（或 protected 非虚，见下）。",
        "不想让别人通过基类指针 delete 时（比如基类不打算做多态删除），可以把析构设为 protected 且非虚——但这属于更少见的用法。",
        "纯虚析构也是一种写法（virtual ~Base() = 0;），此时必须在类外给出函数体，否则链接失败。",
        "顺带的好处：有了虚析构，智能指针（unique_ptr<Base>）才能正确地销毁派生对象——这是现代写法的前提。",
        "别忘了析构里的 noexcept：C++11 起析构默认 noexcept，抛异常会导致 terminate。"
      ],
      summary_en: [
        "Whenever a class may be used as a base (i.e. polymorphism could be involved), its destructor must be virtual.",
        "Why: deleting through a base pointer with a non-virtual destructor runs only the base destructor — resources added by the derived class leak silently.",
        "Simplified rule: if a class has any virtual function, or will be inherited from, make the destructor virtual.",
        "If polymorphic deletion should be disallowed, a protected non-virtual destructor is the rarer alternative.",
        "A pure virtual destructor is also possible (`virtual ~Base() = 0;`) but then it needs an out-of-class body or linking fails.",
        "Bonus: a virtual destructor is what lets smart pointers (`unique_ptr<Base>`) destroy derived objects correctly — the basis of modern style.",
        "Don't forget noexcept: destructors are noexcept by default since C++11, and throwing terminates."
      ],
      code: "class Base {\npublic:\n  virtual void run() = 0;\n  virtual ~Base() = default;          // ★ 必须 virtual\n};\n\nclass Derived : public Base {\npublic:\n  void run() override {}\nprivate:\n  std::vector<int> buf_{1, 2, 3};     // 若析构非虚，这块内存不会被释放\n};\n\nBase *p = new Derived();\ndelete p;                             // 虚析构 → Derived::~Derived 被调用\n\nstd::unique_ptr<Base> q = std::make_unique<Derived>();   // 同样依赖虚析构",
      pit: "基类有虚函数但析构不是 virtual：通过基类指针 delete 时派生类析构被跳过，资源泄漏，而且常常在程序退出时才暴露。",
      pit_en: "A base with virtual functions but a non-virtual destructor skips the derived destructor on delete-through-base, leaking resources quietly.",
      ex: {
        q: "什么情况下必须写虚析构函数？",
        a: "当一个类会被继承、并且有可能通过基类指针或引用来删除对象时（多态删除）；这是资源不泄漏的前提。",
        q_en: "When is a virtual destructor mandatory?",
        a_en: "When the class can be inherited and objects may be deleted through a base pointer or reference."
      }
    },

    "10-12": {
      target: "能用抽象类 + 虚析构设计一个可扩展的小系统，并为每个设计决策说出理由。", target_en: "Design an extensible mini-system with abstract classes and virtual destructors, justifying every decision.",
      title: "本章综合：一次可扩展的小系统设计", title_en: "Wrap-up: designing an extensible mini-system", min: 16,
      summary: [
        "目标：把「支持多种输出格式的数据导出」做成一个可扩展的小系统，体验抽象接口 + 多态 + RAII 的组合威力。",
        "第一步（抽象）：定义 Exporter 接口（write/ext）。",
        "第二步（实现）：CsvExporter / JsonExporter 各自 override，实现细节完全隔离。",
        "第三步（装配）：用 vector<unique_ptr<Exporter>> 管理生命周期，虚析构保证正确释放。",
        "第四步（扩展性验证）：新增一种格式只需新增一个派生类，调用方与已有实现一行不改——这就是抽象的检验标准。",
        "第五步（避免过度设计）：如果只有一种格式且短期内不会变，直接写个函数就好；抽象是为「确定的多样性」准备的。",
        "自检清单：新增实现要改几处？拷贝/移动语义是否正确？析构是否虚？接口是否只暴露了调用方真正需要的能力？",
        "衔接：面向对象三部曲到此完整；下一章（s11 模板与泛型）将把类型参数化。",
      ],
      summary_en: [
        "Goal: build 'export data in several formats' as an extensible mini-system and feel how abstraction, polymorphism and RAII combine.",
        "Step 1 (abstraction): define the Exporter interface with write/ext.",
        "Step 2 (implementation): CsvExporter / JsonExporter override them, keeping details isolated.",
        "Step 3 (assembly): manage lifetimes with vector<unique_ptr<Exporter>>, relying on the virtual destructor for correct release.",
        "Step 4 (prove extensibility): adding a format means adding one derived class, with no edits to callers or existing code.",
        "Step 5 (avoid over-design): if there is only one format and no near-term change, a plain function is better — abstraction is for confirmed variety.",
        "Self-check: how many places change for a new implementation? Are copy/move semantics correct? Is the destructor virtual? Does the interface expose only what callers need?",
        "Bridge: the OOP trilogy is complete; next is s11 — templates and generics.",
      ],
      code: "class Exporter {\npublic:\n  virtual ~Exporter() = default;\n  virtual void write(const std::string &line) = 0;\n  virtual std::string ext() const = 0;\n};\n\nclass CsvExporter : public Exporter {\npublic:\n  explicit CsvExporter(std::ostream &os) : os_(os) {}\n  void write(const std::string &l) override { os_ << l << '\\n'; }\n  std::string ext() const override { return \".csv\"; }\nprivate:\n  std::ostream &os_;                   // 不拥有流，只引用\n};\n\nvoid dump(const std::vector<std::string> &rows, std::unique_ptr<Exporter> out) {\n  for (const auto &r : rows) out->write(r);\n}\ndump({ \"a,1\", \"b,2\" }, std::make_unique<CsvExporter>(std::cout));",
      pit: "为了「将来可能扩展」提前抽象出一堆接口，结果只有一种实现——复杂度提前付出，收益为零；抽象应该在第二种实现出现时引入。",
      pit_en: "Abstracting early 'in case we need more formats', leaving one implementation — complexity paid in advance for zero benefit.",
      ex: {
        q: "如何检验抽象是否做对了？",
        a: "试着新增一种实现：如果要改调用方或已有代码，说明耦合点还在具体类型上；理想情况是只新增一个派生类。",
        q_en: "How do you test whether an abstraction is right?",
        a_en: "Add an implementation: if callers or existing code must change, the concrete type still leaks. Ideally you only add a derived class."
      }
    }
  },

  quizAdd: [
    { q: "多态生效的必要条件不包括？", o: ["基类函数是 virtual", "派生类重写", "通过基类指针或引用调用", "对象按值传递"], a: 3,
      why: "按值传递会发生对象切片，多态失效；多态必须通过指针或引用。",
      why_en: "Passing by value slices the object and polymorphism stops working; it requires a pointer or reference.",
      q_en: "Which is NOT required for polymorphism to work?", o_en: ["The base function is virtual", "The derived class overrides it", "Calling through a base pointer or reference", "Passing the object by value"] },
    { q: "对象切片发生的原因是？", o: ["派生类没有重写", "按值传入基类类型", "缺少虚析构", "多重继承"], a: 1,
      why: "按值传递只保留基类子对象，派生部分被切掉。",
      why_en: "Passing by value keeps only the base subobject — the derived part is sliced off.",
      q_en: "Object slicing happens because of?", o_en: ["The derived class did not override", "Passing by value into a base-type parameter", "A missing virtual destructor", "Multiple inheritance"] },
    { q: "基类有虚函数时，析构函数应该？", o: ["保持非虚以省开销", "声明为 virtual", "设为 private", "不用关心"], a: 1,
      why: "否则通过基类指针 delete 时派生类析构不会执行，资源泄漏。",
      why_en: "Otherwise deleting through a base pointer never runs the derived destructor and leaks its resources.",
      q_en: "When a base class has virtual functions, its destructor should be?", o_en: ["Non-virtual to save overhead", "virtual", "private", "Not a concern"] },
    { q: "构造与析构的顺序是？", o: ["派生先构造、基类先析构", "基类先构造、派生先析构", "两者顺序相同", "由编译器随机决定"], a: 1,
      why: "构造从基类到派生类，析构完全相反。",
      why_en: "Construction goes base -> derived; destruction runs in exactly the opposite order.",
      q_en: "What is the order of construction and destruction?", o_en: ["Derived constructs first, base destructs first", "Base constructs first, derived destructs first", "Both the same order", "Compiler-dependent"] },
    { q: "copy-and-swap 相比直接赋值的主要优势是？", o: ["代码更短", "天然处理自赋值且强异常安全", "不需要析构函数", "避免虚函数"], a: 1,
      why: "拷贝在临时对象上完成，失败不影响原对象；交换不抛异常。",
      why_en: "The copy happens into a temporary, so a failure leaves the original untouched, and swap does not throw.",
      q_en: "The main advantage of copy-and-swap over direct assignment?", o_en: ["Shorter code", "Handles self-assignment and gives strong exception safety", "No destructor needed", "Avoids virtual functions"] },
    { q: "抽象类（含纯虚函数）的特点是？", o: ["可以实例化", "不能实例化，只能作为接口", "不能有数据成员", "不能有构造函数"], a: 1,
      why: "纯虚函数没有实现，抽象类不能创建对象；派生类必须实现全部纯虚函数才可实例化。",
      why_en: "A pure virtual has no body, so the abstract class cannot be instantiated; a derived class must implement every pure virtual before it can.",
      q_en: "An abstract class (with pure virtuals)?", o_en: ["Can be instantiated", "Cannot be instantiated — it is an interface", "Cannot have data members", "Cannot have constructors"] }
  ],

  terms: [
    { term: "继承", term_en: "Inheritance", cat: "C++ 系统深入",
      short: "表达「是一种」关系：派生类复用并扩展基类。",
      short_en: "Models is-a: the derived class reuses and extends the base.",
      detail: ["代价是耦合，基类要设计得克制。", "「有一个」关系应该用组合而不是继承。"],
      detail_en: ["Its price is coupling, so design base classes conservatively.", "A 'has-a' relationship should use composition, not inheritance."],
      vs: "继承表达 is-a，组合表达 has-a。", vs_en: "Inheritance is is-a; composition is has-a." },
    { term: "多态", term_en: "Polymorphism", cat: "C++ 系统深入",
      short: "同一接口调用在运行期分派到不同实现。",
      short_en: "One interface call dispatching to different implementations at runtime.",
      detail: ["需要 virtual + 重写 + 通过指针/引用调用。", "按值传递会切片，多态失效。"],
      detail_en: ["Needs virtual plus an override, called through a pointer or reference.", "Passing by value slices the object and kills polymorphism."],
      vs: "多态换灵活，静态绑定换速度。", vs_en: "Polymorphism buys flexibility; static binding buys speed." },
    { term: "虚函数表", term_en: "vtable", cat: "C++ 系统深入",
      short: "每个多态类型一张函数指针表，对象通过指针在运行期查找真正要调用的函数。",
      short_en: "One table of function pointers per polymorphic type; objects look up the actual function at runtime.",
      detail: ["虚调用比普通调用多一次间接寻址。", "构造/析构期间虚表尚未指向派生版本。"],
      detail_en: ["A virtual call costs one extra indirection over a plain call.", "During construction and destruction the vtable does not yet point at the derived version."],
      vs: "虚表实现多态，模板实现编译期多态。", vs_en: "The vtable implements runtime polymorphism; templates implement compile-time." },
    { term: "对象切片", term_en: "Object Slicing", cat: "C++ 系统深入",
      short: "按值传递派生对象到基类类型时，派生部分被切掉，只剩基类子对象。",
      short_en: "Passing a derived object by value into a base type cuts off the derived part.",
      detail: ["多态随之失效，且不报错。", "解法：传指针或引用（含智能指针）。"],
      detail_en: ["Polymorphism silently stops working — no error is raised.", "Fix: pass pointers or references, including smart pointers."],
      vs: "切片是值的代价，指针/引用才保留动态类型。", vs_en: "Slicing is the cost of values; pointers/references keep the dynamic type." },
    { term: "抽象类", term_en: "Abstract Class", cat: "C++ 系统深入",
      short: "含纯虚函数的类，不能实例化，只定义契约。",
      short_en: "A class with pure virtual functions — an uninstantiable contract.",
      detail: ["派生类必须实现全部纯虚函数才能实例化。", "析构应声明为 virtual。"],
      detail_en: ["A derived class must implement every pure virtual function before it can be instantiated.", "Its destructor should be declared virtual."],
      vs: "抽象类定契约，具体类给实现。", vs_en: "The abstract class sets the contract; concrete classes implement it." },
    { term: "纯虚函数", term_en: "Pure Virtual Function", cat: "C++ 系统深入",
      short: "声明为 = 0 的虚函数，表示必须由派生类实现。",
      short_en: "A virtual function declared = 0, requiring a derived implementation.",
      detail: ["接口类通常只由纯虚函数组成。", "抽象类的接口一旦发布不宜再增纯虚函数。"],
      detail_en: ["Interface classes are usually made of nothing but pure virtuals.", "Once an abstract interface is published, avoid adding more pure virtuals to it."],
      vs: "纯虚强制实现，虚函数给可选覆盖。", vs_en: "Pure virtual forces implementation; virtual makes overriding optional." },
    { term: "虚析构函数", term_en: "Virtual Destructor", cat: "C++ 系统深入",
      short: "保证通过基类指针 delete 派生对象时，派生类析构也会执行。",
      short_en: "Ensures the derived destructor runs when deleting through a base pointer.",
      detail: ["有虚函数或会被继承的类都应写。", "也是智能指针正确工作的前提。"],
      detail_en: ["Write it for any class with a virtual function or that may be inherited.", "It is also the precondition for smart pointers to work correctly."],
      vs: "虚析构管释放，虚函数管行为。", vs_en: "A virtual destructor guards release; virtual functions guard behaviour." },
    { term: "菱形继承", term_en: "Diamond Inheritance", cat: "C++ 系统深入",
      short: "多继承路径汇合到同一基类，产生两份基类子对象与二义性；虚继承可消除。",
      short_en: "Multiple paths reaching one base, producing two sub-objects and ambiguity; virtual inheritance fixes it.",
      detail: ["几乎总是设计过深的信号。", "多个无数据接口类的多继承最安全。"],
      detail_en: ["Almost always a signal that the design is too deep.", "Multiple inheritance of several data-free interface classes is the safest form."],
      vs: "虚继承省下一份子对象，代价是构造更复杂。", vs_en: "Virtual inheritance saves one sub-object at the cost of trickier construction." },
    { term: "运算符重载", term_en: "Operator Overloading", cat: "C++ 系统深入",
      short: "让自定义类型参与运算表达式，只在语义自然时使用。",
      short_en: "Letting your type take part in expressions — only when the semantics are natural.",
      detail: ["对称二元运算通常写成自由函数。", "<< 与 >> 必须是自由函数。"],
      detail_en: ["Symmetric binary operators are usually written as free functions.", "<< and >> must be free functions."],
      vs: "运算符重载求自然，具名函数求明确。", vs_en: "Overloading buys natural syntax; named functions buy clarity." },
    { term: "copy-and-swap", term_en: "Copy-and-swap", cat: "C++ 系统深入",
      short: "赋值时先按值拷贝一份临时对象，再与自身交换，天然处理自赋值与异常安全。",
      short_en: "Copy into a temporary by value, then swap — self-assignment and exception safety come for free.",
      detail: ["swap 应标 noexcept。", "是「三法则」下最稳的赋值实现方式。"],
      detail_en: ["swap should be marked noexcept.", "It is the most robust way to implement assignment under the rule of three."],
      vs: "copy-and-swap 稳，手写释放-复制快但不安全。", vs_en: "Copy-and-swap is safe; manual free-then-copy is faster but fragile." }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "派生类可用": "available to derived classes",
    "先构造基类": "the base is constructed first",
    "把基类 f 重新引入，避免被隐藏": "brings the base f back in so it is not hidden",
    "私有继承：复用实现，不暴露 is-a 关系": "private inheritance: reuses the implementation, exposes no is-a link",
    "没有默认构造": "no default constructor here",
    "必须显式初始化基类": "the base must be initialised explicitly",
    "声明顺序决定构造顺序": "declaration order decides construction order",
    "接口": "the interface",
    "见 10-8": "see 10-8",
    "重写": "an override",
    "引用：多态生效": "by reference: polymorphism works",
    "抽象类：只定义契约": "abstract class: it only defines the contract",
    "Shape s;                       // ✗ 抽象类不能实例化": "Shape s;                       // ✗ an abstract class cannot be instantiated",
    "抽象接口": "an abstract interface",
    "多态容器": "a polymorphic container",
    "统一调用，无需分支": "one uniform call, no branching",
    "按值传参 → copy-and-swap": "the parameter comes in by value -> copy-and-swap",
    "只放行这一个函数": "admits this one function only",
    "成对协作（谨慎）": "a cooperating pair (use with care)",
    "需要 private 成员": "it needs the private members",
    "虚继承": "virtual inheritance",
    "只有一份 A，无二义性": "a single shared A, no ambiguity",
    "不用虚继承时：d.v 编译错误（B1::v 还是 B2::v？），且存在两份 A": "without virtual inheritance: d.v is a compile error (B1::v or B2::v?), and A exists twice",
    "★ 必须 virtual": "★ it has to be virtual",
    "若析构非虚，这块内存不会被释放": "with a non-virtual destructor this memory is never freed",
    "虚析构 → Derived::~Derived 被调用": "virtual destructor -> Derived::~Derived runs",
    "同样依赖虚析构": "this depends on the virtual destructor as well",
    "不拥有流，只引用": "does not own the stream, it only refers to it"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_S10);
