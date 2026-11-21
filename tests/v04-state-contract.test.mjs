import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { selectDraftViews } from "../scripts/v04-state-contract.mjs";
import { wrapAngle, TAU, shortestAngularDelta, sampleIdentifiability, estimatePhaseInterval } from "../scripts/v04-math.mjs";

const fixture = () => JSON.parse(readFileSync(new URL("./fixtures/v04-dual-view.json", import.meta.url), "utf8"));

test("the selected simulation and the qualitative evidence snapshot coexist independently", () => {
  const input = fixture();
  const before = structuredClone(input);
  const result = selectDraftViews(input);
  assert.equal(result.dial.mode, "simulation");
  assert.equal(result.dial.channelId, "Y");
  assert.deepEqual(result.dial.phaseRad, { theta: 1.02, phi: 4.62 });
  assert.equal(result.spatial.sampleId, result.dial.sampleId);
  assert.equal(result.spatial.adapterId, input.simulation.adapterId);
  assert.deepEqual(result.status, input.assessmentSnapshot);
  assert.equal(result.status.registers.filter(({ kind }) => kind === "unavailable").length, 3);
  result.dial.phaseRad.theta = 0;
  result.observer.pitchDeg = 0;
  result.status.registers[1].state = "changed";
  assert.deepEqual(input, before);
});

test("camera, selection and evidence changes affect only their declared derived outputs", () => {
  const input = fixture();
  const projections = selectDraftViews(input);
  const moved = structuredClone(input);
  moved.viewer.observer.pitchDeg = 10;
  assert.deepEqual(selectDraftViews(moved), { ...projections, observer: moved.viewer.observer });
  moved.viewer.selectedSampleId = "sim-01";
  const selected = selectDraftViews(moved);
  assert.equal(selected.spatial.sampleId, "sim-01");
  assert.notDeepEqual(selected.dial, projections.dial);
  assert.deepEqual(selected.status, projections.status);
  assert.deepEqual(moved.simulation, input.simulation);
  assert.deepEqual(moved.assessmentSnapshot, input.assessmentSnapshot);
  moved.assessmentSnapshot.registers[1].freshness = "stale";
  assert.deepEqual(selectDraftViews(moved).spatial, selected.spatial);
  assert.equal(selectDraftViews(moved).status.registers[1].freshness, "stale");
  moved.assessmentSnapshot.registers[1] = { id: "epistemic-fix", kind: "unavailable", reason: "missing" };
  assert.deepEqual(selectDraftViews(moved).dial, selected.dial);
  moved.viewer.selectedSampleId = null;
  const cleared = selectDraftViews(moved);
  assert.equal(cleared.dial, null);
  assert.equal(cleared.spatial, null);
  assert.equal(cleared.status.registers[1].reason, "missing");
});

test("invalid IDs, fields, samples, or evidence promotion fail validation", () => {
  for (const mutate of [
    (s) => { s.viewer.selectedSampleId = "EF-001"; },
    (s) => { s.viewer.observer.pitchDeg = null; },
    (s) => { s.simulation.samples[0].channelId = "R"; },
    (s) => { s.simulation.samples[0].phaseRad.theta = null; },
    (s) => { s.simulation.samples[0].phaseRad.theta = TAU; },
    (s) => { s.simulation.samples[1].timeS = 0; },
    (s) => { s.assessmentSnapshot.registers[1].phaseRad = { theta: 0, phi: 0 }; },
    (s) => { s.assessmentSnapshot.registers[1].authorityVerified = true; },
    (s) => { s.assessmentSnapshot.registers[0].score = 0; },
  ]) {
    const invalid = fixture();
    mutate(invalid);
    assert.throws(() => selectDraftViews(invalid));
  }
});

test("phase helpers reject absent, coerced and non-finite values", () => {
  for (const bad of [null, undefined, "", "0", false, NaN, Infinity, -Infinity]) {
    assert.throws(() => wrapAngle(bad), TypeError);
    assert.throws(() => shortestAngularDelta(bad, 0), TypeError);
    assert.throws(() => shortestAngularDelta(0, bad), TypeError);
    assert.throws(() => sampleIdentifiability(bad, 1), RangeError);
    assert.throws(() => sampleIdentifiability(0, bad), RangeError);
  }
  assert.equal(wrapAngle(-1e-17), 0);
  assert.equal(wrapAngle(-TAU), 0);
});

test("interval estimator distinguishes zero from unavailable and rejects timing and alias failures", () => {
  const from = { phaseRad: 0, timeS: 0 };
  const stop = { ...from, timeS: 1 };
  assert.deepEqual(estimatePhaseInterval(from, stop, 0, 1), { rateRadPerS: 0, reason: null });
  assert.equal(estimatePhaseInterval(from, { ...stop, phaseRad: 1e-16 }, 0, 1).reason, "inconsistent-bound");
  assert.equal(estimatePhaseInterval(from, stop, null, 1).reason, "missing-or-invalid-input");
  assert.equal(estimatePhaseInterval(from, { ...stop, phaseRad: null }, 1, 1).reason, "missing-or-invalid-input");
  assert.equal(estimatePhaseInterval(from, { ...stop, timeS: NaN }, 1, 1).reason, "missing-or-invalid-input");
  assert.equal(estimatePhaseInterval(stop, from, 1, 1).reason, "invalid-timestamps");
  assert.equal(estimatePhaseInterval(from, from, 1, 1).reason, "invalid-timestamps");
  assert.equal(estimatePhaseInterval(from, stop, 1, 0.9).reason, "gap");
  assert.equal(estimatePhaseInterval(from, { ...stop, phaseRad: Math.PI }, Math.PI, 1).reason, "ambiguous-wrap");
  assert.equal(estimatePhaseInterval(from, { ...stop, phaseRad: 1 }, 0.5, 1).reason, "inconsistent-bound");
  const beforeSeam = { phaseRad: TAU - 0.2, timeS: 1 };
  const afterSeam = { phaseRad: 0.2, timeS: 2 };
  const estimate = estimatePhaseInterval(beforeSeam, afterSeam, 0.5, 1);
  assert.equal(estimate.reason, null);
  assert.ok(Math.abs(estimate.rateRadPerS - 0.4) < 1e-12);
});
