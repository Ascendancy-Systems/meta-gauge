# MG-001 / GMG-A — Dual-Instrument Architecture
## Toroidal Orientation Dial, Spatial Relational Assembly, and Preserved Mathematical Specification

**Program:** Ascendancy Systems · Infotech  
**Instrument identity:** MG-001 (public orientation instrument)  
**Spatial assembly:** GMG-A (gyroscopic, projected relational apparatus)  
**Revision:** Working Draft v0.3 — 2026-11-20  
**Authority:** Experimental design proposal; **not ratified, not deployed, not a source-backed geometric reading**  
**Disposition:** Specification for review before any repository change.

> **Governing distinction:** **MG-001 orients; GMG-A describes.** They may present different projections of a shared, explicitly defined state without being topologically identical or conferring authority upon one another.

## 0. Provenance, continuity, and change control

This draft **extends**, but does not replace, the existing documents and executable mathematics:

- `Ascendancy-Systems/.github/profile/META-GAUGE.md` — MG-001 public operational record v0.2, including EF-001.
- `Ascendancy-Systems/.github/profile/signals/meta-gauge-mg-001.json` — authorized qualitative signal record.
- `Ascendancy-Systems/meta-gauge/specifications/GMG-A_spatial_perceptual_relational_specification_working_draft_v0.2.md` — spatial and reticle requirements, including the observed red reference-plane visibility transition.
- `Ascendancy-Systems/meta-gauge/src/geometry.mjs` and `config/gmg-a-reference-pose-v0.2.json` — executable current spatial mathematics and reference pose.
- `GMG-A_specification_draft_v0.1.md` — historical rotation, projection, occlusion, and angle definitions (see Appendix A).

**Preservation rule:** No current angle, plane, reference, rendering, signal, or orientation term is silently redefined. A future implementation must version new adapters and test compatibility against preserved v0.1/v0.2 fixtures. Draft v0.3 describes intended behavior; unless individually marked *Existing*, it is **Proposed**.

## I. Instrument system and functional identity

**MG-001 — Toroidal Orientation Dial (proposed).** A compact, watch-like, circular instrument that encodes selected periodic state coordinates and, when justified, their direction, rate of change, quality, and source availability. Its flattened appearance is a **display encoding** of toroidal coordinates, not a homeomorphism of a torus onto a disk. It remains an orientation instrument even when its selected signal is categorical and no numerical vector exists.

**GMG-A — Spatial Relational Assembly (existing + proposed extensions).** The spherical, four-ring 3D-to-2D geometric viewer retains its fixed eight-point reference core, locked red reference plane, independently orientable yellow/blue/green planes, ring-attached markers, and observer-independent geometry. It is extended **only when an explicit adapter defines how a shared experimental state drives a ring or reticle**. It can inspect spatial configurations that the compact dial does not display.

**Dual view.** Side-by-side layout `MG-001 Toroidal | GMG-A`, with synchronized selection/time state but separable independent view controls. Neither panel must pretend to expose the other's geometry one-to-one. Selecting a channel or state in one panel may highlight its corresponding identified representation in the other; it must not silently mutate the canonical state.

## II. Toroidal mathematics and watch-face encoding

### II.A. State manifold and coordinates

For a **simulated cyclic state**, adopt the candidate base manifold

\[
T^2=S^1\times S^1=\mathbb{R}^2/(2\pi\mathbb{Z})^2,\quad x(t)=[\theta(t),\phi(t)],
\]

where both coordinates are measured in **radians**, are periodic modulo \(2\pi\), and have **no research-domain semantics by default**. The two circular directions could later express two justified periodic variables; they do not inherently mean time, evidence, progress, ethics, or coherence.

A canonical embedded torus for geometric reference only is

\[
X(\theta,\phi)=\big((R+r\cos\phi)\cos\theta,\ (R+r\cos\phi)\sin\theta,\ r\sin\phi\big),\qquad R>r>0.
\]

This embedding is **optional**, not the required look of the watch face. No physical torus has to be drawn on screen.

### II.B. Explicit flattened dial mapping

A watch face is a **readout**, not a topology-preserving flattening. Encode the two periodic coordinates as separate angular tracks:

\[
D_\theta(x)=c+\rho_\theta(\cos\theta,\sin\theta),\qquad
D_\phi(x)=c+\rho_\phi(\cos\phi,\sin\phi),
\]

