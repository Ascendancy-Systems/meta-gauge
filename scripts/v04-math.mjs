export const TAU = 2 * Math.PI;

export function wrapAngle(angle) {
  if (!Number.isFinite(angle)) throw new TypeError("Phase must be a finite number");
  const wrapped = angle % TAU;
  const normalized = wrapped < 0 ? wrapped + TAU : wrapped;
  return normalized === TAU || normalized === 0 ? 0 : normalized;
}

export function shortestAngularDelta(next, previous) {
  const delta = wrapAngle(next) - wrapAngle(previous);
  return Math.atan2(Math.sin(delta), Math.cos(delta));
}

export function sampleIdentifiability(maxAbsRate, sampleInterval) {
  if (!Number.isFinite(maxAbsRate) || maxAbsRate < 0 ||
      !Number.isFinite(sampleInterval) || sampleInterval <= 0) {
    throw new RangeError("Rate bound and positive interval must be finite numbers");
  }
  const maximumStep = maxAbsRate * sampleInterval;
  return {
    maximumStep,
    identifiableByShortestArc: maximumStep < Math.PI,
    boundaryAmbiguous: maximumStep === Math.PI,
  };
}

// Exact endpoints only. No rate is reported without a justified bound and cadence.
export function estimatePhaseInterval(previous, next, maxAbsRate, maxGap) {
  const unavailable = (reason) => ({ rateRadPerS: null, reason });
  if (![previous?.phaseRad, previous?.timeS, next?.phaseRad, next?.timeS,
        maxAbsRate, maxGap].every(Number.isFinite) || maxAbsRate < 0 || maxGap <= 0) {
    return unavailable("missing-or-invalid-input");
  }
  const interval = next.timeS - previous.timeS;
  if (!Number.isFinite(interval) || interval <= 0) return unavailable("invalid-timestamps");
  if (interval > maxGap) return unavailable("gap");
  const { maximumStep, identifiableByShortestArc } = sampleIdentifiability(maxAbsRate, interval);
  if (!identifiableByShortestArc) return unavailable("ambiguous-wrap");
  const delta = shortestAngularDelta(next.phaseRad, previous.phaseRad);
  // Allow a small roundoff margin at a known rate limit, not at the half-turn gate.
  const tolerance = maximumStep === 0 ? 0 : 8 * Number.EPSILON * Math.PI;
  if (Math.abs(delta) > maximumStep + tolerance) return unavailable("inconsistent-bound");
  const rate = delta / interval;
  if (!Number.isFinite(rate)) return unavailable("unrepresentable-rate");
  return { rateRadPerS: rate === 0 ? 0 : rate, reason: null };
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
