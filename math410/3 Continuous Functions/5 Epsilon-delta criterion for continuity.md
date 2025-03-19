We say that a function $f: D \rightarrow \mathbb{R}$ satisfies **the $\epsilon-\delta$ criterion at $x_0 \in D$** if $\forall \epsilon > 0 \: \exists \delta > 0 \: \forall x \in D$, if **$|x - x_0| < \delta$**, then **1::$|f(x) - f(x_0)| < \epsilon$.**
> this is equivalent ($\iff$) to the sequential definition of continuity at $x_0$
> ie "$y$ vals can be close considering $x$ vals are close"
> proof: 
> Suppose that $f: D \rightarrow \mathbb{R}$ is continuous at $x_0$. We will argue by contradiction to verify the $\epsilon-\delta$ criterion at the point $x_0$. Suppose that this criterion does not hold. Then there is some $\epsilon_0 > 0$ such that there does not exist $\delta > 0 \exists x \in D$ for which $\epsilon = \epsilon_0$ $|x - x_0| < \delta$ and $|f(x) - f(x_0)| < \epsilon_0$. Thus for each point $x$ in $D$, $|x-x_0| < \frac{1}{n}$ but $|f(x) - f(x_0)| \geq \epsilon_0$. Choose such a point and label it $x_n$. This defines a sequence $\{x_n\}$ in $D$ that converges to $x_0$. But by the continuity of $f: D \rightarrow \mathbb{R}$ at $x_0$, $\{f(x_n)\}$ converges to $f(x_0)$. This clearly contradicts the assertion that $|f(x_n) - f(x_0) \geq \epsilon_0$ for every index $n$. Thus, the $\epsilon-\delta$ criterion at the point $x_0$ holds. Suppose that $f$ satisfies the $\epsilon-\delta$ criterion at $x_0$. Let $\{x_n\}$ be a sequence in $D$ that converges to $x_0$. Then for each $n$, there exists $\delta_n > 0$ such that $|x_n - x_0| < \delta_n$ implies $|f(x_n) - f(x_0)| < \frac{1}{n}$. Since $\delta_n \rightarrow 0$ as $n \rightarrow \infty$, we have $|f(x_n) - f(x_0)| \rightarrow 0$ as $n \rightarrow \infty$. Thus, $f$ is continuous at $x_0$.

We say $f: D \rightarrow \mathbb{R}$ satisfies **the $\epsilon-\delta$ criterion on $D$** if **for all $\epsilon > 0$, there exists $\delta > 0$ such that for all $x, y \in D$, if $|x - y| < \delta$, then $|f(x) - f(y)| < \epsilon$**.

Theorem: The $\epsilon-\delta$ criterion on $D$ is equivalent to **uniform continuity** on $D$.
> proof: exercise

***

Prove that $f(x) = x^2$ is continuous at any $x_0$:
Let $\delta = 1.$ Then $|x| - |x_0| \leq |x - x_0| < 1$ by reverse triangle inequality. Thus **$|x| < |x_0| + 1$**
We also have $|x^2 - x_0^2| **\leq |x - x_0| |x + x_0|**$
By triangle inequality, $|x + x_0 \leq **|x| + |x_0| < 2 |x_0| + 1**$, so $|x^2 - x_0^2 \leq \delta (2 |x_0| + 1) < \epsilon$ by choosing $\delta = **\min{(\frac{\epsilon}{2 | x_0| + 1}, 1)}**$ 

***

Prove that $f(x) = \sqrt{x}$ is continuous at any $x_0$:
**$|\sqrt{x}-\sqrt{x_{0}}|=|\sqrt{x}-\sqrt{x_{0}}|\frac{|\sqrt{x}+\sqrt{x_{0}}|}{|\sqrt{x}+\sqrt{x_{0}}|} = \frac{|x-x_{1}|}{\sqrt{x}+\sqrt{x_{0}}}$::rearranging**
**$\frac{|x-x_{1}|}{\sqrt{x}+\sqrt{x_{0}}} <\frac{\delta}{\sqrt{x}+\sqrt{x_{0}}}<\frac{\delta}{\sqrt{x_{0}}}<\epsilon$::inequalities** which is valid if $\delta < **\epsilon \sqrt{x_0}**$
> depends on $x_0$, so this only proves continuity

To prove uniform continuity for $\sqrt{x}$:
$|\sqrt{x} - \sqrt{x_0}|^2 = **|\sqrt{x}-\sqrt{x_{0}}||\sqrt{x}-\sqrt{x_{0}}|**\leq**1::|\sqrt{x}-\sqrt{x_{0}}||\sqrt{x}-\sqrt{x_{0}}|** = **1::|x - x_0|** < \delta < \epsilon**$ by choosing $\delta < **\epsilon^2**$ 

***

Prove that if $|f(u) - f(v)| \leq C |u -v|^\alpha$ for some $C > 0$ and $\alpha \in (0,1]$, then $f$ is continuous on $D$:
**$\delta < \left(\frac{\epsilon}{C}\right)^{1 / \alpha}$** 

***
