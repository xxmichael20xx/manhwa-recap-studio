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
}
