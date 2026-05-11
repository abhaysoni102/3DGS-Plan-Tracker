// ============================================================
//  data.js — spaces360 3DGS Research Tracker
//  THE file your team will edit most often.
//
//  To add a new tool:    add an entry to TOOLS[compartment]
//  To update tool notes: find it by id, edit the notes field
//  To add a compartment: add to COMP_META and TOOLS
//  To update roadmap:    edit PRIORITY_DATA
// ============================================================

// ── TOOL OPTIONS PER COMPARTMENT ────────────────────────────
// Fields:
//   id       — matches Q2 numbering in research plan (e.g. "A.1.opt1")
//   name     — display name
//   gpu      — "cloud" | "local" | "none" | "webgl" | "webgpu"
//   cost     — short string
//   diff     — "Easy" | "Medium" | "Hard"
//   link     — official URL (empty string if none)
//   notes    — full research notes including known failure modes
//              and capture protocol. Cite sources in here.

const TOOLS = {

  'A.1': [
    {
      id: 'A.1.opt1',
      name: 'Luma AI cloud',
      gpu: 'cloud', cost: 'Free tier', diff: 'Easy',
      link: 'https://lumalabs.ai',
      notes: 'Most popular starting point. Free daily quota. Accepts MP4/MOV up to ~5 min, recommends 1080p 30fps. Output: .ply + .splat + .glb. Known issues: large hall centre holes, glass surface floaters, textureless wall blur. Official capture guide at lumalabs.ai/learn recommends ~5cm/sec walking speed, 70% frame overlap, multiple height passes for tall spaces. Cite: lumalabs.ai/learn'
    },
    {
      id: 'A.1.opt2',
      name: 'Polycam Splat mode (no LiDAR)',
      gpu: 'cloud', cost: 'Free/Pro', diff: 'Easy',
      link: 'https://poly.cam',
      notes: 'No LiDAR required. Upload video or photos from any phone. Splat mode in mobile app or web uploader. Comparable quality to Luma on small/medium spaces. Background bleed common on wide-angle shots. Free tier: limited exports per month. Processing queue can be 15–45 min. Cite: poly.cam/guides'
    },
    {
      id: 'A.1.opt3',
      name: 'iPhone Pro LiDAR + Polycam',
      gpu: 'cloud', cost: 'Free/Pro', diff: 'Easy',
      link: 'https://poly.cam',
      notes: 'Requires iPhone Pro 12 or newer. LiDAR assists initial depth, improving floor/wall accuracy vs pure video. Better scale accuracy than phone video alone. iOS-only constraint. LiDAR range ~5m — insufficient for large halls without supplemental video passes. Cite: poly.cam/blog/lidar'
    },
    {
      id: 'A.1.opt4',
      name: 'Teleport (Varjo) 360° pipeline',
      gpu: 'cloud', cost: 'Paid', diff: 'Medium',
      link: 'https://teleport.space',
      notes: '360° camera captures ceiling simultaneously — strongest option for large halls because overhead coverage avoids the centre-hole failure seen in phone-based tools. Service-native viewer included. Higher cost than free-tier cloud options. Less DIY-friendly. Requires 360° camera hardware (e.g. Insta360 X4). Cite: teleport.space/docs'
    },
    {
      id: 'A.1.opt5',
      name: 'PostShot (Jawset)',
      gpu: 'cloud/local', cost: 'Free beta', diff: 'Easy',
      link: 'https://jawset.com/postshot',
      notes: 'Windows GUI app (free beta as of 2025). Can process locally (needs GPU) or upload to their cloud queue. Good beginner UX. Exports .ply. Actively developed — check for updates before testing. Cloud option is viable for no-GPU users. Cite: jawset.com/postshot/docs'
    },
    {
      id: 'A.1.opt6',
      name: 'COLMAP + nerfstudio splatfacto',
      gpu: 'local', cost: 'Free', diff: 'Hard',
      link: 'https://github.com/nerfstudio-project/nerfstudio',
      notes: 'Fully local, fully open-source. COLMAP for camera pose estimation from photo frames, splatfacto for Gaussian training. Most control over quality parameters. Needs GPU — use Google Colab (free T4) or Vast.ai (~€0.20/hr). Wall time: 1–3 hrs per scene on T4. Best fallback when data ownership is required. Cite: docs.nerf.studio/quickstart'
    },
    {
      id: 'A.1.opt7',
      name: 'RealityCapture (photogrammetry baseline)',
      gpu: 'local', cost: 'Per export', diff: 'Medium',
      link: 'https://www.capturingreality.com',
      notes: 'Not native 3DGS — produces mesh + texture. Useful as a quality comparison baseline and for the Matterport comparison section of the report. Can convert mesh to splat via alpha2splat. Very high mesh quality. Per-export pricing (free under €2500 revenue threshold). Cite: capturingreality.com/pricing'
    },
  ],

  'A.2': [
    {
      id: 'A.2.opt1',
      name: 'KIRI Engine object mode',
      gpu: 'cloud', cost: 'Free tier', diff: 'Easy',
      link: 'https://www.kiriengine.com',
      notes: 'Best-in-class for isolated object 3DGS as of 2025. AI auto background removal built in. Real-world scale estimated from EXIF + device sensor heuristics. iOS and Android. Outputs .ply. Capture: walk around object slowly ~1m away, 60–90 sec. Known issue: thin members (chair legs, floral stems) need extra close-up passes at 30cm. Cite: kiriengine.com/help'
    },
    {
      id: 'A.2.opt2',
      name: 'Polycam object mode',
      gpu: 'cloud', cost: 'Free/Pro', diff: 'Easy',
      link: 'https://poly.cam',
      notes: 'LiDAR improves scale accuracy significantly. Good background isolation on Pro tier. Without LiDAR, background mask quality is inconsistent for objects smaller than 50cm. Scale reported in real units if LiDAR present, unitless otherwise — requires manual calibration without LiDAR. Cite: poly.cam/guides/object-capture'
    },
    {
      id: 'A.2.opt3',
      name: 'Luma AI object capture',
      gpu: 'cloud', cost: 'Free', diff: 'Easy',
      link: 'https://lumalabs.ai',
      notes: 'Orbit video around object on any phone. Background frequently bleeds into splat — no auto masking. Scale is arbitrary, requires known-size reference object in scene or manual calibration afterward. Works well for large matte objects (tables). Poor on chairs and thin items without turntable setup. Cite: lumalabs.ai/learn/object'
    },
    {
      id: 'A.2.opt4',
      name: 'Scaniverse (LiDAR)',
      gpu: 'cloud', cost: 'Free', diff: 'Easy',
      link: 'https://scaniverse.com',
      notes: 'LiDAR-first on iPhone Pro. Mesh output primarily; 3DGS mode in beta as of 2025. Good scale accuracy from LiDAR depth data. Best for solid objects with clear surface definition. Less effective on transparent surfaces (glassware, acrylic decor) and highly polished metal. Cite: scaniverse.com/docs'
    },
    {
      id: 'A.2.opt5',
      name: 'Turntable + fixed camera + any pipeline',
      gpu: 'varies', cost: 'Hardware (~€30–80)', diff: 'Medium',
      link: '',
      notes: 'Controlled rotation, consistent background, known capture geometry. Eliminates background bleed, maximises reconstruction consistency. One-time setup cost amortised across full furniture catalogue. Best quality ceiling for items captured repeatedly. Any of opt1–opt3 can process the output. Turntable: Jiyi or similar motorised 360 product turntable. Cite: common practice in product photography pipelines'
    },
    {
      id: 'A.2.opt6',
      name: 'Local pipeline + SAM2 masking',
      gpu: 'local', cost: 'Free', diff: 'Hard',
      link: 'https://github.com/facebookresearch/segment-anything',
      notes: 'Phone orbit video → extract frames (FFmpeg) → segment background per frame with SAM2 or rembg → COLMAP + nerfstudio splatfacto with masked input. Highest quality ceiling. Full control over masking quality. Needs GPU (Google Colab works). Most time-consuming per item — only justified for hero catalogue pieces. Cite: github.com/facebookresearch/segment-anything-2'
    },
  ],

  'B.1': [
    {
      id: 'B.1.opt1',
      name: 'SuperSplat (PlayCanvas, browser)',
      gpu: 'none', cost: 'Free / MIT', diff: 'Easy',
      link: 'https://supersplat.playcanvas.com',
      notes: 'Best starting point. Browser-based, no install. Load multiple .ply files in one scene. Translate, rotate, scale gizmos. Export merged single .ply. File size limit approximately 500MB per file. No snap-to-floor — positioning is manual. Not optimised for non-technical end users but perfect for the research demo. Cite: github.com/playcanvas/supersplat'
    },
    {
      id: 'B.1.opt2',
      name: 'Blender + 3DGS addon',
      gpu: 'none', cost: 'Free', diff: 'Hard',
      link: 'https://github.com/ReshotAI/gaussian-splatting-blender',
      notes: 'Full DCC tooling — most precise positioning available. Import splat, align to scene world, export back to .ply. Steep learning curve; non-technical users will struggle significantly. Useful for producing reference human-authored placements that define the ground-truth layout JSON format for B.2. Cite: github.com/ReshotAI/gaussian-splatting-blender'
    },
    {
      id: 'B.1.opt3',
      name: 'Custom Three.js / gsplat.js editor',
      gpu: 'none', cost: 'Dev time', diff: 'Hard',
      link: 'https://github.com/mkkellogg/GaussianSplats3D',
      notes: 'Build drag-and-drop with gsplat.js + Three.js TransformControls. Most flexible for the final product — this IS effectively the C.2 deliverable if built. Snap-to-floor, collision detection, and undo all implementable. Highest development effort, highest product payoff. Should be developed in parallel with C.1. Cite: threejs.org/docs/TransformControls'
    },
    {
      id: 'B.1.opt4',
      name: 'Teleport scene editor',
      gpu: 'none', cost: 'Paid', diff: 'Easy',
      link: 'https://teleport.space',
      notes: 'Service-native positioning UI. Good UX for non-technical users. Export options are limited — cannot export a standalone .ply with placed assets for offline use. Vendor lock-in risk. Only viable if committing to Teleport ecosystem end-to-end. Cite: teleport.space/docs/scene-editor'
    },
    {
      id: 'B.1.opt5',
      name: 'Layout JSON + programmatic Gaussian merge',
      gpu: 'none', cost: 'Dev time', diff: 'Medium',
      link: '',
      notes: 'Human writes placement JSON by hand (position, rotation, scale per asset). Script reads JSON + .ply files, applies rigid transforms to Gaussian means/covariances, concatenates all PLY buffers, exports merged .ply. Pure Python + NumPy, no GPU. Reproducible, diff-able, version-controllable. Bridges B.1 and B.2 cleanly — same JSON schema used by both. Cite: standard PLY format spec'
    },
  ],

  'B.2': [
    {
      id: 'B.2.opt1',
      name: 'RANSAC floor detection (Open3D)',
      gpu: 'none', cost: 'Free', diff: 'Medium',
      link: 'https://open3d.org',
      notes: 'Fit plane to lowest-Y Gaussian centroid positions using RANSAC. Pure Python, runs on any laptop. Open3D provides o3d.geometry.PointCloud and segment_plane() out of the box. Typical accuracy ±2–3cm on flat floors. Fails on multi-level floors, ramped surfaces, and highly scattered point clouds. Test: compare detected plane normal to [0,1,0] — deviation >5° indicates failure. Cite: open3d.org/docs/release/tutorial/geometry/pointcloud.html'
    },
    {
      id: 'B.2.opt2',
      name: 'SuGaR mesh extraction for floor',
      gpu: 'local', cost: 'Free', diff: 'Hard',
      link: 'https://github.com/Anttwo/SuGaR',
      notes: 'Convert 3DGS to triangle mesh using SuGaR, then find largest near-horizontal face cluster as floor plane. More robust than raw Gaussian RANSAC on noisy scenes. GPU needed for SuGaR mesh extraction (Google Colab viable). Additional ~30 min processing per scene. Output mesh can also be used for collision detection in C.2. Cite: github.com/Anttwo/SuGaR'
    },
    {
      id: 'B.2.opt3',
      name: 'Claude API (Sonnet) — layout JSON',
      gpu: 'none', cost: '~€0.01/call', diff: 'Medium',
      link: 'https://api.anthropic.com',
      notes: 'Pass room dimensions (width, depth, height), asset footprints (w×d per item), item count, and placement intent as structured prompt. Claude returns a JSON layout [{asset_id, x, z, rotation_deg}]. Fast, cheap, no GPU. Test with 3 prompt types: simple ("place table at centre"), structured ("banquet for 80, stage at back wall"), open-ended ("afternoon networking event"). Validate JSON schema + run collision check loop in code. Max 3 retries on collision. Cite: docs.anthropic.com/en/api'
    },
    {
      id: 'B.2.opt4',
      name: 'GPT-4o — layout JSON',
      gpu: 'none', cost: '~€0.02/call', diff: 'Medium',
      link: 'https://openai.com',
      notes: 'Function calling for layout JSON output. Comparable quality to Claude for structured placement tasks on well-defined prompts. Slightly higher cost per call. Use as comparison benchmark — run identical prompts through both APIs and score placement quality against a ground-truth human layout. Report the delta. Cite: platform.openai.com/docs/guides/function-calling'
    },
    {
      id: 'B.2.opt5',
      name: 'Gaussian merge at publish time',
      gpu: 'none', cost: 'Free', diff: 'Medium',
      link: '',
      notes: 'After LLM produces layout JSON, apply rigid transforms (translate Gaussian means, rotate covariance matrices) and concatenate all PLY binary buffers into one output file. Pure NumPy/struct operations, no GPU. Produces single .ply ready for C.1 viewer. Trade-off: no live rearrangement after merge — must re-run pipeline to change layout. Simplest composition path. Cite: PLY binary format spec'
    },
    {
      id: 'B.2.opt6',
      name: 'Separate PLY + runtime layout JSON',
      gpu: 'none', cost: 'Free', diff: 'Medium',
      link: '',
      notes: 'Viewer loads venue PLY + each asset PLY separately, applies layout JSON transforms at render time in the browser. Enables live editing without re-processing — user drags item, JSON updates, viewer re-renders. More complex viewer implementation but directly maps to the C.2 interactive editing requirement. This is the preferred architecture for the final product. Cite: gsplat.js multi-scene API'
    },
  ],

  'C.1': [
    {
      id: 'C.1.opt1',
      name: 'gsplat.js (Three.js native)',
      gpu: 'webgl', cost: 'Free / MIT', diff: 'Medium',
      link: 'https://github.com/mkkellogg/GaussianSplats3D',
      notes: 'Most actively maintained WebGL 3DGS viewer as of 2025. Three.js native — custom UI, HUD, hotspots, and TransformControls all straightforward to layer on top. WASD + mouse fly camera. WebGL2. Supports .ply and .splat formats. Performance: ~60fps on mid-range desktop for scenes under 200MB. Degrades on mobile — test on at least one Android mid-range. Recommended substrate for C.2 editing layer. Cite: github.com/mkkellogg/GaussianSplats3D'
    },
    {
      id: 'C.1.opt2',
      name: 'antimatter15/splat (minimal WebGL)',
      gpu: 'webgl', cost: 'Free', diff: 'Easy',
      link: 'https://github.com/antimatter15/splat',
      notes: 'No dependencies, smallest bundle (~30KB). Fastest initial load. WebGL1+2. Orbit camera only in base version. Good for embedding in existing pages. Hard to extend — not suitable as editing substrate for C.2. Best use: embed/share-only demos and the iframe share option in C.3. Cite: github.com/antimatter15/splat'
    },
    {
      id: 'C.1.opt3',
      name: 'SuperSplat viewer (PlayCanvas)',
      gpu: 'webgl', cost: 'Free', diff: 'Easy',
      link: 'https://supersplat.playcanvas.com',
      notes: 'iframe embeddable from PlayCanvas CDN. Zero setup. Good performance. No custom UI possible from outside the iframe sandbox. Cannot serve as editing substrate. Best for quick stakeholder demos and sharing with spaces360 before the custom viewer is ready. Cite: playcanvas.com/supersplat'
    },
    {
      id: 'C.1.opt4',
      name: 'Spark by World Labs (WebGPU)',
      gpu: 'webgpu', cost: 'Free beta', diff: 'Medium',
      link: 'https://spark.worldlabs.ai',
      notes: 'WebGPU-based — potential 2–5x performance over WebGL on large scenes on Chrome 113+ desktop. Mobile limited to Safari 18+ and Chrome Android (WebGPU support varies). Free beta as of 2025. Evaluate browser compatibility against your target user base before committing. If most users are on older browsers, fallback to WebGL. Cite: spark.worldlabs.ai/docs'
    },
    {
      id: 'C.1.opt5',
      name: 'Service iframe (Luma / Polycam / Teleport)',
      gpu: 'cloud', cost: 'Free/Paid', diff: 'Easy',
      link: '',
      notes: 'Zero setup, zero code. Vendor-hosted rendering — no GPU cost on your infrastructure side. No custom UI or editing layer possible from outside the iframe. Vendor lock-in. Performance depends on vendor CDN. Best for a quick demo to spaces360 before custom viewer is built. Not viable as the final product. Cite: each vendor\'s embed documentation'
    },
  ],

};


