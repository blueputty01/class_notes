The identity $P\left(\bigcup_{i=1}^{\infty}A_{i}|\,B\right)=\sum_{i=1}^{\infty}P(A_{i}|\,B)$ can be proved through **induction** and the **1::distributive law**.
> $P \cup A_i | B = \frac{P(\cup A_i) \cap B}{P(B)}=\frac{P(A_1) \cap P(B)}{P(B)} \cup \cdots$  

***

The odds of an event $A$ are defined by **$\frac{P(A)}{P(A^c)} = \frac{P(A)}{1 - P(A)}$** 
> odds updating formula: $\frac{P(H|E)}{P(H^c|E)}=\frac{P(H)}{P(H^c)}\frac{P(E|H)}{P(E|H^c)}$

***

If $E$, $F$ and $G$ are independent, then $E$ will be **independent** of any event formed from $F$ and $G$.

---

Must show: P(E(FuG)) = P(E)P(FuG)

P(E(FuG)) = P(E(FG u $F^c$G u F$G^c$)) = P(EFG u E$F^c$G u EF$G^c$) = P(EFG) + P(E$F^c$G) + P(EF$G^c$) = P(E)P(FG) + P(E)P($F^c$G) + P(E)P(F$G^c$) = $P(E)[P(FG)+P(F^cG)+P(FG^c)]$ = P(E)P(F u G)

Apologies for horrible formatting. I think it's ugly but clear enough.

---

***
