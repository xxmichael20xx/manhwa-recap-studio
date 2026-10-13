import { UUIDS, ZONES, NEG } from './config.mjs';

export const batch01_03 = [
  // BATCH 01 (Scenes 001 - 024) - Act 1A: Cold Open & The Dimensional Arrival
  {
    num: 1,
    tag: 'IMG_001',
    layout: 'Tier A: Hero Plate',
    charRef: UUIDS.MINOTAUR,
    scriptText: `Deep inside the subterranean abyss of the tenth floor, the subterranean ground trembled under the seismic tread of a five-metre demonic sovereign known only as the Abyssal Minotaur.`,
    prompt: `Full-bleed cinematic hero plate. Colossal 5-metre demonic @{Boss: Abyssal Minotaur} roaring inside subterranean basalt cavern, curved obsidian horns with dark smoke, blazing crimson eyes, ancient stone chains hanging from wrists. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 2,
    tag: 'IMG_002',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.MINOTAUR,
    scriptText: `The beast raised a massive spiked granite warhammer high above its curved obsidian horns, darkening the cavern floor with a shadow of pure impending devastation.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Giant demonic @{Boss: Abyssal Minotaur} raising a colossal spiked granite warhammer high above head. Bottom block: Shadow of the colossal hammer darkening the cavern floor, shockwave dust ripples spreading across basalt stones. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 3,
    tag: 'IMG_003',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Standing completely unbothered in the centre of the crushed stone arena was twenty-four-year-old Bramwell Locke, wearing plain rolled-up linen craftsman sleeves, calmly sipping hot herbal tea from a ceramic cup.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} standing calmly in arena centre, warm chestnut-brown hair, golden-amber eyes, relaxed friendly smile, rolled-up cream linen shirt, dark brown leather artisan vest, brown trousers. Bottom block: Close-up of @{Bramwell Locke} holding a steaming ceramic tea cup with right hand, perfectly steady fingers against cavern background. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 4,
    tag: 'IMG_004',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `With his free hand, Bram drew a single ordinary green pine needle from his artisan vest pocket, twirling it between thumb and forefinger as faint cyan kinetic light flickered along its edges.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and rolled-up cream linen shirt holding a siphoned pine needle between left thumb and forefinger, glowing with faint cyan kinetic light. Bottom block: Close-up of @{Bramwell Locke}'s unbothered confident smiling expression, golden-amber eyes, taking a casual sip of hot tea from ceramic cup, dark brown leather artisan vest. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 5,
    tag: 'IMG_005',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `[SYSTEM NOTICE: RE-INDEXED CALIBRATION. WITHDRAWING +2,500 KINETIC FORCE. INJECTED INTO: PINE NEEDLE.] Bram's sovereign developer interface flashed silently before his golden-amber eyes.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Medium close-up profile shot of 24-year-old @{Bramwell Locke} in basalt cavern, messy parted chestnut-brown hair with short relaxed fringe over forehead, calm golden-amber eyes, confident unbothered craftsman smile, wearing rolled-up cream linen shirt and dark brown leather artisan vest, calmly observing a clean translucent cyan holographic status window floating in front of him. Bottom block: Extreme close-up of @{Bramwell Locke}'s right hand and wrist in rolled-up cream linen sleeve, slender fingers holding the green pine needle perfectly steady as microscopic cyan numerical runes and kinetic light spiral violently into the needle tip, amber eye reflection. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 6,
    tag: 'IMG_006',
    layout: 'Tier C: Action Strip',
    charRefs: `${UUIDS.MINOTAUR}, ${UUIDS.BRAM}`,
    scriptText: `The needle broke the sound barrier with a blinding hypersonic boom, shattering the granite warhammer into stone shrapnel and concussively slamming the five-metre titan backward, pinning the roaring beast flat against the vertical basalt wall.`,
    prompt: `Three-panel vertical manhwa action strip. Top: Hypersonic green pine needle launched from slender fingers of 24-year-old @{Bramwell Locke} in rolled-up cream linen shirt, conical sonic shockwave ring expanding. Middle: Blinding supersonic kinetic beam striking and completely disintegrating the spiked granite warhammer of @{Boss: Abyssal Minotaur} into stone shrapnel. Bottom: Wide dynamic low-angle shot showing the colossal 5-metre @{Boss: Abyssal Minotaur} violently slammed backward against the vertical basalt cavern wall, massive skull and horns held firmly flat against the stone surface by an intense cyan concussive mana anchor pin, deep concentric spiderweb fracture cracks radiating through the rock wall behind its head, titan's massive body paralyzed and sagging against the vertical rock face with feet lifted off the ground, dust and rock chips erupting around the impact site, clean bloodless anime impact, zero blood, zero gore. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 7,
    tag: 'IMG_007',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Bram checked his vintage brass pocket watch with a polite, cheerful smile. "Two minutes and twelve seconds. A perfectly respectable evening warmup before bedtime."`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest clicking a vintage brass pocket watch shut with left hand, warm cheerful smile. Bottom block: Steam curling peacefully from ceramic tea cup held by @{Bramwell Locke}, calm confident craftsman posture in the cavern. ${ZONES.BOSS_CAVERN} ${NEG}`
  },
  {
    num: 8,
    tag: 'IMG_008',
    layout: 'Tier A: Hero Plate',
    charRef: null,
    scriptText: `Yet forty-eight hours earlier, the arrogant aristocrats of the imperial capital had branded Bramwell Locke the most pathetic, worthless transmigrator to ever cross the dimensional threshold.`,
    prompt: `Full-bleed cinematic hero plate. Sprawling semi-medieval imperial capital skyline at dusk, massive stone castles and noble estates towering above dark impoverished slum districts, stormy clouds overhead. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 9,
    tag: 'IMG_009',
    layout: 'Tier B: Dual-Panel Split',
    charRef: null,
    scriptText: `In this cutthroat feudal society, aristocratic scions rode purebred warhorses through cobblestone avenues whilst impoverished commoners bowed low into the mud beneath castle ramparts.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Ruthless aristocratic nobles riding armored warhorses through cobblestone streets outside the fortress gates. Bottom block: Impoverished commoners in tattered clothes bowing low against muddy stone walls. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 10,
    tag: 'IMG_010',
    layout: 'Tier A: Hero Plate',
    charRef: null,
    scriptText: `Every human who perished on modern Earth awoke beneath the monumental one-hundred-floor Tower of Demigods, where celestial runes pulsed along ancient obsidian spires piercing the storm clouds.`,
    prompt: `Full-bleed cinematic hero plate. The monumental 100-floor Tower of Demigods piercing the storm clouds, ancient celestial runes glowing along black obsidian battlements, colossal glowing Great Arch at base. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 11,
    tag: 'IMG_011',
    layout: 'Tier B: Dual-Panel Split',
    charRef: null,
    scriptText: `Conquering the hundredth floor promised absolute godhood, but the entrance gates were ruthlessly monopolised by imperial sentries and private noble merchant guilds.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Heavily armored imperial sentries guarding the iron gates of the Great Arch with halberds. Bottom block: Aristocratic flags bearing golden dragon crests fluttering in the wind along stone walls. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 12,
    tag: 'IMG_012',
    layout: 'Tier B: Dual-Panel Split',
    charRef: null,
    scriptText: `Newly arrived transmigrators were herded across the cold granite plaza like livestock, wearing heavy iron collars and stamped registration placards around their necks.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Bewildered Earthling transmigrators lined up on the cold stone plaza in plain grey clothes. Bottom block: Close-up of heavy iron collars and numbered tags around their necks. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 13,
    tag: 'IMG_013',
    layout: 'Tier B: Dual-Panel Split',
    charRef: null,
    scriptText: `Noble recruiters paid small fortunes for flashy combat awakenings like Sword Saints or Flame Conjurers, buying their indenture contracts right off marble evaluation tables.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Aristocratic recruiter in gold-trimmed velvet robes inspecting a muscular flame warrior transmigrator. Bottom block: Chest of gold imperial coins exchanging hands on a marble table in the stone plaza. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 14,
    tag: 'IMG_014',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `When Bramwell stepped onto the evaluation dais with his hands in his pockets, he placed his palm calmly against the black obsidian resonance crystal with a polite, pleasant smile.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} stepping calmly onto the testing dais with hands in pockets, warm chestnut-brown hair, golden-amber eyes, rolled-up cream linen shirt, dark brown leather artisan vest, brown trousers, warm polite smile. Bottom block: @{Bramwell Locke} placing his right palm gently against the black obsidian resonance crystal. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 15,
    tag: 'IMG_015',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `The proctors held their breath expecting divine fireworks, but the obsidian crystal remained completely dark, flickering only with a dull, pathetic grey glow beneath Bram's fingers.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Imperial proctors in gold-trimmed high robes watching the black obsidian crystal with eager anticipation. Bottom block: The obsidian crystal remaining completely dark with only a faint, dull grey flicker as 24-year-old @{Bramwell Locke} with messy chestnut-brown hair, golden-amber eyes, rolled-up cream linen shirt and dark brown leather artisan vest stands calmly with hands in pockets, polite unbothered smile. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 16,
    tag: 'IMG_016',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Above Bram's head, the diagnostic glyph registered the lowest possible civilian classification: [CLASS: COMMON TOOL POLISHER - TALENT: ZERO COMBAT AFFINITY].`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Dull holographic crystal flashing low grey light above messy chestnut-brown hair of 24-year-old @{Bramwell Locke}, golden-amber eyes, rolled-up cream linen shirt. Bottom block: Faint iron knife icon appearing on diagnostic plate without glowing aura as @{Bramwell Locke} looks on with an unbothered craftsman smile in his dark brown leather artisan vest. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 17,
    tag: 'IMG_017',
    layout: 'Tier B: Dual-Panel Split',
    charRef: null,
    scriptText: `The spectator balconies erupted into cruel aristocratic laughter, high-born ladies sneering behind silk fans at the worthless commoner who had failed to manifest magic.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Aristocratic spectators and recruiters laughing mockingly, pointing fingers at the testing dais. Bottom block: High noble lady covering her mouth with silk fan in theatrical amusement. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 18,
    tag: 'IMG_018',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `The chief examiner sneered with open disgust, tossing five copper coins onto the wet stone floor. "Get out of my sight, trash. Go carve spoons in the slums before you starve."`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Pompous @{High-Ranking Official} sneering with disgust through brass monocle and flicking five copper coins onto the stone floor. Bottom block: Low-angle shot of 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest calmly picking up the copper coins, unbothered polite smile on his face, golden-amber eyes. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 19,
    tag: 'IMG_019',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Bram politely bent down, gathered the coins with immaculate poise, offered a textbook courtly bow to the sneering examiner, and strolled leisurely toward the slum gateway.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and dark brown leather vest executing a polite, graceful bow toward the arrogant proctor. Bottom block: @{Bramwell Locke} turning and walking away toward the slum gate with relaxed casual steps, rolled-up cream linen shirt, brown trousers, pleasant craftsman smile. ${ZONES.TESTING_DAIS} ${NEG}`
  },
  {
    num: 20,
    tag: 'IMG_020',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `What the arrogant proctors failed to realise was that in his previous Earth life, Bramwell Locke had been the lead system architect for the world's most sophisticated virtual realities.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Flashback memory of @{Bramwell Locke} on modern Earth in high-tech VR development studio, multiple holographic code monitors. Bottom block: Close-up of 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, sharp analytical golden-amber eyes glowing with deep comprehension of game logic, subtle pleasant smile. ${ZONES.VR_STUDIO} ${NEG}`
  },
  {
    num: 21,
    tag: 'IMG_021',
    layout: 'Tier A: Hero Plate',
    charRef: UUIDS.BRAM,
    scriptText: `To his analytical gaze, this entire world was not governed by mystical destiny, but by a rigid, underlying set of programmable developer constants waiting to be exploited.`,
    prompt: `Full-bleed cinematic hero plate. Close-up of 24-year-old @{Bramwell Locke} walking through the slum archway at dusk, warm chestnut-brown hair, rolled-up cream linen shirt, dark brown leather artisan vest, warm golden-amber eyes glowing with secret celestial gold runes in the shadows, subtle knowing craftsman smile on his lips. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 22,
    tag: 'IMG_022',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `In his private soul ledger, his true authority unfolded: [SOVEREIGN DEVELOPER AUTHORITY: RECURSIVE ENHANCEMENT & SEMANTIC REFACTORING], completely hidden from imperial scanning crystals.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Golden celestial data interface unfolding secretly inside inner vision of 24-year-old @{Bramwell Locke}, messy chestnut-brown hair, golden-amber eyes glowing with celestial gold runes, rolled-up cream linen shirt, dark brown leather artisan vest. Bottom block: Dual authority icons for Siphon Bank and Semantic Refactoring spinning with radiant golden light before @{Bramwell Locke}'s calm smiling face. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 23,
    tag: 'IMG_023',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `By nightfall, Bram had rented a weathered timber shack on the muddy outskirts of District Nine, hanging a quaint wooden sign that read: "Locke's Sundries & Tea."`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest standing outside a modest weathered timber shop in the slum district. Bottom block: @{Bramwell Locke} holding a wooden mallet, hanging a hand-painted timber sign with freshly carved letters and a smiling teapot emblem, friendly cheerful smile. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 24,
    tag: 'IMG_024',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Sitting at his oak workbench beside a steaming clay teapot, Bram emptied a pouch of rusted five-millimetre iron nails onto the table and prepared to execute his first calibration.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest sitting at his wooden workbench late at night, candle flickering beside a steaming clay teapot, relaxed calm face. Bottom block: A pile of rusted iron nails on the table, @{Bramwell Locke}'s index finger tapping them one by one. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },

  // BATCH 02 (Scenes 025 - 048) - Act 1B: The Siphon Bank & The Greenhouse Miracle
  {
    num: 25,
    tag: 'IMG_025',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `With rhythmic precision, Bram began tapping each rusted nail with his right index finger, channeling microscopic bursts of mana to recursively enhance their structural density.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and rolled-up cream linen shirt, hands moving in a blurred rhythmic rhythm over hundreds of iron nails on wooden workbench. Bottom block: Faint cyan enhancement sparks leaping from nail to nail with clockwork precision under @{Bramwell Locke}'s fingers. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 26,
    tag: 'IMG_026',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Unlike standard enchanting which had a 99% failure rate past level ten, Bram's system possessed zero saturation decay, driving the enhancement tier from plus one to plus ten effortlessly.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Inner system notification counter spinning rapidly through hundreds of cycles before 24-year-old @{Bramwell Locke}, messy chestnut-brown hair, calm golden-amber eyes, rolled-up cream linen shirt. Bottom block: Enhancement threshold indicator upgrading to higher tiers with golden numerical glyphs as @{Bramwell Locke} watches with a confident craftsman smile in his dark brown leather artisan vest. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 27,
    tag: 'IMG_027',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `He then activated Siphon Mode, drawing the stored kinetic density backward out of the nails and depositing 5,000 pure enhancement units directly into his sovereign reserve bank.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Glowing cyan light siphoning backward from the nails into 24-year-old @{Bramwell Locke}'s open right palm, warm chestnut-brown hair, rolled-up cream shirt, dark brown leather artisan vest. Bottom block: Numerical golden bank ledger expanding with thousands of deposited units in front of @{Bramwell Locke}. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 28,
    tag: 'IMG_028',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.LINNEA,
    scriptText: `Next door in a dilapidated glass greenhouse, twenty-one-year-old Linnea Croft, a fellow transmigrator, was kneeling in the damp soil sobbing quietly over rows of withered frost-lilies.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 21-year-old @{Linnea Croft} kneeling on damp dirt in the greenhouse next door, braided strawberry-blonde hair draped over shoulder, bright emerald-green eyes, green-and-cream floral apron dress, crying softly. Bottom block: Withered, dried frost-lily stems crumbling in dry soil before @{Linnea Croft}. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 29,
    tag: 'IMG_029',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.LINNEA,
    scriptText: `Clutched in her soil-stained gardening gloves was an imperial tax notice demanding forty silver crowns by nightfall, or her nursery would be razed to the ground.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Close-up of 21-year-old @{Linnea Croft} holding an imperial tax eviction notice stamped with crimson wax, braided strawberry-blonde hair, emerald-green eyes. Bottom block: @{Linnea Croft} clenching her soil-stained gardening gloves in quiet desperation. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 30,
    tag: 'IMG_030',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.LINNEA}`,
    scriptText: `Hearing her distress, Bram walked into the greenhouse carrying two steaming ceramic cups of chamomile tea, offering one to Linnea with a warm, comforting smile.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} stepping outside his shop into the greenhouse holding a ceramic cup of warm chamomile tea, messy chestnut-brown hair, golden-amber eyes, rolled-up cream linen shirt, dark brown leather artisan vest. Bottom block: @{Bramwell Locke} offering the cup to tearful 21-year-old @{Linnea Croft} with a gentle, reassuring smile, braided strawberry-blonde hair over shoulder, emerald-green eyes, green working dress. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 31,
    tag: 'IMG_031',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.LINNEA,
    scriptText: `Linnea sniffled, accepting the warm tea between trembling fingers as Bram inspected her antique, dented copper watering can resting near the dry garden bed.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 21-year-old @{Linnea Croft} wiping tears from her bright emerald-green eyes, looking up with surprised embarrassment, strawberry-blonde braid. Bottom block: @{Linnea Croft} holding the warm tea cup between both soil-stained gardening gloves, feeling comforted. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 32,
    tag: 'IMG_032',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.LINNEA}`,
    scriptText: `"A charming antique," Bram remarked cheerfully, resting his thumb against the copper rim and silently transferring plus fifteen recursive botanical growth runes into the metal.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream shirt and dark brown leather artisan vest picking up an antique rustic copper watering can by the handle. Bottom block: @{Bramwell Locke}'s thumb gently brushing across the copper rim, micro-cyan runes glowing into the metal while 21-year-old @{Linnea Croft} with strawberry-blonde braid watches. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 33,
    tag: 'IMG_033',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.LINNEA}`,
    scriptText: `Intricate cyan growth equations spiraled along the copper base as Bram handed the vessel back to the bewildered botanist. "Give them another pour, Miss Croft."`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Close-up of the rustic copper watering can glowing with vivid cyan growth runes along base. Bottom block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair and friendly amber eyes handing the watering can back to 21-year-old @{Linnea Croft} with a pleasant wink. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 34,
    tag: 'IMG_034',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.LINNEA,
    scriptText: `The moment Linnea tipped the water across the dry dirt, sparkling concentric rings of bioluminescent mana radiated outwards across the garden soil.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 21-year-old @{Linnea Croft} tipping the enhanced watering can over the dry herb bed, clear water pouring out, strawberry-blonde hair. Bottom block: Sparkling cyan luminescence rippling outwards across the soil in concentric rings around @{Linnea Croft}'s boots. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 35,
    tag: 'IMG_035',
    layout: 'Tier A: Hero Plate',
    charRefs: `${UUIDS.LINNEA}, ${UUIDS.BRAM}`,
    scriptText: `In a breathtaking burst of botanical life, the dead stalks erupted into three-foot-tall pristine frost-lilies, blooming with crystalline petals and releasing a fragrant mist that filled the entire greenhouse.`,
    prompt: `Full-bleed cinematic hero plate. Spectacular explosion of vibrant botanical life: dying sprouts instantly surging into 3-foot-tall blooming frost-lilies with glowing cyan petals and crystalline dew, fragrant mist filling the greenhouse as 21-year-old @{Linnea Croft} with braided strawberry-blonde hair and emerald-green eyes looks on in utter awe beside smiling 24-year-old @{Bramwell Locke} in rolled-up cream linen shirt and dark brown leather artisan vest. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 36,
    tag: 'IMG_036',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.LINNEA}, ${UUIDS.BRAM}`,
    scriptText: `Linnea dropped her garden trowel in stunned disbelief, clutching her mouth as she stared between the priceless glowing flowers and the relaxed craftsman beside her.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 21-year-old @{Linnea Croft} dropping her garden trowel in sheer shock, mouth open in disbelief, strawberry-blonde braid over shoulder, emerald-green eyes. Bottom block: Emerald-green eyes of @{Linnea Croft} wide with awe, looking back and forth between the giant blooming frost-lilies and smiling @{Bramwell Locke}. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 37,
    tag: 'IMG_037',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.LINNEA}`,
    scriptText: `Bram chuckled softly, retrieving a fresh butter biscuit from his vest pocket and offering it to her with disarming warmth. "Everything works much better when it's well-nourished."`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest cheerfully taking a freshly baked biscuit from his vest pocket and offering it to 21-year-old @{Linnea Croft}. Bottom block: @{Bramwell Locke} smiling warmly with completely unbothered craftsman humility, golden-amber eyes. ${ZONES.GREENHOUSE} ${NEG}`
  },
  {
    num: 38,
    tag: 'IMG_038',
    layout: 'Tier B: Dual-Panel Split',
    charRef: null,
    scriptText: `Their peaceful moment was abruptly shattered by the thunder of heavy iron-shod hooves as armed aristocratic knights charged violently down the narrow slum avenue.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Heavy iron-shod warhorses trotting aggressively down the narrow slum street. Bottom block: Market stalls overturned and wooden crates smashed beneath armored horse hooves outside the greenhouse. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 39,
    tag: 'IMG_039',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.CASSIAN,
    scriptText: `At the head of the patrol rode twenty-two-year-old Lord Cassian Valerius, wearing ornate gold-trimmed plate armour and sneering with aristocratic contempt atop a white stallion.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 22-year-old @{Lord Cassian Valerius} riding a pristine white stallion, slicked-back deep wine-burgundy dark crimson hair, cruel sneer, ornate white-and-gold plate armour. Bottom block: Five heavily armored imperial knights in white-and-gold plate trotting behind @{Lord Cassian Valerius}. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 40,
    tag: 'IMG_040',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.CASSIAN,
    scriptText: `Cassian carried the regional eviction decree, demanding impossible levies from trembling slum shopkeepers whilst his guards overturned fruit carts into the gutter.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 22-year-old @{Lord Cassian Valerius} with wine-burgundy hair demanding gold from trembling slum vendors, holding leather tax scroll. Bottom block: Poor stall owners cowering against the brick walls in fear before @{Lord Cassian Valerius}. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 41,
    tag: 'IMG_041',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.CASSIAN}, ${UUIDS.LINNEA}`,
    scriptText: `Spotting the luminous glow of the blooming frost-lilies through the greenhouse glass, Cassian's cold ice-blue eyes widened with greedy malice as he ordered his men to seize the entire nursery.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 22-year-old @{Lord Cassian Valerius} with wine-burgundy hair and cold ice-blue eyes locking hungrily onto blooming frost-lilies. Bottom block: @{Lord Cassian Valerius} raising his leather-gloved hand, ordering his knights to seize the greenhouse as 21-year-old @{Linnea Croft} with braided strawberry-blonde hair and emerald-green eyes cowers protectively by her flowers. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 42,
    tag: 'IMG_042',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.CASSIAN}`,
    scriptText: `Before the armored thugs could breach the gate, Bramwell Locke casually stepped into their path, offering an impeccably polite courtly bow that seemed entirely out of place in the muddy slum.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest calmly stepping between the armored knights and garden gate. Bottom block: @{Bramwell Locke} performing an impeccable, polite courtly bow with a warm unbothered smile toward sneering @{Lord Cassian Valerius} in white-and-gold armour. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 43,
    tag: 'IMG_043',
    layout: 'Tier A: Hero Plate',
    charRef: UUIDS.CASSIAN,
    scriptText: `Infuriated by a filthy commoner daring to meet his gaze, Cassian drew his ancestral Sunfire Rapier, its solid gold hilt erupting into roaring solar flames that scorched the nearby cobblestones.`,
    prompt: `Full-bleed cinematic hero plate. Enraged 22-year-old @{Lord Cassian Valerius} with slicked-back wine-burgundy hair, cold ice-blue eyes, ornate white-and-gold plate armour drawing ancestral Sunfire Rapier, solid gold hilt radiating searing solar flames and blistering heat waves that scorch nearby cobblestones, arrogant aristocratic face twisted in fury. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 44,
    tag: 'IMG_044',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.CASSIAN}, ${UUIDS.BRAM}`,
    scriptText: `"Insolent slum worm! Die for your insolence!" Cassian roared, thrusting the flaming blade straight toward Bram's throat with lethal, aristocratic bloodlust.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 22-year-old @{Lord Cassian Valerius} with slicked-back wine-burgundy hair and ornate white-and-gold plate armour thrusting flaming Sunfire Rapier straight toward @{Bramwell Locke}'s throat with lethal force. Bottom block: Searing flame wake trailing behind golden blade tip toward 24-year-old @{Bramwell Locke} with messy chestnut-brown hair, golden-amber eyes, rolled-up cream linen shirt. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 45,
    tag: 'IMG_045',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.CASSIAN}`,
    scriptText: `Bram did not dodge. Standing perfectly relaxed, he raised his bare right index finger and gently tapped the flat side of the blazing golden blade as it screamed past his collar.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} with messy chestnut-brown hair, golden-amber eyes, rolled-up cream linen shirt and dark brown leather artisan vest standing perfectly still without flinching, raising right index finger. Bottom block: @{Bramwell Locke}'s fingertip gently tapping flat side of blazing golden rapier blade of @{Lord Cassian Valerius} in white-and-gold armour, golden-amber eyes glowing with calm comprehension. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 46,
    tag: 'IMG_046',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.CASSIAN}`,
    scriptText: `[SOVEREIGN AUTHORITY: SEMANTIC REFACTORING EXECUTED. CONCEPT OVERWRITE: SUNFIRE ENCHANTMENT REPLACED WITH CHALK MINERAL POROSITY.] The golden flames extinguished instantly, the steel turning powdery white.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Subtle semantic refactoring glyphs flashing across blade surface between 24-year-old @{Bramwell Locke} with chestnut-brown hair and shocked 22-year-old @{Lord Cassian Valerius} with wine-burgundy hair. Bottom block: Golden solar fire instantly extinguishing, blade texture turning dull powdery matte white chalk. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 47,
    tag: 'IMG_047',
    layout: 'Tier C: Action Strip',
    charRef: UUIDS.CASSIAN,
    scriptText: `With full momentum behind his thrust, the brittle chalk blade snapped with a dry, ceramic crunch, detonating into a blinding cloud of white chalk dust that enveloped Cassian's face.`,
    prompt: `Three-panel vertical manhwa action strip. Top: 22-year-old @{Lord Cassian Valerius} with slicked-back wine-burgundy hair and white-and-gold plate armour putting full muscular weight into the thrust. Middle: The chalk rapier blade shattering violently into brittle chunks with a dry chalky snap. Bottom: Massive cloud of white chalk dust exploding into shocked face of @{Lord Cassian Valerius}. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 48,
    tag: 'IMG_048',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.CASSIAN}, ${UUIDS.BRAM}`,
    scriptText: `Cassian stood frozen, covered in ridiculous white chalk powder, gripping a bare golden hilt whilst Bram dusted off his fingers with a warm smile. "Do have a wonderful afternoon, my lord."`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: @{Lord Cassian Valerius} staring in horrified humiliation at his empty gold hilt, white chalk dust covering his wine-burgundy hair and armour. Bottom block: 24-year-old @{Bramwell Locke} with warm chestnut-brown hair, rolled-up cream linen shirt and dark brown leather artisan vest dusting off his fingers with a pleasant smile, wishing @{Lord Cassian Valerius} a wonderful afternoon. ${ZONES.SLUM_STREET} ${NEG}`
  },

  // BATCH 03 (Scenes 049 - 072) - Act 2A: Aristocratic Outrage & Slum Economic Siege
  {
    num: 49,
    tag: 'IMG_049',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.CASSIAN,
    scriptText: `Back inside the grand palace of House Valerius, Cassian knelt before his father trembling with rage and humiliation, chalk dust still caked across his polished breastplate.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 22-year-old @{Lord Cassian Valerius} kneeling on polished marble floor before towering gilded throne, wine-burgundy hair dusted with white chalk powder, humiliated scowl. Bottom block: Shadowy patriarch of House Valerius crushing a silver goblet in armored fist. ${ZONES.PALACE_DAWN} ${NEG}`
  },
  {
    num: 50,
    tag: 'IMG_050',
    layout: 'Tier B: Dual-Panel Split',
    charRef: null,
    scriptText: `The Lord Regent declared an immediate punitive quarantine over District Nine, commanding that all trade caravans, water deliveries, and food supplies to the slums be severed until the insolent craftsman was brought to heel.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Imperial noble council stamping crimson wax seals onto quarantine edict scrolls. Bottom block: Heavy iron barricades being dragged across cobblestone archways leading into District Nine. ${ZONES.GREAT_ARCH_PLAZA} ${NEG}`
  },
  {
    num: 51,
    tag: 'IMG_051',
    layout: 'Tier B: Dual-Panel Split',
    charRef: null,
    scriptText: `Heavy iron chains and enchanted padlocks were slammed across the slum's communal water pumps, leaving thousands of impoverished residents facing dehydration under the hot sun.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Armored guards chaining heavy iron padlocks around public water well winches. Bottom block: Desperate slum mothers holding empty clay water jugs in despair. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 52,
    tag: 'IMG_052',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Hearing the weeping of desperate families outside his door, Bramwell Locke walked calmly to the central well plaza, hands tucked comfortably in his vest pockets.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} walking through crowded slum square, messy chestnut-brown hair, rolled-up cream linen shirt, dark brown leather artisan vest, calm observant expression. Bottom block: Bram approaching the chained iron well winch surrounded by weeping commoners. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 53,
    tag: 'IMG_053',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Placing his hand on the massive reinforced iron padlock, Bram did not pick the lock; instead, he activated Siphon Mode, drinking the metal's core structural density directly into his sovereign ledger.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Close-up of 24-year-old @{Bramwell Locke}'s hand resting on massive rusted iron padlock, cyan mana filaments tracing along metal seams. Bottom block: Heavy iron chains crumbling into harmless fine grey dust beneath his fingers. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 54,
    tag: 'IMG_054',
    layout: 'Tier A: Hero Plate',
    charRef: UUIDS.BRAM,
    scriptText: `With a single audible snap, the enchanted chains dissolved into fine sand, clear sweet water gushing freely from the pump as the astonished crowd cheered in wild, weeping celebration.`,
    prompt: `Full-bleed cinematic hero plate. Clear sparkling water surging from the iron slum pump into clay jugs, impoverished commoners cheering and crying in joy around smiling 24-year-old @{Bramwell Locke} in rolled-up cream linen shirt, warm afternoon sun illuminating the plaza. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 55,
    tag: 'IMG_055',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: `${UUIDS.BRAM}, ${UUIDS.LINNEA}`,
    scriptText: `Returning to his shop, Bram and Linnea established a public hydration and relief station, brewing giant copper cauldrons of enchanted frost-lily tea that cured commoner illnesses upon the first sip.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} and 21-year-old @{Linnea Croft} serving steaming frost-lily tea from large copper cauldron outside shop. Bottom block: Grateful slum children and elderly commoners drinking tea, sickness fading from their faces. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 56,
    tag: 'IMG_056',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Word spread like wildfire throughout District Nine that an ordinary craftsman with a gentle smile was defying the noble monopoly with miracles in a teacup.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Long winding queue of slum residents waiting outside *Locke's Sundries & Tea* under hanging timber sign. Bottom block: Bram smiling warmly as he hands out wooden cups of restorative tea. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 57,
    tag: 'IMG_057',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.VANCE,
    scriptText: `In the upper palace citadel, reports of the miraculous commoner tea house landed on the mahogany desk of Commander Vance Sterling, the forty-eight-year-old veteran leader of the Hunter Ministry.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 48-year-old @{Commander Vance Sterling} with severe weathered jaw and silver-templed charcoal hair reading intelligence scroll by candlelight. Bottom block: Close-up of Vance's piercing gunmetal-grey eyes studying an artist sketch of smiling Bramwell Locke. ${ZONES.PALACE_DAWN} ${NEG}`
  },
  {
    num: 58,
    tag: 'IMG_058',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.VANCE,
    scriptText: `Vance rubbed his battle-scarred chin thoughtfully. "A F-Rank tool polisher refactoring ancestral artifacts into chalk? Keep three shadow observers on him, but do not intervene without my direct order."`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: @{Commander Vance Sterling} in dark steel field armor gazing out palace window at distant slum lights. Bottom block: Two hooded Hunter Ministry scouts bowing and dissolving into shadows. ${ZONES.PALACE_DAWN} ${NEG}`
  },
  {
    num: 59,
    tag: 'IMG_059',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `From his workbench window, Bram glanced casually toward the dark rooftops, immediately spotting the cloaked scouts with his enhanced perception, chuckling softly into his teacup.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} sitting at workbench, sipping tea while glancing out window, warm golden-amber eyes glowing with analytical perception runes. Bottom block: Distant hooded scouts crouching on dark slate rooftops under moonlight. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 60,
    tag: 'IMG_060',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `"Guests above the eaves," Bram murmured with a pleasant smile. "It seems our little workshop is attracting the attention of people with substantial budgets."`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Close-up of 24-year-old @{Bramwell Locke}'s confident polite smile, chestnut-brown hair, rolled-up cream linen shirt. Bottom block: System ledger window displaying 18,500 banked enhancement units. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 61,
    tag: 'IMG_061',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Yet Bram knew that if he wished to permanently break the noble grip on District Nine, he needed far more than five thousand banked units—he needed sovereign industrial scale.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} unfurling a hand-drawn map of the slum district's underground drainage catacombs. Bottom block: A glowing marker pointing toward an ancient abandoned dwarven forge. ${ZONES.LOCKE_WORKSHOP} ${NEG}`
  },
  {
    num: 62,
    tag: 'IMG_062',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Bram pocketed his brass watch, donned his dark brown artisan vest, and set out into the misty alleyways toward the forgotten subterranean foundry of the lower quarter.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} strapping leather tool pouches to his belt, rolling up cream linen sleeves. Bottom block: Stepping out into misty cobblestone slum alleyway under the midnight moon. ${ZONES.SLUM_STREET} ${NEG}`
  },
  {
    num: 63,
    tag: 'IMG_063',
    layout: 'Tier A: Hero Plate',
    charRef: null,
    scriptText: `Deep beneath the city lay the Lost Forge of Vulcanus, a colossal soot-stained subterranean cavern filled with heaps of broken, rusted swords discarded by generations of failed dungeon raids.`,
    prompt: `Full-bleed cinematic hero plate. Sprawling subterranean dwarven forge with massive stone arches, glowing embers in giant forge hearth, mountains of rusted discarded broken iron swords and shattered armor. ${ZONES.SLUM_FORGE} ${NEG}`
  },
  {
    num: 64,
    tag: 'IMG_064',
    layout: 'Tier B: Dual-Panel Split',
    charRef: null,
    scriptText: `Tending the forge was Old Man Corvus, a crippled retired dwarf blacksmith with a braided grey beard, hammering hopelessly at a cracked iron ingot with a worn wooden mallet.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Old dwarf blacksmith Corvus with braided grey beard coughing in soot-filled air, hammering iron on anvil. Bottom block: Close-up of Corvus's scarred hands and worn wooden mallet striking cold dull metal. ${ZONES.SLUM_FORGE} ${NEG}`
  },
  {
    num: 65,
    tag: 'IMG_065',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Bram walked down the stone stairs with cheerful steps, extending a respectful greeting that startled the old dwarf into dropping his hammer.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} descending stone stairs into forge, warm cheerful smile, rolled-up cream linen shirt, dark brown leather artisan vest. Bottom block: Old dwarf Corvus looking up in shock, eyes wide. ${ZONES.SLUM_FORGE} ${NEG}`
  },
  {
    num: 66,
    tag: 'IMG_066',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `"Master Corvus, I am Bramwell Locke from the tea shop above. I have come to purchase your scrap iron—all five hundred tons of it."`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} placing five bright silver coins on Corvus's soot-covered stone anvil. Bottom block: Corvus staring at the silver coins in absolute bewilderment. ${ZONES.SLUM_FORGE} ${NEG}`
  },
  {
    num: 67,
    tag: 'IMG_067',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Corvus laughed bitterly, shaking his head. "That scrap is dead slag, lad. Rusted through by demonic miasma. Not even high-elven fire can purify that rotten metal."`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Dwarf Corvus gesturing toward mountain of pitted, corroded scrap blades. Bottom block: 24-year-old @{Bramwell Locke} smiling politely as he approaches the rusted heap. ${ZONES.SLUM_FORGE} ${NEG}`
  },
  {
    num: 68,
    tag: 'IMG_068',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `"Fortunately," Bram replied smoothly, "I do not deal in purification. I deal in architecture." He rested his open palm against the base of the five-hundred-ton mountain of scrap.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} pressing palm against towering scrap pile, chestnut-brown hair, golden-amber eyes. Bottom block: A blinding web of cyan developer runes erupting across hundreds of rusted blades simultaneously. ${ZONES.SLUM_FORGE} ${NEG}`
  },
  {
    num: 69,
    tag: 'IMG_069',
    layout: 'Tier A: Hero Plate',
    charRef: UUIDS.BRAM,
    scriptText: `[SOVEREIGN HARVEST INITIATED: 1,200 WEAPON CARCASSES RECURSIVELY SIPHONED.] A monumental vortex of cyan kinetic energy erupted throughout the cavern, swirling into Bram's right hand like a miniature galaxy.`,
    prompt: `Full-bleed cinematic hero plate. Colossal whirlpool of glowing cyan mana filaments swirling through subterranean forge, siphoning into open palm of 24-year-old @{Bramwell Locke}, golden-amber eyes blazing with divine celestial runes, dwarf Corvus shielding face in absolute awe. ${ZONES.SLUM_FORGE} ${NEG}`
  },
  {
    num: 70,
    tag: 'IMG_070',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `The rusted mountain dissolved into clean, pure crystalline iron ingots as Bram's system counter went into hyperdrive: [BANK BALANCE: +45,000 ENHANCEMENT UNITS DEPOSITED].`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Mountain of scrap turning into neatly stacked piles of gleaming polished obsidian-steel ingots. Bottom block: Golden system ledger flashing +45,000 units before Bram's serene face. ${ZONES.SLUM_FORGE} ${NEG}`
  },
  {
    num: 71,
    tag: 'IMG_071',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `Bram then picked up Corvus's shattered, centuries-old dwarven warhammer from the anvil, gently tapping its rusted fracture with a single fingertip.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: 24-year-old @{Bramwell Locke} lifting heavy cracked dwarven warhammer with effortless ease. Bottom block: Bram's fingertip lightly tapping the rusted fracture line on hammer head. ${ZONES.SLUM_FORGE} ${NEG}`
  },
  {
    num: 72,
    tag: 'IMG_072',
    layout: 'Tier B: Dual-Panel Split',
    charRef: UUIDS.BRAM,
    scriptText: `[REPAIR & RE-INDEXING: ANCESTRAL DWARVEN CORE RESTORED (+30 DIVINE REINFORCEMENT).] The cracks sealed instantly with molten gold light, leaving the ancestral relic gleaming as if forged that very morning.`,
    prompt: `Dual-panel manhwa webtoon comic strip. Top block: Dwarven warhammer radiating blinding golden restoration runes, cracks knitting together seamlessly. Bottom block: Old dwarf Corvus falling to his knees, weeping tears of gratitude as he clutches his restored ancestral hammer. ${ZONES.SLUM_FORGE} ${NEG}`
  }
];
