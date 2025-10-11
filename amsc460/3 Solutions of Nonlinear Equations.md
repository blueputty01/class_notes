The **Jacobian** is $\frac{\partial (x, y)} {\partial(u, v)}  = {{c2::\begin{bmatrix}  \frac{\partial x} {\partial u}  & \frac{\partial x}{\partial v}\\ \frac{\partial y} {\partial u}  & \frac{\partial y} {\partial v}  \end{bmatrix} ={\frac{\partial x} {\partial u} } {\frac{\partial y} {\partial\nu} } -{\frac{\partial x} {\partial\nu} } {\frac{\partial y} {\partial u} } }}$

***

Newton's method derivation:
**$f(x_0)+f^{\prime}(x_0)(x_1-x_0)$**
**1::$x_{n+1}=x_n-\frac{f(x_n)}{f^{'}(x_n)}$**

***

To calculate the second term given $J^{(n)}$ and $f(x^{(n)})$: 
$\underline{x}^{(n+1)}=\underline{x}^{(n)}-[J^{(n)}]^{-1}\underline{f}(\underline{x}^{(n)})$
**$\large J^{(n)}\underline{z}^{(n)}=-\underline{f}(\underline{x}^{(n)})$**
> $\large\underline{z}^{(n)}=-[J^{(n)}]^{-1}\underline{f}(\underline{x}^{(n)})$

Cobweb diagram steps:
1. Sketch **$y = p$ and $y = g(p)$**
2. Choose an initial guess of the root $P$
3. Draw a vertical line from $y = p$ to the curve $y = g(p)$, and then horizontal line to the line $y = p$
4. Continue Item 3 until convergence (or divergence) is attained
> ![|400](z_attachments/Pasted%20image%2020251008213020.png)
> because for each iteration when we set $x^{(n + 1)} = x^{(n)}$ we are kinda using $y = p$ to translate the $y$ into an $x$
***
