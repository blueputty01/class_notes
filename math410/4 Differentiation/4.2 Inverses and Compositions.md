Theorem: Let $I$ be a(n) (1) **open** interval containing $x_0$, and let $f: I \rightarrow \mathbb{R}$ be (2) **1::strictly monotone** and (3) **1::continuous** on $I$. Suppose (4) **1::$f'(x_0) \neq 0$** and $f'(x_0)$ exists. Then $f^{-1}$ is **differentiable** at $y_0=f(x_0)$ and $(f^{-1})'(y) = **\frac{1}{f'(x_0)}**$.
+
These assumptions are necessary because:
(1) **So $f$ is defined on a neighborhood around $x_0$ $\rightarrow$ $f'(x_0)$ exists**
(2) **Existence for $f^{-1}$; since $f$ is strictly monotone on an interval, then $f^{-1}$ is continuous** 
(3) Implies $f(I)$ is an interval, so the limit for $f^{-1}$ exists
(4) **$f'(x_0) \neq 0$ $\rightarrow$ $f$ is invertible in a neighborhood of $x_0$**
> Fake proof:
> $f(f^{-1}(y)) = y$, so by the chain rule, $f'(f^{-1}(y)) \cdot (f^{-1})'(y) = 1$. Thus $(f^{-1})'(y_0) = \frac{1}{f'(f^{-1}(y_0))} = \frac{1}{f'(x_0)}$.
> something big $\rightarrow$ something small

Exercise: $g: \mathbb{R} \rightarrow \mathbb{R}$ is bounded. $f(x) = x^2 g(x)$. Prove $f'(0) = 0$. 
Solution:
**$|g(x)|\leq M\quad\forall x$**
**1::$|f(x)|\leq x^{2}|g(x)|=Mx^{2}$**
**1::$-Mx^{2}\leq f(x)\leq Mx^{0}$** 
**1::$\frac{-Mx^{2}-f(0)}{x-0}\leq\frac{f(x)-f(0)}{x-0}\leq\frac{M x^{2}-f(0)}{x-0}=0$**
**1::By the squeeze theorem, $\lim_{x\to0}\frac{f(x)-f(0)}{x-0}=0$ so $f'(0)=0$.**

***
