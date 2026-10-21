import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { formatSceneXML } from './common.mjs'
import { batch01 } from './batch01.mjs'
import { batch02 } from './batch02.mjs'
import { batch03 } from './batch03.mjs'
import { batch04 } from './batch04.mjs'
import { batch05 } from './batch05.mjs'
import { batch06 } from './batch06.mjs'
import { batch07 } from './batch07.mjs'
import { batch08 } from './batch08.mjs'
import { batch09 } from './batch09.mjs'
import { AntiSlopValidator } from '../../server/services/antiSlopValidator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')

const targetDir = path.resolve(
  projectRoot,
  '01_Franchises/Series_04_The_Billion_Year_Sovereign/EP02_The_Campus_Appraisal_and_The_Celestial_Countdown'
)

const allBatches = [
  { num: 1, name: 'Dawn in Qindu & The Threat Bureau Cordon', scenes: batch01, range: '001 - 024' },
  { num: 2, name: 'The Mandatory Campus Appraisal Mobilisation', scenes: batch02, range: '025 - 048' },
  { num: 3, name: 'The Twelve-Year Camouflage & Han Feng\'s Interrogation', scenes: batch03, range: '049 - 072' },
  { num: 4, name: 'The Gu Syndicate Retaliation & Gravity Rebound', scenes: batch04, range: '073 - 096' },
  { num: 5, name: 'The Descent of the Glacial Lotus — Fairy Qingxue Arrives', scenes: batch05, range: '097 - 120' },
  { num: 6, name: 'The Fragrance of Primordial Tea & Dorm 4 Knock', scenes: batch06, range: '121 - 144' },
  { num: 7, name: 'The Global Broadcast & Ye Xingchen\'s Coronation', scenes: batch07, range: '145 - 168' },
  { num: 8, name: 'The Final Countdown & Planetary Leyline Humming', scenes: batch08, range: '169 - 192' },
  { num: 9, name: 'The Zero Countdown — Ranks 10 to 2 Unveiled & The Rank 1 Primordial Shockwave', scenes: batch09, range: '193 - 216' }
]

console.log('='.repeat(78))
console.log('  ASSEMBLING SERIES 04 EPISODE 02 (216 SCENES / 9 BATCHES)')
console.log('='.repeat(78))

// --- 1. Assemble 01_Episode_Script.md ---
let scriptContent = `# Episode 02: The Campus Appraisal and the Celestial Countdown

> **Series:** The Billion-Year Sovereign: Reality Convergence (Series 04)  
> **Format:** 9:16 Vertical Webtoon (Dual & Multi-Panel Strips)  
> **Runtime Tier:** Tier 2 Arc Feature (~38-40 Minutes, 216 Scenes, 9 Batches)  
> **Narrator Pace:** 140 WPM (~5,800 words total)  
> **Language Standard:** British English  
> **Visual Style:** Modern 2025 High-Clarity Urban Cultivation (Bright Ambient Lighting, Clean Architecture)  

---
`

for (const b of allBatches) {
  scriptContent += `\n## 📦 BATCH 0${b.num} (Scenes ${b.range}): ${b.name}\n\n`
  for (const s of b.scenes) {
    if (s.id === 'IMG_055') scriptContent += `<!-- SHORT_EARLY_START -->\n\n`
    if (s.id === 'IMG_104') scriptContent += `<!-- SHORT_2_START -->\n\n`
    if (s.id === 'IMG_204') scriptContent += `<!-- CLIMAX_START -->\n\n`

    scriptContent += `[${s.id}] ${s.narrative}\n\n`

    if (s.id === 'IMG_065') scriptContent += `<!-- SHORT_EARLY_END -->\n\n`
    if (s.id === 'IMG_114') scriptContent += `<!-- SHORT_2_END -->\n\n`
    if (s.id === 'IMG_216') scriptContent += `<!-- CLIMAX_END -->\n\n`
  }
  scriptContent += `---\n`
}

fs.writeFileSync(path.join(targetDir, '01_Episode_Script.md'), scriptContent, 'utf8')
console.log('✓ 01_Episode_Script.md assembled successfully.')

// --- 2. Assemble 02_Prompt_Matrix.md ---
let matrixContent = `# 02_Prompt_Matrix.md — Series 04 Episode 02 (216 Scenes / 9 Dynamic Batches)

> **Franchise:** The Billion-Year Sovereign: Reality Convergence (Series 04)  
> **Episode:** EP02: The Campus Appraisal and the Celestial Countdown  
> **Format:** 9:16 Vertical Webtoon Comic Strips (~72% Dual/Multi-Panel, ~28% Hero Plates)  
> **Total Scenes:** 216 Scenes (Batches 01–09)  
> **Visual Aesthetic:** Modern 2025 High-Clarity Urban Cultivation (Bright High-Key Lighting, Clean Architecture)  
> **Chronometric Anchor:** Modern High-Key Morning (Crisp Morning Sunlight, Blue Skies, Clear Troposphere)  
> **Spatial Enclosure Invariants:** Campus Boulevards -> Dorm 4 Corridor -> Room 402 -> Central Stadium Turf -> Willow Walkway -> Starfall Penthouse -> Stratosphere Monolith

---
`

for (const b of allBatches) {
  matrixContent += `\n## 📦 BATCH 0${b.num} (Scenes ${b.range}): ${b.name}\n\n`
  for (const s of b.scenes) {
    matrixContent += `${formatSceneXML(s)}\n\n`
  }
  matrixContent += `---\n`
}

fs.writeFileSync(path.join(targetDir, '02_Prompt_Matrix.md'), matrixContent, 'utf8')
console.log('✓ 02_Prompt_Matrix.md assembled successfully.')

// --- 3. Run Linter Verification ---
console.log('\nRunning Studio Pass-Through Pre-Flight Verification...')
const auditReport = AntiSlopValidator.auditPromptMatrix(scriptContent, matrixContent, null)
console.log(`Total Scenes Audited: ${auditReport.totalScenes} / Script Scenes: ${auditReport.scriptScenesCount}`)
console.log(`Health Score: ${auditReport.overallScore}/100 — Production Status: ${auditReport.isProductionReady ? '[PASS] 100% PRODUCTION READY' : '[FAIL]'}`)
console.log('='.repeat(78))
