import fs from 'fs'
import path from 'path'

const projectRoot = 'C:/Users/MIchaelangelo/Documents/My Brand/02_Ventures & Digital Products/Manhwa Recap Studio'
const epDir = path.join(projectRoot, '01_Franchises/Series_01_The_Sovereign_Protocol/EP01_Awakening_and_Catacombs')
const srtPath = path.join(epDir, 'subtitles/01_Episode_Subtitles.srt')
const scriptPath = path.join(epDir, '01_Episode_Script.md')
const matrixPath = path.join(epDir, '02_Prompt_Matrix.md')

// 1. Parse SRT
const srt = fs.readFileSync(srtPath, 'utf-8')
const blocks = srt.trim().split(/\n\s*\n/)
const cues = []
for (const b of blocks) {
  const lines = b.trim().split('\n')
  if (lines.length >= 3) {
    const tm = lines[1].match(/(\d\d):(\d\d):(\d\d),(\d\d\d)\s*-->\s*(\d\d):(\d\d):(\d\d),(\d\d\d)/)
    if (tm) {
      const s = parseInt(tm[1])*3600 + parseInt(tm[2])*60 + parseInt(tm[3]) + parseInt(tm[4])/1000
      const e = parseInt(tm[5])*3600 + parseInt(tm[6])*60 + parseInt(tm[7]) + parseInt(tm[8])/1000
      cues.push({ id: cues.length + 1, start: s, end: e, duration: e - s, text: lines.slice(2).join(' ').trim() })
    }
  }
}

// 2. Generate 2.0s - 3.5s beats
const rawBeats = []
let i = 0
while (i < cues.length) {
  let curStart = cues[i].start
  let curEnd = cues[i].end
  let textParts = [cues[i].text]
  let j = i + 1
  
  while (j < cues.length) {
    const curDur = curEnd - curStart
    const nextDur = cues[j].end - curStart
    const isPunct = /[,.!?—;:]$/.test(cues[j-1].text)
    
    if (curDur >= 2.0 && isPunct) break
    if (nextDur > 3.8 && curDur >= 1.5) break
    if (nextDur > 4.2) break
    
    curEnd = cues[j].end
    textParts.push(cues[j].text)
    j++;
  }
  
  rawBeats.push({
    start: curStart,
    end: curEnd,
    duration: curEnd - curStart,
    text: textParts.join(' ')
  })
  i = j
}

const beats = []
for (let b = 0; b < rawBeats.length; b++) {
  const beat = rawBeats[b]
  if (beat.duration > 3.8) {
    const mid = beat.start + beat.duration / 2
    const words = beat.text.split(' ')
    const half = Math.ceil(words.length / 2)
    beats.push({
      start: beat.start,
      end: mid,
      duration: mid - beat.start,
      text: words.slice(0, half).join(' ')
    })
    beats.push({
      start: mid,
      end: beat.end,
      duration: beat.end - mid,
      text: words.slice(half).join(' ')
    })
  } else {
    beats.push(beat)
  }
}

beats.forEach((b, idx) => {
  b.beatId = idx + 1
  b.tag = 'IMG_' + String(idx + 1).padStart(3, '0')
  b.sceneId = 'IMG' + String(idx + 1).padStart(3, '0')
})

console.log(`Parsed ${beats.length} beats. Generating aligned script and prompt matrix...`)

