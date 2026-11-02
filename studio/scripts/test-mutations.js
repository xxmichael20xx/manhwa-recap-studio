#!/usr/bin/env node
/**
 * studio/scripts/test-mutations.js
 *
 * Automated 44-Fixture Mutation Verification Suite (FX-01 through FX-44).
 * Proves that AntiSlopValidator v2.0 catches 100% of historical and near-variant defects.
 */

import { PromptDnaCompiler } from '../server/services/promptDnaCompiler.js'
import { AntiSlopValidator } from '../server/services/antiSlopValidator.js'

const baseFranchise = {
  id: 'series_test',
  code: 'FRAN-TST-001',
  title: 'Baseline Verification Series',
  format: '9:16',
  aspect_token: 'vertical 9:16 (1080x1920)',
  forbidden_aspect_tokens: ['16:9', '1920x1080', '1:1', '4:3', '21:9', 'square 1:1', 'widescreen', 'horizontal 16:9'],
  voice: { id: 'en-GB-RyanNeural' },
  pacing: { max_scene_seconds: 8.0, tts_wpm_measured: 155, max_prompt_tokens: 450 },
  tier_distribution: {
    min_multi_panel_ratio: 0.65,
    layout_headers: {
      A: 'Single-panel full-bleed vertical hero plate.',
      B: 'Dual-panel manhwa webtoon comic strip.',
      C: 'Three-panel dynamic vertical manhwa action strip.'
    }
  },
  style: {
    base: 'Modern 2025 urban cultivation manhwa webtoon art style, sharp black ink linework, vibrant clean cel shading',
    lighting_modes: {
      night_floodlit: {
        text: 'floodlit night atmosphere, brilliant artificial stadium LED floodlights under a dark starry night sky',
        time_class: 'night',
        forbidden_tokens: ['bright blue sky', 'clear blue sky', 'broad daylight', 'harsh midday sun', 'golden hour sunset']
      },
      morning_clear: {
        text: 'crisp morning sunlight with soft natural shadows',
        time_class: 'day',
        forbidden_tokens: ['pitch black midnight', 'midnight darkness']
      },
      interior_night: {
        text: 'warm interior artificial lamplight at night',
        time_class: 'night',
        forbidden_tokens: ['bright blue sky', 'midday sun']
      }
    },
    tail_positive: 'anatomically correct hands, all hands physically connected to wrists and forearms, precisely 5 slender fingers on each hand, detailed knuckles, perfectly drawn footwear, crisp pupil reflections',
    tail_negative: 'no character cloning, no duplicate protagonist, no multiple copies of the same character, no twin clones, no self-interaction, pure 100% textless artwork, no speech bubbles, no comic sound effects, no text overlays, no subtitles, no watermarks, no Hangul'
  },
  new_entity_policy: 'pending_stub',
  paths: { entities: 'vault/entities.json', zones: 'vault/zones.json', policy: 'policy.json', ledger: 'state_events.jsonl' }
}

