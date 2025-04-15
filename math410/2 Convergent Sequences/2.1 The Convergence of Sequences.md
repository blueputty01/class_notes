A **sequence** is any $f: **D \subseteq \mathbb{N} \rightarrow \mathbb{R}**$
	but usually just written as $a_n = f(n)$

A sequence $\{a_n\} \rightarrow a$ (converges to $a$) if **$\forall \epsilon > 0 \exists N \in \mathbb{N} \forall n \geq N, |a_n - a| < \epsilon$**
	$N$ depends only on parameter $\epsilon$

Comparison Lemma ("Squeeze Theorem")
Suppose $0\leq|a_{n}-a|\leq c(b_{n}-b)$. 
$\forall n \geq \mathbb{N}$ If **$b_n \rightarrow b$**, then **1::$a_n \rightarrow  a$**. 
+
Proof:
Fix $\epsilon > 0$. Fix $N_2$ such that $|b_{n}-b|<\frac{\epsilon}{c}$ for all $n \geq N_2$. Then if $N = \max(N_{1},N_{2}),\forall n\geq N |a_{n}-a|\leq c|b_{n}-b|\leq \epsilon$

---

If $a_n \rightarrow a$ and $b_n \rightarrow b$,
i. $a_n b_n \rightarrow ab$ 
ii. $a_n \pm b_n \rightarrow a \pm b$ (sum property)
iii. $\frac{a_n}{b_n} \rightarrow \frac{a}{b}$ if $b_n, b \neq 0$ (product property)
![|600](z_attachments/Pasted%20image%2020250204172326.png)
![|600](z_attachments/Pasted%20image%2020250204172454.png)

---

***
