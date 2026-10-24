/**
 * Universal Automated Prompt DNA Compiler Engine (Client Utility)
 * 
 * Permanently eliminates character DNA stripping, diffusion statelessness morphing,
 * and bare macro references across Google Flow prompt matrices.
 * 
 * 1. Extracts canonical physical traits (physique, facialFeatures, age, wardrobe) from characters.json.
 * 2. Deterministically verifies that prompts retain explicit character physical DNA.
 * 3. Automatically compiles bare macros @{Character Name} into rich physical cross-attention anchors.
 */

export function extractCharacterDna(character) {
  if (!character || typeof character !== 'object') return null

  const name = (character.name || character.flowName || '').trim()
  if (!name || name.length < 2) return null

  const category = (character.category || '').toLowerCase()
  const role = (character.role || '').toLowerCase()
  const isNonHumanoid = /^(artifact|weapon|prop|item|location|environment)$/i.test(category) ||
                        /\b(artifact|weapon|prop|sword|blade|dao|monolith|stele|spectrometer|console|astrolabe|interface)\b/i.test(role)
  if (isNonHumanoid) return null

  const cleanName = name
    .replace(/^(Grand Duke|Duke|Lord|Lady|Prince|Princess|King|Queen|Chief Proctor|Chief|Senior Examiner|Head Examiner|Examiner|Proctor|Instructor|Commander|Director|Master|Captain|Sir|Goddess|Elder)\s+/i, '')
    .replace(/\s*\([^)]*\)/, '')
    .trim()

  // Safely extract appearance attributes whether string or object
  let hair = ''
  let eyes = ''
  let physique = ''
  let attire = ''
  let weapons = ''

  if (character.appearance && typeof character.appearance === 'object') {
    hair = character.appearance.hair || ''
    eyes = character.appearance.eyes || ''
    physique = character.appearance.physique || ''
    attire = character.appearance.attire || ''
    weapons = character.appearance.weapons || ''
  } else if (typeof character.appearance === 'string') {
    physique = character.appearance
  }

  const dnaAnchor = character.dna_prompt_anchor || ''
  const ageVal = character.age ? String(character.age).trim() : ''
  const ageStr = ageVal ? (/^\d+$/.test(ageVal) ? `${ageVal}-year-old` : ageVal) : ''

  // 1. Age & Maturity Tokens
  const ageTokens = []
  if (ageStr) ageTokens.push(ageStr.toLowerCase())
  const combinedAgeText = `${ageStr} ${physique} ${dnaAnchor}`.toLowerCase()
  if (/\bweathered\b/i.test(combinedAgeText)) ageTokens.push('weathered')
  if (/\bveteran\b/i.test(combinedAgeText)) ageTokens.push('veteran')
  if (/\bchild\b/i.test(combinedAgeText)) ageTokens.push('child')
  if (/\byouthful\b/i.test(combinedAgeText)) ageTokens.push('youthful')
  if (/\bolder sister\b/i.test(combinedAgeText)) ageTokens.push('older sister', 'sister')
  if (/\byoung\b/i.test(combinedAgeText)) ageTokens.push('young', 'young royal princess')
  if (/\bprincess\b/i.test(combinedAgeText)) ageTokens.push('princess')

  // 2. Physique / Physical Build Tokens
  const physiqueTokens = []
  const fullPhysiqueText = `${physique} ${dnaAnchor}`.toLowerCase()
  const knownPhysiqueWords = [
    'chubby', 'double chin', 'round cheerful face', 'stout', 'athletic', 'lean athletic',
    'student build', 'sturdy', 'broad shoulders', 'broad', 'military commander', 'boy build',
    '10-year-old boy build', '5-year-old boy build', '7-year-old boy build', 'muscular', 'wiry',
    'slender build', 'slender frame', 'slender archer build', 'tall', 'graceful', 'ethereal',
    'imposing', 'dense superhuman', 'seasoned military posture', 'towering muscular', '6-foot-4',
    'royal build', 'royal princess', 'princess', 'girl build', '13-year-old girl build'
  ]
  for (const kw of knownPhysiqueWords) {
    if (fullPhysiqueText.includes(kw) && !physiqueTokens.includes(kw)) {
      physiqueTokens.push(kw)
    }
  }

  // 3. Facial Features, Hair, Eyes & Scars
  const facialTokens = []
  const fullFacialText = `${hair} ${eyes} ${dnaAnchor}`.toLowerCase()
  const knownFacialWords = [
    'tactical scar', 'left cheek scar', 'cheek scar', 'grizzled', 'tired stern eyes',
    'dark circles', 'ice-blue phoenix eyes', 'frosted silver tips', 'phoenix eyes',
    'obsidian eyes', 'golden starlight flecks', 'emerald-green eyes', 'spiky black hair',
    'raven-black hair', 'chestnut-brown hair', 'dark brown hair', 'slicked-back',
    'slicked-back dark brown hair', 'deadpan', 'deadpan bored', 'warm humble',
    'haughty sneering', 'regal golden eyes', 'cold aloof', 'round cheerful face', 'double chin',
    'fringe', 'buzzcut', 'square jaw', 'golden primordial', 'starlight flecks',
    'sapphire-blue eyes', 'golden-blonde hair', 'amber eyes', 'braided crown',
    'playful smile', 'lively grin'
  ]
  for (const kw of knownFacialWords) {
    if (fullFacialText.includes(kw) && !facialTokens.includes(kw)) {
      facialTokens.push(kw)
    }
  }

  // 4. Wardrobe & Attire Tokens
  const wardrobeTokens = []
  const fullWardrobeText = `${attire} ${character.wardrobe || ''} ${dnaAnchor}`.toLowerCase()
  const knownWardrobeWords = [
    'hoodie', 'pullover', 't-shirt', 'shirt', 'cargo shorts', 'shorts', 'trousers',
    'joggers', 'pants', 'sneakers', 'boots', 'trench coat', 'coat', 'blazer', 'suit',
    'vest', 'tunic', 'dress', 'uniform', 'armor', 'robes', 'robe', 'cloak', 'sleeves',
    'attire', 'garb', 'clothes', 'leather', 'linen', 'streetwear', 'charcoal'
  ]
  for (const kw of knownWardrobeWords) {
    if (fullWardrobeText.includes(kw) && !wardrobeTokens.includes(kw)) {
      wardrobeTokens.push(kw)
    }
  }

  // 5. Canonical Traits String for Automatic Expansion
  let canonicalTraits = ''
  if (dnaAnchor) {
    const anchorMatch = dnaAnchor.match(/^@\{[^}]+\},\s*(.*?)(?:,\s*(?:clean oversized|wearing|red graphic|dark olive-drab|modern white|tailored designer|tailored charcoal|rough-spun|standard dark|neat modern|modern 2025|dark fantasy|bright high-fantasy|$))/i)
    if (anchorMatch && anchorMatch[1]) {
      canonicalTraits = anchorMatch[1].trim().replace(/,\s*$/, '')
    }
  }

  if (!canonicalTraits) {
    const parts = []
    if (ageStr) parts.push(ageStr)
    if (physique) parts.push(physique.split(',')[0].trim())
    if (hair) parts.push(hair.split(',')[0].trim())
    if (eyes) parts.push(eyes.split(',')[0].trim())
    canonicalTraits = parts.filter(Boolean).join(', ')
  }

  return {
    id: character.id || name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name,
    cleanName,
    token: character.token || `@{${name}}`,
    age: ageStr,
    physiqueTokens,
    facialTokens,
    ageTokens,
    wardrobeTokens,
    canonicalTraits,
    dnaAnchor
  }
}

