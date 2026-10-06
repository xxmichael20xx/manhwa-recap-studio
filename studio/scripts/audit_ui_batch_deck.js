import puppeteer from 'puppeteer-core';
import path from 'path';

const outDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/e7a1ab76-cbc2-41b1-9994-2ba09b6852a3';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({ 
    executablePath: edgePath,
    headless: 'new', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  await page.goto('http://localhost:3100/video/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_FRank_Awakening_and_The_Plunderers_Bow', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Scroll to batch deck
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    const h3 = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.includes('Batch Production Deck'));
    if (h3) {
      h3.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'video_studio_batch_deck_dark.png') });

  // Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'video_studio_batch_deck_light.png') });

  await browser.close();
  console.log('Batch deck scrollIntoView captures complete!');
}

run().catch(console.error);
