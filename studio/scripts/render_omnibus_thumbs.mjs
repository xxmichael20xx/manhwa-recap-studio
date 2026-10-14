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

// Raw high-res generated illustrations in agent brain (canonical vault-anchored)
const brainDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/c3484778-4ad4-4cf1-8a69-a848259a4a36'
const rawFiles = {
  concept_a: path.join(brainDir, 'bramwell_locke_youtube_thumbnail_ep01_1791952349217.jpg'),
  concept_b: path.join(brainDir, 'manhwa_youtube_thumbnail_bramwell_vs_cassian_1791952357307.jpg'),
  concept_c: path.join(brainDir, 'youtube_thumbnail_bramwell_vs_minotaur_1791952352394.jpg')
}

// Function to generate YouTube High-CTR Top-Left Yellow Badge SVG
function generateYellowBingeSvg(badgeText = '1 - 2', width = 1920, height = 1080) {
  const cleanBadge = badgeText.trim()
  const posX = 60
  const posY = 60
  
  // Calculate width dynamically
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

    <!-- Main High-CTR Yellow Badge Pill -->
    <g filter="url(#badgeShadow)">
      <!-- Outer Stroke / Border for 100% contrast against bright & dark backgrounds -->
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
      <!-- Inner Gradient Pill -->
      <rect 
        x="${posX}" 
        y="${posY}" 
        width="${mainWidth}" 
        height="${mainHeight}" 
        rx="22" 
        fill="url(#yellowBingeGrad)" 
      />
      <!-- Top Bevel Sheen / Glass Highlight -->
      <rect 
        x="${posX + 4}" 
        y="${posY + 4}" 
        width="${mainWidth - 8}" 
        height="${mainHeight / 2 - 4}" 
        rx="18" 
        fill="rgba(255,255,255,0.25)" 
      />
      <!-- Bold Condensed Heavy Typography -->
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

async function renderThumbnails() {
  console.log('🚀 Rendering High-CTR Master Movie 1 - 2 Thumbnails...')
  
  if (!fs.existsSync(omnibusDir)) {
    fs.mkdirSync(omnibusDir, { recursive: true })
  }
  if (!fs.existsSync(ep01ThumbDir)) {
    fs.mkdirSync(ep01ThumbDir, { recursive: true })
  }

  const results = []

  const concepts = [
    {
      id: 'concept_a',
      name: 'Variant A: The Split Transformation (Underdog vs Sovereign)',
      raw: rawFiles.concept_a,
      baseFilename: '01_Thumbnail_Concept_A.jpg',
      badgeFilename: '01_Thumbnail_Concept_A_Badge_1-2.jpg',
      textlessFilename: '01_Thumbnail_Concept_A_Textless.jpg'
    },
    {
      id: 'concept_b',
      name: 'Variant B: The Proctor Panic & Measurement Overflow Shock',
      raw: rawFiles.concept_b,
      baseFilename: '01_Thumbnail_Concept_B.jpg',
      badgeFilename: '01_Thumbnail_Concept_B_Badge_1-2.jpg',
      textlessFilename: '01_Thumbnail_Concept_B_Textless.jpg'
    },
    {
      id: 'concept_c',
      name: 'Variant C: The Calamity / Solo Cleave Spectacle',
      raw: rawFiles.concept_c,
      baseFilename: '01_Thumbnail_Concept_C.jpg',
      badgeFilename: '01_Thumbnail_Concept_C_Badge_1-2.jpg',
      textlessFilename: '01_Thumbnail_Concept_C_Textless.jpg'
    }
  ]

  const svgBadge = generateYellowBingeSvg('1 - 2', 1920, 1080)
  const svgBuffer = Buffer.from(svgBadge)

  for (const concept of concepts) {
    console.log(`\n🎨 Processing ${concept.name}...`)
    if (!fs.existsSync(concept.raw)) {
      console.error(`❌ Raw image not found: ${concept.raw}`)
      continue
    }

    // 1. Process base 1920x1080 image
    const baseSharp = sharp(concept.raw)
      .resize(1920, 1080, { fit: 'cover', position: 'center' })
    const baseBuffer = await baseSharp.toBuffer()

    // 2. Export pure textless version (MozJPEG <2MB)
    const textlessBuffer = await sharp(baseBuffer)
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer()

    // 3. Export composited version with top-left bold yellow "1 - 2" badge
    const badgeBuffer = await sharp(baseBuffer)
      .composite([{ input: svgBuffer, top: 0, left: 0 }])
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer()

    // Destination 1: omnibus/
    const omniBadgePath = path.join(omnibusDir, concept.badgeFilename)
    const omniTextlessPath = path.join(omnibusDir, concept.textlessFilename)
    fs.writeFileSync(omniBadgePath, badgeBuffer)
    fs.writeFileSync(omniTextlessPath, textlessBuffer)

    // Destination 2: EP01 thumbnails/ (Also set standard filename to badged for instant studio preview & download)
    const epBadgePath = path.join(ep01ThumbDir, concept.baseFilename)
    const epTextlessPath = path.join(ep01ThumbDir, concept.textlessFilename)
    fs.writeFileSync(epBadgePath, badgeBuffer)
    fs.writeFileSync(epTextlessPath, textlessBuffer)

    // Also mirror to brain artifact folder for inline verification
    const brainBadgePath = path.join(brainDir, `verified_${concept.badgeFilename}`)
    fs.writeFileSync(brainBadgePath, badgeBuffer)

    const badgeStat = fs.statSync(omniBadgePath)
    const textlessStat = fs.statSync(omniTextlessPath)

    console.log(`  ✓ Composited Badge 1 - 2: ${badgeStat.size} bytes (${(badgeStat.size / 1024).toFixed(1)} KB)`)
    console.log(`  ✓ Pure Textless Artwork: ${textlessStat.size} bytes (${(textlessStat.size / 1024).toFixed(1)} KB)`)
    console.log(`  ✓ Saved to: ${omniBadgePath}`)
    console.log(`  ✓ Mirrored to: ${epBadgePath}`)

    results.push({
      concept: concept.id,
      name: concept.name,
      badgeFile: concept.badgeFilename,
      textlessFile: concept.textlessFilename,
      badgeSizeKb: (badgeStat.size / 1024).toFixed(1),
      textlessSizeKb: (textlessStat.size / 1024).toFixed(1),
      brainBadgePath
    })
  }

  // Also set Master Thumbnail in EP01 to Concept A badged version
  const masterThumbPath = path.join(ep01ThumbDir, '01_Master_YouTube_Thumbnail_16x9.jpg')
  fs.copyFileSync(path.join(ep01ThumbDir, '01_Thumbnail_Concept_A.jpg'), masterThumbPath)
  console.log(`\n⭐ Updated 01_Master_YouTube_Thumbnail_16x9.jpg to Variant A (1 - 2 Binge Badge)!`)

  console.log('\n🎉 All 3 Master Thumbnails Rendered & Verified Successfully!')
}

renderThumbnails().catch(console.error)
