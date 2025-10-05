DFS implementation:
{{c1::
```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited
```
}}
>The function recursively explores all unvisited neighbors of the current node.
>The time complexity is O(V + E) where $V$ is the number of vertices and $E$ is the number of edges.

BFS implementation:
{{c1::
```python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        vertex = queue.popleft()
        print(vertex, end=" ")
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}
bfs(graph, 'A')  # Output: A B C D E F
```
}}

***

***

A **complete** graph has an edge between any all node pairs.

 A **tree** is **a simple, connected, undirected graph with no cycles**.
	no cycles

A tree with $n$ nodes has **$n-1$** edges 
	proved with structural induction

A **minimal spanning tree** is a spanning tree with **minimal total weight**.

Prim's Algorithm
1. **1::adding a vertex to a set**
2. **1::adding a vertex connected by the minimal adjacent edge weight from any in set**
3. **1::repeat until all visited**

Kruskal's Algorithm psuedocode: 
{{c1::
```
create T = set of V vertices but no edges
repeat V-1 times:
	add an edge u-v of minimal weight in G (not in T)
		whose inclusion in T doesn't form a cycle
```
}}
> cycle detection can be done in O(1) time complexity with union find/disjoint set datastructure

Dijkstra's Algorithm steps:
- pick **a vertex $x$ not in $S$ with minimum distance** (if there are several, pick any)
- add to $S$
- for every vertex $y$ adjacent to $x$:
{{c1::
```python
if dist[x] + w(x,y) < dist[y] 
	dist[y] = dist[x] + w(x,y)
	pred[y] = x
```
}}

Dijkstra's algorithm returns **the shortest path from a starting vertex to every vertex in the graph**. 

Dijkstra's algorithm **does not::does/does not** produce a minimal spanning tree.

Dijkstra's algorithm **cannot::can/cannot** find the longest path in a graph.
***
