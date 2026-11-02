/**
 * scripts/audit-department-ep02.js
 *
 * Deterministic Multi-Department Quality Board Verification Engine.
 * Formally evaluates all 5 Studio Quality Board Departments across all 288 scenes:
 * 1. Prop & Wardrobe Department (prop-auditor)
 * 2. Spatial Geometry & Portal Department (spatial-auditor)
 * 3. Physical Chronology & Choreography Department (chronology-auditor)
 * 4. Directorial Tone & Metaphor Quarantine Department (tone-auditor)
 * 5. Subject Isolation & Anti-Hallucination Department (isolation-auditor)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioRoot = path.resolve(__dirname, '../');

const franchiseDir = path.resolve(studioRoot, '01_Franchises/Series_05_The_Fourth_Magius');
const epDir = path.resolve(franchiseDir, 'EP02_The_Painless_Crafts_and_The_Agony_of_Magic');

const matrixPath = path.join(epDir, '02_Prompt_Matrix.md');
const lifecyclePath = path.join(epDir, 'lifecycle.json');
const zonesPath = path.join(franchiseDir, 'vault/zones.json');
const entitiesPath = path.join(franchiseDir, 'vault/entities.json');

const matrixContent = fs.readFileSync(matrixPath, 'utf8');
const lifecycle = JSON.parse(fs.readFileSync(lifecyclePath, 'utf8'));
const zones = JSON.parse(fs.readFileSync(zonesPath, 'utf8'));
const entities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'));

// Parse scenes from 02_Prompt_Matrix.md
const sceneBlocks = [...matrixContent.matchAll(/<scene id="(IMG_\d+)" filename="([^"]+)" tier="([^"]+)" zone="([^"]+)">([\s\S]*?)<\/scene>/g)];

console.log('='.repeat(78));
console.log('  MANHWA RECAP STUDIO — 5-DEPARTMENT QUALITY BOARD AUDIT REPORT');
console.log('='.repeat(78));
console.log(`Franchise : Series_05_The_Fourth_Magius`);
console.log(`Episode   : EP02_The_Painless_Crafts_and_The_Agony_of_Magic`);
console.log(`Scenes    : ${sceneBlocks.length} Scenes Analyzed`);
console.log('-'.repeat(78));

const reports = {
  prop: { name: '1. Prop & Wardrobe Department (prop-auditor)', passes: 0, fails: 0, issues: [] },
  spatial: { name: '2. Spatial Geometry & Portal Department (spatial-auditor)', passes: 0, fails: 0, issues: [] },
  chronology: { name: '3. Physical Chronology & Choreography Department (chronology-auditor)', passes: 0, fails: 0, issues: [] },
  tone: { name: '4. Directorial Tone & Metaphor Quarantine (tone-auditor)', passes: 0, fails: 0, issues: [] },
  isolation: { name: '5. Subject Isolation & Anti-Hallucination (isolation-auditor)', passes: 0, fails: 0, issues: [] }
};

let prevZone = null;

for (const match of sceneBlocks) {
  const id = match[1];
  const scNum = parseInt(id.replace('IMG_', ''), 10);
  const tier = match[3];
  const zone = match[4];
  const body = match[5];

  const promptMatch = body.match(/<prompt>([\s\S]*?)<\/prompt>/);
  const prompt = promptMatch ? promptMatch[1] : '';
  const narrativeMatch = body.match(/<narrative_sync>([\s\S]*?)<\/narrative_sync>/);
  const narrative = narrativeMatch ? narrativeMatch[1] : '';

  // --------------------------------------------------------------------------
  // 1. PROP & WARDROBE AUDIT
  // --------------------------------------------------------------------------
  let propDefect = false;
  // In salve scenes (121-148), container MUST NOT be glass, clay, or vial
  if (scNum >= 121 && scNum <= 148) {
    const forbiddenContainers = [/\bglass vial\b/i, /\bclay pot\b/i, /\bclay bowl\b/i, /\bflat glass\b/i, /\bglass dish\b/i, /\bbottle\b/i];
    for (const fc of forbiddenContainers) {
      if (fc.test(prompt)) {
        reports.prop.issues.push(`[${id}] Salve container morphing violation: matched forbidden container "${fc.source}"`);
        propDefect = true;
      }
    }
    if (!prompt.includes('@{Item: Polished Cedar Salve Bowl}')) {
      reports.prop.issues.push(`[${id}] Missing canonical @{Item: Polished Cedar Salve Bowl} token in salve scene`);
      propDefect = true;
    }
  }
  // In Rowan combat scenes (270-288), gear must be present
  if (scNum >= 270 && scNum <= 288 && prompt.includes('@{Elder Rowan Thorne}')) {
    if (!prompt.includes('@{Weapon: Rowan Buckler and Short Sword}')) {
      reports.prop.issues.push(`[${id}] Rowan is missing equipped @{Weapon: Rowan Buckler and Short Sword}`);
      propDefect = true;
    }
  }
  if (!propDefect) reports.prop.passes++; else reports.prop.fails++;

  // --------------------------------------------------------------------------
  // 2. SPATIAL GEOMETRY & PORTAL AUDIT
  // --------------------------------------------------------------------------
  let spatialDefect = false;
  // Location-as-Entity Mandate: Every scene MUST declare its parent location entity in character_refs and bound in prompt
  const expectedLocEnt = entities[zone];
  if (expectedLocEnt && expectedLocEnt.kind === 'location') {
    if (!prompt.includes(expectedLocEnt.token)) {
      reports.spatial.issues.push(`[${id}] Location-as-Entity Violation: Missing token "${expectedLocEnt.token}" in prompt`);
      spatialDefect = true;
    }
    const charRefsMatch = body.match(/<character_refs>([\s\S]*?)<\/character_refs>/);
    const charRefsText = charRefsMatch ? charRefsMatch[1] : '';
    const hasLocRef = (expectedLocEnt.aliases || []).some(al => charRefsText.includes(al));
    if (!hasLocRef) {
      reports.spatial.issues.push(`[${id}] Location-as-Entity Violation: Missing location card in <character_refs> for "${zone}"`);
      spatialDefect = true;
    }
  }

  // In loft scenes, doors are strictly forbidden
  if (zone === 'oakhaven_apothecary_loft') {
    const forbiddenDoors = [/\bentrance door\b/i, /\bfront door\b/i, /\boak street door\b/i, /\boak door\b/i, /\bdoorway\b/i];
    for (const fd of forbiddenDoors) {
      if (fd.test(prompt)) {
        reports.spatial.issues.push(`[${id}] Architectural Portal Violation: Loft contains forbidden portal "${fd.source}"`);
        spatialDefect = true;
      }
    }
  }
  // Check legal zone transitions
  if (prevZone && prevZone !== zone) {
    const legalNext = zones[prevZone]?.adjacent || [];
    if (!legalNext.includes(zone)) {
      reports.spatial.issues.push(`[${id}] Illegal Spatial Teleportation: Zone jumped from "${prevZone}" to "${zone}" (not listed in adjacent)`);
      spatialDefect = true;
    }
  }
  prevZone = zone;
  if (!spatialDefect) reports.spatial.passes++; else reports.spatial.fails++;

  // --------------------------------------------------------------------------
  // 3. PHYSICAL CHRONOLOGY & CHOREOGRAPHY AUDIT
  // --------------------------------------------------------------------------
  let chronoDefect = false;
  // Breakfast posture timeline (Scenes 011-016)
  if (scNum >= 11 && scNum <= 15) {
    if (/seated|sitting on (?:stool|bench|chair)|eating fried/i.test(prompt)) {
      reports.chronology.issues.push(`[${id}] Posture Anticipation Bleed: Michael prompted as seated before pulling stool in Scene 016`);
      chronoDefect = true;
    }
  }
  // Rowan presence timeline in pre-dawn workshop (Scenes 097-124)
  if (scNum >= 97 && scNum <= 124 && zone === 'rowan_apothecary_shop') {
    if (prompt.includes('@{Elder Rowan Thorne}')) {
      reports.chronology.issues.push(`[${id}] Character Pre-Teleportation: Rowan injected into workshop before his scripted wake-up in Scene 125`);
      chronoDefect = true;
    }
  }
  if (!chronoDefect) reports.chronology.passes++; else reports.chronology.fails++;

  // --------------------------------------------------------------------------
  // 4. DIRECTORIAL TONE & METAPHOR QUARANTINE AUDIT
  // --------------------------------------------------------------------------
  let toneDefect = false;
  // In Scene 230-233: narrative mentions bandits/daggers, visual MUST NOT draw bandits
  if (scNum >= 230 && scNum <= 233) {
    if (/\b(?:bandit|bandits|iron daggers|street thugs?)\b/i.test(prompt)) {
      reports.tone.issues.push(`[${id}] Metaphor Hallucination: Script metaphor (bandit/daggers) drawn physically in private bedroom`);
      toneDefect = true;
    }
  }
  // In Scenes 248-264: Michael tests staff on boulder; visual MUST NOT draw dark monsters
  if (scNum >= 248 && scNum <= 264) {
    if (/\b(?:dark monster|horned beast|creature|demon|wyrm)\b/i.test(prompt)) {
      reports.tone.issues.push(`[${id}] Phantom Monster Hallucination: Dark monster injected during inanimate boulder damage testing`);
      toneDefect = true;
    }
  }
  // In Scenes 274-288: Trolls are in distant valley; visual MUST NOT depict trolls inside town
  if (scNum >= 274 && scNum <= 288) {
    if (/\b(?:trolls? (?:inside|in the|breaching|on the) (?:town|walls?|streets?|market))\b/i.test(prompt)) {
      reports.tone.issues.push(`[${id}] Narrative Inconsistency: Stone trolls depicted fighting inside city walls when narrative states they are miles away`);
      toneDefect = true;
    }
  }
  if (!toneDefect) reports.tone.passes++; else reports.tone.fails++;

  // --------------------------------------------------------------------------
  // 5. SUBJECT ISOLATION & ANTI-HALLUCINATION AUDIT
  // --------------------------------------------------------------------------
  let isoDefect = false;
  const lcEntry = lifecycle[id];
  if (lcEntry && lcEntry.isolationLock) {
    if (!prompt.includes('strictly alone in the room, zero bystanders, zero extra men, zero background figures')) {
      reports.isolation.issues.push(`[${id}] Missing Solitude Lock in isolated scene`);
      isoDefect = true;
    }
    // Check for random men / bystanders
    if (/\b(?:assistant|random man|extra man|bystander|stranger|onlooker)\b/i.test(prompt)) {
      reports.isolation.issues.push(`[${id}] Unindexed Random Person Hallucination: Found unapproved person noun in solitary scene`);
      isoDefect = true;
    }
  }
  if (!isoDefect) reports.isolation.passes++; else reports.isolation.fails++;
}

// Print Results
let allPassed = true;
for (const [key, rep] of Object.entries(reports)) {
  const status = rep.fails === 0 ? '\x1b[32m[100% PASS]\x1b[0m' : `\x1b[31m[FAILED (${rep.fails} Issues)]\x1b[0m`;
  console.log(`${status} ${rep.name}: ${rep.passes}/${sceneBlocks.length} scenes compliant`);
  if (rep.issues.length > 0) {
    allPassed = false;
    rep.issues.slice(0, 5).forEach(iss => console.log(`   ↳ ${iss}`));
    if (rep.issues.length > 5) {
      console.log(`   ↳ ... and ${rep.issues.length - 5} more issues`);
    }
  }
}

console.log('-'.repeat(78));
if (allPassed) {
  console.log('\x1b[32m[UNANIMOUS DEPARTMENT PASS]\x1b[0m All 5 Quality Board Departments certified 100% production-ready!');
  process.exit(0);
} else {
  console.log('\x1b[31m[DEPARTMENT AUDIT BLOCKED]\x1b[0m Continuity defects detected. Please review above.');
  process.exit(1);
}
