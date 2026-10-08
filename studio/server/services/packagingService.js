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
   * Get calibrated high-CTR thumbnail concepts for a franchise and episode
   */
  static async getThumbnailVariants(franchiseId, episodeId) {
    const thumbDir = this.getThumbnailsDir(franchiseId, episodeId)
    await fs.mkdir(thumbDir, { recursive: true })

    const isSeries01 = franchiseId.includes('Series_01')

    // Concept definitions calibrated for maximum CTR & storytelling contrast
    const baseVariants = isSeries01 ? [
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

    if (base64Data) {
      const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
      inputBuffer = Buffer.from(cleanBase64, 'base64')
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
  static async generatePackage(franchiseId, episodeId) {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    const masterAudioPath = TtsService.getAudioFilePath(franchiseId, episodeId, '01_Episode_Master.mp3')

    let script = ''
    try { script = await fs.readFile(scriptPath, 'utf-8') } catch (e) {}

    let totalDuration = 1920 // default 32m
    if (fsSync.existsSync(masterAudioPath)) {
      totalDuration = await VideoService.getAudioDuration(masterAudioPath)
    }

    // 1. Parse Dynamic Timeline
    const timeline = await VideoService.parseDynamicTimeline(franchiseId, episodeId, totalDuration)

    // 2. Parse Acts and extract clean chapter markers
    const scriptLines = script.split('\n')
    const chapters = []

    // Always start chapter 1 at 00:00 for YouTube compliance
    chapters.push({
      time: '00:00',
      seconds: 0,
      title: 'Prologue: The Double F-Rank Scavenger'
    })

    // Find all acts in script and correlate with timeline beats
    for (let i = 0; i < scriptLines.length; i++) {
      const line = scriptLines[i].trim()
      if (/^#{2,3}\s+(ACT\s+\d+|📦\s+Batch|[A-Z\s]+)/i.test(line) && line.toLowerCase().includes('act')) {
        let actClean = line.replace(/^#{2,3}\s+/, '').replace(/\([^)]*\)/g, '').trim()
        actClean = actClean.replace(/^ACT\s+(\d+[A-Z]?):\s*/i, 'Act $1: ')
        
        // Find next [IMG_XXX] tag in script
        let tagFound = null
        for (let j = i; j < Math.min(i + 20, scriptLines.length); j++) {
          const match = scriptLines[j].match(/\[(IMG_\d+)\]/)
          if (match) {
            tagFound = match[1].toUpperCase()
            break
          }
        }

        if (tagFound) {
          const beat = timeline.find(b => b.tag === tagFound)
          if (beat && beat.startTime > 30) {
            const timeStr = this.formatTimestamp(beat.startTime)
            if (!chapters.some(c => c.time === timeStr)) {
              chapters.push({
                time: timeStr,
                seconds: Math.round(beat.startTime),
                title: actClean
              })
            }
          }
        }
      }
    }

    // Ensure Outro exists at near end
    const outroSec = Math.max(0, totalDuration - 45)
    chapters.push({
      time: this.formatTimestamp(outroSec),
      seconds: Math.round(outroSec),
      title: 'Epilogue & Sovereign Ascendancy'
    })

    const cleanFranchiseName = franchiseId.replace(/^Series_\d+_/, '').replace(/_/g, ' ')
    const cleanEpisodeName = episodeId.replace(/^EP\d+_/, '').replace(/_/g, ' ')

    // 3. Generate High-CTR Title Archetypes (Strict <= 100 Chars Hard Cap)
    const rawTitles = [
      {
        archetype: 'False Rank & Hidden Sovereign',
        title: `Left in the Abyss to Die, the Weakest F-Rank Awakens the World's First Sovereign Protocol`,
        ctrScore: '98%',
        style: 'High curiosity & underdog transformation hook'
      },
      {
        archetype: 'Marathon System (Junkie\'s Manhwa Style)',
        title: `(1-8) Mocked as a Useless F-Rank, He Unlocks a 10,000x Calculation Sovereign System`,
        ctrScore: '96%',
        style: 'Numbered binge-compilation & progression hook'
      },
      {
        archetype: 'Catacombs Betrayal & Solo Dominance',
        title: `Betrayed in an F-Rank Dungeon, He Returns as an Untouchable Abyssal Monarch`,
        ctrScore: '94%',
        style: 'Betrayal, high-stakes revenge & dominance'
      },
      {
        archetype: 'Institutional Anomaly & Proctor Shock',
        title: `The Guild Blacklisted Him as Trash, But His Zero-Mana Slashes Shocked the Academy`,
        ctrScore: '92%',
        style: 'High-IQ tactical proctor shockwave'
      },
      {
        archetype: 'Sovereign Pillar & Empire Genesis',
        title: `Classified as Double F-Rank, His Calculation Speed Made Him the Strongest Pillar`,
        ctrScore: '91%',
        style: 'Epic power scaling & unshakeable status'
      }
    ]

    const titles = rawTitles.map(t => {
      let cleanTitle = t.title.trim()
      if (cleanTitle.length > 100) {
        cleanTitle = cleanTitle.slice(0, 97).trim() + '...'
      }
      return {
        ...t,
        title: cleanTitle,
        charCount: cleanTitle.length,
        isCompliant: cleanTitle.length <= 100
      }
    })

    // 4. Generate Chapter Text for Description
    const chapterText = chapters.map(c => `${c.time} - ${c.title}`).join('\n')

    // 5. Generate Full SEO Description
    const description = `They abandoned the weakest Double F-Rank hunter in the depths of the Imperial Catacombs, unaware that his terminal crisis would trigger the awakening of the legendary Singularity Protocol...

Watch the full story of Caelen Vance as he transcends ordinary human hunter classifications, mastering spatial shears, low-gravity inversions, and unstoppable calculation velocity to become the world's first unshakeable Sovereign Pillar.

🔥 Series: ${cleanFranchiseName}
🎬 Episode: ${cleanEpisodeName}
⏱️ Full Runtime: ${(totalDuration / 60).toFixed(1)} Minutes (Full 1080p 24FPS Cinematic Master)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ CHAPTER TIMESTAMPS:
${chapterText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 COMMUNITY QUESTION:
Would you have spared Lord Vane on that collapsing bridge, or eliminated him right away? Let me know your thoughts in the comments below! 👇

🔔 Subscribe to the channel and turn on notifications so you don't miss Episode 02: The Guild Inquest & Dimensional Incursion!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎵 MUSIC & AUDIO ATTRIBUTION:
All background OST soundscapes and atmospheric scores are licensed royalty-free for creative production:
- Catacombs Sub-Bass Drone (Atmospheric / Suspense)
- Betrayal Melancholic Ambience (A-Minor Harmonic Pad)
- Awakening Power Surge (Open Fifth Sovereign Swell)
- Combat Dungeon Raid (High-Stakes Low Percussion)

⚖️ DISCLAIMER:
This video is an original narrative adaptation and production. All scripts, lore mechanics, visual designs, voiceovers, and motion assemblies were created with original creative transformation under fair use principles.

#manhwarecap #webtoon #sololeveling #animerecap #manhwa #overpoweredmc #actionmanhwa #levelingsystem #recap`

    // 6. Get Multi-Variant Thumbnail Studio concepts
    const thumbnailVariants = await this.getThumbnailVariants(franchiseId, episodeId)

    // 7. Tags string
    const tags = [
      'manhwa recap',
      'webtoon recap',
      'anime recap',
      'solo leveling',
      'manhwa',
      'webtoon',
      'overpowered mc',
      'manhwa with overpowered mc',
      'f rank to god rank',
      'system manhwa',
      'regression manhwa',
      'manhwa recap full',
      'best manhwa recap',
      'action manhwa recap',
      'leveling manhwa',
      'singularity protocol',
      'double f rank',
      'junkies manhwa',
      'manhwa cult',
      'dragon tea'
    ].join(', ')

    // 8. Pinned Comment
    const pinnedComment = `💬 Question for you guys: Would you have spared Lord Vane on that collapsing bridge, or eliminated him right away? Let me know in the comments below! 👇\n\n🔔 Episode 02: The Guild Inquest & Dimensional Incursion is already in production! Make sure to Subscribe and hit the bell icon so you don't miss the next upload!`

    // 9. Master Generated Thumbnail Detection (default to concept_a or first with image)
    const masterVariant = thumbnailVariants.find(v => v.hasImage) || thumbnailVariants[0]
    const masterThumbnail = {
      filename: masterVariant.filename,
      url: masterVariant.url || `/api/episodes/${franchiseId}/${episodeId}/thumbnail/${masterVariant.filename}`,
      badgeText: masterVariant.badgeText,
      subBadgeText: masterVariant.subBadgeText,
      style: masterVariant.subtitle,
      hasImage: masterVariant.hasImage,
      fileSize: masterVariant.fileSize,
      fileSizeFormatted: masterVariant.fileSizeFormatted,
      isYouTubeCompliant: masterVariant.isYouTubeCompliant
    }

    return {
      success: true,
      franchiseId,
      episodeId,
      franchiseName: cleanFranchiseName,
      episodeName: cleanEpisodeName,
      totalDurationSeconds: totalDuration,
      formattedDuration: this.formatTimestamp(totalDuration),
      titles,
      chapters,
      description,
      chapterText,
      thumbnailVariants,
      thumbnailPrompts: thumbnailVariants,
      masterThumbnail,
      tags,
      pinnedComment
    }
  }
}
