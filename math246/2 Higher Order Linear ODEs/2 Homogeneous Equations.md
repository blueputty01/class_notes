When is there a solution to the IVP with $y(t_{I})=y_{0},\ldots,y^{(n-1)}(t_{I})=y_{n-1}$ of the form $y=C_{1}Y_{1}(t)+C_{2}Y_{2}(t)+\ldots+C_{n}Y_{n}(t)$? 
**Given the matrix $\begin{pmatrix}Y_1(t_1)&Y_2(t_1)&\cdots&Y_n(t_2)\\Y_1^{\prime}(t_1)&Y_2^{\prime}(t_3)& \cdots &Y_n^{\prime}(t_2)\\\vdots&\vdots&\ddots&\vdots\\Y_1^{(n-1)}(t_1)&Y_2^{(n-1)}(t_1)&\cdots&Y_n^{(n-1)}(t_2)\end{pmatrix}\begin{pmatrix}C_1\\C_2\\\vdots\\C_n\end{pmatrix}=\begin{pmatrix}y_0\\y_1\\\vdots\\\vdots\\y_{n-1}\end{pmatrix}$, when there is a solution for every choice of $y_1,\ldots,y_{n-1}$ exactly when $\det{A} \neq 0$**

The **Wronskian of $Y_1, \cdots, Y_n$ at $t_I$** is the **determinant of the matrix $\begin{pmatrix}Y_1(t_I)&Y_2(t_I)&\ldots&Y_n(t_I)\\Y_1^{\prime}(t_I)&Y_2^{\prime}(t_I)&\ldots&Y_n^{\prime}(t_I)\\\vdots&\vdots&\ddots&\vdots\\Y_1^{(n-1)}(t_I)&Y_2^{(n-1)}(t_I)&\ldots&Y_n^{(n-1)}(t_I)\end{pmatrix}$**
> $\begin{pmatrix}Y_1(t_1)&Y_2(t_1)&\cdots&Y_n(t_2)\\Y_1^{\prime}(t_1)&Y_2^{\prime}(t_3)& \cdots &Y_n^{\prime}(t_2)\\\vdots&\vdots&\ddots&\vdots\\Y_1^{(n-1)}(t_1)&Y_2^{(n-1)}(t_1)&\cdots&Y_n^{(n-1)}(t_2)\end{pmatrix}\begin{pmatrix}C_1\\C_2\\\vdots\\C_n\end{pmatrix}=\begin{pmatrix}y_0\\y_1\\\vdots\\\vdots\\y_{n-1}\end{pmatrix}$
> for the IVP with $y(t_{I})=y_{0},\ldots,y^{(n-1)}(t_{I})=y_{n-1}$ of the form $y=C_{1}Y_{1}(t)+C_{2}Y_{2}(t)+\ldots+C_{n}Y_{n}(t)$

For any homogeneous equation, if $Y_1(t), Y_2(t)$ are solutions, then $c_1Y_1(t) + c_2Y_1(t)$ is also a solution for **any constants $c_1, c_2$**, since the derivative operator is **linear**, and **2::the constants can be factored out**
> ![](z_attachments/Pasted%20image%2020250306214651.png)



if wronskian is non zero then t is in the interval. 

Euler: 
e^it = cos(t) + i sin(t)
e^-it = cos(t) - i sin(t)

cos t = (e^it + e ^ -it) / 2
sin t = (e^it - e ^ -it) / 2i

General case, v = frequency (real)

e^ivt = cos(v t ) + i sin(vt) v = 3
y'' + y = 0, we know y_1 = e^{it}, y_2=e^{-it} solutions

now y_1 = cos(t), y_@ = sint are also solutions

geenral solution if z_0 is a double root y'' + 2 y' + y = 0, y_1 = e^-t y2 = t e^-t