const baseEntities = {
  lu_chen: {
    id: 'lu_chen',
    kind: 'character',
    token: '@{Lu Chen}',
    aliases: ['Lu Chen'],
    status: 'approved',
    age_class: 'adult',
    dna: '20-year-old East Asian male student, messy soft raven-black hair, deep calm obsidian eyes',
    default_outfit: 'hoodie',
    outfits: { hoodie: 'clean oversized charcoal-black streetwear pullover hoodie and dark utility trousers' },
    default_state: { posture: 'standing' },
    state_lexicon: { posture: { standing: { phrase: 'standing calmly', contradicts: [] } } }
  },
  mo_yufeng: {
    id: 'mo_yufeng',
    kind: 'character',
    token: '@{Mo Yufeng}',
    aliases: ['Mo Yufeng'],
    status: 'approved',
    age_class: 'adult',
    dna: '22-year-old arrogant East Asian male cultivator, sharp swept-back crimson-tinted dark hair',
    default_outfit: 'coat',
    outfits: { coat: 'ornate gold-embroidered crimson and white modern cultivation coat over black turtleneck' },
    default_state: { eyes: 'normal', veins: 'none', posture: 'standing' },
    state_lexicon: {
      eyes: {
        normal: { phrase: 'haughty eyes', contradicts: [] },
        crimson_sclera: { phrase: 'bloodshot crimson demonic sclera', contradicts: ['normal brown human eyes', 'clear calm skin'] }
      },
      veins: {
        none: { phrase: '', contradicts: [] },
        black_neck: { phrase: 'bulging black demonic veins across neck', contradicts: ['clear calm skin'] }
      },
      posture: {
        standing: { phrase: 'standing arrogantly', contradicts: [] },
        prostrate: {
          phrase: 'crushed flat face-down prostrate on the crater floor',
          contradicts: ['stands upright', 'standing upright', 'on his feet', 'standing tall', 'walking confidently']
        }
      }
    },
    narrative_triggers: [
      {
        pattern: 'swallowed the crimson berserk pill',
        required_set: { eyes: 'crimson_sclera', veins: 'black_neck' }
      }
    ]
  },
  gu_tianyu: {
    id: 'gu_tianyu',
    kind: 'character',
    token: '@{Gu Tianyu}',
    aliases: ['Gu Tianyu'],
    status: 'approved',
    age_class: 'adult',
    dna: '21-year-old arrogant male student, slicked-back dark brown hair',
    default_outfit: 'blazer',
    outfits: { blazer: 'tailored designer navy blazer over white shirt' }
  },
  han_feng: {
    id: 'han_feng',
    kind: 'character',
    token: '@{Commander Han Feng}',
    aliases: ['Commander Han Feng', 'Han Feng'],
    status: 'approved',
    age_class: 'adult',
    dna: '42-year-old weathered military commander, short grizzled dark hair, tactical scar on left cheek',
    default_outfit: 'trench',
    outfits: { trench: 'dark olive-drab tactical trench coat with brass state insignia' }
  },
  gu_tianyu_spirit_dao: {
    id: 'gu_tianyu_spirit_dao',
    kind: 'item',
    token: "@{Gu Tianyu's Jade Spirit Blade}",
    aliases: ["Gu Tianyu's Jade Spirit Blade", 'Jade Spirit Blade'],
    status: 'approved',
    age_class: 'non_living',
    dna: 'ornate curved silver-steel spirit saber with cyan jade cutting edge',
    lifecycle: ['equipped', 'sheathed', 'environmental', 'destroyed'],
    default_lifecycle: 'destroyed'
  }
}

const baseZones = {
  'stadium.track': {
    id: 'stadium.track',
    name: 'Qindu Stadium Track',
    canon: 'Qindu University athletic stadium at night, red synthetic running track, metal bleachers, high LED floodlights',
    lighting: 'night_floodlit',
    adjacent: ['dorm.402', 'training.ground'],
    forbidden_tokens: ['military tents', 'dirt park', 'grass astroturf', 'Room 404']
  },
  'dorm.402': {
    id: 'dorm.402',
    name: 'Dormitory Room 402',
    canon: 'Clean modern Qindu University dormitory Room 402, brushed-steel bunk beds, white walls',
    lighting: 'interior_night',
    adjacent: ['stadium.track'],
    forbidden_tokens: ['Room 404', 'Room 403', 'wooden bunk beds']
  },
  'training.ground': {
    id: 'training.ground',
    name: 'Morning Training Ground',
    canon: 'Open collegiate stone training courtyard with target pillars',
    lighting: 'morning_clear',
    adjacent: ['stadium.track'],
    forbidden_tokens: ['Room 404']
  }
}

