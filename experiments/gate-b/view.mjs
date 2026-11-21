import { dialMarkers } from "./scene.mjs";

const inks = { void: "#090D12", panel: "#101720", line: "#E1E6EA", dim: "#A8B3BD", brass: "#CFAD73" };
const font = "DejaVu Sans,Segoe UI,Arial,sans-serif";
const cx = 250, cy = 188, radius = 150;
const dash = { R: "", Y: "10 4", B: "2 5", G: "14 4 3 4" };
const shape = { R: "solid", Y: "dashed", B: "dotted", G: "dash-dot" };

export const escapeText = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const point = ({ x, y }) => [cx + radius * x, cy - radius * y];
const n = (value) => value.toFixed(2);
const text = (x, y, value, size = 16, fill = inks.dim, anchor = "start") =>
  '<text x="' + x + '" y="' + y + '" fill="' + fill + '" font-family="' + font +
  '" font-size="' + size + '" text-anchor="' + anchor + '">' + escapeText(value) + "</text>";
const circle = (x, y, r, color, extra = "") =>
  '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + color + '" ' + extra + "/>";
const line = (x, y, px, py, color, extra = "") =>
  '<line x1="' + x + '" y1="' + y + '" x2="' + px + '" y2="' + py + '" stroke="' + color + '" ' + extra + "/>";

export function sampleLabel(scene) {
  return scene.dial ? scene.dial.channelId + " · " + scene.dial.sampleId + " · t = " + scene.dial.timeS + " s" : "No simulated sample selected";
}

export function signalLabel(register) {
  return register.signal
    ? register.reading + " · " + register.signal.id + " · " + register.signal.date + " · freshness " + register.signal.freshness
    : register.reading;
}

export function ringLabel(ring) {
  return ring.id + " · " + ring.label + " (" + shape[ring.id] + ")" + (ring.driven ? " · simulated attitude" : "");
}

export function reticleLabel(reticle) {
  return reticle.label + " · " + reticle.frame + " frame · " + (reticle.point.visible ? "visible" : "occluded");
}

function panel(id, title, description, body) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="376" viewBox="0 0 500 376" ' +
    'role="img" aria-labelledby="' + id + '-title ' + id + '-desc" data-panel="' + id + '">' +
    '<title id="' + id + '-title">' + escapeText(title) + '</title><desc id="' + id + '-desc">' + escapeText(description) +
    '</desc><rect width="500" height="376" rx="12" fill="' + inks.void + '"/>' + body + "</svg>";
}

export function renderDial(scene) {
  const positions = dialMarkers(scene, [cx, cy]);
  const color = scene.rings.find((ring) => ring.driven)?.color ?? inks.line;
  const ticks = Array.from({ length: 24 }, (_, index) => {
    const angle = 2 * Math.PI * index / 24;
    const inner = index % 6 === 0 ? 151 : 156;
    return line(n(cx + 163 * Math.sin(angle)), n(cy - 163 * Math.cos(angle)),
      n(cx + inner * Math.sin(angle)), n(cy - inner * Math.cos(angle)),
      index === 0 ? inks.brass : "#667782", index === 0 ? 'stroke-width="4"' : 'stroke-width="2"');
  }).join("");
  const tracks = circle(cx, cy, 142, "none", 'stroke="#53636D" stroke-width="2"') +
    circle(cx, cy, 101, "none", 'stroke="#53636D" stroke-width="2" stroke-dasharray="5 5"');
  let pointers = text(cx, cy + 6, "No simulated sample", 16, inks.line, "middle");
  if (positions) {
    const [tx, ty] = positions.theta.map(n);
    const [px, py] = positions.phi.map(n);
    pointers = line(cx, cy, tx, ty, color, 'stroke-width="4"') +
      line(cx, cy, px, py, color, 'stroke-width="4" stroke-dasharray="7 5"') +
      circle(tx, ty, 7, color, 'stroke="#090D12" stroke-width="2"') +
      '<rect x="' + (Number(px) - 6) + '" y="' + (Number(py) - 6) + '" width="12" height="12" fill="' + color + '"/>' +
      circle(cx, cy, 5, inks.brass);
  }
  return panel("dial", "MG-001 two-track dial", sampleLabel(scene) +
    ". The outer circular marker is theta and the inner square is phi. Angles increase clockwise from the top.",
    circle(cx, cy, 163, inks.panel, 'stroke="#5A5041" stroke-width="1.5"') +
    ticks + tracks + pointers + text(cx, 17, "0", 13, inks.brass, "middle") +
    text(cx, 368, "Outer circle · θ     /     Inner square · φ", 15, inks.dim, "middle"));
}

