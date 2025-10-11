For a scapegoat tree, define $\operatorname{size}(x) = **\textrm{\# nodes in the subtree rooted at } x**$
+
A **scapegoat** is a node $x$ with **$\frac{\mathrm{size}(x.\mathrm{child})}{\mathrm{size}(x)}>\alpha$, where $\frac{1}{2}<\alpha<1$**

---

![|300](z_attachments/Pasted%20image%2020251003112223.png)

Scapegoat trees are neat because:
- Frequent cheap ops infrequent expensive ops (So amortized analysis) 
- Weird combo of height and weight-balanced
- Insertion and deletion work quite differently from one another
- Very minimum extra data needed to function

A scapegoat tree is not necessarily a tree with no scapegoats!

**Informal statements about insertion/deletion:**

Insertion: insert as a standard BST. If the inserted node is too deep (how deep?), we go back up the tree until we find a scapegoat (why must a scapegoat exist?) and rebuilt (?) the subtree rooted at the scapegoat

Deletion: if we delete too many nodes without inserting to compensate (clarify!) we panic and rebuild (?) the entire tree

**Some formalities:**

Store:
$n = \textrm{\# of nodes/keys in the tree}$
$m = \textrm{max \# nodes in the tree since either creation or since the most recent deletion-rebuild}$

ex:
Start with empty tree: $n=0, m=0$
Insert 10 nodes: $n=10, m=10$
Del 2 nodes: $n= 8, m= 10$
Ins 1 node: $n=9, m= 10$

---

Subtree rebuilding: (can do with any BST; in context of scapegoat tree)
Suppose a tree or subtree is rooted at some node.
Consider it a tree for now!
Set **the key with index $\lfloor \frac{k}{2} \rfloor$ in the in order traversal (increasing order)** as the new root. 
Recurse left with all the smaller keys and right with all the larger keys.

Scape goat insertion:
Insert as standard binary search tree. if depth of inserted node has $d>\log_{3/2}n$ we **find a scapegoat going up the tree** and rebuild the tree.
> no need to continue rebuilding even if there are still scapegoats
> remember that a scapegoat tree is NOT a tree with no scapegoats

Scape goat deletion:
$m$ is the **max nodes since tree creation or most recent deletion rebuild**.
If $n < \frac23m$ we rebuild and set **$m = n$**. 
+
Proof that deletion-rebuild amortized cost is $\mathcal{O}(1)$:
We rebuild at $n < \frac23 m$. We must have deleted at least **$\frac13 m$** nodes. Let's deposit 3 tokens per deletion operation, so we have $3(\frac13m)=m$ tokens. Thus since $n < m$ we have enough tokens.

Scape goat insertion-rebuild:
At the most recent time a node is:
- added to tree
- part of the rebuilt subtree
size(u.child) - size(u.otherchild) <= **1**
+
We can also show with some algebra that eventually, size(u.child) - size(u.otherchild) > $1 + \frac13 \operatorname{size}(u)$
Thus size(u.child) - size(u.otherchild) grows by at least $\frac13 \operatorname{size}(u)$
This means at least $\frac13 \operatorname{size}(u)$ insertion/deletions. For each insertion/deletion we deposit 3 tokens for each operation, so we have enough tokens for a rebuild (but **we have $\mathcal{O} (\lg(n)$ tokens due to the $lg$ height of the tree**).
> at insertion:
> added to tree (0)
> part of the rebuilt subtree (differ at most 1 because choose median at each depth of rebuild)

***
