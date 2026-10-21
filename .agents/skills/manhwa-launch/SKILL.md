---
name: manhwa-launch
description: YouTube release packaging hub. Enforces the Locked Canonical Title & Description Invariant (<=100 chars), accumulative upload cadence ((Episode 1) -> (Episode 1-2)), plain episode timestamps for compilations, and Shorts extraction kits. Trigger with /launch.
---

# 🚀 Manhwa YouTube Release Packaging Hub (`/launch`)

> **Master SOP for Locked Canonical Titles, Accumulative Descriptions & YouTube Launchpads**  
> **Slash Command:** `/launch`  
> **Workspace Root:** `quirky-chandrasekhar`

---

## 🎯 Mandatory Interactive Auto-Grill Pre-Flight (`ask_question`)

Whenever `/launch` is invoked (unless the operator has already specified the target in their prompt), initiate an interactive `ask_question` interview:

```
[Interactive Pre-Flight Alignment Modal]
1. Target Franchise & Release Target:
   - Dynamically list active franchise from 01_Franchises/ (e.g. Series 04: Upload 1 (Episode 1 Standalone) or Upload 2 (Episode 1-2 Compiled))
2. Packaging Deliverables:
   - (Recommended) Locked Title & Description Package (from YouTube_Locked_Package.md)
   - Complete Launchpad Kit (Title, Description, Pinned Comment & Shorts Kit)
```

---

## 🔒 The Locked Canonical Title & Accumulative Upload Standard (Zero Regeneration Invariant)

To prevent audience confusion, eliminate wasted tokens, and maximise algorithmic binge recommendations across YouTube, the studio enforces **ONE locked canonical title and ONE locked description template per franchise** stored in `00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md`:

1. **First-Run 3-Title Selection & Permanent Lock ($\le 84$ Characters Base):**
   - If `00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md` does not exist yet (Episode 1 initialization), present **strictly 3 High-CTR Title Options** (`(Episode 1) {Base Title}`) via `ask_question`.
   - Once the operator picks 1 title, lock that title, the Episode 1 description (zero timestamps), and the 3 thumbnails into `YouTube_Locked_Package.md` and `EP01/03_YouTube_Package.md`.
   - On all subsequent runs, read `YouTube_Locked_Package.md` and perform ONLY the minimal updates (`(Episode 1-N)` prefix, runtime bounds, and plain 1-line-per-episode timestamps).
2. **The Accumulative Upload Numbering Standard:**
   - The operator uploads cumulatively: Upload 1 is Episode 1; Upload 2 is Episodes 1 & 2 compiled; Upload 3 is Episodes 1, 2 & 3 compiled, and so on.
   - Only the prefix numbering changes across uploads:
     * **Upload 1 (Episode 1 Standalone):** `(Episode 1) {Master Series Title}`  
       *Example:* `(Episode 1) He Ran An Idle Cultivation Game For 10 Years, Then Earth Merged With His Save` (89 chars).
     * **Upload 2 (Episodes 1–2 Compiled):** `(Episode 1-2) {Master Series Title}`  
       *Example:* `(Episode 1-2) He Ran An Idle Cultivation Game For 10 Years, Then Earth Merged With His Save` (91 chars).
     * **Upload N (Episodes 1–N Compiled):** `(Episode 1-{N}) {Master Series Title}`  
       *Example:* `(Episode 1-3) He Ran An Idle Cultivation Game For 10 Years, Then Earth Merged With His Save` (91 chars).
3. **YouTube 100-Character Hard Cap Defense:**
   - Total character length including `(Episode 1-N)` prefix and spaces MUST be strictly $\le 100$ characters.

---

## 📋 Locked YouTube SEO Description Architecture (Episode 1 vs Compiled)

The description body (synopsis paragraphs, series header, community question, music attribution, disclaimer, and hashtags) is **100% locked verbatim** to Episode 1's approved description in `YouTube_Locked_Package.md`. Never rewrite the synopsis for subsequent episodes or compilations.