const baseScript = [
  '[IMG_001] On the athletic track, Lu Chen stood with his hands in his oversized hoodie pockets.',
  '[IMG_002] Across the track, Mo Yufeng glared with arrogant hubris beneath the stadium floodlights.',
  '[IMG_003] Inside Dormitory Room 402, Lu Chen placed his sneakers neatly beside the door.'
].join('\n\n')

const baseScenesJson = [
  {
    id: 'IMG_001',
    batch: 1,
    tier: 'B',
    zone: 'stadium.track',
    transition: 'adjacent',
    chars: [{ id: 'lu_chen', outfit: 'hoodie' }],
    items: [],
    panels: [
      'In the upper panel, medium shot of lu_chen standing on the red track',
      'In the lower panel, close-up of lu_chen looking ahead with deadpan composure'
    ],
    visual_literal: 'literal action only',
    events: []
  },
  {
    id: 'IMG_002',
    batch: 1,
    tier: 'B',
    zone: 'stadium.track',
    transition: 'adjacent',
    chars: [{ id: 'mo_yufeng', outfit: 'coat' }],
    items: [],
    panels: [
      'In the upper panel, medium shot of mo_yufeng glaring across the stadium',
      'In the lower panel, close-up of mo_yufeng adjusting his gold-threaded sash'
    ],
    visual_literal: 'literal action only',
    events: []
  },
  {
    id: 'IMG_003',
    batch: 1,
    tier: 'A',
    zone: 'dorm.402',
    transition: 'adjacent',
    chars: [{ id: 'lu_chen', outfit: 'hoodie' }],
    items: [],
    panels: ['Full-body shot of lu_chen standing beside the brushed-steel bunk bed'],
    visual_literal: 'literal action only',
    events: []
  }
]

const baseLedger = [
  { s: 0, e: 'gu_tianyu_spirit_dao', set: { lifecycle: 'destroyed' } }
]

const compiledClean = PromptDnaCompiler.compileEpisodeMatrix(baseScenesJson, {
  franchise: baseFranchise,
  entities: baseEntities,
  zones: baseZones,
  scriptText: baseScript,
  ledgerText: baseLedger
})

const runAudit = (overrides = {}) => {
  return AntiSlopValidator.auditPromptMatrix(
    overrides.scriptText ?? baseScript,
    overrides.matrixMarkdown ?? compiledClean.matrixMarkdown,
    {
      franchise: overrides.franchise ?? baseFranchise,
      entities: overrides.entities ?? baseEntities,
      zones: overrides.zones ?? baseZones,
      ledgerEvents: overrides.ledgerEvents ?? baseLedger,
      scenesJson: overrides.scenesJson ?? baseScenesJson,
      audioTelemetry: overrides.audioTelemetry ?? null,
      manifest: overrides.manifest ?? null
    }
  )
}

const injectIntoPrompt1 = snippet =>
  compiledClean.matrixMarkdown.replace(
    'looking ahead with deadpan composure.',
    `looking ahead with deadpan composure, ${snippet}.`
  )

