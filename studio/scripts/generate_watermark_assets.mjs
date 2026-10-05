import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const inputPath = path.resolve(projectRoot, 'assets/brand/recap_runic_logo.jpg')
const outputPath = path.resolve(projectRoot, 'assets/brand/recap_runic_logo_transparent.png')

async function processLogo() {
  const metadata = await sharp(inputPath).metadata()
  const width = metadata.width
  const height = metadata.height

  // Create circular mask tailored to the outer runic rim
  const radius = width * 0.48
  const cx = width / 2
  const cy = height / 2
  
  const circleMask = Buffer.from(
    `<svg width="${width}" height="${height}">
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="50%">
          <stop offset="90%" stop-color="white" stop-opacity="1"/>
          <stop offset="97%" stop-color="white" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#grad)" />
    </svg>`
  )

  await sharp(inputPath)
    .ensureAlpha()
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toFile(outputPath)

  console.log('✅ Transparent circular logo created at:', outputPath)
}

processLogo().catch(console.error)
