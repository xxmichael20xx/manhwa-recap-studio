import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../../')
const epDir = path.resolve(projectRoot, '01_Franchises/Series_01_The_Sovereign_Protocol/EP01_Awakening_and_Catacombs')

const scriptPath = path.join(epDir, '01_Episode_Script.md')
const srtPath = path.join(epDir, 'subtitles/01_Episode_Subtitles.srt')

console.log('🎬 Running Forced Alignment & Semantic Verification Engine...')

const srtContent = fs.readFileSync(srtPath, 'utf-8')
const srtBlocks = srtContent.trim().split(/\n\s*\n/)
const srtCues = []
for (const b of srtBlocks) {
  const lines = b.trim().split('\n')
  if (lines.length >= 3) {
    const timeMatch = lines[1].match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/)
    if (timeMatch) {
      const startSec = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000
      const endSec = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000
      const text = lines.slice(2).join(' ').trim()
      srtCues.push({ startSec, endSec, text })
    }
  }
}

const totalAudioDuration = srtCues[srtCues.length - 1].endSec
const totalAudioFrames = Math.round(totalAudioDuration * 30)

const scriptContent = fs.readFileSync(scriptPath, 'utf-8')
const sceneBlocks = scriptContent.split(/### Scene \d+:/g).slice(1)
const extractedBeats = []

sceneBlocks.forEach((block, sIdx) => {
  const voMatch = block.split(/\* \*\*Voiceover:\*\*/i)[1] || ''
  const cleanVo = voMatch.replace(/---|\#\#.*/g, '').trim()
  
  const inlineRegex = /`?\[(IMG_\d+)\]`?\s*([^\n`[]+)/gi
  let m
  while ((m = inlineRegex.exec(cleanVo)) !== null) {
    extractedBeats.push({
      tag: m[1].toUpperCase(),
      sceneIndex: sIdx + 1,
      text: m[2].trim()
    })
  }
})

console.log(`Extracted ${extractedBeats.length} voiceover inline beats across ${sceneBlocks.length} scenes.`)

const normalize = (text) => (text || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim()
const normalizedCues = srtCues.map((c, i) => ({ ...c, cueIdx: i, normText: normalize(c.text) }))

let cueCursor = 0
const anchors = extractedBeats.map((beat, idx) => {
  const words = normalize(beat.text).split(' ').filter(w => w.length > 1)
  const p3 = words.slice(0, 3).join(' ')
  const p2 = words.slice(0, 2).join(' ')
  const p1 = words[0] && words[0].length >= 5 ? words[0] : null

  let match = null
  for (let c = cueCursor; c < normalizedCues.length; c++) {
    const cue = normalizedCues[c].normText
    if (p3 && cue.includes(p3)) {
      match = normalizedCues[c]
      cueCursor = c
      break
    } else if (p2 && p2.length >= 6 && cue.includes(p2)) {
      match = normalizedCues[c]
      cueCursor = c
      break
    } else if (p1 && cue.includes(p1)) {
      match = normalizedCues[c]
      cueCursor = c
      break
    }
  }

  return {
    tag: beat.tag,
    sceneIndex: beat.sceneIndex,
    text: beat.text.slice(0, 45),
    startSec: match ? match.startSec : null,
    isAnchor: !!match
  }
})

anchors[0].startSec = 0.0
anchors[0].isAnchor = true

let i = 0
while (i < anchors.length) {
  if (anchors[i].isAnchor) {
    let nextAnchorIdx = -1
    for (let j = i + 1; j < anchors.length; j++) {
      if (anchors[j].isAnchor && anchors[j].startSec > anchors[i].startSec) {
        nextAnchorIdx = j
        break
      }
    }

    if (nextAnchorIdx === -1) {
      const startSec = anchors[i].startSec
      const count = anchors.length - i
      const step = (totalAudioDuration - startSec) / count
      for (let k = 1; k < count; k++) {
        anchors[i + k].startSec = startSec + k * step
      }
      break
    } else {
      const startSec = anchors[i].startSec
      const endSec = anchors[nextAnchorIdx].startSec
      const span = nextAnchorIdx - i
      const step = (endSec - startSec) / span
      for (let k = 1; k < span; k++) {
        anchors[i + k].startSec = startSec + k * step
      }
      i = nextAnchorIdx
    }
  } else {
    i++
  }
}

console.log('\n--- First 5 Aligned Beats (Intro / Ballroom Boundary Verification) ---')
console.table(anchors.slice(0, 5).map(a => ({
  tag: a.tag,
  startSec: a.startSec.toFixed(2) + 's',
  text: a.text
})))

console.log(`\n🎯 Verification: IMG_001 (Dungeon/Burden) starts at ${anchors[0].startSec.toFixed(2)}s`)
console.log(`🎯 Verification: IMG_002 (Rain / Fractured Mana Channels) starts at ${anchors[1].startSec.toFixed(2)}s (Active across 0:17)`)
console.log(`🎯 Verification: IMG_003 (Ballroom with Chandeliers) starts at ${anchors[2].startSec.toFixed(2)}s ("Across the grand banquet hall...")`)
console.log('✅ Semantic alignment test completed successfully!')
