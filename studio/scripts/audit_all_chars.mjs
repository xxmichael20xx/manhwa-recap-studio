import fs from 'fs';
const md = fs.readFileSync('../01_Franchises/Series_03_Transmigrated_Game_Architect/EP01_The_Smiling_Architect_and_The_Chalk_Rapier/02_Prompt_Matrix.md', 'utf8');
const sceneRegex = /<scene\s+([^>]*?)>\s*([\s\S]*?)\s*<\/scene>/gi;
let m;
const report = [];

while ((m = sceneRegex.exec(md)) !== null) {
  const attrs = m[1];
  const prompt = m[2];
  const idMatch = attrs.match(/id=["'](IMG_\d+)["']/i);
  const id = idMatch ? idMatch[1] : 'UNKNOWN';

  // Check Linnea
  if (attrs.includes('7cf4d027') || prompt.includes('Linnea Croft')) {
    const hasHair = prompt.includes('strawberry-blonde');
    const hasEyes = prompt.includes('emerald-green');
    if (!hasHair || !hasEyes) {
      report.push({ id, char: 'Linnea', hasHair, hasEyes });
    }
  }

  // Check Cassian
  if (attrs.includes('85907b43') || prompt.includes('Cassian Valerius')) {
    const hasHair = prompt.includes('wine-burgundy');
    const hasArmor = prompt.includes('plate') || prompt.includes('armour') || prompt.includes('armor');
    if (!hasHair || !hasArmor) {
      report.push({ id, char: 'Cassian', hasHair, hasArmor });
    }
  }

  // Check Minotaur
  if (attrs.includes('70365391') || prompt.includes('Abyssal Minotaur')) {
    const hasHorns = prompt.includes('horns');
    const hasHammer = prompt.includes('warhammer') || prompt.includes('hammer');
    if (!hasHorns && !hasHammer) {
      report.push({ id, char: 'Minotaur', hasHorns, hasHammer });
    }
  }
}
console.log('Other characters audit:', JSON.stringify(report, null, 2));
