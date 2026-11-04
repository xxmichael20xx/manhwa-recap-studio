---
name: manhwa-matrix
description: Lead Manhwa Storyboard Director, Chief Continuity Director & Visual Engine Architect. Enforces Beat-Sheet Directing, Deterministic Matrix Compiler (compile-matrix.js), 4 Cinematography Laws, 10 Directing Laws, and 31-Gate CLI Linter. Trigger with /matrix.
---

# 🎨 Manhwa Prompt Matrix & Visual Engine (`/matrix`)

## 1. Strict Context Verification & Mandatory Role Assumption
- **Missing Context Halt:** Verify that `Series_Bible.md`, `01_Episode_Script.md`, `audio_telemetry.json`, and `character_vault/` plates exist. If any entity lacks a physical plate or parameter, **HALT IMMEDIATELY** and resolve via `/vault` or `ask_question`.
- **Role & Two-Layer Handoff:** Adopt the role of **Lead Storyboard Director & Film Continuity Supervisor**. Static/rigid keyword checklist grepping is **STRICTLY FORBIDDEN**. You must evaluate dramatic common sense, physical space, character lifecycle, and audio-visual synchrony. Whenever generating or updating prompt matrices, synchronously deliver BOTH **Tier 1: Google Flow Master Agent Instructions** and **Tier 2: Per-Batch Scene XML Decks**.

## 2. The V2.0 Beat-Sheet Directing Workflow & Deterministic Compilation
Partition scenes dynamically into 24-scene batches ($\lceil N_{\text{scenes}} / 24 \rceil$). Never truncate or abbreviate prompts (`Lean Mode = false`; software DRY principles are banned—repeat full physical/wardrobe/micro-DNA descriptors on every cut):
- **Format 1 (`9:16 Vertical Webtoon 1080x1920` — ~70% Multi-Panel / ~30% Hero Ratio):**
  - **Tier A (~30%, 5–8s hold):** `Full-bleed cinematic hero plate. [Description]. [Franchise Art Style Directive], vertical 9:16.`
  - **Tier B (~50%, 6–9s hold):** `2D Korean webtoon manhwa illustration, sharp black ink linework, high contrast cel shading. Dual-panel vertical 9:16 split strip. In the upper panel, [Active speaker/action]. In the lower panel, [Tagged partner reaction/consequence].`
  - **Tier C (~20%, 7–12s hold):** `2D Korean webtoon manhwa illustration, sharp black ink linework, high contrast cel shading. Three-panel vertical 9:16 strip. In the upper panel, [Beat 1]. In the middle panel, [Beat 2]. In the lower panel, [Beat 3].` *(Never use colon labels `Top:/Middle:/Bottom:` or inject combat boilerplate into calm scenes).*
  - **Anti-Modulo Rule:** Layout tiers must NEVER be assigned via index modulo (`i % 3`). Every layout tier must deterministically match the scene's emotional tension and narrative staging. Calm dialogue and interaction stages are strictly locked to Tier B or Tier A; Tier C dynamic action strips are reserved strictly for active physical combat beats.
- **Format 2 (`16:9 Full-Bleed Landscape 1920x1080` — Zero Sidebars):**
  - **Archetype A (~40%):** Wide Battlegrounds (`pan_left_to_right`); **Archetype B (~25%):** In-Frame System HUDs (`hero_zoom_in`); **Archetype C (~20%):** Kinetic Horizontal Action (`pan_diagonal_sweep`); **Archetype D (~15%):** Panoramic Establishing Shots (`hero_zoom_out`).
- **The V2.0 Beat-Sheet Workflow (75% Output Token Reduction):**
  - **What the Agent Authors in Phase 3:** In `02_Prompt_Matrix.md`, write ONLY the directing beats per scene:
    `<lens>`, `<character_refs>`, `<item_refs>`, `<layout>`, `<visual_literal>`, and `<action_layer>` (Layer 4 only).
  - **Deterministic Assembly:** Execute `node studio/scripts/compile-matrix.js <franchiseId> <episodeId>`. The compiler deterministically binds Layers 1, 2, 3, and 5 from `Series_Bible.md`, `characters.json`, `items.json`, and `zones.json`, enforces minor Index 0 sorting, locks zone elevation/lighting, and overwrites `<narrative_sync>` bit-for-bit from the script.

