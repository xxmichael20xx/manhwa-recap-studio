# 🛠️ Universal Platform Tooling & Assembly SOP
## Complete Operational Manual for Midjourney, Fooocus, ElevenLabs & CapCut

> **Module:** Engine Core (`00_Engine/03_Platform_Tooling_and_Assembly_SOP.md`)  
> **Target Audience:** Video Editors, Audio Engineers, and AI Agents

---

## 1. Tool Stack & Direct Access Directory

* **Visual Generation (Cloud):** [Midjourney](https://www.midjourney.com) (Standard Plan on `/settings` $\rightarrow$ **Relax Mode**).
* **Visual Generation (Local $0):** [Fooocus](https://github.com/lllyasviel/Fooocus) (Runs on local GPU via `run.bat`).
* **Audio Narration (Studio):** [ElevenLabs](https://elevenlabs.io) (Voices: *Marcus* or *Adam* | Stability: `72%` | Similarity: `85%`).
* **Audio Narration (Free):** [Microsoft Edge-TTS](https://pypi.org/project/edge-tts/) (`pip install edge-tts`).
* **Video Assembly & Subtitles:** [CapCut Desktop](https://www.capcut.com) (1-Click Auto Captions & 2.5D Keyframes).
* **SFX & Ambience:** [Pixabay Sound Effects](https://pixabay.com/sound-effects/) & [YouTube Audio Library](https://studio.youtube.com).

---

## 2. Character Model Sheet Creation & Consistency Protocol

1. **Step 1: Generate Master Model Sheet**  
   Generate a multi-angle turn-around sheet (`front`, `side`, `action`) on a white background.
2. **Step 2: Copy Reference URL**  
   Upscale the image and copy its permanent URL (`[CHARACTER_URL]`).
3. **Step 3: Enforce `--cref` in Midjourney**  
   Add `--cref [CHARACTER_URL] --cw 80` to all prompt strings in the Prompt Matrix to lock facial structure and costume design.

---

## 3. CapCut Desktop Assembly Workflow (1080p 60fps)

1. **Project Settings:** Canvas set to `1920×1080` at `60 fps`.
2. **Timeline Structure:**
   * **Video Track 1:** 16:9 AI panels (5–7 seconds each).
   * **Audio Track 1:** Master Voiceover WAV tracks ($0\text{ dB}$).
   * **Audio Track 2:** Background OST with automatic Audio Ducking set to **`-22 dB`**.
   * **Audio Track 3:** SFX (UI Level-Up Chimes, Impact Hits, Bass Drops).
3. **1-Click Auto Captions:**
   * Click **Text** $\rightarrow$ **Auto captions** $\rightarrow$ **English** $\rightarrow$ **Generate**.
   * Styling: Uppercase font (**Montserrat** / **The Bold Font**), white text, black stroke (`25%`), dynamic active word highlight in yellow (`#FFE600`).
4. **2.5D Camera Keyframing:**
   * Apply a subtle push-in zoom ($100\% \rightarrow 112\%$) to every panel to eliminate static frames.
   * Add a 6-frame **Camera Shake** effect on critical combat hits.
