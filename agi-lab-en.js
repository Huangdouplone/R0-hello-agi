/* ============================================================
 * agi-lab-en.js —— 原始实战题（每阶段第 1 道，labs[0]）的英文对照
 * 背景：LAB_EN 只覆盖到「工程化 career」这一段，后面 ma3/ma4/sp1-3/ml1-4/dl1-5/agi1-4
 *       共 18 个阶段的实战标题没有英文；且所有 53 道原始实战的「要求 / 提示」都只有中文，
 *       于是同一阶段里 labs[1..4]（叠加层）是英文、labs[0] 却是中文 —— 同一功能表现不一致。
 * 做法：提供 window.AGI_LAB_EN，由 index.html 的合并块写入 s.lab 的 *_en 字段；
 *       只补缺不覆盖，已有英文的字段保持原样。不改动 cpp-extra-data.js。
 * 字段：{ t, req:[…], hint }
 * 版权：bilibili 黄豆666 / huangdouplone
 * ============================================================ */
window.AGI_LAB_EN = {

/* ==================== C++ 主线 ==================== */
"s1": {
  t: "Self-Introduction Program",
  req: ["Print three lines with cout: your nickname, one sentence on why you are learning C++, today's date", "Keep one piece of information per line and end the program with a normal return 0", "Add comments to the key lines"],
  hint: "Several << operators can chain text and variables onto one line; std::endl inserts a newline."
},
"s2": {
  t: "Circle Area Calculator",
  req: ["Define PI = 3.14159 with const", "Read the radius from the keyboard (as a double)", "Print the area with two decimal places"],
  hint: "fixed together with setprecision(2) controls the number of decimals."
},
"s3": {
  t: "Celsius to Fahrenheit",
  req: ["Read a Celsius temperature (decimals allowed)", "Compute F = C * 9 / 5 + 32, minding the integer-division trap", "Print the result with one decimal place"],
  hint: "9/5 is integer division and yields 1 — write 9.0/5 or c*9.0/5 instead."
},
"s4": {
  t: "Multiplication Table",
  req: ["Print the 9x9 times table with nested for loops", "Format each entry like 1*2=2 and align columns with \\t", "Print only the lower triangle (inner loop condition j<=i)"],
  hint: "Write the inner loop condition as j<=i and end each row with std::endl."
},
"s5": {
  t: "Prime Checker Function",
  req: ["Write bool isPrime(int n) that returns false when n<2", "Use a loop and try the efficient i*i<=n form", "Read a number in main and report whether it is prime"],
  hint: "You only need to test up to sqrt(n); the i*i<=n form avoids including <cmath>."
},
"s6": {
  t: "Single-Line Text Statistics",
  req: ["Read a whole line of text with getline", "Count and print letters, digits, spaces and other characters", "Prefer isalpha / isdigit from <cctype>"],
  hint: "Iterate character by character with for (char c : line) and tally each class."
},
"s7": {
  t: "Dynamic Array Sum",
  req: ["Read n and allocate an int array of length n with new", "Fill it with 1..n, then sum and average it through a pointer", "delete[] when finished and set the pointer to nullptr"],
  hint: "After int* a = new int[n]; both *(a+i) and a[i] reach the elements."
},
"s8": {
  t: "Student Score Ranking",
  req: ["Define struct Student{name; score}", "Store at least three students", "Print the top scorer's name, then list everyone by score descending"],
  hint: "Find the maximum by pairwise comparison; sorting simply means swapping whole struct values."
},
"s9": {
  t: "Bank Account Class",
  req: ["class BankAccount with balance kept private", "deposit(double) only accepts amounts greater than 0", "withdraw(double) prints a notice and deducts nothing when funds are insufficient", "show() prints the balance; the constructor starts with 1000"],
  hint: "Member functions read and write balance directly; when a condition fails, print a notice and return."
},
"s10": {
  t: "Polymorphic Shape Areas",
  req: ["Abstract class Shape: virtual double area()=0 plus a virtual destructor", "Derived Circle(r) and Rect(w,h) each implement area", "Store both kinds in a Shape* container and print each area plus the total"],
  hint: "A base-class pointer p->area() dispatches to the right override — that is polymorphism."
},
"s11": {
  t: "Generic Toolbox",
  req: ["Write the function template myMax(T,T) returning the larger value", "Write the function template sumArr(T*, int) summing the array", "Test both templates with int and with double"],
  hint: "Passing an array name passes the address of its first element: sumArr(arr, n)."
},
"s12": {
  t: "Median Finder",
  req: ["Read n and n integers into a vector", "Sort them and print the median", "For even n print the mean of the two middle values (it may be fractional)"],
  hint: "After sort, branch on parity: v[n/2], or (v[n/2-1]+v[n/2])/2.0."
},
"s13": {
  t: "Word Frequency Counter",
  req: ["Read words continuously with while(std::cin>>w) until input ends", "Count each word with map<string,int>", "Print one word and its count per line, then the number of distinct words"],
  hint: "cnt[w]++ creates the key with value 0 and increments it when the key is missing."
},
"s14": {
  t: "Grade Statistics & Sorting",
  req: ["Store five students in vector<Student{name,score}>", "Sort by score descending with sort plus a lambda, then print them", "Use count_if to count and print how many pass (>=60)"],
  hint: "A comparator returning a.score > b.score gives descending order."
},
"s15": {
  t: "Diary Program",
  req: ["Append three lines of text to diary.txt (ios::app)", "Read the file back and print it line by line", "Print a notice instead of crashing when the file cannot be opened"],
  hint: "Write with ofstream plus std::ios::app; read with ifstream plus getline."
},
"s16": {
  t: "Safe Division Calculator",
  req: ["Read a, an operator and b (supporting + - * /)", "throw std::runtime_error on division by zero, catch it and print what()", "Loop until q is entered to quit"],
  hint: "switch(op) dispatches the four operations; the '/' branch throws when b==0."
},
"s17": {
  t: "First Look at Smart Pointers",
  req: ["Store 1..10 with make_unique<vector<int>>", "Print every element with a range-for over const auto&", "Point two shared_ptr at the same int and print use_count()"],
  hint: "After copying a make_shared pointer both share the count — p.use_count() should be 2."
},
"s18": {
  t: "Capstone: Command-Line Calculator",
  req: ["Loop a menu offering + - * / and q to quit", "Encapsulate the arithmetic in functions and dispatch with switch", "Handle division by zero with exceptions and report invalid input", "Organise the code into functions with clear names and comments"],
  hint: "Get calc right first, then wrap the menu loop around it; throw exceptions out of calc."
},
"sdbg": {
  t: "Find & Fix the Out-of-Bounds Bug",
  req: ["The starter contains one out-of-bounds access (the loop condition i<=5 reaches arr[5])", "Change it to i<5 so the program no longer overruns", "The correct output after the fix is sum = 15"],
  hint: "Valid indices run 0..4, so the loop condition should be i < 5; an out-of-bounds access is undefined behaviour and the output becomes garbage."
},
"sbw": {
  t: "Count the Set Bits",
  req: ["Write int countOnes(int n) returning how many 1 bits n has", "Use n &= (n-1) to clear the lowest set bit each round (Brian Kernighan's algorithm)", "Read an integer in main and print the result"],
  hint: "while(n){ n &= (n-1); c++; } loops exactly as many times as there are set bits."
},
"srec": {
  t: "Print the Tower of Hanoi Steps",
  req: ["Use recursion: void hanoi(int n,char a,char b,char c) prints every step of moving n discs from a to c via b", "When n==1 move straight from a to c", "Read n in main and call hanoi(n,'A','B','C')"],
  hint: "Treat the n discs as the top n-1 plus the bottom one — that gives three moves."
},
"sdp": {
  t: "Climbing Stairs (1 or 2 steps)",
  req: ["With n steps and 1 or 2 steps at a time, count the distinct ways up", "Use dp[i]=dp[i-1]+dp[i-2] with dp[0]=dp[1]=1", "Read n in main and print dp[n]"],
  hint: "It is Fibonacci, but note dp[0]=1 — zero steps has exactly one way: not moving."
},
"dsl": {
  t: "Hand-Write a Singly Linked List and Reverse It",
  req: ["Define struct ListNode{int val; ListNode* next;}", "Build 1->2->3->4->5 using tail insertion", "Implement reverse to invert the list in place and print 5 4 3 2 1", "delete every node before the program exits"],
  hint: "prev=nullptr, cur=head; each round save next, point cur->next at prev, then advance all three pointers."
},
"dsk": {
  t: "Valid Parentheses (Stack)",
  req: ["Read a string containing only the characters ()[]{}", "Use a stack to check that every bracket is correctly matched", "Print YES when valid, otherwise NO", "Mind the order: never call top on an empty stack, and the stack must be empty at the end"],
  hint: "On a closing bracket, first check the stack is non-empty, then match and pop; after the scan the stack must be empty."
},
"dst": {
  t: "BST: Insert & Inorder Traversal",
  req: ["Read n and n integers and insert them into a BST (deduplicating equal values)", "Print the inorder traversal — it should come out ascending", "Read one more value q and print the search path, or report that it is absent"],
  hint: "Insert by going left when smaller and right when larger; inorder is left-root-right, which is ascending for a BST."
},
"dsg": {
  t: "Number of Islands (DFS/BFS)",
  req: ["Read an n by m grid of 0/1 (1 is land, 0 is water)", "Count the connected land masses (islands) with DFS or BFS", "Mark visited cells so the same island is not counted twice", "Print the number of islands"],
  hint: "On an unvisited 1: increment the count and flood-fill that whole land mass from there, marking cells as visited."
},
"dsa": {
  t: "Hand-Write Quicksort + Binary Search",
  req: ["Read n and n integers", "Hand-write quicksort (partition plus recursion) — std::sort is not allowed", "Print them ascending; then read target and print its index via binary search (-1 when absent)"],
  hint: "Partition is easiest with the hole-filling scheme: stash the pivot and have the two pointers fill each other's gaps."
},
"eng": {
  t: "Fix a Multithreaded Data Race",
  req: ["In the starter two threads each add 100000 to counter, yet the result usually falls below 200000 (a data race)", "Fix it with std::mutex plus lock_guard, or with std::atomic", "The output must be a stable 200000 (verify by running it several times)"],
  hint: "Option one: guard the critical section with { std::lock_guard<std::mutex> lk(m); ++counter; }. Option two: make counter a std::atomic<int> and increment it directly."
},
"career": {
  t: "Mock Interview: Answer High-Frequency Questions",
  req: ["Pick any three topics from the interview question bank (how virtual functions work, the two smart pointers, tracking down a memory leak) and write them into 'My answer'", "200-300 words each: conclusion first, then the mechanism, then a code example you actually wrote", "Click 'Generate AI review prompt' and have the AI act as a senior interviewer, scoring each answer and asking follow-ups", "Revise once based on the feedback and save the final version to the notes centre"],
  hint: "Lead with the conclusion (under 30 seconds), then explain the mechanism (vtable, reference counting, stack frame); examples from your own projects convince most."
},

/* ==================== Python / 数学 ==================== */
"py1": {
  t: "Self-Introduction & Greeting Program",
  req: ["Print three lines: your nickname, why you want to work on AI, today's date", "Read your name and print Hello, <name>!", "Comment the key lines"],
  hint: "Strings concatenate with +; input() returns a string, so use int(input()) when you need a number."
},
"py2": {
  t: "First N Fibonacci Numbers",
  req: ["Read an integer n", "Store the first n Fibonacci numbers (1,1,2,3,5...) in a list", "Generate them with a for loop and print the whole list", "When n<3 just print the first n terms"],
  hint: "The first two terms are 1 and 1; after that each term is fib[i-1]+fib[i-2]."
},
"py3": {
  t: "Functions + Counting Words in a File",
  req: ["Write a function count_words(path) returning the number of words in a file", "Read a text file with open and split on whitespace", "Call it from main and print the total", "Handle an unopenable file with try/except"],
  hint: "open(path).read().split() splits on any whitespace and len gives the count."
},
"py4": {
  t: "Student Class",
  req: ["Define class Student with name and score attributes", "Method is_pass() returns whether score>=60", "Method add_bonus(n) adds n to the score, capped at 100", "Create two students and print whether they pass", "Count the passing students with a list comprehension"],
  hint: "__init__ is the constructor; self refers to the current object, and attributes are reached as self.x."
},
"ma1": {
  t: "Vectors and Matrices by Hand",
  req: ["Compute the dot product a·b for a=(1,2) and b=(3,1)", "Compute AB for A=[[1,2],[0,1]] and B=[[1,0],[2,3]]", "State whether AB equals BA", "Show every step"],
  hint: "The dot product multiplies matching components and sums them; (AB)ij is row i of A dotted with column j of B."
},
"ma2": {
  t: "Rank and Eigenvalues by Hand",
  req: ["Decide whether (1,2) and (2,4) are linearly dependent and explain what that means", "For A=[[2,0],[0,3]] give the two eigenvalues", "Explain what eigenvalues mean for a matrix that does not change direction", "Show the steps"],
  hint: "(2,4)=2*(1,2), so the two are dependent; for a diagonal matrix the eigenvalues are the diagonal entries."
},
"ma3": {
  t: "Derivatives and Gradients by Hand",
  req: ["Differentiate f(x)=x^3-2x to get f'(x)", "Find the derivative of g(x)=sin(x) at x=0", "For h(x,y)=x^2+y^2 find the partials with respect to x and y", "Say which direction the gradient of h points", "Show every step"],
  hint: "Power rule: (x^n)' = n*x^(n-1); sin' = cos; (x^2)' = 2x."
},
"ma4": {
  t: "Probability and Expectation by Hand",
  req: ["Given P(rain)=0.3 and P(umbrella|rain)=0.9, compute P(rain and umbrella)", "Explain Bayes: given P(positive|sick) and P(sick), how do you obtain P(sick|positive)?", "Find the expected value of one roll of a fair die", "Show the formulas and the steps"],
  hint: "Product rule: P(A and B)=P(A)xP(B|A); expectation is the sum of each value times its probability."
},

/* ==================== 科学计算 / 机器学习 ==================== */
"sp1": {
  t: "Vectorised Temperature Conversion",
  req: ["Build an array c of 0..29 degrees Celsius with NumPy", "Convert to Fahrenheit with the vectorised f = c*9/5 + 32 (no for loop)", "Find the mean and the maximum", "Print the results"],
  hint: "NumPy array arithmetic is element-wise, so c*9/5+32 converts the whole array at once."
},
"sp2": {
  t: "Analysing Grades with Pandas",
  req: ["Create a DataFrame from a dict: name / maths / english", "Add a total column (the two subjects summed, vectorised)", "Sort by total and print the top three", "Plot each student's two scores as a line chart with Matplotlib"],
  hint: "df['total']=df['maths']+df['english']; then df.sort_values('total', ascending=False)."
},
"sp3": {
  t: "Designing a Data Analysis Project",
  req: ["Describe an end-to-end small data project in words (any topic, for example analysing course grades)", "List five steps: where the data comes from, how to clean it, what to analyse, what to plot, what conclusion you draw", "Say which library each step uses (pandas / numpy / matplotlib)", "At least 150 words"],
  hint: "A workable shape: read a CSV with pandas, clean with fillna, aggregate with groupby, plot a bar chart with plt, and conclude something like which group scores higher."
},
"ml1": {
  t: "Fitting a Line with sklearn",
  req: ["Generate noisy samples of y=2x+1 with numpy", "Fit LinearRegression and print the learned coefficient and intercept", "Predict the output for x=10", "Compare against the true slope 2 and intercept 1"],
  hint: "fit takes a 2-D X and a 1-D y; coef_ is the slope and intercept_ the intercept."
},
"ml2": {
  t: "Logistic Regression Classification with sklearn",
  req: ["Generate a binary dataset with sklearn.datasets.make_classification", "Split it with train_test_split (test_size=0.3)", "Train LogisticRegression and print accuracy, precision, recall and F1 on the test set", "Print classification_report"],
  hint: "classification_report gives precision, recall, F1 and support in a single call."
},
"ml3": {
  t: "Scaling + Evaluation Pipeline",
  req: ["Generate and split the data with make_classification", "Use StandardScaler: fit_transform on the training set, transform on the test set", "Train logistic regression and compare test accuracy without and with scaling, explaining the difference briefly", "Print the accuracy after scaling"],
  hint: "A Pipeline prevents leakage — the scaler must be fitted on the training set only."
},
"ml4": {
  t: "Classic Models and Ensembles",
  req: ["Train RandomForestClassifier on make_classification data and print the test accuracy", "Generate unlabelled data with make_blobs, fit KMeans(n_clusters=3) and print each point's cluster label", "Briefly say which of the two is supervised and which is unsupervised", "Print the first ten cluster labels"],
  hint: "RandomForest is an ensemble; KMeans is unsupervised clustering and labels_ holds the cluster ids."
},

/* ==================== 深度学习 / AGI 前沿 ==================== */
"dl1": {
  t: "A NumPy Perceptron",
  req: ["Implement a perceptron in NumPy: randomly initialise w and b", "Repeat several steps: forward pass z=w·x+b, sign/step activation, then update w and b by the error", "Train it on AND-gate data and print the final parameters and predictions", "Hint: the perceptron rule is w += lr*(y-yhat)*x"],
  hint: "AND is linearly separable, so the perceptron converges in a few steps; predict with step(w·x+b)."
},
"dl2": {
  t: "Training a Classifier with PyTorch",
  req: ["Build simple data with torch, or load make_classification and convert it to tensors", "Define a two-layer nn.Sequential network", "Write the training loop: forward, loss, loss.backward(), optimizer.step()", "After several epochs print the loss trend (the reference answer includes complete runnable code)"],
  hint: "CrossEntropyLoss includes softmax; labels must be long integers; each step is opt.zero_grad(), then backward, then step."
},
"dl3": {
  t: "CNN Classification with torchvision",
  req: ["Load MNIST or CIFAR10 through torchvision (the reference answer provides a runnable skeleton)", "Define a convolution, ReLU, pooling, fully connected network", "Train for several epochs and print the accuracy", "Say how many parameters convolution saves compared with a fully connected layer"],
  hint: "Convolution slides a local window over the image and shares weights, so the parameter count is far smaller than a fully connected layer."
},
"dl4": {
  t: "Describe How Attention Works",
  req: ["Explain in words how attention computes a weighted sum given Query, Key and Value", "Write out what softmax(QK^T/sqrt(d))V means (no derivation needed)", "Give an example: how the word 'it' attends to the right antecedent during translation", "At least 150 words"],
  hint: "Attention is a weighted sum of the values, weighted by relevance; QK^T measures similarity and softmax normalises it into weights."
},
"dl5": {
  t: "Sketch or Describe the Transformer",
  req: ["Describe in words which sublayers one Transformer encoder block contains (self-attention, feed-forward, residual, normalisation)", "Say where Q, K and V come from in self-attention (the same sequence)", "Explain why it can be trained in parallel, unlike a step-by-step RNN", "At least 180 words"],
  hint: "An encoder block is self-attention + residual + LayerNorm + feed-forward + residual + LayerNorm; Q, K and V are different linear projections of the same input sequence."
},
"agi1": {
  t: "Describe How Policy Gradients Work",
  req: ["Explain in words what the agent does in an environment and what its objective is", "Explain how policy gradients reward good actions and discourage bad ones when updating the policy", "Give an example: a chess AI wins the game — how are the earlier moves credited", "Explain how RLHF uses human feedback as the reward signal", "At least 180 words"],
  hint: "Policy gradients weight each action by the return it led to, raising or lowering its probability; RLHF distils human preferences into a reward model."
},
"agi2": {
  t: "Design a RAG Pipeline",
  req: ["Describe in words a RAG pipeline for question answering over private documents: chunk, embed, store, retrieve, inject into the prompt, generate", "Explain why this is more reliable than letting the model answer from memory (less hallucination)", "List the key technologies involved (embedding model, vector store)", "At least 180 words"],
  hint: "RAG makes the model look things up before answering, anchoring the answer in the supplied documents and cutting fabrication."
},
"agi3": {
  t: "Design an Agent Loop",
  req: ["Describe in words an agent workflow that can look up the weather and answer: think, pick a tool (weather API), execute, observe, think again, answer", "Explain why the observation step is necessary, otherwise the model may invent the weather", "List the components an agent needs (planning, tools, memory)", "At least 180 words"],
  hint: "An agent is an LLM plus tools plus memory; each round it thinks, calls a tool, then treats the real return as an observation for the next round instead of making things up."
},
"agi4": {
  t: "Map Out Your AGI Learning Roadmap",
  req: ["Write out your AGI engineering roadmap for the next one to two years, in stages", "State the deliverable of each stage (get a training run working, build a RAG, deploy a service)", "List two or three small habits you will keep (projects, notes, practice, papers)", "At least 200 words, honest and achievable"],
  hint: "Combine what this course covers: C++ fundamentals plus Python and maths plus ML/DL plus the frontier; building something that runs beats merely understanding it."
}

};
