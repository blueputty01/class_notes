If $\overrightarrow{x}=\lim_{k\to\infty}\overrightarrow{x}_{k}=\lim_{k\to\infty}T^k\overrightarrow{x}_{0}$ exists and is nonzero, then $\vec{x}$ is **an eigenvector for $T$ with eigenvalue $\lambda = 1$**. 
> because  $T\overrightarrow{x}=T\left(\lim_{k\to\infty}T^{k}\overrightarrow{x}_{0}\right)$
> $=\lim_{k\to\infty}T^{k+1}\vec{x}_{0}$
> = $\vec{x}$
> So $x$ is an eigenvector with $\lambda = 1$

A probability vector is a vector $\overrightarrow{v}=\begin{vmatrix}v_{1}\\v_{2}\\\vdots\\v_{n}\end{vmatrix}$ such that $0 \leq v_i \leq 1$ for each $i$ and $v_{1}+v_{2}+\cdots+v_{n}=1$.

An $n \times n$ matrix $T$ is called a **stochastic matrix** if **every column of $T$ is a probability vector**.
> If $T$ is $n \times n$ and stochastic and $\vec{v}$ is an $n \times 1$ probability vector, then $T \vec{v}$ is also a probability vector.
> The product of two stochastic matrices is stochastic
> In particular, if $T$ is stochastic, then $T^k$ is stochastic for any possible integer $k$

A Markov Chain is a discrete dynamical system $\vec{x_{k+1}}=T\vec{x_{k}}$ in which **$T$ is stochastic** and **1::$\vec{x}_k$ are probability vectors**.

