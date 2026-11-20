import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { planeAngleDeg, ringNormal, sampleProjectedRing } from "../src/geometry.mjs";

const state = JSON.parse(fs.readFileSync(
  new URL("../config/gmg-a-reference-pose-v0.2.json", import.meta.url), "utf8"
));
const red = state.rings.find((ring) => ring.id === "R");

test("red reference ring swaps visible hemispheres across observer pitch zero", () => {
  const poseBefore = structuredClone(state.rings);
  const anglesBefore = state.rings.map((ring) => planeAngleDeg(red, ring));
  const normalBefore = ringNormal(red);

  const projected = (cameraPitchDeg) => sampleProjectedRing(red, {
    ...state.projection,
    cameraYawDeg: 0,
    cameraPitchDeg,
  });

  const upper = projected(-5).filter((sample) => sample.visible);
  const silhouette = projected(0).filter((sample) => sample.visible);
  const lower = projected(10).filter((sample) => sample.visible);

  // Positive projected y appears above the screen center in the current renderer.
  assert.ok(upper.length >= 150 && upper.length <= 210);
  assert.ok(upper.filter((sample) => sample.y > 1e-5).length > upper.length * 0.90);
  assert.ok(lower.length >= 150 && lower.length <= 210);
  assert.ok(lower.filter((sample) => sample.y < -1e-5).length > lower.length * 0.90);
  assert.equal(silhouette.length, state.projection.sampleCount + 1);

  // Changing only the observer leaves world geometry and inter-plane angles intact.
  assert.deepEqual(state.rings, poseBefore);
  assert.deepEqual(ringNormal(red), normalBefore);
  assert.deepEqual(state.rings.map((ring) => planeAngleDeg(red, ring)), anglesBefore);
});

test("near-zero pitch crossing is a visibility transition, not a pose flip", () => {
  const projection = { ...state.projection, cameraYawDeg: 0 };
  const upper = sampleProjectedRing(red, { ...projection, cameraPitchDeg: -1 });
  const lower = sampleProjectedRing(red, { ...projection, cameraPitchDeg: +1 });
  const upperVisible = upper.filter((sample) => sample.visible);
  const lowerVisible = lower.filter((sample) => sample.visible);
  assert.ok(upperVisible.filter((sample) => sample.y > 1e-5).length > upperVisible.length * 0.90);
  assert.ok(lowerVisible.filter((sample) => sample.y < -1e-5).length > lowerVisible.length * 0.90);
});
