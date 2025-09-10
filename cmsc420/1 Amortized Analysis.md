Amortized cost: Suppose we perform $n$ operations. What is the average per-operation cost? Always look at the **worst** case

---

Motivational example: 
Suppose we do a sequence of operations. Each operation costs 2, but every 20th operation has a p=0.5 probability of costing an additional 28.
What can we say, per single operation?
- Best case: 2
- Worst case: 30
- Average case: Most are 2, every 20th operation is $0.5 (2) + 0.5(30) = 16$
All of these miss the fact that the expensive operations are rare.

The amortized cost is then $AC(n) = \frac{2n + 28 \lfloor \frac{n}{20} \rfloor}{n} = 2 + \frac{28}{n}\lfloor\frac{n}{20}\rfloor$ (don't cancel the $n$)

If all we need is $\mathcal{O}$: $AC(n) \leq 2 + \frac{28}{20} = 3.4$, so $AC(n) \in \mathcal{O}(1)$

There are three classic ways to find our $AC(n)$ (amortized worst-case per-operation cost):
1. Aggregate method: calculate $C(n)$ then $AC(n) = \frac{C(n)}{n}$
2. Token (Banker's) method
3. Potential method (won't cover)

Situations where it's useful:
1. Reallocation of memory for a stack when we run out
2. Insertion into a hash table (expensive rebuilds)
3. In a scapegoat tree, we might have an expensive rebuild after a depth violation.

# Stack allocation situation: 

Suppose we have space allocated for a stack. We push until it's full. The next push would cause an overflow, so we reallocate more memory, copy the existing stack, then push. 

Let's assume:
- push costs 1
- Realloc + copy cost = space allocated (copying included) (eg realloc from 5 to 10 costs 10)

Three options to calculate: 
Option 1: start with empty stack, nothing allocated. When we overflow, we reallocate 1 extra space. 
Total $C(n) = n + \sum^n_{i = 1} i = n + \frac{n(n+1)}{2} = \frac{1}{2} n ^2 + \frac{3}{2}n$
So $AC(n)=\frac{\frac12n^2+\frac32n}n=\frac12n+\frac32$
Observe that $AC(n)=\mathcal{O}(n)$

Option 2: When full, triple the space.
(Special case of null to 1)
Total cost: 
Base cost: $1 + \ldots + 1 = n$
Realloc cost: $1 + 3 + 9 + 27 + \ldots + 3^k$
We go up to the smallest $3^k \geq n$
So smallest $k$ with $k \geq \log_3 n$, so $k = \lceil \log_3 n \rceil$, so we have $C(n) = n + \sum^{\log_3 n}_{i = 0}3^i = n+\frac{3^{1+\lceil\log_3 n\rceil}-1}{3 - 1}$
Then $AC(n) = \frac{C(n)}{n} = 1 + \frac{3^{1+\lceil\log_3 n\rceil}-1}{2n} \leq 1 +\frac{9n}{2n} = 1 + \frac{9}{2} = \frac{11}{2}$, so $AC(n) = \mathcal{O}(1)$
Even though the reallocs are more expensive, they happen so infrequently.

Option 3: When we need to reallocate, go to the next highest perfect square.
Base cost is still $n$
Realloc cost: $1 + 4 + 9 + 16 + \ldots + k^2$
We go to the smallest $k^2$ with $k^2 \geq n$, so $k \geq \sqrt{n}$ so $k = \lceil \sqrt{n} \rceil$
So $C(n) = n + \sum ^{\lceil\sqrt{n}\rceil}_{i = 1} i^2$, so $C(n) = n + \frac{{\lceil\sqrt{n}\rceil} ({\lceil\sqrt{n}\rceil} + 1)(2{\lceil\sqrt{n}\rceil} + 1)}{6}$, so $AC(n) = \frac{C(n)}{n} = 1 + \frac{{\lceil\sqrt{n}\rceil} ({\lceil\sqrt{n}\rceil} + 1)(2{\lceil\sqrt{n}\rceil} + 1)}{6n}$
Want $\mathcal{O}$: $AC(n) \leq 1 + \frac{{\sqrt{n}} ({\sqrt{n}} + 1)(2{\sqrt{n}} + 1)}{6n} \leq \textrm{highest power }n^{1/2} \in \mathcal{O}(n^\frac12)$ 

---


***
