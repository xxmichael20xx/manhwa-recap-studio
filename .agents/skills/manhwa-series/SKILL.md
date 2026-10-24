---
name: manhwa-series
description: Universal franchise initialization engine. Prompts for format tier (9:16 vs 16:9), archetype formula, entity bible, and character DNA anchors, then scaffolds franchise repositories. Trigger with /series.
---

# 🎬 Manhwa Series Initialization Engine (`/series`)

> **Master SOP for Scaffolding New Franchises & Worldbuilding Foundations**  
> **Slash Command:** `/series`  
> **Workspace Root:** `quirky-chandrasekhar`  
> **Venture Directory:** `C:\Users\MIchaelangelo\Documents\My Brand\02_Ventures & Digital Products\Manhwa Recap Studio\01_Franchises\`

---

## 🎯 Mandatory Interactive Auto-Grill Pre-Flight (`ask_question`)

Whenever the `/series` keyword or skill is invoked, the agent MUST immediately halt and initiate an interactive `ask_question` interview before creating any directories or writing files:

```
[Interactive Pre-Flight Alignment Modal]
1. Target Format Tier:
   - (Recommended) Format 1: 9:16 Authentic Webtoon Scroll (Vertical strip with blurred wings & downward reading glide)
   - Format 2: 16:9 Full-Bleed Landscape (100% edge-to-edge widescreen with horizontal sweeping pans & system HUDs)
2. Narrative Archetype Formula:
   - (Recommended) Archetype C: Hidden Crafter / Demigod Enhancement System
   - Archetype A: Betrayal & Abyssal Sovereign Awakening
   - Archetype B: Regressor / 10,000x Calculation Velocity Sovereign
3. Franchise Title & Protagonist Identity:
   - Provide the series working title, protagonist name, initial humble class, and awakened hidden authority.
