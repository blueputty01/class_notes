**Moving 2D points to 3D space (homogeneous coordinates)** enables representation of translation as matrix multiplication.
> Instead of representing $x$ simply as a single variable (a $1 \times 1$ vector $[x]$) if we represent it by $\left[\begin{array}{c}x\\1\end{array}\right]$ then observe that for any $a$ we have:
> $\left[\begin{array}{rr}1&a\\0&1\end{array}\right]\left[\begin{array}{r}x\\1\end{array}\right]=\left[\begin{array}{r}x+a\\1\end{array}\right]$

General matrix for rotation of 2D coordinates around the origin in homogeneous coordinates (counterclockwise): **$R(\theta)=\left[\begin{array}{rrr}\cos\theta&-\sin\theta&0\\\sin\theta&\cos\theta&0\\0&0&1\end{array}\right]$**
 > ![](z_attachments/Pasted%20image%2020250916212349.png)
 > [math.umd.edu/\~immortal/MATH401/book/ch\_computer\_graphics.pdf](https://www.math.umd.edu/~immortal/MATH401/book/ch_computer_graphics.pdf)

A 2-D translation is defined by the matrix **$\left.\left[\begin{array}{ccc}1&0&a\\0&1&b\\0&0&1\end{array}\right.\right]$**
> In defining the 2-D translation, we have:
$\begin{aligned}f\left(\left[\begin{array}{r}1\\0\\1\end{array}\right]\right)=\left[\begin{array}{r}1+a\\b\\1\end{array}\right]\\f\left(\left[\begin{array}{r}0\\1\\1\end{array}\right]\right)=\left[\begin{array}{r}a\\1+b\\1\end{array}\right]\\f\left(\left[\begin{array}{r}0\\0\\1\end{array}\right]\right)=\left[\begin{array}{r}a\\b\\1\end{array}\right]\end{aligned}$. 
To simplify, note:
**$\begin{aligned}f\left(\left[\begin{array}{c}1\\0\\0\end{array}\right]\right)&=f\left(\left[\begin{array}{c}1\\0\\1\end{array}\right]-\left[\begin{array}{c}0\\0\\1\end{array}\right]\right)\\&=f\left(\left[\begin{array}{c}1\\0\\1\end{array}\right]\right)-f\left(\left[\begin{array}{c}0\\0\\1\end{array}\right]\right)\\&=\left[\begin{array}{c}1+a\\b\\1\end{array}\right]-\left[\begin{array}{c}a\\b\\1\end{array}\right]\\&=\left[\begin{array}{c}1\\0\\0\end{array}\right]\end{aligned}$**
> etc, etc

To rotate around a point other than the origin: 
**shift to origin, rotate, shift back**

***

To project the perspective, apply the operation **$\left[{\begin{array}{r}x\\y\\0\\1-z/d\end{array}}\right]\div(1-z/d)=\left[{\begin{array}{r}\frac x{1-z/d}\\\frac y{1-z/d}\\0\\1\end{array}}\right]$** after $\left[\begin{array}{rrrr}1&0&0&0\\0&1&0&0\\0&0&0&0\\0&0&-1/d&1\end{array}\right]\left[\begin{array}{r}x\\y\\z\\1\end{array}\right]=\left[\begin{array}{r}x\\y\\0\\1-z/d\end{array}\right]$