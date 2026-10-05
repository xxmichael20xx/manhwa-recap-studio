import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const baseImagePath = 'C:/Users/MIchaelangelo/Downloads/Batch A - New/IMG_001.jpg_20261005111648.jpg'
const logoPath = path.resolve(projectRoot, 'assets/brand/recap_runic_logo_transparent.png')
const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/e7a1ab76-cbc2-41b1-9994-2ba09b6852a3'
const brandMockupsDir = 'C:/Users/MIchaelangelo/Documents/My Brand/00_Brand Identity & Assets/Mockups'

async function generatePlacements() {
  const baseMeta = await sharp(baseImagePath).metadata()
  const width = baseMeta.width
  const height = baseMeta.height
  console.log(`Base Image: ${width}x${height}`)

  const logoSize = Math.round(width * 0.13)
  console.log(`Logo Size: ${logoSize}x${logoSize}`)

  const logoResized = await sharp(logoPath)
    .resize(logoSize, logoSize)
    .ensureAlpha()
    .toBuffer()

  const { data, info } = await sharp(logoResized).raw().toBuffer({ resolveWithObject: true })
  for (let i = 3; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * 0.20)
  }
  const fadedLogo20 = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer()

  // 1. User's exact coordinates: X = 65% from left, Y = 25% from bottom
  const userX = Math.round(width * 0.65 - logoSize / 2)
  const userY = Math.round(height - (height * 0.25) - logoSize / 2)

  const userPlacementSvg = Buffer.from(
    `<svg width="${width}" height="${height}">
      <!-- Coordinate guides -->
      <line x1="${width * 0.65}" y1="0" x2="${width * 0.65}" y2="${height}" stroke="#06b6d4" stroke-width="2" stroke-dasharray="10,6" opacity="0.5"/>
      <line x1="0" y1="${height * 0.75}" x2="${width}" y2="${height * 0.75}" stroke="#06b6d4" stroke-width="2" stroke-dasharray="10,6" opacity="0.5"/>
      
      <!-- Coordinate crosshair indicator -->
      <circle cx="${width * 0.65}" cy="${height * 0.75}" r="8" fill="#06b6d4" stroke="#ffffff" stroke-width="2"/>
      
      <!-- Subtitle safe zone bar at bottom -->
      <rect x="${width * 0.2}" y="${height - 90}" width="${width * 0.6}" height="50" rx="8" fill="#000000" fill-opacity="0.5" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6,4"/>
      <text x="${width * 0.5}" y="${height - 60}" font-family="sans-serif" font-size="14" font-weight="bold" fill="#fbbf24" text-anchor="middle">SUBTITLE SAFE ZONE (Clean &amp; Unobstructed)</text>

      <!-- Label Card -->
      <rect x="36" y="36" width="500" height="46" rx="10" fill="#0b0f19" fill-opacity="0.85" stroke="#06b6d4" stroke-width="2"/>
      <text x="286" y="65" font-family="sans-serif" font-size="15" font-weight="bold" fill="#38bdf8" text-anchor="middle">YOUR SELECTION: X=65% Left | Y=25% from Bottom (20% Opacity)</text>
    </svg>`
  )

  const userComp = await sharp(baseImagePath)
    .composite([
      { input: fadedLogo20, top: userY, left: userX },
      { input: userPlacementSvg, top: 0, left: 0 }
    ])
    .jpeg({ quality: 95 })
    .toBuffer()

  fs.writeFileSync(path.join(artifactDir, '01_Watermark_Placement_User_65_25.jpg'), userComp)
  fs.writeFileSync(path.join(brandMockupsDir, '01_Watermark_Placement_User_65_25.jpg'), userComp)
  console.log('✅ User exact placement saved.')

  // 2. Comparison Grid of 4 Placements
  async function makeMini(top, left, label) {
    const clampLeft = Math.max(10, Math.min(left, width - logoSize - 10))
    const clampTop = Math.max(10, Math.min(top, height - logoSize - 10))
    
    const svg = Buffer.from(
      `<svg width="${width}" height="${height}">
        <rect x="36" y="36" width="460" height="46" rx="10" fill="#0b0f19" fill-opacity="0.85" stroke="#8b5cf6" stroke-width="2"/>
        <text x="266" y="65" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">${label}</text>
      </svg>`
    )
    const baseWithLogo = await sharp(baseImagePath)
      .composite([
        { input: fadedLogo20, top: clampTop, left: clampLeft },
        { input: svg, top: 0, left: 0 }
      ])
      .jpeg({ quality: 90 })
      .toBuffer()

    return sharp(baseWithLogo).resize(Math.round(width / 2), Math.round(height / 2)).toBuffer()
  }

  const pA = await makeMini(userY, userX, 'A: Your Spec (X=65%, Y=25% Btm)')
  const pB = await makeMini(40, width - logoSize - 40, 'B: Top-Right (X=82%, Y=6% Top)')
  const pC = await makeMini(height - logoSize - 60, width - logoSize - 40, 'C: Bottom-Right (X=82%, Y=12% Btm)')
  const pD = await makeMini(Math.round(height * 0.40), Math.round(width * 0.68), 'D: Mid-Right Float (X=68%, Y=40%)')

  const halfW = Math.round(width / 2)
  const halfH = Math.round(height / 2)

  const compGrid = await sharp({
    create: {
      width: halfW * 2,
      height: halfH * 2,
      channels: 3,
      background: { r: 11, g: 15, b: 25 }
    }
  })
  .composite([
    { input: pA, top: 0, left: 0 },
    { input: pB, top: 0, left: halfW },
    { input: pC, top: halfH, left: 0 },
    { input: pD, top: halfH, left: halfW }
  ])
  .jpeg({ quality: 95 })
  .toBuffer()

  fs.writeFileSync(path.join(artifactDir, '02_Watermark_Placement_Options_Grid.jpg'), compGrid)
  fs.writeFileSync(path.join(brandMockupsDir, '02_Watermark_Placement_Options_Grid.jpg'), compGrid)

  console.log('✅ Generated all placement visual mockups successfully.')
}

generatePlacements().catch(console.error)
