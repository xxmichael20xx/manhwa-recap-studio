# Google Flow Master Production Instructions — Series 05 EP03

> **Franchise:** The Fourth Magius (Series 05)  
> **Episode:** EP03: The First Breakthrough and The Mercenary Crucible  
> **Target Format:** 16:9 Full-Bleed Landscape (`1920x1080` / `16:9` Horizontal)  
> **Total Scenes:** 336 Scenes across 14 Batches (24 scenes / batch)  
> **Vault Directory:** [`character_vault/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/character_vault) / [`00_Characters/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/00_Characters)  
> **Destination Folder for Generated Images:** [`images/`](file:///C:/Users/MIchaelangelo/Documents/My%20Brand/02_Ventures%20%26%20Digital%20Products/Manhwa%20Recap%20Studio/01_Franchises/Series_05_The_Fourth_Magius/EP03_The_First_Breakthrough_and_The_Mercenary_Crucible/images)

---

## ⚡ Tier 1: Master Agent Instructions (Set Once in Google Flow Project)

Paste the following block into Google Flow's **Agent Instructions** panel (Document Icon &rarr; *+ Add Instruction*):

```text
[SYSTEM DIRECTIVE: GOOGLE FLOW MASTER AGENT INSTRUCTIONS — 16:9 FULL BLEED LANDSCAPE]

🤖 AUTONOMOUS BATCH EXECUTION PROTOCOL (MANDATORY):
1. ROLE: You are an Autonomous Batch Production Engine, NOT an interactive conversational assistant.
2. CONTINUOUS EXECUTION MANDATE: When provided with an XML <batch> or multiple <scene> nodes, you MUST execute image generation for ALL scenes in the batch continuously in a single uninterrupted sequence from start to finish.
3. ABSOLUTE HALT BAN (ZERO INTERMEDIATE TURNS):
   - NEVER stop after generating a single scene.
   - NEVER yield the turn to the operator between individual scenes.
   - NEVER ask "Should I proceed?", "How does this look?", or pause for confirmation.
4. TERMINAL CONDITION: Return your final response ONLY AFTER 100% of the scenes in the batch (e.g., all 24 scenes) have been generated and assigned to the target collection.
5. RATE LIMIT AUTO-RETRY: If a scene hits a temporary API rate limit, wait briefly and retry automatically. NEVER abort the remaining scenes in the batch.

📁 SESSION & COLLECTION ISOLATION:
1. Always create and isolate each batch within its dedicated collection (e.g. "Series 05 EP03 Batch 01"). Never mix scenes across batches.
2. STANDALONE SCENES: Generate EXACTLY ONE standalone, edge-to-edge 16:9 horizontal widescreen landscape image (1920x1080 full bleed) per <scene> node. Zero comic strips, zero multi-panel grids, zero storyboards, zero collages.

🏷️ AUTOMATIC FILE RENAMING:
- Automatically rename every generated asset to match the exact filename="..." attribute of its <scene> node (e.g. IMG_001.jpg) immediately after generation without waiting for a manual sync command.

🚫 ZERO-TEXT MANDATE (STRICTLY ENFORCED):
- 100% pure textless illustration artwork.
- ABSOLUTELY ZERO Hangul (한글), English words/letters, kanji, numbers, speech bubbles, dialogue balloons, sound effects (SFX), subtitles, captions, watermarks, signatures, chapter titles, or UI labels.

👥 ACTOR & ANATOMICAL INTEGRITY:
- Flawless human anatomy: exactly two arms, two legs, five slender fingers per hand, natural articulation. Complete limbs, pristine anatomy.
- ZERO extra limbs, mutated hands, duplicate body parts, fused fingers, floating hands, or detached ghost limbs.
- Every hand holding a weapon, staff, or prop MUST be physically and seamlessly attached to the forearm and shoulder.
- SINGLE PROTAGONIST MANDATE: Strictly ONE single instance of the protagonist per frame. Never clone or duplicate the main character. Diverse background faces and neutral indistinct crowd silhouettes.
- ANTI-MORPHING ISOLATION: Keep @{Michael Montrey (Child)} and @{Elder Rowan Thorne} human anatomy 100% distinct from @{Mountain Stone Troll}. Never transfer troll granite hide, claws, or stone horns onto human characters.

🏛️ SPATIAL & CAMERA INTEGRITY:
- Strictly adhere to the indoor or outdoor environment defined in the prompt. Single unified camera perspective (zero split 50/50 rooms or fractured non-Euclidean doorways).

🎨 MASTER ART STYLE:
- High fantasy action manhwa webtoon art style, sharp black ink linework, clean crisp illumination, vibrant high-contrast cel shading, horizontal 16:9 (1920x1080 full bleed), pure textless artwork.

🔗 CHARACTER ENTITY REFERENCE MAPPING:
- Always map @{Character Name} tags to their corresponding character entity references in this project:
  @{Michael Montrey (Child)}, @{Michael Montrey (Wolf-Skin)}, @{Elder Rowan Thorne}, @{Mountain Stone Troll}, @{Rowan Buckler and Short Sword}, @{Carved Blackwood Staff}, @{Granite Mortar and Pestle}, @{Polished Cedar Salve Bowl}, @{Oakhaven Perimeter Gate}, @{Rowan Apothecary Shop}, @{Oakhaven Apothecary Loft}, @{Blackwood Forest Clearing}, @{Oakhaven Apothecary Rear Courtyard}, @{The White Dimension Library}.
```

---

## 🎨 2. Required Flow Character & Prop Cards (Series 05 SSOT)

In Google Flow, create each entity under the **"Characters"** tab. Attach the corresponding reference plate from `character_vault/`:

| # | Flow Card Name | Tag in Prompts | Reference Plate in Vault | Visual DNA Summary |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Michael Montrey (Child)** | `@{Michael Montrey (Child)}` | `01_Protagonist_Michael_Montrey.jpg` | Protagonist, 5yo boy build, messy raven-black hair, piercing cyan glowing eyes, rough grey linen tunic, rope belt, charcoal trousers. |
| **02** | **Michael Montrey (Wolf-Skin)** | `@{Michael Montrey (Wolf-Skin)}` | `01b_Michael_Montrey_WolfSkin.jpg` | Protagonist timeskip, 6yo boy build, messy raven hair, cyan eyes, grey wool tunic under cured wolf-fur mantle with silver wolf-fang clasp. |
| **03** | **Elder Rowan Thorne** | `@{Elder Rowan Thorne}` | `02_Supporting_Elder_Rowan.jpg` | Frontier elder / mentor, 60yo grizzled barrel-chested hunter, thick salt-and-pepper beard, weathered hazel eyes, brown leather hunter doublet. |
| **04** | **Mountain Stone Troll** | `@{Mountain Stone Troll}` | `05b_Monster_Mountain_Stone_Troll.jpg` | Colossal 9ft brutish troll, jagged granite-encrusted grey hide, glowing molten-amber slit eyes, moss-covered shoulders, crude ironwood stone-studded club. |
| **05** | **Rowan Buckler and Short Sword** | `@{Rowan Buckler and Short Sword}` | `04_Prop_Rowan_Buckler_Sword.jpg` | Circular battered iron-banded dark oak buckler shield strapped to left forearm paired with steel arming short sword. |
| **06** | **Carved Blackwood Staff** | `@{Carved Blackwood Staff}` | `03_Item_Carved_Blackwood_Staff.jpg` | Five-foot cylindrical straight bo staff carved from polished dense blackwood, glowing pale blue runic spiral, zero gnarled branches. |

---

## 🚀 3. How to Execute Batches in Google Flow

1. Set up the **Tier 1 Master Agent Instructions** once in your Google Flow project.
2. In the **Manhwa Recap Studio** web app (`http://localhost:3100/matrix/Series_05_The_Fourth_Magius/EP03_The_First_Breakthrough_and_The_Mercenary_Crucible`), go to the **Batch Production Deck**.
3. Click **"Copy XML"** on your target batch (e.g. `Batch 01`, `Batch 02`, etc.).
   - The Studio automatically prepends the `[COMMAND: EXECUTE BATCH AUTONOMOUSLY — CONTINUOUS SEQUENCE]` header.
4. Paste the entire clipboard directly into the Google Flow Agent chat.
5. The Google Flow Agent will now autonomously generate all 24 scenes in the batch sequentially without stopping or asking for confirmation between individual plates.
