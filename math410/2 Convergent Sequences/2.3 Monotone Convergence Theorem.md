$\{x_{n}\}_{n\geq1}$ is **increasing** if $x_{n+1}\geq x_{n}\forall{n}$ 

$\{x_{n}\}_{n\geq1}$ is **decreasing** if $x_{n+1}\leq x_{n}\forall{n}$

If $\leq, \geq$ in the monotone definitions were to be replaced by $>$ and $<$, then the sequences are **strictly** monotone.

Monotonic Convergence Theorem (MCT):
Let $\{x_n\}$ be monotone. Then the sequence converges if and only if **it is bounded**. Furthermore:
i. If bounded above and monotone increasing, then **$x_n \rightarrow \sup x_n$**
ii. If bounded above and monotone decreasing, then **$x_n \rightarrow \inf x_n$**
+
Proof of (ii):
WLOG we prove case (i). **If (i) holds then we have that (ii) follows. Suppose $x_{n}$ is monotone decreasing. Then, $y_{n} = -x_{n}$ is monotone increasing. Note that this implies that $y_{n}$ converges to its supremum, which implies that $-x_{n} \rightarrow \sup(-x_{n})$ = $-\inf(x_{n})$. Hence we have that $x_{n} \Rightarrow \inf(x_{n})$.**
Proof of (i):
**use alternative definition for supremum and rearrange to form convergence bounds** 
> ![](z_attachments/proof%20of%20MCT.png)

Theorem: if **$|c| < 1$**, $\{C^n\} \rightarrow 0$

***
