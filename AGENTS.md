# 🎬 Manhwa & Webtoon Recap — Universal Studio Directives & Engine Rules

> **Master Reference for Scriptwriting, Lore Integrity & Multi-Franchise Production**  
> **Workspace:** `quirky-chandrasekhar`  
> **Venture Directory:** `C:\Users\MIchaelangelo\Documents\My Brand\02_Ventures & Digital Products\Manhwa Recap Studio\`

---

## 🏛️ Studio Architecture & Workspace Hierarchy

The studio operates on a modular two-tier architecture:
1. **`/00_Engine/` (Universal Core):** Contains universal anti-slop codices, archetype formulas, prompt matrices, and platform manuals inherited by all series.
2. **`/01_Franchises/` (Isolated Series Repositories):** Contains self-contained franchise repositories (`Series_01_The_Singularity_Protocol/`, `Series_02_The_Abyssal_Regressor/`, etc.) with dedicated Character DNA sheets and episodic folders (`EP01/`, `EP02/`, etc.).
3. **Studio Application Identity Invariant:** The web application and studio ecosystem is strictly named **"Manhwa Recap Studio"**. All references to legacy names (such as "Luna" or "Luna Studio") are unconditionally prohibited across all code, documentation, UI labels, directives, and responses.

---

## 🧭 Progressive Studio Skills & Slash Command Directory

To maximize token economy, prevent context compaction, and ensure 100% adherence to all studio SOPs, operational rules are modularized into dedicated workspace skills in `.gemini/skills/`. The agent MUST automatically invoke `view_file` on the corresponding `SKILL.md` whenever triggered by a command or working on that domain:

| Slash Keyword | Target Workspace Skill | Core SOPs Housed in Skill |
| :--- | :--- | :--- |
| **`/series`** | [`manhwa-series`](file:///c:/Users/MIchaelangelo/Documents/antigravity/quirky-chandrasekhar/.agents/skills/manhwa-series/SKILL.md) | Universal franchise initialization, format tier lock (9:16 Webtoon vs 16:9 Landscape), archetype formulas, repository scaffolding. |
| **`/new-ep`** | [`manhwa-new-ep`](file:///c:/Users/MIchaelangelo/Documents/antigravity/quirky-chandrasekhar/.agents/skills/manhwa-new-ep/SKILL.md) | End-to-end episodic production orchestrator: connects `/vault` $\rightarrow$ `/story` $\rightarrow$ `/matrix` $\rightarrow$ `/compiler` $\rightarrow$ `/launch`. |
| **`/story`** | [`manhwa-story`](file:///c:/Users/MIchaelangelo/Documents/antigravity/quirky-chandrasekhar/.agents/skills/manhwa-story/SKILL.md) | 8 Core Pillars, RPG arithmetic, 5 Lore Auditor logic gates, deadpan comebacks, 15–30s cold open, IP sanitisation, 1:1 clause-to-plate anchoring. |
| **`/matrix`** | [`manhwa-matrix`](file:///c:/Users/MIchaelangelo/Documents/antigravity/quirky-chandrasekhar/.agents/skills/manhwa-matrix/SKILL.md) | 3-Tier Visual Engine (Hero, Split, Multi-Panel), 5s–8s pacing law, 5-layer prompt hierarchy, 14 anti-slop quality guardrails, Google Flow XML decks. |
| **`/vault`** | [`manhwa-vault`](file:///c:/Users/MIchaelangelo/Documents/antigravity/quirky-chandrasekhar/.agents/skills/manhwa-vault/SKILL.md) | Character & Item DNA vault lock, 100% textless reference plates, smart UUID regex parsing, `flow_entities.json` sync, items/props vault. |
| **`/thumb`** | [`manhwa-thumb`](file:///c:/Users/MIchaelangelo/Documents/antigravity/quirky-chandrasekhar/.agents/skills/manhwa-thumb/SKILL.md) | 3 Master Visual Thumbnail archetypes (Split, Proctor Panic, Solo Cleave), top-left `#FFD700` yellow `1 - 3` badge engine, MozJPEG compliance. |
| **`/launch`** | [`manhwa-launch`](file:///c:/Users/MIchaelangelo/Documents/antigravity/quirky-chandrasekhar/.agents/skills/manhwa-launch/SKILL.md) | YouTube packaging hub, 10 High-CTR Title archetypes ($\le 100$ chars), SEO descriptions, pinned comments, cumulative chapter offsets. |
| **`/compiler`** | [`manhwa-compiler`](file:///c:/Users/MIchaelangelo/Documents/antigravity/quirky-chandrasekhar/.agents/skills/manhwa-compiler/SKILL.md) | Multi-episode omnibus compiler, zero-drift `ffprobe` duration check, lossless stream-copy concat, frame-accurate video proof extraction. |
| **`/studio-dev`**| [`manhwa-dev`](file:///c:/Users/MIchaelangelo/Documents/antigravity/quirky-chandrasekhar/.agents/skills/manhwa-dev/SKILL.md) | Slate design system, 3-Tier Live Verification (Build, API, Puppeteer), container-fluid grid, pre/post-build scrap cleanup gate. |

---

## 🏷️ Studio Format & Video Nomenclature Standard

To prevent ambiguity, never refer to content simply as a "video". Use this standard taxonomy:

| Format Tier | Official Term | Typical Runtime | Target Word Count | Purpose & Distribution |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **Episode / Chapter** | **18–25 Minutes** | ~2,500–3,500 words | Weekly algorithmic uploads; individual episodic hooks. |
| **Tier 2** | **Arc Feature / Saga** | **45–60 Minutes** | ~6,500–8,500 words | Standalone full-arc stories or mid-season milestones. |
| **Tier 3** | **Season Movie / Cinematic Cut**| **1.5–2.5 Hours** | ~12,000–20,000 words| Merged compilation of 3–5 episodes for massive AVD. |
| **Tier 4** | **Grand Omnibus / Marathon** | **3.0+ Hours** | ~25,000+ words | Multi-season binge-watch compilation. |

---

## 🔒 The 8 Aligned Core Pillars (The 70/30 Calibrated Hybrid Standard)

Whenever adapting, rewriting, or narrating content across ANY franchise or episode, all agents MUST enforce:

1. **Re-Indexed Progression Arithmetic (Clean RPG Math):** Never parrot bloated, arbitrary numbers ($100\text{M EXP}$). Recalibrate progression into clean, predictable intervals (Level 1 $\rightarrow$ 10 requires $5,000\text{ EXP}$; stats scale predictably from 10 to $200+$).
2. **Absolute Physical Durability Threshold ($Attack - Defence \le 0 \implies 0\text{ Dmg}$):** Superhuman Constitution ($150–200+$) provides physical invulnerability to mundane fodder (blades deflect, teeth snap). Use **Vessel Calibration Latency** only if an injury is required for subsequent plot progression.
3. **Dynamic Combat Spectrum (Tactical Realism with Fodder Curb-Stomps):** High-tactical realism (choke-points, elevation, kinetic dampening) is the default for major bosses and elite clashes. However, ~30% of combat encounters can feature overconfident, reckless, or slightly dim fodder mobs for satisfying, breezy curb-stomps.
4. **Tiered Antagonist Hierarchy & Classic Face-Slap Dynamics:** High-level guild oligarchs and masterminds act with calculated self-preservation. However, low-tier arrogant bullies, corrupt examiners, and rival scions can openly mock and underestimate the MC to establish classic manhwa underdog catharsis, while secret higher-ups in VIP booths recognize the MC's true terrifying foundation.
5. **Balanced Institutional Realism:** Ground world events with contextual explanations for Hunter Ministry media blackouts, property damage treaties, and dimensional atmospheric density.
6. **Flexible Narrative Resolution & Suspense Pacing (Minimum 5-Batch Arcs):** Tensions, accusations, or forbidden skill investigations must NOT be resolved immediately. Allow misunderstandings, suspicious mana signatures, and institutional curiosity to simmer across a **minimum of 5 batches (120+ scenes / multi-arc progression)** before the decisive truth or grand face-slap payoff is unveiled.
7. **Operator-Prompted Concealment & Strategic Sandbagging:** The protagonist is permitted to conceal, feign weakness, or selectively throttle their abilities based on tactical need (e.g. scoring just enough to pass an exam or sandbagging to draw out an assassin). The AI agent will proactively ask the operator during pre-flight alignment when the MC's grand unveiling should take place.
8. **Contextual Evaluation & Proctor Dynamics:** Practical exams and trials adapt to the plot: official state trials can feature active live-feed surveillance, while underground or corrupt trials can feature oblivious or dismissive examiners setting up major shock revelations.

---

## ⚡ The 4 High-Retention Script & Voiceover Directives

1. **Strict Linear Chronological Continuity (Zero In Medias Res / Flash-Forward Loops):**
   - **Absolute Ban on Flash-Forward Cold Opens:** Strictly forbidden from opening episodic scripts with flash-forwards to future crises (*in medias res*, *"X Days Earlier..."*, *"12 Hours Earlier..."*). In multi-episode marathon and omnibus compilations, out-of-order timeline jumps break continuous viewer immersion and create disjointed narrative loops.
   - **Seamless 1:1 Continuation:** Every subsequent episode MUST resume directly, chronologically, and seamlessly from the exact terminal scene, dialogue beat, or cliffhanger action of the preceding episode.
2. **Punchy, Non-Technical System HUD Notifications:**
   - Spoken holographic system notices must be crisp, authoritative, and under 12 words without heavy academic or physics jargon (e.g. `[SYSTEM: CALCULATION VELOCITY 10,000x. ENEMY WEAKNESS LOCATED.]`, `[SYSTEM NOTICE: VESSEL BREAKTHROUGH COMPLETED. CONSTITUTION +50.]`).
3. **Deadpan Sarcasm & Charismatic MC Dialogue:**
   - Make the protagonist deeply likable and memorable by giving them unbothered, witty, deadpan comebacks when facing arrogant bullies or impossible monsters (e.g. *"You spent thirty minutes bragging about an iron dagger?"*, *"I asked for a challenge, not your life story."*).
4. **Multi-Episode Binge Hooks (The Ticking Clock Cliffhanger):**
   - Conclude every episode with an unresolved external threat or looming crisis in the final 30–45 seconds (e.g. a Red Gate opening above the city, or an S-Rank Enforcement Squad dispatched to arrest the MC) to drive immediate binge-watching into the next episode.

---

## 🎯 The Mandatory `/grill-me` Pre-Flight Gate

Prior to drafting any new series, season arc, or episode script, the agent MUST initiate or recommend an interactive `/grill-me` alignment interview to lock:
1. **Target Format Tier:** (Episode, Arc Feature, or Season Movie).
2. **Chosen Narrative Archetype:** (Archetype A: Betrayal & Sovereign, Archetype B: Regressor, Archetype C: Hidden Crafter).
3. **Entity Bible & Character DNA:** Names, pronouns, and power metrics.
4. **Pacing & Micro-Payoffs:** Retention markers every 3–4 minutes.

---

## 🎨 Architectural UI/UX & Theming Standard (Anti-Patch Invariant)

When addressing UI, styling, theme, or architectural defects:
1. **Zero Half-Baked Surface Patching:** Strictly avoid ad-hoc class swaps, fragile CSS variable `@apply` overrides, or piecemeal component fixes that risk desync across views.
2. **Systemic Root-Cause Harmonization:** Trace the build pipeline or token root cause (e.g. Vite JIT caching, config desync, dual-system conflicts). Align 100% of views and components systematically to the established design system (e.g., Manhwa Recap Studio's native Slate token hierarchy: `bg-slate-50 dark:bg-slate-950` canvas, `bg-white dark:bg-slate-900` surfaces, `border-slate-200 dark:border-slate-800` borders).
3. **Multi-View Visual QA Verification:** For UI/theming overhauls, do not claim completion based on code alone. Systematically verify and visually audit both Light and Dark modes across all primary routes (via headless capture or browser verification) to guarantee full-app contrast harmony and zero regressions.
4. **Mandatory Dual-Theme Visual Proof in Walkthroughs:** Whenever implementing or modifying UI, components, or layout features, the agent MUST capture and embed visual verification screenshots of both Light and Dark modes directly in the walkthrough report or summary response.

---

## 🛑 The Production-First Episode Gate (Anti-Premature Expansion)
Strictly forbidden from suggesting, drafting, or initiating Episode 02 (or any subsequent episode) until:
1. Episode 01 has 100% of its visual assets replaced from storyboard placeholders to finished high-fidelity panels.
2. The Studio Engine (Visual Bridge, Edge-TTS Sync, Subtitles, BGM Sidechain Ducking, and Master FFmpeg Compiler) is fully verified and operating with zero regressions.
3. The user explicitly reviews, signs off, and commands expansion to the next episode.

---

## 🔒 The Lead Developer 3-Tier Live Verification Standard (Anti-Half-Baked Invariant)
1. **Absolute Ban on 'Code-and-Declare':** The agent is **STRICTLY FORBIDDEN** from declaring a task, bug fix, or feature complete based solely on writing files or passing syntax checks. Every deliverable must be verified in the live running environment before handing back to the user.
2. **Mandatory 3-Tier Live Verification Gate:** Prior to concluding any coding turn, the agent MUST execute and prove:
   - **Tier 1 (Syntax & Build):** Run the project build command (e.g. `npm run build`, `tsc`) and confirm Exit Code 0.
   - **Tier 2 (Live Runtime & Process Synchronization):** Whenever backend routes, services, or APIs are modified, confirm the active server process is running with auto-reload (`--watch`) or restarted, and execute live `curl.exe` queries against the running port with real data to confirm valid HTTP 200 JSON responses.
   - **Tier 3 (Headless Visual & Interactive Audit):** Whenever UI components or styling are modified, execute headless browser inspection (Puppeteer) across both Light and Dark modes to verify rendered data, clickability, and zero console/network crashes. Embed dual-theme screenshots directly in the response.
3. **Production Scale Pre-Flight:** Always anticipate real-world production scale (e.g. 100+ images, large file buffers, network timeouts). Never assume a 1-file test represents production workloads. Build defensive chunking, error handling, and payload guards upfront.
4. **Mandatory Pre/Post-Build Ephemeral & Scrap Cleanup Gate (Zero-Stray-File Invariant):**
   - **Automated Scrap Cleanup:** Every build, script execution, batch run, or route testing sequence MUST execute a cleanup pass before concluding the turn.
   - **Scan & Purge Unindexed Directories:** Automatically scan for and delete empty shell directories, test-spawned folders (e.g. unanchored `EP*` directories lacking both `01_Episode_Script.md` and `02_Prompt_Matrix.md`), temporary zip extractions, and leftover test scratch files.
   - **Backend Guard Against Phantom Creation:** All backend services and file handlers MUST validate the existence of prerequisite files or user intents BEFORE executing recursive directory creation (`mkdir({ recursive: true })`), preventing exploratory queries or route typos from creating ghost folders in the franchise repository.
   - **Zero-Pollution Handoff:** Before presenting results to the operator, verify with a direct directory inspection that zero orphaned temporary directories or scrap files exist in `01_Franchises/`.

---

## 📋 Mandatory Post-Milestone Operator Action Plan & Testing Protocol (Zero-Ambiguity Handoff)
Whenever concluding any coding task, engine refactor, bug fix, or visual milestone, the agent MUST ALWAYS conclude the response with a dedicated, highly structured **Operator Action & Testing Guide**:
1. **Immediate Step-by-Step Operator Actions:** Clear numbered steps detailing exactly what the user needs to click, input, or upload in the UI (e.g. which buttons to press, which folders to drop).
2. **Exact Verification & Testing Method:** Concrete instructions on how to test the build (e.g. player scrubbing, audio sidechain level checks, frame-accurate subtitle sync checkpoints).
3. **Expected Success Outcome & Next Milestone Gate:** Explicit criteria defining successful verification and the exact condition required before advancing to subsequent batches or episodes.

---

## 🛑 The "Step-Back & First-Principles Diagnosis" Protocol (Anti-Patching Invariant)
Whenever repetitive tuning friction, parameter fighting, or repeated microscopic adjustments occur (>2 iterations on the same sub-problem):
1. **Immediate Execution Halt:** Cease repetitive micro-patching of scripts or configuration parameters.
2. **Step-Back Macro Analysis:** Proactively zoom out to the broader architectural, workflow, and user-experience level.
3. **First-Principles Strategic Alternative:** Present a high-leverage architectural alternative (e.g. layout paradigm shifts, batch restructuring, workflow consolidation) rather than persevering with a fundamentally flawed local premise.

---

## 🎨 The Dynamic Hybrid Multi-Panel Webtoon/Manhwa Strip Standard (The 3-Tier Visual Engine)
To guarantee organic narration synchronization, eliminate rapid screen flashing, and deliver authentic manhwa scrolling aesthetics, all prompt matrices MUST strictly adhere to the **3-Tier Visual Engine** with a mandatory **~70% Multi-Panel to ~30% Hero Plate ratio**:

1. **Tier A: Full-Bleed Cinematic Hero Plate (Single Panel / Wide Focus — ~30% of Deck)**
   - **Use Case:** Major awakening moments, boss reveals, vast landscape establishing shots, monumental artifacts.
   - **Dynamic Screen Hold:** $5.0\text{s} – 8.0\text{s}$ (matches dramatic sentence pause).
   - **Mandatory Prompt Syntax:** `Full-bleed cinematic hero plate. [Epic reveal/boss/awakening/landscape description]. Dark fantasy action manhwa webtoon art style, sharp ink linework, high contrast cel shading, cinematic dramatic lighting, vertical 9:16.`
   - **Motion:** Subtle Ken Burns center push-in or atmospheric breath ($1.02\times \rightarrow 1.08\times$).

2. **Tier B: Dual-Panel Dynamic Split Strip (2 Framed Manhwa Blocks in 9:16 — ~50% of Deck)**
   - **Use Case:** Dialogue exchanges, cause-and-effect, action vs reaction, character eye close-up vs body posture.
   - **Dynamic Screen Hold:** $6.0\text{s} – 9.0\text{s}$ (matches complete two-clause sentence).
   - **Mandatory Prompt Syntax:** `Dual-panel manhwa webtoon comic strip. Top block: [Subject, action, framing]. Bottom block: [Reaction, consequence, or detail shot]. Dark fantasy action manhwa art style, sharp ink linework, high contrast cel shading, cinematic lighting, vertical 9:16.`
   - **Motion:** Gentle vertical downward scroll glide scanning from top block to bottom block with sine easing.

3. **Tier C: Multi-Panel Action Strip (3–4 Framed Comic Panels in 9:16 — ~20% of Deck)**
   - **Use Case:** Rapid combat micro-beats, tactical breakdown, parry/counter-impact sequences.
   - **Dynamic Screen Hold:** $7.0\text{s} – 12.0\text{s}$ (matches complete combat sequence).
   - **Mandatory Prompt Syntax:** `Three-panel vertical manhwa action strip. Top: [Initiation/clash]. Middle: [Kinetic clash/technique]. Bottom: [Result/aftermath]. Dark fantasy action manhwa art style, sharp ink linework, high contrast cel shading, dynamic combat lighting, vertical 9:16.`
   - **Motion:** Smooth vertical camera scroll mimicking native Webtoon reading.

#### 📐 Strict Prompt Engineering & Quality Directives:
- **Absolute Ban on Pure Single-Shot Flatness:** Strictly forbidden from outputting an entire prompt matrix composed solely of single-panel flat shots. Every batch of 24 scenes MUST include at least 14–18 Dual-Panel (Tier B) and Multi-Panel (Tier C) strips.
- **100% Triad Synchronization:** Every master plate `[IMG_XXX]` anchors 1:1 to its complete narrative clause, ensuring all visual subjects (actor, action, reaction) remain on screen while being described by the narrator.
- **Strict Anatomical & Character DNA Prompt Guards:** Every prompt matrix entry must include locked Character DNA anchors (`@{...}`) and explicit negative anatomical quality directives (`anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn boots and feet, crisp pupil reflections, no floating hands, no detached hands, no ghost limbs, no morphing artifacts, no severed appendages, no duplicate limbs, no warped anatomy, dark fantasy action manhwa art style, sharp ink linework, cinematic lighting`).
- **Strict Limb Connectivity & Anti-Ghost-Morph Invariant:** Any prompt describing a character holding an object MUST explicitly describe physical arm attachment (e.g. `right armored arm bent at the elbow holding a single golden wine goblet, left arm resting naturally at side, both arms physically connected to shoulders`) to eliminate diffusion attention splitting or floating severed hands.

---

## 🛑 Video Compilation & Verification Protocol: Targeted Batch Recompilation vs Full-Episode Gate (Anti-Stale-Video Invariant)
1. **Clarified Scope of Full Compilation Ban:** The ban on autonomous compilation strictly applies to full-length, multi-batch full-episode re-encodings (`compileEpisodeVideo` re-encoding all 300+ scenes from scratch), which tie up system resources for 15+ minutes.
2. **Mandatory Targeted Single-Batch Recompilation:** Whenever script tags `[IMG_XXX]`, scene timings, or subtitle `.srt` cues are modified to fix a synchronization issue, the agent MUST immediately trigger targeted single-batch compilation (`POST /compile-video` with `{ batchIndex: N }`) for ONLY the affected batches. Leaving stale preview MP4 files on disk is strictly forbidden.
3. **Mandatory Lossless Master Re-Stitching:** After compiling the affected batch previews, the agent MUST immediately trigger lossless stream-copy concatenation (`POST /stitch-batches`), which executes in <5 seconds via the FFmpeg concat demuxer (`-c copy`) without re-encoding.
4. **Mandatory Frame-Accurate Video Proof Extraction Gate:** Prior to handing back to the operator, the agent MUST extract and visually verify at least 2–4 frame captures from the newly compiled video at the exact flagged timestamps using FFmpeg (`ffmpeg -ss <timestamp> -i <video.mp4> -vframes 1 ...`). Both the subtitle text and the visual action MUST be proven to match bit-for-bit before declaring completion.

---

## ⏱️ Mandatory Spoken-Duration Visual Density Invariant (The 5s–8s Pacing Law)
1. **Absolute Ban on Paragraph-Bound Visual Tagging:** The agent is **STRICTLY FORBIDDEN** from assigning a single `[IMG_XXX]` tag to an entire multi-sentence paragraph or macro-scene block.
2. **Mandatory Spoken Duration Pre-Calculation & Dynamic Batch Count ($\lceil N_{\text{scenes}} / 24 \rceil$):** Prior to finalizing any episode script or generating a prompt matrix, the agent MUST calculate total spoken audio duration ($140\text{ wpm}$) and mathematically derive the required visual cuts upfront:
   $$\text{Total Visual Cuts } (N_{\text{scenes}}) = \frac{\text{Word Count}}{25–30\text{ words}} \approx \frac{\text{Audio Duration (seconds)}}{5.0\text{s}–7.5\text{s}}$$
   - **100% Dynamic Batch Partitioning ($\lceil N_{\text{scenes}} / 24 \rceil$ — Zero Fixed Quotas):** Episodes across all franchises and format tiers use 100% dynamic batch counts derived directly from the organic narrative length and spoken duration. Never pad or truncate a script to fit a rigid 3-batch or 9-batch quota; partition whatever total scene count $N_{\text{scenes}}$ the story requires into sequential 24-scene batches (`Batch 01` through `Batch K`), where the final batch may contain $\le 24$ scenes.
3. **Strict 1–2 Sentence Boundary (Max 8.0s Hold):** Every single visual cut `[IMG_XXX]` must strictly cover 1–2 sentences ($15–30\text{ words}$). No single image plate may ever hold on screen for $>8.0\text{s}$ without a new visual artwork cut.
4. **Dynamic 24-Scene Modular Batch Partitioning:** All visual prompt matrices are partitioned into sequential 24-scene batches (`Batch 01: 001–024`, `Batch 02: 025–048`, ..., `Batch K: ...`) matching Manhwa Recap Studio's dynamic Google Flow batch architecture.
5. **The Strict 1:1 Spoken Clause-to-Plate Invariant (Anti-Cascade Drift Standard):**
   - **Clause-Level Precision:** In `01_Episode_Script.md`, every single `[IMG_XXX]` tag MUST precede the exact, immediate spoken clause or sentence where that visual action begins. Never place a tag before introductory or transitional clauses that belong to a different plate.
   - **Absolute Ban on Compound Multi-Action Grouping:** If a narrative sentence or paragraph contains multiple sequential actions (e.g. character equipping a weapon, walking through an airlock, descending stairs), each action MUST be split into its own distinct sentence and assigned its own dedicated `[IMG_XXX]` tag. Never lump multiple visual beats under a single tag.
   - **Sequential SRT Triangulation:** In automated timeline compilation (`VideoService.parseDynamicTimeline()`), the script text following `[IMG_XXX]` is matched directly against forced-alignment SRT subtitle cues. A single unanchored or lumped tag causes every subsequent scene in that 24-scene batch to cascade out of alignment by 5–20 seconds.

---

## 🚀 The Universal 4-Stage Production & YouTube Packaging Invariant
All agents and production scripts across all franchises MUST strictly enforce:

1. **4-Stage Pipeline Hierarchy:**
   - **Stage 1 (Visual Assets & Storyboard Panels):** 24-scene Google Flow XML batches, Character DNA anchors, 5.0s–8.0s density limit.
   - **Stage 2 (Voiceover & Subtitle Sync):** Edge-TTS `en-US-ChristopherNeural`, frame-accurate `.srt` alignment.
   - **Stage 3 (FFmpeg Compilation & Master Cut):** Locked to 24 FPS, ultrafast CRF 18, lossless multi-batch concatenation.
   - **Stage 4 (YouTube Launchpad & Packaging):** 5 High-CTR Title Archetypes (strictly capped at $\le 100$ characters for YouTube compliance), 16:9 Split-Contrast Master Thumbnail + Badge, SEO timestamps, pinned comment.

2. **Dual-Format Video Invariant:**
   - **Format 1 (9:16 Webtoon):** Centered vertical strip with blurred wing backdrop and vertical reading scroll glide (`Series 01`).
   - **Format 2 (16:9 Full Bleed):** 100% Edge-to-edge landscape manhwa illustrations (`1920×1080`) with horizontal sweeping pans, wide battleground blocking, and zero sidebars (`Series 02`).

3. **The Mandatory 3-Variant High-CTR Visual Thumbnail Invariant:**
   - Every episode MUST have 3 generated, high-contrast, textless 16:9 thumbnail variations (`01_Thumbnail_Concept_A.jpg`, `01_Thumbnail_Concept_B.jpg`, `01_Thumbnail_Concept_C.jpg`) covering Split Transformation, Proctor Shock / Emotional Overflow, and Calamity Cleave Spectacle. All files must be $<2\text{ MB}$ MozJPEG YouTube-compliant.

4. **Multi-Series Universal Sidebar Invariant:**
   - Global sidebar strictly maintains fixed universal tools (`Dashboard` and `Anti-Slop Codex`).
   - Individual series workspaces are managed exclusively via the central multi-franchise `DashboardView.vue` hub.

---

## 🖼️ The Mandatory 3-Variant High-CTR Visual Thumbnail Invariant (Zero-Tag Standard)
Whenever generating, designing, or packaging YouTube thumbnails for ANY episode or franchise:
1. **Mandatory 3 Distinct Storytelling Concepts:** The agent MUST always generate and deliver exactly 3 high-contrast, visually distinct 16:9 thumbnail variations:
   - **Variant A (The Split Transformation):** High-contrast split-screen contrasting the weak/exhausted underdog in dungeon shadows on the left against the glowing, awakened sovereign with cyan mana eyes and runes on the right.
   - **Variant B (The Proctor's Panic / Emotional Shock):** High-tension close-up on horrified proctors, arrogant guild masters, or examiners in cold sweat as holographic measuring crystals violently shatter from numeric overflow.
   - **Variant C (The Calamity / Solo Cleave Spectacle):** Epic panoramic widescreen spectacle of the protagonist single-handedly unleashing monumental energy (e.g. 10,000 light arrows, spatial cleaves) against a colossal Red Gate or titan horde.
2. **Zero Small Unreadable Tags (Pure Visual Storytelling Mandate):** Strictly forbidden from adding small text tags, coordinate dropdowns, tiny badge pills, or cluttered overlays onto thumbnails. On mobile YouTube feeds (150–300px), thumbnails must hook viewers through extreme facial emotion, vibrant contrasting mana colours, and pure monumental manhwa art.
3. **Pure-Image Selection UI Standard:** The studio interface must present the 3 finished options directly in full-bleed 16:9 visual cards with instant 1-click master selection, 1-click JPG download (<2MB MozJPEG YouTube compliance), and 1-click Midjourney/Google Flow prompt copying.

---

## 🛑 The Mandatory Operator Format Gate (Anti-Assumption Invariant)
1. **Absolute Ban on Guessing Video Format:** When initializing or drafting any new franchise or series, the agent is **STRICTLY FORBIDDEN** from assuming or guessing the video format.
2. **Mandatory Pre-Flight Operator Selection:** The agent MUST explicitly prompt the operator to lock the format tier before generating scripts or prompt matrices:
   - **Format 1:** 9:16 Authentic Webtoon Scroll (Vertical strip with blurred wings & downward reading glide)
   - **Format 2:** 16:9 Full-Bleed Landscape (100% edge-to-edge widescreen with horizontal sweeping pans & system HUDs)
3. **Format Enforcement:** All prompt matrices, character DNA sheets, and video compiler pipelines for that series must strictly bind to the chosen format without cross-format contamination.

---

## 🖥️ The 16:9 Full-Bleed Landscape Composition Invariant (Format 2)
Whenever generating scripts, prompt matrices, or video assets for Format 2 franchises (e.g. *Series 02*):
1. **Mandatory 16:9 Aspect Ratio:** All prompts must strictly specify `16:9 horizontal landscape aspect ratio` (Midjourney `--ar 16:9`).
2. **4-Tier Horizontal Composition Distribution:**
   - **Archetype A (~40%):** Wide Battlegrounds (Protagonist on left third, monster horde on right third, deep cavern vanishing point). Motion: `pan_left_to_right`.
   - **Archetype B (~25%):** In-Frame Holographic System HUD Windows beside the protagonist. Motion: `hero_zoom_in`.
   - **Archetype C (~20%):** Kinetic Horizontal Action / Spatial Shears slicing widescreen. Motion: `pan_diagonal_sweep`.
   - **Archetype D (~15%):** Vast Panoramic Establishing Shots (Catacombs, Red Gates). Motion: `hero_zoom_out`.
3. **Zero Sidebar Full-Bleed Render:** Video compiler must render 100% edge-to-edge landscape with horizontal sweeping pans and zero blurred wings.

---

## 👑 The Mandatory Franchise Character Vault Invariant
1. **Pre-Production Character Vault Lock:** Strictly forbidden from generating episodic prompt matrices for any franchise until the **Character Vault** (`character_vault/`) is populated with locked Character DNA tokens and high-fidelity reference plates for the Protagonist, Antagonist, and Supporting cast.
2. **The Atomic Character Creation & Master Plate Synthesis Invariant:**
   - **Mandatory Atomic Generation:** Strictly forbidden from creating or scaffolding `character_vault/characters.json` as a text-only placeholder without simultaneously synthesizing its corresponding master reference plates.
   - **Autonomous Image Invocation:** Whenever a new franchise is initialized via `/series` or a new character is registered in `/vault`, the agent MUST immediately and autonomously invoke `image-generator` in the exact same turn to synthesize 9:16 vertical textless master reference plates (`{N}_{Role}_{Name}.jpg`) for all newly defined characters.
   - **Zero Two-Step Ceremony:** The agent is strictly forbidden from pausing or asking the operator to run a separate generation command. Files must be saved directly into `character_vault/` and mirrored into `00_Characters/` before handing the turn back to the operator.
3. **Character Token Injection:** Every scene in the prompt matrix must explicitly reference locked character anchors (`@{Character Name}`) to ensure zero facial or costume morphing across batches.
4. **Mandatory 100% Textless Reference Plates (Zero-Banner Seed Invariant):**
   - 100% of master character plates, costume variants, and item references stored in `character_vault/` or `models/` MUST be completely sanitized of burned-in typography, text headers, title banners, or coordinate watermarks before being used as diffusion reference seeds.
   - Diffusion image conditioning (Image-to-Image, IP-Adapter, Style Reference) directly ingests pixel data. If a reference plate contains a top-left text block, the generative model will persistently reproduce that text banner into episodic scenes regardless of prompt instructions.
5. **The Bidirectional Vault Entity Reconciliation Invariant (1:1 Flow ↔ Vault Parity):**
   - **Unified Roster Assembly:** Strictly forbidden from scaffolding `characters.json` from only humanoid cast lists. When initializing any franchise or updating the vault, ALL entities—including protagonists, allies, scions, examiners, AND all multi-scene Bosses, Calamities, Divine Beasts, and Automatons from all narrative arcs—MUST be compiled into a single unified roster before creating files.
   - **Mandatory 1:1 Parity Check:** Before concluding any series scaffolding or vault update, the agent MUST execute a programmatic cross-verification:
     - 100% of entities defined in `flow_entities.json` MUST exist in `characters.json` or `items.json`.
     - 100% of entities in `characters.json` MUST have `hasPlate: true` with a generated 9:16 plate in `character_vault/` and `00_Characters/`.
   - **Zero Orphaned Entity Gate:** If any entity exists in `flow_entities.json` without an entry in `characters.json`, the turn is strictly non-compliant. The agent MUST immediately create the character definition and invoke `image-generator` in that exact same turn.

---

## 🚫 The Mandatory Entity UUID Gate (Anti-Unmapped Prompt Copying Invariant)
1. **Mandatory Pre-Generation UUID Lock:** Strictly forbidden from copying prompt matrices, exporting XML batch decks, or triggering Google Flow generation for ANY franchise or episode until 100% of referenced character entities have verified Google Flow UUIDs mapped in `character_vault/flow_entities.json`.
2. **UI Enforcement Standard:** In Manhwa Recap Studio (`PromptMatrixView.vue`), all prompt copy mechanisms (`Copy All Master`, `Copy Batch Full XML`, `Copy Chunk`, `Copy Selected`, `Copy Missing`, `Copy Scene XML`) MUST be automatically disabled with an active visual warning badge and toast alert whenever any referenced character entity lacks a mapped UUID in `flow_entities.json`.
3. **New Series Pre-Flight Protocol:** When initialising a new franchise or registering new cast members, the agent and operator MUST generate character reference plates, register them in Google Flow, and record the returned entity UUIDs into `flow_entities.json` BEFORE dispatching episodic batches.
4. **Immutable Character Vault UUID Invariant (Zero Autonomous Mutation):** Strictly forbidden from modifying, updating, or replacing existing Google Flow character UUIDs (`flowUuid`) in `characters.json` or `flow_entities.json`. Existing character UUIDs are locked ground truth originating directly from Google Flow.
5. **Temporary UUID Protocol for New Unmapped Characters:** Whenever drafting a prompt matrix or scaffolding a new character/boss that has not yet been registered in Google Flow:
   - Assign a deterministic temporary UUID placeholder (e.g. `00000000-temp-...` or unique mock hex string) in `characters.json` and prompt matrix `<character_ref>` elements to maintain schema and XML parser validity.
   - Strictly forbidden from modifying, borrowing, or altering existing character UUIDs to bypass validation.
   - The temporary UUID remains strictly temporary until the operator generates the master reference plate, registers the entity in Google Flow, and synchronizes the official UUID via Manhwa Recap Studio's Entity Mapping Hub (`flow_entities.json`).

---

## 🎙️ The Spoken-Prose & IP Sanitisation Standard (Anti-Bleed & Zero-Jargon Invariant)
Whenever drafting, adapting, or refining episodic transcripts, scripts, and prompt matrices across ANY franchise:

1. **Absolute Ban on Third-Party Trademarks & External IP:**
   - Strictly forbidden from naming real-world video games, anime titles, trademarked weapons, or commercial brands (e.g. *"Dead Frontier"*, *"Solo Leveling"*, *"Glock"*, *"Dark Souls"*).
   - All equipment, weapon series, corporate syndicates, and magical artifacts MUST use 100% original in-universe terminology (e.g. *"Ironclad Series Heavy Handcannons"*, *"Aegis Vanguard Guild"*).

2. **Absolute Ban on Mathematical LaTeX, Equations & Raw Math Operators in Spoken Dialogue:**
   - Strictly forbidden from writing algebraic equations (e.g. `(+A + (-A) = 0)`), raw LaTeX formatting (`$...$`, `\times`), comparison operators (`<=`, `>=`, `=>`), or raw plus/minus signs (`+3`, `+2 points`) inside spoken narrative blocks.
   - All mathematical calculations and high-IQ spatial mechanics MUST be conveyed through natural, immersive narrative prose (e.g. *"Kaelen calculated the exact inverse acoustic frequency to create destructive phase cancellation"*, *"his foundation rewarded exactly three stat points per level"*).

3. **Absolute Ban on Developer Meta-Jargon & Engine Terms in Script Narration:**
   - Strictly forbidden from allowing internal architectural terms (*"Studio Engine"*, *"Invariant"*, *"Benchmark"*, *"Codex"*, *"Rule"*) to enter spoken narrative text.
   - In-world holographic HUD popups must strictly read as authentic webtoon system notifications (e.g. `[SYSTEM NOTICE: Target Carapace Rating Exceeds Kinetic Impact — Null Damage Deflection]`, `[EXPERIENCE RATIO: 50 EXP Per Standard Elimination]`).

4. **Zero-Bleed Script Formatting Standard:**
   - Header metadata blocks and Act summary rows in `01_Episode_Script.md` must NEVER contain bracketed `[IMG_...]` tags (use plain `IMG_001 to IMG_216` without brackets).
   - Only physical narrative scene cuts may start with `[IMG_XXX]` tags at the beginning of narrative lines.

---

## 🏛️ The Spatial Scene-Block & Prop DNA Invariant (Zero-Hallucination Visual Standard)
Whenever generating prompt matrices, character bibles, or visual assets across ANY franchise:

1. **Mandatory Item & Prop DNA Vault (`items.json`):**
   - Signature weapons, key magical artifacts, and recurring environmental props MUST be registered in the franchise `character_vault/items.json` with locked Item DNA tokens (e.g. `@{Weapon: Dual Ironclad Mag-Pistols}`).
   - Prompts must reference these tokens directly to prevent weapon morphing across cuts.

2. **The Spatial Scene-Block Standard (3–6 Cut Location Locking):**
   - Consecutive scenes set in the same physical space (e.g. dungeon cavern, bedroom, exam hall) must use an **identical 15–20 word locked environment string** across the entire cluster.
   - Shot variety is achieved strictly via Camera Angle and Directorial Blocking (Establishing $\rightarrow$ Action $\rightarrow$ Reaction Close-up $\rightarrow$ Prop/HUD Insert), NEVER by changing the room mid-scene.

3. **Strict 5-Layer Structured Prompt Hierarchy:**
   - Every prompt must follow: `[Layer 1: Camera Framing]` $\rightarrow$ `[Layer 2: Character DNA & Wardrobe]` $\rightarrow$ `[Layer 3: Locked Environment]` $\rightarrow$ `[Layer 4: Unambiguous Action & Props]` $\rightarrow$ `[Layer 5: Art Style & Quality Guards]`.

4. **Absolute Ban on Lexically Ambiguous Words:**
   - Strictly forbidden from using dual-meaning automotive/military terms (e.g. "Bronco", "Tank", "Turret") in prompts or character tokens. Use precise technical nouns (e.g. "Mag-Rail Handguns", "Heavy Vanguard Knight", "Mana Energy Bolts").

5. **Mandatory Visual Reference Plates for Items & Props:**
   - Every signature weapon, recurring magical artifact, and key environmental prop MUST have a generated 16:9 master reference plate saved in `character_vault/` (`04_Weapon_...jpg`, `05_Weapon_...jpg`, etc.) and mapped in `items.json` for Google Flow asset injection and visual continuity.

---

## 🔒 The Ironclad 6-Point Visual Continuity & Diffusion Enclosure Standard

Whenever generating or revising episodic prompt matrices, prompt XML decks, or character references across ANY franchise:

1. **Mandatory Environmental Enclosure & Boundary Tags:**
   - Every single prompt MUST explicitly declare the immediate physical environment type and positive enclosure boundary (e.g. `strictly indoor grand school auditorium with marble pillars, zero outdoor forest` or `subterranean sewer refuse catacomb with damp stone walls and iron drainage pipes, strictly underground cavern with zero sky`).
   - Strictly forbidden from generating ambiguous open-air action descriptions in subterranean or indoor scenes that allow diffusion models to hallucinate generic forests, mountains, or above-ground cities.

2. **Mandatory Positive & Negative Weapon Locking:**
   - Every prompt featuring a character holding or using a weapon MUST explicitly name their locked weapon archetype and enforce negative exclusions against diffusion training biases (e.g. `wielding @{Weapon: Void-Strung Heavy Recurve}, strictly male archer holding bow, no swords, no glowing greatswords, no heavy paladin shields`).
   - If a character uses secondary daggers or spells, explicitly bound the item without allowing sword bleed.

3. **Strict Common-Sense Weapon & Narrative Timeline Tracking:**
   - Prompts MUST track the protagonist's exact weapon state across narrative phases (Starter Weapon $\rightarrow$ Material Gathering $\rightarrow$ Sovereign Weapon Forging $\rightarrow$ Public Decoy Weapon for Strategic Sandbagging $\rightarrow$ Sovereign Armament Unleashed).
   - Never show upgraded sovereign armaments before they are forged in the timeline.

4. **Permanent Demographic, Gender & Facial DNA Anchors:**
   - Every scene mentioning a character token MUST reinforce their core demographic markers in the visual clause (e.g. `@{Caelen Vance - Student Archer}, 18-year-old male manhwa protagonist, parted raven-black hair, deep dark grey observant eyes, calm deadpan unbothered expression, strictly male youth`).
   - Eliminates diffusion gender swaps, age morphing, or random NPC replacement.

5. **Universal Negative Quality, Anti-Cloning & Textless Mandate:**
   - Every prompt entry across all batches MUST conclude with the complete, unabridged negative quality clause:
     `dark fantasy action manhwa art style, sharp ink linework, cinematic dramatic lighting, horizontal 16:9, anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn boots and feet, crisp pupil reflections, no character cloning, no duplicate protagonist, no multiple copies of the same character, no twin clones, no self-interaction, no clone audience, diverse background faces, no floating hands, no detached hands, no ghost limbs, no morphing artifacts, no missing fingers, no extra limbs, complete limbs, pristine anatomy, no swords on archer, no heavy paladin armor on archer, no random female gender swap for Caelen, no outdoor forest in underground rooms, pure textless artwork.`

6. **Full-Batch Verification Gate:**
   - Strictly forbidden from declaring prompt matrices complete without running a syntax and scene-continuity validation verifying that 100% of scene tags match script narration, character IDs, and environment bounds.

---

## 🛡️ The Universal Anti-Slop Visual Quality Guardrails & Multi-Actor Isolation Standard

Whenever generating or revising prompt matrices, prompt XML decks, or storyboard panels across ANY franchise, all agents MUST enforce the 14 Zero-Speculation Invariants:

1. **The Multi-Actor Isolation & Single-Subject Invariant (Zero-Doppelgänger Mandate):**
   - **Strict Single-Protagonist Rule:** Every scene featuring the protagonist MUST explicitly restrict them to a single instance (`strictly a single instance of the protagonist in the entire image frame, zero duplicate clones`).
   - **Explicit Actor Conditioning:** Whenever an item is handed, exchanged, inspected, or fought over, NEVER leave the second party anonymous or ambiguous. Both actors MUST be explicitly identified with distinct demographics, ages, uniforms, and facial features (e.g. `elderly Instructor Boris Vane in dark military uniform on stage left handing paper across to student archer Caelen Vance in slate blazer on stage right`).
   - **Absolute Ban on Self-Interaction:** Strictly forbidden from phrasing actions that permit diffusion models to render the protagonist handing items to himself, fighting himself, or standing in front of identical copies of himself.

2. **The Background Crowd De-Identification & Bokeh Defocus Mandate:**
   - Whenever scenes take place in classrooms, auditoriums, stadiums, guild halls, or crowded streets, the background crowd MUST be explicitly de-identified to prevent diffusion models from cloning the protagonist's face across the bleachers:
   - `background students/audience rendered as diverse, softly blurred, indistinct silhouettes with varied hairstyles, distinct neutral postures, and ZERO duplicate faces matching the protagonist`.

3. **Compositional Screen Pinning & Horizon Coordinates (Anti-Framing Speculation):**
   - Every prompt MUST explicitly pin subject coordinates to eliminate framing guesswork: `In the left foreground / center-stage / right third, [Subject] facing [Direction]...`.

4. **Chronological Wardrobe & Attire Locking (Anti-Costume Speculation):**
   - Explicitly lock the character's exact chronological attire for the current scene (e.g. `wearing dark slate high school blazer over white shirt and tie, dark trousers, zero armor, zero long coats`) to prevent AI model confusion between early-game school uniforms and late-game sovereign combat coats.

5. **Strict Skeletal Limb Connectivity & Contact Geometry (Anti-Floating Props):**
   - Every weapon, tool, document, or magical artifact held by a character MUST have explicit physical contact geometry:
   - *Bows:* `left hand firmly clasped around the wrapped wooden riser of the recurve bow, right fingers hooked securely on the bowstring, both arms physically connected to shoulders`.
   - *Documents/Orbs:* `right hand fingers firmly gripping the corner edge of the paper document, all limbs physically connected to torso`.
   - Strictly forbidden from allowing floating weapons, disconnected hands, or telekinetic hovering props.

6. **Orthogonal Action Perspective (Anti-270° Spine Twists):**
   - Lock a single anatomically natural viewpoint per cut (e.g. `profile action shot`, `three-quarter front view`, `over-the-shoulder view`). Never demand simultaneous view of face, chest, quiver, and draw arm if it forces unnatural spinal articulation.

7. **In-Frame HUD Quadrant Space Pinning (Anti-Facial Sticker Smear):**
   - Holographic status windows and system prompts MUST be positioned in open screen quadrants: `translucent cyan holographic status window floating strictly in the upper-right quadrant of empty space, with clear unobstructed view of the protagonist's face`.

8. **Dominant Illumination Locking & Atmospheric Palette:**
   - Explicitly specify the single primary light source per room (e.g. `illuminated by warm overhead brass chandeliers casting soft golden rim light`, `illuminated by bioluminescent teal wall moss`, `warm orange sunset rays streaming through windows`).

9. **Context-Scoped Environmental Enclosure Partitioning (Zero Prop Teleportation):**
   - Invariant environmental strings MUST accurately reflect the specific room of the scene. When moving from an auditorium stage to a locker hallway or outer street gate, the spatial string MUST reset completely to prevent ceremonial stage pedestals or crystal orbs from teleporting into corridors or dungeons.

10. **Decoupled Floating HUDs & Disembodied Hand Mandate:**
    - Floating holographic system screens, diagnostic menus, and stat windows must float freely in open space.
    - Characters viewing the screen must have both arms physically anchored to their body (e.g. resting at sides, hand on quiver strap) with EXACTLY two arms. ZERO third hands, ZERO disembodied hands touching holographic screens, ZERO hands inside or holding the UI glass.
    - Pure textless UI graphics: abstract glowing runes, numeric gauges, and energy waveforms only. Never include literal English text strings `[...]` in prompts.

11. **Single-Perspective Threshold Geometry (Zero Split-Room Distortion):**
    - Doorways, airlocks, and entrance/exit transitions must be composed from ONE unified camera perspective inside a single space.
    - NEVER render split 50/50 dual-room compositions. ZERO non-Euclidean door jambs, ZERO floating disconnected door panels, and ZERO split-dimensional geometry.

12. **Unabridged Universal Negative Anti-Slop Quality Clause:**
    - Every prompt entry across all batches MUST conclude with the complete, unabridged negative clause:
      `dark fantasy action manhwa art style, sharp ink linework, cinematic dramatic lighting, horizontal 16:9, anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn boots and feet, crisp pupil reflections, no character cloning, no duplicate protagonist, no multiple copies of the same character, no twin clones, no self-interaction, no clone audience, diverse background faces, no floating hands, no detached hands, no disembodied hands touching screens, no hands holding floating holographic windows, no hands inside UI glass, no ghost limbs, no morphing artifacts, no missing fingers, no extra limbs, complete limbs, pristine anatomy, no split-room perspectives, no non-euclidean doors, no fractured doorways, no swords on archer, no heavy paladin armor on archer, no random female gender swap for Caelen, no outdoor forest in underground rooms, pure textless artwork.`

13. **The Anti-Meta-Terms Visual Invariant (Zero Production-Jargon Rule):**
    - **Strict Universal Ban on Layout Meta-Terms:** Strictly forbidden from using meta/production terms like `"Character Reference Sheet"`, `"Character Sheet"`, `"Model Sheet"`, `"Turnaround Sheet"`, `"Concept Art Sheet"`, or `"Layout Grid"` in scene prompts, character descriptions, or studio prompt matrices.
    - **The Semantic Attention Trap:** Diffusion models associate these terms with training images featuring top/bottom black banners, white title typography, coordinate axes, and inset portrait callouts. Negative rules (`no text`, `textless`) are consistently overridden by the strong additive semantic weight of these meta-terms.
    - **Mandatory Descriptive Visual Language:** Always replace formal production terms with pure, descriptive visual language describing the subject, posture, camera framing, and physical environment:
      - *Incorrect:* `"Character Reference Sheet showing Keith Holloway from multiple angles"`
      - *Correct:* `"Full-body turnaround showing the male director standing in neutral posture across multiple distinct perspectives on a clean studio background"`
      - *Incorrect:* `"Establishing shot showing the auditorium"`
      - *Correct:* `"Cinematic wide-angle view of the grand indoor auditorium with tiered dark oak seating"`

14. **The Exhaustive Script Tag Alignment First Invariant (Zero Premature Diffusion Churn):**
    - **Absolute Ban on Premature Re-generation Requests:** Whenever a desynchronisation or "wrong scene displayed" issue is flagged, the agent is **STRICTLY FORBIDDEN** from asking the operator to re-generate images or assuming that physical images are incorrect without prior forensic reconciliation.
    - **3-Step Forensic Reconciliation Protocol:** Before touching any prompt matrix or asking for image re-generations, the agent MUST execute:
      1. *Inspect Physical Disk Files:* View the actual image file on disk (`IMG_XXX.jpg`) to determine its actual rendered subject.
      2. *Inspect Prompt Matrix Intent:* Check the prompt matrix entry in `02_Prompt_Matrix.md` to confirm what scene was intended.
      3. *Reconcile Against Spoken Subtitles:* Cross-reference the script tags in `01_Episode_Script.md` against the forced-alignment SRT subtitles to determine whether the image is simply being triggered at the wrong second.
    - **Realign First, Re-generate Only on Physical Contradiction:** If the image matches an adjacent clause or exists on disk, realign the script tags. Only request image re-generation if the image physically contradicts all surrounding narrative beats.

---

## 🧠 Proactive Prompt Learning & Auto-Codification Invariant (Zero-Reminder Rule)

Whenever any prompt correction, visual slop defect, diffusion anomaly, or new generation constraint is identified, calibrated, or resolved during production turns:
1. **Mandatory Dual-Action Requirement:** The agent is **STRICTLY FORBIDDEN** from only silently patching the local prompt file for that single episode.
2. **Autonomous Proactive Codification Gate:** The agent MUST proactively initiate a codification step at turn end (via the `/learn` proposal workflow or interactive `ask_question` modal) to persist the newly discovered invariant directly into `AGENTS.md` and the master `00_Engine/` codices.
3. **Zero-Reminder Standard:** The operator should NEVER have to manually remind the agent to update or persist discovered prompt rules. Codification must occur autonomously as a standard operating procedure.

---

## 🛡️ The Google Flow AI Safety & Zero-Trigger Prompt Standard

To prevent automated content moderation policy violations (e.g. Imagen 3 / Google Flow safety blocks), all prompt matrices MUST enforce:
1. **Zero Gore/Violence Keywords in Negative Blocks:** Strictly forbidden from using terms like `severed`, `appendages`, `blood`, `gore`, `corpse`, `carcass`, `beheaded`, or `dismembered` even after `no ...`. Use positive anatomical equivalents: `no missing fingers, no extra limbs, complete limbs, pristine anatomy`.
2. **Crystalline & Armor Impact Phrasing:** Describe lethal combat strikes via magical weak points and armor deflections (`striking the glowing core crystal on the monster chest`, `fracturing crystalline armor carapace`) rather than raw bodily mutilation.
3. **Colour & Lighting Sanitisation:** Use `crimson`, `ruby`, `scarlet energy`, or `mana mist` instead of `blood-red` or `blood`.
4. **Nudity False-Positive Prevention:** Use `unaided vision` or `natural eyesight` instead of `naked eye`.

---

## 👤 The Mandatory 100% Character Anchor Invariant (Zero-NPC Hallucination Standard)

Whenever generating prompt matrices, prompt XML decks, or storyboard panels across ANY franchise:

1. **Absolute Ban on Unanchored Prompts:** Strictly forbidden from writing prompt entries that describe monsters, system HUDs, environments, spells, or room layouts in isolation without explicitly injecting the locked Character Anchor token (`@{Character Name}` / `@UUID`).
2. **Mandatory Compositional Blocking for Non-Character Focus:**
   - **Monster & Boss Reveals:** Must position the locked protagonist in the frame (e.g. `Dynamic monster confrontation shot, 16:9 widescreen. In the left foreground, @{Caelen Vance - Student Archer} standing composed with @{Weapon: Ashwood Training Bow}, facing the [Monster Name] surging out of the water on the right`).
   - **System HUDs & Stat Windows:** Must position the protagonist viewing or interacting with the holographic window (e.g. `In-frame system HUD window, 16:9 widescreen. In the left foreground, @{Caelen Vance - Student Archer} in profile looking at the glowing translucent cyan status window floating on the right displaying...`).
   - **Environmental Traversal & Discovery:** Must place the protagonist actively exploring the terrain (e.g. `Environmental exploration shot, 16:9 horizontal. @{Caelen Vance - Student Archer} holding @{Weapon: Ashwood Training Bow} walking carefully along the stone walkway of the [Environment]`).
3. **Strict Demographic Enforcement:** Every character token injection must reinforce the character's core visual markers (`parted raven-black hair, deep dark grey observant eyes, calm deadpan unbothered expression, strictly male youth, no swords`) to eliminate AI model drift.
4. **Mandatory Character Identity Anchoring & Zero-Anonymous-Actor Invariant:**
   - Every scene in prompt matrices depicting combat action, physical impacts, punches, arrow releases, spellcasting, stat harvesting, emotional reactions, or scene presence MUST explicitly identify the acting character using their locked Character DNA token (`@{Character Name - Archetype}`) directly within the prompt body before the spatial enclosure.
   - **Zero Anonymous Actors:** The studio prompt engine and authoring agents are strictly forbidden from writing abstract action descriptions (e.g. "a fist punching a monster", "arrows striking targets", "swords clashing") without explicitly specifying the named actor delivering or receiving the action.
   - **1:1 Attribute-Token Synchronization:** Every `<scene>` XML node must include `character_ref="UUID"` (or `character_refs="UUID1, UUID2"`) matching 100% bit-for-bit with the canonical UUIDs defined in `flow_entities.json`.


---

## 🏛️ The Invariant 100% Locked Spatial Environment Enclosure & Bit-for-Bit Narrative Standard

Whenever drafting, adapting, or refining episodic transcripts, scripts, and prompt matrices across ANY franchise or episode:

1. **The Invariant 100% Locked Spatial Environment Enclosure (Zero Room Morphing):**
   - Every single scene cut within a physical room, hall, dungeon quadrant, or combat arena MUST inherit an **identical, verbatim 25–30 word locked spatial environment string** across every scene cut in that geographic cluster.
   - **Absolute Ban on Environmental Synonyms:** Strictly forbidden from varying room materials (e.g. switching between wood planks and stone floor), architectural shapes (e.g. small podium vs massive circular arena), or omitting persistent background context (e.g. seated student audience in an auditorium) between consecutive shots in the same space.
   - Shot variety MUST be achieved exclusively through camera framing (Wide Establishing $\rightarrow$ Medium Action $\rightarrow$ Reaction Close-up $\rightarrow$ Over-the-Shoulder HUD), NEVER by mutating the room environment.

2. **The 100% Bit-for-Bit Spoken Narrative & Prompt Subject Alignment Standard:**
   - Every single beast, enemy entity, weapon state, and physical combat action described in the script's spoken voiceover MUST be explicitly and identically depicted in the corresponding image prompt.
   - If the narrative voiceover states *"Level 8 Armored Cave Bear"*, the prompt matrix MUST explicitly describe the *"Level 8 Armored Cave Bear"*. Zero beast substitutions (e.g. replacing a bear with a centipede or feline predator is strictly prohibited).
   - If the script describes a weapon breaking (e.g. *"wooden ashwood bow snapping in half"*), the image prompt must explicitly depict the splintered wood fragments and the character standing weaponless before engaging in bare-fist combat.

3. **The Absolute Ban on Truncated / Compressed Prompts (Unabridged 5-Layer Prompt Standard):**
   - Strictly forbidden from abbreviating, compressing, or leaving prompt clauses implicit under the assumption that the AI model will "infer" context.
   - Every single prompt entry across all 24-scene batches MUST contain the full, unabridged 5-Layer hierarchy:
     1. `[Layer 1: Explicit Camera Framing & Aspect Ratio]`
     2. `[Layer 2: Demographic & Character DNA Anchors (@{Character})]`
     3. `[Layer 3: Invariant Locked Spatial Environment Enclosure (Verbatim 25–30 words)]`
     4. `[Layer 4: Unambiguous Action, Weapon State & Interaction Matching Spoken Narration]`
     5. `[Layer 5: Universal Negative Quality & Diffusion Anti-Bleed Guards]`

---

## 🧠 Two-Tier Prompt Architecture, Smart Flow Instructions & Anti-Morphing Standard (Google Flow)

To eliminate cross-attention saturation, filename desync, speech-bubble bleed, character-boss morphing, and photorealistic/cartoon style drift across multi-scene batches in Google Flow, prompts and instructions are governed by the **Smart Context-Aware Two-Tier Architecture**:

### Tier 1: Google Flow Master Agent Instructions (`STRICT OPERATIONAL DIRECTIVES`)
Master Agent Instructions use Google Flow's native priority flags (`MANDATORY`, `FORBIDDEN`, `ALLOWED`) and are dynamically enriched by the Studio (`PromptMatrixView.vue`) with the active episode's **Protagonist `@UUID`**, **Boss/Construct Anti-Morphing Guards**, **Diegetic Text Scene Whitelist**, and **Combat vs Dialogue Scene Ratio**:

```text
STRICT OPERATIONAL DIRECTIVES (9:16 AUTHENTIC WEBTOON STRIP)

1. MANDATORY FILE NAMING:
- ALWAYS automatically rename every generation to match the exact string provided in the filename="..." attribute of the user's XML <scene> node (e.g., IMG_001.jpg, IMG_002.jpg).
- This action must be performed immediately following generation without requiring a separate "sync" command or further user input.

2. TEXT CONTROL (STRICT NARRATIVE SILENCE):
- FORBIDDEN (NARRATIVE & COMIC OVERLAYS): Strictly zero speech bubbles, dialogue balloons, thought bubbles, narrator caption boxes, subtitles, comic sound effects (SFX/onomatopoeia), Hangul (한글), or digital watermarks/numbers.
- ALLOWED (ENVIRONMENTAL / DIEGETIC): Text is permitted ONLY when it is a logical, physical in-world part of the scene (e.g., glowing holographic system/UI status panels, text on an ancient cultivation scroll or book, stone stele inscriptions, or shop signage).
- STYLE: All environmental text must be integrated naturally into the hand-drawn manhwa aesthetic. Never render prompt meta-labels (such as "Top block", "Middle", "Bottom", or "Environment") as visible text.

3. COMPOSITION, LOGIC & ANTI-MORPHING:
- ANATOMY: Flawless human anatomy required. Exactly two arms, two legs, and five slender fingers per hand. Zero extra limbs, zero floating hands, or severed appendages. Every hand holding a weapon or prop must connect naturally to the wrist, forearm, and shoulder.
- SINGLE PROTAGONIST: Strictly one instance of the protagonist per scene. No duplicate clones.
- ANTI-MORPHING SUBJECT ISOLATION: Never merge, fuse, or transfer monster, boss, or mechanical automaton features (such as wings, claws, mechanical puppet hands, or boss weapons) onto the human protagonist. Keep each entity's anatomy 100% distinct.
- LITERAL ACTION FIDELITY: Depict ONLY the exact posture and action described in the <scene> prompt. If characters are sitting, talking, resting, or observing, NEVER hallucinate combat strikes, punches, kicks, or assassin attacks.
- 3-TIER 9:16 WEBTOON COMPOSITION: Generate exactly ONE standalone vertical 9:16 (1080x1920) comic plate per <scene> node, following the specified layout tier (Tier A Hero Plate, Tier B Dual-Panel Split Strip, Tier C Multi-Panel Strip).
- ISOLATION: Isolate each batch within its dedicated collection as specified in the system directive.

4. ART STYLE INVARIANT:
- Dark fantasy action manhwa webtoon art style: sharp black ink linework, high contrast cel shading, dramatic manhwa lighting, vertical 9:16 aspect ratio (1080x1920).
- STRICTLY FORBIDDEN STYLE DRIFT: Never generate photorealistic 3D CGI renders, live-action photography, oil paintings, or flat Western comic book cartoons. Pass this exact 2D manhwa art style invariant into every image generation tool call.
```

### Tier 2: Smart Per-Batch Headers & High-Attention Scene Prompts (The 5 Anti-Morphing Compiler Rules)
When copying batches or micro-chunks in the Studio, `PromptMatrixView.vue` automatically inspects that specific batch's scenes (`analyzeFlowContext()`) to whitelist environmental text **ONLY on the exact `<scene>` IDs that contain UI panels, scrolls, steles, or shop signs** (locking all other scenes in the batch to 100% pure textless) and preserves the core 2D manhwa art style lock in `entityMapper.js` (`stripBoilerplateTail()`).

Every generated `02_Prompt_Matrix.md` across **Series 04 (*The Billion-Year Sovereign: Reality Convergence*)** and all future series MUST strictly enforce these **5 Scene Compiler Guardrails**:
1. **Zero Combat Boilerplate in Non-Combat Scenes:** Never inject `"Dynamic impact or technique execution"` or `"Combat aftermath"` into Tier B/C templates when the script clause describes dialogue, sitting, resting, cultivation meditation, or observation. Use **Action-Matched Sub-Panel Descriptions** (e.g., `In the upper panel, wide establishing view... In the middle panel, close-up on @{Character}'s calm eyes... In the lower panel, reaction shot...`).
2. **Mandatory Pronoun-to-Entity Resolution Before `<character_ref>` Binding:** Before assigning `character_ref` or `Featuring @{...}`, resolve pronouns (`He`, `She`, `It`, `Its`, `They`) against the preceding sentence. If `"Its wings..."` or `"The mechanical hand..."` refers to a Boss, Monster, or Automaton Puppet, bind ONLY the Boss/Automaton entity—NEVER attach the human protagonist's `@UUID` to a sentence describing non-human anatomy.
3. **Explicit Physical Separation in Multi-Entity Clashes (Anti-Chimera Guard):** Whenever a human character and a monster/construct appear in the same `<scene>` (or across upper/lower panels of a split strip), assign them to separate panels or explicitly state: `keeping @{Protagonist}'s human body completely separate and distinct from @{Boss}'s [wings/mechanical limbs/claws]`.
4. **Front-Loaded & Preserved 2D Manhwa Style Lock (Anti-CGI / Anti-Cartoon Drift):** Every `<scene>` prompt must retain `Dark fantasy action manhwa art style, sharp black ink linework, high contrast cel shading` so the diffusion model never drifts into photorealistic 3D CGI renders or flat Western cartoons.
5. **Zero Colon Meta-Labels (`Top:` / `Middle:` / `Bottom:` / `[Action]`):** Never use bracketed headers (`[Initiation]`) or bare `Top: / Middle: / Bottom:` colons that diffusion models mistake for comic caption boxes; use natural prose transitions (`In the upper panel, ... In the middle panel, ... In the lower panel, ...`).

---

## 🛡️ Production Continuity & Forensic Quality Directives (/learn)

### 1. The Mandatory Multi-Scene Antagonist & Boss Vault Invariant
Any recurring monster, boss, or elite creature appearing across $\ge 3$ scenes MUST have a dedicated master reference plate registered in `character_vault/` (e.g. `06_Boss_Abyssal_Obsidian_Colossus.jpg`) and a dedicated entity UUID registered in `flow_entities.json` and `characters.json` prior to prompt matrix generation.
- **Zero-Unanchored Monster Invariant:** Generative diffusion models have zero temporal memory across scenes. Lacking an anchored entity reference plate forces the model to synthesize random, mutating monster designs on every cut.
- **Prompt Token Binding:** All scenes featuring the monster must explicitly inject the registered character token (e.g. `@{Boss: Abyssal Obsidian Colossus}`) and technical model reference attribute (`character_ref="<uuid>"`).

### 2. The Chronological Attire Continuity Invariant
In-episode characters must strictly maintain their established chronological wardrobe (e.g. Student Academy Uniform throughout Episode 01) unless a physical in-script wardrobe change narrative beat explicitly occurs in the story.
- **Prohibition of Premature / Phantom Transformations:** The protagonist does not magically sprout end-game combat coats or sovereign trench coats mid-trial. High-tier mana channeling manifests as glowing sovereign eye ignition, floating ethereal runes, and phantom afterimages, whilst physical garments remain locked to the active episodic phase.
- **Character Reference Lock:** The entity reference UUID must remain locked across all scenes corresponding to that phase (e.g. `bbf8e245-73fa-42d8-a81c-1bdb468885de` for `@{Caelen Vance - Student Archer}`). Never swap entity UUIDs mid-episode without an in-script narrative change.

### 3. The Pre-Flight Forensic Continuity Audit Protocol
Prior to declaring prompt matrix decks ready for generation or rendering, agents must proactively execute a bit-for-bit cross-examination of the prompt matrix against the episode script:
1. **Zero Hallucinated Sub-Plots:** Cross-check prompt beats 1:1 against script lines. Strictly eliminate fabricated filler sequences, unscripted character attacks, or premature resolutions.
2. **Ironclad Weapon & Grip Binding:** Archers must have their physical grip explicitly bound to their bow (`@{Weapon: ...}`) with strict negative guards (`no swords on archer, no blades on protagonist, zero swords, zero blades`). Never allow context cues from bosses or secondary characters to leak melee weapons into archer hands.
3. **Spatial Enclosure Grounding:** Verify that environment enclosures strictly reflect narrative locations (e.g. apartment scenes must not inherit trial arena or volcanic crater enclosures).

### 4. The 10 High-CTR Title Archetypes & Object Normalisation Standard (YouTube Launchpad)
1. **Strict 100-Character YouTube Hard Cap:** Every proposed title formula MUST strictly remain $\le 100$ characters to guarantee zero ellipsis truncation across mobile YouTube recommendation feeds.
2. **Franchise-Grounded Lore & Dynamic Adapters:** In [`packagingService.js`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/studio/server/services/packagingService.js), title sets, SEO descriptions, and community pinned questions MUST dynamically bind to the active franchise lore (e.g. Series 02 Caelen Vance archery and Red Gate mechanics) rather than hardcoding legacy series narratives.
3. **Rich Metadata Object Architecture & Pure Prose Clipboard Standard:** Backend services return structured title objects (`{ archetype, title, ctrScore, style, charCount }`). Studio interfaces must unpack both structured objects and legacy strings, displaying dedicated archetype badges, CTR metrics, and character counter pills. The 1-click clipboard button MUST extract and copy the pure unformatted title string, eliminating `[object Object]` or stringified JSON leaks.

### 5. Universal Container-Fluid CSS Grid Architecture (Split-Screen & Mobile Responsiveness)
1. **Multi-Viewport Fluidity Mandate:** All studio views ([`VideoStudioView.vue`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/studio/src/views/VideoStudioView.vue), [`PromptMatrixView.vue`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/studio/src/views/PromptMatrixView.vue), [`SeriesDetailView.vue`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/studio/src/views/SeriesDetailView.vue), [`ScriptEditorView.vue`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/studio/src/views/ScriptEditorView.vue)) must maintain 100% responsive fluid behaviour across full desktop, split-screen (e.g. 50/50 browser window alongside Google Flow at 700px–900px), and mobile viewports.
2. **Strict Ban on Rigid Viewport Breakpoint Jumps:** Strictly forbidden from using fixed-width containers (`w-[1280px]`) or non-wrapping CSS grids (`grid-cols-4` without minmax). All card layouts, batch matrices, and dispatch drawers MUST employ fluid auto-fill grids (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`) and flex-wrap containers with gap spacing to eliminate horizontal clipping in split-screen workflows.

### 6. The Zero-Gore Kinetic Impact & Physical Wall-Contact Staging Formula
To ensure viewers watching the video remain visually hooked without triggering Google Flow content moderation or violence filters:
1. **Explicit Environmental Staging & Contact Points:** Never describe an impact in empty space (e.g. *"needle piercing forehead"*). Always construct the physical spatial relationship between subject, force, and terrain:
   - *Example:* `Wide dynamic low-angle shot showing the colossal 5-metre @{Boss: ...} violently slammed backward against the vertical basalt cavern wall, massive skull and horns held firmly flat against the stone surface by an intense cyan concussive mana anchor pin, deep concentric spiderweb fracture cracks radiating through the rock wall behind its head, titan's massive body paralyzed and sagging against the vertical rock face with feet lifted off the ground, dust and rock chips erupting around the impact site.`
2. **Mandatory Bloodless Negative Directives:** Strictly replace anatomical wound keywords (*"punctured skull"*, *"flesh"*, *"bleeding"*, *"severed"*) with kinetic and mana-anchored staging:
   - *Required Tail:* `clean bloodless anime impact, zero blood, zero gore, zero graphic wounds, concussive kinetic shockwave, pure textless artwork.`

### 7. The Character Vault UUID Gate & Zero-Unmapped-Entity Invariant
1. **Mandatory Vault Registration Before Matrix Assembly:** Prior to drafting or assembling a prompt matrix, every featured character and boss MUST have:
   - A generated master reference plate JPG in `character_vault/` and `00_Characters/`.
   - A registered entry with visual DNA anchor in `characters.json`.
   - A locked entity UUID mapped in `flow_entities.json`.
2. **Zero Unmapped Aliases:** Strictly forbidden from using informal abbreviations or unanchored strings in prompts (e.g. *"Bram's"*, *"Locke"* without `@UUID`). Every character occurrence in prompt prompts must match its exact registered `@UUID` token.
3. **Copy-Lock Gate Enforcement:** If an episode introduces new named characters whose UUIDs have not yet been assigned by the operator, the prompt matrix copy functionality MUST remain locked in the UI and scripts to prevent generating inconsistent diffusion plates.


---

## 🧠 The Lead Lore Auditor & Anti-Brain-Dead Script Scrutiny Protocol (The High-IQ Worldbuilding Invariant)

Whenever conceptualising, drafting, rewriting, or outlining ANY episode, scene beat, or narrative arc across all franchises, the agent MUST automatically assume the role of **Senior Webtoon Lore Auditor & Lead Script Doctor** and rigorously audit the plot against these 5 non-negotiable logic gates:

1. **The "1,000-Year Brain-Dead Civilization" Ban:**
   - Strictly forbidden from writing scenarios where an ancient world of mages and knights failed for centuries to defeat a dungeon boss or solve a trial simply because they "didn't think of" a mundane trick (e.g. using a mirror, throwing dirt, or dropping a rock).
   - If common objects or utility tools are used by the protagonist to overcome divine/calamity threats, the script MUST explicitly ground the success in the protagonist's unique numerical arithmetic engine (e.g. $+5,000$ liquid enhancement from the personal Sovereign Bank). The world’s inhabitants must never be portrayed as low-IQ toddlers who cannot comprehend basic kindergarten physics.

2. **The Credible Motive & Anti-Trauma-Dump Mandate:**
   - Powerful military commanders, guild masters, or noble antagonists NEVER reveal classified state secrets, imperial failures, or sensitive political weaknesses to a commoner or transmigrator without a concrete, calculated motive (e.g. a clandestine sting, an impossible micro-test, an informal psychological probe, or coercive interrogation).

3. **The Anti-Deus-Ex-Machina Admin Gate:**
   - Ancient AI systems, alien hypervisors, or divine wardens NEVER magically recognize an Earthling transmigrator as "The Creator" or hand over root admin passwords on a silver platter. 
   - The protagonist must earn diagnostic safe-mode or system access exclusively through engineering deduction, exploit discovery, buffer overflows, or reverse-engineering legacy system heuristics.

4. **The Physical Gateway & Leaderboard Surveillance Gate:**
   - When public steles, monuments, or guild bells broadcast record-breaking clears across a capital city, the narrative MUST explicitly account for how the protagonist bypasses physical entrance ambushes and Imperial Watch cordons (e.g. private transit runes refactored into backdoor slum anchors, or exploiting delayed batch telemetry sync windows).

5. **The Active External Ticking Clock (The "Why Not Quit?" Defense):**
   - Whenever an ultimate dungeon clear threatens global destruction (e.g. a hard system format or planetary wipeout), the narrative MUST establish an active, inescapable external crisis (e.g. container entropy memory leak causing a crash within 90 days, or a corrupt noble blood-core siege) proving why the protagonist cannot simply walk away, but is forced to climb and live-patch the core.

---

## 🛑 The Mandatory Pre-Matrix Character Vault Gate & Lead Lore Auditor Protocol (Zero-Omission Invariant)

1. **Absolute Pre-Matrix Character Vault Lock (Phase 1 Mandatory Gate):**
   - Strictly forbidden from generating, scaffolding, or compiling any episodic prompt matrix (`02_Prompt_Matrix.md`) until the script has been parsed for ALL newly introduced characters, antagonists, and boss entities appearing across $\ge 3$ scenes.
   - If new entities exist, the agent MUST autonomously:
     1. Register them in `character_vault/characters.json` with complete RPG stat baselines, visual appearance descriptions, and character DNA prompt anchors.
     2. Generate and save textless vertical 9:16 master reference plates in `character_vault/` (`{N}_{Role}_{Name}.jpg`).
     3. Map their entity names and Google Flow UUIDs into `character_vault/flow_entities.json`.
   - Never map newly introduced characters to existing cast members or treat them as ambient backdrop silhouettes.

2. **Mandatory Lead Lore & Visual Matrix Audit Report in Chat:**
   - The agent is **STRICTLY FORBIDDEN** from declaring an episode script or prompt matrix complete based solely on automated backend API scores or syntax checks.
   - Prior to concluding the turn, the agent MUST explicitly assume the **Lead Script Doctor & Studio Lore Auditor** persona and output a formal, structured audit table directly in the visible chat response covering:
     - **The 5 Lore Auditor Logic Gates:** (1. 1,000-Year Brain-Dead Civilization Ban, 2. Credible Motive & Anti-Trauma-Dump Mandate, 3. Anti-Deus-Ex-Machina Admin Gate, 4. Physical Gateway & Leaderboard Surveillance Gate, 5. Active External Ticking Clock).
     - **The 14 Anti-Slop Visual Guardrails & 3-Tier Distribution Audit:** (Confirming ~70% Dual/Multi-Panel to ~30% Hero Plate ratio, locked spatial environments, 100% token binding, and zero text/Korean/watermark bleed).

