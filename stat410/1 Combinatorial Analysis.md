Pascal's identity for $\binom{n}{k} = **\binom{n- 1}{k - 1} + \binom{n-1}{k}**$
	number of cases for when first is chosen (so k-1 number of objects to choose) + number of cases for when first is not chosen (k objects to choose)

Number of subset identity: $**2^n** = \sum^n_{k = 0} \binom{n}{k}$
	done by setting x, y = 1 in binomial theorem $(x+y)^n = \sum_{k=0}^n {n \choose k}x^{n-k}y^k = \sum_{k=0}^n {n \choose k}x^{k}y^{n-k}$

Proof for multinomial coefficient identity: 
For a set of $n$ distinct items to be divided into $r$ distinct groups of respective sizes $n_1, n_2, \cdots , n_r$: first group has **$\binom{n}{n_1}$** possible choices, second group has **$\binom{n - n_1}{n_2}$** possible choices, etc so **the factors cancel out**.
	![](z_attachments/Pasted%20image%2020250131160312.png)

***

The binomial theorem $(x+y)^n = \sum_{k=0}^n {n \choose k}x^{n-k}y^k = \sum_{k=0}^n {n \choose k}x^{k}y^{n-k}$ can be proved via **induction**.

---

for $n=1$ we have 
$${{(x+y)}^{\,1}}=\ 1\ =\sum\limits_{i=0}^{1}{\left( \begin{matrix}
   1  \\
   0  \\
\end{matrix} \right)}\,{{x}^{1-i}}{{y}^{i}}=\left( \begin{matrix}
   1  \\
   0  \\
\end{matrix} \right)\,{{x}^{1}}+\left( \begin{matrix}
   1  \\
   1  \\
\end{matrix} \right)\,{{y}^{1}}=x+y$$

for $n=k$ let
$$(x+y){{\,}^{k}}=\ \sum\limits_{i=0}^{k}{\left( \begin{matrix}
   k  \\
   i  \\
\end{matrix} \right)}\ {{x}^{k-i}}{{y}^{i}}$$

for $n=k+1$ we show
$$\left( x+y \right){{\,}^{k+1}}\,=\ \sum\limits_{i=0}^{k+1}{\left( \begin{matrix}
   k+1  \\
   i  \\
\end{matrix} \right)}\ {{x}^{k-i+1}}{{y}^{i}}$$
**proof**

$$\left( x+y \right){{\,}^{k}}\left( x+y \right)\ =\ \left( x+y \right)\ \sum\limits_{i=0}^{k}{\left( \begin{matrix}
   k  \\
   i  \\
\end{matrix} \right)\ {{x}^{k-i}}}\ {{y}^{i}}\quad $$
as a result
$$\left( x+y \right){{\,}^{k+1}}=\sum\limits_{i=0}^{k}{\,\,\,\left( \begin{matrix}
   k  \\
   i  \\
\end{matrix} \right)}\ {{x}^{k\,-\,i\,\,+\,1}}{{y}^{i}}\ +\,\sum\limits_{i=0}^{k}{\,\,\left( \begin{matrix}
   k  \\
   i  \\
\end{matrix} \right)}\ {{x}^{k\,-\,i}}{{y}^{i\,+\,1}}$$

$$\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\, =x\sum\limits_{i=0}^{k}{\left( \begin{matrix}
   k  \\
   i  \\
\end{matrix} \right)}\ {{x}^{k-i}}{{y}^{i}}+y\ \sum\limits_{i=0}^{k}{\left( \begin{matrix}
   k  \\
   i  \\
\end{matrix} \right)}\ {{x}^{k-i}}{{y}^{i}}
$$
By expanding the last equation
$$\begin{align}
  & {{\left( x+y \right)}^{\,k+1}}\ =\,\left( \begin{matrix}
   k  \\
   0  \\
\end{matrix} \right)\,\,{{x}^{\,k+1}}\,\,+\,\,\left( \begin{matrix}
   k  \\
   1  \\
\end{matrix} \right)\,\,{{x}^{k}}y+\cdots +\,\left( \begin{matrix}
   k  \\
   k-1  \\
\end{matrix} \right)\,\,{{x}^{2}}{{y}^{k-1}}+\left( \begin{matrix}
   k  \\
   k  \\
\end{matrix} \right)\,\,x{{y}^{k}} \\ 
 & \,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\, \\ 
\end{align}$$
$$\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,\,+\left( \begin{matrix}
   k  \\
   0  \\
\end{matrix} \right)\,\,{{x}^{k}}y+\cdots +\,\left( \begin{matrix}
   k  \\
   k-2  \\
\end{matrix} \right)\,{{x}^{2}}{{y}^{k-1}}+\,\left( \begin{matrix}
   k  \\
   k-1  \\
\end{matrix} \right)\,\,x{{y}^{k}}+\,\left( \begin{matrix}
   k  \\
   k  \\
\end{matrix} \right)\,\,{{y}^{k+1}}$$
we know$$\left( \begin{matrix}
   k  \\
   i  \\
\end{matrix} \right)=\left( \begin{matrix}
   k-1  \\
   i  \\
\end{matrix} \right)+\left( \begin{matrix}
   k-1  \\
   i-1  \\
\end{matrix} \right)$$
then
$$\,\left( x+y \right){{\,}^{k+1}}\,=\ \sum\limits_{i=0}^{k+1}{\left( \begin{matrix}
   k+1  \\
   i  \\
\end{matrix} \right)}\ {{x}^{k-i+1}}{{y}^{i}}$$

---
***
