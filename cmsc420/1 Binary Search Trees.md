Three cases for remove operation on a BST and the corresponding action:
* Case 1: **Element has no child, so remove previous reference to it**.
* Case 2: **Element has one child, so point parent to element's child**.
* Case 3: **Element has two children, so find the largest element on the left side (or smallest on the right side), copy its data to the current node, and delete the reference to that largest element (case 1 or 2 action since it may have an element on its left)** 
> best case: deletion from root or deletion of sole child of root
> worst case: deletion from end of linked list

Min height of BST: **$\lg n$**

Average height of BST (multiple options):
{{c1::
- Looking at all possible BST with $n$ nodes, take the average height: $\lg n$
- Looking at all sequences of insertions/deletions:
	- if only in order predecessor/in order successor: $\sqrt n$
	- if we randomly choose in order predecessor/in order successor: $\lg n$ (suggested)
}}


