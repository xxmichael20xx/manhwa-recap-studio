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

async function renderMotionPreview() {
  const baseMeta = await sharp(baseImagePath).metadata()
  const width = baseMeta.width
  const height = baseMeta.height

  const logoWidth = Math.round(width * 0.14)
  const logoResized = await sharp(logoPath)
    .resize(logoWidth, logoWidth)
    .ensureAlpha()
    .toBuffer()

  // Function to get faded buffer
  async function getFaded(opacity) {
    const { data, info } = await sharp(logoResized).raw().toBuffer({ resolveWithObject: true })
    for (let i = 3; i < data.length; i += 4) {
      data[i] = Math.round(data[i] * opacity)
    }
    return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer()
  }

  const logo10 = await getFaded(0.12)
  const logo18 = await getFaded(0.20)
  const logo25 = await getFaded(0.30)

  // Motion path overlay with cyan glow trail arrows
  const motionOverlaySvg = Buffer.from(
    `<svg width="${width}" height="${height}">
      <!-- Motion vector arrow 1 -->
      <path d="M 120 160 Q ${width * 0.5} 80 ${width - 160} 140" fill="none" stroke="#06b6d4" stroke-width="3" stroke-dasharray="12,8" opacity="0.6"/>
      <!-- Motion vector arrow 2 -->
      <path d="M ${width - 160} 140 Q ${width * 0.6} ${height * 0.7} 180 ${height * 0.65}" fill="none" stroke="#a855f7" stroke-width="3" stroke-dasharray="12,8" opacity="0.6"/>
      
      <!-- Badges for motion points -->
      <rect x="36" y="36" width="340" height="42" rx="10" fill="#0b0f19" fill-opacity="0.85" stroke="#06b6d4" stroke-width="2"/>
      <text x="206" y="63" font-family="sans-serif" font-size="15" font-weight="bold" fill="#38bdf8" text-anchor="middle">DYNAMIC 2D DRIFT / RUNNING TRAIL</text>
    </svg>`
  )

  const composite = await sharp(baseImagePath)
    .composite([
      { input: motionOverlaySvg, top: 0, left: 0 },
      { input: logo10, top: 120, left: 100 },
      { input: logo18, top: 70, left: Math.round(width * 0.45) },
      { input: logo25, top: 100, left: width - logoWidth - 100 }
    ])
    .jpeg({ quality: 95 })
    .toBuffer()

  const outName = 'watermark_motion_running_preview.jpg'
  fs.writeFileSync(path.join(artifactDir, outName), composite)
  fs.writeFileSync(path.join(brandMockupsDir, outName), composite)
  console.log('✅ Saved motion running trail preview.')
}

renderMotionPreview().catch(console.error)
