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
      const lines = mdContent.split(/\r?\n/)
      for (const line of lines) {
        const m = line.match(/^\s*-\s*\*\*(?:Concept|Variant)\s+([A-C])([^*]*?)\*\*:?\s*(.*)$/i)
        if (!m) continue
        const letter = m[1].toUpperCase()
        const labelExtra = (m[2] || '').replace(/:$/, '').trim()
        const rest = (m[3] || '').trim()
        const id = `concept_${letter.toLowerCase()}`

        const fileMatch = rest.match(/`?([^\s`]+\.(?:jpg|jpeg|png|webp))`?/i)
        const filename = fileMatch ? path.basename(fileMatch[1]) : (letter === 'A' ? '01_Thumbnail_Master.jpg' : `01_Thumbnail_Concept_${letter}.jpg`)

        let desc = rest
          .replace(/`?[^\s`]+\.(?:jpg|jpeg|png|webp)`?/i, '')
          .replace(/^[\s—–-]+/, '')
          .trim()
        if (!desc) desc = labelExtra.replace(/^\(|\)$/g, '').trim() || `Concept ${letter}`

        concepts.push({
          id,
          name: `Concept ${letter}: ${desc}`,
          subtitle: desc,
          badgeText: letter === 'A' ? 'PART 1' : letter === 'B' ? 'SYSTEM ERROR' : 'SOLO S-RANK',
          subBadgeText: '',
          badgeColorPreset: letter === 'A' ? 'gold_crimson' : letter === 'B' ? 'cyan_hud' : 'crimson_flame',
          badgePosition: 'bottom_left',
          composition: desc,
          prompt: '',
          filename
        })
      }
    }

    // If Markdown SSOT explicitly locks a Canonical Master Thumbnail (e.g. Concept A), filter to only that locked concept
    const lockedMatch = mdContent.match(/Locked\s+Canonical\s+Master\s+Thumbnail[^:\r\n]*:\s*\*?\*?(?:Concept|Variant)\s+([A-C])/i)
    if (lockedMatch && concepts.length > 1) {
      const lockedLetter = lockedMatch[1].toUpperCase()
      const lockedId = `concept_${lockedLetter.toLowerCase()}`
      const filtered = concepts.filter(c => c.id === lockedId)
      if (filtered.length === 1) {
        return filtered
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
    const franchisePath = path.join(franchisesDir, franchiseId)
    if (!fsSync.existsSync(franchisePath)) return []
    const epDir = path.join(franchisesDir, franchiseId, episodeId)
    const thumbDir = this.getThumbnailsDir(franchiseId, episodeId)
    const bibleDir = path.join(franchisesDir, franchiseId, '00_Series_Bible_and_Character_DNA')
    if (fsSync.existsSync(epDir)) {
      await fs.mkdir(thumbDir, { recursive: true }).catch(() => {})
    }

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
    const franchisePath = path.join(franchisesDir, franchiseId)
    if (!fsSync.existsSync(franchisePath)) {
      throw new Error(`Franchise directory not found: ${franchiseId}`)
    }
    let resolvedEpisodeId = episodeId
    if (!fsSync.existsSync(path.join(franchisePath, resolvedEpisodeId)) && fsSync.existsSync(franchisePath)) {
      const entries = fsSync.readdirSync(franchisePath, { withFileTypes: true })
      const match = entries.find(d => d.isDirectory() && (d.name.toLowerCase() === resolvedEpisodeId.toLowerCase() || d.name.toLowerCase().startsWith(resolvedEpisodeId.toLowerCase() + '_')))
      if (match) resolvedEpisodeId = match.name
    }
    const epPath = path.join(franchisesDir, franchiseId, resolvedEpisodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    const pkgMdPath = path.join(epPath, '03_YouTube_Package.md')
    const masterAudioPath = TtsService.getAudioFilePath(franchiseId, resolvedEpisodeId, '01_Episode_Master.mp3')

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
    const seriesNumMatch = franchiseId.match(/Series_0*(\d+)/i)
    const isActPartModel = seriesNumMatch ? parseInt(seriesNumMatch[1], 10) >= 7 : false
    const partNum = Math.ceil(epNum / 3)
    const partTag = isActPartModel ? `Part ${partNum}` : `Episode ${epNum}`

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
            const prefix = isActPartModel ? '(Part ' + partNum + ')' : '(Episode ' + epNum + ')'; rawFoundTitles.push(prefix + ' ' + baseMatch[1].trim())
          }
        }
      }

      if (rawFoundTitles.length > 0) {
        const ctrScores = ['99%', '98%', '97%', '96%', '95%', '94%', '93%', '92%', '91%', '90%']
        titles = rawFoundTitles.slice(0, 10).map((t, idx) => {
          let adjustedTitle = t
          if (isActPartModel) {
            adjustedTitle = adjustedTitle.replace(/^\((?:Episode|Episodes)\s+\d+(?:-\d+)?\)/i, `(Part ${partNum})`)
          }
          return {
            archetype: `High-CTR Archetype ${idx + 1}`,
            title: adjustedTitle,
            ctrScore: ctrScores[idx] || '92%',
            charCount: adjustedTitle.length,
            isCompliant: adjustedTitle.length <= 100
          }
        })
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
    const rangeTag = isActPartModel ? `Part ${partNum}` : (epNum > 1 ? `Episode 1-${epNum}` : 'Episode 1')
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
      pinnedComment = isActPartModel
        ? `🔥 Part ${partNum} of ${cleanFranchiseName} is live! Drop a comment below with your favourite scene, and subscribe for Part ${partNum + 1}! ⚔️`
        : `🔥 Episode 1 of ${cleanFranchiseName} is live! Drop a comment below with your favourite scene, and subscribe for Episode 2! ⚔️`
    }

    const thumbnailVariants = await this.getThumbnailVariants(franchiseId, resolvedEpisodeId)
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
      partBadgeText: isActPartModel ? `PART ${partNum}` : (epNum > 1 ? `1 - ${epNum}` : 'EP 1'),
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
  
  /**
   * Convert Roman numeral or digit token ("II", "2") to integer.
   */
  static parseRomanOrInt(token = '') {
    const clean = String(token).trim().toUpperCase()
    if (/^\d+$/.test(clean)) return parseInt(clean, 10)
    const map = { I: 1, V: 5, X: 10, L: 50 }
    let total = 0
    for (let i = 0; i < clean.length; i++) {
      const cur = map[clean[i]] || 0
      const nxt = map[clean[i + 1]] || 0
      total += cur < nxt ? -cur : cur
    }
    return total || 1
  }

  /**
   * Parse canonical Act structure dynamically from Series_Bible.md + existing EP folders.
   */
  static async parseSeriesActs(franchiseId) {
    const franchiseDir = path.join(franchisesDir, franchiseId)
    const biblePath = path.join(franchiseDir, '00_Series_Bible_and_Character_DNA', 'Series_Bible.md')
    const entries = await fs.readdir(franchiseDir, { withFileTypes: true }).catch(() => [])
    const epDirs = entries
      .filter(d => d.isDirectory() && /^EP\d+/i.test(d.name))
      .map(d => d.name)
      .filter(epId => {
        const hasScript = fsSync.existsSync(path.join(franchiseDir, epId, '01_Episode_Script.md'))
        const hasMatrix = fsSync.existsSync(path.join(franchiseDir, epId, '02_Prompt_Matrix.md'))
        return hasScript || hasMatrix
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    const epNumMap = new Map()
    for (const epId of epDirs) {
      const m = epId.match(/^EP0*(\d+)/i)
      if (m) {
        const num = parseInt(m[1], 10)
        if (!epNumMap.has(num)) epNumMap.set(num, epId)
      }
    }

    const parsedActs = []
    if (fsSync.existsSync(biblePath)) {
      const bibleText = await fs.readFile(biblePath, 'utf-8').catch(() => '')
      const actRe = /^#{2,4}\s*Act\s+([IVXLCDM]+|\d+)\s*[:–—-]\s*([^(\r\n]+?)\s*\(EP0*(\d+)\s*[–—-]\s*EP0*(\d+)\)/gim
      let m
      while ((m = actRe.exec(bibleText)) !== null) {
        const actNumber = this.parseRomanOrInt(m[1])
        const title = m[2].trim()
        const startEp = parseInt(m[3], 10)
        const endEp = parseInt(m[4], 10)
        if (!parsedActs.some(a => a.actNumber === actNumber)) {
          const episodeIds = []
          for (let n = startEp; n <= endEp; n++) {
            if (epNumMap.has(n)) episodeIds.push(epNumMap.get(n))
          }
          parsedActs.push({
            actNumber,
            title,
            startEp,
            endEp,
            rangeLabel: `EP${String(startEp).padStart(2, '0')}–EP${String(endEp).padStart(2, '0')}`,
            episodeIds
          })
        }
      }
    }

    if (parsedActs.length === 0 && epDirs.length > 0) {
      for (let i = 0; i < epDirs.length; i += 3) {
        const chunk = epDirs.slice(i, i + 3)
        const actNumber = Math.floor(i / 3) + 1
        const startEp = parseInt((chunk[0].match(/^EP0*(\d+)/i) || [0, i + 1])[1], 10)
        const endEp = parseInt((chunk[chunk.length - 1].match(/^EP0*(\d+)/i) || [0, i + chunk.length])[1], 10)
        parsedActs.push({
          actNumber,
          title: `Act ${actNumber}`,
          startEp,
          endEp,
          rangeLabel: `EP${String(startEp).padStart(2, '0')}–EP${String(endEp).padStart(2, '0')}`,
          episodeIds: chunk
        })
      }
    }

    // Attach compiled Act metadata status if present on disk
    const omnibusDir = path.join(franchiseDir, 'omnibus')
    for (const act of parsedActs) {
      const actMetaPath = path.join(omnibusDir, `act_${act.actNumber}_metadata.json`)
      let meta = null
      if (fsSync.existsSync(actMetaPath)) {
        try { meta = JSON.parse(await fs.readFile(actMetaPath, 'utf-8')) } catch (_) {}
      }
      act.hasCompiledAct = !!(meta && meta.filename && fsSync.existsSync(path.join(omnibusDir, meta.filename)))
      act.compiledFilename = meta?.filename || null
      act.totalDurationFormatted = meta?.totalDurationFormatted || null
    }

    return parsedActs.sort((a, b) => a.actNumber - b.actNumber)
  }

  /**
   * Resolve Act number & range for a set of episode IDs or numbers.
   */
  static async detectActForEpisodes(franchiseId, episodeIds = [], explicitActNum = null) {
    const acts = await this.parseSeriesActs(franchiseId)
    const nums = episodeIds
      .map(id => {
        const m = String(id).match(/EP0*(\d+)/i)
        return m ? parseInt(m[1], 10) : null
      })
      .filter(n => n !== null)
      .sort((a, b) => a - b)

    const startEp = nums[0] || 1
    const endEp = nums[nums.length - 1] || startEp

    if (explicitActNum) {
      const match = acts.find(a => a.actNumber === Number(explicitActNum))
      if (match) return { ...match, startEp: nums[0] || match.startEp, endEp: nums[nums.length - 1] || match.endEp }
    }

    // Exact or primary overlap match against Bible Acts
    const overlap = acts.find(a => startEp >= a.startEp && endEp <= a.endEp)
    if (overlap) return { ...overlap, startEp, endEp }

    const firstStartMatch = acts.find(a => a.startEp === startEp)
    if (firstStartMatch && nums.length <= (firstStartMatch.endEp - firstStartMatch.startEp + 1)) {
      return { ...firstStartMatch, startEp, endEp }
    }

    const inferredAct = Math.max(1, Math.ceil(startEp / 3))
    return {
      actNumber: inferredAct,
      title: `Act ${inferredAct}`,
      startEp,
      endEp,
      rangeLabel: `EP${String(startEp).padStart(2, '0')}–EP${String(endEp).padStart(2, '0')}`,
      episodeIds
    }
  }

  /**
   * Synchronises verified compilation metadata directly into YouTube packages and Master Bible
   * Called automatically upon omnibus/Act master compilation (Studio UI & fast-compile CLI).
   */
  static async syncOmnibusMetadataToPackages(franchiseId, metadata) {
    if (!franchiseId || !metadata) return

    const franchiseDir = path.join(franchisesDir, franchiseId)
    const bibleDir = path.join(franchiseDir, '00_Series_Bible_and_Character_DNA')
    const masterLockedPkgPath = path.join(bibleDir, 'YouTube_Locked_Package.md')
    const omnibusDir = path.join(franchiseDir, 'omnibus')
    await fs.mkdir(omnibusDir, { recursive: true })

    const seriesNumMatch = franchiseId.match(/Series_0*(\d+)/i)
    const isActPartModel = seriesNumMatch ? parseInt(seriesNumMatch[1], 10) >= 7 : true

    const chapterEpIds = Array.isArray(metadata.chapters)
      ? metadata.chapters.map(c => c.episodeId).filter(Boolean)
      : []
    const actInfo = await this.detectActForEpisodes(franchiseId, chapterEpIds, metadata.actNumber)
    const actNumber = actInfo.actNumber || 1
    const startEp = actInfo.startEp || 1
    const endEp = actInfo.endEp || Math.max(startEp, chapterEpIds.length)
    const pad2 = n => String(n).padStart(2, '0')

    const durFormatted = metadata.totalDurationFormatted || '1h 00m 00s'
    const finalTs = metadata.finalTimestampFormatted || '1:00:00'
    const totalSec = metadata.totalDurationSeconds || 3600
    const totalMinsDecimal = (totalSec / 60).toFixed(1)

    // Build 00:00-based Chapter Timestamps block for the compiled Act/Omnibus
    let chapterLines = []
    if (Array.isArray(metadata.chapters) && metadata.chapters.length > 0) {
      chapterLines = metadata.chapters.map((c, idx) => {
        const epMatch = String(c.episodeId || '').match(/EP0*(\d+)/i)
        const epNum = epMatch ? parseInt(epMatch[1], 10) : (startEp + idx)
        return `${c.startTimestampFormatted} - Episode ${pad2(epNum)}: ${c.episodeTitle} (${c.durationFormatted})`
      })
      chapterLines.push(`${finalTs} - Act ${actNumber} Climax & Cliffhanger`)
    } else if (metadata.youtubeChapterString) {
      chapterLines = metadata.youtubeChapterString.split(/\r?\n/)
    }

    const timestampBlock = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n⏱️ CHAPTER TIMESTAMPS:\n${chapterLines.join('\n')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

    // Generate/Update YouTube_Act{N}_Launch_Package.md (titles, description, timestamps, pinned comment, thumbnail)
    const actLaunchPath = path.join(omnibusDir, `YouTube_Act${actNumber}_Launch_Package.md`)
    const canonicalTitle = this.getCanonicalSeriesTitle(franchiseId)
    const cleanFranchiseName = franchiseId.replace(/^Series_\d+_/, '').replace(/_/g, ' ').trim()
    const prefixTag = isActPartModel ? `(Part ${actNumber})` : `(Episode ${startEp}-${endEp})`
    const rawActTitle = `${prefixTag} ${canonicalTitle}`.trim()
    const lockedActTitle = rawActTitle.length <= 100 ? rawActTitle : `${rawActTitle.slice(0, 97).trim()}...`

    // Pull synopsis & locked title options from YouTube_Locked_Package.md or first episode in Act
    let baseSynopsis = ''
    let existingMasterTitles = []
    if (fsSync.existsSync(masterLockedPkgPath)) {
      const mText = await fs.readFile(masterLockedPkgPath, 'utf-8').catch(() => '')
      const synMatch = mText.match(/##\s*[^\n]*Description[^\n]*[\s\S]*?```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
      if (synMatch?.[1]) {
        const lines = synMatch[1].trim().split(/\r?\n/).filter(l => l.trim() && !/^(?:\(|🔥|🎬|⏱️|•|━|💬|🔔|#)/.test(l.trim()))
        baseSynopsis = lines.slice(0, 3).join('\n\n')
      }
      const uploadMatches = [...mText.matchAll(/`([^`\r\n]{16,120})`/g)].map(x => x[1].trim())
      existingMasterTitles = uploadMatches.filter(t => !/^[A-Z0-9_]+\.(?:mp4|jpg|md)$/.test(t))
    }

    const firstEpId = chapterEpIds[0] || `EP${pad2(startEp)}`
    const firstEpPkgPath = path.join(franchiseDir, firstEpId, '03_YouTube_Package.md')
    let epSynopsis = ''
    let epQuestion = ''
    const actTitles = [lockedActTitle]
    if (fsSync.existsSync(firstEpPkgPath)) {
      const epText = await fs.readFile(firstEpPkgPath, 'utf-8').catch(() => '')
      const qMatch = epText.match(/💬\s*COMMUNITY QUESTION:\s*\r?\n([^\r\n]+)/i)
      if (qMatch?.[1]) epQuestion = qMatch[1].trim()
      const descMatch = epText.match(/##\s*[^\n]*(?:Description|SEO)[^\n]*[\s\S]*?```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
      if (descMatch?.[1]) {
        const lines = descMatch[1].trim().split(/\r?\n/).filter(l => l.trim() && !/^(?:\(|🔥|🎬|⏱️|•|━|💬|🔔|#)/.test(l.trim()))
        epSynopsis = lines.slice(0, 2).join('\n\n')
      }
      const titleMatches = [...epText.matchAll(/^\d+\.\s+(?:\*\*|`)?([^\r\n`*]{16,110})(?:\*\*|`)?/gm)]
      for (const tm of titleMatches) {
        let candidate = tm[1].replace(/\s*\(\d+\s*chars?\)\s*$/i, '').trim()
        candidate = candidate.replace(/^\((?:Episode|Episodes|Part|Parts)\s*[^)]*\)\s*/i, '')
        const prefixed = `${prefixTag} ${candidate}`.trim()
        if (prefixed.length <= 100 && !actTitles.includes(prefixed)) {
          actTitles.push(prefixed)
        }
        if (actTitles.length >= 5) break
      }
    }

    for (const mt of existingMasterTitles) {
      if (actTitles.length >= 5) break
      const stripped = mt.replace(/^\((?:Episode|Episodes|Part|Parts)\s*[^)]*\)\s*/i, '').trim()
      const prefixed = `${prefixTag} ${stripped}`.trim()
      if (prefixed.length <= 100 && !actTitles.includes(prefixed)) actTitles.push(prefixed)
    }

    const synopsisBlock = epSynopsis || baseSynopsis || `Following ${actInfo.title}, every hidden card comes onto the board as ancient powers awaken.`
    const releaseLine = isActPartModel
      ? `🎬 Release: Part ${actNumber} — ${actInfo.title} (Covers Episodes ${pad2(startEp)} - ${pad2(endEp)})`
      : `🎬 Release: Episodes ${pad2(startEp)} - ${pad2(endEp)} Compiled Saga`
    const communityLine = epQuestion || `Which moment in Act ${actNumber} (${actInfo.title}) hit hardest? Drop your timestamp below! 👇`
    const subscribeLine = `🔔 Subscribe and hit the bell so you don't miss Part ${actNumber + 1} (Act ${actNumber + 1})!`

    // Auto-composite Act Thumbnail with PART N badge (if base image is present)
    const actThumbDir = path.join(omnibusDir, 'thumbnails')
    await fs.mkdir(actThumbDir, { recursive: true })
    const actThumbFilename = `01_Thumbnail_Act${actNumber}.jpg`
    const actThumbPath = path.join(actThumbDir, actThumbFilename)
    const badgeLabel = isActPartModel ? `PART ${actNumber}` : `${startEp} - ${endEp}`
    const subBadgeLabel = `EP ${pad2(startEp)} - ${pad2(endEp)}`

    const findTextlessInDir = (dir) => {
      if (!fsSync.existsSync(dir)) return null
      const files = fsSync.readdirSync(dir)
      const hit = files.find(f => /01_thumbnail_(?:concept_a|master)_textless\.jpe?g$/i.test(f)) ||
        files.find(f => /01_thumbnail_concept_a_raw\.jpe?g$/i.test(f))
      return hit ? path.join(dir, hit) : null
    }
    const allEpDirs = fsSync.readdirSync(franchiseDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && /^EP\d+/i.test(d.name))
      .map(d => d.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    const epTextlessHits = allEpDirs.map(d => findTextlessInDir(path.join(franchiseDir, d, 'thumbnails'))).filter(Boolean)
    const thumbCandidates = [
      path.join(actThumbDir, `01_Thumbnail_Act${actNumber}_Textless.jpg`),
      findTextlessInDir(actThumbDir),
      findTextlessInDir(path.join(franchiseDir, firstEpId, 'thumbnails')),
      ...epTextlessHits,
      path.join(franchiseDir, firstEpId, 'thumbnails', '01_Thumbnail_Concept_A.jpg'),
      path.join(omnibusDir, '01_Thumbnail_Master.jpg')
    ].filter(Boolean)
    const baseThumbPath = thumbCandidates.find(p => fsSync.existsSync(p))
    if (baseThumbPath && !fsSync.existsSync(actThumbPath)) {
      try {
        const baseBuf = await sharp(baseThumbPath).resize(1920, 1080, { fit: 'cover', position: 'center' }).toBuffer()
        const svg = this.generateBadgeSvg({
          badgeText: badgeLabel,
          subBadgeText: subBadgeLabel,
          badgeColorPreset: 'gold_crimson',
          badgePosition: 'top_left',
          width: 1920,
          height: 1080
        })
        let outBuf = await sharp(baseBuf).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).jpeg({ quality: 90, mozjpeg: true, progressive: true }).toBuffer()
        if (outBuf.length > 1.95 * 1024 * 1024) {
          outBuf = await sharp(baseBuf).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toBuffer()
        }
        await fs.writeFile(actThumbPath, outBuf)
      } catch (thumbErr) {
        console.warn('[PackagingService] Act thumbnail badge composite skipped:', thumbErr.message)
      }
    }

    const descriptionBody = [
      lockedActTitle,
      '',
      synopsisBlock,
      '',
      `🔥 Series: ${canonicalTitle}`,
      releaseLine,
      '⏱️ FULL COMPILATION RUNTIME & TIMELINE:',
      `• Full Runtime: ${totalMinsDecimal} Minutes (${finalTs})`,
      `• Episode Bounds: 00:00 - ${finalTs}`,
      '',
      timestampBlock,
      '',
      '💬 COMMUNITY QUESTION:',
      communityLine,
      '',
      subscribeLine,
      '',
      '#manhwarecap #webtoon #animerecap #manhwa #actionmanhwa'
    ].join('\n')

    const pinnedCommentBody = `🔥 Part ${actNumber} (${actInfo.title} — Episodes ${pad2(startEp)}–${pad2(endEp)}) is live! Drop your favourite scene timestamp below and subscribe for Part ${actNumber + 1}! ⚔️`
    const epBulletList = (metadata.chapters || []).map((c, idx) => `\`EP${pad2(startEp + idx)}\` (${c.durationFormatted})`).join(', ')
    const actMd = [
      `# 🚀 YouTube & Shorts Release Launchpad — ${franchiseId.replace(/_/g, ' ')} (Act ${actNumber}: Episodes ${startEp}–${endEp})`,
      '',
      `> **Franchise:** ${canonicalTitle}  `,
      `> **Release Tier:** Act ${actNumber} Feature (${actInfo.title})  `,
      `> **Episodes Included:** ${epBulletList || `EP${pad2(startEp)}–EP${pad2(endEp)}`}  `,
      `> **Verified Master Runtime:** \`${durFormatted}\` (\`${totalSec.toFixed(2)}s\`)  `,
      `> **Master File:** \`${metadata.filename || ''}\`  `,
      `> **Thumbnail:** \`omnibus/thumbnails/${actThumbFilename}\` (Badge: \`${badgeLabel}\`)  `,
      '',
      '---',
      '',
      '## 🏷️ 1. Master Title Kit (<= 100 Characters)',
      '',
      `### Primary Locked Master Title (${lockedActTitle.length} chars):`,
      '```text',
      lockedActTitle,
      '```',
      '',
      ...actTitles.map((t, idx) => `${idx + 1}. ${t}`),
      '',
      '---',
      '',
      '## 🖼️ 2. Master Visual Thumbnail',
      '',
      `- **Locked Act Thumbnail:** \`omnibus/thumbnails/${actThumbFilename}\``,
      `- **Badge:** \`${badgeLabel}\` / \`${subBadgeLabel}\``,
      `- **Filename:** \`${actThumbFilename}\``,
      '',
      '---',
      '',
      '## 📋 3. YouTube Master Description Box (Copy-Paste Ready)',
      '',
      '```text',
      descriptionBody,
      '```',
      '',
      '---',
      '',
      '## 💬 4. Pinned Community Comment',
      '',
      '```text',
      pinnedCommentBody,
      '```',
      ''
    ].join('\n')

    await fs.writeFile(actLaunchPath, actMd, 'utf-8').catch(() => {})

    // Save per-Act metadata JSON cleanly
    const enrichedMeta = {
      ...metadata,
      actNumber,
      actTitle: actInfo.title,
      startEp,
      endEp,
      partBadgeText: badgeLabel,
      launchPackageFile: path.basename(actLaunchPath),
      thumbnailFile: actThumbFilename
    }
    await fs.writeFile(path.join(omnibusDir, `act_${actNumber}_metadata.json`), JSON.stringify(enrichedMeta, null, 2), 'utf-8').catch(() => {})
    await fs.writeFile(path.join(omnibusDir, 'omnibus_metadata.json'), JSON.stringify(enrichedMeta, null, 2), 'utf-8').catch(() => {})

    // Keep Master Bible SSOT timestamps synced
    if (fsSync.existsSync(masterLockedPkgPath)) {
      let c = await fs.readFile(masterLockedPkgPath, 'utf-8').catch(() => '')
      if (c) {
        c = c.replace(/•\s*Full Runtime:[^\n]+/i, `• Full Runtime: ${totalMinsDecimal} Minutes (${finalTs})`)
        c = c.replace(/•\s*Episode Bounds:[^\n]+/i, `• Episode Bounds: 00:00 - ${finalTs}`)
        const chapterRegex = /━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r?\n⏱️ CHAPTER TIMESTAMPS:[\s\S]*?━━━━━━━━━━━━━━━━━━━━━━━━━━━━/i
        if (chapterRegex.test(c)) c = c.replace(chapterRegex, timestampBlock)
        await fs.writeFile(masterLockedPkgPath, c, 'utf-8').catch(() => {})
      }
    }
  }

  /**
   * Load full YouTube Launchpad package for a specific Act (Act 1, Act 2, ...).
   */
  static async getActPackage(franchiseId, actNumber = 1) {
    const actNum = parseInt(actNumber, 10) || 1
    const acts = await this.parseSeriesActs(franchiseId)
    const actInfo = acts.find(a => a.actNumber === actNum) || {
      actNumber: actNum,
      title: `Act ${actNum}`,
      startEp: (actNum - 1) * 3 + 1,
      endEp: actNum * 3,
      episodeIds: []
    }

    const franchiseDir = path.join(franchisesDir, franchiseId)
    const omnibusDir = path.join(franchiseDir, 'omnibus')
    const actPkgPath = path.join(omnibusDir, `YouTube_Act${actNum}_Launch_Package.md`)
    const actMetaPath = path.join(omnibusDir, `act_${actNum}_metadata.json`)
    const actThumbFilename = `01_Thumbnail_Act${actNum}.jpg`
    const actThumbPath = path.join(omnibusDir, 'thumbnails', actThumbFilename)

    let actMetadata = null
    if (fsSync.existsSync(actMetaPath)) {
      try { actMetadata = JSON.parse(await fs.readFile(actMetaPath, 'utf-8')) } catch (_) {}
    } else if (actNum === 1) {
      actMetadata = await VideoService.getOmnibusMetadata(franchiseId).catch(() => null)
    }

    // If package markdown missing yet, synthesize preview dynamically from Act's first episode + metadata
    if (!fsSync.existsSync(actPkgPath) && actMetadata) {
      await this.syncOmnibusMetadataToPackages(franchiseId, { ...actMetadata, actNumber: actNum })
    }

    const canonicalTitle = this.getCanonicalSeriesTitle(franchiseId)
    const cleanFranchiseName = franchiseId.replace(/^Series_\d+_/, '').replace(/_/g, ' ').trim()
    const pad2 = n => String(n).padStart(2, '0')
    const seriesNumMatch = franchiseId.match(/Series_0*(\d+)/i)
    const isActPartModel = seriesNumMatch ? parseInt(seriesNumMatch[1], 10) >= 7 : true
    const partBadgeText = isActPartModel ? `PART ${actNum}` : `${actInfo.startEp} - ${actInfo.endEp}`

    let titles = []
    let description = ''
    let pinnedComment = ''
    let chapters = []
    let isPending = !fsSync.existsSync(actPkgPath)

    if (fsSync.existsSync(actPkgPath)) {
      const md = await fs.readFile(actPkgPath, 'utf-8')
      const ctrScores = ['99%', '98%', '97%', '96%', '95%']
      const titleLines = [...md.matchAll(/^\d+\.\s+(.+)$/gm)].map(m => m[1].trim()).filter(Boolean)
      titles = titleLines.slice(0, 5).map((t, i) => ({
        archetype: i === 0 ? `Locked Act ${actNum} Title` : `High-CTR Variant ${i + 1}`,
        title: t,
        ctrScore: ctrScores[i] || '94%',
        charCount: t.length,
        isCompliant: t.length <= 100
      }))
      const descM = md.match(/##\s*[^\n]*Description Box[^\n]*[\s\S]*?```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
      if (descM?.[1]) description = descM[1].trim()
      const commM = md.match(/##\s*[^\n]*Pinned Community Comment[^\n]*[\s\S]*?```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
      if (commM?.[1]) pinnedComment = commM[1].trim()
      const chapM = md.match(/⏱️\s*CHAPTER TIMESTAMPS:\s*\r?\n([\s\S]*?)(?:\r?\n\s*━|$)/i)
      if (chapM?.[1]) {
        for (const line of chapM[1].split(/\r?\n/)) {
          const lm = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]\s*(.+)$/)
          if (lm) chapters.push({ time: lm[1].trim(), seconds: this.parseTimestampToSeconds(lm[1].trim()), title: lm[2].trim() })
        }
      }
    }

    if (titles.length === 0) {
      const t = `(Part ${actNum}) ${canonicalTitle}`.slice(0, 100)
      titles = [{ archetype: `Act ${actNum} Default Title`, title: t, ctrScore: '99%', charCount: t.length, isCompliant: t.length <= 100 }]
    }
    if (!description) {
      description = `🔥 Series: ${canonicalTitle}\n🎬 Release: Part ${actNum} — ${actInfo.title} (Covers Episodes ${pad2(actInfo.startEp)} - ${pad2(actInfo.endEp)})\n\n⏳ Compile Act ${actNum} in the Master Compiler to auto-populate exact timestamps and runtime.`
    }
    if (!pinnedComment) {
      pinnedComment = `🔥 Part ${actNum} (${actInfo.title}) of ${cleanFranchiseName} is live! Drop a comment below and subscribe for Part ${actNum + 1}! ⚔️`
    }

    const firstEpId = actInfo.episodeIds?.[0] || `EP${pad2(actInfo.startEp)}`
    const fallbackVariants = await this.getThumbnailVariants(franchiseId, firstEpId).catch(() => [])
    const hasActThumb = fsSync.existsSync(actThumbPath)
    const actThumbSize = hasActThumb ? fsSync.statSync(actThumbPath).size : 0
    const thumbnailVariants = hasActThumb
      ? [
          {
            ...(fallbackVariants[0] || {}),
            id: 'concept_a',
            name: fallbackVariants[0]?.name || `Act ${actNum} Master Thumbnail (${partBadgeText})`,
            filename: actThumbFilename,
            hasImage: true,
            hasBakedBadge: true,
            url: `/api/franchises/${franchiseId}/omnibus/thumbnails/${actThumbFilename}?t=${Date.now()}`,
            fileSize: actThumbSize,
            fileSizeFormatted: this.formatFileSize(actThumbSize),
            isYouTubeCompliant: actThumbSize < 2 * 1024 * 1024
          },
          ...fallbackVariants.slice(1)
        ]
      : fallbackVariants

    return {
      success: true,
      isPending,
      isActPackage: true,
      actNumber: actNum,
      actTitle: actInfo.title,
      startEp: actInfo.startEp,
      endEp: actInfo.endEp,
      compiledFilename: actMetadata?.filename || actInfo.compiledFilename || null,
      partBadgeText,
      totalDuration: actMetadata?.totalDurationSeconds || 0,
      formattedDuration: actMetadata?.totalDurationFormatted || 'Pending Compile',
      titles,
      chapters,
      chapterText: chapters.map(c => `${c.time} - ${c.title}`).join('\n'),
      description,
      pinnedComment,
      thumbnailVariants,
      masterThumbnail: thumbnailVariants.find(v => v.hasImage) || thumbnailVariants[0] || null,
      actMetadata
    }
  }

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

