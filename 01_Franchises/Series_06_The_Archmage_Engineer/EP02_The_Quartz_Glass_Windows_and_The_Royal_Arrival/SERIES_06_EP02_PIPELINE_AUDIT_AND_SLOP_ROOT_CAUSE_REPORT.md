# 🔍 SERIES 06 EPISODE 02: PIPELINE AUDIT & AI SLOP ROOT-CAUSE REPORT

**Document ID:** `MRS-S06-EP02-SLOP-AUDIT-REPORT`  
**Franchise:** `Series_06_The_Archmage_Engineer`  
**Episode:** `EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival`  
**Timestamp:** `2026-10-31T19:05:00+08:00`  
**Format:** `16:9 Full-Bleed Landscape (1920x1080)`  
**Scope:** 480 Line-Anchored Scenes | 20 Batches | Master Video Compilation & Matrix Authoring  

---

## 1. EXECUTIVE SUMMARY & BRUTAL AUDIT FINDINGS

This forensic report investigates the multi-layer failure that occurred in **Series 06 Episode 02**, specifically in **Batch 03 (Scenes IMG_049 – IMG_072)**, where:
1. **The Audio Desync:** When playing the Batch 3 preview video, the audio narration was describing Garrett on a limestone cliff pulsing earth mana (`IMG_039` from Batch 2), completely disconnected from the visuals.
2. **The Visual Slop & Narrative Contradiction:** When the narrative described the physical impossibility of carrying heavy limestone boulders by hand and Maya jogging down the hill with wooden sledges (`IMG_053`), the video showed the characters carrying stones by hand at an already-finished brick wall.
3. **The False 100/100 Certification:** The automated linters (`audit-script.js`, `audit-matrix.js`, `audit-policy.js`) scored the episode **100/100 PASS**, leading the operator to believe all defects were resolved.

**Core Diagnostic Verdict:**  
The failure was caused by a combination of:
1. A regex full-name matching bug and sticky-state carryover in `audit-script.js`.
2. A 1-line hardcoded copy-paste action template in `generate-calibrated-series06-matrix.js`.
3. An unstripped HTML comment bug in `videoService.js` that shifted the entire audio timeline backwards by 94 seconds.
4. A complete architectural blind spot in `audit-matrix.js` and `antiSlopValidator.js`, which validated syntax, token counts, and entity schemas, but had **zero gates checking whether visual action prompts corresponded to the narrative text**.

---

## 2. DEFECT 1: THE AUDIO TIMELINE DESYNC (Why "Garrett on a Cliff" Played in Batch 3)

### The Mechanism
In `studio/server/services/videoService.js`, the method `parseDynamicTimeline` tokenises script clauses and correlates them with SRT subtitle cues.
In legacy scripts, scene tags were immediately followed by spoken text: `[IMG_001] The morning sun broke...`.
When the V2.0 upgrade added 7-field HTML staging headers directly after each scene tag:
`[IMG_001] <!-- ZONE: ... | STAGE: ... | ACTOR: ... --> The morning sun broke...`

`videoService.js` (lines 359–367) stripped Markdown formatting, but **did not strip HTML comments (`<!-- ... -->`)**:
```javascript
// studio/server/services/videoService.js (Legacy Line 359)
let cleanText = rawBlock
  .replace(/^#{1,6}\s+[^\n]+/gm, '')
  .replace(/^>\s+[^\n]+/gm, '')
  .replace(/\*\*Runtime:\*\*.*$/gm, '')
  .replace(/\*\*Word Count:\*\*.*$/gm, '')
  .replace(/\*\*Visual Plates:\*\*.*$/gm, '')
  .replace(/---+/g, '')
  .replace(/`/g, '')
  .trim()
