Theorem: if $f: [a, b] \to \mathbb{R}$ is **continuous**, then $\int_a^b f$ exists. 
Proof:
$f$ is **uniformly** continuous because **2::the domain is compact**
$\forall \epsilon > 0 \exists \delta > 0 \forall x,y\in[a,b]$ if $|x - y| < \delta$, then $|f(x)-f(y)| < **\frac{\epsilon}{b-a}**$
Fix *t.*uniform** partitions $\{P_n\}_{n=N}^{\infty}$, so $\Delta x_i = **4::\frac{b-a}n**$
Goal: 
Prove that there is an Archimedes sequence of partitions and apply the Archimedean-Riemann Theorem
$0\leq U(f,P_{n})-L(f,P_{n})=\sum_{i=1}^{n}[\sup\limits_{[x_{i-1}, x_i]} f(x)-\inf\limits_{[x_{i-1}, x_i]} f(x)]\Delta x_{i}$
By **Extreme Value Theorem**, we can rewrite as
**5::$=\frac{b-a}{n}\sum_{i=1}^{n}(f(u_{i})-f(u_{i}))$**
Which we can bound as
$\leq**\frac{b-a}{n}\max_{1 \leq i\leq n}\left|f(u_{i})-f(v_{i})\right|\cdot n**$
We rewrite as **$=(b-a)|f(u_{i_0})-f(v_{i_0})|$** for some **6::$i \in \{1 \cdots n\}$**
We can then bound this by **$(b-a)\frac{\epsilon}{b-a} < \epsilon$** , if $|u_{i_0} - v_{i_0} < \delta$.
This is done by choosing $N$ such that **$\frac{b-a}{N} < \delta$ ($N > \frac{b-a}{\delta}$)**.
Since $\epsilon > 0$ is arbitrary, we conclude that $\{N(f,p_{1})-L(f_{1}p_{2})\}\rightarrow0$ as $n \rightarrow \infty$ by Squeeze Theorem. Apply the Archimedean-Riemann Theorem, so $\int_a^b$ exists.

Theorem: Let $f: [a, b] \to \mathbb{R}$ be continuous on $(a, b)$ and bounded on $[a, b]$. 
Then $\int_a^b f$ exists, and the value does not depend on **$f(a)$ or $f(b)$**.
Proof:
Full proof skipped but the idea is as follows:
Define the partition $P_n^*$ on $[a+\frac1n,b-\frac1n]$, then $P_{n}=P_{n}^{*}\cup\{a,b\}$. 
Note that $P_n^*$ does not depend on $a, b$ explicitly. We can prove $P_n^*$ is **Archimedean** for $f$ on $[a, b]$ and $U(f, P_n^*) \rightarrow \int_a^b f$ as $n \rightarrow \infty$. 

***