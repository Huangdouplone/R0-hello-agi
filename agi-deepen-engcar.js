/* ================================================================
 * R0:hello agi · 课程深化层 ⑦（eng C++ 工程化 / career 面试冲刺与就业准备）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：eng 原来只讲「有 Git、有 CMake、有 thread」，这一层补上工程化的因果与代价：
 *       构建目标与依赖形态、静态库与动态库与 ABI、锁的取舍、测试与静态分析与 CI 的三层网、
 *       先测后改的剖析纪律、跨平台差异与文档；career 原来只给了考点清单，这一层补上
 *       知识地图的组织方式、手写代码训练法、系统与场景题的四步解法、反问与复盘、
 *       职级与方向的判断依据。两章各加一节「综合重构」收口。
 * 写法约定：既有课节不写 title；新增课节写 title/target 且出现在 order 里；
 *           code 中的中文注释全部进 codeComments；英文条数与中文严格一致。
 * ================================================================ */

const DEEPEN_ENGCAR = {
  stages: ["eng", "career"],

  order: {
    eng: ["ef1", "ef2", "ef3", "ef4", "ef5", "ef6"],
    career: ["cj1", "cj2", "cj3", "cj4", "cj5", "cj6"]
  },

  lessons: {

    /* ===================== eng C++ 工程化 ===================== */
    "ef1": {
      min: 13,
      summary: [
        "Git 的三个区域要能在脑子里画出来：工作区、暂存区（index）、本地仓库。`add` 是把改动登记进暂存区，`commit` 是把暂存区打成一个快照——理解「快照 + 父指针」，才理解为什么分支便宜、为什么历史能改写。",
        "分支是一个指针而不是一次复制：`git switch -b feat/logging`（老写法 `git checkout -b`）只写下一个引用，所以随便开分支不心疼；merge 是把两条指针合流，冲突只在两边改了同一行时才出现。",
        "远程协作四招各有分工：`clone` 拿全量、`fetch` 只取不看、`pull` 等于 fetch 加 merge、`push` 交出提交。团队里把 `pull` 换成 `pull --rebase` 能得到线性历史，但绝不对已经推送出去的公共分支做 rebase——那会让别人的历史凭空消失。",
        "`.gitignore` 必须在第一次 commit 之前写好：已经被跟踪的文件要 `git rm --cached` 从索引里摘掉，光加规则不会生效。这是「为什么它还在提交 build/」的唯一答案。",
        "提交信息是写给半年后的自己和评审者的文档：约定式前缀 `feat:` / `fix:` / `refactor:` / `test:` / `docs:` 加一句话说清「为什么改」；判据是不打开 diff 也能读懂这段历史。",
        "提交粒度决定可回退性：一次提交只做一件事，不要把编译不过的中间状态提上去。出问题时你能 `git revert` 一个提交，而不是回滚三天工作。",
        "工程结构此刻就该定下来：根目录放 CMakeLists.txt 与 README，`src/` 实现、`include/` 对外头文件、`tests/` 测试、`docs/` 说明、`.github/workflows/` 流水线。目录是别人判断「这项目靠不靠谱」的第一眼信息。",
        "前置与衔接：这一章假定你手上已经有一个能跑的项目（s18）并且过了一遍算法与复杂度（dsa 那组章）；Git 管住源码的演化，ef2 管把它变成可执行文件——版本控制与构建系统是工程化的两条腿，缺一条就退回「一个 zip 包加三句口头说明」。"
      ],
      summary_en: [
        "Draw the three Git areas in your head: working tree, index, local repository. 'add' registers changes into the index, 'commit' freezes the index into a snapshot — once you see snapshots plus parent pointers, cheap branches and rewritable history stop being magic.",
        "A branch is a pointer, not a copy: 'git switch -b feat/logging' (older spelling: git checkout -b) only writes a reference, so branching costs nothing. A merge joins two pointers, and conflicts appear only when both sides touched the same line.",
        "The four remote verbs do different jobs: clone takes everything, fetch only downloads, pull is fetch plus merge, push hands your commits over. Teams that prefer 'pull --rebase' get linear history, but never rebase a public branch already pushed — that erases other people's history.",
        "Write .gitignore before the first commit: files already tracked must be untracked with 'git rm --cached', because adding a rule alone changes nothing. That is the whole answer to 'why is build/ still being committed'.",
        "A commit message is documentation for future you and for reviewers: conventional prefixes (feat:, fix:, refactor:, test:, docs:) plus one sentence about why. The test is whether the log reads without opening a single diff.",
        "Commit granularity decides how reversibly you can undo: one commit, one purpose, and never a state that does not compile. When something breaks you revert one commit instead of rolling back three days.",
        "Fix the layout now: CMakeLists.txt and README at the root, src/ for implementation, include/ for public headers, tests/, docs/, .github/workflows/. The folder tree is the first signal reviewers use to judge whether a project is serious.",
        "Bridge and prerequisite: this chapter assumes you already have a project that runs (s18) and have been through algorithms and complexity (the dsa group). Git governs how source evolves; ef2 governs how it becomes a binary — version control and the build system are the two legs of engineering, and without one you are back to a zip file plus three verbal instructions."
      ],
      code: `# 第一次建仓库：先写 ignore 再提交，顺序反了就要多清一次索引
mkdir store && cd store && git init
printf 'build/\\n*.o\\n*.obj\\n*.exe\\n' > .gitignore
git add .
git commit -m "chore: initial skeleton with cmake and tests"
# 分支只是指针，开一条几乎零成本，所以小步开、快合并
git switch -c feat/logging
# 已经在跟踪的产物：只加 ignore 规则不生效，要从索引里摘掉
git rm -r --cached build
# 看清楚形状：每个点是一个快照，不是一串差异
git log --oneline --graph --all
# 只改写最后一条说明，公共历史一律用 revert 而不是 reset
git commit --amend -m "fix: clearer message for divide-by-zero"`,
      pit: "把可执行文件、build/ 目录甚至 API key 提交进仓库：前两件让仓库膨胀到 clone 都要半小时，后一件永远删不掉（历史里还在）。第一次 commit 前把 .gitignore 写好，密钥一律走环境变量或本地配置文件。",
      pit_en: "Committing binaries, the build/ folder, or an API key: the first two balloon the repo until cloning takes half an hour, and the last one can never really be deleted because history keeps it. Write .gitignore before the first commit and keep secrets in environment variables or an untracked local config.",
      ex: {
        q: "为什么「已经推送过的分支绝对不要 rebase」？",
        a: "因为 rebase 会重写提交、换掉它们的哈希；别人本地还基于旧哈希在开发，你一强推，他们就必须处理被丢掉的历史。私有的本地分支随便整理，公共分支只能往前加提交或用 revert 撤销。",
        q_en: "Why should you never rebase a branch that has already been pushed?",
        a_en: "Because rebasing rewrites commits and changes their hashes while your teammates still build on the old ones; a force-push then throws their work away. Tidy private local branches freely, but on shared branches only add commits, or undo them with revert."
      }
    },

    "ef2": {
      min: 15,
      summary: [
        "CMake 是「构建的配置器」而不是构建器：它把 CMakeLists.txt 生成 Makefile / Ninja / VS 工程，真正调编译器的是后者。这解释了它为什么跨平台，也解释了为什么 build/ 里会冒出第二套文件。",
        "最小骨架四行就够：`cmake_minimum_required(VERSION 3.16)`、`project(store CXX)`、`set(CMAKE_CXX_STANDARD 17)`、`add_executable(store src/main.cpp)`；现代 CMake 的思维方式是「目标」，一切属性都挂在 target 上。",
        "用 `target_*` 命令而不是全局命令：`target_include_directories` / `target_compile_definitions` / `target_link_libraries`。`include_directories` 这类全局写法会污染同一目录下的所有目标，包括别人 `add_subdirectory` 引进来的库。",
        "`PUBLIC / PRIVATE / INTERFACE` 是 CMake 最容易被忽略的设计点：对外头文件的目录用 PUBLIC（使用方包含你的 .h 时才找得到路径），纯实现细节用 PRIVATE，只有头文件的库用 INTERFACE。选错方向的典型症状是「我这能编，别人包含就报错」。",
        "多目录用 `add_subdirectory` 逐级组织，不要 `file(GLOB)` 通配收源码：GLOB 看起来省事，但新增一个 .cpp 不重新配置就不会被看见，构建会神秘地漏文件，而链接期才报 undefined reference。",
        "坚持外部构建：`cmake -B build -S .` 加 `cmake --build build --config Release`。产物与源码隔离，删掉 build/ 就是彻底重来；把产物写进源码目录，「清干净重编」只能靠人工考古。",
        "依赖的形态要分清：静态库 `.a`/`.lib` 在链接期把目标码复制进可执行文件，自包含、部署少带文件，但升级要重编；动态库 `.so`/`.dll` 运行时加载，体积小、可单独替换，代价是必须保证 ABI 兼容，Windows 上还要处理符号导出。",
        "第三方依赖优先 `find_package` / FetchContent / vcpkg，别把源码硬拷进仓库；README 里写清依赖名与版本范围。「我这能跑」通常只是我这台机器的库版本刚好，写出来别人才跑得起来。衔接：ef3 开始处理并发，那是工程化里最容易自欺的一章。"
      ],
      summary_en: [
        "CMake configures builds, it does not perform them: it turns CMakeLists.txt into Makefiles, Ninja files or VS projects, and those invoke the compiler. That is why it is cross-platform and why build/ contains a second set of files.",
        "Four lines start a project: cmake_minimum_required(VERSION 3.16), project(store CXX), set(CMAKE_CXX_STANDARD 17), add_executable(store src/main.cpp). Modern CMake thinks in targets, and every property hangs off a target.",
        "Prefer target_* commands over global ones: target_include_directories, target_compile_definitions, target_link_libraries. Global forms such as include_directories leak into every target in the directory, including libraries someone pulled in with add_subdirectory.",
        "PUBLIC / PRIVATE / INTERFACE is the design point people skip: use PUBLIC for the directory holding your public headers (consumers need it too), PRIVATE for implementation detail, INTERFACE for header-only libraries. The classic symptom of getting it wrong is 'it builds here, anyone who includes my header fails'.",
        "Organise several directories with add_subdirectory, never file(GLOB): globbing looks convenient, but a newly added .cpp is invisible until CMake is re-run, so the build quietly drops a file and linking reports undefined reference.",
        "Always build out of source: cmake -B build -S . then cmake --build build --config Release. Outputs stay separate from sources and deleting build/ is a guaranteed clean slate; scattering outputs into the source tree turns 'rebuild from scratch' into archaeology.",
        "Know the shapes a dependency can take: a static library (.a/.lib) gets its object code copied into your executable at link time — self-contained, nothing extra to ship, but upgrades need a rebuild. A shared library (.so/.dll) loads at run time — smaller and independently replaceable, but only if the ABI holds, and on Windows you must export symbols explicitly.",
        "Pull third-party code via find_package, FetchContent or vcpkg rather than copying sources into your repo, and record the name and version range in the README. 'It runs on my machine' usually just means my library versions happen to match; writing them down is what makes it run elsewhere. Bridge: ef3 turns to concurrency, where engineers most often fool themselves."
      ],
      code: `# CMakeLists.txt：现代 CMake 的形状，一切围绕 target
cmake_minimum_required(VERSION 3.16)
project(store CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 业务逻辑做成静态库，可执行文件和测试都链接它
add_library(store_core src/cart.cpp src/prices.cpp)
# 对外头文件目录用 PUBLIC：使用方包含你的 .h 时才找得到路径
target_include_directories(store_core PUBLIC include)

add_executable(store src/main.cpp)
target_link_libraries(store PRIVATE store_core)

# 按构建类型开关选项：Debug 才配警告与消毒器，Release 才谈性能
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    target_compile_options(store_core PRIVATE -Wall -Wextra -fsanitize=address,undefined)
    target_link_options(store_core PRIVATE -fsanitize=address,undefined)
endif()

# 新增源码用文件名列表，不用通配：GLOB 会漏掉刚加的 .cpp
# 外部构建：配置一次，之后只重编受影响的目标
# cmake -B build -S . && cmake --build build`,
      pit: "用 `file(GLOB_RECURSE SRC src/*.cpp)` 收源码后新增一个 .cpp：本地配置一次没事，同事拉下来始终不编这个文件，链接期报 undefined reference，而 CMakeLists 看起来完全正确。CMake 的 GLOB 默认不在构建时重新扫描，这类问题只会归到「玄学」上。",
      pit_en: "Collecting sources with file(GLOB_RECURSE SRC src/*.cpp) and then adding a .cpp: your configured build is fine, but a colleague never compiles the new file and hits undefined reference at link time while CMakeLists.txt looks perfectly correct. GLOB does not rescan at build time by default, so the failure gets filed under mystery.",
      ex: {
        q: "为什么静态库换版本必须重编使用者，动态库却可以只换文件？",
        a: "因为静态库在链接期就被复制进可执行文件，换库等于换了一份编译进身体里的代码，只能重编；动态库是运行时按符号名解析的，只要导出的 ABI 不变就能替换——而「ABI 不变」正是它全部的难度所在。",
        q_en: "Why does swapping a static library force a rebuild while a shared library can be replaced file-for-file?",
        a_en: "Because a static library is copied into the executable at link time, so swapping it means swapping code already compiled in — a rebuild is the only option. A shared library resolves symbols at run time, so it can be replaced as long as the exported ABI is unchanged, and that condition is precisely where the difficulty lives."
      }
    },

    "ef3": {
      min: 15,
      summary: [
        "`std::thread` 创建即开始运行，而且它的对象在仍然 joinable 时被析构会直接 `std::terminate()` —— 忘了 `join()` 不是「线程泄漏」，是整个进程当场死掉。这是 C++ 并发第一个把人砸懵的规则。",
        "`join` 是等它结束，`detach` 是撒手不管；detach 之后那个线程绝对不许再引用栈上的变量（函数一返回它们就销毁了）。绝大多数 detach 不是设计而是遗忘，能 join 就 join。",
        "数据竞争的定义要能背下来：两个线程访问同一内存、至少一个在写、且没有同步，即未定义行为。`++counter` 是「读-改-写」三步，交错起来会丢更新，所以结果比预期小，而且每次小得不一样。",
        "mutex 保护的是不变量，不是某一行：临界区要包住完整的逻辑（读、判断、写）。锁了 `balance` 又在锁外读 `balance`，等于没锁；这是「明明加了锁还是错」的标准成因。",
        "`lock_guard` / `unique_lock` 是 RAII 锁：构造加锁、析构解锁，异常抛出时照样解。手写 `lock()` / `unlock()` 一旦中间有 return、break 或异常，就是永久死锁——这正是 s9 学的「资源即对象」在并发上的兑现。",
        "锁粒度是明确的取舍：粒度大安全但把并行串行化（核数越多越慢），粒度小并发高却可能守不住跨字段的不变量。纪律是先写对（一把大锁跑通），再按剖析数据拆细，而不是反过来。",
        "死锁里工程师真能控制的是「环路等待」：给所有加锁顺序规定一个全局次序并写进注释；一次要锁多个对象时用 `std::lock(a, b)` 加 `adopt_lock`，或 `std::scoped_lock`（C++17）一次锁完。",
        "不要用睡眠代替同步：`sleep_for(50ms)` 只会让 bug 换成「在慢机器上才出现」。另外可见性也需要同步——没有锁或 atomic，一个线程可能永远看不到另一个线程已经写过的值。衔接：ef4 把单变量的场景换成更便宜的 atomic，并学会等待-通知。"
      ],
      summary_en: [
        "A std::thread starts running as soon as it exists, and destroying one while still joinable calls std::terminate() straight away — forgetting join() is not a thread leak, it is an instant process death. This is the first C++ concurrency rule that knocks people out.",
        "join waits for the thread, detach lets it wander; a detached thread must never touch variables on the stack, because they die when the function returns. Most detaches are forgetting rather than design — join whenever you can.",
        "Memorise the definition of a data race: two threads access the same memory, at least one writes, and there is no synchronisation — undefined behaviour. ++counter is read-modify-write, so interleaving loses updates; the result comes out smaller than expected, and by a different amount each run.",
        "A mutex protects an invariant, not a line: the critical section must cover the whole step of read, decide and write. Locking balance in one place and reading it unlocked in another means you never locked at all — the standard cause of 'I did take the lock, why is it still wrong'.",
        "lock_guard and unique_lock are RAII locks: they lock on construction and unlock on destruction, exceptions included. Hand-written lock()/unlock() deadlocks permanently the moment someone adds a return, a break or a throw — resource-is-object-initialisation from s9, applied to concurrency.",
        "Lock granularity is an honest trade-off: coarse is safe but serialises parallelism (more cores, less speed), fine is concurrent but may fail to hold a multi-field invariant. The discipline is to get it right with one big lock first, then split it guided by profile data, never the reverse.",
        "Of the four deadlock conditions, the one engineers can actually control is circular wait: fix a global ordering for all lock acquisitions and write it in a comment, or take several locks at once with std::lock plus adopt_lock, or with std::scoped_lock in C++17.",
        "Do not replace synchronisation with sleeping: sleep_for(50ms) only relocates the bug to 'happens on slow machines'. Visibility needs synchronisation too — without a lock or an atomic, one thread may never observe what another already wrote. Bridge: ef4 swaps the single-variable case for a cheaper atomic and teaches wait-and-notify."
      ],
      code: `#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

long long counter = 0;
std::mutex m;

void work(int n) {
    for (int i = 0; i < n; ++i) {
        std::lock_guard<std::mutex> g(m);   // 构造加锁、析构解锁：中途 return 也不会忘记解
        ++counter;                          // 临界区里只做被保护的那一件小事
    }
}

int main() {
    std::vector<std::thread> ts;
    for (int i = 0; i < 4; ++i) ts.emplace_back(work, 100000);
    // 线程对象析构前必须 join 或 detach，否则进程直接 terminate
    for (auto& t : ts) t.join();
    std::cout << "counter = " << counter << " expect 400000\\n";
    return 0;
}`,
      pit: "把 `lock_guard` 换成手写 `m.lock(); ... m.unlock();`，中间某个新增的 `return` 或抛出的异常跳过了 unlock：程序在第一轮看起来完全正常，第二轮卡死在同一个锁上。「偶发卡住」的并发 bug，一半来自没有 RAII 的锁。",
      pit_en: "Replacing lock_guard with hand-written m.lock(); ... m.unlock(); and later adding a return or throwing an exception past the unlock: the first round looks perfectly fine and the second round hangs on that same lock. Half of all 'occasionally it freezes' bugs come from locks without RAII.",
      ex: {
        q: "为什么把循环里的锁提到循环外面通常更快，但有时反而错得更多？",
        a: "更快是因为省掉了成千上万次的加锁解锁与线程切换；错得多是因为临界区变长之后，锁保护的不再是「一个操作」而是「一整段逻辑」，中间如果调用了别的函数，很容易和另一处的加锁顺序互相咬成死锁。",
        q_en: "Why does hoisting the lock out of the loop usually get faster, yet sometimes go more wrong?",
        a_en: "Faster, because it removes thousands of lock/unlock pairs and the context switches behind them. More often wrong, because the critical section now guards a whole stretch of logic instead of one operation: if it calls into another function that also takes a lock, the two orders can interlock into a deadlock."
      }
    },

    "ef4": {
      min: 13,
      summary: [
        "`std::atomic<int>` 把「读-改-写」交给硬件保证不可分割（x86 上 `fetch_add` 常是一条带 lock 前缀的指令），没有排队等待也没有上下文切换；计数器、停止标志、状态位这类单变量场景，就该用它而不是 mutex。",
        "默认内存序是 seq_cst，最强也最好懂；acquire / release / relaxed 是给无锁结构调优用的。业务代码里先别碰——省下的是纳秒，付出的是极难复现的 bug。",
        "atomic 只保证单个变量：「先看余额再扣款」是两次访问，两个线程能同时通过判断，于是扣成负数。跨字段的不变量必须回到 mutex，或者把相关字段打包成同一份被保护的状态。",
        "不是所有 atomic 都真的无锁：`is_lock_free()` 能问出来。较大的类型（含指针的结构体、64 位平台上的 128 位）可能退化成内部一把锁，这时它只是安全，不是快。",
        "等待-通知模型是并发编程的第二个底座：条件变量必须配 `unique_lock<std::mutex>` 使用。生产者改完状态 `notify_one()`，消费者 `cv.wait(lk, pred)` 挂起，醒来时锁已自动重新持有。",
        "wait 一定要写谓词，否则会被「丢通知」和「虚假唤醒」两头打：不带谓词的 wait 可能在通知之后还没判断就醒，也可能在根本没通知时醒。这是「偶发死等」的头号来源，也是面试最爱追的一点。",
        "notify 与解锁的先后有性能差别：在持锁状态下 notify，被唤醒的线程会立刻回来和唤醒者抢同一把锁。知道这个细节即可，永远不要为了它牺牲正确性。",
        "线程池 = 任务队列 + 条件变量 + 固定数目的 worker，它是工程并发的标准件：Web 服务、渲染、训练数据加载都是这个形状。衔接：ef5 要回答一个更硬的问题——这些并发代码怎么测。"
      ],
      summary_en: [
        "std::atomic<int> hands read-modify-write to the hardware, where it is indivisible (on x86 fetch_add is typically one lock-prefixed instruction): no queueing, no context switch. For counters, stop flags and status bits, reach for this instead of a mutex.",
        "The default memory order is seq_cst — strongest and easiest to reason about. acquire / release / relaxed exist to tune lock-free structures; keep off them in business code, where you save nanoseconds and pay in unreproducible bugs.",
        "An atomic only covers one variable: 'check the balance, then debit' is two accesses, so two threads can both pass the check and drive it negative. Multi-field invariants still need a mutex, or must be folded into one protected state.",
        "Not every atomic is actually lock-free — ask is_lock_free(). Larger types (structs containing pointers, 128-bit values on a 64-bit platform) may degrade to a hidden internal lock, which makes them safe but not fast.",
        "Wait-and-notify is the second foundation of concurrent programming: a condition variable is used with a unique_lock<std::mutex>. The producer mutates state and calls notify_one(); the consumer parks in cv.wait(lk, pred) and wakes with the lock automatically re-held.",
        "Always pass a predicate to wait, or you get hit from both sides: a lost notification and a spurious wakeup. A wait without a predicate can return before you checked, or return when nobody notified. That is the leading cause of 'occasionally it just hangs' and the favourite follow-up question in interviews.",
        "The order of notify versus unlock has a measurable cost: notifying while still holding the lock makes the woken thread immediately contend with the notifier. Know the detail, but never trade correctness for it.",
        "A thread pool is a task queue plus a condition variable plus a fixed set of workers — the standard part of engineering concurrency: web servers, renderers and training data loaders all have that shape. Bridge: ef5 answers the harder question of how to test any of this."
      ],
      code: `#include <atomic>
#include <condition_variable>
#include <iostream>
#include <mutex>
#include <queue>
#include <thread>

std::queue<int> jobs;
std::mutex m;
std::condition_variable cv;
std::atomic<bool> stop{false};      // 单变量的停止标志：atomic 比锁便宜

int main() {
    std::thread consumer([]{
        for (;;) {
            int job = 0;
            std::unique_lock<std::mutex> lk(m);
            // 带谓词的 wait：虚假唤醒和「通知早于等待」都被它挡住
            cv.wait(lk, []{ return !jobs.empty() || stop.load(); });
            if (jobs.empty() && stop.load()) break;
            job = jobs.front(); jobs.pop();
            lk.unlock();            // 干活之前先放锁，别让临界区盖住耗时操作
            std::cout << "got " << job << "\\n";
        }
    });
    for (int i = 0; i < 5; ++i) {
        { std::lock_guard<std::mutex> lk(m); jobs.push(i); }
        cv.notify_one();
    }
    stop.store(true);
    cv.notify_all();
    consumer.join();
    return 0;
}`,
      pit: "把 `cv.wait(lk)` 写成不带谓词的版本：偶尔一切正常，偶尔消费者永远醒不来。真实原因是通知可能发生在它进入 wait 之前（丢通知），也可能在假唤醒时队列仍然为空。要么写谓词，要么用 `wait_and` 的等价循环 `while (pred == false) cv.wait(lk);`。",
      pit_en: "Writing cv.wait(lk) without a predicate: sometimes everything works, sometimes the consumer never wakes again. The real causes are a notification that arrived before it entered wait (lost wake-up) and a spurious wakeup while the queue is still empty. Either pass a predicate or hand-roll the equivalent loop while (!pred) cv.wait(lk);.",
      ex: {
        q: "什么情况下该用 atomic 而不是 mutex，判断标准是什么？",
        a: "标准是「这段状态能不能被压缩成单个变量的原子操作」：计数、标志、单次发布只读指针都行；只要出现「先看再改」或跨字段一致（余额与流水），就必须升级成锁，因为 atomic 保证的只是那一次访问。",
        q_en: "When should an atomic replace a mutex, and by what criterion?",
        a_en: "The criterion is whether the state collapses into one atomic operation on a single variable: counters, flags, publish-once read-only pointers qualify. The moment you see check-then-act or a multi-field invariant such as balance plus ledger, you must escalate to a lock, because an atomic only guarantees that one access."
      }
    },

    "ef5": {
      min: 13,
      summary: [
        "单元测试的最小形态就是一句断言：`assert(sum_of({}) == 0);`。别先挑框架，先养成「写完函数顺手写三条 check」的习惯——框架给的是组织与报告，习惯给的是正确性。",
        "任何函数都值得测三种输入：空或极小、正常、非法或边界。绝大多数缺陷住在边界上（空容器、单元素、最大长度、负数、0），这也是 pit 里那句「只测正常路径不够」的由来。",
        "`assert` 有两个必须知道的坑：定义 NDEBUG 时整条被编译掉，写在里面的副作用跟着消失（同一份代码 Debug 正常、Release 行为变了）；而且第一个失败就 abort，后面所有用例都看不到结果。",
        "工程框架（GoogleTest / Catch2）提供的是组织能力：用例有名字、失败不中断其余、能参数化、能只跑某几个。自己写一个 CHECK 宏也完全能起步——记录失败数、结尾返回非 0 退出码，CI 就能用。",
        "测试要当回归网用：把 sanitizer 挂上再跑一遍（`-fsanitize=address,undefined`），越界与释放后使用在测试阶段当场暴露，比线上崩了再捞 core dump 便宜一百倍。这是 eng 章与 sdbg 章真正接上的地方。",
        "静态分析是另一层网：clang-tidy 查常见误用与可读性（配 `.clang-tidy` 选规则集），cppcheck 不依赖完整编译，编译器自己的 `-Wall -Wextra -Wshadow -Wconversion` 是免费的第一道。它看模式不看行为，所以永远代替不了测试。",
        "并发代码要特别对待：把迭代量调大、跑很多次、加 `-fsanitize=thread`。一次绿不代表没有数据竞争——竞争窗口可能只有几十纳秒，「跑过了」是运气不是证据。",
        "覆盖率是诊断工具而不是目标：它回答「哪些分支从来没被执行过」，而 100% 覆盖也可能一条断言都没写。先补关键路径与边界，再谈那个百分比。衔接：ef6 把这些拼成一条自动把关的流水线。"
      ],
      summary_en: [
        "The smallest possible unit test is one assertion: assert(sum_of({}) == 0). Do not start by picking a framework; start by writing three checks right after the function. Frameworks bring organisation and reporting; the habit brings correctness.",
        "Every function deserves three input classes: empty or tiny, normal, illegal or boundary. Most defects live on boundaries (empty container, single element, maximum length, negatives, zero), which is exactly what 'testing only the happy path is not enough' means.",
        "assert has two traps you must know: with NDEBUG defined the whole statement is compiled away, so side effects written inside it vanish and the same code behaves differently between debug and release; and the first failure aborts, so no later case ever reports.",
        "What GoogleTest or Catch2 really sell is organisation: named cases, failures that do not stop the rest, parameterised cases, selective runs. A hand-rolled CHECK macro is a perfectly good start — count failures and return a non-zero exit code, and CI can use it.",
        "Use tests as a regression net: run the suite once more with sanitizers on (-fsanitize=address,undefined) so out-of-bounds and use-after-free surface during testing rather than on a customer machine. This is where eng and sdbg actually join up.",
        "Static analysis is a second net: clang-tidy catches common misuse and readability issues (pick a rule set in .clang-tidy), cppcheck needs no full build, and the compiler's own -Wall -Wextra -Wshadow -Wconversion is a free first pass. They read patterns, not behaviour, so they never replace tests.",
        "Treat concurrent code specially: crank the iteration count, run it many times, add -fsanitize=thread. One green run proves nothing about data races — the window can be a few dozen nanoseconds, so 'it passed' is luck, not evidence.",
        "Coverage is a diagnostic, not a target: it answers 'which branches were never executed', and 100 percent coverage is still possible with zero assertions written. Cover the critical path and the boundaries first, then talk about the number. Bridge: ef6 wires all of this into a pipeline that polices itself."
      ],
      code: `#include <cassert>
#include <iostream>
#include <vector>

// 二十行的最小测试框架：有名字、能汇总、用退出码把结果交给脚本
struct Suite {
    int total = 0, failed = 0;
    void check(bool ok, const char* name) {
        ++total;
        if (!ok) { ++failed; std::cerr << "FAIL " << name << "\\n"; }
    }
    int report() const {
        std::cout << total - failed << "/" << total << " passed\\n";
        return failed ? 1 : 0;              // 非 0 退出码：CI 判定失败的唯一依据
    }
};

int safe_div(int a, int b, bool& ok) {
    if (b == 0) { ok = false; return 0; }
    ok = true;
    return a / b;
}

int main() {
    Suite s;
    bool ok = false;
    s.check(safe_div(6, 3, ok) == 2 && ok, "6 divided by 3");
    s.check(!safe_div(1, 0, ok), "divide by zero must fail");
    s.check(safe_div(-7, 2, ok) == -3, "truncates toward zero");
    return s.report();
}`,
      pit: "把带副作用的调用写进 `assert`：`assert(push_item(v, x) == true);`。Debug 下元素被推入、Release 下整句被编译掉，于是「只在发布版出现的空容器崩溃」出现了，而且看起来跟 assert 毫无关系。断言里只放无副作用的判断。",
      pit_en: "Putting a call with side effects inside assert: assert(push_item(v, x) == true). In debug the item is pushed; with NDEBUG the whole statement disappears, and you get the crash-on-release-only empty container that seems to have nothing to do with asserts. Keep only side-effect-free predicates inside assertions.",
      ex: {
        q: "为什么 sanitizer 构建和常规测试构建要分开跑，而不是直接用带 ASan 的版本做性能测试？",
        a: "因为 ASan 会在每次内存访问前后插桩并维护影子内存，通常慢两到五倍且额外占用大量地址空间，用它测出来的耗时完全不代表真实性能；正确做法是一轮跑功能与内存正确性（带 sanitizer），另一轮跑性能（Release，不带任何 sanitizer）。",
        q_en: "Why run the sanitizer build and the normal test build separately, instead of benchmarking the ASan binary?",
        a_en: "Because ASan instruments every access and keeps shadow memory, typically costing two to five times the speed plus a huge address space, so timings from it mean nothing about real performance. Run one pass for behaviour and memory correctness with sanitizers on, and a different pass for performance on a plain release build."
      }
    },

    "ef6": {
      title: "综合重构：让工程自己把关",
      title_en: "Synthesis: A Project That Polices Itself",
      min: 14,
      target: "能给项目配上「配置 + 编译 + 警告清零 + 测试 + sanitizer」的自动流水线，并用评审清单与剖析数据把改动做小做稳。",
      target_en: "Wire a project into an automatic pipeline of configure, build, zero-warning compile, test and sanitizer run, and keep changes small and safe using a review checklist and profile data.",
      summary: [
        "工程结构的唯一判据是「别人能不能十秒内找到入口和测试」：根目录 CMakeLists.txt 与 README，`src/` 实现、`include/` 对外头文件、`tests/` 测试、`docs/` 说明、`.github/workflows/` 流水线；结构本身就是给陌生人的第一份文档。",
        "CI 的第一条流水线只做四件事：配置、编译（`-Wall -Wextra` 并把警告当错误）、跑单测、再跑一遍 sanitizer。它的价值不是替人写代码，而是让「坏是在哪个提交引入的」有唯一答案。",
        "流水线上再加两件便宜的自动检查：`clang-format --dry-run -Werror`（排版永远不进评审）和 clang-tidy（常见误用）。评审者的眼睛要留给逻辑，不该消耗在花括号和缩进上。",
        "代码评审看四件事：正确性、边界与错误处理、可读性与命名、有没有配测试。评论针对代码不针对人，「这里如果传空会怎样」比「你这样写不对」更容易被接受，也少几个来回。",
        "提交前先自己评审自己：`git diff --stat` 看改动面积，逐文件读一遍，删掉调试打印和被注释掉的旧代码，确认没夹带 build/ 与密钥。自己抓到的问题，成本是别人抓到的十分之一。",
        "性能铁律是先测后改：没有任何剖析数据时，「我觉得这里慢」和猜无异。固定节奏是 Release 构建 + 关掉无关噪声 → 用 perf / callgrind / VTune 采样 → 只看前几名热点 → 只改一处 → 用同一负载再测。",
        "依赖与 ABI 是发布期的坑：只要虚函数表布局、成员顺序、标准库的 ABI 标签或编译器版本变了，换 .so 而不重编使用者就可能崩。实践是同一工具链同一配置构建整套产物，并把不兼容改动升主版本号（详见 s18 的 18-6）。",
        "文档与可维护性是交付物而不是礼貌：README 回答「是什么 / 怎么编 / 怎么测 / 常见报错怎么办」，注释只解释为什么，函数签名当文档用。跨平台差异要显式处理——路径用 `std::filesystem` 而不是手拼字符串、注意换行与文件系统大小写敏感、MSVC 与 g++ 的选项名不同要用条件判断。收口自查：新人 clone 后十分钟内能跑起来吗？会做评审与剖析吗？下一站 career 教你把这些经历讲成能扛住追问的答案。"
      ],
      summary_en: [
        "The only criterion for project layout is whether a stranger finds the entry point and the tests in ten seconds: CMakeLists.txt and README at the root, src/ for implementation, include/ for public headers, tests/, docs/, .github/workflows/. The tree itself is the first document a newcomer reads.",
        "A first CI pipeline does exactly four things: configure, build with -Wall -Wextra and warnings-as-errors, run the unit tests, then run once more under a sanitizer. Its value is not writing code for you — it is giving 'which commit broke it' a single answer.",
        "Add two cheap checks to the pipeline: clang-format --dry-run -Werror, so formatting never reaches review, and clang-tidy for common misuse. Save reviewer eyes for logic instead of braces and indentation.",
        "Code review looks at four things: correctness, boundaries and error handling, readability and naming, and whether a test came along. Comment on the code, not the person; 'what happens here if the pointer is null' lands better than 'this is wrong' and costs fewer round trips.",
        "Review yourself before anyone else does: git diff --stat to see the blast radius, read each file, delete debug prints and commented-out corpses, confirm no build/ artefacts or secrets slipped in. A problem you catch yourself costs a tenth of one a reviewer catches.",
        "The iron law of performance is measure before you touch anything: without profile data, 'I think this part is slow' is a guess. Fixed rhythm: release build with noise off, sample with perf, callgrind or VTune, look only at the top hot spots, change one thing, re-measure under the identical workload.",
        "Dependencies and ABI are the release-time trap: change the vtable layout, member order, the standard library's ABI tag or the compiler version, and swapping the .so without rebuilding users can crash. In practice, build everything with one toolchain and one configuration, and bump the major version on breaking changes (see 18-6 in s18).",
        "Documentation and maintainability are deliverables, not manners: the README answers what it is, how to build, how to test and what to do about the common error; comments explain only the why; a signature serves as documentation. Handle platform differences explicitly — std::filesystem instead of hand-joined paths, watch line endings and case-sensitive filesystems, and branch on MSVC versus g++ flag names. Closing self-check: can a newcomer clone and run within ten minutes? Do review and profiling happen? Next stop, career, turns all of this into answers that survive follow-up questions."
      ],
      code: `# .github/workflows/ci.yml：一条最小的 C++ 流水线，四步就够
name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cmake -B build -DCMAKE_BUILD_TYPE=Debug
      - run: cmake --build build -j 3
      # 警告清零与测试：把 -Wall -Wextra -Werror 写进 CMake，坏提交当场被拦
      - run: ctest --test-dir build --output-on-failure
      # 第二轮换成消毒器构建：内存问题在测试阶段暴露，而不是在客户机上
      - run: cmake -B build-san -DCMAKE_CXX_FLAGS="-fsanitize=address,undefined" && cmake --build build-san && ctest --test-dir build-san`,
      pit: "把 CI 配好之后自己照样直接推未测的改动：流水线红了一晚上，第二天的第一件工作是看红叉而不是写代码。工程化真正的收益来自「没人能绕过检查」，一旦作者本人例外，整套机制就会在两周内退化成装饰。",
      pit_en: "Setting up CI and then still pushing untested changes yourself: the pipeline stays red overnight and the next morning is spent reading failures instead of writing code. Engineering pays off only because nobody can skip the checks; the moment the author is exempt, the whole mechanism decays into decoration within two weeks.",
      ex: {
        q: "为什么「先测后改」在 C++ 里比在有些语言里更常被违反？",
        a: "因为 C++ 的性能问题分散在编译期、链接期、分配器、缓存布局和指令选择多个层次，直觉最常猜错层次；没有剖析器给出的热点，任何改动都只是在四个层次里随机挑一个试，而随机试的结果通常也无法复现。",
        q_en: "Why is 'measure before you change' broken more often in C++ than in some other languages?",
        a_en: "Because C++ performance problems spread over compile time, link time, the allocator, cache layout and instruction selection, so intuition usually picks the wrong layer. Without a profiler naming the hot spot, any edit is a random pick among those layers, and the result typically does not even reproduce."
      }
    },

    /* ===================== career 面试冲刺与就业准备 ===================== */
    "cj1": {
      min: 15,
      summary: [
        "把这节当知识地图而不是题库（前置就是上一章 eng：评审、测试、剖析都从那里来）：四条主干——语言核心（对象模型、内存、生命周期）、标准库（容器与算法的底层结构）、并发（内存模型与锁）、工程（构建、调试、测试）。主干能自己长出答案，叶子才需要背。",
        "对象模型是 C++ 面试的地下层：非虚成员函数不占对象大小、有虚函数就多一个 vptr、虚表在只读段且同类对象共享、多重继承会有多个 vptr、在构造或析构函数里调虚函数不会向下分派。会画这张图，`sizeof` 类题目就从猜变成推。",
        "内存要能一层层往下讲：栈、堆、全局/静态、常量与代码四区只是入口，真正区分人的是「new 到底做了三件事」（分配 + 默认构造 + 返回指针）、delete 与 free 的匹配规则、vector 扩容时旧内存何时失效、以及为什么「大量小对象 new」会被分配器拖慢。",
        "虚函数一题至少准备三层：机制（vptr 加表槽）、代价（一次间接跳转、难以内联，通常不是瓶颈但要能说）、设计含义（为什么有虚析构必须写 virtual、为什么构造函数不能是虚的、override 和 final 各解决什么错误）。",
        "值类别不要背定义，用三个问题判断：有没有名字、能不能取地址、离开这一行还在吗。移动语义的收益只在对象持有资源（堆内存、文件句柄）时才存在——移动一个 int 只会更慢，这类「反例」比正例更让面试官记住你。",
        "智能指针要能手写一遍：unique_ptr（禁拷贝、转移所有权、可换删除器、大小与裸指针相同所以零开销）、shared_ptr（控制块存强/弱计数与删除器，计数是原子的，循环引用用 weak_ptr 破）。被问「shared_ptr 线程安全吗」，正确答案是「计数原子，指向的对象不是」。",
        "STL 底层四件套讲清了，迭代器失效表就是推论而不是背诵：vector 按容量倍增并在新内存重建（全部迭代器失效）、deque 分段（两端插入只影响两端）、map/set 是红黑树（O(log n)，节点稳定所以迭代器不失效）、unordered_map 是哈希桶（平均 O(1)，rehash 时全部失效，冲突严重时退化 O(n)）。",
        "并发考点集中在三处：数据竞争为什么是未定义行为、mutex 与 lock_guard 以及死锁四条件、atomic 与内存序大致是什么。再往下一定被追问「你项目里哪段代码真的用过」——所以 eng 章那五节练的正是这一问的答案。"
      ],
      summary_en: [
        "Treat this lesson as a map, not a question bank (its prerequisite is the previous chapter, eng, where review, tests and profiling come from). Four trunks: language core (object model, memory, lifetimes), standard library (the structures under containers and algorithms), concurrency (memory model and locks), engineering (build, debug, test). Trunks let you grow answers; only the leaves are worth memorising.",
        "The object model is the basement of C++ interviews: non-virtual members cost no bytes, virtuals add one vptr, the vtable is shared per type in read-only memory, multiple inheritance means several vptrs, and calling a virtual from a constructor or destructor never dispatches downward. Draw it once and sizeof questions become deduction instead of guessing.",
        "Talk about memory in layers: stack, heap, global/static, constants and code are the entry level; what separates candidates is that new does three things (allocate, construct, return a pointer), how delete pairs with free, when vector reallocation invalidates the old memory, and why thousands of small new calls get slowed by the allocator.",
        "Prepare three layers for the virtual-function question: mechanism (vptr plus a table slot), cost (one extra indirection, harder to inline, rarely the bottleneck but say so), and design consequences (why a polymorphic base needs a virtual destructor, why constructors cannot be virtual, what override and final each prevent).",
        "Do not memorise value categories; ask three questions: does it have a name, can you take its address, is it still there on the next line. Moving only pays when the object owns a resource such as heap memory or a file handle — moving an int is slower, and offering that counter-example is what makes interviewers remember you.",
        "Implement the smart pointers once by hand: unique_ptr (non-copyable, transfers ownership, custom deletable, same size as a raw pointer hence zero overhead) and shared_ptr (a control block holding atomic strong and weak counts plus a deleter, enable_shared_from_this, cycles broken with weak_ptr). Asked whether shared_ptr is thread-safe, the right answer is 'the refcount is atomic; the pointee is not'.",
        "Once the four STL internals land, iterator invalidation becomes a corollary rather than a table to memorise: vector doubles capacity and rebuilds in new memory (all iterators die), deque is chunked (insertion at one end affects that end), map/set is a red-black tree (O(log n), stable nodes so iterators survive), unordered_map is hashed buckets (average O(1), rehash kills every iterator, and heavy collisions degrade it to O(n)).",
        "Concurrency questions cluster in three spots: why a data race is undefined behaviour, mutex / lock_guard and the four deadlock conditions, and roughly what atomics and memory orders are. Below that you will always be asked 'where did you actually use this' — which is exactly what the five eng lessons prepare you to answer."
      ],
      code: `#include <iostream>
#include <memory>
#include <vector>

struct Empty {};                          // 空类也要占一字节，否则两个对象地址相同
struct Base { int a; virtual void f() {} };
struct Derived : Base { int b; void f() override {} };

int main() {
    std::cout << sizeof(Empty) << "\\n";    // 1
    std::cout << sizeof(Base) << "\\n";     // 四字节成员加对齐，多一个 vptr，通常是 16
    std::cout << sizeof(Derived) << "\\n";  // 再塞一个 int，仍按八字节对齐到 24
    // 被追问时，能讲出「为什么是这个数」比记住数字值钱得多
    auto sp = std::make_shared<int>(7);    // 控制块：强计数、弱计数、删除器，都是额外开销
    std::vector<int> v{1, 2, 3};
    v.reserve(100);                        // 先预留：这就是「扩容使迭代器失效」的防御写法
    std::cout << sp.use_count() << v.capacity() << "\\n";
    return 0;
}`,
      pit: "只背结论不准备例子：能脱口说出「vector 扩容会让迭代器失效」，但被问「你在哪次改动里真的因此踩过坑、怎么定位的」就卡住。C++ 面试的可信度来自一个具体故事——一次崩溃、一次越界、一次评审意见——所以 sdbg 与 eng 的练习记录要当素材攒着。",
      pit_en: "Memorising conclusions with no stories: you can recite that vector reallocation invalidates iterators, but freeze at 'where did that actually bite you and how did you find it'. Credibility in a C++ interview comes from one concrete story — a crash, an overflow, a review comment — so keep the sdbg and eng exercises as raw material.",
      ex: {
        q: "为什么「构造函数不能是虚函数」，而析构函数却常常必须是虚的？",
        a: "因为构造时对象的动态类型已经由你 new 的那个类名确定，而虚分派要读 vptr，此刻 vptr 还没指向那张表、成员也尚未初始化，分派没有意义也不安全；析构相反——基类指针指向派生对象时，只有虚析构才能让派生类的析构真正执行，否则资源泄漏且是未定义行为。",
        q_en: "Why can a constructor not be virtual while a destructor often must be?",
        a_en: "At construction the dynamic type is already fixed by the class name you wrote after new, and virtual dispatch reads the vptr, which does not yet point at the right table while members are still uninitialised — so it would be meaningless and unsafe. Destruction is the opposite case: through a base pointer to a derived object, only a virtual destructor actually runs the derived one; without it you leak and enter undefined behaviour."
      }
    },

    "cj2": {
      min: 13,
      summary: [
        "简历的唯一目标是换来一次面试，不是把自己说完：一页纸、倒序、每条一行。判据是别人扫十秒能不能挑出两个他想问的点——挑不出来，写得再全也是零。",
        "结构固定四段：教育背景 → 技能（诚实分级）→ 项目 → 其他（获奖、开源、博客）。分级要保守：写「熟悉」就会被按熟悉的标准追问，写「精通」就要准备现场手撕实现；多数应届生的正确措辞是「熟练」和「了解」。",
        "项目描述用 STAR，但结果必须给数字：不是「优化了查询」，而是「20 万条记录的统计从 4.2 秒降到 0.6 秒，做法是把 O(n²) 的嵌套扫描换成哈希计数」——量化的结果会自然把追问引向你准备最深的那个技术点。",
        "A（行动）要写决策而不是动作：写「为了在离线环境演示，把配置改成随包 JSON 并加了校验，读不到配置时退回安全默认值」，而不是「负责配置文件」。前者体现判断力，后者任何人都会写。",
        "GitHub 门面三件：README（是什么 / 怎么编 / 怎么跑 / 一张运行截图或一段真实输出）、一条能一键构建的命令（CMake 那四行）、干净且语义清楚的提交历史。别人 clone 之后跑不起来，前面写的话全部作废。",
        "两个深项目胜过五个浅项目：一个能扛住三层追问（做了什么 → 为什么这样设计 → 重来会怎么改）的项目，价值远超五个教程复刻。s18 的项目就是现成素材，把它讲成「需求拆解 → 分层 → 多文件 → 测试 → 交付」的完整过程。",
        "每条经历都要预演三层追问，并把答案写成三行笔记；答不出来的那一层就是简历上最危险的一行——要么先补功课，要么直接删掉。简历的作用是引导对方问你准备好的问题。",
        "没有实习也有的写：课程项目、自己造的轮子（迷你 STL、线程池、小解释器）、给开源提的一个小 PR。重点永远是「能讲清取舍」，不是「规模有多大」。衔接：cj3 练的是另一种手感——手写代码。"
      ],
      summary_en: [
        "A CV has one goal: earn an interview, not describe your whole life. One page, reverse chronological, one line per item. The test is whether someone skimming for ten seconds can pick two things they want to ask; if not, completeness is worthless.",
        "Use the fixed four blocks: education, skills (with honest levels), projects, extras (awards, open source, blog). Grade conservatively: 'familiar' invites follow-ups at familiar level, 'expert' invites a live implementation; for most graduates the honest words are 'proficient' and 'aware of'.",
        "Write project bullets in STAR, but attach a number to the result: not 'optimised queries' but 'cut statistics over 200k records from 4.2s to 0.6s by replacing an O(n squared) nested scan with hash counting'. A quantified result steers the follow-up onto the ground you prepared best.",
        "In the Action part, record decisions rather than activities: 'to demo offline I moved configuration into a bundled JSON with validation and a safe default fallback' beats 'responsible for the config file'. The first shows judgement; anyone can write the second.",
        "A GitHub storefront needs three things: a README (what it is, how to build, how to run, one screenshot or a real output block), a single command that builds it (those four CMake lines), and a clean, meaningful commit history. If nobody can clone and run it, everything you wrote becomes decoration.",
        "Two deep projects beat five shallow ones: one project that survives three layers of follow-up (what you did, why designed that way, what you would change today) is worth more than five tutorial clones. The s18 projects are ready material — present them as requirement breakdown, layering, multi-file split, tests, delivery.",
        "Rehearse the three-layer interrogation for every bullet and write the answers as three-line notes; whichever layer you cannot answer is the most dangerous line on the page — either study it first or delete it. A CV exists to steer the interviewer toward questions you have prepared.",
        "No internship still leaves plenty: course projects, wheels you built yourself (a mini STL, a thread pool, a small interpreter), one tiny open-source pull request. What counts is explaining the trade-off, not the line count. Bridge: cj3 trains a different muscle — writing code by hand."
      ],
      code: `# 简历项目条目的写法：每一条都要能被追问三层
# 反面写法：只说负责什么，没有数字，也没有决策
before: owned the student-score module, used C++ and STL, improved efficiency
# 下面三条改写分别指向：性能取舍、设计决策、工程习惯
after:  cut statistics over 200k records from 4.2s to 0.6s by replacing a nested scan with hash counting
after:  moved configuration into a bundled JSON with validation plus a safe default, so demos run offline
after:  split the project into CMake targets, added 24 assertions and a sanitizer build guarded by the pipeline
# 面试官会挑哪一条追问，你决定不了；但三条都必须是你能讲四十分钟的那件事`,
      pit: "把「精通 C++、熟悉 Linux、了解 MySQL」原样交出去：精通会被要求现场实现 shared_ptr，熟悉会被问 epoll 的水平触发与边缘触发，了解也会被追问一句。简历上每个形容词都是一张欠条，写之前先确认自己还得清。",
      pit_en: "Handing in 'expert in C++, familiar with Linux, aware of MySQL': expert earns a request to implement shared_ptr on the spot, familiar earns edge versus level triggered epoll, and even aware earns one follow-up. Every adjective on a CV is an IOU — be sure you can pay it before you write it.",
      ex: {
        q: "为什么「量化结果」比「用了什么技术」更能带来面试机会？",
        a: "因为技术名词人人都会罗列，不构成信息；一个带前后对比的数字同时证明了你能定位问题、能改、并且改完还能量一遍——这三件事正是初级工程师最缺、也最难在面试十分钟内伪装的素质。",
        q_en: "Why do quantified results open more doors than lists of technologies?",
        a_en: "Because technology names are free to type and carry no information, while one before-and-after number proves you located a problem, fixed it and measured it afterwards — three things juniors most often lack and least easily fake in ten minutes."
      }
    },

    "cj3": {
      min: 13,
      summary: [
        "平台的价值不一样，用途要分开：算法题站练「套路与手速」，公司真题看「你面的那家常考什么」，八股整理只适合查漏补缺，不能当第一手来源——它常常是错的或过时的。",
        "路线按专题推进：链表 → 栈与队列 → 哈希 → 双指针 → 树 → 图 → 动态规划，每个专题 15~30 题。跨专题乱刷一百题，不如一个专题精做二十题，因为面试考的是「识别题型」而不是「回忆题目」。",
        "每题的闭环是：独立想二十分钟 → 看题解 → 合上重写 → 第 3 天重做 → 第 7 天再做一次。「看懂」和「隔一周还写得出」之间隔着三遍，缺哪一遍都会在你紧张的时候还给你。",
        "归纳套路卡：一类题一页纸，写下判定条件、边界处理、常见坑、两三个代表题。面试前一晚你只会翻这十页，不会去重刷三百道题。",
        "C++ 岗的手写要求比脚本语言岗更硬：容器 API 要能默写——`std::sort` 的比较器写法、`unordered_map` 计数、`priority_queue` 建小顶堆的三个参数、`std::pair` 与结构体入容器、二分的区间不变式。语言细节（引用传参、const、迭代器失效）会在你手上被当场验证。",
        "训练要模拟真实压力：限时二十五分钟、关掉自动补全、先在纸上或白板上讲清思路再动手、写完自己造三组用例走一遍。「把思路讲清楚」通常比编译通过更影响评分，因为面试官全程只能听你讲。",
        "手写时把边界处理出声说出来（空输入、单元素、重复元素、越界），这是让面试官听到你工程直觉的最便宜方式——这一句比多写十行代码有效。",
        "错题本记「当时为什么没想到」而不是「标准答案是什么」。被同一类题绊倒两次，缺的是那个数据结构而不是那道题；回去补结构，比再刷十道同类型题划算。衔接：cj4 决定你把省下的时间投给哪个方向。"
      ],
      summary_en: [
        "Platforms serve different purposes, so split them: problem sites train pattern recognition and typing speed, company archives show what your target firm actually asks, and collected interview trivia is only for filling gaps — it is frequently wrong or outdated, so never treat it as a primary source.",
        "Advance by topic: linked lists, stacks and queues, hashing, two pointers, trees, graphs, dynamic programming, with 15-30 problems each. Twenty solved deeply in one topic beats a hundred scattered across seven, because interviews test pattern recognition, not recall.",
        "Close the loop on every problem: think alone for twenty minutes, read the editorial, rewrite it from blank, redo it on day three and again on day seven. Between 'I understood' and 'I can still write it a week later' sit three passes, and every skipped pass returns when you are nervous.",
        "Keep pattern cards: one page per family with the recognition cue, the boundary handling, the classic trap and two or three representative problems. The night before an interview you will read those ten pages, not re-solve three hundred problems.",
        "Hand-written code is a harder bar for C++ roles than for scripting roles: you must be able to type the container API from memory — a std::sort comparator, counting with unordered_map, the three arguments of a min-heap priority_queue, pairs and structs in containers, the interval invariant of binary search. Details such as passing by reference, const and iterator invalidation get verified on your hands in real time.",
        "Train under real pressure: twenty-five minutes on the clock, autocomplete off, explain the approach on paper or a whiteboard before touching a keyboard, then invent three test cases and walk them. Articulating the plan usually moves the score more than compiling, because the interviewer can only ever hear you.",
        "Say the boundary handling out loud while writing — empty input, single element, duplicates, out of range. It is the cheapest way to let an interviewer hear your engineering instinct, and it beats ten extra correct lines.",
        "In the mistake log, record 'why did I not think of that' rather than 'what the official solution was'. Tripping twice on the same family means the missing item is the data structure, not the problem; go learn the structure, which is cheaper than ten more problems of that kind. Bridge: cj4 decides where you spend the saved time."
      ],
      code: `#include <iostream>
#include <vector>

// 手写模板：二分只需要一个安全形状——左闭右开，循环不变式全程成立
int lower_bound_manual(const std::vector<int>& a, int target) {
    int lo = 0, hi = static_cast<int>(a.size());   // 区间是 [lo, hi)，为空时两者相等
    while (lo < hi) {                              // 区间非空就继续缩
        int mid = lo + (hi - lo) / 2;              // 这样写防相加溢出，几乎必被追问
        if (a[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;                                     // 第一个不小于 target 的位置，可能是 size
}

int main() {
    std::vector<int> a{1, 3, 3, 5, 7};
    std::cout << lower_bound_manual(a, 3) << " "
              << lower_bound_manual(a, 4) << " "
              << lower_bound_manual(a, 8) << "\\n";
    // 面试里说完思路，接着就把这三组用例自己走一遍：有重复、夹在中间、比所有元素都大
    return 0;
}`,
      pit: "只看不写：读题解时每一步都「显然」，动手时连 `priority_queue` 小顶堆第三个参数怎么写都要查。面试现场没有搜索框，也没有红色波浪线提示你类型不对——肌肉记忆只能靠手指建立，眼睛建立不了。",
      pit_en: "Reading solutions without typing them: every step looks obvious while you read, yet when you try, even the third template argument of a min-heap priority_queue needs a lookup. In the interview there is no search box and no red squiggle telling you the types disagree — muscle memory is built by fingers, never by eyes.",
      ex: {
        q: "为什么「先讲思路再动手」在手写题里几乎总是划算？",
        a: "因为面试官的评分点一半在思路上，而他是通过听来判断的：你讲清「用哈希表存已遍历的前缀和，所以一遍扫描就够」，即使后面代码有一处小错，他也已经知道你会了；闷头写完才讲，中间五分钟他无法判断你是在想还是在卡住。",
        q_en: "Why does explaining your approach before typing nearly always pay off in live coding?",
        a_en: "Because half the score is on the approach, and the interviewer judges it by ear: saying 'I store visited prefix sums in a hash table, so one scan is enough' tells him you know it even if the code later has a small slip. Typing in silence for five minutes leaves him unable to tell whether you are thinking or stuck."
      }
    },

    "cj4": {
      min: 12,
      summary: [
        "方向不该按薪资排序来选，而该按「你愿意十年里每天做什么」来选：后端天天读日志与协议文档，嵌入式天天看时序表和量波形，图形天天推公式与抠帧预算。把第四列当成选专业的依据，比把月薪当成依据可靠。",
        "后端/服务端岗位最多、补课清单也最清楚：Linux 系统调用与网络编程（socket 与 epoll）、HTTP 与某种 RPC、数据库与 Redis、容器与部署，再加 C++ 现代语言面与并发。它的好处是知识与岗位高度对应，学一点就能面一点。",
        "嵌入式/物联网要的是 C 功底加硬件读写（寄存器、中断、串口、RTOS），高级语言特性在这里几乎用不上；游戏方向要图形学（渲染管线、线性代数）与引擎经验；桌面客户端方向现在几乎等同 Qt 生态，岗位量小但稳定。",
        "高频/量化对语言与体系结构要求最高（延迟预算到纳秒、缓存行、无锁队列、网卡内核旁路），门槛里常含竞赛与数学。把它当三年后的目标，比当第一份工作现实得多。",
        "招聘要求要会拆：拿到一份 JD，分三列抄出「必须项、加分项、听着唬人但可学的」。投递前对照自己，缺的必须项写进本季度补课清单；把同一份简历海投五十个方向，只会得到五十次同样的失败。",
        "一个方向深钻胜过三个方向各点一次头：先用通用底座（语言 + 数据结构 + 操作系统 + 网络 + 一套工具链）保证能过初筛，再选一个方向做一个能讲四十分钟的项目。面试官对「什么都会一点」的直觉是「什么都不深」。",
        "职级要提前了解，因为它决定你该准备什么：初级看「能不能独立完成分配的任务」，中级看「能不能定方案并带小项目」，高级看「能不能定义问题并影响技术选择」。判断自己该往哪级走，凭的是作品与决策记录，不是工作年限。",
        "换方向的真实成本是领域知识，不是语言：C++ 后端转客户端或嵌入式，语言能整块带走，但网络协议或硬件经验要重新攒。所以第一次选方向，选你最能坚持积累十年的那一行。衔接：cj5 讲这条路上怎么维持十年。"
      ],
      summary_en: [
        "Choose a direction by what you would willingly do every day for ten years, not by the salary table: backend means logs and protocol specs all day, embedded means datasheets and oscilloscope traces, graphics means formulas and frame budgets. Use that fourth column as your criterion; it is far more reliable than monthly pay.",
        "Backend and server-side offer the most openings and the clearest checklist: Linux syscalls and network programming (sockets, epoll), HTTP and some RPC, databases and Redis, containers and deployment, plus modern C++ and concurrency. Its virtue is that knowledge maps neatly onto job content, so every hour studied is also interview-ready.",
        "Embedded and IoT want solid C plus hardware literacy (registers, interrupts, serial, an RTOS), where advanced language features barely appear; game development wants graphics (the render pipeline, linear algebra) and engine experience; desktop client work today is close to the Qt ecosystem — fewer openings, but stable.",
        "High-frequency trading demands the deepest knowledge of language and architecture (nanosecond budgets, cache lines, lock-free structures, kernel bypass) and often expects contest results and mathematics. It is a realistic goal three years out rather than a first job.",
        "Learn to read a job description: split it into three columns — hard requirements, nice-to-haves, and items that sound impressive but are learnable. Compare before applying and put missing hard requirements into this quarter's study list. Spray-fifty directions with one CV and you will collect fifty copies of the same rejection.",
        "Go deep in one direction rather than sampling three: first secure the general base (language, data structures, operating systems, networks, one toolchain) to pass screening, then pick a direction and build one project you can talk about for forty minutes. Interviewers read 'knows a bit of everything' as 'knows nothing deeply'.",
        "Understand the levelling ladder early, since it decides what to prepare: junior means finishing assigned tasks unaided, mid means choosing an approach and carrying a small project, senior means defining problems and shifting technical choices. Judge your own rung by artefacts and decision records, not by years.",
        "The real cost of switching direction is domain knowledge, not language: moving from C++ backend to client or embedded lets you carry the language wholesale, but protocol or hardware experience restarts from zero. So pick, the first time, the row you can keep at for ten years. Bridge: cj5 is about sustaining it."
      ],
      code: `# 一张方向对照表：面试前先问自己哪一行能填得最满
direction   | must-learn list                    | what you actually do all day
backend     | linux, epoll, http, mysql, redis   | logs, traces, latency budgets
embedded    | c, registers, interrupts, rtos     | datasheets, waveforms, footprint
game        | graphics, render pipeline, maths   | frame budget, memory layout
quant       | low latency, cache lines, lockfree | counting nanoseconds
# 判断依据不是起薪，而是第四列里你愿意天天做的那一行`,
      pit: "四个方向各学两周就都算「了解过」：简历上留下四行浅描述，面试时每一行都被问穿，结果是「这人没有一条能深挖」。正确节奏是先选一行做到能讲四十分钟，再让其他三行成为你的背景兴趣，而不是并列技能。",
      pit_en: "Spending two weeks in each of four directions and calling all of them 'aware of': the CV shows four shallow lines, the interview punctures every one, and the verdict becomes 'nothing goes deep here'. Pick one row first and reach forty minutes of talk about it; let the other three stay hobbies, not parallel skills.",
      ex: {
        q: "为什么「通用底座」比「方向技能」更该先补？",
        a: "因为初筛考的是底座（语言、数据结构、操作系统、网络），它决定你能不能进面；而方向技能只在最后一轮和入职后起作用，并且可以随时靠真实项目补。顺序倒了会出现「方向选得很准但连电话面都没过」。",
        q_en: "Why does the general base deserve to come before direction-specific skills?",
        a_en: "Because screening tests the base — language, data structures, operating systems, networks — and that decides whether you even get to the technical round. Direction skills matter only in the last round and afterwards, and real work teaches them anyway. Reverse the order and you get someone with a very accurate direction who never passes the phone screen."
      }
    },

    "cj5": {
      min: 12,
      summary: [
        "读源码要挑「小而完整」的目标：一个千行级的向量库、一个 mini STL、一个单文件 JSON 解析器。把 Linux 内核或 LLVM 当第一个目标，唯一稳定的收获是挫败感。",
        "读法分三条线：先看目录与构建（怎么切分、有几个入口、有没有测试），再顺一条主干调用链走到底（一次请求怎么进来怎么出去），最后专看错误处理与边界——第三处最能看出作者的真实水平，也最像你以后要写的东西。",
        "带着具体问题读，比从头读到尾有效十倍：「vector 扩容时旧内存什么时候归还」这类问题会把你直接带到那二十行代码上。没有问题的阅读只是让眼睛经过文本。",
        "改测试是读源码的最短路径：给一个开源项目补一条用例并跑通，你就被迫读懂它的接口、初始化路径与失败约定。这比读一年文档更能建立真实理解，也顺手完成了第一件贡献。",
        "开源 PR 的最小闭环值得完整走一遍：找 good first issue → 读 CONTRIBUTING → fork 并本地复现 → 做最小 diff → 跑通它的 CI → 提 PR → 按 review 意见改。第一次的目标不是被合并，而是把流程跑通一次。",
        "公开输出是三合一工具：博客或笔记逼你把「以为懂了」写成一句可被反驳的话（费曼学习法），它同时是简历的证据链，也是半年后的复习资料。收藏不等于学会——被写下来的知识才是你的。",
        "每季度做一个可交付的小东西：一个能用的 CLI 工具、一个自写内存池、一份线程池基准测试。成长看得见的方式是作品数量与质量，不是读了多少页文档。",
        "语言和框架每年换一批，判据不会换：「先测后改、先看内存布局再谈性能、先想边界再写主干、先复现再调试」。把这四条放进你的日常，新工具就只是新语法。衔接：cj6 把这一路的积累讲成 offer。"
      ],
      summary_en: [
        "Pick reading targets that are small and complete: a vector store of a few thousand lines, a mini STL, a single-file JSON parser. Making the Linux kernel or LLVM your first target reliably produces one outcome: discouragement.",
        "Read along three lines: start with the tree and the build (how it is cut, how many entry points, whether tests exist), then follow one main call chain end to end (how a request arrives and leaves), and finish with error handling and boundaries — the third pass shows the author's real level and most resembles what you will be asked to write.",
        "Reading with a concrete question beats reading linearly by ten times: 'when does vector return the old memory after growth' walks you straight to those twenty lines. Reading without a question is only letting your eyes pass over text.",
        "Changing the tests is the shortest path into a codebase: adding one case and getting it green forces you to understand the interface, the initialisation path and the failure conventions. It builds real understanding faster than a year of documentation — and it is also your first contribution.",
        "Walk the minimal open-source loop once, completely: find a good first issue, read CONTRIBUTING, fork and reproduce locally, make the smallest possible diff, pass their CI, open the pull request, then revise on review feedback. The goal of the first one is not merging; it is having run the process.",
        "Publishing output is a three-in-one tool: a blog post or note forces 'I think I get it' into a sentence someone can contradict (the Feynman technique), it acts as evidence on your CV, and it is revision material in six months. Bookmarking is not learning — only what you wrote down belongs to you.",
        "Ship one small thing per quarter: a CLI tool people can actually use, a hand-written memory pool, a thread-pool benchmark. Growth becomes visible through artefacts, not through pages of documentation consumed.",
        "Languages and frameworks churn yearly; the criteria do not: measure before optimising, look at the memory layout before talking performance, think through boundaries before the main path, reproduce before debugging. Keep those four in your routine and a new tool is just new syntax. Bridge: cj6 turns this accumulation into an offer."
      ],
      code: `# 一条源码主干的读法：把调用链抄成笔记，标出每一跳传的是什么、谁拥有它
# 目标项目：一个约一千行的单文件 JSON 解析器
# 第一步：读构建脚本，看几个目标、几个源文件、有没有测试目录
# 第二步：从 parse 入口一路抄到返回，先跳过优化细节，只求走通主干
# 第三步：在错误分支上停下来，看多余逗号、非法转义、深度嵌套分别怎么处理
# 第四步：给它补一条测试用例并跑通，这一步会暴露所有你以为读懂的地方
# 三个问题各写一篇笔记，比「我读完了」这句话有说服力得多`,
      pit: "收藏了几十个「必读源码清单」和上百篇长文却从不输出：半年后既没读懂一个项目，也没留下任何能被别人检查的证据。收藏是选择的幻觉，写一篇两千字的读后笔记才是学会的开始——这也是把 s18 到 eng 的项目经验沉淀下来的唯一办法。",
      pit_en: "Bookmarking dozens of must-read source lists and hundreds of long articles while never publishing anything: half a year later you have understood no project and left no evidence anyone can inspect. Collecting is the illusion of choosing; a two-thousand-word note about one file is where learning starts, and it is the only way the s18-to-eng project experience actually sticks.",
      ex: {
        q: "为什么「给开源项目补一条测试」比「提一个新功能」更适合第一次贡献？",
        a: "因为测试的验收标准客观（能跑、能失败、能被 maintainer 直接判断），改动小、争议少，还逼你走通构建与 CI 全流程；新功能则牵扯设计取向与风格，评审周期长，第一次就撞墙很容易让人彻底放弃开源参与。",
        q_en: "Why is adding a test a better first contribution than adding a feature?",
        a_en: "Because a test has an objective acceptance bar — it runs, it fails where it should, and a maintainer can judge it instantly — so the diff is small, uncontroversial, and forces you through the whole build and CI path. A feature drags in design taste and style, reviews take long, and being rejected on the first attempt is exactly how people quit open source."
      }
    },

    "cj6": {
      title: "综合重构：把会的东西讲出来",
      title_en: "Synthesis: Turning Knowledge into an Offer",
      min: 14,
      target: "能独立走完一次 60 分钟技术面的全流程（自我介绍、项目拷问、手写题、场景设计、反问），并把每一场复盘成下一场的准备清单。",
      target_en: "Run a full 60-minute technical interview end to end — self-introduction, project deep-dive, live coding, scenario design, reverse questions — and turn every session into the checklist for the next one.",
      summary: [
        "三分钟的自我介绍是「路线预告」，不是履历复述：一句定位（我在准备 C++ 后端方向）+ 两个项目的技术钩子 + 一句期望，把面试官的追问自然引到你准备最深的地方。",
        "项目拷问几乎总是走三层：做了什么（事实）→ 为什么这么做（取舍）→ 重来会怎么改（反思）。第三层最多人答不上来，也最能拉开差距，务必提前写好三行答案。",
        "反问不是礼节，而是最后一次技术展示：问「团队怎么做代码评审与 CI」「性能优化的收益怎么衡量」「这个模块未来半年最大的技术风险是什么」。这类问题反证你真的懂工程；至于加班与作息，留给 HR 那一轮。",
        "系统与场景题（设计一个短链服务、日志采集器、秒杀计数）考的不是背方案，而是四步：先问清需求与规模 → 给出一个能跑通的粗方案并现场估容量 → 逐点补容错与瓶颈 → 主动说出取舍与替代方案。数字要当场算，躲开等于弃权。",
        "沟通动作是可以训练的：结论放最前、边写边说、被打断就停下听完、不知道就直说并给出你会怎么找答案。「我不确定，但我会先从这两处验证」远好过编一个听起来对的答案。",
        "每场面试后 24 小时内写复盘：被问住的三题、答错的一处、下次要改的一句表达。同一批坑出现两次，该改的就是准备方法本身，而不是运气。",
        "比较 offer 时看成长率而不是起薪：前两年有没有人带你、评审与测试文化是否健康、能不能碰到真问题（性能、稳定性、并发），比每月多那一千块更影响五年后的你。方向判断回到 cj4 那张表。",
        "全站收口：到这里 C++ 路线的地基齐了——语言（s1 到 s11）、系统与工程（sdbg 与 eng）、算法（srec 到 dsa）、表达（本章）。接下来两条路：往 AI 方向就去 sp1 起的 Python 与机器学习段，或者直接进真实项目；无论哪条，把「持续学习」写进日历上的固定时段，而不是写进愿望清单。"
      ],
      summary_en: [
        "A three-minute introduction is a preview of the route, not a recitation of your CV: one line of positioning (I am preparing for C++ backend roles), plus a technical hook from each of two projects, plus one expectation. It steers the follow-ups toward the ground you prepared hardest.",
        "Project interrogation nearly always runs three levels: what you did (facts), why it was designed that way (trade-off), and what you would change on a redo (reflection). The third level is where most candidates stop answering and where the most credit is available — write those three lines in advance.",
        "Reverse questions are not politeness but your last technical impression: ask how the team does code review and CI, how performance gains get measured, or what the biggest technical risk in that module is over the next six months. Those prove you actually work like an engineer; save working hours for the HR round.",
        "Scenario and system questions (design a URL shortener, a log collector, a flash-sale counter) do not test memorised architectures but four steps: clarify requirements and scale, give a runnable rough design and estimate capacity out loud, add fault tolerance and name the bottlenecks one by one, then volunteer the trade-offs and alternatives. Do the arithmetic on the spot; dodging it is abstaining.",
        "Communication habits are trainable: put the conclusion first, narrate while writing, stop and listen when interrupted, and when you do not know, say so and describe how you would find out. 'I am not sure, but I would verify these two things first' beats inventing something that sounds right.",
        "Write a debrief within 24 hours of every interview: the three questions that stalled you, the one thing you answered wrongly, the one sentence you will phrase differently next time. If the same class of pit recurs twice, what needs changing is your preparation method, not your luck.",
        "When comparing offers, look at growth rate rather than starting pay: whether someone mentors you in the first two years, whether review and testing culture is healthy, and whether you get to touch real problems in performance, stability or concurrency matter far more than an extra thousand a month. For that judgement, return to the cj4 table.",
        "Full-site closing: the C++ foundation is now complete — language (s1 to s11), systems and engineering (sdbg and eng), algorithms (srec to dsa), and expression (this chapter). Two roads continue: head toward AI with the Python and machine-learning chapters starting at sp1, or go straight into real projects. Either way, put continuous learning into a fixed slot on the calendar instead of a wish list."
      ],
      code: `# 一张 60 分钟技术面的自持卡，前一晚只翻这一页
# 第一，三分钟自我介绍：两句项目钩子，把追问引向我最熟的地方
# 第二，项目拷问：三层准备——做了什么、为什么这样设计、重来会怎么改
# 第三，手写题：先讲思路再动手，写完自造三组用例（空、单元素、越界）
# 第四，场景题：问规模，给粗方案，现场估容量，逐点补容错，数字要当场算
# 第五，反问环节：评审与 CI 怎么做、性能收益怎么衡量、这个模块最大的技术风险
# 第六，收尾：问下一步流程，24 小时内写复盘，记下被问住的三题`,
      pit: "把面试当成一次「测试」而不是「沟通」：只准备答案不准备表达，结果会的东西全在、却讲得比实际差一半。反向也一样危险——用漂亮话盖过没做过的部分，通常撑不过第二层追问。正确的准备比例是七分做项目、三分练表达。",
      pit_en: "Treating an interview as an exam rather than a conversation: you prepare answers but never delivery, and everything you genuinely know comes out at half its real quality. The mirror mistake is just as dangerous — glossing over things you never did usually collapses at the second follow-up. Spend seven parts of your preparation building and the remaining three rehearsing how you say it.",
      ex: {
        q: "为什么「反问环节」值得单独准备，而不是临场随便问一句？",
        a: "因为那是唯一一段完全由你选题的展示时间：问技术流程类的问题（评审、测试、度量、风险）能补上前面试里没机会展现的工程判断力，同时也在替自己评估这家团队值不值得去；临场随口一句「没什么问题」等于弃权两遍。",
        q_en: "Why does the reverse-question segment deserve its own preparation instead of an improvised line?",
        a_en: "It is the only stretch where you choose the topic, so a question about review, tests, measurement or risk supplies engineering judgement you may never have gotten to show, and it doubles as your own evaluation of the team. A thrown-off 'no questions' abstains twice."
      }
    }
  },

  /* ---------- 题库：对准深化后新增的知识点，每章 4 题 ---------- */
  quizAdd: {
    eng: [
      {
        q: "关于静态库与动态库，下列说法正确的是？",
        o: ["静态库在链接期把目标码复制进可执行文件，发布时不必再带上它", "动态库一定比静态库运行得更快", "静态库可以只换文件不重编使用者", "动态库不需要考虑符号导出与版本"],
        a: 0,
        why: "静态链接把库的代码编进产物，自包含但升级要重编；动态库在运行时解析符号，可单独替换，代价是必须保证 ABI 兼容，Windows 上还要显式导出符号。",
        q_en: "Which statement about static versus shared libraries is correct?",
        o_en: ["A static library's object code is copied into the executable, so you need not ship the library itself", "A shared library always runs faster", "A static library can be swapped file-for-file without rebuilding users", "Shared libraries need no symbol export or versioning"],
        why_en: "Static linking compiles the code into your artefact: self-contained, but upgrades need a rebuild. Shared libraries resolve symbols at run time and can be replaced alone, provided the ABI holds — and on Windows you must export symbols explicitly."
      },
      {
        q: "给一个 C++ 项目配第一条 CI 流水线，最有价值的做法是？",
        o: ["配置 + 编译（警告当错误）+ 单元测试 + 一轮 sanitizer 构建", "每天凌晨全量跑一次，白天不管", "只自动生成代码风格报告", "先做 Docker 镜像发布，其余以后再说"],
        a: 0,
        why: "这条组合能在提交时立刻回答「坏在哪个提交引入」。夜间全量跑发现问题时已过去一天；只做风格检查拦不住任何逻辑或内存错误。",
        q_en: "For a C++ project's first CI pipeline, which setup is worth the most?",
        o_en: ["Configure, build with warnings-as-errors, run unit tests, then run once with sanitizers", "One full nightly run and nothing during the day", "Auto-generated style reports only", "Publish Docker images first and add the rest later"],
        why_en: "That combination answers 'which commit broke it' the moment you push. A nightly run tells you a day late, and style reports alone stop no logic or memory defect."
      },
      {
        q: "判断：接了 clang-tidy 之后，关键函数就不必再写单元测试。",
        type: "judge", a: 1,
        why: "静态分析读的是模式（单文件、常见误用），不读行为；它无法告诉你边界输入下结果对不对。测试与静态分析覆盖的是两类缺陷，属于互补关系。",
        q_en: "True or false: with clang-tidy in place, critical functions no longer need unit tests.",
        why_en: "Static analysis reads patterns (one file, common misuse), not behaviour; it cannot say whether the result is correct for a boundary input. Tests and analysis cover different defect classes and complement each other."
      },
      {
        q: "库更新了，使用者没有重新编译，只是把动态库文件换掉，程序崩溃。这种二进制层面的约定被破坏通常简称为 ______（填两个英文字母）。",
        type: "fill", ans: ["ABI", "abi"],
        why: "ABI 规定名字改编、对象布局、虚表结构、调用约定等二进制约定。类成员顺序、虚函数增减、标准库 ABI 标签或编译器版本变化都可能破坏它，所以同一工具链统一构建是工程纪律。",
        q_en: "A library was updated and users only swapped the shared file without rebuilding; the program crashed. Which two-letter abbreviation names the binary-level contract that broke?",
        why_en: "The ABI fixes name mangling, object layout, vtable shape and calling conventions. Reordering members, adding virtuals, the standard library's ABI tag or a different compiler version can all break it, which is why one toolchain building everything is a discipline, not a preference."
      }
    ],
    career: [
      {
        q: "只含一个虚函数的空派生类对象，在 64 位常见实现下的大小最接近？",
        o: ["0 字节，空类不占空间", "一个指针大小，因为要放虚表指针", "等于虚函数表的大小", "完全由编译器随机决定"],
        a: 1,
        why: "带虚函数的对象必须存 vptr，64 位下通常 8 字节；空类本身是 1 字节，但一旦有虚基类子对象就至少是指针宽度。这类题靠对象模型推，不靠背。",
        q_en: "In a typical 64-bit implementation, how large is an empty derived class object that inherits one virtual function?",
        o_en: ["0 bytes, an empty class stores nothing", "One pointer, for the vtable pointer", "The size of the vtable", "Entirely at the compiler's whim"],
        why_en: "An object with virtuals carries a vptr, usually 8 bytes on 64-bit; an empty class is 1 byte, but as soon as it has a polymorphic base it is at least pointer-wide. Derive this from the object model instead of memorising."
      },
      {
        q: "针对「手写代码」（手撕）最有效的训练法是？",
        o: ["关掉自动补全，限时写完，先讲思路再动手，最后自己造三组用例走一遍", "把每题的最优解背下来，见到相似题直接默写", "只读题解，认为思路懂了就行", "专挑最难的题，简单题一律跳过"],
        a: 0,
        why: "面试现场没有补全也没有搜索框，评分一半来自你能不能把思路讲清楚并自己验证；补全、默写题解和只看不写都建立不了这种手感。",
        q_en: "Which training method works best for live, hand-written coding?",
        o_en: ["Autocomplete off, on a timer: explain the plan first, type it, then walk three test cases you invented", "Memorise the optimal solution for each problem and reproduce it on sight", "Only read editorials, since understanding the idea is enough", "Attempt only the hardest problems and skip easy ones"],
        why_en: "In the room there is no autocomplete and no search box, and half the score is whether you can explain the plan and verify it yourself. Autocomplete, recitation and read-only practice build none of that."
      },
      {
        q: "判断：面试最后的反问环节只是礼节，随便问一句就行。",
        type: "judge", a: 1,
        why: "反问是唯一由你选题的展示时间：问评审与 CI 怎么做、性能收益怎么衡量、模块最大的技术风险是什么，既补出工程判断力，也替自己评估这家团队。随口说「没问题」等于弃权。",
        q_en: "True or false: the reverse-question segment at the end of an interview is only politeness, so anything will do.",
        why_en: "False. It is the only stretch where you choose the topic: asking about review and CI practice, how performance gains get measured, or the biggest technical risk in that module both demonstrates engineering judgement and evaluates the team for you. 'No questions' is abstaining."
      },
      {
        q: "简历里讲项目用的 STAR 法中，字母 R 代表 ______（填英文单词）。",
        type: "fill", ans: ["Result", "Results", "结果"],
        why: "Situation 背景、Task 任务、Action 行动、Result 结果。R 必须量化（从 4.2 秒到 0.6 秒），否则整段描述会退化成职责清单。",
        q_en: "In the STAR method used for CV project bullets, what does the letter R stand for? Give the English word.",
        why_en: "Situation, Task, Action, Result. The R must carry a number (4.2 seconds down to 0.6) or the whole bullet collapses back into a job description."
      }
    ]
  },

  /* ---------- 词典：分类统一为「C++ 系统深入」，主键不与既有名词重复 ---------- */
  terms: [
    { term: "持续集成", term_en: "Continuous Integration", cat: "C++ 系统深入",
      short: "每次提交都自动跑一遍「配置、编译、测试、检查」的实践。",
      short_en: "Automatically configuring, building, testing and checking on every commit.",
      detail: ["它的核心价值不是拦住坏代码，而是让「坏在哪个提交引入」有唯一答案。", "C++ 项目还要加一轮 sanitizer 构建：内存错误在提交当天暴露，比线上崩溃后捞 core dump 便宜得多。"],
      detail_en: ["Its real value is not blocking bad code but giving 'which commit broke it' one answer.", "A C++ pipeline needs a second sanitizer run: memory faults on the day of the commit beat a core dump pulled off a production box."],
      vs: "持续集成是自动把关，代码评审是人工把关。",
      vs_en: "Continuous integration is automated gatekeeping; code review is human gatekeeping." },
    { term: "代码评审", term_en: "Code Review", cat: "C++ 系统深入",
      short: "由他人阅读改动并提出意见的流程，主要看正确性、边界与可读性。",
      short_en: "The process of having someone else read your change, mainly for correctness, boundaries and readability.",
      detail: ["排版与命名这类机械问题应交给 clang-format 与 clang-tidy，别消耗评审者的注意力。", "评论针对代码不针对人：问「空输入会怎样」比说「你这样写不对」更容易被采纳。"],
      detail_en: ["Hand formatting and naming to clang-format and clang-tidy instead of spending reviewer attention on them.", "Comment on the code, not the author: 'what happens on empty input' lands better than 'this is wrong'."],
      vs: "评审看的是判断，流水线看的是事实。",
      vs_en: "Review judges decisions; the pipeline checks facts." },
    { term: "静态分析", term_en: "Static Analysis", cat: "C++ 系统深入",
      short: "不运行程序而从源码中找缺陷模式与可疑写法的检查。",
      short_en: "Inspecting source without running it to find defect patterns and suspicious idioms.",
      detail: ["分三层：编译器警告（-Wall -Wextra -Wshadow -Wconversion）、clang-tidy（常见误用与可读性）、cppcheck（不依赖完整编译）。", "它只能证明「可疑」，不能证明「正确」，所以永远和测试互补而不是替代。"],
      detail_en: ["Three layers exist: compiler warnings (-Wall -Wextra -Wshadow -Wconversion), clang-tidy for common misuse and readability, and cppcheck which needs no full build.", "It can only prove 'suspicious', never 'correct', so it complements tests instead of replacing them."],
      vs: "静态分析看模式，动态测试看行为，sanitizer 看运行时现场。",
      vs_en: "Static analysis reads patterns, tests read behaviour, sanitizers read the live scene." },
    { term: "性能剖析", term_en: "Profiling", cat: "C++ 系统深入",
      short: "用采样工具找出真实耗时或资源热点，再决定改哪里。",
      short_en: "Using sampling tools to locate real hot spots in time or resources before deciding what to change.",
      detail: ["纪律是「先测后改」：没有热点数据时，直觉最常猜错层次（分配器、缓存、编译期、指令选择）。", "剖析必须用 Release 构建，并且不能带 sanitizer：ASan 会慢数倍，测出的数字没有意义。"],
      detail_en: ["The discipline is measure first, change second: without hot-spot data, intuition usually picks the wrong layer — allocator, cache, compile time, instruction selection.", "Profile a release build with no sanitizers attached: ASan costs several times the run time and its numbers mean nothing."],
      vs: "剖析回答「慢在哪」，基准测试回答「有没有变快」。",
      vs_en: "Profiling answers where the time goes; benchmarking answers whether it got faster." },
    { term: "ABI 兼容", term_en: "ABI Compatibility", cat: "C++ 系统深入",
      short: "编译产物之间在二进制层面对名字、对象布局与调用约定的共同理解。",
      short_en: "The shared binary-level understanding of names, object layout and calling conventions between compiled artefacts.",
      detail: ["成员顺序、虚函数增减、模板实例化方式、标准库的 ABI 标签、编译器版本都可能改变它。", "所以工程实践是同一工具链同一配置构建全套产物；要独立替换 .so 或 .dll，就必须显式承诺 ABI 稳定并升主版本号。"],
      detail_en: ["Member order, added or removed virtuals, how templates get instantiated, the standard library's ABI tag and the compiler version can all change it.", "Hence one toolchain and one configuration build everything; replacing a .so or .dll on its own requires an explicit stable-ABI promise and a major version bump."],
      vs: "源码兼容是「重新编译就行」，ABI 兼容是「不重编也能换」。",
      vs_en: "Source compatibility means a rebuild is enough; ABI compatibility means the binary can be swapped without one." },
    { term: "STAR 法则", term_en: "STAR Method", cat: "C++ 系统深入",
      short: "讲项目的四段结构：背景、任务、行动、结果。",
      short_en: "A four-part structure for project stories: situation, task, action, result.",
      detail: ["结果必须量化，否则整段退化成职责清单；行动要写决策，而不是「负责某模块」。", "四段里最容易被追问的是结果之后的一问：那你怎么证明是你的改动带来的？"],
      detail_en: ["Quantify the result or the story degrades into a job description, and write the action as a decision rather than 'responsible for a module'.", "The follow-up people forget to prepare is: how do you know your change caused that number?"],
      vs: "STAR 讲一个项目，知识地图讲一类技术，两者不能互相替代。",
      vs_en: "STAR tells one project; a knowledge map tells a technical area. Neither substitutes for the other." },
    { term: "行为面试", term_en: "Behavioural Interview", cat: "C++ 系统深入",
      short: "通过追问过去的真实经历来判断协作与抗压等素质的面试形式。",
      short_en: "An interview style that probes past events to judge collaboration and resilience.",
      detail: ["常见题型是「讲一次你和同事意见冲突的经历」，答案同样要落在具体事件与结果上。", "准备好的三件事足够覆盖大部分问题：一次冲突、一次失败、一次主动补位。"],
      detail_en: ["Typical prompts ask for a time you disagreed with a colleague, and the answer still needs a concrete event with an outcome.", "Three rehearsed stories cover most of it: one conflict, one failure, one time you stepped beyond your role."],
      vs: "技术面考「能不能做」，行为面考「会不会一起做」。",
      vs_en: "Technical rounds ask whether you can do it; behavioural rounds ask whether you can do it with others." },
    { term: "对象模型", term_en: "Object Model", cat: "C++ 系统深入",
      short: "对象在内存里怎么摆放：成员布局、对齐、vptr 位置。",
      short_en: "How objects are laid out in memory: member order, alignment, where the vptr sits.",
      detail: ["它是 sizeof 题、多继承题与「虚函数为什么不占对象大小」这类追问的共同答案来源。", "面试价值极高，因为它同时证明你懂语言、懂内存布局、懂性能从哪来。"],
      detail_en: ["It is the common source of answers for sizeof questions, multiple inheritance, and why virtual functions cost no bytes per object.", "It is interview gold because it simultaneously proves you understand the language, memory layout and where performance comes from."],
      vs: "对象模型讲「运行时怎么摆」，内存四区讲「整体上谁住哪」。",
      vs_en: "The object model is about runtime layout; the four memory regions are about who lives where overall." },
    { term: "手撕代码", term_en: "Live Coding", cat: "C++ 系统深入",
      short: "在限时、无补全、有人看着的条件下现场写出可运行代码。",
      short_en: "Writing working code on a clock, without completion, while someone watches.",
      detail: ["评分点一半在表达：先讲思路、边写边说、写完自己造用例走一遍。", "C++ 岗的额外门槛是 API 要能默写：比较器、计数容器、小顶堆、二分的区间不变式。"],
      detail_en: ["Half the score is delivery: state the plan, narrate while typing, then walk test cases you invented yourself.", "The extra bar in C++ is typing APIs from memory: comparators, counting maps, min-heaps, and the binary-search invariant."],
      vs: "手撕考表达与熟练度，刷题量考识别题型的速度。",
      vs_en: "Live coding tests fluency under observation; problem volume tests how fast you recognise the pattern." },
    { term: "反问环节", term_en: "Reverse Questions", cat: "C++ 系统深入",
      short: "面试末尾由候选人提问的一段，是唯一完全由你选题的展示机会。",
      short_en: "The closing segment where the candidate asks — the only part where you pick the topic.",
      detail: ["问技术流程类问题（评审、CI、性能度量、模块风险）能补出前面没展现的工程判断力。", "也是你在评估对方：技术负责人答不出「怎么衡量优化收益」，本身就是信息。"],
      detail_en: ["Asking about review, CI, performance measurement or module risk supplies engineering judgement you may not have shown earlier.", "It is also you interviewing them: if the tech lead cannot say how optimisation gains are measured, that is information too."],
      vs: "反问考察判断力，HR 面考察匹配度，两者问题不要混用。",
      vs_en: "Reverse questions show judgement; the HR round checks fit. Do not reuse the same questions in both." }
  ],

  achievements: [
    { id: "eng_citizen", icon: "🏗️", name: "工程公民", name_en: "Site Engineer",
      desc: "完成 eng · C++ 工程化 全部课节", desc_en: "Finish every lesson of eng C++ Engineering",
      check: ["eng"] },
    { id: "interview_ready", icon: "🎯", name: "面试就绪", name_en: "Interview Ready",
      desc: "完成 career · 面试冲刺与就业准备 全部课节", desc_en: "Finish every lesson of career Interview Sprint",
      check: ["career"] }
  ],

  /* ---------- 代码注释英文映射 ---------- */
  codeComments: {
    "第一次建仓库：先写 ignore 再提交，顺序反了就要多清一次索引": "first repo: write the ignore file before committing, otherwise you must clean the index again",
    "分支只是指针，开一条几乎零成本，所以小步开、快合并": "a branch is just a pointer, so opening one costs nothing — branch small, merge fast",
    "已经在跟踪的产物：只加 ignore 规则不生效，要从索引里摘掉": "artefacts already tracked: a rule alone does nothing, untrack them from the index",
    "看清楚形状：每个点是一个快照，不是一串差异": "see the shape: every dot is a snapshot, not a diff",
    "只改写最后一条说明，公共历史一律用 revert 而不是 reset": "only rewrite the very last message; on shared history use revert, never reset",
    "CMakeLists.txt：现代 CMake 的形状，一切围绕 target": "CMakeLists.txt: modern CMake shape, with everything driven by targets",
    "业务逻辑做成静态库，可执行文件和测试都链接它": "build the business logic as a static library that both the executable and the tests link",
    "对外头文件目录用 PUBLIC：使用方包含你的 .h 时才找得到路径": "public header dirs are PUBLIC: consumers need the path too",
    "按构建类型开关选项：Debug 才配警告与消毒器，Release 才谈性能": "switch flags per build type: warnings and sanitizers in Debug, performance talk in Release",
    "新增源码用文件名列表，不用通配：GLOB 会漏掉刚加的 .cpp": "list new sources by name, never by glob: GLOB misses the file you just added",
    "外部构建：配置一次，之后只重编受影响的目标": "out-of-source build: configure once, then only affected targets recompile",
    "构造加锁、析构解锁：中途 return 也不会忘记解": "locks on construction, unlocks on destruction: an early return cannot forget",
    "临界区里只做被保护的那一件小事": "the critical section does only the one protected thing",
    "线程对象析构前必须 join 或 detach，否则进程直接 terminate": "a thread must be joined or detached before destruction, or the process terminates",
    "单变量的停止标志：atomic 比锁便宜": "a single-variable stop flag: an atomic is cheaper than a lock",
    "带谓词的 wait：虚假唤醒和「通知早于等待」都被它挡住": "wait with a predicate: it absorbs both spurious wake-ups and notify-before-wait",
    "干活之前先放锁，别让临界区盖住耗时操作": "release the lock before doing the work; do not cover slow code with a critical section",
    "二十行的最小测试框架：有名字、能汇总、用退出码把结果交给脚本": "a twenty-line test micro-framework: named cases, a summary, and an exit code for scripts",
    "非 0 退出码：CI 判定失败的唯一依据": "a non-zero exit code is the only thing CI judges",
    ".github/workflows/ci.yml：一条最小的 C++ 流水线，四步就够": ".github/workflows/ci.yml: a minimal C++ pipeline in four steps",
    "警告清零与测试：把 -Wall -Wextra -Werror 写进 CMake，坏提交当场被拦": "warnings to zero, then tests: put -Wall -Wextra -Werror in CMake so bad commits are stopped at once",
    "第二轮换成消毒器构建：内存问题在测试阶段暴露，而不是在客户机上": "a second run with the sanitizer build: memory problems surface in testing, not on a customer machine",
    "空类也要占一字节，否则两个对象地址相同": "even an empty class takes one byte, otherwise two objects would share an address",
    "四字节成员加对齐，多一个 vptr，通常是 16": "four-byte member plus alignment, one extra vptr: usually 16",
    "再塞一个 int，仍按八字节对齐到 24": "one more int added, still aligned to eight bytes, so 24",
    "被追问时，能讲出「为什么是这个数」比记住数字值钱得多": "under follow-up questions, explaining why the number is that is worth far more than remembering it",
    "控制块：强计数、弱计数、删除器，都是额外开销": "the control block: strong count, weak count, deleter — all extra cost",
    "先预留：这就是「扩容使迭代器失效」的防御写法": "reserve up front: the defensive answer to 'growth invalidates iterators'",
    "简历项目条目的写法：每一条都要能被追问三层": "how to write a CV project bullet: every line must survive three levels of questioning",
    "反面写法：只说负责什么，没有数字，也没有决策": "the wrong way: only duties, no number, no decision",
    "下面三条改写分别指向：性能取舍、设计决策、工程习惯": "the three rewrites below point at a performance trade-off, a design decision and an engineering habit",
    "面试官会挑哪一条追问，你决定不了；但三条都必须是你能讲四十分钟的那件事": "you cannot choose which line gets the follow-up, so all three must be things you can talk about for forty minutes",
    "手写模板：二分只需要一个安全形状——左闭右开，循环不变式全程成立": "hand-written template: binary search needs exactly one safe shape, half-open, with the invariant holding throughout",
    "区间是 [lo, hi)，为空时两者相等": "the interval is [lo, hi); when empty, both ends are equal",
    "区间非空就继续缩": "keep shrinking while the interval is not empty",
    "这样写防相加溢出，几乎必被追问": "this form avoids overflow when adding, and it is almost always the follow-up question",
    "第一个不小于 target 的位置，可能是 size": "the first position not less than target, possibly size",
    "面试里说完思路，接着就把这三组用例自己走一遍：有重复、夹在中间、比所有元素都大": "after stating the plan in an interview, walk these three cases yourself: duplicates, a value in the middle, a value above all",
    "一张方向对照表：面试前先问自己哪一行能填得最满": "a direction comparison table: before the interview ask which row you can fill best",
    "判断依据不是起薪，而是第四列里你愿意天天做的那一行": "the criterion is not starting pay but the fourth column — the work you would gladly do daily",
    "一条源码主干的读法：把调用链抄成笔记，标出每一跳传的是什么、谁拥有它": "how to read one main call chain: copy it into notes, marking what each hop passes and who owns it",
    "目标项目：一个约一千行的单文件 JSON 解析器": "target project: a single-file JSON parser of roughly a thousand lines",
    "第一步：读构建脚本，看几个目标、几个源文件、有没有测试目录": "step 1, read the build script: how many targets and sources, whether tests exist",
    "第二步：从 parse 入口一路抄到返回，先跳过优化细节，只求走通主干": "step 2, follow parse to its return, skipping optimisation details to get the trunk",
    "第三步：在错误分支上停下来，看多余逗号、非法转义、深度嵌套分别怎么处理": "step 3, stop at the error branches: trailing commas, bad escapes, deep nesting",
    "第四步：给它补一条测试用例并跑通，这一步会暴露所有你以为读懂的地方": "step 4, add a test case and make it pass; this exposes everything you thought you understood",
    "三个问题各写一篇笔记，比「我读完了」这句话有说服力得多": "one note per question beats the sentence 'I finished reading it' by a wide margin",
    "一张 60 分钟技术面的自持卡，前一晚只翻这一页": "a one-page card for a 60-minute technical interview; read only this the night before",
    "第一，三分钟自我介绍：两句项目钩子，把追问引向我最熟的地方": "one, the three-minute introduction: two project hooks that steer follow-ups where I am strongest",
    "第二，项目拷问：三层准备——做了什么、为什么这样设计、重来会怎么改": "two, project interrogation: three prepared layers — what I did, why designed so, what I would change",
    "第三，手写题：先讲思路再动手，写完自造三组用例（空、单元素、越界）": "three, live coding: explain first, then type, then three self-made cases (empty, single element, out of range)",
    "第四，场景题：问规模，给粗方案，现场估容量，逐点补容错，数字要当场算": "four, scenarios: ask the scale, give a rough design, estimate capacity out loud, add fault tolerance point by point",
    "第五，反问环节：评审与 CI 怎么做、性能收益怎么衡量、这个模块最大的技术风险": "five, reverse questions: how review and CI run, how gains get measured, the biggest technical risk here",
    "第六，收尾：问下一步流程，24 小时内写复盘，记下被问住的三题": "six, wrap-up: ask about next steps, write the debrief within 24 hours, note the three hard questions"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_ENGCAR);
