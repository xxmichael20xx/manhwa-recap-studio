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
5. **Cross-Episode Environmental & Climate Invariant (Zero Unilateral Weather Shifts):**
   - Recurring spatial enclosures (`vault/zones.json`, `character_vault/items.json`) maintain locked, canonical climate, season, and terrain conditions (e.g., temperate dirt road vs. snow, spring vs. winter) across all episodes in an arc.
   - Episodic scripts (`01_Episode_Script.md`) and prompt matrices (`02_Prompt_Matrix.md`) are **STRICTLY FORBIDDEN** from introducing seasonal weather shifts (snow, blizzards, autumn leaves, torrential monsoons) to established zones unless explicitly mandated by the multi-episode Arc synopsis in `Series_Bible.md`.
6. **Anti-Hallucination Vault Protection Invariant (Zero Retroactive Canon Mutation):**
   - When diagnosing visual plate hallucinations, lighting defects, or script discrepancies, agents are **STRICTLY FORBIDDEN** from mutating vaulted zone canons, item anchors, or character DNA to align with rogue script text or generative artifacts.
   - Agents MUST audit preceding episodes' matrices and reference plates (`EP01`, `EP02`, etc.) to verify established environmental canon before touching vault files.
7. **Dual-Tier Cognitive Model Architecture (Drafter vs Auditor Invariant):**
   - **Lead World Architect, Drafter & Choreographer (`Model: "pro"`):** Franchise initialization & `Series_Bible.md` authoring (`/series`), 18-episode multi-arc roadmap design, 4-field Character & Prop DNA schemas (`character_vault/`), narrative scriptwriting (`01_Episode_Script.md`), scene-by-scene spatial staging, prompt updates, and panel-by-panel prompt choreography (`02_Prompt_Matrix.md`) MUST be authored by **Gemini Pro High** leveraging its full 1,000,000-token context window. Gemini Pro's advanced cognitive reasoning is required to architect complex multi-episode power systems, prevent cliché decay, track character entrances, and guarantee long-range continuity across 18+ episodes. Prioritise slow, deep, rigorous reasoning and 100% visual fidelity over speed—zero shortcuts.
   - **Pre-Flight Auditor & Gatekeeper (`Model: "flash"`):** Linting, policy audits, JSON schema validation, directory scaffolding, asset copying, and CLI test runs (`audit-vault.js`, `audit-matrix.js`, `audit-policy.js`, `audit-script.js`) MUST be executed by **Gemini Flash High** alongside local deterministic scripts for maximum speed and rigid compliance.
8. **Controlled Drafting Lexicon & Universal Entity Noun Invariant:**
   - The drafter MUST dynamically read the active franchise's `vault/entities.json` and is strictly restricted to using **only the canonical `name` and registered `aliases`** declared in that specific franchise's vault.
   - Improvisational synonyms, generic category labels, or unvaulted nicknames are strictly prohibited in spoken prose, action layers, and staging tags.
   - **The 3-Layer Trigger Contract:**
     (a) *Dialogue Insulation:* Words spoken inside quotation marks (`"..."`) never summon characters onto the stage.
     (b) *Compound Remnants:* Terms matching compound remnants (e.g. core, fragment, pelt, trophy) map strictly to items/props, never living character actors.
     (c) *Physical Action Staging:* Any clause describing physical visual action by a vaulted entity MUST declare that entity in `CAST` and `<character_refs>`.

9. **Immutable Canonical Prop & Weapon DNA Invariant (Zero Ad-Hoc Descriptive Mutation):**
   - All weapons, artifacts, and props registered with reference plates (`character_vault/items.json`, `vault/entities.json`) MUST use their single, immutable canonical DNA anchor in prompt layer 3 across all episodic scenes, identical to character/monster entities (e.g. `@{Mountain Stone Troll}`).
   - **Absolute Ban on Contradictory Adjectives:** Agents, scriptwriters, and compilers are strictly prohibited from injecting divergent, ad-hoc, or speculative adjectives into prompt action layers or prop injections (e.g. adding *"smooth spiral carved head"* or *"never metallic"* against an iron-banded reference plate). The prompt text must NEVER fight or contradict the visual reference plate.
   - **Strict Physical Staging Parity:** Props and weapons MUST only be bound to `PROPS` and `<item_refs>` when physically held, worn, or actively engaged in that scene's visual action (never inject staves during close-up knife harvesting, desk discussions, or outdoor brewing unless actively manipulated).
10. **The Hypothetical Analogy & Internal Monologue Decoupling Invariant:**
   - Spoken narrative clauses describing theoretical calculations, analogies, similes, or hypothetical combat scenarios (e.g. *"A blow against heavy plate armor would turn an opponent's ribcage to powder"*, *"like a slumbering dragon"*, *"waving fragile wands"*) are STRICTLY FORBIDDEN from being copied literally into prompt action layers.
   - The visual action layer MUST stage the active character's actual physical presence in their established spatial enclosure (e.g. Michael observing the pulverized boulder with calculating satisfaction), explicitly adding negative tokens against hypothetical constructs (e.g. `zero armor dummies, zero wooden posts`).
