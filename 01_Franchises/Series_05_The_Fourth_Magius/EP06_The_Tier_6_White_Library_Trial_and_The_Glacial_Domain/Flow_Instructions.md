# Google Flow Master Production Instructions — Series 05 EP06

> **Franchise:** *The Fourth Magius: Rebirth of the Discarded Scion* (`Series_05_The_Fourth_Magius`)  
> **Episode:** `EP06_The_Tier_6_White_Library_Trial_and_The_Glacial_Domain`  
> **Studio Prompt Viewer URL:** [http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP06_The_Tier_6_White_Library_Trial_and_The_Glacial_Domain](http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP06_The_Tier_6_White_Library_Trial_and_The_Glacial_Domain)  
> **Target Format:** `16:9` Full-Bleed Landscape (`1920x1080` / `16:9` Horizontal)  
> **Total Scenes:** `168` Scenes across `7` Batches (`24` scenes / batch)  
> **Vault Directory:** [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) / [`00_Characters/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/00_Characters)  
> **Destination Folder for Generated Images:** [`images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/EP06_The_Tier_6_White_Library_Trial_and_The_Glacial_Domain/images)

---

## ✅ 0. Vault Plate Status & New Act II Entity Cards

All `10` `EP06` Google Flow entity reference plates (`characters`, `creatures`, `weapons`, `props`, and `locations`) are mapped to the studio hierarchy.

