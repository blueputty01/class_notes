Structure: 
- $m = \textrm{max number of points allowed in a leaf}$ 
- min is 1
- Insert into root/leaf until full, then split and form an internal node **(coord = val)**
Several ways to choose splitting coordinate:
1. Cycle split
2. Spread split: split by coordinate with largest spread (maximum - minimum) 
3. Other ways?
Sort the rest of the coordinates with ties broken by **the remaining coordinates in cycling order**. Select median as splitting value.
> note that equal coordinates might end up both ways
> things to do: search, deletion, nearest neighbor queries
> range query

Deletion: simply delete the point from the leaf
If **the leaf is still non empty, done**, otherwise **1::the splitting node (parent) is no longer required--remove and promote the leaf's sibling**.
> ![|300](z_attachments/Pasted%20image%2020251027111248.png)

Using EKD trees for queries:
Nearest-neighbor query: given a point $P$ and integer $k \geq 1$, find the $k$ points in the tree closest to $P$. 
This is recursive in nature, starting at root.
+
If we're at a leaf, include the leaf points in our list if they "improve" the list. For example, if the list is not full or if points in the leaf are closer to $P$ than points in the list.
+
If we're at a splitting node:
- only visit a child if **the list is not full or** if the child's bounding box is **1::at least as close to $P$ as the furthest point already in our list**
- if both bounding boxes might improve the list, then visit the closer one first and then reevaluate before (potentially) visiting the other one

---

note that it's not hard to write a function to calculate the distance from a point to a bounding box. we'll use $\operatorname{dist}^2$ to avoid $\sqrt{}$ and floating points

$\begin{aligned}&d^2\:\text{value}=\sum_{i=1}^k\text{dist}(P_i,[i_{min},i_{max}])^2\end{aligned}$
 
Using EKD trees for queries:
Range query (bounding box):
This is recursive in nature, starting at root.

If we're at a leaf, include all points which are in the query box, including on the edge.

If we're at a splitting node:
- only visit a child if the child's bounding box intersects with the box

---
***
