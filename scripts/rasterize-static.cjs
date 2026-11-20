const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
sharp(path.join(root, "assets", "gmg-a-reference-pose-v0.2.svg"))
  .resize(960, 960)
  .png({compressionLevel: 9})
  .toFile(path.join(root, "assets", "gmg-a-reference-pose-v0.2.png"))
  .then(() => console.log("Rasterized assets/gmg-a-reference-pose-v0.2.png"))
  .catch((error) => { console.error(error); process.exitCode = 1; });
