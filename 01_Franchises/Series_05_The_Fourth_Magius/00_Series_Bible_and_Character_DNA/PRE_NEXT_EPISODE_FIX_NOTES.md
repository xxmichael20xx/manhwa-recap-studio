# Pre-Next-Episode Remediation Notes (`Series_05_The_Fourth_Magius`)

> **STATUS (`2026-11-12`): PRE-`EP04` VAULT & COMPILER REMEDIATION COMPLETED FOR `EP04`**
> - All legacy UUIDs, `Boss:`/`Weapon:`/`Artifact:`/`Item:`/`Location:` prefixes, `Mountain Stone Troll` omission, minor youth descriptors (`G35`), lighting modes, and `16:9` Single-Panel formatting were remediated before `EP04` (`audit-vault.js` reached Exit Code `0` on the `22` pre-`EP04` entities).
> - `EP04_The_Road_to_the_Capital_and_The_Entrance_Exam` (`192` scenes, `8` batches) + `EP05–EP07` Act II expansion added `30` total new entities (`15` for `EP04` [`19`–`33`], `15` for `EP05`–`EP07` [`34`–`48`]; `52` total in vault). All `15` `EP04` reference plates (`19`–`33`) are present on disk in both `character_vault/` and `00_Characters/`; plates `34`–`48` have one-click `generation_prompt` values embedded in Studio UI for operator generation in Google Flow.

---

## 1. Pre-`EP04` Audit History & Remediation Record

### A. Vault & Google Flow Reference Bindings (Resolved `2026-11-12`)
1. **Legacy UUID Values & Prefixed Keys in [`flow_entities.json`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault/flow_entities.json) — RESOLVED:**
   - Migrated to pure `"Entity Name": "@{Entity Name}"` mappings across all `37` entities (`Mountain Stone Troll` included; `Boss:`/`Location:` prefixes stripped from `entities.json`).
   - Replaced legacy SD tail strings and raw child age/boy descriptors in `characters.json` / `items.json` / `entities.json`.
2. **Recommended Fix Before `EP04`:**
   - Migrate [`flow_entities.json`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault/flow_entities.json) to pure `@{Entity Name}` map entries for all `22` entities (preserving any legacy Flow project compatibility in `legacyFlowNameAllowlist` only if an active Google Flow project still binds old UUIDs; never drop active characters or props).
   - Remove the `Boss:` prefix on `Calamity Abyssal Wyrm` in `vault/entities.json` if starting a clean Google Flow project for `EP04+`, and verify `1:1` non-lossy DNA parity between every approved plate in `character_vault/` and `vault/entities.json`.
   - Confirm `node studio/scripts/audit-vault.js Series_05_The_Fourth_Magius` exits with **Code `0`**.

### B. Prompt Matrix, World State & Compiler Pipeline Health (Existing `EP01–EP03` Telemetry)
Running `node studio/scripts/audit-matrix.js` on existing episodes revealed structural drift from legacy/shortcut compilation that MUST NOT be repeated in `EP04`:
- **`EP03_The_First_Breakthrough_and_The_Mercenary_Crucible` (`Score: 94`, Failed):**
  - `141 / 336` `<action_layer>` blocks omit `@{Entity Name}` tokens; `167` `<item_refs>` still carry raw `@{...}` braces.
  - `G31` (`108` scenes): solo casts (`CAST.length <= 1`) assigned `two-shot` framing (triggers phantom characters).
  - `G10` (`72` scenes): unreferenced material/object keywords (`"granite"`, etc.) without matching declared entity or negative suppression.
  - `G11` (`1` scene): invalid outfit key `"wolf_skin"` for `"michael_montrey_child"` in `state_events.jsonl` (`IMG_169`).
  - `G35` (`671` hits): numeric child age / raw youth body-build tokens triggered policy shields; must use filter-safe manhwa descriptors (`young noble heir`, `slender aristocratic build`).
  - `G36` (`329` scenes): legacy multi-panel comic strip framing inside 16:9 widescreen series.
  - `G39` (`14` batches): `0` unique lenses recognised per batch due to legacy `<lens>` schema drift.
- **`EP02_The_Painless_Crafts_and_The_Agony_of_Magic` (`Score: 86`, Failed):** missing `world_state.json` / `held_props` (`G34`), missing `<action_layer>` (`G30`, `288` scenes), `G05`/`G06`/`G07`/`G12`/`G35`/`G36`/`G39` failures.
- **`EP01_The_Last_Archmage_and_The_Discarded_Babe`:** throws `TypeError` at `antiSlopValidator.js:871` (`scene.zone` is `null`) because it predates V2.0 `zone` headers.

---

## 2. Mandatory Pre-`EP04` Flight Checklist for Next Agent

1. **1:1 Non-Lossy DNA Lock:** Verify every entity in `vault/entities.json` (`22`+ entries) contains full, un-truncated physical DNA matching its approved reference plate (hair length, hair colour, eye colour, signature outfit items, exact prop/weapon materials) with **zero** summaries or adjectives contradicting the plate.
2. **Pure `flow_entities.json` Sync:** Ensure every active character, monster, weapon/prop, and recurring location (including `Mountain Stone Troll`) is mapped cleanly with `"Entity Name": "@{Entity Name}"` and verify `node studio/scripts/audit-vault.js Series_05_The_Fourth_Magius` returns Exit Code `0`.
3. **Strict V2.0 Pipeline on `EP04`:**
   - Run `init-world-state.js` -> `compile-matrix.js` -> `sanitize-matrix.js --dry-run` -> `audit-matrix.js` -> `audit-policy.js`.
   - Ensure `<action_layer>` wraps every physically staged entity/prop in `@{Entity Name}`, `<item_refs>` stays normalized without `@{}` braces, `16:9` uses Single-Panel Full-Bleed framing only (`G36`), solo scenes never use `two-shot` (`G31`), and `G35` minor-safety descriptors remain 100% clean.
   - Require **`100/100` (`43/43` Pre-Flight Gates PASS, Exit Code `0`)** before operator handoff.
