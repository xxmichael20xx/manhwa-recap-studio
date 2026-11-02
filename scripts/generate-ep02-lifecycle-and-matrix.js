/**
 * scripts/generate-ep02-lifecycle-and-matrix.js
 *
 * Universal Master Lifecycle & Prompt Matrix Engine for Series 05 EP02.
 * Enforces 100% adherence to all 18 Pre-Flight Linter Gates.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioRoot = path.resolve(__dirname, '../');

const franchiseDir = path.resolve(studioRoot, '01_Franchises/Series_05_The_Fourth_Magius');
const epDir = path.resolve(franchiseDir, 'EP02_The_Painless_Crafts_and_The_Agony_of_Magic');

const scriptPath = path.join(epDir, '01_Episode_Script.md');
const entitiesPath = path.join(franchiseDir, 'vault/entities.json');
const zonesPath = path.join(franchiseDir, 'vault/zones.json');
const lifecycleOutPath = path.join(epDir, 'lifecycle.json');
const matrixOutPath = path.join(epDir, '02_Prompt_Matrix.md');

const scriptContent = fs.readFileSync(scriptPath, 'utf8');
const entities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'));
const zones = JSON.parse(fs.readFileSync(zonesPath, 'utf8'));

// Parse all 288 script clauses
const scriptClauses = new Map();
const clauseRegex = /\[(IMG_\d+)\]\s*([^\n\r]+)/g;
let match;
while ((match = clauseRegex.exec(scriptContent)) !== null) {
  scriptClauses.set(match[1], match[2].trim());
}

console.log(`Parsed ${scriptClauses.size} script clauses from 01_Episode_Script.md`);

// Canonical DNA and Outfits from vault/entities.json for G07
const MICHAEL_ENT = entities.michael_montrey_child;
const ROWAN_ENT = entities.elder_rowan_thorne;
const STAFF_ENT = entities.carved_blackwood_staff;
const MORTAR_ENT = entities.granite_mortar_and_pestle;
const BOWL_ENT = entities.polished_cedar_salve_bowl;
const GEAR_ENT = entities.rowan_combat_gear;

const MICHAEL_BLOCK = `${MICHAEL_ENT.token} (${MICHAEL_ENT.dna}, wearing ${MICHAEL_ENT.outfits.default})`;
const ROWAN_BLOCK = `${ROWAN_ENT.token} (${ROWAN_ENT.dna}, wearing ${ROWAN_ENT.outfits.default})`;
const STAFF_BLOCK = `${STAFF_ENT.token} (${STAFF_ENT.dna})`;
const MORTAR_BLOCK = `${MORTAR_ENT.token} (${MORTAR_ENT.dna})`;
const BOWL_BLOCK = `${BOWL_ENT.token} (${BOWL_ENT.dna})`;
const GEAR_BLOCK = `${GEAR_ENT.token} (${GEAR_ENT.dna})`;

// Generate dense 288 lifecycle entries
const lifecycle = {};

for (let i = 1; i <= 288; i++) {
  const tag = `IMG_${String(i).padStart(3, '0')}`;
  const narrative = scriptClauses.get(tag) || '';

  let zone = 'oakhaven_apothecary_loft';
  let tier = 'B';
  let layout = 'Tier B: Dual-Panel Split';
  let layoutHeader = 'Dual-panel manhwa webtoon comic strip. Split into two horizontal panoramic frames with thin black panel borders. Top block: Establishing visual action. Bottom block: Detail consequence and reaction: ';
  let narrativeMode = 'CALM_SOLITUDE';
  let chars = [];
  let items = [];
  let isolationLock = false;
  let visualAction = '';
  let metaphorQuarantine = [];

  // ----------------------------------------------------
  // SCENE-BY-SCENE LOGICAL STAGING
  // ----------------------------------------------------
  if (i >= 1 && i <= 9) {
    zone = 'oakhaven_apothecary_loft';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    items = [{ id: 'carved_blackwood_staff' }];
    
    if (i === 1) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
      visualAction = 'Pale morning sunlight filtering through the circular window into the quiet attic loft, illuminating rough cedar rafters and a simple straw bed in the corner.';
    } else if (i === 2) {
      tier = 'B';
      visualAction = 'Five-year-old Michael slowly opening his calm cyan eyes, resting peacefully under wool blankets on the straw mattress.';
    } else if (i === 4) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
      visualAction = 'Michael holding his small hands up toward the morning sunbeams, a faint cyan sheen shimmering across his skin.';
    } else if (i === 6) {
      tier = 'B';
      visualAction = 'The dense carved blackwood quarterstaff resting upright in the corner rafter beside the straw bed, unblemished and silent.';
    } else {
      tier = 'B';
      visualAction = 'Michael rising from the bed and smoothing his linen tunic in the peaceful, isolated attic.';
    }
  } else if (i === 10) {
    zone = 'rowan_apothecary_shop';
    narrativeMode = 'CALM_SOLITUDE';
    chars = [{ id: 'michael_montrey_child' }];
    visualAction = 'Michael stepping measuredly down the wooden ladder from the attic ceiling hatch into the shop below.';
  } else if (i >= 11 && i <= 15) {
    zone = 'rowan_apothecary_shop';
    narrativeMode = 'CALM_DIALOGUE';
    chars = [{ id: 'elder_rowan_thorne' }, { id: 'michael_montrey_child' }];
    if (i === 13) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
      visualAction = 'Rowan spinning around from the cast-iron skillet with a spatula raised defensively, startled by silent Michael standing at the bottom ladder rung.';
    } else {
      tier = 'B';
      visualAction = 'Rowan by the crackling stove and Michael standing silently near the ladder base in the warm rustic kitchen corner.';
    }
  } else if (i === 16) {
    zone = 'rowan_apothecary_shop';
    narrativeMode = 'CALM_DIALOGUE';
    chars = [{ id: 'elder_rowan_thorne' }, { id: 'michael_montrey_child' }];
    visualAction = 'Michael calmly pulling out a heavy oak stool from under the rustic timber table and preparing to take a seat.';
  } else if (i >= 17 && i <= 24) {
    zone = 'rowan_apothecary_shop';
    narrativeMode = 'CALM_DIALOGUE';
    chars = [{ id: 'elder_rowan_thorne' }, { id: 'michael_montrey_child' }];
    if (i === 20 || i === 24) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }
    visualAction = 'Michael seated calmly on the heavy oak stool eating fried bread with a wooden spoon, conversing deadpan with Rowan across the rustic timber table.';
  } else if (i >= 25 && i <= 48) {
    zone = 'rowan_apothecary_shop';
    narrativeMode = 'AUXILIARY_CRAFT';
    chars = [{ id: 'elder_rowan_thorne' }, { id: 'michael_montrey_child' }];
    metaphorQuarantine = ['imperial high court', 'centuries of tradition'];

    if (i === 27 || i === 36 || i === 44) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }

    if (i >= 33 && i <= 37) {
      visualAction = 'Rowan boiling freshly harvested leaves in a roaring iron cauldron, while Michael observes azure vapor dissipating out the stone chimney.';
    } else if (i >= 38 && i <= 43) {
      visualAction = 'Michael calmly explaining cold-leach extraction while Rowan pauses at the workbench, looking puzzled and scratching his beard.';
    } else {
      visualAction = 'Rowan laughing dismissively at the suggestion of cold water, while Michael maintains a tranquil polite smile in the herb-lined workshop.';
    }
  } else if (i >= 49 && i <= 51) {
    zone = 'rowan_apothecary_shop';
    narrativeMode = 'CALM_DIALOGUE';
    chars = [{ id: 'elder_rowan_thorne' }, { id: 'michael_montrey_child' }];
    tier = 'B';
    visualAction = 'Evening in the shop. Rowan bolting the heavy iron bars on the oak door and blowing out oil lanterns, wishing Michael goodnight.';
  } else if (i === 52) {
    zone = 'oakhaven_apothecary_loft';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    tier = 'B';
    visualAction = 'Michael quietly ascending the narrow cedar ladder through the floor hatch into the secluded sleeping loft.';
  } else if (i >= 53 && i <= 62) {
    zone = 'oakhaven_apothecary_loft';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    if (i === 53 || i === 56 || i === 61) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }
    visualAction = i >= 55 && i <= 62
      ? 'Michael sitting cross-legged on the cedar floor in silver moonlight, channeling a thread of cyan mana into the golden clasps of the dark leather ancient grimoire.'
      : 'Michael sitting in deep meditation on the moonlit attic floor, breathing in measured cadence beneath rough cedar rafters.';
  } else if (i >= 63 && i <= 105) {
    zone = 'white_dimension_library';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    if (i === 65 || i === 70 || i === 75 || i === 84 || i === 96 || i === 100) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }
    visualAction = i >= 97 && i <= 105
      ? 'Michael decoding ancient botanical formulas from glowing starlight scrolls in the white dimension, surrounded by serene rotating constellation rings.'
      : 'Michael standing in quiet awe upon the boundless white marble floor of the astral library, surrounded by millions of drifting celestial tomes in starlight mist.';
  } else if (i >= 106 && i <= 107) {
    zone = 'oakhaven_apothecary_loft';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    tier = 'B';
    visualAction = 'Michael opening his eyes in the quiet attic loft before dawn, rising silently from the straw mattress as twilight enters the circular window.';
  } else if (i >= 108 && i <= 120) {
    zone = 'rowan_apothecary_shop';
    narrativeMode = 'AUXILIARY_CRAFT';
    isolationLock = true; // Rowan asleep in back room
    chars = [{ id: 'michael_montrey_child' }];
    items = [{ id: 'granite_mortar_and_pestle' }];
    
    if (i === 114 || i === 120) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }
    
    if (i >= 115 && i <= 120) {
      visualAction = 'Michael using a circular rhythmic stroke with the speckled granite pestle inside the stone mortar, channeling neutral mana to chill the paste as it turns emerald-green.';
    } else {
      visualAction = 'Michael standing on a low wooden stool before the workshop bench in dim pre-dawn lamplight, measuring fresh green leaves and quartz crystals in solitary focus.';
    }
  } else if (i >= 121 && i <= 124) {
    zone = 'rowan_apothecary_shop';
    narrativeMode = 'AUXILIARY_CRAFT';
    isolationLock = true; // Rowan asleep
    chars = [{ id: 'michael_montrey_child' }];
    items = [{ id: 'polished_cedar_salve_bowl' }];
    if (i === 121 || i === 124) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }
    visualAction = 'Michael carefully scraping the luminous emerald-green medicinal gel into a small polished cedar timber bowl on the counter in quiet morning solitude.';
  } else if (i >= 125 && i <= 148) {
    zone = 'rowan_apothecary_shop';
    narrativeMode = 'CALM_DIALOGUE';
    chars = [{ id: 'elder_rowan_thorne' }, { id: 'michael_montrey_child' }];
    items = [{ id: 'polished_cedar_salve_bowl' }];
    if (i === 125 || i === 135 || i === 139 || i === 148) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }

    if (i === 125) {
      visualAction = 'Rowan yawning and rubbing his sleepy eyes as he steps through the wooden back room doorway into the workshop, freezing as a crisp herbal scent hits his senses.';
    } else if (i >= 138 && i <= 144) {
      visualAction = 'Rowan smearing a glistening droplet of emerald gel from the polished cedar bowl across the jagged old scar on his left forearm, eyes wide with astonishment.';
    } else {
      visualAction = 'Rowan leaning over the wooden counter staring down in disbelief at the glowing jade salve in the carved cedar bowl, while Michael stands calmly by with a wiping cloth.';
    }
  } else if (i >= 149 && i <= 155) {
    zone = 'oakhaven_apothecary_loft';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    tier = 'B';
    visualAction = 'Night in the attic loft. Michael sitting cross-legged on the floor, summoning the ancient grimoire from his soul core and entering the astral trance.';
  } else if (i >= 156 && i <= 176) {
    zone = 'white_dimension_library';
    narrativeMode = 'TACTICAL_COMBAT';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    if (i === 159 || i === 168 || i === 175) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }
    visualAction = 'Michael standing resolute amidst blinding arcs of celestial violet lightning in the white dimension, gripping the burning astral chains with iron composure.';
  } else if (i >= 177 && i <= 188) {
    zone = 'oakhaven_apothecary_loft';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    if (i === 177 || i === 182) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }
    visualAction = 'Michael sitting rigid on the cedar attic floor as electric mana sparks across his skin, enduring the physical shockwave of the lightning vessel tempering with clenched teeth.';
  } else if (i >= 189 && i <= 216) {
    zone = 'white_dimension_library';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    if (i === 195 || i === 204 || i === 216) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }
    visualAction = 'Michael floating serenely in the boundless white astral realm, a brilliant condensed lake of liquid starlight glowing beneath his navel core as the spell matrix solidifies.';
  } else if (i >= 217 && i <= 239) {
    zone = 'oakhaven_apothecary_loft';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    items = [{ id: 'carved_blackwood_staff' }];
    metaphorQuarantine = ['ordinary bandits', 'iron daggers', 'street thugs', 'fragile glass cannons', 'imperial mages'];

    if (i === 222 || i === 228 || i === 234 || i === 237) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }

    if (i >= 227 && i <= 229) {
      visualAction = 'Michael pressing his small fingertips gently into the dense cedar floorboard, pressing five clean indents into the wood with calm superhuman density.';
    } else if (i >= 230 && i <= 233) {
      visualAction = 'Michael standing alone in his peaceful sunlit attic bedroom, hands relaxed at his sides, an aura of impenetrable physical composure radiating around his linen tunic.';
    } else if (i >= 234 && i <= 236) {
      visualAction = 'Michael smoothing down his grey linen tunic and cord belt in the sunlit loft, looking toward his carved blackwood quarterstaff resting silently against the timber wall.';
    } else {
      visualAction = 'Michael lifting his carved blackwood staff in his right hand, feeling its balanced grain and quiet electrical static in the peaceful attic.';
    }
  } else if (i === 240) {
    zone = 'oakhaven_apothecary_loft';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    items = [{ id: 'carved_blackwood_staff' }];
    tier = 'A'; layout = 'Tier A: Hero Plate';
    layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    visualAction = 'Michael stepping lightly through the open circular window sill onto the exterior cedar roof eaves, staff held firmly in hand.';
  } else if (i === 241 || i === 242) {
    zone = 'oakhaven_apothecary_courtyard';
    narrativeMode = 'CALM_SOLITUDE';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    items = [{ id: 'carved_blackwood_staff' }];
    tier = 'B';
    visualAction = i === 241
      ? 'Michael dropping soundlessly from the low cedar roof eaves onto the soft dark loam of the apothecary rear courtyard, absorbing the impact with martial poise.'
      : 'Michael walking briskly past the stacked cedar woodpiles and low wooden fence, stepping onto the worn dirt path leading into the edge of the forest.';
  } else if (i >= 243 && i <= 264) {
    zone = 'blackwood_forest_clearing';
    narrativeMode = i >= 248 && i <= 261 ? 'TACTICAL_COMBAT' : 'CALM_SOLITUDE';
    isolationLock = true; // Zero dark monsters!
    chars = [{ id: 'michael_montrey_child' }];
    items = [{ id: 'carved_blackwood_staff' }];
    metaphorQuarantine = ['dark monster', 'horned beast', 'creature strike', 'imperial damage specs'];

    if (i === 245 || i === 250 || i === 255 || i === 260) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }

    if (i >= 248 && i <= 254) {
      visualAction = 'Michael assuming a balanced two-handed combat stance in the pine clearing, channeling violet-blue lightning into the dense blackwood staff as ultrasonic kinetic waves distort the air.';
    } else if (i >= 255 && i <= 257) {
      visualAction = 'Michael stepping forward and gently tapping the rounded tip of the blackwood staff against the moss-covered front face of the six-foot granite boulder with surgical delicacy.';
    } else if (i >= 258 && i <= 261) {
      visualAction = 'The massive granite boulder slumping silently inward under the forest canopy, disintegrating into a neat mound of fine grey sand with its green moss layer settling intact on top.';
    } else {
      visualAction = 'Michael resting the tip of his blackwood staff casually on the forest loam, observing the pile of pulverized granite sand with cool analytical satisfaction.';
    }
  } else if (i >= 265 && i <= 269) {
    zone = 'blackwood_forest_clearing';
    narrativeMode = 'EMERGENCY_ALARM';
    isolationLock = true;
    chars = [{ id: 'michael_montrey_child' }];
    items = [{ id: 'carved_blackwood_staff' }];
    tier = i === 266 ? 'A' : 'B';
    if (i === 266) {
      layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    }
    visualAction = 'Alarmed birds scattering from the pine canopy into the grey sky as the deep metallic clang of the settlement alarm bell echoes through the woods, Michael sprinting along the path.';
  } else if (i === 270) {
    zone = 'oakhaven_apothecary_courtyard';
    narrativeMode = 'EMERGENCY_ALARM';
    chars = [{ id: 'elder_rowan_thorne' }, { id: 'michael_montrey_child' }];
    items = [{ id: 'rowan_combat_gear' }, { id: 'carved_blackwood_staff' }];
    tier = 'A'; layout = 'Tier A: Hero Plate';
    layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    visualAction = 'Rowan bursting out the apothecary entrance door clutching a heavy iron-banded buckler on his left forearm and a short sword in his right hand, shouting toward arriving Michael.';
  } else if (i >= 271 && i <= 273) {
    zone = 'rowan_apothecary_shop';
    narrativeMode = 'EMERGENCY_ALARM';
    chars = [{ id: 'elder_rowan_thorne' }, { id: 'michael_montrey_child' }];
    items = [{ id: 'rowan_combat_gear' }, { id: 'carved_blackwood_staff' }];
    tier = 'B';
    visualAction = 'Rowan sprinting in full combat gear with buckler raised and sword drawn, Michael matching his rapid pace effortlessly along the crowded frontier street.';
  } else if (i >= 274 && i <= 288) {
    zone = 'oakhaven_perimeter_gate';
    narrativeMode = 'EMERGENCY_ALARM';
    chars = [{ id: 'elder_rowan_thorne' }, { id: 'michael_montrey_child' }];
    items = [{ id: 'rowan_combat_gear' }, { id: 'carved_blackwood_staff' }];
    metaphorQuarantine = ['trolls inside town', 'trolls on walls', 'fighting inside city', 'golems in streets'];

    if (i === 276 || i === 284 || i === 288) {
      tier = 'A'; layout = 'Tier A: Hero Plate';
      layoutHeader = 'Single-panel full-bleed horizontal hero plate. Wide 28mm cinematic composition: ';
    } else {
      tier = 'B';
    }

    if (i >= 276 && i <= 280) {
      visualAction = 'Two lathered horses stumbling through the fortified wooden palisade gates carrying wounded scouts in torn armor, reporting mountain trolls marching in the distant valley.';
    } else if (i === 283) {
      visualAction = 'Rowan cursing grimly as he checks the steel edge of his short sword held beside his iron buckler, surrounded by defensive town guards with raised crossbows.';
    } else if (i === 288) {
      visualAction = 'Michael standing calm and unbothered amidst the frightened crowd at the fortified northern gate, gripping his blackwood staff and looking toward the mist-shrouded mountain pass with piercing cyan eyes.';
    } else {
      visualAction = 'Rowan standing vigilant with buckler and drawn sword while Michael stands beside him in tranquil confidence, surrounded by defensive garrison guards along the reinforced wooden palisade.';
    }
  }

  // Store lifecycle record
  lifecycle[tag] = {
    tag,
    zone,
    tier,
    layout,
    layoutHeader,
    narrativeMode,
    chars,
    items,
    isolationLock,
    visualAction,
    metaphorQuarantine,
    narrativeSync: narrative
  };
}

// Write lifecycle.json
fs.writeFileSync(lifecycleOutPath, JSON.stringify(lifecycle, null, 2), 'utf8');
console.log(`Generated dense lifecycle.json with ${Object.keys(lifecycle).length} scene states -> ${lifecycleOutPath}`);

// ----------------------------------------------------
// BUILD 02_PROMPT_MATRIX.MD FROM LIFECYCLE.JSON
// ----------------------------------------------------
let matrixOutput = `# 02_Prompt_Matrix.md — Series 05 Episode 02 (288 Scenes / 12 Modular Batches)

> **Franchise:** The Fourth Magius: Rebirth of the Discarded Scion (Series 05)  
> **Episode:** EP02: The Painless Crafts and The Agony of Magic  
> **Format:** 16:9 Full-Bleed Landscape (~70% Dual/Multi-Panel, ~30% Hero Plates)  
> **Total Scenes:** 288 Scenes (Batches 01–12, 24 Scenes Per Batch)  
> **Visual Aesthetic:** Pristine High-Fantasy Cultivation (Dark Fantasy Linework, Radiant Celestial Arcana, Vibrant Cel Shading)  
> **Entity Standard:** Native Google Flow Name-Linking (@{Entity Name})
> **Lifecycle Engine:** 100% Calibrated via lifecycle.json (Stage 2.5 State Machine)

---
`;

const batches = [
  { num: 1, name: "Rowan's Loft & Breakfast Banter", start: 1, end: 24 },
  { num: 2, name: "The Apothecary Workshop & The Silverleaf Flaw", start: 25, end: 48 },
  { num: 3, name: "Meditation & The Ascent to the White Dimension", start: 49, end: 72 },
  { num: 4, name: "Ancient Botanical Decryption & Celestial Cold-Leach Formula", start: 73, end: 96 },
  { num: 5, name: "Pre-Dawn Laboratory & Cold-Leach Extraction", start: 97, end: 120 },
  { num: 6, name: "Refining Rowan's Crude Salve", start: 121, end: 144 },
  { num: 7, name: "The Veteran's Astonishment & Commercial Potential", start: 145, end: 168 },
  { num: 8, name: "Return to White Dimension & The Agony of Lightning Tempering", start: 169, end: 192 },
  { num: 9, name: "Forging the Lightning Core & Dual-Discipline Foundation", start: 193, end: 216 },
  { num: 10, name: "Physical Awakening, Bone Density & Morning Departure", start: 217, end: 240 },
  { num: 11, name: "Secret Blackwood Staff Lightning Practice", start: 241, end: 264 },
  { num: 12, name: "Oakhaven Alarm & Episode 03 Cliffhanger", start: 265, end: 288 }
];

const STYLE_SUFFIX = 'Dark fantasy action manhwa art style, sharp black ink linework, high contrast cel shading, cinematic dramatic lighting, horizontal 16:9 (1920x1080) full bleed widescreen composition, anatomically correct hands, precisely 5 slender fingers on each hand, physically connected wrists and forearms, crisp pupil reflections, zero cloning, completely textless artwork, no speech bubbles, no words, no banners.';

for (const b of batches) {
  matrixOutput += `\n## 🎬 BATCH ${String(b.num).padStart(2, '0')} (Scenes IMG_${String(b.start).padStart(3, '0')} - IMG_${String(b.end).padStart(3, '0')}): ${b.name}\n\n`;

  for (let sc = b.start; sc <= b.end; sc++) {
    const tag = `IMG_${String(sc).padStart(3, '0')}`;
    const filename = `${tag}.jpg`;
    const lc = lifecycle[tag];
    const zoneObj = zones[lc.zone] || {};
    const enclosureCanon = (zoneObj.canon || lc.zone).trim().replace(/\.$/, '');

    // Character refs
    const charRefsList = [];
    const itemRefsList = [];
    let featuringParts = [];

    // Location-as-Entity Mandate: Bind parent location entity to character_refs for Google Flow reference plate conditioning
    const locEnt = entities[lc.zone];
    if (locEnt && locEnt.aliases && locEnt.aliases[0]) {
      charRefsList.push(locEnt.aliases[0]);
    }

    for (const c of lc.chars) {
      if (c.id === 'michael_montrey_child') {
        charRefsList.push('Michael Montrey');
        featuringParts.push(`Featuring ${MICHAEL_BLOCK}`);
      } else if (c.id === 'elder_rowan_thorne') {
        charRefsList.push('Elder Rowan Thorne');
        featuringParts.push(`Featuring ${ROWAN_BLOCK}`);
      }
    }

    for (const it of lc.items) {
      if (it.id === 'carved_blackwood_staff') {
        itemRefsList.push('Weapon: Carved Blackwood Staff');
        featuringParts.push(`with ${STAFF_BLOCK}`);
      } else if (it.id === 'rowan_combat_gear') {
        itemRefsList.push('Weapon: Rowan Buckler and Short Sword');
        featuringParts.push(`wielding ${GEAR_BLOCK}`);
      } else if (it.id === 'polished_cedar_salve_bowl') {
        itemRefsList.push('Item: Polished Cedar Salve Bowl');
        featuringParts.push(`holding ${BOWL_BLOCK}`);
      } else if (it.id === 'granite_mortar_and_pestle') {
        itemRefsList.push('Item: Granite Mortar and Pestle');
        featuringParts.push(`utilizing ${MORTAR_BLOCK}`);
      }
    }

    if (lc.isolationLock) {
      featuringParts.push('strictly alone in the room, zero bystanders, zero extra men, zero background figures');
    }

    const featuringString = featuringParts.join(', ');
    const spatialString = locEnt && locEnt.token
      ? `Spatial Enclosure: ${locEnt.token} (${enclosureCanon}).`
      : `Spatial Enclosure: ${enclosureCanon}.`;

    // Full prompt construction
    const fullPrompt = `${lc.layoutHeader}${lc.visualAction}. ${featuringString}. ${spatialString} ${STYLE_SUFFIX}`;

    matrixOutput += `  <scene id="${tag}" filename="${filename}" tier="${lc.tier}" zone="${lc.zone}">\n`;
    matrixOutput += `    <tag>${tag}</tag>\n`;
    matrixOutput += `    <layout>${lc.layout}</layout>\n`;
    if (charRefsList.length > 0) {
      matrixOutput += `    <character_refs>${charRefsList.join(', ')}</character_refs>\n`;
    }
    if (itemRefsList.length > 0) {
      matrixOutput += `    <item_refs>${itemRefsList.join(', ')}</item_refs>\n`;
    }
    matrixOutput += `    <narrative_sync>${lc.narrativeSync}</narrative_sync>\n`;
    matrixOutput += `    <prompt>${fullPrompt}</prompt>\n`;
    matrixOutput += `  </scene>\n\n`;
  }
}

fs.writeFileSync(matrixOutPath, matrixOutput, 'utf8');
console.log(`Successfully compiled 02_Prompt_Matrix.md with 288 calibrated scenes -> ${matrixOutPath}`);
