---
name: refresh-rules
description: Autonomous Agent Memory & Directives Synchroniser. Re-reads all workspace AGENTS.md, global directives, and modular SKILL.md files directly from disk into active context to eliminate cross-session memory drift without requiring a restart. Trigger with /refresh-rules or /sync-rules.
---

# 🔄 Agent Memory & Directives Synchroniser (`/refresh-rules`)

> **Master SOP for In-Session Memory Refresh & Cross-Session Rule Alignment**  
> **Slash Keyword:** `/refresh-rules` or `/sync-rules`  
> **Workspace Root:** `quirky-chandrasekhar`

---

## 🎯 Purpose & Scope

In long-running or multi-tab development workflows, directives and domain skills are frequently updated in parallel conversations. This skill allows the agent to immediately re-ingest all live rules, SOPs, and prompt architectures directly from disk into its active working memory within an existing session—eliminating outdated cached behaviors without needing to reset or compact context.

---

## ⚡ Execution Protocol

Whenever `/refresh-rules` or `/sync-rules` is invoked, the agent MUST execute the following 4-step sequence:

### Step 1: Scan & Re-Read Core Workspace Directives
Directly inspect and read the latest disk versions of:
1. `c:\Users\MIchaelangelo\Documents\antigravity\quirky-chandrasekhar\AGENTS.md`
2. `C:\Users\MIchaelangelo\.gemini\config\AGENTS.md` (Global Core)

### Step 2: Scan & Ingest All Modular Domain Skills
Inspect `.agents/skills/` and re-read all primary `SKILL.md` manifests:
- `manhwa-story` (Scriptwriting, RPG arithmetic, 5 lore logic gates, 6 master narrative laws)
- `manhwa-matrix` (Chief Continuity Director, 3-tier visual engine, 7-point continuity contract, 7 Google Flow AI policy shields)
- `manhwa-vault` (Character & item DNA, textless master plates, Flow UUIDs)
- `manhwa-new-ep` (End-to-end episodic production orchestrator)
- `manhwa-launch` (YouTube packaging, high-CTR titles, pinned comments)
- `manhwa-compiler` (FFmpeg omnibus concatenator, duration verification)
- `manhwa-dev` (Studio engineering, Slate design system, scrap cleanup)
- `manhwa-series` (Franchise initialization & world setting visual selection)
- `manhwa-thumb` (Master thumbnail archetypes & badge engine)

### Step 3: Inspect Franchise Engine Codices
Scan `00_Engine/` in the active venture directory for updated archetype formulas, anti-slop codices, or platform manuals.

### Step 4: Deliver Ingestion Delta Summary
Conclude by presenting a concise, bulleted **Ingestion Delta Summary** highlighting:
1. Which skills or directives have recent timestamp updates.
2. Key architectural shifts or rule calibrations newly active in working memory.
3. Explicit confirmation that the agent's active memory is 100% aligned with disk ground truth.
