---
name: manhwa-compiler
description: Master multi-episode omnibus compiler, zero-drift ffprobe video duration checker, lossless FFmpeg stream-copy concatenator, and frame-accurate video proof extractor. Trigger with /compiler.
---

# 🎬 Manhwa Master Omnibus Compiler & Video QA (`/compiler`)

> **Master SOP for Multi-Episode Concat, Video Metadata Probing & Frame QA**  
> **Slash Command:** `/compiler`  
> **Workspace Root:** `quirky-chandrasekhar`

---

## 🎯 Mandatory Interactive Auto-Grill Pre-Flight (`ask_question`)

Whenever `/compiler` is invoked, the agent MUST immediately halt and initiate an interactive `ask_question` interview:

```
[Interactive Pre-Flight Alignment Modal]
1. Target Franchise Selection:
   - (Recommended) Series 03: Transmigrated Game Architect (EP01, EP02, EP03 Ready)
   - Series 01: The Singularity Protocol
   - Series 02: The Omniscient Dungeon Sovereign
2. Compilation / QA Operation:
   - (Recommended) Compile Master Omnibus Movie (Parts 1 - 3 Concat + Exact ffprobe Chapters)
   - Inspect Video Metadata (ffprobe Durations & Cumulative Chapter Offsets)
   - Targeted Single-Batch Recompilation (POST /compile-video { batchIndex })
   - Frame-Accurate Video Proof Extraction (ffmpeg -ss at Flagged Timestamps)
```

---

## 🛑 Video Compilation & Verification Protocol: Targeted vs Full Concat

1. **Clarified Scope of Full Compilation Ban:** The ban on autonomous compilation strictly applies to multi-batch full-episode re-encodings (`compileEpisodeVideo` re-encoding all 300+ scenes from scratch), which tie up system resources for 15+ minutes.
2. **Mandatory Targeted Single-Batch Recompilation:** Whenever script tags `[IMG_XXX]`, scene timings, or subtitle `.srt` cues are modified to fix a synchronization issue, the agent MUST immediately trigger targeted single-batch compilation (`POST /compile-video` with `{ batchIndex: N }`) for ONLY the affected batches. Leaving stale preview MP4 files on disk is strictly forbidden.
3. **Mandatory Lossless Master Re-Stitching:** After compiling the affected batch previews, trigger lossless stream-copy concatenation (`POST /stitch-batches`), which executes in <5 seconds via the FFmpeg concat demuxer (`-c copy`) without re-encoding.
4. **Mandatory Frame-Accurate Video Proof Extraction Gate:** Prior to handing back to the operator, extract and visually verify at least 2–4 frame captures from the newly compiled video at the exact flagged timestamps using FFmpeg (`ffmpeg -ss <timestamp> -i <video.mp4> -vframes 1 ...`). Both the subtitle text and the visual action MUST be proven to match bit-for-bit before declaring completion.

---

## 🔍 Zero-Drift Video Duration & Chapter Probing (`ffprobe`)

To ensure 100% mathematically exact cumulative timestamps for YouTube descriptions without human calculation drift:
1. Probe each individual episode master MP4 via `ffprobe`:
   ```bash
   ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "01_Episode_Master_1080p.mp4"
   ```
2. Build cumulative offsets:
   - **Part 1:** Starts at `00:00:00` (Duration: $D_1$)
   - **Part 2:** Starts at $D_1$ formatted as `MM:SS` or `HH:MM:SS` (Duration: $D_2$)
   - **Part 3:** Starts at $D_1 + D_2$ formatted as `HH:MM:SS`
3. Persist metadata to `omnibus/omnibus_metadata.json` for deterministic consumption by the Studio UI and YouTube Launchpad.

---

## 🎞️ Multi-Episode Master Movie Tiers

- **Tier 2: Arc Feature / Saga:** 45–60 Minutes (~6,500–8,500 words). Merges 2–3 episodes.
- **Tier 3: Season Movie / Cinematic Cut:** 1.5–2.5 Hours (~12,000–20,000 words). Merges 3–5 episodes.
- **Tier 4: Grand Omnibus / Marathon:** 3.0+ Hours (~25,000+ words). Multi-season binge cut.
