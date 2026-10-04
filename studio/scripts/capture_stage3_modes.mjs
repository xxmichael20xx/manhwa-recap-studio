import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/b7a3defd-c5b8-4146-abc2-fe6a612fd509'

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
]
const executablePath = edgePaths.find(p => fs.existsSync(p))

async function capture() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 2 })

  await page.goto('http://localhost:3100/video/Series_01_The_Singularity_Protocol/EP01_The_Double_FRank_Anomaly', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1500))

  // Find the Stage 3 button and click it
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const stage3Btn = btns.find(b => b.textContent.includes('Stage 3: FFmpeg Compilation'))
    if (stage3Btn) stage3Btn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // 1. Click "Auto-Queue & Stitch" mode pill
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const autoBtn = btns.find(b => b.textContent.includes('Auto-Queue & Stitch'))
    if (autoBtn) autoBtn.click()
  })
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: path.join(artifactDir, 'auto_queue_mode_dark.png'), fullPage: false })

  // 2. Click "Stitch Batches (<3s)" mode pill
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const stitchBtn = btns.find(b => b.textContent.includes('Stitch Batches'))
    if (stitchBtn) stitchBtn.click()
  })
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: path.join(artifactDir, 'stitch_batches_mode_dark.png'), fullPage: false })

  await browser.close()
  console.log('Mode screenshots captured successfully!')
}

capture().catch(err => {
  console.error('Capture error:', err)
  process.exit(1)
})
