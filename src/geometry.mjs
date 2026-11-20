const TAU = Math.PI * 2;

export const degToRad = (degrees) => degrees * Math.PI / 180;
export const radToDeg = (radians) => radians * 180 / Math.PI;
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function length(v) {
  return Math.hypot(v[0], v[1], v[2]);
}

export function normalize(v) {
  const magnitude = length(v);
  if (!magnitude) throw new Error("Cannot normalize a zero vector");
  return v.map((component) => component / magnitude);
}

export function multiplyMatrix(a, b) {
  return a.map((row) => b[0].map((_, column) =>
    row.reduce((sum, value, index) => sum + value * b[index][column], 0)
  ));
}

export function transform(matrix, point) {
  return matrix.map((row) => row[0] * point[0] + row[1] * point[1] + row[2] * point[2]);
}

export function rotationX(radians) {
  const c = Math.cos(radians), s = Math.sin(radians);
  return [[1, 0, 0], [0, c, -s], [0, s, c]];
}

export function rotationY(radians) {
  const c = Math.cos(radians), s = Math.sin(radians);
  return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
}

export function rotationZ(radians) {
  const c = Math.cos(radians), s = Math.sin(radians);
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
}

export function orientationMatrix(orientationDeg) {
  const rx = rotationX(degToRad(orientationDeg.x));
  const ry = rotationY(degToRad(orientationDeg.y));
  const rz = rotationZ(degToRad(orientationDeg.z));
  return multiplyMatrix(rz, multiplyMatrix(ry, rx));
}

export function cameraMatrix(cameraYawDeg, cameraPitchDeg) {
  return multiplyMatrix(
    rotationX(degToRad(-cameraPitchDeg)),
    rotationY(degToRad(-cameraYawDeg))
  );
}

export function ringNormal(ring) {
  return normalize(transform(orientationMatrix(ring.orientationDeg), [0, 0, 1]));
}

export function planeAngleDeg(firstRing, secondRing) {
  const cosine = clamp(Math.abs(dot(ringNormal(firstRing), ringNormal(secondRing))), -1, 1);
  return radToDeg(Math.acos(cosine));
}

export function ringWorldPoint(ring, phaseRadians) {
  return transform(orientationMatrix(ring.orientationDeg), [Math.cos(phaseRadians), Math.sin(phaseRadians), 0]);
}

export function markerWorldPoint(ring) {
  return ringWorldPoint(ring, degToRad(ring.markerPhaseDeg));
}

export function projectWorldPoint(point, projection) {
  const cameraPoint = transform(cameraMatrix(projection.cameraYawDeg, projection.cameraPitchDeg), point);
  return { x: cameraPoint[0], y: cameraPoint[1], depth: cameraPoint[2], visible: cameraPoint[2] >= -projection.occlusionEpsilon };
}

export function sampleProjectedRing(ring, projection) {
  const samples = [];
  const count = projection.sampleCount;
  for (let index = 0; index <= count; index += 1) {
    const phase = index / count * TAU;
    const world = ringWorldPoint(ring, phase);
    samples.push({ phase, world, ...projectWorldPoint(world, projection) });
  }
  return samples;
}

export function visibleSegments(samples) {
  const segments = [];
  let current = [];
  for (const sample of samples) {
    if (sample.visible) {
      current.push(sample);
    } else if (current.length) {
      segments.push(current);
      current = [];
    }
  }
  if (current.length) segments.push(current);
  if (segments.length > 1 && samples[0].visible && samples.at(-1).visible) {
    segments[0] = [...segments.at(-1), ...segments[0]];
    segments.pop();
  }
  return segments;
}

export function reticleWorldPoint(azimuthDeg, elevationDeg) {
  const azimuth = degToRad(azimuthDeg);
  const elevation = degToRad(elevationDeg);
  return [
    Math.sin(azimuth) * Math.cos(elevation),
    Math.sin(elevation),
    Math.cos(azimuth) * Math.cos(elevation)
  ];
}

export function reticleFromFrontProjection(x, y) {
  const radiusSquared = x * x + y * y;
  if (radiusSquared > 1) return null;
  const z = Math.sqrt(Math.max(0, 1 - radiusSquared));
  return {
    azimuthDeg: radToDeg(Math.atan2(x, z)),
    elevationDeg: radToDeg(Math.asin(clamp(y, -1, 1)))
  };
}

export function assertState(state) {
  if (state.schemaVersion !== 1) throw new Error("Unsupported state schema");
  if (state.projection.type !== "orthographic-front-hemisphere") throw new Error("Unsupported projection");
  if (!Array.isArray(state.rings) || state.rings.length !== 4) throw new Error("Exactly four rings are required");
  if (state.rings.filter((ring) => ring.id === "R" && ring.locked).length !== 1) throw new Error("One locked R reference ring is required");
  return state;
}
