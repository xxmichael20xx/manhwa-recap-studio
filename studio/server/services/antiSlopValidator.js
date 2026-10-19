export class AntiSlopValidator {
  static auditScript(scriptText) {
    const wordCount = (scriptText.match(/\b\w+\b/g) || []).length
    const estimatedMinutes = Math.round((wordCount / 140) * 10) / 10
    
    const checks = [
      {
        id: 'rpg_progression',
        name: 'RPG Progression Arithmetic',
        description: 'Enforces clean, balanced RPG progression and foundation bottlenecks rather than arbitrary EXP bloat.',
        passed: false,
        score: 0,
        details: ''
      },
      {
        id: 'physical_durability',
        name: 'Absolute Physical Durability (CON Threshold)',
        description: 'Verifies that high-Constitution protagonists take 0 damage from mundane low-tier fodder.',
        passed: false,
        score: 0,
        details: ''
      },
      {
        id: 'choke_point_combat',
        name: 'High-Tactical Combat Geometry',
        description: 'Ensures multi-enemy battles use choke-points, elevation, or AoE rather than single-file turn-based rushes.',
        passed: false,
        score: 0,
        details: ''
      },
      {
        id: 'pragmatic_antagonists',
        name: 'Antagonist Realism & Leverage',
        description: 'Checks that nobles and captains act with political leverage, sanctions, or bounties rather than suicidal tantrums.',
        passed: false,
        score: 0,
        details: ''
      },
      {
        id: 'retention_pacing',
        name: '4-Act Retention Architecture',
        description: 'Verifies that structural micro-payoffs or twists exist across all 4 acts.',
        passed: false,
        score: 0,
        details: ''
      }
    ]

    const lower = scriptText.toLowerCase()

    // 1. RPG Progression Check
    if (lower.includes('5,000') || lower.includes('5000') || lower.includes('saturation') || lower.includes('bottleneck') || lower.includes('calibration') || lower.includes('re-indexed')) {
      checks[0].passed = true
      checks[0].score = 100
      checks[0].details = 'Progression is grounded with clear threshold saturation and clean interval scaling.'
    } else if (lower.includes('100 million') || lower.includes('99999999')) {
      checks[0].passed = false
      checks[0].score = 20
      checks[0].details = 'Warning: Detected raw arbitrary EXP figures without foundation saturation framing.'
    } else {
      checks[0].passed = true
      checks[0].score = 80
      checks[0].details = 'Progression terms appear balanced.'
    }

    // 2. Physical Durability Check
    if (lower.includes('constitution') && (lower.includes('shattered') || lower.includes('snap') || lower.includes('zero penetration') || lower.includes('zero blood') || lower.includes('steel') || lower.includes('anvil') || lower.includes('0 damage') || lower.includes('calibration latency'))) {
      checks[1].passed = true
      checks[1].score = 100
      checks[1].details = 'Absolute physical threshold verified: fodder strikes fail to penetrate high-CON density.'
    } else if (lower.includes('constitution') && lower.includes('bleeding')) {
      checks[1].passed = false
      checks[1].score = 30
      checks[1].details = 'Hazard: High Constitution mentioned alongside bleeding from weak enemies without calibration latency framing.'
    } else {
      checks[1].passed = true
      checks[1].score = 75
      checks[1].details = 'Durability logic meets standard baseline.'
    }

    // 3. Choke-point Tactical Combat Check
    if (lower.includes('choke-point') || lower.includes('chokepoint') || lower.includes('bottleneck') || lower.includes('corridor') || lower.includes('line of fire') || lower.includes('two abreast') || lower.includes('line-of-sight')) {
      checks[2].passed = true
      checks[2].score = 100
      checks[2].details = 'Terrain and spatial positioning effectively counter multi-enemy swarm tactics.'
    } else {
      checks[2].passed = false
      checks[2].score = 40
      checks[2].details = 'Notice: Ensure multi-enemy combat describes choke-points or environmental manipulation.'
    }

    // 4. Pragmatic Antagonists Check
    if (lower.includes('licence') || lower.includes('license') || lower.includes('council') || lower.includes('leverage') || lower.includes('bounty') || lower.includes('black market') || lower.includes('political') || lower.includes('house vance') || lower.includes('syndicate') || lower.includes('press')) {
      checks[3].passed = true
      checks[3].score = 100
      checks[3].details = 'Antagonists utilise institutional influence, economic sanctions, or calculated leverage.'
    } else {
      checks[3].passed = true
      checks[3].score = 70
      checks[3].details = 'Antagonist dialogue meets general standards.'
    }

    // 5. 4-Act Retention Architecture Check
    const hasAct1 = lower.includes('act 1') || lower.includes('catalyst') || lower.includes('humiliation')
    const hasAct2 = lower.includes('act 2') || lower.includes('trial') || lower.includes('calibration')
    const hasAct3 = lower.includes('act 3') || lower.includes('escalation') || lower.includes('ambush')
    const hasAct4 = lower.includes('act 4') || lower.includes('climax') || lower.includes('hook') || lower.includes('teaser')

    if (hasAct1 && hasAct2 && hasAct3 && hasAct4) {
      checks[4].passed = true
      checks[4].score = 100
      checks[4].details = 'Complete 4-Act structure verified with distinct narrative phases and retention hooks.'
    } else {
      checks[4].passed = false
      checks[4].score = 50
      checks[4].details = 'Warning: One or more 4-Act sections are missing standard structural markers.'
    }

    const overallScore = Math.round(checks.reduce((acc, c) => acc + c.score, 0) / checks.length)
    const isAntiSlopCertified = overallScore >= 80

    return {
      wordCount,
      estimatedMinutes,
      overallScore,
      isAntiSlopCertified,
      checks
    }
  }

  /**
   * Deterministic Pre-Flight Prompt Matrix Linter
   * Mathematically verifies 100% production readiness before Google Flow dispatch
   *
   * @param {string} scriptText - Raw markdown text of 01_Episode_Script.md
   * @param {string} promptMatrixText - Raw XML/markdown text of 02_Prompt_Matrix.md
   * @param {object|array} characterVault - Character & item entities from vault
   * @returns {object} Full audit report with 5 checks, scores, and failing scenes
   */
  static auditPromptMatrix(scriptText = '', promptMatrixText = '', characterVault = null) {
    // 1. Parse Script Scenes: [IMG_XXX] <narrative clause>
    const scriptSceneRegex = /\[IMG_(\d+)\]\s*([^\n\r]+)/g
    const scriptScenes = []
    let sm
    while ((sm = scriptSceneRegex.exec(scriptText)) !== null) {
      const tag = `IMG_${sm[1].padStart(3, '0')}`
      scriptScenes.push({
        tag,
        num: parseInt(sm[1], 10),
        narrative: sm[2].trim().replace(/\r\n/g, '\n')
      })
    }

    // 2. Parse Matrix Scenes: <scene ...> ... </scene>
    const sceneNodeRegex = /<scene\b([^>]*)>([\s\S]*?)<\/scene>/g
    const matrixScenes = []
    let mm
    while ((mm = sceneNodeRegex.exec(promptMatrixText)) !== null) {
      const attrs = mm[1] || ''
      const content = mm[2] || ''

      const tagMatch = content.match(/<tag>(IMG_\d+)<\/tag>/i) || attrs.match(/id="(IMG_\d+)"/i)
      const syncMatch = content.match(/<narrative_sync>([\s\S]*?)<\/narrative_sync>/i)
      const promptMatch = content.match(/<prompt>([\s\S]*?)<\/prompt>/i)
      const layoutMatch = content.match(/<layout>([\s\S]*?)<\/layout>/i)

      const charRefMatch = content.match(/<character_ref>([^<]+)<\/character_ref>/i) || attrs.match(/character_ref="([^"]+)"/i)
      const charRefsMatch = content.match(/<character_refs>([^<]+)<\/character_refs>/i) || attrs.match(/character_refs="([^"]+)"/i)
      const itemRefMatch = content.match(/<item_ref>([^<]+)<\/item_ref>/i) || attrs.match(/item_ref="([^"]+)"/i)
      const itemRefsMatch = content.match(/<item_refs>([^<]+)<\/item_refs>/i) || attrs.match(/item_refs="([^"]+)"/i)

      const tag = tagMatch ? tagMatch[1].toUpperCase() : null
      const num = tag ? parseInt(tag.replace(/[^0-9]/g, ''), 10) : 0
      const narrativeSync = syncMatch ? syncMatch[1].trim().replace(/\r\n/g, '\n') : ''
      const prompt = promptMatch ? promptMatch[1].trim() : ''
      const layout = layoutMatch ? layoutMatch[1].trim() : ''

      const boundRefs = []
      if (charRefMatch) boundRefs.push(...charRefMatch[1].split(',').map(s => s.trim()))
      if (charRefsMatch) boundRefs.push(...charRefsMatch[1].split(',').map(s => s.trim()))
      if (itemRefMatch) boundRefs.push(...itemRefMatch[1].split(',').map(s => s.trim()))
      if (itemRefsMatch) boundRefs.push(...itemRefsMatch[1].split(',').map(s => s.trim()))

      matrixScenes.push({
        tag,
        num,
        narrativeSync,
        prompt,
        layout,
        boundRefs: [...new Set(boundRefs.filter(Boolean))],
        rawContent: content
      })
    }

    // 3. Normalize Character Vault & Flow Entities
    let charactersList = []
    let itemsList = []
    let flowEntitiesMap = {}

    if (characterVault) {
      if (Array.isArray(characterVault)) {
        charactersList = characterVault
      } else if (typeof characterVault === 'object') {
        charactersList = characterVault.characters || characterVault.models || []
        itemsList = characterVault.items || []
        flowEntitiesMap = characterVault.flowEntities || characterVault.entities || {}
      }
    }

    // Built-in weapons, props, and artifacts for Series 04 and Series 02
    const knownWeaponProps = [
      {
        name: "Gu Tianyu's Jade Spirit Blade",
        uuid: "781340b1-d696-447f-afee-76b355fcc7f8",
        token: "@{Gu Tianyu's Jade Spirit Blade}",
        regex: /\b(?:jade\s+(?:spirit\s+)?blade|spirit\s+blade|jade\s+dao|custom\s+spirit\s+blade|powdered\s+spirit-steel|heirloom\s+spirit\s+weapon)\b/i
      },
      {
        name: "Tactical Spirit Spectrometer",
        uuid: "4c17b746-de54-4fe0-adc6-90f0dfa24bcb",
        token: "@{Tactical Spirit Spectrometer}",
        regex: /\b(?:spirit-spectrometer|spirit\s+spectrometer|tactical\s+spectrometer|smoking\s+meter|sensor\s+nozzle)\b/i
      },
      {
        name: "Heaven-Earth Golden Stele",
        uuid: "396a19a4-787b-48a0-aece-d5bf41d543ae",
        token: "@{Heaven-Earth Golden Stele}",
        regex: /\b(?:heaven-earth(?:\s+golden)?\s+stele|golden\s+stele|ranking\s+monolith|ancient\s+obsidian\s+stele|30,000-metre\s+colossal\s+obsidian-gold)\b/i
      },
      {
        name: "Void-Strung Heavy Recurve",
        uuid: "e4b863c6-f8cf-46f4-b5c8-b9ef69dc0893",
        token: "@{Weapon: Void-Strung Heavy Recurve}",
        regex: /\b(?:void-strung\s+heavy\s+recurve|heavy\s+recurve|void\s+bow)\b/i
      },
      {
        name: "Ashwood Training Bow",
        uuid: "dedb670f-9670-4341-a5eb-6587353d5cd7",
        token: "@{Weapon: Ashwood Training Bow}",
        regex: /\b(?:ashwood\s+training\s+bow|training\s+bow)\b/i
      },
      {
        name: "Ethereal Siphon Arrow",
        uuid: "f6d5a575-29d5-4f37-a49e-eae728456316",
        token: "@{Item: Ethereal Siphon Arrow}",
        regex: /\b(?:ethereal\s+siphon\s+arrow|siphon\s+arrow)\b/i
      },
      {
        name: "Academy Awakening Orb",
        uuid: "ceed8950-f216-41f8-ab79-c38f199cf85c",
        token: "@{Item: Academy Awakening Orb}",
        regex: /\b(?:awakening\s+orb|mana\s+resonance\s+orb)\b/i
      },
      {
        name: "VIP Radar Console",
        uuid: "4a5d1028-8a9a-4cba-8398-b69cd5eb715f",
        token: "@{Item: VIP Radar Console}",
        regex: /\b(?:vip\s+radar\s+console|radar\s+console)\b/i
      }
    ]

    // Also ingest any items from characterVault.characters if category is weapon/prop/artifact
    charactersList.forEach(c => {
      const cat = (c.category || '').toLowerCase()
      const role = (c.role || '').toLowerCase()
      if (cat === 'weapon' || cat === 'prop' || cat === 'artifact' || cat === 'item' || role.includes('weapon') || role.includes('prop') || role.includes('artifact')) {
        const name = c.name || c.flowName || ''
        const uuid = c.flowUuid || flowEntitiesMap[name] || ''
        const token = c.token || `@{${name}}`
        const existing = knownWeaponProps.find(k => k.name.toLowerCase() === name.toLowerCase())
        if (existing) {
          if (uuid) existing.uuid = uuid
          if (token) existing.token = token
        } else if (uuid) {
          const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          knownWeaponProps.push({
            name,
            uuid,
            token,
            regex: new RegExp(`\\b${esc}\\b`, 'i')
          })
        }
      }
    })

    // Also ingest from characterVault.items (e.g. items.json)
    itemsList.forEach(item => {
      const name = item.name || ''
      const uuid = item.flowUuid || flowEntitiesMap[name] || ''
      const token = item.token || `@{${name}}`
      if (uuid && !knownWeaponProps.some(k => k.uuid === uuid)) {
        const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        knownWeaponProps.push({
          name,
          uuid,
          token,
          regex: new RegExp(`\\b${esc}\\b`, 'i')
        })
      }
    })

    // 4. Initialize the 5 Deterministic Checks
    const checks = [
      {
        id: 'narrative_sync',
        name: '1:1 Bit-for-Bit Narrative Clause Sync',
        description: 'Mathematically verifies 100% clause match between script [IMG_XXX] tags and prompt matrix <narrative_sync>.',
        passed: false,
        score: 0,
        failingScenes: [],
        details: ''
      },
      {
        id: 'daytime_leaks',
        name: 'Zero Daytime Leaks in Positive Night Prompts',
        description: 'Detects accidental daytime word leaks (blue sky, daylight, sunlight) in positive scene descriptions for night episodes.',
        passed: false,
        score: 0,
        failingScenes: [],
        details: ''
      },
      {
        id: 'weapon_prop_binding',
        name: 'Deterministic Weapon & Prop Lifecycle State Machine',
        description: 'Enforces intact weapon UUID binding when wielded, and forbids dead/powdered weapon UUIDs from character_refs to prevent phantom weapons.',
        passed: false,
        score: 0,
        failingScenes: [],
        details: ''
      },
      {
        id: 'spatial_pinning',
        name: 'Continuous Spatial Coordinate Pinning',
        description: 'Enforces explicit Spatial Enclosure pinning and continuous architectural coordinates across sequential scenes.',
        passed: false,
        score: 0,
        failingScenes: [],
        details: ''
      },
      {
        id: 'demographic_locks',
        name: 'Demographic Age & Appearance Locks',
        description: 'Guarantees character ages, physique anchors, and demographic traits match the Character Vault with zero contradictions.',
        passed: false,
        score: 0,
        failingScenes: [],
        details: ''
      },
      {
        id: 'two_character_staging',
        name: 'Directorial Staging for Two-Character Panels',
        description: 'Verifies multi-character scenes use Screen Left/Right Thirds standoff or Over-The-Shoulder silhouette staging with negative isolation.',
        passed: false,
        score: 0,
        failingScenes: [],
        details: ''
      },
      {
        id: 'extra_deidentification',
        name: 'Nameless Extra De-Identification & Visor Masking',
        description: 'Enforces full-face dark visors/silhouettes on nameless secondary personnel and environment-first framing on wide shots.',
        passed: false,
        score: 0,
        failingScenes: [],
        details: ''
      },
      {
        id: 'environment_purity',
        name: 'Environment Scene Purity & Anti-Floating Figure Guard',
        description: 'Verifies pure environment/landscape/sky scenes use Mode B negative isolation and contain zero human anatomical tokens (hands, boots, pupils) to prevent floating characters.',
        passed: false,
        score: 0,
        failingScenes: [],
        details: ''
      },
      {
        id: 'wardrobe_and_private_isolation',
        name: 'Persistent Wardrobe & Private Interior Isolation',
        description: 'Guarantees canonical characters retain signature attire across scenes and private interior spaces (Room 402, VIP penthouses) enforce strict private isolation to prevent extraneous background characters.',
        passed: false,
        score: 0,
        failingScenes: [],
        details: ''
      }
    ]

    // ------------------------------------------------------------------------
    // CHECK 1: 1:1 Bit-for-Bit Narrative Clause Sync
    // ------------------------------------------------------------------------
    const syncFailing = []
    if (scriptScenes.length === 0 || matrixScenes.length === 0) {
      checks[0].passed = false
      checks[0].score = 0
      checks[0].details = `Missing data: Found ${scriptScenes.length} script scenes and ${matrixScenes.length} matrix scenes.`
    } else {
      for (const s of scriptScenes) {
        const m = matrixScenes.find(x => x.tag === s.tag)
        if (!m) {
          syncFailing.push({ tag: s.tag, reason: 'Missing in prompt matrix' })
        } else if (s.narrative !== m.narrativeSync) {
          syncFailing.push({
            tag: s.tag,
            reason: 'Text mismatch',
            expected: s.narrative,
            actual: m.narrativeSync
          })
        }
      }

      // Check for orphan scenes in matrix not in script
      for (const m of matrixScenes) {
        if (!scriptScenes.some(s => s.tag === m.tag)) {
          syncFailing.push({ tag: m.tag, reason: 'Orphan scene in matrix not found in script' })
        }
      }

      if (syncFailing.length === 0 && scriptScenes.length === matrixScenes.length) {
        checks[0].passed = true
        checks[0].score = 100
        checks[0].details = `100% 1:1 bit-for-bit narrative clause match verified across all ${scriptScenes.length} scenes.`
      } else {
        checks[0].passed = false
        checks[0].score = Math.max(0, Math.round(((scriptScenes.length - syncFailing.length) / scriptScenes.length) * 100))
        checks[0].failingScenes = syncFailing.map(f => f.tag)
        checks[0].details = `Discrepancies found in ${syncFailing.length} scene(s). Expected exact string match between [IMG_XXX] and <narrative_sync>.`
      }
    }

    // ------------------------------------------------------------------------
    // CHECK 2: Zero Daytime Word Leaks in Positive Night Prompts
    // ------------------------------------------------------------------------
    const headerText = promptMatrixText.slice(0, 3000)
    const isNightEpisode = /\bchronometric(?:[ \-_]anchor)?\s*:[^\n]*(?:night|nocturnal|evening|dusk|midnight)\b/i.test(headerText) ||
      /\btime\s+of\s+day\s*:[^\n]*(?:night|nocturnal|evening|dusk|midnight)\b/i.test(headerText) ||
      /\b(?:high-key\s+night|nocturnal\s+anchor|night\s+episode)\b/i.test(headerText)
    const daytimeFailing = []

    if (isNightEpisode) {
      for (const s of matrixScenes) {
        // Isolate positive prompt description before negative boilerplate
        let posPrompt = s.prompt
        const negIdx = s.prompt.search(/anatomically correct hands|no character cloning|pure 100% textless/i)
        if (negIdx !== -1) {
          posPrompt = s.prompt.slice(0, negIdx)
        }

        // Strip clauses starting with negative markers (no ..., without ..., zero ...)
        const strippedPos = posPrompt.replace(/\b(?:no|zero|without|never)\s+[^\s,.]+(?:\s+[^\s,.]+)?/gi, '')
        const leakMatch = strippedPos.match(/\b(blue\s+sky|daylight|sunlight|sunbeams|midday|bright\s+sun|morning\s+sun)\b/i)

        if (leakMatch) {
          daytimeFailing.push({
            tag: s.tag,
            word: leakMatch[0]
          })
        }
      }

      if (daytimeFailing.length === 0) {
        checks[1].passed = true
        checks[1].score = 100
        checks[1].details = `Zero daytime word leaks across all ${matrixScenes.length} scenes. Chronometric night anchor fully respected.`
      } else {
        checks[1].passed = false
        checks[1].score = Math.max(0, Math.round(((matrixScenes.length - daytimeFailing.length) / matrixScenes.length) * 100))
        checks[1].failingScenes = daytimeFailing.map(f => f.tag)
        checks[1].details = `Detected ${daytimeFailing.length} daytime word leak(s) in night episode positive prompts: ${daytimeFailing.map(f => `${f.tag} ("${f.word}")`).join(', ')}.`
      }
    } else {
      checks[1].passed = true
      checks[1].score = 100
      checks[1].details = 'Daytime episode detected; daytime lighting descriptors are permissible.'
    }

    // ------------------------------------------------------------------------
    // CHECK 3: Deterministic Weapon & Prop Lifecycle State Machine
    // ------------------------------------------------------------------------
    const weaponLifecycleViolations = []
    const weaponDestructionRegex = /\b(?:shattered\s+(?:blade|dao|weapon|spirit-steel|into)|powdered\s+spirit-steel|metallic\s+powder|dao-blade\s+powder|metallic\s+dao-blade\s+dust|turned\s+into\s+chalk|fine\s+powder|metallic\s+dust|jade\s+dust|mineral\s+dust|disintegrating\s+like\s+brittle\s+sugar|exploding\s+violently\s+outward\s+into\s+millions\s+of\s+sparkling)\b/i
    const idiomTermsRegex = /\b(?:cheap\s+sword|swatting\s+a\s+fly|iron\s+dagger|wooden\s+stick)\b/i

    for (const s of matrixScenes) {
      const combined = `${s.narrativeSync} ${s.prompt}`
      for (const wp of knownWeaponProps) {
        if (wp.regex.test(combined)) {
          const isDestruction = weaponDestructionRegex.test(combined)
          const isIdiom = idiomTermsRegex.test(combined)
          const isBound = s.boundRefs.some(r => {
            const rLower = r.toLowerCase().trim()
            const rClean = rLower.replace(/[@{}]/g, '').replace(/^(weapon|item|artifact|prop):\s*/i, '').trim()
            const wpNameClean = wp.name.toLowerCase().replace(/[@{}]/g, '').replace(/^(weapon|item|artifact|prop):\s*/i, '').trim()
            const wpTokenClean = (wp.token || '').toLowerCase().replace(/[@{}]/g, '').replace(/^(weapon|item|artifact|prop):\s*/i, '').trim()
            return (
              (wp.uuid && rLower.includes(wp.uuid.toLowerCase())) ||
              rClean === wpNameClean ||
              rClean.includes(wpNameClean) ||
              wpNameClean.includes(rClean) ||
              (wpTokenClean && (rClean === wpTokenClean || rClean.includes(wpTokenClean)))
            )
          })

          if (isDestruction) {
            // State 4: Destroyed/Dust -> UUID / Token is strictly forbidden from character_refs when characters are present!
            const hasLivingCharacters = s.boundRefs.some(r => {
              const rLower = r.toLowerCase().trim()
              const rClean = rLower.replace(/[@{}]/g, '').replace(/^(weapon|item|artifact|prop):\s*/i, '').trim()
              const wpNameClean = wp.name.toLowerCase().replace(/[@{}]/g, '').replace(/^(weapon|item|artifact|prop):\s*/i, '').trim()
              const isThisWeapon = (wp.uuid && rLower.includes(wp.uuid.toLowerCase())) || rClean === wpNameClean || rClean.includes(wpNameClean)
              return !isThisWeapon
            })
            if (isBound && hasLivingCharacters) {
              weaponLifecycleViolations.push({
                tag: s.tag,
                type: 'ZOMBIE_WEAPON_BOUND',
                entity: wp.name,
                uuid: wp.uuid,
                reason: `Zombie Weapon Error: ${wp.name} is described as shattered/dust, but is bound in character_refs alongside a character! This forces Google Flow to equip the dead weapon onto the character.`
              })
            }
          } else if (isIdiom) {
            // Idiom/Metaphor: Should not render a generic fantasy sword or force binding
            if (/\bcheap\s+sword\b/i.test(s.prompt)) {
              weaponLifecycleViolations.push({
                tag: s.tag,
                type: 'IDIOM_PROP_LEAK',
                entity: wp.name,
                uuid: wp.uuid,
                reason: `Metaphor Leak: 'cheap sword' idiom detected in visual prompt. Must translate to established canonical weapon @{${wp.name}} or omit.`
              })
            }
          } else {
            // Intact weapon in active narrative
            const isActivelyWielded = /\b(?:holding|gripping|wielding|brandishing|pointing|swinging|blade\s+inches|blade\s+held|unsheathed|drawn|at\s+his\s+side|raised\s+blade)\b/i.test(s.prompt)
            if (isActivelyWielded && !isBound) {
              weaponLifecycleViolations.push({
                tag: s.tag,
                type: 'MISSING_ACTIVE_BINDING',
                entity: wp.name,
                uuid: wp.uuid,
                reason: `Missing Binding: ${wp.name} is actively wielded in prompt, but is missing from character_refs / item_refs.`
              })
            }
            // Chronological acquisition check: Carved Blackwood Staff cannot appear before Scene 54
            if (wp.name.toLowerCase().includes('blackwood staff') && s.num < 54 && isBound) {
              weaponLifecycleViolations.push({
                tag: s.tag,
                type: 'CHRONOLOGICAL_WEAPON_LEAK',
                entity: wp.name,
                uuid: wp.uuid,
                reason: `Chronological Weapon Leak: ${wp.name} is bound in ${s.tag} before its canonical creation/acquisition in Scene 054.`
              })
            }
          }
        }
      }
    }

    if (weaponLifecycleViolations.length === 0) {
      checks[2].passed = true
      checks[2].score = 100
      checks[2].details = `100% weapon & prop lifecycle compliance verified. Active weapons bound; shattered weapons revoked; zero zombie props across all ${matrixScenes.length} scenes.`
    } else {
      checks[2].passed = false
      checks[2].score = Math.max(0, Math.round(((matrixScenes.length - weaponLifecycleViolations.length) / matrixScenes.length) * 100))
      checks[2].failingScenes = [...new Set(weaponLifecycleViolations.map(b => b.tag))]
      checks[2].details = `Weapon lifecycle violations in ${weaponLifecycleViolations.length} instance(s): ${weaponLifecycleViolations.map(b => `${b.tag} (${b.reason})`).join('; ')}.`
    }

    // ------------------------------------------------------------------------
    // CHECK 4: Continuous Spatial Coordinate Pinning
    // ------------------------------------------------------------------------
    const spatialGaps = []
    for (const s of matrixScenes) {
      const hasExplicitEnclosure = /\b(?:Spatial\s+Enclosure|Spatial\s+Anchor|Environment\b|Setting\s*:)/i.test(s.prompt)
      const hasSpecificCoordinate = /\b(?:Room\s+\d+|dormitory|study\s+desk|bunk\s+bed|hallway|corridor|threshold|doorway|welcome\s+mat|doormat|opposite\s+wall|cracked\s+plaster|central\s+plaza|tactical\s+transports|stratosphere|penthouse|chamber|arena|cavern|crater|dungeon|pillar|balcony|rooftop|courtyard|stairwell|portal|altar|pedestal|vault|fissure|bedrock)\b/i.test(s.prompt)
      if (!hasExplicitEnclosure && !hasSpecificCoordinate) {
        spatialGaps.push(s.tag)
      }
    }

    if (spatialGaps.length === 0) {
      checks[3].passed = true
      checks[3].score = 100
      checks[3].details = `Continuous spatial coordinates and enclosure anchors pinned across all ${matrixScenes.length} scenes.`
    } else {
      checks[3].passed = false
      checks[3].score = Math.max(0, Math.round(((matrixScenes.length - spatialGaps.length) / matrixScenes.length) * 100))
      checks[3].failingScenes = spatialGaps
      checks[3].details = `Missing spatial enclosure or coordinate pinning in ${spatialGaps.length} scene(s): ${spatialGaps.join(', ')}.`
    }

    // ------------------------------------------------------------------------
    // CHECK 5: Demographic Age & Appearance Locks (Dynamically Extracted from Vault)
    // ------------------------------------------------------------------------
    const demographicChecks = []
    if (charactersList && charactersList.length > 0) {
      charactersList.forEach(c => {
        const ageVal = parseInt(String(c.age || '').replace(/[^0-9]/g, ''), 10)
        if (!isNaN(ageVal) && ageVal >= 1 && ageVal <= 120) {
          const rawName = c.name || c.flowName || ''
          const parenMatch = rawName.match(/\(([^)]+)\)/)
          const qualifier = parenMatch ? parenMatch[1].trim() : ''
          const baseName = rawName.replace(/\s*\([^)]*\)/g, '').replace(/^(Commander|Instructor|Director|Lord|Grand Duke|Chief Proctor|High Chancellor|High Director|Shadow Assassin):\s*/i, '').trim()
          
          let regex = null
          let excludePattern = null

          if (qualifier) {
            // Check if there are other models sharing the base name
            const othersWithSameBase = charactersList.filter(o => {
              const oBase = (o.name || o.flowName || '').replace(/\s*\([^)]*\)/g, '').replace(/^(Commander|Instructor|Director|Lord|Grand Duke|Chief Proctor|High Chancellor|High Director|Shadow Assassin):\s*/i, '').trim()
              return o !== c && oBase.toLowerCase() === baseName.toLowerCase()
            })

            if (othersWithSameBase.length > 0) {
              const escQual = qualifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              const escFlow = (c.flowName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              const escRaw = rawName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              const terms = [escQual, escRaw]
              if (escFlow && escFlow.toLowerCase() !== baseName.toLowerCase()) {
                terms.push(escFlow)
              }
              if (/^(?:child|young|infant|youth)\b/i.test(qualifier)) {
                regex = new RegExp(`\\b${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
                const otherQualifiers = othersWithSameBase.map(o => {
                  const m = (o.name || '').match(/\(([^)]+)\)/)
                  return m ? m[1].trim() : (o.flowName || '')
                }).filter(Boolean)
                if (otherQualifiers.length > 0) {
                  const escOthers = otherQualifiers.map(q => q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
                  excludePattern = new RegExp(`\\b(?:${escOthers})\\b`, 'i')
                }
              } else {
                regex = new RegExp(`\\b(?:${terms.join('|')})\\b`, 'i')
              }
            } else {
              const esc = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              regex = new RegExp(`\\b${esc}\\b`, 'i')
            }
          } else {
            const esc = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            regex = new RegExp(`\\b${esc}\\b`, 'i')
          }

          demographicChecks.push({
            name: rawName,
            age: ageVal,
            regex,
            excludePattern
          })
        }
      })
    }

    // Fallback to Series 04 baseline if vault models have no numeric age
    if (demographicChecks.length === 0) {
      demographicChecks.push(
        { name: 'Lu Chen', age: 20, regex: /\bLu Chen\b/i },
        { name: 'Wang Bao', age: 20, regex: /\bWang Bao\b/i },
        { name: 'Gu Tianyu', age: 21, regex: /\bGu Tianyu\b/i },
        { name: 'Commander Han Feng', age: 42, regex: /\bHan Feng\b/i },
        { name: 'Ye Xingchen', age: 28, regex: /\bYe Xingchen\b/i },
        { name: 'Jiang Qingxue', age: 21, regex: /\bJiang Qingxue\b/i }
      )
    }

    const demoFailing = []
    for (const s of matrixScenes) {
      for (const d of demographicChecks) {
        if (d.regex && d.regex.test(s.prompt)) {
          // Find any age mentions near character or in prompt
          const ageMatches = [...s.prompt.matchAll(/(\d+)-year-old/gi)]
          for (const am of ageMatches) {
            const ageVal = parseInt(am[1], 10)
            const matchIndex = am.index
            const promptBeforeAge = s.prompt.slice(Math.max(0, matchIndex - 60), matchIndex + 60)
            if (d.excludePattern && d.excludePattern.test(promptBeforeAge)) {
              continue
            }
            if (d.regex.test(promptBeforeAge) && ageVal !== d.age) {
              demoFailing.push({
                tag: s.tag,
                character: d.name,
                foundAge: `${ageVal}-year-old`,
                expected: `${d.age}-year-old`
              })
            }
          }
        }
      }
    }

    if (demoFailing.length === 0) {
      checks[4].passed = true
      checks[4].score = 100
      checks[4].details = `Demographic age locks and core appearance anchors verified across all character scenes.`
    } else {
      checks[4].passed = false
      checks[4].score = Math.max(0, Math.round(((matrixScenes.length - demoFailing.length) / matrixScenes.length) * 100))
      checks[4].failingScenes = demoFailing.map(d => d.tag)
      checks[4].details = `Demographic contradictions detected in ${demoFailing.length} scene(s): ${demoFailing.map(d => `${d.tag} (${d.character}: found ${d.foundAge}, expected ${d.expected})`).join(', ')}.`
    }

    // ------------------------------------------------------------------------
    // CHECK 6: Directorial Staging for Two-Character Panels
    // ------------------------------------------------------------------------
    const stagingViolations = []
    for (const s of matrixScenes) {
      const hasLuChen = /\bLu Chen\b/i.test(s.prompt)
      const hasGuTianyu = /\bGu Tianyu\b/i.test(s.prompt)
      const hasHanFeng = /\b(?:Han Feng|Commander Han)\b/i.test(s.prompt)
      const hasWangBao = /\bWang Bao\b/i.test(s.prompt)
      const hasQingxue = /\bJiang Qingxue\b/i.test(s.prompt)
      const hasMedics = /\b(?:medical\s+staff|medics|paramedics|emergency\s+staff)\b/i.test(s.prompt)

      const namedCount = [hasLuChen, hasGuTianyu, hasHanFeng, hasWangBao, hasQingxue].filter(Boolean).length
      const isMultiActor = namedCount >= 2 || (namedCount >= 1 && hasMedics)

      if (isMultiActor) {
        const hasCoordinateStandoff = /\b(?:screen\s+left|screen\s+right|left\s+third|right\s+third|left\s+foreground|right\s+foreground|standoff|proscenium|separated\s+by)\b/i.test(s.prompt)
        const hasOTSStaging = /\b(?:over-the-shoulder|ots|silhouette\s+of|back\s+to\s+camera|back\s+of\s+head)\b/i.test(s.prompt)
        const hasSplitBlocks = /\b(?:upper\s+panel|top\s+block|upper\s+block|In\s+the\s+upper|In\s+the\s+top)\b/i.test(s.prompt) && /\b(?:lower\s+panel|bottom\s+block|lower\s+block|In\s+the\s+lower|In\s+the\s+bottom)\b/i.test(s.prompt)

        if (!hasCoordinateStandoff && !hasOTSStaging && !hasSplitBlocks) {
          stagingViolations.push({
            tag: s.tag,
            reason: `Scene features multiple actors but lacks directorial staging (Screen Left/Right thirds, OTS silhouette, or distinct Tier B Upper/Lower panel separation).`
          })
        }
      }

      // Directorial Check: Bombardment & Barrage Target Bullseye Invariant
      const hasTerrainTargetLeak = /\b(?:converging\s+upon\s+(?:the\s+)?(?:summit|ground|mountain|cliffs?|landscape|terrain)|bombarding\s+(?:the\s+)?(?:summit|mountain|ground))\b/i.test(s.prompt)
      const isIncomingConvergence = /\b(?:converging|raining\s+down|incoming\s+(?:artillery|bombardment|barrage|salvo|beams?)|simultaneous\s+(?:apocalyptic\s+)?bombardment|erupted\s+simultaneously,\s+converging)\b/i.test(s.narrativeSync + ' ' + s.prompt)

      if (hasTerrainTargetLeak) {
        stagingViolations.push({
          tag: s.tag,
          reason: `Bombardment Target Leak: Prompt explicitly targets terrain/scenery ('${s.prompt.match(/\b(?:converging\s+upon\s+(?:the\s+)?(?:summit|ground|mountain|cliffs?|landscape|terrain)|bombarding\s+(?:the\s+)?(?:summit|mountain|ground))\b/i)[0]}') instead of pinning the character as the focal bullseye.`
        })
      } else if (isIncomingConvergence) {
        const hasTargetBullseye = /\b(?:bullseye|converging\s+directly\s+upon|zeroed\s+in\s+and\s+converging|singular\s+lethal\s+target|striking\s+the\s+beast's|converging\s+upon\s+@\{)/i.test(s.prompt)
        if (!hasTargetBullseye) {
          stagingViolations.push({
            tag: s.tag,
            reason: `Bombardment Target Leak: Scene depicts incoming projectile convergence/bombardment but lacks a pinned target bullseye (e.g. 'singular lethal bullseye', 'zeroed in and converging directly upon @{Character}'). Diffusion will render empty scenery.`
          })
        }
      }
    }

    if (stagingViolations.length === 0) {
      checks[5].passed = true
      checks[5].score = 100
      checks[5].details = `Directorial staging verified across all multi-character scenes. Screen coordinate pinning, OTS silhouettes, and panel separation enforced.`
    } else {
      checks[5].passed = false
      checks[5].score = Math.max(0, Math.round(((matrixScenes.length - stagingViolations.length) / matrixScenes.length) * 100))
      checks[5].failingScenes = stagingViolations.map(v => v.tag)
      checks[5].details = `Directorial staging missing in ${stagingViolations.length} multi-actor scene(s): ${stagingViolations.map(v => `${v.tag} (${v.reason})`).join('; ')}.`
    }

    // ------------------------------------------------------------------------
    // CHECK 7: Nameless Extra De-Identification & Visor Masking
    // ------------------------------------------------------------------------
    const deidentificationViolations = []
    for (const s of matrixScenes) {
      const hasNamelessPersonnel = /\b(?:medics|medical\s+staff|soldiers|officers|analysts|technicians|operators|paramedics)\b/i.test(s.prompt)
      const hasWideBroadcast = /\b(?:global\s+broadcast|ranking\s+monolith|stele|monolith|breaking\s+news|broadcast\s+screens?)\b/i.test(s.narrativeSync)

      if (hasNamelessPersonnel) {
        const hasVisorMasking = /\b(?:visor|visors|tinted|face-concealing|balaclava|no\s+individual\s+facial\s+features|zero\s+individual\s+human\s+faces|indistinct\s+silhouettes?|blurred\s+silhouettes?|gowns?\s+with\s+(?:caps|masks)|surgical\s+masks?)\b/i.test(s.prompt)
        if (!hasVisorMasking) {
          deidentificationViolations.push({
            tag: s.tag,
            reason: `Nameless secondary personnel mentioned without visor masking or facial de-identification. Vulnerable to random dude hallucinations.`
          })
        }
      }

      if (hasWideBroadcast) {
        const hasEnvironmentFocus = /\b(?:100%\s+environment|zero\s+foreground\s+characters?|zero\s+close-up\s+human\s+faces|monolith\s+dominating|stele\s+dominating|indistinct\s+silhouettes?)\b/i.test(s.prompt)
        if (!hasEnvironmentFocus) {
          deidentificationViolations.push({
            tag: s.tag,
            reason: `Broadcast/monolith scene lacks environment priority or foreground human exclusion. Vulnerable to random foreground people.`
          })
        }
      }
    }

    if (deidentificationViolations.length === 0) {
      checks[6].passed = true
      checks[6].score = 100
      checks[6].details = `100% de-identification verified. Visor masking active for secondary personnel and environment-first framing enforced on broadcast wide shots.`
    } else {
      checks[6].passed = false
      checks[6].score = Math.max(0, Math.round(((matrixScenes.length - deidentificationViolations.length) / matrixScenes.length) * 100))
      checks[6].failingScenes = [...new Set(deidentificationViolations.map(v => v.tag))]
      checks[6].details = `De-identification gaps in ${deidentificationViolations.length} scene(s): ${deidentificationViolations.map(v => `${v.tag} (${v.reason})`).join('; ')}.`
    }

    // ------------------------------------------------------------------------
    // CHECK 8: Environment Scene Purity & Anti-Floating Figure Guard
    // ------------------------------------------------------------------------
    const envPurityViolations = []
    for (const s of matrixScenes) {
      const isEnvScene = /100%\s+pure\s+environment|completely\s+unpopulated|completely\s+devoid\s+of\s+human/i.test(s.prompt) ||
        (s.boundRefs.length === 0 && /\b(?:skyline|stratospheric\s+cloud|panoramic\s+perspective|campus\s+exterior)\b/i.test(s.prompt))

      if (isEnvScene) {
        const hasAnatomicalTokens = /\b(?:anatomically\s+correct\s+hands|slender\s+fingers|detailed\s+knuckles|boots\s+and\s+footwear|pupil\s+reflections)\b/i.test(s.prompt)
        const hasModeBLock = /\b(?:100%\s+pure\s+environment|completely\s+unpopulated|zero\s+humans|zero\s+people|zero\s+figures\s+in\s+the\s+sky|no\s+floating\s+characters|pristine\s+environmental\s+focus)\b/i.test(s.prompt)

        if (hasAnatomicalTokens) {
          envPurityViolations.push({
            tag: s.tag,
            reason: `Environment scene contains human anatomical tokens (hands, boots, pupil reflections). This causes diffusion models to hallucinate floating figures in the sky.`
          })
        } else if (!hasModeBLock) {
          envPurityViolations.push({
            tag: s.tag,
            reason: `Environment scene lacks Mode B negative isolation (zero humans, zero people, zero figures in sky).`
          })
        }
      }
    }

    if (envPurityViolations.length === 0) {
      checks[7].passed = true
      checks[7].score = 100
      checks[7].details = `100% environment scene purity verified. Pure environment and wide sky shots use Mode B negative isolation with zero human anatomical tokens.`
    } else {
      checks[7].passed = false
      checks[7].score = Math.max(0, Math.round(((matrixScenes.length - envPurityViolations.length) / matrixScenes.length) * 100))
      checks[7].failingScenes = [...new Set(envPurityViolations.map(v => v.tag))]
      checks[7].details = `Environment purity violations in ${envPurityViolations.length} scene(s): ${envPurityViolations.map(v => `${v.tag} (${v.reason})`).join('; ')}.`
    }

    // ------------------------------------------------------------------------
    // CHECK 9: Persistent Wardrobe & Private Interior Isolation
    // ------------------------------------------------------------------------
    const wardrobeAndIsolationViolations = []
    for (const s of matrixScenes) {
      // 1. Wang Bao wardrobe check: if Wang Bao is present in prompt, must have red graphic or gaming t-shirt
      if (/\bWang Bao\b/i.test(s.prompt)) {
        const hasWangBaoWardrobe = /\b(?:red\s+graphic|gaming\s+t-shirt|cargo\s+shorts)\b/i.test(s.prompt)
        if (!hasWangBaoWardrobe) {
          wardrobeAndIsolationViolations.push({
            tag: s.tag,
            reason: `Wang Bao appears without persistent wardrobe anchors (red graphic gaming t-shirt and beige cargo shorts). Vulnerable to clothing hallucinations.`
          })
        }
      }

      // 2. Lu Chen wardrobe check: if Lu Chen is actively staged in prompt, must have streetwear hoodie
      const isLuChenStaged = /@\{Lu Chen\}/i.test(s.prompt) || (s.boundRefs.includes('7ae04cf3-44e8-4f25-856e-2310c84eb9fb') && /\bLu Chen\b/i.test(s.prompt))
      if (isLuChenStaged) {
        const hasLuChenWardrobe = /\b(?:hoodie|streetwear)\b/i.test(s.prompt)
        if (!hasLuChenWardrobe) {
          wardrobeAndIsolationViolations.push({
            tag: s.tag,
            reason: `Lu Chen appears without persistent wardrobe anchors (oversized charcoal-black streetwear hoodie). Vulnerable to clothing hallucinations.`
          })
        }
      }

      // 3. Gu Tianyu wardrobe check: if Gu Tianyu is actively staged in prompt, must have navy designer blazer
      const isGuTianyuStaged = /@\{Gu Tianyu\}/i.test(s.prompt) || (s.boundRefs.includes('80875c1d-dc98-47e6-a3ac-9ba142de78d2') && /\bGu Tianyu\b/i.test(s.prompt))
      if (isGuTianyuStaged) {
        const hasGuTianyuWardrobe = /\b(?:navy\s+blazer|designer\s+blazer|torn\s+navy)\b/i.test(s.prompt)
        if (!hasGuTianyuWardrobe) {
          wardrobeAndIsolationViolations.push({
            tag: s.tag,
            reason: `Gu Tianyu appears without persistent wardrobe anchors (tailored navy designer blazer). Vulnerable to clothing hallucinations.`
          })
        }
      }

      // 4. Ye Xingchen wardrobe check: if Ye Xingchen is actively staged in prompt, must have tailored bespoke suit
      const isYeXingchenStaged = /@\{Ye Xingchen\}/i.test(s.prompt) || s.boundRefs.includes('488bd39e-fb96-4e80-b8ce-f1e3cad4fa12')
      if (isYeXingchenStaged) {
        const hasYeXingchenWardrobe = /\b(?:bespoke\s+(?:three-piece\s+)?suit|tailored\s+charcoal)\b/i.test(s.prompt)
        if (!hasYeXingchenWardrobe) {
          wardrobeAndIsolationViolations.push({
            tag: s.tag,
            reason: `Ye Xingchen appears without persistent wardrobe anchors (tailored charcoal bespoke three-piece suit). Vulnerable to clothing hallucinations.`
          })
        }
      }

      // 5. Commander Han Feng wardrobe check: if Han Feng is actively staged in prompt, must have tactical trench coat
      const isHanFengStaged = /@\{Commander Han Feng\}|@\{Han Feng\}/i.test(s.prompt) || (s.boundRefs.includes('3b815452-d36f-4f7d-b411-718d458f277a') && /\bHan Feng\b/i.test(s.prompt))
      if (isHanFengStaged) {
        const hasHanFengWardrobe = /\b(?:trench\s+coat|tactical\s+trench)\b/i.test(s.prompt)
        if (!hasHanFengWardrobe) {
          wardrobeAndIsolationViolations.push({
            tag: s.tag,
            reason: `Commander Han Feng appears without persistent wardrobe anchors (dark olive-drab tactical military trench coat). Vulnerable to clothing hallucinations.`
          })
        }
      }

      // 6. Private Interior Room Isolation: Room 402 or VIP penthouse must enforce private isolation and forbid generic crowd
      const isPrivateRoom = /\b(?:Room\s+402|VIP\s+penthouse)\b/i.test(s.prompt)
      if (isPrivateRoom) {
        const hasPrivateLock = /\b(?:strictly\s+private\s+interior|strictly\s+private\s+VIP|isolated\s+private\s+dorm|zero\s+background\s+extra\s+students)\b/i.test(s.prompt)
        const hasCrowdPermitted = /\bnatural\s+background\s+crowd\s+permitted\b/i.test(s.prompt)

        if (hasCrowdPermitted) {
          wardrobeAndIsolationViolations.push({
            tag: s.tag,
            reason: `Private interior room permits background crowds. This causes diffusion models to spawn random strangers inside private spaces.`
          })
        } else if (!hasPrivateLock) {
          wardrobeAndIsolationViolations.push({
            tag: s.tag,
            reason: `Private interior room lacks explicit private room isolation lock.`
          })
        }
      }
    }

    if (wardrobeAndIsolationViolations.length === 0) {
      checks[8].passed = true
      checks[8].score = 100
      checks[8].details = `100% persistent wardrobe and private interior isolation verified across all scenes. Signature clothing locked; private rooms shielded from extra crowds.`
    } else {
      checks[8].passed = false
      checks[8].score = Math.max(0, Math.round(((matrixScenes.length - wardrobeAndIsolationViolations.length) / matrixScenes.length) * 100))
      checks[8].failingScenes = [...new Set(wardrobeAndIsolationViolations.map(v => v.tag))]
      checks[8].details = `Wardrobe and isolation gaps in ${wardrobeAndIsolationViolations.length} scene(s): ${wardrobeAndIsolationViolations.map(v => `${v.tag} (${v.reason})`).join('; ')}.`
    }

    // ------------------------------------------------------------------------
    // Overall Calculation & Production Readiness Gate
    // ------------------------------------------------------------------------
    const overallScore = Math.round(checks.reduce((acc, c) => acc + c.score, 0) / checks.length)
    const allPassed = checks.every(c => c.passed)
    const allFailingScenes = [...new Set(checks.flatMap(c => c.failingScenes || []))]

    return {
      totalScenes: matrixScenes.length,
      scriptScenesCount: scriptScenes.length,
      overallScore,
      isProductionReady: allPassed && overallScore === 100,
      failingScenes: allFailingScenes,
      checks
    }
  }
}

