If $\overrightarrow{x}=\lim_{k\to\infty}\overrightarrow{x}_{k}=\lim_{k\to\infty}T^k\overrightarrow{x}_{0}$ exists and is nonzero, then $\vec{x}$ is **an eigenvector for $T$ with eigenvalue $\lambda = 1$**. 
> because  $T\overrightarrow{x}=T\left(\lim_{k\to\infty}T^{k}\overrightarrow{x}_{0}\right)$
> $=\lim_{k\to\infty}T^{k+1}\vec{x}_{0}$
> = $\vec{x}$
> So $x$ is an eigenvector with $\lambda = 1$

An $n \times n$ matrix $T$ is called a **stochastic matrix** if **every column of $T$ is a probability vector**.
> An $n \times n$ matrix  is called a **stochastic matrix** if **every column of $T$ is a probability vector**.
> If $T$ is $n \times n$ and stochastic and $\vec{v}$ is an $n \times 1$ probability vector, then $T \vec{v}$ is also a probability vector.
> The product of two stochastic matrices is stochastic
> In particular, if $T$ is stochastic, then $T^k$ is stochastic for any possible integer $k$

A Markov Chain is a discrete dynamical system $\vec{x_{k+1}}=T\vec{x_{k}}$ in which **$T$ is stochastic** and **1::$\vec{x}_k$ are probability vectors**.

***

A stochastic matrix $T$ is called **regular** if there is some integer $k \geq 1$ such that all entries of $T^k$ are nonzero (ie positive).

If $T^k$ has all nonzero entries, then the same is **always::sometimes/always/never** true for $T^k$ for any $k \geq k_0$

A stochastic $T$ in a Markov chain is also called a **transition** matrix. 

A **steady state vector** for a stochastic matrix $T$ is a probability vector $\vec{x}$ such that $T\vec{x} = \vec{x}$ (ie $\vec{x}$ is an eigenvector for $T$ with $\lambda = 1$) 

Suppose $T$ is a **regular** stochastic matrix. Then there is a **unique** steady state vector $\vec{v}$ for $T$. Further, if $\vec{x}_0$ is any probability vector, then $\lim_{k\to\infty}T^k \vec{x}_0 = \vec{v}$. 

***

A probability vector is a vector **whose entries lie between 0 and 1 (inclusive) and add to 1**.

The $(i, j)$ entry of $T^k$ is the probability of **moving from state $j$ to state $i$** in exactly $k$ steps.
> the $(i, j)$ entry of $T^2$ is $\sum_{k=1}^{n}t_{ik}t_{kj}$
> notice that this is all the combinations of $j \rightarrow i$ through all possible $k$ intermediaries
> (row $i$ and column $j$)

**Regularity** of $T$ means that there is an integer $k \geq 1$ such that it is possible to move from any state to any other state in exactly $k$ steps.
