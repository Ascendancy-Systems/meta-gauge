import assert from "node:assert/strict";
import test from "node:test";
import {
  TAU, adapterMatrix, adapterNormal, dialPoint, inducedMetricAcceleration,
  normalDifferentialRank, normalJacobian, perturbationStep, recoverDialPhase,
  sampleIdentifiability, shortestAngularDelta, torusMetric, torusPoint,
  twistedTransport, wrapAngle,
} from "../scripts/v04-math.mjs";

const close = (actual, expected, tolerance = 1e-11) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
};
const vectorClose = (actual, expected, tolerance = 1e-11) => {
  assert.equal(actual.length, expected.length);
  actual.forEach((value, index) => close(value, expected[index], tolerance));
};

test("quotient representatives are periodic for embedding, dial, adapter, and normal", () => {
  const theta = 0.73, phi = 1.19;
  vectorClose(torusPoint(theta + TAU, phi - 2 * TAU, 3, 1), torusPoint(theta, phi, 3, 1));
  vectorClose(dialPoint(theta + TAU, 2), dialPoint(theta, 2));
  adapterMatrix(theta + TAU, phi - TAU).flat().forEach((value, index) =>
    close(value, adapterMatrix(theta, phi).flat()[index]));
  vectorClose(adapterNormal(theta + TAU, phi - TAU), adapterNormal(theta, phi));
});

test("the two labeled tracks recover their phases under the declared dial convention", () => {
  vectorClose(dialPoint(0, 2), [0, -2]);
  vectorClose(dialPoint(Math.PI / 2, 2), [2, 0]);
  assert.equal(recoverDialPhase([0, 0]), null);
  for (const phase of [0, 0.2, Math.PI / 2, Math.PI, 1.9 * Math.PI]) {
    close(recoverDialPhase(dialPoint(phase, 0.8, [2, -3]), [2, -3]), wrapAngle(phase));
  }
});

test("the full restricted adapter distinguishes phase pairs modulo 2pi", () => {
  const samples = [[0.2, 0.4], [1.3, 2.1], [5.9, 0], [5.9, Math.PI]];
  for (const [theta, phi] of samples) {
    const matrix = adapterMatrix(theta, phi);
    const recoveredTheta = wrapAngle(Math.atan2(matrix[1][0], matrix[0][0]));
    const recoveredPhi = wrapAngle(Math.atan2(matrix[2][1], matrix[2][2]));
    close(recoveredTheta, wrapAngle(theta));
    close(recoveredPhi, wrapAngle(phi));
  }
});

test("the derived normal is many-to-one and loses rank at phi 0 and pi", () => {
  vectorClose(adapterNormal(0.1, 0), adapterNormal(2.7, 0));
  vectorClose(adapterNormal(0.4, Math.PI), adapterNormal(5.2, Math.PI));
  assert.equal(normalDifferentialRank(0), 1);
  assert.equal(normalDifferentialRank(Math.PI), 1);
  assert.equal(normalDifferentialRank(0.4), 2);
  const jacobian = normalJacobian(0.9, 0);
  vectorClose(jacobian.map((row) => row[0]), [0, 0, 0]);
  vectorClose(adapterNormal(0.7, 1.2), adapterNormal(0.7 + Math.PI, -1.2));
});

test("normal Jacobian agrees with centered finite differences away from the poles", () => {
  const h = 1e-5;
  for (const [theta, phi] of [[0.3, 1.1], [2.9, 4], [6.27, 0.2]]) {
    const jacobian = normalJacobian(theta, phi);
    const thetaPlus = adapterNormal(theta + h, phi);
    const thetaMinus = adapterNormal(theta - h, phi);
    const phiPlus = adapterNormal(theta, phi + h);
    const phiMinus = adapterNormal(theta, phi - h);
    jacobian.forEach(([dTheta, dPhi], i) => {
      close(dTheta, (thetaPlus[i] - thetaMinus[i]) / (2 * h), 5e-10);
      close(dPhi, (phiPlus[i] - phiMinus[i]) / (2 * h), 5e-10);
    });
  }
});

test("metric coefficients agree with the Gram matrix of finite-difference embedding tangents", () => {
  const h = 1e-5, theta = 0.43, phi = 1.13, R = 3, r = 1;
  const tangent = (plus, minus) => plus.map((v, i) => (v - minus[i]) / (2 * h));
  const a = tangent(torusPoint(theta + h, phi, R, r), torusPoint(theta - h, phi, R, r));
  const b = tangent(torusPoint(theta, phi + h, R, r), torusPoint(theta, phi - h, R, r));
  const dot = (u, v) => u.reduce((sum, value, i) => sum + value * v[i], 0);
  const g = torusMetric(phi, R, r);
  vectorClose([dot(a, a), dot(a, b), dot(b, b)], [g[0][0], 0, g[1][1]], 1e-8);
});

test("the embedded torus metric is positive definite for a regular ring torus", () => {
  for (const phi of [0, Math.PI / 3, Math.PI]) {
    const metric = torusMetric(phi, 3, 1);
    assert.ok(metric[0][0] > 0 && metric[1][1] > 0);
    assert.equal(metric[0][1], 0);
  }
  assert.throws(() => torusMetric(0, 1, 1), /regular ring torus/);
});

test("flat coordinate and induced-metric acceleration are explicitly distinct", () => {
  const induced = inducedMetricAcceleration({
    phi: Math.PI / 2, thetaFirst: 2, phiFirst: 0.5,
    thetaSecond: 0, phiSecond: 0, majorRadius: 3, minorRadius: 1,
  });
  vectorClose(induced, [-2 / 3, 12]);
  assert.notDeepEqual(induced, [0, 0]);
});

test("shortest-arc sampling works only under an explicit identifiability bound", () => {
  close(shortestAngularDelta(10 * Math.PI / 180, 350 * Math.PI / 180), 20 * Math.PI / 180);
  assert.equal(sampleIdentifiability(2, 1).identifiableByShortestArc, true);
  assert.equal(sampleIdentifiability(4, 1).identifiableByShortestArc, false);
  assert.deepEqual(sampleIdentifiability(Math.PI, 1), {
    maximumStep: Math.PI, identifiableByShortestArc: false, boundaryAmbiguous: true,
  });
  // Both motions produce the same samples modulo 2pi: +pi/2 and -3pi/2.
  close(wrapAngle(Math.PI / 2), wrapAngle(-3 * Math.PI / 2));
});

test("twisted transport is opt-in and returns after two theta circuits", () => {
  assert.equal(twistedTransport(7, 1, false), 7);
  assert.equal(twistedTransport(7, 1, true), -7);
  assert.equal(twistedTransport(7, 2, true), 7);
  assert.equal(twistedTransport(7, -1, true), -7);
});

test("recursive perturbation propagation is a Jacobian action, not a velocity assertion", () => {
  assert.deepEqual(perturbationStep([[2, 1], [0, -1]], [3, 4]), [10, -4]);
});
