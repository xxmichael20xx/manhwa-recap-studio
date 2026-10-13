import fs from 'fs';
import { transformTokens } from '../src/utils/entityMapper.js';

const entitiesJson = JSON.parse(fs.readFileSync('../01_Franchises/Series_03_Transmigrated_Game_Architect/character_vault/flow_entities.json', 'utf8'));
const entityMap = entitiesJson.entities;

const md = fs.readFileSync('../01_Franchises/Series_03_Transmigrated_Game_Architect/EP01_The_Smiling_Architect_and_The_Chalk_Rapier/02_Prompt_Matrix.md', 'utf8');

const checkTags = ['IMG_005', 'IMG_006', 'IMG_015', 'IMG_016'];
for (const tag of checkTags) {
  const re = new RegExp('<scene\\s+id="' + tag + '"[\\s\\S]*?<\\/scene>', 'i');
  const m = md.match(re);
  if (m) {
    console.log('=== ' + tag + ' ===');
    const transformed = transformTokens(m[0], entityMap, 'uuid');
    console.log(transformed + '\n');
  }
}
