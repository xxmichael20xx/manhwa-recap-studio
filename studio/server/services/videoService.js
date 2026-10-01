import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import sharp from 'sharp'
import { ImageService } from './imageService.js'
import { TtsService } from './ttsService.js'
import { ActivityLogService } from './activityLogService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const franchisesDir = path.resolve(projectRoot, '01_Franchises')

export class VideoService {
  static compilationState = {}

  static getVideoDir(franchiseId, episodeId) {
    return path.join(franchisesDir, franchiseId, episodeId, 'video')
  }

  static getMasterVideoPath(franchiseId, episodeId) {
    return path.join(this.getVideoDir(franchiseId, episodeId), '01_Episode_Master_1080p.mp4')
  }

  static getStatus(franchiseId, episodeId) {
    const key = `${franchiseId}/${episodeId}`
    return this.compilationState[key] || {
      status: 'idle',
      progress: 0,
      message: 'Ready to compile',
      log: []
    }
  }

  static updateStatus(franchiseId, episodeId, patch) {
    const key = `${franchiseId}/${episodeId}`
    this.compilationState[key] = {
      ...(this.compilationState[key] || { status: 'idle', progress: 0, log: [] }),
      ...patch
    }
  }

  static async getAudioDuration(audioPath) {
    return new Promise((resolve) => {
      const proc = spawn('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        audioPath
      ])
      let stdout = ''
      proc.stdout.on('data', d => { stdout += d.toString() })
      proc.on('close', () => {
        const sec = parseFloat(stdout.trim())
        if (!isNaN(sec) && sec > 0) {
          resolve(sec)
        } else {
          resolve(30.0)
        }
      })
      proc.on('error', () => resolve(30.0))
    })
  }

  /**
   * Parse SRT file into cue objects with start and end in seconds
   */
  static async parseSrtCues(srtPath) {
    try {
      const content = await fs.readFile(srtPath, 'utf-8')
      const blocks = content.trim().split(/\n\s*\n/)
      const cues = []
      for (const block of blocks) {
        const lines = block.trim().split('\n')
        if (lines.length >= 3) {
          const timeMatch = lines[1].match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/)
          if (timeMatch) {
            const startSec = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000
            const endSec = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000
            const text = lines.slice(2).join(' ').trim()
            cues.push({ startSec, endSec, text })
          }
        }
      }
      return cues
    } catch (e) {
      return []
    }
  }

  /**
   * Monotonically parse script scenes and correlate prompt tags with SRT cues for frame-accurate zero-drift timing
   */
  static async parseDynamicTimeline(franchiseId, episodeId, totalDurationSeconds) {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    const srtPath = path.join(TtsService.getSubtitlesDir(franchiseId, episodeId), '01_Episode_Subtitles.srt')
    const cues = await this.parseSrtCues(srtPath)
    const totalAudioFrames = Math.round(totalDurationSeconds * 30)

    try {
      const scriptContent = await fs.readFile(scriptPath, 'utf-8')
      const normalize = (text) => (text || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim()

      const normalizedCues = cues.map((c, i) => ({
        ...c,
        cueIdx: i,
        normText: normalize(c.text)
      }))

      // Extract all inline tags across the entire script
      const extractedBeats = []
      const inlineRegex = /\[(IMG_\d+)\][`\s]*([^\[\n\r]+)/g
      let m
      let beatCount = 0
      while ((m = inlineRegex.exec(scriptContent)) !== null) {
        beatCount++
        extractedBeats.push({
          tag: m[1].toUpperCase(),
          sceneIndex: Math.ceil(beatCount / 24),
          text: m[2].replace(/`/g, '').trim()
        })
      }

      if (extractedBeats.length > 0) {
        const STOP_WORDS = new Set(['the', 'and', 'for', 'with', 'while', 'this', 'that', 'from', 'into', 'over', 'under', 'upon', 'been', 'were', 'have', 'had', 'has', 'was', 'are', 'his', 'her', 'its', 'their', 'our', 'who', 'whom', 'whose', 'which', 'what', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now'])

        let cueCursor = 0
        const anchors = extractedBeats.map((beat, idx) => {
          const rawWords = normalize(beat.text).split(' ').filter(w => w.length > 0)
          const contentWords = rawWords.filter(w => !STOP_WORDS.has(w) && w.length >= 3)

          let match = null
          let bestScore = 0
          let bestCueIdx = -1

          // Search forward from cueCursor within a localized window of 30 cues
          const maxLookahead = Math.min(normalizedCues.length, cueCursor + 30)

          for (let c = cueCursor; c < maxLookahead; c++) {
            const cueNorm = normalizedCues[c].normText
            const cueWords = cueNorm.split(' ')

            let score = 0
            const p3 = rawWords.slice(0, 3).join(' ')
            const p2 = rawWords.slice(0, 2).join(' ')

            if (p3.length >= 8 && cueNorm.includes(p3)) {
              score += 50
            } else if (p2.length >= 7 && cueNorm.includes(p2) && (!STOP_WORDS.has(rawWords[0]) || !STOP_WORDS.has(rawWords[1]))) {
              score += 30
            }

            // Check content words in sequential order
            let lastPos = -1
            let matchedContentCount = 0
            for (const cw of contentWords.slice(0, 4)) {
              const pos = cueWords.indexOf(cw)
              if (pos > lastPos) {
                matchedContentCount++
                lastPos = pos
              }
            }
            score += matchedContentCount * 10

            if (score > bestScore && score >= 20) {
              bestScore = score
              bestCueIdx = c
            }
          }

          if (bestCueIdx !== -1) {
            match = normalizedCues[bestCueIdx]
            cueCursor = bestCueIdx
          }

          return {
            index: idx,
            sceneIndex: beat.sceneIndex,
            tag: beat.tag,
            startSec: match ? match.startSec : null,
            isAnchor: !!match
          }
        })

        // Force first anchor to 0.0s
        anchors[0].startSec = 0.0
        anchors[0].isAnchor = true

        // Monotonically interpolate timestamps
        let i = 0
        while (i < anchors.length) {
          if (anchors[i].isAnchor) {
            let nextAnchorIdx = -1
            for (let j = i + 1; j < anchors.length; j++) {
              if (anchors[j].isAnchor && anchors[j].startSec > anchors[i].startSec) {
                nextAnchorIdx = j
                break
              }
            }

            if (nextAnchorIdx === -1) {
              const startSec = anchors[i].startSec
              const count = anchors.length - i
              const step = (totalDurationSeconds - startSec) / count
              for (let k = 1; k < count; k++) {
                anchors[i + k].startSec = startSec + k * step
              }
              break
            } else {
              const startSec = anchors[i].startSec
              const endSec = anchors[nextAnchorIdx].startSec
              const span = nextAnchorIdx - i
              const step = (endSec - startSec) / span
              for (let k = 1; k < span; k++) {
                anchors[i + k].startSec = startSec + k * step
              }
              i = nextAnchorIdx
            }
          } else {
            i++
          }
        }

        const timelineBeats = []
        for (let b = 0; b < anchors.length; b++) {
          const startFrame = (b === 0) ? 0 : Math.round(anchors[b].startSec * 30)
          const endFrame = (b === anchors.length - 1) ? totalAudioFrames : Math.round(anchors[b + 1].startSec * 30)
          const frames = Math.max(1, endFrame - startFrame)

          timelineBeats.push({
            beatIndex: b + 1,
            sceneIndex: anchors[b].sceneIndex,
            tag: anchors[b].tag,
            startFrame,
            endFrame,
            frames,
            startTime: startFrame / 30,
            endTime: endFrame / 30,
            duration: frames / 30
          })
        }

        return timelineBeats
      }
    } catch (e) {
      console.warn('Could not parse script paragraphs dynamically, falling back to scene list:', e.message)
    }

    // Fallback: 1 beat per scene in prompt matrix
    const scenes = await ImageService.getPromptMatrixScenes(franchiseId, episodeId)
    const fallbackBeats = []
    const count = scenes.length || 1
    for (let i = 0; i < count; i++) {
      const beatStartFrame = Math.round((i / count) * totalAudioFrames)
      const beatEndFrame = (i === count - 1) ? totalAudioFrames : Math.round(((i + 1) / count) * totalAudioFrames)
      const beatFrames = Math.max(1, beatEndFrame - beatStartFrame)
      fallbackBeats.push({
        beatIndex: i + 1,
        sceneIndex: 1,
        tag: scenes[i]?.tag || `IMG_${String(i + 1).padStart(3, '0')}`,
        startFrame: beatStartFrame,
        endFrame: beatEndFrame,
        frames: beatFrames,
        startTime: beatStartFrame / 30,
        endTime: beatEndFrame / 30,
        duration: beatFrames / 30
      })
    }
    return fallbackBeats
  }

  /**
   * Generates a pristine 4K (3840x2160) canvas composite for an episode scene image.
   * - Background: Full-bleed Cover + 45px Gaussian Blur + Atmospheric Dimming
   * - Foreground: Uncropped aspect-ratio preserved panel with 36px Rounded Corners & Soft Diffuse Drop Shadow
   */
  static async generate4kCanvasComposite(imagePath, outputPath) {
    if (fsSync.existsSync(outputPath)) {
      try {
        const srcStat = await fs.stat(imagePath)
        const outStat = await fs.stat(outputPath)
        if (outStat.mtimeMs >= srcStat.mtimeMs && outStat.size > 1000) {
          return outputPath
        }
      } catch (e) {
        // Regenerate if stat fails
      }
    }

    const meta = await sharp(imagePath).metadata()
    const CANVAS_W = 3840
    const CANVAS_H = 2160

    // 1. Background (Cover + Heavy Gaussian Blur + Dimming)
    const bgBuffer = await sharp(imagePath)
      .resize(CANVAS_W, CANVAS_H, { fit: 'cover', position: 'center' })
      .blur(45)
      .modulate({ brightness: 0.72, saturation: 1.08 })
      .toBuffer()

    // 2. Foreground sizing (fit neatly inside max height 2020px, max width 3500px)
    const fgMaxH = 2020
    const fgMaxW = 3500
    const scale = Math.min(fgMaxW / meta.width, fgMaxH / meta.height)
    const fgW = Math.round(meta.width * scale)
    const fgH = Math.round(meta.height * scale)
    const cornerRadius = 36

    const resizedFg = await sharp(imagePath)
      .resize(fgW, fgH, { kernel: 'lanczos3' })
      .toBuffer()

    // Rounded Corner SVG Mask
    const maskSvg = Buffer.from(
      `<svg width="${fgW}" height="${fgH}"><rect x="0" y="0" width="${fgW}" height="${fgH}" rx="${cornerRadius}" ry="${cornerRadius}" fill="#fff"/></svg>`
    )

    const roundedFg = await sharp(resizedFg)
      .composite([{ input: maskSvg, blend: 'dest-in' }])
      .png()
      .toBuffer()

    // Soft Diffuse Drop Shadow
    const shadowPadding = 70
    const shadowW = fgW + shadowPadding * 2
    const shadowH = fgH + shadowPadding * 2
    const shadowSvg = Buffer.from(
      `<svg width="${shadowW}" height="${shadowH}"><rect x="${shadowPadding}" y="${shadowPadding + 10}" width="${fgW}" height="${fgH}" rx="${cornerRadius}" ry="${cornerRadius}" fill="rgba(0,0,0,0.65)"/></svg>`
    )

    const blurredShadow = await sharp(shadowSvg)
      .blur(28)
      .png()
      .toBuffer()

    // 3. Composite everything onto the 4K canvas
    const posX = Math.round((CANVAS_W - fgW) / 2)
    const posY = Math.round((CANVAS_H - fgH) / 2)

    await sharp(bgBuffer)
      .composite([
        { input: blurredShadow, left: posX - shadowPadding, top: posY - shadowPadding },
        { input: roundedFg, left: posX, top: posY }
      ])
      .jpeg({ quality: 96 })
      .toFile(outputPath)

    return outputPath
  }

  /**
   * Render a single 30fps Ken Burns motion MP4 clip with Lumos trigonometric sine easing.
   * Multi-Focal Slicing Engine: Cycles dynamically through 8 varied cinematic framing modes.
   */
  static async renderKenBurnsClip(compositePath, framesCount, motionIndex, outputPath) {
    const frames = Math.max(15, Math.round(framesCount))
    const PI = '3.14159265'

    const motionPresets = [
      // 0: Subtle Vertical Scan (Top-to-Bottom Gentle Glide with Sine Easing)
      `zoompan=z=1.06:x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*(0.5-0.5*cos(${PI}*on/${frames}))':d=${frames}:s=1920x1080:fps=30`,
      // 1: Subtle Vertical Reveal (Bottom-to-Top Gentle Glide with Sine Easing)
      `zoompan=z=1.06:x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*(1.0-(0.5-0.5*cos(${PI}*on/${frames})))':d=${frames}:s=1920x1080:fps=30`,
      // 2: Gentle Center Push-In (1.02x -> 1.08x Breath Ramp)
      `zoompan=z='1.02+0.06*(0.5-0.5*cos(${PI}*on/${frames}))':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=${frames}:s=1920x1080:fps=30`,
      // 3: Gentle Center Pull-Out (1.08x -> 1.02x Scope Reveal)
      `zoompan=z='1.08-0.06*(0.5-0.5*cos(${PI}*on/${frames}))':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=${frames}:s=1920x1080:fps=30`,
      // 4: Horizontal Slow Drift (Left to Right)
      `zoompan=z=1.05:x='(iw-iw/zoom)*(0.5-0.5*cos(${PI}*on/${frames}))':y='(ih-ih/zoom)/2':d=${frames}:s=1920x1080:fps=30`,
      // 5: Horizontal Slow Drift (Right to Left)
      `zoompan=z=1.05:x='(iw-iw/zoom)*(1.0-(0.5-0.5*cos(${PI}*on/${frames})))':y='(ih-ih/zoom)/2':d=${frames}:s=1920x1080:fps=30`,
      // 6: Upper-Third Focus Push-In (Face & Eyes)
      `zoompan=z='1.03+0.05*(0.5-0.5*cos(${PI}*on/${frames}))':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*0.30':d=${frames}:s=1920x1080:fps=30`,
      // 7: Lower-Third Focus Pull-Out (Action / Ground)
      `zoompan=z='1.07-0.05*(0.5-0.5*cos(${PI}*on/${frames}))':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*0.70':d=${frames}:s=1920x1080:fps=30`
    ]

    const filter = `${motionPresets[motionIndex % motionPresets.length]},format=yuv420p`

    const args = [
      '-y',
      '-loop', '1',
      '-i', compositePath,
      '-vf', filter,
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '20',
      '-r', '30',
      '-frames:v', String(frames),
      outputPath
    ]

    return new Promise((resolve, reject) => {
      const proc = spawn('ffmpeg', args)
      let stderr = ''
      proc.stderr.on('data', d => { stderr += d.toString() })
      proc.on('close', code => {
        if (code === 0) {
          resolve(outputPath)
        } else {
          console.error(`FFmpeg Ken Burns clip error (${compositePath}):`, stderr.slice(-300))
          reject(new Error(`Clip rendering failed for ${path.basename(compositePath)}`))
        }
      })
      proc.on('error', reject)
    })
  }

  static async getVideoFiles(franchiseId, episodeId) {
    const videoDir = this.getVideoDir(franchiseId, episodeId)
    if (!fsSync.existsSync(videoDir)) return []
    try {
      const files = await fs.readdir(videoDir)
      const videoFiles = []
      for (const f of files) {
        if (f.endsWith('.mp4')) {
          const fullPath = path.join(videoDir, f)
          const st = await fs.stat(fullPath)
          const isMaster = f === '01_Episode_Master_1080p.mp4'
          const batchMatch = f.match(/Batch_([A-Za-z0-9_]+)_Preview/)
          videoFiles.push({
            filename: f,
            size: st.size,
            mtime: st.mtime,
            isMaster,
            batchLetter: batchMatch ? batchMatch[1] : null,
            label: isMaster ? 'Master Full Episode (1080p)' : (batchMatch ? `Batch ${batchMatch[1]} Preview` : f),
            url: `/api/episodes/${franchiseId}/${episodeId}/video-stream?file=${f}`
          })
        }
      }
      videoFiles.sort((a, b) => {
        if (a.isMaster) return -1
        if (b.isMaster) return 1
        return a.filename.localeCompare(b.filename)
      })
      return videoFiles
    } catch (e) {
      return []
    }
  }

  static async compileEpisodeVideo(franchiseId, episodeId, options = {}) {
    const { 
      kenBurns = true, 
      burnSubtitles = true, 
      bgmTrack = '01_Catacombs_SubBass_Drone.mp3', 
      bgmVolume = -22,
      batchIndex = null 
    } = options
    const key = `${franchiseId}/${episodeId}`

    if (this.compilationState[key]?.status === 'compiling') {
      throw new Error('Video compilation is already in progress for this episode.')
    }

    const isBatchCompile = batchIndex !== null && batchIndex !== undefined && Number.isInteger(Number(batchIndex)) && Number(batchIndex) >= 0
    const batchIdxNum = isBatchCompile ? Number(batchIndex) : null
    const batchLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
    const batchLetter = isBatchCompile ? (batchLetters[batchIdxNum] || `Batch_${batchIdxNum + 1}`) : null
    const outputFilename = isBatchCompile ? `Batch_${batchLetter}_Preview_1080p.mp4` : '01_Episode_Master_1080p.mp4'

    this.updateStatus(franchiseId, episodeId, {
      status: 'compiling',
      progress: 5,
      message: isBatchCompile 
        ? `Initializing compilation for Batch ${batchLetter}...` 
        : 'Analyzing transcript timeline and subtitle cues...',
      log: [
        isBatchCompile 
          ? `Initializing Modular Batch Compilation Engine for Batch ${batchLetter}...`
          : 'Initializing Dynamic Script-Driven Video Compilation Engine...'
      ]
    })

    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
    const audioDir = TtsService.getAudioDir(franchiseId, episodeId)
    const subtitlesDir = TtsService.getSubtitlesDir(franchiseId, episodeId)
    const videoDir = this.getVideoDir(franchiseId, episodeId)
    const tempClipsDir = path.resolve(projectRoot, '.tmp', `video_clips_${franchiseId}_${episodeId}`)
    const tempCompositesDir = path.resolve(projectRoot, '.tmp', `composites_${franchiseId}_${episodeId}`)

    await fs.mkdir(videoDir, { recursive: true })
    await fs.mkdir(tempClipsDir, { recursive: true })
    await fs.mkdir(tempCompositesDir, { recursive: true })

    const masterVideoPath = this.getMasterVideoPath(franchiseId, episodeId)
    const masterAudioPath = path.join(audioDir, '01_Episode_Master.mp3')
    const srtPath = path.join(subtitlesDir, '01_Episode_Subtitles.srt')

    // 1. Verify master audio exists
    let hasMasterAudio = false
    try {
      const audioStat = await fs.stat(masterAudioPath)
      hasMasterAudio = audioStat.size > 1000
    } catch (e) {
      hasMasterAudio = false
    }

    if (!hasMasterAudio) {
      this.updateStatus(franchiseId, episodeId, {
        status: 'failed',
        message: 'No master voiceover audio found. Please generate Voiceover Audio in Stage 2 first.'
      })
      throw new Error('No voiceover audio found. Generate Voiceover Audio first.')
    }

    const totalDurationSeconds = await this.getAudioDuration(masterAudioPath)
    this.updateStatus(franchiseId, episodeId, {
      progress: 15,
      message: `Parsed audio track (${totalDurationSeconds.toFixed(1)}s). Building dynamic transcript timeline...`,
      log: [
        ...(this.compilationState[key].log || []),
        `Total master narration duration: ${totalDurationSeconds.toFixed(2)}s`
      ]
    })

    // 2. Parse Dynamic Timeline Beats
    const fullTimelineBeats = await this.parseDynamicTimeline(franchiseId, episodeId, totalDurationSeconds)
    
    let targetBeats = fullTimelineBeats
    let batchStartTime = 0
    let batchDuration = totalDurationSeconds

    if (isBatchCompile) {
      const batchSize = 24
      const startIdx = batchIdxNum * batchSize
      const endIdx = Math.min(startIdx + batchSize, fullTimelineBeats.length)
      targetBeats = fullTimelineBeats.slice(startIdx, endIdx)

      if (targetBeats.length === 0) {
        throw new Error(`No scenes found for batch index ${batchIdxNum}.`)
      }

      batchStartTime = targetBeats[0].startTime
      const batchEndTime = targetBeats[targetBeats.length - 1].endTime
      batchDuration = Math.max(0.1, batchEndTime - batchStartTime)
    }

    const targetVideoPath = path.join(videoDir, outputFilename)

    this.updateStatus(franchiseId, episodeId, {
      progress: 25,
      message: isBatchCompile 
        ? `Aligned ${targetBeats.length} panel cuts for Batch ${batchLetter} (${batchDuration.toFixed(1)}s). Synthesizing 30fps Ken Burns clips...`
        : `Aligned ${targetBeats.length} narrative panel beats with SRT cues. Synthesizing 30fps Ken Burns clips...`,
      log: [
        ...(this.compilationState[key].log || []),
        isBatchCompile 
          ? `Batch ${batchLetter}: Processing ${targetBeats.length} cuts from t=${batchStartTime.toFixed(2)}s to t=${(batchStartTime + batchDuration).toFixed(2)}s.`
          : `Dynamic Timeline: Generated ${targetBeats.length} transcript-synchronized panel cuts.`
      ]
    })

    // Get list of existing images on disk
    const existingFiles = fsSync.existsSync(imagesDir) ? await fs.readdir(imagesDir) : []

    // 3. Render Ken Burns clips in managed concurrency (4 at a time)
    const clipFiles = []
    const concurrency = 4
    let completedClips = 0

    for (let i = 0; i < targetBeats.length; i += concurrency) {
      const batch = targetBeats.slice(i, i + concurrency)
      await Promise.all(batch.map(async (beat, batchIdx) => {
        const beatIndex = i + batchIdx
        const globalBeatIdx = isBatchCompile ? (batchIdxNum * 24 + beatIndex) : beatIndex
        const clipPath = path.join(tempClipsDir, `clip_${String(beatIndex).padStart(3, '0')}.mp4`)
        
        // Find best matching image file (IMG_001.jpg, IMG_001.png, IMG001.jpg, IMG001.png)
        const tagVariants = [
          `${beat.tag}.jpg`,
          `${beat.tag}.png`,
          `${beat.tag.replace('_', '')}.jpg`,
          `${beat.tag.replace('_', '')}.png`
        ]
        let imageFilename = tagVariants.find(v => existingFiles.includes(v))
        if (!imageFilename && existingFiles.length > 0) {
          imageFilename = existingFiles[globalBeatIdx % existingFiles.length]
        }
        if (!imageFilename) {
          imageFilename = `${beat.tag}.png`
        }

        let imagePath = path.join(imagesDir, imageFilename)

        if (!fsSync.existsSync(imagePath)) {
          // Fallback to auto-generated storyboard still
          await ImageService.generateStoryboardStills(franchiseId, episodeId)
          imagePath = path.join(imagesDir, `${beat.tag}.png`)
        }

        // Generate 4K Canvas Composite with rounded corners & drop shadow
        const baseName = path.basename(imagePath, path.extname(imagePath))
        const compPath = path.join(tempCompositesDir, `${baseName}_4k.jpg`)
        await VideoService.generate4kCanvasComposite(imagePath, compPath)

        // Render sub-pixel 30fps Ken Burns clip
        await VideoService.renderKenBurnsClip(compPath, beat.frames, kenBurns ? globalBeatIdx : 0, clipPath)

        clipFiles[beatIndex] = clipPath
        completedClips++

        const progressPct = Math.round(25 + (completedClips / targetBeats.length) * 45)
        this.updateStatus(franchiseId, episodeId, {
          progress: progressPct,
          message: isBatchCompile
            ? `Rendered Batch ${batchLetter} clip ${completedClips}/${targetBeats.length} ([${beat.tag}])...`
            : `Rendered ${completedClips} of ${targetBeats.length} 30fps Ken Burns clips ([${beat.tag}])...`,
          log: [
            ...(this.compilationState[key].log || []).slice(-20),
            `Rendered clip ${beatIndex + 1}/${targetBeats.length} [${beat.tag}] (${beat.duration.toFixed(1)}s)`
          ]
        })
      }))
    }

    // 4. Create Concat Demuxer List for all rendered clips
    const concatListPath = path.join(tempClipsDir, 'concat_list.txt')
    const concatLines = clipFiles.map(c => `file '${c.replace(/\\/g, '/')}'`)
    await fs.writeFile(concatListPath, concatLines.join('\n'), 'utf-8')

    this.updateStatus(franchiseId, episodeId, {
      progress: 75,
      message: isBatchCompile
        ? `Muxing Batch ${batchLetter} cut with BGM sidechain ducking & WordBoundary subtitles...`
        : 'Muxing multi-stream master cut with BGM sidechain ducking & WordBoundary subtitles...',
      log: [
        ...(this.compilationState[key].log || []),
        'Stitching dynamic Ken Burns clips and applying audio DSP sidechain ducking...'
      ]
    })

    // 5. Handle Subtitle Slicing for Batch
    let effectiveSrtPath = srtPath
    if (burnSubtitles && isBatchCompile) {
      try {
        const rawCues = await this.parseSrtCues(srtPath)
        const batchCues = rawCues
          .filter(c => c.endSec > batchStartTime && c.startSec < (batchStartTime + batchDuration))
          .map((c, idx) => {
            const newStart = Math.max(0, c.startSec - batchStartTime)
            const newEnd = Math.max(newStart + 0.1, c.endSec - batchStartTime)
            const formatTm = (sec) => {
              const h = String(Math.floor(sec / 3600)).padStart(2, '0')
              const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
              const s = String(Math.floor(sec % 60)).padStart(2, '0')
              const ms = String(Math.floor((sec % 1) * 1000)).padStart(3, '0')
              return `${h}:${m}:${s},${ms}`
            }
            return `${idx + 1}\n${formatTm(newStart)} --> ${formatTm(newEnd)}\n${c.text}`
          })
        const batchSrtPath = path.join(tempClipsDir, `batch_${batchLetter}_subtitles.srt`)
        await fs.writeFile(batchSrtPath, batchCues.join('\n\n'), 'utf-8')
        effectiveSrtPath = batchSrtPath
      } catch (e) {
        console.warn('Could not slice batch subtitles, using full SRT:', e.message)
      }
    }

    // 6. Final Stitch & Subtitle / Audio Muxing
    const safeSrtPath = effectiveSrtPath.replace(/\\/g, '/').replace(/:/g, '\\:')
    const bgmDir = path.resolve(projectRoot, 'assets/audio/bgm')
    let bgmPath = null
    if (bgmTrack && bgmTrack !== 'none') {
      const candidatePath = path.join(bgmDir, bgmTrack)
      if (fsSync.existsSync(candidatePath)) {
        bgmPath = candidatePath
      }
    }

    const safeBgmVol = Number.isFinite(Number(bgmVolume)) ? Number(bgmVolume) : -22
    let subStyle = "force_style='FontSize=20,FontName=Arial,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2.5,Shadow=1.5,Alignment=2,MarginV=42'"
    
    // For batch compile, slice master audio from batchStartTime for batchDuration
    const audioInputArgs = isBatchCompile
      ? ['-ss', String(batchStartTime), '-t', String(batchDuration), '-i', masterAudioPath.replace(/\\/g, '/')]
      : ['-i', masterAudioPath.replace(/\\/g, '/')]

    let ffmpegArgs = []

    if (bgmPath) {
      const filterComplex = [
        burnSubtitles ? `[0:v]subtitles='${safeSrtPath}':${subStyle}[v]` : `[0:v]copy[v]`,
        `[1:a]volume=1.0,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asplit=2[vo_main][vo_sc]`,
        `[2:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${safeBgmVol}dB[bgm_base]`,
        `[bgm_base][vo_sc]sidechaincompress=threshold=0.04:ratio=4:attack=20:release=350[bgm_ducked]`,
        `[vo_main][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=2:normalize=false[aout]`
      ].join(';')

      ffmpegArgs = [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath.replace(/\\/g, '/'),
        ...audioInputArgs,
        '-stream_loop', '-1',
        '-i', bgmPath.replace(/\\/g, '/'),
        '-filter_complex', filterComplex,
        '-map', '[v]',
        '-map', '[aout]',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '22',
        '-r', '30',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        targetVideoPath.replace(/\\/g, '/')
      ]
    } else {
      let vf = burnSubtitles ? `subtitles='${safeSrtPath}':${subStyle}` : null
      ffmpegArgs = [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath.replace(/\\/g, '/'),
        ...audioInputArgs,
        ...(vf ? ['-vf', vf] : []),
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '22',
        '-r', '30',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        targetVideoPath.replace(/\\/g, '/')
      ]
    }

    return new Promise((resolve, reject) => {
      let stderrOutput = ''
      const proc = spawn('ffmpeg', ffmpegArgs)

      proc.stderr.on('data', chunk => {
        stderrOutput += chunk.toString()
      })

      proc.on('close', async code => {
        // Clean up temporary clip and composite directories
        try {
          await fs.rm(tempClipsDir, { recursive: true, force: true })
          await fs.rm(tempCompositesDir, { recursive: true, force: true })
        } catch (e) {}

        if (code === 0) {
          const successMsg = isBatchCompile
            ? `Batch ${batchLetter} Preview (${targetBeats.length} cuts) compiled successfully!`
            : `Master 1080p Video compiled successfully with ${targetBeats.length} synced Ken Burns cuts!`
          this.updateStatus(franchiseId, episodeId, {
            status: 'completed',
            progress: 100,
            message: successMsg,
            log: [
              ...(this.compilationState[key].log || []),
              `${outputFilename} ready with ${targetBeats.length} dynamic synchronized cuts and frame-accurate subtitles.`
            ]
          })
          ActivityLogService.success(
            'video', 
            isBatchCompile ? `Batch ${batchLetter} Preview Compiled` : 'Master 1080p Video Compiled', 
            `Rendered ${outputFilename} with ${targetBeats.length} Ken Burns cuts.`, 
            { cuts: targetBeats.length, isBatchCompile, batchLetter, outputFilename }, 
            franchiseId, 
            episodeId
          )
          resolve({
            success: true,
            videoPath: targetVideoPath,
            filename: outputFilename,
            url: `/api/episodes/${franchiseId}/${episodeId}/video-stream?file=${outputFilename}`
          })
        } else {
          console.error('FFmpeg master muxing failed:', stderrOutput.slice(-1500))
          this.updateStatus(franchiseId, episodeId, {
            status: 'failed',
            message: `FFmpeg muxing exited with code ${code}: ${stderrOutput.slice(-300)}`
          })
          ActivityLogService.error('video', 'Video Compilation Failed', `FFmpeg exited with error code ${code}.`, { error: stderrOutput.slice(-200) }, franchiseId, episodeId)
          reject(new Error(`FFmpeg exited with error code ${code}`))
        }
      })
    })
  }
}
