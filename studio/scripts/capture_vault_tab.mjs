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
  const franchiseUrl = 'http://localhost:3100/franchises/Series_04_The_Billion_Year_Sovereign'
  await page.goto(franchiseUrl, { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 1500))

  // Switch to Tab 2: Character & Item Vault (13)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const tabBtn = buttons.find(b => b.textContent.includes('Character & Item Vault'))
    if (tabBtn) tabBtn.click()
  })
  await new Promise(r => setTimeout(r, 1500))

  // Dark Mode All Models
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/series04_vault_tab_dark.png` })
  console.log('✓ Captured series04_vault_tab_dark.png')

  // Filter to EP02 (12 models)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const ep2Btn = buttons.find(b => b.textContent.includes('EP02') || b.textContent.includes('Episode 2'))
    if (ep2Btn) ep2Btn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/series04_vault_tab_ep02_filtered.png` })
  console.log('✓ Captured series04_vault_tab_ep02_filtered.png')

  // Light Mode All Models
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const allBtn = buttons.find(b => b.textContent.includes('All (13)') || b.textContent.trim() === 'All')
    if (allBtn) allBtn.click()
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/series04_vault_tab_light.png` })
  console.log('✓ Captured series04_vault_tab_light.png')

  await browser.close()
  console.log('Vault tab screenshots captured successfully!')
}

run().catch(err => {
  console.error('Capture Error:', err)
  process.exit(1)
})
