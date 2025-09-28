Given a BST:
for a node $x$, define $\textrm{balance} = b(x) = **h(\textrm{x.rightsubtree}) - h(\textrm{x.leftsubtree})**$
**does not include::includes/does not include** edge leading down to subtree
> ![|300](z_attachments/Pasted%20image%2020250917114546.png)

We say that a BST satisfies the AVL balance condition if: **$\forall \mathrm{~node~x,~b(x)\in\{-1,0,1\}}$**

***

Theorem: Suppose an AVL tree has $n$ nodes and height $h$. Then $h = **\mathcal{O}(\lg n)**$
+
Proof:
$N(h)$ = min possible nodes in an AVL tree with height $h$
So: 
$N(0) = 1$
$N(1) = 2$
$N(2) = 4$
+
Observe:
$N(h - 1) > N(h-2)$
$N(h) = 1 + N(h-1) + N(h-2)$
+
Now observe:
$N(h)=1+N(h-1)+N(h-2)$
$N(h)>1+N(h-2)+N(h-2)$
**$N(n)>2N(h-2)$**
So $N(n)>2^2N(h-4)$
$N(n)>2^{3}N(n-6)$
when $h$ is even (look at the case where $h$ is odd (HINT HINT HINT))
$N(h)>2^{\frac{h}{2}}N(0)$, but $N(0) = 1$ so $N(h) > 2^{\frac{h}{2}}$
Now since $N(h) =$ minimum number of nodes:
$n\geq N(h)>2^{h/2}$
$n > 2 ^{\frac{h}{2}}$
$\frac{h}{2} < \lg n$
$n < 2 \lg n$, so $h = \mathcal{O}(\lg n)$
> ![|300](z_attachments/Pasted%20image%2020250919110947.png)

Search on an AVL is worst case $\mathcal{O}(**\lg n**)$

Right rotation of this tree
![|300](z_attachments/Pasted%20image%2020250919112438.png)
**![|300](z_attachments/Pasted%20image%2020250919112446.png)**
> $A<y<B<x<C$ in both: BST preserved!

Left-Right rotation at $x$ is a **left rotation at $x$'s left child followed by a right rotation at $x$**
> ![](z_attachments/Pasted%20image%2020250919113239.png)

***

Insertion: **insert as normal. If any nodes are unbalanced, they'd be ancestors of $x$. So head up the tree, checking balances as we go.**

Resolution for Right-Right heavy tree: **left rotation**
> ![](z_attachments/Pasted%20image%2020250924113300.png)

Resolution for Left-Left heavy tree: **right rotation**
> ![](z_attachments/Pasted%20image%2020250924113300.png)
> note that this is an example of a right-right heavy tree

Resolution for Right-Left heavy tree: **right left rotation**
> ![](z_attachments/Pasted%20image%2020250924113628.png)
> ![](z_attachments/Pasted%20image%2020250924113643.png)

Resolution for Left-Right heavy tree: **left right rotation**
> note that this is for a right-left heavy tree
> ![](z_attachments/Pasted%20image%2020250924113628.png)
> ![](z_attachments/Pasted%20image%2020250924113643.png)

Insertion time complexity worst case: **$\mathcal{O}(\lg n)$** 
> Worst case BST insertion step: **$\mathcal{O}(\lg n)$** 
> Worst case checking for a problem: **$\mathcal{O}(\lg n)$** 
> note: it turns out that each node can store the heights of its subtrees, and these can be updated when insertion/deletion without making the $\mathcal{O}$ time worse

Deletion: 
If it is a leaf node we finally delete. Then **it is possible that its parent is unbalanced so we need to start checking with that parent**. 
+
If it is not a leaf node we finally delete. Then **1::all the promoted nodes are safe since their balance factors do not change. We do however need to check the parent of the deleted node**.
+
We **do::do/do not** need to check ancestors as well.
> shorter for RL heavy but not RR heavy; LR heavy but not LL heavy
> BST deletion $\mathcal{O}(\lg n)$ because of height
> number of problems to fix is $\mathcal{O}(\lg n)$
> Fixing each is $\mathcal{O}(1)$
> So overall is $\mathcal{O}(\lg n)$


***
