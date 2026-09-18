import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const franchisesDir = path.resolve(projectRoot, '01_Franchises')

function formatSrtTime(ms) {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const millis = Math.floor(ms % 1000)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(millis).padStart(3, '0')}`
}

function formatVttTime(ms) {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const millis = Math.floor(ms % 1000)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
}

export class TtsService {
  static getSubtitlesDir(franchiseId, episodeId) {
    return path.join(franchisesDir, franchiseId, episodeId, 'subtitles')
  }

  static getAudioDir(franchiseId, episodeId) {
    return path.join(franchisesDir, franchiseId, episodeId, 'audio')
  }

  static async generateEpisodeAudio(franchiseId, episodeId, voice = 'en-US-ChristopherNeural') {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    const audioDir = this.getAudioDir(franchiseId, episodeId)
    const subtitlesDir = this.getSubtitlesDir(franchiseId, episodeId)

    await fs.mkdir(audioDir, { recursive: true })
    await fs.mkdir(subtitlesDir, { recursive: true })
    const scriptContent = await fs.readFile(scriptPath, 'utf-8')

    // Parse scenes from script
    const sceneBlocks = scriptContent.split(/### Scene \d+:/g).slice(1)
    const results = []
    const allSubtitleEntries = []

    const tts = new MsEdgeTTS()
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, {
      wordBoundaryEnabled: true,
      sentenceBoundaryEnabled: true
    })

    let globalTimeMs = 0
    let sceneIndex = 1
    const generatedAudioFiles = []

    for (const block of sceneBlocks) {
      const voiceoverMatch = block.match(/Voiceover:\s*([\s\S]*?)(?=(?:### Scene|\Z|## 🎙️ Act))/i)
      let text = voiceoverMatch ? voiceoverMatch[1].trim() : ''
      
      // Clean markdown tags from spoken text
      text = text.replace(/\*\*\[(.*?)\]\*\*/g, '$1')
                 .replace(/\*\*(.*?)\*\*/g, '$1')
                 .replace(/\*(.*?)\*/g, '$1')
                 .replace(/\[(.*?)\]/g, '$1')
                 .replace(/\$1/g, '')
                 .replace(/\n+/g, ' ')
                 .trim()

      if (text.length > 10) {
        const paddedIndex = String(sceneIndex).padStart(2, '0')
        const filename = `${episodeId}_SC${paddedIndex}.mp3`
        const filePath = path.join(audioDir, filename)

        try {
          const res = await tts.toStream(text)
          const chunks = []
          const metadataChunks = []

          if (res.metadataStream) {
            res.metadataStream.on('data', d => metadataChunks.push(d.toString()))
          }

          for await (const chunk of res.audioStream) {
            chunks.push(chunk)
          }

          const buffer = Buffer.concat(chunks)
          await fs.writeFile(filePath, buffer)
          generatedAudioFiles.push(filePath)

          // Estimate audio duration from MP3 buffer (24kHz 48kbps mono ~ 6000 bytes/sec)
          // Exact duration: (buffer.length * 8) / 48000 seconds
          const approxDurationMs = Math.round((buffer.length * 8 * 1000) / 48000)

          // Parse sentence boundaries from metadata if available
          let parsedSentences = []
          if (metadataChunks.length > 0) {
            const rawMeta = metadataChunks.join('')
            const matches = rawMeta.match(/\{"Metadata":\[\{"Type":"SentenceBoundary"[\s\S]*?\}\]\}/g)
            if (matches) {
              for (const m of matches) {
                try {
                  const parsed = JSON.parse(m)
                  const item = parsed.Metadata[0]
                  if (item && item.Data && item.Data.text) {
                    const offsetMs = Math.round(item.Data.Offset / 10000)
                    const durationMs = Math.round(item.Data.Duration / 10000)
                    parsedSentences.push({
                      text: item.Data.text.Text.trim(),
                      start: globalTimeMs + offsetMs,
                      end: globalTimeMs + offsetMs + durationMs
                    })
                  }
                } catch (e) {}
              }
            }
          }

          // Split into punchy, dynamic captions (max 10-12 words per cue)
          const rawSentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [text]
          let runningStart = globalTimeMs
          const totalChars = text.length

          for (const s of rawSentences) {
            const sTrim = s.trim()
            if (!sTrim) continue
            
            // Sub-divide long sentences by commas or 10-word chunks so captions remain in lower-third
            const words = sTrim.split(/\s+/)
            const chunkSize = 10
            const chunks = []
            for (let i = 0; i < words.length; i += chunkSize) {
              chunks.push(words.slice(i, i + chunkSize).join(' '))
            }

            const sentenceDuration = Math.max(1200, Math.round((sTrim.length / totalChars) * approxDurationMs))
            const chunkDuration = Math.round(sentenceDuration / chunks.length)

            for (const chunk of chunks) {
              parsedSentences.push({
                text: chunk,
                start: runningStart,
                end: runningStart + chunkDuration
              })
              runningStart += chunkDuration
            }
          }

          for (const s of parsedSentences) {
            allSubtitleEntries.push(s)
          }

          results.push({
            scene: sceneIndex,
            filename,
            size: buffer.length,
            durationMs: approxDurationMs,
            previewText: text.substring(0, 80) + '...'
          })

          globalTimeMs += approxDurationMs
        } catch (err) {
          console.error(`Error generating audio for scene ${sceneIndex}:`, err)
        }
      }
      sceneIndex++
    }

    try {
      tts.close()
    } catch (e) {}

    // Generate Master SRT and VTT
    let srtContent = ''
    let vttContent = 'WEBVTT\n\n'

    allSubtitleEntries.forEach((entry, idx) => {
      const num = idx + 1
      const srtTime = `${formatSrtTime(entry.start)} --> ${formatSrtTime(entry.end)}`
      const vttTime = `${formatVttTime(entry.start)} --> ${formatVttTime(entry.end)}`
      
      srtContent += `${num}\n${srtTime}\n${entry.text}\n\n`
      vttContent += `${num}\n${vttTime}\n${entry.text}\n\n`
    })

    const srtPath = path.join(subtitlesDir, '01_Episode_Subtitles.srt')
    const vttPath = path.join(subtitlesDir, '01_Episode_Subtitles.vtt')
    await fs.writeFile(srtPath, srtContent.trim(), 'utf-8')
    await fs.writeFile(vttPath, vttContent.trim(), 'utf-8')

    // Concatenate all audio files into a seamless master track via FFmpeg
    const masterAudioPath = path.join(audioDir, '01_Episode_Master.mp3')
    if (generatedAudioFiles.length > 0) {
      await this.concatenateAudioFiles(generatedAudioFiles, masterAudioPath)
    }

    return {
      success: true,
      voice,
      generatedCount: results.length,
      files: results,
      totalDurationMs: globalTimeMs,
      subtitleCount: allSubtitleEntries.length,
      srtFile: '01_Episode_Subtitles.srt',
      vttFile: '01_Episode_Subtitles.vtt',
      masterAudioFile: '01_Episode_Master.mp3'
    }
  }

  static async concatenateAudioFiles(filePaths, outputPath) {
    return new Promise(async (resolve, reject) => {
      const concatListPath = path.join(path.dirname(outputPath), 'concat_list.txt')
      const fileListContent = filePaths.map(f => `file '${f.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n')
      await fs.writeFile(concatListPath, fileListContent, 'utf-8')

      let stderr = ''
      const proc = spawn('ffmpeg', [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath.replace(/\\/g, '/'),
        '-c', 'copy',
        outputPath.replace(/\\/g, '/')
      ])

      proc.stderr.on('data', d => { stderr += d.toString() })

      proc.on('close', async (code) => {
        try { await fs.unlink(concatListPath) } catch (e) {}
        if (code === 0) {
          resolve(outputPath)
        } else {
          console.error('Audio concat failed with stderr:', stderr)
          reject(new Error(`FFmpeg concat exited with code ${code}: ${stderr.slice(-200)}`))
        }
      })
    })
  }

  static async getSubtitles(franchiseId, episodeId) {
    const srtPath = path.join(this.getSubtitlesDir(franchiseId, episodeId), '01_Episode_Subtitles.srt')
    const vttPath = path.join(this.getSubtitlesDir(franchiseId, episodeId), '01_Episode_Subtitles.vtt')
    
    let srt = ''
    let vtt = ''
    try { srt = await fs.readFile(srtPath, 'utf-8') } catch (e) {}
    try { vtt = await fs.readFile(vttPath, 'utf-8') } catch (e) {}

    return { srt, vtt, hasSubtitles: !!srt }
  }

  static getAudioFilePath(franchiseId, episodeId, filename) {
    return path.join(this.getAudioDir(franchiseId, episodeId), filename)
  }

  static getSubtitleFilePath(franchiseId, episodeId, filename) {
    return path.join(this.getSubtitlesDir(franchiseId, episodeId), filename)
  }
}
