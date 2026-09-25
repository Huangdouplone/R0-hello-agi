/* ================================================================
 * R0:hello agi · 课程深化层 ⑧-2（s15 文件操作 / s16 异常处理 / s17 现代 C++ 特性）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「STL 之后、项目之前」的三章从每节 3 要点深化到 6~8 要点。
 *   s15 补齐打开模式与失败检查、文本/二进制差异、getline 与 >> 的混用坑、
 *      eof() 为什么不能当循环条件、编码与工作目录、缓冲与逐行处理；
 *   s16 补齐异常与错误码的取舍、抛出/捕获的值与引用、栈展开与析构顺序、
 *      noexcept 与移动优化的耦合、RAII 消除异常泄漏、catch(...) 的滥用边界；
 *   s17 补齐 auto 推导规则、范围 for 的引用取舍、nullptr、override/final、
 *      Lambda 捕获陷阱、智能指针与循环引用、移动之后的状态、结构化绑定、
 *      optional 与 string_view 的生命周期。
 *   另为三章各加一节「综合重构」收口课（15-5 / 16-5 / 17-7）。
 * 写法约定：既有课节不写 title（沿用主数据标题）；新课写 title/title_en/target/target_en；
 *          order 覆盖全部既有 id + 新增 id；code 里的中文注释全部进 codeComments。
 * ================================================================ */

