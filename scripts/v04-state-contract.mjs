import { adapterMatrix, TAU } from "./v04-math.mjs";

const channelIds = ["Y", "B", "G"];
const registerIds = ["constitutional-north", "epistemic-fix", "continuity-drift", "dependency-readiness"];
const phaseKeys = ["theta", "phi"];
const ef001Readings = {
  signalId: "EF-001",
  state: "provisionally-supported",
  scope: "public-research-orientation",
  method: "manual-source-comparison",
  evidenceVisibility: "private",
  authorityVerified: false,
  displayAuthority: "display-only",
  assessedAt: "2026-11-20",
};

function requireKeys(value, keys, context) {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      Object.keys(value).length !== keys.length || !keys.every((key) => Object.hasOwn(value, key))) {
    throw new TypeError("Unexpected or missing fields in " + context);
  }
}

// Draft fixture contract only. This does not authenticate an assessment.
export function validateDraftState(state) {
  requireKeys(state, ["schemaVersion", "simulation", "assessmentSnapshot", "viewer"], "envelope");
  if (state.schemaVersion !== "mg001-gmga-draft-0.4.1") throw new RangeError("Unknown envelope version");
  const { simulation, assessmentSnapshot, viewer } = state;
  requireKeys(simulation, ["modelId", "adapterId", "twist", "samples"], "simulation");
  if (simulation.modelId !== "torus-T2" || simulation.adapterId !== "trial-rz-rx-v0.4" ||
      simulation.twist !== "off" || !Array.isArray(simulation.samples)) {
    throw new RangeError("Unknown simulation model");
  }
  const sampleIds = new Set();
  const latestTimes = new Map();
  for (const sample of simulation.samples) {
    requireKeys(sample, ["id", "channelId", "timeS", "phaseRad"], "sample");
    const { id, channelId, timeS, phaseRad } = sample;
    requireKeys(phaseRad, phaseKeys, "phase pair");
    if (typeof id !== "string" || !id || sampleIds.has(id) || !channelIds.includes(channelId) ||
        !Number.isFinite(timeS) || timeS <= (latestTimes.get(channelId) ?? -Infinity) ||
        !phaseKeys.every((key) => Number.isFinite(phaseRad[key]) && phaseRad[key] >= 0 && phaseRad[key] < TAU)) {
      throw new RangeError("Invalid sample ID, channel, time, or phase");
    }
    sampleIds.add(id);
    latestTimes.set(channelId, timeS);
  }
  requireKeys(assessmentSnapshot, ["revision", "registers"], "assessment snapshot");
  const { revision, registers } = assessmentSnapshot;
  if (revision !== "c7401e3c7b5f0033a86566a74d8e3308d146fee6" ||
      !Array.isArray(registers) || registers.length !== registerIds.length ||
      !registerIds.every((id) => registers.some((register) => register?.id === id))) {
    throw new RangeError("Unexpected assessment revision or registers");
  }
  for (const register of registers) {
    if (register.kind === "qualitative") {
      requireKeys(register, ["id", "kind", ...Object.keys(ef001Readings), "freshness"], "qualitative register");
      if (register.id !== "epistemic-fix" ||
          !Object.entries(ef001Readings).every(([key, value]) => register[key] === value) ||
          !["unverified", "stale"].includes(register.freshness)) {
        throw new RangeError("Unexpected EF-001 snapshot value");
      }
    } else {
      requireKeys(register, ["id", "kind", "reason"], "unavailable register");
      if (register.kind !== "unavailable" ||
          !["unassessed", "missing", "stale", "invalid"].includes(register.reason)) {
        throw new RangeError("Unknown unavailable register reason");
      }
    }
  }
  requireKeys(viewer, ["selectedSampleId", "observer"], "viewer");
  requireKeys(viewer.observer, ["yawDeg", "pitchDeg"], "observer");
  if ((viewer.selectedSampleId !== null && !sampleIds.has(viewer.selectedSampleId)) ||
      !Object.values(viewer.observer).every(Number.isFinite)) {
    throw new RangeError("Invalid viewer selection or camera");
  }
}

// Evidence is copied to status only. Viewer angles are handed to projection separately.
export function selectDraftViews(state) {
  validateDraftState(state);
  const sample = state.simulation.samples.find(({ id }) => id === state.viewer.selectedSampleId);
  const selection = sample ? { sampleId: sample.id, channelId: sample.channelId, timeS: sample.timeS } : null;
  return {
    dial: sample ? { ...selection, mode: "simulation", phaseRad: { ...sample.phaseRad } } : null,
    spatial: sample ? {
      ...selection,
      mode: "simulation",
      adapterId: state.simulation.adapterId,
      attitude: adapterMatrix(sample.phaseRad.theta, sample.phaseRad.phi),
    } : null,
    status: structuredClone(state.assessmentSnapshot),
    observer: { ...state.viewer.observer },
  };
}
