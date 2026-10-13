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

  // Find exact Scene 5 tag badge inside the card list
  const scene5Found = await page.evaluate(() => {
    // Look for span or button with text exactly '[IMG_005]'
    const badges = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent.trim() === '[IMG_005]'
    );
    if (badges.length > 0) {
      badges[0].scrollIntoView({ behavior: 'instant', block: 'center' });
      return true;
    }
    return false;
  });
  console.log('Scene 5 badge found and scrolled:', scene5Found);
  await new Promise(r => setTimeout(r, 1000));

  // Capture Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${artifactDir}/scene5_fortified_dark.png` });
  console.log('Captured Scene 5 Dark Mode');

  // Capture Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${artifactDir}/scene5_fortified_light.png` });
  console.log('Captured Scene 5 Light Mode');

  await browser.close();
  console.log('Verification capture complete!');
}

run().catch(console.error);
