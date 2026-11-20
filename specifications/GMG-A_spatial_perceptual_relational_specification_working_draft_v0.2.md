# Gyroscopic Meta-Gauge Assembly
## Spatial, Perceptual & Relational Instrument Specification

**System:** Ascendancy Systems · Infotech  
**Registered Instrument:** MG-001  
**Assembly:** GMG-A  
**Revision:** Working Draft v0.2  
**Predecessor:** GMG-A Technical Specification v0.1  
**Status:** Experimental · Proposed · Not Ratified

---

## I. Instrument Definition

The **Gyroscopic Meta-Gauge Assembly (GMG-A)** is a spatial and perceptual apparatus for representing defined relationships among reference frames, orientations, transformations, and observed system states.

It projects a three-dimensional instrument onto a two-dimensional display while retaining the mathematical relationships of the underlying spatial model.

The assembly supports observation, inspection, comparison, simulation, and future source-governed instrumental behavior.

It does not itself establish the truth of its inputs.

### Fundamental Principle

**The instrument's configuration constitutes a representation of defined relationships.**

Movement, orientation, color, markers, and perceptual effects do not acquire informational significance merely because they are visible.

Their meaning must be governed by explicit definitions and, where operational claims are made, inspectable sources.

---

## II. Instrument Anatomy

### A. Reference Core

A small eight-pointed star, approximately asterisk-sized relative to the assembly.

- Defines the projected origin.
- Provides a stable visual reference.
- Does not serve as a large institutional emblem.
- Does not change position when the observer reticle moves.

### B. Primary Reference Ring — R

The red ring establishes a stable orientation relative to the selected instrument reference frame.

It is locked in the initial prototype.

Reference-frame reassignment is reserved for a future controlled operation.

### C. Transforming Rings — Y, B, G

Yellow, blue, and green rings represent independently orientable geometric planes.

Each possesses:

- A persistent identity.
- A defined local coordinate frame.
- A three-dimensional orientation.
- Ring-attached orientation indices.
- A relationship to the reference frame.
- A recordable pose.

The colors identify prototype components. They do not establish permanent semantic domains.

### D. Gimbal Assembly

The assembly manages the geometrical relationships among ring frames.

Independent rotation is the initial operating model.

Nested or coupled rotations may be introduced only through explicitly defined parent–child or relational transformations.

### E. Reference Lattice

The lattice supplies a spatial reference environment.

Initially, it presents calibration geometry and reference directions.

A relational lattice, representing actual identified objects and their connections, remains a separate uncommissioned capability.

### F. Observer Reticle

A movable instrument for pointing, selecting, locking, inspecting, and comparing spatial targets.

The observer reticle is distinct from the fixed reference core.

---

## III. Coordinate & Reference Model

The instrument distinguishes:

1. **World Frame:** Stable global coordinate reference.
2. **Instrument Frame:** Selected reference for the assembly.
3. **Ring-Local Frames:** Coordinate systems belonging to individual rings.
4. **Observer Frame:** Camera orientation and projection.
5. **Target Frame:** Coordinate reference used by a selected reticle target.

All transformations must declare their source and destination frames.

Camera movement shall not mutate instrument state.

Ring movement shall not mutate unrelated ring states unless explicit coupling has been authorized.

A target's world-space identity shall remain stable when only the camera moves.

---

## IV. Movable Reticle Subsystem

### IV.A. Purpose

The observer reticle enables precise interrogation of the projected geometry.

It provides a means of identifying, selecting, measuring, and comparing geometrical features and, eventually, their registered informational counterparts.

### IV.B. Initial Modes

**Free / Aim**

The reticle moves across the visible instrument surface under user control.

Movement does not alter the source data or any ring pose.

**Inspect**

The reticle identifies an eligible visible feature.

The interface reports its component identity, geometric coordinates, reference frame, and available supporting information.

**Lock**

The reticle binds to a selected geometrical feature.

When that feature moves, the reticle follows according to its attachment and transformation rules.

Camera movement changes its screen position without changing its underlying target.

**Compare**

The user selects two reference targets.

The instrument calculates their geometric relationship, including angular separation when defined.

The result is a geometric measurement, not a research-confidence score.

**Steer / Target — Reserved**

A future mode may specify a desired orientation or transformation.

Selecting a target must not automatically issue an operational command.

Simulation and real system control require different authorization rules.

### IV.C. Initial Constraints

- Reticle movement is restricted to the visible instrument area.
- Near-hemisphere projection resolves the initial spherical target.
- Hidden features are not silently selectable.
- Ambiguous intersections must be disclosed or resolved by explicit selection.
- A target may be unlocked or returned to center.
- Fixed reference and movable reticle must remain visually distinguishable.
- Keyboard and touch operation are required before public commissioning.

---

## V. Spatial Dynamics

Every movement belongs to a declared class.

| Class | Effect |
|---|---|
| Observer motion | Changes camera pose only |
| Instrument motion | Changes an authorized instrument frame |
| Ring transformation | Changes a selected ring's pose |
| Reticle movement | Changes inspection or targeting state |
| Target lock | Establishes a persistent reference to a selected feature |
| Source-driven transition | Applies a registered transformation from authorized information |
| Simulation | Demonstrates hypothetical configurations without changing source truth |

The system shall not represent idle animation as live measurement.

Transitions must be inspectable, interruptible, and compatible with reduced-motion preferences.

---

## VI. Perceptual Design

The apparatus uses a standard two-dimensional display to present three-dimensional spatial relationships.

Depth must be communicated through consistent geometry, occlusion, shading, and movement.

Far-side ring segments shall normally be concealed.

Ring-attached indices and fixed calibration markers shall remain distinct.

Important states must remain identifiable without reliance on hue alone.

