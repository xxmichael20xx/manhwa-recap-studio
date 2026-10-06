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

  // 1. Prompt Matrix View - Scroll to Scene 3-6 (Dark Mode)
  await page.goto('http://localhost:3100/prompts/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_FRank_Awakening_and_The_Plunderers_Bow', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    window.scrollBy(0, 380);
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'matrix_scene_chips_dark.png') });

  // 2. Prompt Matrix View - Scroll to Scene 3-6 (Light Mode)
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'matrix_scene_chips_light.png') });

  // 3. Video Studio View - Scroll to Batch A Accordion (Dark Mode)
  await page.goto('http://localhost:3100/video/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_FRank_Awakening_and_The_Plunderers_Bow', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    window.scrollBy(0, 780);
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'video_studio_batch_hub_dark.png') });

  // 4. Video Studio View - Scroll to Batch A Accordion (Light Mode)
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'video_studio_batch_hub_light.png') });

  await browser.close();
  console.log('Detailed captures complete!');
}

run().catch(console.error);
