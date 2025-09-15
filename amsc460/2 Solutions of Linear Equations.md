# Gaussian Methods

Row interchanges in Gaussian elimination are called **(partial) pivoting**.
> Even if the pivot is not identically zero, a small value can result in big roundoff errors. For very large matrices, one can easily lose all accuracy in the solution. To avoid these round-off errors arising from small pivots, row interchanges are made, and this technique is called **partial pivoting** (partial pivoting is in contrast to complete pivoting, where both rows and columns are interchanged). 

# Doolittle Decomposition

LU decomposition:
The **first row of $U$** is identical to the first row of $A$.
The **first column of $L$** (below the diagonal) is the first column of $A$ divided by $U_{11}$.
The rest can be filled in left-to-right, top-to-bottom, by **multiplying the column $j$ of $U$ by the row $i$ of $L$ to match $(i,j)$ of $A$.**
>The algorithm requires that all pivot elements $U_{ii}$ are non-zero.

Solving LU decomposition linear systems:
$\mathbf{A}\mathbf{x}=\mathbf{b}$
**$L y = b$, solved with forward substitution**
**1::$Ux = y$, solved with backward substitution**
> Forward substitution:
> $\begin{bmatrix}1\\l_{21}&1\\l_{31}&l_{32}&1\\l_{41}&l_{42}&l_{43}&1\end{bmatrix}\begin{bmatrix}y_{1}\\y_{2}\\y_{3}\\y_{4}\end{bmatrix}=\begin{bmatrix}b_{1}\\b_{2}\\b_{3}\\b_{4}\end{bmatrix}$
> It follows from the above that $y_1=b_1,l_{21}y_1+y_2=b_2$, from which $y_2$ can be found...
> +
> Backward substitution
> $\begin{bmatrix}u_{11}&u_{12}&u_{13}&u_{14}\\&u_{22}&u_{23}&u_{24}\\&&u_{33}&u_{34}\\&&&u_{44}\end{bmatrix}\quad\begin{bmatrix}x_1\\x_2\\x_3\\x_4\end{bmatrix}=\begin{bmatrix}y_1\\y_2\\y_3\\y_4\end{bmatrix}$
> bottom up

Forward substitution (known $b$ and $L$):
 $\begin{bmatrix}1\\l_{21}&1\\l_{31}&l_{32}&1\\l_{41}&l_{42}&l_{43}&1\end{bmatrix}\begin{bmatrix}y_{1}\\y_{2}\\y_{3}\\y_{4}\end{bmatrix}=\begin{bmatrix}b_{1}\\b_{2}\\b_{3}\\b_{4}\end{bmatrix}$
**Start from top down and calculate $y_1$**
> It follows from the above that $y_1=b_1,l_{21}y_1+y_2=b_2$, from which $y_2$ can be found...

# Cholesky Decomposition

The Cholesky decomposition of a symmetric matrix $A$ decomposes the matrix into **$LL^T$**.
> works on symmetric matrix
> two loops to apply

# Norm

$L^2$ norm: 
**$\|\mathbf{x}\|_p:=\left(\sum_{i=1}^n|x_i|^p\right)^{1/p}$**

$L^\infty$ norm: 
**$\|\mathbf{x}\|_\infty:=\max_i|x_i|$**

Norm of a matrix: $\|A\|_\infty=**\max_{1\leq i\leq m}\sum_{j=1}^n|a_{ij}|**$
> will we always use infinity and 1

# Condition Number and Ill-Conditioning

Condition number: **$||A|| ||A^{-1}||$**
> large condition number -> generally bad; ill-conditioned

A system is **ill-conditioned** if it cannot handle small variations in input

# Iterative Methods for Solving Linear Systems

**Jacobi iteration** solves the linear system $A\mathbf{x} = \mathbf{b}$ using the following steps:
1. **Isolate the diagonal**: For each equation $i$, solve for $x_i$:  
    $x_i = \frac{1}{a_{ii}}\left(b_i - \sum_{j eq i}a_{ij}x_j\right)$.
2. **Initialize**: Make an initial guess for the solution vector $\mathbf{x}^{(0)}$ (often $\mathbf{x}^{(0)} = \mathbf{0}$).
3. **Iterate**: For $n = 0, 1, 2, ...$ until convergence, compute:  
    $x_i^{(n+1)} = \frac{1}{a_{ii}}\left(b_i - \sum_{j eq i}a_{ij}x_j^{(n)}\right)$ for all $i$.
Convergence is guaranteed if the matrix $A$ is **strictly diagonally dominant**.  
> The method updates all components of the new guess $\mathbf{x}^{(n+1)}$ using **only values from the previous iteration** $\mathbf{x}^{(n)}$.  
> It is a **stationary iterative method**.
***
