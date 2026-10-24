import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { formatSceneXML, DNA, ATTIRE, SPATIAL, STYLE } from './common.mjs'
import { scriptScenes } from './generate_ep03_script.mjs'
import { b01Scenes, b02Scenes, b03Scenes, b04Scenes, b05Scenes } from './build_batches_1_to_5.mjs'
import { b06Scenes, b07Scenes, b08Scenes, b09Scenes, b10Scenes } from './build_batches_6_to_10.mjs'
import { AntiSlopValidator } from '../../server/services/antiSlopValidator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')

const franchiseId = 'Series_04_The_Billion_Year_Sovereign'
const episodeId = 'EP03_The_Campus_Lockdown_and_The_Impostor_Sovereign'
const targetDir = path.resolve(projectRoot, '01_Franchises', franchiseId, episodeId)

const CHARACTER_PHYSICAL_DNA = {
  'Wang Bao': {
    primaryTraits: '20-year-old chubby East Asian male student, round cheerful face, double chin, short spiky black hair, expressive wide comical eyes',
    detectRegex: /\b(chubby|round cheerful face|double chin)\b/i,
    fullExpansion: '@{Wang Bao}, 20-year-old chubby East Asian male student, round cheerful face, double chin, short spiky black hair, expressive wide comical eyes',
    panelAnchor: 'chubby @{Wang Bao}'
  },
  'Commander Han Feng': {
    primaryTraits: '42-year-old weathered military commander, short grizzled dark hair, tired stern eyes with heavy dark circles, sharp tactical scar on left cheek',
    detectRegex: /\b(weathered|grizzled|tactical scar|42-year-old)\b/i,
    fullExpansion: '@{Commander Han Feng}, 42-year-old weathered military commander, short grizzled dark hair, tired stern eyes with heavy dark circles, sharp tactical scar on left cheek',
    panelAnchor: 'weathered @{Commander Han Feng}'
  },
  'Jiang Qingxue': {
    primaryTraits: '21-year-old ethereal East Asian woman, long flowing silk-black hair with frosted silver tips, sharp ice-blue phoenix eyes, graceful cold aloof expression',
    detectRegex: /\b(ethereal|frosted silver tips|ice-blue phoenix eyes)\b/i,
    fullExpansion: '@{Jiang Qingxue}, 21-year-old ethereal East Asian woman, long flowing silk-black hair with frosted silver tips, sharp ice-blue phoenix eyes, graceful cold aloof expression',
    panelAnchor: 'ethereal @{Jiang Qingxue}'
  },
  'Gu Tianyu': {
    primaryTraits: '21-year-old arrogant athletic male student, sharp slicked-back dark brown hair, humiliated bitter expression',
    detectRegex: /\b(slicked-back dark brown hair|humiliated bitter)\b/i,
    fullExpansion: '@{Gu Tianyu}, 21-year-old arrogant athletic male student, sharp slicked-back dark brown hair, humiliated bitter expression',
    panelAnchor: 'humiliated @{Gu Tianyu}'
  },
  'Mo Yufeng': {
    primaryTraits: '22-year-old arrogant East Asian male cultivator, sharp swept-back crimson-tinted dark hair, haughty sneering expression',
    detectRegex: /\b(crimson-tinted dark hair|haughty sneering)\b/i,
    fullExpansion: '@{Mo Yufeng}, 22-year-old arrogant East Asian male cultivator, sharp swept-back crimson-tinted dark hair, haughty sneering expression',
    panelAnchor: 'arrogant @{Mo Yufeng}'
  },
  'Lu Chen': {
    primaryTraits: '20-year-old East Asian male student, messy soft raven-black hair, deep calm obsidian eyes with microscopic golden starlight flecks, deadpan bored expression',
    detectRegex: /\b(messy soft raven-black hair|obsidian eyes|deadpan bored)\b/i,
    fullExpansion: '@{Lu Chen}, 20-year-old East Asian male student, messy soft raven-black hair, deep calm obsidian eyes with microscopic golden starlight flecks, deadpan bored expression',
    panelAnchor: 'deadpan @{Lu Chen}'
  },
  'Ye Xingchen': {
    primaryTraits: '28-year-old imposing aristocratic man, long silver-streaked dark hair, regal golden eyes full of cold disdain',
    detectRegex: /\b(silver-streaked dark hair|regal golden eyes)\b/i,
    fullExpansion: '@{Ye Xingchen}, 28-year-old imposing aristocratic man, long silver-streaked dark hair, regal golden eyes full of cold disdain',
    panelAnchor: 'aristocratic @{Ye Xingchen}'
  }
}

