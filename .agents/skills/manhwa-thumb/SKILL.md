---
name: manhwa-thumb
description: YouTube high-CTR visual thumbnail, badge, and locked title/description packaging engine. Enforces 3 Master visual archetypes, top-left yellow badge engine, zero-tag standard, MozJPEG <2MB compliance, and the Locked Accumulative Title & Description Invariant. Trigger with /thumb.
---

# 🖼️ Manhwa High-CTR Visual Thumbnails, Badges & Locked Packaging (`/thumb`)

> **Master SOP for 16:9 Master Thumbnails, Top-Left Part Badges & Locked Accumulative YouTube Copy**  
> **Slash Command:** `/thumb`  
> **Workspace Root:** `quirky-chandrasekhar`

---

## 🎯 Mandatory Interactive Auto-Grill Pre-Flight (`ask_question`)

Whenever `/thumb` is invoked (unless the operator explicitly specifies the target and deliverable in their prompt), initiate an interactive `ask_question` interview:

```
[Interactive Pre-Flight Alignment Modal]
1. Target Franchise & Release Target:
   - Dynamically list active franchise from 01_Franchises/ (e.g. Series 04 -> Master Omnibus (Episode 1-2) or Episode 1 Standalone)
2. Deliverable Scope:
   - Complete Launchpad (3 Thumbnails + Locked Title & Description)
   - Locked Title & Description Only (Zero Thumbnail Generation)
   - 3 Master Thumbnail Concepts Only
```

---

## 🔒 Locked Franchise Title & Description Invariant (Zero Regeneration Law)

1. **Source of Truth (`YouTube_Locked_Package.md`):**
   - Every franchise locks ONE canonical YouTube Title and ONE master YouTube Description Box inside `00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md` (established on Episode 1).
   - Agents and Studio services are **STRICTLY FORBIDDEN** from inventing new title options, generating 5 different title archetypes on subsequent episodes, or rewriting the synopsis, community question, music attribution, or disclaimer.
2. **Two-Mode Execution State Machine (First Run vs Locked Runs):**
   - **MODE A — First Run (`00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md` Does NOT Exist):**
     1. Generate the 3 Master 16:9 Thumbnail Concepts (`Concept A`, `Concept B`, `Concept C`) and draft the Episode 1 Description Box (**with ZERO chapter timestamps**).
     2. Present **strictly 3 High-CTR YouTube Title Options** (each formatted as `(Episode 1) {Base Title}`, strictly $\le 88$ characters so future `(Episode 1-12)` prefixes never exceed 100 chars) via `ask_question` for the operator to select.
     3. Immediately upon operator selection, lock the chosen canonical title, the Episode 1 description template, and the 3 thumbnail concepts into `00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md` and `EP01/03_YouTube_Package.md`.
   - **MODE B — Subsequent Runs (`YouTube_Locked_Package.md` Exists):**
     1. **Zero Regeneration:** Do NOT propose new titles, do NOT rewrite the description, and do NOT regenerate thumbnails unless explicitly asked.
     2. Read `YouTube_Locked_Package.md` and update **ONLY** the 3 dynamic slots:
        - Title prefix: `(Episode 1)` $\rightarrow$ `(Episode 1-2)` $\rightarrow$ `(Episode 1-3)` (and badge `PART 1` $\rightarrow$ `1 - 2` $\rightarrow$ `1 - 3`).
        - Runtime & Bounds from `ffprobe`.
        - Chapter Timestamps: Zero timestamps for Episode 1; plain 1-line-per-episode timestamps (`00:00 - Episode 01...`, `21:46 - Episode 02...`) for compiled uploads.
3. **Accumulative Upload Cadence:**
   - **Upload 1:** Episode 1 Standalone $\rightarrow$ Title Prefix: `(Episode 1)` $\rightarrow$ Top-Left Badge: `PART 1`
   - **Upload 2:** Episodes 1 & 2 Compiled $\rightarrow$ Title Prefix: `(Episode 1-2)` $\rightarrow$ Top-Left Badge: `1 - 2`
   - **Upload 3:** Episodes 1, 2 & 3 Compiled $\rightarrow$ Title Prefix: `(Episode 1-3)` $\rightarrow$ Top-Left Badge: `1 - 3`
   - ...and so on (`(Episode 1-N)`).
4. **Only 3 Dynamic Slots Permitted Across Uploads:**
   - **Slot 1 — Episode Numbering (`{{EPISODE_RANGE}}`):**
     * Title prefix changes strictly from `(Episode 1)` to `(Episode 1-2)`, `(Episode 1-3)`, etc., keeping the exact same base title string.
   - **Slot 2 — Runtime & Bounds (`{{RUNTIME_BLOCK}}`):**
     * Updated with exact `ffprobe` duration of the target master/omnibus MP4.
   - **Slot 3 — Chapter Timestamps (`{{TIMESTAMPS_BLOCK}}`):**
     * **Upload 1 (Episode 1 Standalone):** **ZERO TIMESTAMPS.** Omit the chapter timestamps block completely. Never invent sub-chapters, acts, or batch timestamps for a single episode.
     * **Upload 2+ (Compiled Episodes 1–N):** Include the `⏱️ CHAPTER TIMESTAMPS:` block containing **strictly 1 plain timestamp line per compiled episode** plus the finale timestamp, sourced directly from the omnibus `_metadata.json` (`ffprobe` durations):
       ```text
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       ⏱️ CHAPTER TIMESTAMPS:
       00:00 - Episode 01: {Episode 1 Title} ({Ep1 Duration})
       21:46 - Episode 02: {Episode 2 Title} ({Ep2 Duration})
       58:05 - Series Finale & Epilogue
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       ```
     * Strictly NO acts, NO batch markers, and NO internal scene sub-chapters.
