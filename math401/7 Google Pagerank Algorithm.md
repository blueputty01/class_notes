The basic idea of the pagerank algorithm is that a webpage is important if **many other webpages link to it**. Additionally, being linked to by an "important" page should carry more weight.
+
"Websurfing" is a random walk in which the "random walk" is randomly clicking links, leading to a Markov Chain. The steady state vector gives us rankings.
+
Issues: 
Some pages don't have outbound links.
Sometimes, websurfers load up a new page without clicking a link.
+
Assumptions on random websurfer (RW):
1. Random websurfer starts on some page
2. **If there are outbound links, there is an 85% chance the RW will follow that link. Each link is equally likely. The remaining 15% chance will be that a completely new page will be chosen.**
3. **2::If the page has no outbound links, choose a random page (represented by $1/n$ in matrix)**
4. RW does this forever
> so for example: $T=\frac{0.15}{4}\left[\begin{array}{rrrr}1&1&1&1\\1&1&1&1\\1&1&1&1\\1&1&1&1\end{array}\right]+0.85\left[\begin{array}{rrrr}0&0&0&0\\1/2&0&0&0\\1/2&1&0&1\\0&0&1&0\end{array}\right]$