function expandTokens(text) {
  if (!text) return text
  // 1. Initial template token replacement
  let expanded = text
    .replace(/\\?\$\{DNA\.([A-Z_]+)\}/g, (_, k) => DNA[k] || '')
    .replace(/\\?\$\{ATTIRE\.([A-Z_]+)\}/g, (_, k) => ATTIRE[k] || '')
    .replace(/\\?\$\{SPATIAL\.([A-Z_]+)\}/g, (_, k) => SPATIAL[k] || '')
    .replace(/\\?\$\{STYLE\.([A-Z_]+)\}/g, (_, k) => STYLE[k] || '')

  // 2. Google Flow Maximum Detail Mandate: Inject full physical DNA on EVERY scene
  for (const [charName, spec] of Object.entries(CHARACTER_PHYSICAL_DNA)) {
    const macroTag = `@{${charName}}`
    if (expanded.includes(macroTag)) {
      // Check if prompt already contains physical keywords
      if (!spec.detectRegex.test(expanded)) {
        // Replace first occurrence of bare macro with full physical DNA
        let replacedFirst = false
        expanded = expanded.replace(new RegExp(`@\\{${charName}\\}(?!,\\s*\\d+-year-old)`, 'g'), match => {
          if (!replacedFirst) {
            replacedFirst = true
            return spec.fullExpansion
          }
          return match
        })
      }
    }
  }

  // Clean any awkward double "in wearing" artifacts
  expanded = expanded.replace(/\bin wearing\b/g, 'wearing')

  return expanded
}

// Bind script narrative to each scene and expand template tokens
const allBatchArrays = [
  b01Scenes, b02Scenes, b03Scenes, b04Scenes, b05Scenes,
  b06Scenes, b07Scenes, b08Scenes, b09Scenes, b10Scenes
]

let sceneIndex = 0
for (const batch of allBatchArrays) {
  for (const scene of batch) {
    scene.narrative = scriptScenes[sceneIndex].text
    scene.prompt = expandTokens(scene.prompt)
    sceneIndex++
  }
}

const allBatches = [
  { num: 1, name: 'The Aftermath & The Fried Spectrometer', scenes: b01Scenes, range: '001 - 024' },
  { num: 2, name: 'The Iron Cordon & Campus Hysteria', scenes: b02Scenes, range: '025 - 048' },
  { num: 3, name: 'The Crimson Descent & The Impostor\'s Proclamation', scenes: b03Scenes, range: '049 - 072' },
  { num: 4, name: 'The Grand Extortion & Gu Tianyu\'s Shameless Prostration', scenes: b04Scenes, range: '073 - 096' },
  { num: 5, name: 'The Dorm Gamer\'s Sarcasm & The Counterfeit Talisman', scenes: b05Scenes, range: '097 - 120' },
  { num: 6, name: 'The Threat Bureau Standoff & The Heavy Cannons', scenes: b06Scenes, range: '121 - 144' },
  { num: 7, name: 'The Glacial Saint Descends & The Arctic Verdict', scenes: b07Scenes, range: '145 - 168' },
  { num: 8, name: 'The Berserk Blood Pill & The Roaring 40m Sword-Beam', scenes: b08Scenes, range: '169 - 192' },
  { num: 9, name: 'The Sovereign Tap (0.0001%) & The 30m Crater Cleave', scenes: b09Scenes, range: '193 - 216' },
  { num: 10, name: 'The Grand Aftermath, Dorm 404 Noodles & The Starfall Fleet', scenes: b10Scenes, range: '217 - 240' }
]

