Starting with a function $f$, we will calculate a new function $d(f)$ called the **Laplace transform** of $f$ that will help convert an ODE into an algebraic problem.

Definition:
Let $f$ be a function defined for all $t \geq 0$. 
The **Laplace transform** of $f$ is the function of $s$ given by **$L[f](s)=\int_{0}^{\infty}e^{-st}f(t)dt=\lim_{T\to\infty}\int_{0}^{T}e^{-st}f(t)dt$**

Laplace transform properties:
- **Linearity (follows from linearity of integrals)**
> crucial for efficiently computing Laplace transforms

Euler's formula identity for $\cos(x)=**\frac{e^{ix}+e^{-ix}}2**$

---

To derive Euler's Formula for cosine:

$\cos(x) = \frac{e^{ix} + e^{-ix}}{2}$

We can proceed with the following steps:

**Step 1: Recall Euler's Identity**
Euler's Identity relates the exponential function to trigonometric functions:

$e^{ix} = \cos(x) + i \sin(x)$

**Step 2: Find the Complex Conjugate**
Take the complex conjugate of Euler's Identity to get an expression for $e^{-ix}$:

$e^{-ix} = \cos(x) - i \sin(x)$

*Note: The cosine function is even ($\cos(-x) = \cos(x)$), and the sine function is odd ($\sin(-x) = -\sin(x)$).*

**Step 3: Add the Two Equations**
Add the expressions for $e^{ix}$ and $e^{-ix}$:

$e^{ix} + e^{-ix} = \left( \cos(x) + i \sin(x) \right) + \left( \cos(x) - i \sin(x) \right)$

$e^{ix} + e^{-ix} = 2\cos(x)$

**Step 4: Solve for $\cos(x)$**
Divide both sides by 2 to isolate $\cos(x)$:

$\cos(x) = \frac{e^{ix} + e^{-ix}}{2}$

**Final Answer**
$\boxed{\cos(x) = \frac{e^{ix} + e^{-ix}}{2}}$

---

The Laplace transform turns a **multiplication by an exponential in** $t$ into a **translation by** $s$.
Theorem:
If $\mathcal{L}[f](s)$ exists for every $s > \alpha$ and if $a$ is any real number then **$\mathcal{L}[e^{at}f](s)$ exists for every $s > \alpha + a$ with $\mathcal{L}[e^{at}f](s)=\mathcal{L}[f](s-a)$**. 
> proof: directly from the definition
> $\begin{aligned}L[e^{at}f](s)&=\lim_{T\to\infty}\int_0^Te^{-st}e^{at}f(t)dt&=\lim_{T\to\infty}\int_0^Te^{-(s-a)t}f(t)dt\\&=\mathcal{L}[f](s-a)\end{aligned}$

The Laplace transform turns a **translation of** $t$ into a **multiplication by an exponential** in $s$.
Theorem:
Where $u$ is the unit step/Heaviside function
$u(t)=\begin{cases}1&\mathrm{for}&t\geq0\\0&\mathrm{for}&t<0\end{cases}$
If $\mathcal{L}[f](s)$ exists for every $s > \alpha$ and if $c$ is any positive number then $L[u(t-c)f(t-c)](s)$ exists for every $s > \alpha$ and $L[u(t-c)f(t-c)](s)=e^{-cs}L[f](s)$ for $s > \alpha$
> Proof
> $\forall T > c$ we have:
> $\begin{aligned}\int_{0}^{T}e^{-st}u(t-c)f(t-c)dt&=\int_{c}^{T}e^{-st}f(t-c)dt\\&=e^{-cs}\int_{c}^{T}e^{-s(t-c)}f(t-c)dt\\&=e^{-cs}\int_{0}^{T-c}e^{-st}f(t)dt\end{aligned}$
> Thus it follows that 
> $\begin{aligned}L[u(t-c)f(t-c)](s)&=\lim_{T\to\infty}\int_{0}^{T}e^{-st}u(t-c)f(t-c)dt\\&=e^{-s}\lim_{T\to\infty}\int_{0}^{T-c}e^{-st}f(t)dt\\&=e^{-s}L[f](s)\end{aligned}$

A function is said to be **piecewise continuous** if it is bounded and continuous at all but finitely many points.

