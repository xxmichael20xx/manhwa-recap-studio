import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/b921dd4a-52d9-4036-82c0-17141d97df17'

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
  await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 2 })

  await page.goto('http://localhost:3100/franchises/Series_02_The_Omniscient_Dungeon_Sovereign', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1500))

  // Click Tab 4: YouTube Launchpad
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const tab4 = btns.find(b => b.textContent.includes('YouTube Launchpad') || b.textContent.includes('Release Kit'))
    if (tab4) tab4.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // Scroll to titles
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Title Archetypes'))
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
  await new Promise(r => setTimeout(r, 500))

  // Capture Dark Mode
  await page.screenshot({ path: path.join(artifactDir, 'launchpad_10_titles_dark.png'), fullPage: false })

  // Toggle to Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 500))

  // Capture Light Mode
  await page.screenshot({ path: path.join(artifactDir, 'launchpad_10_titles_light.png'), fullPage: false })

  // Split-screen responsive width (780px)
  await page.setViewport({ width: 780, height: 1000, deviceScaleFactor: 2 })
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({ path: path.join(artifactDir, 'launchpad_10_titles_splitscreen.png'), fullPage: false })

  await browser.close()
  console.log('Launchpad dual-theme and split-screen screenshots captured successfully!')
}

capture().catch(err => {
  console.error('Capture error:', err)
  process.exit(1)
})
