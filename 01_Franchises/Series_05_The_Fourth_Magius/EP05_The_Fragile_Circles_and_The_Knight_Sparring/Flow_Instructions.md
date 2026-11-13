# Google Flow Master Production Instructions — Series 05 EP05

> **Franchise:** *The Fourth Magius: Rebirth of the Discarded Scion* (`Series_05_The_Fourth_Magius`)  
> **Episode:** `EP05_The_Fragile_Circles_and_The_Knight_Sparring`  
> **Target Format:** `16:9` Full-Bleed Landscape (`1920x1080` / `16:9` Horizontal)  
> **Total Scenes:** `168` Scenes across `7` Batches (`24` scenes / batch)  
> **Studio Matrix URL:** [http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP05_The_Fragile_Circles_and_The_Knight_Sparring](http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP05_The_Fragile_Circles_and_The_Knight_Sparring)  
> **Studio Vault URL:** [http://localhost:3100/franchises/Series_05_The_Fourth_Magius](http://localhost:3100/franchises/Series_05_The_Fourth_Magius)  
> **Vault Directory:** [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) / [`00_Characters/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/00_Characters)  
> **Destination Folder for Generated Images:** [`images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/EP05_The_Fragile_Circles_and_The_Knight_Sparring/images)

---

## 🏛️ 0. Vault Plate Status & New Act II Synthesis Notice

`EP05` utilizes `12` total Google Flow Entity Cards.  
- **`7` Existing Core Plates** (`19`, `20`, `21`, `08`, `26`, `28`, `31`, `33`) are verified on disk.
- **`5` New Dedicated Act II Plates (`34`–`38`)** have complete schemas in `vault/entities.json` and are ready for 1-click **"Prompt"** copy in the [Studio Vault Web App](http://localhost:3100/franchises/Series_05_The_Fourth_Magius):

| Plate File | Canonical Entity Name | Kind | Role & Archetype | Studio Vault Action |
| :--- | :--- | :---: | :--- | :--- |
| `34_Antagonist_Knight_Vanguard_Gareth.jpg` | `@{Gareth Ironcrest}` | Character | Arrogant Imperial Knight Cadet Champion (Steel Swordsman) | 1-Click "Prompt" copy &rarr; Synthesize in Flow |
| `35_Supporting_Commander_Marcus_Kael.jpg` | `@{Commander Marcus Kael}` | Character | Veteran Imperial Knight Instructor & Vanguard Commander | 1-Click "Prompt" copy &rarr; Synthesize in Flow |
| `36_Antagonist_Lady_Evelyn_Ashford.jpg` | `@{Lady Evelyn Ashford}` | Character | High-Born Fire-Circle Prodigy, Heiress to House Ashford | 1-Click "Prompt" copy &rarr; Synthesize in Flow |
| `37_Weapon_Enchanted_Steel_Broadsword.jpg` | `@{Enchanted Steel Broadsword}` | Item | Heavy 3ft double-edged enchanted broadsword (caught bare-handed) | 1-Click "Prompt" copy &rarr; Synthesize in Flow |
| `38_Location_Academy_Lecture_Amphitheatre.jpg` | `@{Academy Lecture Amphitheatre}` | Location | Stepped circular silver-granite amphitheatre with stained-glass window vantage | 1-Click "Prompt" copy &rarr; Synthesize in Flow |

Once synthesized, save the `.jpg` files into `character_vault/` and mirror into `00_Characters/` to flip `G20` from `[FAIL]` to `[PASS]` (`43 / 43` gates).

---

## ⚡ Tier 1: Master Agent Instructions (Set Once in Google Flow Project)

Paste the following block into Google Flow's **Agent Instructions** panel (Document Icon &rarr; *+ Add Instruction*):

```text
[SYSTEM DIRECTIVE: GOOGLE FLOW MASTER AGENT INSTRUCTIONS — 16:9 FULL BLEED LANDSCAPE]

🤖 AUTONOMOUS WAVE-OF-8 EXECUTION PROTOCOL (GENERATE BY 8 -> RENAME -> COLLECTION):
1. ROLE: You are an Autonomous Batch Production Engine, NOT an interactive conversational assistant.
2. WAVE-OF-8 EXECUTION MANDATE: When provided with an XML <batch> or multiple <scene> nodes, process them automatically in consecutive waves of AT MOST 8 SCENES AT A TIME (e.g., Wave 1: 1–8, Wave 2: 9–16, Wave 3: 17–24). Never fire all 24 generations in one burst.
3. STRICT PER-WAVE SEQUENCE (GENERATE BY 8 -> RENAME -> COLLECTION):
   - STEP 1 (Generate): Generate up to 8 scenes concurrently in the active wave.
   - STEP 2 (Rename): Immediately after that wave finishes generating, rename every image to its exact <scene filename="IMG_XXX.jpg"> attribute (e.g., IMG_001.jpg).
   - STEP 3 (Collection): Assign/organize all renamed images from that wave into the target collection (create if not present; never mix with prior batches), then automatically start the next wave of 8.
4. ABSOLUTE HALT BAN (ZERO CONFIRMATION PAUSES):
   - NEVER stop between waves to ask "Should I proceed?", "How does this look?", or pause for confirmation, and never output per-scene progress narration.
5. TERMINAL CONDITION: Return your final response ONLY AFTER 100% of the scenes across all waves have been generated, renamed, and organized into the target collection.
6. RATE LIMIT AUTO-RETRY: If a scene hits a temporary API rate limit, retry it automatically and finish its rename + collection assignment before advancing to the next wave.

📁 COLLECTION ISOLATION & STANDALONE SCENES:
1. Create and isolate each batch within its dedicated collection after each wave finishes generating and renaming (e.g., "Series 05 EP05 Batch 01"). Never mix scenes across batches.
2. STANDALONE SCENES: Generate EXACTLY ONE standalone, edge-to-edge 16:9 horizontal widescreen landscape image (1920x1080 full bleed) per <scene> node. Zero comic strips, zero multi-panel grids, zero storyboards, zero collages.

🚫 ZERO-TEXT MANDATE (STRICTLY ENFORCED):
- 100% pure textless illustration artwork.
- ABSOLUTELY ZERO Hangul (한글), English words/letters, kanji, numbers, speech bubbles, dialogue balloons, sound effects (SFX), subtitles, captions, watermarks, signatures, chapter titles, or UI labels.

👥 ACTOR & ANATOMICAL INTEGRITY:
- Flawless human anatomy: exactly two arms, two legs, five individual fingers per hand, natural articulation. Complete limbs, pristine anatomy.
- ZERO extra limbs, mutated hands, duplicate body parts, fused fingers, floating hands, or detached ghost limbs.
- Every hand holding a weapon, staff, wand, or broadsword MUST be physically and seamlessly attached to the forearm and shoulder.
- SINGLE PROTAGONIST MANDATE: Strictly ONE single instance of @{Michael Montrey (Academy)} per frame. Never clone or duplicate the main character. Keep background academy students in soft depth-of-field blur.
- BARE-HANDED DUEL MANDATE: In Scenes 107 through 158, Michael Montrey is completely empty-handed (his blackwood staff rests upright on the perimeter stone weapon rack). In Scenes 133–144, when catching the broadsword, Michael holds the blade between his index and middle fingers with crisp glowing cyan mana rings rotating around his wrist and fingertips!

🏛️ SPATIAL & CAMERA INTEGRITY:
- Strictly adhere to the indoor or outdoor environment defined in the prompt. Dry pale silver granite, polished cedar desks, and warded arena flagstones (STRICTLY ZERO SNOW).
- Single unified horizontal 16:9 camera perspective (zero split 50/50 rooms or multi-panel comic borders).

🎨 MASTER ART STYLE:
- High fantasy action manhwa webtoon art style, sharp black ink linework, clean crisp illumination, vibrant high-contrast cel shading, horizontal 16:9 (1920x1080 full bleed), pure textless artwork.

🔗 CHARACTER, PROP & LOCATION REFERENCE MAPPING:
- Always map @{Entity Name} tags directly to their corresponding entity references in this project (using pure names with zero category prefixes):
  @{Michael Montrey (Academy)}, @{Lord Cedric Vance}, @{Lady Evelyn Ashford}, @{Proctor Alistair}, @{Gareth Ironcrest}, @{Commander Marcus Kael}, @{Carved Blackwood Staff}, @{Gilded Sapphire Wand}, @{Imperial Applicant Ledger}, @{Enchanted Steel Broadsword}, @{Academy Lecture Amphitheatre}, @{Imperial Arcane Academy Courtyard}, @{Academy Tactical Proving Grounds}.
```

---

## 🎨 2. Required Flow Entity Cards (`Series_05_The_Fourth_Magius` `EP05`)

In Google Flow's **"Characters"** tab, upload each plate from [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures & Digital Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) using the **exact Flow Card Name**:

### Characters (`6`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Status |
| :-: | :--- | :--- | :--- | :---: |
| **01** | **Michael Montrey (Academy)** | `@{Michael Montrey (Academy)}` | `19_Protagonist_Michael_Academy.jpg` | Ready on Disk |
| **02** | **Lord Cedric Vance** | `@{Lord Cedric Vance}` | `20_Antagonist_Cedric_Vance.jpg` | Ready on Disk |
| **03** | **Proctor Alistair** | `@{Proctor Alistair}` | `21_Supporting_Proctor_Alistair.jpg` | Ready on Disk |
| **04** | **Gareth Ironcrest** | `@{Gareth Ironcrest}` | `34_Antagonist_Knight_Vanguard_Gareth.jpg` | Synthesize via Vault |
| **05** | **Commander Marcus Kael** | `@{Commander Marcus Kael}` | `35_Supporting_Commander_Marcus_Kael.jpg` | Synthesize via Vault |
| **06** | **Lady Evelyn Ashford** | `@{Lady Evelyn Ashford}` | `36_Antagonist_Lady_Evelyn_Ashford.jpg` | Synthesize via Vault |

### Weapons & Props (`4`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Status |
| :-: | :--- | :--- | :--- | :---: |
| **07** | **Carved Blackwood Staff** | `@{Carved Blackwood Staff}` | `08_Weapon_Blackwood_Staff.jpg` | Ready on Disk |
| **08** | **Gilded Sapphire Wand** | `@{Gilded Sapphire Wand}` | `26_Weapon_Gilded_Sapphire_Wand.jpg` | Ready on Disk |
| **09** | **Imperial Applicant Ledger** | `@{Imperial Applicant Ledger}` | `28_Prop_Applicant_Ledger.jpg` | Ready on Disk |
| **10** | **Enchanted Steel Broadsword** | `@{Enchanted Steel Broadsword}` | `37_Weapon_Enchanted_Steel_Broadsword.jpg` | Synthesize via Vault |

### Locations (`3`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Status |
| :-: | :--- | :--- | :--- | :---: |
| **11** | **Academy Lecture Amphitheatre** | `@{Academy Lecture Amphitheatre}` | `38_Location_Academy_Lecture_Amphitheatre.jpg` | Synthesize via Vault |
| **12** | **Imperial Arcane Academy Courtyard** | `@{Imperial Arcane Academy Courtyard}` | `31_Location_Academy_Courtyard.jpg` | Ready on Disk |
| **13** | **Academy Tactical Proving Grounds** | `@{Academy Tactical Proving Grounds}` | `33_Location_Academy_Proving_Grounds.jpg` | Ready on Disk |

---

## 🚀 3. Batch-by-Batch Generation Plan (7 Batches x 24 Scenes)

Open [http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP05_The_Fragile_Circles_and_The_Knight_Sparring](http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP05_The_Fragile_Circles_and_The_Knight_Sparring) and dispatch batches using 1-click XML copy:

- **Batch 01 (Scenes 001–024):** *The Arrogance of Chanted Circles*  
  Wave 1: `IMG_001`–`IMG_008` &bull; Wave 2: `IMG_009`–`IMG_016` &bull; Wave 3: `IMG_017`–`IMG_024`  
  *Collection:* `Series 05 EP05 Batch 01`
- **Batch 02 (Scenes 025–048):** *The Ideological Clashing*  
  Wave 1: `IMG_025`–`IMG_032` &bull; Wave 2: `IMG_033`–`IMG_040` &bull; Wave 3: `IMG_041`–`IMG_048`  
  *Collection:* `Series 05 EP05 Batch 02`
- **Batch 03 (Scenes 049–072):** *Procession to the Tactical Proving Grounds*  
  Wave 1: `IMG_049`–`IMG_056` &bull; Wave 2: `IMG_057`–`IMG_064` &bull; Wave 3: `IMG_065`–`IMG_072`  
  *Collection:* `Series 05 EP05 Batch 03`
- **Batch 04 (Scenes 073–096):** *The Humiliation of House Vance & Lady Evelyn*  
  Wave 1: `IMG_073`–`IMG_080` &bull; Wave 2: `IMG_081`–`IMG_088` &bull; Wave 3: `IMG_089`–`IMG_096`  
  *Collection:* `Series 05 EP05 Batch 04`
- **Batch 05 (Scenes 097–120):** *The Bare-Handed Entry & Prop Lifecycle*  
  Wave 1: `IMG_097`–`IMG_104` &bull; Wave 2: `IMG_105`–`IMG_112` (Staff stowed at 106) &bull; Wave 3: `IMG_113`–`IMG_120`  
  *Collection:* `Series 05 EP05 Batch 05`
- **Batch 06 (Scenes 121–144):** *The Two-Finger Climax & Absolute Nullification*  
  Wave 1: `IMG_121`–`IMG_128` &bull; Wave 2: `IMG_129`–`IMG_136` (Climax catch) &bull; Wave 3: `IMG_137`–`IMG_144`  
  *Collection:* `Series 05 EP05 Batch 06`
- **Batch 07 (Scenes 145–168):** *Aftermath & Whispers across the Bastion*  
  Wave 1: `IMG_145`–`IMG_152` &bull; Wave 2: `IMG_153`–`IMG_160` (Staff retrieved at 159) &bull; Wave 3: `IMG_161`–`IMG_168`  
  *Collection:* `Series 05 EP05 Batch 07`

---

*Compiled by Manhwa Recap Studio Deterministic Pipeline v2.0.*
