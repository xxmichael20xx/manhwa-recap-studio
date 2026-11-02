import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PromptDnaCompiler } from '../server/services/promptDnaCompiler.js';
import { AntiSlopValidator } from '../server/services/antiSlopValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioRoot = path.resolve(__dirname, '../..');

const franchiseDir = path.resolve(studioRoot, '01_Franchises/Series_06_The_Archmage_Engineer');
const epDir = path.resolve(franchiseDir, 'EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival');

const scriptPath = path.join(epDir, '01_Episode_Script.md');
const outputPath = path.join(epDir, '02_Prompt_Matrix.md');
const manifestPath = path.join(epDir, 'dispatch_manifest.json');
const franchiseJsonPath = path.join(franchiseDir, 'franchise.json');
const entitiesPath = path.join(franchiseDir, 'vault/entities.json');
const zonesPath = path.join(franchiseDir, 'vault/zones.json');
const legacyCharsPath = path.join(franchiseDir, 'character_vault/characters.json');
const legacyItemsPath = path.join(franchiseDir, 'character_vault/items.json');
const legacyLocationsPath = path.join(franchiseDir, '00_Locations/locations.json');
const ledgerPath = path.join(epDir, 'state_events.jsonl');

let scriptContent = fs.readFileSync(scriptPath, 'utf8');
const rawFranchise = fs.existsSync(franchiseJsonPath) ? JSON.parse(fs.readFileSync(franchiseJsonPath, 'utf8')) : {};
const rawEntities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'));
const rawZones = JSON.parse(fs.readFileSync(zonesPath, 'utf8'));
const legacyChars = fs.existsSync(legacyCharsPath) ? (JSON.parse(fs.readFileSync(legacyCharsPath, 'utf8')).characters || []) : [];
const legacyItems = fs.existsSync(legacyItemsPath) ? (JSON.parse(fs.readFileSync(legacyItemsPath, 'utf8')).items || []) : [];
const legacyLocations = fs.existsSync(legacyLocationsPath) ? (JSON.parse(fs.readFileSync(legacyLocationsPath, 'utf8')).locations || []) : [];
const ledgerText = fs.existsSync(ledgerPath) ? fs.readFileSync(ledgerPath, 'utf8') : '';

const normalizedVault = AntiSlopValidator.normalizeVaultContext({
  franchise: rawFranchise,
  entities: rawEntities,
  zones: rawZones,
  characters: legacyChars,
  items: legacyItems,
  locations: legacyLocations,
  ledgerText
});
const { franchise, entities, zones, ledgerEvents } = normalizedVault;

// Parse all 480 scene clauses
const matches = [...scriptContent.matchAll(/(?:^|\n)\s*\[(IMG_\d+)\]\s*([\s\S]*?)(?=(?:\n\s*\[IMG_\d+\]|$))/gi)];
console.log(`Parsed ${matches.length} scene clauses from 01_Episode_Script.md`);

