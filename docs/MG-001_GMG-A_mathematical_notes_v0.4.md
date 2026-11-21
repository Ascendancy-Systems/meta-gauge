# MG-001 / GMG-A · Extended mathematical notes

Working Draft v0.4 companion. Claim IDs and conventions follow the [working specification](../specifications/MG-001_GMG-A_Dual_Instrument_Working_Specification_v0.4.md). These arguments verify properties of the specified models under their assumptions. Numerical checks exercise representative cases.

## TOR-01 / TOR-02 · Quotient, embedding, metric

The coordinate-wise exponential $(\theta,\phi)\mapsto(e^{i\theta},e^{i\phi})$ is continuous, onto, and identifies precisely lattice translates. It induces a continuous bijection from the quotient. The quotient is compact as the image of the closed fundamental square, and the product of circles is Hausdorff, so the bijection is a homeomorphism. Locally the lattice action is by translations, so lifted coordinates give a smooth atlas. The simply connected cover $\mathbb R^2$ has deck group $\mathbb Z^2$, yielding the fundamental group. A disk is contractible and a sphere is simply connected. This excludes homeomorphisms in either case.

For the proposed embedding let $h=R_{\rm maj}+r_{\rm min}\cos\phi$ and abbreviate $r=r_{\rm min}$. It descends through the quotient by periodicity. Given a point $(X_1,X_2,X_3)$ in its image, $\sqrt{X_1^2+X_2^2}=h>0$ recovers the azimuth modulo $2\pi$. The pair $(h-R_{\rm maj},X_3)=r(\cos\phi,\sin\phi)$ recovers the other phase. Differentiation gives

$$
\begin{aligned}
X_\theta&=h(-\sin\theta,\cos\theta,0),\\
X_\phi&=r(-\sin\phi\cos\theta,-\sin\phi\sin\theta,\cos\phi).
\end{aligned}
$$

Their inner product vanishes and their norms are positive, proving immersion and giving the metric coefficients. Compactness and a Hausdorff target give a topological embedding. Together with immersion this is a smooth embedding. At $R_{\rm maj}=r_{\rm min}$ the inner circle collapses at $\phi=\pi$ and $X_\theta=0$. The strict inequality rules this out.

## DIAL-01 · Decoding and angular error

The screen-coordinate conversion rotates the right/up mathematical vector from zero on the right to zero at the top and accounts for the clockwise screen convention. After subtracting the center, the inverse is the circle-valued argument of the complex number $-(p_y-c_y)+i(p_x-c_x)$. It is defined off the center. Taking the product gives the ideal continuous inverse on the ordered tracks. A single continuous injective hand mapping would embed the compact connected torus in a circle. A proper connected compact subset of the circle is a point or closed interval (remove any omitted point to work in a line). The whole circle has fundamental group $\mathbb Z$ and the point and interval have trivial group. None is the torus.

For additive error bounded by $\delta<\rho$, possible measured points lie in the closed disk of radius $\delta$ about the true indicator. The two tangent rays from the center bound the possible directions. The right triangle from tangency has hypotenuse $\rho$ and opposite side $\delta$, proving the bound. Include center and calibration uncertainty in the error budget. The real-valued branch can jump at zero, so compare estimates using circular distance.

## ATT-01 / NRM-01 · Attitude, normal, and plane

$$
A=\begin{pmatrix}
\cos\theta & -\sin\theta\cos\phi & \sin\theta\sin\phi\\
\sin\theta & \cos\theta\cos\phi & -\cos\theta\sin\phi\\
0 & \sin\phi & \cos\phi
\end{pmatrix}.
$$

The first column and last row give the inverse shown in the specification and are smooth when decoded as circle pairs. Conversely any $Q\in SO(3)$ with $Q_{31}=0$ has first column $(\cos\theta,\sin\theta,0)^\mathsf T$. Multiplying by $R_z(-\theta)$ fixes $\mathbf e_1$ and yields a proper rotation on its orthogonal complement. This equals $R_x(\phi)$ for a unique circular phase. Thus the image is exactly the subset with $Q_{31}=0$, including both normal poles. For that subset $A$ is a smooth embedding of the torus.

The normal differential has columns

$$
n_\theta=(\cos\theta\sin\phi,\sin\theta\sin\phi,0)^\mathsf T,\quad
n_\phi=(\sin\theta\cos\phi,-\cos\theta\cos\phi,-\sin\phi)^\mathsf T .
$$

Their Gram matrix is $\operatorname{diag}(\sin^2\phi,1)$ in the flat angular basis. The singular values are $1$ and $|\sin\phi|$. Off the poles solving $\cos\phi=n_z$ gives two possible sine signs. For either nonzero sign the in-plane components determine one angle $\theta$, with the other solution given by $(\theta+\pi,-\phi)$. At each pole exactly one phase $\phi$ is possible and $\theta$ is free. For unoriented planes the generic inverse has four states since $\mathbf n$ and $-\mathbf n$ are distinct unit vectors representing the same plane. The horizontal plane has the union of both pole fibers.

There is no unique marker location given only a normal. Even with $A$, a marker is $A(\cos\varphi_m,\sin\varphi_m,0)^\mathsf T$ and requires $\varphi_m$. Recovery from pixels adds the camera, clipping, correspondence, and resolution problem.

## GMG-01 / GMG-02 · Preservation and projection

