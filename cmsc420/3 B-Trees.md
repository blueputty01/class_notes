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

Height theorems: suppose a B-tree of order $m \geq 3$ has height $h$ and $k$ keys. Then 