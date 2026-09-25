/* ================================================================
 * R0:hello agi · 课程深化层（ml3 模型评估与特征工程 / ml4 经典模型与集成）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把「让模型可靠」与「经典模型与集成」两章从每节 3 要点深化到 7~8 要点。
 *       ml3 的重心是错误结论的头号来源——数据泄漏（先划分还是先缩放/编码、
 *       目标编码、重采样时机）、交叉验证的折设计（分层、分组、时间序）、
 *       指标与任务对齐、pipeline 与调参预算；ml4 的重心是「为什么这个模型
 *       在这个数据上不该用」：贪心分裂、距离与尺度、bagging 降方差 vs
 *       boosting 降偏差、oob 的用法、早停与学习率的权衡、集成里的相关性。
 * 写法沿用 agi-deepen-s12.js / agi-deepen-ml12.js：既有课节不写 title；
 * 新课写 title/target；order 覆盖全部既有 id；中文注释全部登记在 codeComments。
 * ================================================================ */

const DEEPEN_ML34 = {
  stages: ["ml3", "ml4"],

  order: {
    ml3: ["ml3-1", "ml3-2", "ml3-3", "ml3-4", "ml3-5", "ml3-6"],
    ml4: ["ml4-1", "ml4-2", "ml4-3", "ml4-4", "ml4-5", "ml4-6"]
  },

  lessons: {

    /* ===================== ml3 模型评估与特征工程 ===================== */
    "ml3-1": {
      min: 13,
      summary: [
        "三个集合各自只回答一个问题：训练集用来定参数，验证集用来定超参与早停，测试集只回答「这套东西在真实世界能打几分」。用途不同，所以不能互相顶替。",
        "顺序是这一章的命门：必须先划分、再在训练部分上 fit 缩放器/编码器/填补器。反过来「先在全量数据上做预处理再划分」，测试集的均值、类别频率、缺失模式就已经渗进训练，这就是数据泄漏。",
        "为什么泄漏的代价这么隐蔽：它不像报错会打断你，只是把分数悄悄抬高几个点。线下 0.91、线上 0.73 的落差，绝大多数情况不是「线上数据更难」，而是评估协议本身作弊。",
        "泄漏最常见的四个来源：测试集参与 fit（缩放、编码、填补、PCA）、目标编码用整表统计、重采样或去重发生在划分之前、以及用「未来才知道的信息」造特征（用当月平均价解释当月房价）。",
        "划分要匹配数据的产生方式：同一病人多次测量必须整进整出（GroupKFold），按时间到达的数据必须按时间切（TimeSeriesSplit），否则训练折里混进了测试折的近重复样本，分数与线上毫无关系。",
        "测试集「只能用一次」不是洁癖而是统计事实：拿它反复试十个模型、挑最好的报出来，等于让最大值去估计期望，分数系统性偏高；真实验收要么留一份从没碰过的 holdout，要么把选择过程一起写进交叉验证。",
        "评估协议 = 划分方式 + 指标 + 基线，三件事必须一起定：同一份数据换个切法结论就会翻（ml2 讲过先验对精确率的影响），所以「哪个模型更好」只在钉死协议之后才成立。",
        "衔接：ml1/ml2 已经把「怎么学」「怎么打分」讲完，本章开始讲「怎样构造一份配得上结论的数据划分」，ml4 再回头选模型。"
      ],
      summary_en: [
        "The three sets answer three different questions: training fixes the parameters, validation fixes the hyper-parameters and stopping point, the test set alone answers 'what is this worth in the real world'. Different jobs, so none may substitute for another.",
        "Order is the crux of this chapter: split first, then fit scalers, encoders and imputers on the training part only. Do preprocessing on the full table and split afterwards, and the test set's means, category frequencies and missingness pattern have already seeped into training - that is leakage.",
        "Leakage is expensive precisely because it is silent: it does not interrupt you with an error, it just lifts the score a few points. A gap like 0.91 offline and 0.73 in production is rarely 'real data is harder'; usually the evaluation protocol cheated.",
        "The four commonest sources: fitting on the test set (scaling, encoding, imputation, PCA), target encoding computed over the whole table, resampling or de-duplication before the split, and features built from information only known later (explaining this month's prices with this month's average).",
        "The split must match how the data was produced: repeated measurements of one patient travel together (GroupKFold), time-arriving data is cut by time (TimeSeriesSplit). Otherwise near-duplicates of the test fold sit inside training and the score has nothing to do with production.",
        "'Use the test set once' is a statistical fact, not fastidiousness: trying ten models on it and reporting the best makes you estimate an expectation with a maximum, so the number is systematically high. Either keep an untouched holdout or put the selection step inside cross-validation.",
        "An evaluation protocol is split plus metric plus baseline, fixed together: a different cut flips the conclusion (ml2 showed how the prior bends precision), so 'which model is better' is only true once the protocol is nailed down.",
        "Bridge: ml1 and ml2 covered how models learn and how to score them; this chapter is about building a data split that deserves its conclusions, and ml4 returns to choosing the model."
      ],
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = make_classification(n_samples=3000, n_features=6, random_state=0)

# 逐列做一次单变量体检：出现接近 1 的列，先怀疑泄漏再怀疑「找到了特征」
for j in range(X.shape[1]):
    print(j, round(roc_auc_score(y, X[:, j]), 3))

# 错：在全量数据上缩放，测试集的均值与方差已经进了训练
Xs = StandardScaler().fit_transform(X)
a = cross_val_score(LogisticRegression(max_iter=1000), Xs, y, cv=5, scoring="roc_auc")

# 对：缩放器放进流水线，每一折只在训练部分 fit
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
b = cross_val_score(pipe, X, y, cv=5, scoring="roc_auc")

# 差距可能只有千分之几，但方向永远是「前者更乐观」，而且它会随列数增多变大
print("fit on all", round(a.mean(), 4), "inside pipeline", round(b.mean(), 4))`,
      pit: "「先处理数据再划分」的动机往往很正当——我不想写两遍代码、想先把缺失值填完。后果是填补值、缩放均值、类别频率里全带着测试集的统计量，5 千条数据上这个偏差可以轻易到 1~3 个百分点，而它恰好集中在你最想要的「提升」区间里。把预处理写进 pipeline，是让这类错误从「要小心」变成「做不到」。",
      pit_en: "The motive for preprocessing before splitting is usually reasonable - you do not want to write the imputation twice. The cost is that imputed values, scaled means and category frequencies now carry test-set statistics, worth 1-3 points on 5000 rows, and they land exactly in the 'improvement' band you were hoping for. Putting preprocessing in a pipeline turns 'be careful' into 'impossible'.",
      ex: {
        q: "为什么「用测试集挑模型」和「用测试集调参」是同一类错误？",
        a: "因为两者都在让测试集的信息反向决定你的选择：挑出来的那个模型是对这份测试集最优的，不是对未来数据最优的，报告的分数因此是若干候选里的最大值而非无偏估计，偏差随候选数增大。",
        q_en: "Why are 'choosing the model on the test set' and 'tuning on the test set' the same error?",
        a_en: "Both let test-set information steer your choices: the model you report is the one best on that test set, not best for future data, so the number is the maximum over candidates rather than an unbiased estimate, and the bias grows with the candidate count."
      }
    },

    "ml3-2": {
      min: 13,
      summary: [
        "交叉验证的本职是把「一次划分的运气」平均掉：k 折轮流当验证，报均值也报标准差；只看均值不看波动，等于允许「五折里有一折崩了」被平均掩盖。",
        "折的形状必须匹配数据结构：普通 KFold 假设样本独立；分类且正类少时用 StratifiedKFold 保证每折正类比例一致；同一实体多条记录用 GroupKFold；有时间顺序就只能用 TimeSeriesSplit（或按月的 expanding window），随机切等于让模型偷看明天。",
        "「先划分再 CV」：测试集必须在做交叉验证之前就被锁进抽屉。最常见的错误是对全量数据跑 5 折 CV、把最好的模型拿去「在测试集上确认一下」、又回头改特征——测试集已经被你消耗掉了。",
        "CV 分数与线上/测试分数的系统性差距有三个来源：折内数据比全量少（小样本下明显）、你选了 CV 上最好的配置（乐观偏差）、以及验证分布与线上分布不同（分布漂移）。前两条是流程问题，只有第三条是模型问题。",
        "超参搜索要连着评估一起进 CV（嵌套交叉验证）：外层折负责报分数，内层折负责选超参。否则「用测试集挑出来的最优组合」又把乐观偏差请了回来。",
        "预算优先给搜索宽度而不是精度：固定 n_iter 的随机搜索在高维空间里能把每个维度都扫到，网格搜索在四个维度上每维只剩三档，还会把算力浪费在你根本不在乎的取值组合上。",
        "早停也算一种「用验证数据」：early stopping 的监控集在被反复查看之后同样会饱和，所以「早停用验证集、最终报告用测试集」这两份数据不能合并成一份。",
        "衔接：折设计解决「怎么平均」，下一节 ml3-3 的正则化强度、ml3-5 的特征选择都要靠这套 CV 分数来判断，一旦划分错了，后面所有比较都失去意义。"
      ],
      summary_en: [
        "Cross-validation exists to average away the luck of one split: k folds take turns as validation, and you report both mean and spread; quoting only the mean lets 'one fold collapsed' hide inside the average.",
        "Fold shape must match data shape: plain KFold assumes independent rows; use StratifiedKFold when positives are scarce so every fold keeps the same positive rate; GroupKFold when one entity contributes several rows; and with any time order only TimeSeriesSplit (or a monthly expanding window) is honest - shuffling time lets the model peek at tomorrow.",
        "Split first, then cross-validate: the test set has to be locked away before any CV runs. The usual failure is running 5-fold CV over everything, 'confirming' the winner on the test set, then going back to change features - by then the test set has been consumed.",
        "CV scores differ from production for three reasons: each fold trains on less data (visible when rows are few), you pick the configuration that won on CV (optimism bias), and validation and production distributions differ (drift). The first two are process, only the last is the model.",
        "Hyper-parameter search belongs inside the evaluation (nested cross-validation): the outer loop reports the score, the inner loop picks settings; otherwise 'the best combination chosen on the test set' invites optimism straight back in.",
        "Spend budget on search width, not grid resolution: randomised search with a fixed n_iter touches every dimension, while a grid over four dimensions affords three values each and wastes compute on combinations you do not care about.",
        "Early stopping is also a form of using validation data: a monitoring set that keeps being looked at saturates too, so the early-stopping set and the final reporting set must not be the same slice.",
        "Bridge: fold design answers 'how to average'; the regularisation strength in ml3-3 and the feature selection in ml3-5 both judge by those CV numbers, so a wrong split makes every later comparison meaningless."
      ],
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import RandomizedSearchCV, TimeSeriesSplit, cross_val_score

X, y = make_classification(n_samples=2000, n_features=10, weights=[0.9, 0.1], random_state=0)
base = RandomForestClassifier(random_state=0)

# 看均值也要看波动：两折 0.99 / 0.60 与五折都在 0.85 附近，含义完全不同
s = cross_val_score(base, X, y, cv=5, scoring="roc_auc")
print("cv5", round(s.mean(), 4), round(s.std(), 4))

# 时间序列只能按时间切：训练索引永远在验证索引之前，这才是「只用过去预测未来」
t = TimeSeriesSplit(3)
for tr, va in t.split(np.zeros(len(y))):
    print(tr.max(), "<", va.min())

# 随机搜索：同样的预算能把每个维度扫开，网格搜不到
grid = {"n_estimators": [100, 300, 900], "max_depth": [3, 5, 10, None], "min_samples_leaf": [1, 5, 20]}
rs = RandomizedSearchCV(base, grid, n_iter=25, cv=3, scoring="roc_auc", random_state=0)
rs.fit(X, y)
print("best", rs.best_score_, rs.best_params_)`,
      pit: "对时间序列数据用普通 shuffle 的 KFold：模型在「预测 3 月」时用到了 5 月的样本作为训练邻居，验证分数漂亮到不像话，上线后立刻打回原形。时间相关的数据里，泄漏不是偶发事故，而是随机切分的必然结果。",
      pit_en: "Applying shuffled KFold to time series: while predicting March the model has May rows in its training neighbourhood, so validation looks too good to be true and production snaps back the moment you ship. With time-dependent data, leakage is not an accident of carelessness but the guaranteed consequence of a random cut.",
      ex: {
        q: "为什么正类只有 3% 时必须用 StratifiedKFold 而不是普通 KFold？",
        a: "因为普通切分不保证每折都含正类：100 条数据切 5 折时某折可能一个正类都没有，那一折的召回/AUC 不是「模型差」而是「无定义」，均值随之失真；分层保证每折的正类比例与整体一致。",
        q_en: "Why must a 3% positive class use StratifiedKFold rather than plain KFold?",
        a_en: "A plain cut does not guarantee positives in every fold: with 100 rows in 5 folds one fold may contain none, and that fold's recall or AUC is undefined rather than bad, so the mean is meaningless; stratifying keeps each fold's positive rate equal to the whole."
      }
    },

    "ml3-3": {
      min: 12,
      summary: [
        "正则化是在损失上加一项「参数不要太大」的惩罚：它不改变模型的假设空间，而是给每个解加一个与系数有关的代价，把「拟合」与「复杂度」放到同一个天平上称。",
        "L2（Ridge）的惩罚是平方和，梯度与系数成正比，于是所有系数一起缩小、但谁都不会变成 0；效果是平滑、稳，尤其在共线性下（它把 X'X 变成可逆的 X'X + lambda*I）。",
        "L1（Lasso）的惩罚是绝对值之和，在原点处梯度是一个常数推力，足够小的系数会被直接推到 0，于是顺手完成特征选择；代价是共线性组里它往往只留一个，而留下哪一个不太稳定。",
        "弹性网络（ElasticNet）是两者的凸组合：既要稀疏又怕在相关特征里乱挑一个时用；工程上「先 Ridge 定基线、再 Lasso 做筛选」也常常比纠结选哪个更快。",
        "正则强度与标准化是一体的：惩罚项作用在系数上，而系数大小取决于该特征的尺度。不标准化就用 lambda 惩罚，等于在按量纲罚款——把面积（百万级）罚得死去活来，放过了 0/1  dummy 变量。",
        "强度用验证集/CV 分数选：C 与 alpha 都是越大越松或越紧（sklearn 里 LogisticRegression 的 C 越小越强，方向反直觉），画一条 lambda-分数曲线比试三个值可靠得多；太弱仍过拟合，太强就欠拟合，两边都要看得见。",
        "「L1 做特征选择」还有一个隐藏前提：被选中的特征集合在折与折之间是否稳定。只在一次拟合里出现的非零系数很可能只是运气；正确做法是对每一折各跑一次，统计每个特征入选的频率。",
        "衔接：正则化是在「模型侧」压制过拟合；下一节的缩放与编码、ml3-5 的特征选择则是在「数据侧」做同一件事，而数据侧操作做错一步就会变成泄漏。"
      ],
      summary_en: [
        "Regularisation adds a 'do not be too large' term to the loss: it does not change the hypothesis space, it attaches a cost to each solution so fit and complexity are weighed on one scale.",
        "The L2 (Ridge) penalty is a sum of squares whose gradient is proportional to the coefficient, so everything shrinks together and nothing reaches zero; the effect is smoothness and stability, notably under collinearity, where it turns X'X into the invertible X'X + lambda*I.",
        "The L1 (Lasso) penalty is a sum of absolute values, giving a constant push near the origin, so small coefficients land exactly on zero and selection comes free; the price is that among correlated columns it keeps only one, and which one is not stable.",
        "Elastic Net is the convex combination of both - use it when you want sparsity but distrust Lasso's arbitrary pick among correlated features; in practice 'Ridge for the baseline, Lasso for screening' is often faster than arguing about which to use.",
        "Penalty strength and standardisation belong together: the penalty acts on coefficients, whose magnitude depends on feature scale. Applying lambda without scaling means fining by unit - hammering area-in-square-metres while letting a 0/1 dummy off scot-free.",
        "Choose the strength with validation or CV scores (note sklearn's C is inverted: smaller means stronger), and read a lambda-versus-score curve rather than trying three values: too weak still overfits, too strong underfits, and you should be able to see both regimes.",
        "'Lasso selects features' carries a hidden condition: is the chosen set stable across folds? A coefficient that appears non-zero in one fit may be luck; run Lasso per fold and report how often each feature survives.",
        "Bridge: regularisation fights overfitting on the model side; scaling and encoding in ml3-4 and selection in ml3-5 fight it on the data side - and one misstep there turns it into leakage."
      ],
      code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import ElasticNet, Lasso, LinearRegression, Ridge
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 20 个特征里只有 3 个真有用，其余是噪声：高维小样本最容易在这里翻车
X, y = make_regression(n_samples=120, n_features=20, n_informative=3, noise=8, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, random_state=0)

# 不缩放就加正则，等于按量纲罚款；这里先标准化，让 lambda 只罚重要性
sc = StandardScaler().fit(Xtr)
A, B = sc.transform(Xtr), sc.transform(Xte)

for name, est in [("none", LinearRegression()), ("ridge1", Ridge(1.0)), ("lasso0.1", Lasso(0.1)), ("enet", ElasticNet(0.1, 0.5))]:
    e = est.fit(A, ytr)
    nz = int((np.abs(e.coef_) > 1e-8).sum())
    # 记住：非零个数少不等于更准，稀疏只是可解释性上的收益
    print(name, "testR2", round(e.score(B, yte), 3), "nonzero", nz, "top3", np.round(np.sort(np.abs(e.coef_))[-3:], 2))`,
      pit: "在没标准化的数据上调 alpha 调了半天：系数被惩罚的程度实际由特征量纲决定，你以为在调「模型多简单」，其实在调「哪一列的数字更大」。表现是正则几乎不影响某些重要特征、却把 0/1 指示列压成 0；正确顺序永远是先缩放、后调 lambda。",
      pit_en: "Tuning alpha on unstandardised data: the penalty each coefficient actually receives is set by its column's unit, so you think you are tuning model simplicity while really tuning which column holds bigger numbers. The symptom is that important wide-scale features barely move while 0/1 indicators get crushed to zero - scale first, penalise second.",
      ex: {
        q: "为什么共线性场景更适合 Ridge 而不是 Lasso？",
        a: "因为相关特征可以互相补偿，L1 的常数推力会把其中一列推到 0、把权重全压到另一列，而具体压哪一列取决于噪声，结果在折与折之间跳；Ridge 只把它们一起缩小但都保留，预测更稳、解释也更诚实。",
        q_en: "Why is Ridge the better match for collinear features than Lasso?",
        a_en: "Correlated columns trade off against each other, and L1's constant push zeroes one of them and dumps the weight on the other, with the victim chosen by noise, so the selection jumps between folds; Ridge shrinks them together, keeps both and predicts more stably."
      }
    },

    "ml3-4": {
      min: 13,
      summary: [
        "缩放分两种口径：标准化（减均值除标准差）改变形状、容忍离群点，是默认；归一化（min-max 压到 0~1）会把极值直接写进比例，一个脏点就能把整列压成一条线。有异常值时优先标准化或先截断。",
        "梯度类与距离类模型（线性/逻辑回归、SVM、kNN、神经网络、k-means）必须缩放；树与森林按「这一列是否大于阈值」切分，只看排序，因此缩放对它毫无影响——这是最常被错用的一条规则。",
        "所有数据侧变换都必须「只在训练折上 fit、对其他数据 transform」。这一步在 sklearn 里用 pipeline 免费获得；一旦手写，就一定会漏掉某一步（尤其是 PCA 和编码）。",
        "类别特征先选编码再谈效果：one-hot 不引入虚假顺序、可解释、配合树与线性模型都稳，基数不高时是默认；ordinal 只在该列真的有顺序（尺码 S/M/L）时用；把类别直接编成 1/2/3 喂进模型，等于命令模型相信「3 比 1 大两倍」。",
        "目标编码（用标签均值替换类别）能显著提升树模型表现，但它把标签写进了特征：必须只在训练折内部计算、要加平滑、要留 out-of-fold 机制。漏掉任一条，一个 300 类目的列就能把 AUC 抬到 0.99 而线上归零。",
        "缺失值不是一种数值，填什么都会造出一个「正常取值里没有的值」：中位数/均值填补要配一列 is_missing 指示列，因为「这一格是缺的」本身常常带信息（漏填的表单、未体检的人群）；kNN 填补在小表格里贵且不稳。",
        "异常值要分三种处理：录入错误（改或删，但先能解释错在哪）、真实极端值（截断 winsorize、取对数、或换成秩/分位变换，让模型不被拉扯）、以及「异常本身就是标签」（欺诈检测里删异常值等于删掉正类）。",
        "高基数类别（用户 ID、商品 SKU）几乎永远不该 one-hot：一行几万列稀疏矩阵既慢又必然过拟合，正确方向是聚合统计（注意时间窗与 out-of-fold）、频次编码，或直接交给支持类别特征的梯度提升实现（ml4）。"
      ],
      summary_en: [
        "Two scaling flavours: standardisation (subtract mean, divide by std) keeps shape and tolerates outliers, and is the default; min-max normalisation writes the extremes into the ratios, so one bad row can squash a whole column into a line. With outliers, prefer standardising or clip first.",
        "Gradient and distance models (linear and logistic regression, SVM, kNN, neural nets, k-means) must be scaled; trees and forests split on 'is this column above a threshold', which only depends on order, so scaling changes nothing - the single most misapplied rule in this chapter.",
        "Every data-side transform must be fitted on the training fold only and merely applied elsewhere. sklearn gives you this free through a pipeline; hand-written code will eventually miss a step, typically the PCA or the encoder.",
        "Pick the encoding before arguing about model quality: one-hot invents no order, is interpretable and is the default while cardinality is modest; ordinal only when the column really is ordered (S/M/L); feeding categories as 1/2/3 commands the model to believe 3 is twice 1.",
        "Target encoding (replacing a category with its label mean) can lift tree models a lot, but it writes labels into features: compute it inside each training fold only, smooth it, and keep an out-of-fold scheme. Skip any of those and one 300-level column pushes AUC to 0.99 and production to nothing.",
        "Missingness is not a value, and whatever you insert creates an out-of-range point: impute with median or mean but add an is_missing indicator, because 'this cell was empty' often carries information (skipped forms, untested people); kNN imputation is costly and unstable on small tables.",
        "Treat outliers three ways: keying errors (fix or drop, but be able to name the mistake), genuinely extreme values (winsorise, log, or rank-transform so the model is not dragged), and cases where the anomaly is the label itself - in fraud detection, deleting outliers deletes positives.",
        "High-cardinality columns (user id, SKU) should almost never be one-hot: tens of thousands of sparse columns are slow and guaranteed to overfit. Aggregate inside a time window (out-of-fold), use frequency encoding, or hand the column to a gradient-boosting implementation with native categorical support (ml4)."
      ],
      code: `import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

df = pd.DataFrame({
    "area": [88.0, 95.0, np.nan, 12000.0, 87.0, 91.0],
    "city": ["bj", "sh", "bj", None, "sh", "bj"],
    "y": [0, 1, 0, 1, 1, 0],
})
# 先看一眼分布：一个极端值会不会把整列的尺度带走
print("area mean/std", round(float(df["area"].mean()), 1), round(float(df["area"].std()), 1))

num = Pipeline([
    # 填补要放在缩放前面，并留一列指示位：缺失本身就是信息
    ("imp", SimpleImputer(strategy="median", add_indicator=True)),
    ("scale", StandardScaler()),
])
cat = Pipeline([
    # 城市里有缺失：most_frequent 填补，同时 one-hot 要能接受训练时没见过的类别
    ("imp", SimpleImputer(strategy="most_frequent")),
    ("oh", OneHotEncoder(handle_unknown="ignore")),
])
pre = ColumnTransformer([("num", num, ["area"]), ("cat", cat, ["city"])])
model = Pipeline([("pre", pre), ("clf", LogisticRegression(max_iter=1000))])
model.fit(df[["area", "city"]], df["y"])
# 变换后的宽度：one-hot 与指示列都会加列，列名可以从 encoder 里取出来
print("features after transform", model["pre"].transform(df[["area", "city"]]).shape)`,
      pit: "忘了 `handle_unknown=\"ignore\"`（或用了目标编码却没做 out-of-fold）：线上出现一个训练时没见过的新城市，transform 直接抛错，整条服务挂掉；或者更糟——它悄悄编出一个全零向量，模型「自信地」给出无意义分数。类别编码必须显式决定「新类别怎么办」。",
      pit_en: "Forgetting handle_unknown='ignore' (or target-encoding without an out-of-fold scheme): an unseen city in production makes transform raise and the service dies; or worse, it silently becomes an all-zero vector and the model produces confidently meaningless scores. Categorical encoding must state explicitly what an unseen level means.",
      ex: {
        q: "为什么加了 is_missing 指示列常常比换更聪明的填补方法更有效？",
        a: "因为缺失本身往往是系统性现象而不是随机噪声（谁没填、哪批数据没采集），指示列把「缺失」这件事变成模型能用的显式特征；填补值只是让矩阵可算，信息要由指示列带回来。",
        q_en: "Why does adding an is_missing indicator often beat a cleverer imputation method?",
        a_en: "Because missingness is usually systematic rather than random noise (who skipped the field, which batch was not logged), and the indicator turns that into an explicit feature; imputation only makes the matrix computable - the information has to come back through the indicator."
      }
    },

    "ml3-5": {
      min: 12,
      summary: [
        "「数据和特征决定上限，模型只是逼近它」不是口号：模型学的是特征到标签的映射，特征里不存在的区分度，任何模型都造不出来；反之一个混进标签信息的特征会让上限假到离谱。",
        "特征工程只有三种合法来源：领域知识（把物理量、业务规则写成特征）、变换与组合（比值、差、对数、分箱、交叉项）、以及从原始结构里抽取（文本长度、时间派生的星期与小时、图上的度）。三者都是人在「注入先验」，模型没学到的东西由你补上。",
        "特征选择分三类，成本与可靠性依次上升：过滤法（相关系数、互信息）便宜但完全忽视特征之间的交互与冗余；包裹法（递归消除、前向选择）看真实验证分数但容易过拟合到 CV；嵌入法（L1、树的重要性）随训练附带产出，最省但不稳定。",
        "为什么「挑相关性最高的十个特征」经常是错的：高相关意味着与标签关系强，但也意味着它们彼此信息重复，十个高相关的列可能只值两个；要看冗余就配合 RFE、聚类去重或直接用 L1（ml3-3）。",
        "置换重要性是更可信的替代品：把某列打乱、看验证分数掉多少。它抓得到非线性与交互，也自带「在模型眼里有没有用」的语境；缺点是慢（要打乱多次），且相关特征之间会互相摊薄功劳。",
        "构造比值类特征要防零除与信息不足：分母 clip 到最小值、给样本量不足的行做平滑（贝叶斯/拉普拉斯收缩），否则「1 次点击 1 次成交 = 100% 转化率」会成为一个极强的假信号——这就是小分母陷阱。",
        "所有派生特征的 fit 过程（目标统计、分位数边界、PCA 主成分）都必须与 pipeline 同生共死：在整表上算分位数再划分，等于把未来与测试的信息写进训练；这也是把「特征工程」从脚本变成可复用组件的关键一步。",
        "衔接：本章到此评估与数据两侧都齐了；ml4 回到「模型选型」——在同样一套评估协议下比较树、森林、kNN、SVM 与集成，谁的假设更贴合你的数据。"
      ],
      summary_en: [
        "'Data and features set the ceiling, models approach it' is not a slogan: a model learns a mapping from features to labels, so any distinction absent from the features cannot be manufactured by any model - while one feature contaminated with label information makes the ceiling absurdly fake.",
        "Feature engineering has exactly three legitimate sources: domain knowledge (encode physics or business rules as features), transforms and combinations (ratios, differences, logs, bins, interactions), and extraction from raw structure (text length, weekday and hour from timestamps, degree in a graph). All three are a human injecting priors, supplying what the model would never discover.",
        "Selection comes in three families of rising cost and reliability: filters (correlation, mutual information) are cheap but blind to redundancy and interaction between features; wrappers (RFE, forward selection) use real validation scores but overfit the CV itself; embedders (L1, tree importances) come free with training but are unstable.",
        "'Take the ten features most correlated with the label' is usually wrong: high correlation means a strong marginal link but also that those columns repeat each other, so ten may be worth two. Pair a filter with RFE, cluster-and-deduplicate, or let L1 do it (ml3-3).",
        "Permutation importance is the more trustworthy stand-in: shuffle one column and measure how far validation drops. It catches non-linearity and interaction and answers 'does this matter to this model'; the costs are speed (many repeats) and the way correlated features split credit and hide each other.",
        "Ratio features need protection from zero denominators and thin samples: clip the denominator and shrink low-count rows toward the global rate (Bayesian or Laplace smoothing), otherwise '1 click, 1 purchase = 100% conversion' becomes a very strong fake signal - the small-denominator trap.",
        "Every fitting step a derived feature needs (label statistics, quantile edges, PCA axes) must live and die with the pipeline: computing quantiles on the whole table before splitting writes test and future information into training, which is exactly why feature engineering belongs in a component rather than a script.",
        "Bridge: both sides - evaluation and data - are now in place. ml4 returns to model choice: trees, forests, kNN, SVM and ensembles compared under one fixed protocol, asking which assumption fits your data."
      ],
      code: `import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split

df = pd.DataFrame({
    "show": [1000, 2000, 500, 8000, 300, 1200],
    "click": [30, 25, 20, 60, 1, 40],
    "order": [3, 1, 2, 4, 0, 5],
})
# 比值特征最容易踩小分母陷阱：1 次点击 1 次成交会变成「转化率 100%」
df["ctr"] = df["click"] / df["show"].clip(lower=1)
df["cvr"] = df["order"] / df["click"].clip(lower=1)
# 收缩：把小流量行的转化率拉回整体均值，避免被个位数样本绑架
global_rate = df["order"].sum() / df["click"].clip(lower=1).sum()
df["cvr_s"] = (df["order"] + 5 * global_rate) / (df["click"] + 5)

feats = ["show", "click", "order", "ctr", "cvr", "cvr_s"]
Xtr, Xte, ytr, yte = train_test_split(df[feats], (df["order"] > 2).astype(int), random_state=0)
m = HistGradientBoostingClassifier(random_state=0).fit(Xtr, ytr)

# 打乱一列看验证分数掉多少：这是「在这个模型眼里有没有用」的直接答案
r = permutation_importance(m, Xte, yte, n_repeats=20, random_state=0)
print(list(zip(feats, np.round(r.importances_mean, 4))))`,
      pit: "把「CV 分数最高的那组特征」当最终答案交付：特征选择的过程本身在被 CV 反复消耗，选出来的组合对这几折有乐观偏差，测试集上的分数会掉。对策是把筛选步骤放进内层折（嵌套 CV），或至少留一份从没用过的 holdout 做终审。",
      pit_en: "Shipping the feature subset with the best CV score: selection itself consumes the cross-validation, so the chosen set carries optimism about those folds and the test score falls. Move selection inside the inner folds (nested CV), or keep a holdout nobody ever opened for the final verdict.",
      ex: {
        q: "为什么树模型的特征重要性常常和置换重要性给出不同结论？",
        a: "因为树的重要性按分裂发生次数累计，天然偏爱高基数与连续列，而且只要有一列冗余就会把功劳摊薄到几列上；置换重要性看的是「拿掉它性能掉多少」，与冗余和交互的关系不同，因此更适合当结论、不适合当统计。",
        q_en: "Why do tree importances and permutation importance often disagree?",
        a_en: "Tree importance counts splits, so it quietly favours high-cardinality and continuous columns and spreads credit across redundant ones; permutation importance measures the drop when you scramble a column, so it handles redundancy differently - better read as a conclusion than as a statistic."
      }
    },

    "ml3-6": {
      title: "综合重构：一条做不出漂亮假分数的流水线",
      title_en: "Synthesis: A Pipeline That Cannot Produce a Pretty Fake Score",
      min: 15,
      target: "能把划分、预处理、特征工程、调参与报告串成一条嵌套在交叉验证里的流水线，并逐项指出跳过哪一步会得到怎样虚高的分数。",
      target_en: "Wire splitting, preprocessing, feature engineering, tuning and reporting into one pipeline nested inside cross-validation, and name the inflated score that skipping each step would produce.",
      summary: [
        "收口顺序清单（照着做就不会泄漏）：读数据 → 看分布/缺失/唯一值数 → 立刻划出测试集并封存 → 在训练部分上定义预处理与特征 → 交叉验证（含嵌套调参）选模型 → 一次性测试集验收 → 记录划分方式与指标。第 3 步和第 4 步的顺序是本章全部内容的浓缩。",
        "把「防泄漏」从注意事项变成结构：所有会 fit 的东西（缩放、编码、填补、PCA、SMOTE、特征筛选）都写进 Pipeline / ColumnTransformer，交叉验证自动为每一折重拟合；写不进 pipeline 的手工步骤，才是真正会出错的地方。",
        "评估报告的最小完备集：折数与划分方式、指标及其波动（均值 ± 标准差）、两条基线（多数类、随机排序）、最优配置的来源（内层 CV）、以及一句「这个分数最可能在哪儿失真」。",
        "「分数虚高」的五种典型症状自查：AUC 高得离谱（>0.97 且是表格数据）、某列单变量 AUC 接近 1、训练与验证差距随特征数上升而扩大、换随机种子结论就变、以及线下线上落差集中在早期几个版本。前三条几乎都是泄漏。",
        "把本章与前两章串成一句：ml1 保证你会训练、ml2 保证你会打分、ml3 保证你打的分可信；缺了 ml3，前两者只是在高效地生产错觉。",
        "动手收口：故意把缩放器在全量数据上 fit 一次、故意做一次整表目标编码，各跑一遍 CV，看分数抬起多少个 0.001~0.02——只有亲眼见过虚高的样子，才会在真实项目里认出它。",
        "指向 ml4：评估与数据都可靠之后，剩下的问题才轮到模型——树、森林、kNN、SVM、朴素贝叶斯各自的假设、代价与失效场景，以及集成到底在集成什么。"
      ],
      summary_en: [
        "The order that cannot leak: load data, inspect distributions/missing values/cardinality, cut and seal the test set immediately, define preprocessing and features on the training part, cross-validate (with nested tuning) to choose a model, run the test set once for acceptance, record split and metric. Steps 3 and 4 in that order are this whole chapter compressed.",
        "Turn 'avoid leakage' from advice into structure: anything that fits (scaling, encoding, imputation, PCA, SMOTE, selection) goes into a Pipeline or ColumnTransformer so cross-validation refits it per fold; the hand-written steps that refuse to enter the pipeline are where the damage happens.",
        "The irreducible reporting set: fold count and split method, metric with its spread (mean plus standard deviation), two baselines (majority class, random ranking), where the winning configuration came from (an inner CV), and one sentence on where this score is most likely to be inflated.",
        "Five symptoms of an inflated score: an absurdly high AUC on tabular data (above 0.97), one column with near-1 univariate AUC, the train-validation gap growing with feature count, conclusions flipping when you change the seed, and an offline-online gap that concentrated in your earliest versions. The first three are usually leakage.",
        "String the three chapters together: ml1 makes you able to train, ml2 makes you able to score, ml3 makes those scores trustworthy; without ml3 the first two just manufacture illusions efficiently.",
        "Hands-on closing: deliberately fit the scaler on everything once, and deliberately target-encode over the whole table once, rerun CV each time and watch how many thousandths the score gains. Only having seen inflation with your own eyes will you recognise it in a real project.",
        "Towards ml4: once evaluation and data are trustworthy, the remaining question is the model - the assumptions, costs and failure modes of trees, forests, kNN, SVM and naive Bayes, and what an ensemble is actually ensembling."
      ],
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV, StratifiedKFold, cross_validate
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

X, y = make_classification(n_samples=4000, n_features=12, weights=[0.9, 0.1], random_state=0)
cv = StratifiedKFold(5, shuffle=True, random_state=0)

# 调参发生在内层折里：外层分数才是「这套流程」的真实能力，而不是最优配置的特权
tuned = GridSearchCV(
    Pipeline([("sc", StandardScaler()), ("clf", LogisticRegression(max_iter=1000))]),
    {"clf__C": [0.01, 0.1, 1.0, 10.0]}, cv=3, scoring="roc_auc",
)
outer = cross_validate(tuned, X, y, cv=cv, scoring={"auc": "roc_auc", "ap": "average_precision"})
for k in ("auc", "ap"):
    print(k, round(outer["test_" + k].mean(), 4), round(outer["test_" + k].std(), 4))

# 对照：完全不调参的默认配置，多数时候差距小于你以为的「玄学提升」
d = cross_validate(LogisticRegression(max_iter=1000), X, y, cv=cv, scoring="roc_auc")
print("默认 C=1", round(d.mean(), 4))`,
      pit: "把交叉验证的均值当结论只报一个数：某折崩到 0.4 也能被平均拉平到「看着挺稳」，而崩掉那一折往往正是稀有类别集中出现的折。永远把折间波动和每折明细一起看，否则你报的是一个数字、掩盖的是五个故事。",
      pit_en: "Reporting one cross-validation mean as the conclusion: a fold collapsing to 0.4 still averages out to 'looks stable', yet that fold is usually the one holding the rare class. Read the spread and the per-fold list, or you publish one number and hide five stories.",
      ex: {
        q: "为什么嵌套交叉验证比「先调参再跑一次 CV」慢很多却仍然值得？",
        a: "因为后者让最优配置带上了内层数据的乐观偏差，外层 CV 只是在给这个偏差背书，报出的提升无法复现；嵌套把「选配置」这一步完整地关进每一折内部，外层分数才回答「照这套流程去做，新数据上能得几分」。",
        q_en: "Why is nested cross-validation much slower than 'tune first, then run CV once' and still worth it?",
        a_en: "Because in the second version the winning configuration carries optimism from the inner data, so the outer CV merely endorses that bias and the reported gain does not replicate. Nesting keeps selection inside each fold, so the outer score answers 'what do I get on new data if I follow this whole recipe'."
      }
    },

    /* ===================== ml4 经典模型与集成 ===================== */
    "ml4-1": {
      min: 12,
      summary: [
        "决策树是贪心算法：在每个节点挑「一个特征 + 一个阈值」使分裂后的纯度提升最大，一路切到底，从不回头。它不搜索全局最优，所以快、可解释，但也可能第一步就选错，之后怎么切都在补救。",
        "纯度用基尼不纯度或信息增益/增益比衡量。选分裂标准时要知道：信息增益天然偏爱取值多的特征（把每个样本切到自己的叶子就是零不纯度），所以工程上默认用基尼，或用增益比/C4.5 做惩罚。",
        "树不需要缩放：分裂只看某一列的排序，任何单调变换（乘常数、取对数）都不改变切点。这也是它在「量纲混乱的表格数据」上显得格外皮实的原因。",
        "树的「不稳定」不是随机性而是结构性：顶层一次分裂换个选择，下面的整棵树就长不一样，所以单棵树方差高。这一点是 ml4-2 随机森林存在的全部理由（bagging 降方差）。",
        "深度是最大的过拟合来源：不断分裂可以在训练集上做到零误差，代价是把噪声逐条背下来。控制手段是 max_depth、min_samples_leaf、min_impurity_decrease 与后剪枝（ccp_alpha），本质都是限制容量。",
        "树天生不会外推：训练时面积最大 200 平，1000 平的新样本会被判进「最大面积那一区」，预测值不再上升。这在价格、销量这类要往区间外推的任务上是致命限制。",
        "类别特征在树里要小心高基数偏置：sklearn 的树要求先编码，而 one-hot 之后「按哪个子类别切」候选数暴涨，纯基尼会偏向多类别列；支持原生类别的特征（LightGBM、CatBoost，ml4-2）用更聪明的子集枚举绕开了这点。",
        "衔接：单棵树是「弱但可读」的零件，ml4-2 把它变成森林与提升机；本章所有比较都建立在 ml3 的评估协议上，划分错了这些结论全部作废。"
      ],
      summary_en: [
        "A decision tree is greedy: at each node it picks 'one feature and one threshold' that maximises the purity gain and never looks back. Skipping global search is why it is fast and readable, and also why a wrong first split leaves every later split repairing it.",
        "Purity is measured by Gini impurity or information gain (and gain ratio). Know the bias before choosing: information gain favours columns with many distinct values - isolating every row in its own leaf is zero impurity - so practice defaults to Gini, or to gain ratio / C4.5 which penalise that.",
        "Trees need no scaling: a split only looks at the order within one column, so any monotone transform (multiply, take logs) leaves the cut point unchanged. That is why trees feel tough on messy tabular data with mixed units.",
        "Tree instability is structural, not random: a different top split reshapes the whole tree beneath it, so one tree has high variance. That single fact is the entire reason random forests exist in ml4-2 (bagging buys down variance).",
        "Depth is the main overfitting channel: keep splitting and training error reaches zero, at the price of memorising noise row by row. The controls - max_depth, min_samples_leaf, min_impurity_decrease, and post-pruning with ccp_alpha - are all capacity limits wearing different names.",
        "Trees cannot extrapolate: if the widest house in training was 200 square metres, a 1000 square metre sample lands in 'the widest bucket' and the prediction stops rising. For prices and sales, where going beyond the observed range is the whole point, this is disqualifying.",
        "Watch cardinality bias with categoricals: sklearn's trees demand encoding first, and one-hot multiplies the candidate splits so Gini quietly favours high-cardinality columns; implementations with native categorical support (LightGBM, CatBoost, ml4-2) sidestep this with smarter subset enumeration.",
        "Bridge: one tree is a weak but readable part; ml4-2 turns it into forests and boosting machines. Every comparison here rests on ml3's protocol - get the split wrong and these conclusions are void."
      ],
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.tree import DecisionTreeClassifier, export_text

X, y = make_classification(n_samples=800, n_features=6, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, random_state=0)

# 树只看每一列的排序，所以任何单调变换都不会改变结果
A = MinMaxScaler().fit_transform(Xtr)
B = Xtr * 1000.0
a = DecisionTreeClassifier(max_depth=3, random_state=0).fit(A, ytr).score(Xte, yte)
b = DecisionTreeClassifier(max_depth=3, random_state=0).fit(B, ytr).score(Xte, yte)
print("缩放前后", round(a, 4), round(b, 4))

# 深度放开：训练分数一定到 1，测试分数先升后降，那个「降」就是过拟合
for d in (2, 4, 8, None):
    t = DecisionTreeClassifier(max_depth=d, random_state=0).fit(Xtr, ytr)
    print("depth", d, "train", round(t.score(Xtr, ytr), 4), "test", round(t.score(Xte, yte), 4))
print(export_text(DecisionTreeClassifier(max_depth=2, random_state=0).fit(Xtr, ytr)))`,
      pit: "拿树模型的外推结果做定价或预测峰值：树在训练区间之外只能重复「最近那一区」的值，遇到超出训练最大值的样本它绝不给出更大的预测。表现是测试集上「大值一律被低估」；这类任务要有能沿趋势外推的形式（线性、或者带单调约束的提升树），别问「为什么模型不敏感」。",
      pit_en: "Using a tree for pricing or peak forecasting: outside the observed range a tree can only repeat the nearest bucket, so it never predicts beyond the largest training value. The symptom is systematic underestimation of large test values. Tasks that must follow the trend need a form that extrapolates (linear, or boosted trees with monotonic constraints).",
      ex: {
        q: "为什么单棵决策树方差特别高，而这一点恰好是随机森林的立论基础？",
        a: "因为贪心分裂对训练子集极其敏感：换掉几条数据，顶层分裂就可能换成另一列，整棵树随之重长，两次拟合的差异巨大。对许多棵各自「错得不同」的树做平均，个体差异相互抵消，方差被压下来、偏差几乎不变。",
        q_en: "Why is a single tree so high-variance, and why is that exactly the premise of random forests?",
        a_en: "Because greedy splitting is hypersensitive to the training subset: a few changed rows can move the top split to another column and regrow the whole tree, so two fits differ wildly. Averaging many trees that are 'wrong in different ways' cancels those individual differences - variance drops, bias barely moves."
      }
    },

    "ml4-2": {
      min: 14,
      summary: [
        "集成的收益不来自「多几个模型」而来自误差的相互抵消：成员各自独立地犯错时，平均把方差抹掉；成员越像，抵消越少——所以集成里的关键量是成员之间的相关性，而不是单体的精度。",
        "bagging（随机森林）与 boosting（梯度提升）在修不同的病：bagging 让许多高方差的深树各自看数据的有放回抽样与随机特征子集，投票/平均降方差；boosting 依次拟合前一模型的残差方向，把一串弱学习器叠成强学习器，主要降偏差。",
        "随机森林的两个随机性是它的灵魂：bootstrap 行抽样 + 每分裂随机选列。关掉 bootstrap 会得到几百棵几乎一样的树，方差降不下来；max_features 设成 None 也一样——这两处一旦设错，森林就退化成「很多棵同一棵树」。",
        "oob_score 是 bagging 的免费午餐：每棵树大约没见过三分之一的样本，用那些树投票给这些样本打分就是内部验证，省下一份验证集。但它是「森林这个整体」的分数，不能当调参天梯，也别指望它在小样本上稳定。",
        "梯度提升的学习率与树数是一对跷跷板：learning_rate 小就必须 n_estimators 多，只调小学习率而不加树，等于把每一步缩小却提前收手（欠拟合）。默认值（0.1 配 100）通常偏小，先加树数再加深度。",
        "早停是 boosting 的标准配置：留一份验证集监控，分数不再改善就停；它同时把「树数」从手工超参变成数据量决定，并抑制小数据集上的过拟合。但注意被监控的那份验证集也在被消耗（ml3-2）。",
        "XGBoost/LightGBM 快在三件事：直方图分桶（把连续列离散成 255 个桶，分裂点从排序查找变成桶前缀和）、按叶增益做 leaf-wise 生长、以及列方向并行与特征分箱缓存；配合 GPU 与稀疏感知，几百万行的表格数据也能几分钟收敛。",
        "类别特征与缺失值不必再手工处理：原生类别支持直接枚举子集切分，缺失值被模型当作「往左还是往右」的一部分学习（这正是树系模型在表格上强的原因之一）。但要记住森林/树不能外推（ml4-1），以及概率含义不同：RF 是投票比例、GBDT 是 sigmoid 后的加性 logit（ml2-4）。"
      ],
      summary_en: [
        "An ensemble earns its keep not from 'more models' but from cancelling errors: when members fail independently, averaging deletes variance; the closer the members look to each other, the less is cancelled. The key quantity in an ensemble is correlation between members, not individual accuracy.",
        "Bagging (random forest) and boosting (gradient boosting) treat different illnesses. Bagging gives many high-variance deep trees a bootstrap row sample and a random column subset each, then averages - variance down. Boosting repeatedly fits the residual direction of the current model, stacking weak learners into a strong one - bias down.",
        "The two randomities are the soul of a random forest: bootstrap rows plus random columns per split. Turn off bootstrap and you get several hundred near-identical trees whose variance never drops; set max_features to None and the same thing happens. Get either wrong and the forest degenerates into 'many copies of one tree'.",
        "oob_score is bagging's free lunch: each tree misses roughly a third of the rows, and scoring those rows with the trees that never saw them is internal validation, saving you a validation set. But it describes the forest as a whole, is not a tuning ladder, and is unreliable on small data.",
        "In boosting the learning rate and tree count are a seesaw: a smaller rate needs more trees, and shrinking the rate without adding any is taking shorter steps and then quitting early (underfitting). Defaults (0.1 with 100) are usually on the small side, so raise n_estimators before depth.",
        "Early stopping is standard equipment for boosting: watch a validation set and stop when it stops improving; this turns tree count from a hand-set number into one determined by the data and suppresses overfitting on small sets. The monitored set is still being consumed, though (ml3-2).",
        "XGBoost and LightGBM are fast for three reasons: histogram binning (a continuous column becomes ~255 buckets, so finding a split means prefix sums instead of sorting), leaf-wise growth that picks the largest gain, and column parallelism with cached bin summaries. Add GPU and sparsity awareness and millions of tabular rows converge in minutes.",
        "Categoricals and missing values no longer need hand-holding: native categorical support enumerates subset splits, and missingness is learned as 'go left or right' - one reason tree models dominate tabular data. Remember trees cannot extrapolate (ml4-1) and that the probabilities differ in kind: a forest votes, a boosted model outputs a squashed additive logit (ml2-4)."
      ],
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=4000, n_features=15, weights=[0.9, 0.1], random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, stratify=y, random_state=0)

# 有放回抽样制造差异：关掉 bootstrap 后成员高度相关，方差降不下来
for boot in (True, False):
    rf = RandomForestClassifier(n_estimators=200, bootstrap=boot, oob_score=boot, random_state=0)
    rf.fit(Xtr, ytr)
    print("bootstrap", boot, "test", round(rf.score(Xte, yte), 4), "oob", getattr(rf, "oob_score_", float("nan")))

# 学习率与树数是跷跷板：只把 lr 调小而不加树，等于提前收手
for lr, it in ((0.3, 100), (0.05, 100), (0.05, 600)):
    m = HistGradientBoostingClassifier(learning_rate=lr, max_iter=it, early_stopping=False, random_state=0)
    m.fit(Xtr, ytr)
    print("lr", lr, "iter", it, "test", round(m.score(Xte, yte), 4))

# 早停把树数交给数据决定，不用再猜
m = HistGradientBoostingClassifier(learning_rate=0.1, max_iter=2000, early_stopping=True, validation_fraction=0.15, random_state=0)
m.fit(Xtr, ytr)
print("早停后实际用了", m.n_iter_, "棵树，测试", round(m.score(Xte, yte), 4))`,
      pit: "把 `oob_score` 当成验证分数去调参：它是「森林整体」在自身抽样下的分数，且随 n_estimators 与 max_features 的定义会漂移；用它选超参会把模型一步步推向「对 oob 数据更熟」的配置。oob 适合当免费的哨兵，选参数仍要留一份独立验证集。",
      pit_en: "Tuning against oob_score as if it were a validation score: it describes the forest under its own bootstrapping and drifts with n_estimators and max_features, so optimising it steers the model toward knowing that sample better. Keep oob as a free sentinel and still hold out an independent set for tuning.",
      ex: {
        q: "为什么随机森林加深单棵树常常几乎无用，而梯度提升加深却明显有效？",
        a: "因为森林的误差主要来自方差，深树之间的投票差异会被平均抹掉，而它无法降低「模型对全体数据的系统性偏差」；boosting 每一步都在拟合残差方向，加深就是在增加拟合能力，直接压偏差——代价是方差开始上升，所以要靠学习率与早停牵住。",
        q_en: "Why does making individual forest trees deeper rarely help, while doing so in boosting clearly does?",
        a_en: "A forest's error is mostly variance, and voting averages individual quirks away - it cannot reduce the model's systematic bias toward the data. Boosting fits the residual direction at every step, so depth adds real capacity and pushes bias down, at the price of rising variance, which is why learning rate and early stopping must hold it in check."
      }
    },

    "ml4-3": {
      min: 12,
      summary: [
        "kNN 没有训练阶段，它把「学习」推到预测时：新样本看最近 k 个邻居投票。所以它的数据集就是模型本身——存下来的原始数据一旦脏，预测跟着脏。",
        "k 的选择是偏差-方差的教科书：k=1 时决策边界最曲折、对噪声敏感（高方差、低偏差）；k 增大逐步变平（低方差、高偏差，且在类别不平衡时容易直接判成多数类）。同时 k 最好取奇数（二分类）以避免平票。",
        "距离就是模型的假设：欧氏距离假定各维等权且单位可比，因此不缩放时收入一定主导年龄；曼哈顿距离对离群点更钝，余弦相似度只看方向不看长度（文本场景常用）。选距离等于选「你认为什么叫相似」。",
        "kNN 的第二个软肋是维数灾难：维度升高后，任意两点的距离趋于相同，「最近邻居」不再最近，标签传播退化成全局多数投票。高维数据要先降维（PCA、ml4-5）或改用线性模型/树。",
        "SVM 找的是一条「离两侧样本都尽量远」的分界：间隔最大化让解只由少数支持向量决定，因此比「能分开就行」的分界面稳；软间隔参数 C 是在「不误分一个点」与「分界尽量直」之间权衡，方向和直觉相反（C 大更硬）。",
        "核技巧的直觉：不需要真把数据搬到高维，只要能在原空间里算出「高维内积」就够了（RBF 相当于把每个样本映射成一张以自己为中心的钟形函数）。所以支持向量机可以处理弯曲边界，代价是训练要存核矩阵——样本数上万就开始痛。",
        "朴素贝叶斯把「特征条件独立」这个明知道错的假设当卖点：训练只需数个数，几秒完成、小样本不崩、还天然适合高维稀疏的文本。它有效不是因为假设成立，而是因为错误在各维上相互抵消、且在排序任务上「概率不准但顺序对」就够了（这也是它在垃圾邮件与情感分类里长盛不衰的原因）。",
        "三个经典模型的选型直觉：可解释与快速基线用朴素贝叶斯/逻辑回归；小数据、边界清晰用 SVM（务必缩放）；近邻即语义、要能随手加新样本用 kNN。它们的共同前提是 ml3 的缩放与 ml2 的指标选择。"
      ],
      summary_en: [
        "kNN has no training phase: it defers learning to prediction time and votes over the k nearest neighbours, so the dataset is the model - dirt in the stored rows becomes dirt in the predictions.",
        "Choosing k is the bias-variance textbook example: k=1 gives a wriggly boundary that chases noise (high variance, low bias); raising k flattens it (variance down, bias up, and under imbalance it simply outputs the majority class). With two classes keep k odd to avoid ties.",
        "The distance is the assumption: Euclidean implies every dimension counts equally in comparable units, which is why unscaled income dominates age; Manhattan dulls outliers; cosine ignores magnitude and compares direction, which is what text wants. Picking a distance is declaring what 'similar' means.",
        "kNN's second weakness is the curse of dimensionality: as dimensions grow, all pairwise distances converge, so 'nearest' stops being near and labelling degenerates into a global majority vote. In high dimensions reduce first (PCA, ml4-5) or switch to a linear or tree model.",
        "SVM looks for the boundary that is far from both sides: maximising the margin means the solution rests on a handful of support vectors, which makes it sturdier than any boundary that merely separates. The soft-margin C trades 'never misclassify a point' against 'keep the boundary roomy', inverted from intuition (large C is stricter).",
        "The kernel trick's intuition: you never move the data to a higher space, you only need to compute the high-dimensional inner product in place (an RBF kernel is like mapping each sample to a bell function centred on itself). That buys curved boundaries at the cost of storing a kernel matrix, which starts hurting beyond tens of thousands of rows.",
        "Naive Bayes sells its knowingly false independence assumption as a feature: training only counts things, so it is instant, survives tiny data and handles high-dimensional sparse text natively. It works not because independence holds but because the errors average out across dimensions and ranking tasks only need the order right - which is why it still lives in spam and sentiment pipelines.",
        "Selection intuition for the three classics: readable fast baselines go to naive Bayes or logistic regression; small, cleanly separated data goes to SVM (scaled, always); 'nearest is meaning' and cheaply added new examples go to kNN. All three stand on ml3's scaling and ml2's metric choice."
      ],
      code: `import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

docs = ["free win claim now", "meeting tomorrow ten", "free win claim right now", "project report due",
        "win money free", "team sync meeting", "free prize click here", "quarterly report draft"]
y = np.array([1, 0, 1, 0, 1, 0, 1, 0])
# 中文没空格：把 analyzer 换成你的分词器，否则整句会变成一个词
vec = CountVectorizer(analyzer=lambda s: s.split(), min_df=1)
X = vec.fit_transform(docs)
Xtr, Xte, ytr, yte = train_test_split(X.toarray(), y, stratify=y, random_state=0)

nb = MultinomialNB(alpha=1.0).fit(Xtr, ytr)
lr = LogisticRegression(max_iter=2000).fit(Xtr, ytr)
# 概率远不如逻辑回归准，排序却常常差不多：这就是它在文本上能打的真正原因
print("NB probs", np.round(nb.predict_proba(X)[:, 1], 3))
print("LR probs", np.round(lr.predict_proba(X)[:, 1], 3))
print("NB AUC", round(roc_auc_score(y, nb.predict_proba(X)[:, 1]), 3),
      "LR AUC", round(roc_auc_score(y, lr.predict_proba(X)[:, 1]), 3))

# kNN 完全由距离决定，不缩放时量纲大的一列会独占话语权
raw = np.array([[800000.0, 25], [820000.0, 26], [30000.0, 61], [32000.0, 63]])
sc = StandardScaler().fit(raw)
lab = np.array([0, 0, 1, 1])
print("kNN no scaling", KNeighborsClassifier(1).fit(raw, lab).predict([[810000.0, 62]]))
print("kNN scaled", KNeighborsClassifier(1).fit(sc.transform(raw), lab).predict(sc.transform([[810000.0, 62]])))`,
      pit: "拿朴素贝叶斯的概率当置信度设阈值：它的独立性假设让各维证据被重复计入，输出概率会严重饱和（动辄 0.999），阈值 0.5 在文本上常常形同虚设。要卡置信度就改用逻辑回归或做校准（ml2-4），NB 只适合当排序器用。",
      pit_en: "Trusting naive Bayes probabilities as confidence: the independence assumption double-counts evidence, so outputs saturate (0.999 for fun) and a 0.5 threshold is often inert on text. Use logistic regression or calibrate (ml2-4) when you need a confidence level; NB deserves the role of ranker.",
      ex: {
        q: "为什么特征条件独立这个明显不成立的假设，在文本分类上还能给出可用结果？",
        a: "因为分类真正需要的是「哪个类分数更高」而不是精确概率：假设造成的偏差在各维上方向不一、在求和取 argmax 时大量抵消，排序通常仍然正确；同时它把参数数量从「词的组合数」降到「词表大小」，小样本也不会崩。",
        q_en: "Why does an obviously false independence assumption still work for text classification?",
        a_en: "Because classification needs 'which class scores higher', not exact probabilities: the bias the assumption creates points in different directions across dimensions and largely cancels in the summed argmax, so the ranking survives; meanwhile parameters shrink from word-combinations to vocabulary size, so small data does not break it."
      }
    },

    "ml4-4": {
      min: 11,
      summary: [
        "k-means 的目标是把样本分成 k 堆，使「每点到本簇均值的距离平方和」最小。它没有标签也没有对错信号，所以任何评估都是间接的：内部指标看形状，外部指标看是否有可用参考。",
        "迭代是「分配—重算中心」交替下降：每一步都保证目标不升，因此一定收敛，但收敛到的是局部最优。初始化决定结局，所以 k-means++ 用「离已选中心越远越可能被选」来拉开初始点，并且要跑多个种子取最优。",
        "k 没有客观正确答案：肘部法（看惯性下降的拐点）、轮廓系数、Gap statistic 都只是提示，真正定 k 的是「分成 k 堆之后业务能做什么」。同一个数据集在 k=3 与 k=5 之间通常都能自圆其说。",
        "两个硬假设决定它什么时候会错：簇是球状且各向同性（各维尺度相当），以及簇大小相近。细长形、密度不均、同心圆结构下它会切出毫无意义的边界，此时该用 DBSCAN（按密度）或高斯混合（按概率）。",
        "尺度与特征选择比算法更致命：不标准化时 k-means 完全按大尺度列聚类，你以为分出了「用户类型」，其实只分出了「消费金额高低」。先缩放，再剔除与业务无关的列，最后才谈 k。",
        "簇编号没有语义且不稳定：换种子、换实现版本，0 号与 3 号簇可能对调。所以「簇 2 是高价值人群」这类结论必须换成「用某几个特征描述这一簇」，并且每次重跑都要重新对齐（用中心点做匈牙利匹配）。",
        "结果解读要落在中心点上：把每簇的特征均值与整体均值并排画出来（雷达/热图），才能说清「这堆人不一样在哪」。只看簇规模或簇内平均距离，很容易把一个「什么都没有的剩余人群」当成一个特色人群。",
        "衔接：k-means 是本章第一个纯无监督零件，它和下一节的 PCA 共用同一个前提——先标准化，以及「维度即假设」的教训；PCA 处理的是「看」与「压」，不是「分」。"
      ],
      summary_en: [
        "k-means minimises the squared distance from each point to its cluster mean. It has no labels and no correctness signal, so every assessment is indirect: internal indices judge shape, external ones need a reference.",
        "The loop alternates assign and recompute, each step never raising the objective, so it always converges - but to a local optimum. Initialisation decides the outcome, which is why k-means++ spreads the starting centres (farther is likelier) and why you rerun with several seeds and keep the best.",
        "There is no objectively right k: the elbow in inertia, silhouette score and the gap statistic are hints only; the real question is 'what can the business do with k groups'. Between k=3 and k=5 the same data will usually support either story.",
        "Two hard assumptions decide failure: clusters are spherical and isotropic (comparable units per dimension), and of similar size. On elongated, density-uneven or concentric structure it draws meaningless boundaries - reach for DBSCAN (density) or a Gaussian mixture (probability) instead.",
        "Scaling and feature choice are more lethal than the algorithm: unstandardised, k-means clusters purely along the wide-scale column and you think you found 'user types' when you found 'big spenders versus small'. Scale, drop irrelevant columns, only then discuss k.",
        "Cluster ids carry no meaning and are unstable: a new seed or library version can swap cluster 0 with cluster 3. So 'cluster 2 is the high-value group' must be restated as 'this group differs in these features', and re-aligned on every rerun by matching centroids.",
        "Interpret through the centroids: plot each cluster's feature means against the global mean (radar or heatmap) to say what makes the group different. Reading only sizes or within-cluster distances easily turns 'the leftovers with no signal' into 'a distinctive segment'.",
        "Bridge: k-means is this chapter's first purely unsupervised part and shares its premise with the next section's PCA - standardise first, and remember dimensions are assumptions. PCA is about seeing and compressing, not about splitting."
      ],
      code: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

# 故意造一个细长结构：k-means 的球状假设会在这里露馅
X, _ = make_blobs(n_samples=600, centers=2, cluster_std=[1.0, 6.0], random_state=0)
X = np.column_stack([X[:, 0] * 100, X[:, 1]])
Z = StandardScaler().fit_transform(X)

for name, M in (("raw scale", X), ("standardised", Z)):
    km = KMeans(2, n_init=10, random_state=0).fit(M)
    # 同一个 k，尺度不同就切出完全不同的堆：这就是为什么先标准化不是洁癖
    print(name, "silhouette", round(silhouette_score(M, km.labels_), 3))

# k 只能给提示，业务解释落在中心点与各列均值之差上
for k in (2, 3, 4):
    km = KMeans(k, n_init=10, random_state=0).fit(Z)
    print("k", k, "silhouette", round(silhouette_score(Z, km.labels_), 3), "inertia", round(km.inertia_, 1))

# 每次重跑簇号可能对调，要用中心点重新对齐而不是记住编号
P = PCA(2).fit(Z)
print("two dims are for looking", P.explained_variance_ratio_.round(3))`,
      pit: "把簇编号当成稳定标签存进数据库下个月继续用：不同种子、不同 n_init、甚至不同 sklearn 版本都会让簇号对调，于是「上月属于簇 1、本月簇 3」被解读成「用户迁移了」。跨版本对齐要么按中心点匹配，要么改用「这簇的特征画像」当名字。",
      pit_en: "Storing cluster ids as stable labels in a database and reusing them next month: a new seed, a different n_init, even a different sklearn version swaps ids, so 'was cluster 1, now cluster 3' gets read as customer migration. Align by matching centroids, or name clusters by their feature profile instead.",
      ex: {
        q: "为什么 k-means 的惯性（inertia）不能用来直接选 k？",
        a: "因为惯性对 k 单调下降（k=n 时恒为 0），它衡量的是「分得多细」而不是「分得对不对」；肘部法只是看下降速度何时明显放缓，仍要结合轮廓系数与业务可执行性来判断。",
        q_en: "Why can k-means inertia not pick k by itself?",
        a_en: "Inertia falls monotonically with k and reaches 0 at k=n, so it measures how finely you cut, not whether the cut is right. The elbow only looks at when the drop slows, and still needs silhouette and business usability to be decided."
      }
    },

    "ml4-5": {
      min: 12,
      summary: [
        "PCA 做的事是换一组坐标：把数据投影到方差最大的方向上，依次取互相正交的主成分。它不关心标签，所以「方差最大」在类别真正由低方差方向区分时会挑错方向（经典反例：两类沿第二主成分分开）。",
        "不标准化直接做 PCA 是最常见的错误：第一主成分会被量纲最大的那一列独占，你以为提取了「主要信息」，其实提取了「谁的单位最大」。PCA 前必须缩放，除非各列本来就是同一单位。",
        "保留多少维看累计解释方差比是必要的但不充分：方差只说明「数据在这方向上散得开」，不说明「对预测有用」。正确做法是把维数当超参，在验证分数上比较（且缩放器与 PCA 都必须在 pipeline 内 fit）。",
        "PCA 不是特征选择而是特征构造：主成分是原始列的线性组合，不可读也不可逆（丢掉的维度回不来）。需要可解释或需要还原原列时，改用 NMF、因子分析或干脆做特征筛选，别拿 PCA 当「自动去冗余」。",
        "它的主要价值有三个：降到 2~3 维做可视化、给距离/梯度类模型去共线与降噪、以及压缩存储与加速。反过来，树模型通常不需要 PCA（它们自己会挑特征），稀疏文本上 PCA 也常常打不过直接把 TF-IDF 交给线性模型。",
        "白化（whiten）会把各主成分缩到同方差，等于假设「方差大的方向更重要」是假的；梯度类模型有时因此更稳，但也会放大噪声方向。用之前先问自己：我为什么要抹平方差？",
        "小表格数据优先经典模型而不是深度网络，这是「归纳偏置」问题而非「算力」问题：树的分裂假设、线性模型的平滑假设更贴合低维、异构、量纲混乱的表格；MLP 在表格上通常打不过梯度提升，这不是能力差距而是假设不匹配。",
        "选型速查（背下来）：要可解释与上线快→逻辑回归；表格 + 类别特征 + 缺失值→树与梯度提升；小样本 + 清晰边界→SVM（先缩放）；文本/超高维稀疏→朴素贝叶斯或线性模型；要看结构、去相关→PCA；要分人群→k-means（先缩放，再验证中心点）；以上评估统一走 ml3 的协议。"
      ],
      summary_en: [
        "PCA changes coordinates: it projects onto the directions of largest variance, taking orthogonal components in order. It never sees the labels, so when classes are actually separated along a low-variance direction it happily picks the wrong one - the classic counter-example being two classes split along the second component.",
        "Running PCA without scaling is the most common mistake: the widest-unit column monopolises the first component, so what you extracted is 'whose unit is biggest', not 'the main information'. Scale before PCA unless all columns already share a unit.",
        "Choosing dimensions by cumulative explained variance is necessary but not sufficient: variance says the data spread out that way, not that it helps prediction. Treat the count as a hyper-parameter compared on validation scores - with the scaler and PCA both fitted inside the pipeline.",
        "PCA constructs features rather than selecting them: components are linear combinations of the original columns, unreadable and irreversible (dropped dimensions cannot be recovered). If you need interpretability or reconstruction, use NMF, factor analysis or plain selection instead of treating PCA as automatic de-duplication.",
        "Its real payoffs are three: 2-3 dimensions for visualisation, decorrelation and denoising ahead of distance or gradient models, and cheaper storage and speed. Conversely trees usually do not want PCA (they select features themselves), and on sparse text PCA often loses to handing TF-IDF straight to a linear model.",
        "Whitening rescales every component to unit variance, which asserts that 'large variance is not more important'; gradient models sometimes train more stably for it, but it also amplifies noise directions. Ask first why you want variance removed.",
        "For small tabular data, classic models beat deep nets as a matter of inductive bias, not compute: tree splits and smooth linear fits match low-dimensional, heterogeneous, unit-mixed tables, and an MLP usually loses to gradient boosting there - a mismatch of assumptions, not of capability.",
        "Selection cheat-sheet worth memorising: explainability and a fast deployment path go to logistic regression; tabular data with categoricals and missingness goes to trees and gradient boosting; small data with a clean margin goes to SVM (scaled); text and ultra-sparse high dimensions go to naive Bayes or a linear model; structure and decorrelation go to PCA; segmentation goes to k-means (scale, then read centroids); and all of it is evaluated under ml3's protocol."
      ],
      code: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = load_iris(return_X_y=True)

# 不缩放时第一主成分几乎就是「谁的单位最大」，方差比例会严重偏科
p_raw = PCA(3).fit(X)
p_std = PCA(3).fit(StandardScaler().fit_transform(X))
print("raw", p_raw.explained_variance_ratio_.round(3))
print("std", p_std.explained_variance_ratio_.round(3))

# 维数当超参在验证分数上比：缩放与 PCA 都在流水线里，逐折重拟合
for d in (1, 2, 3, 4):
    m = make_pipeline(StandardScaler(), PCA(d), SVC(gamma="scale"))
    s = cross_val_score(m, X, y, cv=5)
    print("dims", d, "acc", round(s.mean(), 4), "std", round(s.std(), 4))
print("主成分是原列的线性组合", p_std.components_[:, 0].round(2))`,
      pit: "拿 PCA 之后的分数去证明「这些维度有意义」：主成分只是方差方向，前两个成分常常被某个高单位列或某批缺失模式带着走，画出来漂亮不等于业务能解释。要在降维后仍给结论，就把每簇/每类在各原始列上的均值差单独算一遍。",
      pit_en: "Using post-PCA scores as proof that 'these dimensions mean something': components are variance directions, and the first two often follow whichever column has the biggest unit or a missingness pattern - pretty plots are not an explanation. If a conclusion must survive, recompute each group's mean difference per original column.",
      ex: {
        q: "为什么 200 行的表格数据不该上深度学习？",
        a: "因为深度网络的假设（平滑、局部可线性化、需要大量样本估计参数）与低维异构表格不匹配，样本不够时它只能记住行；树与线性模型的先验更强、参数更少，同样数据下更稳、更快也更能解释。数据上万行、且是非结构化的图文本时，网络的优势才真正出现。",
        q_en: "Why not use a deep network on 200 rows of tabular data?",
        a_en: "Because a network's assumptions (smoothness, local linearisability, many parameters to estimate) clash with low-dimensional heterogeneous tables, and without enough rows it just memorises. Trees and linear models start from stronger priors with fewer parameters, so on the same data they are more stable, faster and readable. Networks earn their place at tens of thousands of rows and with unstructured text, images or audio."
      }
    },

    "ml4-6": {
      title: "综合重构：一张能为自己辩护的选型表",
      title_en: "Synthesis: A Model-Choice Table That Defends Itself",
      min: 15,
      target: "面对新数据能在十分钟内说出候选模型、各自的假设与被拒原因，并用同一套交叉验证协议给出可复现的比较结果。",
      target_en: "Given new data, name the candidate models within ten minutes, state each one's assumption and why it was rejected, and produce a reproducible comparison under one cross-validation protocol.",
      summary: [
        "选型四问（决定候选池）：需要向外推吗（树系不行，ml4-1）？需要逐条解释吗（要就留线性/浅树）？数据是低维异构表格还是高维稀疏文本（前者给梯度提升，后者给线性/朴素贝叶斯）？样本量与上线延迟允许吗（kNN 预测时要算距离，SVM 训练存核矩阵）。",
        "一条固定比较流程：把候选模型写进一个字典（每个都是一条 pipeline：缩放/编码 + 模型）→ 用同一个 StratifiedKFold 与同一组打分指标 → 全部跑完再比较 → 只允许一次测试集验收。「换模型顺便换预处理」是最常见的不公平比较。",
        "「集成一定更强」是错误结论的头号来源：bagging 只在高方差模型上有效（把深树换成桩树，森林比单棵还差）；boosting 对噪声标签敏感，脏标签会被反复拟合；把两个相关性极高的模型平均，几乎什么也没降。先问成员差异从哪来，再谈集成。",
        "复盘本章翻车点：树去外推价格、kNN 没缩放、高维直接用 kNN、SVM 在十万行上硬训、朴素贝叶斯的概率当置信度、k-means 未缩放、PCA 未缩放就当「主要信息」、森林关掉 bootstrap、boosting 只调小学习率不加树。每一条都会给出一个「看着合理其实错」的数。",
        "把评估口径钉死再谈模型：指标要与业务对齐（ml2-3）、划分要与数据结构对齐（ml3-1/2）、缩放与编码要进 pipeline（ml3-4）。这三件事没做时，「模型 A 比 B 好」多半只是噪声或泄漏的排序。",
        "动手收口：同一份数据上跑逻辑回归 / 随机森林 / 梯度提升 / kNN 四件套，并故意各犯一次错（不缩放、深度放开、关掉 bootstrap、k=1）；看着分数一格一格掉下去，比读十遍「注意尺度」有效。",
        "指向 dl1：经典模型的限制很明确——特征要人来造、形式要人来选、不能从原始像素与文本里直接学。神经网络换掉的就是这两条假设：表示由梯度一起学出来。带着「同一套评估协议」的纪律进 dl，你会少踩一半坑。"
      ],
      summary_en: [
        "Four questions decide the candidate pool: must predictions extrapolate beyond the observed range (trees cannot, ml4-1)? Must each case be explained (then keep linear models or shallow trees)? Is the data low-dimensional heterogeneous tables or ultra-sparse text (gradient boosting versus linear/naive Bayes)? Do row count and latency allow it (kNN pays at prediction time, SVM pays for storing a kernel matrix)?",
        "One fixed comparison flow: put candidates in a dictionary where each entry is a pipeline (scale/encode plus model), run them all on one StratifiedKFold with one scorer set, compare only after everything has run, then spend the test set exactly once. Swapping preprocessing whenever you swap models is the commonest unfair comparison.",
        "'Ensembles are always stronger' is the leading source of wrong conclusions: bagging only helps high-variance members (swap deep trees for stumps and the forest loses to one tree); boosting re-fits noisy labels and will happily memorise them; averaging two near-identical models reduces almost nothing. Ask where member diversity comes from before you ensemble.",
        "Failure retrospective for this chapter: a tree extrapolating a price, kNN unscaled, kNN in high dimensions, SVM trained on a hundred thousand rows, naive Bayes probabilities used as confidence, k-means unstandardised, PCA unstandardised then called 'the main information', a forest with bootstrap off, a boosted model with a smaller rate and no extra trees. Each yields a number that looks plausible and is wrong.",
        "Nail the evaluation before discussing models: the metric must match the business (ml2-3), the split must match the data structure (ml3-1 and ml3-2), and scaling and encoding must live in a pipeline (ml3-4). Without those three, 'model A beats B' is usually just the ranking of noise or leakage.",
        "Hands-on closing: run logistic regression, random forest, gradient boosting and kNN on one dataset and break each on purpose once (no scaling, unlimited depth, bootstrap off, k=1). Watching the score fall notch by notch teaches 'mind the units' better than reading it ten times.",
        "Towards dl1: the limits of classic models are explicit - a human builds features and picks the form, and nothing can be learned straight from raw pixels or text. A network drops exactly those two assumptions and lets gradients learn the representation. Carry the discipline of one fixed protocol into dl and you skip half the pitfalls."
      ],
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = make_classification(n_samples=5000, n_features=12, weights=[0.9, 0.1], random_state=0)
cv = StratifiedKFold(5, shuffle=True, random_state=0)

# 同一个协议下比较：每个候选都自带预处理，谁都不许偷看测试集
cands = {
    "logreg": make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),
    "gaussNB": make_pipeline(StandardScaler(), GaussianNB()),
    "knn1": make_pipeline(StandardScaler(), KNeighborsClassifier(1)),
    "forest": RandomForestClassifier(n_estimators=200, random_state=0),
    "gbdt": HistGradientBoostingClassifier(random_state=0),
}
for name, m in cands.items():
    s = cross_val_score(m, X, y, cv=cv, scoring="roc_auc")
    print(name, round(s.mean(), 4), round(s.std(), 4))

# 反例：kNN 不缩放会掉多少分，跑一次比讲十遍都管用
raw_knn = cross_val_score(KNeighborsClassifier(1), X, y, cv=cv, scoring="roc_auc")
print("knn unscaled", round(raw_knn.mean(), 4))`,
      pit: "在两个模型之间「谁分数高就选谁」而忽略成本与稳定性：森林比逻辑回归高 0.003，但线上要跑几百棵树、每次预测几十毫秒，且不可解释；kNN 分数漂亮却要维护全量样本库。把延迟、维护成本、可解释要求写进同一张表一起打分，否则你会选出「测试集最好看、上线最痛苦」的那个。",
      pit_en: "Picking whichever model scores higher while ignoring cost and stability: a forest beats logistic regression by 0.003 but needs hundreds of trees served, tens of milliseconds per call and no explanation; kNN looks great and forces you to keep the whole training set online. Put latency, maintenance and explainability in the same table, or you will ship the prettiest and most painful option.",
      ex: {
        q: "为什么把两个单模型分数几乎相同的模型做平均，常常一点提升都没有？",
        a: "因为集成的收益取决于成员误差的不相关性：两个模型若在同一批样本上一起错（同一份数据、同一组特征、同一种假设），它们的错误高度共线，平均后偏差不变、方差也几乎没降。有效的异质集成要么换假设（树 + 线性）、要么换数据视角（不同特征子集或不同时间窗）。",
        q_en: "Why does averaging two models with nearly identical scores often produce no gain at all?",
        a_en: "Because ensemble gains depend on uncorrelated member errors: two models that fail on the same rows - same data, same features, same assumption - have highly collinear errors, so averaging removes neither bias nor much variance. A useful heterogeneous ensemble changes the assumption (trees plus linear) or the view of the data (different feature subsets or time windows)."
      }
    }
  },

  /* ---------- 题库：对准本批新增知识点，每章 4 题（选择/判断/填空混排） ---------- */
  quizAdd: {
    ml3: [
      {
        q: "下面四个操作里，哪一个不会引入数据泄漏？",
        o: ["先在全量数据上做标准化，再划分训练/测试", "在交叉验证每一折内部，只用训练部分拟合缩放器", "先对整张表做目标编码，再切分数据", "先对全量数据过采样再划分"],
        a: 1,
        why: "只要 fit 见过测试折的信息就构成泄漏。把缩放器放进 pipeline、由交叉验证在每折内部重拟合，是唯一不会偷看的写法；其余三项都在用全量统计量。",
        q_en: "Which operation does NOT introduce data leakage?",
        o_en: ["Standardise the full table first, then split into train and test", "Inside each CV fold, fit the scaler on the training part only", "Target-encode over the whole table, then split", "Oversample the full table, then split"],
        why_en: "Any fit that has seen test-fold information is leakage. Putting the scaler in a pipeline so cross-validation refits it per fold is the only honest option here; the other three all use statistics computed over everything."
      },
      {
        q: "病人多次复诊的记录要评估模型泛化，最合适的切分是？",
        o: ["随机 5 折 KFold", "分层 StratifiedKFold", "按病人分组的 GroupKFold", "按记录时间倒序随机抽样"],
        a: 2,
        why: "同一病人的多条记录高度相关（近重复），必须整进整出，否则训练折里藏着测试折病人的另一条记录，分数与线上无关。分层只保证类别比例，不解决分组问题。",
        q_en: "Repeated follow-up visits per patient: which split best measures generalisation?",
        o_en: ["Random 5-fold KFold", "StratifiedKFold on the label", "GroupKFold grouping by patient", "Random sampling ordered by visit time"],
        why_en: "Rows from one patient are near-duplicates of each other, so they must travel together; otherwise the test patient also sits in training and the score bears no relation to production. Stratifying only balances labels and does not fix grouping."
      },
      {
        q: "判断：交叉验证得到的平均分数可以直接当最终泛化性能报告，不需要独立测试集。",
        type: "judge", a: 1,
        why: "不对。你在 CV 上选模型、选超参、选特征，这个均值就带上了乐观偏差（相当于对同一份数据反复挑最大值）。CV 负责选型，最终结论要由一次独立的测试集给出。",
        q_en: "True or false: the cross-validation mean can be reported as final generalisation performance with no separate test set.",
        why_en: "False. Selecting models, hyper-parameters and features on that CV injects optimism (repeatedly taking a maximum over the same data). CV chooses; the final number must come from one untouched test set."
      },
      {
        q: "sklearn 的 LogisticRegression 默认使用 L2 正则，参数 C 越 ______，正则惩罚越强。",
        type: "fill", ans: ["小", "越小", "small", "smaller"],
        why: "强度由 1/C 控制：C 越小惩罚越强，方向和直觉相反。这也是很多人「以为在用无正则模型、其实被强正则压着」的原因。",
        q_en: "sklearn's LogisticRegression uses L2 by default; the ______ C is, the stronger the penalty.",
        why_en: "Strength is set by 1/C: the smaller C, the stronger the penalty - inverted from intuition, which is why people believe they run an unpenalised model while a strong penalty quietly shrinks it."
      }
    ],
    ml4: [
      {
        q: "关于 bagging 与 boosting，下列说法正确的是？",
        o: ["两者都在降偏差，只是速度不同", "bagging 主要降方差、boosting 主要降偏差，所以 bagging 要用高方差的深树，boosting 常用弱学习器", "两者都在降方差", "boosting 对噪声标签天然免疫"],
        a: 1,
        why: "bagging 靠「成员各错各的」抵消方差，成员必须够强够敏感；boosting 逐步拟合残差、持续加容量压偏差，因此对标签噪声敏感，需要学习率与早停牵制。",
        q_en: "Which statement about bagging and boosting is correct?",
        o_en: ["Both reduce bias and differ only in speed", "Bagging mainly reduces variance and boosting mainly reduces bias, so bagging wants high-variance deep trees while boosting usually uses weak learners", "Both reduce variance", "Boosting is naturally immune to noisy labels"],
        why_en: "Bagging cancels variance by letting members be wrong in different ways, which needs sensitive, strong members; boosting keeps adding capacity along the residual direction and is therefore exposed to label noise, which is why the learning rate and early stopping constrain it."
      },
      {
        q: "用训练区间之外的价格做预测时，树模型会怎样？",
        o: ["沿已有趋势继续外推", "给出训练集中最大分区对应的值，不会超过训练范围", "报错拒绝预测", "自动退化为线性模型"],
        a: 1,
        why: "树的叶子只能返回训练时见过的均值，落在训练范围之外的样本只会重复最边上的那一区，于是大值一律被低估。需要外推时要用能沿趋势走的形式。",
        q_en: "What does a tree model do when predicting prices outside the training range?",
        o_en: ["Extrapolates along the existing trend", "Returns the value of the outermost training bucket, never beyond the training range", "Raises an error", "Falls back to a linear model"],
        why_en: "A leaf can only emit means it saw in training, so anything past the edge repeats the outermost bucket and large values are systematically underestimates. Extrapolating tasks need a form that follows the trend."
      },
      {
        q: "判断：随机森林把 bootstrap 关掉（bootstrap=False）后，200 棵树的方差会降得更多。",
        type: "judge", a: 1,
        why: "相反。行抽样是成员多样性的主要来源之一，关掉它只剩列随机性，几百棵树高度相关，投票抵消不了误差，方差降不下来——这正是 bagging 失效的典型配置错误。",
        q_en: "True or false: setting bootstrap=False in a random forest reduces the variance of 200 trees even more.",
        why_en: "The opposite. Row sampling is a main source of member diversity; without it only column randomness remains, the trees become highly correlated and voting cancels nothing - a textbook bagging misconfiguration."
      },
      {
        q: "梯度提升中，把 learning_rate 从 0.1 调到 0.03 时，必须同时增大 ______ 的数量，否则会欠拟合。",
        type: "fill", ans: ["树", "树数", "树的个数", "n_estimators", "boosting 轮数"],
        why: "学习率与树数是跷跷板：每一步变小就必须走更多步。只调小学习率而不加树，等于把步子缩小又提前收手，测试分数反而下降。",
        q_en: "In gradient boosting, lowering learning_rate from 0.1 to 0.03 requires increasing the number of ______, or the model underfits.",
        why_en: "Rate and tree count are a seesaw: shorter steps need more of them. Shrinking the rate without adding trees is taking smaller steps and stopping earlier, so the test score falls."
      }
    ]
  },

  /* ---------- 词典：评估与经典模型段，分类沿用现有四类 ---------- */
  terms: [
    { term: "数据泄漏", term_en: "Data Leakage", cat: "评测与安全",
      short: "评估数据的信息提前进了训练，让分数虚高。",
      short_en: "Evaluation information reaching training early, inflating the score.",
      detail: ["最常见的形式不是「偷看答案」，而是先做缩放/编码/填补再划分。", "线下与线上落差集中在最初几个版本，是泄漏被修掉的典型征兆。"],
      detail_en: ["The commonest form is not peeking at answers but preprocessing - scaling, encoding, imputing - before the split.", "An offline-online gap concentrated in the earliest versions usually means leakage was being removed, not drift."],
      vs: "过拟合是「记住了噪声」，泄漏是「提前看过考卷」。",
      vs_en: "Overfitting memorises noise; leakage reads the exam paper beforehand." },
    { term: "交叉验证", term_en: "Cross-Validation", cat: "评测与安全",
      short: "把数据切成 k 折轮流当验证，报均值也报波动。",
      short_en: "Rotate k folds as validation and report mean plus spread.",
      detail: ["折的形状要匹配数据结构：分层、分组、按时间切各有适用场景。", "调参发生在内层折，外层折只负责报告「这套流程」的能力。"],
      detail_en: ["Fold shape must match data shape: stratified, grouped and time-ordered each have their place.", "Tuning lives in the inner loop; the outer loop only reports what the whole recipe earns."],
      vs: "交叉验证用来选模型，测试集用来报结论。",
      vs_en: "Cross-validation chooses the model; the test set reports the conclusion." },
    { term: "目标编码", term_en: "Target Encoding", cat: "训练与数据",
      short: "用类别内的标签均值替换类别取值。",
      short_en: "Replacing a category level with its label mean.",
      detail: ["对树模型常有效，但标签被写进了特征，必须 out-of-fold 并加平滑。", "高基数列用它最容易造出「单变量 AUC 接近 1」的假象。"],
      detail_en: ["Often strong with trees, but it writes labels into features, so it needs an out-of-fold scheme and smoothing.", "On high-cardinality columns it is the quickest way to manufacture a near-1 univariate AUC."],
      vs: "one-hot 只表示身份，目标编码把标签信息搬进特征。",
      vs_en: "One-hot encodes identity; target encoding moves label information into the feature." },
    { term: "特征工程", term_en: "Feature Engineering", cat: "训练与数据",
      short: "把领域知识与原始结构变成模型能用的列。",
      short_en: "Turning domain knowledge and raw structure into usable columns.",
      detail: ["三个合法来源：领域规则、变换与组合、从原始结构抽取。", "任何派生列的拟合步骤都要进 pipeline，否则就是一次泄漏。"],
      detail_en: ["Three legitimate sources: domain rules, transforms and combinations, extraction from raw structure.", "Every fitting step a derived column needs must live in the pipeline, or it is leakage."],
      vs: "特征工程改「输入」，模型选型改「假设」。",
      vs_en: "Feature engineering changes the inputs; model choice changes the assumption." },
    { term: "置换重要性", term_en: "Permutation Importance", cat: "评测与安全",
      short: "打乱一列，看验证分数掉多少来衡量它的贡献。",
      short_en: "Scramble a column and measure how far the validation score falls.",
      detail: ["抓得到非线性与交互，比系数和树的重要性更可用作结论。", "相关特征会互相摊薄功劳，且需要多次重跑，成本较高。"],
      detail_en: ["It catches non-linearity and interaction, making it a better basis for conclusions than coefficients or split counts.", "Correlated features dilute each other's credit, and the repeats cost compute."],
      vs: "树的重要性数分裂次数，置换重要性看性能损失。",
      vs_en: "Tree importance counts splits; permutation importance measures lost performance." },
    { term: "bagging", term_en: "Bagging", cat: "训练与数据",
      short: "让多个高方差模型各自看数据子集，再投票平均。",
      short_en: "Many high-variance models each see a data subset, then vote or average.",
      detail: ["主要降方差，前提是成员之间误差互不相关，所以抽样与特征子集不能关。", "随机森林的 oob 分数来自每棵树没抽到的那批样本。"],
      detail_en: ["It buys variance reduction, which requires members that fail independently - so bootstrap rows and column subsets must stay on.", "A random forest's oob score comes from the rows each tree never sampled."],
      vs: "bagging 降方差靠并行投票，boosting 降偏差靠串行拟合残差。",
      vs_en: "Bagging lowers variance by voting in parallel; boosting lowers bias by fitting residuals in series." },
    { term: "梯度提升", term_en: "Gradient Boosting", cat: "训练与数据",
      short: "一轮轮拟合当前模型的残差方向，把弱学习器叠强。",
      short_en: "Fitting the residual direction round after round, stacking weak learners into a strong model.",
      detail: ["学习率与树数是跷跷板，只调小前者不加后者会欠拟合。", "对噪声标签敏感，所以早停几乎是必需配置。"],
      detail_en: ["Learning rate and tree count form a seesaw; shrink one without growing the other and you underfit.", "It re-fits noisy labels, which is why early stopping is effectively mandatory."],
      vs: "随机森林是并行投票降方差，梯度提升是串行叠加降偏差。",
      vs_en: "A forest votes in parallel against variance; boosting adds in series against bias." },
    { term: "核技巧", term_en: "Kernel Trick", cat: "基础概念",
      short: "不算高维坐标，只算高维内积，从而学会弯曲边界。",
      short_en: "Compute high-dimensional inner products instead of coordinates, and curved boundaries appear.",
      detail: ["RBF 核相当于把每个样本映射成以自己为中心的钟形函数。", "代价是要存核矩阵，样本上万训练与预测都开始吃紧。"],
      detail_en: ["An RBF kernel is like mapping each row to a bell centred on itself.", "The price is a kernel matrix, which becomes costly past tens of thousands of rows."],
      vs: "核技巧改「相似度怎么算」，特征工程改「用什么列表示」。",
      vs_en: "Kernels change how similarity is computed; feature engineering changes which columns represent the data." },
    { term: "维数灾难", term_en: "Curse of Dimensionality", cat: "基础概念",
      short: "维度升高后样本变稀、距离趋同，近邻与密度类方法失效。",
      short_en: "As dimensions grow data thins out and distances converge, breaking neighbour and density methods.",
      detail: ["kNN 与 k-means 在高维上会退化成「几乎等距」，结果不再有意义。", "对策是先降维（PCA）或换不依赖距离的模型（树、线性）。"],
      detail_en: ["kNN and k-means degenerate in high dimensions because everything becomes roughly equidistant.", "Reduce first (PCA) or switch to models that do not rely on distance (trees, linear)."],
      vs: "维数灾难讲「距离失去意义」，共线性讲「方向互相补偿」。",
      vs_en: "The curse says distance stops meaning anything; collinearity says directions compensate each other." },
    { term: "袋外分数", term_en: "Out-of-Bag Score", cat: "评测与安全",
      short: "用每棵树没抽到的样本给森林打分，省一份验证集。",
      short_en: "Scoring the forest on rows each tree never sampled, saving a validation set.",
      detail: ["只描述「这个森林在其抽样之下」的表现，不适合当调参天梯。", "关掉 bootstrap 就没有 oob，小样本上它本身也抖动很大。"],
      detail_en: ["It describes the forest under its own sampling and should not become a tuning ladder.", "With bootstrap off there is no oob at all, and on small data it is noisy by itself."],
      vs: "oob 是森林的免费体检，交叉验证是流程的正式考试。",
      vs_en: "OOB is a free check-up for the forest; cross-validation is the formal exam for the recipe." }
  ],

  achievements: [
    { id: "leak_hunter", icon: "🕵️", name: "泄漏猎手", name_en: "Leakage Hunter",
      desc: "完成 ml3 · 模型评估与特征工程 全部课节", desc_en: "Finish every lesson of ml3 Evaluation & Feature Engineering",
      check: ["ml3"] },
    { id: "model_chooser", icon: "🧭", name: "模型选型师", name_en: "Model Chooser",
      desc: "完成 ml4 · 经典模型与集成 全部课节", desc_en: "Finish every lesson of ml4 Classic Models & Ensembles",
      check: ["ml4"] }
  ],

  /* ---------- 代码注释英文映射（英文模式下正文注释才不会漏中文） ---------- */
  codeComments: {
    "逐列做一次单变量体检：出现接近 1 的列，先怀疑泄漏再怀疑「找到了特征」": "a per-column univariate check: anything near 1 means suspect leakage before you suspect a discovery",
    "错：在全量数据上缩放，测试集的均值与方差已经进了训练": "wrong: scaling on the full table, so test means and variances already entered training",
    "对：缩放器放进流水线，每一折只在训练部分 fit": "right: the scaler lives in the pipeline and is fitted on the training part of each fold",
    "看均值也要看波动：两折 0.99 / 0.60 与五折都在 0.85 附近，含义完全不同": "read the spread too: 0.99 and 0.60 is not the same claim as five scores near 0.85",
    "时间序列只能按时间切：训练索引永远在验证索引之前，这才是「只用过去预测未来」": "time series must be cut by time: training indices always precede validation indices - that is 'predict the future from the past only'",
    "随机搜索：同样的预算能把每个维度扫开，网格搜不到": "randomised search: the same budget reaches every dimension, which a grid cannot",
    "20 个特征里只有 3 个真有用，其余是噪声：高维小样本最容易在这里翻车": "only 3 of 20 features are real, the rest noise: high-dimensional small samples fail here first",
    "不缩放就加正则，等于按量纲罚款；这里先标准化，让 lambda 只罚重要性": "penalising unstandardised data fines by unit; standardise first so lambda only fines importance",
    "记住：非零个数少不等于更准，稀疏只是可解释性上的收益": "remember: fewer non-zeros is not more accuracy; sparsity only buys interpretability",
    "差距可能只有千分之几，但方向永远是「前者更乐观」，而且它会随列数增多变大": "the gap may be a few thousandths, but the direction is always 'the first one is more optimistic', and it widens with column count",
    "先看一眼分布：一个极端值会不会把整列的尺度带走": "look at the distribution first: can a single extreme carry away the whole column's scale",
    "填补要放在缩放前面，并留一列指示位：缺失本身就是信息": "impute before scaling and keep an indicator column: missingness itself is information",
    "变换后的宽度：one-hot 与指示列都会加列，列名可以从 encoder 里取出来": "width after the transform: one-hot and the indicator both add columns, and names come from the encoder",
    "城市里有缺失：most_frequent 填补，同时 one-hot 要能接受训练时没见过的类别": "the city column has missings: impute most_frequent, and let one-hot accept levels never seen in training",
    "比值特征最容易踩小分母陷阱：1 次点击 1 次成交会变成「转化率 100%」": "ratio features invite the small-denominator trap: one click and one order becomes a 100% conversion rate",
    "收缩：把小流量行的转化率拉回整体均值，避免被个位数样本绑架": "shrinkage: pull low-traffic rows back to the global rate so single-digit samples cannot hijack the feature",
    "打乱一列看验证分数掉多少：这是「在这个模型眼里有没有用」的直接答案": "shuffle a column and watch the drop: the direct answer to 'does this model actually use it'",
    "调参发生在内层折里：外层分数才是「这套流程」的真实能力，而不是最优配置的特权": "tuning happens in the inner folds: the outer score is what the recipe earns, not the privilege of the best config",
    "对照：完全不调参的默认配置，多数时候差距小于你以为的「玄学提升」": "control: the untouched default - usually the gap is smaller than the magic improvement you imagined",
    "树只看每一列的排序，所以任何单调变换都不会改变结果": "a tree only reads the order within a column, so any monotone transform changes nothing",
    "深度放开：训练分数一定到 1，测试分数先升后降，那个「降」就是过拟合": "open up the depth: training reaches 1.0 while test rises then falls, and that fall is overfitting",
    "有放回抽样制造差异：关掉 bootstrap 后成员高度相关，方差降不下来": "sampling with replacement creates diversity; switch bootstrap off and the members correlate and variance stays",
    "学习率与树数是跷跷板：只把 lr 调小而不加树，等于提前收手": "rate and tree count are a seesaw: shrinking the rate without adding trees just stops early",
    "早停把树数交给数据决定，不用再猜": "early stopping lets the data choose the tree count instead of guessing",
    "中文没空格：把 analyzer 换成你的分词器，否则整句会变成一个词": "Chinese has no spaces: swap the analyzer for your tokenizer or a whole sentence becomes one term",
    "概率远不如逻辑回归准，排序却常常差不多：这就是它在文本上能打的真正原因": "its probabilities are far worse than logistic regression's, but the ranking is often close - the real reason it works on text",
    "kNN 完全由距离决定，不缩放时量纲大的一列会独占话语权": "kNN is pure distance, so unscaled the widest-unit column monopolises the vote",
    "故意造一个细长结构：k-means 的球状假设会在这里露馅": "build an elongated structure on purpose: k-means' spherical assumption breaks here",
    "同一个 k，尺度不同就切出完全不同的堆：这就是为什么先标准化不是洁癖": "same k, different scales, different groups - scaling first is not fussiness",
    "k 只能给提示，业务解释落在中心点与各列均值之差上": "k only hints; the business reading lives in centroid minus overall mean",
    "每次重跑簇号可能对调，要用中心点重新对齐而不是记住编号": "rerunning can swap cluster ids, so re-align by centroids instead of remembering numbers",
    "不缩放时第一主成分几乎就是「谁的单位最大」，方差比例会严重偏科": "unscaled, the first component is basically 'whose unit is biggest' and the variance ratios skew hard",
    "维数当超参在验证分数上比：缩放与 PCA 都在流水线里，逐折重拟合": "treat the dimension count as a hyper-parameter compared on validation: scaler and PCA both live in the pipeline and refit per fold",
    "同一个协议下比较：每个候选都自带预处理，谁都不许偷看测试集": "compare under one protocol: every candidate carries its own preprocessing, and nobody peeks at the test set",
    "反例：kNN 不缩放会掉多少分，跑一次比讲十遍都管用": "counter-example: how far unscaled kNN falls - one run beats ten lectures"
  }
};

window.DEEPEN_LAYERS && window.DEEPEN_LAYERS.push(DEEPEN_ML34);
