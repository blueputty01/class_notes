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
Do an in order traversal to get a list of nodes/keys in increasing order
Set the key with index $\lfloor \frac{k}{2} \rfloor$ as the new root. Recurse left with all the smaller keys and right with all the larger keys.

TEMP, NOT PROCESSED

***