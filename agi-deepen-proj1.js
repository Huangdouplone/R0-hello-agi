/* ================================================================
 * R0:hello agi · 课程深化层 ⑥（s18 项目实战 / sdbg 调试入门）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：s18 原来只有「做什么项目」，这一层补上「怎么把它当工程做」——需求拆解与
 *       模块边界、多文件与头文件、编译单元与增量构建、依赖与配置、测试与交付四件套；
 *       sdbg 原来只讲「有断点和打印」，这一层补上一条可复用的排错流程：读报错的方法、
 *       栈回溯与监视点、崩溃现场、UB 与内存错误的定位手段、二分与最小化。
 * 写法约定：既有课节不写 title；新增课节写 title/target 且出现在 order 里；
 *           code 中的中文注释全部进 codeComments；英文条数与中文严格一致。
 * ================================================================ */

const DEEPEN_PROJ1 = {
  stages: ["s18", "sdbg"],

  order: {
    s18: ["18-1", "18-2", "18-3", "18-4", "18-5", "18-6"],
    sdbg: ["d1", "d2", "d3", "d4", "d5", "d6"]
  },

  lessons: {

    /* ===================== s18 项目实战 ===================== */
    "18-1": {
      min: 30,
      summary: [
        "动手前先写「用例清单」：正常两数一运算符、除零、非法运算符、输入字母而非数字、是否继续——清单就是验收标准，写不出用例说明需求还没想清楚。",
        "把需求拆成一条数据流：读入 → 校验 → 计算 → 输出，每一段只做一件事。函数边界就画在这四步之间，这就是最小粒度的「模块边界」。",
        "除零不是「加个 if 就完了」，它是输入契约的一部分：把判定集中成一个 validate/apply 函数并返回错误，界面层只负责把错误说出来，将来换成 GUI 或加历史记录都不用改算法。",
        "「继续吗 (y/n)」用 while 配一个读入的 char 实现：`std::cin >> again` 读到 'y' 才继续；注意 char 与字符串是两类比较，写成 `again == \"y\"` 直接编译失败。",
        "上限要命名而不是写死：`constexpr int MAX_ROUNDS = 3;` 既防死循环，也让「跑满 N 次自动退出」变成可被自动化验证的行为，而不是靠人守着。",
        "一个 .cpp 也能有模块：先按职责拆函数，再按文件拆目录。顺序反了会得到一堆互相包含的头文件——拆职责是免费的，拆文件不是。",
        "新手最容易翻车的是输入流：`cin >> x` 一旦失败，流进入 failbit 状态，之后所有读入都被跳过，程序看起来像死循环疯狂刷错误提示——必须 `cin.clear()` 加 `cin.ignore(...)` 把这一行的脏数据丢掉。",
        "衔接：本章前置是 s3 的输入输出、s4 的分支循环、s5 的函数与 s6 的字符串；s18 不再引入新语法，只考「能不能自己搭起来」，哪一节卡住就回哪一章。"
      ],
      summary_en: [
        "Write the case list before the code: valid operands, divide by zero, illegal operator, letters instead of numbers, continue or not — the list is the acceptance test, and an empty list means the requirement is still fuzzy.",
        "Split the requirement into one data flow: read, validate, compute, print. Each stage does exactly one job, and the function boundary sits between stages — that is module boundary at its smallest grain.",
        "Divide-by-zero is not just 'one more if'; it is part of the input contract. Centralise the decision in validate/apply and return an error, so the display layer only speaks it — a later GUI or history feature never touches the maths.",
        "The 'continue (y/n)' prompt is a while loop around one char read: keep going while cin >> again yields 'y'. Note that char and string are different comparisons — again == \"y\" simply does not compile.",
        "Name the limits instead of hard-coding them: constexpr int MAX_ROUNDS = 3; prevents an endless loop and turns 'it stops after N rounds' into something a script can verify, instead of something you watch by hand.",
        "A single .cpp can still have modules: split by responsibility into functions first, split by folder into files later. Reverse the order and you get headers that include each other — dividing duties is free, dividing files is not.",
        "The input stream is where beginners really fall: after a failed 'cin >> x' the stream stays in failbit and every later read is skipped, so the program looks like an infinite loop spewing errors. Clear it and ignore the rest of the line.",
        "Bridge: this chapter rests on s3 I/O, s4 control flow, s5 functions and s6 strings. s18 adds no new syntax — it only asks whether you can assemble them, so go straight back to the chapter where you stuck."
      ],
      code: `#include <iostream>
#include <limits>

// 校验与计算放在一层，界面放在另一层：算法函数里不出现 cout
double apply(double a, double b, char op, bool& bad) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': if (b == 0.0) { bad = true; return 0.0; }  // 除零是契约错误，怎么报由调用方决定
                  return a / b;
        default:  bad = true; return 0.0;                    // 非法运算符
    }
}

int main() {
    constexpr int MAX_ROUNDS = 3;        // 有上限才谈得上自动化验证
    char again = 'y';
    for (int round = 0; round < MAX_ROUNDS && again == 'y'; ++round) {
        double a = 0, b = 0;
        char op = 0;
        std::cout << "请输入 a 运算符 b：";
        if (!(std::cin >> a >> op >> b)) {          // 读入失败后流是坏的，必须先清理
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\\n');
            std::cout << "输入无效，本局跳过\\n";
            continue;
        }
        bool bad = false;
        double r = apply(a, b, op, bad);
        if (bad) std::cout << "这一组算不了\\n";
        else std::cout << "结果 = " << r << "\\n";
        std::cout << "继续吗 (y/n)：";
        std::cin >> again;
    }
    return 0;
}`,
      pit: "忘了清 failbit：`cin >> a` 读到一个字母之后，流永久处于失败状态，循环里每次读入都直接返回 false，程序变成一个只刷「输入无效」的死循环——代码逻辑看着完全正确，因为问题不在分支上，在流的状态上。",
      pit_en: "Forgetting to clear failbit: once 'cin >> a' hits a letter the stream stays failed forever, so every later read returns false and the loop becomes an 'invalid input' printer. The branches are all correct — the bug is in the stream state.",
      ex: {
        q: "为什么要把校验抽成一个函数，而不是在 main 里一路 if 判下去？",
        a: "因为错误判定会被复用多次（界面、测试、以后换 GUI），集中在一个函数里才能一次改对；散在 main 里的 if 每加一个功能就要重抄一遍，抄漏一次就是 bug。",
        q_en: "Why pull validation out of main instead of chaining ifs there?",
        a_en: "Because the same checks get reused by the UI, by tests and by a future GUI; in one function you fix them once, scattered in main you retype them per feature and a missed copy is a bug."
      }
    },

    "18-2": {
      min: 45,
      summary: [
        "数据建模先回答「一条记录长什么样」：`struct Student { long long id; std::string name; std::vector<double> scores; };`——多门课放进内层 vector，比给每门课写一个字段好扩展，加课不用动结构。",
        "先分三层再写代码：数据层（vector<Student> 与读写文件）、业务层（增删查、求平均、排序）、界面层（菜单与打印）。界面层不许出现算法、业务层不许出现 cout，这条线一画，后面加功能就不会到处改。",
        "「一次写完」是本项目最大的风险：正确节奏是录入+显示先跑通 → 加查询 → 加排序 → 加保存，每加一个功能就全量跑一遍。这就是最小可用版本不断长大的过程，也是唯一不会把自己绕进去的过程。",
        "删除之后所有下标都会变：`erase` 之后还拿「删之前记住的 i」去访问，读到的是别人。vector 的迭代器在插入/删除/扩容后一律失效，这是 s12/s14 讲过的规则在项目里最容易撞的一次。",
        "按平均分排序要用严格弱序的比较函数：写成 `>=` 会让 `std::sort` 变成未定义行为（可能崩溃也可能悄悄排错）；多键排序就在比较器里逐级 if，先比均分再比 id。",
        "求平均必须先判空：0 门课时 `scores.size() == 0`，除以 0 得到 NaN，屏幕上就是一个 `-nan`。这个「边界用例」比任何语法点都更能区分「写完了」和「写对了」。",
        "存档前先在屏幕上打印一遍内存里的数据：确认结构体本身是对的，再去怀疑写文件的代码——把「数据错」和「序列化错」分开验证，能省掉一半排查时间。",
        "多文件此刻还不是必须：一个文件里用清晰的分节注释同样能练分层。等函数多到三十个再拆，拆的时候按 18-6 的编译单元规则走，才不会一步踩两个新坑。"
      ],
      summary_en: [
        "Modelling starts with 'what does one record look like': struct Student { long long id; std::string name; vector<double> scores; } — courses live in the inner vector, so adding a subject never changes the struct.",
        "Cut three layers before typing code: data (vector<Student> plus file I/O), business (add/delete/query, averages, sorting), presentation (menu and printing). No maths in the presentation layer and no cout in the business layer — draw that line and later features stop needing edits everywhere.",
        "'Write it all at once' is this project's biggest risk. The working rhythm is add/show first, then query, then sort, then save, re-running everything after each step. That is how a minimal usable version grows, and the only rhythm that does not tangle you.",
        "Every index changes after a delete: using 'the i I remembered' after erase reads somebody else. Vector iterators are invalidated by insert, erase and reallocation — the s12/s14 rule meeting you head-on inside a project.",
        "Sorting by average needs a strict weak ordering: writing >= turns std::sort into undefined behaviour (it may crash or quietly mis-sort). For several keys, compare step by step inside the comparator: average first, then id.",
        "Always check for empty before averaging: with zero courses scores.size() == 0, dividing gives NaN and the screen shows -nan. That boundary case separates 'finished' from 'correct' better than any syntax detail.",
        "Print the in-memory records once before saving: prove the struct is right, then suspect the serialisation. Separating 'wrong data' from 'wrong file format' halves the debugging time.",
        "Multiple files are not mandatory yet: clear section comments in one file train the same layering. Split when functions pass thirty, and follow the translation-unit rules from 18-6 so you do not step into two new pits at once."
      ],
      code: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <numeric>

struct Student {
    long long id = 0;
    std::string name;
    std::vector<double> scores;
};

// 业务层：纯函数，不碰 cout 也不碰文件，所以能被测试直接调用
double average(const Student& s) {
    if (s.scores.empty()) return 0.0;      // 先判空：除以 0 会得到 nan
    return std::accumulate(s.scores.begin(), s.scores.end(), 0.0) / s.scores.size();
}

// 比较器必须是严格弱序：写 >= 就是未定义行为
bool byAvgDesc(const Student& a, const Student& b) { return average(a) > average(b); }

int main() {
    std::vector<Student> db{
        {1, "A", {80, 90}},
        {2, "B", {60, 70, 100}},
        {3, "C", {}}
    };
    std::sort(db.begin(), db.end(), byAvgDesc);
    for (const auto& s : db) std::cout << s.id << ' ' << s.name << " avg " << average(s) << "\\n";

    // 按名字删除：erase + remove_if，删完之后旧下标一律作废
    db.erase(std::remove_if(db.begin(), db.end(),
               [](const Student& s) { return s.name == "B"; }), db.end());
    std::cout << "left " << db.size() << "\\n";
    return 0;
}`,
      pit: "先按平均分排序、再用排序前记住的下标去改某条记录——sort 之后那个下标指向的是另一个人。后果不是崩溃而是「悄悄改错数据」，等你发现时已经存了三遍档；要么用 id 查找，要么排完序重新遍历。",
      pit_en: "Sort by average first, then edit the record at the index you memorised before sorting — after std::sort that index is a different student. It does not crash, it silently edits the wrong row, and you notice three saves later. Look up by id, or re-scan after sorting.",
      ex: {
        q: "为什么「录入 + 显示」必须先单独跑通，才允许加查询和排序？",
        a: "因为后面所有功能的正确性都建立在数据本身正确之上；先跑通最小闭环，出问题时你只需要怀疑新加的那一层，而不是同时怀疑数据、排序和文件三件事。",
        q_en: "Why must add-plus-display work before you are allowed to add query and sort?",
        a_en: "Because every later feature assumes the data itself is right. With a working minimum, a new failure points at the one layer you just added instead of at data, sorting and the file all at once."
      }
    },

    "18-3": {
      min: 45,
      summary: [
        "文件格式是这个项目真正的接口：一行一条记录、字段用固定分隔符（如 `|`）、并约定「新字段只往右追加」——这样老文件在新程序里仍然读得动，这叫向后兼容。",
        "字段内容会打架：名字里本来就可能含 `|`。要么定义转义规则（写成 `\\|`），要么换成分隔更少的键值对格式，要么改用「先读长度再读内容」；把「不可能出现」当成前提，就是 bug 的来源。",
        "读文件第一件事是判断打开成功：`std::ifstream fin(path); if (!fin) {...}`。注意「文件不存在」在通讯录里是正常状态（首次运行），不是错误——两者的区别是你要不要打印红字、要不要退出。",
        "载入与保存要写成一对对称函数 `load(path)` / `save(v, path)`：字段顺序、分隔符、转义规则只出现在这两处；一旦散落在五个地方，加字段就是五处同改。",
        "保存要防「写一半崩了」：先写 `contacts.txt.tmp`，全部成功后再 `std::rename` 覆盖正式文件。这个「临时文件 + 改名」的原子替换习惯，是数据库和编辑器都在用的同一招。",
        "换行是隐形杀手：Windows 写出的行末带 `\\r`，读进来如果不去掉，`name == \"张三\"` 永远不成立，查找功能诡异地全部失败。跨平台读文本后要显式去掉行尾回车。",
        "索引结构与展示结构可以分开：`std::map<std::string, Person>` 服务按名查找，`std::vector<Person>` 服务按录入顺序展示；两份数据要么由同一份真相即时构建，要么只留一份，别让它们各自演化。",
        "配置要外置：文件名、路径、分隔符、是否打印调试信息，从命令行参数或一个 config.txt 读，而不是写死在代码里——否则换一台机器就要重编一次。衔接：18-4 要给程序加上「玩得起来」的逻辑。"
      ],
      summary_en: [
        "The file format is this project's real interface: one record per line, a fixed delimiter such as '|', plus the rule 'new fields are appended on the right' — old files still load in new builds, which is what backward compatibility means.",
        "Fields can collide with the delimiter: a name may itself contain '|'. Either define escaping (write it as backslash-pipe), switch to key-value pairs with fewer separators, or read a length before the content. Assuming 'that never happens' is where the bug comes from.",
        "The first act of reading a file is checking that it opened: std::ifstream fin(path); if (!fin). Note that a missing file is a normal state for an address book (first run), not an error — the difference decides whether you print in red and whether you exit.",
        "Load and save must be a symmetric pair, load(path) and save(v, path), so field order, delimiter and escaping appear in exactly two places; scatter them over five and adding a field becomes a five-place edit.",
        "Saving must survive a crash halfway through: write contacts.txt.tmp first and only rename it over the real file once everything succeeded. Temp-file-plus-rename is the same atomic-swap trick databases and editors use.",
        "Newlines are the hidden killer: lines written on Windows end with a carriage return, and if you do not strip it, name equals the string you expect never becomes true and every lookup fails for no visible reason. Strip trailing CR when reading text cross-platform.",
        "Index structure and display structure may differ: map<string, Person> answers name lookups while vector<Person> preserves entry order. Either rebuild both from one source of truth or keep only one — never let two copies evolve separately.",
        "Move configuration out of the code: file name, path, delimiter and verbosity come from argv or a config.txt, not from literals, so a new machine does not force a rebuild. Bridge: 18-4 adds logic that makes the program playable."
      ],
      code: `#include <fstream>
#include <sstream>
#include <iostream>
#include <string>
#include <vector>
#include <cstdio>

struct Person { std::string name, phone; };

// 一行一条记录，字段用竖线分隔：以后加字段只往右追加，老文件仍然读得动
static std::string lineOf(const Person& p) {
    std::ostringstream os; os << p.name << '|' << p.phone; return os.str();
}

static bool parseInto(const std::string& line, Person& out) {
    std::istringstream is(line);
    return static_cast<bool>(std::getline(is, out.name, '|') && std::getline(is, out.phone, '|'));
}

// 载入：文件不存在属于「首次运行」，不是错误，返回空表即可
std::vector<Person> load(const std::string& path) {
    std::vector<Person> v;
    std::ifstream fin(path);
    if (!fin) { std::cout << "[info] no archive yet, start empty\\n"; return v; }
    std::string line;
    while (std::getline(fin, line)) {
        if (!line.empty() && line.back() == '\\r') line.pop_back();   // 去掉 Windows 换行残留的回车
        Person p;
        if (parseInto(line, p)) v.push_back(p);                       // 坏行跳过而不是整本读崩
    }
    return v;
}

// 保存：先写临时文件再改名，避免写一半崩溃把原存档毁掉
bool save(const std::vector<Person>& v, const std::string& path) {
    const std::string tmp = path + ".tmp";
    {
        std::ofstream fout(tmp);
        if (!fout) return false;
        for (const auto& p : v) fout << lineOf(p) << "\\n";
    }                                     // 花括号结束才真正关文件，改名才有意义
    return std::rename(tmp.c_str(), path.c_str()) == 0;
}

int main() {
    std::vector<Person> book = load("contacts.txt");
    book.push_back({"Zhang", "13800000000"});
    std::cout << (save(book, "contacts.txt") ? "saved\\n" : "save failed\\n");
    return 0;
}`,
      pit: "保存时直接 `ofstream fout(path)` 覆盖原文件：如果写到一半断电、崩溃或磁盘满，你得到的是一个残缺的存档，下次启动连老数据也读不回来了。先写 .tmp 再 rename，才守得住「至少不丢旧的」这条底线。",
      pit_en: "Overwriting in place with ofstream fout(path): a crash, power cut or full disk halfway leaves a truncated archive, and next start you lose the old data too. Write .tmp then rename, which is the minimum guarantee of never losing what you already had.",
      ex: {
        q: "为什么「文件不存在」不能一律当错误处理？",
        a: "因为对通讯录来说首次运行本来就没有存档，把它当错误会让新用户体验成「程序坏了」；正确做法是区分「不存在」（返回空表继续跑）与「存在但打不开/读不动」（才需要报错并停止写入）。",
        q_en: "Why is a missing file not simply an error?",
        a_en: "Because a first run legitimately has no archive, and treating that as an error makes newcomers think the program is broken. Distinguish 'absent' (start with an empty table) from 'present but unreadable' (that is the real error worth stopping for)."
      }
    },

    "18-4": {
      min: 60,
      summary: [
        "游戏主循环只有三段：读输入 → 更新状态 → 输出反馈。把这三段写清楚，代码就是状态机的直译；写不清楚的循环，永远在补丁式加 if。",
        "先画状态图再动手：START / PLAYING / WON / LOST / QUIT，每个状态标出「允许什么输入」和「转移到哪个状态」。图画得出来，代码基本是照抄；画不出来，说明你还没想清楚玩法。",
        "随机数用 `<random>`：`std::mt19937 rng(seed);` 配 `std::uniform_int_distribution<int> dist(1, 100);`。别再用 `rand() % 100`——取模会让小数区间出现得更多（分布有偏），而且 rand 的质量与线程安全性都没保证。",
        "种子决定可复现：开发期把 seed 固定（或从命令行/环境变量读），这样「第 3 局第 5 步崩了」能原样重放；上线才换成真随机。「随机」和「可测」的矛盾只能靠种子解决。",
        "输入清洗是游戏的护栏：把「读一个区间内的整数」封成 `readInt(lo, hi, out)`，失败自己 clear + ignore 并重问。少这一层，玩家敲一个字母就能让整局崩掉。",
        "把玩法参数变成数据而不是代码：答案区间、次数上限、难度倍率从配置读或集中成常量表。调平衡时改数值不改逻辑，才敢一天试二十次。",
        "「太大/太小」本质是二分反馈：让玩家在对数次数内收敛，也让测试可写——用一个策略函数模拟玩家（每次猜区间中点），一万局的胜率一秒跑完，这比手玩十局有效得多。",
        "剧情/多分支也一样要数据驱动：把「事件 → 下一状态」存进 map 或表里，写新剧情就只是加一条记录；把分支硬编在嵌套 if 里，加到第五层就没人敢改。衔接：18-5 会把这些项目重构成更好的形状。"
      ],
      summary_en: [
        "A game loop has exactly three phases: read input, update state, emit feedback. Write those three clearly and the code is a literal transcription of the state machine; write them vaguely and you keep patching ifs forever.",
        "Draw the state diagram before coding: START / PLAYING / WON / LOST / QUIT, annotating which inputs each state accepts and where it transitions. If the diagram exists, the code is transcription; if it does not, you have not designed the game yet.",
        "Use <random>: std::mt19937 rng(seed) with std::uniform_int_distribution<int> dist(1, 100). Drop rand() % 100 — the modulo biases smaller buckets, and rand offers no quality or thread-safety guarantee.",
        "The seed decides reproducibility: during development fix the seed (or read it from argv or the environment) so 'round 3, move 5 crashed' can be replayed exactly; only switch to true randomness at release. Randomness versus testability is settled by the seed alone.",
        "Input sanitising is the game's guardrail: wrap it as readInt(lo, hi, out) that clears and ignores the bad token and asks again. Without that layer one stray letter ends the session.",
        "Turn gameplay knobs into data, not code: range, attempt limit and difficulty multipliers live in a config or a constant table. Tuning balance then changes numbers, never logic, so you can afford twenty trials a day.",
        "'Too high / too low' is binary-search feedback: the player converges in logarithmic time, and tests become possible — a strategy function that always guesses the midpoint can play ten thousand rounds in a second, far better than ten rounds by hand.",
        "Branching storylines deserve the same data-driven treatment: store 'event -> next state' in a map, so writing new content appends one row, whereas nesting ifs five levels deep becomes something nobody dares to edit. Bridge: 18-5 reshapes these projects into better code."
      ],
      code: `#include <iostream>
#include <random>

enum class State { Playing, Won, Lost };   // 作用域枚举：名字不外泄，也不与别的枚举混用

// 把「读一个区间内的整数」封成函数：坏输入自己清理，调用方拿到的值一定合法
bool readInt(int lo, int hi, int& out) {
    if (!(std::cin >> out)) {
        std::cin.clear();
        std::cin.ignore(256, '\\n');        // 丢掉这一行的脏字符，否则下一轮继续失败
        return false;
    }
    return out >= lo && out <= hi;
}

int main() {
    unsigned seed = 2026;                  // 固定种子：这一局可以被完整重放
    std::mt19937 rng(seed);
    std::uniform_int_distribution<int> dist(1, 100);   // 取模会分布有偏，交给分布对象
    const int target = dist(rng);
    const int limit = 7;
    int tries = 0;
    State st = State::Playing;
    while (st == State::Playing && tries < limit) {
        int g = 0;
        std::cout << "猜一个 1~100 的整数：";
        if (!readInt(1, 100, g)) { std::cout << "范围不对或输入不是整数\\n"; continue; }
        ++tries;
        if (g == target) st = State::Won;
        else if (g > target) std::cout << "大了\\n";
        else std::cout << "小了\\n";
        if (st == State::Playing && tries == limit) st = State::Lost;
    }
    std::cout << (st == State::Won ? "WIN " : "LOSE ") << "answer=" << target << "\\n";
    return 0;
}`,
      pit: "`if (g == target) ... else if (g > target) ...` 写成 `else` 收尾，就把「输入非法」和「猜小了」合并成同一个分支——调试时你会发现提示永远是对的那一半。每个 else 都要问一遍：它到底覆盖了哪些情况。",
      pit_en: "Ending the chain with a bare else merges 'illegal input' and 'too low' into one branch, so during debugging the hint always looks right. Ask of every else: which cases am I actually covering?",
      ex: {
        q: "为什么开发阶段要用固定种子而不是每次都真随机？",
        a: "因为「复现」是一切调试的前提：固定种子后，同一串输入必然得到同一个答案，第 5 步的崩溃可以一步步重放；换成真随机，同一个 bug 可能永远撞不上第二次。",
        q_en: "Why use a fixed seed during development instead of real randomness every run?",
        a_en: "Because reproduction is the precondition of all debugging: with a fixed seed the same inputs give the same answer, so a crash at move 5 can be replayed step by step; with fresh randomness the same bug may never return."
      }
    },

    "18-5": {
      min: 30,
      summary: [
        "重构的定义要记准：不改变外部行为、只改变内部结构。它的判据是「同一组输入，改前改后输出完全一致」——所以顺序永远是先有可跑的用例，再动结构。",
        "坏味道清单能背下来就能用：一个函数超过一屏、同一段逻辑出现两次以上、加一个功能要改三处、名字必须靠注释才看得懂、参数超过四个、布尔参数控制函数做两件不同的事。",
        "小步走，每一步都能编译能运行：一次只做一个动作（提取一个函数、改一个名、收一个常量），立刻编译再跑一遍。攒成一小时的大改出了 bug 无法归因，只能整体回滚。",
        "先提常量、再提函数、最后提类：把散落的 30、\"contacts.txt\" 收进 constexpr 或配置，把 50 行的 main 拆成 setup/run/report；等出现「一组数据 + 围着它转的若干函数」再包成类，顺序颠倒会造出上帝类。",
        "消除重复的正确姿势是先证明等价：把疑似重复的三段并排放，逐行确认边界、错误处理、副作用真的一样，再抽函数；把两个略有差异的逻辑合成一个，bug 会在合并的那一行立刻出现。",
        "「能跑」和「好维护」的分界可以量化：一个没参与过的新同事，能不能在十分钟内改对一处而不必问作者。这条标准比缩进风格、比大括号位置都硬。",
        "别为重构停功能：每次 15~30 分钟顺手改一小块，提交信息写成 refactor: 说清「为什么值得动」，而不是攒一周做一次吓人的大提交。",
        "重构后要把「不变的东西」显式写下来：断言、注释里的前提、函数的输入契约。半年后接手的人需要知道哪些是刻意如此，哪些只是当时随手写成这样。衔接：18-6 把它做成能交付的工程。"
      ],
      summary_en: [
        "Get the definition right: refactoring changes internal structure without changing external behaviour, tested by 'same inputs, byte-identical outputs'. So the order is fixed — have runnable cases first, move structure second.",
        "A memorisable smell list: a function longer than a screen, the same logic appearing twice or more, one feature requiring three edits, a name that only makes sense with its comment, more than four parameters, a bool flag that makes one function do two jobs.",
        "Walk in steps small enough that each one builds and runs: extract one function, rename one thing, hoist one constant, then compile and run. An hour of bundled edits makes a bug unattributable, so all you can do is revert.",
        "Constants first, functions next, classes last: gather stray 30s and \"contacts.txt\" into constexpr or config, cut a 50-line main into setup/run/report, and only wrap a struct plus its functions into a class once that pair appears. The reverse order manufactures god classes.",
        "To remove duplication, first prove the copies are equivalent: lay the suspect blocks side by side and check boundaries, error handling and side effects line by line, then extract. Merging two slightly different logics shows up as a bug on the merge line.",
        "The line between 'runs' and 'maintainable' is measurable: can a colleague who never wrote it make a correct change in ten minutes without asking the author? That beats indentation preferences and brace placement as a standard.",
        "Never freeze features for refactoring: spend 15-30 minutes on one small area, and write the commit message starting with refactor: so that the why is recorded, instead of hoarding one terrifying weekly mega-commit.",
        "After refactoring, write down what must not change: assertions, commented preconditions, the input contract of each function. Whoever takes this in six months needs to know which choices were deliberate and which were improvised. Bridge: 18-6 turns it into a deliverable project."
      ],
      code: `#include <iostream>
#include <vector>

// 重构信号：这个函数一边算一边打印，两件事各自都会变
double averageOld(const std::vector<double>& v) {
    double sum = 0;
    for (double x : v) sum += x;
    double avg = v.empty() ? 0.0 : sum / v.size();
    std::cout << "avg " << avg << "\\n";    // 副作用藏在算子里：测试没法只验数值
    return avg;
}

constexpr int MAX_TRIES = 7;               // 魔法数字收进常量，一处改全局生效

// 拆分后：算的只算，打印的只打印，函数才有被复用和被测试的可能
double average(const std::vector<double>& v) {
    if (v.empty()) return 0.0;
    double sum = 0;
    for (double x : v) sum += x;
    return sum / v.size();
}

int main() {
    std::vector<double> scores{80, 90, 100};
    std::cout << "avg " << average(scores) << " limit " << MAX_TRIES << "\\n";
    return 0;
}`,
      pit: "在一行测试都没有的情况下「顺手重构」：你把重复的三段抽成一个函数，事后才发现其中一段多了一个边界判断。合并之后行为变了，而你分不清是抽取引入的还是原本就有的——正确顺序是先给旧行为写断言，再动结构。",
      pit_en: "Refactoring 'on the side' with zero tests: you extract three duplicated blocks and only then notice the third carried an extra boundary check. Behaviour changed and you can no longer tell whether extraction or history caused it. Write assertions against the old behaviour first, then move structure.",
      ex: {
        q: "为什么「加一个功能总要改三处」被算作坏味道？",
        a: "因为它说明同一件知识在代码里存了多份，只要有一次改漏就不一致，而且这类不一致通常不会报错，只会给出错误结果；正确做法是把这份知识收进一个地方（表、函数或配置），让改动只发生一次。",
        q_en: "Why does 'every new feature needs three edits' count as a smell?",
        a_en: "Because one piece of knowledge is stored in several places, so a single missed edit desynchronises them — silently, producing wrong results rather than errors. Put that knowledge in one table, function or config so a change happens once."
      }
    },

    "18-6": {
      title: "综合重构：把项目交付出去",
      title_en: "Synthesis: Shipping the Project",
      min: 30,
      target: "把一个单文件项目拆成多文件工程，配上 CMake 构建、README、提交记录与版本号，让陌生人在新机器上三条命令跑起来。",
      target_en: "Split a single-file project into a multi-file build with CMake, a README, a commit history and a version tag, so a stranger can run it with three commands on a fresh machine.",
      summary: [
        "多文件按职责切，不按行数切：一个 .h 声明一个类型或一组相关函数，定义放同名 .cpp。头文件里只放声明、inline 函数和模板——把普通函数定义写进头文件，三个 .cpp 包含它，链接期就会报重复定义。",
        "每个头文件开头写守卫：`#pragma once` 或传统 `#ifndef X_H / #define X_H / #endif`。如果出现 A 含 B、B 含 A 的循环包含，那是职责划分错了：应该往下抽出一个共同的第三个头文件，而不是靠前置声明硬撑。",
        "编译单元 = 一个 .cpp 加上它包含的全部头文件；编译器一次只看一个编译单元，跨文件的名字由链接器对接。所以「改了 .h 却只编了一个 .cpp」一定会出问题，也解释了为什么动一个公共头会引发全量重编。",
        "增量构建的全部价值是只重编受影响的目标文件：make/CMake 靠时间戳与依赖图判断。用外部构建目录（`cmake -B build`）把产物与源码分开，判定才稳定；把 .o 混在 src/ 里，天天全量重编还查不出原因。",
        "CMake 最小可用四行就够：`cmake_minimum_required(VERSION 3.16)`、`project(calc CXX)`、`set(CMAKE_CXX_STANDARD 17)`、`add_executable(calc src/main.cpp src/calc.cpp)`；需要多目标时再加 `add_library` 与 `target_link_libraries`，头文件目录用 `target_include_directories` 声明而不是在源码里写 `../include/` 相对路径。",
        "第三方库先问「能不能不用」：随机、字符串、日期、文件系统都能靠标准库解决时，就别引入依赖。确实要用时优先系统包管理器 / vcpkg / FetchContent，并把名字、版本范围和安装命令写进 README——今天省的一行配置，可能是明天别人「装不上」的交付事故。",
        "日志与配置从 printf 毕业：分级（trace/debug/info/warn/error）、带时间戳、级别可由环境变量或命令行一次性关掉；文件名、路径、阈值都从配置读，做到「换环境不重编」。日志怎么打，sdbg 的 d4 给了具体做法。",
        "交付物是四件而不是代码：README（是什么 / 怎么装 / 怎么跑 / 怎么测）、提交信息（feat: / fix: / refactor: 前缀 + 一句话说清为什么）、语义化版本号（不兼容改动升主版本）、一条能跑通的构建命令。自查：换台机器还能跑吗？警告清零了吗？有断言能证明没改坏吗？下一段（位运算与算法章）练的是把「跑通」升级成「算得快、算得对」。"
      ],
      summary_en: [
        "Split files by responsibility, not by line count: one header declares one type or one related group, and the definitions live in the matching .cpp. Headers carry declarations, inline functions and templates only — a plain function definition in a header pulled in by three .cpp files becomes a duplicate symbol at link time.",
        "Every header starts with a guard: '#pragma once', or the classic #ifndef / #define / #endif. If A includes B and B includes A, the split is wrong: factor a third header both depend on instead of forcing forward declarations to hold the cycle together.",
        "A translation unit is one .cpp plus every header it pulls in; the compiler sees one unit at a time and the linker matches names across them. That is why editing a .h without rebuilding its includers always bites, and why touching a shared header triggers a full rebuild.",
        "Incremental building exists for one reason: rebuild only the objects affected by your edit, decided by timestamps and the dependency graph in make/CMake. An external build directory (cmake -B build) keeps that judgement stable; scattering .o files into src/ means full rebuilds you cannot explain.",
        "Four lines of CMake cover a small project: cmake_minimum_required(VERSION 3.16), project(calc CXX), set(CMAKE_CXX_STANDARD 17), add_executable(calc src/main.cpp src/calc.cpp). Add add_library and target_link_libraries for multiple targets, and declare header dirs with target_include_directories instead of '../include/' paths in source.",
        "Ask 'can we skip this dependency' first: if the standard library already covers randomness, strings, dates and the filesystem, do not add one. When you truly need it, prefer the system package manager, vcpkg or FetchContent, and record name, version range and install command in the README — the config line saved today becomes someone else's 'cannot build' incident tomorrow.",
        "Graduate logging and configuration from printf: levels (trace/debug/info/warn/error), timestamps, and a switch controllable from the environment or argv; read file names, paths and thresholds from config so changing environment never forces a rebuild. Lesson d4 in sdbg shows exactly how to print.",
        "The deliverable is four artefacts, not the source: a README (what / install / run / test), commit messages (feat:, fix:, refactor: plus one sentence of why), a semantic version tag, and one build command that really works. Self-check: does it run on another machine? Are warnings at zero? Does any assertion prove nothing broke? The next block (bit tricks and algorithms) upgrades 'it runs' into 'it is fast and correct'."
      ],
      code: `// 目录结构：界面在 main.cpp，业务在 calc.cpp，声明在 calc.h
src/main.cpp
src/calc.cpp
include/calc.h

# CMakeLists.txt：四行就够一个小项目
cmake_minimum_required(VERSION 3.16)
project(calc CXX)
set(CMAKE_CXX_STANDARD 17)
add_executable(calc src/main.cpp src/calc.cpp)
target_include_directories(calc PRIVATE include)

# 外部构建：产物全在 build 目录里，删掉它等于彻底重来
cmake -B build
cmake --build build

# 交付四件套：能编、能测、README 写清命令、最后打一个版本标签
git commit -m "refactor: split the calc layer and let CMake own the build"
git tag v1.0.0`,
      pit: "新增一个 .cpp 却只改了源码、没改 CMakeLists（或反过来只在 IDE 里加了文件）：单文件测试一切正常，别人 clone 下来链接期直接 undefined reference。凡是「我这能跑、你那不能跑」，第一个要查的就是构建清单有没有进版本库。",
      pit_en: "Adding a .cpp to the source but not to CMakeLists (or adding it only inside the IDE): everything links on your machine and everyone who clones gets undefined reference. Whenever it works here but not there, the first thing to check is whether the build list itself is committed.",
      ex: {
        q: "为什么改了头文件，编译时间会突然变成长？",
        a: "因为头文件参与每一个包含它的编译单元，依赖跟踪会把这些单元全部标为过期；这正是「把实现细节从 .h 挪进 .cpp」能提速的原因——少暴露一点，就少重编一点。",
        q_en: "Why does editing a header suddenly make builds slow?",
        a_en: "Because a header participates in every translation unit that includes it, so dependency tracking marks them all stale. That is exactly why moving implementation detail from .h into .cpp speeds builds up: expose less, rebuild less."
      }
    },

    /* ===================== sdbg 调试入门 ===================== */
    "d1": {
      min: 12,
      summary: [
        "报错按三层读：第一段是位置（文件:行:列），第二段是「缺什么/冲突什么」的关键短语，第三段 note 常常直接给出修复建议；三段看完再动手，比盯着红色字母猜快得多。",
        "三条铁律：只修第一条 error、修完立刻重编、一次只改一处。后面几十条 error 多半是第一条的连锁——少一个分号、少一个右花括号，编译器会把整段语法都判歪。",
        "先分类再处理：编译错误（本文件语法或类型不自洽，带行号）与链接错误（undefined reference / multiple definition，通常没有行号）是两类问题；后者要查实现文件和构建清单，改语法纯属白费。",
        "警告要当 bug 处理：打开 `-Wall -Wextra` 之后，「未初始化」「有符号/无符号比较」「隐式窄化」这三类几乎必然对应真实缺陷；把警告清零的成本随代码存量指数上升，所以第一天就清零。",
        "模板报错看不懂是正常的：从最下面往上找第一条 `required from here`，那才是你的调用点；现代编译器（gcc 13+ / clang 新版本）已经有精简诊断，别把模板错误当「编译器坏了」。",
        "让报错更好读也是手段：`-fdiagnostics-color=always`、`-ftrack-macro-expansion`、MSVC 的 /W4；同一份代码在两个编译器上各过一遍，平台差异和未定义行为会提前现形。",
        "新手两大来源要认得：`'cout' was not declared in this scope`（含 did you mean 提示）是没声明或漏 include；`no matching function for call to` 是参数类型或个数不匹配，先看函数签名，不要先翻实现。",
        "衔接：读懂报错只是拿到入场券，本章后面五节处理「能编译但结果不对 / 直接崩」。前置是 s4 到 s8 的控制流、函数与结构体——读不懂报错，多半是那几章的类型还没通。"
      ],
      summary_en: [
        "Read a diagnostic in three layers: the position (file, line, column), the key phrase saying what is missing or conflicting, then the note lines that often contain the fix. Finish all three before touching code — much faster than guessing at red letters.",
        "Three iron rules: fix only the first error, rebuild immediately after that one fix, and change only one thing at a time. The next fifty errors are usually cascade damage from the first — one missing semicolon or brace makes the parser misread a whole region.",
        "Classify before acting: compile errors (this file is not self-consistent, they carry a line number) and link errors (undefined reference, multiple definition, usually no line) are different problems. For the latter you inspect the implementation and the build list; tweaking syntax wastes the evening.",
        "Treat warnings as bugs: with -Wall -Wextra on, uninitialised values, signed/unsigned comparisons and implicit narrowing almost always mark real defects. The cost of clearing warnings grows with the backlog, so get to zero on day one.",
        "Template errors are legitimately hard: scan upward from the bottom for the first 'required from here', which is your actual call site. Modern gcc 13+ and clang already compress the noise, so do not conclude the compiler is broken.",
        "Making diagnostics readable is itself a technique: -fdiagnostics-color=always, -ftrack-macro-expansion, MSVC /W4. Compiling the same code with two toolchains surfaces platform differences and undefined behaviour early.",
        "Two beginner sources dominate: \"'cout' was not declared in this scope\" (often with a 'did you mean') means a missing declaration or include; 'no matching function for call to' means argument type or count mismatch — read the signature before the body.",
        "Bridge: understanding errors is only the entry ticket; the next five lessons handle 'it compiles but is wrong or crashes'. Prerequisites are s4-s8 control flow, functions and structs — if the diagnostics still read as noise, that is where to go back."
      ],
      code: `// 读报错三层：位置(文件:行:列) -> 缺什么 -> note 给的修复建议
// 真实场景：只是少了一个分号，报错却落在下一行
#include <iostream>
int main() {
    int a = 1
    std::cout << a << "\\n";   // g++ 指到这里：expected ';' before 'std'
}
// 另一类长得很不一样：链接错误没有行号，只有对不上的名字
// /usr/bin/ld: undefined reference to 'add(int, int)'
// 所以先查实现文件与构建清单，改语法没有用
// 起手命令：警告全开，颜色打开
g++ -std=c++17 -Wall -Wextra -g main.cpp -o main`,
      pit: "把 warning 攒着不管：项目里堆到三百条之后，真正致命的那条（未初始化、越界的有符号/无符号比较）就再也看不见了。警告的边际价值随数量暴跌，所以「清零后再加 -Werror」比「以后再说」有效一百倍。",
      pit_en: "Deferring warnings: once the backlog reaches three hundred, the one that actually matters (uninitialised value, signed/unsigned comparison feeding an index) is invisible. Warnings decay with volume, so reaching zero and then adding -Werror beats 'later' by a hundred times.",
      ex: {
        q: "为什么编译器报的行号经常不是真正的出错行？",
        a: "因为语法分析是按规则推进的：漏了分号或花括号时，解析器要读到后面某个「说不通」的符号才发现冲突，于是把错误落在它察觉的位置；修第一条 error 后连锁报错成片消失，就是这个机制的证据。",
        q_en: "Why is the reported line often not the line that is actually wrong?",
        a_en: "Parsing advances by rules: with a missing semicolon or brace the parser only notices at some later token it cannot explain, so it blames where it woke up. The cascade of errors vanishing after one fix is the proof of that mechanism."
      }
    },

    "d2": {
      min: 13,
      summary: [
        "打断点之前先写下要验证的假设：「我猜 sum 在第 3 轮开始偏离」。没有假设的断点只是带着程序在代码里散步，走一圈什么也没确认。",
        "必须用 Debug 构建（`-g -O0`）：`-O2` 下变量被优化进寄存器或直接消失、语句被重排、函数被内联，断点会乱跳，你会认真怀疑自己的眼睛。逻辑问题和性能问题从来用两个构建。",
        "单步只有四个动作：Step Over 走下一行不进函数、Step Into 进函数、Step Out/Finish 跑完当前函数回到调用处、Continue 冲到下一个断点。四个动作加「看调用栈」就覆盖了九成的调试需求。",
        "监视窗口要放表达式而不是只放变量：`v.size()`、`i < n`、`this->name`、`a > b ? 1 : 0`。把可疑条件钉在那里，每走一步就看得到它翻不翻转，比反复手动 print 快得多。",
        "条件断点解决「第 3 次循环」「某个 id」这类问题：gdb 写 `break demo.cpp:42 if i == 3`，VS 里右键断点填条件；偶发问题用「命中次数」断点，别把 continue 按一百次。",
        "数据断点（watchpoint）是查「谁改了我的值」的唯一利器：gdb 里 `watch total` 在该变量被写入的瞬间停下，哪怕写它的是你根本没怀疑过的函数。代价是全局监视很慢，只 watch 一个变量。",
        "崩溃之后再进调试器往往更快：core dump 或 VS 的「中断时」→ `bt` 看栈回溯，`frame 3` 切到调用层，`print` 读当时的局部变量。崩溃现场是一个被冻结的、绝对真实的案发现场。",
        "把调试器命令练成手指记忆（`b / run / c / n / s / finish / bt / p`），比背 GUI 菜单更值：SSH 到服务器、容器里、没有图形界面时，只有命令能救你。衔接：d3 处理栈回溯指到崩溃点之后「为什么崩」。"
      ],
      summary_en: [
        "Write down the hypothesis before setting the breakpoint: 'I think sum drifts from round 3.' A breakpoint without a hypothesis just walks the program through the code and confirms nothing.",
        "Always use a debug build (-g -O0): under -O2 variables live in registers or vanish, statements get reordered and functions inlined, breakpoints jump around, and you start doubting your own eyes. Logic bugs and performance bugs have always needed two different builds.",
        "Stepping has four verbs: Step Over (next line, do not enter), Step Into (enter), Step Out/Finish (run to the return), Continue (next breakpoint). Add 'look at the call stack' and you cover ninety percent of real debugging.",
        "Put expressions in the watch window, not just variables: v.size(), i < n, this->name, a > b ? 1 : 0. Pin the suspicious condition there and watch it flip as you step — far quicker than re-running print after print.",
        "Conditional breakpoints handle 'third iteration' and 'that one id': in gdb 'break demo.cpp:42 if i == 3', in Visual Studio right-click the breakpoint and fill in the condition. For rare hits use a hit-count breakpoint instead of pressing continue a hundred times.",
        "A watchpoint is the only real answer to 'who changed my value': gdb's 'watch total' stops the instant it is written, even by a function you never suspected. Global watchpoints are slow, so watch exactly one variable.",
        "Entering the debugger after the crash is often faster: a core dump or the Visual Studio break gives you 'bt' for the stack trace, 'frame 3' to move up, 'print' to read locals. A crash scene is a frozen, perfectly honest crime scene.",
        "Drill the debugger verbs into muscle memory (b, run, c, n, s, finish, bt, p) rather than menu paths: over SSH, inside a container, with no GUI, only the commands rescue you. Bridge: d3 asks why it crashed once the trace says where."
      ],
      code: `// 先编出带调试信息的版本，再进 gdb 走一遍
g++ -std=c++17 -g -O0 demo.cpp -o demo
gdb ./demo
// 崩了就直接看现场：bt 列出调用栈，frame 切到出错那一层
(gdb) run
(gdb) bt
(gdb) frame 2
(gdb) print i
// 只在第三次命中时停：条件断点，省掉手动按一百次 continue
(gdb) break demo.cpp:42 if i == 3
// 谁改了这个变量：数据断点在写入的瞬间停下
(gdb) watch total
(gdb) continue
// 图形界面里对应的是「调用堆栈」窗口与「监视」表达式，快捷键 F10/F11 即 Over/Into`,
      pit: "用 Release（-O2）构建去单步调试：变量显示 <optimized out>、断点跳到不相干的行、Step Into 直接穿过函数——你会花一小时调查一个根本不存在的「编译器 bug」。逻辑问题永远先用 Debug 构建复现。",
      pit_en: "Debugging a Release (-O2) build: variables report <optimized out>, breakpoints land on unrelated lines, Step Into walks straight through a call — and you spend an hour investigating a compiler bug that does not exist. Reproduce logic bugs on a debug build, always.",
      ex: {
        q: "为什么「谁把一个正常值改成了 0」这类 bug 用断点特别难查，而 watch 一下就有结果？",
        a: "因为普通断点按「位置」触发，而你并不知道位置，只能一个个猜；数据断点按「对某块内存的写操作」触发，程序在改它的那一条指令上停下，等于让 bug 自己报名。",
        q_en: "Why are 'who zeroed this value' bugs so hard with breakpoints but trivial with watch?",
        a_en: "A normal breakpoint triggers on a location, and you do not know the location, so you guess. A watchpoint triggers on a write to that memory and stops on the exact instruction doing it, which makes the bug announce itself."
      }
    },

    "d3": {
      min: 14,
      summary: [
        "崩溃信号会指方向：SIGSEGV 是访问了不该访问的地址（空指针、野指针、越界、栈溢出）；SIGABRT 是库主动中止（未捕获异常，或 glibc 检测到 double free 与堆元数据被破坏）；Linux 退出码 139 = 128 + 11，先记住这两个数。",
        "空指针几乎立刻崩，越界却常常「跑得好好的」：越界写落在同一块空闲内存里，程序继续运行但数据已损坏，症状可能几百毫秒之后才出现。所谓「偶发 bug」，第一嫌疑人就是未定义行为。",
        "三类内存错误各有定位法：越界看「下标 vs size」并在调试版用 at()；悬空看生命周期（返回局部变量的引用/指针、erase 或 push_back 之后继续用迭代器、c_str() 在对象析构后）；double free 看所有权（同一指针被 delete 两次，或浅拷贝让两个对象各 delete 一次）。",
        "ASan 是拿到的第一手证据：`-fsanitize=address -fno-omit-frame-pointer -g` 之后，越界在发生的那一刻就报出「读/写了几字节、地址属于哪一次分配」，并附上分配栈与释放栈两行；它把「现象」变成了「现场」。",
        "Valgrind 的思路不同：它模拟 CPU 检查每一次内存访问和未初始化读，因此不需要重新编译，但慢 20~50 倍。它擅长查泄漏（--leak-check=full）和只在真实数据上才走到的路径，和 ASan 是互补而不是替代。",
        "UBSan（`-fsanitize=undefined`）专抓另一类：有符号整数溢出、空指针解引用、越界（部分）、错误对齐、坏的下标转换；和 ASan 一起开 `-fsanitize=address,undefined`，但只用于测试构建，别带进发布。",
        "栈溢出也是内存问题：递归没有出口、在栈上开几 MB 的局部数组都会崩，症状是没有 malloc 参与的 SIGSEGV，而 `bt` 里同一个函数出现上百层——看到这种「整齐的重复栈帧」，直接去查递归终止条件。",
        "修内存错误的正确层次是换所有权模型，而不是补一个判空：同一处反复出问题，说明裸 new/delete 已经撑不住，改用 vector、string、unique_ptr 才是根治。衔接：d4 处理「不崩但值不对」这一大类。"
      ],
      summary_en: [
        "Signals point you somewhere: SIGSEGV means you touched an address you should not (null, wild pointer, out of bounds, stack overflow); SIGABRT means the library stopped you on purpose (uncaught exception, or glibc noticing a double free and corrupted heap metadata). Linux exit code 139 = 128 + 11 — memorise those two numbers.",
        "A null dereference crashes immediately, an out-of-bounds write often does not: it lands in spare memory nearby, the program keeps running on corrupted data, and the symptom surfaces hundreds of milliseconds later. 'Heisenbugs' usually start as undefined behaviour.",
        "Each memory class has its own locator: for bounds, compare index against size and use at() in debug builds; for dangling, look at lifetimes (returning a reference to a local, using an iterator after erase or push_back, keeping c_str() past destruction); for double free, look at ownership (delete twice, or a shallow copy letting two objects free one buffer).",
        "ASan gives you first-hand evidence: with -fsanitize=address -fno-omit-frame-pointer -g, an out-of-bounds access reports the exact byte count, which allocation the address belonged to, and both allocation and deallocation stacks. It converts a symptom into a crime scene.",
        "Valgrind takes a different route: it emulates the CPU and checks every access and every uninitialised read, so no rebuild is needed, but it costs 20-50x speed. It excels at leaks (--leak-check=full) and paths only real data reaches — a complement to ASan, not a replacement.",
        "UBSan (-fsanitize=undefined) catches the other family: signed overflow, null dereference, some bounds errors, misalignment and bad index casts. Combine it as -fsanitize=address,undefined, but keep it in test builds and never ship it.",
        "Stack overflow is a memory problem too: recursion without a base case, or a multi-megabyte local array, kills you with a SIGSEGV that involved no malloc, and bt shows the same frame a hundred times. That tidy repetition means: go check the termination condition.",
        "Fix memory bugs at the ownership layer rather than by adding one more null check: if the same place keeps failing, raw new/delete has stopped scaling, and vector, string and unique_ptr are the cure. Bridge: d4 covers the huge class of 'it does not crash, it is just wrong'."
      ],
      code: `#include <iostream>
#include <vector>

// 用这条命令编，三个开关缺一不可
// g++ -std=c++17 -g -fsanitize=address,undefined -fno-omit-frame-pointer bug.cpp -o bug
int main() {
    std::vector<int> v(5, 0);
    int i = 5;                             // 合法下标是 0 到 4，这里正好越过去
    // 打开下一行：ASan 报 heap-buffer-overflow 并给出行号
    // v[i] = 1;
    int* p = new int(42);
    delete p;
    // 打开下一行：use-after-free，连在哪里释放一起打印
    // *p = 7;
    int* q = p;                            // 浅拷贝留下的悬空指针，此刻谁都不该 delete
    // 打开下一行：double free，通常是 abort 而不是 segfault
    // delete q;
    std::cout << v.size() << i << "\\n";
    return 0;
}`,
      pit: "只修「崩溃那一行」：栈回溯指向读取处，你就补了个判空，于是崩溃变成静默的错误结果。ASan 打印的分配栈和释放栈里，真正错的是那次释放（或那次越界写），读取只是受害者——两行栈要一起读，找的是所有权设计错误。",
      pit_en: "Fixing only the crashing line: the trace points at a read, you add a null check, and the crash becomes a silently wrong answer. In ASan's allocation and deallocation stacks, the guilty party is the free (or the earlier out-of-bounds write); the read is only the victim. Read both stacks together and look for the ownership mistake.",
      ex: {
        q: "为什么越界访问经常「这次没崩」，而它仍然是最危险的错误？",
        a: "因为越界写的地址是否可读取决于当时内存的布局，多数时候它落在同一块分配的空闲区，程序照常运行；真正的问题是数据被悄悄改坏，症状延后出现，而且换编译器、换优化级别、换机器后行为又变了。",
        q_en: "Why does an out-of-bounds access so often not crash, and why is it still the worst error?",
        a_en: "Whether the address is writable depends on the memory layout at that moment, and usually it lands in spare space in the same allocation, so execution continues. The real damage is silent data corruption whose symptom appears later — and which changes again with compiler, optimisation level and machine."
      }
    },

    "d4": {
      min: 12,
      summary: [
        "打印调试不是低级手段，而是原始手段：它便宜、哪里都能加、留下的是「历史序列」而不是「当前快照」，还能在没有调试器的生产机和嵌入式设备上工作。",
        "它同时有四个局限，认清才不会滥用：改代码要重编、多线程下打印本身改变时序（一加打印就好了，那是 Heisenbug）、刷屏之后看不出重点、临时打印会漏删并污染正式输出。",
        "一条有效的打印有三要素：位置（哪个函数哪一行）、值（关键变量）、期望（`sum=123 expect 120`）。把实际与期望并排写出来，眼睛就不用做比较，看十行也不容易错。",
        "用开关控制而不是删代码：`#ifdef DEBUG` 包一层，或一个运行期的 verbose 标志。删掉的打印会随代码一起消失，而你下次复现时需要它还在原来的位置。",
        "调试信息天生该走 `std::cerr`：它不被 stdout 的重定向带走，也不参与管道拼接；`cerr` 未缓冲，崩在下一行时你那句临终遗言还留得下。",
        "正式项目用分级日志：trace/debug/info/warn/error 五级 + 时间戳 + 线程 id + 模块名，级别由环境变量或命令行一次性决定。有级别的日志让你可以在生产上只留 info，出问题时临时调到 debug。",
        "刷新是打印调试的隐形坑：`cout` 是有缓冲的，程序崩在下一行时你可能整句都没写出去。`std::endl`、`std::flush` 或 `setvbuf(stdout, nullptr, _IONBF, 0)` 才能保证「最后一句一定在」。",
        "别把敏感信息写进日志（口令、令牌、完整手机号、身份证），也别在循环里打 trace 再靠重定向救——日志体积和噪声都是成本。衔接：d5 处理更根本的问题，怎么最快缩小到那一行。"
      ],
      summary_en: [
        "Print debugging is not the junior technique, it is the primitive one: cheap, available everywhere, it leaves a history sequence instead of one snapshot, and it works in production or on embedded hardware where no debugger exists.",
        "Know its four limits so you do not over-use it: every change needs a rebuild, in multithreaded code printing itself shifts timing (if adding a print makes it vanish, you have a Heisenbug), a wall of text hides the point, and leftover prints pollute real output.",
        "An effective print carries three things: position (which function, which line), value, and expectation (sum=123 expect 120). Putting actual beside expected means your eyes do no arithmetic and you can read ten lines without fooling yourself.",
        "Gate it with a switch instead of deleting it: wrap in #ifdef DEBUG, or keep a runtime verbose flag. A deleted print disappears with the code, and the next reproduction needs it back exactly where it was.",
        "Debug output belongs on std::cerr: it is not swept away by stdout redirection, and being unbuffered it still lands when the program dies on the next line.",
        "Real projects use levelled logs: trace/debug/info/warn/error plus timestamp, thread id and module name, with the level decided once by environment variable or argv. Levels let you ship at info in production and bump to debug while an incident is open.",
        "Flushing is the hidden trap: cout is buffered, so a crash on the next line can lose the whole sentence. std::endl, std::flush or setvbuf with no buffering guarantee that your last words survive.",
        "Never log secrets (passwords, tokens, full phone numbers, ID numbers), and never print trace inside a hot loop and rescue it with redirection — log volume and noise are real costs. Bridge: d5 tackles the deeper question of narrowing to that line fast."
      ],
      code: `#include <iostream>
#include <chrono>

// 三个级别一个开关：交付时把 VERBOSE 关掉，代码一行都不用删
#define VERBOSE 1

void logf(const char* level, const char* msg) {
    long long t = std::chrono::steady_clock::now().time_since_epoch().count();
    std::cerr << "[" << level << "] t=" << t / 1000000 << "ms " << msg << "\\n";   // 走 cerr：不被重定向带走
}

int main() {
    logf("INFO", "start");
#if VERBOSE
    logf("DEBUG", "before loop");          // 临时诊断放在条件编译里
#endif
    int sum = 0;
    for (int i = 0; i < 3; ++i) { sum += i; logf("TRACE", "one iteration"); }
    std::cout << "sum=" << sum << " expect 3\\n";   // 实际与期望并排，眼睛不用做减法
    return 0;
}`,
      pit: "调试打印忘了关就上线：一行循环里打三条 trace，日志一天写出 2GB，磁盘满在凌晨三点，而它看起来完全不像 C++ 的 bug。用宏或级别把开关做成编译期/启动期的决定，而不是靠自觉删代码。",
      pit_en: "Shipping with debug prints still on: three traces inside a loop write 2GB of log a day, the disk fills at 3am, and it looks nothing like a C++ bug. Make the switch a compile-time or start-up decision via a macro or level, not a promise to delete the lines later.",
      ex: {
        q: "为什么「加上打印就好了、去掉就复现」这种现象在多线程里特别常见？",
        a: "因为打印要抢锁、写缓冲区并引入可观的耗时，它改变了线程之间的相对时序，把原本只有几十纳秒的竞争窗口拉大或拉小；这类现象叫 Heisenbug，正确做法是改用日志级别、加同步或用线程 sanitizer，而不是反复观察打印版。",
        q_en: "Why does 'it works when the print is there' happen so often in multithreaded code?",
        a_en: "Printing takes locks, fills buffers and costs real microseconds, so it changes the relative timing of threads and widens or shrinks a race window of a few dozen nanoseconds. That is a Heisenbug: fix it with log levels, explicit synchronisation or a thread sanitizer rather than by watching the printed build."
      }
    },

    "d5": {
      min: 13,
      summary: [
        "第一步永远是复现：拿不到稳定复现的 bug 有八成修不好。先固定随机种子、保存输入数据、记下编译器与构建参数；没有复现的修复不叫修复，叫许愿。",
        "最小化复现（MCVE）是最被低估的技能：把 500 行删到 30 行、把 1GB 数据换成三条记录，每删一处就跑一次，删不动的地方就是根因。它顺带是一份能贴给别人看的提问，别人不用猜就能答。",
        "二分有三种用法：注释掉一半代码看问题在哪半边（改一处跑一次）；对输入做二分（一半数据还能复现吗）；对历史做二分，`git bisect` 在提交图上自动跳中间版本，两百个提交约八次收敛。",
        "「假设 → 验证」才是调试的正道：动手前写下「我认为是 X，因为 Y，验证方法是 Z」，然后做那个能区分 X 与非 X 的最小实验（一行断言、一次条件断点、一次 ASan 运行）。被证伪的假设同样是进展。",
        "一次只改一处，改完立刻验证。同时改三处然后「哎好了」是最坏的结果：你不知道哪一处起了作用，也不知道另外两处是不是新埋的 bug，下次回归无法解释。",
        "回滚是合法手段而不是失败：改坏了就 `git stash` / `git checkout --` 回到上一个能跑的点。觉得「已经改了这么多舍不得丢」，是调试中最贵的沉没成本。",
        "橡皮鸭讲解（rubber duck）不要钱：逐行向外行解释这段代码在干什么，脑内的「我以为」被迫变成句子，与现实的差距自己就浮出来——大量 bug 是在说出口的那一秒想通的。",
        "一份可复现的 bug 报告包含六件：现象、环境（编译器/版本/系统/构建参数）、最小步骤、期望 vs 实际、已排除项、日志或栈回溯。写出这六件，多半不用问别人；问出去，别人也不用再问你第一轮。"
      ],
      summary_en: [
        "Step one is always reproduction: eight out of ten bugs that will not reproduce stay unfixed. Fix the seed, save the input, record compiler and flags first. A repair without reproduction is not a fix, it is a wish.",
        "Minimal reproduction (MCVE) is the most underrated skill: shrink 500 lines to 30 and 1GB of data to three records, re-running after every cut; what you cannot cut is the cause. It doubles as a question other people can answer without guessing.",
        "Bisection has three shapes: comment out half the code and see which half holds the bug (one change, one run); bisect the input (does half the data still reproduce it); bisect history — git bisect hops to the middle commit and converges on 200 commits in about eight steps.",
        "Hypothesis then verification is the real path: before touching anything, write 'I believe it is X, because Y, and Z will distinguish them', then run the smallest experiment that separates X from not-X (one assertion, one conditional breakpoint, one ASan run). A falsified hypothesis is still progress.",
        "Change one thing and verify it immediately. Editing three things and getting 'oh, it works' is the worst outcome: you never learn which edit mattered, and the other two are untracked bets against the next regression.",
        "Rolling back is a legitimate move, not a defeat: on a bad edit, git stash or git checkout -- returns you to the last working point. 'I already changed so much, I cannot bear to lose it' is the most expensive sunk cost in debugging.",
        "Rubber-duck explanation is free: narrate the code line by line to a layperson, and the private 'I assume' becomes a public sentence where the gap shows itself — plenty of bugs are understood in the very second they are spoken aloud.",
        "A reproducible bug report has six parts: symptom, environment (compiler, version, OS, build flags), minimal steps, expected versus actual, what has already been ruled out, and the log or stack trace. Writing them often solves the bug alone; posting them spares you the first round of clarifying questions."
      ],
      code: `# 现象：同样的输入，-O2 结果错、-O0 正常，怀疑某个提交引入了问题
# 目标：在上百个提交里定位到那一个
git bisect start
git bisect bad
git bisect good v1.0.0
# 上面两条：bad 指当前提交，good 指当时还正确的标签
# 之后二分自动切到中间提交，你只回答 good 或 bad，约 log2(N) 次收敛
make && ./app --selftest
git bisect good
# 找到之后先别改代码：单独 checkout 那条提交，复现一次并记下最小输入
git bisect reset
# 提问或写报告前，把仓库和输入目录打包，这才是别人能跑起来的复现件`,
      pit: "跳过复现直接读代码找 bug：你在两百行里凭印象改了三处，结果原问题还在，还多了两个新问题的症状互相干扰。调试的第一步不是「看代码」，是「拿到一个稳定复现的入口」，这一步省下的是后面所有小时。",
      pit_en: "Skipping reproduction and hunting by eye: you change three things across two hundred lines from feel, the original bug survives, and now two new symptoms interfere with it. The first step is not 'read the code' but 'get a reliably reproducible entry point' — that hour buys back all the others.",
      ex: {
        q: "为什么 git bisect 往往比人肉翻 diff 更快找到引入 bug 的提交？",
        a: "因为它把「线性回忆」变成「对数查找」：两百个提交按顺序看是一百次判断，二分只需要 log2(200) 约八次；而且每次判断都建立在你亲手跑过的测试上，不依赖任何人对改动的记忆是否准确。",
        q_en: "Why does git bisect usually beat reading diffs by hand?",
        a_en: "Because it turns linear recollection into logarithmic search: 200 commits scanned in order is a hundred judgements, bisect needs about log2(200), so eight — and each verdict comes from a test you actually ran, not from someone's memory of a change."
      }
    },

    "d6": {
      title: "综合重构：一套可复用的排错流程",
      title_en: "Synthesis: A Reusable Debugging Workflow",
      min: 14,
      target: "面对任意 bug，能按「复现 → 定位 → 假设 → 修复 → 回归」五步走完全程，并留下一份可复现报告和一条防复发的测试。",
      target_en: "For any bug, walk the five steps reproduce, locate, hypothesise, fix, regress — and leave behind a reproducible report plus one test that prevents recurrence.",
      summary: [
        "第 0 步是复现：稳定复现之前先造复现——固定随机种子、把输入存成文件、临时加一条断言、打开最详细的日志。拿到入口之后，后面四步才有意义。",
        "第 1 步定位有现成的三类证据源：报错与栈（d1 的读法、d2 的 bt）、值（d2 的监视表达式、d4 的打印）、范围（d5 的三种二分）。顺序是先读现成证据，再上工具，最后才怀疑编译器。",
        "第 2 步写下假设并主动证伪：「根因是 erase 之后迭代器失效，因为崩溃总在删除那条之后」，然后设计一个能区分它的实验（换下标循环、加一次断言、跑一遍 ASan）。假设被打脸也是进展，因为你排除了一类可能。",
        "第 3 步修在根因层而不是症状层：在崩溃点补一个判空是止痛，把所有权换成 vector 与 unique_ptr 是治病。一个补丁同时解释不了两个症状时，说明这里还有第二个 bug，别硬凑。",
        "第 4 步回归：为这个 bug 写一条最小测试（一句 assert 也算），并跑一遍全量测试加一次 sanitizer 构建。「修好了」的定义是复发会被自动发现，而不是我今天手工看着对了。",
        "把流程做成实物：一张 bug 报告模板（现象/环境/最小步骤/期望实际/已排除/根因/防复发）、一条固定的检查构建命令 `-std=c++17 -Wall -Wextra -g -fsanitize=address,undefined`、一页常用 gdb 命令卡。写在纸上才会被遵守。",
        "设时间盒并求助：卡住 45 分钟就把「已经排除了什么」写下来去问人。排除法清单既节省别人的时间，也常常在写的过程中自己想通——写清楚问题的动作本身就是一种调试。",
        "本章收口自查：拿到一个陌生 bug，你能否在五分钟内说出「复现步骤是什么、我现在怀疑哪一段、下一个实验做什么」？能，就已经超过大部分只会改代码的人。下一章 s12 讲 STL 顺序容器，那里一半的 bug 来自迭代器失效与容量变化，正好拿这五步去练。"
      ],
      summary_en: [
        "Step zero is reproduction: before it is stable, manufacture it — fix the seed, save the input to a file, add one temporary assertion, turn the log level up. The other four steps only mean something once you have an entry point.",
        "Step one has three ready evidence sources: diagnostics and traces (how to read them in d1, bt in d2), values (watch expressions in d2, prints in d4), and scope (the three bisections in d5). Read existing evidence first, then reach for tools, and suspect the compiler last.",
        "Step two writes the hypothesis down and tries hard to falsify it: 'the cause is an invalidated iterator after erase, because the crash always follows the delete', then design the experiment that separates it from its rivals (switch to index loops, add an assertion, run ASan once). A falsified hypothesis still removes a whole category.",
        "Step three fixes at the root layer, not the symptom layer: a null check at the crash site is painkillers, moving ownership into vector and unique_ptr is treatment. When one patch cannot explain two symptoms, there is a second bug — do not force it.",
        "Step four regresses: write one minimal test for this exact bug (a single assert counts), then run the full suite once with a sanitizer build. 'Fixed' means a recurrence is caught automatically, not that it looked fine to me today.",
        "Turn the workflow into artefacts: a bug report template (symptom, environment, minimal steps, expected versus actual, ruled out, root cause, prevention), one frozen inspection command with -std=c++17 -Wall -Wextra -g -fsanitize=address,undefined, and a one-page gdb verb card. Written down, it gets followed.",
        "Set a time box and ask for help: after forty-five stuck minutes, write out what you have already ruled out and go ask. A ruled-out list respects other people's time and very often solves the problem while you are still writing it — stating a problem clearly is itself a debugging act.",
        "Closing self-check: given an unfamiliar bug, can you say within five minutes what the reproduction steps are, which region you currently suspect, and what the next experiment will be? If yes, you are already ahead of most people who only edit code. Next up, s12 on STL sequence containers, where half the bugs come from iterator invalidation and capacity changes — perfect material for these five steps."
      ],
      code: `#include <iostream>
#include <vector>

// 五步流程最后一步的落地件：一个会响的断言，把「我以为」变成能跑的测试
bool failed = false;

void check(bool ok, const char* what) {
    if (!ok) { std::cerr << "FAIL: " << what << "\\n"; failed = true; }
}

int sum_of(const std::vector<int>& v) {
    int s = 0;
    for (int x : v) s += x;
    return s;
}

int main() {
    check(sum_of({}) == 0,       "empty input: the usual hiding place of bugs");
    check(sum_of({1, 2, 3}) == 6, "happy path");
    check(sum_of({-1, 1}) == 0,   "cancellation with negatives");
    if (failed) return 1;         // 非 0 退出码：脚本与 CI 才知道真的失败了
    std::cout << "all checks passed\\n";
    return 0;
}`,
      pit: "修完就关单，不留防复发的测试：同一个 bug 在下一次重构时原样回来，而且因为没人记得它长什么样，这次花了双倍时间。流程的第 4 步（回归）才是真正的收口，缺了它，前面四步只是止痛。",
      pit_en: "Closing the ticket without a regression test: the same bug returns at the next refactor, and since nobody remembers what it looked like, it costs double this time. Step four is the actual finish line; without it the first four steps were only pain relief.",
      ex: {
        q: "为什么「复现」要排在「读代码」之前，而不是反过来？",
        a: "因为只有稳定复现能给你廉价的判断手段：每次改完跑一下就知道好了没有。没有复现时你无法验证任何假设，读代码变成在两百个可能里凭印象挑选，而这正是效率最低的做法。",
        q_en: "Why does reproduction come before reading the code, and not the other way round?",
        a_en: "Because only a stable reproduction gives you a cheap oracle: run it after each edit and you know. Without one you cannot test any hypothesis, so reading code becomes picking favourites among two hundred possibilities, which is the slowest possible strategy."
      }
    }
  },

  /* ---------- 题库：对准深化后新增的知识点，每章 4 题 ---------- */
  quizAdd: {
    s18: [
      {
        q: "把一个「非 inline 的普通函数定义」写进头文件，而这个头文件被三个 .cpp 包含，结果是？",
        o: ["三份定义各编各的，链接时报重复定义", "编译器只保留第一份，其余自动忽略", "编译期就报重复定义，链接阶段无关", "运行到才调用哪份算哪份"],
        a: 0,
        why: "每个 .cpp 连同它包含的头文件构成一个编译单元，函数定义被复制了三份，链接器无法选择，于是报 multiple definition。要么定义放 .cpp，要么标 inline 或做成模板。",
        q_en: "A non-inline function definition sits in a header that three .cpp files include. What happens?",
        o_en: ["Each unit compiles its own copy and the linker reports a duplicate definition", "The compiler keeps the first copy and ignores the rest", "The duplicate is reported at compile time, so linking is unaffected", "Whichever copy is reached at run time is used"],
        why_en: "Each .cpp plus its headers is one translation unit, so the body exists three times and the linker cannot choose — multiple definition. Move it into a .cpp, or make it inline or a template."
      },
      {
        q: "关于「先写用例清单再动手」，下面哪个说法最站得住？",
        o: ["用例清单只是形式，熟练的人可以跳过", "写不出用例，通常说明需求本身还没想清楚", "有单元测试之后就再也不需要用例清单", "用例清单只能在项目复盘时补写"],
        a: 1,
        why: "用例是需求的可验证形态：除零、非法符号、空输入这类情况在清单阶段被想到，成本是一分钟；在代码阶段被发现，成本是一次返工。",
        q_en: "Which claim about writing the case list before coding is best supported?",
        o_en: ["It is ceremony that experienced people may skip", "Failing to write the cases usually means the requirement itself is unclear", "Once unit tests exist, a case list is never needed again", "The list can be filled in afterwards during the retrospective"],
        why_en: "Cases are the verifiable form of a requirement: thinking of divide-by-zero, illegal operators and empty input at list stage costs a minute; meeting them in code costs a rewrite."
      },
      {
        q: "判断：只改了 .cpp、没改头文件，所以增量构建不需要重编任何别的文件。",
        type: "judge", a: 1,
        why: "反过来才是要防的情况：改头文件会让所有包含它的编译单元全部过期，触发大范围重编；这也是把实现细节从 .h 挪进 .cpp 能加快构建的原因。",
        q_en: "True or false: since only a .cpp changed and no header did, incremental building recompiles nothing else.",
        why_en: "The case to watch is the opposite one: touching a header invalidates every translation unit that includes it and triggers a wide rebuild — which is why moving implementation detail from .h into .cpp speeds builds up."
      },
      {
        q: "CMake 里用 target_include_directories 声明头文件目录，若希望「本目标和链接它的使用方都能看到这个目录」，作用域关键字应填 ______。",
        type: "fill", ans: ["PUBLIC", "public"],
        why: "PUBLIC 对自己和使用者同时生效；PRIVATE 只给自己；INTERFACE 只给使用者。头文件目录通常要 PUBLIC，否则别人包含你的 .h 时找不到路径。",
        q_en: "In CMake, which scope keyword for target_include_directories makes the header directory visible both to the target and to anything linking it?",
        why_en: "PUBLIC applies to the target and its users; PRIVATE only to itself; INTERFACE only to users. Header dirs are usually PUBLIC, otherwise consumers cannot resolve your .h includes."
      }
    ],
    sdbg: [
      {
        q: "Linux 下程序退出码是 139，最可能说明什么？",
        o: ["正常结束", "被 SIGSEGV 杀死（128 + 11）", "库主动 abort（例如 double free）", "返回了负数被截断"],
        a: 1,
        why: "被信号杀死时 shell 看到的退出码是 128 加信号编号，11 是 SIGSEGV；SIGABRT 是 6，对应退出码 134。两者指向的排查方向完全不同。",
        q_en: "On Linux a program exits with code 139. What is the most likely explanation?",
        o_en: ["It finished normally", "It was killed by SIGSEGV (128 + 11)", "The library called abort, e.g. on a double free", "A negative return value was truncated"],
        why_en: "Death by signal reports 128 plus the signal number, and 11 is SIGSEGV; SIGABRT is 6, so 134. The two point at quite different investigations."
      },
      {
        q: "怀疑某个变量被「不该执行的赋值」改成了 0，但完全不知道是哪一行干的。最省事的手段是？",
        o: ["在每个函数第一行打断点逐个排查", "用数据断点 watch 监视这个变量", "把整个数组打印出来反复看", "把优化提到 -O2 让代码跑快点"],
        a: 1,
        why: "普通断点按位置触发，你还得猜位置；数据断点按「对这块内存的写」触发，程序在真正改写它的那条指令上停下。代价是监视很慢，只 watch 一个变量。",
        q_en: "You suspect some assignment wrongly zeroes a variable, but you have no idea which line. What is the cheapest move?",
        o_en: ["Set a breakpoint at the first line of every function", "Set a watchpoint on the variable", "Print the whole array repeatedly and look", "Raise optimisation to -O2 so it runs faster"],
        why_en: "A normal breakpoint fires on a location, so you still have to guess. A watchpoint fires on a write to that memory and stops on the instruction doing it. Watching is slow, so watch exactly one variable."
      },
      {
        q: "判断：ASan 报 use-after-free 时，读取那一行就是应该修改的地方。",
        type: "judge", a: 1,
        why: "读取只是受害者，真正的错误通常是报告里那次释放（或所有权设计）。两行栈要一起读：分配在哪、释放在哪、谁还留着指针，才能定位到该改的层次。",
        q_en: "True or false: when ASan reports use-after-free, the line doing the read is the line you should change.",
        why_en: "False. The read is the victim; the fault is normally the free in the same report (or the ownership design behind it). Read both stacks together — where it was allocated, where it was freed, who still holds a pointer — to find the layer worth changing."
      },
      {
        q: "gdb 里打印崩溃点调用栈（栈回溯）的命令是 ______（填常用缩写或全称）。",
        type: "fill", ans: ["bt", "backtrace"],
        why: "bt 从崩溃帧往上列出每一层调用与所在行，配合 frame N 切换、print 看局部变量，是事后调试的第一步。",
        q_en: "Which gdb command prints the call stack at the crash point? Give the common abbreviation or the full word.",
        why_en: "bt lists every frame and line from the crash upward; with frame N to move and print to read locals, it is the first move in post-mortem debugging."
      }
    ]
  },

  /* ---------- 词典：分类统一为「C++ 系统深入」，主键均查过不与既有名词重复 ---------- */
  terms: [
    { term: "模块边界", term_en: "Module Boundary", cat: "C++ 系统深入",
      short: "一段代码对外承诺的输入输出，以及它不许别人知道内部细节的那条线。",
      short_en: "The input/output contract of a piece of code, and the line past which nobody may see its internals.",
      detail: ["边界画在职责上而不是行数上：校验、计算、打印各自一个函数，改动就只会发生在一处。", "边界清楚的直接收益是可测——不碰 cout、不碰文件的纯函数，才能被测试直接调用。"],
      detail_en: ["Boundaries follow responsibility, not line counts: validation, computation and printing each in their own function, so a change happens once.", "The immediate payoff is testability — a pure function that touches neither cout nor a file can be called straight from a test."],
      vs: "模块边界管「谁能依赖我什么」，封装管「我内部哪些东西不许外部看见」。",
      vs_en: "A module boundary decides what others may depend on; encapsulation decides which of your internals stay hidden." },
    { term: "头文件守卫", term_en: "Include Guard", cat: "C++ 系统深入",
      short: "防止同一个头文件在一次编译中被展开两次（从而重复定义）的宏保护。",
      short_en: "A macro protection stopping one header from being expanded twice in a single compilation.",
      detail: ["写法有 #pragma once 与 #ifndef / #define / #endif 两种，效果相同，后者更通用。", "需要守卫的根因是头文件里可能有定义；只要坚持「声明进 .h、定义进 .cpp」，重复包含的伤害就小得多。"],
      detail_en: ["Either '#pragma once' or the classic #ifndef / #define / #endif works; the second is portable.", "Guards exist because headers can carry definitions; keep declarations in headers and definitions in .cpp files and repeated inclusion hurts far less."],
      vs: "守卫解决「同一个头被展开两次」，前置声明解决「两个头互相包含」。",
      vs_en: "Guards handle a header expanded twice; forward declarations handle two headers including each other." },
    { term: "增量构建", term_en: "Incremental Build", cat: "C++ 系统深入",
      short: "只重编受影响的目标文件，其余复用上一次的产物。",
      short_en: "Rebuilding only the objects your edit affected and reusing the rest.",
      detail: ["依据是时间戳与依赖图：make 和 CMake 都靠「谁包含哪个头」建立这张图。", "改一个公共头会让所有包含它的编译单元过期，这正是把实现细节藏进 .cpp 的性能价值。"],
      detail_en: ["It rests on timestamps plus a dependency graph built from which file includes which header.", "Changing one shared header invalidates every unit that includes it — the reason hiding implementation in a .cpp is a speed win."],
      vs: "增量构建省「重编时间」，链接期产物复用是另一回事。",
      vs_en: "Incremental builds save recompilation time; reusing link outputs is a separate matter." },
    { term: "冒烟测试", term_en: "Smoke Test", cat: "C++ 系统深入",
      short: "只验证「能不能跑起来、主流程通不通」的最粗一层测试。",
      short_en: "The coarsest layer of testing: does it start, does the main path work at all.",
      detail: ["成本极低但价值极高：构建产物一坏，几十条细粒度测试全都失去意义。", "常见形态是程序自带 --selftest 参数，或用一小段脚本喂标准输入并检查退出码。"],
      detail_en: ["Cheap and disproportionately valuable: when the build product is broken, every finer test below it becomes noise.", "Typically a --selftest flag in the binary, or a script feeding stdin and checking the exit code."],
      vs: "冒烟测试问「活着吗」，回归测试问「改坏了没有」。",
      vs_en: "A smoke test asks 'is it alive'; a regression test asks 'did we break it'." },
    { term: "语义化版本", term_en: "Semantic Versioning", cat: "C++ 系统深入",
      short: "用「主.次.补丁」三个数字把改动的影响范围写进版本号。",
      short_en: "Three numbers, major.minor.patch, encoding how breaking a change is.",
      detail: ["不兼容改动升主版本、加功能升次版本、只修 bug 升补丁号；使用者据此决定要不要跟。", "对库作者尤其重要：C++ 的 ABI 一旦破坏，光换 .so 而不重编使用者就会崩溃。"],
      detail_en: ["Breaking changes bump major, new features bump minor, fixes bump patch, and consumers decide whether to follow.", "For libraries this matters doubly in C++, where a broken ABI crashes users who only swap the shared object."],
      vs: "版本号是给人的约定，git 标签是给它打的锚点。",
      vs_en: "A version number is a promise to people; a git tag is the anchor that pins it down." },
    { term: "栈回溯", term_en: "Stack Trace", cat: "C++ 系统深入",
      short: "崩溃瞬间从出错帧到 main 的调用链清单，含每层的文件与行号。",
      short_en: "The chain of calls from the failing frame up to main, with a file and line per frame.",
      detail: ["gdb 用 bt 打印，frame N 切层，再用 print 读那一层的局部变量。", "同一函数重复上百层是递归没有出口的签名特征；栈里没有你的函数，说明问题在库或运行时。"],
      detail_en: ["In gdb: bt to print, frame N to move, print to read that frame's locals.", "The same function repeated a hundred times means recursion without a base case; if none of your functions appear, the fault is in a library or the runtime."],
      vs: "栈回溯说「崩溃时经过哪里」，数据断点说「值是在哪里被改的」。",
      vs_en: "A stack trace shows where the crash happened; a watchpoint shows where a value was written." },
    { term: "条件断点", term_en: "Conditional Breakpoint", cat: "C++ 系统深入",
      short: "只有表达式为真才暂停的断点，用来跳过前成千上万次无关命中。",
      short_en: "A breakpoint that only stops when an expression is true, skipping thousands of irrelevant hits.",
      detail: ["gdb 写法 break f.cpp:42 if i == 3，IDE 里在断点属性填条件。", "条件表达式在被优化过的构建里可能算不出来，所以它仍然要求 Debug 构建。"],
      detail_en: ["In gdb: break f.cpp:42 if i == 3; in an IDE, fill the condition field of the breakpoint.", "The condition expression may be unavailable in an optimised build, so a debug build is still required."],
      vs: "条件断点按「状态」筛，数据断点按「写入」筛。",
      vs_en: "A conditional breakpoint filters on state; a watchpoint filters on writes." },
    { term: "地址消毒器", term_en: "AddressSanitizer", cat: "C++ 系统深入",
      short: "编译期插桩、运行时报出越界与释放后使用的检查工具。",
      short_en: "A compile-time instrumentation that reports out-of-bounds and use-after-free at run time.",
      detail: ["开关是 -fsanitize=address 加 -g，报告给出读写字节数、归属分配以及分配/释放两行栈。", "它把「事后猜」变成「当场停」，因此应当在测试构建里常态化开启，而不是出事才想起来。"],
      detail_en: ["Built with -fsanitize=address and -g; the report names the access size, the owning allocation and both the allocation and deallocation stacks.", "It replaces guesswork with an immediate stop, so run it in test builds permanently rather than only after something broke."],
      vs: "ASan 查内存访问，UBSan 查语言级未定义行为，Valgrind 无需重编但慢得多。",
      vs_en: "ASan checks memory access, UBSan checks language-level undefined behaviour, Valgrind needs no rebuild but is far slower." },
    { term: "最小可复现示例", term_en: "Minimal Reproducible Example", cat: "C++ 系统深入",
      short: "删到不能再删、仍能稳定复现问题的最短程序。",
      short_en: "The shortest program that still reproduces the problem reliably.",
      detail: ["删除本身就是定位：每删一处跑一次，删不动的那几行就是根因。", "它同时是提问的礼节——没有它，别人只能凭你的描述猜。"],
      detail_en: ["Cutting is locating: run after every removal, and whatever will not come out is the cause.", "It is also the etiquette of asking — without it, others can only guess from your prose."],
      vs: "最小复现解决「在哪复现」，二分定位解决「从哪引入」。",
      vs_en: "A minimal example answers where to reproduce; bisection answers when it was introduced." },
    { term: "二分定位", term_en: "Bisection", cat: "C++ 系统深入",
      short: "每轮把候选范围减半的查找法，代价是 log2(N) 次判断。",
      short_en: "Halving the candidate set each round, costing log2(N) verdicts.",
      detail: ["三种对象都能二切：代码（注释一半）、输入（给一半数据）、历史（git bisect）。", "前提是每次判断便宜且可靠，所以先有一条能跑通的自检命令。"],
      detail_en: ["You can bisect code (comment out half), input (feed half the data) or history (git bisect).", "It assumes a cheap, reliable verdict each round, so have a working self-test command first."],
      vs: "二分定位是找「哪一步开始坏」，栈回溯是看「坏在哪一处」。",
      vs_en: "Bisection finds which step went bad; a stack trace shows where it went bad." }
  ],

  achievements: [
    { id: "project_shipper", icon: "📦", name: "项目交付", name_en: "Project Shipped",
      desc: "完成 s18 · 项目实战 全部课节", desc_en: "Finish every lesson of s18 Projects",
      check: ["s18"] },
      ],

  /* ---------- 代码注释英文映射 ---------- */
  codeComments: {
    "校验与计算放在一层，界面放在另一层：算法函数里不出现 cout": "validation and maths in one layer, presentation in the other: no cout inside the algorithm",
    "除零是契约错误，怎么报由调用方决定": "divide by zero is a contract violation; the caller decides how to report it",
    "非法运算符": "illegal operator",
    "有上限才谈得上自动化验证": "a bounded loop is what makes automated verification possible",
    "读入失败后流是坏的，必须先清理": "after a failed read the stream is broken; clear it first",
    "业务层：纯函数，不碰 cout 也不碰文件，所以能被测试直接调用": "business layer: a pure function, no cout and no file, so tests can call it directly",
    "先判空：除以 0 会得到 nan": "check empty first: dividing by zero gives nan",
    "比较器必须是严格弱序：写 >= 就是未定义行为": "the comparator must be a strict weak ordering; >= is undefined behaviour",
    "按名字删除：erase + remove_if，删完之后旧下标一律作废": "erase by name: erase plus remove_if; every old index is now meaningless",
    "一行一条记录，字段用竖线分隔：以后加字段只往右追加，老文件仍然读得动": "one record per line, fields split by a pipe; append new fields on the right so old files still load",
    "载入：文件不存在属于「首次运行」，不是错误，返回空表即可": "loading: a missing file is a first run, not an error; return an empty table",
    "去掉 Windows 换行残留的回车": "strip the carriage return Windows line endings leave behind",
    "坏行跳过而不是整本读崩": "skip a malformed line instead of losing the whole archive",
    "保存：先写临时文件再改名，避免写一半崩溃把原存档毁掉": "saving: write a temp file then rename, so a crash cannot destroy the original",
    "花括号结束才真正关文件，改名才有意义": "the file really closes at the closing brace, which is what makes the rename safe",
    "作用域枚举：名字不外泄，也不与别的枚举混用": "scoped enum: names do not leak and cannot clash with another enum",
    "把「读一个区间内的整数」封成函数：坏输入自己清理，调用方拿到的值一定合法": "wrap 'read an integer in range' as a function: it cleans bad input, so callers always get a legal value",
    "丢掉这一行的脏字符，否则下一轮继续失败": "discard the junk left on this line, or the next read fails too",
    "固定种子：这一局可以被完整重放": "fixed seed: this round can be replayed exactly",
    "取模会分布有偏，交给分布对象": "modulo biases the distribution; hand it to a distribution object",
    "重构信号：这个函数一边算一边打印，两件事各自都会变": "refactoring signal: this function computes and prints, and both halves change independently",
    "副作用藏在算子里：测试没法只验数值": "a side effect hidden inside the maths: tests cannot check the number alone",
    "魔法数字收进常量，一处改全局生效": "magic numbers become constants: one edit applies everywhere",
    "拆分后：算的只算，打印的只打印，函数才有被复用和被测试的可能": "after splitting, maths only computes and printing only prints; now the function can be reused and tested",
    "目录结构：界面在 main.cpp，业务在 calc.cpp，声明在 calc.h": "layout: presentation in main.cpp, business logic in calc.cpp, declarations in calc.h",
    "CMakeLists.txt：四行就够一个小项目": "CMakeLists.txt: four lines cover a small project",
    "外部构建：产物全在 build 目录里，删掉它等于彻底重来": "out-of-source build: everything lands in build/, deleting it means a clean start",
    "交付四件套：能编、能测、README 写清命令、最后打一个版本标签": "four deliverables: it builds, it tests, the README states the commands, and a version tag closes it",
    "读报错三层：位置(文件:行:列) -> 缺什么 -> note 给的修复建议": "three layers of a diagnostic: position (file:line:column) -> what is missing -> the fix in the note",
    "真实场景：只是少了一个分号，报错却落在下一行": "real situation: one missing semicolon, and the error lands on the next line",
    "g++ 指到这里：expected ';' before 'std'": "g++ points here: expected ';' before 'std'",
    "另一类长得很不一样：链接错误没有行号，只有对不上的名字": "the other family looks nothing like this: link errors have no line number, only names that fail to match",
    "所以先查实现文件与构建清单，改语法没有用": "so check the implementation file and the build list; tweaking syntax will not help",
    "起手命令：警告全开，颜色打开": "the command you start with: every warning on, colours on",
    "先编出带调试信息的版本，再进 gdb 走一遍": "build with debug info first, then walk it in gdb",
    "崩了就直接看现场：bt 列出调用栈，frame 切到出错那一层": "if it crashed, read the scene: bt lists the stack, frame moves to the failing level",
    "只在第三次命中时停：条件断点，省掉手动按一百次 continue": "stop only on the third hit: a conditional breakpoint saves a hundred presses of continue",
    "谁改了这个变量：数据断点在写入的瞬间停下": "who changed this variable: a watchpoint stops at the write itself",
    "图形界面里对应的是「调用堆栈」窗口与「监视」表达式，快捷键 F10/F11 即 Over/Into": "the GUI equivalents are the call stack window and watch expressions; F10/F11 are Over/Into",
    "用这条命令编，三个开关缺一不可": "build with this command; all three flags are needed",
    "合法下标是 0 到 4，这里正好越过去": "valid indices are 0 to 4; this one steps just past the end",
    "打开下一行：ASan 报 heap-buffer-overflow 并给出行号": "uncomment the next line: ASan reports heap-buffer-overflow with the line number",
    "打开下一行：use-after-free，连在哪里释放一起打印": "uncomment the next line: use-after-free, printed together with where it was freed",
    "浅拷贝留下的悬空指针，此刻谁都不该 delete": "a dangling pointer left by a shallow copy; nobody should delete it now",
    "打开下一行：double free，通常是 abort 而不是 segfault": "uncomment the next line: double free, which usually aborts rather than segfaults",
    "三个级别一个开关：交付时把 VERBOSE 关掉，代码一行都不用删": "three levels, one switch: turn VERBOSE off for delivery without deleting a line",
    "走 cerr：不被重定向带走": "through cerr: redirection cannot carry it away",
    "临时诊断放在条件编译里": "keep temporary diagnostics inside conditional compilation",
    "实际与期望并排，眼睛不用做减法": "actual beside expected, so the eye does no subtraction",
    "现象：同样的输入，-O2 结果错、-O0 正常，怀疑某个提交引入了问题": "symptom: same input, wrong under -O2, correct under -O0; one commit looks suspicious",
    "目标：在上百个提交里定位到那一个": "goal: find that one commit among hundreds",
    "上面两条：bad 指当前提交，good 指当时还正确的标签": "those two lines: bad marks the current commit, good a tag that was still correct",
    "之后二分自动切到中间提交，你只回答 good 或 bad，约 log2(N) 次收敛": "bisect then hops to the middle commit automatically; you only answer good or bad, about log2(N) rounds",
    "找到之后先别改代码：单独 checkout 那条提交，复现一次并记下最小输入": "once found, do not edit yet: check out that commit alone, reproduce it and note the minimal input",
    "提问或写报告前，把仓库和输入目录打包，这才是别人能跑起来的复现件": "before asking or filing a report, package the repo plus the input; that is a reproduction others can run",
    "五步流程最后一步的落地件：一个会响的断言，把「我以为」变成能跑的测试": "the deliverable of step five: an assertion that makes noise, turning 'I assume' into a test that runs",
    "非 0 退出码：脚本与 CI 才知道真的失败了": "a non-zero exit code is how scripts and CI learn it really failed"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_PROJ1);
