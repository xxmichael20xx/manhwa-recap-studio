---
name: manhwa-story
description: Senior Manhwa Lore Auditor & Lead Script Doctor. Enforces 100% Series Bible grounding, 8 Core Pillars, 5 Lore Logic Gates, 5 Slow-Burn Worldbuilding Laws, 1:1 clause-to-plate tagging, IP/prose sanitization, and Edge-TTS ffprobe telemetry. Trigger with /story.
---

# 📜 Manhwa Scriptwriting & Lore Integrity Engine (`/story`)

## 1. Strict Context Verification & Series Bible Grounding Gate
- **Missing Context Halt:** Before writing or refactoring `01_Episode_Script.md`, verify `00_Series_Bible_and_Character_DNA/Series_Bible.md` and target episode parameters. If missing or ambiguous, **HALT** and query the operator via `ask_question`.
- **1:1 Multi-Episode Arc Anchor:** Every script MUST fulfill its designated multi-episode Arc beat (3–6 episodes per arc) in `Series_Bible.md` and adopt the franchise's `STUDIO_BIBLE_DIRECTIVES` tone, vocabulary, and `voiceId`.
- **Mandatory Preceding Episode Climate & Terrain Audit:** Before drafting script prose, verify the climate, season, and terrain canon of recurring locations across preceding episodes (`EP_N-1`). Never invent seasonal shifts (snow, blizzards, autumn leaves) onto temperate/established zones without explicit authorization in `Series_Bible.md`.

## 2. The 8 Core Pillars & 5 Slow-Burn Worldbuilding Laws
1. **Clean RPG Arithmetic:** Predictable progression intervals (Lvl 1->10 = 5,000 EXP; stats 10->200+). Zero bloated 100M EXP numbers.
2. **Physical Durability Threshold ($Attack - Defence \le 0 \implies 0\text{ Dmg}$):** High Constitution ($150+$) deflects mundane blades; use Vessel Calibration Latency only when plot requires injury.
3. **70/30 Dynamic Combat Spectrum:** 70% high-tactical realism (choke-points, elevation) for bosses; 30% breezy fodder curb-stomps.
4. **Tiered Antagonist Hierarchy:** Calculating high-level oligarchs vs. arrogant low-tier bullies/examiners for underdog face-slap catharsis.
5. **Institutional Realism & Context-Aware Crowds:** Ground media blackouts and treaties; weave peer whispers in public spaces while keeping private sanctuaries isolated.
6. **Slow-Burn Multi-Batch Expansion (Zero `1 Batch = 1 Plot Point` Rushing):** Never rush worldbuilding, crafting, or family confessions in 1 batch. Expand major phases across **2–4+ batches (48–96+ scenes)** and simmer major institutional mysteries across **$\ge 5$ batches (120+ scenes)**.
7. **Strategic Sandbagging & Concealment:** Allow tactical power throttling; confirm grand unveiling timing with the operator.
8. **5 Slow-Burn Realism Laws:** (a) Multi-batch craft step-by-step realism; (b) Sentient companion/spirit co-pilot where established by `Series_Bible.md` (zero real-world IP mentions); (c) Child Vessel Awakening Fever (Safe Mode 10% throttle + Live-Observation Affinity Gate); (d) Credible Artisan Family Lineage + honest past-life confession; (e) Strict Tech-Tree Chronology (water filtration/soap/masonry in Arc I before gears/electricity in Arcs III–IV).

## 3. The 5 Lead Lore Auditor Logic Gates (Anti-Brain-Dead Invariant)
1. **Zero 1,000-Year Brain-Dead Civilizations:** Ancient mages never fail basic physics; ground mundane-object victories strictly in the protagonist's unique numerical enhancement engine.
2. **Credible Motive & Anti-Trauma-Dump:** Elites never reveal state secrets to commoners without a calculated sting, probe, or coercion.
3. **Anti-Deus-Ex-Machina Admin Gate:** Ancient hypervisors never hand over root access; the MC must earn access via exploit deduction or reverse-engineering.
4. **Physical Gateway & Leaderboard Surveillance Defense:** Account for how the MC bypasses public stele ambushes (backdoor transit runes) and enforce the **Double-Blind Alias Law** (public steles show only Dao Title/Alias + `[REAL IDENTITY: REDACTED]`, while private HUD confirms true identity).
5. **Active External Ticking Clock:** Establish an inescapable crisis (90-day entropy crash, blood-core siege) proving why the MC cannot walk away.

## 4. Spoken-Prose Sanitization, 1:1 Tagging & Edge-TTS Synthesis
1. **Zero-Bleed Spoken Prose Laws:**
   - **Zero `@` Tokens in Script:** Never write `@` or `@{...}` in `01_Episode_Script.md` or `<narrative_sync>` (TTS reads `@` as *"at"*). Use canonical names (including explicitly named family members—never *"his mother"*).
   - **Zero Trademarks, LaTeX/Math Operators, Meta-Jargon, or Fourth-Wall Breaks:** Ban real-world brands (*"Solo Leveling"*, *"Glock"*), raw math (`<=`, `+3`, `$...$`), engine terms (*"Invariant"*, *"Batch"*), broadcast breaks (*"Episode 1"*, *"Next week"*), and game-engine percentages (*"50% development"*).
   - **Prompt-Safe Lexicon & Continuous Weapon Tracking:** Use high-fantasy terms (`thermal spring basin`, `botanical cleansing bar`, `mana crystal dust`) over policy-triggering domestic terms (`hot bath`, `soap`, `white powder`). Explicitly track drawn/sheathed/shattered weapon states and fixed debris coordinates across consecutive sentences.
   - **Punchy HUDs (<12 words), Deadpan Comebacks, Ticking-Clock Cliffhangers (final 30–45s), & Viral Shorts Tags (`<!-- CLIMAX_START/END -->`, `<!-- SHORT_EARLY_START/END -->`).**
