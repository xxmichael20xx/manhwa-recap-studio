# 🎬 Project Rules: Manhwa Recap Studio (`02_PROJECT_RULES/AGENTS.md`)

> **Canonical Project Rules for `quirky-chandrasekhar` & `Manhwa_Recap_Studio` (Consolidated SSOT)**  
> **Venture Directory:** `C:\Users\MIchaelangelo\Documents\My Brand\02_Ventures & Digital Products\Manhwa Recap Studio\`

---

## 1. Studio Architecture, SSOT Hierarchy & Boundary Invariants
1. **Two-Tier Repository Hierarchy:**
   - **`/00_Engine/` (Universal Core):** Shared anti-slop codices, archetype formulas, and platform manuals.
   - **`/01_Franchises/` (Isolated Series Repositories):** Self-contained franchise directories (`Series_XX_Title/`), each housing `00_Series_Bible_and_Character_DNA/`, `character_vault/`, `00_Characters/`, `omnibus/`, and episodic folders (`EP01/`, `EP02/`).
   - **Identity Invariant:** The ecosystem is strictly named **"Manhwa Recap Studio"** (legacy names like "Luna" are forbidden).
2. **Master Series Bible Ground-Truth & Zero-Improvisation Law:**
   - 100% of episodic scripts, character rosters, spatial enclosures, weapons/props, magic arithmetic, and `STUDIO_BIBLE_DIRECTIVES` MUST be sourced from `00_Series_Bible_and_Character_DNA/Series_Bible.md`.
   - Never improvise unapproved plot arcs, characters, or settings. An Arc spans 3–6 episodes (never compress 1 Arc into 1 Episode).
3. **Studio Application Boundary (Markdown SSOT vs. Runner Engine):**
   - The Studio web app (`studio/server`, `studio/src`) is strictly a deterministic ingestion, runner, and monitoring engine.
   - **Absolute Ban on Hardcoding & Code Mutation during Production:** Never hardcode series-specific `if/else` ternaries (`isSeries01`, character names, or genre vocabulary) inside JS/Vue files. Workflow agents executing `/story`, `/matrix`, `/vault`, `/thumb`, or `/launch` are **STRICTLY FORBIDDEN** from modifying Studio application code; write all franchise data strictly to repository Markdown/JSON SSOT files.
4. **Episodic Scene Plate Generation Boundary (Google Flow Exclusive):**
   - **Absolute Ban on Agent Image Generation for Episodic Plates:** Never invoke `generate_image` or the `image-generator` subagent to generate or overwrite episodic scene plates (`images/IMG_XXX.jpg`). All episodic scene fixes and updates are strictly text prompt modifications in `02_Prompt_Matrix.md` for the operator to execute in **Google Flow** (the built-in image generator is reserved exclusively for Stage 1 `character_vault/` reference plates or thumbnails when explicitly requested).

---

## 2. Strict Context Verification & Proactive CLI Automation Gates
1. **Mandatory Pre-Flight Context Verification (`/grill-me` & Format Lock):**
   - Never guess video format (Format 1: `9:16 Vertical Webtoon` vs. Format 2: `16:9 Full-Bleed Landscape`), target franchise, episode scope, or narrative archetype. If any required parameter or prerequisite file is missing, **HALT IMMEDIATELY** and ask the operator clear, bulleted questions via `ask_question`.
2. **Production-First Episode Gate (Anti-Premature Expansion):**
   - Never initiate `EP02` (or `EP_N+1`) until the preceding episode has 100% finished visual plates on disk, verified Edge-TTS/SRT/FFmpeg compilation with zero regressions, and explicit operator sign-off.
3. **Step-Back & First-Principles Diagnosis (>2 Iterations Rule):**
   - If a bug, sync drift, or prompt defect persists for >2 iterations, halt micro-patching immediately, zoom out to the macro pipeline architecture, and propose a first-principles structural fix.
4. **Proactive CLI Tooling Enforcement:**
   - Never create one-off scratch scripts (`check_xxx.mjs`) for recurring checks. Use and extend deterministic CLI tools in `studio/scripts/` (`audit-vault.js`, `audit-script.js`, `generate-tts.js`, `sanitize-matrix.js`, `inspect-scene.js`, `audit-matrix.js`, `audit-policy.js`). If a new repetitive manual workflow emerges (>=2 times), proactively package it into a reusable CLI script in `studio/scripts/`.

---

## 3. The Mandatory 5-Stage Episodic Production Pipeline Contract
Every episode MUST execute these 5 sequential stages without skipping or reordering. Load the corresponding workspace skill (`view_file`) at each stage for detailed execution SOPs:

| Stage | Pipeline Gate & Required Deterministic CLI Verification | Target Skill |
| :--- | :--- | :--- |
| **Stage 1: Vault Lock & Seed** | Scan arc for all characters, family members, bosses ($\ge 2$ scenes), weapons/props, and recurring locations ($\ge 2$ scenes). Register in `characters.json` / `items.json` with 4-field DNA (`dna`, `dna_prompt_anchor`, `visual_dna`, `description`), `episodes` array, and pure `@{Entity Name}` tokens (ZERO UUIDs). For minors, lock numeric age (`10-year-old boy build`) and filter-safe posture (`relaxed youthful posture`; zero `child build`/`childlike posture`). Synthesize textless reference plates in `character_vault/` & `00_Characters/`. **Gate:** `node studio/scripts/audit-vault.js <franchiseId>` MUST exit with Code 0. | `manhwa-vault` |
| **Stage 2: Script & Edge-TTS** | Draft `01_Episode_Script.md` anchored to `Series_Bible.md` with linear chronological continuity, clean RPG math, 5 Lore Auditor gates, `<!-- CLIMAX_START -->` shorts tags, zero `@` tokens in spoken text, strict `CAST: [...]| PROPS: [...]` header delimiter spacing, semantic `STAGE` enum (`establishing` strictly for 0 characters), and 1:1 clause-anchored `[IMG_XXX]` tags. **Gates:** (1) `node studio/scripts/audit-script.js <franchiseId> <episodeId>` (Exit Code 0); (2) `node studio/scripts/generate-tts.js <franchiseId> <episodeId> <voice>` to measure real `ffprobe` duration in `audio_telemetry.json`; (3) Independent `continuity-auditor` subagent certification (100% PASS). | `manhwa-story` |
| **Stage 3: Matrix Assembly** | Partition into dynamic 24-scene batches ($\lceil N_{\text{scenes}} / 24 \rceil$, max 8.0s hold per plate) using the 3-Tier Visual Engine (~70% Tier B/C Multi-Panel, ~30% Tier A Hero) and 5-Layer Prompt Hierarchy. Enforce Minor Protagonist Index 0 sorting, relative scale contrast, and mineral policy shield (zero `silica` or `pure white sand`). Synchronously output Tier 1 Google Flow Master Instructions + Tier 2 XML decks. **Gate:** Run `node studio/scripts/sanitize-matrix.js <franchiseId> <episodeId>`. | `manhwa-matrix` |
| **Stage 4: 31-Gate Linter & Policy** | Execute deterministic pre-flight linters: `node studio/scripts/audit-matrix.js <franchiseId> <episodeId>` AND `node studio/scripts/audit-policy.js <franchiseId> <episodeId>`. **Hard Blocker:** Score MUST be 100/100 (Exit Code 0) across all 31 gates (including G06 Policy-Safe Tail Alignment, G14 Token Budget <=450 tokens via DNA/wardrobe decoupling, G23 Establishing Purity, G24 Concrete Color Standard, G25 Chronological Entrance Continuity, G26 Sanctuary Secrecy, G27 Tech-Tree Lifecycle, G30 Stem Novelty, G31 1:1 Staging Header Lock, and D-01 Normalized Manifest Signature). | `manhwa-matrix` |
| **Stage 5: QA Seal, Compile & Launch** | Obtain `studio-gatekeeper` subagent Production Seal. Compile targeted batches (`POST /compile-video`), lossless stitch (`POST /stitch-batches`), and extract 2–4 FFmpeg verification frames. Package YouTube/Shorts release from `YouTube_Locked_Package.md` (`(Episode 1-N)` prefix, plain episode timestamps, `<2MB` MozJPEG thumbnails). Conclude turn with the **Operator Action & Testing Guide**. | `manhwa-compiler`, `manhwa-launch`, `manhwa-thumb` |

---

## 4. Studio Format Taxonomy & Progressive Workspace Skills Directory

| Format Tier | Official Nomenclature | Target Runtime | Target Word Count | Distribution Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **Episode / Chapter** | 18–25 Minutes | ~2,500–3,500 words | Standalone weekly algorithmic upload. |
| **Tier 2** | **Arc Feature / Saga** | 45–60 Minutes | ~6,500–8,500 words | Multi-batch slow-burn arc or premiere feature. |
| **Tier 3** | **Season Movie / Cut** | 1.5–2.5 Hours | ~12,000–20,000 words | Compiled 3–5 episode marathon cut. |
| **Tier 4** | **Grand Omnibus** | 3.0+ Hours | ~25,000+ words | Full multi-season binge compilation. |

### Workspace Skills Routing Table (`.agents/skills/`)
- **`/series` (`manhwa-series`):** Franchise scaffolding, format lock (`9:16` vs `16:9`), `Series_Bible.md`, world setting concepts, atomic vault plate generation.
- **`/new-ep` (`manhwa-new-ep`):** End-to-end 6-phase episodic production orchestrator and subagent audit workflow.
- **`/vault` (`manhwa-vault`):** Character, family, boss, weapon/prop, and recurring location DNA vault (`@{Entity Name}`), textless reference plate synthesis, and disk parity.
- **`/story` (`manhwa-story`):** 8 Core Pillars, 5 Lore Auditor gates, slow-burn multi-batch worldbuilding, spoken prose sanitization, and `generate-tts.js` telemetry.
- **`/matrix` (`manhwa-matrix`):** Chief Continuity Director, 3-Tier Visual Engine, 4 Cinematography Laws, 18 Anti-Slop Guardrails, 7 Continuity Laws, 6 Google Flow Safety Shields, and 27-Gate Linter.
- **`/compiler` (`manhwa-compiler`):** Universal AV spec lock (`24fps`, `1080p`, `yuv420p`, `48kHz AAC`), targeted batch compile, lossless `-c copy` concat, `ffprobe` chapters, and FFmpeg frame proof.
- **`/launch` (`manhwa-launch`):** `YouTube_Locked_Package.md` SSOT, accumulative `(Episode 1-N)` numbering, plain episode timestamps, and Multi-Shorts extraction kits.
- **`/thumb` (`manhwa-thumb`):** 3 Master Thumbnail archetypes (Split, Proctor Panic, Solo Cleave), reference plate binding, top-left `#FFD700` badge, and locked Ep 1 thumbnail mirroring.
- **`/studio-dev` (`manhwa-dev`):** Vue/Express architecture, Slate theme tokens, container-fluid grids, 3-Tier Live Verification, and pre/post-build scrap cleanup.
- **`/refresh-rules` (`refresh-rules`):** Live disk re-ingestion of `AGENTS.md`, `SKILL.md` manifests, and `00_Engine/` codices.
