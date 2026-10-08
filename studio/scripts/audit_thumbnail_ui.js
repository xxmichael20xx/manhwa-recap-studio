import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath

const artifactDir = 'C:\\Users\\MIchaelangelo\\.gemini\\antigravity\\brain\\bade8f56-08a3-4a62-9ef0-e0b3c45f66a1'

async function runAudit() {
  console.log('🚀 Launching Headless Browser for Multi-Variant Thumbnail Studio Audit...')
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 1100 }
  })

  const page = await browser.newPage()

  try {
    const url = 'http://localhost:3100/video/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_FRank_Awakening_and_The_Plunderers_Bow'
    console.log(`Navigating to ${url}...`)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    // Wait 2s for initial components to load
    await new Promise(r => setTimeout(r, 2000))

    // Click Stage 4 tab (YouTube Launchpad)
    console.log('Switching to Stage 4: YouTube Launchpad & Packaging...')
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const stage4Btn = buttons.find(b => b.textContent.includes('Stage 4') || b.textContent.includes('YouTube Launchpad'))
      if (stage4Btn) stage4Btn.click()
    })

    await new Promise(r => setTimeout(r, 2000))

    // Ensure Light Mode first
    console.log('Setting Light Mode...')
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    })

    await new Promise(r => setTimeout(r, 1000))

    // Scroll to thumbnail studio canvas
    await page.evaluate(() => {
      const el = document.querySelector('h3:has(.lucide-image)') || document.querySelectorAll('h3')[1]
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
      else window.scrollTo(0, 850)
    })

    await new Promise(r => setTimeout(r, 1000))

    // Capture Light Mode Screenshot
    const lightPath = path.join(artifactDir, 'thumbnail_studio_light.png')
    await page.screenshot({ path: lightPath, fullPage: false })
    console.log(`📸 Light Mode Screenshot captured: ${lightPath}`)

    // Switch to Dark Mode
    console.log('Switching to Dark Mode...')
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    })

    await new Promise(r => setTimeout(r, 1000))

    // Click Concept B tab
    console.log('Selecting Concept B tab...')
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const conceptB = buttons.find(b => b.textContent.includes('Concept B'))
      if (conceptB) conceptB.click()
    })

    await new Promise(r => setTimeout(r, 1500))

    // Capture Dark Mode Screenshot with Concept B active
    const darkPath = path.join(artifactDir, 'thumbnail_studio_dark.png')
    await page.screenshot({ path: darkPath, fullPage: false })
    console.log(`📸 Dark Mode Screenshot captured: ${darkPath}`)

    console.log('✅ UI Verification Audit Completed Successfully with Exit Code 0!')
  } catch (err) {
    console.error('Audit failed:', err)
    process.exitCode = 1
  } finally {
    await browser.close()
  }
}

runAudit()