## 3. The 4 Cinematography Laws & 10 Forensic Continuity Laws
1. **Two-Character Panel Staging & Dialogue Co-Anchoring:**
   - When 2 characters interact or converse, bind **BOTH** in `<character_refs>` and `Featuring @{...}` (upper panel speaker, lower panel listener; zero anonymous role nouns like *"the shopkeeper"* or *"his father"*).
   - In shared single panels, stage strictly via **(A) Screen-Coordinate Standoff** (left third vs. right third separated by 3m empty floor + negative isolation tags) or **(B) Over-The-Shoulder Silhouette** (foreground dark back silhouette, middleground lit face). In multi-entity clashes, assign separate panels or state: `keeping @{Protagonist}'s human body completely separate and distinct from @{Boss}'s [features]`.
2. **Weapon, Prop & Wardrobe Lifecycle State Machine:**
   - **Wardrobe & Aging Lock:** Lock chronological attire and milestone age across 100% of sequential scenes after a milestone/timeskip (revoke old attire tokens).
   - **Prop Persistence:** Equipped bags/rucksacks (`@{Herb Rucksack}`) and weapons (`@{Carved Blackwood Staff}`—straight cylindrical bo staff, zero wizard orbs/gnarled roots) persist across 100% of transit/clash cuts until explicitly set down or stowed.
   - **4 Weapon States:** **State 1 (Equipped)** & **State 2 (Sheathed):** Bind in `<character_refs>` with explicit hand grip/sheath geometry (max 1 hand action per character per cut). **State 3 (Floor/Table Prop):** Bind in `<entity_ref>` only, hands empty. **State 4 (Destroyed/Shattered):** **REVOKED from `<character_refs>` immediately!** Describe strictly as environmental dust/fragments in Layer 3.
   - **Whole-Word & Chronological Debut Gate:** Never bind weapons via single-word substrings (`"staff"`, `"Blackwood Forest"`) or before their canonical debut scene.
3. **Diegetic Co-Presence, Metaphor Purge & Pronoun Resolution:**
   - **Zero Dialogue Teleportation:** Never bind characters or bosses merely mentioned in dialogue, insults, or heraldic crests (*"dragon medallion"* -> prompt as inanimate metal relief plaque, zero living monsters).
   - **Metaphor & Negative Idiom Purge:** Purge similes (*"like an anvil"*), spoken dialogue quotes (`"..."`), audio hyperbole (*"fleeing like sheep"*), and negative idioms (*"without a sword"* -> translate to positive `"bare hands crackling with cyan mana"`).
   - **Subject-Action & Pronoun Resolution:** Resolve `He/She/It/Its` before binding `<character_refs>`. When an antagonist or mob attacks, bind the antagonist as actor (zero protagonist fallback). In incoming barrages, anchor the defending character as the central focal bullseye (never prompt attacks targeting empty terrain).
   - **Vertical Observer & Nameless Staff:** Frame window observers from inside looking down; render nameless medics/soldiers in background with full-face dark visors/balaclavas.

## 4. The Universal Google Flow Policy Shield & Dynamic Safe Tails
To guarantee 0 policy blocks on Google Flow / Imagen 3:
1. **Unconditional Ban on Legacy Anatomy Triggers (Gate 6):**
   - **BANNED PHRASES:** Never output `"anatomically correct"`, `"all limbs connected"`, `"physically connected wrists and forearms"`, or `"slender fingers"` anywhere in prompts or tails.
   - **MANDATORY SAFE ANATOMY TAIL:** `"cleanly rendered hand linework, distinct individual fingers, crisp pupil reflections, zero cloning"`.
   - **Franchise Style Invariant:** Verify that `franchise.style.tail_positive` in `franchise.json` matches the policy-safe tail verbatim. Never retain obsolete SD tails in `franchise.json`.