function normalizeClause(text = '') {
  return String(text)
    .replace(/^#{1,6}\s+[^\n]+/gm, '')
    .replace(/^>\s+[^\n]+/gm, '')
    .replace(/\*\*(?:Runtime|Word Count|Visual Plates):\*\*.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[END OF .*?\]/gi, '')
    .replace(/---+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getEntityBlock(id) {
  const ent = entities[id];
  if (!ent) throw new Error(`Unknown entity id: ${id}`);
  if (ent.kind === 'location' || ent.kind === 'item' || ent.kind === 'mount') {
    return `${ent.token} (${ent.dna})`;
  }
  const outfit = ent.outfits?.[ent.default_outfit || 'default'] || Object.values(ent.outfits || {})[0] || '';
  return `${ent.token} (${ent.dna}, wearing ${outfit})`;
}

// Tier distribution pattern guaranteeing ~70% multi-panel
const TIER_CYCLE = [
  "Tier A: Hero Plate",
  "Tier B: Dual-Panel Split",
  "Tier B: Dual-Panel Split",
  "Tier C: Three-Panel Action Strip",
  "Tier B: Dual-Panel Split",
  "Tier A: Hero Plate",
  "Tier B: Dual-Panel Split",
  "Tier C: Three-Panel Action Strip",
  "Tier B: Dual-Panel Split",
  "Tier B: Dual-Panel Split",
  "Tier A: Hero Plate",
  "Tier B: Dual-Panel Split"
];

// Explicit per-scene specs for all 480 scenes (Batches 1-20)
const EXPLICIT_SCENE_SPECS = {
  // Batch 01 bespoke scenes (1-24)
  1: { zone: "miller_sanctuary_farm_exterior", chars: [], action: "At flat valley-floor ground level inside the grassy farmyard, majestic morning sun rising gently over distant snow-crested mountain peaks, bathing the rustic single-story timber-and-white-stone cottage with closed wooden window shutters, white-stone draft chimney, covered white-stone water channel, cylindrical stone water filter tank, natural packed-earth and grass path, and purple lavender rows in soft golden morning light" },
  2: { zone: "old_miller_cottage_interior", chars: [], action: "warm morning sunbeams streaming through rustic cottage timber rafters into the peaceful empty living room and stone hearth" },
  3: { zone: "old_miller_cottage_interior", chars: ["ace_miller"], action: "@{Ace Miller} sitting alone at the sturdy timber kitchen table in the quiet pre-dawn hours, drinking herbal tea and sketching in an open leather notebook with quiet focus" },
  4: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "lumina"], action: "@{Ace Miller} present as the friendly sky-blue interface of @{LUMINA} hovers peacefully beside him in the dim morning air, glowing emoji face smiling" },
  5: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "lumina"], action: "@{Ace Miller} smiling with relaxed poise while glancing over at the floating sky-blue interface of @{LUMINA}" },
  6: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "lumina"], action: "@{Ace Miller} watching as the interface of @{LUMINA} pulses with soft light, projecting a clean status bar in mid-air" },
  7: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "lumina"], action: "@{Ace Miller} listening attentively as cheerful status indicators display smoothly on the glowing UI panel" },
  8: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "the heavy wooden bedroom door swinging open as @{Garrett Miller} steps into the warm kitchen, stretching broad muscular shoulders with a hearty yawn while 10-year-old @{Ace Miller} glances up from the table" },
  9: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "@{Garrett Miller} greeting warmly by the kitchen table with a kind rugged smile and rubbing tired eyes while 10-year-old @{Ace Miller} looks up cheerfully" },
  10: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "10-year-old @{Ace Miller} and his father @{Garrett Miller} conversing warmly by the table, tapping a wooden teacup with a cheerful humble grin" },
  11: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "sitting side by side at the table, 10-year-old @{Ace Miller} visibly smaller with youthful boy build beside his broad-shouldered father @{Garrett Miller}, looking admiringly at the open sketches" },
  12: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "10-year-old @{Ace Miller} and his father @{Garrett Miller} looking toward the wallboards while discussing cold winter drafts" },
  13: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "10-year-old @{Ace Miller} turning to a clean page in the leather notebook and drawing structural insulation diagrams beside @{Garrett Miller}" },
  14: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "10-year-old @{Ace Miller} pointing to architectural notes while discussing thermal masonry insulation with @{Garrett Miller}" },
  15: { zone: "old_miller_cottage_interior", chars: ["clara_miller", "garrett_miller"], action: "@{Clara Miller} stepping into the kitchen tying a clean linen apron over her dress, carrying a basket of dried alpine herbs and flour toward @{Garrett Miller}" },
  16: { zone: "old_miller_cottage_interior", chars: ["clara_miller", "garrett_miller"], action: "@{Clara Miller} resting a gentle comforting hand on the shoulder of @{Garrett Miller} with a warm, reassuring smile" },
  17: { zone: "old_miller_cottage_interior", chars: ["clara_miller", "garrett_miller"], action: "@{Clara Miller} and @{Garrett Miller} resting strong calloused hands on the table with solemn determination, recalling frontier winters" },
  18: { zone: "old_miller_cottage_interior", chars: ["clara_miller", "garrett_miller"], action: "@{Clara Miller} and @{Garrett Miller} speaking with protective resolve and family pride in the warm kitchen" },
  19: { zone: "old_miller_cottage_interior", chars: ["maya_miller"], action: "@{Maya Miller} bouncing energetically out of her bedroom with chestnut hair tied in a sky-blue ribbon, stretching her arms hungrily" },
  20: { zone: "old_miller_cottage_interior", chars: ["maya_miller", "clara_miller"], action: "@{Maya Miller} laughing enthusiastically and stretching her arms as @{Clara Miller} prepares morning breakfast" },
  21: { zone: "old_miller_cottage_interior", chars: ["clara_miller", "garrett_miller"], action: "@{Clara Miller} kneading fresh skillet bread dough while @{Garrett Miller} walks over toward the heavy wooden artisan chest by the wall" },
  22: { zone: "old_miller_cottage_interior", chars: ["garrett_miller"], action: "@{Garrett Miller} turning an antique brass key in the chest lock and carefully lifting out yellowed rolls" },
  23: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "sitting together at the timber table, @{Garrett Miller} carefully spreading grandfather's ancient architectural masonry diagrams across the table for 10-year-old @{Ace Miller}, who watches with bright youthful enthusiasm" },
  24: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "lumina"], action: "@{Ace Miller} and @{LUMINA} leaning forward intently over the intricate tongue-and-groove limestone designs" },

  // Batch 02 bespoke scenes (25-48)
  25: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "at the timber kitchen table, 10-year-old @{Ace Miller} leans forward with bright emerald eyes studying the interlocking stone joinery diagrams beside @{Garrett Miller}" },
  26: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "at the timber table, @{Garrett Miller} taps his calloused finger on the masonry diagram while explaining dry-stone geometry to 10-year-old @{Ace Miller}" },
  27: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "beside the wooden table, 10-year-old @{Ace Miller} traces the interlocking mortise-and-tenon stone teeth with his fingertip as @{Garrett Miller} nods proudly" },
  28: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "lumina"], action: "above the wooden table, @{LUMINA} projects glowing golden structural load-bearing vectors in mid-air while 10-year-old @{Ace Miller} observes the angles intently" },
  29: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "sitting at the kitchen table, @{Garrett Miller} rubs his stubbled chin thoughtfully while looking at 10-year-old @{Ace Miller} across the open workspace" },
  30: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "at the cottage table, 10-year-old @{Ace Miller} looks up at his father @{Garrett Miller} with a warm confident smile and complete faith" },
  31: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "in the warm cottage kitchen, @{Garrett Miller} throws his head back in a hearty, booming laugh beside 10-year-old @{Ace Miller} as the wooden teacups vibrate slightly" },
  32: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "at the timber table, 10-year-old @{Ace Miller} picks up a clean charcoal stick and draws a smooth sine wave curve for @{Garrett Miller}" },
  33: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "walking down the sunlit grassy valley trail toward the rushing mountain river, 10-year-old @{Ace Miller} strides eagerly beside his broad-shouldered father @{Garrett Miller}" },
  34: { zone: "emerald_valley_forest_trail", chars: [], action: "massive natural outcrop of fine-grained pale white limestone rising beside the sparkling mountain river bend under bright morning sunlight" },
  35: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "lumina"], action: "crouching beside the pale white limestone outcrop on the riverbank, 10-year-old @{Ace Miller} presses his small palm against the cool stone as @{LUMINA} hovers nearby" },
  36: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "lumina"], action: "beside the riverside cliff face, @{LUMINA} projects a glowing web of sapphire-blue acoustic contour lines across the natural cleavage planes of the white limestone for @{Ace Miller}" },
  37: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "at the limestone outcrop, 10-year-old @{Ace Miller} gently guides the large calloused palm of @{Garrett Miller} onto a natural fault line along the pale rock face" },
  38: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "standing close to the white limestone cliff, 10-year-old @{Ace Miller} points along the glowing blue harmonic contour line while instructing @{Garrett Miller}" },
  39: { zone: "emerald_valley_forest_trail", chars: ["garrett_miller"], action: "pressing his palm against the white limestone cliff, @{Garrett Miller} closes his eyes and takes a slow, deep breath as warm amber earth mana hums around his chest" },
  40: { zone: "emerald_valley_forest_trail", chars: ["garrett_miller"], action: "close-up on the calloused hand of @{Garrett Miller} resting on the pale limestone face as soft golden-amber earth mana ripples gently into the microscopic stone grain" },
  41: { zone: "emerald_valley_forest_trail", chars: [], action: "a massive, razor-straight rectangular slab of snow-white limestone shearing cleanly away from the riverside cliff face along a glowing amber fault line" },
  42: { zone: "emerald_valley_forest_trail", chars: ["garrett_miller"], action: "standing before the freshly sheared white limestone slab, @{Garrett Miller} opens his amber-brown eyes wide and stares at his trembling fingers in sheer disbelief" },
  43: { zone: "emerald_valley_forest_trail", chars: ["garrett_miller", "ace_miller"], action: "beside the river bend, @{Garrett Miller} runs his hand in awe across the mirror-smooth cut surface of the white limestone block while 10-year-old @{Ace Miller} beams" },
  44: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "standing by the cleaved limestone slab on the riverbank, 10-year-old @{Ace Miller} chuckles and gestures with precision beside his amazed father @{Garrett Miller}" },
  45: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "along the sunlit riverbank, 10-year-old @{Ace Miller} and @{Garrett Miller} work in synchronized rhythm cutting white limestone blocks" },
  46: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "on the rocky riverbank, @{Garrett Miller} cleaves large white stone slabs with earth mana while 10-year-old @{Ace Miller} shapes precision interlocking tongues and grooves along the block edges" },
  47: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "on the grassy riverbank behind @{Ace Miller} and @{Garrett Miller}, neat rows of mathematically uniform snow-white interlocking masonry blocks rise in tidy stacks" },
  48: { zone: "emerald_valley_forest_trail", chars: [], action: "nearly one hundred precision-cut white interlocking limestone foundation blocks stacked neatly along the sunlit mountain riverbank under an azure alpine sky" },

  // Batch 03 bespoke scenes (49-72)
  49: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "In the foreground on the rocky riverbank, @{Ace Miller} and @{Garrett Miller} stand beside massive stacks of cut white limestone blocks, looking up the grassy slope toward the distant homestead" },
  50: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "In the center-stage on the rocky riverbank, @{Garrett Miller} gestures with a calloused hand while discussing muddy frontier roads with @{Ace Miller}, who listens intently" },
  51: { zone: "emerald_valley_forest_trail", chars: ["ace_miller"], action: "In the left foreground on the rocky riverbank, @{Ace Miller} shakes his head with a determined smile, pointing up toward the pristine green meadow slope" },
  52: { zone: "emerald_valley_forest_trail", chars: ["ace_miller"], action: "In center-stage on the riverbank, @{Ace Miller} cups his hands around his mouth and calls out loudly up the hill, waving his right arm energetically" },
  53: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller"], action: "In the center foreground on the grassy hillside, @{Maya Miller} jogs happily down the slope, her hands firmly gripping the thick ropes of two heavy oak timber sledges dragging behind her" },
  54: { zone: "emerald_valley_forest_trail", chars: ["maya_miller"], action: "In the left foreground on the rocky riverbank, @{Maya Miller} stands with both hands planted confidently on her hips, her bright amber eyes wide as she stares at the massive stacks of white limestone blocks" },
  55: { zone: "emerald_valley_forest_trail", chars: ["ace_miller"], action: "In the center foreground on the riverbank, @{Ace Miller} grins proudly as he pulls a thick coil of hemp rope and smooth wooden birch pulleys from his leather craftsman pouch" },
  56: { zone: "emerald_valley_forest_trail", chars: ["ace_miller"], action: "In the right foreground on the grassy hill crest, @{Ace Miller} firmly ties a thick hemp rope around the trunk of a massive alpine pine tree, securing a polished wooden pulley block" },
  57: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "In center-stage on the grassy hill, @{Ace Miller} explains the pulley mechanics while handing the thick hemp rope to @{Maya Miller}" },
  58: { zone: "emerald_valley_forest_trail", chars: ["maya_miller"], action: "In the left foreground on the grassy hill, @{Maya Miller} beams with a confident, energetic smile, her amber eyes glowing softly with mint-green wind mana" },
  59: { zone: "emerald_valley_forest_trail", chars: ["ace_miller"], action: "In center-stage on the grassy hill, @{Ace Miller} points precisely at the wooden pulley block, instructing his sister on the mechanical physics of force multiplication" },
  60: { zone: "emerald_valley_forest_trail", chars: ["maya_miller"], action: "In the foreground on the grassy hill, @{Maya Miller} leans back with her boots planted firmly, pulling the taut hemp rope as a swirling vortex of mint-green wind mana wraps around the rope and her arms" },
  61: { zone: "emerald_valley_forest_trail", chars: ["maya_miller"], action: "In center-stage on the grassy hill, @{Maya Miller} laughs with pure joyful delight, easily pulling the rope as the heavy sledge glides uphill behind her" },
  62: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "In the background on the grassy hill, @{Garrett Miller} and @{Ace Miller} walk behind the gliding wooden sledge, smiling proudly as they gently guide the rear runners up the slope" },
  63: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the courtyard beside the cottage, @{Garrett Miller} and @{Ace Miller} stand proudly beside three towering, perfectly neat stacks of pristine white limestone blocks" },
  64: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller"], action: "In the center foreground of the courtyard, @{Clara Miller} steps out of the cottage carrying a wooden serving tray loaded with earthen water jugs and sliced red apples, her eyes wide with marvel" },
  65: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "In the right foreground of the courtyard, @{Ace Miller} wipes a bead of sweat from his forehead with the back of his hand, grinning enthusiastically as he points to the excavated foundation trench" },
  66: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "In center-stage in the courtyard, @{Garrett Miller} kneels beside the gravel-packed foundation trench, his strong hands carefully lowering the very first heavy white limestone block into place" },
  67: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Close-up detailed view of the heavy white limestone block settling perfectly into the gravel foundation trench under the firm grip of @{Garrett Miller}'s calloused hands" },
  68: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "In center-stage, @{Garrett Miller} firmly slides the carved protruding tongue of a white limestone block directly into the carved groove of the adjacent block, locking them together" },
  69: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Macro extreme close-up of the flawless, zero-gap interlocking vertical seam between two smooth white limestone blocks, fitting together tighter than puzzle pieces beside @{Garrett Miller}" },
  70: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the courtyard, @{Garrett Miller} and @{Ace Miller} work side by side, stacking alternating layers of pristine white limestone blocks as the solid wall begins to rise waist-high" },
  71: { zone: "miller_sanctuary_farm_exterior", chars: [], action: "In the sunlit courtyard, a pristine, newly constructed ten-foot-tall white limestone extension wing stands seamlessly attached to the side of the rustic wooden cottage with open unglazed stone window cutouts, its mortarless walls gleaming in the sun" },
  72: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "In the foreground, @{Garrett Miller} steps back and rests both hands proudly on his hips, gazing up at the flawless white stone wall with a look of profound awe and tearful joy" },

  // Batch 04 bespoke scenes (73-96): ZERO premature glass! Open unglazed stone window cutouts at cottage (73-79), then upstream river shoals (80-95), then returning to farmyard with buckets (96)
  73: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "In the sunlit courtyard beside the newly built white limestone extension wing, 10-year-old @{Ace Miller} steps through an open, empty unglazed rectangular stone wall cutout where no window is installed yet, resting his hand on the bare white limestone sill" },
  74: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the three open unglazed stone window cutouts in the southern wall, 10-year-old @{Ace Miller} points toward the valley peaks while @{Garrett Miller} looks on" },
  75: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Leaning his broad shoulder against the bare white-stone doorframe, @{Garrett Miller} gestures toward the old wooden cottage's heavy timber storm shutters while discussing traditional frontier carpentry" },
  76: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller"], action: "Standing beside the open, unglazed stone wall cutout, @{Maya Miller} wrinkles her nose and pouts expressively while pointing at the heavy dark wooden storm shutters on the old cottage wall" },
  77: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "maya_miller"], action: "Standing before the bare, empty rectangular white-stone window cutout, 10-year-old @{Ace Miller} taps the smooth stone sill with a knowing grin as @{Maya Miller} tilts her head curiously" },
  78: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller", "ace_miller"], action: "Beside the open unglazed white-stone wall cutout, @{Maya Miller} gasps with wide amber eyes and clasps her hands together in amazement while looking at 10-year-old @{Ace Miller}" },
  79: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "maya_miller"], action: "In the courtyard beside the unglazed white-stone extension wall, 10-year-old @{Ace Miller} chuckles and points down the grassy valley slope toward the rushing mountain river while @{Maya Miller} listens eagerly" },
  80: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "Walking side by side along the shallow rocky shoals of the mountain river upstream in the forest, 10-year-old @{Ace Miller} and @{Maya Miller} follow the clear rushing water" },
  81: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "Rounding a sheltered river bend where the rushing mountain water slows into a calm eddy, 10-year-old @{Ace Miller} pauses on the mossy bank beside @{Maya Miller}, his emerald eyes fixed on a diamond-like glimmer beneath the shallow water" },
  82: { zone: "emerald_valley_forest_trail", chars: ["ace_miller"], action: "On the mossy riverbank, 10-year-old @{Ace Miller} points eagerly at the shallow eddy while kicking off his brown leather boots and rolling up his trouser cuffs to wade into the ankle-deep water" },
  83: { zone: "emerald_valley_forest_trail", chars: ["ace_miller"], action: "Standing barefoot in the ankle-deep crystal mountain river, 10-year-old @{Ace Miller} scoops up a dripping double-handful of fine glistening river deposit and holds it high into the afternoon sunbeams" },
  84: { zone: "emerald_valley_forest_trail", chars: [], action: "Extreme macro close-up of wet, translucent white alpine quartz crystal grains resting on a sunlit mossy river stone, sparkling with diamond-like clarity under afternoon sunbeams" },
  85: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "lumina"], action: "Wading in the shallow river shoals, 10-year-old @{Ace Miller} holds his cupped hands steady as @{LUMINA} projects a glowing sky-blue magnifying scan lens over the wet crystalline grains" },
  86: { zone: "emerald_valley_forest_trail", chars: ["lumina"], action: "Hovering above the sparkling riverbed, @{LUMINA} beams with an energetic emoji smile while displaying a glowing holographic 99.2% mineral purity chart and crystal lattice diagram" },
  87: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "At the sunlit water's edge, 10-year-old @{Ace Miller} opens his wet palms toward @{Maya Miller} so she can inspect the clean, iron-free white crystalline quartz grains glittering in his hands" },
  88: { zone: "emerald_valley_forest_trail", chars: ["maya_miller", "ace_miller"], action: "Crouching on the sunlit riverbank beside @{Ace Miller}, @{Maya Miller} dips her fingertips into the cool, sparkling white river deposit with a fascinated smile" },
  89: { zone: "emerald_valley_forest_trail", chars: ["maya_miller", "ace_miller"], action: "Kneeling beside the clear mountain stream, @{Maya Miller} looks up at 10-year-old @{Ace Miller} with genuine curiosity while holding a pinch of sparkling river grains between her fingers" },
  90: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "Standing ankle-deep in the clear river eddy, 10-year-old @{Ace Miller} gestures flat across an imaginary stone table with both palms while explaining high-temperature melting to @{Maya Miller}" },
  91: { zone: "emerald_valley_forest_trail", chars: ["maya_miller"], action: "On the wooded riverbank, @{Maya Miller} blinks in comical disbelief with her jaw dropping and both hands raised wide as she wonders how solid rock could ever be melted" },
  92: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "Beside the rushing mountain creek, 10-year-old @{Ace Miller} laughs warmly and counts off three chemistry steps on his fingers for his sister @{Maya Miller}" },
  93: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "Working together in the shallow river current, 10-year-old @{Ace Miller} and @{Maya Miller} fill two large oak buckets with the glistening quartz river deposit, swirling clear water to wash away loose silt" },
  94: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "Walking up the sun-dappled forest trail away from the river bend, 10-year-old @{Ace Miller} and @{Maya Miller} carry the two heavy wooden buckets brimming with washed, glittering white quartz grains" },
  95: { zone: "emerald_valley_forest_trail", chars: [], action: "Wide scenic panorama of the sun-dappled alpine river valley and towering snow-crested mountain peaks gleaming under warm afternoon sunbeams" },
  96: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "maya_miller"], action: "Stepping back into the sunlit homestead courtyard carrying the wooden buckets of wet white quartz grains, 10-year-old @{Ace Miller} looks toward the unglazed white-stone cottage wing with bright excitement beside @{Maya Miller}" },

  // Batch 05 bespoke scenes (97-120): The Dual-Chamber Refractory Kiln & Alumina Firebricks
  97: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "At the outdoor timber worktable in the courtyard, 10-year-old @{Ace Miller} dips a charcoal stick in water and drafts a dual-chamber kiln diagram" },
  98: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Gathered around the outdoor timber worktable, 10-year-old @{Ace Miller} points to the charcoal kiln diagram while explaining high-temperature melting to @{Garrett Miller}" },
  99: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "ace_miller"], action: "Beside the outdoor worktable, @{Garrett Miller} strokes his stubbled chin thoughtfully while questioning 10-year-old @{Ace Miller} about furnace heat" },
  100: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the worktable, 10-year-old @{Ace Miller} grins and points to a wooden bowl of white birch ash beside the bucket of washed quartz grains while @{Garrett Miller} watches" },
  101: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the timber worktable, 10-year-old @{Ace Miller} draws a tapered twenty-foot draft chimney and dual firebox chamber with his charcoal stick for @{Garrett Miller}" },
  102: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "Above the outdoor worktable, @{LUMINA} projects a glowing blue-and-gold 3D chimney airflow diagram in mid-air while 10-year-old @{Ace Miller} observes" },
  103: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Beside the worktable, 10-year-old @{Ace Miller} traces the upward chimney draft arrows with his hand while summarizing the airflow physics to @{Garrett Miller}" },
  104: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "ace_miller"], action: "Leaning over the outdoor worktable, @{Garrett Miller} stares in quiet amazement at the chimney draft diagram beside 10-year-old @{Ace Miller}" },
  105: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the outdoor worktable, 10-year-old @{Ace Miller} chuckles with a dry playful grin while folding his arms beside @{Garrett Miller}" },
  106: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller", "ace_miller"], action: "Standing by the outdoor worktable, @{Clara Miller} raises a thoughtful finger while asking 10-year-old @{Ace Miller} about heat-resistant stones" },
  107: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "clara_miller"], action: "Beside the worktable, 10-year-old @{Ace Miller} nods proudly to his mother @{Clara Miller} while gesturing toward a sample of pale clay" },
  108: { zone: "emerald_valley_forest_trail", chars: ["clara_miller", "ace_miller"], action: "On the sunlit path past the lavender terrace, @{Clara Miller} smiles brightly and points toward a pale white clay seam exposed along the mossy stream bank beside @{Ace Miller}" },
  109: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "Along the mossy stream bank, 10-year-old @{Ace Miller} and @{Garrett Miller} use wooden spades to uncover a dense seam of creamy white kaolin refractory clay" },
  110: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "On the sunlit trail, @{Garrett Miller} and 10-year-old @{Ace Miller} load heavy blocks of creamy white kaolin clay into a wooden wheelbarrow" },
  111: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "At the outdoor stone mortar in the courtyard, 10-year-old @{Ace Miller} grinds washed quartz grains into fine refractory grog with a heavy stone pestle" },
  112: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "At the wooden mixing trough in the courtyard, @{Garrett Miller} kneads wet white kaolin clay with strong hands and presses it into rectangular oak brick moulds" },
  113: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Beside the wooden moulds, 10-year-old @{Ace Miller} and @{Garrett Miller} stamp uniform interlocking bevels into each fresh white refractory clay brick" },
  114: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller"], action: "Beside the wooden drying racks in the courtyard, @{Maya Miller} extends her hands as gentle swirls of mint-green wind mana circulate warm dry air around the clay bricks" },
  115: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the sunlit grassy workshop yard, 10-year-old @{Ace Miller} and @{Garrett Miller} inspect two hundred firm, uniform white refractory firebricks lined up on wooden drying racks" },
  116: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the leeward packed-earth corner of the backyard, 10-year-old @{Ace Miller} points to the levelled dirt ground while planning the compact brick oven base with @{Garrett Miller}" },
  117: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "At the leeward backyard corner on bare packed earth, @{Garrett Miller} sets a low white limestone base block carved with a bottom air-intake draft channel" },
  118: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the backyard corner on bare packed earth, 10-year-old @{Ace Miller} and @{Garrett Miller} stack compact white firebricks layer by layer into a waist-high beehive brick oven base" },
  119: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Above the lower brick firebox, 10-year-old @{Ace Miller} and @{Garrett Miller} lower a heavy perforated dark slate baffle shelf into the compact brick kiln" },
  120: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Under golden afternoon light on the grassy backyard, 10-year-old @{Ace Miller} and @{Garrett Miller} stand beside the completed compact white firebrick beehive kiln and slender stovepipe chimney" },

  // Batch 06 bespoke scenes (121-144): Firing the Refractory Kiln & Achieving White Heat
  121: { zone: "miller_sanctuary_farm_exterior", chars: [], action: "Crisp early-morning sunlight illuminating light white frost dusting the purple lavender rows and the compact white-brick beehive kiln in the quiet grassy farmyard" },
  122: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the crisp morning grassy yard, 10-year-old @{Ace Miller} and @{Garrett Miller} gather beside the newly completed white firebrick kiln to begin the curing cycle" },
  123: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Beside the kiln firebox opening, 10-year-old @{Ace Miller} arranges small bundles of dry white birch kindling and wood shavings on the packed earth" },
  124: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Leaning beside the lower kiln chamber, @{Garrett Miller} carefully stacks seasoned oak split logs inside the refractory brick firebox" },
  125: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Leaning forward at the open kiln firebox, 10-year-old @{Ace Miller} extends his right hand toward the dry birch kindling with quiet concentration" },
  126: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the kiln firebox opening, a crisp orange fire-mana spark snaps from the fingertips of 10-year-old @{Ace Miller} onto the dry birch shavings as @{Garrett Miller} watches" },
  127: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Inside the lower brick firebox, cheerful yellow flames catch on the birch kindling and warm the pale refractory firebrick walls before 10-year-old @{Ace Miller} and @{Garrett Miller}" },
  128: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the morning yard, 10-year-old @{Ace Miller} and @{Garrett Miller} monitor the open chimney damper as gentle white steam vents into the sky" },
  129: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Through the kiln port, the interior refractory firebricks glow a warm baked terracotta-orange as 10-year-old @{Ace Miller} and @{Garrett Miller} observe the curing progress" },
  130: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "Beside the warm refractory kiln, @{LUMINA} projects a zero-percent moisture reading with a winking emoji smile for 10-year-old @{Ace Miller}" },
  131: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "Next to the cured brick kiln, 10-year-old @{Ace Miller} gives a confident nod as @{LUMINA} displays a 100% brick structural integrity bar" },
  132: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Beside the kiln, 10-year-old @{Ace Miller} pulls on thick brown leather craftsman gloves and gestures toward the upper fuel chute for @{Garrett Miller}" },
  133: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Using a broad iron shovel, @{Garrett Miller} loads dense black lumps of seasoned oak charcoal into the kiln's upper fuel chute" },
  134: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the refractory kiln, @{Garrett Miller} latches the heavy iron firebox hatch shut while 10-year-old @{Ace Miller} checks the tall white-stone draft chimney" },
  135: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Around the base of the kiln, crisp morning air rushes rapidly into the bottom stone intake vents as 10-year-old @{Ace Miller} and @{Garrett Miller} listen to the roaring draft" },
  136: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Through the circular kiln peephole, the interior fire shifts from bright orange into a dazzling, incandescent white-hot glow before 10-year-old @{Ace Miller} and @{Garrett Miller}" },
  137: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Beside the roaring white-stone kiln, @{Garrett Miller} takes a step back and shields his amber eyes with his forearm against the radiant waves of heat" },
  138: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "ace_miller"], action: "Standing near the radiant kiln dome, @{Garrett Miller} stares in wide-eyed awe at the white-hot furnace glow while 10-year-old @{Ace Miller} smiles calmly" },
  139: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "At the kiln viewing port, 10-year-old @{Ace Miller} peers into the incandescent white-hot upper chamber through a small dark-tinted mineral lens" },
  140: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the upper kiln port, 10-year-old @{Ace Miller} points out the clean, soot-free white heat above the slate baffle plate to @{Garrett Miller}" },
  141: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller", "clara_miller"], action: "Standing at a safe distance in the courtyard, @{Maya Miller} and @{Clara Miller} watch the warm golden glow reflecting off the white-stone kiln exterior" },
  142: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller", "maya_miller"], action: "In the courtyard, @{Clara Miller} looks up in amazement at the tall white-stone kiln chimney venting clean, invisible heat waves beside @{Maya Miller}" },
  143: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "clara_miller"], action: "Beside the roaring kiln, 10-year-old @{Ace Miller} gestures toward the secondary combustion chamber while explaining clean draft airflow to @{Clara Miller}" },
  144: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Turning from the white-hot kiln toward the wooden worktable, 10-year-old @{Ace Miller} stands before deep fireclay crucibles filled with washed quartz grains and white birch ash" },

  // Batch 07 bespoke scenes (145-168): The Alchemy of Glass & The First Pour
  145: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "At the outdoor worktable, 10-year-old @{Ace Miller} carefully weighs washed alpine quartz grains, white birch ash, and crushed limestone on a polished brass balance scale" },
  146: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "At the worktable, 10-year-old @{Ace Miller} uses a wooden paddle to thoroughly mix the dry quartz grains, birch ash, and limestone stabilizer inside a wide clay basin" },
  147: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "ace_miller"], action: "Beside the mixing table, @{Garrett Miller} nods with craftsman appreciation as 10-year-old @{Ace Miller} pours the blended mineral batch into a thick fireclay crucible" },
  148: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "ace_miller"], action: "Using long-handled forged iron tongs, @{Garrett Miller} and 10-year-old @{Ace Miller} carefully lift the heavy fireclay crucible into the kiln's glowing upper chamber" },
  149: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the upper kiln port, 10-year-old @{Ace Miller} and @{Garrett Miller} slide the insulated refractory firebrick door shut to seal the melting chamber" },
  150: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Peering through the glowing kiln port, 10-year-old @{Ace Miller} and @{Garrett Miller} watch the intense twelve-hundred-degree heat envelop the fireclay crucible" },
  151: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Inside the incandescent upper kiln chamber, the mineral batch sinters into a glowing bubbly mass inside the fireclay crucible as 10-year-old @{Ace Miller} and @{Garrett Miller} observe" },
  152: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Inside the white-hot crucible, the sintered minerals liquefy into a smooth, swirling pool of glowing honey-orange molten liquid before 10-year-old @{Ace Miller} and @{Garrett Miller}" },
  153: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "At the kiln viewing port, 10-year-old @{Ace Miller} watches the glowing molten pool clarify while @{LUMINA} tracks the viscosity curve on her floating blue panel" },
  154: { zone: "miller_sanctuary_farm_exterior", chars: ["lumina", "ace_miller"], action: "Beside the kiln, @{LUMINA} beams with an enthusiastic emoji smile and displays a green homogeneous melt confirmation for 10-year-old @{Ace Miller}" },
  155: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Beside the roaring kiln, 10-year-old @{Ace Miller} signals eagerly to @{Garrett Miller} to prepare for the molten pour" },
  156: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Next to the kiln, 10-year-old @{Ace Miller} and @{Garrett Miller} check the flat polished dark slate casting table warmed from beneath by glowing charcoal embers" },
  157: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Bracing his broad shoulders, @{Garrett Miller} grips the long iron pouring tongs with leather-gloved hands and lifts the incandescent white-hot crucible from the kiln mouth" },
  158: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Dramatic close-up of @{Garrett Miller} holding the glowing crucible with iron tongs as radiant golden heat illuminates his focused, determined face" },
  159: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Standing over the pre-heated dark slate casting table, @{Garrett Miller} steadily tilts the glowing fireclay crucible with his long iron tongs" },
  160: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the slate casting table, @{Garrett Miller} pours a thick, luminous golden-orange stream of molten quartz glass onto the smooth dark slate within iron frame borders as 10-year-old @{Ace Miller} watches" },
  161: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Working with swift precision at the casting table, 10-year-old @{Ace Miller} grips a heavy polished iron roller by its wooden handles and rolls it smoothly across the glowing molten sheet" },
  162: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Under the heavy iron roller guided by 10-year-old @{Ace Miller} and @{Garrett Miller}, the glowing liquid flattens into an even, rectangular quarter-inch plate inside the iron borders" },
  163: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Across the flat slate table, the freshly rolled sheet shifts from bright amber-orange to faint cherry-red and begins turning transparent before 10-year-old @{Ace Miller} and @{Garrett Miller}" },
  164: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Leaning over the casting table, 10-year-old @{Ace Miller} and @{Garrett Miller} hold their breath as the last red heat fades from the flat quartz sheet" },
  165: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Resting on the dark slate casting table before 10-year-old @{Ace Miller} and @{Garrett Miller} is a flat three-foot-wide sheet of crystal-clear glass showing the grey slate grain underneath" },
  166: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Close-up of 10-year-old @{Ace Miller} gazing down at the transparent cast glass sheet on the slate table with bright, emotional emerald eyes" },
  167: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Beside the casting table, @{Garrett Miller} lowers his long iron tongs to the stone ground, staring speechlessly at the clear glass sheet" },
  168: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "ace_miller"], action: "Standing over the slate table, @{Garrett Miller} gazes in profound wonder at the crystal-clear cast pane beside 10-year-old @{Ace Miller}" },

  // Batch 08 bespoke scenes (169-192): Annealing the Pane & Family Wonder
  169: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Beside the slate casting table, 10-year-old @{Ace Miller} raises a cautionary hand to stop @{Garrett Miller} from touching the hot glass sheet in the cool mountain air" },
  170: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Using flat iron spatulas, 10-year-old @{Ace Miller} and @{Garrett Miller} slide the hot glass sheet into the insulated stone annealing box and cover it with warm dry wood ash" },
  171: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "Beside the insulated wood-ash annealing box, 10-year-old @{Ace Miller} watches @{LUMINA} display a slow cooling countdown timer on her floating sky-blue screen" },
  172: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Sitting on wooden benches near the warm kiln, 10-year-old @{Ace Miller} and @{Garrett Miller} sip hot herbal tea from wooden cups while waiting for the annealing box to cool" },
  173: { zone: "miller_sanctuary_farm_exterior", chars: ["lumina", "ace_miller"], action: "Above the annealing box, @{LUMINA} chimes with a cheerful smiley face and displays a green zero-stress completion badge for 10-year-old @{Ace Miller}" },
  174: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "At the open annealing box, 10-year-old @{Ace Miller} uses a soft horsehair brush to sweep away fine white wood ash from the cool, transparent glass pane" },
  175: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Gripping the edges with clean white linen towels, 10-year-old @{Ace Miller} and @{Garrett Miller} lift the three-foot transparent glass pane out of the ash bed" },
  176: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "In the sunlit workshop yard, @{Garrett Miller} holds the three-foot crystal-clear glass pane upright in both hands toward the afternoon sun" },
  177: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Golden afternoon sunbeams pass cleanly through the upright transparent glass pane held by @{Garrett Miller} as 10-year-old @{Ace Miller} watches proudly" },
  178: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Close-up of @{Garrett Miller}'s astonished face seen with total clarity through the distortion-free crystal glass pane in his hands" },
  179: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "clara_miller"], action: "Holding the transparent glass pane in the courtyard, @{Garrett Miller} waves excitedly toward @{Clara Miller} approaching from the cottage" },
  180: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller", "maya_miller"], action: "Entering the sunlit workshop yard, @{Clara Miller} and @{Maya Miller} stop in stunned amazement as they look toward the transparent pane" },
  181: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller", "garrett_miller"], action: "Standing in front of @{Garrett Miller}, @{Maya Miller} tilts her head and blinks in comical confusion at the seemingly invisible barrier between his hands" },
  182: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "maya_miller"], action: "Chuckling warmly, @{Garrett Miller} gently taps his knuckle against the center of the clear glass pane while @{Maya Miller} watches" },
  183: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller"], action: "Close-up of @{Maya Miller} gasping with wide, sparkling amber eyes as the clear glass pane rings with a musical chime" },
  184: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller", "garrett_miller"], action: "Leaning forward in delight, @{Maya Miller} presses her fingertips against the cool transparent glass pane while looking straight through at @{Garrett Miller}'s smiling face" },
  185: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller", "garrett_miller"], action: "Through the crystal-clear glass sheet, @{Maya Miller} laughs joyfully and traces the smooth surface while @{Garrett Miller} grins on the other side" },
  186: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller"], action: "Stepping forward in the sunlit courtyard, @{Clara Miller} gently glides her palm across the cool, flawless glass pane with happy tears glistening in her emerald eyes" },
  187: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller", "garrett_miller"], action: "Beside the clear glass pane, @{Clara Miller} gazes through the crystal sheet with quiet reverence as @{Garrett Miller} holds it steady" },
  188: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the sunlit workshop yard, 10-year-old @{Ace Miller} and @{Garrett Miller} set the finished glass pane safely onto a padded wooden rack" },
  189: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "clara_miller"], action: "In the warm courtyard, @{Clara Miller} bends down and wraps her 10-year-old son @{Ace Miller} in a tight, loving maternal hug" },
  190: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller", "ace_miller"], action: "Holding 10-year-old @{Ace Miller} close, @{Clara Miller} smiles with overwhelming maternal pride in the sunlit farmyard" },
  191: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "clara_miller"], action: "Stepping in beside them, @{Garrett Miller} wraps his strong arms around @{Clara Miller} in a warm family embrace" },
  192: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "Surrounded by his parents' embrace, 10-year-old @{Ace Miller} smiles happily as @{LUMINA} projects a glowing golden heart icon beside him" },

  // Batch 09 bespoke scenes (193-216): Framing Widescreen Windows & Flooding the Farm with Light
  193: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the sunlit courtyard workshop, 10-year-old @{Ace Miller} and @{Garrett Miller} organize the tools for a lively family window-making assembly line" },
  194: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the slate casting table, 10-year-old @{Ace Miller} and @{Garrett Miller} inspect five matching crystal-clear quartz glass panes resting on padded wooden racks" },
  195: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller", "clara_miller"], action: "At the carpentry bench, @{Maya Miller} and @{Clara Miller} use fine sanding blocks to smooth and bevel the inner grooves of seasoned oak window frames" },
  196: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Standing at the carpentry bench, 10-year-old @{Ace Miller} runs his fingertip along the inner timber groove of an oak window frame to check the joint tolerances" },
  197: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller"], action: "In the sunlit courtyard, @{Clara Miller} steps forward holding a warm clay pot filled with smooth, golden-brown linseed oil and beeswax glazing putty" },
  198: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "clara_miller"], action: "At the worktable, @{Clara Miller} uses a small wooden spatula to spread a smooth bead of pliable glazing putty along the oak frame grooves while @{Ace Miller} watches" },
  199: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "clara_miller"], action: "Beside the oak window frame, 10-year-old @{Ace Miller} tests the pliable weather-resistant linseed putty with a approving nod toward @{Clara Miller}" },
  200: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Working together at the bench, 10-year-old @{Ace Miller} and @{Garrett Miller} carefully lower a heavy clear quartz glass pane into the putty-lined oak frame" },
  201: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Using a small tack hammer, 10-year-old @{Ace Miller} and @{Garrett Miller} tap tiny triangular brass glazing points into the oak frame to lock the glass pane" },
  202: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Outside the white limestone extension wing, @{Garrett Miller} hoists the completed oak-framed quartz glass window unit into the open rectangular stone wall cutout" },
  203: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the white limestone wall opening, @{Garrett Miller} and 10-year-old @{Ace Miller} slide the bevelled oak window frame snugly into the precision tongue-and-groove stone recess" },
  204: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "With a wooden mallet, @{Garrett Miller} drives sturdy oak dowels through the window frame into pre-drilled anchor holes in the white limestone wall" },
  205: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Stepping back in the sunlit courtyard, @{Garrett Miller} admires the newly mounted widescreen quartz glass window gleaming in the white limestone wall" },
  206: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Seen through the wide crystal-clear glass window, bright afternoon mountain sunlight floods the warm stone-and-timber room around @{Ace Miller} and @{Garrett Miller}" },
  207: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Inside the sunlit window bay, 10-year-old @{Ace Miller} and @{Garrett Miller} hold their palms near the airtight oak casement as pine trees sway in the autumn breeze outside" },
  208: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller"], action: "Standing before the wide crystal-clear window, @{Maya Miller} gasps in delight as she gazes out at the purple lavender rows and distant snow-capped peaks" },
  209: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller", "ace_miller"], action: "Resting her hands on the sunlit stone sill, @{Maya Miller} beams with wonder beside 10-year-old @{Ace Miller} inside the warm, draft-free room" },
  210: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "maya_miller"], action: "Leaning comfortably against the warm white-stone window sill, 10-year-old @{Ace Miller} smiles and points out at the high alpine peaks beside @{Maya Miller}" },
  211: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Beside the mounted window, @{Garrett Miller} runs his calloused hand admiringly along the flush joint where warm oak meets white limestone and clear glass" },
  212: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the sunlit courtyard beside the glazed stone wall, @{Garrett Miller} places a proud hand on the shoulder of 10-year-old @{Ace Miller}" },
  213: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Wide view of the farmhouse with five clear oak-framed quartz glass windows mounted across the stone walls beside @{Ace Miller} and @{Garrett Miller}" },
  214: { zone: "miller_sanctuary_farm_exterior", chars: [], action: "As deep violet-and-gold alpine twilight settles over the valley, warm golden lantern light glows softly from inside the farmhouse's newly installed quartz glass windows" },
  215: { zone: "miller_sanctuary_farm_exterior", chars: [], action: "Scenic twilight establishing shot of the timber-and-white-stone homestead glowing like a warm golden lantern in the dusk meadow, its clear glass windows shining brightly" },
  216: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Standing side by side in the twilight meadow, 10-year-old @{Ace Miller} and @{Garrett Miller} watch the warm golden light spill from the farmhouse windows across the purple lavender rows" },

  // Batch 10 bespoke scenes (217-240): The Food Preservation Dilemma & Alpine Cork Oak
  217: { zone: "old_miller_cottage_interior", chars: ["clara_miller"], action: "In the warm cottage kitchen, @{Clara Miller} stands at the stone counter inspecting earthen crocks of fresh goat milk and wooden bowls of churned golden butter" },
  218: { zone: "old_miller_cottage_interior", chars: ["clara_miller", "ace_miller"], action: "By the kitchen table, @{Clara Miller} gestures toward the earthen milk crocks with a concerned expression while calling to 10-year-old @{Ace Miller}" },
  219: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "Stepping into the warm kitchen where fresh loaves of bread rest on cooling racks, 10-year-old @{Ace Miller} and @{Garrett Miller} walk over to the counter" },
  220: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "clara_miller"], action: "Standing beside the kitchen counter, 10-year-old @{Ace Miller} looks up curiously at his mother @{Clara Miller} beside the dairy crocks" },
  221: { zone: "old_miller_cottage_interior", chars: ["clara_miller", "ace_miller"], action: "At the wooden kitchen table, @{Clara Miller} removes the lid from a brimming earthen crock of fresh milk while explaining the surplus to 10-year-old @{Ace Miller}" },
  222: { zone: "old_miller_cottage_interior", chars: ["clara_miller", "ace_miller"], action: "Beside the kitchen shelf, @{Clara Miller} holds up delicate stoppered vials of pressed purple lavender oil and herbal salve for 10-year-old @{Ace Miller}" },
  223: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "Leaning against the timber post in the kitchen, @{Garrett Miller} crosses his broad arms thoughtfully while discussing city iceboxes with 10-year-old @{Ace Miller}" },
  224: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "At the kitchen table, 10-year-old @{Ace Miller} grins with a clever smirk while tapping his temple beside @{Garrett Miller}" },
  225: { zone: "old_miller_cottage_interior", chars: ["maya_miller", "ace_miller"], action: "Peeking eagerly into the kitchen doorway, @{Maya Miller} points upward with a bright suggestion while 10-year-old @{Ace Miller} turns toward her" },
  226: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "maya_miller"], action: "In the kitchen, 10-year-old @{Ace Miller} holds up his hands to illustrate heat leakage from an uninsulated wooden box to @{Maya Miller}" },
  227: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "At the kitchen table, 10-year-old @{Ace Miller} interlocks his fingers to demonstrate an airtight thermal insulation envelope to @{Garrett Miller}" },
  228: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "lumina"], action: "Beside 10-year-old @{Ace Miller} in the kitchen, @{LUMINA} projects a glowing blue cellular cross-section of honeycombed cork bark on her floating panel" },
  229: { zone: "old_miller_cottage_interior", chars: ["lumina", "ace_miller"], action: "Hovering over the kitchen table, @{LUMINA} displays thermal insulation metrics for alpine cork oak bark while 10-year-old @{Ace Miller} studies the screen" },
  230: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "In the kitchen, 10-year-old @{Ace Miller} looks up at @{Garrett Miller} with bright emerald eyes snapping his fingers in sudden realization" },
  231: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "Beside the kitchen table, @{Garrett Miller} smiles with immediate recognition and gestures toward the northern mountain ridge for 10-year-old @{Ace Miller}" },
  232: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "At the doorway, 10-year-old @{Ace Miller} explains sustainable bark harvesting to @{Garrett Miller} before heading outdoors" },
  233: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "Hiking up the sunlit mountain forest trail toward the northern ridge, 10-year-old @{Ace Miller} and @{Garrett Miller} carry wooden wedges, mallets, and burlap sacks" },
  234: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "Climbing past the pine treeline onto the sunlit limestone bluffs, 10-year-old @{Ace Miller} and @{Maya Miller} look ahead toward a sheltered mountain hollow" },
  235: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "In a sunlit alpine hollow, 10-year-old @{Ace Miller} and @{Garrett Miller} stand before ancient gnarled cork oak trees wrapped in thick, fissured grey-brown spongy bark" },
  236: { zone: "emerald_valley_forest_trail", chars: ["ace_miller"], action: "Walking up to the largest alpine cork oak, 10-year-old @{Ace Miller} presses his thumb into the thick, springy golden-grey bark" },
  237: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "At the cork oak trunk, 10-year-old @{Ace Miller} carefully scores a shallow vertical seam down the outer spongy bark with a curved woodworking tool while @{Maya Miller} watches" },
  238: { zone: "emerald_valley_forest_trail", chars: ["garrett_miller"], action: "Beside the scored cork oak trunk, @{Garrett Miller} inserts a smooth hardwood wedge into the bark seam and taps it gently with a wooden mallet" },
  239: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "garrett_miller"], action: "At the cork oak tree, @{Garrett Miller} and 10-year-old @{Ace Miller} cleanly peel away a thick, curved three-inch slab of spongy cork bark while leaving the smooth inner trunk unharmed" },
  240: { zone: "emerald_valley_forest_trail", chars: ["ace_miller", "maya_miller"], action: "Heading down the sunlit forest trail, 10-year-old @{Ace Miller} and @{Maya Miller} carry burlap sacks brimming with twenty uniform slabs of thick alpine cork bark" },

  // Batch 11 bespoke scenes (241-264): Engineering the Sub-Ground Cold Storage & Ice Mana Convection
  241: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "At the shaded northeast corner of the stone cottage workshop, 10-year-old @{Ace Miller} and @{Garrett Miller} mark out the square ground site for the subterranean cold cellar" },
  242: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "At the shaded workshop corner, @{Garrett Miller} channels warm amber earth mana through his palms to excavate a clean six-foot-deep square subterranean cellar pit" },
  243: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Stepping down the newly cut stone steps into the cool six-foot-deep cellar pit, 10-year-old @{Ace Miller} presses his palm against the cool earthen wall beside @{Garrett Miller}" },
  244: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Inside the subterranean stone excavation, 10-year-old @{Ace Miller} gestures across the shaded lower walls while explaining sub-ground thermal stability to @{Garrett Miller}" },
  245: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Inside the excavated cellar chamber, @{Garrett Miller} lays an inner wall of uniform white limestone blocks with a three-inch insulation gap along the perimeter" },
  246: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "maya_miller"], action: "Inside the stone cellar chamber, 10-year-old @{Ace Miller} and @{Maya Miller} pack thick alpine cork bark slabs tightly into the three-inch wall cavity between the limestone blocks" },
  247: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Inside the cork-insulated white-stone cellar, 10-year-old @{Ace Miller} points up toward the ceiling and floor corners to mark the convective air ducts" },
  248: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the stone cold-storage chamber, 10-year-old @{Ace Miller} and @{Garrett Miller} fit two smooth white-stone air shafts with adjustable wooden draft dampers" },
  249: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "On the highest central stone shelf of the cellar, 10-year-old @{Ace Miller} mounts a polished open-work brass cradle designed to hold a cooling crystal" },
  250: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "ace_miller"], action: "Stepping into the cellar chamber, @{Garrett Miller} holds a glowing apple-sized azure ice-mana crystal in his hands while 10-year-old @{Ace Miller} prepares the brass cradle" },
  251: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "As @{Garrett Miller} places the glowing azure ice-mana crystal into the top brass cradle, soft ribbons of white frost mist cascade downward past 10-year-old @{Ace Miller}" },
  252: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Inside the white-stone cold cellar, 10-year-old @{Ace Miller} watches the dense white frost mist sink gently from the top brass cradle across the lower limestone shelves" },
  253: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Beside the cellar stone shelves, 10-year-old @{Ace Miller} traces the downward loop of cool air and upward exhaust vent flow for @{Garrett Miller}" },
  254: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller"], action: "Stepping into the finished white-stone cold pantry, @{Maya Miller} grins with delight as her breath forms a tiny puff of white mist in the crisp air" },
  255: { zone: "miller_sanctuary_farm_exterior", chars: ["maya_miller", "ace_miller"], action: "Inside the chilled white-stone larder, @{Maya Miller} hugs her arms with a joyful laugh beside 10-year-old @{Ace Miller}" },
  256: { zone: "miller_sanctuary_farm_exterior", chars: ["lumina", "ace_miller"], action: "Inside the cold storage chamber, @{LUMINA} projects a glowing blue thermometer graphic reading 3.2 degrees Celsius beside 10-year-old @{Ace Miller}" },
  257: { zone: "miller_sanctuary_farm_exterior", chars: ["lumina", "ace_miller"], action: "Hovering near the azure ice crystal cradle, @{LUMINA} displays an 85% mana conservation chart with a happy emoji wink for 10-year-old @{Ace Miller}" },
  258: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Standing by the chilled limestone shelves, 10-year-old @{Ace Miller} smiles proudly and gestures toward the durable cooling crystal beside @{Garrett Miller}" },
  259: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "At the cellar entrance, @{Garrett Miller} inspects the thick cork-insulated oak door lined with a snug deerskin gasket" },
  260: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "ace_miller"], action: "Beside the heavy insulated cellar door, @{Garrett Miller} shakes his head in joyful admiration while looking down at 10-year-old @{Ace Miller}" },
  261: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller"], action: "Walking down the stone cellar steps, @{Clara Miller} carries a wooden crate filled with butter crocks, milk jugs, and purple lavender vials" },
  262: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller", "ace_miller"], action: "Inside the chilled cellar, @{Clara Miller} arranges the milk jugs and butter crocks onto the frost-cooled white limestone shelves beside 10-year-old @{Ace Miller}" },
  263: { zone: "miller_sanctuary_farm_exterior", chars: ["clara_miller", "ace_miller"], action: "By the cellar shelves, @{Clara Miller} bends down and kisses the top of 10-year-old @{Ace Miller}'s chestnut hair with warm gratitude" },
  264: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "In the sunlit courtyard outside the completed cold cellar, 10-year-old @{Ace Miller} and @{Garrett Miller} stand proudly before their upgraded white-stone homestead" },

  // Batch 12 bespoke scenes (265-288): Chilled Lavender Cream, Fresh Bread & Family Feast
  265: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "Inside the warm timber-and-stone dining room at sunset, 10-year-old @{Ace Miller} and @{Garrett Miller} gather around the long oak table as savory steam rises from dinner dishes" },
  266: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "clara_miller"], action: "Warm golden sunset rays stream into the cozy dining hall, illuminating 10-year-old @{Ace Miller} and @{Clara Miller} at the polished oak table" },
  267: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "maya_miller"], action: "Spread across the oak dining table before @{Ace Miller} and @{Maya Miller} are crusty sourdough loaves, a steaming clay pot of herb stew, and a frosty bowl of chilled cream" },
  268: { zone: "old_miller_cottage_interior", chars: ["maya_miller"], action: "At the dining table, @{Maya Miller} dips a thick piece of warm crusty bread into the bowl of thick, frosty-cold sweet cream with pure delight" },
  269: { zone: "old_miller_cottage_interior", chars: ["maya_miller", "ace_miller"], action: "Savoring a bite of warm bread and chilled cream, @{Maya Miller} beams with wide-eyed culinary bliss beside 10-year-old @{Ace Miller}" },
  270: { zone: "old_miller_cottage_interior", chars: ["clara_miller"], action: "At the dining table, @{Clara Miller} laughs warmly while pouring cold spring water from a condensation-beaded earthen pitcher into wooden cups" },
  271: { zone: "old_miller_cottage_interior", chars: ["clara_miller", "maya_miller"], action: "Sitting across the oak table, @{Clara Miller} smiles affectionately at @{Maya Miller} as the family shares the evening meal" },
  272: { zone: "old_miller_cottage_interior", chars: ["garrett_miller"], action: "At the head of the oak table, @{Garrett Miller} spreads firm golden butter onto warm sourdough bread and savors a hearty spoonful of herb stew" },
  273: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "clara_miller"], action: "At the warm dinner table, @{Garrett Miller} looks around the clean, well-lit dining room and speaks reflectively with @{Clara Miller}" },
  274: { zone: "old_miller_cottage_interior", chars: ["garrett_miller"], action: "Resting his forearm on the oak dining table, @{Garrett Miller} gazes thoughtfully at his clean wooden cup of spring water" },
  275: { zone: "old_miller_cottage_interior", chars: ["clara_miller", "garrett_miller"], action: "Reaching across the oak dining table, @{Clara Miller} gently squeezes the calloused hand of @{Garrett Miller} with a tender smile" },
  276: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "At the dining table, @{Garrett Miller} and 10-year-old @{Ace Miller} exchange a warm, proud look across the glowing supper hearth" },
  277: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "ace_miller"], action: "Raising his wooden cup high at the dinner table, @{Garrett Miller} proposes a heartfelt family toast toward 10-year-old @{Ace Miller}" },
  278: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "maya_miller"], action: "Across the dining table, @{Maya Miller} enthusiastically clinks her wooden cup against the cup of 10-year-old @{Ace Miller}" },
  279: { zone: "old_miller_cottage_interior", chars: ["ace_miller"], action: "Sitting at the warm family table, 10-year-old @{Ace Miller} smiles with a gentle blush as warm hearth light reflects in his emerald eyes" },
  280: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "At the oak table, 10-year-old @{Ace Miller} raises his wooden cup in a cheerful toast with @{Garrett Miller}" },
  281: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "lumina"], action: "Beside 10-year-old @{Ace Miller}'s shoulder in the warm dining room, @{LUMINA} hovers quietly displaying a blushing emoji face with golden sparkles" },
  282: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "lumina"], action: "At the table, 10-year-old @{Ace Miller} glances fondly at @{LUMINA}'s glowing sky-blue interface showing 99.9% emotional harmony" },
  283: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "maya_miller"], action: "In the cozy lamp-lit dining room, 10-year-old @{Ace Miller} watches @{Maya Miller} laugh warmly by the stone hearth" },
  284: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "After supper, 10-year-old @{Ace Miller} steps out onto the wide white-stone porch under the calm evening sky" },
  285: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Standing on the stone porch in his forest-green craftsman vest, 10-year-old @{Ace Miller} breathes in the crisp autumn night air" },
  286: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Looking up from the stone porch, 10-year-old @{Ace Miller} gazes at a canopy of brilliant stars glittering above the snow-crested alpine peaks" },
  287: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Across the starlit courtyard before 10-year-old @{Ace Miller}, purple lavender rows sway gently in the peaceful night breeze" },
  288: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Wide evening view of 10-year-old @{Ace Miller} standing on the warm lantern-lit porch while the dark western mountain pass rises in the far distance" },

  // Batch 13 bespoke scenes (289-312): The Exhausted Royal Fugitives on the Forest Trail
  289: { zone: "emerald_valley_forest_trail", chars: [], action: "Deep within the shadowed alpine pine forest five leagues west, cold mountain mist winds between mossy granite boulders and dark spruce trunks" },
  290: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Trekking along the rugged, wind-swept mountain ravine path, @{Princess Seraphina} and @{Sir Roland Vance} press forward against the chilly pine breeze" },
  291: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance"], action: "Leading on the rocky forest trail, @{Sir Roland Vance} strides forward in mud-splattered silver-and-blue plate armour with his hand near his sheathed hip" },
  292: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance"], action: "Close-up of @{Sir Roland Vance}'s determined jaw and sharp blue-grey eyes vigilantly scanning the dense pine shadows along the mountain trail" },
  293: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "starlight_mare"], action: "Riding along the narrow forest trail on @{Starlight the Mare}, 11-year-old @{Princess Seraphina} pulls her hooded travel cloak snugly around her shoulders" },
  294: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "starlight_mare"], action: "Seated atop @{Starlight the Mare} on the forest path, @{Princess Seraphina}'s ivory-and-sky-blue travel dress shows days of dusty mountain trail wear" },
  295: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "Close-up of 11-year-old @{Princess Seraphina} beneath her damp travel hood, her golden-blonde hair wind-tousled around her weary sapphire-blue eyes" },
  296: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "starlight_mare"], action: "On the rocky mountain path, 11-year-old @{Princess Seraphina} holds the leather reins of @{Starlight the Mare} with tired gloved hands" },
  297: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "starlight_mare"], action: "On the slick river stones of the forest trail, @{Starlight the Mare} missteps slightly with a tired snort beside @{Sir Roland Vance}" },
  298: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "starlight_mare"], action: "Leaning forward in the saddle, 11-year-old @{Princess Seraphina} gently pats the neck of @{Starlight the Mare} to steady the tired white horse" },
  299: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "Stopping on the rocky trail, @{Sir Roland Vance} turns back with deep protective concern toward 11-year-old @{Princess Seraphina}" },
  300: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "Beside the mossy trail boulders, @{Sir Roland Vance} gestures earnestly toward the sheltered stream bank while advising @{Princess Seraphina} to rest" },
  301: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Lifting her chin with quiet royal resolve, 11-year-old @{Princess Seraphina} looks back at @{Sir Roland Vance} along the shadowed forest path" },
  302: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "On the forest trail, 11-year-old @{Princess Seraphina} glances back toward the high western mountain pass while speaking tensely with @{Sir Roland Vance}" },
  303: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "Standing calmly beside her on the wooded trail, @{Sir Roland Vance} reassures 11-year-old @{Princess Seraphina} with a steady hand over his chest" },
  304: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "On the forest path, 11-year-old @{Princess Seraphina} lets out a quiet breath as her shoulders relax under the weight of the long journey" },
  305: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Looking down at her dusty travel boots on the mossy path, 11-year-old @{Princess Seraphina} speaks quietly beside @{Sir Roland Vance}" },
  306: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "In the quiet pine ravine, 11-year-old @{Princess Seraphina} gazes into the distance with solemn sapphire eyes as @{Sir Roland Vance} listens" },
  307: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Along the mountain creek bank, 11-year-old @{Princess Seraphina} clenches her small gloved hand with earnest compassion while speaking to @{Sir Roland Vance}" },
  308: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Beside the birch trees, 11-year-old @{Princess Seraphina} shakes her head sadly at the memory of court politics while @{Sir Roland Vance} stands guard" },
  309: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "Close-up of @{Sir Roland Vance}'s expression softening with deep knightly respect as he looks at 11-year-old @{Princess Seraphina}" },
  310: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance"], action: "Standing tall on the forest trail, @{Sir Roland Vance} places his armored fist respectfully over his heart in a solemn vow of loyalty" },
  311: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "Pointing toward a dry rocky overhang beside the mountain stream, @{Sir Roland Vance} guides 11-year-old @{Princess Seraphina} toward shelter" },
  312: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "Drawing her hooded travel cloak closer against the cool mountain breeze, 11-year-old @{Princess Seraphina} nods in agreement along the trail" },

  // Batch 14 bespoke scenes (313-336): Campfire by the Mountain Stream & The Lingering Royal Burden
  313: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "starlight_mare"], action: "Beneath a dry rocky cliff overhang beside the creek, @{Sir Roland Vance} leads @{Starlight the Mare} into the sheltered alcove out of the wind" },
  314: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Inside the sheltered rock overhang, @{Sir Roland Vance} offers a steady armored forearm to help 11-year-old @{Princess Seraphina} step down from her saddle" },
  315: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "starlight_mare"], action: "In the dry stone alcove, @{Sir Roland Vance} unbuckles the travel saddle from @{Starlight the Mare} and brushes dry pine grass over her coat" },
  316: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance"], action: "Leaning forward by a ring of river stones under the overhang, @{Sir Roland Vance} strikes a flint spark onto dry birch twigs to light a small campfire" },
  317: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "Sitting near the small campfire under the rock overhang, 11-year-old @{Princess Seraphina} waves a hand in front of her face as damp pine smoke curls upward" },
  318: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "Beside the smoky campfire, @{Sir Roland Vance} fans the grey wood smoke away from 11-year-old @{Princess Seraphina} with his leather gauntlet" },
  319: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Seated on a mossy stone near the small campfire, 11-year-old @{Princess Seraphina} extends her hands toward the warm orange flames beside @{Sir Roland Vance}" },
  320: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance"], action: "Opening a worn leather saddlebag by the fire, @{Sir Roland Vance} takes out modest dried trail rations and a hard barley biscuit" },
  321: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "By the campfire, @{Sir Roland Vance} hands a small portion of dried trail rations and a tin cup of creek water to 11-year-old @{Princess Seraphina}" },
  322: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "Holding the tin cup by the campfire, 11-year-old @{Princess Seraphina} wrinkles her nose slightly at the cloudy unfiltered mountain creek water" },
  323: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Sitting by the firelight, 11-year-old @{Princess Seraphina} takes a small, reluctant bite of the tough dried trail biscuit beside @{Sir Roland Vance}" },
  324: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "Close-up of 11-year-old @{Princess Seraphina} gazing wistfully into the glowing orange campfire embers with soft sapphire eyes" },
  325: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Beside the campfire, 11-year-old @{Princess Seraphina} brushes a speck of travel soot from her sleeve while speaking softly to @{Sir Roland Vance}" },
  326: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Under the rock overhang, 11-year-old @{Princess Seraphina} gestures thoughtfully while recalling the cold marble washbasins of the capital with @{Sir Roland Vance}" },
  327: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "By the flickering campfire, 11-year-old @{Princess Seraphina} shakes her head at the memory of heavyperfumed oils while @{Sir Roland Vance} listens" },
  328: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "Sitting across the small fire, @{Sir Roland Vance} speaks with calm stoic discipline to 11-year-old @{Princess Seraphina}" },
  329: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "Beside the stream overhang, @{Sir Roland Vance} gestures toward the dark mountain wilderness while explaining harsh frontier winters to @{Princess Seraphina}" },
  330: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "Looking down at her open palms by the fire, 11-year-old @{Princess Seraphina} watches faint golden motes of light mana shimmer around her fingertips" },
  331: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "By the campfire, 11-year-old @{Princess Seraphina} watches the soft golden light motes fade from her palm while @{Sir Roland Vance} looks on sympathetically" },
  332: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "In the warm glow of the embers, 11-year-old @{Princess Seraphina} gazes up toward the starry gap in the pine canopy with quiet contemplation" },
  333: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Under the rocky overhang, 11-year-old @{Princess Seraphina} turns her questioning sapphire eyes toward @{Sir Roland Vance}" },
  334: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance"], action: "Sitting on a mossy boulder by the fire, @{Sir Roland Vance} lowers his gaze in quiet, thoughtful silence" },
  335: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "With gentle knightly care, @{Sir Roland Vance} drapes a warm dry wool travel blanket over the shoulders of 11-year-old @{Princess Seraphina}" },
  336: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "Resting comfortably against a dry mossy pack beside the warm campfire embers, 11-year-old @{Princess Seraphina} closes her eyes to sleep" },

  // Batch 15 bespoke scenes (337-360): The Scent of Lavender and Bread on the Morning Breeze
  337: { zone: "emerald_valley_forest_trail", chars: [], action: "Pale golden dawn breaking over the frosted alpine pine ravine, with sparkling white morning rime coating the mossy rocks and ferns along the trail" },
  338: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "starlight_mare"], action: "In the crisp morning light on the trail, @{Sir Roland Vance} checks the leather saddle cinch and inspects the front hoof of @{Starlight the Mare}" },
  339: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Stepping out from the rocky overhang into the morning sunbeams, 11-year-old @{Princess Seraphina} walks over to @{Sir Roland Vance}" },
  340: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "starlight_mare"], action: "Leaning down beside @{Starlight the Mare}, @{Sir Roland Vance} gently examines the mare's right front fetlock joint with a concerned frown" },
  341: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina", "starlight_mare"], action: "Standing beside @{Starlight the Mare}, @{Sir Roland Vance} points down the winding mountain path while advising a slow walking pace to 11-year-old @{Princess Seraphina}" },
  342: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "starlight_mare"], action: "Bending gently beside @{Starlight the Mare}, 11-year-old @{Princess Seraphina} holds her palm near the foreleg of @{Starlight the Mare} as a faint golden light spark flickers" },
  343: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "starlight_mare"], action: "Beside @{Starlight the Mare}, 11-year-old @{Princess Seraphina} steadies her hand against the shoulder of @{Starlight the Mare} as the tiny golden light spark fades" },
  344: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "On the morning trail, @{Sir Roland Vance} respectfully supports 11-year-old @{Princess Seraphina}'s elbow to help her stand upright" },
  345: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance", "starlight_mare"], action: "Walking on foot down the winding mountain forest trail, @{Sir Roland Vance} and 11-year-old @{Princess Seraphina} lead @{Starlight the Mare} carefully by the blue leather reins" },
  346: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Along the steep rocky path lined with loose slate stones, @{Sir Roland Vance} walks ahead to clear the footing for 11-year-old @{Princess Seraphina}" },
  347: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Emerging from the rocky pass into a sun-dappled grove of white-barked mountain birch and spruce trees, @{Princess Seraphina} and @{Sir Roland Vance} follow the trail" },
  348: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Rounding a tall mossy granite boulder on the wooded ridge, 11-year-old @{Princess Seraphina} and @{Sir Roland Vance} feel a warm valley breeze rustle their cloaks" },
  349: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance"], action: "In the center of the birch trail, @{Sir Roland Vance} stops dead in his tracks, his blue-grey eyes widening in sudden astonishment at the scented breeze" },
  350: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "princess_seraphina"], action: "Resting his hand on his sheathed sword hilt on the forest path, @{Sir Roland Vance} inhales the fragrant mountain breeze beside @{Princess Seraphina}" },
  351: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Close-up of 11-year-old @{Princess Seraphina}'s sapphire eyes widening in pure wonder as she breathes in the sweet morning air beside @{Sir Roland Vance}" },
  352: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance", "starlight_mare"], action: "On the sunlit birch trail, @{Starlight the Mare} perks her ears forward happily beside @{Sir Roland Vance} as the warm valley breeze drifts past" },
  353: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Surrounded by sunlit birch trees, 11-year-old @{Princess Seraphina} smiles softly as the soothing aroma of mountain lavender fills the air around her and @{Sir Roland Vance}" },
  354: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "On the forest trail, 11-year-old @{Princess Seraphina} and @{Sir Roland Vance} look eagerly down the wooded slope toward the source of the warm baking bread aroma" },
  355: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "Holding her hands over her stomach on the sunlit path, 11-year-old @{Princess Seraphina} blushes with a shy, endearing smile" },
  356: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance"], action: "On the forest path, @{Sir Roland Vance} rubs his forehead in utter bewilderment at the scent of pure floral soap in the wilderness" },
  357: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina"], action: "Walking eagerly ahead along the birch-lined path, 11-year-old @{Princess Seraphina} peers through the sunlit foliage with bright curiosity" },
  358: { zone: "emerald_valley_forest_trail", chars: ["sir_roland_vance"], action: "Following closely behind on the trail, @{Sir Roland Vance} scans the peaceful birch trees with cautious knightly alertness" },
  359: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Stepping slightly in front on the narrow trail, @{Sir Roland Vance} gestures protectively for 11-year-old @{Princess Seraphina} to stay close behind him" },
  360: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "Parting a curtain of sunlit weeping birch branches at the end of the forest trail, @{Sir Roland Vance} and 11-year-old @{Princess Seraphina} step toward the clearing" },

  // Batch 16 bespoke scenes (361-384): Emerging into the Sanctuary & The Jaw-Dropping Panorama
  361: { zone: "emerald_valley_forest_trail", chars: ["princess_seraphina", "sir_roland_vance"], action: "At the edge of the birch trees where the trail meets the valley clearing, @{Sir Roland Vance} and 11-year-old @{Princess Seraphina} freeze in stunned silence" },
  362: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Standing at the edge of the sunlit valley meadow, 11-year-old @{Princess Seraphina} and @{Sir Roland Vance} gaze out across the breathtaking emerald alpine valley" },
  363: { zone: "miller_sanctuary_farm_exterior", chars: [], action: "Wide sunlit panorama of the peaceful white-stone and oak sanctuary homestead nestled on the flat green valley floor beneath snow-crested alpine peaks" },
  364: { zone: "miller_sanctuary_farm_exterior", chars: ["sir_roland_vance"], action: "At the edge of the meadow, @{Sir Roland Vance} stares in speechlessness as his hand relaxes completely from his sword pommel" },
  365: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Standing at the meadow border, @{Sir Roland Vance} and 11-year-old @{Princess Seraphina} marvel at the peaceful grassy farmyard and neat homestead" },
  366: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Across the sunlit grassy yard before @{Princess Seraphina} and @{Sir Roland Vance} stands the gleaming white limestone and honey-oak homestead" },
  367: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Winding across the green meadow beside @{Princess Seraphina} and @{Sir Roland Vance} is the spotless white-stone water channel carrying crystal-clear mountain water" },
  368: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Along the sunny hillside beside the homestead, vibrant rows of blooming purple alpine lavender sway gently in the breeze before @{Princess Seraphina} and @{Sir Roland Vance}" },
  369: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Rising above the homestead roof, the slender white-stone draft chimney vents a clean, almost invisible wisp of warm air as @{Princess Seraphina} and @{Sir Roland Vance} watch" },
  370: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "At the edge of the grassy yard, 11-year-old @{Princess Seraphina} gasps and points a trembling finger toward the gleaming white limestone walls beside @{Sir Roland Vance}" },
  371: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Set into the white limestone walls before @{Princess Seraphina} and @{Sir Roland Vance}, wide crystal-clear quartz glass windows reflect the brilliant morning sun" },
  372: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina"], action: "Close-up of 11-year-old @{Princess Seraphina} gazing in wonder as morning sunlight sparkles off the distortion-free quartz glass windows showing the warm oak dining room inside" },
  373: { zone: "miller_sanctuary_farm_exterior", chars: ["sir_roland_vance"], action: "Close-up of @{Sir Roland Vance}'s jaw dropping in utter disbelief as he stares at the massive, seamless sheets of crystal-clear window glass" },
  374: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Beside the packed-earth garden path, @{Sir Roland Vance} gestures in amazement toward the wide crystal glass panes while speaking to 11-year-old @{Princess Seraphina}" },
  375: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Standing by the lavender rows, @{Sir Roland Vance} and 11-year-old @{Princess Seraphina} stare in awe at the gleaming widescreen windows of the homestead" },
  376: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina"], action: "Hands clasped over her chest in quiet reverence, 11-year-old @{Princess Seraphina} gazes at the peaceful white-stone sanctuary with sparkling sapphire eyes" },
  377: { zone: "miller_sanctuary_farm_exterior", chars: ["sir_roland_vance"], action: "Examining the mortarless white limestone joints of the water channel, @{Sir Roland Vance} shakes his head in baffled admiration" },
  378: { zone: "miller_sanctuary_farm_exterior", chars: ["sir_roland_vance", "princess_seraphina"], action: "Looking from the stone water channel to the neat herb garden, @{Sir Roland Vance} stands beside 11-year-old @{Princess Seraphina} in puzzled wonder" },
  379: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Across the grassy yard, the heavy oak front door of the farmhouse swings open into the morning sunlight as @{Princess Seraphina} and @{Sir Roland Vance} watch" },
  380: { zone: "miller_sanctuary_farm_exterior", chars: ["sir_roland_vance"], action: "At the edge of the grassy yard, @{Sir Roland Vance} tenses alertly with his hand resting on his sheathed sword hilt as he watches the doorway" },
  381: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Stepping out onto the sunlit wooden cottage porch, @{Garrett Miller} walks casually in his olive-green work shirt and dark-brown leather craftsman apron while carrying a wooden garden rake" },
  382: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Trotting cheerfully out onto the wooden porch beside @{Garrett Miller} is 10-year-old @{Ace Miller} in his cream linen tunic and forest-green craftsman vest" },
  383: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "Over the shoulder of 10-year-old @{Ace Miller} on the sunlit porch, @{LUMINA} hovers playfully with a winking emoji smiley face" },
  384: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Standing near the treeline edge of the grassy yard, 11-year-old @{Princess Seraphina} and @{Sir Roland Vance} blink in stunned surprise as they look across the clearing toward the cottage porch" },

  // Batch 17 bespoke scenes (385-408): Frontier Hospitality & Unconditional Kindness
  385: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Near the purple lavender rows, 10-year-old @{Ace Miller} pauses and turns his head alertly toward the dirt path at the edge of the clearing" },
  386: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "starlight_mare"], action: "Looking across the sunlit grassy yard toward the treeline, 10-year-old @{Ace Miller} spots the dapple-grey royal mare @{Starlight the Mare} at the clearing edge" },
  387: { zone: "miller_sanctuary_farm_exterior", chars: ["lumina", "ace_miller"], action: "Beside 10-year-old @{Ace Miller}, @{LUMINA}'s sky-blue interface pulses with soft golden light as she performs a gentle optical scan" },
  388: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "Floating beside 10-year-old @{Ace Miller}, @{LUMINA} displays a friendly visitor analysis bar indicating zero hostility and a rare golden light mana signature" },
  389: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "On the packed-earth yard path, 10-year-old @{Ace Miller} gently nudges the elbow of his bearded father @{Garrett Miller} and points toward the newcomers" },
  390: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Setting his wooden garden rake against the white-stone water channel, @{Garrett Miller} looks toward the weary visitors with warm, compassionate amber eyes" },
  391: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "ace_miller"], action: "Wiping his calloused hands on his dark-brown leather apron over his olive-green work shirt, @{Garrett Miller} expresses immediate frontier sympathy beside 10-year-old @{Ace Miller}" },
  392: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Walking forward across the sunlit green grass yard, 10-year-old @{Ace Miller} and @{Garrett Miller} approach the visitors with open, welcoming smiles" },
  393: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "At the edge of the grassy yard, @{Sir Roland Vance} steps protectively in front of 11-year-old @{Princess Seraphina} with his hand on his sheathed sword pommel" },
  394: { zone: "miller_sanctuary_farm_exterior", chars: ["sir_roland_vance"], action: "Standing tall in his travel-worn silver-and-blue plate armour, @{Sir Roland Vance} raises his voice in a cautious challenge across the grassy yard" },
  395: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller"], action: "Stopping ten paces away on the packed-earth yard path, @{Garrett Miller} raises both open, empty palms in a calm, peaceful gesture of goodwill" },
  396: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "garrett_miller"], action: "Standing calmly on the packed-earth path, @{Garrett Miller} introduces himself and 10-year-old @{Ace Miller} with a warm, friendly smile" },
  397: { zone: "miller_sanctuary_farm_exterior", chars: ["sir_roland_vance"], action: "Looking from the white-stone water channel to the crystal glass windows, @{Sir Roland Vance} furrows his brow in utter bewilderment" },
  398: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "princess_seraphina"], action: "In the sunlit grassy yard, 10-year-old @{Ace Miller} chuckles softly and looks with kind emerald eyes toward 11-year-old @{Princess Seraphina}" },
  399: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Gesturing casually toward the purple lavender rows and soap drying racks, 10-year-old @{Ace Miller} grins with humble, relaxed charm" },
  400: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Stepping over to the white-stone water channel, 10-year-old @{Ace Miller} unhooks a polished brass cup from his belt and turns a clean brass water tap" },
  401: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "princess_seraphina"], action: "From the polished brass tap on the white-stone water channel, crystal-clear mountain spring water pours into @{Ace Miller}'s brass cup as @{Princess Seraphina} watches" },
  402: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "princess_seraphina"], action: "Walking over on the packed-earth path, 10-year-old @{Ace Miller} offers the brimming brass cup of cold spring water with both hands to 11-year-old @{Princess Seraphina}" },
  403: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "princess_seraphina"], action: "Holding out the cold brass cup in the sunlit grassy yard, 10-year-old @{Ace Miller} speaks gently and warmly to 11-year-old @{Princess Seraphina}" },
  404: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "ace_miller"], action: "Close-up of 11-year-old @{Princess Seraphina} looking into the sincere emerald-green eyes of 10-year-old @{Ace Miller} with touched surprise" },
  405: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "princess_seraphina"], action: "Accepting the polished brass cup from 10-year-old @{Ace Miller}, 11-year-old @{Princess Seraphina} raises the cool spring water to her lips" },
  406: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "ace_miller"], action: "Drinking the crisp, pure filtered spring water from the brass cup, 11-year-old @{Princess Seraphina}'s sapphire eyes light up with refreshment beside @{Ace Miller}" },
  407: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "ace_miller"], action: "Lowering the empty brass cup, 11-year-old @{Princess Seraphina} lets out a quiet breath of pure relief and gratitude before 10-year-old @{Ace Miller}" },
  408: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "starlight_mare"], action: "Smiling warmly in the grassy yard, @{Garrett Miller} gently takes the blue leather reins of @{Starlight the Mare} and gestures toward the welcoming cottage hearth" },

  // Batch 18 bespoke scenes (409-432): The Emotional Lavender Bath & Washing Away the Capital
  409: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina", "clara_miller"], action: "Inside the modest backyard washhouse area, @{Clara Miller} warmly welcomes 11-year-old @{Princess Seraphina}" },
  410: { zone: "miller_sanctuary_bath_courtyard", chars: ["clara_miller", "maya_miller"], action: "At the entrance of the private backyard washhouse, @{Clara Miller} and @{Maya Miller} guide the young guest inside" },
  411: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina", "clara_miller"], action: "As @{Clara Miller} opens the heavy oak washhouse door, 11-year-old @{Princess Seraphina} stops on the threshold in wide-eyed amazement" },
  412: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina", "clara_miller"], action: "Inside the bright enclosed washhouse room, 11-year-old @{Princess Seraphina} and @{Clara Miller} stand beside the clean white-stone wash basin" },
  413: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina", "clara_miller"], action: "Inside the enclosed washhouse before @{Princess Seraphina} and @{Clara Miller} rests a smooth white-stone bathing basin beside a cylindrical stone water filter barrel" },
  414: { zone: "miller_sanctuary_bath_courtyard", chars: ["clara_miller", "princess_seraphina"], action: "At the washhouse filter barrel, @{Clara Miller} turns a polished brass tap, sending a steaming stream of crystal-clear hot water pouring into the white-stone basin before @{Princess Seraphina}" },
  415: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina", "clara_miller"], action: "Looking around the enclosed washhouse in astonishment, 11-year-old @{Princess Seraphina} points toward the steaming brass water tap beside @{Clara Miller}" },
  416: { zone: "miller_sanctuary_bath_courtyard", chars: ["maya_miller", "princess_seraphina"], action: "Inside the warm washhouse, @{Maya Miller} laughs cheerfully and hands a thick, folded white linen towel to 11-year-old @{Princess Seraphina}" },
  417: { zone: "miller_sanctuary_bath_courtyard", chars: ["maya_miller", "princess_seraphina"], action: "Beaming with sisterly pride, @{Maya Miller} points to the warm stone hearth wall behind the basin while explaining the hot water pipe system to @{Princess Seraphina}" },
  418: { zone: "miller_sanctuary_bath_courtyard", chars: ["clara_miller", "princess_seraphina"], action: "Reaching onto the wooden ledge, @{Clara Miller} hands a plain unmarked pale-purple botanical lavender soap bar to 11-year-old @{Princess Seraphina}" },
  419: { zone: "miller_sanctuary_bath_courtyard", chars: ["clara_miller", "princess_seraphina"], action: "With gentle maternal warmth, @{Clara Miller} helps unfasten the heavy, dusty travel cloak from the shoulders of 11-year-old @{Princess Seraphina}" },
  420: { zone: "miller_sanctuary_bath_courtyard", chars: ["maya_miller", "clara_miller"], action: "Stepping out onto the grassy backyard path, @{Clara Miller} and @{Maya Miller} gently close the heavy oak washhouse door to provide privacy" },
  421: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "Inside the warm, fragrant lavender-steam-filled white-stone washhouse, 11-year-old @{Princess Seraphina} sets her dusty travel cloak neatly on a wooden bench" },
  422: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "Surrounded by thick, fragrant white lavender steam in the stone thermal basin, 11-year-old @{Princess Seraphina} sighs with relief as the warm water soothes her shoulders" },
  423: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "Close-up of 11-year-old @{Princess Seraphina}'s face relaxing in peaceful comfort amid rising clouds of warm, aromatic lavender steam" },
  424: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "In the steaming stone basin, 11-year-old @{Princess Seraphina} rubs the pale-purple lavender botanical bar between her hands under the warm water spout" },
  425: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "Rich, snowy-white botanical lather blooms across 11-year-old @{Princess Seraphina}'s hands, filling the white-stone washhouse with soothing floral mist" },
  426: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "Under the warm running brass spout, 11-year-old @{Princess Seraphina} rinses the fragrant white lather from her golden-blonde hair until it shines" },
  427: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "Resting her chin on her hands at the edge of the steaming stone basin, 11-year-old @{Princess Seraphina} gazes peacefully through the rising floral mist" },
  428: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "As warm mountain sunbeams stream through the high quartz glass transom window above, 11-year-old @{Princess Seraphina} covers her face with her clean hands in quiet emotion" },
  429: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "Close-up of 11-year-old @{Princess Seraphina}'s sapphire eyes glistening with gentle tears of relief and gratitude in the warm sunlit washhouse" },
  430: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "In the tranquil, sunlit white-stone sanctuary, 11-year-old @{Princess Seraphina} smiles softly as warm steam curls around her golden hair" },
  431: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina"], action: "Closing her eyes in the warm mist, 11-year-old @{Princess Seraphina} feels a gentle, restorative golden glow of rested mana return to her fingertips" },
  432: { zone: "miller_sanctuary_bath_courtyard", chars: ["princess_seraphina", "clara_miller"], action: "Stepping out of the washhouse in a clean sky-blue linen dress with a soft white towel over her shoulders, 11-year-old @{Princess Seraphina} beams radiantly at @{Clara Miller}" },

  // Batch 19 bespoke scenes (433-456): Supper by the Stone Hearth & The Gentle Light Spark
  433: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "princess_seraphina"], action: "In the warm lamp-lit cottage dining room beside the crackling stone hearth, 10-year-old @{Ace Miller} and 11-year-old @{Princess Seraphina} gather for evening supper" },
  434: { zone: "old_miller_cottage_interior", chars: ["maya_miller", "princess_seraphina"], action: "Seated at the long oak dining table, 11-year-old @{Princess Seraphina} smiles warmly beside @{Maya Miller} in the cozy dining room" },
  435: { zone: "old_miller_cottage_interior", chars: ["sir_roland_vance"], action: "Seated at the oak dining table looking refreshed and clean, @{Sir Roland Vance} admires the sturdy timber-and-stone craftsmanship of the room" },
  436: { zone: "miller_sanctuary_farm_exterior", chars: ["sir_roland_vance", "garrett_miller"], action: "Beside the mortarless white limestone wall and wide quartz glass window, @{Sir Roland Vance} taps the stone joint admiringly before sipping chilled cream with @{Garrett Miller}" },
  437: { zone: "old_miller_cottage_interior", chars: ["garrett_miller", "sir_roland_vance"], action: "Setting his wooden cup down on the oak dining table, @{Sir Roland Vance} speaks with solemn respect to @{Garrett Miller}" },
  438: { zone: "old_miller_cottage_interior", chars: ["sir_roland_vance", "garrett_miller"], action: "Across the dinner table, @{Sir Roland Vance} gestures toward the precision stone hearth while praising the sanctuary's engineering to @{Garrett Miller}" },
  439: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "garrett_miller"], action: "At the dining table, @{Garrett Miller} chuckles modestly and rests a proud hand on the shoulder of 10-year-old @{Ace Miller}" },
  440: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "princess_seraphina"], action: "At the oak table, 11-year-old @{Princess Seraphina} turns her admiring gaze toward 10-year-old @{Ace Miller} as he calmly butters a slice of warm sourdough bread" },
  441: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "princess_seraphina"], action: "Across the warm lamp-lit table, 11-year-old @{Princess Seraphina} smiles with sparkling sapphire eyes at 10-year-old @{Ace Miller}" },
  442: { zone: "old_miller_cottage_interior", chars: ["ace_miller", "princess_seraphina"], action: "At the dining table, 10-year-old @{Ace Miller} and 11-year-old @{Princess Seraphina} pause and turn their heads toward the courtyard door as a horse whinnies outside" },
  443: { zone: "old_miller_cottage_interior", chars: ["sir_roland_vance", "garrett_miller"], action: "Rising from the oak table with a concerned frown, @{Sir Roland Vance} looks toward the door while speaking to @{Garrett Miller}" },
  444: { zone: "old_miller_cottage_interior", chars: ["garrett_miller"], action: "Standing up from his chair by the hearth, @{Garrett Miller} picks up a warm brass lantern and offers to fetch herbal poultice" },
  445: { zone: "old_miller_cottage_interior", chars: ["princess_seraphina"], action: "Rising gracefully from the dining table, 11-year-old @{Princess Seraphina} places a gentle hand over her heart with an earnest, kind smile" },
  446: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "starlight_mare"], action: "Inside the clean, warm lantern-lit timber shelter, 11-year-old @{Princess Seraphina} approaches @{Starlight the Mare} standing on clean straw bedding" },
  447: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "starlight_mare"], action: "At the wooden stall, 11-year-old @{Princess Seraphina} gently rests her forehead against the velvet muzzle of @{Starlight the Mare}" },
  448: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "starlight_mare"], action: "Kneeling down in the clean straw, 11-year-old @{Princess Seraphina} places both gentle hands around the right foreleg joint of @{Starlight the Mare}" },
  449: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "starlight_mare"], action: "Kneeling beside @{Starlight the Mare}, 11-year-old @{Princess Seraphina} closes her eyes in serene concentration as she centers her internal golden light mana" },
  450: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "princess_seraphina", "starlight_mare"], action: "From 11-year-old @{Princess Seraphina}'s palms near @{Starlight the Mare}, warm golden-white light glows while 10-year-old @{Ace Miller} watches" },
  451: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "starlight_mare"], action: "Soothing golden-white light mana flows from 11-year-old @{Princess Seraphina}'s hands into the foreleg of @{Starlight the Mare}" },
  452: { zone: "miller_sanctuary_farm_exterior", chars: ["garrett_miller", "clara_miller", "starlight_mare"], action: "Standing by the lantern-lit stall doorway, @{Garrett Miller} and @{Clara Miller} watch the golden healing light enveloping @{Starlight the Mare} in reverent awe" },
  453: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "Standing beside the stall, 10-year-old @{Ace Miller} watches with laser focus as @{LUMINA}'s sky-blue interface springs to life beside him" },
  454: { zone: "miller_sanctuary_farm_exterior", chars: ["lumina", "ace_miller"], action: "Floating next to 10-year-old @{Ace Miller}, @{LUMINA} flashes an emerald-and-gold high-density golden light mana harmonic wave graph" },
  455: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "princess_seraphina", "starlight_mare"], action: "As 11-year-old @{Princess Seraphina} heals @{Starlight the Mare} with golden light, 10-year-old @{Ace Miller} observes the mana wavelength" },
  456: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "starlight_mare"], action: "Completely restored, @{Starlight the Mare} stamps her healthy hoof happily onto the clean straw and nuzzles 11-year-old @{Princess Seraphina}" },

  // Batch 20 bespoke scenes (457-480): The 5th Affinity Calibrated & The Ominous Raven Over Oakhaven
  457: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina"], action: "Standing up beside the horse stall, 11-year-old @{Princess Seraphina} wipes her brow lightly and offers a warm, relieved smile" },
  458: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "princess_seraphina"], action: "Standing near 11-year-old @{Princess Seraphina}, 10-year-old @{Ace Miller} feels a warm golden resonance glow softly within his chest" },
  459: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "Beside 10-year-old @{Ace Miller}, @{LUMINA} projects a crystalline golden dantian resonance diagram glowing with newly awakened light mana" },
  460: { zone: "miller_sanctuary_farm_exterior", chars: ["lumina", "ace_miller"], action: "Hovering in the lantern-lit courtyard, @{LUMINA}'s interface bursts with celebratory golden sparkles and a beaming emoji smile for 10-year-old @{Ace Miller}" },
  461: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "10-year-old @{Ace Miller} watches @{LUMINA} display the completed golden light mana wave formula locked into his meridian chart" },
  462: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "On @{LUMINA}'s floating blue panel beside 10-year-old @{Ace Miller}, five elemental affinity icons—Earth, Water, Wind, Fire, and Light—shine brightly in gold" },
  463: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "Close-up of 10-year-old @{Ace Miller} discretely opening his palm beside his forest-green craftsman vest as a pure golden-white light mote dances across his fingertips" },
  464: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller", "lumina"], action: "Closing his hand with a calm, confident smile in the starlit courtyard, 10-year-old @{Ace Miller} shares a knowing look with @{LUMINA}" },
  465: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina", "sir_roland_vance"], action: "Walking back across the peaceful lantern-lit courtyard toward the eastern stone guest wing, 11-year-old @{Princess Seraphina} and @{Sir Roland Vance} head inside to rest" },
  466: { zone: "miller_sanctuary_farm_exterior", chars: ["princess_seraphina"], action: "Inside the quiet, windproof stone guest room behind clear quartz glass windows, 11-year-old @{Princess Seraphina} sleeps peacefully under a warm quilt" },
  467: { zone: "miller_sanctuary_farm_exterior", chars: [], action: "First pale grey-and-gold light of dawn breaking over the jagged eastern alpine peaks above the silent, mist-veiled sanctuary valley" },
  468: { zone: "emerald_valley_forest_trail", chars: ["scrying_raven"], action: "Gliding silently on cold high-altitude morning thermals above the forested valley ridge is @{Scrying Raven} with glowing crimson eyes" },
  469: { zone: "emerald_valley_forest_trail", chars: ["scrying_raven"], action: "Extreme close-up of @{Scrying Raven} in flight, showing the small faceted red-and-purple magical scrying gem embedded in its forehead feathers" },
  470: { zone: "emerald_valley_forest_trail", chars: ["scrying_raven"], action: "Tilting its glossy black wings against the dawn sky, @{Scrying Raven} circles high above the wooded valley clearing" },
  471: { zone: "oakhaven_tax_chamber", chars: ["simon_vane", "scrying_raven"], action: "Inside the wood-panelled Oakhaven tax chamber, @{Simon Vane} stares into the glowing scrying crystal orb on his mahogany desk receiving the aerial feed from @{Scrying Raven}" },
  472: { zone: "oakhaven_tax_chamber", chars: ["simon_vane", "guild_fire_mage"], action: "Inside the glowing scrying orb on the mahogany desk before @{Simon Vane} and @{Guild Fire Mage}, an aerial projection shows the white-stone compound and its sparkling glass windows" },
  473: { zone: "oakhaven_tax_chamber", chars: ["simon_vane"], action: "Behind his dark mahogany desk in the Oakhaven tax office, @{Simon Vane} jerks back in shock, spilling his goblet of spiced wine across the tax ledgers" },
  474: { zone: "oakhaven_tax_chamber", chars: ["guild_fire_mage"], action: "Standing beside the mahogany desk in crimson-and-black guild robes, @{Guild Fire Mage} clutches his brass-and-ruby staff and stares at the scrying orb in disbelief" },
  475: { zone: "oakhaven_tax_chamber", chars: ["simon_vane"], action: "Leaning greedily over the glowing scrying crystal orb, @{Simon Vane} narrows his eyes as gold coins glint in his avaricious gaze" },
  476: { zone: "oakhaven_tax_chamber", chars: ["simon_vane", "guild_fire_mage"], action: "Beside the mahogany desk, @{Guild Fire Mage} sneers arrogantly with small orange flames flickering across his fingertips while speaking to @{Simon Vane}" },
  477: { zone: "oakhaven_tax_chamber", chars: ["simon_vane"], action: "Slamming his heavy brass guild seal onto a requisition scroll on his mahogany desk, @{Simon Vane} glares with corrupt fury" },
  478: { zone: "oakhaven_tax_chamber", chars: ["simon_vane", "guild_fire_mage"], action: "Pointing a ring-covered finger toward the door of the Oakhaven tax chamber, @{Simon Vane} issues a ruthless marching order to @{Guild Fire Mage}" },
  479: { zone: "oakhaven_tax_chamber", chars: ["simon_vane", "guild_fire_mage"], action: "Standing over the glowing scrying crystal in the dim tax office, @{Simon Vane} and @{Guild Fire Mage} exchange a dark, greedy grin" },
  480: { zone: "miller_sanctuary_farm_exterior", chars: ["ace_miller"], action: "In the serene golden dawn of the alpine valley, 10-year-old @{Ace Miller} steps out onto the white-stone porch beside the crystal-clear quartz glass windows, looking out at the horizon with calm resolve" }
};

