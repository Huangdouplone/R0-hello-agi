/* ================================================================
 * R0:hello agi · 课程深化层 ⑦（dsl 复杂度与链表 / dsk 栈、队列与哈希 / dst 二叉树与堆）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「数据结构三章」从每节 3~4 要点深化到 7~8 要点。这三章的面试价值不在「会不会写」，
 *       而在能不能说清：均摊代价从哪来（vector 扩容、哈希 rehash）、常数从哪来（缓存与指针追逐）、
 *       边界在哪（哨兵节点、空判配对、判空判满歧义、BST 的上下界、堆的下沉边界）。
 *       每章末尾补一节「综合重构」收口课。
 * 写法约定：既有课节不写 title（沿用主数据标题）；新课写 title/title_en/target/target_en；
 *          order 覆盖全部既有 id + 新增 id；code 里的中文注释全部进 codeComments。
 * ================================================================ */

const DEEPEN_ALGO2 = {
  stages: ["dsl", "dsk", "dst"],

  order: {
    dsl: ["la1", "la2", "la3", "la4", "la5"],
    dsk: ["kb1", "kb2", "kb3", "kb4", "kb5"],
    dst: ["tc1", "tc2", "tc3", "tc4", "tc5"]
  },

  lessons: {

    /* ===================== dsl 复杂度与链表 ===================== */
    "la1": {
      min: 12,
      summary: [
        "大 O 描述的是**增长率**：它回答「n 翻倍时耗时变成几倍」，不回答「这一次跑几毫秒」。忽略常数与低阶项是它的定义，不是它的疏忽，所以同量级的两个算法可以差十倍。",
        "常见量级从小到大是 O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)，它描述的是运行时间与内存随规模 n 增长的量级趋势；配数据规模看：1 秒约做 10^8 次简单操作，所以 n ≤ 5000 才敢写 O(n²)，n 到 10^5~10^6 要 O(n log n) 或 O(n)，n ≤ 20 才允许 2^n，n ≤ 12 才允许全排列。反推规模比正推公式更快。",
        "计数要看**总执行次数**而不是循环层数：`for (i = 1; i <= n; i *= 2)` 只跑 log n 次；两层都是减半是 log²n；而「每轮做一次 O(n) 扫描然后把 n 减半」的总量是 n + n/2 + n/4 + … = O(n)，几何级数收敛这一点最容易看错。",
        "空间复杂度同理，且要**把递归栈算进去**：开数组按大小计，递归按最大深度计，每帧还有局部变量；`O(1) 额外空间`通常约定不计输入本身，这一点在面试里要主动说清口径。",
        "均摊分析：单次最贵的操作被大量廉价操作摊平。`vector::push_back` 扩容要搬移全部元素，但容量按倍增长，n 次插入的总搬移是 O(n)，于是**均摊 O(1)**；若每次只 +1 容量，总代价就变成 O(n²)——倍增才是关键，而不是「搬移动作便宜」。",
        "三种均摊记法各有适用：聚合分析（总量除以 n，最快够用）、会计法（给每步预付费、存下信用）、势能法（用 Φ(状态) 把储蓄写进不等式）。链表/哈希/并查集的题目里，势能法才能给出严格证明。",
        "真实常数来自哪里：缓存命中与未命中（链表的指针追逐、每节点一次堆分配）、分支预测失败、内存分配与释放、虚函数间接调用、循环体内的隐藏拷贝。同样是 O(n)，`std::vector` 顺序扫常比链表快 5~20 倍，这不是理论缺陷而是**大 O 不关心的那部分**。",
        "衔接：sdp 里判「O(nW) 能不能接受」用的就是本节口径；从 la2 起进入链表——那是把「常数」放大到极致的结构，也是把「指针操作」逼到最熟的练习场。"
      ],
      summary_en: [
        "Big-O describes a growth rate: it answers 'what happens to the time when n doubles', not 'how many milliseconds this run takes'. Ignoring constants and lower-order terms is its definition, not an oversight, which is exactly why two algorithms of the same class can differ tenfold.",
        "The usual ladder from small to large is O(1) < O(log n) < O(n) < O(n log n) < O(n2) < O(2^n), and it describes how time and memory scale as n grows; pair it with input size, since about 10^8 simple operations fit in a second. That means O(n2) is only brave up to roughly 5000, 10^5-10^6 needs O(n log n) or O(n), 2^n needs n at most 20, and full permutations need n at most 12. Reasoning backwards from the size is faster than deriving forwards.",
        "Count total executions, not loop nesting: 'for (i = 1; i <= n; i *= 2)' runs log n times; two halving levels give log2 n; and 'one O(n) scan then halve n' totals n + n/2 + n/4 ... = O(n), because the geometric series converges — the single most mis-read pattern.",
        "Space follows the same rule and must include the recursion stack: arrays by size, recursion by maximum depth, plus each frame's locals. 'O(1) extra space' conventionally excludes the input itself, a caveat worth stating out loud in an interview.",
        "Amortised analysis flattens an expensive single operation across many cheap ones: vector::push_back moves everything when it grows, but capacity doubles, so n insertions cost O(n) in total moves and O(1) amortised. Grow capacity by one instead and the total becomes O(n2) — doubling is the mechanism, not the cheapness of moving.",
        "Three amortised styles, each with its place: aggregate analysis (divide the total by n, usually enough), the accounting method (prepay each operation and bank the credit), and the potential method (encode savings as Phi(state) in an inequality). Only the potential method gives rigorous proofs for lists, hash tables and union-find.",
        "Real constants come from cache hits and misses (a list chases pointers and allocates per node), branch mispredictions, allocation and deallocation, virtual dispatch, and hidden copies inside loops. Same O(n), yet a std::vector scan is routinely 5-20 times faster than a list walk — not a flaw in the theory, but precisely the part big-O discards.",
        "Bridge: sdp's judgement of whether O(nW) is affordable uses exactly this yardstick; from la2 we enter linked lists, the structure that maximises those constants and the best gym for pointer discipline."
      ],
      code: `#include <cstddef>
#include <iostream>
#include <vector>
int main() {
    std::vector<int> v;
    std::size_t moved = 0;                     // 统计真实搬移次数，用来验证均摊结论
    std::size_t last = 0;
    for (int i = 0; i < 100000; ++i) {
        v.push_back(i);
        if (v.capacity() != last) { moved += v.size(); last = v.capacity(); }
    }
    // 容量按倍增长：10 万次插入的总搬移只有 2 万次量级，所以均摊 O(1)
    std::cout << "moves=" << moved << " inserts=" << v.size() << '\\n';
    std::vector<int> w;
    w.reserve(100000);                         // 预先给足：一次分配，零搬移
    // 减半循环：层数是一，执行次数却是 log n，别用「数循环层数」的老习惯
    int halved = 0;
    for (int n = 100000; n > 1; n /= 2) ++halved;
    std::cout << "log steps=" << halved << '\\n';
    return 0;
}`,
      pit: "只用大 O 做选型，忽略常数与内存布局：把链表换成 vector 明明是同一个 O(n)，实测快了十几倍却说不清原因；反过来，看到 O(log n) 就以为一定快，忘了哈希表的 O(1) 均摊里藏着一次 rehash 的 O(n) 抖动，实时链路上就会卡出尖刺。",
      pit_en: "Choosing by big-O alone and ignoring constants and layout: switching a list to a vector is still O(n) yet measures ten times faster, and you cannot say why. Or trusting O(log n) blindly, forgetting that an amortised O(1) hash insert can hide an O(n) rehash spike — which shows up as latency jitter on a real-time path.",
      ex: {
        q: "为什么 `vector::push_back` 的均摊代价是 O(1)，而「每次容量加一」是 O(n²)？",
        a: "倍增让第 k 次扩容搬 2^k 个元素，总搬移是 1 + 2 + 4 + … + n 的几何级数，只有 O(n)，除以 n 次插入即均摊 O(1)；逐格加一时总搬移是 1 + 2 + … + n = O(n²)，均摊就退化成 O(n)。",
        q_en: "Why is push_back amortised O(1) while growing capacity by one is O(n2)?",
        a_en: "Doubling makes the k-th regrowth move 2^k elements, so the total is the geometric sum 1 + 2 + 4 + ... + n = O(n), which divided by n insertions is O(1) each; growing by one totals 1 + 2 + ... + n = O(n2), leaving O(n) per insertion."
      }
    },

    "la2": {
      min: 15,
      summary: [
        "节点 = 数据 + 指向下一节点的指针，内存不必连续。于是插入删除只改指针（拿到前驱后 O(1)），但按下标访问必须从头走，是 O(n)；不连续还意味着**缓存不友好**，常数远大于数组。",
        "先想清**所有权**：`struct Node { int val; Node* next; };` 谁 new 谁 delete。销毁整条链表必须「先存 next、再 delete 当前」，因为在 `delete p;` 之后写 `p->next` 是**释放后使用**，属于未定义行为。",
        "哨兵（dummy）节点是链表题的第一件工具：在 head 之前造一个不存数据的节点，「删除/插入第一个节点」就和「删除中间节点」共用同一套代码，`if (cur == head)` 这类特判全部消失。栈上造 dummy（`Node dummy(0);`）最安全，返回 `dummy.next`，不用手工释放。",
        "如果 dummy 用 `new` 造在堆上，就必须记得在 return 前 delete——否则每一条早退分支都泄漏一个节点；这也是「能用栈对象就别用堆对象」在链表题里的具体形态。",
        "插入的顺序铁律：**先接新边，再断旧边**。`cur->next = prev->next; prev->next = cur;` 两行一旦写反，`prev->next` 被覆盖时后面整段链表就再也找不到了——丢失而非损坏，最难在输出里看出来。",
        "按值删除只能「从前驱动手」，所以循环条件要写成 `cur->next && cur->next->val != target`，跳出后再判 `cur->next` 是否存在。由此也能理解为什么只给一个节点指针时，单链表删自己只能「拷贝后继的值、再删后继」——而且**尾节点做不到**。",
        "建表两种顺序：头插法天然把输入逆序（也是就地反转的雏形）；尾插法要么每次走到尾（O(n) 一次），要么维护一个尾指针或「哑节点 + 尾指针」，才能摊到 O(1)。头插 + 边读边插还能一次完成逆序建表。",
        "什么时候真该用链表：需要在 O(1) 摘出**已握有迭代器/指针**的中间节点（LRU 就是 `std::list` + 哈希表），或频繁在中间插入且不想搬移大块内存。要随机访问、要遍历快、要缓存友好，就用 `std::vector`。"
      ],
      summary_en: [
        "A node is data plus a pointer to the next one, and memory need not be contiguous. Insert and delete then only rewrite pointers (O(1) once you hold the predecessor), while indexing walks from the head in O(n); non-contiguity also means poor locality, so the constants are far worse than an array's.",
        "Settle ownership first: with 'struct Node { int val; Node* next; };' whoever calls new must call delete. Destroying a list means storing next before deleting the current node, because touching p->next after delete p is use-after-free, i.e. undefined behaviour.",
        "The dummy (sentinel) node is the linked list's first tool: add a valueless node before head and 'delete or insert the first node' shares the same code as 'delete a middle one', dissolving every 'if (cur == head)' special case. Building it on the stack ('Node dummy(0);') is safest — return dummy.next and there is nothing to free.",
        "If the dummy is heap-allocated instead, every early return must delete it first, or it leaks one node per exit path — the concrete shape of 'prefer a stack object to a heap object' in list problems.",
        "The iron rule of insertion is: attach the new edge before cutting the old one. Reverse 'cur->next = prev->next; prev->next = cur;' and overwriting prev->next orphans the whole rest of the list — lost rather than corrupted, which is the hardest thing to spot in an output.",
        "Deleting by value can only work from the predecessor, so the loop guard is 'cur->next && cur->next->val != target' followed by a reachability check on cur->next. It also explains why, handed only a node pointer, a singly linked list deletes itself by copying the successor and removing the successor — and why the tail node cannot be removed that way.",
        "Two build orders: head insertion reverses the input for free (and is the seed of in-place reversal); tail insertion either walks to the end each time (O(n) per append) or keeps a tail pointer, ideally a dummy plus a tail pointer, to make it O(1).",
        "When a list really is the right structure: you must unlink an interior node in O(1) from an iterator you already hold (LRU is exactly std::list plus a hash map), or you insert into the middle often and do not want to shift large blocks. Need random access, fast scans or locality, and std::vector wins."
      ],
      code: `#include <cstddef>
struct Node {
    int val;
    Node* next;
    explicit Node(int x) : val(x), next(nullptr) {}
};

// 在 prev 之后插入 cur：先接新边再断旧边，写反就丢链
void insertAfter(Node* prev, Node* cur) {
    cur->next = prev->next;
    prev->next = cur;
}

int main() {
    Node dummy(0);                    // 哨兵节点：不存数据，头部操作不再需要特判
    Node* tail = &dummy;
    for (int i = 1; i <= 5; ++i) { insertAfter(tail, new Node(i)); tail = tail->next; }

    // 删除值为 3 的节点：单链表只能从前一个节点动手
    for (Node* cur = &dummy; cur->next; cur = cur->next)
        if (cur->next->val == 3) { Node* dead = cur->next; cur->next = dead->next; delete dead; break; }

    int freed = 0;
    for (Node* p = dummy.next; p;) {  // 销毁：必须先存 next 再 delete
        Node* nxt = p->next;
        delete p;
        p = nxt;
        ++freed;
    }
    dummy.next = nullptr;             // 摘完要把哨兵的箭头也清掉，否则它是悬空的
    return freed;
}`,
      pit: "用 `delete p;` 之后继续 `p = p->next` 遍历释放：编译通过、小样本也「正常」，因为释放后的内存往往还残留着旧值。这是**释放后使用**，在 `-O2`、地址消毒器或更大内存压力下必然出错；链表销毁必须写成「先存 next，再 delete」。",
      pit_en: "Writing 'delete p; p = p->next;' while freeing a list: it compiles and even looks fine on small inputs because freed memory usually still holds the old value. It is use-after-free, and it breaks under -O2, AddressSanitizer or simply more memory pressure; the free loop must store next first, then delete.",
      ex: {
        q: "为什么「给你一个节点指针，删除该节点」这题在单链表上其实做不到严格成立？",
        a: "因为单链表只能向前找前驱，手上只有当前节点时无法改前驱的 next；通行的解法是「把后继的值拷进当前节点、再删掉后继」，本质是删了别的节点——所以尾节点没有任何替代方案，题目必须排除尾节点。",
        q_en: "Why is 'delete this node given only its pointer' not strictly solvable on a singly linked list?",
        a_en: "Because a singly linked list can only search forwards for a predecessor, and with just the current node you cannot rewrite the predecessor's next. The usual trick copies the successor's value into the current node and deletes the successor, i.e. it deletes a different node — so the tail node has no workaround and the problem must exclude it."
      }
    },

    "la3": {
      min: 13,
      summary: [
        "三指针反转模板：`nxt = cur->next; cur->next = prev; prev = cur; cur = nxt;`。每轮只做一件事——把当前节点的箭头掰向**已经反转好的那一段**。它必须是肌肉记忆，因为 k 组反转、回文判断、重排链表全都基于它。",
        "反转结束后 `prev` 是新头、`cur` 是空指针，返回的必须是 `prev`；同时原来的 head 已经变成尾节点，它的 next 是空的——任何还拿着 oldHead 想「继续往后遍历」的代码都在读空指针，这是本题的第二高频错误。",
        "区间反转（反转第 m 到 n 个）：先走到区间前驱并记住它，然后对区间做若干次「摘下当前头、插到前驱之后」的操作，最后重连四个连接点（前驱、区间头、区间尾、区间后第一段）。漏掉任何一个 reconnect，链表就断或成环。",
        "合并两个有序链表：dummy + tail 指针，逐个比较、摘下较小者接到结果尾部；一个走完后**把剩下的整段直接挂上**（它本来就有序，不用逐节点搬）。时间 O(m+n)，额外空间 O(1)。",
        "链表的归并比数组的归并更好写，正因为不需要辅助数组：这也是「用链表演示稳定归并、用数组演示快排」的常见教学搭配。但别误会——数组版归并仍要 O(n) 辅助空间，省不掉。",
        "递归反转只有三行（`head->next->next = head; head->next = nullptr;`），但栈深度是 O(n)：10^5 以上就爆栈，且新头要逐层原样传回。**能写递归版就必须能说出它的栈代价**，并在面试里主动比较两种写法。",
        "反转是更多题的地基：k 个一组反转（先数 k 个再分段反转）、回文链表（快慢找中点 → 反转后半 → 逐一比对 → 最好再还原回去）、相交链表（长度差对齐，或双指针走完自己的再走对方的，两次遍历后同时到达交点）。顺手记下另一条只用双指针的姊妹技巧——找**倒数第 k 个**：快指针先走 k 步，随后两针同步，快指针到尾时慢指针正好停在倒数第 k 个（la4 展开）。",
        "边界自查永远是三件事：空表、只有一个节点、恰好两个节点。三行模板在这三种输入上各跑一遍，就能确认不会出现「在空表上取 `cur->next`」的崩溃。"
      ],
      summary_en: [
        "The three-pointer template is 'nxt = cur->next; cur->next = prev; prev = cur; cur = nxt;'. Each round does one thing: bend the current node's arrow towards the segment that is already reversed. It has to be muscle memory, because k-group reversal, palindrome checks and list reordering are all built on it.",
        "When the loop ends, prev is the new head and cur is null, so the function returns prev; meanwhile the original head has become the tail with an empty next. Any code still holding oldHead and walking onwards dereferences null — the second most common mistake in this problem.",
        "Reversing a range m..n: walk to the range's predecessor and remember it, then repeatedly detach the current head and re-insert it right after that predecessor, and finally reconnect the four junctions (predecessor, range head, range tail, the node after the range). Miss one reconnect and the list is either cut in two or turned into a cycle.",
        "Merging two sorted lists uses a dummy plus a tail pointer, comparing and detaching the smaller node one at a time; once one side runs out, attach the remaining segment wholesale — it is already sorted, no need to move it node by node. That is O(m+n) time with O(1) extra space.",
        "Merge reads more naturally on lists than on arrays precisely because no scratch array is needed, which is why courses demo stable merge on lists and quicksort on arrays. Do not misread that: the array version still pays O(n) auxiliary space.",
        "Recursive reversal is three lines ('head->next->next = head; head->next = nullptr;') but costs O(n) stack: it blows up past 10^5 and passes the new head back up unchanged through every frame. If you write the recursive version you must also state its stack cost and compare the two in an interview.",
        "Reversal underpins more problems than it looks worth: reverse nodes in groups of k (count k, reverse that block, recurse), palindrome check (fast/slow to midpoint, reverse the second half, compare, and ideally restore it), and intersection detection (align by length difference, or let both pointers walk their own list then the other's so they meet at the crossing). Keep the sibling two-pointer trick in mind too — the k-th node from the end: advance fast by k, then move both together, and when fast hits the tail slow sits exactly on the answer (developed in la4).",
        "Boundary checking is always the same trio: empty list, one node, exactly two nodes. Run the three-line template on each and you cannot end up taking cur->next on an empty list."
      ],
      code: `#include <cstddef>
struct Node { int val; Node* next; explicit Node(int x) : val(x), next(nullptr) {} };

// 三指针反转：每轮把当前节点的箭头掰向已反转好的那一段
Node* reverse(Node* head) {
    Node* prev = nullptr;
    Node* cur = head;
    while (cur) {
        Node* nxt = cur->next;        // 先存住断链之后就会丢掉的那一半
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    return prev;                      // 返回 prev：此刻 cur 已经是空指针
}

Node* mergeTwo(Node* a, Node* b) {
    Node dummy(0);                    // 哨兵让「第一个接谁」也不用特判
    Node* tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else { tail->next = b; b = b->next; }
        tail = tail->next;
        tail->next = nullptr;         // 每接一个就清掉它的箭头，防止提前成环
    }
    tail->next = a ? a : b;           // 剩下那段本来有序，整段挂上即可
    return dummy.next;
}

int main() {
    Node x(1), y(2), z(3);
    x.next = &y; y.next = &z;
    Node* h = reverse(&x);            // x 变成尾节点，它的 next 已经是空
    return h->val;                    // 3
}`,
      pit: "反转函数写完返回 `cur`：循环结束时 `cur` 恰好是 `nullptr`，于是调用方拿到空头，链表「整体消失」。更隐蔽的是区间反转：只改了区间内部的箭头，忘了把区间尾接回区间后面的第一段，结果后半段凭空丢失，程序不崩、只是打印出来短了一截。",
      pit_en: "Returning cur from a reversal: at loop end cur is exactly nullptr, so the caller receives an empty head and the list vanishes. The subtler cousin is range reversal — rewriting only the arrows inside the range and never re-linking the range tail to the node after it, so the whole back half disappears without a crash, and the only symptom is a shorter printout.",
      ex: {
        q: "合并两个有序链表时，为什么最后能 `tail->next = 剩下的那一整段`，而不必逐节点搬？",
        a: "因为剩下的那段自身有序、并且它的每个元素都大于已接好的全部结果，直接挂上去既不破坏有序也不需要改动任何指针——这也是链表合并比数组归并省一趟拷贝的根本原因。",
        q_en: "At the end of merging two sorted lists, why can you attach the remaining segment wholesale instead of moving nodes one by one?",
        a_en: "Because that remainder is already sorted, and every one of its elements is greater than everything already appended, so hanging it on preserves order without rewriting a single pointer — which is exactly why list merge avoids the copy pass that array merging needs."
      }
    },

    "la4": {
      min: 13,
      summary: [
        "快慢指针三类用途：找中点（快走两步慢走一步）、判环（相遇即有环）、倒数第 k（快走 k 步后两针同步，fast 到尾时 slow 就是答案）。它们共用同一个「用速度差补偿结构缺陷」的思想——链表没有下标，就用步数当地标。",
        "判空必须**成对写**：`while (fast && fast->next)`。只判 `fast` 的话，偶数长度链表的最后一步会执行 `fast->next->next`，解引用空指针——这是未定义行为，可能不当场崩，而是几层调用之后才炸。",
        "中点位置要说清约定：偶数长度时上面的写法让 slow 停在**右半第一个**节点；想让它在左半末尾，条件改成 `while (fast->next && fast->next->next)`。回文判断与「重排链表」正好需要不同的一侧，抄错条件就全盘皆错。",
        "环入口不是玄学：设环长 C、入环前长度 L，相遇时 slow 走的路程是 L + mC 的某种形式，而 fast 走的路程是它的两倍，两式相减得「从相遇点与从头部各走一步，必在入口相遇」。要能现场推出这几行，而不是背结论。",
        "有环的链表里任何朴素遍历都不会终止：判环题之后若还要计算长度或找倒数第 k，必须先**断环**或只在环内计数；测试代码里人为造的环，测完要记得恢复 next，否则后面的用例全挂。",
        "对撞指针依赖**有序**：两数之和（左右夹逼，每次比较都能排除一头，O(n)）、回文判断、三数之和（固定一个数后对撞，O(n²)）。它成立的根据是「答案不可能在被排除的那一侧」，所以无序数组上不能用。",
        "同向滑动窗口是字符串题的主力：右端扩张、左端收缩，每个元素进窗出窗各一次，所以总操作 2n → O(n)。关键前提是**单调性**：左端右移不可能让一个已不合法的窗口重新变合法，因此左指针永不回退；一旦题目允许「缩了又要退」（如带负数的和为 K 的子数组），滑窗就失效，要换成前缀和 + 哈希。",
        "数组双指针与链表双指针的差别在「移动」的代价：数组下标可随机访问、能原地交换（快排划分、移除元素、三数之和）；链表「移动左指针」意味着断链，还要考虑被断开的节点是否要释放。衔接：la5 把建、插、删、翻、毁合成一条自检流程。"
      ],
      summary_en: [
        "Fast/slow pointers have three jobs: find the midpoint (fast advances two, slow one), detect a cycle (meeting means one exists), and locate the k-th from the end (advance fast k steps, then move both; when fast reaches the tail, slow is the answer). All three share one idea — compensate for the structure's missing indices with a speed difference, using steps as landmarks.",
        "The null test must come in pairs: 'while (fast && fast->next)'. Testing only fast makes the final step on an even-length list evaluate fast->next->next, dereferencing null — undefined behaviour that may not crash there but several frames later.",
        "State the midpoint convention: with 'while (fast && fast->next)' slow lands on the first node of the right half for even lengths; to stop it at the end of the left half, use 'while (fast->next && fast->next->next)'. Palindrome checks and list reordering need opposite sides, so a wrong guard fails everything.",
        "The cycle entrance is derivable, not folklore: with cycle length C and lead-in length L, slow has travelled a form of L + mC while fast has travelled exactly twice that; subtracting shows that walking one step at a time from the meeting point and from the head meets at the entrance. Reproduce those few lines on the spot instead of memorising the conclusion.",
        "No naive traversal terminates on a cyclic list: after a cycle test, computing a length or a k-from-end index requires cutting the cycle or counting only inside it. And if your test code built the cycle by hand, restore next afterwards or every later case fails.",
        "Oppending pointers rely on sortedness: two-sum by squeezing from both ends (each comparison eliminates one side, O(n)), palindrome checks, three-sum (fix one value, then squeeze, O(n2)). The justification is that the answer cannot live in the half you eliminated, which is why this fails on unordered input.",
        "The same-direction sliding window carries most string problems: the right edge expands, the left contracts, each element enters and leaves once, so about 2n operations, hence O(n). The prerequisite is monotonicity — moving the left edge rightwards can never make an illegal window legal again, so the left pointer never retreats. The moment the statement allows 'shrink then want to back up' (subarray sums with negative numbers), the window dies and prefix sums plus a hash map take over.",
        "Array versus list two-pointers differ in the price of moving: array indices allow random access and in-place swaps (quicksort partition, removing elements, three-sum), while 'moving the left pointer' on a list means unlinking and deciding whether the detached node must be freed. Bridge: la5 assembles build, insert, delete, reverse and destroy into one self-check flow."
      ],
      code: `#include <cstddef>
#include <string>
#include <vector>
struct Node { int val; Node* next; explicit Node(int x) : val(x), next(nullptr) {} };

// 判环：快走两步慢走一步；判空必须同时判 fast 与 fast->next
bool hasCycle(Node* head) {
    Node* slow = head;
    Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}

// 无重复字符的最长子串：左端只前进不回退，所以整体是 O(n)
int longestNoRepeat(const std::string& s) {
    std::vector<int> last(128, -1);
    int best = 0, left = 0;
    for (int i = 0; i < static_cast<int>(s.size()); ++i) {
        int c = static_cast<unsigned char>(s[i]);
        if (last[c] >= left) left = last[c] + 1;   // 重复落在窗口内才收缩左端
        last[c] = i;
        best = best > i - left + 1 ? best : i - left + 1;
    }
    return best;
}

int main() {
    std::string s = "abcabcbb";
    Node a(1), b(2);
    a.next = &b;
    b.next = &a;                                   // 人为造一个环，测完要还原
    return hasCycle(&a) ? longestNoRepeat(s) : 0;   // 3
}`,
      pit: "滑动窗口用在「有负数」的数组上：窗口和不满足条件时，把左端右移**可能**让和变大，于是「左指针永不回退」的前提没了，答案被跳过却毫无提示。看到「和恰好等于 K」且允许负数，就换成前缀和 + 哈希表统计。",
      pit_en: "Applying a sliding window to an array with negative numbers: when the window sum is short of the target, moving the left edge rightwards may increase it, so the 'the left pointer never retreats' premise collapses and answers are skipped in total silence. For 'sum exactly K' with negatives allowed, switch to prefix sums plus a hash table.",
      ex: {
        q: "为什么找中点的两个 while 条件会得到不同的结果？",
        a: "因为「fast 能否再走两步」与「fast->next 能否再走两步」在偶数长度时恰好差一次移动：前者让 slow 停在右半第一个节点，后者让 slow 停在左半末尾。回文比对要用前者、原地重排常要用后者，先定约定再写条件。",
        q_en: "Why do the two while-guards for finding the midpoint land in different places?",
        a_en: "Because 'can fast take two more steps' and 'can fast->next take two more steps' differ by exactly one move when the length is even: the first parks slow on the first node of the right half, the second at the end of the left half. Palindrome comparison wants one, in-place reordering the other, so fix the convention before writing the guard."
      }
    },

    "la5": {
      title: "综合重构：一条链表的建、插、翻、毁与自检",
      title_en: "Synthesis: Build, Insert, Reverse, Destroy — One List",
      min: 15,
      target:  "能独立写出带头哨兵的链表全流程（建表、插入、按值删除、快慢找中点、反转、销毁），并逐项说清每一步的复杂度与失败模式。",
      target_en: "Write the whole lifecycle of a singly linked list with a head sentinel — build, insert, delete by value, find the midpoint, reverse, destroy — and state each step's complexity and failure mode.",
      summary: [
        "把 la2~la4 拼成一条固定流水线：哨兵建表 → 尾指针 O(1) 追加 → 前驱驱动删除 → 快慢找中点 → 分段反转 → 重连 → 统一销毁。这条流程写完，链表题的九成正向操作都覆盖了。",
        "每个动作的复杂度都要能一口报出：按下标访问 O(n)、已知前驱的插入删除 O(1)、反转 O(n) 且额外空间 O(1)、找中点 O(n/2)、判环 O(n)、合并两段有序 O(m+n)。链表**没有**任何 O(log n) 操作，因为它不能随机访问。",
        "哨兵与尾指针是本章的两个「省代码」装置：dummy 消灭头部特判，tail 消灭「每次走到尾」。但要记住它们的失效条件——删除尾节点时 tail 指针会指向已释放内存，必须回头重新走一遍才能恢复，这也是「链表不能 O(1) 删尾」的根源（双向链表可以）。",
        "把「先接新边、再断旧边」和「先存 next、再 delete」两条铁律贴在纸上写代码：前者防止丢链，后者防止释放后使用。所有链表 bug 归根到底是这两条加上「判空没配对」。",
        "内存与常数的复盘：每节点一次 `new` 意味着 n 次堆分配、指针追逐打断预取，所以链表遍历比数组慢一个量级。真要「频繁摘除中间节点 + 快速遍历」，考虑 `std::vector` + 惰性删除标记，或 `std::list` 配哈希表。",
        "自检测试清单（每次写完都跑一遍）：空表、单节点、双节点、待删元素不存在、待删元素是头、待删元素是尾、整表已反转再反转回原样后长度与顺序守恒、销毁后再无泄漏。这八条覆盖面试官会追问的全部边界。",
        "复杂度与大 O 的呼应：链表是「最坏 O(1) 插入 + 最坏 O(n) 访问」的极端，把 la1 的均摊视角再想一遍——为什么 `std::list::splice` 是 O(1) 而 `std::list::sort` 必须是 O(n log n)（不能随机访问，所以用归并而不是快排）。",
        "衔接：dsk 栈、队列与哈希会把「线性结构」换成「受限访问顺序的结构」——那里的核心问题变成「什么顺序处理」，而不是「多快能找到」。"
      ],
      summary_en: [
        "Chain la2-la4 into one fixed pipeline: sentinel-headed build, O(1) appends via a tail pointer, predecessor-driven deletion, fast/slow midpoint, segmented reversal, re-linking, then a single destroy pass. Write it once and nine tenths of forward list operations are covered.",
        "Be able to state every cost instantly: indexing O(n), insert/delete O(1) given the predecessor, reversal O(n) time with O(1) extra, midpoint O(n/2), cycle test O(n), merging two sorted runs O(m+n). A list has no O(log n) operation at all, precisely because it cannot index.",
        "The dummy and the tail pointer are this chapter's two code-saving devices: the dummy kills head special-cases, the tail kills 'walk to the end each time'. Know where they break — deleting the tail leaves the tail pointer dangling into freed memory and must be repaired by a full walk, which is also why a singly linked list cannot delete its tail in O(1) (a doubly linked one can).",
        "Keep the two iron rules written down while you type: attach the new edge before cutting the old one (prevents orphaning the rest), and store next before deleting (prevents use-after-free). Almost every list bug reduces to one of these two plus an unpaired null check.",
        "Memory and constants, revisited: one new per node means n heap allocations, and pointer chasing defeats prefetching, so list traversal is an order of magnitude slower than array traversal. If you genuinely need both frequent mid-list unlinking and fast scanning, prefer a vector with lazy deletion marks, or std::list paired with a hash map.",
        "A standing self-test: empty list, one node, two nodes, target absent, target is the head, target is the tail, reversing twice restores the original order and length, and destroying leaves nothing reachable. Those eight cover every boundary an interviewer will probe.",
        "The echo back to complexity theory: a list is the extreme of 'O(1) insert at worst, O(n) access at worst'. Re-run la1's amortised lens and ask why std::list::splice is O(1) while std::list::sort must be O(n log n) — no random access means merge, not quicksort.",
        "Bridge: dsk swaps 'a linear structure' for 'a structure with a restricted access order', where the question stops being how fast you find something and becomes in what order you process it."
      ],
      code: `#include <cstddef>
#include <iostream>
struct Node { int val; Node* next; explicit Node(int x) : val(x), next(nullptr) {} };

int main() {
    Node dummy(0);                                 // 哨兵：头插与头删都不用特判
    Node* tail = &dummy;
    for (int i = 1; i <= 6; ++i) { tail->next = new Node(i); tail = tail->next; }

    Node* slow = &dummy;
    Node* fast = &dummy;                           // 找中点：快走两步慢走一步
    while (fast->next && fast->next->next) { slow = slow->next; fast = fast->next->next; }

    Node* second = slow->next;                     // 断成两段：前驱要同步切断
    slow->next = nullptr;
    Node* prev = nullptr;
    for (Node* cur = second; cur;) {               // 反转后半段
        Node* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    Node* walk = dummy.next;
    while (walk->next) walk = walk->next;          // 走到前半段的尾部
    walk->next = prev;                             // prev 是后半段的头，接回去

    int n = 0;
    for (Node* p = dummy.next; p; p = p->next) ++n;
    std::cout << "nodes=" << n << '\\n';            // 长度守恒，仍是 6
    // 自查三件事：长度不变、没有节点指回自己、哨兵的 next 与尾指针都有效
    for (Node* p = dummy.next; p;) {               // 释放统一放最后：先存 next 再 delete
        Node* nx = p->next;
        delete p;
        p = nx;
    }
    dummy.next = nullptr;
    return n;
}`,
      pit: "在循环里直接 `for (Node* p = head; p; p = delete_helper(p))` 这类「一边遍历一边释放」的紧凑写法，或者 `delete p->next; p->next = nullptr;` 这种顺序颠倒的删除：编译能过，但访问的是已释放内存。释放链条上的节点时，任何指向它的读操作都必须发生在 delete **之前**。",
      pit_en: "Writing compact free-during-walk forms, or reversing the order as 'delete p->next; p->next = nullptr;'. Both compile, and both touch freed memory: when you free a node on the traversal chain, every read through it must happen before the delete, never after.",
      ex: {
        q: "为什么链表的 sort 用归并且不用快排？",
        a: "因为快排的核心是原地划分，靠的是下标双向随机访问；链表只能顺序走，划分做不到 O(1) 空间与常数收益，反而不如「找中点 + 递归 + 合并」——链表的合并恰好不需要辅助数组，所以整体是 O(n log n) 时间、O(log n) 栈空间。",
        q_en: "Why does list sorting use merge sort rather than quicksort?",
        a_en: "Quicksort's core is an in-place partition, which needs cheap two-way indexed access; a list can only walk forwards, so partitioning yields no space or constant-factor win. Splitting at the midpoint and merging does win, because merging lists needs no scratch array — O(n log n) time with O(log n) stack."
      }
    },

    /* ===================== dsk 栈、队列与哈希 ===================== */
    "kb1": {
      min: 13,
      summary: [
        "栈只在同一端进出（LIFO），代价全部是 O(1)。`std::stack` 只是**容器适配器**（默认底层 `std::deque`），本身不存数据；要能遍历或随机访问就直接拿 `std::vector` 当栈用——`push_back / back / pop_back`。",
        "括号匹配规则：左括号入栈，右括号先比对栈顶再弹；结束时栈必须为空。更省事的写法是「右括号来了就期望栈顶是配对的左括号」，比较一次搞定三类括号。",
        "右括号来时栈**可能为空**（`\")(\"`、`()\"))\"` 这类输入），所以必须 `if (st.empty()) return false;` 在 `st.top()` 之前。`top()` 对空栈不是抛异常而是**未定义行为**，`pop()` 也不返回元素——这两个接口都没有检查，是栈类题第一大崩溃源。",
        "单调栈专治「下一个更大/更小元素」「柱状图最大矩形」「接雨水」：栈内始终保持单调，来了一个更大的就把比它小的全部弹出，**被弹者的答案就是当前元素**。每个元素进出栈各一次，所以总代价 O(n) 而不是 O(n²)。",
        "单调栈的方向与比较符号是同一件事的两半：求「右边第一个更大」用递减栈、从左往右扫；求「左边第一个更大」就要反向扫；弹出条件写 `<` 还是 `<=` 决定重复元素被划到哪一侧，进而决定「严格大于」还是「大于等于」——接雨水与最大矩形差的正是这一格。",
        "表达式求值的两种栈方案：双栈（操作数栈 + 运算符栈）配一张优先级表，遇到优先级不高于栈顶就把栈顶算掉；或先用调度场算法转后缀表达式，再单栈扫描求值。左结合就藏在「`>=` 就弹」这一句里，`2 - 3 - 4` 因此得 -5 而不是 3。",
        "栈的身份比你想的多：函数调用与局部变量、撤销/回退、DFS、括号匹配、表达式求值、树的迭代遍历、单调栈。识别信号也很短——题目里出现「最近的、嵌套的、要回溯的」，就是栈；出现「最早的、按层排队的」，就是队列。",
        "别用「字符串反复 replace/拼接」模拟栈：每次删除配对子串都是 O(n) 扫描，最坏 O(n²)，而且读不出单调性；换成显式栈既是线性的，也方便加一层「栈里存下标」的技巧。衔接：dsl 练的是「指针怎么走」，本章练的是「按什么顺序处理」——la4 的快慢指针其实就是栈与队列的雏形。"
      ],
      summary_en: [
        "A stack enters and leaves at one end, all in O(1). std::stack is only a container adaptor (delegating to std::deque by default) and stores nothing itself; when you need to iterate or index, use std::vector directly as the stack — push_back, back, pop_back.",
        "Bracket matching: push on an opener, and on a closer compare against the top before popping; at the end the stack must be empty. The leaner variant pushes 'the closer I expect', so all three bracket kinds collapse into one comparison.",
        "When a closer arrives the stack may well be empty (inputs like ')(' or '()))'), so 'if (st.empty()) return false;' must come before st.top(). top() on an empty stack is undefined behaviour, not an exception, and pop() returns nothing — those two unchecked interfaces are the leading cause of crashes in stack problems.",
        "A monotone stack handles 'next greater/smaller element', 'largest rectangle in a histogram' and 'trapping rain water': it stays ordered, and when a larger value arrives it pops every smaller one, because for each popped element the answer is exactly the current value. Each element is pushed and popped once, so the total is O(n), not O(n2).",
        "Direction and comparison operator are two halves of one decision: 'first greater to the right' wants a decreasing stack scanned left to right, while 'first greater to the left' means scanning backwards; whether the pop test is < or <= decides which side duplicate values land on, hence 'strictly greater' versus 'greater or equal' — the exact cell separating rain-water solutions.",
        "Expression evaluation has two stack designs: two stacks (operands plus operators) with a precedence table, where anything not strictly higher than the top gets computed first; or convert to postfix with the shunting-yard algorithm and evaluate with one stack. Left-associativity hides in the single '>=' comparison, which is why '2 - 3 - 4' yields -5 and not 3.",
        "Stacks wear more hats than it looks: function calls and locals, undo, DFS, bracket matching, expression evaluation, iterative tree traversal, monotone stacks. The trigger words are short — 'most recent', 'nested', 'backtrack' means a stack; 'earliest', 'level by level' means a queue.",
        "Do not simulate a stack by repeatedly searching and splicing a string: every removal of a matched pair rescans in O(n), worst case O(n2), and it hides monotonicity from the reader. An explicit stack is linear and leaves room for the 'store indices, not values' upgrade. Bridge: dsl trained you on how pointers travel; this chapter is about which order you process things in, and la4's fast/slow pointers are already the embryo of a stack and a queue."
      ],
      code: `#include <cstddef>
#include <string>
#include <vector>

char expected(char close) { return close == ')' ? '(' : close == ']' ? '[' : '{'; }

// 括号匹配：右括号来了，先判空再取栈顶
bool isValid(const std::string& s) {
    std::vector<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') { st.push_back(c); continue; }
        if (st.empty() || st.back() != expected(c)) return false;
        st.pop_back();
    }
    return st.empty();                      // 还剩左括号说明没有配完
}

// 单调栈：每个元素右边第一个更大的下标，进出栈各一次所以是 O(n)
std::vector<int> nextGreater(const std::vector<int>& a) {
    std::vector<int> res(a.size(), -1);
    std::vector<int> st;                    // 栈里存下标而不是值，才能算出距离
    for (int i = 0; i < static_cast<int>(a.size()); ++i) {
        while (!st.empty() && a[st.back()] < a[i]) { res[st.back()] = i; st.pop_back(); }
        st.push_back(i);
    }
    return res;
}

int main() {
    if (isValid("([)]")) return 1;          // 交叉嵌套不合法
    std::vector<int> a{2, 1, 3};
    return static_cast<int>(nextGreater(a)[0]);   // 0：2 右边第一个更大的是 3
}`,
      pit: "在 `top()` 之前忘了判 `empty()`：括号匹配、单调栈、迭代式树遍历都提供了「栈可能为空」的输入路径，而 `std::stack::top()` 与 `pop()` 都不做检查。空栈上调用是未定义行为，通常表现为读到栈底的垃圾值或直接段错误，而不是一个能捕获的异常。",
      pit_en: "Calling top() without checking empty(): bracket matching, monotone stacks and iterative traversals all have input paths where the stack is legitimately empty, and neither std::stack::top() nor pop() checks. On an empty stack that is undefined behaviour, which usually shows up as a garbage value from the bottom of the storage or a segfault, never as a catchable exception.",
      ex: {
        q: "为什么单调栈是 O(n) 而不是 O(n²)，即使代码里有嵌套的 while？",
        a: "因为外层每个元素入栈一次、内层每个元素出栈最多一次，总的栈操作不超过 2n 次；分析这类循环要看「元素被处理的总次数」而不是「循环嵌套了几层」。",
        q_en: "Why is a monotone stack O(n) despite the nested while loop?",
        a_en: "Because the outer loop pushes each element once and the inner loop pops it at most once, so no more than 2n stack operations happen in total; such loops are counted by how often elements are processed, not by nesting depth."
      }
    },

    "kb2": {
      min: 12,
      summary: [
        "队列 FIFO：一端进、另一端出，`std::queue` 同样是适配器（默认底层 `std::deque`）。三类场景占尽它：BFS、任务排队、生产者-消费者缓冲。",
        "循环数组是「数组队列」的核心技巧：`rear = (rear + 1) % cap`，头尾下标绕回，取模让出队的空间立刻可复用，全程不搬一个元素——这正是数组队列相对「每次 shift 的假队列」的本质改进。",
        "空满歧义必须解决：`front == rear` 既可能空也可能满。两条出路——**牺牲一格**（判满写成 `(rear + 1) % cap == front`，容量少 1）或**额外记 size**（判空判满都是 O(1) 且一格不浪费）。工程上记 size 更好，因为它还能顺便给出「当前长度」。",
        "`std::queue` 刻意不提供遍历（没有迭代器、没有 `at()`）：这是接口收缩，逼你把「只能看队头」的语义守住。要看全部元素就用 `std::deque`，或自己维护一个影子 vector。",
        "`std::deque` 是分块数组（一段定长块 + 一张块指针表），所以两端增删 O(1) 且不整体搬移。它的失效规则要背：在**两端**插入只让迭代器失效、引用与指针仍然有效；在**中间**插入两边全失效；两端删除会让被删元素的迭代器与引用都失效。这也是 `std::queue` 选它做默认底层的原因。",
        "单调队列是「双端队列 + 单调性」的组合拳，代表作是滑动窗口最大值：新元素进来时把**队尾所有比它小的**都弹出（它们在这个窗口里已永无出头之日），队头下标一旦出窗就弹掉，答案就是队头。每个元素进出各一次 → O(n)。",
        "BFS 用队列而不是栈，是因为它要保证「按层扩展」：先发现的节点必须先处理，才能保证无权图第一次到达某点时的步数就是最短步数。换成栈就变成了 DFS，最短性立刻失效（但省内存）。",
        "队列与栈的选择从来不是「哪个更高级」，而是「处理顺序是哪一种」：后进先出 → 栈，先进先出 → 队列，按重要度 → 优先队列（堆，tc4 展开），两端都要 → deque。把这句话当成选型的第一判断。"
      ],
      summary_en: [
        "A queue is FIFO — one end for entry, the other for exit — and std::queue is again just an adaptor (over std::deque by default). Almost all of its uses fall into three buckets: BFS, task scheduling, and producer-consumer buffering.",
        "The circular array is the heart of an array-backed queue: rear = (rear + 1) % cap, so indices wrap and a dequeued slot is immediately reusable without moving a single element. That is the real upgrade over the fake queue that shifts the array on every pop.",
        "The empty-versus-full ambiguity must be resolved, since front == rear can mean either. Two answers: sacrifice one slot (full becomes (rear + 1) % cap == front, costing one cell of capacity), or keep an explicit size (both tests O(1), no cell wasted, and you get the current length for free). Production code prefers the counter.",
        "std::queue deliberately exposes no iterators and no at(): that interface shrinkage is the point, keeping the promise that only the front is visible. Need to inspect everything? Use std::deque, or keep a shadow vector.",
        "std::deque is a chunked array (fixed-size blocks behind a map of block pointers), which is why both ends cost O(1) with no wholesale moving. Memorise its invalidation rules: inserting at either end invalidates iterators but leaves references and pointers valid; inserting in the middle invalidates both kinds; erasing from an end invalidates that element's iterators and references. This is exactly why std::queue defaults to it.",
        "A monotone queue pairs a deque with monotonicity; its signature problem is the sliding-window maximum. When a new element arrives, pop every smaller element off the back (they can never again win inside this window), pop the front when its index leaves the window, and the answer is the front. Each element enters and leaves once, so O(n).",
        "BFS uses a queue rather than a stack because it must expand level by level: an earlier-discovered node must be processed first, which is what guarantees that the first arrival at a node in an unweighted graph is its shortest distance. Swap in a stack and you get DFS — no longer shortest-first, but lighter on memory.",
        "Choosing between queue and stack is never about which is more sophisticated, only about which processing order the algorithm needs: last-in-first-out wants a stack, first-in-first-out a queue, importance-ordered a priority queue (a heap, see tc4), both-ended access a deque. Make that the first question in any design."
      ],
      code: `#include <cstddef>
#include <vector>
class MyQueue {
    std::vector<int> data_;
    std::size_t head_ = 0, count_ = 0;      // 记 count_，而不是牺牲一格来区分空与满
public:
    explicit MyQueue(std::size_t cap) : data_(cap) {}
    std::size_t cap() const { return data_.size(); }
    bool full() const { return count_ == cap(); }
    bool empty() const { return count_ == 0; }
    bool enq(int x) {
        if (full()) return false;           // 满了要失败，不能悄悄覆盖队头
        data_[(head_ + count_) % cap()] = x; // 取模复用数组尾部腾出的格子
        ++count_;
        return true;
    }
    bool deq(int* out) {
        if (empty()) return false;
        *out = data_[head_];
        head_ = (head_ + 1) % cap();        // 只动下标，不搬元素
        --count_;
        return true;
    }
};

int main() {
    MyQueue q(3);
    int got = 0;
    q.enq(1); q.enq(2); q.enq(3);
    bool blocked = !q.enq(4);               // 队满：入队被拒
    q.deq(&got);                            // 取出 1，头部空格立刻可复用
    q.enq(4);
    return (blocked && got == 1) ? 0 : 1;
}`,
      pit: "用「牺牲一格」方案却把判满写成 `head_ == tail_`，或反过来在判空时也用了同一个条件：空与满在这一刻无法区分，队列在恰好装满的那一瞬间开始**静默丢弃数据**。要么老实记 `count_`，要么保证 `(rear + 1) % cap == front` 只用于判满、判空只用 `front == rear`。",
      pit_en: "Choosing the one-slot-sacrifice scheme and then writing the full test as head == tail, or reusing that same condition for empty: the two states are indistinguishable at that instant and the queue starts silently dropping data exactly when it becomes full. Either keep an explicit counter, or be strict that (rear + 1) % cap == front tests fullness while front == rear alone tests emptiness.",
      ex: {
        q: "为什么滑动窗口的单调队列里要存下标，而不是只存值？",
        a: "因为「元素是否已经离开窗口」只能由下标判断：只存值的话，队头到底该不该弹没有任何依据，窗口就会带着过期元素一起给出错误答案。存下标同时还能顺手拿到值，两者都不丢。",
        q_en: "Why does the monotone queue for a sliding window store indices instead of values?",
        a_en: "Because whether an element has already left the window can only be judged from its index; store values alone and you have no basis for popping the front, so stale elements leak into the answer. An index still gives you the value with one lookup, so nothing is lost."
      }
    },

    "kb3": {
      min: 13,
      summary: [
        "哈希表先用哈希函数把 key 压成一个 `std::size_t`，再对**桶数**取模定位下标。平均 O(1) 的前提有两条：哈希值分布均匀、负载因子够低；任何一条塌了都会退化。",
        "冲突解决的两大流派：拉链法（每个桶挂一条链表/一段数组，标准库 `unordered_*` 多用它）与开放寻址（在本表里按探测序列找空位，缓存友好但删除要留**墓碑**，且聚集会让探测越来越长，负载因子必须远低于 1，常用 0.5~0.7）。",
        "负载因子 = 元素数 / 桶数。`std::unordered_map` 默认 `max_load_factor()` 是 1.0，超过就 rehash 到更大的（通常是素数）桶数。rehash 是 O(n) 的，所以**批量插入前先 `reserve(n)`**，常有 2~3 倍收益。",
        "rehash 的失效规则是面试高频：所有**迭代器**失效（桶数组换了），但拉链法里节点不搬家，所以**引用与指针仍然有效**。这一点和 `std::vector` 恰好相反（vector 扩容后引用全废），也和 `std::deque`（两端插入只废迭代器）不同。",
        "为什么无序容器不能按 key 排序遍历：哈希函数的职责就是**把顺序打散**，相邻的 key 落到完全无关的桶里；容器至多保证「同一桶内的局部顺序」，不存在全局序。要有序遍历或范围查询就用 `std::map`（红黑树，O(log n)，还提供上下界查找 `lower_bound`）——这是取舍，不是谁更快。",
        "哈希与相等必须配套：自定义 key 要同时给 hash 和 `operator==`，规则只有一条——**相等的对象哈希值必须相等**（反过来不要求）。只改一边会出现「插进去取不出来」，或者反过来把两个不同的对象当成同一个。",
        "哈希还有安全与对抗面：可预测的字符串哈希能让攻击者构造大量同桶 key，把 O(1) 打成 O(n)（哈希洪水攻击）；生产实现会加随机种子。竞赛里「卡 unordered_map」是同一原理，被卡时换 `std::map` 或对 key 做二次混合最省事。",
        "两个高频误用：把浮点数当 key（`NaN != NaN`、`-0.0 == 0.0` 但哈希可能不同、精度抖动会让「同一个值」算出不同哈希）；以及只读查询却写 `m[k]`——`operator[]` 找不到就插入默认值，既污染数据又让 `size()` 悄悄变大，只读要用 `count`/`find`/`at`。"
      ],
      summary_en: [
        "A hash table maps the key through a hash function into a std::size_t, then reduces it modulo the bucket count. Average O(1) needs two things to hold: the hashes must be well distributed and the load factor low. Break either and the guarantee collapses.",
        "Two schools for collisions: chaining (each bucket holds a list or small array, which is what the standard unordered_ types mostly use) and open addressing (probe within the same table — cache-friendly, but deletion needs tombstones, clustering stretches probes, and the load factor must stay far below 1, typically 0.5-0.7).",
        "Load factor is elements divided by buckets. std::unordered_map defaults max_load_factor() to 1.0 and rehashes to a larger (usually prime) bucket count past it. A rehash is O(n), so reserve(n) before a bulk insert — often a two- or three-times win.",
        "The invalidation rule after a rehash is a standing interview question: every iterator is invalid (the bucket array moved), yet in a chained table the nodes themselves never relocate, so references and pointers stay valid. That is the opposite of std::vector, whose references all die on growth, and different again from std::deque, where end insertion invalidates only iterators.",
        "An unordered container cannot iterate by key because its hash function exists precisely to destroy order: neighbouring keys land in unrelated buckets and the only surviving order is 'within one bucket'. Need ordered iteration or range queries, use std::map (a red-black tree, O(log n), with lower_bound-style range access). That is a trade, not a speed contest.",
        "Hash and equality are a matched pair: a custom key must supply both, under one rule — equal objects must hash equal (the converse is not required). Change only one side and you get 'inserted but never found', or the worse mirror image where two different objects collide as one.",
        "Hashing also has a security face: a predictable string hash lets an attacker craft keys that all land in one bucket, turning O(1) into O(n) — a hash-flooding attack — so production implementations mix in a random seed. In contests, 'breaking unordered_map' is the same trick, and switching to std::map or double-mixing the key is the cheapest fix.",
        "Two frequent misuses: floating-point keys (NaN != NaN, -0.0 == 0.0 yet possibly different hashes, and rounding drift turns 'the same value' into different hashes), and read-only lookups written as m[k] — operator[] inserts a default on a miss, so it both pollutes the data and inflates size(); use count, find or at to stay read-only."
      ],
      code: `#include <cstddef>
#include <string>
#include <unordered_map>
#include <unordered_set>
struct Point { int x, y; };
struct PointHash {
    std::size_t operator()(const Point& p) const noexcept {
        // 两个字段都要参与混合，只哈希 x 会让整条竖线落进同一个桶
        return static_cast<std::size_t>(p.x) * 1000003ull
             ^ static_cast<std::size_t>(p.y) * 1000033ull;
    }
};
struct PointEq {
    bool operator()(const Point& a, const Point& b) const noexcept {
        return a.x == b.x && a.y == b.y;   // 相等判断必须与哈希配套
    }
};

int main() {
    std::unordered_map<std::string, int> cnt;
    cnt["a"] = 2;
    int probe = cnt["b"];                  // 只想查一下：operator[] 却把 b 插成了 0
    std::size_t polluted = cnt.size();     // 2：凭空多出来的键，统计已经不可信
    bool exists = cnt.count("c") != 0;     // count 只读，不会写入
    std::size_t intact = cnt.size();       // 还是 2
    std::unordered_set<Point, PointHash, PointEq> seen;
    seen.insert(Point{1, 2});
    cnt.reserve(1024);                     // 已知规模就先要够桶数，省掉一路 rehash
    return probe + static_cast<int>(polluted + intact) + exists + static_cast<int>(seen.size());
}`,
      pit: "把 `m[key]` 当只读查询用：`operator[]` 在键不存在时会**插入一个值初始化的元素**并返回其引用。于是一次「看看有没有」的调试语句就改变了容器内容、放大了负载因子、还可能触发 rehash；统计类题目里最典型的症状是「多出一个 0 分的键」和「结果比预期多一项」。",
      pit_en: "Using m[key] as a read: operator[] inserts a value-initialised element when the key is absent and returns a reference to it. So one innocent 'let me just look' line mutates the container, inflates the load factor and may trigger a rehash; in counting problems the tell-tale symptom is an extra key scoring zero and a result with one item too many.",
      ex: {
        q: "为什么 `unordered_map` 遍历顺序每次运行都可能不同，`map` 却永远一致？",
        a: "unordered_map 的顺序由哈希值、桶数和插入历史共同决定，桶数一变（rehash）或换了标准库实现，顺序就变，它只保证「同一次运行、同一组操作下自己一致」；map 由红黑树维护全局 key 序，遍历就是中序，所以稳定可预测。",
        q_en: "Why can unordered_map iterate in a different order each run while map is always identical?",
        a_en: "An unordered_map's order is set by hash values, bucket count and insertion history, so any rehash or a different standard-library implementation shuffles it; it only promises consistency for the same run and the same operations. A map keeps a global key order in its red-black tree, so iteration is an in-order walk and stays predictable."
      }
    },

    "kb4": {
      min: 14,
      summary: [
        "拉链法骨架只要三个成员：`vector<list<pair<K,V>>>` 当桶数组、`hash(K) % 桶数` 定桶、`count` 记元素数。put 先线性扫桶内查重（存在就改值、否则尾插并 `++count`），get 扫到就返回、扫不到返回 false。",
        "取模前必须确认哈希值是**无符号**的：`std::hash` 返回 `std::size_t`，天然非负；自己写 int 版哈希时，负数取模在 C++ 里结果为负（`-7 % 3 == -1`），拿它当下标就是越界。修法是先转无符号，或 `((h % m) + m) % m`。",
        "字符串哈希的常见构造是多项式滚动（`h = h * 131 + c`）或 FNV-1a（素数 1099511628211 与初始值 1469598103934665603）。**无符号乘法的溢出是设计的一部分**：模 2^64 回绕恰好构成一个均匀的哈希环，这不是 bug 也不需要检查。",
        "自定义类型的正规做法是特化 `std::hash<MyKey>`（提供 `std::size_t operator()(const MyKey&) const noexcept`），这样 `unordered_map<MyKey, V>` 无需额外模板参数；多个字段要**混合**而不是只哈希其中一个，常用 `h ^= h2 + 0x9e3779b9 + (h << 6) + (h >> 2)` 这类扰动。",
        "扩容：当 `count > 桶数 × 上限因子`（本骨架用 2 倍）时把桶数翻倍，然后**逐个元素按新桶数重新定位**搬进新数组。整块拷贝或只换桶数不重排，都会让全部元素错位——这是手写哈希表第一大错。",
        "桶数取素数还是 2 的幂不是随便选：2 的幂时 `%` 等价于「只取低若干位」，如果哈希值的低位质量差（例如所有 key 都是 100 的倍数），冲突会成片爆发；素数能把高位信息混进低位。标准库实现各有取舍：libstdc++ 用素数桶，libc++ 用 2 的幂并配更强的混合函数。",
        "删除与迭代器语义：拉链法删除只影响所在那一个桶，被删元素的迭代器失效、其余不受影响；用 `std::list` 当桶还能 `splice` 直接搬节点，避免拷贝。工程上更常见的是「墓碑」惰性删除（只打标记、查找时跳过），攒到一定比例再真正清理。",
        "最后一课是接口选择：`put` 找不到时**不要写**（返回 bool 或 `std::optional`），否则就重演 kb3 的 `operator[]` 污染。手写一遍的真正收获不是那个表，而是从此理解标准库为什么这样设计接口与失效规则。"
      ],
      summary_en: [
        "The chaining skeleton needs three members: a vector<list<pair<K,V>>> as the bucket array, hash(K) % bucket_count to select one, and a counter. put scans its bucket first — update if the key exists, otherwise append and increment; get returns on a hit and false on a miss.",
        "The value you reduce must be unsigned. std::hash returns std::size_t and is therefore non-negative, but if you write your own int-valued hash, remember that C++ modulo keeps the sign of the dividend (-7 % 3 == -1) and using it as an index runs off the front of the array. Cast to unsigned, or write ((h % m) + m) % m.",
        "String hashes are usually built polynomially (h = h * 131 + c) or with FNV-1a (prime 1099511628211, offset basis 1469598103934665603). Unsigned overflow here is part of the design: wrapping modulo 2^64 is exactly what makes the hash space uniform, so it is not a bug and needs no check.",
        "The proper route for a custom type is specialising std::hash<MyKey> with 'std::size_t operator()(const MyKey&) const noexcept', so unordered_map<MyKey, V> needs no extra template arguments. Mix every field rather than hashing only one; a boost-style combine, h ^= h2 + 0x9e3779b9 + (h << 6) + (h >> 2), is the standard idiom.",
        "Growth: when count exceeds bucket_count times the allowed load factor (2x in this skeleton), double the buckets and relocate every element against the new bucket count. Copying the old array wholesale, or resizing without re-hashing, misplaces everything — the number-one error in hand-written tables.",
        "Prime versus power-of-two bucket counts is a real choice, not a detail: with a power of two, % degenerates into 'keep the low bits', so if your hashes have poor low-bit quality (say all keys are multiples of 100) collisions arrive in herds, while a prime folds the high bits down. libstdc++ picks primes; libc++ picks powers of two and compensates with a stronger mixer.",
        "Deletion and iterator semantics: in chaining, an erase touches only its own bucket and invalidates only that element's iterator. Using std::list per bucket even lets splice move nodes without copying. In production the cheaper pattern is lazy deletion with tombstones — mark, skip on lookup, and physically clean up once enough have piled up.",
        "The last lesson is interface design: put must not write on a miss (return bool or std::optional), or you relive kb3's operator[] pollution. The real payoff of hand-writing a table is not the table, it is understanding why the standard library chose these interfaces and these invalidation rules."
      ],
      code: `#include <cstddef>
#include <list>
#include <string>
#include <utility>
#include <vector>
class HashTable {
    std::vector<std::list<std::pair<std::string, int>>> buckets_;
    std::size_t count_ = 0;
    static std::size_t hashKey(const std::string& k) {
        std::size_t h = 1469598103934665603ull;      // FNV-1a 的初始值
        for (char c : k) h = (h ^ static_cast<unsigned char>(c)) * 1099511628211ull;
        return h;                                     // 无符号溢出回绕正是设计的一部分
    }
    void rehash(std::size_t next) {
        std::vector<std::list<std::pair<std::string, int>>> bigger(next);
        for (auto& bucket : buckets_)
            for (auto& kv : bucket)
                bigger[hashKey(kv.first) % next].push_back(std::move(kv));
        // 每个节点都按「新桶数」重新定位，整块拷贝必然全部错位
        buckets_.swap(bigger);
    }
public:
    explicit HashTable(std::size_t cap = 8) : buckets_(cap) {}
    std::size_t size() const { return count_; }
    void put(const std::string& k, int v) {
        auto& bucket = buckets_[hashKey(k) % buckets_.size()];
        for (auto& kv : bucket) if (kv.first == k) { kv.second = v; return; }
        bucket.emplace_back(k, v);
        ++count_;
        if (count_ > buckets_.size() * 2) rehash(buckets_.size() * 2);
    }
    bool get(const std::string& k, int* out) const {
        const auto& bucket = buckets_[hashKey(k) % buckets_.size()];
        for (const auto& kv : bucket) if (kv.first == k) { *out = kv.second; return true; }
        return false;                                 // 查不到不写入，这才叫只读语义
    }
};
int main() {
    HashTable t;
    for (int i = 0; i < 100; ++i) t.put("k" + std::to_string(i), i);
    int v = 0;
    bool hit = t.get("k42", &v);                      // 三次 rehash 之后仍然找得回来
    bool miss = t.get("nope", &v);
    return (hit && !miss && t.size() == 100) ? v : -1;
}`,
      pit: "rehash 时只是把桶数组换成更大的、却按**旧**桶数继续放元素（或者干脆 `buckets_ = std::move(bigger)` 之前忘了逐个重新取模）：所有元素的下标全都错位，插入后取不回来，`size()` 还显示正常。这个 bug 的特征非常明确——「元素数量对，但一半 key 查不到」。",
      pit_en: "Growing the bucket array but placing elements using the old bucket count (or swapping vectors without re-reducing each key modulo the new count): every index is now wrong, keys cannot be found, yet size() still reports the right number. The signature is unmistakable — 'the count is correct but half the keys are missing'.",
      ex: {
        q: "为什么手写哈希表用 `std::list` 当桶，而不是直接用 `std::vector` 当桶？",
        a: "因为链表能 O(1) 头插、删除时不搬移同桶其它元素、还能在 rehash 时用 splice 直接搬走节点而不拷贝内容；vector 更省内存、遍历更快，但插入会移动元素、任何迭代器/引用规则都要重新考虑。面试里选 list 是为了把「冲突处理」写干净，工程里常常反过来选 vector。",
        q_en: "Why use std::list rather than std::vector as the bucket's inner container in a hand-written table?",
        a_en: "A list appends at the head in O(1), erases without shifting its bucket-mates, and can be spliced wholesale during rehashing with no element copies. A vector is smaller and scans faster but moves elements on insertion and forces you to re-derive every iterator and reference rule. Interviews favour list because it makes collision handling legible; production code often chooses vector for exactly the opposite reasons."
      }
    },

    "kb5": {
      title: "综合重构：用「处理顺序」反推栈、队列与哈希",
      title_en: "Synthesis: Let the Processing Order Pick Stack, Queue or Hash",
      min: 15,
      target:  "面对新题能先判定处理顺序（后进先出 / 先进先出 / 按重要度 / 只查存在），再据此选结构，并说清所选结构的失效规则与最坏退化条件。",
      target_en: "For a new problem, name the required processing order first (last-out, first-out, by priority, existence-only), pick the structure accordingly, and state its invalidation rules and its worst-case degradation.",
      summary: [
        "第一问永远是「处理顺序」而不是「用什么容器」：要最近/嵌套/可回退 → 栈（含单调栈）；要最早/按层/排队 → 队列（含单调队列）；要按重要度随时取极值 → 优先队列（堆，tc4）；只要「在不在 / 对应哪个值」→ 哈希表；两头都要 → deque。",
        "把这一章的四件事串成一条可复用的组合拳：滑动窗口最大值 = 双端队列 + 单调性；表达式求值 = 双栈 + 优先级表；括号匹配 = 栈 + 空判；LRU = 哈希表 + 双向链表（哈希给 O(1) 定位、链表给 O(1) 摘除与搬到队首）。**LRU 是本段最典型的「两种结构互为补充」**，务必自己写一遍。",
        "复杂度要说得精确：哈希查找平均 O(1)、最坏 O(n)（全部冲突）；`std::map` 稳定 O(log n) 且能范围查询；单调栈/单调队列是「每个元素进出各一次」的 O(n)，不是「有嵌套循环所以 O(n²)」——这条分析方法在 la1 已经练过，这里要用熟。",
        "失效规则复盘，这三条必须能脱口而出：`unordered_map` rehash 后迭代器全废、引用与指针仍有效；`vector` 扩容后三者全废；`deque` 两端插入只废迭代器、引用仍有效。答不出这三条，写出的容器代码就一定藏着悬空迭代器。",
        "边界与失败模式清单：空栈调用 `top()`（未定义行为）；循环队列的空满歧义（忘了 size 或牺牲一格）；`operator[]` 把查询变成插入；`get` 在找不到时顺手写入；rehash 忘了按新桶数重排；负数哈希值取模得负下标。这六条正是本章六道事故。",
        "内存视角补一刀：`unordered_map` 每个节点是「pair + next 指针 + 分配器开销」，比同样元素数的 `vector<pair>` 大 3~5 倍；小容器（十几个元素）时 `vector` + 线性查找常常比哈希更快，因为一次比较几纳秒、而一次哈希可能要看两三个缓存线。选结构要看**规模**，不是看理论。",
        "本章达标线（自查）：能默写「双栈表达式求值」或「LRU」之一；能说清「为什么无序容器不能排序遍历」与「rehash 之后哪些东西还有效」这两个问题。",
        "衔接：dst 二叉树与堆把「线性」换成「分层」——那里的处理顺序变成前中后序与层序，堆则是「按重要度取极值」这条线的标准答案。"
      ],
      summary_en: [
        "The first question is always about processing order, never about containers: most-recent, nested or undoable wants a stack (monotone included); earliest, level-by-level or queued wants a queue (monotone included); 'whatever is most important right now' wants a priority queue (a heap, see tc4); pure existence or lookup-by-key wants a hash table; both ends wants a deque.",
        "Chain the chapter's four ideas into reusable combinations: sliding-window maximum is a deque plus monotonicity; expression evaluation is two stacks plus a precedence table; bracket matching is a stack plus an emptiness test; LRU is a hash map plus a doubly linked list, where the map gives O(1) location and the list gives O(1) unlink-and-move-to-front. LRU is the cleanest example of two structures covering each other's weakness, so write it yourself once.",
        "State the costs precisely: hash lookup averages O(1) and degrades to O(n) when everything collides; std::map is a steady O(log n) and additionally offers range queries; monotone stacks and queues are O(n) because 'each element enters and leaves once', not O(n2) because 'there is a nested loop' — the analysis habit from la1, now in use.",
        "Invalidation rules, all three must come out instantly: after an unordered_map rehash every iterator is dead but references and pointers survive; after a vector growth all three die; a deque insertion at either end kills only iterators, leaving references valid. Write container code without these and a dangling iterator is already in it.",
        "Failure-mode inventory: top() on an empty stack (undefined behaviour), the empty-versus-full ambiguity in a circular queue (no size counter and no sacrificed slot), operator[] turning a query into an insertion, a get() that writes when it misses, a rehash that forgets to re-modulo against the new count, and a negative hash reducing to a negative index. Those six are this chapter's six accidents.",
        "Add the memory view: an unordered_map node costs a pair plus a next pointer plus allocator overhead, three to five times a vector<pair> of the same length; and at a dozen elements a vector with a linear scan is frequently faster, because one comparison is a few nanoseconds while a hash may chase two or three cache lines. Size decides, not theory.",
        "Bar for this chapter (self-check): reproduce either the two-stack expression evaluator or LRU from memory, and answer both 'why can an unordered container not iterate in key order' and 'what is still valid after a rehash'.",
        "Bridge: dst binary trees and heaps replace 'linear' with 'layered', so the processing order becomes pre/in/post-order and level order, and the heap is the standard answer to 'give me the extreme right now'."
      ],
      code: `#include <cstddef>
#include <string>
#include <unordered_map>
#include <vector>
// 双栈求值：操作数与运算符各一栈，优先级与左结合全在这张表里
int eval(const std::string& s) {
    std::vector<int> nums;
    std::vector<char> ops;
    std::unordered_map<char, int> prec{{'+', 1}, {'-', 1}, {'*', 2}, {'/', 2}};
    auto apply = [&]() {
        int b = nums.back(); nums.pop_back();     // 后弹出的是右操作数
        int a = nums.back(); nums.pop_back();
        char op = ops.back(); ops.pop_back();
        nums.push_back(op == '+' ? a + b : op == '-' ? a - b : op == '*' ? a * b : a / b);
    };
    for (std::size_t i = 0; i < s.size(); ++i) {
        char c = s[i];
        if (c == ' ') continue;
        if (c == '(') { ops.push_back(c); continue; }
        if (c == ')') {
            while (ops.back() != '(') apply();
            ops.pop_back();                       // 丢掉左括号，它自己不参与计算
            continue;
        }
        if (prec.count(c)) {                      // 栈顶优先级不低于我就先算掉
            while (!ops.empty() && ops.back() != '(' && prec[ops.back()] >= prec[c]) apply();
            ops.push_back(c);
            continue;
        }
        int x = 0;
        while (i < s.size() && s[i] >= '0' && s[i] <= '9') x = x * 10 + (s[i++] - '0');
        nums.push_back(x);
    }
    while (!ops.empty()) apply();
    return nums.back();
}
int main() {
    // 括号去掉一层就要多写一遍弹栈逻辑：这就是「先转后缀再求值」存在的理由
    return eval("2 * (3 + 4) - 6 / 3");           // 12
}`,
      pit: "在遍历 `unordered_map` 的过程中插入元素（例如「查不到就顺手塞一个默认值」写在范围 for 的循环体里）：一旦触发 rehash，正在使用的迭代器全部失效，程序可能出现死循环、漏元素或直接崩溃，而且**桶数没变的那次运行完全正常**。要插入就先用 `find` 判断、把待插入项攒到外面，循环结束后统一插入。",
      pit_en: "Inserting into an unordered_map while iterating it — say, 'if it is missing, store a default' inside a range-for body. If that insert triggers a rehash, every iterator in hand becomes invalid, and the program may spin, skip elements or crash; and it behaves perfectly on every run where the bucket count happens not to change. Check with find, collect pending inserts outside the loop, and merge afterwards.",
      ex: {
        q: "为什么 LRU 必须「哈希表 + 双向链表」，只用其中一种不行吗？",
        a: "只用哈希表，找得到但不知道谁最久未用（哈希没有顺序）；只用链表，知道顺序但定位一个 key 要 O(n) 走一遍。组合后哈希负责 O(1) 定位到链表节点、链表负责 O(1) 摘除并搬到队首，两个操作才同时达到 O(1)。",
        q_en: "Why must LRU pair a hash table with a doubly linked list — is one of them not enough?",
        a_en: "A hash table alone finds a key but has no order, so it cannot say who was used longest ago; a list alone has order but locating a key walks O(n) nodes. Together the map gives O(1) access to a list node and the list gives O(1) unlink-and-move-to-front, which is the only way both operations are O(1) at once."
      }
    },

    /* ===================== dst 二叉树与堆 ===================== */
    "tc1": {
      min: 12,
      summary: [
        "树是递归定义（一个根 + 若干棵子树），所以几乎每个树算法都长成「处理根 + 递归子树」；二叉树就是每个孩子最多两个，且**左右有区别**——交换左右子树得到的是另一棵二叉树。",
        "术语不能混：度是孩子的个数；深度与高度要按题面约定（根算 0 层还是 1 层）；满二叉树每层全满；完全二叉树只允许**最后一层从右往左缺**。堆必须是完全二叉树 + 堆序，少一个条件就不成立。",
        "三条计数性质要能现场推：深度 h 最多 2^h − 1 个节点；叶子数 = 度为 2 的节点数 + 1（`n0 == n2 + 1`）；n 个节点有 **n+1 个空指针**——2n 个指针槽减去 n−1 条实际用掉的边。第三条正是「线索二叉树」能塞进去的动机。",
        "两种存法各有适用：指针式（节点 + left/right）适合形态任意变化的树；数组式（下标 i 的孩子是 2i、2i+1，父亲是 i/2）零指针开销、缓存友好，但只有**完全二叉树**才成立——一般二叉树用数组可能空出 2^h 量级的格子。堆与线段树用的都是数组式。",
        "节点结构要就地初始化：`TreeNode* left = nullptr;` 比「只声明不初始化」安全得多。未初始化的孩子指针不是空指针，是随机值——`if (p->left)` 判断会当成有效指针对象，然后段错误出现在与你完全无关的深处。",
        "销毁必须按**后序**：先递归删两棵子树、再删自己，否则删完父节点再去读它的孩子是释放后使用。递归析构要当心深度：一条 10^5 节点的左斜树，析构递归本身就爆栈——所以工程上要么用迭代显式栈，要么接受 `std::unique_ptr` 的递归析构风险并限制高度。",
        "退化是本段反复出现的伏笔：顺序插入的 BST 会变成链表，高度从 log n 变成 n，于是所有递归遍历都有爆栈风险、所有查找从 O(log n) 变成 O(n)。看一棵树时先问「它的高度是多少」，比问它叫什么名字有用。",
        "衔接：dsk 的队列在本章直接复用（层序就是 BFS），递归三部曲也来自 srec c1；想清 tc2 的四种遍历只是「处理根这件事放在递归的哪一个位置」，四种遍历就不需要背了。"
      ],
      summary_en: [
        "A tree is defined recursively (one root plus a forest of subtrees), so nearly every tree algorithm has the shape 'handle the root, recurse into the subtrees'. A binary tree caps children at two and keeps left and right distinct — swapping them yields a different binary tree.",
        "Keep the vocabulary separate: degree counts children; depth and height follow whichever convention the statement sets (root at level 0 or 1); a full tree fills every level; a complete tree may only be short at the far right of the last level. A heap is a complete tree plus heap order, and dropping either condition breaks it.",
        "Three counting facts worth deriving on the spot: a tree of depth h holds at most 2^h - 1 nodes; leaves equal degree-2 nodes plus one (n0 == n2 + 1); and n nodes leave n+1 null pointers — 2n slots minus the n-1 edges actually used. That last one is precisely the room threaded binary trees move into.",
        "Two storage styles, two regimes: pointer nodes with left/right suit trees whose shape changes freely; the array layout (children of i at 2i and 2i+1, parent at i/2) costs no pointers and caches well but is only valid for a complete tree — a general tree stored that way may waste 2^h cells. Heaps and segment trees use the array form.",
        "Initialise the child pointers in-class: 'TreeNode* left = nullptr;' is far safer than declaring them bare. An uninitialised child pointer is not null but a garbage value, so 'if (p->left)' happily passes the test and the segfault arrives deep somewhere unrelated to your code.",
        "Destroy in post-order: recurse into both subtrees, then delete the node itself, or you read through a freed parent. Watch the depth of recursive destruction — a 10^5-node left-leaning chain overflows the stack while being torn down. So either use an explicit stack, or accept std::unique_ptr's recursive destructor only where heights stay bounded.",
        "Degeneration is this stage's running theme: a BST fed sorted data becomes a list, its height moves from log n to n, every recursive traversal risks the stack and every search goes from O(log n) to O(n). When looking at a tree, ask 'what is its height' before asking what it is called.",
        "Bridge: dsk's queue is reused here directly (level order is BFS), and the three-part recursion comes from srec c1; once you see that tc2's four traversals are only 'which of the three recursion slots handles the root', there is nothing left to memorise."
      ],
      code: `#include <cstddef>
#include <vector>
struct TreeNode {
    int val;
    TreeNode* left = nullptr;        // 就地初始化：未初始化的孩子指针是段错误的入口
    TreeNode* right = nullptr;
    explicit TreeNode(int x) : val(x) {}
};

// 完全二叉树的父子关系只靠下标，这就是堆能用数组存的原因
int parentOf(std::size_t i) { return static_cast<int>(i / 2); }

int main() {
    std::vector<int> byIndex{0, 1, 2, 3, 4, 5};   // 下标 0 空出来，公式才刚好成立
    int deepest = byIndex[5];
    int itsParent = parentOf(5);                  // 3：不用任何指针就能回溯

    TreeNode* t = new TreeNode(1);
    t->left = new TreeNode(2);
    t->right = new TreeNode(3);
    // 计数自查：叶子数 = 度为 2 的节点数 + 1；n 个节点有 n+1 个空指针
    int nodes = 3, leaves = 1, inner = 1;
    bool okNull = (nodes + 1 == 2 * nodes - (nodes - 1));
    delete t->left; delete t->right; delete t;    // 销毁顺序：先孩子后自己
    return (okNull && itsParent == 3 && leaves == inner + 1 && deepest == 5) ? 0 : 1;
}`,
      pit: "声明节点时忘了把 `left` / `right` 初始化成 `nullptr`：它们带着栈或堆上的随机值，`if (p->left)` 判断照样通过，程序于是「偶尔」在很深的位置段错误，重跑又好了。补上就地初始化（`= nullptr`）或在构造函数的初始化列表里显式置空，这条纪律比任何调试器都便宜。",
      pit_en: "Declaring a node without initialising left and right: they carry whatever garbage sat in that stack or heap memory, so 'if (p->left)' passes and the program segfaults, now and then, somewhere deep, then behaves on the next run. In-class '= nullptr' or an explicit initialiser in the constructor is a cheaper discipline than any debugger.",
      ex: {
        q: "为什么堆一定要是「完全二叉树」，普通的二叉树不行吗？",
        a: "因为堆的全部效率来自用数组存：完全二叉树的节点下标与父子关系能用 2i、2i+1、i/2 精确对应，不需要任何指针也保证高度只有 log n。换成任意形态的二叉树，数组下标与父子关系就对不上，要么空耗指数级格子，要么退化成每次遍历找孩子。",
        q_en: "Why must a heap be a complete binary tree rather than just any binary tree?",
        a_en: "Because a heap's whole efficiency comes from living in an array: in a complete tree, indices match parent-child exactly through 2i, 2i+1 and i/2, so no pointers are needed and the height is guaranteed logarithmic. For an arbitrary shape the index relation fails, and you either burn exponentially many cells or walk the array to find children."
      }
    },

    "tc2": {
      min: 15,
      summary: [
        "递归三部曲只有一行差别：终止条件（`if (!p) return;` **永远是函数第一行**）、在当前节点做什么、递归左右子树。前序/中序/后序的区别只是「做那件事」被放在三次调用的哪一个位置。",
        "三种顺序各自的用途要记「方向」：前序（根左右）自上而下，用于复制树、序列化、把路径信息当参数往下传（路径和、深度）；中序（左根右）在 BST 上给出升序；后序（左右根）自下而上，用于子树大小、表达式树求值、销毁节点、树形 DP。**看到「需要孩子的答案」就该写后序**。",
        "层序遍历用队列，且「按层分组」的关键是：每轮循环开始时先记下 `q.size()` 作为本层宽度，然后只处理这么多个。忘了取快照就会把下一层混进本层，这是层序题第一大错。",
        "前序 + 中序（或后序 + 中序）能唯一还原二叉树，前序 + 后序**不能**：中序的作用是「用根把序列切成左右两半」，而只有两个「根在端点」的序列时，遇到独生子就分不清它是左还是右。前提条件也别忘了——节点值必须互不相同。",
        "迭代版各有各的写法：前序用栈，弹栈处理、**先压右再压左**（栈是反的）；中序是「一路向左压到底 → 弹栈处理 → 转向右子树」，这也正是 BST 迭代器的实现（`next()` 均摊 O(1)、空间 O(h)）；后序用「根右左再反转」或记录上次访问的指针，比前中序麻烦。Morris 遍历利用叶子节点的空右指针做临时线索，走完再还原，做到 O(1) 额外空间——代价是会临时改树。",
        "空间成本是 O(h) 而不是 O(1)：平衡树 h = O(log n)，退化成链表时 h = O(n)，所以「遍历一棵二叉树」在最坏情况下本身就有爆栈风险。深度不可控的树必须用迭代版或 Morris。",
        "四种高频错：① 漏写空节点终止条件 → 段错误；② 把「节点值」当 visited 用于有重复值的图/树 → 走错分支，要存指针或编号；③ 层序忘了取 size 快照；④ 返回 `int` 时既想用 0 表示答案、又想用 0 表示「不存在」——要么换 `std::optional`，要么用哨兵常量并想清它与合法值是否冲突。",
        "衔接：tc3 会把「中序在 BST 上有序」这条性质用到极致（判定、第 k 小、验证），tc4 的堆则是「层序顺序恰好就是数组顺序」的直接受益者。"
      ],
      summary_en: [
        "The recursive template differs by one line only: the base case ('if (!p) return;' is always the first statement), what you do at the current node, and the two recursive calls. Pre-, in- and post-order are just that action placed in one of the three slots.",
        "Learn the direction each order is good for. Pre-order (root-left-right) runs top-down: copy a tree, serialise it, carry path information downward as parameters (path sum, depth). In-order (left-root-right) yields sorted output on a BST. Post-order (left-right-root) runs bottom-up: subtree sizes, expression evaluation, freeing nodes, tree DP. When an answer needs its children's answers, you are writing post-order.",
        "Level order uses a queue, and grouping by level hinges on one move: record q.size() as the width of the current level before the inner loop, and process exactly that many. Skip the snapshot and the next level leaks into this one — the leading error in level-order problems.",
        "Pre-order plus in-order (or post-order plus in-order) reconstructs a binary tree uniquely; pre-order plus post-order cannot, because the in-order sequence is what splits at the root into left and right halves, and two sequences that both put the root at an end leave a single child ambiguous. And the values must be distinct for any of this to hold.",
        "Each iterative form has its own shape. Pre-order: pop, visit, push right then left (a stack reverses them). In-order: push all the way left, pop and visit, then move to the right subtree — which is exactly how a BST iterator is built, with amortised O(1) next() and O(h) memory. Post-order is fiddlier: visit root-right-left and reverse, or track the last visited pointer. Morris traversal borrows the leaf's null right pointer as a temporary thread, restores the tree on the way out, and reaches O(1) extra space by temporarily mutating it.",
        "The cost is O(h) space, not O(1): balanced means h = O(log n), a degenerated chain means h = O(n), so merely traversing a tree can overflow the stack in the worst case. Unbounded depth calls for the iterative or Morris version.",
        "Four frequent faults: forgetting the null base case and segfaulting; using node values as a visited set on a tree with duplicate values (store pointers or ids instead); skipping the level-size snapshot; and returning int where 0 must mean both 'the answer' and 'does not exist' — switch to std::optional, or use a sentinel you have proved is not a legal value.",
        "Bridge: tc3 leans hard on 'in-order is sorted on a BST' for validation and k-th smallest, while tc4's heap is the direct beneficiary of 'level order is exactly array order'."
      ],
      code: `#include <cstddef>
#include <queue>
#include <vector>
struct TreeNode {
    int val;
    TreeNode* left = nullptr;
    TreeNode* right = nullptr;
    explicit TreeNode(int x) : val(x) {}
};

// 递归三部曲：第一行永远是判空，然后把「处理根」放到需要的位置上
void preorder(const TreeNode* p, std::vector<int>& out) {
    if (!p) return;                       // 漏掉这一行就是无限递归段错误
    out.push_back(p->val);                // 根在前：复制树、序列化、自上而下传参
    preorder(p->left, out);
    preorder(p->right, out);
}
void inorder(const TreeNode* p, std::vector<int>& out) {
    if (!p) return;
    inorder(p->left, out);
    out.push_back(p->val);                // 根在中：在 BST 上得到升序
    inorder(p->right, out);
}
// 层序：每轮开始时的 size() 就是本层宽度，「按层分组」全靠这一句
std::vector<std::vector<int>> levelOrder(const TreeNode* root) {
    std::vector<std::vector<int>> res;
    if (!root) return res;
    std::queue<const TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        std::size_t wide = q.size();      // 先取快照，否则会把下一层算进本层
        res.emplace_back();
        for (std::size_t i = 0; i < wide; ++i) {
            const TreeNode* p = q.front(); q.pop();
            res.back().push_back(p->val);
            if (p->left) q.push(p->left);
            if (p->right) q.push(p->right);
        }
    }
    return res;
}
int main() {
    TreeNode* r = new TreeNode(1);
    r->left = new TreeNode(2);
    r->right = new TreeNode(3);
    std::vector<int> a, b;
    preorder(r, a);
    inorder(r, b);
    auto lay = levelOrder(r);
    // 前序第一个是根，中序第一个是最左节点，层序第一层只有一个
    bool ok = a[0] == 1 && b[0] == 2 && lay.size() == 2 && lay[0].size() == 1;
    delete r->left;
    delete r->right;
    delete r;                             // 只有两层，手工删就够；深树要按后序删
    return ok ? 0 : 1;
}`,
      pit: "递归函数忘了先判空（或把判空写在解引用之后）：`root->val` 出现在 `if (!root)` 之前，只要有一条分支走到 `nullptr` 就当场段错误。对称的另一半是层序忘了取 `q.size()` 快照——它不会崩，只会把「每层一组」变成「每层混乱」，输出看起来仍然像正确答案。",
      pit_en: "Forgetting the null guard, or placing it after the dereference so that root->val is read before if (!root) — one path reaching nullptr is an instant segfault. Its mirror image is the level-order loop that never snapshots q.size(): it does not crash, it just merges levels, and the output still looks plausible.",
      ex: {
        q: "为什么「前序 + 后序」不能唯一还原一棵二叉树，而「前序 + 中序」可以？",
        a: "因为还原的每一步都需要知道「根的左子树占序列的哪一段」，这个切分信息只能由中序提供（根把中序序列分成左右两半）。前序和后序都把根放在端点，遇到只有一个孩子的节点时，无法判断那是左孩子还是右孩子。",
        q_en: "Why can pre-order plus post-order not reconstruct a tree uniquely, while pre-order plus in-order can?",
        a_en: "Each reconstruction step needs to know which slice of the sequence belongs to the left subtree, and only the in-order sequence supplies that split — the root divides it into the two halves. Pre- and post-order both park the root at an endpoint, so a node with one child leaves that child's side undetermined."
      }
    },

    "tc3": {
      min: 14,
      summary: [
        "BST 性质是「**左子树所有**节点 < 根 < **右子树所有**节点」。这句话里的「所有」就是本题全部难度所在：它是对整棵子树的约束，不是对孩子的一对一比较。",
        "判定陷阱的标准反例：根 8、左孩子 3、3 的右孩子 10。父子两两比较全部通过，但 10 在 8 的左子树里，违反性质。正确写法是自顶向下**传上下界**：进入左子树收紧上界、进入右子树收紧下界；或者中序遍历检查严格递增。",
        "边界的类型有坑：用 `int lo = INT_MIN` 会把「节点值恰好等于 INT_MIN」误判成非法（因为要求严格大于），值域是 int 时边界要用 `long long`，或者用指针/`std::optional` 表示「负无穷」。这一格在测例里有 INT_MIN 时才暴露。",
        "查找与插入平均 O(log n)、最坏 O(n)；删除的三种情况必须背熟：① 叶子直接删；② 只有一个孩子就让孩子顶上来；③ **两个孩子**时用右子树最左（后继）或左子树最右（前驱）替换值，再递归去删那个替换者。第三种是唯一容易写错的一支。",
        "顺序插入 1,2,3,4,5 会让树退化成链表：高度从 log n 变成 n，查找变 O(n)，递归遍历还会爆栈。平衡树就是为它而生——AVL 严格（任意节点左右子树高差 ≤ 1），查找更快但插入删除旋转多；红黑树用「黑高」松弛约束（最长路径不超过最短的两倍），写入代价更低，所以 `std::map` 选红黑树。",
        "BST ≠ 平衡树：BST 只保证中序有序，不保证高度。要「有序 + 高效」的标准答案是 `std::map` / `std::set`（红黑树、O(log n)、可范围查询、迭代器稳定）；要「平均更快 + 无序」是 `unordered_map`（kb3 已对比过失效规则）。**面试里的选型问题多半考的是这两者的区别**，不是手写 BST。",
        "中序判定的另一种写法：维护一个 `prev` 指针，检查 `prev->val < cur->val`。注意「严格」还是「允许相等」必须与题目定义一致，否则同一棵树会给出两种答案；带重复值的 BST 通常把相等放右边，但那就不能再用 `x < p->val` 做左移判断。",
        "第 k 小是中序的直接应用：数到中序第 k 个即可。若要多次查询，就给每个节点存「子树大小」，变成 O(h) 的顺序统计树——这也是 `std::map` 提供 `distance` 却要 O(n)、而自定义树能做 O(log n) 名次查询的原因。"
      ],
      summary_en: [
        "The BST property is 'every node in the left subtree is less than the root, which is less than every node in the right subtree'. The word 'every' is the whole difficulty: it constrains an entire subtree, not a single parent-child pair.",
        "The standard counterexample: root 8, left child 3, and 3's right child 10. Every pairwise parent-child comparison passes, yet 10 lives inside 8's left subtree and violates the property. The correct test carries (lo, hi) bounds downward — entering the left child tightens the upper bound, entering the right tightens the lower — or walks in-order and checks strict increase.",
        "The bound types have a trap: int lo = INT_MIN wrongly rejects a node whose value is exactly INT_MIN, since the comparison is strict. When the value domain is int, keep the bounds as long long, or represent minus infinity with a pointer or std::optional. This only surfaces once a test case contains INT_MIN.",
        "Search and insert average O(log n) and worst-case O(n). The three delete cases must be second nature: a leaf just disappears; a node with one child is replaced by that child; a node with two children is overwritten by its in-order successor (leftmost of the right subtree) or predecessor, which is then recursively deleted. The third branch is where people slip.",
        "Inserting 1,2,3,4,5 in order collapses the tree into a list: height becomes n, search becomes O(n) and recursive traversal risks the stack. Balanced trees exist for this. AVL enforces a height difference of at most one at every node — faster lookups, more rotations on writes; red-black trees use the looser black-height rule (no path more than twice another), which costs less per write, and that is why std::map picks red-black.",
        "A BST is not a balanced tree: it promises only sorted in-order output, never logarithmic height. The standard answer to 'ordered and efficient' is std::map / std::set (red-black, O(log n), range queries, stable iterators); 'faster on average, no order' is unordered_map (kb3 compared their invalidation rules). Selection questions in interviews are usually about these two, not about hand-writing a BST.",
        "The other validation form keeps a prev pointer during in-order and checks prev->val < cur->val. Strictness must match the statement, or one tree yields two answers; with duplicates most implementations park equals on the right, which then forbids using 'x < p->val' as the left-descent rule.",
        "The k-th smallest is a direct in-order application: stop at the k-th visit. For repeated queries, store a subtree size in each node and it becomes an order-statistic tree with O(h) selection — which is also why std::map needs O(n) distance while a custom tree can rank in O(log n)."
      ],
      code: `#include <climits>
#include <cstddef>
struct BstNode {
    int val;
    BstNode* left = nullptr;
    BstNode* right = nullptr;
    explicit BstNode(int x) : val(x) {}
};

// 插入：小往左、大往右，走到空位挂上；顺序灌入会退化成链表
BstNode* insert(BstNode* p, int x) {
    if (!p) return new BstNode(x);
    if (x < p->val) p->left = insert(p->left, x);
    else if (x > p->val) p->right = insert(p->right, x);
    return p;                                   // 相等时什么都不做：这是集合语义
}

// 判定必须沿路径传上下界：只比较父子会漏掉「孙子越界」
bool isBst(const BstNode* p, long long lo, long long hi) {
    if (!p) return true;
    if (p->val <= lo || p->val >= hi) return false;
    return isBst(p->left, lo, p->val) && isBst(p->right, p->val, hi);
}

int main() {
    BstNode* root = nullptr;
    for (int x : {5, 3, 8, 1, 4}) root = insert(root, x);
    bool valid = isBst(root, LLONG_MIN, LLONG_MAX);
    // 反例：8 的左子树里挂一个 10，父子两两比较全过，但整棵树不是 BST
    BstNode bad(8);
    bad.left = new BstNode(3);
    bad.left->right = new BstNode(10);
    bool naiveOk = bad.left->val < bad.val && bad.left->right->val > bad.left->val;
    bool strictOk = isBst(&bad, LLONG_MIN, LLONG_MAX);
    delete root->left->left; delete root->left->right; delete root->left;
    delete root->right; delete root;            // 销毁顺序仍然是后序
    delete bad.left->right; delete bad.left;
    return (valid && naiveOk && !strictOk) ? 0 : 1;
}`,
      pit: "判断 BST 只写 `node->left->val < node->val < node->right->val`：这是一道经典的「样例全过、隐藏用例全错」题，因为它对**每个节点**都成立却对**整棵子树**不成立（孙子越界看不出来）。要么传上下界递归，要么中序遍历检查严格递增——写判定题时先把「所有」两个字读出来。",
      pit_en: "Validating a BST with 'node->left->val < node->val < node->right->val' is the classic 'passes the samples, fails the hidden tests' bug: the test holds for every node individually yet the property quantifies over whole subtrees, so an out-of-range grandchild slips through. Carry bounds down, or walk in-order and require strict increase — and read the word 'all' in the definition out loud first.",
      ex: {
        q: "为什么删除「有两个孩子」的节点要用后继或前驱替换，而不是直接把子树挂过去？",
        a: "因为直接挂会破坏二叉搜索结构：左子树里既有比被删节点小的也有比它大的元素，无法整体搬到一侧。用后继（右子树最左，它是右子树里最小的）或前驱替换值，能保证「替换后仍比左子树全部大、比右子树其余部分小」，而那个替换者本身至多只有一个右孩子，落到第二种情况就能安全删除。",
        q_en: "When deleting a two-child node, why replace with the successor or predecessor instead of grafting a subtree over?",
        a_en: "Grafting breaks the search structure: the left subtree holds values both smaller and larger than nothing useful on the right, so it cannot move wholesale to one side. Substituting the successor (the leftmost node of the right subtree, hence its minimum) or the predecessor keeps the invariant — it is still greater than everything on the left and less than the rest on the right — and that substitute has at most a right child, so its own deletion falls into the easy case."
      }
    },

    "tc4": {
      min: 14,
      summary: [
        "堆 = 完全二叉树 + 堆序（大顶堆：父 ≥ 子）。注意它**只**保证父与子的关系：兄弟之间无序，孙子可能比叔侄大。所以堆不是排序，是「随时能拿到一个极值」——想拿全局第二小就得弹出一次才知道。",
        "数组表示是堆的全部效率来源：下标 i（从 0 起）的孩子是 2i+1、2i+2，父亲是 `(i-1)/2`；从 1 起则是 2i、2i+1 与 i/2。因为形状完全确定，孩子在哪永远是**算出来**的，不需要任何指针。",
        "插入 = 放到数组末尾 + **上浮**（while 比父亲小就换）；弹出栈顶 = 把末尾元素填到顶 + **下沉**（每步与「较小的那个孩子」交换）。两个操作都是 O(log n)，因为完全二叉树的高度就是 log n。",
        "下沉的边界比上浮容易错：要先算两个孩子、**在存在的那个里挑更小的**再比较；只有左孩子时不能拿越位的下标去访问数组（`2*i+1 < size` 这个条件必须先判）。写错的表现是「弹出后堆序被破坏」——答案偏了但不崩。",
        "建堆是 **O(n)** 而不是 O(n log n)：从 `n/2` 到 1 逆序调用下沉。总代价 = Σ(高度为 h 的节点数 × h) = Σ ⌊n/2^(h+1)⌋ · h，这个级数收敛到 O(n)。「为什么建堆比逐个插入快」是高频追问，答案是「大部分节点在底层，下沉距离极短」。",
        "堆排序是**原地** O(n log n) 且最坏也是 O(n log n)：建好堆后反复「堆顶与末尾交换、堆规模减一、对新的堆顶下沉」。代价是不稳定、且反向遍历数组对缓存极不友好，常数明显大于快排——所以 `std::sort` 用 introsort（快排为主、递归过深切堆排兜底、小区间插入排序），`std::stable_sort` 用归并。",
        "`std::priority_queue` 默认是**大顶堆**（比较器 `less<T>`，最大在顶）；小顶堆要写全三个模板参数 `priority_queue<int, vector<int>, greater<int>>`。自定义类型给一个比较函数对象，注意它的语义反直觉：`cmp(a,b)` 为真表示「a 比 b 优先级低」。它不支持遍历与修改——改优先级的标准手法是「打标记 + 弹出时忽略」（惰性删除），或整体重建。",
        "Top-K 该选哪个堆：要**最大的 k 个**就维护大小为 k 的**小顶堆**（堆顶是候选里最小的门槛，比它大才挤得进来），复杂度 O(n log k)；k 接近 n 时不如全排序 O(n log n)；数据流/总量未知时堆几乎是唯一可行解；一次性求「第 k 大」用 `std::nth_element`（快排划分的均摊线性版）实测常常最快。记忆口诀：**求最大用小顶堆**。"
      ],
      summary_en: [
        "A heap is a complete binary tree plus the heap order (max-heap: parent >= child). Note that only parent-child is constrained: siblings are unordered, and a grandchild may beat its uncle. A heap is therefore not a sort — it is 'one extreme is always available', and finding the second smallest costs one pop.",
        "The array layout is where the efficiency comes from: with 0-based indices the children of i are 2i+1 and 2i+2 and the parent is (i-1)/2; 1-based gives 2i, 2i+1 and i/2. Because the shape is fully determined, a child's position is always computed, never chased through a pointer.",
        "Push is append-at-the-end plus sift-up (swap with the parent while smaller); pop is move the last element to the top plus sift-down (at each step swap with the smaller child). Both are O(log n) because a complete tree is only log n tall.",
        "Sift-down's bounds are the error-prone half: compute both children, choose the smaller of those that actually exist, then compare — and never index past the end, so test '2*i+1 < size' first. Get it wrong and the heap order quietly breaks after a pop: answers skew, but nothing crashes.",
        "Building a heap is O(n), not O(n log n): call sift-down once for each index from n/2 down to 1. The total is the sum over heights of (nodes at height h) * h = sum floor(n/2^(h+1)) * h, which converges to O(n). The follow-up 'why is that better than n pushes' has one answer: most nodes sit at the bottom and barely move.",
        "Heap sort is in-place, O(n log n) including the worst case: repeatedly swap the top to the end, shrink the heap by one, and sift the new top down. It is unstable and its back-and-forth access pattern is cache-hostile, so its constants clearly exceed quicksort's — which is why std::sort uses introsort (quicksort, switching to heap sort when recursion gets deep, with insertion sort on short ranges) and std::stable_sort uses merge sort.",
        "std::priority_queue defaults to a max-heap (comparator less<T>, largest on top); a min-heap needs all three arguments, priority_queue<int, vector<int>, greater<int>>. For custom types supply a comparator and mind the inverted reading: cmp(a, b) being true means a has lower priority than b. Neither traversal nor mutation is supported, so the standard way to change a priority is a lazy tombstone (mark it, ignore it on pop) or rebuild the queue.",
        "Which heap for Top-K: to keep the k largest, maintain a size-k min-heap whose top is the weakest candidate and let anything larger bump it out, in O(n log k). When k approaches n, full sorting at O(n log n) wins; when the data arrives as a stream of unknown length, a heap is about the only workable choice; and for one-shot 'the k-th largest', std::nth_element (the amortised-linear partition idea) is often fastest in practice. The mnemonic: to find the maximum, use a min-heap."
      ],
      code: `#include <cstddef>
#include <functional>
#include <queue>
#include <vector>
// 手写小顶堆：完全二叉树用数组存，孩子位置是算出来的，不需要指针
class MinHeap {
    std::vector<int> a_;
    void swapWith(std::size_t i, std::size_t j) {
        int t = a_[i]; a_[i] = a_[j]; a_[j] = t;
    }
public:
    bool empty() const { return a_.empty(); }
    std::size_t size() const { return a_.size(); }
    int top() const { return a_.front(); }      // 空堆上调用是未定义行为，先判 empty
    void push(int x) {
        a_.push_back(x);
        std::size_t i = a_.size() - 1;
        while (i > 0) {                          // 上浮：比父亲小就一路换上去
            std::size_t f = (i - 1) / 2;
            if (a_[f] <= a_[i]) break;
            swapWith(f, i);
            i = f;
        }
    }
    void pop() {
        a_.front() = a_.back();                  // 末尾补到顶，堆规模减一
        a_.pop_back();
        std::size_t i = 0;
        while (i < a_.size()) {
            std::size_t l = 2 * i + 1, r = l + 1, m = i;
            if (l < a_.size() && a_[l] < a_[m]) m = l;
            if (r < a_.size() && a_[r] < a_[m]) m = r;   // 只在存在的孩子里挑更小的
            if (m == i) break;
            swapWith(m, i);
            i = m;
        }
    }
};
int main() {
    MinHeap h;
    for (int x : {5, 1, 4, 2}) h.push(x);
    std::vector<int> sorted;
    while (!h.empty()) { sorted.push_back(h.top()); h.pop(); }  // 反复取顶就是堆排序
    std::priority_queue<int> bigTop;                            // 默认大顶堆
    std::priority_queue<int, std::vector<int>, std::greater<int>> smallTop;
    bigTop.push(7); smallTop.push(7);
    return (sorted[0] == 1 && sorted[3] == 5 && bigTop.top() == 7 && smallTop.top() == 7) ? 0 : 1;
}`,
      pit: "把 `priority_queue` 当成「会自动更新的排行榜」：题目要修改某个元素的优先级（Dijkstra 里放松一条边、任务调度里提高某项优先级），却去找「怎么改堆里那个值」。它没有这个接口，硬改底层数组会直接破坏堆序。标准做法是**惰性更新**：把新优先级 push 进去、同时记下当前有效版本，弹出时若与记录不符就丢弃继续弹。",
      pit_en: "Treating priority_queue as a leaderboard that keeps itself current: the problem asks you to change an element's priority (relaxing an edge in Dijkstra, boosting a task) and you go hunting for a way to edit the value inside the heap. There is no such interface, and poking the backing array breaks the heap order outright. The standard move is lazy updating — push the new priority alongside a record of the current valid version, and discard popped entries that no longer match.",
      ex: {
        q: "求「最大的 k 个数」为什么是维护一个大小为 k 的**小顶堆**，而不是大顶堆？",
        a: "因为小顶堆的堆顶是这 k 个候选里最小的那一个，正好当「门槛」：新元素只要比堆顶大，就能踢掉门槛挤进答案集；比它小就直接淘汰，一眼看完。换成大顶堆，堆顶是这 k 个里最大的，新元素来了你无法用 O(1) 判断该淘汰谁，得弹出最大者，语义就反了。",
        q_en: "For the k largest values, why maintain a size-k min-heap rather than a max-heap?",
        a_en: "Because the top of a min-heap is the smallest of the k candidates and serves perfectly as the threshold: anything larger bumps the threshold out and joins the set, anything smaller is rejected with one comparison. In a max-heap the top is the largest of the k, so a newcomer gives you no O(1) way to decide who should leave — you would be evicting the biggest, which is backwards."
      }
    },

    "tc5": {
      title: "综合重构：一棵树的四个问题与三处边界",
      title_en: "Synthesis: Four Questions and Three Edges for One Tree",
      min: 15,
      target:  "能为任意一棵树快速答出「高度、中序、是否 BST、第 k 小」，并说清堆与 BST 在取极值上的取舍与三处必查边界。",
      target_en: "For any tree, answer height, in-order, is-it-a-BST and k-th smallest on demand, and state the heap-versus-BST trade-off for extremes plus the three edges that must always be checked.",
      summary: [
        "本章的四个必答题其实是同一个模板的四次实例：`f(node)` = 终止条件 + 组合 `f(left)` 与 `f(right)`。高度是 `max(l,r)+1`（后序）、节点数是 `l+r+1`、是否 BST 是「左右各自合法 **且** 值域沿路径收紧」（后序 + 参数传递）、第 k 小是中序计数。写熟了就是一个函数换三行。",
        "选型对照：**BST** 给「有序 + 平均 O(log n) + 范围查询 + 第 k 小」，代价是要平衡才有保证；**堆**给「只保证堆顶，插入弹出 O(log n)」，但实现极简、数组存储、建堆 O(n)。要「极值 + 动态增删」选堆，要「有序 + 查询任意区间」选平衡 BST（工程上直接用 `std::map`）。",
        "三处必查边界：① 空树与单节点（所有递归函数都要能在 `nullptr` 上返回正确的中性值：高度 0、节点数 0、BST 为真）；② 值域端点（判定时边界用 `long long` 或用指针，别用 `INT_MIN` 当负无穷）；③ 深度（退化树递归 O(n) 栈，10^5 层必爆，要能改迭代/Morris）。",
        "复盘本章最容易错的六件事：BST 只比父子；层序忘了取 `size()` 快照；前序 + 后序以为能还原；下沉没判「孩子是否存在」；建堆误当 O(n log n)；把 `priority_queue` 当可修改的排行榜。这六条各自对应本段一节课。",
        "复杂度总账（一张口就能报）：遍历 O(n)；BST 查/插平均 O(log n)、最坏 O(n)；堆查极值 O(1)、增删 O(log n)、建堆 O(n)；堆排序 O(n log n) 原地但不稳定；Top-K 用堆 O(n log k) 或用 `nth_element` 均摊 O(n)。",
        "与前面章节的呼应：树是「递归三部曲」最纯粹的练兵场（srec c1），BST 的判定本质是给递归**多加一个参数**（无后效性的另一面，sdp e1），堆排序与归并/快排的取舍回到 la1 与大 O 的常数之争，`priority_queue` 底层则是 dsk 里「按重要度出队」的兑现。",
        "本章达标线（自查）：默写「层序按层分组」与「带上下界的 BST 判定」，并解释「为什么 Top-K 要用小顶堆」。这三句能答上来，本段就过关了。",
        "衔接：下一段 dsg 图与搜索把「最多两个孩子」放开成「任意个邻居」，你立刻会遇到新问题上—— visited 标记与不能再靠父子递归走通；BFS 的最短性（dsk kb2）会正式派上用场。"
      ],
      summary_en: [
        "The chapter's four standing questions are one template used four times: f(node) = base case plus a combination of f(left) and f(right). Height is max(l,r)+1 in post-order, node count is l+r+1, being-a-BST is 'both sides valid and the value range tightened along the path' (post-order plus a parameter), and k-th smallest is in-order with a counter. Practise it and they collapse into one function with three lines changed.",
        "The comparison table: a BST gives order, average O(log n), range queries and k-th smallest, but only with balance; a heap guarantees just the top, at O(log n) per push and pop, with a trivial implementation, array storage and O(n) construction. Need extremes under dynamic insert and delete, take the heap; need ordered access over arbitrary ranges, take a balanced BST, which in practice means std::map.",
        "Three edges to check every time: the empty tree and the single node (every recursive function must return the right neutral value on nullptr — height 0, count 0, BST true); the ends of the value domain (carry bounds as long long or as pointers rather than using INT_MIN as minus infinity); and depth (a degenerated tree means O(n) stack, 10^5 levels will blow, so the iterative or Morris rewrite must be available).",
        "A failure retrospective for this stage, six items: validating a BST by parent-child only; forgetting the level-size snapshot in BFS; assuming pre-order plus post-order reconstructs the tree; sifting down without checking whether a child exists; believing heap construction is O(n log n); and treating priority_queue as a mutable leaderboard. Each one maps back to a specific lesson here.",
        "The complexity ledger, recitable in one breath: traversal O(n); BST search and insert average O(log n), worst O(n); heap peek O(1), push and pop O(log n), build O(n); heap sort O(n log n) in place but unstable; Top-K O(n log k) with a heap, or amortised O(n) with nth_element.",
        "Echoes of earlier chapters: trees are the purest gym for the three-part recursion (srec c1); BST validation is really 'pass one more parameter down', the other face of the Markov property (sdp e1); heap sort versus merge and quicksort returns to la1 and the constants that big-O discards; and priority_queue is the payoff of dsk's 'dequeue by importance'.",
        "Bar for this chapter (self-check): write the grouped level-order traversal and the bounds-carrying BST validator from memory, and explain why Top-K uses a min-heap. Those three answers close the stage.",
        "Bridge: dsg graphs and search loosen 'at most two children' into 'however many neighbours you like', and two new problems appear at once — you now need a visited set, and parent-child recursion no longer suffices. The shortest-path property of BFS from dsk kb2 finally earns its keep."
      ],
      code: `#include <climits>
#include <cstddef>
#include <queue>
struct TreeNode {
    int val;
    TreeNode* left = nullptr;
    TreeNode* right = nullptr;
    explicit TreeNode(int x) : val(x) {}
};
// 判定：上下界沿路径收紧，只比较父子会漏掉「孙子越界」
bool isBst(const TreeNode* p, long long lo, long long hi) {
    if (!p) return true;                        // 空树既是 BST，也是递归终点
    if (p->val <= lo || p->val >= hi) return false;
    return isBst(p->left, lo, p->val) && isBst(p->right, p->val, hi);
}
// 高度：典型的后序用法——先拿到两个孩子的答案，才能算自己的
int depthOf(const TreeNode* p) {
    if (!p) return 0;
    int l = depthOf(p->left), r = depthOf(p->right);
    return (l > r ? l : r) + 1;
}
int main() {
    TreeNode n[5] = {TreeNode(8), TreeNode(3), TreeNode(9), TreeNode(1), TreeNode(10)};
    n[0].left = &n[1]; n[0].right = &n[2];
    n[1].left = &n[3]; n[1].right = &n[4];      // 10 挂在 3 的右边，却比根 8 大：越界
    bool naiveOk = n[1].val < n[0].val && n[2].val > n[0].val && n[4].val > n[1].val;
    bool strictOk = isBst(&n[0], LLONG_MIN, LLONG_MAX);
    std::queue<const TreeNode*> q;
    q.push(&n[0]);
    int levels = 0;
    while (!q.empty()) {
        std::size_t wide = q.size();            // 每轮先取快照，才知道本层有几个
        for (std::size_t i = 0; i < wide; ++i) {
            const TreeNode* p = q.front(); q.pop();
            if (p->left) q.push(p->left);
            if (p->right) q.push(p->right);
        }
        ++levels;
    }
    // 自查结论：naiveOk 为真而 strictOk 为假，正是「只比父子」的经典漏判
    return (naiveOk && !strictOk && levels == 3 && depthOf(&n[0]) == 3) ? 0 : 1;
}`,
      pit: "所有树的题目都默认它平衡：递归求深度、求路径、转中序，代码在 10^5 个节点的偏斜树（顺序插入的 BST、一条链表状的树）上直接爆栈。写递归之前先问「输入能不能退化成链」；不能保证就把递归换成迭代，或在读入时打乱顺序。",
      pit_en: "Assuming the tree is balanced: recursive depth, path and in-order code falls over on a 10^5-node skewed tree (a BST fed sorted data, or a tree that is really a list). Before writing the recursion ask whether the input can degenerate into a chain; if nothing rules that out, go iterative, or shuffle the insertion order.",
      ex: {
        q: "同一棵树上「求最小的 k 个数」，堆和排序哪个更该用？",
        a: "一次性给全所有数据、k 又不算小，直接 `sort` 或 `nth_element` 更简单也更快（`nth_element` 均摊 O(n)）；只有当数据是**流式到达**、或者 k 远小于 n 需要边来边维护答案时，大小为 k 的大顶堆才划算（O(n log k) 且只用 k 格内存）。",
        q_en: "For the k smallest values in one tree, should you use a heap or a sort?",
        a_en: "If you already hold every value and k is not tiny, just sort or call nth_element — simpler and faster, since nth_element is amortised O(n). A size-k max-heap earns its keep only when the data streams in, or when k is far below n and you must maintain the answer incrementally in O(n log k) using k cells."
      }
    }
  },

  /* ---------- 题库：对准深化新增的知识点，每章 4 题（选择 / 判断 / 填空混排） ---------- */
  quizAdd: {
    dsl: [
      {
        q: "`std::vector::push_back` 在容量不足时要搬移全部元素，为什么还说它均摊 O(1)？",
        o: ["因为搬移其实很便宜，可以忽略", "因为容量按倍增长，n 次插入的总搬移量是几何级数 O(n)，除以 n 即均摊 O(1)", "因为标准库保证不搬移", "因为 move 语义让搬移变成 O(1)"],
        a: 1,
        why: "关键在于倍增：第 k 次扩容搬 2^k 个元素，总量 1+2+4+…+n = O(n)。若每次只加一格，总量就是 1+2+…+n = O(n²)，均摊退化为 O(n)。",
        q_en: "push_back moves every element when capacity runs out, so why is it still called amortised O(1)?",
        o_en: ["Because moving is cheap and can be ignored", "Because capacity doubles, so n insertions move a geometric total of O(n) elements, i.e. O(1) each", "Because the standard library promises never to move", "Because move semantics make the transfer O(1)"],
        why_en: "Doubling is the mechanism: the k-th regrowth moves 2^k elements, so the total is the geometric sum 1+2+4+...+n = O(n). Grow by one slot instead and the total becomes O(n2), leaving O(n) per insertion."
      },
      {
        q: "判断：链表插入删除是 O(1)，所以在链表第 k 个位置插入的总代价是 O(1)。",
        type: "judge", a: 1,
        why: "O(1) 只指「已经握有前驱指针」之后的改指针动作；要到达第 k 个位置必须从头走 O(k) 步。链表省的是搬移，不是查找。",
        q_en: "True or false: because list insert and delete are O(1), inserting at position k of a list costs O(1).",
        why_en: "False. The O(1) covers only the pointer rewrite once you already hold the predecessor; reaching position k walks O(k) nodes from the head. A list saves the shifting, not the searching."
      },
      {
        q: "三指针反转链表的循环结束后，函数应返回 ______（填指针变量名）。",
        type: "fill", ans: ["prev", "pre", "previous"],
        why: "循环不变式是「prev 指向已反转部分的头」，结束时 cur 恰好为 nullptr，新头就是 prev；返回 cur 会交出空指针，整条链看起来消失了。",
        q_en: "After the three-pointer reversal loop finishes, the function should return ______ (name the pointer variable).",
        why_en: "The loop invariant says prev points at the head of the reversed part, and at exit cur is exactly nullptr; returning cur hands back an empty list."
      },
      {
        q: "`std::list::sort` 为什么用归并排序而不是更快的快排？",
        o: ["因为链表节点不能存 int", "因为链表没有随机访问，快排的原地划分拿不到常数收益，而链表合并不需辅助数组", "因为快排不稳定，而 sort 必须稳定", "因为归并排序的时间复杂度更低"],
        a: 1,
        why: "快排的优势来自下标随机访问带来的原地划分与缓存友好，链表两点都不具备；链表的「找中点 + 递归 + 合并」正好省掉辅助数组，所以是 O(n log n) 时间、O(log n) 栈。",
        q_en: "Why does std::list::sort use merge sort rather than the usually faster quicksort?",
        o_en: ["Because list nodes cannot hold ints", "Because a list has no random access, so quicksort's in-place partition gains nothing while list merging needs no scratch array", "Because quicksort is unstable and sort must be stable", "Because merge sort has a lower time complexity"],
        why_en: "Quicksort wins through indexed in-place partitioning and cache friendliness, neither of which a list offers. Splitting at the midpoint and merging suits lists exactly because merging needs no extra array: O(n log n) time with O(log n) stack."
      }
    ],
    dsk: [
      {
        q: "`unordered_map` 触发 rehash 之后，下列哪一项仍然有效？",
        o: ["所有迭代器", "元素对应的引用与指针", "容器的遍历顺序", "bucket 数量"],
        a: 1,
        why: "rehash 换掉的是桶数组，拉链法的节点本身不搬家，所以引用与指针继续有效；迭代器指向旧的桶数组，全部失效；遍历顺序也会重排。",
        q_en: "After an unordered_map rehashes, which of the following is still valid?",
        o_en: ["All iterators", "References and pointers to the elements", "The iteration order", "The bucket count"],
        why_en: "A rehash replaces the bucket array while the chained nodes themselves never relocate, so references and pointers stay valid; iterators pointed into the old array and are all invalidated, and the iteration order changes too."
      },
      {
        q: "判断：`std::queue` 支持用范围 for 遍历其中的元素。",
        type: "judge", a: 1,
        why: "queue 是容器适配器，刻意只暴露 push/pop/front/back/empty/size，不提供迭代器；这是接口收缩，逼你遵守「只能看队头」。要看全部内容就用 std::deque 或自己维护一个影子容器。",
        q_en: "True or false: std::queue can be walked with a range-based for loop.",
        why_en: "False. queue is a container adaptor that exposes only push, pop, front, back, empty and size — no iterators. That shrinkage is deliberate, enforcing 'only the front is visible'; use std::deque, or keep a shadow container, when you must see everything."
      },
      {
        q: "哈希表的负载因子等于元素总数除以 ______。",
        type: "fill", ans: ["桶数", "桶的个数", "桶数量", "bucket count", "buckets"],
        why: "负载因子衡量「平均每个桶挂了多少元素」，它一旦超过上限就要扩容 rehash；它决定冲突概率，是哈希表性能的第一变量。",
        q_en: "The load factor of a hash table is the element count divided by ______.",
        why_en: "It measures how many elements sit in an average bucket; once it passes the threshold the table grows and rehashes. It drives collision probability, making it the primary performance variable of a hash table."
      },
      {
        q: "求「每个元素右边第一个更大的元素」，正确的做法与复杂度是？",
        o: ["双重循环逐一比较，O(n²)", "单调栈，每个元素进出栈各一次，O(n)", "排序后二分，O(n log n)", "优先队列逐个弹出，O(n log n)"],
        a: 1,
        why: "维护一个递减栈，遇到更大的元素就把比它小的全部弹出并写下答案；分析时要看「元素被处理的总次数」（2n 次栈操作），而不是循环嵌套了几层。",
        q_en: "For 'the first greater element to the right of each element', which approach and complexity are correct?",
        o_en: ["Nested loops comparing pairs, O(n2)", "A monotone stack where each element is pushed and popped once, O(n)", "Sort then binary search, O(n log n)", "A priority queue popped one by one, O(n log n)"],
        why_en: "Keep a decreasing stack; when a larger value arrives, pop everything smaller and record the current value as their answer. Count total element processing (about 2n stack operations), not how many loops are nested."
      }
    ],
    dst: [
      {
        q: "判断一棵树是不是二叉搜索树，正确的做法是？",
        o: ["递归检查每个节点满足「左孩子 < 自己 < 右孩子」", "自顶向下传上下界，或中序遍历检查严格递增", "只要根大于左子树根、小于右子树根即可", "检查前序序列是否有序"],
        a: 1,
        why: "BST 的性质是「整棵子树」的约束，只比父子会漏掉孙子越界（根 8、左 3、3 的右孩子 10 就是反例）；传上下界或中序严格递增才能覆盖全部约束。",
        q_en: "What is the correct way to test whether a tree is a binary search tree?",
        o_en: ["Recursively check left child < node < right child for every node", "Carry (lo, hi) bounds downward, or check that the in-order walk strictly increases", "It suffices that the root beats its left child and loses to its right child", "Check that the pre-order sequence is sorted"],
        why_en: "The BST property quantifies over whole subtrees, so parent-child tests miss an out-of-range grandchild (root 8, left 3, and 3's right child 10 is the counterexample). Bounds carried downward, or a strictly increasing in-order walk, cover every constraint."
      },
      {
        q: "判断：把 n 个元素逐个 push 建堆是 O(n log n)，所以「建堆」这件事本身没有更快的办法。",
        type: "judge", a: 1,
        why: "从 n/2 到 1 逆序做一次下沉即可建堆，总代价是 Σ⌊n/2^(h+1)⌋·h = O(n)，因为绝大多数节点在底层、下沉距离极短。这就是建堆比逐个插入快的原因。",
        q_en: "True or false: building a heap from n elements costs O(n log n) with no faster method.",
        why_en: "False. Calling sift-down once for each index from n/2 down to 1 builds the heap at a total cost of sum floor(n/2^(h+1))*h = O(n), because most nodes sit at the bottom and barely move."
      },
      {
        q: "用数组存储完全二叉树（下标从 1 开始）时，节点 i 的左孩子下标是 ______。",
        type: "fill", ans: ["2i", "2*i", "2×i", "2i + 0"],
        why: "父亲 i 的孩子是 2i 与 2i+1、父亲是 i/2；这套下标关系就是堆与线段树能省掉所有指针、并保证高度只有 log n 的原因。",
        q_en: "In an array representation of a complete binary tree (1-based indices), the left child of node i is at index ______.",
        why_en: "Node i has children 2i and 2i+1 and parent i/2; this index relation is exactly why heaps and segment trees need no pointers and are guaranteed log n tall."
      },
      {
        q: "从 n 个数里取「最大的 k 个」（k 远小于 n，数据流式到达），应选？",
        o: ["大小为 k 的大顶堆", "大小为 k 的小顶堆", "直接全排序再取前 k 个", "普通队列先进先出"],
        a: 1,
        why: "小顶堆的堆顶是 k 个候选里最小的，正好当门槛：新元素比它大就踢掉堆顶入堆，否则直接淘汰，复杂度 O(n log k) 且只用 k 格内存。全排序需要留存全部数据，流式场景做不到。",
        q_en: "To take the k largest of n values, with k far below n and the data arriving as a stream, what should you use?",
        o_en: ["A size-k max-heap", "A size-k min-heap", "Sort everything, then take the first k", "An ordinary FIFO queue"],
        why_en: "A min-heap's top is the weakest of the k candidates and works as a threshold: a newcomer larger than it bumps the top out, otherwise it is discarded — O(n log k) time in k cells. Full sorting would have to retain the entire stream."
      }
    ]
  },

  /* ---------- 词典：分类统一「C++ 系统深入」，与既有名词查重 ---------- */
  terms: [
    { term: "均摊分析", term_en: "Amortized Analysis", cat: "C++ 系统深入",
      short: "把一次昂贵操作的分摊到一串廉价操作上，求「平均每步多少代价」。",
      short_en: "Spreads one expensive operation over a run of cheap ones to get a per-step cost.",
      detail: ["三种方法：聚合分析（总量除以 n）、会计法（预付费与信用）、势能法（把储蓄写成状态函数）。", "vector 倍增扩容、哈希表 rehash、并查集路径压缩都是靠它才成立的性能承诺。"],
      detail_en: ["Three methods: aggregate analysis (total divided by n), the accounting method (prepayment and credit), and the potential method (savings expressed as a state function).", "Doubling growth in vectors, rehashing in hash tables and path compression in union-find all rest on promises this analysis provides."],
      vs: "均摊是对一串操作的平均，最坏界是对单次操作；两者回答的问题不同。",
      vs_en: "Amortisation averages over a sequence of operations; a worst-case bound speaks of one operation. They answer different questions." },
    { term: "哨兵节点", term_en: "Sentinel Node", cat: "C++ 系统深入",
      short: "在链表头前放一个不存数据的节点，让头部操作与普通位置同构。",
      short_en: "A valueless node placed before the head so head operations match all others.",
      detail: ["它消灭了「插入/删除第一个节点」的全部特判，也统一了反转与合并的返回口径。", "首选栈上对象并在结束时返回它的 next；用 new 造就要在每条早退分支上释放。"],
      detail_en: ["It removes every special case for inserting or deleting the first node, and unifies the return convention for reversal and merging.", "Prefer a stack object and return its next at the end; a heap-allocated sentinel must be freed on every early exit."],
      vs: "哨兵是「多放一个假节点换掉特判」，边界检查是「少写结构、多写 if」。",
      vs_en: "A sentinel buys away the special cases with one fake node; boundary checks pay for it with extra ifs." },
    { term: "快慢指针", term_en: "Fast and Slow Pointers", cat: "C++ 系统深入",
      short: "两个指针以不同速度前进，用步数差替代随机访问能力。",
      short_en: "Two pointers at different speeds, substituting a step offset for random access.",
      detail: ["三件套：找中点（二倍速）、判环（相遇即有环）、倒数第 k（先走 k 步再同步）。", "判空必须成对写 while (fast && fast->next)，否则偶数长度时解引用空指针。"],
      detail_en: ["Three uses: midpoint (double speed), cycle detection (meeting implies a cycle), k-from-end (advance k, then move together).", "The guard must be the pair 'while (fast && fast->next)', or an even length dereferences null."],
      vs: "快慢指针解决「不能回看」，对撞指针要求「已经有序」。",
      vs_en: "Fast/slow pointers cope with no look-back; opposing pointers require sortedness." },
    { term: "释放后使用", term_en: "Use After Free", cat: "C++ 系统深入",
      short: "delete 之后仍通过旧指针读写该内存，属于未定义行为。",
      short_en: "Reading or writing freed memory through a stale pointer — undefined behaviour.",
      detail: ["链表销毁与「先 delete 再取 next」是它的两个高发场景，小样本常常看起来正常。", "防护手段：销毁循环先存 next；或改用 std::unique_ptr 让所有权与生命周期同步。"],
      detail_en: ["Freeing a list, and reading next after deleting the node, are its two common sources; small inputs usually look fine.", "Guards: store next before deleting, or hand ownership to std::unique_ptr so lifetime follows scope."],
      vs: "悬空引用是「指向的对象已不在」，释放后使用是「已经不在的内存上又做一次动作」。",
      vs_en: "A dangling reference names something that no longer exists; use-after-free performs an action on memory that no longer belongs to you." },
    { term: "滑动窗口", term_en: "Sliding Window", cat: "C++ 系统深入",
      short: "用左右两个只前进的下标维护一段连续区间，把嵌套枚举降到 O(n)。",
      short_en: "Two forward-only indices bracket a contiguous range, cutting nested enumeration to O(n).",
      detail: ["成立前提是单调性：左端右移不会让非法窗口重新合法，所以左指针永不回退。", "数组里出现负数时窗口和失去单调性，要换成前缀和加哈希表统计。"],
      detail_en: ["It needs monotonicity: moving the left edge rightwards must never make an illegal window legal again, so it never retreats.", "With negative numbers the sum loses monotonicity, and prefix sums plus a hash table take over."],
      vs: "双指针求「一对」元素，滑动窗口求「一段」区间。",
      vs_en: "Two pointers find a pair; a sliding window finds a span." },

    { term: "单调栈", term_en: "Monotonic Stack", cat: "C++ 系统深入",
      short: "栈内始终保持单调，被弹出的元素的答案就是把它弹出的那个元素。",
      short_en: "The stack stays ordered; the element that pops another one is that element's answer.",
      detail: ["专治下一个更大/更小、柱状图最大矩形、接雨水；每个元素进出各一次所以是 O(n)。", "弹出条件写 < 还是 <= 决定重复元素归到哪一侧，也决定「严格」还是「非严格」。"],
      detail_en: ["It handles next-greater or smaller, largest rectangle in a histogram and trapping rain water; each element enters and leaves once, hence O(n).", "Whether the pop test is < or <= decides which side duplicates fall to, and hence strict versus non-strict."],
      vs: "普通栈管「后进先出的顺序」，单调栈额外维持「栈内有序」这个不变量。",
      vs_en: "A plain stack manages last-out order; a monotone stack additionally maintains order inside the stack." },
    { term: "循环队列", term_en: "Circular Queue", cat: "C++ 系统深入",
      short: "用取模让数组首尾相接，出队的空间立刻复用，全程不搬元素。",
      short_en: "Modulo arithmetic joins the array's ends so freed slots are reused with no shifting.",
      detail: ["判空与判满在 front == rear 时无法区分，要么牺牲一格，要么额外记元素个数。", "工程上记 count 更好：两个判断都是 O(1)，还顺手给出当前长度。"],
      detail_en: ["front == rear is ambiguous between empty and full, so either sacrifice one slot or keep an element count.", "The counter is the better engineering choice: both tests stay O(1) and you get the current length for free."],
      vs: "循环队列保证 FIFO 且两端 O(1)，优先队列按重要度出队且要 O(log n)。",
      vs_en: "A circular queue keeps FIFO with O(1) at both ends; a priority queue departs by importance at O(log n) each." },
    { term: "负载因子", term_en: "Load Factor", cat: "C++ 系统深入",
      short: "元素数除以桶数，衡量哈希表平均每桶挂了多少元素。",
      short_en: "Elements divided by buckets: how many entries an average bucket carries.",
      detail: ["std::unordered_map 默认上限是 1.0，超过就 rehash；开放寻址则必须远低于 1。", "批量插入前先 reserve(n)，可以省掉一路 rehash 的重复搬移，常有两三倍收益。"],
      detail_en: ["std::unordered_map allows 1.0 by default and rehashes above it; open addressing must stay far below 1.", "Calling reserve(n) before a bulk insert avoids a chain of rehashes, often buying two- or three-fold speedup."],
      vs: "负载因子管「平均多挤」，哈希函数质量管「分布是否均匀」，两者共同决定冲突。",
      vs_en: "The load factor measures crowding on average; hash quality measures uniformity. Both decide collisions." },
    { term: "拉链法", term_en: "Separate Chaining", cat: "C++ 系统深入",
      short: "每个桶挂一条链表，冲突的元素各自挂到同一个桶里。",
      short_en: "Each bucket owns a list, and colliding keys simply hang from the same bucket.",
      detail: ["实现直白、删除干净、负载因子可以接近甚至超过 1；标准库多数实现就是它。", "副作用是 rehash 后迭代器失效但引用与指针仍有效，因为节点没搬家。"],
      detail_en: ["It is easy to implement, deletes cleanly and tolerates a load factor around or past 1, which is why most standard libraries use it.", "Its side effect is that a rehash invalidates iterators yet leaves references and pointers valid, since nodes never move."],
      vs: "开放寻址把冲突元素塞进本表的空位，缓存友好但删除要留墓碑。",
      vs_en: "Open addressing probes this table for a free slot, which caches better but needs tombstones to delete." },
    { term: "墓碑", term_en: "Tombstone", cat: "C++ 系统深入",
      short: "开放寻址里删除时留下的占位标记，表示「这里曾有元素」。",
      short_en: "The marker left by a deletion in open addressing: 'something was here'.",
      detail: ["不能真删：那会切断后续元素的探测链，让本来在位的键查不到。", "墓碑攒多了会让查找越来越慢，所以要统计数量并定期真正清理或重建。"],
      detail_en: ["Physically removing the slot would sever the probe chain and make live keys undiscoverable.", "Accumulated tombstones slow lookups, so the count must be tracked and cleaned up or rebuilt periodically."],
      vs: "惰性删除在哈希表里是墓碑，在优先队列里是「版本标记 + 弹出时忽略」。",
      vs_en: "Lazy deletion means tombstones in a hash table and version tags ignored at pop-time in a priority queue." },

    { term: "层序遍历", term_en: "Level-order Traversal", cat: "C++ 系统深入",
      short: "用队列按层访问；每轮开始时记下队列长度就是本层宽度。",
      short_en: "A queue visits level by level; the size snapshot at each round's start is that level's width.",
      detail: ["它是 BFS 在树上的样子，也是「最短步数 / 每层最大 / 右视图」这类题的共同模板。", "忘了取 size 快照会把下一层混进本层——不崩，只是答案错，是最难发现的一类。"],
      detail_en: ["It is BFS specialised to trees and the shared template for minimum depth, per-level maximum and right-side view.", "Skipping the size snapshot leaks the next level into this one: nothing crashes, only the answer is wrong, which is the hardest kind to notice."],
      vs: "深度优先用栈或递归（前中后序），广度优先用队列（层序）。",
      vs_en: "Depth first uses a stack or recursion (pre/in/post-order); breadth first uses a queue (level order)." },
    { term: "堆序性质", term_en: "Heap Property", cat: "C++ 系统深入",
      short: "父节点始终不优于（或不劣于）子节点，仅此而已。",
      short_en: "A parent is never worse than its children — and nothing more is promised.",
      detail: ["它只约束父与子：兄弟无序、孙子可以胜过叔叔，所以堆不是排序，只能 O(1) 拿一个极值。", "配合「完全二叉树」的形状约束，堆才能用数组存并保证高度 log n。"],
      detail_en: ["Only parent and child are related: siblings are unordered and a grandchild may beat an uncle, so a heap is not a sort and offers only one extreme in O(1).", "Combined with the complete-tree shape constraint, this is what allows array storage and a guaranteed logarithmic height."],
      vs: "堆序是「父强于子」，BST 性质是「左小右大且对整棵子树成立」。",
      vs_en: "The heap order says parents beat children; the BST property says left subtree, node, right subtree are ordered and it applies to whole subtrees." },
    { term: "下沉与上浮", term_en: "Sift Down and Sift Up", cat: "C++ 系统深入",
      short: "堆维持形状的两个动作：插入后上浮，弹出后让补位的元素下沉。",
      short_en: "The two moves that keep a heap valid: sift up after an insert, sift down the replacement after a pop.",
      detail: ["下沉要「在存在的孩子里挑更小的」再比较，忘了判下标越界是最典型的错误。", "从 n/2 逆序做一遍下沉就是建堆，总代价 O(n)。"],
      detail_en: ["Sift-down must choose the smaller child among those that exist before comparing; forgetting the index bound is its classic fault.", "Running sift-down once for each index from n/2 downwards builds the heap in O(n) total."],
      vs: "上浮从叶子往根走、路径唯一；下沉从根往叶子走、每步要选孩子。",
      vs_en: "Sift-up walks leaf to root along one path; sift-down walks root to leaf choosing a child at each step." },
    { term: "原地堆排序", term_en: "In-place Heap Sort", cat: "C++ 系统深入",
      short: "反复把堆顶与末尾交换、堆规模减一并下沉，用 O(1) 额外空间排序。",
      short_en: "Repeatedly swap the top to the end, shrink the heap and sift down, sorting in O(1) extra space.",
      detail: ["它的最坏情况也是 O(n log n)，所以 introsort 在快排递归过深时切到它兜底。", "代价是不稳定，而且来回跳跃的访问模式对缓存极不友好，常数明显大于快排。"],
      detail_en: ["Its worst case is also O(n log n), which is why introsort switches to it when quicksort recurses too deeply.", "It pays with instability and a jumping access pattern that caches badly, so its constants clearly exceed quicksort's."],
      vs: "堆排原地但常数大，归并稳定但要 O(n) 辅助数组，快排平均最快但最坏 O(n²)。",
      vs_en: "Heap sort is in-place with big constants; merge sort is stable but needs O(n) scratch; quicksort is fastest on average but O(n2) at worst." },
    { term: "第 k 小", term_en: "K-th Smallest", cat: "C++ 系统深入",
      short: "在 BST 上就是中序第 k 个；无序数据上用 nth_element 或堆。",
      short_en: "In a BST it is the k-th in-order visit; on unordered data use nth_element or a heap.",
      detail: ["给每个节点存子树大小，就能把名次查询降到 O(h)，这叫顺序统计树。", "一次性求第 k 大用 std::nth_element（快排划分，均摊 O(n)）常比堆更快；流式或要维护前 k 个才用堆。"],
      detail_en: ["Storing subtree sizes in each node turns rank queries into O(h), which is an order-statistic tree.", "For a one-shot k-th largest, std::nth_element (partition-based, amortised O(n)) usually beats a heap; reach for the heap with streams or when the k best must be maintained."],
      vs: "「第 k 小」只要一个值，「最大的 k 个」要一组值，两者的最优解不同。",
      vs_en: "The k-th smallest needs one value while the k largest need a set of them, and their optimal tools differ." }
  ],

  achievements: [
    { id: "list_ninja", icon: "🔗", name: "链表忍者", name_en: "List Ninja",
      desc: "完成 dsl · 复杂度与链表 全部课节", desc_en: "Finish every lesson of dsl Complexity & Linked Lists",
      check: ["dsl"] },
    { id: "order_chooser", icon: "🫧", name: "结构选型师", name_en: "Structure Chooser",
      desc: "完成 dsk 与 dst 全部课节", desc_en: "Finish every lesson of dsk and dst",
      check: ["dsk", "dst"] }
  ],

  codeComments: {
    "统计真实搬移次数，用来验证均摊结论": "count the real moves, to check the amortised claim",
    "容量按倍增长：10 万次插入的总搬移只有 2 万次量级，所以均摊 O(1)": "capacity doubles, so 100k insertions move only about 200k elements in total: O(1) amortised",
    "预先给足：一次分配，零搬移": "reserve up front: one allocation, zero moves",
    "减半循环：层数是一，执行次数却是 log n，别用「数循环层数」的老习惯": "a halving loop is one level deep yet runs log n times — do not count loop nestings",
    "在 prev 之后插入 cur：先接新边再断旧边，写反就丢链": "insert cur after prev: attach the new edge before cutting the old one, or the tail is lost",
    "哨兵节点：不存数据，头部操作不再需要特判": "sentinel node: holds no data, so head operations need no special case",
    "删除值为 3 的节点：单链表只能从前一个节点动手": "delete the node holding 3: a singly linked list can only act from the predecessor",
    "销毁：必须先存 next 再 delete": "destroy: store next before deleting",
    "摘完要把哨兵的箭头也清掉，否则它是悬空的": "after emptying it, clear the sentinel's arrow too, or it dangles",
    "三指针反转：每轮把当前节点的箭头掰向已反转好的那一段": "three-pointer reversal: each round bends the current arrow towards the reversed part",
    "先存住断链之后就会丢掉的那一半": "save the half that is about to be cut off",
    "返回 prev：此刻 cur 已经是空指针": "return prev: cur is null at this point",
    "哨兵让「第一个接谁」也不用特判": "the sentinel also removes the 'what is the first node' special case",
    "每接一个就清掉它的箭头，防止提前成环": "clear each appended node's arrow to avoid forming a cycle early",
    "剩下那段本来有序，整段挂上即可": "the remainder is already sorted, so hang it on wholesale",
    "x 变成尾节点，它的 next 已经是空": "x is now the tail and its next is null",
    "判环：快走两步慢走一步；判空必须同时判 fast 与 fast->next": "cycle test: fast takes two steps, slow one, and the guard must check both fast and fast->next",
    "无重复字符的最长子串：左端只前进不回退，所以整体是 O(n)": "longest substring without repeats: the left edge only advances, so the whole scan is O(n)",
    "重复落在窗口内才收缩左端": "contract the left edge only when the repeat is inside the window",
    "人为造一个环，测完要还原": "build a cycle by hand, and undo it after the test",
    "哨兵：头插与头删都不用特判": "sentinel: head insert and head delete need no special case",
    "找中点：快走两步慢走一步": "find the midpoint: fast takes two steps, slow one",
    "断成两段：前驱要同步切断": "split into two lists: cut the predecessor's link as well",
    "反转后半段": "reverse the second half",
    "走到前半段的尾部": "walk to the end of the first half",
    "prev 是后半段的头，接回去": "prev is the head of the reversed half, so rejoin it",
    "长度守恒，仍是 6": "length is preserved: still 6",
    "自查三件事：长度不变、没有节点指回自己、哨兵的 next 与尾指针都有效": "three self-checks: length unchanged, no node points at itself, and both the sentinel's next and the tail pointer are valid",
    "释放统一放最后：先存 next 再 delete": "free everything at the end: store next, then delete",
    "括号匹配：右括号来了，先判空再取栈顶": "bracket matching: on a closer, test emptiness before reading the top",
    "还剩左括号说明没有配完": "left-over openers mean something never closed",
    "单调栈：每个元素右边第一个更大的下标，进出栈各一次所以是 O(n)": "monotone stack: first greater index to the right of each element; one push and one pop each, hence O(n)",
    "栈里存下标而不是值，才能算出距离": "store indices, not values, so distances can be computed",
    "交叉嵌套不合法": "crossed nesting is invalid",
    "0：2 右边第一个更大的是 3": "0: the first value greater than 2 on its right is 3",
    "记 count_，而不是牺牲一格来区分空与满": "keep a count instead of sacrificing a slot to separate empty from full",
    "满了要失败，不能悄悄覆盖队头": "a full queue must refuse, never silently overwrite the front",
    "取模复用数组尾部腾出的格子": "modulo reuses the cells freed at the array's end",
    "只动下标，不搬元素": "only the indices move, no elements are shifted",
    "队满：入队被拒": "queue full: the enqueue is rejected",
    "取出 1，头部空格立刻可复用": "pop 1; the freed head cell is reusable at once",
    "两个字段都要参与混合，只哈希 x 会让整条竖线落进同一个桶": "mix both fields; hashing only x drops an entire vertical line into one bucket",
    "相等判断必须与哈希配套": "equality must match the hash",
    "只想查一下：operator[] 却把 b 插成了 0": "just looking it up: operator[] instead inserted b with value 0",
    "2：凭空多出来的键，统计已经不可信": "2: a key appeared out of nowhere, so the tally is no longer trustworthy",
    "count 只读，不会写入": "count is read-only and inserts nothing",
    "还是 2": "still 2",
    "已知规模就先要够桶数，省掉一路 rehash": "when the size is known, take enough buckets up front and skip the rehash chain",
    "FNV-1a 的初始值": "the FNV-1a offset basis",
    "无符号溢出回绕正是设计的一部分": "unsigned wrap-around is part of the design",
    "每个节点都按「新桶数」重新定位，整块拷贝必然全部错位": "relocate every node against the new bucket count; a wholesale copy misplaces all of them",
    "查不到不写入，这才叫只读语义": "a miss writes nothing — that is what read-only means",
    "三次 rehash 之后仍然找得回来": "still findable after three rehashes",
    "双栈求值：操作数与运算符各一栈，优先级与左结合全在这张表里": "two-stack evaluation: operands in one, operators in the other, with precedence and left-associativity in this table",
    "后弹出的是右操作数": "the value popped second is the right operand",
    "丢掉左括号，它自己不参与计算": "discard the left parenthesis; it takes no part in the arithmetic",
    "栈顶优先级不低于我就先算掉": "compute first while the stack top has at least my precedence",
    "括号去掉一层就要多写一遍弹栈逻辑：这就是「先转后缀再求值」存在的理由": "each layer of parentheses means another pop routine — the reason convert-to-postfix exists",
    "就地初始化：未初始化的孩子指针是段错误的入口": "in-class initialisation: uninitialised child pointers are a gateway to segfaults",
    "完全二叉树的父子关系只靠下标，这就是堆能用数组存的原因": "in a complete tree, indices alone express parent and child, which is why a heap fits in an array",
    "下标 0 空出来，公式才刚好成立": "leave index 0 empty so the formulas line up",
    "3：不用任何指针就能回溯": "3: walk back up without a single pointer",
    "计数自查：叶子数 = 度为 2 的节点数 + 1；n 个节点有 n+1 个空指针": "counting check: leaves equal degree-2 nodes plus one, and n nodes leave n+1 null pointers",
    "销毁顺序：先孩子后自己": "destruction order: children before the node itself",
    "递归三部曲：第一行永远是判空，然后把「处理根」放到需要的位置上": "the three-part recursion: the null test is always first, then place the root action wherever it belongs",
    "漏掉这一行就是无限递归段错误": "omit this line and the recursion runs off into a segfault",
    "根在前：复制树、序列化、自上而下传参": "root first: copying a tree, serialising it, passing information downward",
    "根在中：在 BST 上得到升序": "root in the middle: sorted output on a BST",
    "层序：每轮开始时的 size() 就是本层宽度，「按层分组」全靠这一句": "level order: size() at the start of each round is that level's width, and grouping by level depends entirely on it",
    "先取快照，否则会把下一层算进本层": "snapshot first, or the next level leaks into this one",
    "前序第一个是根，中序第一个是最左节点，层序第一层只有一个": "pre-order starts at the root, in-order at the leftmost node, and level one has a single node",
    "只有两层，手工删就够；深树要按后序删": "two levels deep, so manual deletes suffice; a deep tree needs post-order freeing",
    "插入：小往左、大往右，走到空位挂上；顺序灌入会退化成链表": "insert: smaller left, larger right, hang it on the first empty slot; sorted input degenerates it into a list",
    "相等时什么都不做：这是集合语义": "duplicates change nothing: set semantics",
    "判定必须沿路径传上下界：只比较父子会漏掉「孙子越界」": "validation must carry bounds along the path; comparing parent and child alone misses an out-of-range grandchild",
    "反例：8 的左子树里挂一个 10，父子两两比较全过，但整棵树不是 BST": "counterexample: 10 inside 8's left subtree passes every parent-child test, yet the tree is not a BST",
    "销毁顺序仍然是后序": "the freeing order is still post-order",
    "手写小顶堆：完全二叉树用数组存，孩子位置是算出来的，不需要指针": "hand-written min-heap: a complete tree in an array, children computed rather than pointed at",
    "空堆上调用是未定义行为，先判 empty": "calling this on an empty heap is undefined behaviour — test empty() first",
    "上浮：比父亲小就一路换上去": "sift up: swap while smaller than the parent",
    "末尾补到顶，堆规模减一": "move the last element to the top and shrink the heap by one",
    "只在存在的孩子里挑更小的": "choose the smaller only among the children that exist",
    "反复取顶就是堆排序": "repeatedly taking the top is exactly heap sort",
    "默认大顶堆": "a max-heap by default",
    "判定：上下界沿路径收紧，只比较父子会漏掉「孙子越界」": "validation: tighten bounds along the path; parent-child tests miss an out-of-range grandchild",
    "空树既是 BST，也是递归终点": "the empty tree is both a BST and the recursion's end",
    "高度：典型的后序用法——先拿到两个孩子的答案，才能算自己的": "height: textbook post-order — the children's answers come before your own",
    "10 挂在 3 的右边，却比根 8 大：越界": "10 sits right of 3 but exceeds the root 8: out of bounds",
    "每轮先取快照，才知道本层有几个": "snapshot each round first to learn how wide the level is",
    "自查结论：naiveOk 为真而 strictOk 为假，正是「只比父子」的经典漏判": "the check that matters: naiveOk true while strictOk is false — the classic parent-only miss"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_ALGO2);
