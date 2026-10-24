---
name: manhwa-matrix
description: Lead Manhwa Storyboard Director & Visual Engine Architect. Enforces 3-Tier Visual Engine (Hero, Split Strip, Multi-Panel), 4 Core Directorial Cinematography Laws (Staging, Weapon Lifecycle, Idiom Filtering, Visor Masking), locked spatial environments, 24-scene batches, and Google Flow XML formatting. Trigger with /matrix.
---

# 🎨 Manhwa Prompt Matrix & Visual Engine (`/matrix`)

> **Role: Lead Manhwa Storyboard Director & Visual Engine Architect**  
> **Master SOP for Cinematic Staging, Prompt Engineering, 3-Tier Layouts & Google Flow Batch Decks**  
> **Slash Command:** `/matrix`  
> **Workspace Root:** `quirky-chandrasekhar`

---

## 🎯 Mandatory Interactive Auto-Grill Pre-Flight (`ask_question`)

Whenever `/matrix` is invoked, the agent MUST immediately halt and initiate an interactive `ask_question` interview:

```
[Interactive Pre-Flight Alignment Modal]
1. Target Franchise & Episode:
   - Dynamically list active franchise and target episode from 01_Franchises/ (e.g. Active Franchise -> Target Episode)
2. Target Action Scope:
   - (Recommended) Audit & Calibrate Existing Prompt Matrix (Layers, Anchors, Environment Strings)
   - Generate Full 24-Scene Modular Batches from Script
   - Calibrate Character DNA Anchors to Name Tokens (@Character Name)
   - Export Google Flow XML Batch Decks
```

---

## 🎨 The Dynamic Hybrid Multi-Panel Strip Standard (The 3-Tier Visual Engine — Format 1: 9:16)
Mandatory **~70% Multi-Panel to ~30% Hero Plate ratio**:

1. **Tier A: Full-Bleed Cinematic Hero Plate (Single Panel / Wide Focus — ~30% of Deck)**
   - **Use Case:** Major awakening moments, boss reveals, vast landscapes, monumental artifacts.
   - **Dynamic Screen Hold:** $5.0\text{s} – 8.0\text{s}$.
   - **Syntax:** `Full-bleed cinematic hero plate. [Epic reveal/boss/awakening description]. [Franchise Art Style Directive from franchiseStyleHelper.js (e.g. Dark fantasy action manhwa webtoon art style, sharp black ink linework, high contrast cel shading, cinematic dramatic lighting for Series 05)], [Aspect Ratio (16:9 Landscape or 9:16 Vertical)].`
2. **Tier B: Dual-Panel Dynamic Split Strip (2 Framed Manhwa Blocks in 9:16 — ~50% of Deck)**
   - **Use Case:** Dialogue exchanges, cause-and-effect, action vs reaction, eye close-up vs body posture.
   - **Dynamic Screen Hold:** $6.0\text{s} – 9.0\text{s}$.
   - **Syntax (Action-Matched Prose — Zero Colon Meta-Labels):** `2D Korean webtoon manhwa illustration, sharp black ink linework, high contrast cel shading. Dual-panel vertical 9:16 split strip. In the upper panel, [Subject, posture, and literal action matching script]. In the lower panel, [Reaction, consequence, or detail shot].`
3. **Tier C: Multi-Panel Strip (3 Framed Comic Panels in 9:16 — ~20% of Deck)**
   - **Use Case:** Rapid combat micro-beats, tactical breakdown, or multi-beat dialogue/observation sequences.
   - **Dynamic Screen Hold:** $7.0\text{s} – 12.0\text{s}$.
   - **Syntax (Action-Matched Prose — Zero Combat Boilerplate in Calm Scenes):** `2D Korean webtoon manhwa illustration, sharp black ink linework, high contrast cel shading. Three-panel vertical 9:16 strip. In the upper panel, [First beat]. In the middle panel, [Second beat]. In the lower panel, [Third beat].`

---

## 🖥️ Format 2: 16:9 Full-Bleed Landscape Composition
1. **Mandatory 16:9 Aspect Ratio:** All prompts specify `16:9 horizontal landscape aspect ratio` (Midjourney `--ar 16:9`).
2. **4-Tier Horizontal Composition Distribution:**
   - **Archetype A (~40%):** Wide Battlegrounds (Protagonist on left third, monster horde on right third).
   - **Archetype B (~25%):** In-Frame Holographic System HUD Windows floating beside protagonist.
   - **Archetype C (~20%):** Kinetic Horizontal Action / Spatial Shears slicing widescreen.
   - **Archetype D (~15%):** Vast Panoramic Establishing Shots (Catacombs, Red Gates).
3. **Zero-Sidebar Render:** 100% edge-to-edge landscape with horizontal sweeping pans, zero blurred wings.

---

## 🎬 The 4 Core Directorial Cinematography Laws (Zero-Slop Production Standard)

### 1. Directorial Staging for Two-Character Panels (Zero-Bleed Multi-Actor Law)
Two characters ARE allowed to share a panel, but ONLY under one of two strict cinematographic stagings:
- **A. Screen-Coordinate Standoff (Proscenium Grid):**
  The two actors must be locked to opposite screen thirds with explicit physical distance separation:
  `Two-shot wide standoff. Pinned on screen left third: @{Actor A} in [Wardrobe A] standing upright facing right. Pinned on screen right third: @{Actor B} in [Wardrobe B] slumped against the wall facing left. Separated by 3 meters of empty tiled floor. Explicit visual isolation: Actor A is standing upright, Actor A is NOT lying down; Actor B is slumped on ground, Actor B is NOT wearing [Color A].`