// Strict deterministic zone resolver: 100% explicit per-scene spec required
function resolveZone(sceneNum) {
  const spec = EXPLICIT_SCENE_SPECS[sceneNum];
  if (!spec || !spec.zone) {
    throw new Error(`[FATAL] Missing explicit zone specification for scene ${sceneNum}`);
  }
  return spec.zone;
}

function resolveLocationRef(zoneId) {
  if (zoneId === "old_miller_cottage_interior") return "Old Miller Cottage Interior";
  if (zoneId === "miller_sanctuary_farm_exterior") return "Miller Sanctuary Farm";
  if (zoneId === "miller_sanctuary_bath_courtyard") return "Miller Sanctuary Bath Courtyard";
  if (zoneId === "emerald_valley_forest_trail") return "Emerald Valley Forest Trail";
  if (zoneId === "oakhaven_tax_chamber") return "Oakhaven Tax Guild Chamber";
  return "Miller Sanctuary Farm";
}

function resolveLocationToken(zoneId) {
  return `@{${resolveLocationRef(zoneId)}}`;
}

// Strict deterministic character resolver: 100% explicit per-scene spec required, with minor protagonist index 0 lock
function resolveDynamicCharacters(sceneNum) {
  const spec = EXPLICIT_SCENE_SPECS[sceneNum];
  if (!spec || !Array.isArray(spec.chars)) {
    throw new Error(`[FATAL] Missing explicit character specification for scene ${sceneNum}`);
  }
  const chars = [...spec.chars];
  // Guarantee minor protagonists (Ace Miller / Maya Miller) are prioritised at index 0
  const minors = chars.filter(id => id === 'ace_miller' || id === 'maya_miller');
  const others = chars.filter(id => id !== 'ace_miller' && id !== 'maya_miller');
  if (minors.includes('ace_miller')) {
    return ['ace_miller', ...minors.filter(id => id !== 'ace_miller'), ...others];
  }
  return [...minors, ...others];
}