```

---

## 🏛️ Studio Architecture & Directory Hierarchy

The studio operates on a modular two-tier architecture:
1. **`/00_Engine/` (Universal Core):** Contains universal anti-slop codices, archetype formulas, prompt matrices, and platform manuals inherited by all series.
2. **`/01_Franchises/` (Isolated Series Repositories):** Contains self-contained franchise repositories (`Series_01_The_Singularity_Protocol/`, `Series_02_The_Omniscient_Dungeon_Sovereign/`, `Series_03_Transmigrated_Game_Architect/`, etc.).
3. **Studio Application Identity Invariant:** The web application and studio ecosystem is strictly named **"Manhwa Recap Studio"**. All references to legacy names (such as "Luna" or "Luna Studio") are unconditionally prohibited across all code, documentation, UI labels, directives, and responses.

---

## 🛑 The Mandatory Operator Format Gate (Anti-Assumption Invariant)
1. **Absolute Ban on Guessing Video Format:** When initializing or drafting any new franchise or series, the agent is **STRICTLY FORBIDDEN** from assuming or guessing the video format.
2. **Mandatory Pre-Flight Operator Selection:** The agent MUST explicitly prompt the operator to lock the format tier before generating scripts or prompt matrices:
   - **Format 1:** 9:16 Authentic Webtoon Scroll (Vertical strip with blurred wings & downward reading glide)
   - **Format 2:** 16:9 Full-Bleed Landscape (100% edge-to-edge widescreen with horizontal sweeping pans & system HUDs)
3. **Format Enforcement:** All prompt matrices, character DNA sheets, and video compiler pipelines for that series must strictly bind to the chosen format without cross-format contamination.

---

## 🛠️ Step-by-Step Scaffolding Protocol

Once the interactive alignment questions are confirmed:
1. Create isolated franchise directory:
   `01_Franchises/Series_{XX}_{Canonical_Title}/`
2. Scaffold core subdirectories:
   - `00_Series_Bible_and_Character_DNA/`: Houses the master franchise bible, worldbuilding laws, power hierarchy, and multi-episode act roadmap.
   - `character_vault/`: Houses master character DNA, `characters.json`, `items.json`, and `flow_entities.json`.
   - `00_Characters/`: Houses character reference master plate JPGs.
   - `omnibus/`: Houses compiled multi-episode master movies and marathon metadata.
3. **Mandatory Master Series Bible Scaffolding (`Series_Bible.md`):**
   Scaffold `00_Series_Bible_and_Character_DNA/Series_Bible.md` containing:
   - **Executive Premise & Inciting Incident:** High-concept hook, world merger / regression conditions.
   - **Power Scaling & Progression Arithmetic:** Predictable RPG numbers, durability thresholds.
   - **Locked Character Roster:** MC, sidekicks, arrogant bullies, examiners, major boss.
   - **Mandatory Multi-Episode Arc Architecture:** Minimum 3–4 planned narrative arcs mapping out the multi-episode progression and peak cliffhangers (3–6 episodes per arc; e.g. Season 1 = 18 episodes across 4 Arcs). Strictly forbidden from equating 1 Arc to 1 Episode.
3.5 **Mandatory World Setting Image Selection Pre-Flight:**
   - Generate 3 distinct visual concept variations of the empire/world setting (matching the locked format tier) via `image-generator`.
   - Embed the variations inline and prompt the operator to lock the canonical world aesthetic before drafting episodic scripts or finalizing `Series_Bible.md`.
3.6 **Mandatory Master YouTube Package Scaffolding (`YouTube_Locked_Package.md`):**
   - Scaffold `00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md` establishing the locked canonical series title, base locked title (<=84 chars), upload title template (`(Episode {{EPISODE_RANGE}}) ...` <=100 chars), locked SEO description template, community question, music attribution, and thumbnail concepts. Zero Studio code changes permitted.
4. Scaffold initial `character_vault/characters.json`:
   ```json
   {
     "seriesTitle": "Canonical Title",
     "format": "Format 1: 9:16 Webtoon",
     "token_standard": "@{Character Name}",
     "characters": []
   }
   ```
5. Scaffold initial `character_vault/flow_entities.json`:
   ```json
   {
     "rawText": "",
     "entities": {}
   }
   ```
6. Scaffold initial `character_vault/items.json`:
   ```json
   {
     "items": []
   }
   ```
7. **Mandatory Atomic Character Reference Plate Synthesis:**
   - Strictly forbidden from stopping after JSON scaffolding or asking the operator to run `/vault` as a second step.
   - Immediately and autonomously invoke `image-generator` in the exact same turn to generate 9:16 vertical textless master reference plates (`{N}_{Role}_{Name}.jpg`) for all initial characters.
   - Save plates directly to `character_vault/` and mirror into `00_Characters/`.
8. Conclude with the **Mandatory Post-Milestone Operator Action Plan**:
   - Provide direct clickable links to the newly scaffolded directory and character plates.
   - Confirm all characters have `hasPlate: true` in the Character & Item Vault.
   - Remind the operator to verify that the Google Flow project includes the Agent Instruction: `"Always map @{Character Name} tags to their corresponding character entity references in this project."`

---

### 👑 The Atomic Character Creation & Master Plate Synthesis Invariant
1. **Mandatory Atomic Generation:** Strictly forbidden from creating or scaffolding `character_vault/characters.json` as a text-only placeholder without simultaneously synthesizing its corresponding master reference plates.
2. **Autonomous Image Invocation:** Whenever a new franchise is initialized via `/series` or a new character is registered in `/vault`, the agent MUST immediately and autonomously invoke `image-generator` in the exact same turn to synthesize 9:16 vertical textless master reference plates (`{N}_{Role}_{Name}.jpg`) for all newly defined characters.
3. **Zero Two-Step Ceremony:** The agent is strictly forbidden from pausing or asking the operator to run a separate generation command. Files must be saved directly into `character_vault/` and mirrored into `00_Characters/` before handing the turn back to the operator.

---

### 🛡️ The Bidirectional Vault Entity Reconciliation Invariant (1:1 Flow ↔ Vault Parity)
1. **Unified Roster Assembly:** Strictly forbidden from scaffolding `characters.json` from only humanoid cast lists. When initializing any franchise or updating the vault, ALL entities—including protagonists, allies, scions, examiners, prologue antagonists (such as Grand Inquisitors or execution squads), AND all multi-scene Bosses, Calamities, Divine Beasts, and Automatons from all narrative arcs—MUST be compiled into a single unified roster before creating files.
2. **Mandatory 1:1 Parity Check:** Before concluding any series scaffolding or vault update, the agent MUST execute a programmatic cross-verification:
   - 100% of entities defined in `flow_entities.json` MUST exist in `characters.json` or `items.json`.
   - 100% of entities in `characters.json` MUST have `hasPlate: true` with a generated 9:16 plate in `character_vault/` and `00_Characters/`.
3. **Zero Orphaned Entity Gate:** If any entity exists in `flow_entities.json` without an entry in `characters.json`, the turn is strictly non-compliant. The agent MUST immediately create the character definition and invoke `image-generator` in that exact same turn.

---

### 🗺️ The Multi-Episode Arc Architecture Law (Zero 1-Arc = 1-Episode Confabulation)
1. **Multi-Episode Arc Hierarchy:** An Arc is NEVER equal to a single episode. Every franchise Series Bible (`Series_Bible.md`) MUST organize its seasons into multi-episode arcs (typically 3–6 episodes per arc; e.g. Season 1 = 18 episodes across 4 Arcs).
2. **Canonical Arc Archetype Progression:**
   - **Arc I: Inciting Incident & Underdog Awakening** (Episodes 1–4): Initial conflict, sovereign awakening, low-tier bullies, underground/initial trial.
   - **Arc II: Institutional Infiltration & The Great Trial** (Episodes 5–9): Academy/Guild trials, escalating regional threats, secret evaluation, high-IQ scheming.
   - **Arc III: Dimensional Rupture & Syndicate War** (Episodes 10–14): High-stakes domain clash, syndicate bosses, state intervention, major face-slap payoffs.
   - **Arc IV: Global Awakening & Sovereign Ascension** (Episodes 15–18): Season climax, continental-level calamity, public identity confrontation, cosmic cliffhanger.
3. **Episode-to-Arc Mapping Mandate:** Every episodic script must explicitly declare its parent Arc and Episode sequence in its header (e.g. `Arc I: Awakening — Episode 02 (Overall EP02)`).


---

### 🔒 The Master Series Bible SSOT Law (Zero Studio Hardcoding Invariant)
1. **100% Bible-Driven Directives:** Every franchise's `00_Series_Bible_and_Character_DNA/Series_Bible.md` MUST include a `<!-- STUDIO_BIBLE_DIRECTIVES_START ... STUDIO_BIBLE_DIRECTIVES_END -->` JSON block locking:
   - `styleName`, `format`, `voiceId`, `genreRule`, `forbiddenRule`, `crowdRule`, `defaultVaultDna`, `exampleEntities`, `vocabulary` (`diegeticScrolls`, `diegeticSignage`, `diegeticSteles`, `diegeticUi`), and `spatialEnclosures`.
2. **Zero Static Franchise Hardcoding:** Strictly forbidden from hardcoding series-specific styles, character names, or vocabulary inside `studio/src/utils/franchiseStyleHelper.js` or Vue views. Both the AI Agent and the Studio Web App ingest all franchise rules dynamically from `Series_Bible.md`.
