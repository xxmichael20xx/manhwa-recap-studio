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
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 })

  // 1. Capture VideoStudioView (Dark Mode) - Vault Cards
  await page.goto('http://localhost:3100/video/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_Double_FRank_Anomaly_and_Awakening', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1500))

  // Scroll to Vault section
  await page.evaluate(() => {
    const vaultHeader = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Franchise Character & Item Vault'))
    if (vaultHeader) vaultHeader.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: path.join(artifactDir, 'vault_studio_dark.png'), fullPage: false })

  // 2. Capture VideoStudioView (Light Mode)
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 400))
  await page.screenshot({ path: path.join(artifactDir, 'vault_studio_light.png'), fullPage: false })

  // Restore dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })

  // 3. Capture PromptMatrixView (Dark Mode) with Vault Drawer open
  await page.goto('http://localhost:3100/prompts/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_Double_FRank_Anomaly_and_Awakening', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1500))

  // Click "Character & Item Vault" button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const vaultBtn = btns.find(b => b.textContent.includes('Character & Item Vault'))
    if (vaultBtn) vaultBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: path.join(artifactDir, 'vault_drawer_dark.png'), fullPage: false })

  // 4. Capture PromptMatrixView (Light Mode) with Vault Drawer open
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 400))
  await page.screenshot({ path: path.join(artifactDir, 'vault_drawer_light.png'), fullPage: false })

  await browser.close()
  console.log('Vault screenshots captured successfully in Dark and Light modes!')
}

capture().catch(err => {
  console.error('Capture error:', err)
  process.exit(1)
})