// Strict deterministic visual staging resolver: zero fallback templates or word-slicers allowed
function generateDynamicSceneAction(sceneNum) {
  const spec = EXPLICIT_SCENE_SPECS[sceneNum];
  if (!spec || !spec.action) {
    throw new Error(`[FATAL] Missing explicit bespoke action for scene ${sceneNum}`);
  }
  return spec.action;
}

// Compact isolation shields
function getIsolationShield(zoneId) {
  let s = "";
  if (zoneId === "emerald_valley_forest_trail") {
    s = "solitary mountain trail, zero soldiers.";
  } else if (zoneId === "oakhaven_tax_chamber") {
    s = "private tax office, zero citizens.";
  } else {
    s = "solitary homestead, zero extra villagers.";
  }
  return `${s} no windmills, no water wheels, no gears.`;
}

const TAIL_POS = "cleanly rendered hand linework, distinct individual fingers, crisp pupil reflections";
const TAIL_NEG = "zero cloning, completely textless artwork, no speech bubbles, no words, no banners";
const STYLE_BASE = "bright manhwa art style, clean black ink linework, warm luminous cel shading, horizontal 16:9 (1920x1080) full bleed widescreen composition";

let matrixOutput = `# 02_Prompt_Matrix.md — Series 06 Episode 02 (480 Scenes / 20 Modular Batches)\n\n`;
matrixOutput += `> **Franchise:** The Archmage Engineer: Building a Modern Sanctuary in a Medieval World (Series 06)  \n`;
matrixOutput += `> **Episode:** EP02: The Quartz Glass Windows and The Royal Arrival (Arc I, Episode 2 of 5)  \n`;
matrixOutput += `> **Format:** 16:9 Full-Bleed Landscape (~70% Dual/Multi-Panel, ~30% Hero Plates)  \n`;
matrixOutput += `> **Total Scenes:** 480 Scenes (Batches 01–20, 24 Scenes Per Batch)  \n`;
matrixOutput += `> **Visual Aesthetic:** The Emerald Alpine Valley & Cozy Modern-Medieval Sanctuary (Bright Korean Fantasy Manhwa, Sharp Clean Ink Linework, Warm Luminous Cel Shading)  \n`;
matrixOutput += `> **Entity Standard:** Native Google Flow Name-Linking (@{Entity Name})\n\n`;
matrixOutput += `---\n\n`;