The aesthetic substrate follows Ascendancy's established chromatic hierarchy: dominant Void and neutral materials, oxidized copper for connective structure, restrained signal coloration, and rare gold for reference or culmination.

Spontaneous observer-reported perceptual effects shall not be represented as instrument telemetry.

Perceptual experiments may examine whether the apparatus improves recognition of defined relationships.

---

## VII. Relational Integrity

All meaningful components possess stable identities independent of their rendered positions.

Relationships may include:

- Reference
- Containment
- Attachment
- Alignment
- Comparison
- Dependency
- Transformation
- Selection

The system shall distinguish visual overlap from a registered informational relationship.

Moving or hiding a geometrical element must not silently alter its underlying identity or relationships.

Any change to a registered relationship must occur through the appropriate state model, not merely through animation.

---

## VIII. Instrumental Information Contract

Every source-driven behavior must declare:

- Signal or observation identifier
- Subject and scope
- Source and evidence reference
- Validated state
- Reference frame
- Mapping or transformation method
- Timestamp and freshness
- Known limitations
- Unknown or failure behavior
- Authorization status

A qualitative state has no inherent angular value.

An angle shall not be assigned to an epistemic, ethical, or operational category without a documented and justified encoding.

Unknown and invalid readings shall not generate fabricated movement.

---

## IX. Historical Orientation Vocabulary

The following historical terms are preserved without premature mathematical assignment:

**Proper · Anti · Anmti · Amnti · Anmnti**

The historically absent form **Amnmti** remains an unresolved semantic question.

The earlier Starbridge designation **True** is not automatically equivalent to Proper.

These orientations are not presently mapped to ring colors, fixed angles, or numerical states.

Reconstruction must distinguish orientation, transformation, relation, and composition.

---

## X. Operating Modes

**Observe:** Inspect the assembly without changing instrument state.

**Manipulate:** Conduct explicitly simulated ring transformations.

**Inspect:** Select and interrogate visible geometrical features through the reticle.

**Compare:** Examine differences between defined references or configurations.

**Instrument:** Display registered signal sources, transformations, freshness, limitations, and diagnostics.

**Public:** Present an approved, non-sensitive projection.

**Static:** Generate a durable snapshot corresponding to a versioned instrument configuration.

Mode changes do not themselves confer authority or change source truth.

---

## XI. Software Architecture

The software shall separate:

1. **Source and assessment records**
2. **Validated instrument state**
3. **Geometrical and relational scene model**
4. **Observer and reticle interactions**
5. **Rendering and visual presentation**

Both static and interactive renderers shall consume compatible, versioned state representations.

Rendering code shall not independently determine evidentiary validity.

The existing MG-001 v0.2 public source pipeline remains preserved during development.

---

## XII. Minimum Acceptance Tests

**Geometry**

- Independent ring rotations produce mathematically correct poses.
- Relative angles agree with an independent reference calculation.
- Occlusion correctly suppresses rear-facing arcs.
- Ring indices follow their owning frames.

**Reticle**

- Free reticle movement does not change ring geometry.
- World-locked targets remain stable under camera motion.
- Ring-locked targets follow their selected ring.
- Reticle reset restores the defined center.
- Invalid selections do not produce fabricated measurements.
- Comparing two targets returns a reproducible geometric result.

**Information Integrity**

- Missing or invalid source data produces an explicit degraded state.
- Simulated orientations remain distinguishable from source-backed readings.
- Static and interactive views represent the same saved configuration.
- The system never promotes visual appearance into evidence.

**Perception & Accessibility**

- Important differences remain legible on desktop and mobile.
- Keyboard and touch controls support essential interactions.
- Reduced-motion behavior is available.
- Color is not the sole carrier of operational meaning.

---

## XIII. Integration with MG-001

MG-001 remains the registered public Meta-Gauge.

GMG-A is its experimental gyroscopic and perceptual assembly.

The current EF-001 assessment and associated static display remain authoritative only within their existing bounded scope.

The GMG-A prototype shall not replace that source-backed display until a reviewed integration establishes:

- Compatible instrument state.
- Validated source-to-geometry mappings.
- Appropriate fallback behavior.
- Reproducible static projection.
- Confirmed accessibility.
- Public-release approval.

---

## XIV. Development Gates

**Gate 1 — Kinematic Verification:** Validate existing ring geometry, projection, clipping, indices, and camera invariants.

**Gate 2 — Observer Reticle:** Implement targeting, selection, locking, and geometric comparison.

**Gate 3 — Relational Scene Model:** Give rings, reference frames, markers, and reticle targets stable identities and typed relationships.

**Gate 4 — Instrument Coupling:** Connect one defensible, source-backed informational signal to a defined visual or geometric behavior.

**Gate 5 — Perceptual Validation:** Test whether the instrument communicates its intended relationships reliably.

**Gate 6 — Publication:** Release the reviewed interactive demonstrator and link it from the existing MG-001 public documentation.

---

## XV. Unresolved Design Questions

The following are retained for investigation rather than assumed:

- Whether the stable ring is fixed to the world or a selectable instrument reference.
- Whether future gimbals should be mechanically nested, independently orientable, or switchable.
- Whether the reticle should eventually become an authorized steering controller.
- Which kinds of relational information legitimately determine ring transformations.
- Whether the historical orientation vocabulary describes states, transformations, operators, or compositions.
- Which perceptual effects reliably improve the observer's interpretation.

---

**Disposition:** Working engineering draft.

**Implementation posture:** Sufficient to begin the reticle and relational-scene upgrades. Not sufficient to assert new informational measurements or ratify the historical orientation semantics.

*The instrument may move; the reference must remain identifiable. The observer may reorient; the underlying information must remain accountable.*
