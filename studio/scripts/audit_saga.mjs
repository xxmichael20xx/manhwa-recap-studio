import fs from 'fs';
import path from 'path';

const matrixPath = 'C:\\Users\\MIchaelangelo\\Documents\\My Brand\\02_Ventures & Digital Products\\Manhwa Recap Studio\\01_Franchises\\Series_03_Transmigrated_Game_Architect\\EP01_The_Smiling_Architect_and_The_Chalk_Rapier\\02_Prompt_Matrix.md';
const scriptPath = 'C:\\Users\\MIchaelangelo\\Documents\\My Brand\\02_Ventures & Digital Products\\Manhwa Recap Studio\\01_Franchises\\Series_03_Transmigrated_Game_Architect\\EP01_The_Smiling_Architect_and_The_Chalk_Rapier\\01_Episode_Script.md';
const flowPath = 'C:\\Users\\MIchaelangelo\\Documents\\My Brand\\02_Ventures & Digital Products\\Manhwa Recap Studio\\01_Franchises\\Series_03_Transmigrated_Game_Architect\\character_vault\\flow_entities.json';

const matrix = fs.readFileSync(matrixPath, 'utf8');
const script = fs.readFileSync(scriptPath, 'utf8');
const flow = JSON.parse(fs.readFileSync(flowPath, 'utf8'));

console.log('=== VERIFYING CHARACTER REFS IN MATRIX ===');
const sceneMatches = matrix.match(/<scene id="\d+">[\s\S]*?<\/scene>/g) || [];
console.log(`Total scenes in matrix: ${sceneMatches.length}`);

const characterTokens = matrix.match(/@\{([^}]+)\}/g) || [];
const uniqueTokens = [...new Set(characterTokens)];
console.log('Unique character tokens found:', uniqueTokens);

const knownNames = Object.keys(flow.entities);
let missing = 0;
for (const t of uniqueTokens) {
  const cleanName = t.replace(/^@\{/, '').replace(/\}$/, '').split(':')[0].trim();
  const matched = knownNames.some(k => k.toLowerCase() === cleanName.toLowerCase() || t.includes(k));
  if (!matched) {
    console.error(`WARNING: Unmapped token: ${t}`);
    missing++;
  } else {
    console.log(`✓ Mapped: ${t}`);
  }
}

console.log('\n=== VERIFYING NARRATIVE TAGS IN SCRIPT ===');
const scriptTags = script.match(/\[IMG_\d{3}\]/g) || [];
console.log(`Total [IMG_XXX] tags in script: ${scriptTags.length}`);

if (scriptTags.length !== 216) {
  console.error(`ERROR: Expected 216 tags, found ${scriptTags.length}`);
} else {
  console.log('✓ Script has exactly 216 scene tags!');
}

const words = script.trim().split(/\s+/).length;
console.log(`Total words in script: ${words}`);
console.log(`Estimated audio duration at 140 WPM: ${(words / 140).toFixed(1)} minutes`);

console.log('\nAudit complete! Missing tokens:', missing);
