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
  await page.setViewport({ width: 1440, height: 950 })

  const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/e815df25-9ee0-4e57-bd02-6e8614cfe47c'
  const targetUrl = 'http://localhost:3100/prompts/Series_04_The_Billion_Year_Sovereign/EP02_The_Campus_Appraisal_and_The_Celestial_Countdown'

  console.log('Navigating to:', targetUrl)
  await page.goto(targetUrl, { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 2000))

  const pageStats = await page.evaluate(() => {
    return {
      titleText: document.title,
      heading: document.querySelector('h1')?.textContent?.trim()
    }
  })
  console.log('Page Stats:', pageStats)

  // Capture Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/ep02_prompt_matrix_dark.png` })
  console.log('✓ Captured ep02_prompt_matrix_dark.png')

  // Capture Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/ep02_prompt_matrix_light.png` })
  console.log('✓ Captured ep02_prompt_matrix_light.png')

  // Open Pre-Flight Batch Hub drawer
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const hubBtn = buttons.find(b => b.textContent.includes('Pre-Flight Health Hub') || b.textContent.includes('Batch Dispatch Hub') || b.textContent.includes('Batches'))
    if (hubBtn) hubBtn.click()
  })
  await new Promise(r => setTimeout(r, 1000))

  await page.screenshot({ path: `${artifactDir}/ep02_batch_drawer_light.png` })
  console.log('✓ Captured ep02_batch_drawer_light.png')

  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `${artifactDir}/ep02_batch_drawer_dark.png` })
  console.log('✓ Captured ep02_batch_drawer_dark.png')

  await browser.close()
  console.log('All verification captures completed!')
}

run().catch(err => {
  console.error('Capture Error:', err)
  process.exit(1)
})
