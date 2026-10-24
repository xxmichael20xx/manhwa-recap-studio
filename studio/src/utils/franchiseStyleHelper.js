/**
 * Franchise Style & Genre Intelligence Helper (100% Master Series Bible SSOT)
 * Dynamically ingests art style, architectural constraints, negative style drift,
 * crowd rules, diegetic vocabulary, and spatial enclosures directly from each
 * franchise's 00_Series_Bible_and_Character_DNA/Series_Bible.md (`STUDIO_BIBLE_DIRECTIVES` block).
 * Zero static series hardcoding in the Studio frontend.
 */

const bibleDirectivesCache = new Map()

export const parseBibleDirectivesFromMarkdown = (bibleContent = '') => {
  if (!bibleContent) return null
  const match = String(bibleContent).match(/<!--\s*STUDIO_BIBLE_DIRECTIVES_START\s*([\s\S]*?)\s*STUDIO_BIBLE_DIRECTIVES_END\s*-->/)
  if (!match || !match[1]) return null
  try {
    return JSON.parse(match[1].trim())
  } catch (e) {
    console.warn('Failed to parse STUDIO_BIBLE_DIRECTIVES JSON block in Series_Bible.md:', e.message)
    return null
  }
}

export const setFranchiseBibleDirectives = (franchiseId, directives) => {
  if (!franchiseId || !directives) return
  bibleDirectivesCache.set(String(franchiseId).toLowerCase(), directives)
}

export const loadFranchiseBibleDirectives = async (franchiseId) => {
  if (!franchiseId) return null
  const key = String(franchiseId).toLowerCase()
  try {
    const res = await fetch(`/api/franchises/${franchiseId}/bible-directives?cb=${Date.now()}`)
    if (res.ok) {
      const data = await res.json()
      if (data && data.styleName) {
        bibleDirectivesCache.set(key, data)
        return data
      }
    }
  } catch (e) {
    console.warn('Failed to load franchise bible directives from API:', e)
  }
  return bibleDirectivesCache.get(key) || null
}

export const getFranchiseArtStyleDirective = (franchiseId = '', format = '16:9', explicitDirectives = null) => {
  const key = String(franchiseId || '').toLowerCase()
  const cached = explicitDirectives || bibleDirectivesCache.get(key)
  const resolvedFormat = cached?.format || format || '16:9'
  const aspectDesc = String(resolvedFormat).includes('16:9')
    ? '16:9 horizontal widescreen landscape aspect ratio (1920x1080 horizontal full bleed)'
    : '9:16 vertical manhwa aspect ratio (1080x1920 vertical format)'

  if (cached && cached.styleName) {
    return {
      styleName: cached.styleName,
      format: resolvedFormat,
      voiceId: cached.voiceId || 'en-GB-RyanNeural',
      genreRule: cached.genreRule || `High-fidelity manhwa webtoon art style, sharp black ink linework, vibrant clean cel shading, textless ${aspectDesc}.`,
      forbiddenRule: cached.forbiddenRule || `STRICTLY FORBIDDEN STYLE DRIFT: Never generate photorealistic 3D CGI renders, live-action photography, or flat Western comic book cartoons.`,
      crowdRule: cached.crowdRule || `Natural background crowds in soft depth-of-field blur permitted in public settings as context requires. Private interior spaces remain strictly isolated.`,
      defaultVaultDna: cached.defaultVaultDna || `high-fidelity manhwa webtoon art style, sharp black ink linework, vibrant cel shading, textless artwork`,
      exampleEntities: Array.isArray(cached.exampleEntities) ? cached.exampleEntities : [],
      vocabulary: cached.vocabulary || {
        diegeticScrolls: 'in-world scrolls/documents/books',
        diegeticSignage: 'in-world shop/building signage',
        diegeticSteles: 'stone stele/monolith inscriptions',
        diegeticUi: 'glowing holographic system/UI panels'
      },
      spatialEnclosures: cached.spatialEnclosures || {}
    }
  }

  return {
    styleName: 'Master Series Bible Standard',
    format: resolvedFormat,
    voiceId: 'en-GB-RyanNeural',
    genreRule: `High-fidelity manhwa webtoon art style, sharp black ink linework, dynamic dramatic lighting, vibrant clean cel shading, textless ${aspectDesc}. Setting matching 00_Series_Bible_and_Character_DNA/Series_Bible.md.`,
    forbiddenRule: `STRICTLY FORBIDDEN STYLE DRIFT: Never generate photorealistic 3D CGI renders, live-action photography, or flat Western comic book cartoons.`,
    crowdRule: `Natural background crowds in soft depth-of-field blur permitted in public settings as context requires. Private interior spaces remain strictly isolated.`,
    defaultVaultDna: `high-fidelity manhwa webtoon art style, sharp black ink linework, vibrant cel shading, textless artwork`,
    exampleEntities: [],
    vocabulary: {
      diegeticScrolls: 'in-world scrolls/documents/books',
      diegeticSignage: 'in-world shop/building signage',
      diegeticSteles: 'stone stele/monolith inscriptions',
      diegeticUi: 'glowing holographic system/UI panels'
    },
    spatialEnclosures: {}
  }
}

export const getFranchiseDefaultVaultDna = (franchiseId = '', modelName = '', explicitDirectives = null) => {
  const directive = getFranchiseArtStyleDirective(franchiseId, '16:9', explicitDirectives)
  return `${modelName}, ${directive.defaultVaultDna}`
}
