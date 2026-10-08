/**
 * Google Flow Entity ID Mapper & Token Transformer Utility
 */

export function parseEntityMappingText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { entities: {}, count: 0 }
  }

  const entities = {}
  const lines = rawText.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    
    // Ignore category headers
    if (/^(character entities|weapon & item entities|item entities|weapon entities|entities)/i.test(trimmed)) {
      continue
    }

    // Match "Name: UUID" or "Name : UUID" (where Name can contain colons e.g. "Weapon: Ashwood Training Bow")
    const match = trimmed.match(/^(.*?)\s*:\s*([a-f0-9\-]{8,})\s*$/i)
    if (match) {
      const key = match[1].trim()
      const uuid = match[2].trim()
      if (key && uuid) {
        entities[key] = uuid
      }
    }
  }

  return {
    entities,
    count: Object.keys(entities).length
  }
}

export function transformTokens(text, entityMap = {}, mode = 'uuid') {
  if (!text || typeof text !== 'string') return text || ''
  if (!entityMap || Object.keys(entityMap).length === 0) return text

  // Build inverse map for uuid -> token reconstruction
  const inverseMap = {}
  for (const [key, uuid] of Object.entries(entityMap)) {
    inverseMap[uuid] = key
  }

  if (mode === 'uuid') {
    // Replace @{Key} -> @UUID
    let transformed = text.replace(/@\{([^}]+)\}/g, (match, key) => {
      const trimmedKey = key.trim()
      if (entityMap[trimmedKey]) {
        return `@${entityMap[trimmedKey]}`
      }
      // Check normalized key (case-insensitive, or with/without "Weapon: " / "Item: " prefixes)
      for (const [k, uuid] of Object.entries(entityMap)) {
        if (k.toLowerCase() === trimmedKey.toLowerCase()) {
          return `@${uuid}`
        }
        const strippedK = k.replace(/^(Weapon|Item):\s*/i, '').trim().toLowerCase()
        const strippedKey = trimmedKey.replace(/^(Weapon|Item):\s*/i, '').trim().toLowerCase()
        if (strippedK === strippedKey) {
          return `@${uuid}`
        }
      }
      return match
    })

    // Also replace standalone @Key if not inside braces
    for (const [key, uuid] of Object.entries(entityMap)) {
      // Escape special regex characters in key
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`@${escapedKey}(?![a-zA-Z0-9_-])`, 'g')
      transformed = transformed.replace(regex, `@${uuid}`)
      
      // Also match stripped key (e.g. @Void-Strung Heavy Recurve)
      const strippedKey = key.replace(/^(Weapon|Item):\s*/i, '').trim()
      if (strippedKey !== key) {
        const escapedStripped = strippedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const strippedRegex = new RegExp(`@${escapedStripped}(?![a-zA-Z0-9_-])`, 'g')
        transformed = transformed.replace(strippedRegex, `@${uuid}`)
      }
    }

    return transformed
  } else {
    // Mode is 'token': Replace @UUID -> @{Key}
    let transformed = text
    for (const [uuid, key] of Object.entries(inverseMap)) {
      const regex = new RegExp(`@${uuid}(?![a-zA-Z0-9_-])`, 'g')
      transformed = transformed.replace(regex, `@{${key}}`)
    }
    return transformed
  }
}

export const ENTITY_STORAGE_KEY_PREFIX = 'manhwa_recap_flow_entity_map_'
export const TAG_MODE_STORAGE_KEY = 'manhwa_recap_prompt_tag_mode'
const LEGACY_ENTITY_STORAGE_KEY_PREFIX = 'luna_flow_entity_map_'
const LEGACY_TAG_MODE_STORAGE_KEY = 'luna_prompt_tag_mode'

export function saveEntityMapToStorage(franchiseId, rawText, entities) {
  try {
    const key = `${ENTITY_STORAGE_KEY_PREFIX}${franchiseId || 'default'}`
    localStorage.setItem(key, JSON.stringify({ rawText, entities, timestamp: Date.now() }))
  } catch (e) {
    console.warn('Failed to save entity map to storage:', e)
  }
}

export function loadEntityMapFromStorage(franchiseId) {
  try {
    const key = `${ENTITY_STORAGE_KEY_PREFIX}${franchiseId || 'default'}`
    let raw = localStorage.getItem(key)
    if (!raw) {
      // Graceful fallback for legacy storage key
      const legacyKey = `${LEGACY_ENTITY_STORAGE_KEY_PREFIX}${franchiseId || 'default'}`
      raw = localStorage.getItem(legacyKey)
    }
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.warn('Failed to load entity map from storage:', e)
  }
  return null
}

export function getTagModeFromStorage() {
  try {
    return localStorage.getItem(TAG_MODE_STORAGE_KEY) || localStorage.getItem(LEGACY_TAG_MODE_STORAGE_KEY) || 'uuid'
  } catch (e) {
    return 'uuid'
  }
}

export function setTagModeToStorage(mode) {
  try {
    localStorage.setItem(TAG_MODE_STORAGE_KEY, mode)
  } catch (e) {
    console.warn('Failed to save tag mode:', e)
  }
}