2. **6 Automated Policy Classifier Shields (Gate 17):**
   - **Minor Character Age Anchor & Safe Scale Invariant:** Never strip numeric age nouns (e.g. `10-year-old`). Anchor minors with standard gender build (`10-year-old boy build`, `11-year-old girl build`). In shared frames with adults, always sort the minor to index 0 (`activeCharIds[0]`) and add explicit relative scale cues (`10-year-old @{Protagonist} visibly smaller with youthful boy build beside [Adult]`).
   - **Minor Anatomy Safety Filter Shield:** Strictly ban the noun "child" when paired with physical body, proportion, or posture descriptors (`"child build"`, `"child proportions"`, `"childlike posture"`, `"cute child"`), as these trigger automated AI safety filters. Use filter-safe alternatives: `"10-year-old boy build"`, `"soft round youthful face"`, `"relaxed youthful posture"`, `"bright youthful enthusiasm"`.
   - **Zero Minor Trauma, Restraint, or Garment Tactile Prompts:** Ban *bleeding, vomiting blood, starving, screaming in agony*, adults *grabbing/restraining/choking* a minor, weapons held to throats, or minors *reaching inside tunics/pockets*. Re-stage into composed sovereign mana barriers, autonomous counter placement, and kinetic parries.
   - **Zero Visceral Gore, Controlled Substances & Chemical Compounds:** Ban *corpses, blood, severed, decapitation, white powder, pure white sand, silica, silica sand, crushed specks, saponins, venom glands, acid pools, naked eye* (use *unaided vision*), and layout meta-terms (*"Character Sheet"*, *"Turnaround Sheet"*). Re-stage minerals and chemicals into high-fantasy aesthetic terms: `"sparkling crystalline quartz sand"`, `"glistening river sand"`, `"luminous blue mana crystals"`, `"botanical cleansing bar"`.
   - **Dual-Mode Text Control:** Ban speech bubbles, SFX, and Hangul (`한글`). Whitelist diegetic text ONLY on exact scene IDs with system HUDs, scrolls, steles, or shop signs.
3. **Context-Aware Dynamic Safe Tail Templates:**
   - **Mode A (Character Scenes):** `[Franchise Art Style Directive], [Aspect Ratio], cleanly rendered hand linework, distinct individual fingers, detailed knuckles, perfectly drawn footwear, crisp pupil reflections, no character cloning, no duplicate protagonist, no foreground strangers stealing focus, [crowdRule: natural blurred background crowd in public OR strictly private interior room with zero extra characters], no floating hands, no detached hands, no disembodied hands touching screens, no morphing artifacts, no missing fingers, no extra limbs, complete limbs, no split-room perspectives, pure 100% textless artwork, no speech bubbles, no comic SFX, no photorealistic 3D CGI.`
   - **Mode B (Unpopulated Environment Scenes — Zero `<character_refs>`):** Strip all human anatomy words and append: `[Franchise Art Style Directive], [Aspect Ratio], 100% environment landscape illustration, completely unpopulated, zero humans, zero people, zero characters, zero figures in the sky, pristine landscape, pure 100% textless artwork, no speech bubbles, no comic SFX, no watermarks.`
4. **Prompt Token Budget (Gate 14 <=450 Tokens) & Token-Insulated Action Trimming:**
   - **Character DNA vs Wardrobe Decoupling:** In `vault/entities.json`, `dna` must contain ONLY facial/anatomical traits. Never duplicate robes, armor, or stances inside `dna`. Duplicating clothing across `dna`, `outfits`, and `posture` causes 3-entity scenes to breach the 1,800-character budget.
   - **Token-Insulated Action Trimming:** When trimming action descriptions to meet budget caps, NEVER use naive string slicing (`.slice(0, N)`), which cuts tokens in half (e.g. `@{Chief.`) and triggers Gate 10 unregistered entity blocks and Gate 30 word-slicer violations. Always use token-boundary-safe truncation (`trimActionSafely`) that truncates at complete words outside open `@{` delimiters.

5. **Autonomous Batch Execution Protocol (The Anti-Single-Turn Halt Gate):**
   - **Continuous Runner Mandate:** Google Flow agent handoffs MUST prepend the continuous execution command `[COMMAND: EXECUTE BATCH AUTONOMOUSLY — CONTINUOUS SEQUENCE]`.
   - **Absolute Ban on Single-Scene Turns:** The Flow Agent is strictly prohibited from stopping after 1 scene or asking for intermediate confirmation. Every batch (24 scenes) must run to 100% completion in a single uninterrupted execution loop.

## 5. Mandatory Deterministic Pre-Flight Linter Execution
Before presenting or exporting any prompt matrix, execute and verify all 33 deterministic gates:
```bash
node studio/scripts/sanitize-matrix.js <franchiseId> <episodeId>
node studio/scripts/audit-matrix.js <franchiseId> <episodeId>
node studio/scripts/audit-policy.js <franchiseId> <episodeId>
```
**Hard Blocker:** Score MUST be 100/100 (Exit Code 0) across all 33 gates (including G06 Policy-Safe Tail Alignment, G14 Token Budget <=450 tokens, G20 Anti-Placeholder Disk Integrity, G23 Establishing Purity, G24 Concrete Color Standard, G25 Chronological Entrance Continuity, G26 Sanctuary Secrecy, G27 Tech-Tree Lifecycle, G30 Stem Novelty, G31 1:1 Staging Header Lock, G32 Semantic Layout-Tone & Immersion, G33 Destruction Lifecycle State, and D-01 Normalized Manifest Signature).
- **Gate G32 (Semantic Layout-Tone & Immersion):** Rejects any Tier C action strip assigned to dialogue/interaction stages without combat verbs, and rejects domestic eating/drinking filler during tension.
- **Gate G33 (Destruction Lifecycle State):** Rejects intact architectural prompts (towering skyscrapers, pristine glass) after an environmental destruction event has reduced the structure to dust or a crater.
- **Gate G12/G34 (Terrain & Seasonal Conflict Blocker):** Rejects prompts introducing seasonal weather (snow, blizzards, frost, winter slush) into zones whose canonical definitions in `vault/zones.json` specify dirt roads, grass, or temperate climates without explicit snow.
- **Cryptographic Dispatch Manifest Synchronization (Gate D-01):** To sign `dispatch_manifest.json`, the hashing context MUST use `AntiSlopValidator.normalizeVaultContext()` so that `entities`, `zones`, and `ledgerEvents` match the exact object references evaluated by `audit-matrix.js`.

