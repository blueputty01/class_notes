Reduction of Order:
$y^{\prime\prime}+a_{1}(t)y^{\prime}+a_{0}(t)y=0$
Say $y_{1}(t)$ is a solution
Guess another solution $y=**u(t)y_1(t)**$
Set **$w = u'$**, note that this is a **separable** first order ODE for $w$. 
**Integrate** to get $u$

Variation of Parameters:
To solve $y^{\prime\prime}+a_{1}(t)y^{\prime}+a_{0}(t)y=f(t)$, we know the general solution is $Y_{H}(t)=C_{1}Y_{1}(t)+C_{2}Y_{2}(t)$. 
Guess: $Y_p(t)=**u_1(t)Y_1(t)+u_2(t)Y_2(t)**$
Thus we get the matrix equation:
**$\left.\left(\begin{matrix}Y_{1}&Y_{2}\\Y_{1}^{\prime}&Y_{2}^{\prime}\end{matrix}\right.\right)\left(\begin{matrix}u_{1}^{\prime}\\u_{2}^{\prime}\end{matrix}\right)=\left(\begin{matrix}0\\f\end{matrix}\right)$ (what is it for third order?)**
Thus the final solution is $y=**C_{1}Y_{1}(t)+C_{2}Y_{2}(t)+u_1(t)Y_1(t)+u_2(t)Y_2(t)**$
> $Y_{H}=C_{1}Y_{1}+C_{2}Y_{2}+C_{3}Y_{3}$
> Guess: $Y_{p}=u_{1}Y_{1}+u_{2}Y_{2}+u_{3}Y_{3}$
> $\begin{pmatrix}Y_1&Y_2&Y_3\\Y_1^{\prime}&Y_2^{\prime}&Y_3^{\prime}\\Y_1^{\prime\prime}&Y_2^{\prime\prime}&Y_3^{\prime\prime}\end{pmatrix}\begin{pmatrix}U_1^{\prime}\\U_2^{\prime}\\U_3^{\prime}\end{pmatrix}=\begin{pmatrix}0\\0\\f\end{pmatrix}$

***

Consider the ODE $Ly=f(t)$ for the linear operator with constant coefficients $L=D^{n}+a_{1}D^{n-1}+\cdots+a_{n-1}D+a_{0}$. 
For any initial time $t_I$, the particular solution that solves the IVP $LY_P(t)=f(t),~Y_P(tI)=Y_P^1(t_I)=\ldots=Y_P^{(n-1)}(t_I)=0$ is given by the formula $y_{p}(t)=**\int_{t_{I}}^{t}g(t-s)f(s)ds**$, where $g(t)$ is **the solution to the homogeneous initial value problem $Lg=0,\quad g(0)=0,\quad g^{\prime}(0)=0,\ldots,\quad g^{(n-2)}(0)=0,\quad g^{(n-1)}(0)=1$**
The function $g$ is called the **Green function** of $L$.
> can be checked by applying chain rule
> notice that we do not require $f(t)$ to be of a particular form
***