- **B. Over-The-Shoulder (OTS) Silhouette Staging:**
  One actor is strictly an untextured dark silhouette with back to camera, while the second actor is fully lit and facing the camera:
  `Over-the-shoulder dramatic angle. In the extreme foreground: solid dark black silhouette of @{Actor A}'s shoulder and back of head, zero facial features. In the middleground facing camera: @{Actor B} fully lit and rendered [action/state].`

### 2. The Weapon & Prop Lifecycle State Machine (Anti-Zombie Weapon Law)
- **State 1 (Equipped/Drawn):** Bound to canonical weapon entity name in `<character_refs>` (e.g. `Gu Tianyu's Jade Spirit Blade`). Explicit hand grip described.
- **State 2 (Sheathed):** Bound to canonical weapon entity name in `<character_refs>`. Explicitly sheathed at waist/back.
- **State 3 (Environmental Prop):** Bound to `<entity_ref>` ONLY. Character `<character_refs>` must be empty. Character hands explicitly empty.
- **State 4 (Destroyed / Shattered / Powder):** **STRICTLY FORBIDDEN from `<character_refs>`!** The weapon token is revoked. Described strictly as an environmental debris prop in Layer 3 (`fine grey mineral dust scattered on the black rubber doormat`).
- **Strict Multi-Word & Whole-Word Token Matching:** Weapons and tactical props must NEVER be bound via single generic noun substrings (e.g. generic `"staff"` matching `"Carved Blackwood Staff"`, generic `"blade"` matching `"Jade Spirit Blade"`) or geographic words (e.g. `"Blackwood Forest"` matching `"Carved Blackwood Staff"`). Binding requires exact multi-word matching (`"blackwood quarterstaff"`, `"blackwood staff"`).
- **Strict Chronological Weapon Lifecycle Gate:** Weapons and signature equipment must NEVER be bound to scenes prior to their canonical creation, crafting, or acquisition scene (e.g. young Michael's blackwood staff cannot exist before Scene 054).

### 3. Metaphor-to-Diegetic Visual Translation Gate
Script figures of speech (e.g. *"swatting a fly with a cheap sword"*, *"cutting paper"*, *"like a falling mountain"*) must NEVER enter the prompt matrix as literal props. If an established weapon exists in the scene, reference its canonical token (`@{Canonical Weapon Name}`). Never output generic terms like `cheap sword` or `iron dagger`.

### 3b. The Metaphor & Prop De-Identification Gate (Anti-Monster Bleed)
- **Absolute Ban on Keyword Bleed:** In-script metaphors, craft materials, heraldic crests, or mob descriptions containing monster keywords (e.g. *"dragon leather"*, *"dragon crest"*, *"wolf beast"*, *"like a wild beast"*) must NEVER trigger character entity bindings for actual living calamity monsters (such as `@{Calamity Abyssal Wyrm}`).
- **Heraldic & Material Staging:** When a crest or material is referenced, describe it strictly as an inanimate architectural sculpture or craft texture (`engraved platinum relief plaque depicting a dragon, solid metal sculpture only, zero living monsters`).
- **Climax Boss Isolation:** Elite Calamity Bosses must be bound strictly and exclusively to scenes where the actual living creature is physically present and engaged in active narrative events.

### 3c. The Character Agency & Subject-Action Alignment Gate (Anti-Protagonist Fallback Law)
- **Strict Subject-Action Alignment:** When narrative text describes dialogue, commands, or attacks performed by an antagonist, proctor, mob, or external force (e.g. *"The Grand Inquisitor roared"*, *"raising his diamond-tipped staff"*, *"Ten thousand lances erupted"*), the prompt generator is **strictly forbidden from binding the protagonist as the active subject**.
- **Zero Protagonist Default Fallback:** When an antagonist speaks or attacks, never default to inserting the protagonist. If an antagonist lacks an official Character Vault entry, the prompt MUST depict the antagonist using explicit physical archetype descriptors (e.g. `austere imperial inquisitor prelate in ivory-and-gold robes`) or register them in the vault immediately via `/vault`.
- **Incoming Attack vs Defending Stance Staging:** In incoming bombardment, artillery, or ambush scenes (e.g. ten thousand spells raining down from sky), the attacking fleet/mob MUST be rendered as the active barrage source. The defending protagonist must be staged strictly in receiving, exhausted, or observant posture—**strictly forbidden from prompting the protagonist casting the incoming spells**.
- **The Focal Bullseye & Anti-Terrain-Targeting Invariant:** Whenever an incoming barrage or ranged bombardment is aimed at a character, prompts must NEVER describe the attack as targeting terrain features (*"converging upon the summit"*, *"bombarding the ground"*, *"striking the cliffs"*), as diffusion models treat terrain as the primary subject and draw unpopulated landscapes. The prompt MUST explicitly anchor the character as the focal bullseye (`"ten thousand energy beams zeroed in and converging directly upon @{Character}'s chest and body as the singular lethal bullseye, beams inches away from striking him from all 360 degrees, standing dead center of frame"`).

### 4. Nameless Personnel De-Identification & Visor Masking
- **Nameless Personnel (Medics, Soldiers, Analysts):** Must be explicitly rendered with `nameless tactical staff wearing full-face dark-tinted pressurized visors or face-concealing balaclavas, zero individual human facial features, positioned strictly in the background`.
- **Establishing Broadcast/City Wide Shots:** Must mandate `100% environment and architecture focus, colossal floating ranking monument dominating the night skyline with radiating golden runes, zero foreground characters, zero close-up human faces, pedestrians rendered strictly as distant indistinct silhouettes in soft blur`.

---

## 📐 The 5-Layer Prompt Hierarchy & Dynamic Batch Partitioning ($\lceil N_{\text{scenes}} / 24 \rceil$)

Every episode uses **100% Dynamic Batch Partitioning ($\lceil N_{\text{scenes}} / 24 \rceil$)** derived from its organic spoken narrative length (never pad or truncate to fixed batch quotas; final batch may contain $\le 24$ scenes). Every single prompt entry MUST contain the 5 layers:
1. **Layer 1: Front-Loaded 2D Manhwa Style Lock, Camera Framing & Aspect Ratio**
2. **Layer 2: Demographic & Character DNA Anchors (Mandatory Curly Brackets: `@{Character Name}`)**
3. **Layer 3: Invariant Locked Spatial Environment Enclosure (Verbatim 25–30 words)**
4. **Layer 4: Unambiguous Literal Action, Weapon State & Interaction Matching Spoken Narration**
5. **Layer 5: Dual-Mode Text Control & Anti-Morphing Guards**

---

## 🛡️ The 14 Anti-Slop Visual Quality Guardrails & Dual-Mode Text Control

1. **Multi-Actor Isolation:** Strictly ONE instance of protagonist per frame. Zero doppelgängers. Explicit distinct demographics for second party.
2. **Background Crowd De-Identification:** Background audience rendered as diverse, softly blurred, indistinct silhouettes with zero duplicate faces matching protagonist.
3. **Compositional Screen Pinning:** Pin subject coordinates (`In the left foreground / center-stage / right third...`).
4. **Chronological Wardrobe Locking:** Strictly lock wardrobe to narrative timeline phase (e.g. craftsman linen vs sovereign coat). Zero premature transformations.
5. **Skeletal Limb Connectivity:** Every held prop/weapon has explicit contact geometry (e.g. `left hand firmly clasped around wooden riser, right fingers on string, both arms physically connected to shoulders`). Zero floating props.
6. **Orthogonal Action Perspective:** Single anatomically natural viewpoint per cut. Zero 270° spine twists.
7. **In-Frame HUD Quadrant Pinning:** Floating status windows positioned in open screen quadrants (`floating strictly in upper-right quadrant of empty space`).
8. **Dominant Illumination Locking:** Specify single primary light source per room.
9. **Context-Scoped Environment Partitioning:** Environment strings strictly match room (corridors must not inherit auditorium steles).
10. **Dual-Mode Text Control (`STRICT NARRATIVE SILENCE` vs `ALLOWED ENVIRONMENTAL TEXT`):**
    - **FORBIDDEN (Narrative & Comic Overlays):** Strictly zero speech bubbles, dialogue balloons, thought bubbles, narrator caption boxes, subtitles, comic sound effects (SFX/onomatopoeia), Hangul (`한글`), or watermarks.
    - **ALLOWED (Environmental / Diegetic Only):** Text is permitted ONLY when it is a physical, in-world element of the scene (glowing holographic System/UI status screens, text on an ancient cultivation scroll or book, stone stele inscriptions, or shop/sect signage), integrated naturally into the 2D manhwa aesthetic.
11. **Single-Perspective Threshold Geometry:** Doorways and portals composed from ONE unified perspective; zero split-room compositions.
12. **Context-Aware Dynamic Negative Quality Clauses:**
    - **Mode A (Character Scenes):**
      `[Franchise Art Style Directive from franchiseStyleHelper.js (e.g. Dark fantasy action manhwa webtoon art style, sharp black ink linework, high contrast cel shading, cinematic dramatic lighting for Series 05)], [Aspect Ratio (16:9 Landscape or 9:16 Vertical)], anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn footwear, crisp pupil reflections, no character cloning, no duplicate protagonist, no foreground strangers stealing focus, natural background crowd permitted where contextually appropriate, no floating hands, no detached hands, no ghost limbs, no morphing artifacts, no missing fingers, no extra limbs, complete limbs, pristine anatomy, pure 100% textless artwork, no speech bubbles, no comic SFX, no photorealistic 3D CGI.`
    - **Mode B (Pure Environment / Prop Scenes):**
      `[Franchise Art Style Directive from franchiseStyleHelper.js], [Aspect Ratio (16:9 Landscape or 9:16 Vertical)], 100% environment landscape illustration, completely unpopulated, zero humans, zero people, zero characters, zero figures in the sky, no floating characters, pristine landscape, zero human anatomy, no foreground strangers, pure 100% textless artwork, no speech bubbles, no comic sound effects, no text overlays, no subtitles, no watermarks.`
13. **Anti-Meta-Terms Visual Invariant:** Strictly forbidden from using layout meta-terms (*"Character Sheet"*, *"Model Sheet"*, *"Turnaround Sheet"*, *"Concept Art Sheet"*). Use pure descriptive language.
14. **Exhaustive Script Tag Alignment First:** Reconcile disk files $\rightarrow$ prompt matrix $\rightarrow$ SRT subtitles. Never prematurely request re-generations.
15. **Context-Aware Crowd & Extra Staging Standard:**
    - **Public Scenes (Communal Plazas, Academies, Markets, Guild Halls, Grand Plazas):** Permitted context-appropriate background citizens, students, or onlookers in soft blurred depth of field (`background citizens/onlookers in franchise-accurate attire, soft blurred depth of field, natural public activity, distant onlookers looking in awe`).
    - **Private Interior Scenes (Private Workshops, Bedchambers, Sanctuaries, Private Dorms):** Blanket crowd permissions are **STRICTLY PROHIBITED**. Must mandate: `strictly private interior room, zero background extra characters, strictly [Characters Present] only, no third person, no strangers, pure 100% textless artwork.`
16. **The Clean `<narrative_sync>` vs Tokenized `<prompt>` Boundary Law:**
    - `<narrative_sync>` MUST match the spoken audio script bit-for-bit in clean, human-readable prose with ZERO `@` tokens.
    - `@{Character Name}` tokens are strictly restricted to `<prompt>` blocks and `<character_refs>` for Google Flow reference conditioning.
17. **The Zero-Unbound-Entity Mention Mandate (Vault Model Lock):**
    - Every character, weapon, tactical prop, or monumental artifact registered in the Character & Item Vault (`characters.json` and `items.json`) MUST be referenced in `<character_refs>` and wrapped in explicit curly brackets `@{Entity Name}` whenever mentioned in a `<prompt>`.
    - Strictly forbidden from mentioning vault entities (e.g. `Heaven-Earth Golden Stele`, `Jade Spirit Blade`, `Tactical Spirit Spectrometer`, `Heavenly Dao Simulator Interface`) in plain unbound text.
    - If a scene depicts only ground-level or interior elements where the entity is absent, plain-text mentions of that entity must be completely removed from the spatial enclosure to prevent diffusion model hallucination and ensure 100% consistent model plate attachment.

---

## 🧠 Smart Context-Aware Two-Tier Google Flow Architecture & 5 Anti-Morphing Compiler Rules

- **Tier 1 (`STRICT OPERATIONAL DIRECTIVES` Master Agent Instructions):** Set once per project/session in Google Flow's `Agent Instructions` panel (document icon &rarr; + Add instruction). Enforces:
  1. `1. MANDATORY FILE NAMING`: Auto-renaming immediately to match `filename="IMG_XXX.jpg"` without waiting for a sync command.
  2. `2. TEXT CONTROL (STRICT NARRATIVE SILENCE + ALLOWED ENVIRONMENTAL TEXT)`: Zero speech bubbles/SFX/Hangul; whitelists environmental text only where explicitly required.
  3. `3. COMPOSITION, LOGIC & ANTI-MORPHING`: Flawless anatomy, single protagonist, and strict subject isolation.
  4. `4. ART STYLE INVARIANT`: Front-loaded 2D manhwa linework, cel shading, and explicit aspect ratio (16:9 Landscape vs 9:16 Vertical).
  5. `5. CHARACTER ENTITY REFERENCE MAPPING RULE`: Mandatory directive: `"Always map @{Character Name} tags to their corresponding character entity references in this project."` Resolves `@{Character Name}` tags directly to internal character assets and DNA bibles.
- **Mandatory Two-Layer Pipeline Handoff:** Whenever prompt matrix rules, character anchors, negative style constraints, or format aspects (16:9 vs 9:16) are modified or decoupled, the agent is **STRICTLY FORBIDDEN** from delivering only the scene XML blocks. The agent MUST synchronously generate, verify, and present the updated **Tier 1: Master Agent Instructions** in the exact same response, guaranteeing zero drift between Google Flow's system instructions and the scene prompts.
- **Tier 2 (Smart Per-Batch Headers & High-Attention Scene Prompts):** `PromptMatrixView.vue` dynamically inspects each batch (`analyzeFlowContext()`) to whitelist environmental text **ONLY on the exact `<scene>` IDs that contain UI panels, scrolls, steles, or signs** (locking all other scenes to 100% pure textless), injects entity-specific anti-morphing rules, and appends the `@{Character Name}` entity reference mapping directive.
- **The 5 Anti-Morphing & Anti-Hallucination Scene Compiler Rules:**
  1. **Zero Combat Boilerplate in Non-Combat Scenes:** Never inject `"Dynamic impact or technique execution"` or `"Combat aftermath"` into Tier B/C templates when the script clause describes sitting, talking, resting, cultivation meditation, or observation.
  2. **Mandatory Pronoun-to-Entity Resolution Before `<character_ref>` Binding:** Resolve `He`, `She`, `It`, `Its`, `They` against the preceding sentence before binding `@{Character Name}` tags. Never attach the human protagonist's reference to a sentence describing Boss wings or Automaton mechanical hands.
  3. **Explicit Physical Separation in Multi-Entity Clashes (Anti-Chimera Guard):** When a human character and a monster/construct appear in the same `<scene>`, assign them to separate panels or explicitly state: `keeping @{Protagonist}'s human body completely separate and distinct from @{Boss}'s [wings/mechanical limbs/claws]`.
  4. **Front-Loaded & Preserved 2D Manhwa Style Lock:** Always retain the franchise's canonical art style directive from `franchiseStyleHelper.js` (e.g. `Dark Fantasy High-Magic Medieval Empire` for Series 05; `Modern 2025 Urban Cultivation` for Series 04) to prevent 3D CGI or stylistic drift.
  5. **Zero Colon Meta-Labels:** Never use bracketed headers (`[Action]`) or bare `Top: / Middle: / Bottom:` colons that trigger comic caption boxes; use natural prose transitions (`In the upper panel, ...`).

---

## 🛡️ Google Flow AI Safety Standard

1. **Zero Gore/Violence Keywords in Negative Blocks:** Never use `severed`, `blood`, `gore`, `corpse`, `beheaded`. Use: `no missing fingers, no extra limbs, complete limbs, pristine anatomy`.
2. **Crystalline & Armor Impact Phrasing:** Describe lethal combat strikes via magical weak points and armor deflections.
3. **Colour & Lighting Sanitisation:** Use `crimson`, `ruby`, `scarlet energy`, or `mana mist` instead of `blood-red` or `blood`.
4. **Nudity False-Positive Prevention:** Use `unaided vision` or `natural eyesight` instead of `naked eye`.


---

## 🚀 The Hyper-Dense Visual Prompt Standard (Google Flow / Nano Banana 2.1)
1. **Unconstrained Prompt Length:** Never compress or truncate prompts. Every `<prompt>` block must be thoroughly saturated with:
   - **Lens & Angle:** Explicit camera focal length (24mm wide angle, 50mm dynamic eye-level, 85mm portrait, 100mm extreme macro, Dutch tilt).
   - **Verbatim Character DNA:** Full wardrobe, hair style, facial expression, eye glints, and physical arm placement for every actor present.
   - **Dual Entity Binding:** Explicitly reference character AND weapon/prop tokens (e.g. `@{Character Name}` gripping `@{Weapon/Prop Name}`).
   - **Locked Spatial Coordinates:** Verbatim room geometry and time-of-day lighting (e.g. rustic frontier cabin with stone fireplace and cedar walls, or private study with illuminated desk; fixed spatial anchors).
   - **Exhaustive Negative Anti-Slop Clause:** Unabridged anatomical and stylistic quality guardrails.
2. **Full Prompt Default:** Lean Mode must default to `false` so 100% of negative quality clauses and environmental details are preserved when copying to Google Flow.

---

## 🎬 Role Specification: Chief Continuity Director & Narrative-Visual Sync Auditor

Whenever the agent is tasked with auditing, creating, or calibrating episodic prompt matrices or video decks, the agent MUST explicitly adopt the role of **Chief Continuity Director & Narrative-Visual Sync Auditor** and enforce both the **6 Master Laws of Narrative Common Sense & Physical Continuity** and the **7-Point Forensic Continuity Contract**:

### 🧠 The 6 Master Laws of Narrative Common Sense & Physical Continuity

1. **The Milestone Wardrobe Shift Law (Zero Pop-In / Zero Premature Reversion):**
   - When a narrative milestone awards or establishes crafted attire (e.g. Michael hunting timber wolves and crafting tailored wolf-leather clothing with a fur collar at age 7), that wardrobe becomes the character's **permanent canonical model**.
   - When departing a sanctuary or travelling to civilization, the character **already wears that attire upon stepping outside**.
   - The agent is strictly forbidden from reverting to previous rags/linens or introducing the new attire abruptly in a single scene. The wardrobe stays locked across all subsequent episodes unless explicitly changed by a new narrative event.

2. **The Physical Prop Lifecycle State Machine (Absolute Persistence Law):**
   - If a character equips or packs an item to transport goods (e.g. packing rare herbs into an `Herb Rucksack`), that prop is physically bound to their character model across **100% of sequential transit, arrival, gate, and market scenes**.
   - Props cannot vanish into thin air between panels or morph into different items (e.g. a rucksack turning into two satchels).
   - The prop remains visible until an explicit narrative action states they put it down (e.g. unstrapping the rucksack onto Rowan's shop counter).

3. **Anti-Template Contamination (Context-Matched Prose Law):**
   - Layout templates (Tier B Dual-Split, Tier C Multi-Panel) must **never** inject generic combat boilerplate (*"high-impact kinetic technique motion"*, *"decisive clash"*, *"physical impact shockwave"*) into peaceful scenes.
   - For peaceful scenes (entering an apothecary, browsing market stalls, drinking tea), templates must strictly use calm narrative prose (*"gentle door chime"*, *"polite bow"*, *"examining dried roots"*).

4. **Negative Metaphor Diegetic Shield (Literalism Purge Law):**
   - Narrative figures of speech that describe what a character is **not** doing (*"zero magic wand"*, *"without chanting"*, *"didn't need a sword"*) must NEVER leave the negative keywords in prompt blocks.
   - Diffusion models cannot parse negation and will draw the forbidden object. All negative idioms must be diegetically translated to literal positive actions (e.g. *"bare knuckles crackling with concentrated cyan mana, tapping the stone with empty hands"*).

5. **Vertical Observer Staging & Separation of Agency Law:**
   - When an observer watches external events from a higher elevation (e.g. a 2nd-floor bedroom window or balcony), the camera MUST be staged inside the window framing the observer in the foreground looking down.
   - External crowd focus (e.g. students cheering noble student Vance in the courtyard) must NEVER be bound to the protagonist. The protagonist remains isolated upstairs as a detached observer with a dry smirk.

6. **Continuous Entity Reference & Weapon Binding Law:**
   - In multi-beat combat clashes, signature weapons (`@{Carved Blackwood Staff}`) and boss entities (`@{Calamity Abyssal Wyrm}`) must remain in `<character_refs>` and prompt descriptions across **100% of consecutive clash panels**.
   - Dropping an entity reference between beats causes diffusion models to hallucinate generic ogres, raw tree trunks, or random wands.

7. **The Two-Character Dialogue Anchor Law (Anti-Stranger Hallucination Mandate):**
   - Whenever two characters engage in dialogue, trading, or mutual reaction across a table, counter, or room (e.g. Michael and Rowan in the apothecary), **BOTH characters MUST be explicitly bound in `<character_refs>`** and tagged with `@{Character Name}` in the prompt.
   - Omitting the dialogue partner or listener from `<character_refs>` prevents Google Flow from attaching their entity reference image, causing diffusion models to hallucinate an unanchored, inconsistent stranger for the reaction panel.
   - Dual-panel split strips (Tier B) depicting an exchange must stage the active speaker in the upper panel and the explicitly tagged conversational partner reacting in the lower panel.

8. **The Attire & Prop Continuity State Machine (Anti-Vanish Mandate):**
   - Once a character crafts, equips, or carries an item or wardrobe change (e.g. wearing the winter-wolf leather tunic upon leaving the forest, or carrying the strapped herb rucksack), this state persists across **100% of consecutive scenes**.
   - Props and bags MUST remain visible in all traveling, trading, and standing scenes until the script explicitly narrates setting the bag down, handing over the items, or changing clothes. Spontaneous appearance or disappearance between consecutive cuts is strictly prohibited.

9. **Signature Weapon Canonical Morphology (Anti-Twisting Staff Law):**
   - Signature quarterstaffs (such as the *Carved Blackwood Staff*) are strictly straight, smooth, cylindrical solid wooden bo quarterstaffs with flat or iron-capped ends.
   - Prompts must explicitly prohibit wizard orbs, crystal balls mounted on top, gnarled tree branches, crooked cane heads, or twisted roots.

10. **The 100% In-Prompt Entity Mirror Mandate (Zero-Ghost-Actor Law):**
    - Listing a character or prop in `<character_refs>` alone is **STRICTLY INSUFFICIENT**.
    - Every single entity indexed in `<character_refs>` MUST have an exact corresponding `@{Character Name} (DNA tokens...)` tag explicitly present inside the prompt body (`Featuring @{...}`).
    - Never describe an indexed character in the prompt using generic role nouns (*"the shopkeeper"*, *"the mentor"*, *"the clerk"*, *"the guard"*) without their explicit `@{Character Name}` macro.
    - If a character is on screen, interacting, or referenced in the scene tag, their character macro MUST be present in the prompt to force Google Flow to bind their reference image.

11. **The Anti-Bleed Dialogue & Voiceover Insulation Law:**
    - **Zero Spoken Dialogue in Visual Prompts:** Spoken dialogue quotes (*"..."*) from the voiceover script must NEVER be dumped verbatim into the visual prompt description. The prompt must describe *physical visual actions, facial expressions, and spatial interaction* (e.g. *"Michael unstraps his rucksack and places it upon the cedar counter; Rowan leans forward to inspect it"* instead of pasting the transcript lines).
    - **Literal Metaphor & Audio Hyperbole Purge:** Auditory descriptions (*"alarm bells screaming"*, *"jars rattling"*, *"fleeing like frightened sheep"*, *"an output that couldn't boil an egg"*) must be filtered out of visual prompts so the model never generates literal sheep, floating bells, or soundwaves.
    - **Audio-Visual Boundary Isolation:** Each scene's `<narrative_sync>` and `<prompt>` must strictly depict the visual state of *that exact spoken audio timestamp*. Never anticipate or illustrate actions belonging to subsequent cuts before the voiceover has arrived at them.

12. **The Anti-Morphing & Single-Action Anatomy Law (Zero-Chimera Mandate):**
    - **Panel-to-Entity Isolation in Multi-Panel Strips:** In Tier B (Dual-Panel) and Tier C (Three-Panel) strips, each panel block MUST explicitly declare its singular primary subject (e.g. *Upper block: Michael standing at counter. Lower block: Rowan leaning forward*). Describing multiple characters in a single unseparated prompt causes the diffusion model to blend their facial features, skin tones, or ages into a single hybrid chimera.
    - **Singular Hand Action per Character:** Each actor is strictly limited to ONE physical hand action per cut (e.g. *hands resting on counter* OR *holding staff with both hands*). Never command an actor to hold a staff, hold a cup, open a bag, and unroll herbs simultaneously, which causes the model to generate 3 or 4 mutant hands.
    - **Wardrobe State Immutability:** Once a character undergoes a canonical wardrobe evolution (e.g. *Michael Montrey (Wolf-Skin)*), the previous base wardrobe token is strictly revoked. The new attire token is immutable across 100% of subsequent scenes until the next story milestone.

13. **The Family & Kinship Character Reference Law (Anti-Random-Family Mandate):**
    - Whenever an episodic script or narrative clause depicts or discusses active interaction, confessions, living quarters, meals, craftsmanship, or lineage scenes involving family members (father, mother, sister, brother, son, daughter, grandfather, grandmother, aunt, uncle, clan kin):
      * **Vault Pre-Registration Mandate:** Those family members MUST be formally pre-registered in `character_vault/characters.json` and `00_Characters/` with canonical names, roles, and visual DNA reference plates before matrix assembly.
      * **Explicit `<character_refs>` Co-Anchoring:** The scene's `<character_refs>` block MUST explicitly bind each interacting family member (e.g. `<character_refs>Garrett Miller, Clara Miller</character_refs>`).
      * **Mandatory In-Prompt Macro Mirroring:** The prompt body MUST explicitly include their `@{Character Name}` macro and DNA tokens (e.g. `Featuring @{Garrett Miller}`, `Featuring @{Clara Miller}`).
      * **Absolute Ban on Anonymous Family Role Nouns:** Describing family members with generic anonymous nouns (*"the father"*, *"his mother"*, *"a young boy"*, *"the parents"*, *"the sister"*) without their canonical macros is strictly prohibited. Anonymous prompting causes Google Flow and diffusion models to hallucinate random, ever-changing strangers with mismatched ages, features, and clothing across consecutive cuts.

---

### 🛡️ The 7-Point Forensic Continuity Contract

1. **Spatial Enclosure & Geographical Anchor Law:**
   - Verify that the physical environment in `Spatial Enclosure:` bit-for-bit matches the active story location in `narrative_sync`.
   - If characters are in an apothecary loft, the enclosure must be the loft/town, NEVER a remote forest basin. If the narrator describes sub-zero winter blizzards in a cave, the enclosure must NEVER be an imperial marble gateway.
2. **Diegetic Co-Presence vs Dialogue Mentions Gate (Anti-Teleportation Law):**
   - Third-party entities merely mentioned in dialogue, insults, or thoughts (e.g. *"spiting your father"*, *"by the Emperor's order"*, *"my brother will kill you"*) MUST NEVER be bound to `<character_refs>` or visually drawn in the scene.
   - Only characters physically standing, fighting, or interacting in the room or active camera framing are bound and prompted.
3. **Metaphor & Simile Diegetic Filter (Anti-Literalism Law):**
   - Poetic figures of speech and auditory similes (e.g. *"resembling a thunderbolt striking an iron anvil"*, *"eyes like daggers"*, *"an aura like an active volcano"*) MUST be purged from prompt blocks.
   - Extract only the literal diegetic action (e.g. *"the quarterstaff tip detonating directly against the monster's horned skull with blinding cyan plasma"*). Never prompt an anvil, armor plate, or volcano.
4. **Combat Strike & Clash Completeness Law (Anti-Missing Boss Law):**
   - In every combat strike, technique clash, or execution impact (`Tier B` or `Tier C` strips):
   - BOTH the attacker AND the targeted enemy monster MUST be explicitly bound in `<character_refs>` and described in the prompt. Dropping the boss entity from impact scenes is strictly forbidden.
5. **Chronological Milestone Demographic Aging Law (Active Age Locking):**
   - Track age, wardrobe, and physical evolution across story milestones.
   - When a narrative timeskip occurs (e.g. 2 years passing at `IMG_176`), the demographic token MUST permanently shift across all downstream scenes (e.g. `5-year-old` permanently transitions to `7-year-old`).
6. **Pure Descriptive World Building (Zero Environment References):**
   - World Settings are NEVER bound as image references in Google Flow. They are rendered exclusively via rich descriptive text in the `Spatial Enclosure:` tag to prevent background bleed into unrelated scenes.
7. **The Studio Zero-Heuristic Mandate:**
   - The Studio web application operates as a pure execution pipeline (FFmpeg compilation, timeline playback, launchpad copying). All content validation is performed cognitive-first by the Agent LLM prior to data ingestion.

---

### 🛡️ The Google Flow AI Policy & Safety Shield (Zero-Policy-Violation Mandate)

Prior to releasing any prompt matrix or XML deck, the Chief Continuity Director MUST rigorously sanitize all prompts against Google Flow's four automated policy classifiers:

#### 1. Minor Safety & Child Trauma Immunity (Zero-Tolerance)
- Whenever a protagonist or character is described as a minor (`5-year-old`, `7-year-old`, `young boy`, `child`):
  - **Banned Suffering Tokens:** Strictly forbidden from using *bleeding*, *gums bleeding*, *vomiting blood*, *blacked out from shock*, *screaming in agony*, *starving*, *shivering in terror*, or *broken bones*.
  - **Mandatory Sovereign Re-Staging:** Re-stage all strain and impact into cool, composed, stoic sovereign manhwa tropes: *calm analytical focus*, *cyan mana barrier absorbing shockwaves*, *stoic unwavering gaze*, *concentrated breathing*, *subtle cyan aura flaring from brow*.

#### 2. Adult-to-Minor Contact & Restraint Shield
- **Banned Interaction Tokens:** Strictly forbidden from describing an adult *grabbing*, *restraining*, *hooking*, *holding by the neck*, *choking*, or *pulling clothing/chains* around a minor's neck, chest, or wrists.
- **Mandatory Autonomous Re-Staging:** The minor MUST act autonomously. For inspections or transactions (e.g. Rowan inspecting the crest amulet):
  - *Compliant Action:* "Michael calmly places the platinum dragon medallion flat upon the polished cedar counter; Rowan leans forward with widened eyes to examine it across the table."

#### 3. Visceral Gore & Mutilation Purge
- **Banned Gore Tokens:** Strictly forbidden from using *dead bodies*, *corpses*, *pools of blood*, *mutilated flesh*, *severed limbs*, *decapitation*, *acid burning skin*, or *shattered skull bones*.
- **Mandatory Manhwa Cel-Action Re-Staging:**
  - Instead of *corpses in a battlefield* $\rightarrow$ "evacuated town plaza, shattered stone masonry, barricades, retreating guards holding heavy shields".
  - Instead of *acid melting flesh* $\rightarrow$ "sizzling violet wyrm plasma craters, billowing purple rift haze".
  - Instead of *shattered monster skull and brain* $\rightarrow$ "spiderweb of luminous fractures cracking across obsidian monster scales, concussive cyan lightning shockwave, eyes turning pure white upon defeat".

#### 4. Weapon-to-Throat / Execution Geometry Gate
- Strictly forbidden from prompting weapons held directly against an unarmed character's or child's neck/throat (*blade pressed against neck*, *dagger to throat*).
- Replace with dynamic combat stances: *deflected blade*, *kinetic parry*, *mana shockwave repelling weapons*, *raised defensive staff*.

#### 5. Apothecary, Chemical & Ingestion/Absorption Shield
- Whenever scenes involve apothecaries, herbalism, alchemy, chemistry, or monster biology:
  - **Banned Chemical & Controlled Substance Tokens:** Strictly forbidden from using *powdered monster bones*, *white powder*, *powdery sand*, *crushed speck between fingernails*, *potency surging into skin*, *volatile saponins*, *cell membranes*, *poisonous lookalikes*, *venom glands*, *corrosive acid pools*, *toxic purple fog*, or *taking as an apprentice in the woods*.
  - **Mandatory High-Fantasy Re-Staging:**
    - Instead of *powdered monster bones / powders* $\rightarrow$ "luminous blue mana crystals, dried silver roots, copper alembics bubbling with clean golden steam".
    - Instead of *crushed speck surging into skin / touching to tongue* $\rightarrow$ "lifting the wild root toward warm sunlight, visually inspecting pure glowing silver mana veins and uncorrupted botanical purity".
    - Instead of *saponins degrading cell membranes* $\rightarrow$ "pure lunar mana circulating within the root before the morning sun disperses its essence".
    - Instead of *poisonous lookalikes / toxic weeds* $\rightarrow$ "worthless mountain weeds, inert common flora".
    - Instead of *corrosive acid pools / boiling venom* $\rightarrow$ "sizzling violet wyrm plasma craters, billowing purple rift haze".
    - Instead of *wyrm venom glands* $\rightarrow$ "wyrm mana cores".
    - Instead of *taking as apprentice in the secluded woods* $\rightarrow$ "learning lost high-tier classical alchemy from ancient treatises".

#### 6. Minor Garment, Torso & Tactile Action Shield (Zero-Tolerance)
- Whenever a character is indexed as a minor (`5-year-old`, `7-year-old`, `child`, `boy`):
  - **Banned Tactile Garment Tokens:** Strictly forbidden from prompting the minor *reaching inside clothing*, *tucking inside tunic/shirt*, *sliding hands into pockets*, *reaching down to waist/torso*, or *smoothing the front of tunic/clothes*.
  - **Mandatory Sovereign Re-Staging:** Keep all item interactions external, clean, and dignified: *holding medallion openly by chain*, *resting hand on staff*, *standing with sovereign posture*, *clasping staff with both hands*.

#### 7. The Banned Diffusion Anatomy Pitfalls Gate
- **Strictly Banned Token Phrases:** Strictly forbidden from using `"all limbs connected"` or `"limbs connected"` in prompt blocks or negative quality clauses.
- **Root Cause:** In modern diffusion models (Flow/Midjourney/SDXL), the phrase "limbs connected" ironically triggers limb fusion, extra joint artifacts, and automated body-trauma/violence moderation false-positives.
- **Mandatory Safe Anatomy Clause:** Always use pure positive anatomical phrasing:
  `"anatomically correct hands, precisely 5 slender fingers on each hand, physically connected wrists and forearms, crisp pupil reflections, zero cloning, completely textless artwork"`.

---

## 🏛️ The Master Series Bible Directorial Grounding Law

Every visual prompt and spatial enclosure in `02_Prompt_Matrix.md` must be 100% grounded in `00_Series_Bible_and_Character_DNA/Series_Bible.md`. The Chief Continuity Director must cross-examine every `Spatial Enclosure:` tag, character wardrobe, weapon reference, and lighting coordinate against the Bible's architectural specifications and vault sheets before emitting XML production blocks.

---

## 🔒 The Deterministic 8-Gate Pre-Flight Matrix Linter Gate (`audit:matrix`)

Before declaring a prompt matrix complete or copying XML chunks into Google Flow, the Lead Storyboard Director MUST execute the deterministic CLI linter:

```powershell
cd "C:\Users\MIchaelangelo\Documents\My Brand\02_Ventures & Digital Products\Manhwa Recap Studio\studio"
node scripts/audit-matrix.js <franchiseId> <episodeId>
```

### The 8 Mandatory Checks:
1. **Gate 1: Scene Count & Tag Identity Sync:** 1:1 bit-for-bit match between script `[IMG_XXX]` tags and matrix `<scene id="IMG_XXX">`.
2. **Gate 2: 1:1 Narrative-to-Scene Sync:** Valid, non-empty `<narrative_sync>` clause matching the script for every single scene.
3. **Gate 3: Universal In-Prompt Entity Mirror Mandate:** Every entity in `character_refs` or `item_refs` MUST have an explicit corresponding token (`@{Name}`) in the prompt body.
4. **Gate 4: Dialogue & Sound Hyperbole Insulation:** Zero spoken quotes (`"..."`) or narrator audio hyperbole dumped into visual prompts.
5. **Gate 5: Temporal & Environmental Lighting Guard:** Zero daytime keywords (`broad daylight`, `blue sky`) in night or indoor spatial enclosures.
6. **Gate 6: Safe Anatomy & Anti-Deformation Phrasing:** Zero negative anatomy phrases (`all limbs connected`); pure positive anatomical standards.
7. **Gate 7: Continuity State-Machine Lock:** Recurring character wardrobe and equipped props remain 100% locked across sequential scenes.
8. **Gate 8: Dynamic Format Awareness:** Aspect ratio matches the franchise video format (Vertical 9:16 or Horizontal 16:9).

**Hard Blocker:** Score MUST be 100/100 and Exit Code 0 before dispatch.


---

### 🔒 The Master Series Bible SSOT Law (Style, Vocabulary & Spatial Enclosures)
1. **Dynamic Bible Ingestion:** All Google Flow Master Agent Instructions, Per-Batch Headers, `Spatial Enclosure:` strings, `forbiddenRule` negative drift guards, `crowdRule` staging, and `vocabulary` whitelists MUST be read directly from the `STUDIO_BIBLE_DIRECTIVES` block in `00_Series_Bible_and_Character_DNA/Series_Bible.md`.
2. **Zero Static Fallbacks:** Never hardcode character names (such as `@{Michael Montrey}`) or cross-series vocabulary into Studio views or `franchiseStyleHelper.js`.
