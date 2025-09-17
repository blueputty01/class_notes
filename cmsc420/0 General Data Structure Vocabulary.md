The height of a tree is the **maximum distance between the root and a leaf**
> ![|200](z_attachments/Pasted%20image%2020250915112150.png)

The height of a null set is **$-1$**
> ![|300](z_attachments/Pasted%20image%2020250915112457.png)

Levels in *this* class will be **0::0 or 1** index and top down
> ![|300](z_attachments/Pasted%20image%2020250915112700.png)

Storage options for tree:
**1::child pointers**
**1::parent pointers**
**1::list**

A size balanced tree means that, **for all nodes, the number of nodes in the left subtree equal the number of nodes in the right subtree**.
> balance of binary trees can be a combination of size/height balanced or other options

A height balanced tree means that, **for all nodes, the height of the left subtree equals the height of the right subtree**.
> balance of binary trees can be a combination of size/height balanced or other options

The **in-order::traversal type** **1::predecessor::predecessor/successor** is the **largest::smallest/largest** key **2::less** than x.
> node immediately before in the in-order traversal

The **in-order::traversal type** **1::successor::predecessor/successor** is the **smallest::smallest/largest** key **2::greater** than x.
> node immediately after in the in-order traversal

Pre-order traversal:
**1 2 4 5 3 6 7**
![](z_attachments/Pasted%20image%2020231025134747.png)

---

```python
visit node.data
recurse(left)
recurse(right)
```

---

In-order traversal:
**4 2 5 1 6 3 7**
![](z_attachments/Pasted%20image%2020231025134747.png)

---

```python
visit node.data
recurse(left)
recurse(right)
```

---

Post-order traversal:
**4 5 2 6 7 3 1**
![](z_attachments/Pasted%20image%2020231025134747.png)

---

```python
visit node.data
recurse(left)
recurse(right)
```

---