5. **Pre-Delivery Diff Gate:**
   - Before outputting any title or description, diff against `YouTube_Locked_Package.md`. Any divergence outside the 3 dynamic slots above is a violation and must be rejected.
6. **Evergreen Generic Subscribe CTA Invariant (Ongoing vs Complete Series):**
   - Strictly forbidden from naming a specific upcoming episode number or title (never write `so you don't miss Episode 02: ...`).
   - **Ongoing Episode / Accumulative Compilation (`Episode 1`, `Episode 1-N`):**
     `🔔 Subscribe to the channel and turn on notifications so you don't miss the next episode!`
   - **Complete Series Marathon (`Complete Story Marathon`):**
     `🔔 Subscribe to the channel and check out our other full-length manhwa series and complete marathon sagas!`
   - **Zero Studio Application Code Mutation Law (Absolute Studio Boundary Invariant):**
     * The agent is **STRICTLY AND UNCONDITIONALLY FORBIDDEN** from modifying or patching Studio application code (`packagingService.js`, `fileService.js`, `antiSlopValidator.js`, `SeriesDetailView.vue`, etc.) when creating, updating, or locking series thumbnail concepts or packaging.
     * The Studio application is strictly an ingestion, viewer, and runner engine that consumes markdown files as the Single Source of Truth (SSOT).
     * To lock a winning canonical thumbnail, the agent MUST declare it in `00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md` and save the master thumbnail image as `01_Thumbnail_Master.jpg` (or `01_Master_YouTube_Thumbnail_16x9.jpg`) in `{episodeId}/thumbnails/`, `{episodeId}/`, or `00_Series_Bible_and_Character_DNA/`. The Studio will dynamically detect and serve it with zero code changes.

---

## 🔒 Strict Master Video Existence Gate (Zero Phantom Episodes)
1. **Verification Gate:** The agent and studio MUST verify the physical existence of `video/01_Episode_Master_1080p.mp4` on disk before proposing or naming any episode as part of an omnibus movie or multi-part badge.
2. **Dynamic Part Count:** Never hardcode episode counts. If only EP01 and EP02 have compiled master videos, the compilation is strictly **`1 - 2`** (`(Episode 1-2)`). Uncompiled episodes (e.g. EP03) must be explicitly flagged as `[Compilation Pending]`.

---

## 👥 Mandatory Multi-Character Vault Reference Invariant (Zero Generic Faces)
1. **Absolute Ban on Generic Textual Face Hallucinations:** Strictly forbidden from generating thumbnails with generic descriptions that contradict the franchise's locked Character DNA.
2. **Multi-Character Reference Plate Binding:** Whenever a thumbnail features the protagonist, antagonists, supporting cast, or boss monsters, image generation prompts MUST include `ImagePaths` pointing directly to their master vault plates in `character_vault/`.

---

## 🖼️ The Mandatory 3-Variant High-CTR Visual Thumbnail Archetypes

Whenever generating, designing, or packaging YouTube thumbnails:

### Variant A: The Split Transformation (The Underdog vs Sovereign)
- **Visual Staging:** High-contrast split-screen composition using the protagonist's locked Character DNA.
  - *Left Side (45%):* Protagonist in humble/casual attire in mundane setting.
  - *Right Side (55%):* Same protagonist in awakened Sovereign state surrounded by signature cosmic/mana glyphs and shattered relics.
- **Hook Dynamic:** Instant underdog-to-sovereign catharsis on mobile feeds.

### Variant B: The Proctor's / Scion's Panic & Measurement Overflow
- **Visual Staging:** High-tension face-off between arrogant antagonist/examiner and unbothered protagonist.
  - *Foreground:* Low-angle close-up on antagonist in cold sweat with wide horrified eyes as their sacred weapon or testing crystal shatters.
  - *Center Background:* Protagonist standing completely unbothered with a deadpan expression.
- **Hook Dynamic:** Uncontrollable curiosity.

### Variant C: The Calamity / Solo Cleave Spectacle
- **Visual Staging:** Monumental panoramic widescreen combat between protagonist and colossal boss/monolith.
- **Hook Dynamic:** Pure awe and spectacle.

---

## 🟡 Top-Left High-CTR Yellow "1 - N" Part Badge Standard

Benchmarked against top-performing manhwa recap channels:
1. **Typography:** Ultra-heavy, bold condensed font (`font-weight: 900`).
2. **Colour Palette:** Intense vibrant yellow (`#FFD700` / `#FFE600`) with a dark charcoal background pill/stroke (`#0F172A`) and subtle outer glow.
3. **Wording:** Simple, punchy **`PART 1`** (Upload 1) or **`1 - 2`**, **`1 - 3`**, **`1 - {N}`** (Accumulative Uploads).
4. **Anchor:** Anchored strictly at **Top-Left** (`x: 60, y: 60`), completely avoiding YouTube's native bottom-right video duration overlay.
5. **Dynamic Client-Side Compositing:** Master thumbnails are maintained textless on disk; the top-left yellow badge is composited dynamically on demand in the Studio Launchpad.

---

## 🚫 Zero Small Unreadable Tags (Pure Visual Storytelling Mandate)
1. Strictly forbidden from adding small text tags, coordinate dropdowns, tiny badge pills, or cluttered overlays onto thumbnails.
2. Keep the base illustration 100% textless. Badges are rendered cleanly as sharp SVG overlays during export.

---

## 📐 YouTube Technical Compliance
- **Aspect Ratio:** 16:9 Widescreen (~1920×1080).
- **File Format & Weight:** `<2 MB` MozJPEG YouTube-compliant JPG files.
- **Filenames:** `01_Thumbnail_Concept_A.jpg`, `01_Thumbnail_Concept_B.jpg`, `01_Thumbnail_Concept_C.jpg`.
