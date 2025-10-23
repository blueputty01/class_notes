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