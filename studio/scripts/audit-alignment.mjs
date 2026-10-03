import puppeteer from 'puppeteer-core'
import fs from 'fs'

async function audit() {
  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ]
  const executablePath = edgePaths.find(p => fs.existsSync(p))

  const browser = await puppeteer.launch({ 
    executablePath,
    headless: 'new', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  await page.goto('http://localhost:3100/video/Series_01_The_Singularity_Protocol/EP01_The_Double_FRank_Anomaly', { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await new Promise(r => setTimeout(r, 1000))

  // 1. Click Validate Scene Alignment
  const buttons = await page.$$('button')
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text && text.includes('Validate Scene Alignment')) {
      await btn.click()
      break
    }
  }

  await new Promise(r => setTimeout(r, 1200))

  // 2. Click Re-scan Alignment
  const modalButtons = await page.$$('button')
  for (const btn of modalButtons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text && text.includes('Re-scan Alignment')) {
      console.log('Found and clicking Re-scan Alignment button...')
      await btn.click()
      break
    }
  }

  await new Promise(r => setTimeout(r, 1500))
  await page.screenshot({ path: 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/425b19b0-3cce-44b2-9067-511ba7c4c2bf/visual_alignment_modal_rescanned.png' })
  await browser.close()
  console.log('Re-scan test screenshot captured successfully.')
}

audit().catch(console.error)