export function renderSpatial(scene) {
  const arcs = scene.rings.map((ring) => {
    const paths = ring.segments.filter((part) => part.length > 1).map((part) => {
      const points = part.map((sample) => point(sample).map(n).join(",")).join(" ");
      return '<polyline points="' + points + '" fill="none" stroke="' + ring.color + '" stroke-width="' +
        (ring.driven || ring.id === "R" ? "3.6" : "2.5") + '" stroke-linecap="round"' +
        (dash[ring.id] ? ' stroke-dasharray="' + dash[ring.id] + '"' : "") + "/>";
    }).join("");
    const location = ring.marker.point;
    const marker = location.visible ? circle(...point(location).map(n), 5, inks.line, 'stroke="#090D12" stroke-width="1.8"') : "";
    return '<g data-ring="' + ring.id + '"><title>' + escapeText(ringLabel(ring)) + "</title>" + paths + marker + "</g>";
  }).join("");
  const corePoints = Array.from({ length: 16 }, (_, index) => {
    const angle = Math.PI * index / 8, r = index % 2 ? 3.6 : 9;
    return n(cx + r * Math.sin(angle)) + "," + n(cy - r * Math.cos(angle));
  }).join(" ");
  const core = '<polygon points="' + corePoints + '" fill="' + inks.void + '" stroke="' +
    inks.brass + '" stroke-width="1.4"/>';
  let aim = "";
  if (scene.reticle.point.visible) {
    const [x, y] = point(scene.reticle.point).map((value) => Number(n(value)));
    aim = '<g data-reticle="' + scene.reticle.id + '">' +
      circle(x, y, 13, "none", 'stroke="#F2F4F5" stroke-width="1.8"') +
      line(x - 19, y, x - 11, y, inks.line) + line(x + 11, y, x + 19, y, inks.line) +
      line(x, y - 19, x, y - 11, inks.line) + line(x, y + 11, x, y + 19, inks.line) + "</g>";
  }
  return panel("spatial", "GMG-A spatial assembly", sampleLabel(scene) +
    ". Front-hemisphere orthographic projection with four labeled ring patterns. " + reticleLabel(scene.reticle) + ".",
    circle(cx, cy, radius, inks.panel, 'stroke="#53636D" stroke-width="1.7"') + arcs + core + aim +
    text(cx, 368, "Front hemisphere · orthographic", 15, inks.dim, "middle"));
}

export function snapshotMetadata(scene) {
  return {
    labId: scene.labId, schemaVersion: scene.schemaVersion, poseId: scene.poseId,
    modelId: scene.modelId, adapterId: scene.adapterId, assessmentRevision: scene.assessmentRevision,
    sampleId: scene.dial?.sampleId ?? null, phaseRad: scene.dial?.phaseRad ?? null,
    observer: scene.observer, targetId: scene.reticle.id,
  };
}

export function renderSnapshot(scene) {
  const status = scene.status.map((record, index) => {
    const y = 526 + index * 30;
    return text(34, y, record.label, 15, inks.dim) + text(252, y, signalLabel(record), 15, inks.line);
  }).join("");
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="1060" height="668" viewBox="0 0 1060 668" role="img" aria-labelledby="title desc">\n' +
    '<title id="title">MG-001 / GMG-A · Gate B snapshot</title>' +
    '<desc id="desc">Simulation of synchronized dial and spatial views, with a separate qualitative assessment pane.</desc>' +
    "<metadata>" + escapeText(JSON.stringify(snapshotMetadata(scene))) + "</metadata>" +
    '<rect width="1060" height="668" fill="' + inks.void + '"/>' +
    text(34, 41, "MG-001 / GMG-A · Gate B simulation", 25, inks.line) +
    text(34, 72, sampleLabel(scene) + "   /   " + scene.adapterId, 16, inks.brass) +
    '<g transform="translate(20 90)">' + renderDial(scene) + "</g>" +
    '<g transform="translate(540 90)">' + renderSpatial(scene) + "</g>" +
    text(34, 493, "MG-001 assessment snapshot · qualitative", 17, inks.line) + status +
    text(34, 653, "Yaw " + scene.observer.yawDeg + "° · Pitch " + scene.observer.pitchDeg + "°   /   " +
      reticleLabel(scene.reticle), 14, inks.dim) + "</svg>\n";
}