- **Evergreen Subscribe CTA Mandate (Ongoing vs Complete):**
  - **Ongoing Releases (`Episode 1`, `Episode 1-N`):** `🔔 Subscribe to the channel and turn on notifications so you don't miss the next episode!`
  - **Complete Series Marathon (`(Complete)`):** `🔔 Subscribe to the channel and check out our other full-length manhwa series and complete marathon sagas!`
  - Never hardcode a specific upcoming episode number or title.

Only the runtime/bounds and the timestamp block change:

### 1. Upload 1: Single Standalone Episode Release (`EP01`)
- **Zero Chapter Timestamps Mandate:** Standalone Episode 1 releases omit chapter timestamps completely. Strictly NO Acts, NO scene batches, NO micro-timestamps, and NO fake "Episode 01 / Episode 02" internal chapter lines.
- **Runtime Block Only:**
  ```text
  ⏱️ FULL EPISODE RUNTIME & TIMELINE:
  • Full Runtime: 21.8 Minutes (21:46)
  • Episode Bounds: 00:00 - 21:46
  ```

### 2. Upload 2+: Multi-Episode Accumulative Compilations (`Episode 1-2`, `Episode 1-3`, etc.)
- **Plain Episode Timestamps ONLY:** When 2 or more episodes are compiled into a master video, insert the `⏱️ CHAPTER TIMESTAMPS:` block containing **strictly 1 plain timestamp line per compiled episode** plus the finale timestamp:
  ```text
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏱️ CHAPTER TIMESTAMPS:
  00:00 - Episode 01: The One-Billion-Year Awakening and The Broken Blade (21m 46s)
  21:46 - Episode 02: The Campus Appraisal and The Celestial Countdown (36m 20s)
  58:05 - Series Finale & Epilogue
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ```
- **Strict Prohibitions:** Strictly NO acts, NO batch markers, NO internal sub-chapters.
- **Cumulative Mathematical Offsets:** Derived with zero-drift accuracy from `ffprobe` durations of each episode master file (`omnibus/*_metadata.json`).

---

## 📱 Centralised Launchpad Kits Architecture (YouTube + TikTok / Shorts)

All public launch deliverables are unified within `03_YouTube_Package.md` and surfaced in Studio Tab 4 (`Launchpad Kits`):

### 1. YouTube Kit Section
- 1 Locked Canonical Title ($\le 100$ characters) with `(Episode 1)` or `(Episode 1-N)` prefix.
- 3 Visual Thumbnail Variants (Concepts A, B, C with MozJPEG compliance and dynamic top-left yellow badge).
- Locked SEO Description Box (zero timestamps for Ep 1; plain episode timestamps for Ep 1–N compilations).
- Pinned Community Comment.

### 2. TikTok & YouTube Shorts Kit Section (Multi-Shorts Architecture)
Every episode release package (`03_YouTube_Package.md`) includes the TikTok & Shorts Viral Kit:
- **Strict < 100 Character Hard Cap for Shorts Titles:** Sweet spot **65–85 characters**, max **92 characters** including emoji.
- **Primary Climax Short (`Short 01`):** `<!-- CLIMAX_START -->` to `<!-- CLIMAX_END -->` (~45–56s + 3s outro $\le 59$s).
- **Secondary Underdog Short (`Short 02`):** `<!-- SHORT_EARLY_START -->` to `<!-- SHORT_EARLY_END -->` (~45–55s).
- **On-Screen Text Overlays, Viral Captions & Pinned Bio Comments.**

---

## 🔒 The Unified Multi-Channel Launchpad Contract (YouTube + Shorts/TikTok)

1. **Locked Package Truth Invariant:**
   - The master title and description MUST be anchored directly to `00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md` and mirrored into `03_YouTube_Package.md`.
2. **The Continuous Storytelling Standard (Zero Fixed Minute Mentions in Shorts):**
   - Reusable Shorts captions and bio comments use continuous binge phrasing (`Watch the full continuous story on YouTube (Link in bio 🔗)`).
3. **Zero Cross-Franchise Lore Bleed Invariant:**
   - Studio services must NEVER fall back to hardcoded tropes from peer series (e.g. never leak Series 03 "Bram / Common Tool Polisher" into Series 04).
