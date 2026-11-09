---
name: manhwa-launch
description: YouTube & TikTok/Shorts release packaging hub. Enforces YouTube_Locked_Package.md SSOT, accumulative (Episode 1-N) title cadence (<=100 chars), plain episode timestamps, and Multi-Shorts extraction kits. Trigger with /launch.
---

# 🚀 Manhwa YouTube & Shorts Release Packaging Hub (`/launch`)

## 1. Strict Context Verification & Zero Studio Code Mutation Gate
- **Missing Context Halt:** Confirm target franchise and upload number (`Episode 1` standalone vs. `Episode 1-N` compilation) via `ask_question` if unspecified. Verify compiled master MP4s exist on disk before naming any episode in a compilation.
- **Zero Code Mutation Law:** Never edit `packagingService.js`, `fileService.js`, or Vue files when updating launch packages. Write strictly to `00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md` and `EPXX/03_YouTube_Package.md`.

## 1.1 Atomic Operator Selection Lock Gate
- **Deterministic Selection Lock:** Immediately after the operator selects a Title and Thumbnail via `ask_question`, the agent MUST run:
  `node studio/scripts/lock-launch.js <franchiseId> --title "<Selected Title>" --thumb "<Image File>" --concept "<A|B|C>"`
- **Live Ingestion Gate:** The agent MUST verify `lock-launch.js` exits with Code 0. This ensures the Master Series Bible (`00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md`), episodic packages, and disk thumbnail files are atomically synchronised and verified against the live Studio API.

## 2. Release Cadence Architecture Governance
1. **Series 07+ Standard (Discrete Act / Part Model — Option 1):**
   - **Upload Cadence:** Each upload compiles a complete Act ($\ge 60$ mins). Standalone sub-50-minute uploads are strictly prohibited.
     - Act 1: Title prefix `(Part 1)` | Badge `PART 1`
     - Act 2: Title prefix `(Part 2)` | Badge `PART 2`
     - Act 3: Title prefix `(Part 3)` | Badge `PART 3`
     - Full Marathon: Title prefix `(Complete)` | Badge `COMPLETE`
   - **Description Invariant:** Must explicitly state the episodic span where it ends (e.g. `🎬 Release: Part 1 — Act 1 Feature (Covers Episodes 01 - 03)`).
2. **Series 01–06 Standard (Legacy Accumulative Stacking — Option 2):**
   - Strictly preserve the original accumulative model: `(Episode 1)` -> `(Episode 1-2)` -> `(Episode 1-N)` with badge `1 - N` and plain episode timestamps.

## 3. Two-Mode Locked Title & Description State Machine (`YouTube_Locked_Package.md`)
1. **MODE A — First Run (`YouTube_Locked_Package.md` Does Not Exist / EP01):**
   - Present strictly **3 High-CTR Title Options** formatted with canonical prefix (`(Part 1)` for Series 07+; `(Episode 1)` for Series 01-06; base title $\le 84$ chars) via `ask_question`.
   - Upon selection, lock the winning title, SEO description, evergreen subscribe CTA, and thumbnail concept into `YouTube_Locked_Package.md` and `EP01/03_YouTube_Package.md`.
2. **MODE B — Subsequent Runs (`YouTube_Locked_Package.md` Exists / EP02+):**
   - **Zero Regeneration Law:** Never propose new titles or rewrite the synopsis, community question, or hashtags. Update ONLY the dynamic slots (Part/Episode prefix, runtime block from `omnibus_metadata.json`, and chapter bounds).

## 3. TikTok & YouTube Shorts Multi-Shorts Kit (`03_YouTube_Package.md`)
Include in Section 6 of `03_YouTube_Package.md`:
- **Titles:** Strictly `< 100 characters` (target 65–85 chars, max 92 chars + emoji).
- **Slice Bounds:** `Short 01` (`<!-- CLIMAX_START -->` to `<!-- CLIMAX_END -->`, ~45–56s + 3s outro $\le 59$s) and `Short 02` (`<!-- SHORT_EARLY_START -->` to `<!-- SHORT_EARLY_END -->`, ~45–55s).
- **Continuous Binge Copy:** On-screen text overlays, captions, and pinned bio comments using continuous story phrasing (zero fixed minute counts).
