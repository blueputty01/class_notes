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
