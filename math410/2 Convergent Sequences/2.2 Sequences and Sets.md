# Boundedness

## Definitions

$\{x_n\}$ is **bounded** if **$\exists M\in \mathbb{R}^{+} |x_{n}|\leq M, \forall n, -M\leq x_{n}\leq M$**.

Theorem: If $\{x_n\}_{n\geq1}$ converges, then $\{x_n\}_{n\geq1}$ is **bounded**.
> note that the converse is not true; $-\{(-1)^n\}$ is bounded but diverges 
> $-\{\cos(n)\}$ is also an example, but it's harder to prove 

## Proofs

Proof for theorem "If $\{x_n\}_{n\geq1}$ converges, then $\{x_n\}_{n\geq1}$ is bounded": 
{{c1::Take convergent sequence and use triangle inequality to isolate the value it converges to.
Due to the definition of convergence, this is only a valid inequality for $n \geq N$, thus $M$ should be the max of this and the elements with smaller indices}}
> Assume that $\{x_{n}\}$ is a convergent sequence, that is $x_{n} \rightarrow x_{0}$. $|x_{n}| = |x_{n} - x_{0} + x_{0}| \leq |x_{n} - x_{0}| + |x_{0}| < \epsilon + |x_{0}|$ for all n $\geq N$. Note that we need an upper bound for $n = 1, 2, 3, ... N -1$. Let $M = \max\{\epsilon + |x_{0}|, |x_{1}|, |x_{2}|,...,|x_{N - 1}| \}$. Then $(\forall n \in \mathbb{N})[|x_{n}| \leq M]$ $\blacksquare$

Proof of divergence for $-\{(-1)^n\}$:
**Assume, for contradiction, that $x_n$ converges**.
Thus, $\forall\varepsilon>0\exists n\in N\quad\forall n\geq N,\quad|(-1)^{n}-x|<\varepsilon$
There is a contradiction for when $n$ is even and when $n$ is odd for the allowable value of x.
> ![](z_attachments/proof%20of%20divergence.png)

# Sequential Denseness of the Rationals

A set $S$ is **sequentially dense** in $\mathbb{R}$ if **$\forall x \in \mathbb{R}, \exists \{S_n\}_{n \geq 1}$ in $S$ such that $S_n \rightarrow x$**
> ex: $\mathbb{Q}$ is sequentially dense in $\mathbb{R}$
> for $\pi$, we can have the sequence 3, 3.1, 3.14, 3.141, etc

Theorem: $S$ is dense in $\mathbb{R} \iff S$ is **sequentially dense in $\mathbb{R}$**
Proof (forward direction only): 
**$n$, the sequence index, can be the bounds for its corresponding value through
$\frac{1}{n}$.** Use **Comparison** Lemma to finally achieve the statement $\lim_{n \rightarrow \infty}S_{n} = x$.
> Suppose that S is dense in $\mathbb{R}$. Fix any $x \in \mathbb{R}$. For any $n \in \mathbb{N}$, $\exists S_{n} \in (x - \frac{1}{n}, x + \frac{1}{n})$ by the density of S. So $(\forall n \in \mathbb{N})[0 \leq |S_{n} - x| < \frac{1}{n}]$. Note as $n \rightarrow \infty$, we can get by the Comparison Lemma that $\lim_{n \rightarrow \infty}S_{n} = x$. $\blacksquare$

Theorem: if $x_n \rightarrow x$, and **$\forall n, a < x_n < b$**, **$a \leq x \leq b$**
> proof left as exercise; involves contradiction

A set S is **closed** in $\mathbb{R}$ if **for any $\{S_{n}\}_{n \geq 1}$ in S, if $S_{n} \rightarrow x$ then $x \in S$**.
> the set $[0, 1]$: the sequence $\frac{1}{2^n}$ converges to 0 which is also in the set
> $\emptyset$ is also closed (vacously true)

***

# exercises

Prove that the set $[1, \infty)$ is closed.
Suppose BWOC that **$\forall x_n \in S, x_n \rightarrow x_0, x_0 \notin S$** Thus $x_0 < 1$. Set $\epsilon := **1::1 - x_0**$ 
> upon rearranging, $x_n < 1$, which is a contradiction


Sequence to prove that the set of irrational numbers is not closed: **$\frac{\sqrt{2}}{n}$**.

***
