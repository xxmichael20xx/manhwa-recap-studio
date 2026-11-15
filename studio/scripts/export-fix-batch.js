#!/usr/bin/env node
/**
 * Fix / Re-Generation Batch Exporter for Manhwa Recap Studio.
 * Exports targeted scene IDs from an episode's 02_Prompt_Matrix.md into a
 * Google Flow Wave-of-8 XML deck inside the operator's Downloads directory.
 *
 * Usage:
 *   node studio/scripts/export-fix-batch.js <franchiseId> <episodeId> <IMG_021,IMG_029|IMG_021-029> [--out <path>]
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const STUDIO_ROOT = path.resolve(__dirname, '../..')

/** Resolve a franchise directory under 01_Franchises by exact folder name or prefix. */
function resolveFranchiseDir(franchiseArg) {
  const root = path.join(STUDIO_ROOT, '01_Franchises')
  const exact = path.join(root, franchiseArg)
  if (fs.existsSync(exact)) return exact
  const match = fs.readdirSync(root).find(d => d.toLowerCase().startsWith(franchiseArg.toLowerCase()))
  return match ? path.join(root, match) : null
}

/** Resolve an episode directory under a franchise by exact folder name or EPXX prefix. */
function resolveEpisodeDir(franchiseDir, episodeArg) {
  const exact = path.join(franchiseDir, episodeArg)
  if (fs.existsSync(exact)) return exact
  const match = fs.readdirSync(franchiseDir).find(d => d.toLowerCase().startsWith(episodeArg.toLowerCase()))
  return match ? path.join(franchiseDir, match) : null
}

/** Expand comma-separated scene IDs and inclusive ranges (e.g. "IMG_021,029-031") into sorted unique IDs. */
function parseTargetSceneIds(spec) {
  const ids = []
  const seen = new Set()
  const addId = num => {
    const tag = `IMG_${String(num).padStart(3, '0')}`
    if (!seen.has(tag)) {
      seen.add(tag)
      ids.push(tag)
    }
  }

  for (const rawPart of String(spec || '').split(',')) {
    const part = rawPart.trim()
    if (!part) continue
    const rangeMatch = part.match(/^(?:IMG_)?(\d+)\s*-\s*(?:IMG_)?(\d+)$/i)
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10)
      const end = parseInt(rangeMatch[2], 10)
      const lo = Math.min(start, end)
      const hi = Math.max(start, end)
      for (let n = lo; n <= hi; n++) addId(n)
      continue
    }
    const singleMatch = part.match(/^(?:IMG_)?(\d+)$/i)
    if (!singleMatch) {
      throw new Error(`Invalid scene selector "${part}". Use IMG_XXX or IMG_XXX-YYY.`)
    }
    addId(parseInt(singleMatch[1], 10))
  }
  return ids
}

/** Parse one <scene> XML block cleanly from 02_Prompt_Matrix.md. */
function extractSceneBlock(matrixText, sceneId) {
  const sceneRe = new RegExp(`<scene\\s+id="${sceneId}"([\\s\\S]*?)<\\/scene>`, 'i')
  const match = matrixText.match(sceneRe)
  if (!match) return null

  const fullBlock = match[0]
  const readTag = tag => {
    const tm = fullBlock.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'))
    return tm ? tm[1].trim() : ''
  }

  const charRefs = readTag('character_refs').split(',').map(s => s.trim()).filter(Boolean)
  const itemRefs = readTag('item_refs').split(',').map(s => s.trim()).filter(Boolean)
  const actionLayer = readTag('action_layer')
  const promptBody = readTag('prompt')
  const stageMeta = (fullBlock.match(/<layout>([\s\S]*?)<\/layout>/i)?.[1] || '')
  const isCombat = /dynamic action plate|\bslice|\bslash|\bstrike|\bparry|\blunge|\bclash|\bcharge|\bimpact/i.test(`${stageMeta} ${actionLayer}`)

  return { sceneId, charRefs, itemRefs, promptBody, isCombat }
}

