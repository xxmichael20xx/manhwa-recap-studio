import puppeteer from 'puppeteer-core'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const artifactDir = 'C:\\Users\\MIchaelangelo\\.gemini\\antigravity\\brain\\a15923d5-9703-468a-89fc-70fc7c707d5a'
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function runVisualAudit() {
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
  console.log('Testing Prompt Matrix View (Light Mode)...')
  await page.goto('http://localhost:3100/prompts/Series_01_The_Sovereign_Protocol/EP01_Awakening_and_Catacombs', { waitUntil: 'networkidle2' })
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  })
  await new Promise(r => setTimeout(r, 1200))
  const promptLightPath = path.join(artifactDir, 'prompt_matrix_light_synced.png')
  await page.screenshot({ path: promptLightPath, fullPage: false })

  // 2. Audit Prompt Matrix View (Dark Mode)
  console.log('Testing Prompt Matrix View (Dark Mode)...')
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  })
  await new Promise(r => setTimeout(r, 1200))
  const promptDarkPath = path.join(artifactDir, 'prompt_matrix_dark_synced.png')
  await page.screenshot({ path: promptDarkPath, fullPage: false })

  // 3. Audit Video Studio View (Dark Mode)
  console.log('Testing Video Studio View (Dark Mode)...')
  await page.goto('http://localhost:3100/video/Series_01_The_Sovereign_Protocol/EP01_Awakening_and_Catacombs', { waitUntil: 'networkidle2' })
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  })
  await new Promise(r => setTimeout(r, 1500))
  const videoDarkPath = path.join(artifactDir, 'video_studio_dark_synced.png')
  await page.screenshot({ path: videoDarkPath, fullPage: false })

  // 4. Audit Video Studio View (Light Mode)
  console.log('Testing Video Studio View (Light Mode)...')
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  })
  await new Promise(r => setTimeout(r, 1500))
  const videoLightPath = path.join(artifactDir, 'video_studio_light_synced.png')
  await page.screenshot({ path: videoLightPath, fullPage: false })

  await browser.close()

  console.log('Screenshots captured successfully:')
  console.log('- ' + promptLightPath)
  console.log('- ' + promptDarkPath)
  console.log('- ' + videoLightPath)
  console.log('- ' + videoDarkPath)
  console.log('Console errors encountered:', consoleErrors.length)
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors)
  }
}

runVisualAudit().catch(err => {
  console.error('Audit failed:', err)
  process.exit(1)
})
