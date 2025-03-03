# Graphing

fplot(@ var, function, interval)

xlabel 't', ylabel 'y'

symst

title ''

# Solving

`dsolve` solves ODEs using formulas

`>> sol = dsolve('Dy + y = 5 * sin (2 * t)', 'y(0) = 1', 't')`

`>> gensol = dsolve('Dy + y = 5 * sin(2 * t', 'y(0)=c', 't')`

## graphing this solution

`figure, hold on`

```matlab
cval = -3:2:3 # -3. -3 + 2, -3 + 4, -3+6 (c = -3, -1, 1, 3)
fplot(@(t) gensol(t, cval), [0, 5])
axis tight, xlabel 't', ylabel, 'y'
```

```matlab
[T,Y] = meshgrid(t_L:h:t_R, y_L:k:y_R); // creates grid h, k increment 
contour(T, Y, H(T,Y)) // t_i = t_L + i h, k = (t_R - t_L) / h i = 1, 2, ..., k
axis square, xlabel 't', ylabel 'y'
title 'counter plot of H(T,v)'
// draws level sets of H(t, y)
```
```
```matlab
[T, Y] = meshgrid(-4:0.1:4, -4:0.1:4)
contour(T, Y, sin(T) + (2 + Y) * exp(-Y), [0, 0]) // I want c such that H(0, -2) = c = 0
axis square, xlabel 't', ylabel 'y'
title 'Solution of dy/dt = exp(y) cos(t) / (1 + y), y(0) = -2'
```
```matlab
[T,Y] = meshgrid(t_L:h:t_R, y_L:k:y_R); // creates grid h, k increment 
S = f(T, Y) //S is actually a matrix
L = sqrt(1 + S.^2) //length, for normalizing "so it looks nice"
quiver(T, Y, 1 ./ L, S ./ L, l)
axis tight, xlabel 't', ylabel 't'
title 'direction field...'
```
