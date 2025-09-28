An economically unfeasible situation occurs in a Leontief Input-Output model when **the column sums are greater than 1**, since **producing one unit of a product will consume more than 1 unit of the total products**.

The Leontief Input-Output Model is given by: **$\bar{p}=M\bar{p}+\bar{d}$**
> the matrix $M$ is the consumption matrix
> The consumption matrix is made up of consumption vectors. The j th column is the j th consumption vector and contains the necessary input required from each of the Sectors for Sector j to produce one unit of output.

Solving for $\bar{d}$ in the Leontief Input-Output model ($\bar{p}=M\bar{p}+\bar{d}$):
$\bar{p}=**(I-M)^{-1}\bar{d}**$
***

For $I + M + M^2 + \dots$  to converge, **the column sums of $M$ must add to 1**
> Think of $M$ as a “transition” matrix where each entry $M_{ij}$ is a “fraction” of something being passed from $j$ to $i$, but since the **total output** from each column (each source $j$) sums to less than 1, the process **loses mass** over time.
> - Multiplying by $M$ repeatedly $M^n$ makes the values shrink to zero exponentially fast.
> - The series $I + M + M^2 + \dots$ adds up all the contributions over **all time steps**:  
>   - $I$ = direct identity (what you start with).  
>   - $M$ = first-step effect.  
>   - $M^2$ = second-step effect, etc.  
> - Because the powers decay, the sum converges.
> 
> In economic terms: If $M$ is a production input matrix with productivity < 1 (Leontief model), $(I - M)^{-1}$ is the **total direct and indirect requirements** matrix — summing over all rounds of production.
> 
> **Final intuitive summary:**  
> Each column sum < 1 means that in one step, the total “amount” in the system decreases. So repeated multiplication by \$M $ makes the effect vanish over time, allowing the infinite sum of powers to make sense and equal the inverse.

***
