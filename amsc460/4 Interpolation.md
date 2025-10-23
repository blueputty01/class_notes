Lagrangian Interpolation: 
**$P\left(x\right)=\sum_{j=1}^{n}P_{j}\left(x\right)$, where $P_{j}\left(x\right)=y_{j}\prod_{k=1, k\neq j}^{n}\frac{x-x_{k}}{x_{j}-x_{k}}$**
> $x$ values must be distinct

***

Newton polynomial expression:
**$f(x)=a_0+a_1(x-x_0)+a_2(x-x_0)(x-x_1)+\cdots+a_n(x-x_0)(x-x_1)\ldots(x-x_n)$**
> in the most basic form, solve a linear system for the value of the coefficients $a_i$

Divided difference formula:
**$f[x_k,x_{k-1},\ldots,x_1,x_0]=\frac{f[x_k,x_{k-1},\ldots,x_2,x_2]-f[x_{k-1},x_{k-2},\ldots,x_1,x_0]}{x_k-x_0}$**
> zero order divided difference: $f[x_k] = f(x_k) = y_k$
> first order divided difference: $f[x_1,x_0]=\frac{y_1-y_0}{x_1-x_0}$
> second order divided difference: $f[x_2,x_1,x_0]=\frac{\frac{y_2-y_1}{x_2-x_1}-\frac{y_1-y_0}{x_1-x_0}}{x_2-x_0}=\frac{f[x_2,x_1]-f[x_1,x_0]}{x_2-x_1}$
> equivalent to the $n$-th order derivative
> used to compute the coefficients in the Newton polynomial expression
> $f(x)=a_0+a_1(x-x_0)+a_2(x-x_0)(x-x_1)+\cdots+a_n(x-x_0)(x-x_1)\ldots(x-x_n)$

Divided difference table:
**For each entry, take entry in this row and previous divided by the length of the interval (difference by 2 in first column, then by 3 in next column, etc)**
> $\begin{aligned}&x_{0}&&y_{0}\\&&&f[x_{1},x_{0}]\\&x_{1}&&y_{1}&&f[x_{2},x_{1},x_{0}]\\&&&f[x_{2},x_{1}]&&f[x_{3},x_{2},x_{1},x_{0}]\\&x_{2}&&y_{2}&&f[x_{3},x_{2},x_{1}]&&f[x_{4},x_{3},x_{2},x_{1},x_{0}]\\&&&f[x_{3},x_{2}]&&f[x_{4},x_{3},x_{2},x_{1}]\\&x_{3}&&y_{3}&&f[x_{4},x_{3},x_{2}]\\&&&f[x_{4},x_{3}]\\&x_{4}&&y_{4}\end{aligned}$

There are infinite $n$ degree polynomials that fit **$n - 1$** data points.

Once divided differences are **close to zero**, this implies that the polynomial can fit the data reasonably well.

***

**High** order polynomials have ill conditioning, undershooting, overshooting etc whole host of issues.
> eg $ax^2 + bx + c$ $b$ dominates for small $x$ but $a$ dominates for large $x$

Quadratic spline **method**:
- {{c1::The function values of adjacent polynomials must be equal at the interior knots	- $a_ix_i^2+b_ix_i+c_i=a_{i+1}x_i^2+b_{i+1}x_i+c_{i+1}\quad\mathrm{for~}i=1,2,...,n-1$}}
- {{c1::The first and last functions (quadratic splines) must pass through the end points.
$\begin{aligned}S_1(x_0)&=y_0\quad\Rightarrow\quad a_1x_0^2+b_1x_0+c_1=y_0\\\\S_n(x_n)&=y_n\quad\Rightarrow\quad a_nx_n^2+b_nx_n+c_n=y_n\end{aligned}$}}
- {{c1::The first derivative at the interior knots must be equal. 
$S_i^{\prime}(x_i)=S_{i+1}^{\prime}(x_i)\quad\Rightarrow\quad2a_ix_i+b_i=2a_{i+1}x_i+b_{i+1}\quad\mathrm{for~}i=1,2,...,n-1$}}
- {{c1::Assume that the second derivative is zero at the first data point.
$S_1^{\prime\prime}(x_0)=0\quad\Rightarrow\quad2a_1=0\quad\Rightarrow\quad a_1=0$}}
> Given $n$ points, we have $n -1$ splines, thus we need $3(n-1)$ equations to find all the unknowns
> Linear spline method:
> Straight lines at each interval

***
