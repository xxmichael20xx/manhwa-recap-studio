# SERIES 06 EPISODE 02: V2.0 RE-ARCHITECTURE, PRODUCTION SPECIFICATION & UPGRADE PATH

**Document ID:** `MRS-S06-EP02-V2-UPGRADE-PATH-REPORT`  
**Franchise:** `Series_06_The_Archmage_Engineer`  
**Episode:** `EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival`  
**Arc:** `Arc I: The Awakening & The Scent of Sanctuary (Feature Cut 2 of 5)`  
**Format:** `16:9 Full-Bleed Landscape (1920x1080)`  
**Scope:** 480 Line-Anchored Scenes | 20 Modular Batches | 23,645 Words  
**Verification:** 100% PASS across `audit-script.js` (v2.0), `audit-matrix.js` (29 Gates, Score 100/100), and `audit-policy.js`  

---

## 1. EXECUTIVE OVERVIEW & ARCHITECTURAL REDO RATIONALE

Episode 02 of *The Archmage Engineer* represents the critical turning point of Arc I where the modern-medieval tech tree advances from primitive survival into precision glassmaking and hydraulic sanitation. In the legacy v1.0 pipeline, Episode 02 suffered from:
1. **Unstaged Scripts:** Missing 7-field staging headers, forcing visual agents to hallucinate character cast, camera elevation, and environmental tech stages.
2. **Elevated Trail Contradictions:** Characters standing on `emerald_valley_forest_trail` looked at distant valley homestead reflections, but prompts described "massive glittering glass windows" on the trail itself, triggering spatial enclosure and forbidden token defects.
3. **Progressive Enclosure Desynchronization:** `miller_sanctuary_farm_exterior` had not been anchored to `ep02_stage2` (which unlocks crystal-clear quartz glass windows whilst strictly barring end-game water-wheels and wind-turbines).
4. **Token Budget Creep:** Multi-character scenes slightly exceeded the 450-token budget due to repeated verbose aspect ratio tokens.

This package provides a 100% re-architected, purely text-based production foundation for Episode 02 under the V2.0 deterministic standard. Zero video compilation and zero TTS audio generation were run, providing clean, pristine markdown and JSON assets ready for Google Flow synthesis.

---

## 2. PRODUCTION DELIVERABLES INCLUDED IN THIS PACKAGE

| File Name | Description & V2.0 Standards Enforced |
| :--- | :--- |
| `01_Episode_Script.md` | Complete 480-scene script with 100% line-anchored V2.0 Staging Headers (`<!-- ZONE \| STAGE \| ACTOR \| CAST \| PROPS \| TECH_STAGE \| PLAN_TALK -->`), zero `@` tokens in spoken audio, and 20 clean modular batch demarcations. |
| `02_Prompt_Matrix.md` | Full 480-scene prompt matrix. All scenes adhere to the 5-Layer Prompt Hierarchy, Google Flow safe tails, `ep02_stage2` tech-stage locks, and Gate G28 elevation perspective invariants. Score: 100/100. |
| `01b_Continuity_State_Machine.md` | Scene-by-scene character wardrobe, injury, equipment, and zone transition state tracker. |
| `03_YouTube_Package.md` | YouTube metadata package, plain chapter timestamps, SEO tags, and multi-shorts extraction scripts. |
| `state_events.jsonl` | Append-only event-sourced ledger tracking item durability, discoveries, and character state changes. |
| `zones.json` | Franchise zone vault schema including `elevation`, `vantage_rule`, `boundary_tags`, `is_private_sanctuary`, and `tech_stages`. |
| `SERIES_06_EP02_V2_UPGRADE_PATH_AND_SPECIFICATION_REPORT.md` | This technical specification document. |

---

## 3. THE V2.0 EPISODE 02 CANONICAL PROGRESSION

### 3.1 Tech Tree & Environmental Lifecycle (`ep02_stage2`)
In Episode 02, the Miller Sanctuary Farm undergoes its first major technological evolution:
- **Baseline Exterior:** Restored stone foundation, white-stone draft chimney, gravity-fed aqueduct channel, and four-layer cylindrical filtration tank (retained from EP01).
- **EP02 Breakthrough:** Installation of **crystal-clear quartz glass window panes** created by smelting pure river quartz sand with botanical flux.
- **Strictly Forbidden End-Game Tech (Gate G27):** Zero brass water-wheels, zero wind-turbines, zero mechanical power transmissions. These remain locked until Arc III (EP11–EP14).

### 3.2 Zone Elevation & Line-of-Sight Matrix (Gate G28)
- `miller_sanctuary_farm_exterior`: `valley_floor_level`. Ground-level camera framing. Distant alpine peaks in background.
- `old_miller_cottage_interior`: `interior_ground_floor`. Warm hearth glow, rough-hewn oak beams, dining table.
- `miller_sanctuary_bath_courtyard`: `valley_floor_level`. Enclosed courtyard with thermal spring basin and flagstones.
- `emerald_valley_forest_trail`: `mountain_ridge_elevated`. Elevated mountain trail. Camera on trail looking down into the valley must frame *distant valley reflections*—never rendering glass windows or buildings on the trail itself.
- `oakhaven_tax_chamber`: `imperial_town_interior`. Dark stone masonry, heavy oak desks, tax ledgers.

---

## 4. DETERMINISTIC VERIFICATION PROOF (CLI OUTPUTS)

