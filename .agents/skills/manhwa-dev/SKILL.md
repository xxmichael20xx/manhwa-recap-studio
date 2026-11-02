---
name: manhwa-dev
description: Manhwa Recap Studio full-stack engineering, Slate design system, container-fluid grids, STUDIO_SPECS stream normalizer, 3-Tier Live Verification, and scrap cleanup engine. Trigger with /studio-dev.
---

# 🛠️ Manhwa Studio Engineering & Live QA (`/studio-dev`)

## 1. Strict Context Verification & First-Principles Gate
- **Missing Context Halt:** If target view/service, API route, or bug reproduction context is missing, **HALT** and ask targeted bulleted questions via `ask_question`.
- **Step-Back Protocol (>2 Iterations):** If tuning/fixing the same issue exceeds 2 iterations, halt micro-patching and propose a macro architectural solution.

## 2. Frontend, Backend & SSOT Architecture Invariants
1. **Markdown SSOT & Zero Series Hardcoding:** Studio code (`studio/server`, `studio/src`, `studio/scripts`) is a generic runner engine. Never hardcode series titles, character names, or genre ternaries (`isFantasy ? ...`). Read all genre vocabulary, art styles, and packaging dynamically from `Series_Bible.md` (`STUDIO_BIBLE_DIRECTIVES` via `getFranchiseArtStyleDirective(franchiseId)`) and `YouTube_Locked_Package.md`.
2. **Slate Design System & Container-Fluid Grids:**
   - Enforce native Slate tokens (`bg-slate-50 dark:bg-slate-950` canvas, `bg-white dark:bg-slate-900` surfaces, `border-slate-200 dark:border-slate-800` borders) across all routes.
   - Ban fixed-width containers (`w-[1280px]`) and non-wrapping grids. Use fluid auto-fill grids (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`) and `flex-wrap` for 100% responsiveness across desktop, 50/50 split-screen (700–900px alongside Google Flow), and mobile.
   - In `PromptMatrixView.vue`, keep `Lean Mode = false` by default and unlock native `@{Character Name}` copy buttons. In `packagingService.js`, ensure 1-click title copy extracts pure unformatted strings (never `[object Object]`).
3. **Backend Guard Against Ghost Folders:** Validate prerequisite files/intent BEFORE calling `mkdir({ recursive: true })` so exploratory API calls never spawn orphan `EP*` folders.

## 3. Mandatory 3-Tier Live Verification & Scrap Cleanup (`studio/scripts/`)
Before concluding any coding turn, execute `studio/scripts/verify-live-3tier.js` and `studio/scripts/cleanup-scrap.js`:
1. **Tier 1 (Build):** Run `npm run build` in `studio/` -> confirm Exit Code 0.
2. **Tier 2 (Live API):** Verify Express (Port 3101) & Vite (Port 3100) are running; execute live `curl.exe` requests against modified routes -> confirm HTTP 200 JSON.
3. **Tier 3 (Headless Dual-Theme Visual QA):** Capture Puppeteer screenshots in both Light and Dark modes across affected routes -> confirm zero console/network errors and embed screenshots inline.
4. **Zero-Stray-File Cleanup:** Purge unindexed `EP*` folders, `.tmp/` scratch files, and empty directories in `01_Franchises/`. Conclude with the **Operator Action & Testing Guide**.
