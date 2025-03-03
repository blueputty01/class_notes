Let $\{n_k\}^\infty_{k=1}$ be a **strictly increasing sequence** in **1::$\mathbb{N}$**. $\{a_{n_k}\}^\infty_{k=1}$ is a **subsequence** of $\{a_{n}\}^\infty_{n=1}$.
> Consider the sequence $\{a_{n}\}_{n = 1}^{\infty} = \{0, 1, 2, 3, 4, 5, 6, 7, 8, ..\}$. Let $\{a_{n_{k}}\}_{k = 1}^{\infty} = \{1, 3, 5, 7,...\}$ be our subsequence. Here we have choose $n_{1} = 2, n_{2} = 4, n_{3} = 6, n_{4} = 8$. Note that $n_{1} < n_{2} < n_{3} < n_{4} < ...$ and $n_{k} = 2k$. Note that $\{1, 1, 1, ....\}$ would not be a valid subsequence since we can't repeat indices. Note that we could also define $\{a_{2k}\}_{k = 1}^{\infty} = \{1, 3, 5, 7, ...\}$. 

Relationship between indices and monotone increasing sequence of
natural numbers: **$n_k \geq k, \forall k \in \mathbb{N}$**
> proof by induction; $n_1 > 1 \implies n_{k+1} \geq k + 1$, etc

Theorem: If $\{a_{n}\}_{n\geq1}\rightarrow a$, then
**$\{a_{n_{k}}\}_{k\geq1\rightarrow a}$** for any subsequence.
Proof:
**$\forall\epsilon>0, \exists N\in\mathbb{N}, \forall k\geq N, |a_{k}-a|<\epsilon$. Since $n_{k}\geq k$ for all $k \in \mathbb{N}$, $\forall k \geq N$, $|a_{n_{k}}-a|<\epsilon$**

**Monotone Subsequence** Theorem:
**Every sequence in $\mathbb{R}$ has a monotone subsequence**
> Proof: see textbook; proof not important for class
> example: $\{\cos(n)\}_{n=1}^{\infty}$ has a monotone subsequence

**Bolzano-Weierstrass** Theorem
**Every bounded sequence contains a convergent subsequence** 
Proof: 
**Extract a monotone subsequence by monotone subsequence theorem. This subsequence is bounded by the monotone convergence theorem; thus the subsequence converges**

A set is **sequentially compact** if for any sequence $\{a_{n}\}_{n=1}^\infty$ in $S$ it **contains a subsequence $\{a_{n_k}\}_{n=1}^\infty$ such that $a_{n_k} \rightarrow a \in S$**

Theorem: In $\mathbb{R}$, a set $S$ is **sequentially compact** $\iff$ **$S$ is closed and bounded**.
Proof:
Backwards:
Suppose $S \subseteq \mathbb{R}$ is closed and bounded. 
**Let $\sum a_{n}\int_{n\geq1}$ be in $S$. Bolzano-Weierstrass says that there exists a convergent subsequence. By definition that the set is closed, the limit also belongs to $S$, and thus the set is sequentially compact.**
Forwards:
Suppose $S$ is sequentially compact. 
To prove it is closed, **suppose $\{a_n\}$ is in $S$ and converges to $a$. Then the subsequence must converge to $a$ as well, which we know is in the set by definition of sequentially compact.**
To prove it is bounded, **suppose not. For all $n$ there is some $a_n > n$. Every subsequence $a_n$ is unbounded and hence does not converge--contradiction.**

***
