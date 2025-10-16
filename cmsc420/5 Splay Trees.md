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