> [!NOTE]
> Plates `39`, `40`, `41`, and `46` are newly architected for Act II. The operator can generate their reference plates in Google Flow with a 1-click prompt copy from the **Studio Vault** interface at [http://localhost:3100/franchises/Series_05_The_Fourth_Magius](http://localhost:3100/franchises/Series_05_The_Fourth_Magius). Once generated and placed in `character_vault/`, Gate `G20` will achieve 43/43 `[PASS]`.

---

## ⚡ Tier 1: Master Agent Instructions (Set Once in Google Flow Project)

Create or open the Google Flow project for **Series 05 Act II (`EP04–EP07`)** and paste the following block into Google Flow's **Agent Instructions** panel (Document Icon &rarr; *+ Add Instruction*):

```text
[SYSTEM DIRECTIVE: GOOGLE FLOW MASTER AGENT INSTRUCTIONS — 16:9 FULL BLEED LANDSCAPE]

🤖 AUTONOMOUS WAVE-OF-8 EXECUTION PROTOCOL (GENERATE BY 8 -> RENAME -> COLLECTION):
1. ROLE: You are an Autonomous Batch Production Engine, NOT an interactive conversational assistant.
2. WAVE-OF-8 EXECUTION MANDATE: When provided with an XML <batch> or multiple <scene> nodes, process them automatically in consecutive waves of AT MOST 8 SCENES AT A TIME (e.g., Wave 1: 1–8, Wave 2: 9–16, Wave 3: 17–24; if <= 8 scenes are provided, run in a single wave). Never fire all 24 generations in one burst.
3. STRICT PER-WAVE SEQUENCE (GENERATE BY 8 -> RENAME -> COLLECTION):
   - STEP 1 (Generate): Generate up to 8 scenes concurrently in the active wave.
   - STEP 2 (Rename): Immediately after that wave finishes generating, rename every image to its exact <scene filename="IMG_XXX.jpg"> attribute (e.g., IMG_001.jpg).
   - STEP 3 (Collection): Assign/organize all renamed images from that wave into the target collection (create if not present; never mix with prior batches), then automatically start the next wave of 8.
4. ABSOLUTE HALT BAN (ZERO CONFIRMATION PAUSES):
   - NEVER stop between waves to ask "Should I proceed?", "How does this look?", or pause for confirmation, and never output per-scene progress narration.
5. TERMINAL CONDITION: Return your final response ONLY AFTER 100% of the scenes across all waves have been generated, renamed, and organized into the target collection.
6. RATE LIMIT AUTO-RETRY: If a scene hits a temporary API rate limit, retry it automatically and finish its rename + collection assignment before advancing to the next wave.

📁 COLLECTION ISOLATION & STANDALONE SCENES:
1. Create and isolate each batch within its dedicated collection after each wave finishes generating and renaming (e.g., "Series 05 EP06 Batch 01" through "Series 05 EP06 Batch 07"). Never mix scenes across batches.
2. STANDALONE SCENES: Generate EXACTLY ONE standalone, edge-to-edge 16:9 horizontal widescreen landscape image (1920x1080 full bleed) per <scene> node. Zero comic strips, zero multi-panel grids, zero storyboards, zero collages.

🚫 ZERO-TEXT MANDATE (STRICTLY ENFORCED):
- 100% pure textless illustration artwork.
- ABSOLUTELY ZERO Hangul (한글), English words/letters, kanji, numbers, speech bubbles, dialogue balloons, sound effects (SFX), subtitles, captions, watermarks, signatures, chapter titles, or UI labels.

👥 ACTOR & ANATOMICAL INTEGRITY:
- Flawless human anatomy: exactly two arms, two legs, five individual fingers per hand, natural articulation. Complete limbs, pristine anatomy.
- ZERO extra limbs, mutated hands, duplicate body parts, fused fingers, floating hands, or detached ghost limbs.
- Every hand holding a weapon, staff, wand, or prop MUST be physically and seamlessly attached to the forearm and shoulder.
- SINGLE PROTAGONIST MANDATE: Strictly ONE single instance of @{Michael Montrey (Academy)} per frame. Never clone or duplicate the main character. Keep background academy students in soft depth-of-field blur.
- MONSTER INTEGRITY: @{Permafrost Trial Colossus} is a colossal 12-foot crystalline permafrost colossus (single central sapphire eye slit, faceted crystal armor, jagged frost spires). Never render as human soldiers or knights.

🏛️ SPATIAL & CAMERA INTEGRITY:
- Strictly adhere to the environment defined in the prompt.
- Snow Quarantine: Frost, blizzard, and mirror-ice are strictly isolated to @{Frozen Astral Crucible}. Zero snow in dormitory, white library, or courtyard!
- Single unified horizontal 16:9 camera perspective (zero split 50/50 rooms or multi-panel comic borders).

🎨 MASTER ART STYLE:
- High fantasy action manhwa webtoon art style, sharp black ink linework, clean crisp illumination, vibrant high-contrast cel shading, horizontal 16:9 (1920x1080 full bleed), pure textless artwork.

🔗 CHARACTER, PROP & LOCATION REFERENCE MAPPING:
- Always map @{Entity Name} tags directly to their corresponding entity references in this project (using pure names with zero category prefixes):
  @{Michael Montrey (Academy)}, @{Permafrost Trial Colossus}, @{Proctor Alistair}, @{Carved Blackwood Staff}, @{The Primordial Codex}, @{Grand Ranking Stele}, @{Academy Private Dormitory Chamber}, @{The White Dimension Library}, @{Frozen Astral Crucible}, @{Imperial Arcane Academy Courtyard}.
```

---

## 🎨 1. Required Flow Entity Cards (`Series_05_The_Fourth_Magius` `EP06`)

In Google Flow's **"Characters"** / **"References"** tab, upload each plate from [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures & Digital Products/Manhwa Recap Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) using the **exact Flow Card Name** (zero prefixes like `Character:` or `Location:`):

### Characters & Creatures (`3`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | `Michael Montrey (Academy)` | `@{Michael Montrey (Academy)}` | `19_Protagonist_Michael_Academy.jpg` | Verified on disk |
| 2 | `Permafrost Trial Colossus` | `@{Permafrost Trial Colossus}` | `41_Boss_Glacial_Sovereign_Construct.jpg` | New Act II Plate |
| 3 | `Proctor Alistair` | `@{Proctor Alistair}` | `21_Supporting_Proctor_Alistair.jpg` | Verified on disk |

### Weapons & Props (`3`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :---: |
| 4 | `Carved Blackwood Staff` | `@{Carved Blackwood Staff}` | `08_Weapon_Blackwood_Staff.jpg` | Verified on disk |
| 5 | `The Primordial Codex` | `@{The Primordial Codex}` | `07_Artifact_Primordial_Codex.jpg` | Verified on disk |
| 6 | `Grand Ranking Stele` | `@{Grand Ranking Stele}` | `46_Prop_Labyrinth_Ranking_Monolith.jpg` | New Act II Plate |

### Locations & Spatial Enclosures (`4`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :---: |
| 7 | `Academy Private Dormitory Chamber` | `@{Academy Private Dormitory Chamber}` | `39_Location_Academy_Private_Dormitory.jpg` | New Act II Plate |
| 8 | `The White Dimension Library` | `@{The White Dimension Library}` | `12_Location_White_Dimension_Library.jpg` | Verified on disk |
| 9 | `Frozen Astral Crucible` | `@{Frozen Astral Crucible}` | `40_Location_Frozen_Astral_Crucible.jpg` | New Act II Plate |
| 10 | `Imperial Arcane Academy Courtyard` | `@{Imperial Arcane Academy Courtyard}` | `31_Location_Academy_Courtyard.jpg` | Verified on disk |

---

## 🚀 2. Wave-of-8 Execution Plan (Batches 01–07)

Generate each batch via [http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP06_The_Tier_6_White_Library_Trial_and_The_Glacial_Domain](http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP06_The_Tier_6_White_Library_Trial_and_The_Glacial_Domain):

| Batch | Scene Range | Zone & Setting | Target Lighting | Core Narrative Beats |
| :---: | :---: | :--- | :---: | :--- |
| **01** | `IMG_001`–`IMG_024` | `academy_private_dormitory` | `night_moonlit` | Midnight solitude in private dorm chamber; window vantage overlooking capital cathedral spires; unsealing The Primordial Codex. |
| **02** | `IMG_025`–`IMG_048` | `white_dimension_library` | `interior_warm` | Descent into boundless astral archives; floating bookcases; thermodynamic mana research; manifestation of the frozen trial archway. |
| **03** | `IMG_049`–`IMG_072` | `frozen_astral_crucible` | `interior_warm` | Arrival on mirror-ice crucible; howling blizzard mists; awakening of the 12ft Permafrost Trial Colossus. |
| **04** | `IMG_073`–`IMG_096` | `frozen_astral_crucible` | `interior_warm` | Colossus physical assault; parrying with Carved Blackwood Staff; frost conducting up ebony wood; realizing thermodynamic adaptation. |
| **05** | `IMG_097`–`IMG_120` | `frozen_astral_crucible` | `interior_warm` | Dropping defensive stance; absorbing absolute zero frost breath; 100ft Tier 6 Glacial Domain circle; shattering colossus into starlight. |
| **06** | `IMG_121`–`IMG_144` | `white_dimension_library` | `interior_warm` | Crucible dissolves back to white marble archives; absorbing Tier 6 Glacial Core; unrolling 50-Floor Labyrinth blueprints. |
| **07** | `IMG_145`–`IMG_168` | `academy_private_dormitory` &rarr; `academy_courtyard` | `dawn` &rarr; `bright_morning_sunlight` | Dawn awakening in dorm; exhaling fleeting vapor into warm air; courtyard assembly before Grand Ranking Stele; Alistair opening tournament. |

---

## 🎯 3. Quality & Verification Gates Summary

| Gate ID | Check Description | Result | Details |
| :---: | :--- | :---: | :--- |
| **G01–G17** | Parity, 1:1 Narrative Sync, Entity Binding, Lighting, Anatomy, DNA, Format, Pacing, Policy | `[PASS]` | 100% compliant across all 168 scenes. |
| **G20** | Physical Reference Plate Disk Integrity | `[FAIL]` | Strictly missing new Act II plates 39, 40, 41, 46 (expected before Google Flow run). |
| **G21–G43** | Color lock, Vantage, Visual Action Novelty, 1:1 Header Lock, Immersion, Safe Lexicon, Lens Diversity | `[PASS]` | 100% compliant across all 168 scenes. |
| **D-01** | Cryptographic Pre-Flight Manifest Lock | `[PASS]` | Hash signature verified in `dispatch_manifest.json`. |
