import assert from "node:assert/strict";
import test from "node:test";
import { adapterMatrix, inducedMetricAcceleration, torusPoint } from "../scripts/v04-math.mjs";
import { multiplyMatrix, projectWorldPoint, radToDeg, rotationX, rotationZ } from "../src/geometry.mjs";

const diff = (p, q, scale) => p.map((value, i) => (value - q[i]) / scale);
const dot = (p, q) => p.reduce((sum, value, i) => sum + value * q[i], 0);

test("the trial attitude agrees with v0.2 rotation primitives across regular and pole poses", () => {
  for (const theta of [0, 0.1, 1.02, 4.6, 2 * Math.PI - 0.01]) {
    for (const phi of [0, 0.6, Math.PI, 4.62]) {
      assert.deepEqual(
        adapterMatrix(theta, phi).flat().map((value) => value || 0),
        multiplyMatrix(rotationZ(theta), rotationX(phi)).flat().map((value) => value || 0),
      );
    }
  }
});

test("induced acceleration matches the tangent projection of finite-difference ambient acceleration", () => {
  const R = 3, r = 1, h = 1e-4;
  for (const [theta, phi] of [[0.2, 0.9], [1.4, Math.PI / 2], [2.1, 4.3]]) {
    const path = (t) => torusPoint(theta + 0.7 * t + 0.2 * t * t, phi - 0.3 * t + 0.1 * t * t, R, r);
    const center = path(0), plus = path(h), minus = path(-h);
    const ambient = center.map((value, i) => (plus[i] - 2 * value + minus[i]) / (h * h));
    const partials = [
      diff(torusPoint(theta + h, phi, R, r), torusPoint(theta - h, phi, R, r), 2 * h),
      diff(torusPoint(theta, phi + h, R, r), torusPoint(theta, phi - h, R, r), 2 * h),
    ];
    const projected = partials.map((u) => dot(ambient, u) / dot(u, u));
    const analytic = inducedMetricAcceleration({
      phi, thetaFirst: 0.7, phiFirst: -0.3, thetaSecond: 0.4, phiSecond: 0.2,
      majorRadius: R, minorRadius: r,
    });
    projected.forEach((value, i) => assert.ok(Math.abs(value - analytic[i]) < 1e-6));
  }
});

test("camera-only yaw produces apparent velocity and acceleration for a fixed world point", () => {
  const world = Object.freeze([1, 0, 0]);
  const yaw = 0.7, h = 1e-4;
  const projected = (time) => projectWorldPoint(world, {
    cameraYawDeg: radToDeg(yaw + time), cameraPitchDeg: 0, occlusionEpsilon: 1e-6,
  });
  const [minus, center, plus] = [-h, 0, h].map(projected);
  assert.ok([minus, center, plus].every(({ visible }) => visible));
  const velocity = (plus.x - minus.x) / (2 * h);
  const acceleration = (plus.x - 2 * center.x + minus.x) / (h * h);
  assert.ok(Math.abs(velocity + Math.sin(yaw)) < 1e-7);
  assert.ok(Math.abs(acceleration + Math.cos(yaw)) < 1e-7);
  assert.deepEqual(world, [1, 0, 0]);
});
