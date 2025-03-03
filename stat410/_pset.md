# chapter 1 combinatorial analysis

## lecture problems

A president and a treasurer are to be chosen from a student club consisting of 50 people. How many different choices of officers are possible if A will serve only if he is president?
![](z_attachments/Pasted%20image%2020250130112620.png)

From a group of 5 women and 7 men, how many different committees consisting of 2 women and 3 men can be formed? (19 in textbook is better)
![](z_attachments/Pasted%20image%2020250130112637.png)

## textbook problems

19, 30

# chapter 2 axioms of probability

## textbook problems

#15, pair(s) of cards in 5 card hand

## lecture problems

pretty easy; can skip these:

1. what is the probability of holding 2 aces and 3 jacks?
   comb(4, 2) \* comb(4, 3) / comb(42, 5)
2. what is the probability of holding a full house (three of a kind plus a pair)?
   13 \* 4 \* 12 \* comb(4,2) / comb(52, 5)

If n people are present in a room, what is the probability that no two of them celebrate their birthday on the same day of the year? How large need n be so that this probability is less than 1/2?
perm(365, n) / 365 ^ n

## proof problems

$P(E^c)=1-P(E)$

$\mathrm{If~}E\subset F\text{,then }P(E)\leq P(F)$

$P(A\cup B)=P(A)+P(B)-P(A\cap B)$

# chapter 3 conditional probabiliyt and independence

In the card game bridge, the 52 cards are dealt out equally to 4
players–called East, West, North, and South. If North and South
have a total of 8 spades among them, what is the probability that
East has 3 of the remaining 5 spades?
> ![](z_attachments/cards%20cond%20prob.png)

An ordinary deck of 52 playing cards is randomly divided into 4 piles of 13 cards each. Compute the probability that each pile has exactly 1 ace.
> comb(48, 12) * comb(4,1) * comb(36, 12) * comb(3,1) * comb(24, 12) * comb(2, 1)/ (52! / (13!^4))

Independent trials consisting of rolling a pair of fair dice are performed. What is the probability that an outcome of 5 appears before an outcome of 7 when the outcome of a roll is the sum of the dice?
	2/5
	solution 1: $\sum_{n=1}^{\infty}\Big(1-\frac{10}{36}\Big)^{n-1}\frac{4}{36}=\frac{2}{5}$ (not getting a 5 or 7, then finally getting a 5)
	solution 2: partitioning the event space by first trial giving {5, 7, and neither 5 nor 7}
	$\Pr(E) = \Pr(E | G_1)\Pr(G_1)+ \Pr(E | G_2)\Pr(G_2) + \Pr(E | G_3)\Pr(G_3) = 1 \frac{4}{36} + 0 \frac{6}{36} + \Pr(E) \frac{26}{36}$

# chapter 4 random variables

## lecture problems

Slide 12: Three balls are randomly chosen from an urn containing 3 white, 3 red, and 5 black balls. Suppose that we win $1 for each white ball selected and lose $1 for each red ball selected. If we let X be our total winnings from the experiment, then X is a random variable taking on the possible values 0, ±1, ±2, ±3. Find p(x) for X.

do this with the combination formula
	1/comb(11, 3)
	15/comb(11, 3)
	39/comb(11, 3)
	55/comb(11, 3)
	39/comb(11, 3) (symmetry)
	15/comb(11, 3)
	1/comb(11, 3)
