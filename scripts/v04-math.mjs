export const TAU = 2 * Math.PI;

export function wrapAngle(angle) {
  const wrapped = angle % TAU;
  return wrapped < 0 ? wrapped + TAU : wrapped;
}

export function shortestAngularDelta(next, previous) {
  return Math.atan2(Math.sin(next - previous), Math.cos(next - previous));
}

export function sampleIdentifiability(maxAbsRate, sampleInterval) {
  if (!(maxAbsRate >= 0) || !(sampleInterval > 0)) {
    throw new RangeError("Rate must be non-negative and sample interval must be positive");
  }
  const maximumStep = maxAbsRate * sampleInterval;
  return {
    maximumStep,
    identifiableByShortestArc: maximumStep < Math.PI,
    boundaryAmbiguous: maximumStep === Math.PI,
  };
}

export function dialPoint(angle, radius = 1, center = [0, 0]) {
  // Instrument convention: zero is twelve o'clock and positive phase is clockwise.
  return [center[0] + radius * Math.sin(angle), center[1] - radius * Math.cos(angle)];
}

export function recoverDialPhase(point, center = [0, 0]) {
  if (point[0] === center[0] && point[1] === center[1]) return null;
  return wrapAngle(Math.atan2(point[0] - center[0], -(point[1] - center[1])));
}

export function torusPoint(theta, phi, majorRadius, minorRadius) {
  if (!(majorRadius > minorRadius && minorRadius > 0)) {
    throw new RangeError("A regular ring torus requires majorRadius > minorRadius > 0");
  }
  const radial = majorRadius + minorRadius * Math.cos(phi);
  return [radial * Math.cos(theta), radial * Math.sin(theta), minorRadius * Math.sin(phi)];
}

export function torusMetric(phi, majorRadius, minorRadius) {
  if (!(majorRadius > minorRadius && minorRadius > 0)) {
    throw new RangeError("A regular ring torus requires majorRadius > minorRadius > 0");
  }
  const thetaScale = majorRadius + minorRadius * Math.cos(phi);
  return [[thetaScale * thetaScale, 0], [0, minorRadius * minorRadius]];
}

export function adapterMatrix(theta, phi) {
  const ct = Math.cos(theta), st = Math.sin(theta);
  const cp = Math.cos(phi), sp = Math.sin(phi);
  return [
    [ct, -st * cp, st * sp],
    [st, ct * cp, -ct * sp],
    [0, sp, cp],
  ];
}

export function adapterNormal(theta, phi) {
  const matrix = adapterMatrix(theta, phi);
  return [matrix[0][2], matrix[1][2], matrix[2][2]];
}

export function normalJacobian(theta, phi) {
  return [
    [Math.cos(theta) * Math.sin(phi), Math.sin(theta) * Math.cos(phi)],
    [Math.sin(theta) * Math.sin(phi), -Math.cos(theta) * Math.cos(phi)],
    [0, -Math.sin(phi)],
  ];
}

export function normalDifferentialRank(phi, tolerance = 1e-12) {
  return Math.abs(Math.sin(phi)) > tolerance ? 2 : 1;
}

export function flatCoordinateAcceleration(thetaSecond, phiSecond) {
  return [thetaSecond, phiSecond];
}

export function inducedMetricAcceleration({
  phi, thetaFirst, phiFirst, thetaSecond, phiSecond, majorRadius, minorRadius,
}) {
  if (!(majorRadius > minorRadius && minorRadius > 0)) {
    throw new RangeError("A regular ring torus requires majorRadius > minorRadius > 0");
  }
  const radial = majorRadius + minorRadius * Math.cos(phi);
  return [
    thetaSecond - (2 * minorRadius * Math.sin(phi) / radial) * thetaFirst * phiFirst,
    phiSecond + (radial * Math.sin(phi) / minorRadius) * thetaFirst * thetaFirst,
  ];
}

export function twistedTransport(value, thetaCircuits, enabled = true) {
  if (!Number.isInteger(thetaCircuits)) throw new TypeError("thetaCircuits must be an integer");
  return enabled && Math.abs(thetaCircuits) % 2 === 1 ? -value : value;
}

export function multiplyMatrixVector(matrix, vector) {
  return matrix.map((row) => row.reduce((sum, value, index) => sum + value * vector[index], 0));
}

export function perturbationStep(jacobian, perturbation) {
  return multiplyMatrixVector(jacobian, perturbation);
}
