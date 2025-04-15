**Cauchy Mean Value Theorem::Theorem Name** 
Let $f$ and $g$ be continuous on $[a, b]$, differentiable on $(a, b)$, and $g'\neq0$, then $\exists t_0 \in (a, b)$ such that $\frac{f^{\prime}(t_0)}{g^{\prime}(t_0)}=\frac{f(b)-f(a)}{g(b)-g(a)}$
+ 
Proof:
Same as MVT proof, except 
let $h(x)=**f(x) + mg(x)**$.
> same as MVT proof but instead of rotating the entire line, we are only rotating the endpoints of $f(x)$
> We want to transform $f$ such that the endpoints of $f(x)$ are equal to apply Rolle's theorem.
> Create the function $h(x) = f(x) + mx$ for some $m \in \mathbb{R}$
> Set $h(a) = h(b)$, so $f(a) + ma = f(b) + mb$ 
> Rearranging, $m(a-b) = f(b) - f(a)$
> So $m = -\frac{f(b) - f(a)}{b - a}$ 
> Applying Rolle's Theorem to $h(x)$, we get:
> $\exists x_0 \in (a,b)$ such that $h'(x_0) = 0$ 
> $h'(x_0) = f'(x_0) + m = 0$ 
> $\implies f'(x_0) = -m = \frac{f(b) - f(a)}{b - a}$
> note that $x_0$ is not necessarily unique

**"Remainder" Theorem::Theorem Name**
Let $f: I \rightarrow \mathbb{R}$ be n-times differentiable, $I$ an open interval containing $x_0$ such that **$f(x_0) = f'(x_0) = \cdots = f^{n-1}(x_0) = 0$**
Then, **$\forall x \in I\backslash \{x_0\}, \exists z$ between $x$ and $x_0$ such that $f(x) = \frac{(x - x_0)^n}{n!}f^{(n)}(z)$**
+
Proof: 
**Let $g(x) = (x - x_0)^n$** 
Note that 
$$
\begin{align*}
g(x_0) &= **0**, \\
g'(x_0) &= **0**, \\
g''(x_0) &= **0**, \\
&\vdots \\
g^{(n-1)}(x_0) &= **0**, \\
g^{(n)}(x_0) &= **n!**, \\
g^{(n+1)}(x_0) &= **0**, \\
g^{(n+2)}(x_0) &= **0**, \\
&\vdots \\
\end{align*}
$$
Thus **$\frac{f(x) - f(x_0)}{g(x) - g(x_0)} = \frac{f'(x_1)}{g'(x_1)} = \frac{f'(x_1) - f'(x_0)}{g'(x_1) - f'(x_0)}$ for $x_1 \in (x, x_0)$** by **Cauchy MVT**
Expanding, **$\frac{f'(x_1) - f'(x_0)}{g'(x_1) - f'(x_0)} = \frac{f''(x_2)}{g''(x_2)} = \cdots = \frac{f^{(n)}(x_n)}{g^{(n)}(x_n)} = \frac{f^{(n)}(z)}{n!}$** for $z \in (x_0, x)$
Thus $f(x) = \frac{(x - x_0)^n}{n!}f^{(n)}(z)$
> Recall the Taylor Series Expansion
$f(x) = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \cdots + \frac{f^{(n)}(c)}{n!}(x-a)^n$
> with $c \in (x, a)$
> for each $g^k$ where $k < 0$, power rule states that the $k$ is brought down the coefficient, resulting in $k * (k - 1) \cdots$. At $k = n$, the linear term disappears as well. After that, the derivative of a constant is $0$
> Justin Wyss-Gallifent calls it the Function Boundary Theorem



***