A function $f(t)$ defined over $[0, \infty)$ that is piecewise continuous over every interval $[0, T]$ is said to be of **exponential order $\alpha$** as $t \to \infty$ if for every $\sigma > \alpha$ we have $\lim_{t\to\infty}e^{-\sigma t}|f(t)|=0$
> eg $e^{at}$ is exponential of order $a$
> $\sin(bt), \cos(bt)$ are exponential of order $0$
> $t^p$ for every $p$ is exponential of order $0$

Suppose $f$ and $g$ are exponential of order $\alpha$ and $\beta$ as $t \to \infty$.
Then:
1. $f + g$ is exponential of order **$\max{\alpha, \beta}$** as $t \to \infty$
2. $f\cdot g$ is exponential of order **$\alpha + \beta$** as $t \to \infty$
> these properties are analogous of what happens to exponentials

Theorem:
Let $f(t)$ be defined over $[0,\infty)$ such that
• it is piecewise continuous over every $[0, T]$
• it is exponential of order $\alpha$ as $t \to \infty$
Then
1. For every positive integer $k$ the function **$t^k f(t)$** has **the same** properties
2. The function $F(s) = \mathcal{L}[f](s)$ is defined for every $s > \alpha$ and has derivatives of all orders with its $k^{\text{th}}$ derivative satisfying **1::$L[t^kf(t)](s)=(-1)^kF^{(k)}(s)\quad\mathrm{for~} s> \alpha$** 
> Proof
> $F(s)=\int_{0}^{\infty}e^{-st}f(t)dt$
> $F^{\prime}(s)=-\int_{0}^{\infty}te^{-st}f(t)dt=-L[tf(t)](s)$
> $F^{(k)}(s)=(-1)^{k}\int_{0}^{\infty}t^{k}e^{-st}f(t)dt=(-1)^{k}\int[t^{k}f(t)](s)$

Transform of derivatives:
The Laplace transform turns derivative with respect to $t$ into **multiplication by $s$**.
> transforms an IVP for $y(t)$ into an algebraic equation for $Y(s)=\mathcal{L}[y](s)$, which is much easier to solve
> once we know $Y(s)$, we apply an inverse Laplace transform to recover $y(t)=L^{-1}[y](t)$

Theorem: 
Let $f(t)$ be $(n-1)$ continuous over $[0,\infty)$ such that
• $f(t),f^{\prime}(t),\ldots,f^{(n-1)}(t)$$f(t)$ are exponential of order $\alpha$ as $t \to \infty$
• $f^{(n)}(t)$ is piecewise continuous over every $[0, T]$
Then $\mathcal{L}[f^{(n)}](s)$ is defined for every $s > \alpha$ with $\mathcal{L}[f^{(n)}](s)=**s^n \mathcal{L}[f](s)-s^{n-1}f(0)-s^{n-2}f^\prime(0)-\ldots-sf^{(n-2)}(0)-f^{(n-1)}(0)**$
> If $f$ is sufficiently differentiable we can apply this formula multiple times.
> Proof (apply formula multiple times):
> Let $s > \alpha$
> Applying integration by parts
> $\begin{aligned}L[f^{\prime}](s)&=\lim_{T\to\infty}\int_{0}^{T}e^{-st}f^{\prime}(t)dt\end{aligned}$
> $=\lim_{T\to\infty}\left[e^{-st}f(t)|_{t=0}^{t=T}+S_{0}\int^{T}e^{-st}f(t)dt\right]$
> $=\lim_{T\to\infty}\left[e^{-s\tau}f(T)-f^{2}(0)+S\int_{0}^{T}e^{-sT}f(t)dt\right]$
> $=s\cdot \mathcal{L}[f](s)-f(0)$

***

The Laplace transform method matrix:
**![|400](z_attachments/Pasted%20image%2020250502195031.png)**
> ![|300](z_attachments/Pasted%20image%2020250502195116.png)
> $p(s)$, $q(s)$, $F(s)$ are known:
> - $p(s)$ is the characteristic polynomial of $L$
> - $q(s)$ is a polynomial determined by the initial data
> - $F(s)$ is the Laplace transform of the forcing $f(t)$
> The inverse Laplace transform has a unique result

