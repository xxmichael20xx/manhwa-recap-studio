import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/e815df25-9ee0-4e57-bd02-6e8614cfe47c'

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
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 })

  const consoleErrors = []
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', err => consoleErrors.push(err.message))

  const targetUrl = 'http://localhost:3100/prompts/Series_04_The_Billion_Year_Sovereign/EP01_The_One_Billion_Year_Awakening_and_The_Broken_Blade'
  await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 })
  await new Promise(r => setTimeout(r, 2000))

  // Open Batch Dispatch Drawer
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const drawerBtn = buttons.find(b => b.textContent && b.textContent.includes('Dispatch Drawer'))
    if (drawerBtn) drawerBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // 1. Dark Mode
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: path.join(artifactDir, '01_prompt_matrix_9checks_dark.png') })

  // 2. Light Mode
  await page.evaluate(() => document.documentElement.classList.remove('dark'))
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: path.join(artifactDir, '02_prompt_matrix_9checks_light.png') })

  console.log(`Console error count: ${consoleErrors.length}`)
  if (consoleErrors.length > 0) {
    console.warn('Console errors detected:', consoleErrors)
  }

  await browser.close()
  console.log('✅ 9-check Dispatch Drawer screenshots captured successfully.')
}

capture().catch(console.error)
