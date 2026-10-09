# Session State & Master Handover: Manhwa Recap Studio
*Saved: 2026-10-09 21:28 (Conversation: 83a9a773-bad8-4476-be05-6433fed6d970)*

## 1. Executive Summary & Project Context

### 🏛️ Application & Ecosystem Identity
- **Official Application Name:** **Manhwa Recap Studio** *(legacy name "Luna" is strictly purged across all code, UI, and docs)*.
- **Project Root Directory:** [`C:\Users\MIchaelangelo\Documents\My Brand\02_Ventures & Digital Products\Manhwa Recap Studio\`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/)
- **Studio Web Codebase:** [`C:\Users\MIchaelangelo\Documents\My Brand\02_Ventures & Digital Products\Manhwa Recap Studio\studio\`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/studio/)
- **Active Series:** `Series_02_The_Omniscient_Dungeon_Sovereign`
- **Active Episode:** `EP01_The_FRank_Awakening_and_The_Plunderers_Bow`
- **Asset Scope:** 312 master scenes mapped in [`02_Prompt_Matrix.md`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_FRank_Awakening_and_The_Plunderers_Bow/02_Prompt_Matrix.md) (Format 2: 16:9 Landscape Full Bleed).
- **Active Servers:**
  - Frontend: `http://localhost:3100` (Vue 3 + Vite)
  - Backend API: `http://localhost:3101` (Express + Node.js ES Modules)

---

## 2. The Core Problem Statement & User Pain Points

The operator is generating 312 scenes for Series 02 EP01 using Google Flow (`flow.google`). Two fatal bottlenecks occurred in Google Flow's web interface:

1. **Generation Failures on Large Prompts:**
   - Prompting full 24-scene batches at once caused Google Flow's chat agent to stall, drop scenes, or crash with generation timeouts.
2. **Collection Routing Degradation (Cross-Batch Pollution):**
   - In long chat threads, after finishing Batch A, sending Batch B prompts caused Google Flow's agent to remember the prior context and dump all Batch B images into the existing "Batch A" collection, or lose track of images entirely.
3. **Manual Overhead:**
   - The operator needs an automated solution because manually copying, pasting, waiting for generation, and downloading images across 78 micro-chunks (312 scenes $\div$ 4) takes far too much manual time.

---

## 3. Chronology of Everything Attempted & Forensic Root Causes

### 🔴 Attempt 1: Browser CDP Remote Debugging Attachment (Port 9222)
- **What was attempted:** Tried attaching Puppeteer to Microsoft Edge via `--remote-debugging-port=9222` to type prompts and click Generate inside the user's running browser.
- **Why it failed (Forensic Root Cause):**
  1. *Chromium 136+ Security Lockout:* Modern Chromium/Edge explicitly blocks `--remote-debugging-port` when launched with the user's default profile (`User Data`) to prevent credential theft.
  2. *Windows Session 1 Ghost Processes:* Spawning `msedge.exe` from Node.js/PowerShell background tasks resulted in `MainWindowHandle: 0` (windowless background processes).
  3. *Workstation Lockout:* When the user clicked Edge on their Windows taskbar, Windows forwarded the request to the invisible background instance, completely locking the operator out of their browser.

### 🔴 Attempt 2: Desktop Launcher Batch Scripts (`.bat` files)
- **What was attempted:** Created `Connect-My-Main-Edge.bat` and `Launch-Flow-Browser.bat` to launch Edge with `--remote-debugging-port=9222` and a dedicated `--user-data-dir="%LOCALAPPDATA%\Microsoft\Edge\FlowProfile"`.
- **Why it failed (Forensic Root Cause):**
  1. If invisible background Edge processes were still in memory, double-clicking `.bat` still forwarded to the invisible instance, showing no window on screen.
  2. The operator explicitly commanded zero manual `.bat` file juggling.

### 🔴 Attempt 3: Managed Browser Runner (Desktop Focus Hijacking)
- **Why UI-level browser automation was abandoned:**
  - Running a visible browser window automated by Puppeteer/Playwright actively hijacks the desktop mouse, steals keyboard focus, and clashes with user input. The operator cannot use their computer for other tasks while automation runs.

### 🟢 Attempt 4: Studio Fast Dispatch Overhaul (Current Stable State)
- **What was successfully fixed:**
  1. *Terminated all ghost processes:* Cleaned up all background `msedge.exe` processes; operator's browser opens normally.
  2. *De-weaponized backend:* Removed all `taskkill`, `cmd.exe /c start`, and process-hijacking routines from `studio/server/index.js` and `studio/server/services/flowAutomationService.js`.
  3. *Fixed Fatal ReferenceError:* Single-scene copies on any row threw `ReferenceError: getShortcodeCollectionName is not defined` (fixed to `getCollectionName`).
  4. *Fixed "Batch NaN" Glitch:* Scene card headers now correctly render `Batch A` through `Batch M`.
  5. *Fixed Directives:* Removed contradictory `(such as Batch A)` negative rule.
  6. *Auto-Scroll Navigation:* Clicking any batch pill in the header table smoothly opens the drawer and auto-scrolls directly to that batch card.
  7. *Global Toast Feedback:* Instant visual confirmation when chunks or scenes are copied.

---

## 4. Current State of the Codebase & Modified Files

### Modified Files:
- [`studio/src/views/PromptMatrixView.vue`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/studio/src/views/PromptMatrixView.vue):
  - Fast Dispatch Hub with dropdown for chunk sizes (`4, 6, 8, 12, 18, 24 scenes`).
  - Sequenced "⚡ Copy Next Chunk" buttons and individual chunk pills.
  - Locked Collection Header prepended to every copy:
    `[SYSTEM DIRECTIVE: TARGET COLLECTION "Series 02 EP01 Batch [X]" | CREATE IF NOT PRESENT | DO NOT ASSIGN TO PRIOR BATCHES]`
  - Smooth auto-scrolling to selected batch card.
- [`studio/src/views/VideoStudioView.vue`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/studio/src/views/VideoStudioView.vue):
  - Harmonized `getCollectionName` to standard `Series ${sNum} EP${epNum} ${batchCode}` format.
- [`studio/server/index.js`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/studio/server/index.js):
  - Removed all aggressive process-spawning routes.
  - Active clean endpoints:
    - `GET /api/health`
    - `GET /api/flow-automation/status` (reports `mode: "fast_dispatch"`)
    - `POST /api/episodes/:franchiseId/:episodeId/automate-batch`
    - `GET /api/episodes/:franchiseId/:episodeId/automate-batch-status`
- [`studio/server/services/flowAutomationService.js`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/studio/server/services/flowAutomationService.js):
  - Streamlined service; process-killing methods removed.

---

## 5. Architectural Agreement & Operator Decision

The operator evaluated three prospective paths:
1. **Option 1 (Direct Reverse-Engineered HTTP Client / Custom MCP):** **[SELECTED BY OPERATOR]**
   - Connects directly to Google Flow's internal HTTP endpoints using the operator's Google session cookie.
   - **Zero browser windows, zero mouse hijacking, zero extra fees** (uses free Google Flow Labs access).
   - Generates chunks in the background, intercepts image URLs, and downloads them directly to `images/IMG_XXX.jpg`.
2. **Option 2 (Playwright / Browser MCP):** **[REJECTED]**
   - Hijacks desktop focus, requires browser windows, prone to Google bot detection.
3. **Option 3 (Official Google Imagen 3 API):** **[REJECTED DUE TO EXTRA FEES]**
   - Official API incurs usage costs.

---

## 6. Immediate Next Actions / Resumption Blueprint

Upon resuming in a fresh session or the next turn, execute the following steps to implement **Option 1**:

### Step 1: Capture One Sample Generation Request
- Open Google Flow ([https://flow.google](https://flow.google)) in your normal browser with DevTools open (`F12` $\rightarrow$ **Network** tab).
- Send a 1-word test prompt (e.g. `test 16:9`) and click **Generate**.
- Find the generation request in the Network log $\rightarrow$ Right-click $\rightarrow$ **Copy as cURL (bash)** or **Copy as fetch**.
- Provide that snippet to extract the exact endpoint URL, authorization headers, and JSON body schema.

### Step 2: Implement `flowHttpClient.js` in Studio Backend
- Create `studio/server/services/flowHttpClient.js` using the captured headers.
- Build the automated micro-chunk generation loop (4 scenes at a time).
- Automatically download the resulting full-resolution image URLs directly into:
  `C:\Users\MIchaelangelo\Documents\My Brand\02_Ventures & Digital Products\Manhwa Recap Studio\01_Franchises\Series_02_The_Omniscient_Dungeon_Sovereign\EP01_The_FRank_Awakening_and_The_Plunderers_Bow\images\IMG_XXX.jpg`

### Step 3: Wire to Studio UI
- Connect the **"⚡ 1-Click Background Ingest Batch [X]"** button in `PromptMatrixView.vue` to trigger `flowHttpClient.js`.
- Automatically update scene statuses to "Ready" with live image thumbnails as images land on disk.
