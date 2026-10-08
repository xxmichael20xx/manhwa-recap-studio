import puppeteer from 'puppeteer-core'
import path from 'path'

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const outDir = 'C:\\Users\\MIchaelangelo\\.gemini\\antigravity\\brain\\bade8f56-08a3-4a62-9ef0-e0b3c45f66a1'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    defaultViewport: { width: 1440, height: 1100 }
  })
  const page = await browser.newPage()
  
  await page.goto('http://localhost:3100/video/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_FRank_Awakening_and_The_Plunderers_Bow', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 2000))

  // Click Stage 3 Tab
  const buttons = await page.$$('button')
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text && text.includes('Stage 3: FFmpeg Compilation')) {
      await btn.click()
      break
    }
  }
  await new Promise(r => setTimeout(r, 1500))

  // Scroll <main> completely to the bottom to focus on Shorts Studio card
  await page.evaluate(() => {
    const main = document.querySelector('main')
    if (main) main.scrollTop = main.scrollHeight
  })
  await new Promise(r => setTimeout(r, 1000))

  // Dark Mode Screenshot
  await page.screenshot({ path: path.join(outDir, 'shorts_studio_dark.png'), fullPage: false })

  // Switch to Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({ path: path.join(outDir, 'shorts_studio_light.png'), fullPage: false })

  await browser.close()
  console.log('Screenshots captured successfully!')
}

run().catch(console.error)
