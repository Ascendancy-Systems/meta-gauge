import { assertState, markerWorldPoint, planeAngleDeg, projectWorldPoint, reticleFromFrontProjection, reticleWorldPoint, sampleProjectedRing, visibleSegments } from "./geometry.mjs";

const response = await fetch("./config/gmg-a-reference-pose-v0.2.json");
if (!response.ok) throw new Error(`Could not load instrument state: ${response.status}`);
const originalState = assertState(await response.json());
let state = structuredClone(originalState);

const canvas = document.querySelector("#gauge");
const context = canvas.getContext("2d");
const controls = Object.fromEntries([...document.querySelectorAll("input, select, button, output, dd")].map((element) => [element.id, element]));
let dragging = null;

const selectedRing = () => state.rings.find((ring) => ring.id === controls.ring.value);
const screen = (point) => ({ x: canvas.width / 2 + point.x * canvas.width * .39, y: canvas.height / 2 - point.y * canvas.height * .39 });

function drawStar(cx, cy, outer, inner) {
  context.beginPath();
  for (let index = 0; index < 16; index += 1) {
    const radius = index % 2 ? inner : outer;
    const angle = -Math.PI / 2 + index * Math.PI / 8;
    const x = cx + Math.cos(angle) * radius, y = cy + Math.sin(angle) * radius;
    if (!index) context.moveTo(x, y); else context.lineTo(x, y);
  }
  context.closePath(); context.stroke();
}

function render() {
  const size = canvas.width;
  context.clearRect(0, 0, size, size);
  const cx = size / 2, cy = size / 2, radius = size * .39;
  const gradient = context.createRadialGradient(cx - radius * .35, cy - radius * .4, radius * .05, cx, cy, radius);
  gradient.addColorStop(0, "#243440"); gradient.addColorStop(.55, "#101820"); gradient.addColorStop(1, "#070b0f");
  context.fillStyle = gradient; context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2); context.fill();
  context.strokeStyle = "#52616b"; context.lineWidth = 1.5; context.stroke();
  context.save(); context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2); context.clip();
  for (const ring of state.rings) {
    context.strokeStyle = ring.color; context.lineWidth = ring.id === "R" ? 6 : 5; context.lineCap = "round";
    for (const segment of visibleSegments(sampleProjectedRing(ring, state.projection))) {
      if (segment.length < 2) continue;
      context.beginPath();
      segment.forEach((point, index) => { const p = screen(point); if (!index) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y); });
      context.stroke();
    }
    const marker = projectWorldPoint(markerWorldPoint(ring), state.projection);
    if (marker.visible) {
      const p = screen(marker); context.fillStyle = "#eef2f4"; context.strokeStyle = "#081017"; context.lineWidth = 2;
      context.beginPath(); context.arc(p.x, p.y, ring.id === controls.ring.value ? 7 : 5, 0, Math.PI * 2); context.fill(); context.stroke();
    }
  }
  context.restore();
  context.strokeStyle = "#c6a96b"; context.lineWidth = 2; drawStar(cx, cy, 10, 4);
  const reticle = projectWorldPoint(reticleWorldPoint(state.reticle.azimuthDeg, state.reticle.elevationDeg), state.projection);
  const rp = screen(reticle); context.strokeStyle = "#f1f5f7"; context.lineWidth = 1.5;
  context.beginPath(); context.arc(rp.x, rp.y, 10, 0, Math.PI * 2); context.moveTo(rp.x - 17, rp.y); context.lineTo(rp.x + 17, rp.y); context.moveTo(rp.x, rp.y - 17); context.lineTo(rp.x, rp.y + 17); context.stroke();
  updateReadouts();
}

