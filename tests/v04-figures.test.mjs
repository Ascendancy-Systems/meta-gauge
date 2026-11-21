import { execFileSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

test("the v0.4 atlas SVGs match their generator", () => {
  const generator = fileURLToPath(new URL("../scripts/generate-mathematical-figures.mjs", import.meta.url));
  execFileSync(process.execPath, [generator, "--check"], { stdio: "pipe" });
});
