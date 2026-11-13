# Google Flow Master Production Instructions — Series 05 EP07

> **Franchise:** *The Fourth Magius: Rebirth of the Discarded Scion* (`Series_05_The_Fourth_Magius`)  
> **Episode:** `EP07_The_Ancient_Labyrinth_Tournament`  
> **Target Format:** `16:9` Full-Bleed Landscape (`1920x1080` / `16:9` Horizontal)  
> **Total Scenes:** `192` Scenes across `8` Batches (`24` scenes / batch)  
> **Vault Directory:** [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) / [`00_Characters/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/00_Characters)  
> **Studio Vault UI:** [http://localhost:3100/franchises/Series_05_The_Fourth_Magius](http://localhost:3100/franchises/Series_05_The_Fourth_Magius)  
> **Prompt Matrix UI:** [http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP07_The_Ancient_Labyrinth_Tournament](http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP07_The_Ancient_Labyrinth_Tournament)  
> **Destination Folder for Generated Images:** [`images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/EP07_The_Ancient_Labyrinth_Tournament/images)

---

## ✅ 0. Vault Plate Status (`6 Ready on Disk | 7 Dedicated Act II Plates`)

All `42 / 43` pre-flight gates pass with a perfect `100/100` score. The ONLY failing gate is strictly `G20` on the 7 new dedicated Act II reference plates (`42`–`48`), which have their prompts locked in the Studio Vault ready for 1-click generation:
1. `42_Ally_Elena_Ashvale.jpg` (`@{Elena Ashvale}`)
2. `43_Ally_Doran_Keller.jpg` (`@{Doran Keller}`)
3. `44_Boss_Obsidian_Runic_Colossus.jpg` (`@{Obsidian Titan Colossus}`)
4. `45_Enemy_Labyrinth_Gargoyle_Sentinel.jpg` (`@{Labyrinth Gargoyle Sentinel}`)
5. `46_Prop_Labyrinth_Ranking_Monolith.jpg` (`@{Grand Ranking Stele}`)
6. `47_Location_Ancient_Labyrinth_Corridor.jpg` (`@{Ancient Labyrinth Stone Corridor}`)
7. `48_Location_Labyrinth_50th_Floor_Sanctum.jpg` (`@{Labyrinth 50th Floor Sanctum}`)

