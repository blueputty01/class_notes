Leontief Input-Output model:
Suppose an economy is divided into sectors A, B, C and each produces a product. 
For a sector to produce its product, it must consume some of its own product as well as some of the other products.

---

Ex:

Suppose:
- To produce 1 unit of product A, it takes:
	- 0.2 units of product A
	- 0.15 units of product B
	- 0.1 units of product C
- To produce 1 unit of product B, it takes:
	- 0.25 units of product A
	- 0.05 units of product B
- To produce 1 unit of product C, it takes:
	- 0.2 units of product B
	- 0.1 units of product C

Each product has a consumption vector

$\left[\begin{matrix}0.2\\0.15\\0.1\end{matrix}\right]$
$\left[\begin{matrix}0.25\\0.05\\0\end{matrix}\right]$
$\left[\begin{matrix}0\\0.2\\0.1\end{matrix}\right]$

To produce 40 units of B, we consume $40\left[\begin{matrix}0.25\\0.05\\0\end{matrix}\right]=\left[\begin{matrix}10\\2\\0\end{matrix}\right]$, ie 10 units of A and 2 units of B

Producing $P_A$ units of $A$, $P_B$ units of $B$, and $P_C$ units of $C$ consumes $P_A \left[\begin{matrix}0.2\\0.15\\0.1\end{matrix}\right] P_B \left[\begin{matrix}0.25\\0.05\\0\end{matrix}\right]P_C \left[\begin{matrix}0\\0.2\\0.1\end{matrix}\right]$ (a linear combination)

This equals $\begin{bmatrix}0.2&0.25&0\\0.15&0.05&0.2\\0&0.05&0.2\\0&0.1\end{bmatrix}\begin{bmatrix}P_A\\P_B\\P_B\\P_B\end{bmatrix}$

$M$ is the consumption matrix

$M_{\vec{p}}$ gives the amounts consumed in producing $\vec{p}$. After production, we have $\vec{p} - M\vec{p}$ remaining. 

---