General form for Non-homogeneous Linear ODEs with constant coefficients: 
$L(y)=y^{(n)}+a_{n-1}y^{(n-1)}+\ldots+a_{1}y^{1}+a_{0}y=f(t)$
where $\begin{aligned}f(t)&=**(\alpha_{d}t^{d}+\alpha_{d-1}t^{d-1}+\cdots+\alpha_{d})e^{rt}\cos(st)\\&+(\beta_{d}t^{d}+\beta_{d-1}t^{d-1}+-+\beta_{0})e^{rt}\sin(st).\end{aligned}**$
+
If **$f(t)=(\alpha_{d}t^{d}+\cdots+\alpha_{0})e^{rt}$; $r$ has a multiplicity $m$ as a root of $p(z)$** 
Guess $Y_p(t) = **(A_{d}t^{d}+\ldots+A_{0})t^{m}e^{rt}**$ 
+
If **$f(t)=\alpha e^{rt}\cos(st)+\beta e^{rt}\sin(st)$**
Guess $Y_{p}(t)=**At^{m}e^{rt}\cos(st)+Bt^me^{rt}\sin(st)**$
> ie polynomial $\times$ exponential $\times$ trig
> to check multiplicity solve the characteristic polynomial and check against $r$
> ![](z_attachments/Pasted%20image%2020250331210020.png)

If $f(t)$ is of composite form, eg $f(t)=e^{2t}+9\cos(5t)$:
Approach: **Split $f(t)$ into parts (works because it's linear)**

Key Identity approach to solving non-homogeneous linear ODEs with constant coefficients:
**$L(e^{zt})=p(z)e^{zt}$**
**$L(te^{zt})=(p^{\prime}(z)+p(z)t)e^{zt}$**
**$L(t^{2}e^{zt})=(p^{\prime\prime}(z)+2p^{\prime}(z)t+p(z)t^{2})e^{zt}$**
The coefficients are the **coefficients in the binomial expansion (Pascal triangle)**
Once **2::the necessary power is reached**, stop and **2::take a proportion of the left side/linear combination with a previous result to produce the result**
> $\begin{aligned}\mathrm{L}\big(e^{zt}\big)&=p(z)e^{zt},\\\mathrm{L}\big(t\:e^{zt}\big)&=p(z)\:t\:e^{zt}+p^{\prime}(z)\:e^{zt}\:,\\\mathrm{L}\big(t^2e^{zt}\big)&=p(z)\:t^2e^{zt}+2p^{\prime}(z)\:t\:e^{zt}+p^{\prime\prime}(z)\:e^{zt},\\\mathrm{L}\big(t^3e^{zt}\big)&=p(z)\:t^3e^{zt}+3p^{\prime}(z)\:t^2e^{zt}+3p^{\prime\prime}(z)\:t\:e^{zt}+p^{\prime\prime\prime}(z)\:e^{zt}\:,\\\mathrm{L}\big(t^4e^{zt}\big)&=p(z)\:t^4e^{zt}+4p^{\prime}(z)\:t^3e^{zt}+6p^{\prime\prime}(z)\:t^2e^{zt}+4p^{\prime\prime\prime}(z)\:t\:e^{zt}+p^{(4)}(z)\:e^{zt}\:.\end{aligned}$



***
