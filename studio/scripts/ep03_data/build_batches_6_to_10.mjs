import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { scriptScenes } from './generate_ep03_script.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================================================
// BATCH 06 DATA (Scenes 121 - 144)
// ============================================================================
export const b06Scenes = [
  {
    id: 'IMG_121',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, \${DNA.HAN_FENG} halting fifteen paces from elevated podium, scarred face stern and unyielding under harsh floodlights, \${ATTIRE.HAN_FENG}. In the lower panel, tactical enforcers behind him locking riot shields shoulder-to-shoulder. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_122',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} speaking coldly, cigarette smoke wafting from lips. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} on podium sneering down in response. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_123',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} standing atop stage with crossed arms, sneering down at military officer with extreme arrogance. In the lower panel, over-the-shoulder shot looking from stage down at @{Commander Han Feng} in \${ATTIRE.HAN_FENG}. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_124',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, tight shot of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} mocking military enforcers with dismissive laughter. In the lower panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} listening with motionless expression. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_125',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Tactical Spirit Spectrometer'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium shot of @{Commander Han Feng} in \${ATTIRE.HAN_FENG} raising smoking olive-and-brass @{Tactical Spirit Spectrometer} for all to see. In the lower panel, close-up of shattered quartz crystal lens and scorched gauge face venting white ozone mist. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_126',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} speaking with absolute military authority, tactical insignia glinting on trench coat collar. In the lower panel, enforcers behind him projecting holographic campus sensor grids showing impossible concentric energy spike. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_127',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} taking deliberate step toward podium, stern eyes locked on target. In the lower panel, tactical laser targeting sights painting podium deck. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_128',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Mo Yufeng', 'Forged Primordial Token'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} pointing accusingly at @{Forged Primordial Token}. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} clutching the medallion as unstable amber fire runes flicker weakly under tactical sights. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_129',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, tight shot of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}, temple pulsing with angry blue veins, swept-back hair bristling with rage. In the lower panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} unmoved by the outburst. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_130',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} extending open palm demanding national registry credentials. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} grimacing in exposed panic. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_131',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, ten tactical enforcers behind @{Commander Han Feng} in \${ATTIRE.HAN_FENG} simultaneously priming suppression cannons with mechanical clicks and glowing blue charge coils. In the lower panel, cannon barrels aimed straight at @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_132',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu', 'Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} scrambling to his feet, pointing trembling finger at commander with hysterical rage. In the lower panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} ignoring the scion completely. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_133',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} barking stern order without turning head. In the lower panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} flinching backward in fear of military tribunal. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_134',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} clenching fists as crimson sparks erupt around gold-threaded sash. In the lower panel, eighty-five-thousand-year Golden Core aura flaring violently into fiery vortex. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_135',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} roaring with arrogant defiance, teeth bared. In the lower panel, shockwave of crimson fire pushing against military perimeter. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_136',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, violent crimson spirit fire scorching concrete podium deck into molten black glass beneath @{Mo Yufeng}'s boots, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. In the lower panel, smoke billowing from blackened podium stairs. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_137',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, ten tactical enforcers bracing heavy combat boots against track as Golden Core gravity bears down, @{Commander Han Feng} in \${ATTIRE.HAN_FENG}. In the lower panel, carbon shields groaning under kinetic pressure. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_138',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} reaching for sidearm holster, shouting combat orders. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} raising glowing palms on stage. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_139',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, collegiate students in stadium bleachers diving beneath metal benches for cover. In the lower panel, hands clutching heads in terror anticipating firefight. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_140',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} burying head in knees, trembling violently. In the lower panel, comical visual prayer bubble: meal vouchers and ramen cups floating with angelic wings. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_141',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, full-body shot of \${DNA.LU_CHEN} in \${ATTIRE.LU_CHEN} standing tall amidst ducking students, hands deep in hoodie pockets. In the lower panel, close-up of @{Lu Chen}'s calm obsidian eyes watching standoff with amused detachment. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_142',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen} in \${ATTIRE.LU_CHEN} analyzing @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} with subtle golden starlight flecks in pupils. In the lower panel, internal diagnostic view of Mo Yufeng's hidden secondary soul-poison talisman. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_143',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Sudden eerie stillness across collegiate athletic field: flags hanging dead limp, floodlight humming cutting out, air freezing into silent suspended starlight mist. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_144',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Breathless transition: wind vanishing instantly, perimeter sirens cutting out mid-frequency, atmospheric air turning painfully cold as fine ice particles crystallize in mid-air under stadium lights. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  }
]

