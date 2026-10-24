---
name: manhwa-vault
description: Franchise Character & Item DNA vault manager. Enforces pre-production vault lock, textless reference plates, native character name token binding (@{Character Name}), items/props vault, and 1:1 Google Flow character setup. Trigger with /vault.
---

# 👑 Manhwa Character & Item Vault Engine (`/vault`)

> **Master SOP for Character DNA, Master Reference Plates & Google Flow Entity Management**  
> **Slash Command:** `/vault`  
> **Workspace Root:** `quirky-chandrasekhar`

---

## 🎯 Mandatory Interactive Auto-Grill Pre-Flight (`ask_question`)

Whenever `/vault` is invoked, the agent MUST immediately halt and initiate an interactive `ask_question` interview:

```
[Interactive Pre-Flight Alignment Modal]
1. Target Franchise Selection:
   - Dynamically list active franchises from 01_Franchises/ (e.g. Active Series Vault)
2. Vault Operation:
   - (Recommended) Audit Vault Models, Reference Plates & Character DNA Anchors
   - Register New Character / Boss / Weapon with DNA Anchor
   - Generate Master Reference Plate Artwork (9:16 or 16:9)
```

---

## 👑 The Mandatory Franchise Character Vault Invariant

1. **Pre-Production Character Vault Lock:** Strictly forbidden from generating episodic prompt matrices for any franchise until the **Character Vault** (`character_vault/`) is populated with locked Character DNA tokens and high-fidelity reference plates for the Protagonist, Antagonist, and Supporting cast.
2. **The Atomic Character Creation & Master Plate Synthesis Invariant:**
   - **Mandatory Atomic Generation:** Strictly forbidden from creating or scaffolding `character_vault/characters.json` as a text-only placeholder without simultaneously synthesizing its corresponding master reference plates.
   - **Autonomous Image Invocation:** Whenever a new franchise is initialized via `/series` or a new character is registered in `/vault`, the agent MUST immediately and autonomously invoke `image-generator` in the exact same turn to synthesize textless master reference plates matching the franchise video format (9:16 vertical for webtoon franchises, 16:9 horizontal for widescreen franchises) (`{N}_{Role}_{Name}.jpg`) for all newly defined characters.
   - **Zero Two-Step Ceremony:** The agent is strictly forbidden from pausing or asking the operator to run a separate generation command. Files must be saved directly into `character_vault/` and mirrored into `00_Characters/` before handing the turn back to the operator.
3. **Character Token Injection:** Every scene in the prompt matrix must explicitly reference locked character anchors (`@{Character Name}`) to ensure zero facial or costume morphing across batches.
4. **Mandatory 100% Textless Reference Plates (Zero-Banner Seed Invariant):**
   - 100% of master character plates, costume variants, and item references stored in `character_vault/` or `models/` MUST be completely sanitized of burned-in typography, text headers, title banners, or coordinate watermarks before being used as diffusion reference seeds.
   - Diffusion image conditioning ingests raw pixels. Any text banner in a seed plate will replicate persistently across episodic generations.
5. **The Bidirectional Vault Entity Reconciliation Invariant (1:1 Flow ↔ Vault Parity):**
   - **Unified Roster Assembly:** Strictly forbidden from scaffolding `characters.json` from only humanoid cast lists. When initializing any franchise or updating the vault, ALL entities—including protagonists, allies, scions, examiners, AND all multi-scene Bosses, Calamities, Divine Beasts, and Automatons from all narrative arcs—MUST be compiled into a single unified roster before creating files.
   - **Mandatory 1:1 Parity Check:** Before concluding any series scaffolding or vault update, the agent MUST execute a programmatic cross-verification:
     - 100% of entities in `characters.json` MUST have `hasPlate: true` with a generated plate matching the franchise format in `character_vault/` and `00_Characters/`.
     - Every entity in `characters.json` and `items.json` MUST explicitly declare its `episodes` array (e.g. `"episodes": ["EP01", "EP02"]`) to guarantee 100% mathematical consistency across all Studio views.
     - 100% of signature weapons, tactical props, and colossal artifacts MUST have valid master plates in `character_vault/`.
6. **The Mandatory Family & Kinship Pre-Registration Law:**
   - Any family member (father, mother, sister, brother, son, daughter, grandparents, aunt, uncle, clan kin) that appears in the episodic narrative, confesses memories, shares living quarters, or interacts with the protagonist MUST be formally pre-registered in `character_vault/characters.json` and `00_Characters/` with a dedicated master reference plate BEFORE prompt matrix generation.
   - Never rely on generic role descriptions in the prompt matrix. Without a pre-registered vault entity and reference plate, diffusion models generate inconsistent, mutating strangers whenever family scenes occur.

