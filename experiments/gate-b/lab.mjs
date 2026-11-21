import { buildScene, initialControls, sources } from "./scene.mjs";
import { renderDial, renderSpatial, reticleLabel, ringLabel, sampleLabel, signalLabel } from "./view.mjs";

const byId = (id) => document.getElementById(id);
const radians = (value) => value == null ? "Unavailable" : value.toFixed(2) + " rad";
const degrees = (value) => value.toFixed(1) + "°";

async function readJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("A required fixture is unavailable");
  return response.json();
}

function paintStatus(scene) {
  byId("status-registers").replaceChildren(...scene.status.map((register) => {
    const item = document.createElement("div");
    const label = document.createElement("dt");
    const reading = document.createElement("dd");
    label.textContent = register.label;
    reading.textContent = signalLabel(register);
    if (register.signal) reading.classList.add("qualified");
    item.append(label, reading);
    return item;
  }));
}

async function main() {
  const [fixture, pose] = await Promise.all([readJson(sources.fixture), readJson(sources.pose)]);
  let controls = initialControls(fixture);
  const defaults = initialControls(fixture);
  const sample = byId("sample"), yaw = byId("yaw"), pitch = byId("pitch"), target = byId("target");
  sample.add(new Option("No sample · reference pose", ""));
  for (const item of fixture.simulation.samples) {
    sample.add(new Option(item.channelId + " · " + item.id + " · " + item.timeS + " s", item.id));
  }
  target.add(new Option("Observer center", "observer-center"));
  target.add(new Option("World +z (fixed anchor)", "world-north"));
  for (const ring of pose.rings) target.add(new Option(ring.id + " marker (ring-locked)", "marker-" + ring.id));
  sample.value = controls.selectedSampleId ?? "";
  target.value = controls.targetId;
  yaw.valueAsNumber = controls.observer.yawDeg;
  pitch.valueAsNumber = controls.observer.pitchDeg;

  let renderedSample;
  function paint() {
    const scene = buildScene(fixture, pose, controls);
    const sampleId = scene.dial?.sampleId ?? null;
    if (renderedSample !== sampleId) {
      byId("dial").innerHTML = renderDial(scene);
      byId("sample-readout").value = sampleLabel(scene);
      byId("theta").textContent = radians(scene.dial?.phaseRad.theta);
      byId("phi").textContent = radians(scene.dial?.phaseRad.phi);
      byId("spatial-readout").textContent = scene.spatialSampleId ?
        sampleLabel(scene) + " · full trial attitude" : "Preserved v0.2 reference poses";
      byId("rings").replaceChildren(...scene.rings.map((ring) => {
        const row = document.createElement("tr");
        row.dataset.ring = ring.id;
        for (const value of [ringLabel(ring), degrees(ring.angleToReferenceDeg), degrees(ring.marker.phaseDeg)]) {
          row.insertCell().textContent = value;
        }
        return row;
      }));
      renderedSample = sampleId;
    }
    byId("spatial").innerHTML = renderSpatial(scene);
    byId("reticle-readout").textContent = reticleLabel(scene.reticle);
    byId("yaw-value").value = scene.observer.yawDeg + "°";
    byId("pitch-value").value = scene.observer.pitchDeg + "°";
    return scene;
  }

  sample.addEventListener("change", () => {
    controls = { ...controls, selectedSampleId: sample.value || null };
    paint();
  });
  const moveCamera = () => {
    controls = { ...controls, observer: { yawDeg: yaw.valueAsNumber, pitchDeg: pitch.valueAsNumber } };
    paint();
  };
  yaw.addEventListener("input", moveCamera);
  pitch.addEventListener("input", moveCamera);
  target.addEventListener("change", () => {
    controls = { ...controls, targetId: target.value };
    paint();
  });
  byId("reset-camera").addEventListener("click", () => {
    yaw.valueAsNumber = defaults.observer.yawDeg;
    pitch.valueAsNumber = defaults.observer.pitchDeg;
    moveCamera();
  });
  const scene = paint();
  paintStatus(scene);
  byId("provenance").textContent =
    scene.labId + " · " + scene.schemaVersion + " · " + scene.adapterId + " · base pose " +
    scene.poseId + " · assessment " + scene.assessmentRevision.slice(0, 12);
  byId("load-state").hidden = true;
  byId("lab-content").hidden = false;
}

main().catch(() => {
  byId("load-state").textContent = "The simulation could not load its fixtures. Use the reference snapshot or serve the repository root over HTTP.";
});
