import puppeteer from 'puppeteer-core'
import fs from 'fs'

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 950 })

  const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/e815df25-9ee0-4e57-bd02-6e8614cfe47c'

  // =========================================================================
  // VIEW 1: Series 04 Franchise Hub (SeriesDetailView)
  // Proves: 13 Total Models, EP01=11, EP02=12, real VO runtimes (21m 46s / 37m 52s),
  // dynamic aspect ratio plates, zero % Anti-Slop, zero WPM estimates
  // =========================================================================
  const franchiseUrl = 'http://localhost:3100/franchises/Series_04_The_Billion_Year_Sovereign'
  console.log('Navigating to Franchise Hub:', franchiseUrl)
  await page.goto(franchiseUrl, { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 2000))

  // Franchise Hub Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/series04_franchise_hub_dark.png` })
  console.log('✓ Captured series04_franchise_hub_dark.png')

  // Franchise Hub Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/series04_franchise_hub_light.png` })
  console.log('✓ Captured series04_franchise_hub_light.png')

  // Click on Episode 2 Filter in Character Vault
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const ep2Btn = buttons.find(b => b.textContent.includes('EP02') || b.textContent.includes('Episode 2'))
    if (ep2Btn) ep2Btn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/series04_vault_ep02_filtered.png` })
  console.log('✓ Captured series04_vault_ep02_filtered.png')

  // =========================================================================
  // VIEW 2: EP02 Visual Prompt Matrix Hub (PromptMatrixView)
  // Proves: Clean 216 scenes, 12 plates in drawer, zero UUID buttons, dynamic format
  // =========================================================================
  const matrixUrl = 'http://localhost:3100/prompts/Series_04_The_Billion_Year_Sovereign/EP02_The_Campus_Appraisal_and_The_Celestial_Countdown'
  console.log('Navigating to EP02 Prompt Matrix:', matrixUrl)
  await page.goto(matrixUrl, { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 2000))

  // Open Vault Drawer (showing 12 reference plates, zero UUID buttons)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const vaultBtn = buttons.find(b => b.textContent.includes('Plates') || b.textContent.includes('Reference') || b.textContent.includes('Vault'))
    if (vaultBtn) vaultBtn.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  // Dark Mode Vault Drawer
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/ep02_vault_drawer_dark.png` })
  console.log('✓ Captured ep02_vault_drawer_dark.png')

  // Light Mode Vault Drawer
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/ep02_vault_drawer_light.png` })
  console.log('✓ Captured ep02_vault_drawer_light.png')

  await browser.close()
  console.log('All holistic verification screenshots captured successfully!')
}

run().catch(err => {
  console.error('Capture Error:', err)
  process.exit(1)
})
