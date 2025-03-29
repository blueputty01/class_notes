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
**$f(x|1,p)=\begin{cases}p(1-p)^{x-1}&\quad\mathrm{for~}x=1,2,\ldots,\\0&\quad\mathrm{otherwise}.&\end{cases}$**
> special case of a negative binomial random variable for where we take the first success ($r=1$)
> 
> faster decay for larger $p$
> monotonically decreasing
>
> valid distribution: 
> $\sum_{x=1}^\infty(1-p)^{x-1}p=p\sum_{x=1}^\infty(1-p)^{x-1}.$
> $\sum_{k=0}^\infty(1-p)^k=\frac1{1-(1-p)}=\frac1p.$
>

If $X$ is a geometric distribution, find $E(X)$:
*by using the geometric series identity*
$E(X)=\sum_{x=1}^{\infty}xp(1-p)^{x-1}$
$=p\sum_{x=1}^{\infty}x(1-p)^{x-1}$
we don't know the identity for $=\sum_{x=1}^{\infty}x(1-p)^{x-1}$, but we know:
**$\sum_{x=0}^{\infty}{(1-p)^{x}}=\frac{1}{p}$**
**$\frac{d}{dp}\sum_{x=0}^{\infty}(1-p)^{x}=\frac{d}{dp}\frac{1}{p}$**
**2::$\sum_{x=1}^{\infty}-x(1-p)^{x-1}=\frac{1}{p^{2}}$**
thus $2::\sum_{x=1}^{\infty}x(1-p)^{x-1}=\frac{1}{p^{2}}$
and so $E(x) = p (\frac{1}{p^2}) = p$

If $X$ is a geometric distribution, find $E(X)$:
*by splitting up the summation*
$\begin{aligned}E(X)&=\sum_{x=1}^{\infty}xq^{x-1}p\\&=**\sum_{x=1}^{\infty}(x-1+1)q^{x-1}p**\\&**2::=\sum_{x=1}^{\infty}(x-1)q^{x-1}p+\sum_{x=1}^{\infty}q^{x-1}p**\\&**=\sum_{x=0}^{\infty}xq^{x}p+1**\\&=**q\sum_{x=1}^{\infty}xq^{x-1}p+1**\\&=qE(x)+1\\&\frac{1}{E(x)}=1-(1-p)\\&E(x) = \frac{1}{p}\end{aligned}$

---

Calculation for $Var({X})$ is similar

$\begin{aligned}E[X^{2}]&=\sum_{i=1}^\infty i^2q^{i-1}p\\&=\sum_{i=1}^\infty(i\:-\:1\:+\:1)^2q^{i-1}p\\&=\sum_{i=1}^\infty(i\:-\:1)^2q^{i-1}p\:+\:\sum_{i=1}^\infty2(i\:-\:1)q^{i-1}p\:+\:\sum_{i=1}^\infty q^{i-1}p\\&=\sum_{j=0}^\infty j^2q^jp\:+\:2\sum_{j=1}^\infty jq^jp\:+\:1\\&=qE[X^2]+2qE[X]\:+\:1\end{aligned}$
Thus $E[X^2]=\frac{2q+p}{p^2}=\frac{q+1}{p^2}$
So $\mathrm{Var}(X)=\frac{q\:+\:1}{p^2}\:-\:\frac{1}{p^2}\:=\:\frac{q}{p^2}\:=\:\frac{1\:-\:p}{p^2}$

---

A random variable $X$ has the **negative binomial** distribution with parameters $r$ and $p$ ($r = 1, 2,\cdots$ and $0 < p < 1$ if $X$ has a discrete distribution for which the p.f. is:
**$f(x|r,p)=\begin{cases}\begin{pmatrix}r+x-1\\x\end{pmatrix}p^r(1-p)^x\\0\end{cases}$**
> sampling until a fixed number of successes

A nonnegative random variable $X$ is **memoryless** if **$P\{X\:>\:s\:+\:t\mid X\:>\:t\}=P\{X\:>\:s\}$** for all $s, t \geq 0$
> If an event hasn’t occurred by time $t$, the probability that it will occur after an additional $s$ time units is the same as the (unconditional) probability that it will occur after time $s$ – it forgot that it made it past time $t$!

The **hypergeometric** distribution consists of **$N$ items and a random sample of size $n$. There are $r$ successes and $n-r$ failures.** 
> sample selected without replacement
> $r$ of the $N$ items may be classified as successes and $N-r$ classified as failures
> $f(x)=\begin{cases} \frac{\binom{r}{x}\binom{N-r}{n-x}}{\binom{N}{n}} & \textrm{for }\max\{0,n-(N-r)\}\leq x\leq\min\{n,r\}\\ 0 & \textrm{otherwise}\end{cases}$
> $E(X) = n\frac{r}{N}$
> $Var{X} = n\frac{r}{N}\left(1 - \frac{r}{N}\right)\left(\frac{N-n}{N-1}\right)$

Consider a hypergeometric random variable $X$ with parameter $(N, n, k)$. If $N$ and $k$ are relatively large compared to $n$, then $X$ approximately has a binomial distribution with parameter $(n, p)$ where $p = **k/N**$




***
