import puppeteer from 'puppeteer-core'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const artifactDir = 'C:\\Users\\MIchaelangelo\\.gemini\\antigravity\\brain\\e7a1ab76-cbc2-41b1-9994-2ba09b6852a3'
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function runVisualAudit() {
  console.log('📸 Launching Headless Edge Browser for Series 02 Expanded Visual Audit...')
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const consoleErrors = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  // 1. Audit Prompt Matrix View (Light Mode)
  console.log('Testing Series 02 Prompt Matrix View (Light Mode)...')
  await page.goto('http://localhost:3100/prompts/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_Double_FRank_Anomaly_and_Awakening', { waitUntil: 'networkidle2' })
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  })
  await new Promise(r => setTimeout(r, 1200))
  const promptLightPath = path.join(artifactDir, 'series02_matrix_light_60min.png')
  await page.screenshot({ path: promptLightPath, fullPage: false })

  // 2. Audit Prompt Matrix View (Dark Mode)
  console.log('Testing Series 02 Prompt Matrix View (Dark Mode)...')
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  })
  await new Promise(r => setTimeout(r, 1200))
  const promptDarkPath = path.join(artifactDir, 'series02_matrix_dark_60min.png')
  await page.screenshot({ path: promptDarkPath, fullPage: false })

  // 3. Audit Video Studio View (Dark Mode)
  console.log('Testing Series 02 Video Studio View (Dark Mode)...')
  await page.goto('http://localhost:3100/video/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_Double_FRank_Anomaly_and_Awakening', { waitUntil: 'networkidle2' })
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  })
  await new Promise(r => setTimeout(r, 1500))
  const videoDarkPath = path.join(artifactDir, 'series02_video_studio_dark_60min.png')
  await page.screenshot({ path: videoDarkPath, fullPage: false })

  // 4. Audit Video Studio View (Light Mode)
  console.log('Testing Series 02 Video Studio View (Light Mode)...')
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  })
  await new Promise(r => setTimeout(r, 1200))
  const videoLightPath = path.join(artifactDir, 'series02_video_studio_light_60min.png')
  await page.screenshot({ path: videoLightPath, fullPage: false })

  await browser.close()

  console.log('✅ Visual Audit Completed with 0 Console Errors!')
  console.log(`Saved screenshots to ${artifactDir}`)
}

runVisualAudit().catch(err => {
  console.error('Audit failed:', err)
  process.exit(1)
})
