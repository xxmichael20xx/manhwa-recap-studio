import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs/promises'

async function checkPromptMatrixUI() {
  console.log('Connecting to browser to audit Prompt Matrix UI...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const url = 'http://localhost:3100/prompts/Series_04_The_Billion_Year_Sovereign/EP03_The_Campus_Lockdown_and_The_Impostor_Sovereign'
  console.log('Navigating to:', url)
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })
  await new Promise(r => setTimeout(r, 2000))

  // Check if warning banner is visible
  const warningBanner = await page.evaluate(() => {
    return document.body.innerText.includes('Prompt Matrix Copying Locked')
  })
  console.log('Warning banner present:', warningBanner)

  // Open Batch Dispatch Hub drawer: find button with text "Batch Dispatch Hub"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const btn = buttons.find(b => b.innerText.includes('Batch Dispatch Hub'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  await fs.mkdir('dist/audit', { recursive: true })
  const shotPath = path.resolve('dist/audit/batch_dispatch_hub_100_percent.png')
  await page.screenshot({ path: shotPath, fullPage: false })
  console.log('Saved screenshot to:', shotPath)

  const drawerStatus = await page.evaluate(() => {
    return document.body.innerText.match(/100%\s*Production\s*Ready/i)?.[0] || 'Not found'
  })
  console.log('Drawer Audit Status:', drawerStatus)

  await browser.close()
  console.log('Audit check complete!')
}

checkPromptMatrixUI().catch(err => {
  console.error('Audit failed:', err)
  process.exit(1)
})