// ── COMPARTMENT METADATA ────────────────────────────────────
// Each entry corresponds to a Q1–Q5 compartment in the research plan.
// pri: 1 = critical path, 2 = demo guarantee, 3 = research/polish

const COMP_META = {
  'A.1': { label: 'A.1 — Venue 3DGS',         layer: 'A', pri: 1, goal: 'Produce a .ply Gaussian splat of a real empty venue at small, medium, and large scales.' },
  'A.2': { label: 'A.2 — Furniture 3DGS',      layer: 'A', pri: 1, goal: 'Produce a clean isolated .ply of a single furniture item with no background residue at known scale.' },
  'B.1': { label: 'B.1 — Manual composition',  layer: 'B', pri: 2, goal: 'Human positions furniture splats inside venue splat via editor, exports single composed scene.' },
  'B.2': { label: 'B.2 — Auto floor + LLM',    layer: 'B', pri: 2, goal: 'Detect floor plane, detect asset footprints, use LLM to produce layout JSON, apply and compose.' },
  'B.3': { label: 'B.3 — End-to-end service',  layer: 'B', pri: 3, goal: 'Survey: does any service accept video + prompt and return a composed scene? Document the gap.' },
  'C.1': { label: 'C.1 — Browser viewer',      layer: 'C', pri: 2, goal: 'Load composed .ply in browser with free-viewpoint navigation at usable frame rates.' },
  'C.2': { label: 'C.2 — Interactive editing', layer: 'C', pri: 3, goal: 'Non-technical user places, moves, rotates, removes furniture in browser via prompt or drag-and-drop.' },
  'C.3': { label: 'C.3 — Save and share',      layer: 'C', pri: 3, goal: 'Save layout, generate shareable URL, reload identical state in fresh browser session.' },
};


