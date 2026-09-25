/* ================================================================
 * R0:hello agi · 课程深化层 ⑧（dsg 图与搜索 / dsa 排序与算法思想）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「图与搜索」「排序与算法思想」两章从每节 3 要点深化到 8 要点。
 *       dsg 的重心是取舍与代价：邻接矩阵 vs 邻接表（稀疏/稠密的代价）、DFS/BFS 与栈/队列的
 *       对应、visited 的标记时机（入队时 vs 出队时）、最短路四选一、并查集与路径压缩、
 *       连通分量与二分图判定、剪枝与记忆化怎么配合；gd5 新增「把题面翻译成图模型」建模收口课。
 *       dsa 的重心是前提与稳定性：为什么要稳定、比较器严格弱序（写 <= 是 UB）、快排最坏退化
 *       与三数取中、归并的额外空间、堆与 Top-K、计数/桶/基数排序的适用前提、O(n log n) 下界
 *       直觉、二分答案的单调性前提，以及 std::sort / stable_sort / partial_sort / nth_element
 *       的选型；se5 新增「排序与算法思想的选型清单」收口课。
 * 写法约定：既有课节不写 title（沿用主数据标题）；新课写 title/title_en/target/target_en；
 *          order 覆盖全部既有 id + 新增 id；code 里的中文注释全部进 codeComments。
 * ================================================================ */

