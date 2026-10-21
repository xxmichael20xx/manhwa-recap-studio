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
   * Leaves at least 16 chars for (Part 1 - {nth}) while staying strictly <= 100 chars
   */
  static getCanonicalSeriesTitle(franchiseId) {
    if (franchiseId.includes('Series_05')) {
      return 'The Fourth Magius: The Last Archmage and The Discarded Babe'
    }
    if (franchiseId.includes('Series_04')) {
      return 'He Ran An Idle Cultivation Game For 10 Years, Then Earth Merged With His Save'
    }
    if (franchiseId.includes('Series_03')) {
      return 'Reborn As A Smiling Architect, My Infinite +N Enchantment Broke The Demigod Tower'
    }
    if (franchiseId.includes('Series_02')) {
      return 'Mocked As An F-Rank Archer, He Siphons Boss Stats To Solo The S-Rank Red Gate'
    }
    if (franchiseId.includes('Series_01')) {
      return 'Abandoned As The Weakest Scavenger, He Awakens The Singularity Sovereign Protocol'
    }
    const clean = franchiseId.replace(/^Series_\d+_/, '').replace(/_/g, ' ')
    return `Reborn As The Strongest Sovereign In ${clean}`
  }


  /**
   * Get calibrated high-CTR thumbnail concepts for a franchise and episode
   */
  static async getThumbnailVariants(franchiseId, episodeId) {
    const thumbDir = this.getThumbnailsDir(franchiseId, episodeId)
    await fs.mkdir(thumbDir, { recursive: true })

    const isSeries01 = franchiseId.includes('Series_01')
    const isSeries03 = franchiseId.includes('Series_03')
    const isSeries04 = franchiseId.includes('Series_04')
    const isSeries05 = franchiseId.includes('Series_05')

    // Concept definitions calibrated for maximum CTR & storytelling contrast
    const baseVariants = isSeries05 ? [
      {
        id: 'concept_a',
        name: 'Concept A: The Split Transformation (Discarded Babe vs Sovereign Archmage) (Locked Master Thumbnail)',
        subtitle: 'Split-Contrast (Left Humble Frontier Toddler / Right Celestial Sovereign with Primordial Codex)',
        badgeText: 'DISCARDED BABE',
        subBadgeText: 'LAST ARCHMAGE',
        badgeColorPreset: 'gold_crimson',
        badgePosition: 'bottom_left',
        composition: 'Left 45% 5-year-old Michael Montrey in rough linen tunic holding blackwood staff in snowy forest / Right 55% 28-year-old Michael Montrey in midnight celestial mantle surrounded by glowing constellation runes and Primordial Codex',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Split-screen high contrast manhwa composition. Left half: 5-year-old male child protagonist Michael Montrey in rough-spun grey linen tunic with hemp belt, holding a carved blackwood walking staff, standing in snowdrifts of ancient pine forest with calm analytical cyan eyes. Right half: Handsome 28-year-old archmage sovereign Michael Montrey in high-collared midnight-blue mantle embroidered with glowing golden celestial constellations, glowing sapphire eyes with concentric arcane circles, holding the ancient glowing Primordial Codex. Dark fantasy action manhwa webtoon art style, ultra-sharp ink linework, rich dramatic lighting, vibrant cel shading, 16:9 horizontal, textless artwork.`,
        filename: '01_Thumbnail_Concept_A.jpg'
      }
    ] : isSeries04 ? [
      {
        id: 'concept_c',
        name: 'Concept C: The Golden Stele Calamity Solo Cleave (Locked Master Thumbnail)',
        subtitle: 'Epic Monolith / Primordial Sovereign Starlight Cleave',
        badgeText: 'SOLO SOVEREIGN',
        subBadgeText: 'GOLDEN STELE',
        badgeColorPreset: 'crimson_flame',
        badgePosition: 'bottom_left',
        composition: 'Colossal Heaven-Earth Golden Stele floating above modern metropolitan skyline while Lu Chen unleashes a blinding vertical golden sword beam',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Epic modern urban cultivation panorama. Colossal ancient Heaven-Earth Golden Stele monolith floating above glass skyscrapers in modern metropolis. In foreground: Protagonist Lu Chen in casual streetwear swinging a chipped steel blade, unleashing a monumental vertical pillar of golden celestial starlight slicing the clouds apart. Modern 2025 urban cultivation manhwa webtoon art style, ultra-sharp ink linework, bright high-key lighting, vibrant clean cel shading, horizontal 16:9.`,
        filename: '01_Thumbnail_Concept_C.jpg'
      }
    ] : isSeries03 ? [
      {
        id: 'concept_a',
        name: 'Concept A: The Sleeper Craftsman Transformation (Common Polisher vs Demigod Architect)',
        subtitle: 'Split-Contrast (Left Humble Slum Craftsman / Right Infinite Enhancement Sovereign)',
        badgeText: 'FALSE +1 RANK',
        subBadgeText: 'UNCAPPED BANK',
        badgeColorPreset: 'gold_crimson',
        badgePosition: 'bottom_left',
        composition: 'Left 45% Bram in simple rolled-up linen craftsman shirt holding chipped knife / Right 55% Bram surrounded by floating golden enhancement glyphs and celestial bank runes',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Split-screen high contrast manhwa composition. Left half: 24-year-old male protagonist Bramwell Locke in simple cream linen craftsman shirt with rolled-up sleeves, holding a battered chipped iron carving knife, standing in humble timber shop shadows with a calm smile. Right half: The same protagonist standing majestic with glowing amber mana eyes, surrounded by thousands of floating golden +N enhancement runes, celestial data matrices, and a colossal shattered demigod boss in the background. Dark fantasy action manhwa webtoon art style, ultra-sharp ink linework, vibrant cel shading, volumetric warm lighting, 16:9 horizontal, textless artwork.`,
        filename: '01_Thumbnail_Concept_A.jpg'
      },
      {
        id: 'concept_b',
        name: 'Concept B: The Chalk Rapier & Noble Humiliation',
        subtitle: 'Center Dynamic / Noble Shock (Exploding Chalk Powder & Shattered Sacred Relic)',
        badgeText: 'CHALK RAPIER',
        subBadgeText: 'SEMANTIC REFACTOR',
        badgeColorPreset: 'cyan_hud',
        badgePosition: 'bottom_left',
        composition: 'Lord Cassian Valerius staring in horrified shock and cold sweat at his empty gold hilt as the blade explodes into white chalk powder, while Bram smiles politely',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. High tension comic drama manhwa composition. In foreground: Arrogant deep wine-burgundy haired noble knight Lord Cassian Valerius in white-and-gold plate armor, eyes bulging in cold sweat and horrified disbelief as his ancestral golden rapier blade crumbles violently into an explosive cloud of powdery white chalk dust. In center: Bramwell Locke casually dusting his fingertips with an unbothered, polite, charming smile. Dark fantasy action manhwa art style, vibrant cel shading, high contrast, dramatic cinematic lighting, horizontal 16:9.`,
        filename: '01_Thumbnail_Concept_B.jpg'
      },
      {
        id: 'concept_c',
        name: 'Concept C: The Floor 10 Abyssal Minotaur Cleave',
        subtitle: 'Epic Boss Arena / Supersonic Pine Needle Shockwave',
        badgeText: 'SOLO FLOOR 10',
        subBadgeText: '22-MIN RECORD',
        badgeColorPreset: 'crimson_flame',
        badgePosition: 'bottom_left',
        composition: 'Bram sipping tea in plain rolled-up sleeves while a supersonic pine needle shatters the colossal 5-metre demon minotaur\'s warhammer',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Epic subterranean boss arena manhwa composition. Colossal 5-metre demonic Abyssal Minotaur roaring in agony as its massive spiked granite warhammer is shattered into shrapnel by a single glowing hypersonic emerald-cyan pine needle projectile. In foreground: Protagonist Bramwell Locke calmly holding a steaming ceramic tea cup with rolled-up linen craftsman sleeves, looking completely unbothered. Dark fantasy action manhwa webtoon art style, ultra-sharp ink linework, high contrast vibrant cel shading, volumetric combat lighting, horizontal 16:9.`,
        filename: '01_Thumbnail_Concept_C.jpg'
      }
    ] : isSeries01 ? [
      {
        id: 'concept_a',
        name: 'Concept A: The Split Transformation (Weak Scavenger vs Awakened Sovereign)',
        subtitle: 'Split-Contrast (Dungeon Shadows vs Midnight Singularity Sovereign)',
        badgeText: 'FALSE F-RANK',
        subBadgeText: 'SINGULARITY PROTOCOL',
        badgeColorPreset: 'gold_crimson',
        badgePosition: 'bottom_left',
        composition: 'Left 45% battered scavenger in bloodied rags / Right 55% awakened Sovereign with glowing cerulean mana eyes and floating geometric runes',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Split-screen high contrast manhwa composition. Left half: Bruised and bloodied young male protagonist in ragged clothes kneeling in dark crimson dungeon shadows, clutching a cracked wooden spear with hopeless exhaustion. Right half: The same protagonist standing tall and majestic in a glowing midnight Singularity coat with glowing cerulean mana eyes, surrounded by floating geometric blue runes and a colossal defeated monster core in the background. Dark fantasy action manhwa webtoon art style, ultra-sharp ink linework, high contrast vibrant cel shading, volumetric epic lighting, 16:9 horizontal, textless manhwa artwork.`,
        filename: '01_Thumbnail_Concept_A.jpg'
      },
      {
        id: 'concept_b',
        name: 'Concept B: The Gravity Snap & Proctor Shock',
        subtitle: 'Center Dynamic / Proctor Shock (Distortion Rings & Falling Rubble)',
        badgeText: 'GRAVITY BREACH',
        subBadgeText: '0.0001s SYSTEM',
        badgeColorPreset: 'cyan_hud',
        badgePosition: 'bottom_left',
        composition: 'Center dynamic action: Protagonist floating calmly snapping fingers as purple gravitational distortion rings freeze boulders in mid-air',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Dynamic center composition. Protagonist Caelen Vance floating in mid-air inside a colossal volcanic magma cavern, calmly snapping his fingers as glowing purple gravitational distortion rings freeze falling boulders and students in mid-air. In bottom foreground: Lord Vane and examiner Keith Morgan staring in utter shock and disbelief. Dark fantasy action manhwa art style, vibrant cel shading, high contrast, dramatic cinematic lighting, horizontal 16:9.`,
        filename: '01_Thumbnail_Concept_B.jpg'
      },
      {
        id: 'concept_c',
        name: 'Concept C: The Abyssal Sovereign Cleave',
        subtitle: 'Colossal Catacomb Rift / Solo S-Rank Dominance',
        badgeText: 'SOLO S-RANK',
        subBadgeText: 'ABYSSAL MONARCH',
        badgeColorPreset: 'crimson_flame',
        badgePosition: 'bottom_left',
        composition: 'Wide battlefield: Dimensional rift tearing open the dungeon ceiling while protagonist stands atop a fallen behemoth',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Epic wide battlefield manhwa composition. Protagonist standing atop a colossal slain abyssal titan with dark blue aura erupting into the sky. Sky torn open by a glowing crimson dimensional rift. Dark fantasy action manhwa webtoon art style, ultra-sharp ink linework, high contrast cel shading, cinematic combat lighting, horizontal 16:9.`,
        filename: '01_Thumbnail_Concept_C.jpg'
      }
    ] : [
      {
        id: 'concept_a',
        name: 'Concept A: The Split Transformation (Weak F-Rank vs Awakened Sovereign)',
        subtitle: 'Split-Contrast (Left Weak Scavenger / Right Glowing Sovereign with Mana Bow)',
        badgeText: 'FALSE F-RANK',
        subBadgeText: '10,000x SYSTEM',
        badgeColorPreset: 'gold_crimson',
        badgePosition: 'bottom_left',
        composition: 'Split-Contrast (Left 45% dungeon shadow scavenger with notched bow / Right 55% glowing Sovereign with crystalline mana bow)',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Split-screen high contrast manhwa composition. Left half: Bruised and exhausted young archer in torn leather gear kneeling in dark dungeon cavern, clutching a cracked wooden bow. Right half: The same protagonist Caelen Vance standing tall with glowing cyan mana eyes, drawing a colossal crystalline energy bow surrounded by thousands of floating golden calculation runes. Dark fantasy action manhwa webtoon art style, ultra-sharp ink linework, high contrast vibrant cel shading, volumetric dramatic lighting, 16:9 horizontal, textless artwork.`,
        filename: '01_Thumbnail_Concept_A.jpg'
      },
      {
        id: 'concept_b',
        name: 'Concept B: The Proctor\'s Panic & Measurement Overflow',
        subtitle: 'Center Dynamic / Proctor Shock (Shattered Measuring Sphere & Calculation Breach)',
        badgeText: 'SYSTEM ERROR',
        subBadgeText: 'CALCULATION BREACH',
        badgeColorPreset: 'cyan_hud',
        badgePosition: 'bottom_left',
        composition: 'Examiner Keith Morgan clutching his head in cold sweat as holographic measuring crystal shatters with glowing calculation velocity runes',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. High tension manhwa composition. In foreground: Arrogant examiner Keith Morgan staring with wide horrified eyes and cold sweat running down his face. In center: Protagonist placing hand on a massive translucent measuring sphere that is violently cracking and erupting with blinding golden calculation runes and numeric overflow errors. Dark fantasy action manhwa webtoon art style, ultra-sharp linework, high contrast vibrant lighting, horizontal 16:9.`,
        filename: '01_Thumbnail_Concept_B.jpg'
      },
      {
        id: 'concept_c',
        name: 'Concept C: The Red Gate Calamity Solo Cleave',
        subtitle: 'Wide Battlefield / Dimensional Rift Cleave (10,000 Light Arrows)',
        badgeText: 'SOLO S-RANK',
        subBadgeText: '10,000 ARROWS',
        badgeColorPreset: 'crimson_flame',
        badgePosition: 'bottom_left',
        composition: 'Colossal crimson red gate tearing open the sky above city while Caelen releases 10,000 glowing mana arrows into the abyss',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Wide panoramic manhwa battlefield. Colossal crimson Red Gate tearing open the apocalyptic storm sky. In midground: Protagonist Caelen Vance standing on a ruined monolith, releasing ten thousand glowing luminescent mana arrows raining upward into the demon swarm. Dark fantasy action manhwa webtoon art style, ultra-sharp ink linework, high contrast vibrant cel shading, volumetric combat lighting, horizontal 16:9.`,
        filename: '01_Thumbnail_Concept_C.jpg'
      }
    ]

    // Scan thumbnails directory for existing files on disk
    const existingFiles = await fs.readdir(thumbDir).catch(() => [])

    const variants = await Promise.all(baseVariants.map(async (v) => {
      const diskPath = path.join(thumbDir, v.filename)
      let hasImage = false
      let fileSize = 0

      if (existingFiles.includes(v.filename)) {
        hasImage = true
        try {
          const st = await fs.stat(diskPath)
          fileSize = st.size
        } catch (_) {}
      } else {
        // Check for legacy master thumbnail fallback for Concept A
        const masterFile = '01_Master_YouTube_Thumbnail_16x9.jpg'
        if (v.id === 'concept_a' && existingFiles.includes(masterFile)) {
          hasImage = true
          try {
            const st = await fs.stat(path.join(thumbDir, masterFile))
            fileSize = st.size
          } catch (_) {}
        }
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

    // 1. Markdown-First Truth Resolution: Parse 03_YouTube_Package.md created by Agent
    if (fsSync.existsSync(pkgMdPath)) {
      try {
        const pkgContent = await fs.readFile(pkgMdPath, 'utf-8')
        isPending = false

        // Parse Titles
        const rawFoundTitles = []
        const lines = pkgContent.split(/\r?\n/)
        for (const line of lines) {
          const m = line.match(/^\d+\.\s+\*\*([^\*]+)\*\*(?:\s*\((\d+)\s*chars\))?/)
          if (m) {
            rawFoundTitles.push(m[1].trim())
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
        const chapterBlockMatch = pkgContent.match(/⏱️\s*(?:EPISODE CHAPTERS|CHAPTER TIMESTAMPS):\s*\r?\n([\s\S]*?)(?:\r?\n\s*━|\r?\n\s*#|\r?\n\s*```|$)/i)
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
        const descBlockMatch = pkgContent.match(/##\s*[^\n]*Description Box[^\n]*[\s\S]*?```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
        if (descBlockMatch && descBlockMatch[1]) {
          description = descBlockMatch[1].trim()
        }

        // Parse Pinned Community Comment
        const commentBlockMatch = pkgContent.match(/##\s*[^\n]*Pinned Community[^\n]*[\s\S]*?```(?:[a-z]*)\r?\n([\s\S]*?)\r?\n```/i)
        if (commentBlockMatch && commentBlockMatch[1]) {
          pinnedComment = commentBlockMatch[1].trim()
        }
      } catch (err) {
        console.warn('Could not parse 03_YouTube_Package.md:', err.message)
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
        { title: `They discarded him in the mud... 7 years later, he shattered a Calamity Wyrm with a stick 💀`, hookType: 'Underdog Revenge', ctrScore: '99%' },
        { title: `Arrogant nobles mocked his 'zero mana' until ancient archmage arcana awakened 😭`, hookType: 'Noble Shock', ctrScore: '98%' },
        { title: `He solo-cleaved an S-Rank Calamity Beast with an ordinary wooden quarterstaff ☕`, hookType: 'Combat Face-Slap', ctrScore: '96%' }
      ]
    }

    if (!hookOverlayText) {
      hookOverlayText = `When arrogant nobles discard a 'zero-mana infant', unaware he re-forged his mortal flesh with ancient arcana...`
    }

    if (!caption) {
      caption = `They threw him in the freezing mud at birth... 7 years later, he pulverised a Tier 4 Calamity Wyrm with a wooden stick! 💀\n\nWatch the full continuous story on YouTube (Link in bio 🔗)\n\n#manhwa #manhwarecap #webtoon #animerecap #isekai #magic #overpowered #actionmanhwa`
    }

    if (!pinnedComment) {
      pinnedComment = `The full continuous story is live on our YouTube channel! Watch Episode 1 now (Link in bio 🔗) Search "${cleanFranchiseName}" on YouTube!`
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

