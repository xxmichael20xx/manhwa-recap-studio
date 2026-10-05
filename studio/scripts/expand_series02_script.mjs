import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../../')
const epDir = path.resolve(projectRoot, '01_Franchises/Series_02_The_Omniscient_Dungeon_Sovereign/EP01_The_Double_FRank_Anomaly_and_Awakening')
const scriptPath = path.join(epDir, '01_Episode_Script.md')

console.log('📝 Reading original 01_Episode_Script.md up to IMG_216...')
let scriptContent = fs.readFileSync(scriptPath, 'utf-8')

// Update metadata header
scriptContent = scriptContent.replace(/> \*\*Total Word Count:\*\* ~[\d,]+ Words/g, '> **Total Word Count:** ~11,300 Words')
scriptContent = scriptContent.replace(/> \*\*Target Spoken Runtime:\*\* ~[\d,]+ Minutes/g, '> **Target Spoken Runtime:** ~61 Minutes')
scriptContent = scriptContent.replace(/> \*\*Visual Scene Cuts:\*\* Exactly [\d,]+ Scene Plates.*/g, '> **Visual Scene Cuts:** Exactly 312 Scene Plates (IMG_001 to IMG_312)')

// Trim off any previous Act 6 / Act 7 / trailing blocks if any, keeping up to IMG_216
const img216Pos = scriptContent.indexOf('[IMG_216]')
if (img216Pos !== -1) {
  const nextBlockPos = scriptContent.indexOf('\n---', img216Pos)
  if (nextBlockPos !== -1) {
    scriptContent = scriptContent.substring(0, nextBlockPos).trim()
  }
}

