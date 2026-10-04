import fs from 'fs';
import path from 'path';

const matrixPath = "C:\\Users\\MIchaelangelo\\Documents\\My Brand\\02_Ventures & Digital Products\\Manhwa Recap Studio\\01_Franchises\\Series_01_The_Singularity_Protocol\\EP01_The_Double_FRank_Anomaly\\02_Prompt_Matrix.md";

// Let's create the comprehensive 216-scene prompt matrix
const header = `# 🎨 Series 01 Saga: Master Prompt Matrix (216 Granular Multi-Panel Scenes)
## The Singularity Protocol: The Double F-Rank Anomaly (Full Movie Cut)

> **Franchise:** \`Series_01_The_Singularity_Protocol\`  
> **Episode / Saga:** \`EP01_The_Double_FRank_Anomaly\`  
> **Format Tier:** Tier 2 Arc Feature / Saga (216 Scenes • Batches A through I)  
> **Visual Engine:** 3-Tier Dynamic Hybrid Standard (~70% Multi-Panel Strips / ~30% Hero Plates)  
> **Aspect Ratio:** 9:16 Vertical Webtoon Format (\`--ar 9:16\`)  
> **Art Style Standard:** Dark fantasy action manhwa webtoon art style, sharp ink linework, high contrast cel shading, cinematic dramatic lighting  
> **Universal Negative Directives:** \`textless manhwa illustration, zero speech bubbles, zero comic text, zero sound effects, zero subtitles, zero watermarks, zero Korean characters, zero hangul, zero file names, zero UI text, clean pure illustration, anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn boots and feet, crisp pupil reflections, no floating hands, no detached hands, no ghost limbs, no morphing artifacts, no severed appendages, no duplicate limbs, no warped anatomy, high contrast cel shading, vertical 9:16\`

---
`;

// Helper to generate clean prompts with universal negative guards
function cleanPrompt(layoutType, topDesc, bottomDesc, extraStyle = "") {
    if (layoutType.includes("Hero")) {
        return `Full-bleed cinematic hero plate. ${topDesc}. Dark fantasy action manhwa webtoon art style, sharp ink linework, high contrast cel shading, cinematic dramatic lighting, textless manhwa illustration, zero speech bubbles, zero subtitles, zero watermarks, zero Korean characters, zero file names, vertical 9:16.`;
    } else if (layoutType.includes("Three-Panel") || layoutType.includes("Multi-Panel")) {
        return `Three-panel vertical manhwa action strip. Top: ${topDesc}. Middle: ${bottomDesc.split(';')[0] || bottomDesc}. Bottom: ${bottomDesc.split(';')[1] || bottomDesc}. Dark fantasy action manhwa art style, sharp ink linework, high contrast cel shading, dynamic combat lighting, textless manhwa illustration, zero speech bubbles, zero subtitles, zero watermarks, zero Korean characters, vertical 9:16.`;
    } else {
        return `Dual-panel manhwa webtoon comic strip. Top block: ${topDesc}. Bottom block: ${bottomDesc}. Dark fantasy action manhwa art style, sharp ink linework, high contrast cel shading, cinematic lighting, textless manhwa illustration, zero speech bubbles, zero subtitles, zero watermarks, zero Korean characters, zero file names, vertical 9:16.`;
    }
}

