**Mean Value Theorem::Theorem Name**
Let **$f$ be continuous on $[a,b]$ and differentiable on $(a,b)$**. Then **there exists a number $c$ in $(a,b)$ such that $f'(c) = \frac{f(b) - f(a)}{b - a}$**.
+
Proof:
We want to **transform $f$ such that the endpoints of $f(x)$ are equal to apply Rolle's theorem**.
**Create the function $h(x) = f(x) + mx$ for some $m \in \mathbb{R}$**
**Set $h(a) = h(b)$, so $f(a) + ma = f(b) + mb$** 
Rearranging, **6::$m(a-b) = f(b) - f(a)$**
So $m = **6::-\frac{f(b) - f(a)}{b - a}** $ 
Applying **Rolle's Theorem to $h(x)$**, we get:
**$\exists x_0 \in (a,b)$ such that $h'(x_0) = 0$** 
After some algebra, we get the result.
> ![](z_attachments/mvt.png)
> note that $x_0$ is not necessarily unique
> $h'(x_0) = \f$

