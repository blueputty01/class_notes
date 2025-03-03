Euler's Method
$ti = t_{i−1} + h$
$y_i \approx **y_{i−1} + hf(t_{i−1}, y_{i−1})**$

Implicit Euler method:
**$y_{n+1}-hf(t_{n+1},y_{n+1})=y_n$**
> also known as backward Euler method

In the approximation $Y(t+h)=Y(t)+hY^{\prime}(t)+O(h^2)$, $O(h^2)$ represents the **local error**
> the Taylor series approximation is ; the last term $Y(t+h)=Y(t)+nY(t)+\frac{h^{2}}{2}Y^{11}(t)+\ldots$ has order $h^2$
> if we halve $h$, the error is reduced by a quarter 

The **global error/total error** is $N \cdot O(h^2)$, where $N$ is the number of steps. 
+ 
$N = \frac{t_f-t_0}{h} = \frac{\textrm{constant}}{h}$ and $\frac{constant}{h} \cdot O(h^2) = O(h)$
Thus if we scale $h$ by a constant $c$, the error should also scale **by $c$**
> methods like Euler methods with global errors of $O(h)$ are called first-order methods
> similarly, methods whose local errors are $O(h^{m+1})$ will have a global error of $O(h^m)$ and are called $m$-th order methods

***

Let's improve Euler's method, which is a **left side::type** approximation.
$y(t_{1})-y(t_{0})=\int_{t_{0}}^{t_{1}}f(t,y(t))\,d t$
We can rewrite as our *basic formula*
$y_{1} = **y_{0}+\displaystyle\int_{t_{0}}^{t_{1}}f(t,y(t))~d t**$
	$\begin{aligned}&y_1=y_0+\int_{t_0}^{t_1}f(t,y(t))\:dt\\&y_1\approx y_0+(t_1-t_0)f(t_0,y(t_0))\\&y_1\approx y_0+(t_1-t_0)f(t_0,y_0)\\&y_1\approx y_0+hf(t_0,y_0)\end{aligned}$
	this suggests that better methods of approximating the integral lead to better approximations for the IVP as a whole

The Runge-Trapezoid Method:
$y_i\approx **y_{i-1}+\frac12h{\left(f(t_{i-1},y_{i-1})+f(t_{i-1}+h,y_{i-1}+hf(t_{i-1},y_{i-1}))\right)}**$

---

To approximate the integral with a trapezoid: $\int_a^bg(x)\mathrm{~}dx\approx\frac12(b-a)(g(a)+g(b))$

![](z_attachments/Pasted%20image%2020250225132100.png)

$\begin{aligned}&y_1=y_0+\int_{t_0}^{t_1}f(t,y(t))dt\\&y_1\approx y_0+\frac12(t_1-t_0)(f(t_0,y(t_0))+f(t_1,y(t_1)))\\&y_1\approx y_0+\frac12h(f(t_0,y_0)+f(t_0+h,y(t_1)))\end{aligned}$
but we don't know $y(t_1)$! plug in Euler instead
$y_1\approx y_0+\frac12h(f(t_0,y_0)+f(t_0+h,\underbrace{y_0+hf(t_0,y_0)}_{\text{Euler:}}))$

---

The Runge-Midpoint method:
$y_i\approx **y_{i-1}+hf\left(t_{i-1}+\frac12h,y_{i-1}+\frac12hf(t_{i-1},y_{i-1})\right)**$

---

To approximate the integral with a midpoint rectangle: $\int_a^bg(x)\mathrm{~}dx\thickapprox(b-a)g\left(\frac{a+b}2\right)$
$\begin{aligned}&y_1=y_0+\int_{t_0}^{t_1}f(t,y(t))dt\\&y_1\approx y_0+(t_1-t_0)f\left(t_0+\frac12h,y\left(t_0+\frac12h\right)\right)\\&y_1\approx y_0+hf\left(t_0+\frac12h,y\left(t_0+\frac12h\right)\right)\end{aligned}$
but we don't know $y(t_0 + \frac12 h)$! plug in Euler instead
$y_1\approx y_0+hf\left(t_0+\frac12h,\underbrace{y_0+\frac12hf(t_0,y_0)}_{Euler}\right)$

---

***

Suppose $y' = y^2$. $y'' = **2yy' = 2y^3**$ 

***
