import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const franchiseDir = path.join(projectRoot, '01_Franchises/Series_02_The_Omniscient_Dungeon_Sovereign')
const epDir = path.join(franchiseDir, 'EP01_The_FRank_Awakening_and_The_Plunderers_Bow')

const scriptContent = fs.readFileSync(path.join(epDir, '01_Episode_Script.md'), 'utf-8')
const promptContent = fs.readFileSync(path.join(epDir, '02_Prompt_Matrix.md'), 'utf-8')

// Parse Script IMG tags
const scriptLines = scriptContent.split('\n')
const scriptScenes = []
for (const line of scriptLines) {
  const match = line.match(/^\[IMG_(\d{3})\]\s*(.*)$/)
  if (match) {
    scriptScenes.push({ tag: `IMG_${match[1]}`, num: parseInt(match[1], 10), text: match[2].trim() })
  }
}

// Parse Prompt Matrix XML scene tags
const promptScenes = []
const sceneRegex = /<scene\s+id="([^"]+)"\s+filename="([^"]+)"\s+motion="([^"]+)">([\s\S]*?)<\/scene>/g
let match
while ((match = sceneRegex.exec(promptContent)) !== null) {
  promptScenes.push({
    tag: match[1],
    filename: match[2],
    motion: match[3],
    prompt: match[4].trim()
  })
}

console.log(`📊 Script Scenes Count: ${scriptScenes.length}`)
console.log(`📊 Prompt Matrix XML Scenes Count: ${promptScenes.length}`)

if (scriptScenes.length !== 216 || promptScenes.length !== 216) {
  console.error('❌ Scene count mismatch! Expected exactly 216.')
  process.exit(1)
}

// Verify 1:1 Tag Order & Numbering
let mismatches = 0
for (let i = 0; i < 216; i++) {
  const s = scriptScenes[i]
  const p = promptScenes[i]
  if (s.tag !== p.tag) {
    console.error(`❌ Tag mismatch at index ${i}: Script=${s.tag}, Prompt=${p.tag}`)
    mismatches++
  }
}

// Check policy triggers
const policyKeywords = [
  '\\bblood\\b', '\\bkill\\b', '\\bkilling\\b', '\\bbrutally\\b', '\\bdead body\\b',
  '\\bbrain death\\b', '\\bocular sockets\\b', '\\bgore\\b',
  '\\b18-year-old boy\\b', '\\bkid\\b', '\\bdemonic pact\\b', '\\bwitchcraft\\b'
]

let triggerCount = 0
promptScenes.forEach(scene => {
  for (const kw of policyKeywords) {
    const regex = new RegExp(kw, 'i')
    if (regex.test(scene.prompt)) {
      console.warn(`⚠️ Trigger detected in ${scene.tag}: ${kw}`)
      triggerCount++
    }
  }
})

// Check format tokens (16:9)
let formatErrors = 0
promptScenes.forEach(scene => {
  if (!scene.prompt.includes('16:9')) {
    console.warn(`⚠️ Missing 16:9 in ${scene.tag}`)
    formatErrors++
  }
})

console.log(`🛡️ Policy Trigger Words Count: ${triggerCount}`)
console.log(`📐 Format Errors (Non 16:9): ${formatErrors}`)
console.log(`🔍 Tag Mismatches: ${mismatches}`)
if (mismatches === 0 && triggerCount === 0 && formatErrors === 0) {
  console.log('✅ 100% Visual and Script Alignment Validated across all 216 scenes!')
} else {
  console.error('❌ Validation failed on some criteria.')
  process.exit(1)
}