// Helper to determine characters & context per beat
function generatePromptForBeat(beat, index) {
  const t = beat.text.toLowerCase()
  const sec = beat.start

  // Quality suffix for anatomy & manhwa art style with strict limb connectivity
  const qualitySuffix = 'anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn boots and feet, crisp pupil reflections, no floating hands, no detached hands, no ghost limbs, no morphing artifacts, no severed appendages, no duplicate limbs, no warped anatomy, dark fantasy action manhwa art style, sharp ink linework, cinematic lighting'

  // Act 1: 0 to 210s (Scenes 1 - 3: Humiliation & Awakening)
  if (sec < 90) { // Scene 1: Banquet Hall & Introduction
    if (sec < 6) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, 9:16 vertical format, wide subterranean dungeon exit establishing shot, [Foreground]: @{Ethan Drake - Outcast} walking with hunched posture, carrying a heavy rusted iron rig with dual bronze mana canisters strapped across shoulders, [Background]: elite hunters in glowing cyan power armour, dark stone tunnel, misty floor, ${qualitySuffix}`
    } else if (sec < 12) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, 9:16 vertical format, medium profile tracking shot, @{Ethan Drake - Outcast} in tattered charcoal poncho, bruised cheek, hollow eyes, both arms hanging naturally at sides, elite strike team celebrating in foreground flashbulbs, ${qualitySuffix}`
    } else if (sec < 18) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, 9:16 vertical format, macro close-up of fractured mana channels glowing faintly grey under linen bandages wrapped securely around Ethan's forearms and wrists, raindrops dripping from frayed cuffs, ${qualitySuffix}`
    } else if (sec < 24) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, 9:16 vertical format, medium tracking shot, trudging through the heavy rain outside the extraction gate, arms tucked inside poncho, neon headlights of luxury hunter transports reflecting on wet asphalt, ${qualitySuffix}`
    } else if (sec < 30) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Marcus Vance}, 9:16 vertical format, ultra-wide low-angle establishing shot, grand imperial banquet ballroom of House Vance, colossal tiered crystal chandeliers blazing with warm golden light, polished black obsidian marble floor, aristocratic nobles whispering, ${qualitySuffix}`
    } else if (sec < 36) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Evelyn Cross}, 9:16 vertical format, full-length standing portrait under golden chandelier light, noblewoman @{Evelyn Cross} with wavy silver-blue hair, navy-blue officer coat with gold braid epaulets, both hands resting elegantly at waist level, icy sapphire eyes looking down with cold indifference, ${qualitySuffix}`
    } else if (sec < 42) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Evelyn Cross}, 9:16 vertical format, dynamic macro close-up of Evelyn's single right hand attached to slim wrist and coat sleeve, casually tossing a filigree silver engagement band into the air with a flick of her wrist, specular sparkles glinting off the spinning silver ring in mid-air, ${qualitySuffix}`
    } else if (sec < 48) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Evelyn Cross}, @{Ethan Drake - Outcast}, 9:16 vertical format, floor-level macro shot, the silver engagement ring bouncing and settling against the scuffed toe of @{Ethan Drake - Outcast}'s worn combat boot on black marble, blurred banquet guests in background, ${qualitySuffix}`
    } else if (sec < 60) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Marcus Vance}, 9:16 vertical format, medium chest portrait, strike captain @{Marcus Vance} in obsidian plate armor with glowing crimson runic filigree, his right armored arm bent at the elbow holding a single golden wine goblet, left arm resting naturally at his side, both arms physically connected to shoulders, predatory sneer, ${qualitySuffix}`
    } else if (sec < 75) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Marcus Vance}, @{Evelyn Cross}, 9:16 vertical format, medium two-shot, Marcus draping his right armored arm possessively over Evelyn's shoulder as she looks down with cold disdain, aristocratic guests smirking in golden ballroom, ${qualitySuffix}`
    } else {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, 9:16 vertical format, wide dramatic isolation shot in center of vast golden ballroom, Ethan standing alone in tattered poncho with clenched fists at sides, surrounded by mocking nobles pointing and laughing, ${qualitySuffix}`
    }
  } else if (sec < 155) { // Scene 2: Cast Into the Lower City
    if (sec < 110) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, @{Marcus Vance}, 9:16 vertical format, medium action shot, armored guild bailiff using two physically attached hands to snap Ethan's bronze porter licence in half, blue sparks flying, Ethan's clenched linen-wrapped fists trembling with suppressed fury, ${qualitySuffix}`
    } else if (sec < 125) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, 9:16 vertical format, wide exterior shot, heavy iron double gates of House Vance estate slamming shut, Ethan shoved violently out into torrential nighttime rain on dark cobblestones, ${qualitySuffix}`
    } else if (sec < 140) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, 9:16 vertical format, low-angle tracking shot, Ethan walking through neon-drenched dark alley of Lower District, rain soaking through frayed trench-coat, puddles reflecting flickering magenta neon signs, ${qualitySuffix}`
    } else {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, 9:16 vertical format, medium profile, Ethan clutching his aching chest with his left hand as dull grey mana throbs painfully beneath his ribs, dark dystopian skyscrapers towering into storm clouds, ${qualitySuffix}`
    }
  } else if (sec < 220) { // Scene 3: The Crimson Awakening
    if (sec < 175) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, 9:16 vertical format, dramatic collapse shot, Ethan's knees buckling in dark service corridor beneath monorail tracks, falling onto wet grating, rain frozen in mid-air around him, ${qualitySuffix}`
    } else if (sec < 190) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Outcast}, 9:16 vertical format, first-person POV shot, glowing crimson holographic HUD interface crystallising in mid-air against pitch darkness: '[Emergency Protocol Initialised: Host Biological Failure Imminent]', ${qualitySuffix}`
    } else if (sec < 205) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, dynamic hero shot, liquid crimson fire radiating outward from Ethan's spine, repairing fractured mana channels with blazing golden-red light, eyes snapping open with glowing amber irises, ${qualitySuffix}`
    } else {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, sleek obsidian system notification window hovering before retinas: '[Host Physical Attributes Re-Indexed: Base Constitution Allocated: 200 Points]', ${qualitySuffix}`
    }
  } else if (sec < 330) { // Scene 4: Descending into Sector Nine Catacombs
    if (sec < 250) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, full standing pose, Ethan rising smoothly to his feet, relaxed confident stance, posture tall and broad, heavy tungsten muscle density aura radiating subtly, ${qualitySuffix}`
    } else if (sec < 280) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, medium close-up, Ethan inspecting his two bare hands physically connected to forearms, flexing 5 clean fingers as faint metallic density sheen ripples across his skin, ${qualitySuffix}`
    } else if (sec < 305) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, high-angle shot looking down into open rusted sewer maintenance hatch leading into dark subterranean sub-gate fissure, green mist wafting out, ${qualitySuffix}`
    } else {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, wide subterranean catacomb establishing shot, ancient gothic stone pillars, green sludge canal, three pairs of glowing crimson beast eyes igniting in deep darkness, ${qualitySuffix}`
    }
  } else if (sec < 460) { // Scene 5: The Physical Threshold Test (Hound Combat)
    if (sec < 360) {
      return `IMG${String(index + 1).padStart(3, '0')}, 9:16 vertical format, dynamic action shot, Level Two Shadowfang Hound lunging through air with razor-sharp black fangs and glowing crimson eyes aimed at Ethan's neck, motion blur, ${qualitySuffix}`
    } else if (sec < 385) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, calm heroic stance, Ethan raising his bare left forearm horizontally to intercept the lunging hound's jaws without flinching, left arm firmly attached to shoulder, ${qualitySuffix}`
    } else if (sec < 410) {
      return `IMG${String(index + 1).padStart(3, '0')}, 9:16 vertical format, extreme macro impact frame, hound's massive black fangs shattering like glass against Ethan's bare skin, kinetic sparks and bone fragments flying, zero blood on forearm, ${qualitySuffix}`
    } else if (sec < 435) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, dynamic strike shot, Ethan thrusting open right palm into beast's chest plate with arm extended from shoulder, concussive shockwave expanding outward in white rings, ${qualitySuffix}`
    } else {
      return `IMG${String(index + 1).padStart(3, '0')}, 9:16 vertical format, wide tunnel aftermath shot, beast carcass blasted 20 meters backward against stone wall, floating glowing blue system prompt: '[Target Neutralised. +250 EXP. Progress: 250 / 5,000]', ${qualitySuffix}`
    }
  } else if (sec < 600) { // Scene 6: Neural Download & Kinetic Kata
    if (sec < 490) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, close-up of glowing cyan-violet skill orb hovering above hound remains, obsidian system prompt: '[Skill Manual: Kinetic Resonance (Tier 1)]', ${qualitySuffix}`
    } else if (sec < 530) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, dramatic neural download shot, electrical telemetry arcs surging from shattered orb into Ethan's raised palm and optic nerves, gritting teeth in intense concentration, ${qualitySuffix}`
    } else if (sec < 565) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, dynamic kinetic kata stance, Ethan executing high-speed martial arts shift, motion blur trails following his linen-wrapped fists, ${qualitySuffix}`
    } else {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, glowing kinetic energy rings coalescing around Ethan's forearms, ready to redirect incoming force with double intensity, confident cold expression, ${qualitySuffix}`
    }
  } else if (sec < 740) { // Scene 7 & 8: Syndicate Scavenger Ambush & Choke Point Combat
    if (sec < 630) {
      return `IMG${String(index + 1).padStart(3, '0')}, 9:16 vertical format, wide cistern establishing shot, 15 armed Iron Jackal syndicate scavengers surrounding the perimeter, high-ground catwalks with riflemen aiming downward, ${qualitySuffix}`
    } else if (sec < 665) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Boss Grigor}, 9:16 vertical format, intimidating portrait of syndicate leader Grigor, scarred face, heavy mechanical exo-rig, two armored arms resting on colossal pneumatic steam-powered warhammer grounded on stone floor, ${qualitySuffix}`
    } else if (sec < 700) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, tactical retreat shot, Ethan backstepping smoothly into narrow stone drainage corridor bottleneck, funneling 15 enemies into single file, ${qualitySuffix}`
    } else {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, @{Boss Grigor}, 9:16 vertical format, colossal climax impact shot, Grigor's pneumatic warhammer striking Ethan's bare raised palm, massive kinetic shockwave blowing out steam pipes, Ethan's single right arm unyielding and connected to torso, ${qualitySuffix}`
    }
  } else { // Scene 9 & 10: Counter-Attack & Season Finale Hook
    if (sec < 770) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, @{Boss Grigor}, 9:16 vertical format, dynamic counter-strike, Ethan unleashing stored Kinetic Resonance through right fist into Grigor's exo-chestplate, shattering steel and pneumatic pistons, ${qualitySuffix}`
    } else if (sec < 790) {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, wide victory shot, syndicate mercenaries routed on wet stone floor, glowing gold level-up pillars cascading around Ethan: '[Level 5 Reached]', ${qualitySuffix}`
    } else {
      return `IMG${String(index + 1).padStart(3, '0')}, @{Ethan Drake - Awakened}, 9:16 vertical format, epic season closing hero shot, Ethan standing at the threshold of the deep Abyssal Catacombs, crimson sovereign aura swirling around his silhouette, looking toward the horizon, ${qualitySuffix}`
    }
  }
}

// 3. Build Markdown Script with 266 Inline Tags
let scriptMarkdown = `# 📜 Episode 01: Awakening and the Catacombs
## Series 01: The Sovereign Protocol | Season 1, Episode 1

> **Format:** Episode (Tier 1) | **Runtime:** ~13:28 (808s)  
> **Visual Dynamic Beats:** ${beats.length} High-Retention Master Plates (Batches A–L)  
> **Visual Pacing:** 2.0s – 3.5s Rapid Recuts (Average: ${(807.6 / beats.length).toFixed(2)}s per cut)  
> **Location:** \`01_Franchises/Series_01_The_Sovereign_Protocol/EP01_Awakening_and_Catacombs/01_Episode_Script.md\`

---

## 🎙️ Master Episode Voiceover & 1:1 Synchronized Visual Storyboard

`

// Group beats into Acts and Scenes
beats.forEach((b, idx) => {
  scriptMarkdown += `\`[${b.tag}]\` ${b.text} `
  if ((idx + 1) % 4 === 0) {
    scriptMarkdown += '\n\n'
  }
})

fs.writeFileSync(scriptPath, scriptMarkdown.trim() + '\n', 'utf-8')
console.log(`Saved updated 01_Episode_Script.md with ${beats.length} tags.`)

// 4. Build 02_Prompt_Matrix.md in 24-scene XML Batches
let matrixMarkdown = `# 🖼️ Episode 01: Visual Prompt Matrix (${beats.length}-Beat Master Deck)
## Series 01: The Sovereign Protocol | Season 1, Episode 1

> **Character Vault Integration:** Standardised 1-to-1 Character Profiles (\`@{Ethan Drake - Outcast}\`, \`@{Ethan Drake - Awakened}\`, \`@{Marcus Vance}\`, \`@{Evelyn Cross}\`, \`@{Boss Grigor}\`, \`@{Chief Appraiser}\`)  
> **Dynamic Batch Partitioning:** 24-Scene Google Flow Concurrency Batches (Batches A–L)  
> **Visual Pacing:** Synchronized for 2.0s – 3.5s per cut across 808s master audio  
> **Quality Standard:** Anatomically correct hands (5 slender fingers), crisp manhwa lineart, zero warped limbs, 9:16 vertical manhwa format  
> **Location:** \`01_Franchises/Series_01_The_Sovereign_Protocol/EP01_Awakening_and_Catacombs/02_Prompt_Matrix.md\`

---

`

const batchSize = 24
const batchLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

for (let batchIdx = 0; batchIdx < Math.ceil(beats.length / batchSize); batchIdx++) {
  const startIdx = batchIdx * batchSize
  const endIdx = Math.min(startIdx + batchSize, beats.length)
  const letter = batchLetters[batchIdx] || `Batch_${batchIdx + 1}`
  const batchBeats = beats.slice(startIdx, endIdx)

  matrixMarkdown += `## ⚡ Batch ${letter}: Scenes ${String(startIdx + 1).padStart(3, '0')} – ${String(endIdx).padStart(3, '0')}

\`\`\`xml
`
  batchBeats.forEach((b, i) => {
    const globalIdx = startIdx + i
    const promptText = generatePromptForBeat(b, globalIdx)
    matrixMarkdown += `<scene id="${b.sceneId}">\n${promptText}\n</scene>\n\n`
  })

  matrixMarkdown += `\`\`\`\n\n---\n\n`
}

fs.writeFileSync(matrixPath, matrixMarkdown.trim() + '\n', 'utf-8')
console.log(`Saved updated 02_Prompt_Matrix.md with ${beats.length} prompt entries across Batches A–L.`)