11. **Anti-Phantom Diffusion Lens & Solo Scene Invariant:**
    - Single-character scenes (`CAST.length <= 1`) MUST strictly receive single-character framing (e.g. `35mm medium single-character eye-level framing`) or wide establishing framing. They are **STRICTLY FORBIDDEN** from specifying `two-shot` framing in prompt layers or `<lens>` tags.
    - `35mm medium two-shot eye-level framing` is strictly reserved for scenes with $\ge 2$ characters declared in `CAST`. Diffusion models trigger phantom character hallucinations when asked for a `two-shot` without a second entity definition.
    - Whenever an interaction or reaction occurs where the protagonist is physically present or the scene's emotional anchor, the protagonist MUST be explicitly staged in `CAST` and `<action_layer>` (e.g. composed in the foreground) rather than relegated to an off-screen solo spectator cut.
12. **The 16:9 Single-Panel Full-Bleed & Diffusion Anti-Cloning Law:**
    - All 16:9 landscape franchises (Series 07 onwards) are strictly locked to **Single-Panel Full-Bleed horizontal compositions** across 100% of episodic scenes.
    - Multi-panel comic strips (`Tier B: Dual-panel split strip`, `Tier C: Three-panel dynamic action strip`, and prompt tokens `"In the upper panel..."`, `"In the lower panel..."`) are legacy 9:16 vertical mobile webtoon artifacts and are **STRICTLY PROHIBITED** from appearing in 16:9 matrices, action layers, or layout tags.
    - Every 16:9 prompt action layer MUST specify a single, coherent 3D camera staging (`"In the center foreground..."`, `"In wide perspective..."`), never repeat a solitary character's reference token more than once in the action layer, and strictly append negative tokens (`zero character cloning, exactly one single protagonist, zero split panels, zero comic borders, solitary single character framing`).
    - Spoken narrative comparisons or analogies mentioning unvaulted figures (e.g. *"archmages"*, *"dragons"*, *"generals"*) MUST inject explicit negative tokens suppressing those entities to prevent diffusion hallucinations.
13. **The 1:1 Reference-to-DNA Transcription Law (Anti-Lossy Compression):**
    - When registering any entity (character, weapon, prop, or monster) with an approved reference plate into `vault/entities.json`, `characters.json`, or `items.json`, agents are **STRICTLY FORBIDDEN** from summarizing, paraphrasing, or shortening the prompt description.
    - Every physical silhouette anchor visible on the reference plate (e.g. fur collars, exact limb structures, sabatons, armor pauldrons, helmet visors, weapon hilts, scabbards, distinctive fabrics) MUST be transcribed verbatim into `dna`, `visual_dna`, and `outfits`.
    - Entity DNA is a deterministic prompt injection blueprint, NEVER a high-level summary. If a visual feature exists on the reference plate, it must exist in the text prompt sent to the diffusion model.
14. **The Universal Entity Recurrence & Lexical Monomorphism Law (The >= 2 Recurrence Rule & Anti-Synonym Drift Law):**
    - **The >= 2 Recurrence Entity Invariant:** Any physical weapon, prop, held tool, signature garment/wardrobe component (boots, gloves, mantle, pendant, ring), architectural dais/podium/bench, or relic that is physically manipulated, held, or mentioned >= 2 times in an episode or multi-episode arc MUST be registered as an official Character/Entity in `vault/entities.json` and `character_vault/characters.json` (or `items.json`) with full 4-field DNA schema and reference plate.
    - **Lexical Monomorphism (Zero Synonym Drift):** Once an entity is named, that single canonical noun phrase MUST be used monotonically across spoken audio narrative (`01_Episode_Script.md`), staging headers (`CAST`, `PROPS`), action layers, and prompts. Casual descriptive mutation or synonym drift (e.g. alternating between "wooden practice rod", "wooden stick", and "wooden rod", or "silver training rapier" vs "silver blade") is STRICTLY PROHIBITED.
    - **Minor Garment & Equipment Locking:** All signature wardrobe components must be explicitly listed in character DNA and outfit ledgers to prevent diffusion stripping or hallucination.


---

