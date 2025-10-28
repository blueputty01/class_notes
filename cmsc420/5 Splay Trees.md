Splay trees lead to splay sort, which is very fast on **almost sorted** data.

Splay operation (`splay(x)`):
- **BST search for $x$. $y = x \textrm{ if x }\in \textrm{tree, otherwise last node before we fall out of tree}$**
- **If $y$ is not the root**, we need to **1::bring it to the root** with **1::zig**, **1::zig-zig**, or **1::zig-zag** operations
> zig is a right or left rotation. a double left/right rotation (zig-zig) is done if $y$ is a left child of a left child or right child of a right child
> may need to do multiple of these
> search and splay operations are equivalent for splay trees

**zig** operation on a splay tree:
**![|400](z_attachments/Pasted%20image%2020251015112222.png)**
> $R$ may have a right subtree
> $y$ may have subtrees

**zig-zag** operation on a splay tree:
**![|400](z_attachments/Pasted%20image%2020251015112524.png)**
> in this example, we have a left rotation followed by a right rotation
> right child of a left child

***

Two versions of insertion on a splay tree:
1. Splay-first version: **call `splay` , and move root either left or right of new root (what we're inserting)** 
2. Splay-second version: **insert as a standard BST, then `splay` $x$ (to the root)**

---

Time complexity via amortized analysis: $\mathcal{O}(\lg n)$

There is no guarantee that these two methods produce the same result

Splay-first version:
![](z_attachments/Pasted%20image%2020251017111228.png)

---

Deletion on splay tree:
1. Splay-first version: **first `splay(x)`, then `splay` on left/right subtree (if two, otherwise simple LL-style deletion) to get IOP/IOS and use that to replace the root (x)**
2. Splay-second version: **delete as regular BST then splay the parent of the deleted node (if the deleted node is not the root)**

---

Time complexity via amortized analysis is difficult, but frequent splays tend to "balance" the tree: $\mathcal{O}(\lg n)$

![](z_attachments/Pasted%20image%2020251017111820.png)

---
***

**Zig-zig**: target is **left child of left child or vice versa**, so **two same rotations at grandparent::action**

**Zig-zag**: target is **left child of right child or vice versa**, so **one rotation at parent, and opposite at grandparent::action**
***
