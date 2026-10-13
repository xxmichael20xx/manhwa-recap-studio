import puppeteer from 'puppeteer-core';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  const artifactDir = 'C:/Users/MIchaelangelo/.gemini/antigravity/brain/2dc9b386-53b1-4547-8e58-16bd7d053115';
  const targetUrl = 'http://localhost:3100/prompts/Series_03_Transmigrated_Game_Architect/EP01_The_Smiling_Architect_and_The_Chalk_Rapier';

  console.log('Navigating to:', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await page.screenshot({ path: `${artifactDir}/series03_prompts_light.png` });
  console.log('Captured Light Mode');

  // 2. Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.screenshot({ path: `${artifactDir}/series03_prompts_dark.png` });
  console.log('Captured Dark Mode');

  await browser.close();
  console.log('Done!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
