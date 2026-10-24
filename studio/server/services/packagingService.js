import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { TtsService } from './ttsService.js'
import { VideoService } from './videoService.js'
import { ImageService } from './imageService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const franchisesDir = path.resolve(projectRoot, '01_Franchises')

export class PackagingService {
  /**
   * Get the absolute path to an episode's thumbnails directory
   */
  static getThumbnailsDir(franchiseId, episodeId) {
    return path.join(franchisesDir, franchiseId, episodeId, 'thumbnails')
  }

  /**
   * Format seconds to YouTube timestamp (MM:SS or HH:MM:SS)
   */
    /**
   * Parse YouTube timestamp string (MM:SS or HH:MM:SS) to seconds
   */
  static parseTimestampToSeconds(str) {
    if (!str) return 0
    const parts = str.trim().split(':').map(p => parseInt(p, 10))
    if (parts.length === 3) {
      return (parts[0] * 3600) + (parts[1] * 60) + parts[2]
    }
    if (parts.length === 2) {
      return (parts[0] * 60) + parts[1]
    }
    return 0
  }

static formatTimestamp(seconds) {
    const sec = Math.max(0, Math.floor(seconds))
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  /**
   * Format file bytes to human-readable string
   */
  static formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 KB'
    const mb = bytes / (1024 * 1024)
    if (mb >= 1) return `${mb.toFixed(2)} MB`
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  /**
   * Get the locked canonical master series title for a franchise (strictly <= 84 chars)
   * Dynamically reads from 00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md (SSOT),
   * falling back to Series_Bible.md, or clean franchise name. Zero hardcoded series titles.
   */
  static getCanonicalSeriesTitle(franchiseId) {
    if (!franchiseId) return 'Manhwa Recap Saga'

    // 1. Primary SSOT: 00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md
    const lockedPkgPath = path.join(franchisesDir, franchiseId, '00_Series_Bible_and_Character_DNA', 'YouTube_Locked_Package.md')
    if (fsSync.existsSync(lockedPkgPath)) {
      try {
        const content = fsSync.readFileSync(lockedPkgPath, 'utf-8')

        // Pattern A: > **Canonical Series Title:** *Title* or Title
        const canonMatch = content.match(/>\s*\*\*Canonical Series Title:\*\*\s*\*?([^\r\n*]+)\*?/i)
        if (canonMatch && canonMatch[1].trim()) {
          return canonMatch[1].trim()
        }

        // Pattern B: **Base Locked Title (XX chars):**\n```text\nTitle\n```
        const baseMatch = content.match(/\*\*Base Locked Title[^\n]*\*\*\s*:\s*\r?\n```(?:text)?\r?\n([\s\S]*?)\r?\n```/i)
        if (baseMatch && baseMatch[1].trim()) {
          return baseMatch[1].trim()
        }

        // Pattern C: ## 🏷️ 1. Locked Canonical Master Title\n```text\nTitle\n```
        const headerMatch = content.match(/##\s*[^\n]*Locked Canonical Master Title[^\n]*\r?\n(?:[\s\S]*?```(?:text)?\r?\n([\s\S]*?)\r?\n```)?/i)
        if (headerMatch && headerMatch[1] && headerMatch[1].trim()) {
          return headerMatch[1].trim()
        }

        // Pattern D: > **Locked Upload 1 Title...**: `(Episode 1) Title`
        const upload1Match = content.match(/>\s*\*\*Locked Upload 1 Title[^\n]*\*\*:\s*`([^`]+)`/i)
        if (upload1Match && upload1Match[1].trim()) {
          return upload1Match[1].replace(/^\((?:Episode|Episodes|Part|Parts)\s+[^)]+\)\s*/i, '').trim()
        }
      } catch (err) {
        console.warn(`[PackagingService] Could not parse YouTube_Locked_Package.md for ${franchiseId}:`, err.message)
      }
    }

    // 2. Secondary Ground Truth: 00_Series_Bible_and_Character_DNA/Series_Bible.md
    const biblePath = path.join(franchisesDir, franchiseId, '00_Series_Bible_and_Character_DNA', 'Series_Bible.md')
    if (fsSync.existsSync(biblePath)) {
      try {
        const bibleContent = fsSync.readFileSync(biblePath, 'utf-8')
        const titleMatch = bibleContent.match(/>\s*\*\*Official Title:\*\*\s*\*?([^\r\n*]+)\*?/i)
        if (titleMatch && titleMatch[1].trim()) {
          return titleMatch[1].trim()
        }

        const h1Match = bibleContent.match(/^#\s*📖?\s*(?:Franchise Series Bible:\s*)?([^\r\n]+)/im)
        if (h1Match && h1Match[1].trim() && !h1Match[1].includes('Franchise Series Bible')) {
          return h1Match[1].replace(/^[^:]+:\s*/, '').trim()
        }
      } catch (err) {
        console.warn(`[PackagingService] Could not parse Series_Bible.md for ${franchiseId}:`, err.message)
      }
    }

    // 3. Fallback: Cleaned name formatted from franchise directory
    const clean = franchiseId.replace(/^Series_\d+_/, '').replace(/_/g, ' ')
    return clean || 'Manhwa Recap Saga'
  }

  /**
   * Universal default 3-concept thumbnail archetypes generated dynamically from franchise context.
   * Zero hardcoded series names or concepts.
   */
  static getDefaultThumbnailConcepts(franchiseId, episodeId) {
    const cleanFranchise = franchiseId.replace(/^Series_\d+_/, '').replace(/_/g, ' ')
    const cleanEp = episodeId.replace(/^EP\d+_/, '').replace(/_/g, ' ')

    return [
      {
        id: 'concept_a',
        name: 'Concept A: The Split Transformation (Underdog vs Sovereign) (Locked Master Thumbnail)',
        subtitle: 'Split-Contrast (Left Underdog / Right Awakened Sovereign)',
        badgeText: 'FALSE F-RANK',
        subBadgeText: 'SOVEREIGN SYSTEM',
        badgeColorPreset: 'gold_crimson',
        badgePosition: 'bottom_left',
        composition: `Split-screen contrast showing protagonist before and after awakening in ${cleanFranchise}`,
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Split-screen high contrast manhwa composition. Left half: Bruised humble male protagonist in worn clothing in shadows. Right half: The same protagonist standing proud and powerful with glowing mana eyes, surrounded by floating celestial power runes and defeated enemies in background. High-fidelity manhwa webtoon art style, sharp black ink linework, saturated dynamic cel shading, horizontal 16:9 full bleed, textless artwork.`,
        filename: '01_Thumbnail_Concept_A.jpg'
      },
      {
        id: 'concept_b',
        name: "Concept B: The Proctor's Panic & Measurement Overflow",
        subtitle: 'Center Dynamic / Proctor Shock (Shattered Crystals & Calculation Breach)',
        badgeText: 'SYSTEM ERROR',
        subBadgeText: 'MEASUREMENT BREACH',
        badgeColorPreset: 'cyan_hud',
        badgePosition: 'bottom_left',
        composition: 'Arrogant examiner staring in cold sweat as holographic measuring crystal violently shatters',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. High tension manhwa composition. In foreground: Arrogant examiners in cold sweat with wide horrified eyes. In center: Protagonist placing hand on a massive measuring device that violently shatters with glowing warning runes and numeric overflow errors. Sharp ink linework, high contrast vibrant lighting, horizontal 16:9.`,
        filename: '01_Thumbnail_Concept_B.jpg'
      },
      {
        id: 'concept_c',
        name: 'Concept C: The Calamity Solo Cleave',
        subtitle: 'Wide Battlefield / Calamity Boss Cleave',
        badgeText: 'SOLO S-RANK',
        subBadgeText: 'PRIMORDIAL CLEAVE',
        badgeColorPreset: 'crimson_flame',
        badgePosition: 'bottom_left',
        composition: 'Protagonist unleashing monumental beam of energy slicing through sky and colossal calamity boss',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Epic wide battlefield manhwa composition. Protagonist standing on a ruined precipice, unleashing a monumental vertical pillar of celestial starlight slicing the clouds apart and bisecting a colossal boss. Sharp ink linework, high contrast cel shading, cinematic combat lighting, horizontal 16:9.`,
        filename: '01_Thumbnail_Concept_C.jpg'
      }
    ]
  }

  /**
   * Parse custom thumbnail concepts defined in markdown (YouTube_Locked_Package.md or 03_YouTube_Package.md / 04_YouTube_Release_Launchpad.md)
   */
  static parseThumbnailConceptsFromMarkdown(mdContent, franchiseId, episodeId) {
    if (!mdContent || typeof mdContent !== 'string') return []
    const concepts = []

    // Pattern 1: Structured ### Variant [A-C]: Name
    const variantBlockRegex = /###\s*(?:Variant|Concept)\s+([A-C]):\s*([^\r\n]+)([\s\S]*?)(?=(?:###\s*(?:Variant|Concept)\s+[A-C]|##\s+|$))/gi
    let match
    while ((match = variantBlockRegex.exec(mdContent)) !== null) {
      const letter = match[1].toUpperCase()
      const title = match[2].trim()
      const body = match[3]

      const id = `concept_${letter.toLowerCase()}`
      const promptMatch = body.match(/-\s*\*\*Prompt[^\n]*\*\*:\s*\r?\n```(?:text)?\r?\n([\s\S]*?)\r?\n```/i) ||
                          body.match(/```text\r?\n([\s\S]*?)\r?\n```/i)
      const compMatch = body.match(/-\s*\*\*Visual Concept[^\n]*\*\*:\s*([^\r\n]+)/i) ||
                        body.match(/-\s*\*\*Composition[^\n]*\*\*:\s*([^\r\n]+)/i)
      const badgeMatch = body.match(/-\s*\*\*Badge[^\n]*\*\*:\s*`?([^\r\n`]+)`?/i)

      concepts.push({
        id,
        name: `Concept ${letter}: ${title}`,
        subtitle: compMatch ? compMatch[1].trim() : title,
        badgeText: badgeMatch ? badgeMatch[1].trim() : (letter === 'A' ? 'FALSE F-RANK' : letter === 'B' ? 'SYSTEM ERROR' : 'SOLO S-RANK'),
        subBadgeText: '',
        badgeColorPreset: letter === 'A' ? 'gold_crimson' : letter === 'B' ? 'cyan_hud' : 'crimson_flame',
        badgePosition: 'bottom_left',
        composition: compMatch ? compMatch[1].trim() : title,
        prompt: promptMatch ? promptMatch[1].trim() : '',
        filename: `01_Thumbnail_Concept_${letter}.jpg`
      })
    }

    // Pattern 2: Bullet lists under ## Master Visual Thumbnail Concepts
    if (concepts.length === 0) {
      const conceptLinesRegex = /-\s*\*\*(Concept\s+[A-C]|Variant\s+[A-C])[^\*]*\*\*:\s*(?:`?([^`\r\n]+)`?\s*)?(?:[-—–]\s*)?([^\r\n]+)?/gi
      let cMatch
      while ((cMatch = conceptLinesRegex.exec(mdContent)) !== null) {
        const rawLabel = cMatch[1]
        const letterMatch = rawLabel.match(/[A-C]/i)
        if (!letterMatch) continue
        const letter = letterMatch[0].toUpperCase()
        const id = `concept_${letter.toLowerCase()}`
        const fileCandidate = (cMatch[2] || '').trim()
        const descCandidate = (cMatch[3] || '').trim()

        let filename = `01_Thumbnail_Concept_${letter}.jpg`
        if (fileCandidate.endsWith('.jpg') || fileCandidate.endsWith('.png')) {
          filename = path.basename(fileCandidate)
        }

        concepts.push({
          id,
          name: `Concept ${letter}: ${descCandidate || rawLabel}`,
          subtitle: descCandidate || rawLabel,
          badgeText: letter === 'A' ? 'PART 1' : letter === 'B' ? 'SYSTEM ERROR' : 'SOLO S-RANK',
          subBadgeText: '',
          badgeColorPreset: letter === 'A' ? 'gold_crimson' : letter === 'B' ? 'cyan_hud' : 'crimson_flame',
          badgePosition: 'bottom_left',
          composition: descCandidate || rawLabel,
          prompt: '',
          filename
        })
      }
    }

    return concepts
  }

  /**
   * Get calibrated high-CTR thumbnail concepts for a franchise and episode.
   * Dynamically ingests concepts and master thumbnails directly from Markdown SSOT
   * and local disk image files. 100% dynamic; zero hardcoded series conditionals.
   */
  static async getThumbnailVariants(franchiseId, episodeId) {
    const epDir = path.join(franchisesDir, franchiseId, episodeId)
    const thumbDir = this.getThumbnailsDir(franchiseId, episodeId)
    const bibleDir = path.join(franchisesDir, franchiseId, '00_Series_Bible_and_Character_DNA')
    await fs.mkdir(thumbDir, { recursive: true })

    // Scan directories on disk for existing images
    const thumbFiles = await fs.readdir(thumbDir).catch(() => [])
    const epFiles = await fs.readdir(epDir).catch(() => [])
    const bibleFiles = await fs.readdir(bibleDir).catch(() => [])

    // Identify master thumbnail on disk if available
    const hasMasterInEp = epFiles.includes('01_Thumbnail_Master.jpg')
    const hasMasterInThumb = thumbFiles.includes('01_Thumbnail_Master.jpg')
    const hasMasterInBible = bibleFiles.includes('01_Thumbnail_Master.jpg')
    const hasLegacyMaster = thumbFiles.includes('01_Master_YouTube_Thumbnail_16x9.jpg') || epFiles.includes('01_Master_YouTube_Thumbnail_16x9.jpg')
    const masterExistsOnDisk = hasMasterInEp || hasMasterInThumb || hasMasterInBible || hasLegacyMaster

    // 1. Try ingesting custom concepts from Markdown SSOT
    let baseVariants = []
    const lockedPkgPath = path.join(bibleDir, 'YouTube_Locked_Package.md')
    const epPkgPath = path.join(epDir, '03_YouTube_Package.md')
    const launchpadPath = path.join(epDir, '04_YouTube_Release_Launchpad.md')

    let parsedFromMd = []
    if (fsSync.existsSync(lockedPkgPath)) {
      try {
        const content = fsSync.readFileSync(lockedPkgPath, 'utf-8')
        parsedFromMd = this.parseThumbnailConceptsFromMarkdown(content, franchiseId, episodeId)
      } catch (_) {}
    }

    if (parsedFromMd.length === 0 && fsSync.existsSync(epPkgPath)) {
      try {
        const content = fsSync.readFileSync(epPkgPath, 'utf-8')
        parsedFromMd = this.parseThumbnailConceptsFromMarkdown(content, franchiseId, episodeId)
      } catch (_) {}
    }

    if (parsedFromMd.length === 0 && fsSync.existsSync(launchpadPath)) {
      try {
        const content = fsSync.readFileSync(launchpadPath, 'utf-8')
        parsedFromMd = this.parseThumbnailConceptsFromMarkdown(content, franchiseId, episodeId)
      } catch (_) {}
    }

    if (parsedFromMd.length > 0) {
      baseVariants = parsedFromMd
    } else {
      baseVariants = this.getDefaultThumbnailConcepts(franchiseId, episodeId)
    }

    // Ensure Concept A points to 01_Thumbnail_Master.jpg if that file exists on disk
    if (masterExistsOnDisk && baseVariants.length > 0) {
      const masterVariant = baseVariants[0]
      if (!masterVariant.name.includes('(Locked Master Thumbnail)')) {
        masterVariant.name = `${masterVariant.name} (Locked Master Thumbnail)`
      }
    }

    // Resolve disk status, file sizes, and URLs dynamically
    const variants = await Promise.all(baseVariants.map(async (v) => {
      let resolvedDiskPath = null
      let hasImage = false
      let fileSize = 0

      // Priority 1: Exact filename in thumbnails/
      const pathInThumb = path.join(thumbDir, v.filename)
      if (thumbFiles.includes(v.filename)) {
        resolvedDiskPath = pathInThumb
      }
      // Priority 2: Exact filename in episode directory
      else if (epFiles.includes(v.filename)) {
        resolvedDiskPath = path.join(epDir, v.filename)
      }
      // Priority 3: Exact filename in 00_Series_Bible_and_Character_DNA/
      else if (bibleFiles.includes(v.filename)) {
        resolvedDiskPath = path.join(bibleDir, v.filename)
      }
      // Priority 4: If concept_a, check 01_Thumbnail_Master.jpg or 01_Master_YouTube_Thumbnail_16x9.jpg
      else if (v.id === 'concept_a') {
        if (hasMasterInEp) {
          resolvedDiskPath = path.join(epDir, '01_Thumbnail_Master.jpg')
          v.filename = '01_Thumbnail_Master.jpg'
        } else if (hasMasterInThumb) {
          resolvedDiskPath = path.join(thumbDir, '01_Thumbnail_Master.jpg')
          v.filename = '01_Thumbnail_Master.jpg'
        } else if (hasMasterInBible) {
          resolvedDiskPath = path.join(bibleDir, '01_Thumbnail_Master.jpg')
          v.filename = '01_Thumbnail_Master.jpg'
        } else if (thumbFiles.includes('01_Master_YouTube_Thumbnail_16x9.jpg')) {
          resolvedDiskPath = path.join(thumbDir, '01_Master_YouTube_Thumbnail_16x9.jpg')
        }
      }

      if (resolvedDiskPath && fsSync.existsSync(resolvedDiskPath)) {
        hasImage = true
        try {
          const st = await fs.stat(resolvedDiskPath)
          fileSize = st.size
        } catch (_) {}
      }

      // YouTube hard upload limit is 2 MB (2,097,152 bytes)
      const isYouTubeCompliant = fileSize > 0 && fileSize < 2 * 1024 * 1024

      return {
        ...v,
        hasImage,
        fileSize,
        fileSizeFormatted: this.formatFileSize(fileSize),
        isYouTubeCompliant,
        url: hasImage ? `/api/episodes/${franchiseId}/${episodeId}/thumbnail/${v.filename}` : null
      }
    }))

    return variants
  }

  /**
   * Helper to build a high-CTR SVG Badge overlay
   */
  static generateBadgeSvg({
    badgeText = 'FALSE F-RANK',
    subBadgeText = '',
    badgeColorPreset = 'gold_crimson',
    badgePosition = 'bottom_left',
    width = 1920,
    height = 1080
  }) {
    // Color preset configurations
    const presets = {
      gold_crimson: {
        gradId: 'goldCrimsonGrad',
        stop1: '#fbbf24', // Amber 400
        stop2: '#f59e0b', // Amber 500
        stop3: '#f43f5e', // Rose 500
        textColor: '#09090b',
        subBg: 'rgba(9, 9, 11, 0.85)',
        subText: '#fbbf24',
        subBorder: 'rgba(251, 191, 36, 0.4)',
        glow: '#f59e0b'
      },
      cyan_hud: {
        gradId: 'cyanHudGrad',
        stop1: '#38bdf8', // Sky 400
        stop2: '#06b6d4', // Cyan 500
        stop3: '#2563eb', // Blue 600
        textColor: '#09090b',
        subBg: 'rgba(9, 9, 11, 0.85)',
        subText: '#38bdf8',
        subBorder: 'rgba(56, 189, 248, 0.4)',
        glow: '#06b6d4'
      },
      crimson_flame: {
        gradId: 'crimsonFlameGrad',
        stop1: '#f87171', // Red 400
        stop2: '#ef4444', // Red 500
        stop3: '#991b1b', // Red 800
        textColor: '#ffffff',
        subBg: 'rgba(9, 9, 11, 0.85)',
        subText: '#f87171',
        subBorder: 'rgba(239, 68, 68, 0.4)',
        glow: '#ef4444'
      },
      toxic_emerald: {
        gradId: 'toxicEmeraldGrad',
        stop1: '#34d399', // Emerald 400
        stop2: '#10b981', // Emerald 500
        stop3: '#047857', // Emerald 700
        textColor: '#09090b',
        subBg: 'rgba(9, 9, 11, 0.85)',
        subText: '#34d399',
        subBorder: 'rgba(52, 211, 153, 0.4)',
        glow: '#10b981'
      },
      dark_violet: {
        gradId: 'darkVioletGrad',
        stop1: '#c084fc', // Purple 400
        stop2: '#a855f7', // Purple 500
        stop3: '#6366f1', // Indigo 500
        textColor: '#ffffff',
        subBg: 'rgba(9, 9, 11, 0.85)',
        subText: '#c084fc',
        subBorder: 'rgba(168, 85, 247, 0.4)',
        glow: '#a855f7'
      },
      yellow_binge: {
        gradId: 'yellowBingeGrad',
        stop1: '#fef08a', // Yellow 200
        stop2: '#facc15', // Yellow 400
        stop3: '#eab308', // Yellow 500
        textColor: '#09090b',
        subBg: 'rgba(9, 9, 11, 0.92)',
        subText: '#fde047',
        subBorder: 'rgba(234, 179, 8, 0.6)',
        glow: '#eab308'
      }
    }

    const theme = presets[badgeColorPreset] || presets.gold_crimson
    const cleanBadge = (badgeText || 'FALSE F-RANK').toUpperCase().trim()
    const cleanSubBadge = (subBadgeText || '').toUpperCase().trim()

    // Approximate text widths for 1080p canvas
    const charWidth = 32
    const badgePadX = 36
    const mainWidth = Math.max(260, cleanBadge.length * charWidth + badgePadX * 2)
    const mainHeight = 84

    const hasSub = cleanSubBadge.length > 0
    const subCharWidth = 18
    const subPadX = 24
    const subWidth = hasSub ? Math.max(180, cleanSubBadge.length * subCharWidth + subPadX * 2) : 0
    const subHeight = 44

    const totalHeight = hasSub ? mainHeight + subHeight + 12 : mainHeight
    const totalWidth = Math.max(mainWidth, subWidth)

    // Position coordinates calculation
    let posX = 70
    let posY = height - totalHeight - 70

    if (badgePosition === 'bottom_right') {
      posX = width - totalWidth - 70
      posY = height - totalHeight - 70
    } else if (badgePosition === 'top_left') {
      posX = 70
      posY = 70
    } else if (badgePosition === 'top_right') {
      posX = width - totalWidth - 70
      posY = 70
    }

    const subY = posY + mainHeight + 12

    return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${theme.gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.stop1}" />
          <stop offset="50%" stop-color="${theme.stop2}" />
          <stop offset="100%" stop-color="${theme.stop3}" />
        </linearGradient>
        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.85" />
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.5" />
        </filter>
        <filter id="subShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.75" />
        </filter>
      </defs>

      <!-- Main High-CTR Badge Pill -->
      <g filter="url(#badgeShadow)">
        <!-- Outer Stroke / Glow -->
        <rect 
          x="${posX - 2}" 
          y="${posY - 2}" 
          width="${mainWidth + 4}" 
          height="${mainHeight + 4}" 
          rx="22" 
          fill="none" 
          stroke="rgba(255,255,255,0.4)" 
          stroke-width="3" 
        />
        <!-- Gradient Background -->
        <rect 
          x="${posX}" 
          y="${posY}" 
          width="${mainWidth}" 
          height="${mainHeight}" 
          rx="20" 
          fill="url(#${theme.gradId})" 
        />
        <!-- Inner Bevel Highlight -->
        <rect 
          x="${posX + 4}" 
          y="${posY + 4}" 
          width="${mainWidth - 8}" 
          height="${mainHeight / 2 - 4}" 
          rx="16" 
          fill="rgba(255,255,255,0.18)" 
        />
        <!-- Lightning Icon & Text -->
        <text 
          x="${posX + mainWidth / 2}" 
          y="${posY + 57}" 
          font-family="Impact, 'Arial Black', -apple-system, sans-serif" 
          font-size="46" 
          font-weight="900" 
          letter-spacing="2.5" 
          fill="${theme.textColor}" 
          text-anchor="middle"
        >
          ⚡ ${cleanBadge}
        </text>
      </g>

      <!-- Sub-Badge Pill if present -->
      ${hasSub ? `
      <g filter="url(#subShadow)">
        <rect 
          x="${posX}" 
          y="${subY}" 
          width="${subWidth}" 
          height="${subHeight}" 
          rx="12" 
          fill="${theme.subBg}" 
          stroke="${theme.subBorder}" 
          stroke-width="2" 
        />
        <text 
          x="${posX + subWidth / 2}" 
          y="${subY + 30}" 
          font-family="'SF Mono', 'Courier New', monospace, sans-serif" 
          font-size="20" 
          font-weight="800" 
          letter-spacing="3" 
          fill="${theme.subText}" 
          text-anchor="middle"
        >
          [ ${cleanSubBadge} ]
        </text>
      </g>
      ` : ''}
    </svg>
    `
  }

  /**
   * Composite vector badge onto a 16:9 thumbnail base image using Sharp
   */
  static async compositeThumbnailBadge(franchiseId, episodeId, options = {}) {
    const {
      variantId = 'concept_a',
      badgeText = 'FALSE F-RANK',
      subBadgeText = '',
      badgeColorPreset = 'gold_crimson',
      badgePosition = 'bottom_left',
      base64Data = null,
      customFilename = null
    } = options

    const thumbDir = this.getThumbnailsDir(franchiseId, episodeId)
    await fs.mkdir(thumbDir, { recursive: true })

    const targetFilename = customFilename || (
      variantId === 'concept_b' ? '01_Thumbnail_Concept_B.jpg' :
      variantId === 'concept_c' ? '01_Thumbnail_Concept_C.jpg' :
      '01_Thumbnail_Concept_A.jpg'
    )
    const outputPath = path.join(thumbDir, targetFilename)

    // Determine input image source buffer
    let inputBuffer = null

    const rawVariantFile = targetFilename.replace(/\.jpg$/i, '_Raw.jpg')
    const rawVariantPath = path.join(thumbDir, rawVariantFile)
    const textlessVariantFile = targetFilename.replace(/\.jpg$/i, '_Textless.jpg')
    const textlessVariantPath = path.join(thumbDir, textlessVariantFile)

    if (base64Data) {
      const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
      inputBuffer = Buffer.from(cleanBase64, 'base64')
    } else if (fsSync.existsSync(rawVariantPath)) {
      inputBuffer = await fs.readFile(rawVariantPath)
    } else if (fsSync.existsSync(textlessVariantPath)) {
      inputBuffer = await fs.readFile(textlessVariantPath)
    } else if (fsSync.existsSync(outputPath)) {
      inputBuffer = await fs.readFile(outputPath)
    } else {
      // Check for legacy master thumbnail
      const masterThumb = path.join(thumbDir, '01_Master_YouTube_Thumbnail_16x9.jpg')
      if (fsSync.existsSync(masterThumb)) {
        inputBuffer = await fs.readFile(masterThumb)
      } else {
        // Fallback: Pick a high-res scene image from images directory
        const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
        const sceneCandidates = ['IMG_024.jpg', 'IMG_048.jpg', 'IMG_072.jpg', 'IMG_001.jpg']
        for (const cand of sceneCandidates) {
          const candPath = path.join(imagesDir, cand)
          if (fsSync.existsSync(candPath)) {
            inputBuffer = await fs.readFile(candPath)
            break
          }
        }
      }
    }

    if (!inputBuffer) {
      throw new Error(`No source image found to composite badge for ${variantId}. Please upload or drop an image plate first.`)
    }

    // 1. Process base image to strict 16:9 canvas (1920x1080)
    const baseSharp = sharp(inputBuffer)
      .resize(1920, 1080, {
        fit: 'cover',
        position: 'center'
      })

    const baseBuffer = await baseSharp.toBuffer()

    // 2. Generate crisp SVG vector badge overlay
    const svgContent = this.generateBadgeSvg({
      badgeText,
      subBadgeText,
      badgeColorPreset,
      badgePosition,
      width: 1920,
      height: 1080
    })

    const svgBuffer = Buffer.from(svgContent)

    // 3. Composite overlay and compress with high-quality MozJPEG
    let outputBuffer = await sharp(baseBuffer)
      .composite([{ input: svgBuffer, top: 0, left: 0 }])
      .jpeg({ quality: 90, mozjpeg: true, progressive: true })
      .toBuffer()

    // YouTube 2MB Hard-Cap Defense: If file exceeds 1.95MB, recompress dynamically
    if (outputBuffer.length > 1.95 * 1024 * 1024) {
      outputBuffer = await sharp(baseBuffer)
        .composite([{ input: svgBuffer, top: 0, left: 0 }])
        .jpeg({ quality: 82, mozjpeg: true, progressive: true })
        .toBuffer()
    }

    // Write to disk
    await fs.writeFile(outputPath, outputBuffer)

    // Also copy to Master Thumbnail if Concept A
    if (variantId === 'concept_a') {
      const masterCopyPath = path.join(thumbDir, '01_Master_YouTube_Thumbnail_16x9.jpg')
      await fs.writeFile(masterCopyPath, outputBuffer).catch(() => {})
    }

    const fileSize = outputBuffer.length
    const isYouTubeCompliant = fileSize < 2 * 1024 * 1024

    return {
      success: true,
      variantId,
      filename: targetFilename,
      url: `/api/episodes/${franchiseId}/${episodeId}/thumbnail/${targetFilename}`,
      fileSize,
      fileSizeFormatted: this.formatFileSize(fileSize),
      isYouTubeCompliant,
      badgeText,
      subBadgeText,
      badgeColorPreset,
      badgePosition
    }
  }

  /**
   * Save uploaded thumbnail image directly from dropzone
   */
  static async saveThumbnailUpload(franchiseId, episodeId, variantId, base64Data, options = {}) {
    const thumbDir = this.getThumbnailsDir(franchiseId, episodeId)
    await fs.mkdir(thumbDir, { recursive: true })

    const targetFilename = variantId === 'concept_b' ? '01_Thumbnail_Concept_B.jpg' :
      variantId === 'concept_c' ? '01_Thumbnail_Concept_C.jpg' :
      '01_Thumbnail_Concept_A.jpg'

    const outputPath = path.join(thumbDir, targetFilename)
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(cleanBase64, 'base64')

    // Resize and normalize to 1920x1080 JPEG
    let processedBuffer = await sharp(buffer)
      .resize(1920, 1080, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90, mozjpeg: true, progressive: true })
      .toBuffer()

    if (processedBuffer.length > 1.95 * 1024 * 1024) {
      processedBuffer = await sharp(buffer)
        .resize(1920, 1080, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 82, mozjpeg: true, progressive: true })
        .toBuffer()
    }

    await fs.writeFile(outputPath, processedBuffer)

    // If Concept A, also mirror to 01_Master_YouTube_Thumbnail_16x9.jpg
    if (variantId === 'concept_a') {
      const masterPath = path.join(thumbDir, '01_Master_YouTube_Thumbnail_16x9.jpg')
      await fs.writeFile(masterPath, processedBuffer).catch(() => {})
    }

    // If applyBadge option requested, run badge composite immediately
    if (options.applyBadge) {
      return await this.compositeThumbnailBadge(franchiseId, episodeId, {
        variantId,
        badgeText: options.badgeText || 'FALSE F-RANK',
        subBadgeText: options.subBadgeText || '',
        badgeColorPreset: options.badgeColorPreset || 'gold_crimson',
        badgePosition: options.badgePosition || 'bottom_left',
        customFilename: targetFilename
      })
    }

    const fileSize = processedBuffer.length
    return {
      success: true,
      variantId,
      filename: targetFilename,
      url: `/api/episodes/${franchiseId}/${episodeId}/thumbnail/${targetFilename}`,
      fileSize,
      fileSizeFormatted: this.formatFileSize(fileSize),
      isYouTubeCompliant: fileSize < 2 * 1024 * 1024
    }
  }

  /**
   * Monotonically parse script acts and timestamps from SRT, generating full package
   */
  /**
   * Markdown-First Truth Package Generator (Cognitive Agent Output Parser)
   */
  static async generatePackage(franchiseId, episodeId) {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    const pkgMdPath = path.join(epPath, '03_YouTube_Package.md')
    const masterAudioPath = TtsService.getAudioFilePath(franchiseId, episodeId, '01_Episode_Master.mp3')

    let script = ''
    try { script = await fs.readFile(scriptPath, 'utf-8') } catch (e) {}

    let totalDuration = 1920 // default 32m
    const masterVideoPath = path.join(epPath, 'video', '01_Episode_Master_1080p.mp4')
    if (fsSync.existsSync(masterVideoPath)) {
      const vidDur = await VideoService.getVideoDuration(masterVideoPath)
      if (vidDur > 0) totalDuration = vidDur
    } else if (fsSync.existsSync(masterAudioPath)) {
      const audDur = await VideoService.getAudioDuration(masterAudioPath)
      if (audDur > 0) totalDuration = audDur
    } else {
      const duckedPath = path.join(epPath, 'audio', '01_Master_Narration_BGM_Ducked.mp3')
      const narrPath = path.join(epPath, 'audio', '01_Master_Narration.wav')
      if (fsSync.existsSync(duckedPath)) {
        const dur = await VideoService.getAudioDuration(duckedPath)
        if (dur > 0) totalDuration = dur
      } else if (fsSync.existsSync(narrPath)) {
        const dur = await VideoService.getAudioDuration(narrPath)
        if (dur > 0) totalDuration = dur
      }
    }

    const cleanFranchiseName = franchiseId.replace(/^Series_\d+_/, '').replace(/_/g, ' ')
    const cleanEpisodeName = episodeId.replace(/^EP\d+_/, '').replace(/_/g, ' ')
    const canonicalTitle = this.getCanonicalSeriesTitle(franchiseId)
    const epNumMatch = episodeId.match(/EP0*(\d+)/i)
    const epNum = epNumMatch ? parseInt(epNumMatch[1], 10) : 1
    const partTag = `Episode ${epNum}`

    let titles = []
    let chapters = []
    let description = ''
    let pinnedComment = ''
    let isPending = true

    // 1. Markdown-First Truth Resolution: Parse from available Markdown SSOT files
    // Priority 1: 03_YouTube_Package.md (Episode specific package)
    // Priority 2: 04_YouTube_Release_Launchpad.md (Episode launchpad)
    // Priority 3: 00_Series_Bible_and_Character_DNA/YouTube_Locked_Package.md (Master series locked package)
    const epLaunchpadPath = path.join(epPath, '04_YouTube_Release_Launchpad.md')
    const masterLockedPkgPath = path.join(franchisesDir, franchiseId, '00_Series_Bible_and_Character_DNA', 'YouTube_Locked_Package.md')

    let parsedContent = ''
    if (fsSync.existsSync(pkgMdPath)) {
      parsedContent = await fs.readFile(pkgMdPath, 'utf-8').catch(() => '')
    } else if (fsSync.existsSync(epLaunchpadPath)) {
      parsedContent = await fs.readFile(epLaunchpadPath, 'utf-8').catch(() => '')
    }

    let masterContent = ''
    if (fsSync.existsSync(masterLockedPkgPath)) {
      masterContent = await fs.readFile(masterLockedPkgPath, 'utf-8').catch(() => '')
    }

    if (parsedContent || masterContent) {
      isPending = false
      const primaryDoc = parsedContent || masterContent

      // Parse Titles
      const rawFoundTitles = []
      if (primaryDoc) {
        const lines = primaryDoc.split(/\r?\n/)
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line.startsWith('>') || line.startsWith('#') || line.startsWith('---')) continue

          const numMatch = line.match(/^\d+\.\s*(.+)$/)
          if (numMatch) {
            let candidate = numMatch[1].trim()

            // Check if candidate is an archetype label: **Archetype Name:** or **Name (88 chars):**
            if ((candidate.endsWith(':') || candidate.endsWith(':**') || candidate.endsWith(':*')) && i + 1 < lines.length) {
              const nextLine = lines[i + 1].trim()
              const codeMatch = nextLine.match(/^`([^`]+)`/) || nextLine.match(/^([^`\r\n]+)$/)
              if (codeMatch && codeMatch[1].trim().length > 15) {
                candidate = codeMatch[1].trim()
              }
            }

            // Clean trailing char counts first, then bold/backticks
            candidate = candidate.replace(/\s*\(\d+\s*chars?\)\s*$/i, '').trim()
            candidate = candidate
              .replace(/^\*\*/, '').replace(/\*\*$/, '')
              .replace(/^`/, '').replace(/`$/, '')
              .trim()

            if (candidate.length > 15 && !candidate.includes('Setup') && !candidate.startsWith('Archetype')) {
              rawFoundTitles.push(candidate)
            }
          }
        }
      }

      // If no titles found in episode package, check master package
      if (rawFoundTitles.length === 0 && masterContent) {
        const mLines = masterContent.split(/\r?\n/)
        for (const mLine of mLines) {
          const line = mLine.trim()
          if (line.startsWith('>')) continue

          const uploadMatch = line.match(/^-\s*\*\*Upload\s+\d+[^*]*:?\*\*:?\s*`([^`]+)`/i)
          if (uploadMatch && uploadMatch[1].trim().length > 15) {
            let t = uploadMatch[1].trim()
            t = t.replace(/\s*\(\d+\s*chars?\)\s*$/i, '').trim()
            t = t.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/^`/, '').replace(/`$/, '').trim()
            rawFoundTitles.push(t)
          }
        }

        if (rawFoundTitles.length === 0) {
          const baseMatch = masterContent.match(/\*\*Base Locked Title[^\n]*\*\*\s*:\s*\r?\n```(?:text)?\r?\n([\s\S]*?)\r?\n```/i)
          if (baseMatch && baseMatch[1].trim()) {
            rawFoundTitles.push('(Episode ' + epNum + ') ' + baseMatch[1].trim())
          }
        }
      }

      if (rawFoundTitles.length > 0) {
        const ctrScores = ['99%', '98%', '97%', '96%', '95%', '94%', '93%', '92%', '91%', '90%']
        titles = rawFoundTitles.slice(0, 10).map((t, idx) => ({
          archetype: `High-CTR Archetype ${idx + 1}`,
          title: t,
          ctrScore: ctrScores[idx] || '92%',
          charCount: t.length,
          isCompliant: t.length <= 100
        }))
      }

      // Parse Chapters
      const chapterBlockMatch = primaryDoc.match(/⏱️\s*(?:EPISODE CHAPTERS|CHAPTER TIMESTAMPS):\s*\r?\n([\s\S]*?)(?:\r?\n\s*━|\r?\n\s*#|\r?\n\s*```|$)/i)
      if (chapterBlockMatch && chapterBlockMatch[1]) {
        const rawLines = chapterBlockMatch[1].split(/\r?\n/)
        for (const rawLine of rawLines) {
          const lineMatch = rawLine.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]\s*(.+)$/)
          if (lineMatch) {
            chapters.push({
              time: lineMatch[1].trim(),
              seconds: this.parseTimestampToSeconds(lineMatch[1].trim()),
              title: lineMatch[2].trim()
            })
          }
        }
      }

      // Parse SEO Description Box
      const descBlockMatch = primaryDoc.match(/##\s*[^\n]*(?:Description Box|SEO Description|Master Description)[^\n]*[\s\S]*?```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i) ||
                             masterContent.match(/##\s*[^\n]*(?:Description Box|SEO Description|Master Description)[^\n]*[\s\S]*?```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
      if (descBlockMatch && descBlockMatch[1]) {
        let rawDesc = descBlockMatch[1].trim()
        rawDesc = rawDesc
          .replace(/\{\{EPISODE_RANGE\}\}/g, epNum > 1 ? `1-${epNum}` : '1')
          .replace(/\{\{EPISODE_HEADER_LINE\}\}/g, cleanEpisodeName)
          .replace(/\{\{RUNTIME_BLOCK\}\}/g, `• Full Runtime: ${(totalDuration / 60).toFixed(1)} Minutes (${this.formatTimestamp(totalDuration)})\n• Episode Bounds: 00:00 - ${this.formatTimestamp(totalDuration)}`)
          .replace(/\{\{TIMESTAMPS_BLOCK\}\}/g, epNum === 1 ? '' : (chapters.length > 0 ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n⏱️ CHAPTER TIMESTAMPS:\n${chapters.map(c => `${c.time} - ${c.title}`).join('\n')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` : ''))
        description = rawDesc
      }

      // Parse Pinned Community Comment
      const commentBlockMatch = primaryDoc.match(/##\s*[^\n]*Pinned (?:Community|Comment|Bio)[^\n]*[\s\S]*?```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i) ||
                                masterContent.match(/##\s*[^\n]*Pinned (?:Community|Comment|Bio)[^\n]*[\s\S]*?```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
      if (commentBlockMatch && commentBlockMatch[1]) {
        pinnedComment = commentBlockMatch[1].trim()
      }
    }

    // 2. Safe Dynamic Fallbacks if Markdown is pending (Single Locked Canonical Title Standard)
    const rangeTag = epNum > 1 ? `Episode 1-${epNum}` : 'Episode 1'
    if (titles.length === 0) {
      const lockedTitle = `(${rangeTag}) ${canonicalTitle}`
      titles = [
        { archetype: 'Locked Canonical Title (Accumulative Standard)', title: lockedTitle, ctrScore: '99%', charCount: lockedTitle.length, isCompliant: lockedTitle.length <= 100 }
      ]
    }

    // In accordance with Plain Episode Timestamp Standard:
    // Standalone individual episodes omit internal chapter timestamps completely.
    // Plain episode timestamps are strictly reserved for multi-episode compilations.
    const chapterText = chapters.map(c => `${c.time} - ${c.title}`).join('\n')

    if (!description) {
      const formattedEnd = this.formatTimestamp(totalDuration)
      description = `🔥 Series: ${cleanFranchiseName}\n🎬 Episode: ${cleanEpisodeName}\n⏱️ Runtime: ${(totalDuration / 60).toFixed(1)} Minutes (${formattedEnd})\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n⏱️ CHAPTER TIMESTAMPS:\n${chapterText}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🔔 Subscribe to @ManhwaRecapStudio for weekly full-length manhwa recap sagas!`
    }

    if (!pinnedComment) {
      pinnedComment = `🔥 Episode 1 of ${cleanFranchiseName} is live! Drop a comment below with your favourite scene, and subscribe for Episode 2! ⚔️`
    }

    const thumbnailVariants = await this.getThumbnailVariants(franchiseId, episodeId)
    const masterThumbnail = thumbnailVariants.find(v => v.hasImage) || thumbnailVariants[0]

    return {
      success: true,
      isPending,
      franchiseId,
      episodeId,
      franchiseName: cleanFranchiseName,
      episodeName: cleanEpisodeName,
      canonicalTitle,
      partTag,
      totalDuration,
      formattedDuration: this.formatTimestamp(totalDuration),
      titles,
      chapters,
      chapterText,
      description,
      pinnedComment,
      thumbnailVariants,
      thumbnailPrompts: thumbnailVariants,
      masterThumbnail,
      tags: ['#manhwarecap', '#webtoon', '#animerecap', '#manhwa', '#actionmanhwa']
    }
  }

  /**
   * Markdown-First Truth TikTok & Shorts Package Generator
   */
  static async generateTikTokPackage(franchiseId, episodeId) {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const pkgMdPath = path.join(epPath, '03_YouTube_Package.md')
    const cleanFranchiseName = franchiseId.replace(/^Series_\d+_/, '').replace(/_/g, ' ')
    const cleanEpisodeName = episodeId.replace(/^EP\d+_/, '').replace(/_/g, ' ')

    let viralHooks = []
    let hookOverlayText = ''
    let caption = ''
    let pinnedComment = ''
    let isPending = true

    if (fsSync.existsSync(pkgMdPath)) {
      try {
        const mdContent = await fs.readFile(pkgMdPath, 'utf-8')
        isPending = false

        // Parse Climax Video Hook & On-Screen Overlay
        const hookMatch = mdContent.match(/###\s*1\.\s*Climax Video Hook[^\n]*\r?\n+```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
        if (hookMatch && hookMatch[1]) {
          hookOverlayText = hookMatch[1].trim()
        }

        // Parse Suggested Viral Caption & Hashtags
        const captionMatch = mdContent.match(/###\s*2\.\s*Suggested Viral Caption[^\n]*\r?\n+```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
        if (captionMatch && captionMatch[1]) {
          caption = captionMatch[1].trim()
        }

        // Parse Pinned Bio Comment
        const bioMatch = mdContent.match(/###\s*3\.\s*Pinned Bio Comment[^\n]*\r?\n+```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
        if (bioMatch && bioMatch[1]) {
          pinnedComment = bioMatch[1].trim()
        }

        // Parse titles as viral hooks (< 100 characters strictly enforced)
        const ctrScores = ['99%', '98%', '97%', '96%', '95%']
        
        // Check for dedicated Shorts viral titles section first
        const shortsSectionMatch = mdContent.match(/###\s*(?:[0-9.]*\s*)?(?:Viral\s+)?Shorts\s+Titles[^\n]*\r?\n([\s\S]*?)(?:\r?\n###|\r?\n---|$)/i)
        if (shortsSectionMatch && shortsSectionMatch[1]) {
          const sLines = shortsSectionMatch[1].split(/\r?\n/)
          for (const sLine of sLines) {
            const sm = sLine.match(/^\d+\.\s+(?:\*\*)?([^\*\r\n]+)(?:\*\*)?/)
            if (sm && viralHooks.length < 5) {
              let t = sm[1].trim()
              if (!t.endsWith('💀') && !t.endsWith('☕') && !t.endsWith('😭') && !t.endsWith('🔥')) {
                t += ' 💀'
              }
              if (t.length > 95) t = t.substring(0, 92) + '... 💀'
              viralHooks.push({
                title: t,
                hookType: `Viral Hook ${viralHooks.length + 1}`,
                ctrScore: ctrScores[viralHooks.length] || '95%'
              })
            }
          }
        }

        // Fallback: parse main titles with defensive < 100 char trimming
        if (viralHooks.length === 0) {
          const lines = mdContent.split(/\r?\n/)
          let idx = 0
          for (const line of lines) {
            const m = line.match(/^\d+\.\s+\*\*([^\*]+)\*\*/)
            if (m && idx < 5) {
              let t = m[1].trim()
              // Strict < 100 character defense: ensure title + emoji is <= 95 characters
              if (t.length > 88) {
                t = t.substring(0, 85) + '...'
              }
              t = t + ' 💀'
              viralHooks.push({
                title: t,
                hookType: `Viral Hook ${idx + 1}`,
                ctrScore: ctrScores[idx] || '95%'
              })
              idx++
            }
          }
        }
      } catch (err) {
        console.warn('Could not parse 03_YouTube_Package.md for TikTok:', err.message)
      }
    }

    if (viralHooks.length === 0) {
      viralHooks = [
        { title: `They mocked him in the beginning... until his hidden foundation awakened 💀`, hookType: 'Underdog Awakening', ctrScore: '99%' },
        { title: `Arrogant elite drew their weapon on him... and instantly regretted it 😭`, hookType: 'Combat Shock', ctrScore: '98%' },
        { title: `When everyone thought he was the weakest, he solo-cleaved the entire raid ☕`, hookType: 'Sovereign Cleave', ctrScore: '96%' }
      ]
    }

    if (!hookOverlayText) {
      hookOverlayText = `When arrogant adversaries underestimate a hidden sovereign, unaware of his true foundation...`
    }

    if (!caption) {
      caption = `They mocked him at first... but when crisis struck, they realized who the true master was! 💀\n\nWatch the full continuous story on YouTube (Link in bio 🔗)\n\n#manhwa #manhwarecap #webtoon #animerecap #overpowered #actionmanhwa`
    }

    if (!pinnedComment) {
      pinnedComment = `The full continuous story is live on our YouTube channel! Watch now (Link in bio 🔗) Search "${cleanFranchiseName}" on YouTube!`
    }

    const hashtags = [
      '#manhwarecap',
      '#webtoon',
      '#animerecap',
      '#manhwa',
      '#overpoweredmc',
      '#actionmanhwa',
      '#fyp',
      '#viral'
    ].join(' ')

    return {
      success: true,
      isPending,
      franchiseId,
      episodeId,
      franchiseName: cleanFranchiseName,
      episodeName: cleanEpisodeName,
      viralHooks,
      recommendedTitle: viralHooks[0]?.title || '',
      hookOverlayText,
      caption,
      hashtags,
      pinnedComment
    }
  }
}