---

## 👑 The Permanent Name-Based Entity Resolution Standard (`@{Character Name}`)

1. **Native Google Flow Name-Linking Law (Zero-UUID Invariant):** Google Flow does NOT expose database UUIDs. Google Flow resolves character entities directly by character name in the active project. All prompt matrices, XML decks, and Studio views format character and item references with explicit curly braces: `@{Character Name}` (e.g. `@{Lu Chen}`, `@{Wang Bao}`, `@{Gu Tianyu}`, `@{Heavenly Dao Simulator Interface}`). Using UUIDs anywhere in prompt generation, character schemas, or UI is strictly and permanently prohibited.
2. **Mandatory Project Agent Instruction:** To guarantee 100% resolution consistency across every session, add this rule once into Google Flow's **Agent Instructions** panel (document icon &rarr; + Add instruction):
   > `"Always map @{Character Name} tags to their corresponding character entity references in this project."`
3. **Exact Name Parity:** The name referenced in prompt tags MUST match the exact character/item name registered in the franchise's `characters.json` / `items.json` and Google Flow project library. Use the Studio's 1-click **"Name"** button to copy clean reference names without `@` or `{}` when creating characters in Flow.
4. **Fully Unlocked Prompt Dispatch:** In Manhwa Recap Studio (`PromptMatrixView.vue`), all prompt copying and batch XML generation are permanently unlocked in native `@{Name}` mode with zero UUID checks or gates.

---

## 🏛️ Item & Prop DNA Vault (`items.json`)

1. **Signature Weapons & Artifacts:** Registered in `character_vault/items.json` with locked Item DNA tokens (e.g. `@{Weapon: Custom Spirit Blade}`).
2. **Mandatory Visual Reference Plates for Items:** Signature weapons and key environmental props MUST have a generated master reference plate saved in `character_vault/` (`08_Weapon_...jpg`) and mapped in `items.json`.
3. **Spatial Scene-Block Locking:** Consecutive scenes in the same location must use an identical 15–20 word locked environment string across the entire cluster.

---

## 👾 Multi-Scene Antagonist & Boss Vault Invariant

Any recurring monster, boss, or elite creature appearing across $\ge 3$ scenes MUST have:
1. A dedicated master reference plate registered in `character_vault/` (e.g. `07_Boss_Asura_Blood_Sovereign.jpg`).
2. A registered entry with visual DNA anchor in `characters.json`.
3. A locked name token binding (`@{Boss Name}`).

---

## 🗡️ Mandatory Weapon, Tactical Prop & Monolith Entity Extraction (Google Flow Parity)

1. **Google Flow 1:1 Character Entity Invariant:** Google Flow does not possess an isolated "Item" reference conditioning tab. To lock visual conditioning for weapons and props via `@{Character Name}`, all signature equipment MUST be created under "Characters" in Google Flow using their clean name.
2. **Mandatory Master Reference Plates for Equipment:**
   - Any weapon wielded in combat or recurring across $\ge 2$ scenes must have a standalone 9:16 vertical textless master reference plate generated on a neutral studio background.
   - Any tactical prop (e.g. scanners, talismans) or colossal world artifact (e.g. ranking steles, monoliths) must have a standalone 9:16 reference plate.
3. **Unified Vault Roster:** All weapons, props, and artifacts must be catalogued in `characters.json` and `items.json` with dedicated tokens (`@{Item Name}`) and emitted under `character_refs`.
4. **Strict Whole-Word & Multi-Word Token Matching:** Weapons and tactical props must NEVER be bound via single generic noun substrings (e.g. generic `"staff"` matching `"Carved Blackwood Staff"`, generic `"blade"` matching `"Jade Spirit Blade"`) or geographic words. Binding requires exact multi-word matching (`"jade spirit blade"`, `"custom spirit blade"`).
5. **Chronological Weapon Lifecycle Gate:** Weapons and signature equipment must NEVER be bound to scenes prior to their canonical creation, crafting, or acquisition scene.
6. **Chronological Character Phase & Attire Model Variants:**
   - When a character undergoes an age advancement, timeskip, or canonical wardrobe evolution, a dedicated character variant plate (e.g. `Michael Montrey (Wolf-Skin)`) MUST be registered in `characters.json` with an atomic master reference plate.
   - Downstream prompt matrices must strictly bind the appropriate phase model token to prevent regressions to outdated child/peasant attire.
