Let $a$ and $b$ be real numbers with $a < b$. If $n$ is a natural number and **$a=x_0<x_1<\cdots<x_{n-1}<x_n=b$**, then $P=**1::\{x_{0},\ldots,x_{n}\}**$ is called a **partition** of the interval $[a, b]$.

The lower (Darboux) sum is $L(f,P)\equiv**\sum_{i=1}^nm_i(x_i-x_{i-1})**$
The upper (Darboux) sum is $U(f,P)\equiv**1::\sum_{i=1}^nM_i(x_i-x_{i-1})**$
Where $\begin{cases}m_i\equiv**1::\inf\{f(x)\mid x\mathrm{~in~}[x_{i-1},x_i]\}**\\\mathrm{and}\\M_i\equiv**1::\sup\{f(x)\mid x\mathrm{~in~}[x_{i-1},x_i]\}**&\end{cases}$
> ![](z_attachments/Pasted%20image%2020250325205245.png)

Lemma:
$f:[a,b]\rightarrow R$ is bounded, so $\forall x, m\leq f(x)\leq M$
**$m(b-a)\leq L(f,p)\leq U(f,p) \leq M(b-a)$::relationship between four areas**
+
Proof:
Have **$m \leq m_i \leq M_i \leq M$** for any partition $p_i$
So **2::$m\Delta x_{i}\leq m_{i}\Delta x_{i}\leq M_{i}\Delta x_{i}\leq M \Delta x_{i}$**
Thus **2::$\sum_{i=1}^{n}m\Delta x_{i}\leq\sum_{i=1}^{n} m_{i}Ax_{i}\leq\sum_{i=1}^{n} M_{i}Ax_{i}\leq\sum_{i=1}^{n} Mx_{i}$**
So $m(b-a)\leq L(f,p)\leq U(f,p) \leq M(b-a)$
	![](z_attachments/Pasted%20image%2020250325210217.png)

$P*$ is a **refinement** for any partition $P$ if $P*$ **contains all points of $P$ and possibly others**.
> $p=\{1,3,\pi,5\}$
> $p^{*}=\{1,3,\pi,3.5,5\}$
> ![](z_attachments/Pasted%20image%2020250325210440.png)


Theorem: 
Let $P*$ be a refinement of $P$. Then **$L(f,p)\leq L(f,p^{*})$** and **1::$U(f, p^*)\leq U(f,p)$**
> ie upper sums can only decrease and lower sums can only increase
> proof skipped
> logically: infimum can only go up, thus $L(f, p*)$ is larger
> ![](z_attachments/Pasted%20image%2020250325210649.png)

Lemma:
For any partitions $p_1$ and $p_2$, **$L(f,p_{1})\leq U(f,p_{2})$::relationship between $L(f,p_{1}), U(f,p_{2})$**
+
Proof:
**$P* = P_1 \cup P_2$ (common refinement)**
**$L(f,p_1) \leq L(f,p^{*})\leq U(f,p^{*})\leq U(f,p_2)$**

Definition: 
For $f:[a,b]\rightarrow \mathbb{R}$ (bounded)
The upper (Darboux) integral is **$\overline{\int_a^b}f\equiv\inf\{U(f,P)\}$, where $P$ is any partition of $[a, b]$**. 
The lower (Darboux) integral is **$\underline{\int_a^b}f\equiv\sup\{L(f,P)\}$, where $P$ is any partition of $[a, b]$**. 
> since $P$ is any arbitrary partition, this is equivalent to the Calc I limit definition for $\Delta x \rightarrow 0$

Lemma: 
**$L(f,p)\leq\underline{\int_{a}^{b}}f\leq\overline{\int_{a}^{b}}f\leq U(f,p)$::relationship between $L(f,p), \underline{\int_{a}^{b}}f, \overline{\int_{a}^{b}}f, U(f,p)$**
+
Proof: 
$L(f,0)\leq\underline{\int_a^b}f$ by definition of sup
$\overline{\int_a^b} f \leq U(f,p)$ by definition of inf
Prove $\underline{\int_{a}^{b}}\leq\overline{\int_{a}^{b}}$:
for any $p_1$, $p_2$, $L(f,p_{1})\leq U(f,p_{0})$
**$\sup L(f,p_1)\leq U(f,p_2)$**
**$\sup_{p_1}L(f,p_1)\leq\inf_{p_2}L(fp_2)$**
So $\underline{\int_{a}^{b}}\leq\overline{\int_{a}^{b}}$

If **$\underline{\int_{a}^{b}}=\overline{\int_{a}^{b}}$**, we say $f$ is **integrable** and write $\int_a^b f$ for the common value.
> this is the "signed area" under $f$ on $[a,b]$
> example: $f(x)=\begin{cases}1 & x\in[0,1] \cap Q\\0 & \mathrm{else}\end{cases}$
> $\overline{\int_{0}^{1}}f=1$ since $M_i = 1$ for any $i$
> $\underline{\int_{0}^{1}}f=0$ since $m_i = 0$ for any $i$
> $0 \neq 1$, so $f$ is not Riemann-Darboux integrable

***
