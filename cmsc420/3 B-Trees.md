A multiway search tree generalizes the binary search tree where:
- **each node may have $\geq$ 1 keys**
- **1::a node with $j$ keys has $\geq j + 1$ children**
- **1::we have an inequality rule (compare between two elements that they are children of)**
> ![](z_attachments/Pasted%20image%2020250924112801.png)

A B-tree of order $m \geq 3$ is an MST with:
- **Perfect (all leaves at same level)**
- **1::root has between $1$ and $m - 1$ keys (if the root has children then $c = k + 1$)**
- **1::non root nodes have between $\lceil \frac{m}{2} \rceil -1$ and $m - 1$ keys (if a node has children then $c = k  +1)$**
> ![](z_attachments/Pasted%20image%2020250924112801.png)
> $k$: number of keys
> $c$: number of children
> root is allowed 1 key so we can have B-tree with one key
> the reason to force other nodes to have $\geq \lceil \frac{m}{2} \rceil  -1$ keys is to stop the tree from degenerating to a BST

***

Theorem: 
For any b-tree of order $m$ with $k$ keys and $h$ height, we have $k\geq2\left\lceil\frac m2\right\rceil^h-1$:
$\begin{aligned}&\begin{array}{lll}\mathrm{Level}&\mathrm{Min~Nodes}&\mathrm{Min~Keys}\\\hline0&1&1\\1&2&2(\lceil m/2\rceil-1)\\2&2\lceil m/2\rceil&2\lceil m/2\rceil\left(\lceil m/2\rceil-1\right)\\3&2\lceil m/2\rceil^2&2\lceil m/2\rceil^2\left(\lceil m/2\rceil-1\right)\\\vdots&\vdots&\vdots\\h&**2\lceil m/2\rceil^{h-1}**&**2\lceil m/2\rceil^{h-1}\left(\lceil m/2\rceil-1\right)**\end{array}\end{aligned}$
+
Total number of keys, $k$, satisfies 
$\begin{aligned}\text{k}&=1+\sum_{i=0}^{h-1}2\left\lceil m/2\right\rceil^i\left(\lceil m/2\rceil-1\right)\\&=1+2(\lceil m/2\rceil-1)\sum_{i=0}^{h-1}\lceil m/2\rceil^i\\&=1+2(\lceil m/2\rceil-1)\left(\frac{\lceil m/2\rceil^h-1}{\lceil m/2\rceil-1}\right)\\&=1+2(\lceil m/2\rceil^h-1)\\&=2\left\lceil m/2\right\rceil^h-1\end{aligned}$

B-tree insertion:
We can't just create a new leaf since **the tree will no longer be perfect**.
Just follow down to the appropriate leaf and try to insert.
If that leaf has less than $m - 1$ keys, then we are done.
If the leaf is overfull ($m$ keys; $m + 1$ children):
We first try to:
- **rotate key to adjacent sibling with space ($< m - 1$ keys)**
- **split and promote: if neither adjacent sibling has space, take the median key (or lower median if the number of keys are even) and promote it to the parent, then split the rest and continue with parent if overflow**
> Key rotation:
> ![](z_attachments/Pasted%20image%2020250929112703.png)
> rotations are best because it's one and done
> if both adjacent siblings have space, pick one!
>
> Split and promote:
> ![](z_attachments/Pasted%20image%2020250929113614.png)
> note that if the root is overfull, then it splits and a new root is created
> ![](z_attachments/Pasted%20image%2020250929113815.png)
> ![](z_attachments/Pasted%20image%2020250929113828.png)
> we need to prove that when we split and promote, the two newly created nodes each have at least $\lceil m/2 \rceil-1$ keys

***

Deletion from a B-tree:
+
The deleted node will always be a leaf (either since it's replacing a key or it's the key being deleted).
+
If the leaf becomes underfull, the first remedy is a **{{c2::key rotation}}** from an adjacent sibling that has more than the minimum number of keys.
+
If no sibling has an extra key, the underfull node must be **{{c3::merged}}** with a sibling, which requires **{{c3::demoting}}** a key from their parent.

---

![|400](z_attachments/Pasted%20image%2020251001113806.png)

- If a demotion and merge causes the parent to become underfull, the process repeats recursively up the tree.
- If the root is left with only one key and it is demoted, the tree's height decreases.

---