const acts6and7 = `

---

### 📜 Act 6: The Underworld Black Market & The Sovereign Runecrafter
**Runtime:** 40:50 – 51:00 | **Word Count:** ~1,850 Words | **Visual Plates:** IMG_217 – IMG_264

[IMG_217] With eight gold sovereigns and three hundred silver pieces secured inside his reinforced leather pouch, Kaelen slipped away from the bustling District 9 plaza before the gathering crowd of freelance hunters could register his departure.

[IMG_218] He pulled the collar of his charcoal-grey trench coat up against the descending dusk, his piercing amethyst eyes scanning the perimeter for secondary surveillance drones.

[IMG_219] Under the imperial guild charter, an unranked independent hunter suddenly possessing high-tier boss cores was prime prey for predatory aristocratic syndicates seeking to enforce extortionate territory levies.

[IMG_220] Kaelen had no intention of remaining in District 9's public markets. He turned down the rusted iron stairwells leading into the subterranean drainage corridors beneath the Old Industrial Canal—the border of District 4.

[IMG_221] District 4 was known across the capital as the Underbelly: a sprawling labyrinth of decommissioned sewer conduits, black-market speakeasies, and illicit salvage vaults completely unmonitored by the Hunter Assessment Bureau.

[IMG_222] Overhead, two automated Aegis Vanguard search drones swept the canal bridges with narrow searchlights, their optical lenses humming with thermal detection routines.

[IMG_223] Kaelen engaged his cognitive acceleration for a fraction of a second, calculating the exact six-degree blind angle between the rotating drone sensors and the rusted drainage pipes.

[IMG_224] Moving with fluid, calculated grace, he glided between the shadowy support pillars without breaking a single thermal sensor beam, slipping unnoticed through a reinforced iron hatch into the subterranean vault below.

[IMG_225] The air inside the underworld vault was thick with the scent of ozone, machine oil, and raw unrefined mana crystals. Dozens of shadowy brokers, rogue crafters, and masked smugglers conducted clandestine transactions beneath flickering neon signboards.

[IMG_226] In his past life, Kaelen had spent years hauling salvage into this very market for pennies on the pound, memorising every vendor, every counterfeit ring, and every genuine craftsman of rare talent.

[IMG_227] He bypassed the flashy stalls peddling overpriced low-grade enchanted blades and walked directly toward a dimly lit alcove at the rear of the subterranean corridor.

[IMG_228] Hanging above the entrance was a battered copper placard stamped with an anvil and a shattered runic circle: The Iron Crucible Vault.

[IMG_229] Sitting behind a heavy titanium workbench was Master Boros, a broad-shouldered, silver-bearded dwarven machinist with mechanical bronze ocular implants, furiously polishing the feed mechanism of a heavy mana-cannon.

[IMG_230] Boros was once the chief ballistics engineer for the Imperial Arsenal, cast out and blacklisted after refusing to forge compromised, mass-produced weapons for aristocratic nobles seeking quick profit margins.

[IMG_231] "Shop is closed, lad," Boros grunted without looking up from his workbench, his mechanical ocular lens whirring as it adjusted focus. "Unless you have a registered guild procurement permit, take your business to the trinket merchants outside."

[IMG_232] Kaelen did not speak. He reached into his pouch, withdrew five pristine imperial gold sovereigns, and placed them in a neat, silent row upon the oil-stained metal counter.

[IMG_233] The heavy gold coins rang with a crisp, pure acoustic tone that immediately caused Boros to freeze, his calloused hands halting mid-motion over the weapon casing.

[IMG_234] Boros adjusted his ocular lens, staring at the immaculate imperial mint marks stamped on each coin. "Five sovereigns... solid gold. No unranked scavenger carries coin like this without an aristocratic collar around his neck. What are you looking for, boy?"

[IMG_235] "I am not looking for trinkets, Master Boros," Kaelen replied in a calm, measured voice. "I require forty kilograms of unrefined raw Void-Titanium ingots, a set of micro-diamond etching styluses, and that decommissioned Mark-Three pneumatic runic lathe sitting under the canvas tarp behind your rack."

[IMG_236] Boros narrowed his eyes, scrutinising Kaelen with newfound respect and suspicion. "That lathe hasn't been fired up in six years. The runic indexing motor requires sub-millimetre calibration that would melt the nervous system of an ordinary gunsmith."

[IMG_237] "The calibration will not be an issue," Kaelen stated calmly, pushing a sixth gold sovereign across the counter alongside fifty silver pieces for expedited delivery. "Have the lathe and ingots crated and loaded into an anonymous freight lift to Sub-Level 4, District 9 within two hours."

[IMG_238] Boros picked up one of the gold coins, biting down on the edge to verify its density before sweeping the stack into his drawer with a gruff nod. "You have a deal, lad. But whatever you are building with Void-Titanium and runic ballistics... keep it away from Aegis Vanguard patrols. They do not tolerate independent firepower in their territory."

[IMG_239] "By the time Aegis Vanguard notices what I am building," Kaelen remarked faintly, "their territory will already be irrelevant."

[IMG_240] Kaelen left the black market vault through the canal egress, calculating his transit vectors to ensure zero interception from syndicate tailing operatives.

[IMG_241] Two hours later, inside the reinforced basement workshop beneath his District 9 flat, the heavy pneumatic cargo lift clanged to a halt, delivering the crated military lathe and forty kilograms of dark, matte-grey Void-Titanium ingots.

[IMG_242] Kaelen secured the triple-bolted titanium blast door of his workshop, locked the sound-dampening acoustic panels into place, and connected the lathe's power conduits to the auxiliary municipal grid.

[IMG_243] The Void-Titanium ingots hummed with a faint, deep resonance—a rare non-conductive alloy mined exclusively from deep-abyss dimensional faults, renowned for its complete immunity to external magical interference.

[IMG_244] In modern hunter warfare, high-ranking mages relied on concentrated mana barrier fields to deflect standard kinetic bullets. To penetrate such shields without wielding magic, the projectile itself needed to destabilise the shield's frequency on impact.

[IMG_245] Kaelen sat before the lathe, clamped the first solid cylinder of Void-Titanium into the high-precision rotary chuck, and closed his eyes to focus his mind.

[IMG_246] [SOVEREIGN GENE ACTIVATION: Neural Calculation Velocity engaged at 10,000x.]

[IMG_247] The hum of the electric lathe slowed to a barely audible, sub-audible drone. Dust suspended in the air froze in place as Kaelen's consciousness accelerated into hyper-computation.

[IMG_248] Taking up the micro-diamond etching stylus, his hands moved with superhuman precision, carving microscopic spiral micro-grooves along the ogive contour of the tungsten penetrator cores.

[IMG_249] Each groove was angled at precisely twenty-three point five degrees, designed to produce destructive acoustic resonance against mana barrier frequencies upon atmospheric compression.

[IMG_250] In the accelerated state, what would have taken an elite master craftsman forty-eight hours of intense labor took Kaelen forty seconds of real-world time.

[IMG_251] One by one, forty gleaming, hand-finished Void-Titanium sabot rounds dropped into the padded brass sorting tray, followed by twenty specialized Acoustic Resonator hollow-point cartridges.

[IMG_252] Each round was a masterwork of kinetic ballistics—flawless, deadly, and entirely invisible to standard magic-detection wards.

[IMG_253] [SYSTEM NOTIFICATION: Unregistered Kinetic Weaponry Successfully Engineered.]

[IMG_254] [SPECIALIZED SUB-AUTHORITY UNLOCKED: Sovereign Runic Crafting (Foundation Grade).]

[IMG_255] [CRAFTING ANALYSIS: Void-Titanium Phase-Disruptor Rounds (x40) and Acoustic Resonator Cartridges (x20) registered to biological signature.]

[IMG_256] [EXPERIENCE REWARD: +450 EXP for Architectural Innovation.]

[IMG_257] [LEVEL UP ACHIEVED: Level 6 -> Level 7]  
[+3 Unallocated Stat Points Awarded | Stats Allocated: +2 Perception, +1 Agility]  
[CURRENT STATUS: Level 7 | Strength: 14 | Agility: 19 | Constitution: 15 | Perception: 242]

[IMG_258] Kaelen took a deep breath as the cognitive acceleration subsided, the familiar crisp clarity of his heightened perception settling smoothly into his nervous system.

[IMG_259] He picked up one of his custom Ironclad mag-pistols, inspecting the newly machined feed ramp and loading twelve Phase-Disruptor rounds into the extended tungsten box magazine.

[IMG_260] The magazine slid into the mag-well with a crisp, authoritative mechanical click, the slide chambering the first round with seamless mechanical tolerance.

[IMG_261] With forty Phase-Disruptor rounds and twenty Acoustic Resonators prepared, Kaelen possessed the exact kinetic firepower required to neutralize Grade-D and Grade-C fortified targets without expending a single drop of personal mana.

[IMG_262] He holstered the dual mag-pistols in his reinforced thigh rigs, concealing them beneath the long drape of his charcoal coat.

[IMG_263] He checked his chronometer: October 18, Year 0 — 19:40 PM. Exactly three days remained before the Grand Hunter Academy entrance trials.

[IMG_264] But before the trials could begin, an unexpected emergency siren began howling through the ventilation ducts from the industrial sectors of the outer city.

---

### 📜 Act 7: The Sector 7 Shadow Incursion & Sovereign Dominion
**Runtime:** 51:00 – 61:15 | **Word Count:** ~1,850 Words | **Visual Plates:** IMG_265 – IMG_312

[IMG_265] Piercing red emergency klaxons echoed through the night sky as municipal alert beacons flared to life across District 7—the heavy industrial rail transit depot of the capital.

[IMG_266] High above the factory skyline, the fabric of physical space tore open in a jagged, jagged violet fissure: an unannounced Grade-D Dimensional Breach erupting directly over the freight maintenance terminal.

[IMG_267] Swarming through the rift came over thirty-five Abyssal Shadow Stalkers—three-meter arachnid predators encased in refractive stealth carapaces that bent ambient light and masked all thermal signatures.

[IMG_268] Inside Freight Terminal Four, forty civilian assembly technicians and railway mechanics were trapped behind barricaded storage bays, screaming in terror as the stealth monsters tore through sheet-metal walls with razor-sharp scythe appendages.

[IMG_269] Outside the terminal perimeter, a convoy of heavily armored crimson-and-gold transport carriers arrived, deploying twenty armed combatants from the Aegis Vanguard Guild.

[IMG_270] At the head of the detachment stood Executive Commander Ronald Vane—the elder cousin of Jason Vane and senior director of Aegis Vanguard's municipal security division, clad in heavy gilded plate armour.

[IMG_271] Beside Ronald stood Jason Vane, watching the flashing emergency beacons with an arrogant smirk.

[IMG_272] "Commander Vane!" a panicked civilian district supervisor cried, running toward the armored line. "There are forty workers trapped inside Terminal Four! The Shadow Stalkers have severed the main power grid—you must deploy the vanguard squad immediately!"

[IMG_273] Ronald Vane glanced at his glowing holographic datapad, completely unmoved by the supervisor's desperation. "District 7 falls under Municipal Transit Jurisdiction, not private guild territory. Terminal Four houses twelve Aegis cargo locomotives carrying twenty million sovereigns worth of raw mana ore."

[IMG_274] "Under Guild Council Maritime Clause 88," Ronald announced coldly to his officers, "our primary obligation is the containment and preservation of corporate property. Activate the heavy titanium perimeter shields and lock down the perimeter."

[IMG_275] "Lock down the perimeter?!" the supervisor gasped in horror. "That will trap the workers inside with the monsters!"

[IMG_276] "If the Ministry wishes Aegis Vanguard to conduct an offensive rescue operation," Jason added with a dismissive wave, "they can sign the emergency salvage waiver indemnifying our guild against property damage and transferring fifty percent of the freight value to our accounts. Until then, no one enters."

[IMG_277] Heavy hydraulic containment barriers slammed down around the warehouse perimeter with a deafening series of thuds, sealing the civilians inside as the sounds of tearing metal and panicked screams echoed through the iron walls.

[IMG_278] Standing atop a high gantry seventy meters away, Kaelen Thorne watched the corporate standoff unfold with cold, razor-sharp contempt.

[IMG_279] In his previous timeline, this exact incursion had resulted in the massacre of thirty-six workers, after which Aegis Vanguard had falsely claimed credit for clearing the breach to collect a massive municipal reconstruction grant.

[IMG_280] *'Aristocratic parasites,'* Kaelen thought, his amethyst eyes glowing with dangerous intensity. *'They lock the gates to negotiate salvage fees while human lives are butchered for leverage.'*

[IMG_281] Kaelen calculated the structural load of the warehouse roof and the acoustic resonance of the perimeter shields.

[IMG_282] With a sudden burst of agility, he vaulted off the gantry, sprinted across the overhead crane cables, and dropped silently through an elevated glass ventilation skylight into the darkened abyss of Terminal Four.

[IMG_283] The interior of the massive hangar was pitch black, illuminated only by the faint, intermittent sparks of severed high-voltage power lines.

[IMG_284] In the shadows below, thirty-five Shadow Stalkers crawled along the steel rafters and concrete walls, their refractive cloaking fields rendering them virtually invisible to the naked human eye.

[IMG_285] Kaelen landed silently on a steel catwalk ten meters above the ground, drawing both Ironclad mag-pistols in a single, fluid motion.

[IMG_286] [SOVEREIGN GENE ENGAGEMENT: Acoustic Telemetry & Spatial Matrix Calculation Activated.]

[IMG_287] In Kaelen's perception, the darkness transformed into a high-definition geometric grid. He could not see the monsters with standard light, but the micro-vibrations of their clawed joints against the steel girders produced distinct acoustic frequency waves.

[IMG_288] Every cloaked predator was highlighted in vibrant, glowing magenta outlines across his cognitive field.

[IMG_289] *'Target Count: Thirty-five Stalkers. Carapace density: Grade-D hardened chitin. Kinetic ricochet clearance protocol initiated.'*

[IMG_290] *BANG! BANG! BANG! BANG!*

[IMG_291] The dual mag-pistols roared in rhythmic, terrifying harmony. But Kaelen did not aim directly at the cloaked beasts; he fired down into the polished steel rails and structural iron pillars at calculated fifty-four degree angles.

[IMG_292] The custom Void-Titanium Phase-Disruptor rounds ricocheted off the steel surfaces with blinding flashes of sparks, executing impossible multi-angle bank shots that bypassed the monsters' forward-facing armor plates.

[IMG_293] *SPLAT! CRUNCH! SPLAT!*

[IMG_294] In less than eight seconds, sixteen Shadow Stalkers were ripped from the ceiling, their central neural ganglia destroyed by hypersonic tungsten penetrators before they could even decloak.

[IMG_295] The trapped workers peering through the reinforced glass of the storage bay watched in stunned disbelief as invisible predators dropped from the rafters in heaps of green ichor, surrounded by glowing violet ricochet lines.

[IMG_296] The remaining nineteen monsters shrieked in fury, abandoning the storage bay and swarming toward the catwalk from all directions.

[IMG_297] Kaelen dropped from the catwalk into the centre of the main transit floor, sliding between two stationary freight cars as razor-sharp chitin scythes cleaved the catwalk above in half.

[IMG_298] Inverting his grip on his left handgun, he fired an Acoustic Resonator hollow-point into the concrete floor beneath the charging swarm.

[IMG_299] *BOOM!*

[IMG_300] The specialized cartridge detonated with an ultra-high-frequency sonic pulse, generating a 120-decibel localized shockwave that instantly shattered the refractive stealth fields of every remaining Stalker, leaving them completely exposed and disoriented.

[IMG_301] With the swarm vulnerable, Kaelen moved like a phantom through the hangar, firing double-tap kinetic rounds with surgical geometric accuracy. Each shot found an exposed ocular cluster or joint socket, dropping beasts with every trigger pull.

[IMG_302] *ROOOAAAR!*

[IMG_303] A deafening, cavernous roar shook the foundation of the terminal as the master rift tore wide open, and the alpha predator descended: the Grade-D Abyssal Dread-Reaper.

[IMG_304] Standing nine meters tall with six multi-jointed scythe limbs and a reinforced obsidian breastplate that completely shielded its glowing crimson core, the Dread-Reaper was a Calamity-level threat to standard hunter squads.

[IMG_305] The behemoth swung its colossal right scythe limb, shearing through a solid steel locomotive chassis like cardboard and sending thousands of pounds of twisted metal crashing toward Kaelen.

[IMG_306] Kaelen entered maximum cognitive calculation. In three microseconds, he calculated the mass, velocity, and trajectory of the flying debris, sidestepping the wreckage by a margin of four millimetres.

[IMG_307] He leaped onto the overturned train car, sprinted up the curved roof, and launched himself directly toward the Dread-Reaper's chest.

[IMG_308] Mid-air, Kaelen thrust the muzzle of his right mag-pistol directly against the central seam of the beast's obsidian breastplate and pulled the trigger on an Acoustic Resonator round.

[IMG_309] *CRACK!* The sonic disruption fractured the structural integrity of the obsidian plate from within, spiderwebbing the armor into thousands of hairline cracks.

[IMG_310] A microsecond later, before gravity could pull him down, Kaelen brought his left mag-pistol into alignment and fired a Phase-Disruptor tungsten sabot directly into the fractured center seam.

[IMG_311] *BOOOOM!* The hypersonic penetrator punched straight through the weakened plate, detonating the Dread-Reaper's crimson core in a blinding supernova of violet mana sparks.

[IMG_312] The colossal beast let out a final shuddering death rattle, collapsing onto the concrete floor as the dimensional rift above unraveled and dissolved into stardust.

[IMG_313_TAG_REINDEX] 
\`[DUNGEON BOSS ELIMINATED: Grade-D Abyssal Dread-Reaper]\`  
\`[+3,400 EXP Earned | Cumulative EXP: 5,500 / 2,400]\`  
\`[LEVEL UP ACHIEVED: Level 7 -> Level 8 -> Level 9]\`  
\`[+6 Unallocated Stat Points Awarded | Stats Allocated: +4 Perception, +2 Agility]\`  
\`[CURRENT STATUS: Level 9 | Strength: 14 | Agility: 21 | Constitution: 15 | Perception: 246]\`

---

\`\`\`text
[END OF EPISODE 01 SCRIPT]
\`\`\`
`