const DEEPEN_ALGO3 = {
  stages: ["dsg", "dsa"],

  order: {
    dsg: ["gd1", "gd2", "gd3", "gd4", "gd5"],
    dsa: ["se1", "se2", "se3", "se4", "se5"]
  },

  lessons: {

    /* ===================== dsg 图与搜索 ===================== */
    "gd1": {
      min: 12,
      summary: [
        "图 G=(V,E) 就是一堆「点」加上一堆描述关系的「边」：无向边没有方向（朋友、道路），有向边是 u→v 的单行道（先修课、依赖），边再挂一个数字就是加权图——这几个开关的组合决定了后面所有算法的写法与代价。",
        "邻接矩阵 `g[V][V]` 把「u 到 v 有没有边、多重」摊成二维下标：查一条边 O(1)、增删边 O(1)、Floyd 与「所有点对」类算法写起来最顺手；代价是空间恒为 O(V²)，与有多少条边无关——10⁵ 个点就是 10¹⁰ 个格子，图还没建完内存就没了。",
        "邻接表 `vector<vector<int>> g(V)`（带权就存 `pair<int,int>`）只花 O(V+E)：每个点存一份自己的邻居清单，遍历一个点的邻居正好等于它的度数。真实世界几乎都是稀疏图（路网、社交、依赖：E 与 V 同量级而不是 V²），所以它是默认选择。",
        "选表示的本质是算一次稠密度：E 接近 V² 时矩阵反而更划算——邻接表要为 V 个 vector 各付一次堆分配，还要承受指针追逐的常数；E 接近 V 时用矩阵等于为 99.99% 的空格子付钱。动手前先把 `E/V` 和 `V²×sizeof(元素)` 两个数估出来，这是一句话的预算表。",
        "带权矩阵必须区分「无边」和「权为 0」：非对角元素初值设成 `INF`（`0x3f3f3f3f` 这类自身相加也不溢出的魔数），对角线设 0；一旦用 0 或 -1 当哨兵，最短路会以为存在一条免费边，答案小得离谱却查不出错在哪一行。",
        "还有第三种常被忽略的表示：边表 `vector<Edge>{u,v,w}`。Bellman-Ford、Kruskal 只需要「逐条扫描所有边」，用边表最自然；先建邻接表再把每条边摊回边表，就是白付一遍 O(V+E) 的整理成本。",
        "什么时候会出错基本都在建图这一步：顶点编号（题目常从 1 开始，数组从 0 开始）、自环 u→u、重边（同一对点两条边，最短路要取最小，矩阵直接赋值会覆盖掉较短的那条）、以及把 10⁵×10⁵ 的矩阵写成函数内的局部数组直接打爆栈。",
        "衔接：本节只解决「图怎么放进内存」，前置是 dsl 的复杂度口径和 dsk 的队列与哈希；gd2、gd3 才开始走这张图，而那时反复要用的一句话是「一次完整遍历的总时间 = 各点度数之和 = O(V+E)」，它成立的前提正是本节选的表示。"
      ],
      summary_en: [
        "A graph G=(V,E) is a set of vertices plus edges describing a relation: undirected edges have no direction (friendship, roads), directed ones are one-way streets u to v (prerequisites, dependencies), and putting a number on each edge makes it weighted. Those switches decide every algorithm and every cost that follows.",
        "An adjacency matrix g[V][V] spreads 'is there an edge from u to v, and with what weight' into two indices: testing one edge is O(1), adding or deleting is O(1), and Floyd-style all-pairs code reads naturally. The price is a fixed O(V^2) no matter how few edges exist — 10^5 vertices means 10^10 cells, so memory runs out before the graph is built.",
        "An adjacency list 'vector<vector<int>> g(V)' (pairs once weighted) costs only O(V+E): each vertex keeps its own neighbour vector, and scanning a vertex costs exactly its degree. Real graphs are sparse (roads, social ties, dependencies: E grows with V, not V^2), which is why this is the default.",
        "Choosing a representation is really one density calculation: when E approaches V^2 the matrix wins, because a list pays one heap allocation per vertex plus pointer chasing; when E approaches V a matrix means paying for 99.99% empty cells. Estimate E/V and V^2*sizeof(element) before writing code — that is a one-line budget.",
        "A weighted matrix must separate 'no edge' from 'weight 0': initialise off-diagonal cells to INF (a magic value like 0x3f3f3f3f that survives being added to itself) and the diagonal to 0. Use 0 or -1 as a sentinel and shortest path believes a free edge exists — the answer comes out absurdly small with nothing to point at.",
        "There is a third representation people forget: the edge list 'vector<Edge>{u,v,w}'. Bellman-Ford and Kruskal only sweep edges one by one, so an edge list is the honest structure; building adjacency lists and then flattening them back into edges pays an extra O(V+E) for nothing.",
        "Almost every bug lives in the building step: vertex numbering (problems start at 1, arrays at 0), self loops u to u, parallel edges (two edges between the same pair — keep the minimum, since a plain matrix assignment silently deletes the shorter one), and declaring a 10^5 by 10^5 matrix as a local array, which destroys the stack instantly.",
        "Bridge: this lesson only puts a graph into memory; it leans on the complexity vocabulary from dsl and queues and hashing from dsk. gd2 and gd3 start walking the graph, and the fact they use constantly — 'one full traversal costs O(V+E) because the degrees sum to 2E' — holds only because of the representation chosen here."
      ],
      code: `#include <iostream>
#include <vector>
#include <utility>
using namespace std;

int main() {
    const int V = 5;                        // 题目从 1 编号时，数组要开 V + 1
    int edges[6][3] = {{0,1,3},{0,2,1},{1,2,7},{1,3,2},{2,4,5},{3,4,4}};

    // 邻接表：空间 O(V + E)，稀疏图几乎唯一的选择
    vector<vector<pair<int,int>>> g(V);
    for (auto& e : edges) {
        g[e[0]].push_back({e[1], e[2]});
        g[e[1]].push_back({e[0], e[2]});    // 无向图漏了这一行，从 4 出发哪儿也到不了
    }

    const int INF = 0x3f3f3f3f;             // 无边用无穷表示，绝不用 0
    vector<vector<int>> mat(V, vector<int>(V, INF));
    for (int i = 0; i < V; ++i) mat[i][i] = 0;
    for (auto& e : edges) {
        // 重边只保留最小权：直接赋值会悄悄丢掉较短的那条
        if (e[2] < mat[e[0]][e[1]]) { mat[e[0]][e[1]] = e[2]; mat[e[1]][e[0]] = e[2]; }
    }

    // 边表：Bellman-Ford 与 Kruskal 只要逐条扫描，不需要邻居关系
    struct Edge { int u, v, w; };
    vector<Edge> elist;
    for (auto& e : edges) elist.push_back({e[0], e[1], e[2]});

    for (int u = 0; u < V; ++u) {
        cout << u << " 的邻居：";
        for (auto& pr : g[u]) cout << pr.first << "(" << pr.second << ") ";
        cout << "\\n";                        // 只遍历真实存在的边
    }
    cout << "查一条边 mat[0][2] = " << mat[0][2] << "\\n";
    cout << "边表条数 = " << elist.size() << "\\n";
    return 0;
}`,
      pit: "建无向图只写了 `g[u].push_back(v)`——它不报错也不崩，只是从 v 那一侧永远走不到，于是「连通分量个数」莫名多出一倍、BFS 的答案变成 -1；同一类地雷是把 `int g[1000][1000]` 写在函数内部，4MB 直接压垮默认 1MB 的栈，挪成全局或换成 vector 就活了。",
      pit_en: "Building an undirected graph with only g[u].push_back(v) raises no error and crashes nothing — it just makes v unreachable, so the component count doubles and BFS returns -1. The sibling trap is 'int g[1000][1000]' as a local array: 4 MB against a 1 MB default stack, fixed by moving it to file scope or using vectors.",
      ex: {
        q: "10⁵ 个点的稠密图能开邻接矩阵吗？那稀疏图呢？为什么换成 bool 也救不回来？",
        a: "都不能——矩阵空间只由 V² 决定、与稀疏无关，10⁵ 点就是 10¹⁰ 个格子（int 约 40GB），改成 bool 只省 4 倍仍是 10GB；这个规模只能用邻接表或边表。",
        q_en: "Can a dense graph with 10^5 vertices use an adjacency matrix? What about a sparse one, and why does switching to bool not rescue it?",
        a_en: "Neither can: matrix size is fixed by V^2 regardless of sparsity, so 10^5 vertices means 10^10 cells (about 40 GB of int); bool only divides that by four and still needs 10 GB. At this scale adjacency lists or an edge list are the only option."
      }
    },

    "gd2": {
      min: 12,
      summary: [
        "BFS 的本质是「用 FIFO 队列把图一层层铺开」：起点是第 0 层，它的邻居是第 1 层，第 1 层未被访问的邻居是第 2 层——先进先出恰好保证「先入层的点先被展开」，层的顺序就是这么来的，不需要额外记账。",
        "在无权图（或每步代价相同）上，BFS 第一次到达 v 时的层号就是最短步数：任何通往 v 的路都必须从上一层的点跨出最后一步，所以更短的路必然更早被看到。这个按层归纳既是它正确的证明，也是它适用范围的边界。",
        "边一有权重 BFS 立刻失效：走一条权 100 的边到达的点被当成「第 1 层」，绕两条权 1 的边到达的点被当成「第 2 层」，层号不再等于代价——这时候要换 Dijkstra（非负权）或 Bellman-Ford（允许负权），把权 w 拆成 w 条单位边只在 w 很小且为整数时才可行，否则图本身先膨胀到装不下。",
        "模板只有四步且顺序不能变：起点标记并入队 → 弹出队首 → 生成邻居 → 未访问的邻居「先标记、再入队」。少了第一步的标记，或者把标记挪到弹出之后，同一个点会被它的每个邻居各自塞进队列一次。",
        "visited 的标记时机是本章最容易被追问的一条：入队时标记 = 每个点最多进队一次，队列规模被 O(V) 约束、里面的每个元素都已确认层号；出队时标记在纯可达性上仍然正确，但重复元素把时间与内存推到 O(E)，而且一旦你在出队后做累加或计数就会算重。",
        "距离与层有两种写法：`dist[]` 数组（初值 -1，`dist[nb]=dist[u]+1`）直接回答「到每个点几步」；进循环前先记 `int sz = q.size()` 然后只弹 sz 个，就是「一层一批」，才能回答「第 k 层有哪些点」「几分钟烧完」这类按层问题。",
        "网格题的「邻居」就是上下左右（八连通再加四个对角）：把方向数组 `dr[4]/dc[4]` 放到循环外面，每个候选只需判「越界 / 是墙 / 已访问」三件事。在循环里现造一个 `vector<pair<int,int>> dirs` 会让每个格子都付一次堆分配，这是最常见的隐形 TLE 之一。",
        "多源 BFS 只是「把所有起点同一层入队」：火灾蔓延、多个骑士同时动、01 矩阵求到最近 0 的距离，代码与单源完全相同，只是初始队列塞满、「第 k 层」的含义变成「距任一源为 k」。衔接 gd3：把这里的 FIFO 队列换成 LIFO 栈就是 DFS，最短步数的性质随之消失，换来的是 O(深度) 的内存与回溯能力。"
      ],
      summary_en: [
        "BFS is a FIFO queue spreading the graph layer by layer: the source is layer 0, its neighbours layer 1, their unvisited neighbours layer 2. First-in-first-out is exactly what makes nearer layers finish first, so the layering comes from the data structure rather than from extra bookkeeping.",
        "On an unweighted graph (or when every step costs the same) the layer at which BFS first reaches v is the shortest distance: any path to v must take its last step from a vertex in the previous layer, so a shorter path would have been seen earlier. That induction is both the proof and the boundary of the method.",
        "The moment edges carry weights BFS breaks: a vertex reached through one edge of cost 100 lands in layer 1 while one reached through two edges of cost 1 lands in layer 2, so layer number no longer equals cost. Switch to Dijkstra for non-negative weights or Bellman-Ford when negatives exist; expanding a weight w into w unit edges is viable only for tiny integer weights, otherwise the graph itself balloons.",
        "The template is four steps in a fixed order: mark and enqueue the source, pop the front, generate neighbours, and for each unvisited neighbour mark first then enqueue. Drop the initial mark, or move marking to pop time, and every neighbour of a vertex pushes it again.",
        "When you mark visited is the detail interviewers press on: marking at enqueue time means each vertex enters the queue at most once, the queue stays O(V) and every item in it already has a settled layer; marking at dequeue time is still correct for pure reachability but lets duplicates run off to O(E), and anything you accumulate after the pop gets counted twice.",
        "Distance can be carried two ways: a dist[] array initialised to -1 with dist[nb]=dist[u]+1 answers 'how many steps to each vertex'; recording 'int sz = q.size()' before the inner loop and popping exactly sz items handles one whole layer per round, which is what 'which vertices are in layer k' or 'how many minutes until everything burns' needs.",
        "On a grid 'neighbour' means four directions (eight if diagonals count): hoist dr[]/dc[] out of the loop and test three things per candidate — in bounds, not a wall, not visited. Rebuilding a vector of directions inside the loop pays a heap allocation per cell, one of the most common invisible TLEs.",
        "Multi-source BFS is just 'enqueue every source in layer 0': fire spread, several knights moving at once, nearest-zero distance in a 0/1 matrix — identical code, only the initial queue starts full and layer k now means 'distance k from some source'. Bridge to gd3: replace the FIFO queue with a LIFO stack and you get DFS, trading the shortest-path property for O(depth) memory and backtracking."
      ],
      code: `#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <utility>
using namespace std;

int main() {
    vector<string> grid = {"S.#.", "##.#", "..#.", ".#.."};
    int R = (int)grid.size(), C = (int)grid[0].size();
    // dist 兼职 visited：-1 表示没到过
    vector<vector<int>> dist(R, vector<int>(C, -1));
    queue<pair<int,int>> q;
    dist[0][1] = 0;
    q.push({0, 1});                         // 起点：先标记，再入队
    int dr[4] = {-1, 1, 0, 0};              // 方向数组放在循环外
    int dc[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        pair<int,int> cur = q.front(); q.pop();
        int r = cur.first, c = cur.second;
        for (int k = 0; k < 4; ++k) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;    // 越界
            if (grid[nr][nc] == '#') continue;                       // 是墙
            if (dist[nr][nc] != -1) continue;                        // 已经排过层号
            dist[nr][nc] = dist[r][c] + 1;  // 入队时就写死距离，出队再写会写重
            q.push({nr, nc});
        }
    }
    cout << "最短步数：" << dist[R-1][C-1] << "\\n";
    int rounds = 0;                         // 按层写法：一次弹一整层
    queue<int> lvl;
    lvl.push(0);
    while (!lvl.empty()) {
        int sz = (int)lvl.size();           // 先固定本层规模，否则循环永不结束
        for (int i = 0; i < sz; ++i) lvl.pop();
        ++rounds;
    }
    cout << "弹空的轮次数：" << rounds << "\\n";
    return 0;
}`,
      pit: "把标记挪到出队之后：小样例照样对、大图直接爆——一个连了 10⁵ 条边的中心点会被它的每个邻居各塞进队列一次，队列内存与时间一起从 O(V) 变成 O(E)，最后不是 WA 而是 TLE/MLE；同族错误是「入队前忘了判 `dist[nb] != -1`」，起点被自己的邻居重新拉回队列，dist 被反复覆盖成越来越大的值。",
      pit_en: "Marking at dequeue time passes the small sample and detonates the big one: a hub with 10^5 edges gets pushed once by every neighbour, so queue size and time slide from O(V) to O(E) and you collect TLE or MLE instead of WA. The cousin bug is enqueuing without first testing dist[nb] != -1: the source gets dragged back by its own neighbours and dist is overwritten with ever larger values.",
      ex: {
        q: "为什么无权图上 BFS 一步不错，带权图就完全不能用？能补救吗？",
        a: "因为 BFS 的层号统计的是「边数」，只有每条边代价相同它才等于总代价；权不等时要换 Dijkstra（非负）或 Bellman-Ford（有负），或者把权 w 的边拆成 w 条单位边——最后这招只在权重很小且是整数时可接受，否则图本身就膨胀到装不下。",
        q_en: "Why is BFS exactly right on unweighted graphs and useless on weighted ones — and can it be patched?",
        a_en: "BFS counts edges per layer, which equals cost only when every edge costs the same. With unequal weights you need Dijkstra (non-negative) or Bellman-Ford (negatives allowed), or you split each edge of weight w into w unit edges — the last trick is affordable only for tiny integer weights, since otherwise the graph itself blows up."
      }
    },

    "gd3": {
      min: 13,
      summary: [
        "DFS 是「一条路走到底再回头」，实现上就是把 gd2 的 FIFO 队列换成 LIFO 栈：递归版把这个栈藏在系统调用栈里，每层帧保存「我在哪个点、下一个邻居轮到谁」，所以递归深度等于栈深度——它们是同一件事，而不是两种写法。",
        "标记必须发生在往下走之前：递归函数第一件事就是 `vis[u]=true`（或调用者在 push 前标记）。漏掉它，遇到 u→v→u 就是无限递归，几秒钟后栈溢出崩掉，而不是「跑出一个错误的结果」——崩溃其实比静默错误好查，但没人愿意在考场上查它。",
        "BFS 给最短步数，DFS 给可达性与结构：连通分量个数（外层数几次「还没被访问过的起点」）、路径是否存在、Flood Fill 改色、有向图判环（三色标记：白=未访问、灰=在当前这条链上、黑=已处理完；遇到指向灰色的边即存在环）、以及 gd4 要用的逆后序拓扑序。",
        "三色里灰色是最关键的一笔：只判「有没有访问过」会把「指向黑色的横叉边」误判成环；只有指向灰（还在栈上、因而是自己祖先）的边才真的构成环。把颜色数组理解成「祖先链」，判环代码就不需要背。",
        "栈溢出的门槛比想象低：默认栈常见 1MB（Windows 主线程）到 8MB（Linux 主线程），一条 10⁵ 个点的链状图 `1-2-3-…` 递归下去，每帧几十到上百字节，正好落在崩与不崩的边界；出题人最爱给的「链状最坏情况」就是专门用来打递归的。",
        "改写成显式栈不难，但语义会变：把 u 压栈、弹出时标记，纯可达性仍然正确（重复次数受入度约束），可在「弹出后」做计数或累加就会算重；要忠实复刻递归就压 `(u, 下一个邻居下标)` 二元组。或者保留递归、把栈调大——那是续命，不是解法。",
        "网格 Flood Fill 常「用改值代替 visited」（访问过的格子涂成 '2' 或 '#'）：省下一个 O(R·C) 数组，代价是破坏原始输入——后面还要按原值判断（统计岛屿面积、复原地图、或者题目不允许修改输入）就当场翻车。",
        "提速的两个开关长得像但前提不同：剪枝在「当前前缀已经不可能是解」时直接 return（和已超过 target、剩余元素不够凑数），记忆化则缓存「从该参数状态出发的答案」——两者都要求无后效性，状态里少写一个维度（比如「上一个选没选」），缓存就会把错答案一直复用下去。衔接 gd4：把 DFS 的「完成顺序」倒过来，就是拓扑序。"
      ],
      summary_en: [
        "DFS means 'walk one road to the end, then back up', implemented by swapping the FIFO queue of gd2 for a LIFO stack: the recursive version hides that stack in the call stack, where each frame remembers 'which vertex am I, which neighbour is next'. Recursion depth and stack depth are the same quantity, not two styles.",
        "Marking has to happen before descending: the first statement of the recursive function is vis[u]=true (or the caller marks before pushing). Without it, u to v to u becomes infinite recursion and dies of stack overflow in seconds instead of printing a wrong answer — a crash is in fact easier to trace than silent corruption, but nobody wants to trace it during an exam.",
        "BFS gives shortest steps, DFS gives reachability and structure: the number of connected components (count how often the outer loop finds an unvisited start), whether a path exists, flood fill, cycle detection in directed graphs (three colours: white unseen, grey on the current chain, black finished — an edge into grey closes a loop), and the reverse post-order that gd4 turns into a topological order.",
        "Grey is the crucial colour: testing only 'have I seen this vertex' misreads a cross edge into black as a cycle, while only an edge into grey — still on the stack, hence an ancestor — really forms one. Understand the colour array as 'the ancestor chain' and the cycle code stops being something you memorise.",
        "The overflow threshold is lower than it looks: the default stack is often 1 MB (Windows main thread) up to 8 MB (Linux main thread), and a chain of 10^5 vertices at a few dozen to a hundred-plus bytes per frame sits exactly on the edge between surviving and dying. Examiners hand out chain-shaped inputs precisely to knock over recursion.",
        "Converting to an explicit stack is easy but shifts the semantics: pushing u and marking at pop time is fine for pure reachability (duplicates are bounded by in-degree), yet any counting done after the pop double-counts. To mirror recursion faithfully, push (u, next-neighbour-index) pairs. Or keep the recursion and enlarge the stack — that buys time, it is not a solution.",
        "Flood fill often replaces visited with recolouring (writing '2' into visited cells): it saves an O(R*C) array but destroys the input, so it backfires the moment something later needs the original value — measuring island areas, restoring the map, or any problem that forbids modifying the board.",
        "The two speed-ups look alike but differ in preconditions: pruning returns as soon as the current prefix cannot become a solution (sum already past target, not enough elements left), while memoisation caches 'the answer from this parameter state'. Both demand that the state fully determines the future — omit one dimension from the key (say 'did I take the previous item') and the cache reuses wrong answers with perfect confidence. Bridge to gd4: reverse the DFS finishing order and you have a topological order."
      ],
      code: `#include <iostream>
#include <vector>
#include <stack>
using namespace std;

const int WHITE = 0, GRAY = 1, BLACK = 2;

// 有向图判环：撞到 GRAY 说明回到了自己脚下这条链上
bool dfsCycle(const vector<vector<int>>& g, vector<int>& color, int u) {
    color[u] = GRAY;                            // 往下走之前先标记
    for (int v : g[u]) {
        if (color[v] == WHITE) { if (dfsCycle(g, color, v)) return true; }
        else if (color[v] == GRAY) return true; // 后向边：成环
    }
    color[u] = BLACK;                           // 这条链走完了，指回它不算环
    return false;
}

int main() {
    const int V = 6;
    // 无向图：0-1-2 与 3-4 两个分量，5 是孤点
    vector<vector<int>> adj(V);
    int edges[3][2] = {{0, 1}, {1, 2}, {3, 4}};
    for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }

    vector<char> vis(V, 0);
    int components = 0;
    for (int s = 0; s < V; ++s) {
        if (vis[s]) continue;
        ++components;                           // 又一个没被到过的点＝新分量
        stack<int> st;
        st.push(s);
        vis[s] = 1;                             // 入栈即标记：每个点最多进栈一次
        while (!st.empty()) {
            int u = st.top(); st.pop();
            for (int v : adj[u]) if (!vis[v]) { vis[v] = 1; st.push(v); }
        }
    }

    // 有向图：0→1→2→0 成环，3→4→5 只是链
    vector<vector<int>> dag(V);
    dag[0].push_back(1); dag[1].push_back(2); dag[2].push_back(0);
    dag[3].push_back(4); dag[4].push_back(5);
    vector<int> color(V, WHITE);
    bool cycle = false;
    for (int s = 0; s < V && !cycle; ++s)
        if (color[s] == WHITE) cycle = dfsCycle(dag, color, s);

    cout << "连通分量数：" << components << "\\n";
    cout << "有向图有环：" << (cycle ? "yes" : "no") << "\\n";
    return 0;
}`,
      pit: "把「有向图三色判环」原封不动搬到无向图上一定会误报有环：每条边都被存了两次，走到 v 之后立刻看见回 u 的那条边，而 u 正是 GRAY。要么递归时把父节点 `from` 传下去并跳过它（有重边时得改成跳过边编号），要么无向图判环直接用 gd5 的并查集——`unite` 返回 false 就是有环，代码还更短。",
      pit_en: "Porting three-colour directed cycle detection straight onto an undirected graph always reports a cycle: each edge is stored twice, so from v you immediately see the edge back to u, and u is GRAY. Either pass the parent down and skip it (skip the edge id instead, because of parallel edges), or use the union-find from gd5 for undirected cycles — a unite() that returns false is the cycle, and it is shorter code.",
      ex: {
        q: "为什么链状大图会把递归 DFS 打崩，BFS 却常常活得很好？",
        a: "递归深度等于路径长度，每层帧都要占栈空间，10⁵ 层就超出默认栈；BFS 的队列在堆上，内存跟着「最宽的一层」走，而链状图每层只有一个点，反而几乎不吃内存——两种遍历耗尽内存的位置根本不同。",
        q_en: "Why does a chain-shaped large graph kill recursive DFS while BFS usually survives?",
        a_en: "Recursion depth equals path length and every frame costs stack space, so 10^5 levels exceed the default stack; the BFS queue lives on the heap and tracks the widest layer, and a chain has one vertex per layer — the two traversals run out of memory in completely different places."
      }
    },

    "gd4": {
      min: 12,
      summary: [
        "拓扑序是把 DAG 的点排成一行，让每条有向边 u→v 都满足「u 排在 v 前面」。它通常不唯一（互不可达的点可以互换），而且只有有向无环图才有：一旦成环，环上的点互相要求对方先完成，永远凑不出一个「没有前置」的点。",
        "Kahn 算法由「入度」而不是 visited 驱动：先把所有入度为 0 的点入队（它们没有任何前置），弹出一个就输出一次，并把它的每个后继入度减 1——减到 0 的含义是「它的前置刚刚全部排完了」，此刻才允许入队。",
        "入度数组是一张依赖计数器：建边时 `g[u].push_back(v)` 与 `indeg[v]++` 必须成对出现。只建邻接表忘了入度，初始队列里就只剩真正的孤立点，队列一空算法提前结束；这正是 gd1 那句「建图阶段就想清楚」的具体落点。",
        "环检测是白送的：统计弹出的点数 `cnt`，结束时 `cnt < V` 就说明剩下的点全被环卡住（或在环的下游）。「课程表能不能修完」「构建任务有没有循环依赖」「能不能生成执行顺序」都是这一句——记住判据比记住结论值钱。",
        "另一种写法是 DFS 逆后序：`dfs(u)` 返回前把 u 压进结果，最后整体反转，同样得到一个拓扑序。区别在信息量——Kahn 能明确告诉你「哪些点被卡住」（结束时仍剩正入度的那些），DFS 版靠 GRAY 只能回答「有没有环」，还要背上 gd3 说过的栈深度问题。",
        "拓扑序真正的价值是把「图上递归」压成「一维循环」：有了顺序之后，DAG 上的最长路、最短路（允许负权！）、方案数、必经点统计都能在 O(V+E) 内按序递推，不需要 Dijkstra——因为没有环可以反复绕，「已弹出的点距离已最优」这个前提根本不需要。这就是最短路四选一里 DAG 那一档。",
        "同一个 Kahn 骨架换容器就换题：要字典序最小的拓扑序就把队列换成最小堆（`priority_queue<int, vector<int>, greater<int>>`）；要「最少几批做完」就把当前所有入度 0 的点当一批弹出，批数是并行完成时间的下界；要关键路径就给每个点记最早完成时间。容器加一个附带数组，就是这一族题目的全部变化点。",
        "衔接：gd4 是 dsg 的收尾工具，也是 gd5 建模时的常见落点——题面一出现「前置、依赖、先后、必须同时」就先想拓扑排序；gd5 会把「这段中文怎么变成点和边」写成一份可自查的清单，并把并查集、二分图和最短路选型补齐。"
      ],
      summary_en: [
        "A topological order lines the vertices of a DAG up in a row so that every directed edge u to v puts u before v. It is usually not unique (mutually unreachable vertices may swap), and it exists only for acyclic directed graphs: inside a cycle every vertex waits on another, so a vertex with no remaining prerequisite never appears.",
        "Kahn's algorithm is driven by in-degree rather than visited: enqueue every vertex with in-degree 0 (nothing must happen before it), and for each pop emit the vertex and decrement each successor's in-degree — reaching 0 means 'its last prerequisite has just been emitted', and only then may it enter the queue.",
        "The in-degree array is a dependency counter: g[u].push_back(v) and indeg[v]++ must always be written as a pair. Build adjacency lists without in-degrees and the initial queue holds only genuinely isolated vertices, so the algorithm halts early. This is where gd1's 'decide everything while building' lands concretely.",
        "Cycle detection comes free: count the popped vertices, and if cnt < V the rest are all trapped by a cycle (or sit downstream of one). 'Can I finish all courses', 'do the build targets have a circular dependency', 'is any execution order derivable' all reduce to that line — the criterion is worth more than the yes/no.",
        "The alternative is DFS reverse post-order: push u into the result as dfs(u) returns, then reverse the whole list — also a valid topological order. They differ in information: Kahn names the trapped vertices (those still holding positive in-degree), while the DFS version with GRAY only answers 'is there a cycle' and inherits the stack-depth risk from gd3.",
        "The real payoff of a topological order is flattening graph recursion into a one-dimensional loop: once you have it, longest path, shortest path (negative weights allowed!), number of ways and articulation-style counting on a DAG all run in O(V+E), with no Dijkstra — nothing can loop back, so the assumption 'a popped vertex already holds its final distance' is simply not needed. That is the DAG slot in the four-way shortest-path choice.",
        "Swap the container and the same Kahn skeleton becomes another problem: a min-heap yields the lexicographically smallest order; popping all current zero-in-degree vertices as one batch gives the minimum number of parallel rounds; attaching an earliest-finish time per vertex gives the critical path. A container plus one auxiliary array is the entire variation of this family.",
        "Bridge: gd4 is the last tool of the graph chapter and a frequent landing point in gd5 — whenever the statement mentions prerequisites, dependencies or ordering, try topological sort first. gd5 then turns 'how do I get vertices and edges out of this paragraph' into a checklist and fills in union-find, bipartiteness and the shortest-path selection table."
      ],
      code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    const int V = 6;
    vector<vector<int>> g(V);
    vector<int> indeg(V, 0);
    // 先修关系 u -> v：先上完 u 才有资格上 v
    int P[7][2] = {{0,2},{1,2},{2,3},{3,5},{4,5},{2,5},{1,4}};
    for (auto& e : P) {
        g[e[0]].push_back(e[1]);
        indeg[e[1]]++;                        // 建表与加入度必须成对出现
    }
    queue<int> q;
    for (int i = 0; i < V; ++i)
        if (indeg[i] == 0) q.push(i);         // 入度 0：没有任何前置
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : g[u])
            if (--indeg[v] == 0) q.push(v);   // 前置刚好清零才轮到它
    }
    // 把上面某条边改成 5 -> 0 再试：order 只剩 5 个，剩下的点就是被环卡住的
    if ((int)order.size() < V) {
        cout << "有环，修不完，被卡住的点：";
        for (int i = 0; i < V; ++i) if (indeg[i] > 0) cout << i << " ";
        cout << "\\n";
        return 0;
    }
    cout << "拓扑序：";
    for (int u : order) cout << u << " ";
    cout << "\\n";
    return 0;
}`,
      pit: "把「前置全部完成」写成 `for (int v : g[u]) if (indeg[v] == 0) q.push(v);`——少了先减 1 这一步，一个入度为 2 的点会被它的第一个邻居提前放行，于是拓扑序里 v 排到了自己另一个前置之前；数据一随机、样例一小就看不出来，直到评测机给出一条很深的依赖链。正确写法是 `if (--indeg[v] == 0)`，让「减」与「判」在同一句里完成，不给忘记的机会。",
      pit_en: "Writing the readiness test as 'for (int v : g[u]) if (indeg[v] == 0) q.push(v);' omits the decrement, so a vertex with in-degree 2 is released by its first neighbour and lands in the order before its other prerequisite. Random small samples hide it; a deep dependency chain on the judge does not. Write if (--indeg[v] == 0) so the decrement and the test cannot drift apart.",
      ex: {
        q: "为什么 DAG 上的最短路能容忍负权边，Dijkstra 却不行？",
        a: "拓扑序保证处理 u 时所有指向 u 的边都已松弛完毕，每条边恰好按序被用一次，不需要「已弹出的点距离已是最终值」这个前提；Dijkstra 一旦遇到负权边，就把已经出队的点当成定局，本应变小的机会被永久丢掉。",
        q_en: "Why can shortest paths on a DAG tolerate negative edges while Dijkstra cannot?",
        a_en: "The topological order guarantees that when u is processed every edge into u has already been relaxed, each used exactly once in order, so no assumption that a popped vertex holds its final distance is required. Dijkstra treats a popped vertex as settled, and a negative edge afterwards would have to revise it but cannot."
      }
    },

    "gd5": {
      title: "综合重构：把题面翻译成图模型",
      title_en: "Synthesis: Translating a Problem into a Graph",
      min: 15,
      target: "拿到一段中文题面，能一次说清点与边分别是什么、该走哪种遍历与算法，并当场给出复杂度与内存估计。",
      target_en: "Given a problem statement, say what the vertices and edges are, pick the traversal and algorithm, and state the time and memory bounds on the spot.",
      summary: [
        "建模三问先落到纸上：谁是点、谁是边、边的方向与权是什么。点不一定是城市或站点——它可以是一个状态、一个单词、一个下标、一门课；只要「某个东西」能唯一标识局面，它就能当点，而「一次合法变换」就是边。",
        "隐式图是最常见的一类：网格（点 = (r,c)，边 = 四邻域）、字符串状态（点 = 当前串，边 = 改一个字符）、棋盘与滑块（点 = 局面，边 = 一步移动）。这类图从不需要真的存下来，邻居当场算出来即可；但必须先算 V 和 E 的量级——状态数是 2ⁿ 或 n! 时，任何遍历都救不了你，那是 DP 或数学的战场。",
        "最短路四选一是本章的核心决策表：无权或单位权 → BFS；权非负 → Dijkstra（配堆 O((V+E)log V)，稠密图改用朴素 O(V²) 反而更快）；有负权、或限制「最多经过 k 条边」→ Bellman-Ford（O(VE)，还能查负环）；图是 DAG → 拓扑序递推（可负权、线性时间）。选错行的症状很典型：该 Dijkstra 时用 BFS，答案偏大；有负环时用 Dijkstra，不收敛或答案错得离谱。",
        "「只问连通、不问路径」就用并查集：`find/unite` 两个函数替代整场 BFS，支持在线加边，天然适合「不断合并朋友圈」「判无向图有没有环」「Kruskal 建最小生成树」。路径压缩（`p[x] = find(p[x])`，顺手把整条链挂到根上）配按秩合并，均摊 O(α(V)) 实际就是常数；但它不支持删边，删除类操作要「离线把询问倒过来当加边处理」。",
        "连通分量与二分图是同一套遍历的两种附加记账：数分量就是「外层扫点 + 每个未访问点起一次搜索」；二分图判定就是双色着色（BFS/DFS 皆可），新点染 `color[u]^1`，一旦发现邻居与自身同色就说明存在奇环、不是二分图——「能否分成两组且组内无冲突」（冲突分组、比赛编排、宿舍分配）都翻译到这里。",
        "剪枝与记忆化的配合点在状态设计：先问「从 u 出发的答案是否只由 u 决定」（无后效性）——是，就可以 `memo[u]` 缓存，把指数级搜索压成 O(V+E) 的图上 DP；否（路径本身要参与判断，或带「上一个选没选」这类隐藏状态），就必须把状态补全再缓存，或者退回纯剪枝。缓存一个错状态比不缓存更危险，因为它每次都对得一模一样。",
        "交付前的自查清单：编号有没有偏移（1-based 还是 0-based）、无向边登记了两次没有、重边与自环怎么处理、visited 是入队时还是出队时标记、dist 初值与 INF 取值、该用队列还是栈、O(V²) 的数组有没有被放进局部栈、拿最大规模反推一秒内跑不跑得完；最后用「全连通 / 全孤立 / 链状 / 含环」四种极端图各跑一遍。",
        "复盘三种高频翻车：把「最小步数」直接贪心（该 BFS 或 Dijkstra）、把状态当点时漏了一维（记忆化永远命中错的缓存）、把并查集当最短路用（它只回答连不连，不回答几步）。衔接 dsa：图章讲的是「在关系上走」，se1~se5 讲的是「把一堆数据排好并选出决策」，两章合起来覆盖笔试里绝大多数「先定顺序、再走关系」的题。"
      ],
      summary_en: [
        "Put the three modelling questions on paper first: what are the vertices, what are the edges, and what direction and weight do edges carry. A vertex need not be a city or a station — it can be a state, a word, an index, a course; anything that uniquely identifies a situation can be a vertex, and one legal transformation is an edge.",
        "Implicit graphs are the commonest family: a grid (vertex = (r,c), edge = four neighbours), string states (vertex = current string, edge = change one character), sliding puzzles (vertex = configuration, edge = one move). Such a graph is never stored — neighbours are computed on the fly — but you must size V and E first: when the state count is 2^n or n!, no traversal rescues you, and that is dynamic programming or maths territory.",
        "The shortest-path decision table is the heart of the chapter: unweighted or unit weights, BFS; non-negative weights, Dijkstra (O((V+E) log V) with a heap, while a dense graph is often faster with plain O(V^2)); negative weights or a cap of 'at most k edges', Bellman-Ford (O(VE), and it also reports negative cycles); a DAG, topological relaxation (linear, negatives fine). Wrong-row symptoms are equally typical: BFS where Dijkstra was needed overshoots, and Dijkstra on a negative cycle either never converges or returns nonsense.",
        "Reach for union-find whenever the question asks only 'are they connected' and never 'by what route': find/union replaces an entire BFS, edges can arrive online, and it fits merging friend circles, undirected cycle detection and Kruskal's spanning tree. Path compression (p[x] = find(p[x]), hanging the whole chain onto the root) plus union by rank gives an amortised O(alpha(V)), a constant in practice — but there is no edge deletion, which forces the offline trick of reading queries backwards as insertions.",
        "Connected components and bipartiteness are the same traversal with different bookkeeping: count components by sweeping all vertices and launching a search from each unvisited one; test bipartiteness by two-colour BFS or DFS, painting each new vertex colour[u]^1 and declaring an odd cycle the moment a neighbour already shares your colour. 'Can they be split into two conflict-free groups' (conflict grouping, tournament pairing, dormitory assignment) translates to exactly this.",
        "Pruning and memoisation meet at state design: ask whether the answer from u depends only on u (no after-effect). If yes, memo[u] collapses exponential search into an O(V+E) DP on the graph; if not — the path itself matters, or a hidden dimension like 'did I take the previous item' is live — widen the state before caching, or fall back to plain pruning. Caching a wrong state is worse than not caching, because it agrees with itself every single time.",
        "Pre-delivery checklist: index offset (1-based versus 0-based), whether each undirected edge was registered twice, how parallel edges and self loops are treated, whether visited is marked at enqueue or at dequeue, the initial value of dist and the choice of INF, queue versus stack, whether an O(V^2) array was left on the local stack, and whether the maximum input still fits one second; then run four extreme graphs — fully connected, fully isolated, a chain, and one containing a cycle.",
        "Retrospective on the three recurring failures: greedily minimising steps where BFS or Dijkstra was required, dropping a dimension from the state so the memo only ever hits wrong entries, and using union-find as shortest path (it answers connected-or-not, never how many steps). Bridge to dsa: this chapter walks over relations; se1 to se5 order a pile of data and choose a decision idea — together they cover the bulk of written tests that first need an order, then a relation."
      ],
      code: `#include <iostream>
