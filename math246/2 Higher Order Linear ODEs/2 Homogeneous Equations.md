*When* is there a solution to the IVP with $y(t_{I})=y_{0},\ldots,y^{(n-1)}(t_{I})=y_{n-1}$ of the form $y=C_{1}Y_{1}(t)+C_{2}Y_{2}(t)+\ldots+C_{n}Y_{n}(t)$? 
**Given the matrix $\begin{pmatrix}Y_1(t_1)&Y_2(t_1)&\cdots&Y_n(t_2)\\Y_1^{\prime}(t_1)&Y_2^{\prime}(t_3)& \cdots &Y_n^{\prime}(t_2)\\\vdots&\vdots&\ddots&\vdots\\Y_1^{(n-1)}(t_1)&Y_2^{(n-1)}(t_1)&\cdots&Y_n^{(n-1)}(t_2)\end{pmatrix}\begin{pmatrix}C_1\\C_2\\\vdots\\C_n\end{pmatrix}=\begin{pmatrix}y_0\\y_1\\\vdots\\\vdots\\y_{n-1}\end{pmatrix}$, when there is a solution for every choice of $y_1,\ldots,y_{n-1}$ exactly when $\det{A} \neq 0$**
+
The set $\{Y_1, \cdots Y_n\}$ is called the fundamental set of solutions.
$y=C_{1} Y_{1} (t)+C_{2} Y_{2} (t)+\ldots+C_{n} Y_{n} (t)$ is called the general solution to the ODE (at $t$).

The **Wronskian of $Y_1, \cdots, Y_n$ at $t_I$** is the **determinant of the matrix $\begin{pmatrix}Y_1(t_I)&Y_2(t_I)&\ldots&Y_n(t_I)\\Y_1^{\prime}(t_I)&Y_2^{\prime}(t_I)&\ldots&Y_n^{\prime}(t_I)\\\vdots&\vdots&\ddots&\vdots\\Y_1^{(n-1)}(t_I)&Y_2^{(n-1)}(t_I)&\ldots&Y_n^{(n-1)}(t_I)\end{pmatrix}$**
> $\begin{pmatrix}Y_1(t_1)&Y_2(t_1)&\cdots&Y_n(t_2)\\Y_1^{\prime}(t_1)&Y_2^{\prime}(t_3)& \cdots &Y_n^{\prime}(t_2)\\\vdots&\vdots&\ddots&\vdots\\Y_1^{(n-1)}(t_1)&Y_2^{(n-1)}(t_1)&\cdots&Y_n^{(n-1)}(t_2)\end{pmatrix}\begin{pmatrix}C_1\\C_2\\\vdots\\C_n\end{pmatrix}=\begin{pmatrix}y_0\\y_1\\\vdots\\\vdots\\y_{n-1}\end{pmatrix}$
> for the IVP with $y(t_{I})=y_{0},\ldots,y^{(n-1)}(t_{I})=y_{n-1}$ of the form $y=C_{1}Y_{1}(t)+C_{2}Y_{2}(t)+\ldots+C_{n}Y_{n}(t)$

For any homogeneous equation, if $Y_1(t), Y_2(t)$ are solutions, then $c_1Y_1(t) + c_2Y_1(t)$ is also a solution for **any constants $c_1, c_2$**, since the derivative operator is **linear**, and **2::the constants can be factored out**
> ![](z_attachments/Pasted%20image%2020250306214651.png)


***

If the coefficients of a homogeneous linear ODE are continuous on $(a, b)$ and $Y_1, \cdots, Y_n$ are solutions to this ODE, then either $\operatorname{Wr}(Y_1, \cdots, Y_n)(t)$ is **never $0$ or always $0$** on $(a, b)$.

For the homogeneous linear ODE in the normal form $y^{(n)}+a_1(t)y^{(n-1)}+\cdots+a_{n-1}(t)y^{\prime}+a_n(t)y=0$ and the general initial conditions $y(t_I)=y_0\:,\quad y'(t_I)=y_1\:,\quad y''(t_I)=y_2\:,\quad\cdots\quad y^{(n-1)}(t_I)=y_{n-1}$,
The **Natural Fundamental Set of Solutions** is **the set $\{N_0, N_1, \cdots, N_{n-1}\}$ where $N_j^{(k)}(t_I)=\delta_{jk}\quad\text{for every}\:k=0,\:1,\:\cdots,\:n-1$**
+
The solution of the initial problem satisfying the initial conditions is **$y=N_0(t)y_0+N_1(t)y_1+N_2(t)y_2+\cdots+N_{n-1}(t)y_{n-1}$**
> where $\delta_{jk}=\begin{cases}1&\text{if}j=k\:,\\0&\text{otherwise}\:.\end{cases}$, the Kronecker delta
> this is a fundamental set of solutions at $t_I$ because
> $\begin{aligned}\mathrm{Wr}[N_{0},N_{1},\cdots,N_{n-1}](t_{I})&=\det\begin{pmatrix}N_0(t_I)&N_1(t_I)&\cdots&N_{n-1}(t_I)\\N_0^{\prime}(t_I)&N_1^{\prime}(t_I)&\cdots&N_{n-1}^{\prime}(t_I)\\\vdots&\vdots&\ddots&\vdots\\N_0^{(n-1)}(t_I)&N_1^{(n-1)}(t_I)&\cdots&N_{n-1}^{(n-1)}(t_I)\end{pmatrix}\\&=\det\begin{pmatrix}1&0&\cdots&0\\0&1&\ddots&\vdots\\\vdots&\ddots&\ddots&0\\0&\cdots&0&1\end{pmatrix}=1\:.\end{aligned}$
> check for solution: $y(t_{\pm})=y_{0}\cdot1+y_{1}\cdot0+\cdots+y_{n-i}0=y_{0}$
> $y^{\prime}(t_{I})=y_{0}\cdot0+y_{1}\cdot1+ \cdots +y_{n-1}\cdot0=y_{1}$

***

The Wronskian of the equation $y''+a(x)y'+b(x)y=0$ satisfies the ODE **$W^{\prime}+a(x)W=0$**
> memorize for final lol
> $\begin{aligned}W^{\prime}&=\quad(y_1y_2'-y_2y_1')'=y_1'y_2'+y_1y_2''-y_2'y_1'-y_2y_1''\\&=\quad y_1y_2''-y_2y_1''=y_1(-ay_2'-by_2)-y_2(-ay_1'-by_1)\\&=\quad-a(y_1y_2'-y_2y_1')=-aW,\end{aligned}$
***
