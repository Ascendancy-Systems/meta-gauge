import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildScene, dialMarkers, initialControls, sources } from "../experiments/gate-b/scene.mjs";
import { renderDial, renderSnapshot, renderSpatial, snapshotMetadata } from "../experiments/gate-b/view.mjs";
import { adapterMatrix, recoverDialPhase } from "../scripts/v04-math.mjs";
import { markerWorldPoint, orientationMatrix, projectWorldPoint, ringNormal } from "../src/geometry.mjs";

const fromJson = (url) => JSON.parse(readFileSync(url, "utf8"));
const fixture = fromJson(sources.fixture);
const pose = fromJson(sources.pose);
const ringBy = (scene, id) => scene.rings.find((ring) => ring.id === id);

test("both views read the same sample and the dial marks decode its two phases", () => {
  for (const sample of fixture.simulation.samples) {
    const scene = buildScene(fixture, pose, { ...initialControls(fixture), selectedSampleId: sample.id });
    assert.equal(scene.dial.sampleId, sample.id);
    assert.equal(scene.spatialSampleId, sample.id);
    assert.deepEqual(scene.dial.phaseRad, sample.phaseRad);
    const center = [250, 188];
    const marks = dialMarkers(scene, center);
    for (const key of ["theta", "phi"]) {
      assert.ok(Math.abs(recoverDialPhase(marks[key], center) - sample.phaseRad[key]) < 1e-12);
    }
    assert.deepEqual(ringBy(scene, "Y").attitude, adapterMatrix(sample.phaseRad.theta, sample.phaseRad.phi));
    assert.deepEqual(scene.rings.filter((ring) => ring.driven).map(({ id }) => id), ["Y"]);
  }
});

test("locked R and unselected B/G retain their independent pose and marker phase", () => {
  const scene = buildScene(fixture, pose);
  for (const id of ["R", "B", "G"]) {
    const ring = ringBy(scene, id);
    const base = pose.rings.find((item) => item.id === id);
    assert.deepEqual(ring.attitude, orientationMatrix(base.orientationDeg));
    assert.deepEqual(ring.normal, ringNormal(base));
    assert.deepEqual(ring.marker.world, markerWorldPoint(base));
    assert.equal(ring.marker.phaseDeg, base.markerPhaseDeg);
  }
  assert.equal(ringBy(scene, "R").angleToReferenceDeg, 0);
});

test("a camera-only change preserves the dial, all world poses, marker locations, and status", () => {
  const controls = { ...initialControls(fixture), targetId: "marker-Y" };
  const before = buildScene(fixture, pose, controls);
  const after = buildScene(fixture, pose, { ...controls, observer: { yawDeg: 120, pitchDeg: 10 } });
  assert.equal(renderDial(after), renderDial(before));
  assert.notEqual(renderSpatial(after), renderSpatial(before));
  for (const id of ["R", "Y", "B", "G"]) {
    const a = ringBy(before, id), b = ringBy(after, id);
    assert.deepEqual(b.attitude, a.attitude);
    assert.deepEqual(b.marker.world, a.marker.world);
    assert.equal(b.angleToReferenceDeg, a.angleToReferenceDeg);
  }
  assert.deepEqual(after.reticle.world, before.reticle.world);
  assert.equal(after.reticle.id, before.reticle.id);
  assert.deepEqual(after.status, before.status);
});

test("ring lock uses persistent marker identity and phase while its world position follows the selected attitude", () => {
  const controls = { ...initialControls(fixture), targetId: "marker-Y" };
  const before = buildScene(fixture, pose, controls);
  const after = buildScene(fixture, pose, { ...controls, selectedSampleId: "sim-01" });
  assert.equal(after.reticle.id, before.reticle.id);
  assert.equal(after.reticle.phaseDeg, before.reticle.phaseDeg);
  assert.notDeepEqual(after.reticle.world, before.reticle.world);
  assert.deepEqual(after.reticle.world, ringBy(after, "Y").marker.world);
  assert.deepEqual(after.reticle.point, ringBy(after, "Y").marker.point);
  const { x, y, depth } = projectWorldPoint(after.reticle.world, { ...pose.projection, cameraYawDeg: 0, cameraPitchDeg: -5 });
  assert.deepEqual([after.reticle.point.x, after.reticle.point.y, after.reticle.point.depth], [x, y, depth]);
});

test("a hidden world target retains identity and no false on-screen aim is drawn", () => {
  const controls = { ...initialControls(fixture), targetId: "world-north" };
  const front = buildScene(fixture, pose, controls);
  const back = buildScene(fixture, pose, { ...controls, observer: { yawDeg: 180, pitchDeg: 0 } });
  assert.deepEqual(back.reticle.world, front.reticle.world);
  assert.ok(front.reticle.point.visible);
  assert.equal(back.reticle.point.visible, false);
  assert.match(renderSpatial(front), /data-reticle="world-north"/);
  assert.doesNotMatch(renderSpatial(back), /data-reticle=/);
});

test("cleared selection restores all reference poses and keeps the qualitative status snapshot", () => {
  const before = structuredClone({ fixture, pose });
  const scene = buildScene(fixture, pose, { ...initialControls(fixture), selectedSampleId: null });
  assert.equal(scene.dial, null);
  assert.equal(scene.spatialSampleId, null);
  for (const ring of pose.rings) assert.deepEqual(ringBy(scene, ring.id).attitude, orientationMatrix(ring.orientationDeg));
  assert.equal(scene.status.filter((record) => record.signal).length, 1);
  assert.equal(scene.status.find((record) => record.signal).signal.id, "EF-001");
  assert.throws(() => buildScene(fixture, pose, { ...initialControls(fixture), selectedSampleId: "EF-001" }));
  assert.deepEqual({ fixture, pose }, before);
});

test("the checked-in snapshot is generated from the same scene and panels as the live laboratory", () => {
  const scene = buildScene(fixture, pose);
  const svg = readFileSync(new URL("../experiments/gate-b/snapshot.svg", import.meta.url), "utf8");
  assert.equal(svg, renderSnapshot(scene));
  assert.ok(svg.includes(renderDial(scene)));
  assert.ok(svg.includes(renderSpatial(scene)));
  assert.equal(snapshotMetadata(scene).sampleId, scene.spatialSampleId);
  assert.equal(snapshotMetadata(scene).assessmentRevision, fixture.assessmentSnapshot.revision);
});
