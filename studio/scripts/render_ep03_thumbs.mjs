import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const studioRoot = path.resolve(__dirname, '..')
const projectRoot = path.resolve(studioRoot, '..')
const franchiseDir = path.join(projectRoot, '01_Franchises', 'Series_04_The_Billion_Year_Sovereign')
const ep01ThumbDir = path.join(franchiseDir, 'EP01_The_One_Billion_Year_Awakening_and_The_Broken_Blade', 'thumbnails')
const ep03ThumbDir = path.join(franchiseDir, 'EP03_The_Campus_Lockdown_and_The_Impostor_Sovereign', 'thumbnails')

function generateYellowBadgeSvg(badgeText = '1 - 3', width = 1920, height = 1080) {
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

async function renderThumbnails() {
  console.log('Rendering EP03 Thumbnails (Upload 3 Badge "1 - 3" and Standalone Badge "PART 3")...')

  if (!fs.existsSync(ep03ThumbDir)) fs.mkdirSync(ep03ThumbDir, { recursive: true })

  const concepts = [
    {
      id: 'concept_a',
      name: 'Variant A: The Split Transformation',
      src: path.join(ep01ThumbDir, '01_Thumbnail_Concept_A_Textless.jpg'),
      badgePrefix: '01_Thumbnail_Concept_A'
    },
    {
      id: 'concept_b',
      name: 'Variant B: The Proctor & Enforcer Shock',
      src: path.join(ep01ThumbDir, '01_Thumbnail_Concept_B_Textless.jpg'),
      badgePrefix: '01_Thumbnail_Concept_B'
    },
    {
      id: 'concept_c',
      name: 'Variant C: The Solo Cleave / Master Thumbnail',
      src: path.join(ep01ThumbDir, '01_Thumbnail_Concept_C_Textless.jpg'),
      badgePrefix: '01_Thumbnail_Concept_C'
    }
  ]

  for (const c of concepts) {
    if (!fs.existsSync(c.src)) {
      console.warn(`Source textless image not found for ${c.id}: ${c.src}`)
      continue
    }

    // 1. Textless copy
    const textlessDest = path.join(ep03ThumbDir, `${c.badgePrefix}_Textless.jpg`)
    fs.copyFileSync(c.src, textlessDest)

    // 2. Accumulative Badge "1 - 3"
    const svgBadge1_3 = Buffer.from(generateYellowBadgeSvg('1 - 3'))
    const badge1_3Path = path.join(ep03ThumbDir, `${c.badgePrefix}_Badge_1_3.jpg`)
    await sharp(c.src)
      .composite([{ input: svgBadge1_3, top: 0, left: 0 }])
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(badge1_3Path)
    console.log(`Rendered: ${badge1_3Path}`)

    // 3. Standalone Badge "PART 3"
    const svgBadgePart3 = Buffer.from(generateYellowBadgeSvg('PART 3'))
    const badgePart3Path = path.join(ep03ThumbDir, `${c.badgePrefix}_Badge_Part3.jpg`)
    await sharp(c.src)
      .composite([{ input: svgBadgePart3, top: 0, left: 0 }])
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(badgePart3Path)
    console.log(`Rendered: ${badgePart3Path}`)

    // 4. If Concept C (Master Winning Concept), write to 01_Master_YouTube_Thumbnail_16x9.jpg
    if (c.id === 'concept_c') {
      const masterPath = path.join(ep03ThumbDir, '01_Master_YouTube_Thumbnail_16x9.jpg')
      fs.copyFileSync(badge1_3Path, masterPath)
      console.log(`Updated Master Thumbnail: ${masterPath}`)
      const conceptCPath = path.join(ep03ThumbDir, '01_Thumbnail_Concept_C.jpg')
      fs.copyFileSync(badge1_3Path, conceptCPath)
    }
  }

  console.log('EP03 Thumbnail Generation Complete!')
}

renderThumbnails().catch(err => {
  console.error('Thumbnail render error:', err)
  process.exit(1)
})
