Lagrangian Interpolation: 
**$P\left(x\right)=\sum_{j=1}^{n}P_{j}\left(x\right)$, where $P_{j}\left(x\right)=y_{j}\prod_{k=1, k\neq j}^{n}\frac{x-x_{k}}{x_{j}-x_{k}}$**
> $x$ values must be distinct

***

Newton polynomial expression:
**$f(x)=a_0+a_1(x-x_0)+a_2(x-x_0)(x-x_1)+\cdots+a_n(x-x_0)(x-x_1)\ldots(x-x_n)$**
> in the most basic form, solve a linear system for the value of the coefficients $a_i$

Divided difference formula:
$f[x_k,x_{k-1},\ldots,x_1,x_0]=\frac{f[x_k,x_{k-1},\ldots,x_2,x_2]-f[x_{k-1},x_{k-2},\ldots,x_1,x_0]}{x_k-x_0}$
> zero order divided difference: $f[x_k] = f(x_k) = y_k$
> first order divided difference: $f[x_1,x_0]=\frac{y_1-y_0}{x_1-x_0}$
> second order divided difference: $f[x_2,x_1,x_0]=\frac{\frac{y_2-y_1}{x_2-x_1}-\frac{y_1-y_0}{x_1-x_0}}{x_2-x_0}=\frac{f[x_2,x_1]-f[x_1,x_0]}{x_2-x_1}$
> equivalent to the $n$-th order derivative
> used to compute the coefficients in the Newton polynomial expression
> $f(x)=a_0+a_1(x-x_0)+a_2(x-x_0)(x-x_1)+\cdots+a_n(x-x_0)(x-x_1)\ldots(x-x_n)$

Row order approach to write divided difference table:
For each entry, take entry in next two rows divided by the length of the interval (difference by 2 in first column, then by 3 in next column, etc)
> $\begin{aligned}&y_{0}&&f[x_1,x_0]&&f[x_2,x_1,x_0]&&f[x_3,x_2,x_1,x_0]&&f[x_4,x_3,x_2,x_1,x_0]\\&y_{1}&&f[x_2,x_1]&&f[x_3,x_2,x_1]&&f[x_4,x_3,x_2,x_1]&&0\\&y_{2}&&f[x_3,x_2]&&f[x_4,x_3,x_2]&&0&&0\\&y_{3}&&f[x_4,x_3]&&0&&0&&0\\&y_{4}&&0&&0&&0&&0\end{aligned}$