// BUG: <!-- ... --> was NOT stripped!
```

### The Cascading Consequence
Because `<!-- ... -->` was not stripped, the first words parsed for every scene were:
`"zone miller sanctuary bath courtyard stage solo actor ace miller..."`
- In `01_Episode_Subtitles.srt`, Cue #2 happened to be: `"bathing the Miller Sanctuary Farm in soft,"` at timestamp **`4.488s`**.
- Because `IMG_007`'s staging header contained `"miller sanctuary"`, `videoService.js` matched `IMG_007` to `4.488s`.
- `IMG_001` was anchored to `0.000s`.
- The timestamp interpolator divided those 4.488 seconds across scenes `IMG_001` to `IMG_006`, giving each scene **~0.748 seconds (22 frames)**.
- This compressed the first 6 scenes into 4.5 seconds, while the spoken narration actually took ~80 seconds!
- This 75-second loss shifted all subsequent batch audio slices backwards.
- When Batch 3 (`IMG_049`–`IMG_072`) was compiled, `batchStartTime` was calculated as **`386.31s`** instead of the true **`480.23s`** (a **93.92-second backward shift**).
- At timestamp `386.50s` in the master audio, the narration is:
  `"Garrett closed his eyes, taking a deep breath and letting the earth mana in his chest hum... sheared away from the cliff face without a single jagged splinter."` (Scene `IMG_039` in Batch 2).
- Thus, the compiled Batch 3 video played the audio from the cliff quarrying scene over Batch 3 visuals.

---

## 3. DEFECT 2: THE VISUAL SLOP & CONTRADICTION (Carrying Stones by Hand at a Finished Wall)

### The Mechanism
In `studio/scripts/generate-calibrated-series06-matrix.js`, the author created a quick generation script for Series 06 EP02.
In lines 351–354, instead of writing 24 bespoke, progressive action beats matching the story, the author wrote a single hardcoded ternary:
```javascript
// studio/scripts/generate-calibrated-series06-matrix.js (Lines 351–354)
// Batch 03 (49-72): Assembling cottage extension
if (sceneNum >= 49 && sceneNum <= 72) {
  return `at the homestead building site, ${pairToken} aligning precision interlocking tongue-and-groove white stone blocks`;
}
```

### The Narrative vs Visual Contradiction
This single line was stamped across all 24 scenes of Batch 3 in `02_Prompt_Matrix.md`. As a result:

| Scene | What the Script Narrates | What the Prompt Matrix Instructed the AI to Generate |
| :--- | :--- | :--- |
| **IMG_049** | Practical challenge: moving tons of stone from river to cottage. | At homestead building site, aligning precision white stone blocks. |
| **IMG_050** | Narrative contrast: in medieval cities, six oxen churn roads into mud. | At homestead building site, aligning precision white stone blocks. |
| **IMG_051** | Ace refusing to tear up the fragrant lavender meadow with wagons. | At homestead building site, aligning precision white stone blocks. |
| **IMG_052** | Ace shouting to Maya in the farmyard to bring wooden skids. | At homestead building site, aligning precision white stone blocks. |
| **IMG_053** | **Maya jogging down the hill dragging two oak timber sledges.** | **At homestead building site, Maya aligning precision white stone blocks.** |
| **IMG_054** | Maya hands on hips: *"Even Dad can't pull a sledge with ten boulders!"* | At homestead building site, Maya aligning precision white stone blocks. |
| **IMG_055** | Ace pulling out hemp rope and carved birch pulleys. | At homestead building site, Ace aligning precision white stone blocks. |
| **IMG_056** | Ace anchoring main pulley to a deep-rooted pine tree at hill crest. | At homestead building site, Ace aligning precision white stone blocks. |
| **IMG_057** | Ace handing trailing rope to Maya, explaining wind mana vortex. | At homestead building site, Ace aligning precision white stone blocks. |
| **IMG_060** | The loaded wooden sledge gliding effortlessly up the green grass. | At homestead building site, Maya aligning precision white stone blocks. |
| **IMG_064** | Clara bringing a wooden tray with water jugs and sliced apples. | At homestead building site, Clara aligning precision white stone blocks. |
| **IMG_066** | Setting the very first foundation block in the gravel trench. | At homestead building site, aligning precision white stone blocks. |

**The AI Slop Failure:** The generated images depicted characters holding heavy blocks by hand at an already-constructed wall with dozens of bricks already laid, directly contradicting the dialogue which states that the stones haven't even been hauled up the hill yet.

---

## 4. DEFECT 3: PHANTOM CHARACTER "CLARA MILLER" STAGING HEADER POISONING

### The Mechanism
In `studio/scripts/audit-script.js`, lines 210–228:
```javascript
// studio/scripts/audit-script.js (Line 214)
const reg = new RegExp(`\\b${cName}\\b`, 'i')
```
Where `cName` is taken from `character_vault/characters.json`:
- `"Ace Miller"`
- `"Garrett Miller"`
- `"Maya Miller"`
- `"Clara Miller"`

The regex looked for the **full name including surname** (`\bMaya Miller\b`, `\bAce Miller\b`).
However, in `01_Episode_Script.md`, natural dialogue tags only use first names:
- *"Maya came jogging down the hill..."* (`"Maya"`)
- *"Ace grinned..."* (`"Ace"`)
- *"Garrett chuckled..."* (`"Garrett"`)
None of these matched the regex!

However, in Scene 15:
`[IMG_015] Clara Miller walked in from the adjoining bedroom, tying her apron...`
The narrative included the full name `"Clara Miller"`.
So `detectedCast` matched `@{Clara Miller}`.

### The Sticky State Poisoning
Lines 230–235 in `audit-script.js`:
```javascript
let finalCast = [...detectedCast]
if (finalCast.length === 0) {
  finalCast = activeCast.length > 0 ? [...activeCast] : ['@{Ace Miller}']
} else {
  activeCast = [...finalCast]
}
```
Because subsequent scenes (`IMG_016` to `IMG_072`) only used first names, `detectedCast` was empty for every single scene.
`finalCast` fell back to `activeCast`, which was stuck on `@{Clara Miller}`!
As a result, `audit-script.js --heal-headers` stamped:
`<!-- ZONE: old_miller_cottage_interior | STAGE: solo | ACTOR: @{Clara Miller} | CAST: [@{Clara Miller}] -->`
onto all 24 scenes of Batch 3, even though Clara was not in those scenes.

---

## 5. DEFECT 4: THE 29-GATE LINTER BLIND SPOT (Why it Scored 100/100)

When `node studio/scripts/audit-matrix.js Series_06_The_Archmage_Engineer EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival` was executed:
- **Gate G01 (Parity):** 480 scenes in script vs 480 scenes in matrix → **PASS**
- **Gate G02 (Narrative Equality):** `<narrative_sync>` string matches script clause → **PASS**
- **Gate G03 (Entity Binding):** Tokens are formatted as `@{Name}` and exist in vault → **PASS**
- **Gate G07 (DNA Lock):** Character DNA strings match `characters.json` → **PASS**
- **Gate G14 (Token Budget):** Prompts are <= 450 tokens → **PASS**
- **Gate G16 (Tier Ratio):** Tier B/C is ~70%, Tier A is ~30% → **PASS**
- **Gate G27 (Lifecycle):** Windows don't appear in forbidden early scenes → **PASS**

**Crucial Finding:**  
Not a single gate in `antiSlopValidator.js` or `audit-matrix.js` tested:
1. **Semantic Progression:** Does the action described in `<prompt>` reflect the action described in `<narrative_sync>`?
2. **Visual Novelty / Anti-Duplication:** Does the visual action string repeat verbatim more than twice in a batch?
3. **Actor Coherence:** Does the prompt action feature the actors mentioned in the narrative clause?

Because these semantic gates were missing, a completely broken, copy-pasted matrix passed with a **100/100 Perfect Score**.

---

## 6. INVENTORY OF ALL AFFECTED FILES

| File Path | Nature | Problem |
| :--- | :--- | :--- |
| `studio/scripts/generate-calibrated-series06-matrix.js` | JS Script | Lines 351–354: Hardcoded 1-line copy-paste template for Batch 3. |
| `studio/scripts/audit-script.js` | JS Script | Lines 210–235: Regex requires full surnames; sticky `activeCast` locks onto Clara Miller. |
| `studio/server/services/videoService.js` | JS Service | Line 359: Missing `<!-- ... -->` stripping in `parseDynamicTimeline` (fixed in previous turn). |
| `studio/server/services/antiSlopValidator.js` | JS Service | Missing Gate 30 (`G30_visual_action_novelty`) to block copy-pasted action strings. |
| `01_Franchises/Series_06_The_Archmage_Engineer/character_vault/characters.json` | JSON Vault | Missing single-word `aliases` for characters (`"Ace"`, `"Maya"`, `"Garrett"`, `"Clara"`). |
| `01_Franchises/Series_06_The_Archmage_Engineer/EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival/01_Episode_Script.md` | MD Script | All 24 scenes in Batch 3 stamped with `ACTOR: @{Clara Miller}`. |
| `01_Franchises/Series_06_The_Archmage_Engineer/EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival/02_Prompt_Matrix.md` | MD Matrix | All 24 scenes in Batch 3 have identical brick-laying action prompt. |
| `01_Franchises/Series_06_The_Archmage_Engineer/EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival/SERIES_06_EP02_V2_UPGRADE_PATH_AND_SPECIFICATION_REPORT.md` | MD Report | Falsely claimed 100/100 verification based on purely syntactic gate checks. |

---

## 7. THE CANONICAL SPECIFICATION & FIX RECIPE

### Step 1: Vault Aliases Update (`characters.json`)
Add first-name aliases to `characters.json`:
```json
{
  "name": "Ace Miller",
  "token": "@{Ace Miller}",
  "aliases": ["Ace", "Cale", "boy"],
  "kinship_terms": ["son", "brother"]
},
{
  "name": "Maya Miller",
  "token": "@{Maya Miller}",
  "aliases": ["Maya", "sister"],
  "kinship_terms": ["sister", "daughter"]
},
{
  "name": "Garrett Miller",
  "token": "@{Garrett Miller}",
  "aliases": ["Garrett", "Dad", "father"],
  "kinship_terms": ["father", "husband"]
},
{
  "name": "Clara Miller",
  "token": "@{Clara Miller}",
  "aliases": ["Clara", "Mom", "mother"],
  "kinship_terms": ["mother", "wife"]
}
```

### Step 2: Script Auditor Fix (`audit-script.js`)
Update `audit-script.js` so:
1. It matches first names (`cName.split(' ')[0]`) as well as full names.
2. It checks dialogue speaker attribution (e.g. `"Maya!" Ace called`, `"What's the plan?" Maya asked`).
3. It does not carry over stale `activeCast` across scene boundaries when characters leave the scene.

### Step 3: Script Staging Header Re-Healing (`01_Episode_Script.md`)
Re-heal Batch 3 (`IMG_049`–`IMG_072`) with correct cast and zones:
- `IMG_049`–`IMG_051`: `ZONE: emerald_valley_forest_trail | ACTOR: @{Ace Miller} | CAST: [@{Ace Miller}, @{Garrett Miller}]`
- `IMG_052`–`IMG_054`: `ZONE: miller_sanctuary_farm_exterior | ACTOR: @{Maya Miller} | CAST: [@{Maya Miller}, @{Ace Miller}]`
- `IMG_055`–`IMG_056`: `ZONE: emerald_valley_forest_trail | ACTOR: @{Ace Miller} | CAST: [@{Ace Miller}]`
- `IMG_057`–`IMG_061`: `ZONE: emerald_valley_forest_trail | ACTOR: @{Maya Miller} | CAST: [@{Maya Miller}, @{Ace Miller}]`
- `IMG_062`: `ZONE: emerald_valley_forest_trail | ACTOR: @{Garrett Miller} | CAST: [@{Garrett Miller}, @{Ace Miller}]`
- `IMG_063`: `ZONE: miller_sanctuary_farm_exterior | ACTOR: @{Ace Miller} | CAST: [@{Ace Miller}, @{Garrett Miller}]`
- `IMG_064`: `ZONE: miller_sanctuary_farm_exterior | ACTOR: @{Clara Miller} | CAST: [@{Clara Miller}]`
- `IMG_065`–`IMG_072`: `ZONE: miller_sanctuary_farm_exterior | ACTOR: @{Garrett Miller} | CAST: [@{Ace Miller}, @{Garrett Miller}]`

### Step 4: True 24-Scene Progressive Visual Action Layer (`02_Prompt_Matrix.md`)
Re-author `IMG_049` to `IMG_072` with 24 distinct chronological actions:
1. `IMG_049`: Standing at riverbank inspecting massive limestone slabs awaiting transport.
2. `IMG_050`: Narrative contrast: muddy medieval road with ox-drawn cart struggling in knee-deep mud.
3. `IMG_051`: Ace standing in sunlit lavender meadow looking up the hillside, planning route.
4. `IMG_052`: Ace shouting up toward the farmyard with cupped hands and waving his arm.
5. `IMG_053`: Maya jogging down the grassy hill dragging two oak timber sledges with polished runners.
6. `IMG_054`: Maya with hands on hips, staring in disbelief at the giant stone boulders.
7. `IMG_055`: Ace pulling coiled hemp rope and carved birch pulleys from his craftsman belt pouch.
8. `IMG_056`: Ace securing the master birch pulley to a deep-rooted mountain pine tree trunk at hill crest.
9. `IMG_057`: Ace demonstrating wind mana mechanics, handing the trailing rope end to Maya.
10. `IMG_058`: Maya smiling confidently, eyes glowing amber as she prepares to channel wind affinity.
11. `IMG_059`: Maya channeling wind magic into the rope, forming a gentle swirling air vortex.
12. `IMG_060`: The loaded timber sledge gliding smoothly up the green grass like a swan on water.
13. `IMG_061`: Maya cheering with joy, holding the rope with effortless ease.
14. `IMG_062`: Garrett and Ace smiling as they walk behind the sledge, guiding the wooden runners.
15. `IMG_063`: The neat staging area beside the eastern cottage wall with limestone blocks neatly stacked.
16. `IMG_064`: Clara stepping outside carrying a wooden tray with earthen water jugs and sliced apples.
17. `IMG_065`: Ace kneeling by the gravel trench holding a taut chalk alignment line.
18. `IMG_066`: Garrett kneeling to set the first heavy white limestone block into the gravel bed.
19. `IMG_067`: Close-up of the carved stone groove settling over the gravel foundation with a solid thud.
20. `IMG_068`: Garrett sliding the protruding tongue of the first block into the groove of the second block.
21. `IMG_069`: Macro detail of the zero-gap airtight interlocking seam between the white stones.
22. `IMG_070`: Alternating courses of white masonry rising layer by layer around the eastern wing.
23. `IMG_071`: The completed 10-foot gleaming white-stone extension wing standing proudly against the old cottage.
24. `IMG_072`: Garrett stepping back with hands on hips, gazing at the fortress-like stone walls with proud tears.

### Step 5: Implementation of Gate 30 (`G30_visual_action_novelty`)
Add Gate 30 to `antiSlopValidator.js`:
- Extract `<action_layer>` or core action predicate from every scene.
- If any action string repeats verbatim $>2$ times across any 24-scene batch, **FAIL with Exit Code 1**.
- This makes copy-pasted action templates physically impossible to pass through the linter ever again.

---

**Report Prepared By:** Lead Systems Architect & Anti-Slop Auditor  
**Distribution:** `Downloads/` & Episode Archive Package
