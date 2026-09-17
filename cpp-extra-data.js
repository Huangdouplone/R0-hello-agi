/* ================================================================
 * R0:hello agi · 扩展课程数据（由主页面 index.html 引入）
 * 提供：调试入门专题阶段（插入指针之后）+ 第五篇章「拔高」（位运算/递归分治/动态规划）
 * 每个 lab 自带 answer（参考解答，供「降低卡死挫败」折叠展示）
 * STAGE_META 统一管理每阶段的难度星级(level)与前置知识(prereq)
 * 本文件用经典 <script> 引入，顶层 const 与主脚本共享全局词法作用域
 * ================================================================ */

/* ---------- 新增阶段：调试入门（插在指针 s7 之后，即数组索引 7） ---------- */
const EXTRA_STAGES=[
{id:"sdbg",icon:"🐞",name:"调试入门",desc:"写对却跑不起来？学会读报错、用调试器",
 goal:"掌握阅读编译器报错的套路，会用断点/打印定位并修复常见 bug，不再害怕红色报错。",
 links:[["Visual Studio 调试入门","https://learn.microsoft.com/zh-cn/visualstudio/debugger/debugger-feature-tour"],["GDB 简明教程","https://www.cs.cmu.edu/~gilpin/tutorial/"],["菜鸟教程 · 常见错误","https://www.runoob.com/cplusplus/cpp-exceptions.html"]],
 lab:{t:"找出并修复越界 Bug",req:["下面 starter 里有一处数组越界（循环条件 i<=5 访问了 arr[5]）","把它改成 i<5，使程序不再越界","运行后正确输出应为 sum = 15"],starter:`#include <iostream>\n\nint main() {\n    int arr[5] = {1, 2, 3, 4, 5};\n    int sum = 0;\n    for (int i = 0; i <= 5; i++) {   // 这里越界了：arr[5] 不存在\n        sum = sum + arr[i];\n    }\n    std::cout << "sum = " << sum << std::endl;\n    return 0;\n}`,hint:"数组下标从 0 到 4，循环条件应写 i < 5；越界访问是未定义行为，输出会乱。",answer:`#include <iostream>\n\nint main() {\n    int arr[5] = {1, 2, 3, 4, 5};\n    int sum = 0;\n    for (int i = 0; i < 5; i++) {   // 修复：i < 5，只访问 arr[0]~arr[4]\n        sum = sum + arr[i];\n    }\n    std::cout << "sum = " << sum << std::endl;  // 输出 15\n    return 0;\n}`,xp:30},
 lessons:[
 {id:"d1",title:"读得懂编译器报错",min:10,summary:["编译错误主要有三类：语法错误、链接错误、警告。","报错通常给出「文件:行号:列号 + 原因」，从第一条 error 看起。","一个错误常引发后面一串连锁报错，修好根因再看。","警告(warning)不是错误，但往往预示隐患，别忽视。"],code:`// 常见：error: expected ';' before '}' token\n// 含义：前面某行少了分号\n// 处理：回到提示行号上方补分号`,pit:"盯着最后一条 error 看半天——其实根因往往是第一条 error，后面都是连锁反应。",ex:{q:"编译报了几十条 error，应该从哪条开始看？",a:"从第一条 error 的行号看起，修好它，重编译后很多连锁 error 会消失。"},target:"能把一段报错信息定位到具体行号与大致原因。"},
 {id:"d2",title:"断点调试基础",min:12,summary:["断点(breakpoint)让程序跑到某行时暂停。","单步执行：Step Over 跳过函数、Step Into 进入函数。","监视(Watch)窗口可实时看变量值，判断是否符合预期。","条件断点：满足某条件才暂停，定位偶发问题。"],code:`// 在 IDE 里点击行号左侧打红点\n// 点「调试运行」，程序在断点处停下\n// 用「逐过程」观察每一步变量变化`,pit:"只会 printf 调试效率低；学会断点能直接看到每一步状态，省大量时间。",ex:{q:"想看循环第 3 次时 i 和 sum 的值，怎么办？",a:"在循环体内打断点，或设条件断点 i==3，运行时观察监视窗口。"},target:"能在 IDE 里打断点、单步执行并观察变量。"},
 {id:"d3",title:"段错误与未定义行为",min:12,summary:["段错误(Segmentation fault)常来自野指针、空指针解引用、数组越界。","未定义行为(UB)：编译器不报错，但运行结果不可预测。","越界访问、解引用空指针、使用已释放内存都是 UB。","养成防御性检查：指针使用前判空、下标做检查。"],code:`int* p = nullptr;\nstd::cout << *p;  // 段错误：解引用空指针\nint a[3]; a[5] = 1;  // 越界，UB`,pit:"UB 不一定立刻崩溃，可能隔很久才出错——这正是它最危险的地方。",ex:{q:"为什么有时越界没立刻报错？",a:"越界写到了别的变量或空闲区，程序还能跑，但数据已悄悄损坏，后续行为不可预测。"},target:"知道段错误常见来源，并养成使用前检查的习惯。"},
 {id:"d4",title:"打印调试与日志",min:8,summary:["在关键位置输出变量值，是最朴素也最常用的定位手段。","输出「函数进入/离开」「关键变量 = 值」帮助还原执行路径。","正式项目用日志库(如 spdlog)分级输出，比到处 cout 更规范。","调试完记得删除或关闭临时打印，避免污染输出。"],code:`std::cout << "[debug] i=" << i << " sum=" << sum << std::endl;`,pit:"临时打印忘删会污染正式输出；用宏或日志级别控制开关更专业。",ex:{q:"打印调试 vs 断点调试怎么选？",a:"快速看一个值用打印；要理清多步状态、循环内部，断点更直观高效。"},target:"能合理使用打印定位简单问题。"},
 {id:"d5",title:"调试策略：二分与最小化",min:10,summary:["二分注释法：注释掉一半代码，判断 bug 在左半还是右半，递归缩小范围。","最小化复现：把问题抽成最短可运行样例，排除无关干扰。","Rubber duck：向「橡皮鸭」逐行讲解代码，常自己就发现错误。","改一处测一处，别一次性大改。"],code:`// bug 在 200 行里？先注释后 100 行\n// 仍出错→在前 100 行；否则在后 100 行\n// 如此二分，快速定位`,pit:"不要靠「感觉」乱改，用系统方法缩小范围，调试速度提升数倍。",ex:{q:"程序 500 行，哪里出 bug 了？你怎么最快定位？",a:"用二分注释/二分打印，配合断点，把范围迅速缩到十几行内。"},target:"掌握二分法和最小化复现两种高效调试策略。"}
 ],
quiz:[{q:"面对一大堆编译错误，应？",o:["从最后一条看","从第一条看起","随便改","全部忽略"],a:1,why:"第一条 error 常是根因，后面多是连锁反应。"},{q:"段错误最可能来自？",o:["cout 输出","解引用空指针","for 循环","int 变量"],a:1,why:"空指针/野指针解引用、越界是段错误主因。"},{q:"定位模糊 bug 的高效方法是？",o:["多写注释","二分注释法缩小范围","换编译器","重装系统"],a:1,why:"二分注释/最小化复现能系统地把范围缩小。"}]},

/* ---------- 第五篇章「拔高」：位运算深入 ---------- */
{id:"sbw",icon:"🔢",name:"位运算深入",desc:"用比特位做高效技巧",
 goal:"掌握置位/清位/取位与异或技巧，能用位运算写出简洁高效的代码。",
 links:[["位运算技巧合集","https://www.cnblogs.com/zhoug2020/p/12399687.html"],["cppreference · 位运算符","https://zh.cppreference.com/w/cpp/language/operator_arithmetic"]],
 lab:{t:"统计二进制中 1 的个数",req:["写一个 int countOnes(int n) 返回 n 的二进制表示中 1 的个数","使用 n &= (n-1) 每次消去最低位的一个 1（Brian Kernighan 算法）","main 读入一个整数并输出结果"],starter:`#include <iostream>\n\nint countOnes(int n) {\n    // 用 n &= (n - 1) 消去最低位 1\n    return 0;\n}\n\nint main() {\n    int n; std::cin >> n;\n    std::cout << countOnes(n) << std::endl;\n    return 0;\n}`,hint:"while(n){ n &= (n-1); c++; } 循环次数正好等于 1 的个数。",answer:`#include <iostream>\n\nint countOnes(int n) {\n    int c = 0;\n    while (n) {        // 只要 n 还有 1 位就继续\n        n &= (n - 1);  // 消去最低位的一个 1\n        c++;\n    }\n    return c;\n}\n\nint main() {\n    int n; std::cin >> n;\n    std::cout << countOnes(n) << std::endl;\n    return 0;\n}`,xp:25},
 lessons:[
 {id:"b1",title:"位运算回顾与取/置/清位",min:10,summary:["& 与、| 或、^ 异或、~ 取反、<< >> 移位。","取第 k 位：(x>>k)&1。","将第 k 位置 1：x | (1<<k)。","将第 k 位清 0：x & ~(1<<k)。"],code:`int x=0b1010;\nint k3=(x>>3)&1;     // 取第3位=1\nx |= (1<<1);        // 置第1位\nx &= ~(1<<2);       // 清第2位`,pit:"位运算优先级低于比较与加减，组合时务必加括号。",ex:{q:"如何判断 x 的第 0 位是否为 1？",a:"(x & 1) == 1 即第 0 位是 1。"},target:"会取位、置位、清位三个基本操作。"},
 {id:"b2",title:"异或技巧",min:10,summary:["异或 ^：相同为 0、不同为 1；x^0=x、x^x=0。","不借助临时变量交换两数：a^=b;b^=a;a^=b。","「只出现一次的数」：全体异或，出现两次的抵消，剩下的就是答案。","判断两数是否异号可用 (a^b)<0。"],code:`int a=3,b=5;\na^=b;b^=a;a^=b;  // 交换\nint x=0; for(int v:arr) x^=v;  // 找只出现一次的数`,pit:"异或交换在存在别名(a 与 b 同地址)时会清零，实际工程多用 std::swap。",ex:{q:"数组里除一个数外都出现两次，怎么快速找到它？",a:"把所有元素异或起来，成对的相互抵消，剩下的就是只出现一次的那个。"},target:"理解异或的核心性质并能做交换/去重。"},
 {id:"b3",title:"lowbit 与 2 的幂",min:8,summary:["lowbit = x & (-x) 取出最低位的 1 及其后的 0。","判断 n 是否为 2 的幂：n>0 且 (n & (n-1))==0。","lowbit 是树状数组(Fenwick Tree)的核心运算。"],code:`int lowbit(int x){ return x & -x; }\nbool isPow2(int n){ return n>0 && (n&(n-1))==0; }`,pit:"-x 在计算机里是 ~x+1（补码），所以 x & -x 恰好留下最低位的 1。",ex:{q:"n=12(1100)，n & (n-1) 是多少？是 2 的幂吗？",a:"n-1=1011，n&(n-1)=1000=8≠0，所以不是 2 的幂（12 不是）。"},target:"会算 lowbit 并判断 2 的幂。"},
 {id:"b4",title:"位运算实战：状态压缩",min:8,summary:["用一个整数的每一位表示一个「开关/选中」状态，节省空间。","例如 5 道判断题的答案可用一个 5 位整数保存。","遍历子集：for(int s=mask; s; s=(s-1)&mask) 枚举 mask 的所有子集。"],code:`// 5 个选项，选中第 0、2 位：state = (1<<0)|(1<<2);\nif(state & (1<<2)) { /* 第2项被选中 */ }`,pit:"状态压缩常用于搜索/DP，但可读性下降，记得加注释。",ex:{q:"用一个 int 表示 8 个开关，怎么判断第 3 个开关开着？",a:"(state >> 3) & 1 == 1 即开着。"},target:"理解用位表示多选状态的思路。"}
 ],
quiz:[{q:"将第 k 位置 1 应写？",o:["x & (1<<k)","x | (1<<k)","x ^ (1<<k)","x >> k"],a:1,why:"或上 1<<k 把该位置 1，其余位不变。"},{q:"判断 n 是 2 的幂可用？",o:["(n&1)==0","(n&(n-1))==0 && n>0","n%2==0","(n<<1)==n"],a:1,why:"2 的幂二进制只有一个 1，n&(n-1) 必为 0。"},{q:"找数组中只出现一次的数（其余成对），可用？",o:["求和","全体异或","排序","取平均"],a:1,why:"成对元素异或抵消，剩下的即答案。"}]},

/* ---------- 第五篇章「拔高」：递归与分治 ---------- */
{id:"srec",icon:"🌲",name:"递归与分治",desc:"把大问题拆成同样的小问题",
 goal:"建立递归思维，理解分治与回溯，能手写汉诺塔/全排列等经典递归。",
 links:[["递归与分治思想","https://www.cnblogs.com/wanghouzhen/p/11957099.html"],["汉诺塔讲解","https://zh.wikipedia.org/wiki/%E6%B1%89%E8%AF%BA%E5%A1%94"]],
 lab:{t:"汉诺塔步骤打印",req:["用递归 void hanoi(int n,char a,char b,char c) 打印把 n 个盘从 a 经 b 移到 c 的全部步骤","n==1 时直接 a->c","main 读入 n 并调用 hanoi(n,'A','B','C')"],starter:`#include <iostream>\n\nvoid hanoi(int n, char a, char b, char c) {\n    // n==1 直接 a->c；否则先移上 n-1 个到 b\n}\n\nint main() {\n    int n; std::cin >> n;\n    hanoi(n, 'A', 'B', 'C');\n    return 0;\n}`,hint:"把 n 个盘看成「上面 n-1 个」+「最底 1 个」，分三步移动。",answer:`#include <iostream>\n\nvoid hanoi(int n, char a, char b, char c) {\n    if (n == 1) { std::cout << a << "->" << c << "\\n"; return; }\n    hanoi(n - 1, a, c, b);          // 把上面 n-1 个从 a 移到 b\n    std::cout << a << "->" << c << "\\n";  // 把最大的从 a 移到 c\n    hanoi(n - 1, b, a, c);          // 把 n-1 个从 b 移到 c\n}\n\nint main() {\n    int n; std::cin >> n;\n    hanoi(n, 'A', 'B', 'C');\n    return 0;\n}`,xp:25},
 lessons:[
 {id:"c1",title:"递归思维与栈帧",min:10,summary:["递归是「函数调用自身」，必须有一个能触底的终止条件。","每次调用都会在调用栈上压入一帧，保存局部变量。","递归展开时先「递」下去，触底后「归」回来逐层计算。","深度过大会栈溢出（stack overflow）。"],code:`void f(int n){\n    if(n<=0) return;     // 终止条件\n    f(n-1);              // 递归调用\n}`,pit:"忘写或写错终止条件 → 无限递归直到栈溢出崩溃。",ex:{q:"递归和循环能互相改写吗？",a:"绝大多数递归都能写成循环（常借助栈），尾递归甚至可被编译器优化成循环。"},target:"理解递归的「终止条件 + 自我调用」结构。"},
 {id:"c2",title:"分治思想",min:10,summary:["分治：把大问题分成若干同类小问题，分别解决后再合并。","典型：归并排序、快速排序、二分查找。","适合问题具有「最优子结构」时。","分治常表现为递归，但不等于递归。"],code:`// 归并排序：先分两半各自排序，再合并两个有序段\n// 快排：选基准，小的放左大的放右，再对两侧递归`,pit:"分治的「合并」步骤常被忽略，但它往往是复杂度的关键。",ex:{q:"二分查找为什么快？",a:"每次把候选区间减半，n 个元素只需约 log2(n) 次比较。"},target:"理解「分而治之」的基本套路。"},
 {id:"c3",title:"回溯入门",min:10,summary:["回溯是在搜索中「试错」：选一个分支，不行就退回上一步换路。","常用递归 + 标记/撤销标记实现。","经典问题：全排列、子集、N 皇后、数独。","本质是「深度优先搜索 + 剪枝」。"],code:`void backtrack(int i){\n    if(i==n){ record(); return; }\n    for(int k:choices){ pick(k); backtrack(i+1); unpick(k); }  // 选-递归-撤销\n}`,pit:"忘了「撤销选择」是回溯最常见 bug——必须保证递归返回后状态还原。",ex:{q:"求全排列的核心是什么？",a:"固定某一位尝试每个候选，递归处理下一位，返回后撤销本次选择再试下一个。"},target:"理解回溯「尝试—撤销」的框架。"},
 {id:"c4",title:"递归优化：记忆化",min:8,summary:["朴素递归常重复计算同一子问题（如斐波那契）。","记忆化：把算过的子问题结果缓存起来，下次直接取。","自顶向下记忆化，对应自底向上的动态规划。","斐波那契用记忆化从指数级降到线性。"],code:`int fib(int n, std::vector<int>& m){\n    if(n<2) return n;\n    if(m[n]!=-1) return m[n];\n    return m[n]=fib(n-1,m)+fib(n-2,m);\n}`,pit:"缓存数组要初始化为「未计算」标记（如 -1），不能用 0 充当。",ex:{q:"为什么朴素斐波那契很慢？",a:"fib(n) 反复计算 fib(n-2) 等子问题，总次数呈指数增长；记忆化去重后线性。"},target:"能用记忆化消除递归的重复计算。"}
 ],
quiz:[{q:"递归必须有的部分是？",o:["循环体","终止条件","数组","返回值"],a:1,why:"没有终止条件会无限递归直至栈溢出。"},{q:"回溯的关键是？",o:["多用全局变量","选-递归-撤销","不用递归","只打印","只排序"],a:1,why:"尝试后必须撤销选择，才能换下一分支继续搜索。"},{q:"记忆化主要解决？",o:["栈溢出","重复计算子问题","代码太长","输入错误"],a:1,why:"把已算的子问题缓存，避免指数级重复。"}]},

/* ---------- 第五篇章「拔高」：动态规划入门 ---------- */
{id:"sdp",icon:"📈",name:"动态规划入门",desc:"把复杂最优化拆成子问题",
 goal:"理解 DP 的「状态+转移」，能手写爬楼梯、最长递增子序列等经典 DP。",
 links:[["动态规划入门","https://www.luogu.com.cn/blog/onesentencedp/dong-tai-gui-hua-ru-men"],["背包九讲","https://github.com/tianyicui/pack"]],
 lab:{t:"爬楼梯（每次 1 或 2 步）",req:["n 级台阶，每次可上 1 或 2 级，求不同方法数","用 dp[i]=dp[i-1]+dp[i-2]，dp[0]=dp[1]=1","main 读入 n 输出 dp[n]"],starter:`#include <iostream>\n#include <vector>\n\nint climb(int n) {\n    // dp[i] = dp[i-1] + dp[i-2]\n    return 0;\n}\n\nint main() {\n    int n; std::cin >> n;\n    std::cout << climb(n) << std::endl;\n    return 0;\n}`,hint:"这就是斐波那契，但注意 dp[0]=1（0 级有 1 种「不走」的方法）。",answer:`#include <iostream>\n#include <vector>\n\nint climb(int n) {\n    if (n <= 1) return 1;          // 0 级或 1 级都只有 1 种\n    std::vector<int> dp(n + 1);\n    dp[0] = 1; dp[1] = 1;\n    for (int i = 2; i <= n; i++)\n        dp[i] = dp[i - 1] + dp[i - 2];\n    return dp[n];\n}\n\nint main() {\n    int n; std::cin >> n;\n    std::cout << climb(n) << std::endl;\n    return 0;\n}`,xp:25},
 lessons:[
 {id:"e1",title:"从递归到记忆化再到 DP",min:10,summary:["很多最优化问题满足「最优子结构」与「无后效性」。","先写朴素递归，再记忆化去重，最后改写成循环填表就是 DP。","DP 本质是「用空间换时间」，把子问题结果存起来。"],code:`// 递归 f(n)=f(n-1)+f(n-2)\n// 记忆化 → 自底向上填 dp[] 数组`,pit:"别一上来就硬想 DP，先用递归把问题说清楚，再优化。",ex:{q:"DP 和记忆化递归的关系？",a:"计算顺序相反：记忆化是自顶向下（递归+缓存），DP 常自底向上（循环填表），结果等价。"},target:"理解 DP 由递归优化而来的脉络。"},
 {id:"e2",title:"状态与转移方程",min:10,summary:["状态：描述「子问题」的变量（如 dp[i] 表示前 i 个的答案）。","转移方程：状态之间如何递推（如 dp[i]=max(dp[i-1],...)。","初始化边界：dp[0] 等基础情形要先填对。","答案通常就是某个 dp 值或其中的最值。"],code:`// 例：最长递增子序列\n// dp[i] = 以第 i 个结尾的 LIS 长度\n// dp[i] = max(dp[j]+1) 对所有 j<i 且 a[j]<a[i]`,pit:"边界初始化错一点，后面全错——先手写小例子验证 dp 表。",ex:{q:"写 DP 的第一步应该是什么？",a:"先定义清楚「状态表示什么」，再找转移，最后定边界。"},target:"能口头描述一个简单 DP 的状态与转移。"},
 {id:"e3",title:"0/1 背包思路",min:10,summary:["n 件物品，每件有重量 w 和价值 v，背包容量 W，求最大价值。","状态 dp[i][j]：前 i 件、容量 j 时的最大价值。","转移：第 i 件选或不选，取较大者。","可滚动数组把二维压成一维（逆序更新）。"],code:`for(int i=1;i<=n;i++)\n  for(int j=W;j>=w[i];j--)\n    dp[j]=max(dp[j], dp[j-w[i]]+v[i]);`,pit:"一维优化必须逆序更新 j，否则同一件物品会被重复选多次。",ex:{q:"为什么一维背包要 j 逆序遍历？",a:"逆序保证更新 dp[j] 时用的 dp[j-w[i]] 还是「上一轮(i-1)」的值，即每件至多选一次。"},target:"理解 0/1 背包的状态与转移思想。"},
 {id:"e4",title:"DP 实战：爬楼梯与 LIS",min:10,summary:["爬楼梯：dp[i]=dp[i-1]+dp[i-2]，典型一维线性 DP。","最长递增子序列(LIS)：dp[i]=max(dp[j]+1)，O(n^2) 可优化到 O(n log n)。","DP 题套路：定义状态 → 写转移 → 定边界 → 写循环。"],code:`// 爬楼梯\nint f(int n){ if(n<=1)return 1; return f(n-1)+f(n-2); }  // 递归版即斐波那契`,pit:"先写对递归/小例子，再考虑要不要优化成 O(n) 或 O(n log n)。",ex:{q:"爬楼梯 n=3 有几种走法？",a:"dp[3]=dp[2]+dp[1]=2+1=3 种：111、12、21。"},target:"能手写爬楼梯 DP 并说出 LIS 的思路。"}]
 ,
quiz:[{q:"DP 的本质是？",o:["用空间换时间存子问题","随机搜索","多用指针","重写代码"],a:1,why:"DP 把子问题结果存起来避免重复计算。"},{q:"0/1 背包一维优化要？",o:["j 正序","j 逆序","只算一次","不用循环"],a:1,why:"逆序保证每件物品最多被选一次。"},{q:"写 DP 的第一步是？",o:["写循环","定义状态","初始化数组","输出答案"],a:1,why:"先想清状态表示什么，才能继续。"}]}
];

/* ---------- 全阶段难度星级与前置知识（覆盖原有 18 + 新增 4） ---------- */
const STAGE_META={
  "s1": {
    "lv": "basic"
  },
  "s2": {
    "lv": "basic"
  },
  "s3": {
    "lv": "basic"
  },
  "s4": {
    "lv": "basic"
  },
  "s5": {
    "lv": "basic"
  },
  "s6": {
    "lv": "basic"
  },
  "s7": {
    "lv": "adv",
    "pre": "建议先巩固：数组"
  },
  "s8": {
    "lv": "basic"
  },
  "s9": {
    "lv": "adv",
    "pre": "建议先学完：函数与结构体"
  },
  "s10": {
    "lv": "adv",
    "pre": "建议先学完：面向对象基础(s9)"
  },
  "s11": {
    "lv": "adv",
    "pre": "建议先学完：函数(s5)"
  },
  "s12": {
    "lv": "basic",
    "pre": "建议先学完：数组与指针"
  },
  "s13": {
    "lv": "basic",
    "pre": "建议先学完：STL 顺序容器(s12)"
  },
  "s14": {
    "lv": "adv",
    "pre": "建议先学完：STL 容器(s12/s13)"
  },
  "s15": {
    "lv": "basic",
    "pre": "建议先掌握：基础语法与文件概念"
  },
  "s16": {
    "lv": "basic",
    "pre": "建议先学完：函数(s5)与异常基础"
  },
  "s17": {
    "lv": "adv",
    "pre": "建议先学完：类与指针"
  },
  "s18": {
    "lv": "hard",
    "pre": "综合运用前 17 个阶段的知识"
  },
  "sdbg": {
    "lv": "hard",
    "pre": "建议先学完：指针与引用(s7)"
  },
  "sbw": {
    "lv": "adv",
    "pre": "建议先掌握：基础运算符(s3)"
  },
  "srec": {
    "lv": "adv",
    "pre": "建议先学完：递归(s5-6)"
  },
  "sdp": {
    "lv": "hard",
    "pre": "建议先学完：递归与记忆化(srec)"
  },
  "dsl": {
    "lv": "adv",
    "pre": "建议先学完：指针与结构体(s7/s8)"
  },
  "dsk": {
    "lv": "adv",
    "pre": "建议先学完：STL 顺序容器(s12)"
  },
  "dst": {
    "lv": "adv",
    "pre": "建议先学完：递归与分治(srec)"
  },
  "dsg": {
    "lv": "hard",
    "pre": "建议先学完：队列与递归"
  },
  "dsa": {
    "lv": "hard",
    "pre": "建议先学完：递归与分治(srec)"
  },
  "eng": {
    "lv": "adv",
    "pre": "建议先学完：现代 C++ 特性(s17)"
  },
  "career": {
    "lv": "basic",
    "pre": "建议先完成前六个篇章"
  },
  "py1": {
    "lv": "basic"
  },
  "py2": {
    "lv": "basic"
  },
  "py3": {
    "lv": "basic"
  },
  "py4": {
    "lv": "basic"
  },
  "ma1": {
    "lv": "basic",
    "pre": "建议先学完：Python 入门(py1-4)"
  },
  "ma2": {
    "lv": "adv",
    "pre": "建议先学完：线性代数 I(ma1)"
  },
  "ma3": {
    "lv": "adv",
    "pre": "建议先学完：Python 与微积分基础"
  },
  "ma4": {
    "lv": "basic",
    "pre": "建议先学完：线性代数 I/II(ma1/ma2)"
  },
  "sp1": {
    "lv": "basic",
    "pre": "建议先学完：Python 入门(py1-4)"
  },
  "sp2": {
    "lv": "basic",
    "pre": "建议先学完：NumPy(sp1)"
  },
  "sp3": {
    "lv": "basic",
    "pre": "建议先学完：Pandas(sp2)"
  },
  "ml1": {
    "lv": "basic",
    "pre": "建议先学完：数学基石(ma1-4) 与 Python(py1-4)"
  },
  "ml2": {
    "lv": "adv",
    "pre": "建议先学完：机器学习概览(ml1)"
  },
  "ml3": {
    "lv": "adv",
    "pre": "建议先学完：ml1-ml2"
  },
  "ml4": {
    "lv": "adv",
    "pre": "建议先学完：ml1-ml3"
  },
  "dl1": {
    "lv": "basic",
    "pre": "建议先学完：机器学习(ml1-4)"
  },
  "dl2": {
    "lv": "adv",
    "pre": "建议先学完：神经网络基础(dl1)"
  },
  "dl3": {
    "lv": "adv",
    "pre": "建议先学完：PyTorch 实战(dl2)"
  },
  "dl4": {
    "lv": "adv",
    "pre": "建议先学完：CNN 与序列模型(dl3)"
  },
  "dl5": {
    "lv": "hard",
    "pre": "建议先学完：注意力与 Transformer(dl4)"
  },
  "agi1": {
    "lv": "adv",
    "pre": "建议先学完：深度学习(dl1-2) 与强化学习基础"
  },
  "agi2": {
    "lv": "adv",
    "pre": "建议先学完：深度学习与大模型认知(dl5)"
  },
  "agi3": {
    "lv": "adv",
    "pre": "建议先学完：大语言模型(agi2)"
  },
  "agi4": {
    "lv": "adv",
    "pre": "建议先学完：前沿(agi1-agi3)"
  }
};;

/* === English prereq translations (pre_en) === */
(function(){
  var PRE_EN = {
    "建议先巩固：数组":"Review: arrays",
    "建议先完成前六个篇章":"Complete the first 6 parts first",
    "建议先学完：CNN 与序列模型(dl3)":"Complete: CNN & sequence models (dl3)",
    "建议先学完：ml1-ml2":"Complete: ml1-ml2",
    "建议先学完：ml1-ml3":"Complete: ml1-ml3",
    "建议先学完：NumPy(sp1)":"Complete: NumPy (sp1)",
    "建议先学完：Pandas(sp2)":"Complete: Pandas (sp2)",
    "建议先学完：Python 入门(py1-4)":"Complete: Python intro (py1-4)",
    "建议先学完：Python 与微积分基础":"Complete: Python & calculus basics",
    "建议先学完：PyTorch 实战(dl2)":"Complete: PyTorch (dl2)",
    "建议先学完：STL 容器(s12/s13)":"Complete: STL containers (s12/s13)",
    "建议先学完：STL 顺序容器(s12)":"Complete: STL sequence containers (s12)",
    "建议先学完：大语言模型(agi2)":"Complete: LLMs (agi2)",
    "建议先学完：递归(s5-6)":"Complete: recursion (s5-6)",
    "建议先学完：递归与分治(srec)":"Complete: recursion & divide-conquer (srec)",
    "建议先学完：递归与记忆化(srec)":"Complete: recursion & memoization (srec)",
    "建议先学完：队列与递归":"Complete: queues & recursion",
    "建议先学完：函数(s5)":"Complete: functions (s5)",
    "建议先学完：函数(s5)与异常基础":"Complete: functions (s5) & exception basics",
    "建议先学完：函数与结构体":"Complete: functions & structs",
    "建议先学完：机器学习(ml1-4)":"Complete: machine learning (ml1-4)",
    "建议先学完：机器学习概览(ml1)":"Complete: ML overview (ml1)",
    "建议先学完：类与指针":"Complete: classes & pointers",
    "建议先学完：面向对象基础(s9)":"Complete: OOP basics (s9)",
    "建议先学完：前沿(agi1-agi3)":"Complete: frontier topics (agi1-agi3)",
    "建议先学完：深度学习(dl1-2) 与强化学习基础":"Complete: deep learning (dl1-2) & RL basics",
    "建议先学完：深度学习与大模型认知(dl5)":"Complete: deep learning & LLM understanding (dl5)",
    "建议先学完：神经网络基础(dl1)":"Complete: neural network basics (dl1)",
    "建议先学完：数学基石(ma1-4) 与 Python(py1-4)":"Complete: math foundations (ma1-4) & Python (py1-4)",
    "建议先学完：数组与指针":"Complete: arrays & pointers",
    "建议先学完：现代 C++ 特性(s17)":"Complete: modern C++ features (s17)",
    "建议先学完：线性代数 I(ma1)":"Complete: linear algebra I (ma1)",
    "建议先学完：线性代数 I/II(ma1/ma2)":"Complete: linear algebra I/II (ma1/ma2)",
    "建议先学完：指针与结构体(s7/s8)":"Complete: pointers & structs (s7/s8)",
    "建议先学完：指针与引用(s7)":"Complete: pointers & references (s7)",
    "建议先学完：注意力与 Transformer(dl4)":"Complete: attention & Transformer (dl4)",
    "建议先掌握：基础语法与文件概念":"Master: basic syntax & file concepts",
    "建议先掌握：基础运算符(s3)":"Master: basic operators (s3)",
    "综合运用前 17 个阶段的知识":"Synthesize knowledge from stages 1-17"
  };
  Object.keys(STAGE_META).forEach(function(k){
    var m = STAGE_META[k];
    if(m.pre && PRE_EN[m.pre]) m.pre_en = PRE_EN[m.pre];
  });
})();

