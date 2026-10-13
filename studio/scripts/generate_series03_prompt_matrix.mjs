import fs from 'fs';
import path from 'path';

const matrixPath = path.resolve(
  '../01_Franchises/Series_03_Transmigrated_Game_Architect/EP01_The_Smiling_Architect_and_The_Chalk_Rapier/02_Prompt_Matrix.md'
);

const UUIDS = {
  BRAM: '16c4c742-5932-4c96-9c0c-c42aadbcb00a',
  MINOTAUR: '70365391-fd2f-47b2-88c5-c587c1a02a65',
  VANCE: '78f698f6-7fc3-4258-97d0-8e5733f8c70f',
  LINNEA: '7cf4d027-6863-4e4b-8f93-f58ceb6f0b0b',
  CASSIAN: '85907b43-f56f-4b92-9869-b3c40d8d0c17'
};

const ZONES = {
  BOSS_CAVERN: 'Spatial Enclosure & Environment: subterranean basalt cavern of Floor 10 Boss Chamber, massive obsidian rock pillars, ancient stone arena floor with glowing crimson rune fissures, rising sulfur smoke, strictly underground dungeon boss chamber with zero city, sky, or workshop elements.',
  GREAT_ARCH_PLAZA: 'Spatial Enclosure & Environment: grand imperial stone plaza outside the Great Arch of the Tower of Demigods, towering granite battlements, iron portcullises, overcast stormy sky, crowded cobblestone holding pens, strictly exterior stone fortress plaza with zero subterranean cavern or shop elements.',
  TESTING_DAIS: 'Spatial Enclosure & Environment: outdoor white marble testing dais in the Great Arch plaza, towering black obsidian resonance pillar, gold-trimmed velvet examiner canopies, cynical imperial banners, strictly exterior ceremonial examination stage with zero cavern or workshop elements.',
  VR_STUDIO: 'Spatial Enclosure & Environment: sleek modern game development studio interior on Earth, glowing blue holographic code monitors, dark glass partitions, ergonomic design terminal, strictly contemporary high-tech cybernetic studio with zero medieval or stone elements.',
  LOCKE_WORKSHOP: 'Spatial Enclosure & Environment: rustic weathered timber workshop in the impoverished lower slum district (Locke\'s Sundries & Tea), exposed dark oak beams, cluttered artisan workbench with brass tools and iron nails, flickering tallow candles, clay teapots, strictly modest indoor craftsman workshop with zero noble castle or dungeon elements.',
  GREENHOUSE: 'Spatial Enclosure & Environment: weathered glass greenhouse adjacent to the slum shop, cracked greenhouse glass panes in iron framing, damp dark potting soil beds, blooming frost-lilies with luminous cyan petals, fragrant botanical mist, weathered wooden planter boxes, strictly interior slum greenhouse nursery with zero dungeon or palace elements.',
  SLUM_STREET: 'Spatial Enclosure & Environment: narrow muddy cobblestone street outside the timber workshop, weathered brick walls, overturned wooden market crates, horse tracks, afternoon overcast lighting, strictly impoverished medieval street exterior with zero dungeon or interior castle elements.',
  MIDNIGHT_STREET: 'Spatial Enclosure & Environment: modest timber workshop interior and misty midnight cobblestone street outside the shop, dark shadowy timber walls, glowing blue status window, quiet midnight atmosphere, strictly nighttime slum setting with zero daylight or dungeon elements.',
  FLOOR_1_CAVERN: 'Spatial Enclosure & Environment: Tower of Demigods Floor 1 subterranean limestone cavern, damp jagged stalactites, glowing blue subterranean moss on cave walls, cracked limestone floor, strictly underground Tower trial cavern with zero surface or city elements.',
  TOWER_STAIRS: 'Spatial Enclosure & Environment: ancient colossal winding spiral obsidian stairways and intermediate stone trial chambers inside the Tower of Demigods, blue torch sconces on runic stone walls, strictly interior Tower trial corridors with zero outdoor elements.',
  PALACE_DAWN: 'Spatial Enclosure & Environment: grand imperial palace plaza at dawn and slum shop exterior, monumental public Tower Leaderboard Obelisk glowing with golden celestial runes, grand marble balconies, golden morning sunlight, strictly majestic imperial city setting with zero dungeon elements.'
};

const NEG = 'dark fantasy action manhwa art style, sharp ink linework, high contrast cel shading, cinematic dramatic lighting, vertical 9:16, anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn boots and feet, crisp pupil reflections, no character cloning, no duplicate protagonist, no multiple copies of the same character, no twin clones, no self-interaction, no floating hands, no detached hands, no ghost limbs, no morphing artifacts, no missing fingers, no extra limbs, complete limbs, pristine anatomy, no split-room perspectives, no non-euclidean doors, textless manhwa illustration, zero speech bubbles, zero subtitles, zero watermarks, zero Korean characters, zero file names, pure textless artwork.';

