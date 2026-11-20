const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const types = {".html":"text/html", ".mjs":"text/javascript", ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".md":"text/markdown"};
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const file = path.resolve(root, `.${requested}`);
  if (!file.startsWith(root)) { response.writeHead(403).end(); return; }
  try { const content = fs.readFileSync(file); response.writeHead(200, {"content-type":types[path.extname(file)] || "application/octet-stream"}); response.end(content); }
  catch { response.writeHead(404).end(); }
});

(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const chromeCandidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  ];
  const executablePath = chromeCandidates.find(fs.existsSync);
  const browser = await chromium.launch({headless:true, ...(executablePath ? {executablePath} : {})});
  try {
    fs.mkdirSync(path.join(root, "snapshots"), {recursive:true});
    for (const [name, viewport] of [["desktop",{width:1440,height:1050}], ["mobile",{width:390,height:844}]]) {
      const page = await browser.newPage({viewport, deviceScaleFactor:1});
      const errors = []; page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${port}/`, {waitUntil:"networkidle"});
      assert.equal(await page.locator("#state-readout").textContent(), "GMG-A-REFERENCE-POSE-0.2");
      if (name === "mobile") await page.screenshot({path:path.join(root,"snapshots","mobile.png")});
      await page.locator("#reticle-az").fill("24");
      await page.locator("#reticle-az").dispatchEvent("input");
      assert.match(await page.locator("#reticle-readout").textContent(), /az 24°/);
      const canvasBox = await page.locator("#gauge").boundingBox();
      assert.ok(canvasBox && canvasBox.width <= viewport.width && canvasBox.height >= 280, `${name} canvas box ${JSON.stringify(canvasBox)} viewport ${JSON.stringify(viewport)}`);
      assert.deepEqual(errors, []);
      if (name === "desktop") await page.screenshot({path:path.join(root,"snapshots","desktop.png")});
      if (name === "mobile") await page.screenshot({path:path.join(root,"snapshots","mobile-controls.png")});
      await page.close();
    }
    console.log("Desktop/mobile visual smoke passed; snapshots written.");
  } finally { await browser.close(); server.close(); }
})().catch((error) => { console.error(error); server.close(); process.exitCode = 1; });