/* 原有 18 个实战的参考解答（参考解答折叠用）；新增 4 个阶段的 lab.answer 已内置其上 */
const LAB_ANSWERS={
  "s1": "#include <iostream>\nint main() {\n    std::cout << \"昵称：小明\" << std::endl;\n    std::cout << \"为什么学 C++：想做游戏\" << std::endl;\n    std::cout << \"今天：2026-08-23\" << std::endl;\n    return 0;\n}",
  "s2": "#include <iostream>\n#include <iomanip>\nint main() {\n    const double PI = 3.14159;\n    double r = 0;\n    std::cin >> r;\n    std::cout << std::fixed << std::setprecision(2) << PI * r * r << std::endl;\n    return 0;\n}",
  "s3": "#include <iostream>\n#include <iomanip>\nint main() {\n    double c;\n    std::cin >> c;\n    double f = c * 9.0 / 5 + 32;\n    std::cout << std::fixed << std::setprecision(1) << f << std::endl;\n}",
  "s4": "#include <iostream>\nint main() {\n    for (int i = 1; i <= 9; i++) {\n        for (int j = 1; j <= i; j++)\n            std::cout << j << \"*\" << i << \"=\" << i*j << (j==i?\"\\n\":\"\\t\");\n    }\n}",
  "s5": "#include <iostream>\nbool isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++)\n        if (n % i == 0) return false;\n    return true;\n}\nint main() {\n    int n; std::cin >> n;\n    std::cout << (isPrime(n) ? \"是质数\" : \"不是质数\");\n}",
  "s6": "#include <iostream>\n#include <string>\n#include <cctype>\nint main() {\n    std::string line; std::getline(std::cin, line);\n    int alpha=0,digit=0,space=0,other=0;\n    for (char c : line) {\n        if (isalpha(c)) alpha++;\n        else if (isdigit(c)) digit++;\n        else if (c==' ') space++;\n        else other++;\n    }\n    std::cout << \"字母:\"<<alpha<<\" 数字:\"<<digit<<\" 空格:\"<<space<<\" 其他:\"<<other<<std::endl;\n}",
  "s7": "#include <iostream>\nint main() {\n    int n; std::cin >> n;\n    int* a = new int[n];\n    int sum = 0;\n    for (int i = 0; i < n; i++) { std::cin >> a[i]; sum += a[i]; }\n    std::cout << \"sum=\" << sum << \" avg=\" << (double)sum/n << std::endl;\n    delete[] a; a = nullptr;\n}",
  "s8": "#include <iostream>\n#include <string>\nstruct Student { std::string name; double score; };\nint main() {\n    Student st[3] = {{\"Alice\",88},{\"Bob\",95},{\"Cara\",72}};\n    int best=0; for(int i=1;i<3;i++) if(st[i].score>st[best].score) best=i;\n    std::cout << \"最高分：\" << st[best].name << std::endl;\n    for(int i=0;i<3;i++) for(int j=i+1;j<3;j++) if(st[j].score>st[i].score) {Student t=st[i];st[i]=st[j];st[j]=t;}\n    for(int i=0;i<3;i++) std::cout << st[i].name << \" \" << st[i].score << std::endl;\n}",
  "s9": "#include <iostream>\nclass BankAccount {\n    double balance = 1000;\npublic:\n    void deposit(double x){ if(x>0) balance+=x; else std::cout<<\"金额非法\\n\"; }\n    void withdraw(double x){ if(x<=balance) balance-=x; else std::cout<<\"余额不足\\n\"; }\n    void show(){ std::cout<<\"余额：\"<<balance<<std::endl; }\n};\nint main(){ BankAccount acc; acc.deposit(500); acc.withdraw(9999); acc.show(); }",
  "s10": "#include <iostream>\n#include <vector>\nclass Shape { public: virtual double area() const = 0; virtual ~Shape()=default; };\nclass Circle : public Shape { double r; public: Circle(double r):r(r){} double area() const override { return 3.14159*r*r; } };\nclass Rect : public Shape { double w,h; public: Rect(double w,double h):w(w),h(h){} double area() const override { return w*h; } };\nint main(){\n    std::vector<Shape*> v; v.push_back(new Circle(2)); v.push_back(new Rect(3,4));\n    double total=0; for(auto p:v){ std::cout<<\"area=\"<<p->area()<<\"\\n\"; total+=p->area(); }\n    std::cout<<\"total=\"<<total<<std::endl;\n    for(auto p:v) delete p;\n}",
  "s11": "#include <iostream>\ntemplate<typename T> T myMax(T a,T b){ return a>b?a:b; }\ntemplate<typename T> T sumArr(T* a,int n){ T s=0; for(int i=0;i<n;i++) s+=a[i]; return s; }\nint main(){\n    std::cout<<myMax(3,5)<<\" \"<<myMax(3.14,2.7)<<std::endl;\n    int a[3]={1,2,3}; std::cout<<sumArr(a,3)<<std::endl;\n    double b[3]={1.1,2.2,3.3}; std::cout<<sumArr(b,3)<<std::endl;\n}",
  "s12": "#include <iostream>\n#include <vector>\n#include <algorithm>\nint main(){\n    int n; std::cin>>n; std::vector<int> v(n);\n    for(auto& x:v) std::cin>>x;\n    std::sort(v.begin(),v.end());\n    if(n%2) std::cout<<v[n/2]<<std::endl;\n    else std::cout<<(v[n/2-1]+v[n/2])/2.0<<std::endl;\n}",
  "s13": "#include <iostream>\n#include <string>\n#include <map>\nint main(){\n    std::map<std::string,int> cnt; std::string w;\n    while(std::cin>>w) cnt[w]++;\n    for(auto& kv:cnt) std::cout<<kv.first<<\" \"<<kv.second<<\"\\n\";\n    std::cout<<\"不同单词数：\"<<cnt.size()<<std::endl;\n}",
  "s14": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nstruct Student { std::string name; int score; };\nint main(){\n    std::vector<Student> v={{\"A\",55},{\"B\",78},{\"C\",92},{\"D\",47},{\"E\",66}};\n    std::sort(v.begin(),v.end(),[](Student a,Student b){return a.score>b.score;});\n    for(auto& s:v) std::cout<<s.name<<\" \"<<s.score<<\"\\n\";\n    int pass=std::count_if(v.begin(),v.end(),[](Student s){return s.score>=60;});\n    std::cout<<\"及格人数：\"<<pass<<std::endl;\n}",
  "s15": "#include <iostream>\n#include <fstream>\n#include <string>\nint main(){\n    std::ofstream out(\"diary.txt\", std::ios::app);\n    if(out){ out<<\"2026-08-23 今天学了文件操作\\n\"; out<<\"坚持就是胜利\\n\"; out<<\"C++ 很有趣\\n\"; out.close(); }\n    std::ifstream in(\"diary.txt\");\n    if(!in.is_open()){ std::cerr<<\"打开失败\\n\"; return 1; }\n    std::string line;\n    while(std::getline(in,line)) std::cout<<line<<std::endl;\n}",
  "s16": "#include <iostream>\n#include <stdexcept>\nint main(){\n    double a,b; char op;\n    while(std::cin>>a>>op>>b){\n        try{\n            if(op=='/'){ if(b==0) throw std::runtime_error(\"除零\"); std::cout<<a/b<<\"\\n\"; }\n            else if(op=='+') std::cout<<a+b<<\"\\n\";\n            else if(op=='-') std::cout<<a-b<<\"\\n\";\n            else if(op=='*') std::cout<<a*b<<\"\\n\";\n            else std::cout<<\"未知运算符\\n\";\n        }catch(const std::exception& e){ std::cout<<e.what()<<\"\\n\"; }\n    }\n}",
  "s17": "#include <iostream>\n#include <memory>\n#include <vector>\nint main(){\n    auto v=std::make_unique<std::vector<int>>();\n    for(int i=1;i<=10;i++) v->push_back(i);\n    for(const auto& x:*v) std::cout<<x<<\" \";\n    std::cout<<std::endl;\n    auto p=std::make_shared<int>(42);\n    auto q=p;\n    std::cout<<\"use_count=\"<<p.use_count()<<std::endl;\n}",
  "s18": "#include <iostream>\n#include <stdexcept>\ndouble calc(double a,char op,double b){\n    switch(op){\n        case '+': return a+b;\n        case '-': return a-b;\n        case '*': return a*b;\n        case '/': if(b==0) throw std::runtime_error(\"除零\"); return a/b;\n        default: throw std::runtime_error(\"非法运算符\");\n    }\n}\nint main(){\n    double a,b; char op;\n    while(std::cin>>a>>op>>b){\n        try{ std::cout<<calc(a,op,b)<<std::endl; }\n        catch(const std::exception& e){ std::cout<<e.what()<<std::endl; }\n    }\n}",
  "dsl": "#include <iostream>\n\nstruct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int v) : val(v), next(nullptr) {}\n};\n\nListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* cur = head;\n    while (cur) {\n        ListNode* nxt = cur->next;   // 先存后继，防断链\n        cur->next = prev;            // 反向\n        prev = cur;                  // 双指针整体右移\n        cur = nxt;\n    }\n    return prev;\n}\n\nint main() {\n    ListNode *head = nullptr, *tail = nullptr;\n    for (int i = 1; i <= 5; i++) {           // 尾插法：保持 1→2→3→4→5\n        ListNode* p = new ListNode(i);\n        if (!head) head = tail = p;\n        else { tail->next = p; tail = p; }\n    }\n    head = reverseList(head);\n    for (ListNode* p = head; p; p = p->next) std::cout << p->val << \" \";\n    std::cout << std::endl;                  // 输出 5 4 3 2 1\n    while (head) { ListNode* t = head; head = head->next; delete t; }\n    return 0;\n}",
  "dsk": "#include <iostream>\n#include <stack>\n#include <string>\n\nint main() {\n    std::string s;\n    std::cin >> s;\n    std::stack<char> st;\n    bool ok = true;\n    for (char c : s) {\n        if (c=='(' || c=='[' || c=='{') st.push(c);\n        else {\n            if (st.empty()) { ok = false; break; }   // 先判空再 top！\n            char t = st.top(); st.pop();\n            if ((c==')'&&t!='(') || (c==']'&&t!='[') || (c=='}'&&t!='{')) { ok = false; break; }\n        }\n    }\n    std::cout << (ok && st.empty() ? \"YES\" : \"NO\") << std::endl;\n    return 0;\n}",
  "dst": "#include <iostream>\n\nstruct TreeNode { int val; TreeNode *l = nullptr, *r = nullptr; TreeNode(int v):val(v){} };\n\nTreeNode* insert(TreeNode* root, int v) {\n    if (!root) return new TreeNode(v);\n    if (v < root->val) root->l = insert(root->l, v);\n    else if (v > root->val) root->r = insert(root->r, v);   // 相等去重\n    return root;\n}\n\nvoid inorder(TreeNode* root) {\n    if (!root) return;\n    inorder(root->l);\n    std::cout << root->val << \" \";\n    inorder(root->r);\n}\n\nint main() {\n    int n; std::cin >> n;\n    TreeNode* root = nullptr;\n    for (int i = 0; i < n; i++) { int x; std::cin >> x; root = insert(root, x); }\n    inorder(root);                           // 中序 = 升序\n    std::cout << std::endl;\n    int q; std::cin >> q;\n    TreeNode* p = root;\n    while (p) {                              // 输出查找路径\n        std::cout << p->val << \" \";\n        if (q == p->val) { std::cout << \"-> 找到\" << std::endl; return 0; }\n        p = q < p->val ? p->l : p->r;\n    }\n    std::cout << \"-> 不存在\" << std::endl;\n    return 0;\n}",
  "dsg": "#include <iostream>\n\nint g[30][30], n, m;\n\nvoid dfs(int x, int y) {\n    if (x < 0 || y < 0 || x >= n || y >= m || g[x][y] != 1) return;\n    g[x][y] = 2;                             // 标记已访问\n    dfs(x+1,y); dfs(x-1,y); dfs(x,y+1); dfs(x,y-1);\n}\n\nint main() {\n    std::cin >> n >> m;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++) std::cin >> g[i][j];\n    int islands = 0;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++)\n            if (g[i][j] == 1) { islands++; dfs(i, j); }   // 淹掉整块陆地\n    std::cout << islands << std::endl;\n    return 0;\n}",
  "dsa": "#include <iostream>\n#include <algorithm>\n\nvoid quicksort(int* a, int lo, int hi) {\n    if (lo >= hi) return;\n    int pivot = a[hi], i = lo - 1;           // 取末尾为基准\n    for (int j = lo; j < hi; j++)\n        if (a[j] < pivot) std::swap(a[++i], a[j]);\n    std::swap(a[i+1], a[hi]);                // 基准归位\n    quicksort(a, lo, i); quicksort(a, i+2, hi);\n}\n\nint bsearch(int* a, int n, int target) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;        // 防溢出写法\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) lo = mid + 1; else hi = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    int n; std::cin >> n;\n    int a[1000];\n    for (int i = 0; i < n; i++) std::cin >> a[i];\n    quicksort(a, 0, n - 1);\n    for (int i = 0; i < n; i++) std::cout << a[i] << \" \";\n    std::cout << std::endl;\n    int t; std::cin >> t;\n    std::cout << \"位置: \" << bsearch(a, n, t) << std::endl;\n    return 0;\n}",
  "eng": "#include <iostream>\n#include <thread>\n#include <mutex>\n// 方案一：mutex + lock_guard（把下面注释掉换 atomic 即为方案二）\nstd::mutex m;\nint counter = 0;\n\nvoid add100k() {\n    for (int i = 0; i < 100000; i++) {\n        std::lock_guard<std::mutex> lk(m);   // RAII 自动加解锁\n        ++counter;                           // 临界区\n    }\n}\n\nint main() {\n    std::thread t1(add100k), t2(add100k);\n    t1.join(); t2.join();\n    std::cout << \"counter = \" << counter << std::endl;  // 稳定输出 200000\n    return 0;\n}",
  "career": "# 面试题 1：为什么基类析构函数要写成 virtual？\n\n我的回答：当通过基类指针 delete 一个派生类对象时，若析构函数不是虚函数，调用会静态绑定到基类析构，派生类新增的资源不会被释放，造成内存泄漏。声明为 virtual 后走动态绑定，先执行派生类析构、再执行基类析构，资源按构造的逆序正确释放。例子：Base* p = new Der; delete p; 若 ~Base 非虚，Der 里 new 的数组就泄漏了。\n\n# 面试题 2：unique_ptr 和 shared_ptr 的区别？\n\n我的回答：unique_ptr 独占所有权，不可拷贝只能 std::move 转移，本身只有一个裸指针大小、无控制块，接近零开销，是默认选择；shared_ptr 通过引用计数共享，计数归零才释放，控制块里的计数是原子的所以有开销，且可能循环引用需要 weak_ptr 打破。原则：能 unique 就不 shared。\n\n# 面试题 3：什么是内存泄漏？如何排查？\n\n我的回答：new 出来的内存失去了所有指针记录又没有 delete，程序运行中无法再释放，长期运行内存持续增长。排查手段：Linux 下用 Valgrind 或 AddressSanitizer（-fsanitize=address）运行，能直接报出泄漏点的分配堆栈；编码上优先用智能指针和 RAII，从源头消灭手动 delete。",
  "py1": "# 第一题：用 print 输出三行自我介绍\nprint(\"昵称：小明\")\nprint(\"为什么学 AI：想做出能理解人的系统\")\nprint(\"今天：2026-08-21\")\n\n# 第二题：读入名字并问候\nname = input(\"你的名字：\")\nprint(\"你好，\" + name + \"！\")",
  "py2": "n = int(input(\"n = \"))\nfib = []\nif n >= 1: fib.append(1)\nif n >= 2: fib.append(1)\nfor i in range(2, n):\n    fib.append(fib[i-1] + fib[i-2])\nprint(fib)",
  "py3": "def count_words(path):\n    with open(path, encoding=\"utf-8\") as f:\n        return len(f.read().split())\n\ntry:\n    print(count_words(\"demo.txt\"))\nexcept FileNotFoundError:\n    print(\"文件不存在\")",
  "py4": "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\n    def is_pass(self):\n        return self.score >= 60\n\n    def add_bonus(self, n):\n        self.score = min(100, self.score + n)\n\nstudents = [Student(\"A\", 80), Student(\"B\", 45)]\nprint([s.is_pass() for s in students])\nprint(sum(1 for s in students if s.is_pass()))  # 及格人数",
  "ma1": "1) a·b = 1*3 + 2*1 = 5\n2) AB（A 左乘 B）：\n   第一行·B两列: (1*1+2*2, 1*0+2*3) = (5, 6)\n   第二行·B两列: (0*1+1*2, 0*0+1*3) = (2, 3)\n   得 AB = [[5,6],[2,3]]\n3) BA：\n   第一行·A两列: (1*1+0*0, 1*2+0*1) = (1, 2)\n   第二行·A两列: (2*1+3*0, 2*2+3*1) = (2, 7)\n   得 BA = [[1,2],[2,7]] ≠ AB —— 矩阵乘法一般不可交换。\n4) 关键：矩阵乘要求 A 的列数 = B 的行数，顺序不同结果不同。",
  "ma2": "1) (1,2) 与 (2,4) 线性相关：因为 (2,4)=2*(1,2)，存在非全零系数使其组合为 0，说明两向量共线、不提供独立信息。\n2) A=diag(2,3) 已是对角阵，特征值即对角线元素 λ1=2, λ2=3。\n3) 对特征向量 v，Av=λv：矩阵作用后方向不变、仅缩放 λ 倍；特征值即该方向的缩放倍数。\n4) 推论：PCA 沿方差最大(特征值最大)的方向投影，即取主成分。",
  "ma3": "1) f'(x)=3x²-2。\n2) g'(0)=cos(0)=1。\n3) ∂h/∂x=2x, ∂h/∂y=2y；梯度 ∇h=(2x,2y)。\n4) 梯度指向函数值增长最快方向；取负梯度(-∇h)让损失下降最快。\n5) 一阶泰勒 f(x)≈f(a)+f'(a)(x-a)，是梯度下降的几何直觉来源。",
  "ma4": "1) P(雨且带伞)=P(雨)·P(带伞|雨)=0.3×0.9=0.27。\n2) 贝叶斯：P(患病|阳性)=P(阳性|患病)·P(患病)/P(阳性)，由「检测」反推「真正患病」。\n3) 公平骰子期望=(1+2+3+4+5+6)/6=3.5。\n4) 后验才是「给定阳性后真患病」的概率；基础概率很小，即使检测很准，阳性也常是假阳性。",
  "sp1": "import numpy as np\nc = np.arange(30)            # 0..29 摄氏度\nf = c * 9 / 5 + 32          # 向量化转华氏，无需 for\nprint(\"平均\", f.mean(), \"最高\", f.max())",
  "sp2": "import pandas as pd\nimport matplotlib.pyplot as plt\ndf = pd.DataFrame({\n    \"name\": [\"A\", \"B\", \"C\"],\n    \"math\": [88, 72, 95],\n    \"eng\":  [79, 90, 68],\n})\ndf[\"total\"] = df[\"math\"] + df[\"eng\"]     # 向量化加总分\ntop3 = df.sort_values(\"total\", ascending=False).head(3)\nprint(top3)\nplt.plot(df[\"name\"], df[\"math\"], marker=\"o\", label=\"math\")\nplt.plot(df[\"name\"], df[\"eng\"], marker=\"s\", label=\"eng\")\nplt.legend(); plt.show()",
  "sp3": "主题：某课程成绩分析（端到端小项目）\n步骤1 数据：用 pandas 读 CSV 或字典构造 DataFrame（姓名/数学/英语）。\n步骤2 清洗：检查缺失(isna)、去重、统一类型；异常值用分位数裁剪。\n步骤3 分析：加「总分」列、按班 groupby 求均值、算相关系数。\n步骤4 可视化：Matplotlib 画每人两科折线图 + 班级均分柱状图，看差距与趋势。\n步骤5 结论：谁总分高、谁偏科；建议对弱科加练。结论要回答最初的问题并用图佐证。\n用到库：pandas(读洗算)、numpy(数值)、matplotlib(图)。",
  "ml1": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\nnp.random.seed(0)\nX = np.arange(20).reshape(-1,1).astype(float)\ny = 2*X.ravel() + 1 + np.random.randn(20)*2   # y=2x+1 + 噪声\nm = LinearRegression().fit(X, y)\nprint(\"w, b =\", m.coef_[0], round(m.intercept_,2))   # 接近 2, 1\nprint(\"预测 x=10 ->\", round(m.predict([[10]])[0],2))  # 接近 21",
  "ml2": "from sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import classification_report\nX, y = make_classification(n_samples=300, random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)\nm = LogisticRegression().fit(Xtr, ytr)\nprint(\"准确率\", m.score(Xte, yte))\nprint(classification_report(yte, m.predict(Xte)))",
  "ml3": "from sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nX, y = make_classification(n_samples=300, random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)\nbase = LogisticRegression().fit(Xtr, ytr).score(Xte, yte)\nss = StandardScaler()\nXtr_s, Xte_s = ss.fit_transform(Xtr), ss.transform(Xte)\nscaled = LogisticRegression().fit(Xtr_s, ytr).score(Xte_s, yte)\nprint(\"不标准化\", round(base,3), \"标准化\", round(scaled,3))\n# 多数距离/梯度类模型标准化后更稳；差异虽可能不大，但不标准化易波动。",
  "ml4": "from sklearn.datasets import make_classification, make_blobs\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.cluster import KMeans\nX, y = make_classification(n_samples=300, random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)\nrf = RandomForestClassifier(n_estimators=100, random_state=0).fit(Xtr, ytr)\nprint(\"随机森林测试准确率\", round(rf.score(Xte, yte),3))   # 监督学习\nXb, _ = make_blobs(n_samples=50, centers=3, random_state=0)\nkm = KMeans(n_clusters=3, n_init=10).fit(Xb)\nprint(\"簇标签前10:\", km.labels_[:10])                      # 无监督学习",
  "dl1": "import numpy as np\nX = np.array([[0,0],[0,1],[1,0],[1,1]])   # 与门\ny = np.array([0,0,0,1])\nw = np.random.randn(2)*0.1; b = 0.0; lr = 0.1\nfor epoch in range(50):\n    for xi, yi in zip(X, y):\n        z = np.dot(w, xi) + b\n        yhat = 1 if z >= 0 else 0\n        err = yi - yhat\n        w += lr*err*xi; b += lr*err\nprint(\"w,b =\", np.round(w,3), round(b,3))\nprint(\"预测:\", [ (np.dot(w,xi)+b)>=0 and 1 or 0 for xi in X ])",
  "dl2": "import torch, torch.nn as nn\nfrom sklearn.datasets import make_classification\nX, y = make_classification(n_samples=200, random_state=0)\nXt = torch.tensor(X, dtype=torch.float32)\nyt = torch.tensor(y, dtype=torch.float32).view(-1,1)\nnet = nn.Sequential(nn.Linear(20, 8), nn.ReLU(), nn.Linear(8,1), nn.Sigmoid())\nopt = torch.optim.Adam(net.parameters(), lr=1e-3)\nloss_fn = nn.BCELoss()\nfor ep in range(300):\n    opt.zero_grad()\n    loss = loss_fn(net(Xt), yt)\n    loss.backward(); opt.step()\n    if ep % 60 == 0: print(\"ep\", ep, \"loss\", round(loss.item(),4))",
  "dl3": "import torch, torch.nn as nn\nfrom torch.utils.data import DataLoader\nfrom torchvision import datasets, transforms\ntrain = datasets.MNIST(\"data\", train=True, download=True, transform=transforms.ToTensor())\nloader = DataLoader(train, batch_size=64, shuffle=True)\nnet = nn.Sequential(\n    nn.Flatten(), nn.Linear(28*28, 128), nn.ReLU(),\n    nn.Linear(128, 10))   # 卷积版：nn.Conv2d→ReLU→MaxPool→Linear\nopt = torch.optim.Adam(net.parameters(), lr=1e-3)\nloss_fn = nn.CrossEntropyLoss()\nfor ep in range(3):\n    tot=0\n    for x, y in loader:\n        opt.zero_grad(); loss = loss_fn(net(x), y); loss.backward(); opt.step(); tot+=loss.item()\n    print(\"ep\", ep, \"loss\", round(tot/len(loader),3))\n# 卷积相比全连接：一个核扫全图只学一份参数(权值共享+局部连接)，参数量远小于全连接。",
  "dl4": "注意力计算：给定 Query(Q)、Key(K)、Value(V)，先算每个 Q 与所有 K 的相似度分数（点积 QKᵀ，除 √d 防过大），softmax 得到权重，再对 V 加权求和，得到「融合全局信息」的输出。\n公式 softmax(QKᵀ/√d)V 的含义：softmax 把分数变成和为1的权重，(QKᵀ/√d) 衡量每个位置的相关度，乘以 V 即按相关度抽取信息。\n例：翻译 \"The animal didn't cross the street because it was too tired\" 时，\"it\" 的 Query 与 \"animal\" 的 Key 相似度最高，注意力把它和 animal 对齐，模型从而知道 it 指动物而非 street。\n核心价值：谁相关度高谁贡献大，像动态检索，且任意两位置直接相连。",
  "dl5": "Transformer 编码器块（以 BERT 为例）依次包含：① 多头自注意力子层（Q/K/V 都来自同一输入序列）；② 残差连接 + LayerNorm；③ 前馈网络(FFN)子层；④ 残差连接 + LayerNorm。解码器额外有「掩码自注意力」(看不到未来)与「交叉注意力」(Q 来自解码、K/V 来自编码)。\nSelf-Attention 中 Q/K/V 都来自同一序列的不同线性投影，所以每个位置都能直接关注序列中任意其他位置。\n能并行训练：注意力是一次矩阵运算(QKᵀV)而非 RNN 的逐步循环，整句同时算，充分利用 GPU；RNN 必须按时间步串行，难以并行且长程易忘。",
  "agi1": "目标：智能体在环境中感知状态 s、采取动作 a、获得奖励 r，最大化「长期累计折扣回报」Σ γᵗ rₜ，而非单步。\n策略梯度：直接对策略网络 π(a|s) 的参数 θ 求「回报」的梯度，好动作(高回报)提高其概率、坏动作降低——即 ∇θ J ≈ E[ return · ∇log π(a|s) ]，用 PPO 等裁剪限制步长更稳。\n例：下棋 AI 终局获胜，把正回报沿对局路径回溯，提高取胜前几步动作的概率；输了则降低。\nRLHF：用人类对多个回答的偏好排序训练「奖励模型」，再以它的打分作奖励信号用 PPO 微调 LLM，使模型更听话、更安全，而非更「聪明」。",
  "agi2": "RAG 流程（私有文档问答）：① 把文档切分成段落(chunk)；② 用嵌入模型把每段向量化；③ 存入向量库；④ 用户提问时同样向量化，检索 top-k 最相似段落；⑤ 把检索到的段落拼接进 Prompt（\"根据以下资料回答…\"）；⑥ 交给 LLM 生成答案并标注出处。\n比凭记忆更可靠：答案锚定在给定权威资料，显著减少幻觉；知识库更新无需重训模型，直接改库即可。\n关键技术：嵌入模型(如 bge/m3e)、向量库(如 FAISS/Milvus)、LLM 生成、相似度检索。",
  "agi3": "「查天气 Agent」循环：① 思考：用户问天气，我需要城市与日期；② 规划：调用 get_weather(city, date) 工具；③ 执行：输出函数调用 {tool:\"get_weather\", args:{city:\"北京\", date:\"今天\"}}；④ 观察：程序返回 \"北京 今天 晴 26°C\"；⑤ 再思考：信息已齐，组织自然语言回答；⑥ 最终回答用户。\n为什么需要「观察」：若没有真实返回，模型可能凭空编造\"北京 下雨 18°C\"，观察把工具的真实结果喂回，避免幻觉。\n组件：规划(拆解任务)、工具(函数/API)、记忆(短期上下文+长期向量库)、执行与环境交互。",
  "agi4": "我的 1~2 年 AGI 工程路线（分阶段）：\n阶段1（0-6月）底层与基础：扎实 C++ 系统功力 + Python/数学，能跑通一个 scikit-learn 小项目。\n阶段2（6-12月）ML/DL：用 PyTorch 训通 CNN/Transformer，在 Kaggle 上一个完整赛题进前50%。\n阶段3（12-18月）前沿：做两个项目——一个 RAG 知识库问答、一个调用工具的 Agent；读 10 篇关键论文(Transformer/RLHF 等)。\n阶段4（18-24月）工程化：把一个模型打包成推理 API 部署，做压测与监控，理解 MLOps。\n每阶段目标产出：能跑的代码/能部署的服务/能讲清的笔记。\n持续小事：① 每周 2 篇技术笔记；② 每天刷 1 道算法/ML 题；③ 每月复现 1 个开源小项目。"
};;

/* ================================================================
 * 求职路线扩展：第六篇章「算法修炼」（数据结构与算法）
 *            + 第七篇章「工程与就业」（Git/CMake/多线程/面试冲刺）
 * 目标：半年内达到开发岗就业水平。本数组按顺序追加到 CURRICULUM 末尾。
 * ================================================================ */
const JOB_STAGES=[
{id:"dsl",icon:"🔗",name:"复杂度与链表",desc:"面试第一课：会算复杂度，能手写链表",
 goal:"会分析时间/空间复杂度，能手写单链表完成插入、删除、反转，掌握双指针套路。",
 links:[["代码随想录","https://programmercarl.com/"],["OI Wiki · 复杂度","https://oi-wiki.org/basic/complexity/"],["LeetCode 中国","https://leetcode.cn/"]],
 lab:{t:"手写单链表并反转",req:["定义 struct ListNode{int val; ListNode* next;}","用尾插法把 1~5 建成链表 1→2→3→4→5","实现 reverse 函数原地反转并输出 5 4 3 2 1","程序结束前 delete 全部节点"],starter:`#include <iostream>\n\nstruct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int v) : val(v), next(nullptr) {}\n};\n\nListNode* reverseList(ListNode* head) {\n    // prev / cur / next 三指针原地反转\n    return head;\n}\n\nint main() {\n    ListNode* head = nullptr;\n    // 尾插法建表 1..5\n\n    head = reverseList(head);\n    // 遍历输出并释放内存\n\n    return 0;\n}`,hint:"prev=nullptr、cur=head；每轮先存 next，再把 cur->next 指向 prev，最后三个指针整体右移。",xp:30},
 lessons:[
 {id:"la1",title:"大O：复杂度分析",min:10,summary:["大O描述运行时间/内存随数据规模 n 增长的量级趋势，忽略常数与低阶项。","常见量级：O(1) < O(log n) < O(n) < O(n log n) < O(n²)，面试默认 1 秒约可做 10⁸ 次基本运算。","空间复杂度同理：开数组看大小，递归还要算调用栈深度。"],code:`// 二分查找：每次范围减半 → O(log n)\nint lo=0, hi=n-1;\nwhile(lo<=hi){ int mid=lo+(hi-lo)/2; /*...*/ }\n// 两层嵌套循环各 n 次 → O(n²)\nfor(int i=0;i<n;i++) for(int j=0;j<n;j++) ;`,pit:"只数循环层数会出错：一层循环里每次把范围减半也是 O(log n)；递归要看总调用次数而不是层数。",ex:{q:"O(n²) 的算法在 n=10⁵ 时大约多少次运算，能过吗？",a:"约 10¹⁰ 次，远超 1 秒可承受的 10⁸，必须换 O(n log n) 或 O(n) 的做法。"},target:"能分析一段代码的时间/空间复杂度并说出优化方向。"},
 {id:"la2",title:"单链表：实现与操作",min:15,summary:["链表节点=数据+指向下一节点的指针，内存不必连续：插入删除 O(1)、按下标访问 O(n)。","头插法建表顺序会颠倒；尾插法需维护尾指针（或哑节点+遍历到尾）。","插入/删除只改指针，但要小心顺序：先接新边再断旧边，否则丢链。"],code:`struct ListNode { int val; ListNode* next; };\n// 在 head 后插入 p\np->next = head->next;\nhead->next = p;   // 这两行顺序反了会丢掉后半段！`,pit:"删除节点或插入时先改谁的指针有讲究，写反就断链或泄漏；用 dummy 哑节点可统一处理头节点边界。",ex:{q:"数组与链表的核心取舍是什么？",a:"数组随机访问 O(1) 但插入删除 O(n)；链表相反——按访问模式选结构。"},target:"能手写单链表的建表、插入、删除与遍历打印。"},
 {id:"la3",title:"链表反转与合并",min:10,summary:["反转链表模板：prev/cur/next 三指针整体右移——面试最高频题之一，必须默写。","合并两个有序链表：哑节点+双指针，逐一摘下较小的节点接到结果尾部。","找倒数第 k 个：快指针先走 k 步，两指针同步走，快指针到尾时慢指针即答案。"],code:`ListNode* prev=nullptr, *cur=head;\nwhile(cur){ ListNode* nxt=cur->next;\n  cur->next=prev; prev=cur; cur=nxt; }\nreturn prev; // prev 就是新头`,pit:"反转后原 head 变成尾节点，它的 next 已经指向 nullptr；函数返回的是 prev 不是 cur。",ex:{q:"1→2→3→4 一轮循环后各指针在哪？",a:"第一轮后 prev=1, cur=2；循环结束 prev=4 即新头，cur=nullptr。"},target:"能默写反转链表，并会合并两个有序链表。"},
 {id:"la4",title:"双指针技巧",min:10,summary:["快慢指针：找中点（快走2慢走1）、判环（相遇即有环）。","左右对撞指针：有序数组两数之和、回文判断。","同向滑动窗口：维护一段区间求最长/最短子串，是字符串题的主力。"],code:`// 判环\nListNode *slow=head,*fast=head;\nwhile(fast && fast->next){\n  slow=slow->next; fast=fast->next->next;\n  if(slow==fast) return true; // 有环\n}\nreturn false;`,pit:"fast 判空要同时判 fast 和 fast->next，漏一个就会解引用空指针直接崩溃。",ex:{q:"怎么找有环链表的环入口？",a:"相遇后把一个指针放回头部，两指针每次各走一步，再次相遇处即入口（数学可证）。"},target:"会快慢/对撞/滑窗三类双指针的基本套路。"}
],
quiz:[{q:"单链表按下标访问第 i 个元素的复杂度是？",o:["O(1)","O(log n)","O(n)","O(n log n)"],a:2,why:"链表内存不连续，必须从头数过去，是 O(n)；数组才是 O(1)。"},{q:"判断链表是否有环，最常用的方法是？",o:["逐个遍历计数","快慢指针","先排序","哈希表不行"],a:1,why:"快慢指针相遇即有环，空间 O(1)。"},{q:"反转链表需要几个工作指针？",o:["1 个","2 个","3 个（prev/cur/next）","不需要"],a:2,why:"prev 记前驱、cur 当前、next 暂存后继，防止断链。"}]},

{id:"dsk",icon:"🥞",name:"栈、队列与哈希",desc:"匹配靠栈、排队靠队列、秒查靠哈希",
 goal:"会用栈/队列解决匹配与排队问题，理解哈希表原理并能手写简易版。",
 links:[["LeetCode · 栈专题","https://leetcode.cn/tag/stack/"],["cppreference · unordered_map","https://zh.cppreference.com/w/cpp/container/unordered_map"]],
 lab:{t:"有效的括号（栈）",req:["读入一个只含 ()[]{} 的字符串","用栈判断括号是否全部正确配对","合法输出 YES，否则输出 NO","注意：先判栈空再 top，最后栈必须为空"],starter:`#include <iostream>\n#include <stack>\n#include <string>\n\nint main() {\n    std::string s;\n    std::cin >> s;\n    std::stack<char> st;\n    // 遍历：左括号入栈，右括号配对弹栈\n\n    return 0;\n}`,hint:"右括号来了先看栈是否为空，再 top() 配对弹栈；遍历结束栈必须为空才算合法。",xp:25},
 lessons:[
 {id:"kb1",title:"栈的应用：括号匹配与单调栈",min:12,summary:["栈 LIFO：括号匹配——左括号进栈，右括号弹栈配对，结束栈空且每步合法才有效。","单调栈：栈内元素保持单调，专治「下一个更大元素」类问题。","表达式求值、函数调用、撤销操作，底层都是栈。"],code:`stack<char> st;\nfor(char c : s){\n  if(c=='('||c=='['||c=='{') st.push(c);\n  else{ if(st.empty()) return false;   // 先判空！\n    char t=st.top(); st.pop();\n    if((c==')'&&t!='(')) return false; }\n}\nreturn st.empty();`,pit:"右括号来时栈可能为空——先判 empty 再 top()，否则是未定义行为。",ex:{q:"\"([)]\" 合法吗？为什么？",a:"不合法：[ 弹出前必须先匹配 ]，交叉嵌套违反栈的配对顺序。"},target:"能用栈写括号匹配，理解单调栈适用场景。"},
 {id:"kb2",title:"队列与循环队列",min:10,summary:["队列 FIFO：push 入队尾、pop 出队头，BFS 与任务排队的标配。","循环队列用取模复用数组空间：rear=(rear+1)%cap。","双端队列 deque 两头进出；优先队列按优先级出队（堆实现，下一阶段讲）。"],code:`// 循环队列：牺牲一格区分空满\n// 判满：(rear+1)%cap == front\n// 判空：front == rear`,pit:"front==rear 既可能是空也可能是满——牺牲一个存储位或额外记 size 来区分。",ex:{q:"BFS 为什么用队列不用栈？",a:"队列保证按「层」的顺序扩展，才能得到无权图的最短步数。"},target:"能手写循环队列并说出判满判空条件。"},
 {id:"kb3",title:"哈希表：原理与冲突解决",min:12,summary:["哈希表用哈希函数把键映射到数组下标，平均查找/插入 O(1)。","冲突解决两大流派：拉链法（每个桶挂链表）与开放寻址（向后找空位）。","负载因子=元素数/桶数，过大冲突增多，需要扩容 rehash。"],code:`size_t idx = hash(key) % buckets.size(); // 拉链法定位桶\n// unordered_map 底层即哈希表；map 底层是红黑树`,pit:"哈希表最坏（全部冲突）退化为 O(n)；面试高频问：unordered_map 与 map 的底层与取舍。",ex:{q:"为什么 unordered_map 不能按 key 有序遍历？",a:"哈希把顺序打散了，只保证平均 O(1) 定位；要有序遍历用 map（红黑树，O(log n)）。"},target:"能画出拉链法结构并解释负载因子与 rehash。"},
 {id:"kb4",title:"手写哈希表",min:12,summary:["vector<list<pair<K,V>>> 当桶数组，hash(K)%size 定位桶。","插入先查重：存在则更新值，否则尾插并把元素数 +1。","元素数超过桶数 2 倍时扩容一倍，并按新桶数把全部元素重新哈希。"],code:`class MyHash {\n  std::vector<std::list<std::pair<int,int>>> b;\n  int n = 0;\n  int pos(int k){ return ((k % (int)b.size()) + b.size()) % (int)b.size(); }\npublic:\n  MyHash() : b(16) {}\n  void put(int k, int v){\n    for(auto& p : b[pos(k)]) if(p.first==k){ p.second=v; return; }\n    b[pos(k)].push_back({k,v});\n    if(++n > (int)b.size()*2) /* rehash */;\n  }\n};`,pit:"rehash 必须按新桶数重新定位每一个元素——直接整块拷贝会全部错位。",ex:{q:"int 键可以直接用 k%size 吗？",a:"可以，但注意负数取模为负要转正；string 键要先算出哈希值再取模。"},target:"能写出拉链法哈希表的 put/get 并解释 rehash 过程。"}
],
quiz:[{q:"判断括号串是否合法，最适合的数据结构是？",o:["队列","栈","堆","链表"],a:1,why:"最近未配对的左括号最先需要匹配——后进先出正是栈。"},{q:"哈希表平均查找复杂度是？",o:["O(1)","O(log n)","O(n)","O(n log n)"],a:0,why:"哈希直接定位桶，平均 O(1)；最坏冲突全堆一桶退化 O(n)。"},{q:"负载因子持续增大应该？",o:["删除元素","扩容并 rehash","换语言","无所谓"],a:1,why:"扩容+重哈希让每个桶元素变少，维持 O(1)。"}]},

{id:"dst",icon:"🌲",name:"二叉树与堆",desc:"递归思维的最好练兵场",
 goal:"掌握二叉树的递归思维，会四种遍历，理解 BST 与堆的性质和应用。",
 links:[["VisuAlgo · 树可视化","https://visualgo.net/zh/bst"],["cppreference · priority_queue","https://zh.cppreference.com/w/cpp/container/priority_queue"]],
 lab:{t:"BST：插入与中序输出",req:["读入 n 与 n 个整数，依次插入 BST（相等值去重）","中序遍历输出——应得到升序序列","再读入一个数 q，输出查找路径或「不存在」"],starter:`#include <iostream>\n\nstruct TreeNode { int val; TreeNode *l = nullptr, *r = nullptr; TreeNode(int v):val(v){} };\n\nTreeNode* insert(TreeNode* root, int v) {\n    // 递归插入\n    return root;\n}\n\nvoid inorder(TreeNode* root) {\n    // 中序输出\n}\n\nint main() {\n    int n; std::cin >> n;\n    TreeNode* root = nullptr;\n    for (int i = 0; i < n; i++) { int x; std::cin >> x; root = insert(root, x); }\n    inorder(root);\n    return 0;\n}`,hint:"插入时比根小往左、大往右走；中序=左-根-右递归，BST 的中序恰好升序。",xp:30},
 lessons:[
 {id:"tc1",title:"树与二叉树基础",min:10,summary:["树是 n 个节点的有限集合，有且仅有一个根；二叉树每个节点最多两个孩子。","满二叉树每层都满；完全二叉树只允许最后一层缺右边——堆就是完全二叉树。","深度为 h 的二叉树最多 2^h − 1 个节点；n 个节点有 n+1 个空指针。"],code:`struct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int v):val(v),left(nullptr),right(nullptr){}\n};`,pit:"别把「满二叉树」和「完全二叉树」混为一谈——完全二叉树允许最后一层从右往左缺。",ex:{q:"深度为 h 的二叉树最多多少节点？",a:"2^h − 1 个（每层都放满）。"},target:"掌握二叉树术语与性质，会定义节点结构。"},
 {id:"tc2",title:"遍历：前中后序与层序",min:15,summary:["前序（根左右）常用于复制树/序列化；中序（左根右）对 BST 得升序；后序（左右根）适合自底向上计算。","递归三行搞定；迭代用栈手动模拟；层序用队列按层输出。","递归模板：先写终止条件（空节点），再处理根，最后递归两棵子树。"],code:`void inorder(TreeNode* r){\n  if(!r) return;          // 终止条件永远第一行\n  inorder(r->left);\n  std::cout << r->val;    // 中序位置\n  inorder(r->right);\n}`,pit:"递归函数第一行永远先写空节点终止条件，漏写就是无限递归段错误。",ex:{q:"已知前序+中序能唯一还原二叉树吗？",a:"能（前序定根、中序分左右）；前序+后序不能——只有根的树无法区分左右。"},target:"能手写三种递归遍历与层序遍历。"},
 {id:"tc3",title:"二叉搜索树 BST",min:12,summary:["BST 性质：左子树所有节点 < 根 < 右子树所有节点。","查找/插入平均 O(log n)；插入有序数据会退化成链表，变 O(n)。","中序遍历 BST 得到升序序列——「BST 与中序」是固定搭配。"],code:`TreeNode* insert(TreeNode* r, int v){\n  if(!r) return new TreeNode(v);\n  if(v < r->val) r->left  = insert(r->left, v);\n  else           r->right = insert(r->right, v);\n  return r;\n}`,pit:"按 1,2,3,4,5 顺序插入会退化成链表——平衡树（AVL/红黑树）就是为解决它而生，map 底层即红黑树。",ex:{q:"怎么判断一棵树是不是 BST？",a:"中序遍历严格递增，或递归给每个节点传上下界 (min,max) 校验。"},target:"能实现 BST 的插入与查找，理解退化问题。"},
 {id:"tc4",title:"堆与优先队列",min:12,summary:["堆是完全二叉树：大顶堆父≥子，小顶堆父≤子；插入/弹出 O(log n)。","std::priority_queue 默认大顶堆；小顶堆写 priority_queue<int,vector<int>,greater<int>>。","经典应用 TopK：维护大小为 k 的堆，O(n log k) 优于全排序 O(n log n)。"],code:`priority_queue<int, vector<int>, greater<int>> pq; // 小顶堆\npq.push(3); pq.push(1);\npq.top();   // 1\n// TopK：找最大的 k 个 → 维护「小」顶堆`,pit:"priority_queue 不支持遍历修改，改优先级只能重建；记住口诀「找最大用小顶堆」。",ex:{q:"100 万个数找最大的 10 个，怎么最快？",a:"维护 10 大小的小顶堆：新数比堆顶大就弹出堆顶再放入，复杂度 O(n log 10)。"},target:"会用 priority_queue 解 TopK，理解堆的调整过程。"}
],
quiz:[{q:"中序遍历二叉搜索树得到？",o:["降序","升序","无序","层序"],a:1,why:"左<根<右，中序（左根右）恰好升序。"},{q:"priority_queue<int> 默认弹出？",o:["最小值","最大值","先进先出","随机"],a:1,why:"默认大顶堆，top() 是最大值。"},{q:"BST 最坏查找复杂度（退化成链表）？",o:["O(1)","O(log n)","O(n)","O(n log n)"],a:2,why:"插入有序数据会退化成链表，查找 O(n)。"}]},

{id:"dsg",icon:"🕸️",name:"图与搜索",desc:"BFS/DFS 是面试算法的分水岭",
 goal:"会存图，能用 BFS/DFS 解决连通与最短步数问题，会拓扑排序。",
 links:[["OI Wiki · 图论","https://oi-wiki.org/graph/"],["VisuAlgo · 图遍历","https://visualgo.net/zh/dfsbfs"]],
 lab:{t:"岛屿数量（DFS/BFS）",req:["读入 n 行 m 列的 0/1 网格（1 是陆地，0 是水）","用 DFS 或 BFS 统计连通陆地块（岛屿）数量","访问过的格子记得标记，避免重复计数","输出岛屿数"],starter:`#include <iostream>\n\nint g[30][30], n, m;\n\nvoid dfs(int x, int y) {\n    // 越界/水域/已访问直接返回；标记后向四方向扩展\n}\n\nint main() {\n    std::cin >> n >> m;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++) std::cin >> g[i][j];\n    int islands = 0;\n    // 双重循环遇到 1 就 dfs 并计数\n\n    std::cout << islands << std::endl;\n    return 0;\n}`,hint:"遇到没访问过的 1：islands++ 且从这里把整块陆地 DFS 标记干净（改成 2）。",xp:30},
 lessons:[
 {id:"gd1",title:"图的存储",min:10,summary:["图 G=(V,E)：有向/无向、带权/不带权。","邻接矩阵：g[u][v] 存边权，查边 O(1) 但空间 O(V²)，适合稠密图。","邻接表：vector<vector<int>> 每点存邻居列表，空间 O(V+E)，最常用。"],code:`vector<vector<int>> g(n); // 邻接表\nfor(int i=0;i<m;i++){ int u,v; cin>>u>>v;\n  g[u].push_back(v); g[v].push_back(u); } // 无向图存两遍`,pit:"无向图建边要 push 两次（u→v 和 v→u），漏一边图就「断了」。",ex:{q:"10⁵ 个点的稠密图能开邻接矩阵吗？",a:"不能——10¹⁰ 的空间直接爆内存，用邻接表。"},target:"会用邻接表建图并理解两种存储的取舍。"},
 {id:"gd2",title:"BFS：广度优先搜索",min:12,summary:["BFS 借助队列按层扩展：第一次到达某点的距离就是无权图最短步数。","模板：起点入队并标记 → 弹出队首 → 邻居未访问则标记+入队。","网格问题（迷宫/岛屿）把上下左右四个方向当邻居即可。"],code:`queue<int> q; q.push(s); dist[s]=0;\nwhile(!q.empty()){\n  int u=q.front(); q.pop();\n  for(int v:g[u]) if(dist[v]==-1){\n    dist[v]=dist[u]+1; q.push(v); }  // 入队时立即标记\n}`,pit:"入队时立刻标记 visited，弹出时才标记会重复入队导致队列爆炸。",ex:{q:"BFS 为什么能求最短路？",a:"按层扩展保证先访问的近、后访问的远，首次到达即最少步数（无权图成立）。"},target:"能默写 BFS 并解决迷宫最短步数问题。"},
 {id:"gd3",title:"DFS：深度优先搜索",min:12,summary:["DFS 沿一条路走到底再回溯，递归实现最简洁；递归深度=系统栈深度。","应用：连通分量个数、路径存在性、拓扑排序、剪枝搜索。","网格 DFS 可以顺手把访问过的格子改值，天然完成 visited 标记。"],code:`void dfs(int u){\n  vis[u]=true;\n  for(int v:g[u]) if(!vis[v]) dfs(v);\n}\n// 连通分量个数 = 对每个未访问点调用一次 dfs 的次数`,pit:"大图递归 DFS 可能栈溢出——可改为显式栈的迭代版。",ex:{q:"DFS 和 BFS 各适合什么问题？",a:"DFS 适合连通性/路径/枚举回溯；BFS 适合无权最短路/按层处理。"},target:"能写 DFS 求连通分量，理解与 BFS 的适用差异。"},
 {id:"gd4",title:"拓扑排序",min:10,summary:["有向无环图 DAG 的拓扑序：所有边都从前指向后，常用于任务/课程依赖。","Kahn 算法：入度为 0 的点入队 → 弹出 → 后继入度减 1 → 减到 0 入队。","若弹出的点数 < 总点数，说明图中有环（课程表问题的本质）。"],code:`queue<int> q; for(int i=0;i<n;i++) if(ind[i]==0) q.push(i);\nint cnt=0;\nwhile(!q.empty()){ int u=q.front(); q.pop(); cnt++;\n  for(int v:g[u]) if(--ind[v]==0) q.push(v); }\n// cnt<n 说明有环`,pit:"拓扑排序只对有向图有意义；「能否修完所有课」= 判断 DAG 是否无环。",ex:{q:"课程表问题本质是什么？",a:"判断先修关系构成的有向图是否无环——用拓扑排序检测。"},target:"会用 Kahn 算法求拓扑序并检测环。"}
],
quiz:[{q:"BFS 的核心辅助结构是？",o:["栈","队列","堆","并查集"],a:1,why:"队列保证按层扩展。"},{q:"无权图求最短路径应使用？",o:["DFS","BFS","拓扑排序","排序"],a:1,why:"BFS 首次到达即最短。"},{q:"拓扑排序弹出的点数少于总点数说明？",o:["图不连通","有环","是树","正常"],a:1,why:"环上的点入度永远无法减到 0。"}]},

{id:"dsa",icon:"🎯",name:"排序与算法思想",desc:"手写快排是笔试的入场券",
 goal:"能徒手写快排/归并，熟练二分与变体，了解贪心与回溯的适用场景。",
 links:[["VisuAlgo · 排序可视化","https://visualgo.net/zh/sorting"],["LeetCode · 学习计划","https://leetcode.cn/studyplan/"]],
 lab:{t:"手写快速排序 + 二分查找",req:["读入 n 与 n 个整数","手写 quicksort（partition + 递归），不许调用 std::sort","按升序输出；再读入 target，用二分查找输出其下标（不存在输出 -1）"],starter:`#include <iostream>\n#include <algorithm>\n\nvoid quicksort(int* a, int lo, int hi) {\n    // partition + 递归\n}\n\nint bsearch(int* a, int n, int target) {\n    // 二分查找，返回下标或 -1\n    return -1;\n}\n\nint main() {\n    int n; std::cin >> n;\n    int a[1000];\n    for (int i = 0; i < n; i++) std::cin >> a[i];\n    // 排序、输出、查找\n\n    return 0;\n}`,hint:"partition 用「挖坑法」最好写：把基准存下来，左右指针互相填坑；也可以背 hi 为基准的模板。",xp:35},
 lessons:[
 {id:"se1",title:"简单排序三件套",min:10,summary:["冒泡：相邻逆序交换；选择：每轮选最小放前面；插入：像理牌把新元素插进有序段。","三者平均都是 O(n²)，但插入排序在基本有序时接近 O(n)——是快排小区间优化的基础。","稳定性：相等元素相对顺序不变为稳定；冒泡/插入稳定，选择不稳定。"],code:`// 插入排序\nfor(int i=1;i<n;i++){\n  int key=a[i], j=i-1;\n  while(j>=0 && a[j]>key){ a[j+1]=a[j]; j--; }\n  a[j+1]=key;\n}`,pit:"选择排序的「交换」会跨越相等元素破坏稳定性——面试常考稳定性的实际意义。",ex:{q:"什么场景简单排序反而合适？",a:"n 很小（如 <50）或数据基本有序时，插入排序又快又简单。"},target:"能手写三种 O(n²) 排序并说清稳定性。"},
 {id:"se2",title:"快速排序与归并排序",min:15,summary:["快排：选基准 partition（小的放左大的放右），递归两侧；平均 O(n log n)、原地。","归并：分两半各自排序再合并有序段；稳定 O(n log n)，需 O(n) 辅助数组。","快排取首元素做基准、数据已有序时退化 O(n²)——随机取基准可避免。"],code:`int partition(int* a,int lo,int hi){\n  int pivot=a[hi], i=lo-1;\n  for(int j=lo;j<hi;j++)\n    if(a[j]<pivot) std::swap(a[++i],a[j]);\n  std::swap(a[i+1],a[hi]);\n  return i+1;\n}\nvoid qsort(int* a,int lo,int hi){\n  if(lo>=hi) return;\n  int p=partition(a,lo,hi);\n  qsort(a,lo,p-1); qsort(a,p+1,hi);\n}`,pit:"partition 的循环边界与 swap 下标极易差一——手写后先用 {3,1,2} 这类小例子验证。",ex:{q:"快排最坏什么时候发生？",a:"每次基准都是最值（如已有序还取首/尾），划分一边倒 → O(n²)；随机化基准后概率极低。"},target:"能手写快排与归并，理解分治与退化问题。"},
 {id:"se3",title:"二分查找与变体",min:10,summary:["有序才可二分：每次比较淘汰一半，O(log n)。","三个易错点：区间开闭要配套、mid 用 lo+(hi-lo)/2 防溢出、边界更新 lo=mid+1。","高频变体：找第一个 ≥x（lower_bound）、最后一个 ≤x、旋转数组找最小。"],code:`int lo=0, hi=n-1;\nwhile(lo<=hi){\n  int mid=lo+(hi-lo)/2;\n  if(a[mid]==target) return mid;\n  if(a[mid]<target) lo=mid+1; else hi=mid-1;\n}\nreturn -1;`,pit:"while 用 < 还是 <=、hi 取 n-1 还是 n 必须配套，混用必错——背熟一套模板。",ex:{q:"(lo+hi)/2 有什么隐患？",a:"lo+hi 可能超出 int 上限溢出，写 lo+(hi-lo)/2 更安全。"},target:"能默写二分模板并写出 lower_bound 语义。"},
 {id:"se4",title:"贪心与回溯",min:10,summary:["贪心：每步取局部最优并期望全局最优，必须验证正确性——区间调度按右端点排序是经典。","回溯：决策树遍历（选→递归→撤销），配合剪枝。","子集/排列/组合是回溯三大母题，背熟模板即可举一反三。"],code:`// 全排列回溯\nvoid dfs(vector<int>& path){\n  if(path.size()==n){ ans.push_back(path); return; }\n  for(int i=0;i<n;i++) if(!used[i]){\n    used[i]=true; path.push_back(nums[i]);\n    dfs(path);\n    path.pop_back(); used[i]=false; // 撤销\n  }\n}`,pit:"贪心不总对：面值 {1,5,11} 求 15，贪心（11+1×4）要 5 枚，最优却是 5+5+5 三枚——先验证再贪。",ex:{q:"回溯和 DFS 什么关系？",a:"回溯是 DFS 在「决策树」上的应用，多了选择与撤销两个动作。"},target:"能写出全排列回溯模板，理解贪心适用前提。"}
],
quiz:[{q:"快速排序平均时间复杂度？",o:["O(n)","O(n log n)","O(n²)","O(log n)"],a:1,why:"每次近似对半划分，平均 O(n log n)；最坏 O(n²)。"},{q:"下列排序中稳定的是？",o:["快速排序","选择排序","归并排序","堆排序"],a:2,why:"归并合并时相等取左边保持原序；其余默认实现不稳定。"},{q:"二分查找的前提是？",o:["元素为整数","序列有序","元素互异","长度为偶数"],a:1,why:"有序才能按 mid 淘汰一半。"}]},

{id:"eng",icon:"🛠️",name:"C++ 工程化",desc:"Git、CMake、多线程、测试——开发的日常",
 goal:"会用 Git 管理代码、CMake 组织多文件工程，理解多线程与数据竞争，会写单元测试。",
 links:[["Git Pro 中文版","https://git-scm.com/book/zh/v2"],["CMake 官方教程","https://cmake.org/cmake/help/latest/guide/tutorial/"],["cppreference · 并发支持","https://zh.cppreference.com/w/cpp/thread"]],
 lab:{t:"修复多线程数据竞争",req:["starter 里两个线程对 counter 各加 100000 次，但结果往往小于 200000（数据竞争）","用 std::mutex + lock_guard 或 std::atomic 修复","运行输出必须稳定等于 200000（多跑几次验证）","两种方案各试一遍，体会差异"],starter:`#include <iostream>\n#include <thread>\n\nint counter = 0;\n\nvoid add100k() {\n    for (int i = 0; i < 100000; i++) {\n        counter++;   // 数据竞争！++ 不是原子操作\n    }\n}\n\nint main() {\n    std::thread t1(add100k), t2(add100k);\n    t1.join(); t2.join();\n    std::cout << "counter = " << counter << std::endl;\n    return 0;\n}`,hint:"方案一：加 std::mutex，临界区写 { std::lock_guard<std::mutex> lk(m); ++counter; }；方案二：把 counter 改成 std::atomic<int> 后直接 ++。",xp:35},
 lessons:[
 {id:"ef1",title:"Git 版本控制",min:12,summary:["git init 建仓库；工作区 → add 暂存 → commit 本地仓库，一条 commit 是一个可回退的快照。","分支：git checkout -b 开 feature 分支开发，完成后 merge 回 main。","远程协作：clone/pull/push；.gitignore 排除 build/ 与临时文件。"],code:`git init\ngit add .\ngit commit -m "feat: 完成链表实验"\ngit checkout -b feature/hashtable\ngit log --oneline`,pit:"别把可执行文件、build 目录提交进仓库——第一次 commit 前先写好 .gitignore。",ex:{q:"commit 信息为什么要写清楚？",a:"半年后回看或团队协作时，提交历史就是项目说明书；约定式提交（feat/fix）是业界惯例。"},target:"能完成 init→add→commit→分支→合并的完整流程。"},
 {id:"ef2",title:"CMake 构建系统",min:15,summary:["CMake 生成跨平台构建系统（Makefile/VS 工程），是 C++ 项目的事实标准。","最小骨架：cmake_minimum_required + project + add_executable；多目录用 add_subdirectory。","外部构建：cmake -B build && cmake --build build，产物隔离在 build/ 里。"],code:`# CMakeLists.txt\ncmake_minimum_required(VERSION 3.16)\nproject(hello CXX)\nadd_executable(main main.cpp utils.cpp)\n# 命令行\ncmake -B build\ncmake --build build`,pit:"多目录下直接 #include 相对路径会失败——用 target_include_directories 声明头文件目录。",ex:{q:"为什么不用手写 g++ 命令？",a:"文件一多命令失控且跨平台失效；CMake 只声明「有哪些目标」，构建细节交给生成器。"},target:"能把多文件项目组织成 CMake 工程并构建运行。"},
 {id:"ef3",title:"多线程：thread 与 mutex",min:15,summary:["std::thread 创建线程，必须 join() 或 detach()，否则析构会终止程序。","多线程同时读写同一变量=数据竞争（未定义行为），用 mutex 保护临界区。","lock_guard 是 RAII 锁：构造加锁、析构自动解锁，不怕忘记 unlock。"],code:`std::mutex m;\nint counter = 0;\nvoid work(){\n  for(int i=0;i<100000;i++){\n    std::lock_guard<std::mutex> lk(m);\n    ++counter;\n  }\n}\n// 两个线程各跑一次 → counter 稳定等于 200000`,pit:"锁粒度太大性能差、太小保护不住；两把锁交叉获取可能死锁——固定加锁顺序。",ex:{q:"不加锁直接 ++counter 会怎样？",a:"++ 是「读-改-写」三步非原子，多线程交错执行会丢失更新，结果小于预期。"},target:"能写出多线程计数并用 mutex 消除数据竞争。"},
 {id:"ef4",title:"atomic 与条件变量",min:10,summary:["atomic<int> 让单个变量的读写-修改原子化，轻量场景可替代锁。","condition_variable 配合 mutex 实现线程等待/通知（生产者-消费者模型）。","线程池 = 任务队列 + 条件变量 + 一组工作线程，是工程并发的基础组件。"],code:`std::atomic<int> counter{0};\nvoid work(){ for(int i=0;i<100000;i++) counter++; } // 无锁安全\n// condition_variable: wait(lk, pred) + notify_one/notify_all`,pit:"atomic 只保证单个变量的原子性；多个变量联动的状态一致性仍需 mutex。",ex:{q:"什么场景用 atomic 而不是 mutex？",a:"仅计数器/标志位这类单变量操作；涉及多变量或复杂不变式时用锁。"},target:"会用 atomic 改造计数器，理解等待-通知模型。"},
 {id:"ef5",title:"单元测试与代码质量",min:10,summary:["单元测试=对函数的最小验证：给定输入断言输出；改代码先跑测试。","轻量起步用 assert 或自写 CHECK 宏；工程用 GoogleTest/Catch2。","配合 sanitizer（g++ -fsanitize=address,undefined）能在测试时抓内存越界/未定义行为。"],code:`#include <cassert>\nvoid test_add(){\n  assert(add(2,3)==5);\n  assert(add(-1,1)==0);   // 边界与负数也要测\n}\nint main(){ test_add(); }`,pit:"只测「正常路径」不够——空输入、边界值、非法输入才是 bug 高发区。",ex:{q:"-fsanitize=address 有什么用？",a:"运行时检测越界/泄漏并给出分配堆栈，比事后 gdb 猜快得多。"},target:"能给关键函数写单元测试，会用 sanitizer 排查问题。"}
],
quiz:[{q:"把修改提交到本地仓库的命令是？",o:["git push","git commit","git clone","git fork"],a:1,why:"push 才是推远程；commit 提交到本地仓库。"},{q:"CMake 的作用是？",o:["直接编译 C++ 代码","生成跨平台构建系统","版本控制","格式化代码"],a:1,why:"CMake 根据声明生成 Makefile/工程文件，再由底层工具编译。"},{q:"多个线程同时 ++ 同一个 int，正确做法？",o:["不用管","加 mutex 或用 atomic","改成 float","多打印"],a:1,why:"++ 非原子，存在数据竞争。"}]},

{id:"career",icon:"💼",name:"面试冲刺与就业准备",desc:"高频考点、简历、刷题路线、方向选择",
 goal:"梳理高频考点、按 STAR 法打磨简历与项目表达，选定就业方向并制定刷题计划。",
 links:[["牛客网","https://www.nowcoder.com/"],["LeetCode 热题 100","https://leetcode.cn/studyplan/top-100-liked/"]],
 lab:{t:"模拟面试：高频题作答",mode:"text",req:["从 cj1 考点中任选 3 题（如：虚函数实现原理 / 两种智能指针区别 / 内存泄漏排查）写进「我的回答」","每题 200~300 字：先给结论，再讲原理，最后举一个自己写过的代码例子","点「生成 AI 批改提示词」，让 AI 以资深面试官身份逐题点评、打分并追问","根据点评修订一轮，把最终版存进笔记中心"],starter:`# 面试题 1：为什么基类析构函数要写成 virtual？\n我的回答：\n\n# 面试题 2：unique_ptr 和 shared_ptr 的区别？\n我的回答：\n\n# 面试题 3：什么是内存泄漏？如何排查？\n我的回答：`,hint:"结论先行（30 秒讲完），原理讲透（虚函数表/引用计数/栈帧），例子来自自己写过的项目最有说服力。",xp:30},
 lessons:[
 {id:"cj1",title:"C++ 高频面试考点",min:15,summary:["语言核心：虚函数表与多态原理、内存四区、智能指针实现思路、移动语义、RAII。","STL 底层：vector 扩容策略、map 红黑树、unordered_map 哈希、迭代器失效场景。","每题都要能「讲原理+给例子+说坑」：如「vector 迭代器什么时候失效？」"],code:`// 高频题示例：为什么基类析构要 virtual？\n// 基类指针 delete 派生对象时，非虚析构只调基类析构 → 派生类资源泄漏`,pit:"背概念不等于会答——面试官必追问「为什么」与「什么场景」，结合本项目代码准备例子。",ex:{q:"unique_ptr 为什么零开销？shared_ptr 呢？",a:"unique_ptr 只是一个裸指针大小、无控制块；shared_ptr 需要控制块存引用计数（原子操作有开销）。"},target:"能脱稿讲清 10 个高频 C++ 考点的原理。"},
 {id:"cj2",title:"简历与项目作品集",min:12,summary:["项目描述用 STAR：背景 Situation-任务 Task-行动 Action-结果 Result，结果要量化。","把实战项目整理到 GitHub：清晰 README + 构建运行说明 + 干净的提交历史。","简历一页纸：教育背景→技能（诚实分级）→项目→获奖。"],code:`// README 骨架\n# 学生成绩管理系统\n## 功能：增删查改 / 排序 / 文件持久化\n## 构建：cmake -B build && cmake --build build\n## 技术点：STL 容器选型 / 异常处理 / 单元测试`,pit:"简历最大的错误是写「精通 C++」——面试官会照着精通拷问；写「熟悉/了解」更安全。",ex:{q:"没有实习经历怎么填项目？",a:"课程/自学项目同样有效：写清难点（如多线程计数器的数据竞争排查）比项目大小更打动面试官。"},target:"能按 STAR 法写出 2 个项目描述并整理 GitHub 门面。"},
 {id:"cj3",title:"刷题路线与平台",min:10,summary:["路线：先按专题刷（链表→栈队列→哈希→树→图→DP），每专题 15~30 题，比乱刷效率高。","平台：LeetCode 中国（热题 HOT100）+ 牛客（公司真题/八股）；代码随想录有免费专题路线。","质量>数量：每题先独立想 20 分钟，看题解后必须重写，并按 3 天/7 天间隔重做。"],code:`// 刷题节奏（和本课程的间隔复习同思路）\n// 第 1 遍：独立思考 20min → 卡住看题解 → 重写\n// 第 3 天 / 第 7 天：重做巩固`,pit:"只看不写等于白刷；追求题量不总结模板，忘得比刷得快——同类型题要归纳「套路卡」。",ex:{q:"半年刷多少题够面试？",a:"按专题精刷 150~250 题（含重做）足以覆盖大多数 C++ 后端/开发岗笔试。"},target:"制定按专题的刷题计划并开始执行。"},
 {id:"cj4",title:"就业方向与学习地图",min:10,summary:["C++ 后端/服务端：网络编程（socket/epoll）、数据库、Redis、Linux——岗位最多。","嵌入式/物联网：C 功底 + RTOS/单片机 + 硬件；游戏：引擎（UE）+ 图形学；桌面：Qt。","量化/高频交易：对算法与低延迟优化要求极高，薪资天花板也最高。"],code:`// 后端方向补课清单\n// Linux 常用命令 → 网络编程(TCP/epoll) → MySQL → Redis → RPC 概念`,pit:"方向决定补课清单，别什么都学一点——先用 cj1/cj2 打好通用底座，再选一个方向深钻。",ex:{q:"怎么判断自己适合哪个方向？",a:"看哪类项目做得最顺最有兴趣：爱折腾系统/网络→后端；喜欢硬件→嵌入式；爱图形/游戏→游戏方向。"},target:"选定主攻方向并列出该方向的技术栈补课清单。"},
 {id:"cj5",title:"持续成长：源码与开源",min:8,summary:["读源码从「小而精」开始：STL 的 vector/list 实现、千行级的 tinywebserver 项目。","给开源提 PR 的最小闭环：找 good first issue → fork → 修复 → PR → 应对 review。","写技术博客/笔记公开输出：既是简历加分项，也是最好的复习（费曼学习法）。"],code:`// 每周固定投入建议\n// 2h 读源码 + 1h 整理笔记发布 + 1h 刷题重做`,pit:"收藏≠学会：知识落进「笔记+博客+项目」才真正属于你——课程的笔记中心就是起点。",ex:{q:"半年计划走完就结束了吗？",a:"才刚起步：半年建立的是「能上岗的地基」，入职后随项目继续深入——程序员是终身学习职业。"},target:"建立每周固定的源码阅读与公开输出习惯。"}
],
quiz:[{q:"简历项目描述推荐哪种结构？",o:["时间流水账","STAR 法","罗列代码行数","只写项目名"],a:1,why:"STAR（背景-任务-行动-结果）逻辑清晰，且强调量化结果。"},{q:"刷题效率最高的方式？",o:["随机刷","按专题分类刷+重做","只看题解","只刷简单题"],a:1,why:"专题刷便于归纳套路，重做才能形成长期记忆。"},{q:"C++ 岗位需求最多的方向之一是？",o:["前端页面","后端/服务端","平面设计","短视频运营"],a:1,why:"C++ 后端（网络/存储/基础架构）岗位需求最大。"}]}
];

/* ================================================================
 * AGI 工程路线扩展：Python / 数学基石 / 科学计算 / 机器学习 / 深度学习 / 通用人工智能前沿
 * 目标：在 C++ 底层课之上，铺一条通往 AGI 工程岗的完整学习路径（约 24 个新阶段）。
 * 阶段 ID 前缀：py(Python) / ma(数学) / sp(科学计算) / ml(机器学习) / dl(深度学习) / agi(前沿)
 * 每个 stage 与基础阶段同构：lessons / quiz / lab。
 * 数学与偏理论阶段用 lab.mode:"text" 提交文字作答；编程阶段用 Python 作答（答案见 LAB_ANSWERS）。
 * ================================================================ */
const AGI_STAGES=[
  {
    "id": "py1",
    "icon": "🐍",
    "name": "Python 环境与首程",
    "desc": "AI 时代的首选语言，先跑起来",
    "goal": "装好 Python 环境，理解缩进即语法，能写带变量、输入输出的小程序。",
    "links": [
      [
        "廖雪峰 Python 教程",
        "https://liaoxuefeng.com/wiki/1016959663602400"
      ],
      [
        "菜鸟教程 Python3",
        "https://www.runoob.com/python3/python3-tutorial.html"
      ],
      [
        "官方教程(中文)",
        "https://docs.python.org/zh-cn/3/tutorial/"
      ]
    ],
    "lab": {
      "t": "自我介绍与问候程序",
      "req": [
        "用 print 输出 3 行：昵称、为什么想做 AI、今天日期",
        "读入你的名字并输出「你好，<名字>！」",
        "给关键行加注释"
      ],
      "starter": "# 第一题：用 print 输出三行自我介绍\nprint(\"昵称：\")\nprint(\"为什么学 AI：\")\nprint(\"今天：\")\n\n# 第二题：读入名字并问候\nname = input(\"你的名字：\")\nprint(\"你好，\" + name + \"！\")",
      "hint": "字符串可用 + 拼接；input() 得到的是字符串，需要数字时用 int(input())。",
      "xp": 20
    },
    "lessons": [
      {
        "id": "p1-1",
        "title": "为什么是 Python",
        "min": 8,
        "summary": [
          "Python 语法接近自然语言，读起来像伪代码，上手快。",
          "AI 生态最丰富：NumPy/Torch/ sklearn 都是 Python 优先。",
          "解释型语言：写一行跑一行，调试友好（和 C++ 编译型互补）。"
        ],
        "code": "# Python 不需要编译，直接运行\nprint(\"hello ai\")",
        "pit": "缩进代表代码块，混用空格和 Tab 会报错——统一用 4 个空格。",
        "ex": {
          "q": "Python 和 C++ 最大的使用差异？",
          "a": "Python 解释执行、语法简洁、库多；C++ 编译型、贴近硬件、性能高。两者互补。"
        },
        "target": "能说清为什么 AI 首选 Python，并装好环境。"
      },
      {
        "id": "p1-2",
        "title": "第一个程序与 print",
        "min": 8,
        "summary": [
          "print() 把内容输出到屏幕，可一次打印多个值。",
          "字符串用单/双引号包裹；逗号分隔会自动加空格。",
          "用 .format() 或拼接组织输出文本。"
        ],
        "code": "print(\"年龄\", 18)\nprint(\"{} 的平方是 {}\".format(3, 9))",
        "pit": "print 默认末尾换行；不想换行用 print(x, end=\"\")。",
        "ex": {
          "q": "怎么在同一行打印多个变量？",
          "a": "print(a, b, c) 用逗号分隔，自动以空格连接。"
        },
        "target": "会用 print 输出组合信息。"
      },
      {
        "id": "p1-3",
        "title": "变量与基本类型",
        "min": 10,
        "summary": [
          "int 整数、float 小数、str 字符串、bool 布尔。",
          "Python 是动态类型：不用声明类型，赋值即定。",
          "type(x) 可查看类型；布尔参与运算时 True=1、False=0。"
        ],
        "code": "age = 18          # int\npi = 3.14         # float\nname = \"小明\"      # str\nok = True         # bool",
        "pit": "动态类型不等于无类型——不同类型混运算（如 \"3\"+3）会报 TypeError。",
        "ex": {
          "q": "a = 1; a = \"hi\" 合法吗？",
          "a": "合法，动态类型允许变量后续指向不同类型；但工程上尽量少变类型以免混乱。"
        },
        "target": "理解动态类型，会声明并使用基本类型。"
      },
      {
        "id": "p1-4",
        "title": "输入 input 与类型转换",
        "min": 8,
        "summary": [
          "input() 从键盘读入，返回永远是字符串。",
          "要当数字用，需 int(input()) 或 float(input())。",
          "转换失败会抛 ValueError，可用 try 兜底。"
        ],
        "code": "n = int(input(\"输入一个整数：\"))\nprint(\"平方\", n * n)",
        "pit": "直接拿 input 结果做加减会得到字符串拼接而非求和——先转类型。",
        "ex": {
          "q": "input() 得到 \"12\"，怎么加 3？",
          "a": "int(input()) + 3 才是 15；\"12\"+3 会报类型错误。"
        },
        "target": "能用 input 读入并转换为数字。"
      },
      {
        "id": "p1-5",
        "title": "注释与 PEP8 风格",
        "min": 6,
        "summary": [
          "# 单行注释，给人和未来的自己看。",
          "PEP8：缩进 4 空格、变量名小写蛇形(snake_case)。",
          "良好的命名胜过注释——名字要见名知义。"
        ],
        "code": "# 计算学习总时长(分钟)\ntotal_minutes = 90",
        "pit": "不要用 l、O、I 作变量名（容易和 1、0 混淆）。",
        "ex": {
          "q": "为什么 AI 代码风格重要？",
          "a": "你和 AI/同事都要读；统一风格（PEP8）让协作与调试更顺。"
        },
        "target": "写出符合 PEP8 基本规范的代码。"
      }
    ],
    "quiz": [
      {
        "q": "Python 是哪种执行方式？",
        "o": [
          "编译型",
          "解释型",
          "标记型",
          "汇编型"
        ],
        "a": 1,
        "why": "Python 是解释执行，写一行跑一行。"
      },
      {
        "q": "input() 返回的类型是？",
        "o": [
          "int",
          "str",
          "float",
          "bool"
        ],
        "a": 1,
        "why": "input 永远返回字符串，需手动转换类型。"
      },
      {
        "q": "Python 用什么是代码块？",
        "o": [
          "花括号",
          "缩进",
          "括号",
          "关键字 end"
        ],
        "a": 1,
        "why": "Python 以缩进表示代码块，混用空格/Tab 会报错。"
      }
    ]
  },
  {
    "id": "py2",
    "icon": "📚",
    "name": "数据类型与控制流",
    "desc": "列表、字典、条件与循环",
    "goal": "会用列表/字典组织数据，用条件与循环处理序列，理解切片与推导式。",
    "links": [
      [
        "菜鸟教程 · Python 列表",
        "https://www.runoob.com/python3/python3-list.html"
      ],
      [
        "菜鸟教程 · 字典",
        "https://www.runoob.com/python3/python3-dictionary.html"
      ],
      [
        "Python 字符串切片",
        "https://www.runoob.com/python3/python3-string.html"
      ]
    ],
    "lab": {
      "t": "斐波那契前 N 项",
      "req": [
        "读入整数 n",
        "用列表存前 n 个斐波那契数（1,1,2,3,5...）",
        "用 for 循环生成并 print 整个列表",
        "n<3 时直接输出前 n 项"
      ],
      "starter": "n = int(input(\"n = \"))\nfib = []\n# 用 for 循环生成前 n 项并加入 fib\nprint(fib)",
      "hint": "前两项是 1,1；之后每项等于前两项之和，用 fib[i-1]+fib[i-2]。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "p2-1",
        "title": "数字与运算",
        "min": 8,
        "summary": [
          "+ - * / 同 C++；** 是幂运算，**0.5 即开平方。",
          "/ 得到 float（如 5/2=2.5）；// 是整数除法。",
          "% 取余；abs/min/max/round 是内置函数。"
        ],
        "code": "print(2 ** 10)   # 1024\nprint(5 // 2)     # 2（整除）\nprint(7 % 3)      # 1",
        "pit": "Python 的 / 永远返回 float，想要整除用 //。",
        "ex": {
          "q": "怎么求 2 的 10 次方？",
          "a": "2 ** 10。"
        },
        "target": "熟练 Python 的数值运算。"
      },
      {
        "id": "p2-2",
        "title": "字符串与切片",
        "min": 10,
        "summary": [
          "字符串是不可变序列，可用 [] 取字符、切片取子串。",
          "s[起:止:步] 切片，负索引从末尾数（-1 是最后一个）。",
          "split/join/upper/lower/replace 是常用方法。"
        ],
        "code": "s = \"hello\"\nprint(s[1:4])     # ell\nprint(s[::-1])    # olleh（反转）",
        "pit": "切片 s[起:止] 含起点不含终点；字符串不可变，s[0]=\"x\" 会报错。",
        "ex": {
          "q": "\"hello\"[1:4] 是什么？",
          "a": "ell（从索引 1 取到 3，不含 4）。"
        },
        "target": "会用切片与常用字符串方法。"
      },
      {
        "id": "p2-3",
        "title": "列表 list",
        "min": 12,
        "summary": [
          "list 是可变有序序列，可装任意类型。",
          "append 追加、insert 插入、pop 删除、len 求长。",
          "列表推导式 [x for x in ...] 一行生成新列表。"
        ],
        "code": "a = [1, 2, 3]\na.append(4)\nsq = [x*x for x in range(5)]  # [0,1,4,9,16]",
        "pit": "range(5) 是 0~4；推导式里别写复杂逻辑，可读性优先。",
        "ex": {
          "q": "怎么快速得到 0~9 的平方列表？",
          "a": "[x*x for x in range(10)]。"
        },
        "target": "熟练列表增删与推导式。"
      },
      {
        "id": "p2-4",
        "title": "字典 dict 与集合 set",
        "min": 10,
        "summary": [
          "dict 是键值对（JSON 同构），用 d[k] 存取，get(k,缺省) 防 KeyError。",
          "set 是无序不重复集合，用于去重与集合运算。",
          "两者查找平均 O(1)，是数据处理主力。"
        ],
        "code": "d = {\"age\": 18}\nd[\"name\"] = \"小明\"\nprint(d.get(\"x\", 0))\ns = set([1,1,2,3])  # {1,2,3}",
        "pit": "直接用 d[k] 取不存在的键会抛 KeyError，用 get 更安全。",
        "ex": {
          "q": "怎么统计单词出现次数？",
          "a": "用 dict，见词就 d[w]=d.get(w,0)+1。"
        },
        "target": "会用字典与集合组织键值数据。"
      },
      {
        "id": "p2-5",
        "title": "条件与循环",
        "min": 12,
        "summary": [
          "if/elif/else 做分支；注意冒号与缩进。",
          "for 遍历序列，while 按条件循环；range 生成整数序列。",
          "enumerate 同时拿索引和值；break/continue 同 C++。"
        ],
        "code": "for i, v in enumerate([\"a\",\"b\"]):\n    print(i, v)\nn = 0\nwhile n < 3:\n    n += 1",
        "pit": "for 遍历的是元素不是下标；要下标用 range(len(x)) 或 enumerate。",
        "ex": {
          "q": "遍历列表同时拿到索引怎么写？",
          "a": "for i, v in enumerate(lst): ..."
        },
        "target": "能写条件分支与循环处理序列。"
      }
    ],
    "quiz": [
      {
        "q": "列表推导式 [x*x for x in range(4)] 结果是？",
        "o": [
          "[0,1,4,9]",
          "[1,4,9,16]",
          "[0,1,2,3]",
          "[1,2,3,4]"
        ],
        "a": 0,
        "why": "range(4) 是 0~3，平方为 0,1,4,9。"
      },
      {
        "q": "取字典不存在的键直接 d[k] 会？",
        "o": [
          "返回 None",
          "抛 KeyError",
          "新建键",
          "返回 0"
        ],
        "a": 1,
        "why": "直接下标访问不存在键抛 KeyError，应用 get。"
      },
      {
        "q": "反转字符串 s 用？",
        "o": [
          "s.reverse()",
          "s[::-1]",
          "reversed(s)",
          "s[-1]"
        ],
        "a": 1,
        "why": "切片步长 -1 即反转。"
      }
    ]
  },
  {
    "id": "py3",
    "icon": "🧰",
    "name": "函数、模块与文件",
    "desc": "把代码组织成可复用单元",
    "goal": "会定义函数与 lambda，用 import 调用标准库，能读写文件并做异常处理。",
    "links": [
      [
        "廖雪峰 · 函数",
        "https://liaoxuefeng.com/wiki/1016959663602400/1017105145133280"
      ],
      [
        "菜鸟教程 · 文件",
        "https://www.runoob.com/python3/python3-file-methods.html"
      ],
      [
        "Python 官方 · 标准库",
        ":https://docs.python.org/zh-cn/3/library/"
      ]
    ],
    "lab": {
      "t": "函数 + 文件统计单词",
      "req": [
        "写一个函数 count_words(path) 统计文件单词数",
        "用 open 读一个文本文件，按空白 split 后统计",
        "main 里调用并输出单词总数",
        "用 try/except 处理文件打不开的情况"
      ],
      "starter": "def count_words(path):\n    # 读文件并按空白切分，返回单词数\n    return 0\n\ntry:\n    print(count_words(\"demo.txt\"))\nexcept FileNotFoundError:\n    print(\"文件不存在\")",
      "hint": "open(path).read().split() 即可按任意空白切成单词列表，len 即数量。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "p3-1",
        "title": "函数定义与参数",
        "min": 10,
        "summary": [
          "def 名(参数): 定义，return 返回结果。",
          "默认参数写在后：def f(a, b=2): ；*args 收多余位置参数。",
          "函数让重复逻辑可复用、可测试。"
        ],
        "code": "def add(a, b=1):\n    return a + b\nprint(add(3), add(3, 5))",
        "pit": "默认参数别用可变对象（如列表），会被多次调用共享——用 None 占位。",
        "ex": {
          "q": "怎么让函数接收任意多个数求平均？",
          "a": "def avg(*nums): return sum(nums)/len(nums)。"
        },
        "target": "能定义带默认参数的函数并调用。"
      },
      {
        "id": "p3-2",
        "title": "作用域与 lambda",
        "min": 8,
        "summary": [
          "函数内变量是局部，外部看不到；global 声明可改全局（少用）。",
          "lambda 是匿名小函数：lambda x: x*x，常用于排序 key。",
          "闭包：函数内定义的函数能记住外层变量。"
        ],
        "code": "square = lambda x: x * x\nsorted([(2,\"b\"),(1,\"a\")], key=lambda t: t[0])",
        "pit": "lambda 只能写单行表达式，复杂逻辑还是用 def。",
        "ex": {
          "q": "按字符串长度排序怎么写？",
          "a": "sorted(words, key=lambda w: len(w))。"
        },
        "target": "理解作用域，会用 lambda 作排序键。"
      },
      {
        "id": "p3-3",
        "title": "模块与包 import",
        "min": 8,
        "summary": [
          "用 import math / import random 调用标准库。",
          "from 模块 import 名 可只引入需要的部分。",
          "第三方库（numpy/torch）用 pip install 后再 import。"
        ],
        "code": "import math\nimport random\nprint(math.sqrt(16))      # 4.0\nprint(random.randint(1, 6))",
        "pit": "程序顶部统一 import；不要在函数里反复 import（虽能跑但慢且乱）。",
        "ex": {
          "q": "怎么生成一个 1~6 的随机整数？",
          "a": "random.randint(1, 6)。"
        },
        "target": "会用标准库模块完成计算与随机。"
      },
      {
        "id": "p3-4",
        "title": "文件读写",
        "min": 10,
        "summary": [
          "open(path, \"r\"/\"w\"/\"a\") 打开文件，read/readlines 读，write 写。",
          "用 with open(...) as f: 上下文管理器，退出自动关闭。",
          "路径可用相对或绝对；写模式默认覆盖，\"a\" 追加。"
        ],
        "code": "with open(\"note.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"你好\\n\")\nwith open(\"note.txt\", encoding=\"utf-8\") as f:\n    print(f.read())",
        "pit": "中文务必指定 encoding=\"utf-8\"，否则 Windows 下容易乱码。",
        "ex": {
          "q": "为什么推荐 with open？",
          "a": "自动关闭文件，避免忘记 close 造成句柄泄漏。"
        },
        "target": "能用 with 安全地读写文本文件。"
      },
      {
        "id": "p3-5",
        "title": "异常处理 try/except",
        "min": 8,
        "summary": [
          "try 里放可能出错的代码，except 捕获指定异常。",
          "常见：ValueError（转换失败）、FileNotFoundError（文件不在）。",
          "finally 无论成败都执行（常用于释放资源）。"
        ],
        "code": "try:\n    n = int(input())\nexcept ValueError:\n    print(\"请输入整数\")",
        "pit": "别用 bare except: 吞掉所有错误会掩盖真正的 bug；捕获具体异常。",
        "ex": {
          "q": "文件可能不存在，怎么不崩溃？",
          "a": "try: open(...) except FileNotFoundError: ..."
        },
        "target": "能给易错代码加异常保护。"
      }
    ],
    "quiz": [
      {
        "q": "读取并自动关闭文件的正确写法是？",
        "o": [
          "open() 后手动 close",
          "with open() as f",
          "不用关",
          "f.readall()"
        ],
        "a": 1,
        "why": "with 上下文管理器退出时自动关闭文件。"
      },
      {
        "q": "lambda 适合？",
        "o": [
          "多行复杂逻辑",
          "单行小函数/排序键",
          "定义类",
          "循环"
        ],
        "a": 1,
        "why": "lambda 只能写单行表达式，适合简单回调。"
      },
      {
        "q": "捕获所有异常用什么不好？",
        "o": [
          "except ValueError",
          "bare except:",
          "except FileNotFoundError",
          "finally"
        ],
        "a": 1,
        "why": "裸 except 会吞掉 KeyboardInterrupt 等，掩盖真 bug。"
      }
    ]
  },
  {
    "id": "py4",
    "icon": "🏗️",
    "name": "面向对象与常用库",
    "desc": "用类建模，会调标准库",
    "goal": "能用 class 定义类与封装，理解继承，熟悉列表推导/生成器与常用标准库。",
    "links": [
      [
        "廖雪峰 · 面向对象",
        "https://liaoxuefeng.com/wiki/1016959663602400/1017495724036928"
      ],
      [
        "Python collections",
        "https://docs.python.org/zh-cn/3/library/collections.html"
      ],
      [
        "Python datetime",
        "https://docs.python.org/zh-cn/3/library/datetime.html"
      ]
    ],
    "lab": {
      "t": "Student 类",
      "req": [
        "定义 class Student：属性 name、score",
        "方法 is_pass() 返回 score>=60",
        "方法 add_bonus(n) 给分数加 n（不超过 100）",
        "创建两个学生并打印是否及格",
        "用列表推导式统计及格人数"
      ],
      "starter": "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\n    def is_pass(self):\n        return self.score >= 60\n\n# 创建学生并打印及格情况\nstudents = [Student(\"A\", 80), Student(\"B\", 45)]\nprint([s.is_pass() for s in students])",
      "hint": "__init__ 是构造方法；self 指向当前对象，访问属性用 self.x。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "p4-1",
        "title": "class 与 self",
        "min": 10,
        "summary": [
          "class 定义蓝图，实例是按蓝图造的对象。",
          "__init__ 是构造方法，创建时自动调用。",
          "self 代表「当前对象」，方法第一个参数必写 self。"
        ],
        "code": "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        print(self.name, \"汪\")\nd = Dog(\"阿黄\"); d.bark()",
        "pit": "忘记写 self 参数会报「少一个参数」；这是 Python 新手最高频错误。",
        "ex": {
          "q": "self 是什么？",
          "a": "调用 obj.method() 时，Python 自动把 obj 作为第一个参数传进去，即 self。"
        },
        "target": "能定义带属性的类并创建对象。"
      },
      {
        "id": "p4-2",
        "title": "封装与方法",
        "min": 8,
        "summary": [
          "把数据和方法打包进类，外部通过方法操作。",
          "下划线约定：_x 表示内部（非强制），__x 会名称改写。",
          "属性可用 @property 变成只读/带校验。"
        ],
        "code": "class Bank:\n    def __init__(self): self._bal = 0\n    def deposit(self, x):\n        if x > 0: self._bal += x",
        "pit": "Python 没有真正私有，靠约定；别依赖「私有」做安全。",
        "ex": {
          "q": "为什么用方法改余额而不是直接改属性？",
          "a": "方法里能校验（拒绝负数）、记日志，把规则留在类里。"
        },
        "target": "理解封装：数据+行为一体。"
      },
      {
        "id": "p4-3",
        "title": "继承",
        "min": 8,
        "summary": [
          "class Cat(Animal): 复用父类成员，体现「是一个」。",
          "super() 调用父类方法；可重写(override)方法。",
          "AI 里常继承 nn.Module、Dataset 等基类。"
        ],
        "code": "class Animal:\n    def sound(self): print(\"...\")\nclass Cat(Animal):\n    def sound(self): print(\"喵\")",
        "pit": "多重继承在 Python 可用但要小心方法解析顺序（MRO）。",
        "ex": {
          "q": "PyTorch 里为什么常写 class MyNet(nn.Module)？",
          "a": "继承基类获得参数管理、GPU 搬运等通用能力，只管定义层结构。"
        },
        "target": "理解继承与重写，为 DL 框架打底。"
      },
      {
        "id": "p4-4",
        "title": "推导式与生成器",
        "min": 8,
        "summary": [
          "列表/字典/集合推导式一行生成集合。",
          "生成器 (x for x in ...) 惰性求值，省内存，适合大数据流。",
          "生成器函数用 yield 逐个产出，而非一次返回全部。"
        ],
        "code": "gen = (x*x for x in range(10**8))  # 几乎不占内存\nprint(next(gen), next(gen))",
        "pit": "生成器只能遍历一次；遍历完再 next 会 StopIteration。",
        "ex": {
          "q": "处理 1 亿个数求和，列表和生成器谁更省内存？",
          "a": "生成器——边算边出，不一次性开辟大列表。"
        },
        "target": "理解推导式与生成器在大数据下的价值。"
      },
      {
        "id": "p4-5",
        "title": "标准库巡礼",
        "min": 8,
        "summary": [
          "collections：Counter 计数、defaultdict 带默认值的字典。",
          "itertools：排列组合、链式迭代。",
          "datetime：处理日期时间；json：读写 JSON（AI 数据常用）。"
        ],
        "code": "from collections import Counter\nprint(Counter([\"a\",\"b\",\"a\"]))   # {'a':2,'b':1}\nimport json\nprint(json.dumps({\"x\": 1}))",
        "pit": "json 是模型输入输出（如工具调用）的通用格式，务必会用 dumps/loads。",
        "ex": {
          "q": "快速统计列表中各元素出现次数？",
          "a": "用 collections.Counter，一行搞定。"
        },
        "target": "知道常用标准库能省很多轮子。"
      }
    ],
    "quiz": [
      {
        "q": "构造方法名是？",
        "o": [
          "constructor",
          "__init__",
          "init",
          "setup"
        ],
        "a": 1,
        "why": "Python 用 __init__ 作构造方法。"
      },
      {
        "q": "生成器相比列表的优势？",
        "o": [
          "更快",
          "惰性求值省内存",
          "语法更简单",
          "类型更安全"
        ],
        "a": 1,
        "why": "生成器逐个产出，不一次性占大内存。"
      },
      {
        "q": "AI 数据交换常用哪种格式？",
        "o": [
          "CSV",
          "JSON",
          "Excel",
          "图片"
        ],
        "a": 1,
        "why": "JSON 是模型/工具调用的通用文本格式，json 模块可读写。"
      }
    ]
  },
  {
    "id": "ma1",
    "icon": "📐",
    "name": "线性代数 I · 向量与矩阵",
    "desc": "AI 的语言是矩阵",
    "goal": "理解向量/矩阵的运算与几何意义，能手算点积与矩阵乘法，知道它们在神经网络里的角色。",
    "links": [
      [
        "3Blue1Brown · 本质理解线性代数",
        "https://www.bilibili.com/video/BV1Ys411v7mq"
      ],
      [
        "MIT 线性代数(Gilbert Strang)",
        "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
      ],
      [
        "可汗学院 · 线性代数",
        "https://www.bilibili.com/video/BV1fX4y1R7hk"
      ]
    ],
    "lab": {
      "t": "向量与矩阵计算（手算）",
      "mode": "text",
      "req": [
        "计算向量 a=(1,2), b=(3,1) 的点积 a·b",
        "计算 2×2 矩阵 A=[[1,2],[0,1]] 与 B=[[1,0],[2,3]] 的乘积 AB",
        "说明 AB 与 BA 是否相等",
        "写清每一步"
      ],
      "starter": "# 题目1：点积 a·b\n# a = (1, 2), b = (3, 1)\n\n# 题目2：矩阵乘法 AB（A 在左，B 在右）\n# A = [[1,2],[0,1]], B = [[1,0],[2,3]]\n\n# 题目3：AB 与 BA 相等吗？为什么？",
      "hint": "点积=对应分量相乘再求和；矩阵乘法 (AB)ij = A 的第 i 行 点乘 B 的第 j 列。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "m1-1",
        "title": "向量：加减、数乘、点积",
        "min": 10,
        "summary": [
          "向量是一组有序数，可看作空间中的箭头。",
          "加减=分量相加；数乘=整体缩放。",
          "点积 a·b = Σaᵢbᵢ，几何上 = |a||b|cosθ，衡量「方向相似度」。"
        ],
        "code": "import numpy as np\nnp.dot([1,2],[3,1])   # 1*3 + 2*1 = 5",
        "pit": "点积为 0 表示两向量正交（垂直）；点积符号表示夹角锐角/钝角。",
        "ex": {
          "q": "点积 a·b 为 0 说明什么？",
          "a": "两向量正交（垂直），在 ML 里意味着「不相关/无投影」。"
        },
        "target": "理解点积即投影长度，是相似度基础。"
      },
      {
        "id": "m1-2",
        "title": "矩阵与基本运算",
        "min": 10,
        "summary": [
          "矩阵是数的二维表格，行×列。",
          "矩阵加法逐元素；转置 Aᵀ 行列互换。",
          "标量乘法每个元素都乘。"
        ],
        "code": "import numpy as np\nA = np.array([[1,2],[0,1]])\nprint(A.T)            # 转置",
        "pit": "矩阵加减要求形状相同；形状不对会报错。",
        "ex": {
          "q": "A 是 2×3，转置后几行几列？",
          "a": "3×2。"
        },
        "target": "会做矩阵加减与转置。"
      },
      {
        "id": "m1-3",
        "title": "矩阵乘法与线性变换",
        "min": 12,
        "summary": [
          "矩阵乘法 AB：A 的每行 点乘 B 的每列，结果 (i,j) 元素。",
          "矩阵可理解为「线性变换」：把输入向量映射到输出空间。",
          "要求 A 的列数 = B 的行数；一般不满足交换律 AB≠BA。"
        ],
        "code": "A = np.array([[1,2],[0,1]])\nB = np.array([[1,0],[2,3]])\nprint(A @ B)",
        "pit": "矩阵乘法不满足交换律；顺序写反结果完全不同。",
        "ex": {
          "q": "2×3 的 A 能乘 3×2 的 B 吗？结果几×几？",
          "a": "能，A 列数= B 行数=3；结果 2×2。"
        },
        "target": "会手算并用 NumPy 做矩阵乘法。"
      },
      {
        "id": "m1-4",
        "title": "逆、单位阵与线性方程组",
        "min": 10,
        "summary": [
          "单位阵 I 类似数字 1：AI=I。",
          "可逆矩阵 A 有逆 A⁻¹ 使 AA⁻¹=I；求解 Ax=b 得 x=A⁻¹b。",
          "很多模型（如线性回归闭式解）本质是解线性方程组。"
        ],
        "code": "A = np.array([[2,0],[0,2]])\nprint(np.linalg.inv(A))   # 0.5*I",
        "pit": "不是所有矩阵都可逆（行列式为 0 时奇异）；数值计算要用稳定方法。",
        "ex": {
          "q": "解 2x=4 用矩阵怎么说？",
          "a": "写成 [2][x]=[4]，x=[2]⁻¹[4]=2。"
        },
        "target": "理解矩阵求逆与线性方程组求解。"
      },
      {
        "id": "m1-5",
        "title": "用 NumPy 感受线性代数",
        "min": 8,
        "summary": [
          "NumPy 的 @ 是矩阵乘，* 是逐元素乘，千万别混。",
          "np.dot / np.matmul 做乘法；np.linalg 有求逆/特征值。",
          "神经网络的前向传播本质就是一串矩阵乘法。"
        ],
        "code": "x = np.array([1,2,3])\nW = np.array([[1,0,0],[0,1,0]])\nprint(W @ x)          # 线性变换",
        "pit": "神经网络里 W@x 是「加权求和」，偏置 b 再加到结果上：W@x + b。",
        "ex": {
          "q": "为什么神经网络里 W@x 要用 @ 而不是 *？",
          "a": "@ 是矩阵/向量乘法（加权求和），* 是逐元素相乘，语义完全不同。"
        },
        "target": "能用 NumPy 验证矩阵运算，衔接后续课程。"
      }
    ],
    "quiz": [
      {
        "q": "向量点积 a·b 的几何意义核心是？",
        "o": [
          "长度",
          "投影/相似度",
          "面积",
          "排序"
        ],
        "a": 1,
        "why": "点积=投影长度=|a||b|cosθ，衡量方向相似度。"
      },
      {
        "q": "矩阵乘法 AB 要求？",
        "o": [
          "A行=B行",
          "A列=B行",
          "A列=B列",
          "任意"
        ],
        "a": 1,
        "why": "A 的列数必须等于 B 的行数才能相乘。"
      },
      {
        "q": "NumPy 中矩阵乘法用？",
        "o": [
          "*",
          "@",
          "np.mul",
          "dot()默认"
        ],
        "a": 1,
        "why": "@ 是矩阵乘；* 是逐元素乘，二者易混。"
      }
    ]
  },
  {
    "id": "ma2",
    "icon": "🧮",
    "name": "线性代数 II · 空间与特征",
    "desc": "秩、特征值、降维直觉",
    "goal": "理解线性相关/秩/特征值，建立「PCA 降维」的几何直觉，为数据压缩与特征理解打底。",
    "links": [
      [
        "3Blue1Brown · 行列式",
        "https://www.bilibili.com/video/BV1he411u7Tw"
      ],
      [
        "3Blue1Brown · 特征向量",
        "https://www.bilibili.com/video/BV1xs411T7摆"
      ],
      [
        "PCA 原理(中文)",
        "https://www.cnblogs.com/zyulike/p/11472841.html"
      ]
    ],
    "lab": {
      "t": "秩与特征值（手算）",
      "mode": "text",
      "req": [
        "判断向量 (1,2) 与 (2,4) 是否线性相关，并说明含义",
        "给出 2×2 矩阵 A=[[2,0],[0,3]]，求其两个特征值",
        "说明特征值在「矩阵作用后方向不变」中的意义",
        "写清步骤"
      ],
      "starter": "# 题目1：向量 (1,2) 与 (2,4) 线性相关吗？\n\n# 题目2：A = [[2,0],[0,3]] 的特征值\n# 解 det(A - λI) = 0\n\n# 题目3：特征值代表什么？",
      "hint": "(2,4)=2*(1,2) 故相关；对角阵特征值就是对角线元素。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "m2-1",
        "title": "线性组合与线性相关",
        "min": 10,
        "summary": [
          "线性组合：用系数把多个向量加在一起。",
          "若一个向量能由其他向量组合得到，则它们线性相关（有冗余）。",
          "极大无关组张成「向量空间」，其个数即维数。"
        ],
        "code": "# (2,4) = 2*(1,2) → 两个向量线性相关",
        "pit": "特征维度过大且特征间高度相关，会让模型不稳定——这正是降维的动机。",
        "ex": {
          "q": "为什么高度相关的特征对模型是隐患？",
          "a": "特征共线会让参数估计不稳定、系数符号反常，甚至无法求逆；降维或正则化能缓解。"
        },
        "target": "理解线性相关与冗余，为降维建立动机。"
      },
      {
        "id": "m2-2",
        "title": "秩与行列式",
        "min": 10,
        "summary": [
          "秩(rank)=矩阵中线性无关的行/列数，衡量「有效信息量」。",
          "行列式 det(A) 是非零体积缩放因子；det=0 表示矩阵把空间压扁（不可逆）。",
          "满秩矩阵行/列都独立，信息无冗余。"
        ],
        "code": "import numpy as np\nprint(np.linalg.matrix_rank([[1,2],[2,4]]))  # 1（相关，秩不足）",
        "pit": "秩不足=信息有冗余=可能不可逆；建模时特征高度共线要处理。",
        "ex": {
          "q": "秩满和可逆有什么关系？",
          "a": "方阵满秩（行、列都线性独立）才可逆；秩不足即奇异矩阵，不可逆。"
        },
        "target": "会用 numpy 看矩阵秩，理解秩即有效信息量。"
      },
      {
        "id": "m2-3",
        "title": "特征值与特征向量",
        "min": 12,
        "summary": [
          "满足 Av=λv 的 v 是特征向量，λ 是特征值。",
          "含义：A 作用在 v 上只缩放不改方向，λ 是缩放倍数。",
          "对称矩阵的特征向量互相正交，可张成正交基。"
        ],
        "code": "A = np.array([[2,0],[0,3]])\nprint(np.linalg.eig(A))   # 特征值 2,3",
        "pit": "特征值可能为复数（非对称矩阵）；实数对称矩阵的特征值全为实数。",
        "ex": {
          "q": "对称矩阵的特征向量有什么好性质？",
          "a": "互相正交，可张成一组正交基，便于对角化与 PCA 投影。"
        },
        "target": "理解特征值与特征向量即方向不变、仅缩放倍数。"
      },
      {
        "id": "m2-4",
        "title": "对角化与 PCA 直觉",
        "min": 10,
        "summary": [
          "可对角化矩阵能写成 特征向量·diag(λ)·特征向量⁻¹。",
          "PCA：取方差最大的特征方向（最大特征值对应的特征向量）投影数据。",
          "降维=保留主成分、丢弃几乎不变的方向，压缩且保信息。"
        ],
        "code": "# PCA 直觉：找数据散布最大的方向投影\nfrom sklearn.decomposition import PCA\nP = PCA(n_components=2)",
        "pit": "PCA 是无监督降噪/压缩利器，但主成分未必有可解释语义。",
        "ex": {
          "q": "PCA 降维会丢失什么信息？",
          "a": "丢弃的是方差最小（信息最少）的方向，多数情况无损；但也可能丢掉少量有用信号，且主成分未必可解释。"
        },
        "target": "建立 PCA 保留主成分、压缩冗余的直觉。"
      },
      {
        "id": "m2-5",
        "title": "范数与距离",
        "min": 8,
        "summary": [
          "L2 范数 ‖x‖₂=√(Σxᵢ²)，即欧氏长度，最常用。",
          "L1 范数=绝对值之和，利于稀疏（特征选择）。",
          "损失函数里的「距离」多用范数度量预测误差。"
        ],
        "code": "import numpy as np\nx = np.array([3,4])\nprint(np.linalg.norm(x))   # 5.0 (L2)",
        "pit": "训练时「让预测接近标签」常写成最小化 ‖预测-标签‖，即误差范数。",
        "ex": {
          "q": "L1 与 L2 范数在机器学习里分别怎么用？",
          "a": "L2 常用于回归损失（MSE 的平方根），对离群点敏感；L1 用于稀疏化与特征选择（如 Lasso）。"
        },
        "target": "理解范数是误差与距离的度量，连接损失函数。"
      }
    ],
    "quiz": [
      {
        "q": "特征值 λ 满足？",
        "o": [
          "Av=λv",
          "A+v=λ",
          "Av=vλ²",
          "A=λI"
        ],
        "a": 0,
        "why": "Av=λv：矩阵作用后方向不变、缩放 λ 倍。"
      },
      {
        "q": "det(A)=0 意味着？",
        "o": [
          "满秩",
          "矩阵不可逆/空间被压扁",
          "特征值全为正",
          "是正交阵"
        ],
        "a": 1,
        "why": "行列式 0 表示矩阵把空间压扁，不可逆。"
      },
      {
        "q": "PCA 降维保留的是？",
        "o": [
          "随机方向",
          "方差最大的主方向",
          "最小特征值方向",
          "最后一列"
        ],
        "a": 1,
        "why": "保留方差（信息）最大的主成分方向。"
      }
    ]
  },
  {
    "id": "ma3",
    "icon": "📈",
    "name": "微积分基础",
    "desc": "梯度的直觉，优化的引擎",
    "goal": "理解导数/偏导/梯度，建立「沿负梯度下降最小化损失」的核心直觉——这是所有模型训练的引擎。",
    "links": [
      [
        "3Blue1Brown · 微积分本质",
        "https://www.bilibili.com/video/BV1qW411N7FU"
      ],
      [
        "吴恩达 ML 数学复习",
        "https://www.bilibili.com/video/BV1Ca4y1t7DS"
      ],
      [
        "可汗学院 · 导数",
        "https://www.bilibili.com/video/BV1jW411i7ng"
      ]
    ],
    "lab": {
      "t": "求导与梯度（手算）",
      "mode": "text",
      "req": [
        "求 f(x)=x³-2x 的导数 f'(x)",
        "求 g(x)=sin(x) 在 x=0 处的导数",
        "对 h(x,y)=x²+y² 求偏导 ∂h/∂x、∂h/∂y",
        "说明梯度 ∇h 指向什么方向",
        "写清步骤"
      ],
      "starter": "# 题目1：f(x)=x^3 - 2x 的导数\n\n# 题目2：g(x)=sin(x) 在 x=0 的导数\n\n# 题目3：h(x,y)=x^2 + y^2 的偏导与梯度",
      "hint": "幂函数导数 (xⁿ)'=n xⁿ⁻¹；sin'=cos；(x²)'=2x。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "m3-1",
        "title": "极限与导数",
        "min": 10,
        "summary": [
          "导数 f'(x) 是函数在 x 处的瞬时变化率（切线斜率）。",
          "几何意义：斜率；物理意义：速度。",
          "高阶导数描述「变化的变化」。"
        ],
        "code": "# f(x)=x^2 → f'(x)=2x\n# x=3 处斜率 6，表示此刻增长很快",
        "pit": "导数>0 在上升、<0 在下降、=0 可能是极值——优化的关键信号。",
        "ex": {
          "q": "导数为 0 一定是最优解吗？",
          "a": "不一定，它可能是极大值、极小值或鞍点；还需看二阶导数或左右邻域。"
        },
        "target": "理解导数是变化率，是优化的钥匙。"
      },
      {
        "id": "m3-2",
        "title": "常见求导与链式法则",
        "min": 10,
        "summary": [
          "基本：(xⁿ)'=n xⁿ⁻¹；(eˣ)'=eˣ；(sin x)'=cos x。",
          "链式法则：(f(g(x)))'=f'(g(x))·g'(x)，复合函数求导。",
          "反向传播本质就是链式法则在多层网络上的展开。"
        ],
        "code": "# h(x)=sin(x^2) → h'=cos(x^2)*2x  （链式法则）",
        "pit": "深度学习里每一层都是一个函数复合，反向传播就是反复套链式法则。",
        "ex": {
          "q": "反向传播为什么依赖链式法则？",
          "a": "损失对每层参数的梯度要沿多层复合函数逐层回传，每层都套用链式法则求局部梯度。"
        },
        "target": "理解链式法则是一切神经网络求导的基础。"
      },
      {
        "id": "m3-3",
        "title": "偏导数与梯度",
        "min": 12,
        "summary": [
          "多变量函数对某一变量求偏导，其余视为常数。",
          "梯度 ∇f = (∂f/∂x₁, ∂f/∂x₂, ...) 是各偏导组成的向量。",
          "梯度指向「函数值增长最快」的方向；负梯度指向下降最快方向。"
        ],
        "code": "# h(x,y)=x^2+y^2\n# ∂h/∂x = 2x, ∂h/∂y = 2y\n# ∇h = (2x, 2y)，在点(1,1)指向(2,2)即远离原点",
        "pit": "梯度只告诉你「当前点」往哪走降得最快，不保证全局最低——可能陷入局部极小。",
        "ex": {
          "q": "为什么梯度指向上升最快方向？",
          "a": "梯度各分量就是偏导，沿它的方向函数值增长最快；故取负梯度让损失下降最快。"
        },
        "target": "理解梯度即多变量上升最快方向，负梯度用于下降。"
      },
      {
        "id": "m3-4",
        "title": "梯度下降直觉",
        "min": 12,
        "summary": [
          "目标：最小化损失 L(θ)。更新 θ ← θ - η·∇L(θ)。",
          "η 是学习率：太大震荡、太小慢。",
          "每次用一批数据估算梯度（SGD/小批量），而非全量。"
        ],
        "code": "# 伪代码：重复 θ = θ - lr * grad\n# lr 太小收敛慢，太大可能发散",
        "pit": "学习率是训练第一调参对象；配合学习率预热/衰减更稳。",
        "ex": {
          "q": "学习率太大或太小会怎样？",
          "a": "太大容易震荡甚至发散，太小收敛极慢；常用验证集与学习率预热、衰减来调。"
        },
        "target": "理解梯度下降沿负梯度更新的核心规则。"
      },
      {
        "id": "m3-5",
        "title": "积分与泰勒展开（简要）",
        "min": 8,
        "summary": [
          "积分是导数的逆运算，可求面积/累积量。",
          "泰勒展开用多项式在一点附近逼近复杂函数。",
          "优化理论里常用二阶（海森矩阵）信息加速收敛。"
        ],
        "code": "# 泰勒一阶：f(x)≈f(a)+f'(a)(x-a)\n# 梯度下降只用了一阶信息",
        "pit": "知道「还有二阶信息」即可，实战多数用一阶梯度法。",
        "ex": {
          "q": "泰勒展开对优化有什么用？",
          "a": "一阶泰勒近似损失曲面，帮助理解梯度下降；二阶（海森）信息还能进一步加速收敛。"
        },
        "target": "知道积分与泰勒是优化的数学背景，无需死记公式。"
      }
    ],
    "quiz": [
      {
        "q": "梯度 ∇f 指向？",
        "o": [
          "下降最快",
          "上升最快",
          "不变",
          "原点"
        ],
        "a": 1,
        "why": "梯度指向函数值增长最快的方向，故负梯度用于下降。"
      },
      {
        "q": "函数在某点处的导数，其几何意义是该点处切线的？",
        "o": [
          "斜率",
          "截距",
          "面积",
          "周长"
        ],
        "a": 0,
        "why": "导数就是切线斜率，斜率越大函数在该点变化越快，这正是梯度下降「沿最陡方向走」的来源。"
      },
      {
        "q": "梯度下降更新 θ 用？",
        "o": [
          "θ+η∇",
          "θ-η∇",
          "θ*∇",
          "θ/∇"
        ],
        "a": 1,
        "why": "θ ← θ - η·∇L，沿负梯度下降。"
      }
    ]
  },
  {
    "id": "ma4",
    "icon": "🎲",
    "name": "概率与统计",
    "desc": "不确定性的数学语言",
    "goal": "掌握概率、条件概率、贝叶斯、期望方差与常见分布，理解最大似然——这是分类、生成与评估的基础。",
    "links": [
      [
        "3Blue1Brown · 贝叶斯定理",
        "https://www.bilibili.com/video/BV1R7411a7oa"
      ],
      [
        "吴恩达 · 概率统计复习",
        "https://www.bilibili.com/video/BV1Ca4y1t7DS"
      ],
      [
        "StatQuest · 最大似然",
        "https://www.bilibili.com/video/BV1tE411B7dL"
      ]
    ],
    "lab": {
      "t": "概率与期望（手算）",
      "mode": "text",
      "req": [
        "已知 P(雨)=0.3，P(带伞|雨)=0.9，求 P(雨且带伞)",
        "说明贝叶斯：已知 P(阳性|患病)、P(患病)，如何求 P(患病|阳性)",
        "掷一枚公平骰子，求点数期望",
        "写清公式与步骤"
      ],
      "starter": "# 题目1：P(雨且带伞) = P(雨) * P(带伞|雨)\n\n# 题目2：贝叶斯公式如何由 P(患病|阳性) 反推\n\n# 题目3：公平骰子点数期望",
      "hint": "乘法公式 P(A∩B)=P(A)P(B|A)；期望=各取值×概率之和。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "m4-1",
        "title": "概率基础与条件概率",
        "min": 10,
        "summary": [
          "概率∈[0,1]，所有可能结果概率和为 1。",
          "条件概率 P(A|B) 表示「已知 B 发生下 A 的概率」。",
          "乘法公式 P(A∩B)=P(A)P(B|A)。"
        ],
        "code": "# P(雨且带伞) = 0.3 * 0.9 = 0.27",
        "pit": "P(A|B) 与 P(B|A) 完全不同，医学误判常源于混淆二者。",
        "ex": {
          "q": "P(A|B) 与 P(B|A) 为什么不能混用？",
          "a": "一个是在 B 发生前提下看 A，另一个是反过来；贝叶斯用后者推前者，医学误判常源于混淆。"
        },
        "target": "理解条件概率与乘法公式。"
      },
      {
        "id": "m4-2",
        "title": "贝叶斯定理",
        "min": 12,
        "summary": [
          "P(A|B)=P(B|A)P(A)/P(B)，由结果反推原因。",
          "先验 P(A)→看到证据 B→更新为后验 P(A|B)。",
          "AI 里贝叶斯用于 spam 过滤、不确定性建模。"
        ],
        "code": "# 已知患病率1%、检测灵敏度99%、误报5%\n# 阳性后真正患病概率仅约17%——反直觉！",
        "pit": "基础概率(先验)很小，即使检测很准，阳性也未必真患病——贝叶斯思维很重要。",
        "ex": {
          "q": "为什么检测很准却还会误判？",
          "a": "若患病率极低，大量健康人被少量误报，阳性中真患病的比例仍可能很低——要看后验概率。"
        },
        "target": "理解贝叶斯如何用证据更新先验得到后验。"
      },
      {
        "id": "m4-3",
        "title": "期望、方差、协方差",
        "min": 10,
        "summary": [
          "期望 E[X]=Σx·P(x)，是概率加权平均（长期均值）。",
          "方差 Var= E[(X-E)²]，衡量波动；标准差是其开方。",
          "协方差衡量两变量同向/反向变动，相关是其标准化。"
        ],
        "code": "import numpy as np\nprint(np.mean([1,2,3]), np.var([1,2,3]))",
        "pit": "模型预测误差常用「均方误差」= 期望的平方误差，即方差思想。",
        "ex": {
          "q": "方差衡量什么？",
          "a": "数据相对均值的离散程度；训练关心误差的期望与方差，也就是偏差-方差权衡。"
        },
        "target": "理解期望、方差是描述数据与误差的基本量。"
      },
      {
        "id": "m4-4",
        "title": "常见分布",
        "min": 10,
        "summary": [
          "伯努利(一次试验0/1)、二项(多次成功次数)。",
          "正态(高斯)分布：钟形，中心极限定理使其无处不在。",
          "均匀、泊松(计数)、指数(间隔)也常用。"
        ],
        "code": "import numpy as np\nnp.random.normal(0, 1, 1000)   # 标准正态样本",
        "pit": "初始化权重、加噪声常假设正态分布；理解它有助于调参。",
        "ex": {
          "q": "为什么正态分布在机器学习里无处不在？",
          "a": "中心极限定理：大量独立随机量之和趋近正态，故初始化噪声、误差常假设为正态分布。"
        },
        "target": "认识正态等常见分布及其在 ML 中的角色。"
      },
      {
        "id": "m4-5",
        "title": "最大似然与统计量",
        "min": 10,
        "summary": [
          "最大似然(ML)：选使「观测数据最可能出现」的参数。",
          "经验均值/方差是样本对总体的估计（统计量）。",
          "很多模型训练 = 最大化对数似然（等价于最小化交叉熵）。"
        ],
        "code": "# 抛10次硬币7次正面，最可能的正面概率≈0.7\n# 即最大化 P(数据|θ)",
        "pit": "「最小化损失」和「最大化似然」常是一枚硬币两面——理解其一即可打通。",
        "ex": {
          "q": "最大似然和最小化损失有什么关系？",
          "a": "最大化对数似然常等价于最小化交叉熵损失，两者目标一致，是一枚硬币的两面。"
        },
        "target": "理解最大似然即选最符合观测数据的参数。"
      }
    ],
    "quiz": [
      {
        "q": "贝叶斯定理由谁推谁？",
        "o": [
          "P(A|B)→P(B|A)",
          "P(B|A)→P(A|B)",
          "P(A)→P(B)",
          "无关"
        ],
        "a": 1,
        "why": "贝叶斯用 P(B|A) 与先验反推 P(A|B)。"
      },
      {
        "q": "期望是？",
        "o": [
          "最大值",
          "概率加权平均",
          "方差",
          "中位数"
        ],
        "a": 1,
        "why": "期望=各取值乘概率之和，是长期平均。"
      },
      {
        "q": "模型训练常等价于？",
        "o": [
          "最大化似然",
          "求逆矩阵",
          "积分",
          "排序"
        ],
        "a": 0,
        "why": "最大化似然常等价于最小化交叉熵损失。"
      }
    ]
  },
  {
    "id": "sp1",
    "icon": "🔢",
    "name": "NumPy 数组计算",
    "desc": "向量化，告别慢循环",
    "goal": "会用 ndarray 做向量化计算，理解广播，能替代 Python 循环高效处理数值数据。",
    "links": [
      [
        "NumPy 用户指南",
        "https://numpy.org/doc/stable/user/"
      ],
      [
        "菜鸟教程 · NumPy",
        "https://www.runoob.com/numpy/numpy-tutorial.html"
      ],
      [
        "动手学深度学习 · NDArray",
        "https://zh.d2l.ai/chapter_preliminaries/ndarray.html"
      ]
    ],
    "lab": {
      "t": "向量化计算温度",
      "req": [
        "用 NumPy 生成 0~29 摄氏度的数组 c",
        "用向量化公式 f = c*9/5 + 32 转华氏（不要写 for）",
        "求平均温度与最高温",
        "输出结果"
      ],
      "starter": "import numpy as np\nc = np.arange(30)            # 0..29 摄氏度\n# 向量化转华氏 f = c*9/5 + 32\nf = c * 9 / 5 + 32\nprint(\"平均\", f.mean(), \"最高\", f.max())",
      "hint": "NumPy 数组间运算逐元素进行，无需 for；c*9/5+32 直接整体算。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "sp1-1",
        "title": "ndarray 与属性",
        "min": 10,
        "summary": [
          "np.array 创建多维数组， dtype 统一、内存连续、快。",
          "shape 看形状、ndim 看维数、size 看元素总数。",
          "与 Python list 比：同构、向量化、省内存。"
        ],
        "code": "import numpy as np\na = np.array([[1,2],[3,4]])\nprint(a.shape, a.ndim, a.dtype)",
        "pit": "混类型会被统一成 object，失去性能——保证数组元素同类型。",
        "target": "用 np.array 创建多维数组，并看懂它的 shape / ndim / dtype。",
        "ex": {
          "q": "为什么 NumPy 数组比 Python list 更快？",
          "a": "ndarray 元素同类型、内存连续，支持向量化一次性运算，免去 Python 循环开销。"
        }
      },
      {
        "id": "sp1-2",
        "title": "创建与索引切片",
        "min": 10,
        "summary": [
          "np.arange / linspace / zeros / ones / eye 快速造数组。",
          "索引与切片同 list，但可多维同时切片。",
          "布尔索引按条件选元素，非常常用。"
        ],
        "code": "a = np.arange(10)\nprint(a[a % 2 == 0])     # 偶数 [0,2,4,6,8]",
        "pit": "切片返回视图（共享内存），修改会影响原数组；要拷贝用 .copy()。",
        "target": "用 arange / zeros / ones 等快速造数组，并用切片做多维选取。",
        "ex": {
          "q": "切片得到的数组修改后，原数组会变吗？",
          "a": "默认切片返回视图(共享内存)，改它会影响原数组；要独立副本用 .copy()。"
        }
      },
      {
        "id": "sp1-3",
        "title": "向量化运算",
        "min": 12,
        "summary": [
          "数组±*/是逐元素，整段一次算，比 Python for 快几十倍。",
          "数学函数 np.sqrt / np.exp / np.log 对整个数组生效。",
          "能用向量化就别写循环，这是 NumPy 的核心心法。"
        ],
        "code": "x = np.array([1,2,3])\nprint(x ** 2 + 1)        # [2,5,10]",
        "pit": "向量化不仅快，代码也更短更不易错。",
        "target": "用向量化表达式替代 for 循环处理整组数。",
        "ex": {
          "q": "为什么说「能用向量化就别写循环」？",
          "a": "向量化由底层 C 批量计算，速度常快几十倍，代码也更短更不易错。"
        }
      },
      {
        "id": "sp1-4",
        "title": "广播 broadcasting",
        "min": 10,
        "summary": [
          "形状不同的数组运算时，NumPy 自动「拉伸」对齐（广播）。",
          "规则：从后往前维度对齐，相等或其一为 1 可广播。",
          "让 (n,1) 与 (1,m) 相加得到 (n,m) 外积式结果。"
        ],
        "code": "a = np.array([[1],[2],[3]])  # 3x1\nb = np.array([10,20])        # 1x2\nprint(a + b)                 # 3x2",
        "pit": "广播报错多为维度对不齐；用 reshape(-1,1) 显式加轴常能解决。",
        "target": "理解广播规则，能用形状不同的数组直接运算。",
        "ex": {
          "q": "广播在什么情况下会报错？怎么解决？",
          "a": "当维度从后往前对不齐、且都不为 1 时报错；常用 reshape(-1,1) 显式加轴来对齐。"
        }
      },
      {
        "id": "sp1-5",
        "title": "矩阵运算与随机数",
        "min": 8,
        "summary": [
          "@ 做矩阵乘；np.dot / np.matmul 等价。",
          "np.linalg 提供 inv/eig/svd 等；svd 是降维与压缩基石。",
          "np.random 生成高斯/均匀样本，给权重初始化与数据增广用。"
        ],
        "code": "W = np.random.randn(3, 4) * 0.1\nprint(W @ np.ones(4))",
        "pit": "神经网络权重常用「小随机」初始化，避免对称导致学不动。",
        "target": "用 @ 做矩阵乘、用 np.linalg 求逆/特征值，并理解权重初始化。",
        "ex": {
          "q": "神经网络权重为什么常用「小随机」初始化？",
          "a": "避免所有神经元初始对称、学不到不同特征；小随机打破对称，且利于梯度流动。"
        }
      }
    ],
    "quiz": [
      {
        "q": "NumPy 相比 list 最大的优势？",
        "o": [
          "能存字符串",
          "向量化、快、省内存",
          "语法更简单",
          "可变长"
        ],
        "a": 1,
        "why": "ndarray 同构连续、支持向量化，速度数量级提升。"
      },
      {
        "q": "矩阵乘法用？",
        "o": [
          "*",
          "@",
          "np.add",
          "np.mul"
        ],
        "a": 1,
        "why": "@ 是矩阵乘；* 是逐元素乘。"
      },
      {
        "q": "广播的本质是？",
        "o": [
          "复制数组",
          "形状自动对齐拉伸",
          "转置",
          "排序"
        ],
        "a": 1,
        "why": "NumPy 把不同形状按规则拉伸对齐后运算，免手动循环。"
      }
    ]
  },
  {
    "id": "sp2",
    "icon": "📊",
    "name": "Pandas 与可视化",
    "desc": "把表格数据变成洞察",
    "goal": "会用 Pandas 读写与清洗表格数据、做分组聚合，并用 Matplotlib 画出基础图表。",
    "links": [
      [
        "Pandas 用户指南",
        "https://pandas.pydata.org/docs/user_guide/index.html"
      ],
      [
        "Matplotlib 教程",
        "https://matplotlib.org/stable/tutorials/index.html"
      ],
      [
        "动手学深度学习 · 数据",
        ":https://zh.d2l.ai/chapter_preliminaries/pandas.html"
      ]
    ],
    "lab": {
      "t": "用 Pandas 分析成绩",
      "req": [
        "用字典创建 DataFrame：姓名/数学/英语",
        "增加「总分」列（两科相加，向量化）",
        "按总分排序并输出前 3 名",
        "用 Matplotlib 画每人两科成绩的折线图"
      ],
      "starter": "import pandas as pd\nimport matplotlib.pyplot as plt\ndf = pd.DataFrame({\n    \"name\": [\"A\",\"B\",\"C\"],\n    \"math\": [88, 72, 95],\n    \"eng\": [79, 90, 68],\n})\n# 增加总分列并按总分排序\nprint(df)\nplt.plot(df[\"name\"], df[\"math\"], marker=\"o\")\nplt.show()",
      "hint": "df[\"total\"]=df[\"math\"]+df[\"eng\"]；df.sort_values(\"total\", ascending=False)。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "sp2-1",
        "title": "Series 与 DataFrame",
        "min": 10,
        "summary": [
          "Series 是一维带标签序列；DataFrame 是二维表格（行列索引）。",
          "df[col] 取列、df.loc[行标签] 取行。",
          "AI 里数据集几乎都用 DataFrame 承载。"
        ],
        "code": "import pandas as pd\ndf = pd.DataFrame({\"x\":[1,2],\"y\":[3,4]})\nprint(df[\"x\"].mean())",
        "pit": "列名别用中文空格等怪字符，后续引用易错；用 snake_case。",
        "target": "理解 Series / DataFrame 结构，会用列名与标签取数。",
        "ex": {
          "q": "DataFrame 和 Excel 表最像的是什么？",
          "a": "都是二维表格(行列索引)；df[col] 取列、df.loc[标签] 取行，是 AI 数据集的主载体。"
        }
      },
      {
        "id": "sp2-2",
        "title": "读写与选择过滤",
        "min": 10,
        "summary": [
          "pd.read_csv / read_excel 读入；to_csv 写出。",
          "布尔过滤 df[df[\"math\"]>80] 选满足条件的行。",
          "df.head() 预览、df.info() 看类型与缺失。"
        ],
        "code": "df = pd.read_csv(\"data.csv\")\nprint(df[df[\"math\"] > 80].head())",
        "pit": "真实 CSV 常有编码问题，read_csv 加 encoding=\"utf-8\" 或 \"gbk\"。",
        "target": "用 read_csv 读数据、用布尔过滤筛出满足条件的行。",
        "ex": {
          "q": "读真实 CSV 经常遇到乱码，怎么办？",
          "a": "多在 read_csv 指定 encoding=\"utf-8\" 或 \"gbk\"；先 df.head() 预览确认读对。"
        }
      },
      {
        "id": "sp2-3",
        "title": "分组聚合 groupby",
        "min": 10,
        "summary": [
          "groupby(键).agg(...) 按组汇总，是数据分析利器。",
          "如按班级求各科平均分、按月份求和。",
          "聚合后可再排序/画图，形成完整分析闭环。"
        ],
        "code": "df.groupby(\"class\")[\"math\"].mean()",
        "pit": "groupby 后直接列运算只对数值列生效；多列用 .agg({\"math\":\"mean\"})。",
        "target": "用 groupby 按组汇总，做基础数据分析。",
        "ex": {
          "q": "怎么按班级求每科平均分？",
          "a": "df.groupby(\"class\")[\"math\"].mean()；groupby 后再聚合是分组统计的标准做法。"
        }
      },
      {
        "id": "sp2-4",
        "title": "缺失值与清洗",
        "min": 8,
        "summary": [
          "df.isna() 找缺失；fillna/ dropna 处理。",
          "异常值用分位数/标准差裁剪。",
          "干净数据决定模型上限——「垃圾进垃圾出」。"
        ],
        "code": "df = df.fillna(df.mean())   # 数值缺失用均值填",
        "pit": "fillna(0) 可能引入偏差；先理解缺失原因再决定填什么。",
        "target": "能发现并处理缺失值与异常值，理解「垃圾进垃圾出」。",
        "ex": {
          "q": "fillna(0) 一定安全吗？",
          "a": "不一定；把缺失填成 0 可能引入偏差，要先弄清缺失原因再决定填均值还是删除。"
        }
      },
      {
        "id": "sp2-5",
        "title": "可视化基础",
        "min": 10,
        "summary": [
          "Matplotlib：plot 折线、scatter 散点、bar 柱状、hist 直方图。",
          "标题/坐标轴/图例让图自解释。",
          "训练时务必画 loss/acc 曲线监控是否收敛。"
        ],
        "code": "plt.plot(history[\"loss\"], label=\"train\")\nplt.xlabel(\"epoch\"); plt.legend(); plt.show()",
        "pit": "loss 不降先查学习率与数据；画图是最快的「诊断仪」。",
        "target": "用 Matplotlib 画折线/散点/柱状图，监控训练过程。",
        "ex": {
          "q": "训练时为什么一定要画 loss 曲线？",
          "a": "loss 曲线是判断收敛、过拟合、学习率是否合适的第一手诊断证据，比只看最终数字靠谱。"
        }
      }
    ],
    "quiz": [
      {
        "q": "DataFrame 相当于？",
        "o": [
          "一维数组",
          "二维表格",
          "字典",
          "图片"
        ],
        "a": 1,
        "why": "DataFrame 是带行列索引的二维表格，AI 数据集主载体。"
      },
      {
        "q": "按班级求平均数学分用？",
        "o": [
          "df.mean()",
          "df.groupby(\"class\")[\"math\"].mean()",
          "df.sort()",
          "df.head()"
        ],
        "a": 1,
        "why": "groupby 后聚合是分组统计标准做法。"
      },
      {
        "q": "训练时画 loss 曲线主要为了？",
        "o": [
          "好看",
          "监控是否收敛/诊断",
          "存图",
          "炫技"
        ],
        "a": 1,
        "why": "loss 曲线是判断收敛、过拟合、学习率是否合适的第一手证据。"
      }
    ]
  },
  {
    "id": "sp3",
    "icon": "📓",
    "name": "Jupyter 数据项目",
    "desc": "端到端跑通一个小项目",
    "goal": "会用 Jupyter Notebook 组织「读数据→清洗→分析→可视化→结论」，完成一个端到端小项目。",
    "links": [
      [
        "Jupyter 官方",
        "https://jupyter.org/"
      ],
      [
        "Google Colab 免费 GPU",
        "https://colab.research.google.com/"
      ],
      [
        "Kaggle 数据集",
        "https://www.kaggle.com/datasets"
      ]
    ],
    "lab": {
      "t": "设计一个数据分析项目流程",
      "mode": "text",
      "req": [
        "用文字描述一个端到端数据分析小项目（主题自选，如「某课程成绩分析」）",
        "列出 5 个步骤：数据从哪来、怎么清洗、分析什么、画什么图、得出什么结论",
        "说明每一步用到的库（pandas/numpy/matplotlib）",
        "不少于 150 字"
      ],
      "starter": "# 项目主题：\n# 1. 数据来源：\n# 2. 清洗：\n# 3. 分析：\n# 4. 可视化：\n# 5. 结论：",
      "hint": "可参考：用 pandas 读 CSV → fillna 清洗 → groupby 算均值 → plt 画柱状图 → 得出「哪类学生平均分更高」之类结论。",
      "xp": 20
    },
    "lessons": [
      {
        "id": "sp3-1",
        "title": "Notebook 工作流",
        "min": 8,
        "summary": [
          "Jupyter 把代码、文字、图混排，适合探索性分析。",
          "单元格(cell)可单独运行，变量跨单元共享。",
          "Colab 免安装、送免费 GPU，新手最友好。"
        ],
        "code": "# 在单元格里逐段运行，边跑边看结果\nimport pandas as pd",
        "pit": "Notebook 变量跨单元共享，删了前面单元再跑后面会用到旧值——重启内核最干净。",
        "target": "用 Jupyter 把代码/文字/图混排，完成探索性分析。",
        "ex": {
          "q": "Notebook 最容易被忽略的一个坑是什么？",
          "a": "变量跨单元共享、且有执行顺序，删了前面单元再跑后面会用旧值；重启内核最干净。"
        }
      },
      {
        "id": "sp3-2",
        "title": "Markdown 与代码单元",
        "min": 8,
        "summary": [
          "Markdown 单元写标题/说明，让 notebook 像报告。",
          "代码单元做计算；%matplotlib inline 让图嵌在页面。",
          "好 notebook = 可复现的实验记录。"
        ],
        "code": "# 这是 Markdown 标题\n# 用 **粗体** 标注关键结论",
        "pit": "提交/分享前「重启并全部运行」，确保别人能一键复现。",
        "target": "用 Markdown 写说明、用代码单元计算，让 notebook 像报告。",
        "ex": {
          "q": "分享 notebook 前为什么要「重启并全部运行」？",
          "a": "确保别人一键就能复现你的结果，避免隐藏的执行顺序错误。"
        }
      },
      {
        "id": "sp3-3",
        "title": "端到端小项目",
        "min": 12,
        "summary": [
          "标准流程：明确问题→获取数据→清洗→EDA 探索→建模/分析→结论。",
          "EDA（探索性分析）先用统计与图理解数据分布。",
          "先跑通最小可用版本，再逐步加复杂度。"
        ],
        "code": "# 模板\n# 1 读: df = pd.read_csv(...)\n# 2 洗: df = df.dropna()\n# 3 看: df.describe()\n# 4 画: plt.hist(...)\n# 5 结论: 写进 Markdown",
        "pit": "别一上来就建模；先 EDA 理解数据，能省大量盲目尝试。",
        "target": "走通「明确问题→取数→清洗→EDA→结论」的最小闭环。",
        "ex": {
          "q": "为什么别一上来就建模？",
          "a": "先 EDA 理解数据分布，能少走大量盲目尝试，选对模型和特征。"
        }
      },
      {
        "id": "sp3-4",
        "title": "汇报与导出",
        "min": 6,
        "summary": [
          "结论要回答最初的问题，用图佐证。",
          "可导出 HTML/PDF 分享；Colab 直接给链接。",
          "把项目整理进 GitHub，是简历硬通货。"
        ],
        "code": "# File → Download as → HTML / PDF",
        "pit": "「分析了啥」不如「结论是什么、证据在哪」——汇报要结论先行。",
        "target": "写出结论先行、有图佐证的 notebook 报告。",
        "ex": {
          "q": "汇报时最重要的是什么？",
          "a": "结论先行：用图证据回答最初的问题，比罗列「分析了啥」更有价值。"
        }
      }
    ],
    "quiz": [
      {
        "q": "Jupyter 最适合？",
        "o": [
          "部署服务",
          "探索性数据分析",
          "写操作系统",
          "编译",
          "训练大模型"
        ],
        "a": 1,
        "why": "Notebook 交互探索、图文混排，适合 EDA。"
      },
      {
        "q": "EDA 指？",
        "o": [
          "训练模型",
          "探索性数据分析",
          "导出报告",
          "清洗",
          "部署"
        ],
        "a": 1,
        "why": "EDA=Exploratory Data Analysis，先理解数据再建模。"
      },
      {
        "q": "分享前建议？",
        "o": [
          "直接发 py",
          "重启内核并全部运行确保可复现",
          "删注释",
          "不画图"
        ],
        "a": 1,
        "why": "重启并全跑一遍，保证别人打开能一键复现。"
      }
    ]
  },
  {
    "id": "ml1",
    "icon": "🤖",
    "name": "机器学习概览与线性回归",
    "desc": "从「写规则」到「学规律」",
    "goal": "理解监督/无监督/强化三大范式，能手写线性回归的梯度下降，并用 sklearn 跑通第一个模型。",
    "links": [
      [
        "吴恩达 机器学习",
        "https://www.coursera.org/learn/machine-learning"
      ],
      [
        "李宏毅 ML",
        "http://speech.ee.ntu.edu.tw/~tlkagk/courses_ML20.html"
      ],
      [
        "sklearn 用户指南",
        "https://scikit-learn.org/stable/user_guide.html"
      ]
    ],
    "lab": {
      "t": "用 sklearn 拟合一条直线",
      "req": [
        "用 numpy 造一组带噪声的 y=2x+1 样本",
        "用 LinearRegression 拟合，打印学到的系数与截距",
        "预测 x=10 的输出",
        "对比真实斜率 2、截距 1"
      ],
      "starter": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\nnp.random.seed(0)\nx = np.random.rand(50,1)*10\ny = 2*x[:,0] + 1 + np.random.randn(50)*0.5\nmodel = LinearRegression()\nmodel.fit(x, y)\nprint(\"斜率\", model.coef_, \"截距\", model.intercept_)\nprint(\"x=10 预测\", model.predict([[10]]))",
      "hint": "fit 接收二维 X 和一维 y；coef_ 是斜率、intercept_ 是截距。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "ml1-1",
        "title": "什么是机器学习",
        "min": 10,
        "summary": [
          "传统编程：人写规则、机器执行。",
          "机器学习：给数据+目标，让算法自己从数据里学出「映射」。",
          "三大范式：监督(有标签)/无监督(无标签)/强化(与环境交互得奖励)。"
        ],
        "code": "# 监督：有 (x, y)；无监督：只有 x；强化：试错拿奖励",
        "pit": "先想清是哪种范式，再选模型——很多初学者把无监督当监督用。",
        "target": "区分监督/无监督/强化三种范式，说清「从数据学映射」。",
        "ex": {
          "q": "传统编程和机器学习的根本区别？",
          "a": "传统是人写规则机器执行；ML 给人数据和目标，让算法从数据里学出映射(规则)。"
        }
      },
      {
        "id": "ml1-2",
        "title": "线性回归与 MSE",
        "min": 12,
        "summary": [
          "线性回归假设 y≈w·x+b，目标是找最好的 w,b。",
          "损失用 MSE=平均(预测-真值)²，衡量预测误差。",
          "最小化 MSE 等价于最大化「数据出现的概率」(最大似然)。"
        ],
        "code": "# 预测 y_hat = w*x + b\n# 损失 MSE = mean((y_hat - y)**2)",
        "pit": "MSE 对离群点敏感（平方放大）；必要时用 MAE。",
        "target": "理解线性回归假设与 MSE 损失，知道最小化 MSE 即最大似然。",
        "ex": {
          "q": "MSE 对离群点有什么问题？",
          "a": "平方会放大离群点误差；必要时改用 MAE(绝对误差)更稳健。"
        }
      },
      {
        "id": "ml1-3",
        "title": "梯度下降训练",
        "min": 12,
        "summary": [
          "对 w,b 求损失梯度，沿负梯度更新：w←w-η·∂L/∂w。",
          "学习率 η 控制步长；批量/小批量/随机三种取数据方式。",
          "反复迭代直到损失收敛。"
        ],
        "code": "# 伪代码：\n# for each step:\n#   grad = compute_gradient(X, y, w, b)\n#   w -= lr * grad_w; b -= lr * grad_b",
        "pit": "学习率太大震荡不收敛、太小慢；这是训练第一调参对象。",
        "target": "理解沿负梯度更新参数，认识学习率与 batch 的作用。",
        "ex": {
          "q": "学习率太大或太小会怎样？",
          "a": "太大震荡甚至发散，太小收敛极慢；学习率是训练第一调参对象，常配合预热/衰减。"
        }
      },
      {
        "id": "ml1-4",
        "title": "过拟合与泛化",
        "min": 10,
        "summary": [
          "过拟合：在训练集表现好、测试集差，记住了噪声。",
          "泛化：模型在未见数据上也好，才是真学会。",
          "手段：更多数据、正则化、早停、交叉验证。"
        ],
        "code": "# 训练误差↓ 但验证误差↑ → 过拟合信号",
        "pit": "「训练集 100% 正确」往往是过拟合警报，不是好消息。",
        "target": "识别过拟合信号，知道泛化才是真目标。",
        "ex": {
          "q": "「训练集 100% 正确」是好事吗？",
          "a": "往往不是——很可能是过拟合(记住了噪声)，要看验证/测试集表现。"
        }
      },
      {
        "id": "ml1-5",
        "title": "sklearn 实战",
        "min": 10,
        "summary": [
          "sklearn 统一接口：fit 训练、predict 预测、score 评估。",
          "一行 LinearRegression 就能跑通回归。",
          "理解接口后，换模型只需换一行类名。"
        ],
        "code": "from sklearn.linear_model import LinearRegression\nm = LinearRegression(); m.fit(X, y); m.predict([[10]])",
        "pit": "sklearn 的 X 必须是二维（即使只有一列），y 一维——形状错是最常见的坑。",
        "ex": {
          "q": "为什么 X 要二维？",
          "a": "sklearn 约定样本数×特征数的二维数组；单列也要写成 (n,1)。"
        },
        "target": "能用 sklearn 跑通第一个回归模型并读懂输出。"
      }
    ],
    "quiz": [
      {
        "q": "ML 三大范式不含？",
        "o": [
          "监督",
          "无监督",
          "强化",
          "编译"
        ],
        "a": 3,
        "why": "编译是传统编程，非学习范式。"
      },
      {
        "q": "MSE 衡量？",
        "o": [
          "准确率",
          "预测误差平方均值",
          "训练速度",
          "参数个数"
        ],
        "a": 1,
        "why": "MSE 是均方误差，衡量预测与真值差距。"
      },
      {
        "q": "过拟合表现是？",
        "o": [
          "训练差测试差",
          "训练好测试差",
          "都好",
          "都差"
        ],
        "a": 1,
        "why": "过拟合=记住训练集、泛化差，训练好测试差。"
      }
    ]
  },
  {
    "id": "ml2",
    "icon": "🎯",
    "name": "逻辑回归与分类",
    "desc": "从回归到「是或否」",
    "goal": "理解分类、sigmoid、交叉熵，会算并解读准确率/精确率/召回率/F1 与 ROC-AUC。",
    "links": [
      [
        "sklearn 分类教程",
        "https://scikit-learn.org/stable/tutorial/statistical_inference/supervised_learning.html"
      ],
      [
        "精确率召回率讲解",
        "https://www.bilibili.com/video/BV1Wf4y1i7aM"
      ],
      [
        "ROC/AUC",
        "https://www.bilibili.com/video/BV1yt4y1U7Uc"
      ]
    ],
    "lab": {
      "t": "sklearn 逻辑回归分类",
      "req": [
        "用 sklearn.datasets.make_classification 造二分类数据",
        "用 train_test_split 切分（test_size=0.3）",
        "训练 LogisticRegression 并输出测试集准确率、精确率、召回率、F1",
        "打印 classification_report"
      ],
      "starter": "from sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import classification_report\nX, y = make_classification(n_samples=200, n_features=4, random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)\nm = LogisticRegression(); m.fit(Xtr, ytr)\nprint(classification_report(yte, m.predict(Xte)))",
      "hint": "classification_report 一次性给出 precision/recall/f1-support。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "ml2-1",
        "title": "分类与 sigmoid",
        "min": 10,
        "summary": [
          "分类预测类别（如垃圾/正常邮件），而非连续值。",
          "sigmoid 把任意实数压到 (0,1)，可当「概率」。"
        ],
        "code": "import math\ndef sigmoid(z): return 1/(1+math.exp(-z))",
        "pit": "sigmoid 输出不是真概率，只是单调映射到 0~1；阈值通常取 0.5。",
        "target": "理解分类任务与 sigmoid 把实数映射成「概率」。",
        "ex": {
          "q": "sigmoid 输出能当真概率吗？",
          "a": "只是单调映射到 (0,1)，不是严格概率；通常阈值取 0.5 判正负类。"
        }
      },
      {
        "id": "ml2-2",
        "title": "逻辑回归与交叉熵",
        "min": 12,
        "summary": [
          "逻辑回归 = 线性回归 + sigmoid，输出正类概率。",
          "损失用二元交叉熵 BCE：预测越错惩罚越大。",
          "最小化 BCE 等价于最大似然。"
        ],
        "code": "# BCE = -[y*log(p) + (1-y)*log(1-p)]\n# 梯度下降最小化它",
        "pit": "交叉熵比 MSE 更适合概率输出，梯度更友好、不怕饱和。",
        "target": "理解逻辑回归 + BCE，知道交叉熵比 MSE 更适合概率输出。",
        "ex": {
          "q": "为什么分类损失常用交叉熵而非 MSE？",
          "a": "交叉熵对预测越错惩罚越大、梯度更友好、不怕饱和，更适合概率输出。"
        }
      },
      {
        "id": "ml2-3",
        "title": "准确率/精确率/召回率/F1",
        "min": 12,
        "summary": [
          "准确率=全对比例；但不平衡时「全判负」也能很高。",
          "精确率=预测为正的里头真有几成；召回率=真正的被找出了几成。",
          "F1 是两者调和平均，不平衡时比准确率更诚实。"
        ],
        "code": "# 精确率 = TP/(TP+FP)\n# 召回率 = TP/(TP+FN)",
        "pit": "「模型准确率 99%」可能只是因为 99% 都是负类——务必看精确率/召回率。",
        "target": "在不平衡数据上正确选择评估指标。",
        "ex": {
          "q": "「准确率 99%」可能骗人吗？",
          "a": "可能——若 99% 都是负类，全判负也有 99% 准确率却啥也没抓；要看精确率/召回率。"
        }
      },
      {
        "id": "ml2-4",
        "title": "ROC 与 AUC",
        "min": 10,
        "summary": [
          "ROC 曲线：不同阈值下 Recall vs 1-Specificity。",
          "AUC=曲线下面积，0.5 是随机、1.0 完美。",
          "AUC 对类别不平衡不敏感，适合整体评估。"
        ],
        "code": "from sklearn.metrics import roc_auc_score\nprint(roc_auc_score(yte, m.predict_proba(Xte)[:,1]))",
        "pit": "AUC 看排序能力；若只关心某一阈值，看精确率/召回率更直观。",
        "target": "理解 ROC / AUC 评估排序能力，对不平衡不敏感。",
        "ex": {
          "q": "AUC = 0.5 说明什么？",
          "a": "等于随机分类器，模型没有排序区分能力；1.0 才完美。"
        }
      },
      {
        "id": "ml2-5",
        "title": "类别不平衡",
        "min": 8,
        "summary": [
          "正类极少时，准确率失真；用精确率/召回率/AUC 评估。",
          "手段：重采样、class_weight、换评估指标。",
          "业务上「漏掉正类代价高」就优先保召回。"
        ],
        "code": "LogisticRegression(class_weight=\"balanced\")",
        "pit": "别被高准确率骗了——先看清正负类比例再选指标。",
        "ex": {
          "q": "100 封里 1 封诈骗，全判正常准确率多少？问题在哪？",
          "a": "99%，但一封诈骗都没抓到；说明准确率在不平衡时失效，要看召回率。"
        },
        "target": "能正确选择与解读分类评估指标。"
      }
    ],
    "quiz": [
      {
        "q": "sigmoid 输出可理解为？",
        "o": [
          "真实概率",
          "0~1 的得分",
          "整数",
          "向量"
        ],
        "a": 1,
        "why": "sigmoid 把实数压到 0~1，当作正类得分/概率。"
      },
      {
        "q": "正负类极不平衡时最该看？",
        "o": [
          "准确率",
          "精确率/召回率",
          "训练步数",
          "参数个数"
        ],
        "a": 1,
        "why": "准确率会被多数类刷高，应看精确率/召回率/F1/AUC。"
      },
      {
        "q": "AUC=0.5 表示？",
        "o": [
          "完美",
          "随机水平",
          "过拟合",
          "未训练"
        ],
        "a": 1,
        "why": "AUC=0.5 等同随机猜测。"
      }
    ]
  },
  {
    "id": "ml3",
    "icon": "📏",
    "name": "模型评估与特征工程",
    "desc": "让模型真正可靠",
    "goal": "掌握训练/验证/测试切分、交叉验证、正则化与特征缩放/编码，理解特征工程的价值。",
    "links": [
      [
        "sklearn 评估度量",
        "https://scikit-learn.org/stable/modules/model_evaluation.html"
      ],
      [
        "特征工程指南",
        "https://www.cnblogs.com/jasonfreak/p/5448385.html"
      ],
      [
        "交叉验证",
        "https://scikit-learn.org/stable/modules/cross_validation.html"
      ]
    ],
    "lab": {
      "t": "标准化 + 评估流水线",
      "req": [
        "用 make_classification 造数据并切分",
        "用 StandardScaler 在训练集上 fit_transform、测试集上 transform",
        "训练逻辑回归并对比「不标准化」与「标准化」的测试准确率（简述差异）",
        "输出标准化后的测试准确率"
      ],
      "starter": "from sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.linear_model import LogisticRegression\npipe = make_pipeline(StandardScaler(), LogisticRegression())\npipe.fit(Xtr, ytr)\nprint(\"标准化后准确率\", pipe.score(Xte, yte))",
      "hint": "用 Pipeline 可避免「用测试集信息泄漏到训练」——scaler 只 fit 训练集。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "ml3-1",
        "title": "训练/验证/测试集",
        "min": 10,
        "summary": [
          "训练集学参数；验证集调超参/早停；测试集只在最后评估。",
          "测试集必须「一次用到」，不能反复调参偷看。",
          "比例常见 60/20/20 或 80/10/10。"
        ],
        "code": "Xtr,Xte,ytr,yte=train_test_split(X,y,test_size=0.2)",
        "pit": "拿测试集调参=数据泄漏，评估结果会虚高、上线就翻车。",
        "target": "正确切分三集，避免数据泄漏。",
        "ex": {
          "q": "拿测试集调参为什么危险？",
          "a": "等于偷看答案，评估会虚高、上线就翻车；测试集只能最后用一次。"
        }
      },
      {
        "id": "ml3-2",
        "title": "交叉验证",
        "min": 10,
        "summary": [
          "把训练集分成 k 折，轮流当验证，取平均更稳。",
          "降低「一次切分运气不好」的波动。",
          "最终评估仍用独立的测试集。"
        ],
        "code": "from sklearn.model_selection import cross_val_score\nprint(cross_val_score(m, Xtr, ytr, cv=5))",
        "pit": "交叉验证用于选模型/调参；评估泛化再用独立测试集。",
        "target": "用 k 折交叉验证选模型/调参，得到更稳的评估。",
        "ex": {
          "q": "交叉验证和单次切分比好在哪？",
          "a": "降低「一次切分运气不好」的波动，取平均更可靠；最终评估仍用独立测试集。"
        }
      },
      {
        "id": "ml3-3",
        "title": "正则化 L1/L2",
        "min": 10,
        "summary": [
          "正则化给损失加「参数不要太大」的惩罚，抑制过拟合。",
          "L2(岭)让参数小且平滑；L1(套索)可把不重要特征压成 0（特征选择）。",
          "强度由超参 λ/C 控制，需验证集调。"
        ],
        "code": "LogisticRegression(C=0.1)   # C 越小正则越强",
        "pit": "正则太强会欠拟合(模型太简单)；太弱仍过拟合——靠验证集找平衡。",
        "target": "理解 L1 / L2 正则抑制过拟合，会调强度。",
        "ex": {
          "q": "L1 和 L2 正则效果有什么不同？",
          "a": "L2 让参数小且平滑；L1 可把不重要特征压成 0，做特征选择。"
        }
      },
      {
        "id": "ml3-4",
        "title": "特征缩放与编码",
        "min": 10,
        "summary": [
          "标准化(减均值除标准差)/归一化(压到0~1)让量纲一致。",
          "梯度类模型对尺度敏感，务必缩放；树模型不敏感。",
          "类别特征用 One-Hot 编码成 0/1 向量。"
        ],
        "code": "from sklearn.preprocessing import StandardScaler\nss=StandardScaler(); Xs=ss.fit_transform(Xtr)",
        "pit": "用同一 scaler 分别 transform 训练/测试，不能把测试集均值混进 fit——否则泄漏。",
        "target": "会对特征做标准化/归一化与编码，且不泄漏测试集。",
        "ex": {
          "q": "为什么 scaler 不能把测试集均值混进 fit？",
          "a": "会把测试集信息泄漏进训练，评估失真；要用同一 scaler 仅 transform 测试集。"
        }
      },
      {
        "id": "ml3-5",
        "title": "特征工程思路",
        "min": 10,
        "summary": [
          "好特征 > 复杂模型：「数据和特征决定上限，模型逼近上限」。",
          "做法：缺失处理、构造组合特征、降维去噪、剔除无关列。",
          "领域知识从这里来，也是比赛提分关键。"
        ],
        "code": "# 由 日期 构造 星期/是否周末；由 文本 构造 长度/关键词",
        "pit": "盲目堆特征不如想清「哪个量真的和标签相关」。",
        "ex": {
          "q": "为什么说特征工程决定上限？",
          "a": "模型只是拟合给定特征到标签的映射；特征里没有的信息，模型再强也学不到。"
        },
        "target": "理解评估流程与特征工程，能搭一条不泄漏的 sklearn 流水线。"
      }
    ],
    "quiz": [
      {
        "q": "测试集的正确用法？",
        "o": [
          "反复调参",
          "只在最后评估一次",
          "当训练集",
          "不要",
          "随机丢弃"
        ],
        "a": 1,
        "why": "测试集只用于最终评估，偷看调参会泄漏、虚高。"
      },
      {
        "q": "L1 正则化的特点是？",
        "o": [
          "参数平滑",
          "可把特征压成0(选择)",
          "加快训练",
          "增大方差"
        ],
        "a": 1,
        "why": "L1 易产生稀疏解，起到特征选择作用。"
      },
      {
        "q": "梯度类模型通常要？",
        "o": [
          "不处理",
          "特征缩放/标准化",
          "加密",
          "降维到2"
        ],
        "a": 1,
        "why": "不同特征量纲不一会误导梯度，通常需标准化。"
      }
    ]
  },
  {
    "id": "ml4",
    "icon": "🌲",
    "name": "经典模型与集成",
    "desc": "不只有神经网络",
    "goal": "理解决策树/随机森林/kNN/SVM 与无监督的 k-means/PCA，知道何时用经典模型而非深度学习。",
    "links": [
      [
        "sklearn 监督学习",
        "https://scikit-learn.org/stable/supervised_learning.html"
      ],
      [
        "集成学习",
        "https://www.bilibili.com/video/BV1Cs411c7M8"
      ],
      [
        "聚类",
        "https://scikit-learn.org/stable/modules/clustering.html"
      ]
    ],
    "lab": {
      "t": "随机森林 + 聚类",
      "req": [
        "用 make_classification 训练 RandomForestClassifier 并输出测试准确率",
        "再用 make_blobs 造无标签数据，用 KMeans(n_clusters=3) 拟合并输出各点簇标签",
        "简述两者分别属于监督/无监督",
        "输出聚类标签前 10 个"
      ],
      "starter": "from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.cluster import KMeans\nfrom sklearn.datasets import make_blobs\nrf = RandomForestClassifier(n_estimators=50)\nrf.fit(Xtr, ytr); print(\"RF 准确率\", rf.score(Xte, yte))\nXb, _ = make_blobs(n_samples=100, centers=3, random_state=0)\nkm = KMeans(n_clusters=3, n_init=10).fit(Xb)\nprint(km.labels_[:10])",
      "hint": "RandomForest 是集成；KMeans 是无监督聚类，labels_ 即簇编号。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "ml4-1",
        "title": "决策树",
        "min": 10,
        "summary": [
          "按特征逐一提问（如「年龄>30?」）把数据分到叶子，叶子给预测。",
          "可解释、不需缩放；但单棵易过拟合、不稳定。",
          "max_depth 等控制复杂度，防止长得太深。"
        ],
        "code": "from sklearn.tree import DecisionTreeClassifier\ntree = DecisionTreeClassifier(max_depth=4)",
        "pit": "树太深会「背答案」(过拟合)；限制深度/叶子样本数是常用正则。",
        "target": "理解决策树如何按特征提问做预测，及过拟合风险。",
        "ex": {
          "q": "树太深会有什么问题？",
          "a": "容易「背答案」(过拟合)；常用限制 max_depth / 叶子样本数来正则。"
        }
      },
      {
        "id": "ml4-2",
        "title": "随机森林与集成",
        "min": 12,
        "summary": [
          "集成：多个弱模型投票，往往强于单个。",
          "随机森林=多棵在不同样本/特征上训练的树做平均/投票。",
          "偏差略升、方差大降，通常比单棵树稳。"
        ],
        "code": "from sklearn.ensemble import RandomForestClassifier\nrf = RandomForestClassifier(n_estimators=100)",
        "pit": "树多了训练慢但更稳；n_estimators 与 max_depth 都要调。",
        "target": "理解集成思想与随机森林为何更稳。",
        "ex": {
          "q": "为什么多个弱模型集成常强于单个？",
          "a": "投票/平均能降低方差、抵消个体误差，通常比单棵树稳。"
        }
      },
      {
        "id": "ml4-3",
        "title": "kNN 与 SVM 直觉",
        "min": 10,
        "summary": [
          "kNN：新样本看最近的 k 个邻居多数票，无需训练(懒惰学习)。",
          "SVM：找一条最大间隔的分界超平面，核技巧处理非线性。",
          "小数据、可解释场景经典模型常优于深度学习。"
        ],
        "code": "from sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.svm import SVC",
        "pit": "kNN 预测慢(要算距离)、对尺度敏感，务必先标准化。",
        "target": "建立 kNN / SVM 的直觉，知道它们对尺度敏感。",
        "ex": {
          "q": "kNN 预测前为什么必须先标准化？",
          "a": "kNN 按距离投票，量纲不同会被大数值特征主导；标准化让各特征公平。"
        }
      },
      {
        "id": "ml4-4",
        "title": "聚类 k-means",
        "min": 10,
        "summary": [
          "无监督：把样本分成 k 个簇，使簇内紧凑、簇间分开。",
          "迭代：随机中心→分配最近簇→重算中心→重复。",
          "需先定 k；结果受初始化影响，常多次跑取最好。"
        ],
        "code": "from sklearn.cluster import KMeans\nkm = KMeans(n_clusters=3, n_init=10).fit(X)",
        "pit": "k-means 假设球状簇、对尺度敏感；先标准化，k 用肘部法/业务定。",
        "target": "理解无监督 k-means 的迭代过程与前提。",
        "ex": {
          "q": "k-means 对尺度敏感吗？k 怎么定？",
          "a": "敏感，先标准化；k 用肘部法或业务含义定，且结果受初始化影响常多次跑取最好。"
        }
      },
      {
        "id": "ml4-5",
        "title": "降维 PCA 实战",
        "min": 8,
        "summary": [
          "PCA 把高维压到低维，保留方差最大的方向，去噪压缩。",
          "常用于可视化(降到2维)与提速。",
          "代价：主成分未必有直观业务含义。"
        ],
        "code": "from sklearn.decomposition import PCA\nX2 = PCA(n_components=2).fit_transform(X)",
        "pit": "降维会丢信息，保留多少主成分要在「压缩」与「保信息」间权衡。",
        "ex": {
          "q": "小表格数据该优先经典模型还是深度学习？",
          "a": "经典模型(SVM/树/集成)往往更快、更可解释、数据需求小；深度学习适合大数据/非结构化(图文本)。"
        },
        "target": "会根据问题选择经典模型 vs 深度学习，并跑通集成与聚类。"
      }
    ],
    "quiz": [
      {
        "q": "随机森林是？",
        "o": [
          "单棵树",
          "多棵树集成",
          "神经网络",
          "聚类"
        ],
        "a": 1,
        "why": "随机森林=多棵决策树集成，降低方差更稳。"
      },
      {
        "q": "k-means 属于？",
        "o": [
          "监督",
          "无监督聚类",
          "回归",
          "强化"
        ],
        "a": 1,
        "why": "k-means 无标签数据聚类，属无监督。"
      },
      {
        "q": "小样本表格数据一般先用？",
        "o": [
          "大模型",
          "经典模型(树/集成)",
          "深度学习",
          "都行"
        ],
        "a": 1,
        "why": "经典模型在小表格数据上常更快更稳更可解释。"
      }
    ]
  },
  {
    "id": "dl1",
    "icon": "🧠",
    "name": "神经网络基础",
    "desc": "从神经元到反向传播",
    "goal": "理解感知机、激活函数、前向/反向传播与优化器，能用 NumPy 手写一个单层感知机训练。",
    "links": [
      [
        "3Blue1Brown · 神经网络",
        "https://www.bilibili.com/video/BV1bx411M7gq"
      ],
      [
        "动手学深度学习 · 多层感知机",
        "https://zh.d2l.ai/chapter_multilayer-perceptrons/index.html"
      ],
      [
        "李宏毅 深度学习",
        "https://www.bilibili.com/video/BV1Wv411h7sN"
      ]
    ],
    "lab": {
      "t": "NumPy 单层感知机",
      "req": [
        "用 NumPy 实现感知机：随机初始化 w,b",
        "重复若干步：前向 z=w·x+b、激活 sign/分步、按误差更新 w,b",
        "在「与门」(AND) 数据上训练，输出最终参数与预测",
        "提示：可用感知机学习规则 w+=lr*(y-yhat)*x"
      ],
      "starter": "import numpy as np\nX = np.array([[0,0],[0,1],[1,0],[1,1]])\ny = np.array([0,0,0,1])   # AND\nw = np.random.randn(2)*0.1; b = 0.0; lr = 0.1\n# 手写训练循环（感知机更新规则）",
      "hint": "AND 是线性可分的，感知机几步就能收敛；预测用 step(w·x+b)。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "dl1-1",
        "title": "感知机与神经元",
        "min": 10,
        "summary": [
          "神经元=加权求和+偏置+激活：a=激活(w·x+b)。",
          "多个神经元层叠成网络，逼近复杂函数。",
          "这是所有深度学习模型的最小单元。"
        ],
        "code": "z = w @ x + b\na = relu(z)",
        "pit": "没有非线性激活，再多层的网络也等价于一个线性变换——激活是关键。",
        "target": "理解神经元 = 加权求和 + 偏置 + 激活，网络逼近复杂函数。",
        "ex": {
          "q": "没有非线性激活会怎样？",
          "a": "多层线性复合仍等价于一个线性变换，网络失去表达非线性函数的能力。"
        }
      },
      {
        "id": "dl1-2",
        "title": "激活函数",
        "min": 10,
        "summary": [
          "ReLU=max(0,z)：单侧抑制、缓解梯度消失，最常用。",
          "Sigmoid/Tanh 用于门控或输出概率，但易饱和。",
          "Softmax 把向量变概率分布，用于多分类输出层。"
        ],
        "code": "def relu(z): return np.maximum(0, z)\ndef softmax(z): e=np.exp(z-z.max()); return e/e.sum()",
        "pit": "输出层用 softmax 时，配合交叉熵损失数值更稳。",
        "target": "说清 ReLU / Sigmoid / Softmax 各自用途。",
        "ex": {
          "q": "为什么 ReLU 最常用？",
          "a": "单侧抑制、缓解梯度消失、计算简单；Sigmoid/Tanh 易饱和，多用于门控或输出层。"
        }
      },
      {
        "id": "dl1-3",
        "title": "前向传播",
        "min": 10,
        "summary": [
          "数据从输入层逐层算到输出层，得到预测。",
          "每层就是一次矩阵乘+激活：a = act(W·a_prev + b)。",
          "整张网络就是一串可微函数的复合。"
        ],
        "code": "# 两层网络前向\na1 = relu(W1 @ x + b1)\na2 = W2 @ a1 + b2",
        "pit": "前向算错一步，后面全错——先在小例子上手算验证。",
        "target": "能手算两层网络的前向，理解每层是矩阵乘 + 激活。",
        "ex": {
          "q": "前向算错一步会怎样？",
          "a": "误差会沿网络向后放大，整个预测错；先在小例子上手算验证再写代码。"
        }
      },
      {
        "id": "dl1-4",
        "title": "反向传播直觉",
        "min": 12,
        "summary": [
          "目标：求损失对每个参数 w,b 的梯度。",
          "链式法则：从输出层往回，逐层把「误差信号」传回去。",
          "有了梯度，梯度下降更新参数。"
        ],
        "code": "# 反向 = 链式法则逐层求 ∂L/∂W, ∂L/∂b\n# 框架自动完成，但思想必须懂",
        "pit": "不懂反向传播，就只会「调包」，遇到不收敛无法诊断。",
        "target": "理解反向传播用链式法则逐层求梯度。",
        "ex": {
          "q": "不懂反向传播会有什么后果？",
          "a": "只会「调包」，模型不收敛时无法定位是数据、学习率还是结构问题。"
        }
      },
      {
        "id": "dl1-5",
        "title": "优化器与梯度问题",
        "min": 10,
        "summary": [
          "SGD 最基础；Adam 自适应学习率，最常用。",
          "梯度消失：深层信号越传越弱；用 ReLU/残差缓解。",
          "学习率调度(预热/衰减)让训练更稳更快。"
        ],
        "code": "# Adam: 一阶+二阶动量估计，自适应步长",
        "pit": "梯度爆炸可加梯度裁剪(clip)；消失用 BN/残差/好初始化。",
        "ex": {
          "q": "为什么激活函数不能全是线性？",
          "a": "多层线性复合仍是线性映射，无法逼近非线性函数；非线性激活才赋予网络表达力。"
        },
        "target": "理解前向后向与优化器，能手写单层感知机训练。"
      }
    ],
    "quiz": [
      {
        "q": "多层全线性激活等价于？",
        "o": [
          "更深网络",
          "单层线性变换",
          "卷积",
          "更强表达"
        ],
        "a": 1,
        "why": "线性复合仍是线性的，无非线性则退化为单层线性。"
      },
      {
        "q": "最常用激活？",
        "o": [
          "ReLU",
          "sigmoid",
          "tanh",
          "step"
        ],
        "a": 0,
        "why": "ReLU 简单、缓解梯度消失，最常用(隐藏层)。"
      },
      {
        "q": "反向传播依赖？",
        "o": [
          "链式法则",
          "积分",
          "排序",
          "行列式"
        ],
        "a": 0,
        "why": "反向传播=链式法则逐层回传梯度。"
      }
    ]
  },
  {
    "id": "dl2",
    "icon": "🔥",
    "name": "PyTorch 实战训练",
    "desc": "用框架训练第一个网络",
    "goal": "会用张量、autograd、nn.Module 与训练循环，在 PyTorch 里跑通一个分类器。",
    "links": [
      [
        "PyTorch 官方教程",
        "https://pytorch.org/tutorials/beginner/basics/intro.html"
      ],
      [
        "动手学深度学习 · 自动求梯度",
        "https://zh.d2l.ai/chapter_preliminaries/autograd.html"
      ],
      [
        "李宏毅 PyTorch",
        "https://www.bilibili.com/video/BV1Wv411h7sN"
      ]
    ],
    "lab": {
      "t": "PyTorch 训练分类器",
      "req": [
        "用 torch 造简单数据或加载 make_classification→转 tensor",
        "定义一个 2 层 nn.Sequential 网络",
        "写训练循环：前向→loss→loss.backward()→optimizer.step()",
        "训练若干轮后打印 loss 下降趋势（答案给完整可运行代码）"
      ],
      "starter": "import torch, torch.nn as nn\n# 定义网络、损失、优化器\nmodel = nn.Sequential(nn.Linear(4, 16), nn.ReLU(), nn.Linear(16, 2))\nloss_fn = nn.CrossEntropyLoss()\nopt = torch.optim.Adam(model.parameters(), lr=0.01)\n# 训练循环（答案补全）",
      "hint": "CrossEntropyLoss 自带 softmax；标签用长整型；每步先 opt.zero_grad() 再 backward 再 step。",
      "xp": 30
    },
    "lessons": [
      {
        "id": "dl2-1",
        "title": "张量 tensor",
        "min": 10,
        "summary": [
          "tensor 类似 NumPy 数组，但能在 GPU 上算、可记录梯度。",
          "dim/shape/dtype 同 ndarray；.to(device) 搬运到 GPU。"
        ],
        "code": "import torch\nx = torch.tensor([[1.0,2.0]])\nprint(x.shape, x.dtype)",
        "pit": "tensor 默认不追踪梯度；要训练的参数需 requires_grad=True(用 nn.Parameter 自动)。",
        "target": "理解 tensor 与 NumPy 数组的区别，会搬运到 GPU。",
        "ex": {
          "q": "tensor 和 ndarray 最大区别？",
          "a": "tensor 能在 GPU 上算、可记录梯度(requires_grad)，适合自动求导与训练。"
        }
      },
      {
        "id": "dl2-2",
        "title": "autograd 自动求导",
        "min": 10,
        "summary": [
          "PyTorch 记录张量的运算图，loss.backward() 自动算梯度。",
          "梯度存在 .grad；多次反向前要用 zero_grad 清空。",
          "把人从手推链式法则中解放出来。"
        ],
        "code": "y = (x*x).sum(); y.backward()\nprint(x.grad)   # 2x",
        "pit": "累加梯度不清零会越叠越大——每个 step 前 opt.zero_grad()。",
        "target": "理解 autograd 自动求导与 zero_grad 的必要性。",
        "ex": {
          "q": "为什么每个 step 前都要 zero_grad？",
          "a": "PyTorch 梯度默认累加，不清零会让多步梯度叠加，更新方向错乱。"
        }
      },
      {
        "id": "dl2-3",
        "title": "nn.Module 建网络",
        "min": 10,
        "summary": [
          "继承 nn.Module 定义 __init__ 层与 forward 计算。",
          "nn.Linear/ReLU 等是现成积木；Sequential 可快速堆叠。",
          "parameters() 一次性拿出所有可学参数。"
        ],
        "code": "class Net(nn.Module):\n    def __init__(self):\n        super().__init__(); self.fc=nn.Linear(4,2)\n    def forward(self,x): return self.fc(x)",
        "pit": "forward 里别写死 batch 大小；用 -1 维保持通用。",
        "target": "会用 nn.Module 定义网络结构与 forward。",
        "ex": {
          "q": "forward 里为什么别写死 batch 大小？",
          "a": "用 -1 维保持通用，模型才能接受任意批量输入。"
        }
      },
      {
        "id": "dl2-4",
        "title": "训练循环",
        "min": 12,
        "summary": [
          "标准四步：前向得预测→算 loss→backward 求梯度→step 更新。",
          "每个 epoch 遍历数据；验证集监控防过拟合。",
          "loss 不降先查学习率、数据、梯度是否流动。"
        ],
        "code": "for xb,yb in loader:\n    opt.zero_grad()\n    loss = loss_fn(model(xb), yb)\n    loss.backward(); opt.step()",
        "pit": "常见 bug：忘记 zero_grad 导致梯度累加；或忘 model.train()/eval()。",
        "target": "能写出「前向→loss→backward→step」的标准训练循环。",
        "ex": {
          "q": "训练循环最常见的两个 bug？",
          "a": "忘记 zero_grad 导致梯度累加；或忘 model.train()/eval() 导致 BN/Dropout 行为错。"
        }
      },
      {
        "id": "dl2-5",
        "title": "GPU 与数据加载",
        "min": 8,
        "summary": [
          ".to('cuda') 把模型/数据放上 GPU 加速。",
          "DataLoader 批量/打乱读取，训练更稳更高效。",
          "transform 做归一化等预处理。"
        ],
        "code": "device='cuda' if torch.cuda.is_available() else 'cpu'\nmodel.to(device)",
        "pit": "模型和数据要在同一 device，否则报类型不匹配。",
        "ex": {
          "q": "训练循环里为什么要先 opt.zero_grad()？",
          "a": "PyTorch 梯度默认累加，不清零会让多步梯度叠加，更新方向错乱。"
        },
        "target": "能用 PyTorch 跑通一个完整训练循环。"
      }
    ],
    "quiz": [
      {
        "q": "backward() 之后梯度存哪？",
        "o": [
          "loss",
          "各参数 .grad",
          "optimizer",
          "CPU"
        ],
        "a": 1,
        "why": "反向后梯度存在各张量的 .grad 属性。"
      },
      {
        "q": "训练四步顺序正确的是？",
        "o": [
          "backward→forward→step",
          "forward→loss→backward→step",
          "step→forward→loss",
          "forward→step→backward"
        ],
        "a": 1,
        "why": "前向算预测→算损失→反向求梯度→更新参数。"
      },
      {
        "q": "怕梯度累加要？",
        "o": [
          "加大学习率",
          "每步前 zero_grad",
          "多 GPU",
          "删层"
        ],
        "a": 1,
        "why": "每步 opt.zero_grad() 清空上一步梯度。"
      }
    ]
  },
  {
    "id": "dl3",
    "icon": "🖼️",
    "name": "CNN 与计算机视觉",
    "desc": "让模型看懂图像",
    "goal": "理解卷积/池化/通道，知道经典 CNN 结构，能用 torchvision 跑一个图像分类网络。",
    "links": [
      [
        "CS231n 卷积可视化",
        "https://www.bilibili.com/video/BV1nJ411z7fe"
      ],
      [
        "PyTorch 视觉教程",
        "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html"
      ],
      [
        "动手学深度学习 · 卷积",
        ":https://zh.d2l.ai/chapter_convolutional-neural-networks/index.html"
      ]
    ],
    "lab": {
      "t": "torchvision CNN 分类",
      "req": [
        "用 torchvision 的 MNIST 或 CIFAR10 数据(答案给可运行骨架)",
        "定义 卷积→ReLU→池化→全连接 的网络",
        "训练若干轮打印准确率",
        "说明卷积相比全连接省了多少参数"
      ],
      "starter": "import torch.nn as nn\nclass CNN(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Conv2d(1, 16, 3), nn.ReLU(),\n            nn.MaxPool2d(2), nn.Flatten(),\n            nn.Linear(16*13*13, 10))\n    def forward(self, x): return self.net(x)",
      "hint": "卷积用局部窗口扫图，共享权重，参数量远小于全连接。",
      "xp": 30
    },
    "lessons": [
      {
        "id": "dl3-1",
        "title": "卷积运算",
        "min": 12,
        "summary": [
          "卷积核(滤波器)在图上滑动，逐窗口做乘加，提取边缘/纹理等特征。",
          "局部连接+权值共享，参数量远小于全连接。",
          "输出特征图大小由核大小/步长/填充决定。"
        ],
        "code": "nn.Conv2d(in_ch, out_ch, kernel_size=3, padding=1)",
        "pit": "卷积核像「特征探测器」；不同核学到不同模式(边缘/角点/纹理)。",
        "target": "理解卷积核提取特征、权值共享省参数。",
        "ex": {
          "q": "卷积相比全连接为什么省参数？",
          "a": "一个核扫全图只学一份参数(权值共享+局部连接)，而不是每个连接独立。"
        }
      },
      {
        "id": "dl3-2",
        "title": "池化与通道",
        "min": 10,
        "summary": [
          "池化(最大/平均)下采样，缩小尺寸、增强平移不变性。",
          "通道(channel)数=特征种类数；网络越深通道越多、图越小。"
        ],
        "code": "nn.MaxPool2d(2)   # 尺寸减半",
        "pit": "通道是第一维(batch, channel, h, w)；维度顺序错是 CNN 最常见 bug。",
        "target": "理解池化下采样与通道含义。",
        "ex": {
          "q": "CNN 张量维度顺序是什么？",
          "a": "(batch, channel, height, width)；维度顺序写错是 CNN 最常见 bug。"
        }
      },
      {
        "id": "dl3-3",
        "title": "经典 CNN 结构",
        "min": 10,
        "summary": [
          "典型套路：卷积块堆若干层→展平→全连接→输出。",
          "LeNet/AlexNet/VGG/ResNet 逐代更深更强。",
          "ResNet 用残差连接缓解深层梯度消失。"
        ],
        "code": "# 卷积提取 → 池化压缩 → 全连接分类",
        "pit": "ResNet 的跳跃连接让上百层也能训练，是现代CNN基石。",
        "target": "理解「卷积→池化→全连接」套路与 ResNet 跳跃连接。",
        "ex": {
          "q": "ResNet 的跳跃连接解决什么？",
          "a": "缓解深层网络的梯度消失，让上百层也能训练，是现代 CNN 基石。"
        }
      },
      {
        "id": "dl3-4",
        "title": "数据增强与迁移学习",
        "min": 10,
        "summary": [
          "数据增强(翻转/裁剪/调色)低成本扩充样本、提升泛化。",
          "迁移学习：用预训练大模型当特征提取器，小数据也能用好效果。",
          "自己的小数据集上，迁移学习常比从零训更稳。"
        ],
        "code": "from torchvision import models\nm = models.resnet18(weights=\"DEFAULT\")",
        "pit": "标注数据贵，先用预训练权重再微调，往往事半功倍。",
        "ex": {
          "q": "卷积相比全连接为什么省参数？",
          "a": "权值共享+局部连接：一个核扫全图只学一份参数，而全连接每个连接都独立。"
        },
        "target": "理解 CNN 结构，能跑一个图像分类网络。"
      }
    ],
    "quiz": [
      {
        "q": "卷积的核心优势？",
        "o": [
          "参数多",
          "权值共享+局部连接省参",
          "只能处理一维",
          "必须全连接"
        ],
        "a": 1,
        "why": "卷积局部连接+权值共享，参数量远小于全连接。"
      },
      {
        "q": "池化的作用？",
        "o": [
          "增参数",
          "下采样/平移不变",
          "上采样",
          "归一化"
        ],
        "a": 1,
        "why": "池化下采样，缩小尺寸并增强平移不变性。"
      },
      {
        "q": "小数据集上更稳的做法？",
        "o": [
          "从零猛训",
          "迁移学习/预训练",
          "删数据",
          "只训练最后一层随机"
        ],
        "a": 1,
        "why": "用预训练权重迁移学习，小数据也能取得好效果。"
      }
    ]
  },
  {
    "id": "dl4",
    "icon": "🔁",
    "name": "序列模型与注意力",
    "desc": "处理有序与时间数据",
    "goal": "理解 RNN/LSTM 与注意力机制的直觉，知道它们如何建模序列（文本、时序）。",
    "links": [
      [
        "李宏毅 RNN/LSTM",
        "https://www.bilibili.com/video/BV1GE411d7Ut"
      ],
      [
        "The Illustrated Transformer",
        "https://jalammar.github.io/illustrated-transformer/"
      ],
      [
        "动手学深度学习 · 循环网络",
        "https://zh.d2l.ai/chapter_recurrent-neural-networks/index.html"
      ]
    ],
    "lab": {
      "t": "描述注意力如何工作",
      "mode": "text",
      "req": [
        "用文字说明：给定 Query/Key/Value，注意力如何计算「加权和」",
        "写出 softmax(QKᵀ/√d)V 的含义（无需推导）",
        "举一个例子：翻译时「it」如何注意到正确的先行词",
        "不少于 150 字"
      ],
      "starter": "# 1. 注意力计算的直觉：\n# 2. softmax(QK^T / sqrt(d)) V 各部分含义：\n# 3. 例：翻译中「it」如何对齐先行词：",
      "hint": "注意力=按相关性对 Value 做加权求和；QKᵀ 算相似度，softmax 归一化成权重。",
      "xp": 20
    },
    "lessons": [
      {
        "id": "dl4-1",
        "title": "RNN 与序列",
        "min": 10,
        "summary": [
          "RNN 带「隐状态」记住前文，逐步处理序列每个元素。",
          "适合文本/语音/时序；但长程依赖会遗忘。",
          "隐状态在步间传递，像「记忆纸条」。"
        ],
        "code": "h_t = tanh(W @ x_t + U @ h_{t-1} + b)",
        "pit": "RNN 梯度沿时间乘乘乘易消失/爆炸，难学长程依赖。",
        "target": "理解 RNN 用隐状态记前文，及长程依赖难题。",
        "ex": {
          "q": "RNN 处理长序列的短板？",
          "a": "隐状态逐步传递，梯度沿时间易消失/爆炸，难学长期依赖。"
        }
      },
      {
        "id": "dl4-2",
        "title": "LSTM / GRU",
        "min": 10,
        "summary": [
          "LSTM 用门控(遗忘/输入/输出)显式控制记忆的保留与更新。",
          "缓解长程依赖问题；GRU 是更简版本。",
          "门控=可微的「记住多少/忘多少」开关。"
        ],
        "code": "# 遗忘门决定保留多少旧记忆，输入门决定写入多少新信息",
        "pit": "门控让梯度可沿「记忆线」稳定流动，长序列训练更可行。",
        "target": "理解门控如何缓解长程依赖。",
        "ex": {
          "q": "LSTM 的门控起什么作用？",
          "a": "用遗忘/输入/输出门显式控制记忆的保留与更新，让梯度沿记忆线稳定流动。"
        }
      },
      {
        "id": "dl4-3",
        "title": "注意力机制直觉",
        "min": 12,
        "summary": [
          "注意力：用 Query 去和每个 Key 算相似度，按相似度对 Value 加权求和。",
          "谁相关度高，谁的贡献大——像「动态检索」。",
          "相比 RNN 一步到位看到全局，长程依赖不再被遗忘。"
        ],
        "code": "# scores = Q @ K^T / sqrt(d)\n# attn = softmax(scores) @ V",
        "pit": "注意力不是魔法，本质是可学习的「加权求和权重」。",
        "target": "理解注意力 = 按相关性加权求和，为 Transformer 铺垫。",
        "ex": {
          "q": "注意力和普通加权平均有什么不同？",
          "a": "权重是可学习的(由 Query/Key 相似度算出)，谁相关度高谁贡献大，像动态检索。"
        }
      },
      {
        "id": "dl4-4",
        "title": "Seq2Seq 与编解码",
        "min": 10,
        "summary": [
          "编码器把输入序列压成上下文；解码器据此逐步生成输出。",
          "机器翻译/摘要的经典结构。",
          "注意力让解码时直接「回头看」输入每个位置。"
        ],
        "code": "# 编码器 → 上下文向量 → 解码器 + 注意力",
        "pit": "没有注意力的 Seq2Seq 把整句压成一个向量，句子一长就丢信息。",
        "ex": {
          "q": "注意力相比 RNN 解决的最大痛点？",
          "a": "RNN 长程信息会被逐步冲淡；注意力让任意两位置直接相连，长依赖不再难学。"
        },
        "target": "理解注意力是「按相关性加权求和」，为 Transformer 铺垫。"
      }
    ],
    "quiz": [
      {
        "q": "RNN 的隐状态作用是？",
        "o": [
          "存储权重",
          "记忆前文",
          "归一化",
          "降维"
        ],
        "a": 1,
        "why": "隐状态在步间传递，相当于记住前文。"
      },
      {
        "q": "LSTM 用什么缓解长依赖？",
        "o": [
          "更多层",
          "门控记忆",
          "更大学习率",
          "池化"
        ],
        "a": 1,
        "why": "门控显式控制记忆保留/更新，缓解梯度消失。"
      },
      {
        "q": "注意力本质是？",
        "o": [
          "卷积",
          "按相关性对 Value 加权求和",
          "排序",
          "聚类"
        ],
        "a": 1,
        "why": "注意力=用相似度对 Value 做动态加权求和。"
      }
    ]
  },
  {
    "id": "dl5",
    "icon": "✨",
    "name": "生成模型与 Transformer",
    "desc": "现代大模型的地基",
    "goal": "理解生成模型(VAE/GAN)直觉与 Transformer 的 Self-Attention 结构，知道 BERT/GPT 出自哪里。",
    "links": [
      [
        "The Illustrated Transformer(中文)",
        "https://jalammar.github.io/illustrated-transformer/"
      ],
      [
        "李宏毅 生成模型",
        "https://www.bilibili.com/video/BV1GE411d7Ut"
      ],
      [
        "Attention Is All You Need",
        "https://arxiv.org/abs/1706.03762"
      ]
    ],
    "lab": {
      "t": "画出/描述 Transformer 结构",
      "mode": "text",
      "req": [
        "用文字描述一个 Transformer 编码器块包含哪些子层(自注意力、前馈、残差、归一)",
        "说明 Self-Attention 中 Q/K/V 各来自哪里(同一序列)",
        "说明为什么它能并行训练(不像 RNN 逐步)",
        "不少于 180 字"
      ],
      "starter": "# 1. 编码器块子层：\n# 2. Self-Attention 的 Q/K/V 来源：\n# 3. 为何能并行(对比 RNN)：",
      "hint": "编码器块=自注意力+残差+LayerNorm+前馈+残差+LayerNorm；Q/K/V 都来自同一输入序列的不同线性投影。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "dl5-1",
        "title": "生成模型 VAE / GAN",
        "min": 10,
        "summary": [
          "VAE：学数据的低维分布，能「采样生成」新样本。",
          "GAN：生成器与判别器对抗博弈，生成以假乱真。",
          "生成式=从分布里造出新内容，是 AIGC 的基础。"
        ],
        "code": "# GAN: 生成器 G 骗过判别器 D，D 努力识破\n# 二者对抗，G 越生成越真",
        "pit": "GAN 训练不稳定(模式崩溃)；扩散模型(diffusion)是更稳的新主流。",
        "target": "理解生成模型从分布采样造新内容。",
        "ex": {
          "q": "GAN 的主要问题？",
          "a": "训练不稳定、易模式崩溃；扩散模型是更稳的新主流。"
        }
      },
      {
        "id": "dl5-2",
        "title": "Self-Attention 与 QKV",
        "min": 12,
        "summary": [
          "Self-Attention：序列每个位置都当 Query，和所有位置(含自己)的 Key 算相似度。",
          "输出是该位置对全序列的「加权理解」。",
          "多头注意力并行看不同子空间关系。"
        ],
        "code": "# 每个 token: 用自身 Q 去对所有 K 算分 → 对 V 加权",
        "pit": "Self-Attention 让「每个词」直接看到句子里任何词，距离不再衰减信息。",
        "target": "理解 Self-Attention 让每个位置直接看全序列。",
        "ex": {
          "q": "Self-Attention 相比 RNN 解决了什么痛点？",
          "a": "RNN 长程信息会被逐步冲淡；Self-Attention 让任意两位置直接相连，距离不衰减信息。"
        }
      },
      {
        "id": "dl5-3",
        "title": "Transformer 编解码",
        "min": 12,
        "summary": [
          "Transformer 完全基于注意力，无循环、可高度并行。",
          "编码器理解输入；解码器用掩码自注意力+交叉注意力逐步生成。",
          "2017 年提出，是现代所有大模型的共同骨架。"
        ],
        "code": "# Encoder: Self-Attn + FFN (×N)\n# Decoder: Masked Self-Attn + Cross-Attn + FFN (×N)",
        "pit": "位置信息需额外用位置编码注入，因为注意力本身无序。",
        "target": "说清 Transformer 结构与位置编码的必要性。",
        "ex": {
          "q": "注意力本身无序，怎么办？",
          "a": "额外注入位置编码，把顺序信息告诉模型。"
        }
      },
      {
        "id": "dl5-4",
        "title": "BERT 与 GPT 直觉",
        "min": 10,
        "summary": [
          "BERT(编码器)： bidirectional 理解，适合分类/抽取(NLU)。",
          "GPT(解码器)：自回归生成，擅写后续(LLM 主流)。",
          "「预训练+微调」范式由它们确立并延续至今。"
        ],
        "code": "# BERT: 完形填空式预训练(理解)\n# GPT: 预测下一个词(生成)",
        "pit": "ChatGPT 类模型基于解码器(自回归)；理解类任务常用编码器或编解码。",
        "ex": {
          "q": "为什么大模型多基于 Transformer 而非 RNN？",
          "a": "注意力可并行、长依赖不衰减，能训超大规模数据；RNN 逐步且长程易忘，难扩展。"
        },
        "target": "说清 Transformer 结构与 BERT/GPT 的区别，建立大模型认知。"
      }
    ],
    "quiz": [
      {
        "q": "Transformer 主要依赖？",
        "o": [
          "循环",
          "注意力",
          "池化",
          "卷积"
        ],
        "a": 1,
        "why": "Transformer 完全基于注意力，无循环。"
      },
      {
        "q": "GPT 属于？",
        "o": [
          "编码器",
          "解码器(自回归生成)",
          "自编码器",
          "CNN"
        ],
        "a": 1,
        "why": "GPT 用解码器做自回归生成，是 LLM 主流。"
      },
      {
        "q": "Self-Attention 让每个词能？",
        "o": [
          "只看左边",
          "直接看全序列任意位置",
          "只看自己",
          "降维"
        ],
        "a": 1,
        "why": "自注意力让任意两位置直接相连，长依赖不衰减。"
      }
    ]
  },
  {
    "id": "agi1",
    "icon": "🎮",
    "name": "强化学习",
    "desc": "从奖励里学决策",
    "goal": "理解智能体-环境-奖励框架、值函数、Q-learning 与策略梯度，知道 RLHF 如何把 LLM 对齐到人类偏好。",
    "links": [
      [
        "李宏毅 强化学习",
        "https://www.bilibili.com/video/BV1NW411Y647"
      ],
      [
        "OpenAI Spinning Up",
        "https://spinningup.openai.com/"
      ],
      [
        "RLHF 讲解",
        "https://huyenchip.com/2023/05/02/rlhf.html"
      ]
    ],
    "lab": {
      "t": "描述策略梯度如何工作",
      "mode": "text",
      "req": [
        "用文字说明：智能体在环境中采取动作获得奖励，目标是什么",
        "策略梯度如何「奖励好的动作、惩罚坏的动作」来更新策略",
        "举一个例子：下棋 AI 终局胜了，如何回溯鼓励前面的走法",
        "说明 RLHF 用人类反馈当奖励 signals",
        "不少于 180 字"
      ],
      "starter": "# 1. RL 目标：最大化长期累计奖励\n# 2. 策略梯度：好动作提概率、坏动作降概率\n# 3. 例子(棋)：\n# 4. RLHF 中的奖励来自：",
      "hint": "策略梯度用「动作带来的回报」作权重去调高/调低该动作概率；RLHF 把人类偏好打成奖励模型。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "agi1-1",
        "title": "智能体-环境-奖励",
        "min": 10,
        "summary": [
          "智能体在环境中感知状态、采取动作、获得奖励。",
          "目标：最大化长期累计奖励，而非单步。",
          "与监督学习不同：没有现成「正确答案」，靠试错。"
        ],
        "code": "# loop: s = env.reset()\n# while not done: a=policy(s); s,r,done=env.step(a)",
        "pit": "奖励稀疏(很少给分)时极难学——奖励设计是 RL 的核心难题。",
        "target": "理解 RL 的「感知-动作-奖励」框架与最大化长期奖励。",
        "ex": {
          "q": "RL 和 supervised learning 最大不同？",
          "a": "没有现成「正确答案」，靠与环境试错拿奖励学策略；优化的是长期累计回报。"
        }
      },
      {
        "id": "agi1-2",
        "title": "值函数与贝尔曼",
        "min": 10,
        "summary": [
          "值函数 V(s)=从状态 s 出发能拿到的期望累计奖励。",
          "Q(s,a)=在 s 采取 a 后的期望回报。",
          "贝尔曼方程：当前值=即时奖励+未来值折扣，支撑动态规划求解。"
        ],
        "code": "# V(s) = E[ r + γ V(s') ]",
        "pit": "折扣因子 γ 平衡「眼前 vs 长远」；γ≈1 更看重未来。",
        "target": "理解值函数 / Q 函数与贝尔曼方程。",
        "ex": {
          "q": "折扣因子 γ 是干嘛的？",
          "a": "平衡眼前与长远奖励；γ≈1 更看重未来，γ 小则更重视即时奖励。"
        }
      },
      {
        "id": "agi1-3",
        "title": "Q-learning 与 DQN",
        "min": 10,
        "summary": [
          "Q-learning：学一张 Q 表/网络，贪心选 Q 最大的动作。",
          "DQN：用神经网络近似 Q，配合经验回放稳定训练。",
          "从 Atari 游戏到控制均可端到端学。"
        ],
        "code": "# Q(s,a) ≈ 神经网络；选 argmax_a Q(s,a)",
        "pit": "DQN 用「目标网络+经验回放」缓解训练不稳定，是深度 RL 里程碑。",
        "target": "理解 Q-learning 与 DQN 用神经网络近似 Q。",
        "ex": {
          "q": "DQN 为什么稳？",
          "a": "用目标网络 + 经验回放缓解训练不稳定，是深度 RL 里程碑。"
        }
      },
      {
        "id": "agi1-4",
        "title": "策略梯度与 REINFORCE",
        "min": 10,
        "summary": [
          "直接对策略网络参数求「回报」梯度，好动作提概率、坏动作降。",
          "相比值函数，更直接优化策略，适合连续/大动作空间。",
          "PPO 是当下最常用、稳定的策略梯度变体。"
        ],
        "code": "# 目标: 最大化 E[ return * log π(a|s) ]",
        "pit": "策略梯度方差大、样本效率低；PPO 用裁剪限制步长来稳住。",
        "target": "理解直接优化策略的方法与 PPO 的稳定性。",
        "ex": {
          "q": "策略梯度的主要问题？",
          "a": "方差大、样本效率低；PPO 用裁剪限制步长来稳住训练。"
        }
      },
      {
        "id": "agi1-5",
        "title": "RLHF 与对齐",
        "min": 10,
        "summary": [
          "RLHF：用人类偏好训练「奖励模型」，再以此奖励微调 LLM。",
          "让模型输出更符合人类价值观与指令意图。",
          "是 ChatGPT 等「好用」的关键一环。"
        ],
        "code": "# 人类排序 → 奖励模型 → PPO 微调 LLM",
        "pit": "RLHF 不是让模型「更聪明」，而是「更听话/更安全/更符合偏好」。",
        "ex": {
          "q": "RLHF 里的「奖励」从哪来？",
          "a": "先收集人类对多个回答的偏好排序，训一个奖励模型来打分，再用作 RL 的奖励信号。"
        },
        "target": "理解 RL 框架与 RLHF 如何把大模型对齐到人类偏好。"
      }
    ],
    "quiz": [
      {
        "q": "RL 的目标？",
        "o": [
          "拟合标签",
          "最大化长期累计奖励",
          "分类",
          "聚类"
        ],
        "a": 1,
        "why": "RL 通过试错最大化长期累计奖励。"
      },
      {
        "q": "DQN 改进 Q-learning 靠？",
        "o": [
          "树",
          "神经网络近似Q+经验回放",
          "SVM",
          "聚类"
        ],
        "a": 1,
        "why": "DQN 用神经网络近似 Q 并加经验回放稳定训练。"
      },
      {
        "q": "RLHF 的奖励来自？",
        "o": [
          "环境物理",
          "人类偏好训练的奖励模型",
          "随机",
          "标签"
        ],
        "a": 1,
        "why": "RLHF 用人类偏好排序训奖励模型，作 RL 奖励信号。"
      }
    ]
  },
  {
    "id": "agi2",
    "icon": "💬",
    "name": "大语言模型 LLM",
    "desc": "对话式 AI 的核心",
    "goal": "理解预训练、SFT 微调、Prompt 工程、RAG 与推理(Chain-of-Thought)，知道怎么用好一个 LLM。",
    "links": [
      [
        "李宏毅 生成式大模型",
        "https://www.bilibili.com/video/BV1pf4y1d4C7"
      ],
      [
        "Prompt 工程指南",
        "https://www.promptingguide.ai/zh"
      ],
      [
        "RAG 综述",
        "https://arxiv.org/abs/2312.10997"
      ]
    ],
    "lab": {
      "t": "设计一个 RAG 流程",
      "mode": "text",
      "req": [
        "用文字设计「基于私有文档问答」的 RAG 流程：切分→向量化→存库→检索→拼接进 Prompt→生成",
        "说明为什么比直接让模型凭记忆答更可靠(减少幻觉)",
        "列出用到的关键技术(嵌入模型/向量库)",
        "不少于 180 字"
      ],
      "starter": "# RAG 流程：\n# 1. 文档切分与向量化(embed)\n# 2. 存入向量库\n# 3. 提问时检索 top-k\n# 4. 拼进 Prompt 交给 LLM 生成\n# 为何减少幻觉：",
      "hint": "RAG 让模型「先查资料再回答」，把答案锚定在给定文档，降低编造。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "agi2-1",
        "title": "预训练与目标",
        "min": 10,
        "summary": [
          "预训练：在海量文本上「预测下一个词」，学语言与知识。",
          "参数量与数据量越大，能力越强(缩放定律)。",
          "预训练得到「通才」基座模型。"
        ],
        "code": "# 自回归预训练目标: max P(x_t | x_<t)",
        "pit": "基座模型只是「续写机器」；能否按指令做事，靠后续对齐。",
        "target": "理解预训练「预测下一个词」学语言与知识。",
        "ex": {
          "q": "基座模型等于「懂指令」吗？",
          "a": "不，它只是续写机器；能否按指令做事靠后续 SFT/RLHF 对齐。"
        }
      },
      {
        "id": "agi2-2",
        "title": "微调 SFT 与指令",
        "min": 10,
        "summary": [
          "SFT：用「指令-回答」高质量数据微调，让模型听懂人话。",
          "少量高质量示范胜过大量噪声数据。",
          "LoRA 等参数高效微调，低成本适配。"
        ],
        "code": "# 用 (instruction, response) 对微调基座",
        "pit": "SFT 教「格式与听话」；领域知识更多靠 RAG/继续预训练补。",
        "target": "理解 SFT 让模型听懂指令，少量高质量胜大量噪声。",
        "ex": {
          "q": "SFT 主要教模型什么？",
          "a": "教「格式与听话」(按指令输出)；领域知识更多靠 RAG/继续预训练补。"
        }
      },
      {
        "id": "agi2-3",
        "title": "Prompt 工程",
        "min": 10,
        "summary": [
          "清晰角色/任务/格式/示例，模型 output 质量天差地别。",
          "技巧：少样本示例、思维链(CoT)、分步、给输出模板。",
          "你给的上下文决定模型能用的信息上限。"
        ],
        "code": "# 角色 + 任务 + 约束 + 示例 + 输出格式",
        "pit": "Prompt 不是咒语，是「把任务说清楚」；先写清再调。",
        "target": "会用角色/任务/示例/CoT 等技巧写好 Prompt。",
        "ex": {
          "q": "Prompt 是「咒语」吗？",
          "a": "不是，是「把任务说清楚」；先写清角色/任务/格式/示例，再调。"
        }
      },
      {
        "id": "agi2-4",
        "title": "RAG 检索增强",
        "min": 12,
        "summary": [
          "RAG：先检索相关文档，再让 LLM 基于检索内容作答。",
          "把答案锚定在可信资料，显著减少幻觉、易更新。",
          "嵌入模型把文本变向量，向量库做相似检索。"
        ],
        "code": "# 问 → embed → 检索 top-k → 拼进 context → LLM 答",
        "pit": "RAG 让模型「开卷考试」；知识库更新无需重训模型。",
        "target": "理解 RAG 先检索再作答、减少幻觉。",
        "ex": {
          "q": "RAG 相比裸模型凭记忆答强在哪？",
          "a": "答案锚定在给定文档(开卷考试)，减少编造、知识可随时更新无需重训。"
        }
      },
      {
        "id": "agi2-5",
        "title": "上下文与推理 CoT",
        "min": 10,
        "summary": [
          "CoT：让模型「一步步想」再给答案，复杂推理显著提升。",
          "推理模型会先展开思考过程；上下文长度决定能处理多长材料。",
          "给模型足够中间步骤，比直接要结果更准。"
        ],
        "code": "# 让模型「让我们一步步思考...」再答",
        "pit": "长上下文≠会用上下文；关键事实要放在显眼位置、必要时分段。",
        "ex": {
          "q": "RAG 相比「裸模型凭记忆答」强在哪？",
          "a": "先检索权威资料再答，答案锚定在给定文档，减少编造(幻觉)，且知识可随时更新无需重训。"
        },
        "target": "会用 Prompt 与 RAG 把一个 LLM 用得更准更可靠。"
      }
    ],
    "quiz": [
      {
        "q": "预训练主要学？",
        "o": [
          "分类标签",
          "语言与知识(预测下一词)",
          "图像",
          "聚类"
        ],
        "a": 1,
        "why": "预训练靠海量文本预测下一词，学语言与世界知识。"
      },
      {
        "q": "RAG 的主要作用是？",
        "o": [
          "提速",
          "减少幻觉/基于资料作答",
          "降本",
          "加密"
        ],
        "a": 1,
        "why": "先检索再生成，把答案锚定资料，减少幻觉且易更新。"
      },
      {
        "q": "CoT 指？",
        "o": [
          "链式思考",
          "聚类",
          "卷积",
          "压缩"
        ],
        "a": 0,
        "why": "Chain-of-Thought：让模型逐步推理再答，提升复杂题表现。"
      }
    ]
  },
  {
    "id": "agi3",
    "icon": "🕸️",
    "name": "多模态与 Agent",
    "desc": "会调用工具的 AI",
    "goal": "理解多模态对齐(CLIP)、函数/工具调用、Agent 的「规划-执行-观察」循环与记忆机制。",
    "links": [
      [
        "CLIP 讲解",
        "https://www.bilibili.com/video/BV1SL4y1x7Zj"
      ],
      [
        "ReAct: 推理+行动",
        "https://arxiv.org/abs/2210.03629"
      ],
      [
        "AutoGPT/Agent 综述",
        "https://www.bilibili.com/video/BV1Xa4y1Y7cZ"
      ]
    ],
    "lab": {
      "t": "设计一个 Agent 循环",
      "mode": "text",
      "req": [
        "用文字设计一个「能查天气并回答」的 Agent 工作流：思考→选工具(查天气API)→执行→观察结果→再思考→最终回答",
        "说明为什么需要「观察」这一步(否则模型可能编造天气)",
        "列出 Agent 需要的组件(规划/工具/记忆)",
        "不少于 180 字"
      ],
      "starter": "# Agent 循环：\n# Thought(思考) → Action(选工具) → Observation(观察) → ...\n# 为何需要 Observation：\n# 组件：",
      "hint": "Agent = LLM + 工具 + 记忆；每轮先想再调工具，把真实返回当作 Observation 继续推理，避免凭空编造。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "agi3-1",
        "title": "多模态：图文对齐",
        "min": 10,
        "summary": [
          "CLIP 把图像和文本映射到同一向量空间，能「以文搜图」。",
          "多模态=模型同时理解两种以上模态(文/图/音)。",
          "为视觉问答、图文生成打下基础。"
        ],
        "code": "# image_encoder 与 text_encoder 对齐到同一空间\n# 相似度 = 图文向量点积",
        "pit": "对齐空间后，可用自然语言去检索/描述图像，零样本也能用。",
        "target": "理解 CLIP 把图文对齐到同一向量空间(以文搜图)。",
        "ex": {
          "q": "对齐空间有什么用？",
          "a": "可用自然语言检索/描述图像，零样本也能用，是多模态基础。"
        }
      },
      {
        "id": "agi3-2",
        "title": "工具调用与函数调用",
        "min": 10,
        "summary": [
          "让 LLM 输出「调用哪个函数+参数」，由外部执行再回传结果。",
          "模型从「只会说」变成「能动手」(查库/算数/发请求)。",
          "这是 Agent 能力的来源。"
        ],
        "code": "# LLM 返回 {tool:\"search\", args:{q:\"...\"}]}\n# 程序执行后把结果还给 LLM 继续",
        "pit": "函数 schema 要写清参数与含义，模型才调得对；返回要原样喂回。",
        "target": "理解让 LLM 输出函数调用、由外部执行的「能动手」。",
        "ex": {
          "q": "函数 schema 写不清会怎样？",
          "a": "模型可能调错函数或参数；返回结果要原样喂回，闭环才成立。"
        }
      },
      {
        "id": "agi3-3",
        "title": "Agent 规划-执行-观察",
        "min": 12,
        "summary": [
          "Agent 循环：思考(该干嘛)→行动(调工具)→观察(看结果)→再思考。",
          "比一次性回答更可靠：用真实反馈纠正下一步。",
          "复杂任务靠多步分解与工具协作完成。"
        ],
        "code": "# while not done:\n#   thought = llm(history)\n#   action = parse(tool_call)\n#   obs = run(action); history += obs",
        "pit": "没有 Observation，模型可能自信地编造工具结果——真实回传是关键。",
        "target": "理解 Agent 的「思考-行动-观察」循环。",
        "ex": {
          "q": "Agent 为什么需要 Observation？",
          "a": "用真实工具返回纠正下一步，避免模型凭空编造结果(幻觉)。"
        }
      },
      {
        "id": "agi3-4",
        "title": "记忆与反思",
        "min": 10,
        "summary": [
          "短期记忆=当前对话上下文；长期记忆=外部向量库/笔记。",
          "反思：让 Agent 总结过去、更新计划，避免重复犯错。",
          "记忆让 Agent 跨会话保持「经验」。"
        ],
        "code": "# 把重要结论写入长期记忆(向量库)\n# 新任务前先检索相关记忆",
        "pit": "上下文窗口有限，长任务要把关键信息落外部存储，而非全塞进 prompt。",
        "ex": {
          "q": "Agent 相比普通聊天机器人多了什么？",
          "a": "会调用工具获取真实信息、能多步规划、有记忆；不是一次生成完事，而是「想-做-看」循环。"
        },
        "target": "理解 Agent 的工具体系与规划-观察循环。"
      }
    ],
    "quiz": [
      {
        "q": "CLIP 的核心是？",
        "o": [
          "分类",
          "图文映射到同一向量空间",
          "检测",
          "生成"
        ],
        "a": 1,
        "why": "CLIP 把图像与文本对齐到同一空间，支持以文搜图。"
      },
      {
        "q": "Agent 区别于普通对话的关键是？",
        "o": [
          "更长",
          "能调用工具+多步规划",
          "更快",
          "更贵"
        ],
        "a": 1,
        "why": "Agent 能调工具、规划-观察循环，而非一次生成。"
      },
      {
        "q": "为什么 Agent 需要 Observation？",
        "o": [
          "好看",
          "用真实结果纠正下一步，防编造",
          "省 token",
          "排序"
        ],
        "a": 1,
        "why": "真实工具返回作为观察，避免模型凭空编造结果。"
      }
    ]
  },
  {
    "id": "agi4",
    "icon": "🌌",
    "name": "AGI 前沿与工程化落地",
    "desc": "从模型到可用系统",
    "goal": "了解 MLOps/部署、模型压缩、安全对齐伦理，以及一条可执行的个人 AGI 工程成长路线。",
    "links": [
      [
        "MLOps 概念",
        "https://www.bilibili.com/video/BV1Dg411w7o7"
      ],
      [
        "模型压缩",
        "https://www.bilibili.com/video/BV1Ku411R7i8"
      ],
      [
        "AI 安全与对齐",
        "https://www.bilibili.com/video/BV1rW4y1m7Xe"
      ]
    ],
    "lab": {
      "t": "制定你的 AGI 学习路线图",
      "mode": "text",
      "req": [
        "用文字写出你未来 1~2 年的 AGI 工程学习路线(分阶段)",
        "说明每个阶段的目标产出(如：能跑通一个训练/能做一个 RAG/能部署一个服务)",
        "列出你会持续做的 2~3 件小事(项目/笔记/刷题/读论文)",
        "不少于 200 字，真诚可行"
      ],
      "starter": "# 我的 AGI 工程路线（1~2 年）\n# 阶段1：\n# 阶段2：\n# 阶段3：\n# 持续做的 2~3 件小事：",
      "hint": "结合本课程：C++ 底层 + Python/数学 + ML/DL + 前沿，每阶段都「做出一个能跑的东西」比看懂更重要。",
      "xp": 25
    },
    "lessons": [
      {
        "id": "agi4-1",
        "title": "MLOps 与部署",
        "min": 10,
        "summary": [
          "MLOps：让模型从 notebook 走到线上服务并稳定运维。",
          "含训练流水线、版本管理、监控、回滚。",
          "能跑通一个推理 API 比只训模型更接近工程岗。"
        ],
        "code": "# 训练 → 打包 → 部署推理服务 → 监控延迟/质量",
        "pit": "线下 accuracy 高不等于线上好；延迟、成本、数据漂移都要管。",
        "target": "理解从 notebook 到线上服务的 MLOps 闭环。",
        "ex": {
          "q": "线下 accuracy 高就够了吗？",
          "a": "不够——延迟、成本、数据漂移都要管，线上表现才是真指标。"
        }
      },
      {
        "id": "agi4-2",
        "title": "压缩与推理优化",
        "min": 10,
        "summary": [
          "量化(低精度)、剪枝、蒸馏，让大模型跑在普通硬件。",
          "推理优化关注吞吐/延迟/显存。",
          "同样效果更小更快，才能落地到产品。"
        ],
        "code": "# FP16/INT8 量化、知识蒸馏小模型学大模型",
        "pit": "部署前先想清「在哪跑、多快、多贵」——这决定用不用得起。",
        "target": "理解量化/剪枝/蒸馏让大模型能落地。",
        "ex": {
          "q": "部署前先想清什么？",
          "a": "「在哪跑、多快、多贵」决定用不用得起；先定约束再选压缩方案。"
        }
      },
      {
        "id": "agi4-3",
        "title": "安全、对齐与伦理",
        "min": 10,
        "summary": [
          "关注幻觉、偏见、隐私泄露与滥用风险。",
          "对齐：让系统目标与人类真实意图一致。",
          "负责任的 AI 是工程素养的一部分。"
        ],
        "code": "# 评测需覆盖：准确性/公平性/鲁棒性/可解释",
        "pit": "「能用」和「该用」是两件事；上线前做安全与偏见评测。",
        "target": "建立负责任 AI 视角(幻觉/偏见/隐私/对齐)。",
        "ex": {
          "q": "「能用」等于「该用」吗？",
          "a": "不等于；上线前要做安全与偏见评测，对齐系统目标与人类真实意图。"
        }
      },
      {
        "id": "agi4-4",
        "title": "研究趋势与个人路线",
        "min": 12,
        "summary": [
          "趋势：更大上下文、多模态、Agent、端侧小模型、推理增强。",
          "个人路线：底层(C++/系统)+Python/数学+ML/DL+前沿，循序渐进。",
          "每阶段「做一个能跑的东西」，比只看不动强。"
        ],
        "code": "# 路线示例：\n# 底工 → Python/数学 → ML → DL → 前沿 → 项目落地",
        "pit": "别追每一个新词；把基础打牢，再选一个方向深钻并持续做项目。",
        "ex": {
          "q": "给零基础想做 AGI 工程的你一个建议？",
          "a": "先走完本课程：C++ 底层打底 + Python/数学 + ML/DL + 前沿，每阶段都「做出能跑的东西」，用项目与笔记积累作品集。"
        },
        "target": "建立 MLOps/部署/安全视角，并写下可执行的个人 AGI 路线。"
      }
    ],
    "quiz": [
      {
        "q": "MLOps 关注？",
        "o": [
          "只训练精度",
          "从训练到上线的稳定运维",
          "论文",
          "调参"
        ],
        "a": 1,
        "why": "MLOps 让模型可靠地部署与运维。"
      },
      {
        "q": "模型量化是？",
        "o": [
          "增数据",
          "低精度压缩提速",
          "加密",
          "加层"
        ],
        "a": 1,
        "why": "量化用低精度表示，减小体积、加速推理。"
      },
      {
        "q": "AGI 工程路线的基础应包含？",
        "o": [
          "只学 Prompt",
          "底层(C++/系统)+Python/数学+ML/DL+前沿",
          "只追新模型",
          "只写论文"
        ],
        "a": 1,
        "why": "循序渐进：底层+编程+数学+ML/DL+前沿，并持续做项目。"
      }
    ]
  }
];
