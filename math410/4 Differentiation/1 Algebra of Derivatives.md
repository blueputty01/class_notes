If **$\operatorname*{lim}_{h\rightarrow0}\frac{f(x_{0}+h)-f(x_{0})}{h} \equiv \operatorname*{lim}_{x\rightarrow x_{1}}\frac{f(x)-f(x_{0})}{x-x_{1}} = h$ exists** then we say $I \rightarrow \mathbb{R}$ is differentiable and define $f'(x_{0}) = h$.
> Note that in the limits $x \rightarrow x_0, h \rightarrow 0$, $x_0$ and $0$ are limit points

Proof for product rule, ie $(fg)'(x) = f'g + fg'$:
$(fg)^{\prime}(x)=**\lim_{x\to x_0}\frac{f(x)g(x)-f(x_0)g(x_0)}{x-x_0}**$
**$=\lim_{x\to x_0}\frac{f(x)g(x)-f(x_0)g(x_0)+f(x)g(x_0)-f(x)g(x_0)}{x-x_0}$**
**$=\lim_{x\to x_0}\frac{f(x)(g(x)-g(x_0))+g(x_0)(f(x)-f(x_0))}{(x-x_0)}$**
**$=\operatorname*{lim}_{x\rightarrow x_{0}}f(x)\frac{g(x)-g(x_{0})}{x-x_{0}}+\operatorname*{lim}_{x\rightarrow x_{0}}g(x_{0})\frac{f(x)-f(x_{0})}{x-x_{0}}$**
**$=f(x_0)g'(x_0) + g(x_0)f(x_0)$**
> last line assumes that $f$ is continuous at $x_0$. We prove this in another card

Theorem: If $I$ is a(n) **open** interval, $f: I \rightarrow \mathbb{R}$, $x_0 \in I$, and $f'(x_0)$ exists, then $f$ is **continuous** at $x_0$.

Proof:
**$f(x) - f(x_0) = \frac{f(x) - f(x_0)}{x - x_0} (x - x_0) \rightarrow f'(x_0) \cdot 0 = 0$ as $x \rightarrow x_0$.**
> the quantity $\frac{f(x) - f(x_0)}{x - x_0}$ exists because $f'(x_0)$ exists, which is why we need the restriction that $f'(x_0)$ exists



***
