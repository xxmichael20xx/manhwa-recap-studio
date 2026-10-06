# 📝 Universal Scripting & Prompt Matrix SOP
## Standard Operating Procedure for Multi-Format Scripting & Prompt Generation

> **Module:** Engine Core (`00_Engine/02_Universal_Scripting_and_Prompt_SOP.md`)  
> **Target Audience:** Scriptwriters, Audio Engineers, and AI Agents

---

## 1. Standardised Per-Episode File Kit

Whenever launching or drafting a new episode (`EP01`, `EP02`, `EP03`, etc.) under any franchise, create a dedicated folder with these three core files:

```text
EP[XX]_[Episode_Slug]/
├── 01_Episode_Script.md         <- Spoken narrative prose + timestamped retention markers
├── 02_Prompt_Matrix.md          <- Sequenced table of visual prompt tags [IMG_001] to [IMG_025]
└── 03_CapCut_Production_Notes.md <- Specific SFX triggers, dynamic shake moments, thumbnail text
```

---

## 2. Universal 4-Act Audio Script Architecture

| Section | Runtime | Target Words | Narrative Function & Retention Milestones |
| :--- | :--- | :--- | :--- |
| **Act 1: Catalyst & Hook** | **0:00 – 3:30** | ~450–550 words | Severe adversity/betrayal + System Synchronisation chime (`3:00` retention marker). |
| **Act 2: Hidden Trial** | **3:30 – 10:00** | ~900–1,100 words| Clean RPG stat allocation; physical durability proven ($0\text{ dmg}$ from mob). |
| **Act 3: Tactical Escalation**| **10:00 – 16:30**| ~1,000–1,200 words| Choke-point combat; simultaneous swarm tactics neutralised; political friction. |
| **Act 4: Climax & Loop Hook**| **16:30 – 20:00**| ~750–950 words | Decisive retribution; institutional blackout acknowledged; next-arc cliffhanger. |
| **TOTAL (Per Episode)** | **~20:00** | **~3,200 Words** | **Average Spoken Speed: ~140 WPM** |

---

## 3. The Universal Prompt Matrix Formula (9:16 Native Vertical Standard)

Every visual prompt generated must strictly follow the **9:16 Native Vertical Aspect Ratio** and this 6-part construction formula to guarantee visual consistency and peak retention:

$$\text{Prompt} = \text{[Style Anchor]} + \text{[Character Reference Seed]} + \text{[Spatial Environment]} + \text{[Action / Kinetic Pose]} + \text{[Camera Angle \& Lighting]} + \text{[Anatomical Quality Directives]}$$

### Universal Rules for Prompt Matrices:
1. **Strict 9:16 Native Vertical Mandate:** All prompts must specify `9:16 vertical format` (`1080x1920`). Never use 16:9 or landscape boilerplate.
2. **2.0s – 3.5s Rapid-Pacing:** Every 13–15 minute episode script is partitioned into ~250–300 micro-beats (averaging ~2.8s–3.2s per cut, hard ceiling 3.8s) for maximum YouTube retention.
3. **Mandatory Anatomical Negative Directives:** Every prompt MUST include:
   ```text
   anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn boots and feet, crisp pupil reflections, no floating hands, no detached hands, no ghost limbs, no morphing artifacts, no severed appendages, no duplicate limbs, no warped anatomy, dark fantasy action manhwa art style, sharp ink linework, cinematic lighting
   ```

### Example Standardised Prompt Entry (XML Batch Schema):
```xml
<scene id="IMG_001" filename="IMG_001.jpg">
IMG001, @{Ethan Drake - Outcast}, 9:16 vertical format, wide subterranean dungeon exit establishing shot, [Foreground]: @{Ethan Drake - Outcast} walking with hunched posture, carrying a heavy rusted iron rig with dual bronze mana canisters strapped across shoulders, [Background]: elite hunters in glowing cyan power armour, dark stone tunnel, misty floor, anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn boots and feet, crisp pupil reflections, no floating hands, no detached hands, no ghost limbs, no morphing artifacts, no severed appendages, no duplicate limbs, no warped anatomy, dark fantasy action manhwa art style, sharp ink linework, cinematic lighting
</scene>
```

---

## 4. Audio Pacing & Phonetic Notation Rules

1. **Dramatic Breathing & Suspense:**
   * Insert em-dashes (`—`) for 0.5-second dramatic pauses before shocking revelations.
   * Insert ellipses (`...`) for fading ambience and atmospheric silence.
2. **Combat Cadence:**
   * Use staccato, punchy sentences during high-action combat (e.g. *"Step. Pivot. Strike."*).
4. **The 4 High-Retention Storytelling Directives:**
   * **15–30s Cold-Open Hook (*In Medias Res*):** Open at a peak crisis or badass moment before flashing back to *"12 Hours Earlier..."*.
   * **Punchy System HUD Voiceovers:** Keep spoken holographic system notices under 12 words with crisp impact and zero academic jargon (e.g. `[SYSTEM: CALCULATION RATE 10,000x. ENEMY TRAJECTORY PREDICTED.]`).
   * **Deadpan Sarcasm & Charismatic MC Dialogue:** Inject unbothered, witty, deadpan one-liners to make the protagonist instantly memorable and likable.
   * **Ticking Clock & Looming Threat Outro Hook:** End the episode with an unresolved external crisis in the final 30–45s to maximize binge-watching.

---

## 5. Franchise Character Vault & Reference Sheet Standard

Prior to drafting any episodic prompt matrix, every franchise must initialize its **Character Vault** in `/01_Franchises/Series_XX/character_vault/` containing:

1. **Character DNA Sheets (`characters.json`):**
   - **Protagonist (Tier 1):** Master prompt anchor, facial features, hair undertones, signature attire, and weapon loadout (e.g. `@{Kaelen Thorne - Dual Bronco Regressor}`).
   - **Primary Antagonist (Tier 2):** Arrogant noble scions, corrupt guild captains, and syndicate executives.
   - **Supporting Evaluators (Tier 3):** Senior academy examiners, forensic proctors, and alchemist scholars.
2. **Master Character Reference Plates (16:9 / 9:16):**
   - High-fidelity textless character concept art saved as `character_vault/01_Protagonist_Master_Plate.jpg` matching Midjourney `--cref [URL] --cw 80` standards.
3. **Mandatory Token Injection:**
   - 100% of visual prompt entries `[IMG_001]` to `[IMG_216]` must anchor to their corresponding Character DNA tokens (`@{Character}`) to eliminate diffusion attention splitting or visual drift.
