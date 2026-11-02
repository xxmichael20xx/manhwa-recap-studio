/**
 * studio/src/utils/flowSyncMatcher.js
 *
 * Universal Google Flow Scene Synchroniser & Reverse-Lookup Engine.
 * Matches raw, unformatted prompt text copied from Google Flow (where @{} tokens
 * and UUIDs have been stripped) against the canonical Prompt Matrix scenes.
 *
 * Provides:
 * - Deterministic Scene ID resolution ([IMG_XXX])
 * - Target Filename (IMG_XXX.jpg)
 * - Exact Batch Name (Batch XX)
 * - Sequence position within batch (e.g. Prompt #15 of 24)
 * - Script Voiceover / Narrative Sync clause for instant context confirmation
 */

/**
 * Normalises a prompt string for comparative fuzzy matching.
 * Strips @{...} tokens, brackets, extra whitespace, and converts to lowercase.
 */
export function normalizePromptText(text) {
  if (!text || typeof text !== 'string') return ''
  return text
    .replace(/@\{([^}]+)\}/g, '$1') // @{Maya Miller} -> Maya Miller
    .replace(/@([A-Za-z0-9_]+)/g, '$1') // @MayaMiller -> MayaMiller
    .replace(/\[IMG_?\d+\]/gi, '') // Strip existing tags if any
    .replace(/[^\w\s:.-]/g, ' ') // Replace special punctuation with space
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/**
 * Extracts key distinctive segments from a prompt (core action block, entities, enclosure).
 */
