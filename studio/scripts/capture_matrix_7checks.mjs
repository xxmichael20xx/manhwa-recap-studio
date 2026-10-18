import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs/promises'

async function captureMatrixView() {
  console.log('Running Tier 3 Headless Visual Audit on Prompt Matrix View...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000 })

  const consoleErrors = []
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', err => consoleErrors.push(err.message))

  const targetUrl = 'http://localhost:3100/prompts/Series_04_The_Billion_Year_Sovereign/EP01_The_One_Billion_Year_Awakening_and_The_Broken_Blade'
  console.log(`Navigating to ${targetUrl}...`)
  await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 })
  await new Promise(r => setTimeout(r, 2000))

  const artifactDir = 'C:\\Users\\MIchaelangelo\\.gemini\\antigravity\\brain\\e815df25-9ee0-4e57-bd02-6e8614cfe47c'
  await fs.mkdir(artifactDir, { recursive: true })

  // 1. Capture Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await new Promise(r => setTimeout(r, 500))
  const darkShot = path.join(artifactDir, '01_prompt_matrix_7checks_dark.png')
  await page.screenshot({ path: darkShot, fullPage: false })
  console.log(`Saved Dark Mode screenshot: ${darkShot}`)

  // 2. Capture Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 500))
  const lightShot = path.join(artifactDir, '02_prompt_matrix_7checks_light.png')
  await page.screenshot({ path: lightShot, fullPage: false })
  console.log(`Saved Light Mode screenshot: ${lightShot}`)

  console.log(`Console error count: ${consoleErrors.length}`)
  if (consoleErrors.length > 0) {
    console.warn('Console errors detected:', consoleErrors)
  }

  await browser.close()
  console.log('Tier 3 Audit complete!')
}

captureMatrixView().catch(e => {
  console.error('Tier 3 Audit failed:', e)
  process.exit(1)
})
