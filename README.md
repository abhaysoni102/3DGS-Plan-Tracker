# spaces360 · 3DGS Research Tracker

A shared research tracking tool for the *From Splats to Stages* project — evaluating 3D Gaussian Splatting for virtual event venue tours and inventory staging.

Live at: `https://<your-org>.github.io/<repo-name>`

---

## What it does

- **Roadmap** — 8-week priority-ordered sprint plan with Gantt timeline
- **Compartments** — all 9 research tasks (A.1 through C.3) with live progress tracking
- **Tool comparison** — every option per compartment with difficulty, GPU requirement, cost, research notes, and source links
- **Log a test** — structured form with 6-dimension scoring; saves to shared storage and syncs to the whole team in real-time
- **Activity feed** — filterable live feed of all team test entries, newest first
- **Export report** — Q5-formatted text per compartment, ready to paste into writeup docs

---

## File structure

```
spaces360-tracker/
├── index.html          ← app shell and HTML structure only
├── css/
│   └── styles.css      ← all styling
├── js/
│   ├── data.js         ← ★ EDIT THIS MOST — all tool/compartment/roadmap data
│   ├── ui.js           ← shared UI helpers (toast, stars, pips, badges)
│   ├── sync.js         ← JSONBin real-time sync
│   ├── logger.js       ← log form logic
│   ├── roadmap.js      ← roadmap + compartments rendering
│   ├── compare.js      ← tool comparison rendering
│   ├── activity.js     ← activity feed + export report
│   └── app.js          ← app init, navigation wiring
└── README.md
```

**The file you will edit most often is `js/data.js`.**
It contains all tool options, compartment metadata, and the roadmap priority list — completely separate from any rendering logic.

---

## Setup (first time)

### 1. JSONBin (shared real-time storage)

1. Go to [jsonbin.io](https://jsonbin.io) and create a free account
2. Create a new bin with content `{"logs":[]}` — copy the **Bin ID**
3. Account → API Keys → create a new key — copy the **Secret Key**
4. Open the tracker → Setup tab → paste both values + your name → Save & connect
5. Share the Bin ID and API Key with your team via your group chat

Each team member visits the same GitHub Pages URL, enters the same credentials in Setup, and is immediately synced.

### 2. GitHub Pages

1. Push all files to the `main` branch (keep the folder structure as-is)
2. Repo → Settings → Pages → Source: Deploy from branch → `main` → `/ (root)` → Save
3. GitHub will publish the site — URL appears in Pages settings within ~2 minutes
4. Share the URL with your team

---

## How to update tool data

Open `js/data.js`. The structure is self-documenting:

```js
// To add a new tool option to A.1:
'A.1': [
  // ...existing entries...
  {
    id:    'A.1.opt8',
    name:  'New Tool Name',
    gpu:   'cloud',          // cloud | local | none | webgl | webgpu
    cost:  'Free tier',
    diff:  'Easy',           // Easy | Medium | Hard
    link:  'https://...',
    notes: 'Research notes with cited sources...',
  },
],
```

After editing, commit and push — GitHub Pages auto-deploys within ~1 minute.

---

## How to update the roadmap

Edit `PRIORITY_DATA` in `js/data.js`. Each entry is one row in the priority list.

---

## Tech stack

| Concern | Solution |
|---|---|
| Hosting | GitHub Pages (free, static) |
| Shared storage | JSONBin.io (free tier, REST API) |
| Fonts | Google Fonts — IBM Plex Mono + Sans |
| Framework | Vanilla JS — no build step, no dependencies |
| Sync | Pull every 30s + push on every save |

---

## Team

- spaces360 by Joyful UG (project partner)
- GATE program student team
