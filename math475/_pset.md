# 1.1 The Basics

## class notes (1.1 Counting Warm-Up handout)

- 1b
- **4d**
- **5b**
- 6
- 7

# 1.3 The Pigeonhole Principle

## class notes

Ex: Prove that in a group of 40, at least 4 people have the same birth month
	Solution: 
	Let the people be pigeons, and the 12 months be pigeonholes. By the Pigeonhole Principle (PHP) there is at least 1 month with at least $\lceil \frac{40}{12} \rceil = 4$ people with that birth month.

Ex: Prove that if 6 distinct numbers are chosen from $[9] = \{1, 2, 3, 4, 5, 6, 7, 8, 9\}$, then two of the numbers will sum to $10$.
	Solution: 
	Let the five subsets $\{1, 9\}$ $\{2, 8\}$ $\{3, 7\}$ $\{4, 6\}$ $\{5\}$ be the pigeon holes.
	Let the 6 numbers be the pigeons. Each number must go into one of the pigeon holes. By the PHP, there is at least 1 pigeon hole which have two numbers that sum to 10.

**Ex: An athlete works out in blocks of hours. He plans to work out a total of 45 hours in a 30-day month. Assume he works out at least 1 hour each day. Prove that there is a period of 1 day or consecutive days where the cumulative hours he has worked out is a total of exactly 14 hours.** 
	Solution:
	Let $a_i$ be the accumulated hours up to day $i$. This is a sequence of length 30, $a_1, a_2, \ldots a_{30} = 45$. 
	We want to find $a_i - a_j = 14$, or equivalently, $a_i = a_j + 14$. Maybe we can use PHP to force a collision (find that two things must be equal).
	Thus let's consider the new sequence $b_1 = a_1 + 14$, $b_2 = a_2 + 14$, $b_{30} = a_{30} + 14$.
	Observe that the elements of $\{a_i\}^{30}_{i=1}$ are distinct, and the elements of $\{b_i\}^{30}_{i=1}$ are distinct.
	However the largest value of the sequences is $59$, but there are 60 sequence values. By the PHP, there exists some $a_i$ equal to $b_j$, so $a_i = b_j = a_j + 14$
	Thus there exists days $j$ to $i$ where he worked out exactly 14 cumulative hours

# 1.4 Compositions and Set Partitions

Example: Suppose there are 10 cans of Coke, 10 cans of Pepsi, 10 cans of Sprite. How many ways can you take 4 sodas?
	Solution: 
	We want $x_1 + x_2 + x_3 = 4$ ($n = 4, k=3$). Total ways is $\binom{4 + 3 - 1}{3 - 1}$

Example: $S(n, 2)$
	Solution: 
	$= \frac{2^n - 2}{2}$ 
	we must assign each element to one of two blocks. avoid the case where one block is empty (two such cases), then divide by 2 because the blocks are non-labelled

# hw1  (1.1 - 1.3)

- **2c**
- 3a
- 7a, b, c

# 1.6 The Twelvefold Way

## lecture notes

Ex: How many injective/one-to-one functions $f: [n] \to [k]$ are there? (for each $b \in [k]$ there is at most one $a \in [n]$ such that $f(a) =b$)

Solution: 
Labeled to labeled, at most 1
$(k)_n$ such functions

Ex: A multiset is a set where elements may be repeated. How many multisets of size $5$ can be created using $[7] = \{1, 2, \ldots, 7\}$? (relaxing requirement of distinct elements; ie group of elements with repetition; ordering does not matter)

Solution:
5 balls, 7 bins
5 unlabeled balls to 7 labeled bins ("counter" of how many 1's, 2's, ... 7's)
Weak composition $\binom{5 + 7 - 1}{7 - 1}$ ways

Ex: Twenty students split into exactly $4$ study groups. Bob and Carl who must be in the same group. Also, Alice and Diane want to be in the same group. How many ways can we create the 4 study groups?

Solution:
We treat the pairs each as 1 element, yielding 18 students. We then partition 18 people into exactly 4 blocks (unlabeled) $S(18,4)$

Ex: A function $f: [n] \to [k]$ is monotonically increasing if $f(x) \geq f(y)$ if $x > y$. How many such functions are there?

Solution:
$k$ bins, $n$ balls

If there's, say $3$ balls in bin $1$, we must use $f(1) = f(2) = f(3) = 1$. Continuing in this manner, the domain values are determined mapped to element $2$ (must be the next integers after 3). That is to say, once the balls are placed in the $k$ bins, the mapping is determined without a labeling of the balls (if a larger domain value was used, it fails the condition)

# hw2 (1.4- 1.6)