with distinct radii \(0<\rho_\phi<\rho_\theta\). Each complete circular track preserves its own phase; the **combined pair of indicator positions** specifies a toroidal coordinate pair up to angular periodicity. Angular zero direction and clockwise/counterclockwise rendering convention must be declared in the UI. A single ordinary watch hand is insufficient to encode a general point in \(T^2\).

For multiple channels, use the colors **R (red/reference), Y (yellow), B (blue), G (green)** as *stable visual identifiers* only. To prevent an unreadable eight-hand dial, initially show one selected channel's full dual-coordinate pointers and compact other-channel location markers. Preserve a distinct locked/red reference indicator; do **not** silently identify an independently movable measurement with the fixed red GMG-A reference ring.

**Status discipline:** If a channel has only a qualitative reading, indicate that reading through an explicitly named category/legend or status window, **not by fabricating \(\theta\), \(\phi\), a vector magnitude, or an angle**. For unavailable/unknown measurements, show a non-positioned, labeled state.

### II.C. Dots, vectors, and traces are distinct

A **point** \(x\in T^2\) identifies state. A **tangent vector** \(v\in T_xT^2\) identifies a local direction and rate; it is not simply a colored dot. In the selected periodic coordinate chart:

\[
v(t)=\dot x(t)=\dot\theta(t)\,\partial_\theta+\dot\phi(t)\,\partial_\phi.
\]

Its components have units of radians per declared unit of time. A displayed arrow, tangent tick, or short-lived trail is a graphical encoding of a defined vector; its screen length must be normalized by a documented scale, with clipping disclosed. A reference indicator may be stationary and have no measured velocity.

### II.D. Optional Möbius-type transport — not foundational

The torus is orientable. A Möbius strip is not a torus, and the current proposal does **not** identify them. The optional twist is an **auxiliary orientation variable**, not an inherent inversion of torus tangent vectors.

An illustrative twisted real line bundle over the \(\theta\)-cycle can be defined through the identifications

\[
(\theta+2\pi,\phi,u)\sim(\theta,\phi,-u),\qquad
(\theta,\phi+2\pi,u)\sim(\theta,\phi,u).
\]

In this local description, one \(\theta\)-circuit reverses the **local representation** of the attached orientation; two circuits restore it. This is an **experimental mode**, opt-in, with a label identifying the twist and the reference frame. Without a specified transport law and interpretive purpose, it must not be used as the default model or as a metaphorical research reading.

## III. Spatial assembly preservation and coupling

### III.A. Existing geometry remains normative

GMG-A continues to represent four ring planes in a right-handed world frame and render near-side arcs in an orthographic observer view. Existing inter-plane angle calculations, marker phases, and reference pose remain untouched. See Appendix A for the exact current and historical conventions.

### III.B. Explicit, versioned adapter — not presumed equivalence

The torus \(T^2\) and the sphere \(S^2\) are topologically different. Accordingly, **no natural invertible collapse/expansion is assumed between MG-001 and GMG-A**. The two can be views of a common *abstract instrument record* via separately declared functions:

\[
I_{\rm dial}=P_{\rm MG}(S),\qquad I_{\rm spatial}=P_{\rm GMG}(S,C),
\]

where \(S\) is the authorized/simulated instrument state and \(C\) is observer pose. \(P_{\rm MG}\) and \(P_{\rm GMG}\) are versioned view mappings. Camera pose \(C\) is not part of the measured state.

For **geometric demonstration only**, a candidate non-invertible adapter may create a ring attitude from toroidal phases:

\[
A(\theta,\phi)=R_z(\theta)R_x(\phi),\qquad \mathbf n=A(\theta,\phi)(0,0,1)^\mathsf{T}.
\]

This is an explicit *trial mapping*, not the current implemented GMG-A mapping or a semantic law. It does not uniquely encode all possible 3D attitudes or the independent index phase. It must not be applied to the locked red ring without authorization; selected transforming rings are the natural simulated test subjects. All such adapter outputs are labeled `simulation`.

### III.C. Selection, reticles, and movement classes

Preserve **fixed optical reference core ≠ movable observer reticle**. New fluid-like reticles are proposed as individually toggleable **derivative pointers** around/within GMG-A:

- **Position / inspection:** identify a persistent feature or state and its declared frame.
- **D1 (tangent/velocity):** indicate the derivative of a declared world/state trajectory at the selected time, with units and calibration.
- **D2 (acceleration/change of velocity):** indicate a second derivative relative to a documented connection/frame; never infer from animated cosmetics.
- **Trace:** a finite, time-labeled history of sampled or simulated states, with legible beginning/end and gaps.