const fixtures = [
  { id: 'FX-01', gate: 'G04_text_leakage', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('says: "Kneel before me."') }) },
  { id: 'FX-02', gate: 'G04_text_leakage', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('screaming â€œImpossible!â€ in dread') }) },
  { id: 'FX-03', gate: 'G04_text_leakage', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('shouting â€˜Retreat immediatelyâ€™') }) },
  { id: 'FX-04', gate: 'G04_text_leakage', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('roaring Â«Die!Â» with hand raised') }) },
  { id: 'FX-05', gate: 'G04_text_leakage', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('yelling "No!"') }) },
  { id: 'FX-06', gate: 'G04_text_leakage', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('holding a wooden sign reading Danger') }) },
  {
    id: 'FX-07',
    gate: 'G02_sync_equality',
    run: () =>
      runAudit({
        matrixMarkdown: compiledClean.matrixMarkdown.replace(
          '<narrative_sync>On the athletic track, Lu Chen stood with his hands in his oversized hoodie pockets.</narrative_sync>',
          '<narrative_sync>Lorem ipsum dolor sit amet</narrative_sync>'
        )
      })
  },
  { id: 'FX-08', gate: 'G05_lighting_consistency', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('under the harsh midday sun') }) },
  { id: 'FX-09', gate: 'G05_lighting_consistency', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('golden hour sunset glow across bleachers') }) },
  { id: 'FX-10', gate: 'G05_lighting_consistency', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('clear blue sky overhead') }) },
  {
    id: 'FX-11',
    gate: 'G05_lighting_consistency',
    run: () => {
      const morningMatrix = compiledClean.matrixMarkdown
        .replace('zone="stadium.track"', 'zone="training.ground"')
        .replace(
          'floodlit night atmosphere, brilliant artificial stadium LED floodlights under a dark starry night sky',
          'crisp morning sunlight with soft natural shadows, pitch black midnight darkness'
        )
      return runAudit({ matrixMarkdown: morningMatrix })
    }
  },
  {
    id: 'FX-12',
    gate: 'G05_lighting_consistency',
    run: () =>
      runAudit({
        franchise: {
          ...baseFranchise,
          style: { ...baseFranchise.style, base: 'bright high-key daylight manhwa style' }
        }
      })
  },
  { id: 'FX-13', gate: 'G08_format_fidelity', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('horizontal 16:9 widescreen layout') }) },
  { id: 'FX-14', gate: 'G08_format_fidelity', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('square 1:1 Instagram format') }) },
  { id: 'FX-15', gate: 'G12_spatial_enclosure', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('military tents in foreground') }) },
  {
    id: 'FX-16',
    gate: 'G12_spatial_enclosure',
    run: () =>
      runAudit({
        matrixMarkdown: compiledClean.matrixMarkdown.replace(
          'standing beside the brushed-steel bunk bed',
          'standing inside Room 404 beside the brushed-steel bunk bed'
        )
      })
  },
  {
    id: 'FX-17',
    gate: 'G11_ledger_and_continuity',
    run: () => {
      const m = compiledClean.matrixMarkdown
        .replace(
          '<narrative_sync>Across the track, Mo Yufeng glared with arrogant hubris beneath the stadium floodlights.</narrative_sync>',
          '<narrative_sync>Mo Yufeng crushed into the crater floor.</narrative_sync>'
        )
        .replace('glaring across the stadium', 'Mo Yufeng stands upright glaring arrogantly')
      return runAudit({ matrixMarkdown: m })
    }
  },
  {
    id: 'FX-18',
    gate: 'G11_ledger_and_continuity',
    run: () => {
      const m = compiledClean.matrixMarkdown
        .replace(
          '<narrative_sync>Across the track, Mo Yufeng glared with arrogant hubris beneath the stadium floodlights.</narrative_sync>',
          '<narrative_sync>Mo Yufeng crushed prostrate.</narrative_sync>'
        )
        .replace('glaring across the stadium', 'on his feet, chin raised defiantly')
      return runAudit({ matrixMarkdown: m })
    }
  },
  {
    id: 'FX-19',
    gate: 'G11_ledger_and_continuity',
    run: () => {
      const m = compiledClean.matrixMarkdown
        .replace(
          '<narrative_sync>Across the track, Mo Yufeng glared with arrogant hubris beneath the stadium floodlights.</narrative_sync>',
          '<narrative_sync>Mo Yufeng pinned beneath primordial aura.</narrative_sync>'
        )
        .replace('glaring across the stadium', 'standing tall with arms crossed')
      return runAudit({ matrixMarkdown: m })
    }
  },
  {
    id: 'FX-20',
    gate: 'G11_ledger_and_continuity',
    run: () => {
      const m = compiledClean.matrixMarkdown
        .replace(
          '<narrative_sync>Across the track, Mo Yufeng glared with arrogant hubris beneath the stadium floodlights.</narrative_sync>',
          '<narrative_sync>Mo Yufeng collapsed to his knees in agony.</narrative_sync>'
        )
        .replace('glaring across the stadium', 'standing tall and untouched')
      return runAudit({ matrixMarkdown: m })
    }
  },
  {
    id: 'FX-21',
    gate: 'G11_ledger_and_continuity',
    run: () => {
      const m = compiledClean.matrixMarkdown
        .replace(
          '<narrative_sync>Across the track, Mo Yufeng glared with arrogant hubris beneath the stadium floodlights.</narrative_sync>',
          '<narrative_sync>Mo Yufeng flattened into the crater.</narrative_sync>'
        )
        .replace('glaring across the stadium', 'walking confidently toward camera')
      return runAudit({ matrixMarkdown: m })
    }
  },
  {
    id: 'FX-22',
    gate: 'G11_ledger_and_continuity',
    run: () =>
      runAudit({
        matrixMarkdown: injectIntoPrompt1("holding Gu Tianyu's Jade Spirit Blade in his hand")
      })
  },
  {
    id: 'FX-23',
    gate: 'G11_ledger_and_continuity',
    run: () =>
      runAudit({
        ledgerEvents: [
          ...baseLedger,
          { s: 1, e: 'mo_yufeng', set: { eyes: 'crimson_sclera', veins: 'black_neck' } }
        ],
        matrixMarkdown: compiledClean.matrixMarkdown.replace(
          'glaring across the stadium',
          'glaring with normal brown human eyes and clear calm skin'
        )
      })
  },
  {
    id: 'FX-24',
    gate: 'G11_ledger_and_continuity',
    run: () =>
      runAudit({
        matrixMarkdown: compiledClean.matrixMarkdown.replace(
          '<narrative_sync>Across the track, Mo Yufeng glared with arrogant hubris beneath the stadium floodlights.</narrative_sync>',
          '<narrative_sync>Mo Yufeng swallowed the crimson berserk pill whole.</narrative_sync>'
        ),
        ledgerEvents: baseLedger
      })
  },
  { id: 'FX-25', gate: 'G09_figurative_and_creatures', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('a giant scaly green dragon coiling around the podium') }) },
  { id: 'FX-26', gate: 'G09_figurative_and_creatures', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('a snarling black wolf standing on the running track') }) },
  { id: 'FX-27', gate: 'G09_figurative_and_creatures', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('arrogant cultivator with a realistic tiger head and fur') }) },
  { id: 'FX-28', gate: 'G09_figurative_and_creatures', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('giant serpent wrapped around the pillar') }) },
  { id: 'FX-29', gate: 'G09_figurative_and_creatures', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('flock of golden crows circling overhead') }) },
  { id: 'FX-30', gate: 'G09_figurative_and_creatures', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('two large apes sitting in the bleachers cheering') }) },
  {
    id: 'FX-31',
    gate: 'G09_figurative_and_creatures',
    run: () => {
      const simScript = baseScript.replace(
        'On the athletic track, Lu Chen stood with his hands in his oversized hoodie pockets.',
        'On the athletic track, Lu Chen struck like lightning striking a mountain.'
      )
      const badScenesJson = baseScenesJson.map((s, idx) =>
        idx === 0 ? { ...s, visual_literal: '' } : s
      )
      const m = compiledClean.matrixMarkdown.replace(
        '<visual_literal>literal action only</visual_literal>',
        '<visual_literal></visual_literal>'
      )
      return runAudit({ scriptText: simScript, matrixMarkdown: m, scenesJson: badScenesJson })
    }
  },
  { id: 'FX-32', gate: 'G10_unregistered_entity_blocker', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('Chancellor Wu inspecting the students') }) },
  { id: 'FX-33', gate: 'G10_unregistered_entity_blocker', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('Headmaster Zhao watching from VIP box') }) },
  { id: 'FX-34', gate: 'G10_unregistered_entity_blocker', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('a dark military gunship hovering above') }) },
  { id: 'FX-35', gate: 'G10_unregistered_entity_blocker', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('Sovereign Ye Chen descending from the sky') }) },
  { id: 'FX-36', gate: 'G10_unregistered_entity_blocker', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('the university vice-dean trembling on stage') }) },
  { id: 'FX-37', gate: 'G10_unregistered_entity_blocker', run: () => runAudit({ matrixMarkdown: injectIntoPrompt1('Commander Zhang watching from the gate') }) },
  {
    id: 'FX-38',
    gate: 'G03_entity_binding',
    run: () =>
      runAudit({
        matrixMarkdown: compiledClean.matrixMarkdown.replaceAll('@{Mo Yufeng}', 'Mo Yufeng')
      })
  },
  {
    id: 'FX-39',
    gate: 'G01_parity_and_order',
    run: () =>
      runAudit({
        matrixMarkdown: compiledClean.matrixMarkdown
          .replace('<scene id="IMG_001"', '<scene id="IMG_TEMP"')
          .replace('<scene id="IMG_002"', '<scene id="IMG_001"')
          .replace('<scene id="IMG_TEMP"', '<scene id="IMG_002"')
      })
  },
  {
    id: 'FX-40',
    gate: 'G01_parity_and_order',
    run: () =>
      runAudit({
        matrixMarkdown: compiledClean.matrixMarkdown.replace(
          '<scene id="IMG_002"',
          '<scene id="IMG_001"'
        )
      })
  },
  {
    id: 'FX-41',
    gate: 'G12_spatial_enclosure',
    run: () =>
      runAudit({
        matrixMarkdown: compiledClean.matrixMarkdown.replace(
          'zone="stadium.track"',
          'zone="random_park_gazebo"'
        )
      })
  },
  {
    id: 'FX-42',
    gate: 'G14_compile_integrity',
    run: () =>
      runAudit({
        matrixMarkdown: injectIntoPrompt1('extremely dense filler text '.repeat(80))
      })
  },
  {
    id: 'FX-43',
    gate: 'G13_pacing_and_voice',
    run: () =>
      runAudit({
        audioTelemetry: { voiceId: 'en-US-ChristopherNeural', sceneDurations: { IMG_001: 6.2 } }
      })
  },
  {
    id: 'FX-44',
    gate: 'G17_policy_shield',
    run: () =>
      runAudit({
        matrixMarkdown: injectIntoPrompt1('severed arm spraying blood across floor')
      })
  }
]

