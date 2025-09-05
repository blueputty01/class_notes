Suppose a recurrence relation of the form $T(n) = a T(\frac{n}{b})+f(n)$ with $a, b \in \mathbb{Z}, a \geq 1, b \geq 2$ 
Case 1: If $f(n) \in **\mathcal{O}\left(n^c\right)**$ and **1::$\log_b a > c$** then $T(n) \in **1::\theta \left(n^{\log_b a}\right)**$
Case 2: If $f(n) \in **\theta \left(n^c\right)**$ and **2::$\log_b a =c$** then $T(n) \in **2::\theta \left(n^{\log_b a}\lg n\right)**$ 
Case 2 (fancy): If $f(n) \in **\theta \left(n^c \lg^k n\right)**$ and **3::$\log_b a =c$** then $T(n) \in **3::\theta \left(n^{\log_b a}\lg^{k+1} n\right)**$
Case 3: If $f(n) \in **\Omega \left(n^c\right)**$ and **$\log_b a < c$** then $T(n) \in **4::\theta \left(f(n)\right)**$ 
	case 3 also requires a regularity condition, which we won't worry about
	doesn't apply to $T(n) = 1.5 T(\frac{n}{2}) + n^2$ (non-integer)
	doesn't apply to $T(n) = 2 T(n - 1) + \lg n$ (subtraction)
	doesn't apply to $T(n) = 2 T(\frac{n}{3}) + 3 T (\frac{n}{4})+n$ (multiple $T$ terms)
	doesn't apply to $T(n) = 16 T(\frac{n}{4}) + f(n), f(n) \in O(n^2)$ (only possible case is case 1, $log_b a = log_4 16 = 2 \ngtr c$)