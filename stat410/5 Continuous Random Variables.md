A continuous random variable takes on values of a(n) **uncountable** set. 

***

To find the distribution for a transformed random variable say $g(X)=X^2$, find **the CDF of the function**.
Alternatively: $f_{y}(y)\approx**\frac{Y\left(Y\in\left[y,y+h\right)\right)}{h}**$

***

To integrate $f(x|\mu,\sigma^2)=\frac1{(2\pi)^{1/2}\sigma}\exp\left[-\frac12\left(\frac{x-\mu}\sigma\right)^2\right]$ from $-\infty$ to $+\infty$, use **change of variable for $u = \frac{x- \mu}{\sigma}$**
+
To compute the Gaussian integral $\int_{-\infty}^{\infty}e^{-x^2}dx$, **take the square and use polar coordinates**
	$\left(\int_{-\infty}^{\infty}e^{-x^2}\right.dx)^2=\int_{-\infty}^{\infty}e^{-x^2}dx\int_{-\infty}^{\infty}e^{-y^2}dy=\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}e^{-\left(x^2+y^2\right)}dxdy.$
	![](z_attachments/Pasted%20image%2020250408114428.png)
	[Proof: Integral of PDF of Normal Distribution is Equal to 1 (in English)](https://www.youtube.com/watch?v=8Ey7v8IoZjA)
***

The DeMoivre-Laplace limit theorem: states that as $n \to \infty$, the distribution of the binomial random variable approaches the **normal distribution**.
> For poisson, Bin(n, C / n)

***

Correction to approximation of binomial distribution using normal curve: **$\approx P\left(Z\leq\frac{x+0.5-np}{\sqrt{npq}}\right)\\\approx P\left(Z\leq\frac{x+0.5-np}{\sqrt{npq}}\right)$**
	![](z_attachments/Pasted%20image%2020250415111144.png)

The **exponential** distribution describes **the time until the occurrence of a Poisson event (or the time between Poisson events)**.

The **gamma** distribution describes **the time (or space) occurring until a specified number of Poisson events occur**.
> $f(x|\alpha,\beta) = \frac{1}{\beta^\alpha \Gamma(\alpha)}x^{\alpha-1}e^{-x/\beta}$ for $x > 0$
> $F(w)=1-P(\text{fewer than α events in }[0,w])$
> $F(w)=1-\sum_{k=0}^{\alpha-1}\frac{(\lambda w)^ke^{-\lambda w}}{k!}$
> we get the pdf after taking the derivative

Gamma function generalizes **factorials** to all real numbers.
> $\Gamma(\alpha)=\int_0^\infty x^{\alpha-1}e^{-x}dx$
> $\Gamma(\alpha)=x^{\alpha-1}e^{-x}|_0^\infty+\int_0^\infty(\alpha-1)x^{\alpha-2}e^{-x}dx=(\alpha-1)\int_0^\infty x^{\alpha-2}e^{-x}dx$
> $\Gamma(\alpha)=(\alpha-1)\Gamma(\alpha-1)$

Let $X$ be the amount of time until the first arrival in a Poisson process with rate $\lambda$. Then $X ∼ \operatorname{Exp}(1/\lambda)$.
Reference:
Exponential pdf: $f(x|\lambda) = \frac{1}{\beta}e^{-x/\beta}$ for $x > 0$
Proof:
$\begin{aligned}F(x)&=P(X\leq t)\\&=1-P(\text{no arrivals in }[0,t])\\&=1-\frac{e^{-\lambda t}(\lambda t)^0}{0!}\\&=1-e^{-\lambda t}\end{aligned}$
**Take derivative, $\lambda e^{-\lambda t}$**

***
