import fs from 'fs';
import path from 'path';
import { transformTokens, buildSceneXmlNode } from '../src/utils/entityMapper.js';

const matrixPath = path.resolve(
  '../01_Franchises/Series_03_Transmigrated_Game_Architect/EP01_The_Smiling_Architect_and_The_Chalk_Rapier/02_Prompt_Matrix.md'
);
const entitiesPath = path.resolve(
  '../01_Franchises/Series_03_Transmigrated_Game_Architect/character_vault/flow_entities.json'
);

const entitiesJson = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'));
const entityMap = entitiesJson.entities;
console.log('Loaded entity map:', entityMap);

const mdContent = fs.readFileSync(matrixPath, 'utf8');

// Parse XML nodes
const sceneRegex = /<scene\s+([^>]*?)>\s*([\s\S]*?)\s*<\/scene>/gi;
let match;
let sceneCount = 0;
let errors = [];

while ((match = sceneRegex.exec(mdContent)) !== null) {
  sceneCount++;
  const attrs = match[1];
  const prompt = match[2].trim();
  const idMatch = attrs.match(/id=["'](IMG_\d+)["']/i);
  const tag = idMatch ? idMatch[1] : `Scene_${sceneCount}`;

  // Check spatial enclosure
  if (!prompt.includes('Spatial Enclosure & Environment:')) {
    errors.push(`${tag} is missing Spatial Enclosure & Environment!`);
  }

  // Transform tokens to UUID mode
  const transformed = transformTokens(prompt, entityMap, 'uuid');

  // Check if any bare names or possessives remain
  const bareChecks = [
    { name: "Bram's", re: /\bBram('s|’s)\b/ },
    { name: "bare Bram", re: /(?<![@{a-zA-Z0-9_-])\bBram\b/ },
    { name: "Cassian's", re: /\bCassian('s|’s)\b/ },
    { name: "bare Cassian", re: /(?<![@{a-zA-Z0-9_-])\bCassian\b/ },
    { name: "Linnea's", re: /\bLinnea('s|’s)\b/ },
    { name: "bare Linnea", re: /(?<![@{a-zA-Z0-9_-])\bLinnea\b/ },
    { name: "Minotaur's", re: /\bMinotaur('s|’s)\b/ },
    { name: "bare Minotaur", re: /(?<![@{a-zA-Z0-9_-])\bMinotaur\b/ },
    { name: "Vance's", re: /\bVance('s|’s)\b/ },
    { name: "bare Vance", re: /(?<![@{a-zA-Z0-9_-])\bVance\b/ },
  ];

  for (const c of bareChecks) {
    if (c.re.test(transformed)) {
      errors.push(`${tag}: Found unmapped ${c.name} in transformed output!`);
    }
  }

  // Test buildSceneXmlNode
  const charRefMatch = attrs.match(/\bcharacter_ref=["']([^"']+)["']/i);
  const charRefsMatch = attrs.match(/\bcharacter_refs=["']([^"']+)["']/i);
  const xmlNode = buildSceneXmlNode(tag, `${tag}.jpg`, prompt, entityMap, 'uuid', {
    character_ref: charRefMatch ? charRefMatch[1] : null,
    character_refs: charRefsMatch ? charRefsMatch[1] : null
  });

  if (!xmlNode.startsWith('<scene')) {
    errors.push(`${tag}: xmlNode does not start with <scene!`);
  }
}

console.log(`Audited ${sceneCount} scenes.`);
if (errors.length > 0) {
  console.error(`Found ${errors.length} errors:`);
  errors.forEach(e => console.error(' - ' + e));
  process.exit(1);
} else {
  console.log('✅ 100% OF SCENES PASSED! Zero unmapped bare names or possessives, 100% spatial enclosures locked!');
}
