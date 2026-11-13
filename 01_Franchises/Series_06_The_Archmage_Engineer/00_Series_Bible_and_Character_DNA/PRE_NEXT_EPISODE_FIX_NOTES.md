# Pre-Next-Episode Remediation Notes (`Series_06_The_Archmage_Engineer`)

> **STOP — MANDATORY PRE-EPISODE AUDIT BEFORE CREATING `EP03` (OR ANY NEW EPISODE)**
> Verified during the Series 4/5/6/7 reference-integrity audit (`2026-11-11`).
> Do **not** begin drafting `EP03` until all `17` vault/Flow defects and prompt-budget issues below are fixed and `audit-vault.js` passes with Exit Code `0`.

---

## 1. Verified Defects Found in `Series_06_The_Archmage_Engineer`

### A. Vault Lossy DNA Truncation & Missing Flow Bindings (`audit-vault.js`: 17 Defects)
Running `node studio/scripts/audit-vault.js Series_06_The_Archmage_Engineer` failed with **17 defects**:
1. **8 Lossy DNA Truncations in [`vault/entities.json`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_06_The_Archmage_Engineer/vault/entities.json) vs `character_vault/`:**
   Agents shortened/compressed reference DNA in `entities.json`, risking hair/outfit/architecture drift in Google Flow:
   - `@{Garrett Miller}` (`garrett_miller`): `305` chars vs `440` core chars in `character_vault`
   - `@{Clara Miller}` (`clara_miller`): `246` chars vs `367` core chars in `character_vault`
   - `@{Maya Miller}` (`maya_miller`): `271` chars vs `399` core chars in `character_vault`
   - `@{Princess Seraphina}` (`princess_seraphina`): `243` chars vs `370` core chars in `character_vault`
   - `@{Sir Roland Vance}` (`sir_roland_vance`): `254` chars vs `363` core chars in `character_vault`
   - `@{Empress Evelyn}` (`empress_evelyn`): `227` chars vs `322` core chars in `character_vault`
   - `@{Goddess Celestia}` (`goddess_celestia`): `224` chars vs `358` core chars in `character_vault`
   - `@{Old Miller Farm}` (`old_miller_farm`): `116` chars vs `289` core chars in `character_vault`
2. **9 Entities Missing from [`flow_entities.json`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_06_The_Archmage_Engineer/character_vault/flow_entities.json):**
   `flow_entities.json` currently locks only `13` entities while `vault/entities.json` contains `22`. The following `9` vaulted entities are missing from `flow_entities.json`:
   - `@{Cale Dawson}` (`14_Past_Life_Cale_Dawson.jpg`)
   - `@{Simon Vane}` (`15_Antagonist_Simon_Vane.jpg`)
   - `@{Guild Fire Mage}` (`16_Antagonist_Guild_Fire_Mage.jpg`)
   - `@{Scrying Raven}` (`17_Item_Scrying_Raven.jpg`)
   - `@{Starlight the Mare}` (`18_Mount_Starlight_Mare.jpg`)
   - `@{Oakhaven Tax Guild Chamber}` (`19_Location_Oakhaven_Tax_Chamber.jpg`)
   - `@{Emerald Valley Forest Trail}` (`20_Location_Emerald_Valley_Forest_Trail.jpg`)
   - `@{Old Miller Cottage Interior}` (`21_Location_Old_Miller_Cottage_Interior.jpg`)
   - `@{Miller Sanctuary Bath Courtyard}` (`22_Location_Miller_Sanctuary_Bath_Courtyard.jpg`)
3. **Under-Sized Prompt Token Cap in [`franchise.json`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_06_The_Archmage_Engineer/franchise.json):**
   - `pacing.max_prompt_tokens` is still set to `450` (legacy cap; caused `141` `G14` token overflows in `EP01`). Once `entities.json` is restored to 1:1 non-lossy DNA, raise `max_prompt_tokens` to `700–800` (matching `Series_05` and `Series_07`) so multi-character + prop + location scenes never fail `G14` or get truncated.

### B. Prompt Matrix & World State Pipeline Health (Existing `EP01–EP02` Telemetry)
- **`EP01_The_Awakening_and_The_Scent_of_Sanctuary` (`Score: 85`, Failed):** missing `world_state.json` / `held_props` (`G34`), missing `<action_layer>` (`G30`, `480` scenes), `G07` (`480`), `G12` (`480`), `G14` (`141`), `G35` (`864`), `G36` (`425` multi-panel in `16:9`), `G39` (`20` batches).
- **`EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival` (`Score: 90`, Failed):** missing `world_state.json` / `held_props` (`G34`), `G07` (`383`), `G12` (`331`), `G27` premature glass (`129`), `G29` (`5`), `G30` template repetition (`395`), `G35` (`543`), `G36` (`360`), `G39` (`20` batches).

---

## 2. Mandatory Pre-`EP03` Flight Checklist for Next Agent

1. **Restore 1:1 Non-Lossy DNA in `vault/entities.json`:** Transcribe full physical & attire anchors from `character_vault/` into all `8` flagged entities above (`Garrett Miller`, `Clara Miller`, `Maya Miller`, `Princess Seraphina`, `Sir Roland Vance`, `Empress Evelyn`, `Goddess Celestia`, `Old Miller Farm`), verifying zero semantic contradictions against reference plates.
2. **Sync `flow_entities.json` to All `22`+ Entities:** Add the `9` missing pure-name `@{Entity Name}` keys, fix `pacing.max_prompt_tokens` (`450 -> 750/800`) in `franchise.json`, and run `node studio/scripts/audit-vault.js Series_06_The_Archmage_Engineer` until Exit Code `0`.
3. **Strict V2.0 Pipeline on `EP03`:** Use `init-world-state.js` -> `compile-matrix.js` -> `sanitize-matrix.js --dry-run` -> `audit-matrix.js` -> `audit-policy.js`. Ensure `@{Entity Name}` is wrapped inside `<action_layer>`, `16:9` stays 100% Single-Panel Full-Bleed (`G36`), `G35` uses filter-safe descriptors for minors, `G27`/`G29` tech-tree chronology is respected, and `audit-matrix.js` passes **`100/100` (`43/43`, Exit Code `0`)**.