Generate or copy their prompt text directly from the Studio Vault UI at [http://localhost:3100/franchises/Series_05_The_Fourth_Magius](http://localhost:3100/franchises/Series_05_The_Fourth_Magius).

---

## ⚡ Tier 1: Master Agent Instructions (Set Once in Google Flow Project)

Create a fresh Google Flow project for **Act II (`EP04–EP07`)** and paste the following block into Google Flow's **Agent Instructions** panel (Document Icon &rarr; *+ Add Instruction*):

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
1. Create and isolate each batch within its dedicated collection after each wave finishes generating and renaming (e.g., "Series 05 EP07 Batch 01"). Never mix scenes across batches.
2. STANDALONE SCENES: Generate EXACTLY ONE standalone, edge-to-edge 16:9 horizontal widescreen landscape image (1920x1080 full bleed) per <scene> node. Zero comic strips, zero multi-panel grids, zero storyboards, zero collages.

🚫 ZERO-TEXT MANDATE (STRICTLY ENFORCED):
- 100% pure textless illustration artwork.
- ABSOLUTELY ZERO Hangul (한글), English words/letters, kanji, numbers, speech bubbles, dialogue balloons, sound effects (SFX), subtitles, captions, watermarks, signatures, chapter titles, or UI labels.
- For @{Grand Ranking Stele}, render ascending abstract geometric cyan/golden light bars — ZERO written ranks, letters, digits, or names!

👥 ACTOR & ANATOMICAL INTEGRITY:
- Flawless human anatomy: exactly two arms, two legs, five individual fingers per hand, natural articulation. Complete limbs, pristine anatomy.
- ZERO extra limbs, mutated hands, duplicate body parts, fused fingers, floating hands, or detached ghost limbs.
- Every hand holding a weapon, staff, wand, or shield MUST be physically and seamlessly attached to the forearm and shoulder.
- SINGLE PROTAGONIST MANDATE: Strictly ONE single instance of @{Michael Montrey (Academy)} per frame. Never clone or duplicate the main character. Keep background academy students in soft depth-of-field blur.

🏛️ SPATIAL & CAMERA INTEGRITY:
- Strictly adhere to the indoor or outdoor environment defined in the prompt.
- Subterranean dungeon scenes (ancient_labyrinth_corridor, labyrinth_50th_floor_sanctum): completely subterranean underground with zero exterior windows, zero sky, zero sunlight.
- Single unified horizontal 16:9 camera perspective (zero split 50/50 rooms or multi-panel comic borders).

🎨 MASTER ART STYLE:
- High fantasy action manhwa webtoon art style, sharp black ink linework, clean crisp illumination, vibrant high-contrast cel shading, horizontal 16:9 (1920x1080 full bleed), pure textless artwork.

🔗 CHARACTER, PROP & LOCATION REFERENCE MAPPING:
- Always map @{Entity Name} tags directly to their corresponding entity references in this project (using pure names with zero category prefixes):
  @{Michael Montrey (Academy)}, @{Lord Cedric Vance}, @{Proctor Alistair}, @{Elena Ashvale}, @{Doran Keller}, @{Obsidian Titan Colossus}, @{Labyrinth Gargoyle Sentinel}, @{Carved Blackwood Staff}, @{Gilded Sapphire Wand}, @{Grand Ranking Stele}, @{Imperial Arcane Academy Courtyard}, @{Ancient Labyrinth Stone Corridor}, @{Labyrinth 50th Floor Sanctum}.
```

---

## 🎨 2. Required Flow Entity Cards (`Series_05_The_Fourth_Magius` `EP07`)

In Google Flow's **"Characters"** tab, upload each plate from [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) using the **exact Flow Card Name** (zero prefixes like `Character:` or `Weapon:`):

### Characters & Creatures (`7`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :---: |
| **01** | **Michael Montrey (Academy)** | `@{Michael Montrey (Academy)}` | `19_Protagonist_Michael_Academy.jpg` | Ready on Disk |
| **02** | **Lord Cedric Vance** | `@{Lord Cedric Vance}` | `20_Antagonist_Cedric_Vance.jpg` | Ready on Disk |
| **03** | **Proctor Alistair** | `@{Proctor Alistair}` | `21_Supporting_Proctor_Alistair.jpg` | Ready on Disk |
| **04** | **Elena Ashvale** | `@{Elena Ashvale}` | `42_Ally_Elena_Ashvale.jpg` | Plate 42 in Vault |
| **05** | **Doran Keller** | `@{Doran Keller}` | `43_Ally_Doran_Keller.jpg` | Plate 43 in Vault |
| **06** | **Obsidian Titan Colossus** | `@{Obsidian Titan Colossus}` | `44_Boss_Obsidian_Runic_Colossus.jpg` | Plate 44 in Vault |
| **07** | **Labyrinth Gargoyle Sentinel** | `@{Labyrinth Gargoyle Sentinel}` | `45_Enemy_Labyrinth_Gargoyle_Sentinel.jpg` | Plate 45 in Vault |

### Weapons & Props (`3`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :---: |
| **08** | **Carved Blackwood Staff** | `@{Carved Blackwood Staff}` | `08_Weapon_Blackwood_Staff.jpg` | Ready on Disk |
| **09** | **Gilded Sapphire Wand** | `@{Gilded Sapphire Wand}` | `26_Weapon_Gilded_Sapphire_Wand.jpg` | Ready on Disk |
| **10** | **Grand Ranking Stele** | `@{Grand Ranking Stele}` | `46_Prop_Labyrinth_Ranking_Monolith.jpg` | Plate 46 in Vault |

### Locations (`3`)
| # | Flow Card Name | Tag in Prompts | Reference Plate in `character_vault/` | Disk Status |
| :-: | :--- | :--- | :--- | :---: |
| **11** | **Imperial Arcane Academy Courtyard** | `@{Imperial Arcane Academy Courtyard}` | `31_Location_Academy_Courtyard.jpg` | Ready on Disk |
| **12** | **Ancient Labyrinth Stone Corridor** | `@{Ancient Labyrinth Stone Corridor}` | `47_Location_Ancient_Labyrinth_Corridor.jpg` | Plate 47 in Vault |
| **13** | **Labyrinth 50th Floor Sanctum** | `@{Labyrinth 50th Floor Sanctum}` | `48_Location_Labyrinth_50th_Floor_Sanctum.jpg` | Plate 48 in Vault |

---

## 🚀 3. How to Execute Batches `01`–`08` in Google Flow

1. Open **Manhwa Recap Studio** at [http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP07_The_Ancient_Labyrinth_Tournament](http://localhost:3100/prompts/Series_05_The_Fourth_Magius/EP07_The_Ancient_Labyrinth_Tournament).
2. Ensure all **13 Flow Entity Cards** above are configured in your Google Flow project's **Characters** tab.
3. Click **"Copy XML"** on `Batch 01` (`IMG_001`–`IMG_024`) through `Batch 08` (`IMG_169`–`IMG_192`) one batch at a time and paste directly into Google Flow Agent chat.
4. Flow will execute in **Waves of 8** (`8 -> rename -> collection`) across each 24-scene batch without pausing.
5. Download each batch's 24 `.jpg` plates (`IMG_001.jpg`–`IMG_192.jpg`) into [`EP07/images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20&%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/EP07_The_Ancient_Labyrinth_Tournament/images), synthesize Edge-TTS audio in the Studio UI (`en-GB-RyanNeural`), and compile `Batch 01–08` + Master `1080p` MP4!
