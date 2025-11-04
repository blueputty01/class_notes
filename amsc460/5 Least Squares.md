Derivation of least squares: 
Finding maximum of **$\sum^n_{i=1}(y_i - (a_1 x_i + a_0))^2$**
> Finding the line of best fit minimizes the sum of squared residuals: **$\sum^n_{i=1}(y_i - (a_1 x_i + a_0))^2$**.
> The partial derivative with respect to $a_0$ is: $-2\sum^n_{i=1}(y_i - a_1 x_i - a_0)$.
> The partial derivative with respect to $a_1$ is: $-2\sum^n_{i=1}x_i(y_i - a_1 x_i - a_0)$.
> Setting these derivatives to zero and simplifying yields the normal equations: $a_0 n + a_1 \sum x_i = \sum y_i$ and $a_0 \sum x_i + a_1 \sum x_i^2 = \sum x_i y_i$.
> Solving this system provides the formulas for the slope $a_1 = \frac{n\sum x_iy_i - \sum x_i \sum y_i}{n\sum x_i^2 - (\sum x_i)^2}$ and the intercept $a_0 = \bar{y} - a_1\bar{x}$.
> Geometrically, the residual vector is orthogonal to the column space of the design matrix, hence "normal equations." This derivation assumes a linear relationship.

***