## 6. The Chief Storyboard Supervisor & Common-Sense Continuity Audit Protocol
Auditor subagents (`continuity-auditor`, `studio-gatekeeper`) are **strictly prohibited from using static keyword checks**. They must audit scene batches (max 24 scenes per pass) by reading the Spoken Narrative Clause and Visual Prompt side-by-side using human dramatic common sense across the **10 Universal Directing Laws**:
1. **The Establishing Shot Law:** If the narrator is setting the atmosphere or landscape (sunrise, valley, empty room), the camera strictly frames the environment. Living human characters are **strictly forbidden** from appearing in establishing plates.
2. **The Chronological Entrance Law:** Maintain a strict physical ledger of the room. Characters cannot be visible in an enclosure before the story explicitly brings them through the door or describes their waking moment (e.g. Garrett entering at Scene 8 must NOT exist in Scenes 1–7).
3. **The Solo Focus Law:** When a character is alone in quiet thought, reading, or crafting, protect intimacy. Never inject family members, bystanders, or crowds into private character moments.
4. **The Dramatic Beat Alignment Law:** What the viewer sees MUST match what they hear in their ears at that exact second. If audio discusses sketches at the table, visuals must not show them walking in the woods.
5. **The Visual Wardrobe & Concrete Color Isolation Law:** Outfits must use concrete, unambiguous colors (e.g. `rugged warm-brown shirt`). Never use ambiguous words like `"earth-toned"` that cause diffusion models to flip colors or bleed dyes across characters.
6. **The Sanctuary Secrecy & Crowd Prohibition Law:** In secret or secluded sanctuaries (e.g. hidden farm, private washhouse, remote campfire), random bystanders, crowds, villagers, farmhands, and background soldiers are **100% prohibited**.
7. **The Character Role Integrity Law:** Characters must perform actions true to their established narrative situation. Royal fugitives fleeing in exile observe in shock and recover; they do NOT perform manual masonry construction labour on a farm.
8. **The Tech-Tree Environmental Lifecycle Law:** Items, machinery, and architecture (e.g. glass windows, cold cellars, waterwheels, windmills, complex gears) are **strictly forbidden from appearing in scene backgrounds** before their canonical invention/construction milestone in the story.
9. **The Vantage & Elevation Perspective Law (Gate G28):** Camera framing must respect the physical elevation of the scene. Mountain ridge trails cannot depict valley floor farmhouses or cottages in the background, and valley floor zones cannot be framed from high cliff ledges.
10. **The Spoken Future-Plan & Blueprint Law (Gate G29):** When characters discuss unbuilt future blueprints (melting sand into glass windows tomorrow, building a water-wheel next year), the visual prompt must depict characters studying sketches, notebooks, or raw minerals—never the finished structure prematurely.
11. **The Cross-Episode Environmental & Climate Law:** Recurring locations strictly inherit the climate, terrain, and season of preceding episodes. Prompts cannot oscillate between dry dirt and snow or unilaterally alter the regional weather without an explicit multi-episode seasonal shift codified in Series_Bible.md.
12. **The Immutable Prop & Weapon Reference-Lock Law:** Prompts for vaulted weapons and props must strictly reproduce the exact canonical DNA anchor from the vault reference plate (`character_vault/items.json`, `vault/entities.json`). Never introduce ad-hoc styling words or contradictory adjectives in action layers that undermine the visual model (e.g. adding *"smooth spiral carved head"* or *"never metallic"* against an iron-banded quarterstaff). Props and weapons must only be declared in `PROPS` and `<item_refs>` when physically held, worn, or actively manipulated in that scene.