// All 72 scenes definitions
const scenes = [
  // BATCH A (Scenes 001 - 024)
  {
    num: 1,
    tier: 'Tier A: Hero Plate',
    desc: 'Colossal 5-metre demonic Abyssal Minotaur roaring',
    charRef: UUIDS.MINOTAUR,
    prompt: `Full-bleed cinematic hero plate. Colossal 5-metre demonic @{Boss: Abyssal Minotaur} roaring inside subterranean basalt cavern, curved obsidian horns with dark smoke, blazing crimson eyes, ancient stone chains hanging from wrists. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 2,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Minotaur raising granite warhammer',
    charRef: UUIDS.MINOTAUR,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Giant demonic @{Boss: Abyssal Minotaur} raising a colossal spiked granite warhammer high above head. Bottom block: Shadow of the colossal hammer darkening the cavern floor, shockwave dust ripples spreading across basalt stones. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 3,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke standing calmly with tea',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} standing calmly in arena centre, warm chestnut-brown hair, golden-amber eyes, relaxed friendly smile, rolled-up cream linen shirt, dark brown leather artisan vest, brown trousers. Bottom block: Close-up of @{Bramwell Locke} holding a steaming ceramic tea cup with right hand, perfectly steady fingers against cavern background. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 4,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke holding siphoned pine needle',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and rolled-up cream linen shirt holding a siphoned pine needle between left thumb and forefinger, glowing with faint cyan kinetic light. Bottom block: Close-up of @{Bramwell Locke}'s unbothered confident smiling expression, golden-amber eyes, taking a casual sip of hot tea from ceramic cup, dark brown leather artisan vest. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 5,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Holographic system interface and needle runes',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Medium close-up profile shot of 24-year-old @{Bramwell Locke} in basalt cavern, messy parted chestnut-brown hair with short relaxed fringe over forehead, calm golden-amber eyes, confident unbothered craftsman smile, wearing rolled-up cream linen shirt and dark brown leather artisan vest, calmly observing a clean translucent cyan holographic status window floating in front of him. Bottom block: Extreme close-up of @{Bramwell Locke}'s right hand and wrist in rolled-up cream linen sleeve, slender fingers holding the green pine needle perfectly steady as microscopic cyan numerical runes and kinetic light spiral violently into the needle tip, amber eye reflection. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 6,
    tier: 'Tier C: Action Strip',
    desc: 'Supersonic pine needle piercing minotaur',
    charRefs: `${UUIDS.MINOTAUR}, ${UUIDS.BRAM}`,
    prompt: `Three-panel vertical manhwa action strip. Top: Siphoned green pine needle held in slender fingers of 24-year-old @{Bramwell Locke} with messy chestnut-brown hair and rolled-up cream linen shirt releasing conical sonic shockwave ring as he launches it with a flick. Middle: Blinding supersonic kinetic beam shattering the spiked granite warhammer of @{Boss: Abyssal Minotaur} into stone shrapnel. Bottom: Needle piercing cleanly through @{Boss: Abyssal Minotaur}'s forehead between curved obsidian horns into rear cavern basalt wall. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 7,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke clicking pocket watch',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest clicking a vintage brass pocket watch shut with left hand, warm cheerful smile. Bottom block: Steam curling peacefully from ceramic tea cup held by @{Bramwell Locke}, calm confident craftsman posture in the cavern. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 8,
    tier: 'Tier A: Hero Plate',
    desc: 'Imperial capital skyline at dusk',
    charRef: null,
    prompt: `Full-bleed cinematic hero plate. Sprawling semi-medieval imperial capital skyline at dusk, massive stone castles and noble estates towering above dark impoverished slum districts, stormy clouds overhead. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 9,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Nobles on warhorses vs commoners',
    charRef: null,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Ruthless aristocratic nobles riding armored warhorses through cobblestone streets outside the fortress gates. Bottom block: Impoverished commoners in tattered clothes bowing low against muddy stone walls. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 10,
    tier: 'Tier A: Hero Plate',
    desc: 'Tower of Demigods Great Arch',
    charRef: null,
    prompt: `Full-bleed cinematic hero plate. The monumental 100-floor Tower of Demigods piercing the storm clouds, ancient celestial runes glowing along black obsidian battlements, colossal glowing Great Arch at base. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 11,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Imperial sentries guarding iron gates',
    charRef: null,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Heavily armored imperial sentries guarding the iron gates of the Great Arch with halberds. Bottom block: Aristocratic flags bearing golden dragon crests fluttering in the wind along stone walls. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 12,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Transmigrators lined up on stone plaza',
    charRef: null,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Bewildered Earthling transmigrators lined up on the cold stone plaza in plain grey clothes. Bottom block: Close-up of heavy iron collars and numbered tags around their necks. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 13,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Aristocratic recruiter inspecting warrior',
    charRef: null,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Aristocratic recruiter in gold-trimmed velvet robes inspecting a muscular flame warrior transmigrator. Bottom block: Chest of gold imperial coins exchanging hands on a marble table in the stone plaza. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 14,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke stepping onto testing dais',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} stepping calmly onto the testing dais with hands in pockets, warm chestnut-brown hair, golden-amber eyes, rolled-up cream linen shirt, dark brown leather artisan vest, brown trousers, warm polite smile. Bottom block: @{Bramwell Locke} placing his right palm gently against the black obsidian resonance crystal. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 15,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Imperial proctors watching dark crystal',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Imperial proctors in gold-trimmed high robes watching the black obsidian crystal with eager anticipation. Bottom block: The obsidian crystal remaining completely dark with only a faint, dull grey flicker as 24-year-old @{Bramwell Locke} with messy chestnut-brown hair, golden-amber eyes, rolled-up cream linen shirt and dark brown leather artisan vest stands calmly with hands in pockets, polite unbothered smile. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 16,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Dull iron knife holographic rank icon',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Dull holographic crystal flashing low grey light above messy chestnut-brown hair of 24-year-old @{Bramwell Locke}, golden-amber eyes, rolled-up cream linen shirt. Bottom block: Faint iron knife icon appearing on diagnostic plate without glowing aura as @{Bramwell Locke} looks on with an unbothered craftsman smile in his dark brown leather artisan vest. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 17,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Aristocratic spectators laughing mockingly',
    charRef: null,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Aristocratic spectators and recruiters laughing mockingly, pointing fingers at the testing dais. Bottom block: High noble lady covering her mouth with silk fan in theatrical amusement. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 18,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Proctor flicking copper coins to Bramwell Locke',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Arrogant head proctor sneering with disgust and flicking five copper coins onto the stone floor. Bottom block: Low-angle shot of 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest calmly picking up the copper coins, unbothered polite smile on his face, golden-amber eyes. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 19,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke bowing and departing',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and dark brown leather vest executing a polite, graceful bow toward the arrogant proctor. Bottom block: @{Bramwell Locke} turning and walking away toward the slum gate with relaxed casual steps, rolled-up cream linen shirt, brown trousers, pleasant craftsman smile. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 20,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Flashback memory of modern VR studio',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Flashback memory of @{Bramwell Locke} on modern Earth in high-tech VR development studio, multiple holographic code monitors. Bottom block: Close-up of 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, sharp analytical golden-amber eyes glowing with deep comprehension of game logic, subtle pleasant smile. ${ZONES.VR_STUDIO} ${NEG}`
  },
  {
    num: 21,
    tier: 'Tier A: Hero Plate',
    desc: 'Bramwell Locke walking through slum archway',
    charRef: UUIDS.BRAM,
    prompt: `Full-bleed cinematic hero plate. Close-up of 24-year-old @{Bramwell Locke} walking through the slum archway at dusk, warm chestnut-brown hair, rolled-up cream linen shirt, dark brown leather artisan vest, warm golden-amber eyes glowing with secret celestial gold runes in the shadows, subtle knowing craftsman smile on his lips. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 22,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Celestial data interface inside inner vision',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Golden celestial data interface unfolding secretly inside @{Bramwell Locke}'s inner vision. Bottom block: Dual authority icons for Siphon Bank and Semantic Refactoring spinning with golden light before @{Bramwell Locke}. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 23,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke outside Locke\'s Sundries & Tea',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest standing outside a modest weathered timber shop in the slum district. Bottom block: @{Bramwell Locke} holding a wooden mallet, hanging a hand-painted timber sign with freshly carved letters and a smiling teapot emblem, friendly cheerful smile. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 24,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke tapping rusted iron nails',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest sitting at his wooden workbench late at night, candle flickering beside a steaming clay teapot, relaxed calm face. Bottom block: A pile of rusted iron nails on the table, @{Bramwell Locke}'s index finger tapping them one by one. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },

  // BATCH B (Scenes 025 - 048)
  {
    num: 25,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke rhythmic enhancement of nails',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and rolled-up cream linen shirt, hands moving in a blurred rhythmic rhythm over hundreds of iron nails on wooden workbench. Bottom block: Faint cyan enhancement sparks leaping from nail to nail with clockwork precision under @{Bramwell Locke}'s fingers. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 26,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'System counter and enhancement threshold',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Inner system notification counter spinning rapidly through hundreds of cycles before @{Bramwell Locke}. Bottom block: Enhancement threshold indicator upgrading to higher tiers with golden numerical glyphs. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 27,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Cyan light siphoning into Bramwell Locke\'s palm',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Glowing cyan light siphoning backward from the nails into 24-year-old @{Bramwell Locke}'s open right palm, warm chestnut-brown hair, rolled-up cream shirt, dark brown leather artisan vest. Bottom block: Numerical golden bank ledger expanding with thousands of deposited units in front of @{Bramwell Locke}. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 28,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Linnea Croft crying by withered frost-lilies',
    charRef: UUIDS.LINNEA,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 21-year-old @{Linnea Croft} kneeling on damp dirt in the greenhouse next door, braided strawberry-blonde hair draped over shoulder, bright emerald-green eyes, green-and-cream floral apron dress, crying softly. Bottom block: Withered, dried frost-lily stems crumbling in dry soil before @{Linnea Croft}. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 29,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Linnea Croft holding tax eviction notice',
    charRef: UUIDS.LINNEA,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Close-up of 21-year-old @{Linnea Croft} holding an imperial tax eviction notice stamped with crimson wax, braided strawberry-blonde hair. Bottom block: @{Linnea Croft} clenching her soil-stained gardening gloves in quiet desperation. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 30,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke offering chamomile tea to Linnea Croft',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.LINNEA}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} stepping outside his shop into the greenhouse holding a ceramic cup of warm chamomile tea, warm chestnut-brown hair, rolled-up cream linen shirt, dark brown leather artisan vest. Bottom block: @{Bramwell Locke} offering the cup to tearful @{Linnea Croft} with a gentle, reassuring smile. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 31,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Linnea Croft wiping tears and holding tea',
    charRef: UUIDS.LINNEA,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 21-year-old @{Linnea Croft} wiping tears from her bright emerald-green eyes, looking up with surprised embarrassment, strawberry-blonde braid. Bottom block: @{Linnea Croft} holding the warm tea cup between both soil-stained gardening gloves, feeling comforted. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 32,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke enhancing copper watering can',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.LINNEA}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream shirt and dark brown leather artisan vest picking up an antique rustic copper watering can by the handle. Bottom block: @{Bramwell Locke}'s thumb gently brushing across the copper rim, micro-cyan runes glowing into the metal while @{Linnea Croft} watches. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 33,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Enhanced watering can handed to Linnea Croft',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.LINNEA}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Close-up of the rustic copper watering can glowing with vivid cyan growth runes along base. Bottom block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and friendly amber eyes handing the watering can back to @{Linnea Croft} with a pleasant wink. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 34,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Linnea Croft watering dry herb bed',
    charRef: UUIDS.LINNEA,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 21-year-old @{Linnea Croft} tipping the enhanced watering can over the dry herb bed, clear water pouring out, strawberry-blonde hair. Bottom block: Sparkling cyan luminescence rippling outwards across the soil in concentric rings around @{Linnea Croft}'s boots. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 35,
    tier: 'Tier A: Hero Plate',
    desc: 'Greenhouse blooming explosion of frost-lilies',
    charRefs: `${UUIDS.LINNEA}, ${UUIDS.BRAM}`,
    prompt: `Full-bleed cinematic hero plate. Spectacular explosion of vibrant botanical life: dying sprouts instantly surging into 3-foot-tall blooming frost-lilies with glowing cyan petals and crystalline dew, fragrant mist filling the greenhouse as @{Linnea Croft} and @{Bramwell Locke} look on in wonder. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 36,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Linnea Croft dropped trowel in shock',
    charRefs: `${UUIDS.LINNEA}, ${UUIDS.BRAM}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 21-year-old @{Linnea Croft} dropping her garden trowel in sheer shock, mouth open in disbelief, strawberry-blonde braid. Bottom block: Emerald-green eyes of @{Linnea Croft} wide with awe, looking back and forth between the giant blooming frost-lilies and smiling @{Bramwell Locke}. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 37,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke offering fresh biscuit',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.LINNEA}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest cheerfully taking a freshly baked biscuit from his vest pocket and offering it to @{Linnea Croft}. Bottom block: @{Bramwell Locke} smiling warmly with completely unbothered craftsman humility, amber eyes. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 38,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Warhorses trotting down slum street',
    charRef: null,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Heavy iron-shod warhorses trotting aggressively down the narrow slum street. Bottom block: Market stalls overturned and wooden crates smashed beneath armored horse hooves outside the greenhouse. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 39,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Lord Cassian Valerius on white stallion',
    charRef: UUIDS.CASSIAN,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 22-year-old @{Lord Cassian Valerius} riding a pristine white stallion, slicked-back deep wine-burgundy dark crimson hair, cruel sneer, ornate white-and-gold plate armour. Bottom block: Five heavily armored imperial knights in white-and-gold plate trotting behind @{Lord Cassian Valerius}. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 40,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Lord Cassian Valerius demanding tax gold',
    charRef: UUIDS.CASSIAN,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 22-year-old @{Lord Cassian Valerius} with wine-burgundy hair demanding gold from trembling slum vendors, holding leather tax scroll. Bottom block: Poor stall owners cowering against the brick walls in fear before @{Lord Cassian Valerius}. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 41,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Lord Cassian Valerius ordering seizure of greenhouse',
    charRefs: `${UUIDS.CASSIAN}, ${UUIDS.LINNEA}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 22-year-old @{Lord Cassian Valerius} with wine-burgundy hair and cold ice-blue eyes locking hungrily onto blooming frost-lilies. Bottom block: @{Lord Cassian Valerius} raising his leather-gloved hand, ordering his knights to seize the greenhouse as @{Linnea Croft} cowers protectively by her flowers. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 42,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke courtly bow before Cassian',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.CASSIAN}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest calmly stepping between the armored knights and garden gate. Bottom block: @{Bramwell Locke} performing an impeccable, polite courtly bow with a warm unbothered smile toward sneering @{Lord Cassian Valerius}. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 43,
    tier: 'Tier A: Hero Plate',
    desc: 'Lord Cassian Valerius drawing Sunfire Rapier',
    charRef: UUIDS.CASSIAN,
    prompt: `Full-bleed cinematic hero plate. Enraged 22-year-old @{Lord Cassian Valerius} with slicked-back wine-burgundy hair drawing ancestral Sunfire Rapier, solid gold hilt radiating searing solar flames and blistering heat waves that scorch the nearby cobblestones, arrogant face twisted in fury. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 44,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Lord Cassian Valerius thrusting flaming rapier',
    charRefs: `${UUIDS.CASSIAN}, ${UUIDS.BRAM}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: @{Lord Cassian Valerius} thrusting the flaming Sunfire Rapier straight toward @{Bramwell Locke}'s throat with lethal force, wine-burgundy hair flying. Bottom block: Searing flame wake trailing behind the golden blade tip toward @{Bramwell Locke}. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 45,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke tapping flat of rapier blade',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.CASSIAN}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest standing perfectly still without flinching, raising right index finger. Bottom block: @{Bramwell Locke}'s fingertip gently tapping the flat side of the blazing golden rapier blade of @{Lord Cassian Valerius}, golden-amber eyes glowing with calm comprehension. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 46,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Semantic refactoring extinguishing flame to chalk',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.CASSIAN}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Subtle semantic refactoring glyphs flashing across the blade surface between @{Bramwell Locke} and @{Lord Cassian Valerius}. Bottom block: Golden solar fire instantly extinguishing, blade texture turning dull powdery matte white chalk. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 47,
    tier: 'Tier C: Action Strip',
    desc: 'Chalk rapier shattering into dust cloud',
    charRef: UUIDS.CASSIAN,
    prompt: `Three-panel vertical manhwa action strip. Top: @{Lord Cassian Valerius} putting full muscular weight into the thrust. Middle: The chalk rapier blade shattering violently into brittle chunks with a dry chalky snap. Bottom: A massive cloud of white chalk dust exploding into @{Lord Cassian Valerius}'s shocked face. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 48,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Cassian humiliation and Bramwell Locke polite farewell',
    charRefs: `${UUIDS.CASSIAN}, ${UUIDS.BRAM}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: @{Lord Cassian Valerius} staring in horrified humiliation at his empty gold hilt, white chalk dust covering his wine-burgundy hair and armour. Bottom block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest dusting off his fingers with a pleasant smile, wishing @{Lord Cassian Valerius} a wonderful afternoon. ${ZONES.SLUM_STREET} ${NEG}`
  },

  // BATCH C (Scenes 049 - 072)
  {
    num: 49,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke bolting shop door at night',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest bolting the front timber door of Locke's Sundries & Tea from the inside. Bottom block: @{Bramwell Locke} sitting at his wooden desk, reviewing his glowing sovereign system status window, friendly amber eyes. ${ZONES.MIDNIGHT_STREET} ${NEG}`
  },
  {
    num: 50,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Sovereign bank ledger 12,500 banked units',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Sovereign bank ledger showing 12,500 banked enhancement units glowing in gold before @{Bramwell Locke}. Bottom block: Max single-cast enhancement threshold unlocked to +50 with radiant gold glyphs. ${ZONES.MIDNIGHT_STREET} ${NEG}`
  },
  {
    num: 51,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke equipping knife and straw broom',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and rolled-up cream linen shirt slipping a battered 5-copper carving knife into his brown leather belt. Bottom block: @{Bramwell Locke} picking up an ordinary rustic ashwood straw broom from the corner, taking a final sip of herbal tea from ceramic cup, dark brown leather artisan vest. ${ZONES.MIDNIGHT_STREET} ${NEG}`
  },
  {
    num: 52,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke walking at midnight with broom',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, cream linen shirt and dark brown leather artisan vest walking through the dark cobblestone streets at midnight, relaxed easy posture. Bottom block: @{Bramwell Locke} carrying the ordinary rustic straw broom casually over his right shoulder with craftsman nonchalance, golden-amber eyes. ${ZONES.MIDNIGHT_STREET} ${NEG}`
  },
  {
    num: 53,
    tier: 'Tier A: Hero Plate',
    desc: 'Tower of Demigods midnight silhouette',
    charRef: null,
    prompt: `Full-bleed cinematic hero plate. Monumental 100-floor Tower of Demigods silhouetted against midnight thunderclouds, ancient glowing blue portal arch at base, bored imperial sentries leaning against halberds under torchlight. ${ZONES.FLOOR_1_CAVERN} ${NEG}`
  },
  {
    num: 54,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke entering trial portal',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest dropping a standard iron entry token into the gate pedestal slot. Bottom block: @{Bramwell Locke} stepping calmly into the swirling blue trial portal, carrying the straw broom, gentle breeze blowing his brown hair, warm confident smile. ${ZONES.FLOOR_1_CAVERN} ${NEG}`
  },
  {
    num: 55,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Floor 1 subterranean cavern goblin horde',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Dark subterranean cavern of Floor 1, damp jagged stalactites hanging from ceiling. Bottom block: A horde of 60 crimson goblins leaping from shadows with jagged iron cleavers toward @{Bramwell Locke}. ${ZONES.FLOOR_1_CAVERN} ${NEG}`
  },
  {
    num: 56,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke swinging straw broom',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest standing casually as the crimson goblin horde swarms. Bottom block: @{Bramwell Locke} gripping the ashwood handle of the straw broom with both hands, swinging in a wide calm arc with a relaxed smile. ${ZONES.FLOOR_1_CAVERN} ${NEG}`
  },
  {
    num: 57,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Straw broom kinetic shockwave runes',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Close-up of the rustic straw broom held by @{Bramwell Locke} glowing with intense cyan kinetic shockwave runes. Bottom block: Sonic distortion wave expanding violently outward from the broom tip across the cavern floor. ${ZONES.FLOOR_1_CAVERN} ${NEG}`
  },
  {
    num: 58,
    tier: 'Tier A: Hero Plate',
    desc: 'Kinetic shockwave clearing Floor 1',
    charRef: UUIDS.BRAM,
    prompt: `Full-bleed cinematic hero plate. Colossal kinetic shockwave hurricane erupting from @{Bramwell Locke}'s broom sweep, blowing all 60 crimson goblins 30 metres backward into cavern walls, cavern dust clearing instantly, floor one cleared in 4 seconds. ${ZONES.FLOOR_1_CAVERN} ${NEG}`
  },
  {
    num: 59,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke climbing spiral stone staircases',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Montage of 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest casually walking up towering spiral stone staircases between floors, broom over shoulder. Bottom block: @{Bramwell Locke} checking his vintage brass pocket watch, yawning slightly with unbothered craftsman calm. ${ZONES.TOWER_STAIRS} ${NEG}`
  },
  {
    num: 60,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke flicking pebble at rock golem',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and rolled-up cream linen shirt flicking a tiny granite pebble from between his thumb and forefinger at a charging rock golem. Bottom block: The pebble punching cleanly through the golem's enchanted core, shattering the monster into rubble as @{Bramwell Locke} smiles pleasantly. ${ZONES.TOWER_STAIRS} ${NEG}`
  },
  {
    num: 61,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke opening Floor 10 Boss doors',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, cream linen shirt and dark brown leather artisan vest pushing open the colossal black obsidian double doors of Floor 10 Boss Chamber, broom in hand. Bottom block: Massive chamber shaking violently under ominous crimson torchlight. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 62,
    tier: 'Tier A: Hero Plate',
    desc: 'Abyssal Minotaur leaping from obsidian ceiling',
    charRef: UUIDS.MINOTAUR,
    prompt: `Full-bleed cinematic hero plate. 5-metre demonic @{Boss: Abyssal Minotaur} leaping down from the obsidian ceiling, landing with seismic impact, raising its colossal spiked granite warhammer with ferocious killing intent. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 63,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Full circle: Bramwell Locke sipping tea vs hammer strike',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.MINOTAUR}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Linking to cold open: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest standing relaxed in arena centre, sipping hot tea from ceramic cup. Bottom block: @{Boss: Abyssal Minotaur}'s colossal spiked granite hammer descending toward @{Bramwell Locke} with fortress-crushing speed. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 64,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke drawing pine needle with architect calculation',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair drawing a single green pine needle from his dark brown leather vest pocket with left fingers, rolled-up cream linen shirt. Bottom block: Amber eyes of @{Bramwell Locke} calculating the exact trajectory angle with game architect precision, pleasant confident expression. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 65,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'System withdrawing 2,500 units into pine needle',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Medium close-up profile shot of 24-year-old @{Bramwell Locke} in basalt cavern, messy parted chestnut-brown hair with short relaxed fringe over forehead, calm golden-amber eyes, confident unbothered craftsman smile, wearing rolled-up cream linen shirt and dark brown leather artisan vest, observing translucent cyan holographic calculation runes withdrawing 2,500 units into the pine needle. Bottom block: Extreme close-up of @{Bramwell Locke}'s slender fingers in rolled-up cream linen sleeve holding the green pine needle as blinding supersonic kinetic aura ignites along needle's edge, amber eye reflection. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 66,
    tier: 'Tier C: Action Strip',
    desc: 'Hypersonic needle obliterating warhammer and minotaur',
    charRefs: `${UUIDS.MINOTAUR}, ${UUIDS.BRAM}`,
    prompt: `Three-panel vertical manhwa action strip. Top: Hypersonic pine needle releasing blinding emerald-cyan light from slender fingers of 24-year-old @{Bramwell Locke} with messy chestnut-brown hair and rolled-up cream linen shirt. Middle: Smashing straight through colossal spiked granite warhammer of @{Boss: Abyssal Minotaur}, disintegrating stone. Bottom: Cleanly piercing through @{Boss: Abyssal Minotaur}'s skull between curved obsidian horns, pinning titan to rear basalt wall. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 67,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Minotaur dissolving and S-Rank chest appearing',
    charRefs: `${UUIDS.MINOTAUR}, ${UUIDS.BRAM}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Colossal demonic @{Boss: Abyssal Minotaur} dissolving into sparkling golden motes of demigod light. Bottom block: An ornate golden S-Rank Demigod Treasure Chest materialising on the arena floor before @{Bramwell Locke}. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 68,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke taking sealed silver ring from chest',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Glowing celestial announcement banner floating over arena showing record time of 22 minutes. Bottom block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest opening the golden chest, picking up an ancient sealed silver ring with an unbothered smile. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 69,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Bramwell Locke stepping back through exit portal',
    charRef: UUIDS.BRAM,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair slipping the sealed celestial ring into his brown vest pocket, rolled-up cream linen shirt. Bottom block: @{Bramwell Locke} stepping back through the commoner exit portal into the pre-dawn mist with rustic broom in hand, peaceful smile. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 70,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Dawn breaking over spires and emergency sirens',
    charRef: null,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: First golden rays of dawn breaking over the imperial capital's towering spires. Bottom block: Colossal brass emergency sirens spinning and wailing loudly from every fortress battlement across the capital. ${ZONES.PALACE_DAWN} ${NEG}`
  },
  {
    num: 71,
    tier: 'Tier A: Hero Plate',
    desc: 'Tower Leaderboard Monument glowing with new record',
    charRef: null,
    prompt: `Full-bleed cinematic hero plate. Monumental public Tower Monument in the central palace plaza blazing with celestial golden light, the ancient three-century record of House Vane-Valerius shattered, glowing new title carved into stone: "The Smiling Craftsman - 22m 14s". ${ZONES.PALACE_DAWN} ${NEG}`
  },
  {
    num: 72,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Commander Vance Sterling panic vs Bramwell Locke sweeping shop',
    charRefs: `${UUIDS.VANCE}, ${UUIDS.BRAM}`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 48-year-old @{Commander Vance Sterling} with silver-templed charcoal hair and noble lords on palace balcony staring down at the monument in total shock and panic. Bottom block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest casually sweeping morning dust outside his humble tea shop, warm smiling face in morning sun. ${ZONES.PALACE_DAWN} ${NEG}`
  }
];

// Helper to partition into batches
function generateMarkdown() {
  let md = `# 🎨 Series 03: Master Prompt Matrix (72 Granular Multi-Panel Scenes)\n`;
  md += `## Transmigrated Game Architect: Siphoning Demigod Enhancements in a Feudal World\n`;
  md += `### Episode 01: The Smiling Architect and The Chalk Rapier\n\n`;
  md += `> **Franchise:** \`Series_03_Transmigrated_Game_Architect\`  \n`;
  md += `> **Episode:** \`EP01_The_Smiling_Architect_and_The_Chalk_Rapier\`  \n`;
  md += `> **Format Tier:** Tier 1 Episode (72 Scenes • Batches A, B, and C • 24 Cuts / Batch)  \n`;
  md += `> **Visual Engine:** 3-Tier Dynamic Hybrid Standard (~70% Multi-Panel Strips / ~30% Hero Plates)  \n`;
  md += `> **Aspect Ratio:** 9:16 Vertical Webtoon Format (\`--ar 9:16\`)  \n`;
  md += `> **Prompt Directives Enforced:** 100% Locked Character DNA Tokens (\`@{Character Name}\`), 100% Locked Spatial Enclosure & Environment Enclosures, Zero-Trigger Safety Standards, Universal Multi-Panel Consistency  \n`;
  md += `> **Universal Negative Directives:** \`${NEG}\`\n\n`;
  md += `---\n\n`;

  const batches = [
    { name: 'Batch A: Scenes 001–024 (Act 1: Cold Open & The Slum Workshop)', start: 1, end: 24 },
    { name: 'Batch B: Scenes 025–048 (Act 2: The Chalk Rapier & The Siphon Bank)', start: 25, end: 48 },
    { name: 'Batch C: Scenes 049–072 (Act 3: The Midnight Tower Incursion)', start: 49, end: 72 }
  ];

  for (const b of batches) {
    md += `## 📦 ${b.name}\n\n`;
    
    // Markdown Table
    md += `| Scene Tag | Layout Tier | Entity Anchor | Master Midjourney / Fooocus Prompt |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    
    const batchScenes = scenes.filter(s => s.num >= b.start && s.num <= b.end);
    for (const s of batchScenes) {
      const tag = `IMG_${String(s.num).padStart(3, '0')}`;
      let anchor = 'General Environment';
      if (s.charRefs) {
        anchor = s.charRefs.split(',').map(ref => {
          const entry = Object.entries(UUIDS).find(([_, u]) => u === ref.trim());
          if (entry) {
            if (entry[0] === 'BRAM') return '@{Bramwell Locke}';
            if (entry[0] === 'MINOTAUR') return '@{Boss: Abyssal Minotaur}';
            if (entry[0] === 'VANCE') return '@{Commander Vance Sterling}';
            if (entry[0] === 'LINNEA') return '@{Linnea Croft}';
            if (entry[0] === 'CASSIAN') return '@{Lord Cassian Valerius}';
          }
          return ref.trim();
        }).join(' & ');
      } else if (s.charRef) {
        const entry = Object.entries(UUIDS).find(([_, u]) => u === s.charRef);
        if (entry) {
          if (entry[0] === 'BRAM') anchor = '@{Bramwell Locke}';
          if (entry[0] === 'MINOTAUR') anchor = '@{Boss: Abyssal Minotaur}';
          if (entry[0] === 'VANCE') anchor = '@{Commander Vance Sterling}';
          if (entry[0] === 'LINNEA') anchor = '@{Linnea Croft}';
          if (entry[0] === 'CASSIAN') anchor = '@{Lord Cassian Valerius}';
        }
      }
      md += `| \`${tag}\` | **${s.tier}** | ${anchor} | ${s.prompt} |\n`;
    }
    md += `\n`;

    // XML Ledger
    md += `### 📄 XML Prompt Nodes (${b.name.split(' (')[0]})\n\n`;
    md += `\`\`\`xml\n`;
    for (const s of batchScenes) {
      const tag = `IMG_${String(s.num).padStart(3, '0')}`;
      const filename = `${tag}.jpg`;
      let refAttr = '';
      if (s.charRefs) {
        refAttr = ` character_refs="${s.charRefs}"`;
      } else if (s.charRef) {
        refAttr = ` character_ref="${s.charRef}"`;
      }
      md += `<scene id="${tag}" filename="${filename}"${refAttr}>\n`;
      md += `${s.prompt}\n`;
      md += `</scene>\n\n`;
    }
    md += `\`\`\`\n\n---\n\n`;
  }

  return md;
}

const finalMd = generateMarkdown();
fs.writeFileSync(matrixPath, finalMd, 'utf8');
console.log(`Successfully generated ${scenes.length} scenes in ${matrixPath}`);
