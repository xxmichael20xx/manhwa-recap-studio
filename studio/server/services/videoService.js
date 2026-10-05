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
   * Formats an array of batch letters into a clean descriptor string:
   * ['A','B','C','D','E','F','G','H','I'] -> "Batches_A-I"
   * ['A','B','C'] -> "Batches_A-C"
   * ['A','C','F'] -> "Batches_A_C_F"
   */
  static formatBatchRangeDescriptor(letters) {
    if (!letters || letters.length === 0) return 'All'
    const sorted = [...new Set(letters)].sort((a, b) => a.localeCompare(b))
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
    const batchLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
    const batchLetter = isBatchCompile ? (batchLetters[batchIdxNum] || `Batch_${batchIdxNum + 1}`) : null
    const outputFilename = isBatchCompile ? `01_Episode_Batch_${batchLetter}_Preview.mp4` : '01_Episode_Master_1080p.mp4'

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
    const batchKey = isBatchCompile ? `batch_${batchLetter}` : 'master'
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
        ? `Aligned ${targetBeats.length} panel cuts for Batch ${batchLetter} (${batchDuration.toFixed(1)}s). Synthesizing 24fps Sub-Pixel Skia clips...`
        : `Aligned ${targetBeats.length} narrative panel beats with SRT cues. Synthesizing 24fps Sub-Pixel Skia clips...`,
      log: [
        ...(this.compilationState[key].log || []),
        isBatchCompile 
          ? `Batch ${batchLetter}: Processing ${targetBeats.length} cuts from t=${batchStartTime.toFixed(2)}s to t=${(batchStartTime + batchDuration).toFixed(2)}s.`
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
          ? `[Batch ${batchLetter}] ⚡ Computing clips ${chunkTags} (4 parallel Skia threads)...`
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
            ? `[Batch ${batchLetter}] Rendered ${completedClips}/${targetBeats.length} clips (Latest: [${beat.tag}])...`
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
    const cleanTempSrt = path.join(os.tmpdir(), `sub_${franchiseId}_${episodeId}_${isBatchCompile ? batchLetter : 'master'}_${Date.now()}.srt`)
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
    
    // Position mappings
    let overlayExpr = 'W-w-36:36' // Default: Top-Right (Option B)
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
        filterComplexParts.push(`[${watermarkInputIdx}:v]scale=240:-1,format=rgba,colorchannelmixer=aa=${safeWatermarkOpacity}[wm_faded]`)
        filterComplexParts.push(`[v_sub][wm_faded]overlay=${overlayExpr}:format=auto[v]`)
      } else {
        filterComplexParts.push(`[0:v]subtitles='${safeSrtPath}':${subStyle}[v]`)
      }
    } else {
      if (watermarkPath) {
        filterComplexParts.push(`[0:v]null[v_sub]`)
        filterComplexParts.push(`[${watermarkInputIdx}:v]scale=240:-1,format=rgba,colorchannelmixer=aa=${safeWatermarkOpacity}[wm_faded]`)
        filterComplexParts.push(`[v_sub][wm_faded]overlay=${overlayExpr}:format=auto[v]`)
      } else {
        filterComplexParts.push(`[0:v]null[v]`)
      }
    }

    // Audio Filter Chain: Narration + (Optional BGM with Sidechain Ducking) -> Output [aout]
    if (bgmPath) {
      filterComplexParts.push(`[1:a]volume=1.0,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asplit=2[vo_main][vo_sc]`)
      filterComplexParts.push(`[${bgmInputIdx}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${safeBgmVol}dB[bgm_base]`)
      filterComplexParts.push(`[bgm_base][vo_sc]sidechaincompress=threshold=0.015:ratio=10:attack=12:release=350:link=average[bgm_ducked]`)
      filterComplexParts.push(`[vo_main][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=2:normalize=false[aout]`)
    } else {
      filterComplexParts.push(`[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[aout]`)
    }

    const filterComplex = filterComplexParts.join(';')

    ffmpegArgs = [
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
            ? `Batch ${batchLetter} Preview (${targetBeats.length} cuts) compiled successfully!`
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
    let batchFiles = []
    for (const f of files) {
      if (f.endsWith('.mp4')) {
        const match = f.match(/(?:01_Episode_Batch_|Batch_)([A-Za-z0-9_]+)_Preview/i)
        if (match) {
          if (!targetLetters || targetLetters.includes(match[1])) {
            batchFiles.push({
              filename: f,
              letter: match[1],
              fullPath: path.join(videoDir, f)
            })
          }
        }
      }
    }

    if (batchFiles.length === 0) {
      this.updateStatus(franchiseId, episodeId, {
        status: 'failed',
        message: 'No compiled batch preview videos found to stitch.'
      })
      throw new Error('No compiled batch preview videos found in video/ folder.')
    }

    // Sort batches strictly in alphabetical sequence (Batch A, B, C, D...)
    batchFiles.sort((a, b) => a.letter.localeCompare(b.letter))

    const tempDir = path.resolve(projectRoot, '.tmp')
    await fs.mkdir(tempDir, { recursive: true })
    const concatListPath = path.join(tempDir, `concat_batches_${franchiseId}_${episodeId}_${Date.now()}.txt`)
    const concatLines = batchFiles.map(b => `file '${b.fullPath.replace(/\\/g, '/')}'`)
    await fs.writeFile(concatListPath, concatLines.join('\n'), 'utf-8')

    const descriptor = this.formatBatchRangeDescriptor(batchFiles.map(b => b.letter))
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
        `Stitching ${batchFiles.length} batches: ${batchFiles.map(b => b.letter).join(', ')} -> ${masterOutputFilename}...`
      ]
    })

    return new Promise((resolve, reject) => {
      let stderr = ''
      const proc = spawn('ffmpeg', ffmpegArgs, { cwd: projectRoot })
      proc.stderr.on('data', chunk => { stderr += chunk.toString() })

      proc.on('close', async code => {
        try { await fs.unlink(concatListPath) } catch (_) {}

        if (code === 0) {
          try {
            // Also copy to standard master path for backwards-compatibility
            await fs.copyFile(masterOutputPath, standardMasterPath)
          } catch (_) {}

          const successMsg = `Master Video (${descriptor}) stitched successfully from ${batchFiles.length} batches (${batchFiles.map(b => 'Batch ' + b.letter).join(', ')}) in <2 seconds!`
          this.updateStatus(franchiseId, episodeId, {
            status: 'completed',
            progress: 100,
            message: successMsg,
            log: [
              ...(this.compilationState[key]?.log || []),
              `⚡ Master assembly complete: ${masterOutputFilename} losslessly joined from ${batchFiles.length} batches.`
            ]
          })
          ActivityLogService.success(
            'video',
            'Master Video Stitched',
            `Losslessly assembled ${masterOutputFilename} from ${batchFiles.length} batches.`,
            { batchCount: batchFiles.length, batches: batchFiles.map(b => b.letter), filename: masterOutputFilename },
            franchiseId,
            episodeId
          )
          resolve({
            success: true,
            videoPath: masterOutputPath,
            filename: masterOutputFilename,
            descriptor,
            url: `/api/episodes/${franchiseId}/${episodeId}/video-stream?file=${masterOutputFilename}`,
            batchCount: batchFiles.length
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
    const selectedLetters = batchIndices.map(i => letters[i] || `Batch_${i + 1}`)

    this.updateStatus(franchiseId, episodeId, {
      status: 'compiling',
      progress: 5,
      message: `Starting Grouped Batch Queue for ${batchIndices.length} batches (${selectedLetters.join(', ')})...`,
      log: [
        `Initializing Grouped Batch Queue for: ${selectedLetters.map(l => 'Batch ' + l).join(', ')}...`
      ]
    })

    try {
      for (let i = 0; i < batchIndices.length; i++) {
        const bIdx = batchIndices[i]
        const letter = letters[bIdx] || `Batch_${bIdx + 1}`
        const progressPct = Math.round(5 + (i / batchIndices.length) * 85)

        this.updateStatus(franchiseId, episodeId, {
          status: 'compiling',
          progress: progressPct,
          message: `[Batch ${letter}] Synthesizing 24 scene cuts (${i + 1} of ${batchIndices.length} grouped batches)...`,
          log: [
            ...(this.compilationState[key]?.log || []),
            `▶ Starting Grouped Batch ${letter} (${i + 1}/${batchIndices.length})...`
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

    const tempDir = path.resolve(projectRoot, '.tmp')
    await fs.mkdir(tempDir, { recursive: true })
    const concatListPath = path.join(tempDir, `concat_omnibus_${franchiseId}_${Date.now()}.txt`)
    const concatLines = masterFilePaths.map(p => `file '${p.replace(/\\/g, '/')}'`)
    await fs.writeFile(concatListPath, concatLines.join('\n'), 'utf-8')

    const outName = outputFilename || `00_Omnibus_${Date.now()}_1080p.mp4`
    const franchiseDir = path.join(franchisesDir, franchiseId)
    const videoDir = path.join(franchiseDir, 'EP01_The_Double_FRank_Anomaly', 'video')
    await fs.mkdir(videoDir, { recursive: true })
    const omnibusOutputPath = path.join(videoDir, outName)

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
          ActivityLogService.success(
            'video',
            'Omnibus Video Stitched',
            `Losslessly assembled ${outName} from ${masterFilePaths.length} master videos.`,
            { fileCount: masterFilePaths.length, outputFilename: outName },
            franchiseId,
            'EP01_The_Double_FRank_Anomaly'
          )
          resolve({
            success: true,
            videoPath: omnibusOutputPath,
            filename: outName,
            url: `/api/episodes/${franchiseId}/EP01_The_Double_FRank_Anomaly/video-stream?file=${outName}`,
            masterCount: masterFilePaths.length
          })
        } else {
          console.error('FFmpeg omnibus stitching failed:', stderr.slice(-800))
          reject(new Error(`FFmpeg omnibus stitch exited with code ${code}: ${stderr.slice(-200)}`))
        }
      })
    })
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

    this.updateStatus(franchiseId, episodeId, {
      status: 'compiling',
      progress: 2,
      message: `Starting Automated Sequential Pipeline: ${totalBatches} batches (${totalScenes} cuts)...`,
      log: [
        `Initializing Automated Batch Queue for ${totalBatches} batches (${skipExisting ? 'Skip Already Compiled Batches' : 'Fresh All Re-render'})...`
      ]
    })

    try {
      for (let b = 0; b < totalBatches; b++) {
        const letter = letters[b] || `Batch_${b + 1}`
        const batchOutputFilename = `01_Episode_Batch_${letter}_Preview.mp4`
        const batchOutputPath = path.join(videoDir, batchOutputFilename)
        const baseProgress = Math.round(2 + (b / totalBatches) * 90)

        // Check if existing compiled batch MP4 exists on disk and is valid
        if (skipExisting && fsSync.existsSync(batchOutputPath)) {
          try {
            const stat = await fs.stat(batchOutputPath)
            if (stat.size > 100000) {
              this.updateStatus(franchiseId, episodeId, {
                status: 'compiling',
                progress: baseProgress,
                message: `[Batch ${letter}] Existing preview video found (${(stat.size / (1024 * 1024)).toFixed(1)} MB). Skipping compilation...`,
                log: [
                  ...(this.compilationState[key]?.log || []),
                  `⏩ [Batch ${letter}] Existing preview video found on disk (${(stat.size / (1024 * 1024)).toFixed(1)} MB). Skipping render.`
                ]
              })
              continue
            }
          } catch (_) {}
        }

        this.updateStatus(franchiseId, episodeId, {
          status: 'compiling',
          progress: baseProgress,
          message: `[Batch ${letter}] Synthesizing 24 scene cuts (${b + 1} of ${totalBatches} batches)...`,
          log: [
            ...(this.compilationState[key]?.log || []),
            `▶ Starting Batch ${letter} (Batch ${b + 1}/${totalBatches})...`
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
}
