import fs from 'fs'
import path from 'path'
import puppeteerCore from 'puppeteer-core'

const edgePaths = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
]
const browserExe = edgePaths.find(p => fs.existsSync(p))

async function run() {
  const browser = await puppeteerCore.launch({
    executablePath: browserExe,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1100 })

  const artifactsDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/425b19b0-3cce-44b2-9067-511ba7c4c2bf'

  // 1. Capture Prompt Matrix Hub
  const promptUrl = 'http://localhost:3100/prompts/Series_01_The_Singularity_Protocol/EP01_The_Double_FRank_Anomaly'
  console.log('Navigating to Prompt Matrix Hub:', promptUrl)
  await page.goto(promptUrl, { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 1200))

  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await new Promise(r => setTimeout(r, 400))
  const promptDarkPath = path.join(artifactsDir, 'prompt_hub_multipanel_dark.png')
  await page.screenshot({ path: promptDarkPath, fullPage: false })

  // 2. Capture Studio View (with Multi-Panel Prompts on Scene Cards)
  const studioUrl = 'http://localhost:3100/video/Series_01_The_Singularity_Protocol/EP01_The_Double_FRank_Anomaly'
  console.log('Navigating to Studio:', studioUrl)
  await page.goto(studioUrl, { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 1200))

  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
    const main = document.querySelector('main')
    if (main) main.scrollTop = 900
  })
  await new Promise(r => setTimeout(r, 400))
  const studioDarkPath = path.join(artifactsDir, 'studio_multipanel_deck_dark.png')
  await page.screenshot({ path: studioDarkPath, fullPage: false })

  await browser.close()
  console.log('Verification screenshots captured successfully!')
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err)
  process.exit(1)
})
