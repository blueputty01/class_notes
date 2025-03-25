$k$ in the notation $p(x; k)$ indicates that **the distribution depends on the parameter $k$**.
> eg $\displaylines{(x;k)=P(X=x)=\frac1k \\ x=x_1,\ldots,x_k.\\ \mu=E(X)=\frac1k\sum_{i=1}^kx_i  \\ \sigma^2=\text{Var}(X)=\frac1k\sum_{i=1}^k(x_i-\mu)^2}$ 

***

# Poisson distribution

To prove that the Poisson distribution is a valid mass function, take the sum across all values: 
$$\sum_{x=0}^\infty p(x;\lambda)=\sum_{x=0}^\infty\frac{e^{-\lambda}\lambda^x}{x!}=e^{-\lambda}\sum_{x=0}^\infty\frac{\lambda^x}{x!}=e^{-\lambda}e^\lambda=1$$
This simplification involves recognizing the **Taylor series expansion for $e^\lambda$** 

***

Poisson distribution derivation starting point: **$\frac{n!}{x! (n-x)!}\frac{\lambda}{n}^x\left(1-\frac{\lambda}{n}\right)^{n-x}$**
	![](z_attachments/IMG_8CFDD2512058-1.jpeg)

# Geometric Random Variable

A random variable $X$ has the **geometric** distribution with parameter $p (0 < p < 1)$ if $X$ has a discrete distribution for which the p.f. $f(x|1, p)$ is:
**$f(x|1,p)=\begin{cases}p(1-p)^x&\quad\mathrm{for~}x=0,1,2,\ldots,\\0&\quad\mathrm{otherwise}.&\end{cases}$**
> special case of a negative binomial random variable for where we take the first success ($r=1$)
> faster decay for larger $p$
> monotonically decreasing
> $\sum_{x=1}^\infty(1-p)^{x-1}p=p\sum_{x=1}^\infty(1-p)^{x-1}.$
> $\sum_{k=0}^\infty(1-p)^k=\frac1{1-(1-p)}=\frac1p.$
> 

look at proof for expectation and variance

A random variable $X$ has the **negative binomial** distribution with parameters $r$ and $p (r = 1, 2,... \textrm{and}~0)$ if $X$ has a discrete distribution for which the p.f. is:
**$f(x|r,p)=\begin{cases}\begin{pmatrix}r+x-1\\x\end{pmatrix}p^r(1-p)^x\\0\end{cases}$**
> sampling until a fixed number of successes