import fs from "node:fs/promises";
import { assertState, markerWorldPoint, projectObserverReticle, projectWorldPoint, sampleProjectedRing, visibleSegments } from "../src/geometry.mjs";

const state = assertState(JSON.parse(await fs.readFile(new URL("../config/gmg-a-reference-pose-v0.2.json", import.meta.url), "utf8")));
const width = 960, height = 960, radius = 360, cx = width / 2, cy = height / 2;
const point = (p) => `${(cx + p.x * radius).toFixed(2)},${(cy - p.y * radius).toFixed(2)}`;
const paths = [];
for (const ring of state.rings) {
  for (const segment of visibleSegments(sampleProjectedRing(ring, state.projection))) {
    if (segment.length < 2) continue;
    paths.push(`<path d="M ${segment.map(point).join(" L ")}" fill="none" stroke="${ring.color}" stroke-width="${ring.id === "R" ? 7 : 6}" stroke-linecap="round"/>`);
  }
  const marker = projectWorldPoint(markerWorldPoint(ring), state.projection);
  if (marker.visible) paths.push(`<circle cx="${(cx + marker.x * radius).toFixed(2)}" cy="${(cy - marker.y * radius).toFixed(2)}" r="6" fill="#EEF2F4" stroke="#081017" stroke-width="2"/>`);
}
const reticle = projectObserverReticle(state.reticle.azimuthDeg, state.reticle.elevationDeg);
const rx = cx + reticle.x * radius, ry = cy - reticle.y * radius;
const metadata = JSON.stringify({stateId:state.id,projection:state.projection,rings:state.rings,reticle:state.reticle}).replaceAll("&","&amp;").replaceAll("<","&lt;");
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">GMG-A experimental reference pose</title><desc id="desc">Four independently oriented ring planes projected onto a sphere with far-side arcs hidden. This is geometric simulation, not live telemetry.</desc>
<metadata>${metadata}</metadata>
<defs><radialGradient id="sphere" cx="35%" cy="28%" r="72%"><stop offset="0" stop-color="#263946"/><stop offset=".58" stop-color="#111A22"/><stop offset="1" stop-color="#060A0E"/></radialGradient><filter id="shadow"><feDropShadow dx="0" dy="10" stdDeviation="24" flood-color="#000" flood-opacity=".75"/></filter></defs>
<rect width="960" height="960" fill="#080C11"/><text x="48" y="58" fill="#C6A96B" font-family="Segoe UI,Arial,DejaVu Sans,sans-serif" font-size="18" letter-spacing="3">ASCENDANCY SYSTEMS · MG-001 / GMG-A</text><text x="48" y="91" fill="#D6DCE3" font-family="Georgia,DejaVu Serif,serif" font-size="27">Experimental spatial reference pose</text><text x="912" y="58" text-anchor="end" fill="#94A0AA" font-family="Segoe UI,Arial,DejaVu Sans,sans-serif" font-size="15">${state.id}</text>
<circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#sphere)" stroke="#52616B" stroke-width="2" filter="url(#shadow)"/>
<g clip-path="url(#clip)">${paths.join("")}</g>
<defs><clipPath id="clip"><circle cx="${cx}" cy="${cy}" r="${radius}"/></clipPath></defs>
<path d="M ${cx} ${cy-11} L ${cx+4} ${cy-4} L ${cx+11} ${cy} L ${cx+4} ${cy+4} L ${cx} ${cy+11} L ${cx-4} ${cy+4} L ${cx-11} ${cy} L ${cx-4} ${cy-4} Z" fill="none" stroke="#C6A96B" stroke-width="2"/>
<g stroke="#EEF2F4" stroke-width="1.7" fill="none"><circle cx="${rx.toFixed(2)}" cy="${ry.toFixed(2)}" r="11"/><path d="M ${(rx-18).toFixed(2)} ${ry.toFixed(2)} H ${(rx+18).toFixed(2)} M ${rx.toFixed(2)} ${(ry-18).toFixed(2)} V ${(ry+18).toFixed(2)}"/></g>
<rect x="48" y="870" width="864" height="44" fill="#111821" stroke="#33404B"/><text x="68" y="898" fill="#D6DCE3" font-family="Segoe UI,Arial,DejaVu Sans,sans-serif" font-size="15">GEOMETRIC SIMULATION · EXPLICIT VERSIONED POSE · NO LIVE TELEMETRY · NO EF-001 ANGLE MAPPING</text>
</svg>`;
await fs.mkdir(new URL("../assets/", import.meta.url), {recursive:true});
await fs.writeFile(new URL("../assets/gmg-a-reference-pose-v0.2.svg", import.meta.url), svg);
console.log(`Rendered assets/gmg-a-reference-pose-v0.2.svg from ${state.id}`);