console.log('='.repeat(78))
console.log('  ASSEMBLING SERIES 04 EPISODE 03 (240 SCENES / 10 DYNAMIC BATCHES)')
console.log('='.repeat(78))

// Assemble 02_Prompt_Matrix.md
let matrixContent = `# 02_Prompt_Matrix.md — Series 04 Episode 03 (240 Scenes / 10 Dynamic Batches)

> **Franchise:** The Billion-Year Sovereign: Reality Convergence (Series 04)  
> **Episode:** EP03: The Campus Lockdown and the Impostor Sovereign (Arc 1 Climax)  
> **Format:** 9:16 Vertical Webtoon Comic Strips (~73% Dual/Multi-Panel, ~27% Hero Plates)  
> **Total Scenes:** 240 Scenes (Batches 01–10)  
> **Visual Aesthetic:** Modern 2025 High-Clarity Urban Cultivation (Bright High-Key Lighting, Clean Architecture)  
> **Chronometric Anchor:** Night Atmosphere with Brilliant Floodlights & Celestial Starlight  
> **Spatial Enclosure Invariants:** Campus Park -> Perimeter Cordon -> Proctor's Podium -> Stadium Bleachers -> Frosted Central Stage -> 30m Crater -> Dorm Room 404 -> Starfall Penthouse

---
`

for (const b of allBatches) {
  const bNum = String(b.num).padStart(2, '0')
  matrixContent += `\n## 📦 BATCH ${bNum} (Scenes ${b.range}): ${b.name}\n\n`
  for (const s of b.scenes) {
    matrixContent += `${formatSceneXML(s)}\n\n`
  }
  matrixContent += `---\n`
}

fs.writeFileSync(path.join(targetDir, '02_Prompt_Matrix.md'), matrixContent, 'utf8')
console.log('✓ 02_Prompt_Matrix.md assembled successfully (240 scenes).')

// Run 8-Gate Pre-Flight Linter Audit
const scriptPath = path.join(targetDir, '01_Episode_Script.md')
const scriptText = fs.readFileSync(scriptPath, 'utf8')

const vaultDir = path.resolve(projectRoot, '01_Franchises', franchiseId, 'character_vault')
let characters = []
let items = []
let flowEntities = {}

try {
  characters = JSON.parse(fs.readFileSync(path.join(vaultDir, 'characters.json'), 'utf8')).characters || []
} catch (e) {}
try {
  items = JSON.parse(fs.readFileSync(path.join(vaultDir, 'items.json'), 'utf8')).items || []
} catch (e) {}
try {
  flowEntities = JSON.parse(fs.readFileSync(path.join(vaultDir, 'flow_entities.json'), 'utf8')).entities || {}
} catch (e) {}

console.log('\nRunning Studio Deterministic 8-Gate Pre-Flight Audit...')
const report = AntiSlopValidator.auditPromptMatrix(scriptText, matrixContent, {
  characters,
  items,
  flowEntities
})

console.log(`\nTotal Scenes Audited: ${report.totalScenes} (Script: ${report.scriptScenesCount})`)
console.log(`Overall Health Score : ${report.overallScore}/100`)
console.log(`Production Status    : ${report.isProductionReady ? '\x1b[32m[PASS] 100% PRODUCTION READY\x1b[0m' : '\x1b[31m[FAIL] PRE-FLIGHT BLOCKED\x1b[0m'}\n`)

console.log('Deterministic Checks Record:')
console.log('-'.repeat(78))

report.checks.forEach((chk, idx) => {
  const icon = chk.passed ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m'
  const scoreStr = `Score: ${chk.score}%`.padEnd(12)
  console.log(`${idx + 1}. ${chk.name}`)
  console.log(`   ${icon} ${scoreStr} — ${chk.details}`)
  if (!chk.passed && chk.failingScenes && chk.failingScenes.length > 0) {
    console.log(`   \x1b[33m↳ Failing Scenes:\x1b[0m ${chk.failingScenes.join(', ')}`)
  }
  console.log('')
})

if (!report.isProductionReady) {
  process.exit(1)
} else {
  console.log('All 8 Pre-Flight Checks Passed Bit-For-Bit! 100/100 Production Ready.')
  process.exit(0)
}
