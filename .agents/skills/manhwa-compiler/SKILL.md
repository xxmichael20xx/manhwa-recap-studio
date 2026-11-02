---
name: manhwa-compiler
description: Multi-episode omnibus compiler, Universal Studio AV Spec Lock enforcer, lossless FFmpeg stream-copy concatenator, ffprobe chapter calculator, and frame-accurate video proof extractor. Trigger with /compiler.
---

# 🎬 Manhwa Master Omnibus Compiler & Video QA (`/compiler`)

## 1. Strict Context Verification & Proactive CLI Execution
- **Missing Context Halt:** If target franchise, episode/omnibus scope, or operation type is unspecified, **HALT** and confirm via `ask_question`. Verify physical existence of `video/01_Episode_Master_1080p.mp4` on disk before including any episode in an omnibus cut.
- **Proactive CLI Automation:** Use `studio/scripts/compile-and-prove.py` (or `VideoService` endpoints) to automate `ffprobe` validation, normalization, lossless concat, and frame proof extraction.

## 2. Universal Studio Video & Audio Specification Invariant (`G22_universal_av_spec_lock`)
100% of batch previews, episode masters, omnibus movies, and shorts MUST match `VideoService.STUDIO_SPECS`:
- **Video:** `1920x1080` (Landscape 16:9) or `1080x1920` (Vertical 9:16), strictly **`24.0 fps`** (`-r 24`), `H.264 / AVC` (`libx264` / `h264_nvenc`), pixel format `yuv420p` (`-pix_fmt yuv420p`), `-crf 20 -preset veryfast -movflags +faststart`.
- **Audio:** `AAC-LC` (`-c:a aac`) in `.mp4` (`libmp3lame` for standalone `.mp3`), **`48,000 Hz`** (`-ar 48000`), **Stereo** (`-ac 2`), `192 kbps` (`-b:a 192k`), normalized to `-14 LUFS` / `-1.5 dBTP` (`loudnorm=I=-14:TP=-1.5:LRA=7`).
- **Auto-Normalization:** Any deviant input clip must be resampled via `VideoService.normalizeToStudioSpecs` prior to `-c copy` stitching.

## 3. Targeted Single-Batch Recompilation & Frame Proof Gate
1. **Ban on Unprompted Full-Episode Re-Encoding:** Never trigger full 300-scene re-encodes autonomously.
2. **Targeted Batch Compile + Lossless Stitch:** When `[IMG_XXX]` tags or `.srt` timings change, trigger `POST /compile-video` (`{ batchIndex: N }`) ONLY for modified batches, then immediately execute `POST /stitch-batches` (`-c copy`, <5s).
3. **Zero-Drift `ffprobe` Cumulative Chapters:** Probe each master MP4 (`ffprobe -v error -show_entries format=duration ...`), compute exact cumulative `HH:MM:SS` chapter offsets, and write to `omnibus/omnibus_metadata.json`.
4. **Mandatory Frame-Accurate Proof Extraction:** Extract 2–4 PNG frames at flagged timestamps (`ffmpeg -ss <ts> -i <video.mp4> -vframes 1 ...`) and visually verify via `view_file` that burned subtitles and artwork match 100% bit-for-bit before handoff.
