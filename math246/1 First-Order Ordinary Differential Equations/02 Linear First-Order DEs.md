Linear normal form is **$y' + a(t) y = f(t)$** for functions $a(t)$ and $f(t)$
> dividing by $a_1(t)$ and re-labelling

Integral-form solution for $y' + a(t) y = f(t)$
**$y = e^{-A(t)} \int f(t) e^{A(t)} dt$**
> this is a linear first order DE
> $$\begin{aligned}
> y^{\prime}+a(t)y & =f(t) \\
> e^{A(t)}y^{\prime}+e^{A(t)}a(t)y & \large=f(t)e^{A(t)} \\
> \frac{d}{dt}\left(e^{A(t)}y\right) & \large=f(t)e^{A(t)} \\
> e^{A(t)}y & =\int f(t)e^{A(t)}dt \\
> y & =e^{-A(t)}\int f(t)e^{A(t)}dt
> \end{aligned}$$
> inverse chain rule after inverse product rule; $e^{A(t)}$ is the only term that allows us to achieve $e^{A(t)}a(t)$ after differentiation
>
> remember the parentheses around integration result!

The Second FTC states that if a function is continuous on an open interval then it has an antiderivative on that interval and that antiderivative will be continuous.
Thus the interval of existence of the solution to the linear equation $y' + a(t) y = f(t)$ will be the largest open interval containing $t_I$ on which **$f(t)$ and $a(t)$ are continuous.** 
> lets us find the IE when we can't solve the IVP


***
