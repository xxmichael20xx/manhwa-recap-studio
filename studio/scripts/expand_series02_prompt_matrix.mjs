import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../../')
const epDir = path.resolve(projectRoot, '01_Franchises/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_Double_FRank_Anomaly_and_Awakening')
const promptMatrixPath = path.join(epDir, '02_Prompt_Matrix.md')

console.log('📝 Reading 02_Prompt_Matrix.md...')
let matrixContent = fs.readFileSync(promptMatrixPath, 'utf-8')

// Update metadata header
matrixContent = matrixContent.replace(/> \*\*Total Batches:\*\* .*/g, '> **Total Batches:** 13 Modular Batches (24 Scenes Each = 312 Total Scenes)')

// Check where Batch I ends
const batchIPos = matrixContent.indexOf('### 📦 Batch I:')
if (batchIPos !== -1) {
  const batchIEndPos = matrixContent.indexOf('</batch>', batchIPos)
  if (batchIEndPos !== -1) {
    const nextFence = matrixContent.indexOf('```', batchIEndPos)
    if (nextFence !== -1) {
      matrixContent = matrixContent.substring(0, nextFence + 3).trim() + '\n\n---\n\n'
    }
  }
}

const batchesJtoM = `### 📦 Batch J: IMG_217 to IMG_240 (Underworld Vault & Master Boros)

\`\`\`xml
<batch id="Batch_J" series="Series_02" episode="EP01" scenes="IMG_217-IMG_240" format="16:9">

<scene id="IMG_217" filename="IMG_217.jpg" motion="pan_left_to_right">
IMG217, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen composition. Departing District 9 plaza. [Left foreground]: @{Kaelen Thorne - Awakened Sovereign} in charcoal-grey trench coat walking away into the shadows of the evening alleyway, clutching his reinforced leather pouch containing 8 gold sovereigns and 300 silver pieces. [Right background]: Distant crowd of freelance hunters still gathering around the subway entrance. Dark fantasy action manhwa art style, sharp ink linework, volumetric neon dusk lighting, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_218" filename="IMG_218.jpg" motion="hero_zoom_in">
IMG218, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape close-up. Analytical gaze. [Center]: Tight close-up of Kaelen pulling up the high collar of his charcoal coat against the descending dusk, piercing luminous glowing amethyst-purple eyes scanning the rooftops for surveillance drones. Dark fantasy action manhwa art style, sharp angular jawline, cinematic rim lighting, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_219" filename="IMG_219.jpg" motion="hero_zoom_out">
IMG219, 16:9 widescreen establishing shot. Predatory guild territory. [Center]: Grand panoramic view of District 9 transitioning into the darker industrial fringe; looming high-rise corporate towers of Aegis Vanguard in the distant skyline with flashing security beacons. Dark fantasy action manhwa art style, oppressive cyberpunk-fantasy metropolis, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_220" filename="IMG_220.jpg" motion="pan_top_to_bottom">
IMG220, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape shot. Descent to District 4. [Center]: Kaelen descending a rusted spiral iron staircase along the moss-covered stone walls of the Old Industrial Canal, heading into the damp subterranean drainage conduits. [Environment]: Decaying industrial canal, fog-shrouded green-tinted water. Dark fantasy action manhwa art style, atmospheric depth, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_221" filename="IMG_221.jpg" motion="pan_left_to_right">
IMG221, 16:9 widescreen composition. The Underbelly of District 4. [Center]: Sprawling subterranean black market avenue beneath massive concrete sewer aqueducts, flickering neon signs in violet and amber reflecting on wet asphalt, shadowy brokers trading illegal cores. Dark fantasy action manhwa art style, gritty cyberpunk-fantasy underworld, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_222" filename="IMG_222.jpg" motion="pan_right_to_left">
IMG222, 16:9 landscape shot. Aegis surveillance drones. [Center]: Two sleek crimson-and-gold Aegis Vanguard automated surveillance drones hovering above the canal bridge, their glowing red optical lenses casting sweeping conical laser searchlights across the concrete walkways. Dark fantasy action manhwa art style, high-tech security threat, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_223" filename="IMG_223.jpg" motion="hero_zoom_in">
IMG223, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen close-up. Spatial blind angle calculation. [Center]: Kaelen's face bathed in faint purple holographic trajectory grids as his 10,000x cognitive velocity calculates the 6-degree rotational blind angle of the drone sensors. Dark fantasy action manhwa art style, high-IQ predictive calculation, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_224" filename="IMG_224.jpg" motion="pan_diagonal_sweep">
IMG224, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape action glide. Shadow evasion. [Center]: Kaelen sliding effortlessly between heavy rusted drainage pillars in a fluid motion, slipping beneath the red laser sweep without triggering a single sensor, stepping through a heavy reinforced iron hatch. Dark fantasy action manhwa art style, tactical stealth movement, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_225" filename="IMG_225.jpg" motion="hero_zoom_out">
IMG225, 16:9 widescreen shot. Inside the illicit salvage vault. [Center]: Vast underground chamber filled with illegal crafters, alchemists, and rogue gunsmiths surrounded by glowing mana-furnaces, pressurized steam pipes, and crates of unregistered monster parts. Dark fantasy action manhwa art style, dense industrial detail, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_226" filename="IMG_226.jpg" motion="hero_zoom_in">
IMG226, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape tracking shot. Past-life recollection. [Center]: Kaelen walking with absolute confidence through the crowded underground corridor, ignoring counterfeit weapon peddlers, his sharp eyes fixed on the rear alcove. Dark fantasy action manhwa art style, purposeful stride, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_227" filename="IMG_227.jpg" motion="pan_left_to_right">
IMG227, 16:9 widescreen composition. Bypassing low-grade stalls. [Left foreground]: Flashy merchant waving glowing neon enchanted daggers with cheap crystal hilts. [Right]: Kaelen walking past without a single glance, heading straight toward the darker rear corridor. Dark fantasy action manhwa art style, sharp visual contrast, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_228" filename="IMG_228.jpg" motion="hero_zoom_in">
IMG228, 16:9 landscape shot. The Iron Crucible Vault placard. [Center]: Weathered, oil-stained copper placard hanging above a reinforced iron door, stamped with a heavy anvil and a shattered runic circle: 'THE IRON CRUCIBLE VAULT'. Dark fantasy action manhwa art style, rustic industrial aesthetic, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_229" filename="IMG_229.jpg" motion="pan_right_to_left">
IMG229, 16:9 widescreen composition. Master Boros at workbench. [Center]: Broad-shouldered, silver-bearded dwarven machinist Master Boros in a heavy leather apron, brass mechanical ocular implant whirring as he furiously polishes the firing chamber of a heavy mana-cannon at his titanium workbench. Dark fantasy action manhwa art style, master craftsman detail, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_230" filename="IMG_230.jpg" motion="hero_zoom_in">
IMG230, 16:9 landscape character shot. Boros backstory lore. [Center]: Boros's stern, scarred face and mechanical eye, surrounded by blueprints of discarded military ballistics and blacklisted imperial patents. Dark fantasy action manhwa art style, grizzled veteran engineer, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_231" filename="IMG_231.jpg" motion="hero_zoom_in">
IMG231, 16:9 widescreen dialogue shot. Boros dismissive wave. [Right foreground]: Boros grunting gruffly without looking up: 'Shop is closed, lad. Unless you have a registered guild procurement permit, take your business to the trinket merchants outside.' Dark fantasy action manhwa art style, gruff artisan demeanor, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_232" filename="IMG_232.jpg" motion="hero_zoom_in">
IMG232, 16:9 landscape composition. Five gold sovereigns on counter. [Center]: Kaelen's gloved hand placing five pristine, heavy imperial gold sovereigns in a neat, gleaming row upon the dark, oil-stained metal workbench. Dark fantasy action manhwa art style, radiant gold coin prop, dramatic high-contrast focus, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_233" filename="IMG_233.jpg" motion="hero_zoom_in">
IMG233, 16:9 widescreen shot. Boros freezing in shock. [Center]: Master Boros freezing mid-motion, his mechanical bronze ocular lens clicking and zooming in shock at the pristine gold coins resting on his counter. Dark fantasy action manhwa art style, comical yet tense artisan shock, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_234" filename="IMG_234.jpg" motion="hero_zoom_in">
IMG234, 16:9 landscape close-up. Boros inspecting coin. [Center]: Boros adjusting his optical lens and staring at the immaculate imperial mint marks: 'Five sovereigns... solid gold. No unranked scavenger carries coin like this. What are you looking for, boy?' Dark fantasy action manhwa art style, suspicious scrutiny, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_235" filename="IMG_235.jpg" motion="pan_left_to_right">
IMG235, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen dialogue shot. Kaelen's requisition. [Left]: @{Kaelen Thorne - Awakened Sovereign} calm and imposing, demanding: 'Forty kilograms of unrefined Void-Titanium ingots, micro-diamond etching styluses, and that decommissioned Mark-Three runic lathe under your canvas tarp.' [Right background]: Dusty canvas tarp covering a massive machine. Dark fantasy action manhwa art style, cold authority, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_236" filename="IMG_236.jpg" motion="hero_zoom_in">
IMG236, 16:9 landscape close-up. Boros warning. [Center]: Boros narrowing his eyes: 'That lathe hasn't run in six years. Its runic indexing motor requires sub-millimetre calibration that would melt an ordinary gunsmith's brain.' Dark fantasy action manhwa art style, solemn warning, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_237" filename="IMG_237.jpg" motion="hero_zoom_in">
IMG237, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen composition. Pushing sixth sovereign. [Center]: Kaelen calmly pushing a sixth gold sovereign and fifty silver pieces across the counter: 'The calibration will not be an issue. Deliver it crated to Sub-Level 4, District 9 within two hours.' Dark fantasy action manhwa art style, decisive deal execution, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_238" filename="IMG_238.jpg" motion="hero_zoom_in">
IMG238, 16:9 landscape shot. Boros testing gold. [Center]: Boros biting down on the gold coin with iron teeth to confirm density, nodding gruffly: 'Deal, lad. But keep whatever you build away from Aegis Vanguard patrols.' Dark fantasy action manhwa art style, rustic merchant nod, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_239" filename="IMG_239.jpg" motion="hero_zoom_in">
IMG239, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen close-up. Kaelen chilling parting remark. [Center]: Kaelen turning with a faint, chilling smile: 'By the time Aegis Vanguard notices what I am building, their territory will already be irrelevant.' Dark fantasy action manhwa art style, intense sovereign resolve, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_240" filename="IMG_240.jpg" motion="pan_left_to_right">
IMG240, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape shot. Egress to District 9. [Center]: Kaelen vanishing into the shadowy canal mist, seamlessly calculating return transit vectors with zero tailing operatives. Dark fantasy action manhwa art style, cinematic mist exit, horizontal 16:9, textless manhwa artwork.
</scene>

</batch>
\`\`\`

---

### 📦 Batch K: IMG_241 to IMG_264 (Basement Workshop & Ballistic Runecrafting)

\`\`\`xml
<batch id="Batch_K" series="Series_02" episode="EP01" scenes="IMG_241-IMG_264" format="16:9">

<scene id="IMG_241" filename="IMG_241.jpg" motion="hero_zoom_in">
IMG241, 16:9 widescreen composition. Freight delivery in basement. [Center]: Inside Kaelen's reinforced subterranean workshop beneath District 9, a heavy pneumatic cargo lift clanging to a halt, revealing the heavy wooden crate holding the Mark-III runic lathe and forty kilograms of dark matte-grey Void-Titanium ingots. Dark fantasy action manhwa art style, industrial basement setting, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_242" filename="IMG_242.jpg" motion="pan_left_to_right">
IMG242, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape shot. Workshop lockdown. [Center]: Kaelen locking the triple-bolted titanium blast door of his workshop, sliding heavy sound-dampening acoustic panels into place, and connecting high-voltage power conduits to the lathe. Dark fantasy action manhwa art style, secure bunker preparation, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_243" filename="IMG_243.jpg" motion="hero_zoom_in">
IMG243, 16:9 widescreen close-up. Void-Titanium ingots. [Center]: Close-up of the dense, matte-grey Void-Titanium ingots humming with faint, deep spatial vibrations—a rare non-conductive alloy mined from deep dimensional faults, completely immune to magic. Dark fantasy action manhwa art style, rare metal artifact texture, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_244" filename="IMG_244.jpg" motion="hero_zoom_out">
IMG244, 16:9 landscape composition. Ballistics theory breakdown. [Center]: Floating holographic schematic showing a standard bullet shattering against a glowing mage barrier, contrasted against a Void-Titanium projectile destabilising the mana field on kinetic impact. Dark fantasy action manhwa art style, technical combat theory graphic, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_245" filename="IMG_245.jpg" motion="hero_zoom_in">
IMG245, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen composition. Clamping ingot into lathe. [Center]: Kaelen clamping the solid cylinder of Void-Titanium into the high-precision rotary chuck of the Mark-III pneumatic lathe, closing his eyes to center his focus. Dark fantasy action manhwa art style, artisan focus, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_246" filename="IMG_246.jpg" motion="hero_zoom_in">
IMG246, 16:9 widescreen composition. In-Frame System HUD Archetype. [Center]: Amethyst status window projecting into Kaelen's vision: '[SOVEREIGN GENE ACTIVATION: Neural Calculation Velocity engaged at 10,000x | Cognitive Time Dilation: Active]'. Dark fantasy action manhwa art style, clean vector system HUD, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_247" filename="IMG_247.jpg" motion="hero_zoom_out">
IMG247, 16:9 landscape shot. Frozen time in workshop. [Center]: The entire workshop frozen in absolute stillness; electric sparks from the lathe motor suspended mid-air as glowing geometric calculation lines spread across Kaelen's field of view. Dark fantasy action manhwa art style, cinematic bullet-time visual, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_248" filename="IMG_248.jpg" motion="hero_zoom_in">
IMG248, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen close-up. Micro-diamond precision etching. [Center]: Extreme macro shot of Kaelen's steady hand guiding the micro-diamond etching stylus, carving microscopic spiral micro-grooves along the ogive contour of a tungsten penetrator core at sub-millimetre accuracy. Dark fantasy action manhwa art style, extreme high-precision craftsmanship, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_249" filename="IMG_249.jpg" motion="hero_zoom_in">
IMG249, 16:9 landscape macro shot. Runic spiral geometry. [Center]: Close-up of the twenty-three point five degree spiral groove glowing with faint amethyst kinetic runic script, designed for destructive acoustic phase cancellation against mana barriers. Dark fantasy action manhwa art style, glowing runic engineering detail, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_250" filename="IMG_250.jpg" motion="pan_left_to_right">
IMG250, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen shot. Hyper-velocity manufacturing. [Center]: Kaelen's hands moving at blur-speed under cognitive acceleration, completing forty hours of precision ballistics labor in forty real-world seconds. Dark fantasy action manhwa art style, kinetic craft motion blur, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_251" filename="IMG_251.jpg" motion="hero_zoom_in">
IMG251, 16:9 landscape composition. Completed custom ammunition trays. [Center]: Forty gleaming hand-finished Void-Titanium sabot rounds arranged in a brass sorting tray, alongside twenty specialized Acoustic Resonator hollow-point cartridges with exposed violet resonance crystals. Dark fantasy action manhwa art style, pristine bespoke ammunition prop, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_252" filename="IMG_252.jpg" motion="hero_zoom_in">
IMG252, 16:9 widescreen close-up. Pristine projectile inspection. [Center]: Single Phase-Disruptor tungsten sabot round held between Kaelen's fingers, light reflecting off its polished titanium jacket and intricate micro-runes. Dark fantasy action manhwa art style, lethal aesthetic beauty, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_253" filename="IMG_253.jpg" motion="hero_zoom_in">
IMG253, 16:9 widescreen composition. In-Frame System HUD Archetype. [Center]: @{Prop: Holographic System HUD} notification flaring: '[SYSTEM NOTIFICATION: Unregistered Kinetic Weaponry Successfully Engineered | Architectural Threat Rating: High]'. Dark fantasy action manhwa art style, crisp glowing UI, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_254" filename="IMG_254.jpg" motion="hero_zoom_in">
IMG254, 16:9 landscape composition. In-Frame System HUD Archetype. [Center]: @{Prop: Holographic System HUD} flashing amethyst: '[SPECIALIZED SUB-AUTHORITY UNLOCKED: Sovereign Runic Crafting (Foundation Grade) | Non-Mana Ballistics Mastery]'. Dark fantasy action manhwa art style, rare skill unlock fanfare, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_255" filename="IMG_255.jpg" motion="hero_zoom_in">
IMG255, 16:9 widescreen composition. In-Frame System HUD Archetype. [Center]: @{Prop: Holographic System HUD} displaying crafting breakdown: '[CRAFTING ANALYSIS: Void-Titanium Phase-Disruptor Rounds (x40) & Acoustic Resonators (x20) registered to biological signature]'. Dark fantasy action manhwa art style, detailed item register UI, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_256" filename="IMG_256.jpg" motion="hero_zoom_in">
IMG256, 16:9 landscape shot. Experience reward popup. [Center]: Radiant purple mana motes swirling around Kaelen: '[EXPERIENCE REWARD: +450 EXP for Architectural Innovation | Level Progression Triggered]'. Dark fantasy action manhwa art style, ethereal leveling glow, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_257" filename="IMG_257.jpg" motion="hero_zoom_in">
IMG257, 16:9 widescreen composition. In-Frame System HUD Archetype. [Center]: @{Prop: Holographic System HUD} displaying Level 7 stats: '[LEVEL UP: Level 6 -> Level 7 | Strength: 14 | Agility: 19 | Constitution: 15 | Perception: 242 | Allocated: +2 Perception, +1 Agility]'. Dark fantasy action manhwa art style, pristine status UI, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_258" filename="IMG_258.jpg" motion="hero_zoom_in">
IMG258, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape close-up. Exhaling breath. [Center]: Kaelen taking a deep, steady breath as time dilation subsides, heightened perception settling smoothly into his relaxed posture. Dark fantasy action manhwa art style, composed mastery, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_259" filename="IMG_259.jpg" motion="hero_zoom_in">
IMG259, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen shot. Loading magazine. [Center]: Kaelen holding @{Weapon: Dual Ironclad Mag-Pistols}, loading twelve Phase-Disruptor sabot rounds into the extended tungsten box magazine with smooth, deliberate precision. Dark fantasy action manhwa art style, tactical reloading action, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_260" filename="IMG_260.jpg" motion="hero_zoom_in">
IMG260, 16:9 landscape close-up. Magazine locking into mag-well. [Center]: Close-up of the heavy tungsten magazine clicking into the mag-well with a crisp mechanical *clack*, slide racking back smoothly to chamber the first custom round. Dark fantasy action manhwa art style, high-detail firearm mechanical action, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_261" filename="IMG_261.jpg" motion="pan_left_to_right">
IMG261, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen composition. Dual sidearms ready. [Center]: Kaelen holding both @{Weapon: Dual Ironclad Mag-Pistols} at low ready, eyes glowing with amethyst confidence, possessing lethal Grade-D and Grade-C barrier-piercing kinetic firepower. Dark fantasy action manhwa art style, protagonist weapon readiness, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_262" filename="IMG_262.jpg" motion="hero_zoom_in">
IMG262, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape shot. Holstering weapons. [Center]: Kaelen sliding both mag-pistols into the reinforced black tactical holsters at his thighs, letting the long charcoal trench coat drape naturally over them. Dark fantasy action manhwa art style, sleek concealed weapon silhouette, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_263" filename="IMG_263.jpg" motion="hero_zoom_in">
IMG263, 16:9 widescreen close-up. Digital chronometer check. [Center]: Kaelen checking the glowing green LED display on his desk chronometer: 'October 18, Year 0 — 19:40 PM. Three days until the Grand Hunter Academy Entrance Trials.' Dark fantasy action manhwa art style, digital chronometer prop, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_264" filename="IMG_264.jpg" motion="hero_zoom_out">
IMG264, 16:9 landscape shot. Emergency sirens howling. [Center]: Kaelen lifting his head sharply as sudden red emergency lights reflect through the high basement grating, loud municipal sirens howling from the outer industrial district. Dark fantasy action manhwa art style, sudden emergency tension, horizontal 16:9, textless manhwa artwork.
</scene>

</batch>
\`\`\`

---

### 📦 Batch L: IMG_265 to IMG_288 (Sector 7 Incursion & Corporate Lockout)

\`\`\`xml
<batch id="Batch_L" series="Series_02" episode="EP01" scenes="IMG_265-IMG_288" format="16:9">

<scene id="IMG_265" filename="IMG_265.jpg" motion="pan_left_to_right">
IMG265, 16:9 widescreen establishing shot. Red sirens across District 7. [Center]: Flashing red emergency beacons illuminating the sprawling industrial railway yard and factory smokestacks of District 7 under the midnight sky. Dark fantasy action manhwa art style, dramatic industrial disaster atmosphere, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_266" filename="IMG_266.jpg" motion="hero_zoom_in">
IMG266, 16:9 landscape shot. Grade-D dimensional rift rupture. [Center]: Massive jagged violet tear in the fabric of physical space rupturing directly above Freight Maintenance Terminal Four, crackling with dark dimensional lightning and purple shockwaves. Dark fantasy action manhwa art style, cosmic dimensional breach, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_267" filename="IMG_267.jpg" motion="pan_top_to_bottom">
IMG267, 16:9 widescreen shot. Shadow Stalker swarm. [Center]: Over thirty-five predatory three-meter Abyssal Shadow Stalkers crawling out of the rift, their multi-jointed legs and refractive stealth carapaces bending light as they drop onto the steel warehouse roof. Dark fantasy action manhwa art style, arachnid monster swarm, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_268" filename="IMG_268.jpg" motion="hero_zoom_in">
IMG268, 16:9 landscape composition. Trapped workers in Terminal Four. [Center]: Inside Freight Terminal Four, forty civilian railway workers in blue boiler suits and hard hats barricaded behind glass-walled storage bays, screaming in terror as monster scythe limbs slice through sheet-metal walls. Dark fantasy action manhwa art style, civilian terror and high tension, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_269" filename="IMG_269.jpg" motion="pan_right_to_left">
IMG269, 16:9 widescreen shot. Aegis Vanguard convoy arrives. [Center]: Convoy of four heavy crimson-and-gold armored personnel carriers screeching to a halt outside Terminal Four, deploying twenty heavily armed Aegis Vanguard mercenaries with gilded shields. Dark fantasy action manhwa art style, militarised corporate guild deployment, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_270" filename="IMG_270.jpg" motion="hero_zoom_in">
IMG270, 16:9 landscape character shot. Executive Commander Ronald Vane. [Center]: Ronald Vane, elder cousin of Jason Vane, clad in colossal gilded crimson battle plate with a gold cape, standing with arms crossed and surveying the warehouse with cold corporate indifference. Dark fantasy action manhwa art style, ruthless corporate commander, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_271" filename="IMG_271.jpg" motion="hero_zoom_in">
IMG271, @{Lord Jason Vane - Aegis Vanguard Scion}, 16:9 widescreen shot. Jason smug beside Ronald. [Center]: Jason Vane standing beside his cousin Ronald, holding his rapier and smirking arrogantly as emergency sirens reflect across his platinum-blonde hair. Dark fantasy action manhwa art style, aristocratic malice, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_272" filename="IMG_272.jpg" motion="hero_zoom_in">
IMG272, 16:9 landscape dialogue shot. Civilian supervisor begging. [Left]: Panicked civilian railway supervisor with tear-stained face grabbing Ronald Vane's gilded gauntlet: 'Commander Vane! Forty workers are trapped inside! The main power is cut—deploy your squad immediately!' Dark fantasy action manhwa art style, desperate plea, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_273" filename="IMG_273.jpg" motion="hero_zoom_in">
IMG273, 16:9 widescreen shot. Ronald checking datapad. [Center]: Ronald Vane glancing at his glowing datapad with callous disdain: 'District 7 falls under Municipal Transit Jurisdiction. Terminal Four houses twelve Aegis locomotives carrying twenty million sovereigns in raw mana ore.' Dark fantasy action manhwa art style, cold corporate calculation, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_274" filename="IMG_274.jpg" motion="hero_zoom_in">
IMG274, 16:9 landscape composition. Ronald's lockdown order. [Center]: Ronald raising his armored gauntlet to his officers: 'Under Guild Maritime Clause 88, our obligation is corporate property preservation. Activate heavy titanium perimeter shields and lock down the terminal.' Dark fantasy action manhwa art style, ruthless command, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_275" filename="IMG_275.jpg" motion="hero_zoom_in">
IMG275, 16:9 widescreen close-up. Supervisor horror. [Center]: Tight close-up of the civilian supervisor staring in sheer horror: 'Lock down the perimeter?! That will trap the workers inside with the monsters!' Dark fantasy action manhwa art style, visceral shock and despair, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_276" filename="IMG_276.jpg" motion="hero_zoom_in">
IMG276, @{Lord Jason Vane - Aegis Vanguard Scion}, 16:9 landscape shot. Jason extortion clause. [Center]: Jason Vane adding with a cruel smirk: 'If the Ministry wants a rescue, they can sign the emergency salvage waiver giving our guild fifty percent of the freight value. Until then, no one enters.' Dark fantasy action manhwa art style, villainous extortion, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_277" filename="IMG_277.jpg" motion="pan_top_to_bottom">
IMG277, 16:9 widescreen shot. Titanium barriers slamming down. [Center]: Massive ten-ton hydraulic titanium blast shields slamming down around all warehouse exits with deafening crashes, sealing the civilians inside as sparks fly from the concrete. Dark fantasy action manhwa art style, imposing barrier lockdown, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_278" filename="IMG_278.jpg" motion="hero_zoom_in">
IMG278, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape shot. Kaelen on the high gantry. [Center]: @{Kaelen Thorne - Awakened Sovereign} standing seventy meters away atop an industrial crane gantry, trench coat whipping in the wind, looking down at the Aegis barricade with cold contempt. Dark fantasy action manhwa art style, heroic vigilante silhouette, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_279" filename="IMG_279.jpg" motion="hero_zoom_in">
IMG279, 16:9 widescreen close-up. Past-life memory of massacre. [Center]: Kaelen's dark past-life memory flashing: the tragic massacre of thirty-six workers in the original timeline, followed by Aegis fraudulently pocketing municipal grants. Dark fantasy action manhwa art style, dark memory montage, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_280" filename="IMG_280.jpg" motion="hero_zoom_in">
IMG280, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape close-up. Sovereign anger. [Center]: Close-up of Kaelen's face, glowing amethyst pupils burning with dangerous resolve: 'Aristocratic parasites... locking gates while human lives are leveraged for salvage fees.' Dark fantasy action manhwa art style, fierce righteous resolve, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_281" filename="IMG_281.jpg" motion="hero_zoom_in">
IMG281, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen composition. Calculating structural vectors. [Center]: Kaelen projecting glowing purple calculation matrices onto the warehouse roof load and acoustic perimeter barrier. Dark fantasy action manhwa art style, high-tech tactical scan, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_282" filename="IMG_282.jpg" motion="pan_diagonal_sweep">
IMG282, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape action shot. Vaulting through skylight. [Center]: Kaelen leaping off the crane gantry, sprinting across suspended steel cables, and diving cleanly through an elevated glass ventilation skylight into the darkened hangar. Dark fantasy action manhwa art style, dynamic acrobatic breach, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_283" filename="IMG_283.jpg" motion="hero_zoom_out">
IMG283, 16:9 widescreen panoramic shot. Pitch-black interior of Terminal Four. [Center]: Vast shadowy interior of the cavernous transit hangar, severed high-voltage cables sparking on wet concrete, freight trains looming in the darkness. Dark fantasy action manhwa art style, eerie industrial gloom, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_284" filename="IMG_284.jpg" motion="pan_left_to_right">
IMG284, 16:9 landscape shot. Cloaked Shadow Stalkers crawling. [Center]: Shadows rippling across the ceiling rafters as thirty-five cloaked Shadow Stalkers crawl silently, their refractive stealth fields bending the sparks from severed power lines. Dark fantasy action manhwa art style, invisible lurking danger, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_285" filename="IMG_285.jpg" motion="hero_zoom_in">
IMG285, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen shot. Landing on catwalk and drawing sidearms. [Center]: Kaelen landing silently on a steel maintenance catwalk ten meters above the ground, drawing both @{Weapon: Dual Ironclad Mag-Pistols} in a single fluid cross-draw motion. Dark fantasy action manhwa art style, iconic dual-gun stance, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_286" filename="IMG_286.jpg" motion="hero_zoom_in">
IMG286, 16:9 widescreen composition. In-Frame System HUD Archetype. [Center]: @{Prop: Holographic System HUD} projecting: '[SOVEREIGN GENE ENGAGEMENT: Acoustic Telemetry & Spatial Matrix Calculation Activated | Target Tracking: 35 Units]'. Dark fantasy action manhwa art style, crisp tactical HUD, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_287" filename="IMG_287.jpg" motion="hero_zoom_out">
IMG287, 16:9 landscape composition. Acoustic wireframe grid. [Center]: The dark terminal transformed into a glowing cyan-and-purple wireframe grid, micro-vibrations of monster claws against steel beams rendered in concentric sonic rings. Dark fantasy action manhwa art style, sonar visualization aesthetic, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_288" filename="IMG_288.jpg" motion="hero_zoom_in">
IMG288, 16:9 widescreen close-up. Magenta target outlines. [Center]: Every cloaked Shadow Stalker on the ceiling highlighted in razor-sharp magenta outlines across Kaelen's cognitive view: 'Target Count: 35 Stalkers. Kinetic ricochet protocol initiated.' Dark fantasy action manhwa art style, high-tech tactical lock-on, horizontal 16:9, textless manhwa artwork.
</scene>

</batch>
\`\`\`

---

### 📦 Batch M: IMG_289 to IMG_312 (Ricochet Annihilation, Boss Takedown & Telemetry Victory)

\`\`\`xml
<batch id="Batch_M" series="Series_02" episode="EP01" scenes="IMG_289-IMG_312" format="16:9">

<scene id="IMG_289" filename="IMG_289.jpg" motion="hero_zoom_in">
IMG289, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen composition. Kinetic ricochet protocol. [Center]: Kaelen standing poised on the catwalk, dual mag-pistols aimed at opposing angles toward the polished steel floor rails. Dark fantasy action manhwa art style, master marksman focus, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_290" filename="IMG_290.jpg" motion="pan_diagonal_sweep">
IMG290, 16:9 landscape action shot. Muzzle flashes and ricochet angles. [Center]: Blinding muzzle flashes from @{Weapon: Dual Ironclad Mag-Pistols} firing down into steel rails at fifty-four degree angles, creating vivid violet ricochet tracers arcing into the ceiling. Dark fantasy action manhwa art style, kinetic bullet trajectory artwork, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_291" filename="IMG_291.jpg" motion="hero_zoom_in">
IMG291, 16:9 widescreen close-up. Phase-Disruptor bullet impact. [Center]: Macro shot of Void-Titanium sabot round striking the hardened steel rail, sparking intensely and ricocheting upward with supersonic velocity. Dark fantasy action manhwa art style, extreme kinetic impact, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_292" filename="IMG_292.jpg" motion="pan_top_to_bottom">
IMG292, 16:9 landscape action shot. Stalkers dropping from rafters. [Center]: Sixteen cloaked Shadow Stalkers simultaneously struck in their central neural ganglia by ricocheting tungsten rounds, falling from the rafters like heavy stones in green showers of ichor. Dark fantasy action manhwa art style, mass monster elimination, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_293" filename="IMG_293.jpg" motion="hero_zoom_in">
IMG293, 16:9 widescreen close-up. Chitin splattering on concrete. [Center]: Heavy bodies of four Shadow Stalkers crashing onto the concrete floor with loud thuds, their refractive cloaks flickering and collapsing into dead grey chitin. Dark fantasy action manhwa art style, visceral aftermath, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_294" filename="IMG_294.jpg" motion="hero_zoom_in">
IMG294, 16:9 landscape shot. Eight-second total takedown. [Center]: Catwalk view of sixteen monster carcasses smoking on the ground within eight seconds of the first trigger pull. Dark fantasy action manhwa art style, overwhelming tactical speed, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_295" filename="IMG_295.jpg" motion="hero_zoom_in">
IMG295, 16:9 widescreen shot. Trapped workers watching in awe. [Center]: Inside the reinforced storage bay, the forty railway workers staring wide-eyed through the scratched security glass, stunned in sheer awe at the mysterious gunslinger defending them. Dark fantasy action manhwa art style, hopeful civilian awe, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_296" filename="IMG_296.jpg" motion="pan_left_to_right">
IMG296, 16:9 landscape action shot. Nineteen monsters charging. [Center]: The remaining nineteen enraged Shadow Stalkers abandoning the storage bays and charging en masse toward Kaelen's position, scythe legs tearing across walls. Dark fantasy action manhwa art style, frenzied swarm rush, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_297" filename="IMG_297.jpg" motion="pan_top_to_bottom">
IMG297, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen action cut. Sliding between freight cars. [Center]: Kaelen dropping from the catwalk and sliding smoothly on his knees between two heavy train carriages as razor scythes sever the steel catwalk above. Dark fantasy action manhwa art style, cinematic evasion glide, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_298" filename="IMG_298.jpg" motion="hero_zoom_in">
IMG298, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape close-up. Inverted grip Acoustic Resonator shot. [Center]: Kaelen inverting his grip on his left handgun and firing an Acoustic Resonator round directly into the concrete floor beneath the charging swarm. Dark fantasy action manhwa art style, tactical gunplay posture, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_299" filename="IMG_299.jpg" motion="hero_zoom_out">
IMG299, 16:9 widescreen shot. Sonic shockwave detonation. [Center]: Massive 120-decibel concentric sonic pulse exploding across the warehouse floor, sending a rippling shockwave that violently shatters the stealth cloaks of all nineteen Stalkers. Dark fantasy action manhwa art style, sonic shockwave visual effect, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_300" filename="IMG_300.jpg" motion="hero_zoom_in">
IMG300, 16:9 landscape action shot. Exposed disoriented swarm. [Center]: All nineteen Shadow Stalkers reeling back in agony, their stealth fields completely stripped, screeching as their sensitive ocular sensors are overloaded by the sonic boom. Dark fantasy action manhwa art style, disoriented monster vulnerability, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_301" filename="IMG_301.jpg" motion="pan_left_to_right">
IMG301, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen composition. Double-tap execution sweep. [Center]: Kaelen advancing through the hangar like a relentless phantom, delivering surgical double-tap kinetic shots into exposed eye clusters, dropping monsters with every stride. Dark fantasy action manhwa art style, ruthless marksmanship execution, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_302" filename="IMG_302.jpg" motion="hero_zoom_out">
IMG302, 16:9 landscape shot. Cavernous boss roar. [Center]: The steel warehouse roof shuddering violently as structural beams buckle under a deafening, terrifying roar from the collapsing master rift. Dark fantasy action manhwa art style, boss emergence dread, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_303" filename="IMG_303.jpg" motion="pan_top_to_bottom">
IMG303, 16:9 widescreen composition. Grade-D Abyssal Dread-Reaper descent. [Center]: Colossal nine-meter-tall Grade-D Abyssal Dread-Reaper crashing onto the tracks, brandishing six multi-jointed scythe limbs and a massive obsidian chest plate protecting its glowing crimson core. Dark fantasy action manhwa art style, terrifying boss presence, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_304" filename="IMG_304.jpg" motion="hero_zoom_in">
IMG304, 16:9 landscape close-up. Dread-Reaper obsidian breastplate. [Center]: Tight close-up of the Dread-Reaper's impenetrable obsidian carapace glowing with dark crimson dimensional runes, impenetrable to standard Grade-C spells. Dark fantasy action manhwa art style, boss armor detail, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_305" filename="IMG_305.jpg" motion="pan_left_to_right">
IMG305, 16:9 widescreen action shot. Locomotive sliced in half. [Center]: The Dread-Reaper swinging its colossal right scythe limb, slicing cleanly through a 40-ton steel train locomotive like butter, sending tons of crushed steel hurling toward Kaelen. Dark fantasy action manhwa art style, devastating destructive scale, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_306" filename="IMG_306.jpg" motion="hero_zoom_in">
IMG306, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape close-up. 3-microsecond sidestep. [Center]: Kaelen in hyper-computation sidestepping the flying train debris by exactly four millimetres, face utterly calm as sparks brush his coat. Dark fantasy action manhwa art style, god-tier reflexes, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_307" filename="IMG_307.jpg" motion="pan_diagonal_sweep">
IMG307, @{Kaelen Thorne - Awakened Sovereign}, 16:9 widescreen action shot. Roof sprint and mid-air leap. [Center]: Kaelen sprinting up the curved roof of the overturned train car and launching himself mid-air directly toward the Dread-Reaper's towering chest. Dark fantasy action manhwa art style, dynamic mid-air clash, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_308" filename="IMG_308.jpg" motion="hero_zoom_in">
IMG308, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape close-up. Muzzle pressed to breastplate. [Center]: Mid-air close-up of Kaelen pressing the muzzle of his right Ironclad mag-pistol directly against the central seam of the boss's obsidian breastplate, pulling the trigger on an Acoustic Resonator round. Dark fantasy action manhwa art style, point-blank execution stance, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_309" filename="IMG_309.jpg" motion="hero_zoom_in">
IMG309, 16:9 widescreen close-up. Obsidian armor spiderweb fracture. [Center]: Acoustic shockwave detonating inside the obsidian breastplate, shattering the armor with thousands of glowing hairline fractures across the core seam. Dark fantasy action manhwa art style, structural armor fracture visual, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_310" filename="IMG_310.jpg" motion="hero_zoom_in">
IMG310, @{Kaelen Thorne - Awakened Sovereign}, 16:9 landscape action shot. Left sabot finishing shot. [Center]: Kaelen bringing his left mag-pistol into alignment and firing a Phase-Disruptor tungsten sabot directly through the fractured seam, piercing straight into the monster's glowing crimson core. Dark fantasy action manhwa art style, epic dual-gun boss finisher, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_311" filename="IMG_311.jpg" motion="hero_zoom_in">
IMG311, 16:9 widescreen composition. In-Frame System HUD Archetype. [Center]: @{Prop: Holographic System HUD} projecting Level 9 milestone: '[DUNGEON BOSS ELIMINATED: Grade-D Dread-Reaper | LEVEL UP: Level 7 -> Level 8 -> Level 9 | Stats: Str 14, Agi 21, Con 15, Per 246]'. Dark fantasy action manhwa art style, triumphant level up UI, horizontal 16:9, textless manhwa artwork.
</scene>

<scene id="IMG_312" filename="IMG_312.jpg" motion="hero_zoom_in">
IMG312, @{Chief Proctor Keith Morgan - Bureau Examiner}, 16:9 landscape shot. Chief Proctor Morgan's verdict. [Left]: @{Chief Proctor Keith Morgan - Bureau Examiner} stepping through the blasted hangar doors, holding his monocle projector and presenting an Imperial Sovereign Exemption voucher for 15 Gold Sovereigns. [Right]: @{Kaelen Thorne - Awakened Sovereign} standing victorious as Ronald and Jason Vane watch in pale-faced humiliation. Dark fantasy action manhwa art style, epic season milestone finale, horizontal 16:9, textless manhwa artwork.
</scene>

</batch>
\`\`\`

---
`

const finalPromptMatrix = matrixContent + batchesJtoM
fs.writeFileSync(promptMatrixPath, finalPromptMatrix, 'utf-8')
console.log('🎉 02_Prompt_Matrix.md successfully updated with Batches J, K, L, M (IMG_217 to IMG_312)!')
