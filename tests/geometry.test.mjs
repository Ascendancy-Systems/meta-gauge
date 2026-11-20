import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { markerWorldPoint, planeAngleDeg, projectWorldPoint, ringNormal, sampleProjectedRing, visibleSegments } from "../src/geometry.mjs";

const state = JSON.parse(fs.readFileSync(new URL("../config/gmg-a-reference-pose-v0.2.json", import.meta.url), "utf8"));

test("independent ring pose is invariant under camera movement", () => {
  const blue = state.rings.find((ring) => ring.id === "B");
  const red = state.rings.find((ring) => ring.id === "R");
  const beforeNormal = ringNormal(blue);
  const beforeAngle = planeAngleDeg(red, blue);
  const movedCamera = {...state.projection, cameraYawDeg:-132, cameraPitchDeg:67};
  projectWorldPoint(markerWorldPoint(blue), movedCamera);
  assert.deepEqual(ringNormal(blue), beforeNormal);
  assert.equal(planeAngleDeg(red, blue), beforeAngle);
});

test("front-hemisphere projection occludes far-side ring samples", () => {
  for (const ring of state.rings) {
    const samples = sampleProjectedRing(ring, state.projection);
    const visible = samples.filter((sample) => sample.visible);
    assert.ok(visible.length > 0 && visible.length < samples.length, `${ring.id} must be partially visible`);
    for (const segment of visibleSegments(samples)) assert.ok(segment.every((sample) => sample.depth >= -state.projection.occlusionEpsilon));
  }
});

test("marker phase changes marker position without changing its plane", () => {
  const yellow = structuredClone(state.rings.find((ring) => ring.id === "Y"));
  const normalBefore = ringNormal(yellow);
  const markerBefore = markerWorldPoint(yellow);
  yellow.markerPhaseDeg += 47;
  assert.notDeepEqual(markerWorldPoint(yellow), markerBefore);
  assert.deepEqual(ringNormal(yellow), normalBefore);
});

test("static renderer and demo reference one exact versioned state", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const app = fs.readFileSync(new URL("../src/app.mjs", import.meta.url), "utf8");
  const renderer = fs.readFileSync(new URL("../scripts/render-static.mjs", import.meta.url), "utf8");
  const path = "gmg-a-reference-pose-v0.2.json";
  assert.match(app, new RegExp(path.replaceAll(".", "\\.")));
  assert.match(renderer, new RegExp(path.replaceAll(".", "\\.")));
  assert.match(html, /src\/app\.mjs/);
  assert.equal(state.id, "GMG-A-REFERENCE-POSE-0.2");
  assert.equal(state.semantics.ef001GeometryMapping, "undefined");
});
