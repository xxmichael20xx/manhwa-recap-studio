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

  const pageStats = await page.evaluate(() => {
    const sceneCards = document.querySelectorAll('.grid > div');
    const badge = document.querySelector('h1 span.font-bold');
    return {
      titleText: document.title,
      badgeText: badge ? badge.textContent.trim() : null,
      cardCount: sceneCards.length
    };
  });
  console.log('Page Stats:', pageStats);

  // Capture Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${artifactDir}/series03_matrix_consistent_dark.png` });
  console.log('Captured Consistent Dark Mode');

  // Capture Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${artifactDir}/series03_matrix_consistent_light.png` });
  console.log('Captured Consistent Light Mode');

  // Also open the Batch Dispatch Hub drawer to show the 3 Batches
  await page.evaluate(() => {
    // Click Batch Dispatch Hub button
    const buttons = Array.from(document.querySelectorAll('button'));
    const hubBtn = buttons.find(b => b.textContent.includes('Batch Dispatch Hub'));
    if (hubBtn) hubBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Capture Batch Hub Drawer Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${artifactDir}/series03_batch_hub_dark.png` });
  console.log('Captured Batch Hub Dark Mode');

  // Capture Batch Hub Drawer Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${artifactDir}/series03_batch_hub_light.png` });
  console.log('Captured Batch Hub Light Mode');

  await browser.close();
  console.log('Verification capture complete!');
}

run().catch(console.error);