### 4.1 Script Integrity Audit (`audit-script.js` v2.0)
```text
==============================================================================
  MANHWA RECAP STUDIO — EPISODIC SCRIPT AUDITOR (v2.0)
==============================================================================
Franchise    : Series_06_The_Archmage_Engineer
Episode      : EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival
Scenes Found : 480 line-anchored [IMG_XXX] tags
Batches      : 20 modular batches (Expected: ~20 at 24 scenes/batch)
Words / Est. : 23645 words (~153 mins @ 155 WPM)
------------------------------------------------------------------------------
[PASS] 100% Script Integrity Verified. Zero Defects Found.
  - Zero @ tokens in spoken audio (Edge-TTS pronunciation insulated).
  - 100% contiguous [IMG_001] to [IMG_480] scene tags with zero sequence gaps.
  - 100% V2.0 Staging Headers present and verified against zones.json.
  - Clean modular batch headers.
==============================================================================
```

### 4.2 29-Gate Pre-Flight Allow-List Linter (`audit-matrix.js` v2.0)
```text
==============================================================================
  MANHWA RECAP STUDIO — UNIVERSAL ALLOW-LIST PRE-FLIGHT LINTER (v2.0)
==============================================================================
Franchise : Series_06_The_Archmage_Engineer
Episode   : EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival
Scenes    : 480 (Script: 480)
Score     : 100/100 (29 Gates Audited)
Manifest  : UNSIGNED (Run compile-matrix.js)
------------------------------------------------------------------------------
01. [PASS] G01: Scene Parity, Contiguity & Order Synchronization
02. [PASS] G02: 1:1 Narrative-to-Scene Clause Equality (<narrative_sync>)
03. [PASS] G03: Universal Entity Token Binding & Kinship Anchor Lock
04. [PASS] G04: Universal Dialogue Quote & Text-Bearing Prop Insulation Guard
05. [PASS] G05: Temporal & Spatial Lighting Mode Consistency
06. [PASS] G06: Safe Anatomy Lexicon & Compiled Tail Integrity
07. [PASS] G07: Character DNA, Registered Outfit & Ledger State Hash Lock
08. [PASS] G08: Franchise Format & Aspect Ratio Lock (16:9)
09. [PASS] G09: Metaphor-to-Literal Translation & Creature Allow-List Guard
10. [PASS] G10: Dynamic Unregistered Entity, Role Noun & Pending Stub Blocker
11. [PASS] G11: Event-Sourced Ledger Replay, Item Lifecycle & Posture Continuity
12. [PASS] G12: Location Vault Canon, Sub-Zone Adjacency & Forbidden Token Gate
13. [PASS] G13: Scene Pacing Cap (<= 8s) & Voice Telemetry Lock
14. [PASS] G14: Prompt Token Budget (<= 450 tokens) & Single-Injection Integrity
15. [PASS] G15: Script-Stage Canon Grounding & Spoken Tag Sanitization
16. [PASS] G16: Scene Schema & Multi-Panel Tier Distribution Gate
17. [PASS] G17: Google Flow Policy & Age-Class Safety Shield
18. [PASS] G19: Mandatory Multi-Scene Location-as-Entity & Reference Card Lock
19. [PASS] G20: Mandatory Physical Reference Plate Disk Integrity (Anti-Half-Baked Invariant)
20. [PASS] G21: Universal Pure Name Standard & Google Flow Reference Model Lock
21. [PASS] G22: Universal Studio Video & Audio Specification Invariant
22. [PASS] G23: Establishing Shot Purity & Zero Phantom Human Pollution
23. [PASS] G24: Concrete Color Standard & Zero Dye Bleed
24. [PASS] G25: Chronological Entrance & Arrival Continuity
25. [PASS] G26: Sanctuary Secrecy & Population Isolation Gate
26. [PASS] G27: Tech-Tree & Environmental Lifecycle Gate
27. [PASS] G28: Vantage & Elevation Perspective Lock
28. [PASS] G29: Spoken Future-Plan & Blueprint Blocker
29. [PASS] D-01: Cryptographic Pre-Flight Manifest Lock
==============================================================================
[APPROVED] All 29 Pre-Flight Gates Passed. Ready for Google Flow.
```

### 4.3 Google Flow Policy & Safety Auditor (`audit-policy.js` v1.0)
```text
==============================================================================
  MANHWA RECAP STUDIO — GOOGLE FLOW POLICY & SAFETY AUDITOR (v1.0)
==============================================================================
Franchise    : Series_06_The_Archmage_Engineer
Episode      : EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival
Total Scenes : 480
Execution    : AUDIT ONLY
------------------------------------------------------------------------------
[PASS] 100% Policy Shield Verified. Zero Google Flow Tripwires Detected.
  - 0 Minor vulnerability / domestic exposure traps.
  - 0 Substring false positives (naked eye, etc.).
  - 0 Chemical / narcotics triggers.
  - 0 Graphic gore / vital strike tokens.
Prompt matrix is 100% safe for continuous Google Flow image generation.
==============================================================================
```

---

## 5. NEXT-STAGE EXECUTION INSTRUCTIONS FOR RECEIVING AGENT

When taking this package into media synthesis:

1. **Edge-TTS Audio Generation:**
   ```powershell
   node studio/scripts/generate-tts.js Series_06_The_Archmage_Engineer EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival en-GB-RyanNeural
   ```
2. **Google Flow Image Synthesis:**
   Ingest `02_Prompt_Matrix.md`. All prompts are verified 100% compliant with Google Flow naming (`@{Entity}`), aspect ratio (`16:9`), and safe anatomy tails.
3. **FFmpeg Video Compilation:**
   Once visual plates are placed in `images/` (`IMG_001.jpg` to `IMG_480.jpg`) and audio is synthesized in `audio/`, compile via:
   ```powershell
   POST /compile-video (batch-by-batch) -> POST /stitch-batches
   ```
