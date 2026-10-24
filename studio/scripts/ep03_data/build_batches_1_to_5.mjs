import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { scriptScenes } from './generate_ep03_script.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================================================
// BATCH 01 DATA (Scenes 001 - 024)
// ============================================================================
export const b01Scenes = [
  {
    id: 'IMG_001',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium shot of \${DNA.LU_CHEN} sitting calmly on a wooden bench beside the athletic track under night floodlights, \${ATTIRE.LU_CHEN}. In the lower panel, extreme close-up of @{Lu Chen}'s relaxed fingers effortlessly crushing a green aluminium tea can with zero physical exertion. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_002',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, low-angle shot of @{Lu Chen} tossing the crushed aluminium can into a campus recycling bin with casual unhurried precision, \${ATTIRE.LU_CHEN}. In the lower panel, @{Lu Chen} burying both hands deep inside the front pouch pocket of his oversized charcoal hoodie with loose sleeves covering wrists, relaxed unbothered posture. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_003',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Heaven-Earth Golden Stele'],
    prompt: `Full-bleed cinematic hero plate. Low-angle monumental perspective gazing up from university grounds into dark clouds: the colossal 30,000-metre obsidian-and-gold @{Heaven-Earth Golden Stele} floating motionless in the night sky, divine golden runes radiating down its axis, iridescent violet and golden starlight halos casting majestic golden glow across campus rooftops and glass academic towers. \${SPATIAL.STRATOSPHERE_STELE} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_004',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Heavenly Dao Simulator Interface'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium close-up of \${DNA.LU_CHEN} gazing calmly at eye level, \${ATTIRE.LU_CHEN}. In the lower panel, translucent dark obsidian-glass HUD of @{Heavenly Dao Simulator Interface} floating in mid-air before @{Lu Chen}, delicate golden Dao glyphs displaying [HOST: LU CHEN (DAO TITLE: XIAO YAO) — GLOBAL RANK 1 CROWNED. MORTAL IDENTITY CLOAK: ACTIVE] with cyan circuit traces. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_005',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Wide dramatic perspective of the grand athletic running track at night: hundreds of diverse collegiate students and young cultivators in athletic streetwear frozen on their knees on red tartan track, trembling hands raised toward glowing night sky in reverent shock, tear-streaked faces illuminated by golden celestial light from above. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_006',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Heaven-Earth Golden Stele'],
    prompt: `Full-bleed cinematic hero plate. Extreme low-angle perspective of the heavens directly beneath colossal @{Heaven-Earth Golden Stele}: monumental golden seal script three thousand metres tall burning into dark troposphere displaying Global Rank One, Xiao Yao, One Billion Years of Primordial Cultivation, radiating blinding celestial gold and violet starlight across planetary stratosphere. \${SPATIAL.STRATOSPHERE_STELE} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_007',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, wide shot of collegiate athletic field under bright LED floodlights, \${DNA.WANG_BAO} in \${ATTIRE.WANG_BAO} stumbling backward on green lawn, tripping over sneakers. In the lower panel, extreme close-up of @{Wang Bao}'s pale round face, comical wide eyes dilated in absolute terror, trembling hands grabbing red graphic t-shirt. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_008',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, tight shot of @{Wang Bao} clutching both sides of his head in \${ATTIRE.WANG_BAO}, hair ruffled in panic. In the lower panel, ground-level tracking shot of @{Wang Bao}'s knees knocking together in disbelief. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_009',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, two-shot proscenium: on screen left, @{Wang Bao} waving arms frantically in \${ATTIRE.WANG_BAO}; on screen right, \${DNA.LU_CHEN} sitting unbothered on bench in \${ATTIRE.LU_CHEN}. In the lower panel, close-up of @{Lu Chen}'s deadpan half-lidded obsidian eyes and unbothered posture, soft raven bangs over forehead. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_010',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, dynamic dramatic angle of @{Wang Bao} pointing both hands dramatically at the celestial clouds, comical horrified expression in \${ATTIRE.WANG_BAO}. In the lower panel, close-up of @{Wang Bao}'s wide mouth and sweaty face under stadium floodlights. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_011',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, low-angle intimate portrait of \${DNA.LU_CHEN} standing up from wooden bench, clean oversized charcoal hoodie loose around shoulders, \${ATTIRE.LU_CHEN}. In the lower panel, @{Lu Chen} exhaling a faint sigh into chilled night air, calm gaze fixed on starry horizon. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_012',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Low-angle dynamic tracking shot outside North gates of Qindu University: three dark olive-drab tactical command carriers with spirit dishes skidding onto asphalt, tires smoking, blue-red emergency strobe lights flashing across metropolitan concrete barriers. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_013',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, hydraulic doors of tactical vans hissing open, twenty armed enforcers in matte-black tactical gear and pressurized reflective visors filing out in combat formation. In the lower panel, enforcers planting magnetic spirit containment pylons along campus perimeter, projecting luminous violet barrier ribbons. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_014',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, low-angle view of \${DNA.HAN_FENG} stepping out from command van onto asphalt, dark olive-drab tactical military trench coat billowing, \${ATTIRE.HAN_FENG}. In the lower panel, close-up of @{Commander Han Feng}'s scarred face, lit cigarette clamped between lips, tired grim eyes narrowing under flashing emergency lights. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_015',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Tactical Spirit Spectrometer', 'Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium shot of @{Commander Han Feng} holding heavy brass-and-olive @{Tactical Spirit Spectrometer} in right hand, \${ATTIRE.HAN_FENG}. In the lower panel, extreme macro shot of the device's quartz lens fractured into spiderweb cracks, needle pinned past infinity, venting thick plumes of white ozone smoke. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_016',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, tactical communications operator leaning out of command van holding holographic tablet displaying pulsing red energy curves, gesturing frantically to commander, @{Commander Han Feng} in \${ATTIRE.HAN_FENG}. In the lower panel, close-up of tablet screen displaying [ERROR: TEN THOUSAND PERCENT CELESTIAL OVERFLOW — SYSTEM BURNOUT]. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_017',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Tactical Spirit Spectrometer'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Commander Han Feng}'s weather-worn fingers flicking cigarette ash into night air, \${ATTIRE.HAN_FENG}. In the lower panel, @{Commander Han Feng} glaring sternly at the smoking @{Tactical Spirit Spectrometer}, jaw set grimly under metropolitan amber streetlamps. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_018',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, armored squad lieutenant saluting @{Commander Han Feng} with trembling gloved hands, heavy assault rifle strapped across chest, @{Commander Han Feng} in \${ATTIRE.HAN_FENG}. In the lower panel, @{Commander Han Feng}'s stern profile cutting through emergency strobe lights, eyes fixed on campus stadium. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_019',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium shot of @{Commander Han Feng} scoffing with dry cynical smirk, cigarette smoke curling into air, \${ATTIRE.HAN_FENG}. In the lower panel, @{Commander Han Feng}'s gaze looking up at the colossal glowing stele burning in the troposphere. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_020',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} raising open hand to command perimeter enforcers, pointing authoritatively toward main collegiate gate, \${ATTIRE.HAN_FENG}. In the lower panel, squad of tactical enforcers locking high-voltage magnetic security pylons across the university entrance road. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_021',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Monumental architectural panorama: 75th-floor open-air observation terrace of Starfall Tower at night, polished dark obsidian tile terrace overlooking glittering skyline of Jiangnan metropolis, high-altitude wind whipping purple and cyan celestial starlight curtains across sky. \${SPATIAL.STARFALL_PENTHOUSE} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_022',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, elegant full-body portrait of \${DNA.JIANG_QINGXUE} standing at glass balustrade overlooking city, \${ATTIRE.JIANG_QINGXUE} billowing in high-altitude wind. In the lower panel, tight close-up of @{Jiang Qingxue}'s delicate porcelain face, sharp ice-blue phoenix eyes shimmering with celestial focus. \${SPATIAL.STARFALL_PENTHOUSE} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_023',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue', 'Celestial Star Astrolabe'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Jiang Qingxue}'s slender porcelain palm holding the ornate brass spherical @{Celestial Star Astrolabe}, \${ATTIRE.JIANG_QINGXUE}. In the lower panel, concentric celestial rings spinning with blur of mechanical precision, chiming with ancient starlight harmonics. \${SPATIAL.STARFALL_PENTHOUSE} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_024',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Jiang Qingxue', 'Celestial Star Astrolabe'],
    prompt: `Full-bleed cinematic hero plate. Dynamic panoramic perspective: @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} holding @{Celestial Star Astrolabe} as its glowing cyan crystal core emits an intense razor-sharp starlight laser beam slicing across metropolitan night sky, pointing directly at Qindu University campus ten miles away. \${SPATIAL.STARFALL_PENTHOUSE} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  }
]

console.log('Batch 01 scenes configured:', b01Scenes.length)

// ============================================================================
// BATCH 02 DATA (Scenes 025 - 048)
// ============================================================================
export const b02Scenes = [
  {
    id: 'IMG_025',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Celestial Star Astrolabe', 'Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Celestial Star Astrolabe} held in \${DNA.JIANG_QINGXUE}'s porcelain hand, \${ATTIRE.JIANG_QINGXUE}, spherical brass rings locking into place. In the lower panel, luminous cyan spirit crystal core emitting concentrated laser beam of starlight pointing straight toward Qindu district. \${SPATIAL.STARFALL_PENTHOUSE} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_026',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, extreme close-up of \${DNA.JIANG_QINGXUE}'s ice-blue phoenix eyes shimmering with unshed tears of reverence, frosted silver bangs framing delicate pale face, \${ATTIRE.JIANG_QINGXUE}. In the lower panel, @{Jiang Qingxue} pressing astrolabe gently against chest, frost mist condensing across white designer coat. \${SPATIAL.STARFALL_PENTHOUSE} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_027',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Jiang Qingxue'],
    prompt: `Full-bleed cinematic hero plate. Dynamic action perspective: \${DNA.JIANG_QINGXUE} in \${ATTIRE.JIANG_QINGXUE} stepping off skyscraper antenna into empty night air, body dissolving into radiant sonic comet of frosted cyan starlight and ice crystals, slicing across metropolitan night sky toward distant university stadium. \${SPATIAL.STARFALL_PENTHOUSE} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_028',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, wide high-angle shot of university stadium: red perimeter alarms flashing, thousands of collegiate cultivators running across green turf in panic. In the lower panel, eye-level tracking shot of students clutching schoolbags and smartphones, anxious expressions under harsh white floodlights. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_029',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, row of Threat Bureau tactical enforcers with dark pressurized visors locking heavy carbon riot shields shoulder-to-shoulder along red running track. In the lower panel, enforcers directing waves of collegiate students toward center of field with illuminated spirit baton signals. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_030',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium shot of \${DNA.GU_TIANYU} slumped against steel bleacher railing, \${ATTIRE.GU_TIANYU} stained with grey dust, slicked-back hair messy. In the lower panel, close-up of @{Gu Tianyu} clutching right wrist with white knuckles, trembling with humiliation and lingering shock in navy blazer. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_031',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of red tartan track surface: glittering fragments of silver alloy and shattered cyan nephrite jade from broken spirit saber ground into chalk powder on rubber matting, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU}. In the lower panel, @{Gu Tianyu}'s designer leather shoe kicking broken jade shard in bitter disgust. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_032',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, tight close-up of @{Gu Tianyu} in \${ATTIRE.GU_TIANYU}, sneering profile, bloodshot eyes brimming with wounded aristocratic pride, veins bulging on neck. In the lower panel, @{Gu Tianyu} glaring suspiciously across crowded stadium, looking for student who broke his weapon. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_033',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, ten civilian news drones with flashing optical camera lenses hovering aggressively above metal perimeter fences. In the lower panel, high-resolution zoom display on drone screen showing the massive 30,000-metre golden stele shining in night sky. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_034',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, high-mounted stadium horn speakers blaring with vibrating sound waves under night sky. In the lower panel, collegiate students shielding their ears, looking up nervously at military command beacons. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_035',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Low-angle dynamic action shot: three Threat Bureau tactical enforcers aiming high-tech EMP rifles upward, firing brilliant blue crackling electromagnetic darts that strike civilian news drones, knocking them out of the sky in trailing spirals of white smoke. \${SPATIAL.THREAT_CORDON} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_036',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, collegiate students in stadium bleachers whispering anxiously, looking at falling drone debris with wide eyes. In the lower panel, close-up of student hands checking smartphones displaying [SIGNAL BLOCKED BY MILITARY JAMMER]. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_037',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, terrified collegiate sophomore crying out in panic, waving arms toward stadium gates. In the lower panel, group of nearby students backing away toward astroturf field in collective dread. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_038',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, senior faculty proctor with pale wrinkled face locking heavy secondary iron gate with large brass padlock. In the lower panel, proctor turning toward students, gesturing sternly for quiet order. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_039',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} pulling out high-encrypted gold-plated smartphone, fingers frantically tapping numeric keypad. In the lower panel, close-up of @{Gu Tianyu}'s sweating brow and gritted teeth. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_040',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, extreme macro shot of smartphone holographic screen flashing red with [SIGNAL COMPROMISED: TACTICAL SPIRIT JAMMING FIELD ENGAGED], @{Gu Tianyu} in \${ATTIRE.GU_TIANYU}. In the lower panel, screen turning dark as military static disrupts communication. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_041',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} furiously slamming smartphone against his thigh, face contorted in vicious rage. In the lower panel, @{Gu Tianyu} kicking track rubber with designer leather shoe, cursing in bitter isolation. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_042',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, over-the-shoulder shot looking past \${DNA.LU_CHEN} in \${ATTIRE.LU_CHEN} across fifty metres toward @{Gu Tianyu} having a tantrum by the bleachers. In the lower panel, close-up of @{Lu Chen}'s calm, unbothered obsidian eyes, soft black bangs drifting in breeze. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_043',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, \${DNA.WANG_BAO} in \${ATTIRE.WANG_BAO} leaning close to @{Gu Tianyu}'s direction, pointing trembling finger. In the lower panel, @{Wang Bao}'s comical whisper face warning about corporate clan assassins. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_044',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen} in \${ATTIRE.LU_CHEN} tilting head with dry deadpan smirk, hands resting deep in hoodie pockets. In the lower panel, visual memory insert: chipped steel kitchen knife deflecting cyan spirit saber on athletic turf. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_045',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, comical reaction shot: @{Wang Bao} in \${ATTIRE.WANG_BAO} lunging forward to slap both hands over @{Lu Chen}'s mouth in \${ATTIRE.LU_CHEN}. In the lower panel, close-up of @{Wang Bao}'s bulging eyes sweating in comical horror. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_046',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen} calmly pushing @{Wang Bao}'s chubby hand away from face with relaxed wrist, @{Lu Chen} in \${ATTIRE.LU_CHEN}, @{Wang Bao} in \${ATTIRE.WANG_BAO}. In the lower panel, @{Lu Chen} exhaling calm breath, looking dismissively toward stadium horizon. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_047',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Monumental vertical composition: sudden atmospheric pressure drop bending metal floodlight pylons, air shimmering with intense heat distortions, clouds above stadium swirling into dark vortex. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_048',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Devastating kinetic shockwave: supersonic boom blasting across western sky, concussive pressure wave shattering second-floor glass windows in academic building, smoke trailing behind supersonic atmospheric rift. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  }
]

