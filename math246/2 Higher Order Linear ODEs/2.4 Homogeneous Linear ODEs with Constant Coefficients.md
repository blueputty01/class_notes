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

Solutions for characteristic polynomial of $y^{(n)}+a_{n-1}y^{(n-1)}+\cdots+a_{0}y=0$
Real roots with multiplicity $> 1$ case ($p(z) = (z-r)^k q(z)$, ie $r$ has multiplicity $k$):
**$e^{rt},te^{rt},\ldots,t^{k-1}e^{rt}$**

Euler's formula: **$e^{i\theta} = cos\theta + i  \sin \theta$**

Solutions for characteristic polynomial of $y^{(n)}+a_{n-1}y^{(n-1)}+\cdots+a_{0}y=0$
When $r \pm si$ is a root of $p(z)$, we have solutions **$e^{rt}\cos(st),~e^{rt}\sin(st)$**
> since $\begin{aligned}e^{(s+si)t}&=e^{rt+st-i}\\&=e^{rt}e^{i(st)}\\&=e^{rt}\left(\cos(st)+i\sin(st)\right)\\&=e^{rt}\cos(st)+ie^{rt}\sin(st),\end{aligned}$
> let's do something similar for $r-si$
> $\begin{array}{c}{{e^{(r-s)t}=...=e^{rt}\cos(-st)+ie^{rt}\sin(-st)}}\\{{=e^{rt}\cos(st)-ie^{rt}\sin(st)}}\\\end{array}$
> adding them together (since we know linear combinations are solutions)

Solutions for characteristic polynomial of $y^{(n)}+a_{n-1}y^{(n-1)}+\cdots+a_{0}y=0$
If $r \pm si$ has multiplicity $k$, ($\left((z-r)^{2}+s^{2}\right)^{k}$ is a factor of $p(z)$):
**$e^{rt}\cos(st),~e^{rt}\sin(st),~te^{rt}\cos(st),~te^{rt}\sin(st),\ldots t^{k-1}e^{rt}\cos(st),~t^{k-1}e^{rt}\sin(st)$**

***
