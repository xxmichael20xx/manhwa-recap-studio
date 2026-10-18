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

  // 1. PromptMatrixView - Dark Mode with Flow Instructions Modal Open
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await new Promise(r => setTimeout(r, 800))

  // Click the Flow Instructions button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const flowBtn = buttons.find(b => b.textContent && b.textContent.includes('Flow Instructions'))
    if (flowBtn) flowBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: path.join(artifactDir, 'flow_instructions_modal_dark.png') })

  // 2. Light Mode with Flow Instructions Modal Open
  await page.evaluate(() => document.documentElement.classList.remove('dark'))
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: path.join(artifactDir, 'flow_instructions_modal_light.png') })

  // 3. Switch to Tier 2: Batch Header tab inside Modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const tier2Btn = buttons.find(b => b.textContent && b.textContent.includes('Tier 2: Batch Header'))
    if (tier2Btn) tier2Btn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: path.join(artifactDir, 'flow_batch_header_modal_light.png') })

  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: path.join(artifactDir, 'flow_batch_header_modal_dark.png') })

  // 4. Close Modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const closeBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'Close')
    if (closeBtn) closeBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))

  // 5. Open Batch Dispatch Drawer
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const drawerBtn = buttons.find(b => b.textContent && b.textContent.includes('Dispatch Drawer'))
    if (drawerBtn) drawerBtn.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: path.join(artifactDir, 'flow_batch_drawer_dark.png') })

  await page.evaluate(() => document.documentElement.classList.remove('dark'))
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: path.join(artifactDir, 'flow_batch_drawer_light.png') })

  console.log(`Console error count: ${consoleErrors.length}`)
  if (consoleErrors.length > 0) {
    console.warn('Console errors detected:', consoleErrors)
  }

  await browser.close()
  console.log('✅ Flow Instructions modal & Dispatch Drawer screenshots captured successfully.')
}

capture().catch(console.error)
