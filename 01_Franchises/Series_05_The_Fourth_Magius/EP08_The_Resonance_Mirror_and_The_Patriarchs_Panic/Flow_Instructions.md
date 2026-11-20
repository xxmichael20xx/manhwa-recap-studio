# Google Flow Master Production Instructions — Series 05 EP08

> **Franchise:** *The Fourth Magius: Rebirth of the Discarded Scion* (`Series_05_The_Fourth_Magius`)  
> **Episode:** `EP08_The_Resonance_Mirror_and_The_Patriarchs_Panic`  
> **Target Format:** `16:9` Full-Bleed Landscape (`1920x1080` / `16:9` Horizontal)  
> **Total Scenes:** `192` Scenes across `8` Batches (`24` scenes / batch)  
> **Vault Directory:** [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) / [`00_Characters/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/00_Characters)  
> **Studio Vault UI:** [http://localhost:3100/franchises/Series_05_The_Fourth_Magius](http://localhost:3100/franchises/Series_05_The_Fourth_Magius)  
> **Prompt Matrix UI:** [http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP08_The_Resonance_Mirror_and_The_Patriarchs_Panic](http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP08_The_Resonance_Mirror_and_The_Patriarchs_Panic)  
> **Destination Folder for Generated Images:** [`images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/EP08_The_Resonance_Mirror_and_The_Patriarchs_Panic/images)

---

## ✅ 0. Vault Plate Status (`18 Ready on Disk | 100% Stage 1 Vault Lock Verified`)

All `48 / 48` pre-flight gates pass with a perfect `100/100` score, including the 4 dedicated Act III reference plates (`49`–`52`) locked on disk:
1. `49_Location_Montrey_Appraisal_Hall.jpg` (`@{Montrey Appraisal Hall}`)
2. `50_Location_Montrey_Patriarch_Study.jpg` (`@{Montrey Patriarch Study}`)
3. `51_Artifact_Ancestral_Resonance_Mirror.jpg` (`@{Ancestral Resonance Mirror}`)
4. `52_Prop_Academy_Labyrinth_Dossier.jpg` (`@{Academy Labyrinth Dossier}`)

