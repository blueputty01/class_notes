We say $f: D \rightarrow \mathbb{R}$ is **uniformly continuous** on $D$ if for any sequences **$\{u_n\}$, $\{v_n\}$ in $D$, $\{u_{n}-v_{n}\}\rightarrow0\Rightarrow\{f(u_{n})-f(v_{n})\}\rightarrow0$**
> ie as $x$ values get close together, so does $y$
> note that $\{u_n\}, \{v_n\}$ don't need to converge

Theorem: If $f: D \rightarrow \mathbb{R}$ is uniformly continuous on $D$, then $f$ is **(pointwise) continuous on $D$**.
+
Proof: 
{{c1::Choose any $x_0 \in D$, and a sequence $\{x_n\}$ converging to $x_0$.
Then $\{x_n\}$ is a sequence in $D$, and $\{x_n - x_0\} \rightarrow 0$, so $\{f(x_n) - f(x_0)\} \rightarrow 0$. Thus $\{f(x_n)\} \rightarrow f(x_0)$, so $f$ is continuous at $x_0$.}}
> however, it is not the case that continuity implies uniform continuity

Theorem: A continuous function $f: [a,b] \rightarrow \mathbb{R}$ is **uniformly continuous** on $[a,b]$.
> skipping proof for now; we'll need this theorem later when using the Darboux integral in chapter 6
> note that the interval is closed and bounded
> only appies on closed and bounded intervals

Suppose $f'$ exists. If **$|f'(x)| \leq M$** for all $x \in [a,b]$, then $f$ is uniformly continuous on $[a,b]$.
> $|f(u) - f(v)| = |f'(c)||(u-v|| \leq M \leq M | u - v|$
> Thus if $\{u_{n}-v_{n}\}\rightarrow0$, we get $\{f(n_{n}-f(u_{n}))^{2}\}>0$
> this is useful to find counterexamples (anything where x is close to where the derivative is unbounded will probably work)

***
