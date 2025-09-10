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