# Google Flow Master Production Instructions — Series 05 EP04

> **Franchise:** *The Fourth Magius: Rebirth of the Discarded Scion* (`Series_05_The_Fourth_Magius`)  
> **Episode:** `EP04_The_Road_to_the_Capital_and_The_Entrance_Exam`  
> **Target Format:** `16:9` Full-Bleed Landscape (`1920x1080` / `16:9` Horizontal)  
> **Total Scenes:** `192` Scenes across `8` Batches (`24` scenes / batch)  
> **Vault Directory:** [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) / [`00_Characters/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/00_Characters)  
> **Destination Folder for Generated Images:** [`images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/EP04_The_Road_to_the_Capital_and_The_Entrance_Exam/images)

---

## ✅ 0. Vault Plate Status (`18 / 18` Entity Cards Ready)

All `18` `EP04` Google Flow entity plates (`characters`, `mobs`, `weapons`, `props`, and `locations`, including `30_Location_Highway_Pine_Ravine.jpg` through `33_Location_Academy_Proving_Grounds.jpg`) are verified and mirrored on disk in [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) and [`00_Characters/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/00_Characters). All `43 / 43` pre-flight gates pass for `EP04`.

---

## ⚡ Tier 1: Master Agent Instructions (Set Once in Google Flow Project)

Create a fresh Google Flow project for **Act II (`EP04+`)** and paste the following block into Google Flow's **Agent Instructions** panel (Document Icon &rarr; *+ Add Instruction*):

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
1. Create and isolate each batch within its dedicated collection after each wave finishes generating and renaming (e.g., "Series 05 EP04 Batch 01"). Never mix scenes across batches.
2. STANDALONE SCENES: Generate EXACTLY ONE standalone, edge-to-edge 16:9 horizontal widescreen landscape image (1920x1080 full bleed) per <scene> node. Zero comic strips, zero multi-panel grids, zero storyboards, zero collages.

🚫 ZERO-TEXT MANDATE (STRICTLY ENFORCED):
- 100% pure textless illustration artwork.
- ABSOLUTELY ZERO Hangul (한글), English words/letters, kanji, numbers, speech bubbles, dialogue balloons, sound effects (SFX), subtitles, captions, watermarks, signatures, chapter titles, or UI labels.

👥 ACTOR & ANATOMICAL INTEGRITY:
- Flawless human anatomy: exactly two arms, two legs, five individual fingers per hand, natural articulation. Complete limbs, pristine anatomy.
- ZERO extra limbs, mutated hands, duplicate body parts, fused fingers, floating hands, or detached ghost limbs.
- Every hand holding a weapon, staff, wand, or prop MUST be physically and seamlessly attached to the forearm and shoulder.
- SINGLE PROTAGONIST MANDATE: Strictly ONE single instance of @{Michael Montrey (Academy)} per frame. Never clone or duplicate the main character. Keep background academy students in soft depth-of-field blur.

🏛️ SPATIAL & CAMERA INTEGRITY:
- Strictly adhere to the indoor or outdoor environment defined in the prompt. Temperate dry cobblestones and green pines on the highway (STRICTLY ZERO SNOW).
- Single unified horizontal 16:9 camera perspective (zero split 50/50 rooms or multi-panel comic borders).

🎨 MASTER ART STYLE:
- High fantasy action manhwa webtoon art style, sharp black ink linework, clean crisp illumination, vibrant high-contrast cel shading, horizontal 16:9 (1920x1080 full bleed), pure textless artwork.

🔗 CHARACTER, PROP & LOCATION REFERENCE MAPPING:
- Always map @{Entity Name} tags directly to their corresponding entity references in this project (using pure names with zero category prefixes):
  @{Michael Montrey (Academy)}, @{Elder Rowan Thorne}, @{Lord Cedric Vance}, @{Proctor Alistair}, @{Bandit Leader Douglas}, @{Highway Bandit Raiders}, @{Carved Blackwood Staff}, @{Rowan Recommendation Letter}, @{Arcane Resonance Crystal Pillar}, @{Gilded Sapphire Wand}, @{Bandit Leader Greatsword}, @{Imperial Applicant Ledger}, @{Oakhaven Perimeter Gate}, @{Valerius Imperial Highway}, @{Highway Pine Ravine}, @{Imperial Arcane Academy Courtyard}, @{Academy Resonance Testing Hall}, @{Academy Tactical Proving Grounds}.
```

---

## 🎨 2. Required Flow Entity Cards (`Series_05_The_Fourth_Magius` `EP04`)

In Google Flow's **"Characters"** tab, upload each plate from [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) using the **exact Flow Card Name** (zero prefixes like `Character:` or `Weapon:`):

### Characters & Mobs (`6`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Michael Montrey (Academy)** | `@{Michael Montrey (Academy)}` | `19_Protagonist_Michael_Academy.jpg` | Ready |
| **02** | **Elder Rowan Thorne** | `@{Elder Rowan Thorne}` | `05_Supporting_Elder_Rowan.jpg` | Ready |
| **03** | **Lord Cedric Vance** | `@{Lord Cedric Vance}` | `20_Antagonist_Cedric_Vance.jpg` | Ready |
| **04** | **Proctor Alistair** | `@{Proctor Alistair}` | `21_Supporting_Proctor_Alistair.jpg` | Ready |
| **05** | **Bandit Leader Douglas** | `@{Bandit Leader Douglas}` | `22_Enemy_Bandit_Leader_Douglas.jpg` | Ready |
| **06** | **Highway Bandit Raiders** | `@{Highway Bandit Raiders}` | `23_Mob_Highway_Bandits.jpg` | Ready |

### Weapons & Props (`6`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :--- |
| **07** | **Carved Blackwood Staff** | `@{Carved Blackwood Staff}` | `08_Weapon_Blackwood_Staff.jpg` | Ready |
| **08** | **Rowan Recommendation Letter** | `@{Rowan Recommendation Letter}` | `24_Prop_Recommendation_Letter.jpg` | Ready |
| **09** | **Arcane Resonance Crystal Pillar** | `@{Arcane Resonance Crystal Pillar}` | `25_Prop_Resonance_Crystal_Pillar.jpg` | Ready |
| **10** | **Gilded Sapphire Wand** | `@{Gilded Sapphire Wand}` | `26_Weapon_Gilded_Sapphire_Wand.jpg` | Ready |
| **11** | **Bandit Leader Greatsword** | `@{Bandit Leader Greatsword}` | `27_Weapon_Bandit_Greatsword.jpg` | Ready |
| **12** | **Imperial Applicant Ledger** | `@{Imperial Applicant Ledger}` | `28_Prop_Applicant_Ledger.jpg` | Ready |

### Locations (`6`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :--- |
| **13** | **Oakhaven Perimeter Gate** | `@{Oakhaven Perimeter Gate}` | `14_Location_Oakhaven_Perimeter_Gate.jpg` | Ready |
| **14** | **Valerius Imperial Highway** | `@{Valerius Imperial Highway}` | `29_Location_Valerius_Imperial_Highway.jpg` | Ready |
| **15** | **Highway Pine Ravine** | `@{Highway Pine Ravine}` | `30_Location_Highway_Pine_Ravine.jpg` | Ready |
| **16** | **Imperial Arcane Academy Courtyard** | `@{Imperial Arcane Academy Courtyard}` | `31_Location_Academy_Courtyard.jpg` | Ready |
| **17** | **Academy Resonance Testing Hall** | `@{Academy Resonance Testing Hall}` | `32_Location_Academy_Resonance_Hall.jpg` | Ready |
| **18** | **Academy Tactical Proving Grounds** | `@{Academy Tactical Proving Grounds}` | `33_Location_Academy_Proving_Grounds.jpg` | Ready |

---

## 🚀 3. How to Execute Batches `01`–`08` in Google Flow

1. Open **Manhwa Recap Studio** at `http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP04_The_Road_to_the_Capital_and_The_Entrance_Exam`.
2. Ensure all **18 Flow Entity Cards** above are uploaded in your Google Flow project's **Characters** tab.
3. Click **"Copy XML"** on `Batch 01` (`IMG_001`–`IMG_024`) through `Batch 08` (`IMG_169`–`IMG_192`) one batch at a time and paste directly into Google Flow Agent chat.
4. Flow will execute in **Waves of 8** (`8 -> rename -> collection`) across the 24-scene batch without pausing.
5. Download each batch's 24 `.jpg` plates (`IMG_001.jpg`–`IMG_192.jpg`) into [`EP04/images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/EP04_The_Road_to_the_Capital_and_The_Entrance_Exam/images), synthesize Edge-TTS audio in the Studio UI (`en-GB-RyanNeural`), and compile `Batch 01–08` + Master `1080p` MP4!
