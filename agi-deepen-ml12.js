/* ================================================================
 * R0:hello agi · 课程深化层（ml1 机器学习概览与线性回归 / ml2 逻辑回归与分类）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把机器学习入门两章从每节 3 要点深化到 7~8 要点，重心放在「为什么会得出
 *       错误结论」上——范式边界、泛化才是目标、损失/优化器/学习率三者关系、尺度
 *       与标准化、偏差-方差、分类里 MSE 为什么会卡住、准确率陷阱、阈值与业务
 *       代价、AUC 到底说明什么。两章各加一节「综合重构」收口课。
 * 写法沿用 agi-deepen-s12.js：既有课节不写 title；新课写 title/target；
 * order 覆盖全部既有 id；code 里的中文注释全部登记在 codeComments。
 * ================================================================ */

const DEEPEN_ML12 = {
  stages: ["ml1", "ml2"],

  order: {
    ml1: ["ml1-1", "ml1-2", "ml1-3", "ml1-4", "ml1-5", "ml1-6"],
    ml2: ["ml2-1", "ml2-2", "ml2-3", "ml2-4", "ml2-5", "ml2-6"]
  },

  lessons: {

    /* ===================== ml1 机器学习概览与线性回归 ===================== */
    "ml1-1": {
      min: 12,
      summary: [
        "传统编程是人把规则写死（if 金额>5000 就审核），机器学习反过来：给一堆「输入→期望输出」的样本，让算法自己拟合出规则——规则从代码搬进了参数，这就是「从写规则到学规律」。",
        "三大范式的边界只看一件事：对错信号从哪来。监督=人来判每条预测对不对（有标签 y）；无监督=没人判对错，只想知道数据长什么样（聚类、降维）；强化=没有标准答案，只有一串延迟且稀疏的奖励。",
        "还有一类常被漏掉的自监督：标签由输入自己生成（遮住一块让模型猜回来）。它形式上不需要人工标注，所以能吃下海量无标注数据，是现代大模型的地基——「没有标签」和「标签是自己造的」是两件不同的事。",
        "选范式的实用问句只有一句：「历史上有没有人为这件事判过对错？」判过并且能翻出记录，就是监督问题；只是想知道这批用户分成几类，那是无监督。把无监督当监督用（拿簇编号当类别去优化）是最常见的方向性错误。",
        "学出来的东西是「模型形式 + 一组参数」：模型形式（假设空间）人来定，参数由数据定。形式选错时数据再多也救不回来——用直线去拟合一条抛物线，损失再低也是错的。",
        "机器学习的目标其实分两层：把训练数据拟合好，以及在没见过的数据上判得准。只顾第一层会得到一个背题的模型，这一层在 ml1-4 用偏差-方差正面展开。",
        "衔接：本章前置是 sp1/sp2 的 NumPy 与 pandas、ma3 的梯度与 ma4 的概率；学完 ml1 就能理解「训练」到底在算什么，ml2 处理的是同一套机制换一种输出。"
      ],
      summary_en: [
        "Classic programming hard-codes the rules a person writes (if amount > 5000, review it); machine learning inverts that: hand it many input/expected-output pairs and the algorithm fits the rule itself — the rule moves from the code into the parameters.",
        "The three paradigms differ in exactly one thing: where the correctness signal comes from. Supervised = a human labelled whether each prediction is right; unsupervised = nobody judges, you only want to know the structure of the data; reinforcement = no gold answer, only delayed and sparse reward.",
        "A fourth often-missing case is self-supervision: labels are manufactured from the input itself (hide a part, ask the model to guess it back). It needs no human annotation, which is why it swallows enormous unlabeled corpora — 'no labels' and 'labels invented from the data' are not the same thing.",
        "One question picks the paradigm: 'has anyone ever judged whether this was right?' If yes and the record is recoverable, it is supervised. If you only want to know how users fall into groups, it is unsupervised. Running unsupervised code as if it were supervised (optimising against cluster ids) is the classic directional mistake.",
        "What you learn is 'a model form plus a set of parameters': a human picks the form (the hypothesis space), the data picks the parameters. A wrong form cannot be rescued by volume — a straight line fitted to a parabola stays wrong however low the loss goes.",
        "The objective has two layers: fit the training data well, and be right on data you have never seen. Serving only the first layer gives you a model that memorised the exam; ml1-4 opens that up with bias and variance.",
        "Bridge: this chapter assumes sp1/sp2 (NumPy, pandas) plus the gradient from ma3 and probability from ma4; once ml1 is done you know what 'training' actually computes, and ml2 is the same machinery with a different output."
      ],
      code: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression

# 监督：每一行都有人替它判过对错，标签来自外部
X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([2.1, 4.2, 5.9, 8.1])
reg = LinearRegression().fit(X, y)

# 无监督：只给 X，没有任何对错信号，只想知道数据里有几堆
groups = KMeans(n_clusters=2, n_init=10).fit_predict(X)

# 自监督：标签由输入自己生成，所以它形式上无标注、用法上却是监督
masked = np.array([1.0, np.nan, 3.0, np.nan])

print("slope", round(float(reg.coef_[0]), 3), "clusters", groups, "masked", np.isnan(masked))`,
      pit: "把无监督当监督用：拿 KMeans 的簇编号当类别去训练或去解释。簇号是任意分配的——换个随机种子，同一堆数据的 0 号和 1 号会对调，你写下的「簇 2 是高价值客户」下周就失效；反过来，明明有标签却只做聚类，等于把最值钱的信号扔掉。",
      pit_en: "Using unsupervised code as if it were supervised: treating a KMeans label as a class. Cluster ids are arbitrary — change the seed and label 0 and 1 swap, so 'cluster 2 is the high-value group' stops holding next week; the mirror mistake is clustering data that already has labels, throwing away the most valuable signal.",
      ex: {
        q: "同一批用户点击日志，什么时候算监督问题，什么时候算无监督问题？",
        a: "能翻出后续转化或人工标注当标签去预测，就是监督；只想看用户分成几类、手里没有任何对错信号，才是无监督——范式由你有没有「对错信号」决定，不由数据长什么格式决定。",
        q_en: "For the same click log, when is it a supervised problem and when an unsupervised one?",
        a_en: "If you can recover a later conversion or a human judgement to use as y, it is supervised; if you only want to see how users fall into groups with no correctness signal at all, it is unsupervised — the signal decides, not the file format."
      }
    },

    "ml1-2": {
      min: 13,
      summary: [
        "线性回归假设「输出是特征的加权和」y≈w·x+b。这个假设极强：它表达不了任何弯，所以在写代码之前先画散点图看关系像不像直线，比换模型更有价值。",
        "多特征时 w 的含义是「其它特征不动，这个特征加 1，y 平均变化多少」——它是偏效应，不是因果效应。冰淇淋销量与溺水人数高度相关，系数再显著也不代表吃冰淇淋导致溺水。",
        "MSE = 平均(预测−真值)²。平方不是审美：它让正负误差不抵消、处处可导、并且放大大错，于是优化器优先去修那些「错得离谱」的点。",
        "损失的选择其实是噪声分布的选择：最小化 MSE 等价于假设误差服从高斯分布的最大似然，换成 MAE 就等于假设误差服从拉普拉斯；两者没有谁更正确，只有谁更符合你数据里误差的形状。",
        "离群点是 MSE 的命门：10 倍误差会变成 100 倍惩罚，一条录脏的数据就能把整条线拽歪。先用 MAE 或 Huber 损失对比一下，再回去查那 1% 的行是不是录入错误——直接删点之前必须先解释得出错的原因。",
        "小数据可以不走迭代：正规方程 (XᵀX)⁻¹Xᵀy 有闭式解。但 XᵀX 不可逆时解就不存在——两列完全线性相关（同一金额的美元价与人民币价），或者特征数多于样本数，都会踩到这一点。",
        "共线性的麻烦不在预测而在解释：两列高度相关时预测照样准，但各自的 w 会变得巨大且随抽样乱抖，「w 为正说明 X 导致 Y」这类话全部失效。Ridge 加一项 λ‖w‖² 相当于把 XᵀX 变成 XᵀX+λI，立刻可逆；Lasso 则会把冗余列直接压成 0（取舍在 ml3-3 展开）。",
        "R² 什么时候骗你：多加一列纯噪声，训练 R² 也不会下降（OLS 总能从噪声里蹭到一点），所以它是过程指标；样本外没算的 R²、外推区间之外的 R²、以及不和「只预测均值」这条基线并排写的 R²，都不构成证据。"
      ],
      summary_en: [
        "Linear regression assumes the output is a weighted sum of features, y = w.x + b. That is a very strong assumption - it cannot express any bend - so checking the scatter plot for straightness before writing code beats swapping models.",
        "With several features a coefficient means 'holding the others fixed, how much does y move on average when this feature gains 1'. That is a partial effect, not a causal one: ice-cream sales and drowning correlate, and a significant coefficient still does not make one cause the other.",
        "MSE is the mean squared residual. Squaring is not aesthetics: it stops positive and negative errors cancelling, keeps the function differentiable, and magnifies large mistakes so the optimiser fixes the worst points first.",
        "Choosing a loss is choosing a noise model: minimising MSE is maximum likelihood under Gaussian errors, minimising MAE is maximum likelihood under Laplace errors. Neither is correct, one simply matches the shape of your residuals better.",
        "Outliers are MSE's weak spot: 10x error becomes 100x penalty, and one miskeyed row can tilt the whole line. Compare against MAE or Huber first, then go and explain why that 1% of rows looks wrong - never delete points before you can name the cause.",
        "Small data needs no iteration: the normal equation (X'X)^-1 X'y is closed-form. But when X'X is not invertible there is no solution - which happens when two columns are perfectly correlated (dollars and renminbi of the same price) or when there are more features than rows.",
        "Collinearity hurts explanation, not prediction: with two highly correlated columns the fit stays good but each coefficient blows up and jitters with resampling, so 'positive coefficient means X drives Y' collapses. Ridge adds lambda*||w||^2, turning X'X into X'X + lambda*I so it is invertible again; Lasso zeroes the redundant column instead (trade-off in ml3-3).",
        "When R-squared lies: adding a column of pure noise can never lower training R-squared (OLS always harvests something from noise), so it is a process metric; R-squared computed in-sample, extrapolated outside the data range, or quoted without the 'predict the mean' baseline next to it is not evidence."
      ],
      code: `import numpy as np

X = np.array([[1.0], [2.0], [3.0], [4.0], [5.0]])
y = np.array([2.1, 3.9, 6.2, 7.8, 10.1])

# 补一列 1，把截距也放进解向量，正规方程才完整
A = np.hstack([X, np.ones((len(X), 1))])
print("closed form", np.linalg.solve(A.T @ A, A.T @ y))

# 共线性：第二列只是第一列的 7 倍，X'X 变成奇异矩阵
B = np.hstack([X, 7 * X, np.ones((len(X), 1))])
try:
    np.linalg.solve(B.T @ B, B.T @ y)
except np.linalg.LinAlgError:
    # 报奇异就在这里：不是数值不稳，而是这两列根本没有独立信息
    print("X'X is singular, so the solution is not unique")

# Ridge 就是把单位矩阵加进去，立刻可逆；代价是系数被整体缩小
lam = 1e-3
print("Ridge solution", np.linalg.solve(B.T @ B + lam * np.eye(3), B.T @ y))`,
      pit: "只报「训练集 R²=0.999」就宣布模型可用：线性回归的训练 R² 随特征数单调不降，加 20 列纯噪声也能把它推高，于是你以为「特征越多越好」。同一份数据上算验证集的 R²，曲线立刻掉头——这两个数的差就是过拟合本身。",
      pit_en: "Declaring victory on 'training R-squared = 0.999': for least squares, training R-squared never drops as you add columns, so 20 noise features also push it up and more looks better. Score the same model on held-out data and the curve turns around - that gap is overfitting itself.",
      ex: {
        q: "为什么共线性下预测还准、系数却不能解释？",
        a: "因为冗余的两列可以互相补偿：只要加权和不变，预测就不变，而满足条件的 (w1,w2) 有无穷多组，数据无法区分谁该拿权重，于是估计出来的系数只反映抽样噪声。",
        q_en: "Why does collinearity leave predictions fine but make coefficients uninterpretable?",
        a_en: "Because correlated columns trade off against each other: any weighting with the same sum predicts identically, so infinitely many (w1,w2) fit the data equally well and the reported coefficient mostly reflects sampling noise."
      }
    },

    "ml1-3": {
      min: 13,
      summary: [
        "梯度下降不猜答案，它反复只问一句「往哪个方向挪一点点会变好」：w ← w − η·∂L/∂w。损失对参数的梯度就是那个方向，负梯度是下降最快的方向。",
        "三个角色必须分清：损失函数定义「什么叫好」（决定优化目标与梯度形状），模型定义「解长什么样」（参数空间），优化器与学习率定义「怎么走过去」。换损失是换目标，换优化器是换走路姿势，换学习率只是换步长——三者不可互相替代。",
        "学习率几乎是唯一「非调不可」的超参：太大在山谷两侧来回跳甚至发散，太小则几万步还在原地。稳妥做法是先用小学习率确认损失在稳定下降，再逐步放大到「刚好还稳」，然后往回退一档。",
        "尺度问题是梯度下降的结构性缺陷：∂L/∂w 里带着该特征自己那一列，收入（十万量级）与年龄（十位量级）放在一起，同一个学习率对前者是合适的步长、对后者几乎等于不动。",
        "所以梯度类模型必须先标准化（减均值、除标准差）：它把损失面的等高线从「极扁的椭圆」压成接近圆形，最速下降方向才真的指向最优点，否则你会看到损失在下降但慢得离谱。",
        "批量的三种取法是一种预算权衡：全批量每步梯度准但慢、且一次装不进内存；batch=1 最便宜但方向抖得厉害；小批量 32/128/256 同时吃到矩阵并行与噪声平滑，这也是硬件决定的默认值。",
        "动量和 Adam 是在补偿「所有参数共用一个学习率」这件事，它们能缓解尺度差异但不能取代标准化：尺度统一后，同一个正则强度 λ、同一套初始化、同一个学习率才对各特征都公平。",
        "「损失不降」的排查顺序（这里最容易出错）：先查学习率是否过大、再查是不是没标准化、再查标签里有没有 NaN 或错位、最后才怀疑模型容量——线性回归的 MSE 是凸的，不存在「卡在局部极小」这种借口。"
      ],
      summary_en: [
        "Gradient descent never guesses the answer; it keeps asking one question - 'which way should I nudge to get better': w -= eta * dL/dw. The gradient is that direction and its negative is the steepest descent.",
        "Keep the three roles apart: the loss defines what counts as good (the objective and the shape of the gradient), the model defines what a solution looks like (the parameter space), and the optimiser plus learning rate define how you walk there. Changing the loss changes the goal, changing the optimiser changes your gait, changing the rate only changes step length - none substitutes for another.",
        "The learning rate is close to the only hyper-parameter you must tune: too high and you bounce across the valley or diverge, too low and you are still in place after 50k steps. Start small, confirm the loss is falling steadily, then grow to 'just barely stable' and back off one notch.",
        "Scale is a structural flaw of gradient descent: dL/dw carries the feature's own column, so with income (hundreds of thousands) next to age (tens), one learning rate is a fair step for the first and almost no movement for the second.",
        "That is why gradient models must be standardised (subtract mean, divide by std): it squeezes the loss contours from a very flat ellipse toward a circle, so the steepest direction actually points at the optimum - otherwise the loss does fall, absurdly slowly.",
        "The three batch styles are a budget trade: full-batch gives accurate but slow steps and must fit in memory; batch=1 is cheapest but the direction is very noisy; 32/128/256 gets both matrix parallelism and noise smoothing, which is why those are the defaults.",
        "Momentum and Adam compensate for 'all parameters share one learning rate'; they soften the scale problem but do not replace scaling features, because only with comparable scales do one lambda, one initialisation and one rate treat every feature fairly.",
        "Order of investigation when the loss will not fall: learning rate too big, features not standardised, NaN or misaligned labels, and only then model capacity - MSE for a linear model is convex, so 'stuck in a local minimum' is not available as an excuse."
      ],
      code: `import numpy as np
# 先固定随机种子：不设它两次跑出不同分数，你会以为是自己改坏了代码
rng = np.random.default_rng(0)
n = 500
# 两个特征尺度差五个数量级，这正是梯度下降最怕的输入
income = rng.normal(300000, 80000, n)
age = rng.normal(40, 12, n)
y = 0.00004 * income + 1.5 * age + rng.normal(0, 5, n)

def scale(a):
    return (a - a.mean()) / a.std()

def fit(X, eta, steps):
    w = np.zeros(X.shape[1] + 1)
    for _ in range(steps):
        err = X @ w[1:] + w[0] - y
        # 每个特征的梯度都乘着自己那一列，尺度大的天然拿到更大的步长
        g = np.empty(X.shape[1] + 1)
        g[0] = err.mean()
        g[1:] = X.T @ err / len(y)
        w -= eta * g
    return w

raw = np.column_stack([income, age])
std = np.column_stack([scale(income), scale(age)])
print("no scaling", fit(raw, 1e-7, 300))
print("standardised", fit(std, 0.1, 300))`,
      pit: "忘了标准化就把 Adam 请上来「救场」：自适应学习率确实能压平尺度差异，但它每维要自己攒二阶矩，收敛更慢、正则强度也变得难解释，而且遇到常数列或全零列会给出奇怪的步长。标准化是免费的、一次投入全部模型受益，不该用优化器去补数据的漏。",
      pit_en: "Skipping feature scaling and calling in Adam to rescue: adaptive rates do flatten scale differences, but they must accumulate a second moment per dimension, converge slower, make the regularisation strength hard to read and behave oddly on constant or all-zero columns. Scaling is free and benefits every model at once - do not use the optimiser to patch the data.",
      ex: {
        q: "为什么学习率太大时损失会不降反升，而不只是「变慢」？",
        a: "一步跨过了最优点落到谷底另一侧，且那里的梯度更大，下一步就跨得更远，于是振幅逐次放大直到发散；凸二次问题里这纯粹由步长超过 1/曲率 引起，与数据好坏无关。",
        q_en: "Why does too large a learning rate make the loss rise instead of merely slowing down?",
        a_en: "One step overshoots the optimum onto the other wall where the gradient is even larger, so the next step is bigger still and the oscillation grows until it diverges; in a convex quadratic this is purely step length exceeding 1/curvature, nothing to do with data quality."
      }
    },

    "ml1-4": {
      min: 12,
      summary: [
        "泛化误差 = 训练误差 + 把噪声当规律学进来的那部分。我们唯一能直接观测的是训练误差，所以它是过程指标：拿它当目标，优化的正好是「看不见的那一半」。",
        "偏差-方差把错误拆成两块：偏差是模型太简单，连训练集都拟合不动；方差是模型太敏感，换一批数据结果就变。欠拟合是高偏差，过拟合是高方差，两者的药方相反，所以要先看是哪种。",
        "模型容量是这条 U 形曲线的横轴：从一条直线到 15 阶多项式，训练误差单调下降、验证误差先降后升，最低点才是该停的位置。「再大一点会不会更好」的答案是「先看看验证曲线」。",
        "过拟合的三个信号：训练分数很高而验证分数很低；继续加大容量时验证分数不涨反降；以及预测在训练点上完美、输入稍微挪动就剧烈变化（可以在验证点上手动扰动一下看反应）。",
        "三种对策按性价比排序：更多且更多样的数据（最有效但最贵）、给模型加约束（正则化、限深度、早停）、用交叉验证选超参（它本身不是对策，而是防止你把过拟合当成进步的那把尺）。",
        "正则化的取舍要记牢：Ridge 把所有系数一起缩小但不清零，特征全保留，适合共线性；Lasso 会把不重要特征挤成 0，等于顺手做了特征选择，适合高维稀疏；两者都嫌极端时用弹性网络。系数尺度可罚的前提是特征已经标准化。",
        "早停为什么算正则：优化器先学到幅度大的低频结构，很久之后才开始记忆噪声，在拐点收手就是限制容量。但它依赖验证集，而你又用同一个验证集挑超参——验证集就被消耗掉了，这正是 ml3-1 要正面处理的数据泄漏。",
        "「数据多一点就好」有前提：更多同分布、更多样的数据才降方差；把同一批样本复制三遍，方差一点不掉，只会让交叉验证的折之间互相泄漏。"
      ],
      summary_en: [
        "Generalisation error = training error plus whatever you learned from noise. Training error is the only piece you can observe directly, so it is a process metric: make it the goal and you are optimising exactly the half you cannot see.",
        "The bias-variance split names two failure modes: bias means the model is too simple to fit even the training set, variance means it is so sensitive that a new sample changes the answer. Underfitting is high bias, overfitting high variance, and the cures are opposite, so diagnose before treating.",
        "Model capacity is the horizontal axis of that U-curve: going from a line to a 15th degree polynomial, training error falls monotonically while validation error falls then rises, and the bottom is where you should stop. 'Would bigger be better?' is answered by the validation curve, not by taste.",
        "Three signals of overfitting: training score far above validation score; validation score dropping as you add capacity; and predictions that are perfect at training points but swing wildly when you nudge the input a little.",
        "Countermeasures by cost: more and more diverse data (most effective, most expensive), constrain the model (regularisation, depth limits, early stopping), and cross-validation for hyper-parameters - the last is not a cure but the ruler that stops you reading overfitting as progress.",
        "Hold the regularisation trade-off: Ridge shrinks every coefficient without zeroing any, keeping all features, which suits collinearity; Lasso pushes unimportant ones to exactly zero and selects features on the way, which suits high-dimensional sparse data; Elastic Net sits between. Both only make sense once features are standardised, since otherwise you penalise units, not importance.",
        "Why early stopping counts as regularisation: the optimiser learns large low-frequency structure first and only much later starts memorising noise, so quitting at the knee caps capacity. It relies on a validation set, and if that same set is used to pick hyper-parameters it has been consumed - which is exactly the leakage ml3-1 handles head-on.",
        "'More data helps' has a condition: only more same-distribution, more diverse data lowers variance. Duplicating the same rows three times lowers nothing and merely lets copies leak between cross-validation folds."
      ],
      code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# 真关系是一条直线，只有一点点噪声；容量越大越容易把噪声当规律
rng = np.random.default_rng(1)
x = rng.uniform(0, 1, 60)
y = 3 * x + rng.normal(0, 0.25, 60)
xtr, xte, ytr, yte = train_test_split(x, y, random_state=0)

for deg in (1, 4, 12):
    Xtr = np.vander(xtr, deg + 1)
    Xte = np.vander(xte, deg + 1)
    m = LinearRegression().fit(Xtr, ytr)
    # 只看训练分数会一路走高，于是你以为「越大越好」
    print(deg, round(m.score(Xtr, ytr), 4), round(m.score(Xte, yte), 4))

# 同一容量下把系数压小（Ridge），验证分数就回来了
A = np.column_stack([xtr ** 12, xtr, np.ones_like(xtr)])
w = np.linalg.solve(A.T @ A + 1e-2 * np.eye(3), A.T @ ytr)
B = np.column_stack([xte ** 12, xte, np.ones_like(xte)])
print("Ridge", 1 - ((B @ w - yte) ** 2).mean() / yte.var())`,
      pit: "12 阶多项式的测试 R² 掉到 0.6 就断定「这个模型不行」，其实错的是把它当结论：同一个数据上直线拟合的测试 R² 有 0.99，说明模型行不行要看「和更简单的候选比」而不是看绝对分数；没有基线对照，任何分数都可以被你解释成任何结论。",
      pit_en: "Reading a 12th degree fit's test R-squared of 0.6 and concluding 'this model is useless' - the mistake is treating a bare number as a conclusion. A straight line on the same data scores 0.99, so 'good' only exists as a comparison against a simpler candidate; without a baseline any score supports any story.",
      ex: {
        q: "为什么「训练集 100% 正确」通常是坏消息而不是好消息？",
        a: "因为达到 100% 往往意味着模型容量足以把标签里的噪声和录入错误一起背下来，此时训练分数已经饱和、不再提供任何「有没有学到规律」的信息，唯一的信号只剩未见数据上的表现。",
        q_en: "Why is '100% on the training set' usually bad news?",
        a_en: "Because hitting 100% usually means the model had enough capacity to memorise the noise and the mislabelled rows too; the training score is now saturated and carries no information about whether a real pattern was learned, leaving held-out performance as the only signal."
      }
    },

    "ml1-5": {
      min: 11,
      summary: [
        "sklearn 的接口约定是「一个方法只有一个意思」：fit(X, y) 只从训练数据里更新内部参数，predict(X) 只读不写，score(X, y) 用该模型的默认指标打分（回归是 R²，分类是准确率）。",
        "形状约定最容易翻车：X 必须是 (样本数, 特征数) 的二维数组，哪怕只有一个特征也要写成 (n, 1)；y 是一维 (n,)。把 y 写成 (n,1)、或者把特征当样本传，得到的不是形状报错就是「能跑但全错」。",
        "fit 之后拿训练集回去 score，分数必然漂亮——它只证明模型容量够，不证明学到了东西；评估必须换新数据。这是新手最常见的「我的模型有 0.99」的来源。",
        "接口统一的真正收益是可以批量比模型：LinearRegression → Ridge → RandomForestRegressor 只换类名，因此能写一个循环把候选模型跑在同一套评估协议上；反过来说，任何跨流程比出来的「谁更好」都不算数。",
        "要有流水线意识：现在你手动 fit_transform 训练集、transform 测试集还是对的，一旦加上编码、PCA、缺失值填补，就一定会漏掉某一步——ml3 会把这件事固化成 Pipeline，防的是未来的自己。",
        "报错速查：could not convert string to float（类别列忘了编码）、Found input variables with inconsistent numbers of samples（X 与 y 长度不齐或 X 转置了）、Expected 2D array（忘了 reshape）、高维时报 ConvergenceWarning（该标准化或调 max_iter）。",
        "衔接：ml1 到这里工具链已经通了，ml2 只换一件事——输出从连续值变成「属于某类的概率」，损失、指标、评估方式全都要跟着换。"
      ],
      summary_en: [
        "The sklearn contract gives every method one meaning: fit(X, y) only updates internal parameters from training data, predict(X) only reads, and score(X, y) applies that estimator's default metric (R-squared for regressors, accuracy for classifiers).",
        "Shapes break first: X must be 2-D as (samples, features), so even one feature needs (n, 1), and y is 1-D of length n. Passing y as (n, 1) or feeding features as rows gives either a shape error or something that runs and is entirely wrong.",
        "Scoring the training set right after fitting always looks great - it proves capacity, not learning; evaluation requires data the fit never saw. This is the standard origin of 'my model gets 0.99'.",
        "The real payoff of a uniform API is batch comparison: LinearRegression, Ridge, RandomForestRegressor differ by one class name, so a single loop can run every candidate under one evaluation protocol - and any 'which is better' compared across different protocols does not count.",
        "Think in pipelines: hand-calling fit_transform on train and transform on test is still correct today, but once encoding, PCA and imputation are added some step will get missed. ml3 turns this into a Pipeline, protecting the future you.",
        "Error cheat-sheet: 'could not convert string to float' (unencoded categorical column), 'inconsistent numbers of samples' (X and y lengths differ, or X is transposed), 'Expected 2D array' (missing reshape), and ConvergenceWarning on wide data (scale the features or raise max_iter).",
        "Bridge: with the toolchain working, ml2 changes exactly one thing - the output becomes 'probability of a class' instead of a continuous value, and the loss, the metrics and the evaluation all have to follow."
      ],
      code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

X = np.array([[1.0], [2.0], [3.0], [4.0], [5.0], [6.0]])
y = np.array([2.1, 3.9, 6.2, 7.8, 10.1, 12.2])

# 单特征也必须是二维 (n, 1)；一维会直接抛 Expected 2D array
# 把 X 写成 X.reshape(-1, 1) 是最省事的补救
m = LinearRegression().fit(X, y)
print(m.coef_, m.intercept_)

# score 用的是默认指标 R 方，并且算在你传进去的那份数据上
print("train score", round(m.score(X, y), 4))

Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=2, random_state=0)
m2 = LinearRegression().fit(Xtr, ytr)
# 只有换了新数据，这个数才刚开始有一点意义
print("test score", round(m2.score(Xte, yte), 4))`,
      pit: "用 `X = df['面积']` 直接喂进 fit：形状是 (n,)，报错或更糟——被当成 1 个样本 n 个特征而「跑通」。养成 `df[[\"面积\"]]` 或 `.values.reshape(-1, 1)` 的写法，并且 fit 之前先 print 一次 `.shape`。",
      pit_en: "Passing X = df['area'] straight into fit: the shape is (n,), so you either get an error or, worse, it 'works' by treating your one series as a single sample with n features. Get into df[['area']] or .reshape(-1, 1), and print .shape once before fitting.",
      ex: {
        q: "sklearn 的 `score()` 为什么经常给出高得不合理的分数？",
        a: "因为它的默认指标是按你传入的数据算的，你把训练集传给它，它就用训练集打 R²/准确率——分数高只说明模型拟合得下这份数据，与泛化无关。",
        q_en: "Why does sklearn's score() often return implausibly high numbers?",
        a_en: "Because its default metric is computed on whatever you pass in; hand it the training set and it grades the training set - a high number then only says the model can fit that data, which says nothing about generalisation."
      }
    },

    "ml1-6": {
      title: "综合重构：从一份数据到一条可信的拟合线",
      title_en: "Synthesis: From Raw Data to a Trustworthy Fitted Line",
      min: 15,
      target: "能按固定流程在陌生表格数据上跑通「基线 → 线性回归 → 对比」，并对自己得出的每个数字说清它是在哪份数据上算的、和谁比。",
      target_en: "Run a fixed flow (baseline, linear regression, comparison) on an unfamiliar tabular dataset and state, for every number, which data it was computed on and what it is being compared against.",
      summary: [
        "收口六问（自查清单）：输出是连续还是类别？有没有人给过标签？样本数与特征数各多少？特征尺度差几个数量级？散点图像不像直线？验证分数与训练分数差多少？——六问答完，模型与预处理的选择基本就自动出来了。",
        "一条固定流程：读数据 → 看分布与缺失 → 先划分 → 只用训练折 fit 缩放器 → 拟合 → 在验证集上比 → 最后才碰测试集。顺序里最重要的就是「先划分」，ml3 会把它写成 Pipeline。",
        "本章翻车 Top5 复盘：拿训练分数当效果 / 没标准化导致损失不降 / 共线性却去解释系数 / 离群点把线拽歪 / 类别列直接喂进回归。每一条都能对应到一个具体的报错或具体的错误结论，不是抽象提醒。",
        "三条元规则（防「得出错误结论」）：任何统计量先问「这是在哪个数据集上算的」；任何系数先问「其它特征固定是什么意思」；任何分数先问「和预测均值的基线比怎么样」。",
        "一定要手工跑一遍：用 NumPy 写一次 MSE 与梯度下降，再和 sklearn 的 coef_、intercept_ 对齐到小数点后 2~3 位；对上了你才真的知道「训练」在做什么，只会调 API 的人换个框架就懵。",
        "本章的边界：线性假设 + 人来设计特征。容量撞到上限时，ml2 先把输出换成概率，ml4 用树模型换掉线性形式，dl1 再把「特征从哪来」交给网络自己学。",
        "达标线：拿一份你没见过的表格数据，30 分钟内给出「均值基线 vs 线性回归」两个数、判断有没有过拟合、并说清每个系数的含义与不含义——三者缺一，就还没过关。"
      ],
      summary_en: [
        "Closing checklist of six questions: continuous output or a class? did a human ever supply labels? how many rows and how many columns? how many orders of magnitude apart are the features? does the scatter plot look like a line? how far apart are train and validation scores? Answer them and the model plus preprocessing mostly pick themselves.",
        "One fixed flow: load, inspect distributions and missing values, split first, fit the scaler on the training part only, fit, compare on validation, touch the test set last. The single most important word is 'first' in split first - ml3 enforces it with a Pipeline.",
        "This chapter's top five failures: quoting a training score as the result, skipping standardisation until the loss refuses to fall, interpreting coefficients that collinearity made meaningless, letting one outlier tilt the line, feeding a text column into a regressor. Each maps to a concrete error or a concrete wrong conclusion, not to vague advice.",
        "Three meta-rules against wrong conclusions: for any statistic ask 'which dataset is this computed on'; for any coefficient ask 'what does holding the others fixed mean here'; for any score ask 'how does it compare with just predicting the mean'.",
        "Do it by hand once: write MSE and gradient descent in NumPy, then check the coefficients against sklearn's coef_ and intercept_ to 2-3 decimals. If they agree you know what training is; if you only ever called fit you will be lost on the next framework.",
        "Boundaries of this chapter: a linear form and human-designed features. When capacity is the limit, ml2 swaps the output for a probability, ml4 swaps the linear form for trees, and dl1 hands 'where do features come from' to the network.",
        "Bar to clear: on a dataset you have never seen, within 30 minutes produce two numbers (mean baseline vs linear regression), say whether it is overfitting, and state what each coefficient does and does not mean. Miss any of the three and you are not through."
      ],
      code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

# 固定种子造一份可复现的数据：4 个特征、噪声适中，才看得出梯度下降在收敛
rng = np.random.default_rng(0)
X = rng.normal(0, 1, (600, 4))
y = X @ np.array([2.0, -1.5, 0.0, 0.8]) + rng.normal(0, 0.3, 600)
Xtr, Xte, ytr, yte = train_test_split(X, y, random_state=0)

# 第一步永远是最朴素的基线：什么都不学，只预测训练集均值
base = np.full(len(yte), ytr.mean())

# 然后才是本章的主角；两者并排写，绝对分数才开始有意义
lin = LinearRegression().fit(Xtr, ytr)
for name, pred in [("mean baseline", base), ("linear regression", lin.predict(Xte))]:
    print(name, "R2", round(r2_score(yte, pred), 3), "MAE", round(mean_absolute_error(yte, pred), 2))

# 手工复现一次梯度下降，验证你真的理解「训练」在算什么
w = np.zeros(Xtr.shape[1] + 1)
for _ in range(4000):
    err = Xtr @ w[1:] + w[0] - ytr
    w[0] -= 0.1 * err.mean()
    w[1:] -= 0.1 * Xtr.T @ err / len(ytr)
print("hand-written w", np.round(w[1:], 2), "sklearn coef", np.round(lin.coef_, 2))`,
      pit: "把这一章的清单只在脑子里过一遍就去做下一题：下次遇到「分数怎么是 0.999」你还是得重新推。让清单变成动笔动作——在 notebook 第一格写下划分方式、指标、基线三个数，三分钟的投入会在真正上线时省你三小时。",
      pit_en: "Reading the checklist once in your head and moving on: next time a score comes out 0.999 you will re-derive everything. Make the checklist a writing act - put split, metric and baseline in the first notebook cell; three minutes there saves three hours at launch.",
      ex: {
        q: "清单里的六问中，哪一问最容易在真实项目里被跳过？为什么跳过它代价最大？",
        a: "「有没有人给过标签」最容易被跳过——很多人拿到数据就开工，事后才发现所谓标签是事后统计出来的结果（带未来信息），于是整条流水线从一开始就在学泄漏，做再多调参都白干。",
        q_en: "Which of the six questions gets skipped most in real projects, and why is skipping it so expensive?",
        a_en: "'Did a human ever supply the label.' People start coding immediately and only later discover the 'label' is an after-the-fact aggregate containing future information, so the whole pipeline has been learning leakage from step one and no amount of tuning recovers it."
      }
    },

    /* ===================== ml2 逻辑回归与分类 ===================== */
    "ml2-1": {
      min: 11,
      summary: [
        "分类的输出是「类别」而不是数值。把垃圾邮件编码成 1、正常编码成 0 然后当回归做，程序能跑，但它在最小化「到 0 和 1 的欧氏距离」，而不是「判对」——阈值附近这两件事完全不一样。",
        "直接拿 w·x+b 判正负会给出任意实数（-3、+7），既不能跨样本比较也表达不了置信度；sigmoid 把实数单调压到 (0,1)、处处可导、只需一个参数就能接上现成的梯度下降，是最省事的「分数→概率」包装。",
        "sigmoid 的软肋是饱和：导数 σ(z)(1−σ(z)) 最大只有 0.25，|z| 一大就贴着 0。也就是说，一个被自信地判错的样本（真值 1、预测 0.001）恰恰是梯度最小的那个。",
        "这正是不能用 MSE 配 sigmoid 的原因：MSE 对 w 的梯度里带着 σ′(z) 这个因子，饱和时整体≈0，损失面上出现大片平地，几乎不动；换成对数损失后同一因子被约掉，判得越自信越错，梯度反而越大。",
        "对数损失 −[y·log p + (1−y)·log(1−p)] 的设计动机：它是「给出真实类别的那个概率」取负对数，概率趋近 0 时惩罚趋近无穷。它逼模型不敢说绝对，而不是逼它把 0 和 1 拉得更远。",
        "交叉熵还顺带解决了一个尺度问题：MSE 在概率空间里对小误差几乎不罚（0.49 与 0.51 差一点点），而业务恰恰在乎这种「排序上的差别」；对数损失把这类差别放大到可优化的尺度。",
        "衔接：ml1 的梯度下降、标准化、过拟合信号在这里一字不改地适用；w·x+b 的量纲问题依旧存在，逻辑回归不标准化就训练不稳是它最常见的「不收敛」原因。"
      ],
      summary_en: [
        "Classification outputs a class, not a quantity. Encode spam as 1 and ham as 0 and run a regression and it works, but it minimises Euclidean distance to 0 and 1 rather than wrong decisions - and near the threshold those two goals disagree completely.",
        "Judging the sign of w.x + b gives you any real number (-3, +7), comparable across neither sample nor confidence; sigmoid squeezes the reals monotonically into (0,1), is differentiable everywhere, and plugs into the gradient descent you already have - the cheapest possible score-to-proprobability wrapper.",
        "Sigmoid's weakness is saturation: the derivative sigma(1-sigma) tops out at 0.25 and hugs zero as |z| grows, so a confidently wrong example (truth 1, predicted 0.001) is precisely the one that produces almost no gradient.",
        "That is why MSE and sigmoid are a bad pair: the MSE gradient carries a sigma'(z) factor, so once you saturate the whole gradient is near zero and the loss surface turns into flat plateau. Log loss cancels that same factor, so the more confidently wrong you are, the larger the gradient.",
        "Log loss, minus y*log p + (1-y)*log(1-p), is the negative log of the probability assigned to the true class; as that probability approaches 0 the penalty approaches infinity. It pressures the model never to claim certainty, rather than pushing 0 and 1 further apart.",
        "Cross-entropy also fixes a resolution problem: MSE barely punishes small differences in probability space (0.49 vs 0.51 costs almost nothing) while business decisions live exactly on that ordering; log loss amplifies those differences into an optimisable signal.",
        "Bridge: everything from ml1 transfers unchanged - gradient descent, standardisation, overfitting signals. w.x + b still carries units, and training an unstandardised logistic regression is the most common cause of 'it just will not converge'."
      ],
      code: `import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

z = np.array([-9.0, -2.0, 0.0, 2.0, 9.0])
print("prob", np.round(sigmoid(z), 4))
# 导数在 0 附近最大、两端趋于 0：自信的错误恰好几乎没有梯度
print("deriv", np.round(sigmoid(z) * (1 - sigmoid(z)), 4))

y = np.array([1.0, 1.0, 1.0, 0.0, 0.0])
p = sigmoid(z)
# MSE 的梯度含 sigma 乘 (1-sigma) 因子，z 很大时几乎推不动参数
grad_mse = ((p - y) * p * (1 - p)) @ z
# 交叉熵把同一个因子约掉了：只剩 (p - y) 乘特征
grad_bce = (p - y) @ z
print("MSE grad", round(float(grad_mse), 3), "BCE grad", round(float(grad_bce), 3))`,
      pit: "把类别编号当连续量：用 1=猫、2=狗、3=鸟 做多分类，模型会以为「狗比猫大一点、鸟比狗大两倍」。编号只是身份标识，距离和顺序都没有意义；要么 one-hot 拆开，要么用交叉熵让输出层直接给类别分布。",
      pit_en: "Treating class codes as quantities: with 1=cat, 2=dog, 3=bird the model concludes a dog is slightly more cat than a bird and twice as much. Class numbers are identities, with no meaningful distance or order - either one-hot them or let a cross-entropy output head produce a distribution over classes.",
      ex: {
        q: "同样一个「判错得很离谱」的样本，为什么用 MSE 训练时它几乎不被修，用交叉熵时它优先被修？",
        a: "因为 MSE 的梯度带着 sigmoid 的导数因子，模型越自信（|z| 越大）这个因子越接近 0，惩罚最重的错误反而梯度最小；交叉熵约掉了这个因子，梯度大小就正比于 (p−y)，错得越狠推得越用力。",
        q_en: "For one badly wrong example, why does MSE training barely fix it while cross-entropy fixes it first?",
        a_en: "The MSE gradient carries the sigmoid derivative, so the more confident the model (larger |z|) the closer that factor is to zero - the worst error gets the smallest push. Cross-entropy cancels it, leaving a gradient proportional to (p - y), so the bigger the mistake the harder the correction."
      }
    },

    "ml2-2": {
      min: 13,
      summary: [
        "逻辑回归 = 线性打分 z = w·x + b 过一遍 sigmoid，输出正类概率 p = σ(z)。名字里带「回归」是历史遗留，它做的是分类；决策边界仍是 w·x+b=0 这一个超平面，所以线性不可分它天生做不了。",
        "二元交叉熵来自最大似然：让所有样本「被分到正确类别的概率」乘积最大，取对数变连加、再取负就是损失。它和「最小化 MSE」结构上完全平行，只是噪声假设从伯努利换成了高斯。",
        "二分类与多分类的交叉熵是同一件事：多分类用 softmax 把 k 个分数变成和为 1 的分布，损失只惩罚真实类那一项——这套写法会一路用到 dl 章，现在把它认熟。",
        "它的梯度干净得可疑：∂L/∂w = 平均 (p − y)·x，和线性回归 MSE 的梯度只差一个 sigmoid。所以你在 ml1-3 手写的梯度下降代码几乎不用改就能训练分类器，这也是本章最该动手验证的一件事。",
        "「越错越罚」的具体尺度：一个被判定 0.99 是正常邮件的诈骗样本贡献 −log(0.01)≈4.6 的损失，而判 0.6 的只贡献 0.51；这解释了为什么逻辑回归优先消灭「自信的错误」，其次才改善「本来就差不多」的边界样本。",
        "概率不是白送的：交叉熵在数据充足、模型不过度受约束时大致校准；但强正则、类别极不平衡、以及深度网络都会让「预测 0.9 的那批里实际只有 0.7 是正的」。要拿概率去分风险等级，就得单独检查校准（ml2-4）。",
        "逻辑回归仍是强基线：几秒训练完、系数能读、线上稳定、几乎不会因超参调歪而崩盘。任何「复杂模型更准」的结论，都应该先跟它比过再宣布——跳过基线的提升常常只是没写对流程。",
        "实操坑：sklearn 的 LogisticRegression 默认带 L2 正则且 C=1.0（C 越小正则越强，方向与直觉相反），不缩放特征或不加 max_iter 常收到 ConvergenceWarning；把它当「无正则的教科书逻辑回归」用，会莫名其妙掉分数。"
      ],
      summary_en: [
        "Logistic regression is a linear score z = w.x + b pushed through sigmoid, giving p = sigma(z). The name is historical - it classifies - and the decision boundary is still the single hyperplane w.x + b = 0, so anything not linearly separable is out of reach by construction.",
        "Binary cross-entropy comes from maximum likelihood: maximise the product of probabilities assigned to the true class, take the log to turn it into a sum and negate it. It is structurally the twin of 'minimise MSE', only with a Bernoulli noise assumption instead of a Gaussian one.",
        "Binary and multiclass cross-entropy are the same idea: softmax turns k scores into a distribution summing to 1 and the loss penalises only the true-class term. You will meet this exact shape all the way through the dl chapters, so learn it now.",
        "The gradient is suspiciously clean: dL/dw is the mean of (p - y) times x, differing from linear regression's MSE gradient only by the sigmoid. Which is why your hand-written descent from ml1-3 trains a classifier with almost no edits - worth verifying yourself.",
        "The scale of 'punish mistakes harder': a fraud email judged 0.99 ham contributes -log(0.01) of about 4.6 while a 0.6 judgement contributes 0.51. Logistic regression therefore erases confident wrongness first and only then tidies borderline cases.",
        "Probability does not come free. Under ample data and a lightly constrained model, cross-entropy is roughly calibrated; heavy regularisation, extreme class imbalance and deep networks all produce 'the 0.9 bucket is really 0.7 positive'. If probabilities drive risk tiers, check calibration separately (ml2-4).",
        "Logistic regression stays the strong baseline: seconds to train, readable coefficients, boring to serve, and almost impossible to break by bad hyper-parameters. Any claim that a fancier model is better should first survive comparison against it - a skipped baseline often just means the protocol was wrong.",
        "Practical trap: sklearn's LogisticRegression ships with L2 regularisation and C=1.0 (smaller C means stronger penalty, the opposite of intuition), and without feature scaling or a raised max_iter you get ConvergenceWarning; using it as the textbook unpenalised model quietly costs you accuracy."
      ],
      code: `import numpy as np
# 固定种子，保证两次跑出来的系数可以对照
rng = np.random.default_rng(3)
X = rng.normal(0, 1, (600, 2))
y = (X[:, 0] + 0.6 * X[:, 1] > 0.3).astype(float)
Xtr, ytr = X[:450], y[:450]

# 手写一遍：梯度就是 (p 减 y) 乘特征，和线性回归只差一个 sigmoid
w = np.zeros(3)
for _ in range(3000):
    z = Xtr @ w[1:] + w[0]
    p = 1.0 / (1.0 + np.exp(-z))
    w[0] -= 0.3 * (p - ytr).mean()
    w[1:] -= 0.3 * ((p - ytr) @ Xtr) / len(ytr)

def bce(p, t):
    # 概率要先夹住，否则 log(0) 变成 inf，一个自信的错误就能毁掉整次训练
    t2 = np.clip(p, 1e-12, 1 - 1e-12)
    return -np.mean(t * np.log(t2) + (1 - t) * np.log(1 - t2))

z = X @ w[1:] + w[0]
print("hand coefs", np.round(w, 3), "test BCE", round(bce(1 / (1 + np.exp(-z[450:])), y[450:]), 4))

from sklearn.linear_model import LogisticRegression
m = LogisticRegression(penalty=None, max_iter=2000).fit(Xtr, ytr)
print("sklearn coefs", np.round(np.r_[m.intercept_, m.coef_[0]], 3))`,
      pit: "忘了 sklearn 的 `penalty`/`C` 与「必须标准化」这两件事：默认 L2 加未缩放的特征，训练既不稳又偷偷把有用系数压小，你以为「逻辑回归不行」，其实根本没跑到它的正常配置。真要教科书式的无正则模型，写 `penalty=None`（或 `C=1e6`）并先把特征标准化。",
      pit_en: "Ignoring sklearn's penalty/C defaults and the scaling requirement: L2 on unstandardised features both trains unstably and quietly shrinks the coefficients that matter, so you conclude 'logistic regression is weak' when you never ran its normal configuration. For the textbook unpenalised model use penalty=None (or C=1e6) and standardise first.",
      ex: {
        q: "为什么多分类不直接跑 k 个二分类逻辑回归，而要用 softmax？",
        a: "k 个独立二分类的 sigmoid 输出加起来不必然等于 1，既不能当分布也不能直接比较「到底属于哪一类」；softmax 让 k 个分数互相竞争后归一，配合交叉熵才有干净的 (p − y) 梯度，且天然支持「都不像」时的置信度解读。",
        q_en: "Why not run k binary logistic regressions instead of one softmax head for multiclass?",
        a_en: "k independent sigmoids need not sum to 1, so they are not a distribution and give no clean answer to 'which class after all'; softmax makes the k scores compete before normalising, which yields the same tidy (p - y) gradient with cross-entropy and an interpretable confidence when nothing fits."
      }
    },

    "ml2-3": {
      min: 13,
      summary: [
        "混淆矩阵的四个格子 TP/FP/FN/TN 是所有分类指标唯一的出处；任何「该看哪个指标」的争论，本质都是「哪个格子最贵」的争论，不谈代价选指标都是空谈。",
        "准确率=判对比例，它隐含两个假设：两类代价相同、两类比例差不多。正类只占 1% 时「全判负」就有 99%，所以准确率必须永远和「多数类基线」并排写，单独出现的准确率不构成结论。",
        "精确率管「我报警时准不准」（FP 贵：误封账号、误诊健康人），召回率管「该报的我报了没」（FN 贵：漏诊病人、放过诈骗）。它俩被同一个阈值天然互拉，任何一边往上推，另一边一定下来。",
        "F1 是调和平均不是算术平均，这是刻意的：调和平均对小的那一项极敏感。召回 0.01、精确率 0.99 时算术平均 0.5 看着还能接受，F1 只有 0.02——它专门用来惩罚偏科。",
        "阈值是决策变量而不是模型变量：模型负责给出排序，业务负责给出代价。「漏一个的代价远大于误伤一个」就降阈值保召回，「误伤代价高」就提阈值保精确率；把阈值当超参在验证集上调，而不是照抄 0.5。",
        "业务成本可以写成一行算出来：期望损失 = FN 数 × 漏一个的代价 + FP 数 × 误一个的代价。调阈值就是在最小化这个式子，而不是最大化 F1；F1 只是「两类代价恰好相同」时的一个代理。",
        "类别不平衡的三层解法要按顺序试：先换指标（最便宜，也最常解决 80% 的错觉）、再把不平衡写进损失（class_weight / 代价敏感）、最后才考虑重采样。顺序反过来的典型后果是：你用 SMOTE 修好了 PR 曲线，却仍然在业务上线上亏钱。",
        "重采样有红线：过采样只能发生在交叉验证每一折内部、只作用于训练部分；在整份数据上先做再切分，复制出来的样本会同时出现在训练和验证里，分数漂亮得离谱（ml3-1 正面讲这种泄漏）。"
      ],
      summary_en: [
        "The four cells of the confusion matrix - TP, FP, FN, TN - are the only source any classification metric has. Every argument about 'which metric to watch' is really an argument about which cell is most expensive; choosing a metric without costing it is empty.",
        "Accuracy is the share of correct calls and smuggles in two assumptions: equal error costs and roughly equal class sizes. With a 1% positive class, predicting 'negative' for everything scores 99%, so accuracy must always be printed next to the majority-class baseline; on its own it is not a conclusion.",
        "Precision asks 'when I raise the alarm, am I right' (FP is expensive: wrongly frozen accounts, healthy people diagnosed sick); recall asks 'of what I should catch, how much did I catch' (FN is expensive: missed diagnoses, fraud let through). One threshold pushes them in opposite directions, necessarily.",
        "F1 is the harmonic mean, deliberately: it is dominated by the smaller term. Recall 0.01 with precision 0.99 averages 0.5 arithmetically, which looks survivable, but F1 is 0.02 - it exists to punish lopsidedness.",
        "The threshold is a decision variable, not a model variable: the model supplies a ranking, the business supplies the costs. If misses cost far more than false alarms, lower the threshold to protect recall; if false alarms hurt, raise it. Tune it on validation data instead of inheriting 0.5.",
        "Business cost collapses to one line: expected loss = FN count times the price of a miss plus FP count times the price of a false alarm. Threshold tuning minimises that expression, not F1 - F1 is only a stand-in for the case where the two costs happen to be equal.",
        "Attack imbalance in cost order: first change the metric (cheapest, and it dispels most illusions), then write the imbalance into the loss (class_weight, cost-sensitive), and only then consider resampling. Reverse the order and you fix the PR curve with SMOTE while still losing money in production.",
        "Resampling has one red line: it may happen only inside each cross-validation fold, on the training part. Oversample the whole dataset before splitting and your copies appear on both sides of the boundary, producing scores too beautiful to question (ml3-1 handles that leakage directly)."
      ],
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score
from sklearn.model_selection import train_test_split

# 故意做成 1% 正类：准确率在这里就是用来骗人的
X, y = make_classification(n_samples=6000, n_features=8, weights=[0.99, 0.01], random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, stratify=y, random_state=0)
m = LogisticRegression(max_iter=2000).fit(Xtr, ytr)
p = m.predict_proba(Xte)[:, 1]

print("all-negative accuracy", round(accuracy_score(yte, np.zeros_like(yte)), 4))
print("model acc / prec / rec", round(accuracy_score(yte, m.predict(Xte)), 4),
      round(precision_score(yte, m.predict(Xte), zero_division=0), 4),
      round(recall_score(yte, m.predict(Xte)), 4))

# 阈值是决策变量：同一批分数，不同阈值就是不同生意
for th in (0.5, 0.2, 0.05):
    tn, fp, fn, tp = confusion_matrix(yte, p >= th).ravel()
    cost = fn * 100 + fp * 1
    print(th, "prec", round(tp / max(tp + fp, 1), 3), "rec", round(tp / (tp + fn), 3), "cost", cost)`,
      pit: "拿「F1 更高」直接选模型上线，没看它对应的阈值和混淆矩阵：F1 0.92 的那个模型可能靠把阈值压到 0.02、以海量误报换来高召回；换成真实业务里每单误检都要人工复核，成本立刻失控。指标必须连带阈值、类别比例和代价一起报，否则别人无法复核你的取舍。",
      pit_en: "Picking the model with the higher F1 and shipping it without looking at the threshold or the matrix: an F1 of 0.92 may come from dropping the threshold to 0.02 and buying recall with an avalanche of false alarms - the moment a human reviews each flag in production, cost explodes. Report the metric together with its threshold, class ratio and costs, or nobody can audit your trade-off.",
      ex: {
        q: "为什么 F1 用调和平均而不是算术平均？",
        a: "因为算术平均允许「一边极好一边极差」蒙混过关，而偏科恰恰是分类器最危险的失效方式；调和平均由小的那一项主导，召回塌到 0.01 时整体立刻塌，能第一时间把这种模型拦下来。",
        q_en: "Why is F1 a harmonic mean rather than an arithmetic one?",
        a_en: "An arithmetic mean lets 'brilliant on one side, terrible on the other' pass, and lopsidedness is exactly how classifiers fail dangerously; the harmonic mean is dominated by the smaller term, so a recall of 0.01 drags the whole score down and stops such a model immediately."
      }
    },

    "ml2-4": {
      min: 12,
      summary: [
        "ROC 的每个点是一个阈值：横轴 FPR = FP/(FP+TN)，纵轴 TPR = 召回率；曲线的含义是「把阈值从 1 滑到 0 时，我多抓了多少坏人 vs 误伤了多少好人」。",
        "AUC 的正确解读是：随机抽一个正例和一个负例，模型给正例打出更高分的概率。它衡量的是排序能力，与阈值无关——这是它「稳」的原因，也是它「不够用」的原因：你的业务永远只能用一个阈值。",
        "AUC 对不平衡不敏感有明确机制：FPR 的分母是庞大的负类，负类再多一倍，FPR 几乎不动。正类占 1% 时 AUC 0.95 也可能意味着「召回 0.6 时精确率只有 0.05」，所以极度不平衡要改看 PR-AUC。",
        "基线要记牢：AUC 0.5 等于随机（注意「全判正/全判负」的 ROC 点落在对角线上，AUC 也是 0.5，不是 0）；表格数据里 AUC 高到 0.97 以上时，第一反应应该是查泄漏（ml3-1），而不是庆祝。",
        "因为 AUC 只吃排序，它对概率的绝对值完全免疫：把概率做任意单调变换，AUC 一分不变。所以「AUC 很高」绝不等于「p=0.8 的样本真的有 80% 是正的」——这是最容易从 AUC 得出错误结论的地方。",
        "概率校准怎么看：可靠性图把预测分 10 桶，横轴是每桶平均预测概率、纵轴是该桶实际正类频率，理想是对角线；系统性偏离时用 Platt scaling 或 isotonic 回归在一份独立校准集上二次修正。",
        "什么时候还需要别的：只关心某个阈值下的表现时，直接看那一点的精确率/召回率和混淆矩阵更诚实；想在「不平衡 + 代价不对称」上更稳，可看 PR-AUC、MCC 或干脆把期望损失当指标——AUC 不是万能分。",
        "衔接：ROC 与 AUC 都是「同一份评估集」上的比较工具，换数据就换结论；ml3 讨论怎样构造这份评估集才不会被自己骗。"
      ],
      summary_en: [
        "Each ROC point is one threshold: FPR = FP/(FP+TN) on the x axis, TPR = recall on the y axis. The curve literally reads 'as the threshold slides from 1 to 0, how many more positives did I catch versus how many negatives did I hit'.",
        "The correct reading of AUC is: pick one random positive and one random negative - AUC is the probability the model scores the positive higher. It measures ranking quality, independent of threshold; that is why it is robust and also why it is insufficient, because production always runs at a single threshold.",
        "AUC's insensitivity to imbalance has a mechanism: FPR is divided by the huge negative count, so doubling the negatives barely moves it. With a 1% positive class an AUC of 0.95 can still mean precision of 0.05 at recall 0.6, so extreme imbalance means looking at PR-AUC instead.",
        "Fix the baselines: AUC 0.5 is random (note that 'all positive' and 'all negative' also sit on the diagonal at 0.5, not 0); on tabular data an AUC above 0.97 should trigger a leakage hunt (ml3-1) before it triggers a celebration.",
        "Because AUC only consumes ranking, it is completely immune to probability magnitude: any monotone transform leaves AUC untouched. So a high AUC never says 'the p = 0.8 bucket is really 80% positive' - this is where AUC most easily produces a wrong conclusion.",
        "How to check calibration: a reliability diagram buckets predictions into 10 groups and plots mean predicted probability against observed positive rate, the ideal being the diagonal; when it bends systematically, refit with Platt scaling or isotonic regression on a separate calibration set.",
        "What to use when: if one threshold is all you ship, that point's precision, recall and confusion matrix are more honest; under imbalance with asymmetric costs prefer PR-AUC, MCC or expected loss outright - AUC is not a universal score.",
        "Bridge: ROC and AUC compare things computed on the same evaluation set, so new data means new conclusions; ml3 asks how to build an evaluation set that does not deceive you."
      ],
      code: `import numpy as np
from sklearn.calibration import calibration_curve
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=6000, n_features=10, weights=[0.99, 0.01], random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, stratify=y, random_state=0)
m = LogisticRegression(max_iter=2000).fit(Xtr, ytr)
p = m.predict_proba(Xte)[:, 1]

# AUC 只吃排序：乘以 3 是单调变换，所以它一分不变
print("AUC", round(roc_auc_score(yte, p), 4), round(roc_auc_score(yte, 3 * p), 4))
# 但精确率会跟着变，所以「AUC 很高」不等于「阈值下能用」
print("PR-AUC", round(average_precision_score(yte, p), 4))

# 校准曲线：分桶比较「预测概率」和「实际正类频率」，理想是对角线
frac, mean = calibration_curve(yte, p, n_bins=5, strategy="quantile")
for a, b in zip(mean, frac):
    print("predicted", round(a, 3), "observed", round(b, 3))`,
      pit: "把「AUC 0.95」当成「模型很准」并据此上线风控分层：AUC 与概率绝对值无关，分层卡的恰恰是绝对概率。一个 AUC 很高但预测集中在 0.02~0.05 的模型，「分数>0.5」这条规则可能一条都拦不住——先查可靠性图，再谈阈值。",
      pit_en: "Reading 'AUC 0.95' as 'very accurate' and building risk tiers on it: AUC ignores probability magnitude while tiers cut on absolute probability. A model with great AUC whose scores live between 0.02 and 0.05 will stop nobody with a rule like 'score above 0.5' - check the reliability diagram before discussing thresholds.",
      ex: {
        q: "为什么正类极少时，ROC-AUC 会让人过度乐观，而 PR-AUC 不会？",
        a: "因为 ROC 的横轴除以负类总数，负类基数巨大时 FP 涨一大截 FPR 也只动一点点，曲线照样贴着左上角；PR 的分母是预测为正的样本数，误报一多精确率立刻掉，所以它把「大量误伤」如实反映出来。",
        q_en: "Why is ROC-AUC over-optimistic when positives are rare but PR-AUC is not?",
        a_en: "ROC's x axis divides by the number of negatives, so with a huge negative population a flood of false alarms barely moves FPR and the curve still hugs the corner; precision divides by how many you flagged, so false alarms cut it immediately and the PR curve reports the collateral damage honestly."
      }
    },

    "ml2-5": {
      min: 11,
      summary: [
        "不平衡不是「数据坏了」，而是先验被极端放大：模型学的是条件概率，你为了训练把比例改平衡，其实等于篡改了先验，之后每个分数都要按真实比例重新解读，否则结论直接反号。",
        "划分必须分层（stratify）：正类 1% 时随机切可能让测试集一个正样本都没有，或恰好全是最难的样本，指标抖到不可比；train_test_split 与 KFold 都要传 stratify=y（ml3-2 把这件事推广到 StratifiedKFold）。",
        "评估集保持真实分布：把测试集也做成 1:1，精确率会变成另一个完全不相关的数（精确率强烈依赖先验）；只有训练侧可以重采样，评估侧永远不许动。",
        "先验被改动后要做校正：把 logit 加上 log(真实先验几率 / 训练先验几率)，就能把「平衡训练」学到的概率调回真实分布。这一步最容易被漏，因为模型看起来一切正常、只是概率整体偏高。",
        "class_weight / 代价敏感比重采样更该先试：它只改损失里的权重，不制造重复样本、不让模型反复看同几条数据；只有当正类少到梯度信号稀薄时，合成新样本才有意义。",
        "过采样不能凭空造信息：SMOTE 是在正类样本之间插值，正类只有 20 条时它只让模型在同一小片区域里绕圈——召回上去了、精确率塌下来，而且对噪声与离群正类异常敏感（一个录错的正类会被复制成一片）。",
        "别忘了任务可以重构：在正类极稀的场景，把「判与不判」改成「按分数排序，人工只看 top 1%」常常比继续调阈值更有价值；评估指标也随之从准确率换成 top-k 命中率。",
        "衔接：本章所有「验证集」「分层」「重采样泄漏」都指向同一个主题——评估流程本身；ml3 把它从注意事项升级为硬约束（pipeline 与交叉验证的折设计）。"
      ],
      summary_en: [
        "Imbalance is not broken data, it is an extreme prior: models learn conditional probabilities, so balancing them for training rewrites the prior, and every later score must be re-read against the real ratio or the conclusion flips sign.",
        "Splits must be stratified: with a 1% positive class a random cut can leave the test set with no positives at all, or only the hardest ones, and the metric jitters beyond comparison - pass stratify=y to train_test_split and to KFold (ml3-2 generalises this to StratifiedKFold).",
        "The evaluation set keeps the real distribution: balance the test set to 1:1 and precision becomes a different, irrelevant number (precision depends heavily on the prior). Resample the training side only; never the evaluation side.",
        "After changing the prior, correct it: subtract log(prior_train / prior_real) from the logit to pull probabilities learned under balanced training back to the real distribution. This step gets missed most often because the model looks perfectly healthy apart from being uniformly over-confident.",
        "class_weight and cost-sensitive losses come before resampling: they only reweight the loss, creating no duplicates and no repeated views of the same rows. Synthetic examples earn their place only when positives are so rare the gradient signal dries up.",
        "Oversampling cannot invent information: SMOTE interpolates between positives, so with 20 positives the model just circles one small region - recall rises, precision collapses, and noise is amplified (one mislabelled positive becomes a neighbourhood).",
        "Sometimes the honest fix is reframing the task: with very rare positives, replacing 'decide yes/no' with 'rank and review the top 1% by hand' usually beats further threshold tuning, and the metric becomes hit-rate at k rather than accuracy.",
        "Bridge: every 'validation set', 'stratify' and 'resampling leak' in this chapter points at one subject - the evaluation procedure itself, which ml3 upgrades from advice to hard constraint via pipelines and fold design."
      ],
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score

X, y = make_classification(n_samples=3000, n_features=10, weights=[0.97, 0.03], random_state=0)

# 错：在全量数据上做平衡，再拿它去做交叉验证
keep = np.r_[np.where(y == 1)[0], np.where(y == 0)[0][:3 * (y == 1).sum()]]
Xb, yb = X[keep], y[keep]
# 复制品同时出现在训练折与验证折里，分数会虚高
print("resample then split", round(cross_val_score(LogisticRegression(max_iter=2000), Xb, yb, cv=3).mean(), 4))

# 对：数据保持原样，只分层划分，把不平衡写进损失
clean = LogisticRegression(class_weight="balanced", max_iter=2000)
cv = StratifiedKFold(5, shuffle=True, random_state=0)
print("class_weight with a clean split", round(cross_val_score(clean, X, y, cv=cv, scoring="recall").mean(), 4))

# 概率调回真实先验：把「真实比 vs 训练比」的对数差加在 logit 上
m = clean.fit(X, y)
pz = m.predict_proba(X)[:, 1]
logit = np.log(pz / (1 - pz))
odds_real = y.mean() / (1 - y.mean())
shift = np.log(odds_real / (0.5 / 0.5))
print("before", round(pz.mean(), 4),
      "after", round(1 / (1 + np.exp(-(logit + shift))), 4))`,
      pit: "为了让模型「看起来更平衡」把测试集也下采样成 1:1，然后拿这个测试集上的精确率去汇报：精确率的分母是预测为正的样本数，比例一改它就变了，于是你得到一个人造的好数字，上线遇到真实 3% 正类时误报量直接爆表。评估集必须保持真实分布。",
      pit_en: "Down-sampling the test set to 1:1 so things look balanced, then quoting that precision: precision's denominator is how many you flagged, so changing the ratio changes the number, and shipping into the real 3% positive world blows the alert volume up. The evaluation set must keep the true distribution.",
      ex: {
        q: "同样是不平衡数据，为什么 class_weight 通常比重采样更安全？",
        a: "因为 class_weight 只改变损失里各项的权重，样本本身没有被复制，模型看见的信息量不变，也就不会在验证时遇到自己的复制品；重采样制造重复或合成样本，一不小心就跨越了划分边界造成泄漏。",
        q_en: "For the same imbalanced data, why is class_weight usually safer than resampling?",
        a_en: "class_weight only reweights terms in the loss: no row is copied, the model sees the same amount of information, and validation never meets a clone of a training row. Resampling duplicates or synthesises rows, which easily crosses the split boundary and leaks."
      }
    },

    "ml2-6": {
      title: "综合重构：一次别人无法反驳的分类评估",
      title_en: "Synthesis: A Classification Evaluation Nobody Can Argue With",
      min: 15,
      target: "能按固定七步流程交付一份分类结论（含基线、阈值、混淆矩阵与校准检查），并逐项说明「如果跳过这一步，我会得出什么错误结论」。",
      target_en: "Deliver a classification conclusion through seven fixed steps (baseline, threshold, confusion matrix, calibration check) and explain, step by step, which wrong conclusion skipping it would have produced.",
      summary: [
        "七步流程背下来：明确「正类是什么、两类各错一次多少钱」→ 分层划分 → 立两条基线（全判多数类、随机排序 AUC=0.5）→ 用交叉熵训练 → 在验证集上扫阈值 → 报告「阈值 + 混淆矩阵 + PR/ROC」→ 最后才用测试集验收。跳任何一步，就有一条结论站不住。",
        "「我是不是得出了错误结论」自查表：只报准确率（不平衡）/ 只报 AUC（业务其实只用一个阈值）/ 阈值固定 0.5（没读过代价）/ 概率没校准却拿去分风险等级 / 在全量数据上重采样或缩放（泄漏）/ 用训练分数当效果（过拟合）。",
        "三个必做对照：和多数类基线比、和随机排序比、和「去掉某个特征后」比。绝对分数几乎没有含义，差值才有——这也是为什么 ml4 之后所有模型比较都必须钉死同一套评估协议。",
        "模型侧的取舍记忆：逻辑回归快、可读、稳，是永远该先跑的基线；线性不可分时先问是不是漏了交互或比值特征（特征工程，ml3），再考虑树模型（ml4），最后才轮到网络（dl）。",
        "动手收口：把逻辑回归的损失换成 MSE 跑一次，看它在不平衡数据上几乎不收敛；再换回交叉熵——这个对照比任何解释都更能让你记住「为什么是交叉熵」，也是面试里最有力的一句话。",
        "交付模板（建议直接抄）：数据规模与正类比例、划分方式、指标连同基线、选定阈值与该阈值下的混淆矩阵、以及一句话「这个模型最可能在什么情况下失效」。最后一句最常被省，却最值钱。",
        "衔接 ml3：本章反复动用的「验证集、分层、重采样时机」，在 ml3 变成主题本身——训练/验证/测试的划分次序、交叉验证的折设计，以及用 pipeline 把泄漏从「要注意」变成「做不到」。"
      ],
      summary_en: [
        "Memorise the seven steps: state what the positive class is and what each type of mistake costs, split stratified, raise two baselines (always-majority and random ranking at AUC 0.5), train with cross-entropy, sweep the threshold on validation, report threshold plus confusion matrix plus PR/ROC, and only then open the test set. Skip any step and one conclusion becomes unsupported.",
        "Wrong-conclusion checklist: quoting only accuracy under imbalance; quoting only AUC when production uses one threshold; keeping the default 0.5 without reading the costs; cutting risk tiers on uncalibrated probabilities; resampling or scaling on the full data before splitting; treating a training score as the result.",
        "Three mandatory comparisons: against the majority baseline, against random ranking, and against 'what happens if I drop this feature'. An absolute score means almost nothing; differences do - which is why every model comparison from ml4 onward must pin the evaluation protocol down.",
        "Model-side memory: logistic regression is fast, readable and stable, so it is always the first baseline. When the data is not linearly separable, ask first whether an interaction or ratio feature is missing (ml3), then consider trees (ml4), and only then reach for a network (dl).",
        "Hands-on closing: run logistic regression once with MSE instead of cross-entropy and watch it barely move on imbalanced data, then switch back. That contrast burns in 'why cross-entropy' better than any explanation, and it is the strongest sentence you can say in an interview.",
        "Delivery template, worth copying: dataset size and positive rate, split method, metrics beside baselines, the chosen threshold with its confusion matrix, and one sentence on 'how this model most plausibly fails in production'. The last sentence is the one people omit and the one worth most.",
        "Bridge to ml3: the validation set, stratification and resampling timing this chapter kept borrowing become the subject itself in ml3 - the order of splits, fold design for cross-validation, and using a pipeline to turn leakage from 'be careful' into 'impossible'."
      ],
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=6000, n_features=10, weights=[0.98, 0.02], random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, stratify=y, random_state=0)
prob = LogisticRegression(max_iter=2000).fit(Xtr, ytr).predict_proba(Xte)[:, 1]

# 基线先立起来：多数类准确率与随机 PR-AUC，没有它们后面的数字都没得比
print("majority baseline", round(1 - yte.mean(), 4), "random PR-AUC", round(yte.mean(), 4))
print("model PR-AUC", round(average_precision_score(yte, prob), 4), "AUC", round(roc_auc_score(yte, prob), 4))

def expected_loss(fp, fn, c_miss=100.0, c_false=1.0):
    # 期望损失只有一行：漏一个的代价乘以 FN，加误伤一个的代价乘以 FP
    return fp * c_false + fn * c_miss

# 在同一份验证集上扫阈值，挑期望代价最低的，而不是挑 F1 最高的
for th in (0.5, 0.3, 0.15, 0.05):
    tn, fp, fn, tp = confusion_matrix(yte, prob >= th, labels=[0, 1]).ravel()
    f1 = 2 * tp / max(2 * tp + fp + fn, 1)
    print("threshold", th, "F1", round(f1, 3), "cost", round(expected_loss(fp, fn), 1))`,
      pit: "评估做完只留一个数字（「AUC 0.93」）就交给业务方：对方默认理解为「93% 的诈骗会被抓到」，而 AUC 是排序概率、跟召回毫无关系。错误结论往往不是算错，而是别人替你把你算对的数字解读错了——所以交付时必须写清指标含义与阈值。",
      pit_en: "Handing the business side a bare 'AUC 0.93': they hear 'we catch 93% of fraud', while AUC is a ranking probability with no connection to recall. Wrong conclusions usually come not from a miscalculation but from someone else interpreting a correct number wrongly - so deliver the metric with its meaning and its threshold attached.",
      ex: {
        q: "七步流程里，哪一步最常被省掉、省掉后代价最大？",
        a: "「立基线」最常被省。没有多数类准确率和随机排序这两个参照，任何分数都能被解释成成功，团队会带着一个其实等于「全判负」的模型上线；代价大在于这种错误不会在任何内部指标上暴露。",
        q_en: "Which of the seven steps gets skipped most, with the biggest cost?",
        a_en: "Raising the baselines. Without the majority-class score and random ranking as references, any number can be spun as success, and a model that is really 'predict negative for everything' ships - and no internal metric will ever reveal it."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择/判断/填空混排） ---------- */
  quizAdd: {
    ml1: [
      {
        q: "关于损失函数、优化器与学习率三者的关系，下列说法正确的是？",
        o: ["换优化器就等于换损失函数，两者可以互相替代", "损失定义「什么叫好」，优化器与学习率定义「怎么走到那里」，三者不可互相替代", "学习率只影响速度，不影响最终能不能收敛", "只要模型容量够大，损失函数选什么都不影响结论"],
        a: 1,
        why: "损失决定优化目标与梯度形状，优化器决定走路方式，学习率决定步长。Adam 能压平尺度差异，但不能替你选对损失或做特征标准化。",
        q_en: "Which statement about loss, optimiser and learning rate is correct?",
        o_en: ["Changing the optimiser changes the loss, so the two are interchangeable", "The loss defines what counts as good; optimiser and learning rate define how you walk there - none replaces another", "The learning rate only affects speed, never whether you converge", "With enough model capacity the choice of loss is irrelevant"],
        why_en: "The loss sets the objective and the gradient's shape, the optimiser sets the gait, the rate sets the step length. Adam can flatten scale differences but cannot pick your loss or standardise your features for you."
      },
      {
        q: "收入（十万量级）和年龄（十位量级）一起喂给手写梯度下降，最可能出现的现象是？",
        o: ["两个参数的梯度一样大，只是收敛慢一点", "收入那一列拿到过大步长、年龄那一列几乎不动，同一学习率两头都不合适", "算法会自动忽略量纲大的特征", "只要加一层 sigmoid 就自然解决"],
        a: 1,
        why: "梯度里带着该特征自己那一列，尺度大的列天然拿到更大步长；这正是梯度类模型必须先做特征标准化的原因，动量和 Adam 只是缓解而非替代。",
        q_en: "Feeding income (order 1e5) and age (order 1e1) into hand-written gradient descent most likely causes?",
        o_en: ["Both gradients stay the same size, you are just a bit slower", "The income column takes oversized steps while age barely moves, so no single rate suits both", "The algorithm automatically ignores the wider-scaled feature", "Adding a sigmoid fixes it by itself"],
        why_en: "Each gradient carries its own feature column, so the large-scale side gets a larger step and no shared rate fits both - the reason gradient models standardise features, while momentum and Adam only mitigate."
      },
      {
        q: "判断：在线性回归里多加 20 列纯随机噪声特征，训练集 R² 不可能上升。",
        type: "judge", a: 1,
        why: "最小二乘总会从噪声里蹭到一点相关性，训练 R² 单调不降；这正是它只能当过程指标的原因——要看样本外 R²，或者用调整 R²、交叉验证来惩罚特征数。",
        q_en: "True or false: adding 20 columns of pure noise can never raise the training R-squared of a linear regression.",
        why_en: "False. Least squares always harvests some correlation from noise, so training R-squared never falls - exactly why it is a process metric; use out-of-sample R-squared, adjusted R-squared or cross-validation to penalise feature count."
      },
      {
        q: "最小化 MSE 等价于假设误差服从 ______ 分布下的最大似然估计。",
        type: "fill", ans: ["高斯", "正态", "gaussian", "normal"],
        why: "MSE 对应高斯噪声的最大似然；换成 MAE 等于假设拉普拉斯噪声。选损失本质是在选噪声分布，而不是在选「哪个数字更顺眼」。",
        q_en: "Minimising MSE is maximum likelihood under the assumption that the errors follow a ______ distribution.",
        why_en: "MSE is maximum likelihood with Gaussian noise; MAE corresponds to Laplace noise. Choosing a loss is choosing a noise model, not choosing a number you like."
      }
    ],
    ml2: [
      {
        q: "分类任务为什么不用「MSE + sigmoid」来训练？",
        o: ["因为 sigmoid 的值域不是 (0,1)", "因为 MSE 的梯度含 σ′(z) 因子，样本一自信一错就饱和，损失面出现大片平地推不动", "因为 sigmoid 不可导", "因为分类的标签不是数字"],
        a: 1,
        why: "σ′ 最大只有 0.25 且两端趋近 0，最自信的错误反而梯度最小；交叉熵把这个因子约掉，剩下 (p−y)·x，错得越狠推得越用力。",
        q_en: "Why not train a classifier with MSE plus sigmoid?",
        o_en: ["Because sigmoid's range is not (0,1)", "Because the MSE gradient carries a sigma'(z) factor: a confident mistake saturates it and the loss surface flattens", "Because sigmoid is not differentiable", "Because class labels are not numbers"],
        why_en: "sigma' peaks at 0.25 and tends to 0 at both ends, so the most confident error produces the weakest push; cross-entropy cancels that factor and leaves (p - y) * x, punishing big mistakes hardest."
      },
      {
        q: "正类只占 1% 的场景下，下列哪个汇报数字最能揭穿「准确率 99%」？",
        o: ["同一模型在训练集上的准确率", "把阈值固定为 0.5 后再算一次准确率", "多数类基线的准确率，以及该阈值下的召回率与混淆矩阵", "模型的收敛速度"],
        a: 2,
        why: "准确率要和「全判多数类」的基线并排看才有意义，再用召回率与混淆矩阵看它到底抓没抓到正类；训练分数、收敛速度都无法回答这个问题。",
        q_en: "With a 1% positive class, which reporting numbers best expose 'accuracy 99%'?",
        o_en: ["The model's training accuracy", "Accuracy again at a fixed 0.5 threshold", "The majority-class baseline plus recall and the confusion matrix at the operating threshold", "How fast the model converges"],
        why_en: "Accuracy only means something beside the majority baseline; recall and the confusion matrix then show whether it catches any positive at all. Training scores and convergence speed answer nothing."
      },
      {
        q: "判断：AUC = 0.95 说明把预测概率做任意单调变换后，模型在该阈值下的精确率一定也很高。",
        type: "judge", a: 1,
        why: "AUC 只反映排序，与概率绝对值无关，单调变换一分不变；精确率取决于你选的阈值与类别先验。正类 1% 时 AUC 0.95 也可能对应召回 0.6 时精确率只有 0.05。",
        q_en: "True or false: AUC = 0.95 implies that after any monotone transform of the probabilities, precision at the operating threshold must also be high.",
        why_en: "False. AUC measures ranking only and is invariant to monotone transforms; precision depends on your threshold and the class prior, so with a 1% positive class AUC 0.95 can still mean precision 0.05 at recall 0.6."
      },
      {
        q: "F1 是精确率与召回率的 ______ 平均（填一种平均方式）。",
        type: "fill", ans: ["调和", "harmonic", "调和平均"],
        why: "调和平均由较小的那一项主导，专门惩罚「一边极好一边极差」的偏科模型；算术平均会让召回 0.01、精确率 0.99 的模型看起来有 0.5 分。",
        q_en: "F1 is the ______ mean of precision and recall.",
        why_en: "The harmonic mean is dominated by the smaller term, which is exactly how it punishes lopsided models; the arithmetic mean would let recall 0.01 with precision 0.99 look like 0.5."
      }
    ]
  },

  /* ---------- 词典：机器学习入门段，分类沿用现有四类 ---------- */
  terms: [
    { term: "泛化", term_en: "Generalisation", cat: "基础概念",
      short: "模型在没见过的新数据上也判得准，才是真学会。",
      short_en: "Being right on data the model has never seen - that is what learning means.",
      detail: ["训练分数只是过程指标，看得见的部分拟合得再好也不构成证据。", "衡量泛化需要一份模型从未参与训练或调参的数据，这就是测试集存在的全部理由。"],
      detail_en: ["A training score is a process metric; fitting the visible part perfectly is not evidence.", "Measuring generalisation needs data that never took part in fitting or tuning - the entire reason a test set exists."],
      vs: "拟合是「会不会做见过的题」，泛化是「会不会做新题」。",
      vs_en: "Fitting is passing the questions you have seen; generalisation is passing new ones." },
    { term: "偏差与方差", term_en: "Bias and Variance", cat: "基础概念",
      short: "错误的两个来源：模型太简单，或模型太敏感。",
      short_en: "The two sources of error: a model too simple, or a model too twitchy.",
      detail: ["欠拟合是高偏差（连训练集都拟合不动），过拟合是高方差（换一批数据结果就变）。", "两者的药方相反，所以先诊断是哪一类，再决定加容量还是加约束。"],
      detail_en: ["Underfitting is high bias - it cannot even fit the training set; overfitting is high variance - a new sample changes the answer.", "The cures oppose each other, so diagnose which one you have before adding capacity or constraints."],
      vs: "偏差是「系统性看错」，方差是「每次看得都不一样」。",
      vs_en: "Bias is systematically wrong; variance is wrong differently each time." },
    { term: "梯度下降", term_en: "Gradient Descent", cat: "训练与数据",
      short: "沿损失下降最快的方向反复挪小步，逼近最优参数。",
      short_en: "Repeatedly stepping along the steepest descent of the loss toward good parameters.",
      detail: ["每一步的规模由学习率决定，方向由损失对参数的梯度决定。", "梯度带着各特征自己的尺度，所以特征标准化几乎是它的前置条件。"],
      detail_en: ["Step length comes from the learning rate, direction from the gradient of the loss.", "Gradients inherit each feature's scale, which is why standardising features is effectively a precondition."],
      vs: "梯度下降是迭代找最优，正规方程是解方程一步到位。",
      vs_en: "Gradient descent iterates to the optimum; the normal equation solves it in one shot." },
    { term: "学习率", term_en: "Learning Rate", cat: "训练与数据",
      short: "每次沿负梯度挪多大一步，通常是第一个要调的超参。",
      short_en: "How far each step along the negative gradient goes - usually the first hyper-parameter you tune.",
      detail: ["太大在山谷两侧来回跳甚至发散，太小则几万步还在原地。", "先用小值确认损失在降，再放大到「刚好不炸」并回退一档，是稳的找法。"],
      detail_en: ["Too high and you bounce across the valley or diverge; too low and you stay put for thousands of steps.", "Start small to confirm the loss falls, grow to 'just barely stable', then back off one notch."],
      vs: "学习率管步长，优化器管走路姿势，损失管目的地。",
      vs_en: "The rate sets step length, the optimiser the gait, the loss the destination." },
    { term: "特征标准化", term_en: "Feature Standardisation", cat: "训练与数据",
      short: "每列减均值除标准差，把不同量纲拉到同一尺度。",
      short_en: "Subtract the mean and divide by the std per column so units stop mattering.",
      detail: ["梯度类与距离类模型（线性、逻辑回归、kNN、SVM）不做它训练不稳或结果被大尺度特征垄断。", "缩放器只能在训练折上 fit，测试集只 transform，否则就是数据泄漏。"],
      detail_en: ["Gradient and distance models (linear and logistic regression, kNN, SVM) train unstably, or get dominated by wide features, without it.", "Fit the scaler on the training fold only and just transform the test set, otherwise it is leakage."],
      vs: "标准化改的是尺度，正则化惩罚的是系数大小。",
      vs_en: "Standardisation changes scale; regularisation penalises coefficient size." },
    { term: "交叉熵损失", term_en: "Cross-Entropy Loss", cat: "训练与数据",
      short: "对真实类别给出的概率取负对数，越自信越错惩罚越大。",
      short_en: "Negative log of the probability given to the true class - confident errors cost the most.",
      detail: ["它是伯努利/多项分布下最大似然的结果，二分类叫 BCE，多分类配 softmax。", "它约掉了 sigmoid 的饱和因子，所以梯度是干净的 (p − y)·x。"],
      detail_en: ["It is maximum likelihood under a Bernoulli or multinomial model: BCE for two classes, softmax for many.", "It cancels sigmoid's saturation factor, leaving the tidy gradient (p - y) * x."],
      vs: "MSE 假设误差是高斯的，交叉熵假设结果是类别概率。",
      vs_en: "MSE assumes Gaussian errors; cross-entropy assumes class probabilities." },
    { term: "精确率与召回率", term_en: "Precision and Recall", cat: "评测与安全",
      short: "报警时准不准，与该抓的抓住了没有。",
      short_en: "Whether your alarms are right, and whether you caught what mattered.",
      detail: ["精确率的分母是「你判为正的」，召回率的分母是「真的是正的」，两者由同一个阈值互拉。", "正类极少时准确率失真，这两个数连同混淆矩阵才说得清模型的失效方式。"],
      detail_en: ["Precision divides by what you flagged, recall by what was truly positive, and one threshold pulls them apart.", "When positives are rare, accuracy misleads; these two plus the confusion matrix show how the model actually fails."],
      vs: "F1 用一个数兼顾两边，代价是掩盖了偏科的方向。",
      vs_en: "F1 folds both into one number, at the cost of hiding which side gave way." },
    { term: "决策阈值", term_en: "Decision Threshold", cat: "评测与安全",
      short: "把概率变成动作的那条线，本质是业务决策而非模型参数。",
      short_en: "The line that turns a probability into an action - a business choice, not a model parameter.",
      detail: ["0.5 只对应「两类代价相同」这一个特例，业务里几乎从不成立。", "阈值应在验证集上按期望损失最小来选，并在报告里连同混淆矩阵一起写清。"],
      detail_en: ["0.5 is only correct when both error types cost the same, which production rarely is.", "Pick it on validation data by minimising expected loss, then report it alongside the confusion matrix."],
      vs: "模型给排序，阈值给决策；AUC 评价前者，精确率/召回率评价后者。",
      vs_en: "The model ranks, the threshold decides; AUC grades the first, precision and recall the second." },
    { term: "AUC", term_en: "AUC", cat: "评测与安全",
      short: "随机一正一负样本中正例分数更高的概率，衡量排序能力。",
      short_en: "The chance a random positive outscores a random negative - ranking quality.",
      detail: ["与阈值无关、对类别比例不敏感，因此正类极少时会显得过于乐观。", "对概率做单调变换 AUC 不变，所以它完全不能证明模型校准良好。"],
      detail_en: ["Threshold-free and insensitive to class ratio, which makes it look too kind when positives are rare.", "Invariant to monotone transforms of probability, so it can never certify calibration."],
      vs: "AUC 看排序好坏，PR-AUC 在不平衡下更贴近业务代价。",
      vs_en: "AUC reads ranking; PR-AUC tracks business cost better under imbalance." },
    { term: "概率校准", term_en: "Probability Calibration", cat: "评测与安全",
      short: "预测 0.8 的那批样本里，实际正类比例是否真的接近 0.8。",
      short_en: "Whether the bucket predicted at 0.8 really contains about 80% positives.",
      detail: ["强正则、类别不平衡、深度网络都会让概率系统性偏离真实频率。", "用可靠性图检查，必要时在校准集上做 Platt 或 isotonic 修正。"],
      detail_en: ["Heavy regularisation, imbalance and deep networks all push probabilities away from real frequencies.", "Inspect with a reliability diagram, then correct with Platt scaling or isotonic regression on a calibration set."],
      vs: "AUC 只管排序，校准管概率的绝对值对不对。",
      vs_en: "AUC judges ranking; calibration judges whether the numbers themselves are honest." }
  ],

  achievements: [
    { id: "ml_first_fit", icon: "📈", name: "第一条拟合线", name_en: "First Fitted Line",
      desc: "完成 ml1 · 机器学习概览与线性回归 全部课节", desc_en: "Finish every lesson of ml1 Machine Learning Basics & Linear Regression",
      check: ["ml1"] },
    { id: "clf_reporter", icon: "🎯", name: "分类报告官", name_en: "Classification Reporter",
      desc: "完成 ml2 · 逻辑回归与分类 全部课节", desc_en: "Finish every lesson of ml2 Logistic Regression & Classification",
      check: ["ml2"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "监督：每一行都有人替它判过对错，标签来自外部": "supervised: a human already judged each row, the label comes from outside",
    "无监督：只给 X，没有任何对错信号，只想知道数据里有几堆": "unsupervised: only X, no correctness signal at all, you just want to know how many groups exist",
    "自监督：标签由输入自己生成，所以它形式上无标注、用法上却是监督": "self-supervised: labels are manufactured from the input, so it looks unlabelled but trains like supervision",
    "补一列 1，把截距也放进解向量，正规方程才完整": "append a column of ones so the intercept joins the solution vector; the normal equation needs it",
    "共线性：第二列只是第一列的 7 倍，X'X 变成奇异矩阵": "collinearity: the second column is 7x the first, so X'X becomes singular",
    "报奇异就在这里：不是数值不稳，而是这两列根本没有独立信息": "the singularity error lives here: not numerical instability, the two columns carry no independent information",
    "Ridge 就是把单位矩阵加进去，立刻可逆；代价是系数被整体缩小": "Ridge adds a scaled identity, making it invertible at once - the price is shrunken coefficients",
    "先固定随机种子：不设它两次跑出不同分数，你会以为是自己改坏了代码": "fix the seed first: otherwise two runs differ and you blame your own edit",
    "两个特征尺度差五个数量级，这正是梯度下降最怕的输入": "the two features differ by five orders of magnitude - exactly what gradient descent fears",
    "每个特征的梯度都乘着自己那一列，尺度大的天然拿到更大的步长": "every feature's gradient is multiplied by its own column, so wide-scale features get bigger steps",
    "真关系是一条直线，只有一点点噪声；容量越大越容易把噪声当规律": "the true relation is a line with a little noise; more capacity turns noise into a 'pattern'",
    "只看训练分数会一路走高，于是你以为「越大越好」": "training score keeps climbing, so you start believing bigger is better",
    "同一容量下把系数压小（Ridge），验证分数就回来了": "shrink the coefficients at the same capacity (Ridge) and the validation score returns",
    "单特征也必须是二维 (n, 1)；一维会直接抛 Expected 2D array": "even one feature must be 2-D (n, 1); 1-D raises 'Expected 2D array'",
    "把 X 写成 X.reshape(-1, 1) 是最省事的补救": "X.reshape(-1, 1) is the quickest fix",
    "score 用的是默认指标 R 方，并且算在你传进去的那份数据上": "score applies the default metric (R-squared) on whatever data you pass in",
    "只有换了新数据，这个数才刚开始有一点意义": "only on unseen data does this number start to mean anything",
    "第一步永远是最朴素的基线：什么都不学，只预测训练集均值": "step one is always the dumbest baseline: learn nothing, predict the training mean",
    "固定种子造一份可复现的数据：4 个特征、噪声适中，才看得出梯度下降在收敛": "a fixed seed makes the data reproducible: 4 features with moderate noise, so convergence is actually visible",
    "然后才是本章的主角；两者并排写，绝对分数才开始有意义": "only then the chapter's protagonist; put them side by side and the numbers start meaning something",
    "手工复现一次梯度下降，验证你真的理解「训练」在算什么": "reproduce gradient descent by hand to check you really know what training computes",
    "导数在 0 附近最大、两端趋于 0：自信的错误恰好几乎没有梯度": "the derivative peaks near 0 and dies at both ends: confident errors get almost no gradient",
    "MSE 的梯度含 sigma 乘 (1-sigma) 因子，z 很大时几乎推不动参数": "the MSE gradient carries a sigma*(1-sigma) factor, so large z barely moves the parameters",
    "交叉熵把同一个因子约掉了：只剩 (p - y) 乘特征": "cross-entropy cancels that same factor, leaving only (p - y) times the feature",
    "固定种子，保证两次跑出来的系数可以对照": "fixed seed so the coefficients are comparable across runs",
    "手写一遍：梯度就是 (p 减 y) 乘特征，和线性回归只差一个 sigmoid": "by hand: the gradient is (p - y) times the features, differing from linear regression only by the sigmoid",
    "概率要先夹住，否则 log(0) 变成 inf，一个自信的错误就能毁掉整次训练": "clip the probability first; otherwise log(0) becomes inf and one confident mistake wrecks the run",
    "故意做成 1% 正类：准确率在这里就是用来骗人的": "built at 1% positives on purpose: accuracy is the trap here",
    "阈值是决策变量：同一批分数，不同阈值就是不同生意": "the threshold is a decision: same scores, different thresholds, different businesses",
    "AUC 只吃排序：乘以 3 是单调变换，所以它一分不变": "AUC only eats ranking: times 3 is monotone, so it cannot change",
    "但精确率会跟着变，所以「AUC 很高」不等于「阈值下能用」": "but precision does change, so a high AUC is not the same as usable at a threshold",
    "校准曲线：分桶比较「预测概率」和「实际正类频率」，理想是对角线": "reliability curve: bucket predictions and compare predicted probability with observed positive rate; the diagonal is ideal",
    "错：在全量数据上做平衡，再拿它去做交叉验证": "wrong: balance the whole dataset first, then cross-validate on it",
    "复制品同时出现在训练折与验证折里，分数会虚高": "clones land in both the training and validation folds, so the score inflates",
    "对：数据保持原样，只分层划分，把不平衡写进损失": "right: keep the data, split stratified, write the imbalance into the loss",
    "概率调回真实先验：把「真实比 vs 训练比」的对数差加在 logit 上": "pull probabilities back to the real prior: add the log odds-ratio of real vs training prior to the logit",
    "基线先立起来：多数类准确率与随机 PR-AUC，没有它们后面的数字都没得比": "raise the baselines first: majority accuracy and random PR-AUC, otherwise nothing is comparable",
    "在同一份验证集上扫阈值，挑期望代价最低的，而不是挑 F1 最高的": "sweep thresholds on the validation set and take the lowest expected loss, not the highest F1",
    "期望损失只有一行：漏一个的代价乘以 FN，加误伤一个的代价乘以 FP": "expected loss is one line: miss cost times FN plus false-alarm cost times FP"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_ML12);