## 2. Strict Context Verification & Proactive CLI Automation Gates
1. **Format Governance (16:9 for New Series / Legacy 9:16 Preservation) & Per-Act Release Standard:**
   - **Format Standard:** All **new series (Series 07 onwards)** are strictly locked to **16:9 Full-Bleed Landscape (`1920x1080`)**. Existing ongoing franchises preserve their canonical format as locked in their respective `franchise.json` (e.g. legacy 9:16 vertical series remain intact). Never unilaterally mutate an existing franchise's format.
   - **The Per-Act Release Standard (≥ 60 Minutes / 1+ Hour Standard):** Long-form YouTube releases are organized and compiled **Per Act** (consolidating 3–6 episodic segments or multi-batch arcs into a continuous 60–90+ minute feature). Independent standalone uploads under 60 minutes are strictly prohibited to maximize audience retention, binge-watching velocity, and YouTube algorithmic momentum.
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
| **Stage 1: Vault Lock & Seed** | Scan arc for all characters, family members, bosses ($\ge 2$ scenes), weapons/props, and recurring locations ($\ge 2$ scenes). Register in `characters.json` / `items.json` with 4-field DNA (`dna`, `dna_prompt_anchor`, `visual_dna`, `description`), `episodes` array, and pure `@{Entity Name}` tokens (ZERO UUIDs). For minors, strictly ban numeric child ages (`10-year-old`, `seven-year-old`) and raw youth nouns (`boy`, `child`, `boy build`); lock filter-safe manhwa descriptors (`young noble manhwa protagonist`, `slender aristocratic build`, `relaxed youthful posture`). Synthesize textless reference plates in `character_vault/` & `00_Characters/`. **Gate:** `node studio/scripts/audit-vault.js <franchiseId>` MUST exit with Code 0. | `manhwa-vault` |
| **Stage 2: Script & Spatial Boundary Gate** | Draft `01_Episode_Script.md` anchored to `Series_Bible.md` with linear continuity, zero `@` tokens in spoken prose, and semantic staging headers. **Gates:** (1) `node studio/scripts/extract-zones.js <franchiseId> <episodeId>` (Exit Code 0; verifies all recurring physical boundaries and zero placeholder plates); (2) `node studio/scripts/audit-script.js <franchiseId> <episodeId>` (Exit Code 0; zero boundary desyncs); (3) `node studio/scripts/generate-tts.js <franchiseId> <episodeId> <voice>`. | `manhwa-story` |
| **Stage 3: State Lock & Matrix Assembly** | Scaffold episodic state lock via `node studio/scripts/init-world-state.js <franchiseId> <episodeId>` to lock wardrobe, prop schemas, and timeline lighting. Compile matrix deterministically via `node studio/scripts/compile-matrix.js <franchiseId> <episodeId>` using the Tone-Driven Tier Engine (calm dialogue locked to Tier B/A; Tier C reserved for combat) and dynamic temporal lighting decoupling. Run `node studio/scripts/sanitize-matrix.js <franchiseId> <episodeId>`. | `manhwa-matrix` |
| **Stage 4: 35-Gate Linter & Policy** | Execute deterministic pre-flight linters: `node studio/scripts/audit-matrix.js <franchiseId> <episodeId>` AND `node studio/scripts/audit-policy.js <franchiseId> <episodeId>`. **Hard Blocker:** Score MUST be 100/100 (Exit Code 0) across all 35 gates (including G17 Policy Shield, G20 Anti-Placeholder Disk Integrity, G30 Action Novelty, G31 1:1 Header Lock, G32 Semantic Layout-Tone & Immersion, G33 Destruction State Lock, G34 World State Parity, G35 Minor & Youth Safety Policy Shield, and D-01 Normalized Manifest Signature). | `manhwa-matrix` |
| **Stage 5: QA Seal, Compile & Launch** | Obtain `studio-gatekeeper` subagent Production Seal. Compile targeted batches (`POST /compile-video`), lossless stitch (`POST /stitch-batches`), and extract 2–4 FFmpeg verification frames. Package YouTube/Shorts release from `YouTube_Locked_Package.md` (`(Episode 1-N)` prefix, plain episode timestamps, `<2MB` MozJPEG thumbnails). Conclude turn with the **Operator Action & Testing Guide**. | `manhwa-compiler`, `manhwa-launch`, `manhwa-thumb` |

---

## 4. Studio Format Taxonomy & Progressive Workspace Skills Directory

| Format Tier | Official Nomenclature | Target Runtime | Target Word Count | Distribution Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1 (Internal)** | **Episodic Segment / Part** | 18–25 Minutes | ~2,500–3,500 words | Internal production milestone / batch unit. |
| **Tier 2 (Canonical)** | **Act Feature / Movie Cut** | **60–90+ Minutes** | **~9,000–14,000 words** | **Standard Official Release (≥ 60 min per Act).** |
| **Tier 3 (Marathon)** | **Multi-Act Saga / Cut** | 2.0–3.0 Hours | ~18,000–28,000 words | Compiled 2-Act seasonal marathon cut. |
| **Tier 4 (Omnibus)** | **Grand Continental Omnibus** | 4.0+ Hours | ~35,000+ words | Full multi-season binge compilation. |

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