#include <vector>
#include <queue>
#include <utility>
#include <algorithm>
using namespace std;

// 并查集：按秩合并 + 路径压缩，问「两点连通吗」比跑一次 BFS 便宜得多
struct DSU {
    vector<int> p, r;
    explicit DSU(int n) : p(n), r(n, 0) {
        for (int i = 0; i < n; ++i) p[i] = i;    // 每个点先自成一派
    }
    int find(int x) {
        if (p[x] != x) p[x] = find(p[x]);        // 压缩：把整条链直接挂到根上
        return p[x];
    }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;                // 已在同组：再连一条边就是环
        if (r[a] < r[b]) swap(a, b);
        p[b] = a;
        if (r[a] == r[b]) ++r[a];
        return true;
    }
};

// 双色 BFS：能染完就是二分图，撞到同色邻居说明存在奇环
bool bipartite(const vector<vector<int>>& g) {
    vector<int> color(g.size(), -1);
    for (int s = 0; s < (int)g.size(); ++s) {
        if (color[s] != -1) continue;
        color[s] = 0;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : g[u]) {
                if (color[v] == -1) { color[v] = color[u] ^ 1; q.push(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}

int main() {
    const int V = 6;
    // 0-1-2 是三角形（奇环），再挂 1-3-5 与 2-4 两条腿
    vector<vector<int>> g = {{1, 2}, {0, 2, 3}, {0, 1, 4}, {1, 5}, {2}, {3}};
    DSU dsu(V);
    int extra = 0;                               // 多余的边数＝独立环的个数
    for (int u = 0; u < V; ++u)
        for (int v : g[u])
            if (u < v && !dsu.unite(u, v)) ++extra;   // u < v：无向边只登记一次
    int blocks = 0;
    for (int i = 0; i < V; ++i) if (dsu.find(i) == i) ++blocks;
    cout << "连通块数：" << blocks << "\\n";
    cout << "多余的边数：" << extra << "\\n";
    cout << "是否二分图：" << (bipartite(g) ? "yes" : "no") << "\\n";
    return 0;
}`,
      pit: "`find` 忘了写回 `p[x] = find(p[x])`、只写 `return find(p[x])`：结果完全正确，但树没有被压扁，退化成一条链，最坏单次 O(n)、连续 10⁶ 次询问直接 TLE——「答案对但慢」比崩更难查。另一半常见错法是 `unite` 里直接 `p[a] = b` 而忘了先 `find`，把两个已经挂过东西的根连成环，下一次 `find` 当场无限递归。",
      pit_en: "Writing find as 'return find(p[x])' without the write-back p[x] = find(p[x]) gives perfectly correct answers with no compression: worst case O(n) per call, and a million queries time out — 'right but slow' is far harder to notice than a crash. The other classic is p[a] = b inside unite without calling find first, which links two already-attached roots into a loop and makes the next find recurse forever.",
      ex: {
        q: "同样问「两点是否连通」，为什么并查集常常优于每次跑一遍 BFS？什么时候又必须回到 BFS？",
        a: "并查集把每次询问压成近似 O(1) 且支持在线加边，而每次 BFS 都要重付 O(V+E)；但只要问题问的是「最短几步、路径上有没有某个点、把路径本身打印出来」，就必须回到遍历——并查集的信息量只有「同根 / 不同根」这一 bit。",
        q_en: "For 'are these two vertices connected', why does union-find usually beat a BFS per query, and when must you go back to BFS?",
        a_en: "Union-find answers each query in about O(1) and accepts edges online, while each BFS repays O(V+E). But the moment the question asks for a distance, whether some vertex lies on the path, or the path itself, you need a traversal — union-find carries exactly one bit: same root or not."
      }
    },

    /* ===================== dsa 排序与算法思想 ===================== */
    "se1": {
      min: 12,
      summary: [
        "先说清不变量再写循环：冒泡每轮把未排段的最大值一路换到末尾（一轮结束至少一个元素归位）；选择排序每轮在未排段里找最小值、与未排段首位交换；插入排序把新元素在已排段里从后往前顶到正确位置——三种描述对应的循环边界完全不同，凭印象写必错一个。",
        "冒泡的价值几乎全在那个 `swapped` 标志上：某一轮零交换说明已经有序，立刻 break，于是在「基本有序」的数据上它降到 O(n)；没有标志的冒泡永远跑满 n²，被人说「你写的不是冒泡，是双重 for」并不冤枉。",
        "插入排序真正的用武之地是「近乎有序」与「小区间」：它的比较与移动次数正比于逆序对数，数据越有序越接近 O(n)，而且原地、常数极小、顺序访问缓存友好——所以工业级快排都在区间长度小于 16~32 时切回插入排序，libstdc++ 的 `std::sort` 收尾用的就是无边界检查版插入排序。",
        "稳定性 = 相等元素的相对次序不变。它不是学术洁癖：多关键字排序靠它（先按班级排好、再按成绩稳定排序，班级序不会被打乱）、带原始序号的记录靠它、外部排序的逐轮归并靠它、「同分时谁先录入谁在前」的业务规则也靠它——不稳定会把上一轮已经付过钱的次序直接搅乱。",
        "谁稳定谁不稳定：冒泡稳定（只在严格大于时交换，相等绝不动）、插入稳定（遇到相等就停手）、选择排序**不**稳定（一次跨越式的 swap 会把相等元素甩到彼此后面）、快排与堆排通常不稳定。面试里「选择排序为什么不稳定」的标准答案就是那次跨越交换。",
        "稳定性常常由一个运算符决定：插入排序里写 `while (j >= 0 && a[j] > key)` 才稳定，写成 `a[j] >= key` 就会让相等元素互相挤过去；C++ 里 `std::sort` 明确不保证稳定，需要稳定必须换 `std::stable_sort`（归并实现、要额外内存），或者把次要关键字写进比较器。",
        "复杂度不是唯一指标：同样 O(n²)，选择排序比较次数固定为 (n²-n)/2 但只交换 O(n) 次——记录很大、交换很贵时它反而占优（实际做法是只对下标排序）；冒泡的交换次数正好等于逆序对数（最坏 n²/2）；插入是「移动」而不是「交换」。选哪个，取决于「比较贵还是搬动贵」。",
        "衔接：本节的地基是 dsl 的大 O 口径与 s12 的容器/迭代器；下一节 se2 把「相邻交换」换成「划分与合并」，一步跳到 O(n log n)，代价是稳定性与最坏保证要重新讨论一遍。"
      ],
      summary_en: [
        "State the invariant before touching the loops: bubble pushes the largest remaining element to the end each round so at least one lands correctly; selection finds the minimum of the unsorted tail and swaps it to the front; insertion walks the sorted prefix right to left shifting elements until the new one fits. These three invariants give three different loop bounds, and writing from memory guarantees an off-by-one.",
        "Bubble sort is worth almost nothing without its swapped flag: a round with zero swaps proves the array is sorted, so you break and get O(n) on nearly ordered input. Without the flag it always burns n^2, and the accusation that you wrote 'a nested for loop, not bubble sort' is fair.",
        "Insertion sort earns its place on nearly sorted data and on short ranges: its work is proportional to the number of inversions, it is in-place, its constant is tiny and its access pattern is cache friendly — which is exactly why production quicksorts hand ranges below 16 to 32 elements to insertion sort, and why libstdc++ finishes std::sort with an unchecked insertion sort.",
        "Stability means equal elements keep their relative order, and it is not an academic nicety: multi-key sorting depends on it (sort by class, then stable-sort by score and the class order survives), records carrying an original index depend on it, every pass of an external merge depends on it, and so does any rule like 'among ties, whoever was entered first stays first'. An unstable sort shreds whatever secondary order you already paid for.",
        "Who is stable: bubble (swap only on strict greater) and insertion (stop at equality) are; selection is not, because its long-range swap flings equal elements past each other; quicksort and heapsort normally are not. The standard interview answer for 'why is selection unstable' is precisely that crossing swap.",
        "Stability can hinge on a single operator: in insertion sort 'while (j >= 0 && a[j] > key)' is stable while 'a[j] >= key' lets equal elements leap over one another. In C++, std::sort guarantees nothing about order among equals — reach for std::stable_sort (merge-based, extra memory) or fold the tiebreaker into the comparator.",
        "Complexity is not the only number: all three are O(n^2), yet selection always does (n^2-n)/2 comparisons but only O(n) swaps (superior when swapping is expensive, i.e. fat records, where you sort indices instead), bubble performs exactly one swap per inversion (up to n^2/2), and insertion moves rather than swaps. Which one you pick depends on whether comparisons or data movement is the expensive currency.",
        "Bridge: this lesson stands on the Big-O vocabulary of dsl and the containers and iterators of s12. se2 replaces neighbour-swapping with partitioning and merging, jumping to O(n log n) — and reopening both stability and the worst-case question."
      ],
      code: `#include <iostream>
#include <vector>
#include <string>
#include <utility>
using namespace std;

struct Rec { int score; string name; };

// 插入排序：只在严格大于时后移，相等就停手 —— 于是稳定
void insertion(vector<Rec>& a) {
    for (int i = 1; i < (int)a.size(); ++i) {
        Rec key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j].score > key.score) {   // 写 >= 就会破坏稳定性
            a[j + 1] = a[j];
            --j;
        }
        a[j + 1] = key;
    }
}

void bubble(vector<int>& a) {
    int n = (int)a.size();
    for (int i = 0; i < n; ++i) {
        bool swapped = false;                        // 没有这个标志，冒泡永远跑满 n^2
        for (int j = 0; j + 1 < n - i; ++j)
            if (a[j] > a[j + 1]) { swap(a[j], a[j + 1]); swapped = true; }
        if (!swapped) break;                         // 已经有序，提前收工
    }
}

void selection(vector<int>& a) {
    int n = (int)a.size();
    for (int i = 0; i < n; ++i) {
        int mn = i;
        for (int j = i + 1; j < n; ++j) if (a[j] < a[mn]) mn = j;
        if (mn != i) swap(a[i], a[mn]);              // 跨越相等元素：这一步让它不稳定
    }
}

int main() {
    // 分数相同的记录：稳定排序必须让 B 在 D 前、A 在 C 前
    vector<Rec> v = {{90, "A"}, {80, "B"}, {90, "C"}, {80, "D"}};
    insertion(v);
    for (auto& r : v) cout << r.score << ":" << r.name << "  ";
    cout << "\\n";
    vector<int> a = {5, 2, 4, 1, 3};
    vector<int> b = a;
    bubble(a);
    selection(b);
    for (int x : a) cout << x << " ";
    cout << "\\n";
    for (int x : b) cout << x << " ";
    cout << "\\n";
    return 0;
}`,
      pit: "想着「先按班级排好，再按分数排一次不就完了」，却用了 `std::sort`：第二次排序把班级顺序彻底打乱，同分学生的名次变成随机。稳定性的价值只在「多次排序」里体现——要么改用 `std::stable_sort`，要么把班级写进比较器当第二关键字；后者通常还更快，因为它只排一次，而不是排两次。",
      pit_en: "Thinking 'sort by class, then sort by score and I am done' while using std::sort: the second pass destroys the class order and tied scores come out in arbitrary order. Stability only pays off across multiple passes — either switch to std::stable_sort or put the class into the comparator as a second key, which is usually faster because it sorts once instead of twice.",
      ex: {
        q: "为什么快排要在小区间切换回插入排序？把阈值设成 1 不是更「纯粹」吗？",
        a: "因为小区间上 n² 只是一个有限的绝对代价（20² = 400 次比较），而插入排序没有递归调用、没有划分扫描、顺序访问缓存，实测就是比快排快；阈值设成 1 等于把省下的固定开销全部还回去，还要额外背上函数调用。",
        q_en: "Why does quicksort hand short ranges to insertion sort, and why not keep the threshold at 1 for purity?",
        a_en: "On a short range n^2 is only a bounded absolute cost (20^2 = 400 comparisons), while insertion sort pays no recursion, no partition scan and enjoys sequential cache behaviour — it simply measures faster. A threshold of 1 gives all of that saving back and adds a function call."
      }
    },

    "se2": {
      min: 15,
      summary: [
        "快排 = 选基准 + 划分 + 递归两侧。划分维持的不变式是「左段 ≤ pivot ≤ 右段，且 pivot 落在它最终的位置上」；两个标准实现是 Lomuto（单指针扫描，最好写，遇到大量相等元素会把递归压向一侧）与 Hoare（双指针对向扫描，交换次数约少一半，但边界要格外小心）。",
        "最坏退化 O(n²) 的触发条件是「每次基准都取到最值」：已排序或逆序的数组配「取首元素/取尾元素」正好满足，划分一边倒，递归深度同时变成 O(n)（栈也跟着爆）。对策是随机取基准或三数取中（首/中/尾取中位数）——它们不消除最坏情况，只是让最坏情况不再由输入决定，从而把「构造坏数据」的权力从出题人手里拿走。",
        "大量重复键是另一种退化：两路划分时所有等于基准的元素都被划到同一侧，n 个相同元素就是 O(n²)。解法是三路划分（荷兰国旗问题：< pivot | == pivot | > pivot 三段），等于 pivot 的那一段整体不再递归——「按部门名排序」「海量同分记录」这类输入全靠它，`std::sort` 的多数实现也做了这件事。",
        "`std::sort` 不是纯快排而是内省排序 introsort：快排 + 递归深度超过 2·log₂n 时切换到堆排序（最坏 O(n log n) 的保证就来自这里）+ 小区间插入排序 + 中位数法选基准。面试里说「std::sort 就是快排」必须补上这句，否则「最坏复杂度」一问就答错。",
        "比较器必须是**严格弱序**：核心要求是 `comp(x, x)` 恒为 false（不可自反），并且「谁也不比谁强」这种等价关系要具有传递性。把它写成 `return a <= b;` 会让自反性破产，标准库据此做的区间收缩可能越界访问——libstdc++ 上的典型表现不是「顺序有点乱」而是段错误，且偏偏只在元素大量相等时出现，极其难查。",
        "归并 = 分两半各自排序 + 线性合并。它的三个卖点：复杂度恒为 O(n log n)（与输入分布无关）、天然稳定（合并时相等优先取左侧）、以及纯顺序访问；它的代价是一份 O(n) 辅助数组和大约两倍的数据搬移。内存放不下的大文件只能走归并路线（外部排序 / 多路归并），因为快排需要对整个区间随机访问。",
        "两者的取舍可以压缩成一句话：要原地、要缓存友好、能接受偶然的坏运气 → 快排；要稳定、要最坏保证、能付出额外内存 → 归并（`std::stable_sort`）。另外「记录很大、比较键很贵」时先给下标排序（`vector<size_t>` 排完再按序取记录），把交换代价换成间接寻址代价，是工程里非常常用的一招。",
        "STL 选型表：整体排好 `std::sort`；要稳定 `std::stable_sort`；只要前 k 个且它们内部有序 `std::partial_sort`（堆实现，O(n log k)）；只要求第 k 位定下来、左边都不大于它 `std::nth_element`（平均 O(n)，Top-K 与中位数首选）。衔接 se3：排序买到的是「有序」，下一节所有技巧都建立在这个前提上。"
      ],
      summary_en: [
        "Quicksort is pick a pivot, partition, recurse on both sides. The partition invariant is 'left part <= pivot <= right part, with the pivot at its final index'; the two canonical forms are Lomuto (one scanning pointer, easiest to write, but equal elements push the recursion to one side) and Hoare (two pointers moving towards each other, roughly half the swaps, but the boundaries demand care).",
        "The O(n^2) worst case fires whenever the pivot is an extreme value: sorted or reverse-sorted input combined with 'take the first' or 'take the last' does exactly that, so every split is 0 versus n-1 and the recursion depth becomes O(n), which also blows the stack. Randomised or median-of-three pivots do not remove the worst case — they stop the input from choosing it, taking adversarial-data power away from the problem setter.",
        "Masses of duplicate keys are a second degradation: under two-way partitioning every element equal to the pivot lands on the same side, so n identical keys cost O(n^2). The fix is three-way (Dutch national flag) partitioning into less / equal / greater, where the equal band is excluded from recursion outright — the only sane answer for 'sort by department name' or huge blocks of tied scores, and something most std::sort implementations already do.",
        "std::sort is not plain quicksort but introsort: quicksort plus a switch to heapsort once recursion depth exceeds 2*log2(n) (which is where the worst-case O(n log n) guarantee comes from), plus insertion sort on short ranges, plus median-style pivot choice. Say 'std::sort is quicksort' in an interview without that sentence and your worst-case answer is wrong.",
        "A comparator must express a strict weak ordering: comp(x, x) is always false (irreflexivity), and 'neither beats the other' must be transitive. Writing 'return a <= b;' breaks irreflexivity, and the range shrinking the library derives from that assumption can walk past the buffer — on libstdc++ the symptom is not 'a slightly odd order' but a segfault, and it shows up precisely when many elements tie, which makes it miserable to trace.",
        "Mergesort is split in half, sort both, merge linearly. Its three selling points: O(n log n) regardless of input distribution, natural stability (the merge takes the left element on ties), and purely sequential access. Its price is an O(n) auxiliary buffer and roughly twice the memory traffic. Data too large for RAM has no option but the mergesort route (external k-way merging), because quicksort needs random access to the whole range.",
        "The trade-off compresses to one sentence: in-place, cache friendly, willing to accept bad luck — quicksort; stable, worst-case guaranteed, able to pay extra memory — mergesort, i.e. std::stable_sort. When records are fat and keys expensive, sort a vector of indices and then fetch in order, converting swap cost into indirection cost — a very common engineering move.",
        "The STL selection chart: sort everything with std::sort; need stability, std::stable_sort; need the k smallest in sorted order, std::partial_sort (heap, O(n log k)); need only position k settled with everything left of it no larger, std::nth_element (average O(n), the default for Top-K and medians). Bridge to se3: sorting buys order, and every trick in the next lesson stands on that order."
      ],
      code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 三数取中：把「已排序数组」这种最坏输入拉回平均情况
int medianOf3(vector<int>& a, int lo, int hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] < a[lo]) swap(a[mid], a[lo]);
    if (a[hi] < a[mid]) swap(a[hi], a[mid]);
    if (a[mid] < a[lo]) swap(a[mid], a[lo]);
    swap(a[mid], a[hi]);                     // 基准藏到右端，交给 Lomuto 去划分
    return a[hi];
}

int partition(vector<int>& a, int lo, int hi) {
    int p = medianOf3(a, lo, hi);
    int i = lo;
    for (int j = lo; j < hi; ++j)            // 只扫到 hi 之前：基准不参与扫描
        if (a[j] <= p) swap(a[i++], a[j]);
    swap(a[i], a[hi]);                       // 基准落到它最终的位置
    return i;
}

void quicksort(vector<int>& a, int lo, int hi) {
    while (lo < hi) {                        // 用循环处理较长一侧，栈深降到 O(log n)
        if (hi - lo < 12) { sort(a.begin() + lo, a.begin() + hi + 1); return; }
        int m = partition(a, lo, hi);
        if (m - lo < hi - m) { quicksort(a, lo, m - 1); lo = m + 1; }
        else { quicksort(a, m + 1, hi); hi = m - 1; }
    }
}

int main() {
    vector<int> a = {9, 3, 7, 1, 9, 2, 8, 8, 8};
    quicksort(a, 0, (int)a.size() - 1);
    for (int x : a) cout << x << " ";
    cout << "\\n";
    vector<int> allSame(20000, 42);          // 全相等：两路划分的死穴，三路才顶得住
    sort(allSame.begin(), allSame.end());
    cout << "是否已有序：" << (is_sorted(allSame.begin(), allSame.end()) ? "yes" : "no") << "\\n";
    vector<int> top = {5, 1, 9, 3, 7, 2, 8};
    partial_sort(top.begin(), top.begin() + 3, top.end());   // 前 3 名内部有序
    cout << "前 3 小：" << top[0] << " " << top[1] << " " << top[2] << "\\n";
    vector<int> med = {5, 1, 9, 3, 7, 2, 8};
    nth_element(med.begin(), med.begin() + 3, med.end());    // 只保证第 4 位定下来
    cout << "中位数附近：" << med[3] << "\\n";
    return 0;
}
// 反例比较器：写成 <= 会让 comp(x, x) 为真，破坏严格弱序
// 下面两行取消注释后，实测表现是越界访问甚至段错误，而不是「顺序有点乱」
// vector<int> bad(5000, 7);
// sort(bad.begin(), bad.end(), [](int x, int y) { return x <= y; });`,
      pit: "把 `return a <= b;` 当比较器塞进 `std::sort`：小样例上看起来毫无问题，元素大量相等时随机段错误。同族的两个错法同样致命——比较器里携带可变状态（比如引用了外部计数器或缓存），以及在浮点键上不加处理地用 `<`（`NaN` 与任何值比较都是 false，等价关系失去传递性）。三者的共同点是：后果是未定义行为，而不是「排得差一点」。",
      pit_en: "Feeding 'return a <= b;' to std::sort looks harmless on small input and segfaults once many elements tie. Two siblings are equally fatal: a comparator carrying mutable state (an outer counter, a cached field), and raw '<' over floating keys where NaN compares false against everything, destroying transitivity of equivalence. All three produce undefined behaviour, not merely a worse order.",
      ex: {
        q: "既然 `std::sort` 最坏也是 O(n log n)，为什么还要关心「快排会退化」？",
        a: "因为退化的不只是量级还有常数与栈深度：`std::sort` 靠「递归超限转堆排序」兜底，你手写的版本没有这道保险；更重要的是面试官要的是你能指出触发条件（有序 + 取端点当基准）和对策（随机化、三数取中、三路划分），这属于「知道自己在写什么」。",
        q_en: "If std::sort is O(n log n) even in the worst case, why should I still care that quicksort degrades?",
        a_en: "Because degradation costs more than the asymptote — constants and stack depth. std::sort has the heapsort fallback built in; your hand-written version has no such insurance. And interviewers want the trigger condition (sorted input plus an endpoint pivot) and the countermeasures (randomisation, median-of-three, three-way partitioning): it proves you know what you typed."
      }
    },

    "se3": {
      min: 12,
      summary: [
        "二分的唯一前提是单调，不是「有个数组」：只要能写出一个随位置**先假后真**（或先真后假）的谓词 p，就能二分——这正是 `lower_bound` 既能查数组、也能查「答案空间」的原因，也是为什么「未排序的数组」根本不该出现在二分的话题里。",
        "区间开闭必须从头配套到尾：闭区间 [lo,hi] 配 `while (lo <= hi)` 与 `hi = mid - 1`；半开区间 [lo,hi) 配 `while (lo < hi)` 与 `hi = mid`。两套都正确，混用必错——选定一套写熟，考场上不再临场推导边界。",
        "`mid = lo + (hi - lo) / 2` 防的是 `lo + hi` 溢出：两个 1.5×10⁹ 的下标相加超过 int 上限变成负数，索引立刻非法；用 `size_t` 则回绕成天文数字。写 `(lo+hi)/2` 在小学数据上永远「看起来对」，这是最典型的潜伏型 bug——Google 的 Java 库那个错存在了九年才被修，不是段子。",
        "边界更新只有一个依据：mid 已被证明不是答案，才敢跳过它。`a[mid] < x` 时写 `lo = mid + 1` 合法；若写 `lo = mid`，当区间只剩两个元素时 `mid == lo`，什么都不改变 → 死循环。反过来，「会不会死循环」可以压成一句自查：每一轮区间长度是否严格变小。",
        "把语义统一成 lower_bound / upper_bound 一对就够：前者是第一个 ≥ x 的位置、后者是第一个 > x 的位置，于是「等于 x 的区间」是 [lower, upper)、个数是 `upper - lower`、「最后一个 ≤ x」就是 `upper_bound` 的前一个。别再背第三、第四套模板，那正是混淆的来源。",
        "二分答案（最小化最大值、容量类问题）是三个条件的合题：答案区间能圈出来（下界取最大单件、上界取总和这类粗估）、谓词单调（「运力越大越可行」）、谓词可在 O(n) 内算出（一次贪心或模拟）。总代价 O(n log 值域)——注意它相对「枚举答案」省下来的是值域的对数，不是 n 的对数。",
        "两类高频变体值得单记：旋转数组靠「比较 mid 与端点判断哪一半有序」再决定进哪半（前提是无重复元素，有重复时最坏退化到 O(n)）；峰值/局部最小只需局部信息 `a[mid] < a[mid+1]` 就能定方向，连全局有序都不要求——这是「二分的本质是单调谓词」最干净的例证。",
        "浮点二分少了整数边界的凶险，但多了收敛问题：判据用「固定循环 60~100 次」而不是 `while (hi - lo > 1e-6)`（前者次数可控，后者可能被舍入卡住），并记住 double 只有约 15~16 位有效数字。用 STL 之前先 `is_sorted` 自检——二分在乱序数组上不会报错，只会安静地给你一个错答案。衔接 se4：这里靠单调性拿最优，下一节靠「每步不反悔」与「枚举 + 剪枝」拿最优。"
      ],
      summary_en: [
        "Monotonicity, not 'an array', is the sole precondition of binary search: if you can state a predicate over positions that goes false-then-true (or true-then-false), you can bisect — that is why lower_bound works on arrays and on answer spaces alike, and why an unsorted array should never come up in a binary-search discussion at all.",
        "The interval convention must survive from the first line to the last: closed [lo,hi] pairs with 'while (lo <= hi)' and 'hi = mid - 1'; half-open [lo,hi) pairs with 'while (lo < hi)' and 'hi = mid'. Both are correct, mixing them never is. Pick one, drill it, and stop re-deriving bounds under exam pressure.",
        "mid = lo + (hi - lo) / 2 guards against overflow of lo + hi: two indices near 1.5e9 sum past INT_MAX, turn negative and index garbage; with size_t they wrap into an absurd number. '(lo+hi)/2' looks permanently right on toy data, which is the signature of a latent bug — Google really did ship a broken Java binary search for nine years.",
        "There is exactly one licence for skipping an element: mid has been proved not to be the answer. 'lo = mid + 1' under a[mid] < x is legal; 'lo = mid' means that with two elements left mid equals lo and nothing changes — infinite loop. So the whole termination question collapses to: does the interval length strictly shrink every round?",
        "Collapse the semantics onto the pair lower_bound / upper_bound: the first position >= x and the first position > x, so the block equal to x is [lower, upper), its count is upper - lower, and 'the last element <= x' is simply the position before upper_bound. Two functions suffice; memorising a third or fourth template is exactly where the confusion comes from.",
        "Bisecting the answer (minimise a maximum, capacity and aggressive-cows style) is the conjunction of three facts: the answer range can be bounded (lower bound = largest single item, upper bound = the total), the feasibility predicate is monotone ('more capacity can only help'), and it evaluates in O(n) with one greedy pass or simulation. The cost is O(n log range) — the saving versus enumerating answers is a logarithm of the value range, not of n.",
        "Two variant families deserve their own notes: rotated arrays are handled by comparing mid with an endpoint to see which half is sorted and descending into that half (with distinct elements; duplicates degrade the worst case to O(n)); peaks and local minima need only local information — 'a[mid] < a[mid+1]' suffices to choose a direction and global order is not even required, the cleanest evidence that binary search is about monotone predicates.",
        "Floating-point bisection drops the integer boundary hazard but adds a convergence one: loop a fixed 60-100 times instead of 'while (hi - lo > 1e-6)' (the former is bounded, the latter can stall on rounding), and remember a double carries about 15-16 significant digits. Assert is_sorted before using the STL algorithm — binary search over an unsorted range raises no error, it just quietly returns a wrong index. Bridge to se4: this lesson exploits monotonicity; the next grabs optima by never reconsidering a step, or by enumerating with pruning."
      ],
      code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 半开区间 [lo, hi)：while (lo < hi) 配 hi = mid，返回第一个 >= x 的下标
int lowerBound(const vector<int>& a, int x) {
    int lo = 0, hi = (int)a.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;        // 防 lo + hi 溢出
        if (a[mid] < x) lo = mid + 1;        // mid 已排除，才敢跳过
        else hi = mid;                       // mid 有可能就是答案，留着
    }
    return lo;                               // 可能等于 size()，表示全都小于 x
}