**Camera-only movement cannot create D1 or D2 system values.** A screen-space derivative of the projection may change with the camera; label that `apparent/view motion`, not `system motion`. Any animation easing or fluid interpolation is **presentation**, not source data or a physical fluid solver.

## IV. Time, derivatives, and recursion

For differentiable coordinates, the first and second derivatives are

\[
\dot x(t)=(\dot\theta,\dot\phi),\qquad \ddot x(t)=(\ddot\theta,\ddot\phi).
\]

These component derivatives use the **declared flat angular-coordinate connection** for the candidate model. A different physical metric or connection requires a different documented formula. Angle-difference calculations require unwrapped continuous trajectories or justified rate limits.

For discrete observations with reliable timestamps \(t_k\), use

\[
\Delta\theta_k=\operatorname{atan2}\!\big(\sin(\theta_k-\theta_{k-1}),\cos(\theta_k-\theta_{k-1})\big),
\qquad \widehat{\dot\theta}_k=\frac{\Delta\theta_k}{t_k-t_{k-1}},
\]

and analogously for \(\phi\). **Caution:** the shortest-arc difference aliases motion exceeding \(\pi\) radians per sample, so fast or undersampled trajectories must report ambiguity. Acceleration requires further temporally valid samples, a declared finite-difference rule, and explicit missing-data treatment. No derivative appears when temporal evidence is absent.

A candidate recursive **state evolution** is

\[
x_{n+1}=F(x_n,\,u_n;\,\lambda),\qquad
v_{n+1}=D_xF(x_n,\,u_n;\,\lambda)\,v_n
\]

for differentiable \(F\), fixed inputs \(u_n\) when interpreting \(D_xF\), and model parameters \(\lambda\). The second expression transports an infinitesimal perturbation, **not automatically the physical velocity along the evolving trajectory**. If \(F\) is not differentiable, do not display \(D_xF\) as if defined.

**Recursive calibration** is separate: compare a versioned candidate map/model with recorded outcomes, quantify error under an explicit criterion, and propose an adjustment. No self-revision of evidence, official classifications, measurement definitions, production code, or publication occurs without an approved version and tests.

## V. Evidence and informational integrity

Carry forward the MG-001 v0.2 operational contract. Each source-backed reading requires a bounded subject, source/evidence, assessment method, validation and authority status, effective/review date, limitations, and unknown/failure behavior. `EF-001` is **provisionally supported** for one specified public research-orientation statement, with evidence not publicly inspectable and authority unverified. It is **not** a numerical direction, velocity, phase, or confidence score.

The four existing MG-001 registers—**Constitutional North, Epistemic Fix, Continuity & Drift, Dependency Readiness**—remain documented qualitative categories; they are not the four GMG-A colors. A register may be `unassessed`; that is a genuine instrument reading and must remain visible without geometric fabrication.

Every displayed value must specify `mode: simulation | source-backed`, mapping version, evidence state, channel identity, units, time basis, and validity; unsupported values are `null`/`unavailable`, never coerced to zero. The public dial may be informationally useful **without** moving vector needles until a defensible numerical signal is approved.

## VI. Shared state contract (proposed)

Maintain a versioned **core state**, separate from UI state and source assessment records:

```json
{
  "schemaVersion": "dual-instrument-draft-0.3",
  "mode": "simulation",
  "model": {"type": "torus-T2", "adapterId": null, "twist": "off"},
  "time": {"sampleTime": null, "unit": "s"},
  "channels": [
    {
      "id": "Y",
      "role": "independently simulated channel",
      "phaseRad": {"theta": 0.7, "phi": 1.2},
      "velocityRadPerSecond": null,
      "accelerationRadPerSecondSquared": null,
      "sourceId": null,
      "validity": "simulated"
    }
  ],
  "selection": {"channelId": "Y"},
  "evidence": {"assessmentId": null, "status": "not-coupled"}
}
```

**Illustrative fixture only:** these phases are arbitrary test coordinates and do not claim to represent research data. A production schema should define all four channel identities, their units, optional reference linkage, and an immutable source snapshot. Observer yaw/pitch and drag position belong in an **independent viewer state**, not the core record. The existing `gmg-a-reference-pose-v0.2.json` remains a valid historical fixture and is not automatically migrated.

## VII. Presentation and interaction requirements

