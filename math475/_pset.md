# 1.1 The Basics

## class notes

- 1b
- 4d
- 7

# 1.2 Counting in Two Ways

## class notes

- 3

# 1.3 The Pigeonhole Principle

## class notes

Ex: Prove that in a group of 40, at least 4 people have the same birth month
	Solution: 
	Let the people be pigeons, and the 12 months be pigeonholes. By the Pigeonhole Principle (PHP) there is at least 1 month with at least $\lceil \frac{40}{12} \rceil = 4$ people with that birth month.

Ex: Prove that if 6 distinct numbers are chosen from $[9] = \{1, 2, 3, 4, 5, 6, 7, 8, 9\}$, then two of the numbers will sum to $10$.
	Solution: 
	Let the five subsets $\{1, 9\}$ $\{2, 8\}$ $\{3, 7\}$ $\{4, 6\}$ $\{5\}$ be the pigeon holes.
	Let the 6 numbers be the pigeons. Each number must go into one of the pigeon holes. By the PHP, there is at least 1 pigeon hole which have two numbers that sum to 10.

Ex: An athlete works out in blocks of hours. He plans to work out a total of 45 hours in a 30-day month. Assume he works out at least 1 hour each day. Prove that there is a period of 1 day or consecutive days where the cumulative hours he has worked out is a total of exactly 14 hours. 
	Solution:
	Let $a_i$ be the accumulated hours up to day $i$. This is a sequence of length 30, $a_1, a_2, \ldots a_{30} = 45$. Consider the new sequence $b_1 = a_1 + 14$, $b_2 = a_2 + 14$, $b_{30} = a_{30} + 14$.
	Observe that $\{a_i\}^{30}_{i=1}$ are distinct, and $\{b_i\}^{30}_{i=1}$ are distinct
	However the largest value of the sequences is $59$, but there are 60 sequence values. By the PHP, there exists some $a_i$ equal to $b_j$, so $a_i = b_j = a_j + 14$
	There exists days $j$ to $i$ where he worked out exactly 14 hours

# 1.4 Compositions and Set Partitions

Example: Suppose there are 10 cans of Coke, 10 cans of Pepsi, 10 cans of Sprite. How many ways can you take 4 sodas?
	Solution: 
	We want $x_1 + x_2 + x_3 = 4$ ($n = 4, k=3$). Total ways is $\binom{4 + 3 - 1}{3 - 1}$

Example: $S(n, 2)$
	Solution: 
	$= \frac{2^n - 2}{2}$ 
	we must assign each element to one of two blocks. avoid the case where one block is empty (two such cases), then divide by 2 because the blocks are non-labelled