// 二分答案的谓词：运力 cap 能否在 days 天内运完
bool canShip(const vector<int>& w, int days, long long cap) {
    long long load = 0;
    int used = 1;
    for (int x : w) {
        if (x > cap) return false;
        if (load + x > cap) { ++used; load = x; }    // 超载就换一天
        else load += x;
    }
    return used <= days;
}

int minCapacity(const vector<int>& w, int days) {
    long long lo = *max_element(w.begin(), w.end());  // 下界：最重的那一件
    long long hi = 0;
    for (int x : w) hi += x;                          // 上界：一天全部运走
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;
        if (canShip(w, days, mid)) hi = mid;          // 可行：往更小的运力再试
        else lo = mid + 1;                            // 不可行：mid 及以下全部否
    }
    return (int)lo;
}

int main() {
    vector<int> a = {1, 3, 3, 3, 5, 7};
    cout << "手写 lower_bound(3) = " << lowerBound(a, 3) << "\\n";
    auto lb = lower_bound(a.begin(), a.end(), 3);
    auto ub = upper_bound(a.begin(), a.end(), 3);
    cout << "3 的个数 = " << (ub - lb) << "\\n";
    vector<int> w = {5, 1, 9, 10, 20, 1};
    cout << "最小运力 = " << minCapacity(w, 3) << "\\n";
    cout << "与 std 一致：" << ((*lower_bound(a.begin(), a.end(), 4)) == 5 ? "yes" : "no") << "\\n";
    return 0;
}`,
      pit: "`while (lo <= hi)` 配了半开写法的 `hi = mid`：区间缩到 `lo == hi` 时 `mid == lo`，赋值什么都没改，程序原地打转到超时。这类 bug 的恶心之处在于它不崩不报错、而样例只有 3 个元素时可能永远测不出来——所以二分写完必须固定测三种输入：空数组、目标比所有元素都小或都大、目标恰好等于首尾元素。",
      pit_en: "Pairing 'while (lo <= hi)' with the half-open update 'hi = mid' stalls the instant lo == hi: mid equals lo, the assignment changes nothing and you spin until timeout. The nastiness is that it neither crashes nor complains, and a three-element sample may never reach the stall — so after any binary search, always test the empty range, a target below and above everything, and a target exactly at the first or last element.",
      ex: {
        q: "为什么「二分答案」必须先证明谓词单调，光「能算出可行性」不够？",
        a: "因为二分每一步都在丢弃一半：只有当「mid 可行 ⇒ 所有比它大的也可行」（或反向）成立时，被丢掉的那一半才保证不含更优解；谓词一旦有起伏，二分给出的只是某个假的边界，与最优毫无关系。",
        q_en: "For bisecting the answer, why is proving the predicate monotone mandatory — why is 'I can test feasibility' not enough?",
        a_en: "Because every step discards half the range: that half is safe to drop only if 'mid feasible implies everything larger is feasible' (or the mirror) holds. A predicate that wobbles turns the result into an arbitrary boundary with no claim to optimality."
      }
    },

    "se4": {
      min: 12,
      summary: [
        "贪心 = 每步取局部最优并且永不反悔。它成立要证两件事：贪心选择性质（存在某个最优解包含当前这一步）与最优子结构（选完之后剩下的子问题同类型）；通用证明套路是**交换论证**——取任意最优解，把它第一个与你不一致的选择换成你的贪心选择，证明目标值不变差，于是你这一步「不亏」。",
        "贪心最容易翻在「直觉非常像对」：面值 {1,5,11} 凑 15，先拿 11 再补 4 张 1 要 5 枚，而 3 张 5 才是最优。硬币体系要满足 canonical 性质这种贪心才成立（1/2/5/10/20/50 恰好满足）。所以纪律是：先花两分钟构造反例、或与暴力对拍，再提交贪心，而不是提交完再想。",
        "很多贪心里「排序」本身就是算法的一部分：区间调度取「最早结束且不冲突」的区间，必须按**右端点**升序——按左端点会选到拖延的，按长度也不对；为什么右端点对：结束越早，留给后面的剩余空间越大。这一句交换论证是面试标准题，「最少箭射气球」「会议室」都是同一副骨架。",
        "贪心的两个常见外挂：排序（先给决策定序，O(n log n)）和堆（当「当前最优」会随新元素插入而改变时用堆维护——Top-K、合并 K 个有序链表、任务调度、哈夫曼编码）。贪心 + 堆通常 O(n log k)，而「什么时候该换堆」的信号很明确：你需要边插入边取极值。",
        "回溯 = 在决策树上做 DFS，三个动作必须成对出现：选择 → 递归 → **撤销**。撤销写漏一半是最高频 bug：path 忘了 `pop_back`、`used[]` 忘了复位、当前和与计数没退回，症状统一是「第二个答案里混进了第一个答案的元素」，而第一组样例往往还是对的。",
        "子集 / 组合 / 排列三大母题的差别只有两处：是否用 `start` 参数保证「不回选」（子集、组合），还是用 `used[]` 允许每层任选（排列）；以及在哪个时机收答案（每个节点都收 / 深度达到 k 才收 / 满足条件才收）。把这两处想透，模板就不需要背。",
        "剪枝决定回溯能不能过，而它只能剪「一定不是解」的分支：可行性剪枝（当前和已超 target 就 return，数组排序后可以用 `break` 直接终止本层）、冗余剪枝（同一层不重复选同值——先排序再 `if (i > start && a[i] == a[i-1]) continue;`）、最优性剪枝（已有解比当前分支的下界更优就停）。剪枝写错不会报错，只会「少几个答案」，是最难查的一类。",
        "记忆化与回溯的分界：子问题只由参数决定、无后效性，才谈得上缓存（状态可哈希时 `unordered_map<state,int>`），把指数搜索压成多项式；带「当前路径」语义的状态（N 皇后、全排列）在搜索树上几乎不重复，加缓存只会更慢。先估状态数（2ⁿ·n、n!）再决定用哪件武器——下一节 se5 把排序家族和这些思想收成一张选型表。"
      ],
      summary_en: [
        "Greedy means taking the locally best step and never reconsidering. Proving it needs two facts: the greedy-choice property (some optimal solution contains your step) and optimal substructure (what remains is the same kind of problem). The standard proof is an exchange argument: take any optimal solution, replace its first differing choice with yours, and show the objective does not worsen — so your step costs nothing.",
        "Greedy fails exactly where the intuition looks strongest: making 15 from coins {1,5,11}, grabbing 11 first costs five coins while three 5s are optimal. Such greed is valid only for canonical coin systems (1/2/5/10/20/50 happen to qualify). The discipline is to spend two minutes hunting a counterexample or fuzzing against brute force before committing, not after.",
        "For many greedy algorithms sorting is part of the algorithm: activity selection takes the earliest-finishing compatible interval, which demands ascending order by right endpoint — by left endpoint you can pick a long blocker, by length is wrong too. Why the right endpoint? Finishing earlier leaves strictly more room behind it, and that single sentence is the classic interview exchange argument. Minimum arrows to burst balloons and the meeting-rooms family share the skeleton.",
        "Greedy has two usual attachments: sorting (fix the order in which decisions are made, O(n log n)) and a heap (when 'the current best' shifts as new items arrive — Top-K, merging k sorted lists, task scheduling, Huffman coding). Greedy plus heap typically costs O(n log k), and the signal to reach for the heap is unambiguous: you need the extreme value while still inserting.",
        "Backtracking is DFS on a decision tree where three actions come in pairs: choose, recurse, undo. A half-missing undo is the most frequent bug — no pop_back on the path, used[] never reset, running sum and counters not rolled back — and the symptom is always identical: the second answer contains leftovers from the first, while the first sample still passes.",
        "The three flagship problems (subsets, combinations, permutations) differ in only two places: whether a start parameter forbids re-picking (subsets, combinations) or a used[] array lets each level choose freely (permutations); and when you collect an answer (at every node, only at depth k, or only once a condition holds). Understand those two knobs and the template stops being something to memorise.",
        "Pruning decides whether a backtracking solution passes, and it may only cut branches that cannot be solutions: feasibility pruning (return once the sum overshoots target, or break at the first such element once the array is sorted), redundancy pruning (skip equal values on the same level — sort first, then 'if (i > start && a[i] == a[i-1]) continue;'), and optimality pruning (stop when an incumbent solution already beats the branch's bound). A wrong prune raises no error, it silently loses answers, which is the hardest bug class there is.",
        "The boundary between memoisation and backtracking: cache only when the subproblem is determined by its parameters alone (no after-effect) and the state is hashable — an unordered_map keyed by state turns exponential search into polynomial. States carrying path semantics (N-queens, permutations) barely repeat, so a cache only slows you down. Estimate the state count (2^n * n, n!) before choosing a weapon; se5 collects the sorting family and all of these ideas onto one sheet."
      ],
      code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
#include <utility>
using namespace std;

// 贪心：按右端点升序，每次取「最早结束且不冲突」的区间
int maxActivities(vector<pair<int,int>> seg) {
    sort(seg.begin(), seg.end(),
         [](const pair<int,int>& x, const pair<int,int>& y) { return x.second < y.second; });
    int cnt = 0, lastEnd = INT_MIN;
    for (auto& s : seg)
        if (s.first >= lastEnd) { ++cnt; lastEnd = s.second; }   // 选了就不反悔
    return cnt;
}

vector<vector<int>> ans;
vector<int> path;

// 回溯三件套：选择、递归、撤销；两处剪枝各挡一类无效分支
void backtrack(const vector<int>& cand, int start, int target) {
    if (target == 0) { ans.push_back(path); return; }            // 收答案的时机
    for (int i = start; i < (int)cand.size(); ++i) {
        if (cand[i] > target) break;                             // 已排序：后面的只会更大
        if (i > start && cand[i] == cand[i - 1]) continue;       // 同一层不重复选同值
        path.push_back(cand[i]);                                 // 选择
        backtrack(cand, i + 1, target - cand[i]);                // 每个数只用一次：写 i + 1
        path.pop_back();                                         // 撤销：与选择严格成对
    }
}

int main() {
    vector<pair<int,int>> seg = {{1,3},{2,4},{3,5},{0,6},{5,7},{8,9}};
    cout << "最多能安排的活动数 = " << maxActivities(seg) << "\\n";
    vector<int> cand = {10, 1, 2, 7, 1, 2, 3};
    sort(cand.begin(), cand.end());               // 去重剪枝的前提是先排序
    backtrack(cand, 0, 8);
    cout << "凑出 8 的组合数 = " << ans.size() << "\\n";
    for (auto& v : ans) {
        for (int x : v) cout << x << " ";
        cout << "\\n";
    }
    return 0;
}`,
      pit: "剪枝的位置写对了、条件写松了一格：`if (cand[i] > target) break;` 写成 `>=` 就把「恰好等于 target」这条合法解剪掉了；`if (i > start && cand[i] == cand[i-1])` 里的 `start` 若写成 `i-1`，比较的对象就变了，去重直接失效或误杀合法组合。这两处都是「样例照样过、评测必挂」的量级，所以务必专门用「含重复元素 + 目标恰好等于某个元素」的用例测一遍。",
      pit_en: "The prune sits in the right place but the condition is one notch loose: 'if (cand[i] > target) break;' written as '>=' chops the perfectly legal branch that exactly hits target, and in the dedup test using i-1 instead of start changes what is being compared, so duplicates survive or valid combinations get killed. Both pass samples and die on the judge, so always run a case with duplicate values where the target equals one of them.",
      ex: {
        q: "回溯和 gd3 的 DFS 到底是什么关系？为什么多出来的「撤销」比代码本身更值得警惕？",
        a: "回溯就是 DFS 作用在决策树上，多出的两个动作是「做选择」和「收回选择」；撤销之所以关键，是因为决策树的兄弟分支共享同一份可变状态（path、used、当前和），不撤销就等于让上一个分支的后遗症污染下一个分支——这也是它比纯 DFS 更容易写错的根本原因。",
        q_en: "What exactly is backtracking's relation to the DFS of gd3, and why is the extra undo more dangerous than the rest of the code?",
        a_en: "Backtracking is DFS applied to a decision tree with two extra moves: make a choice and take it back. The undo matters because sibling branches share one mutable state (path, used, running sum); skipping it lets one branch leave residue in the next — which is precisely why backtracking misleads more often than plain DFS."
      }
    },

    "se5": {
      title: "综合重构：排序与算法思想的选型清单",
      title_en: "Synthesis: A Selection Sheet for Sorting and Algorithmic Ideas",
      min: 15,
      target: "面对一组数据和一个需求，能在半分钟内说出用哪种排序/查找/决策思想、复杂度、额外空间与稳定性，并说清不选另一方案的代价。",
      target_en: "Given data and a requirement, state within half a minute which sorting, searching or decision idea to use — time, extra space, stability — and what you pay for rejecting the alternative.",
      summary: [
        "先问数据画像再选算法，六问固定：规模 n 多大、是否近乎有序、是否大量重复、要不要稳定、内存是否受限、是不是只要前 k 个。这六问答完，方案通常唯一——「用哪种排序」从来不是审美问题，而是约束求解。",
        "比较排序的 Ω(n log n) 下界直觉：任何只靠两两比较的算法都能画成一棵决策树，要区分 n 个元素的所有可能结果就得有至少 n! 个叶子，而高 h 的二叉树最多 2^h 个叶子，于是 h ≥ log₂(n!) = Θ(n log n)（Stirling 近似）。快排、归并、堆排已经贴着这条线；想在渐近意义上更快，必须换掉「比较」这个信息模型。",
        "突破下界的办法是「拿键当下标」：计数排序 O(n+k)（值域 k 不大，配前缀和与逆序写回可做成稳定）、基数排序 O(d·(n+k))（按位或按字符做 d 轮**稳定**的计数排序，适合定长整数与等长字符串）、桶排序平均 O(n)（假设分布较均匀，撒进 m 个桶、桶内各自排、最后顺序收集）。共同前提是「不做比较」，共同代价是值域、分布假设或额外空间——三样都拿不到，就回到 O(n log n)。",
        "「只要前 k 个」的三选一：全排序 O(n log n)（顺手把整个数组排好了，但 n=10⁷、k=10 时纯属浪费）；`std::partial_sort` 用堆做到 O(n log k)，交出前 k 个**有序**的元素；`std::nth_element` 平均 O(n)，只保证第 k 位是最终值、左边都不大于它。Top-K 与中位数走 nth_element，需要有序前缀走 partial_sort，规模未知或流式数据走手写堆（`priority_queue`），因为堆能边读边维护。",
        "大 O 之外的真实瓶颈要一并计入：内存放不下只能外部排序（多路归并 + 顺序 IO，这是归并的主场）；数据近乎有序时 `std::sort` 未必快过插入排序；键是定长整数时基数排序常能碾压通用比较排序；同一种 O(n log n) 还能用并行策略摊到多核。选型看数据画像，不看名气，也不看「书上说快排最快」。",
        "把算法思想整理成一张可填的表：分治（子问题相互独立：归并、快排、最近点对）、贪心（局部最优 + 交换论证）、DP（重叠子问题 + 最优子结构，见 sdp）、回溯（决策树 + 剪枝）、二分（单调谓词 + 答案空间）、图与搜索（gd5 的建模三问与最短路四选一）。「这题该用什么思想」就是在填这张表，判据永远是三问：会不会反悔、有没有重复子问题、有没有单调性可用。",
        "四类高频翻车复盘：比较器写 `<=`（未定义行为、随机段错误）、二分区间开闭混用（不崩、纯 TLE）、回溯忘撤销（答案互相污染、第一组样例还特别像对）、贪心没证明（样例过了但答案错）。它们的共同点是「编译器一声不吭、小样例一切正常」，所以唯一可靠的防线是固定的反例集与自测清单。",
        "自测方法与去向：每个算法写完都用五组输入验一遍——空数组、单元素、全部相等、已排序、逆序；能说清「复杂度 / 额外空间 / 稳定性」三件事才算过关。dsg 与 dsa 到此收官，接下来的 eng 会把这两章的手写算法放进 CMake、单元测试与多线程的工程环境里——「我这儿能跑」和「别人敢用」是两件事。"
      ],
      summary_en: [
        "Profile the data before choosing an algorithm, with six fixed questions: how large is n, is it nearly sorted, are there many duplicates, must it be stable, is memory tight, and do you only need the top k. Answer them and the choice is usually forced — 'which sort' is constraint solving, never taste.",
        "The intuition behind the Omega(n log n) bound for comparison sorting: any algorithm that only compares pairs is a decision tree, and to distinguish all possible outcomes for n items the tree needs at least n! leaves, while a tree of height h has at most 2^h leaves, so h >= log2(n!) = Theta(n log n) by Stirling. Quicksort, mergesort and heapsort already hug that line; to beat it asymptotically you must change the information model away from comparison.",
        "Escaping the bound means using the key as an index: counting sort O(n+k) (small value range, stable if you combine the prefix sums with a backwards write), radix sort O(d*(n+k)) (d stable counting sorts over digits or characters, ideal for fixed-length integers and equal-length strings), bucket sort averaging O(n) (a reasonably uniform distribution, scatter into m buckets, sort inside each, collect in order). All of them trade 'no comparisons' for value range, a distribution assumption or extra space — if none is available, O(n log n) is your ceiling.",
        "Three options when only k items are wanted: a full sort O(n log n) (nice if you wanted everything ordered, wasteful at n = 10^7 with k = 10); std::partial_sort, heap-based at O(n log k), producing the k smallest in sorted order; std::nth_element, averaging O(n), fixing only position k with everything to its left no larger. Top-K and medians take nth_element, an ordered prefix takes partial_sort, and streaming data of unknown size takes a hand-rolled priority_queue because a heap is maintained as items arrive.",
        "Count the bottlenecks Big-O ignores: data larger than RAM forces external sorting, which is multi-way merging with sequential I/O — mergesort's home turf; on nearly sorted input std::sort is not guaranteed to beat insertion sort; on fixed-length integer keys radix sort routinely crushes general comparison sorts; and the same O(n log n) can be spread across cores with execution policies. Choose by data profile, not by reputation or by what the textbook claims is fastest.",
        "Keep the ideas as a form to fill in: divide and conquer (independent subproblems — mergesort, quicksort, closest pair), greedy (local optimum plus an exchange argument), DP (overlapping subproblems plus optimal substructure, see sdp), backtracking (decision tree plus pruning), binary search (monotone predicate over an answer space), graphs and search (gd5's three modelling questions and the four-way shortest-path table). 'Which idea fits' is just filling the table, and the tests are always three: must I reconsider, do subproblems repeat, is there monotonicity to exploit.",
        "Retrospective on the four recurring failures: a comparator written with <= (undefined behaviour, random segfault), mismatched interval conventions in binary search (no crash, pure TLE), a missing undo in backtracking (answers leak into each other while the first sample looks great), and greedy without proof (passes samples, wrong in general). They share one trait — the compiler says nothing and small inputs behave — so a fixed counterexample set is the only real defence.",
        "Self-test and where next: run every algorithm against five inputs — empty, single element, all equal, already sorted, reverse sorted — and only call it done when you can state time, extra space and stability in one breath. dsg and dsa close here; eng then drops these hand-written algorithms into CMake, unit tests and multithreading, because 'it runs on my machine' and 'others dare to use it' are different achievements."
      ],
      code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 计数排序：值域 k 远小于数据量时，拿「值」当下标，绕开 n log n 下界
vector<int> countingSort(const vector<int>& a, int k) {
    vector<int> cnt(k + 1, 0);
    for (int x : a) ++cnt[x];                          // 第一遍：统计出现次数
    for (int i = 1; i <= k; ++i) cnt[i] += cnt[i - 1]; // 前缀和＝该值的写入上界
    vector<int> out(a.size());
    for (auto it = a.rbegin(); it != a.rend(); ++it)   // 逆序写回才稳定
        out[--cnt[*it]] = *it;
    return out;
}

// 基数排序（LSD）：d 轮「必须稳定」的计数排序，前提是键定长且能按位切开
void radixSort(vector<int>& a) {
    if (a.empty()) return;
    int mx = *max_element(a.begin(), a.end());
    for (long long exp = 1; mx / exp > 0; exp *= 10) {
        vector<int> cnt(10, 0), out(a.size());
        for (int x : a) ++cnt[(x / exp) % 10];
        for (int i = 1; i < 10; ++i) cnt[i] += cnt[i - 1];
        for (auto it = a.rbegin(); it != a.rend(); ++it)
            out[--cnt[(*it / exp) % 10]] = *it;
        a.swap(out);                                   // 这一轮的结果是下一轮的输入
    }
}

int main() {
    vector<int> a = {4, 0, 2, 1, 4, 3, 0};
    for (int x : countingSort(a, 4)) cout << x << " ";
    cout << "\\n";
    vector<int> b = {329, 457, 657, 839, 436, 720};
    radixSort(b);
    for (int x : b) cout << x << " ";
    cout << "\\n";
    vector<int> sel = {9, 2, 7, 1, 8, 3, 6, 5, 4};
    nth_element(sel.begin(), sel.begin() + 2, sel.end());    // 平均线性：只定第 3 位
    cout << "第 3 小 = " << sel[2] << "\\n";
    vector<int> pre = {9, 2, 7, 1, 8, 3, 6, 5, 4};
    partial_sort(pre.begin(), pre.begin() + 3, pre.end());   // 前 3 个内部有序
    for (int i = 0; i < 3; ++i) cout << pre[i] << " ";
    cout << "\\n";
    return 0;
}`,
      pit: "把计数排序当成「更快的排序」到处用：值域是 10⁹ 的整数、或者键是浮点数与字符串时，`cnt` 数组要么开不出来要么先 MLE，负数还会当场越界写内存。正确顺序是先问「键是不是小整数」：不是就离散化（排序 + 去重 + `lower_bound` 映射回下标，代价回到 O(n log n)），或者改判「键是否定长整数」再考虑基数排序——非比较排序的前提从来不是「我懒得写快排」。",
      pit_en: "Using counting sort everywhere as 'the faster one': with keys up to 10^9, or floats and strings as keys, the cnt array either cannot be allocated or MLEs first, and negative values write out of bounds. Ask first whether the keys are small integers; if not, discretise (sort, deduplicate, map back with lower_bound, paying O(n log n) again) or check for fixed-length integers before touching radix sort. The precondition of a non-comparison sort is never 'I could not be bothered to write quicksort'.",
      ex: {
        q: "为什么外部排序只能走归并思路，快排在这里就不合适？",
        a: "因为数据不在内存里，而快排需要对整个区间做随机访问与原地交换；归并只要求「两段各自有序、顺序读出、顺序写出」，天然契合多路归并磁盘块与顺序 IO，所以「内存里把各段排好、到外面合并」是唯一现实的路径。",
        q_en: "Why must external sorting follow the mergesort route, and why does quicksort not fit?",
        a_en: "Because the data is not resident in memory, while quicksort needs random access and in-place swaps over the whole range. Merging only asks for two ordered runs read sequentially and written sequentially, which matches k-way merging of disk blocks and sequential I/O — so 'sort runs in RAM, merge outside' is the only workable shape."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择 / 判断 / 填空混排） ---------- */
  quizAdd: {
    dsg: [
      {
        q: "V = 10⁵、E = 2×10⁵ 的带权有向图（权非负），求单源最短路，下列哪种组合最合适？",
        o: ["邻接矩阵 + BFS", "邻接表 + 堆优化 Dijkstra", "边表 + Bellman-Ford", "邻接矩阵 + Floyd"],
        a: 1,
        why: "图稀疏（E 与 V 同量级）就用邻接表；权非负的有向图用 Dijkstra，堆优化后是 O((V+E)log V)。BFS 只适用于无权图；Bellman-Ford 的 O(VE) 约 2×10¹⁰ 太慢；矩阵与 Floyd 是 O(V²)/O(V³)，光建图就爆内存。",
        q_en: "For a weighted directed graph with V = 10^5 and E = 2*10^5 and non-negative weights, which combination fits single-source shortest paths?",
        o_en: ["Adjacency matrix + BFS", "Adjacency list + heap-optimised Dijkstra", "Edge list + Bellman-Ford", "Adjacency matrix + Floyd"],
        why_en: "Sparsity (E grows with V) calls for an adjacency list, and non-negative weights call for Dijkstra: O((V+E) log V) with a heap. BFS handles unweighted graphs only; Bellman-Ford's O(VE) is about 2*10^10 steps; a matrix or Floyd costs O(V^2)/O(V^3) and cannot even be built."
      },
      {
        q: "BFS 里把「标记 visited」放在入队时而不是出队时，最主要的原因是？",
        o: ["出队时没有地方存标记", "保证每个点最多进队一次，队列规模被 O(V) 约束", "入队比出队操作快", "只有这样才拿得到最短距离"],
        a: 1,
        why: "入队即标记把重复入队挡在门口，队列大小与总时间都被 O(V) 约束；出队才标记时，高入度点会被每个邻居各塞一次，队列涨到 O(E) 以上，dist 还可能被覆盖成更差的值。",
        q_en: "Why is the visited mark in BFS applied at enqueue time rather than at dequeue time?",
        o_en: ["There is nowhere to store the mark at dequeue time", "It guarantees each vertex enters the queue once, bounding the queue at O(V)", "Enqueueing is faster than dequeuing", "Only then can you obtain the shortest distance"],
        why_en: "Marking on enqueue stops duplicates at the door, so queue size and total time stay within O(V). Marking on dequeue lets a high in-degree vertex be pushed by every neighbour, ballooning the queue past O(E) while dist gets overwritten with worse values."
      },
      {
        q: "判断：数无向图的连通分量时，并查集和逐个起点的 DFS/BFS 结果一样，所以在「不断加边并随时询问连通性」的场景下两者也没有区别。",
        type: "judge", a: 1,
        why: "结果确实一样，代价完全不同：并查集每次询问约 O(α(V))、天然支持在线加边，而每问一次就跑一趟遍历要付 O(V+E)。场景一变结论就变，所以「没有区别」是错的。",
        q_en: "True or false: counting connected components with union-find and with per-vertex DFS/BFS sweeps give the same answer, so for 'keep adding edges and answer connectivity at any time' the two are also equivalent.",
        why_en: "False. The answers agree but the costs do not: union-find answers a query in about O(alpha(V)) and accepts online insertions, while a traversal per query pays O(V+E) every time. Change the setting and the verdict changes, so 'equivalent' is wrong."
      },
      {
        q: "Kahn 拓扑排序结束时，若弹出的点数为 cnt，则当 ______ 时说明图中有环（填 cnt 与 V 的关系）。",
        type: "fill", ans: ["cnt < V", "cnt<V", "cnt < n", "弹出数小于总点数"],
        why: "环上的点入度永远减不到 0、进不了队列，所以弹出数必然小于顶点总数；结束时入度仍为正的那些点就是被环卡住的。",
        q_en: "In Kahn's algorithm, if cnt is the number of popped vertices, then ______ means the graph contains a cycle (fill in a relation between cnt and V).",
        why_en: "Vertices on a cycle never see their in-degree reach 0, so they never enter the queue; the popped count must fall short of V, and exactly the vertices still holding positive in-degree are the trapped ones."
      }
    ],
    dsa: [
      {
        q: "n = 10⁷，只要求出最小的 10 个数（不关心它们之间的顺序），代价最低的做法是？",
        o: ["std::sort 之后取前 10 个", "std::nth_element 到 begin()+10", "std::partial_sort 到 begin()+10", "冒泡排序跑 10 轮"],
        a: 1,
        why: "nth_element 平均 O(n)，且不要求前 k 个内部有序，恰好合题意；partial_sort 是 O(n log k)、sort 是 O(n log n)，10 轮冒泡是 O(10n) 且常数明显更大。",
        q_en: "With n = 10^7 you need only the 10 smallest values, in no particular order. Which is cheapest?",
        o_en: ["std::sort then take the first 10", "std::nth_element to begin()+10", "std::partial_sort to begin()+10", "Ten rounds of bubble sort"],
        why_en: "nth_element averages O(n) and does not order the first k, which matches the requirement exactly; partial_sort costs O(n log k), sort costs O(n log n), and ten bubble rounds are O(10n) with a much worse constant."
      },
      {
        q: "把比较器写成 `return a <= b;`，最可能的后果是？",
        o: ["排序变成稳定的", "未定义行为，可能越界访问甚至段错误", "只是慢一些，结果仍正确", "编译期直接报错"],
        a: 1,
        why: "它违反了严格弱序要求的 comp(x,x) == false，标准库据此收缩区间的逻辑可能读到越界内存；编译器不会报错，数据量小的时候还可能一直「正常」，等到元素大量相等才崩。",
        q_en: "Writing the comparator as 'return a <= b;' most likely causes what?",
        o_en: ["The sort becomes stable", "Undefined behaviour, possibly out-of-bounds access or a segfault", "Only a slower sort with correct results", "A compile-time error"],
        why_en: "It breaks the strict-weak-ordering requirement comp(x, x) == false, so the library's interval shrinking can read past the buffer. Nothing fails to compile, small inputs may behave forever, and it collapses once many elements tie."
      },
      {
        q: "判断：基数排序比快速排序快，所以任何整数排序都应该优先用基数排序。",
        type: "judge", a: 1,
        why: "基数排序的前提是键能按位切开、位数 d 与进制 k 受控（O(d·(n+k))），并且要额外空间；d 很大（64 位随机整数按字节要 8 轮）或键分布极偏时它未必划算，还可能被缓存行为更好的比较排序反超。",
        q_en: "True or false: radix sort is faster than quicksort, so every integer sort should use radix sort.",
        why_en: "False. Radix sort is attractive only when keys split into digits and both d and k stay controlled (O(d*(n+k))) and extra space is available. With a large d (64-bit random keys need eight byte passes) or a lopsided distribution it can lose to a cache-friendly comparison sort."
      },
      {
        q: "只靠两两比较的排序，其比较次数下界是 Ω(______)（填关于 n 的表达式）。",
        type: "fill", ans: ["n log n", "nlogn", "n*log n", "n log_2 n"],
        why: "决策树必须有至少 n! 个叶子才能区分所有可能结果，而高 h 的树最多 2^h 个叶子，故 h ≥ log₂(n!) = Θ(n log n)。",
        q_en: "Any sort based purely on pairwise comparisons needs Omega(______) comparisons (fill in an expression in n).",
        why_en: "The decision tree needs at least n! leaves to separate all outcomes, and a tree of height h has at most 2^h leaves, so h >= log2(n!) = Theta(n log n)."
      }
    ]
  },

  /* ---------- 词典：dsg 6 条 + dsa 6 条，分类统一为「C++ 系统深入」 ---------- */
  terms: [
    { term: "邻接表", term_en: "Adjacency List", cat: "C++ 系统深入",
      short: "每个点存一份邻居容器，空间 O(V+E)，稀疏图的默认表示。",
      short_en: "Each vertex stores a container of neighbours; O(V+E) space and the default for sparse graphs.",
      detail: ["遍历一个点的邻居正好等于它的度数，所以一次完整遍历的总量是 O(V+E)。", "V 个 vector 各要一次堆分配；极稠密的图可改用扁平化布局（CSR）省掉指针追逐。"],
      detail_en: ["Scanning a vertex's neighbours costs exactly its degree, so one full traversal totals O(V+E).", "The V vectors each need a heap allocation; for very dense graphs a flattened layout (CSR) removes the pointer chasing."],
      vs: "邻接表按边数付钱，邻接矩阵按顶点数的平方付钱。",
      vs_en: "An adjacency list pays per edge; an adjacency matrix pays per vertex squared." },
    { term: "邻接矩阵", term_en: "Adjacency Matrix", cat: "C++ 系统深入",
      short: "用二维数组存两点之间有没有边、多重，查边 O(1)，空间 O(V²)。",
      short_en: "A 2D array holding whether a pair is adjacent and with what weight; edge tests are O(1), space is O(V^2).",
      detail: ["适合稠密小图、Floyd 这类点对算法，以及反复问「两点之间有没有边」的场景。", "无边必须用 INF 表示；把大矩阵开成函数内的局部数组会直接压爆栈。"],
      detail_en: ["It suits dense small graphs, all-pairs algorithms such as Floyd, and workloads that keep probing a given pair.", "Absent edges need an INF sentinel, and a large matrix on the call frame destroys the stack."],
      vs: "矩阵换来查边速度与规则内存，代价是空间与边数彻底无关。",
      vs_en: "The matrix buys fast edge tests and regular memory, at the price of space that ignores the edge count entirely." },
    { term: "入度与出度", term_en: "In-degree and Out-degree", cat: "C++ 系统深入",
      short: "有向图中指向 u 的边数是入度，u 指出去的是出度；拓扑排序由入度驱动。",
      short_en: "In a directed graph in-degree counts edges into u and out-degree edges out of u; topological sort is driven by in-degree.",
      detail: ["建边时 push_back 与 indeg[v]++ 必须成对出现，漏一个拓扑序就会提前停止。", "度数奇偶性还是判断欧拉路径是否存在的快速依据。"],
      detail_en: ["push_back and indeg[v]++ must always be written together; drop one and the topological order stops early.", "Degree parity is also the quick test for whether an Eulerian trail exists."],
      vs: "度数描述「连着多少条边」，入度额外描述了「被谁依赖」。",
      vs_en: "Degree counts connections; in-degree additionally counts who depends on you." },
    { term: "并查集", term_en: "Disjoint Set Union", cat: "C++ 系统深入",
      short: "维护「谁和谁一组」的结构，find 与 unite 两个操作，近似常数代价。",
      short_en: "A structure maintaining who belongs to which group via find and unite, at near-constant cost.",
      detail: ["擅长在线加边、判无向图是否有环、Kruskal 最小生成树与离线连通问题。", "它只回答同不同根，不回答路径长度，也不支持删边——删除要离线倒着处理。"],
      detail_en: ["It excels at online edge insertion, undirected cycle detection, Kruskal's spanning tree and offline connectivity.", "It answers only 'same root or not', never a distance, and it cannot delete edges, which forces offline backward processing."],
      vs: "并查集管「分组」，BFS/DFS 管「路径与层号」。",
      vs_en: "Union-find handles grouping; BFS and DFS handle paths and layer numbers." },
    { term: "路径压缩", term_en: "Path Compression", cat: "C++ 系统深入",
      short: "find 时把路上所有点直接挂到根上，让树在高处被拍扁。",
      short_en: "During find, every vertex on the path is re-parented onto the root, flattening the tree from the top.",
      detail: ["写成 p[x] = find(p[x]) 才是压缩；只写 return find(p[x]) 结果正确但没压缩，大量询问会 TLE。", "与按秩（或按大小）合并配合，均摊 O(α(V))，实践中就是常数。"],
      detail_en: ["The write-back p[x] = find(p[x]) is what compresses; returning find(p[x]) alone stays correct but never flattens, and many queries then time out.", "Combined with union by rank or size, the amortised cost is O(alpha(V)) — a constant in practice."],
      vs: "路径压缩在 find 时优化，按秩合并在 unite 时优化，两者互不替代。",
      vs_en: "Path compression optimises during find, union by rank during unite; neither substitutes for the other." },
    { term: "二分图", term_en: "Bipartite Graph", cat: "C++ 系统深入",
      short: "点能分成两组且组内无边，等价于图中不含奇环。",
      short_en: "Vertices split into two groups with no intra-group edge; equivalently, the graph contains no odd cycle.",
      detail: ["判定用双色 BFS 或 DFS：新点染 color[u]^1，撞到同色邻居即失败。", "冲突分组、比赛编排、配对类问题都会先翻译成这个判定。"],
      detail_en: ["Test it with two-colour BFS or DFS: paint each new vertex colour[u]^1 and fail on a neighbour of your own colour.", "Conflict grouping, tournament pairing and matching problems all translate into this test first."],
      vs: "判连通问「能不能到」，判二分问「能不能分成两组」，用的是同一套遍历。",
      vs_en: "Connectivity asks whether you can reach; bipartiteness asks whether you can split — one traversal, different bookkeeping." },
    { term: "三数取中", term_en: "Median-of-Three Pivot", cat: "C++ 系统深入",
      short: "用首、中、尾三个元素的中位数当基准，避开有序数据造成的退化。",
      short_en: "Using the median of the first, middle and last elements as pivot to dodge the sorted-input worst case.",
      detail: ["它不消除最坏情况，只是让最坏情况不再由输入决定。", "工业实现会在此基础上再加抽样或随机，并对等于基准的区间做三路划分。"],
      detail_en: ["It does not remove the worst case; it stops the input from selecting it.", "Production implementations add sampling or randomness on top, plus three-way partitioning for keys equal to the pivot."],
      vs: "随机取基准靠概率保证，三数取中靠有限次确定性比较。",
      vs_en: "A random pivot leans on probability; median-of-three leans on a small fixed number of comparisons." },
    { term: "比较排序下界", term_en: "Comparison-Sort Lower Bound", cat: "C++ 系统深入",
      short: "只靠两两比较的排序最坏需要 Ω(n log n) 次比较。",
      short_en: "Any sort relying purely on pairwise comparisons needs Omega(n log n) comparisons in the worst case.",
      detail: ["证明思路是决策树：至少 n! 个叶子，2^h ≥ n!，故 h ≥ log₂(n!)。", "想突破就要换信息模型——计数、基数、桶排序都不做比较。"],
      detail_en: ["The proof is a decision tree: at least n! leaves, so 2^h >= n! and hence h >= log2(n!).", "To break it you change the information model — counting, radix and bucket sorts never compare."],
      vs: "下界只约束「比较类」算法，不约束利用键结构的算法。",
      vs_en: "The bound constrains comparison algorithms only, never algorithms that exploit key structure." },
    { term: "非比较排序", term_en: "Non-comparison Sort", cat: "C++ 系统深入",
      short: "计数、基数、桶排序：拿键当下标或按位分发，绕开 O(n log n)。",
      short_en: "Counting, radix and bucket sorts: use the key as an index or distribute by digit, escaping O(n log n).",
      detail: ["三者分别要求值域小、键定长可切位、分布较均匀，并且都要额外空间。", "负数与浮点键要先映射，否则计数数组当场越界写内存。"],
      detail_en: ["They require a small value range, fixed-length splittable keys, or a reasonably uniform distribution respectively, and all need extra space.", "Negative and floating-point keys must be remapped first, or the count array is written out of bounds."],
      vs: "比较排序通用但受下界约束，非比较排序快但依赖键的形态。",
      vs_en: "Comparison sorts are general but bounded below; non-comparison sorts are fast but depend on the shape of the keys." },
    { term: "二分答案", term_en: "Binary Search on the Answer", cat: "C++ 系统深入",
      short: "把「求最优值」翻译成「在单调谓词上找第一个真的位置」。",
      short_en: "Casting 'find the optimum' as 'locate the first true position of a monotone predicate'.",
      detail: ["三个前提：答案区间可圈定、谓词单调、谓词能在可接受时间内算出。", "复杂度是「谓词代价 × log 值域」，省下来的是值域的对数，不是 n 的对数。"],
      detail_en: ["Three preconditions: a boundable answer range, a monotone predicate, and one you can evaluate in acceptable time.", "The cost is predicate cost times log(range); the saving is a logarithm of the value range, not of n."],
      vs: "普通二分找「元素在哪」，二分答案找「从哪开始可行」。",
      vs_en: "Plain binary search locates an element; bisecting the answer locates a feasibility boundary." },
    { term: "Top-K 选择", term_en: "Top-K Selection", cat: "C++ 系统深入",
      short: "只要最小的 k 个：nth_element 平均 O(n)，partial_sort O(n log k)。",
      short_en: "Needing only the k smallest: nth_element averages O(n), partial_sort costs O(n log k).",
      detail: ["nth_element 只保证第 k 位定下来，前 k 个内部无序，因此它不是排序。", "数据是流式的或 k 会变时，改用大小为 k 的堆边读边维护。"],
      detail_en: ["nth_element fixes only position k, leaving the first k unordered, so it is not a sort.", "For streaming input or a changing k, keep a heap of size k and maintain it as items arrive."],
      vs: "排序给全序，选择给一个分界点，堆给的是持续可取的极值。",
      vs_en: "Sorting yields a total order, selection one boundary, and a heap a repeatedly available extreme." },
    { term: "交换论证", term_en: "Exchange Argument", cat: "C++ 系统深入",
      short: "证明贪心正确的标准套路：把最优解换成贪心解，目标值不变差。",
      short_en: "The standard greedy proof: swap an optimal solution's choice for yours and show the objective does not worsen.",
      detail: ["区间调度按右端点排序就靠它——更早结束只会给后面留出更多空间。", "证不出来通常说明贪心本就是错的，例如面值 {1,5,11} 的找零。"],
      detail_en: ["Activity selection by right endpoint rests on it: finishing earlier can only leave more room behind.", "Failing to produce the argument usually means the greedy rule is wrong, as with the coin system {1,5,11}."],
      vs: "归纳法证明「整个算法对」，交换论证证明「这一步不亏」。",
      vs_en: "Induction proves the algorithm as a whole; the exchange argument proves one step costs nothing." }
  ],

  achievements: [
    { id: "graph_modeler", icon: "🕸️", name: "图题建模手", name_en: "Graph Modeller",
      desc: "完成 dsg · 图与搜索 全部课节", desc_en: "Finish every lesson of dsg Graphs & Search",
      check: ["dsg"] },
    { id: "sort_chooser", icon: "📊", name: "排序选型师", name_en: "Sort Chooser",
      desc: "完成 dsa · 排序与算法思想 全部课节", desc_en: "Finish every lesson of dsa Sorting & Algorithmic Ideas",
      check: ["dsa"] }
  ],

    codeComments: {
    "题目从 1 编号时，数组要开 V + 1": "when the problem numbers vertices from 1, size the arrays V + 1",
    "邻接表：空间 O(V + E)，稀疏图几乎唯一的选择": "Adjacency list: O(V + E) space, essentially the only choice for sparse graphs",
    "无向图漏了这一行，从 4 出发哪儿也到不了": "skip this line on an undirected graph and vertex 4 can reach nothing",
    "无边用无穷表示，绝不用 0": "no edge means INF, never 0",
    "重边只保留最小权：直接赋值会悄悄丢掉较短的那条": "parallel edges: keep the minimum weight, plain assignment drops the shorter one",
    "边表：Bellman-Ford 与 Kruskal 只要逐条扫描，不需要邻居关系": "Edge list: Bellman-Ford and Kruskal only sweep edges, no neighbour structure needed",
    "只遍历真实存在的边": "this visits only edges that really exist",
    "dist 兼职 visited：-1 表示没到过": "dist doubles as visited: -1 means never reached",
    "起点：先标记，再入队": "source: mark first, then enqueue",
    "方向数组放在循环外": "direction arrays hoisted out of the loop",
    "越界": "out of bounds",
    "是墙": "it is a wall",
    "已经排过层号": "layer number already assigned",
    "入队时就写死距离，出队再写会写重": "fix the distance on enqueue; rewriting it on dequeue overwrites it",
    "按层写法：一次弹一整层": "level-by-level style: pop one whole layer at a time",
    "先固定本层规模，否则循环永不结束": "freeze this layer's size first, or the loop never ends",
    "有向图判环：撞到 GRAY 说明回到了自己脚下这条链上": "Directed cycle test: hitting GRAY means you met your own ancestor chain",
    "往下走之前先标记": "mark before descending",
    "后向边：成环": "back edge: a cycle",
    "这条链走完了，指回它不算环": "this chain is finished, so pointing back at it is not a cycle",
    "无向图：0-1-2 与 3-4 两个分量，5 是孤点": "Undirected graph: components 0-1-2 and 3-4, plus the isolated vertex 5",
    "又一个没被到过的点＝新分量": "another vertex nobody reached = a new component",
    "入栈即标记：每个点最多进栈一次": "mark on push: each vertex enters the stack at most once",
    "有向图：0→1→2→0 成环，3→4→5 只是链": "Directed graph: 0-1-2-0 is a cycle, 3-4-5 is only a chain",
    "先修关系 u -> v：先上完 u 才有资格上 v": "prerequisite u -> v: finish u before v becomes available",
    "建表与加入度必须成对出现": "adjacency and in-degree must be updated together",
    "入度 0：没有任何前置": "in-degree 0: nothing must come first",
    "前置刚好清零才轮到它": "it is its turn only when the last prerequisite clears",
    "把上面某条边改成 5 -> 0 再试：order 只剩 5 个，剩下的点就是被环卡住的": "change one edge above to 5 -> 0: order keeps only 5 entries and the rest are trapped by the cycle",
    "并查集：按秩合并 + 路径压缩，问「两点连通吗」比跑一次 BFS 便宜得多": "Union-find with union by rank and path compression: far cheaper than a BFS for connectivity",
    "每个点先自成一派": "every vertex starts as its own set",
    "压缩：把整条链直接挂到根上": "compression: hang the whole chain directly on the root",
    "已在同组：再连一条边就是环": "already in one set: another edge makes a cycle",
    "双色 BFS：能染完就是二分图，撞到同色邻居说明存在奇环": "Two-colour BFS: fully colourable means bipartite; a same-colour neighbour means an odd cycle",
    "0-1-2 是三角形（奇环），再挂 1-3-5 与 2-4 两条腿": "0-1-2 is a triangle (odd cycle), with legs 1-3-5 and 2-4 attached",
    "多余的边数＝独立环的个数": "redundant edge count = number of independent cycles",
    "u < v：无向边只登记一次": "u < v: register each undirected edge only once",
    "插入排序：只在严格大于时后移，相等就停手 —— 于是稳定": "Insertion sort: shift only on strict greater and stop at equality, which is what makes it stable",
    "写 >= 就会破坏稳定性": "writing >= destroys stability",
    "没有这个标志，冒泡永远跑满 n^2": "without this flag bubble sort always burns the full n^2",
    "已经有序，提前收工": "already ordered, so quit early",
    "跨越相等元素：这一步让它不稳定": "swapping across equal elements: this step makes it unstable",
    "分数相同的记录：稳定排序必须让 B 在 D 前、A 在 C 前": "records tied on score: a stable sort must keep B before D and A before C",
    "三数取中：把「已排序数组」这种最坏输入拉回平均情况": "Median-of-three: pulls the sorted-input worst case back to average behaviour",
    "基准藏到右端，交给 Lomuto 去划分": "hide the pivot at the right end and let Lomuto partition",
    "只扫到 hi 之前：基准不参与扫描": "scan only up to hi: the pivot is not part of the sweep",
    "基准落到它最终的位置": "the pivot lands on its final index",
    "用循环处理较长一侧，栈深降到 O(log n)": "handle the longer side with a loop, keeping stack depth at O(log n)",
    "全相等：两路划分的死穴，三路才顶得住": "all equal: the death of two-way partitioning, only three-way copes",
    "前 3 名内部有序": "the first 3 come out sorted",
    "只保证第 4 位定下来": "guarantees only that position 4 is settled",
    "反例比较器：写成 <= 会让 comp(x, x) 为真，破坏严格弱序": "Counter-example comparator: <= makes comp(x, x) true and breaks strict weak ordering",
    "下面两行取消注释后，实测表现是越界访问甚至段错误，而不是「顺序有点乱」": "uncomment the next two lines and the measured result is out-of-bounds access or a segfault, not a slightly odd order",
    "半开区间 [lo, hi)：while (lo < hi) 配 hi = mid，返回第一个 >= x 的下标": "Half-open [lo, hi): while (lo < hi) with hi = mid returns the first index >= x",
    "防 lo + hi 溢出": "guards against lo + hi overflowing",
    "mid 已排除，才敢跳过": "mid is proved impossible, so it may be skipped",
    "mid 有可能就是答案，留着": "mid could still be the answer, so keep it",
    "可能等于 size()，表示全都小于 x": "may equal size(), meaning everything is smaller than x",
    "二分答案的谓词：运力 cap 能否在 days 天内运完": "Predicate for bisecting the answer: can capacity cap ship everything within days",
    "超载就换一天": "overflow the capacity and the load starts a new day",
    "下界：最重的那一件": "lower bound: the heaviest single item",
    "上界：一天全部运走": "upper bound: ship everything in one day",
    "可行：往更小的运力再试": "feasible: try an even smaller capacity",
    "不可行：mid 及以下全部否": "infeasible: mid and everything below it are ruled out",
    "贪心：按右端点升序，每次取「最早结束且不冲突」的区间": "Greedy: sort by right endpoint and always take the earliest finishing compatible interval",
    "选了就不反悔": "once taken, never reconsidered",
    "回溯三件套：选择、递归、撤销；两处剪枝各挡一类无效分支": "The backtracking trio choose / recurse / undo, with two prunes each blocking one kind of dead branch",
    "收答案的时机": "the moment an answer is collected",
    "已排序：后面的只会更大": "sorted already: everything later is only larger",
    "同一层不重复选同值": "never reuse an equal value on the same level",
    "选择": "choose",
    "每个数只用一次：写 i + 1": "each number used once: pass i + 1",
    "撤销：与选择严格成对": "undo: strictly paired with the choice",
    "去重剪枝的前提是先排序": "dedup pruning requires sorting first",
    "计数排序：值域 k 远小于数据量时，拿「值」当下标，绕开 n log n 下界": "Counting sort: when the value range k is far smaller than n, use values as indices and skip the n log n bound",
    "第一遍：统计出现次数": "pass one: count occurrences",
    "前缀和＝该值的写入上界": "prefix sums give the write limit for each value",
    "逆序写回才稳定": "writing back in reverse is what keeps it stable",
    "基数排序（LSD）：d 轮「必须稳定」的计数排序，前提是键定长且能按位切开": "Radix sort (LSD): d counting-sort passes that must each be stable, over fixed-length splittable keys",
    "这一轮的结果是下一轮的输入": "this pass's output feeds the next pass",
    "平均线性：只定第 3 位": "average linear: it only settles position 3",
    "前 3 个内部有序": "the first 3 are internally sorted"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_ALGO3);

