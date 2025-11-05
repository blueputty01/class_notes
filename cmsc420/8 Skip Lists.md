How to search for $x$ in skip list:
Start at **top of $H$**.
**1::Follow the pointer until overshoot $x$. Then go back one pointer and down one level.**

How to decide height of node in skip list: **50% chance of increasing height to next node**
> ![|400](z_attachments/Pasted%20image%2020251105112905.png)
> insertion is similar, use $p$ method to determine how many levels it reaches and reconnect pointers

Expected value for number of nodes present at level $i$:
**$\mathbb{E}[N_i]=\sum_{v=1}^np^i=n\cdot p^i$**
> $I_{v,i}=\begin{cases}1&\text{if node }v\text{ is present at level }i,\\0&\text{otherwise.}&\end{cases}$
> $\begin{aligned}N_i=\sum_{v=1}^nI_{v,i}.\end{aligned}$
> $\mathbb{E}[N_i]=\sum_{v=1}^n\mathbb{E}[I_{v,i}].$
> But $\mathbb{E}[I_{v,i}]=P(I_{v,i}=1)=p^i.$
> Thus, $\mathbb{E}[N_i]=\sum_{v=1}^np^i=n\cdot p^i.$
