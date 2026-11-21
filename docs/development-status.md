# Meta-Gauge development status

This record tracks implementation and review milestones alongside the [versioned specifications](../specifications/README.md). Repository navigation now links the completed work. Public integration is deferred.

| Milestone | Status | Accepted scope or review boundary |
| --- | --- | --- |
| [Working Draft v0.4](../specifications/MG-001_GMG-A_Dual_Instrument_Working_Specification_v0.4.md) | Merged as an experimental working draft | Mathematical audit, proofs, and visual atlas. [PR #5](https://github.com/Ascendancy-Systems/meta-gauge/pull/5) |
| [Gate A](./MG-001_GMG-A_gate_a_contract_v0.4.md) | Complete · reviewed and merged | Versioned simulation, viewer, and qualitative assessment records. Math, missing-input behavior, and reproducibility checks. [PR #6](https://github.com/Ascendancy-Systems/meta-gauge/pull/6) |
| [Gate B](../experiments/gate-b/README.md) | Complete · reviewed and merged | Isolated dual-view simulation, synchronized sample selection, bounded reticle attachments, and [reproducible default snapshot](../experiments/gate-b/snapshot.svg). [PR #7](https://github.com/Ascendancy-Systems/meta-gauge/pull/7) |
| Gate C | Next · pending | Simulated trajectories and validated D1/D2 reticle behavior. |
| Gate D | Pending separate review | Define and validate a measurement model before advancing a quantitative operational reading. |
| Gate E | Deferred | Review public integration, accessibility, archival continuity, and release authority. The public v0.2 demonstrator is the current deployment. |

## Authority and measurement

MG-001 remains the registered public orientation instrument. GMG-A remains its experimental spatial assembly. The [operational record](https://github.com/Ascendancy-Systems/.github/blob/main/profile/META-GAUGE.md) bounds EF-001 to a qualitative assessment of a single public research-orientation statement. Gate B uses simulated phase pairs and geometric relations. Neither supports a quantitative reading of the overall Ascendancy research program.

A general-purpose Meta-Gauge instrument family developed within Ascendancy is a working possibility. An Ascendancy-specific measurement model would be one possible application. This framing carries no institutional or instrument identity decision.

## Gate C · Simulation dynamics

- Define reproducible simulated trajectories and declare the time origin, units, timestamps, sampling cadence, and permitted angular steps.
- Validate D1 as a declared tangent or velocity and D2 under the declared connection or frame. Keep state or world derivatives distinct from observer-dependent screen motion.
- Define when a trace breaks and a derivative becomes unavailable, including missing, stale, irregular, ambiguous, or invalid samples. Preserve the distinction between a measured or simulated zero and an unavailable value.
- Specify reticle target and attachment frame, labels, units, scaling, and the treatment of occlusion and camera-only motion. Demonstrate the behavior against analytic simulation fixtures.

Gate C can proceed using simulated inputs. An operational interpretation of the phases, velocities, or accelerations belongs to measurement review.

## Gate D · Measurement review

For any proposed application, identify the measurand and its scope, specify how it would be operationalized, document the evidence and provenance, and evaluate uncertainty and validity under stated conditions. Define failure and review criteria and the approving authority before adopting a mapping. EF-001 retains its own qualitative scope and authority.

## Deployment boundary

The [Pages workflow](../.github/workflows/pages.yml) stages the v0.2 viewer and pose only. Gate B can be run locally from the repository. Its inclusion in the repository and specification index carries no public release approval. The original GMG-A v0.1 files are still [pending recovery](./artifact-provenance.md), independently of the next development gate.
