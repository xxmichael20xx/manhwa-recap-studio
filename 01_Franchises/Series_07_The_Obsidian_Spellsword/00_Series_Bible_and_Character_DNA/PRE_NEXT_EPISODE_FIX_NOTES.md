# Pre-Next-Episode Remediation Notes (`Series_07_The_Obsidian_Spellsword`)

> **STOP — MANDATORY PRE-EPISODE AUDIT BEFORE CREATING `EP04` (OR ANY NEW EPISODE)**
> Verified during the Series 4/5/6/7 reference-integrity audit (`2026-11-11`).
> Do **not** begin drafting `EP04` until the missing `flow_entities.json`, duplicate `00_Prologue_Aiden_Drake.jpg` binding, and matrix defects below are resolved and verified.

---

## 1. Verified Defects Found in `Series_07_The_Obsidian_Spellsword`

### A. Missing `flow_entities.json` & Duplicate Plate Binding (`audit-vault.js`: Defect #1 + Missing File Bypass)
1. **Missing `character_vault/flow_entities.json`:**
   - [`character_vault/flow_entities.json`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_07_The_Obsidian_Spellsword/character_vault/flow_entities.json) does **not exist** on disk! Because the file is absent, `audit-vault.js` skipped checking all `20` vaulted entities against Google Flow bindings, leaving Flow model tags unmapped across all `20` entities (`Julian Vaelgard`, `Duke Gerald Vaelgard`, `Duchess Eleanor Vaelgard`, `Archmage Lyra`, `Master Swordsman Kael`, `High Inquisitor Malakor`, `Vaelgard Silver Training Rapier`, `Principles of Mana Weaving`, `Aiden Drake`, `Obsidian Greatsword`, `Wooden Practice Rod`, `Enchanted Iron-Wood Practice Dummy`, `White Marble Meditation Bench`, `Founding Sword Saint Obsidian Monument`, `Celestial Altar of Ascension`, and the `5` vaulted locations).
2. **Duplicate Entity Plate Binding (`audit-vault.js` Failure, Exit Code `1`):**
   - `00_Prologue_Aiden_Drake.jpg` is shared by two separate IDs in [`vault/entities.json`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_07_The_Obsidian_Spellsword/vault/entities.json): `[aiden_drake, aiden_drake_past_life]` (both resolving to `@{Aiden Drake}`). Merge or disambiguate this duplicate record cleanly so `audit-vault.js` exits `0`.

### B. Prompt Matrix & Compiler Pipeline Health (Existing `EP01–EP03` Telemetry)
Running `node studio/scripts/audit-matrix.js` surfaced recurring defects that must NOT carry over into `EP04`:
- **`EP01_The_Poisoned_God_and_The_1000_Year_Rebirth` (`Score: 93`, Failed):**
  - `20 / 192` `<action_layer>` blocks omit `@{Entity Name}`; `78` `<item_refs>` contain raw `@{...}` braces.
  - `G07` (`137`), `G10` (`158`: `"mana"` / unreferenced keywords), `G31` (`34`: solo `two-shot` + `CAST` desync with `Obsidian Greatsword`), `G35` (`137`: numeric minor age descriptors), `G38` (`1`: `IMG_012` grounded/kneeling posture with eye-level two-shot lens), `G39` (`95`), `D01`.
- **`EP02_The_Ancestral_Vault_and_The_First_True_Spell` (`Score: 93`, Failed):**
  - `21 / 192` `<action_layer>` blocks omit `@{Entity Name}`; `71` `<item_refs>` contain raw `@{...}` braces.
  - `G07` (`157`), `G09` (`3`), `G10` (`159`), `G31` (`2`: `IMG_081–082` `Obsidian Greatsword`), `G35` (`157`), `G39` (`55`), `D01`.
- **`EP03_The_Holy_Inquisitor_and_The_Severed_Blessing` (`Score: 99`, Failed):**
  - `25` `<item_refs>` still carry raw `@{...}` braces.
  - `G10` (`34`: unreferenced `"mana"`), `G38` (`1`: `IMG_154` grounded posture vs eye-level two-shot), `G39` (`68`), `D01`.

---

## 2. Mandatory Pre-`EP04` Flight Checklist for Next Agent

1. **Create Pure-Name `character_vault/flow_entities.json`:** Populate all active `19` unique vaulted entities (`"Entity Name": "@{Entity Name}"`) in `character_vault/flow_entities.json` with zero category prefixes (`Character:`, `Weapon:`, etc.) and confirm every `.jpg` plate exists in `character_vault/` or `00_Characters/`.
2. **Eliminate `[aiden_drake, aiden_drake_past_life]` Duplicate:** Consolidate into one canonical entity (or register a distinct plate if distinct visual age/form is required) and run `node studio/scripts/audit-vault.js Series_07_The_Obsidian_Spellsword` until Exit Code `0`.
3. **1:1 Visual Plate vs `vault/entities.json` Audit:** Visually inspect the existing character and prop plates (`Julian Vaelgard`, `Vaelgard Silver Training Rapier`, `Obsidian Greatsword`, `Principles of Mana Weaving`, etc.) against `vault/entities.json` before `EP04` compilation so zero attribute drift exists.
4. **Strict V2.0 Pipeline on `EP04`:** Run `init-world-state.js` -> `compile-matrix.js` -> `sanitize-matrix.js --dry-run` -> `audit-matrix.js` -> `audit-policy.js`. Ensure `100%` of `<action_layer>` entity mentions use `@{...}`, `<item_refs>` stays clean without braces, solo scenes never use `two-shot` (`G31`), grounded poses obey `G38`, minor DNA obeys `G35`, `16:9` stays Single-Panel Full-Bleed (`G36`), and `audit-matrix.js` exits `0` (`100/100`, `43/43` gates).
