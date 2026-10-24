import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')

const franchiseId = 'Series_04_The_Billion_Year_Sovereign'
const episodeId = 'EP03_The_Campus_Lockdown_and_The_Impostor_Sovereign'
const targetDir = path.resolve(projectRoot, '01_Franchises', franchiseId, episodeId)

export const scriptScenes = [
  // =========================================================================
  // BATCH 01 (Scenes 001 - 024): The Aftermath & The Fried Spectrometer
  // =========================================================================
  {
    id: 'IMG_001',
    text: "On the quiet park bench beside the Qindu University athletic field, the aluminium green tea can collapsed with a crisp metallic crunch beneath Lu Chen's relaxed fingers."
  },
  {
    id: 'IMG_002',
    text: "Lu Chen casually tossed the crumpled metal into the recycling bin, his hands slipping effortlessly back into the deep pockets of his oversized charcoal hoodie."
  },
  {
    id: 'IMG_003',
    text: "High in the troposphere, the thirty-thousand-metre Heaven-Earth Golden Stele continued to burn with primordial starlight, casting a divine golden haze over the campus rooftops."
  },
  {
    id: 'IMG_004',
    text: "Floating quietly before Lu Chen's eyes, the obsidian-and-gold interface of the Heavenly Dao Simulator pulsed with microscopic starlight: [HOST: LU CHEN (DAO TITLE: XIAO YAO) — GLOBAL RANK 1 CROWNED. MORTAL IDENTITY CLOAK: ACTIVE]."
  },
  {
    id: 'IMG_005',
    text: "Across the collegiate running track, hundreds of university students remained frozen on their knees, staring up at the clouds with trembling hands and tear-streaked faces."
  },
  {
    id: 'IMG_006',
    text: "The colossal title burned into the heavens like molten gold: Global Rank One, Xiao Yao, One Billion Years of Primordial Cultivation."
  },
  {
    id: 'IMG_007',
    text: "Beneath the massive stadium floodlights, fatty Wang Bao stumbled backward on the grass, his round comical eyes wide with sheer, disbelieving panic."
  },
  {
    id: 'IMG_008',
    text: "\"One billion years...\" Wang Bao whimpered, clutching his head with both hands. \"Brother Chen, did you hear that chime? Someone on this earth actually spent a billion years cultivating!\""
  },
  {
    id: 'IMG_009',
    text: "Lu Chen turned his head slightly, offering his roommate a relaxed, unbothered deadpan glance: \"I heard it. You do not need to shout in my ear, Wang Bao.\""
  },
  {
    id: 'IMG_010',
    text: "\"How can I not shout?!\" Wang Bao yelled, waving his arms toward the sky. \"The top corporate whale Ye Xingchen only has four hundred and eighty million! This Xiao Yao could turn Blue Star into gravel with a single sneeze!\""
  },
  {
    id: 'IMG_011',
    text: "Lu Chen sighed softly, gazing up at his own redacted title in the sky: \"The planet has absorbed ten billion years of primordial leylines. It will not break so easily.\""
  },
  {
    id: 'IMG_012',
    text: "Meanwhile, three hundred metres away near the university gates, three dark olive-drab tactical command vans skidded to a violent halt."
  },
  {
    id: 'IMG_013',
    text: "Heavy steel doors slammed open, and twenty Special Threat Bureau enforcers in pressurized visors rushed out, raising high-grade spirit containment barricades."
  },
  {
    id: 'IMG_014',
    text: "Commander Han Feng stepped onto the asphalt, a half-lit cigarette dangling from his lips as his tired, scarred face twisted into an expression of grim disbelief."
  },
  {
    id: 'IMG_015',
    text: "In his right hand, the military-grade Tactical Spirit Spectrometer hissed violently, emitting thick plumes of white ozone smoke from its cracked quartz casing."
  },
  {
    id: 'IMG_016',
    text: "\"Commander!\" an analyst shouted through the tactical comms. \"All celestial resonance monitors across Jiangnan province peaked at ten thousand percent before overloading!\""
  },
  {
    id: 'IMG_017',
    text: "Han Feng flicked a stray ash from his coat collar, his dark eyes narrowing at the burnt crystal dial in his grip: \"The golden stele did not lie. The entity crowned Rank One is right here on this campus.\""
  },
  {
    id: 'IMG_018',
    text: "\"Shall we declare a national martial quarantine, sir?\" the enforcer captain asked, gripping his mana rifle with trembling fingers."
  },
  {
    id: 'IMG_019',
    text: "\"Quarantine a one-billion-year sovereign?\" Han Feng scoffed dryly. \"If that primordial being decides to cough, our entire metropolitan defense grid will vaporize into atomic dust.\""
  },
  {
    id: 'IMG_020',
    text: "\"Seal the outer perimeter gates,\" Han Feng ordered sternly. \"Deploy magnetic containment ribbons. No cultivators leave, and no corporate syndicates enter until we verify the epicenter.\""
  },
  {
    id: 'IMG_021',
    text: "Far above the city, high on the rooftop observation terrace of the seventy-five-storey Starfall Tower, celestial starlight swirled with breathtaking brilliance."
  },
  {
    id: 'IMG_022',
    text: "Standing at the edge of the glass terrace, Jiang Qingxue looked up into the nocturnal sky, her elegant white designer trench coat billowing against the chilled northern breeze."
  },
  {
    id: 'IMG_023',
    text: "In her slender porcelain palm, the brass rings of the Celestial Star Astrolabe spun with frantic kinetic momentum, chiming with ancient celestial harmonics."
  },
  {
    id: 'IMG_024',
    text: "The luminous cyan crystal core of the astrolabe projected a thin, razor-sharp needle of pure starlight, pointing with mathematical precision directly toward Qindu University."
  },

  // =========================================================================
  // BATCH 02 (Scenes 025 - 048): The Iron Cordon & Campus Hysteria
  // =========================================================================
  {
    id: 'IMG_025',
    text: "The Celestial Star Astrolabe hummed with pure starlight resonance, its concentric gimbal rings aligning into a single, razor-sharp vector."
  },
  {
    id: 'IMG_026',
    text: "\"Master...\" Jiang Qingxue whispered, her sharp ice-blue phoenix eyes shimmering with absolute devotion. \"Your primordial aura cannot be hidden. You are at the university.\""
  },
  {
    id: 'IMG_027',
    text: "With a graceful step, Jiang Qingxue dissolved into a cascade of frosted cyan starlight, streaking across the night sky toward the collegiate grounds."
  },
  {
    id: 'IMG_028',
    text: "Down on the campus sports field, the wailing perimeter sirens triggered immediate chaos among the thousands of gathered students."
  },
  {
    id: 'IMG_029',
    text: "Armed Threat Bureau enforcers formed a rigid tactical perimeter around the athletic track, directing students toward the central astroturf field."
  },
  {
    id: 'IMG_030',
    text: "In the front row near the bleachers, Gu Tianyu leaned heavily against a metal railing, clutching his trembling right wrist in silent, bitter agony."
  },
  {
    id: 'IMG_031',
    text: "His designer navy blazer was covered in chalk dust, and the shattered remnants of his forty-eight-thousand-year Golden Core spirit blade lay scattered on the track like worthless gravel."
  },
  {
    id: 'IMG_032',
    text: "\"Impossible...\" Gu Tianyu hissed between his teeth, glaring across the field. \"How could a mortal university peasant shatter my syndicate's blade? It must have been a hidden treasure.\""
  },
  {
    id: 'IMG_033',
    text: "Around the perimeter fencing, ten autonomous civilian news drones hovered aggressively, their optical lenses zooming in on the glowing golden stele above the campus."
  },
  {
    id: 'IMG_034',
    text: "\"Attention all unauthorized surveillance craft!\" a military megaphone blared through the stadium speakers. \"This collegiate zone is under Level-One State Secrecy Protocol!\""
  },
  {
    id: 'IMG_035',
    text: "Three tactical enforcers raised electromagnetic pulse rifles, firing crisp blue energy darts that knocked the hovering drones out of the night sky in trailing spirals of smoke."
  },
  {
    id: 'IMG_036',
    text: "The student body gasped in collective terror, realising that the government was enforcing an unconditional information blackout on the entire university."
  },
  {
    id: 'IMG_037',
    text: "\"They are shooting down press drones!\" a panicked sophomore shrieked. \"The government wants to silence anyone who saw the One-Billion-Year Sovereign!\""
  },
  {
    id: 'IMG_038',
    text: "\"Do not talk nonsense!\" a senior proctor snapped, though his own pale hands trembled as he locked the secondary security gate. \"Remain in your cohort sectors!\""
  },
  {
    id: 'IMG_039',
    text: "Beside the running track, Gu Tianyu pulled out a high-encrypted communicator, frantically tapping the screen to dial his father at the Gu Capital Syndicate headquarters."
  },
  {
    id: 'IMG_040',
    text: "The holographic screen flickered violently before displaying a flashing red error icon: [SIGNAL COMPROMISED: TACTICAL SPIRIT JAMMING FIELD ENGAGED]."
  },
  {
    id: 'IMG_041',
    text: "\"Damn this military lockdown!\" Gu Tianyu cursed, slamming the communicator against his thigh. \"If my father does not send the elders, I will be trapped here with common peasants!\""
  },
  {
    id: 'IMG_042',
    text: "From across the bleachers, Lu Chen quietly observed Gu Tianyu's frantic tantrum, his calm obsidian eyes completely devoid of malice or concern."
  },
  {
    id: 'IMG_043',
    text: "\"Brother Chen, look at Young Master Gu,\" Wang Bao whispered, leaning close. \"He looks like he wants to murder someone. We should stay far away from him.\""
  },
  {
    id: 'IMG_044',
    text: "\"He broke his own toy against my kitchen knife,\" Lu Chen remarked softly in a dry drawl. \"Why would he be angry with anyone but his own blacksmith?\""
  },
  {
    id: 'IMG_045',
    text: "Wang Bao nearly choked on his saliva, slapping a hand over Lu Chen's mouth in sheer horror: \"Hush! Do you want the entire Gu clan hunting us for sport?!\""
  },
  {
    id: 'IMG_046',
    text: "Lu Chen gently pushed Wang Bao's chubby hand away, exhaling a calm breath into the night air: \"The Gu clan cannot afford the spiritual fuel to cross the river, let alone hunt anyone.\""
  },
  {
    id: 'IMG_047',
    text: "Before Wang Bao could question the statement, the ambient air pressure above the stadium violently plummeted, causing the stadium floodlight masts to groan on their concrete mounts."
  },
  {
    id: 'IMG_048',
    text: "A sharp, deafening sonic boom tore through the western sky, shaking the bleachers and shattering dozens of glass windows in the surrounding academic lecture halls."
  },

  // =========================================================================
  // BATCH 03 (Scenes 049 - 072): The Crimson Descent & The Impostor's Proclamation
  // =========================================================================
  {
    id: 'IMG_049',
    text: "High above the athletic field, an explosive supersonic shockwave ring blasted open the overcast clouds directly over the stadium lights."
  },
  {
    id: 'IMG_050',
    text: "A luxury crimson hover-sedan adorned with heavy gold trim and dragon insignias descended aggressively through the parted clouds, trailing brilliant violet anti-gravity plumes."
  },
  {
    id: 'IMG_051',
    text: "The powerful downdraft blasted gale-force wind across the stadium bleachers, whipping dead leaves and chalk dust across terrified students who shielded their eyes."
  },
  {
    id: 'IMG_052',
    text: "The vehicle touched down heavily on the red synthetic running track with a loud hiss of hydraulic landing struts, immediately melting the rubber matting beneath its thrusters."
  },
  {
    id: 'IMG_053',
    text: "Futuristic gull-wing doors rose smoothly upward, releasing dense billows of violet, aromatic spirit incense into the night air."
  },
  {
    id: 'IMG_054',
    text: "A young cultivator in an ornate gold-embroidered crimson trench coat stepped down, his swept-back crimson hair gleaming under the stadium floodlights."
  },
  {
    id: 'IMG_055',
    text: "Mo Yufeng sneered at the thousands of frightened students, adjusting the gold-threaded sash across his black combat turtleneck with ostentatious pride."
  },
  {
    id: 'IMG_056',
    text: "Around his athletic frame, a suffocating golden aura crackled with violent crimson sparks, announcing an eighty-five-thousand-year Peak Golden Core cultivation base."
  },
  {
    id: 'IMG_057',
    text: "The sheer spiritual weight radiated by his golden core slammed into the collegiate students like a physical wall, forcing dozens of weaker disciples to their knees."
  },
  {
    id: 'IMG_058',
    text: "\"Eighty-five thousand years!\" a faculty dean stammered, clutching his chest in dread. \"That is a Peak Golden Core realm! Who is this young master?!\""
  },
  {
    id: 'IMG_059',
    text: "With deliberate, theatrical strides, Mo Yufeng ascended the steps of the elevated proctor podium, standing tall at the center of the stadium."
  },
  {
    id: 'IMG_060',
    text: "From within his crimson coat, he retrieved an ornate golden medallion carved from dragon-crested white jade, holding it high above his head."
  },
  {
    id: 'IMG_061',
    text: "The jade medallion flared with violent crimson spirit runes, projecting a majestic golden dragon silhouette that coiled high into the stadium airspace."
  },
  {
    id: 'IMG_062',
    text: "\"Kneel, provincial mortals!\" Mo Yufeng's voice boomed across the entire collegiate valley, amplified by his Golden Core spirit pressure."
  },
  {
    id: 'IMG_063',
    text: "\"I am Mo Yufeng, eldest closed-door disciple of Lord Xiao Yao, the One-Billion-Year Primordial Sovereign crowned upon the Heavenly Dao Stele!\""
  },
  {
    id: 'IMG_064',
    text: "The proclamation struck the five thousand students and faculty members like a thunderclap, sending shockwaves of pure panic through the crowd."
  },
  {
    id: 'IMG_065',
    text: "\"The disciple of Xiao Yao?!\" students cried out, clutching their heads in disbelief. \"The Sovereign's actual heir has arrived in Qindu!\""
  },
  {
    id: 'IMG_066',
    text: "Mo Yufeng sneered down at the sea of terrified faces, intoxicated by the immediate reverence his fabricated title commanded."
  },
  {
    id: 'IMG_067',
    text: "\"My Master has emerged from a billion years of solitary primordial meditation to claim dominion over Blue Star!\" Mo Yufeng roared."
  },
  {
    id: 'IMG_068',
    text: "\"And by his supreme sovereign decree, Qindu University is now designated as the royal footstool of our heavenly lineage!\""
  },
  {
    id: 'IMG_069',
    text: "Across the astroturf field, hundreds of faculty members exchanged terrified glances, entirely paralyzed by the prospect of defying the One-Billion-Year Sovereign's disciple."
  },
  {
    id: 'IMG_070',
    text: "\"The closed-door disciple...\" an elderly cultivation professor stammered, his knees shaking uncontrollably. \"He holds the primordial crest! If we resist, the Sovereign will wipe our university from the map!\""
  },
  {
    id: 'IMG_071',
    text: "Seeing the terror in the elders' eyes, Mo Yufeng threw his head back and laughed with intoxicating arrogance, his crimson coat fluttering in the night breeze."
  },
  {
    id: 'IMG_072',
    text: "\"Dean of Qindu!\" Mo Yufeng bellowed, pointing a gilded finger at the administrative box. \"Step forward and receive your master's divine decree!\""
  },

  // =========================================================================
  // BATCH 04 (Scenes 073 - 096): The Grand Extortion & Gu Tianyu's Shameless Prostration
  // =========================================================================
  {
    id: 'IMG_073',
    text: "The Dean of Qindu University, a sixty-year-old scholar in formal academic robes, stepped forward with trembling legs, bowing deeply at the foot of the podium."
  },
  {
    id: 'IMG_074',
    text: "\"Young Master Mo...\" the Dean stammered, bowing until his nose nearly touched the asphalt. \"What does the Primordial Sovereign require of our humble provincial institution?\""
  },
  {
    id: 'IMG_075',
    text: "Mo Yufeng rested his hand on his hip, sneering down at the bowed scholar: \"To prove your university's loyalty, you will surrender ten thousand kilograms of high-grade spirit stones within the hour!\""
  },
  {
    id: 'IMG_076',
    text: "\"Ten thousand kilograms?!\" the Dean gasped in horror. \"That is the entirety of our academic treasury and three years of student research grants!\""
  },
  {
    id: 'IMG_077',
    text: "\"Are you questioning my Master's sovereign appetite?!\" Mo Yufeng barked, letting loose a pulse of golden core energy that cracked the podium concrete beneath his boots."
  },
  {
    id: 'IMG_078',
    text: "\"Furthermore,\" Mo Yufeng continued with a greedy smirk, \"you will surrender the subterranean keys to the university's ancestral spirit vein, and assign your top three female prodigies to serve as my personal attendants!\""
  },
  {
    id: 'IMG_079',
    text: "A collective shudder of outrage and despair rippled through the collegiate student body, yet no one dared utter a word against the terrifying eighty-five-thousand-year pressure."
  },
  {
    id: 'IMG_080',
    text: "Near the bleachers, Gu Tianyu's humiliated dark eyes suddenly ignited with desperate, opportunistic ambition."
  },
  {
    id: 'IMG_081',
    text: "\"The disciple of Xiao Yao...\" Gu Tianyu whispered, his heart racing violently. \"If my Gu Syndicate aligns with the One-Billion-Year Sovereign, we can crush all rival corporate clans in Jiangnan!\""
  },
  {
    id: 'IMG_082',
    text: "Abandoning all aristocratic pride, Gu Tianyu dropped to both knees on the red synthetic track, his bruised wrist forgotten as he began crawling toward the stage."
  },
  {
    id: 'IMG_083',
    text: "Like a starved hound begging for scraps from an imperial banquet, Gu Tianyu pushed past terrified students, his tailored navy blazer dragging through dust and gravel."
  },
  {
    id: 'IMG_084',
    text: "\"Young Master Mo! Divine Disciple!\" Gu Tianyu shouted in a voice thick with sycophantic desperation, prostrating flat before the podium steps."
  },
  {
    id: 'IMG_085',
    text: "Mo Yufeng paused, looking down from the elevated platform with mild amusement: \"Who is this dog barking at my boots?\""
  },
  {
    id: 'IMG_086',
    text: "\"I am Gu Tianyu, eldest scion of the Gu Capital Syndicate!\" Gu Tianyu proclaimed loudly, pressing his forehead against the cold track."
  },
  {
    id: 'IMG_087',
    text: "\"My clan pledges thirty percent of our regional assets, four high-grade pharmaceutical refineries, and fifty spirit mines to serve Lord Xiao Yao through your honorable hands!\""
  },
  {
    id: 'IMG_088',
    text: "The collegiate students stared in sickened disgust as the proud young master of the Gu family debased himself completely for corporate favor."
  },
  {
    id: 'IMG_089',
    text: "Mo Yufeng chuckled darkly, stepping down to the edge of the proctor stage with imperial arrogance."
  },
  {
    id: 'IMG_090',
    text: "With deliberate contempt, Mo Yufeng rested the polished tip of his black dragon-leather boot directly onto Gu Tianyu's bowed shoulder."
  },
  {
    id: 'IMG_091',
    text: "\"At least one mongrel in this provincial school understands how to kneel properly,\" Mo Yufeng mocked, pressing down with his foot."
  },
  {
    id: 'IMG_092',
    text: "Gu Tianyu gritted his teeth, bearing the humiliation with a groveling grin: \"To serve the One-Billion-Year lineage is my family's supreme glory, Young Master Mo!\""
  },
  {
    id: 'IMG_093',
    text: "\"Very well,\" Mo Yufeng sneered, grinding his sole against Gu Tianyu's tailored coat. \"You shall be my chief dog in Jiangnan. Start by rounding up the spirit stones from these students.\""
  },
  {
    id: 'IMG_094',
    text: "Back in the student crowd, fatty Wang Bao was shaking so violently his teeth sounded like chattering castanets."
  },
  {
    id: 'IMG_095',
    text: "\"Did you hear that, Brother Chen?!\" Wang Bao squeaked in hysterical panic, clutching his pockets protectively. \"They want our spirit stones! They will take our dorm deposit, our tuition subsidies, everything!\""
  },
  {
    id: 'IMG_096',
    text: "\"He is going to bleed us dry, and Gu Tianyu is going to be his tax collector!\" Wang Bao cried, tears forming in his wide comical eyes."
  },

  // =========================================================================
  // BATCH 05 (Scenes 097 - 120): The Dorm Gamer's Sarcasm & The Counterfeit Talisman
  // =========================================================================
  {
    id: 'IMG_097',
    text: "Standing dead still amidst the sea of terrified students, Lu Chen remained completely motionless, both hands buried comfortably inside the front pocket of his oversized charcoal hoodie."
  },
  {
    id: 'IMG_098',
    text: "His messy raven fringe shaded his calm obsidian eyes as he stared at the pompous young man grandstanding on the podium with the glowing white jade medal."
  },
  {
    id: 'IMG_099',
    text: "Lu Chen blinked once, his deadpan expression shifting into a look of quiet, profound bewilderment."
  },
  {
    id: 'IMG_100',
    text: "\"Brother Chen?\" Wang Bao whispered frantically, tugging at Lu Chen's loose hoodie sleeve. \"Why are you looking at him like he is an absolute idiot? He is an eighty-five-thousand-year Golden Core monster!\""
  },
  {
    id: 'IMG_101',
    text: "\"He could incinerate our entire dormitory block with a single wave of his finger!\" Wang Bao pleaded, trying to pull Lu Chen down into a crouch."
  },
  {
    id: 'IMG_102',
    text: "Lu Chen did not budge an inch, his posture relaxed and immovable like an ancient primordial mountain rooted in the earth."
  },
  {
    id: 'IMG_103',
    text: "Lu Chen tilted his head slightly, speaking in a calm, rhythmic drawl: \"Wang Bao, let me ask you a sincere, intellectual question.\""
  },
  {
    id: 'IMG_104',
    text: "\"What question?!\" Wang Bao wailed quietly. \"We need to hide our student bank cards before Gu Tianyu starts searching our pockets!\""
  },
  {
    id: 'IMG_105',
    text: "<!-- SHORT_EARLY_START --> Lu Chen began slowly, pacing half a step with hands still in his pockets: \"If an ordinary university student sat alone in a dark dormitory room for ten uninterrupted years...\""
  },
  {
    id: 'IMG_106',
    text: "\"...silently clicking an archaic, free-to-play idle browser cultivation simulator while working night shifts at a convenience store...\""
  },
  {
    id: 'IMG_107',
    text: "\"...and during those ten years of clicking daily quest buttons, he never joined a clan, never spent real money, and never talked to a single soul...\""
  },
  {
    id: 'IMG_108',
    text: "\"...at what precise point during those ten years of daily server resets did he take an ostentatious crimson parrot as a personal closed-door disciple?\""
  },
  {
    id: 'IMG_109',
    text: "Wang Bao stared at Lu Chen in complete, hysterical confusion, his round eyes blinking rapidly: \"A... a crimson parrot? Brother Chen, are you having a fever dream from the spiritual pressure?!\""
  },
  {
    id: 'IMG_110',
    text: "\"Why are you talking about browser games and parrots right now?!\" Wang Bao whispered frantically. \"The man is holding the sacred crest of Xiao Yao!\""
  },
  {
    id: 'IMG_111',
    text: "Lu Chen sighed softly, gazing at the ostentatious dragon medallion reflecting in Mo Yufeng's arrogant hands: \"That crest was made in a suburban workshop with cheap copper alloy and red glitter powder.\""
  },
  {
    id: 'IMG_112',
    text: "Right before Lu Chen's eyes, the obsidian glass HUD of the Heavenly Dao Simulator Interface silently flared into existence, invisible to all surrounding mortals."
  },
  {
    id: 'IMG_113',
    text: "Minimalist golden glyphs scrolled crisply across the floating interface: [SYSTEM QUERY: LINEAGE REGISTRY — REGISTERED DISCIPLES: ZERO]."
  },
  {
    id: 'IMG_114',
    text: "[DETECTED TARGET 'MO YUFENG' — FABRICATED LINEAGE / COUNTERFEIT TALISMAN. ANALYSIS: INSCRIBED WITH LOW-GRADE THREE-HUNDRED-YEAR FIRE RUNES. REVERSE COPIED FROM A TOURIST SOUVENIR]."
  },
  {
    id: 'IMG_115',
    text: "A subtle scanning reticle locked onto Mo Yufeng's chest with a comical yellow warning box: [THREAT LEVEL: NEGLIGIBLE / EXTERMINATION ENERGY REQUIRED: 0.000001%]."
  },
  {
    id: 'IMG_116',
    text: "Lu Chen shook his head gently with closed eyes, letting out a tired, amused chuckle: \"People truly have no shame these days.\" <!-- SHORT_EARLY_END -->"
  },
  {
    id: 'IMG_117',
    text: "Before Wang Bao could reply, the heavy thump of tactical combat boots echoed from the stadium tunnel."
  },
  {
    id: 'IMG_118',
    text: "A sharp warning flare erupted into the night sky from a tactical rifle, illuminating the stadium field in vivid phosphorus white light and red sparks."
  },
  {
    id: 'IMG_119',
    text: "Ten heavily armored Threat Bureau tactical enforcers emerged in rigid formation, raising carbon riot shields and heavy mana suppression cannons."
  },
  {
    id: 'IMG_120',
    text: "At the head of the squad, Commander Han Feng marched forward, exhaling a thick plume of grey cigarette smoke from between clenched teeth."
  },

  // =========================================================================
  // BATCH 06 (Scenes 121 - 144): The Threat Bureau Standoff & The Heavy Cannons
  // =========================================================================
  {
    id: 'IMG_121',
    text: "Commander Han Feng halted fifteen paces from the proctor's podium, his scarred face grim and unyielding beneath the harsh stadium floodlights."
  },
  {
    id: 'IMG_122',
    text: "\"That is quite enough theatrics, Young Master Mo,\" Han Feng said coldly, his voice cutting through the ambient student panic."
  },
  {
    id: 'IMG_123',
    text: "Mo Yufeng turned his sneer toward the military commander, crossing his arms over his gold-embroidered coat with supreme arrogance."
  },
  {
    id: 'IMG_124',
    text: "\"Commander Han of the Threat Bureau,\" Mo Yufeng mocked. \"You dare interrupt the divine emissary of Xiao Yao Tianzun with a squad of mortal dogs?\""
  },
  {
    id: 'IMG_125',
    text: "\"I am interrupting a fraud,\" Han Feng replied flatly, raising his right hand to display the cracked, smoking casing of the Tactical Spirit Spectrometer."
  },
  {
    id: 'IMG_126',
    text: "\"Ten minutes ago, the primordial entity that claimed Rank One released an energy spike that fried state sensors across three prefectures,\" Han Feng stated."
  },
  {
    id: 'IMG_127',
    text: "\"Its kinetic frequency was purely primordial, beyond all celestial classification,\" Han Feng continued, stepping closer to the stage."
  },
  {
    id: 'IMG_128',
    text: "\"Your medallion emits cheap Golden Core fire runes forged in a Northern underground workshop,\" Han Feng declared with razor-sharp authority."
  },
  {
    id: 'IMG_129',
    text: "Mo Yufeng's eyes narrowed dangerously, a blue vein pulsing violently beneath his crimson temple: \"You insolent old mongrel! You dare accuse the Sovereign's disciple of forgery?!\""
  },
  {
    id: 'IMG_130',
    text: "\"Show me your Master's official authorization registered in the State Cultivator Database,\" Han Feng demanded."
  },
  {
    id: 'IMG_131',
    text: "Behind the commander, ten tactical enforcers simultaneously cocked their heavy suppression cannons, aiming glowing blue charge coils directly at Mo Yufeng's chest."
  },
  {
    id: 'IMG_132',
    text: "From his groveling position on the track, Gu Tianyu scrambled to his feet, pointing a trembling finger at the commander: \"Han Feng, you fool! You are bringing total annihilation upon Qindu!\""
  },
  {
    id: 'IMG_133',
    text: "\"Silence, Gu Tianyu!\" Han Feng barked without looking back. \"Your clan's treasonous groveling will be dealt with by the Ministry of Justice tomorrow morning.\""
  },
  {
    id: 'IMG_134',
    text: "Mo Yufeng's face flushed with furious crimson anger, his fingers clenching into fists as his eighty-five-thousand-year Golden Core aura flared violently."
  },
  {
    id: 'IMG_135',
    text: "\"You think a few tungsten mana cannons can threaten a disciple of the Primordial Sovereign?!\" Mo Yufeng roared."
  },
  {
    id: 'IMG_136',
    text: "Violent sparks of crimson fire erupted around Mo Yufeng's gold-threaded sash, scorching the concrete podium into black glass."
  },
  {
    id: 'IMG_137',
    text: "The ten tactical enforcers braced their heavy boots against the track as the crushing Golden Core gravity pressed down upon their pressurized helmets."
  },
  {
    id: 'IMG_138',
    text: "\"Fire on my mark if he advances!\" Han Feng shouted, reaching for the sidearm holster at his waist."
  },
  {
    id: 'IMG_139',
    text: "In the bleachers, thousands of collegiate students ducked beneath the metal benches, preparing for a devastating military firefight."
  },
  {
    id: 'IMG_140',
    text: "Wang Bao buried his head in his knees, praying frantically: \"Heavenly ancestors, protect my meal vouchers, protect my dorm room...\""
  },
  {
    id: 'IMG_141',
    text: "Lu Chen remained standing tall, his obsidian eyes watching the tension build with cold, amused detachment."
  },
  {
    id: 'IMG_142',
    text: "\"The cannons will shatter his superficial fire barrier in three seconds,\" Lu Chen noted internally. \"But his secondary talisman contains a suicidal soul-poison rune.\""
  },
  {
    id: 'IMG_143',
    text: "Just as Mo Yufeng prepared to unleash his Golden Core flames, an abrupt, unnatural stillness enveloped the entire stadium."
  },
  {
    id: 'IMG_144',
    text: "The roar of the wind vanished, the wailing perimeter sirens cut out mid-frequency, and the air turned painfully, breathlessly cold."
  },

  // =========================================================================
  // BATCH 07 (Scenes 145 - 168): The Glacial Saint Descends & The Arctic Verdict
  // =========================================================================
  {
    id: 'IMG_145',
    text: "The ambient temperature across the entire collegiate stadium plummeted by thirty degrees in a single fraction of a second."
  },
  {
    id: 'IMG_146',
    text: "Crystalline lotus frost patterns flash-froze outward across the red synthetic track, glistening with diamond-hard glacial luminescence under the night floodlights."
  },
  {
    id: 'IMG_147',
    text: "Delicate ice crystals blossomed across the metal bleacher handrails, while the breath of five thousand collegiate spectators turned into plumes of dense white vapour."
  },
  {
    id: 'IMG_148',
    text: "From the moonlit sky above, a monumental vertical pillar of pure cyan starlight descended directly onto the center of the athletic field."
  },
  {
    id: 'IMG_149',
    text: "The descending pillar parted the storm clouds with breathtaking elegance, casting an ethereal aurora across the campus."
  },
  {
    id: 'IMG_150',
    text: "Stepping gracefully from the falling starlight mist, Jiang Qingxue emerged onto the frozen turf, her white designer trench coat trailing wisps of cyan frost."
  },
  {
    id: 'IMG_151',
    text: "Her silk-black hair shimmering with frosted silver tips cascaded over her shoulders, and her razor-sharp ice-blue phoenix eyes swept across the stadium with imperial indifference."
  },
  {
    id: 'IMG_152',
    text: "Around her slender silhouette, an overwhelming two-hundred-and-sixty-million-year Saint Realm pressure radiated like an ancient arctic mountain range."
  },
  {
    id: 'IMG_153',
    text: "\"Global Rank Three...\" Commander Han Feng gasped, his cigarette tumbling from his lips as his knees buckled slightly under the unfathomable Saint Realm gravity."
  },
  {
    id: 'IMG_154',
    text: "The ten tactical enforcers behind him instantly dropped to one knee as their heavy suppression cannon barrels froze over with solid, unyielding ice."
  },
  {
    id: 'IMG_155',
    text: "\"Fairy Qingxue!\" collegiate students cried in reverent awe, many weeping openly as the legendary prodigy of Jiangnan walked past their bleachers."
  },
  {
    id: 'IMG_156',
    text: "Jiang Qingxue did not spare a single glance at the weeping crowd, her gaze locked with absolute, laser-sharp focus upon the podium."
  },
  {
    id: 'IMG_157',
    text: "Mo Yufeng's arrogant sneer faltered completely, his heart skipping three beats as his eighty-five-thousand-year Golden Core aura shrunk into a flickering ember before her two hundred and sixty million."
  },
  {
    id: 'IMG_158',
    text: "A heavy bead of cold sweat trickled down Mo Yufeng's temple, yet he desperately forced his trembling face into a slimy, rehearsed smile."
  },
  {
    id: 'IMG_159',
    text: "\"Senior Sister Qingxue!\" Mo Yufeng cried, offering a stiff martial salute from the stage. \"I see you too have arrived to honor our Master's glorious ascension!\""
  },
  {
    id: 'IMG_160',
    text: "Jiang Qingxue stopped five paces from the podium, her cold, aloof gaze piercing through Mo Yufeng like twin frozen daggers."
  },
  {
    id: 'IMG_161',
    text: "\"Senior Sister?\" Jiang Qingxue spoke softly, yet her voice echoed through the freezing air with the authority of an arctic tempest."
  },
  {
    id: 'IMG_162',
    text: "\"I accompanied Master Xiao Yao through three thousand simulated epochs in the Heavenly Dao realm,\" Jiang Qingxue said, her frost mist condensing in her palm."
  },
  {
    id: 'IMG_163',
    text: "\"I stood by his side as he cultivated the infinite samsara across uncounted kalpas, refining the primordial dao of reality itself.\""
  },
  {
    id: 'IMG_164',
    text: "\"And throughout all three thousand epochs, Master never once accepted a single mortal disciple,\" she stated with chilling finality."
  },
  {
    id: 'IMG_165',
    text: "\"Who gave a shameless, thieving dog like you permission to sully his sacred title?\" Jiang Qingxue demanded, stepping forward as frost cracked the podium."
  },
  {
    id: 'IMG_166',
    text: "The verbal condemnation stripped away Mo Yufeng's final shred of composure, exposing him as a cornered, unmasked fraud before five thousand witnesses."
  },
  {
    id: 'IMG_167',
    text: "Gu Tianyu collapsed flat on his stomach, clutching his head in sheer existential horror: \"A fake... he is an impostor... my family's assets...\""
  },
  {
    id: 'IMG_168',
    text: "Trapped between Han Feng's frozen cannons and Jiang Qingxue's suffocating Saint Realm aura, Mo Yufeng's face twisted into vicious, unhinged madness."
  },

  // =========================================================================
  // BATCH 08 (Scenes 169 - 192): The Berserk Blood Pill & The Roaring 40m Sword-Beam
  // =========================================================================
  {
    id: 'IMG_169',
    text: "\"Lies! All of you are envious of my supreme destiny!\" Mo Yufeng shrieked, backing against the stage railing like a rabid animal."
  },
  {
    id: 'IMG_170',
    text: "From inside his golden-threaded sash, Mo Yufeng retrieved a pitch-black demonic pill pulsing with virulent crimson veins."
  },
  {
    id: 'IMG_171',
    text: "\"A Nine-Turn Berserk Asura Pill!\" Commander Han Feng shouted in alarm. \"He is attempting a suicidal realm breakthrough! Enforcers, fall back!\""
  },
  {
    id: 'IMG_172',
    text: "Mo Yufeng swallowed the black pill whole, his bloodshot amber eyes turning completely crimson as black veins erupted across his neck and jaw."
  },
  {
    id: 'IMG_173',
    text: "His eighty-five-thousand-year Golden Core aura erupted with violent, murderous combustion, surging past one hundred thousand years in a torrent of demonic flame."
  },
  {
    id: 'IMG_174',
    text: "Synthetic turf, rubber foundations, and metallic proctor rails vaporized into ash beneath his dragon-leather boots as he drew a heavy gilded spirit broadsword from his waist."
  },
  {
    id: 'IMG_175',
    text: "The massive curved steel blade, inscribed with counterfeit dragon runes, ignited with roaring crimson fire that towered twenty metres into the night air."
  },
  {
    id: 'IMG_176',
    text: "\"If you will not bow to my Master's crest,\" Mo Yufeng screamed in berserk delirium, \"then I will slaughter this entire school and bathe my blade in mortal blood!\""
  },
  {
    id: 'IMG_177',
    text: "His bloodshot eyes darted across the front bleachers, locking with psychotic malice directly onto fatty Wang Bao!"
  },
  {
    id: 'IMG_178',
    text: "\"Starting with you, fat pig!\" Mo Yufeng roared, raising his blazing broadsword with both hands above his head."
  },
  {
    id: 'IMG_179',
    text: "Mo Yufeng swung the gilded blade downward with full, unhinged lethal momentum, unleashing a colossal forty-metre crescent sword-beam of searing crimson fire."
  },
  {
    id: 'IMG_180',
    text: "The flaming crescent tore through the air with a supersonic shriek, vaporizing the athletic track and melting asphalt as it roared straight toward the bleachers."
  },
  {
    id: 'IMG_181',
    text: "\"Brother Chen, save me!\" Wang Bao shrieked in mortal terror, falling flat on his back and covering his face with his trembling arms."
  },
  {
    id: 'IMG_182',
    text: "Commander Han Feng raised his heavy sidearm, firing three consecutive spirit-piercing rounds, but the bullets dissolved into slag upon touching the forty-metre inferno."
  },
  {
    id: 'IMG_183',
    text: "\"Get down!\" Han Feng roared, throwing himself over two junior enforcers."
  },
  {
    id: 'IMG_184',
    text: "Thirty metres away across the field, Jiang Qingxue's ice-blue eyes widened in profound horror."
  },
  {
    id: 'IMG_185',
    text: "Jiang Qingxue thrust both palms forward, conjuring a towering wall of crystalline glacial lotus barriers across the turf."
  },
  {
    id: 'IMG_186',
    text: "However, she was thirty metres away on the opposite side of the stage; the supersonic sword-beam was already ten feet from the bleachers!"
  },
  {
    id: 'IMG_187',
    text: "\"Too late!\" Jiang Qingxue gasped, her heart clenching as she realised the innocent students in the front row would be vaporized into ash."
  },
  {
    id: 'IMG_188',
    text: "Hundreds of students shut their eyes, screaming in helpless terror as the searing heatwave singed their hair and clothing."
  },
  {
    id: 'IMG_189',
    text: "Yet standing dead center of the lethal trajectory, one solitary figure did not flinch."
  },
  {
    id: 'IMG_190',
    text: "Lu Chen stood tall and serene, his soft raven fringe barely stirring in the incoming wall of flame."
  },
  {
    id: 'IMG_191',
    text: "His calm obsidian eyes radiated an ancient, cold primordial stillness, gazing into the oncoming inferno as though looking at a child blowing soap bubbles."
  },
  {
    id: 'IMG_192',
    text: "With effortless, languid grace, Lu Chen slowly drew his left hand from the pocket of his oversized charcoal hoodie."
  },

  // =========================================================================
  // BATCH 09 (Scenes 193 - 216): The Sovereign Tap (0.0001%) & The 30m Crater Cleave
  // =========================================================================
  {
    id: 'IMG_193',
    text: "Lu Chen extended a single relaxed left index finger into the roaring wall of fire, stopping three inches before his chest."
  },
  {
    id: 'IMG_194',
    text: "With casual, unhurried precision, Lu Chen lightly tapped the empty air in front of him."
  },
  {
    id: 'IMG_195',
    text: "<!-- CLIMAX_START --> In that singular microsecond, Lu Chen released a mere 0.0001% of his one-billion-year primordial cultivation base."
  },
  {
    id: 'IMG_196',
    text: "Within his dantian, the infinite cosmic ocean of celestial galaxies turned an infinitesimal fraction of a millimetre."
  },
  {
    id: 'IMG_197',
    text: "A concentric circular ripple of warm golden starlight, infinitely subtle yet heavier than ten thousand continental mountain ranges, expanded outward from his fingertip."
  },
  {
    id: 'IMG_198',
    text: "The roaring forty-metre crimson sword-beam froze completely dead in mid-air upon contacting the microscopic golden ripple."
  },
  {
    id: 'IMG_199',
    text: "The lethal inferno did not explode; instead, its violent crimson flames instantly disintegrated into delicate, harmless golden firefly embers that drifted gently onto the grass."
  },
  {
    id: 'IMG_200',
    text: "An invisible gravitational shockwave surged backward along the exact trajectory of the attack, moving at hypersonic speed toward the elevated stage."
  },
  {
    id: 'IMG_201',
    text: "The shockwave struck the blade of Mo Yufeng's gilded spirit broadsword with absolute, mathematical physical finality."
  },
  {
    id: 'IMG_202',
    text: "The high-grade broadsword did not crack—it shattered into a billion microscopic steel particles, vaporizing into a cloud of grey iron dust before Mo Yufeng's bulging eyes."
  },
  {
    id: 'IMG_203',
    text: "The overwhelming kinetic gravity slammed Mo Yufeng violently face-first into the athletic track with catastrophic concussive force."
  },
  {
    id: 'IMG_204',
    text: "The impact carved a perfect thirty-metre circular crater into the concrete foundation, sending spiderweb fracture fissures tearing across the tartan track and bleacher foundations."
  },
  {
    id: 'IMG_205',
    text: "Mo Yufeng's forged dragon-crested white jade medallion exploded into fine white chalk powder beneath his crushed ribs."
  },
  {
    id: 'IMG_206',
    text: "Pinned flat against the crater floor by invisible primordial gravity, Mo Yufeng coughed up mouthfuls of black blood, his berserk aura extinguished like a candle in a typhoon."
  },
  {
    id: 'IMG_207',
    text: "Lu Chen stood tall on the cracked concrete lip of the crater, his hands comfortably buried back inside his oversized charcoal hoodie pockets."
  },
  {
    id: 'IMG_208',
    text: "Lu Chen looked down at the whimpering, broken impostor with complete deadpan apathy: \"Next time you forge my signature, at least spell my Dao title correctly.\" <!-- CLIMAX_END -->"
  },
  {
    id: 'IMG_209',
    text: "The entire collegiate stadium plunged into absolute, terrified silence."
  },
  {
    id: 'IMG_210',
    text: "The silence was so heavy that only the fluttering of the torn collegiate flags in the night breeze could be heard across five thousand frozen spectators."
  },
  {
    id: 'IMG_211',
    text: "Commander Han Feng slowly stood up from the turf, his mouth agape as he stared at the thirty-metre circular crater in utter, military shock."
  },
  {
    id: 'IMG_212',
    text: "\"A single finger...\" Han Feng whispered, his voice trembling as he looked at the casual university student standing beside the abyss. \"He deflected a berserk Golden Core strike and flattened the track with a single finger...\""
  },
  {
    id: 'IMG_213',
    text: "On the ground behind Lu Chen, fatty Wang Bao opened one eye, seeing the crater where the flaming sword had been: \"Brother Chen... did... did a meteor hit him?!\""
  },
  {
    id: 'IMG_214',
    text: "Across the frozen field, Jiang Qingxue stood completely frozen mid-stride, her beautiful ice-blue phoenix eyes widening to their absolute limit."
  },
  {
    id: 'IMG_215',
    text: "In her trembling palm, the Celestial Star Astrolabe spun with deafening, blinding resonance, radiating brilliant cyan starlight vectors pointing straight at Lu Chen's charcoal hoodie."
  },
  {
    id: 'IMG_216',
    text: "\"That effortless stillness... that singular primordial authority...\" Jiang Qingxue breathed, tears of overwhelming reverence welling in her eyes. \"Master?!\""
  },

  // =========================================================================
  // BATCH 10 (Scenes 217 - 240): The Grand Aftermath, Dorm 404 Noodles & The Starfall Fleet
  // =========================================================================
  {
    id: 'IMG_217',
    text: "Jiang Qingxue took an urgent step forward, frost trailing behind her heels as she reached out toward the young man in the charcoal hoodie: \"Master Xiao Yao!\""
  },
  {
    id: 'IMG_218',
    text: "Commander Han Feng shouted into his radio: \"Emergency protocol! Secure the perimeter around the student in the black hoodie! Do not fire, I repeat, do not fire!\""
  },
  {
    id: 'IMG_219',
    text: "But before Jiang Qingxue or the tactical enforcers could advance ten paces, Lu Chen offered a faint, relaxed smirk."
  },
  {
    id: 'IMG_220',
    text: "Lu Chen turned smoothly on his heel, taking a leisurely step toward the brick archway of the collegiate library pavilion."
  },
  {
    id: 'IMG_221',
    text: "With that single relaxed stride, Lu Chen's silhouette seemed to blur across space-time, gracefully dissolving into the sea of murmuring, confused collegiate students."
  },
  {
    id: 'IMG_222',
    text: "\"Wait! Master!\" Jiang Qingxue cried, streaking forward in a flash of cyan starlight, arriving at the library pavilion within half a second."
  },
  {
    id: 'IMG_223',
    text: "Yet the archway was empty, save for the faint scent of fresh nocturnal rain and a drifting mote of warm golden starlight that dissolved upon her fingertip."
  },
  {
    id: 'IMG_224',
    text: "Jiang Qingxue clutched the Celestial Star Astrolabe against her chest, a soft, devoted smile breaking through her cold expression: \"You are still watching over this world, Master. I will find you.\""
  },
  {
    id: 'IMG_225',
    text: "Back on the athletic track, Commander Han Feng stared at the whimpering Mo Yufeng pinned at the bottom of the thirty-metre crater."
  },
  {
    id: 'IMG_226',
    text: "\"Commander!\" the enforcer captain shouted, jogging up. \"The media helicopters are demanding entry! What do we report to the Hunter Ministry?!\""
  },
  {
    id: 'IMG_227',
    text: "Han Feng lit a fresh cigarette with shaking hands, exhaling a thick cloud of smoke: \"Class-One State Denial. Report that an experimental military capacitor experienced a catastrophic overload during a training exercise.\""
  },
  {
    id: 'IMG_228',
    text: "\"And the student in the hoodie, sir?\" the captain asked."
  },
  {
    id: 'IMG_229',
    text: "Han Feng glared into the night sky, his scarred jaw tight: \"If you value your life and your family's future, you never saw a student in a black hoodie tonight.\""
  },
  {
    id: 'IMG_230',
    text: "Meanwhile, twenty minutes later across the campus, the door to Dormitory Room 404 clicked softly shut."
  },
  {
    id: 'IMG_231',
    text: "Fatty Wang Bao collapsed onto his bunk bed like a deflated balloon, his hands still trembling as he clutched a plastic cup of instant beef noodles."
  },
  {
    id: 'IMG_232',
    text: "\"Brother Chen...\" Wang Bao stammered, staring wide-eyed at Lu Chen. \"Tell me the truth. Did you see what happened out there? Was it really a military test?\""
  },
  {
    id: 'IMG_233',
    text: "Lu Chen took off his sneakers, placing them neatly beside the dorm door with total domestic routine: \"Commander Han said it was a capacitor malfunction. Who are we to question the military?\""
  },
  {
    id: 'IMG_234',
    text: "\"Right... a capacitor malfunction...\" Wang Bao muttered, scratching his head. \"Though I could have sworn you raised your hand right before the stadium exploded...\""
  },
  {
    id: 'IMG_235',
    text: "Lu Chen walked over to the small electric kettle on their dorm desk, which was unplugged from the wall socket."
  },
  {
    id: 'IMG_236',
    text: "Lu Chen tapped the kettle gently with his index finger; an invisible microscopic spark of primordial starlight passed through the stainless steel, instantly boiling the water with a soft hiss of aromatic steam."
  },
  {
    id: 'IMG_237',
    text: "\"The water is ready, Wang Bao. Pour your noodles before they get soggy,\" Lu Chen said in a calm, rhythmic drawl, handing Wang Bao the steaming kettle."
  },
  {
    id: 'IMG_238',
    text: "Wang Bao took the kettle with a bewildered grin, completely oblivious to the impossible physics, happily pouring hot water over his noodles: \"Brother Chen, you really are the best roommate on campus!\""
  },
  {
    id: 'IMG_239',
    text: "Far across the metropolis, high in the 75th-floor penthouse of Starfall Tower, corporate oligarch Ye Xingchen stared at a holographic radar terminal displaying a Category Ten Primordial Energy Spike in Qindu District."
  },
  {
    id: 'IMG_240',
    text: "Ye Xingchen's regal golden eyes narrowed with cold, predatory obsession as a swirling purple cosmic starlight halo flared behind his tailored three-piece suit: \"Order the Black Dragon Fleet to blockade Jiangnan province. The hunt for the One-Billion-Year Sovereign begins tonight.\""
  }
]

