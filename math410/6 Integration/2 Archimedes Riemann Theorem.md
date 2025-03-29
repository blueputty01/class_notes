Let the function $[a,b]{:}\mathbb{R}\to\mathbb{R}$ be bounded and for each natural number $n$ let $P_n$ be a partition of its domain $[a, b]$. 
Then $\{P_n\}$ is said to be an **Archimedean sequence of partitions** for $f$ on $[a, b]$ provided that $\lim_{n\to\infty}\left[U(f,P_n)-L(f,P_n)\right]=0$. 

**Archimedean-Riemann Theorem::Theorem Name**:
A bounded function $f$ on $[a, b]$ is **integrable** $\iff$ **2::there is a sequence of partitions ${P_n}$ on $[a, b]$ such that $\lim_{n\to\infty}\left[U(f,P_n)-L(f,P_n)\right]=0$**. 
Additionally, for any such sequence of partitions, **2::$\operatorname*{lim}_{n\rightarrow\infty}U(f, P_{n})=\operatorname*{lim}_{n\rightarrow\infty}L(f, P_{n})=\int_{a}^{b}f$**
+
Proof:
Backward direction: 
Suppose an Archimedean sequence of partitions $\{P_n\}$
We know **$\overline{\int_{a}^{b}}f\leq U(f,p_{n})$** and **3::$\underline{\int_{a}^{b}}f\geq L(f_,p_{n})$**
Thus **3::$0 \leq \overline{\int_{a}^{b}} f-\underline{f_{a}^{b}} f\leq U(f,p_{n})-L(f,p_{n})\rightarrow0$**
Forward direction:
Suppose $\int^b_a f$ exists. Thus **$\overline{\int_{a}^{b}} f$** and **4::$\underline{\int_{a}^{b}} f$** exist and are **4::equal**
$\overline{\int_{a}^{b}}f=\inf U(f,p)$
$\underline{\int_{a}^{b}} f=\sup L(f,p)$
By definition of inf and sup,
**$\exists P_{n}~\mathrm{s.t.}~ U(f, P_{n})<(\overline{\int_{a}^b} f)+\frac{1}{n}=\int_{a}^{b}f+\frac{1}{n}$**
**4::$\exists P'_{n}~\mathrm{s.t.}~ L(f, P'_{n})>(\underline{\int_{a}^b} f)-\frac{1}{n}=\int_{a}^{b}f+\frac{1}{n}$**
Let $Q_n = **4::P_n \cup P'_n**$ be the **4::common refinement**
**4::$\int_{a}^{b}f+\frac1n>U(f,P_{n})\geq U(f,Q_{n})$**
**4::$\int_{a}^{b}f-\frac{1}{n}<L(f,P'_{n})\leq L(f,Q_{n})$**
So $0\leq U(f,Q_{n})-L(f,Q_{n})\leq\left(\int_{a}^{b}f+\frac{1}{n}\right)-\left(\int_{a}^{b}f-\frac{1}{n}\right)$
Which goes to $0$ as $n \rightarrow \infty$ 
So $\operatorname*{lim}_{n\rightarrow\infty}\left(U(f, P_{n})-L(f, P_{n})\right)=0$
> in other words: a bounded function $f$ on $[a, b]$ is integrable $\iff$ there is an Archimedean sequence of partitions for $f$ on $[a, b]$, and, for any Archimedean sequence of partitions, $\operatorname*{lim}_{n\rightarrow\infty}U(f, P_{n})=\operatorname*{lim}_{n\rightarrow\infty}L(f, P_{n})=\int_{a}^{b}f$
> this theorem is attributed to Archimedes because he came up with the strategy to compute the area of a nonpolygonal geometric object by constructing the outer and inner polygonal approximations

Theorem: Step functions **are::are/are not** integrable
> A function $f: [a, b] \rightarrow \mathbb{R}$ is called a *step function* provided that there is a partition $P* = \{z_o, \cdots , z_k\}$ of its domain $[a, b]$ and numbers $c_1, \cdots , c_k$ such that for $1 \leq i \leq k$, $f(x) = c_i$ for all $x$ in the open partition interval $(z_{i -1}, z_i)$
> Archimedes-Riemann Theorem can be used to verify this (proof skipped in class)

Theorem: Any monotone $f: [a,b] \rightarrow \mathbb{R}$ is integrable. 
+
Proof:
**WLOG suppose monotone increasing**
Let **1::$P_n = \{x_i\}$**, where **1::$\Delta x_i = \frac{b-a}{n}$ (constant for each $n$**
Thus **$0\leq U(f,P_{n})-L(f,P_{n})$**
$=**\sum_{i=1}^{\infty}[\sup\limits_{[x_{i-1},x_{i}]} f(x)-\inf\limits_{[x_{i-1},x_{i}]} f(x)]\Delta x_{i}**$
$=**\sum_{i=1}^{n}(f(x_{i})-f(x_{i-1}))\Delta x_{i}**$
The first term simplifies to **$f(x_n)-f(x_0)=f(b)-f(a)$** 
The second term becomes **$0$** as $n \rightarrow \infty$
Thus $U(f, P_n) - L(f, P_n)$ goes to $0$ as $n \rightarrow \infty$
So $\{P_n\}$ is an Archimedean sum of partitions

$\sum_{i=1}^{n-1}(a_i-a_{i+1})=**(a_1-a_n)**$
> $=(a_1-a_2)+(a_2-a_3)+...+(a_{n-2}-a_{n-1})+(a_{n-1}-a_n)$


***
