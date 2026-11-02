---
name: manhwa-series
description: Universal franchise initialization engine. Enforces format lock (9:16 vs 16:9), scaffolds Series_Bible.md (with STUDIO_BIBLE_DIRECTIVES), YouTube_Locked_Package.md, and atomically generates textless vault reference plates. Trigger with /series.
---

# 🎬 Manhwa Series Initialization Engine (`/series`)

## 1. Strict Context Verification Gate (`ask_question`)
Never guess video format, narrative archetype, or protagonist identity. Before creating any folder or file, **HALT** and lock via `ask_question`:
1. **Format Tier:** Format 1 (`9:16 Vertical Webtoon 1080x1920`) vs. Format 2 (`16:9 Full-Bleed Landscape 1920x1080`).
2. **Narrative Archetype:** Archetype A (Betrayal/Sovereign), Archetype B (Regressor/10,000x Calc), Archetype C (Hidden Crafter/Kingdom Builder), or Custom.
3. **Franchise Identity:** Working Title, Protagonist Name, Initial Class/Age, and Awakened Authority.

## 2. Deterministic Scaffolding & Atomic Plate Synthesis Protocol
Proactively execute or invoke `studio/scripts/init-franchise.js` to scaffold `01_Franchises/Series_{XX}_{Canonical_Title}/`:
1. **Subdirectories:** `00_Series_Bible_and_Character_DNA/`, `character_vault/`, `00_Characters/`, `omnibus/`.
2. **Master Series Bible (`Series_Bible.md`):**
   - Include Executive Premise, Clean RPG Progression Math, Complete Unified Entity Roster (protagonist, family, allies, scions, examiners, and all multi-scene bosses/calamities/locations), and **Multi-Episode Arc Roadmap** (4 Arcs across ~18 episodes; 3–6 episodes per arc; never 1 Arc = 1 Episode).
   - Embed the mandatory `<!-- STUDIO_BIBLE_DIRECTIVES_START ... STUDIO_BIBLE_DIRECTIVES_END -->` JSON schema (`styleName`, `format`, `voiceId`, `genreRule`, `forbiddenRule`, `crowdRule`, `defaultVaultDna`, `vocabulary`, `spatialEnclosures`). Zero Studio JS/Vue hardcoding permitted.
3. **World Setting Visual Selection Gate:** Generate 3 distinct world setting concept images in the locked aspect ratio via `image-generator`, embed inline, and confirm operator selection.
4. **Master YouTube Package (`YouTube_Locked_Package.md`):** Scaffold locked base title ($\le 84$ chars), `(Episode {{EPISODE_RANGE}})` template ($\le 100$ chars), Episode 1 description template, and thumbnail concepts.
5. **Atomic Vault JSON & Reference Plate Synthesis (Zero Two-Step Ceremony):**
   - Populate `character_vault/characters.json` and `items.json` using pure `@{Entity Name}` tokens (ZERO UUIDs) and 4-field DNA (`dna`, `dna_prompt_anchor`, `visual_dna`, `description`).
   - **Immediately invoke `image-generator` in the exact same turn** to generate 100% textless master reference plates (`{N}_{Role}_{Name}.jpg`) for all registered entities in `character_vault/` and mirror to `00_Characters/`.
   - Run `node studio/scripts/audit-vault.js <franchiseId>` to confirm Exit Code 0 and `hasPlate: true` across 100% of entities. Conclude with the **Operator Action & Testing Guide**.