Given an initial value problem
$y^{(n)}+a_1y^{(n-1)}+\ldots+a_{n-1}y^1+a_n=f(t)$
$y(0)=y_0,y^1(0)=y_1,\ldots,y^{(n-1)}(0)=y_{n-1}$
How to compute $Y(s)=\mathcal{L}[y](s)$?
1. **By linearity, the Laplace transform of the differential equation is $\mathcal{L}[y^{(n)}]+a_1 \mathcal{L}[y^{(n-1)}]+\cdots+a_{n-1}\mathcal{L}[y^{\prime}]+a_n\mathcal{L}[y]=\mathcal{L}[f]$**
2. **1::An $n$-fold application of the derivative formula gives**
**$\mathcal{L}[y](s) = Y(s)$**
**$\mathcal{L}[y'](s) = s \mathcal{L}[y](s) - y(0) = s Y(s) - y_0$**
**$\mathcal{L}[y''](s) = s^2 \mathcal{L}[y](s) - s y(0) - y'(0) = s^2 Y(s) - s y_0 - y_1$**
**$\mathcal{L}[y^{(n)}](s) = s^n Y(s) - s^{n-1} y_0 - s^{n-2} y_1 - \cdots - s y_{n-2} - y_{n-1}$**
3. **1::Compute $\mathcal{L}[f](s)$**
4. **1::Place the results of 2 and 3 into the relation in 1**
5. Solve the linear algebraic equation for $Y(s)$ to obtain $Y(s)=\frac{q(s)+F(s)}{p(s)}$

$\mathcal{L}[**t^n**](s)=**\frac{n!}{s^{n+1}}**$

$\mathcal{L}[**e^{at}**](s)=**\frac{1}{s-a}**$

$\mathcal{L}[**\sin(bt)**](s) = \mathcal{L}[\cos(bt)](s) = **\frac{b}{s^2 + b^2}**$

The Laplace transform of the Green function of $L$ is **the reciprocal of the characteristic polynomial of $L$**.

Laplace First Translation Theorem:
Suppose: 
- $\mathcal{L}\{f(t)\}=F(s)$
- $a$ is a constant
Then: 
**$L[e^{at}f(t)]=F(s-a)$**

Laplace Second Translation Theorem:
Suppose: 
- $a$ is a constant
**$e^{-as}\mathcal{L}[j](s)=\mathcal{L}[j(t-a)u(t-a)](s)$**

Unit step function/Heaviside function
$\mathcal{u}(**t-a**)=\begin{cases}0&0\leq t<a\\1&t\geq a&\end{cases}$

Unit step function/Heaviside function
$u(**t-c)-u(t-d)**)g(t)=\begin{cases}g(t)&\mathrm{for~c\leq t\leq d}\\0&\mathrm{otherwise}\end{cases}$

To compute the Laplace transform of the function $u(t-c)h(t)$, we want the form **$L[u(t-c)j(t-c)](s)$**. Create a function $j(t)$ such that **$j(t)=h(t+c)$**.

***

# Impulse Forcing

The Dirac delta "function" is approximately $\delta(t)=\begin{cases}+\infty&\mathrm{if~}**t=0**\\0&\mathrm{otherwise}\end{cases}$

The Dirac delta has the property that for every interval $[a, b]$ containing $0$ and any continuous function $\phi$ on $[a, b]$, $\int_{a}^{b}\delta(t)\phi(t)dt=\phi(0)$
Corollary: 
$\mathcal{L}[\delta](s)=\int_{0}^{\infty}e^{-st}\delta(s)ds=**1**$
$L[\delta(t-c)](s)=\int_{0}^{\infty}e^{-st}\delta(t-c)dt=**e^{-cs}**\quad for\quad c>0$
> note that the IVP with forcing $f(t)=\delta(t)$ has the Green function as its solution

# Convolutions

Let $f(t)$ and $g(t)$ be two functions defined over $[0, \infty)$. 
Their **convolution** is a third function **$(f*g)(t)$** defined by the formula **1::$(f*g)(t)=\int_{0}^{t}f(t-\tau)g(\tau)d\tau$**
> can be thought of as a product between functions; satisfies:
> - commutative
> - distributive
> - associative

For every continuous function $f$ on $[0, \infty)$:
$(f*\delta)(t)=\int_{0}^{t}f(t-\tau)\delta(\tau)d\tau=**f(t)**$
> ie the Dirac delta acts like the identity for convolution

Theorem: 
Let $f(t)$ and $g(t)$ be:
- piecewise continuous on every $[0, T]$
- of exponential order $\alpha$ as $t \to \infty$
Then $\mathcal{L}[f * g](s)$ is defined for every $s>\alpha$ with $\mathcal{L}[f * g](s) = **F(s) G(s)**$
> Where $F(s)=L[f](s)$ and $G(s)=L[g](s)$
> The Laplace transform turns convolutions into multiplication
> Proof is omitted but is an application of change of variables
> Used to compute inverse Laplace transforms

***
