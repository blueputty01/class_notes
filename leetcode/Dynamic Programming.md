$\textrm{DP Time Complexity} =\textrm{Number of function calls} \times \textrm{Work done per function call}$
The number of function calls will be equal to **the number of unique states**.
> Eg for [1473. Paint House III](https://leetcode.com/problems/paint-house-iii/)
> We have 3 states in our problem.
> $m$ = number of houses
> $t$ = number of neighborhoods
> $n$ = number of different colors
> We have $m \times t \times n$ possible unique combinations to calculate or $m \times t \times n$ function calls. We can reach this conclusion because we will never calculate a state combination more than once thanks to memoization.
> Great. We just established that:
> 1. Number of Function Calls = `m * t * n`
> 2. Work Done per Function Call = `n`
> So… multiply them together and get our time complexity of `O(m * t * n * n)`. Simplify and clean it up a bit and get our final answer.
> **Time Complexity** = `O(m * t * n^2)`
***
