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
