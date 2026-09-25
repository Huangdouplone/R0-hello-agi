/* ================================================================
 * R0:hello agi · 课程深化层 ⑥（s3 运算符与输入输出 / s4 控制流）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「让程序会算、会说、会判断、会重复」这两章从每节 3 要点深化到 6~8 要点，
 *       火力集中在初学阶段真正会翻车的地方：整数除法与取余符号、= 与 ==、短路副作用、
 *       优先级陷阱、cin 与 getline 混读、浮点格式化的粘性、差一错误、
 *       break/continue 在 for 与 while 里的差异。两章末尾各加一节「综合重构」收口。
 * 写法约定：既有课节不写 title；新增节写 title/title_en/target/target_en 并出现在 order；
 *           code 里的中文注释全部登记在 codeComments；英文条数与中文严格一致。
 * ================================================================ */

const DEEPEN_S34 = {
  stages: ["s3", "s4"],

  order: {
    s3: ["3-1", "3-2", "3-3", "3-4", "3-5", "3-6", "3-7"],
    s4: ["4-1", "4-2", "4-3", "4-4", "4-5", "4-6", "4-7", "4-8"]
  },

  lessons: {

    /* ===================== s3 运算符与输入输出 ===================== */
    "3-1": {
      min: 12,
      summary: [
        "`+ - * /` 对整数就是小学数学，唯一的例外是 `/`：两个整数相除会**向零截断**，`5/2` 得 2 而不是 2.5——因为 int 没有任何位置存放小数部分。",
        "想要浮点结果，必须让至少**一个**操作数本来就是浮点：`a/2.0` 或 `static_cast<double>(a)/b` 都对；`static_cast<double>(a/b)` 太晚了，小数在除法那一瞬间就已经没了。",
        "`%` 是「取余」而不是数学里的「模」：结果的符号**跟随左操作数**，所以 `-7%2` 是 -1。C++11 起这是硬规定，为的是让 `(a/b)*b + a%b == a` 永远成立。",
        "判奇偶不要写 `n%2 == 1`：负奇数得到的是 -1，条件永远不成立，于是「-7 是偶数」。正确判据是 `n%2 != 0`，它对正负都成立。",
        "拆分位数是 `/` 与 `%` 的标准配合：个位 `n%10`、十位 `n/10%10`、百位 `n/100%100`——先用除法把目标位挪到最低位，再用取余把它剥出来。",
        "复合赋值 `+= -= *= /= %=` 是「就地更新」的简写，但别写成 `i =+ 2`（那是 `i = (+2)`）；`++/--` 分前置后置：`j = i++` 先交旧值再加一，`j = ++i` 先加一再交新值，单独成句时两者等价，统一写 `++i` 可以少想一件事。",
        "衔接：这一章全部建立在 s2 的类型之上（是整数还是浮点，决定除法的行为）；3-2 把「算出一个数」推进到「判断一个条件」。"
      ],
      summary_en: [
        "For integers, '+ - * /' is school arithmetic with one exception: '/' truncates toward zero, so 5/2 is 2, not 2.5 — an int simply has no place to keep the fraction.",
        "To get a floating result at least *one* operand must already be floating-point: a/2.0 and static_cast<double>(a)/b both work, but static_cast<double>(a/b) is too late — the fraction died inside the division.",
        "'%' is a remainder, not a mathematical modulus: its sign follows the *left* operand, so -7%2 is -1. Since C++11 this is mandated so that (a/b)*b + a%b == a always holds.",
        "Do not test oddness with n%2 == 1: a negative odd number gives -1, the test never fires and '-7 is even' becomes true. Write n%2 != 0, which is correct for both signs.",
        "Digit extraction is the standard pairing of '/' and '%': ones = n%10, tens = n/10%10, hundreds = n/100%100 — divide to move the target digit to the bottom, then peel it off.",
        "Compound assignments += -= *= /= %= mean 'update in place', but never type 'i =+ 2' (that is i = (+2)); ++/-- come in pre and post forms — j = i++ hands out the old value then increments, j = ++i increments first. Alone in a statement they are identical, so prefer ++i and think less.",
        "Bridge: everything here rests on s2's types (int versus double decides the division), and 3-2 moves us from 'compute a value' to 'test a condition'."
      ],
      code: `#include <iostream>
int main() {
    int a = 5, b = 2;
    std::cout << a / b << '\\n';                     // 2：整数除法向零截断
    std::cout << a / 2.0 << '\\n';                   // 2.5：只要有一边是浮点就走浮点除法
    std::cout << (-7 / 2) << ' ' << (-7 % 2) << '\\n';   // -3 与 -1：余数的符号跟着左操作数
    int n = 123;
    std::cout << n % 10 << n / 10 % 10 << n / 100 % 10 << '\\n';  // 逐位拆出 3、2、1
    int odd = -7;
    if (odd % 2 != 0) std::cout << "odd\\n";         // 判奇偶用 != 0，别写 == 1
    int i = 3, j = 3;
    std::cout << i++ << ' ';                        // 后置：先交 3，然后 i 才变 4
    std::cout << ++j << ' ';                        // 前置：j 先变 4，交出去的是 4
    std::cout << i << j << '\\n';                    // 44：一条语句只改一个变量，才没有歧义
    return 0;
}`,
      pit: "用取余做环形下标：`(idx - 1) % n` 在 idx 为 0 时得到 -1，拿去访问数组就是越界（未定义行为）。环形索引必须写成 `((idx - 1) % n + n) % n`，或者先把负数单独判掉。",
      pit_en: "Using the remainder for a ring index: (idx - 1) % n yields -1 when idx is 0, and that subscript indexes outside the array (undefined behaviour). Write ((idx - 1) % n + n) % n, or handle the negative case first.",
      ex: {
        q: "为什么 `-7 % 2` 的结果是 -1 而不是 1？",
        a: "因为 C++11 规定整数除法向零截断（-7/2 得 -3），再由恒等式 `(a/b)*b + a%b == a` 反推，余数的符号就必须跟被除数一致。",
        q_en: "Why is -7 % 2 equal to -1 rather than 1?",
        a_en: "C++11 mandates truncation toward zero (-7/2 is -3), and the identity (a/b)*b + a%b == a then forces the remainder to carry the dividend's sign."
      }
    },

    "3-2": {
      min: 13,
      summary: [
        "六个关系运算符（`== != > < >= <=`）的结果就是一个 `bool`，可以直接赋给 bool 变量、直接当 if 的条件；写 `if (ok == true)` 不是错，只是把一句话摊成三句话。",
        "`=` 是赋值、`==` 才是比较，而且**少写一个等号通常不报错**：`if (score = 100)` 先把 100 写进 score，再把「非 0」当条件，于是恒真。防线有三条：常量写在左边（`if (100 == score)`，写成单等号直接编译失败）、把警告全开、以及「条件里不放赋值」。",
        "数学式的 `a < b < c` 在 C++ 里一定是错的：先算 `a<b` 得到 0 或 1，再拿这个 0/1 去和 c 比，结果常常恒为真。区间判断必须拆成 `a < b && b < c`。",
        "`&&` 与 `||` 是**短路**的：左边已经能定输赢就不算右边。这既是防御手段（`if (p != nullptr && p->ok)` 让空指针那半边压根不执行），也是 bug 来源（把有副作用的调用放在右边，条件一变它就少跑一次）。",
        "短路的顺序还能决定崩不崩：`if (i < n && arr[i] == 0)` 安全，反过来写就越界。规矩只有一条——**守卫条件永远写在左边**。",
        "`!` 的优先级比想象中高：`!x == 0` 其实是 `(!x) == 0`。德摩根律也容易写错：「既不是 A 也不是 B」是 `!(A || B)`，等价于 `!A && !B`；写成 `!A || !B` 意思完全变了。",
        "别把位运算和逻辑运算混为一谈：`if (a & b)` 是「按位与之后那个数非零」，`if (a && b)` 才是「两者都为真」；而 `a & b == 0` 又涉及优先级，3-4 专门处理。",
        "衔接：条件写对了，剩下的风险是一串混合运算有没有按你以为的顺序结合——那就是 3-4 的主题。"
      ],
      summary_en: [
        "The six relational operators (== != > < >= <=) produce a bool you can store or feed straight to if; 'if (ok == true)' is not wrong, it just stretches one idea over three phrases.",
        "= assigns and == compares, and dropping one equals sign usually still compiles: 'if (score = 100)' writes 100 into score first, then treats non-zero as true, so the branch always runs. Three defenses: put the constant on the left ('if (100 == score)', where a single = fails to compile), enable all warnings, and never assign inside a condition.",
        "The mathematical chain a < b < c is always wrong in C++: a<b collapses to 0 or 1 first, and that 0/1 is compared with c, so the result is usually true no matter what n is. Write a < b && b < c.",
        "&& and || short-circuit: once the left side decides the outcome the right side is never evaluated. That is both a defence (in if (p != nullptr && p->ok) the dereference cannot run) and a bug source (put a call with side effects on the right and it silently stops happening).",
        "Short-circuit order also decides whether you crash: 'if (i < n && arr[i] == 0)' is safe, the reverse indexes out of bounds. One rule — the guard always goes on the left.",
        "! binds tighter than expected: '!x == 0' is (!x) == 0. De Morgan trips people too — 'neither A nor B' is !(A || B), i.e. !A && !B, while !A || !B says something else entirely.",
        "Do not confuse bitwise with logical: 'if (a & b)' asks whether the bit-and result is non-zero, 'if (a && b)' asks whether both are true; and 'a & b == 0' is a precedence problem, which 3-4 handles head-on.",
        "Bridge: with conditions expressed correctly, the remaining risk is how a mixed expression gets grouped — that is 3-4."
      ],
      code: `#include <iostream>
int main() {
    int score = 88, n = 5;
    bool pass = score >= 60;                    // 关系运算本身就产出 bool，不必再和 true 比
    if (score == 100) std::cout << "perfect\\n"; // 一个等号是赋值：分数被改掉而且条件恒真
    bool chainBug = 1 < n < 3;                  // 先算 (1<5) 得 true，再拿 1 去和 3 比
    bool chainOK = 1 < n && n < 3;              // 区间判断只能拆成两段
    int idx = -1;
    int arr[3] = {1, 2, 3};
    if (idx >= 0 && idx < 3 && arr[idx] == 1)   // 守卫写在左边，越界的那一半不会执行
        std::cout << "hit\\n";
    bool isStudent = false;
    bool neither = !isStudent && !(score > 90); // 德摩根：两个都不成立的正确写法
    std::cout << pass << chainBug << chainOK << neither << '\\n';
    return 0;
}`,
      pit: "把「必须执行」的调用写在 `&&` 右边：`if (cacheHit && loadFromDisk())`——一旦 cacheHit 为 false，`loadFromDisk()` 就完全不执行，程序表现为「偶尔少加载一次」。需要保证执行的操作，先单独成句再进条件。",
      pit_en: "Placing a call that must run on the right of &&: in 'if (cacheHit && loadFromDisk())' loadFromDisk() is skipped entirely whenever cacheHit is false, so the program 'occasionally forgets to load'. Statements that must execute belong on their own line, before the test.",
      ex: {
        q: "`1 < n < 3` 为什么能编译通过，却几乎一定是错的？",
        a: "因为 `1 < n` 先算出一个 bool（0 或 1），接着拿这个 0/1 与 3 比较，结果通常恒为真——它表达的不是「n 在区间内」。",
        q_en: "Why does '1 < n < 3' compile yet is almost always a mistake?",
        a_en: "Because 1 < n collapses to a bool (0 or 1) first, and that 0/1 is then compared with 3, so the whole thing is usually true — it never says 'n is in range'."
      }
    },

    "3-3": {
      min: 11,
      summary: [
        "六个位运算符直接操作二进制位：`&` 两位都是 1 才 1，`|` 有 1 就 1，`^` 不同才 1，`~` 逐位取反，`<<` / `>>` 把整体平移。",
        "`x << k` 相当于乘 2 的 k 次方、`x >> k` 相当于除（正数时向零取整）。但**别为了性能写移位**：`-O2` 下编译器本来就会把 `*2` 变成 `<<1`，你换到的只是更难读的代码；移位真正的用途是掩码与标志位。",
        "移位有硬边界：移位量 ≥ 类型位宽（对 32 位 int 写 `1 << 32`）或移位量为负，标准直接判为**未定义行为**，不要指望「结果等于 0」。",
        "对有符号数右移是实现定义的：负数通常走算术右移（复制符号位），`-8 >> 1` 得 -4；想要补 0 的逻辑右移，先把操作数转成无符号类型再移。",
        "标志位是位运算最正当的战场：`flags = flags | FLAG_A` 打开、`flags &= ~FLAG_A` 关闭、检查写 `(flags & FLAG_A) != 0`。括号和 `!= 0` 都不能省，因为 `&` 的优先级**低于** `==`。",
        "四个值得背下来的小技巧：`x & 1` 取最低位（判奇偶）、`x & (x - 1)` 抹掉最低位的 1（结果为 0 说明是 2 的幂）、`x | mask` 置位、`a ^ b ^ b == a`（异或可逆，用于交换与找落单元素）。",
        "两个典型误解：把 `^` 当成乘方（C++ 没有幂运算符，要用 `std::pow`）、把 `~0` 当成 1（它是全 1，也就是 -1）。这两条写错时编译器不一定拦得住你。",
        "衔接：这些坑的根源几乎都指向优先级，3-4 一次把顺序表讲透。"
      ],
      summary_en: [
        "The six bitwise operators act on individual bits: & sets a bit only if both are 1, | if either is, ^ only if they differ, ~ flips every bit, and << / >> slide the whole pattern sideways.",
        "x << k multiplies by 2^k and x >> k divides (truncating, for positives). But do not shift *for speed*: at -O2 the compiler already turns *2 into <<1, so all you buy is code that reads worse. The honest uses are masks and flags.",
        "Shifting has hard limits: a shift count at or above the type's width (1 << 32 on a 32-bit int), or a negative count, is undefined behaviour outright — 'it becomes 0' is not a promise.",
        "Right-shifting a signed value is implementation-defined: negatives usually take an arithmetic shift that copies the sign bit, so -8 >> 1 is -4; for a logical shift that fills with zeros, convert to unsigned first.",
        "Flag bits are the legitimate battleground: flags = flags | FLAG_A raises, flags &= ~FLAG_A clears, and (flags & FLAG_A) != 0 tests. The parentheses and the != 0 are mandatory because & binds *looser* than ==.",
        "Four tricks worth memorising: x & 1 takes the lowest bit (odd/even), x & (x - 1) erases the lowest set bit (a zero result means a power of two), x | mask raises bits, and a ^ b ^ b == a, which powers swapping and finding the odd one out.",
        "Two persistent misconceptions: reading ^ as exponentiation (C++ has no power operator, so use std::pow) and ~0 as 1 (it is every bit set, i.e. -1). The compiler will not always stop either one.",
        "Bridge: nearly all of these traps are precedence traps, which 3-4 lays out in full."
      ],
      code: `#include <iostream>
int main() {
    int flags = 0b0101;                           // C++14 二进制字面量：第 0、2 位开着
    const int FLAG_A = 1 << 0, FLAG_B = 1 << 1, FLAG_C = 1 << 2;
    bool hasA = (flags & FLAG_A) != 0;            // 括号加 != 0：& 的优先级低于 ==
    bool hasB = (flags & FLAG_B) != 0;            // 第 1 位没开，所以是 false
    int trap = flags & FLAG_B == 0;               // 被读成 flags 与 0 的按位与，结果是 0
    int shiftTrap = 1 << 3 + 1;                   // 不是先移位再加一，而是 1 左移 4 位得 16
    unsigned int high = 0x80000000u;
    std::cout << (high >> 31) << '\\n';            // 1：无符号右移在高位补 0
    // 移位量等于位宽是未定义行为，下面这行永远不要写：
    // std::cout << (high >> 32);
    int x = 24;
    std::cout << (x & 1) << (x & (x - 1)) << '\\n';   // 0 与 16：判奇偶、抹掉最低位的 1
    flags &= ~FLAG_A;                             // 关掉一个标志位
    std::cout << hasA << hasB << trap << shiftTrap << flags << '\\n';
    return 0;
}`,
      pit: "生成掩码时忘了移位与减法的优先级：`int mask = 1 << n - 1;` 算的其实是 `1 << (n-1)`（减号优先级更高）；而当 n 到 31 时 `1 << 31` 撞上 int 的符号位，直接成为未定义行为。构造掩码请写 `(1u << n) - 1u`，用无符号字面量。",
      pit_en: "Forgetting precedence between shift and subtraction when building a mask: 'int mask = 1 << n - 1;' actually computes 1 << (n-1) because - binds tighter, and once n reaches 31 the 1 << 31 hits int's sign bit — undefined behaviour. Write the mask as (1u << n) - 1u with an unsigned literal.",
      ex: {
        q: "为什么 `flags & FLAG_A == 0` 不能判断「标志位没打开」？",
        a: "因为 `==` 的优先级高于 `&`，它被解析成 `flags & (FLAG_A == 0)`，也就是 `flags & 0`，永远得 0；正确写法是 `(flags & FLAG_A) == 0`。",
        q_en: "Why can't 'flags & FLAG_A == 0' test that a flag is off?",
        a_en: "Because == binds tighter than &, so it parses as flags & (FLAG_A == 0), i.e. flags & 0, which is always 0; the test must read (flags & FLAG_A) == 0."
      }
    },

    "3-4": {
      min: 12,
      summary: [
        "优先级表只需记大类：后缀与一元 → 乘除余 → 加减 → 移位 → 大小关系 → 相等 → `&` → `^` → `|` → `&&` → `||` → 三元 `?:` → 赋值 → 逗号。中间那五档（移位 / 关系 / 相等 / 位运算）是事故高发区。",
        "三条最常被踩的硬事实：位运算 `& | ^` 全部**低于**比较（`a & b == c` 是 `a & (b == c)`）；移位**低于**加减（`1 << 3 + 1` 是 `1 << 4`）；赋值的优先级几乎垫底而且**右结合**（`a = b = c` 合法，等于 `a = (b = c)`）。",
        "结合性决定同级谁先算：`a - b - c` 是 `(a-b)-c`（左结合），`a = b = c` 从右往左，三元 `?:` 也右结合——所以 `x ? a : y ? b : c` 会被读成 `x ? a : (y ? b : c)`。",
        "输出流 `<<` 的优先级低于加减，所以 `cout << a + b` 正常；但它也低于比较，所以 `cout << a > b` 会被解析成 `(cout << a) > b`：先把 a 输出来，再把一个没人要的比较结果丢掉，程序照样编过。",
        "三元 `?:` 的低优先级还会咬第二口：`cout << flag ? \"a\" : \"b\"` 打印的是 flag（1 或 0）而不是 a/b；`x ? a : b = 5` 里的 `= 5` 只作用在 b 上。放进 `<<` 链的三元必须再加一层括号。",
        "逗号是整张表里最低的运算符：`int x = (1, 2, 3);` 得到 3。除了 for 的初始化与步进，业务代码里几乎不该出现它。",
        "**优先级决定「怎么加括号」，不决定「谁先算」**：像 `i = i++ + 1` 或 `f(i, i++)` 这种在同一表达式里既读又改同一个变量的写法是未定义行为，跟优先级无关，加括号也救不回来。",
        "所以唯一需要长期遵守的规则：拿不准就加括号。括号在编译期就被消化掉，不影响一个比特的性能，只决定下一个人能不能读对你的意思。"
      ],
      summary_en: [
        "Learn the table in blocks: postfix and unary, multiply/divide/remainder, add/subtract, shifts, relational, equality, &, ^, |, &&, ||, the ternary ?:, assignment, comma. The middle five rows (shifts, relational, equality, bitwise) are where accidents happen.",
        "Three facts people get wrong constantly: & | ^ all bind *looser* than the comparisons (a & b == c is a & (b == c)); shifts bind looser than +/- (1 << 3 + 1 is 1 << 4); assignment sits near the very bottom and is right-associative, so a = b = c means a = (b = c).",
        "Associativity settles ties: a - b - c is (a-b)-c (left-associative), a = b = c runs right to left, and ?: is right-associative, so x ? a : y ? b : c reads as x ? a : (y ? b : c).",
        "The stream << binds looser than +/-, so 'cout << a + b' is fine; but it also binds looser than comparisons, so 'cout << a > b' parses as (cout << a) > b — it prints a, throws away a comparison nobody wanted, and still compiles.",
        "The ternary's loose binding bites twice more: 'cout << flag ? \"a\" : \"b\"' prints flag (1 or 0), not a/b, and in 'x ? a : b = 5' the assignment only touches b. A ternary inside a << chain needs one extra pair of parentheses.",
        "Comma is the loosest operator in the whole table: 'int x = (1, 2, 3);' gives 3. Outside the init and step clauses of a for, it should essentially never appear in application code.",
        "Precedence decides *how an expression is parenthesised*, not *what runs first*: forms like i = i++ + 1 or f(i, i++) read and modify the same variable in one expression and are undefined behaviour regardless of precedence.",
        "Hence the one rule worth keeping for life: add parentheses whenever you are unsure. They vanish at compile time and cost not a single bit of performance; they only decide whether the next reader groups the expression the way you did."
      ],
      code: `#include <iostream>
int main() {
    int a = 6, b = 4, c = 2;
    int r1 = 2 + 3 * 2;                 // 8：乘法高于加法
    int r2 = a & b == 0;                // 0：解析成 a 与 (b==0) 按位与
    int r3 = (a & b) == 0;              // 0：6 与 4 的公共位不为空，所以是假 —— 加括号才是本意
    int r4 = 1 << 2 + 3;                // 32：先算 2+3=5，再左移 5 位
    int r5 = a - b - c;                 // 0：减法左结合
    int r6 = a - (b - c);               // 4：括号确实会改变结果
    int r7 = (1, 2, 3);                 // 逗号运算符取最后一个：3
    bool flag = true;
    const char* s = flag ? "yes" : "no";        // 三元在赋值右边可以裸写
    std::cout << (flag ? "A" : "B");            // 放进输出流必须再加一层括号
    std::cout << r1 << r2 << r3 << r4 << r5 << r6 << r7 << s << '\\n';
    return 0;
}`,
      pit: "把「求值顺序」当成优先级：`int v = arr[i++] + i;` 里 `i++` 的副作用什么时候生效，标准并没有保证（C++17 只固定了少数运算符的结合次序），于是同一行代码在不同编译器上给出不同结果。规矩是：一条语句里同一个变量只改一次。",
      pit_en: "Confusing precedence with evaluation order: in 'int v = arr[i++] + i;' nothing guarantees when the i++ side effect lands (C++17 pins down only a handful of operators), so compilers may disagree. The rule is one modification per variable per statement.",
      ex: {
        q: "括号会影响程序性能吗？为什么还鼓励不加怀疑地多用括号？",
        a: "不会——优先级与括号只决定语法树长什么样，编译期就折好了，生成的机器码可以完全一致；换来的是「别人读到的含义和你一致」。",
        q_en: "Do parentheses cost performance, and why add them freely anyway?",
        a_en: "No — precedence and parentheses only shape the syntax tree, which is folded away at compile time, so the emitted code can be identical; what you buy is that the next reader groups it the same way you did."
      }
    },

    "3-5": {
      min: 14,
      summary: [
        "`cin >> x` 读的是「一个以空白分隔的 token」：它先跳过空格、Tab、换行，遇到下一个空白就停。所以 `cin >> a >> b` 面对「3 4」或「3⏎4」都能正确分给两个变量——链式写 `>>` 就是「接着读下一个」。",
        "`>>` 停在空白处但**不消耗**那个空白，这是 cin 与 getline 混读翻车的总根源：`cin >> n;` 之后紧跟 `getline(cin, line);`，line 会立刻拿到一个**空串**，因为 getline 看到的「整行」就是那个没人吃掉的换行符。",
        "正确的接法是在中间插一刀：`cin.ignore(std::numeric_limits<std::streamsize>::max(), '\\n')` 把残行整条丢掉（需要 `<limits>`），然后再 getline。记住形状：**数字用 `>>`，整行用 getline，两者之间必须 ignore**。",
        "`getline` 读一整行并且**丢掉行尾的换行**（不会塞进 string），适合名字、句子、任何带空格的文本；要读一行里的 n 个数字，还是 `>>` 配循环更省事。",
        "类型不符时流会进入失败状态：`int x; cin >> x;` 输入 `abc`，C++11 起 x 被置为 0，并且 cin 从此每次读取都立即失败。`while (cin >> x)` 因此会**干净地结束**（遇坏字符或 EOF 就退出），这正是它成为标准读入写法的原因。",
        "死循环出现在「自己判标志」的版本：`while (!done) { cin >> x; if (cin.fail()) continue; }` 会卡在同一个坏字符上无限转。恢复现场是三步：`cin.clear()` 清标志、`cin.ignore(...)` 扔掉那个坏 token、再重新读；少了 ignore 就永远在同一块石头上摔倒。",
        "`cin` 与 `cout` 默认是绑定（tie）的：每次读之前会先把输出缓冲区刷新，所以提示语后面不加 `endl` 也看得见。但从文件、管道或别的界面读时这层保险不一定在，关键提示仍建议显式 `std::flush`。",
        "性能：`endl` 每次都刷新缓冲区，海量输出时明显更慢，改用 `'\\n'`；批量读入可以加 `ios::sync_with_stdio(false)` 提速，但**关掉同步之后就不要再混用 C 语言的 `scanf` / `printf`**，两套缓冲区交错会让输出乱序。"
      ],
      summary_en: [
        "cin >> x reads one whitespace-delimited token: it skips spaces, tabs and newlines first, then stops at the next blank. So 'cin >> a >> b' splits either '3 4' or '3\\n4' correctly — chaining >> just means 'read the next one'.",
        ">> stops at the blank but does not consume it, and that single fact causes almost every cin/getline mix-up: after 'cin >> n;', a following 'getline(cin, line)' immediately hands back an empty string, because the 'whole line' getline sees is the newline nobody ate.",
        "The fix is to cut in between: cin.ignore(std::numeric_limits<std::streamsize>::max(), '\\n') throws the rest of the line away (it needs <limits>), and only then does getline work. Memorise the shape: numbers with >>, whole lines with getline, an ignore in between.",
        "getline reads one full line and discards the trailing newline (it never lands in the string), which is what you want for names, sentences and any text containing spaces; for n numbers on one line a >> loop is still easier.",
        "On a type mismatch the stream enters a fail state: feeding 'abc' to 'int x; cin >> x;' gives x = 0 (since C++11) and every later read fails instantly. That is exactly why 'while (cin >> x)' terminates cleanly on a bad character or EOF.",
        "The infinite loop appears in the hand-rolled flag version: 'while (!done) { cin >> x; if (cin.fail()) continue; }' spins forever on the same bad character. Recovery takes three steps — cin.clear() resets the flags, cin.ignore(...) discards the offending token, then read again; skip the ignore and you fall on the same stone every time.",
        "cin is tied to cout by default, so the output buffer is flushed before every read and your prompt shows up without an endl. That safety net is absent when reading from a file, a pipe or another UI, so flush explicitly for critical prompts.",
        "Performance: endl flushes on every call and is measurably slower under heavy output, so use '\\n'; for bulk input, ios::sync_with_stdio(false) helps — but once unsynchronised, never mix in the C scanf/printf, because two buffers interleave and output order breaks."
      ],
      code: `#include <iostream>
#include <string>
#include <limits>
int main() {
    int n = 0, total = 0;
    std::cout << "quantity: ";                  // 提示与读取之间由 tie 自动刷新
    std::cin >> n;
    std::string line;
    std::getline(std::cin, line);               // 只吃到残留的换行，line 是空串
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\\n');
    std::getline(std::cin, line);               // 现在读到的才是用户输入的整行
    int x = 0;
    while (std::cin >> x) {                     // 遇坏字符或 EOF 条件为假，循环自然结束
        total += x;
        if (--n <= 0) break;                    // 需要限量时再加一个出口
    }
    if (!std::cin) {                            // 曾经读失败：想继续用得先恢复现场
        std::cin.clear();                       // 清掉失败标志
        std::cin.ignore(256, '\\n');             // 扔掉坏 token，否则会卡在同一字符上
    }
    std::cout << "total=" << total << " line=" << line << '\\n';
    return 0;
}`,
      pit: "`cin >> x` 之后不检查就继续用 x：输入非数字时 x 已经是 0（C++11 起），而 cin 已处于失败状态，后续每一次读取都静默失败，程序「什么都没读到却跑完了」。凡是要用这个值，就写成 `if (!(std::cin >> x))` 再往下走。",
      pit_en: "Using x without checking after 'cin >> x': on non-numeric input x is already 0 (since C++11) and cin is failed, so every later read fails silently and the program finishes having read nothing. Whenever the value will be used, write if (!(std::cin >> x)) first.",
      ex: {
        q: "`cin >> n` 紧接着 `getline(cin, s)`，为什么 s 是空的？该怎么办？",
        a: "因为 `>>` 在换行处停下却没有消耗它，getline 立刻把这个残留换行当成一整行读完；中间补一句 `cin.ignore(..., '\\n')` 丢掉残行即可。",
        q_en: "Why is s empty when getline(cin, s) follows 'cin >> n', and what is the fix?",
        a_en: "Because >> stops at the newline without consuming it, so getline sees that leftover newline as the entire line; insert cin.ignore(..., '\\n') to discard the remainder first."
      }
    },

    "3-6": {
      min: 12,
      summary: [
        "`<iomanip>` 里的东西不是函数而是**操纵符**：它们通过 `<<` 改变「流的状态」。理解「它改的是流，不是这一次输出」，是用对一切格式化开关的前提。",
        "`setprecision(n)` 有两副面孔：默认格式下 n 是**有效数字位数**，`fixed` 之下 n 是**小数点后位数**。所以 `cout << setprecision(2) << 3.14159` 输出 3.1，只有先加 `fixed` 才得到 3.14——「小数点后两位」的正确配方是 `fixed` 与 `setprecision(2)` 成对出现。",
        "`fixed`、`setprecision`、`setfill`、`scientific` 全都是**粘性的**：设一次，之后每一次输出都沿用。这正是「我只想格式化其中一个数，结果整张表全变了」的答案；要退回默认格式用 `std::defaultfloat`。",
        "唯一的例外是 `setw(n)`：宽度**只对紧接着的那一个输出项生效**，用完即失效。所以打表格时每一格都要重新写一次 `setw`。",
        "`setw` 不截断：内容超过 n 个字符时照常全部输出（小数不会被挤掉），它保证的是「至少 n 宽」。默认右对齐，配 `std::left` 变左对齐；`std::setw(6) << \"\"` 这种写法可以只设宽度而不输出内容。",
        "补零用 `setfill('0')`：`cout << setfill('0') << setw(5) << 42` 得到 `00042`，日期、流水号补零就是这么来的；但 fill 同样是粘性的，用完记得 `setfill(' ')` 换回空格。",
        "输出的十进制转换走「就近舍入」，而二进制里存的往往不是你以为的数：`2.675` 打两位小数可能得 `2.67`，因为它实际上是 2.67499999…。这是浮点表示问题（2-2 讲过），不是格式化 bug。",
        "什么时候会出错：算钱时用 `double` 记账、再用 `setprecision` 修饰——误差会一路带进报表。正确姿势是内部一律用整数「分」，只在最后一步除以 100.0 再格式化输出。"
      ],
      summary_en: [
        "The items in <iomanip> are not function calls but manipulators: they are pushed through << and change the *state of the stream*. Once you accept that they alter the stream rather than one output, every formatting switch makes sense.",
        "setprecision(n) has two faces: in the default format n counts significant digits, under fixed it counts digits after the point. So 'cout << setprecision(2) << 3.14159' prints 3.1 and only 'fixed << setprecision(2)' prints 3.14 — the two always travel as a pair.",
        "fixed, setprecision, setfill and scientific are all sticky: set once and every later output inherits them. That is the whole answer to 'I formatted one number and the entire table changed'; escape back with std::defaultfloat.",
        "setw(n) is the lone exception: the width applies only to the very next item and then expires, so each cell of a table needs its own setw.",
        "setw never truncates: longer content is printed in full (your decimals are not squeezed out) — it guarantees 'at least n wide'. Output is right-aligned by default, std::left switches that, and 'setw(6) << empty string' sets a width while printing nothing.",
        "Zero padding is setfill with the character '0': 'cout << setfill + setw(5) << 42' gives 00042, which is how dates and serial numbers get their leading zeros — but fill is sticky too, so reset it to a space when you are done.",
        "The decimal conversion used for output rounds to nearest, and what is stored in binary often is not what you typed: 2.675 can print as 2.67 because it really is 2.67499999... That is the representation issue from 2-2, not a formatting bug.",
        "Where it goes wrong: bookkeeping money in a double and then dressing it up with setprecision carries the error straight into the report. Keep money as integer cents internally and divide by 100.0 only at the final print."
      ],
      code: `#include <iostream>
#include <iomanip>
int main() {
    double v = 3.14159;
    std::cout << std::setprecision(2) << v << '\\n';               // 3.1：默认格式里 2 是有效数字
    std::cout << std::fixed << std::setprecision(2) << v << '\\n';  // 3.14：fixed 之后才是小数位数
    std::cout << 2.71828 << '\\n';                                 // 2.72：fixed 与精度会一直留着
    std::cout << std::defaultfloat << std::setprecision(6) << v << '\\n';  // 恢复默认格式与精度
    std::cout << std::setw(6) << 42 << std::setw(6) << 7 << '\\n';  // 宽度只管一格，所以要写两次
    std::cout << std::setw(3) << 123456 << '\\n';                   // 内容超宽也不会被截断
    std::cout << std::setfill('0') << std::setw(5) << 42 << '\\n';   // 00042：填充字符同样是粘性的
    std::cout << std::setfill(' ') << '\\n';                        // 用完记得把填充换回空格
    int cents = 12345;                                             // 钱在内部一律按整数「分」存
    std::cout << std::fixed << std::setprecision(2) << cents / 100.0 << '\\n';  // 123.45：最后一步才换算
    return 0;
}`,
      pit: "以为 `setw` 和其他开关一样是粘性的：只在一行开头写一次 `setw(8)`，结果只有第一列被对齐。反过来以为 `setprecision` 只作用一次，于是后面所有输出都被悄悄裁成两位小数。规矩背成一句：**只有 setw 会失效，其余全都粘**。",
      pit_en: "Assuming setw is sticky like the others: you write setw(8) once at the start and only the first column lines up. Or the reverse — assuming setprecision applies once, so every later output quietly arrives trimmed to two decimals. One sentence covers it: only setw expires, everything else sticks.",
      ex: {
        q: "为什么 `cout << setprecision(2) << 3.14159` 出来的不是 3.14？",
        a: "因为没有 `fixed` 时，2 被解释为「总共两位有效数字」，于是得到 3.1；要「小数点后两位」必须写 `std::fixed << std::setprecision(2)`。",
        q_en: "Why doesn't 'cout << setprecision(2) << 3.14159' print 3.14?",
        a_en: "Without fixed, 2 counts total significant digits, so you get 3.1; two digits after the point require std::fixed << std::setprecision(2)."
      }
    },

    "3-7": {
      title: "综合重构：一个问不倒的交互计算程序",
      title_en: "Synthesis: An Interactive Calculator That Cannot Be Blindsided",
      min: 15,
      target: "能独立写出「读入 → 校验 → 计算 → 格式化 → 输出」五步齐全的交互程序，并在动笔前预判每一步的出错方式。",
      target_en: "Write an interactive program covering read, validate, compute, format and print, predicting in advance how each step can fail.",
      summary: [
        "s3 的全部内容就是四步：读（cin / getline）→ 验（流状态与取值范围）→ 算（类型、优先级、符号）→ 说（iomanip 定格式）。任何一个「小项目」都只是把这四步放大一遍。",
        "动笔前先答三个类型问题：这两个操作数相除我要整数还是小数？取余会不会碰到负数（会就把判据写成 `!= 0`）？累加或相乘会不会越过 int 的 21 亿（会就换 long long）？",
        "输入校验清单：`if (!(cin >> x))` 判失败；失败后 `cin.clear()` 加 `cin.ignore(...)` 恢复；然后**还得自己判区间**——除数不为 0、数量非负、百分比落在 0~100 之间，编译器永远不会替你判这些。",
        "混读规则压缩成一句：数字用 `>>`、整行用 getline、两者之间必须 ignore。把它封成一个 `skipRestOfLine()` 小工具，全项目只写一次。",
        "格式化清单：`fixed` 与 `setprecision` 成对出现；表格每格重设 `setw`；`setfill` 用完换回空格；金额内部用整数「分」，最后一步才除以 100.0。",
        "复盘本章最贵的五个 bug：整数除法让占比恒为 0、`== 1` 判奇偶漏掉负数、条件里 `=` 写错、短路右侧的副作用没执行、cin 失败后不清标志导致后续读取全部静默失败。",
        "自查手段只有一个：把中间结果一行行 `cout` 出来（`<< \"pct=\" << pct`）。这比盯着代码看有效得多，也是 sdbg 调试章要正式化的习惯。",
        "衔接：s4 会给这套计算加上「判断与重复」，两章合起来就够写出第一个真正有用的小程序——乘法表、单位换算器、成绩分档器。"
      ],
      summary_en: [
        "All of s3 is four steps: read (cin / getline), validate (stream state and value range), compute (types, precedence, signs), present (iomanip). Any small project is just these four steps blown up.",
        "Before typing, answer three type questions: do I want an integer or a fraction from this division? Can the remainder see a negative (then test with != 0)? Could the sum or product pass int's 2.1 billion (then take long long)?",
        "Input checklist: test with if (!(cin >> x)); recover with cin.clear() plus cin.ignore(...); then check the range yourself — divisor non-zero, count non-negative, percentage inside 0..100. The compiler will never do those checks for you.",
        "The mixing rule collapses to one sentence: numbers with >>, whole lines with getline, an ignore in between. Wrap it once as skipRestOfLine() and never think about it again.",
        "Formatting checklist: fixed and setprecision always in pairs, a fresh setw per table cell, setfill back to a space when done, and money kept as integer cents until the final divide by 100.0.",
        "The five costliest bugs of this chapter: integer division collapsing a percentage to 0, testing oddness with == 1 and losing the negatives, = where == belonged, a side effect on the right of && never running, and forgetting to clear cin so every later read fails silently.",
        "One self-check technique: print the intermediate values line by line (<< \"pct=\" << pct). It beats staring at the code, and the sdbg debugging chapter will formalise it.",
        "Bridge: s4 adds decisions and repetition to this arithmetic; together they suffice for your first genuinely useful programs — a times table, a unit converter, a grade classifier."
      ],
      code: `#include <iostream>
#include <iomanip>
#include <limits>
#include <string>
int main() {
    int parts = 0, total = 0;
    std::cout << "parts and total: ";
    if (!(std::cin >> parts >> total)) {              // 读失败就立刻收场，不要继续算
        std::cout << "bad input\\n";
        return 1;
    }
    if (total <= 0) {                                 // 区间要自己判：除数为 0 会毁掉结果
        std::cout << "total must be positive\\n";
        return 1;
    }
    double pct = 100.0 * parts / total;               // 先乘 100.0 再除：避开整数除法
    long long big = 1LL;
    for (int i = 0; i < 40; ++i) big *= 2;            // 2 的 40 次方：必须用 long long
    std::cout << std::fixed << std::setprecision(2) << pct << "% share\\n";
    std::cout << "2^40 = " << big << '\\n';
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\\n');  // 清掉残行再读整行
    std::cout << "note: ";
    std::string note;
    std::getline(std::cin, note);                     // 带空格的整行只能交给 getline
    std::cout << "note = [" << note << "]\\n";
    return 0;
}`,
      pit: "写完只测「正常输入」这一种情况：真实世界里会有人敲字母、敲负数、直接按回车。交互程序的 bug 九成出在边界输入上，所以每写完一次 `cin`，就顺手输一遍 `abc`、一遍 `-1`、一遍空回车，看它是否还能体面地回答。",
      pit_en: "Testing only the happy path: real users type letters, negatives and bare Enters. Nine out of ten bugs in an interactive program live in those edges, so after every cin, try abc, try -1, try an empty line, and see whether the program still answers politely.",
      ex: {
        q: "这一章的四步里，哪一步最常被初学者整步跳过？",
        a: "「验」——大家都会读和算，却极少检查流是否失败、取值是否落在合法区间，于是程序在正常输入下完美，在一次误操作后彻底失控。",
        q_en: "Which of the four steps do beginners skip most often?",
        a_en: "Validation. Everyone reads and computes, but almost nobody checks the stream state or the value range, so the program is flawless on happy input and helpless after one typo."
      }
    },

    /* ===================== s4 控制流 ===================== */
    "4-1": {
      min: 12,
      summary: [
        "条件位置要的是一个 bool，或能转成 bool 的值：0 为假、非 0 为真。于是一个反直觉的事实出现：字符 `'0'` 的 ASCII 是 48，所以 `if ('0')` 为真——「带引号的零」不是假。",
        "花括号不是装饰：`if (x > 0) a = 1; b = 2;` 里的 `b = 2` 与条件毫无关系，永远执行。哪怕只有一行也写 `{}`，这是唯一便宜的防身术，挡的是「日后有人加一行，逻辑就悄悄变了」。",
        "`if (x > 0);` 多出的分号让条件挂在一条**空语句**上，紧跟的花括号块变成无条件执行的独立块——它完全能编译通过，只有把警告开满才会提醒你。",
        "else 的归属规则是「就近匹配最近一个还没配对的 if」：`if (a) if (b) x(); else y();` 里的 else 属于 b。想让它属于 a 就必须写花括号，别指望缩进——缩进是给人看的，括号是给编译器看的。",
        "`if (x = 3)` 恒真并且顺带改掉了 x（赋值表达式的值就是被赋的那个值），`if (x == 3)` 才是判断。C++ 允许在条件里赋值，所以只能靠「常量写在左边」和警告全开来兜底。",
        "浮点条件本身没问题：`if (v > 0.5)` 完全可靠；出事全在**判相等**，`if (0.1 + 0.2 == 0.3)` 为假。要判「约等于」就写 `if (std::fabs(a - b) < 1e-9)`。",
        "范围判断不能写 `if (0 < x < 10)`（3-2 已证它恒真），也不能忘了「else 只补一个方向」：分支一超过两条，就该转成 4-2 的级联。",
        "衔接：一个 if 只能把世界切成两半，实际问题常常有三档以上——4-2 讲怎么把它们排成一串而且不排错。"
      ],
      summary_en: [
        "The condition slot wants a bool or something convertible to one: 0 is false, anything else true. Hence the counter-intuitive fact that char '0' is ASCII 48, so if ('0') is true — a zero inside quotes is not falsy.",
        "Braces are not decoration: in 'if (x > 0) a = 1; b = 2;' the b = 2 has nothing to do with the condition and always runs. Write the braces even for one statement; it is the cheapest possible insurance against 'someone added a line later and the logic silently changed'.",
        "The extra semicolon in 'if (x > 0);' hangs the condition on an empty statement, and the block that follows becomes an unconditional block of its own. It compiles cleanly; only fully enabled warnings tell you.",
        "else binds to the nearest still-unmatched if: in 'if (a) if (b) x(); else y();' the else belongs to b. Braces are the only way to attach it to a — indentation is for humans, braces are for the compiler.",
        "'if (x = 3)' is always true and wipes x in the process, because the value of an assignment is the value assigned; 'if (x == 3)' is the test. C++ permits assignment in a condition, so your backstops are constant-on-the-left and all warnings on.",
        "Floating-point conditions are fine per se: 'if (v > 0.5)' is trustworthy. Equality is what breaks — 'if (0.1 + 0.2 == 0.3)' is false — so approximate equality becomes if (std::fabs(a - b) < 1e-9).",
        "Never write 'if (0 < x < 10)' (3-2 proved it is almost always true), and remember that an else covers only one side: past two branches you need the cascade from 4-2.",
        "Bridge: one if cuts the world in two, but real problems have more than two tiers, which is what 4-2 orders for you."
      ],
      code: `#include <iostream>
#include <cmath>
int main() {
    int score = 72;
    double v = 0.1 + 0.2;
    if (score >= 60) {                          // 永远写花括号，哪怕只有一行
        std::cout << "pass\\n";
    } else {
        std::cout << "fail\\n";
    }
    if (v == 0.3) std::cout << "exact\\n";      // 进不来：浮点不该判相等
    if (std::fabs(v - 0.3) < 1e-9) std::cout << "close enough\\n";
    char c = '0';
    if (c) std::cout << "truthy\\n";            // '0' 的 ASCII 是 48，带引号的零不是假
    int x = 0;
    if (x == 0) std::cout << "zero\\n";         // 写成单等号就会把 x 改掉并且恒真
    // 分号让条件空转，紧跟的块永远执行 —— 下面两行演示这个坑：
    if (score > 1000);
    { std::cout << "always\\n"; }
    return 0;
}`,
      pit: "`if` 与条件之间多打一个分号：`if (ok);  { doWork(); }`。屏幕上看起来完全一样，`doWork()` 却变成了无条件执行。写 if 时坚持「条件后面紧接左花括号，中间不允许多余字符」，并把 `-Wall` 打开。",
      pit_en: "A stray semicolon after the condition: 'if (ok); { doWork(); }'. It looks identical on screen, but doWork() now runs unconditionally. Keep the opening brace glued to the condition with nothing in between, and turn on -Wall.",
      ex: {
        q: "`if (a) if (b) f(); else g();` 里的 else 属于哪个 if？为什么？",
        a: "属于内层的 `if (b)`——语言规定 else 就近匹配最近一个尚未配对的 if；缩进只是给人看的，要改变归属必须加花括号。",
        q_en: "Which if does the else belong to in 'if (a) if (b) f(); else g();', and why?",
        a_en: "The inner if (b): the language binds else to the nearest unmatched if. Indentation is cosmetic — changing the binding requires braces."
      }
    },

    "4-2": {
      min: 12,
      summary: [
        "级联 if / else if 的本质是「按顺序试，命中即停」：第一个为真的分支执行完就整条跳出，后面的分支**连判断都不会判断**。所以它不是「好几个 if」，而是「一条 if」。",
        "顺序就是逻辑：分档必须**从严格到宽松**（先 `>=90`，再 `>=80`，最后 `>=60`）。反过来先判 `>=60`，95 分也会在第一档就被抓住，永远评不到 A——而且程序不报错，只是答案不对。",
        "「几个独立的 if」和「if / else if」是两件不同的事：独立 if 每一个都会判（适合互不相干的多个开关），级联里只可能有一个成立（适合分档）。想分档却写成并列，就会看到「后一支把前一支的结果覆盖了」。",
        "条件重叠是隐藏地雷：`if (x > 0) ... else if (x > 5) ...` 的第二支永远进不去（x>5 必然 x>0）。编译器一般不警告，自查办法是把每个条件画到数轴上，看有没有被前面那一支整个盖住。",
        "边界值必须显式决定归哪档：60 分算不算及格、用 `>` 还是 `>=`。需求常常不写，代码必须写；动笔前先把 0、59、60、61、99、100、-1、101 这几个值在脑子里跑一遍。",
        "结尾一定要留一个 `else`，哪怕里面只写「数据非法」或一条注释。没有兜底分支时，漏掉的区间会安静地谁也不执行；有了 else，你才被迫回答「这种情况到底算什么」。",
        "分支一多（超过四档）就该换工具：离散常量值用 4-3 的 switch；「边界 + 等级」成对出现时用表驱动（存一张边界数组循环查），而不是继续叠 else if。",
        "把非法情况先挡掉的写法叫卫语句：`if (score < 0) { ... return; }`，正常流程就能保持零缩进。这是 s5 函数里最常见的形状，从现在起就该养成「先处理异常、再写主流程」的习惯。"
      ],
      summary_en: [
        "A cascade is 'try in order, stop at the first hit': once a branch runs, the whole chain is left and the later conditions are never even evaluated. It is not several ifs; it is one if.",
        "Order *is* logic: sort from strictest to loosest (>=90, then >=80, then >=60). Reverse it and a 95 is captured by the >=60 tier, so an A becomes unreachable — with no error message, just a wrong answer.",
        "Several independent ifs and one if/else-if chain are different animals: each independent if still tests (right for unrelated switches), while a cascade can fire exactly once (right for tiers). Writing tiers as parallel ifs gives you 'the later branch overwrote the earlier one'.",
        "Overlapping conditions are a buried mine: in 'if (x > 0) ... else if (x > 5) ...' the second branch is unreachable, since x>5 implies x>0, and usually nothing warns you. The self-check is to draw every condition on a number line and look for one wholly covered by an earlier one.",
        "Decide each boundary explicitly: does 60 pass, is it > or >=? Specifications omit this, code cannot. Rehearse 0, 59, 60, 61, 99, 100, -1 and 101 before you type.",
        "Always keep a trailing else, even if its body only reports invalid data or holds a comment. Without a catch-all, uncovered ranges silently run nobody; with one you are forced to answer 'what is this case?'",
        "Past about four tiers, change tools: switch for discrete constant values (4-3), a table-driven lookup when boundaries and labels arrive in pairs, instead of yet another else if.",
        "Handling the bad cases first is a guard clause: 'if (score < 0) { ... return; }' keeps the happy path at zero indentation. It is the standard shape inside functions (s5), so start practising 'exceptions first, then the main flow'."
      ],
      code: `#include <iostream>
int main() {
    int score = 95;
    char grade = '?';
    if (score < 0 || score > 100) {             // 卫语句：先把不合法输入挡在门外
        grade = '?';
        std::cout << "invalid score\\n";
    } else if (score >= 90) {                   // 从严格到宽松，顺序绝对不能反
        grade = 'A';
    } else if (score >= 80) {
        grade = 'B';
    } else if (score >= 60) {
        grade = 'C';
    } else {                                    // 兜底 else：缺了这一支就有静默空洞
        grade = 'D';
    }
    std::cout << "grade=" << grade << '\\n';
    int mode = 0;
    if (score > 0) { mode = 1; }                // 反例：三个并列的 if 会全部执行
    if (score > 5) { mode = 2; }                // 后一支覆盖前一支，只剩最后一次
    if (score > 90) { mode = 3; }
    std::cout << "mode=" << mode << '\\n';       // 想要「只命中一档」就得改成 else if
    return 0;
}`,
      pit: "把分档条件写成从宽松到严格：先判 `>=60` 给 C，再判 `>=90` 给 A。后一支永远不会执行，全班都拿 C。这类 bug 不报编译错也不崩，只会安静地给出错误答案，所以每写完一条级联，务必拿一个「最高档」的输入验一次。",
      pit_en: "Ordering tiers loosest-first: test >=60 for a C before >=90 for an A. The later branch is unreachable and everyone gets a C. No compile error, no crash — just a quietly wrong answer, which is why you must feed one top-tier input through every cascade you write.",
      ex: {
        q: "`if (x>0) ... else if (x>5) ...` 的第二支为什么永远进不去？",
        a: "因为 x>5 是 x>0 的子集，任何满足第二支的值都在第一支被截走了；级联要求后面的条件必须在前面条件之外**新增**范围。",
        q_en: "Why is the second branch of 'if (x>0) ... else if (x>5) ...' unreachable?",
        a_en: "Because x>5 is a subset of x>0, so every value that would satisfy it is already captured by the first branch — in a cascade each later condition must add range outside everything before it."
      }
    },

    "4-3": {
      min: 13,
      summary: [
        "switch 只对**整型类**的值有效：`int`、`char`、`bool`、枚举，以及能隐式转成整型的东西。`double` 与 `std::string` 都不行——「浮点判等本身不可靠」正是它被排除的根本原因；字符串要分支就退回 if/else，或者（s6 之后）用映射表。",
        "每个 `case` 标签必须是**编译期常量表达式**：字面量、`constexpr` 变量、枚举值。变量不行、区间不行（`case` 后写范围只是某些编译器的扩展，别放进可移植代码），而且同一层里不能重复。",
        "忘写 `break` 就会「贯穿」：匹配成功之后一直执行到下一个 break 或 switch 结尾。这在 C++ 里**合法而且默认几乎不报错**，所以刻意要贯穿时必须写 `[[fallthrough]];`（C++17 属性）——它同时让 `-Wimplicit-fallthrough` 闭嘴，也让评审明白你是故意的。",
        "贯穿也可以是设计：多个标签共享同一段逻辑（把几个空的 `case` 标签挨着排，最后一支才写语句）。安全写法就是让空标签**紧挨着**，中间不夹任何语句。",
        "case 里要声明变量就给它自己的一对花括号：`case 1: int n = 1;` 后面还有别的 case 时会报「跳转绕过了初始化」，因为所有 case 共享同一个作用域，跳到 case 2 时 n 已经「存在但从未初始化」。",
        "`default` 永远写上并放最后：它负责收非法输入；而且当 switch 的对象是枚举时，编译器能靠 `-Wswitch` 检查「是不是每个枚举值都有对应分支」，这是 switch 相对 if 链的独特优势。",
        "switch 与 if-else 的取舍很清楚：离散常量值、分支多、要枚举完备性检查 → switch（可读，也常被编译成跳表）；连续区间、浮点、复杂表达式 → if。同一个需求「既像区间又像离散」时，选 if 更不容易错。",
        "C++17 允许在 switch 的初始化语句里声明变量：`switch (int m = x % 7) { ... }`，把 m 的作用域压到这一处。另外别把 break 用错地方——在循环里套 switch 时，switch 内的 break 只离开 switch，4-7 详谈。"
      ],
      summary_en: [
        "switch works only on integer-like values: int, char, bool, enums and anything implicitly convertible to those. double and std::string are excluded — floating-point equality being unreliable is precisely why. For strings fall back to if/else or (after s6) a lookup table.",
        "Every case label must be a constant expression known at compile time: a literal, a constexpr variable, an enumerator. Variables are out, ranges are out (a range after case is a compiler extension, never portable code), and no label may appear twice at the same level.",
        "A missing break causes fallthrough: after a match, execution runs on until the next break or the end of the switch. This is legal and mostly silent, so when you *mean* it, write [[fallthrough]]; (a C++17 attribute) — it silences -Wimplicit-fallthrough and tells reviewers this was deliberate.",
        "Fallthrough can also be design: several labels sharing one body. The safe shape is to stack the empty case labels directly on top of each other with no statement between them.",
        "Give a case its own braces when it declares a variable: 'case 1: int n = 1;' with more cases below fails with 'jump bypasses initialisation', because all cases share one scope and n would exist-but-uninitialised by the time you reach case 2.",
        "Always write a default, last: it catches invalid input, and when the selector is an enum the compiler can verify coverage with -Wswitch — a check no if-chain gives you.",
        "The trade-off is clean: discrete constant values, many branches, or enum completeness, use switch (readable, often compiled to a jump table); continuous ranges, floats or arbitrary expressions, use if. When a requirement straddles both, if is the safer choice.",
        "C++17 lets you declare inside the switch initialiser — 'switch (int m = x % 7) { ... }' — shrinking m's scope to here. And do not aim break at the wrong target: inside a loop, a break in the switch leaves only the switch, which 4-7 covers in detail."
      ],
      code: `#include <iostream>
int main() {
    char op = '+';
    int a = 7, b = 3, r = 0;
    switch (op) {                               // char 属于整型类，可以当选择条件
        case '+': r = a + b; break;
        case '-': r = a - b; break;
        case '*': r = a * b; break;
        case 'a':                               // 空标签挨着排：与下一支共享逻辑
        case 'e':
        case 'i': std::cout << "vowel\\n"; break;
        default:  std::cout << "unknown op\\n"; break;
    }
    int mode = 2;
    switch (mode) {
        case 1:
            std::cout << "one\\n";
            [[fallthrough]];                    // 有意贯穿要用属性标出来
        case 2:
            std::cout << "two\\n";               // 从 case 1 一路执行到这里
            break;
        case 3: {
            int n = mode * 2;                   // 在 case 里声明变量必须自带花括号
            std::cout << n << '\\n';
            break;
        }
        default:
            std::cout << "nothing\\n";           // 不写 default，非法值就静默穿过去
    }
    // 变量不能当标签，所以下面这一行是编译错误：
    // case a: std::cout << "no";
    std::cout << r << '\\n';
    return 0;
}`,
      pit: "在「循环里套 switch」中想用 `break` 提前结束循环，结果只跳出了 switch，循环照常跑下一轮，程序看起来「关不掉」。要真的离开循环，就用标志变量在 switch 之后判，或者把这段逻辑抽成函数用 `return`；写 `break` 之前先明确「我离开的是哪一个结构」。",
      pit_en: "Reaching for break inside a switch nested in a loop to end the loop: it leaves only the switch, so the loop marches on and the program 'will not stop'. Use a flag tested after the switch, or extract the block into a function and return. Before typing break, decide which construct you are leaving.",
      ex: {
        q: "为什么 switch 不能像 if 那样判断一个字符串或一段区间？",
        a: "因为 switch 是按**整型值直接跳表**选择的，它要求标签是编译期可确定的整数常量；字符串与浮点没有这种一一映射，区间更是多个值的集合，只能交给 if 的表达式判断。",
        q_en: "Why can't switch test a string or a range the way if does?",
        a_en: "switch dispatches on an integer value through a jump table, so labels must be integer constants known at compile time; strings and floats offer no such mapping and a range is a set of values — that is what if expressions are for."
      }
    },

    "4-4": {
      min: 11,
      summary: [
        "`条件 ? A : B` 是**表达式**：它有类型、有值，可以出现在赋值右边、函数实参里、`<<` 链里；而 if 是**语句**，没有值。这是两者的根本分工，不是「谁更简洁」。",
        "结果类型由 A 与 B 共同决定：`flag ? 1 : 2.5` 的类型是 double（1 被提升成 1.0），`flag ? 1 : 0` 是 int。混型分支会带来「你以为拿到 int，其实一直是 double」的隐性结果。",
        "三元同样**只求值一边**：`p != nullptr ? p->v : 0` 是安全的。但也因此别把必须执行的副作用塞进分支，否则又回到 3-2 那个「条件一变它就少跑一次」的陷阱。",
        "它的优先级低得会咬人：`cout << flag ? \"a\" : \"b\"` 被解析成 `(cout << flag) ? \"a\" : \"b\"`，屏幕上出现的是 1 而不是 a；放进流里**必须**再套一层括号。同理 `x ? a : b = 5` 里的 `= 5` 只作用在 b 上。",
        "嵌套不要超过两层：`a ? b ? x : y : z` 要求读者现场在脑子里建一棵树。到第二层就把括号写全（`a ? (b ? x : y) : z`），再多就换 if/else，或者抽一个返回字符串的小函数。",
        "两个分支应该只是「取值」，不该是「做事」。`ok ? load() : (err = true)` 省了两行，赔掉的是可读性——需要执行语句、需要提前 return、需要多条操作时，老老实实写 if。",
        "适合三元的场景能一句话说完：二选一取值。绝对值、两数较大者、单位串、单复数、初始档位——这就是它全部的正当用途。",
        "顺手一条经验：`T x = cond ? a : b;` 让 x 从一开始就是初始化好的（呼应 2-1 的「声明即初始化」），而 `T x; if (...) x = a; else x = b;` 中间存在一个未赋值窗口。这一点比「少两行」更值钱。"
      ],
      summary_en: [
        "cond ? A : B is an *expression*: it has a type and a value, so it fits on the right of an assignment, in an argument list, inside a << chain. if is a *statement* and has no value. That division of labour, not brevity, is the real difference.",
        "The result type comes from A and B together: 'flag ? 1 : 2.5' is a double (the 1 is promoted), 'flag ? 1 : 0' is an int. Mixed branches quietly hand back a double where you thought you were holding an int.",
        "Only one branch is evaluated, so 'p != nullptr ? p->v : 0' is safe — and for the same reason never park a must-run side effect in a branch, or you are back in 3-2's 'it stopped running when the condition changed'.",
        "Its loose precedence bites: 'cout << flag ? yes : no' parses as (cout << flag) ? yes : no, so you see 1 on screen instead of the word — inside a stream you must add another pair of parentheses. Likewise in 'x ? a : b = 5' the assignment only touches b.",
        "Do not nest past two levels: a ? b ? x : y : z makes the reader build a tree on the spot. At level two write the parentheses out; beyond that use if/else or a small function returning a string.",
        "Both branches should *produce a value*, not *do work*. 'ok ? load() : (err = true)' saves two lines and spends readability. Statements, early returns, or several actions belong in an if.",
        "The legitimate use is a one-sentence selection: absolute value, larger of two, unit string, singular versus plural, initial tier. That is the whole job description.",
        "One more: 'T x = cond ? a : b;' means x is initialised from the start (rule 2-1: initialise at declaration), whereas 'T x; if (...) x = a; else x = b;' leaves a window where x holds nothing sensible. That is worth more than saving two lines."
      ],
      code: `#include <iostream>
int main() {
    int score = 72;
    bool flag = true;
    const char* verdict = score >= 60 ? "pass" : "fail";   // 三元直接交出一个值
    int absLike = score < 0 ? -score : score;              // 同样的逻辑用 if 要多写三行
    std::cout << (flag ? "yes" : "no") << '\\n';            // 放进输出流必须再加一层括号
    double mixed = flag ? 1 : 2.5;                        // 分支类型不同：统一提升成 double
    int a = 1, b = 2;
    flag ? a : b = 5;                                     // 解析成 flag ? a : (b = 5)，b 没变
    int tier = score >= 90 ? 4 : (score >= 60 ? 2 : 0);   // 嵌套到第二层就到顶了
    std::cout << verdict << absLike << mixed << a << b << tier << '\\n';
    return 0;
}`,
      pit: "为了「看起来精简」把两条带副作用的语句压进一个三元：`ok ? (n += x) : (errors++);`。它合法，但同时有副作用和短路，出 bug 时几乎不可能从这一行读出原意。三元的两个分支只放值，不放动作。",
      pit_en: "Crushing two side-effecting statements into one ternary to look terse: 'ok ? (n += x) : (errors++);'. It is legal, but it mixes mutation with short-circuit evaluation, and when it misbehaves nobody can read the intent out of that line. Keep values in a ternary and actions in an if.",
      ex: {
        q: "`cond ? f() : g()` 与 `if (cond) f(); else g();` 除了长短，还有什么实质区别？",
        a: "三元是一个可以参与初始化的**值**，能写成 `int r = cond ? f() : g();`；if 是语句，想把返回值存下来就必须先声明、再在两个分支里分别赋值，中间多出一个未初始化窗口。",
        q_en: "Beyond length, what really differs between 'cond ? f() : g()' and 'if (cond) f(); else g();'?",
        a_en: "The ternary is a value usable in initialisation, so you can write int r = cond ? f() : g(); an if is a statement, so storing the result needs a declaration plus two separate assignments, leaving an uninitialised window."
      }
    },

    "4-5": {
      min: 14,
      summary: [
        "`for (初始化; 条件; 步进)` 的三段时间分别是「进循环前执行一次 / 每轮开头判定 / 每轮结尾执行」。尤其注意**步进在循环体之后**——所以循环体最后一行写 `continue` 时，步进仍然会跑（4-7 会拿这一点和 while 对比）。",
        "条件是**每轮开头**才判的，因此 `for (int i = 0; i < n; ++i)` 在 n 为 0 时一次都不执行；这里写 `i++` 和 `++i` 等价（交出去的旧值没人用），但统一写 `++i` 可以少想一件事。",
        "差一错误（off-by-one）的通解是半开区间思维：把 `i < n` 读成区间 [0, n)，元素个数 = 末 − 初 = n，于是「有几个元素」永远算得出来。要 1..100 求和就老实写 `i = 1; i <= 100`，或者 `i = 0; i < 100` 再加偏移——两种风格**绝不能混在同一行里**。",
        "三段都可以留空，也可以各写多条：`for (;;)` 是恒真循环（必须靠 break 出去）；`for (int i = 0, j = n - 1; i < j; ++i, --j)` 是双指针；步进写 `i += 2` 也行，前提是你确认它一定会跨过边界而不是跳过去。",
        "在 for 里声明的循环变量只属于这个循环（2-5 的作用域），循环结束后不能再用。如果结束时的 i 本身有意义（「跑到第几项时超预算」），就把 i 提到外面声明，或者在循环里记 `last = i`。",
        "有符号与无符号混比是最阴的一条：`for (int i = 0; i < v.size(); ++i)` 在 `-Wall` 下报 signed/unsigned 比较；`for (unsigned i = n; i >= 0; --i)` 恒真——无符号永远不会小于 0，于是 i 一路减到回绕成一个巨大值再越界访问。倒着遍历请写 `for (int i = n - 1; i >= 0; --i)`。",
        "只要目的就是「把每个元素看一遍」，就该用 C++11 的 range-for：`for (int x : v)`（小对象拷贝）、`for (const auto& s : strs)`（大对象避免拷贝）、`for (auto& s : strs)`（要改原元素）。它从结构上消灭了差一错误，也顺手消灭了下标越界。",
        "两条自检：① 循环边界与循环内的乘法都要估溢出——`i * i` 在 i 到 5 万时就已经爆了 int；② 循环体如果不能一句话说清它在干什么（累加、查找、打印），说明该抽函数了（s5），三层以上的嵌套基本是设计问题而不是写法问题。"
      ],
      summary_en: [
        "The three parts of 'for (init; condition; step)' run once before the loop, at the start of each round, and at the end of each round. That last point matters: the step runs *after* the body, so a continue on the body's last line still triggers it — 4-7 contrasts this with while.",
        "The condition is tested at the *start* of each round, so 'for (int i = 0; i < n; ++i)' executes zero times when n is 0. Here i++ and ++i are equivalent because nobody uses the yielded value, but writing ++i everywhere saves one decision per loop.",
        "The universal cure for off-by-one is half-open thinking: read i < n as [0, n), where count = end - begin = n, so 'how many' always computes. For a 1..100 sum write i = 1 with i <= 100, or i = 0 with i < 100 plus an offset — never mix the two styles on one line.",
        "Any of the three parts may be empty and each may hold several clauses: 'for (;;)' is an endless loop that needs a break; 'for (int i = 0, j = n - 1; i < j; ++i, --j)' is the two-pointer shape; a step of i += 2 is fine provided you are sure it crosses the boundary rather than hopping over it.",
        "A loop variable declared in the for belongs only to that loop (scope, 2-5) and is gone afterwards. If the final value of i carries meaning ('which item broke the budget'), declare i outside the loop or record last = i inside it.",
        "Signed versus unsigned comparisons are the sneakiest: 'for (int i = 0; i < v.size(); ++i)' warns under -Wall, and 'for (unsigned i = n; i >= 0; --i)' is always true — an unsigned is never below zero, so it wraps to a huge value and then indexes out of bounds. Iterate backwards with for (int i = n - 1; i >= 0; --i).",
        "When the goal is simply 'look at every element', use C++11 range-for: for (int x : v) to copy small elements, for (const auto& s : strs) to avoid copying big ones, for (auto& s : strs) to modify in place. It removes off-by-one and index bugs by construction.",
        "Two checks: estimate overflow for both the bound and any product inside the loop (i * i blows int near 50000), and if the body cannot be described in one sentence (sum, search, print) it wants to be a function (s5) — three levels of nesting is a design smell, not a syntax problem."
      ],
      code: `#include <iostream>
int main() {
    long long sum = 0;
    for (int i = 1; i <= 100; ++i) { sum += i; }        // 1..100：闭区间就老实写两个等号
    int arr[5] = {3, 1, 4, 1, 5};
    int n = 5;
    for (int i = 0; i < n; ++i) { sum += arr[i]; }      // 半开区间：个数正好是 n
    for (int i = 0, j = n - 1; i < j; ++i, --j) {       // 双指针：初始化与步进各写两条
        int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    for (int x : arr) { sum += x; }                     // range-for：没有下标就没有差一
    for (;;) { break; }                                 // 空条件恒真，只能靠 break 出去
    // 下面两行一个是差一、一个是无符号恒真，都别写：
    // for (int i = 0; i <= n; ++i) sum += arr[i];
    // for (unsigned i = n; i >= 0; --i) sum += i;
    std::cout << sum << '\\n';
    return 0;
}`,
      pit: "把循环边界写成 `i <= n`（n 是元素个数）：最后一轮访问 `arr[n]`，越界一个元素。越界是未定义行为，它未必立刻崩，常常先表现为「求和结果多了个奇怪的数」，或者换个编译器、加一个 `-O2` 之后行为全变。写完每个循环都问一遍：这个 i 的最大取值是多少？那个下标合法吗？",
      pit_en: "Writing the bound as i <= n where n is the count: the last round touches arr[n], one past the end. Out-of-bounds is undefined behaviour, so it often does not crash — it shows up as a sum with a strange extra number, or changes completely with another compiler or -O2. After every loop ask: what is the largest i, and is that index legal?",
      ex: {
        q: "`for (int i = 0; i < n; ++i)` 与 `for (int i = 1; i <= n; ++i)` 都跑 n 轮，为什么建议全项目统一成前者？",
        a: "因为前者是半开区间 [0, n)，「个数 = 末 − 初」永远成立，能直接和数组长度、容器 size() 对齐；后者要额外记住「起点是 1」，两种风格一混就必然出现差一。",
        q_en: "Both 'for (int i = 0; i < n; ++i)' and 'for (int i = 1; i <= n; ++i)' run n rounds, so standardise on the first — why?",
        a_en: "The first is the half-open interval [0, n), where count = end - begin always holds and lines up with array lengths and size(); the second needs you to remember that it starts at 1, and mixing the two styles guarantees an off-by-one."
      }
    },

    "4-6": {
      min: 12,
      summary: [
        "while 先判后做，所以**可能一次都不执行**；do-while 先做一次再判，所以**至少执行一次**。选哪个只取决于一个问题：「这个循环执行零次有没有意义？」",
        "典型分工很清楚：菜单、重试、「先让用户算一次，再问要不要继续」用 do-while；读到文件尾、迭代到收敛、按条件推进的模拟用 while。别用 while 硬凑「至少一次」——那要在循环外先把同一段代码复制一遍，而那正是重复代码的源头。",
        "do-while 结尾的分号是语法的一部分：`do { ... } while (again);` 少了它就是一行莫名其妙的报错，很多人第一反应去改条件，其实缺的是那个分号。",
        "while 的命根子是「每轮都朝终止条件动一步」。进入前问一次、每轮结尾再问一次：条件里的变量这轮变了吗？变的方向对吗？答不出来就是死循环。",
        "忘记更新常常穿着伪装：更新语句被塞在 `if` 的某一支里（那一支没走到就永远不退出）、或者改的是副本（`Node* cur = p; cur = cur->next;` 里 p 从来没动过）、或者被 `continue` 跳过了（4-7 的重点）。",
        "`while (std::cin >> x)` 是最地道的「读到读不动为止」：读成功时条件为真，遇到坏字符或 EOF 条件为假自然退出——不需要哨兵值，也不需要提前知道有几个数。",
        "条件里带赋值合法但危险：`while (p = next(p))` 靠「赋值的结果」当条件，写法正确却难读；`while (p == next(p))` 才是判断。想分清就分两步：先单独一句赋值，再判条件。",
        "递减当计数要单独想一遍：`while (n--)` 用的是旧值，n 为 0 时表达式值是 0（假），循环不进，但 n 已经变成 -1；这类「条件里带副作用」的写法能不用就不用，改成 `while (n > 0) { --n; ... }`。死循环也不总是 bug（事件循环就是故意的），判据是「有没有一条明确的路径让条件变假」。"
      ],
      summary_en: [
        "while tests first, so it may run zero times; do-while acts first, so it runs at least once. The choice answers exactly one question: does 'zero rounds' make sense for this loop?",
        "The division of labour is clear: menus, retries and 'do it once, then ask whether to continue' are do-while; reading to end of file, iterating to convergence and condition-driven simulation are while. Do not force a while to guarantee one round by duplicating the body before the loop — that duplication is the bug source.",
        "The semicolon at the end of do-while is part of the grammar: without it in 'do { ... } while (again);' you get a baffling error, and most people go editing the condition when what is missing is a ;.",
        "A while loop lives or dies on 'does something move toward the exit each round?' Ask once before entering and again at the bottom of every round: did the variable in the condition change, and in the right direction? No answer means an infinite loop.",
        "The missing update usually wears a disguise: it sits inside one arm of an if (that arm never runs), it modifies a copy ('Node* cur = p; cur = cur->next;' never moves p), or a continue skips it — which is 4-7's main event.",
        "'while (std::cin >> x)' is the idiomatic 'read until it stops working': the condition is true on a successful read and false on a bad character or EOF, so no sentinel value and no prior count are needed.",
        "Assignment in the condition is legal but risky: 'while (p = next(p))' leans on the value of the assignment — correct yet hard to read — whereas 'while (p == next(p))' is a comparison. When in doubt split it: assign in its own statement, then test.",
        "A decrement as a counter deserves its own thought: 'while (n--)' yields the old value, so at n == 0 the expression is 0 (false) and the body never runs, yet n has already become -1. Prefer 'while (n > 0) { --n; ... }'. And an endless loop is not always a bug (event loops are deliberate) — the test is whether some clear path makes the condition false."
      ],
      code: `#include <iostream>
int main() {
    int i = 0;
    while (i < 3) { std::cout << i << ' '; ++i; }        // 删掉自增就是死循环：条件永远不变假
    int sum = 0, x = 0;
    std::cout << "numbers, non-number to stop: ";
    while (std::cin >> x) { sum += x; }                  // 读到坏字符或 EOF 自然停，不需要哨兵
    bool again = false;
    int rounds = 0;
    do {
        ++rounds;                                        // 至少执行一次：菜单与重试的标准形状
        again = false;
    } while (again);                                     // 结尾的分号不能省
    int budget = 100, used = 0, days = 0;
    while (used < budget) {                              // 每轮都朝边界动一步，才会停
        used += 7;
        ++days;
    }
    int n = 3;
    while (n--) { std::cout << n << ' '; }               // 条件用的是旧值：打印 2 1 0
    std::cout << "sum=" << sum << " rounds=" << rounds << " days=" << days << '\\n';
    return 0;
}`,
      pit: "把「更新循环变量」写在 `continue` 后面：`while (i < n) { if (skip(i)) continue; ++i; }`——`skip(i)` 一旦为真，`++i` 就永远不会执行，程序当场卡死。while 里要用 continue，就必须把自增提到它前面，或者干脆改用 for。",
      pit_en: "Placing the loop-variable update after a continue: in 'while (i < n) { if (skip(i)) continue; ++i; }' the moment skip(i) is true ++i never runs and the program hangs. In a while, either increment before the continue or just use a for.",
      ex: {
        q: "什么情况下必须用 do-while？改用 while 要多付出什么代价？",
        a: "当「至少执行一次」本身就是需求时（先做一次再问是否继续）；用 while 就得把同一段代码在循环外复制一遍当预热，两处逻辑从此要同步维护，这正是 bug 的温床。",
        q_en: "When is do-while required, and what does substituting a while cost?",
        a_en: "When 'at least one round' is itself the requirement (do it, then ask whether to continue). A while forces you to duplicate the body once before the loop as a warm-up, and those two copies must then be maintained in lockstep — a ready-made bug."
      }
    },

    "4-7": {
      min: 11,
      summary: [
        "`break` 结束**离它最近的那一层**循环或 switch，然后从该结构之后接着执行——它一次只能跳一层，不会帮你从三层嵌套里脱身。",
        "在「循环里套 switch」时，switch 里的 `break` 只离开 switch，循环照常跑下一轮。要真的结束循环有三条路：设一个标志变量在 switch 之后判、把循环条件本身改成「还没找到才继续」、或者把这段逻辑抽成函数用 `return`（最推荐，这也是 s5 的入口）。",
        "`continue` 跳过本轮剩余语句，直接进入「下一轮的准备阶段」：在 for 里它**照常执行步进表达式**，在 while 里它**直接跳回条件判断**。同一句 continue 在两种循环里的后果完全不同——这就是「for 里安全、while 里死循环」的全部原因。",
        "所以 while 里写 continue 之前必须自问：条件变量这一轮还会不会变？`while (i < n) { ++i; if (bad(i)) continue; ... }` 是对的；把 `++i` 留在 continue 之后，就是一台死循环制造机。",
        "break 与 continue 都是「提前离开」，每用一次，读者的心理栈就多一层。能用「改写条件」或一个布尔标志解决时，优先不写它们；同一个循环里出现三次以上，说明这个循环该拆成函数。",
        "正当用途主要三类：找到就停（查找、素数判定里的 `if (n % d == 0) { prime = false; break; }`）、跳过不合格的（`if (i % 3 != 0) continue;` 只累加 3 的倍数）、遇到非法输入立刻收摊（`if (x == 0) break;`）。",
        "素数判定是 break 位置最容易搞反的地方：要在**找到因子**时 break 并把标志置为 false；如果写成「没找到因子就 break」，循环第一轮就被掐死，于是所有大于 1 的数都成了素数——程序不报错，答案全错。",
        "和 4-3 呼应：`break` 在 switch 与循环里的语义是同一个——「离开最近这个结构」。每次写 break 前先回答一句「我离开的是哪一个」，这一个动作能挡掉这一节全部的坑。"
      ],
      summary_en: [
        "break ends the *nearest* enclosing loop or switch and execution resumes after that construct — one level only, so it will not pull you out of three nested loops.",
        "Inside a switch nested in a loop, the switch's break leaves only the switch and the loop runs on. There are three real ways out: set a flag and test it after the switch, restate the loop condition as 'keep going while nothing was found', or extract the block into a function and return — the last is best and is where s5 takes over.",
        "continue skips the rest of this round and jumps to the next round's preparation: in a for it *still runs the step expression*, in a while it goes *straight back to the condition*. The same statement behaves completely differently in the two loops, which is exactly why it is safe in one and an infinite loop in the other.",
        "So before using continue in a while, ask: will the condition variable still change this round? 'while (i < n) { ++i; if (bad(i)) continue; ... }' is correct; leave ++i after the continue and you have built an infinite-loop machine.",
        "Both break and continue are early exits, and each one adds a level to the reader's mental stack. If rewriting the condition or a boolean flag solves it, prefer that; three or more in one loop is a signal that the loop wants to be a function.",
        "Legitimate uses cluster in three: stop when found (search, and 'if (n % d == 0) { prime = false; break; }' in primality testing), skip what fails ('if (i % 3 != 0) continue;' to sum only multiples of three), and bail out on invalid input ('if (x == 0) break;').",
        "Prime testing is where people invert the break: you break when a factor *is* found and clear the flag. Break when a factor is *not* found and the loop dies after one round, so every number above 1 becomes prime — no error, all answers wrong.",
        "Echoing 4-3: break means the same thing in a switch and in a loop — 'leave the nearest such construct'. Answering 'which one am I leaving?' before typing break avoids every trap in this section."
      ],
      code: `#include <iostream>
int main() {
    int sum3 = 0;
    for (int i = 1; i <= 100; ++i) {
        if (i % 3 != 0) continue;               // for 里 continue 之后自增照样执行，安全
        sum3 += i;
    }
    int i = 0;
    while (i < 100) {
        ++i;                                    // 自增必须排在 continue 之前
        if (i % 3 != 0) continue;               // 把自增挪到这一行下面就是死循环
        sum3 += i;
    }
    for (int n = 2; n < 20; ++n) {
        bool prime = true;
        for (int d = 2; d * d <= n; ++d) {
            if (n % d == 0) { prime = false; break; }   // 只在「找到因子」时提前退出
        }
        if (prime) std::cout << n << ' ';
    }
    bool stop = false;
    for (int row = 0; row < 3 && !stop; ++row) {
        switch (row) {
            case 1:
                std::cout << "seen\\n";
                stop = true;                    // 想跳出外层循环：置标志，让条件去收尾
                break;                          // 这里的 break 只离开 switch
        }
    }
    std::cout << sum3 << '\\n';
    return 0;
}`,
      pit: "以为 `break` 能一次跳出多层嵌套：三层 for 里写一个 break，只有最内层结束，中间层与外层照常继续，于是「明明 break 了却还是跑完全部」。要么加一个标志变量并写进每一层的条件，要么把这段嵌套包进函数用 `return`——C++ 没有带标签的 break，这是极少数 goto 还算干净的场景。",
      pit_en: "Believing one break escapes several nesting levels: in three nested loops it ends only the innermost, so the outer rounds continue and you wonder why it 'did not stop'. Use a flag written into every level's condition, or wrap the nesting in a function and return — C++ has no labelled break, which is the rare case where goto is not the worst answer.",
      ex: {
        q: "同样一句 `continue`，为什么在 for 里通常安全、在 while 里却容易造成死循环？",
        a: "因为 for 的步进表达式属于「本轮结尾固定要执行的部分」，continue 之后仍会跑；while 没有任何固定的收尾动作，continue 直接回到条件判断，条件里的变量没被改就永远不会结束。",
        q_en: "Why is the same 'continue' usually safe in a for but dangerous in a while?",
        a_en: "A for's step expression is part of the round's fixed tail and still runs after continue; a while has no built-in tail, so continue jumps straight back to the test, and if nothing changed the controlling variable the condition can never become false."
      }
    },

    "4-8": {
      title: "综合重构：分支与循环的自查清单",
      title_en: "Synthesis: A Checklist for Branches and Loops",
      min: 15,
      target: "能对着清单一次写出没有差一错误与死循环的多档分类程序，并说清每一处 break / continue 到底离开了哪个结构。",
      target_en: "Write a multi-tier classification program free of off-by-one and infinite loops by following the checklist, and say exactly which construct each break or continue leaves.",
      summary: [
        "控制流只有三种零件：顺序、分支（if / else if / switch / 三元）、循环（for / while / do-while）。看别人的复杂代码时，先把它归类到这三件事，再乱的逻辑也会散架。",
        "写分支之前在纸上列一张「输入分类表」：每个可能的取值落在哪一支、有没有两支重叠、有没有值谁也不落。表列完了代码就等于写完了，剩下的只是翻译。",
        "写循环之前先答四个问题：循环变量是谁？初值多少？每轮怎么变？什么时候停？这四个问题只要有一个答不上来，就必然出现差一错误或者死循环，没有第三种结果。",
        "边界用例背下来：0、1、-1、n-1、n、n+1，再加「空」的三种（空数组、n 为 0、一行输入都没有）。手写代码时把这批值跑一遍，比任何静态检查都便宜。",
        "差一的通解是全项目统一使用半开区间 [起, 止)：元素个数 = 止 − 初。这条规矩一旦统一，`<` 与 `<=` 就不再需要每次重新想一遍。",
        "break / continue 决策表：只是「这一轮不合格」→ continue（while 里记得先自增）；「找到或失败就走人」→ break；「要跳出两层以上」→ 抽成函数用 return，别用标志变量再套三层 if。",
        "本章翻车复盘榜：漏花括号让第二句无条件执行、条件里写了 `=`、else 配错 if、case 忘了 break（也忘了 `[[fallthrough]]`）、分档条件顺序反了、`i <= n` 越界、while 里 continue 忘了自增、switch 里的 break 以为能跳出循环。",
        "衔接：s5 会把这些反复出现的代码块提成函数——「抽函数」本身就是这张清单里最厉害的解法；s6 的数组则让循环第一次真正有用武之地。"
      ],
      summary_en: [
        "Control flow has three parts only: sequence, branching (if / else if / switch / ternary) and looping (for / while / do-while). Classify someone else's tangled code into those three and even the messiest logic falls apart into shape.",
        "Before writing branches, draft an input-partition table on paper: which tier catches each possible value, do two tiers overlap, is any value caught by nobody. Once the table is right the code is only a translation.",
        "Before writing a loop, answer four questions: which variable controls it, what is its start, how does it change each round, and when does it stop. If one of the four is missing you get an off-by-one or an infinite loop — there is no third outcome.",
        "Memorise the boundary set: 0, 1, -1, n-1, n, n+1, plus three empties (no elements, n is 0, no input line at all). Running that list by hand beats any static analyser on cost.",
        "The universal answer to off-by-one is the half-open interval [begin, end) everywhere, where count = end - begin. Enforce it project-wide and you never have to re-derive < versus <= again.",
        "A break/continue decision table: 'this round fails' → continue (increment first in a while); 'found it or it failed' → break; 'leave two levels up' → extract a function and return, instead of a flag wrapped in three more ifs.",
        "This chapter's crash leaderboard: a missing brace making the second statement unconditional, = inside a condition, else bound to the wrong if, a case without break (or without [[fallthrough]]), tiers ordered loosest-first, i <= n stepping out of bounds, continue in a while skipping the increment, and a switch break mistaken for leaving the loop.",
        "Bridge: s5 lifts these repeated blocks into functions — extraction is itself the strongest item on this checklist — and arrays in s6 finally give loops something worth looping over."
      ],
      code: `#include <iostream>
int main() {
    int counts[5] = {0, 0, 0, 0, 0};            // 五个档位，先全部归零
    std::cout << "input scores, negative to stop: ";
    while (true) {                              // 恒真条件是有意的事件循环，出口在下面
        int s = 0;
        if (!(std::cin >> s)) break;            // 读不动了就走：非法输入挡在最外层
        if (s < 0) break;                       // 约定一个哨兵值
        if (s > 100) {                          // 越界不入库，用 continue 进下一轮
            std::cout << "skip\\n";
            continue;
        }
        int tier = s >= 90 ? 4 : (s >= 80 ? 3 : (s >= 70 ? 2 : (s >= 60 ? 1 : 0)));
        ++counts[tier];                         // 分档只算一次，别写五条 if 互相覆盖
    }
    for (int t = 0; t < 5; ++t) {               // 半开区间 [0,5)：个数就是 5
        std::cout << "tier " << t << ": " << counts[t] << ' ';
        for (int k = 0; k < counts[t]; ++k) {   // 内层只画条形，两层各自一句话说得清
            std::cout << '*';
        }
        std::cout << '\\n';
    }
    return 0;
}`,
      pit: "在循环条件里同时干三件事：`while (std::cin >> s && s >= 0 && s <= 100)`。看着紧凑，但用户只是输了个 101，循环就直接结束、整个程序收摊——「校验」和「是否继续」被混进了同一个条件。条件只回答「要不要继续」，合法性检查放进循环体用 continue 处理。",
      pit_en: "Making one loop condition do three jobs: 'while (std::cin >> s && s >= 0 && s <= 100)'. It looks compact, but a single value of 101 ends the whole program — validation and continuation have been merged into one test. Let the condition answer only 'keep going?' and handle legality inside the body with continue.",
      ex: {
        q: "s3 与 s4 合起来，为什么就已经够写出「有意义的小程序」？",
        a: "因为 s3 提供数据的进出与计算，s4 提供「分情况」与「重复」，两者相加就是一台图灵机的骨架；后面学的数组、函数、结构体只是让你能管理更大的数据与更长的流程。",
        q_en: "Why are s3 and s4 together already enough for genuinely useful programs?",
        a_en: "s3 supplies input, output and arithmetic while s4 supplies cases and repetition; together they are the skeleton of a Turing machine. Later chapters — arrays, functions, structs — only let you manage bigger data and longer flows."
      }
    }
  },

  /* ---------- 题库：对准深化后新增的知识点 ---------- */
  quizAdd: {
    s3: [
      {
        q: "表达式 `-7 / 2` 与 `-7 % 2` 的结果分别是？",
        o: ["-3 与 -1", "-4 与 1", "-3 与 1", "-4 与 -1"],
        a: 0,
        why: "C++11 起整数除法向零截断，`-7/2` 得 -3；再由恒等式 `(a/b)*b + a%b == a` 反推，余数必须是 -1，也就是符号跟随左操作数。",
        q_en: "What are the values of -7 / 2 and -7 % 2?",
        o_en: ["-3 and -1", "-4 and 1", "-3 and 1", "-4 and -1"],
        why_en: "Since C++11 integer division truncates toward zero, so -7/2 is -3, and the identity (a/b)*b + a%b == a forces the remainder to be -1: its sign follows the left operand."
      },
      {
        q: "下面哪个表达式与 `flags & MASK == 0` 的含义完全相同？",
        o: ["(flags & MASK) == 0", "flags & (MASK == 0)", "(flags & MASK) != 0", "flags == (MASK & 0)"],
        a: 1,
        why: "`==` 的优先级高于 `&`，所以原式先算 `MASK == 0` 得到 0 或 1，再与 flags 做按位与；想表达「标志位没打开」必须自己加括号。",
        q_en: "Which expression means exactly the same as 'flags & MASK == 0'?",
        o_en: ["(flags & MASK) == 0", "flags & (MASK == 0)", "(flags & MASK) != 0", "flags == (MASK & 0)"],
        why_en: "Equality binds tighter than bitwise AND, so the original computes MASK == 0 first and ANDs that 0/1 with flags; you must add the parentheses to say 'this flag is off'."
      },
      {
        q: "判断：`cin >> n` 之后紧接着 `getline(cin, s)`，s 会得到用户输入的下一整行内容。",
        type: "judge", a: 1,
        why: "错。`>>` 在换行处停下但并不消耗它，getline 随即把这个残留换行当成一整行读完，所以 s 是空串；中间必须补一次 `cin.ignore(..., '\\n')`。",
        q_en: "True or false: after 'cin >> n', a following 'getline(cin, s)' returns the user's next whole line in s.",
        why_en: "False. >> stops at the newline without consuming it, so getline immediately treats that leftover newline as the whole line and s comes back empty; you need a cin.ignore(..., '\\n') in between."
      },
      {
        q: "要输出「小数点后恰好两位」，除了 `setprecision(2)` 还必须配合哪个操纵符？填英文。",
        type: "fill", ans: ["fixed", "std::fixed"],
        why: "默认格式下 setprecision 的 2 表示「两位有效数字」，加上 fixed 之后才表示「小数点后两位」，这两个开关永远成对出现。",
        q_en: "To print exactly two digits after the decimal point, which manipulator must accompany setprecision(2)?",
        why_en: "In the default format setprecision counts significant digits; only under fixed does 2 mean two places after the point, so the two always travel together."
      }
    ],
    s4: [
      {
        q: "数组长度是 n，下面哪个循环恰好会越界访问一次？",
        o: ["for (int i = 0; i < n; ++i)", "for (int i = 0; i <= n; ++i)", "for (int i = 1; i < n; ++i)", "for (int i = 0; i != n; ++i)"],
        a: 1,
        why: "`i <= n` 让 i 取到 n，`arr[n]` 就是越界；半开区间 [0, n) 才是遍历 n 个元素的正确形状。",
        q_en: "For an array of length n, which loop reads exactly one element out of bounds?",
        o_en: ["for (int i = 0; i < n; ++i)", "for (int i = 0; i <= n; ++i)", "for (int i = 1; i < n; ++i)", "for (int i = 0; i != n; ++i)"],
        why_en: "'i <= n' lets i reach n, so arr[n] is past the end; the half-open range [0, n) is the correct shape for n elements."
      },
      {
        q: "下面哪一项不能作为 switch 的 case 标签？",
        o: ["字符字面量 'A'", "表达式 1 + 2", "变量 n", "枚举值"],
        a: 2,
        why: "case 标签必须是编译期常量表达式；`1 + 2` 编译器能当场算出来所以合法，而变量 n 的值要到运行期才知道。",
        q_en: "Which of these cannot be a switch case label?",
        o_en: ["The character literal 'A'", "The expression 1 + 2", "The variable n", "An enumerator"],
        why_en: "Case labels must be constant expressions: 1 + 2 is folded at compile time so it is fine, while n is only known at run time."
      },
      {
        q: "判断：`if (x > 0);` 后面紧跟的那个花括号块，在条件为假时也会执行。",
        type: "judge", a: 0,
        why: "对。多写的分号让条件挂在一条空语句上，后面的花括号就成了一个独立的、无条件执行的块。",
        q_en: "True or false: the brace block after 'if (x > 0);' also runs when the condition is false.",
        why_en: "True. The stray semicolon hangs the condition on an empty statement, so the following braces become an independent block that always runs."
      },
      {
        q: "故意让 switch 的一个 case 贯穿到下一个时，C++17 建议写上哪个属性来标明「这是有意的」？",
        type: "fill", ans: ["[[fallthrough]]", "fallthrough"],
        why: "`[[fallthrough]];` 既关掉 `-Wimplicit-fallthrough` 的警告，也告诉读代码的人这里不是忘写 break。",
        q_en: "When a switch case deliberately falls through, which C++17 attribute documents the intent?",
        why_en: "'[[fallthrough]];' silences -Wimplicit-fallthrough and tells the reader that no break is missing here."
      }
    ]
  },

  /* ---------- 词典（分类统一为「C++ 系统深入」） ---------- */
  terms: [
    { term: "整数除法", term_en: "Integer Division", cat: "C++ 系统深入",
      short: "两个整数相除结果仍是整数，小数部分被向零截断。",
      short_en: "Dividing two integers yields an integer, with the fraction truncated toward zero.",
      detail: ["5/2 得 2、-7/2 得 -3：C++11 起统一规定向零截断。", "想要 2.5 必须让某一侧本来就是浮点，或者在除法发生之前完成类型转换。"],
      detail_en: ["5/2 is 2 and -7/2 is -3: since C++11 truncation is always toward zero.", "To get 2.5 one operand must already be floating-point, or be converted before the division happens."],
      vs: "整数除法丢的是小数部分，溢出回绕丢的是数值范围。",
      vs_en: "Integer division loses the fraction; overflow loses the range." },
    { term: "短路求值", term_en: "Short-Circuit Evaluation", cat: "C++ 系统深入",
      short: "&& 左侧为假或 || 左侧为真时，右侧表达式完全不参与求值。",
      short_en: "When the left side of && is false, or of || is true, the right side is never evaluated at all.",
      detail: ["防御性写法靠它才成立：守卫条件必须写在左边。", "把带副作用的调用放在右边，就会出现「条件一变它就少执行一次」的隐形 bug。"],
      detail_en: ["Defensive tests work only because of it: the guard belongs on the left.", "A call with side effects on the right becomes a bug that fires whenever the left side changes."],
      vs: "短路跳过的是「求值」，if 的分支跳过的是「语句」。",
      vs_en: "Short-circuiting skips evaluation; an if branch skips statements." },
    { term: "运算符优先级", term_en: "Operator Precedence", cat: "C++ 系统深入",
      short: "决定表达式如何加括号结合的规则，与运行时的求值顺序无关。",
      short_en: "The rule for how an expression is parenthesised; it is not the run-time evaluation order.",
      detail: ["事故高发区：位运算低于比较、移位低于加减、赋值几乎最低且右结合。", "在同一表达式里既读又改同一个变量是未定义行为，加括号也救不回来。"],
      detail_en: ["The accident zone: bitwise binds looser than comparisons, shifts looser than addition, and assignment is nearly last and right-associative.", "Reading and modifying the same variable in one expression is undefined behaviour, which no parentheses can repair."],
      vs: "优先级管「怎么结合」，求值顺序管「副作用何时落地」。",
      vs_en: "Precedence governs grouping; evaluation order governs when side effects land." },
    { term: "流失败状态", term_en: "Stream Failure State", cat: "C++ 系统深入",
      short: "cin 遇到类型不符或文件尾后进入 fail 状态，此后每次读取都立即失败。",
      short_en: "After a type mismatch or end-of-file, cin enters a fail state in which every later read fails immediately.",
      detail: ["恢复现场是三步：clear() 清标志、ignore() 丢掉坏 token、再重新读。", "while (cin >> x) 正是利用「失败即为假」来自然结束读入循环。"],
      detail_en: ["Recovery takes three steps: clear() the flags, ignore() the offending token, then read again.", "while (cin >> x) exploits exactly this: failure makes the condition false, so the loop ends."],
      vs: "流失败是「没读出值」，垃圾值是「读出了一个没初始化的值」。",
      vs_en: "A failed stream yields nothing; a garbage value is one that was never set." },
    { term: "行缓冲", term_en: "Line Buffering", cat: "C++ 系统深入",
      short: "终端输出通常攒到换行或刷新时才真正送出去。",
      short_en: "Terminal output is normally held until a newline or a flush actually sends it.",
      detail: ["endl 会强制刷新，换行字符不会，所以海量输出时用 endl 明显更慢。", "cin 默认与 cout 绑定，读之前会自动刷新输出，提示语才一定看得见。"],
      detail_en: ["endl flushes while a plain newline does not, so endl is measurably slower under heavy output.", "cin is tied to cout by default and flushes it before reading, which is why prompts appear."],
      vs: "缓冲区决定「什么时候送出」，格式化决定「送出去长什么样」。",
      vs_en: "Buffering decides when bytes leave; formatting decides how they look." },
    { term: "差一错误", term_en: "Off-By-One Error", cat: "C++ 系统深入",
      short: "循环边界多算或少算一次，是最高频的运行期 bug。",
      short_en: "Counting one round too many or too few at a loop bound — the single most common run-time bug.",
      detail: ["通解是半开区间 [0, n)：元素个数 = 末 − 初，恒成立。", "数组长度为 n 时写 i <= n 必然越界，而未定义行为常常先表现为「数值怪怪的」。"],
      detail_en: ["The universal cure is the half-open range [0, n), where count = end - begin always holds.", "With n elements, i <= n indexes past the end, and the undefined behaviour usually shows up as a strange number long before any crash."],
      vs: "差一是边界写错，越界是它造成的后果。",
      vs_en: "Off-by-one is the wrong bound; out-of-bounds is the damage it does." },
    { term: "循环不变式", term_en: "Loop Invariant", cat: "C++ 系统深入",
      short: "每轮循环开始前都成立的一句断言，用它论证循环写对了。",
      short_en: "An assertion true before every round of the loop, used to argue that the loop is correct.",
      detail: ["动手写循环体之前，先用一句话说清「到此为止的 i 代表什么」。", "不变式保证每轮都对，终止条件保证会停，两者合起来才叫正确性。"],
      detail_en: ["Before writing the body, say in one sentence what i means so far.", "The invariant gives per-round correctness and the exit condition gives an end; only together do they give correctness."],
      vs: "不变式管「每轮都对」，终止条件管「会不会停」。",
      vs_en: "The invariant says each round is right; the exit condition says it stops." },
    { term: "case 贯穿", term_en: "Switch Fallthrough", cat: "C++ 系统深入",
      short: "匹配成功后缺少 break，就继续执行下一个 case 里的语句。",
      short_en: "Without a break after a match, execution carries on into the next case's statements.",
      detail: ["这是合法而且默认安静的行为，有意贯穿必须写 fallthrough 属性。", "安全的共享写法是把空的 case 标签紧挨着排，中间不放任何语句。"],
      detail_en: ["It is legal and usually silent, so a deliberate fallthrough must carry the fallthrough attribute.", "The safe way to share a body is to stack empty case labels with no statement between them."],
      vs: "贯穿是 switch 里的继续执行，continue 是循环里的进入下一轮。",
      vs_en: "Fallthrough keeps executing inside a switch; continue starts the next round of a loop." },
    { term: "卫语句", term_en: "Guard Clause", cat: "C++ 系统深入",
      short: "把非法与异常情况在入口处先处理掉，让正常路径不被层层嵌套。",
      short_en: "Handle illegal or exceptional cases at the entrance so the main path stays un-nested.",
      detail: ["先 return 掉坏情况，主流程就能保持零缩进，多档判断也照此办理。", "循环里写 if (!ok) break; 同样是一种卫语句。"],
      detail_en: ["Returning early on bad input keeps the main flow at zero indentation, and cascades work the same way.", "Inside a loop, 'if (!ok) break;' is a guard clause too."],
      vs: "卫语句用来压平嵌套，else if 链用来表达互斥分支。",
      vs_en: "Guard clauses flatten nesting; an else-if chain expresses mutually exclusive branches." }
  ],

  achievements: [
    { id: "expr_fluent", icon: "🧮", name: "表达式与会话", name_en: "Fluent in Expressions",
      desc: "完成 s3 · 运算符与输入输出 全部课节", desc_en: "Finish every lesson of s3 Operators & I/O",
      check: ["s3"] },
    { id: "flow_control", icon: "🔀", name: "判断与重复", name_en: "Decide and Repeat",
      desc: "完成 s4 · 控制流 全部课节", desc_en: "Finish every lesson of s4 Control Flow",
      check: ["s4"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "2：整数除法向零截断": "2: integer division truncates toward zero",
    "2.5：只要有一边是浮点就走浮点除法": "2.5: one floating-point side is enough to take the floating path",
    "-3 与 -1：余数的符号跟着左操作数": "-3 and -1: the remainder's sign follows the left operand",
    "逐位拆出 3、2、1": "digits peeled off one by one: 3, 2, 1",
    "判奇偶用 != 0，别写 == 1": "test oddness with != 0, never with == 1",
    "后置：先交 3，然后 i 才变 4": "post-increment: hands out 3, then i becomes 4",
    "前置：j 先变 4，交出去的是 4": "pre-increment: j becomes 4 first and 4 is what you get",
    "44：一条语句只改一个变量，才没有歧义": "44: one variable per statement, so nothing is ambiguous",
    "关系运算本身就产出 bool，不必再和 true 比": "a relation already yields bool; no need to compare with true",
    "一个等号是赋值：分数被改掉而且条件恒真": "one equals sign assigns: the score is overwritten and the test is always true",
    "先算 (1<5) 得 true，再拿 1 去和 3 比": "1<5 is evaluated first and yields true, then 1 is compared with 3",
    "区间判断只能拆成两段": "a range test has to be split into two comparisons",
    "守卫写在左边，越界的那一半不会执行": "the guard sits on the left, so the out-of-bounds half never runs",
    "德摩根：两个都不成立的正确写法": "De Morgan: the correct form for 'neither holds'",
    "C++14 二进制字面量：第 0、2 位开着": "C++14 binary literal: bits 0 and 2 are raised",
    "括号加 != 0：& 的优先级低于 ==": "parentheses plus != 0: & binds looser than ==",
    "第 1 位没开，所以是 false": "bit 1 is down, so this is false",
    "被读成 flags 与 0 的按位与，结果是 0": "parses as the bit-and of flags with 0, so the result is 0",
    "不是先移位再加一，而是 1 左移 4 位得 16": "not (1<<3)+1 but 1 shifted left by 4, giving 16",
    "1：无符号右移在高位补 0": "1: an unsigned right shift fills the top with 0",
    "移位量等于位宽是未定义行为，下面这行永远不要写：": "shifting by the full width is undefined behaviour, so never write the next line:",
    "0 与 16：判奇偶、抹掉最低位的 1": "0 and 16: test oddness, and erase the lowest set bit",
    "关掉一个标志位": "clear one flag bit",
    "8：乘法高于加法": "8: multiplication outranks addition",
    "0：解析成 a 与 (b==0) 按位与": "0: parsed as the bit-and of a with (b==0)",
    "0：6 与 4 的公共位不为空，所以是假 —— 加括号才是本意": "0: 6 and 4 share a bit so this is false — parentheses carry the intent",
    "32：先算 2+3=5，再左移 5 位": "32: 2+3=5 first, then shift left by 5",
    "0：减法左结合": "0: subtraction is left-associative",
    "4：括号确实会改变结果": "4: parentheses really do change the result",
    "逗号运算符取最后一个：3": "the comma operator yields its last operand: 3",
    "三元在赋值右边可以裸写": "a ternary needs no extra parentheses on the right of =",
    "放进输出流必须再加一层括号": "inside an output stream it needs one more pair of parentheses",
    "提示与读取之间由 tie 自动刷新": "the tie flushes cout automatically between prompt and read",
    "只吃到残留的换行，line 是空串": "it only catches the leftover newline, so line is empty",
    "现在读到的才是用户输入的整行": "only now does it read the user's real line",
    "遇坏字符或 EOF 条件为假，循环自然结束": "a bad character or EOF makes the condition false and the loop ends",
    "需要限量时再加一个出口": "add an extra exit when you need a limit",
    "曾经读失败：想继续用得先恢复现场": "a read failed earlier: recover the stream before using it again",
    "清掉失败标志": "clear the failure flags",
    "扔掉坏 token，否则会卡在同一字符上": "discard the bad token, or you spin on the same character",
    "3.1：默认格式里 2 是有效数字": "3.1: in the default format 2 counts significant digits",
    "3.14：fixed 之后才是小数位数": "3.14: only under fixed does 2 count digits after the point",
    "2.72：fixed 与精度会一直留着": "2.72: fixed and the precision stay in force",
    "恢复默认格式与精度": "restore the default format and precision",
    "宽度只管一格，所以要写两次": "width covers one item only, so write it twice",
    "内容超宽也不会被截断": "content wider than the field is still not truncated",
    "00042：填充字符同样是粘性的": "00042: the fill character is just as sticky",
    "用完记得把填充换回空格": "set the fill back to a space when you are done",
    "钱在内部一律按整数「分」存": "money is kept as integer cents internally",
    "123.45：最后一步才换算": "123.45: converted into units only at the last step",
    "读失败就立刻收场，不要继续算": "if the read fails, leave at once instead of computing",
    "区间要自己判：除数为 0 会毁掉结果": "ranges are your job: a zero divisor wrecks the result",
    "先乘 100.0 再除：避开整数除法": "multiply by 100.0 before dividing to dodge integer division",
    "2 的 40 次方：必须用 long long": "2 to the 40th: it needs long long",
    "清掉残行再读整行": "drop the rest of the line before reading a whole line",
    "带空格的整行只能交给 getline": "a line containing spaces can only come from getline",
    "永远写花括号，哪怕只有一行": "always write the braces, even for one statement",
    "进不来：浮点不该判相等": "never reached: floats should not be compared for equality",
    "'0' 的 ASCII 是 48，带引号的零不是假": "the ASCII of '0' is 48, so a quoted zero is not falsy",
    "写成单等号就会把 x 改掉并且恒真": "a single equals would overwrite x and stay always true",
    "分号让条件空转，紧跟的块永远执行 —— 下面两行演示这个坑：": "the semicolon makes the condition idle and the block unconditional — the next two lines show it:",
    "卫语句：先把不合法输入挡在门外": "guard clause: keep illegal input out of the main flow",
    "从严格到宽松，顺序绝对不能反": "strictest first, then looser — never reverse the order",
    "兜底 else：缺了这一支就有静默空洞": "the catch-all else: omit it and uncovered values vanish silently",
    "反例：三个并列的 if 会全部执行": "counter-example: three parallel ifs all run",
    "后一支覆盖前一支，只剩最后一次": "each branch overwrites the last, so only the final one survives",
    "想要「只命中一档」就得改成 else if": "for 'exactly one tier fires' you need else if",
    "char 属于整型类，可以当选择条件": "char is integer-like, so it can select a case",
    "空标签挨着排：与下一支共享逻辑": "stacked empty labels: they share the next body",
    "有意贯穿要用属性标出来": "mark a deliberate fallthrough with the attribute",
    "从 case 1 一路执行到这里": "execution arrived here straight from case 1",
    "在 case 里声明变量必须自带花括号": "a variable declared in a case needs its own braces",
    "不写 default，非法值就静默穿过去": "omit default and illegal values slip through unnoticed",
    "变量不能当标签，所以下面这一行是编译错误：": "a variable cannot be a label, so the next line is a compile error:",
    "三元直接交出一个值": "the ternary hands back a value directly",
    "同样的逻辑用 if 要多写三行": "the same logic costs three extra lines with if",
    "分支类型不同：统一提升成 double": "differing branch types: the result is promoted to double",
    "解析成 flag ? a : (b = 5)，b 没变": "parses as flag ? a : (b = 5), so b is untouched",
    "嵌套到第二层就到顶了": "the second nesting level is the ceiling",
    "1..100：闭区间就老实写两个等号": "1..100: a closed interval honestly uses <=",
    "半开区间：个数正好是 n": "half-open range: exactly n elements",
    "双指针：初始化与步进各写两条": "two pointers: two clauses each in the init and the step",
    "range-for：没有下标就没有差一": "range-for: no index, hence no off-by-one",
    "空条件恒真，只能靠 break 出去": "an empty condition is always true; only break gets you out",
    "下面两行一个是差一、一个是无符号恒真，都别写：": "the next two lines are an off-by-one and an always-true unsigned loop; never write them:",
    "删掉自增就是死循环：条件永远不变假": "delete the increment and it never ends: the condition cannot become false",
    "读到坏字符或 EOF 自然停，不需要哨兵": "it stops on a bad character or EOF, no sentinel needed",
    "至少执行一次：菜单与重试的标准形状": "at least one round: the standard shape for menus and retries",
    "结尾的分号不能省": "the trailing semicolon is mandatory",
    "每轮都朝边界动一步，才会停": "every round moves toward the bound, so the loop stops",
    "条件用的是旧值：打印 2 1 0": "the condition yields the old value: it prints 2 1 0",
    "for 里 continue 之后自增照样执行，安全": "in a for the increment still runs after continue, so this is safe",
    "自增必须排在 continue 之前": "the increment has to come before the continue",
    "把自增挪到这一行下面就是死循环": "move the increment below this line and the loop never ends",
    "只在「找到因子」时提前退出": "exit early only when a factor is found",
    "想跳出外层循环：置标志，让条件去收尾": "to leave the outer loop, raise a flag and let the condition finish the job",
    "这里的 break 只离开 switch": "the break here leaves only the switch",
    "五个档位，先全部归零": "five tiers, all of them zeroed first",
    "恒真条件是有意的事件循环，出口在下面": "an always-true condition is a deliberate event loop; the exits come below",
    "读不动了就走：非法输入挡在最外层": "leave when the read fails: bad input is turned away at the top",
    "约定一个哨兵值": "an agreed sentinel value ends the input",
    "越界不入库，用 continue 进下一轮": "out-of-range values are not stored; continue starts the next round",
    "分档只算一次，别写五条 if 互相覆盖": "classify once; five separate ifs would overwrite each other",
    "半开区间 [0,5)：个数就是 5": "half-open range [0,5): exactly five items",
    "内层只画条形，两层各自一句话说得清": "the inner loop only draws the bar; each level takes one sentence to describe"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_S34);