console.log('Total scenes drafted:', scriptScenes.length)

// Format into 01_Episode_Script.md
let content = `# 🎬 Series 04: The Billion-Year Sovereign (Reality Convergence)
## 📦 Episode 03: The Campus Lockdown & The Impostor Sovereign (Arc 1 Climax)

> **Franchise Code:** \`FRAN-BYS-001\`  
> **Parent Arc:** Arc 1: The Convergence & The Qindu Campus Awakening (Climax)  
> **Episode Number:** EP03  
> **Video Format:** Format 1: 9:16 Vertical Webtoon (1080x1920)  
> **Audio Voice:** \`en-GB-RyanNeural\`  
> **Total Scenes:** 240 Scenes (Batches 01–10)  
> **Continuity Anchor:** Seamless 1:1 continuation from Episode 02 terminal scene (Lu Chen at Qindu campus park bench crushing tea can).

---
`

const batchNames = [
  'The Aftermath & The Fried Spectrometer',
  'The Iron Cordon & Campus Hysteria',
  'The Crimson Descent & The Impostor\'s Proclamation',
  'The Grand Extortion & Gu Tianyu\'s Shameless Prostration',
  'The Dorm Gamer\'s Sarcasm & The Counterfeit Talisman',
  'The Threat Bureau Standoff & The Heavy Cannons',
  'The Glacial Saint Descends & The Arctic Verdict',
  'The Berserk Blood Pill & The Roaring 40m Sword-Beam',
  'The Sovereign Tap (0.0001%) & The 30m Crater Cleave',
  'The Grand Aftermath, Dorm 404 Noodles & The Starfall Fleet'
]

for (let b = 0; b < 10; b++) {
  const start = b * 24
  const end = start + 24
  const batchScenes = scriptScenes.slice(start, end)
  const padStart = String(start + 1).padStart(3, '0')
  const padEnd = String(end).padStart(3, '0')
  const bNum = String(b + 1).padStart(2, '0')

  content += `\n## 📦 BATCH ${bNum} (Scenes ${padStart} - ${padEnd}): ${batchNames[b]}\n\n`
  for (const s of batchScenes) {
    content += `[${s.id}] ${s.text}\n\n`
  }
  content += `---\n`
}

fs.writeFileSync(path.join(targetDir, '01_Episode_Script.md'), content, 'utf8')
console.log('✓ Successfully wrote 240-scene 01_Episode_Script.md')