Historical v0.1 conventions reported by v0.3 Appendix A are $\mathbf p(t)=(\cos t,\sin t,0)^\mathsf T$, $\mathbf p_{\rm world}^{(0.1)}=R_y(a)R_x(\iota)\mathbf p(t)$ and $\mathbf p_{\rm view}^{(0.1)}=R_x(c_{\rm pitch})R_y(c_{\rm yaw})\mathbf p_{\rm world}^{(0.1)}$. The marker phase was recorded separately. This is a transcription of the preserved secondary source. The original v0.1 files are pending recovery. v0.2 uses the independent rotation order and camera signs in §4. See the [provenance record](./artifact-provenance.md).

Applied to the fixture's red world points at zero yaw, $C$ gives $(\cos t,\cos\eta\sin t,-\sin\eta\sin t)$. At nonzero pitch in $(-\pi/2,\pi/2)$ the half-plane sign follows directly. The tolerance admits points just behind the ideal limb with $|\sin t|\le\varepsilon/|\sin\eta|$. If $|\sin\eta|\le\varepsilon$, every point is accepted. Actual sampled paths depend on phase spacing and segment stitching. The [transition test](../tests/reference-plane-transition.test.mjs) and [recorded snapshots](../snapshots/reference-plane-crossing/) are simulation evidence.

A depth-free orthographic coincidence can identify different world points (take $(0,0,1)$ and $(0,0,-1)$ at an identity camera). For exact unit-sphere points in the strictly enforced front hemisphere the inverse is instead unique. Tolerance, sampling, strokes and mixed-depth overlays still matter. The free-aim reticle maps $(a,e)$ to $(\sin a\cos e,\sin e)$; on the closed unit disk the chosen inverse is $z=\sqrt{1-x^2-y^2}$, $a=\operatorname{atan2}(x,z)$, $e=\arcsin(y)$. At the elevation poles azimuth is underdetermined. A screen locus does not identify a ring marker or a registered relationship by itself.

## DYN-01 / NUM-01 · Connections, sampling, and uncertainty

For $g_{\theta\theta}=h^2$, $g_{\phi\phi}=r^2$, the only nonzero metric partial is $\partial_\phi g_{\theta\theta}=-2hr\sin\phi$. Substitution into the Levi-Civita formula yields

$$
\Gamma^\theta_{\theta\phi}=\Gamma^\theta_{\phi\theta}=-r\sin\phi/h,\qquad
\Gamma^\phi_{\theta\theta}=h\sin\phi/r.
$$

Inserting into $a^k=\ddot x^k+\sum_{i,j}\Gamma^k_{ij}\dot x^i\dot x^j$ gives §5. Equivalently differentiate $X(x(t))$ twice and take the inner product against the two tangent vectors, dividing by their squared norms. The normal part accounts for extrinsic curvature. Even a dial point rotating at constant angular speed has a centripetal screen acceleration of magnitude $\rho\dot\theta^2$. That example has zero flat angular acceleration.

If the true lifted step lies in $(-\pi,\pi)$ its equivalence class has a unique representative in that interval. The continuous rate bound gives this condition by integrating the absolute rate. At a half-turn two equally short signed steps occur. For an observed principal increment $d$ and endpoint angle errors bounded by $\epsilon_0,\epsilon_1$, set $E=\epsilon_0+\epsilon_1$. The candidate true increments lie in the union of intervals $[d+2\pi j-E,d+2\pi j+E]$ intersected with $[-\Omega\Delta t,\Omega\Delta t]$. Report ambiguity when more than one branch survives; an empty intersection indicates an inconsistent record or model. Within a single branch the rate error from endpoint phase uncertainty is at most $E/\Delta t$ for exact timestamps. Timing error needs a separate budget.

One optional **flat** D2 estimator for accurate, increasing timestamps and unwrapped samples uses $h_-=t_k-t_{k-1}$ and $h_+=t_{k+1}-t_k$. It is exact for quadratic lifts:

$$
\widehat{\ddot\theta}_k=
\frac{2}{h_-+h_+}\left(
\frac{\theta_{k+1}-\theta_k}{h_+}-
\frac{\theta_k-\theta_{k-1}}{h_-}
\right).
$$

Taylor expansion gives the claim. For smooth nonquadratic lifts the leading third-derivative term is proportional to $h_+-h_-$. This estimator amplifies phase error and requires two valid adjacent intervals and a stated gap rule. Apply componentwise to $\phi$. Induced acceleration requires additional metric and velocity terms.

## TWIST-01 / REC-01 · Transport and variation

The lattice action on the total covering space translates the base and multiplies the fiber by $(-1)^m$. It is free and properly discontinuous because it is so on the base. Local lifts of small base neighborhoods trivialize the quotient bundle with transition signs, and the transport rule on the cover is independent of initial lift because transitions are constant. A loop with deck displacement $(2\pi m,2\pi n)$ compares the constant covering fiber coordinate with the initial chart via the same sign $(-1)^m$. Restricting to the $\theta$ circle produces the Möbius line: a continuous nowhere-zero section would define a real function on $[0,2\pi]$ with opposite nonzero signs at the endpoints, contradicting the intermediate value theorem. The base area form $d\theta\wedge d\phi$ descends unchanged.

For a differentiable family $x_k(s)$ with fixed $u_k,\lambda$, differentiate $x_{k+1}(s)=F(x_k(s),u_k;\lambda)$ at $s=0$. The chain rule gives $D_xF\,\delta x_k$. When inputs or parameters vary and their derivatives exist, add $D_uF\,\delta u_k$ and $D_\lambda F\,\delta\lambda$. Along the discrete map $F(x)=x+[\omega\Delta t,0]$ with $0<|\omega\Delta t|<\pi$, the derivative is the identity and the coordinate interval rate is $(\omega,0)$. Thus a tangent perturbation and a time-based rate are different quantities even for a smooth map.