// Batches definition
const batches = [
    {
        name: "Batch A: Scenes 001–024 (Act 1: Evaluation Ceremony & The Resonance Pillar)",
        start: 1,
        end: 24,
        scenes: [
            ["IMG_001", "Tier B: Dual-Panel Split", "General Academy", "Grand awakening hall inside Imperial Hunter Academy of Valerius, massive obsidian pillars, glowing mana rune circuits along the marble floor", "Close-up of diagnostic crystal needles measuring mana output without text"],
            ["IMG_002", "Tier B: Dual-Panel Split", "General Action", "High-tier prodigy summoning a massive spiraling firestorm in the arena center", "Spectators and noble proctors cheering wildly in tiered colosseum balconies"],
            ["IMG_003", "Tier B: Dual-Panel Split", "General Scavengers", "Weary low-rank utility students hauling massive rusty iron supply ballast on chains through a dimly lit maintenance corridor", "Close-up of dirty canvas scavenger boots stepping through damp dungeon gravel"],
            ["IMG_004", "Tier A: Hero Plate", "General Arena", "Packed colosseum stadium with three thousand aristocrats and students filling tiered obsidian stands under blazing imperial spotlights, floating broadcast camera drones hovering in air"],
            ["IMG_005", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "19-year-old Prince Valen Sol-Aegis stepping arrogantly onto the arena marble stage, pristine white-and-gold uniform, crimson silk capelet", "Close-up of Valen's polished white boots clicking on the stone, sheathed ornate rapier at his hip"],
            ["IMG_006", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Close-up portrait of Prince Valen Sol-Aegis, glowing solar-gold eyes, immaculate golden hair, haughty sneer", "Floating spherical camera drones reflecting in his pupils"],
            ["IMG_007", "Tier A: Hero Plate", "@{Valen Sol-Aegis}", "Valen touching the Resonance Pillar, an enormous 50-metre pillar of blinding golden solar plasma erupting violently into the arena sky, heat distortion ripples, vaporizing ambient air"],
            ["IMG_008", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Giant glowing holographic arena scoreboard shining golden light", "Crowd standing in unanimous applause, golden particle fanfare"],
            ["IMG_009", "Tier B: Dual-Panel Split", "General Nobles", "Aristocratic guild executives in ornate robes standing and clapping triumphantly in royal VIP balcony", "Close-up of a royal military contract document stamped with gold wax seal"],
            ["IMG_010", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Medium shot of Prince Valen Sol-Aegis looking down with cold disdain, adjusting his gold-trimmed capelet", "Low-tier students watching in quiet resentment from the lower stands"],
            ["IMG_011", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "45-year-old Head Examiner Keith Morgan standing at the proctor podium, glowing holographic glass tablet in hand, stern weathered jawline", "Keith's cybernetic metal right arm clicking as he selects Caelen Vance's profile on screen"],
            ["IMG_012", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "18-year-old Caelen Vance walking calmly onto the stage, fitted charcoal-gray cadet uniform, messy raven-black hair, sharp violet-amethyst eyes", "Fingerless tactical grip gloves adjusting at his side, calm analytical expression"],
            ["IMG_013", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Flashback of Caelen studying ancient dimensional physics manuscripts in towering academy archives", "Close-up of open parchment pages covered in geometric spacetime diagrams and glowing violet mana notes"],
            ["IMG_014", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen Vance pressing his bare right palm firmly against the cold black surface of the Resonance Pillar", "Micro-violet spatial distortion waves subtly bending light around his fingertips"],
            ["IMG_015", "Tier A: Hero Plate", "General Monolith", "The colossal 10-metre Resonance Pillar standing completely dark and silent, deep acoustic vibration ripples shimmering across the arena floor with zero fire or lightning discharge"],
            ["IMG_016", "Tier B: Dual-Panel Split", "General Proctors", "Proctors in observation booth looking bored, tapping diagnostic glass dials showing flatlined needles at zero", "Examiners yawning and writing dismissive marks on digital pads"],
            ["IMG_017", "Tier B: Dual-Panel Split", "General System", "Holographic scoreboard flashing dull grey light over the testing pedestal", "Arena spectators smirking and pointing mockingly down at the platform"],
            ["IMG_018", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Diagnostic holographic crystal floating beside Caelen with dual dormant void icons", "Heavy crimson seal stamped across Caelen's dossier assigning him to Scavenger Unit"],
            ["IMG_019", "Tier B: Dual-Panel Split", "General Arena", "Aristocratic students laughing loudly and mocking from the VIP benches", "Class F porter holding an old rusty extraction pickaxe, looking sympathetically toward Caelen"],
            ["IMG_020", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Head Examiner Keith Morgan leaning forward in the proctor box, glowing cybernetic eye narrowing with intense scrutiny", "Keith's mechanical fingers gripping the steel railing tightly"],
            ["IMG_021", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Keith's cybernetic ocular HUD scanning the granite floor beneath Caelen's feet with blue diagnostic grid lines", "Micro-density stress analysis readout showing extreme gravitational compression lines"],
            ["IMG_022", "Tier A: Hero Plate", "General Pedestal", "Extreme close-up of the reinforced granite pedestal beneath Caelen's boot print compressed into solid, sparkling industrial diamond under fifty atmospheres of silent gravity, microscopic fractal stress lines"],
            ["IMG_023", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen Vance walking quietly toward the Class F benches, unbothered smirk on his lips", "Tightening the strap of his fingerless grip glove, violet eyes glowing calmly in shadow"],
            ["IMG_024", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen glancing sideways at the mocking crowds with calm sovereign indifference", "Micro-gravitational distortion bending air around his open palm"]
        ]
    },
    {
        name: "Batch B: Scenes 025–048 (Act 2: Obsidian Hollows & The Aristocrat's Betrayal)",
        start: 25,
        end: 48,
        scenes: [
            ["IMG_025", "Tier A: Hero Plate", "General Dungeon", "Vast subterranean dimensional rift cavern known as Obsidian Hollows, towering black basalt pillars, glowing crimson and purple mineral fissures, damp underground waterfalls"],
            ["IMG_026", "Tier B: Dual-Panel Split", "General Convoy", "Class A elites in polished armour marching at the front vanguard", "Class F students trudging behind hauling heavy iron supply crates on chains"],
            ["IMG_027", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast} & @{Lyra Fenn}", "Caelen Vance marching in the rear flank, observing the ceiling with sharp violet eyes", "18-year-old Lyra Fenn beside him, copper-auburn hair in low ponytail, round brass goggles on forehead, bandolier of glowing potion vials"],
            ["IMG_028", "Tier B: Dual-Panel Split", "@{Lyra Fenn}", "Lyra Fenn sweating and struggling under the weight of an oversized leather alchemical haul-pack", "Her round brass goggles sliding down her nose as she surveys the jagged cavern arches with fear"],
            ["IMG_029", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast} & @{Lyra Fenn}", "Caelen Vance leaning closer to whisper tactical advice to Lyra, gesturing toward the rocky corridor wall", "Lyra nodding anxiously, clutching a glowing blue potion vial"],
            ["IMG_030", "Tier B: Dual-Panel Split", "General Cavern", "Over-the-shoulder view looking down the natural rock bottleneck corridor channeling subterranean air currents", "Tactical airflow choke-point visual breakdown across the cavern walls"],
            ["IMG_031", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Prince Valen leading vanguard, casting wide-arc golden solar blasts from his rapier", "Low-tier Shadow Crawlers incinerated into golden ash in a flash of light"],
            ["IMG_032", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Valen posing theatrically for floating broadcast camera drones, golden hair glowing", "Heavy cracks spiderwebbing across the stone ceiling stalactites from his excessive blasts"],
            ["IMG_033", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Close-up of Caelen Vance's sharp analytical violet eyes calculating numerical mana waste", "Holographic calculation overlay showing Valen burning 30% of his core on useless vanity"],
            ["IMG_034", "Tier B: Dual-Panel Split", "General Cavern", "Cavern floor violently trembling, heavy dust and stone fragments raining from ceiling", "Trapped students grabbing corridor walls to maintain balance"],
            ["IMG_035", "Tier A: Hero Plate", "General Rift", "Enormous jagged crimson and violet dimensional rift tearing open across the main tunnel floor, corrupted spatial lightning arcing across basalt rocks, swallowing minor monster spawns"],
            ["IMG_036", "Tier A: Hero Plate", "@{Void-Carapace Goliath}", "Colossal 4-metre subterranean quadruped titan Void-Carapace Goliath emerging from the dimensional rift, segmented obsidian exoskeleton armour plates, dual razor scythe forelimbs, glowing purple fissures along spine"],
            ["IMG_037", "Tier B: Dual-Panel Split", "@{Void-Carapace Goliath}", "Void-Carapace Goliath roaring with primal fury, anti-magic dimensional distortion waves rippling from its cranium", "Glowing purple optical clusters focusing hungrily on the human vanguard"],
            ["IMG_038", "Tier B: Dual-Panel Split", "General Vanguard", "Class A student vanguard in chaos, glowing blue and red elemental magic barriers shattering upon contact with Goliath's aura", "Noble cadets dropping their enchanted swords in sheer terror"],
            ["IMG_039", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Prince Valen with wide terrified eyes charging his signature S-Rank Solar Lance", "Valen hurling the blinding golden plasma javelin at the Goliath's head"],
            ["IMG_040", "Tier B: Dual-Panel Split", "@{Void-Carapace Goliath}", "Golden solar lance striking the Goliath's obsidian forehead armor, dissipating harmlessly into heat distortion ripples", "Exoskeleton armor completely intact without a single scratch"],
            ["IMG_041", "Tier B: Dual-Panel Split", "@{Void-Carapace Goliath}", "Goliath counter-striking with massive scythe forelimb, smashing three mithril-shielded vanguard knights backward into cavern wall", "Shattered shield fragments flying through the air"],
            ["IMG_042", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Prince Valen dropping his gold rapier in cowardice, turning around and sprinting frantically toward the extraction elevator", "His pristine white uniform covered in dirt and soot"],
            ["IMG_043", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Valen diving into the reinforced iron lift cage, screaming frantically at the mechanical operator", "Lifting his boot to kick a wounded cadet out of the elevator"],
            ["IMG_044", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Valen forcefully pulling the emergency red quarantine lever with both hands", "Heavy steel chains releasing the three-ton spiked iron portcullis above the tunnel entrance"],
            ["IMG_045", "Tier A: Hero Plate", "General Cavern", "Massive three-ton spiked iron portcullis slamming violently into the stone foundation with sparks and dust, completely sealing the tunnel exit and trapping Class F inside with the Goliath"],
            ["IMG_046", "Tier B: Dual-Panel Split", "General Class F", "Class F porter cadets falling to their knees against the locked iron bars in total despair", "Close-up of young scavenger cadet weeping with his hands gripping the rusty iron"],
            ["IMG_047", "Tier B: Dual-Panel Split", "@{Lyra Fenn}", "Lyra Fenn clutching her potion satchel, tears welling in her eyes behind round brass goggles", "Goliath's massive shadow looming over the trapped students from behind"],
            ["IMG_048", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen Vance calmly dropping his canvas extraction satchel to the floor", "Stepping forward into the center of the dark cavern, glowing violet eyes locking onto the Goliath"]
        ]
    },
    {
        name: "Batch C: Scenes 049–072 (Act 2 Climax: Goliath Decapitation & Surface Return)",
        start: 49,
        end: 72,
        scenes: [
            ["IMG_049", "Tier B: Dual-Panel Split", "@{Void-Carapace Goliath}", "Void-Carapace Goliath lunging forward with explosive speed, muscular chitinous legs tearing through basalt floor", "Dual razor scythe forelimbs raised high in a lethal execution posture"],
            ["IMG_050", "Tier B: Dual-Panel Split", "@{Void-Carapace Goliath}", "Close-up of razor-sharp obsidian scythe blade cutting down through the air at supersonic speed", "Targeting Caelen Vance's neck in a lethal guillotine arc"],
            ["IMG_051", "Tier B: Dual-Panel Split", "@{Lyra Fenn}", "Lyra Fenn screaming and turning her head away in horror, shutting her eyes tightly", "Other Class F cadets flinching and bracing for the blood splatter"],
            ["IMG_052", "Tier A: Hero Plate", "@{Caelen Vance - Outcast}", "Caelen Vance standing motionless with hands casually at his sides as the giant scythe strikes the air precisely 1mm from his neck, stopped dead by an invisible microscopic barrier with zero momentum transfer"],
            ["IMG_053", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Microscopic spatial boundary fold shimmering with subtle violet geometry around Caelen's skin", "Thousands of kilograms of kinetic force redirected into empty adjacent dimensional space"],
            ["IMG_054", "Tier B: Dual-Panel Split", "@{Void-Carapace Goliath}", "Void-Carapace Goliath recoiling in utter confusion, its scythe blade vibrating from hitting infinite density", "Its glowing purple optical clusters trembling in shock"],
            ["IMG_055", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Close-up of Caelen Vance looking up into the monster's eyes with a chillingly calm expression", "Amethyst irises swirling with deep gravitational iris rings"],
            ["IMG_056", "Tier A: Hero Plate", "@{Caelen Vance - Outcast}", "Caelen Vance stepping smoothly inside the Goliath's guard, right arm extended with an open palm pressed firmly against the center of the titan's thick chitinous chest plate"],
            ["IMG_057", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Extreme close-up of Caelen's calm lips murmuring an activation command", "Violet gravitational light concentrating into a single coin-sized point beneath his fingertips"],
            ["IMG_058", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Localized point-gravitational density shifting to fifty times planetary acceleration at contact point", "Atmospheric air rushing violently toward Caelen's palm in a visible inward vacuum cone"],
            ["IMG_059", "Tier B: Dual-Panel Split", "@{Void-Carapace Goliath}", "Goliath's unbreakable obsidian chest carapace fracturing inward in concentric circular shockwaves", "Internal organs and skeleton crushed instantly under twenty tons of localized gravitational pull"],
            ["IMG_060", "Tier A: Hero Plate", "General Cavern", "Massive sonic implosion collapsing all ambient light in the cavern toward the impact point, shockwave blasting dust and gravel outward in a perfect 360-degree ring"],
            ["IMG_061", "Tier B: Dual-Panel Split", "@{Void-Carapace Goliath}", "The 4-metre Goliath collapsing into a dense, crumpled sphere of shattered exoskeleton and bone", "Crashing lifelessly onto the cracked stone floor with a heavy thud"],
            ["IMG_062", "Tier A: Hero Plate", "@{Caelen Vance - Outcast}", "Caelen standing over the dead Goliath corpse, lowering his hand with calm breath, violet energy fading back into his dark hair"],
            ["IMG_063", "Tier B: Dual-Panel Split", "@{Lyra Fenn} & General Class F", "Lyra slowly opening her eyes in disbelief, round brass goggles reflecting the crushed monster corpse", "Class F students staring with dropped jaws and wide, petrified eyes"],
            ["IMG_064", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen calmly drawing a simple utility hunting knife from his boot", "Slicing into the fractured carapace to extract the prize"],
            ["IMG_065", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen holding up a flawless, pulsing violet S-Rank Void Core glowing with pure spatial mana", "Reflecting rich amethyst light onto Caelen's calm face"],
            ["IMG_066", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen slipping the precious void core into his concealed inner jacket pocket", "Turning to look at the three-ton iron portcullis blocking the exit"],
            ["IMG_067", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen walking up to the massive three-ton iron portcullis, placing two fingers against the rusty iron bars", "Negating the gate's gravitational mass with a subtle pulse of violet light"],
            ["IMG_068", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen effortlessly lifting the three-ton iron gate with a single hand as if it were cardboard", "Gesturing politely for the stunned Class F students to step into the extraction lift"],
            ["IMG_069", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Up on the surface academy pavilion, emergency red sirens flashing", "Prince Valen fabricating a heroic tale of his tactical sacrifice to the crowd and proctors"],
            ["IMG_070", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast} & General Class F", "Extraction elevator doors sliding open at the surface pavilion", "Caelen Vance leading the entire uninjured Class F unit out into the blinding sunlight"],
            ["IMG_071", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Head Examiner Keith Morgan pushing through the shocked crowd, cybernetic arm whirring", "Keith's analytical ocular sensor locking directly onto Caelen with intense focus"],
            ["IMG_072", "Tier A: Hero Plate", "@{Caelen Vance - Outcast}", "Caelen offering a crisp, polite cadet salute to the head examiner, murmuring that the beast suffered a structural pressure collapse while in his violet eyes the silent sovereign authority of Space and Gravity begins to reign"]
        ]
    },
    {
        name: "Batch D: Scenes 073–096 (Act 3A: Forensic Telemetry & The Imperial Guild Tribunal)",
        start: 73,
        end: 96,
        scenes: [
            ["IMG_073", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Inside the high-tech titanium chamber of the High Proctor Office, massive holographic monitors glowing blue", "Keith Morgan inserting the seismic telemetry crystal into the academy mainframe"],
            ["IMG_074", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Holographic graph displaying a massive pinpoint gravitational pressure spike registering fifty-three atmospheres", "Keith Morgan stroking his weathered jawline in deep analytical calculation"],
            ["IMG_075", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Prince Valen entering the chamber accompanied by three royal legal magistrates in gold-embroidered robes", "Valen slamming a golden seal document onto the glass conference table"],
            ["IMG_076", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Close-up of an imperial non-disclosure contract and a velvet pouch of 50 silver coins", "Valen demanding the immediate surrender of the S-Rank Void Core as royal imperial salvage"],
            ["IMG_077", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen Vance sitting calmly with fingers steepled, tapping a glowing page of the Imperial Hunter Charter", "Highlighting Section 4: Absolute salvage ownership for abandoned vanguard survivors"],
            ["IMG_078", "Tier B: Dual-Panel Split", "General Nobles", "Royal legal magistrates sweating profusely and whispering frantically to Valen", "Proving Valen's emergency gate trigger constitutes criminal battlefield abandonment under imperial law"],
            ["IMG_079", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Prince Valen forced to sign the salvage release authorization with a furious trembling hand", "Valen glaring at Caelen with murderous golden eyes as he storms out the blast doors"],
            ["IMG_080", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Keith Morgan leaning over the desk after the nobles depart, his mechanical eye glowing faintly", "Keith warning Caelen that House Sol-Aegis never forgives humiliation"],
            ["IMG_081", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen offering a polite nod, adjusting the collar of his cadet tunic", "Violet eyes shining with calm confidence in the dim proctor light"],
            ["IMG_082", "Tier B: Dual-Panel Split", "@{Lyra Fenn} & General Class F", "Dimly lit Scavenger Quarter mess hall where Class F cadets cheer and toast cheap grain soup", "Lyra Fenn smiling warmly as Caelen enters the room"],
            ["IMG_083", "Tier B: Dual-Panel Split", "@{Lyra Fenn}", "Lyra examining the pulsing violet S-Rank Void Core with her brass alchemical goggles", "Her hands shivering at the core's impossible zero-heat spatial density"],
            ["IMG_084", "Tier B: Dual-Panel Split", "@{Lyra Fenn}", "Lyra explaining that standard academy forge fires would explode if exposed to raw spatial essence", "Recommending a legendary rogue artificer operating beneath the city"],
            ["IMG_085", "Tier A: Hero Plate", "General District", "The Black Iron District: a sprawling subterranean neon-lit cyber-fantasy bazaar built within ancient basalt ruins, steam pipes venting purple mana smoke, rogue hunters trading glowing artifacts"],
            ["IMG_086", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast} & @{Lyra Fenn}", "Caelen and Lyra slipping into dark hooded travel cloaks in a shadowy alley", "Descending the stone staircase into the neon-lit underground underworld"],
            ["IMG_087", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen sitting alone in his modest cadet dorm room before departing", "Focusing inward to summon his translucent glowing status interface"],
            ["IMG_088", "Tier B: Dual-Panel Split", "General System", "Translucent cyan status HUD floating in mid-air displaying Level Up from 1 to Level 3", "Experience counter registering 12,500 EXP absorbed from the Goliath"],
            ["IMG_089", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Status screen displaying Constitution scaling from 65 to 90 points", "Caelen inspecting his forearm as a subtle diamond-hard subdermal sheen pulses under his skin"],
            ["IMG_090", "Tier B: Dual-Panel Split", "General System", "Skill unlocked: Spatial Shear Vector Blade (50-Micron Focus)", "Geometric purple dimensional lines forming an ultra-fine blade diagram"],
            ["IMG_091", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen extending his index finger with a razor-thin violet spatial outline", "Cleanly slicing through a solid steel training ingot on his desk with zero sound and zero friction"],
            ["IMG_092", "Tier A: Hero Plate", "@{Caelen Vance - Outcast}", "Caelen Vance walking calmly up the vertical stone wall of his dorm, standing horizontally ninety degrees against gravity with absolute balance, looking out the open window"],
            ["IMG_093", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Looking out at the sprawling imperial palace skyline illuminated under moonlight", "Knowing that nobility only respects sovereign leverage"],
            ["IMG_094", "Tier B: Dual-Panel Split", "General Nobles", "Atop the opulent gold-plated Sol-Aegis Spire, Prince Valen kneeling before his ruthless father Duke Sol-Aegis", "Golden chandeliers casting dramatic shadows across the marble hall"],
            ["IMG_095", "Tier B: Dual-Panel Split", "General Nobles", "Duke Sol-Aegis tossing a blood-sealed mercenary token onto the table", "Ordering an untraceable liquidation contract disguised as a dungeon accident"],
            ["IMG_096", "Tier A: Hero Plate", "General Mercenaries", "Bloodfang Syndicate shadow assassins leaping across the moonlit rooftops of the capital, poisoned daggers gleaming in the darkness"]
        ]
    },
    {
        name: "Batch E: Scenes 097–120 (Act 3B: The Black Iron Vault & Forging the Singularity Armaments)",
        start: 97,
        end: 120,
        scenes: [
            ["IMG_097", "Tier B: Dual-Panel Split", "General District", "Caelen and Lyra walking through the crowded stalls of the Black Iron District", "Passing rows of caged subterranean monsters and illicit alchemical vials"],
            ["IMG_098", "Tier B: Dual-Panel Split", "General Workshop", "Towering iron blast doors of 'The Abyssal Anvil' workshop", "Subterranean magma flaring behind heavy steel grates"],
            ["IMG_099", "Tier B: Dual-Panel Split", "General Artificer", "55-year-old Master Blacksmith Dorian Vance, scarred arms, glowing brass cybernetic eye", "Dorian scowling from behind the anvil, gesturing at his automated security golems"],
            ["IMG_100", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen unfastening his travel cloak with a calm expression", "Placing the radiant S-Rank Void Core onto the heavy steel anvil"],
            ["IMG_101", "Tier A: Hero Plate", "General Workshop", "The colossal gravitational mass of the void core warping ambient light, steel anvil groaning and cracking the stone foundation beneath it under thirty atmospheres of sudden mass"],
            ["IMG_102", "Tier B: Dual-Panel Split", "General Artificer", "Master Dorian dropping his iron tongs in sheer astonishment", "His cybernetic monocle zooming in on the uncorrupted purple spatial lattice of the core"],
            ["IMG_103", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Caelen spreading hand-drawn engineering blueprints across the workbench", "Detailed technical schematics for an obsidian trench-coat, graviton vambraces, and a dense trench-blade"],
            ["IMG_104", "Tier B: Dual-Panel Split", "General Artificer", "Master Dorian igniting his ancient geothermal magma forge with roaring flames", "Gripping heavy enchanted tongs to begin smelting abyssal obsidian ingots"],
            ["IMG_105", "Tier B: Dual-Panel Split", "@{Lyra Fenn}", "Lyra Fenn adding glowing blue alchemical stabilizing solvents into the cooling vat", "Preventing the spatial threads from unravelling under extreme temperature"],
            ["IMG_106", "Tier B: Dual-Panel Split", "@{Caelen Vance - Outcast}", "Dorian striking the glowing metal with massive hydraulic hammer", "Caelen standing beside the anvil channeling localized gravitational pulses into the cooling alloy"],
            ["IMG_107", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "The finished masterpiece: a midnight-black obsidian Singularity Coat lined with silver spatial-fold runes, glowing graviton vambraces, and a matte-black forged trench-blade resting on the anvil"],
            ["IMG_108", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen donning the high-collar Singularity Coat, the fabric flowing with weightless elegance", "Fastening the silver graviton vambraces around his forearms"],
            ["IMG_109", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Drawing the matte-black trench-blade, the razor edge humming with subtle violet gravitational energy", "Testing its balance with a crisp, silent swing"],
            ["IMG_110", "Tier B: Dual-Panel Split", "General Artificer", "Master Dorian laughing heartily, wiping soot from his forehead with a leather glove", "Handing Caelen a scabbard engraved with ancient dimensional runes"],
            ["IMG_111", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened} & @{Lyra Fenn}", "Caelen and Lyra stepping out into the misty cobblestone alley behind the workshop", "Caelen's trench-coat fluttering in the damp subterranean breeze"],
            ["IMG_112", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen pausing mid-step, his perception radar sensing four stealth cloaks shifting on the rooftops", "Violet eyes narrowing toward the foggy alley shadows"],
            ["IMG_113", "Tier B: Dual-Panel Split", "General Mercenaries", "Three Bloodfang Syndicate assassins dropping from the rooftops, wearing enchanted leather armour", "Drawing twin poisoned daggers glowing with emerald venom"],
            ["IMG_114", "Tier B: Dual-Panel Split", "General Mercenaries", "Mercenary captain sneering and demanding the newly forged spatial gear", "Pointing his venomous dagger straight at Caelen's chest"],
            ["IMG_115", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen stepping forward into the alleyway with hands tucked casually inside his coat pockets", "Calm, unimpressed gaze locking onto the assassins"],
            ["IMG_116", "Tier B: Dual-Panel Split", "General Mercenaries", "Lead assassin lunging forward at supersonic speed, blur of motion across the cobblestones", "Thrusting his poisoned dagger directly toward Caelen's throat"],
            ["IMG_117", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "Poisoned dagger striking Caelen's Micro-Spatial Fold precisely 1mm from his neck, stopping dead with a dull spark as all kinetic energy vanishes into the void, Caelen unblinking and unmoving"],
            ["IMG_118", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen's hand shooting out from his pocket, catching the assassin's wrist with iron grip", "Applying thirty times gravitational vector directly into the assassin's joint"],
            ["IMG_119", "Tier B: Dual-Panel Split", "General Mercenaries", "Assassin's reinforced metal vambrace crumpling like paper, the assassin slammed flat against the cobblestones under crushing localized mass", "Cobblestones cracking in a deep circular crater beneath him"],
            ["IMG_120", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "Caelen looking up at the terrified rooftop spotters with glowing amethyst eyes, his trench-coat billowing, leaving the broken assassins bound on the pavement"]
        ]
    },
    {
        name: "Batch F: Scenes 121–144 (Act 4A: The Bloodstone Fracture & Mercenary Ambush)",
        start: 121,
        end: 144,
        scenes: [
            ["IMG_121", "Tier A: Hero Plate", "General Colosseum", "Dawn sun rising over the Imperial Colosseum as five hundred elite academy cadets assemble on the arena grounds under massive heraldic banners"],
            ["IMG_122", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "High Proctor Keith Morgan standing on the central podium, holographic trial map floating in air", "Announcing the Mid-Year Ranking Trial inside the perilous B-Rank Bloodstone Caverns"],
            ["IMG_123", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Prince Valen leading the Class A noble vanguard in gleaming sun-forged plate armour", "Royal commentators praising his golden solar core over broadcast speakers"],
            ["IMG_124", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen Vance arriving at the Class F assembly zone in his midnight Singularity Coat", "Noble students sneering and whispering mocks from their formation"],
            ["IMG_125", "Tier A: Hero Plate", "General Portal", "Massive dimensional portal gates spinning with brilliant azure vortex energy, five hundred candidate squads stepping through the swirling event horizon into the dungeon"],
            ["IMG_126", "Tier A: Hero Plate", "General Dungeon", "The Bloodstone Caverns: towering crimson magma chambers, rivers of molten lava flowing beneath basalt bridges, sulfurous red steam clouds"],
            ["IMG_127", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened} & General Class F", "Other cadet squads sweating and panting under the oppressive volcanic heat", "Caelen folding a thin insulating spatial bubble around Class F, keeping his squad completely cool and refreshed"],
            ["IMG_128", "Tier B: Dual-Panel Split", "General Monsters", "Swarm of thirty Blazefang Stalkers erupting from the magma crevices, armored red reptiles with molten lava fangs", "Surrounding the Class F exploration path"],
            ["IMG_129", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen extending his palm, pulsing negative gravity onto the beasts' heavy hind legs", "The predators floating helplessly into the air, flailing their legs with zero traction"],
            ["IMG_130", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen executing swift, clean slashes with his 50-micron Spatial Shear trench-blade", "Harvesting dozens of pristine fire cores with effortless mathematical precision"],
            ["IMG_131", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Keith Morgan in the surface observation booth watching Caelen's live holographic feed", "His cybernetic ocular sensor calculating zero mana waste and unmatched kill efficiency"],
            ["IMG_132", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Prince Valen checking his leaderboard screen in the middle tunnels, seeing Caelen's score surpassing Class A", "Valen grinding his teeth and nodding to his noble henchmen to trigger the ambush"],
            ["IMG_133", "Tier B: Dual-Panel Split", "General Nobles", "Class F arriving at the narrow Bloodstone Chasm Bridge over a boiling magma sea", "Lord Vane and four heavily armored noble retainers blocking the far side with drawn broadswords"],
            ["IMG_134", "Tier B: Dual-Panel Split", "General Nobles", "Lord Vane smirking arrogantly, stating that commoner trash will not humiliate house Sol-Aegis", "Vane pulling a glowing crimson S-Rank Seismic Breaching Crystal from his pouch"],
            ["IMG_135", "Tier B: Dual-Panel Split", "General Nobles", "Vane forcefully hurling the explosive seismic crystal into the central bridge keystone", "Crystal igniting with blinding crimson shockwaves"],
            ["IMG_136", "Tier A: Hero Plate", "General Cavern", "The 500-ton stone bridge shattering into massive falling boulders with a deafening explosion, the entire span collapsing into the boiling magma ocean below with Class F plummeting downward"],
            ["IMG_137", "Tier B: Dual-Panel Split", "@{Lyra Fenn} & General Class F", "Lyra and the Class F students falling through the fiery chasm, screaming in terror amid clouds of red smoke", "Molten magma splashing fifty metres below them"],
            ["IMG_138", "Tier B: Dual-Panel Split", "General Nobles", "Vane and his conspirators turning around with triumphant laughter on the cliff edge", "Preparing to report another 'tragic dungeon accident' to the proctors"],
            ["IMG_139", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Mid-air inside the fiery chasm, Caelen calmly snapping his fingers", "Activating Zero-Gravity Vector Inversion across the entire falling zone"],
            ["IMG_140", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "Thousands of tons of falling stone boulders and all seven falling students freezing motionless in mid-air, floating weightlessly like glowing embers above the magma"],
            ["IMG_141", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen guiding the students smoothly through the air on gravitational currents", "Depositing Lyra and the squad safely onto the far cliff ledge with zero injuries"],
            ["IMG_142", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen launching himself upward along an inverted gravitational slipstream", "Landing silently on the stone path directly behind the retreating noble assassins"],
            ["IMG_143", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen drawing his matte-black trench-blade with a cold, terrifying gaze", "His shadow stretching long across the cavern floor behind Vane"],
            ["IMG_144", "Tier A: Hero Plate", "General Nobles", "Lord Vane spinning around in absolute petrified horror, broadsword shaking in his trembling hands as he faces Caelen standing alive and untouched"]
        ]
    },
    {
        name: "Batch G: Scenes 145–168 (Act 4B: S-Rank Mutation & Total Imperial Collapse)",
        start: 145,
        end: 168,
        scenes: [
            ["IMG_145", "Tier A: Hero Plate", "General Cavern", "Catastrophic 9.0-magnitude earthquake tearing through the Bloodstone Caverns, basalt pillars shattering, magma geysers erupting fifty metres into the air"],
            ["IMG_146", "Tier B: Dual-Panel Split", "General Rift", "The illegal seismic shockwave rupturing the fragile dimensional barrier between worlds", "A terrifying black-hole singularity vortex opening in the cavern ceiling"],
            ["IMG_147", "Tier B: Dual-Panel Split", "General Barrier", "The Academy's ancient anti-calamity barrier runes shattering like frosted glass", "Corrupted purple spatial lightning cascading across the entire dungeon sector"],
            ["IMG_148", "Tier B: Dual-Panel Split", "General Colosseum", "Surface colosseum broadcast crystals exploding in showers of sparks", "Emergency klaxons shrieking across the entire imperial capital"],
            ["IMG_149", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Keith Morgan leaping from his command chair, slamming his mechanical fist on the console", "Telemetry confirming an S-Rank Calamity Anomaly emerging inside the student trial grounds"],
            ["IMG_150", "Tier A: Hero Plate", "General Cavern", "Cavern air pressure skyrocketing to lethal crushing levels, sulfurous smoke swirling into a massive spiral vortex"],
            ["IMG_151", "Tier A: Hero Plate", "General Boss", "The Abyssal Rift-Maw: a colossal 15-metre cosmic abomination emerging from the vortex, covered in writhing void tentacles, jagged abyssal chitin, and fifty glowing singularity eyes"],
            ["IMG_152", "Tier B: Dual-Panel Split", "General Boss", "Rift-Maw unleashing an apocalyptic sonic roar, kinetic shockwaves pulverizing stone arches", "Lord Vane and his vanguard knights blasted unconscious into the rubble"],
            ["IMG_153", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Prince Valen and his Class A elite guard charging forward from the lower tunnel", "Valen attempting to slay the Calamity monster for imperial fame and glory"],
            ["IMG_154", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Valen channeling 100% of his S-Rank core into his ultimate technique: Solar Judgement Lance", "Firing a massive 5-metre wide golden plasma beam directly at the beast's cranium"],
            ["IMG_155", "Tier B: Dual-Panel Split", "General Boss", "Golden solar beam striking the Rift-Maw's spatial distortion field", "The beam effortlessly bent, amplified, and reflected back across the cavern floor in a blazing arc"],
            ["IMG_156", "Tier A: Hero Plate", "@{Valen Sol-Aegis}", "The reflected solar blast incinerating Valen's armour and shattering his golden rapier, leaving the golden prince bleeding, crippled, and weeping in the burning ash"],
            ["IMG_157", "Tier B: Dual-Panel Split", "General Cadets", "Complete hysterical panic as surviving noble cadets trample one another rushing toward the blocked exit tunnels", "Dropping weapons and shields in total disarray"],
            ["IMG_158", "Tier B: Dual-Panel Split", "General Boss", "Rift-Maw's central void core opening wide, charging a massive 10-metre wide Void Annihilation Cannon", "Targeting the clustered group of wounded Class F students and survivors"],
            ["IMG_159", "Tier B: Dual-Panel Split", "@{Lyra Fenn}", "Lyra Fenn and the surviving cadets holding hands, weeping in despair as the purple antimatter beam charges", "Closing their eyes against the blinding destruction"],
            ["IMG_160", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen Vance stepping calmly to the front of the entire crowd", "Placing himself directly between the apocalypse cannon and the students"],
            ["IMG_161", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Unclasping his cadet jacket, letting his obsidian Singularity Coat flare in the storm winds", "Dimensional lightning dancing across his broad shoulders"],
            ["IMG_162", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Close-up of Caelen's messy raven hair whipping in the wind, glowing amethyst irises swirling with twin gravitational rings", "Total sovereign authority radiating from his posture"],
            ["IMG_163", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Extreme close-up of Caelen's lips murmuring: 'Singularity Protocol: Full Authorization'", "Amethyst event horizon barrier igniting around his body"],
            ["IMG_164", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "Spherical amethyst event horizon expanding around Caelen, instantly neutralizing all ambient volcanic heat, smoke, and crushing air pressure in a 20-metre radius"],
            ["IMG_165", "Tier A: Hero Plate", "General Boss", "The Rift-Maw firing its cataclysmic Void Annihilation Cannon—a 10-metre wide beam of concentrated spatial antimatter screaming across the cavern floor toward the students"],
            ["IMG_166", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen extending his open left palm toward the roaring beam without taking a single step back", "Engaging Universal Spatial Redirection"],
            ["IMG_167", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "The apocalypse beam striking Caelen's palm and folding effortlessly into an infinite adjacent void pocket, vanishing from physical reality with zero explosion and zero knockback"],
            ["IMG_168", "Tier A: Hero Plate", "General Cavern", "Breathless, total silence falling over the cavern as surviving nobles, proctors, and monsters witness an F-Rank commoner swallow an S-Rank annihilation beam barehanded"]
        ]
    },
    {
        name: "Batch H: Scenes 169–192 (Act 5A: Progressive Power Unveiling — Event Horizon Unleashed)",
        start: 169,
        end: 192,
        scenes: [
            ["IMG_169", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen Vance looking up at the 15-metre monstrosity with cold mathematical calculation", "His trench-coat settling as he prepares to transition to dominant offensive power"],
            ["IMG_170", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "Caelen stepping calmly onto empty air, ascending upward on invisible gravitational footholds as though climbing the marble stairs of an imperial throne room"],
            ["IMG_171", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Prince Valen staring up from the dust with swollen, bloody eyes, trembling in sheer disbelief", "Watching the commoner walk on empty air above him"],
            ["IMG_172", "Tier B: Dual-Panel Split", "General Colosseum", "Surface colosseum broadcast monitors re-establishing live feed, 50,000 spectators standing in stunned silence", "Caelen's mid-air ascent broadcast live across the entire capital"],
            ["IMG_173", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Keith Morgan staring at the telemetry console in absolute awe", "Monitors displaying zero elemental mana but infinite spacetime gravitational curvature"],
            ["IMG_174", "Tier B: Dual-Panel Split", "General Boss", "Rift-Maw whipping fifty razor-sharp void tentacles forward at supersonic speed", "Targeting Caelen in a lethal spherical impalement cage"],
            ["IMG_175", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen activating Omni-Directional Spatial Slip, blinking instantly between coordinates with zero velocity latency", "Leaving faint violet afterimages in the air"],
            ["IMG_176", "Tier B: Dual-Panel Split", "General Cavern", "Tentacle strikes piercing empty air, creating supersonic shockwaves that shatter stone pillars behind him while Caelen remains untouched", "Caelen floating calmly thirty metres above the beast"],
            ["IMG_177", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen drawing his matte-black forged trench-blade with his right hand", "The dark steel blade catching the dim cavern light"],
            ["IMG_178", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Channeling Level 5 Singularity Vector Core into the trench-blade", "The blade humming with dense, crackling violet graviton lightning"],
            ["IMG_179", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen thrusting his open left palm downward toward the cavern floor", "Declaring the activation of Domain of Absolute Mass: 100G Collapse"],
            ["IMG_180", "Tier A: Hero Plate", "General Cavern", "An enormous 80-metre wide glowing violet gravitational seal slamming down onto the bedrock floor with the deafening thunder of a falling mountain"],
            ["IMG_181", "Tier A: Hero Plate", "General Boss", "Under one hundred times Earth's gravity, the 15-metre Rift-Maw is instantly slammed and flattened against the stone floor, unable to lift a single limb"],
            ["IMG_182", "Tier B: Dual-Panel Split", "General Boss", "The titan's massive multi-ton chitinous limbs snapping under their own multiplied mass", "Its indestructible exoskeleton cracking like brittle glass under infinite pressure"],
            ["IMG_183", "Tier B: Dual-Panel Split", "General Boss", "The monster roaring in agony as its dimensional breath is crushed inside its lungs", "Choking on its own compressed purple blood"],
            ["IMG_184", "Tier B: Dual-Panel Split", "General Cadets", "Noble cadets and Class F students watching from safe perimeter ledges in religious awe", "Dropping their swords as they realize Caelen controls the fundamental laws of physics"],
            ["IMG_185", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "Caelen diving downward from the sky at Mach-3 velocity, enveloped in a frictionless spatial fold envelope that eliminates all air resistance, blade raised high"],
            ["IMG_186", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Driving the graviton trench-blade straight into the center of the monster's glowing core", "Detonating Point Singularity Compression at the moment of impact"],
            ["IMG_187", "Tier A: Hero Plate", "General Cavern", "A brilliant supernova of amethyst light erupting outward, compressing three thousand cubic metres of matter into a microscopic pinpoint void with deafening implosion force"],
            ["IMG_188", "Tier A: Hero Plate", "General Cavern", "The shockwave blasting through the ceiling arches, letting pure golden shafts of sunlight pierce the dark cavern for the first time, clearing all sulfurous mist"],
            ["IMG_189", "Tier B: Dual-Panel Split", "General Boss", "The colossal Rift-Maw disintegrating into sparkling purple mana dust", "Leaving a radiant, flawless Mythic-Grade Singularity Core floating in mid-air"],
            ["IMG_190", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "Caelen landing softly on his boots, his obsidian Singularity Coat settling gently as the crushing gravitational domain dissipates into peaceful silence"],
            ["IMG_191", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Catching the floating Mythic Core in his palm, status screen chiming with Level 10 Sovereign Attunement", "Amethyst rings in his eyes fading into calm violet pupils"],
            ["IMG_192", "Tier A: Hero Plate", "General Cadets", "Hundreds of rescued academy cadets dropping to their knees across the cavern in spontaneous reverence before Caelen Vance, the true sovereign master of the academy"]
        ]
    },
    {
        name: "Batch I: Scenes 193–216 (Act 5B: The Sovereign Ascension & Imperial Climax Finale)",
        start: 193,
        end: 216,
        scenes: [
            ["IMG_193", "Tier B: Dual-Panel Split", "General Vanguard", "Emergency blast gates opening as elite imperial hunter brigades and medical teams swarm into the cavern with stretchers", "Surrounded by sunlight pouring from the shattered ceiling"],
            ["IMG_194", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Keith Morgan walking directly to the impact crater, his mechanical eye zooming in on the polished diamond-compressed bedrock", "Looking up at Caelen with solemn respect"],
            ["IMG_195", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Imperial medics loading Prince Valen onto a stretcher, his golden hair covered in soot", "Doctors confirming his core circuits are permanently crippled"],
            ["IMG_196", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Valen attempting to scream frantic accusations of forbidden treason", "Keith Morgan silencing him with a sharp, icy military reprimand"],
            ["IMG_197", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Keith holding up the acoustic and mana telemetry logs before assembled guild masters", "Proving Caelen used zero demonic magic—only pure fundamental spatial physics"],
            ["IMG_198", "Tier B: Dual-Panel Split", "General Nobles", "Duke Sol-Aegis and the aristocratic council arriving in fury, but finding themselves powerless against 50,000 public broadcast witnesses", "Aristocrats clenching their fists in bitter defeat"],
            ["IMG_199", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Official Imperial Decree displayed on floating holographic banners: Caelen Vance promoted to Independent Special S-Rank Sovereign Vanguard", "Caelen standing tall and unbothered before the council"],
            ["IMG_200", "Tier B: Dual-Panel Split", "@{Lyra Fenn} & General Class F", "Lyra Fenn and the Class F squad awarded honorary graduate crests and imperial research grants", "Lyra smiling through tears of joy alongside her fellow porters"],
            ["IMG_201", "Tier A: Hero Plate", "General City", "Giant holographic broadcast screens across every major metropolis in the empire showing Caelen Vance's stoic portrait and his new title: Lord of the Singularity, crowds cheering in the streets"],
            ["IMG_202", "Tier B: Dual-Panel Split", "General Nobles", "Corrupt guild masters in high towers realizing the old aristocratic power monopoly has been permanently broken", "Shadow syndicate leaders ordering their assassins to retreat"],
            ["IMG_203", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "Late that evening, Caelen Vance standing on the grand observation balcony of the Imperial Spire under a clear starlit sky, looking out over the illuminated capital"],
            ["IMG_204", "Tier B: Dual-Panel Split", "@{Keith Morgan}", "Keith Morgan stepping onto the terrace, presenting a solid platinum Sovereign Hunter Crest engraved with Space and Gravity sigils", "Keith warning him that global Abyssal Monarchs have taken notice"],
            ["IMG_205", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen fastening the platinum crest to his high-collar obsidian coat with a calm, dangerous smirk", "Replying that in this universe, gravity bows to no monarch"],
            ["IMG_206", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Caelen looking toward the far horizon where colossal S-Rank dimensional rift storms glow against the night clouds", "Wind whipping his messy dark hair as his violet eyes ignite with sovereign light"],
            ["IMG_207", "Tier B: Dual-Panel Split", "@{Caelen Vance - Awakened}", "Folding space around his silhouette with a subtle flick of his fingers", "Stepping into the void to begin his conquest of the Great Abyssal Rift"],
            ["IMG_208", "Tier A: Hero Plate", "General Academy", "Cinematic montage showing the transformed Imperial Hunter Academy: Class F utility students walking proudly through the grand gates carrying refined graviton gear"],
            ["IMG_209", "Tier B: Dual-Panel Split", "General Class F", "Commoner cadets training in high-tier elemental halls with pride and dignity under Caelen's banner", "Lyra Fenn leading the new Sovereign Research Division in her lab"],
            ["IMG_210", "Tier B: Dual-Panel Split", "@{Valen Sol-Aegis}", "Prince Valen sitting by a window in a remote recovery ward, watching the sunset in bitter obscurity", "His family's guild influence completely dismantled"],
            ["IMG_211", "Tier B: Dual-Panel Split", "General Artificer", "Master Dorian's underground forge roaring with fire, mass-producing high-density spatial-alloy armaments for Caelen's independent legion", "Dorian smiling proudly beside his anvil"],
            ["IMG_212", "Tier B: Dual-Panel Split", "General Nobles", "The Emperor of Aethelgard signing the Sovereign Autonomy Treaty, officially declaring Caelen's faction exempt from imperial taxes and noble interference", "Imperial wax seal stamped onto parchment"],
            ["IMG_213", "Tier A: Hero Plate", "General Abyss", "Deep beneath the Earth in the uncharted Abyssal Fracture, ancient primordial Void Monarchs opening glowing purple eyes in the darkness, sensing the awakening of their new apex predator"],
            ["IMG_214", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "Caelen Vance perched atop the highest mountain peak overlooking the continent, his obsidian Singularity Coat billowing in the storm winds"],
            ["IMG_215", "Tier A: Hero Plate", "@{Caelen Vance - Awakened}", "Extreme close-up of Caelen's sharp violet eyes burning like twin supernovas amidst swirling dimensional lightning storms, ready for the upcoming Great Abyssal War"],
            ["IMG_216", "Tier A: Hero Plate", "General Title", "Epic cinematic title card locked into the starlit sky: 'The Singularity Protocol — Sovereign Ascension Complete', dark fantasy action manhwa art style, cinematic lighting, vertical 9:16"]
        ]
    }
];

let fullOutput = header;

for (const b of batches) {
    fullOutput += `\n## 📦 ${b.name}\n\n`;
    fullOutput += `| Scene Tag | Layout Tier | Entity Anchor | Master Midjourney / Fooocus Prompt |\n`;
    fullOutput += `| :--- | :--- | :--- | :--- |\n`;

    for (const s of b.scenes) {
        const [tag, tier, anchor, top, bottom] = s;
        const p = cleanPrompt(tier, top, bottom || top);
        fullOutput += `| \`${tag}\` | **${tier}** | ${anchor} | ${p} |\n`;
    }
}

fs.writeFileSync(matrixPath, fullOutput, 'utf8');
console.log(`Successfully generated full 216-scene prompt matrix at ${matrixPath}`);
