import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { batch01_03 } from './saga_data/batch01_03.mjs';
import { batch04_06 } from './saga_data/batch04_06.mjs';
import { batch07_09 } from './saga_data/batch07_09.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allScenes = [...batch01_03, ...batch04_06, ...batch07_09];
console.log(`Total scenes to assemble: ${allScenes.length}`);


const targetDir = 'C:\\Users\\MIchaelangelo\\Documents\\My Brand\\02_Ventures & Digital Products\\Manhwa Recap Studio\\01_Franchises\\Series_03_Transmigrated_Game_Architect\\EP01_The_Smiling_Architect_and_The_Chalk_Rapier';
const scriptFile = path.join(targetDir, '01_Episode_Script.md');
const matrixFile = path.join(targetDir, '02_Prompt_Matrix.md');

// 1. Build Episode Script
let scriptContent = `# Episode 01: The Smiling Architect and The Chalk Rapier (1-Hour Saga)\n\n`;
scriptContent += `> **Series:** Transmigrated Game Architect: Siphoning Demigod Enhancements in a Feudal World\n`;
scriptContent += `> **Format:** 9:16 Vertical Webtoon (Dual & Multi-Panel Strips)\n`;
scriptContent += `> **Runtime Tier:** Tier 2 Arc Feature / Saga (~55-60 Minutes, 216 Scenes, 9 Batches)\n`;
scriptContent += `> **Narrator Pace:** 140 WPM (~8,200 words total)\n\n`;
scriptContent += `---\n\n`;

for (let i = 0; i < allScenes.length; i++) {
  const scene = allScenes[i];
  const padNum = String(scene.num).padStart(3, '0');
  const tag = `[IMG_${padNum}]`;
  
  if (i % 24 === 0) {
    const batchIndex = Math.floor(i / 24) + 1;
    const startNum = String(i + 1).padStart(3, '0');
    const endNum = String(i + 24).padStart(3, '0');
    scriptContent += `\n## 📦 BATCH 0${batchIndex} (Scenes ${startNum} - ${endNum})\n\n`;
  }
  
  scriptContent += `${tag} ${scene.scriptText.trim()}\n\n`;
}

fs.writeFileSync(scriptFile, scriptContent, 'utf8');
console.log(`Successfully wrote 01_Episode_Script.md (${scriptContent.split(/\\s+/).length} words)`);

// 2. Build Prompt Matrix
let matrixContent = `# 02_Prompt_Matrix.md — Series 03 Episode 01 (1-Hour Saga Matrix)\n\n`;
matrixContent += `> **Franchise:** Transmigrated Game Architect: Siphoning Demigod Enhancements in a Feudal World\n`;
matrixContent += `> **Episode:** EP01: The Smiling Architect and The Chalk Rapier\n`;
matrixContent += `> **Format:** 9:16 Vertical Webtoon Comic Strips (~70% Dual/Multi-Panel, ~30% Hero Plates)\n`;
matrixContent += `> **Total Scenes:** 216 Scenes (9 Batches of 24)\n`;
matrixContent += `> **Character DNA Compliance:** 100% Locked UUIDs & Zero-Gore Kinetic Staging Formula Enforced\n\n`;
matrixContent += `---\n\n`;

for (let b = 0; b < 9; b++) {
  const batchNum = b + 1;
  const startIdx = b * 24;
  const batchScenes = allScenes.slice(startIdx, startIdx + 24);
  const startNum = String(startIdx + 1).padStart(3, '0');
  const endNum = String(startIdx + 24).padStart(3, '0');
  
  matrixContent += `## 📦 BATCH 0${batchNum} (Scenes ${startNum} - ${endNum})\n\n`;
  
  for (const s of batchScenes) {
    const padNum = String(s.num).padStart(3, '0');
    let xml = `<scene id="IMG_${padNum}">\n`;
    xml += `  <tag>IMG_${padNum}</tag>\n`;
    xml += `  <layout>${s.layout}</layout>\n`;
    if (s.charRefs) {
      xml += `  <character_refs>${s.charRefs}</character_refs>\n`;
    } else if (s.charRef) {
      xml += `  <character_ref>${s.charRef}</character_ref>\n`;
    }
    xml += `  <narrative_sync>${s.scriptText.trim()}</narrative_sync>\n`;
    xml += `  <prompt>${s.prompt.trim()}</prompt>\n`;
    xml += `</scene>\n\n`;
    matrixContent += xml;
  }
}

fs.writeFileSync(matrixFile, matrixContent, 'utf8');
console.log(`Successfully wrote 02_Prompt_Matrix.md (216 XML scenes)`);
