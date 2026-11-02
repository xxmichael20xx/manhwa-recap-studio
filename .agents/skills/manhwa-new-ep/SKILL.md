---
name: manhwa-new-ep
description: End-to-end 6-phase episodic production orchestrator connecting Series Bible grounding, Vault lock, Script + Edge-TTS synthesis, Adversarial Continuity Audit, Matrix assembly, 22-Gate Linter, and YouTube Launchpad packaging. Trigger with /new-ep.
---

# 🚀 Manhwa New Episode Production Orchestrator (`/new-ep`)

## 1. Strict Context Verification & Prior-Episode Gate
1. **Pre-Flight Alignment (`ask_question`):** If target franchise, episode number/subtitle, or format tier is unspecified, **HALT** and confirm via `ask_question`.
2. **Production-First Episode Gate:** Verify that the prior episode has 100% finished artwork plates, compiled video with zero regressions, and explicit operator approval before scaffolding `EP_N+1`. Run `studio/scripts/cleanup-scrap.js` to purge any ghost directories.

## 2. The Non-Negotiable 6-Phase Sequential Pipeline
Never skip, combine, or reorder phases:
- **Phase 0 — Series Bible 5-Point Grounding:** Read `00_Series_Bible_and_Character_DNA/Series_Bible.md` and `STUDIO_BIBLE_DIRECTIVES`. Output a 1-paragraph **Arc Anchor** confirming the parent Multi-Episode Arc, episode milestone, spatial enclosures, roster, weapons, and RPG math rules.
- **Phase 1 — Pre-Script Character, Item & Location Vault Lock (`/vault`):** Scan the planned episode for all new characters, family members, bosses ($\ge 2$ scenes), weapons/props, and recurring locations ($\ge 2$ scenes). Register in `characters.json` / `items.json` with `episodes` arrays and `@{Entity Name}` tokens, synthesize textless plates via `image-generator` into `character_vault/` & `00_Characters/`, and pass `node studio/scripts/audit-vault.js <franchiseId>` (Exit Code 0).
- **Phase 2 — Scriptwriting, Edge-TTS Synthesis & Adversarial Audit (`/story`):**
  1. Draft `01_Episode_Script.md` enforcing slow-burn multi-batch pacing (2–4+ batches per major phase), linear continuity, 5 Lore Auditor gates, `<!-- CLIMAX_START -->` shorts tags, zero `@` tokens in spoken text, and 1:1 clause-level `[IMG_XXX]` tags.
  2. Run `node studio/scripts/audit-script.js <franchiseId> <episodeId>` (Exit Code 0).
  3. Immediately execute `node studio/scripts/generate-tts.js <franchiseId> <episodeId> <voice>` to generate real scene MP3s, `.srt` cues, and `audio_telemetry.json`.
  4. Spawn independent subagent `continuity-auditor` to verify script against `Series_Bible.md`, `vault/entities.json`, `vault/zones.json`, and `state_events.jsonl` (micro-DNA persistence, zero resurrected destroyed weapons). **Halt** until 100% PASS.
- **Phase 3 — Continuity State-Machine & Prompt Matrix Assembly (`/matrix`):** Build the scene continuity state tracking table (wardrobe, prop lifecycle, 2-actor co-presence). Partition into dynamic 24-scene batches ($\lceil N_{\text{scenes}} / 24 \rceil$), apply the 3-Tier Visual Engine (~70% Tier B/C, ~30% Tier A), and run `node studio/scripts/sanitize-matrix.js <franchiseId> <episodeId>`. Output both Tier 1 Flow Master Instructions and Tier 2 XML decks.
- **Phase 4 — 22-Gate Deterministic Linter & QA Gatekeeper (`/matrix`):**
  1. Execute `node studio/scripts/audit-matrix.js <franchiseId> <episodeId>` AND `node studio/scripts/audit-policy.js <franchiseId> <episodeId>`. Fix any defects until Score = 100/100 (Exit Code 0).
  2. Spawn independent subagent `studio-gatekeeper` to verify `audio_telemetry.json`, 100/100 linter score, and micro-DNA persistence, issuing the **Studio Production Seal**.
- **Phase 5 & 6 — Compilation, Frame Proof & Launchpad Packaging (`/compiler`, `/launch`, `/thumb`):** Compile batch/master MP4s, extract 2–4 FFmpeg proof frames, update `03_YouTube_Package.md` from `YouTube_Locked_Package.md`, and present the **Lead Lore & Visual Matrix Audit Table** + **Operator Action & Testing Guide**.
