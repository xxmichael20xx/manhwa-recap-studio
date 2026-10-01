import fs from 'fs'
import path from 'path'

const projectRoot = 'C:/Users/MIchaelangelo/Documents/My Brand/02_Ventures & Digital Products/Manhwa Recap Studio'
const epDir = path.join(projectRoot, '01_Franchises/Series_01_The_Sovereign_Protocol/EP01_Awakening_and_Catacombs')
const imagesDir = path.join(epDir, 'images')
const matrixPath = path.join(epDir, '02_Prompt_Matrix.md')

const defaultDownloadsDir = 'C:/Users/MIchaelangelo/Downloads'
const targetInput = process.argv[2] || path.join(defaultDownloadsDir, 'download (13)')

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

// 1. Parse Prompt Matrix
const matrixContent = fs.readFileSync(matrixPath, 'utf-8')
const sceneMatches = [...matrixContent.matchAll(/<scene id=["']?(IMG_?\d+)["']?>([\s\S]*?)<\/scene>/gi)]
const scenes = sceneMatches.map((m, idx) => {
  const rawId = m[1].replace(/_/g, '')
  const num = rawId.replace(/IMG/i, '').padStart(3, '0')
  return {
    index: idx + 1,
    tag: `IMG_${num}`,
    rawTag: `IMG${num}`,
    num: parseInt(num, 10),
    prompt: m[2].trim(),
    keywords: m[2].toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2)
  }
})

console.log(`Loaded ${scenes.length} prompt matrix scenes from EP01.`)

// 2. Discover Input Files
let inputFiles = []
if (fs.existsSync(targetInput)) {
  const stat = fs.statSync(targetInput)
  if (stat.isDirectory()) {
    const all = fs.readdirSync(targetInput)
    inputFiles = all.filter(f => /\.(jpe?g|png|webp)$/i.test(f)).map(f => ({
      filename: f,
      fullPath: path.join(targetInput, f)
    }))
  }
}

if (inputFiles.length === 0) {
  console.error(`No image files found in ${targetInput}`)
  process.exit(1)
}

console.log(`Found ${inputFiles.length} images in "${targetInput}".`)

// 3. Score each file against scenes
// If there are 24 files, assume Batch A (scenes 1 to 24) unless keywords suggest otherwise
const batchSize = 24
const candidateScenes = scenes.slice(0, Math.max(batchSize, inputFiles.length))

function cleanSlug(filename) {
  return filename
    .replace(/_\d{10,18}(?:_\d+)?\.(jpe?g|png|webp)$/i, '')
    .replace(/\.(jpe?g|png|webp)$/i, '')
    .toLowerCase()
    .replace(/[._-]/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

const scoredPairs = []
inputFiles.forEach(file => {
  const slug = cleanSlug(file.filename)
  const slugTokens = slug.split(/\s+/).filter(w => w.length > 2)
  
  candidateScenes.forEach(scene => {
    let score = 0
    slugTokens.forEach(t => {
      if (scene.keywords.includes(t)) score += 3
      else if (scene.keywords.some(k => k.includes(t) || t.includes(k))) score += 1
    })
    scoredPairs.push({ file, scene, score, slug })
  })
})

// Sort highest score first
scoredPairs.sort((a, b) => b.score - a.score)

const assignedFiles = new Set()
const assignedScenes = new Set()
const finalMapping = []

for (const pair of scoredPairs) {
  if (!assignedFiles.has(pair.file.fullPath) && !assignedScenes.has(pair.scene.tag) && pair.score > 0) {
    assignedFiles.add(pair.file.fullPath)
    assignedScenes.add(pair.scene.tag)
    finalMapping.push({
      file: pair.file,
      scene: pair.scene,
      score: pair.score,
      slug: pair.slug
    })
  }
}

// Assign any unassigned files sequentially to remaining candidate scenes
const unassignedFiles = inputFiles.filter(f => !assignedFiles.has(f.fullPath))
const unassignedScenes = candidateScenes.filter(s => !assignedScenes.has(s.tag))

unassignedFiles.forEach((file, idx) => {
  const scene = unassignedScenes[idx]
  if (scene) {
    finalMapping.push({
      file,
      scene,
      score: 0,
      slug: cleanSlug(file.filename)
    })
  }
})

// Sort mapping by scene number
finalMapping.sort((a, b) => a.scene.num - b.scene.num)

console.log('\n--- 🎯 SEMANTIC MATCHING & INGESTION REPORT ---')
let copiedCount = 0
finalMapping.forEach(m => {
  const ext = path.extname(m.file.filename) || '.jpg'
  const destName1 = `${m.scene.tag}${ext}`
  const destName2 = `${m.scene.rawTag}${ext}`
  const dest1 = path.join(imagesDir, destName1)
  const dest2 = path.join(imagesDir, destName2)

  fs.copyFileSync(m.file.fullPath, dest1)
  fs.copyFileSync(m.file.fullPath, dest2)
  copiedCount++

  console.log(`[${m.scene.tag}] <- "${m.file.filename}" (Match: "${m.slug}", Score: ${m.score})`)
})

console.log(`\n✓ Ingested and mapped ${copiedCount} images into ${imagesDir}`)