/**
 * Checks whether a prompt text explicitly contains the character's physical DNA.
 */
export function isPhysicalDnaPresent(promptText, charDna) {
  if (!promptText || !charDna) return false
  const lower = promptText.toLowerCase()

  // If prompt already contains the character's canonical traits phrase
  if (charDna.canonicalTraits && lower.includes(charDna.canonicalTraits.toLowerCase().slice(0, 25))) {
    return true
  }

  // Strip boilerplate anatomy text and environment collision words
  const cleanedPrompt = lower
    .replace(/precisely 5 slender fingers on each hand/g, '')
    .replace(/\b(?:athletic track|athletic sports stadium|synthetic running track)\b/g, '')

  const hasAge = charDna.ageTokens.length === 0 || charDna.ageTokens.some(t => cleanedPrompt.includes(t))
  const hasPhysique = charDna.physiqueTokens.length === 0 || charDna.physiqueTokens.some(t => cleanedPrompt.includes(t))
  const hasFacial = charDna.facialTokens.length === 0 || charDna.facialTokens.some(t => cleanedPrompt.includes(t))

  // Physical DNA is present if at least 2 categories match or physique + anchor matches
  return (hasPhysique && (hasFacial || hasAge)) || (hasFacial && hasAge)
}

/**
 * Automatically compiles bare macros @{Character Name} in prompt text into
 * fully enriched physical DNA guidance.
 */
export function compilePromptDna(promptText, characters = []) {
  if (!promptText || typeof promptText !== 'string') return promptText
  if (!characters) return promptText

  const charList = Array.isArray(characters)
    ? characters
    : (characters.characters || characters.models || Object.values(characters))

  if (!charList.length) return promptText

  let compiledText = promptText

  for (const c of charList) {
    const dna = extractCharacterDna(c)
    if (!dna || !dna.canonicalTraits) continue

    const nameVariants = [dna.name, dna.cleanName].filter(Boolean)
    for (const n of nameVariants) {
      const macro = `@{${n}}`
      if (!compiledText.includes(macro)) continue

      // Check if physical DNA is already present in prompt
      if (isPhysicalDnaPresent(compiledText, dna)) {
        continue
      }

      // Macro is bare without physical traits: expand it
      const macroRegex = new RegExp(`@\\{${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}(?!,\\s*${dna.canonicalTraits.slice(0, 15).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g')
      compiledText = compiledText.replace(macroRegex, (match) => {
        return `${match}, ${dna.canonicalTraits}`
      })
    }
  }

  return compiledText
}