const BATCH_TITLES = [
  "Morning in the Alpine Valley & Blueprints of the Master Mason",
  "The Riverside Limestone Quarry & Resonant Earth Shaping",
  "Hauling the White Stone & Assembling the New Cottage Wing",
  "The River Bend Discovery & Pure Quartz Sand",
  "The Dual-Chamber Refractory Kiln & Alumina Firebricks",
  "Firing the Refractory Kiln & Achieving White Heat",
  "The Alchemy of Glass & The First Pour",
  "Annealing the Pane & Family Wonder",
  "Framing Widescreen Windows & Flooding the Farm with Light",
  "The Food Preservation Dilemma & Alpine Cork Oak",
  "Engineering the Sub-Ground Cold Storage & Ice Mana Convection",
  "Chilled Lavender Cream, Fresh Bread & Family Feast",
  "The Exhausted Royal Fugitives on the Forest Trail",
  "Campfire by the Mountain Stream & The Lingering Royal Burden",
  "The Scent of Lavender and Bread on the Morning Breeze",
  "Emerging into the Sanctuary & The Jaw-Dropping Panorama",
  "Frontier Hospitality & Unconditional Kindness",
  "The Emotional Lavender Bath & Washing Away the Capital",
  "Supper by the Stone Hearth & The Gentle Light Spark",
  "The 5th Affinity Calibrated & The Ominous Raven Over Oakhaven"
];