/** Build the Google Flow Wave-of-8 system directive header matching PromptMatrixView.vue. */
function buildFlowDirectiveHeader({ collectionTitle, totalScenes, combatCount, format, refTokens }) {
  const calmCount = totalScenes - combatCount
  const waveCount = Math.ceil(totalScenes / 8)
  const styleLabel = format === '16:9'
    ? '16:9 Full-Bleed High-Fantasy Action Manhwa'
    : '9:16 Vertical Manhwa Webtoon'
  const aspectRule = format === '16:9'
    ? 'Sharp black ink linework, vibrant high-contrast 2D cel shading, horizontal 16:9 (1920x1080) single-panel full-bleed illustration.'
    : 'Sharp black ink linework, vibrant high-contrast 2D cel shading, vertical 9:16 illustration.'
  const refLine = refTokens.length > 0
    ? refTokens.map(r => `@{${r}}`).join(', ')
    : 'declared scene entity references'

  return `[COMMAND: GENERATE BY 8 -> RENAME -> ORGANIZE INTO COLLECTION]
MANDATE: Process ALL scenes in this prompt automatically in consecutive waves of at most 8 scenes at a time: (1) Generate up to 8 scenes concurrently -> (2) Rename each generated image to its exact filename="..." attribute -> (3) Assign those renamed images into target collection "${collectionTitle}". Continue wave-by-wave automatically until all scenes are finished. Do NOT fire all 24 in one burst, do NOT ask for confirmation between waves, and do NOT output per-scene status text (such as "I am currently generating scene IMG_XXX...").

[SYSTEM DIRECTIVE: TARGET COLLECTION "${collectionTitle}" | WAVE SIZE: MAX 8 SCENES | GENERATE BY 8 -> RENAME -> COLLECTION]

STRICT OPERATIONAL DIRECTIVES FOR "${collectionTitle}" (EXECUTE IN THIS ORDER):
1. STEP 1 - GENERATE BY 8 (MAX 8 SCENES PER WAVE): Split the <scene> nodes below into ${waveCount} consecutive wave(s) of at most 8 scenes (${totalScenes} total scenes). Generate at most 8 scenes concurrently per wave.
2. STEP 2 - RENAME GENERATED FILES: Immediately after each wave completes, rename every generated asset to match the exact filename="..." attribute of its <scene> node (e.g. IMG_021.jpg) without waiting for a "sync" command.
3. STEP 3 - ORGANIZE INTO TARGET COLLECTION: After renaming, create (if not present) and assign 100% of those renamed images into collection "${collectionTitle}". Never mix with prior batches.
4. SMART TEXT CONTROL (SCENE-LOCKED):
   - Zero environmental text objects exist in this batch — enforce 100% PURE TEXTLESS ILLUSTRATION across all ${totalScenes} scenes in "${collectionTitle}" (zero speech bubbles, zero dialogue, zero SFX, zero Hangul, zero caption boxes, zero letters/numbers).
   - Never render structural prompt words ("Top block", "Middle", "Bottom", "Environment") as visible caption boxes.
5. ANATOMY & ANTI-MORPHING ISOLATION:
   - Flawless human anatomy for character scenes: cleanly rendered hands with distinct individual fingers, clean wrist linework, natural shoulder posture.
   - Maintain crisp character face, hair color, bare/gloved hand accuracy, and right-hand weapon grip fidelity matching attached reference plates.
6. CONTEXT-AWARE CROWD & EXTRAS STAGING:
   - Strict focus on declared character_refs only; zero unrequested background crowds or random NPCs.
7. LITERAL ACTION FIDELITY (${calmCount} Calm/Dialogue vs ${combatCount} Combat/Duel Scenes):
   - Depict ONLY the exact posture, grip, and action written in each <scene>.
8. ART STYLE INVARIANT (${styleLabel}):
   - ${aspectRule}
   - Strictly NO 3D CGI, NO photorealism, NO Unreal/Blender shading, NO split panels, NO comic borders.
9. CHARACTER ENTITY REFERENCE MAPPING:
   - Always map @{Character Name} tags to their corresponding project reference plates: ${refLine}.`
}

