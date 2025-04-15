Integration by parts:
Conditions: 
**$g,f:[a,b]\rightarrow \mathbb{R}$ continuous** 
**1::$g', f'$ continuous**
**$\int_{a}^{b}f(x)g^{\prime}(x)dx=-\int_{a}^{b}f^{\prime}(x)g(x)dx+f(x)g(x)\int_{x=a}^{x=b}$**
+
Proof:
**$(fg)^{\prime}(x)=f(x)g^{\prime}(x)+f^{\prime}(x)g(x)$**
Thus **3::$\int_a^b[hg^{\prime}+gh^{\prime}]=\int_a^b(hg)$**

---

multivariate:

$\iiint_D f \nabla \cdot \vec{g}\, dv = -\iiint_D \nabla f \cdot \vec{g}\, dv + \iint_{\partial D} f \vec{g} \cdot \hat{n}\, ds$

$D \subseteq \mathbb{R}^3$ with $\hat{n}$ being the unit normal vector
$\partial D \subset \mathbb{R}^3$ is the boundary of $D$

---

Integration by substitution: 
Conditions: $f:[a,b]\rightarrow \mathbb{R}$ **1::$g:[c,d]\rightarrow \mathbb{R}$**, both continuous
**1::$g'$ bounded and continuous on $(c, d)$**
**1::Range of $g \subset [a, b]$** 
Thus **$\int_{c}^{d}f(\underbrace{g(t)}_{u})g^{\prime}(t)dt=\int_{g(c)}^{g(d)}f(u)du$**.
+
Proof: 
**3::$H(x)=\int_{c}^{x}f(g(t))g(t)dt-\int_{g(c)}^{g(x)}f(x)du$**
**3::$H^{\prime}(x)=f(g(x))g^{\prime}(x)-f(g(x))g^{\prime}(x)=0$**
**3::$\implies H(x) = \textrm{constant}$** 
Since **3::$H(c)= 0$**, **3::$H(x) = 0$**

***
