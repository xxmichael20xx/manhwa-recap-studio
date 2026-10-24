---
name: manhwa-dev
description: Studio engineering, UI architecture, Slate design system, 3-Tier Live Verification, and pre/post-build scrap cleanup engine. Trigger with /studio-dev.
---

# 🛠️ Manhwa Studio Architecture & Live Verification (`/studio-dev`)

> **Master SOP for Frontend/Backend Engineering, UI Design System & Live QA**  
> **Slash Command:** `/studio-dev`  
> **Workspace Root:** `quirky-chandrasekhar`  
> **Studio Root:** `C:\Users\MIchaelangelo\Documents\My Brand\02_Ventures & Digital Products\Manhwa Recap Studio\studio\`

---

## 🎯 Mandatory Interactive Auto-Grill Pre-Flight (`ask_question`)

Whenever `/studio-dev` is invoked, the agent MUST immediately halt and initiate an interactive `ask_question` interview:

```
[Interactive Pre-Flight Alignment Modal]
1. Target Studio Engineering Domain:
   - (Recommended) UI/UX Enhancement & Design System Token Harmonization (Slate Theme)
   - Backend Express API Service / Route Extension (Node.js)
   - 3-Tier Live Verification Pass (Build, API curl, Puppeteer Dual-Theme QA)
   - Scrap Cleanup & Unindexed Directory Purge
```

---

## 🎨 Architectural UI/UX & Theming Standard (Anti-Patch Invariant)

1. **Zero Half-Baked Surface Patching:** Strictly avoid ad-hoc class swaps, fragile CSS variable `@apply` overrides, or piecemeal component fixes that risk desync across views.
2. **Systemic Root-Cause Harmonization:** Trace the build pipeline or token root cause. Align 100% of views and components systematically to Manhwa Recap Studio's native Slate token hierarchy:
   - `bg-slate-50 dark:bg-slate-950` canvas
   - `bg-white dark:bg-slate-900` surfaces
   - `border-slate-200 dark:border-slate-800` borders
3. **Multi-View Visual QA Verification:** For UI/theming overhauls, do not claim completion based on code alone. Systematically verify both Light and Dark modes across all primary routes.
4. **Universal Single-Source-of-Truth (SSOT) Genre Architecture (Zero-Ad-Hoc-Ternary Mandate):**
   - Strictly forbidden from injecting localized ternary checks (e.g. `isFantasy ? 'grimoire' : 'scroll'`, `fId.includes('series_05') ? ... : ...`) inside UI components or view templates.
   - All genre vocabulary (diegetic text labels, architectural descriptors, wardrobe tokens, forbidden style tokens) MUST be defined once in `franchiseStyleHelper.js` under a structured schema and retrieved dynamically via `getFranchiseArtStyleDirective(franchiseId)`.
   - Adding a new franchise requires updating only the franchise helper schema; zero UI components or validators may require edits.

---

## 🔒 The Lead Developer 3-Tier Live Verification Standard (Anti-Half-Baked Invariant)

Prior to concluding any coding turn, the agent MUST execute and prove:
1. **Tier 1 (Syntax & Build):** Run `npm run build` in `studio/` and confirm Exit Code 0.
2. **Tier 2 (Live Runtime & Process Synchronization):** Confirm active Express server on Port 3101 and Vite on Port 3100. Execute live `curl.exe` queries against affected endpoints with real data to confirm valid HTTP 200 responses.
3. **Tier 3 (Headless Visual & Interactive Audit):** Execute headless browser inspection (Puppeteer) across both Light and Dark modes to verify rendered data, clickability, and zero console/network crashes.

---

## 🧹 Mandatory Pre/Post-Build Ephemeral & Scrap Cleanup Gate (Zero-Stray-File Invariant)

1. **Automated Scrap Cleanup:** Every build, script execution, batch run, or route testing sequence MUST execute a cleanup pass before concluding the turn.
2. **Scan & Purge Unindexed Directories:** Automatically scan for and delete empty shell directories, test-spawned folders (e.g. unanchored `EP*` directories lacking both `01_Episode_Script.md` and `02_Prompt_Matrix.md`), temporary zip extractions, and leftover test scratch files.
3. **Backend Guard Against Phantom Creation:** All backend services and file handlers MUST validate the existence of prerequisite files or user intents BEFORE executing recursive directory creation (`mkdir({ recursive: true })`), preventing exploratory queries or route typos from creating ghost folders in the franchise repository.
4. **Zero-Pollution Handoff:** Before presenting results to the operator, verify with a direct directory inspection that zero orphaned temporary directories or scrap files exist in `01_Franchises/`.

---

## 📱 Universal Container-Fluid CSS Grid Architecture

1. **Multi-Viewport Fluidity Mandate:** All studio views must maintain 100% responsive fluid behaviour across full desktop, split-screen (50/50 alongside Google Flow at 700px–900px), and mobile viewports.
2. **Strict Ban on Rigid Viewport Breakpoint Jumps:** Strictly forbidden from using fixed-width containers (`w-[1280px]`) or non-wrapping CSS grids (`grid-cols-4` without minmax). Employ fluid auto-fill grids (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`) and flex-wrap containers with gap spacing to eliminate horizontal clipping.

---

## 🛑 The "Step-Back & First-Principles Diagnosis" Protocol (Anti-Patching Invariant)

Whenever repetitive tuning friction occurs (>2 iterations on the same sub-problem):
1. **Immediate Execution Halt:** Cease repetitive micro-patching.
2. **Step-Back Macro Analysis:** Zoom out to broader architectural and workflow levels.
3. **First-Principles Strategic Alternative:** Present a high-leverage architectural alternative rather than persevering with a fundamentally flawed premise.

---

## 🏛️ Studio Boundary & Markdown SSOT Architecture Invariant

1. **The Studio as Ingestion & Runner Engine:**
   - The Studio codebase (`studio/server`, `studio/src`) is strictly an ingestion, execution, and visual monitoring layer.
   - All series data, character rosters, thumbnail concepts, video formats, and release packaging MUST be sourced dynamically from repository markdown and JSON files (`Series_Bible.md`, `YouTube_Locked_Package.md`, `characters.json`, `01_Episode_Script.md`, `02_Prompt_Matrix.md`, `03_YouTube_Package.md`).
2. **Absolute Ban on Series Hardcoding:**
   - Strictly forbidden from adding series-specific `if/else` ladders, hardcoded series titles, character name ladders, or fallback conditionals (e.g. `isSeries01`, `includes('series_02')`, `isSeries05`) anywhere in `studio/server`, `studio/src`, or `scripts/`.
   - Any new franchise added to `01_Franchises/` must work out-of-the-box with zero application code changes by providing the required SSOT files.
3. **The Workflow Agent Isolation Law:**
   - Operational workflow agents executing `/story`, `/matrix`, `/vault`, `/thumb`, or `/launch` are **STRICTLY FORBIDDEN** from modifying Studio application code.
   - If a feature, title, or thumbnail needs locking, agents must write to the markdown SSOT files, NEVER to `packagingService.js`, `fileService.js`, or Vue components.
