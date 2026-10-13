import fs from 'fs';
const md = fs.readFileSync('../01_Franchises/Series_03_Transmigrated_Game_Architect/EP01_The_Smiling_Architect_and_The_Chalk_Rapier/02_Prompt_Matrix.md', 'utf8');
const sceneRegex = /<scene\s+([^>]*?)>\s*([\s\S]*?)\s*<\/scene>/gi;
let m;
const missing = [];
while ((m = sceneRegex.exec(md)) !== null) {
  const attrs = m[1];
  const prompt = m[2];
  const idMatch = attrs.match(/id=["'](IMG_\d+)["']/i);
  const id = idMatch ? idMatch[1] : 'UNKNOWN';
  if (attrs.includes('16c4c742') || prompt.includes('Bramwell Locke')) {
    const hasHair = prompt.includes('chestnut-brown');
    const hasEyes = prompt.includes('golden-amber') || prompt.includes('amber');
    const hasShirt = prompt.includes('cream');
    const hasVest = prompt.includes('vest');
    if (!hasHair || !hasEyes || !hasShirt || !hasVest) {
      missing.push({ id, hasHair, hasEyes, hasShirt, hasVest });
    }
  }
}
console.log('Scenes with missing Bramwell Locke traits:', JSON.stringify(missing, null, 2));
