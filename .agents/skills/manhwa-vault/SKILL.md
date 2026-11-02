---
name: manhwa-vault
description: Franchise Character, Family, Boss, Weapon/Prop, and Location DNA vault manager. Enforces 4-field DNA schemas, pure @{Entity Name} token resolution (zero UUIDs), atomic textless reference plate generation, and disk parity. Trigger with /vault.
---

# 👑 Manhwa Character, Item & Location Vault Engine (`/vault`)

## 1. Strict Context Verification & CLI Pre-Flight Gate
- **Missing Context Halt:** If target franchise or entity specifications (role, age/build, wardrobe, weapon morphology) are missing, **HALT IMMEDIATELY** and ask targeted bulleted questions via `ask_question`.
- **Deterministic CLI Audit:** Always run `node studio/scripts/audit-vault.js <franchiseId>` (use `--fix` to heal dual keys in <200ms) before and after vault updates. Exit Code MUST be 0.

## 2. Core Vault Registration & Atomic Synthesis Laws
1. **Unified Multi-Entity Roster Scope:** Register ALL entities appearing across $\ge 2$ scenes (or bosses $\ge 3$ scenes) in `character_vault/characters.json`, `items.json`, and `vault/entities.json`:
   - **Humanoid Cast & Family Members:** Protagonist, antagonists, examiners, and ALL named family members (parents, siblings, clan kin—anonymous family role nouns like *"his mother"* are strictly banned).
   - **Chronological Phase / Wardrobe Variants:** Whenever a character undergoes a timeskip or canonical attire shift (e.g. `Michael Montrey (Wolf-Skin)`), register a dedicated variant entity and reference plate.
   - **Monsters, Bosses & Constructs:** Every multi-scene beast, calamity, or automaton (`@{Calamity Abyssal Wyrm}`).
   - **Signature Weapons, Tactical Props & Monoliths:** Registered as first-class entities in both `items.json` and Google Flow's "Characters" tab using pure clean names (`@{Carved Blackwood Staff}`, `@{Jade Spirit Blade}`—category prefixes like `Weapon:` or `Item:` are strictly banned by Gate 21).
   - **Multi-Scene Locations (Gate 19):** Any room, courtyard, or wilderness zone appearing in $\ge 2$ scenes MUST be registered as a Location entity (`{N}_Location_{Name}.jpg`) and bound in `<character_refs>`.
2. **Mandatory 4-Field DNA Schema & Episode Array:**
   - Every entity entry MUST define: `dna`, `dna_prompt_anchor` (micro-details like *green shirt with cartoon carrot graphic*, scars, emblems locked permanently via the **Carrot Sticker Law**), `visual_dna`, `description`, and an explicit `"episodes": ["EP01", "EP02"]` array.
3. **Minor Character DNA Standardization (Age Lock & Safety Filter Shield):**
   - Characters under 18 MUST lock explicit numeric age and standard gender build (`10-year-old boy build`, `11-year-old royal build`, `13-year-old girl build`). Never use vague role nouns like `"youthful craftsman build"` that cause AI diffusion models to scale minors into adults.
   - Strictly avoid sensitive anatomical couplings (`"child build"`, `"child proportions"`, `"childlike posture"`). Always use safe posture and facial tokens: `"soft round youthful face"`, `"relaxed youthful posture"`, `"bright youthful smile"`.
4. **Permanent Name-Based Token Standard (`@{Entity Name}` — Zero UUIDs):**
   - Format all tokens strictly with curly braces `@{Entity Name}` matching `characters.json` bit-for-bit. Internal database UUIDs are permanently banned. Ensure Google Flow Agent Instructions include: `"Always map @{Character Name} tags to their corresponding character entity references in this project."`
5. **Atomic 100% Textless Reference Plate Generation (Gate 20):**
   - Never scaffold JSON entries without simultaneously invoking `image-generator` in the same turn to synthesize 100% textless master reference plates (matching franchise aspect ratio `9:16` or `16:9`, neutral studio background for characters/weapons, zero banners/typography/meta-labels). Save to `character_vault/` and mirror to `00_Characters/`.
   - **Anti-Clone Hash Invariant:** Every master reference plate on disk MUST possess a unique SHA-256 hash. Copying an existing character plate as a dummy placeholder for another entity is strictly prohibited and actively blocked by `audit-vault.js`.
6. **Vault-to-Deck Cascading Propagation:** Whenever a vault plate or world setting is added/updated, autonomously propagate the updated spatial/DNA tokens across `Series_Bible.md`, Tier 1 Flow Master Instructions, and `02_Prompt_Matrix.md`.
