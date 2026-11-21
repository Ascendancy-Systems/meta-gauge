# MG-001 / GMG-A Gate B laboratory

The isolated dual-view simulation accepted at Gate B. The lab uses the [Gate A contract](../../docs/MG-001_GMG-A_gate_a_contract_v0.4.md), the [versioned draft fixture](../../tests/fixtures/v04-dual-view.json), and the preserved [v0.2 base pose](../../config/gmg-a-reference-pose-v0.2.json). The repository's Pages workflow stages the existing viewer only. This laboratory stays outside that deployment. See the [development status](../../docs/development-status.md).

## Using the simulation

Choose Y at either fixture time. The same sample supplies the two labeled phase tracks and the full restricted attitude of Y. Zero on the dial is at twelve o'clock and phases increase clockwise. R stays fixed in the reference frame, and B/G retain their v0.2 attitudes. Clearing the selection restores all four base poses. Camera yaw and pitch affect projection and visibility. The selected phase pair, world-space ring geometry, and qualitative status retain their values.

The laboratory specifies three reticle targets:

| Target | Identity and attachment | On camera movement |
| --- | --- | --- |
| Observer center | An observer-frame origin pointer | Always centered |
| World +z | The fixed unit vector $(0,0,1)$ in world coordinates | Project the same point and hide the pointer behind the limb |
| Ring marker R/Y/B/G | Stable marker ID plus the ring's independent v0.2 local marker phase | Project the transformed marker and keep its identity when it is occluded |

A Y marker follows a Y attitude change at the local phase in the pose fixture. The phase is independent of the two dial phases. R’s center-of-scene star and the movable reticle are distinct. Inter-plane angles in the table use the v0.2 unoriented-plane definition, $\arccos\lvert n_i\cdot n_R\rvert$, displayed in degrees. Front-hemisphere clipping uses the v0.2 tolerance and sample count. The observer-center option is a fixed observer reference for this lab. It does not add a general free-aim manipulation mode.

The status panel presents the pinned EF-001 qualitative label with its assessment date and freshness qualifier. The other registers show their unavailable states explicitly. Public verification and source authority retain the limitations of the operational record. The laboratory has no source-to-orientation coupling.

## Reproduce

From the repository root:

```sh
npm ci --ignore-scripts
npm run check
node scripts/render-gate-b.mjs --check
python -m http.server 8000 --bind 127.0.0.1
```

Open [the local laboratory](http://127.0.0.1:8000/experiments/gate-b/) or inspect the [reference snapshot](./snapshot.svg). Both use the same scene builder and SVG panels for the fixture default. The snapshot metadata records the model, pose, adapter, assessment revision, selected sample, camera, and target. Run `node scripts/render-gate-b.mjs` to regenerate it after a reviewed change.

The [Node tests](../../tests/gate-b.test.mjs) cover the scene invariants and exact snapshot generation. The optional [browser checks](../../tests/browser/gate-b.cjs) need Playwright, axe for Playwright, and an installed Chromium browser. For example, with Windows PowerShell from the repository root:

```powershell
npm install --prefix ../gate-b-browser-tools --no-save --ignore-scripts playwright@1.65.1 @axe-core/playwright@4.14.0
$env:NODE_PATH = (Resolve-Path ../gate-b-browser-tools/node_modules).Path
$env:GATE_B_CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
node tests/browser/gate-b.cjs
```

The browser checks start a temporary loopback server, exercise desktop and 390-pixel touch viewports, and compare the initial panels to the generated snapshot. Set `GATE_B_SCREENSHOTS` to a writable directory to capture both layouts. Automated accessibility checks supplement keyboard and touch checks. Assistive-technology review remains a separate commissioning activity.

## Next gate

[Gate C](../../docs/development-status.md#gate-c--simulation-dynamics) will address simulated trajectories and validated D1/D2 reticles with a declared connection, time base, frame, and gap behavior. This lab uses two illustrative Y samples and discrete selection. It supplies no operational measurements, automatic calibration, or publication decision.