export function buildSceneXmlNode(tag, filename, promptText, entityMap = {}, mode = 'token') {
  const charRefs = []
  const itemRefs = []
  const text = promptText || ''

  // Characters
  if (text.includes('Caelen Vance - Phantom Marksman') || (mode === 'uuid' && entityMap['Caelen Vance - Phantom Marksman'] && text.includes(entityMap['Caelen Vance - Phantom Marksman']))) {
    if (entityMap['Caelen Vance - Phantom Marksman']) charRefs.push(entityMap['Caelen Vance - Phantom Marksman'])
  } else if (text.includes('Caelen Vance - Student Archer') || text.includes('Caelen Vance') || (mode === 'uuid' && entityMap['Caelen Vance - Student Archer'] && text.includes(entityMap['Caelen Vance - Student Archer']))) {
    if (entityMap['Caelen Vance - Student Archer']) charRefs.push(entityMap['Caelen Vance - Student Archer'])
  }

  if (text.includes('Ignis Sterling') || (mode === 'uuid' && entityMap['Ignis Sterling - Pyromancer Scion'] && text.includes(entityMap['Ignis Sterling - Pyromancer Scion']))) {
    if (entityMap['Ignis Sterling - Pyromancer Scion']) charRefs.push(entityMap['Ignis Sterling - Pyromancer Scion'])
  }
  if (text.includes('Lyra Mercer') || (mode === 'uuid' && entityMap['Lyra Mercer - Wind Scout'] && text.includes(entityMap['Lyra Mercer - Wind Scout']))) {
    if (entityMap['Lyra Mercer - Wind Scout']) charRefs.push(entityMap['Lyra Mercer - Wind Scout'])
  }
  if (text.includes('Boris Vane') || (mode === 'uuid' && entityMap['Instructor Boris Vane'] && text.includes(entityMap['Instructor Boris Vane']))) {
    if (entityMap['Instructor Boris Vane']) charRefs.push(entityMap['Instructor Boris Vane'])
  }
  if (text.includes('Keith Holloway') || text.includes('Director Holloway') || (mode === 'uuid' && entityMap['Director Keith Holloway'] && text.includes(entityMap['Director Keith Holloway']))) {
    if (entityMap['Director Keith Holloway']) charRefs.push(entityMap['Director Keith Holloway'])
  }

  // Items
  if (text.includes('Void-Strung Heavy Recurve') || (mode === 'uuid' && entityMap['Weapon: Void-Strung Heavy Recurve'] && text.includes(entityMap['Weapon: Void-Strung Heavy Recurve']))) {
    if (entityMap['Weapon: Void-Strung Heavy Recurve']) itemRefs.push(entityMap['Weapon: Void-Strung Heavy Recurve'])
  }
  if (text.includes('Ashwood Training Bow') || (mode === 'uuid' && entityMap['Weapon: Ashwood Training Bow'] && text.includes(entityMap['Weapon: Ashwood Training Bow']))) {
    if (entityMap['Weapon: Ashwood Training Bow']) itemRefs.push(entityMap['Weapon: Ashwood Training Bow'])
  }
  if (text.includes('Ethereal Siphon Arrow') || (mode === 'uuid' && entityMap['Item: Ethereal Siphon Arrow'] && text.includes(entityMap['Item: Ethereal Siphon Arrow']))) {
    if (entityMap['Item: Ethereal Siphon Arrow']) itemRefs.push(entityMap['Item: Ethereal Siphon Arrow'])
  }
  if (text.includes('Academy Awakening Orb') || (mode === 'uuid' && entityMap['Item: Academy Awakening Orb'] && text.includes(entityMap['Item: Academy Awakening Orb']))) {
    if (entityMap['Item: Academy Awakening Orb']) itemRefs.push(entityMap['Item: Academy Awakening Orb'])
  }
  if (text.includes('VIP Radar Console') || (mode === 'uuid' && entityMap['Item: VIP Radar Console'] && text.includes(entityMap['Item: VIP Radar Console']))) {
    if (entityMap['Item: VIP Radar Console']) itemRefs.push(entityMap['Item: VIP Radar Console'])
  }

  const uniqueChars = [...new Set(charRefs.filter(Boolean))]
  const uniqueItems = [...new Set(itemRefs.filter(Boolean))]

  let openTag = `<scene id="${tag}" filename="${filename}"`
  if (uniqueChars.length === 1) {
    openTag += ` character_ref="${uniqueChars[0]}"`
  } else if (uniqueChars.length > 1) {
    openTag += ` character_refs="${uniqueChars.join(', ')}"`
  }

  if (uniqueItems.length === 1) {
    openTag += ` item_ref="${uniqueItems[0]}"`
  } else if (uniqueItems.length > 1) {
    openTag += ` item_refs="${uniqueItems.join(', ')}"`
  }
  openTag += `>`

  const finalPrompt = transformTokens(text, entityMap, mode)
  return `${openTag}\n# Filename: ${filename}\n${finalPrompt}\n</scene>`
}