export function extractPromptSegments(text) {
  if (!text || typeof text !== 'string') {
    return { coreAction: '', enclosure: '', entities: [] }
  }

  const clean = text.replace(/@\{([^}]+)\}/g, '$1')

  // Core Action extraction (before "Featuring" or layout prefix)
  let coreAction = ''
  const featuringIdx = clean.search(/\bFeaturing\b/i)
  if (featuringIdx > -1) {
    coreAction = clean.substring(0, featuringIdx).trim()
  } else {
    const spatialIdx = clean.search(/\bSpatial Enclosure\b/i)
    if (spatialIdx > -1) {
      coreAction = clean.substring(0, spatialIdx).trim()
    } else {
      coreAction = clean.substring(0, 200).trim()
    }
  }

  // Spatial Enclosure extraction
  let enclosure = ''
  const enclosureMatch = clean.match(/Spatial Enclosure:\s*([^.(]+)/i)
  if (enclosureMatch) {
    enclosure = enclosureMatch[1].trim().toLowerCase()
  }

  // Extract Mentioned Characters / Entities
  const entities = []
  const entityMatches = clean.matchAll(/(?:Featuring\s+|,\s*)([A-Z][a-zA-Z0-9\s'-]+?)(?:\s*\([^)]*\)|\s*,|\s*\.|\s*Spatial)/g)
  for (const m of entityMatches) {
    const name = m[1].trim()
    if (name && !name.toLowerCase().startsWith('spatial') && !name.toLowerCase().startsWith('bright') && name.length > 2) {
      entities.push(name.toLowerCase())
    }
  }

  return {
    coreAction: coreAction.toLowerCase(),
    enclosure,
    entities
  }
}

/**
 * Computes a similarity score between a search query and a target scene.
 * Returns { score: number (0-100), reasons: string[] }
 */
export function scoreSceneMatch(queryText, scene) {
  if (!queryText || !scene || !scene.prompt) {
    return { score: 0, reasons: [] }
  }

  const reasons = []
  let score = 0

  const normQuery = normalizePromptText(queryText)
  const normPrompt = normalizePromptText(scene.prompt)
  const normNarrative = normalizePromptText(scene.narrativeSync || '')

  // 1. Direct Scene Tag Query Check (e.g. user typed "183" or "IMG_183")
  const tagQueryMatch = queryText.match(/\b(?:IMG_?)?(\d{1,4})\b/i)
  if (tagQueryMatch) {
    const queryNum = parseInt(tagQueryMatch[1], 10)
    const sceneNum = parseInt((scene.tag || '').replace(/\D/g, ''), 10)
    if (queryNum === sceneNum && queryText.trim().length <= 10) {
      return {
        score: 100,
        reasons: [`Direct Scene Tag Match: [IMG_${String(sceneNum).padStart(3, '0')}]`]
      }
    }
  }

  // 2. Direct Narrative Sync (Script line) Match
  if (normNarrative.length > 10 && normQuery.includes(normNarrative)) {
    score += 50
    reasons.push('Matched voiceover narration dialogue verbatim')
  } else if (normNarrative.length > 10 && normNarrative.includes(normQuery)) {
    score += 45
    reasons.push('Query found inside voiceover narration')
  }

  // 3. Exact Normalised Substring Match
  if (normPrompt.includes(normQuery) && normQuery.length > 25) {
    score += 50
    reasons.push('Exact verbatim prompt substring match')
  } else if (normQuery.includes(normPrompt) && normPrompt.length > 25) {
    score += 45
    reasons.push('Query contains full prompt text')
  }

  // 4. Core Action Block Match (Top block / Bottom block / Left / Center / Right)
  const querySegs = extractPromptSegments(queryText)
  const targetSegs = extractPromptSegments(scene.prompt)

  if (querySegs.coreAction && targetSegs.coreAction) {
    if (querySegs.coreAction === targetSegs.coreAction) {
      score += 35
      reasons.push('Identical layout & action panel directions')
    } else if (
      targetSegs.coreAction.includes(querySegs.coreAction) ||
      querySegs.coreAction.includes(targetSegs.coreAction)
    ) {
      score += 25
      reasons.push('Partial action panel match')
    }
  }

  // 5. Spatial Enclosure Match
  if (querySegs.enclosure && targetSegs.enclosure) {
    if (querySegs.enclosure === targetSegs.enclosure) {
      score += 15
      reasons.push(`Matched zone: ${scene.zone || targetSegs.enclosure}`)
    } else if (targetSegs.enclosure.includes(querySegs.enclosure) || querySegs.enclosure.includes(targetSegs.enclosure)) {
      score += 10
      reasons.push('Zone enclosure overlap')
    }
  }

  // 6. Token Overlap (Dice / Jaccard similarity for words > 3 characters)
  const stopWords = new Set([
    'with', 'the', 'and', 'for', 'from', 'under', 'over', 'into', 'thin', 'black',
    'panel', 'borders', 'block', 'featuring', 'wearing', 'bright', 'korean', 'manhwa',
    'webtoon', 'style', 'sharp', 'clean', 'linework', 'warm', 'luminous', 'daylight',
    'vibrant', 'shading', 'horizontal', 'full', 'bleed', 'widescreen', 'composition',
    'cleanly', 'rendered', 'distinct', 'individual', 'fingers', 'crisp', 'pupil',
    'reflections', 'zero', 'cloning', 'completely', 'textless', 'artwork', 'speech',
    'bubbles', 'words', 'banners'
  ])

  const getDistinctTokens = (str) => {
    return new Set(
      str
        .split(/\s+/)
        .map(w => w.replace(/[^\w]/g, ''))
        .filter(w => w.length > 3 && !stopWords.has(w))
    )
  }

  const queryTokens = getDistinctTokens(normQuery)
  const targetTokens = getDistinctTokens(normPrompt)

  if (queryTokens.size > 0 && targetTokens.size > 0) {
    let intersection = 0
    queryTokens.forEach(token => {
      if (targetTokens.has(token)) {
        intersection++
      }
    })

    const tokenOverlapRatio = intersection / Math.max(queryTokens.size, 1)
    if (tokenOverlapRatio > 0.8) {
      score += 30
      reasons.push(`High distinctive word overlap (${Math.round(tokenOverlapRatio * 100)}%)`)
    } else if (tokenOverlapRatio > 0.5) {
      score += 20
      reasons.push(`Moderate distinctive word overlap (${Math.round(tokenOverlapRatio * 100)}%)`)
    } else if (tokenOverlapRatio > 0.25) {
      score += 10
    }
  }

  // Cap score at 100
  const finalScore = Math.min(Math.round(score), 100)
  return { score: finalScore, reasons }
}

/**
 * Searches and ranks scenes matching the query.
 *
 * @param {string} queryText - Raw text copied from Google Flow
 * @param {Array<Object>} scenes - Array of scene objects from parsedPrompts
 * @param {Object} options - { batchSize = 24, maxResults = 10, minScore = 20 }
 * @returns {Array<Object>} Ranked match items with batch sequence and telemetry
 */
export function findMatchingScenes(queryText, scenes, options = {}) {
  if (!queryText || !Array.isArray(scenes) || scenes.length === 0) {
    return []
  }

  const batchSize = options.batchSize || 24
  const maxResults = options.maxResults || 12
  const minScore = options.minScore || 15
  const batchFilter = options.batchFilter !== undefined && options.batchFilter !== null ? parseInt(String(options.batchFilter).replace(/\D/g, ''), 10) : null

  const scored = []

  scenes.forEach((scene, index) => {
    const { score, reasons } = scoreSceneMatch(queryText, scene)
    if (score >= minScore) {
      const sceneNum = parseInt((scene.tag || '').replace(/\D/g, ''), 10) || (index + 1)
      const cleanTag = `IMG_${String(sceneNum).padStart(3, '0')}`
      const filename = `${cleanTag}.jpg`
      
      const batchIndex = Math.floor(index / batchSize)
      const batchNumber = batchIndex + 1
      const batchName = `Batch ${String(batchNumber).padStart(2, '0')}`
      const positionInBatch = (index % batchSize) + 1
      const batchTotal = Math.min(batchSize, scenes.length - (batchIndex * batchSize))

      // If batch filter is specified, check match or boost
      let adjustedScore = score
      if (batchFilter !== null) {
        if (batchNumber !== batchFilter) {
          return // Skip scenes not in the requested batch
        }
        adjustedScore += 10
        reasons.unshift(`Filtered to Batch ${String(batchFilter).padStart(2, '0')}`)
      }

      scored.push({
        tag: `[${cleanTag}]`,
        cleanTag,
        filename,
        sceneIndex: index,
        sceneNumber: sceneNum,
        batchIndex,
        batchNumber,
        batchName,
        batchPosition: `${positionInBatch} of ${batchTotal}`,
        batchPositionNum: positionInBatch,
        batchTotal,
        layout: scene.description || scene.layout || 'Scene Plate',
        narrativeSync: scene.narrativeSync || '',
        prompt: scene.prompt || '',
        characterAnchor: scene.characterAnchor || '',
        hasImage: !!scene.hasImage,
        imageUrl: scene.imageUrl || '',
        score: Math.min(adjustedScore, 100),
        reasons
      })
    }
  })

  // Sort descending by score, then ascending by sceneIndex
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.sceneIndex - b.sceneIndex
  })

  return scored.slice(0, maxResults)
}
