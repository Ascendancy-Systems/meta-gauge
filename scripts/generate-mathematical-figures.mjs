import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { adapterMatrix, adapterNormal, dialPoint, torusPoint } from "./v04-math.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "assets", "figures", "v0.4");
const palette = {
  void: "#080C11", panel: "#111821", line: "#D6DCE3", muted: "#94A0AA",
  copper: "#B77958", brass: "#C6A96B", red: "#C98C82", yellow: "#D7BD72",
  blue: "#6F9FCB", green: "#6A9A8D",
};

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const points = (values) => values.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
const line = (x1, y1, x2, y2, stroke = palette.line, width = 2, dash = "") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const text = (x, y, value, size = 17, fill = palette.line, anchor = "start", weight = 400) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="DejaVu Sans,Segoe UI,Arial,sans-serif" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}">${esc(value)}</text>`;
const shell = (id, title, description, body, height = 720) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title><desc id="desc">${esc(description)}</desc>
<metadata>{"figure":"${id}","revision":"0.4","status":"mathematical illustration; no empirical telemetry","generator":"scripts/generate-mathematical-figures.mjs"}</metadata>
<rect width="1200" height="${height}" fill="${palette.void}"/>
${text(56, 54, id, 15, palette.brass, "start", 700)}${text(56, 91, title, 29, palette.line, "start", 600)}
${body}
${text(56, height - 30, "PROPOSED MATHEMATICAL MODEL · REPRODUCIBLE FIGURE · NOT EMPIRICAL TELEMETRY", 13, palette.muted)}
</svg>`;

function torusFigure() {
  const cx = 790, cy = 385, scale = 92, major = 2.15, minor = 0.72;
  const project = ([x, y, z]) => [cx + scale * (0.78 * x - 0.56 * y), cy + scale * (0.34 * x + 0.47 * y - 0.82 * z)];
  const curves = [];
  for (let j = 0; j < 14; j += 1) {
    const phi = j / 14 * 2 * Math.PI;
    const curve = [];
    for (let i = 0; i <= 120; i += 1) curve.push(project(torusPoint(i / 120 * 2 * Math.PI, phi, major, minor)));
    curves.push(`<polyline points="${points(curve)}" fill="none" stroke="${j % 2 ? palette.muted : palette.copper}" stroke-opacity=".52" stroke-width="1.3"/>`);
  }
  for (let j = 0; j < 18; j += 1) {
    const theta = j / 18 * 2 * Math.PI;
    const curve = [];
    for (let i = 0; i <= 70; i += 1) curve.push(project(torusPoint(theta, i / 70 * 2 * Math.PI, major, minor)));
    curves.push(`<polyline points="${points(curve)}" fill="none" stroke="${palette.blue}" stroke-opacity=".34" stroke-width="1.1"/>`);
  }
  const thetaCurve = [], phiCurve = [];
  for (let i = 0; i <= 140; i += 1) thetaCurve.push(project(torusPoint(i / 140 * 2 * Math.PI, 0.55, major, minor)));
  for (let i = 0; i <= 90; i += 1) phiCurve.push(project(torusPoint(0.72, i / 90 * 2 * Math.PI, major, minor)));
  const domain = `<rect x="64" y="186" width="330" height="330" rx="4" fill="${palette.panel}" stroke="${palette.muted}"/>
    ${line(64, 186, 394, 186, palette.yellow, 5)}${line(64, 516, 394, 516, palette.yellow, 5)}
    ${line(64, 186, 64, 516, palette.blue, 5)}${line(394, 186, 394, 516, palette.blue, 5)}
    ${text(229, 169, "θ direction: left edge ≡ right edge", 15, palette.blue, "middle")}
    ${text(229, 547, "φ direction: lower edge ≡ upper edge", 15, palette.yellow, "middle")}
    ${line(94, 350, 350, 350, palette.blue, 3)}<polygon points="350,350 334,342 334,358" fill="${palette.blue}"/>
    ${line(229, 480, 229, 222, palette.yellow, 3)}<polygon points="229,222 221,238 237,238" fill="${palette.yellow}"/>
    ${text(112, 334, "θ", 22, palette.blue)}${text(246, 250, "φ", 22, palette.yellow)}`;
  const body = `${domain}<g>${curves.join("")}</g>
    <polyline points="${points(thetaCurve)}" fill="none" stroke="${palette.blue}" stroke-width="5"/>
    <polyline points="${points(phiCurve)}" fill="none" stroke="${palette.yellow}" stroke-width="5"/>
    ${text(790, 625, "Embedded reference X(θ, φ), with Rmaj > rmin > 0", 17, palette.line, "middle")}
    ${text(56, 128, "The quotient square defines the state topology; the embedding supplies an optional induced metric.", 16, palette.muted)}`;
  return shell("FIG-MG04-01", "Quotient torus and embedded reference", "A square with opposite edges identified beside a wireframe ring torus. Blue and yellow curves mark the two independent periodic directions.", body);
}

function dialFigure() {
  const center = [300, 370], theta = 1.02, phi = 4.62;
  const [tx, ty] = dialPoint(theta, 210, center), [px, py] = dialPoint(phi, 135, center);
  let ticks = "";
  for (let i = 0; i < 24; i += 1) {
    const [x1, y1] = dialPoint(i / 24 * 2 * Math.PI, 224, center);
    const [x2, y2] = dialPoint(i / 24 * 2 * Math.PI, i % 6 ? 214 : 205, center);
    ticks += line(x1, y1, x2, y2, i % 6 ? palette.muted : palette.brass, i % 6 ? 1 : 3);
  }
  const body = `<circle cx="300" cy="370" r="238" fill="${palette.panel}" stroke="${palette.brass}" stroke-width="2"/>
    <circle cx="300" cy="370" r="210" fill="none" stroke="${palette.muted}" stroke-width="2"/>
    <circle cx="300" cy="370" r="135" fill="none" stroke="${palette.muted}" stroke-width="2" stroke-dasharray="5 5"/>${ticks}
    ${line(300, 370, tx, ty, palette.yellow, 5)}${line(300, 370, px, py, palette.yellow, 5, "8 5")}
    <circle cx="${tx}" cy="${ty}" r="9" fill="${palette.yellow}"/><rect x="${px-8}" y="${py-8}" width="16" height="16" fill="${palette.yellow}"/>
    <circle cx="300" cy="370" r="8" fill="${palette.brass}"/>${text(300, 116, "0 = twelve o'clock", 15, palette.red, "middle")}
    ${text(300, 650, "positive phase is clockwise", 15, palette.muted, "middle")}
    ${text(650, 178, "Y · Selected simulation channel", 22, palette.yellow, "start", 600)}
    ${text(650, 222, "Outer track · circle · θ = 1.02 rad", 18, palette.line)}
    ${text(650, 258, "Inner track · square · φ = 4.62 rad", 18, palette.line)}
    ${text(650, 320, "A single hand cannot encode a general point of T².", 17, palette.line)}
    ${text(650, 362, "Track identity, center, zero direction, and sense", 17, palette.line)}
    ${text(650, 390, "of rotation are part of the decoding contract.", 17, palette.line)}
    <rect x="650" y="455" width="455" height="116" rx="7" fill="${palette.panel}" stroke="${palette.red}"/>
    ${text(676, 493, "Status window", 16, palette.red, "start", 700)}
    ${text(676, 526, "EF-001: provisionally supported · qualitative", 16, palette.line)}
    ${text(676, 554, "No phase, angle, or velocity inferred", 16, palette.muted)}`;
  return shell("FIG-MG04-02", "Two-track dial phase recovery", "The selected simulated Y channel has a circle on the outer theta track and a square on the inner phi track. A separate status window reports EF-001 qualitatively.", body);
}

function adapterFigure() {
  const phases = [0, 0.7, 1.6, 2.7, 4.4];
  const [, , nz] = adapterNormal(phases[0], 0);
  const body = `${text(70, 152, "Distinct full attitudes", 21, palette.line, "start", 600)}
    <g transform="translate(0 48)">
    ${line(102, 300, 365, 300, palette.muted, 2)}${line(234, 430, 234, 180, palette.muted, 2)}
    ${phases.map((theta, i) => {
      const attitude = adapterMatrix(theta, 0);
      const x = 234 + 112 * attitude[0][0], y = 300 - 112 * attitude[1][0];
      return `${line(234, 300, x, y, palette.brass, 3)}<circle cx="${x}" cy="${y}" r="6" fill="${palette.brass}"/>${text(234 + 139 * attitude[0][0], 306 - 139 * attitude[1][0], i + 1, 16, palette.line, "middle")}`;
    }).join("")}
    </g>
    ${text(234, 514, "first column of A preserves θ", 16, palette.muted, "middle")}
    <path d="M 450 320 C 520 320, 530 320, 595 320" fill="none" stroke="${palette.brass}" stroke-width="3" marker-end="url(#arrow)"/>
    ${text(522, 290, "derive only", 14, palette.brass, "middle")}
    <circle cx="790" cy="320" r="148" fill="${palette.panel}" stroke="${palette.muted}" stroke-width="2"/>
    ${line(790, 320, 790, 320 - 148 * nz, palette.line, 5)}<circle cx="790" cy="${320 - 148 * nz}" r="8" fill="${palette.line}"/>
    ${text(818, 201, "all five normals", 16, palette.line)}
    ${text(790, 510, "At φ = 0, every θ gives n = (0,0,1)", 17, palette.red, "middle")}
    ${text(790, 548, "rank Dn = 1 at φ = 0 and φ = π", 17, palette.line, "middle")}
    ${text(600, 618, "Full restricted attitude: injective on T²", 17, palette.green, "middle")}
    ${text(600, 651, "Derived normal / plane: many-to-one", 17, palette.red, "middle")}
    <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="${palette.brass}"/></marker></defs>`;
  return shell("FIG-MG04-03", "Full attitude versus derived normal", "Several distinct adapter attitudes on the left map to the same north-pole normal on the right when phi is zero, demonstrating information loss.", body);
}

function redVisibilityFigure() {
  const stages = [[-5, "−5° · upper arc"], [0, "0° · full ring"], [10, "+10° · lower arc"]];
  const panels = stages.map(([pitch, caption], index) => {
    const cx = 227 + 373 * index, cy = 315, scale = 144, eps = 1e-6;
    const eta = pitch * Math.PI / 180;
    const segments = [];
    let current = [];
    for (let k = 0; k <= 360; k += 1) {
      const phase = 2 * Math.PI * k / 360;
      const sinPhase = Math.sin(phase);
      if (-Math.sin(eta) * sinPhase >= -eps) {
        current.push([cx + scale * Math.cos(phase), cy - scale * Math.cos(eta) * sinPhase]);
      } else if (current.length) {
        segments.push(current);
        current = [];
      }
    }
    if (current.length) segments.push(current);
    return `<circle cx="${cx}" cy="${cy}" r="${scale}" fill="${palette.panel}"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${scale}" ry="${scale * Math.cos(eta)}" fill="none" stroke="${palette.muted}" stroke-width="2" stroke-dasharray="7 7"/>
      ${segments.filter((part) => part.length > 1).map((part) =>
        `<polyline points="${points(part)}" fill="none" stroke="${palette.red}" stroke-width="6" stroke-linecap="round"/>`
      ).join("")}
      ${line(cx - 12, cy, cx + 12, cy, palette.brass)}${line(cx, cy - 12, cx, cy + 12, palette.brass)}
      ${text(cx, 507, caption, 20, palette.line, "middle", 600)}`;
  });
  return shell("FIG-MG04-04", "Locked R plane under three observer pitches",
    "At zero yaw the red ring has an upper visible arc at minus five degrees, a full ring at zero, and a lower visible arc at plus ten. Its world normal stays fixed.",
    `${panels.join("")}
    ${text(600, 564, "Solid: visible samples  |  Dashed: occluded locus", 19, palette.line, "middle")}
    ${text(600, 609, "R world normal = +z throughout   ·   yaw = 0°   ·   depth tolerance = 0.000001", 17, palette.muted, "middle")}`, 675);
}

const check = process.argv.includes("--check");
if (!check) await fs.mkdir(target, { recursive: true });
const figures = [
  ["fig-mg04-01-quotient-torus.svg", torusFigure()],
  ["fig-mg04-02-dual-track-dial.svg", dialFigure()],
  ["fig-mg04-03-adapter-normal.svg", adapterFigure()],
  ["fig-mg04-04-red-visibility.svg", redVisibilityFigure()],
];
await Promise.all(figures.map(async ([name, content]) => {
  const file = path.join(target, name);
  if (check) {
    if (await fs.readFile(file, "utf8") !== content + "\n") throw new Error(`Stale figure: ${name}`);
  } else {
    await fs.writeFile(file, content + "\n");
  }
}));
console.log(`${check ? "Verified" : "Generated"} ${figures.length} mathematical SVG figures in ${path.relative(root, target)}.`);