function formatDegrees(value) { return `${Math.round(value)}°`; }
function updateReadouts() {
  controls["yaw-value"].value = formatDegrees(state.projection.cameraYawDeg);
  controls["pitch-value"].value = formatDegrees(state.projection.cameraPitchDeg);
  const ring = selectedRing();
  controls["ring-x-value"].value = formatDegrees(ring.orientationDeg.x);
  controls["ring-y-value"].value = formatDegrees(ring.orientationDeg.y);
  controls["ring-phase-value"].value = formatDegrees(ring.markerPhaseDeg);
  controls["reticle-az-value"].value = formatDegrees(state.reticle.azimuthDeg);
  controls["reticle-el-value"].value = formatDegrees(state.reticle.elevationDeg);
  controls["angle-readout"].textContent = `${planeAngleDeg(state.rings[0], ring).toFixed(1)}°`;
  controls["reticle-readout"].textContent = `az ${formatDegrees(state.reticle.azimuthDeg)} · el ${formatDegrees(state.reticle.elevationDeg)}`;
  controls["state-readout"].textContent = state.id;
}

function syncControls() {
  controls.yaw.value = state.projection.cameraYawDeg; controls.pitch.value = state.projection.cameraPitchDeg;
  controls["reticle-az"].value = state.reticle.azimuthDeg; controls["reticle-el"].value = state.reticle.elevationDeg;
  const ring = selectedRing(); controls["ring-x"].value = ring.orientationDeg.x; controls["ring-y"].value = ring.orientationDeg.y; controls["ring-phase"].value = ring.markerPhaseDeg;
}

for (const id of ["yaw", "pitch", "ring-x", "ring-y", "ring-phase", "reticle-az", "reticle-el"]) {
  controls[id].addEventListener("input", () => {
    const value = Number(controls[id].value); const ring = selectedRing();
    if (id === "yaw") state.projection.cameraYawDeg = value;
    if (id === "pitch") state.projection.cameraPitchDeg = value;
    if (id === "ring-x") ring.orientationDeg.x = value;
    if (id === "ring-y") ring.orientationDeg.y = value;
    if (id === "ring-phase") ring.markerPhaseDeg = value;
    if (id === "reticle-az") state.reticle.azimuthDeg = value;
    if (id === "reticle-el") state.reticle.elevationDeg = value;
    render();
  });
}

controls.ring.addEventListener("change", () => { syncControls(); render(); });
controls["reset-view"].addEventListener("click", () => { state.projection.cameraYawDeg = originalState.projection.cameraYawDeg; state.projection.cameraPitchDeg = originalState.projection.cameraPitchDeg; syncControls(); render(); });
controls["reset-pose"].addEventListener("click", () => { state.rings = structuredClone(originalState.rings); syncControls(); render(); });
controls["center-reticle"].addEventListener("click", () => { state.reticle.azimuthDeg = 0; state.reticle.elevationDeg = 0; syncControls(); render(); });

canvas.addEventListener("pointerdown", (event) => { dragging = { x:event.clientX, y:event.clientY, yaw:state.projection.cameraYawDeg, pitch:state.projection.cameraPitchDeg }; canvas.setPointerCapture(event.pointerId); });
canvas.addEventListener("pointermove", (event) => { if (!dragging) return; state.projection.cameraYawDeg = dragging.yaw + (event.clientX - dragging.x) * .35; state.projection.cameraPitchDeg = Math.max(-80, Math.min(80, dragging.pitch - (event.clientY - dragging.y) * .35)); syncControls(); render(); });
canvas.addEventListener("pointerup", (event) => {
  if (!dragging) return;
  const moved = Math.hypot(event.clientX - dragging.x, event.clientY - dragging.y);
  dragging = null; canvas.releasePointerCapture(event.pointerId);
  if (moved < 6) {
    const bounds = canvas.getBoundingClientRect(); const scale = canvas.width / bounds.width; const radius = canvas.width * .39;
    const x = ((event.clientX - bounds.left) * scale - canvas.width / 2) / radius;
    const y = (canvas.height / 2 - (event.clientY - bounds.top) * scale) / radius;
    const aimed = reticleFromFrontProjection(x, y);
    if (aimed) { state.reticle.azimuthDeg = aimed.azimuthDeg; state.reticle.elevationDeg = aimed.elevationDeg; syncControls(); render(); }
  }
});
canvas.addEventListener("pointercancel", () => { dragging = null; });

syncControls(); render();
