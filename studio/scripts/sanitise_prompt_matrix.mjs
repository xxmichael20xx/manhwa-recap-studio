import fs from 'fs';
import path from 'path';

const filePath = 'C:/Users/MIchaelangelo/Documents/My Brand/02_Ventures & Digital Products/Manhwa Recap Studio/01_Franchises/Series_03_Transmigrated_Game_Architect/EP01_The_Smiling_Architect_and_The_Chalk_Rapier/02_Prompt_Matrix.md';
let content = fs.readFileSync(filePath, 'utf8');

// Replace anchors and inline prompt tags
const replacements = [
  // IMG_004
  {
    search: '| `IMG_004` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} & @{Item: Siphoned Pine Needle} | Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and rolled-up cream linen shirt holding @{Item: Siphoned Pine Needle} between left thumb and forefinger, glowing with faint cyan kinetic light.',
    replace: '| `IMG_004` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} | Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and rolled-up cream linen shirt holding a siphoned pine needle between left thumb and forefinger, glowing with faint cyan kinetic light.'
  },
  // IMG_006
  {
    search: '| `IMG_006` | **Tier C: Action Strip** | @{Item: Siphoned Pine Needle} & @{Boss: Abyssal Minotaur} |',
    replace: '| `IMG_006` | **Tier C: Action Strip** | @{Boss: Abyssal Minotaur} |'
  },
  // IMG_032
  {
    search: '| `IMG_032` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} & @{Item: Rustic Copper Watering Can} | Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream shirt and dark brown leather artisan vest picking up @{Item: Rustic Copper Watering Can} by the handle.',
    replace: '| `IMG_032` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} & @{Linnea Croft} | Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream shirt and dark brown leather artisan vest picking up an antique rustic copper watering can by the handle.'
  },
  // IMG_033
  {
    search: '| `IMG_033` | **Tier B: Dual-Panel Split** | @{Item: Rustic Copper Watering Can} & @{Bramwell Locke} | Dual-panel manhwa webtoon comic strip. Top block: Close-up of @{Item: Rustic Copper Watering Can} glowing with vivid cyan growth runes along base.',
    replace: '| `IMG_033` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} & @{Linnea Croft} | Dual-panel manhwa webtoon comic strip. Top block: Close-up of the rustic copper watering can glowing with vivid cyan growth runes along base.'
  },
  // IMG_043
  {
    search: '| `IMG_043` | **Tier A: Hero Plate** | @{Lord Cassian Valerius} & @{Weapon: Sunfire Rapier} | Full-bleed cinematic hero plate. Enraged 22-year-old @{Lord Cassian Valerius} with slicked-back wine-burgundy hair drawing ancestral @{Weapon: Sunfire Rapier},',
    replace: '| `IMG_043` | **Tier A: Hero Plate** | @{Lord Cassian Valerius} | Full-bleed cinematic hero plate. Enraged 22-year-old @{Lord Cassian Valerius} with slicked-back wine-burgundy hair drawing ancestral Sunfire Rapier,'
  },
  // IMG_045
  {
    search: '| `IMG_045` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} & @{Weapon: Sunfire Rapier} |',
    replace: '| `IMG_045` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} & @{Lord Cassian Valerius} |'
  },
  // IMG_047
  {
    search: '| `IMG_047` | **Tier C: Action Strip** | @{Lord Cassian Valerius} & @{Weapon: Sunfire Rapier} |',
    replace: '| `IMG_047` | **Tier C: Action Strip** | @{Lord Cassian Valerius} |'
  },
  // IMG_051
  {
    search: '| `IMG_051` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} & @{Weapon: Enchanted Wooden Broom} |',
    replace: '| `IMG_051` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} |'
  },
  // IMG_052
  {
    search: '| `IMG_052` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} & @{Weapon: Enchanted Wooden Broom} |',
    replace: '| `IMG_052` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} |'
  },
  // IMG_056
  {
    search: '| `IMG_056` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} & @{Weapon: Enchanted Wooden Broom} |',
    replace: '| `IMG_056` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} |'
  },
  // IMG_057
  {
    search: '| `IMG_057` | **Tier B: Dual-Panel Split** | @{Weapon: Enchanted Wooden Broom} |',
    replace: '| `IMG_057` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} |'
  },
  // IMG_058
  {
    search: '| `IMG_058` | **Tier A: Hero Plate** | @{Weapon: Enchanted Wooden Broom} |',
    replace: '| `IMG_058` | **Tier A: Hero Plate** | @{Bramwell Locke} |'
  },
  // IMG_064
  {
    search: '| `IMG_064` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} & @{Item: Siphoned Pine Needle} |',
    replace: '| `IMG_064` | **Tier B: Dual-Panel Split** | @{Bramwell Locke} |'
  },
  // IMG_065
  {
    search: '| `IMG_065` | **Tier B: Dual-Panel Split** | @{Item: Siphoned Pine Needle} |',
    replace: '| `IMG_065` | **Tier B: Dual-Panel Split** | General System |'
  },
  // IMG_066
  {
    search: '| `IMG_066` | **Tier C: Action Strip** | @{Boss: Abyssal Minotaur} & @{Item: Siphoned Pine Needle} |',
    replace: '| `IMG_066` | **Tier C: Action Strip** | @{Boss: Abyssal Minotaur} & @{Bramwell Locke} |'
  }
];

let replacedCount = 0;
for (const r of replacements) {
  if (content.includes(r.search)) {
    content = content.replace(r.search, r.replace);
    replacedCount++;
  } else {
    console.warn('Could not find search string:\n', r.search);
  }
}

// Any remaining @{Item: or @{Weapon:
content = content.replace(/@\{Item:[^}]+\}/g, 'item');
content = content.replace(/@\{Weapon:[^}]+\}/g, 'weapon');

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Successfully replaced ${replacedCount} / ${replacements.length} scene anchors in 02_Prompt_Matrix.md!`);
