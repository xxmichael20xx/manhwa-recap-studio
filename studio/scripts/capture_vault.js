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
  await page.setViewport({ width: 1440, height: 1100 })

  const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/2dc9b386-53b1-4547-8e58-16bd7d053115'

  // Go to Series Detail View
  await page.goto('http://localhost:3100/franchises/Series_03_Transmigrated_Game_Architect', { waitUntil: 'networkidle2' })

  // Click on Tab 2: "2. Character & Item Vault"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const vaultBtn = buttons.find(b => b.textContent.includes('Character & Item Vault'))
    if (vaultBtn) vaultBtn.click()
  })

  await new Promise(r => setTimeout(r, 800))

  // 1. Vault Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await page.screenshot({ path: `${artifactDir}/series03_vault_dark.png` })

  // 2. Vault Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await page.screenshot({ path: `${artifactDir}/series03_vault_light.png` })

  await browser.close()
  console.log('Vault screenshots captured successfully!')
}

run().catch(console.error)