1. Present **MG-001 Toroidal** and **GMG-A Spatial** side by side on desktop, vertically on narrow devices. Both have independent accessible controls.
2. The MG dial is a literal, compact **watch face**: clear perimeter reference, calibrated marks where justified, two periodic-coordinate readouts for the selected simulated channel, red reference cue, and a separate **evidence/status window**. Avoid overcrowding with unselected channel needles.
3. GMG-A retains near-side occlusion, legible ring indices, selectable reticle, independently orbitable camera, and explicit simulated ring controls.
4. Selection can be shared; observer orbit, zoom, and visual smoothing must not change core state. User-driven simulated channel transformation can propagate through an explicit adapter, with a visible label.
5. Derivative reticles are off by default until the time basis and trajectories are valid. Provide numeric equivalents; never require color recognition or motion to read values.
6. Optional trial spherical-region shading is separate from the toroidal specification; use underlying 3D intersections, not 2D crossing pixels, and do not imply research significance.
7. Use Ascendancy's restrained Void, copper/bronze, neutral and rare-gold substrate, retaining red/yellow/blue/green as functional identifiers. Support reduced motion, touch, keyboard, and responsive layouts.
8. A compact static dial for the organization README must derive from the **same serialized approved state and mapping version** as its corresponding live viewer. It must label simulations and missing readings. README does not host live JavaScript.

## VIII. Acceptance tests and development gates

**Mathematical tests:**

- T2 periodicity: replacing \(\theta\) or \(\phi\) by an integer multiple of \(2\pi\) does not alter dial coordinates or a declared periodic adapter.
- Distinct dual-track phases recover the same angular state pair within declared precision; track labels/zero directions are unambiguous.
- Wrap test: \(350^\circ\to10^\circ\) yields **+20°** for the shortest permitted step, not −340°. Fast trajectories explicitly report alias risk.
- Twist-off returns unchanged attached orientation after one full cycle; twist-on produces the declared local sign reversal after one, restoration after two.
- Where a differentiable adapter and state model exist, finite-difference and analytic Jacobian computations agree within declared tolerance, excluding singular/ambiguous cases.

**Integrity and invariants:**

- Moving only the GMG-A camera leaves all core phases, ring poses, selected source states, and world-space derivatives unchanged.
- With yaw 0° and red plane fixed, the red reference-plane visible arc changes from upper at −5° pitch to lower at +10° pitch, while world-space ring normal and inter-plane angles remain invariant. Verify clipping behavior near 0°; the observed transition is not Möbius holonomy.
- Screen-space crossings do not create false world-space intersections. Reticle/world or ring locks maintain stable identities under observer movement.
- Qualitative EF-001 and all unassessed registers remain qualitative; attempts to draw unjustified numerical needles are rejected or marked unavailable.
- Cached/stale/unknown source records and data gaps produce visibly qualified readings; derivatives disappear rather than silently extrapolate.
- Snapshot and browser read the same versioned state/mapping; test desktop/mobile, reduced motion, touch and keyboard.

**Gates:**

**A — Model proof:** mathematical fixtures for torus, dual-phase dial, optional twist, and derivative definitions pass independently.

**B — Dual-view demonstrator:** add simulated MG-001 watch face beside preserved GMG-A with a tested, reversible-or-explicitly-non-invertible adapter and shared selection. Do not disturb the current public deployment.

**C — Derivative reticles:** display computed D1/D2 for validated simulated trajectories and keep observer-motion derivatives separate.

**D — Evidentiary pilot:** integrate **one** justified source-backed reading, including a defined qualitative or quantitative encoding and explicit unknown behavior. Do not use EF-001 as a fictitious angle.

**E — Public replacement:** after visual/accessibility review, replace the current organization's illustration with the compact state-matched MG dial, link to the dual-view laboratory, and preserve legacy records.

## IX. Decisions reserved for review

- **Meaning of the two cycles:** which actual system quantities, if any, warrant \(\theta\) and \(\phi\)? Until justified, these are experimental phases.
- **Reference behavior:** is the MG dial's red cue a fixed zero-frame, an independently registered reference state, or both as distinct elements? Do not silently move the locked GMG-A red plane.
- **Twist:** does a nontrivial orientation transport explain any observed variable, or is it only a demonstration mode? Default **off**.
- **Derivative semantics:** specify time base, measurement cadence, metric/connection, scale, and uncertainty before calling a displayed pointer a measurement.
- **Adapter:** which explicit mapping best relates a compact toroidal state to an inspectable 3D pose, with acknowledged loss/ambiguity?
- **Publication:** which material is approved for public presentation? The mathematical demo may be public; unverified internal source records remain protected.
- **Historical orientation vocabulary:** preserve **Proper, Anti, Anmti, Amnti, Anmnti** without mapping them to torus phases or ring colors. **Amnmti** remains the historically observed absent form; the older **True** label is not assumed equivalent to Proper. These are reserved semantic questions, not tested geometric states.