// ── 8-WEEK PRIORITY ROADMAP ─────────────────────────────────
// Edit this to update the roadmap priority list on the Roadmap page.
// cls: p1 | p2 | p3  (styling class)
// badge: b-p1 | b-p2 | b-p3 | b-gray

const PRIORITY_DATA = [
  {
    n: 1, cls: 'p1', badge: 'b-p1', badge_text: 'Critical path',
    label: 'A.1 + A.2 — Get your first .ply files (W1–W2)',
    desc: 'Everything downstream needs a .ply file. Start A.1 with Luma AI free tier + a Pexels indoor walking video. No venue access required yet. Simultaneously capture a chair or table for A.2 using KIRI Engine. Do not move to W3 until you have at least one clean venue .ply and one furniture .ply.',
    chips: ['Luma AI', 'Polycam', 'KIRI Engine', 'Pexels test video'],
  },
  {
    n: 2, cls: 'p2', badge: 'b-p2', badge_text: 'Demo guarantee',
    label: 'B.1 — Manual composition in SuperSplat (W3–W4)',
    desc: 'Your fallback demo. SuperSplat is browser-based, free, no install. Load venue + furniture .ply, position with gizmos, export merged .ply. Even if B.2 and B.3 fail completely, B.1 guarantees something working to show spaces360.',
    chips: ['SuperSplat', 'Blender addon'],
  },
  {
    n: 3, cls: 'p2', badge: 'b-p2', badge_text: 'Demo guarantee',
    label: 'C.1 — Browser viewer (W5, parallel with B.2)',
    desc: 'Get the composed .ply rendering in a browser. Test with the public bonsai sample first (30MB), then your own scene. Measure FPS on desktop and one mobile device. gsplat.js is the recommended starting point.',
    chips: ['gsplat.js', 'antimatter15/splat', 'SuperSplat viewer'],
  },
  {
    n: 4, cls: 'p1', badge: 'b-p1', badge_text: 'Critical path',
    label: 'A.1 large venue capture (W3)',
    desc: 'Once your small/medium protocol works, attempt a real large venue. Borrow access to a university hall, hotel ballroom, or conference centre. The large-scale failure modes (ceiling holes, glass) are the core research finding of the project.',
    chips: ['60° overlap protocol', 'Multiple height passes', 'Avoid direct skylights'],
  },
  {
    n: 5, cls: 'p3', badge: 'b-p3', badge_text: 'Research novelty',
    label: 'B.2 — Floor detection + LLM placement (W4–W5)',
    desc: 'RANSAC on .ply point cloud for floor plane (Open3D, pure Python, no GPU). Then Claude API for layout JSON from a natural language prompt. Run entirely on laptop. This is the main research contribution — partial results are publishable findings.',
    chips: ['Open3D RANSAC', 'Claude API', 'GPT-4o', 'JSON schema validation'],
  },
  {
    n: 6, cls: 'p3', badge: 'b-p3', badge_text: 'Product polish',
    label: 'C.2 + C.3 — Editing UI + save/share (W6–W7)',
    desc: 'Drag-and-drop furniture in the browser viewer, plus a save/share URL. Start with C.3 (FastAPI + SQLite is trivial to deploy on Render free tier) then layer the editing UI on top. Prompt-driven editing is a stretch goal.',
    chips: ['FastAPI', 'SQLite', 'Three.js TransformControls'],
  },
  {
    n: 7, cls: 'p3', badge: 'b-p3', badge_text: 'Finding',
    label: 'B.3 — End-to-end service survey (W5, max 3 days)',
    desc: 'Hard timebox: 3 days. Survey whether any single service accepts video + prompt → composed scene. The answer is almost certainly no today. Document that clearly with searches performed and date. This gap finding is valuable for the final report.',
    chips: ['Luma Dream Machine', 'World Labs', 'Spatial AI survey'],
  },
  {
    n: 8, cls: 'p3', badge: 'b-p3', badge_text: 'Final output',
    label: 'W8 — Matterport comparison + evaluation report',
    desc: 'Structured comparison on 5 dimensions: capture time, cost per venue, visual quality, staging feasibility, non-technical usability. All data comes from your logged test results in this tracker. The report writes itself if logging was done consistently.',
    chips: ['5-dimension rubric', 'Side-by-side screenshots', 'Cost breakdown table'],
  },
];
