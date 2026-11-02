# Google Flow Production Instructions — Series 04 EP04

> **Franchise:** The Billion-Year Sovereign: Reality Convergence (Series 04)  
> **Episode:** EP04: The Jiangnan Syndicate War & The Fall of the Gu Zaibatsu (Arc 2 Grand Omnibus Feature)  
> **Target Format:** 9:16 Vertical Webtoon (`1080x1920` / `9:16` Portrait)  
> **Total Scenes:** 576 Scenes across 24 Batches  
> **Vault Directory:** [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_04_The_Billion_Year_Sovereign/character_vault) / [`00_Characters/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_04_The_Billion_Year_Sovereign/00_Characters)  
> **Destination Folder for Generated Images:** [`images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_04_The_Billion_Year_Sovereign/EP04_The_Jiangnan_Syndicate_War_and_The_Fall_of_The_Gu_Zaibatsu/images)

---

## 🎨 1. Google Flow Entity Setup (The Series 04 SSOT Master Roster)

In Google Flow, create each entity under the **"Characters"** tab. Attaching the reference plate directly to the diffusion conditioning via `@{Entity Name}` prevents visual drift across sequential cuts.

### Required Flow Characters for Episode 04:

| # | Flow Character Card Name | Tag in Prompts | Reference Plate File in Vault | Role / Visual DNA |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Lu Chen** | `@{Lu Chen}` | `01_Protagonist_Lu_Chen.jpg` | Protagonist, 20yo East Asian male, messy raven-black hair, calm obsidian eyes with subtle golden starlight flecks, deadpan bored expression, clean oversized charcoal streetwear hoodie, dark utility joggers, white sneakers, hands in pockets. |
| **02** | **Wang Bao** | `@{Wang Bao}` | `02_Sidekick_Wang_Bao.jpg` | Sidekick / roommate, 20yo chubby build, round cheerful face, double chin, short spiky black hair, expressive comical eyes, red graphic gaming t-shirt, beige cargo shorts. |
| **03** | **Gu Tianyu** | `@{Gu Tianyu}` | `03_Bully_Gu_Tianyu.jpg` | Disgraced young master, 21yo male, slicked-back dark brown hair, tailored navy blazer, fractured Golden Core, wheelchair/crutches, hysterical despair. |
| **04** | **Jiang Qingxue** | `@{Jiang Qingxue}` | `04_Disciple_Jiang_Qingxue.jpg` | Disciple / heroine, 21yo ethereal woman, long silk-black hair with frosted silver tips, sharp ice-blue phoenix eyes, white designer trench coat over pale cyan silk dress. |
| **05** | **Commander Han Feng** | `@{Commander Han Feng}` | `05_Inspector_Han_Feng.jpg` | Threat Bureau chief, 42yo weathered commander, short grizzled hair, tactical cheek scar, tired stern eyes, dark olive-drab tactical trench coat with brass state insignia. |
| **06** | **Ye Xingchen** | `@{Ye Xingchen}` | `06_Rival_Ye_Xingchen.jpg` | Rank 2 apex whale (Lord Starfall), 28yo aristocratic man, silver-streaked dark hair, regal golden eyes, bespoke charcoal three-piece suit, cosmic purple halo. |
| **07** | **Chief Enforcer Gu Biao** | `@{Chief Enforcer Gu Biao}` | `11_Enforcer_Gu_Biao.jpg` | Gu Syndicate enforcer, 35yo imposing male, 6'4" frame, buzz-cut hair, scarred jaw, dark sunglasses, open black trench coat over dark silk vest. |
| **08** | **Chairman Gu** | `@{Chairman Gu}` | `19_Antagonist_Chairman_Gu.jpg` | Patriarch Gu Zhentian, 52yo ruthless oligarch, slicked-back grey-streaked dark hair, sharp calculating eyes, tailored obsidian pinstripe suit, carved dragon-headed cane. |
| **09** | **Elder Gu Yan** | `@{Elder Gu Yan}` | `20_Antagonist_Elder_Gu_Yan.jpg` | Chief mercenary elder, 55yo, scarred bald skull, glowing fiery crimson eyes, crimson-embroidered combat changshan robe, rotating solar fire rings around forearms. |
| **10** | **Grand Auctioneer Yan** | `@{Grand Auctioneer Yan}` | `21_Supporting_Grand_Auctioneer_Yan.jpg` | Master Yan, 65yo distinguished appraiser, silver goatee, golden monocle over left eye, charcoal-grey three-piece suit, pristine white silk appraisal gloves. |
| **11** | **Primordial Dust-Cleansing Qi Pill** *(Item)* | `@{Primordial Dust-Cleansing Qi Pill}` | `22_Item_Primordial_Dust_Cleansing_Pill.jpg` | Single translucent iridescent celestial pearl resting in porcelain saucer/clear bag, radiating nine concentric golden-white mist rings. |
| **12** | **Nine-Serpent Slaughter Formation** *(Artifact)* | `@{Nine-Serpent Slaughter Formation}` | `23_Artifact_Nine_Serpent_Formation.jpg` | Colossal sky-spanning crimson runic energy dome over modern streets, nine bone-carved banners, shadowy crimson-ruby serpents coiling in smog. |
| **13** | **Heavenly Dao Simulator Interface** *(HUD)* | `@{Heavenly Dao Simulator Interface}` | `13_Item_Heavenly_Dao_Simulator_HUD.jpg` | Translucent dark obsidian-glass HUD floating in mid-air, celestial gold astrolabe rings, cyan traces displaying rank and dampening status. |
| **14** | **Celestial Star Astrolabe** *(Prop)* | `@{Celestial Star Astrolabe}` | `12_Prop_Celestial_Star_Astrolabe.jpg` | Intricate spherical brass-and-silver armillary astrolabe with rotating gimbal rings and suspended cyan starlight core. |
| **15** | **Dormitory Room 402** *(Location)* | `@{Dormitory Room 402}` | `18_Location_Dormitory_Room_402.jpg` | Modern collegiate double dorm room, brushed-steel lofted bunk bed, grey bedding, desk, electric kettle, window overlooking campus. |

---

## 🚀 2. Generation Workflow in Google Flow

1. Open [`02_Prompt_Matrix.md`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_04_The_Billion_Year_Sovereign/EP04_The_Jiangnan_Syndicate_War_and_The_Fall_of_The_Gu_Zaibatsu/02_Prompt_Matrix.md).
2. Copy the full text inside `<prompt>...</prompt>` for each target scene (e.g. `IMG_001` through `IMG_576`).
3. Paste directly into Google Flow's prompt prompt box.
4. Ensure tagged entities (`@{Lu Chen}`, `@{Chairman Gu}`, etc.) trigger their linked Flow Character Cards.
5. Set aspect ratio to **9:16 Vertical Portrait** (1080x1920).
6. Save generated images into [`images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_04_The_Billion_Year_Sovereign/EP04_The_Jiangnan_Syndicate_War_and_The_Fall_of_The_Gu_Zaibatsu/images) as `IMG_001.jpg`, `IMG_002.jpg`, up to `IMG_576.jpg`.
