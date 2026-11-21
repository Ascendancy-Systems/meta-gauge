import {
  assertState, clamp, degToRad, dot, orientationMatrix, projectWorldPoint,
  radToDeg, transform, visibleSegments,
} from "../../src/geometry.mjs";
import { selectDraftViews } from "../../scripts/v04-state-contract.mjs";
import { dialPoint, TAU } from "../../scripts/v04-math.mjs";

export const LAB_ID = "MG-001-GMG-A-GATE-B-0.1";
export const sources = {
  fixture: new URL("../../tests/fixtures/v04-dual-view.json", import.meta.url),
  pose: new URL("../../config/gmg-a-reference-pose-v0.2.json", import.meta.url),
};

const registryLabels = {
  "constitutional-north": "Constitutional North",
  "epistemic-fix": "Epistemic Fix",
  "continuity-drift": "Continuity & Drift",
  "dependency-readiness": "Dependency Readiness",
};

export function initialControls(fixture) {
  return {
    selectedSampleId: fixture.viewer.selectedSampleId,
    observer: { ...fixture.viewer.observer },
    targetId: "observer-center",
  };
}

function ringPoint(matrix, phase) {
  return transform(matrix, [Math.cos(phase), Math.sin(phase), 0]);
}

function makeReticle(id, rings, projection) {
  if (id === "observer-center") {
    return { id, frame: "observer", label: "Observer center", point: { x: 0, y: 0, visible: true } };
  }
  if (id === "world-north") {
    const world = [0, 0, 1];
    return { id, frame: "world", label: "World +z", world, point: projectWorldPoint(world, projection) };
  }
  const ring = rings.find((item) => id === item.marker.id);
  if (!ring) throw new RangeError("Unknown reticle target");
  return {
    id, frame: "ring-local", label: ring.id + " ring marker",
    phaseDeg: ring.marker.phaseDeg, world: ring.marker.world, point: ring.marker.point,
  };
}

export function buildScene(fixture, pose, controls = initialControls(fixture)) {
  assertState(pose);
  const views = selectDraftViews({
    ...fixture,
    viewer: { selectedSampleId: controls.selectedSampleId, observer: controls.observer },
  });
  const projection = {
    ...pose.projection,
    cameraYawDeg: views.observer.yawDeg,
    cameraPitchDeg: views.observer.pitchDeg,
  };
  const red = pose.rings.find((ring) => ring.id === "R");
  const redNormal = transform(orientationMatrix(red.orientationDeg), [0, 0, 1]);
  const rings = pose.rings.map((ring) => {
    const driven = !ring.locked && views.spatial?.channelId === ring.id;
    const matrix = driven ? views.spatial.attitude : orientationMatrix(ring.orientationDeg);
    const normal = transform(matrix, [0, 0, 1]);
    const samples = Array.from({ length: projection.sampleCount + 1 }, (_, index) => {
      const phase = index * TAU / projection.sampleCount;
      return projectWorldPoint(ringPoint(matrix, phase), projection);
    });
    const markerWorld = ringPoint(matrix, degToRad(ring.markerPhaseDeg));
    return {
      id: ring.id, label: ring.label, color: ring.color, driven,
      attitude: matrix, normal,
      angleToReferenceDeg: radToDeg(Math.acos(clamp(Math.abs(dot(normal, redNormal)), 0, 1))),
      segments: visibleSegments(samples),
      marker: {
        id: "marker-" + ring.id,
        phaseDeg: ring.markerPhaseDeg,
        world: markerWorld,
        point: projectWorldPoint(markerWorld, projection),
      },
    };
  });
  const status = views.status.registers.map((register) => ({
    id: register.id,
    label: registryLabels[register.id],
    reading: register.kind === "qualitative" ? "Provisionally supported" :
      register.reason === "unassessed" ? "Unassessed" : "Unavailable (" + register.reason + ")",
    signal: register.kind === "qualitative" ? {
      id: register.signalId, date: register.assessedAt, freshness: register.freshness,
    } : null,
  }));
  return {
    labId: LAB_ID, schemaVersion: fixture.schemaVersion, poseId: pose.id,
    modelId: fixture.simulation.modelId, adapterId: fixture.simulation.adapterId,
    assessmentRevision: views.status.revision,
    dial: views.dial,
    spatialSampleId: views.spatial?.sampleId ?? null,
    observer: views.observer, rings, reticle: makeReticle(controls.targetId, rings, projection), status,
  };
}

export function dialMarkers(scene, center) {
  const phase = scene.dial?.phaseRad;
  return phase ? {
    theta: dialPoint(phase.theta, 142, center),
    phi: dialPoint(phase.phi, 101, center),
  } : null;
}
