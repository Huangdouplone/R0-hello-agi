/* ================================================================
 * R0:hello agi · 课程深化层 ⑦（s11 模板与泛型）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：s11 原本只有 3 节、每节 3 要点，是全站最薄的一章。这一版把它扩到 6 节：
 *       既有 3 节深化到 6~8 要点，并新增 11-4 模板特化与重载、11-5 类模板与容器实战、
 *       11-6 综合重构：泛型工具箱与编译期取舍。重点补的是「什么时候会出错」：
 *       max(3, 4.5) 的推导冲突、模板为什么必须放头文件、特化与重载的匹配顺序、
 *       函数模板没有偏特化、非类型参数把容量变成类型。
 * 单章文件：order 与 quizAdd 直接写数组，并顺带刷新 desc / desc_en / goal / goal_en。
 * ================================================================ */

const DEEPEN_S11 = {
  stage: "s11",

  order: ["11-1", "11-2", "11-3", "11-4", "11-5", "11-6"],

  desc: "写一次逻辑，让 int、double、string 都能用；同时看清模板在编译期替你生成了什么，以及它从哪一刻开始咬人。",
  desc_en: "Write the logic once and let int, double and string all use it - while seeing what templates generate at compile time, and the moment they start to bite.",
  goal: "会写函数模板与类模板，能解释推导失败、头文件摆放、特化与重载的匹配顺序，并为一段重复代码选对复用手段。",
  goal_en: "Write function and class templates; explain deduction failure, header placement and the specialisation-versus-overload matching order; pick the right reuse tool for duplicated code.",

  lessons: {

    /* ===================== s11 模板与泛型 ===================== */
    "11-1": {
      min: 13,
      summary: [
        "`template<typename T>` 把「类型」变成一个参数：函数体只写一份，编译器按调用处实际用到的类型**各生成一份**——`better<int>` 与 `better<double>` 是两门不同的函数，各有地址、各自参与内联。",
        "`typename` 与 `class` 在模板参数位置完全同义（`template<class T>` 是 C++98 留下的老写法）；但这个同义只到这里为止——`typename T::value_type` 这种「依赖类型」前缀只能用 `typename`（11-5 展开）。",
        "推导是**由实参反推**：`T` 在参数表里出现两次，就要求这两个位置推出同一个类型。所以 `better(3, 4.5)` 是编译错误——第一个实参推出 `T=int`、第二个推出 `T=double`，冲突即失败，编译器**不会**替你升到 double。",
        "三条修法各有代价：① 显式给类型 `better<double>(3, 4.5)`（清楚，但每处都要写）；② 拆成两个模板参数 `template<typename A, typename B>` 再自己决定结果类型（灵活，但要处理「谁转换成谁」）；③ 在调用处把字面量写成 `3.0`（省事，但把契约留给了运气）。`std::max` 选的是第 ① 种语义：只接受同类型。",
        "模板里的操作必须对**每一个你会传进来的类型**都成立：`a > b` 要求类型有 `>`，`T result = a;` 要求可拷贝。传一个没定义 `>` 的结构体，报错会落在函数体里而不是调用处——这就是模板报错看着像天书的机制。",
        "参数怎么传很关键：`T value` 每次实参都要拷贝（对 `std::string` 是白白的复制）；`const T&` 不拷贝、能接临时量，是 C++17 的标准写法；`T&` 只能绑左值，`better(3, 7)` 这种字面量当场编译失败。",
        "传数组或字符串字面量时 `T` 会推成指针：`better(\"abc\", \"d\")` 比的是两个地址而不是字典序，结果依赖链接器排版，「今天对明天错」——模板看起来什么都能接，但接住的未必是你以为的那个类型。",
        "什么时候不该用模板：只有一两种类型用到，就直接写两个**重载**（11-4 会比较它们），代码更短、报错也短得多；逻辑本身要随类型变化，那是特化或 `if constexpr` 的活。衔接：本章假设你已经熟透 s5 的函数重载与 s9 的类定义，11-2 把整个类参数化。"
      ],
      summary_en: [
        "template<typename T> turns the type itself into a parameter: you write the body once and the compiler generates one copy per type actually used, so better<int> and better<double> are two different functions with their own addresses and their own inlining.",
        "typename and class are exact synonyms in the template parameter list (template<class T> is a C++98 inheritance); the synonymy stops there, because a dependent type such as typename T::value_type can only be spelled with typename, which 11-5 unpacks.",
        "Deduction runs from the arguments backwards: if T appears twice in the parameter list, both positions must deduce to the same type. That is why better(3, 4.5) is a compile error - the first argument gives T=int, the second T=double, and a conflict is simply a failure; the compiler will not widen to double for you.",
        "Three fixes, each with a price: state the type explicitly as better<double>(3, 4.5) (clear, but written at every call site); split into two parameters template<typename A, typename B> and decide the result type yourself (flexible, but you own the conversion question); or write 3.0 at the call site (lazy, and it leaves the contract to luck). std::max chose the first semantics and accepts only matching types.",
        "Every operation inside the template must hold for every type you will ever pass: a > b requires an operator>, and T result = a requires copy-constructibility. Hand it a struct without > and the error lands inside the body rather than at the call — that is the mechanism behind the infamous walls of template diagnostics.",
        "How you take the parameter matters: T value copies every argument (a free-for-nothing copy for std::string); const T& copies nothing and accepts temporaries, which is the C++17 standard shape; T& binds lvalues only, so better(3, 7) fails on the spot.",
        "Arrays and string literals deduce to pointers: better(\"abc\", \"d\") compares addresses, not lexicographic order, so the answer depends on how the linker laid things out - 'right today, wrong tomorrow'. A template looks like it accepts anything, but what it accepts may not be the type you meant.",
        "When not to use a template: if only one or two types need it, write two overloads instead (11-4 compares them) — shorter code and dramatically shorter errors; when the logic itself must vary by type, that is specialisation or if constexpr territory. Bridge: this chapter assumes s5 overloading and s9 class definitions are solid, and 11-2 parameterises whole classes."
      ],
      code: `#include <iostream>
#include <string>

template<typename T>
T better(T a, T b) { return a > b ? a : b; }        // 只要求 T 支持 > 与拷贝

int main() {
    std::cout << better(3, 7) << '\\n';              // 推出 T 是 int
    std::cout << better(3.0, 4.5) << '\\n';          // 两边都是 double 才推得出来
    std::cout << better<std::string>("apple", "pear") << '\\n';  // 显式给类型：比的是字典序
    // 推导冲突：T 不能同时是 int 和 double，下面这行编不过：
    // std::cout << better(3, 4.5);
    const char* p = "abc";
    const char* q = "d";
    std::cout << (std::string(p) > std::string(q)) << '\\n';   // 要比内容就先变成 string
    return 0;
}`,
      pit: "以为 `better(3, 4.5)` 会「自动把 int 升成 double 再比」。模板推导阶段**不做**算术提升，两边类型不同直接判推导失败；等你手动写成 `better<double>(3, 4.5)` 才进入函数体，那时才发生隐式转换。",
      pit_en: "Expecting better(3, 4.5) to 'promote the int to double and compare'. Deduction performs no arithmetic promotion - differing types are simply a deduction failure; only after you write better<double>(3, 4.5) does the body compile and the implicit conversion happen.",
      ex: {
        q: "`max(3, 4.5)` 为什么编译失败？给出两种修法并说明差别。",
        a: "因为同一个 `T` 在两个参数位置上推出了 int 与 double 两个矛盾的类型；修法一是显式指定 `max<double>(3, 4.5)`（调用处写清楚），修法是二把参数拆成两个模板参数并自己规定返回类型（灵活但要自己处理提升）。",
        q_en: "Why does max(3, 4.5) fail to compile? Give two fixes and their difference.",
        a_en: "Because one T is deduced as int from the first argument and double from the second, which is a contradiction; fix one is to spell it out as max<double>(3, 4.5) at the call site, fix two is to split the parameters into two template parameters and decide the promoted return type yourself."
      }
    },

    "11-2": {
      min: 13,
      summary: [
        "类模板把「装的类型」参数化：`template<typename T> class Box { T item; };`。关键认知是——`Box<int>` 与 `Box<double>` 是**两个互不相关的类型**，它们没有共同基类、不能互相赋值，「都是 Box」只是拼写上的巧合。",
        "传统上类模板的使用者必须**写全实参**（`Box<int> b;`），因为声明一个对象时没有任何函数实参可供反推。C++17 起了 CTAD：`Box b{3.5};` 能从构造函数推出 `Box<double>`——但旧教材里「类模板必须显式给类型」这句话，在 C++17 之后只对了一半。",
        "类外定义成员函数要重新带上模板头，并且写全 `Box<T>::`：`template<typename T> T Box<T>::get() const { ... }`。漏掉 `<T>` 会被当成另一个叫 `Box` 的东西，报错通常落在这一行而不是使用处。",
        "成员函数**只有被调用时才会实例化**：`Box<std::string>` 里那个写着 `item * 2` 的成员只要没人调用，就一声不吭。这是「模板没用到就不检查」的机制，也是它坑人的地方——错误延迟到很远的调用处、甚至别人的代码里才冒出来。",
        "STL 容器全是类模板：`std::vector<T>`、`std::pair<A,B>`、`std::map<K,V>`。所以「学会读容器的模板签名」比背一堆成员函数划算得多：尖括号里的东西就是「这里能换」。",
        "每种实例化各有自己的一份静态成员：`Box<int>::count` 与 `Box<double>::count` 是两个不同的变量，互相不影响——把「全局计数」放进类模板前要意识到这点。",
        "常见编译错误来自「定义藏在了 .cpp 里」：类模板的成员一旦只在某个 .cpp 中定义，别的编译单元就看不见函数体，只能在链接期报 undefined reference（11-3 正面解释原因与出路）。",
        "什么时候不要用类模板：类型之间的差别是**行为**而不是数据（Student 与 Teacher 不是「同一种盒子里的不同东西」），硬套模板只会把一堆 if 塞满整个类。衔接：会用了之后，11-3 讲它在编译期到底发生了什么。"
      ],
      summary_en: [
        "A class template parameterises the type it carries: template<typename T> class Box { T item; }. The key insight is that Box<int> and Box<double> are two entirely unrelated types - no common base, no assignment between them - and 'both are Box' is only a spelling coincidence.",
        "Historically a user of a class template had to write the arguments in full (Box<int> b;) because declaring an object supplies no function arguments to reason backwards from. C++17 added CTAD, so Box b{3.5;} deduces Box<double> from the constructor - which makes the textbook line 'class templates always need an explicit type' only half true any more.",
        "Out-of-class member definitions repeat the template header and spell Box<T>:: — template<typename T> T Box<T>::get() const { ... }. Dropping the <T> refers to something else called Box, and the error usually lands on that line rather than at the use.",
        "A member function is instantiated only when it is called: inside Box<std::string>, a member containing item * 2 stays silent as long as nobody calls it. That is the 'unchecked until used' mechanism, and also the trap — the error surfaces far away, sometimes in someone else's file.",
        "The STL containers are all class templates: std::vector<T>, std::pair<A,B>, std::map<K,V>. Learning to read a container's template signature pays far better than memorising member functions: whatever sits in the angle brackets is what you may swap.",
        "Each instantiation gets its own static members: Box<int>::count and Box<double>::count are two different variables that never see each other — remember that before putting a 'global counter' inside a class template.",
        "The classic compile/link failure is a definition hidden in a .cpp: once a class template's members are defined in only one translation unit, other units cannot see the bodies and the linker reports undefined reference (11-3 explains why and what to do).",
        "When not to use a class template: when the types differ in behaviour rather than in payload (Student and Teacher are not the same box with different contents), forcing a template just packs every member with ifs. Bridge: now that it is usable, 11-3 looks at what actually happens at compile time."
      ],
      code: `#include <iostream>
#include <string>

template<typename T>
class Box {
    T item{};                                   // 花括号初始化：数值型成员不会是垃圾
public:
    explicit Box(T v) : item(v) {}              // explicit：禁止把 int 隐式当成 Box<int>
    T get() const;                              // 类内只声明，定义放到类外
    void set(T v) { item = v; }
    static int born;                            // 每种实例化各有自己的一份
};

template<typename T>
T Box<T>::get() const { return item; }          // 类外定义必须带模板头并写全 Box<T>::

template<typename T> int Box<T>::born = 0;

int main() {
    Box<int> bi(42);
    Box<std::string> bs("hello");
    std::cout << bi.get() << ' ' << bs.get() << '\\n';
    Box b2{3.5};                                // C++17 CTAD：推出 Box<double>
    std::cout << b2.get() << '\\n';
    // 两个实例化毫无关系，下面这行是编译错误：
    // Box<int> copy = bs;
    return 0;
}`,
      pit: "把类模板的成员函数定义写在 .cpp 里、类内只留声明——编译期一切正常，链接期才报 undefined reference。原因不是「忘了 export」（那个关键字已被废弃），而是调用处所在的编译单元根本看不见函数体，无从实例化。",
      pit_en: "Defining class template members in a .cpp with only declarations in the header: everything compiles and the link step fails with undefined reference. The reason is not a missing 'export' (that keyword was removed) but that the calling translation unit cannot see the body and therefore cannot instantiate it.",
      ex: {
        q: "`Box<int>` 和 `Box<double>` 是什么关系？能互相赋值吗？",
        a: "毫无关系——它们是同一个类模板的两份独立实例化，没有共同基类，直接把一个赋给另一个是编译错误；需要互通就得自己写转换构造函数或转换函数。",
        q_en: "What is the relationship between Box<int> and Box<double>? Can one be assigned to the other?",
        a_en: "None at all - they are two independent instantiations of one template, with no common base, so assigning one to the other is a compile error; bridging them takes a conversion constructor or a conversion operator you write yourself."
      }
    },

    "11-3": {
      min: 12,
      summary: [
        "模板是**编译期的代码生成器**：`better<int>` 与 `better<double>` 各生成一份真实函数，之后运行期没有任何「查类型」「做分派」的动作——这就是「泛型不慢」的根据。",
        "代价是「只在使用处生成」：每个 .cpp 是独立编译的（1-4 的编译单元），编译器必须在看到 `better(3, 7)` 的那一刻就能看到模板的**定义**，只有声明是不够的。",
        "这就是模板放头文件的根本原因：把定义写进 .cpp，别的编译单元看不见函数体，只能生成一个「等着被实例化」的调用，链接期报 undefined reference。出路是把定义搬回 .h（主流做法），或者在 .cpp 末尾做显式实例化 `template class Box<int>;`（只在刻意控制编译时间与体积时用）。",
        "头文件里放模板定义不会造成重复定义：模板本身不占运行期空间，实例是各个编译单元各自生成、由链接器按 ODR 合并的——这和 1-4 里「普通函数定义不能放头文件」其实是同一条规则的两个结论。",
        "模板的报错几乎都发生在**实例化那一刻**，消息里全是替换后的类型名，几百行很正常。三条实用对策：小步编译（写一点用一次测一次）、用 `static_assert` 把约束提前写成一句人话、把复杂的类型运算拆成中间别名。",
        "「没用到的成员不会被实例化」是把双刃剑：`Box<T>` 里那个只被少数类型调用的成员，要等第一次真被调用时你才看见它的错误——所以别把「编译通过了」当成「这个类没问题」。",
        "编译期多态 vs 运行期多态：模板要求类型在**写下调用时**就确定，换来零开销与可内联；虚函数允许运行期换实现，代价是要有基类、一次间接跳转、通常不能内联。要「一个容器里放各种形状」用虚函数（s10），要「同样的逻辑作用于各种类型」用模板。",
        "膨胀的真实成本：每种实例化都是一份机器码，`vector<int>`、`vector<long long>`、`vector<unsigned>` 是三份。所以「为了通用给一切套模板」会让编译变慢、二进制变大、报错变长——泛型的收益必须和这三项成本一起算。"
      ],
      summary_en: [
        "A template is a compile-time code generator: better<int> and better<double> each become a real function, and at run time there is no type lookup and no dispatch - that is why generics are not slow.",
        "The price is that generation happens only where the template is used: each .cpp is compiled separately (translation units, 1-4), so the compiler must see the *definition* at the moment it sees better(3, 7); a declaration is not enough.",
        "That is the real reason templates live in headers: put the definition in a .cpp and other units cannot see the body, so they emit a call awaiting instantiation and the link step fails with undefined reference. The fix is to move the definition into the .h (the mainstream answer) or to add an explicit instantiation such as template class Box<int>; at the end of the .cpp (only when you deliberately manage build time and binary size).",
        "Definitions in headers do not cause duplicate symbols for templates: the template itself occupies no run-time storage, and instantiations produced in different units are merged by the linker under the ODR - the same rule that forbids ordinary function definitions in headers, read from the other side (1-4).",
        "Template errors fire at the point of instantiation and are written in substituted type names, so hundreds of lines are normal. Three working countermeasures: compile in small steps (write a little, use it once, test), state constraints with static_assert so the message reads like a sentence, and break complicated type arithmetic into named intermediate aliases.",
        "'Members are not instantiated until used' cuts both ways: a member of Box<T> that only a few types ever call stays error-free until somebody actually calls it, so treat a green build as evidence about the types you used, not about the class.",
        "Compile-time versus run-time polymorphism: templates need the type fixed when the call is written, and pay nothing at run time and stay inlineable; virtual functions allow the implementation to be chosen at run time, at the cost of a base class, one indirection and usually no inlining. A container of various shapes wants virtual functions (s10); the same logic over various types wants a template.",
        "The true cost of bloat: each instantiation is its own machine code, so vector<int>, vector<long long> and vector<unsigned> are three copies. 'Template everything for generality' therefore buys a slower build, a bigger binary and longer errors, and those three must be priced in alongside the benefit."
      ],
      code: `// 头文件里声明与定义必须住在一起，模板才能在使用处被实例化
#pragma once
#include <iostream>
#include <string>

template<typename T>
class Box {
    T item{};
public:
    explicit Box(T v) : item(v) {}
    T get() const { return item; }
    T twice() const { return item * 2; }        // 这个成员只有被调用时才会检查
};

// 如果把上面的定义搬进 box.cpp，另一个编译单元就看不见函数体，
// 链接期会报 undefined reference，而报错位置完全不在你改的那一行。
int main() {
    Box<int> b(21);
    std::cout << b.get() << ' ' << b.twice() << '\\n';
    Box<std::string> s("x");                    // 不调用 twice，string 版本照样编过
    std::cout << s.get() << '\\n';
    static_assert(sizeof(Box<int>) == sizeof(int), "Box should add no members");
    return 0;
}`,
      pit: "「模板编译通过」被当成「这个类是对的」。因为成员只在被调用时实例化，只要某个分支、某个类型从没被用到，它的错误就一直潜伏着——等三个月后同事第一次调用那个成员，才在**他的**代码里看到一屏报错。对策：给模板类配一个只调用每个成员一次的自检函数。",
      pit_en: "Reading 'the template compiled' as 'the class is right'. Members are instantiated only when called, so anything unused stays a latent defect - three months later a colleague calls that member for the first time and gets a wall of errors in *his* file. The countermeasure is a self-check function that touches every member once.",
      ex: {
        q: "为什么模板一般放头文件，而普通函数的定义却建议放 .cpp？",
        a: "因为模板必须在使用处被看到完整定义才能实例化，而普通函数只需声明就能调用、定义交给另一个编译单元并由链接器对接名字。",
        q_en: "Why do templates normally go in a header while an ordinary function's definition belongs in a .cpp?",
        a_en: "Because a template must be seen in full at the use site in order to be instantiated, whereas an ordinary function needs only a declaration to be called - its body lives in another translation unit and the linker matches the names."
      }
    },

    "11-4": {
      title: "模板特化与重载",
      title_en: "Template Specialisation versus Overloading",
      min: 14,
      target: "分得清全特化、偏特化与重载三种手段，能说出它们的匹配顺序，并解释「补了特化却没生效」这类事故。",
      target_en: "Tell full specialisation, partial specialisation and overloading apart, state the order in which they are matched, and explain why 'I added a specialisation but nothing changed'.",
      summary: [
        "全特化＝「给某个具体类型换一份实现」：`template<> struct Hash<const char*> { ... }`。写法必须以 `template<>`（空的尖括号）开头，并且参数表里的每个参数都是具体类型。",
        "漏掉那对空尖括号，写的就不是特化而是重新定义，编译器直接报「重定义」；写成 `template struct Hash<const char*>`（有 `template` 但没有 `<>`）则是**显式实例化**，语义完全不同——后者是「现在就给我生成这份代码」，前者是「换掉通用实现」。",
        "**函数模板没有偏特化**：`template<typename T> void show(T* p)` 不是 `show(T)` 的偏特化，它是一个独立的**重载**。想让「指针走另一条路」，请老老实实写重载函数；写 `template<typename T> void show<T*>(T*)` 是编译错误。",
        "类模板才有偏特化：`template<typename T> struct Hash<T*> { ... }` 只把「指针这一族」特化掉，其余类型仍走通用版。偏特化的要点是参数表里要写出「哪些已经定了、哪些还空着」。",
        "匹配顺序是这一节最容易出错的地方：重载决议先在候选集里挑**签名最合适**的那个——非模板函数优先于模板，函数模板之间比谁的模式更特定；只有当选定某个函数模板之后，才会去看它有没有对应的全特化。也就是说：**全特化不参与「选谁」，它只是被选中之后的实现细节**。",
        "由此产生一个经典事故：先写了 `f(T)`，又写了更贴切的 `f(T*)`，之后才给 `f(T)` 补一个 `template<> void f<int>(int)` 特化。调用 `f(pi)`（pi 是 int*）时命中的其实是 `f(T*)`，你精心补的那份特化根本没被执行——补特化不会改变选择结果。修法：要换行为就写**重载**，别指望特化被优先选中。",
        "`if constexpr`（C++17）常常比特化更好读：同一个函数体里按编译期布尔值分支，`if constexpr (std::is_integral_v<T>) ... else ...`，未选中的分支不会被实例化，因此里面写着对当前 T 非法的代码也没关系。它把「换实现」变成「少编译一点」。",
        "选型顺序建议照抄：① 能不用模板就不用（写两个重载）；② 要按类型走不同逻辑，优先**重载**；③ 类模板里整族类型的差异用**偏特化**；④ 只差一两步动作用 `if constexpr`；⑤ 全特化留给「整个实现都要换掉」并且对象是类模板。另外：不要给 std 的标准组件加特化（除 `std::hash` 等少数被明确允许的），那是未定义行为的常见入口。"
      ],
      summary_en: [
        "A full specialisation means 'here is a different implementation for one concrete type': template<> struct Hash<const char*> { ... }. It must start with the empty angle brackets template<>, and every argument in its list must be a concrete type.",
        "Drop those empty brackets and you have not written a specialisation but a redefinition, which the compiler rejects; writing template struct Hash<const char*> (the keyword without the brackets) is an *explicit instantiation* instead - a completely different statement meaning 'emit this code right now' rather than 'replace the generic body'.",
        "Function templates have no partial specialisation: template<typename T> void show(T* p) is not a partial specialisation of show(T), it is a separate overload. If pointers must take a different road, write an overload; spelling show<T*>(T*) after the template keyword is ill-formed.",
        "Only class templates can be partially specialised: template<typename T> struct Hash<T*> { ... } specialises just the pointer family and leaves everything else to the generic version. The trick in a partial specialisation is writing the parameter list so it shows what is fixed and what is still open.",
        "The matching order is where people go wrong: overload resolution first picks the candidate with the *best-matching signature* - a non-template beats a template, and among function templates the more specialised pattern wins - and only after a function template has been chosen does the compiler look for a full specialisation of it. In other words a full specialisation never takes part in the choice; it is a detail of the implementation once a template has won.",
        "From that follows a classic accident: write f(T), then a better-matching f(T*), and only later add template<> void f<int>(int). Calling f(pi) with an int* selects f(T*), so the specialisation you carefully supplied never runs - adding a specialisation changes no selection. The fix: if behaviour must change, write an overload instead of hoping a specialisation gets picked.",
        "if constexpr (C++17) is often more readable than a specialisation: branch on a compile-time boolean inside one body, as in if constexpr (std::is_integral_v<T>) ... else ..., and the discarded branch is not instantiated, so code that is illegal for the current T there is harmless. It turns 'swap the implementation' into 'compile a little less'.",
        "Copy this order of preference: one, avoid the template at all if two overloads do the job; two, when behaviour depends on type, prefer overloading; three, use partial specialisation for a whole family inside a class template; four, use if constexpr when the types differ by one or two steps; five, reserve full specialisation for 'replace the entire implementation' of a class template. And do not specialise standard library components (std::hash and a few others are explicitly excepted) - that is a common doorway into undefined behaviour."
      ],
      code: `#include <cstddef>
#include <functional>
#include <iostream>
#include <string>
#include <type_traits>

template<typename T>
struct Hash {                                   // 通用版：直接转给标准库
    std::size_t operator()(const T& v) const { return std::hash<T>{}(v); }
};

template<>
struct Hash<const char*> {                      // 全特化：字符串字面量要比内容而不是比地址
    std::size_t operator()(const char* s) const { return std::hash<std::string>{}(s); }
};

template<typename T>
void show(T v) { std::cout << "by value " << v << '\\n'; }

template<typename T>
void show(T* p) { std::cout << "by pointer " << *p << '\\n'; }   // 这是重载，不是偏特化

template<typename T>
void pick(T v) {
    if constexpr (std::is_integral_v<T>) {      // 编译期分支：未选中的那一支不会被实例化
        std::cout << "int-like " << v << '\\n';
    } else {
        std::cout << "other " << v << '\\n';
    }
}

int main() {
    Hash<const char*> h;
    std::cout << (h("abc") == h("abc")) << '\\n';    // 有了特化，内容相同才稳定地同散列
    int n = 5;
    show(n);                                        // 走通用版：by value
    show(&n);                                       // 指针重载更贴切：by pointer
    pick(3);
    pick(3.5);
    return 0;
}`,
      pit: "给已经存在的函数模板补一个全特化，以为从此调用会走新逻辑——结果一点变化都没有。因为重载决议先按**签名**选中了别的候选（可能是同名的另一个重载），你的特化挂在一个没被选中的模板上，永远不会执行。要改行为，请写重载而不是特化。",
      pit_en: "Adding a full specialisation to an existing function template and expecting calls to take the new path - nothing changes. Overload resolution picked a different candidate by signature first, so your specialisation hangs off a template that is never selected and never runs. Change behaviour with an overload, not with a specialisation.",
      ex: {
        q: "为什么函数模板不允许偏特化，而类模板允许？",
        a: "因为函数模板的「按类型形态分派」已经由重载完整覆盖了（写一个 `show(T*)` 就是那个更特定的候选），再加偏特化只会和重载决议产生两套优先级；类模板没有重载可用，所以必须靠偏特化来表达「指针这一族另有实现」。",
        q_en: "Why are function templates forbidden to be partially specialised while class templates may?",
        a_en: "Because for functions that job is already done by overloading - writing show(T*) gives you exactly that more specific candidate - and a second priority system beside overload resolution would only conflict; class templates have no overloading to fall back on, so partial specialisation is their only way to say 'pointers are handled differently'."
      }
    },

    "11-5": {
      title: "类模板与容器实战",
      title_en: "Class Templates and Container Practice",
      min: 14,
      target: "能独立写出一个带边界检查、支持多种元素类型的小型泛型容器，并说清每个设计选择会在什么时候报错。",
      target_en: "Write a small generic container with bounds checking that works for several element types, and state when each design decision turns into a compile error.",
      summary: [
        "从「装一个东西的盒子」升级到「装 N 个 T 的栈」：`template<typename T, int N> class Stack { T data[N]; int top = 0; };`——一个**类型参数**加一个**非类型参数**（值参数），后者必须是编译期常量表达式。",
        "非类型参数的价值是把「容量」抬进类型里：`Stack<int, 8>` 与 `Stack<int, 16>` 是不同类型，装不下的一眼就能被编译期挡住；代价是每种 N 各生成一份代码，而且**不能按运行期输入决定容量**（那需要 `std::vector`，s12 见）。",
        "长度参数用 `int` 还是 `std::size_t`？无符号版本写 `Stack<int, -1>` 会把 -1 变成一个天文数字并触发巨型数组分配；用 `int` 则「负数容量」在编译期就被判非法。初学阶段用 `int` 更省心，工业代码里 `std::size_t` 更常见——关键是知道自己在防什么。",
        "泛型容器的接口细节：`bool push(const T& v)`（不拷贝元素、也能接临时量）、`bool pop(T& out)`（用出参带回元素）、`int size() const`；用返回值表达「满 / 空」比到处抛异常更划算，也让调用处不得不处理失败。",
        "空与满是泛型代码**必须**处理的：`if (top >= N) return false;`。这里有个反直觉的好处——检查只写一次，所有元素类型共享同一份保护；换成手写五个不同数组，你会漏掉其中两个。",
        "成员初始化一个都别漏：`T data[N]{};` 让元素零初始化、`int top = 0;` 就地初始化（C++11 起可以写在成员旁）。写成 `T data[N];` 时，`Stack<int, 8>` 里就是八个垃圾值，读它们是 2-1 讲过的未定义行为。",
        "模板里出现 `T::something` 且它是一个**类型**时，必须写 `typename T::value_type`；不写 typename，编译器会把 `::` 左边的东西当成静态成员或模板名去解析，报错长成 `need 'typename' before ... because ... is a dependent scope`——这是模板报错里最神秘、其实也最好修的一条。",
        "什么时候该改用标准库：需要可变长度、需要拷贝/移动语义、需要迭代器和算法（s13）→ 直接用 `std::vector` 或 `std::array`。自己写泛型容器是为了看懂它，不是为了替代它。衔接：11-6 把「到底该不该用模板」这条判断线画出来。"
      ],
      summary_en: [
        "Graduate from 'a box holding one thing' to 'a stack holding N values of T': template<typename T, int N> class Stack { T data[N]; int top = 0; }; - one type parameter plus one non-type (value) parameter, and the latter must be a constant expression.",
        "A non-type parameter earns its keep by promoting capacity into the type: Stack<int, 8> and Stack<int, 16> are different types, so an overflow of one against the other is refused at compile time; the price is one code copy per N and the inability to size the stack from runtime input (which is what std::vector is for, see s12).",
        "Should the length parameter be int or std::size_t? With the unsigned spelling, Stack<int, -1> turns -1 into an astronomical number and requests a monstrous array; with int, a negative capacity is illegal at compile time. int is kinder while learning, std::size_t is what production uses - the point is knowing which accident you are preventing.",
        "The interface details of a generic container: bool push(const T& v) (no element copy, and temporaries are fine), bool pop(T& out) (the element comes back through an out-parameter), int size() const; reporting full and empty through the return value beats sprinkling exceptions and forces the caller to handle failure.",
        "Empty and full are things generic code *must* handle: if (top >= N) return false;. Here is the counter-intuitive benefit - the check is written once and every element type shares the same protection, whereas five hand-written typed arrays means you forget two of them.",
        "Do not skip a single member initialiser: T data[N]{} zero-initialises the elements and int top = 0 is an in-class initialiser (legal since C++11). Write T data[N]; and a Stack<int, 8> holds eight garbage values, reading any of which is the undefined behaviour from 2-1.",
        "When something after T:: is a type, it must be spelled typename T::value_type; without typename the compiler parses the left-hand side as a static member or template name, and you get the famously cryptic 'need typename before ... because ... is a dependent scope' - the scariest template message that is also the easiest to fix.",
        "When to switch to the standard library: variable length, copy and move semantics, iterators and algorithms (s13) all point to std::vector or std::array. You write a generic container to understand one, not to replace it. Bridge: 11-6 draws the line on whether to use templates at all."
      ],
      code: `#include <iostream>

template<typename T, int N>
class Stack {
    T data[N]{};                              // 元素也做零初始化，避免读到垃圾值
    int top = 0;                              // 就地初始化：C++11 起可以写在成员旁
public:
    bool push(const T& v) {                   // const 引用：大对象不必拷贝，也能接临时量
        if (top >= N) return false;           // 满了就实话实说，绝不越界写
        data[top++] = v;
        return true;
    }
    bool pop(T& out) {                        // 元素通过出参带回，成败交给返回值
        if (top == 0) return false;
        out = data[--top];
        return true;
    }
    int size() const { return top; }
};

int main() {
    Stack<int, 3> si;
    Stack<double, 3> sd;
    for (int i = 1; i <= 5; ++i) { si.push(i); }      // 只装得下三个，后两次返回 false
    double back = 0.0;
    sd.push(1.5);
    std::cout << si.size() << ' ' << (sd.pop(back) ? back : -1.0) << '\\n';
    // 容量是类型的一部分：N 不同的两个 Stack 之间毫无关系，下面这行编不过：
    // Stack<int, 4> diff = si;
    return 0;
}`,
      pit: "把 `N` 当成运行期变量传进来：`Stack<int, count>`——编译直接失败，因为非类型模板参数必须是编译期常量表达式。想按输入决定容量，就要的是 `std::vector`（或者把上限写死成一个足够大的常量并检查），别把模板参数当函数参数用。",
      pit_en: "Passing N as a runtime value, as in Stack<int, count>: that is ill-formed because a non-type template argument must be a constant expression. If the capacity comes from input you want std::vector (or a hard-coded generous bound plus a check) - never treat a template argument like a function argument.",
      ex: {
        q: "`Stack<int, 3>` 和 `Stack<int, 4>` 能互相赋值吗？为什么这样设计？",
        a: "不能——它们是两份独立实例化、两个不同的类型；这正是设计意图：把「容量」写进类型，就能让「把 3 格的东西交给 4 格以外的地方」在编译期暴露，而不是运行期越界。",
        q_en: "Can Stack<int, 3> and Stack<int, 4> be assigned to each other, and why is it designed that way?",
        a_en: "No - they are two separate instantiations and therefore two different types, and that is the point: putting capacity into the type lets a mismatch be caught at compile time instead of showing up as an out-of-bounds write at run time."
      }
    },

    "11-6": {
      title: "综合重构：泛型工具箱与编译期取舍",
      title_en: "Synthesis: A Generic Toolbox and Its Compile-Time Trade-offs",
      min: 15,
      target: "能为一段重复代码选对复用手段（重载 / 函数模板 / 类模板 / 特化 / if constexpr / 虚函数），并预判它的报错形式与代价。",
      target_en: "Choose the right reuse tool for duplicated code - overload, function template, class template, specialisation, if constexpr or virtual functions - and predict the form its errors and its costs will take.",
      summary: [
        "四问选型：① 逻辑完全相同、只有类型不同？→ 函数模板。② 要包一个「类型待定」的数据并配一组操作？→ 类模板。③ 只是某几个类型要走不同路？→ 优先重载（11-4）。④ 要**运行期**才知道用哪种实现？→ 虚函数（s10），模板救不了你。",
        "这一章的落点是四件能用很久的零件：`better(a, b)` 取较优者、`within(v, lo, hi)` 限幅、`Stack<T, N>` 定长栈、`Hash<T>` 的字符串特化。把它们收进自己的头文件，s12 学 STL 时会直接拿来对照。",
        "报错分四层，认层比认字快：「推导失败」在调用处（`better(3, 4.5)`）、「操作不支持」在函数体里（`T` 没有 `>`）、「看不见定义」在链接处（模板定义被放进了 .cpp）、「成员有错」在实例化处（没用过的成员不报错）。这四层的修法彼此完全不同，第一步永远是判断自己踩在哪一层。",
        "交付前三问：定义在不在头文件里？每个成员有没有初始化？对 T 的要求写下来了吗（`static_assert` 或类顶上一句注释，说明「需要支持 > 与可拷贝」）？第三个问题决定三个月后别人还能不能直接用你的模板。",
        "别为「以后可能用到」套模板：泛型代码的报错更贵、编译更慢、调试更难。经验值是「第三次重复才抽象」；只有两种类型时，两个重载几乎总是更好的答案。",
        "性能与体积要对着算：模板零运行开销，但每种实例化都是一份独立代码，`vector<int>` 与 `vector<long long>` 是两份；把类型统一（例如一律 `int32_t`）本身就是一次既省编译时间又省二进制体积的优化。",
        "可读性也是成本：`typename std::decay<T>::type` 这类类型运算、层层套叠的模板参数，都会把「这行在干什么」埋起来。能用 `auto`、用中间别名、用 `if constexpr` 讲清楚的地方，就别用花活。",
        "衔接：s12 会正式拆开 STL 的顺序容器，你会在 `std::vector` 与 `std::array` 上看到这一章每一条语法的真实样子；读不懂它们的声明时，回到 11-3 的「编译期生成代码」这条主线，一切都通了。"
      ],
      summary_en: [
        "Four questions pick the tool: is the logic identical with only the type varying, then a function template; do you need to carry a type-payload with a set of operations, then a class template; do only a few types need a different road, then prefer overloads (11-4); must the implementation be chosen at *run time*, then virtual functions (s10) - templates cannot help there.",
        "The chapter's landing point is four parts that keep paying: better(a, b) to pick between two, within(v, lo, hi) to clamp, Stack<T, N> as a fixed-capacity stack, and the string specialisation of Hash<T>. Keep them in your own header and s12 will use them as the comparison set for the STL.",
        "Errors arrive in four layers and recognising the layer beats reading the text: deduction failure at the call site (better(3, 4.5)), an unsupported operation inside the body (T has no operator>), an invisible definition at link time (the template body ended up in a .cpp), and a broken member at the point of instantiation (unchecked until used). The four need completely different fixes, so step one is always to name your layer.",
        "Three questions before shipping: is the definition in the header? is every member initialised? did you write down the requirements on T (a static_assert, or one line at the top of the class saying 'needs > and copy-constructible')? The third decides whether anyone can still use your template in three months.",
        "Do not template something 'because it might be needed': generic code errors cost more, builds get slower and debugging gets harder. Abstract on the third repetition; with only two types involved, two overloads are nearly always the better answer.",
        "Do the arithmetic on speed and size: templates have zero run-time overhead but every instantiation is its own code, so vector<int> and vector<long long> are two copies. Unifying types (say, always int32_t) is itself an optimisation of both build time and binary size.",
        "Readability is a cost too: type traits arithmetic and deeply nested template arguments bury 'what does this line do'. Where auto, a named intermediate alias or if constexpr says it plainly, do not reach for the clever version.",
        "Bridge: s12 takes the STL sequence containers apart and you will meet every construct of this chapter in the real std::vector and std::array; when their declarations look unreadable, go back to 11-3's line that a template is compile-time code generation, and it starts to make sense."
      ],
      code: `// 把这一章收拢成一个可以复用的工具箱头文件
#include <iostream>
#include <string>

template<typename T>
T better(T a, T b) { return a > b ? a : b; }                 // 要求 T 支持 >

template<typename T>
T within(T v, T lo, T hi) {                                  // 限幅：三元只嵌套到第二层
    return v < lo ? lo : (v > hi ? hi : v);
}

int main() {
    std::cout << better(3, 7) << ' ' << better(2.5, 1.5) << '\\n';   // 两边同类型才推得出来
    std::cout << within(120, 0, 100) << '\\n';                 // 越界值被夹回区间
    // 交付前自查三问：定义在头文件里吗？成员都初始化了吗？对 T 的要求写下来了吗？
    // 推导失败的典型样子，下面这行编不过：
    // std::cout << better(3, 4.5);
    return 0;
}`,
      pit: "在只用到 `int` 和 `double` 的地方写成模板：能跑，但每次改逻辑都要付「读懂模板报错」的税，报错还会落在调用处的文件里。真实项目里更常见的错误方向是「抽象得太早」而不是「太晚」——等第三种类型出现再泛型化，通常一点都不迟。",
      pit_en: "Turning something into a template when only int and double use it: it works, but every later change pays the tax of reading template diagnostics, and those diagnostics land in the caller's file. In real projects the prevailing mistake is abstracting too early, not too late - waiting for the third type before going generic is almost never too late.",
      ex: {
        q: "同样「按类型走不同逻辑」，为什么多数时候写重载比写特化更安全？",
        a: "因为重载会真正参与重载决议、被明确选中，而全特化只是某个已被选中的模板的实现细节；补一个特化既不改变选择结果，也可能永远不被执行，读代码的人还以为它生效了。",
        q_en: "Both can route behaviour by type, so why is overloading usually safer than specialising?",
        a_en: "Because an overload genuinely takes part in overload resolution and is demonstrably selected, whereas a full specialisation is only an implementation detail of a template that has already been chosen - adding one changes no selection, may never run, yet still reads to the next person as if it did."
      }
    }
  },

  /* ---------- 题库：对准本章深化与新增的知识点 ---------- */
  quizAdd: [
    {
      q: "已有 `template<typename T> T max(T a, T b)`，调用 `max(3, 4.5)` 的结果是？",
      o: ["编译失败：T 被同时推成 int 和 double", "自动把 3 升成 double，返回 double", "自动把 4.5 截断成 int，返回 int", "运行期报类型错误"],
      a: 0,
      why: "模板实参推导阶段不做算术提升，同一个 T 在两个位置上推出矛盾类型即为推导失败；要写成 max<double>(3, 4.5) 或把参数拆成两个模板参数。",
      q_en: "Given template<typename T> T max(T a, T b), what happens when you call max(3, 4.5)?",
      o_en: ["It fails to compile: T deduces as both int and double", "The 3 is promoted and it returns a double", "The 4.5 is truncated and it returns an int", "It fails at run time with a type error"],
      why_en: "Deduction performs no arithmetic promotion, so one T deducing to two contradictory types is simply a failure; write max<double>(3, 4.5) or split the parameters into two template parameters."
    },
    {
      q: "模板的定义一般必须放在头文件里，最准确的理由是？",
      o: ["方便别人复制源码", "使用处必须看到完整定义才能实例化生成代码", "因为关键字 export 已经被删除", "否则链接器会把它优化掉"],
      a: 1,
      why: "模板不占运行期空间，它要在每个使用处按实际类型生成代码；如果定义只在某个 .cpp 里，别的编译单元看不见函数体，就只能在链接期报 undefined reference。",
      q_en: "What is the most accurate reason template definitions normally live in headers?",
      o_en: ["So that others can copy the source", "Every use site must see the full definition in order to instantiate it", "Because the export keyword was removed", "Otherwise the linker optimises it away"],
      why_en: "A template occupies no run-time storage; code must be generated per type at each use site, so if the body sits in only one .cpp, other translation units cannot see it and the link step reports undefined reference."
    },
    {
      q: "判断：函数模板可以像类模板那样写偏特化。",
      type: "judge", a: 1,
      why: "错。标准不允许函数模板偏特化；`void show(T*)` 只是另一个**重载**。这也正是「按类型分派」在函数侧应该优先用重载的原因。",
      q_en: "True or false: function templates may be partially specialised just like class templates.",
      why_en: "False. Partial specialisation of function templates is not allowed; void show(T*) is simply another overload, which is exactly why type-based dispatch on the function side should prefer overloading."
    },
    {
      q: "写全特化时，定义必须以 ______ 开头（填那对关键的尖括号写法）。",
      type: "fill", ans: ["template<>", "template <>"],
      why: "空的尖括号表示「这里没有待定的参数，是对某个具体类型的完整特化」；漏掉它会被当成重新定义而报重复定义，写成 template（无尖括号）则是显式实例化。",
      q_en: "A full specialisation must be introduced by ______ (give the exact bracket form).",
      why_en: "The empty brackets say 'nothing here is still to be deduced, this is the complete body for one concrete type'; omit them and you redeclare the entity, and template without brackets is an explicit instantiation instead."
    }
  ],

  /* ---------- 词典（分类沿用「C++ 系统深入」） ---------- */
  terms: [
    { term: "模板实例化", term_en: "Template Instantiation", cat: "C++ 系统深入",
      short: "编译器按实际用到的类型生成一份具体代码的过程。",
      short_en: "The process by which the compiler generates a concrete piece of code for each type actually used.",
      detail: ["没被调用到的成员函数不会被实例化，所以错误也延迟到调用时才出现。", "每种类型各生成一份机器码，实例越多二进制越大、编译越久。"],
      detail_en: ["Members that are never called are never instantiated, so their errors are deferred until somebody calls them.", "Each type gets its own machine code, so more instances mean a bigger binary and a longer build."],
      vs: "实例化发生在编译期，虚函数分派发生在运行期。",
      vs_en: "Instantiation happens at compile time; virtual dispatch happens at run time." },
    { term: "模板实参推导", term_en: "Template Argument Deduction", cat: "C++ 系统深入",
      short: "由实参的类型反推模板参数的过程，函数模板调用时自动发生。",
      short_en: "Working the template parameters out from the types of the arguments, which happens automatically when a function template is called.",
      detail: ["同一个参数名出现在两个位置上，就必须推出同一个类型，max(3, 4.5) 因此失败。", "推不出来就自己写出来：max<double>(3, 4.5)，显式实参会取代推导结果。"],
      detail_en: ["If one parameter name sits in two argument positions it must deduce to one type, which is why max(3, 4.5) fails.", "When deduction cannot decide, say it explicitly: max<double>(3, 4.5) overrides the deduction result."],
      vs: "推导是在猜参数，特化是在换实现。",
      vs_en: "Deduction guesses the arguments; specialisation swaps the implementation." },
    { term: "模板特化", term_en: "Template Specialisation", cat: "C++ 系统深入",
      short: "为某些具体类型单独提供一份实现，替换通用版本。",
      short_en: "Supplying a separate implementation for particular types, replacing the generic one.",
      detail: ["全特化以空的尖括号开头，且参数表里所有参数都必须是具体类型。", "类模板可以偏特化（只固定一部分），函数模板不行，只能用重载。"],
      detail_en: ["A full specialisation starts with empty angle brackets and must fix every parameter to a concrete type.", "Class templates may be partially specialised by fixing only some parameters; function templates may not - overloading is their only route."],
      vs: "特化沿用原有名字，重载是新增一个候选。",
      vs_en: "A specialisation reuses the existing name; an overload adds a new candidate." },
    { term: "编译期多态", term_en: "Compile-Time Polymorphism", cat: "C++ 系统深入",
      short: "在编译期就把类型与代码挑定，运行期零分派开销。",
      short_en: "Choosing the types and the code at compile time so that run time pays no dispatch cost.",
      detail: ["与虚函数相对：不需要共同基类，也不能在运行期更换实现。", "报错集中在实例化处、以替换后的类型名呈现，定位成本明显高于普通函数。"],
      detail_en: ["Against virtual functions: no common base is needed, but the implementation can no longer be switched at run time.", "Diagnostics cluster at the point of instantiation and are written in substituted type names, which cost far more to localise."],
      vs: "编译期多态换不来「同一个容器放不同形状」，那需要运行期多态。",
      vs_en: "Compile-time polymorphism cannot give you one container holding different shapes; that needs run-time polymorphism." },
    { term: "非类型模板参数", term_en: "Non-Type Template Parameter", cat: "C++ 系统深入",
      short: "模板参数位置上放的是一个值（如数组长度），而不是类型。",
      short_en: "A template parameter slot filled by a value, such as an array length, rather than by a type.",
      detail: ["它的实参必须是编译期常量表达式，所以 Stack<int, count> 在 count 是运行期变量时编不过。", "不同取值生成不同类型，Stack<int,3> 与 Stack<int,4> 之间不能互相赋值。"],
      detail_en: ["Its argument must be a constant expression, so Stack<int, count> is ill-formed when count is a runtime variable.", "Different values produce different types, so Stack<int,3> and Stack<int,4> cannot be assigned to one another."],
      vs: "类型参数决定「装什么」，值参数决定「装多少」。",
      vs_en: "A type parameter says what goes in; a value parameter says how much fits." },
    { term: "类模板实参推导", term_en: "Class Template Argument Deduction", cat: "C++ 系统深入",
      short: "C++17 起可由构造实参推出类模板的类型参数。",
      short_en: "Since C++17 the type arguments of a class template can be deduced from its constructor arguments.",
      detail: ["Box b{3.5} 推出 Box<double>，std::pair p{1, 2.0} 同理。", "没有可用的构造函数或推导指南时仍要写全 Box<int>，所以旧说法只是不再完整。"],
      detail_en: ["Box b{3.5} deduces Box<double>, and std::pair p{1, 2.0} works the same way.", "Without a usable constructor or deduction guide you must still spell Box<int>, so the old rule is merely no longer complete."],
      vs: "函数模板一直能推导，类模板到 C++17 才开始。",
      vs_en: "Function templates have always deduced their arguments; class templates only learned to in C++17." }
  ],

  achievements: [
    { id: "generic_writer", icon: "🧬", name: "泛型初成", name_en: "Generic Author",
      desc: "完成 s11 · 模板与泛型 全部课节", desc_en: "Finish every lesson of s11 Templates & Generics",
      check: ["s11"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "只要求 T 支持 > 与拷贝": "requires only that T supports > and copying",
    "推出 T 是 int": "T is deduced as int",
    "两边都是 double 才推得出来": "both sides must be double for deduction to succeed",
    "显式给类型：比的是字典序": "the type is stated explicitly: this compares lexicographically",
    "推导冲突：T 不能同时是 int 和 double，下面这行编不过：": "deduction conflict: T cannot be int and double at once, so the next line is ill-formed:",
    "要比内容就先变成 string": "to compare contents, turn them into std::string first",
    "花括号初始化：数值型成员不会是垃圾": "brace initialisation: a numeric member is never garbage",
    "explicit：禁止把 int 隐式当成 Box<int>": "explicit: stops an int from silently becoming a Box<int>",
    "类内只声明，定义放到类外": "declared inside the class, defined outside it",
    "每种实例化各有自己的一份": "each instantiation gets its own copy",
    "类外定义必须带模板头并写全 Box<T>::": "an out-of-class definition repeats the template header and spells Box<T>::",
    "C++17 CTAD：推出 Box<double>": "C++17 CTAD: deduces Box<double>",
    "两个实例化毫无关系，下面这行是编译错误：": "the two instantiations are unrelated, so the next line is a compile error:",
    "头文件里声明与定义必须住在一起，模板才能在使用处被实例化": "declaration and definition must live together in the header so each use site can instantiate",
    "这个成员只有被调用时才会检查": "this member is only checked once something calls it",
    "如果把上面的定义搬进 box.cpp，另一个编译单元就看不见函数体，": "move the definition above into box.cpp and the other translation unit cannot see the body,",
    "链接期会报 undefined reference，而报错位置完全不在你改的那一行。": "the link step then reports undefined reference, nowhere near the line you edited.",
    "不调用 twice，string 版本照样编过": "as long as twice is never called, the string version still compiles",
    "通用版：直接转给标准库": "generic version: forwards straight to the standard library",
    "全特化：字符串字面量要比内容而不是比地址": "full specialisation: string literals must compare by content, not by address",
    "这是重载，不是偏特化": "this is an overload, not a partial specialisation",
    "编译期分支：未选中的那一支不会被实例化": "compile-time branch: the discarded arm is never instantiated",
    "有了特化，内容相同才稳定地同散列": "only with the specialisation do equal contents reliably hash equal",
    "走通用版：by value": "takes the generic version: by value",
    "指针重载更贴切：by pointer": "the pointer overload matches better: by pointer",
    "元素也做零初始化，避免读到垃圾值": "the elements are zero-initialised too, so nothing reads garbage",
    "就地初始化：C++11 起可以写在成员旁": "in-class initialiser: legal since C++11",
    "const 引用：大对象不必拷贝，也能接临时量": "const reference: no copy for big objects, and temporaries are accepted",
    "满了就实话实说，绝不越界写": "report 'full' honestly and never write past the bound",
    "元素通过出参带回，成败交给返回值": "the element comes back through an out-parameter, success through the return value",
    "只装得下三个，后两次返回 false": "only three fit, so the last two pushes return false",
    "容量是类型的一部分：N 不同的两个 Stack 之间毫无关系，下面这行编不过：": "capacity is part of the type: two Stacks with different N are unrelated, so the next line fails:",
    "把这一章收拢成一个可以复用的工具箱头文件": "the whole chapter gathered into one reusable toolbox header",
    "要求 T 支持 >": "requires T to support >",
    "限幅：三元只嵌套到第二层": "clamp: the ternary nests only to its second level",
    "两边同类型才推得出来": "deduction works only when both sides share a type",
    "越界值被夹回区间": "the out-of-range value is squeezed back into the interval",
    "交付前自查三问：定义在头文件里吗？成员都初始化了吗？对 T 的要求写下来了吗？": "three checks before shipping: definition in the header? every member initialised? requirements on T written down?",
    "推导失败的典型样子，下面这行编不过：": "the typical shape of a deduction failure; the next line does not compile:"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_S11);