/** Serialize one <scene> block identically to entityMapper.js format. */
function formatFlowSceneXml(scene) {
  const filename = `${scene.sceneId}.jpg`
  let openTag = `<scene id="${scene.sceneId}" filename="${filename}"`
  if (scene.charRefs.length === 1) {
    openTag += ` character_ref="${scene.charRefs[0]}"`
  } else if (scene.charRefs.length > 1) {
    openTag += ` character_refs="${scene.charRefs.join(', ')}"`
  }
  if (scene.itemRefs.length === 1) {
    openTag += ` item_ref="${scene.itemRefs[0]}"`
  } else if (scene.itemRefs.length > 1) {
    openTag += ` item_refs="${scene.itemRefs.join(', ')}"`
  }
  openTag += '>'
  return `${openTag}\n# Filename: ${filename}\n${scene.promptBody}\n</scene>`
}

function main() {
  const args = process.argv.slice(2)
  const outFlagIdx = args.indexOf('--out')
  let customOut = null
  if (outFlagIdx !== -1) {
    customOut = args[outFlagIdx + 1]
    args.splice(outFlagIdx, 2)
  }

  const [franchiseArg, episodeArg, sceneSpec] = args
  if (!franchiseArg || !episodeArg || !sceneSpec) {
    console.error('Usage: node studio/scripts/export-fix-batch.js <franchiseId> <episodeId> <IMG_021,IMG_029|IMG_021-029> [--out <path>]')
    process.exit(1)
  }

  const franchiseDir = resolveFranchiseDir(franchiseArg)
  if (!franchiseDir) {
    console.error(`[ERROR] Franchise not found: ${franchiseArg}`)
    process.exit(1)
  }
  const episodeDir = resolveEpisodeDir(franchiseDir, episodeArg)
  if (!episodeDir) {
    console.error(`[ERROR] Episode not found: ${episodeArg}`)
    process.exit(1)
  }

  const matrixPath = path.join(episodeDir, '02_Prompt_Matrix.md')
  if (!fs.existsSync(matrixPath)) {
    console.error(`[ERROR] Missing matrix: ${matrixPath}`)
    process.exit(1)
  }

  const franchiseJsonPath = path.join(franchiseDir, 'franchise.json')
  const franchise = fs.existsSync(franchiseJsonPath)
    ? JSON.parse(fs.readFileSync(franchiseJsonPath, 'utf8'))
    : { format: '16:9' }
  const matrixText = fs.readFileSync(matrixPath, 'utf8')
  const targetIds = parseTargetSceneIds(sceneSpec)
  if (targetIds.length === 0) {
    console.error('[ERROR] No valid scene IDs parsed.')
    process.exit(1)
  }

  const scenes = []
  const missing = []
  const allRefSet = new Set()
  for (const id of targetIds) {
    const parsed = extractSceneBlock(matrixText, id)
    if (!parsed) {
      missing.push(id)
      continue
    }
    scenes.push(parsed)
    for (const r of [...parsed.charRefs, ...parsed.itemRefs]) allRefSet.add(r)
  }
  if (missing.length > 0) {
    console.error(`[ERROR] Scene(s) not found in 02_Prompt_Matrix.md: ${missing.join(', ')}`)
    process.exit(1)
  }

  const epMatch = path.basename(episodeDir).match(/^(EP\d+)/i)
  const epCode = epMatch ? epMatch[1].toUpperCase() : episodeArg.toUpperCase()
  const seriesMatch = path.basename(franchiseDir).match(/Series_(\d+)/i)
  const seriesLabel = seriesMatch ? `Series ${seriesMatch[1]}` : path.basename(franchiseDir)
  const collectionTitle = `${seriesLabel} ${epCode} - Fix Regenerate Batch`

  const header = buildFlowDirectiveHeader({
    collectionTitle,
    totalScenes: scenes.length,
    combatCount: scenes.filter(s => s.isCombat).length,
    format: franchise.format || '16:9',
    refTokens: [...allRefSet]
  })

  const outPath = customOut
    ? path.resolve(customOut)
    : path.join(os.homedir(), 'Downloads', `${epCode}_Fix_Regenerate_Batch.md`)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  const xmlBlocks = scenes.map(formatFlowSceneXml).join('\n\n')
  fs.writeFileSync(outPath, `${header}\n\n${xmlBlocks}\n`, 'utf8')

  console.log(`[EXPORTED] ${scenes.length} scene(s) (${Math.ceil(scenes.length / 8)} wave(s) of <=8) -> ${outPath}`)
  console.log(`  Scenes: ${scenes.map(s => s.sceneId).join(', ')}`)
}

main()
