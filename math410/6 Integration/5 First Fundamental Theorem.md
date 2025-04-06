**First Fundamental Theorem of Calculus::Theorem Name**
Let $F: [a, b] \to \mathbb{R}$ be continuous;
$F': [a, b] \to \mathbb{R}$ be bounded and continuous
Thus **$\int_a^b F' = F(b) - F(a) =F(X)\big|_{a}^{b}$**.
+
Proof:
Let $\{P_n\}$ be an Archimedean sequence for $F'$ on $[a, b]$. 
By **MVT** applied to $F'$ on $[x_{i-1}, x_i]$, $\exists c_{1}\in[x_{i-1},x_{i}]$ **1::$F^{\prime}(c_{i})(x_{i}-x_{i-1})=F(x_{i})-F(x_{i-1})$**.
$F'$ is bounded, so $M_i\leq F^{\prime}\leq M_i$ on each $[x_{i-1}, x_i]$
**$m_{i}\Delta x_{i}\leq F(x_{i})-F(x_{i-1})\leq M_{i}\Delta x_{i}$**
**$\sum_{i=1}^{n}m_{i}Ax_{i}\leq\sum_{i=1}^{n}F(x_{i})-F(x_{i-1})\leq\sum_{i=1}^{n}M_{i}Ax_{i}$**
**$L(F^{\prime},P_{n})\leq F(b)-F(a)\leq U(F^{\prime},P_{n})$**
Thus by Archimedean Riemann Theorem, $\int_{a}^b F' = F(b) - F(a)$
> By assumptions on $F'$, we know that $\int_a^b F'$ exists and is independent of $F'(a), F'(b)$

***
