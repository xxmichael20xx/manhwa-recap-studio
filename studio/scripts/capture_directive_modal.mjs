import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/e7a1ab76-cbc2-41b1-9994-2ba09b6852a3'

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
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })

  // 1. PromptMatrixView - Dark Mode with Modal Open
  await page.goto('http://localhost:3100/prompts/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_Double_FRank_Anomaly_and_Awakening', { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await new Promise(r => setTimeout(r, 1200))

  // Click the Flow Instructions button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const flowBtn = buttons.find(b => b.textContent.includes('Flow Instructions'))
    if (flowBtn) flowBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: path.join(artifactDir, 'flow_directive_dark.png') })

  // 2. Light Mode with Modal Open
  await page.evaluate(() => document.documentElement.classList.remove('dark'))
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: path.join(artifactDir, 'flow_directive_light.png') })

  await browser.close()
  console.log('✅ Flow Directive screenshots captured successfully.')
}

capture().catch(console.error)
