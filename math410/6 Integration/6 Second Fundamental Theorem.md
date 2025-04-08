Definition:
$\int_{b}^{a}f=-\int_{a}^{b}f$
So that $0=\int_{a}^{a}f=**\int_{a}^{b}f+\int_{b}^{a}f**$

**Second Fundamental Theorem of Calculus::Theorem Name**
Conditions: **$f\in C[a,b]$**
Then:
- $\frac{d}{dx}\int_{a}^{x}f(t)dt=**f(x)**$
- $\frac{d} {dx}\int_{a}^{h(x)}f(t)=**2::f(h(x))h(x)**$
+
Proof:
Let **$F(x)=\int_{a}^{x}f(t)dt$. We want $F^{\prime}(x_0)$:**
Let **3::$x_{n}\rightarrow x_{0}\in[a,b]\setminus\{x_{0}\}$**
By definition, **4::$F(x_{n})-F(x_{0})=\int_{a}^{x_{n}}f(t)dt-\int_{a}^{x_{0}}f(t)dt$**
Which simplifies to **4::$\int_{x_0}^{x_n}f(t)dt$**
Which equals **5::$=f(c_n)\int_{x_0}^{x_n}dt=f(c_n)(x_n-x_0)$** by **5::Integral MVT** where **$c_n$ is between $x_n, x_0$**.
Thus **taking the limit, $\Rightarrow\lim_{n\rightarrow \infty}\frac{F(x_{n})-F(x_{0})}{x-x_{0}}=\lim_{n\rightarrow \infty}f(C_{n})$** which becomes **6::$f(x_0)$ by Squeeze Theorem (and by continuity of $f$ so $\lim f(c_{n})=f(\lim c_{n})$)**.
Therefore $F^{\prime}(x_{0})=f(x_{0})$.

---

To say that a function $f:X\to Y$ is continuous one writes $f\in C( X,Y)$, which reads " f is in the set of continuous mappings from X to Y". 

If a function  $f:X\to Y$ is continuously differentiable, one writes $f\in C^{1} (X,Y)$ 

If it is $k$ times differentiable and that $k$-th derivative is continuous, one writes $f \in C^{k} (X,Y)$. 

Note that the formula is still true at $x = a, x=b$ with 1 sided derivatives. But the textbook defines $\forall x \in (a,b)$

---

**Generalized Integral MVT::Theorem Name**
Conditions: **$f\in C[a,b]$, $g \neq 0$ on $[a, b]$**. 
Thus **$\int_{a}^{b}f(x)g(x)dx=f(x_{0})\int_{a}^{b}g(x)dx$**

**Integral MVT::Theorem Name**
Conditions: **$f\in C[a,b]$**. 
Thus **$\exists x_0 \in (a,b)$ such that $\int_{a}^{b}f(x)dx=f(x_{0})(b-a)$, or $\frac{1}{b-a}\int_{a}^{b}f(x)dx=f(x_{0})$** 
+
Proof:
By **EVT**, **4::$\forall x ~ f(x_{\min})\leq f(x)\leq f(x_{\max})$ (where $x_{\min}$/$x_{\max}$ is a minimizer/maximizer on $[a,b]$**
**4::Integrate, $f(x_{\min})(b-a)\leq\int^{b}_a f\leq f(x_{\max})(b-a)$** 
Thus **4::$f(x_{\min})\leq\frac{1}{b-a}\int_{b}^{a}f\leq f(x_{\max})$**
By **4::IVT**, $\exists x_{0}\in[a,b]$ such that $\frac{1}{b-a}\int_{a}^{b}f(x)dx=f(x_{0})$

---

IVT has $x_0$ on a closed interval, however the theorem is more strict; $x_0$ is in the open interval! it's hard to show that $x_0 \in (a,b)$; a delicate $\epsilon-\delta$ on $(a, b)$ is needed

---

General FTC II:
**$\frac{d}{dx}\int_{a(x)}^{b(x)}f(t)dt=f(b(x))\frac{db}{dx}-f(a(x))\frac{da}{dt}$**

---

![|400](z_attachments/Pasted%20image%2020250406172958.png)

Leibniz Rule (not necessary for MATH410, but will learn in MATH411):

$\frac{d}{dx}\int_{a(x)}^{b(x)}f(x,t)dt=\int_{a(x)}^{b(x)}\frac{df}{dx}(x,t)dt+f(x,b(x))\frac{db}{dx}-f(x,a(x))\frac{da}{dx}$

---

Theorem: 
Conditions: $f: [a, b] \to \mathbb{R}$
$F(x)=\int_{a}^{x}f(t)dt$ is **uniformly continuous** on $[a, b]$
+
Proof:
For $x, y \in [a, b]$, **$|F(x)-F(y)|=|\int_{a}^{x}f-\int_{a}^{y}f|$**
Which equals **2::$|\int_y^x f|$ (since $-\int^y_a = + \int^a_y f$)**
Which can be bounded by **2::$\{\max_{x\in[a,b]}|f(x)|\}.|x-y|=c|x-y|$**
Thus **2::$|x_{n}-y_{n}|\rightarrow0\Rightarrow|F(x_{n})-F(y_{n})|\rightarrow0$**

---

idea: a small change in $x$ results in a small change in area under the curve

---
***
