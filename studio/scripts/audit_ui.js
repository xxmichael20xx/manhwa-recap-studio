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
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Audit Prompt Matrix View (Light Mode)
  await page.goto('http://localhost:3100/prompts/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_FRank_Awakening_and_The_Plunderers_Bow', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'matrix_flow_refs_light.png'), fullPage: false });

  // Open Drawer in Light Mode
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Batch Copy Hub')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'matrix_batch_drawer_refs_light.png'), fullPage: false });

  // 2. Audit Prompt Matrix View (Dark Mode)
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'matrix_batch_drawer_refs_dark.png'), fullPage: false });

  // Close drawer
  const backdrop = await page.$('.fixed.inset-0.bg-slate-950\\/70');
  if (backdrop) {
    await backdrop.click();
    await new Promise(r => setTimeout(r, 500));
  }
  await page.screenshot({ path: path.join(outDir, 'matrix_flow_refs_dark.png'), fullPage: false });

  // 3. Audit Video Studio View (Dark Mode)
  await page.goto('http://localhost:3100/video/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_FRank_Awakening_and_The_Plunderers_Bow', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'video_studio_flow_refs_dark.png'), fullPage: false });

  // 4. Audit Video Studio View (Light Mode)
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'video_studio_flow_refs_light.png'), fullPage: false });

  await browser.close();
  console.log('Visual audit captures complete!');
}

run().catch(console.error);
