import { readFile, writeFile } from "node:fs/promises";
import { buildScene, sources } from "../experiments/gate-b/scene.mjs";
import { renderSnapshot } from "../experiments/gate-b/view.mjs";

const target = new URL("../experiments/gate-b/snapshot.svg", import.meta.url);
const [fixture, pose] = await Promise.all(
  [sources.fixture, sources.pose].map(async (url) => JSON.parse(await readFile(url, "utf8"))),
);
const rendered = renderSnapshot(buildScene(fixture, pose));
if (process.argv.includes("--check")) {
  if (await readFile(target, "utf8") !== rendered) throw new Error("Gate B snapshot differs from its generator");
  console.log("Verified the Gate B reference snapshot");
} else {
  await writeFile(target, rendered);
  console.log("Generated the Gate B reference snapshot");
}