console.log('='.repeat(78))
console.log('  MANHWA RECAP STUDIO â€” 44-FIXTURE MUTATION TEST RUNNER (FX-01 .. FX-44)')
console.log('='.repeat(78))

const cleanReport = runAudit()
if (!cleanReport.isProductionReady) {
  console.error('\x1b[31m[FATAL]\x1b[0m Clean baseline failed pre-flight:', cleanReport.checks.filter(c => !c.passed))
  process.exit(1)
}
console.log('\x1b[32m[BASELINE PASS]\x1b[0m Clean compiled matrix passed all gates (100/100).\n')

let passedCount = 0
for (const fx of fixtures) {
  const res = fx.run()
  const targetGateObj = res.checks.find(c => c.id === fx.gate)
  const caught = targetGateObj && !targetGateObj.passed
  if (caught) {
    passedCount++
    console.log(`\x1b[32m[PASS]\x1b[0m ${fx.id} -> Caught deterministically by ${fx.gate}`)
  } else {
    console.error(`\x1b[31m[FAIL]\x1b[0m ${fx.id} -> MISSED by ${fx.gate}!`)
  }
}

console.log('-'.repeat(78))
console.log(`Mutation Suite Result: ${passedCount}/${fixtures.length} Defects Caught Deterministically.`)
console.log('='.repeat(78))
process.exit(passedCount === fixtures.length ? 0 : 1)

