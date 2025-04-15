For a set $D$ of real numbers, the number $x_0$ is called a **limit point** of $\mathbb{D}$ provided that **there is a sequence of points in $D\ \{x_0\}$ that converges to $x_0$**.
	note that the limit points of $\mathbb{D}$ don't need to live in $D$
	examples:
	$D = (2,4)$; the limit points are $\{x | x \in [2,4]\}$
	$Q \subseteq \mathbb{R}$; limit points of $\mathbb{Q}$ are all $x \in \mathbb{R}$ because $\mathbb{Q}$ is dense in $\mathbb{R}$
	every $x_0 \in \mathbb{R}$ is a limit point of $\mathbb{R}$
	$D=\{5\}$ has no limit points
	$D = (0, 1) \cup \{5\}$ has limit points $x \in [0, 1]$

**All::All/Some** finite sets have no limit points
	can't get infinitely close

Let $f: D \rightarrow \mathbb{R}$. Let $x_0 \in \mathbb{R}$ be a **limit point** of $D$. Then **for any $\{x_n\}$ in $D\{x_0\}$ such that $x_n \rightarrow x_0$, if $\lim_{x_n \rightarrow x_0} f(x_n) = L$, $\lim_{x_n \rightarrow x_0} f(x_n) = L$::definition** .
	$L$ is the same for all sequences

If $x_0$ is not a limit point of $D$, then the limit $\lim_{x \rightarrow x_0} f(x)$ is **undefined::defined/undefined**
	![](z_attachments/Pasted%20image%2020250303121023.png)

$\epsilon-\delta$ definition for limit: $\lim_{x_n \rightarrow x_0} f(x_n) = L$ if **$\forall \epsilon > 0, \exists \delta > 0$ such that $\forall x \in D$ if $0 < | x - x_0 | < \delta$, then $|f(x) - L| < \epsilon$**
	the inequality $0 < |x - x_0|$ is used to bound $x \neq x_0$ 

$\{x_0\}$ is an **isolated point** of $D \subseteq \mathbb{R}$ if **$\exists r > 0$ such that the only points of $D$ in $(x_0 - r, x_0 + r)$ is $x_0$ itself**.

Theorem: Every $x_0 \in D$ is either a(n) **limit** point or a(n) **1::isolated** point of $D$.
Proof:
If $x_0$ is isolated, done.
Suppose $x_0$ is not isolated, so we need to prove that it is a limit point. 
**$\begin{aligned}&\neg(x_0 \mathrm{~isolated})\\&\iff\neg(\exists r>0,x\in(x_0-r,x_0+r)\implies x = x_0)\\&\iff\forall r>0,x\in(x_0-r,x_0+r)\land x\neq x_0\\&\mathrm{Let~}r=\frac1{n_1}\mathrm{~then~}\exists x_n\in D\mathrm{~st.~} x_n\in(x_0-\frac1{n},x_n+\frac1{n})\land(x_0\neq x_0)\end{aligned}$**
Thus $\{x_n\}$ is a sequence in $D\{x_0\}$ that converges to $x_0$, so $x_0$ is a limit point.

***
