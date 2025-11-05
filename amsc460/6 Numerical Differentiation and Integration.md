$f(x+h) = f(x) + h f'(x) + \frac{h^2}{2} f''(x) + \frac{h^3}{6} f'''(x) + \cdots$
> Origin of derivation is from integration by parts of $f(x+h)=f(x)+\int_x^{x+h}f^{\prime}(t)dt$
> $f(x-h) = f(x) - h f'(x) + \frac{h^2}{2} f''(x) - \frac{h^3}{6} f'''(x) + \cdots$
> alternating signs because substitute $-h$

Backward difference approximation for first derivative: $f'(x) = \frac{f(x) - f(x - h)}{h}$
	Error term is $O(h)$
	(points to left of reference point)

Forward difference approximation for first derivative: $f'(x) = \frac{f(x + h) - f(x)}{h}$
	Error term is $O(h)$
	The choice for which approximation method is based on what values are defined

Center difference approximation for $f''(x)$: $f(x + h) + f(x - h) = 2 f(x) + h^2 f''(x) + \frac{h^4}{12} f^{(4)}(x) + \cdots$
    Rearranging gives $f''(x) = \frac{f(x + h) - 2 f(x) + f(x - h)}{h^2}$
	Error term is $O(h^2)$

Center difference approximation for $f'(x)$: $f(x + h) - f(x - h) = 2 h f'(x) + \frac{2 h^3}{6} f'''(x) + \cdots$
	Rearranging gives $f'(x) = \frac{f(x + h) - f(x - h)}{2 h}$
	Error term is $O(h^2)$

