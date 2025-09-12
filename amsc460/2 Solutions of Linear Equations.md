# Doolittle Decomposition

Doolittle Algorithm (LU Decomposition):
**$U_{ij}=A_{ij}-\sum_{k=0}^{i-1}L_{ik}U_{kj}$**
**1::$L_{ij}=\frac{A_{ij}-\sum_{k=0}^{j-1}L_{ik}U_{kj}}{U_{jj}}$**
> first row of $U$ is the first row of $A$
> [engr.colostate.edu/\~thompson/hPage/CourseMat/Tutorials/CompMethods/doolittle.pdf](https://www.engr.colostate.edu/~thompson/hPage/CourseMat/Tutorials/CompMethods/doolittle.pdf)
> do top row of U, then left row of L
> Dolittle decomposition method fails if one of the diagonal elements of the matrix $U$ is zero

ahah idk
Solving LU decomposition linear systems:
$\mathbf{A}\mathbf{x}=\mathbf{b}$
$L y = b$, solved with forward substitution
$Ux = y$, solved with backward substitution
Forward substitution
Back substitution

# Cholesky Decomposition

The Cholesky decomposition of a symmetric matrix $A$ decomposes the matrix into $LL^T$.
> two loops to apply

# Norm

$L^2$ norm: 
**$\|\mathbf{x}\|_p:=\left(\sum_{i=1}^n|x_i|^p\right)^{1/p}$**

$L^\infty$ norm: 
**$\|\mathbf{x}\|_\infty:=\max_i|x_i|$**

Norm of a matrix: $\|A\|_\infty=\max_{1\leq i\leq m}\sum_{j=1}^n|a_{ij}|~,$
> will we always use infinity and 1

# Condition Number and Ill-Conditioning

Condition number: $||A|| ||A^{-1}||$
> large condition number -> generally bad; ill-conditioned

A system is **ill-conditioned** if it cannot handle small variations in input

Pivoting divides by the largest number possible at each step

# Iterative Methods for Solving Linear Systems

Jacobi iteration:
Solve for $x_i$ from equation $i$
Make an initial guess of the solution
Iterate until convergence is attained