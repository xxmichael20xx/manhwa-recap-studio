import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/b7a3defd-c5b8-4146-abc2-fe6a612fd509'

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
  await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 2 })

  await page.goto('http://localhost:3100/video/Series_01_The_Singularity_Protocol/EP01_The_Double_FRank_Anomaly', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 1500))

  // Click Stage 4 tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const stage4Btn = btns.find(b => b.textContent.includes('Stage 4: YouTube Launchpad'))
    if (stage4Btn) stage4Btn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  // Capture Dark Mode
  await page.screenshot({ path: path.join(artifactDir, 'stage4_youtube_titles_dark.png'), fullPage: false })

  // Toggle to Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 600))

  // Capture Light Mode
  await page.screenshot({ path: path.join(artifactDir, 'stage4_youtube_titles_light.png'), fullPage: false })

  await browser.close()
  console.log('Stage 4 YouTube titles dual-theme screenshots captured successfully!')
}

capture().catch(err => {
  console.error('Capture error:', err)
  process.exit(1)
})
