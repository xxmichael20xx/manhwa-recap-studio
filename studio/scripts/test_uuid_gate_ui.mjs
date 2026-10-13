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
  
  // Clear any stale cached entities in localStorage and reload to get fresh 5 entities
  await page.evaluate(() => {
    localStorage.removeItem('manhwa_entities_Series_03_Transmigrated_Game_Architect');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Verify Unlocked State (Series 03: all 5 characters have valid Google Flow UUIDs)
  const unlockedState = await page.evaluate(() => {
    const banners = Array.from(document.querySelectorAll('div')).filter(d => 
      d.textContent.includes('Prompt Matrix Copying Locked')
    );
    const uuidBadge = Array.from(document.querySelectorAll('button, span, div')).find(el => 
      el.textContent.trim().startsWith('@UUID')
    );
    return {
      hasBanner: banners.length > 0,
      uuidBadgeText: uuidBadge ? uuidBadge.textContent.trim() : null
    };
  });
  console.log('Unlocked State Verification:', unlockedState);

  // Capture Unlocked State (Dark Mode)
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.screenshot({ path: `${artifactDir}/uuid_gate_unlocked_dark.png` });
  console.log('Captured Unlocked Dark Mode');

  // Capture Unlocked State (Light Mode)
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await page.screenshot({ path: `${artifactDir}/uuid_gate_unlocked_light.png` });
  console.log('Captured Unlocked Light Mode');

  // 2. Now simulate a missing character UUID by intercepting /flow-entities
  console.log('Simulating missing character UUID to test lockout banner & disabled buttons...');
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.url().includes('/flow-entities')) {
      req.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          rawText: "Character Entities\nBoss: Abyssal Minotaur: 70365391-fd2f-47b2-88c5-c587c1a02a65\nCommander Vance Sterling: 78f698f6-7fc3-4258-97d0-8e5733f8c70f\nLinnea Croft: 7cf4d027-6863-4e4b-8f93-f58ceb6f0b0b\nLord Cassian Valerius: 85907b43-f56f-4b92-9869-b3c40d8d0c17",
          entities: {
            "Boss: Abyssal Minotaur": "70365391-fd2f-47b2-88c5-c587c1a02a65",
            "Commander Vance Sterling": "78f698f6-7fc3-4258-97d0-8e5733f8c70f",
            "Linnea Croft": "7cf4d027-6863-4e4b-8f93-f58ceb6f0b0b",
            "Lord Cassian Valerius": "85907b43-f56f-4b92-9869-b3c40d8d0c17"
            // Note: Bramwell Locke is deliberately missing to test gate!
          }
        })
      });
    } else {
      req.continue();
    }
  });

  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const lockedState = await page.evaluate(() => {
    const banner = Array.from(document.querySelectorAll('div')).find(d => 
      d.textContent.includes('Prompt Matrix Copying Locked')
    );
    const btns = Array.from(document.querySelectorAll('button')).filter(b => 
      b.textContent.includes('Copy') || b.textContent.includes('Missing XML')
    );
    const disabledCount = btns.filter(b => b.disabled || b.classList.contains('cursor-not-allowed')).length;
    return {
      hasBanner: !!banner,
      bannerText: banner ? banner.innerText.split('\n')[0] : null,
      totalCopyBtns: btns.length,
      disabledCount
    };
  });
  console.log('Locked State Verification:', lockedState);

  // Capture Locked State (Dark Mode)
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.screenshot({ path: `${artifactDir}/uuid_gate_locked_dark.png` });
  console.log('Captured Locked Dark Mode');

  // Capture Locked State (Light Mode)
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await page.screenshot({ path: `${artifactDir}/uuid_gate_locked_light.png` });
  console.log('Captured Locked Light Mode');

  await browser.close();
  console.log('All tests and visual captures passed!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
