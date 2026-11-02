---
name: manhwa-launch
description: YouTube & TikTok/Shorts release packaging hub. Enforces YouTube_Locked_Package.md SSOT, accumulative (Episode 1-N) title cadence (<=100 chars), plain episode timestamps, and Multi-Shorts extraction kits. Trigger with /launch.
---

# 🚀 Manhwa YouTube & Shorts Release Packaging Hub (`/launch`)

## 1. Strict Context Verification & Zero Studio Code Mutation Gate
- **Missing Context Halt:** Confirm target franchise and upload number (`Episode 1` standalone vs. `Episode 1-N` compilation) via `ask_question` if unspecified. Verify compiled master MP4s exist on disk before naming any episode in a compilation.
- **Zero Code Mutation Law:** Never edit `packagingService.js`, `fileService.js`, or Vue files when updating launch packages. Write strictly to `00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md` and `EPXX/03_YouTube_Package.md`.

## 2. Two-Mode Locked Title & Description State Machine (`YouTube_Locked_Package.md`)
1. **MODE A — First Run (`YouTube_Locked_Package.md` Does Not Exist / EP01):**
   - Present strictly **3 High-CTR Title Options** formatted as `(Episode 1) {Base Title}` (base title $\le 84$ chars so `(Episode 1-12)` stays $\le 100$ chars) via `ask_question`.
   - Upon selection, lock the winning title, the Episode 1 SEO description (**with ZERO chapter timestamps**, only `Full Runtime` & `Episode Bounds`), evergreen subscribe CTA, and 3 thumbnail concepts into `YouTube_Locked_Package.md` and `EP01/03_YouTube_Package.md`.
2. **MODE B — Subsequent Accumulative Runs (`YouTube_Locked_Package.md` Exists / EP02+):**
   - **Zero Regeneration Law:** Never propose new titles or rewrite the synopsis, community question, or hashtags. Run `studio/scripts/update-launchpad.js` to update ONLY the 3 dynamic slots:
     - **Slot 1 (`{{EPISODE_RANGE}}`):** Update prefix `(Episode 1)` -> `(Episode 1-2)` -> `(Episode 1-N)` (strictly $\le 100$ chars total).
     - **Slot 2 (`{{RUNTIME_BLOCK}}`):** Exact `ffprobe` duration from `omnibus_metadata.json`.
     - **Slot 3 (`{{TIMESTAMPS_BLOCK}}`):** Insert `⏱️ CHAPTER TIMESTAMPS:` with **strictly 1 plain line per compiled episode** (`00:00 - Episode 01: Title (21m 46s)`, `21:46 - Episode 02: Title (36m 20s)`, `58:05 - Series Finale & Epilogue`). Strictly NO acts, NO batch numbers, NO sub-chapters.
   - Diff output against `YouTube_Locked_Package.md` to confirm zero drift outside the 3 dynamic slots.

## 3. TikTok & YouTube Shorts Multi-Shorts Kit (`03_YouTube_Package.md`)
Include in Section 6 of `03_YouTube_Package.md`:
- **Titles:** Strictly `< 100 characters` (target 65–85 chars, max 92 chars + emoji).
- **Slice Bounds:** `Short 01` (`<!-- CLIMAX_START -->` to `<!-- CLIMAX_END -->`, ~45–56s + 3s outro $\le 59$s) and `Short 02` (`<!-- SHORT_EARLY_START -->` to `<!-- SHORT_EARLY_END -->`, ~45–55s).
- **Continuous Binge Copy:** On-screen text overlays, captions, and pinned bio comments using continuous story phrasing (zero fixed minute counts).