console.log('Batch 06 scenes configured:', b06Scenes.length)

// ============================================================================
// BATCH 07 DATA (Scenes 145 - 168)
// ============================================================================
export const b07Scenes = [
  {
    id: 'IMG_145',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, wide view of university athletic field: ambient temperature violently dropping thirty degrees. In the lower panel, close-up of grass blades turning into brittle white icicles in a fraction of a second. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_146',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, crystalline lotus frost patterns flash-freezing outward across red tartan running track with diamond-hard luminescence. In the lower panel, frost spreading across concrete stage foundation. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_147',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, delicate glacial frost blooming across steel bleacher handrails. In the lower panel, breath of five thousand collegiate spectators turning into dense white clouds of icy vapour under floodlights. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_148',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Monumental vertical perspective: breathtaking vertical pillar of ethereal cyan starlight descending straight from moonlit clouds onto center of university athletic track, parting night clouds with blinding glacial luminescence. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_149',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Stratospheric vista: descending cyan starlight beam radiating concentric iridescent auroras that illuminate glass skyscraper towers across Jiangnan metropolis. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_150',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium shot of \${DNA.JIANG_QINGXUE} in \${ATTIRE.JIANG_QINGXUE} emerging gracefully from falling starlight mist, white designer trench coat trailing frosted cyan vapour. In the lower panel, ground-level view of cyan starlight lotuses blooming beneath her boots. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_151',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up portrait of @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE}, long silk-black hair with frosted silver tips cascading over shoulders. In the lower panel, razor-sharp ice-blue phoenix eyes sweeping coldly across field with imperial indifference. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_152',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Jiang Qingxue'],
    prompt: `Full-bleed cinematic hero plate. Monumental cosmic portrait: @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} standing in pristine glacial majesty, two-hundred-and-sixty-million-year Saint Realm pressure radiating like an ancient frozen mountain range, concentric starlight lotus halos turning slowly behind her back. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_153',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG}, knees buckling slightly under crushing Saint Realm spiritual pressure, cigarette tumbling to frosted grass. In the lower panel, @{Commander Han Feng} gasping in reverence as he looks at @{Jiang Qingxue}. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_154',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, tactical enforcers dropping to one knee as heavy suppression cannon barrels freeze over with solid ice, @{Commander Han Feng} in \${ATTIRE.HAN_FENG}. In the lower panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} walking past the frozen weapons without a glance. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_155',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, students in bleachers weeping in open adoration and bowing to ground. In the lower panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} gliding across frosted turf with serene, aloof elegance. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_156',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} locking cold gaze onto the elevated stage. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} flinching under her piercing stare. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_157',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, tight shot of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}, arrogant sneer faltering completely, eyes trembling in dread before @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE}. In the lower panel, @{Mo Yufeng}'s golden core flames shrinking into a weak, suffocated ember. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_158',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, heavy bead of cold sweat running down @{Mo Yufeng}'s temple, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. In the lower panel, @{Mo Yufeng} forcing his trembling facial muscles into a slimy, rehearsed smile. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_159',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} offering a stiff martial salute from the podium with trembling hands. In the lower panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} stopping five paces away with icy contempt. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_160',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, two-shot confrontation: on screen left, \${DNA.JIANG_QINGXUE} in \${ATTIRE.JIANG_QINGXUE} standing pristine; on screen right, \${DNA.MO_YUFENG} in \${ATTIRE.MO_YUFENG} on elevated stage. In the lower panel, extreme close-up of @{Jiang Qingxue}'s glacial gaze piercing through @{Mo Yufeng} like twin icicles. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_161',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} tilting chin upward with icy disdain, white coat collar crisp. In the lower panel, sound-wave ripples of glacial spiritual intent chilling the stadium air into frozen mist. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_162',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} raising right palm, delicate frozen lotus crystals blooming in mid-air. In the lower panel, memories of divine astral palaces reflecting in her starlight eyes. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_163',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, visual memory insert: ethereal simulation realm of Heavenly Dao with infinite cosmic rivers turning, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE}. In the lower panel, @{Jiang Qingxue} speaking with solemn reverence. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_164',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} taking a slow deliberate step forward, frost cracking the concrete podium base. In the lower panel, close-up of her cold, unforgiving expression declaring absolute condemnation. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_165',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} pointing slender finger of condemnation at stage. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} staggering backward in exposed guilt. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_166',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} backing against stage railing, eyes darting between cannons and Saint. In the lower panel, close-up of @{Mo Yufeng}'s face twisting into vicious unhinged hysteria, cornered animal snarling. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_167',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Gu Tianyu'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Gu Tianyu} in \${ATTIRE.GU_TIANYU} collapsing flat on his stomach on the track, clutching head in existential despair. In the lower panel, @{Gu Tianyu}'s eyes wide with horror realizing he gave his clan's assets to a fraud. \${SPATIAL.STADIUM_TRACK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_168',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, low-angle shot of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} reaching into his gold-threaded sash with manic expression. In the lower panel, demonic purple-black qi swirling violently around his fingers. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  }
]

console.log('Batch 07 scenes configured:', b07Scenes.length)

// ============================================================================
// BATCH 08 DATA (Scenes 169 - 192)
// ============================================================================
export const b08Scenes = [
  {
    id: 'IMG_169',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} backing against stage railing like rabid animal, veins bulging on neck. In the lower panel, @{Mo Yufeng} screaming in unhinged denial. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_170',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Mo Yufeng}'s hand retrieving a pitch-black demonic pill with pulsating crimson veins from gold sash, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. In the lower panel, black demonic mist hissing from the pill surface. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_171',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} shouting warning in alarm, gesturing enforcers to fall back. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} laughing maniacally on stage. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_172',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} swallowing the black pill whole, head tilted back. In the lower panel, extreme macro shot of his amber eyes turning completely blood-crimson, black demonic veins spider-webbing across neck. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_173',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} engulfed in violent volcanic explosion of crimson demonic flames surging past 100,000 years. In the lower panel, concrete podium steps cracking and turning into molten slag. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_174',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, synthetic astroturf and rubber foundations vaporizing into ash beneath dragon boots, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. In the lower panel, @{Mo Yufeng} drawing massive gilded spirit broadsword from waist with metallic ring. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_175',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Mo Yufeng'],
    prompt: `Full-bleed cinematic hero plate. Monumental dynamic action composition: @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} brandishing massive curved gilded spirit dao saber, blade igniting with roaring twenty-metre pillar of searing crimson demonic fire illuminating the entire stadium night sky. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_176',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} screaming in psychotic berserk fury, saliva flying from lips. In the lower panel, flaming blade sweeping through air leaving trail of fire. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_177',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng}'s bloodshot demonic eyes in \${ATTIRE.MO_YUFENG} locking straight onto front row bleachers. In the lower panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} shivering in crosshairs of murderous intent. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_178',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} raising flaming broadsword high with both hands above head, muscles bulging. In the lower panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} screaming in sheer horror. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_179',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Mo Yufeng', 'Wang Bao', 'Lu Chen'],
    prompt: `Full-bleed cinematic hero plate. Monumental dynamic action composition: on screen right, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} slashing downward, unleashing colossal 40-metre crescent sword-beam of searing crimson fire tearing through air; on screen left, \${DNA.WANG_BAO} in \${ATTIRE.WANG_BAO} falling backward in horror, while \${DNA.LU_CHEN} in \${ATTIRE.LU_CHEN} stands dead center directly in lethal path of oncoming inferno, completely unbothered. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_180',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Mo Yufeng'],
    prompt: `Full-bleed cinematic hero plate. Low-angle devastating tracking perspective: 40-metre flaming crescent sword-beam roaring across athletic track at Mach 3, vaporizing synthetic turf and melting asphalt under concussive shockwaves, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_181',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} falling flat on back on grass, covering face with both chubby arms in sheer desperation. In the lower panel, reflection of blazing crimson sword-beam rushing toward him inches away. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_182',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} firing heavy sidearm in rapid succession. In the lower panel, glowing spirit bullets dissolving into molten slag upon contacting the forty-metre wave of fire. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_183',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} roaring warning to enforcers. In the lower panel, commander throwing himself protectively over junior officers on track. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_184',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, extreme close-up of @{Jiang Qingxue}'s ice-blue phoenix eyes widening in profound horror, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE}. In the lower panel, frost mist whipping around her pale cheeks. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_185',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, \${DNA.JIANG_QINGXUE} in \${ATTIRE.JIANG_QINGXUE} thrusting both palms forward, conjuring towering wall of crystalline glacial lotus barriers across turf. In the lower panel, glacial barrier erecting across field. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_186',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, split composition showing @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} thirty metres away on opposite side of podium. In the lower panel, supersonic sword-beam already ten feet from bleachers, outpacing ice. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_187',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} gasping in anguish. In the lower panel, her outstretched fingers trembling in helplessness. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_188',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, hundreds of collegiate students screaming with closed eyes as heatwave washes over front bleachers. In the lower panel, synthetic banners singeing and curling in intense heat. \${SPATIAL.STADIUM_BLEACHERS} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_189',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Lu Chen'],
    prompt: `Full-bleed cinematic hero plate. Intimate centered close-up of \${DNA.LU_CHEN} in \${ATTIRE.LU_CHEN} standing motionless dead center of frame, soft messy black fringe barely stirring in incoming heatwave, calm obsidian eyes radiating cold primordial stillness, zero flinch, oversized charcoal hoodie loose around shoulders. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_190',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, profile shot of @{Lu Chen} in \${ATTIRE.LU_CHEN} standing serene, soft raven fringe drifting. In the lower panel, front view of his face displaying total unbothered composure. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_191',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, extreme macro shot of @{Lu Chen}'s obsidian eyes reflecting roaring crimson sword-beam without blinking, subtle golden primordial starlight flecks deep within pupils, @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, relaxed posture unchanged. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_192',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen}'s left hand smoothly sliding out from his charcoal hoodie front pocket, \${ATTIRE.LU_CHEN}. In the lower panel, slender hand emerging into floodlights with languid grace, wrist relaxed. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  }
]

console.log('Batch 08 scenes configured:', b08Scenes.length)

// ============================================================================
// BATCH 09 DATA (Scenes 193 - 216)
// ============================================================================
export const b09Scenes = [
  {
    id: 'IMG_193',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, dynamic side-profile of @{Lu Chen} extending single relaxed left index finger directly toward roaring 40-metre wave of crimson fire, @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, fingertip stopping three inches before his chest. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_194',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, extreme macro shot of @{Lu Chen}'s index fingertip lightly tapping empty air in \${ATTIRE.LU_CHEN}, where microscopic golden ripple forms. In the lower panel, @{Lu Chen}'s unbothered deadpan facial profile, pristine composure. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_195',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, conceptual visual: @{Lu Chen}'s primordial dantian core containing infinite golden celestial galaxies turning slightly, @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, an infinitesimally tiny golden starlight mote escaping from fingertip into reality. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_196',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, microscopic starlight spark expanding from fingertip, @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, air density warping with weight of cosmic galaxies. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_197',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Lu Chen'],
    prompt: `Full-bleed cinematic hero plate. Monumental cosmic visual: single concentric circular wave of warm golden primordial starlight expanding outward from @{Lu Chen}'s fingertip in \${ATTIRE.LU_CHEN}, warping space-time and flattening atmospheric air pressure with density of ten thousand continental mountain ranges. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_198',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, 40-metre crimson sword-beam completely halted dead in mid-air inches before @{Lu Chen} in \${ATTIRE.LU_CHEN} upon hitting golden starlight ring. In the lower panel, shockwave freezing all flame particles in static suspension. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_199',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, roaring crimson inferno instantly crumbling into delicate sparkling golden firefly embers before @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, harmless golden embers drifting gently onto grass around his sneakers. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_200',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, invisible gravitational shockwave surging backward from @{Lu Chen} along attack trajectory at hypersonic speed toward stage. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} watching in sudden existential dread. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_201',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, golden ripple violently striking curved blade of \${DNA.MO_YUFENG}'s gilded spirit sword in \${ATTIRE.MO_YUFENG}. In the lower panel, sound barrier shattering with concussive sonic pop. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_202',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, extreme close-up of gilded broadsword disintegrating into microscopic steel particles and dust in mid-air. In the lower panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}, eyes bulging in pure existential horror as weapon turns to powder in bare hands. \${SPATIAL.FROSTED_GROUNDS} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_203',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, overwhelming kinetic gravity slamming @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} violently face-first into athletic track. In the lower panel, concussive pressure wave blasting outward. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_204',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Mo Yufeng'],
    prompt: `Full-bleed cinematic hero plate. High-angle devastating impact composition: @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} slammed face-first into athletic track, kinetic gravity carving perfect 30-metre circular crater into concrete foundation, web-like fracture fissures tearing across tartan track and bleacher steps. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_205',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng', 'Forged Primordial Token'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Forged Primordial Token} shattering into white chalk dust under immense gravitational force beneath @{Mo Yufeng}'s crushed chest, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG}. In the lower panel, dust blowing away in breeze. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_206',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} pinned completely flat to crater floor, gold-embroidered coat torn, coughing up mouthfuls of dark blood. In the lower panel, berserk aura completely extinguished. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_207',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, two-shot composition: \${DNA.LU_CHEN} in \${ATTIRE.LU_CHEN} standing tall on cracked concrete lip of crater with hands buried in oversized charcoal hoodie pockets; pinned at bottom of crater, \${DNA.MO_YUFENG} in \${ATTIRE.MO_YUFENG} whimpering in defeat. In the lower panel, close-up of @{Lu Chen}'s unbothered deadpan gaze. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_208',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium close-up of @{Lu Chen} in \${ATTIRE.LU_CHEN} looking down at @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} with faint charismatic deadpan smirk, soft raven hair ruffled by cooling wind. In the lower panel, @{Lu Chen} casually turning his back on crater. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_209',
    layout: 'Tier A: Hero Plate',
    charRefs: [],
    prompt: `Full-bleed cinematic hero plate. Wide panoramic view of quiet stadium at night: five thousand spectators completely frozen in dead silence, collegiate flags fluttering in night breeze above stadium rim, thin smoke rising lazily from 30-metre crater. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_210',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of torn collegiate flag fluttering softly on metal mast under night sky. In the lower panel, wide stadium bleachers with thousands of silent, motionless onlookers. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_211',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, \${DNA.HAN_FENG} in \${ATTIRE.HAN_FENG} standing with jaw slack, tactical radio forgotten in hand, scarred face stunned. In the lower panel, @{Commander Han Feng}'s wide eyes staring at 30-metre crater in utter military shock. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_212',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} turning head slowly toward bleachers. In the lower panel, @{Commander Han Feng}'s eyes tracking unhurried footsteps of @{Lu Chen} in \${ATTIRE.LU_CHEN} with overwhelming realization. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_213',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, \${DNA.WANG_BAO} in \${ATTIRE.WANG_BAO} opening one comical eye on grass, seeing crater where fire was. In the lower panel, @{Wang Bao} looking up at @{Lu Chen} in \${ATTIRE.LU_CHEN} standing calmly in front of him. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_214',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, \${DNA.JIANG_QINGXUE} in \${ATTIRE.JIANG_QINGXUE} frozen mid-stride on frosted turf, ice-blue phoenix eyes wide with profound revelation. In the lower panel, delicate frosted bangs framing her stunned, reverent face. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_215',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Celestial Star Astrolabe', 'Jiang Qingxue', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Celestial Star Astrolabe} held in @{Jiang Qingxue}'s palm in \${ATTIRE.JIANG_QINGXUE}, brass rings spinning with deafening speed. In the lower panel, luminous cyan laser vector projecting straight from astrolabe toward @{Lu Chen} in \${ATTIRE.LU_CHEN}. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_216',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, over-the-shoulder shot looking from @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE}'s perspective at retreating back of @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, close-up of @{Jiang Qingxue}'s trembling lips, hot tears of reverence glistening in eyes. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  }
]

