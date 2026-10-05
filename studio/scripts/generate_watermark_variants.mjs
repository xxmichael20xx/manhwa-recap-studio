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

if (!fs.existsSync(brandMockupsDir)) {
  fs.mkdirSync(brandMockupsDir, { recursive: true })
}

async function renderWatermarkVariant(opacity, label, filename, position = 'top_right') {
  // 1. Load base image & dimensions
  const baseMeta = await sharp(baseImagePath).metadata()
  const width = baseMeta.width
  const height = baseMeta.height

  // 2. Resize logo to 18% of video width (approx 280px for 1080p / 340px for 1920)
  const logoWidth = Math.round(width * 0.16)
  const logoResized = await sharp(logoPath)
    .resize(logoWidth, logoWidth)
    .ensureAlpha()
    .toBuffer()

  // 3. Apply opacity via alpha manipulation
  // Multiply alpha channel by opacity
  const { data, info } = await sharp(logoResized).raw().toBuffer({ resolveWithObject: true })
  for (let i = 3; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * opacity)
  }
  const fadedLogo = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer()

  // 4. Calculate position coordinates
  let top = 40
  let left = width - logoWidth - 40
  if (position === 'center') {
    top = Math.round((height - logoWidth) / 2)
    left = Math.round((width - logoWidth) / 2)
  } else if (position === 'top_left') {
    left = 40
  }

  // 5. Add label badge banner overlay
  const badgeSvg = Buffer.from(
    `<svg width="${width}" height="${height}">
      <rect x="36" y="36" width="220" height="42" rx="10" fill="#0b0f19" fill-opacity="0.85" stroke="#8b5cf6" stroke-width="2"/>
      <text x="146" y="63" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">OPACITY: ${label}</text>
    </svg>`
  )

  const composite = await sharp(baseImagePath)
    .composite([
      { input: fadedLogo, top, left },
      { input: badgeSvg, top: 0, left: 0 }
    ])
    .jpeg({ quality: 95 })
    .toBuffer()

  // Save to artifactDir and brandMockupsDir
  const artifactPath = path.join(artifactDir, filename)
  const brandPath = path.join(brandMockupsDir, filename)
  fs.writeFileSync(artifactPath, composite)
  fs.writeFileSync(brandPath, composite)

  console.log(`✅ Saved ${label} variant to: ${filename}`)
  return composite
}

async function createGridComparison(variants) {
  const meta = await sharp(variants[0]).metadata()
  const w = Math.round(meta.width / 2)
  const h = Math.round(meta.height / 2)

  const resized = await Promise.all(variants.map(v => sharp(v).resize(w, h).toBuffer()))

  const grid = await sharp({
    create: {
      width: w * 2,
      height: h * 2,
      channels: 3,
      background: { r: 11, g: 15, b: 25 }
    }
  })
  .composite([
    { input: resized[0], top: 0, left: 0 },
    { input: resized[1], top: 0, left: w },
    { input: resized[2], top: h, left: 0 },
    { input: resized[3], top: h, left: w }
  ])
  .jpeg({ quality: 95 })
  .toBuffer()

  const gridFilename = '00_Watermark_4_Grid_Comparison.jpg'
  fs.writeFileSync(path.join(artifactDir, gridFilename), grid)
  fs.writeFileSync(path.join(brandMockupsDir, gridFilename), grid)
  console.log('✅ Saved 4-Grid comparison plate.')
}

async function run() {
  const v10 = await renderWatermarkVariant(0.10, '10% (Ultra-Subtle)', 'watermark_variant_10_percent.jpg', 'top_right')
  const v20 = await renderWatermarkVariant(0.20, '20% (Subtle)', 'watermark_variant_20_percent.jpg', 'top_right')
  const v35 = await renderWatermarkVariant(0.35, '35% (Balanced)', 'watermark_variant_35_percent.jpg', 'top_right')
  const v50 = await renderWatermarkVariant(0.50, '50% (Prominent)', 'watermark_variant_50_percent.jpg', 'top_right')

  await createGridComparison([v10, v20, v35, v50])
  console.log('🎉 All watermark visual variants rendered successfully!')
}

run().catch(console.error)