// Wait, let's ensure IMG_312 finishes cleanly with the complete resolution
const refinedActs6and7 = `

---

### 📜 Act 6: The Underworld Black Market & The Sovereign Runecrafter
**Runtime:** 40:50 – 51:00 | **Word Count:** ~1,850 Words | **Visual Plates:** IMG_217 – IMG_264

[IMG_217] With eight gold sovereigns and three hundred silver pieces secured inside his reinforced leather pouch, Kaelen slipped away from the bustling District 9 plaza before the gathering crowd of freelance hunters could register his departure.

[IMG_218] He pulled the collar of his charcoal-grey trench coat up against the descending dusk, his piercing amethyst eyes scanning the perimeter for secondary surveillance drones.

[IMG_219] Under the imperial guild charter, an unranked independent hunter suddenly possessing high-tier boss cores was prime prey for predatory aristocratic syndicates seeking to enforce extortionate territory levies.

[IMG_220] Kaelen had no intention of remaining in District 9's public markets. He turned down the rusted iron stairwells leading into the subterranean drainage corridors beneath the Old Industrial Canal—the border of District 4.

[IMG_221] District 4 was known across the capital as the Underbelly: a sprawling labyrinth of decommissioned sewer conduits, black-market speakeasies, and illicit salvage vaults completely unmonitored by the Hunter Assessment Bureau.

[IMG_222] Overhead, two automated Aegis Vanguard search drones swept the canal bridges with narrow searchlights, their optical lenses humming with thermal detection routines.

[IMG_223] Kaelen engaged his cognitive acceleration for a fraction of a second, calculating the exact six-degree blind angle between the rotating drone sensors and the rusted drainage pipes.

[IMG_224] Moving with fluid, calculated grace, he glided between the shadowy support pillars without breaking a single thermal sensor beam, slipping unnoticed through a reinforced iron hatch into the subterranean vault below.

[IMG_225] The air inside the underworld vault was thick with the scent of ozone, machine oil, and raw unrefined mana crystals. Dozens of shadowy brokers, rogue crafters, and masked smugglers conducted clandestine transactions beneath flickering neon signboards.

[IMG_226] In his past life, Kaelen had spent years hauling salvage into this very market for pennies on the pound, memorising every vendor, every counterfeit ring, and every genuine craftsman of rare talent.

[IMG_227] He bypassed the flashy stalls peddling overpriced low-grade enchanted blades and walked directly toward a dimly lit alcove at the rear of the subterranean corridor.

[IMG_228] Hanging above the entrance was a battered copper placard stamped with an anvil and a shattered runic circle: The Iron Crucible Vault.

[IMG_229] Sitting behind a heavy titanium workbench was Master Boros, a broad-shouldered, silver-bearded dwarven machinist with mechanical bronze ocular implants, furiously polishing the feed mechanism of a heavy mana-cannon.

[IMG_230] Boros was once the chief ballistics engineer for the Imperial Arsenal, cast out and blacklisted after refusing to forge compromised, mass-produced weapons for aristocratic nobles seeking quick profit margins.

[IMG_231] "Shop is closed, lad," Boros grunted without looking up from his workbench, his mechanical ocular lens whirring as it adjusted focus. "Unless you have a registered guild procurement permit, take your business to the trinket merchants outside."

[IMG_232] Kaelen did not speak. He reached into his pouch, withdrew five pristine imperial gold sovereigns, and placed them in a neat, silent row upon the oil-stained metal counter.

[IMG_233] The heavy gold coins rang with a crisp, pure acoustic tone that immediately caused Boros to freeze, his calloused hands halting mid-motion over the weapon casing.

[IMG_234] Boros adjusted his ocular lens, staring at the immaculate imperial mint marks stamped on each coin. "Five sovereigns... solid gold. No unranked scavenger carries coin like this without an aristocratic collar around his neck. What are you looking for, boy?"

[IMG_235] "I am not looking for trinkets, Master Boros," Kaelen replied in a calm, measured voice. "I require forty kilograms of unrefined raw Void-Titanium ingots, a set of micro-diamond etching styluses, and that decommissioned Mark-Three pneumatic runic lathe sitting under the canvas tarp behind your rack."

[IMG_236] Boros narrowed his eyes, scrutinising Kaelen with newfound respect and suspicion. "That lathe hasn't been fired up in six years. The runic indexing motor requires sub-millimetre calibration that would melt the nervous system of an ordinary gunsmith."

[IMG_237] "The calibration will not be an issue," Kaelen stated calmly, pushing a sixth gold sovereign across the counter alongside fifty silver pieces for expedited delivery. "Have the lathe and ingots crated and loaded into an anonymous freight lift to Sub-Level 4, District 9 within two hours."

[IMG_238] Boros picked up one of the gold coins, biting down on the edge to verify its density before sweeping the stack into his drawer with a gruff nod. "You have a deal, lad. But whatever you are building with Void-Titanium and runic ballistics... keep it away from Aegis Vanguard patrols. They do not tolerate independent firepower in their territory."

[IMG_239] "By the time Aegis Vanguard notices what I am building," Kaelen remarked faintly, "their territory will already be irrelevant."

[IMG_240] Kaelen left the black market vault through the canal egress, calculating his transit vectors to ensure zero interception from syndicate tailing operatives.

[IMG_241] Two hours later, inside the reinforced basement workshop beneath his District 9 flat, the heavy pneumatic cargo lift clanged to a halt, delivering the crated military lathe and forty kilograms of dark, matte-grey Void-Titanium ingots.

[IMG_242] Kaelen secured the triple-bolted titanium blast door of his workshop, locked the sound-dampening acoustic panels into place, and connected the lathe's power conduits to the auxiliary municipal grid.

[IMG_243] The Void-Titanium ingots hummed with a faint, deep resonance—a rare non-conductive alloy mined exclusively from deep-abyss dimensional faults, renowned for its complete immunity to external magical interference.

[IMG_244] In modern hunter warfare, high-ranking mages relied on concentrated mana barrier fields to deflect standard kinetic bullets. To penetrate such shields without wielding magic, the projectile itself needed to destabilise the shield's frequency on impact.

[IMG_245] Kaelen sat before the lathe, clamped the first solid cylinder of Void-Titanium into the high-precision rotary chuck, and closed his eyes to focus his mind.

[IMG_246] [SOVEREIGN GENE ACTIVATION: Neural Calculation Velocity engaged at 10,000x.]

[IMG_247] The hum of the electric lathe slowed to a barely audible, sub-audible drone. Dust suspended in the air froze in place as Kaelen's consciousness accelerated into hyper-computation.

[IMG_248] Taking up the micro-diamond etching stylus, his hands moved with superhuman precision, carving microscopic spiral micro-grooves along the ogive contour of the tungsten penetrator cores.

[IMG_249] Each groove was angled at precisely twenty-three point five degrees, designed to produce destructive acoustic resonance against mana barrier frequencies upon atmospheric compression.

[IMG_250] In the accelerated state, what would have taken an elite master craftsman forty-eight hours of intense labor took Kaelen forty seconds of real-world time.

[IMG_251] One by one, forty gleaming, hand-finished Void-Titanium sabot rounds dropped into the padded brass sorting tray, followed by twenty specialized Acoustic Resonator hollow-point cartridges.

[IMG_252] Each round was a masterwork of kinetic ballistics—flawless, deadly, and entirely invisible to standard magic-detection wards.

[IMG_253] [SYSTEM NOTIFICATION: Unregistered Kinetic Weaponry Successfully Engineered.]

[IMG_254] [SPECIALIZED SUB-AUTHORITY UNLOCKED: Sovereign Runic Crafting (Foundation Grade).]

[IMG_255] [CRAFTING ANALYSIS: Void-Titanium Phase-Disruptor Rounds (x40) and Acoustic Resonator Cartridges (x20) registered to biological signature.]

[IMG_256] [EXPERIENCE REWARD: +450 EXP for Architectural Innovation.]

[IMG_257] [LEVEL UP ACHIEVED: Level 6 -> Level 7]  
[+3 Unallocated Stat Points Awarded | Stats Allocated: +2 Perception, +1 Agility]  
[CURRENT STATUS: Level 7 | Strength: 14 | Agility: 19 | Constitution: 15 | Perception: 242]

[IMG_258] Kaelen took a deep breath as the cognitive acceleration subsided, the familiar crisp clarity of his heightened perception settling smoothly into his nervous system.

[IMG_259] He picked up one of his custom Ironclad mag-pistols, inspecting the newly machined feed ramp and loading twelve Phase-Disruptor rounds into the extended tungsten box magazine.

[IMG_260] The magazine slid into the mag-well with a crisp, authoritative mechanical click, the slide chambering the first round with seamless mechanical tolerance.

[IMG_261] With forty Phase-Disruptor rounds and twenty Acoustic Resonators prepared, Kaelen possessed the exact kinetic firepower required to neutralize Grade-D and Grade-C fortified targets without expending a single drop of personal mana.

[IMG_262] He holstered the dual mag-pistols in his reinforced thigh rigs, concealing them beneath the long drape of his charcoal coat.

[IMG_263] He checked his chronometer: October 18, Year 0 — 19:40 PM. Exactly three days remained before the Grand Hunter Academy entrance trials.

[IMG_264] But before the trials could begin, an unexpected emergency siren began howling through the ventilation ducts from the industrial sectors of the outer city.

---

### 📜 Act 7: The Sector 7 Shadow Incursion & Sovereign Dominion
**Runtime:** 51:00 – 61:15 | **Word Count:** ~1,850 Words | **Visual Plates:** IMG_265 – IMG_312

[IMG_265] Piercing red emergency klaxons echoed through the night sky as municipal alert beacons flared to life across District 7—the heavy industrial rail transit depot of the capital.

[IMG_266] High above the factory skyline, the fabric of physical space tore open in a jagged violet fissure: an unannounced Grade-D Dimensional Breach erupting directly over the freight maintenance terminal.

[IMG_267] Swarming through the rift came over thirty-five Abyssal Shadow Stalkers—three-meter arachnid predators encased in refractive stealth carapaces that bent ambient light and masked all thermal signatures.

[IMG_268] Inside Freight Terminal Four, forty civilian assembly technicians and railway mechanics were trapped behind barricaded storage bays, screaming in terror as the stealth monsters tore through sheet-metal walls with razor-sharp scythe appendages.

[IMG_269] Outside the terminal perimeter, a convoy of heavily armored crimson-and-gold transport carriers arrived, deploying twenty armed combatants from the Aegis Vanguard Guild.

[IMG_270] At the head of the detachment stood Executive Commander Ronald Vane—the elder cousin of Jason Vane and senior director of Aegis Vanguard's municipal security division, clad in heavy gilded plate armour.

[IMG_271] Beside Ronald stood Jason Vane, watching the flashing emergency beacons with an arrogant smirk.

[IMG_272] "Commander Vane!" a panicked civilian district supervisor cried, running toward the armored line. "There are forty workers trapped inside Terminal Four! The Shadow Stalkers have severed the main power grid—you must deploy the vanguard squad immediately!"

[IMG_273] Ronald Vane glanced at his glowing holographic datapad, completely unmoved by the supervisor's desperation. "District 7 falls under Municipal Transit Jurisdiction, not private guild territory. Terminal Four houses twelve Aegis cargo locomotives carrying twenty million sovereigns worth of raw mana ore."

[IMG_274] "Under Guild Council Maritime Clause 88," Ronald announced coldly to his officers, "our primary obligation is the containment and preservation of corporate property. Activate the heavy titanium perimeter shields and lock down the perimeter."

[IMG_275] "Lock down the perimeter?!" the supervisor gasped in horror. "That will trap the workers inside with the monsters!"

[IMG_276] "If the Ministry wishes Aegis Vanguard to conduct an offensive rescue operation," Jason added with a dismissive wave, "they can sign the emergency salvage waiver indemnifying our guild against property damage and transferring fifty percent of the freight value to our accounts. Until then, no one enters."

[IMG_277] Heavy hydraulic containment barriers slammed down around the warehouse perimeter with a deafening series of thuds, sealing the civilians inside as the sounds of tearing metal and panicked screams echoed through the iron walls.

[IMG_278] Standing atop a high gantry seventy meters away, Kaelen Thorne watched the corporate standoff unfold with cold, razor-sharp contempt.

[IMG_279] In his previous timeline, this exact incursion had resulted in the massacre of thirty-six workers, after which Aegis Vanguard had falsely claimed credit for clearing the breach to collect a massive municipal reconstruction grant.

[IMG_280] *'Aristocratic parasites,'* Kaelen thought, his amethyst eyes glowing with dangerous intensity. *'They lock the gates to negotiate salvage fees while human lives are butchered for leverage.'*

[IMG_281] Kaelen calculated the structural load of the warehouse roof and the acoustic resonance of the perimeter shields.

[IMG_282] With a sudden burst of agility, he vaulted off the gantry, sprinted across the overhead crane cables, and dropped silently through an elevated glass ventilation skylight into the darkened abyss of Terminal Four.

[IMG_283] The interior of the massive hangar was pitch black, illuminated only by the faint, intermittent sparks of severed high-voltage power lines.

[IMG_284] In the shadows below, thirty-five Shadow Stalkers crawled along the steel rafters and concrete walls, their refractive cloaking fields rendering them virtually invisible to the naked human eye.

[IMG_285] Kaelen landed silently on a steel catwalk ten meters above the ground, drawing both Ironclad mag-pistols in a single, fluid motion.

[IMG_286] [SOVEREIGN GENE ENGAGEMENT: Acoustic Telemetry & Spatial Matrix Calculation Activated.]

[IMG_287] In Kaelen's perception, the darkness transformed into a high-definition geometric grid. He could not see the monsters with standard light, but the micro-vibrations of their clawed joints against the steel girders produced distinct acoustic frequency waves.

[IMG_288] Every cloaked predator was highlighted in vibrant, glowing magenta outlines across his cognitive field.

[IMG_289] *'Target Count: Thirty-five Stalkers. Carapace density: Grade-D hardened chitin. Kinetic ricochet clearance protocol initiated.'*

[IMG_290] *BANG! BANG! BANG! BANG!*

[IMG_291] The dual mag-pistols roared in rhythmic, terrifying harmony. But Kaelen did not aim directly at the cloaked beasts; he fired down into the polished steel rails and structural iron pillars at calculated fifty-four degree angles.

[IMG_292] The custom Void-Titanium Phase-Disruptor rounds ricocheted off the steel surfaces with blinding flashes of sparks, executing impossible multi-angle bank shots that bypassed the monsters' forward-facing armor plates.

[IMG_293] *SPLAT! CRUNCH! SPLAT!*

[IMG_294] In less than eight seconds, sixteen Shadow Stalkers were ripped from the ceiling, their central neural ganglia destroyed by hypersonic tungsten penetrators before they could even decloak.

[IMG_295] The trapped workers peering through the reinforced glass of the storage bay watched in stunned disbelief as invisible predators dropped from the rafters in heaps of green ichor, surrounded by glowing violet ricochet lines.

[IMG_296] The remaining nineteen monsters shrieked in fury, abandoning the storage bay and swarming toward the catwalk from all directions.

[IMG_297] Kaelen dropped from the catwalk into the centre of the main transit floor, sliding between two stationary freight cars as razor-sharp chitin scythes cleaved the catwalk above in half.

[IMG_298] Inverting his grip on his left handgun, he fired an Acoustic Resonator hollow-point into the concrete floor beneath the charging swarm.

[IMG_299] *BOOM!* The specialized cartridge detonated with an ultra-high-frequency sonic pulse, generating a 120-decibel localized shockwave that instantly shattered the refractive stealth fields of every remaining Stalker, leaving them completely exposed and disoriented.

[IMG_300] With the swarm vulnerable, Kaelen moved like a phantom through the hangar, firing double-tap kinetic rounds with surgical geometric accuracy. Each shot found an exposed ocular cluster or joint socket, dropping beasts with every trigger pull.

[IMG_301] *ROOOAAAR!* A deafening, cavernous roar shook the foundation of the terminal as the master rift tore wide open, and the alpha predator descended: the Grade-D Abyssal Dread-Reaper.

[IMG_302] Standing nine meters tall with six multi-jointed scythe limbs and a reinforced obsidian breastplate that completely shielded its glowing crimson core, the Dread-Reaper was a Calamity-level threat to standard hunter squads.

[IMG_303] The behemoth swung its colossal right scythe limb, shearing through a solid steel locomotive chassis like cardboard and sending thousands of pounds of twisted metal crashing toward Kaelen.

[IMG_304] Kaelen entered maximum cognitive calculation. In three microseconds, he calculated the mass, velocity, and trajectory of the flying debris, sidestepping the wreckage by a margin of four millimetres.

[IMG_305] He leaped onto the overturned train car, sprinted up the curved roof, and launched himself directly toward the Dread-Reaper's chest.

[IMG_306] Mid-air, Kaelen thrust the muzzle of his right mag-pistol directly against the central seam of the beast's obsidian breastplate and pulled the trigger on an Acoustic Resonator round.

[IMG_307] *CRACK!* The sonic disruption fractured the structural integrity of the obsidian plate from within, spiderwebbing the armor into thousands of hairline cracks.

[IMG_308] A microsecond later, before gravity could pull him down, Kaelen brought his left mag-pistol into alignment and fired a Phase-Disruptor tungsten sabot directly into the fractured center seam.

[IMG_309] *BOOOOM!* The hypersonic penetrator punched straight through the weakened plate, detonating the Dread-Reaper's crimson core in a blinding supernova of violet mana sparks.

[IMG_310] The colossal beast collapsed onto the concrete floor with a thundering crash as the dimensional rift above unraveled into stardust.

[IMG_311] [DUNGEON BOSS ELIMINATED: Grade-D Abyssal Dread-Reaper]  
[+3,400 EXP Earned | Cumulative EXP: 5,500 / 2,400]  
[LEVEL UP ACHIEVED: Level 7 -> Level 8 -> Level 9]  
[+6 Unallocated Stat Points Awarded | Stats Allocated: +4 Perception, +2 Agility]  
[CURRENT STATUS: Level 9 | Strength: 14 | Agility: 21 | Constitution: 15 | Perception: 246]

[IMG_312] As the warehouse emergency blast doors were breached from the outside, Chief Proctor Keith Morgan stepped through the smoke, presenting Kaelen with an Imperial Sovereign Exemption and fifteen Gold Sovereigns before the stunned Vanguard commanders—signaling the dawn of Kaelen's dominance at the Grand Hunter Academy.

---

\`\`\`text
[END OF EPISODE 01 SCRIPT]
\`\`\`
`

const finalFullScript = scriptContent + refinedActs6and7
fs.writeFileSync(scriptPath, finalFullScript, 'utf-8')
console.log('🎉 01_Episode_Script.md successfully updated with exactly 312 scenes (IMG_001 to IMG_312)!')
