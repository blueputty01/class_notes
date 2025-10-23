The **alternate/cycle splitting** method for kd-tree construction cycles through **dimensions at each level of the tree, splitting perpendicular to the chosen axis**.
> let's decide that equal coordinates go right
> this is easy to generalize to more dimensions

KD tree deletion: handling the non leaf case
Suppose the node we're deleting splits by coord $\alpha$.
If the node has a right subtree, then find a point/node on the right subtree with minimum $\alpha$-coord.
Use it as a replacement, then delete the replacement.
Else, **find a point/node in the left subtree with minimum $\alpha$-coord, use it as a replacement, move the entire left subtree to be a right subtree, then recursively delete the old replacement**
> for the first method: if we use the left subtree, this could mess with our decision that equal coordinates go right (since the node used as the replacement could be equal to other nodes in the subtree)
> for the second method: if we use the maximum $\alpha$-coord, it can mess with our decision for equal coordinates to go right

***
