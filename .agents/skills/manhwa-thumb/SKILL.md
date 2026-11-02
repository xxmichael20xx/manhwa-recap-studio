---
name: manhwa-thumb
description: High-CTR 16:9 YouTube thumbnail and badge engine. Enforces 3 Master visual archetypes bound to character_vault reference plates, top-left #FFD700 badge, MozJPEG <2MB compliance, and locked Ep 1 thumbnail mirroring for accumulative uploads. Trigger with /thumb.
---

# 🖼️ Manhwa High-CTR Visual Thumbnails & Badges (`/thumb`)

## 1. Strict Context Verification & Accumulative Cadence Gate
- **Missing Context Halt:** Confirm target franchise, episode/compilation target, and mode via `ask_question` if unspecified.
- **Locked Accumulative Thumbnail Invariant (EP02+):** Under accumulative upload cadence (`(Episode 1-2)`, `(Episode 1-3)`), the Master Thumbnail is **PERMANENTLY LOCKED** to `EP01/01_Thumbnail_Master.jpg`. For `EP02+`, **DO NOT invoke `image-generator`** unless explicitly commanded; deterministically mirror `EP01/01_Thumbnail_Master.jpg` into the new episode folder and update only the dynamic top-left badge (`1 - 2`, `1 - 3`).

## 2. Episode 1 Master Thumbnail Generation (3 Mandatory 16:9 Archetypes)
When generating thumbnails for Episode 1 (or upon explicit override):
1. **Mandatory Vault Reference Plate Binding:** Never use generic text face descriptions. Pass `ImagePaths` pointing directly to `character_vault/` plates for the Protagonist, Antagonist, and Boss.
2. **The 3 Visual Storytelling Variants (`1920x1080`, `<2MB` MozJPEG, 100% Textless Base Artwork):**
   - **Variant A (`01_Thumbnail_Concept_A.jpg` — Split Transformation):** Left 45% humble underdog in shadows vs. Right 55% awakened Sovereign with signature mana runes and shattered relic.
   - **Variant B (`01_Thumbnail_Concept_B.jpg` — Proctor/Scion Panic):** Foreground low-angle close-up on horrified antagonist/examiner in cold sweat as testing crystal/weapon shatters; background unbothered protagonist.
   - **Variant C (`01_Thumbnail_Concept_C.jpg` — Solo Cleave Spectacle):** Wide panoramic clash of protagonist unleashing signature technique against colossal boss/monolith.
3. **Top-Left High-CTR Yellow Badge (`#FFD700` on `#0F172A` pill, `font-weight: 900`, `x:60, y:60`):** Base JPGs remain 100% textless on disk (zero small tags or cluttered pills); the Studio HTML5 Canvas dynamically composites `PART 1` or `1 - N` at top-left on export.
