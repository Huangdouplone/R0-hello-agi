/* ================================================================
 * R0:hello agi · 课程深化层 STL1（s12 STL 顺序容器 / s13 STL 关联容器 / s14 迭代器与算法）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把 STL 三章从「会调用接口」深化到「知道代价与陷阱」——连续内存与缓存、
 *       扩容与迭代器失效、红黑树与哈希表的取舍、operator[] 的静默插入、
 *       严格弱序与 erase-remove，并为每章各加一节「综合重构」收口课。
 * 写法约定：
 *   1) 既有课节不写 title —— 合并时自动沿用主数据标题，从机制上杜绝「标题被改写」；
 *   2) 新课（12-6 / 13-5 / 14-6）写 title / title_en / target / target_en，并出现在 order 里；
 *   3) 多章文件：order 与 quizAdd 都用 {sid:[...]}，desc/goal 不生效；
 *   4) code 里的中文注释全部在 codeComments 里给出英文映射；
 *   5) 英文条数与中文严格一致。
 * ================================================================ */

const DEEPEN_STL1 = {
  stages: ["s12", "s13", "s14"],

  order: {
    s12: ["12-1", "12-2", "12-3", "12-4", "12-5", "12-6"],
    s13: ["13-1", "13-2", "13-3", "13-4", "13-5"],
    s14: ["14-1", "14-2", "14-3", "14-4", "14-5", "14-6"]
  },

  lessons: {

    /* ===================== s12 STL 顺序容器 ===================== */
    "12-1": {
      min: 13,
      summary: [
        "vector 是可变长度数组：元素挤在一块连续内存里，`v[i]` 就是「基址 + i × 元素大小」的直接寻址，随机访问 O(1)——这正是它成为默认容器的根本原因。",
        "连续内存意味着缓存友好：遍历上百万个元素时 CPU 预取能一路命中，实测常比「理论上更快」的 list 快好几倍；链表的优势只有在 n 大且改动发生在中间时才兑现。",
        "`push_back` 发现没有空位就扩容：另找一块更大的（通常 1.5 或 2 倍）内存，把全部元素搬过去再释放旧块——所以单次追加是摊还 O(1)，但搬的那一次很贵。",
        "搬家的同时地址也换了：此前拿到的所有迭代器、指针、引用一并失效，在 `reserve`/`resize`/`push_back` 之后继续用旧迭代器是标准明文规定的未定义行为。",
        "`size()` 是已构造的元素数，`capacity()` 是已申请到的槽位数；`reserve(n)` 只预留容量、不改 size——所以 reserve 之后写 `v[0]` 依然越界，要 `resize` 才真的有元素。",
        "已知大致规模就先 `reserve`：一次预留省掉 log 次扩容与整体拷贝，这是 vector 上性价比最高的优化，循环里逐个 push 上万元素时差距肉眼可见。",
        "访问分两档：`v[i]` 不检查下标（越界即 UB），`v.at(i)` 越界抛 `std::out_of_range`；调试期用 at、确认无误再换回 []；`front()/back()` 在空容器上同样是 UB。",
        "衔接：本章假设 s7 的指针与内存模型、s11 的模板概念已经就位；12-2 看 vector 的两个亲戚（定长 array 与双端 deque），12-6 再把全部容器放到同一张表里选型。"
      ],
      summary_en: [
        "A vector is a growable array whose elements share one contiguous block, so v[i] is just base plus i times the element size; O(1) random access is exactly why it is the default container.",
        "Contiguous storage is cache-friendly: scanning a million elements lets the hardware prefetcher run unbroken, so a vector often beats a theoretically faster list by several times — the list only wins when n is large and edits land in the middle.",
        "When push_back finds no free slot it grows: allocate a bigger block (usually 1.5x or 2x), move every element there, free the old one. A single append is therefore amortised O(1), but the growing step itself is expensive.",
        "Moving changes the address: every iterator, pointer and reference taken earlier becomes invalid, and still using one after reserve/resize/push_back is undefined behaviour as the standard spells out.",
        "size() counts constructed elements and capacity() counts allocated slots; reserve(n) only buys slots and leaves size alone, so v[0] is still out of bounds right after reserve — you need resize to actually have elements.",
        "Reserve whenever you can roughly guess the size: one reservation removes log-many reallocations and full copies, the best value-for-money optimisation on a vector, and it visibly matters once you push tens of thousands of items.",
        "There are two access grades: v[i] does not check the index (out of range is UB) while v.at(i) throws std::out_of_range — debug with at, ship with []; front() and back() on an empty vector are UB too.",
        "Bridge: this chapter assumes the pointer/memory model of s7 and the templates of s11 are in place; 12-2 covers two vector relatives (fixed-size array and double-ended deque), and 12-6 puts every container on one chart."
      ],
      code: `#include <vector>
#include <iostream>
int main() {
    std::vector<int> v;
    v.reserve(100);            // 一次预留容量，避免反复扩容搬家
    std::cout << v.size() << ' ' << v.capacity() << '\\n';   // 0 100：有槽位但还没有元素
    // 此刻写 v[0] 依然越界：只有 resize 才真的构造元素
    v.resize(3);               // 0 0 0：现在 size() 才是 3

    std::vector<int> w{1, 2, 3, 4, 5};
    auto it = w.begin();
    w.insert(w.begin() + 1, 99);      // 中间插入：后面 4 个元素整体后移，O(n)
    // it 可能已经随扩容换到新内存：下面这行故意留着别开，它是崩溃现场
    // std::cout << *it;
    w.push_back(6);                   // 尾部追加：摊还 O(1)
    for (int x : w) std::cout << x << ' ';
    return 0;
}`,
      pit: "在遍历 vector 的过程中 push_back：一旦触发扩容，`begin()/end()` 与手里的迭代器全部指向已释放的旧内存，程序可能照样跑对几十次，然后在某个规模突然崩——这是 UB 的典型剧本，不是偶发运气问题。",
      pit_en: "Pushing back while iterating a vector: once growth triggers, begin()/end() and every iterator you hold point into freed memory. The program may appear correct for dozens of runs and then collapse at one particular size — a textbook UB script, not bad luck.",
      ex: {
        q: "为什么中间插入是 O(n)，而尾部 push_back 只算摊还 O(1)？",
        a: "中间插入要把之后每个元素逐个后移（一次 memmove），代价与长度成正比；尾部追加通常只写一个空槽，只有偶发的扩容才整体搬迁，平摊到每次追加就是 O(1)。",
        q_en: "Why is a middle insert O(n) while push_back counts as amortised O(1)?",
        a_en: "A middle insert slides every later element back (one memmove) in proportion to the length; an append usually writes a single free slot, and only the occasional reallocation moves everything, which averages out to O(1)."
      }
    },

    "12-2": {
      min: 12,
      summary: [
        "`std::array<T, N>` 就是一个带名字的定长数组：N 写在类型里，对象在栈上（作为成员时直接内联），没有堆分配，`sizeof` 正好等于 N 个元素——它相对 C 数组的核心改进是「不会退化成指针」。",
        "因为长度是类型的一部分，`array<int,3>` 与 `array<int,4>` 是两个互不相干的类型：不能互相赋值，也没法用同一个形参接两种长度；长度可变的请老实用 vector。",
        "array 提供 `.size()/.at()/.begin()/.end()`，可整体拷贝、可用 `==` 逐元素比较，因此能被当返回值直接传出函数——原生 C 数组做不到，这就是 s6 里「数组不能返回」的解药。",
        "`std::deque`（双端队列）的实现是「一段段定长块 + 一张块索引表」：块内连续、整体不连续，这一句决定了它全部的取舍。",
        "因此 deque 的 `push_front/push_back/pop_front/pop_back` 都是 O(1)，而 vector 的 `insert(begin(), x)` 要把所有元素后移，是 O(n)——这是「既要头插又要下标」时唯一合理的选择。",
        "deque 仍支持 `[]`，但每次访问多查一层块表，实测比 vector 慢一档；中间插入同样是 O(n)，而且它没有「往哪半边挪更省」的判断力，别把它当成「能头插的 vector」随手用。",
        "deque 在两端加块时不搬已有元素，所以指针与引用保持稳定（迭代器仍然失效）；vector 一扩容就全失效——需要把元素地址长期交给外部时，这是选 deque 的正当理由。",
        "衔接：12-3 看另一条摆脱头插与中间挪动的路（链表），它用每个元素两个指针的代价换来「永不搬家」。"
      ],
      summary_en: [
        "std::array<T,N> is a named fixed-size array: N is written into the type, the object lives on the stack (inline as a member), there is no heap allocation, and sizeof is exactly N elements — its core gain over a C array is that it does not decay to a pointer.",
        "Because the length is part of the type, array<int,3> and array<int,4> are unrelated: you cannot assign one to the other nor take both with one parameter — reach for vector when the length can vary.",
        "array ships .size()/.at()/.begin()/.end(), copies wholesale and compares elementwise with ==, so it can be returned from a function by value — a plain C array cannot, which is the cure for s6's 'arrays cannot be returned'.",
        "std::deque is built as fixed-size chunks plus an index table of chunks: contiguous inside a chunk, non-contiguous overall. That single fact decides all of its trade-offs.",
        "Hence push_front/push_back/pop_front/pop_back are all O(1), where vector's insert(begin(), x) shifts every element and costs O(n) — deque is the only sane choice when you need both front edits and indexing.",
        "A deque still offers [], but each access pays one extra chunk-table lookup, making it measurably slower than vector, and middle insertion is still O(n); it also lacks the wisdom to shift whichever side is shorter, so do not treat it as a vector that can also grow at the front.",
        "Adding or removing at either end never moves existing elements, so pointers and references stay valid (iterators still invalidate), whereas any vector reallocation invalidates everything — a legitimate reason to pick deque when outsiders keep element addresses.",
        "Bridge: 12-3 shows the other escape from front insertion and shifting — a linked list, which pays two pointers per element so that it never has to move anything."
      ],
      code: `#include <array>
#include <deque>
#include <iostream>
int main() {
    std::array<int, 4> a{1, 2, 3, 4};   // 定长、栈上、零开销
    a[0] = 10;                           // 能改内容，改不了长度
    // 编译错误：4 个和 3 个是不同类型，长度本身就写在类型里
    // std::array<int, 3> b = a;
    std::cout << a.size() << ' ' << sizeof(a) << '\\n';   // 4 16：长度写在类型里

    std::deque<int> d{2, 3};
    d.push_front(1);                     // 头部 O(1)：vector 做不到
    d.push_back(4);
    int mid = d[2];                      // 仍支持下标，只是比 vector 多一层间接
    std::cout << mid << ' ' << d.front() << ' ' << d.back() << '\\n';
    return 0;
}`,
      pit: "把函数参数写成 `void f(std::array<int,3>&)`，换一种长度就编不过：长度是类型的一部分，接「任意长度的定长数组」要写模板参数，或者直接收 vector 与迭代器区间。",
      pit_en: "Declaring a parameter as void f(std::array<int,3>&) fails the moment a different length shows up: the length is part of the type, so accepting any fixed array needs a template parameter, or simply take a vector or an iterator pair.",
      ex: {
        q: "什么情况下 deque 才是对的选择，而不是 vector？",
        a: "当你确实需要两端的 O(1) 增删、又还需要按下标访问（或者必须让外部长期持有元素引用）时；这三条里缺任何一条，vector 通常更快更省。",
        q_en: "When is deque actually the right choice rather than vector?",
        a_en: "When you genuinely need O(1) at both ends and still want indexing (or must let outsiders keep element references); drop any one of those and vector is usually faster and lighter."
      }
    },

    "12-3": {
      min: 12,
      summary: [
        "`std::list` 是双向链表：每个元素单独在堆上包一个节点，含 prev/next 两个指针——存 100 万个 int 实际占的内存是 vector 的好几倍。",
        "更贵的不是内存而是缓存：节点散落在堆各处，遍历每走一步都可能一次 cache miss，所以「list 插入快」在真实机器上常常只是纸面结论。",
        "它换来的是两件事：拿到迭代器之后 `insert/erase` 是 O(1) 且不搬动任何别的元素，以及除被删节点外所有迭代器与引用永不失效——这是它存在的唯一硬理由。",
        "没有 `[]`：`std::next(v.begin(), k)` 在 vector 上是 O(1) 的指针算术，在 list 上就是一步一步走 k 次，为「找到插入位置」付出的开销常常大于省下的挪移。",
        "所以它的真实战场很窄：要在两个表之间反复搬移元素（`splice` 是常数时间、零拷贝，vector 完全做不到），或者必须对外提供长期稳定的引用与迭代器。",
        "`forward_list` 是单链表，省掉一个 prev 指针，代价是没有 `size()`（要自己数）；它用 before 迭代器表达前驱，接口比 list 更别扭，只在「极致省内存 + 头插为主」时才考虑。",
        "排序与去重是成员函数：`lst.sort() / lst.unique() / lst.merge() / lst.remove()`——`std::sort` 要求随机访问迭代器，链表给不了，硬套会直接编译失败；`unique` 只去相邻重复，必须先排序。",
        "衔接：12-4 把这些容器的公共接口抽出来，掌握它之后换容器只是改一个类型名；这也是理解 s14 迭代器类别的前置。"
      ],
      summary_en: [
        "std::list is a doubly linked list: every element is wrapped in its own heap node carrying prev and next, so a million ints really occupy several times what a vector needs.",
        "Memory is not the worst part — cache is: nodes scatter across the heap, each step of a traversal risks a miss, and 'lists insert faster' frequently stays a paper result on real hardware.",
        "What you buy is two things: given an iterator, insert/erase is O(1) and moves nobody else, and every other iterator and reference stays valid for its whole life — the only solid reason list exists.",
        "There is no []: std::next(v.begin(), k) is O(1) pointer arithmetic on a vector and k pointer hops on a list, so the cost of finding the insertion point often exceeds the moving it saved.",
        "Its honest battlefield is therefore narrow: shuttling elements repeatedly between two lists (splice is constant time with zero copies and vector cannot do it at all), or exposing long-lived stable references and iterators.",
        "forward_list is a singly linked list that saves one prev pointer but loses size(), which you must count yourself; it expresses predecessors through before-iterators and reads awkwardly, worth considering only for minimal nodes that are mostly head-inserted.",
        "Sorting and de-duplicating are member functions — lst.sort(), lst.unique(), lst.merge(), lst.remove(): std::sort demands random-access iterators, which a list cannot supply, so forcing it fails to compile; and unique only removes adjacent duplicates, hence sort first.",
        "Bridge: 12-4 extracts the interface all these containers share, after which switching container is one type name — which is also the ground s14's iterator categories stand on."
      ],
      code: `#include <list>
#include <vector>
#include <iostream>
int main() {
    std::list<int> lst{3, 1, 4, 1, 5};
    // lst 没有下标：想取第 3 个元素只能从头走两步
    auto it = lst.begin();
    ++it; ++it;                           // 定位是 O(n)，不是 O(1)
    lst.insert(it, 99);                   // 已知位置插入：O(1)，不搬动任何人
    it = lst.erase(it);                   // erase 返回下一个有效迭代器
    lst.sort();                           // 成员函数：std::sort 用不了链表
    lst.unique();                         // 只去相邻重复，所以必须先排序
    std::vector<int> v(lst.begin(), lst.end());   // 真要随机访问就一次性转存
    for (int x : v) std::cout << x << ' ';
    return 0;
}`,
      pit: "为了「中间插入快」而换成 list，却每次插入前都从 `begin()` 走一遍找位置——总复杂度还是 O(n²)，而且把连续访问换成指针追逐后实测更慢。链表只在「迭代器已经在手上」时才有优势。",
      pit_en: "Switching to list for fast middle insertion and then walking from begin() every time to find the spot — still O(n squared) overall, and now the walk chases pointers instead of streaming memory, so it measures slower. A list only wins when the iterator is already in your hand.",
      ex: {
        q: "为什么 `std::sort` 不能作用于 list，非要多写一个成员函数？",
        a: "因为通用 sort 依赖随机访问迭代器做分区与跳跃移动，链表只有双向逐步移动的能力；list::sort 改用归并加 splice，正好只依赖「节点链接可改」这一链表独有的能力。",
        q_en: "Why can't std::sort work on a list, forcing a separate member function?",
        a_en: "The generic sort partitions and jumps around using random-access iterators, which a list cannot provide; list::sort merges and splices instead, relying only on rewiring node links — something only a list can do."
      }
    },

    "12-4": {
      min: 12,
      summary: [
        "几乎所有容器都提供 `size()/empty()/clear()/swap()`、构造与赋值、逐元素的 `==` 与 `<`，外加一对 `begin()/end()`——记住这套共性，换容器时只改类型名。",
        "`[begin, end)` 是半开区间：`end()` 是「最后一个元素之后」的哨兵，永远不可解引用；空容器上 `begin() == end()`，这是「这里什么都没有」的统一表达。",
        "迭代器类型随容器而变，别写死：用 `auto it = c.begin()`；只读时用 `cbegin()` 拿 `const_iterator`——在 const 成员函数里遍历只有这一条路。",
        "`size()` 返回无符号的 `size_type`：`for (int i = 0; i < v.size(); ++i)` 会有符号/无符号比较警告；更阴的是 `v.size() - 1` 在空容器上回绕成天文数字，循环直接越界。",
        "反向遍历用 `rbegin()/rend()`：它解引用时其实指向「往左一格」，所以要写 `++it` 才是从尾到头；反过来对 `begin()` 做 `--it` 在空容器上是 UB。",
        "容器拷贝是深拷贝（呼应 s9）：`auto b = a;` 会分配新内存并逐个复制；想廉价共享就传 `const auto&`，真要共享所有权用 `shared_ptr`。",
        "`insert` 返回指向新元素的迭代器，`erase` 返回指向「下一个」元素的迭代器——这两个返回值是 14-1 迭代器失效惯用法的支点，忽略它们就只能写成死循环或崩溃。",
        "只有 `vector`、`string`、`array` 保证元素连续存放（可用 `data()` 取裸指针）：要把内存直接交给 C 接口、文件写入或 SIMD，别的容器都得先复制一遍。"
      ],
      summary_en: [
        "Almost every container offers size()/empty()/clear()/swap(), construction and assignment, elementwise == and <, plus a begin()/end() pair — learn the common part and changing container means changing one type name.",
        "[begin, end) is half-open: end() is the sentinel one past the last element and must never be dereferenced; on an empty container begin() == end(), which is the single uniform way to say there is nothing here.",
        "The iterator type differs per container, so never spell it out: use auto it = c.begin(), and cbegin() when you only read — inside a const member function the const iterator is your only option.",
        "size() returns the unsigned size_type: 'for (int i = 0; i < v.size(); ++i)' warns about signed/unsigned comparison, and the nastier case is v.size() - 1 on an empty container, which wraps to a huge number and walks straight out of bounds.",
        "Reverse traversal uses rbegin()/rend(); dereferencing such an iterator really yields the element one slot to the left, so ++it is the correct way to walk back to front, while decrementing begin() on an empty container is UB.",
        "Copying a container is a deep copy (echoing s9): auto b = a; allocates fresh storage and copies each element, so pass const auto& when you only want to look, and use shared_ptr when ownership must really be shared.",
        "insert returns an iterator to the newly inserted element and erase returns one to the element after the removed one — these two return values are the pivot of the invalidation idiom in 14-1; ignore them and you end up either spinning or crashing.",
        "Only vector, string and array guarantee contiguous storage and expose data(); to hand raw memory to a C API, a file write or SIMD, every other container must be copied first."
      ],
      code: `#include <vector>
#include <set>
#include <string>
#include <cstddef>
#include <iostream>

template <class C>
void show(const std::string& tag, const C& c) {
    std::cout << tag << "(" << c.size() << "): ";
    for (auto it = c.begin(); it != c.end(); ++it) std::cout << *it << ' ';   // 所有容器同一套写法
    std::cout << '\\n';
}

int main() {
    std::vector<int> v{5, 1, 4};
    std::set<int> s{5, 1, 4};
    show("vector", v);
    show("set", s);              // 只换类型名：遍历代码不变，输出顺序却变了
    // 危险写法：size() 是无符号，空容器上 size() - 1 回绕成巨大值
    for (auto it = v.rbegin(); it != v.rend(); ++it) std::cout << *it << ' ';   // 反向：从尾到头
    return 0;
}`,
      pit: "用 `int i` 去接 `size()` 做减法，或在容器可能为空时写 `i < v.size() - 1`：无符号回绕后循环条件恒真，程序不报错地一路写到越界内存。改成「`for (std::size_t i = 1; i < v.size(); ++i)`」这种不减一的形式最稳。",
      pit_en: "Using an int to subtract from size(), or writing i < v.size() - 1 where the container may be empty: the unsigned wrap makes the condition permanently true and the loop calmly writes past the end. Rewriting it as 'for (std::size_t i = 1; i < v.size(); ++i)' avoids the subtraction entirely.",
      ex: {
        q: "为什么 `empty()` 比 `size() == 0` 更值得推荐？",
        a: "两者语义等价，但 empty() 对所有容器都保证常数时间、也不会被读成「先算长度再比较」，有些容器的 size() 甚至要遍历一遍；而且读代码的人一眼就看出你在判空。",
        q_en: "Why prefer empty() over size() == 0?",
        a_en: "They mean the same, but empty() is guaranteed constant time on every container and cannot be misread as 'compute the length then compare' — some size() implementations do walk the range — and readers instantly see that you are testing for emptiness."
      }
    },

    "12-5": {
      min: 12,
      summary: [
        "两者都是适配器：不实现新数据结构，只是把另一个容器的接口收窄，默认底层是 `deque`（所以都支持两端 O(1)），也可以显式换成 vector 或 list——`std::stack<T, std::vector<T>>`。",
        "收窄是功能不是缺陷：stack 没有遍历接口，逼你只能碰顶部；正因为碰不到中间，它才不需要随机访问，也不可能被误用成「一个很慢的 vector」。",
        "`pop()` 返回 `void` 而不是被弹出的值——这是刻意设计：若返回 T，「先拷贝再删除」的过程中一旦抛异常，那个元素就既不在容器里也没交到你手上，任何异常安全保证都补不回来。",
        "所以取值的正确顺序是先 `top()` 再 `pop()`，并且两步都必须在 `empty()` 为 false 时调用；对空栈 `top()`/`pop()` 都是未定义行为，标准库不做任何检查。",
        "`queue` 用 `push/pop/front/back`，弹出的永远是队首；`priority_queue` 默认是最大堆、`top()` 给出最大值，想要最小堆必须写三参数形式：`std::priority_queue<T, std::vector<T>, std::greater<T>>`。",
        "它们都没有 `clear()`：清空要么循环 `pop()`，要么整体赋一个空对象 `s = std::stack<T>{};`——后者更短，也更不容易在循环里手滑。",
        "什么时候真的该用：撤销栈、括号匹配、表达式求值、显式栈版 DFS 用 stack；BFS 层序、任务排队、生产者消费者用 queue；「每次只取最优先的那个」用 priority_queue（dsk 与 srec 章会反复遇到）。",
        "衔接：12-6 把 array/vector/deque/list 与这些适配器放进同一张选型表；下一章 s13 从「按下标找」跨到「按内容找」。"
      ],
      summary_en: [
        "Both are adaptors: they implement no new data structure and only narrow the interface of another container, deque by default (hence O(1) at both ends), and you can swap that base for vector or list with std::stack<T, std::vector<T>>.",
        "The narrowing is a feature: a stack exposes no traversal so you can touch only the top, and because the middle is unreachable it needs no random access and cannot be misused as a very slow vector.",
        "pop() returns void rather than the popped value on purpose: were it to return T, an exception thrown while copying that value would leave the element both removed from the container and never delivered to you, and no sane exception guarantee could patch that.",
        "So the correct order is top() then pop(), and both require a non-empty stack; calling top() or pop() on an empty one is undefined behaviour — the library checks nothing.",
        "queue gives push/pop/front/back and always removes the head; priority_queue is a max-heap by default with top() the largest, and the smallest needs the three-argument form std::priority_queue<T, std::vector<T>, std::greater<T>>.",
        "Neither has clear(): empty it by looping pop(), or shorter and safer by assigning a fresh object, s = std::stack<T>{}.",
        "When you really need them: stack for undo, bracket matching, expression evaluation and explicit-stack DFS; queue for BFS levels, job queues and producer/consumer; priority_queue for 'always take the most urgent one' (it recurs in dsk and srec).",
        "Bridge: 12-6 places array, vector, deque, list and these adaptors on one chart; next, s13 moves from finding by index to finding by content."
      ],
      code: `#include <stack>
#include <queue>
#include <vector>
#include <functional>
#include <iostream>
int main() {
    std::stack<int> st;
    st.push(1); st.push(2);
    if (!st.empty()) {                  // 先判空，再取值
        int top = st.top();             // top() 只看不拿
        st.pop();                       // pop() 返回 void：这是异常安全的代价
        std::cout << top << '\\n';
    }
    // 对空栈调 top() 或 pop() 是未定义行为，标准库不检查
    std::queue<int> q;
    q.push(1); q.push(2);
    std::cout << q.front() << q.back() << '\\n';
    std::priority_queue<int> mx;                        // 默认最大堆
    std::priority_queue<int, std::vector<int>, std::greater<int>> mn;   // 三参数才是最小堆
    mx.push(3); mn.push(3);
    std::cout << mx.top() << ' ' << mn.top() << '\\n';
    st = std::stack<int>{};              // 没有 clear()：整体赋空值来清空
    return 0;
}`,
      pit: "把 `pop()` 当成「取走并返回」来写：`int x = st.pop();` 直接编译失败，于是有人改成 `int x = st.top();` 却忘了后面的 `st.pop();`——栈顶永远不变，循环不结束。两句必须成对出现。",
      pit_en: "Writing int x = st.pop() as if pop handed the value back fails to compile, and the 'fix' of int x = st.top() without the following st.pop() leaves the top unchanged so the loop never ends. The two calls are a matched pair.",
      ex: {
        q: "为什么标准库要让 `pop()` 返回 void，看起来只是多写一行？",
        a: "因为「返回值 + 删除」这两步不是原子的：如果按值返回时抛异常，元素已被删除却没交出去，数据凭空消失；返回 void 让调用方先用 top() 拷贝、成功后再 pop()，才可能给出强异常保证。",
        q_en: "Why does pop() return void when it looks like one extra line?",
        a_en: "Because 'return the value' and 'erase it' are not atomic: if the copy for the return throws, the element is gone from the container yet never reached you. Returning void lets you copy with top() first and pop only afterwards, which is what makes a strong guarantee possible."
      }
    },

    "12-6": {
      title: "综合重构：顺序容器选型与内存账",
      title_en: "Synthesis: Choosing a Sequence Container and Counting Its Cost",
      min: 15,
      target: "拿到一个需求，能在半分钟内选定容器，并说清它的内存布局、各操作复杂度，以及最可能踩的三处失效点。",
      target_en: "Given a requirement, choose a container within half a minute and state its memory layout, per-operation complexity, and the three invalidation points most likely to bite.",
      summary: [
        "先把默认规则立住：没有具体理由就用 `vector`。它是唯一同时满足「连续内存 + O(1) 随机访问 + 尾部摊还 O(1) + 迭代器实现最简」的容器，在真实 CPU 上几乎总是最快。",
        "五问自查清单：长度编译期已知？→ `array`。两端都要 O(1) 且仍需下标？→ `deque`。要跨容器零拷贝搬移节点或长期稳定引用？→ `list`。只允许碰端点或最值？→ `stack`/`queue`/`priority_queue`。以上都不是？→ `vector` 并先 `reserve`。",
        "反直觉但重要：list 的「任意位置 O(1) 插入」前提是你已经把那个位置的迭代器拿在手里；为找位置付出的 O(n) 指针追逐，通常比 vector 里 O(n) 的 memmove 更贵，因为后者对缓存极友好。",
        "内存这本账要一起算：vector 只存元素（外加 size 与 capacity 之间的空槽）；deque 多一张块索引表；list 每个元素额外两个指针加一次独立堆分配——100 万个 int，vector 约 4 MB，list 轻松超过 32 MB。",
        "失效规则背三句就够：vector 一搬家全失效、被动过的位置之后失效；deque 两端加删只失效迭代器、引用还活着；list 只失效被删的那一个。map/set 走 list 那条规则，留给 s13。",
        "本章最容易翻的五个车：边遍历边 `push_back`；`size() - 1` 在无符号上回绕；把 `reserve` 当 `resize` 用；对空容器调 `front()/back()/top()`；以为 `pop()` 会把值交给你。",
        "自查方法：给每个可疑点写一个「故意错」的小程序，开 `-Wall -Wextra` 再配 `-fsanitize=address`（sdbg 章正式讲）跑一遍——让崩溃现场替你记住规则，比读十遍文字有效得多。",
        "去向：容器会存了，s13 解决「按内容而不是按下标找」，s14 解决「不写 for 循环就把它们处理完」；这三章合起来才是 STL 的完整日常。"
      ],
      summary_en: [
        "Settle the default first: unless you have a concrete reason, use vector. It is the only container that simultaneously offers contiguous memory, O(1) random access, amortised O(1) append and the simplest possible iterator, which on a real CPU is nearly always fastest.",
        "The five-question chart: size known at compile time? array. O(1) needed at both ends while still indexing? deque. Zero-copy node moves between containers or long-lived stable references? list. Allowed to touch only an end or the extreme? stack, queue, priority_queue. None of these? vector, plus a reserve up front.",
        "Counter-intuitive but important: list's O(1) insert anywhere assumes you already hold that iterator, and the O(n) pointer chasing to find it is usually dearer than vector's O(n) memmove, which the hardware streams through contiguous memory happily.",
        "Do the memory accounting alongside: vector stores elements (plus empty slots between size and capacity); deque adds a chunk map; list adds two pointers and a separate allocation per element — a million ints cost roughly 4 MB in a vector and easily more than 32 MB in a list.",
        "Three sentences cover invalidation: vector invalidates everything on reallocation and everything from the touched position otherwise; deque end operations invalidate iterators but keep references alive; list invalidates only the erased node. Associative containers follow the list rule — that is s13.",
        "The five crashes of this chapter: push_back while iterating, size() - 1 wrapping unsigned, using reserve where resize was needed, calling front()/back()/top() on an empty container, and expecting pop() to hand the value back.",
        "How to self-test: write one deliberately wrong little program per hazard, build with -Wall -Wextra plus -fsanitize=address (formalised in sdbg) and let the crash report teach you the rule — one real stack trace beats ten readings of prose.",
        "Where this goes next: with storage settled, s13 handles looking things up by content rather than index and s14 handles processing them without writing loops; together the three chapters are the everyday STL."
      ],
      code: `#include <array>
#include <deque>
#include <list>
#include <vector>
#include <iostream>

// 选型练习：同一件活，四种容器各写一遍再比较
int main() {
    std::array<int, 3> a{3, 1, 2};
    std::deque<int>  d{3, 1, 2};
    std::list<int>   l{3, 1, 2};
    std::vector<int> v{3, 1, 2};

    v.erase(v.begin());                 // 头部删除：vector 是 O(n)，其余元素要前移
    d.pop_front();                      // 头部删除：deque O(1)
    l.erase(l.begin());                 // 头部删除：list O(1)，且不影响别人的迭代器
    // 自查三问：要不要随机访问？要不要两端 O(1)？迭代器必须长期存活吗？
    std::cout << a.size() << ' ' << d.size() << ' ' << l.size() << ' ' << v.size() << '\\n';
    return 0;
}`,
      pit: "在需求文档里看到「列表」两个字就选 `std::list`——这是纯字面匹配的错误。业务说的「列表」九成是「一组按顺序的东西」，该回到 vector；只有能明确说出 splice 或稳定引用需求时，list 才成立。",
      pit_en: "Reading the word 'list' in a specification and reaching for std::list — pure pattern matching, and wrong. What a product calls a list is nine times out of ten 'an ordered bunch of things', which belongs in a vector; a list is justified only when you can name the splice or the stable-reference requirement.",
      ex: {
        q: "为什么「默认用 vector」在真实项目里几乎总是对的，哪怕复杂度表上别的容器更优？",
        a: "因为复杂度表数的是操作次数，而实际耗时由缓存决定：连续内存让每次访问都命中预取，多数程序的瓶颈是遍历与访问而不是插入位置，vector 在这两点上没有对手。",
        q_en: "Why is 'vector by default' nearly always right in real projects even when the complexity table favours something else?",
        a_en: "Because the table counts operations while wall-clock time is set by the cache: contiguous memory lets every access feed the prefetcher, and most programs are bound by traversal and access rather than by where things are inserted — and on those vector has no rival."
      }
    },

    /* ===================== s13 STL 关联容器 ===================== */
    "13-1": {
      min: 13,
      summary: [
        "`std::map<K,V>` 是一棵红黑树（自平衡二叉搜索树）装着的 `pair<const K, V>`：元素按键升序排列，查找、插入、删除都是 O(log n)，而且这个界在最坏情况也成立。",
        "O(log n) 并不免费：每个节点要存父子指针和颜色位，插入还可能触发旋转，节点又散落在堆各处——一次查找就是一串指针追逐，同规模数据通常比 `unordered_map` 慢好几倍。",
        "`m[k] = v` 的语义是「键不存在就先插入一个值初始化的 V，再返回它的引用」，所以它同时能读能写；只用它来查询会静默造出一个 `V{}` 条目，把表撑大，还会让后面所有「这个键存不存在」的判断失真。",
        "只查询的正确工具：`find(k)` 返回迭代器（和 `end()` 比）、`count(k)` 返回 0 或 1、`insert({k,v})` 在键已存在时不覆盖并返回 `pair<iterator,bool>`；想覆盖就老老实实写 `m[k]=v` 或用 C++17 的 `insert_or_assign`。",
        "遍历天然按 key 升序，这是 map 相对哈希表唯一买得到的功能优势；范围查询配 `lower_bound/upper_bound`（返回迭代器），要一次拿一整段就用 `equal_range`。",
        "键不可改：迭代器解引用得到的是 `pair<const K,V>`，因为改了 `first` 就让树里的位置和排序脱节，编译器直接从类型上禁止；要换键只能 `erase` 再 `insert`。",
        "排序规则来自比较器，默认 `std::less<K>`（要求 K 支持 `<`）：`std::map<std::string,int,std::greater<>>` 就是降序，自定义类型要么重载 `<` 要么传一个比较器；注意 `map<const char*,int>` 比的是指针地址而不是字符串内容，键请用 `std::string`。",
        "`multimap` 允许重复键、并且没有 `operator[]`（同名多个不知道该改哪一个），计数用 `count`、定位用 `lower_bound`、拿一整段用 `equal_range`。衔接：13-2 的 set 就是「只有键的 map」；本章假设 s12 的容器通用接口已经掌握。"
      ],
      summary_en: [
        "std::map<K,V> is a red-black tree (a self-balancing binary search tree) of pair<const K,V>: elements are ordered by key, and lookup, insertion and deletion are O(log n) with that bound holding even in the worst case.",
        "O(log n) is not free: each node carries parent and child pointers plus a colour bit, insertion may rotate, and nodes sit wherever the heap put them, so one lookup is a chain of pointer chases and the same data is typically several times slower than in an unordered_map.",
        "m[k] = v means 'insert a value-initialised V if the key is missing, then hand back its reference', so [] serves both reading and writing; using it only to read silently creates a V{} entry, inflates the table and makes every later existence test wrong.",
        "The read-only tools are find(k), which returns an iterator to compare with end(), count(k), which returns 0 or 1, and insert({k,v}), which leaves an existing key alone and returns pair<iterator,bool>; to overwrite deliberately write m[k]=v or use C++17's insert_or_assign.",
        "Traversal comes out ascending by key for free, which is map's one functional advantage no hash table offers; combine it with lower_bound/upper_bound for range queries and equal_range to grab a whole span in one call.",
        "Keys are immutable: dereferencing an iterator yields pair<const K,V> precisely because changing first would disagree with the node's place in the tree, so the compiler forbids it — changing a key means erase then insert.",
        "Order comes from the comparator, std::less<K> by default (so K needs <): std::map<std::string,int,std::greater<>> gives descending order, and a custom type either overloads < or gets an explicit comparator; beware that map<const char*,int> compares addresses rather than characters — key on std::string.",
        "multimap permits duplicate keys and has no operator[] (which of the equals would it overwrite); use count to size the group, lower_bound to land on the first and equal_range for the whole span. Bridge: 13-2's set is simply a map with keys only, and this chapter assumes s12's common container interface."
      ],
      code: `#include <map>
#include <string>
#include <iostream>
int main() {
    std::map<std::string, int> score;
    score["ann"] = 90;
    // 陷阱：只想查一下，却用了 []，键不存在就被悄悄插入
    if (score["bob"] > 0) std::cout << "bob 有分\\n";      // 此刻 score 里多了 bob = 0
    // 只查不写的正确姿势
    auto it = score.find("cat");
    if (it != score.end()) std::cout << it->second << '\\n';
    std::cout << score.count("ann") << '\\n';
    // insert 不会覆盖已有键，想覆盖请用 [] 或 insert_or_assign
    auto r = score.insert({"ann", 55});
    std::cout << std::boolalpha << r.second << ' ' << score["ann"] << '\\n';
    for (const auto& [name, pt] : score) std::cout << name << ':' << pt << ' ';   // 天然按键升序
    return 0;
}`,
      pit: "用 `map[\"键\"]` 做存在性判断：查一次就多插一个键，表只增不减，`size()` 越查越大；键名拼错不会有任何提示，只会得到一个「看起来正常」的 0。查询一律走 `find` 或 `count`（C++20 起用 `contains`）。",
      pit_en: "Testing existence with map[key]: every probe inserts a new entry, so the table only ever grows and size() inflates under your eyes, while a typo'd key silently yields a plausible-looking 0. Query through find or count (contains from C++20) instead.",
      ex: {
        q: "什么情况下 `map` 反而比 `unordered_map` 更合适？",
        a: "需要按键有序遍历或范围查询时、需要最坏情况有界的 O(log n)（例如怕被构造哈希冲突攻击）时、以及键只能提供 `<` 而无法给哈希函数时。",
        q_en: "When is map actually the better pick over unordered_map?",
        a_en: "When you need ordered traversal or range queries, when a bounded worst case matters (for instance against crafted hash collisions), or when the key can supply < but no hash."
      }
    },

    "13-2": {
      min: 12,
      summary: [
        "`std::set<T>` 就是「只有键的 map」：同一棵红黑树，只存键、自动去重、按键升序，增删查 O(log n) 且最坏有界——它是「有序」与「判存在」两件事的合订本。",
        "`insert(x)` 返回 `pair<iterator,bool>`，`second == false` 表示「这个值已经有了，什么都没发生」——不报错、不重复，靠这一个布尔就能一行判断「是不是第一次见到」。",
        "判重的正确写法是 `if (s.count(x))` 或 `if (s.find(x) != s.end())`；更省事的惯用法是 `if (s.insert(x).second)`：插进去了就说明没见过，一举两得。",
        "set 里的元素是 const 的，迭代器实际上也是 `const_iterator`：改值会破坏树的有序性，所以编译器直接禁止；要「改」只能先 `erase` 再 `insert`，用 `const_cast` 绕过去就是 UB。",
        "`multiset` 允许重复，而 `erase(value)` 会一次删掉所有等于该值的元素；只删一个必须写 `erase(s.find(value))`——这与 vector 上 `std::remove` 的行为完全不同，是本章最容易记混的一对。",
        "「10 万个数去重并升序输出」用 set 一行完成，但如果数据本来就躺在 vector 里，`sort` + `std::unique` + `erase` 往往更快也更省内存：整个过程在连续内存上跑，没有逐节点的堆分配。",
        "集合运算（`set_intersection / set_union / set_difference`）住在 `<algorithm>` 里，前提是两路输入都已排序，而且结果要写到输出迭代器（常配 `std::inserter(out, out.end())`）——两个 set 之间不存在 `+` 运算符。",
        "衔接：13-3 问的就是「如果我不需要有序，能不能再快一点」，答案是拿哈希表换平均 O(1)，同时把最坏退化和 rehash 一并接下来。"
      ],
      summary_en: [
        "std::set<T> is a map with keys only: the same red-black tree, automatic de-duplication and ordering, O(log n) with a worst-case bound — the bound volume of 'keep it sorted' and 'have I seen this'.",
        "insert(x) returns pair<iterator,bool> where second == false means 'this value was already here, nothing happened' — no error, no duplicate; that single boolean is enough for a one-line first-time-ever-seen test.",
        "The honest duplicate check is if (s.count(x)) or if (s.find(x) != s.end()); the even handier idiom is if (s.insert(x).second), which inserts and answers in one motion.",
        "Elements of a set are const and its iterators are effectively const_iterators: mutating a value would break the tree's ordering invariant, so the compiler forbids it — to change one, erase then insert, and using const_cast to sneak around it is UB.",
        "multiset permits duplicates, and erase(value) removes every equal element at once; to drop exactly one you must write erase(find(value)) — the opposite of std::remove's behaviour on a vector, and the easiest pair in this chapter to mix up.",
        "Pouring a hundred thousand numbers into a set deduplicates and sorts them in one line, but if the data already sits in a vector, sort plus std::unique plus erase is usually faster and lighter because it never allocates a node per element and stays contiguous.",
        "The set operations (set_intersection, set_union, set_difference) live in <algorithm>, require both inputs to be already sorted, and write through an output iterator, typically std::inserter(out, out.end()) — two sets do not add with a plus sign.",
        "Bridge: 13-3 asks the obvious follow-up — if I do not need order, can it be faster? The answer trades the tree for a hash table and takes on worst-case degradation plus rehashing as change."
      ],
      code: `#include <set>
#include <vector>
#include <algorithm>
#include <iostream>
int main() {
    std::vector<int> data{5, 1, 5, 3, 1, 9};
    std::set<int> s(data.begin(), data.end());        // 构造即去重 + 升序
    auto res = s.insert(7);
    std::cout << std::boolalpha << res.second << '\\n';    // true：真的是第一次见
    std::cout << s.insert(7).second << '\\n';               // false：已存在，什么都没发生
    // set 的元素是 const：想改只能先 erase 再 insert，别用 const_cast 绕
    // 更快的替代：数据本来就在 vector 里，就地排序再去重
    std::sort(data.begin(), data.end());
    data.erase(std::unique(data.begin(), data.end()), data.end());
    for (int x : data) std::cout << x << ' ';
    return 0;
}`,
      pit: "在 `std::set` 上写 `auto it = s.find(x); *it = newValue;`——编译就不过，于是有人 `const_cast` 强改。改完这个节点的位置不再符合二叉搜索树性质，之后的查找会静默走错分支；要改值只能 `erase` 再 `insert`。",
      pit_en: "Writing auto it = s.find(x); *it = newValue; does not compile, and const_casting around it leaves the node in a position that no longer satisfies the search-tree property, so later lookups silently take wrong branches. The only safe edit is erase followed by insert.",
      ex: {
        q: "为什么大量数据的一次性去重，`sort + unique` 常比逐个 `insert` 到 set 里更快？",
        a: "因为逐个 insert 要为每个元素分配一个堆节点、还要做 log n 次指针追逐，而排序整段在连续内存上跑、能被缓存与向量化照顾，总访存次数明显更低。",
        q_en: "Why is sort plus unique often faster than inserting into a set when you de-duplicate a big batch?",
        a_en: "Each insert allocates a heap node and pays log n pointer chases, whereas sorting works on contiguous memory that the cache and the vectoriser both help, so the total memory traffic is clearly lower."
      }
    },

    "13-3": {
      min: 13,
      summary: [
        "`unordered_map` 是哈希表：把键哈希成桶号，同桶的元素挂成一条链。查找均摊 O(1)，但最坏是 O(n)——所有键都撞进同一个桶时，它就退化成一条链表。",
        "退化不是理论玩笑：负载因子（`size()/bucket_count()`）超过 `max_load_factor()`（默认 1.0）就触发 rehash；哈希函数写得偏、或者键由对手可控（字符串、URL、ID）时，冲突可以被故意构造出来把一个接口拖死。",
        "rehash 会重建整张桶表：所有迭代器失效，但因为节点不搬家，指针与引用仍然有效——这一点和 vector 恰好相反。已知规模先 `reserve(n)` 让桶数一次到位，省掉边插边反复重建。",
        "它没有顺序，因此没有 `lower_bound/upper_bound`、无法按序遍历、无法做范围查询；需求里一出现「按 key 排序输出」或「取 [a,b] 之间的键」，就必须回到 `map`。",
        "`operator[]` 的静默插入在这里一模一样存在，而且更容易被忽略：`if (cnt[\"x\"] > 0)` 这类写法每跑一次就往表里塞一个新键，表只增不减，最后连「这个键出现过吗」都答不出来。",
        "自定义类型做键需要两样东西：一个 `std::hash<MyKey>` 特化（或显式传入的 hasher）和一个 `operator==`；只给哈希不给相等，两个「看起来相同」的键会同时留在表里。组合多个哈希不要简单写 `h1 ^ h2`（对称、易抵消），至少混合成 `h1 ^ (h2 + 0x9e3779b9U + (h1<<6) + (h1>>2))`。",
        "内存和速度是对着干的：unordered_map 的节点加桶数组明显比红黑树费内存，命中率还取决于哈希分布。实测上 string 键通常 unordered_map 完胜 map，而 0..N 的密集整数键反而是 `vector` 直接下标最快。",
        "取舍一句话：要顺序或要有界的最坏情况用 `map`，只要平均最快且键可哈希用 `unordered_map`，键是密集小整数就用 `vector` 当查表数组。衔接：13-4 看这两个容器真正装着的元素类型。"
      ],
      summary_en: [
        "unordered_map is a hash table: the key hashes to a bucket number and same-bucket entries hang in a chain. Lookup is amortised O(1), but the worst case is O(n) — every key in one bucket leaves you a linked list.",
        "That worst case is not theoretical: exceeding the load factor (size()/bucket_count(), threshold max_load_factor(), 1.0 by default) triggers a rehash, and with a lopsided hash or attacker-controlled keys (strings, URLs, ids) the collisions can be built on purpose to stall a service.",
        "A rehash rebuilds the bucket array and invalidates every iterator, yet pointers and references survive because the nodes never move — precisely the opposite of vector. reserve(n) up front sizes the buckets once and spares you the repeated rebuilds.",
        "It has no order, so there is no lower_bound or upper_bound, no ordered traversal and no range query; the moment the requirement says 'print sorted by key' or 'all keys between a and b' you must go back to map.",
        "operator[]'s silent insert is present here too and easier to miss: a line like if (cnt[\"x\"] > 0) pushes a fresh key on every pass, so the table only grows and eventually even 'has this key been seen' cannot be answered.",
        "A custom key needs two things: a std::hash<MyKey> specialisation (or an explicit hasher) and operator== — hashing without equality lets two identical-looking keys coexist. Do not combine hashes with a bare h1 ^ h2, which is symmetric and cancels; mix, e.g. h1 ^ (h2 + 0x9e3779b9U + (h1<<6) + (h1>>2)).",
        "Memory and speed pull against each other: node plus bucket array costs clearly more than a tree, and the hit rate depends on how evenly you hash. In practice string keys make unordered_map beat map decisively, while dense 0..N integer keys are fastest as a plain vector index.",
        "In one line: need order or a bounded worst case, take map; need average speed with a hashable key, take unordered_map; keys are dense small integers, take a vector as the lookup table. Bridge: 13-4 examines the element type both of them actually store."
      ],
      code: `#include <unordered_map>
#include <string>
#include <functional>
#include <cstddef>
#include <iostream>

struct Pt { int x, y; };
struct PtHash {                        // 自定义键必须自己给哈希
    std::size_t operator()(const Pt& p) const {
        std::size_t h1 = std::hash<int>{}(p.x);
        std::size_t h2 = std::hash<int>{}(p.y);
        return h1 ^ (h2 + 0x9e3779b9U + (h1 << 6) + (h1 >> 2));   // 混合，别只写异或
    }
};
bool operator==(const Pt& a, const Pt& b) { return a.x == b.x && a.y == b.y; }   // 还得给相等

int main() {
    std::unordered_map<std::string, int> cnt;
    cnt.reserve(1024);                 // 已知量大：先 reserve，省掉反复 rehash
    cnt["a"] = 1; cnt["b"] = 2;
    ++cnt["a"];                        // 故意用 [] 的静默插入：不存在就先给 0
    std::cout << cnt.size() << ' ' << cnt.load_factor() << '\\n';
    // 查询请走 find：它不会像 [] 那样改写这张表
    std::cout << (cnt.find("zzz") == cnt.end() ? "absent" : "present") << '\\n';
    return 0;
}`,
      pit: "在循环里用 `unordered_map` 的 `[]` 做「查一下有没有」：每次未命中都插入一个默认值，表被自己的查询填满，`size()` 与内存一路上涨却看不出原因。查询用 `find/count`，只在真的要写入或计数时用 `[]`。",
      pit_en: "Using operator[] on an unordered_map inside a loop just to ask 'is it there': every miss inserts a default, so the table fills itself up with its own queries and size() and memory climb with nothing on screen to explain it. Query with find or count, and reserve [] for genuine writes.",
      ex: {
        q: "`reserve` 对 `unordered_map` 到底做了什么，为什么建表时调一次很值？",
        a: "它把桶数直接调到足以容纳 n 个元素且不超过最大负载因子，于是一次性避免了插入过程中反复 rehash——每次 rehash 都要重建桶数组、给全部元素重新定位，还会让已有迭代器集体失效。",
        q_en: "What does reserve actually do for an unordered_map, and why is one call at construction worth it?",
        a_en: "It raises the bucket count enough to hold n elements within the maximum load factor, removing the rehashes you would otherwise pay while inserting — each of which rebuilds the bucket array, relocates every element and invalidates all outstanding iterators."
      }
    },

    "13-4": {
      min: 12,
      summary: [
        "`std::pair<A,B>` 就是把两个值打包，`make_pair(a,b)` 自动推导类型；关联容器真正的元素类型是 `pair<const Key, Value>`，所以 `*m.begin()` 拿到的就是它，`it->first` 与 `it->second` 也由此而来。",
        "`first/second` 这两个名字是 pair 最大的缺点：连续出现三四个 `p.second` 之后没人记得它是分数还是时间戳——语义一旦超过「键和值」，请改成带字段名的 struct。",
        "解包有三种写法：直接 `p.first`、C++17 结构化绑定 `auto [k, v] = p;`（加 `&` 能写回原对象，也能在范围 for 里写 `for (auto& [k, v] : m)`），以及左值引用版的 `std::tie(a, b) = p;`。",
        "pair 的 `==` 与 `<` 是逐元素的字典序：`vector<pair<int,string>>` 排序就是「先按 first，first 相同再按 second」；把「优先级 + 名字」做成 pair 放进 set，就免费得到一个自定义排序队列，这是刷题高频套路。",
        "`std::tuple<A,B,C>` 是 pair 的推广，元素个数写在类型里；访问要用编译期下标 `std::get<0>(t)`，或按类型 `std::get<std::string>(t)`——后者要求该类型在元组里唯一，否则编译报错。",
        "tuple 的价值几乎全在通用代码与模板元编程里：打包返回多个值、转发一组参数、与 `std::function` 组合。业务代码里三个以上返回值请写 struct，`std::tuple<int,int,int,std::string>` 的可读性接近于零。",
        "结构化绑定对 tuple 和 struct 同样有效：`auto [x, y, z] = t;` 一行拆开；C++17 起还能用 `std::apply(f, t)` 把打包的参数直接喂给一个函数，省掉一串 `get`。",
        "衔接：13-5 把 map/set/unordered_* 对准「计数、去重、分组、Top-K」这些真实任务，做成一张能直接照抄的选型表。"
      ],
      summary_en: [
        "std::pair<A,B> packs two values and make_pair deduces the types; the real element type of an associative container is pair<const Key, Value>, which is exactly why *m.begin() gives you one and why it->first and it->second exist.",
        "first and second are also pair's greatest weakness: after three or four p.second in a row nobody remembers whether it is a score or a timestamp — once the meaning is more than key-and-value, define a struct with named fields.",
        "Three ways to unpack: p.first by hand, C++17 structured bindings auto [k, v] = p (add & to write back, and it works straight in a range-for as for (auto& [k, v] : m)), and the lvalue-reference form std::tie(a, b) = p.",
        "pair's == and < compare elementwise in lexicographic order, so sorting a vector<pair<int,string>> orders by first and then by second; keeping priority-and-name pairs in a set hands you a custom-ordered queue for free, which is a bread-and-butter interview move.",
        "std::tuple<A,B,C> generalises pair to any count, with the arity written into the type; access needs a compile-time index std::get<0>(t) or a type-based one std::get<std::string>(t), and the latter requires that type to appear exactly once.",
        "Nearly all of tuple's worth is in generic and template code: returning several values, forwarding an argument pack, composing with std::function. In business code a three-value return should be a struct, because std::tuple<int,int,int,std::string> reads as noise.",
        "Structured bindings unpack tuples and structs just as well (auto [x, y, z] = t;), and from C++17 std::apply(f, t) feeds the unpacked pack straight into a function so you never write a get chain.",
        "Bridge: 13-5 turns map, set and the unordered containers into a copy-usable chart aimed at counting, de-duplicating, grouping and Top-K."
      ],
      code: `#include <map>
#include <tuple>
#include <vector>
#include <string>
#include <algorithm>
#include <iostream>
int main() {
    std::map<std::string, int> m{{"a", 1}, {"b", 2}};
    for (auto it = m.begin(); it != m.end(); ++it) {
        // 解引用拿到的就是 pair<const string,int>：first 改不了
        std::cout << it->first << '=' << it->second << '\\n';
    }
    auto p = std::make_pair(3, std::string("x"));
    auto [n, s] = p;                   // 结构化绑定：名字终于有意义了
    std::cout << n << s << '\\n';
    std::vector<std::pair<int, std::string>> task{{2, "b"}, {1, "c"}, {1, "a"}};
    std::sort(task.begin(), task.end());           // 字典序：先 first，再 second
    std::tuple<int, double, std::string> t(1, 2.5, "k");
    std::cout << std::get<1>(t) << ' ' << task[0].second << '\\n';   // 下标是编译期常量
    return 0;
}`,
      pit: "`std::get<std::string>(t)` 在元组里有两个 string 时编译失败；更隐蔽的是 `std::tie`：它绑的是左值引用，用在返回 const 引用或临时对象的地方会留下悬空引用。只想只读地拆开，请用结构化绑定。",
      pit_en: "std::get<std::string>(t) fails to compile when the tuple holds two strings, and subtler: std::tie binds lvalue references, so pointing it at a returned const reference or a temporary leaves a dangling reference. Use structured bindings when you only need to read.",
      ex: {
        q: "什么时候该用有字段的 struct 而不是 `pair` 或 `tuple`？",
        a: "只要这一组值有业务语义、会被多处读取、或字段超过两个——结构体的字段名能出现在代码里，而 first、second、get<2> 会把「读代码」变成「查定义」。",
        q_en: "When should you reach for a struct with fields instead of pair or tuple?",
        a_en: "Whenever the group carries business meaning, is read in several places, or has more than two members: field names show up in the code, while first, second and get<2> turn reading into definition-hunting."
      }
    },

    "13-5": {
      title: "综合重构：关联容器选型（map / set / unordered_*）",
      title_en: "Synthesis: Choosing Among map, set and the Unordered Containers",
      min: 15,
      target: "给定一个查找需求，能一次说清该用哪个关联容器（或根本不该用关联容器），并给出复杂度、迭代器失效规则与一处静默陷阱。",
      target_en: "Given a lookup requirement, name the right associative container (or argue that none belongs there) together with its complexity, iterator-invalidation rule and one silent trap.",
      summary: [
        "四个问题定生死：要不要按键有序？要不要范围查询（只有有序给得了）？能不能接受最坏 O(n)（不能就选有序）？键可哈希吗（不可、又不想写 hasher，就回到有序）？四问全「否」→ `unordered_*`。",
        "复杂度这本账要连着常数一起算：红黑树 O(log n) 且最坏有界，代价是每节点三个指针加颜色位；哈希表均摊 O(1)、最坏 O(n)，代价是节点加桶数组。`log2(100 万) ≈ 20` 次比较也就是 20 次指针追逐，所以「平均 O(1)」通常是真赢，但不是数量级的赢。",
        "两者共同的静默陷阱是 `operator[]` 会插入默认值：查询一律 `find/count`（C++20 起 `contains`），写入才用 `[]` 或 `insert_or_assign`；计数场景的 `++cnt[k]` 是唯一被正面利用这个特性的写法。",
        "键不可改是硬规定：`map` 的 `first` 与 `set` 的元素都是 const，改了会让树中位置或桶归属与值脱节；要换键只能 erase 再 insert，C++17 的 `extract/merge` 能在不改键的前提下把节点整体搬到另一张表。",
        "失效规则比顺序容器简单，两条背完：`map/set` 插入不影响任何迭代器、只有被 erase 的那个失效（所以 `it = m.erase(it)` 是标准遍历删写法）；`unordered_*` 的 rehash 让所有迭代器失效但引用仍有效，erase 同样只失效被删者。",
        "别忘了第四个选项：键是密集小整数就用 `vector` 直接下标当查表（O(1)、连续、最省）；字符串只要前缀匹配时，「排序后的 vector + 二分」常常比 map 又快又小；能编码成小整数的「是否存在」用一个 `vector<bool>` 当位图。",
        "本章翻车点复盘：`if (m[\"typo\"])` 让表无限长大；在 `set` 里就地改元素；自定义结构体做 `unordered_map` 的键却忘了 hasher 或 `operator==`；rehash 之后继续用旧迭代器；以为 `multimap` 有 `[]`；测试里依赖 `unordered_map` 的遍历顺序。",
        "去向：存与查都会了，s14 解决「不写 for 循环就把这些数据算完」——那里的主角正是本章反复提到的迭代器，以及 `std::remove` 那个最著名的误会。"
      ],
      summary_en: [
        "Four questions settle it: do you need key order? do you need a range query (only ordered gives it)? can you accept a worst case of O(n) (if not, go ordered)? is the key hashable (if not, and you refuse to write a hasher, go ordered)? All no means unordered_*.",
        "Price the complexities together with their constants: a red-black tree gives O(log n) with a bound at three pointers plus a colour per node; a hash table gives amortised O(1) with an O(n) worst case, at node plus bucket array. log2 of a million is about 20 comparisons, which is also 20 pointer chases — so average O(1) usually does win, just not by orders of magnitude.",
        "The trap both share is operator[] inserting a default: query with find or count (contains from C++20), write with [] or insert_or_assign; ++cnt[k] in counting code is the one usage of that behaviour people endorse.",
        "Immutable keys are a hard rule: map's first and a set's element are const, because a changed value would disagree with its position in the tree or its bucket; changing a key means erase then insert, while C++17's extract and merge move a node between tables intact as long as the key itself stays put.",
        "Invalidation is simpler than in s12 and fits on two lines: inserting into map or set invalidates nothing and only the erased iterator dies (hence it = m.erase(it)); for the unordered containers a rehash invalidates every iterator while references survive, and erase again kills only the erased one.",
        "Do not forget the fourth option: dense small integer keys are fastest as a direct vector index (O(1), contiguous, smallest); for strings where only prefix matching is required, a sorted vector plus binary search often beats map on both speed and size; and membership over small integers is just a vector<bool> bitmap.",
        "Chapter crash review: if (m[\"typo\"]) inflating the table forever, editing a set element in place, keying an unordered_map with a custom struct but no hasher or operator==, reusing an iterator after a rehash, expecting multimap to have [], and tests that depend on unordered_map traversal order.",
        "Where next: with storage and lookup settled, s14 is about computing over all of this without writing loops — its leading actors are the iterators this chapter kept mentioning, and its most famous misunderstanding is std::remove."
      ],
      code: `#include <vector>
#include <map>
#include <unordered_map>
#include <string>
#include <iostream>

// 同一件活：统计单词出现次数，四种写法放一起对比
int main() {
    std::vector<std::string> words{"a", "b", "a", "c", "b", "a"};
    std::map<std::string, int> ordered;              // 要按字典序输出时它才值钱
    std::unordered_map<std::string, int> fast;       // 只要计数，顺序无所谓
    std::vector<int> hits(256, 0);                   // 键是密集小整数：直接下标当哈希表
    for (const auto& w : words) {
        ++ordered[w]; ++fast[w]; ++hits[static_cast<unsigned char>(w[0])];
    }
    for (const auto& [k, v] : ordered) std::cout << k << v << ' ';
    std::cout << fast.size() << ' ' << hits[static_cast<unsigned char>('a')] << '\\n';
    // 口诀：要顺序或范围查询用 map，只要平均快用 unordered_map，整数小键用 vector
    return 0;
}`,
      pit: "把「用哈希一定更快」当结论抄进设计文档：几十个元素的小表上，一次哈希加桶定位常常比一棵浅红黑树更慢，而且它没有有序遍历。选型必须带着数据规模与「要不要顺序」这两个前提才有意义。",
      pit_en: "Writing 'hashing is always faster' into a design doc: for a few dozen entries the hash plus bucket positioning often loses to a shallow tree, and there is still no ordered traversal. A choice is only meaningful with the size and the ordering requirement attached.",
      ex: {
        q: "同样是「统计次数」，什么时候不该用 map？",
        a: "键是密集整数（ID、字符、小范围枚举）时用 vector 按下标累加最快最省；数据已在内存且只需最终排序时用 vector 加 sort；只有「边来边查、键稀疏且要保持有序」才轮到 map 出场。",
        q_en: "For counting, when should you not use a map?",
        a_en: "When keys are dense integers (ids, characters, small enums) index straight into a vector; when the data is already resident and you only need a final ordering use vector plus sort; a map earns its place only for interleaved lookups over sparse keys that must stay ordered."
      }
    },

    /* ===================== s14 迭代器与算法 ===================== */
    "14-1": {
      min: 13,
      summary: [
        "迭代器是「泛化指针」，也是容器与算法之间唯一的胶水：容器只要提供 `begin()/end()`，算法只吃两个迭代器——这正是 s11 泛型思想在标准库里的落地，前置知识就是那一章。",
        "最小操作集是 `*it`（取值）、`it->m`（取成员）、`++it`（前进）加 `==`/`!=`；比较请写 `it != c.end()` 而不要写 `it < c.end()`——只有随机访问迭代器支持 `<`。",
        "`[begin, end)` 半开区间不是趣味而是设计：空区间首尾相等、区间长度正好等于元素个数、`[a,b)` 与 `[b,c)` 无缝拼接，这三条好处全来自「不含尾」，也解释了为什么 `erase(first,last)`、`copy(b,e,out)` 都写成含头不含尾。",
        "迭代器分五档（输入 / 输出 / 前向 / 双向 / 随机访问，外加 vector 那种连续存放）：档位决定能用哪些算法。`std::sort` 要随机访问，所以 list 用不了；把 list 换成 vector 一般编得过，反向一定编不过。",
        "`iterator` 与 `const_iterator` 是两个不同类型：`cbegin()/cend()` 永远给只读那一种，在 const 成员函数里遍历只能用它；const 与否要随场景变化时用 `auto` 让编译器推。",
        "本章最重要的一张表是失效规则：`vector` 的 `insert/push_back` 使插入点及其后全部失效、若触发扩容则全部失效，`erase` 使删除点及其后失效；`deque` 两端加删使所有迭代器失效但引用不失效；`list` 与 `map/set` 只失效被删的那一个。",
        "因此边遍历边删的唯一正确写法是：删的时候 `it = c.erase(it)`、不删才 `++it`，因为 `erase` 的返回值就是「下一个还活着的迭代器」；顺手写成 `c.erase(it++);` 在 vector 上是给已经失效的迭代器加一，属于 UB。",
        "范围 for 就是这套语法的糖：`for (auto& x : c)` 展开成 `for (auto it = c.begin(); it != c.end(); ++it) { auto& x = *it; }`——理解这一点，就明白它为什么不能边遍历边增删，也明白 `const auto&` 只是省一次拷贝。衔接 14-2：算法真正开始起作用的地方。"
      ],
      summary_en: [
        "An iterator is a generalised pointer and the only glue between containers and algorithms: a container need only supply begin()/end() and an algorithm consumes two iterators — s11's generic idea finally implemented, and that chapter is the prerequisite.",
        "The minimum vocabulary is *it, it->member, ++it and ==/!=; write while (it != c.end()) rather than it < c.end(), because only random-access iterators support the less-than operator.",
        "The half-open range [begin, end) is design rather than taste: an empty range has equal ends, the distance equals the element count, and [a,b) joins [b,c) with no gap — all three follow from excluding the tail, and they explain why erase(first,last) and copy(b,e,out) are written head-inclusive, tail-exclusive.",
        "Iterators come in five grades (input, output, forward, bidirectional, random access, plus the contiguous one vector has), and the grade decides which algorithms you may call: std::sort demands random access, so a list cannot use it; swapping list for vector usually still compiles, and never the other way round.",
        "iterator and const_iterator are different types; cbegin()/cend() always hand back the read-only one and are the only option inside a const member function — when constness is situational, take auto and let deduction settle it.",
        "The invalidation table is the most valuable thing in this chapter: on vector, insert and push_back invalidate from the insertion point on (and everything at all if they reallocate) while erase invalidates from that point on; deque end operations kill iterators but keep references; list and map/set invalidate only the erased element.",
        "Hence the single correct way to erase while walking: it = c.erase(it) when removing and ++it otherwise, because erase returns the next live iterator; the tempting c.erase(it++) increments an iterator that is already invalid, which is UB on a vector.",
        "A range-for is exactly this with the sugar on: for (auto& x : c) expands to the begin/end loop binding auto& x = *it, which is why it cannot insert or erase mid-walk and why const auto& merely skips a copy. Bridge: 14-2 is where algorithms earn their keep."
      ],
      code: `#include <vector>
#include <iostream>
int main() {
    std::vector<int> v{1, 2, 3, 4, 5, 6};
    for (auto it = v.begin(); it != v.end(); ++it) std::cout << *it << ' ';   // 手写迭代器循环
    for (const int& x : v) std::cout << x << ' ';        // 范围 for：同一段代码的糖
    // 边遍历边删：只有 erase 的返回值是下一个合法位置
    for (auto it = v.begin(); it != v.end(); ) {
        if (*it % 2 == 0) it = v.erase(it);              // 这里不写 ++it
        else ++it;
    }
    // 反例：v.erase(it++) 等于给已经失效的迭代器再加一，未定义行为
    std::cout << v.size() << '\\n';
    return 0;
}`,
      pit: "`*v.end()` 或 `v.begin() - 1` 这类操作在 release 下常常「看起来能用」，读到的是相邻内存里的旧值；遍历请始终用 `it != v.end()` 判着走，别用 `<`、也别靠猜。空容器上 `begin() == end()`，任何一次解引用都是越界。",
      pit_en: "Dereferencing v.end() or writing v.begin() - 1 often appears to work in a release build, reading leftovers in adjacent memory; while walking a range always test it != v.end(), never with < and never by guesswork. On an empty container begin() == end(), so any dereference is out of bounds.",
      ex: {
        q: "为什么标准库到处用「含头不含尾」的区间，而不是给出最后一个元素的迭代器？",
        a: "因为不含尾时区间长度恰好等于 end 减 begin、空区间自然表示成两个相等的迭代器、相邻区间能直接拼接，这三条让算法的边界条件一个都不用手写。",
        q_en: "Why does the library use head-inclusive, tail-exclusive ranges instead of an iterator to the last element?",
        a_en: "Because then the length is exactly end minus begin, the empty range is simply two equal iterators, and neighbouring ranges concatenate — three properties that let algorithms avoid writing any boundary case by hand."
      }
    },

    "14-2": {
      min: 13,
      summary: [
        "`<algorithm>` 里的算法一律作用于「迭代器区间」而不认识容器：`std::sort(v.begin(), v.end())` 换成对 C 数组的 `std::sort(a, a + n)` 思路完全同构——这就是 s11 泛型落到日常代码上的样子。",
        "`std::sort` 是内省排序（快排 + 堆排兜底 + 小区间插入排序），O(n log n)，而且**不稳定**：等值元素可能被交换，需要保持原有相对顺序就要换 `std::stable_sort`，代价是额外内存。",
        "比较器必须是严格弱序，`comp(a,b)` 的含义是「a 必须排在 b 前面」。写成 `return a.x <= b.x;` 会让元素与自己比也为真，算法据此把指针推到区间之外——轻则结果错，重则段错误，这是标准明文规定的未定义行为。",
        "多关键字排序别写一长串 if：`return std::tie(a.score, a.time) < std::tie(b.score, b.time);` 一行拿到字典序，而且天然满足严格弱序（注意 `tie` 造的是左值引用元组，别在需要 const 的场景误用）。",
        "`std::find` 是线性 O(n) 并返回迭代器，用它就必须和 `end()` 比一次；不比较就直接 `*std::find(...)` 是对空容器或找不到时越界的经典现场。只判存在请写 `count` 或 `std::any_of`，意图也更清楚。",
        "`binary_search / lower_bound / upper_bound` 是 O(log n)，但前提是区间**已经有序**：对没排序的 vector 调用不会报错，只会给出一个看着合理的随机位置——这类 bug 编译器与警告都救不了你。",
        "`lower_bound` 返回迭代器而不是布尔，想知道「到底找没找到」要再判 `*it == value`；`std::distance(it, v.end())` 在 vector 上是 O(1)、在 list 上是 O(n)，同一个函数名藏着两种代价。",
        "顺手记住这一族：`count_if / find_if / copy / fill / all_of / any_of / none_of / equal / mismatch / minmax_element`——它们能替你写完九成手写循环，每替换一次就少一个越界机会。衔接：14-3 处理「读一遍并产出别的东西」。"
      ],
      summary_en: [
        "Everything in <algorithm> consumes an iterator range and knows nothing about containers: std::sort(v.begin(), v.end()) and std::sort(a, a+n) over a C array are the same program — s11's genericity landing in everyday code.",
        "std::sort is introsort (quicksort with a heapsort fallback and insertion sort for short runs), O(n log n), and unstable: equal elements may be reordered, so when their original order matters switch to std::stable_sort and pay in extra memory.",
        "The comparator must be a strict weak ordering, where comp(a,b) reads 'a has to come before b'. Writing return a.x <= b.x makes an element compare before itself, and the algorithm then walks its pointers outside the range — wrong results at best, a segfault at worst, undefined behaviour by the standard.",
        "Skip the if-chain for multi-key sorting: return std::tie(a.score, a.time) < std::tie(b.score, b.time); gives lexicographic order in one line and is a strict weak ordering by construction (tie builds a tuple of lvalue references, so do not misuse it where constness matters).",
        "std::find is O(n) and returns an iterator, so the comparison with end() is mandatory; dereferencing the result without it is the classic out-of-bounds scene on an empty or unmatched container — use count or std::any_of when you only need existence, which also reads better.",
        "binary_search, lower_bound and upper_bound are O(log n) but assume the range is already sorted; called on an unsorted vector they raise no error and simply report a plausible-looking position — a bug no compiler or warning can catch.",
        "lower_bound hands back an iterator rather than a bool, so whether it was really found needs a second *it == value check; and std::distance(it, v.end()) is O(1) on a vector but O(n) on a list, one name hiding two price tags.",
        "Keep the rest of the family within reach: count_if, find_if, copy, fill, all_of, any_of, none_of, equal, mismatch, minmax_element — they write ninety percent of your hand loops and retire one off-by-one each time. Bridge: 14-3 handles reading once and producing something else."
      ],
      code: `#include <algorithm>
#include <functional>
#include <vector>
#include <string>
#include <tuple>
#include <iostream>
struct Student { std::string name; int score; };
int main() {
    std::vector<int> v{5, 2, 9, 1};
    std::sort(v.begin(), v.end());                        // 默认用 < ，O(n log n)
    std::sort(v.begin(), v.end(), std::greater<int>{});   // 降序
    // 比较器必须严格弱序：写 a <= b 会让元素和自己比也为真，可能直接崩溃
    std::vector<Student> cls{{"a", 90}, {"b", 75}, {"c", 90}};
    std::sort(cls.begin(), cls.end(), [](const Student& x, const Student& y) {
        return std::tie(x.score, x.name) < std::tie(y.score, y.name);   // 多关键字字典序
    });
    auto it = std::find(v.begin(), v.end(), 9);
    if (it != v.end()) std::cout << *it << '\\n';          // 先和 end 比，再解引用
    std::sort(v.begin(), v.end());
    auto lb = std::lower_bound(v.begin(), v.end(), 5);    // 前提：这段区间已经有序
    std::cout << (lb - v.begin()) << ' ' << (lb != v.end() && *lb == 5) << '\\n';
    return 0;
}`,
      pit: "比较器图省事写 `<=`（或 `>=`）：`std::sort` 在遇到等值元素时会把指针推到区间之外，小数据量常常看不出问题，数据一多直接段错误——这就是未定义行为最阴的样子：它不保证立刻坏。严格只写 `<` 或 `>`。",
      pit_en: "Taking the easy route and writing <= (or >=) in a comparator: std::sort then walks its pointers past the end whenever runs of equal elements appear, small inputs look fine and large ones segfault — the nastiest shape of undefined behaviour, which promises nothing breaks yet. Write only < or >.",
      ex: {
        q: "`std::sort` 和 `std::stable_sort` 怎么选？",
        a: "只在「等值元素的原有先后顺序有意义」时用 stable_sort（它多要一块临时内存），否则默认 sort 更快；真想保序又不想付内存，就把原始下标一并放进比较键里。",
        q_en: "How do you choose between std::sort and std::stable_sort?",
        a_en: "Reach for stable_sort only when the prior order of equal elements carries meaning (it wants scratch memory); otherwise plain sort is faster — and if you must preserve order cheaply, fold the original index into the comparison key."
      }
    },

    "14-3": {
      min: 12,
      summary: [
        "`for_each(b, e, f)` 就是一个「带返回值的循环」，`f` 依次拿到每个元素；想真的改元素，参数签名必须写 `auto&`——写成 `auto x` 改的是副本，跑完一切如旧，而且编译器一声不吭。",
        "`transform(b, e, out, f)` 是映射：读 `[b,e)`，把结果写到从 `out` 开始的位置。它有四个参数，而第三个「输出起点」正是最常被漏掉的那个。",
        "关键限制：算法从不改变容器长度。`transform` 只往已经存在的槽位里写，所以输出到另一个（空的）容器时必须把输出迭代器换成 `std::back_inserter(dst)`（它替你 `push_back`），或者先 `dst.resize(src.size())`——否则就是越界写，典型 UB。",
        "原地变换可以把同一个起点交两遍：`std::transform(v.begin(), v.end(), v.begin(), f);` 输入输出区间重叠在「输出不越过未读位置」时是安全的，这也是「每个元素翻倍」的最短写法。",
        "两者的取舍很实用：有副作用、没有产出物用 `for_each`；有产出（哪怕写回原处）用 `transform`——后者读起来是一条数据流，评审时更容易看出到底改了什么。",
        "`<numeric>` 里的 `accumulate(b, e, init)` 有初值类型陷阱：`accumulate(v.begin(), v.end(), 0)` 对 `vector<double>` 会把每一步截断成 int，1.5 加 2.5 得 3；对 `vector<int>` 累加大数还会整型溢出——写 `0.0` 或 `0LL` 才是在表达意图。",
        "同一族里常见的还有 `inner_product / partial_sum / adjacent_difference / iota`：`iota(b, e, 0)` 一行填出 0,1,2,...，是造测试数据和做「间接排序」（排下标数组而不是搬数据）的标准起手式。",
        "衔接：14-4 给这些算法填上真正灵活的 `f`——前面所有写不出来的规则，都是 lambda 要解决的部分。"
      ],
      summary_en: [
        "for_each(b, e, f) is a loop with a return value in which f receives each element; to really modify, the parameter has to be auto& — write auto x and you edit a copy, nothing changes afterwards, and the compiler says not a word.",
        "transform(b, e, out, f) is map: read [b,e), write results starting at out. It takes four parameters and the third, the output start, is precisely the one people forget.",
        "The hard restriction: no algorithm ever changes a container's length. transform only writes into slots that already exist, so targeting another (empty) container requires std::back_inserter(dst), which calls push_back for you, or a prior dst.resize(src.size()); anything else is an out-of-bounds write and textbook UB.",
        "For an in-place map, hand the same iterator over twice: std::transform(v.begin(), v.end(), v.begin(), f); overlapping ranges are safe as long as output never overtakes unread input, which makes 'double every element' the shortest line available.",
        "Choosing between them is practical, not stylistic: for_each when there is a side effect and no product, transform when there is a produced value even if it lands back in place — the latter reads as a data flow and is far easier to review.",
        "In <numeric>, accumulate(b, e, init) carries an initial-value type trap: over a vector<double> a seed of 0 truncates every step to int so 1.5 + 2.5 comes out as 3, and over a vector<int> large sums overflow — writing 0.0 or 0LL is what states your intent.",
        "Its neighbours you will actually use: inner_product, partial_sum, adjacent_difference and iota — iota(b, e, 0) fills 0,1,2,... in one call, the standard opening move for test data and for indirect sorting (permuting an index array instead of the payload).",
        "Bridge: 14-4 supplies the genuinely flexible f that all of these want; every rule you could not express so far is what the lambda exists to fix."
      ],
      code: `#include <algorithm>
#include <numeric>
#include <vector>
#include <iterator>
#include <iostream>
int main() {
    std::vector<int> v{1, 2, 3, 4};
    std::for_each(v.begin(), v.end(), [](int& x) { x *= 2; });   // 要改元素就得传引用
    std::transform(v.begin(), v.end(), v.begin(), [](int x) { return x * x; });   // 原地：输入输出同一起点
    std::vector<int> sq;
    // sq 是空的：写 sq.begin() 就是越界，必须换成 back_inserter 让它自己变长
    std::transform(v.begin(), v.end(), std::back_inserter(sq), [](int x) { return x + 1; });
    std::vector<double> d{1.5, 2.5};
    auto wrong = std::accumulate(d.begin(), d.end(), 0);      // 初值 0 是 int：全程截断，得 3
    auto right = std::accumulate(d.begin(), d.end(), 0.0);    // 初值决定累加用的类型
    std::cout << wrong << ' ' << right << ' ' << sq.size() << '\\n';
    return 0;
}`,
      pit: "`transform` 写到空 vector 的 `begin()` 上不报错：目标区间没有足够槽位就是往未分配的内存里写，可能当场崩、也可能安静地跑完再在别处炸。输出到新容器请一律 `std::back_inserter(dst)`，或先 `dst.resize(src.size())`。",
      pit_en: "Transforming into an empty vector's begin() raises no error: writing where no slot exists means writing unallocated memory, which may crash immediately or finish quietly and detonate later. Always use std::back_inserter(dst) for a fresh target, or dst.resize(src.size()) first.",
      ex: {
        q: "为什么 `accumulate` 的初值类型能决定结果对不对？",
        a: "因为累加的中间类型就是初值的类型：传 `0` 时每一步都按 int 相加并截断小数，传 `0.0` 才走浮点加法，传 `0LL` 才躲开整型溢出——它不看容器元素类型，只看你给的那个初值。",
        q_en: "Why can the type of accumulate's initial value decide whether the result is correct?",
        a_en: "Because the running total has the initial value's type: pass 0 and every step adds as int, chopping the fractions; pass 0.0 to get floating addition, or 0LL to dodge integer overflow — it never looks at the element type, only at what you seeded it with."
      }
    },

    "14-4": {
      min: 13,
      summary: [
        "语法是 `[捕获](参数) -> 返回类型 { 体 }`：捕获列表回答「怎么拿到外面的变量」，参数列表回答「进来的值是什么」，两者完全独立——新手常问的「[] 里能不能写参数」就是把这两件事混了。",
        "捕获形式：`[x]` 按值（拷贝一份，之后与原件无关）、`[&x]` 按引用（共享，原件变了它也变）、`[=]` 全部按值、`[&]` 全部按引用、`[this]` 访问成员、`[&x, y]` 混合；C++14 起还有初始化捕获 `[v = std::move(v)]`，这是「把所有权捕进 lambda」的标准写法。",
        "编译期它就是一个匿名类的对象：捕获的变量变成成员，函数体变成 `operator()`，而这个 `()` 默认是 const——所以要修改按值捕获的成员必须写 `mutable`；这也精确说明了捕获发生在创建 lambda 的那一刻。",
        "于是按值捕获有「冻结」效应：`int i = 1; auto f = [=]{ return i; }; i = 2;` 之后 `f()` 仍然是 1；而引用捕获有悬垂风险：把 lambda 存进容器、当返回值交出去、或丢给别的线程，等它真正执行时捕获的局部变量可能早已销毁——异步代码里最难查的一类 UB。",
        "规则可以压成一句：同一个函数内、立刻用掉的 lambda 用 `[&]` 很方便；任何会被带出去的 lambda（返回、存储、投递到线程池）绝不允许引用捕获局部变量，需要就按值捕获、用 `shared_ptr` 续命，或用初始化捕获搬进去。",
        "返回类型默认由 return 语句推导，多分支或递归推导不出来时要显式写 `-> int`；参数可以用 `auto`（C++14）得到泛型 lambda，`[](auto a, auto b){ return a < b; }` 对任何可比类型都成立。",
        "无捕获的 lambda 能隐式转成函数指针（可以递给 C 接口）；任何 lambda 都能塞进 `std::function<R(Args...)>`，但后者有类型擦除与可能的堆分配——作为算法的模板参数传时直接给 lambda 本体，别多包一层。",
        "衔接：14-5 会看到「手写一个重载 `operator()` 的类」和 lambda 其实是同一个东西的两种拼写，这层等价关系也是读懂标准库比较器源码的钥匙。"
      ],
      summary_en: [
        "The grammar is '[capture](params) -> return { body }': the capture list answers 'how do I reach the outside' and the parameter list answers 'what comes in', and they are wholly independent — asking whether parameters can go inside [] means conflating the two.",
        "Capture forms: [x] by value (a copy, unrelated thereafter), [&x] by reference (shared, follows the original), [=] all by value, [&] all by reference, [this] for members, [&x, y] mixed; from C++14 an initialising capture such as [v = std::move(v)] is the standard way to capture ownership.",
        "At compile time a lambda is an object of an anonymous class: captures become members and the body becomes operator(), which is const by default — so mutating a by-value capture needs the mutable keyword, and this is exactly what shows that capture happens the moment the lambda is created.",
        "By-value capture therefore freezes: after int i = 1; auto f = [=]{ return i; }; i = 2; calling f still yields 1. By-reference capture dangles: store the lambda, return it, or hand it to another thread, and by the time it runs the locals it captured may be long destroyed — the hardest class of UB in asynchronous code.",
        "One sentence to memorise: inside a single function, [&] is convenient for a lambda used immediately; any lambda that escapes — returned, stored, dispatched to a pool — must not reference-capture locals, so take them by value, keep them alive with shared_ptr, or move them in through an initialising capture.",
        "The return type is deduced from the return statements; several branches or recursion usually defeat deduction and you must write -> int explicitly. Parameters may be auto (C++14), giving generic lambdas such as [](auto a, auto b){ return a < b; } that work for any comparable pair.",
        "A capture-less lambda converts implicitly to a function pointer and can be handed to a C API; any lambda fits into std::function<R(Args...)>, at the price of type erasure and possibly a heap allocation — pass the lambda itself to an algorithm template parameter instead of wrapping it.",
        "Bridge: 14-5 shows that hand-writing a class with operator() is not a different technique but the same object spelled out by hand, which is also the key to reading the standard library's comparator sources."
      ],
      code: `#include <algorithm>
#include <vector>
#include <iostream>
int main() {
    int base = 10;
    auto byValue = [base](int x) { return x + base; };      // 拷贝一份：之后 base 变了也不影响它
    auto byRef   = [&base](int x) { return x + base; };     // 共享：base 变了结果跟着变
    base = 100;
    std::cout << byValue(1) << ' ' << byRef(1) << '\\n';     // 11 101：一个冻结一个跟随
    int calls = 0;
    auto counter = [&calls](int x) { ++calls; return x; };  // 引用捕获：外面的变量真的被改
    int keep = 1;
    auto acc = [keep](int x) mutable { keep += x; return keep; };   // 按值捕获要改就得 mutable
    std::vector<int> v{3, 1, 2};
    std::for_each(v.begin(), v.end(), counter);
    // 危险：把 [&] 的 lambda 返回出去或丢给别的线程，捕获的局部变量可能已经销毁
    std::cout << calls << ' ' << acc(5) << ' ' << keep << '\\n';
    return 0;
}`,
      pit: "把 `[&]` 的 lambda 交给线程或存进容器，而所在函数已经返回：它引用的栈变量早已销毁，运行到那一行才崩，栈还长得一切正常。凡是「延后执行」的 lambda，都要显式列出捕获项并按值或用 `shared_ptr` 持有。",
      pit_en: "Handing a [&] lambda to a thread or storing it in a container while the enclosing function returns: the stack variables it references are gone, and the crash lands much later on a suspiciously normal stack. Any lambda that runs later must list its captures explicitly and hold them by value or through shared_ptr.",
      ex: {
        q: "为什么按值捕获的成员在 `operator()` 里默认改不动？",
        a: "因为 lambda 的调用运算符默认是 const 成员函数，按值捕获只是它的常量成员；要改就加 `mutable`——这个默认值是为了让「看起来是纯函数」的 lambda 能被安全地拷贝与共享。",
        q_en: "Why can you not modify a by-value capture inside the body?",
        a_en: "Because a lambda's call operator is a const member function by default and by-value captures are its const members; add mutable to change one — the default exists so that functional-looking lambdas can be copied and shared safely."
      }
    },

    "14-5": {
      min: 12,
      summary: [
        "重载了 `operator()` 的类就叫函数对象（仿函数）：`struct bigger { bool operator()(int a, int b) const { return a > b; } };`，然后 `std::sort(v.begin(), v.end(), bigger{});`——交给算法的是一个对象，不是函数名。",
        "`const` 不是可省的装饰：算法内部是按值（或以 const 引用）保存你的比较器再调用的，签名少写 `const` 就会在模板实例化时报一大串看不懂的错误，很多新手正是卡在这里。",
        "`<functional>` 已经备好一整套标准仿函数：`std::less / greater / equal_to / plus / minus`，写 `std::sort(v.begin(), v.end(), std::greater<int>{})` 就是降序，不必自己造；C++14 起还有透明变体 `std::less<>`，让 `map<string,int>` 能用 `const char*` 直接查而省掉临时 string。",
        "「谓词」就是返回 bool 的规则：一元谓词 `bool f(x)` 服务 `count_if / find_if / remove_if`，二元谓词 `bool f(a,b)` 服务 `sort / unique / equal`——先数清算法要几元，比死记算法名省事得多。",
        "仿函数能携带状态，这既是它的强项也是陷阱：标准允许算法拷贝你的谓词，所以「在 `operator()` 里 ++count 统计调用次数」是不可靠的，你最后读到的可能是某一份副本的计数。",
        "什么时候还该写仿函数而不是 lambda：同一规则要在多个文件或很多地方复用、需要构造函数传进来的较多状态、或者「类型本身」要出现在模板签名里（透明比较器 `std::less<>` 就是靠类型参数工作的）。",
        "另一件只有仿函数能干净做到的事，是把带状态的哈希传给容器：`std::unordered_map<K,V,MyHash>` 第三个参数是类型，用 lambda 就得写 `decltype(f)` 并在构造时把实例传进去，可读性反而下降。",
        "衔接：14-6 把 14-1 到 14-5 合成一个可执行的改写练习——把一段手写循环换成「迭代器 + 算法 + 谓词」，顺手解决 `std::remove` 那个最著名的误会。"
      ],
      summary_en: [
        "A class with an overloaded operator() is a function object: struct bigger { bool operator()(int a, int b) const { return a > b; } }; then std::sort(v.begin(), v.end(), bigger{}); — what you pass to the algorithm is an object, not a function name.",
        "The const is not decoration: the algorithm stores your comparator by value, or as a const reference, and calls it through that, so omitting const fails at template instantiation with a wall of unreadable diagnostics, which is exactly where many learners stall.",
        "<functional> already ships the standard set — std::less, greater, equal_to, plus, minus — so std::sort(v.begin(), v.end(), std::greater<int>{}) is descending with no code of yours; C++14 added transparent variants such as std::less<>, letting map<string,int> be searched with a const char* without constructing a temporary key.",
        "A predicate is any rule returning bool: unary bool f(x) for count_if, find_if and remove_if, binary bool f(a,b) for sort, unique and equal. Counting the arity first is far cheaper than memorising which algorithm wants which.",
        "A functor can carry state, which is both its strength and its trap: the standard permits algorithms to copy your predicate, so incrementing a counter inside operator() is unreliable — the number you eventually read may belong to some copy.",
        "When to still write one rather than a lambda: the rule is reused across files, it needs real state or several constructor arguments, or the type itself must appear in a template signature (transparent comparators like std::less<> work precisely that way).",
        "There is also the job functors do more cleanly than lambdas — supplying a stateful hasher to a container, where unordered_map<K,V,MyHash> takes a type and a lambda would force decltype gymnastics plus an instance passed to the constructor.",
        "Bridge: 14-6 folds 14-1 through 14-5 into one rewrite drill — turn a hand-written loop into iterators plus an algorithm plus a predicate, and settle the most famous misunderstanding about std::remove while you are there."
      ],
      code: `#include <algorithm>
#include <functional>
#include <vector>
#include <iostream>
struct AtLeast {                      // 仿函数：可以携带状态
    int limit;
    bool operator()(int x) const { return x >= limit; }   // const 不能省
};
int main() {
    std::vector<int> v{1, 5, 3, 8};
    auto n = std::count_if(v.begin(), v.end(), AtLeast{5});
    std::sort(v.begin(), v.end(), std::greater<int>{});    // 标准库备好的二元仿函数
    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });   // 与上一行等价
    std::cout << n << ' ' << v.front() << '\\n';
    // 别指望在 operator() 里累加计数：算法允许拷贝你的谓词，读到的可能是副本
    return 0;
}`,
      pit: "仿函数忘写 `const` 会让算法「以 const 方式调用它」失败，报出一长串模板错误；另一个方向是以为成员计数器被调用者共享——算法可以随意拷贝谓词，统计请改用 `count_if` 的返回值，或在循环外面自己累加。",
      pit_en: "Forgetting const on operator() makes the algorithm's const-qualified call ill-formed and produces pages of template diagnostics; the opposite mistake is assuming a member counter is shared with the caller — algorithms may copy your predicate freely, so count via count_if's return value or accumulate outside the loop.",
      ex: {
        q: "既然 lambda 完全等价，为什么标准库自己到处还在用仿函数类型？",
        a: "因为无状态的仿函数不占空间、能被编译器完全内联、还能作为模板参数按名字传递，而带状态的场合（自定义哈希、透明比较器 `std::less<>`）需要一个能出现在类型签名里的名字——这些正是 lambda 给不了的。",
        q_en: "If lambdas are equivalent, why does the standard library still use functor types everywhere?",
        a_en: "Because a stateless functor occupies nothing, inlines completely and can be named as a template argument, and the stateful cases (custom hashers, the transparent std::less<>) need a type that can appear in a signature — the one thing a lambda cannot provide."
      }
    },

    "14-6": {
      title: "综合重构：用算法替代手写循环",
      title_en: "Synthesis: Replacing Hand-Written Loops with Algorithms",
      min: 15,
      target: "面对一段手写 for 循环，能判断它属于哪一类原语并改写成正确的算法调用，特别是 erase-remove 与 accumulate 初值这两处易错点。",
      target_en: "Given a hand-written for loop, classify which primitive it implements and rewrite it as a correct algorithm call, with special care for erase-remove and for accumulate's initial value.",
      summary: [
        "先分类再改写——循环只有五种原语：只读遍历（`for_each` / `copy`）、就地改元素（`transform`，或带引用的 `for_each`）、筛选（`copy_if` / `remove_if`）、统计（`count_if` / `accumulate` / `any_of` / `all_of`）、查找（`find` / `find_if` / `lower_bound`）。对不上这五类的循环，说明它本来就该被拆开。",
        "本章最大的误会：`std::remove(b, e, val)` 不删除任何东西，也不改变容器长度——它只是把「不该删的」元素依次前移，返回新的逻辑末尾，尾部那些位置仍是有效但未指定的值。",
        "所以真正的删除是 erase-remove 惯用法：`v.erase(std::remove(v.begin(), v.end(), 3), v.end());`，按条件删换成 `remove_if` 配 lambda；少写外层 `erase`，`v.size()` 纹丝不动。链表是例外：成员 `lst.remove / lst.remove_if` 自己就会改长度。",
        "「算法不改变长度」只有一剂解药：需要边算边长时，把输出迭代器换成 `std::back_inserter(dst)`，让每次写入变成一次 `push_back`（`transform`、`copy_if` 都收它）；绝不要把结果写进一个 resize 错大小的容器。",
        "改写换来的不只是短：算法替你消除了 off-by-one 与写坏的循环不变量，也把整段循环交给编译器去看（便于向量化与并行）；代价是密不透风的 lambda 很难单步——所以逻辑超过约三行就提成一个有名字的函数或 lambda 变量再传进去。",
        "复盘本章三连翻车：`accumulate` 初值写 `0` 把 `vector<double>` 截断、对未排序区间用 `lower_bound`、比较器写成 `<=` 破坏严格弱序。三者的共同点是都不报错，只给错误答案或偶发崩溃。",
        "自查清单（照抄可用）：这段循环改不改长度？→ `transform` 还是 `copy_if` 加 `back_inserter`。区间排序了吗？→ 才有资格用二分。比较器是严格弱序吗？→ 只写 `<` 或 `>`。谓词能被安全拷贝吗？→ 不要有副作用。删除之后自增谁负责？→ `it = c.erase(it)`。",
        "去向：s15 把这一整章的工具接到「文件里的文本」上——`string`、迭代器区间与算法组合起来，这些写法就会从练习变成你的日常肌肉记忆。"
      ],
      summary_en: [
        "Classify first; a loop is one of five primitives: read-only traversal (for_each or copy), in-place update (transform, or for_each with a reference), filtering (copy_if or remove_if), aggregation (count_if, accumulate, any_of, all_of) and searching (find, find_if, lower_bound). A loop matching none of them is a loop that should be split.",
        "This chapter's biggest misunderstanding: std::remove(b, e, val) deletes nothing and does not change the container's length — it only slides the survivors forward and returns the new logical end, leaving valid but unspecified values behind it.",
        "Real deletion is therefore the erase-remove idiom: v.erase(std::remove(v.begin(), v.end(), 3), v.end()), with remove_if plus a lambda for conditions; drop the outer erase and v.size() does not budge. A list is the exception that really deletes, because its member remove and remove_if change the length themselves.",
        "There is exactly one antidote to 'algorithms never grow a container': turn the output iterator into std::back_inserter(dst) so each write becomes a push_back (transform and copy_if both accept it) — and never instead write into a container you resized wrongly.",
        "The rewrite buys more than brevity: an algorithm removes the off-by-one and the broken invariant for you and shows the compiler the whole loop so it can vectorise; the price is that a dense lambda is hard to step through, so lift anything beyond roughly three lines into a named function or a named lambda variable.",
        "Three crashes close out the chapter: accumulate seeded with 0 truncating a vector<double>, lower_bound over an unsorted range, and a comparator written with <= that breaks strict weak ordering. All three share one property — no error is reported, only wrong answers or an occasional crash.",
        "A checklist you can copy verbatim: does this loop change length (transform, or copy_if with back_inserter)? is the range sorted (only then is binary search legal)? is the comparator a strict weak ordering (< or > only)? is the predicate copy-safe (no side effects)? who advances after an erase (it = c.erase(it))?",
        "Where next: s15 points every tool in this chapter at text coming out of a file, where string plus iterator ranges turn these idioms from exercises into everyday muscle memory."
      ],
      code: `#include <algorithm>
#include <numeric>
#include <vector>
#include <iterator>
#include <iostream>
int main() {
    std::vector<int> v{1, 2, 3, 4, 5, 6};
    // 改写 1：删掉所有偶数——remove 只负责前移，erase 才真的变短
    v.erase(std::remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }), v.end());
    // 改写 2：挑出大于 2 的放进新容器，算法不会替你长大
    std::vector<int> out;
    std::copy_if(v.begin(), v.end(), std::back_inserter(out), [](int x) { return x > 2; });
    // 改写 3：求和与判断，替掉累加变量加提前 break 的循环
    auto sum = std::accumulate(v.begin(), v.end(), 0LL);
    auto allPositive = std::all_of(v.begin(), v.end(), [](int x) { return x > 0; });
    std::cout << sum << ' ' << allPositive << ' ' << out.size() << ' ' << v.size() << '\\n';
    return 0;
}`,
      pit: "只写 `std::remove(...)` 就以为删完了：`size()` 不变、遍历时照样读到「已被移走」的旧值，函数返回后再 for 一遍会发现它们还在那儿。删元素永远写成 `v.erase(std::remove(...), v.end())` 这一整句。",
      pit_en: "Calling std::remove and assuming the elements are gone: size() is unchanged, a later traversal still sees the moved-from values, and one more loop shows them sitting exactly where they were. Deletion is always the whole sentence v.erase(std::remove(...), v.end()).",
      ex: {
        q: "为什么标准库要把「去掉」和「删除」拆成 `std::remove` 与 `erase` 两步，而不是给一个合并的版本？",
        a: "因为算法只拿得到两个迭代器，没有容器的所有权，无法调用 `pop_back` 去改长度；把「挪动元素」和「收缩容器」分开，正是让同一份算法能同时服务 vector、deque 和原生数组的设计代价。",
        q_en: "Why did the library split removal into std::remove plus erase instead of one combined operation?",
        a_en: "Because an algorithm only holds two iterators and has no say over the container, so it cannot call pop_back to shrink it; separating 'move the elements' from 'shorten the container' is precisely what lets one algorithm serve vector, deque and raw arrays alike."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择 / 判断 / 填空混排） ---------- */
  quizAdd: {
    s12: [
      {
        q: "`v.reserve(1000)` 执行后，下列哪个说法正确？",
        o: ["v.size() 变成 1000，可以直接写 v[999]", "v.capacity() 至少 1000，但 size() 不变，写 v[0] 仍然越界", "v 里多了 1000 个值为 0 的元素", "reserve 会立即把所有元素搬一次家"],
        a: 1,
        why: "reserve 只抬高 capacity（已申请的槽位数），不构造任何元素；要真的有元素得用 resize 或 push_back。",
        q_en: "After v.reserve(1000), which statement is correct?",
        o_en: ["size() becomes 1000 and v[999] is writable", "capacity() is at least 1000 but size() is unchanged, so v[0] is still out of bounds", "The vector now holds 1000 zero-valued elements", "reserve relocates every element immediately"],
        why_en: "reserve only raises capacity, the number of allocated slots; it constructs nothing, so you still need resize or push_back to have elements."
      },
      {
        q: "关于 vector 的迭代器与引用失效，下列正确的是？",
        o: ["push_back 未触发扩容时，指向已有元素的迭代器与引用仍然有效", "vector 在任何情况下插入都不会影响别人", "erase 只让被删那一个位置的迭代器失效", "reserve 一个更大的值不会使任何迭代器失效"],
        a: 0,
        why: "不扩容时只有插入点及其后（含 end()）失效，前面的元素没被搬动；erase 会使删除点之后全部失效；reserve 真抬高了容量就整体搬家、全部失效。",
        q_en: "Which claim about vector iterator and reference invalidation is correct?",
        o_en: ["If push_back does not reallocate, iterators and references to existing elements stay valid", "Insertion into a vector never disturbs anything", "erase invalidates only the iterator to the erased element", "Reserving a larger capacity invalidates no iterators"],
        why_en: "Without reallocation only the insertion point and everything after it (including end()) go bad; erase invalidates everything from that point on; and a reserve that really raises capacity relocates everything and invalidates all of it."
      },
      {
        q: "判断：`std::sort(lst.begin(), lst.end())` 可以正常给 `std::list` 排序。",
        type: "judge", a: 1,
        why: "链表迭代器只是双向的，而 std::sort 要求随机访问迭代器，这样写根本编译不过；请用成员函数 lst.sort()。",
        q_en: "True or false: std::sort(lst.begin(), lst.end()) sorts a std::list normally.",
        why_en: "False. A list only offers bidirectional iterators while std::sort demands random access, so the call does not even compile; use the member lst.sort() instead."
      },
      {
        q: "`std::array<int,3>` 不能赋值给 `std::array<int,4>`，因为数组的 ______ 是类型的一部分。",
        type: "fill", ans: ["大小", "长度", "size", "元素个数", "N"],
        why: "非类型模板参数 N 写进了类型，长度不同就是不同类型；要变长请用 vector，要「任意定长」请写模板参数，或直接收迭代器区间。",
        q_en: "std::array<int,3> cannot be assigned to std::array<int,4> because the array's ______ is part of its type.",
        why_en: "The non-type template argument N is baked into the type, so different lengths are different types; use vector for variable length, a template parameter for generic fixed length, or an iterator pair."
      }
    ],
    s13: [
      {
        q: "`std::map<std::string,int> m;` 为空，执行 `if (m[\"k\"] > 0) { }` 之后：",
        o: ["m 仍然为空", "m 多了一个键 \"k\"，值为 0", "编译错误", "抛出 out_of_range 异常"],
        a: 1,
        why: "operator[] 在键不存在时插入一个值初始化的 V 再返回其引用；只想查询应该用 find/count，C++20 起可用 contains。",
        q_en: "Given an empty std::map<std::string,int> m, after 'if (m[\"k\"] > 0) { }':",
        o_en: ["m is still empty", "m now holds the key \"k\" with value 0", "It does not compile", "It throws out_of_range"],
        why_en: "operator[] inserts a value-initialised V when the key is missing and returns its reference; for a pure lookup use find or count, and contains from C++20."
      },
      {
        q: "判断：`unordered_map` 的查找永远是 O(1)。",
        type: "judge", a: 1,
        why: "均摊 O(1)，最坏是所有键落进同一桶时的 O(n)；而且超过负载因子会 rehash，使全部迭代器失效。",
        q_en: "True or false: unordered_map lookup is always O(1).",
        why_en: "False. It is amortised O(1) with an O(n) worst case when every key lands in one bucket, and crossing the load factor triggers a rehash that invalidates every iterator."
      },
      {
        q: "`multiset` 里想只删除一个等于 x 的元素（而不是全部），应写成 `s.erase(s.______(x))`。",
        type: "fill", ans: ["find", "lower_bound"],
        why: "erase(value) 会删掉所有等值元素；只删一个必须传迭代器，erase(find(x)) 是最直接的写法。",
        q_en: "To remove exactly one element equal to x from a multiset (not all of them) you write s.erase(s.______(x)).",
        why_en: "erase(value) removes every equal element, so a single removal must pass an iterator — erase(find(x)) is the direct form."
      },
      {
        q: "关于 map 与 unordered_map 的选型，下列说法**错误**的是？",
        o: ["要按键有序遍历或做范围查询时选 map", "需要最坏情况复杂度有界时选 map", "unordered_map 一定比 map 更省内存", "键是 0..N 的密集小整数时，用 vector 下标往往最快"],
        a: 2,
        why: "哈希表有桶数组加节点开销，通常比红黑树更费内存，「一定更省」是错的；其余三条都是常见的正确判断。",
        q_en: "Which statement about choosing between map and unordered_map is WRONG?",
        o_en: ["Choose map when you need ordered traversal or range queries", "Choose map when a bounded worst case is required", "unordered_map is always the more memory-efficient of the two", "For dense small integer keys 0..N a vector index is usually fastest"],
        why_en: "A hash table pays for a bucket array plus nodes and is usually the heavier of the two, so 'always more economical' is false; the other three are sound judgements."
      }
    ],
    s14: [
      {
        q: "把 `v.erase(std::remove(v.begin(), v.end(), 3), v.end());` 的外层 erase 漏掉之后，会发生什么？",
        o: ["编译错误", "3 被删掉了，只是顺序变乱", "容器长度不变，尾部残留有效但未指定值的元素", "运行时立即崩溃"],
        a: 2,
        why: "std::remove 只把保留元素前移并返回新的逻辑末尾，它没有权限改变容器长度，所以必须再用 erase 收缩。",
        q_en: "What happens if you drop the outer erase from v.erase(std::remove(v.begin(), v.end(), 3), v.end());?",
        o_en: ["It fails to compile", "The 3s are deleted but the order is scrambled", "The length is unchanged and valid-but-unspecified values remain at the tail", "It crashes immediately at run time"],
        why_en: "std::remove only slides the survivors forward and returns the new logical end; it cannot change the container's length, which is the erase's job."
      },
      {
        q: "判断：`std::sort(v.begin(), v.end(), [](int a, int b) { return a <= b; });` 是合法写法。",
        type: "judge", a: 1,
        why: "比较器必须是严格弱序，<= 会让元素与自己比也返回真，算法据此把指针推到区间之外，属未定义行为，只能写 < 或 >。",
        q_en: "True or false: std::sort(v.begin(), v.end(), [](int a, int b) { return a <= b; }) is a legal call.",
        why_en: "False. A comparator must be a strict weak ordering; <= makes an element compare before itself, so the algorithm walks its pointers outside the range — undefined behaviour. Use < or > only."
      },
      {
        q: "`std::accumulate(d.begin(), d.end(), 0)` 对 `std::vector<double>` 求和会得到被截断的整数结果，应把初值改成 ______（写出字面量）。",
        type: "fill", ans: ["0.0", "0.0f", "0.00", "0.0d"],
        why: "累加的中间类型就是初值的类型，写 0.0 才走浮点加法；整数求和要防溢出则写 0LL。",
        q_en: "std::accumulate(d.begin(), d.end(), 0) truncates the sum of a std::vector<double> to an int; change the initial value to ______ (write the literal).",
        why_en: "The running total takes the initial value's type, so 0.0 gets floating addition; use 0LL when integer sums might overflow."
      },
      {
        q: "要把 src 的每个元素平方后写入**空的** dst，正确的写法是？",
        o: ["std::transform(src.begin(), src.end(), dst.begin(), f)", "std::transform(src.begin(), src.end(), std::back_inserter(dst), f)", "std::for_each(src.begin(), src.end(), f)", "std::copy(src.begin(), src.end(), dst.end())"],
        a: 1,
        why: "算法不改变容器长度，向空容器输出必须用 back_inserter 让它逐次 push_back，或者事先 dst.resize(src.size())。",
        q_en: "Which call squares every element of src into an empty dst?",
        o_en: ["std::transform(src.begin(), src.end(), dst.begin(), f)", "std::transform(src.begin(), src.end(), std::back_inserter(dst), f)", "std::for_each(src.begin(), src.end(), f)", "std::copy(src.begin(), src.end(), dst.end())"],
        why_en: "No algorithm changes a container's length, so output into an empty one needs back_inserter to push_back each result — or an up-front dst.resize(src.size())."
      }
    ]
  },

  /* ---------- 词典：分类统一为「C++ 系统深入」，已与既有名词查重 ---------- */
  terms: [
    { term: "连续内存布局", term_en: "Contiguous Memory Layout", cat: "C++ 系统深入",
      short: "元素在一段没有间隙的地址区间里排好，只有 vector、string、array 给这个保证。",
      short_en: "Elements packed into one gap-free address range — a promise only vector, string and array make.",
      detail: ["按下标访问退化成一个乘加，遍历时硬件预取一路命中，这是 vector 在真实机器上几乎总快过链表的根因。", "代价是整体搬移：中间插入，或容量需要翻倍时，全部元素得换个地方重摆。"],
      detail_en: ["Indexing collapses to one multiply-add and traversal lets the prefetcher run unbroken — the real reason vector beats a linked list on actual hardware.", "The price is wholesale movement: an insert in the middle, or a capacity doubling, relocates every element."],
      vs: "连续内存讲「元素怎么摆」，迭代器类别讲「算法能对这段地址做什么」。",
      vs_en: "Contiguous layout is about how elements sit; iterator categories are about what an algorithm may do with them." },
    { term: "vector 扩容", term_en: "Vector Reallocation", cat: "C++ 系统深入",
      short: "空间不足时另找更大的块、整体搬移、释放旧块，通常按 1.5 或 2 倍增长。",
      short_en: "Running out of room allocates a larger block, moves everything and frees the old one, usually growing 1.5x or 2x.",
      detail: ["搬的那一次是 O(n)，但平摊到每次 push_back 只剩 O(1)，这是「摊还复杂度」最教科书的例子。", "搬完地址就变了：此前保存的迭代器、指针、引用全部失效，是 vector 最常见的一类崩溃。"],
      detail_en: ["That single move is O(n), but spread over all the appends it costs O(1) each — the textbook case of amortised complexity.", "Afterwards the address differs, so every stored iterator, pointer and reference is invalid — the most common class of vector crashes."],
      vs: "扩容是把整块搬到新地址，reserve 只是提前把这件事一次性做完。",
      vs_en: "Reallocation moves the whole block to a new address; reserve just performs that once, in advance." },
    { term: "size 与 capacity", term_en: "Size Versus Capacity", cat: "C++ 系统深入",
      short: "size 是已构造的元素个数，capacity 是已申请、还能装多少个槽位。",
      short_en: "Size counts constructed elements; capacity counts allocated slots available before the next growth.",
      detail: ["reserve(n) 只抬 capacity、size 不变，所以之后 v[0] 依然越界；resize(n) 才真的构造或销毁元素。", "size 与 capacity 之间的空槽不是浪费，它们正是「下一次 push_back 不必搬家」的保险。"],
      detail_en: ["reserve(n) raises only capacity, so v[0] is still out of bounds afterwards; resize(n) is what actually constructs or destroys elements.", "The empty slots between size and capacity are not waste — they are the insurance that the next push_back need not move anything."],
      vs: "reserve 管「有没有地方放」，resize 管「里面到底有没有东西」。",
      vs_en: "reserve is about whether there is room; resize is about whether anything is in it." },
    { term: "缓存友好性", term_en: "Cache Friendliness", cat: "C++ 系统深入",
      short: "同一趟访问里地址越连续，缓存行命中越多，实测速度往往由它而非大 O 决定。",
      short_en: "The more contiguous an access pattern, the more cache lines you reuse — and real speed tracks this more closely than big-O.",
      detail: ["list 每个节点一次独立堆分配、散落在地址空间各处，遍历等于不断踩 miss，所以「O(1) 插入」常常输给 vector 的 memmove。", "评估容器时算完大 O 还要再问一句：这一趟是顺序扫，还是指针追？"],
      detail_en: ["Each list node is its own allocation scattered through the address space, so traversal is a chain of misses and O(1) insertion frequently loses to a vector memmove.", "After the big-O, ask one more question about a container: is this pass a linear scan or a pointer chase?"],
      vs: "复杂度数的是操作次数，缓存友好性给每次操作定价。",
      vs_en: "Complexity counts operations; cache friendliness sets the price of each one." },
    { term: "容器适配器", term_en: "Container Adaptor", cat: "C++ 系统深入",
      short: "stack、queue、priority_queue 不实现数据结构，只是把另一个容器的接口收窄。",
      short_en: "stack, queue and priority_queue implement no data structure; they narrow the interface of another container.",
      detail: ["默认底层是 deque，也可换成 vector 或 list：std::stack<T, std::vector<T>>；收窄接口是设计意图，逼你只碰被允许的那一端。", "正因为它不新增存储，它的复杂度就等于底层容器对应操作的复杂度。"],
      detail_en: ["The default base is deque but vector or list can be substituted, as in std::stack<T, std::vector<T>>; the narrowed interface is deliberate so you only touch the end the abstraction allows.", "Since an adaptor adds no storage of its own, its complexity is exactly the base container's for those operations."],
      vs: "容器决定「数据怎么存」，适配器决定「允许你怎么碰它」。",
      vs_en: "A container decides how data is stored; an adaptor decides how you are allowed to touch it." },

    { term: "红黑树", term_en: "Red-Black Tree", cat: "C++ 系统深入",
      short: "map 与 set 的底层：自平衡二叉搜索树，增删查最坏 O(log n) 且按键有序。",
      short_en: "The engine behind map and set: a self-balancing binary search tree giving ordered keys and O(log n) with a bound.",
      detail: ["有序是别的东西买不到的：范围查询、按序遍历、lower_bound 全都依赖这条中序性质。", "每个节点要存父子指针与颜色位，节点分散在堆上，一次查找就是一串缓存不友好的指针追逐。"],
      detail_en: ["Ordering is what nothing else buys you: range queries, ordered traversal and lower_bound all rest on the in-order property.", "Each node keeps parent and child pointers plus a colour bit and sits wherever the heap put it, so one lookup is a chain of cache-unfriendly pointer chases."],
      vs: "红黑树用有界的 O(log n) 换有序，哈希表用可能的最坏退化换平均 O(1)。",
      vs_en: "A red-black tree pays bounded O(log n) to gain order; a hash table accepts a possible worst case to gain average O(1)." },
    { term: "哈希桶", term_en: "Hash Buckets", cat: "C++ 系统深入",
      short: "unordered_* 的骨架：把键哈希成桶号，同桶的元素挂成一条链。",
      short_en: "The skeleton of the unordered containers: keys hash to a bucket number and same-bucket entries chain together.",
      detail: ["查找变成「一次哈希 + 桶内短链比对」，所以均摊 O(1)；哈希分布不均或桶内链一长就直接退化到 O(n)。", "桶数组本身要额外内存，而且键必须同时提供哈希与 operator==，两者缺一不可。"],
      detail_en: ["A lookup is one hash plus a short in-bucket comparison, hence amortised O(1); a lopsided hash or a long chain collapses it to O(n).", "The bucket array costs extra memory, and a key must supply both a hash and operator== — neither is optional."],
      vs: "桶决定「去哪个抽屉找」，比较器决定「抽屉里按什么顺序摆」。",
      vs_en: "Buckets decide which drawer to open; the comparator decides what order lives inside." },
    { term: "负载因子与 rehash", term_en: "Load Factor And Rehash", cat: "C++ 系统深入",
      short: "元素数与桶数之比超过 max_load_factor（默认 1.0）就重建整张桶表。",
      short_en: "When elements over buckets exceed max_load_factor (1.0 by default), the whole bucket table is rebuilt.",
      detail: ["rehash 让所有迭代器失效，但因为节点不搬家，指针与引用仍然有效——这一点和 vector 恰好相反。", "已知规模先 reserve(n)，让桶数一次到位，避免边插边反复重建与重新定位。"],
      detail_en: ["A rehash invalidates every iterator yet leaves pointers and references valid, because nodes never move — precisely the opposite of vector.", "reserve(n) when you know the size: it sets the bucket count once instead of rebuilding and relocating repeatedly while inserting."],
      vs: "扩容对 vector 是搬元素，rehash 对哈希表是重算桶位。",
      vs_en: "Vector growth moves elements; a rehash recomputes bucket placement." },
    { term: "operator[] 的静默插入", term_en: "Silent Insertion By Operator Subscript", cat: "C++ 系统深入",
      short: "读写两用：键不存在时先插入一个值初始化的元素，再返回它的引用。",
      short_en: "Reading and writing in one gesture: a missing key is inserted value-initialised before its reference is returned.",
      detail: ["用它查询会悄悄把表撑大，一行 if (m[k]) 每次运行都在插入；只查请走 find 或 count。", "++cnt[k] 是这个特性唯一常被正面使用的地方——不存在的键先给 0 再加一，计数因此一行写完。"],
      detail_en: ["Using it to read inflates the table: a line like if (m[k]) inserts on every run, so pure lookups belong in find or count.", "++cnt[k] is the one place the behaviour is used on purpose — a missing key starts at zero, so counting fits on one line."],
      vs: "insert 在键已存在时不动手，[] 一定会动手，这是两者最实际的分工。",
      vs_en: "insert leaves an existing key alone; [] always acts — that is their real division of labour." },
    { term: "字典序比较", term_en: "Lexicographic Comparison", cat: "C++ 系统深入",
      short: "pair 与 tuple 的 < 和 == 逐元素比较：前一个相等才看后一个。",
      short_en: "The < and == of pair and tuple compare field by field, moving on only when the current fields tie.",
      detail: ["把「优先级 + 名字」做成 pair 放进 set，就免费得到一个自定义排序队列；vector 装 pair 排序同理。", "多个关键字不必手写 if 链：std::tie(a.x, a.y) < std::tie(b.x, b.y) 一行搞定，而且天然合法。"],
      detail_en: ["Store priority-and-name pairs in a set and you get a custom-ordered queue for free; sorting a vector of pairs works the same way.", "For several keys, skip the if-chain: std::tie(a.x, a.y) < std::tie(b.x, b.y) does it in one line and is legal by construction."],
      vs: "字典序讲「逐字段怎么比」，严格弱序讲「比较器必须满足什么约束」。",
      vs_en: "Lexicographic order is about fields taken in turn; strict weak ordering is the constraint a comparator must satisfy." },

    { term: "半开区间", term_en: "Half-Open Range", cat: "C++ 系统深入",
      short: "[begin, end)：含头不含尾，end 是不可解引用的哨兵。",
      short_en: "The range from begin inclusive to end exclusive, where end is a sentinel that must never be dereferenced.",
      detail: ["空区间首尾相等、区间长度正好等于元素个数、相邻区间无需加减一就能拼接，这三条好处全来自「不含尾」。", "空容器上 begin() == end()，所以任何一次解引用都是越界；先比较这两个迭代器，再谈取元素。"],
      detail_en: ["An empty range has equal ends, its distance is exactly the element count, and neighbouring ranges join without any adjustment — all three follow from excluding the tail.", "On an empty container begin() equals end(), so any dereference is out of bounds; compare the two before touching an element."],
      vs: "半开区间讲「范围端点怎么取」，迭代器类别讲「这个端点能做哪些操作」。",
      vs_en: "Half-open ranges are about which endpoints belong; iterator categories are about which operations those endpoints support." },
    { term: "迭代器类别", term_en: "Iterator Categories", cat: "C++ 系统深入",
      short: "输入、输出、前向、双向、随机访问五档（外加连续），决定哪些算法可用。",
      short_en: "Input, output, forward, bidirectional and random access (plus contiguous), which decide which algorithms you may call.",
      detail: ["std::sort 要随机访问，所以链表只能用成员函数 list::sort；单向链表连双向都没有，距离只能自己数。", "换容器时「弱档换强档」总是安全，反向一定不安全——这也是 vector 作为保守默认的原因之一。"],
      detail_en: ["std::sort demands random access, which is why a list must use its member sort; a forward list lacks even bidirectionality, so distances must be counted by hand.", "Upgrading a container is always safe and downgrading never is — one more reason vector is the conservative default."],
      vs: "类别是迭代器的能力标签，失效规则是迭代器的寿命规则，两件事要分开记。",
      vs_en: "Categories label what an iterator can do; invalidation rules say how long it lives. Keep the two apart." },
    { term: "迭代器失效", term_en: "Iterator Invalidation", cat: "C++ 系统深入",
      short: "容器结构一变，手里的迭代器就可能指向已不存在的位置，而编译器不会提醒。",
      short_en: "When a container's structure changes, your iterators may point where nothing exists any more, and the compiler stays quiet.",
      detail: ["三句背完：vector 搬家全失效、被动过的位置之后失效；deque 两端操作只失效迭代器，引用还活着；list 与 map/set 只失效被删的那一个。", "唯一安全的遍历删是 it = c.erase(it)，因为 erase 的返回值就是下一个合法位置；写 c.erase(it++) 是把已失效的迭代器再加一。"],
      detail_en: ["Three sentences: vector invalidates everything on reallocation and everything after the touched position otherwise; deque end operations invalidate iterators but keep references; list and map/set invalidate only the erased element.", "The one safe erase-while-walking is it = c.erase(it), since erase returns the next live position; c.erase(it++) increments an iterator that is already invalid."],
      vs: "失效讲「这个句柄还能不能用」，越界讲「下标算错了没」，成因不同，调试手法也不同。",
      vs_en: "Invalidation asks whether a handle still works; out-of-bounds asks whether an index was computed wrong — different causes, different debugging." },
    { term: "严格弱序", term_en: "Strict Weak Ordering", cat: "C++ 系统深入",
      short: "比较器必须表达「a 必须排在 b 前」，且不能让自己和自己比也为真。",
      short_en: "A comparator must mean 'a has to come before b' and must never place an element before itself.",
      detail: ["违反后果不是「结果不好看」而是未定义行为：sort 会按比较器的暗示把指针推到区间之外，表现为偶发段错误。", "多关键字用 std::tie(a.p1, a.p2) 小于 std::tie(b.p1, b.p2)，它天然满足严格弱序，也省掉一长串 if。"],
      detail_en: ["The consequence is not untidy output but undefined behaviour: sort trusts the comparator and walks its pointers outside the range, which surfaces as an occasional segfault.", "For several keys, std::tie(a.p1, a.p2) < std::tie(b.p1, b.p2) is a strict weak ordering by construction and saves the if-chain."],
      vs: "严格弱序是排序的合法性前提，字典序是满足它的一种常见写法。",
      vs_en: "Strict weak ordering is the legality precondition of sorting; lexicographic comparison is one common way to satisfy it." },
    { term: "erase-remove 惯用法", term_en: "Erase-Remove Idiom", cat: "C++ 系统深入",
      short: "先用 std::remove 把保留元素前移拿到新逻辑末尾，再 erase 掉那段尾巴。",
      short_en: "Slide the survivors forward with std::remove to get the new logical end, then erase that tail for real.",
      detail: ["std::remove 不调用任何删除、也不改变 size，被移走的位置仍是有效但未指定的元素——只看代码极易误会它已经删了。", "按条件删换成 remove_if 配谓词；list 例外，它的成员 remove 与 remove_if 自己就会改长度。"],
      detail_en: ["std::remove performs no deletion and leaves size untouched, and the moved-from slots still hold valid but unspecified values, which is exactly why readers assume it deleted something.", "For conditions use remove_if with a predicate; a list is the exception, since its member remove and remove_if do change the length."],
      vs: "std::remove 管「搬到哪儿为止」，erase 管「真的把长度改小」。",
      vs_en: "std::remove decides where the kept run ends; erase is what actually shortens the container." }
  ],

  achievements: [
    { id: "container_chooser", icon: "🧪", name: "容器选型师", name_en: "Container Chooser",
      desc: "完成 s12 · STL 顺序容器 全部课节", desc_en: "Finish every lesson of s12 Sequence Containers",
      check: ["s12"] },
    { id: "stl_navigator", icon: "🗂️", name: "STL 通盘手", name_en: "STL Navigator",
      desc: "完成 s13 · STL 关联容器 与 s14 · 迭代器与算法 全部课节", desc_en: "Finish every lesson of s13 Associative Containers and s14 Iterators and Algorithms",
      check: ["s13", "s14"] }
  ],

  codeComments: {
    "一次预留容量，避免反复扩容搬家": "one reservation up front avoids repeated growth and moving",
    "0 100：有槽位但还没有元素": "0 100: slots allocated, but no elements yet",
    "此刻写 v[0] 依然越界：只有 resize 才真的构造元素": "v[0] is still out of bounds here: only resize actually constructs elements",
    "0 0 0：现在 size() 才是 3": "0 0 0: size() is 3 only now",
    "中间插入：后面 4 个元素整体后移，O(n)": "middle insert: the 4 following elements all shift back, O(n)",
    "it 可能已经随扩容换到新内存：下面这行故意留着别开，它是崩溃现场": "it may have moved to new memory after a reallocation: the line below is deliberately the crash scene",
    "尾部追加：摊还 O(1)": "appending at the tail: amortised O(1)",
    "定长、栈上、零开销": "fixed size, on the stack, zero overhead",
    "能改内容，改不了长度": "the contents can change, the length cannot",
    "编译错误：4 个和 3 个是不同类型，长度本身就写在类型里": "compile error: 4 and 3 elements are different types — the length is written into the type",
    "4 16：长度写在类型里": "4 16: the length lives in the type",
    "头部 O(1)：vector 做不到": "O(1) at the front: vector cannot do this",
    "仍支持下标，只是比 vector 多一层间接": "indexing still works, just one indirection deeper than vector",
    "lst 没有下标：想取第 3 个元素只能从头走两步": "a list has no index: reaching the third element means walking from the head twice",
    "定位是 O(n)，不是 O(1)": "locating is O(n), not O(1)",
    "已知位置插入：O(1)，不搬动任何人": "insert at a known position: O(1), and nobody else moves",
    "erase 返回下一个有效迭代器": "erase returns the next valid iterator",
    "成员函数：std::sort 用不了链表": "member function: std::sort cannot work on a list",
    "只去相邻重复，所以必须先排序": "unique only removes adjacent duplicates, so sort first",
    "真要随机访问就一次性转存": "need random access? copy it out once into a vector",
    "所有容器同一套写法": "the same code works on every container",
    "只换类型名：遍历代码不变，输出顺序却变了": "only the type name changed: the loop is identical, the order is not",
    "危险写法：size() 是无符号，空容器上 size() - 1 回绕成巨大值": "dangerous: size() is unsigned, so size() - 1 wraps to a huge value when empty",
    "反向：从尾到头": "reverse: from the last element back to the first",
    "先判空，再取值": "test for emptiness first, then read",
    "top() 只看不拿": "top() only looks, it does not take",
    "pop() 返回 void：这是异常安全的代价": "pop() returns void: the price of exception safety",
    "对空栈调 top() 或 pop() 是未定义行为，标准库不检查": "top() or pop() on an empty stack is undefined behaviour — the library checks nothing",
    "默认最大堆": "a max-heap by default",
    "三参数才是最小堆": "the three-argument form is what gives a min-heap",
    "没有 clear()：整体赋空值来清空": "there is no clear(): assign an empty object to wipe it",
    "选型练习：同一件活，四种容器各写一遍再比较": "selection drill: the same job written four ways for comparison",
    "头部删除：vector 是 O(n)，其余元素要前移": "erasing at the front: O(n) for vector, the rest must move up",
    "头部删除：deque O(1)": "erasing at the front: O(1) for deque",
    "头部删除：list O(1)，且不影响别人的迭代器": "erasing at the front: O(1) for list, and nobody else's iterator suffers",
    "自查三问：要不要随机访问？要不要两端 O(1)？迭代器必须长期存活吗？": "three self-checks: need random access? need O(1) at both ends? must iterators stay alive?",
    "陷阱：只想查一下，却用了 []，键不存在就被悄悄插入": "the trap: only a lookup, but [] silently creates the missing key",
    "此刻 score 里多了 bob = 0": "score now contains bob = 0",
    "只查不写的正确姿势": "the right way to read without writing",
    "insert 不会覆盖已有键，想覆盖请用 [] 或 insert_or_assign": "insert never overwrites an existing key — use [] or insert_or_assign to overwrite",
    "天然按键升序": "ascending by key, for free",
    "构造即去重 + 升序": "construction deduplicates and sorts in one step",
    "true：真的是第一次见": "true: genuinely the first time we saw it",
    "false：已存在，什么都没发生": "false: already present, nothing happened",
    "set 的元素是 const：想改只能先 erase 再 insert，别用 const_cast 绕": "set elements are const: to change one, erase then insert — never dodge with const_cast",
    "更快的替代：数据本来就在 vector 里，就地排序再去重": "the faster alternative: the data is already in a vector, sort and unique it in place",
    "自定义键必须自己给哈希": "a custom key must supply its own hash",
    "混合，别只写异或": "mix the hashes, do not just xor them",
    "还得给相等": "and equality is required too",
    "已知量大：先 reserve，省掉反复 rehash": "known volume: reserve first to skip repeated rehashing",
    "故意用 [] 的静默插入：不存在就先给 0": "the silent insert used on purpose: a missing key starts at 0",
    "查询请走 find：它不会像 [] 那样改写这张表": "query with find: unlike [] it never rewrites the table",
    "解引用拿到的就是 pair<const string,int>：first 改不了": "dereferencing gives pair<const string,int>: first cannot be changed",
    "结构化绑定：名字终于有意义了": "structured bindings: the names finally say something",
    "字典序：先 first，再 second": "lexicographic: by first, then by second",
    "下标是编译期常量": "the index is a compile-time constant",
    "同一件活：统计单词出现次数，四种写法放一起对比": "one job — count word occurrences — written four ways side by side",
    "要按字典序输出时它才值钱": "it earns its keep only when the output must be in key order",
    "只要计数，顺序无所谓": "counting only — order is irrelevant",
    "键是密集小整数：直接下标当哈希表": "dense small integer keys: use the index itself as the hash table",
    "口诀：要顺序或范围查询用 map，只要平均快用 unordered_map，整数小键用 vector": "rule of thumb: order or ranges means map, average speed means unordered_map, integer keys mean vector",
    "手写迭代器循环": "the hand-written iterator loop",
    "范围 for：同一段代码的糖": "range-for: the same loop with sugar on",
    "边遍历边删：只有 erase 的返回值是下一个合法位置": "erasing while walking: only erase's return value is the next legal position",
    "这里不写 ++it": "no ++it here",
    "反例：v.erase(it++) 等于给已经失效的迭代器再加一，未定义行为": "counter-example: v.erase(it++) increments an iterator that is already invalid — undefined behaviour",
    "默认用 < ，O(n log n)": "uses < by default, O(n log n)",
    "降序": "descending",
    "比较器必须严格弱序：写 a <= b 会让元素和自己比也为真，可能直接崩溃": "the comparator must be a strict weak ordering: a <= b makes an element compare before itself and can crash outright",
    "多关键字字典序": "multi-key lexicographic order",
    "先和 end 比，再解引用": "compare with end first, dereference afterwards",
    "前提：这段区间已经有序": "precondition: this range is already sorted",
    "要改元素就得传引用": "to modify elements you must take them by reference",
    "原地：输入输出同一起点": "in place: input and output share the starting point",
    "sq 是空的：写 sq.begin() 就是越界，必须换成 back_inserter 让它自己变长": "sq is empty: sq.begin() would write out of bounds — back_inserter lets it grow itself",
    "初值 0 是 int：全程截断，得 3": "the seed 0 is an int: everything truncates, giving 3",
    "初值决定累加用的类型": "the seed decides the accumulation type",
    "拷贝一份：之后 base 变了也不影响它": "a copy: later changes to base cannot reach it",
    "共享：base 变了结果跟着变": "shared: when base changes, so does the result",
    "11 101：一个冻结一个跟随": "11 then 101: one frozen, one following",
    "引用捕获：外面的变量真的被改": "reference capture: the outer variable really is modified",
    "按值捕获要改就得 mutable": "mutating a by-value capture requires mutable",
    "危险：把 [&] 的 lambda 返回出去或丢给别的线程，捕获的局部变量可能已经销毁": "danger: return a [&] lambda or hand it to a thread and the captured locals may already be gone",
    "仿函数：可以携带状态": "a functor: it can carry state",
    "const 不能省": "const here is not optional",
    "标准库备好的二元仿函数": "a binary functor the standard library already provides",
    "与上一行等价": "equivalent to the line above",
    "别指望在 operator() 里累加计数：算法允许拷贝你的谓词，读到的可能是副本": "do not count calls inside operator(): algorithms may copy your predicate, so you might read a copy",
    "改写 1：删掉所有偶数——remove 只负责前移，erase 才真的变短": "rewrite 1: drop every even number — remove only shifts, erase is what shortens",
    "改写 2：挑出大于 2 的放进新容器，算法不会替你长大": "rewrite 2: pick the values above 2 into a new container; algorithms never grow one",
    "改写 3：求和与判断，替掉累加变量加提前 break 的循环": "rewrite 3: sum and test, replacing the running-total-plus-break loop"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_STL1);
