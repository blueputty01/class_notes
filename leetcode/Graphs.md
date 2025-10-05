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

Dijkstra's algorithm steps:
go to **lowest sum**
**1::calculate distance to all adjacent nodes if not visited**
**1::update distance if lower**
**1::repeat**
> ![](z_attachments/Pasted%20image%2020251002173944.png)
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