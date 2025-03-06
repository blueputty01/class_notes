General case for tank problem with params:
Rate in: $r_1$
Concentration in: $c_1$
Rate out: $r_2$
Concentration out: $c_2$
Volume: $V(t)$
Amount of salt: $Q(t)$
+
$Q' = **r_1 c_1 - r_2 (\frac{Q(t)}{V(t)})** = r_{1}c_{1}-\frac{r_{2}Q(t)}{(r_{1}-r_{2})t+V_{0}}$
$V' = **r_1 - r_2** \Rightarrow **2::V(t) = (r_1 - r_2) t + V_0**$

General form for population growth: $p^{\prime}=**R(p)p+h(t)**$
> first term is growth rate, second term is harvest rate
> for the exponential model, h(t) = 0, R(p) = r = constant
> solution is therefore $P(t) = Ce^{rt}$. $C$ may be replaced by the initial condition $P_0$

***

Logistic model for population: 
**$R(p) = r - ap$**
Thus $\frac{dp}{dt} = **1::(r - ap)p**$

If we let $k = **\frac{r}{a}**$ denote the carrying capacity of the ecosystem then the logistic model can be expressed as:
**$\frac{dp}{dt} = r(1 - \frac{p}{k})p$**.
> quadratic and separable
> after math, we achieve $p(t) = \frac{k e^{rt} p_I}{k + (e^{rt} - 1) P_I}$
> can also append a $-h$ for ${\frac{\operatorname{d}\!p}{\operatorname{d}\!t}}=r\left(1-{\frac{p}{k}}\right)p-h$
> [notes](https://courses.math.umd.edu/math246/NODE/2223F/First-Lingual.pdf)

$m{\frac{\mathrm{d}w}{\mathrm{d}t}}=**F_{\mathrm{grav}}+F_{\mathrm{drag}}**$

If an object is moving through a denser medium (like water or oil), we can use the approximation $F_{\mathrm{grav}} = **\alpha m g**$
$\alpha$ is expressed in terms of the density of the object $\rho_{\mathrm{obj}}$ and the density of the medium $\rho_{\mathrm{med}}$ as $\alpha = **\frac{\rho_{\mathrm{obj}}-\rho_{\mathrm{med}}}{\rho_{\mathrm{obj}}+\rho_{\mathrm{med}}}**$
> $\alpha$ is called the Atwood number
> It is near 1 when ρmed is much smaller than ρobj.
> It is negative when ρmed is greater than ρobj.
> It is near −1 when ρmed is much greater than ρobj.
> When α is negative gravity will cause the the object to rise because it is lighter than the surrounding medium. For example, a ping pong ball released under water will rise. In that case the Atwood number is very close to −1.

Viscous drag can be modeled as $F_{\mathrm{drag}} = **-b v**$
> where $b$ is a nonnegative constant

Turbulent drag can be modelled as $F_{\mathrm{drag}} = **-c |v| v**$
> where $c$ is a nonnegative constant

Terminal velocity occurs when **$v'=0$**

***
