/* ================================================================
 * R0:hello agi · 课程深化层 ⑥（sbw 位运算深入 / srec 递归与分治 / sdp 动态规划入门）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「算法三章」从每节 3~4 要点深化到 7~8 要点。算法课的重心不是「记住这段代码」，
 *       而是三件事：为什么这样做成立（补码、抵消、最优子结构）、代价是什么（复杂度与栈深度）、
 *       什么时候会错（未定义行为、边界、遍历顺序）。每章末尾补一节「综合重构」收口课。
 * 写法约定：既有课节不写 title（沿用主数据标题）；新课写 title/title_en/target/target_en；
 *          order 覆盖全部既有 id + 新增 id；code 里的中文注释全部进 codeComments。
 * ================================================================ */

const DEEPEN_ALGO1 = {
  stages: ["sbw", "srec", "sdp"],

  order: {
    sbw: ["b1", "b2", "b3", "b4", "b5"],
    srec: ["c1", "c2", "c3", "c4", "c5"],
    sdp: ["e1", "e2", "e3", "e4", "e5"]
  },

  lessons: {

    /* ===================== sbw 位运算深入 ===================== */
    "b1": {
      min: 12,
      summary: [
        "整数在内存里就是一串**补码**比特，六种位运算（& | ^ ~ << >>）都是对这串位逐位动手：它不认识「数字」，只认识 0 和 1——这是所有位技巧能被证明的前提。",
        "三件套足够应付一切：取第 k 位 `(x >> k) & 1`、置 1 用 `x |= (1u << k)`、清 0 用 `x &= ~(1u << k)`，再加一个翻转 `x ^= (1u << k)`；后面 b2~b4 的每个技巧都是这四行的组合。",
        "位运算符的优先级**低于**比较与加减：`x & 1 == 1` 会被解析成 `x & (1 == 1)`，也就是 `x & 1`——这一例偶然正确，换成 `x & 1 == 0` 就恒为 0，判断永远假。组合表达式一律加括号。",
        "补码定义 `~x == -x - 1`（即 `-x == ~x + 1`），最高位是符号位。记住它，`x & -x` 为什么能留下最低位的 1、负数右移为什么要补 1，都不需要背。",
        "移位不等于除法：`x / 2` 对负数**向零**取整（-7/2 == -3），`x >> 1` 对负数向下取整（-7 >> 1 == -4）。C++17 里「负数右移的结果」是实现定义行为（多数编译器做算术右移），C++20 才写成向下取整；要把移位当除法用，只敢用在非负数上。",
        "移位数量是硬性红线：必须是 `0 <= k < 位宽`。`v << 32`（int 为 32 位）和 `v << -1` 都是**未定义行为**，调试版看着对、`-O2` 下可能变成 0 或原值；`1 << 31` 让有符号 int 溢出同样是 UB。位容器请用 `uint32_t` / `uint64_t` 配 `1u` / `1ull` 字面量。",
        "什么时候会出错还有两类常见情形：把 `~` 用在有符号数上以为「取反就是补码」而忘了符号位；以及用 `int` 存标志位后写 `mask >> 31`，符号位一置起，右移和比较的行为就整个变味。",
        "衔接：这一节是 sbw 的地基（前置是 s2 的类型与 s7 的内存模型）。b2 看异或的「抵消」性质，b3 用补码把 lowbit 讲透，b4 把位当集合用。"
      ],
      summary_en: [
        "An integer in memory is a run of two's-complement bits and all six operators (& | ^ ~ << >>) work bit by bit: they never see a 'number', only 0s and 1s — that is why every bit trick can be proved rather than memorised.",
        "Three moves cover everything: read bit k with '(x >> k) & 1', set with 'x |= (1u << k)', clear with 'x &= ~(1u << k)', plus a flip 'x ^= (1u << k)'. Every trick in b2-b4 is a combination of these four lines.",
        "Bit operators bind *looser* than comparison and arithmetic: 'x & 1 == 1' parses as 'x & (1 == 1)', i.e. 'x & 1' — right by luck here, but 'x & 1 == 0' becomes a constant 0 and the test never fires. Parenthesise, always.",
        "Two's complement means ~x == -x - 1 (equivalently -x == ~x + 1) and the top bit is the sign. Hold on to that and both 'why x & -x isolates the lowest 1' and 'why shifting a negative fills with 1s' stop being memorised facts.",
        "Shifting is not dividing: 'x / 2' truncates toward zero for negatives (-7/2 == -3) while 'x >> 1' floors (-7 >> 1 == -4). In C++17 the result of shifting a negative is implementation-defined (almost every compiler does an arithmetic shift); C++20 pins it to floor. Only non-negative values make the two agree.",
        "Shift count is a hard limit: it must satisfy 0 <= k < width. 'v << 32' on a 32-bit int and 'v << -1' are undefined behaviour — debug looks sane, -O2 may yield 0 or the original value. '1 << 31' overflows signed int, also UB. Keep bit containers in uint32_t / uint64_t with 1u / 1ull literals.",
        "Two more frequent failures: applying ~ to a signed value and assuming 'complement equals negation' while the sign bit is set, and storing flags in an int so that 'mask >> 31' and every comparison change behaviour once the sign bit turns on.",
        "Bridge: this section is the ground under sbw (prerequisites: s2 types, s7 memory model). b2 studies XOR cancellation, b3 proves lowbit from two's complement, b4 treats bits as sets."
      ],
      code: `#include <cstdint>
#include <iostream>
int main() {
    uint32_t x = 0;                     // 位容器一律用无符号：没有符号位也没有溢出争议
    x |= (1u << 2);                     // 置第 2 位
    x &= ~(1u << 2);                    // 清第 2 位
    x ^= (1u << 5);                     // 翻转第 5 位：不关心原来是什么
    bool on = ((x >> 5) & 1u) == 1u;    // 取第 5 位来看
    // 优先级陷阱：下面这一行的意思是 x & (1 == 1)
    if ((x & 1) == 1) on = true;
    int v = -7;
    std::cout << (v / 2) << ' ' << (v >> 1) << '\\n';   // 除法向零取整，右移向下取整
    // 移位数必须严格小于位宽：v << 32 与 v << -1 都是未定义行为
    return on ? 0 : 1;
}`,
      pit: "用有符号 int 做位容器并写 `1 << 31` 或 `x << 32`：移位数等于位宽、或左移让值超出 int 范围，都属于未定义行为，编译器有权假设你不会这样写并据此优化——同一份代码在 `-O0` 与 `-O2` 下给出不同结果，是位运算 bug 最难复现的形态。",
      pit_en: "Using signed int as the bit container and writing '1 << 31' or 'x << 32': a shift count equal to the width, or a left shift that leaves int's range, is undefined behaviour, and the compiler may optimise on the assumption you never do it. The same file then behaves differently under -O0 and -O2, which is the hardest shape of bit bug to reproduce.",
      ex: {
        q: "为什么 `x & 1 == 1` 有时看起来是对的？",
        a: "因为 `1 == 1` 先算成 1，`x & 1` 恰好就是想要的低位——判断靠优先级巧合撞对；只要右边换成 0，式子变成 `x & 0` 恒为 0，判断永远不成立。",
        q_en: "Why does 'x & 1 == 1' sometimes appear to work?",
        a_en: "Because '1 == 1' evaluates first to 1, and 'x & 1' happens to be the test you meant; change the right side to 0 and the expression becomes 'x & 0', a constant false."
      }
    },

    "b2": {
      min: 12,
      summary: [
        "异或 `^` 是「相同为 0、不同为 1」，等价于**不进位加法**；它的三条代数性质撑起全部技巧：`x ^ 0 == x`、`x ^ x == 0`、以及交换律 + 结合律。",
        "第四条性质是**自逆**：`(a ^ b) ^ b == a`。不借助临时变量的三步交换就是它的应用，「只出现一次的数」也靠它——顺序无关，成对抵消。",
        "「抵消」思想可以变形但不能滥用：出现两次用异或即可；出现三次时异或失效（三个相同值异或还剩自己），必须逐位统计 mod 3。先判断「抵消是否成立」，再决定要不要用位技巧。",
        "异或交换的真正陷阱是**别名**：当 a 与 b 是同一片内存（`arr[i]` 与 `arr[j]` 且 i == j，或两个指向同一节点的引用），三步都作用在同一格上，结果变成 0，原值静默丢失——只在特定下标触发，测试极难覆盖。",
        "工程上一律用 `std::swap`： xor-swap 一个寄存器都省不下来（编译器本来就用寄存器换），反而堵住了指令合并优化、还引入别名归零的风险；「少一个临时变量」在现代优化器前不是收益。",
        "判断异号 `(a ^ b) < 0` 靠的是补码最高位即符号位：符号不同则最高位不同。与 `a * b < 0` 相比它不会溢出，是二分查找与数值归并里更稳的写法。",
        "其它高频惯用法：`~x == -x - 1`；`x ^ mask` 把掩码内的位整体翻转；`a ^ b` 直接给出「两者不同的位集合」，配合 popcount 就是汉明距离。",
        "衔接：b3 会用补码定义把 `x & -x` 讲清楚，那里能直接看到「取反加一 + 相与」如何组合出 lowbit。"
      ],
      summary_en: [
        "XOR means '0 when equal, 1 when different' and is addition without carry; three algebraic properties carry every trick: x ^ 0 == x, x ^ x == 0, plus commutativity and associativity.",
        "The fourth property is self-inverse: (a ^ b) ^ b == a. The three-step no-temp swap is its direct application, and so is 'the element that appears once' — order is irrelevant, pairs annihilate.",
        "Cancellation is a template, not a law: two occurrences vanish under XOR, three do not (an odd group leaves itself behind), so counting bits mod 3 is required. Decide first whether cancellation is valid, then whether a bit trick applies.",
        "The real trap of the swap is aliasing: when a and b name the same memory (arr[i] and arr[j] with i == j, or two references to one node), all three steps hit that one cell and it becomes 0, silently — and only for that index, which tests rarely reach.",
        "Use std::swap in real code: xor-swap saves no register (the compiler already uses one), blocks instruction merging, and adds the aliasing hazard. 'One fewer temporary' is not a win against a modern optimiser.",
        "'(a ^ b) < 0' tests opposite signs because in two's complement the top bit is the sign bit: differing signs mean differing top bits. Unlike 'a * b < 0' it cannot overflow, which makes it the safer form in binary search and numeric merges.",
        "Other everyday idioms: ~x == -x - 1; 'x ^ mask' flips exactly the bits inside the mask; 'a ^ b' hands you the set of differing bits, and a popcount on it is the Hamming distance.",
        "Bridge: b3 proves lowbit from the same two's-complement identity — complement, add one, and AND isolating a single bit."
      ],
      code: `#include <utility>
int main() {
    int v[] = {4, 7, 9, 7, 4};
    int only = 0;                       // 0 是异或的单位元
    for (int x : v) only ^= x;          // 成对抵消，剩下落单的 9
    int a = 1, b = 2;
    a ^= b; b ^= a; a ^= b;             // 三步交换：靠的是自逆性 a^b^b == a
    int arr[] = {5};
    arr[0] ^= arr[0];                   // 别名陷阱：两个名字指同一块内存
    arr[0] ^= arr[0];                   // 三步做完这一格变成 0，原值丢了
    arr[0] ^= arr[0];
    std::swap(a, b);                    // 工程写法：语义清楚，也没有上面的坑
    bool diff_sign = (a ^ b) < 0;       // 最高位不同即异号，不会像乘法那样溢出
    return diff_sign ? only : arr[0];
}`,
      pit: "把异或交换写进「下标可能相等」的通用例程（比如原地重排数组、快排的 swap(i, j)）：i == j 时该元素被清零，而且是**静默**清零，只有在某条特定分支上才出现；这类 bug 常在生产环境跑了几万条数据后才被发现有元素变成 0。",
      pit_en: "Putting xor-swap into a routine whose indices can be equal (in-place reordering, quicksort's swap(i, j)): when i == j the element is zeroed silently, and only on that one branch — so it typically surfaces after tens of thousands of production rows show a stray 0.",
      ex: {
        q: "既然三步交换不需要临时变量，为什么编译器反而不喜欢它？",
        a: "寄存器本来就不稀缺，编译器生成的交换本来就是三条 mov；串行的三条异或还存在数据依赖，妨碍它和相邻指令一起被合并优化，于是「省一个变量」换来的是更差的指令级并行。",
        q_en: "If the three-step swap needs no temporary, why do compilers dislike it?",
        a_en: "Registers were never scarce — a generated swap is three movs anyway — and the dependent chain of three XORs blocks reordering with neighbouring instructions, so 'one fewer local' costs instruction-level parallelism."
      }
    },

    "b3": {
      min: 12,
      summary: [
        "lowbit(x) = `x & -x`，取出**最低位的 1 及其后面的全 0**（x = 12 即 1100 得 0100 = 4）；x == 0 时结果为 0，这一点必须单独想清楚。",
        "为什么成立（补码直觉）：`-x == ~x + 1`。取反让最低位 1 之前的 0 全变 1，加 1 时进位**正好停在第一个 1** 处——于是该位在 x 与 -x 里同为 1，其上各位互为相反、其下各位在 -x 里为 0，相与只剩它。",
        "兄弟技巧 `x & (x - 1)` 的作用是**消掉最低位的 1**（12 & 11 = 8）：x-1 把最低位的 1 变成 0、其后所有 0 变成 1，相与之后其上照抄、其下全 0。两个式子配成一对记。",
        "判断 2 的幂写 `x > 0 && (x & (x - 1)) == 0`：漏掉 `x > 0` 时 0 会蒙混过关（`0 & -1 == 0`），补码负数同样能骗过纯位判断；漏掉括号则因优先级变成 `x & ((x-1) == 0)`，恒为 0，任何数都「是 2 的幂」。",
        "lowbit 是树状数组的全部秘密：`i += i & -i` 跳到覆盖区间的右端点、`i -= i & -i` 退回上一个区间，于是单点改、前缀和都是 O(log n)。看不懂树状数组时，通常是不理解 lowbit 的「区间长度」含义。",
        "数 1 的个数有三种写法：逐位 `(x >> i) & 1` 是 O(位宽)；`while (x) { x &= x - 1; ++c; }` 循环次数**正好等于 1 的个数**；`__builtin_popcount / __builtin_popcountll`（GCC、Clang 扩展）在支持 popcnt 的机器上编译成一条指令。",
        "要标准可移植就用 `std::bitset<64>(x).count()`：宽度写死在类型参数里，位宽变化时不会悄悄截断（`__builtin_popcount` 只吃 unsigned int，超过 32 位要用 ll 版本，传错就是静默丢高位）。",
        "两个边界会咬人：对 `INT_MIN` 取负本身溢出（未定义行为），所以 lowbit 的参数要先转无符号；`x & -x` 写成 `x & (~x + 1)` 时也要注意 ~ 的结果类型。衔接：b4 把「一位一义」用到极致，就是状态压缩。"
      ],
      summary_en: [
        "lowbit(x) = x & -x isolates the lowest set bit together with the zeros below it (x = 12, i.e. 1100, gives 0100 = 4); for x == 0 the result is 0, a case worth thinking about separately.",
        "Why it works: -x == ~x + 1. Complementing turns the zeros below the lowest 1 into ones, and adding 1 carries exactly up to that first 1 — so that bit is 1 in both operands, every bit above is inverted, and every bit below is 0 in -x, leaving one bit after the AND.",
        "Its sibling x & (x - 1) clears the lowest set bit (12 & 11 = 8): x-1 flips that 1 to 0 and every 0 below it to 1, so the AND copies the high part and zeroes the rest. Keep the pair together.",
        "Testing a power of two needs x > 0 && (x & (x - 1)) == 0: without the guard, 0 slips through (0 & -1 == 0) and two's-complement negatives do too; without the parentheses, precedence turns it into x & ((x-1) == 0), a constant 0, so every number 'is' a power of two.",
        "lowbit is the whole secret of a Fenwick tree: i += i & -i jumps to the right end of the covered range and i -= i & -i walks back, giving O(log n) point updates and prefix sums. Fenwick confusion is usually lowbit confusion.",
        "Counting set bits has three forms: scanning (x >> i) & 1 is O(width); 'while (x) { x &= x - 1; ++c; }' loops exactly popcount(x) times; __builtin_popcount / __builtin_popcountll (GCC and Clang extensions) compile to one popcnt instruction where the hardware has it.",
        "For portable standard code use std::bitset<64>(x).count(): the width is a type argument, so it cannot silently truncate — __builtin_popcount takes unsigned int only, so wider values need the ll variant, and passing the wrong one drops high bits quietly.",
        "Two edges bite: negating INT_MIN overflows (undefined behaviour), so convert to unsigned before taking a lowbit; and when you hand-write x & (~x + 1), watch the type that ~ produces. Bridge: b4 pushes 'one bit, one meaning' to its limit — state compression."
      ],
      code: `#include <bitset>
#include <cstdint>
#include <cstddef>
int main() {
    uint64_t x = 12;                            // 1100
    uint64_t low = x & (~x + 1);                // lowbit：手写 -x 就是取反加一
    uint64_t gone = x & (x - 1);                // 抹掉最低位的 1，得到 8
    // 判 2 的幂必须带 x > 0，否则 0 会蒙混过关
    bool pow2 = (x > 0) && ((x & (x - 1)) == 0);
    int ones = 0;
    for (uint64_t t = x; t; t &= t - 1) ++ones; // 循环次数就是 1 的个数
    // 同一件事的三种写法：手写循环、编译器内建、标准库，可移植性依次上升
    int via_builtin = __builtin_popcountll(x);
    std::size_t via_std = std::bitset<64>(x).count();
    // INT_MIN 取负本身是未定义行为，所以 lowbit 的参数要先转成无符号
    return (pow2 && gone == 8 && via_builtin == static_cast<int>(via_std)) ? ones : 0;
}`,
      pit: "把「`(n & (n-1)) == 0` 就是 2 的幂」当结论背下来，忘了 n 为 0 与 n 为负数的两个漏洞：0 会被判成 2 的幂，于是「按 2 的幂对齐大小」的分配器拿到 size 0 时算出错误档位；这一类 bug 只在边界输入出现一次，日志里几乎查不到。",
      pit_en: "Memorising '(n & (n-1)) == 0 means power of two' and forgetting the 0 and negative cases: 0 passes the test, so an allocator that rounds a request up to a power of two computes the wrong bucket for size 0 — a bug that shows up once, at the edge, and barely leaves a trace in logs.",
      ex: {
        q: "为什么 `x & (x-1)` 消掉的是最低位的 1 而不是最高位？",
        a: "因为 x-1 只改动最低位的 1 及其以下的位（那个 1 变 0、下面的 0 全变 1），其上位保持不变；相与时其上照抄、被改动的那一段全为 0，所以恰好少一个 1。",
        q_en: "Why does x & (x-1) clear the lowest set bit rather than the highest?",
        a_en: "Because x-1 only touches the lowest set bit and the bits under it (that 1 becomes 0 and the zeros below become 1) while the high part is unchanged, so the AND copies the high part and zeroes the touched segment — exactly one 1 fewer."
      }
    },

    "b4": {
      min: 13,
      summary: [
        "状态压缩：用一个整数的第 i 位表示「第 i 个元素是否被选中」。5 道判断题的答案可以塞进一个 5 位整数、一张棋盘已占用的列可以塞进一个 int——n ≤ 63 时一个 `uint64_t` 就装得下整个集合，比较、传参、当 DP 下标都只花一条指令，还能塞进数组下标。",
        "掩码运算就是把集合运算翻译成位运算：并 `a | b`、交 `a & b`、差 `a & ~b`、判空交 `(a & b) != 0`、判包含 `(a & b) == b`、全集 `(1u << n) - 1`。",
        "全集掩码有个硬坑：`(1u << n) - 1` 只在 n < 32 时成立，n == 32 时移位数等于位宽是**未定义行为**；通用写法是 `n >= 32 ? ~0u : (~0u >> (32 - n))`（64 位同理），并且要先处理 n == 0。",
        "子集枚举 `for (unsigned s = mask; s; s = (s - 1) & mask)` 按严格递减顺序访问 mask 的**全部非空子集**，共 2^popcount(mask) - 1 次；要含空集就在循环外单独处理 s = 0。它的正确性来自「减一 + 与 mask」保证每一步仍是子集。",
        "为什么不能写 `s--`：那会访问到含 mask 中为 0 的位的组合（不是子集），既多做无用功又可能触发非法状态；`(s-1)&mask` 不重不漏，这也是它能进 DP 转移的原因。",
        "DP 里用压缩状态才是真正的用途：TSP、覆盖、互斥选择这类题把「已访问集合」当 dp 下标，复杂度 2^n · poly(n)，n 通常只能到 20 上下。为了「看起来高级」而压缩可写的业务标志位，是负收益。",
        "可读性有代价：位号散落在代码里，「第 5 位是什么」就变成考古题。把位号做成 `enum class Flag : uint32_t { Read = 1u << 0, ... }`，再包一层 `bool canWrite(uint32_t)`，业务层只见函数不见魔法数字。",
        "同类工具比较：`std::bitset<N>` 提供 count/any/all/test 且宽度写在类型里；`std::vector<bool>` 是特化的位压缩容器，`operator[]` 返回**代理对象**，写 `auto b = v[0]; b = true;` 根本改不到容器；多线程下多个线程逐位写同一个整数会互相覆盖，位域和原子操作要分开设计。"
      ],
      summary_en: [
        "State compression uses bit i of one integer as 'is element i selected'. Five true/false answers fit in a 5-bit integer, and the occupied columns of a board fit in an int — with n at most 63 a single uint64_t holds the whole set, so comparing, passing and indexing a DP by it cost one instruction each.",
        "Mask algebra is just set algebra in bits: union a | b, intersection a & b, difference a & ~b, disjointness (a & b) != 0, containment (a & b) == b, universe (1u << n) - 1.",
        "The universe mask has a hard edge: (1u << n) - 1 holds only for n < 32; at n == 32 the shift count equals the width, which is undefined behaviour. Write n >= 32 ? ~0u : (~0u >> (32 - n)) (same idea for 64 bits) and handle n == 0 first.",
        "Subset enumeration 'for (unsigned s = mask; s; s = (s - 1) & mask)' walks every non-empty subset of mask in strictly decreasing order, 2^popcount(mask) - 1 of them; handle s = 0 outside the loop if you need the empty set.",
        "Why not plain s--: that visits combinations containing bits mask does not have, so it does useless work and can reach illegal states. (s-1) & mask is both sound and complete, which is exactly why it fits inside a DP transition.",
        "DP over compressed states is where this pays: TSP, coverage and mutually exclusive choices index the table by 'visited set', costing 2^n * poly(n) with n typically up to about 20. Compressing ordinary business flags for style is negative value.",
        "Readability has a price: stray bit numbers turn 'what is bit 5?' into archaeology. Make the positions an 'enum class Flag : uint32_t { Read = 1u << 0, ... }' and wrap queries as canWrite(flags), so the business layer sees functions, not magic numbers.",
        "Neighbouring tools: std::bitset<N> offers count/any/all/test with the width in the type; std::vector<bool> is a specialised bit-packed container whose operator[] returns a proxy, so 'auto b = v[0]; b = true;' never touches the vector; concurrent single-bit writes to one integer clobber each other, so bit-fields and atomics need separate design."
      ],
      code: `#include <cstdint>
enum class Flag : uint32_t { Read = 1u << 0, Write = 1u << 1, Exec = 1u << 2 };
constexpr uint32_t bit(Flag f) { return static_cast<uint32_t>(f); }

// n 位全 1 的掩码：(1u << n) - 1 在 n 等于位宽时是未定义行为
constexpr uint32_t fullMask(int n) {
    if (n <= 0) return 0u;
    if (n >= 32) return ~0u;
    return ~0u >> (32 - n);
}

bool canWrite(uint32_t perm) { return (perm & bit(Flag::Write)) != 0; }

int main() {
    uint32_t perm = bit(Flag::Read) | bit(Flag::Write);
    bool writable = canWrite(perm);                 // 业务层只问「能不能写」
    const uint32_t all = fullMask(3);
    // 枚举 all 的全部非空子集：每一步仍是子集，且严格变小，不重不漏
    for (uint32_t s = all; s; s = (s - 1) & all) {
        if ((s & bit(Flag::Exec)) != 0) continue;   // 剪掉含 Exec 的组合
    }
    return writable ? static_cast<int>(all) : 0;
}`,
      pit: "把位标志当「一个整数随便改」用：多个线程各自 `flags |= bit` 或 `flags &= ~bit`。这两条都不是原子操作（读-改-写三步），于是一次置位会被另一次写覆盖，出现「明明设了却没生效」的偶发 bug；要么改用 `std::atomic` 的 `fetch_or/fetch_and`，要么把每个标志拆成独立变量。",
      pit_en: "Treating a flag word as freely mutable shared state, with several threads doing flags |= bit and flags &= ~bit. Neither is atomic (read-modify-write), so one set is lost under another and you get 'it was definitely set, yet did nothing' heisenbugs; use std::atomic fetch_or/fetch_and, or split the flags into separate variables.",
      ex: {
        q: "为什么枚举子集要写成 `s = (s-1) & mask`，直接 `s--` 不行吗？",
        a: "`s--` 会访问到含 mask 中为 0 的那些位的状态（不是 mask 的子集），既浪费又可能非法；`(s-1) & mask` 保证每一步仍是子集，并且严格递减，恰好走满 2^k 个组合。",
        q_en: "Why enumerate subsets with s = (s-1) & mask instead of a plain s--?",
        a_en: "s-- also visits combinations that use bits mask does not have, so they are not subsets — wasteful and possibly illegal; (s-1) & mask keeps every step a subset, strictly decreases, and covers exactly 2^k combinations."
      }
    },

    "b5": {
      title: "综合重构：把同一道答案用四条位技巧各写一遍",
      title_en: "Synthesis: One Answer, Four Bit Tricks",
      min: 15,
      target:  "能为同一个需求写出逐位扫描、消最低位、编译器内建、标准库四种实现，并说清各自的复杂度、可移植性与失效条件。",
      target_en: "Implement one requirement four ways — bit scan, clear-lowest-bit, compiler builtin, standard library — and state each one's complexity, portability and failure conditions.",
      summary: [
        "统一心智模型：所有位技巧只做三件事——把某位搬到看得见的位置（移位 + 掩码）、把某位翻转（异或）、把某位抹掉（`x & (x-1)`、`x & -x`）。把 b1~b4 归成这三句话，就不再需要背技巧。",
        "同一个需求四条实现对照（数以 1 的个数）：逐位 `(x >> i) & 1` 是 O(位宽)；`while (x) x &= x - 1` 是 O(popcount)；`__builtin_popcountll` 常编译成一条 popcnt；`std::bitset<64>(x).count()` 是标准且可移植的那一条。三者的**算法级**差别只在最坏输入下明显。",
        "写位代码的固定顺序：先定「位容器类型」（`uint32_t` / `uint64_t`，绝不用 int）、再定「位号 ↔ 语义」表（enum class + 一个取值函数）、最后才写表达式。顺序颠倒，就会写出没人敢改的魔法数字。",
        "边界自查四问：n 会不会等于位宽（`1u << n` 未定义行为）？x 会不会是 0（子集枚举、lowbit）？会不会是负数（2 的幂判断、右移、`-x` 对 INT_MIN 溢出）？移位数会不会为负？这四问覆盖了 sbw 九成事故。",
        "复杂度直觉：位技巧的真正收益是「一条指令处理 w 个元素」。判两个长度不超过 64 的字符集是否相交，`a & b` 一次搞定，而双层循环是 O(w²)——这也是 SIMD 思路的标量版，理解它才算真会用位运算。",
        "可读性红线：位运算只写在「协议格式、硬件寄存器、压缩状态」这三条边界上；业务层一律通过命名函数访问，`flags & 0x20` 要长成 `canWrite(flags)`。评审时看到裸的 `1 << k` 出现在业务文件里，就该要求封装。",
        "本章达标线（自查）：不看资料写出取/置/清、`x & (x-1)`、`x & -x`、子集枚举，并能说出「负数右移是实现定义（C++17）、移位数 ≥ 位宽是未定义行为」这两句区别。",
        "衔接：srec 递归与分治换成「调用栈」这件新工具。这里练出的「每一位都想清楚」的耐心，正是推递归边界与终止条件时最缺的东西。"
      ],
      summary_en: [
        "One mental model to rule them: every bit trick does just three jobs — move a bit somewhere visible (shift plus mask), flip a bit (XOR), or erase a bit (x & (x-1), x & -x). Reduce b1-b4 to those three sentences and there is nothing left to memorise.",
        "Four implementations of the same task (count the set bits): scanning (x >> i) & 1 is O(width); 'while (x) x &= x - 1' is O(popcount); __builtin_popcountll usually becomes one popcnt; std::bitset<64>(x).count() is the portable standard one. Only the algorithmic gap between them shows up on worst-case inputs.",
        "Fixed order for writing bit code: choose the container type first (uint32_t / uint64_t, never int), then the 'bit number to meaning' table (enum class plus an accessor), and only then the expressions. Reverse that order and you produce magic numbers nobody dares edit.",
        "Four boundary questions: can n reach the bit width (1u << n is undefined behaviour)? can x be 0 (subset enumeration, lowbit)? can it be negative (power-of-two tests, right shifts, negating INT_MIN)? can a shift count be negative? Those four cover most of sbw's accidents.",
        "Complexity instinct: what bit tricks really buy is 'one instruction handles w elements'. Testing whether two character sets of at most 64 letters intersect is one 'a & b', versus O(w2) nested loops — the scalar version of the SIMD idea, and the point where bit tricks stop being trivia.",
        "Readability red line: keep bit arithmetic at the three borders where it belongs — wire formats, hardware registers, compressed states. The business layer goes through named functions, so 'flags & 0x20' reads canWrite(flags). A bare '1 << k' in a business file deserves a review comment.",
        "Bar for this chapter (self-check): write get/set/clear, x & (x-1), x & -x and subset enumeration from memory, and state the difference between 'shifting a negative is implementation-defined in C++17' and 'a shift count of at least the width is undefined behaviour'.",
        "Bridge: srec recursion and divide-and-conquer swaps in a new tool, the call stack. The patience this chapter trains — reasoning about every single bit — is exactly what recursive base cases and boundary conditions demand."
      ],
      code: `#include <cstdint>
#include <iostream>
// 同一个问题「数 1 的个数」的三种写法，复杂度量级并不相同
int popcount_scan(uint64_t x) {          // 逐位取：O(位宽)
    int c = 0;
    for (int i = 0; i < 64; ++i) c += static_cast<int>((x >> i) & 1u);
    return c;
}
int popcount_clear(uint64_t x) {         // 消最低位：O(1 的个数)
    int c = 0;
    while (x) { x &= x - 1; ++c; }
    return c;
}
int main() {
    const uint64_t mask = (1ull << 40) | (1u << 3) | 1u;
    std::cout << popcount_scan(mask) << ' ' << popcount_clear(mask) << ' '
              << __builtin_popcountll(mask) << '\\n';
    // 自查两组边界：换成 0 三处都应是 0，换成 ~0ull 三处都应是 64
    return 0;
}`,
      pit: "在业务代码里到处写 `flags & 0x20`、`x |= 1 << k` 却不给位号命名：三个月后没人记得第 5 位是「只读」还是「隐藏」，于是既不敢删、也不敢复用，最后整段重写成枚举。位运算的收益是紧凑与快，成本是语义丢失，必须用命名把成本还回去。",
      pit_en: "Scattering 'flags & 0x20' and 'x |= 1 << k' through business code without naming the bits: three months later nobody recalls whether bit 5 means read-only or hidden, so nobody dares delete or reuse it, and the block is eventually rewritten as an enum. Bit tricks buy compactness and speed at the cost of meaning — naming gives that cost back.",
      ex: {
        q: "既然编译器多半能把这几种写法都优化成一条 popcnt，为什么还要学手写版本？",
        a: "因为那个优化依赖足够高的优化级别、干净的循环和没有别名；调试构建、循环里混着别的逻辑、或模板未被充分实例化时就只剩通用代码。更重要的是 `x &= x - 1` 把复杂度从 O(位宽) 降到 O(popcount)，那是算法级改进，不是指令级。",
        q_en: "If the compiler turns most of these into one popcnt anyway, why learn the hand-written versions?",
        a_en: "Because that recognition needs a high enough optimisation level, a clean loop and no aliasing; in debug builds, or with other logic inside the loop, you get the generic code back. And x &= x - 1 moves the cost from O(width) to O(popcount) — an algorithmic change, not an instruction-level one."
      }
    },

    /* ===================== srec 递归与分治 ===================== */
    "c1": {
      min: 12,
      summary: [
        "递归三要素：能触底的**终止条件**、每层规模**严格变小**、本层只做「一点活」再把剩下的交给下一层。缺第一条永不结束，缺第二条不收敛，缺第三条答案错。",
        "展开是「递」和「归」两趟：调用时压栈保存局部变量与返回地址（递），触底后逐层弹栈、把子答案合并回来（归）。把打印语句放在递归调用**前**或**后**，输出顺序完全不同——这就是前序与后序的全部区别，也是 tc2 四种遍历的地基。",
        "空间成本看栈深度，时间成本看调用总数：朴素 `fib(n)` 深度只有 O(n)，但调用数是 O(2^n)。「递归深度」和「递归次数」是两个维度，混为一谈就会错估爆栈风险。",
        "栈是有限的：常见默认栈 1~8 MB，一帧几十字节到上百字节（有局部数组的帧更大），量级上 10^4~10^5 层就开始危险，10^6 层必爆。遍历一条百万元素的链表用递归，是「用 O(1) 空间能做的事偏用 O(n)」。",
        "尾递归（函数的最后一个动作就是递归调用，返回后没有待做的合并）原则上可以优化成循环、栈深度 O(1)；但 C++ 标准只把「支持尾调用优化」写成**建议**，编译器经常不做（有析构函数、异常处理、调试构建时尤其不做）。所以不能靠 `[[clang::optnone]]` 之外的「尾递归」保证不爆栈，要稳就手写循环。",
        "递归转迭代的三个时机：深度可能上千、需要在遍历中途**提前退出或暂停**（迭代 + 显式栈可以随时 break）、以及每帧调用开销已经进了性能热点。转法有两种：自己用 `std::vector` 当栈（树的迭代遍历、手写 DFS），或者把状态写成变量 + `while` 循环。",
        "两类致命错误都是运行期才炸：终止条件写成 `<=` / `>=` 差一格（`n == 0` 到不了，或 n 为负时一路狂奔）、参数不单调变小（`f(n)` 里调用 `f(n)` 或 `f(n+1)`）；报的都是段错误，没有一行有意义的错误信息。",
        "衔接：sbw 教你「把一件事拆成位」，srec 教你「把一件事拆成同样规模更小的自己」。c2 把「一点活」放大成「分两半 + 合并」，合并的代价就决定复杂度。"
      ],
      summary_en: [
        "Three ingredients: a base case that can actually be reached, a size that strictly shrinks each level, and one small unit of work left for the current frame. Miss the first and it never ends, the second and it never converges, the third and the answer is wrong.",
        "A recursion runs twice: pushing frames with locals and return addresses on the way down, popping them and combining child answers on the way back up. Put the print before or after the recursive call and the order flips — that is the entire difference between pre- and post-order, and the ground under the four traversals in tc2.",
        "Space follows stack depth, time follows total call count: naive fib(n) is only O(n) deep but makes O(2^n) calls. Conflating 'how deep' with 'how many' is how people misjudge stack overflow.",
        "The stack is finite: 1-8 MB by default, a frame from tens to hundreds of bytes (more with local arrays), so roughly 10^4-10^5 levels already get risky and 10^6 is guaranteed to blow. Recursing over a million-node list spends O(n) space on something that needs O(1).",
        "Tail recursion (where the last action is the call itself, nothing left to combine) can in principle become a loop with O(1) stack — but the C++ standard only *recommends* tail-call optimisation, and compilers frequently decline it: destructors, exception handling, debug builds. So never rely on 'it is tail recursive' to avoid overflow; write the loop if it must hold.",
        "Three moments to convert recursion into iteration: depth may exceed a thousand, you need to exit or pause mid-traversal (an explicit stack can break any time), or per-frame call cost shows up in the profile. Two rewrites: keep your own std::vector as the stack (iterative tree traversal, hand-written DFS), or turn the state into variables inside a while loop.",
        "Both fatal mistakes surface only at run time: a base case off by one with <= or >= (n == 0 never reached, or a negative n running away), and a parameter that does not strictly shrink (f(n) calling f(n) or f(n+1)). Both report a segfault with no useful message.",
        "Bridge: sbw taught you to split a value into bits; srec splits a task into the same task, smaller. In c2 that 'unit of work' grows into 'halve it, then merge', and the merge cost is what decides the complexity."
      ],
      code: `#include <iostream>
void show(int n) {
    if (n <= 0) return;                            // 终止条件：规模缩到这里的出口
    std::cout << "down " << n << '\\n';             // 「递」路上做的事：前序位置
    show(n - 1);                                   // 参数严格变小，才会触底
    std::cout << "up " << n << '\\n';               // 「归」路上做的事：后序位置
}
int main() {
    show(3);
    // 栈深度就是帧数的上限：show(1000000) 会在触底之前段错误
    // 下面的 fact 不是尾递归：乘 n 发生在返回之后，帧必须留着
    // int fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }
    return 0;
}`,
      pit: "把「递归更简洁」当成无条件选择：在深度不可控的输入（一条 10^5 节点的单链、一个偏斜的树、迷宫搜索）上写递归遍历。栈溢出是**段错误**而不是可捕获的异常，而且往往在压测或线上才出现；深度不可控时要么显式改迭代，要么入口处加深度上限保护。",
      pit_en: "Treating 'recursion is cleaner' as unconditional, then writing recursive traversals over inputs whose depth you do not control (a 10^5-node list, a skewed tree, a maze search). Stack overflow is a segfault, not a catchable exception, and it tends to appear under load or in production; when depth is unbounded, switch to an explicit stack or guard the entry with a depth limit.",
      ex: {
        q: "为什么递归函数里 `cout` 写在递归调用前后，结果顺序正好相反？",
        a: "因为写在调用前是「递」的路上执行（此时外层先做），写在调用后是「归」的路上执行（此时最深处的帧最先返回、最先做完），后进先出的调用栈把顺序反转了过来。",
        q_en: "Why does putting the cout before versus after the recursive call reverse the output?",
        a_en: "Before the call runs on the way down, so outer frames act first; after the call runs on the way back up, so the deepest frame finishes first — the LIFO call stack reverses the order."
      }
    },

    "c2": {
      min: 13,
      summary: [
        "分治三步：分解（把规模 n 拆成 a 个规模 n/b 的子问题）、解决（足够小就直接算）、合并（把子答案拼成父答案）。能用它的前提是问题具有**最优子结构**且子问题彼此独立（互不重叠），复杂度写成 `T(n) = a·T(n/b) + f(n)`，f(n) 就是合并的代价。",
        "主定理的直觉只需一句话：比较「合并花的 f(n)」和「叶子层的总工作量 n^(log_b a)」。谁大取谁；两者同阶时乘一个 log——归并排序 a=2、b=2、f(n)=O(n)，`n^1` 与 `n` 同级，故 O(n log n)；二分查找 a=1、b=2、f(n)=O(1)，`n^0 = 1` 与 f 同级但要累 log 层，故 O(log n)。",
        "归并排序：分两半、各自排序、线性合并。它**稳定**（相等元素保持原序，靠的是合并时「相等取左边」）、最坏和最好都是 O(n log n)、代价是 O(n) 辅助数组——它用空间买断了「坏输入」。",
        "快速排序：选枢轴 + **原地划分**，平均 O(n log n)、常数小、缓存友好（顺序扫数组），所以是 `std::sort` 的主力；缺点是不稳定、最坏 O(n²)、且递归深度最坏可达 O(n)。",
        "最坏 O(n²) 是怎么来的：每次划分只切掉一个元素（输入已排序 + 固定取首元素当枢轴），递归深度退化成 n、总比较 n²/2。三数取中（首、中、尾取中位数）或随机枢轴，把「能被构造的坏输入」变成「几乎不可能」；工程实现还会在小区间切回插入排序、并用三路划分处理大量重复元素。",
        "稳定性与原地性是这对难兄难弟的分水岭：快排的交换会打乱相等元素的相对顺序，所以不稳定；需要稳定就用归并（`std::stable_sort`，归并 + 插入的混合，辅助内存不足时退化为堆排序）。「排序是否稳定」在有附加信息的业务排序里是需求，不是细节。",
        "分治 ≠ 递归，也 ≠ 所有「拆子问题」：分治要求子问题**互不相交**；子问题重叠时（如斐波那契）分治式递归会重复计算，正确做法是记忆化（c4）或自底向上 DP（sdp）。判断「重叠还是不重叠」比背算法分类有用得多。",
        "衔接：c3 回溯把「分成几份」换成「每个位置试所有候选」，是分治的穷举极限；合并这一步被换成了「记录答案 + 剪枝」。"
      ],
      summary_en: [
        "Three steps: divide (turn size n into a subproblems of size n/b), conquer (solve directly once small enough), combine (stitch child answers into the parent's). It applies when the problem has optimal substructure and the subproblems are independent, and its cost satisfies T(n) = a*T(n/b) + f(n), where f(n) is exactly the merge cost.",
        "The master theorem needs one sentence: compare the merge cost f(n) with the total leaf work n^(log_b a). Take whichever dominates; on a tie, multiply by a log. Merge sort has a=2, b=2, f(n)=O(n), so n^1 ties with f and gives O(n log n); binary search has a=1, b=2, f(n)=O(1), and the tied levels accumulate into O(log n).",
        "Merge sort: halve, sort each half, merge in linear time. It is stable (equal keys keep their original order, thanks to 'take the left one when equal'), O(n log n) in the worst and best case alike, and costs an O(n) scratch array — space buys immunity to bad inputs.",
        "Quicksort: pick a pivot and partition in place. Average O(n log n) with small constants and good cache behaviour (it scans the array linearly), which is why it drives std::sort; it is unstable, can hit O(n2) worst case, and its recursion can reach depth n.",
        "Where O(n2) comes from: each partition peels off only one element (sorted input plus a fixed first-element pivot), so depth becomes n and comparisons n2/2. Median-of-three (first, middle, last) or a random pivot turns 'an input you can craft' into 'an input you almost never see'; production implementations also fall back to insertion sort on short ranges and use three-way partitioning when keys repeat.",
        "Stability versus in-place is the real fork between them: quicksort's swaps destroy the relative order of equal keys, so it is unstable; use merge when order must be preserved (std::stable_sort, a merge/insertion hybrid that degrades to heap sort when scratch memory is unavailable). Whether a sort is stable is a requirement in business code that carries side information, not a footnote.",
        "Divide-and-conquer is not recursion, and not every subproblem split: it requires the subproblems to be disjoint. When they overlap (Fibonacci), a divide-and-conquer recursion recomputes them, and the right tool becomes memoisation (c4) or bottom-up DP (sdp). Spotting 'overlapping or not' beats memorising algorithm taxonomies.",
        "Bridge: c3 backtracking replaces 'split into parts' with 'try every candidate at this position' — the exhaustive limit of divide-and-conquer — where the merge step becomes 'record an answer and prune'."
      ],
      code: `#include <vector>
void merge(std::vector<int>& a, std::vector<int>& t, int l, int m, int r) {
    int i = l, j = m, k = l;
    // 两半都还有候选时取较小的：相等取左边，这一句就是「稳定」的全部来源
    while (i < m && j < r) t[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    while (i < m) t[k++] = a[i++];
    while (j < r) t[k++] = a[j++];
    for (int p = l; p < r; ++p) a[p] = t[p];
}
void sortRange(std::vector<int>& a, std::vector<int>& t, int l, int r) {
    if (r - l <= 1) return;              // 空区间或单元素：天然有序，这就是基例
    int m = l + (r - l) / 2;             // 这样写才不会在 l + r 很大时溢出
    sortRange(a, t, l, m);
    sortRange(a, t, m, r);
    merge(a, t, l, m, r);                // 合并是 O(n)：复杂度主要落在这一步
}
int main() {
    std::vector<int> a{5, 2, 9, 1}, t(a.size());
    sortRange(a, t, 0, static_cast<int>(a.size()));
    return a[0];
}`,
      pit: "在需要稳定排序的场合用快排（或直接用 `std::sort`）：先按主键排好、再按次要条件排一次，指望「第二次排序保住第一次的结果」——快排不保证相等键保持原序，第二次排完主键顺序就乱了。有这种「多关键字」需求时要么一次比较多个字段，要么换 `std::stable_sort`。",
      pit_en: "Reaching for quicksort (or std::sort) where stability matters: sorting by the primary key, then again by a secondary condition, expecting the second pass to preserve the first. Quicksort makes no such promise, so equal keys scramble and the primary order is lost. Either compare all keys in one predicate, or switch to std::stable_sort.",
      ex: {
        q: "为什么归并排序最坏仍是 O(n log n)，而快排会退化成 O(n²)？",
        a: "归并的分解与数据内容无关（永远对半分），所以递归树一定是 log n 层、每层总工作量 O(n)；快排的划分质量取决于枢轴，最坏时每层只减少一个元素，层数变成 n、总比较 n²/2。",
        q_en: "Why does merge sort stay O(n log n) in the worst case while quicksort can decay to O(n2)?",
        a_en: "Merge's split is content-independent (always in half), so the recursion tree is log n levels with O(n) work per level; quicksort's split depends on the pivot, and in the worst case each level removes only one element, giving n levels and n2/2 comparisons."
      }
    },

    "c3": {
      min: 13,
      summary: [
        "回溯 = 在递归树上做深度优先搜索，走不通就退回上一层换分支。模板三段式：**选择 → 递归 → 撤销**（make / recurse / unmake），撤销必须与选择严格对称，包括计数器、标记数组、当前得分这些「看不见的状态」。",
        "忘撤销是回溯第一大 bug。它的表现很阴险：不是崩溃，而是「解变多、变重复、偶发正确」——只有一处状态没还原时，前面的分支会污染后面的分支，测试数据稍不留神就全对。",
        "剪枝分三层：可行性剪枝（当前状态已经非法就直接返回）、最优性剪枝（上界估计不如现有解就返回，如分支限界）、去重剪枝（同一层不重复试同一个值，如 `if (i > start && s[i] == s[i-1]) continue;`）。三者都成立才是「剪枝搜索」而不是「暴力搜索」。",
        "排序常常是质变的前置：去重要求同层元素有序（才能「和前一个比」）；「剩下全部加起来也不够」这类上界剪枝也依赖有序。先排序再搜，往往从跑不动变成毫秒级。",
        "复杂度按递归树算，不按代码行数算：全排列 O(n·n!)（n! 个叶子，每个拷贝 O(n)）、子集 O(2^n·n)、N 皇后与数独的解空间远小于 n! 或 9^81，因为列与两条对角线（数独里是行、列、宫三重约束）已经把大部分分支剪掉——但**上界仍是指数**，所以 n 一般不超过 15~20。",
        "回溯与 DP 的分界很清楚：要**枚举出所有解**（所有路径、所有方案、所有组合）、或带「选过不能再选」的组合约束 → 回溯；只要一个最优值且子问题重叠 → DP。反过来，「数一下有多少种方案」既可能 DP 也可能回溯，看清是「计数」还是「列举」。",
        "状态传递有两种风格：把 `path` 按值传给下一层，就不用手工撤销（代价是每层一次拷贝，O(n²) 变 O(n³) 的风险）；按引用 + 显式 `pop_back` 省时间但要求严格配对。选哪种要能主动说出理由。",
        "衔接：c4 处理「同一个子问题被算了两次」；回溯里同样可以给 DFS 加记忆化（把 `(位置, 剩余预算)` 当键），但要小心：一旦路径状态参与答案，记忆化就失效。"
      ],
      summary_en: [
        "Backtracking is depth-first search over a recursion tree: walk a branch, retreat to the previous level and take another. The template has three parts — choose, recurse, undo — and the undo must mirror the choose exactly, including counters, used-markers and the running score, those 'invisible' states.",
        "Forgetting the undo is backtracking's number-one bug, and its symptom is nasty: not a crash but 'more answers, duplicated answers, occasionally right'. A single un-restored piece of state lets one branch contaminate the next, and casual test data often misses it entirely.",
        "Pruning has three layers: feasibility (the current state is already illegal, return), optimality (an upper bound cannot beat the incumbent, return) and deduplication (do not retry the same value at one level, e.g. 'if (i > start && s[i] == s[i-1]) continue;'). Only when all three work is it a pruned search rather than brute force.",
        "Sorting is often what makes it click: deduplication needs the siblings ordered so you can compare with the previous one, and 'even taking everything left is not enough' bounds need order too. Sorting first can move a run from never-finishing to milliseconds.",
        "Count complexity on the recursion tree, not on lines of code: permutations are O(n*n!) (n! leaves, each copying O(n)), subsets O(2^n*n), and N-Queens or Sudoku explore far less than n! or 9^81 because columns and the two diagonals (rows, columns and boxes for Sudoku) cut most branches early — yet the bound is still exponential, which is why n stays around 15-20.",
        "The boundary with DP is clean: enumerate all solutions (all paths, all combinations) or carry 'used once' constraints, and backtracking is right; want a single optimum over overlapping subproblems, and DP is right. 'Count the number of ways' can go either way — check whether you must list them or only count them.",
        "Two styles of passing state: hand path by value to the next level and no manual undo is needed, at the price of one copy per level (risking O(n2) sliding into O(n3)); pass by reference with an explicit pop_back to save time, but the pairing must be exact. Pick one and say why.",
        "Bridge: c4 removes 'the same subproblem computed twice'. Backtracking can memoise a DFS too, keyed on (position, remaining budget), but care: as soon as the path itself contributes to the answer, memoisation becomes invalid."
      ],
      code: `#include <algorithm>
#include <cstddef>
#include <string>
#include <vector>
// 子集（元素可重复）：每层从 start 往后挑，回来就撤销
void dfs(const std::string& s, int start, std::string& path, std::vector<std::string>& out) {
    out.push_back(path);                                   // 每个节点都是一个解，不只是叶子
    for (int i = start; i < static_cast<int>(s.size()); ++i) {
        if (i > start && s[i] == s[i - 1]) continue;       // 同层去重：前提是已经排序
        path.push_back(s[i]);                              // 选择
        dfs(s, i + 1, path, out);                          // 递归到下一层
        path.pop_back();                                   // 撤销：漏这一行就会多出大量重复解
    }
}
int main() {
    std::string s = "aab";
    std::sort(s.begin(), s.end());
    std::string path;
    std::vector<std::string> out;
    dfs(s, 0, path, out);
    return static_cast<int>(out.size());                   // 6 个子集，含空集
}`,
      pit: "只撤销「看得见」的状态：`path.pop_back()` 写了，却忘了还原 `used[i]`、`currentSum`、`board[x][y]` 这类标记。结果是小样本可能全对、样本一大就冒出重复解或漏解，而代码看上去三行都不长——最难查的一类 bug，靠的是**把选择与撤销写在同一对花括号里**的习惯来防。",
      pit_en: "Undoing only the visible state: path.pop_back() is there but used[i], currentSum or board[x][y] is left behind. Small inputs pass, larger ones yield duplicate or missing solutions, and the function is six lines long — the hardest kind of bug. The defence is the habit of keeping choose and undo in the same pair of braces.",
      ex: {
        q: "为什么「把 path 按值传给下一层」能少写一半代码，却不推荐用在排列题上？",
        a: "按值传递让每层各拷一份路径，撤销自然消失，但每层 O(n) 拷贝会把总代价从 O(n·n!) 抬到 O(n²·n!)；而且答案本身要落地时，拷贝出来的中间 vector 还带来堆分配，实测常慢好几倍。",
        q_en: "Passing path by value deletes half the bookkeeping — why not use it for permutations?",
        a_en: "Because each level copies the whole path: the undo disappears, but O(n) copying per level lifts the total from O(n*n!) to O(n2*n!), and those intermediate vectors add heap allocations that are measurably several times slower."
      }
    },

    "c4": {
      min: 12,
      summary: [
        "记忆化能生效有两个前提：函数是**纯的**（同参数必得同结果，不依赖外部可变状态），且子问题**重叠**。斐波那契、区间 DP、走格子符合；「递归求数组长度」这类不重叠的递归加缓存纯属负担。",
        "实现三件套：可编码的**键**（参数或它们的组合）、**容器**（下标数组 > `unordered_map` > `map`，性能与灵活依次变化）、**哨兵值**（表示「还没算过」的标记）。三件都选对才叫记忆化，只写个 map 不叫。",
        "哨兵是最容易错的一件：结果本身可能等于哨兵。`fib(0) == 0`，用 0 当「未计算」标记 → 每次都要重算 0 这条分支；用 -1 当哨兵的前提是「答案恒非负」，一旦题目允许负数答案，就得改 `std::optional`、或另开一张 `visited` 位图（还能顺便用 b4 的状态压缩）。",
        "记忆化与 DP 的关系是**同一张表的两种填法**：记忆化自顶向下、只算被问到的格子（状态稀疏时更省），DP 自底向上、按顺序填满（可控、无递归、便于滚动数组压缩）。两者可以机械互转，结果等价。",
        "记忆化省不掉「重复的准备工作」：如果每层都拷贝一个 vector、传一个 string、或重新排序一次，那是**参数传递**造成的常数放大，缓存命中也救不了；要改成传引用 + 下标区间。别把常数问题当成复杂度问题。",
        "记忆化挡不住爆栈：链式递归 `solve(i)` 深度到 10^5 时，即使每个子问题只算一次，栈也照样溢出。此时必须改自底向上，或者自己用显式栈。这也是「能写填表就别写递归」的现实理由。",
        "缓存容器的选择就是性能：能压成整数下标就用 `vector`（顺序访问、缓存友好）；参数是二维就用一维数组下标 `i * n + j`；只有状态真的稀疏（如字符串集合、可达点很少）才上 `unordered_map`，它通常比数组慢一个数量级；字符串键更是要避免。",
        "衔接：c5 把 c1~c4 四条线（递归、分治、回溯、记忆化）合到同一条题上，并给出「该用哪一条」的判定表。"
      ],
      summary_en: [
        "Memoisation needs two conditions: the function is pure (same arguments, same result, no dependence on mutable outside state) and the subproblems overlap. Fibonacci, interval DP and grid walks qualify; 'recursion to compute an array length' has nothing to reuse, so a cache is pure overhead.",
        "Three parts to get right: an encodable key (the arguments or a code of them), a container (indexed vector, then unordered_map, then map — trading speed against flexibility), and a sentinel meaning 'not computed yet'. All three, or it is not memoisation.",
        "The sentinel is where people slip: the answer itself may equal it. fib(0) == 0, so using 0 as 'not computed' recomputes that branch forever; using -1 is safe only when answers are non-negative, and once negatives are legal you need std::optional or a separate visited bitmap (which is also a nice use for b4's bit compression).",
        "Memoisation and DP fill the same table two ways: memoisation goes top-down and touches only the cells asked about (cheaper when states are sparse), DP goes bottom-up and fills in order (controllable, no recursion, easy to compress with a rolling array). The conversion is mechanical and the results are identical.",
        "What memoisation cannot remove is repeated *preparation*: copying a vector per level, passing a string by value, re-sorting inside the recursion — that is constant-factor waste from parameter passing and survives every cache hit. Switch to references plus index ranges. Do not mistake a constant for a complexity.",
        "Memoisation does not prevent stack overflow: a chain recursion solve(i) 10^5 levels deep blows the stack even if each subproblem is solved once. Then bottom-up or an explicit stack is mandatory — a practical reason to prefer filling tables when you can.",
        "Choosing the cache container is choosing the performance: an integer index means a vector (sequential, cache-friendly); two dimensions flatten to i * n + j; only genuinely sparse states deserve an unordered_map, typically an order of magnitude slower than an array, and string keys are worse still.",
        "Bridge: c5 puts c1-c4 — plain recursion, divide-and-conquer, backtracking, memoisation — on one problem, with a decision table for which line to take."
      ],
      code: `#include <vector>
// 记忆化三件套：纯函数、可编码的键、一个「没算过」的哨兵值
long long fib(int n, std::vector<long long>& memo) {
    if (n < 2) return n;                          // 基例：0 和 1
    long long& slot = memo[n];                    // 拿引用写回，省掉一次拷贝
    if (slot != -1) return slot;                  // 命中缓存
    long long a = fib(n - 1, memo);
    long long b = fib(n - 2, memo);
    // 斐波那契恒非负，所以 -1 才配当哨兵；换成有负答案的题要另开 visited 表
    slot = a + b;
    return slot;
}
int main() {
    std::vector<long long> memo(95, -1);
    return static_cast<int>(fib(90, memo));        // 90 层递归还在栈深度范围内
}`,
      pit: "用 `0` 当「未计算」哨兵而题目答案可能就是 0（或方案数为 0）：于是这些格子永远被当成没算过，指数级分支一条不漏地重算，程序慢得像没加记忆化——但代码看着完全正确。要么换成哨兵值不可能出现的标记，要么多开一张 `visited` 数组。",
      pit_en: "Using 0 as the 'not computed' sentinel in a problem whose answer may itself be 0 (or whose way-count is 0): those cells are then forever treated as fresh and every exponential branch is recomputed, so the program crawls as though there were no cache at all while the code looks perfectly right. Use a value the answer can never take, or add a visited array.",
      ex: {
        q: "什么情况下宁可用记忆化递归而不用自底向上填表？",
        a: "状态空间很大但实际可达的格子很少（只查询单个目标、或图很稀疏）时，记忆化天然只算被问到的部分，省时间也省空间；需要整张表、要支持多次查询、或怕递归深度爆栈时，就该填表。",
        q_en: "When should you keep the memoised recursion instead of filling a table bottom-up?",
        a_en: "When the state space is huge but few cells are actually reachable — a single queried target, a sparse graph — memoisation computes only what is asked, saving both time and space. Need the whole table, answer many queries, or fear the depth, and filling the table wins."
      }
    },

    "c5": {
      title: "综合重构：递归 → 分治 → 记忆化 → 填表的四档阶梯",
      title_en: "Synthesis: Recursion, Divide, Memoise, Fill — Four Rungs",
      min: 15,
      target:  "拿到一道新题能用四步判定法选出实现方式，把同一道题写成四档实现，并说清每一档省掉了什么、代价是什么。",
      target_en: "For a new problem, pick an approach with a four-step test, write it in all four forms, and state what each rung eliminates and what it costs.",
      summary: [
        "四步判定法：能不能拆成规模更小的自己（是 → 递归）？子问题是否重叠（重叠 → 记忆化或 DP；不重叠 → 分治，如归并）？要不要**列出所有解**（要 → 回溯）？深度是否可能上千（会 → 改迭代或显式栈）。四问走完，实现方式已经唯一确定。",
        "一条题走完四档（斐波那契）：朴素递归 O(2^n) 时间 O(n) 栈 → 记忆化 O(n) 时间 O(n) 表 → 自底向上填表（去掉递归开销，顺序访问缓存友好）→ 滚动变量 O(1) 空间。每一档都要能一句话答「我省掉了什么」：重复计算 → 函数调用 → 大部分空间。",
        "递归通用自检三问：终止条件会不会被越过？规模参数是否**严格**变小？「归」的那一步有没有把子答案合并对？第三问最常被忽略——分治的复杂度与正确性几乎都押在合并上（c2 的归并合并是 O(n)，回溯的合并是「记录答案」）。",
        "复杂度速查与主定理直觉：合并比叶子贵就取 f(n)，同阶就乘 log，叶子更贵就取 n^(log_b a)。配合数据规模看：n ≤ 5000 才敢 O(n²)，n 到 10^5~10^6 就要 O(n log n) 或 O(n)，n ≤ 20 才允许 2^n 的搜索。",
        "边界与栈的固定动作：入口第一件事判空/判 0；参数类型要想清——用 `std::size_t` 时「减到 0 再减」会绕回天文数字，递归永远触不了底；深度不可控时加一句 `if (depth > LIMIT) return;` 或断言，把玄学段错误变成可解释的错误。",
        "本章翻车点复盘（背下来不丢人）：忘写终止条件 / 终止条件差一格 / 忘撤销选择 / 哨兵值撞上合法答案 / 快排遇有序输入退化 / 递归深度炸栈 / 记忆化表少开一位 / 把「拷贝参数」的常数当成复杂度问题。",
        "本章达标线（自查）：不看资料写出归并的合并、回溯的三段式、记忆化的 fib，并说出「分治要求子问题不重叠，重叠就上记忆化」这一句判定。",
        "衔接：sdp 动态规划就是这条阶梯的最后一档——把记忆化改写成自底向上填表，再追问「遍历顺序、边界、空间压缩」。c4/c5 走完，DP 只是把它规范化。"
      ],
      summary_en: [
        "The four-step test: can it be split into a smaller copy of itself (yes → recursion)? do the subproblems overlap (overlap → memoisation or DP; disjoint → divide-and-conquer, as in merge)? must you list every solution (then backtracking)? might the depth exceed a thousand (then iterate or keep an explicit stack)? Run the four questions and the implementation form is already decided.",
        "One problem, four rungs (Fibonacci): naive recursion O(2^n) time with O(n) stack → memoised O(n) time and O(n) table → bottom-up table (no call overhead, sequential cache-friendly access) → rolling variables in O(1) space. For each rung answer in one sentence what it eliminated: repeated work, then function calls, then most of the space.",
        "Three universal recursion questions: can the base case be stepped over? does the size strictly shrink? is the way-back combination of child answers right? The third slips most often — a divide-and-conquer's correctness and complexity both ride on the merge (merge sort's merge is O(n); backtracking's merge is 'record this answer').",
        "Complexity lookup plus master-theorem instinct: merge dearer than leaves means take f(n); a tie means multiply by log; leaves dearer means take n^(log_b a). Cross-check against input size: O(n2) is only brave below about 5000, 10^5-10^6 needs O(n log n) or O(n), and 2^n searches cap out near n = 20.",
        "Standing boundaries and stack habits: check for empty or zero at the entry first; think through the parameter type — with std::size_t, decrementing past zero wraps to an astronomical number and the recursion never bottoms out; when depth is unbounded add 'if (depth > LIMIT) return;' or an assertion, turning a mystical segfault into an explainable failure.",
        "This chapter's failure retrospective (memorising it is not shameful): no base case, base case off by one, missing undo, a sentinel that collides with a legal answer, quicksort degenerating on sorted input, stack overflow from depth, a memo table one cell too short, and mistaking parameter-copy constants for complexity.",
        "Bar for this chapter (self-check): write merge's combine step, the three-part backtracking loop and memoised fib without reference material, and state the rule 'divide-and-conquer needs disjoint subproblems; when they overlap, memoise'.",
        "Bridge: sdp dynamic programming is the last rung of this ladder — rewrite memoisation as a bottom-up table and then interrogate traversal order, initialisation and space compression. Finish c4/c5 and DP is merely the disciplined version."
      ],
      code: `#include <iostream>
#include <vector>
// 把同一个 fib 走完四档：指数递归 -> 记忆化 -> 自底向上 -> 滚动变量
long long naive(int n) { return n < 2 ? n : naive(n - 1) + naive(n - 2); }
long long bottomUp(int n) {
    if (n < 2) return n;
    std::vector<long long> dp(n + 1);              // 表长最容易少开一位：这里必须是 n + 1
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; ++i) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}
long long rolling(int n) {
    long long a = 0, b = 1;
    for (int i = 0; i < n; ++i) { long long c = a + b; a = b; b = c; }
    return a;                                      // 只留上一格：空间 O(1)，代价是没法反推路径
}
int main() {
    for (int n = 0; n <= 24; n += 8)
        std::cout << n << ' ' << naive(n) << ' ' << bottomUp(n) << ' ' << rolling(n) << '\\n';
    // 三档结果必须完全一致，不一致就说明某处基例或遍历顺序写错了
    return 0;
}`,
      pit: "写完递归就直接交，从不问「这层递归有多深」：n = 10^5 的线性递归在本地小样本上表现完美，提交或上线后段错误，且因为栈溢出通常不带栈回溯，排查成本极高。深度与输入规模挂钩时，先把递归改成填表或用显式栈，再谈优化。",
      pit_en: "Shipping a recursion without ever asking how deep it goes: linear recursion over 10^5 elements looks flawless on a local sample, then segfaults on submission or in production — and stack overflow rarely comes with a usable backtrace, so diagnosis is expensive. When depth tracks input size, move to a table or an explicit stack before optimising anything else.",
      ex: {
        q: "四档实现的结果应当完全一致，如果不一致，最可能错在哪两处？",
        a: "一是基例（记忆化与填表的 dp[0]/dp[1] 和递归的 `n < 2` 必须同一套约定，常见的是「台阶从 0 还是 1 数」不一致）；二是循环边界（填表写成 `i < n` 少算一格，或表长开成 n 导致越界读到脏值）。",
        q_en: "All four rungs should agree; when they do not, which two places are wrong most often?",
        a_en: "First the base cases: memo, table and the recursion's 'n < 2' must share one convention, and they usually disagree about whether stairs are numbered from 0 or 1. Second the loop bounds: 'i < n' instead of 'i <= n' skips a cell, and sizing the table to n instead of n + 1 reads past the end."
      }
    },

    /* ===================== sdp 动态规划入门 ===================== */
    "e1": {
      min: 12,
      summary: [
        "DP 适用的两个前提：**最优子结构**（大问题的最优解由子问题的最优解拼成）与**无后效性**（状态一旦确定，它「怎么来的」不再影响将来怎么转移）。前提不成立时 DP 不会报错，只会安静地给出错误答案——这是它比编译错误难查得多的原因。",
        "演化三步是最可靠的解题路线：先把朴素递归写出来（把题意直译成代码）→ 加记忆化（去掉重复子问题）→ 改写成自底向上填表（去掉递归）。每一步只是删掉一类浪费，**思路从头到尾没有变**，而三段的总账都是那句老话——DP 的本质是**用空间换时间**，把算过的子问题答案存起来不再重算。所以「想不出 DP」的正确说法是「还没写出递归」。",
        "记忆化与填表**等价但各有便宜**：状态稀疏、只问一个目标时记忆化只算被问到的格子；填表没有函数调用与哈希开销、顺序访问缓存友好、还能滚动数组压空间、更不会爆栈。同一个 DP 两种写法常差 2~5 倍。",
        "填表更快有三个具体来源：函数调用与返回地址的开销、数组顺序访问的缓存命中（记忆化访问顺序由递归决定）、以及内层循环能被向量化；再加上「命中缓存」若走 `unordered_map` 就是一次哈希，三项叠加足以差出量级。",
        "无后效性怎么检查：如果发现转移还需要「前面选了几次 / 上一个是谁 / 是否用过某个特权」，说明状态**太瘦**，要把这段历史塞成额外维度。典型例子是「不能选相邻元素」要加「上一个选没选」这一维，「最多一次交换」要把「用过没有」加进下标。",
        "先估复杂度再动手：**状态数 × 转移代价**。10^7 舒适、10^8 紧张、10^9 一定挂。乘出来超标，通常意味着状态定义太胖（该换定义）或该题根本不是 DP（该上贪心、二分答案或搜索）。",
        "最常见的误用是把 DP 当题型来背：模板套上去，题目一变形（环形、要「恰好」、带额外约束）就无从下手。能先写递归再优化，才是可迁移的能力——这也正是本章反复从递归出发 reasons 的原因。",
        "衔接：本章直接继承 srec c4 的记忆化——e1 做的事就是把那层递归改写成填表；e2 再正面回答「状态到底怎么定义」，以及转移方程是怎么**推**出来而不是猜出来的。"
      ],
      summary_en: [
        "Two preconditions make DP valid: optimal substructure (the best answer is stitched from best answers of subproblems) and the Markov property (once the state is fixed, how you got there no longer affects how you leave it). When these fail, DP raises no error — it just quietly returns a wrong answer, which is why it is harder to find than a compile error.",
        "The three-step evolution is the most reliable road: write naive recursion first (a literal transcription of the statement), add memoisation (delete repeated subproblems), rewrite as a bottom-up table (delete the recursion). Each rung only removes one kind of waste and the idea never changes, and the whole ledger is the old one-liner: DP trades space for time by keeping subproblem answers instead of recomputing them. So 'I cannot see the DP' really means 'I have not written the recursion yet'.",
        "Memoisation and table-filling are equivalent but differently cheap: with sparse states and one queried target, memo touches only the cells asked about; a table pays no call or hash cost, accesses memory sequentially, allows a rolling array, and cannot overflow the stack. Two and five times apart is routine.",
        "The table's speed has three concrete sources: call/return overhead, cache hits from sequential access (memo's order is set by the recursion), and inner loops short enough to vectorise; add that a cache hit through unordered_map is a hash lookup, and the three stack up into an order of magnitude.",
        "How to test the Markov property: if a transition still needs 'how many did I take so far', 'who was last', or 'did I spend the special privilege', the state is too thin — promote that history into an extra dimension. Classic cases: 'no two adjacent' needs a 'did the previous one get taken' bit; 'at most one swap' needs a used-or-not index.",
        "Estimate cost before coding: states times transition cost. 10^7 is comfortable, 10^8 is tight, 10^9 is dead. Blowing the budget usually means the state definition is too fat (change it) or the problem is not DP at all (greedy, binary-search the answer, or search).",
        "The dominant misuse is treating DP as a catalogue of problem types: the template fits until the statement bends (a ring, 'exactly', an extra constraint), and then there is nowhere to go. Writing recursion first and optimising is the transferable skill — the reason this chapter keeps starting there.",
        "Bridge: this chapter inherits srec c4's memoisation directly — e1 is nothing but rewriting that recursion as a filled table; e2 then faces the real question of how a state is defined and how a transition is derived rather than guessed."
      ],
      code: `#include <iostream>
#include <vector>
// 同一条递推的三种形态：朴素递归 -> 记忆化 -> 自底向上填表
long long rec(int i) { return i <= 2 ? i : rec(i - 1) + rec(i - 2); }
long long climbMemo(int i, std::vector<long long>& m) {
    if (i <= 2) return i;
    if (m[i] != 0) return m[i];                    // 这里 0 恰好不是合法答案，才配当哨兵
    return m[i] = climbMemo(i - 1, m) + climbMemo(i - 2, m);
}
long long climbTable(int n) {
    if (n <= 2) return n;
    std::vector<long long> dp(n + 1);
    dp[1] = 1; dp[2] = 2;                          // 边界来自题意，不是抄来的
    for (int i = 3; i <= n; ++i) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}
int main() {
    std::vector<long long> m(41, 0);
    std::cout << climbMemo(40, m) << ' ' << climbTable(40) << ' ' << rec(20) << '\\n';
    // 前两列必须相等；rec 只敢算到 20，再大就是指数爆炸
    return 0;
}`,
      pit: "「想不出 DP 就先去背相似题」：跳过写递归这一步，直接抄一个二维转移式往题目上套。状态定义与题意错位时，样例可能刚好对上几个，交上去在别的规模上错——而且因为程序不崩溃、只给错值，你很难怀疑到「状态定义」这一层。永远从朴素递归开始。",
      pit_en: "Skipping the recursion and memorising look-alike problems instead: you copy a two-dimensional transition onto a statement whose shape differs. A few samples may pass by luck, others fail at other sizes, and since the program returns a wrong number without crashing, the state definition is the last thing you suspect. Always start from the naive recursion.",
      ex: {
        q: "为什么「无后效性」不成立时 DP 不报错，只给错答案？",
        a: "因为填表只是按你写的转移递推，程序没有能力判断「这个状态是否真的包含了未来需要的所有信息」；状态漏掉的历史维度会以「答案偏优或偏劣」的形式出现，而不是越界或异常。",
        q_en: "Why does DP return a wrong value rather than an error when the Markov property fails?",
        a_en: "Filling a table just applies the recurrence you wrote; nothing checks whether the state actually carries all the information the future needs. The history you dropped shows up as an answer that is too good or too poor, never as an out-of-bounds or an exception."
      }
    },

    "e2": {
      min: 13,
      summary: [
        "状态定义三要素，缺一个就别开始写循环：**含义**（`dp[i]` 到底表示什么，是「前 i 个的答案」还是「以 i 结尾的答案」）、**边界**（哪些最小情形先填死）、**答案位置**（返回 `dp[n]`、`max dp[i]` 还是 `dp[n][W]`）。",
        "「前 i 个」与「以 i 结尾」是两套定义，不是两种口味：爬楼梯、方案数用前者（可累加）；LIS、最大子段和必须用后者——因为只有「以 i 收尾」才知道最后一个元素是谁，才能接着往后转移。定义选错，症状就是「转移方程写不出来」。",
        "推导转移方程的固定路径是**考虑最后一个决策**：最优解里最后一步做了什么？把所有可能按这个决策分成若干**互斥**类，每类都表达成「子问题答案 + 本类代价」，合起来就是转移方程。写不出方程，多半是没问清「最后一步有几种可能」。",
        "分类必须不重不漏：漏一类会让答案偏优或偏劣但绝不报错（最难查）；重一类在「求最值」里无害（max 幂等），但在**求方案数**里会重复计数、答案直接算大。方案数类题要用「这个状态被计了几次」逐格自查。",
        "遍历顺序由**依赖方向**决定：`dp[i]` 依赖 `dp[i-1]`、`dp[i-2]` → i 从小到大；区间 DP 依赖更短的区间 → 按区间长度从小到大枚举；依赖右侧或下侧（如从右下往左上的网格） → 逆序。顺序错的典型症状是「读到还没算的格子」，即用到全 0 的初值。",
        "初始化要区分「不可能」与「值为 0」：求最大值的 DP，不可达状态必须填 `-INF`（而且每次加法前先判可达，否则 `-INF + v` 溢出成一个巨大负数，反被当成合法答案）；求方案数则 `dp[0] = 1`（「什么都不选」也算一种方案），不是 0。这两个初值是 DP 事故高发区。",
        "答案往往不是最后一个格子：LIS 取 `max dp[i]`；「恰好装满」要先判 `dp[W]` 是否可达；环形（首尾相邻）要枚举断点或跑两遍取最优；带「至少一次操作」的题要在终态上再检查条件。填完表第一个问题是「我要的到底是哪一格」。",
        "衔接：e3 用背包把这套定义法完整演练一遍——它是「最后一步决策：选 or 不选」最标准的样本。"
      ],
      summary_en: [
        "Three elements of a state definition; without all three, do not start the loop: meaning (is dp[i] 'the answer over the first i' or 'the best answer ending exactly at i'), base cases (which minimal cells are filled in stone), and answer location (return dp[n], max dp[i], or dp[n][W]).",
        "'Over the first i' and 'ending at i' are two different definitions, not two tastes: stair counts and way-counts use the former because they accumulate, while LIS and maximum subarray must use the latter, since only 'ending at i' knows who the last element is and can therefore keep extending. Pick wrong and the symptom is simply 'the transition will not come out'.",
        "The fixed road to a transition is to consider the last decision: what does the optimal solution do at its final step? Split all solutions into mutually exclusive classes by that decision, express each as 'subproblem answer plus this class's cost', and their union is the recurrence. No equation usually means the question 'how many ways can it end?' was never answered.",
        "The split must be disjoint and exhaustive. Missing a class skews the answer without any error (the hardest kind to find); overlapping a class is harmless for a max (max is idempotent) but double-counts when you are counting ways, so answers come out too large. For counting, check cell by cell 'how many times was this state added'.",
        "Traversal order follows the dependency direction: dp[i] on dp[i-1] and dp[i-2] means i ascending; interval DP depends on shorter intervals, so enumerate by increasing length; dependence on the right or below means descending. The wrong-order symptom is reading a cell that is still its initial zero.",
        "Initialisation must separate 'impossible' from 'value zero'. For a maximum, unreachable cells take -INF and you check reachability before adding, or -INF + v overflows into a huge negative that then masquerades as a legal answer. For counting, dp[0] = 1, because 'choose nothing' is itself one way. These two initialisations are DP's highest-accident zone.",
        "The answer is frequently not the last cell: LIS takes max dp[i]; 'exactly fill the capacity' first asks whether dp[W] is reachable; a ring (first adjacent to last) needs a break point enumerated or two passes; 'must operate at least once' needs a condition rechecked at the end. After filling the table, ask 'which cell do I actually want'.",
        "Bridge: e3 runs this definition discipline end to end on the knapsack, the textbook sample of 'the last decision: take it or leave it'."
      ],
      code: `#include <algorithm>
#include <climits>
#include <vector>
// 状态定义示范：cur 就是「以 i 结尾」的最大子段和，即 dp[i]
long long maxSubArray(const std::vector<int>& a) {
    long long best = LLONG_MIN, cur = 0;
    for (int x : a) {
        cur = (cur > 0 ? cur : 0) + x;       // 前面的和已成负担就丢掉，这一句就是转移
        best = std::max(best, cur);          // 答案是所有 dp[i] 的最值，不是最后一个
    }
    return best;                             // 全负数组返回最大负数，而不是 0
}
int main() {
    std::vector<int> mixed{-2, 1, -3, 4, -1, 2, 1, -5, 4};
    std::vector<int> allNegative{-5, -2, -9};
    return static_cast<int>(maxSubArray(mixed) == 6 && maxSubArray(allNegative) == -2);
}`,
      pit: "求最大值的 DP 把整张表初始化成 0，让「不可达」和「价值 0」共用同一格：结果是把凑不出容量的非法状态当成合法答案返回（比如硬币凑不出 3 却回答 1 枚），或让 `-INF` 类转移变成一堆 0。先问「这格算不出来时应该是什么」，再决定初始值。",
      pit_en: "Filling a maximum-DP table with 0, so 'unreachable' and 'worth zero' share one value: the algorithm then reports a legal-looking answer for an impossible requirement (one coin for an unmakeable amount of 3), or every -INF transition decays into a pile of zeros. Ask 'what should this cell be if it cannot be computed' before choosing the initial value.",
      ex: {
        q: "为什么「最大子段和」必须用「以 i 结尾」的定义，而不能用「前 i 个的最大值」？",
        a: "因为「前 i 个的最大子段和」无法继续往后接——它没记录最优子段是否延伸到 i，也就无法判断加上 `a[i+1]` 之后还是不是合法子段；「以 i 结尾」保留了延续性，转移才有依据。",
        q_en: "Why must maximum subarray use 'ending at i' rather than 'best over the first i'?",
        a_en: "The latter does not record whether the best segment reaches i, so it cannot say whether appending a[i+1] stays a contiguous segment; 'ending at i' keeps that continuity, which is exactly what the transition needs."
      }
    },

    "e3": {
      min: 14,
      summary: [
        "问题：n 件物品各重 w[i]、价值 v[i]，容量 W，求总重不超 W 的最大价值。状态 `dp[i][j]` = 只考虑前 i 件、容量**上限**为 j 时的最大价值。注意「上限」而非「恰好用满」，这决定了整张表初值全 0 是合法的。",
        "转移就是最后一个决策的两类：第 i 件不选 → `dp[i-1][j]`；选（要求 `j >= w[i]`）→ `dp[i-1][j-w[i]] + v[i]`。取较大者。装不下时只剩第一类，所以循环里那句 `if (j >= w[i])` 不是优化而是正确性。",
        "滚动数组压成一维：`dp[j] = max(dp[j], dp[j - w[i]] + v[i])`，**j 必须逆序**。因为等号右边要的是「上一轮 i-1」的 `dp[j-w]`，顺序遍历会读到本轮刚更新过的值，等于把同一件物品选了多次。",
        "顺序遍历不是 bug，而是另一道题：它恰好给出**完全背包**（每种物品无限件）。一行方向之差区分两类问题，所以判断内层方向的口诀要背熟：0/1 逆序、完全顺序、多重背包把件数按二进制拆分（1,2,4,…）或直接用单调队列优化到 O(nW)。",
        "变形清单（都是「加一维」或「改合并符号」）：求「恰好装满」→ 初值改 `-INF`、`dp[0] = 0`；求方案数 → `max` 换成 `+=`；有第二重限制（体积 + 重量）→ 加一维；件数上限 → 加「已选几件」一维；要输出方案 → 另存决策表，或从 `dp` 逆着推。",
        "空间与能力是有取舍的：一维省内存，但**丢掉了反推方案**的能力（除非另存每步决策）。二维 2×10^7 个 int 约 80 MB，可能直接超内存；先估 `n × W` 的规模再决定压不压。",
        "复杂度 `O(nW)` 是**伪多项式**：它随 W 的数值线性增长，而不是随输入长度。W 到 10^9 时表根本开不下，此时要换成「按价值做 DP 求最小重量」、折半搜索（meet in the middle），或判定问题不可近似——认清这点比会写模板更重要。",
        "溢出与类型：`int` 累加 10^5 件、单件价值 10^9 直接回绕；价值总和可能多大就先算一遍，超过 2×10^9 就上 `long long`。`dp` 数组下标用 `int` 还是 `size_t` 也要一致，混用容易在 `j >= w[i]` 这类比较上出事。"
      ],
      summary_en: [
        "The problem: n items with weight w[i] and value v[i], capacity W, maximise total value without exceeding it. State dp[i][j] = best value using only the first i items with capacity *at most* j. 'At most', not 'exactly full', is what makes initialising the whole table to 0 correct.",
        "The transition is a split on the last decision: skip item i, giving dp[i-1][j]; or take it (only when j >= w[i]), giving dp[i-1][j - w[i]] + v[i]; keep the larger. So the 'if (j >= w[i])' inside the loop is not an optimisation but the statement that the second class does not exist there.",
        "Squeezing to one dimension gives dp[j] = max(dp[j], dp[j - w[i]] + v[i]), and j must run in reverse, because the right-hand dp[j - w] has to be last round's (i-1) value; a forward sweep reads the cell just updated this round, which is the same item taken twice.",
        "A forward sweep is not a bug, it is a different problem: it computes the unbounded knapsack, where each item may be used any number of times. One character of direction separates the two, hence the mnemonic — 0/1 backwards, unbounded forwards, bounded either split binary-style (1, 2, 4, ...) or optimised to O(nW) with a monotone queue.",
        "A variant checklist, all of them 'add a dimension' or 'change the merge operator': exactly fill means initial values -INF with dp[0] = 0; count ways by replacing max with +=; a second constraint adds a dimension; a per-item count limit adds 'how many taken'; recovering the chosen items needs a separate decision table or a backward walk over dp.",
        "Space and capability trade against each other: one dimension saves memory but loses the ability to reconstruct the solution unless you store each decision. A 2D table of 2*10^7 ints is about 80 MB and may exceed the limit outright — size n times W first, then decide whether to compress.",
        "O(nW) is pseudo-polynomial: it grows with the *value* of W, not with the input's length. At W = 10^9 the table cannot exist, and you switch to DP over value (minimising weight), meet in the middle, or accept that the problem is intractable. Knowing this matters more than being able to type the template.",
        "Overflow and types: summing 10^5 items of value 10^9 wraps an int instantly, so bound the total value before you choose the type and go long long past 2*10^9. Keep index types consistent too, because mixing int and size_t around 'j >= w[i]' invites silent wraparound."
      ],
      code: `#include <algorithm>
#include <cstddef>
#include <vector>
// 一维背包：内层遍历方向决定它解的是 0/1 背包还是完全背包
int knapsack01(const std::vector<int>& w, const std::vector<int>& v, int W) {
    std::vector<int> dp(W + 1, 0);              // dp[j]：容量上限为 j 时的最大价值
    for (std::size_t i = 0; i < w.size(); ++i)
        for (int j = W; j >= w[i]; --j)        // 逆序：读到的 dp[j-w] 仍是上一轮的值
            dp[j] = std::max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}
int knapsackFull(const std::vector<int>& w, const std::vector<int>& v, int W) {
    std::vector<int> dp(W + 1, 0);
    for (std::size_t i = 0; i < w.size(); ++i)
        for (int j = w[i]; j <= W; ++j)        // 顺序：本轮刚更新的值还能再取一次，即无限取
            dp[j] = std::max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}
int main() {
    std::vector<int> w{2, 3, 4}, v{3, 4, 5};
    int a = knapsack01(w, v, 6);               // 8：第 1 件与第 3 件各一次
    int b = knapsackFull(w, v, 6);             // 9：第 1 件取三次
    return a + b;
}`,
      pit: "把一维背包的内层写成顺序循环，还怪题目数据错：`dp[j - w[i]]` 已经是本轮更新过的值，于是同一件物品被反复装进去，答案「只偏大不报错」。症状是 0/1 背包的样例答案比预期大一点或小规模正确、大规模离谱——遇到「答案偏大」先查方向。",
      pit_en: "Writing the 1D knapsack's inner loop forwards and then blaming the test data: dp[j - w[i]] is already this round's value, so the same item enters again and again and the answer is 'only too large, never crashing'. The symptom is a 0/1 result slightly above expectation, right on small inputs and absurd on large ones — on any too-large answer, check the direction first.",
      ex: {
        q: "为什么「恰好装满」的背包要把初值改成 `-INF`，只留 `dp[0] = 0`？",
        a: "因为全 0 初值等于宣布「任何容量都已经有一个价值 0 的合法方案」，而题意要求必须正好用完容量；`-INF` 表示「这格还不合法」，转移时才会只有从 `dp[0]` 出发、重量精确累加到 W 的那些方案真正参与最值。",
        q_en: "Why does the 'exactly full' knapsack initialise with -INF and only dp[0] = 0?",
        a_en: "All-zeros asserts that every capacity already has a legal solution of value 0, but the statement demands the capacity be spent exactly. -INF marks the cell as not yet legal, so only solutions that grow out of dp[0] with weight accumulating precisely to W can compete for the maximum."
      }
    },

    "e4": {
      min: 13,
      summary: [
        "爬楼梯：`dp[i] = dp[i-1] + dp[i-2]`，本质就是斐波那契。事故都在边界——先确认「台阶从 0 还是 1 数」：`dp[1]=1, dp[2]=2` 与 `dp[0]=1` 是两套等价但不可混用的约定，混用就是 off-by-one。",
        "线性 DP 的变形全靠改「最后一步的候选集」：每次可跨 1~k 阶 → `dp[i] = sum(dp[i-1..i-k])`，用前缀和把 O(nk) 降回 O(n)；某些台阶禁止踩 → 那格置 0；首尾相邻（环形）→ 断环成两段各跑一次取 max。",
        "LIS 的 `O(n²)`：`dp[i]` = 以 i 结尾的最长递增子序列长度，所以初值全是 1（至少含自身）；`dp[i] = max(dp[j] + 1)`，对所有 `j < i 且 a[j] < a[i]`；答案是 `max dp[i]`，不是 `dp[n-1]`。",
        "LIS 的 `O(n log n)`：`tails[k]` 定义为「长度为 k+1 的递增子序列的**最小可能结尾**」，它随 k 单调递增，所以可以二分。新元素找到第一个 `>=` 它的位置替换（尾巴变短、将来更容易接上），找不到就追加，长度即 `tails.size()`。",
        "`lower_bound` 还是 `upper_bound` 就是「严格递增」还是「非递减」：允许相等时 `a[j] <= a[i]` 也能接，二分必须跳到所有相等值的后面。这一格差别常是 AC 与 WA 的分界，比记算法本身更容易在考场上写错。",
        "另一个「以 i 结尾」的样板是最大子段和（Kadane）：`cur = max(a[i], cur + a[i])`。全负数组的答案必须是最大的那个负数，所以 `cur`、`best` 都不能初始化成 0——「允许空子段」是另一道题，要先问清题意。",
        "线性 DP 的通用套路是五步：定义状态 → 写转移 → 定边界 → 决定遍历顺序 → **手动跑一遍 3~5 个元素的表**。最后一步性价比最高，它能在编译之前抓出八成边界错，也是面试里「讲清思路」的主体内容。",
        "衔接：e5 把状态、方向、压缩、初始化四件事收成一张固定检查清单，并复盘最容易错的三类。"
      ],
      summary_en: [
        "Stair climbing: dp[i] = dp[i-1] + dp[i-2], Fibonacci in other clothes. Every accident is at the boundary — settle first whether stairs are numbered from 0 or from 1: 'dp[1]=1, dp[2]=2' and 'dp[0]=1' are equivalent conventions that must never be mixed, and mixing them is the off-by-one.",
        "Variants of a linear DP are all edits to 'the candidate set of the last step': stride 1..k gives dp[i] = sum(dp[i-1..i-k]), and a prefix sum pulls O(nk) back to O(n); forbidden steps set that cell to 0; a ring (first adjacent to last) is cut into two passes whose results are maximised.",
        "LIS in O(n2): dp[i] is the longest increasing subsequence ending at i, so every cell starts at 1 (the element alone); dp[i] = max(dp[j] + 1) over all j < i with a[j] < a[i]; and the answer is max dp[i], not dp[n-1].",
        "LIS in O(n log n): tails[k] is defined as the smallest possible tail among increasing subsequences of length k+1, which makes it monotone in k and therefore binary-searchable. A new element replaces the first entry >= it (shortening that tail so future elements can extend it) or is appended, and the answer is tails.size().",
        "lower_bound versus upper_bound is exactly 'strictly increasing' versus 'non-decreasing': when equality is allowed, a[j] <= a[i] may also extend, so the search must jump past all equal values. This single cell is a frequent AC/WA boundary and is easier to get wrong under pressure than the algorithm itself.",
        "Kadane's maximum subarray is the other 'ending at i' template: cur = max(a[i], cur + a[i]). On an all-negative array the answer is the largest negative, so neither cur nor best may start at 0 — 'the empty subarray is allowed' is a different problem, and you ask first.",
        "The five-step routine for linear DP: define the state, write the transition, fix the boundaries, choose the traversal order, then hand-run the table on three to five elements. The last step has the best return per second and is most of what 'explain your approach' means in an interview.",
        "Bridge: e5 folds state, direction, compression and initialisation into one standing checklist and revisits the three most common failure classes."
      ],
      code: `#include <algorithm>
#include <cstddef>
#include <vector>
int lisSquare(const std::vector<int>& a) {
    std::vector<int> dp(a.size(), 1);              // dp[i]：以 i 结尾，所以初值全是 1
    int best = 0;
    for (std::size_t i = 0; i < a.size(); ++i) {
        for (std::size_t j = 0; j < i; ++j)
            if (a[j] < a[i]) dp[i] = std::max(dp[i], dp[j] + 1);
        best = std::max(best, dp[i]);              // 答案是 max dp[i]，不是最后一个格子
    }
    return best;
}
int lisNLogN(const std::vector<int>& a, bool strict) {
    std::vector<int> tails;                        // tails[k]：长度 k+1 的递增子序列的最小结尾
    for (int x : a) {
        // 严格递增用 lower_bound，允许相等就用 upper_bound：这一格决定 AC 还是 WA
        auto it = strict ? std::lower_bound(tails.begin(), tails.end(), x)
                         : std::upper_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;                              // 替换：把这条长度的尾巴换得更短
    }
    return static_cast<int>(tails.size());         // 只有长度可信，tails 本身未必是一条真实序列
}
int main() {
    std::vector<int> v{10, 9, 2, 5, 3, 7, 101, 18};
    return lisSquare(v) == lisNLogN(v, true) ? lisSquare(v) : 0;
}`,
      pit: "把 `tails`（或贪心数组）当成「一条真实存在的子序列」往外输出：它只是每个长度下**最小结尾值**的集合，替换过程会让它前后不来自同一条序列。要真的输出方案，必须额外记录每个元素被放进了哪个位置、它的前驱是谁——否则你会打印出一个原数组里根本不存在的序列。",
      pit_en: "Treating the tails array as an actual subsequence and printing it: it is only the set of smallest tails per length, and successive replacements mean its entries need not come from one sequence. To output a real witness you must also record where each element landed and what its predecessor was, or you will show a sequence the input never contained.",
      ex: {
        q: "为什么 LIS 的 `O(n log n)` 写法能成立，靠的是哪条单调性？",
        a: "靠「长度更长的递增子序列，其最小结尾一定不小于长度更短的」：若长度 k+1 的某个结尾比长度 k 的最小结尾还小，把它截掉最后一项就得到一条更短且结尾更小的序列，与定义矛盾。因此 `tails` 递增，二分才有依据。",
        q_en: "Why is the O(n log n) LIS correct — which monotonicity does it lean on?",
        a_en: "On the fact that the smallest tail of a longer increasing subsequence cannot be below that of a shorter one: if a tail at length k+1 were smaller than the minimal tail at length k, chopping off its last element would yield a shorter sequence with an even smaller tail, contradicting the definition. Hence tails is increasing and the binary search is justified."
      }
    },

    "e5": {
      title: "综合重构：DP 动笔前的五行检查清单",
      title_en: "Synthesis: Five Lines to Write Before Any DP",
      min: 15,
      target:  "面对新题能在写代码前填出「状态含义 / 边界 / 答案位置 / 转移分类 / 遍历顺序」五行，并能用清单定位一段错误 DP 的错因。",
      target_en: "Before coding a new problem, fill in five lines — state meaning, base cases, answer location, transition classes, traversal order — and use that checklist to localise the fault in a broken DP.",
      summary: [
        "固定动笔顺序（任何 DP 题先写这五行再敲循环）：状态三要素 → 决策分类是否不重不漏 → 依赖方向决定遍历顺序 → 边界与「不可达」的标记 → 答案落在哪一格。五行写完，代码基本是翻译工作。",
        "滚动方向只有一句判断依据：内层读的格子必须是「上一轮」的值就是**逆序**，允许读到本轮新值（即允许重复选）就是**顺序**。0/1 逆序、完全顺序；出错的症状统一是「答案偏大」。",
        "初始化错法排行：① `dp[0]=0` 与 `dp[0]=1` 混用（方案数题全成 0）；② 不可达用 0 而不是 `±INF`（最值题把非法当合法）；③ 二维表只填了 `dp[0][0]`，忘了第一行 / 第一列；④ 边界与实际可达范围不一致（如 `dp[1]` 在 n==0 时越界写）。",
        "遍历顺序错法：区间 DP 没按长度枚举、树形 DP 没走后序、依赖 `j > i` 却顺序扫、多组测试之间忘了重置表。共同症状是「用到未算的格子」，看起来像初始化 bug，其实是顺序 bug——所以两件事要分开自查。",
        "空间压缩前必答三问：只用得上上一行吗？还要不要反推方案？压缩后会破坏「同一轮内多个决策」的读顺序吗？三问过了再压；压完顺手把 `dp` 的数组长度、下标偏移再核一遍（滚动数组的越界多半来自忘了 `+1`）。",
        "复杂度自查：状态数 × 转移代价，10^7 舒适、10^8 紧张、10^9 必挂。若 W 或值域巨大而 n 很小，换维度（按价值做 DP）、二分答案 + 判定、或 meet-in-the-middle；「DP 写不出来」常常是「维度选错」。",
        "DP 与记忆化怎么选：状态稀疏或只问单点 → 记忆化递归；要整张表、多次查询、或怕爆栈 → 自底向上。两者可机械互换，差别只在有没有那层递归调用与缓存判断。",
        "衔接：下一段 dsl 补上「复杂度怎么算准、均摊分析怎么用」——本段所有的 `O(nW)`、`O(n²)` 能不能接受，正是靠它判断；同时链表会把「指针 + 结构体」这块地基压实。"
      ],
      summary_en: [
        "A fixed order of attack (write these five lines before any loop): the three state elements, whether the decision split is disjoint and exhaustive, the dependency direction that fixes traversal order, the base cases and the marker for 'unreachable', and which cell holds the answer. Once the five lines are full, coding is translation.",
        "The rolling-direction rule has one basis: if the inner loop must read a cell from the previous round, go in reverse; if reading this round's fresh value is allowed (repeat selection), go forward. 0/1 reverse, unbounded forward — and both mistakes present as 'the answer came out too large'.",
        "The initialisation hall of shame: mixing dp[0]=0 with dp[0]=1 so every counting table collapses to zero; using 0 instead of +/-INF so a maximum treats illegal as legal; filling only dp[0][0] and forgetting the first row and column of a 2D table; and writing dp[1] when the reachable boundary is empty.",
        "The order hall of shame: interval DP not enumerated by length, tree DP not done post-order, a dependence on j > i scanned forwards, and a shared table never reset between test cases. Both look like 'I used an uncomputed cell', which is why initialisation and order must be checked separately.",
        "Three questions before compressing: does this row need only the previous row? is the solution still to be reconstructed? will compression break the read order among several decisions in one round? Compress only after all three pass, then re-check array lengths and index offsets, because most rolling-array overruns are a forgotten +1.",
        "Complexity self-check: states times transition cost — 10^7 comfortable, 10^8 tight, 10^9 dead. When W or the value range is huge but n is small, flip the dimension (DP over value), binary-search the answer with a decision DP, or meet in the middle; 'no DP occurs to me' usually means 'wrong dimension'.",
        "DP versus memoisation: sparse states or a single queried point favours memoised recursion; needing the whole table, answering many queries, or fearing the stack favours bottom-up. They convert mechanically; the only difference is whether a call and a cache check sit in the way.",
        "Bridge: the next stage, dsl, sharpens complexity analysis and amortised cost — which is exactly how you judge whether this stage's O(nW) or O(n2) is affordable — while linked lists consolidate the pointer-and-struct ground beneath everything here."
      ],
      code: `#include <algorithm>
#include <iostream>
#include <vector>
// 清单落到代码上：初始化、内层方向、不可达标记，是最容易错的三处
int main() {
    const int W = 10;
    std::vector<int> coins{2, 5};
    // 求「恰好凑出 j 的最少硬币数」：不可达必须是正无穷，不能是 0
    std::vector<int> few(W + 1, W + 1);
    few[0] = 0;
    for (int c : coins)
        for (int j = c; j <= W; ++j)              // 顺序：硬币可重复使用，即完全背包
            few[j] = std::min(few[j], few[j - c] + 1);
    // 方案数：dp[0] = 1 表示「什么都不选也算一种方案」
    std::vector<long long> ways(W + 1, 0);
    ways[0] = 1;
    for (int c : coins)
        for (int j = c; j <= W; ++j)
            ways[j] += ways[j - c];
    std::cout << (few[W] > W ? -1 : few[W]) << ' ' << ways[W] << '\\n';
    // 正确答案是 2 2；若把不可达初始化成 0，min 就会把非法值当成答案
    return 0;
}`,
      pit: "多组数据共用一张 `dp` 表却忘了重置：第一组把表填满后，第二组直接读到上一组的残值，答案「看着合理但就是错」，而且**单跑第二组是对的**。这类 bug 的特征是「只在批量测试时错」，所以每组数据后要显式 `assign` 或重新构造表。",
      pit_en: "Reusing one dp table across test cases without resetting it: the second case reads the first case's leftovers and answers something plausible yet wrong — while the second case passes when run alone. 'Only fails in batch' is the fingerprint, which is why the table must be reassigned or rebuilt per case.",
      ex: {
        q: "拿到一道 DP 题，为什么「答案落在哪一格」要最先想，而不是最后？",
        a: "因为它会反过来决定状态定义：答案是 `dp[n]` 说明状态是「前 i 个」，答案要 `max dp[i]` 说明状态是「以 i 结尾」。先定答案位置，转移方程的写法就唯一了；最后才想，往往会把两种定义混着写，从而写出一个自洽但错误的方程。",
        q_en: "Why should 'which cell holds the answer' be settled first rather than last?",
        a_en: "Because it feeds back into the state definition: an answer at dp[n] means 'over the first i', an answer at max dp[i] means 'ending at i'. Fixing the answer location first makes the recurrence almost forced; leaving it to the end invites mixing both definitions into one self-consistent but wrong equation."
      }
    }
  },

  /* ---------- 题库：对准深化新增的知识点，每章 4 题（选择 / 判断 / 填空混排） ---------- */
  quizAdd: {
    sbw: [
      {
        q: "关于 `x >> 1` 与 `x / 2`（x 为 int），下列说法正确的是？",
        o: ["两者对所有 int 结果完全相同", "x 为负数时两者可能差 1：除法向零取整，右移向下取整", "右移永远在高位补 0", "负数右移是未定义行为，绝不能写"],
        a: 1,
        why: "-7 / 2 得 -3（向零），-7 >> 1 得 -4（向下）。C++17 里负数右移的结果是实现定义行为（几乎所有编译器做算术右移），C++20 起才明确写成向下取整；用移位实现除以 2 只对非负数安全。",
        q_en: "For an int x, which statement about x >> 1 versus x / 2 is correct?",
        o_en: ["They always give the same result for every int", "For negative x they can differ by one: division truncates toward zero, shifting floors", "A right shift always fills the high bit with 0", "Shifting a negative is undefined behaviour and must never be written"],
        why_en: "-7 / 2 is -3 (toward zero) while -7 >> 1 is -4 (floor). In C++17 the result of shifting a negative is implementation-defined (nearly every compiler does an arithmetic shift); C++20 pins it to floor. Only non-negative x makes the two interchangeable."
      },
      {
        q: "判断：在 int 为 32 位的实现上，`x << 32` 是未定义行为。",
        type: "judge", a: 0,
        why: "移位数量必须满足 0 <= k < 位宽，等于或超过位宽即未定义行为；编译器可以给出 0、原值或任何结果，还可能据此做进一步优化。",
        q_en: "True or false: x << 32 is undefined behaviour where int is 32 bits.",
        why_en: "True. A shift count must satisfy 0 <= k < width; at or above the width it is undefined behaviour, so the compiler may yield 0, the original value, or anything else, and may optimise further on that premise."
      },
      {
        q: "取出一个整数最低位的 1（其余位清零）的表达式是 ______（写成 x 与某个运算的组合）。",
        type: "fill", ans: ["x & -x", "x&-x", "x & (~x+1)", "lowbit(x)"],
        why: "补码里 -x 等于 ~x + 1，加一的进位恰好停在最低位的 1 处，所以两者相与只剩那一位。这也是树状数组的推进运算。",
        q_en: "The expression that isolates the lowest set bit of an integer (all other bits cleared) is ______.",
        why_en: "In two's complement -x is ~x + 1, and the carry stops exactly at the lowest set bit, so the AND keeps just that one bit — the same operation a Fenwick tree steps with."
      },
      {
        q: "下面哪个能正确判断 unsigned n 是 2 的幂？",
        o: ["(n & (n - 1)) == 0", "n > 0 && (n & (n - 1)) == 0", "n % 2 == 0", "(n | (n - 1)) == 0"],
        a: 1,
        why: "少了 `n > 0` 时 0 会被误判成 2 的幂（0 & -1 == 0）；`n % 2 == 0` 只能判偶数；选项 A 是漏掉零点的常见写法。",
        q_en: "Which correctly tests whether an unsigned n is a power of two?",
        o_en: ["(n & (n - 1)) == 0", "n > 0 && (n & (n - 1)) == 0", "n % 2 == 0", "(n | (n - 1)) == 0"],
        why_en: "Without n > 0 the value 0 passes (0 & -1 == 0); n % 2 == 0 only tests evenness. Option A is the familiar form with the zero case left out."
      }
    ],
    srec: [
      {
        q: "关于尾递归，正确的说法是？",
        o: ["C++ 标准保证尾递归一定被优化成循环", "标准只把尾调用优化列为建议，编译器常不做，不能靠它防爆栈", "尾递归指递归调用出现在函数开头", "只有互递归才能被优化"],
        a: 1,
        why: "标准措辞是实现「应当」支持尾调用优化，实际遇到析构函数、异常处理或调试构建时往往不优化，所以深度可能上千的算法仍要改迭代或显式栈。",
        q_en: "Which statement about tail recursion is correct?",
        o_en: ["The standard guarantees tail calls become loops", "The standard only recommends tail-call optimisation; compilers often decline, so it cannot be relied on against stack overflow", "Tail recursion means the call appears at the start of the function", "Only mutual recursion can be optimised"],
        why_en: "The standard merely recommends tail-call optimisation, and destructors, exception handling or a debug build routinely defeat it, so algorithms whose depth can pass a thousand still need a loop or an explicit stack."
      },
      {
        q: "判断：快速排序最坏情况下的时间复杂度是 O(n log n)。",
        type: "judge", a: 1,
        why: "最坏情况（每次划分只切掉一个元素，如已排序输入配固定首元素枢轴）递归深度退化为 n、总比较约 n²/2，是 O(n²)；三数取中或随机枢轴用来避免这种输入。",
        q_en: "True or false: quicksort's worst-case time complexity is O(n log n).",
        why_en: "False. When each partition peels off only one element (sorted input with a fixed first-element pivot) the depth becomes n and comparisons about n2/2, i.e. O(n2); median-of-three or a random pivot exists to prevent that input."
      },
      {
        q: "回溯模板的三段式是：选择、递归、______（填一个两字动词）。",
        type: "fill", ans: ["撤销", "还原", "恢复", "undo", "unmake"],
        why: "make / recurse / unmake 三段必须严格配对，撤销要覆盖 used 标记、路径、计数器与得分等所有隐形状态，漏一处就会让前面的分支污染后面的分支。",
        q_en: "The three parts of the backtracking template are: choose, recurse, ______.",
        why_en: "Make, recurse, unmake must pair exactly, and the undo has to cover every invisible piece of state — used-markers, the path, counters, the running score; one omission lets an earlier branch contaminate later ones."
      },
      {
        q: "需要「稳定排序」且允许 O(n) 额外空间时，应选？",
        o: ["快速排序", "归并排序", "堆排序", "选择排序"],
        a: 1,
        why: "归并排序稳定、最坏仍 O(n log n)，代价是辅助数组；快排与堆排序都不稳定，`std::sort` 因此不保证相等键的原序。",
        q_en: "Which is the right choice when a stable sort is required and O(n) extra space is acceptable?",
        o_en: ["Quicksort", "Merge sort", "Heap sort", "Selection sort"],
        why_en: "Merge sort is stable, stays O(n log n) in the worst case, and pays with a scratch array; quicksort and heap sort are unstable, which is exactly what std::sort does not guarantee for equal keys."
      }
    ],
    sdp: [
      {
        q: "把 0/1 背包压成一维后，内层容量 j 必须逆序遍历，原因是？",
        o: ["逆序对缓存更友好", "逆序保证读到的 dp[j-w] 仍是上一轮（i-1）的值，从而每件至多选一次", "顺序会数组越界", "只有逆序才能得到 dp[W]"],
        a: 1,
        why: "一维化后同一个数组承担了两轮数据，顺序遍历会读到本轮刚更新的值，等于把同一件物品重复装入；顺序遍历正好给出完全背包。",
        q_en: "After compressing the 0/1 knapsack to one dimension, why must the capacity loop run in reverse?",
        o_en: ["Reverse is more cache-friendly", "Reverse keeps dp[j-w] reading the previous round's (i-1) value, so each item is taken at most once", "Forward goes out of bounds", "Only forward order yields dp[W]"],
        why_en: "One array now carries two rounds; a forward sweep reads the cell just updated this round, i.e. takes the same item twice — and that forward variant is precisely the unbounded knapsack."
      },
      {
        q: "判断：求「方案数」的 DP 里，`dp[0]` 通常应初始化为 1。",
        type: "judge", a: 0,
        why: "因为「什么都不选」本身就是凑出 0 的一种方案，它是所有累加的起点；写成 0 会让整张表全是 0。求最值时 dp[0] 才常取 0 或 -INF。",
        q_en: "True or false: in a counting DP, dp[0] is usually initialised to 1.",
        why_en: "True. 'Choose nothing' is itself one way to reach 0 and is the seed of every sum; initialising it to 0 zeroes the whole table. Only value-maximising DPs take 0 or -INF there."
      },
      {
        q: "DP 的时间复杂度通常可以写成「______ × 转移代价」（填一个两字或三字术语）。",
        type: "fill", ans: ["状态数", "状态个数", "状态总数"],
        why: "状态数与每个状态的计算代价相乘就是总代价，它是动手前估算法可行性的第一道检查，一般以 10^7 为舒适上限。",
        q_en: "A DP's running time is usually written as '______ times the transition cost'.",
        why_en: "Number of states times per-state cost is the total — the first feasibility check before writing code, with about 10^7 taken as comfortable."
      },
      {
        q: "「无后效性」不成立时，正确的处理是？",
        o: ["把遍历顺序改成逆序", "把影响未来转移的历史信息加进状态维度", "改成记忆化递归", "把初值改成 -INF"],
        a: 1,
        why: "症状说明状态「太瘦」，遗漏了将来要用到的信息；逆序、换记忆化都改变不了状态定义本身，答案依然错。",
        q_en: "When the Markov property fails, what is the right response?",
        o_en: ["Reverse the traversal order", "Fold the history that future transitions need into the state dimensions", "Switch to memoised recursion", "Change the initial value to -INF"],
        why_en: "The state is too thin — it dropped information later transitions require. Reordering or memoising never changes the definition, so the answer stays wrong."
      }
    ]
  },

  /* ---------- 词典：分类统一「C++ 系统深入」，与既有名词查重 ---------- */
  terms: [
    { term: "补码", term_en: "Two's Complement", cat: "C++ 系统深入",
      short: "负数以「取反加一」的形式存储，使加减法共用同一套电路。",
      short_en: "Negatives are stored as 'complement plus one', so one adder serves both signs.",
      detail: ["它给出两条常用结论：~x == -x - 1，以及最高位是符号位。", "lowbit、异或判异号、负数右移的行为，全部由这个定义推出。"],
      detail_en: ["It yields two everyday facts: ~x equals -x - 1, and the top bit is the sign bit.", "Lowbit isolation, the XOR sign test and the behaviour of shifting a negative all follow from this definition."],
      vs: "补码是表示法，溢出是算术结果超出表示范围。",
      vs_en: "Two's complement is a representation; overflow is an arithmetic result leaving that representation's range." },
    { term: "算术右移", term_en: "Arithmetic Right Shift", cat: "C++ 系统深入",
      short: "右移时高位补符号位，等价于对负数向下取整的除以 2。",
      short_en: "Shifting right refills with the sign bit, i.e. division by two that floors.",
      detail: ["C++17 中负数右移的结果是实现定义行为，C++20 起明确为向下取整。", "与整数除法的差异就在取整方向：除法向零，算术右移向负无穷。"],
      detail_en: ["In C++17 the result of right-shifting a negative value is implementation-defined; C++20 fixed it to flooring.", "The gap versus integer division is the rounding direction: division truncates toward zero, arithmetic shift floors."],
      vs: "逻辑右移高位补 0（无符号数），算术右移补符号位（有符号数）。",
      vs_en: "A logical shift fills with zeros (unsigned); an arithmetic shift fills with the sign bit (signed)." },
    { term: "lowbit 运算", term_en: "Lowest Set Bit", cat: "C++ 系统深入",
      short: "x & -x 取出最低位的 1，其余位清零。",
      short_en: "x & -x isolates the lowest set bit and clears the rest.",
      detail: ["成立依据是补码：-x 等于 ~x + 1，加一的进位恰好停在第一个 1 上。", "它是树状数组的推进运算，i += i & -i 跳到覆盖区间的右端点。"],
      detail_en: ["It follows from two's complement: -x is ~x + 1, and the carry stops on the first set bit.", "It is the stepping operation of a Fenwick tree, where i += i & -i jumps to the right end of the covered range."],
      vs: "x & -x 保留最低位的 1；x & (x-1) 抹掉最低位的 1。",
      vs_en: "x & -x keeps the lowest set bit; x & (x-1) clears it." },
    { term: "状态压缩", term_en: "State Compression", cat: "C++ 系统深入",
      short: "用一个整数的每个位表示一个二选一的状态，把集合变成可传递、可作下标的值。",
      short_en: "Each bit of one integer encodes a yes/no choice, turning a set into a value you can pass and index by.",
      detail: ["n 不超过 63 时一个 uint64_t 就装得下，判交、判含、并差都退化成一条位运算。", "典型用途是把「已访问集合」当 DP 下标，复杂度 2^n 量级，n 通常只能到 20 上下。"],
      detail_en: ["With n at most 63 a single uint64_t holds it all, so disjointness, containment, union and difference each become one bitwise instruction.", "The classic use is indexing a DP table by the visited set, which costs 2^n and therefore keeps n around 20 at most."],
      vs: "状态压缩是「位当集合用」，位域是「把结构体塞进位」，两者目的不同。",
      vs_en: "State compression uses bits as a set; a bit-field packs a struct into bits. Different goals." },
    { term: "子集枚举", term_en: "Subset Enumeration", cat: "C++ 系统深入",
      short: "for (s = mask; s; s = (s-1) & mask) 走完 mask 的全部非空子集。",
      short_en: "for (s = mask; s; s = (s-1) & mask) walks every non-empty subset of mask.",
      detail: ["每一步都仍是 mask 的子集且严格递减，所以不重不漏；空集要在循环外单独处理。", "总次数是 2^popcount(mask) - 1，写成 s-- 会访问到含非法位的组合。"],
      detail_en: ["Every step stays a subset of mask and strictly decreases, so nothing is missed or repeated; the empty set is handled outside the loop.", "There are 2^popcount(mask) - 1 steps; a plain s-- would also visit combinations using bits mask does not have."],
      vs: "子集枚举遍历一个掩码内部，位遍历（for i in 0..w）遍历整个位宽。",
      vs_en: "Subset enumeration walks inside one mask; a bit scan walks the whole width." },

    { term: "记忆化", term_en: "Memoization", cat: "C++ 系统深入",
      short: "把纯函数的返回值按参数缓存，让同一子问题只算一次。",
      short_en: "Cache a pure function's result by its arguments so each subproblem is solved once.",
      detail: ["生效前提是函数为纯且子问题重叠；不重叠的递归加缓存纯属负担。", "哨兵值不能与合法答案相同，否则那些格子永远被当成没算过，慢得像没缓存。"],
      detail_en: ["It pays only when the function is pure and subproblems overlap; caching a non-overlapping recursion is pure overhead.", "The sentinel must differ from every legal answer, or those cells look forever uncomputed and the code runs as if there were no cache."],
      vs: "记忆化是自顶向下按需填表，动态规划是自底向上按顺序填表。",
      vs_en: "Memoisation fills the table top-down on demand; dynamic programming fills it bottom-up in order." },
    { term: "尾递归", term_en: "Tail Recursion", cat: "C++ 系统深入",
      short: "递归调用是函数的最后一个动作，返回后没有任何待做的计算。",
      short_en: "The recursive call is the function's last action, with nothing left to compute afterwards.",
      detail: ["原则上可优化成循环、栈深度 O(1)，但 C++ 标准只把这件事写成建议，编译器常不做。", "有析构函数、异常处理或调试构建时最容易优化失败，所以不能靠它防爆栈。"],
      detail_en: ["In principle it becomes a loop with O(1) stack, but the standard only recommends the optimisation and compilers often decline.", "Destructors, exception handling and debug builds are where it fails, so it cannot be trusted against stack overflow."],
      vs: "尾递归是「调用后无事可做」，普通递归还要保留帧做合并。",
      vs_en: "Tail recursion has nothing left to do after the call; ordinary recursion keeps the frame alive to combine results." },
    { term: "主定理", term_en: "Master Theorem", cat: "C++ 系统深入",
      short: "由 T(n) = aT(n/b) + f(n) 直接读出分治递归的复杂度。",
      short_en: "Reads a divide-and-conquer recurrence T(n) = aT(n/b) + f(n) straight into a complexity.",
      detail: ["直觉只有一句：比较合并代价 f(n) 与叶子层总工作量 n^(log_b a)，谁大取谁，同阶则乘一个 log。", "归并排序两者同阶所以是 O(n log n)；二分查找层数累加所以是 O(log n)。"],
      detail_en: ["One intuition carries it: compare the merge cost f(n) with the leaf work n^(log_b a); take the larger, and multiply by a log on a tie.", "Merge sort ties and becomes O(n log n); binary search accumulates levels and becomes O(log n)."],
      vs: "主定理管「子问题互不相交」的分治，重叠子问题要交给动态规划。",
      vs_en: "The master theorem covers disjoint divide-and-conquer; overlapping subproblems belong to dynamic programming." },
    { term: "原地划分", term_en: "In-place Partition", cat: "C++ 系统深入",
      short: "只交换数组内元素、按枢轴把两侧分好，不额外开数组。",
      short_en: "Rearrange the array in place around a pivot using swaps, with no extra buffer.",
      detail: ["它是快排的核心，也是缓存友好与常数小的来源。", "交换会打乱相等元素的相对顺序，所以原地划分天生不稳定；要稳定就得付出额外空间。"],
      detail_en: ["It is quicksort's core, and the reason quicksort caches well with small constants.", "Swapping destroys the relative order of equal keys, so in-place partitioning is inherently unstable; stability costs extra space."],
      vs: "原地划分省空间但不保序，归并的合并保序但要辅助数组。",
      vs_en: "In-place partition saves space and loses order; merge preserves order and needs a scratch array." },
    { term: "排序稳定性", term_en: "Sort Stability", cat: "C++ 系统深入",
      short: "键相等的元素在结果中是否保持原来的相对顺序。",
      short_en: "Whether elements with equal keys keep their original relative order after sorting.",
      detail: ["归并排序与 std::stable_sort 稳定；快排、堆排序、std::sort 不保证。", "多关键字排序时稳定是「排两次」策略成立的前提，否则第二次会毁掉第一次。"],
      detail_en: ["Merge sort and std::stable_sort are stable; quicksort, heap sort and std::sort promise nothing.", "With multiple keys, stability is what makes the sort-twice strategy work at all; otherwise the second pass undoes the first."],
      vs: "稳定性是关于相等键的承诺，速度是关于比较次数的度量。",
      vs_en: "Stability is a promise about equal keys; speed is a count of comparisons." },

    { term: "最优子结构", term_en: "Optimal Substructure", cat: "C++ 系统深入",
      short: "大问题的最优解可以由子问题的最优解拼成。",
      short_en: "An optimal solution can be assembled from optimal solutions of its subproblems.",
      detail: ["它是 DP 成立的两个前提之一，另一个是无后效性。", "不满足时反例通常是「子问题的最优放在一起互相冲突」，例如带路径限制的最短路。"],
      detail_en: ["It is one of DP's two preconditions; the other is the Markov property.", "When it fails, the usual witness is that the per-subproblem optima conflict when combined, as in shortest paths with route constraints."],
      vs: "最优子结构管「能不能拼」，无后效性管「拼的时候还需要哪些历史」。",
      vs_en: "Optimal substructure asks whether parts combine; the Markov property asks what history the combination still needs." },
    { term: "无后效性", term_en: "Markov Property", cat: "C++ 系统深入",
      short: "状态一旦确定，到达它的路径不再影响后续转移。",
      short_en: "Once the state is fixed, the path taken to reach it no longer affects later transitions.",
      detail: ["不成立时 DP 不报错，只会安静地给出偏优或偏劣的答案。", "解决办法是把遗漏的历史维度塞进状态，例如加「上一个选没选」「特权用没用过」。"],
      detail_en: ["When it fails, DP raises no error and quietly returns an answer that is too good or too poor.", "The fix is to promote the missing history into the state, such as a 'was the previous one taken' or 'privilege spent' dimension."],
      vs: "它比最优子结构更容易被忽略，因为漏掉的信息通常不违反任何断言。",
      vs_en: "It is overlooked more often than optimal substructure, because dropped information violates no assertion." },
    { term: "滚动数组", term_en: "Rolling Array", cat: "C++ 系统深入",
      short: "只保留上一轮（或上一行）的表，把多维 DP 压成低一维。",
      short_en: "Keep only the previous round's row, collapsing a multi-dimensional DP by one dimension.",
      detail: ["压缩后内层方向必须重推：读上一轮的值就逆序，允许读本轮值就顺序。", "省了空间也丢了反推方案的能力，需要输出方案时要另存决策。"],
      detail_en: ["After compression the inner direction must be re-derived: read previous-round values means reverse, reading this round's fresh values means forward.", "It saves space and loses solution reconstruction, so store the decisions separately if the answer must be listed."],
      vs: "滚动数组是空间技巧，遍历顺序是它的正确性条件，两件事不能混着检查。",
      vs_en: "A rolling array is a space trick; traversal order is its correctness condition. Check them separately." },
    { term: "完全背包", term_en: "Unbounded Knapsack", cat: "C++ 系统深入",
      short: "每种物品可取无限件，转移与 0/1 背包只差内层遍历方向。",
      short_en: "Unlimited copies of each item; it differs from the 0/1 knapsack only in the inner loop direction.",
      detail: ["内层顺序遍历让本轮刚更新的格子可被再次使用，这正是「无限取」的语义。", "求最少数量时把不可达初始化成正无穷，求方案数时把 max 换成累加。"],
      detail_en: ["A forward inner loop lets a cell updated this round be used again, which is precisely what 'unbounded' means.", "For a minimum count mark unreachable cells as positive infinity; for a way-count replace max with addition."],
      vs: "0/1 背包每件至多一次（逆序），多重背包有件数上限（拆分或单调队列）。",
      vs_en: "The 0/1 knapsack takes each item at most once (reverse); the bounded one caps the copies (splitting or a monotone queue)." },
    { term: "DP 状态", term_en: "DP State", cat: "C++ 系统深入",
      short: "描述一个子问题的变量组合，是「前 i 个」还是「以 i 结尾」必须写明。",
      short_en: "The variables describing one subproblem; whether it means 'the first i' or 'ending at i' must be stated.",
      detail: ["状态定义决定转移能不能写：只有「以 i 结尾」保留了延续性，才能往后接。", "三要素缺一就别写循环：含义、边界、答案落在哪一格。"],
      detail_en: ["The definition decides whether a transition exists at all: only 'ending at i' keeps the continuity needed to extend.", "Do not write the loop until all three elements are set: meaning, base cases, and which cell holds the answer."],
      vs: "DP 状态是「子问题的地址」，转移方程是「地址之间的依赖」。",
      vs_en: "A DP state is the address of a subproblem; the recurrence is the dependency between addresses." }
  ],

  achievements: [
    { id: "bit_smith", icon: "🪙", name: "位级工匠", name_en: "Bit Smith",
      desc: "完成 sbw · 位运算深入 全部课节", desc_en: "Finish every lesson of sbw Bit Tricks",
      check: ["sbw"] },
    { id: "recurrence_solver", icon: "🧩", name: "递推解链人", name_en: "Recurrence Solver",
      desc: "完成 srec 与 sdp 全部课节", desc_en: "Finish every lesson of srec and sdp",
      check: ["srec", "sdp"] }
  ],

  codeComments: {
    "位容器一律用无符号：没有符号位也没有溢出争议": "bit containers are always unsigned: no sign bit, no overflow argument",
    "置第 2 位": "set bit 2",
    "清第 2 位": "clear bit 2",
    "翻转第 5 位：不关心原来是什么": "flip bit 5: the previous value does not matter",
    "取第 5 位来看": "read bit 5",
    "优先级陷阱：下面这一行的意思是 x & (1 == 1)": "precedence trap: the next line really means x & (1 == 1)",
    "除法向零取整，右移向下取整": "division truncates toward zero, shifting floors",
    "移位数必须严格小于位宽：v << 32 与 v << -1 都是未定义行为": "the shift count must stay below the width: v << 32 and v << -1 are both undefined behaviour",
    "0 是异或的单位元": "0 is the identity element of XOR",
    "成对抵消，剩下落单的 9": "pairs cancel, the lone 9 survives",
    "三步交换：靠的是自逆性 a^b^b == a": "the three-step swap: it leans on self-inversion, a^b^b == a",
    "别名陷阱：两个名字指同一块内存": "aliasing trap: both names denote the same memory",
    "三步做完这一格变成 0，原值丢了": "after the three steps this cell holds 0; the original value is gone",
    "工程写法：语义清楚，也没有上面的坑": "the production form: clear meaning, none of the hazard above",
    "最高位不同即异号，不会像乘法那样溢出": "differing top bits mean differing signs, and unlike multiplication it cannot overflow",
    "lowbit：手写 -x 就是取反加一": "lowbit: -x written out as complement plus one",
    "抹掉最低位的 1，得到 8": "clear the lowest set bit, giving 8",
    "判 2 的幂必须带 x > 0，否则 0 会蒙混过关": "a power-of-two test needs x > 0, otherwise 0 slips through",
    "循环次数就是 1 的个数": "the loop runs exactly as often as there are set bits",
    "同一件事的三种写法：手写循环、编译器内建、标准库，可移植性依次上升": "three ways to do one job: hand loop, compiler builtin, standard library — portability rises in that order",
    "INT_MIN 取负本身是未定义行为，所以 lowbit 的参数要先转成无符号": "negating INT_MIN is itself undefined behaviour, so convert to unsigned before taking a lowbit",
    "n 位全 1 的掩码：(1u << n) - 1 在 n 等于位宽时是未定义行为": "an n-bit all-ones mask: (1u << n) - 1 is undefined behaviour when n equals the width",
    "业务层只问「能不能写」": "the business layer only asks 'may I write'",
    "枚举 all 的全部非空子集：每一步仍是子集，且严格变小，不重不漏": "enumerate every non-empty subset of all: each step is still a subset and strictly smaller, no repeats and no misses",
    "剪掉含 Exec 的组合": "prune combinations containing Exec",
    "同一个问题「数 1 的个数」的三种写法，复杂度量级并不相同": "three implementations of one task, counting set bits, with different complexity classes",
    "逐位取：O(位宽)": "bit by bit: O(width)",
    "消最低位：O(1 的个数)": "clear the lowest set bit: O(popcount)",
    "自查两组边界：换成 0 三处都应是 0，换成 ~0ull 三处都应是 64": "check two boundary inputs: for 0 all three print 0, for ~0ull all three print 64",
    "终止条件：规模缩到这里的出口": "base case: the exit the shrinking size reaches",
    "「递」路上做的事：前序位置": "work done on the way down: the pre-order slot",
    "参数严格变小，才会触底": "the argument must strictly shrink, or there is no bottom",
    "「归」路上做的事：后序位置": "work done on the way back: the post-order slot",
    "栈深度就是帧数的上限：show(1000000) 会在触底之前段错误": "stack depth bounds the frame count: show(1000000) segfaults long before the base case",
    "下面的 fact 不是尾递归：乘 n 发生在返回之后，帧必须留着": "the fact below is not tail recursive: the multiply by n happens after the return, so the frame must survive",
    "两半都还有候选时取较小的：相等取左边，这一句就是「稳定」的全部来源": "while both halves have candidates take the smaller, and on a tie take the left — this one line is the whole source of stability",
    "空区间或单元素：天然有序，这就是基例": "empty range or one element: already sorted, this is the base case",
    "这样写才不会在 l + r 很大时溢出": "written this way, l + r cannot overflow",
    "合并是 O(n)：复杂度主要落在这一步": "merging is O(n): most of the complexity lands here",
    "子集（元素可重复）：每层从 start 往后挑，回来就撤销": "subsets with repeatable elements: each level picks from start onwards and undoes on the way back",
    "每个节点都是一个解，不只是叶子": "every node is an answer, not just the leaves",
    "同层去重：前提是已经排序": "deduplicate within a level: requires the input to be sorted first",
    "选择": "choose",
    "递归到下一层": "recurse to the next level",
    "撤销：漏这一行就会多出大量重复解": "undo: drop this line and a flood of duplicate answers appears",
    "6 个子集，含空集": "6 subsets, the empty one included",
    "记忆化三件套：纯函数、可编码的键、一个「没算过」的哨兵值": "the memoisation trio: a pure function, an encodable key, and a sentinel meaning 'not computed'",
    "基例：0 和 1": "base cases: 0 and 1",
    "拿引用写回，省掉一次拷贝": "write back through a reference to skip one copy",
    "命中缓存": "cache hit",
    "斐波那契恒非负，所以 -1 才配当哨兵；换成有负答案的题要另开 visited 表": "Fibonacci is never negative, so -1 may serve as the sentinel; a problem with negative answers needs a separate visited table",
    "90 层递归还在栈深度范围内": "90 levels of recursion still fit on the stack",
    "把同一个 fib 走完四档：指数递归 -> 记忆化 -> 自底向上 -> 滚动变量": "run one fib through all four rungs: exponential recursion, memoisation, bottom-up, rolling variables",
    "表长最容易少开一位：这里必须是 n + 1": "the table length is the easiest thing to under-allocate: it must be n + 1 here",
    "只留上一格：空间 O(1)，代价是没法反推路径": "keep only the previous cell: O(1) space, paid for by losing the ability to reconstruct the path",
    "三档结果必须完全一致，不一致就说明某处基例或遍历顺序写错了": "the three rungs must agree exactly; disagreement means a base case or a loop bound is wrong",
    "同一条递推的三种形态：朴素递归 -> 记忆化 -> 自底向上填表": "one recurrence in three forms: naive recursion, memoisation, bottom-up table",
    "这里 0 恰好不是合法答案，才配当哨兵": "0 happens never to be a legal answer here, which is what makes it usable as a sentinel",
    "边界来自题意，不是抄来的": "the boundaries come from the statement, not from a template",
    "前两列必须相等；rec 只敢算到 20，再大就是指数爆炸": "the first two columns must match; rec is only safe up to 20, beyond that it explodes exponentially",
    "状态定义示范：cur 就是「以 i 结尾」的最大子段和，即 dp[i]": "state definition in action: cur is the maximum subarray sum ending at i, i.e. dp[i]",
    "前面的和已成负担就丢掉，这一句就是转移": "drop the running sum once it hurts — that line is the transition",
    "答案是所有 dp[i] 的最值，不是最后一个": "the answer is the extreme over all dp[i], not the last one",
    "全负数组返回最大负数，而不是 0": "an all-negative array returns the largest negative, not 0",
    "一维背包：内层遍历方向决定它解的是 0/1 背包还是完全背包": "the 1D knapsack: the inner direction decides whether it solves 0/1 or unbounded",
    "dp[j]：容量上限为 j 时的最大价值": "dp[j]: best value with capacity at most j",
    "逆序：读到的 dp[j-w] 仍是上一轮的值": "reverse order: the dp[j-w] read still belongs to the previous round",
    "顺序：本轮刚更新的值还能再取一次，即无限取": "forward order: a cell just updated this round can be used again, i.e. unlimited copies",
    "8：第 1 件与第 3 件各一次": "8: item 1 and item 3 once each",
    "9：第 1 件取三次": "9: item 1 taken three times",
    "dp[i]：以 i 结尾，所以初值全是 1": "dp[i]: ending at i, so every cell starts at 1",
    "答案是 max dp[i]，不是最后一个格子": "the answer is max dp[i], not the final cell",
    "tails[k]：长度 k+1 的递增子序列的最小结尾": "tails[k]: the smallest tail among increasing subsequences of length k+1",
    "严格递增用 lower_bound，允许相等就用 upper_bound：这一格决定 AC 还是 WA": "strictly increasing takes lower_bound, non-decreasing takes upper_bound: this cell decides AC versus WA",
    "替换：把这条长度的尾巴换得更短": "replace: make the tail for this length shorter",
    "只有长度可信，tails 本身未必是一条真实序列": "only the length is trustworthy; tails itself need not be a real sequence",
    "清单落到代码上：初始化、内层方向、不可达标记，是最容易错的三处": "the checklist in code: initialisation, inner direction and the unreachable marker are the three slipperiest spots",
    "求「恰好凑出 j 的最少硬币数」：不可达必须是正无穷，不能是 0": "fewest coins to make exactly j: unreachable must be positive infinity, never 0",
    "顺序：硬币可重复使用，即完全背包": "forward order: coins are reusable, i.e. the unbounded knapsack",
    "方案数：dp[0] = 1 表示「什么都不选也算一种方案」": "counting ways: dp[0] = 1 because choosing nothing is itself one way",
    "正确答案是 2 2；若把不可达初始化成 0，min 就会把非法值当成答案": "the correct output is 2 2; initialise unreachable as 0 and min happily returns an illegal value"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_ALGO1);