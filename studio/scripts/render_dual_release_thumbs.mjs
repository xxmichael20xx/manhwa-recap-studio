import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const studioRoot = path.resolve(__dirname, '..')
const projectRoot = path.resolve(studioRoot, '..')
const franchiseDir = path.join(projectRoot, '01_Franchises', 'Series_03_Transmigrated_Game_Architect')
const omnibusDir = path.join(franchiseDir, 'omnibus')
const ep01ThumbDir = path.join(franchiseDir, 'EP01_The_Smiling_Architect_and_The_Chalk_Rapier', 'thumbnails')

const brainDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/c3484778-4ad4-4cf1-8a69-a848259a4a36'
const rawFiles = {
  concept_a: path.join(brainDir, 'bramwell_locke_youtube_thumbnail_ep01_1791952349217.jpg'),
  concept_b: path.join(brainDir, 'manhwa_youtube_thumbnail_bramwell_vs_cassian_1791952357307.jpg'),
  concept_c: path.join(brainDir, 'youtube_thumbnail_bramwell_vs_minotaur_1791952352394.jpg')
}

function generateYellowBadgeSvg(badgeText = '1 - 2', width = 1920, height = 1080) {
  const cleanBadge = badgeText.trim()
  const posX = 60
  const posY = 60
  
  const charWidth = 36
  const padX = 36
  const mainWidth = Math.max(220, cleanBadge.length * charWidth + padX * 2)
  const mainHeight = 92

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="yellowBingeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="45%" stop-color="#facc15" />
        <stop offset="100%" stop-color="#eab308" />
      </linearGradient>
      <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.9" />
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.65" />
      </filter>
    </defs>

    <g filter="url(#badgeShadow)">
      <rect 
        x="${posX - 3}" 
        y="${posY - 3}" 
        width="${mainWidth + 6}" 
        height="${mainHeight + 6}" 
        rx="24" 
        fill="#09090b" 
        stroke="rgba(255,255,255,0.5)" 
        stroke-width="3" 
      />
      <rect 
        x="${posX}" 
        y="${posY}" 
        width="${mainWidth}" 
        height="${mainHeight}" 
        rx="22" 
        fill="url(#yellowBingeGrad)" 
      />
      <rect 
        x="${posX + 4}" 
        y="${posY + 4}" 
        width="${mainWidth - 8}" 
        height="${mainHeight / 2 - 4}" 
        rx="18" 
        fill="rgba(255,255,255,0.25)" 
      />
      <text 
        x="${posX + mainWidth / 2}" 
        y="${posY + 65}" 
        font-family="'Montserrat', 'Arial Black', Impact, -apple-system, sans-serif" 
        font-size="56" 
        font-weight="900" 
        letter-spacing="2" 
        fill="#09090b" 
        text-anchor="middle"
      >
        ${cleanBadge}
      </text>
    </g>
  </svg>
  `
}

async function run() {
  console.log('🚀 Rendering Dual-Release Thumbnails (Master Movie 1 - 2 & EP01 PART 1)...')

  if (!fs.existsSync(omnibusDir)) fs.mkdirSync(omnibusDir, { recursive: true })
  if (!fs.existsSync(ep01ThumbDir)) fs.mkdirSync(ep01ThumbDir, { recursive: true })

  const concepts = [
    {
      id: 'concept_a',
      name: 'Variant A: The Split Transformation (Underdog vs Sovereign)',
      raw: rawFiles.concept_a,
      baseFilename: '01_Thumbnail_Concept_A.jpg',
      omniBadgeFilename: '01_Thumbnail_Concept_A_Badge_1-2.jpg',
      epBadgeFilename: '01_Thumbnail_Concept_A_Badge_Part1.jpg',
      textlessFilename: '01_Thumbnail_Concept_A_Textless.jpg'
    },
    {
      id: 'concept_b',
      name: 'Variant B: The Proctor Panic & Measurement Overflow Shock',
      raw: rawFiles.concept_b,
      baseFilename: '01_Thumbnail_Concept_B.jpg',
      omniBadgeFilename: '01_Thumbnail_Concept_B_Badge_1-2.jpg',
      epBadgeFilename: '01_Thumbnail_Concept_B_Badge_Part1.jpg',
      textlessFilename: '01_Thumbnail_Concept_B_Textless.jpg'
    },
    {
      id: 'concept_c',
      name: 'Variant C: The Calamity / Solo Cleave Spectacle',
      raw: rawFiles.concept_c,
      baseFilename: '01_Thumbnail_Concept_C.jpg',
      omniBadgeFilename: '01_Thumbnail_Concept_C_Badge_1-2.jpg',
      epBadgeFilename: '01_Thumbnail_Concept_C_Badge_Part1.jpg',
      textlessFilename: '01_Thumbnail_Concept_C_Textless.jpg'
    }
  ]

  const svgOmniBadge = Buffer.from(generateYellowBadgeSvg('1 - 2', 1920, 1080))
  const svgEpBadge = Buffer.from(generateYellowBadgeSvg('PART 1', 1920, 1080))

  for (const c of concepts) {
    console.log(`\nProcessing ${c.name}...`)
    const baseSharp = sharp(c.raw).resize(1920, 1080, { fit: 'cover', position: 'center' })
    const baseBuffer = await baseSharp.toBuffer()

    // 1. Textless
    const textlessBuffer = await sharp(baseBuffer).jpeg({ quality: 92, mozjpeg: true }).toBuffer()

    // 2. Omnibus "1 - 2" Badge
    const omniBadgeBuffer = await sharp(baseBuffer)
      .composite([{ input: svgOmniBadge, top: 0, left: 0 }])
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer()

    // 3. EP01 "PART 1" Badge
    const epBadgeBuffer = await sharp(baseBuffer)
      .composite([{ input: svgEpBadge, top: 0, left: 0 }])
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer()

    // Write to omnibus/
    fs.writeFileSync(path.join(omnibusDir, c.omniBadgeFilename), omniBadgeBuffer)
    fs.writeFileSync(path.join(omnibusDir, c.textlessFilename), textlessBuffer)
    fs.writeFileSync(path.join(brainDir, `verified_${c.omniBadgeFilename}`), omniBadgeBuffer)

    // Write to EP01/
    fs.writeFileSync(path.join(ep01ThumbDir, c.baseFilename), epBadgeBuffer)
    fs.writeFileSync(path.join(ep01ThumbDir, c.epBadgeFilename), epBadgeBuffer)
    fs.writeFileSync(path.join(ep01ThumbDir, c.textlessFilename), textlessBuffer)
    fs.writeFileSync(path.join(brainDir, `verified_${c.epBadgeFilename}`), epBadgeBuffer)

    console.log(`  ✓ Omnibus 1 - 2: ${(omniBadgeBuffer.length / 1024).toFixed(1)} KB`)
    console.log(`  ✓ Episode 01 PART 1: ${(epBadgeBuffer.length / 1024).toFixed(1)} KB`)
    console.log(`  ✓ Textless: ${(textlessBuffer.length / 1024).toFixed(1)} KB`)
  }

  // Set Master Thumbnail for EP01 to Concept A PART 1
  const masterThumbPath = path.join(ep01ThumbDir, '01_Master_YouTube_Thumbnail_16x9.jpg')
  fs.copyFileSync(path.join(ep01ThumbDir, '01_Thumbnail_Concept_A.jpg'), masterThumbPath)
  console.log('\n⭐ Master thumbnail updated for EP01 (PART 1 Badge)!')

  console.log('\n🎉 Dual-Release Thumbnails Completed Successfully!')
}

run().catch(console.error)