console.log('Batch 09 scenes configured:', b09Scenes.length)

// ============================================================================
// BATCH 10 DATA (Scenes 217 - 240)
// ============================================================================
export const b10Scenes = [
  {
    id: 'IMG_217',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} taking an urgent step forward across frosted turf, reaching out porcelain hand toward retreating figure of @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, frost swirling around her footsteps. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_218',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} shouting urgent orders into tactical comms headset, pointing toward collegiate pavilion where @{Lu Chen} in \${ATTIRE.LU_CHEN} is walking. In the lower panel, tactical enforcers freezing in place. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_219',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium close-up of @{Lu Chen} in \${ATTIRE.LU_CHEN} turning slightly, offering faint relaxed deadpan smirk over shoulder. In the lower panel, soft raven bangs catching the night lamp illumination. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_220',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, full-body shot of \${DNA.LU_CHEN} in \${ATTIRE.LU_CHEN} taking a leisurely stride toward the brick archway of collegiate library pavilion, hands in hoodie pockets. In the lower panel, sneakers stepping onto stone pathway. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_221',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Lu Chen'],
    prompt: `Full-bleed cinematic hero plate. Low-angle cinematic tracking shot of \${DNA.LU_CHEN} in \${ATTIRE.LU_CHEN} slipping casually around corner of brick collegiate pavilion, hands in hoodie pockets, faint relaxed smirk on lips, dissolving gracefully into parting crowd of murmuring students under night lamps. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.PUBLIC_CROWD_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_222',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} streaking forward in flash of cyan starlight across athletic field. In the lower panel, @{Jiang Qingxue} arriving at empty brick library pavilion within half a second. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_223',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, empty brick archway under rain-slicked night lamps with zero human figures, faint nocturnal breeze drifting through, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE}. In the lower panel, single tiny golden starlight mote landing on her fingertip and dissolving into warmth. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_224',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Jiang Qingxue', 'Celestial Star Astrolabe'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Jiang Qingxue} in \${ATTIRE.JIANG_QINGXUE} pressing @{Celestial Star Astrolabe} gently against chest with both hands. In the lower panel, close-up of her face breaking into soft, radiant, devoted smile, eyes glistening with tears. \${SPATIAL.CAMPUS_PARK} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_225',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Mo Yufeng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} standing on edge of 30-metre crater looking down at whimpering @{Mo Yufeng} in \${ATTIRE.MO_YUFENG} pinned in concrete rubble. In the lower panel, enforcers training rifles on the defeated impostor. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_226',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, armored tactical captain jogging up to @{Commander Han Feng} in \${ATTIRE.HAN_FENG}, gesturing toward news helicopters circling outside perimeter. In the lower panel, searchlight beams sweeping through sky. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_227',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, close-up of @{Commander Han Feng}'s scarred fingers flicking silver lighter to ignite fresh cigarette, @{Commander Han Feng} in \${ATTIRE.HAN_FENG}. In the lower panel, commander exhaling thick cloud of grey smoke, issuing Level-One State Denial order. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_228',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, captain asking about the student in the black hoodie, @{Commander Han Feng} in \${ATTIRE.HAN_FENG}, visual silhouette of @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, Han Feng's stern eyes narrowing with terrifying military authority. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_229',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Commander Han Feng', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Commander Han Feng} in \${ATTIRE.HAN_FENG} speaking grimly into captain's ear, warning that nobody saw @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, captain saluting in solemn comprehension. \${SPATIAL.CRATER_AFTERMATH} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_230',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: [],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, wooden door numbered 404 clicking softly shut in dim collegiate dormitory hallway. In the lower panel, view inside quiet dorm room 404 at night, desk lamp on. \${SPATIAL.DORM_ROOM} \${STYLE.MANHWA_CORE}, \${STYLE.ENVIRONMENT_PURE_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_231',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, \${DNA.WANG_BAO} in \${ATTIRE.WANG_BAO} collapsing onto lower wooden bunk bed like deflated balloon, sweating profusely. In the lower panel, @{Wang Bao}'s trembling hands clutching red plastic cup of instant beef noodles. \${SPATIAL.DORM_ROOM} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_232',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} staring wide-eyed across dorm room at @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, close-up of @{Wang Bao} stammering questions about military tests. \${SPATIAL.DORM_ROOM} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_233',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen} in \${ATTIRE.LU_CHEN} unlacing minimalist white sneakers, placing them neatly beside dormitory entrance door. In the lower panel, @{Lu Chen} stretching relaxed shoulders with domestic nonchalance. \${SPATIAL.DORM_ROOM} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_234',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} scratching spiky black hair with suspicious comical look, pointing at @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, @{Lu Chen} walking calmly to desk without acknowledging suspicion. \${SPATIAL.DORM_ROOM} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_235',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, medium shot of @{Lu Chen} in \${ATTIRE.LU_CHEN} walking to small stainless-steel electric kettle on study desk. In the lower panel, close-up of kettle power cord visibly unplugged from wall socket. \${SPATIAL.DORM_ROOM} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_236',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen} in \${ATTIRE.LU_CHEN} tapping stainless-steel kettle with relaxed index finger. In the lower panel, microscopic golden primordial starlight spark passing through metal, instantly boiling water with violent hiss of aromatic white steam. \${SPATIAL.DORM_ROOM} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_237',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Lu Chen', 'Wang Bao'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Lu Chen} in \${ATTIRE.LU_CHEN} handing steaming kettle to @{Wang Bao} in \${ATTIRE.WANG_BAO} with calm, rhythmic drawl. In the lower panel, steam drifting between the two roommates under warm dorm lamp. \${SPATIAL.DORM_ROOM} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_238',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Wang Bao', 'Lu Chen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, @{Wang Bao} in \${ATTIRE.WANG_BAO} happily pouring boiling water over instant noodles, grinning in pure bliss, @{Lu Chen} in \${ATTIRE.LU_CHEN}. In the lower panel, @{Lu Chen} leaning back in desk chair, looking out dark window at glowing golden stele. \${SPATIAL.DORM_ROOM} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_239',
    layout: 'Tier B: Dual-Panel Split',
    charRefs: ['Ye Xingchen'],
    prompt: `Dual-panel manhwa webtoon comic strip. In the upper panel, panoramic view of 75th-floor Starfall Tower penthouse at night: \${DNA.YE_XINGCHEN} in \${ATTIRE.YE_XINGCHEN} standing before floor-to-ceiling glass. In the lower panel, red holographic radar terminal flashing with Category 10 Primordial Energy Spike in Qindu District. \${SPATIAL.STARFALL_PENTHOUSE} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  },
  {
    id: 'IMG_240',
    layout: 'Tier A: Hero Plate',
    charRefs: ['Ye Xingchen'],
    prompt: `Full-bleed cinematic hero plate. Monumental season cliffhanger composition: @{Ye Xingchen} in \${ATTIRE.YE_XINGCHEN} standing tall, tailored charcoal bespoke three-piece suit glinting with constellation star-charts, swirling purple cosmic starlight halo floating behind shoulders, regal golden eyes narrowing with cold predatory obsession as holographic fleet displays order the Black Dragon Fleet to blockade Jiangnan province. \${SPATIAL.STARFALL_PENTHOUSE} \${STYLE.MANHWA_CORE}, \${STYLE.ANATOMY_GUARD}, \${STYLE.TEXTLESS_GUARD}.`
  }
]

console.log('Batch 10 scenes configured:', b10Scenes.length)

