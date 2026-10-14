import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/c3484778-4ad4-4cf1-8a69-a848259a4a36'

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
  await page.setViewport({ width: 1400, height: 1100, deviceScaleFactor: 2 })

  await page.goto('http://localhost:3100/franchises/Series_03_Transmigrated_Game_Architect', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1500))

  // 1. Capture Compiler Tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const tab3 = btns.find(b => b.textContent.includes('Multi-Episode') || b.textContent.includes('Compiler'))
    if (tab3) tab3.click()
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: path.join(artifactDir, 'compiler_video_guard_dark.png'), fullPage: false })

  // 2. Click Tab 4: YouTube Launchpad
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const tab4 = btns.find(b => b.textContent.includes('YouTube Launchpad') || b.textContent.includes('Release Kit'))
    if (tab4) tab4.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  // Select Master Omnibus in dropdown
  await page.evaluate(() => {
    const select = document.querySelector('select')
    if (select) {
      select.value = 'omnibus_master'
      select.dispatchEvent(new Event('change'))
    }
  })
  await new Promise(r => setTimeout(r, 1200))

  // Scroll to thumbnail showcase section
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Thumbnail Showcase'))
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
  await new Promise(r => setTimeout(r, 600))

  // Dark Mode Screenshot of Thumbnails section
  await page.screenshot({ path: path.join(artifactDir, 'canonical_thumbnails_1-2_dark.png'), fullPage: false })

  // Toggle to Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 500))

  // Light Mode Screenshot
  await page.screenshot({ path: path.join(artifactDir, 'canonical_thumbnails_1-2_light.png'), fullPage: false })

  await browser.close()
  console.log('Dual-theme canonical omnibus thumbnail screenshots captured successfully!')
}

capture().catch(err => {
  console.error('Capture error:', err)
  process.exit(1)
})