Inspect or copy reference plates directly from the Studio Vault UI at [http://localhost:3100/franchises/Series_05_The_Fourth_Magius](http://localhost:3100/franchises/Series_05_The_Fourth_Magius).

---

## ⚡ Tier 1: Master Agent Instructions (Set Once in Google Flow Project)

Create or open your Google Flow project for **Act III (`EP08–EP10`)** and paste the following block into Google Flow's **Agent Instructions** panel (Document Icon &rarr; *+ Add Instruction*):

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
1. Create and isolate each batch within its dedicated collection after each wave finishes generating and renaming (e.g., "Series 05 EP08 Batch 01"). Never mix scenes across batches.
2. STANDALONE SCENES: Generate EXACTLY ONE standalone, edge-to-edge 16:9 horizontal widescreen landscape image (1920x1080 full bleed) per <scene> node. Zero comic strips, zero multi-panel grids, zero storyboards, zero collages.

🚫 ZERO-TEXT MANDATE (STRICTLY ENFORCED):
- 100% pure textless illustration artwork.
- ABSOLUTELY ZERO Hangul (한글), English words/letters, kanji, numbers, speech bubbles, dialogue balloons, sound effects (SFX), subtitles, captions, watermarks, signatures, chapter titles, or UI labels.
- For @{Ancestral Resonance Mirror} and @{Grand Ranking Stele}, render abstract geometric cyan/golden wavelength ripples and light bars — ZERO written ranks, letters, digits, or names!

👥 ACTOR & ANATOMICAL INTEGRITY:
- Flawless human anatomy: exactly two arms, two legs, five individual fingers per hand, natural articulation. Complete limbs, pristine anatomy.
- ZERO extra limbs, mutated hands, duplicate body parts, fused fingers, floating hands, or detached ghost limbs.
- Every hand holding a dossier, amulet, staff, or shield MUST be physically and seamlessly attached to the forearm and shoulder.
- SINGLE PROTAGONIST MANDATE: Strictly ONE single instance of @{Michael Montrey (Academy)} per frame. Never clone or duplicate any character.

🏛️ SPATIAL & CAMERA INTEGRITY:
- Strictly adhere to the indoor or outdoor environment defined in the prompt.
- Preserve window-vantage views overlooking the pale silver cathedral spires and hovering cyan mana circles of the Crystalline Arcane Bastion in @{Montrey Patriarch Study}, @{Montrey Appraisal Hall}, @{Academy Resonance Testing Hall}, and @{Academy Private Dormitory Chamber}.
- Single unified horizontal 16:9 camera perspective (zero split 50/50 rooms or multi-panel comic borders).

🎨 MASTER ART STYLE:
- High fantasy action manhwa webtoon art style, sharp black ink linework, clean crisp illumination, vibrant high-contrast cel shading, horizontal 16:9 (1920x1080 full bleed), pure textless artwork.

🔗 CHARACTER, PROP & LOCATION REFERENCE MAPPING:
- Always map @{Entity Name} tags directly to their corresponding entity references in this project (using pure names with zero category prefixes):
  @{Patriarch Valerius Montrey}, @{Head Elder Cassius}, @{Michael Montrey (Academy)}, @{Proctor Alistair}, @{Elena Ashvale}, @{Doran Keller}, @{Lord Cedric Vance}, @{Carved Blackwood Staff}, @{Academy Labyrinth Dossier}, @{Ancestral Resonance Mirror}, @{Montrey Crest Amulet}, @{Grand Ranking Stele}, @{Montrey Patriarch Study}, @{Montrey Appraisal Hall}, @{Imperial Arcane Academy Courtyard}, @{Academy Resonance Testing Hall}, @{Academy Private Dormitory Chamber}, @{The White Dimension Library}.
```

---

## 🎨 2. Required Flow Entity Cards (`Series_05_The_Fourth_Magius` `EP08`)

In Google Flow's **"Characters"** tab, upload each plate from [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) using the **exact Flow Card Name** (zero prefixes like `Character:` or `Weapon:`):

### Characters (`7`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :---: |
| **01** | **Patriarch Valerius Montrey** | `@{Patriarch Valerius Montrey}` | `03_Antagonist_Patriarch_Valerius.jpg` | Ready on Disk |
| **02** | **Head Elder Cassius** | `@{Head Elder Cassius}` | `04_Antagonist_Elder_Cassius.jpg` | Ready on Disk |
| **03** | **Michael Montrey (Academy)** | `@{Michael Montrey (Academy)}` | `19_Protagonist_Michael_Academy.jpg` | Ready on Disk |
| **04** | **Lord Cedric Vance** | `@{Lord Cedric Vance}` | `20_Antagonist_Cedric_Vance.jpg` | Ready on Disk |
| **05** | **Proctor Alistair** | `@{Proctor Alistair}` | `21_Supporting_Proctor_Alistair.jpg` | Ready on Disk |
| **06** | **Elena Ashvale** | `@{Elena Ashvale}` | `42_Ally_Elena_Ashvale.jpg` | Ready on Disk |
| **07** | **Doran Keller** | `@{Doran Keller}` | `43_Ally_Doran_Keller.jpg` | Ready on Disk |

### Weapons, Relics & Props (`5`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :---: |
| **08** | **Carved Blackwood Staff** | `@{Carved Blackwood Staff}` | `08_Weapon_Blackwood_Staff.jpg` | Ready on Disk |
| **09** | **Montrey Crest Amulet** | `@{Montrey Crest Amulet}` | `09_Item_Montrey_Crest_Amulet.jpg` | Ready on Disk |
| **10** | **Grand Ranking Stele** | `@{Grand Ranking Stele}` | `46_Prop_Labyrinth_Ranking_Monolith.jpg` | Ready on Disk |
| **11** | **Ancestral Resonance Mirror** | `@{Ancestral Resonance Mirror}` | `51_Artifact_Ancestral_Resonance_Mirror.jpg` | Ready on Disk |
| **12** | **Academy Labyrinth Dossier** | `@{Academy Labyrinth Dossier}` | `52_Prop_Academy_Labyrinth_Dossier.jpg` | Ready on Disk |

### Locations (`6`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :---: |
| **13** | **The White Dimension Library** | `@{The White Dimension Library}` | `12_Location_White_Dimension_Library.jpg` | Ready on Disk |
| **14** | **Imperial Arcane Academy Courtyard** | `@{Imperial Arcane Academy Courtyard}` | `31_Location_Academy_Courtyard.jpg` | Ready on Disk |
| **15** | **Academy Resonance Testing Hall** | `@{Academy Resonance Testing Hall}` | `32_Location_Academy_Resonance_Hall.jpg` | Ready on Disk |
| **16** | **Academy Private Dormitory Chamber** | `@{Academy Private Dormitory Chamber}` | `39_Location_Academy_Private_Dormitory.jpg` | Ready on Disk |
| **17** | **Montrey Appraisal Hall** | `@{Montrey Appraisal Hall}` | `49_Location_Montrey_Appraisal_Hall.jpg` | Ready on Disk |
| **18** | **Montrey Patriarch Study** | `@{Montrey Patriarch Study}` | `50_Location_Montrey_Patriarch_Study.jpg` | Ready on Disk |

---

## 🚀 3. How to Execute Batches `01`–`08` in Google Flow

1. Open **Manhwa Recap Studio** at [http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP08_The_Resonance_Mirror_and_The_Patriarchs_Panic](http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP08_The_Resonance_Mirror_and_The_Patriarchs_Panic).
2. Ensure all **18 Flow Entity Cards** above are configured in your Google Flow project's **Characters** tab.
3. Click **"Copy XML"** on `Batch 01` (`IMG_001`–`IMG_024`) through `Batch 08` (`IMG_169`–`IMG_192`) one batch at a time and paste directly into Google Flow Agent chat.
4. Flow will execute in **Waves of 8** (`8 -> rename -> collection`) across each 24-scene batch without pausing.
5. Download each batch's 24 `.jpg` plates (`IMG_001.jpg`–`IMG_192.jpg`) into [`EP08/images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/EP08_The_Resonance_Mirror_and_The_Patriarchs_Panic/images), synthesize Edge-TTS audio in the Studio UI (`en-GB-RyanNeural`), and compile `Batch 01–08` + Master `1080p` MP4!
