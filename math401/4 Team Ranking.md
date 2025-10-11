If we want a solution "centered" around 0 (average of team weights is 0):
**include $r_{1}+r_{2}+r_{3}=r_{4}=0$ in our original linear system**

In general in team ranking, where the equations have the form $r_i - r_j = b$, there will always be infinitely many least squares solutions because **the columns of $A$ add up to zero.**
> $\left.A=\left[\begin{matrix}1&-1&0&0\\1&0&0&-1\\0&1&-1&0\\0&0&1&-1\\0&0&1&-1\end{matrix}\right.\right],\begin{array}{c}0=\left(\begin{matrix}4\\2\\-7\\-7\\0\\0\end{matrix}\right)\end{array}$ 
> $x$ is in the nullspace of $A$ ($Ax = 0$)
> so typically, the solution will look like: $\hat{r}=\vec{r}_{0}+t \left(\begin{matrix}1 \\ 1\\1\end{matrix}\right)$

***

Team ranking matrices often have no solution; thus we apply **least squares**
***
