Starting with a function $f$, we will calculate a new function $d(f)$ called the **Laplace transform** of $f$ that will help convert an ODE into an algebraic problem.

Definition:
Let $f$ be a function defined for all $t \geq 0$. 
The **Laplace transform** of $f$ is the function of $s$ given by **$L$f$(s)=\int_{0}^{\infty}e^{-st}f(t)dt=\lim_{T\to\infty}\int_{0}^{T}e^{-st}f(t)dt$**

Laplace transform properties:
- **Linearity (follows from linearity of integrals)**
> crucial for efficiently computing Laplace transforms

Euler's formula identity for $\cos(x)=**\frac{e^{ix}+e^{-ix}}2**$

---

To derive **Euler's Formula** for cosine:

$\cos(x) = \frac{e^{ix} + e^{-ix}}{2}$

we can proceed with the following steps:

### Step 1: Recall Euler's Identity
Euler's Identity relates the exponential function to trigonometric functions:

$e^{ix} = \cos(x) + i \sin(x)$

### Step 2: Find the Complex Conjugate
Take the complex conjugate of Euler's Identity to get an expression for \( e^{-ix} \):

$e^{-ix} = \cos(x) - i \sin(x)$

*Note: The cosine function is even (\(\cos(-x) = \cos(x)\)), and the sine function is odd (\(\sin(-x) = -\sin(x)\)).*

### Step 3: Add the Two Equations
Add the expressions for \( e^{ix} \) and \( e^{-ix} \):

$e^{ix} + e^{-ix} = \left( \cos(x) + i \sin(x) \right) + \left( \cos(x) - i \sin(x) \right)$

$e^{ix} + e^{-ix} = 2\cos(x)$

### Step 4: Solve for \(\cos(x)\)
Divide both sides by 2 to isolate \(\cos(x)\):

$\cos(x) = \frac{e^{ix} + e^{-ix}}{2}$

### Final Answer
$\boxed{\cos(x) = \frac{e^{ix} + e^{-ix}}{2}}$

---

The Laplace transform turns a **multiplication by an exponential in** $t$ into a **translation by** $s$.
Theorem:
If $\mathcal{L}[f](s)$ exists for every $s > \alpha$ and if $a$ is any real number then **$\mathcal{L}[e^{at}f](s)$ exists for every $s > \alpha + a$ with $\mathcal{L}[e^{at}f](s)=\mathcal{L}[f](s-a)$**. 
> proof: directly from the definition
> $\begin{aligned}L[e^{at}f](s)&=\lim_{T\to\infty}\int_0^Te^{-st}e^{at}f(t)dt&=\lim_{T\to\infty}\int_0^Te^{-(s-a)t}f(t)dt\\&=d[f](s-a)\end{aligned}$

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

A function $f(t)$ defined over $[0, \infty]$ that is piecewise continuous over every interval $[0, T]$ is said to be of **exponential order $\alpha$** as $t \to \infty$ if for every $\sigma > \alpha$ we have $\lim_{t\to\infty}e^{-\sigma t}|f(t)|=0$
> eg $e^{at}$ is exponential of order $a$
> $\sin(bt), \cos(bt)$ are exponential of order $0$
> $t^p$ for every $p$ is exponential of order $0$

Suppose $f$ and $g$ are exponential of order $\alpha$ and $\beta$ as $t \to \infty$.
Then:
1. 

