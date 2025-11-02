Algorithm for set of strings to trie:
Divide up first letters, and **take the longest common prefix** within each group. These will be the root's branch labels.
+
Repeat with the suffixes. When we run out of letters, put $ and value.

A compressed trie is a tree satisfying all of:
- branches are labeled with strings
- no two **sibling branch labels may share a prefix (eg dog, doll)**
- only leaves have values and leaves are connected to their parents by branches labeled $
- the only nodes which may have **one** child are the parents of leaves and the root node

A compressed trie **is::is/is not** unique for a set of strings.
> there is a 1-1 correlation between sets of strings and tries

Height bounds:
Suppose a trie contains $n$ strings with max length $k$. Then $h \geq **k + 1**$
Suppose a trie contains $n$ strings. Then $h \geq **n + 1**$

Insertion cases:
Search suffix is empty
Search suffix doesn't partially match, so add new suffix branch to node
Search suffix partially matches one of the branch labels: 
**Replace that branch by a new branch with the partial match. The split into previous suffix and remaining suffix.**
