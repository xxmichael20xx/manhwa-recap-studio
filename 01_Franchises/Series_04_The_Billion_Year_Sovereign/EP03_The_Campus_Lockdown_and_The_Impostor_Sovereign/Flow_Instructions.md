# Google Flow Production Instructions — Series 04 EP03

> **Franchise:** The Billion-Year Sovereign: Reality Convergence (Series 04)  
> **Episode:** EP03: The Campus Lockdown and the Impostor Sovereign  
> **Target Format:** 9:16 Vertical Webtoon (`1080x1920` / `9:16` Portrait)  
> **Vault Directory:** [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_04_The_Billion_Year_Sovereign/character_vault) / [`00_Characters/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_04_The_Billion_Year_Sovereign/00_Characters)  
> **Destination Folder for Generated Images:** [`images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_04_The_Billion_Year_Sovereign/EP03_The_Campus_Lockdown_and_The_Impostor_Sovereign/images)

---

## 🏛️ 1. Google Flow Entity Setup (The Series 6 Pattern)

In Google Flow, create each entity under the **"Characters"** tab. Creating locations as "Characters" allows Google Flow to attach the reference plate directly to the diffusion conditioning via `@{Entity Name}`, preventing background drift across cuts.

### Required Flow Characters for Episode 03:

| # | Flow Character Card Name | Tag in Prompts | Reference Plate File in Vault | Role / Description |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Lu Chen** | `@{Lu Chen}` | `01_Protagonist_Lu_Chen.jpg` | Protagonist, 20yo East Asian male, messy black hair, calm obsidian eyes, oversized charcoal hoodie. |
| **02** | **Wang Bao** | `@{Wang Bao}` | `02_Sidekick_Wang_Bao.jpg` | Best friend / sidekick, 20yo chubby build, round cheerful face, double chin, red graphic gaming t-shirt. |
| **03** | **Gu Tianyu** | `@{Gu Tianyu}` | `03_Bully_Gu_Tianyu.jpg` | Bully rival, 21yo athletic male, slicked-back brown hair, designer navy blazer, clutching bruised right wrist. |
| **04** | **Jiang Qingxue** | `@{Jiang Qingxue}` | `04_Disciple_Jiang_Qingxue.jpg` | Supporting heroine, 20yo female, long glossy jet-black hair, crystalline ice-blue eyes, white collegiate knit sweater. |
| **05** | **Commander Han Feng** | `@{Commander Han Feng}` | `05_Inspector_Han_Feng.jpg` | Threat Bureau chief, 42yo weathered male, short grizzled hair, tactical scar, dark carbon-fibre enforcer coat. |
| **06** | **Mo Yufeng** | `@{Mo Yufeng}` | `14_Antagonist_Mo_Yufeng.jpg` | Impostor antagonist, 22yo arrogant male, swept-back crimson dark hair, ornate crimson/gold coat, forged token. |
| **07** | **Dean of Qindu University** | `@{Dean of Qindu University}` | `15_Dean_Qindu_University.jpg` | Chief proctor, 62yo dignified scholar, silver-grey hair, silver beard, gold-rimmed glasses, charcoal academic robe. |
| **08** | **Qindu Collegiate Stadium** *(Location)* | `@{Qindu Collegiate Stadium}` | `17_Location_Qindu_Collegiate_Stadium.jpg` | Modern collegiate stadium at night, red running track, clean green turf, steel proctor podium, floodlights. |
| **09** | **Dormitory Room 402** *(Location)* | `@{Dormitory Room 402}` | `18_Location_Dormitory_Room_402.jpg` | Modern male double dorm room at night, brushed-steel lofted bunk bed, grey bedding, desk, kettle, white walls. |
| **10** | **Heavenly Dao Simulator Interface** *(HUD)* | `@{Heavenly Dao Simulator Interface}` | `13_Item_Heavenly_Dao_Simulator_HUD.jpg` | Translucent dark obsidian-glass HUD floating in mid-air, celestial gold astrolabe rings, cyan traces. |
| **11** | **Tactical Spirit Spectrometer** *(Prop)* | `@{Tactical Spirit Spectrometer}` | `09_Prop_Tactical_Spirit_Spectrometer.jpg` | Handheld military scanner, brushed gunmetal-grey casing, high-density sapphire glass screen displaying energy data. |
| **12** | **Heaven-Earth Golden Stele** *(Artifact)* | `@{Heaven-Earth Golden Stele}` | `10_Artifact_Heaven_Earth_Golden_Stele.jpg` | Colossal 30,000-metre obsidian-and-gold monument floating in troposphere with primordial starlight runes. |

---

## 🎨 2. Generating Images in Google Flow

### Option A: Regenerating Only the 25 Defective Scenes
Open [`18_Corrected_Scenes_For_Flow.md`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_04_The_Billion_Year_Sovereign/EP03_The_Campus_Lockdown_and_The_Impostor_Sovereign/18_Corrected_Scenes_For_Flow.md):
1. Locate the scene tag (e.g. `IMG_031`, `IMG_041`, `IMG_153`).
2. Copy the full text between `<prompt>` and `</prompt>`.
3. Paste directly into Google Flow's prompt input.
4. Ensure the tagged entities (`@{Qindu Collegiate Stadium}`, `@{Gu Tianyu}`, etc.) are actively linked to their Flow character cards.
5. Set aspect ratio to **9:16 Vertical Portrait**.
6. Generate, verify the visual quality, and download as `IMG_XXX.jpg`.

### Option B: Batch Generation Across the Full Episode
Open [`02_Prompt_Matrix.md`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_04_The_Billion_Year_Sovereign/EP03_The_Campus_Lockdown_and_The_Impostor_Sovereign/02_Prompt_Matrix.md):
- Contains all 240 scenes organised into 10 dynamic batches (Scenes 001–240).
- Every prompt is pre-calibrated with exact layout tags (`Tier A`, `Tier B`, `Tier C`), character tokens, and canonical spatial enclosures.

---

## 💾 3. Saving Images for Video Compilation

1. Save all generated image files into:  
   `C:\Users\MIchaelangelo\Documents\My Brand\02_Ventures & Digital Products\Manhwa Recap Studio\01_Franchises\Series_04_The_Billion_Year_Sovereign\EP03_The_Campus_Lockdown_and_The_Impostor_Sovereign\images\`
2. Name each image using the exact standard 3-digit format:  
   `IMG_001.jpg`, `IMG_002.jpg`, ..., `IMG_240.jpg`
3. Once all images are placed, reply in chat: **"compile"** or **"proceed"**.
4. The studio engine will then automatically:
   - Synchronise each image against its exact spoken voiceover timestamp.
   - Render the complete 1080p master video (`01_Episode_Master_1080p.mp4`).
   - Extract thumbnail plates and verify 0-drift audio alignment.