let currentBatch = 0;
let prevZoneId = null;
let updatedScriptContent = scriptContent;

matches.forEach((m, idx) => {
  const sceneNum = idx + 1;
  const tagId = `IMG_${String(sceneNum).padStart(3, '0')}`;
  const narrativeClause = normalizeClause(m[2]);
  const batchNum = Math.ceil(sceneNum / 24);

  if (batchNum !== currentBatch) {
    currentBatch = batchNum;
    const startNum = String((currentBatch - 1) * 24 + 1).padStart(3, '0');
    const endNum = String(currentBatch * 24).padStart(3, '0');
    const title = BATCH_TITLES[currentBatch - 1];
    matrixOutput += `## 📦 BATCH ${String(currentBatch).padStart(2, '0')} (Scenes ${startNum} - ${endNum}): ${title}\n\n`;
  }

  const layout = TIER_CYCLE[idx % TIER_CYCLE.length];
  const tierLetter = layout.startsWith("Tier A") ? "A" : layout.startsWith("Tier C") ? "C" : "B";

  const clauseLower = narrativeClause.toLowerCase();
  const zoneId = resolveZone(sceneNum, clauseLower);
  const locRef = resolveLocationRef(zoneId);
  const locToken = resolveLocationToken(zoneId);

  const activeCharIds = resolveDynamicCharacters(sceneNum, narrativeClause, zoneId);

  // Synchronize 01_Episode_Script.md staging header so script & matrix are 100% aligned
  const castTokens = activeCharIds.map(id => entities[id]?.token).filter(Boolean);
  const stageType = castTokens.length === 0 ? 'establishing' : castTokens.length === 1 ? 'solo' : 'interaction';
  const actorToken = castTokens[0] || 'NONE';
  const techStage = sceneNum < 193 ? 'ep01_stage1' : 'ep02_stage2';
  const planTalk = sceneNum >= 73 && sceneNum <= 79 ? 'true' : 'false';
  const newHeader = `<!-- ZONE: ${zoneId} | STAGE: ${stageType} | ACTOR: ${actorToken} | CAST: [${castTokens.join(', ')}] | PROPS: [] | TECH_STAGE: ${techStage} | PLAN_TALK: ${planTalk} -->`;
  const tagHeaderRegex = new RegExp(`(\\[${tagId}\\]\\s*)(?:<!--\\s*ZONE:[\\s\\S]*?-->\\s*)?`, 'i');
  updatedScriptContent = updatedScriptContent.replace(tagHeaderRegex, `$1${newHeader} `);

  // Build character_refs: Location first, then characters/items
  const charRefs = [locRef];
  for (const cId of activeCharIds) {
    const ent = entities[cId];
    if (ent) {
      charRefs.push(ent.token.replace(/^@\{|\}$/g, ''));
    }
  }

  // Create narrative-anchored visual action
  const sceneAction = generateDynamicSceneAction(sceneNum, narrativeClause, tierLetter, activeCharIds, zoneId);

  let layoutPrefix = "";
  if (tierLetter === "A") {
    layoutPrefix = `Single-panel full-bleed horizontal hero plate. Wide 28mm composition: In ${locToken}, ${sceneAction}.`;
  } else if (tierLetter === "B") {
    layoutPrefix = `Dual-panel manhwa webtoon comic strip with thin black panel borders. In ${locToken}, ${sceneAction}.`;
  } else {
    layoutPrefix = `Three-panel dynamic horizontal manhwa action strip. In ${locToken}, ${sceneAction}.`;
  }

  // Use tech_stages.ep02_stage2 ONLY from scene 202 onwards when glass windows are mounted into the farmhouse walls!
  // For scenes 1-201, use zones[zoneId].canon (which has wooden shutters / zero glass windows installed and fits within the 450-token budget)
  let zoneCanon = zones[zoneId].canon.trim().replace(/\.$/, '');
  if ((zoneId === 'miller_sanctuary_farm_exterior' || zoneId === 'old_miller_cottage_interior') && sceneNum >= 202 && zones[zoneId].tech_stages?.ep02_stage2) {
    zoneCanon = zones[zoneId].tech_stages.ep02_stage2.trim().replace(/\.$/, '');
  }
  const spatialEnclosure = `Spatial Enclosure: ${locToken} (${zoneCanon}).`;
  const isolationShield = getIsolationShield(zoneId);

  let prompt = "";
  if (activeCharIds.length === 0) {
    prompt = `${layoutPrefix} Zero characters present, pure establishing scene. ${spatialEnclosure} ${isolationShield} ${STYLE_BASE}, ${TAIL_POS}, ${TAIL_NEG}.`;
  } else {
    const compiledEntityBlocks = activeCharIds.map(id => getEntityBlock(id)).join(', ');
    prompt = `${layoutPrefix} Featuring ${compiledEntityBlocks}. ${spatialEnclosure} ${isolationShield} ${STYLE_BASE}, ${TAIL_POS}, ${TAIL_NEG}.`;
  }

  // Sanitize any remaining quotes
  prompt = prompt.replace(/["“”«»「」『』]/g, '');

  // Legal adjacency transition check
  let transition = "adjacent";
  if (prevZoneId && prevZoneId !== zoneId) {
    const legalNext = zones[prevZoneId]?.adjacent || [];
    if (!legalNext.includes(zoneId)) {
      transition = "cut";
    }
  }
  prevZoneId = zoneId;

  matrixOutput += `  <scene id="${tagId}" filename="${tagId}.jpg" tier="${tierLetter}" zone="${zoneId}" transition="${transition}">\n`;
  matrixOutput += `    <tag>${tagId}</tag>\n`;
  matrixOutput += `    <layout>${layout}</layout>\n`;
  matrixOutput += `    <character_refs>${charRefs.join(', ')}</character_refs>\n`;
  matrixOutput += `    <narrative_sync>${narrativeClause}</narrative_sync>\n`;
  matrixOutput += `    <action_layer>${sceneAction}</action_layer>\n`;
  matrixOutput += `    <prompt>${prompt}</prompt>\n`;
  matrixOutput += `  </scene>\n\n`;
});

fs.writeFileSync(scriptPath, updatedScriptContent, 'utf8');
fs.writeFileSync(outputPath, matrixOutput, 'utf8');

const manifest = PromptDnaCompiler.generateSignedManifest({
  franchise,
  entities,
  zones,
  ledgerEvents,
  scriptText: updatedScriptContent,
  matrixMarkdown: matrixOutput
});
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Successfully synchronized 01_Episode_Script.md headers, generated 02_Prompt_Matrix.md (480 scenes), and signed dispatch_manifest.json (${manifest.signature.slice(0, 16)}...)`);
