exam questions may come from "conceptual questions" file

introductory real (real numbers) analysis (study of limits and related ideas, integrals, differentiation, convergence, continuity)

algebra "structure" of mathematical objects/sets/etc

# example 1

$0 = (1-1) + (1-1) + (1-1) + \cdots$
$=1 + (-1 + 1) + (-1 + 1) + \cdots$ because of associative property
$= 1 = 0$

fails convergence

# example 2

$x = 1 + 2 + 4  + 8+ \cdots$
$x - 1 = 2 + 4 + 8 + \cdots$
$= 2 ( 1 + 2 + 4 + \cdots)$
$= 2x$


> this is food for thought

# example 3

$\lim_{x \rightarrow \infty} \frac{x + \sin x}{x} = 1$ (true, can prove with squeeze theorem)

![](z_attachments/Pasted%20image%2020250127103216.png)

l'hopital's rule: $\lim_{x \rightarrow \infty}\frac{1 + \cos x}{1}=\textrm{DNE}$ 

why does L'Hopital's fail?

> this is food for thought--something about it the rule being backwards and assumptions that are assumed to be true implicitly

# example 4

$r^2 = x^2 + y^2$
$x = r \cos \theta$
$y = r \sin \theta$

$r = x \sec \theta$
$\frac{\partial r}{\partial x} = \sec \theta$

$r = \sqrt{x^2 + y^2}$
$r_x = {1}{2}{x^2 + y^2}^{-1/2}(2x)$
$= \frac{x}{\sqrt{x^2 + y^2}}$
$= \frac{x}{r}$
$=\frac{x}{\sec \theta} = \cos \theta$

conclusion $\sec \theta = \cos \theta$ for any $\theta$
set $\theta = \frac{\pi}{4}$ to show $0 = 1$

has something to do with what a partial derivative is

***


