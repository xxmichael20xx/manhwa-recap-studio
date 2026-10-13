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
  await page.setViewport({ width: 1440, height: 900 })

  const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/2dc9b386-53b1-4547-8e58-16bd7d053115'

  // 1. Dashboard Light Mode
  await page.goto('http://localhost:3100/#/', { waitUntil: 'networkidle2' })
  await page.screenshot({ path: `${artifactDir}/dashboard_light.png` })

  // 2. Dashboard Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await page.screenshot({ path: `${artifactDir}/dashboard_dark.png` })

  // 3. Series 03 Detail View Light Mode
  await page.goto('http://localhost:3100/franchises/Series_03_Transmigrated_Game_Architect', { waitUntil: 'networkidle2' })
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await page.screenshot({ path: `${artifactDir}/series03_light.png` })

  // 4. Series 03 Detail View Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await page.screenshot({ path: `${artifactDir}/series03_dark.png` })

  await browser.close()
  console.log('Dual-theme screenshots captured successfully!')
}

run().catch(console.error)
