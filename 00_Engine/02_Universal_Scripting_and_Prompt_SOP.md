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

---

## 6. The 100% Spatial Environment Enclosure & Bit-for-Bit Script Alignment Invariant

To guarantee complete visual cohesion across all generated storyboard plates and eliminate AI drift:

1. **Locked Spatial Enclosure Strings:** Define a master 25-word environment string per story location and copy it verbatim into every prompt of that cluster without altering a single word.
2. **Exact Entity Alignment:** Every named monster, prop, and combat maneuver in the voiceover audio must match the visual prompt description 1:1.
3. **No Shortened Prompts:** All XML scene nodes must be 100% complete and unabridged to prevent diffusion hallucination.

---

## 7. The 12 Zero-Speculation Prompt Construction Standard

Every single prompt entry generated across all franchises must adhere unconditionally to the 12 Zero-Speculation Invariants:
1. **Compositional Screen Pinning:** Pin subject coordinates to screen thirds (`left third`, `center-stage`, `right third`).
2. **Chronological Wardrobe Locking:** Explicitly describe current narrative attire per cut to prevent costume hallucination.
3. **Multi-Actor Identity Binding:** Every multi-person scene MUST identify all actors with distinct demographic tokens (age, outfit, hair, role) and mandate `strictly distinct individuals, zero duplicate protagonist`.
4. **Background Crowd De-Identification:** Audiences/classrooms must use `diverse, softly blurred, indistinct silhouettes with varied hairstyles and ZERO duplicate faces matching the protagonist`.
5. **Exact Skeletal Contact Geometry:** Describe physical grip mechanics on all weapons, papers, and artifacts (`left hand firmly clasped around the wrapped wooden riser of the recurve bow, right fingers hooked on the bowstring`).
6. **Orthogonal Action Perspective:** Enforce natural anatomical angles (`three-quarter front view`, `eye-level framing`) to prevent spinal twist artifacts.
7. **HUD Quadrant Space Pinning:** System interfaces MUST float in open background quadrants (`upper-right quadrant of empty air`) with clear facial clearance.
8. **Dominant Illumination Locking:** Specify the single primary light source per room (`overhead brass chandeliers`, `bioluminescent teal moss`, `sunset amber rays`).
9. **Context-Scoped Environmental Enclosures:** Strictly partition spatial strings per room, eliminating cross-room prop teleportation.
10. **Decoupled Floating HUDs & Mandatory Arm Pinning (Zero-Disembodied-Hand Invariant):** Floating holographic system screens, diagnostic menus, and stat windows must float freely in open air without literal text strings `[...]`. Characters viewing the screen must have both arms physically anchored to their body (e.g. resting at sides, hand on quiver strap) with EXACTLY two arms. ZERO third hands, ZERO disembodied hands touching holographic screens, ZERO hands inside or holding the UI glass.
11. **Single-Perspective Threshold Geometry (Zero Split-Room Distortion):** Doorways, airlocks, and entrance/exit transitions must be composed from ONE unified camera perspective inside a single space. NEVER render split 50/50 dual-room compositions. ZERO non-Euclidean door jambs, ZERO floating disconnected door panels, and ZERO split-dimensional geometry.
12. **Unabridged Universal Negative Anti-Slop Quality Clause:** Include the complete, unabridged negative block on every scene node without exception:
    `dark fantasy action manhwa art style, sharp ink linework, cinematic dramatic lighting, horizontal 16:9, anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn boots and feet, crisp pupil reflections, no character cloning, no duplicate protagonist, no multiple copies of the same character, no twin clones, no self-interaction, no clone audience, diverse background faces, no floating hands, no detached hands, no disembodied hands touching screens, no hands holding floating holographic windows, no hands inside UI glass, no ghost limbs, no morphing artifacts, no missing fingers, no extra limbs, complete limbs, pristine anatomy, no split-room perspectives, no non-euclidean doors, no fractured doorways, no swords on archer, no heavy paladin armor on archer, no random female gender swap for Caelen, no outdoor forest in underground rooms, pure textless artwork.`

---

## 8. The Proactive Prompt Learning & Auto-Codification Protocol

Whenever any prompt correction, visual slop defect, diffusion anomaly, or new generation constraint is identified, calibrated, or resolved during production turns:
1. **Mandatory Dual-Action Requirement:** The agent is strictly forbidden from only silently patching the local prompt file for that single episode.
2. **Autonomous Proactive Codification Gate:** The agent MUST proactively initiate a codification step at turn end (via `/learn` proposal or interactive prompt modal) to persist the newly discovered invariant directly into `AGENTS.md` and the master `00_Engine/` codices.
3. **Zero-Reminder Standard:** The operator should never have to manually remind the agent to update master codices. Codification is an automated studio invariant.

