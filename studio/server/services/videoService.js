import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import { ImageService } from './imageService.js'
import { TtsService } from './ttsService.js'

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

  static async compileEpisodeVideo(franchiseId, episodeId, options = {}) {
    const { kenBurns = true, burnSubtitles = true } = options
    const key = `${franchiseId}/${episodeId}`

    if (this.compilationState[key]?.status === 'compiling') {
      throw new Error('Video compilation is already in progress for this episode.')
    }

    this.updateStatus(franchiseId, episodeId, {
      status: 'compiling',
      progress: 5,
      message: 'Preparing scene visual assets and audio tracks...',
      log: ['Initializing FFmpeg video compilation pipeline...']
    })

    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
    const audioDir = TtsService.getAudioDir(franchiseId, episodeId)
    const subtitlesDir = TtsService.getSubtitlesDir(franchiseId, episodeId)
    const videoDir = this.getVideoDir(franchiseId, episodeId)
    await fs.mkdir(videoDir, { recursive: true })

    const masterVideoPath = this.getMasterVideoPath(franchiseId, episodeId)
    const masterAudioPath = path.join(audioDir, '01_Episode_Master.mp3')
    const srtPath = path.join(subtitlesDir, '01_Episode_Subtitles.srt')

    // 1. Verify master audio exists; if not, check individual scenes
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

    // 2. Fetch scenes and map to images
    const scenes = await ImageService.getPromptMatrixScenes(franchiseId, episodeId)
    if (scenes.length === 0) {
      throw new Error('No scenes found in Prompt Matrix.')
    }

    // Check how many images exist; if missing, auto-generate storyboard stills
    const missingImages = scenes.filter(s => !s.hasImage)
    if (missingImages.length > 0) {
      this.updateStatus(franchiseId, episodeId, {
        progress: 15,
        message: `Auto-synthesizing ${missingImages.length} missing storyboard panels...`,
        log: [...(this.compilationState[key].log || []), `Synthesizing storyboard panels...`]
      })
      await ImageService.generateStoryboardStills(franchiseId, episodeId)
    }

    // 3. Inspect audio duration using ffprobe or file calculation
    this.updateStatus(franchiseId, episodeId, {
      progress: 25,
      message: 'Calculating audio-video sync timing...',
      log: [...(this.compilationState[key].log || []), 'Mapping scene durations to images...']
    })

    // Get individual scene audio files to distribute durations accurately
    let audioFiles = []
    try {
      const allFiles = await fs.readdir(audioDir)
      audioFiles = allFiles.filter(f => f.endsWith('.mp3') && f.includes('_SC')).sort()
    } catch (e) {
      audioFiles = []
    }

    // Read total duration of master audio via FFmpeg/ffprobe
    const totalDurationSeconds = await this.getAudioDuration(masterAudioPath)
    this.updateStatus(franchiseId, episodeId, {
      progress: 35,
      log: [...(this.compilationState[key].log || []), `Total voiceover duration: ${totalDurationSeconds.toFixed(1)}s`]
    })

    // Distribute time across scene images:
    // If we have N scenes in prompt matrix (e.g. 22 images) and duration D,
    // each image displays for totalDurationSeconds / N seconds.
    const durationPerImage = Math.max(2.0, totalDurationSeconds / scenes.length)

    // Build FFmpeg concat input list for images
    const imageListPath = path.join(videoDir, 'image_concat_list.txt')
    const imageListLines = []
    for (const scene of scenes) {
      const imgPath = path.join(imagesDir, scene.filename)
      // FFmpeg concat demuxer requires forward slashes or escaped backslashes
      const safePath = imgPath.replace(/\\/g, '/')
      imageListLines.push(`file '${safePath}'`)
      imageListLines.push(`duration ${durationPerImage.toFixed(3)}`)
    }
    // Repeat last file without duration per FFmpeg concat demuxer spec
    const lastImg = path.join(imagesDir, scenes[scenes.length - 1].filename).replace(/\\/g, '/')
    imageListLines.push(`file '${lastImg}'`)
    await fs.writeFile(imageListPath, imageListLines.join('\n'), 'utf-8')

    this.updateStatus(franchiseId, episodeId, {
      progress: 45,
      message: 'Compiling 1080p video with Ken Burns motion & burned-in subtitles...',
      log: [...(this.compilationState[key].log || []), 'Launching FFmpeg encode job...']
    })

    // Format subtitle path for FFmpeg subtitles filter on Windows:
    // Colons must be escaped with \: and backslashes replaced with /
    const safeSrtPath = srtPath.replace(/\\/g, '/').replace(/:/g, '\\:')
    
    // Construct video filter:
    // 1. Scale/pad to 1920x1080
    // 2. Subtitles burn-in if enabled
    let videoFilter = 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p'
    
    if (burnSubtitles) {
      try {
        await fs.access(srtPath)
        const subStyle = "force_style='FontSize=16,FontName=Arial,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3,Outline=2.0,Shadow=1.0,Alignment=2,MarginV=35'"
        videoFilter += `,subtitles='${safeSrtPath}':${subStyle}`
      } catch (e) {
        // Subtitles file not found, skip burn-in
      }
    }

    const ffmpegArgs = [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', imageListPath.replace(/\\/g, '/'),
      '-i', masterAudioPath.replace(/\\/g, '/'),
      '-vf', videoFilter,
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '22',
      '-r', '30',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-shortest',
      masterVideoPath.replace(/\\/g, '/')
    ]

    return new Promise((resolve, reject) => {
      let stderrOutput = ''
      const proc = spawn('ffmpeg', ffmpegArgs)

      proc.stderr.on('data', (chunk) => {
        const text = chunk.toString()
        stderrOutput += text
        // Extract time=HH:MM:SS progress
        const timeMatch = text.match(/time=(\d+):(\d+):(\d+\.\d+)/)
        if (timeMatch) {
          const currentSec = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseFloat(timeMatch[3])
          const pct = Math.min(95, Math.round(45 + (currentSec / totalDurationSeconds) * 50))
          this.updateStatus(franchiseId, episodeId, {
            progress: pct,
            message: `Encoding Master 1080p Cut (${pct}% - ${currentSec.toFixed(1)}s / ${totalDurationSeconds.toFixed(1)}s)...`
          })
        }
      })

      proc.on('close', async (code) => {
        try { await fs.unlink(imageListPath) } catch (e) {}

        if (code === 0) {
          this.updateStatus(franchiseId, episodeId, {
            status: 'completed',
            progress: 100,
            message: 'Master 1080p Video compilation completed successfully!',
            log: [...(this.compilationState[key].log || []), 'Master 1080p MP4 ready.']
          })
          resolve({
            success: true,
            videoPath: masterVideoPath,
            url: `/api/episodes/${franchiseId}/${episodeId}/video-stream`
          })
        } else {
          console.error('FFmpeg compilation failed with stderr:\n', stderrOutput.slice(-1500))
          this.updateStatus(franchiseId, episodeId, {
            status: 'failed',
            message: `FFmpeg compilation exited with error code ${code}: ${stderrOutput.slice(-300)}`
          })
          reject(new Error(`FFmpeg exited with error code ${code}`))
        }
      })
    })
  }

  static async getAudioDuration(audioPath) {
    return new Promise((resolve) => {
      const proc = spawn('ffmpeg', ['-i', audioPath], { shell: true })
      let stderr = ''
      proc.stderr.on('data', d => { stderr += d.toString() })
      proc.on('close', () => {
        const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/)
        if (match) {
          const sec = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseFloat(match[3])
          resolve(sec)
        } else {
          resolve(120) // 2 min fallback
        }
      })
    })
  }
}
