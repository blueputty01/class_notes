Idea for recurrence relation example: store consecutive Fibonacci numbers in a vector: $\overrightarrow{x}_{k}=\begin{bmatrix}F_{k}\\F_{k_{1}}\end{bmatrix}$. Build a dynamical system: 
**1::$\overrightarrow{X}_{k+1}=\begin{bmatrix}F_{k+1}\\F_{k+2}\end{bmatrix}=\begin{bmatrix}F_{k+1}\\F_{k}+F_{k+1}\end{bmatrix}$**
So we obtain the matrix:
**1::$=\left[\begin{matrix}0&1\\1&1\end{matrix}\right]\left[\begin{matrix}F_{k}\\F_{k}\end{matrix}\right]$**
> then can use $A^k = PD^kP^{-1}$
