Extreme Value Theorem (EVT):
Any continuous $f:D \rightarrow \mathbb{R}$, with $D$ **compact**, has a **maximum** and **1::minimum**.
+
Proof: 
WLOG we prove that $f$ has a maximum. (For minimum, consider $-f$) 
Need to show:
i. **$f$ is bounded above (so that $\sup(f(x))$ exists) $x \in D$**
ii. **$\exists x_0 \in D$ such that $f(x_0) = \sup(f(x))$.**
+
For i.: 
Suppose **$f$ is not bounded above BWOC**.
**3::So $\forall n\in N,\exists x_{n}\in D,f(x_{n})>n$ (definition)**
**3::$D$ compact $\implies \exists \{x_{n_j}\}$ such that $x_{n_j} \rightarrow x_0 \in D$ (Bolzano-Weierstrass)**
**3::$f$ is continuous $\implies f(x_{n_j}) \rightarrow f(x_0)$ (definition), which means that the sequence is bounded**
**3::However, $f(x_{n_j})>n_j$ (definition), meaning that $\{f(x_{n_j})\}$ is unbounded**
+
For ii.: 
**For each $n ∈ \mathbb{N}$ the value $M − 1/n$ is not an upper bound for $f(D)$, so there exists some $x_n ∈ D$ with $f(x_n) > M − 1/n$.**
In addition, **4::$f(xn) ≤ M < M + 1/n$ and so we have $M − 1/n < f(x_n) < M + 1/n$ or $|f(x_n) − M| < 1$, and $\{f(x_n)\} \rightarrow M$ by the Comparison Lemma.**
By **4::sequential compactness** choose a subsequence **4::$\{x_{n_i}\} \rightarrow x_0 ∈ D$**. 
Since **$\{f(x_{n_i})\}$ is a subsequence of ${f(x_n)}$ we also have $\{f(x_{n_i})\} \rightarrow M$**, but by continuity **$\{f(x_{n_i})\} \rightarrow f(x_0)$**.
Thus $f(x_0) = M$.
> recall in $\mathbb{R}$, compact $\iff$ closed and bounded
> we can't directly state that the sequence (not subsequence) is bounded because we don't know if it converges to an element in $D$

***
