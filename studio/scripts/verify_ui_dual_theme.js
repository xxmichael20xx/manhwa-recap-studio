import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs/promises'

async function verifyUIDualTheme() {
  console.log('Running Tier 3 Headless Visual & Interactive Audit (Light & Dark)...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const consoleErrors = []
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', err => consoleErrors.push(err.message))

  // 1. Visit Studio Video Studio View
  await page.goto('http://localhost:3100/#/studio/video', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1000))

  await fs.mkdir('dist/audit', { recursive: true })

  // Capture Dark Mode
  const darkShot = path.resolve('dist/audit/video_studio_dark.png')
  await page.screenshot({ path: darkShot, fullPage: false })
  console.log(`Saved Dark Mode visual proof to ${darkShot}`)

  // Switch to Light Mode by toggling html class
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 500))

  // Capture Light Mode
  const lightShot = path.resolve('dist/audit/video_studio_light.png')
  await page.screenshot({ path: lightShot, fullPage: false })
  console.log(`Saved Light Mode visual proof to ${lightShot}`)

  console.log(`Console error count: ${consoleErrors.length}`)
  if (consoleErrors.length > 0) {
    console.warn('Console errors detected:', consoleErrors)
  }

  await browser.close()
  console.log('Tier 3 Headless Audit complete!')
}

verifyUIDualTheme().catch(e => {
  console.error('Tier 3 Audit failed:', e)
  process.exit(1)
})