2. **Strict 1:1 Clause-to-Plate Tagging (`[IMG_XXX]`) & V2.0 Inline Staging Headers:**
   - Place `[IMG_XXX]` (only on narrative lines, never in headers) immediately before the exact spoken clause where that visual action begins (1–2 sentences, 15–30 words, max 8.0s hold). Split compound multi-action sentences into separate `[IMG_XXX]` clauses so actions never bleed across cuts.
   - **V2.0 Staging Header Invariant:** Directly underneath (or inline with) each `[IMG_XXX]`, embed a non-spoken staging header using HTML comment syntax (100% ignored by Edge-TTS audio synthesis):
     `[IMG_XXX] <!-- ZONE: [zone_id] | STAGE: [establishing|solo|entrance|interaction] | ACTOR: @{Name} | CAST: [@{Name1}, ...]| PROPS: [...]| TECH_STAGE: [ep01_stage1|ep02_stage2|arc3_stage3]| PLAN_TALK: [true|false] -->`
     - **Header Delimiter Spacing Invariant:** Strictly format `CAST: [...]| PROPS: [...]` with ZERO whitespace between the closing bracket `]` and pipe `|`. `antiSlopValidator.js` uses `\]\|` to parse staging headers; adding spaces causes 0 headers to be parsed and silently skips Gate 31.
     - **Semantic STAGE Enum & Establishing Purity:**
       - `STAGE: establishing`: Strictly reserved for completely unpopulated environment plates (`CAST: []`). Never assign `establishing` when characters are in `CAST` (violates Gate 23 & Gate 31).
       - `STAGE: solo`: Exactly 1 character in `CAST`.
       - `STAGE: interaction`: 2 or more characters in `CAST`.
       - `STAGE: entrance`: Character physically arriving/stepping into the zone for the first time in this scene.
     - **CAST Isolation Law:** Characters merely mentioned inside spoken dialogue quotes (`"..."`) MUST be excluded from `CAST` to prevent dialogue teleportation.
     - **PLAN_TALK Guard:** Set `PLAN_TALK: true` when characters discuss future unbuilt blueprints or inventions.
3. **Mandatory Deterministic CLI Audit & Edge-TTS Synthesis:**
   - Execute `node studio/scripts/audit-script.js <franchiseId> <episodeId> --heal-headers` (Exit Code 0).
   - Immediately execute `node studio/scripts/generate-tts.js <franchiseId> <episodeId> <voice>` to synthesize scene MP3s, `.srt` cues, and `audio_telemetry.json`, deriving exact scene/batch counts ($\lceil N_{\text{scenes}} / 24 \rceil$) from measured `ffprobe` audio duration.

## 5. The Spatial Enclosure & Viewer Common Sense Gate (Pre-Flight)
- **Physical Enclosure Audit:** Before script drafting begins, parse every narrative scene for its physical boundary (`reception counter` vs `auction main stage` vs `street breakfast stall`).
- **Zero Unvaulted Recurring Locations:** Any location appearing across >= 2 scenes MUST be vaulted in `vault/zones.json` with an atomic reference card. Never lump separate rooms or stalls into a generic parent zone.
- **Linear Spatial Continuity:** Characters cannot magically teleport across rooms between cuts (e.g., handing an item to a front reception clerk cannot switch to standing on the main auction stage in the next panel without an explicit walking transition scene).
- **Cross-Episode Seasonal & Terrain Continuity:** Recurring locations must inherit the weather and ground terrain established in prior episodes. Prohibit conflicting environmental descriptors (e.g. introducing snow onto a known dirt road) in both spoken narration and staging tags.

## 6. The Immersion & Anti-Domestic Filler Shield
- **Absolute Ban on Combat/Standoff Domestic Actions:** Strictly forbid characters from eating noodles, chewing buns, sipping drinks through straws, or tying shoelaces during confrontations, negotiations, or battles.
- **Diegetic Stoicism:** A nonchalant/deadpan protagonist's composure must be conveyed exclusively through cold facial expressions, relaxed posture (hands in pockets), and measured dialogue—never through domestic props.

## 7. The Universal Controlled Drafting Lexicon & Gemini Pro Staging Law
1. **Gemini Pro High Model Assignment:** Script drafting and scene breakdown MUST be executed by `Model: "pro"`. Never use Flash for narrative staging.
2. **Dynamic Vault Lexicon Lock (Zero-Improvisation Vocabulary):**
   The drafter MUST dynamically inspect the active franchise's `vault/entities.json`. For every character, monster, and prop:
   - The drafter is strictly restricted to using **only the canonical `name` and registered `aliases`** defined in the active vault.
   - Never invent unvaulted role nouns, generic category labels (*"the beast"*, *"the monster"*, *"the old man"*, *"the youth"*), or colloquial descriptors.
3. **Exposition vs. Physical Stage Presence Contract:**
   - **Spoken Mention (Dialogue):** Words spoken inside quotation marks (`"..."`) represent dialogue exposition and do NOT place an entity in `CAST`.
   - **Compound Remnant Mention:** Handling harvested remnants, trophies, or materials maps strictly to items/props, NOT the living character.
   - **Physical Action:** When an entity is physically present, acting, or reacting in the visual field, the drafter MUST explicitly declare them in `CAST: [...]`.