---

## Appendix A. Preserved spherical GMG-A mathematics (historical and current)

These formulas document **existing/historical** behavior. They are not replaced by the proposed toroidal mathematics.

### A.1 v0.1 historical local ring and Euler sequence

Original ring circle and ordered rotation:

\[
\mathbf p(t)=(\cos t,\sin t,0),\quad
\mathbf p_{world}^{(0.1)}=R_y(a)R_x(\iota)\,\mathbf p(t).
\]

Historical camera notation:

\[
\mathbf p_{view}^{(0.1)}=R_x(c_{pitch})R_y(c_{yaw})\,\mathbf p_{world}^{(0.1)}.
\]

The v0.1 index phase is separate from plane orientation. Signs, rotation order, and camera controls must be compared against their actual implementation before porting.

### A.2 Current v0.2 executable convention

`src/geometry.mjs` defines each ring attitude from three stored Euler angles:

\[
Q(\alpha,\beta,\gamma)=R_z(\gamma)R_y(\beta)R_x(\alpha),\quad
\mathbf p_{world}^{(0.2)}=Q\,(\cos t,\sin t,0)^\mathsf{T}.
\]

The current camera uses negated pitch/yaw in its transform:

\[
C(\psi,\eta)=R_x(-\eta)R_y(-\psi),\qquad
\mathbf p_{view}^{(0.2)}=C\,\mathbf p_{world}^{(0.2)}.
\]

Current marker phase \(\varphi_m\) enters the local point sample \(t=\varphi_m\) and does not alter the ring plane normal. **Do not treat v0.1 and v0.2 sequences as identical**; regression fixtures preserve both as separate historical versions.

### A.3 Projection, visibility, and inter-plane angle

The front hemisphere is selected by

\[
z_{view}\geq-\varepsilon,\quad \varepsilon=10^{-6}\ \text{in the checked-in v0.2 fixture};
\]

and mapped orthographically by \((u,v)=(c_x+s x,\,c_y-s y)\), with viewport-specific scale \(s\).

The plane normal \(\mathbf n_i=Q_i(0,0,1)^\mathsf T\). The existing acute angle is

\[
\alpha_{i,R}=\arccos\left(\left|\mathbf n_i\cdot\mathbf n_R\right|\right),\qquad 0\leq \alpha_{i,R}\leq\frac\pi2.
\]

The absolute value correctly treats **unoriented planes** as equivalent under normal reversal. It does **not** encode signed direction, full attitude, temporal derivative, research coherence, or marker phase.

### A.4 Reference-plane flip

With the locked red plane fixed, camera yaw 0°, and pitch from −5° to +10°, the visible red arc switches from upper to lower in the recorded experiment. The underlying red world plane **does not flip**. Exact boundary rendering is sensitive to depth tolerance and discrete sampling. This is **observer-dependent visibility**, not a Möbius transport event and not evidence of a research-state change.

## Appendix B. Mathematical preservation policy and reproducibility

- Archive the original v0.1 specification and standalone prototype as original bytes; retain the v0.2 specification, scene fixture, implementation, and observation screenshots. Do not rewrite historical formulas to fit the new model.
- In the future repository update, place this approved document as a new versioned specification and add pure mathematical tests. Preserve the existing `src/geometry.mjs` until an independently tested adapter exists.
- Record numerical tolerances, units, reference-frame conventions, sample time, rotation orders, and mapping versions next to tests; avoid visual snapshots as the sole mathematical evidence.
- Preserve source signal records independently from renderer files. A derived dial needle can always be traced to the approved version of its mapping and the source data that permitted it.
- Retain rejected alternatives and formal uncertainties in this specification's review history; do not turn each open design question into a separate GitHub issue.

**Working conclusion:** The toroidal dial is an *orientation encoding*, GMG-A a *spatial relational projection*, and recursive improvement a *governed evaluation process*. Whether a given complex system warrants toroidal state coordinates or twisted transport is a testable modeling claim, not an axiom.
