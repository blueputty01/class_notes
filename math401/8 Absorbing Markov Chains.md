	For any absorbing Markov Chain with $T=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_{s}\end{bmatrix}$, the $(i, j)$ entry of **$R(I_r-Q)^{-1}$** is the **probability of ending in absorbing state $a_i$ given that we started in transient state $t_j$**.
> $\begin{aligned}&T^2=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}=\begin{bmatrix}Q^2&\bar{0}_{r\times s}\\RQ+R&I_s\end{bmatrix}\\&T^3=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}\begin{bmatrix}Q^2&\bar{0}_{r\times s}\\RQ+R&I_s\end{bmatrix}=\begin{bmatrix}Q^3&\bar{0}_{r\times s}\\RQ^2+RQ+R&I_s\end{bmatrix}\\&T^4=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}\begin{bmatrix}Q^3&\bar{0}_{r\times s}\\RQ^2+RQ+R&I_s\end{bmatrix}=\begin{bmatrix}Q^4&\bar{0}_{r\times s}\\RQ^3+RQ^2+RQ+R&I_s\end{bmatrix}.\end{aligned}$
> So in general, the pattern is: 
> $T^k=\begin{bmatrix}Q^k&\bar0_{r\times s}\\R+RQ+\ldots+RQ^{k-1}&I_s\end{bmatrix}=\begin{bmatrix}Q^k&\bar0_{r\times s}\\R\sum_{i=0}^{k-1}Q^i&I_s\end{bmatrix}.$

For any absorbing Markov Chain with $T=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_{s}\end{bmatrix}$, the $(i, j)$ entry of **$(I_r-Q)^{-1}$** is the **expected number of visits (before absorption) to state $t_i$ given that we started in $t_j$**
> $\begin{aligned}&T^2=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}=\begin{bmatrix}Q^2&\bar{0}_{r\times s}\\RQ+R&I_s\end{bmatrix}\\&T^3=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}\begin{bmatrix}Q^2&\bar{0}_{r\times s}\\RQ+R&I_s\end{bmatrix}=\begin{bmatrix}Q^3&\bar{0}_{r\times s}\\RQ^2+RQ+R&I_s\end{bmatrix}\\&T^4=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}\begin{bmatrix}Q^3&\bar{0}_{r\times s}\\RQ^2+RQ+R&I_s\end{bmatrix}=\begin{bmatrix}Q^4&\bar{0}_{r\times s}\\RQ^3+RQ^2+RQ+R&I_s\end{bmatrix}.\end{aligned}$
> So in general, the pattern is: 
> $T^k=\begin{bmatrix}Q^k&\bar0_{r\times s}\\R+RQ+\ldots+RQ^{k-1}&I_s\end{bmatrix}=\begin{bmatrix}Q^k&\bar0_{r\times s}\\R\sum_{i=0}^{k-1}Q^i&I_s\end{bmatrix}.$

For any absorbing Markov Chain with $T=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_{s}\end{bmatrix}$, the $j$-th column sum of **$(I_r-Q)^{-1}$** is the **expected number of time steps before absorption, assuming we started in $t_j$.**
> $\begin{aligned}&T^2=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}=\begin{bmatrix}Q^2&\bar{0}_{r\times s}\\RQ+R&I_s\end{bmatrix}\\&T^3=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}\begin{bmatrix}Q^2&\bar{0}_{r\times s}\\RQ+R&I_s\end{bmatrix}=\begin{bmatrix}Q^3&\bar{0}_{r\times s}\\RQ^2+RQ+R&I_s\end{bmatrix}\\&T^4=\begin{bmatrix}Q&\bar{0}_{r\times s}\\R&I_s\end{bmatrix}\begin{bmatrix}Q^3&\bar{0}_{r\times s}\\RQ^2+RQ+R&I_s\end{bmatrix}=\begin{bmatrix}Q^4&\bar{0}_{r\times s}\\RQ^3+RQ^2+RQ+R&I_s\end{bmatrix}.\end{aligned}$
> So in general, the pattern is: 
> $T^k=\begin{bmatrix}Q^k&\bar0_{r\times s}\\R+RQ+\ldots+RQ^{k-1}&I_s\end{bmatrix}=\begin{bmatrix}Q^k&\bar0_{r\times s}\\R\sum_{i=0}^{k-1}Q^i&I_s\end{bmatrix}.$




***
