---
name: refresh-rules
description: Re-ingest workspace AGENTS.md, global directives, modular SKILL.md files, and 00_Engine/ codices directly from disk to eliminate in-session memory drift. Trigger with /refresh-rules or /sync-rules.
---

# 🔄 Agent Memory & Directives Synchroniser (`/refresh-rules`)
1. **Re-Read Core Directives:** Read `01_GLOBAL_RULES/GLOBAL_AGENTS.md` and active Project `AGENTS.md` from disk.
2. **Re-Ingest Workspace Skills:** Scan `.agents/skills/` (`manhwa-series`, `manhwa-new-ep`, `manhwa-vault`, `manhwa-story`, `manhwa-matrix`, `manhwa-compiler`, `manhwa-launch`, `manhwa-thumb`, `manhwa-dev`) and `00_Engine/` codices.
3. **Deliver Ingestion Delta Summary:** Output a concise bulleted summary of updated timestamps, active rule shifts, and 100% disk-alignment confirmation.
