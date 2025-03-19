If $y^{(n)}+a_{n-1}y^{(n-1)}+\cdots+a_{0}y=0$, then **$p(z)=z^{n}+a_{n-1}z^{n-1}+\cdots+a_{1}z+a_{0}$** is the **characteristic polynomial** of the ODE. 
+
If $p(r) = 0$, then $y=**e^{rt}**$ is a solution to the ODE.
+
Because:
Plug **3::$y=e^{zt}$** into the ODE, get **$z^{n}e^{zt}+a_{n-1}\cdot z^{n-1}e^{zt}+\cdots+\:a_{0}\:e^{zt}=0$**
Then **4::$p(z)e^{zt} = 0 * e^{zt} = 0$**

Solutions for characteristic polynomial of $y^{(n)}+a_{n-1}y^{(n-1)}+\cdots+a_{0}y=0$
Simple real roots case ($p(z) = (z - r_1)(z-r_2) \cdots (z - r_n)$):
**$e^{r_1t},\cdots,e^{r_nt}$**
Real roots with multiplicity $> 1$ case ($p(z) = (z-r)^k q(z)$, ie $r$ has multiplicity $k$):
**$e^{rt},te^{rt},\ldots,t^{k-1}e^{rt}$**