const DEEPEN_STL2 = {
  stages: ["s15", "s16", "s17"],

  order: {
    s15: ["15-1", "15-2", "15-3", "15-4", "15-5"],
    s16: ["16-1", "16-2", "16-3", "16-4", "16-5"],
    s17: ["17-1", "17-2", "17-3", "17-4", "17-5", "17-6", "17-7"]
  },

  lessons: {

    /* ===================== s15 文件操作 ===================== */
    "15-1": {
      min: 12,
      summary: [
        "`<fstream>` 给三个流类：ifstream 只读、ofstream 只写、fstream 读写；它们和 cout/cin 是同一套接口（`<<`、`>>`、getline），只是把数据源从键盘屏幕换成磁盘，所以已学的流用法可以整体复用。",
        "打开有两条等价写法：构造时直接给路径 `std::ifstream fin(\"cfg/app.txt\")`，或先默认构造再 `fin.open(path)`。后者用于路径要运行期算出来，或同一个流对象反复打开不同文件（每次之前必须先 close）。",
        "打开模式是位标志，用 `|` 组合：`ios::in`、`ios::out`、`ios::app`、`ios::ate`、`ios::trunc`、`ios::binary`。不写时默认 ifstream 是 in、ofstream 是 out；fstream 想要 `in|out` 时文件通常必须已存在，不会替你创建。",
        "最危险的一条默认值：ofstream 打开已存在的文件会**截断清空**（隐含 trunc）。想追加必须显式 `std::ofstream fout(\"run.log\", std::ios::app)`；`ate` 只是打开后把游标移到末尾，仍可以 seek 回中间覆盖写。",
        "打不开时什么都不会发生：目录不存在、被别的进程独占、路径里有空格或中文、权限不足——这些都只让流进入失败状态，此后每次 `<<` 与 `>>` 静默无效，程序照常跑完并留下一份空文件。",
        "因此打开后的第一件事必然是检查：`if (!fin) { ... }`（流对象能当 bool 用，等价于 `!fin.fail()`），或明确地问 `fin.is_open()`。前者更强，因为它连「打开成功但读挂了」一起覆盖。",
        "close() 基本不用手写：流对象离开作用域时析构自动关闭，这就是 RAII（s9）在文件上的落地。真正需要显式 close 只有两件事——同一个流换文件、以及要在函数结束前确认内容已经落盘可见。",
        "衔接：本章前置是 s6 的 string 与 s12~s14 的容器、迭代器和算法；15-1 只把管道接上，文本怎么按行读在 15-2，字节怎么原样存读在 15-3，出错以后怎么兜底在 15-4。"
      ],
      summary_en: [
        "<fstream> ships three stream classes: ifstream reads, ofstream writes, fstream does both. They share one interface with cout/cin - '<<', '>>' and getline - only the source moves from the keyboard to the disk, so every stream habit you already have transfers intact.",
        "Opening has two equal spellings: pass the path to the constructor ('std::ifstream fin(\"cfg/app.txt\")') or default-construct then call fin.open(path). The second form is what you need when the path is computed at run time, or when one stream object is reused for several files (close it in between).",
        "Open modes are bit flags combined with '|': ios::in, ios::out, ios::app, ios::ate, ios::trunc, ios::binary. Left out, ifstream defaults to in and ofstream to out; an fstream opened in|out normally requires the file to exist and will not create it for you.",
        "The default that burns people: an ofstream on an existing file truncates it - everything in it is gone. Appending takes an explicit std::ofstream fout(\"run.log\", std::ios::app); ios::ate merely starts the cursor at the end and still lets you seek back and overwrite.",
        "A failed open announces itself by doing nothing: a missing directory, a file locked by another process, a path with spaces or non-ASCII letters, denied permissions - all only put the stream into a failed state, after which every '<<' and '>>' silently does nothing and the program exits happily holding an empty file.",
        "So the first statement after opening is always a check: 'if (!fin) { ... }' (a stream converts to bool, equivalent to !fin.fail()), or the more literal fin.is_open(). The former is stronger because it also covers 'opened fine, then broke while reading'.",
        "You rarely write close(): the destructor closes the file when the stream leaves scope - RAII from s9 applied to files. Only two cases really need it: pointing one stream object at another file, and proving the bytes are on disk before the function ends.",
        "Bridge: this chapter builds on the string work of s6 and the containers, iterators and algorithms of s12-s14. 15-1 only connects the pipe; line-by-line text is 15-2, raw bytes are 15-3, and what to do when it fails is 15-4."
      ],
      code: `#include <fstream>
#include <iostream>
#include <string>

int main() {
    // 打开后第一件事就是检查：失败不会抛异常，也不会打印任何东西
    std::ifstream fin("cfg/app.txt");
    if (!fin) {                       // 等价于 fin.fail()，也覆盖没打开成功
        std::cerr << "打不开：查路径、工作目录、权限\\n";
        return 1;
    }
    std::string line;
    while (std::getline(fin, line)) std::cout << line << "\\n";

    fin.close();                      // 可省：析构时自动关；这里是为了给下一个文件腾位置

    // 默认截断！已存在的 run.log 会被清空，追加必须写 app
    std::ofstream log("run.log", std::ios::app);
    if (log) log << "一次运行\\n";
    return 0;
}`,
      pit: "把相对路径当成「相对于 .cpp 文件」——它实际相对于**进程的工作目录**：IDE 里常常是工程根目录，双击 exe 时是 exe 所在目录，脚本里又是调用方的目录。同一段代码换种启动方式就读到别的文件，或者干脆静默新建一个空文件。",
      pit_en: "Assuming a relative path is 'relative to the .cpp file' - it is relative to the process's working directory, which is the project root in an IDE, the exe's folder on double-click, and the caller's folder from a script. The same code then reads a different file, or quietly creates an empty one.",
      ex: {
        q: "为什么 `std::ofstream fout(\"a/b.txt\");` 在目录 b 不存在时不报错，只是什么都没写进去？",
        a: "标准库不负责创建目录，open 失败只把流置为失败状态；不检查 `is_open()`/`!fout` 就没人知道，之后所有写入都被丢弃。",
        q_en: "Why does 'std::ofstream fout(\"a/b.txt\")' not complain when directory b is missing, and simply write nothing?",
        a_en: "The standard library never creates directories: a failed open only sets the stream's failure state, and unless you test is_open() or !fout nobody learns about it, so every later write is thrown away."
      }
    },

    "15-2": {
      min: 13,
      summary: [
        "文本模式（默认）按字符读写：`<<` 把值格式化成看得见的字符（int 12345 写出 5 个字节），`>>` 再从字符还原。好处是文件能用人眼读、能手工编辑，代价是体积更大、解析更慢。",
        "`>>` 以空白（空格、Tab、换行）为分隔读「一个词」，读完停在分隔符之前；getline 读「整行」，并把行末换行符消耗掉但不存进 string。语义不同，正是混用时最容易出问题的地方。",
        "经典坑：`cin >> n;` 之后紧跟 `getline(cin, s);`，s 立刻是空串——`>>` 把数字读走了却把换行留在流里，getline 一见到换行就收工。先 `cin.ignore(1, '\\n')`，或者干脆全程只用 getline。",
        "一行里有多列（CSV、`key=value`、日志）时正确姿势是两层：外层 getline 取行，内层 `std::stringstream ss(line)` 再按 `>>` 或按分隔符切列。这样行列错误互不污染，某一行的列数不对也只损失那一行。",
        "getline 也能指定分隔符：`std::getline(ss, field, ',')` 直接切 CSV 字段。但它不懂引号里的逗号，真正的 CSV（含转义、含换行的字段）要么交给库，要么自己把转义规则写全。",
        "Windows 文本行尾是 CRLF（\\r\\n），Linux/macOS 是 LF（\\n）。文本模式会替你做转换，但用二进制模式读 Windows 文件、或碰到行尾混用的文件时，string 末尾会留下一个看不见的 '\\r'，于是 `line == \"ok\"` 永远为假。",
        "读循环的条件必须由读动作本身给出：`while (std::getline(fin, line))`。它在读失败（包括抵达文件末尾）时结束，进循环体的行一定完整。拿 eof() 当条件会多跑一轮，原因见 15-4。",
        "衔接：能整行读进来之后，15-3 处理「不该被当成字符解释」的数据，15-4 把「读到一半失败」变成可控逻辑。"
      ],
      summary_en: [
        "Text mode (the default) works character by character: '<<' formats a value into visible characters (int 12345 becomes five bytes), '>>' parses them back. The payoff is a file a human can read and hand-edit; the price is size and parsing speed.",
        "'>>' reads one word, treating spaces, tabs and newlines as separators, and stops just before the separator; getline reads a whole line, consuming the trailing newline without storing it. Different semantics - which is exactly where mixing them goes wrong.",
        "The classic trap: 'cin >> n;' followed by 'getline(cin, s);' leaves s empty, because '>>' took the number and left the newline in the stream, and getline stops the instant it sees one. Call cin.ignore(1, '\\n') first, or simply use getline everywhere.",
        "When a line has several columns (CSV, key=value, log records) parse in two layers: getline for the line, then std::stringstream ss(line) and split it with '>>' or a delimiter. Errors stay inside one row instead of poisoning the whole stream.",
        "getline also takes a delimiter: std::getline(ss, field, ',') splits CSV fields directly. It does not understand commas inside quotes, so real CSV (quoting, embedded newlines) needs a library or a careful hand-rolled state machine.",
        "Windows line ends are CRLF, Linux and macOS are LF. Text mode translates for you, but reading a Windows file in binary mode - or one with mixed line endings - leaves an invisible '\\r' at the end of the string, so line == \"ok\" never holds.",
        "The read loop's condition must be the read itself: 'while (std::getline(fin, line))'. It ends when a read fails, including at end of file, so the body only ever sees a complete line. Testing eof() instead runs one extra round; 15-4 explains why.",
        "Bridge: once whole lines come in, 15-3 handles data that must not be interpreted as characters, and 15-4 turns 'it broke halfway' into controllable logic."
      ],
      code: `#include <fstream>
#include <sstream>
#include <iostream>
#include <string>

int main() {
    std::ifstream fin("server.cfg");
    if (!fin) return 1;

    std::string line;
    while (std::getline(fin, line)) {          // 外层：一次一行
        if (!line.empty() && line.back() == '\\r') line.pop_back();  // 去掉残留的回车
        if (line.empty() || line[0] == ';') continue;               // 空行与注释行

        std::stringstream ss(line);            // 内层：把这一行交给字符串流继续切
        std::string key, val;
        if (std::getline(ss, key, '=') && std::getline(ss, val))
            std::cout << key << " -> [" << val << "]\\n";
    }

    int n = 0;
    std::cin >> n;                             // 读数字，换行被留在流里
    std::string rest;
    std::getline(std::cin, rest);              // 于是这里拿到空串
    std::cout << "rest 的长度是 " << rest.size() << "\\n";
    return 0;
}`,
      pit: "用 `>>` 读「整行文本」（人名、地址、带空格的配置值）：它只读到第一个词，剩下的字符留在流里被下一次读取捡走——于是「解析结果只有第一列对」这种 bug 会一路传染到后面的每一行。",
      pit_en: "Using '>>' to read a whole line of text (a name, an address, a config value with spaces): it stops at the first word and leaves the rest in the stream for the next read to trip over - which is why 'only the first column is right' spreads to every following line.",
      ex: {
        q: "为什么 `cin >> n;` 后紧跟 `getline(cin, s);` 会读到空串？",
        a: "因为 `>>` 只取数字，把行末换行留在流里，getline 立刻在它前面结束并返回空串；先用 `cin.ignore(...)` 吃掉行尾即可。",
        q_en: "Why does getline right after 'cin >> n;' return an empty string?",
        a_en: "Because '>>' consumes only the digits and leaves the newline behind, so getline terminates immediately in front of it. Swallow the end of line with cin.ignore(...) first."
      }
    },

    "15-3": {
      min: 12,
      summary: [
        "二进制模式（`ios::binary`）按字节原样搬运：`write(const char*, n)` 吐 n 个字节，`read(char*, n)` 吸 n 个字节，没有字符编码转换、没有数字格式化，因此又快又紧凑。",
        "文本与二进制真正的差异体现在 Windows：文本模式写出 '\\n' 会变成 \\r\\n，读入时再折回来；Linux 上两种模式行为一致。「同一份代码在 Windows 上读到的字节数比 Linux 多」就是这条造成的。",
        "整数 12345 用文本存是 5 个字节且人能读，用二进制存是内存里的 4 个字节：省空间、读回快，但用编辑器打开是乱码，而且换编译器/换平台不一定还认得回来。",
        "`reinterpret_cast<const char*>(&x)` 是把对象「当成一串字节」交给 write 的惯用写法，长度必须用 `sizeof` 现算；这种类型双关只允许在字节粒度上做，绝不能把 `int*` 转出去再当 `double*` 读回来。",
        "直接 dump 结构体是最容易翻车的序列化：编译器会在成员之间插入填充字节，填充内容是未定义值；而 `std::string`、`std::vector`、裸指针成员存进去的只是内部地址和长度，读回来必然悬空。",
        "要跨平台就得把布局钉死：改用 `int32_t/uint32_t` 等定宽类型（`<cstdint>`）、逐字段 write 而不是整块 write，必要时用 `static_assert(sizeof(T) == N, \"...\")` 把关；端序不同的两端还要显式转换（网络字节序）。",
        "`seekg/seekp` 在二进制流上按字节跳，配合「文件头里记下每条记录的偏移」就能随机读大文件的中间部分；文本流上只能使用 `tellg` 返回的那种值，千万别自己按行号猜位置。",
        "衔接：二进制把「怎么存」完全变成你自己的责任，15-4 则负责「存不下、读不到」时怎么发现并处理。"
      ],
      summary_en: [
        "Binary mode (ios::binary) moves bytes verbatim: write(const char*, n) emits n bytes and read(char*, n) takes n, with no character translation and no number formatting - which is what makes it fast and compact.",
        "The text-versus-binary gap shows up on Windows: text mode turns a written '\\n' into CR-LF and folds it back on input; on Linux the two modes behave identically. 'Windows read more bytes than Linux from the same file' is exactly this.",
        "Storing 12345 as text costs five readable characters; as binary it is the raw four bytes of memory - smaller and quicker, but nonsense in an editor, and not guaranteed to survive a different compiler or platform.",
        "reinterpret_cast<const char*>(&x) is the idiomatic way to hand an object to write as a byte string, and the length must come from sizeof. This kind of type punning is legal only at byte granularity - never cast an int* out and read it back as a double*.",
        "Dumping a struct directly is the most fragile serialisation there is: the compiler inserts padding between members whose bytes hold undefined values, and std::string, std::vector or raw pointer members contribute only their internal address and length, which are dangling by the time you read them back.",
        "To be portable, pin the layout: use fixed-width int32_t/uint32_t from <cstdint>, write field by field instead of one blob, guard with static_assert(sizeof(T) == N, \"...\"), and convert explicitly when the two ends disagree about byte order.",
        "seekg/seekp jump in bytes on a binary stream, so an index of offsets written in the header gives random access into a huge file. On a text stream the only positions worth using are the ones tellg handed you - never guess from line numbers.",
        "Bridge: binary mode makes 'how to store' entirely your responsibility; 15-4 covers how to notice and handle 'it would not store or would not come back'."
      ],
      code: `#include <cstdint>
#include <fstream>
#include <iostream>

// 定宽类型、无指针无 string：这才是可以放心整块 dump 的普通数据
struct Point {
    int32_t x;
    int32_t y;
};

static_assert(sizeof(Point) == 8, "布局不是 8 字节就别直接读写");

int main() {
    {
        std::ofstream out("pts.bin", std::ios::binary | std::ios::trunc);
        if (!out) return 1;
        const Point pts[3] = {{1, 2}, {3, 4}, {5, 6}};
        // 整块写入：一次三个元素，比逐个 write 少很多次调用
        out.write(reinterpret_cast<const char*>(pts), sizeof(pts));
    }                                   // 出了作用域自动关闭并刷完缓冲

    std::ifstream in("pts.bin", std::ios::binary);
    if (!in) return 1;
    Point p{};
    while (in.read(reinterpret_cast<char*>(&p), sizeof(Point)))
        std::cout << "(" << p.x << "," << p.y << ")\\n";
    // 最后一次 read 失败：剩余字节不够一个 Point，循环按设计结束
    std::cout << "末尾还剩下 " << in.gcount() << " 个字节\\n";
    return 0;
}`,
      pit: "用文本方式读二进制文件（或反过来）：Windows 文本模式会把 \\r\\n 折叠成 \\n，还可能把某些字节当作结束标记，于是读出来的内容比实际少一截且毫无提示；读写模式必须和当初写它时完全一致。",
      pit_en: "Reading a binary file as text, or the reverse: Windows text mode folds CR-LF into LF and may treat certain bytes as an end marker, so you get a shorter payload and no warning at all. Read with exactly the mode it was written with.",
      ex: {
        q: "为什么 `struct S { char c; int n; };` 往往不是 5 字节而是 8 字节？",
        a: "为了对齐，编译器在 c 之后插入 3 个填充字节让 int 落在 4 的倍数地址上；填充内容未定义，所以两个「值相同」的对象在字节层面并不相同。",
        q_en: "Why is 'struct S { char c; int n; };' usually 8 bytes rather than 5?",
        a_en: "For alignment the compiler inserts three padding bytes after c so the int sits at a multiple of four; padding is uninitialised, so two objects with equal values are not equal as bytes."
      }
    },

    "15-4": {
      min: 12,
      summary: [
        "每个流里有四个状态位：goodbit（正常）、eofbit（读到过末尾）、failbit（逻辑失败，例如打开失败或格式不符）、badbit（底层错误，不可恢复）。`good()/eof()/fail()/bad()` 就是查这几位，而 `if (stream)` 等价于 `!fail()`。",
        "关键认知：eof 是「试图读过末尾之后」才被置位，它不是「后面还有一行」的预言。`while (!fin.eof())` 的循环体会在最后一次失败的读之后**再执行一次**，于是上一行被处理两遍，或者把空行当成数据。",
        "正确写法只有两类：把读动作当条件 `while (std::getline(fin, line))` / `while (fin >> x)`，或者先读再判 break。收尾时还可以分辨两种结束原因——`if (!fin.eof())` 说明不是自然读完，而是中途出错（文件被截断、磁盘坏了）。",
        "failbit 是可以清除的：`fin.clear()` 复位状态位，配合 `seekg` 就能回头重读或换一种解析方式继续；badbit 清不清都没意义，它表示底层已经坏掉，只能关掉重开。",
        "读整数时撞上字母会让流 fail，并把那个字母留在流里，之后每次 `>>` 都立刻失败——「死循环」和「结果全是 0」都是从这来的。处理三步：查状态、`clear()`、`ignore(n, '\\n')` 丢掉坏字符。",
        "输出是带缓冲的，正常结束才刷盘：要立刻可见得靠 `fout.flush()`、`std::flush` 或 `std::endl`（这也是 endl 慢的原因）。写日志给另一个进程看、或者想在崩溃前留住最后几行，就必须手动 flush。",
        "读大文件的默认姿势是逐行流式处理，而不是整个文件读进一个 string 或 vector：内存占用从「文件多大」降成「最长那一行多大」，还能在出错时立刻停手；真要提速是加大读块，不是加大驻留。",
        "想彻底告别一屏 if，可以让流自己抛异常：`fin.exceptions(std::ifstream::failbit | std::ifstream::badbit)` 之后失败即抛出——这句话也正是通往 s16 异常处理的入口。"
      ],
      summary_en: [
        "Every stream carries four state bits: goodbit (fine), eofbit (a read reached past the end), failbit (logical failure such as a bad open or a format mismatch) and badbit (an unrecoverable low-level error). good()/eof()/fail()/bad() query them, and 'if (stream)' means '!fail()'.",
        "The insight that matters: eof is set only *after* you try to read past the end, so it never predicts 'another line is coming'. A 'while (!fin.eof())' body runs one more time after the failing read, processing the last line twice or feeding an empty line to your code.",
        "Only two shapes are correct: make the read itself the condition ('while (std::getline(fin, line))', 'while (fin >> x)'), or read then break. At the end you can still tell why it stopped - if (!fin.eof()) means you did not reach the end naturally but hit a real error.",
        "failbit is recoverable: fin.clear() resets the bits, and with seekg you can rewind or retry with another parse. Clearing badbit is pointless - the underlying device is broken, so close and reopen.",
        "Reading an integer that meets a letter sets failbit and leaves the letter in the stream, so every later '>>' fails instantly - the standard recipe for an infinite loop or a screen of zeros. The fix is three steps: check, clear(), then ignore(n, '\\n') to drop the bad characters.",
        "Output is buffered and only reaches the disk at a clean exit; immediate visibility takes fout.flush(), std::flush or std::endl (which is exactly why endl is slow). Anything another process must read, or the last lines before a crash, needs an explicit flush.",
        "For large files the default shape is streaming line by line rather than slurping everything into a string or vector: memory drops from 'size of the file' to 'size of the longest line', and you can bail out mid-way. If you need speed, enlarge the read chunk, not the residency.",
        "If you would rather not write all those ifs, let the stream throw: fin.exceptions(std::ifstream::failbit | std::ifstream::badbit) turns failure into an exception - which is also the doorway into s16."
      ],
      code: `#include <fstream>
#include <iostream>
#include <string>

int main() {
    std::ifstream fin("data.txt");
    if (!fin) { std::cerr << "打不开，直接退出\\n"; return 1; }

    // 反例：最后一次读已经失败，循环体还会再跑一遍
    // while (!fin.eof()) { std::string s; std::getline(fin, s); use(s); }

    long n = 0;
    std::string line;
    while (std::getline(fin, line)) ++n;        // 条件就是读动作本身

    if (!fin.eof()) std::cerr << "不是自然读完，中途出错了\\n";

    fin.clear();                                // 复位状态位，这个流才还能用
    fin.seekg(0);                               // 回到开头：tellg 给出的就是这类偏移
    std::string first;
    std::getline(fin, first);

    int x = 0;
    if (!(fin >> x)) {                          // 读字母就会走到这里
        fin.clear();                            // 先清 failbit
        fin.ignore(1024, '\\n');                 // 再把坏字符丢掉
    }

    std::ofstream fout("out.txt");
    fout << "必须让别人马上看到的一行" << std::endl;   // endl 顺手刷新缓冲
    fout << "还留在缓冲区里的一行\\n";                  // 这一句并没有落盘
    fout.flush();                               // 要立刻可见就只能手动刷
    return 0;
}`,
      pit: "以为 `if (fin.is_open())` 过了就万事大吉：它只回答「打开成功过」，不反映之后的读失败；写完也不看 `fout.good()`，于是磁盘满、配额超限、文件被占用都会留下写了一半的文件而无人报错。",
      pit_en: "Treating a passed 'if (fin.is_open())' as a clean bill of health: it only answers 'the open succeeded once' and says nothing about later read failures - and if you never check fout.good() after writing, a full disk, a quota or a locked file leaves a half-written file behind with no complaint.",
      ex: {
        q: "`fin.eof()` 与 `fin.fail()` 什么时候会同时为真？这时该做什么？",
        a: "试图越过末尾读取时两个位一起置上；对逐行读取来说这就是正常结束，只有在确知还有数据时（比如二进制块读不满）才算真错误。",
        q_en: "When are fin.eof() and fin.fail() both true, and what should you do then?",
        a_en: "Both are set when a read tries to cross the end. For line reading that is simply a normal finish; it is a genuine error only when you knew more data had to come, such as a short binary block."
      }
    },

    "15-5": {
      title: "综合重构：读配置 → 处理 → 写日志的小流水线",
      title_en: "Synthesis: A Read-Config, Process, Write-Log Pipeline",
      min: 15,
      target: "能在不查资料的情况下写出一段健壮的三段式文件程序：逐行读配置并解析、在内存里聚合统计、把结果与过程分别写进结果文件和日志，每一步都带失败检查。",
      target_en: "Write, without looking anything up, a robust three-stage file program: read and parse a config line by line, aggregate in memory, and write results and log lines to separate files - with a failure check at every stage.",
      summary: [
        "把 15-1 到 15-4 拼成一条固定骨架：打开并检查 → 逐行 getline + stringstream 解析 → 在内存里聚合（s12 的 map/vector）→ 写结果文件 + 写日志 → 收尾确认状态。以后所有文件题都只是这五步的换皮。",
        "失败策略必须先定：配置缺失是致命错误（记日志并退出）还是可恢复（用默认值继续）？这一条决定代码里写 return 还是 continue。事先不定，就会长成「到处是 if、到处漏」的样子。",
        "输入要能容忍脏数据：空行、`;` 或 `#` 注释、行尾残留的 '\\r'、多余空格、少了列的行。逐行解析的价值正在这里——一行坏了记一条警告继续跑，整个文件不至于报废。",
        "两个输出用两种模式：结果文件用默认截断（每次运行都是一份全新的产出），日志用 `ios::app` 追加并带上步骤号或时间戳。两个流的打开检查都要写，被忘掉的多半是第二个。",
        "交付前照这五条自查：每个流打开后检查了吗？循环条件是不是读动作本身？有没有依赖 eof()？会不会把上一轮结果截断掉？关键日志 flush 了吗？——再加一条：路径是相对于工作目录的，换种启动方式还找得到吗？",
        "本章真实翻车复盘：改了代码没重编看到旧文件 / ofstream 把上一轮结果清空 / Windows 的 '\\r' 让字符串比较永远失败 / 一次读入 2GB 把内存打爆 / 把日志写进了要被自己解析的文件里，下次运行当场炸。",
        "衔接：本章的终点是把文件当「外部世界」看待——它不可靠、可能缺失、可能被占用、编码可能不统一。s16 接着回答「检查出来之后怎么报告」，那才是错误处理策略的正题。"
      ],
      summary_en: [
        "Assemble 15-1 to 15-4 into one fixed skeleton: open and check, getline plus stringstream per line, aggregate in memory with the s12 map/vector, write a result file plus a log, confirm state on the way out. Every later file exercise is these five steps in different clothes.",
        "Decide the failure policy first: is a missing config fatal (log and exit) or recoverable (keep going on defaults)? That single choice decides whether the code writes return or continue. Leave it undecided and you grow a mess of ifs with holes in it.",
        "Tolerate dirty input: blank lines, ';' or '#' comments, a leftover '\\r' at the end of the line, stray spaces, rows with missing columns. This is precisely the payoff of parsing line by line - a bad row costs one warning and the run survives.",
        "Use two different modes for the two outputs: the result file opens with the default truncation (each run produces a fresh artefact), the log opens with ios::app and carries a step number or timestamp. Check both opens - the second one is what people forget.",
        "Pre-delivery self-check, five questions: did every stream get checked after opening? Is the loop condition the read itself? Anywhere relying on eof()? Could a previous run's output get truncated? Were the important log lines flushed? Plus one: paths are relative to the working directory, so does the file still exist when you launch it a different way?",
        "Chapter retrospective in one breath: rebuilt nothing and read the stale file, ofstream wiped last run's results, a Windows '\\r' made every comparison false, a 2 GB slurp ate all the memory, and a log written into the very file that gets parsed blew up the next run.",
        "Bridge: this chapter ends by treating files as the outside world - unreliable, possibly missing, possibly locked, possibly a different encoding. s16 picks up with 'now how do you report what you found', which is where error-handling strategy actually begins."
      ],
      code: `#include <fstream>
#include <iostream>
#include <map>
#include <sstream>
#include <string>
#include <vector>

namespace {

struct Config {
    std::string name = "default";
    int limit = 100;
};

Config loadConfig(const std::string& path, std::ofstream& log) {
    Config cfg;                              // 默认值本身就是恢复策略
    std::ifstream fin(path);
    if (!fin) {                              // 缺配置不致命：记一条日志继续跑
        log << "WARN  配置缺失，用默认值\\n";
        return cfg;
    }
    std::string line;
    while (std::getline(fin, line)) {
        if (!line.empty() && line.back() == '\\r') line.pop_back();
        std::stringstream ss(line);
        std::string key, val;
        if (!std::getline(ss, key, '=') || key.empty() || key[0] == '#') continue;
        if (!std::getline(ss, val)) continue;              // 少一列：丢掉这一行
        if (key == "name") cfg.name = val;
        else if (key == "limit") {
            std::stringstream v(val);
            if (!(v >> cfg.limit)) log << "WARN  limit 不是整数\\n";
        }
    }
    if (!fin.eof()) log << "ERROR 中途读失败，配置可能不完整\\n";
    return cfg;
}

}   // namespace

int main(int argc, char** argv) {
    const std::string inPath = (argc > 1) ? argv[1] : "scores.txt";

    std::ofstream log("run.log", std::ios::app);        // 日志追加，结果覆盖
    if (!log) { std::cerr << "日志打不开\\n"; return 2; }

    const Config cfg = loadConfig(inPath + ".cfg", log);

    std::ifstream fin(inPath);
    if (!fin) { log << "FATAL 输入打不开\\n"; return 1; }

    std::map<std::string, long> hits;
    long lines = 0;
    std::string line;
    while (std::getline(fin, line)) {
        std::stringstream ss(line);
        std::string who;
        long score = 0;
        if (!(ss >> who >> score)) { log << "WARN 跳过坏行\\n"; continue; }
        hits[who] += score;
        ++lines;
    }

    std::ofstream out("summary.txt");                   // 默认截断：每次都是新产出
    if (!out) { log << "FATAL 结果写不出去\\n"; return 1; }
    for (const auto& kv : hits)
        if (kv.second > cfg.limit) out << kv.first << " " << kv.second << "\\n";

    out.flush();                                        // 先落盘，再报告数字
    log << "INFO  共 " << lines << " 行，由 " << cfg.name << " 完成\\n";
    return 0;
}`,
      pit: "只在脑子里过一遍清单，不动笔也不看输出：结果就是下次碰到「文件怎么是空的」还得重新推。把「打开即检查、循环用读动作、日志走 app、结果走截断」写成模板片段存进自己的代码库，才是这一章真正的产出。",
      pit_en: "Running the checklist in your head only, without writing anything down or looking at the output: next time the file comes back empty you re-derive everything. The real deliverable of this chapter is a saved snippet - check on open, read-as-condition, log in append, results in truncate.",
      ex: {
        q: "为什么这段流水线要把「结果文件」和「日志文件」用两种打开模式？",
        a: "结果要每次都是全新的一份，所以用默认的截断；日志要留住历史，所以用 ios::app 追加。反过来就会得到一份被上次运行污染的结果文件，或一份只剩最后一次的日志。",
        q_en: "Why does the pipeline open the result file and the log file in two different modes?",
        a_en: "Results must be fresh every run, so they keep the default truncation; the log must keep history, so it opens with ios::app. Swap them and you either read results polluted by the previous run or a log that only remembers the last one."
      }
    },

    /* ===================== s16 异常处理 ===================== */
    "16-1": {
      min: 12,
      summary: [
        "异常做的事是「把错误从发生点直接送到有能力处理它的地方」：throw 抛出一个对象，运行时沿调用栈向上找第一个匹配的 catch，中间的栈帧被逐个销毁（栈展开）。它替你把「错误码层层手工传回」的噪音删掉了。",
        "三段语法各管一段：try 包住可能出错的代码；catch 按**类型**匹配，不匹配就继续往上找；throw 之后当前函数剩下的语句一句都不执行——别指望「抛了还会往下走」。",
        "标准组合是「按值抛出、按 const 引用捕获」：`catch (const std::exception& e)`。按值捕获会多拷一次，还会把派生类异常切成基类（对象切片），你在子类里带的字段就此消失。",
        "catch 的匹配顺序是由具体到一般：先派生类，再 `std::exception`，最后才考虑 `catch(...)`。顺序写反了编译器会直接报「之前的 catch 已把它全接住」，而 `catch(...)` 之后的分支永远不可达。",
        "想在处理之后继续上报，用 `throw;` 原样重抛：它保留**原始类型**与抛出点信息；`throw e;` 是按 catch 参数的静态类型重新抛一份，又是一次切片——这一字之差非常隐蔽。",
        "异常不是「另一种 return」：抛出时局部对象一定会被析构（这正是 RAII 可靠的基础），但**裸 new、手动 fopen、手动 lock** 没有析构函数，就在那一刻泄漏了。所以「会不会抛」决定了「有没有用 RAII」这件事有多重要。",
        "什么时候不该用异常：预期的、常规的、调用方本来就要逐个处理的失败（没查到键、这行格式不对）用 optional 或错误码更清楚；异常留给「这里没法处理、只有上层才知道怎么办」的情况，比如构造失败、资源耗尽、不变量被破坏。",
        "衔接：本章前置是 s9 的 RAII 与 s10 的继承与虚函数（异常类型的层次就靠它们工作）；16-1 会抛会接之后，16-2 看标准库备好的类型树，16-3 补业务类型，16-4 谈承诺与异常安全。"
      ],
      summary_en: [
        "An exception ships a problem straight from where it happens to where someone can actually deal with it: throw yields an object, the runtime walks up the call stack to the first matching catch, and every frame in between is destroyed on the way (unwinding). It deletes the noise of handing error codes back level by level.",
        "The three clauses each have one job: try wraps the code that may fail; catch matches by type and, if it does not match, the search continues upward; after a throw not one remaining statement of the current function runs - never write code that assumes it will.",
        "The standard pairing is throw-by-value with catch-by-const-reference: catch (const std::exception& e). Catching by value copies once more and slices a derived exception down to its base, which is where the extra fields you carefully carried disappear.",
        "Order the handlers from specific to general: derived classes first, then std::exception, and catch(...) only last. Reverse it and the compiler tells you an earlier catch already swallowed everything, while any clause after catch(...) is permanently unreachable.",
        "To report further after handling, rethrow as-is with 'throw;': it keeps the original dynamic type and the throw site. 'throw e;' rethrows a new object of the catch parameter's static type - another slice, and one character away.",
        "An exception is not just another return value: local objects are guaranteed to be destroyed on the way out (the very thing that makes RAII dependable), but a raw new, a hand-rolled fopen or a manual lock has no destructor and leaks at that instant. Whether a function may throw therefore decides how much you need RAII.",
        "When not to use exceptions: expected, routine outcomes the caller must handle case by case (key not found, malformed line) belong in optional or an error code. Keep exceptions for 'this layer cannot fix it, only something above can' - failed construction, exhausted resources, a broken invariant.",
        "Bridge: this chapter leans on s9's RAII and s10's inheritance and virtual functions (the exception type hierarchy is built from them). After 16-1 throws and catches, 16-2 surveys the standard library's ready-made tree, 16-3 adds business types and 16-4 covers promises and exception safety."
      ],
      code: `#include <iostream>
#include <stdexcept>
#include <string>

double divide(double a, double b) {
    if (b == 0.0)
        throw std::invalid_argument("除数不能为 0");     // 按值抛出，类型就是 invalid_argument
    return a / b;
}

int main() {
    try {
        double v = divide(6.0, 0.0);
        std::cout << "抛出之后的代码不会执行\\n";
        std::cout << v << "\\n";
    } catch (const std::out_of_range& e) {          // 具体的类型写在前面
        std::cerr << "越界：" << e.what() << "\\n";
    } catch (const std::invalid_argument& e) {      // 再接业务里最常用的
        std::cerr << "参数错了：" << e.what() << "\\n";
    } catch (const std::exception& e) {             // 基类兜住所有标准异常
        std::cerr << "其它异常：" << e.what() << "\\n";
        // 想继续上报就写 throw;，写成 throw e; 会再切一次
    } catch (...) {                                 // 只留给最后的兜底与翻译
        std::cerr << "未知异常\\n";
    }
    return 0;
}`,
      pit: "把捕获写成 `catch (std::exception e)`（少了 &）：编译通过、也能接住，但异常被复制了一份且发生对象切片，`e.what()` 只剩基类那句泛泛描述，你自定义异常里带的文件名、行号全部拿不到。",
      pit_en: "Writing 'catch (std::exception e)' without the ampersand: it compiles and catches, but the exception is copied and sliced to its base, so e.what() keeps only the generic base message and the file name and line number you carried in your own type are gone.",
      ex: {
        q: "`throw;` 和 `throw e;` 有什么区别？",
        a: "前者原样重抛正在处理的那个异常，保留原始动态类型；后者按 catch 参数的静态类型新建并抛出一个切片后的对象。",
        q_en: "What is the difference between 'throw;' and 'throw e;'?",
        a_en: "The first rethrows the exception being handled unchanged, keeping its dynamic type; the second constructs and throws a new object of the catch parameter's static type - a slice."
      }
    },

    "16-2": {
      min: 12,
      summary: [
        "标准库给了一棵异常类型树：根是 `std::exception`（只保证 `what()`），往下分 `logic_error`（程序逻辑错，理论上运行前就该发现）与 `runtime_error`（环境错，事前无法预知），再往下才是 `invalid_argument`、`out_of_range`、`length_error`、`range_error`、`overflow_error` 等。",
        "选类型的判据只有一条：这个失败是不是「调用方事先传错了参数」？是 → logic_error 家族；不是，取决于 IO、内存、网络、时钟 → runtime_error 家族。这个区分同时决定了它是否值得被兜底捕获。",
        "`what()` 返回 `const char*`，指向异常对象内部的表示——不要在异常处理完之后还留着这个指针；要把错误文本记进日志，就在 catch 里当场 `std::string(e.what())` 复制下来。",
        "`<stdexcept>` 家族构造函数收的就是消息文本：`std::runtime_error(msg)`、`std::out_of_range(msg)`。自定义异常照这个模式把文本交给基类（见 16-3），`what()` 才会有内容可回。",
        "标准库自己就会抛：`vector::at`、`map::at`、`unordered_map::at` 越界或没有这个键时抛 `std::out_of_range`；`substr` 位置非法抛 `out_of_range`；`vector` 扩容失败抛 `std::bad_alloc`；`std::stoi` 抛 `invalid_argument`/`out_of_range`。",
        "对照的是 `operator[]`：容器下标越界是未定义行为（不抛、不报、可能改写别的内存），而 `map[key]` 更温柔也更阴险——没有这个键就**插入默认值**，静默改容器。要在只读路径上查，用 `at()` 或 `find()`。",
        "系统级错误用 `std::system_error`（`<system_error>`），它带一个 `error_code`，能把 errno/GetLastError 翻成异常；`std::filesystem` 的多数操作失败时抛 `filesystem_error`，同时几乎都提供收 `error_code&` 的不抛重载，让你按场景选边。",
        "接不住就到底：异常一路抛出 `main` 之外，或在不该抛的地方抛出，程序调 `std::terminate` 当场终止（连日志都来不及写）。衔接：类型够用了就先别自己造；等真要按业务分类处理，16-3 讲怎么继承并携带字段。"
      ],
      summary_en: [
        "The standard library hands you a tree: std::exception at the root (promising only what()), then logic_error (bugs in program logic, arguably findable before running) versus runtime_error (environment faults nobody could predict), and only below those invalid_argument, out_of_range, length_error, range_error, overflow_error and friends.",
        "One test picks the branch: could the caller have passed a bad argument? Yes - logic_error family. No, it depends on IO, memory, network or the clock - runtime_error family. The same split tells you whether it deserves a catch-all at the top.",
        "what() returns const char* pointing into the exception object's own representation - do not keep that pointer after the handler finishes. If you want the text in a log, copy it right there with std::string(e.what()).",
        "The <stdexcept> family takes the message in its constructor: std::runtime_error(msg), std::out_of_range(msg). Your own exceptions should forward theirs the same way (see 16-3), otherwise what() has nothing to say.",
        "The library throws on its own: vector::at, map::at and unordered_map::at raise std::out_of_range for a bad index or missing key, substr complains the same way, growing a vector can throw std::bad_alloc, and std::stoi throws invalid_argument or out_of_range.",
        "Compare operator[]: an out-of-range subscript on a container is undefined behaviour - no throw, no report, possibly a rewrite of something else's memory - while map[key] is gentler and nastier, inserting a default value and silently mutating the container. On read-only paths use at() or find().",
        "OS-level failures belong in std::system_error (<system_error>), which carries an error_code and translates errno or GetLastError into an exception; most std::filesystem operations throw filesystem_error and, in parallel, offer a non-throwing overload taking error_code& so each call site can choose.",
        "If nobody catches, it falls off the end: an exception escaping past main, or one escaping where it must not, calls std::terminate and the program stops on the spot, without even a log line. Bridge: use the standard types while they suffice, and only invent your own when callers genuinely need to branch by business category - that is 16-3."
      ],
      code: `#include <filesystem>
#include <iostream>
#include <stdexcept>
#include <string>
#include <system_error>
#include <vector>

int main() {
    std::vector<int> v{1, 2, 3};

    // 下面这行不抛异常：越界是未定义行为，可能悄悄改写别的内存
    // v[100] = 1;
    try {
        int x = v.at(100);         // 抛 std::out_of_range，上层能接住
        std::cout << x << "\\n";
    } catch (const std::out_of_range& e) {
        std::cerr << "索引越界：" << e.what() << "\\n";
    }

    std::error_code ec;            // 不抛的那条重载：留给要看错误码做决策的调用方
    auto size = std::filesystem::file_size("nope.txt", ec);
    if (ec) {                      // size 此时不可信，只看 ec
        std::cerr << "文件系统错误：" << ec.message() << "\\n";
        // 上层不吃返回码就在这里翻译成 std::system_error，否则带着 ec 直接 return
    } else {
        std::cout << "文件大小 " << size << "\\n";
    }

    try {
        int n = std::stoi("12x");
        std::cout << n << "\\n";
    } catch (const std::invalid_argument&) {   // 不需要消息时可以不接名字
        std::cerr << "开头就不是数字\\n";
    }
    return 0;
}`,
      pit: "把语义全塞进消息文本、类型随便给一个：`throw std::runtime_error(\"文件打不开\")` 之后，上层想区分「不存在」和「没权限」只能去比对中文串——文案一改逻辑就断。带上正确的类型（或自定义子类）比把话说长得多更有用。",
      pit_en: "Encoding all the meaning in the message text with a generic type: after 'throw std::runtime_error(\"cannot open file\")', a caller that wants to distinguish 'missing' from 'denied' has to compare message strings, and rewording breaks the logic. Choosing the right type beats writing a longer sentence.",
      ex: {
        q: "为什么 `v[i]` 越界不抛异常反而是 `v.at(i)` 抛？",
        a: "`operator[]` 为了零开销不做边界检查，越界直接是未定义行为；`at()` 把检查显式买回来，代价是一次判断，出错时以 std::out_of_range 的形式交给你处理。",
        q_en: "Why does v[i] out of range not throw while v.at(i) does?",
        a_en: "operator[] skips bounds checking to stay free, so an invalid index is undefined behaviour; at() buys the check back for the price of one comparison and reports a violation as std::out_of_range."
      }
    },

    "16-3": {
      min: 12,
      summary: [
        "自定义异常的标准做法是继承标准家族而不是裸 `std::exception`：`struct ConfigError : std::runtime_error { ... }`。这样上层既能按你的类型精确捕获，也能用 `catch (const std::exception&)` 一次性兜底，两全。",
        "`what()` 的签名是 `const char* what() const noexcept`。写自己的版本时必须带 `override`：漏了 const、改了参数列表，它就不是覆盖而是新加了一个同名函数，通过基类引用调用时拿到的还是基类那句默认消息。",
        "携带消息的正确姿势是把文本交给基类构造：`ConfigError(const std::string& m) : std::runtime_error(\"config: \" + m) {}`。自己在成员里存 `std::string` 再 `return s.c_str()` 也能用，但要清楚它指向成员内部，生命周期跟着异常对象走。",
        "异常的价值 = 类型 + 少量结构化字段：`std::string file; int line;` 这类让上层可以按行号、按键名决定策略。把大块缓冲、整个容器塞进异常会让抛出变贵，还可能在建异常的过程中二次抛出。",
        "同一模块建议做成一棵小层次：`AppError` → `ConfigError` / `NetError` / `StorageError`，粒度停在「处理策略不同才分类型」。给每个函数配一个异常类是过度设计——调用方接不过来，就等于没设计。",
        "绝对别 `throw 42;` 或 `throw \"出错了\";`：数字和字符串字面量没有语义类型，上层只能靠 `catch (int)` 硬猜，拿不到 `what()`，还会把第三方库的兜底捕获整个废掉。",
        "抛出点的源位置要自己补进消息（文件名、行号、键名），因为 C++17 还没有 `std::source_location`（C++20 才有）。想把「原因链」带上去，用 `std::throw_with_nested` 和 `std::exception_ptr`——进阶用法，eng 章会再遇到。",
        "衔接：有了自己的类型，16-4 谈「哪些函数承诺不抛」以及异常安全的三个等级，那决定你的接口能不能被放心地嵌进别人的 RAII 里。"
      ],
      summary_en: [
        "The standard shape of a custom exception inherits from the standard family rather than raw std::exception: 'struct ConfigError : std::runtime_error { ... }'. Callers can then catch your type precisely and still sweep everything up with one catch (const std::exception&).",
        "The signature to match is 'const char* what() const noexcept', so always write override. Drop the const or change the parameter list and you have not overridden anything - you added a same-named function, and calls through a base reference still return the base's bland default message.",
        "Pass the text up to the base constructor: ConfigError(const std::string& m) : std::runtime_error(\"config: \" + m) {}. Storing your own std::string member and returning s.c_str() also works, as long as you remember the pointer addresses that member and lives and dies with the exception object.",
        "An exception is worth its type plus a few structured fields: a file name and a line number let the caller decide policy per line or per key. Stuffing buffers or whole containers into it makes throwing expensive and risks a second exception while building the first.",
        "Keep one small hierarchy per module - AppError into ConfigError, NetError, StorageError - and stop at 'a different type only when the handling differs'. One class per function is over-design: callers cannot catch that many, so it might as well not exist.",
        "Never 'throw 42;' or 'throw \"something failed\";': numbers and string literals carry no semantic type, callers can only guess with catch (int), there is no what(), and every third-party library's careful base-class fallback is defeated.",
        "Source position has to be written into the message yourself (file, line, key), because C++17 has no std::source_location yet - that is C++20. For a chain of causes use std::throw_with_nested and std::exception_ptr, which the engineering chapter revisits.",
        "Bridge: now that you have your own types, 16-4 asks which functions promise not to throw and what the three exception-safety levels mean - that is what decides whether your interface can be nested safely inside someone else's RAII."
      ],
      code: `#include <iostream>
#include <stdexcept>
#include <string>

// 一个模块的异常树：只在处理策略不同时才分类型
struct AppError : std::runtime_error {
    explicit AppError(const std::string& msg) : std::runtime_error(msg) {}
};

struct ConfigError : AppError {
    ConfigError(const std::string& file, int line_no, const std::string& why)
        : AppError(file + ":" + std::to_string(line_no) + ": " + why),
          file_(file), line_(line_no) {}

    int line() const noexcept { return line_; }   // 结构化字段：让上层按行号决策
    const std::string& file() const noexcept { return file_; }

  private:
    std::string file_;
    int line_;
};

struct NetError : AppError {
    explicit NetError(const std::string& msg) : AppError(msg) {}
};

void loadConfig() { throw ConfigError("app.cfg", 7, "limit 不是整数"); }

int main() {
    try {
        loadConfig();
    } catch (const ConfigError& e) {               // 先接最具体的
        std::cerr << "配置错，文件 " << e.file() << " 第 " << e.line()
                  << " 行：" << e.what() << "\\n";
    } catch (const AppError& e) {                  // 模块内其它错误
        std::cerr << "应用错误：" << e.what() << "\\n";
    } catch (const std::exception& e) {            // 第三方与标准库兜底
        std::cerr << "其它：" << e.what() << "\\n";
    }
    return 0;
}`,
      pit: "自定义异常忘了写 `override`：签名差一点（漏 const、参数不同）它就只是新增函数，虚表里没有它。程序照样抛、照样被接住，但 `catch (const std::exception&)` 里 `e.what()` 拿到的是基类默认消息——你精心拼好的文本永远不出现在日志里。",
      pit_en: "Forgetting override on a custom exception: with a signature that is even slightly off (missing const, different parameters) you declared a new function rather than overriding one, so the vtable still points at the base. The throw and catch work, but e.what() inside catch (const std::exception&) returns the base default and your carefully built text never reaches the log.",
      ex: {
        q: "自定义异常该继承 `std::exception` 还是 `std::runtime_error`？",
        a: "一般继承 runtime_error（或 logic_error）这一支：what() 与消息构造都已经实现好，你只加字段，同时保住上层按 std::exception 兜底的能力。",
        q_en: "Should a custom exception derive from std::exception or from std::runtime_error?",
        a_en: "Usually from the runtime_error (or logic_error) side: what() and message storage already work, you only add fields, and callers keep the ability to sweep up by std::exception."
      }
    },

    "16-4": {
      min: 13,
      summary: [
        "「异常安全」不是「不抛异常」，而是一个承诺：即使中途抛出，资源不泄漏、对象状态不被破坏（仍是合法值）、该释放的一定释放。它是接口方的义务，不是运气好。",
        "三个等级要背下来：基本保证（对象处于合法但未指定的状态、资源不漏，最常用也最容易做到）、强烈保证（要么完全成功要么完全回滚，像事务，靠 copy-and-swap 实现）、不抛保证（`noexcept`，析构、swap、移动必须落在这一档）。",
        "栈展开的顺序就是销毁顺序：从抛出点向上，每个栈帧里**已构造完成**的局部对象按构造的逆序析构；还没构造完的那一层不算数——这正是「构造函数里抛出时，本对象的析构函数不会被调用」的原因。",
        "`noexcept` 在现代 C++ 里是性能开关而不只是文档：`std::vector` 扩容只有在元素「有不抛的移动构造」时才敢移动，否则退回逐个拷贝。移动构造漏写 noexcept，常常让整个容器悄悄变慢一个量级。",
        "承诺要掂量：`noexcept` 函数里真的抛出，异常不会传播，程序直接 `std::terminate()`。实用的判断标准是「这个函数做的事是否不可能失败」——swap、简单移动、访问器、析构，这些才配得上 noexcept。",
        "析构函数绝对不要抛：它要么在正常销毁路径上、要么已经在一个异常展开之中，后者再抛就是 terminate，现场连日志都留不下。可能失败的关闭动作要给一个显式的 `commit()/close()`，析构里只做「还没提交就丢弃并记一笔」。",
        "手动释放是异常不安全的主要来源：`new` 之后紧接一句可能抛出的调用，`delete` 就来不及执行。把所有权交给 RAII（`unique_ptr`、`lock_guard`、fstream）之后，这类泄漏从结构上消失，不需要每条分支都记得 free——s17 正面讲智能指针。",
        "`catch(...)` 是最后一道墙，不是垃圾桶：它把逻辑错误也一起吞掉，只在「翻译异常」「线程/main 边界兜底并记录」时才算正当，而且吞之前必须留痕（写日志或返回错误码）。忘了这条，bug 会安静到你永远查不出来。"
      ],
      summary_en: [
        "'Exception safe' does not mean 'never throws'; it is a promise: even if something throws midway, no resource leaks, no object is left corrupt (every invariant still holds), and everything that must be released is released. It is an obligation of the interface, not luck.",
        "Memorise the three levels: basic guarantee (the object ends in a valid but unspecified state, nothing leaks - the common, achievable one), strong guarantee (all or nothing, like a transaction, typically by copy-and-swap), and no-throw guarantee (noexcept - what destructors, swap and moves must deliver).",
        "Unwinding destroys in exactly the reverse order of construction: from the throw point upward, every fully constructed local in each frame is destroyed, and the frame whose construction never finished does not get a destructor call - which is precisely why a throw from a constructor never runs that object's destructor.",
        "noexcept is a performance switch, not documentation: std::vector may only move elements while growing if they have a non-throwing move constructor, otherwise it copies them one by one. A missing noexcept on a move constructor quietly costs whole containers an order of magnitude.",
        "Weigh the promise: anything thrown inside a noexcept function is not propagated - the program calls std::terminate. The working test is 'can this function possibly fail at all': swap, simple moves, accessors and destructors qualify; most other things do not.",
        "Never throw from a destructor: it runs either on the normal destruction path or already in the middle of unwinding, and a second exception there means terminate with no log left behind. If closing can fail, expose an explicit commit()/close() and let the destructor do only 'if uncommitted, discard and note it'.",
        "Manual release is the main source of exception unsafety: after a new, the very next call may throw and the delete never runs. Hand ownership to RAII (unique_ptr, lock_guard, fstream) and that class of leak disappears structurally - no branch has to remember to free; s17 covers smart pointers head-on.",
        "catch(...) is the last wall, not a bin: it swallows logic errors along with everything else and is legitimate only when translating exceptions or as the thread/main boundary that records and returns a code. Swallowing without a trace turns a bug into something you will never find."
      ],
      code: `#include <cstddef>
#include <iostream>
#include <memory>
#include <new>
#include <string>
#include <vector>

struct Buffer {
    std::unique_ptr<std::byte[]> data;     // 不再手写 delete：抛出也照样释放
    std::size_t n = 0;

    explicit Buffer(std::size_t k) : data(std::make_unique<std::byte[]>(k)), n(k) {}
    Buffer(Buffer&&) noexcept = default;   // 不标 noexcept，vector 扩容就退回拷贝
    Buffer& operator=(Buffer&&) noexcept = default;
    Buffer(const Buffer&) = delete;        // 独占资源：不给拷贝
};

// 强烈保证：先在副本上做，全部成功了才交换
void appendAll(std::vector<std::string>& v, const std::vector<std::string>& more) {
    auto tmp = v;                          // 用一次拷贝换回滚能力
    for (const auto& s : more) tmp.push_back(s + \"!\");
    v.swap(tmp);                           // noexcept 的 swap：提交点只在这一行
}

// 析构不抛：可能失败的动作交给显式的提交函数
class LogFile {
  public:
    void write(const std::string& s) { pending_.push_back(s); }
    bool commit() noexcept { flushOrMarkFailure(); return ok_; }

    // 析构里只做不会失败的事：没提交就丢弃，绝不再抛
    ~LogFile() { if (!ok_) pending_.clear(); }
  private:
    void flushOrMarkFailure() { ok_ = true; }
    std::vector<std::string> pending_;
    bool ok_ = false;
};

int main() {
    std::vector<std::string> log;
    try {
        std::vector<Buffer> pools;
        pools.emplace_back(64);
        pools.emplace_back(128);           // 扩容时按 noexcept 选择移动而非拷贝
        appendAll(log, {\"a\", \"b\"});       // 要么两条都加，要么一条都不加
    } catch (const std::bad_alloc& e) {
        std::cerr << "内存不够，但对象都析构了：" << e.what() << "\\n";
    }
    std::cout << "日志共 " << log.size() << " 条\\n";
    return 0;
}`,
      pit: "在析构函数里调 `close()` / `fclose()` / 提交事务并且不吞异常：正常路径没事，可一旦已经有一个异常在展开，第二个异常当场 `std::terminate`，你连「出过什么错」都不知道。析构里只做不会失败的事。",
      pit_en: "Calling close()/fclose()/commit inside a destructor without swallowing failures: the normal path is fine, but if an exception is already unwinding, the second one triggers std::terminate on the spot and you never learn what went wrong. A destructor may only do things that cannot fail.",
      ex: {
        q: "为什么给移动构造加 `noexcept` 会直接影响 `std::vector` 的性能？",
        a: "扩容时标准库用 is_nothrow_move_constructible 判断能不能安全移动，没标 noexcept 就视为可能抛，于是退回逐个拷贝以保证异常安全。",
        q_en: "Why does putting noexcept on a move constructor directly change std::vector's performance?",
        a_en: "While growing, the library asks is_nothrow_move_constructible whether moving is safe; without noexcept the move counts as possibly throwing, so it falls back to copying element by element to stay exception safe."
      }
    },

    "16-5": {
      title: "综合重构：错误码、optional 还是异常",
      title_en: "Synthesis: Error Codes, optional, or Exceptions",
      min: 14,
      target: "拿到一个函数，能一次决定它用返回值还是异常报告失败并写出对应实现，同时说清这条选择在调用方、noexcept 边界和跨语言边界上的后果。",
      target_en: "Given a function, decide in one pass whether it reports failure through a return value or an exception, implement that choice, and state its consequences for callers, noexcept boundaries and language boundaries.",
      summary: [
        "三件工具各有主场：返回值/错误码表达「预期内、调用方必须处理」（未命中、超时该重试）；`std::optional`（C++17）表达「可能没有值但这不是错」（查表未命中）；异常表达「这里处理不了，交给上层」。",
        "一条硬判据：调用方**在这里有没有能力**把它修好？有 → 返回值或 optional，就地处理；没有 → 抛出，别用错误码假装还有选择。反过来，把「文件不存在」抛成异常又在同一个函数里立刻 catch 住，只是绕了远路的 if。",
        "混用要有边界规则：对外接口与热路径用错误码（`std::error_code`，或自造的 `{ok, message}` 结构），业务层内部用异常，**在跨界处集中翻译**——catch 之后转成返回码，或把返回码 raise 成异常。两边都翻就等于没定规则。",
        "跨语言、跨进程边界带不动异常：C 接口、回调、线程入口、IPC 序列化只能传整数与字符串，所以线程函数与 main 的最外层必须有一个 `catch(...)` 把异常翻译成错误码再返回——这是 `catch(...)` 最正当的用法。",
        "真实性价比：抛出要走栈展开、构造异常对象、常常还触发一次内存分配，失败率高时比返回码贵得多；「解析器逐 token 抛异常」「循环里用异常表示结束」都是反模式（s15 里让流 `exceptions()` 打开也要掂量这点）。",
        "选型自查六问：这种失败常见吗？调用方能就地恢复吗？要携带几个字段？会不会穿过 noexcept 边界或析构？会不会泄漏资源？出错后程序还能继续用吗？——答完就把它固定成模块规范，别在同一个库里三种风格混着来。",
        "两章合并复盘：s15 的静默失败（不检查打开）→ 本章要选一个报告方式；漏检查 is_open、按值捕获切片、catch(...) 吞掉一切、析构里抛、noexcept 里抛、错误码看完就丢——六条各对应一节课，也都能用「正确的类型 + RAII + 明确的边界」挡掉。",
        "衔接：下一站 s17 现代 C++ 特性会给这些选择配上更好的工具——`optional` 表示「没有值」、`string_view` 省掉拷贝、智能指针让「出错也不泄漏」成为默认，而 `override`/`noexcept` 让承诺写进类型里。"
      ],
      summary_en: [
        "Each tool has its home turf: return values and error codes say 'expected, and the caller must deal with it' (miss, timeout worth retrying); std::optional (C++17) says 'there may be no value, but nothing went wrong' (lookup miss); exceptions say 'this layer cannot handle it, it belongs above'.",
        "One hard test: can the caller fix it right here? Yes - use a return value or optional and handle it on the spot. No - throw, and stop pretending an error code leaves a choice. The converse anti-pattern is throwing 'file not found' and immediately catching it in the same function: that is an if statement taking the scenic route.",
        "Mixing needs a boundary rule: public interfaces and hot paths speak error codes (std::error_code, or a home-grown {ok, message} struct), business layers inside speak exceptions, and translation happens once at the crossing - catch then return a code, or raise a code into an exception. Translating in both directions means you never picked a rule.",
        "Exceptions do not cross language or process boundaries: C APIs, callbacks, thread entry points and IPC payloads carry only integers and strings, so the outermost layer of a thread function or main needs a catch(...) that turns an exception into a code before returning - the most legitimate use of catch(...) there is.",
        "Real cost accounting: throwing unwinds the stack, constructs an object and often allocates, which is far dearer than a return code when failures are the common case; a parser that throws per token, or a loop that reports 'finished' with an exception, is an anti-pattern (the same caution applies to turning on stream exceptions() from s15).",
        "Six selection questions: how often does this fail, can the caller recover here, how many fields must travel with it, does it cross a noexcept boundary or a destructor, can it leak anything, is the program still usable afterwards? Answer them once per module and freeze the result as a convention instead of running three styles side by side.",
        "Two-chapter retrospective: s15's silent failures (an unchecked open) now need a reporting channel; a missed is_open check, slicing by value, catch(...) swallowing everything, throwing from a destructor, throwing inside noexcept, and discarding an error code - six lessons, all blocked by the same trio of correct type plus RAII plus an explicit boundary.",
        "Bridge: next stop s17 hands these choices better tools - optional for 'no value', string_view to skip copies, smart pointers that make 'no leak on error' the default, and override/noexcept that write the promise into the type."
      ],
      code: `#include <fstream>
#include <iostream>
#include <optional>
#include <stdexcept>
#include <string>

// 1) 可能没值但不是错误：查表未命中交给 optional
std::optional<int> findLimit(const std::string& key) {
    if (key == \"max\") return 100;
    if (key == \"min\") return 1;
    return std::nullopt;                     // 没有这个键：怎么办留给调用方
}

// 2) 预期内、可恢复、还要带上原因：返回一个状态结构
struct Status {
    bool ok = true;
    std::string message;
    explicit operator bool() const { return ok; }
};

Status loadPort(int& out) {
    std::ifstream fin(\"net.cfg\");
    if (!fin) return {false, \"打不开 net.cfg\"};            // 不抛：调用方就在上一层
    int v = 0;
    if (!(fin >> v) || v <= 0 || v > 65535) return {false, \"port 非法\"};
    out = v;
    return {};
}

// 3) 处理不了就抛，并且在边界集中翻译成返回码
int run() noexcept {
    try {
        if (auto v = findLimit(\"max\"); !v) throw std::logic_error(\"内置键丢了\");
        int port = 0;
        if (Status s = loadPort(port); !s) {                // 可恢复：就地处理并给码
            std::cerr << \"配置问题：\" << s.message << \"\\n\";
            return 3;
        }
        std::cout << \"端口 \" << port << \" 就绪\\n\";
    } catch (const std::exception& e) {                     // 边界：异常到此为止
        std::cerr << \"致命：\" << e.what() << \"\\n\";
        return 1;
    } catch (...) {                       // 非标准异常也要翻译掉，否则 noexcept 直接终止
        return 2;
    }
    return 0;
}

int main() { return run(); }`,
      pit: "把异常当控制流用在预期内的常规分支上——比如在解析循环里 throw「到行尾了」再在同一个函数里 catch：代码被切成两段互不相干的片段，性能远不如一次 if，最糟的是这条 catch 会顺手把真正的错误也一起吃掉。",
      pit_en: "Using exceptions as control flow for ordinary expected outcomes - throwing 'end of line' inside a parse loop and catching it in the same function: the code splits into two unrelated halves, it is far slower than an if, and worst of all that catch also swallows the real errors traveling past it.",
      ex: {
        q: "什么情况下该选 `std::optional`，既不抛异常也不返回错误码？",
        a: "当「没找到/没值」本身就是正常结果、不需要携带原因、而且调用方一定要判空时用 optional；一旦要区分多种失败原因，就该换成错误码或异常。",
        q_en: "When should std::optional be the answer, instead of an exception or an error code?",
        a_en: "When 'no value' is itself a normal outcome, carries no reason to report, and the caller must check anyway. As soon as several distinct failure causes have to be told apart, switch to an error code or an exception."
      }
    },

    /* ===================== s17 现代 C++ 特性 ===================== */
    "17-1": {
      min: 12,
      summary: [
        "`auto` 的推导规则等价于「模板参数按值推导再脱壳」：先丢掉引用，再丢掉顶层 const，数组和函数退化成指针。所以 `const int x = 1; auto y = x;` 里 y 是 `int`，既不是 const 也不是引用。",
        "想保留语义必须自己写出来：`auto& r = x;` 是能改原对象的引用，`const auto& c = x;` 是零拷贝只读引用，`auto&& p = x;` 是万能引用（能接左值也能接右值）。这三个后缀的差别直接决定下一节遍历容器时你改的是元素还是副本。",
        "花括号配 auto 有特例：`auto a = {1, 2};` 推成 `std::initializer_list<int>`，而 `auto b{1};`（单元素、不带等号）推成 `int`。记不住就一条：别让 `auto` 和 `{}` 挨着写。",
        "`decltype(e)` 的规则恰好相反：它**保留**引用与 const，只回答「这个表达式是什么类型」而不做任何初始化。`int x; decltype(x) a;` 里 a 是 `int`，但 `decltype((x))` 是 `int&`——多套一层括号，表达式类别变了，类型就变了。",
        "什么时候该用 auto：右边类型一目了然（`auto i = 0;`、迭代器、lambda）时用它能去掉噪音；什么时候必须写死类型：类型本身携带语义时——`auto n = v.size();` 悄悄是 `size_t`（无符号），后面拿它跟 int 比较就埋下了雷。",
        "`const auto&` 是读代码时最好用的组合，遇到「只是不想拷」就先想它；但要接住代理返回类型（`std::vector<bool>` 的元素）得用 `auto&&` 或 `const auto&`，写 `auto` 会拷出一个假元素。",
        "C++17 还给了类模板参数推导（CTAD）：`std::pair p(1, 2.0);`、`std::vector v{1, 2, 3};` 不必重复写类型；配合尾返回类型 `-> auto`，模板函数也能省掉一长串 `decltype`。",
        "衔接：本章前置是 s9~s10 的类与多态、s12~s14 的容器与算法——特性本身不难，难在知道「哪一处该用」。17-2 把 `const auto&` 用在遍历上，那现代码第一次真的会因为少写两个字符而变慢或改不动。"
      ],
      summary_en: [
        "auto deduces exactly like a by-value template parameter: strip the reference, strip the top-level const, decay arrays and functions to pointers. So in 'const int x = 1; auto y = x;', y is int - neither const nor a reference.",
        "Keeping the meaning takes spelling it out: 'auto& r = x;' is a reference you can write through, 'const auto& c = x;' is a zero-copy read-only alias, 'auto&& p = x;' is a universal reference that binds to lvalues and rvalues alike. Those suffixes decide, in the very next lesson, whether your loop touches the elements or copies of them.",
        "Braces plus auto have a special case: 'auto a = {1, 2};' deduces std::initializer_list<int>, while 'auto b{1};' (one element, no equals sign) deduces int. If you cannot hold the rule, just never let auto and {} sit next to each other.",
        "decltype(e) obeys the opposite rule: it keeps reference and const because it only answers 'what type is this expression' and initialises nothing. With 'int x;', decltype(x) is int but decltype((x)) is int& - one extra pair of parentheses changes the value category and hence the type.",
        "Use auto when the type is obvious from the right-hand side (auto i = 0;, iterators, lambdas); spell the type out when the type itself carries meaning. 'auto n = v.size();' is silently size_t, unsigned, and the moment you compare it with an int the trap is set.",
        "const auto& is the highest-value combination - reach for it whenever you merely want to avoid copying. Proxy return types such as std::vector<bool> elements need auto&& or const auto&, because plain auto copies a pretend element that nobody will ever read back.",
        "C++17 adds class template argument deduction: std::pair p(1, 2.0); and std::vector v{1, 2, 3}; stop repeating the type, and a trailing return type '-> auto' spares template functions a wall of decltype.",
        "Bridge: this chapter presumes s9-s10 (classes, polymorphism) and s12-s14 (containers, algorithms); the features are easy, knowing where each one belongs is not. 17-2 applies const auto& to iteration, where two missing characters first start costing real speed or silently editing a copy."
      ],
      code: `#include <cstddef>
#include <iostream>
#include <string>
#include <type_traits>
#include <vector>

int main() {
    const std::string name = "huangdou";
    auto a = name;              // std::string：引用与顶层 const 都被剥掉，拷了一份
    const auto& b = name;       // 只读引用：零拷贝，也仍是 const
    auto&& c = name;            // 万能引用接住左值：const std::string&

    std::vector<int> v{1, 2, 3};
    for (auto x : v) x = 0;     // 改的是副本，v 一点没动
    for (auto& x : v) x = 0;    // 这一次才真的清零
    auto n = v.size();          // size_t：无符号，跟 int 比较就有坑

    // 推导结果不用猜，编译期就能钉死
    static_assert(std::is_same<decltype(a), std::string>::value, "");
    static_assert(std::is_same<decltype(b), const std::string&>::value, "");
    static_assert(std::is_same<decltype(c), const std::string&>::value, "");
    static_assert(std::is_same<decltype(n), std::size_t>::value, "");

    std::cout << b << c << n << a << "\\n";
    return 0;
}`,
      pit: "用 `auto` 去接代理返回类型：`std::vector<bool> flags; auto bit = flags[0]; bit = true;` 编译通过、值也确实改到了那个临时代理上，然后随它析构而消失——原容器毫无变化。`vector<bool>` 上一律写 `auto&&` 或 `const auto&`。",
      pit_en: "Catching a proxy return type with auto: 'std::vector<bool> flags; auto bit = flags[0]; bit = true;' compiles, does set the value on the temporary proxy, and then throws it away when the proxy dies - the container is untouched. On vector<bool>, always write auto&& or const auto&.",
      ex: {
        q: "为什么 `auto` 与 `decltype` 在保留 const/引用上的规则正好相反？",
        a: "auto 走的是「按值初始化」的推导，必然要脱掉引用与顶层 const；decltype 只是回答表达式的类型、不做初始化，所以原样保留。",
        q_en: "Why do auto and decltype follow opposite rules about const and references?",
        a_en: "auto deduces as if initialising by value, so references and top-level const must come off; decltype only reports an expression's type and initialises nothing, so it keeps them."
      }
    },

    "17-2": {
      min: 12,
      summary: [
        "范围 for 是「取一次区间、逐个走」的语法糖，编译器展开成 `for (auto it = begin(seq); it != end(seq); ++it)`，其中 begin/end 只在进入时求值一次——这就是循环里给容器换对象、重新分配会让一切迭代器失效的原因。",
        "元素声明就是普通的变量声明，因此完全继承 17-1 的规则：`for (auto x : v)` 每轮拷一份，`for (auto& x : v)` 才改得到原元素，`for (const auto& x : v)` 是只读遍历的默认写法。",
        "什么时候**该**拷：int、double、小 enum、`std::string_view` 这类几个字节的平凡类型，`auto x` 比 `const auto&` 更快（省一次间接寻址）；`std::string`、结构体、任何装着资源的类，一律 `const auto&`。",
        "边遍历边增删是最容易出事的写法：`push_back` 可能整体搬家让全部迭代器失效，`erase` 让被删位置之后失效。真要「按条件删一批」，回到 s14 的 erase-remove 惯用法或 `std::erase_if`（C++20），别在范围 for 里删。",
        "遍历一个临时对象要分情况：`for (auto x : makeVector())` 里的临时容器在 C++17 是活满整个循环的，安全；但如果元素是**指向容器自身缓冲的视图**（装着 `string_view` 的 vector）、或者范围是临时 `initializer_list`，视图和列表可能在循环中途悬空。不确定就先接进一个具名变量。",
        "结构化绑定与范围 for 是绝配：`for (const auto& [key, val] : map)` 一次拿到键和值，比 `it->first / it->second` 清楚得多；要改值就写 `for (auto& [key, val] : map)`——键永远是 const，改它编译不过。",
        "范围 for 也能带初始化语句（C++17）：`for (std::size_t i = 0; auto&& x : v)` 之类；但更常见的判断是——需要下标、要并行走两个容器、要反向遍历时就老老实实退回经典 for，别为了语法统一把循环写复杂。",
        "衔接：17-3 的智能指针会把「遍历一堆 new 出来的对象」变成遍历 `vector<unique_ptr<T>>`，那里的 `const auto&` 不再是风格问题而是编译能否通过的门槛。"
      ],
      summary_en: [
        "A range-for is sugar for 'take the range once, walk it': the compiler emits for (auto it = begin(seq); it != end(seq); ++it) with begin/end evaluated only on entry - which is exactly why replacing or reallocating the container inside the loop invalidates everything you are holding.",
        "The element declaration is an ordinary variable declaration, so 17-1's rules apply verbatim: 'for (auto x : v)' copies each round, 'for (auto& x : v)' is the one that reaches the real element, and 'for (const auto& x : v)' is the default for read-only walking.",
        "When copying is the better choice: for int, double, small enums and std::string_view - a few bytes that copy trivially - plain auto beats const auto& because it skips one indirection. For std::string, structs and anything owning a resource, const auto& without argument.",
        "Adding or removing while iterating is the shape that breaks: push_back may relocate the whole buffer and invalidate every iterator, erase invalidates from the removed position on. To delete a batch, go back to the erase-remove idiom from s14 (or std::erase_if in C++20) instead of erasing inside a range-for.",
        "Iterating a temporary depends on what the elements are: 'for (auto x : makeVector())' keeps that temporary alive for the whole loop in C++17 and is fine, but if the elements are views into the container's own buffer (a vector of string_view) or the range is a temporary initializer_list, they can dangle mid-loop. When unsure, bind the range to a named variable first.",
        "Structured bindings were made for range-for: 'for (const auto& [key, val] : map)' reads better than it->first / it->second, and 'for (auto& [key, val] : map)' lets you update the value while the key stays const - trying to write it simply fails to compile.",
        "A range-for can also carry an initialiser statement (C++17), but the honest rule is: the moment you need an index, two containers moving in parallel, or reverse order, drop back to a plain for instead of contorting the pretty syntax.",
        "Bridge: 17-3's smart pointers turn 'walk a bunch of newed objects' into walking a vector<unique_ptr<T>>, where const auto& stops being a style preference and becomes the price of compiling at all."
      ],
      code: `#include <algorithm>
#include <iostream>
#include <map>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> names{"a", "bb", "ccc"};

    for (const auto& s : names) std::cout << s.size();   // 只读遍历：零拷贝
    for (auto& s : names) s += "!";                      // 要改才写非 const 引用

    std::map<std::string, int> hits{{"x", 1}, {"y", 2}};
    for (const auto& [k, v] : hits) std::cout << k << "=" << v;  // 结构化绑定
    for (auto& [k, v] : hits) v *= 10;                   // 值可改，键永远是 const

    // 反例：在范围 for 里删元素，迭代器当场失效
    // for (const auto& s : names) if (s.empty()) names.erase(names.begin());

    // 正确姿势：erase-remove，见 s14
    names.erase(std::remove_if(names.begin(), names.end(),
                [](const std::string& s) { return s.size() > 3; }), names.end());

    std::vector<bool> flags{true, false, true};
    for (auto&& b : flags) b = !b;      // 代理元素：必须用引用接
    return 0;
}`,
      pit: "遍历大对象时随手写 `for (auto x : v)`：十万行日志就是十万次 string 堆分配，慢得莫名其妙；反过来在 `vector<bool>` 上写 `auto x` 又让修改静默丢失。同一个字母少与不少，两种翻车方向刚好相反。",
      pit_en: "Writing 'for (auto x : v)' over big objects: one hundred thousand log lines become one hundred thousand heap allocations for std::string, and the loop is inexplicably slow; conversely 'auto x' on a vector<bool> silently discards your writes. The same two missing characters fail in opposite directions.",
      ex: {
        q: "为什么 `for (const auto& x : v)` 通常更安全，却不是永远更好？",
        a: "引用省掉每次拷贝也保证读的是当前元素；但元素只是几个字节的标量或 string_view 时拷贝更快，而且引用版在遍历自引用的临时容器时更容易踩到悬空。",
        q_en: "Why is 'for (const auto& x : v)' usually safer but not always better?",
        a_en: "A reference skips every copy and guarantees you look at the live element; but when elements are a few-byte scalars or string_views, copying is faster, and the reference form dangles sooner around self-referential temporary ranges."
      }
    },

    "17-3": {
      min: 14,
      summary: [
        "智能指针不是「更安全的指针」，而是「把 delete 写进析构函数的对象」：谁拥有、什么时候释放，由类型决定而不是由注释决定——这是 s9 的 RAII 在堆上的落地。",
        "`std::unique_ptr<T>` 表示唯一所有权，大小和裸指针一样、零额外开销，不可拷贝只可移动；创建一律用 `std::make_unique<T>(args...)`（C++17）：异常安全、类型不写第二遍。函数返回它、`vector<unique_ptr<Shape>>` 装它，都是自然用法。",
        "把 `unique_ptr` 放进 `vector` 之后要记住：`push_back`/`emplace_back` 可能整体搬家，你之前从元素里取出的 `T&` 或 `T*` 就悬空了。规矩是——每次改变容器大小之后重新取，别把裸指针存在成员里。",
        "`std::shared_ptr<T>` 在控制块里放强/弱两个计数，拷贝只是计数加一；`make_shared` 把「对象 + 控制块」合成一次分配，比 `shared_ptr<T>(new T)` 少一次分配，也不会像旧式表达式那样在异常时丢掉计数。",
        "两条硬规则：永远不要写 `std::shared_ptr<A> q(p.get());`（两个互不相干的控制块 → 双重释放），也不要用同一个 `new` 出来的裸指针构造两个 shared_ptr。观察而不拥有就传 `T*` 或 `T&`；参数收 `const shared_ptr<T>&` 只在该函数确实要共享所有权时。",
        "`shared_ptr` 的**计数**是原子的，**指向的对象**不是：多线程读写同一对象仍然要自己加锁。控制块还有个次要特性：只要还有 weak_ptr 活着，对象占的那块内存就要等控制块一起释放才回收。",
        "循环引用是 `shared_ptr` 唯一真正会漏的地方：A 持 `shared_ptr<B>`、B 反过来持 `shared_ptr<A>`，两个计数永远到不了 0。修法是让拥有方向只有一个，反向用 `std::weak_ptr`（先 `lock()` 提升再用，提升失败就说明对方已经死了），或者 `unique_ptr` 拥有 + 裸指针观察。",
        "`unique_ptr` 的第二个模板参数是删除器，正好用来接管 C 资源：`std::unique_ptr<FILE, int(*)(FILE*)>(f, &std::fclose)`、目录句柄、`free` 都能这么包。做完这一步，模块里的 `delete`/`fclose`/`CloseHandle` 就全消失了。"
      ],
      summary_en: [
        "A smart pointer is not 'a safer pointer', it is an object with delete written into its destructor: who owns and when it frees is decided by the type, not by a comment. That is s9's RAII landing on the heap.",
        "std::unique_ptr<T> means sole ownership, costs exactly as much as a raw pointer, cannot be copied and can only be moved. Construct it with std::make_unique<T>(args...) (C++17) - exception safe and no repeated type name. Returning one from a function and storing them in a vector<unique_ptr<Shape>> are both natural uses.",
        "Remember after putting unique_ptrs in a vector: push_back/emplace_back may relocate the buffer, so every T& or T* you took out of an element earlier is now dangling. Re-fetch after any size change; do not cache a raw pointer in a member.",
        "std::shared_ptr<T> keeps strong and weak counters in a control block, so copying only increments one; make_shared allocates object and control block together, one allocation instead of two, and unlike shared_ptr<T>(new T) it cannot lose the count when an exception lands between them.",
        "Two iron rules: never write std::shared_ptr<A> q(p.get()); - that creates a second, unrelated control block and ends in a double free - and never build two shared_ptrs from the same raw new. To observe without owning, pass T* or T&; take a const shared_ptr<T>& only where the function genuinely shares ownership.",
        "The reference count of a shared_ptr is atomic; the pointee is not - concurrent reads and writes of the object still need your own lock. A secondary quirk of the control block: while any weak_ptr survives, the object's storage cannot be reclaimed until the block itself goes.",
        "A reference cycle is the one way shared_ptr really leaks: A holds shared_ptr<B>, B holds shared_ptr<A> back, and neither count ever reaches zero. Fix it by owning in one direction only and using std::weak_ptr the other way (lock() promotes before use; a failed promotion says the other side is already gone), or unique_ptr plus a non-owning raw observer.",
        "The second template argument of unique_ptr is a deleter, tailor-made for C resources: std::unique_ptr<FILE, int(*)(FILE*)>(f, &std::fclose) works for directories, free and platform handles too. Once that is done, delete, fclose and CloseHandle have vanished from the module."
      ],
      code: `#include <cstdio>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

struct Node {
    std::string name;
    std::shared_ptr<Node> next;      // 拥有下一个节点
    std::weak_ptr<Node> prev;        // 只观察上一个：循环就此打断
    ~Node() { std::cout << "~" << name << "\\n"; }
};

// 用删除器接管 C 资源：离开作用域自动 fclose
struct FileCloser { void operator()(FILE* f) const { if (f) std::fclose(f); } };
using FilePtr = std::unique_ptr<FILE, FileCloser>;

int main() {
    auto a = std::make_shared<Node>(); a->name = "A";
    auto b = std::make_shared<Node>(); b->name = "B";
    a->next = b;
    b->prev = a;                     // 反向若也用 shared_ptr，两个对象永远不析构

    if (auto p = b->prev.lock()) std::cout << "上一个叫 " << p->name << "\\n";
    std::cout << "引用计数 " << b.use_count() << "\\n";

    std::vector<std::unique_ptr<std::string>> rows;
    rows.push_back(std::make_unique<std::string>("row-1"));
    // 把裸指针存下来是隐患：下次扩容它就悬空
    // std::string* cache = rows[0].get();
    for (const auto& s : rows) std::cout << *s << "\\n";   // unique_ptr 不可拷贝

    FilePtr fin{std::fopen("demo.txt", "w")};
    if (fin) std::fprintf(fin.get(), "hello\\n");          // get() 只用不夺所有权

    auto up = std::make_unique<std::string>("mine");
    auto moved = std::move(up);      // 所有权转移：up 现在是空的
    std::cout << (up ? "还在" : "已被移走") << " " << *moved << "\\n";
    return 0;
}`,
      pit: "把 `shared_ptr` 当成「不用思考的默认选项」：每个对象多一个控制块和两次原子操作，所有权关系被抹平成「谁可能最后释放它」，再顺手送你对循环引用。默认用 `unique_ptr`，只有确实要共享寿命时才升级。",
      pit_en: "Treating shared_ptr as the no-thinking default: every object drags a control block and two atomic operations, ownership blurs into 'whoever releases it last', and you get reference cycles for free. Default to unique_ptr and upgrade only when lifetimes really must be shared.",
      ex: {
        q: "`weak_ptr` 为什么不能直接解引用，必须先 `lock()`？",
        a: "它只持有控制块而不持有对象；`lock()` 原子地检查强计数是否还在并提升出一个 shared_ptr，提升失败就把「可能悬空」变成一次看得见的判断。",
        q_en: "Why can a weak_ptr not be dereferenced directly, forcing you through lock()?",
        a_en: "It keeps the control block but not the object; lock() atomically checks whether the strong count is still alive and hands back a shared_ptr, turning 'might be dangling' into a visible test."
      }
    },

    "17-4": {
      min: 13,
      summary: [
        "Lambda 的本质是一个匿名类加一个 `operator()`，捕获列表就是它的成员初始化清单。接受这一层，所有「捕获陷阱」都会退化成普通的「这个成员是引用还是拷贝」问题。",
        "`[&]` 只保证「写这行的时候那些局部变量还在」。一旦被存进 `std::function`、丢进线程池、注册成异步回调，函数返回后原变量销毁，lambda 里的引用当场悬空——这是异步 C++ 的头号事故源。跨作用域一律显式按值捕获。",
        "`[=]` 也不是纯按值：在成员函数里它悄悄捕获 `this`（C++17 会警告，C++20 明确弃用这种隐式捕获），于是所有成员访问都是经由一个指针的**引用**语义。要真按值就把需要的成员一个个拷进捕获：`[v = value_]`。",
        "按值捕获还有对象切片风险：捕获的表达式经基类引用转换、或把派生类对象拷进基类类型的成员时，切掉的正是虚函数行为（s10 的切片在 lambda 上重现）。要带行为就带指针或引用，并确认寿命。",
        "`mutable` 允许修改**按值捕获的副本**——外部变量原封不动；要改外部必须是 `[&x]`。想把资源搬进 lambda 用 C++14 的捕获初始化：`[p = std::move(up)]() { ... }`，这是让 `unique_ptr` 进回调的唯一正确姿势。",
        "无捕获的 lambda 能隐式转成函数指针；一旦有了捕获就不能。要存起来的回调要么用模板参数（零开销、可能代码膨胀），要么 `std::function`（有堆分配和一次间接调用，接口清楚但略贵），别顺手给每个回调都套 `std::function`。",
        "`[](auto x){}` 是 C++14 泛型 lambda，等于给 `operator()` 加了模板；返回类型默认从 return 语句推导，多个 return 类型不一致、或想精确控制时就写 `-> T`。递归 lambda 需要显式类型（`std::function`）或把它自己当参数传进去。",
        "经验法则一句话：同步、马上用完 → `[&]` 省事；跨线程、要存、要回调 → 显式按值（必要时 `shared_ptr` 或捕获初始化）。衔接：17-5 的 `std::move` 让「把资源交给 lambda」这件事终于有类型可查。"
      ],
      summary_en: [
        "A lambda is an anonymous class plus its operator(), and the capture list is just its member initialiser list. Once you accept that, every 'capture trap' collapses into the ordinary question of whether a member is a reference or a copy.",
        "[&] only guarantees that the locals exist at the moment you write the line. Store the lambda in a std::function, hand it to a thread pool or register it as an async callback, and those variables die when the enclosing function returns, leaving dangling references behind - the leading cause of asynchronous C++ accidents. Capture explicitly by value whenever anything crosses a scope.",
        "[=] is not purely by value either: inside a member function it quietly captures this (warned about in C++17, that implicit capture is deprecated in C++20), so every member access is really going through a pointer with reference semantics. To truly copy, pull the members you need into initialiser captures: [v = value_].",
        "By-value capture also risks slicing: copying a derived object into a base-typed member strips exactly the virtual behaviour you wanted (s10's slicing, reincarnated in a lambda). Carry a pointer or reference when behaviour must travel, and be sure of its lifetime.",
        "mutable lets you modify the by-value copies - the outer variables stay untouched; changing those requires [&x]. To move a resource into the closure use a C++14 init-capture: [p = std::move(up)]() { ... }, which is the only correct way to get a unique_ptr into a callback.",
        "A capture-less lambda converts implicitly to a function pointer; add a capture and it cannot. A callback you intend to store either goes through a template parameter (zero overhead, possible code bloat) or a std::function (heap allocation plus one indirect call, clearer interface, slightly dearer) - do not wrap every lambda in std::function by reflex.",
        "[](auto x){} is a C++14 generic lambda, equivalent to templating operator(). The return type is deduced from the return statements; write -> T when several returns disagree or when you want to be explicit, and give a recursive lambda an explicit type (std::function) or pass it to itself.",
        "One-line rule: synchronous and used immediately - [&] is fine; anything crossing a thread, stored, or invoked later - capture by value explicitly, with shared_ptr or an init-capture as needed. Bridge: 17-5's std::move is what finally makes 'hand a resource to a lambda' checkable by the type system."
      ],
      code: `#include <algorithm>
#include <functional>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> data{"pear", "fig", "strawberry"};

    // 同步用完：[&] 最省事
    std::sort(data.begin(), data.end(),
              [](const std::string& a, const std::string& b) { return a.size() < b.size(); });

    int total = 0;
    std::for_each(data.begin(), data.end(),
                  [&total](const std::string& s) { total += static_cast<int>(s.size()); });
    std::cout << "共 " << total << " 个字符\\n";

    // 要活得比这次调用久：显式按值捕获
    int prefix = 3;
    auto makeTag = [prefix](std::string s) mutable -> std::string {
        return std::to_string(++prefix) + ":" + s;   // 改的是副本，外面的 prefix 不动
    };
    std::cout << makeTag("a") << " " << makeTag("b") << "\\n";

    // 把所有权搬进闭包：捕获初始化（C++14）
    auto buf = std::make_unique<std::string>("important");
    auto task = [b = std::move(buf)] { std::cout << "带走了 " << b->size() << " 字节\\n"; };
    task();                                  // 走到这里 buf 已经交给闭包，自身为空
    std::cout << (buf ? "buf 还在" : "buf 已经交给 lambda") << "\\n";

    std::function<int(int)> twice = [](int n) { return n * 2; };   // 要存起来就给类型
    std::cout << twice(21) << "\\n";
    return 0;
}`,
      pit: "把 `[&]` 的 lambda 交给新线程还 `detach()`：`std::thread t([&]{ use(local); });` 主函数一返回，栈帧销毁而线程还在跑，未定义行为；这类 bug 在 Debug 下经常「看起来正常」，一开优化就崩，且崩在完全无关的地方。",
      pit_en: "Handing a [&] lambda to a detached thread: the enclosing function returns, its stack frame dies, and the thread keeps reading it - undefined behaviour. In a debug build this often appears fine, then crashes after optimisation, in a place unrelated to the cause.",
      ex: {
        q: "成员函数里写 `[=]`，为什么 lambda 活得比对象久就是野指针？",
        a: "因为 `[=]` 捕获的是 this 指针而不是对象副本，所有成员访问都要经过它；对象析构之后再调用这个 lambda，就是对已释放内存的解引用。",
        q_en: "Why does [=] inside a member function turn into a wild pointer once the lambda outlives the object?",
        a_en: "Because [=] captures the this pointer, not a copy of the object, and every member access routes through it; calling the lambda after destruction dereferences freed memory."
      }
    },

    "17-5": {
      min: 12,
      summary: [
        "`std::move` 一个字节都不搬：它只是把左值强转成右值引用（xvalue），让重载决议看得见移动构造和移动赋值。真正的搬迁发生在你写的（或编译器生成的）那个移动构造里。",
        "被移动过的对象处于「有效但未指定」状态：它可以被重新赋值、可以被正常析构，但**读它的值**没有任何承诺。`auto s = std::move(v[0]); use(v[0]);` 这种「移完又看一眼」是典型逻辑 bug，而且常常在优化后才显形。",
        "什么时候移动才有肉：对象持有「不搬就贵」的资源——堆缓冲、文件描述符、socket、句柄，移动就是换个指针再把源置空；`std::string`、`std::vector` 移出是 O(1)。反过来 int、`pair<int,int>`、短于一格的 SSO 字符串，移动与拷贝没差别，写了不赚。",
        "从函数返回局部对象不要再写 `std::move`：`return local;` 有复制消除/NRVO，直接在调用方的存储里构造；手写 `return std::move(local);` 反而可能挡掉这条优化，还留下一个「已被移走」的局部变量给后面的代码踩。",
        "五法则与移动的耦合：一旦你手写了析构、拷贝构造或拷贝赋值中的任何一个，编译器就不再自动给你移动操作；这时要么全写、要么依赖零法则（s9），要么显式 `= default` 要回来，并给移动加 `noexcept`（否则容器扩容退回拷贝，见 16-4）。",
        "自己写移动构造的骨架就两步：「取出来源的指针」+「把来源置空」（或 `other = T{}`、或与默认构造 swap）。忘了第二步就是双重释放；成员全是 `unique_ptr`/`string`/容器时这两步由类型自动保证——所以优先用 RAII 成员而不是裸指针。",
        "接收方式要和移动配套：`void f(std::string s)` 配 `f(std::move(buf))` 才是「 caller 把资源交给你」；写成 `void f(const std::string&)` 却在函数里 move，只会拷一份出来。`x = std::move(x)` 是自移动，标准明确它是未指定状态，别写。",
        "衔接：17-6 处理「没有值」这件事的现代表示（nullptr、optional、string_view），和「移动之后对象还剩什么」其实是同一个思路的两种写法。"
      ],
      summary_en: [
        "std::move does not move a single byte: it casts an lvalue to an rvalue reference (an xvalue) so overload resolution can see the move constructor and move assignment. The actual transferring lives in the move constructor, whether you wrote it or the compiler generated it.",
        "A moved-from object is in a valid but unspecified state: you may assign to it again and destroy it normally, but reading its value promises nothing. 'auto s = std::move(v[0]); use(v[0]);' - glancing at the source after moving - is a textbook logic bug that usually surfaces only after optimisation.",
        "Moving only pays when the object owns something expensive to copy: a heap buffer, a file descriptor, a socket, a handle, where a move is a pointer swap plus nulling the source, making std::string and std::vector moves O(1). For int, pair<int,int> or a short SSO string, move and copy cost the same and writing move earns nothing.",
        "Do not std::move a local on return: 'return local;' enables copy elision/NRVO and constructs straight into the caller's storage, whereas 'return std::move(local);' can block that and leaves a moved-from local sitting there as bait for later code.",
        "The move-versus-five-rule coupling: declaring any of destructor, copy constructor or copy assignment suppresses the implicit move operations. Then write all five, rely on the rule of zero from s9, or ask for them back with '= default' - and put noexcept on the moves, or containers fall back to copying when they grow (see 16-4).",
        "A hand-written move constructor has two steps: take the source's pointers, then empty the source (nullptr, other = T{}, or swap with a default-constructed one). Skip the second and you get a double free; with unique_ptr, string and container members the type does it for you, which is why RAII members beat raw pointers.",
        "Match the parameter style to the move: 'void f(std::string s)' with 'f(std::move(buf))' really means the caller hands the resource over; 'void f(const std::string&)' plus a move inside just copies. And x = std::move(x) is self-move, whose effect the standard deliberately leaves unspecified - do not write it.",
        "Bridge: 17-6 takes up the modern ways to say 'there is no value' (nullptr, optional, string_view), which is the same question as 'what is left after a move' wearing different clothes."
      ],
      code: `#include <iostream>
#include <memory>
#include <string>
#include <utility>
#include <vector>

class Owner {
  public:
    explicit Owner(std::string text)
        : data_(std::make_unique<std::string>(std::move(text))) {}   // 收值再 move：一份就够

    Owner(Owner&&) noexcept = default;      // 漏了 noexcept：vector 扩容会退回拷贝
    Owner& operator=(Owner&&) noexcept = default;
    Owner(const Owner&) = delete;           // 独占资源：干脆不给拷贝
    Owner& operator=(const Owner&) = delete;

    const std::string& view() const noexcept { return *data_; }

  private:
    std::unique_ptr<std::string> data_;
};

std::string makeName(int id) {
    std::string s = "user-" + std::to_string(id);
    return s;                        // 这里千万别写 std::move(s)：会挡住复制消除
}

int main() {
    std::vector<Owner> v;
    v.emplace_back("alpha");
    v.emplace_back("beta");          // 扩容时按 noexcept 走移动而不是拷贝

    Owner a("gamma");
    Owner b(std::move(a));           // a 剩下的只是一个空的 unique_ptr
    std::cout << b.view() << "\\n";
    // 这一行会解引用空指针：被移动走之后不要再读它
    // std::cout << a.view() << "\\n";
    a = Owner("delta");              // 要再用，就先重新赋值
    std::cout << a.view() << makeName(7) << "\\n";
    return 0;
}`,
      pit: "把 `std::move` 当装饰乱加：`if (std::move(p) == nullptr)`、`std::cout << std::move(s)`——比较和打印都不需要所有权转移，写出来不仅零收益，还让那个对象在这行之后进入未指定状态，下一步用到就是随机结果。",
      pit_en: "Sprinkling std::move as decoration: 'if (std::move(p) == nullptr)', 'std::cout << std::move(s)'. Neither comparison nor printing needs ownership transfer, so it buys nothing while pushing the object into an unspecified state that the next line then reads as garbage.",
      ex: {
        q: "`return std::move(local);` 为什么通常比 `return local;` 更慢？",
        a: "直接 return 允许编译器做复制消除，在调用方的存储里原地构造；套一层 move 会先关掉这条路，被迫真的走一次移动构造，还留下一个已移走的局部对象。",
        q_en: "Why is 'return std::move(local);' usually slower than 'return local;'?",
        a_en: "A plain return lets the compiler elide the copy entirely and construct in the caller's storage; adding move closes that route, forcing a real move construction and leaving a moved-from local behind."
      }
    },

    "17-6": {
      min: 14,
      summary: [
        "`nullptr` 是带类型的空指针字面量（`std::nullptr_t`），而 `NULL` 只是展开成 `0` 或 `0L` 的宏。于是 `f(int)` 与 `f(char*)` 并存时 `f(NULL)` 静默选中 int 版，`f(nullptr)` 才精确匹配指针；写成 `f(0)` 同样会误导读代码的人。",
        "同一类陷阱是把指针当整数比、当整数传：`if (p == 0)`、`std::unique_ptr<T> q(0);` 都能编过，但语义含糊。`nullptr` 的另一层价值是让 `auto x = nullptr;` 有唯一类型，模板推导不再在「这个 0 到底是 int 还是指针」之间摇摆。",
        "`const` 管「不可改」，`constexpr` 管「编译期就能算出来」：只有后者能当数组长度、模板实参、`case` 标签。C++17 放宽了 constexpr——允许浮点运算、允许多条语句、允许 constexpr lambda 和字面量类型构造，别按 C++11 的印象去写。",
        "`if constexpr`（C++17）是模板里的编译期分支：未选中的分支根本不实例化，因此可以在同一个函数模板里对不同类别走不同代码，而不用写一堆偏特化或 SFINAE 花招。",
        "`inline` 变量（C++17）让头文件里的常量只有一份定义：`inline constexpr double kG = 9.8;`，从此告别「在 .h 里声明、挑一个 .cpp 偷偷定义」的老套路，也顺手消灭了静态初始化顺序的一部分麻烦。",
        "`std::optional<T>`（C++17）把「可能没有值」写进类型：`if (opt)`、`*opt`、`opt.value()`（无值时抛 `bad_optional_access`）、`opt.value_or(默认)`。它比哨兵值干净（-1、空串都会和合法数据撞车），但别拿它当「参数可有可无」的语法糖——需要区分「没传」和「传了一个空值」时它才真正对味。",
        "`std::string_view` 是「指向别人缓冲的指针 + 长度」，零拷贝也**零所有权**：`std::string_view sv = std::string(\"tmp\") + \"x\";`、`sv = v[i]` 之后把 v 重新分配、或者从函数返回一个指向局部串的 view，都会立刻悬空。规则一句话：只在同一条表达式或同一个调用栈内用它传参；要存、要返回就给 `std::string`。另外别忘它不保证以 `'\\0'` 结尾，喂给 C 接口前要先落地成 string。",
        "结构化绑定 `auto& [a, b] = ...`（C++17）是 pair/tuple/struct/optional 的统一解包语法：`for (const auto& [k, v] : m)`、`auto [it, ok] = m.insert(x);` 都能砍掉一半噪音。它绑的是隐藏结构的成员，所以 `const auto&` 与 `auto&` 的取舍与 17-2 完全一致。衔接：17-7 把这一整章的东西收进一个小类，一次看清它们怎样配合。"
      ],
      summary_en: [
        "nullptr is a typed null pointer literal (std::nullptr_t) while NULL is only a macro expanding to 0 or 0L. With f(int) and f(char*) both in scope, f(NULL) silently picks the int overload and only f(nullptr) matches the pointer exactly; f(0) misleads the reader just as badly.",
        "The same family of traps is comparing or passing pointers as integers: 'if (p == 0)' and 'std::unique_ptr<T> q(0);' compile but say nothing clearly. nullptr's second payoff is that 'auto x = nullptr;' has one type, so template deduction stops wavering over whether that 0 is an int or a pointer.",
        "const means 'cannot change', constexpr means 'already computable at compile time', and only the latter can size an array, fill a template argument or label a case. C++17 loosened constexpr - floating-point arithmetic, multiple statements, constexpr lambdas and literal-type constructors - so do not write it against your C++11 impressions.",
        "if constexpr (C++17) is a compile-time branch inside a template: the untaken branch is never instantiated, so one function template can take different code paths per category without a pile of specialisations or SFINAE tricks.",
        "Inline variables (C++17) give a header constant exactly one definition: 'inline constexpr double kG = 9.8;' retires the old habit of declaring in the .h and quietly defining in one .cpp, and removes some static-initialisation-order trouble along the way.",
        "std::optional<T> (C++17) writes 'maybe no value' into the type: if (opt), *opt, opt.value() (which throws bad_optional_access when empty) and opt.value_or(default). It is cleaner than sentinel values, since -1 and the empty string both collide with legitimate data - but do not use it as sugar for 'this parameter is optional'; it earns its keep when 'not passed' and 'passed an empty value' must be told apart.",
        "std::string_view is a pointer plus a length into somebody else's buffer: zero copy and zero ownership. 'std::string_view sv = std::string(\"tmp\") + \"x\";', or a view into v[i] followed by a reallocation of v, or returning a view into a local string, all dangle instantly. One rule: use it for parameters inside a single expression or call stack; when something must be stored or handed back, give it a std::string. Also, data() is not guaranteed NUL-terminated, so materialise a string before passing to a C API.",
        "Structured bindings 'auto& [a, b] = ...' (C++17) are the uniform unpacking syntax for pair, tuple, struct and optional: 'for (const auto& [k, v] : m)' and 'auto [it, ok] = m.insert(x);' delete half the noise. They bind members of a hidden object, so the const auto& versus auto& decision is exactly the one from 17-2. Bridge: 17-7 gathers the whole chapter into one small class and shows how the pieces work together."
      ],
      code: `#include <cstddef>
#include <iostream>
#include <map>
#include <optional>
#include <string>
#include <string_view>

void f(int) { std::cout << "挑到 int 版\\n"; }
void f(char*) { std::cout << "挑到指针版\\n"; }

// 可能没有值，但不是错误：optional 把这件事写进类型
std::optional<int> toInt(std::string_view s) {
    if (s.empty()) return std::nullopt;
    int v = 0;
    for (char c : s) {
        if (c < '0' || c > '9') return std::nullopt;
        v = v * 10 + (c - '0');
    }
    return v;
}

int main() {
    f(NULL);                      // 历史包袱：NULL 就是 0，静默走了 int 版
    f(nullptr);                   // 精确匹配 char* 那一版

    std::map<std::string, int> m{{"a", 1}, {"b", 2}};
    for (auto& [k, v] : m) { v *= 10; std::cout << k << "=" << v << "\\n"; }

    if (auto n = toInt(\"42\")) std::cout << "拿到 " << *n << "\\n";
    std::cout << "兜底值 " << toInt(\"1x\").value_or(-1) << "\\n";

    // 悬空示范：view 指向的临时串在这一行结束就没了
    // std::string_view bad = std::string(\"temporary\") + \"!!\";
    // 要存下来就得拷一份：std::string good(bad);
    return 0;
}`,
      pit: "把 `string_view` 存进成员或返回给调用方：`std::string_view pick(const std::vector<std::string>& v) { return v[i]; }` 之后 v 被清空或扩容，你手里的 view 就是野指针；编译器一声不响，运行期读到的是随机字节或已经释放的内存。",
      pit_en: "Storing a string_view in a member or returning one to the caller: 'std::string_view pick(const std::vector<std::string>& v) { return v[i]; }' hands out a view that dangles the moment v is cleared or reallocated. The compiler stays silent and run time reads random bytes, or freed memory.",
      ex: {
        q: "`optional<T>` 相比「返回一个哨兵值」到底好在哪？",
        a: "「没有值」成了类型的一部分而不是口头约定：哨兵值（-1、空串）会和合法数据撞车、对无法构造哨兵的自定义类型完全失效，而 optional 对任何 T 都一样工作。",
        q_en: "What does optional<T> actually give you over returning a sentinel value?",
        a_en: "'No value' becomes part of the type instead of a verbal agreement: sentinels such as -1 or the empty string collide with legitimate data and are impossible for many custom types, whereas optional behaves the same for every T."
      }
    },

    "17-7": {
      title: "综合重构：把现代特性用在一个小类上",
      title_en: "Synthesis: One Small Class, All of Modern C++",
      min: 15,
      target: "能对同一个类给出 C++98 风格与现代风格两版实现，并逐条说出每处改动挡掉了什么 bug、省下了什么开销；拿到新需求时能一次写对特殊成员函数与智能指针的选择。",
      target_en: "Present the same class in a C++98 style and a modern style, naming for each change which bug it prevents and which cost it saves; given a new requirement, choose the special member functions and the pointer type correctly on the first try.",
      summary: [
        "这一节把 s17 全部落在一个 `Row` 类上：定长字段用 `std::array`、文本用 `std::string`、可选列用 `std::optional`、遍历与解析用 `auto`/范围 for/结构化绑定、资源全交给 RAII 成员自动释放——正好接住 s15 从文件里读进来的那一行行数据。",
        "现代写法的默认清单：`#include` 齐全、创建一律 `make_unique`/`make_shared`、特殊成员函数用 `= default` 让编译器生成、移动标 `noexcept`、遍历用 `const auto&`、参数「只读用 `string_view`/`const T&`，要留住就用值 + `std::move`」、虚函数一律写 `override`，不让派生就写 `final`。",
        "`override` 不是风格问题而是防漏神器：签名写错（少个 const、参数类型变了）时基类那份仍然静默存在，你的函数只是新增而没接上虚表，运行结果天差地别；`final` 则同时关掉「再派生」和「再覆盖」，还给编译器一点去虚化的空间。C++11 之前这类 bug 只能靠肉眼。",
        "零法则优先：成员全是 RAII 类型（`string`、`vector`、`unique_ptr`、`array`）时五个特殊成员函数一个都不写，编译器生成的版本既正确又常常是 `noexcept`。一旦你手写析构，就等于宣称「我知道得比编译器多」，五法则必须整套补齐。",
        "选型速查表：所有权唯一 → `unique_ptr`；确实要共享寿命 → `shared_ptr`，反向观察用 `weak_ptr`；不拥有 → 裸指针/引用/`string_view`，并在注释或命名里写清「它不活过这次调用」；可能没有值 → `optional`；可能失败 → 见 s16 的策略选型；只要读一次 → 直接引用参数。",
        "本章翻车复盘（六条都真实发生过）：`[&]` 进线程池 → 悬空引用；`auto x = v[i]` 对 `vector<bool>` → 修改静默丢失；`std::move` 之后继续读 → 未指定值；两个 `shared_ptr` 互相持有 → 泄漏；`string_view` 存成成员 → 野指针；`catch (std::exception e)` → 切片。每一条都有对应的类型或工具可以挡死。",
        "自查动作：把这个类改一遍再读一遍——问自己「删掉哪个关键字会让它悄悄出错」（noexcept、override、const、&），能答上来就说明真的会了；这些关键字都是编译器替你要债的凭证。",
        "衔接：s17 到此收官，下一站 s18 项目实战把 s12~s17 合成一个真正的多文件工程——构建与拆分、配置读写（s15）、错误边界（s16）、类型与所有权（s9~s10、s17）会在那里第一次同时到位。"
      ],
      summary_en: [
        "This section lands all of s17 on one Row class: std::array for the fixed fields, std::string for text, std::optional for a column that may be absent, auto, range-for and structured bindings for parsing and walking, and every resource held by an RAII member - which is exactly what the line-by-line data read in s15 turns into.",
        "The default checklist for modern style: complete includes, always construct with make_unique/make_shared, let the compiler generate special members via '= default', put noexcept on the moves, iterate with const auto&, take parameters as string_view/const T& when reading and by value plus std::move when keeping, and write override on every virtual, final where derivation is not wanted.",
        "override is not cosmetics, it is a leak detector: get the signature slightly wrong (a missing const, a changed parameter type) and the base version stays silently in place while yours merely adds a new function that never joins the vtable, so behaviour differs wildly. final closes both further derivation and further overriding and gives the compiler room to de-virtualise. Before C++11 only your eyes caught these.",
        "Prefer the rule of zero: when every member is an RAII type (string, vector, unique_ptr, array), write none of the five special members and the generated ones are both correct and usually noexcept. Hand-writing a destructor is declaring 'I know better than the compiler', and then all five must be written.",
        "Selection chart: sole ownership - unique_ptr; genuinely shared lifetime - shared_ptr, with weak_ptr pointing back; no ownership - raw pointer, reference or string_view, documented as 'does not outlive this call'; maybe no value - optional; maybe failure - the s16 strategy table; read once - a plain const reference parameter.",
        "Chapter retrospective, all six actually happen: [&] into a thread pool gives dangling references; 'auto x = v[i]' on vector<bool] loses the write; reading after std::move reads an unspecified value; two shared_ptrs holding each other leak; a string_view stored as a member becomes a wild pointer; 'catch (std::exception e)' slices. Each one has a type or a tool that makes it impossible.",
        "The self-test is an edit-and-read: delete one keyword at a time from this class - noexcept, override, const, the ampersand - and ask what breaks silently. If you can name the failure, you own the feature.",
        "Bridge: s17 ends here and s18 project practice assembles s12-s17 into a real multi-file project - build and layout, config reading (s15), error boundaries (s16), types and ownership (s9-s10 and s17) all arriving together for the first time."
      ],
      code: `#include <array>
#include <cstddef>
#include <iostream>
#include <memory>
#include <optional>
#include <string>
#include <string_view>
#include <utility>
#include <vector>

// 一行数据：final 关掉派生，零法则不写特殊成员函数
class Row final {
  public:
    explicit Row(std::string_view name) : name_(name), scores_{}, filled_(0) {}

    // view 只在这一句里活着：拷进 name_ 就与安全了
    void addScore(int s) noexcept {
        if (filled_ < scores_.size()) scores_[filled_++] = s;
    }

    void setTag(std::string t) { tag_ = std::move(t); }   // 要留住：按值收再 move
    const std::string& name() const noexcept { return name_; }
    const std::optional<std::string>& tag() const noexcept { return tag_; }

    int total() const noexcept {
        int sum = 0;
        for (int i = 0; i < static_cast<int>(filled_); ++i) sum += scores_[i];
        return sum;
    }

  private:
    std::string name_;
    std::array<int, 3> scores_{};
    std::size_t filled_;
    std::optional<std::string> tag_;
};

std::vector<Row> parseLines(const std::vector<std::string>& lines) {
    std::vector<Row> out;
    out.reserve(lines.size());                 // 先定容量：少搬家，引用也不容易悬空
    for (const auto& line : lines) {           // 只读遍历：const auto&
        Row r(line);
        r.addScore(3);
        r.setTag(\"from s15\");
        out.push_back(std::move(r));           // 交给容器：这里才该用 move
    }
    return out;                                // 别写 return std::move(out)
}

int main() {
    auto rows = parseLines({\"hello\", \"world\"});
    for (const auto& r : rows)                 // 结构化绑定在这里用不上，留给 pair
        std::cout << r.name() << "=" << r.total() << \"\\n\";

    auto owner = std::make_unique<Row>(\"owner\");
    owner->addScore(7);
    std::cout << owner->name() << \" tag 有值吗 \"
              << (owner->tag().has_value() ? \"有\" : \"没有\") << \"\\n\";
    return 0;
}`,
      pit: "给一个成员全是 RAII 类型的类手写析构函数（哪怕里面只有一句 cout）：它当场抑制编译器生成移动构造与移动赋值，于是这个类被塞进 vector 时全部退化成深拷贝——一个字符的「顺手写」换来一个量级的性能损失。",
      pit_en: "Hand-writing a destructor for a class whose members are all RAII types, even one that only prints: it suppresses the implicit move constructor and move assignment, so every push into a vector degrades to a deep copy. One casually typed function costs an order of magnitude.",
      ex: {
        q: "为什么这一节反复强调「能默认就默认、能不写就不写」？",
        a: "因为编译器生成的特殊成员函数是按当前成员算出来的：成员换了它自动跟上，还默认带上 constexpr/noexcept 这类属性；手写的版本则会在下次改成员时悄悄变成错的。",
        q_en: "Why does this section keep saying 'default it, or write nothing at all'?",
        a_en: "Because the compiler-generated special members are computed from the members you have now: change the members and they follow automatically, carrying constexpr/noexcept along the way, whereas a hand-written version quietly goes stale the next time a member changes."
      }
    }

    /* ---------- 题库：每章 4 题，只考本层新增的深看点 ---------- */
  },

  quizAdd: {
    s15: [
      {
        q: "`std::ofstream fout(\"log.txt\");` 打开一个已存在且有内容的文件，会发生什么？",
        o: ["打开失败，流进入失败状态", "文件被截断成空，原内容丢失", "自动改成追加模式", "以只读方式打开，写入被忽略"],
        a: 1,
        why: "ofstream 的默认模式是 ios::out，它隐含 trunc：先把文件清空。想保留原内容并接在后面，必须显式给 std::ios::app。",
        q_en: "What happens when 'std::ofstream fout(\"log.txt\")' opens a file that already exists and has content?",
        o_en: ["The open fails and the stream enters a failed state", "The file is truncated to empty and the old content is lost", "It silently switches to append mode", "It opens read-only and writes are ignored"],
        why_en: "The default mode for ofstream is ios::out, which implies truncation: the file is emptied first. Keeping the old content requires an explicit std::ios::app."
      },
      {
        q: "要把一个文本文件逐行读进处理函数，下面哪种循环写法是正确的？",
        o: ["while (!fin.eof()) { getline(fin, line); handle(line); }", "while (std::getline(fin, line)) handle(line);", "while (fin.is_open()) { getline(fin, line); handle(line); }", "while (!fin.bad()) { getline(fin, line); handle(line); }"],
        a: 1,
        why: "eofbit 要等到某次读越过末尾之后才置上，所以 A 会把最后一行处理两遍或喂进一个空串；把读动作本身当条件才能在失败时干净收尾。",
        q_en: "Which loop correctly reads a text file line by line into a handler?",
        o_en: ["while (!fin.eof()) { getline(fin, line); handle(line); }", "while (std::getline(fin, line)) handle(line);", "while (fin.is_open()) { getline(fin, line); handle(line); }", "while (!fin.bad()) { getline(fin, line); handle(line); }"],
        why_en: "eofbit is only set after a read has crossed the end, so the first shape handles the last line twice or feeds it an empty string; making the read itself the condition ends the loop cleanly on failure."
      },
      {
        q: "判断：只要 `if (fin.is_open())` 成立，就能确定后面每一行的读取都成功。",
        type: "judge", a: 1,
        why: "is_open() 只回答打开那一瞬间的事；读取失败会置 failbit/badbit，必须再看流状态，或者干脆让读动作当循环条件。",
        q_en: "True or false: if fin.is_open() holds, every later line is guaranteed to read successfully.",
        why_en: "False. is_open() speaks only to the instant of opening; read failures set failbit or badbit, so you must check the stream state again or use the read itself as the loop condition."
      },
      {
        q: "要让写入永远接在文件末尾、绝不覆盖已有内容，打开 ofstream 时的模式标志是 std::ios::______（填英文小写）。",
        type: "fill", ans: ["app", "append"],
        why: "app（append）在每次写入前把位置移到文件末尾，因此不可能覆盖前面的内容；ate 只是打开时把游标放到末尾，之后仍可 seek 回去覆盖。",
        q_en: "To make every write land at the end and never overwrite existing content, open the ofstream with the mode flag std::ios::______.",
        why_en: "app repositions to the end before every write, so overwriting earlier bytes is impossible; ate only starts at the end and still allows seeking back to overwrite."
      }
    ],
    s16: [
      {
        q: "捕获标准库异常时，下面哪种写法最合适？",
        o: ["catch (std::exception e)", "catch (const std::exception& e)", "catch (std::exception* e)", "先写 catch (...)，再写具体类型"],
        a: 1,
        why: "按 const 引用捕获既省一次拷贝，也不会把派生类异常切成基类，what() 与自定义字段都还在；顺序也必须从具体到一般。",
        q_en: "Which is the best way to catch a standard library exception?",
        o_en: ["catch (std::exception e)", "catch (const std::exception& e)", "catch (std::exception* e)", "catch (...) first, then the specific types"],
        why_en: "A const reference avoids the copy and avoids slicing a derived exception down to its base, so what() and the extra fields survive; handlers must also run from specific to general."
      },
      {
        q: "判断：析构函数里抛出异常是安全的，只要调用方在外层写了 try/catch。",
        type: "judge", a: 1,
        why: "析构往往正在栈展开过程中执行，这时再抛第二个异常会直接 std::terminate，外层的 catch 根本没有机会生效。",
        q_en: "True or false: throwing from a destructor is safe as long as the caller wrapped the code in try/catch.",
        why_en: "False. Destructors frequently run while unwinding is already in progress, and a second exception there calls std::terminate before any outer catch can act."
      },
      {
        q: "`std::vector` 扩容时对元素选择移动还是拷贝，取决于什么？",
        o: ["元素类型是否可拷贝", "元素的移动构造是否标了 noexcept", "容器是否超过一千个元素", "是否使用 emplace_back 而非 push_back"],
        a: 1,
        why: "扩容中途失败时 vector 必须保证不破坏原有内容，因此只移动「不会抛」的元素；移动构造漏标 noexcept 就整体退回逐个拷贝。",
        q_en: "What decides whether std::vector moves or copies elements while growing?",
        o_en: ["Whether the element type is copyable", "Whether its move constructor is marked noexcept", "Whether the container passes a thousand elements", "Whether emplace_back is used instead of push_back"],
        why_en: "Growth must leave the old contents intact if it fails halfway, so only elements whose move cannot throw are moved; a move constructor without noexcept sends the whole vector back to copying."
      },
      {
        q: "在 catch 块里把当前异常原样继续送往上一层，这条语句写成 ______（含分号）。",
        type: "fill", ans: ["throw;"],
        why: "裸 throw; 保留正在处理的异常的原始动态类型；写成 throw e; 会按 catch 参数的静态类型新建一份抛出，造成对象切片。",
        q_en: "Inside a catch block, the statement that forwards the current exception upward unchanged is written ______ (include the semicolon).",
        why_en: "A bare throw; keeps the dynamic type of the exception being handled, while throw e; builds a new object of the catch parameter's static type and slices it."
      }
    ],
    s17: [
      {
        q: "`const int x = 5; auto y = x; auto& r = x;` 中 y 和 r 的类型分别是？",
        o: ["const int 与 const int&", "int 与 const int&", "int 与 int&", "const int 与 int&"],
        a: 1,
        why: "auto 按值推导会剥掉引用和顶层 const，所以 y 是 int；auto& 绑定一个 const int 左值时，只能推成 const int&。",
        q_en: "In 'const int x = 5; auto y = x; auto& r = x;', what are the types of y and r?",
        o_en: ["const int and const int&", "int and const int&", "int and int&", "const int and int&"],
        why_en: "By-value auto strips references and top-level const, so y is int; auto& binding to a const int lvalue can only deduce const int&."
      },
      {
        q: "判断：`std::move(v)` 会立刻释放 v 占用的内存。",
        type: "judge", a: 1,
        why: "std::move 只是把左值转成右值引用的名字转换，不分配也不释放任何东西；真正的搬迁在移动构造/赋值里，v 之后仍然有效，只是值未指定。",
        q_en: "True or false: std::move(v) immediately frees the memory held by v.",
        why_en: "False. std::move is only a name cast to an rvalue reference; it allocates and frees nothing. The transfer happens in the move constructor or assignment, and v stays valid afterwards with an unspecified value."
      },
      {
        q: "把一个 `[&]` 捕获的 lambda 交给新线程并 detach，最可能的后果是？",
        o: ["编译器自动改成按值捕获", "函数返回后闭包引用的局部变量已销毁，成为悬空引用", "编译期直接报错", "运行期抛出 std::out_of_range"],
        a: 1,
        why: "引用捕获的前提是被引用的变量活得比 lambda 长；主函数一返回栈帧就销毁，线程还在读它，属于未定义行为，而且常常在开优化后才崩。",
        q_en: "What is the most likely consequence of handing a [&]-capturing lambda to a detached thread?",
        o_en: ["The compiler silently converts it to by-value capture", "Once the function returns, the locals the closure references are destroyed and the references dangle", "A compile-time error", "std::out_of_range at run time"],
        why_en: "Reference capture presumes the referenced variables outlive the lambda. When the function returns its stack frame dies while the thread is still reading it - undefined behaviour, usually only visible after optimisation."
      },
      {
        q: "C++11 之后代码里的空指针应写成 ______，而不是 NULL 或 0。（填关键字）",
        type: "fill", ans: ["nullptr"],
        why: "nullptr 的类型是 std::nullptr_t，只能转成指针；NULL 本质是整数 0，遇到 int 与指针的重载会静默选中整数那一版。",
        q_en: "Since C++11, a null pointer in code should be written ______ rather than NULL or 0.",
        why_en: "nullptr has type std::nullptr_t and converts only to pointers; NULL is really the integer 0, so an overload set with int and pointer variants silently picks the int one."
      }
    ]
  },

  /* ---------- 词典：cat 统一用「C++ 系统深入」，主键不与既有名词重复 ---------- */
  terms: [
    { term: "打开模式", term_en: "Open Mode", cat: "C++ 系统深入",
      short: "ios::in/out/app/ate/trunc/binary 的组合，决定文件被创建、截断还是追加。",
      short_en: "The combination of ios::in/out/app/ate/trunc/binary that decides whether a file is created, truncated or appended.",
      detail: ["不写模式时 ofstream 默认带 trunc：已存在的内容直接清空，这是最常见的数据丢失来源。", "app 与 ate 的差别在于能否回退覆盖：app 强制每次写都落在末尾，ate 只是把初始游标放在末尾。"],
      detail_en: ["With no mode given, ofstream includes trunc, so existing content is wiped - the most common way data disappears.", "app and ate differ in whether you can seek back: app forces every write to the end, ate merely starts the cursor there."],
      vs: "打开模式管「文件怎么开」，流状态位管「开完以后顺不顺」。",
      vs_en: "Open mode governs how a file is opened; the state bits govern whether it went well afterwards." },
    { term: "流状态位", term_en: "Stream State Bits", cat: "C++ 系统深入",
      short: "goodbit、eofbit、failbit、badbit 四位；流的 bool 转换查的就是 failbit。",
      short_en: "goodbit, eofbit, failbit and badbit; the bool conversion of a stream is really a failbit test.",
      detail: ["failbit 可以 clear() 复位后继续用，badbit 说明底层已经坏掉，只能关掉重开。", "eofbit 只表示「曾经读过末尾」，它永远不会提前告诉你还有没有数据。"],
      detail_en: ["failbit can be cleared and the stream reused; badbit means the underlying device is broken, so only reopening helps.", "eofbit only records that a read once crossed the end; it can never predict whether more data is waiting."],
      vs: "is_open() 回答打开那一瞬间，状态位回答到目前为止。",
      vs_en: "is_open() answers about the instant of opening; the state bits answer about everything since." },
    { term: "行尾翻译", term_en: "Newline Translation", cat: "C++ 系统深入",
      short: "Windows 文本模式在换行符的两种写法之间自动转换，二进制模式不转。",
      short_en: "On Windows, text mode converts between the two spellings of a line break; binary mode does not.",
      detail: ["用二进制模式读文本、或遇到行尾混用的文件，就会在 string 末尾留下一个看不见的回车符。", "比较整行之前先剥掉回车，或者统一做一次与平台无关的 trim。"],
      detail_en: ["Reading text in binary mode, or a file with mixed line endings, leaves an invisible carriage return at the end of the string.", "Strip it before comparing a line, or trim once in a platform-independent way."],
      vs: "行尾翻译只发生在文本模式，缓冲刷新两种模式都有。",
      vs_en: "Newline translation happens only in text mode; buffer flushing happens in both." },
    { term: "工作目录", term_en: "Working Directory", cat: "C++ 系统深入",
      short: "相对路径的解析起点，属于进程而不是属于源文件。",
      short_en: "Where relative paths start resolving - a property of the process, not of the source file.",
      detail: ["IDE、双击可执行文件、脚本调用往往给出三个不同的目录，同一条相对路径就读到不同文件。", "要稳定就把路径作为参数传进来，或从可执行文件自身位置算出来。"],
      detail_en: ["Launching from an IDE, by double-click and from a script usually gives three different directories, so one relative path resolves to three files.", "Pass paths as arguments, or derive them from the executable's own location."],
      vs: "工作目录决定「去哪找文件」，编码决定「读出来是什么字」。",
      vs_en: "The working directory decides where a file is looked for; the encoding decides what the bytes mean." },
    { term: "输出缓冲刷新", term_en: "Output Flushing", cat: "C++ 系统深入",
      short: "写入先进缓冲区，flush、endl 或正常结束才落到磁盘。",
      short_en: "Writes sit in a buffer until a flush, an endl or a clean exit pushes them out.",
      detail: ["程序崩溃时缓冲区里的内容整批丢失，所以关键日志必须手动 flush。", "endl 比 '\\n' 多的正是那一次刷新，高频输出时这点差别足以让日志成为瓶颈。"],
      detail_en: ["Everything still buffered is lost when the program crashes, so important log lines need an explicit flush.", "endl costs exactly one flush more than a plain newline, and under heavy logging that is enough to make the log the bottleneck."],
      vs: "刷新管「什么时候到磁盘」，关闭管「所有权什么时候结束」。",
      vs_en: "Flushing decides when bytes reach the disk; closing decides when ownership ends." },
    { term: "栈展开", term_en: "Stack Unwinding", cat: "C++ 系统深入",
      short: "抛出后逐个销毁中间栈帧并析构局部对象，直到找到匹配的 catch。",
      short_en: "After a throw, intermediate frames are destroyed and their locals destructed one by one until a matching catch is found.",
      detail: ["已构造完成的局部对象在展开中一定被析构，这就是 RAII 能替掉手动释放的原因。", "展开过程中若再有析构函数抛出第二个异常，程序直接 terminate。"],
      detail_en: ["Every fully constructed local is guaranteed destroyed during unwinding, which is why RAII can replace manual release.", "If a destructor throws a second exception while unwinding is running, the program terminates immediately."],
      vs: "栈展开只在抛出时发生，正常的 return 不走这条路。",
      vs_en: "Unwinding happens only on a throw; a normal return never takes this path." },
    { term: "异常安全等级", term_en: "Exception Safety Guarantee", cat: "C++ 系统深入",
      short: "基本保证、强烈保证、不抛保证三档，是对调用方的承诺等级。",
      short_en: "Basic, strong and no-throw: three levels of promise made to the caller.",
      detail: ["强烈保证通常用「先在副本上做，成功后用 noexcept 的 swap 提交」实现，代价是一次拷贝。", "析构、swap、移动应当落在不抛保证这一档，否则标准库会退回保守做法。"],
      detail_en: ["The strong guarantee is usually built by working on a copy and committing with a noexcept swap, at the price of one copy.", "Destructors, swap and moves belong in the no-throw class; otherwise the library falls back to conservative behaviour."],
      vs: "安全等级承诺「出错后还剩什么」，异常类型只说明「出了什么事」。",
      vs_en: "Safety levels promise what survives the error; exception types only say what happened." },
    { term: "原样重抛", term_en: "Rethrow As-Is", cat: "C++ 系统深入",
      short: "catch 里写裸 `throw;`，按原始动态类型把当前异常继续往上送。",
      short_en: "A bare 'throw;' inside a catch forwards the current exception upward with its original dynamic type.",
      detail: ["`throw e;` 会按 catch 参数的静态类型新建一份抛出，派生类信息被切掉。", "常见用法是「记一笔日志再让上层决定」，或者翻译成另一种异常类型后重新抛出。"],
      detail_en: ["'throw e;' builds a new object of the catch parameter's static type, slicing away the derived part.", "The usual shapes are 'note it and let a higher layer decide', or translating it into another exception type."],
      vs: "原样重抛保留类型，嵌套抛出保留原因链。",
      vs_en: "Rethrowing keeps the type; throw_with_nested keeps the chain of causes." },
    { term: "不抛承诺", term_en: "noexcept Promise", cat: "C++ 系统深入",
      short: "签名上的承诺：真抛出就直接 terminate，同时解锁容器的移动优化。",
      short_en: "A promise in the signature: throwing anyway calls terminate, and keeping it unlocks move optimisation in containers.",
      detail: ["vector 扩容用 is_nothrow_move_constructible 决定移动还是拷贝，漏标就白白变慢。", "只给不可能失败的函数承诺：swap、简单移动、访问器、析构。"],
      detail_en: ["Vector growth consults is_nothrow_move_constructible to pick move or copy, so a missing marker costs speed for nothing.", "Reserve the promise for functions that cannot fail: swap, simple moves, accessors, destructors."],
      vs: "noexcept 承诺「我不会抛」，catch 处理「别人抛了怎么办」。",
      vs_en: "noexcept promises 'I will not throw'; catch decides what to do when something else throws." },
    { term: "异常边界翻译", term_en: "Exception Boundary Translation", cat: "C++ 系统深入",
      short: "在 C 接口、线程入口、main 的最外层把异常转成错误码，是 catch(...) 的正当岗位。",
      short_en: "Turning exceptions into codes at the outermost layer of a C interface, a thread entry or main - the legitimate post for catch(...).",
      detail: ["异常跨不过语言与进程边界，那里只有整数和字符串传得过去。", "翻译要集中在一处：两头都翻等于没有定规则。"],
      detail_en: ["Exceptions do not cross language or process boundaries, where only integers and strings travel.", "Keep the translation in one place; doing it in both directions means no rule was chosen."],
      vs: "边界翻译处理「出了模块怎么办」，异常类型处理「在模块里怎么分」。",
      vs_en: "Boundary translation handles leaving the module; exception types handle branching inside it." },
    { term: "万能引用", term_en: "Universal Reference", cat: "C++ 系统深入",
      short: "模板里的 `T&&` 与 `auto&&`：左值收成左值引用，右值收成右值引用。",
      short_en: "T&& in a template and auto&&: an lvalue binds as an lvalue reference, an rvalue as an rvalue reference.",
      detail: ["它不是右值引用；写成 `vector<int>&&` 这种具体类型的 `&&` 才是右值引用。", "范围 for 里 `for (auto&& x : v)` 最不容易出错，连代理元素也接得住。"],
      detail_en: ["It is not an rvalue reference; a concrete spelling such as vector<int>&& is.", "'for (auto&& x : v)' is the hardest-to-break range-for form because it also accepts proxy elements."],
      vs: "万能引用随实参改变类别，右值引用永远只是右值引用。",
      vs_en: "A universal reference adapts to its argument; an rvalue reference is always only itself." },
    { term: "捕获初始化", term_en: "Init-Capture", cat: "C++ 系统深入",
      short: "C++14 的 `[p = std::move(up)]`：把资源搬进闭包，而不是留下一个引用。",
      short_en: "The C++14 form [p = std::move(up)], which moves a resource into the closure instead of leaving a reference behind.",
      detail: ["这是让 unique_ptr 进回调的唯一正确姿势：按值拷贝根本编不过。", "也可以只捕获需要的那几个成员，避开成员函数里 `[=]` 悄悄捕获 this。"],
      detail_en: ["It is the only correct way to get a unique_ptr into a callback, since copying one does not compile.", "It also lets you capture just the members you need, dodging the implicit this capture of [=] inside member functions."],
      vs: "捕获初始化决定「怎么进来」，mutable 决定「进来之后能不能改」。",
      vs_en: "Init-capture decides how a value enters the closure; mutable decides whether that copy may change." },
    { term: "复制消除", term_en: "Copy Elision", cat: "C++ 系统深入",
      short: "编译器直接在目标存储里构造对象，连移动构造都省掉。",
      short_en: "The compiler constructs straight into the destination storage, skipping even the move.",
      detail: ["`return local;` 能吃到这条优化，`return std::move(local);` 反而可能把它关掉。", "C++17 起部分场景已是强制消除，不需要再用 move 去提醒编译器。"],
      detail_en: ["'return local;' benefits from this optimisation, while 'return std::move(local);' can switch it off.", "Since C++17 several cases are guaranteed elision, so a move is not needed to help the compiler."],
      vs: "复制消除是「复制根本不发生」，移动是「用便宜的搬代替贵的拷」。",
      vs_en: "Elision means no copy ever exists; a move means a cheap transfer replaces an expensive copy." },
    { term: "循环引用", term_en: "Reference Cycle", cat: "C++ 系统深入",
      short: "两个 shared_ptr 互相持有，强计数永远归不了零，对象就此泄漏。",
      short_en: "Two shared_ptrs holding each other, so the strong count never reaches zero and the objects leak.",
      detail: ["修法是让拥有方向唯一：正向 shared_ptr 或 unique_ptr，反向 weak_ptr 或裸观察指针。", "连带后果是析构函数根本不执行，日志里看不到那行销毁记录就是线索。"],
      detail_en: ["The fix is to own in one direction only: shared_ptr or unique_ptr forward, weak_ptr or a raw observer back.", "The related symptom is destructors that never run at all, so a missing destruction line in the log is the clue."],
      vs: "循环引用漏在计数上，悬空引用错在地址上。",
      vs_en: "A cycle leaks through the counter; a dangling reference fails through the address." },
    { term: "非拥有视图", term_en: "Non-owning View", cat: "C++ 系统深入",
      short: "string_view、裸指针、引用这一族：只负责看，不负责让对象活着。",
      short_en: "The string_view, raw pointer and reference family: they look, they do not keep things alive.",
      detail: ["只在本次调用内用才安全；存进成员或返回给调用方就要拷一份。", "string_view 也不保证以 NUL 结尾，喂给 C 接口之前要先落成 std::string。"],
      detail_en: ["They are safe only up to the end of the current call; storing one in a member or returning it means taking a copy.", "A string_view is not guaranteed NUL-terminated either, so materialise a std::string before a C API."],
      vs: "视图省下的是拷贝，代价是把寿命问题交给你自己管。",
      vs_en: "A view saves the copy and hands you the lifetime problem." },
    { term: "结构化绑定", term_en: "Structured Binding", cat: "C++ 系统深入",
      short: "C++17 的 `auto& [a, b] = obj;`：一次解开 pair、tuple、struct 与 optional。",
      short_en: "The C++17 form auto& [a, b] = obj;, unpacking pair, tuple, struct and optional in one step.",
      detail: ["绑的是隐藏结构的成员，所以 const 与引用的取舍和普通声明完全一样。", "名字仍然要表达角色：`[key, count]` 远好过 `[a, b]`。"],
      detail_en: ["The names bind members of a hidden object, so the const and reference choices are the ordinary ones.", "Keep the names meaningful: [key, count] beats [a, b]."],
      vs: "结构化绑定负责拆开，std::tie 只能拆 tuple 而且要求变量已存在。",
      vs_en: "Structured bindings unpack; std::tie only unpacks tuples and needs the variables to exist already." }
  ],

  achievements: [
    { id: "file_pipeline", icon: "📁", name: "读写流水线", name_en: "Pipeline Builder",
      desc: "完成 s15 · 文件操作 全部课节", desc_en: "Finish every lesson of s15 File I/O",
      check: ["s15"] },
    { id: "modern_guard", icon: "🛡️", name: "现代防御者", name_en: "Modern Guardian",
      desc: "完成 s16 · 异常处理 与 s17 · 现代 C++ 特性 全部课节", desc_en: "Finish every lesson of s16 Exceptions and s17 Modern C++",
      check: ["s16", "s17"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "打开后第一件事就是检查：失败不会抛异常，也不会打印任何东西": "the first thing after opening is a check: failure throws nothing and prints nothing",
    "等价于 fin.fail()，也覆盖没打开成功": "same as fin.fail(); it also covers an open that never succeeded",
    "可省：析构时自动关；这里是为了给下一个文件腾位置": "optional: the destructor closes it - done here to free the stream for the next file",
    "默认截断！已存在的 run.log 会被清空，追加必须写 app": "truncation by default! an existing run.log is wiped - appending needs app",
    "外层：一次一行": "outer layer: one line per iteration",
    "去掉残留的回车": "drop the leftover carriage return",
    "空行与注释行": "blank lines and comment lines",
    "内层：把这一行交给字符串流继续切": "inner layer: hand the line to a string stream to keep splitting",
    "读数字，换行被留在流里": "it reads the number and leaves the newline in the stream",
    "于是这里拿到空串": "so this getline comes back empty",
    "定宽类型、无指针无 string：这才是可以放心整块 dump 的普通数据": "fixed-width types, no pointers, no string: only this is safe to dump as one block",
    "整块写入：一次三个元素，比逐个 write 少很多次调用": "one block write: three elements per call instead of three write calls",
    "出了作用域自动关闭并刷完缓冲": "leaving the scope closes the stream and flushes the buffer",
    "最后一次 read 失败：剩余字节不够一个 Point，循环按设计结束": "the last read fails: fewer bytes than one Point remain, so the loop ends by design",
    "反例：最后一次读已经失败，循环体还会再跑一遍": "wrong shape: the final read already failed, yet the body runs once more",
    "条件就是读动作本身": "the condition is the read itself",
    "复位状态位，这个流才还能用": "reset the state bits before this stream can be used again",
    "回到开头：tellg 给出的就是这类偏移": "back to the start: tellg hands out exactly this kind of offset",
    "读字母就会走到这里": "a letter where a number was expected lands here",
    "先清 failbit": "clear failbit first",
    "再把坏字符丢掉": "then throw away the offending characters",
    "endl 顺手刷新缓冲": "endl flushes the buffer on the side",
    "这一句并没有落盘": "this line has not reached the disk yet",
    "要立刻可见就只能手动刷": "only a manual flush makes it visible at once",
    "默认值本身就是恢复策略": "the defaults are themselves the recovery policy",
    "缺配置不致命：记一条日志继续跑": "a missing config is not fatal: log a line and carry on",
    "少一列：丢掉这一行": "a missing column: skip this line",
    "日志追加，结果覆盖": "the log appends, the results overwrite",
    "默认截断：每次都是新产出": "truncated by default: a fresh output every run",
    "先落盘，再报告数字": "flush to disk first, then report the numbers",
    "按值抛出，类型就是 invalid_argument": "thrown by value; the dynamic type is invalid_argument",
    "具体的类型写在前面": "the most specific type comes first",
    "再接业务里最常用的": "then the one business code hits most often",
    "基类兜住所有标准异常": "the base class catches every standard exception",
    "想继续上报就写 throw;，写成 throw e; 会再切一次": "to report further use a bare throw; - throw e; would slice again",
    "只留给最后的兜底与翻译": "reserved for the final safety net and for translation",
    "下面这行不抛异常：越界是未定义行为，可能悄悄改写别的内存": "the next line throws nothing: an invalid index is undefined behaviour and may corrupt other memory",
    "抛 std::out_of_range，上层能接住": "throws std::out_of_range, which a caller can catch",
    "不抛的那条重载：留给要看错误码做决策的调用方": "the non-throwing overload: for callers that decide by error code",
    "size 此时不可信，只看 ec": "size is not trustworthy here; look only at ec",
    "上层不吃返回码就在这里翻译成 std::system_error，否则带着 ec 直接 return": "if the caller does not take return codes, translate into std::system_error here; otherwise carry ec straight back",
    "不需要消息时可以不接名字": "when the message is not needed, leave out the name",
    "一个模块的异常树：只在处理策略不同时才分类型": "one exception tree per module: split types only when the handling differs",
    "结构化字段：让上层按行号决策": "structured fields: let the caller branch on the line number",
    "先接最具体的": "catch the most specific one first",
    "模块内其它错误": "other errors inside this module",
    "第三方与标准库兜底": "the fallback for third-party and library exceptions",
    "不再手写 delete：抛出也照样释放": "no manual delete any more: it frees even while throwing",
    "不标 noexcept，vector 扩容就退回拷贝": "without noexcept, vector growth falls back to copying",
    "独占资源：不给拷贝": "an exclusive resource: copying is refused",
    "强烈保证：先在副本上做，全部成功了才交换": "strong guarantee: work on a copy and commit with a swap only once all of it works",
    "用一次拷贝换回滚能力": "one copy buys the ability to roll back",
    "noexcept 的 swap：提交点只在这一行": "a noexcept swap: the commit point is this single line",
    "析构不抛：可能失败的动作交给显式的提交函数": "destructors do not throw: anything that can fail gets an explicit commit function",
    "析构里只做不会失败的事：没提交就丢弃，绝不再抛": "a destructor only does things that cannot fail: discard, and never rethrow",
    "扩容时按 noexcept 选择移动而非拷贝": "while growing, noexcept lets it move instead of copy",
    "要么两条都加，要么一条都不加": "either both entries are appended or neither is",
    "1) 可能没值但不是错误：查表未命中交给 optional": "1) no value but no error either: a lookup miss belongs in optional",
    "没有这个键：怎么办留给调用方": "the key is absent: what to do is the caller's decision",
    "2) 预期内、可恢复、还要带上原因：返回一个状态结构": "2) expected, recoverable and it must carry a reason: return a status struct",
    "不抛：调用方就在上一层": "no throw here: the caller is one level up",
    "3) 处理不了就抛，并且在边界集中翻译成返回码": "3) throw what you cannot handle and translate it once at the boundary",
    "可恢复：就地处理并给码": "recoverable: handle it on the spot and return a code",
    "边界：异常到此为止": "the boundary: no exception gets past this point",
    "非标准异常也要翻译掉，否则 noexcept 直接终止": "translate the non-standard ones too, or the noexcept function simply terminates",
    "std::string：引用与顶层 const 都被剥掉，拷了一份": "std::string: reference and top-level const both stripped, so it is a copy",
    "只读引用：零拷贝，也仍是 const": "read-only reference: no copy, still const",
    "万能引用接住左值：const std::string&": "a universal reference taking an lvalue: const std::string&",
    "改的是副本，v 一点没动": "this writes to copies; v is untouched",
    "这一次才真的清零": "this round really zeroes the elements",
    "size_t：无符号，跟 int 比较就有坑": "size_t: unsigned, so comparing it against int is a trap",
    "推导结果不用猜，编译期就能钉死": "no guessing the deduction - pin it down at compile time",
    "只读遍历：零拷贝": "read-only walk: zero copies",
    "要改才写非 const 引用": "use a non-const reference only to modify",
    "结构化绑定": "structured binding",
    "值可改，键永远是 const": "the value may change, the key is always const",
    "反例：在范围 for 里删元素，迭代器当场失效": "counter-example: erasing inside a range-for invalidates the iterator on the spot",
    "正确姿势：erase-remove，见 s14": "the right shape: erase-remove, see s14",
    "代理元素：必须用引用接": "proxy elements must be taken by reference",
    "拥有下一个节点": "owns the next node",
    "只观察上一个：循环就此打断": "observes the previous one only: that breaks the cycle",
    "用删除器接管 C 资源：离开作用域自动 fclose": "a deleter wraps a C resource: fclose runs at scope exit",
    "反向若也用 shared_ptr，两个对象永远不析构": "if the back link were a shared_ptr too, neither object would ever be destroyed",
    "把裸指针存下来是隐患：下次扩容它就悬空": "caching a raw pointer is a hazard: the next reallocation dangles it",
    "unique_ptr 不可拷贝": "unique_ptr cannot be copied",
    "get() 只用不夺所有权": "get() only observes, it never takes ownership",
    "所有权转移：up 现在是空的": "ownership transferred: up is empty now",
    "同步用完：[&] 最省事": "used synchronously: [&] is the cheapest to write",
    "要活得比这次调用久：显式按值捕获": "if it must outlive this call, capture explicitly by value",
    "改的是副本，外面的 prefix 不动": "the copy changes; the outer prefix does not",
    "把所有权搬进闭包：捕获初始化（C++14）": "move ownership into the closure: init-capture (C++14)",
    "走到这里 buf 已经交给闭包，自身为空": "by this point buf has been handed to the closure and is empty",
    "要存起来就给类型": "give it a type when you mean to store it",
    "收值再 move：一份就够": "take by value then move: one buffer is enough",
    "漏了 noexcept：vector 扩容会退回拷贝": "miss noexcept and vector growth falls back to copying",
    "独占资源：干脆不给拷贝": "exclusive resource: simply no copying at all",
    "这里千万别写 std::move(s)：会挡住复制消除": "never write std::move(s) here: it blocks copy elision",
    "扩容时按 noexcept 走移动而不是拷贝": "growth moves rather than copies thanks to noexcept",
    "a 剩下的只是一个空的 unique_ptr": "all that is left in a is an empty unique_ptr",
    "这一行会解引用空指针：被移动走之后不要再读它": "this line would dereference null: never read a moved-from object",
    "要再用，就先重新赋值": "to use it again, assign a fresh value first",
    "可能没有值，但不是错误：optional 把这件事写进类型": "maybe no value, but not an error: optional writes that into the type",
    "历史包袱：NULL 就是 0，静默走了 int 版": "legacy trap: NULL is really 0, so the int overload is picked silently",
    "精确匹配 char* 那一版": "matches the char* overload exactly",
    "悬空示范：view 指向的临时串在这一行结束就没了": "dangling example: the temporary the view points at dies at the end of this line",
    "要存下来就得拷一份：std::string good(bad);": "to keep it, take a copy: std::string good(bad);",
    "一行数据：final 关掉派生，零法则不写特殊成员函数": "one data row: final closes derivation, the rule of zero writes no special members",
    "view 只在这一句里活着：拷进 name_ 就与安全了": "the view lives only for this statement; copying into name_ is what makes it safe",
    "要留住：按值收再 move": "to keep it: take it by value, then move",
    "先定容量：少搬家，引用也不容易悬空": "reserve first: fewer relocations, so references stay valid",
    "只读遍历：const auto&": "read-only walk: const auto&",
    "交给容器：这里才该用 move": "handing it to the container: this is where move belongs",
    "别写 return std::move(out)": "do not write return std::move(out)",
    "结构化绑定在这里用不上，留给 pair": "no structured binding needed here; save it for pairs"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_STL2);
