# Meta-Gauge

Public research prototype for **MG-001**, the registered Ascendancy Systems Meta-Gauge, and **GMG-A**, its experimental gyroscopic/spatial implementation.

**Status:** experimental geometric demonstrator. The geometry works; informational calibration does not yet exist.

[Open the interactive demonstrator](https://ascendancy-systems.github.io/meta-gauge/) · [Read the v0.2 working specification](./specifications/GMG-A_spatial_perceptual_relational_specification_working_draft_v0.2.md) · [Artifact provenance](./docs/artifact-provenance.md)

![GMG-A reference pose](./assets/gmg-a-reference-pose-v0.2.png)

## What works

- Four independently posed ring planes are projected from a three-dimensional world model.
- Far-side arcs are concealed by the spherical front-hemisphere projection.
- Camera motion is independent of instrument state.
- Ring-attached markers follow their owning frames.
- A reference-independent observer reticle can be moved by pointer, touch, keyboard-accessible sliders, or a center command.
- The static SVG/PNG and browser demonstrator consume the same explicit pose and projection in [`config/gmg-a-reference-pose-v0.2.json`](./config/gmg-a-reference-pose-v0.2.json).
- Geometric tests cover camera invariance, far-side occlusion, marker phase, and static/demo state identity.

## What is simulation only

- Ring manipulation and the crossed/reference presets are kinematic simulation.
- Colors distinguish prototype components; they do not encode ratified research domains.
- Angle readouts measure relationships between geometric planes only.
- The reticle reports a geometric direction on the visible hemisphere. It does not alter source data.

## What is not implemented or calibrated

- No EF-001 state is converted into an angle, pose, speed, or target.
- No live telemetry is present.
- Reticle target lock and two-target comparison remain proposals described in the v0.2 specification.
- Historical orientation terms—Proper, Anti, Anmti, Amnti, and Anmnti—have no assigned colors, angles, or mechanics.
- The original conversation-generated v0.1 HTML and v0.1 Markdown specification could not be recovered from the referenced chat attachment store in this run. They have not been silently reconstructed; see [artifact provenance](./docs/artifact-provenance.md).

## Project map

| Path | Purpose |
|---|---|
| `index.html` | Accessible interactive demonstrator |
| `src/geometry.mjs` | Shared spatial mathematics and projection |
| `src/app.mjs` | Browser controls and canvas rendering |
| `config/gmg-a-reference-pose-v0.2.json` | Versioned reference pose and camera projection |
| `scripts/render-static.mjs` | Deterministic SVG generator from the same state |
| `assets/` | Generated reference SVG and mobile-compatible PNG |
| `specifications/` | Preserved v0.2 working specification and v0.1 availability record |
| `tests/` | Geometry, occlusion, marker, and consistency tests |

## Run locally

The demonstrator has no runtime dependencies, but browsers block JSON module loading from `file://`. Serve the repository with any static server, then open `index.html`.

```text
python -m http.server 8000
```

Run the dependency-free geometry tests and regenerate the SVG:

```text
npm test
npm run render
```

The checked-in PNG is generated from the SVG with a rasterizer during release preparation. The SVG remains the canonical static projection.

## Bounded next steps

1. Recover and commit the exact original `GMG-A_interactive_prototype_v0.1.html` and `GMG-A_specification_draft_v0.1.md`, preserving their hashes and provenance.
2. Implement reticle hit-testing, world/ring target lock, and reproducible two-target geometric comparison.
3. Define and review one defensible source-to-geometry mapping before any informational pose is published.

No license is granted by omission; publication here is for public inspection and research prototyping until Ascendancy Systems selects an explicit license.
