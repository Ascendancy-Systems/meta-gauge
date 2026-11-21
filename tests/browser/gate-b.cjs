const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");

const root = path.resolve(__dirname, "../..");
const labPath = "/experiments/gate-b/";
const types = {
  ".html": "text/html", ".css": "text/css", ".mjs": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml",
};
const localFiles = new Set([
  ...["index.html", "lab.css", "lab.mjs", "scene.mjs", "view.mjs", "snapshot.svg"]
    .map((file) => labPath + file),
  "/src/geometry.mjs", "/scripts/v04-state-contract.mjs", "/scripts/v04-math.mjs",
  "/tests/fixtures/v04-dual-view.json", "/config/gmg-a-reference-pose-v0.2.json",
]);
const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  const file = pathname === labPath ? labPath + "index.html" : pathname;
  if (!localFiles.has(file)) return response.writeHead(404).end();
  try {
    const body = await fs.readFile(path.join(root, "." + file));
    response.writeHead(200, { "content-type": types[path.extname(file)] }).end(body);
  } catch {
    response.writeHead(500).end();
  }
});

async function run() {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const url = "http://127.0.0.1:" + server.address().port + labPath;
  const executablePath = process.env.GATE_B_CHROME;
  const output = process.env.GATE_B_SCREENSHOTS;
  let browser;
  try {
    if (output) await fs.mkdir(output, { recursive: true });
    browser = await chromium.launch({ headless: true, executablePath });
    for (const [name, width, height, touch] of [["desktop", 1440, 1050, false], ["mobile", 390, 844, true]]) {
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, reducedMotion: "reduce" });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(url);
      await page.locator("#lab-content").waitFor({ state: "visible" });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth), name + " horizontal overflow");
      const dial = page.locator("#dial"), spatial = page.locator("#spatial");
      const dialBox = await dial.boundingBox(), spatialBox = await spatial.boundingBox();
      assert.equal(dialBox.y < spatialBox.y - 100, touch, name + " layout");
      assert.match(await page.locator("#sample-readout").textContent(), /sim-00/);
      const defaultDial = await dial.innerHTML();
      const defaultSpatial = await spatial.innerHTML();
      const assessment = await page.locator("#status-registers").innerText();
      assert.match(assessment, /EF-001/);
      assert.ok(await page.evaluate(async () => {
        const svg = new DOMParser().parseFromString(await (await fetch("./snapshot.svg")).text(), "image/svg+xml");
        return ["dial", "spatial"].every((name) => {
          const snapshot = svg.querySelector('[data-panel="' + name + '"]');
          const panel = document.querySelector("#" + name + " svg");
          return Boolean(snapshot && panel && snapshot.isEqualNode(panel));
        });
      }), "static snapshot and initial browser panels differ");

      const a11y = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      assert.deepEqual(a11y.violations.map(({ id, nodes }) => [id, nodes.map((node) => node.target)]), []);
      if (output) await page.screenshot({ path: path.join(output, name + ".png"), fullPage: true });

      const yaw = page.locator("#yaw");
      const geometryBefore = await page.locator("#rings").innerText();
      await yaw.press("ArrowRight");
      assert.equal(await yaw.inputValue(), "1");
      assert.equal(await dial.innerHTML(), defaultDial);
      assert.notEqual(await spatial.innerHTML(), defaultSpatial);
      assert.equal(await page.locator("#rings").innerText(), geometryBefore);
      assert.equal(await page.locator("#status-registers").innerText(), assessment);

      await page.locator("#target").selectOption("world-north");
      await yaw.fill("180");
      assert.match(await page.locator("#reticle-readout").innerText(), /World \+z.*occluded/);
      assert.equal(await spatial.locator("[data-reticle]").count(), 0);
      if (touch) await page.locator("#reset-camera").tap();
      else await page.locator("#reset-camera").click();
      assert.match(await page.locator("#reticle-readout").innerText(), /World \+z.*visible/);

      await page.locator("#target").selectOption("marker-Y");
      const ringBefore = await spatial.locator('[data-ring="Y"]').innerHTML();
      await page.locator("#sample").selectOption("sim-01");
      assert.match(await page.locator("#sample-readout").textContent(), /sim-01/);
      assert.match(await page.locator("#spatial-readout").innerText(), /sim-01/);
      assert.match(await page.locator("#reticle-readout").innerText(), /Y ring marker.*ring-local/);
      assert.notEqual(await spatial.locator('[data-ring="Y"]').innerHTML(), ringBefore);
      assert.match(await page.locator('#rings [data-ring="Y"]').innerText(), /32\.0°/);
      await page.locator("#sample").selectOption("");
      assert.match(await page.locator("#theta").innerText(), /Unavailable/);
      assert.match(await page.locator("#spatial-readout").innerText(), /reference poses/);
      assert.equal(await page.locator("#status-registers").innerText(), assessment);
      assert.deepEqual(errors, []);
      await context.close();
      console.log(name + ": selection, occlusion, input, snapshot parity, and automated accessibility checks passed");
    }
    const page = await browser.newPage();
    await page.route("**/v04-dual-view.json", (route) => route.fulfill({ status: 404 }));
    await page.goto(url);
    await page.getByText("The simulation could not load its fixtures.", { exact: false }).waitFor();
    assert.equal(await page.locator("#lab-content").isVisible(), false);
    assert.equal(await page.getByRole("link", { name: "Open the reference snapshot" }).isVisible(), true);
    await page.close();
    console.log("Missing fixture leaves the static snapshot available");
  } finally {
    await browser?.close();
    server.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
