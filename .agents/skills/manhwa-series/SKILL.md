---
name: manhwa-series
description: Universal franchise initialization engine. Enforces format governance (16:9 for new series, legacy 9:16 preservation), Gemini Pro High world architecture, Series_Bible.md (with STUDIO_BIBLE_DIRECTIVES), Per-Act Feature release structure (>= 60 mins), and YouTube_Locked_Package.md. Trigger with /series.
---

# 🎬 Manhwa Series Initialization Engine (`/series`)

## 0. Mandatory Gemini Pro High Model Assignment Gate
- **Lead World Architect Invariant (`Model: "pro"`):** The core creative and architectural phases of `/series`—including premise formulation, high-concept hooks, `Series_Bible.md` authoring, 18-episode multi-arc roadmaps, power systems, and 4-field Character/Prop DNA schemas—MUST be executed by **Gemini Pro High**.
- **Gemini Flash Delegation:** Directory scaffolding, JSON serialization, asset copying, and deterministic CLI validation (`audit-vault.js`) may be delegated to Gemini Flash or deterministic scripts.

## 1. Format Governance & Per-Act Release Architecture Gate (`ask_question`)
Never guess target franchise, protagonist identity, or core themes. Before creating any folder or file, **HALT** and lock via `ask_question`:
1. **Format Governance (16:9 for New Series):** All **new series (Series 07 onwards)** are permanently initialized in **16:9 Full-Bleed Landscape (`1920x1080`)**. Ongoing legacy series (e.g. Series 01) strictly preserve their existing 9:16 format as codified in their `franchise.json`.
2. **Per-Act Feature Architecture (≥ 60 Minutes):** Series bibles must architect episodes into discrete Acts designed for compiled **Per-Act Releases (≥ 60 minutes / 1+ hour)**. Each Act consolidates 3–6 episodic segments to eliminate sub-hour standalone uploads.
3. **Franchise Identity:** Working Title, Protagonist Name, Initial Class/Age, and Awakened Authority.

## 2. Deterministic Scaffolding & Atomic Plate Synthesis Protocol
Proactively execute or invoke `studio/scripts/init-franchise.js` to scaffold `01_Franchises/Series_{XX}_{Canonical_Title}/`:
1. **Subdirectories:** `00_Series_Bible_and_Character_DNA/`, `vault/`, `character_vault/`, `00_Characters/`, `omnibus/`.
2. **Master Series Bible (`Series_Bible.md`):**
   - Include Executive Premise, Clean RPG Progression Math, Complete Unified Entity Roster (protagonist, family, allies, scions, examiners, and all multi-scene bosses/calamities/locations), and **Multi-Episode Arc Roadmap** (4–5 Arcs across ~18 episodes; 3–6 episodes per arc; never 1 Arc = 1 Episode).
   - Embed the mandatory `<!-- STUDIO_BIBLE_DIRECTIVES_START ... STUDIO_BIBLE_DIRECTIVES_END -->` JSON schema (`styleName`, `format`, `voiceId`, `genreRule`, `forbiddenRule`, `crowdRule`, `defaultVaultDna`, `vocabulary`, `spatialEnclosures`). Zero Studio JS/Vue hardcoding permitted.
3. **World Setting Visual Selection Gate:** Generate or ingest 3 distinct world setting concept images in the locked aspect ratio, embed inline, and confirm operator selection.
4. **Master YouTube Package (`YouTube_Locked_Package.md`):** Scaffold locked base title ($\le 84$ chars), `(Episode {{EPISODE_RANGE}})` template ($\le 100$ chars), Episode 1 description template, and thumbnail concepts.
5. **Atomic Vault JSON & Reference Plate Mapping:**
   - Populate `character_vault/characters.json`, `items.json`, and `vault/zones.json` using pure `@{Entity Name}` tokens (ZERO UUIDs) and 4-field DNA (`dna`, `dna_prompt_anchor`, `visual_dna`, `description`).
   - Run `node studio/scripts/audit-vault.js <franchiseId>` to verify disk integrity. Conclude with the **Operator Action & Testing Guide**.
