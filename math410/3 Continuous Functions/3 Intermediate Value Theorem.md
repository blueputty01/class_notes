Let $f: [a,b] \rightarrow \mathbb{R}$ be continuous. Suppose $c \in \mathbb{R}$ is strictly between $f(a)$ and $f(b)$. Then $\exists x_0 \in (a, b)$ such that $f(x_0) = c$
Proof: uses **bisection** method and the nested interval theorem
> no claim about uniqueness

***

Suppose $f: \mathbb{R} \rightarrow \mathbb{R}$ is continuous and that its image $f(\mathbb{R})$ is bounded. Prove that $f$ has a fixed point.
Let
**$m \coloneqq \inf{f(\mathbb{R})}$**
**1::$M \coloneqq \sup{f(\mathbb{R})}$**
So,
**1::$f(M) < M$**
**1::$f(m) > m$**
Rearranging,
**1::$f(M) - M < 0$**
**1::$f(m) - m > 0$**
Defining a function **$g(x) = f(x) - x$**
By **1::IVT**, there exists a point $x_0$ such that **1::$g(x_0) = 0 \implies f(x_0) = x_0$**

***
