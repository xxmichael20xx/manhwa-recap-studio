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
      const sceneBlocks = scriptContent.split(/### Scene \d+:/g).slice(1)
      const scenesData = []
      let cueCursor = 0

      const normalize = (text) => (text || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

      for (let sIdx = 0; sIdx < sceneBlocks.length; sIdx++) {
        const block = sceneBlocks[sIdx]
        const tagMatch = block.match(/Prompt Tag:\*?\*?\s*(.*?)\n/i)
        const sceneTags = tagMatch ? (tagMatch[1].match(/IMG_\d+/gi) || []) : []

        const voMatch = block.split(/\* \*\*Voiceover:\*\*/i)[1] || ''
        const cleanVo = voMatch.replace(/---|\#\#.*/g, '').trim()
        const rawSentences = cleanVo.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 0)

        let sceneStart = 0
        if (sIdx === 0) {
          sceneStart = 0
        } else if (rawSentences.length > 0) {
          const firstWords = normalize(rawSentences[0]).split(' ').slice(0, 3).join(' ')
          for (let c = cueCursor; c < cues.length; c++) {
            if (normalize(cues[c].text).includes(firstWords.slice(0, 10))) {
              sceneStart = cues[c].startSec
              cueCursor = c
              break
            }
          }
        }

        scenesData.push({
          sceneIndex: sIdx + 1,
          tags: sceneTags,
          startSec: sceneStart,
          endSec: 0
        })
      }

      // Monotonically bound scene end timestamps
      for (let i = 0; i < scenesData.length; i++) {
        scenesData[i].endSec = (i < scenesData.length - 1) ? scenesData[i + 1].startSec : totalDurationSeconds
      }

      const timelineBeats = []
      for (let sIdx = 0; sIdx < scenesData.length; sIdx++) {
        const s = scenesData[sIdx]
        const count = s.tags.length || 1
        const sceneStartFrame = Math.round(s.startSec * 30)
        const sceneEndFrame = (sIdx === scenesData.length - 1) ? totalAudioFrames : Math.round(s.endSec * 30)
        const sceneFrames = sceneEndFrame - sceneStartFrame

        for (let tIdx = 0; tIdx < count; tIdx++) {
          const tag = (s.tags[tIdx] || `IMG_${String(timelineBeats.length + 1).padStart(3, '0')}`).toUpperCase()
          const beatStartFrame = sceneStartFrame + Math.round((tIdx / count) * sceneFrames)
          const beatEndFrame = (tIdx === count - 1) ? sceneEndFrame : sceneStartFrame + Math.round(((tIdx + 1) / count) * sceneFrames)
          const beatFrames = Math.max(1, beatEndFrame - beatStartFrame)

          timelineBeats.push({
            beatIndex: timelineBeats.length + 1,
            sceneIndex: s.sceneIndex,
            tag,
            startFrame: beatStartFrame,
            endFrame: beatEndFrame,
            frames: beatFrames,
            startTime: beatStartFrame / 30,
            endTime: beatEndFrame / 30,
            duration: beatFrames / 30
          })
        }
      }

      return timelineBeats
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
      return outputPath
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
      // 0: Liquid Webtoon Vertical Scan (Top-to-Bottom Glide with Sine Easing)
      `zoompan=z=1.28:x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*(0.5-0.5*cos(${PI}*on/${frames}))':d=${frames}:s=1920x1080:fps=30`,
      // 1: Dramatic Webtoon Vertical Reveal (Bottom-to-Top Glide with Sine Easing)
      `zoompan=z=1.28:x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*(1.0-(0.5-0.5*cos(${PI}*on/${frames})))':d=${frames}:s=1920x1080:fps=30`,
      // 2: Smooth Center Push-In (1.02x -> 1.24x Tension Ramp)
      `zoompan=z='1.02+0.22*(0.5-0.5*cos(${PI}*on/${frames}))':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=${frames}:s=1920x1080:fps=30`,
      // 3: Dramatic Center Pull-Out (1.24x -> 1.04x Scope Reveal)
      `zoompan=z='1.24-0.20*(0.5-0.5*cos(${PI}*on/${frames}))':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=${frames}:s=1920x1080:fps=30`,
      // 4: Horizontal Panoramic Drift (Left to Right)
      `zoompan=z=1.22:x='(iw-iw/zoom)*(0.5-0.5*cos(${PI}*on/${frames}))':y='(ih-ih/zoom)/2':d=${frames}:s=1920x1080:fps=30`,
      // 5: Horizontal Tracking Drift (Right to Left)
      `zoompan=z=1.22:x='(iw-iw/zoom)*(1.0-(0.5-0.5*cos(${PI}*on/${frames})))':y='(ih-ih/zoom)/2':d=${frames}:s=1920x1080:fps=30`,
      // 6: Upper-Third Character Focus Push-In (Face & Eyes Tension)
      `zoompan=z='1.08+0.18*(0.5-0.5*cos(${PI}*on/${frames}))':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*0.20':d=${frames}:s=1920x1080:fps=30`,
      // 7: Lower-Third Combat / Impact Pull-Out (Weapon & Action Ground)
      `zoompan=z='1.25-0.18*(0.5-0.5*cos(${PI}*on/${frames}))':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*0.80':d=${frames}:s=1920x1080:fps=30`
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

  static async compileEpisodeVideo(franchiseId, episodeId, options = {}) {
    const { kenBurns = true, burnSubtitles = true, bgmTrack = '01_Catacombs_SubBass_Drone.mp3', bgmVolume = -22 } = options
    const key = `${franchiseId}/${episodeId}`

    if (this.compilationState[key]?.status === 'compiling') {
      throw new Error('Video compilation is already in progress for this episode.')
    }

    this.updateStatus(franchiseId, episodeId, {
      status: 'compiling',
      progress: 5,
      message: 'Analyzing transcript timeline and subtitle cues...',
      log: ['Initializing Dynamic Script-Driven Video Compilation Engine...']
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
    const timelineBeats = await this.parseDynamicTimeline(franchiseId, episodeId, totalDurationSeconds)
    this.updateStatus(franchiseId, episodeId, {
      progress: 25,
      message: `Aligned ${timelineBeats.length} narrative panel beats with SRT cues. Synthesizing 30fps Ken Burns clips...`,
      log: [
        ...(this.compilationState[key].log || []),
        `Dynamic Timeline: Generated ${timelineBeats.length} transcript-synchronized panel cuts.`
      ]
    })

    // Get list of existing images on disk
    const existingFiles = fsSync.existsSync(imagesDir) ? await fs.readdir(imagesDir) : []

    // 3. Render Ken Burns clips in managed concurrency (4 at a time)
    const clipFiles = []
    const concurrency = 4
    let completedClips = 0

    for (let i = 0; i < timelineBeats.length; i += concurrency) {
      const batch = timelineBeats.slice(i, i + concurrency)
      await Promise.all(batch.map(async (beat, batchIdx) => {
        const beatIndex = i + batchIdx
        const clipPath = path.join(tempClipsDir, `clip_${String(beatIndex).padStart(3, '0')}.mp4`)
        
        // Find best matching image file
        let imageFilename = `${beat.tag}.png`
        if (!existingFiles.includes(imageFilename)) {
          // Check for .jpg or fallback to first available image
          const altJpg = `${beat.tag}.jpg`
          if (existingFiles.includes(altJpg)) {
            imageFilename = altJpg
          } else if (existingFiles.length > 0) {
            imageFilename = existingFiles[beatIndex % existingFiles.length]
          }
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
        await VideoService.renderKenBurnsClip(compPath, beat.frames, kenBurns ? beatIndex : 0, clipPath)

        clipFiles[beatIndex] = clipPath
        completedClips++

        const progressPct = Math.round(25 + (completedClips / timelineBeats.length) * 45)
        this.updateStatus(franchiseId, episodeId, {
          progress: progressPct,
          message: `Rendered ${completedClips} of ${timelineBeats.length} 30fps Ken Burns clips ([${beat.tag}])...`,
          log: [
            ...(this.compilationState[key].log || []).slice(-20),
            `Rendered dynamic clip ${beatIndex + 1}/${timelineBeats.length} [${beat.tag}] (${beat.duration.toFixed(1)}s)`
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
      message: 'Muxing multi-stream master cut with BGM sidechain ducking & WordBoundary subtitles...',
      log: [
        ...(this.compilationState[key].log || []),
        'Stitching dynamic Ken Burns clips and applying audio DSP sidechain ducking...'
      ]
    })

    // 5. Final Stitch & Subtitle / Audio Muxing
    const safeSrtPath = srtPath.replace(/\\/g, '/').replace(/:/g, '\\:')
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
        '-i', masterAudioPath.replace(/\\/g, '/'),
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
        masterVideoPath.replace(/\\/g, '/')
      ]
    } else {
      let vf = burnSubtitles ? `subtitles='${safeSrtPath}':${subStyle}` : null
      ffmpegArgs = [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath.replace(/\\/g, '/'),
        '-i', masterAudioPath.replace(/\\/g, '/'),
        ...(vf ? ['-vf', vf] : []),
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '22',
        '-r', '30',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        masterVideoPath.replace(/\\/g, '/')
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
          this.updateStatus(franchiseId, episodeId, {
            status: 'completed',
            progress: 100,
            message: `Master 1080p Video compiled successfully with ${timelineBeats.length} synced Ken Burns cuts!`,
            log: [
              ...(this.compilationState[key].log || []),
              `Master 1080p MP4 ready with ${timelineBeats.length} dynamic synchronized cuts and frame-accurate subtitles.`
            ]
          })
          ActivityLogService.success('video', 'Master 1080p Video Compiled', `Rendered 01_Episode_Master_1080p.mp4 with ${timelineBeats.length} Ken Burns cuts and BGM sidechain ducking.`, { cuts: timelineBeats.length, bgmTrack }, franchiseId, episodeId)
          resolve({
            success: true,
            videoPath: masterVideoPath,
            url: `/api/episodes/${franchiseId}/${episodeId}/video-stream`
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