console.log('Batch 02 scenes configured:', b02Scenes.length)

// ============================================================================
// BATCH 03 DATA (Scenes 049 - 072)
// ============================================================================
export const b03Scenes = [
  {
    id: 'IMG_049',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Low-angle dynamic view of night stadium: explosive supersonic shockwave ring blasting open overcast clouds directly above stadium floodlights, brilliant violet engine contrails illuminating night sky with concussive force. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_050',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Dynamic mid-air perspective: extravagant luxury crimson-and-gold hover-sedan descending violently over stadium floodlights, high-tech anti-gravity thrusters blasting gale-force wind across bleachers, trailing violet anti-gravity plumes. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_051',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, downdraft whipping dead leaves and chalk dust across bleachers. In the lower panel, collegiate students shielding their eyes with forearms, hair blown wild in gale. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_052',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, crimson hover-sedan settling heavily onto red synthetic track with loud hiss of hydraulic landing struts. In the lower panel, anti-gravity exhaust melting red track rubber into bubbling black bitumen under floodlights. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_053',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, futuristic gull-wing doors rising smoothly upward. In the lower panel, dense billows of violet aromatic spirit mist wafting onto running track asphalt. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_054',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, polished black dragon-leather boot stepping out of purple mist onto track. In the lower panel, medium shot of \${DNA.MO_YUFENG} stepping into stadium floodlights, \${ATTIRE.MO_YUFENG} fluttering, swept-back crimson hair glinting arrogantly. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_055',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium close-up of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} surveying sea of students with supreme condescension. In the lower panel, @{Mo Yufeng}'s manicured hands casually adjusting gold-threaded silk sash across black combat turtleneck. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_056',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, full-body shot of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} engulfed in blazing sphere of golden core spirit flames and crackling crimson electricity distorting air around boots. In the lower panel, close-up of golden spirit sparks sizzling violently against track. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_057',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, concentric golden shockwave rings rippling outward across astroturf, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. In the lower panel, dozens of junior student cultivators collapsing to their knees under crushing 85,000-year gravity. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_058',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, elderly collegiate faculty dean clutching chest in dread as spiritual pressure suffocates lungs, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. In the lower panel, faculty professors backing away in pale submission. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_059',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, low-angle shot of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} ascending steel steps of elevated proctor stage with haughty strides. In the lower panel, @{Mo Yufeng} standing tall at podium center overlooking five thousand spectators. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_060',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Forged Primordial Token'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} drawing an ornate white jade medallion from coat pocket. In the lower panel, close-up of @{Forged Primordial Token} carved from dragon-crested jade, glowing with unstable crimson spirit runes. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_061',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Forged Primordial Token', 'Mo Yufeng'],
    prompt: `Full-bleed cinematic hero plate. Spectacular visual spectacle: @{Forged Primordial Token} held aloft by @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}, erupting in blinding crimson light and projecting a hundred-metre golden astral dragon coiling into night sky above collegiate stadium. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_062',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} shouting with booming resonance, golden core qi amplifying voice. In the lower panel, sound-wave distortions visible in ambient stadium floodlight beams. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_063',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, low-angle dynamic shot of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} pointing imperiously at crowd, swept-back crimson hair glinting. In the lower panel, @{Mo Yufeng}'s sneer radiating supreme vanity and hubris. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_064',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, high-angle stadium view: five thousand students and professors shuddering in unison as name echoes. In the lower panel, close-up of student faces pale with shock and whispering rumors. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_065',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, collegiate students in bleachers gasping, clutching chests in awe. In the lower panel, students bowing their heads toward the elevated stage in spontaneous reverence. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_066',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium shot of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} basking in crowd's submission with arrogant smirk. In the lower panel, @{Mo Yufeng} crossing arms atop proctor podium with imperial posture. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_067',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} grandstanding, gesturing grandly toward the heavens with both hands. In the lower panel, golden aura flaring around his coat collar. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_068',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} stomping foot down onto podium deck, declaring royal dominion. In the lower panel, shockwave traveling down podium steps onto red running track. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_069',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, group of senior university professors in formal academic suits whispering frantically among themselves, eyes wide with dread. In the lower panel, close-up of a dean's trembling hands clutching velvet administrative case. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_070',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of elderly white-haired cultivation professor stammering in terror, cold sweat dripping down wrinkled forehead. In the lower panel, wide shot of collegiate faculty backing away from stage in complete submission. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_071',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, low-angle dynamic shot of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} throwing head back in raucous laughter atop podium, crimson hair wild. In the lower panel, close-up of @{Mo Yufeng}'s arrogant sneer, eyes full of vanity under floodlights. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_072',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} pointing demanding finger directly at VIP administrative box, crimson coat billowing. In the lower panel, collegiate deans in VIP seats blanching in pure horror at extortionate demands. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  }
]

console.log('Batch 03 scenes configured:', b03Scenes.length)

// ============================================================================
// BATCH 04 DATA (Scenes 073 - 096)
// ============================================================================
export const b04Scenes = [
  {
    id: 'IMG_073',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, Dean of Qindu University in academic robes walking with trembling steps toward podium, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. In the lower panel, Dean bowing deeply at foot of stage, hands shaking. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_074',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, Dean bowing until forehead nearly touches asphalt. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} looking down with mocking grin. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_075',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} resting hand on hip, demanding ten thousand kilograms of spirit stones. In the lower panel, Dean's face blanching in sheer disbelief. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_076',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, Dean gasping in horror, clutching heart. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} smirking down with cold eyes. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_077',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} stomping boot down, cracking concrete podium deck with crimson fire. In the lower panel, Dean flinching backward in terror. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_078',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} demanding subterranean qi spring keys and three top female attendants with greedy sneer. In the lower panel, faculty members trembling in sickened outrage. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_079',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, students in bleachers looking at each other in helpless despair under floodlights. In the lower panel, female prodigy students clutching coats in dread. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_080',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, \${DNA.GU_TIANYU} in \${ATTIRE.GU_TIANYU} leaning against bleacher railing, bruised wrist forgotten as manic spark of opportunistic ambition ignites in dark eyes. In the lower panel, close-up of @{Gu Tianyu}'s lips curling into sycophantic, scheming smirk. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_081',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, tight shot of @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} whispering to himself, calculating corporate dominance. In the lower panel, @{Gu Tianyu} taking determined step forward toward the track. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_082',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} dropping to knees on red synthetic track, designer navy blazer brushing turf. In the lower panel, tracking shot of @{Gu Tianyu} groveling forward across ground toward elevated stage in shameless submission. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_083',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} crawling on all fours like starved dog, dusty hands dragging across synthetic grass. In the lower panel, students parting in disgust. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_084',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, two-shot composition: @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} prostrating flat with forehead pressed against track, hands outstretched in worship. In the lower panel, \${DNA.MO_YUFENG} in \${ATTIRE.MO_YUFENG} looking down with amused disdain from elevated platform. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_085',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} looking down at groveling scion with mocking curiosity. In the lower panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} looking up with desperate sycophancy. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_086',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} loudly proclaiming his name and Gu Capital Syndicate lineage before @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. In the lower panel, @{Gu Tianyu}'s trembling fingers clutching track turf. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_087',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} pledging 30% of assets, four refineries and fifty mines to @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. In the lower panel, @{Mo Yufeng}'s eyes glittering with corrupt greed. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_088',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, collegiate students staring in sickened disbelief at Gu family scion debasing himself, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU}. In the lower panel, murmurs of disgust rippling through front bleachers. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_089',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} stepping down to podium edge with dark chuckle. In the lower panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} keeping forehead pressed flat to ground. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_090',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium shot of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} looking down like an imperial noble. In the lower panel, close-up of @{Mo Yufeng}'s polished black leather boot resting arrogantly upon @{Gu Tianyu}'s prostrated shoulder in \${ATTIRE.GU_TIANYU}. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_091',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} sneering down at groveling scion with arrogant mockery. In the lower panel, golden core pressure waves pinning @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} completely flat into rubber turf. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_092',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} grinning grovelingly despite boot on shoulder, pledging supreme glory. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} laughing with amusement. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_093',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} grinding boot sole against @{Gu Tianyu}'s tailored coat, ordering him to round up student stones. In the lower panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} nodding feverishly. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_094',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, \${DNA.WANG_BAO} in \${ATTIRE.WANG_BAO} shivering uncontrollably in back row of students, round face pale with terror. In the lower panel, close-up of @{Wang Bao}'s chattering teeth and wide comical eyes. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_095',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} clutching pockets protectively, squeaking in panic. In the lower panel, @{Wang Bao} looking frantically at @{Lu Chen} in \${ATTIRE.LU_CHEN}. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_096',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} visualizing empty wallet and zero meal vouchers with comical tears. In the lower panel, @{Wang Bao} looking terrified toward the distant elevated stage. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  }
]

console.log('Batch 04 scenes configured:', b04Scenes.length)

// ============================================================================
// BATCH 05 DATA (Scenes 097 - 120)
// ============================================================================
export const b05Scenes = [
  {
    id: 'IMG_097',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Lu Chen'],
    prompt: `Full-bleed cinematic hero plate. Low-angle centered perspective of \${DNA.LU_CHEN} in \${ATTIRE.LU_CHEN} standing relaxed and completely unbothered amidst terrified crowd of whispering students, both hands buried deep inside oversized charcoal-black pullover hoodie front pocket, dark utility trousers, minimalist white sneakers, pristine calm composure under stadium floodlights. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_098',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, over-the-shoulder shot looking past @{Lu Chen}'s soft messy raven hair in \${ATTIRE.LU_CHEN} across stadium toward \${DNA.MO_YUFENG} in \${ATTIRE.MO_YUFENG} grandstanding on elevated stage. In the lower panel, close-up of @{Lu Chen}'s calm obsidian eyes with subtle golden primordial flecks observing forged medallion. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_099',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium close-up of @{Lu Chen} in \${ATTIRE.LU_CHEN} blinking with utterly unimpressed, deadpan expression. In the lower panel, @{Lu Chen}'s brow slightly furrowing in dry, deadpan disbelief at absurd spectacle unfolding before him. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_100',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, two-shot proscenium: @{Wang Bao} in \${ATTIRE.WANG_BAO} clutching left sleeve of \${DNA.LU_CHEN}'s oversized charcoal hoodie in \${ATTIRE.LU_CHEN} with white knuckles. In the lower panel, close-up of @{Wang Bao}'s frantic panicked face whispering urgently into @{Lu Chen}'s ear. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_101',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} trying to pull @{Lu Chen} in \${ATTIRE.LU_CHEN} down into a crouch. In the lower panel, @{Lu Chen} standing completely unmovable with hands in pockets. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_102',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, full-body portrait of @{Lu Chen} in \${ATTIRE.LU_CHEN} standing rooted like ancient mountain. In the lower panel, close-up of sneakers firmly planted on turf with zero flinch. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_103',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen} in \${ATTIRE.LU_CHEN} tilting head slightly with amused, deadpan half-smile, messy fringe over forehead. In the lower panel, @{Lu Chen} speaking in relaxed, rhythmic drawl to @{Wang Bao} in \${ATTIRE.WANG_BAO}. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_104',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} clutching bank cards frantically, looking around like hunted squirrel. In the lower panel, @{Wang Bao} staring back at @{Lu Chen} in \${ATTIRE.LU_CHEN} with wide bewildered eyes. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_105',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium shot of @{Lu Chen} in \${ATTIRE.LU_CHEN} pacing half a step with hands in pockets, looking dryly at his roommate. In the lower panel, nostalgic visual flashback: computer monitor in dark dorm room showing pixelated interface of Heavenly Dao: Infinite Samsara with click counters ticking. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_106',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, visual memory of university student clicking mouse at convenience store checkout counter, @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, computer screen showing daily quest completion checkmarks. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_107',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, flashback of empty guild roster on browser game showing Clan Members: 1 / 1 (Solo), @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, @{Lu Chen} speaking with deadpan irony under stadium floodlights. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_108',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Lu Chen}'s deadpan smirk in \${ATTIRE.LU_CHEN}, eyebrow arched in mockery. In the lower panel, comic mental juxtaposition: arrogant crested crimson parrot perched on branch wearing \${DNA.MO_YUFENG}'s gold-embroidered coat in \${ATTIRE.MO_YUFENG}, screeching vanity at crowd. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_109',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} reaching out to touch @{Lu Chen}'s forehead with chubby palm, comical expression of pure bafflement. In the lower panel, @{Lu Chen} in \${ATTIRE.LU_CHEN} calmly dodging hand with slight lean, unbothered posture. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_110',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen', 'Forged Primordial Token'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} pointing trembling finger at @{Forged Primordial Token} shining on stage. In the lower panel, @{Lu Chen} in \${ATTIRE.LU_CHEN} looking at the token with amused indifference. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_111',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Forged Primordial Token'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen} in \${ATTIRE.LU_CHEN} shaking head softly, deadpan smirk on lips. In the lower panel, extreme macro shot of @{Forged Primordial Token} revealing copper alloy plating beneath cheap red glitter lacquer. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_112',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Heavenly Dao Simulator Interface', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen}'s obsidian eyes reflecting faint golden flare in ambient night air, @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, translucent dark obsidian @{Heavenly Dao Simulator Interface} materializing horizontally at eye level with delicate celestial gold borders. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_113',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Heavenly Dao Simulator Interface'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of floating @{Heavenly Dao Simulator Interface} displaying crisp golden text: [SYSTEM QUERY: LINEAGE REGISTRY — REGISTERED DISCIPLES: ZERO]. In the lower panel, interface scanning background stadium in subtle cyan grid. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_114',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Heavenly Dao Simulator Interface', 'Mo Yufeng', 'Forged Primordial Token'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, HUD of @{Heavenly Dao Simulator Interface} displaying [DETECTED TARGET 'MO YUFENG' — COUNTERFEIT TALISMAN: NORTHERN WORKSHOP FIRE RUNES]. In the lower panel, HUD analyzing @{Forged Primordial Token} held by \${DNA.MO_YUFENG} in \${ATTIRE.MO_YUFENG}. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_115',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Heavenly Dao Simulator Interface', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, scanning reticle of @{Heavenly Dao Simulator Interface} locking onto @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} with yellow warning box displaying [THREAT LEVEL: NEGLIGIBLE / EXTERMINATION ENERGY REQUIRED: 0.000001%]. In the lower panel, reticle flashing harmlessly. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_116',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen} in \${ATTIRE.LU_CHEN} shaking head gently with closed eyes, soft raven fringe drifting across forehead in night breeze. In the lower panel, @{Lu Chen} opening eyes with deep calm indifference, hands resting comfortably inside charcoal hoodie pockets. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_117',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, dark concrete stadium entrance tunnel echoing with heavy rhythmic combat boot steps. In the lower panel, flashlight beams slicing through stadium mist from the tunnel mouth. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_118',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Low-angle dynamic view of night stadium: tactical flare shot from rifle streaking into dark troposphere, illuminating stadium field in vivid phosphorus white light and red sparks. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_119',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, squad of ten heavily armored Threat Bureau tactical enforcers emerging in rigid combat formation with carbon riot shields. In the lower panel, enforcers raising heavy shoulder-mounted energy suppression cannons. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_120',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, \${DNA.HAN_FENG} in \${ATTIRE.HAN_FENG} marching forward through parting ranks of students, dark tactical trench coat billowing, scarred face stern. In the lower panel, close-up of @{Commander Han Feng} exhaling thick plume of grey cigarette smoke from between clenched teeth. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  }
]

console.log('Batch 05 scenes configured:', b05Scenes.length)

