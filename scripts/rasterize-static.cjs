const path = require("node:path");
const fs = require("node:fs/promises");
const { initWasm, Resvg } = require("@resvg/resvg-wasm");

async function main() {
  const base = path.resolve(__dirname, "../assets/gmg-a-reference-pose-v0.2");
  const [wasm, svg, sans, serif] = await Promise.all([
    fs.readFile(require.resolve("@resvg/resvg-wasm/index_bg.wasm")),
    fs.readFile(base + ".svg"),
    fs.readFile(require.resolve("dejavu-fonts-ttf/ttf/DejaVuSans.ttf")),
    fs.readFile(require.resolve("dejavu-fonts-ttf/ttf/DejaVuSerif.ttf")),
  ]);
  await initWasm(wasm);
  const renderer = new Resvg(svg, {
    font: {
      fontBuffers: [sans, serif],
      defaultFontFamily: "DejaVu Sans",
      sansSerifFamily: "DejaVu Sans",
      serifFamily: "DejaVu Serif",
    },
  });
  const png = Buffer.from(renderer.render().asPng());
  if (process.argv.includes("--check")) {
    const committed = await fs.readFile(base + ".png");
    if (!png.equals(committed)) {
      throw new Error("The profile PNG is stale. Run npm run render:pose and commit the updated assets.");
    }
    console.log("Profile PNG matches the reference SVG.");
  } else {
    await fs.writeFile(base + ".png", png);
    console.log("Rendered the profile PNG.");
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
