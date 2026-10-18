import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import sharp from 'sharp'
import { ImageService } from './imageService.js'
import { TtsService } from './ttsService.js'
import { ActivityLogService } from './activityLogService.js'
import { MotionEngine } from './motionEngine.js'

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

  /**
   * Formats an array of batch codes/letters into a clean descriptor string:
   * ['01','02','03', ... '13'] -> "Batches_01-13"
   * ['1','2','3'] -> "Batches_01-03"
   * ['A','B','C'] -> "Batches_A-C"
   */
  static formatBatchRangeDescriptor(batches) {
    if (!batches || batches.length === 0) return 'All'
    
    // Check if numeric or letter-based
    const isNumeric = batches.every(b => /^\d+$/.test(String(b).trim()))
    if (isNumeric) {
      const nums = [...new Set(batches.map(b => parseInt(b, 10)))].sort((a, b) => a - b)
      let isContiguous = true
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[i - 1] + 1) {
          isContiguous = false
          break
        }
      }
      const pad = n => String(n).padStart(2, '0')
      if (isContiguous && nums.length > 1) {
        return `Batches_${pad(nums[0])}-${pad(nums[nums.length - 1])}`
      } else {
        return `Batches_${nums.map(pad).join('_')}`
      }
    }

    const sorted = [...new Set(batches)].sort((a, b) => a.localeCompare(b))
    const charCodes = sorted.map(l => l.charCodeAt(0))

    let isContiguous = true
    for (let i = 1; i < charCodes.length; i++) {
      if (charCodes[i] !== charCodes[i - 1] + 1) {
        isContiguous = false
        break
      }
    }

    if (isContiguous && sorted.length > 1) {
      return `Batches_${sorted[0]}-${sorted[sorted.length - 1]}`
    } else {
      return `Batches_${sorted.join('_')}`
    }
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
   * Probe video duration and container integrity using ffprobe
   * Returns valid positive duration in seconds, or null if corrupt / missing container
   */
  static async getVideoDuration(videoPath) {
    return new Promise((resolve) => {
      if (!fsSync.existsSync(videoPath)) return resolve(null)
      const proc = spawn('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        videoPath
      ])
      let stdout = ''
      proc.stdout.on('data', d => { stdout += d.toString() })
      proc.on('close', (code) => {
        if (code === 0) {
          const sec = parseFloat(stdout.trim())
          if (!isNaN(sec) && sec > 0) return resolve(sec)
        }
        resolve(null)
      })
      proc.on('error', () => resolve(null))
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

      // Extract all inline tags across the entire script (line-anchored to avoid headers/metadata)
      const tagMatches = [...scriptContent.matchAll(/(?:^|\n)\s*\[(IMG_\d+)\]\s*([\s\S]*?)(?=(?:\n\s*\[IMG_\d+\]|$))/gi)]
      const extractedBeats = []
      for (let i = 0; i < tagMatches.length; i++) {
        const tag = tagMatches[i][1].toUpperCase()
        let rawBlock = tagMatches[i][2]
        let cleanText = rawBlock
          .replace(/^#{1,6}\s+[^\n]+/gm, '')
          .replace(/^>\s+[^\n]+/gm, '')
          .replace(/\*\*Runtime:\*\*.*$/gm, '')
          .replace(/\*\*Word Count:\*\*.*$/gm, '')
          .replace(/\*\*Visual Plates:\*\*.*$/gm, '')
          .replace(/---+/g, '')
          .replace(/`/g, '')
          .trim()
        if (cleanText.length > 0) {
          extractedBeats.push({
            tag,
            sceneIndex: Math.ceil((i + 1) / 24),
            text: cleanText
          })
        }
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

            // Single-word cue boost for short dialogue / exclamations (e.g. "Bram!", "Look!")
            if (rawWords.length > 0 && cueNorm === rawWords[0]) {
              score += 35
            }

            // Monotonic proximity bias: penalize cues further from the cursor to prevent distant jumps
            const dist = c - cueCursor
            score -= dist * 1.5
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
   * Render authentic Manhwa Recap Sub-Pixel 24 FPS Cinematic Liquid Glide:
   * - 24 FPS standard cinematic anime cadence (slashes compute overhead by 60%).
   * - In-browser Skia floating-point sub-pixel rasterization with 40px feathered ambient drop shadow.
   * - 100% Constant uniform linear velocity from frame 0 to frame N (zero slow starts, zero speedups, zero dead stalls).
   */
  static async renderFullBleedKenBurnsClip(imagePath, isVertical, framesCount, motionIndex, outputPath) {
    const fps = 24
    const durationSec = Math.max(1.0, framesCount / 30)

    // 1. Primary: Omni-Directional Sub-Pixel GPU Motion Engine (24 FPS Sub-Pixel Interpolation)
    try {
      return await MotionEngine.renderSceneClip({
        imagePath,
        durationSec,
        fps,
        motionIndex,
        outputPath
      })
    } catch (motionErr) {
      console.warn(`MotionEngine attempt 1 failed for ${path.basename(imagePath)}, recycling browser and retrying:`, motionErr.message)
      try {
        await MotionEngine.closeBrowser()
        return await MotionEngine.renderSceneClip({
          imagePath,
          durationSec,
          fps,
          motionIndex,
          outputPath
        })
      } catch (retryErr) {
        console.error(`MotionEngine retry failed for ${path.basename(imagePath)}:`, retryErr.message)
        throw retryErr
      }
    }
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
          const isMaster = f.includes('Master')
          const isOmnibus = f.includes('Omnibus')
          const batchMatch = f.match(/Batch_([A-Za-z0-9_]+)_Preview/i)
          const masterRangeMatch = f.match(/Master_Batches_([A-Za-z0-9_-]+)_1080p/i)
          
          let label = f
          if (masterRangeMatch) {
            label = `🌟 Master: ${masterRangeMatch[1].replace('-', '–').replace(/_/g, ', ')} (1080p)`
          } else if (f === '01_Episode_Master_1080p.mp4') {
            label = '🌟 Master Full Episode (1080p)'
          } else if (isOmnibus) {
            label = `🏆 Grand Omnibus (${f})`
          } else if (batchMatch) {
            label = `🎬 Batch ${batchMatch[1]} Preview (24 Cuts)`
          }

          videoFiles.push({
            filename: f,
            size: st.size,
            mtime: st.mtime,
            isMaster,
            isOmnibus,
            batchLetter: batchMatch ? batchMatch[1] : null,
            batchCode: batchMatch ? batchMatch[1] : null,
            label,
            url: `/api/episodes/${franchiseId}/${episodeId}/video-stream?file=${f}`
          })
        }
      }

      videoFiles.sort((a, b) => {
        if (a.isMaster && !b.isMaster) return -1
        if (!a.isMaster && b.isMaster) return 1
        return b.mtime - a.mtime // Most recent first
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
      batchIndex = null,
      watermark = true,
      watermarkOpacity = 0.20,
      watermarkPosition = 'top_right'
    } = options
    const key = `${franchiseId}/${episodeId}`

    if (this.compilationState[key]?.status === 'compiling' && !options.isInternalSequential && !options.force) {
      throw new Error('Video compilation is already in progress for this episode.')
    }

    const isBatchCompile = batchIndex !== null && batchIndex !== undefined && Number.isInteger(Number(batchIndex)) && Number(batchIndex) >= 0
    const batchIdxNum = isBatchCompile ? Number(batchIndex) : null
    const batchCode = isBatchCompile ? String(batchIdxNum + 1).padStart(2, '0') : null
    const outputFilename = isBatchCompile ? `01_Episode_Batch_${batchCode}_Preview.mp4` : '01_Episode_Master_1080p.mp4'

    this.updateStatus(franchiseId, episodeId, {
      status: 'compiling',
      progress: 5,
      message: isBatchCompile 
        ? `Initializing compilation for Batch ${batchCode}...` 
        : 'Analyzing transcript timeline and subtitle cues...',
      log: [
        isBatchCompile 
          ? `Initializing Modular Batch Compilation Engine for Batch ${batchCode}...`
          : 'Initializing Dynamic Script-Driven Video Compilation Engine...'
      ]
    })


    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
    const audioDir = TtsService.getAudioDir(franchiseId, episodeId)
    const subtitlesDir = TtsService.getSubtitlesDir(franchiseId, episodeId)
    const videoDir = this.getVideoDir(franchiseId, episodeId)
    const batchKey = isBatchCompile ? `batch_${batchCode}` : 'master'
    const sessionNonce = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const tempClipsDir = path.resolve(projectRoot, '.tmp', `video_clips_${franchiseId}_${episodeId}_${batchKey}_${sessionNonce}`)
    const tempCompositesDir = path.resolve(projectRoot, '.tmp', `composites_${franchiseId}_${episodeId}_${batchKey}_${sessionNonce}`)

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
        ? `Aligned ${targetBeats.length} panel cuts for Batch ${batchCode} (${batchDuration.toFixed(1)}s). Synthesizing 24fps Sub-Pixel Skia clips...`
        : `Aligned ${targetBeats.length} narrative panel beats with SRT cues. Synthesizing 24fps Sub-Pixel Skia clips...`,
      log: [
        ...(this.compilationState[key].log || []),
        isBatchCompile 
          ? `Batch ${batchCode}: Processing ${targetBeats.length} cuts from t=${batchStartTime.toFixed(2)}s to t=${(batchStartTime + batchDuration).toFixed(2)}s.`
          : `Dynamic Timeline: Generated ${targetBeats.length} transcript-synchronized panel cuts.`
      ]
    })

    // Get list of existing images on disk
    const existingFiles = fsSync.existsSync(imagesDir) ? await fs.readdir(imagesDir) : []

    // 3. Render Ken Burns clips in managed concurrency (4 parallel native Skia worker threads)
    const clipFiles = []
    const concurrency = 4
    let completedClips = 0

    for (let i = 0; i < targetBeats.length; i += concurrency) {
      const batch = targetBeats.slice(i, i + concurrency)
      const chunkTags = batch.map(b => `[${b.tag}]`).join(', ')

      this.updateStatus(franchiseId, episodeId, {
        message: isBatchCompile
          ? `[Batch ${batchCode}] ⚡ Computing clips ${chunkTags} (4 parallel Skia threads)...`
          : `⚡ Computing clips ${chunkTags} (4 parallel Skia threads)...`,
        log: [
          ...(this.compilationState[key].log || []).slice(-20),
          `⚡ [Workers Active] Rendering chunk ${Math.floor(i / concurrency) + 1}/${Math.ceil(targetBeats.length / concurrency)}: ${chunkTags}`
        ]
      })

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

        // Determine if image is a vertical manhwa strip or landscape panel
        let isVertical = false
        try {
          const meta = await sharp(imagePath).metadata()
          isVertical = (meta.width / meta.height) < 0.95
        } catch (e) {
          isVertical = false
        }

        // Render pristine Full-Bleed Pan & Scan Ken Burns clip with auto-retry
        try {
          await VideoService.renderFullBleedKenBurnsClip(imagePath, isVertical, beat.frames, kenBurns ? globalBeatIdx : 0, clipPath)
        } catch (renderErr) {
          console.warn(`[VideoService] Clip render error for ${beat.tag}, retrying:`, renderErr.message)
          try {
            await VideoService.renderFullBleedKenBurnsClip(imagePath, isVertical, beat.frames, 0, clipPath)
          } catch (retryErr) {
            console.error(`[VideoService] Clip retry failed for ${beat.tag}:`, retryErr.message)
          }
        }

        clipFiles[beatIndex] = clipPath
        completedClips++

        const progressPct = Math.round(25 + (completedClips / targetBeats.length) * 45)
        this.updateStatus(franchiseId, episodeId, {
          progress: progressPct,
          message: isBatchCompile
            ? `[Batch ${batchCode}] Rendered ${completedClips}/${targetBeats.length} clips (Latest: [${beat.tag}])...`
            : `Rendered ${completedClips} of ${targetBeats.length} Sub-Pixel Skia clips ([${beat.tag}])...`,
          log: [
            ...(this.compilationState[key].log || []).slice(-20),
            `✓ Rendered clip ${beatIndex + 1}/${targetBeats.length} [${beat.tag}] (${beat.duration.toFixed(1)}s) [24 FPS]`
          ]
        })
      }))
    }

    // 4. Verify clip integrity and auto-heal any corrupt/missing clips before concat
    const validatedClipFiles = []
    for (let beatIndex = 0; beatIndex < targetBeats.length; beatIndex++) {
      const clipPath = clipFiles[beatIndex]
      let isValid = false
      if (clipPath && fsSync.existsSync(clipPath)) {
        try {
          const st = fsSync.statSync(clipPath)
          if (st.size > 5000) {
            isValid = true
          }
        } catch (_) {}
      }

      if (!isValid) {
        const beat = targetBeats[beatIndex]
        const globalBeatIdx = isBatchCompile ? (batchIdxNum * 24 + beatIndex) : beatIndex
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
          imagePath = path.join(imagesDir, `${beat.tag}.jpg`)
        }

        let isVertical = false
        try {
          const meta = await sharp(imagePath).metadata()
          isVertical = (meta.width / meta.height) < 0.95
        } catch (_) {}

        const reClipPath = path.join(tempClipsDir, `clip_${String(beatIndex).padStart(3, '0')}.mp4`)
        console.warn(`[Auto-Heal] Re-rendering corrupt/missing clip ${beatIndex + 1}/${targetBeats.length} (${beat.tag})...`)
        await VideoService.renderFullBleedKenBurnsClip(imagePath, isVertical, beat.frames, kenBurns ? globalBeatIdx : 0, reClipPath)
        validatedClipFiles.push(reClipPath)
      } else {
        validatedClipFiles.push(clipPath)
      }
    }

    // 5. Create Concat Demuxer List for all validated clips
    const concatListPath = path.join(tempClipsDir, 'concat_list.txt')
    const concatLines = validatedClipFiles.map(c => `file '${c.replace(/\\/g, '/')}'`)
    await fs.writeFile(concatListPath, concatLines.join('\n'), 'utf-8')

    this.updateStatus(franchiseId, episodeId, {
      progress: 75,
      message: isBatchCompile
        ? `Muxing Batch ${batchCode} cut with BGM sidechain ducking & WordBoundary subtitles...`
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
        const batchSrtPath = path.join(tempClipsDir, `batch_${batchCode}_subtitles.srt`)
        await fs.writeFile(batchSrtPath, batchCues.join('\n\n'), 'utf-8')
        effectiveSrtPath = batchSrtPath
      } catch (e) {
        console.warn('Could not slice batch subtitles, using full SRT:', e.message)
      }
    }

    // 6. Final Stitch & Subtitle / Audio Muxing
    const cleanTempSrt = path.join(os.tmpdir(), `sub_${franchiseId}_${episodeId}_${isBatchCompile ? batchCode : 'master'}_${Date.now()}.srt`)
    try {
      await fs.copyFile(effectiveSrtPath, cleanTempSrt)
    } catch (e) {
      console.warn('Could not copy SRT to temp dir:', e.message)
    }
    const safeSrtPath = cleanTempSrt.replace(/\\/g, '/').replace(/:/g, '\\:')
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

    // 6. Watermark Brand Asset Resolution & Placement
    const brandDir = path.resolve(projectRoot, 'assets/brand')
    let watermarkPath = null
    if (watermark) {
      const transparentCandidate = path.join(brandDir, 'recap_runic_logo_transparent.png')
      const defaultCandidate = path.join(brandDir, 'recap_runic_logo.jpg')
      if (fsSync.existsSync(transparentCandidate)) {
        watermarkPath = transparentCandidate
      } else if (fsSync.existsSync(defaultCandidate)) {
        watermarkPath = defaultCandidate
      }
    }

    const safeWatermarkOpacity = Math.max(0.05, Math.min(1.0, Number(watermarkOpacity) || 0.20))
    
    // Detect if current episode is Format 1 (9:16 Webtoon) or Format 2 (16:9 Full Bleed)
    let isVerticalDeck = false
    if (targetBeats.length > 0) {
      const sampleTag = targetBeats[0].tag
      const tagVariants = [
        `${sampleTag}.jpg`,
        `${sampleTag}.png`,
        `${sampleTag.replace('_', '')}.jpg`,
        `${sampleTag.replace('_', '')}.png`
      ]
      let sampleFile = tagVariants.find(v => existingFiles.includes(v))
      if (!sampleFile && existingFiles.length > 0) {
        sampleFile = existingFiles[0]
      }
      if (sampleFile) {
        try {
          const meta = await sharp(path.join(imagesDir, sampleFile)).metadata()
          isVerticalDeck = (meta.width / meta.height) < 0.95
        } catch (_) {}
      }
    }

    // Format-Aware Watermark Scale & Positioning
    const watermarkScale = isVerticalDeck ? 200 : 240
    let overlayExpr = 'W-w-36:36' // Default: 16:9 Top-Right

    if (isVerticalDeck) {
      // Format 1: 9:16 Webtoon (680px center strip between X=620 and X=1300)
      const stripW = 680
      const stripLeft = `(W-${stripW})/2`
      const stripRight = `(W+${stripW})/2`
      if (watermarkPosition === 'top_left') {
        overlayExpr = `${stripLeft}+20:36`
      } else if (watermarkPosition === 'bottom_right') {
        overlayExpr = `${stripRight}-w-20:H-h-36`
      } else if (watermarkPosition === 'bottom_left') {
        overlayExpr = `${stripLeft}+20:H-h-36`
      } else if (watermarkPosition === 'custom_user') {
        overlayExpr = `${stripLeft}+${stripW}*0.65-w/2:H*0.75-h/2`
      } else if (watermarkPosition === 'center') {
        overlayExpr = '(W-w)/2:(H-h)/2'
      } else {
        // Default top_right anchored to 9:16 strip
        overlayExpr = `${stripRight}-w-20:36`
      }
    } else {
      // Format 2: 16:9 Full-Bleed Landscape
      if (watermarkPosition === 'top_left') {
        overlayExpr = '36:36'
      } else if (watermarkPosition === 'bottom_right') {
        overlayExpr = 'W-w-36:H-h-36'
      } else if (watermarkPosition === 'bottom_left') {
        overlayExpr = '36:H-h-36'
      } else if (watermarkPosition === 'custom_user') {
        overlayExpr = 'W*0.65-w/2:H*0.75-h/2'
      } else if (watermarkPosition === 'center') {
        overlayExpr = '(W-w)/2:(H-h)/2'
      }
    }

    // Determine input indices
    let nextInputIdx = 2
    let bgmInputIdx = null
    if (bgmPath) {
      bgmInputIdx = nextInputIdx++
    }

    let watermarkInputIdx = null
    if (watermarkPath) {
      watermarkInputIdx = nextInputIdx++
    }

    const filterComplexParts = []

    // Video Filter Chain: Subtitles -> Watermark Overlay -> Output [v]
    if (burnSubtitles) {
      if (watermarkPath) {
        filterComplexParts.push(`[0:v]subtitles='${safeSrtPath}':${subStyle}[v_sub]`)
        filterComplexParts.push(`[${watermarkInputIdx}:v]scale=${watermarkScale}:-1,format=rgba,colorchannelmixer=aa=${safeWatermarkOpacity}[wm_faded]`)
        filterComplexParts.push(`[v_sub][wm_faded]overlay=${overlayExpr}:format=auto[v]`)
      } else {
        filterComplexParts.push(`[0:v]subtitles='${safeSrtPath}':${subStyle}[v]`)
      }
    } else {
      if (watermarkPath) {
        filterComplexParts.push(`[0:v]null[v_sub]`)
        filterComplexParts.push(`[${watermarkInputIdx}:v]scale=${watermarkScale}:-1,format=rgba,colorchannelmixer=aa=${safeWatermarkOpacity}[wm_faded]`)
        filterComplexParts.push(`[v_sub][wm_faded]overlay=${overlayExpr}:format=auto[v]`)
      } else {
        filterComplexParts.push(`[0:v]null[v]`)
      }
    }

    // Audio Filter Chain: Narration + (Optional BGM with Calibrated Dynamic Sidechain Ducking) -> Output [aout]
    if (bgmPath) {
      // Royalty-free ambient BGM tracks are pre-mastered at -33 dB mean volume.
      // Calibrate so default -22 dB volume provides a clean -20 dB resting bed (+11 dB gain offset)
      const calibratedGain = safeBgmVol + 33
      const gainStr = calibratedGain >= 0 ? `+${calibratedGain}` : `${calibratedGain}`

      filterComplexParts.push(`[1:a]volume=1.0,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asplit=2[vo_main][vo_sc]`)
      filterComplexParts.push(`[${bgmInputIdx}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${gainStr}dB[bgm_base]`)
      filterComplexParts.push(`[bgm_base][vo_sc]sidechaincompress=threshold=0.08:ratio=2.5:attack=15:release=320:link=average[bgm_ducked]`)
      filterComplexParts.push(`[vo_main][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=2:normalize=false[aout]`)
    } else {
      filterComplexParts.push(`[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[aout]`)
    }

    const filterComplex = filterComplexParts.join(';')

    const ffmpegArgs = [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', concatListPath.replace(/\\/g, '/'),
      ...audioInputArgs
    ]

    if (bgmPath) {
      ffmpegArgs.push('-stream_loop', '-1', '-i', bgmPath.replace(/\\/g, '/'))
    }

    if (watermarkPath) {
      ffmpegArgs.push('-loop', '1', '-i', watermarkPath.replace(/\\/g, '/'))
    }

    ffmpegArgs.push(
      '-filter_complex', filterComplex,
      '-map', '[v]',
      '-map', '[aout]',
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '20',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-r', '24',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-shortest',
      targetVideoPath.replace(/\\/g, '/')
    )

    return new Promise((resolve, reject) => {
      let stderrOutput = ''
      const proc = spawn('ffmpeg', ffmpegArgs, { cwd: projectRoot })

      proc.stderr.on('data', chunk => {
        stderrOutput += chunk.toString()
      })

      proc.on('close', async code => {
        // Clean up temporary clip and composite directories, and browser instance
        try {
          await fs.rm(tempClipsDir, { recursive: true, force: true })
          await fs.rm(tempCompositesDir, { recursive: true, force: true })
          await fs.unlink(cleanTempSrt)
        } catch (e) {}
        try {
          await MotionEngine.closeBrowser()
        } catch (e) {}

        if (code === 0) {
          const successMsg = isBatchCompile
            ? `Batch ${batchCode} Preview (${targetBeats.length} cuts) compiled successfully!`
            : `Master 1080p Video compiled successfully with ${targetBeats.length} synced Ken Burns cuts!`
          
          if (!options.isInternalSequential) {
            this.updateStatus(franchiseId, episodeId, {
              status: 'completed',
              progress: 100,
              message: successMsg,
              log: [
                ...(this.compilationState[key].log || []),
                `${outputFilename} ready with ${targetBeats.length} dynamic synchronized cuts and frame-accurate subtitles.`
              ]
            })
          } else {
            this.updateStatus(franchiseId, episodeId, {
              status: 'compiling',
              log: [
                ...(this.compilationState[key].log || []),
                `✓ ${outputFilename} synthesized with ${targetBeats.length} cuts.`
              ]
            })
          }

          ActivityLogService.success(
            'video', 
            isBatchCompile ? `Batch ${batchCode} Preview Compiled` : 'Master 1080p Video Compiled', 
            `Rendered ${outputFilename} with ${targetBeats.length} Ken Burns cuts.`, 
            { cuts: targetBeats.length, isBatchCompile, batchCode, outputFilename }, 
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

  /**
   * Lossless Instant Master Stitcher (-c copy in <3s):
   * Concat all available compiled batch preview MP4s into 01_Episode_Master_1080p.mp4
   */
  static async stitchBatches(franchiseId, episodeId, options = {}) {
    const key = `${franchiseId}/${episodeId}`
    const videoDir = this.getVideoDir(franchiseId, episodeId)
    if (!fsSync.existsSync(videoDir)) {
      throw new Error('Video directory does not exist.')
    }

    const { targetLetters = null } = options
    const files = await fs.readdir(videoDir)

    const normalizeBatchNum = (str) => {
      if (/^\d+$/.test(str)) return parseInt(str, 10)
      if (/^[A-Za-z]$/.test(str)) return str.toUpperCase().charCodeAt(0) - 64
      return null
    }

    const batchMap = new Map()
    for (const f of files) {
      if (f.endsWith('.mp4')) {
        const match = f.match(/(?:01_Episode_Batch_|Batch_)([A-Za-z0-9_]+)_Preview/i)
        if (match) {
          const rawId = match[1]
          const num = normalizeBatchNum(rawId)
          if (num !== null) {
            const isNumeric = /^\d+$/.test(rawId)
            const code = String(num).padStart(2, '0')
            if (!batchMap.has(num) || (isNumeric && !batchMap.get(num).isNumeric)) {
              batchMap.set(num, {
                filename: f,
                fullPath: path.join(videoDir, f),
                code,
                batchNum: num,
                isNumeric
              })
            }
          }
        }
      }
    }

    let batchFiles = Array.from(batchMap.values()).sort((a, b) => a.batchNum - b.batchNum)
    if (targetLetters && targetLetters.length > 0) {
      const allowedNums = targetLetters.map(normalizeBatchNum).filter(n => n !== null)
      batchFiles = batchFiles.filter(b => allowedNums.includes(b.batchNum))
    }

    // Validate video container integrity for every candidate batch file
    const validatedBatchFiles = []
    for (const b of batchFiles) {
      const dur = await this.getVideoDuration(b.fullPath)
      if (dur && dur > 0) {
        validatedBatchFiles.push({ ...b, duration: dur })
      } else {
        console.warn(`[stitchBatches] Corrupt or unplayable preview video detected for Batch ${b.code} (${b.filename}). Excluding from stitch.`)
      }
    }
    batchFiles = validatedBatchFiles

    if (batchFiles.length === 0) {
      this.updateStatus(franchiseId, episodeId, {
        status: 'failed',
        message: 'No compiled batch preview videos found to stitch.'
      })
      throw new Error('No compiled batch preview videos found in video/ folder.')
    }

    const tempDir = path.resolve(projectRoot, '.tmp')
    await fs.mkdir(tempDir, { recursive: true })
    const concatListPath = path.join(tempDir, `concat_batches_${franchiseId}_${episodeId}_${Date.now()}.txt`)
    const concatLines = batchFiles.map(b => `file '${b.fullPath.replace(/\\/g, '/')}'`)
    await fs.writeFile(concatListPath, concatLines.join('\n'), 'utf-8')

    const descriptor = this.formatBatchRangeDescriptor(batchFiles.map(b => b.code))
    const masterOutputFilename = `01_Episode_Master_${descriptor}_1080p.mp4`
    const masterOutputPath = path.join(videoDir, masterOutputFilename)
    const standardMasterPath = path.join(videoDir, '01_Episode_Master_1080p.mp4')

    const ffmpegArgs = [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', concatListPath.replace(/\\/g, '/'),
      '-c', 'copy',
      '-movflags', '+faststart',
      masterOutputPath.replace(/\\/g, '/')
    ]

    this.updateStatus(franchiseId, episodeId, {
      status: 'compiling',
      progress: 96,
      message: `Losslessly stitching ${batchFiles.length} batches (${descriptor}) into Master 1080p video...`,
      log: [
        ...(this.compilationState[key]?.log || []),
        `Stitching ${batchFiles.length} batches: ${batchFiles.map(b => 'Batch ' + b.code).join(', ')} -> ${masterOutputFilename}...`
      ]
    })

    return new Promise((resolve, reject) => {
      let stderr = ''
      const proc = spawn('ffmpeg', ffmpegArgs, { cwd: projectRoot })
      proc.stderr.on('data', chunk => { stderr += chunk.toString() })

      proc.on('close', async code => {
        try { await fs.unlink(concatListPath) } catch (_) {}

        if (code === 0) {
          let isFullEpisodeStitch = false
          try {
            // Only overwrite the standard full-episode master if ALL batches were stitched
            const scenes = await ImageService.getPromptMatrixScenes(franchiseId, episodeId)
            const totalBatches = Math.ceil((scenes?.length || 24) / 24)
            isFullEpisodeStitch = (!targetLetters || targetLetters.length === 0) && batchFiles.length >= totalBatches

            if (isFullEpisodeStitch) {
              await fs.copyFile(masterOutputPath, standardMasterPath)
            }
          } catch (_) {}

          const successMsg = `Master Video (${descriptor}) stitched successfully from ${batchFiles.length} batches (${batchFiles.map(b => 'Batch ' + b.code).join(', ')}) in <2 seconds!`
          this.updateStatus(franchiseId, episodeId, {
            status: 'completed',
            progress: 100,
            message: successMsg,
            filename: isFullEpisodeStitch ? '01_Episode_Master_1080p.mp4' : masterOutputFilename,
            log: [
              ...(this.compilationState[key]?.log || []),
              `⚡ Master assembly complete: ${masterOutputFilename} losslessly joined from ${batchFiles.length} batches.`
            ]
          })
          ActivityLogService.success(
            'video',
            'Master Video Stitched',
            `Losslessly assembled ${masterOutputFilename} from ${batchFiles.length} batches.`,
            { batchCount: batchFiles.length, batches: batchFiles.map(b => b.code || b.letter), filename: masterOutputFilename },
            franchiseId,
            episodeId
          )
          resolve({
            success: true,
            videoPath: masterOutputPath,
            filename: isFullEpisodeStitch ? '01_Episode_Master_1080p.mp4' : masterOutputFilename,
            outputFilename: masterOutputFilename,
            descriptor,
            url: `/api/episodes/${franchiseId}/${episodeId}/video-stream?file=${masterOutputFilename}`,
            batchCount: batchFiles.length,
            isFullEpisodeStitch
          })
        } else {
          console.error('FFmpeg batch stitching failed:', stderr.slice(-800))
          this.updateStatus(franchiseId, episodeId, {
            status: 'failed',
            message: `FFmpeg batch stitching exited with code ${code}: ${stderr.slice(-200)}`
          })
          reject(new Error(`FFmpeg stitch exited with code ${code}`))
        }
      })
    })
  }

  /**
   * Selective Grouped Batch Queue Compilation:
   * Compiles user-selected batch indices (e.g. [2, 5, 8]) in sequence and optionally stitches them.
   */
  static async compileGroupedBatches(franchiseId, episodeId, options = {}) {
    const key = `${franchiseId}/${episodeId}`
    const { batchIndices = [], autoStitch = true, force = true } = options

    if (this.compilationState[key]?.status === 'compiling' && !force) {
      throw new Error('Video compilation is already in progress for this episode.')
    }

    if (!Array.isArray(batchIndices) || batchIndices.length === 0) {
      throw new Error('No batches selected for compilation.')
    }

    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
    const selectedCodes = batchIndices.map(i => String(i + 1).padStart(2, '0'))
    const selectedLetters = batchIndices.map(i => letters[i] || `Batch_${i + 1}`)

    this.updateStatus(franchiseId, episodeId, {
      status: 'compiling',
      progress: 5,
      message: `Starting Grouped Batch Queue for ${batchIndices.length} batches (${selectedCodes.map(c => 'Batch ' + c).join(', ')})...`,
      log: [
        `Initializing Grouped Batch Queue for: ${selectedCodes.map(c => 'Batch ' + c).join(', ')}...`
      ]
    })

    try {
      for (let i = 0; i < batchIndices.length; i++) {
        const bIdx = batchIndices[i]
        const batchCode = String(bIdx + 1).padStart(2, '0')
        const letter = letters[bIdx] || `Batch_${bIdx + 1}`
        const progressPct = Math.round(5 + (i / batchIndices.length) * 85)

        this.updateStatus(franchiseId, episodeId, {
          status: 'compiling',
          progress: progressPct,
          message: `[Batch ${batchCode}] Synthesizing 24 scene cuts (${i + 1} of ${batchIndices.length} grouped batches)...`,
          log: [
            ...(this.compilationState[key]?.log || []),
            `▶ Starting Grouped Batch ${batchCode} (${i + 1}/${batchIndices.length})...`
          ]
        })

        await this.compileEpisodeVideo(franchiseId, episodeId, {
          ...options,
          batchIndex: bIdx,
          isInternalSequential: true,
          force: true
        })
      }

      if (autoStitch) {
        this.updateStatus(franchiseId, episodeId, {
          status: 'compiling',
          progress: 95,
          message: `Stitching ${selectedLetters.length} grouped batches into Master Video...`,
          log: [
            ...(this.compilationState[key]?.log || []),
            `Grouped compilation complete. Losslessly stitching batches: ${selectedLetters.join(', ')}...`
          ]
        })
        return await this.stitchBatches(franchiseId, episodeId, {
          ...options,
          targetLetters: selectedLetters
        })
      }

      this.updateStatus(franchiseId, episodeId, {
        status: 'completed',
        progress: 100,
        message: `Successfully compiled ${batchIndices.length} batches (${selectedLetters.join(', ')})!`,
        log: [
          ...(this.compilationState[key]?.log || []),
          `✓ Grouped batch compilation finished for: ${selectedLetters.join(', ')}.`
        ]
      })

      return {
        success: true,
        batches: selectedLetters,
        count: batchIndices.length
      }
    } catch (err) {
      console.error('Grouped batch pipeline error:', err)
      this.updateStatus(franchiseId, episodeId, {
        status: 'failed',
        message: `Grouped batch pipeline failed: ${err.message}`
      })
      throw err
    }
  }

  /**
   * Multi-Master & Cross-Episode Lossless Omnibus Stitcher (-c copy in <5s):
   * Concat multiple Master Videos (e.g. EP01 Master + EP02 Master) into a Grand Omnibus.
   */
  static async stitchMasterOmnibus(franchiseId, masterFilePaths, outputFilename) {
    if (!Array.isArray(masterFilePaths) || masterFilePaths.length < 2) {
      throw new Error('At least 2 master video files are required to stitch an Omnibus.')
    }

    const franchiseDir = path.join(franchisesDir, franchiseId)

    // Defensively resolve each master file path across episodes
    const alternatives = [
      '01_Episode_Master_1080p.mp4',
      '01_Episode_Master.mp4',
      '01_Episode_Master_Batches_01-09_1080p.mp4'
    ]

    const resolvedFiles = []
    for (const rawPath of masterFilePaths) {
      let candidate = path.isAbsolute(rawPath) ? rawPath : path.resolve(projectRoot, rawPath)

      if (fsSync.existsSync(candidate)) {
        resolvedFiles.push(candidate)
        continue
      }

      // Check alternate known master naming conventions in candidate directory
      const dir = path.dirname(candidate)
      let found = false
      for (const alt of alternatives) {
        const altPath = path.join(dir, alt)
        if (fsSync.existsSync(altPath)) {
          resolvedFiles.push(altPath)
          found = true
          break
        }
      }

      // If still not found, check if rawPath was an episode folder/ID
      if (!found) {
        const epVideoDir = path.join(franchiseDir, rawPath, 'video')
        for (const alt of alternatives) {
          const altPath = path.join(epVideoDir, alt)
          if (fsSync.existsSync(altPath)) {
            resolvedFiles.push(altPath)
            found = true
            break
          }
        }
      }

      if (!found) {
        throw new Error(`Master video file not found for: ${rawPath}. Ensure the episode has been compiled first.`)
      }
    }

    const tempDir = path.resolve(projectRoot, '.tmp')
    await fs.mkdir(tempDir, { recursive: true })
    const concatListPath = path.join(tempDir, `concat_omnibus_${franchiseId}_${Date.now()}.txt`)
    const concatLines = resolvedFiles.map(p => `file '${p.replace(/\\/g, '/')}'`)
    await fs.writeFile(concatListPath, concatLines.join('\n'), 'utf-8')

    let outName = outputFilename
    if (!outName) {
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
      outName = `00_Omnibus_${ts}_1080p.mp4`
    }
    const omnibusDir = path.join(franchiseDir, 'omnibus')
    await fs.mkdir(omnibusDir, { recursive: true })
    
    // Guard against collision by appending timestamp if file already exists
    if (fsSync.existsSync(path.join(omnibusDir, outName))) {
      const ext = path.extname(outName)
      const base = path.basename(outName, ext)
      outName = `${base}_${Date.now()}${ext}`
    }
    const omnibusOutputPath = path.join(omnibusDir, outName)

    const ffmpegArgs = [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', concatListPath.replace(/\\/g, '/'),
      '-c', 'copy',
      '-movflags', '+faststart',
      omnibusOutputPath.replace(/\\/g, '/')
    ]

    return new Promise((resolve, reject) => {
      let stderr = ''
      const proc = spawn('ffmpeg', ffmpegArgs, { cwd: projectRoot })
      proc.stderr.on('data', chunk => { stderr += chunk.toString() })

      proc.on('close', async code => {
        try { await fs.unlink(concatListPath) } catch (_) {}

        if (code === 0) {
          // Calculate 100% mathematically exact cumulative chapter timestamps via ffprobe
          const metadata = await VideoService.calculateOmnibusMetadataFromPaths(franchiseId, resolvedFiles, outName)

          const metaPath = path.join(omnibusDir, `${path.basename(outName, '.mp4')}_metadata.json`)
          await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2), 'utf-8').catch(() => {})

          ActivityLogService.success(
            'video',
            'Omnibus Video Stitched',
            `Losslessly assembled ${outName} from ${resolvedFiles.length} master videos. Cumulative duration: ${metadata.totalDurationFormatted}.`,
            { fileCount: resolvedFiles.length, outputFilename: outName, outputPath: omnibusOutputPath, metadata },
            franchiseId,
            'omnibus'
          )
          resolve({
            success: true,
            output: omnibusOutputPath,
            videoPath: omnibusOutputPath,
            filename: outName,
            url: `/api/episodes/${franchiseId}/omnibus-stream?file=${encodeURIComponent(outName)}`,
            masterCount: resolvedFiles.length,
            metadata
          })
        } else {
          console.error('FFmpeg omnibus stitching failed:', stderr.slice(-800))
          reject(new Error(`FFmpeg omnibus stitch exited with code ${code}: ${stderr.slice(-200)}`))
        }
      })
    })
  }

  static formatDuration(sec) {
    const s = Math.max(0, Math.round(sec))
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const remainderSec = s % 60
    const pad = n => String(n).padStart(2, '0')
    if (h > 0) return `${h}h ${pad(m)}m ${pad(remainderSec)}s`
    return `${m}m ${pad(remainderSec)}s`
  }

  static enrichOmnibusMetadata(meta) {
    if (!meta || !Array.isArray(meta.chapters) || meta.chapters.length === 0) {
      return meta
    }
    const formatTs = (sec) => {
      const s = Math.max(0, Math.floor(sec))
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const remainderSec = s % 60
      const pad = n => String(n).padStart(2, '0')
      if (h > 0) return `${h}:${pad(m)}:${pad(remainderSec)}`
      return `${pad(m)}:${pad(remainderSec)}`
    }

    let accumulated = 0
    const enrichedChapters = meta.chapters.map((c, idx) => {
      const dur = c.durationSeconds || 0
      const startSec = c.startSeconds !== undefined ? c.startSeconds : accumulated
      const endSec = startSec + dur
      accumulated = endSec
      const startFmt = formatTs(startSec)
      const endFmt = formatTs(endSec)
      const durFmt = VideoService.formatDuration(dur)
      return {
        ...c,
        partNumber: c.partNumber || (idx + 1),
        partLabel: c.partLabel || `Part ${idx + 1}`,
        startSeconds: startSec,
        endSeconds: endSec,
        startTimestampFormatted: startFmt,
        endTimestampFormatted: endFmt,
        durationFormatted: durFmt,
        summaryLine: `• Episode ${idx + 1} (${durFmt}): ${startFmt} - ${endFmt}`
      }
    })

    const totalSec = meta.totalDurationSeconds || accumulated
    const totalFmt = VideoService.formatDuration(totalSec)
    const finalTimestamp = formatTs(totalSec)

    const breakdownLines = enrichedChapters.map(c => c.summaryLine)
    const chapterLines = enrichedChapters.map(c => `${c.startTimestampFormatted} Episode ${c.partNumber}: ${c.episodeTitle}`)
    chapterLines.push(`${finalTimestamp} Series Finale & Epilogue (Full Story Complete)`)

    return {
      ...meta,
      totalDurationSeconds: totalSec,
      totalDurationFormatted: totalFmt,
      finalTimestampFormatted: finalTimestamp,
      chapters: enrichedChapters,
      cumulativeBreakdownString: breakdownLines.join('\n'),
      youtubeChapterString: chapterLines.join('\n')
    }
  }

  static async calculateOmnibusMetadataFromPaths(franchiseId, masterFilePaths, outName = '') {
    const chapterLedger = []
    let accumulatedSeconds = 0

    const formatTs = (sec) => {
      const s = Math.max(0, Math.floor(sec))
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const remainderSec = s % 60
      const pad = n => String(n).padStart(2, '0')
      if (h > 0) return `${h}:${pad(m)}:${pad(remainderSec)}`
      return `${pad(m)}:${pad(remainderSec)}`
    }

    for (let i = 0; i < masterFilePaths.length; i++) {
      const rawPath = masterFilePaths[i]
      const fullPath = path.isAbsolute(rawPath) ? rawPath : path.resolve(projectRoot, rawPath)
      const dur = await VideoService.getVideoDuration(fullPath) || 0
      const epDirName = path.basename(path.dirname(path.dirname(fullPath)))
      const epLabel = epDirName.replace(/^EP\d+_+/i, '').replace(/_/g, ' ') || `Episode ${i + 1}`

      const startSec = accumulatedSeconds
      const endSec = accumulatedSeconds + dur
      const startFmt = formatTs(startSec)
      const endFmt = formatTs(endSec)
      const durFmt = VideoService.formatDuration(dur)

      chapterLedger.push({
        partNumber: i + 1,
        partLabel: `Episode ${i + 1}`,
        episodeId: epDirName,
        episodeTitle: epLabel,
        startTimestampFormatted: startFmt,
        endTimestampFormatted: endFmt,
        startSeconds: startSec,
        endSeconds: endSec,
        durationSeconds: dur,
        durationFormatted: durFmt,
        summaryLine: `• Episode ${i + 1} (${durFmt}): ${startFmt} - ${endFmt}`,
        filePath: fullPath
      })
      accumulatedSeconds += dur
    }

    const totalDurationFormatted = VideoService.formatDuration(accumulatedSeconds)
    const finalTimestampFormatted = formatTs(accumulatedSeconds)

    return {
      franchiseId,
      filename: outName,
      totalDurationSeconds: accumulatedSeconds,
      totalDurationFormatted,
      finalTimestampFormatted,
      partCount: masterFilePaths.length,
      partBadgeText: `1 - ${masterFilePaths.length}`,
      chapters: chapterLedger,
      cumulativeBreakdownString: chapterLedger.map(c => c.summaryLine).join('\n'),
      youtubeChapterString: [
        ...chapterLedger.map(c => `${c.startTimestampFormatted} Episode ${c.partNumber}: ${c.episodeTitle}`),
        `${finalTimestampFormatted} Series Finale & Epilogue (Full Story Complete)`
      ].join('\n'),
      generatedAt: new Date().toISOString()
    }
  }

  /**
   * Probe and compute exact cumulative timestamps and chapter metadata for a set of master videos
   */
  static async getOmnibusMetadata(franchiseId, masterFilePaths = []) {
    const franchiseDir = path.join(franchisesDir, franchiseId)
    const omnibusDir = path.join(franchiseDir, 'omnibus')
    
    // Scan existing omnibus metadata files if no specific master files passed
    if (!masterFilePaths || masterFilePaths.length === 0) {
      if (fsSync.existsSync(omnibusDir)) {
        const metaFiles = fsSync.readdirSync(omnibusDir).filter(f => f.endsWith('_metadata.json'))
        if (metaFiles.length > 0) {
          const parsedMetas = []
          for (const f of metaFiles) {
            try {
              const content = JSON.parse(await fs.readFile(path.join(omnibusDir, f), 'utf-8'))
              const stat = fsSync.statSync(path.join(omnibusDir, f))
              parsedMetas.push({ meta: content, mtime: stat.mtimeMs, partCount: content.partCount || 0 })
            } catch (_) {}
          }
          if (parsedMetas.length > 0) {
            parsedMetas.sort((a, b) => {
              if (b.partCount !== a.partCount) return b.partCount - a.partCount
              return b.mtime - a.mtime
            })
            return this.enrichOmnibusMetadata(parsedMetas[0].meta)
          }
        }
      }

      // Auto-discover compiled episodes in franchise if no metadata file found
      try {
        if (fsSync.existsSync(franchiseDir)) {
          const entries = await fs.readdir(franchiseDir, { withFileTypes: true })
          const epDirs = entries
            .filter(e => e.isDirectory() && /^EP\d+/i.test(e.name))
            .map(e => e.name)
            .sort()

          const discoveredMasterPaths = []
          for (const epDir of epDirs) {
            const masterPath = path.join(franchiseDir, epDir, 'video', '01_Episode_Master_1080p.mp4')
            if (fsSync.existsSync(masterPath)) {
              discoveredMasterPaths.push(masterPath)
            }
          }

          if (discoveredMasterPaths.length > 0) {
            return await this.calculateOmnibusMetadataFromPaths(franchiseId, discoveredMasterPaths)
          }
        }
      } catch (err) {
        console.error('Error auto-discovering omnibus masters:', err)
      }

      return null
    }

    return await this.calculateOmnibusMetadataFromPaths(franchiseId, masterFilePaths)
  }

  /**
   * Automated Sequential Batch Compilation & Master Auto-Stitch Pipeline:
   * Compiles Batch A -> Batch B -> ... -> Batch N sequentially (flushing RAM after each),
   * and automatically stitches all batches into 01_Episode_Master_1080p.mp4 at the end.
   */
  static async autoCompileAllBatches(franchiseId, episodeId, options = {}) {
    const key = `${franchiseId}/${episodeId}`
    const { skipExisting = true, force = false } = options

    if (this.compilationState[key]?.status === 'compiling' && !force) {
      throw new Error('Video compilation is already in progress for this episode.')
    }

    const scenes = await ImageService.getPromptMatrixScenes(franchiseId, episodeId)
    const chunkSize = 24
    const totalScenes = scenes.length || 216
    const totalBatches = Math.ceil(totalScenes / chunkSize)
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
    const videoDir = this.getVideoDir(franchiseId, episodeId)
    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)

    this.updateStatus(franchiseId, episodeId, {
      status: 'compiling',
      progress: 2,
      message: `Starting Automated Sequential Pipeline: ${totalBatches} batches (${totalScenes} cuts)...`,
      log: [
        `Initializing Automated Batch Queue for ${totalBatches} batches (${skipExisting ? 'Smart-Skip Up-To-Date Batches' : 'Fresh All Re-render'})...`
      ]
    })

    try {
      for (let b = 0; b < totalBatches; b++) {
        const batchCode = String(b + 1).padStart(2, '0')
        const letter = letters[b] || `Batch_${b + 1}`
        const batchOutputFilename = `01_Episode_Batch_${batchCode}_Preview.mp4`
        const legacyOutputFilename = `01_Episode_Batch_${letter}_Preview.mp4`
        const batchOutputPath = path.join(videoDir, batchOutputFilename)
        const legacyOutputPath = path.join(videoDir, legacyOutputFilename)
        const baseProgress = Math.round(2 + (b / totalBatches) * 90)

        // Find if either numeric or legacy preview MP4 exists
        const existingPreviewPath = fsSync.existsSync(batchOutputPath) 
          ? batchOutputPath 
          : (fsSync.existsSync(legacyOutputPath) ? legacyOutputPath : null)

        // Smart staleness check: verify if preview MP4 exists AND all scene images are older than the MP4
        if (skipExisting && existingPreviewPath) {
          try {
            const stat = await fs.stat(existingPreviewPath)
            if (stat.size > 100000) {
              // Ensure video container is playable and not corrupt (e.g. missing moov atom)
              const validDuration = await this.getVideoDuration(existingPreviewPath)
              if (!validDuration) {
                console.warn(`[Auto-Batch] Corrupt preview video detected for Batch ${batchCode}. Deleting and re-rendering...`)
                try { await fs.unlink(existingPreviewPath) } catch (_) {}
              } else {
                const startScene = b * chunkSize + 1
                const endScene = Math.min((b + 1) * chunkSize, totalScenes)
                let hasNewerImage = false
              
              if (fsSync.existsSync(imagesDir)) {
                for (let s = startScene; s <= endScene; s++) {
                  const imgNum = String(s).padStart(3, '0')
                  const imgPath = path.join(imagesDir, `IMG_${imgNum}.jpg`)
                  if (fsSync.existsSync(imgPath)) {
                    const imgStat = await fs.stat(imgPath)
                    if (imgStat.mtimeMs > stat.mtimeMs) {
                      hasNewerImage = true
                      break
                    }
                  }
                }
              }

              if (!hasNewerImage) {
                this.updateStatus(franchiseId, episodeId, {
                  status: 'compiling',
                  progress: baseProgress,
                  message: `[Batch ${batchCode}] Existing preview video found (${(stat.size / (1024 * 1024)).toFixed(1)} MB). Up to date, skipping render...`,
                  log: [
                    ...(this.compilationState[key]?.log || []),
                    `⏩ [Batch ${batchCode}] Preview video on disk is up to date (${(stat.size / (1024 * 1024)).toFixed(1)} MB). Skipping render.`
                  ]
                })
                continue
              } else {
                this.updateStatus(franchiseId, episodeId, {
                  status: 'compiling',
                  progress: baseProgress,
                  message: `[Batch ${batchCode}] Fresh images detected! Re-rendering batch preview...`,
                  log: [
                    ...(this.compilationState[key]?.log || []),
                    `🔄 [Batch ${batchCode}] Newly uploaded images are newer than existing preview video. Re-compiling batch...`
                  ]
                })
              }
            }
          }
        } catch (_) {}
        }

        this.updateStatus(franchiseId, episodeId, {
          status: 'compiling',
          progress: baseProgress,
          message: `[Batch ${batchCode}] Synthesizing 24 scene cuts (${b + 1} of ${totalBatches} batches)...`,
          log: [
            ...(this.compilationState[key]?.log || []),
            `▶ Starting Batch ${batchCode} (Batch ${b + 1}/${totalBatches})...`
          ]
        })

        // Compile single batch sequentially with internal flag
        await this.compileEpisodeVideo(franchiseId, episodeId, {
          ...options,
          batchIndex: b,
          isInternalSequential: true
        })
      }

      // Automatically run the lossless master stitcher
      this.updateStatus(franchiseId, episodeId, {
        status: 'compiling',
        progress: 95,
        message: `All ${totalBatches} batches ready! Running high-speed lossless stitcher...`,
        log: [
          ...(this.compilationState[key]?.log || []),
          `All ${totalBatches} batches ready on disk. Triggering lossless FFmpeg stitcher...`
        ]
      })

      const stitchResult = await this.stitchBatches(franchiseId, episodeId, options)
      return stitchResult
    } catch (err) {
      console.error('Auto-batch pipeline error:', err)
      this.updateStatus(franchiseId, episodeId, {
        status: 'failed',
        message: `Auto-batch pipeline failed: ${err.message}`
      })
      throw err
    }
  }

  static formatTimestamp(seconds) {
    const s = Math.max(0, Math.floor(seconds))
    const m = Math.floor(s / 60)
    const remainderSec = s % 60
    return `${String(m).padStart(2, '0')}:${String(remainderSec).padStart(2, '0')}`
  }

  /**
   * Parse climax start and end tags from script, with automatic timeline correlation
   */
  static async parseClimaxWindow(franchiseId, episodeId, totalDuration = 0) {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    let scriptContent = ''
    try {
      scriptContent = await fs.readFile(scriptPath, 'utf-8')
    } catch (_) {}

    const timeline = await this.parseDynamicTimeline(franchiseId, episodeId, totalDuration)
    if (!timeline || timeline.length === 0) {
      throw new Error('Unable to parse timeline for episode.')
    }

    // Check for [CLIMAX_START] and [CLIMAX_END] (or <!-- CLIMAX_START -->)
    let startTag = null
    let endTag = null
    let inClimax = false
    const scriptLines = scriptContent.split('\n')

    for (let i = 0; i < scriptLines.length; i++) {
      const line = scriptLines[i].trim()
      if (/(?:\[CLIMAX_START\]|<!--\s*CLIMAX_START\s*-->)/i.test(line)) {
        inClimax = true
      } else if (/(?:\[CLIMAX_END\]|<!--\s*CLIMAX_END\s*-->)/i.test(line)) {
        inClimax = false
      }

      if (inClimax) {
        const m = line.match(/\[(IMG_\d+)\]/)
        if (m) {
          const tag = m[1].toUpperCase()
          if (!startTag) startTag = tag
          endTag = tag
        }
      }
    }

    // Fallback if no tags in script: look for scenes around scenes 44-48 or 20% mark
    if (!startTag || !endTag) {
      const candidates = timeline.filter(t => ['IMG_044', 'IMG_045', 'IMG_046', 'IMG_047', 'IMG_048'].includes(t.tag))
      if (candidates.length >= 3) {
        startTag = candidates[0].tag
        endTag = candidates[candidates.length - 1].tag
      } else {
        const startIdx = Math.floor(timeline.length * 0.2)
        const endIdx = Math.min(timeline.length - 1, startIdx + 5)
        startTag = timeline[startIdx].tag
        endTag = timeline[endIdx].tag
      }
    }

    const startScene = timeline.find(t => t.tag === startTag) || timeline[0]
    const endScene = timeline.find(t => t.tag === endTag) || timeline[Math.min(timeline.length - 1, 6)]

    const startSeconds = Math.max(0, startScene.startTime)
    const endSeconds = Math.min(totalDuration || endScene.endTime, endScene.endTime)
    const durationSeconds = Math.max(15, endSeconds - startSeconds)

    return {
      startTag,
      endTag,
      startSeconds,
      endSeconds,
      durationSeconds,
      formattedStart: this.formatTimestamp(startSeconds),
      formattedEnd: this.formatTimestamp(endSeconds),
      formattedDuration: `${Math.round(durationSeconds)}s`
    }
  }

  /**
   * Generates a 3-second styled 9:16 vertical outro card PNG
   */
  static async generateOutroCard(franchiseId, episodeId, outroPngPath) {
    const cleanFranchiseName = franchiseId.replace(/^Series_\d+_/, '').replace(/_/g, ' ')
    const svg = `
<svg width='1080' height='1920' viewBox='0 0 1080 1920' xmlns='http://www.w3.org/2000/svg'>
  <defs>
    <radialGradient id='bgGrad' cx='50%' cy='45%' r='65%'>
      <stop offset='0%' stop-color='#1e1b4b' stop-opacity='0.6'/>
      <stop offset='60%' stop-color='#0f172a' stop-opacity='0.95'/>
      <stop offset='100%' stop-color='#020617' stop-opacity='1'/>
    </radialGradient>
    <linearGradient id='goldGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#FFE57F'/>
      <stop offset='50%' stop-color='#FFD700'/>
      <stop offset='100%' stop-color='#FFA000'/>
    </linearGradient>
    <filter id='glow' x='-20%' y='-20%' width='140%' height='140%'>
      <feGaussianBlur stdDeviation='12' result='blur'/>
      <feComposite in='SourceGraphic' in2='blur' operator='over'/>
    </filter>
  </defs>

  <rect width='1080' height='1920' fill='url(#bgGrad)'/>

  <!-- Center Decorative Glow Rings -->
  <circle cx='540' cy='900' r='340' fill='none' stroke='rgba(255, 215, 0, 0.15)' stroke-width='2' stroke-dasharray='10 15'/>
  <circle cx='540' cy='900' r='380' fill='none' stroke='rgba(99, 102, 241, 0.15)' stroke-width='1'/>

  <!-- Gold Pill Badge -->
  <g filter='url(#glow)'>
    <rect x='260' y='680' width='560' height='76' rx='38' fill='url(#goldGrad)'/>
    <text x='540' y='730' font-family='Montserrat, Arial Black, Impact, sans-serif' font-size='32' font-weight='900' letter-spacing='3' fill='#09090b' text-anchor='middle'>⚡ FULL EPISODE ON YOUTUBE</text>
  </g>

  <!-- Big Dramatic Callout -->
  <text x='540' y='860' font-family='Montserrat, Arial Black, sans-serif' font-size='64' font-weight='900' fill='#ffffff' text-anchor='middle' letter-spacing='-1'>WHAT HAPPENS NEXT?</text>
  
  <text x='540' y='930' font-family='system-ui, -apple-system, sans-serif' font-size='34' font-weight='600' fill='#94a3b8' text-anchor='middle'>Watch The Complete Story Unfold</text>
  <text x='540' y='980' font-family='system-ui, -apple-system, sans-serif' font-size='34' font-weight='600' fill='#94a3b8' text-anchor='middle'>In The Full-Length YouTube Master Cut</text>

  <!-- Action Box -->
  <rect x='160' y='1080' width='760' height='150' rx='24' fill='rgba(255, 255, 255, 0.04)' stroke='rgba(255, 215, 0, 0.4)' stroke-width='2'/>
  <text x='540' y='1135' font-family='system-ui, -apple-system, sans-serif' font-size='26' font-weight='700' fill='#fbbf24' text-anchor='middle' letter-spacing='2'>SEARCH ON YOUTUBE:</text>
  <text x='540' y='1185' font-family='Montserrat, Arial Black, Impact, sans-serif' font-size='34' font-weight='900' fill='#ffffff' text-anchor='middle'>${cleanFranchiseName}</text>

  <!-- Bio link pointer -->
  <text x='540' y='1320' font-family='system-ui, -apple-system, sans-serif' font-size='30' font-weight='700' fill='#38bdf8' text-anchor='middle'>🔗 Channel link in profile bio</text>
  <text x='540' y='1370' font-family='system-ui, -apple-system, sans-serif' font-size='24' font-weight='500' fill='#64748b' text-anchor='middle'>Manhwa Recap Studio • Original Production</text>
</svg>
`
    await sharp(Buffer.from(svg)).png().toFile(outroPngPath)
    return outroPngPath
  }

  /**
   * Helper to wrap subtitle text for vertical TikTok / Shorts screens (maxChars ~28)
   */
  static wrapSubtitleText(text, maxChars = 28) {
    if (!text) return ''
    const words = text.split(/\s+/)
    const lines = []
    let currentLine = ''
    for (const word of words) {
      if ((currentLine + ' ' + word).trim().length <= maxChars) {
        currentLine = (currentLine + ' ' + word).trim()
      } else {
        if (currentLine) lines.push(currentLine)
        currentLine = word
      }
    }
    if (currentLine) lines.push(currentLine)
    return lines.join('\n')
  }

  /**
   * Slices and renders the 45-60s Climax short with 3s outro card in pristine 1080x1920 vertical format
   * with perfectly proportioned, auto-wrapped subtitles that fit 100% within the video frame.
   */
  static async extractClimaxShort(franchiseId, episodeId, options = {}) {
    const videoDir = this.getVideoDir(franchiseId, episodeId)
    const masterPath = this.getMasterVideoPath(franchiseId, episodeId)
    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
    const subtitlesDir = TtsService.getSubtitlesDir(franchiseId, episodeId)
    const srtPath = path.join(subtitlesDir, '01_Episode_Subtitles.srt')

    // 1. Locate source master video for duration & mixed audio (voiceover + BGM + sidechain ducking)
    let srcVideo = null
    if (fsSync.existsSync(masterPath)) {
      srcVideo = masterPath
    } else if (fsSync.existsSync(videoDir)) {
      const vids = fsSync.readdirSync(videoDir).filter(f => f.endsWith('.mp4') && f.includes('Master'))
      if (vids.length > 0) {
        srcVideo = path.join(videoDir, vids[0])
      }
    }

    if (!srcVideo) {
      throw new Error('Master video not found. Please compile the episode video first before generating the TikTok Climax Short.')
    }

    const dur = await this.getVideoDuration(srcVideo) || 2289
    const window = await this.parseClimaxWindow(franchiseId, episodeId, dur)

    const shortsDir = path.join(franchisesDir, franchiseId, episodeId, 'shorts')
    await fs.mkdir(shortsDir, { recursive: true })

    const tempDir = path.join(projectRoot, '.tmp', `climax_render_${franchiseId}_${episodeId}_${Date.now()}`)
    await fs.mkdir(tempDir, { recursive: true })

    const outputFilename = 'TikTok_Climax_Hook.mp4'
    const outputPath = path.join(shortsDir, outputFilename)
    const outroPngPath = path.join(tempDir, 'temp_outro.png')

    try {
      // 2. Query timeline beats for the climax window
      const fullBeats = await this.parseDynamicTimeline(franchiseId, episodeId, dur)
      const climaxBeats = fullBeats.filter(b => b.tag >= window.startTag && b.tag <= window.endTag)
      const existingImages = fsSync.existsSync(imagesDir) ? await fs.readdir(imagesDir) : []

      let visualBaseVideo = null

      if (climaxBeats.length > 0 && existingImages.length > 0) {
        // Native 1080x1920 Clean Scene Rendering (Zero stretching, Zero distorted pre-burned subtitles)
        const renderedClipPaths = []
        for (let i = 0; i < climaxBeats.length; i++) {
          const beat = climaxBeats[i]
          const imgFile = existingImages.find(f => f.startsWith(beat.tag)) || `${beat.tag}.jpg`
          const imgPath = path.join(imagesDir, imgFile)
          const clipOut = path.join(tempDir, `clip_${String(i).padStart(2, '0')}.mp4`)

          let isLandscape = false
          if (fsSync.existsSync(imgPath)) {
            try {
              const meta = await sharp(imgPath).metadata()
              isLandscape = (meta.width / meta.height) > 1.2
            } catch (_) {}
          }

          const vf = isLandscape
            ? '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=20[bg];[0:v]scale=1080:-1[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1'
            : 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1'

          await new Promise((resolve, reject) => {
            const proc = spawn('ffmpeg', [
              '-y', '-loop', '1', '-t', String(beat.duration),
              '-i', imgPath,
              '-vf', vf,
              '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-r', '24',
              clipOut
            ])
            let err = ''
            proc.stderr.on('data', d => { err += d.toString() })
            proc.on('close', c => c === 0 ? resolve() : reject(new Error(`Clip render failed: ${err.slice(-300)}`)))
          })
          renderedClipPaths.push(clipOut)
        }

        const concatList = path.join(tempDir, 'concat.txt')
        await fs.writeFile(concatList, renderedClipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'))
        visualBaseVideo = path.join(tempDir, 'visual_base.mp4')
        await new Promise((resolve, reject) => {
          const proc = spawn('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', concatList, '-c', 'copy', visualBaseVideo])
          let err = ''
          proc.stderr.on('data', d => { err += d.toString() })
          proc.on('close', c => c === 0 ? resolve() : reject(new Error(`Visual concat failed: ${err.slice(-300)}`)))
        })
      } else {
        // Fallback: Center-crop from master video with proper 9:16 aspect ratio (608:1080)
        visualBaseVideo = path.join(tempDir, 'visual_base.mp4')
        await new Promise((resolve, reject) => {
          const proc = spawn('ffmpeg', [
            '-y',
            '-ss', String(window.startSeconds),
            '-t', String(window.durationSeconds),
            '-i', srcVideo,
            '-vf', 'crop=608:1080:(in_w-608)/2:0,scale=1080:1920,setsar=1',
            '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
            '-an', visualBaseVideo
          ])
          let err = ''
          proc.stderr.on('data', d => { err += d.toString() })
          proc.on('close', c => c === 0 ? resolve() : reject(new Error(`Master crop fallback failed: ${err.slice(-300)}`)))
        })
      }

      // 3. Extract High-Fidelity Audio Slice from Master Video (Voiceover + BGM + Ducking)
      const audioSlice = path.join(tempDir, 'audio_slice.aac')
      await new Promise((resolve, reject) => {
        const proc = spawn('ffmpeg', [
          '-y',
          '-ss', String(window.startSeconds),
          '-t', String(window.durationSeconds),
          '-i', srcVideo,
          '-vn', '-c:a', 'aac', '-b:a', '192k',
          audioSlice
        ])
        let err = ''
        proc.stderr.on('data', d => { err += d.toString() })
        proc.on('close', c => c === 0 ? resolve() : reject(new Error(`Audio slice failed: ${err.slice(-300)}`)))
      })

      // 4. Generate Calibrated, Wrapped Vertical Subtitles (max 28 chars/line)
      let hasSubtitles = false
      const verticalSrtPath = path.join(tempDir, 'vertical_short.srt')
      if (fsSync.existsSync(srtPath)) {
        try {
          const rawCues = await this.parseSrtCues(srtPath)
          const formatTm = (sec) => {
            const h = String(Math.floor(sec / 3600)).padStart(2, '0')
            const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
            const s = String(Math.floor(sec % 60)).padStart(2, '0')
            const ms = String(Math.floor((sec % 1) * 1000)).padStart(3, '0')
            return `${h}:${m}:${s},${ms}`
          }

          const shortCues = rawCues
            .filter(c => c.endSec > window.startSeconds && c.startSec < window.endSeconds)
            .map((c, idx) => {
              const s = Math.max(0, c.startSec - window.startSeconds)
              const e = Math.min(window.durationSeconds, c.endSec - window.startSeconds)
              return `${idx + 1}\n${formatTm(s)} --> ${formatTm(e)}\n${VideoService.wrapSubtitleText(c.text, 28)}`
            })

          if (shortCues.length > 0) {
            await fs.writeFile(verticalSrtPath, shortCues.join('\n\n'), 'utf-8')
            hasSubtitles = true
          }
        } catch (subErr) {
          console.warn('Could not generate vertical subtitles:', subErr.message)
        }
      }

      // 5. Burn Calibrated Vertical Subtitles onto Visual Base + Mux Audio
      const subtitledClimax = path.join(tempDir, 'subtitled_climax.mp4')
      const safeSrt = verticalSrtPath.replace(/\\/g, '/').replace(/:/g, '\\:')
      const subStyle = "force_style='PlayResX=1080,PlayResY=1920,FontSize=42,FontName=Arial,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=3,Shadow=2,Alignment=2,MarginV=280'"

      const muxArgs = [
        '-y',
        '-i', visualBaseVideo,
        '-i', audioSlice
      ]

      if (hasSubtitles) {
        muxArgs.push('-vf', `subtitles='${safeSrt}':${subStyle}`)
      }

      muxArgs.push(
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
        '-c:a', 'aac', '-b:a', '192k',
        subtitledClimax
      )

      await new Promise((resolve, reject) => {
        const proc = spawn('ffmpeg', muxArgs)
        let err = ''
        proc.stderr.on('data', d => { err += d.toString() })
        proc.on('close', c => c === 0 ? resolve() : reject(new Error(`Subtitled mux failed: ${err.slice(-300)}`)))
      })

      // 6. Generate Outro Card and Concatenate Final 1080x1920 Short
      await this.generateOutroCard(franchiseId, episodeId, outroPngPath)

      const concatFinalArgs = [
        '-y',
        '-i', subtitledClimax,
        '-loop', '1', '-t', '3', '-i', outroPngPath,
        '-f', 'lavfi', '-t', '3', '-i', 'anullsrc=r=48000:cl=stereo',
        '-filter_complex',
        '[1:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v1];[0:v][0:a][v1][2:a]concat=n=2:v=1:a=1[outv][outa]',
        '-map', '[outv]', '-map', '[outa]',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
        '-c:a', 'aac', '-b:a', '192k',
        outputPath
      ]

      await new Promise((resolve, reject) => {
        const proc = spawn('ffmpeg', concatFinalArgs)
        let err = ''
        proc.stderr.on('data', d => { err += d.toString() })
        proc.on('close', c => c === 0 ? resolve() : reject(new Error(`Outro concat failed: ${err.slice(-300)}`)))
      })

      const totalShortDur = window.durationSeconds + 3
      const stat = await fs.stat(outputPath)

      const meta = {
        franchiseId,
        episodeId,
        filename: outputFilename,
        url: `/api/episodes/${franchiseId}/${episodeId}/shorts/${outputFilename}`,
        filesize: stat.size,
        filesizeFormatted: `${(stat.size / (1024 * 1024)).toFixed(1)} MB`,
        startSeconds: window.startSeconds,
        endSeconds: window.endSeconds,
        durationSeconds: totalShortDur,
        formattedDuration: `${Math.round(totalShortDur)}s`,
        timecode: `${window.formattedStart} - ${window.formattedEnd}`,
        startTag: window.startTag,
        endTag: window.endTag,
        generatedAt: new Date().toISOString()
      }

      const metaPath = path.join(shortsDir, 'TikTok_Climax_Hook_metadata.json')
      await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8')

      return meta
    } finally {
      // Clean up temporary workspace
      try {
        await fs.rm(tempDir, { recursive: true, force: true })
      } catch (_) {}
    }
  }

  /**
   * Retrieves existing climax short metadata if compiled
   */
  static async getClimaxShortMetadata(franchiseId, episodeId) {
    const shortsDir = path.join(franchisesDir, franchiseId, episodeId, 'shorts')
    const metaPath = path.join(shortsDir, 'TikTok_Climax_Hook_metadata.json')
    const videoPath = path.join(shortsDir, 'TikTok_Climax_Hook.mp4')

    if (fsSync.existsSync(metaPath) && fsSync.existsSync(videoPath)) {
      try {
        const raw = await fs.readFile(metaPath, 'utf-8')
        return JSON.parse(raw)
      } catch (_) {}
    }
    return null
  }
}
