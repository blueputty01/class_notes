
# Completeness Axiom

The **completeness** axiom states that:
- **there are no holes in $\mathbb{R}$**
- **1::there are holes in $\mathbb{Q}$**
	$\mathbb{R}$ is also connected

# Bounds

A set $S \subseteq \mathbb{R}$ is bounded if **$\exists \alpha \in \mathbb{R}^{+}$ such that $\forall x \in S$, $|x| \leq \alpha$**
- If **$\forall x, x \leq M$** then it's bounded **above**
- If **2::$\forall x, m \leq x$** then it's bounded **3::below**

**Completeness** axiom: suppose **$S \subseteq \mathbb{R}$ is a nonempty subset, and bounded above**. Among all upper bounds $\beta$ of $S$, $\exists$ least (smallest) upper bound called a **supremum**, denoted **$\operatorname{sup}(S)$**
	eg: $(0, 1)$ $\sup({S}) = 1$, but $1 \neq \max(S)$
	since $S$ contains no maximal element
	$1 = \sup([0, 1]) = \max([0, 1])$

If $S \subseteq \mathbb{R}$ is bounded below, the **infimum**, denoted **$\inf(S)$**, is the **greatest lower bound of $S$**
	eg $0 = \inf((0, 1))$

Theorem: If $S \in \mathbb{R}$ is bounded **below**, then $\inf{(S)}$ exists. Proof using **completeness axiom**. 
	We consider the set obtained by "reflecting" the set $S$ about the number $0$; that is, we will consider the set $T \equiv \{x \in \mathbb{R} | -x \textrm{- x is in S}\}$. For any number $x, b \leq x$ iff $-x \leq -b$. Thus a number $b$ is a lower bound for $S$ if and only if the number $-b$ is an upper bound for $T$. Since the set $S$ has been assumed to be bounded below, it follows that $T$ is bounded above. The Completeness Axiom asserts that there is a least upper bound for $T$, which we denote by $c$. Since lower bounds of $S$ occur as negatives of upper bounds for $T$, the number $-c$ is the greatest lower bound for $S$.

Theorem: Let $S$ be nonempty, and $M$ is an upper bound of $S$ (or $m$ for lower bound). Then:
i. **$M = \sup{(s)} \iff \forall \epsilon > 0 \exists x_\epsilon \in S (x_{\epsilon} > M - \epsilon)$**
ii. **$m = \inf{(s)} \iff \forall \epsilon > 0 \exists x_\epsilon \in S (x_\epsilon < m + \epsilon)$**
	just rephrasing in mathematical symbols
	note: if $\epsilon = \frac{1}{n}$, then $\exists n \in \mathbb{N} \exists x_n \in S x_n > m - \frac{1}{n}$, and we get $\{x_n\}^\inf_{n=1}$ converging to $\sup{(s)}$
	![](z_attachments/Pasted%20image%2020250204164814.png)

## Proof

$S = (0, 1) \subseteq \mathbb{R}$. 
Prove that $0 = \inf{(S)}$:
+
General steps: 
i. show that  **$0$ is a lower bound**
ii. show that **1::$0$ is the largest lower bound**, ie **1::for any lower bound $\beta$ of $S$, $\beta \leq 0$**
+
To prove ii:
{{c3::
Let $\beta$ be a lower bound of $S$. For a proof by contradiction, suppose $\beta > 0$.
Case 1: $0 < \beta < 1$ 
Half of $\beta$ will be within $S$
+
Case 2: $\beta \geq 1$
$\frac{1}{2} \in S; \frac{1}{2} < \beta$
}}

---

i. $0 \leq 0 < s < 1$, where $s \in S$
ii. 

---

# Density

We say $\mathbb{S}$ is **dense** in $\mathbb{R}$ where $\mathbb{S} \subseteq \mathbb{R}$ if **for any interval $(a, b)$ $\exists x \in S \cap (a, b)$**.
	$\mathbb{Q}$ is dense in $\mathbb{R}$
	$\mathbb{R} \backslash \mathbb{Q}$ is dense in $\mathbb{R}$
	$\mathbb{Z}$ is not dense in $\mathbb{R}$ because from (5,6) there does not exist an integer
 
**Archimedean** Property of $\mathbb{R}$
i. **$\forall c > 0 \exists n \in \mathbb{N}, n > c$**
ii. **$\exists \epsilon > 0 \exists n \in \mathbb{N}, \frac{1}{n} < \epsilon$**
	proof sketch with $c = \frac{1}{\epsilon}$
	suppose $i$ is false
	$\neg(\forall c > 0 \exists n \in \mathbb{N}, n > c)$
	$\iff \exists c > 0 \forall n \in \mathbb{N}, n \leq c$, so $\mathbb{N}$ bonded above which is false, and thus a contradiction so supremum of $\mathbb{N}$ exists
	More details on the contradiction:
	Suppose ${\neg} \forall c>0\, \exists n\in\mathbb{N} (n>c)$. Then there exists some $c>0$ such that $n\le c$ for all natural numbers $n$. So $\mathbb{N}$ is bounded above. (Here naturally is the contradiction, but let's go back to to the axioms of $\mathbb{R}$ and do it "properly".) By the Completeness Axiom, $M = \sup(\mathbb{N})$ exists. So there exists some $n\in\mathbb{N}$ such that $n > M - 1/2$. But then $n+1 > M + 1/2 > M$, and since $n+1\in\mathbb{N}$ this contradicts the fact that $M$ is supposed to be an upper bound of $\mathbb{N}$.

## Proofs

$\mathbb{R} \backslash \mathbb{Q}$ is dense in $\mathbb{R}$
Fix $(a, b)$. **$\exists q\in\left(\frac{a}{\sqrt{2}},\frac{b}{\sqrt{2}}\right)\cap \mathbb{Q}$, and $q \sqrt{2} \in \left(a, b\right)$ and so $\in \mathbb{R} \backslash \mathbb{Q}$** 
	rational times irrational produces irrational

***

Triangle inequality: **$|a +b| \leq |a| + | b|$**
***

Reverse triangle inequality: **$||x| - |y|| \leq |x - y|$**

***

Proof that the set of rational numbers is dense in $\mathbb{R}$:
Consider the interval $(a,b)$.
**By Archimedean Property**, we can choose **c1::a natural number $n$** such that **c1::$\frac{1}{n} < b - a$, so $1 / n$ is less than the length of the interval $(a, b)$**
There is also **c2::an integer $m$** in the interval **$[nb - 1, nb)$**, which when rearranged gives: **c3::$b - \frac{1}{n} \leq m / n < b$**
We also know that $a = **b - (b - a) < b - 1 / n**$
Thus the rational number $\frac{m}{n}$ belongs to the interval $(a, b)$

***
