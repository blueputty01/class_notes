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

PENDING: Insertion: **insert as normal. If any nodes are unbalanced, they'd be ancestors of $x$. So head up the tree, checking balances as we go.**
+
Four possible issues
A) Right-Right Heavy:
Right-Right subtree is too tall, so apply **left rotation**
B) Left-Left Heavy
NEED PICTURE HERE


