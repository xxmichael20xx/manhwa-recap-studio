export const UUIDS = {
  LU_CHEN: '7ae04cf3-44e8-4f25-856e-2310c84eb9fb',
  WANG_BAO: '9b2efd3b-0020-4eaa-aa51-a83dac5b6c65',
  GU_TIANYU: '80875c1d-dc98-47e6-a3ac-9ba142de78d2',
  JIANG_QINGXUE: '67c81f77-381d-4964-9107-d93dff4faf03',
  HAN_FENG: '3b815452-d36f-4f7d-b411-718d458f277a',
  YE_XINGCHEN: '488bd39e-fb96-4e80-b8ce-f1e3cad4fa12',
  SPECTROMETER: '4c17b746-de54-4fe0-adc6-90f0dfa24bcb',
  STELE: '396a19a4-787b-48a0-aece-d5bf41d543ae'
}

export const STYLE = {
  MANHWA_CORE: 'Modern 2025 urban cultivation manhwa art style, sharp black ink linework, bright high-key lighting, vibrant clean cel shading, vertical 9:16',
  ANATOMY_GUARD: 'anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn footwear, crisp pupil reflections, no character cloning, no duplicate protagonist, no multiple copies of the same character, no twin clones, no self-interaction',
  TEXTLESS_GUARD: 'pure 100% textless artwork, no speech bubbles, no comic sound effects, no text overlays, no subtitles, no watermarks, no Hangul',
  PRIVATE_ROOM_GUARD: 'strictly private interior room, zero background extra students, Room 402 is an isolated private dorm room with only canonical registered occupants, no third person, no extra people, no clone audience, no foreground strangers stealing focus, no floating hands, no detached hands, no disembodied hands touching screens, no hands inside UI glass, no ghost limbs, no morphing artifacts',
  PUBLIC_CROWD_GUARD: 'background collegiate students and faculty in soft depth-of-field blur, natural campus life, distant onlookers watching in awe, no foreground strangers stealing focus, zero uninvited characters in immediate foreground, no character cloning, no twin clones, no floating hands',
  ENVIRONMENT_PURE_GUARD: '100% pure environment landscape and architectural focus, completely unpopulated, zero humans, zero people, zero figures in the sky, no floating characters, no crowd, pristine environmental clarity'
}

export const SPATIAL = {
  CAMPUS_DAWN: 'Spatial Enclosure: Modern 2025 Qindu University campus exterior at crisp dawn, manicured collegiate lawns, contemporary geometric glass-and-steel academic faculty towers, modern LED avenue lights, clear morning sky, distant colossal Heaven-Earth Golden Stele floating in troposphere.',
  ROOM_402: 'Spatial Enclosure: Inside modern 2025 university dormitory room (Room 402), smooth clean white walls, minimalist light birch study desk, aluminium-framed glass window looking out into the morning Jiangnan cityscape with skyscrapers and colossal golden stele; bright 4000K LED ceiling light panels, light oak flooring, pristine orderly modern room.',
  CORRIDOR_CORDON: 'Spatial Enclosure: Fourth-floor residential dormitory corridor outside Room 402, polished white ceramic floor tiles, cratered concrete wall sealed with yellow hazard tape, fluorescent ceiling lights, Threat Bureau mobile cordon barriers.',
  STADIUM_APPRAISAL: 'Spatial Enclosure: Qindu University central athletic sports stadium, green turf field, red running track, five towering five-metre-tall crystalline spirit resonance pillars glowing with mana, military command tents, grandstands filled with collegiate students under clear morning sky.',
  WILLOW_AVENUE: 'Spatial Enclosure: Tree-lined pedestrian willow walkway near Qindu University campus exterior gates, concrete pavers, willow branches swaying gently, sleek black luxury executive spirit-sedans parked near security barrier, crisp morning sunlight.',
  STARFALL_PENTHOUSE: 'Spatial Enclosure: Panoramic penthouse executive suite atop Starfall Tower, polished dark obsidian marble floors, floor-to-ceiling panoramic glass overlooking expanded Jiangnan skyline, holographic broadcast arrays, opulent bespoke leather furniture, purple cosmic starlight glow.',
  STRATOSPHERE_STELE: 'Spatial Enclosure: High troposphere and stratosphere perspective, thirty-thousand-metre colossal obsidian-and-gold Heaven-Earth Golden Stele descending through storm clouds, iridescent violet and golden primordial starlight auroras, orbital satellite perspectives overlooking Earth.'
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
