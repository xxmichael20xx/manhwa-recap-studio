export const STYLE = {
  MANHWA_CORE: 'Modern 2025 urban cultivation manhwa art style, sharp black ink linework, bright high-key lighting, vibrant clean cel shading, vertical 9:16',
  ANATOMY_GUARD: 'anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn footwear, crisp pupil reflections, no character cloning, no duplicate protagonist, no multiple copies of the same character, no twin clones, no self-interaction',
  TEXTLESS_GUARD: 'pure 100% textless artwork, no speech bubbles, no comic sound effects, no text overlays, no subtitles, no watermarks, no Hangul',
  PUBLIC_CROWD_GUARD: 'background collegiate students and faculty in soft depth-of-field blur, natural campus life, distant onlookers watching in awe, no foreground strangers stealing focus, zero uninvited characters in immediate foreground, no character cloning, no twin clones, no floating hands',
  ENVIRONMENT_PURE_GUARD: '100% pure environment landscape and architectural focus, completely unpopulated, zero humans, zero people, zero figures in the sky, no floating characters, no crowd, pristine environmental clarity'
}

export const DNA = {
  LU_CHEN: '@{Lu Chen}, 20-year-old East Asian male student, messy soft raven-black hair, deep calm obsidian eyes with microscopic golden starlight flecks, deadpan bored expression, clean oversized charcoal-black pullover hoodie with loose sleeves covering wrists, dark casual utility trousers, minimalist white sneakers, hands in pockets',
  WANG_BAO: '@{Wang Bao}, 20-year-old chubby East Asian male student, round cheerful face, short spiky black hair, expressive wide comical eyes, red graphic gaming t-shirt, beige cargo shorts, enthusiastic energetic posture, casual gaming attire',
  GU_TIANYU: '@{Gu Tianyu}, 21-year-old arrogant athletic male student, sharp slicked-back dark brown hair, humiliated bitter expression, tailored designer navy blazer over white collar shirt',
  JIANG_QINGXUE: '@{Jiang Qingxue}, 21-year-old ethereal East Asian woman, long flowing silk-black hair with frosted silver tips, sharp ice-blue phoenix eyes, graceful cold aloof expression, elegant modern white designer trench coat over pale cyan silk dress, frost mist condensing in palm',
  HAN_FENG: '@{Commander Han Feng}, 42-year-old weathered military commander, short grizzled dark hair, tired stern eyes with heavy dark circles, sharp tactical scar on left cheek, dark olive-drab tactical trench coat with brass state insignia',
  MO_YUFENG: '@{Mo Yufeng}, 22-year-old arrogant East Asian male cultivator, sharp swept-back crimson-tinted dark hair, haughty sneering expression, ornate gold-embroidered crimson and white modern cultivation coat over black combat turtleneck, gold-threaded sash',
  YE_XINGCHEN: '@{Ye Xingchen}, 28-year-old imposing aristocratic man, long silver-streaked dark hair, regal golden eyes full of cold disdain, tailored charcoal bespoke three-piece suit adorned with celestial star-charts, swirling purple cosmic starlight halo floating behind shoulders'
}

export const ATTIRE = {
  LU_CHEN: 'wearing clean oversized charcoal-black pullover hoodie with loose sleeves and casual utility trousers',
  WANG_BAO: 'wearing red graphic gaming t-shirt and cargo shorts attire',
  GU_TIANYU: 'wearing tailored designer navy blazer jacket and trousers attire over white collar shirt',
  JIANG_QINGXUE: 'wearing elegant modern white designer trench coat over pale cyan silk dress',
  HAN_FENG: 'wearing dark olive-drab tactical military trench coat with state insignia',
  MO_YUFENG: 'wearing ornate gold-embroidered crimson and white modern cultivation coat over black combat turtleneck',
  YE_XINGCHEN: 'wearing tailored charcoal bespoke three-piece suit with celestial star-charts'
}

export const SPATIAL = {
  CAMPUS_PARK: 'Spatial Enclosure: Modern 2025 Qindu University athletic field and quiet willow park at night, red tartan running track, wooden park benches, manicured green lawns, contemporary geometric academic faculty towers with solar glass under night sky.',
  THREAT_CORDON: 'Spatial Enclosure: North campus perimeter gates of Qindu University at night, dark olive-drab tactical command carriers with communication dishes, illuminated magnetic security barricades, asphalt metropolitan boulevard.',
  STADIUM_TRACK: 'Spatial Enclosure: Qindu University central athletic track and proctor podium at night, elevated metallic proctor stage, red synthetic running track, surrounding stadium bleachers packed with collegiate students, night floodlights.',
  STADIUM_BLEACHERS: 'Spatial Enclosure: Grand collegiate athletic stadium of Qindu University at night, green astroturf field, elevated proctor stage, metal stadium bleachers, thousands of student onlookers, high LED floodlights.',
  FROSTED_GROUNDS: 'Spatial Enclosure: Center stage of Qindu University athletic field at night, frosted synthetic turf glistening with glacial ice crystals, proctor elevated podium, Threat Bureau tactical cordon with shoulder-mounted cannons, night air with frost mist.',
  CRATER_AFTERMATH: 'Spatial Enclosure: Shattered thirty-metre circular impact crater on the athletic track of Qindu University at night, cracked concrete foundation, fine grey mineral dust and golden primordial starlight motes drifting in ambient air, night floodlights.',
  STARFALL_PENTHOUSE: 'Spatial Enclosure: Panoramic penthouse executive suite atop Starfall Tower at night, polished dark obsidian marble floors, floor-to-ceiling panoramic glass overlooking expanded Jiangnan skyline, holographic radar terminals, purple cosmic starlight glow.',
  STRATOSPHERE_STELE: 'Spatial Enclosure: High troposphere and stratosphere perspective at night, thirty-thousand-metre colossal obsidian-and-gold Heaven-Earth Golden Stele descending through storm clouds, iridescent violet and golden primordial starlight auroras, orbital satellite perspectives overlooking Earth.',
  DORM_ROOM: 'Spatial Enclosure: Modest collegiate dormitory room 404 at night, wooden bunk beds, study desk with laptop and unplugged electric kettle, plastic noodle cups, window overlooking campus night lamps.'
}

export function formatSceneXML(scene) {
  const charRefs = scene.charRefs || []
  let refTag = ''
  if (charRefs.length === 1) {
    refTag = `  <character_ref>${charRefs[0]}</character_ref>\n`
  } else if (charRefs.length > 1) {
    refTag = `  <character_refs>${charRefs.join(', ')}</character_refs>\n`
  }

  return `<scene id="${scene.id}">
  <tag>${scene.id}</tag>
  <layout>${scene.layout}</layout>
${refTag}  <narrative_sync>${scene.narrative}</narrative_sync>
  <prompt>${scene.prompt}</prompt>
</scene>`
}
