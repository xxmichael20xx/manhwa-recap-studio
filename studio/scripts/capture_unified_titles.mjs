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

  // 1. Click Tab 4: YouTube Launchpad
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const tab4 = btns.find(b => b.textContent.includes('YouTube Launchpad') || b.textContent.includes('Release Kit'))
    if (tab4) tab4.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  // 2. Select Master Omnibus in dropdown
  await page.evaluate(() => {
    const select = document.querySelector('select')
    if (select) {
      select.value = 'omnibus_master'
      select.dispatchEvent(new Event('change'))
    }
  })
  await new Promise(r => setTimeout(r, 1200))

  // Scroll to Unified Franchise Titles section
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Unified Franchise Titles') || h.textContent.includes('Title'))
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
  await new Promise(r => setTimeout(r, 600))

  // Capture Omnibus Dark Mode
  await page.screenshot({ path: path.join(artifactDir, 'unified_titles_omnibus_dark.png'), fullPage: false })

  // Toggle Light Mode
  await page.evaluate(() => {
    const themeBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('title')?.toLowerCase().includes('theme') || b.innerHTML.includes('Sun') || b.innerHTML.includes('Moon'))
    if (themeBtn) {
      themeBtn.click()
    } else {
      document.documentElement.classList.remove('dark')
    }
  })
  await new Promise(r => setTimeout(r, 600))

  // Capture Omnibus Light Mode
  await page.screenshot({ path: path.join(artifactDir, 'unified_titles_omnibus_light.png'), fullPage: false })

  // Re-enable Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await new Promise(r => setTimeout(r, 400))

  // 3. Switch Dropdown to Episode 01
  await page.evaluate(() => {
    const select = document.querySelector('select')
    if (select) {
      const epOption = Array.from(select.options).find(o => o.value.includes('EP01'))
      if (epOption) {
        select.value = epOption.value
        select.dispatchEvent(new Event('change'))
      }
    }
  })
  await new Promise(r => setTimeout(r, 1200))

  // Scroll to titles section
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Unified Franchise Titles') || h.textContent.includes('Title'))
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
  await new Promise(r => setTimeout(r, 600))

  // Capture Episode 01 Dark Mode
  await page.screenshot({ path: path.join(artifactDir, 'unified_titles_ep01_dark.png'), fullPage: false })

  await browser.close()
  console.log('Dual-theme unified franchise titles screenshots captured successfully!')
}

capture().catch(err => {
  console.error(err)
  process.exit(1)
})
