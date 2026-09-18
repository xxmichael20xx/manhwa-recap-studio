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
  static statusState = {}

  static getStatus(franchiseId, episodeId) {
    const key = `${franchiseId}/${episodeId}`
    return this.statusState[key] || {
      status: 'idle',
      progress: 0,
      message: 'Ready to generate voiceover audio',
      log: []
    }
  }

  static updateStatus(franchiseId, episodeId, patch) {
    const key = `${franchiseId}/${episodeId}`
    this.statusState[key] = {
      ...(this.statusState[key] || { status: 'idle', progress: 0, log: [] }),
      ...patch
    }
  }

  static getAudioDir(franchiseId, episodeId) {
    return path.join(franchisesDir, franchiseId, episodeId, 'audio')
  }

  static getSubtitlesDir(franchiseId, episodeId) {
    return path.join(franchisesDir, franchiseId, episodeId, 'subtitles')
  }

  static async getAudioDuration(filePath) {
    return new Promise((resolve) => {
      const proc = spawn('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        filePath.replace(/\\/g, '/')
      ])
      let out = ''
      proc.stdout.on('data', d => { out += d.toString() })
      proc.on('close', (code) => {
        if (code === 0) {
          const sec = parseFloat(out.trim())
          resolve(sec)
        } else {
          resolve(0)
        }
      })
      proc.on('error', () => resolve(0))
    })
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

    this.updateStatus(franchiseId, episodeId, {
      status: 'running',
      progress: 5,
      message: `Connecting to Edge-TTS neural engine (${voice})...`,
      log: [`Connecting to Edge-TTS neural engine (${voice})...`]
    })

    const tts = new MsEdgeTTS()
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, {
      wordBoundaryEnabled: true,
      sentenceBoundaryEnabled: true
    })

    let globalTimeMs = 0
    let sceneIndex = 1
    const generatedAudioFiles = []

    for (const block of sceneBlocks) {
      // Fix regex: $ matches end of string in JS regex (\Z matches literal Z in JS)
      const voiceoverMatch = block.match(/Voiceover:\s*([\s\S]*?)(?=(?:### Scene|$|## 🎙️ Act))/i)
      let text = voiceoverMatch ? voiceoverMatch[1].trim() : ''
      
      // Clean markdown tags from spoken text and normalize dashes for clean tokenization
      text = text.replace(/\*\*\[(.*?)\]\*\*/g, '$1')
                 .replace(/\*\*(.*?)\*\*/g, '$1')
                 .replace(/\*(.*?)\*/g, '$1')
                 .replace(/\[(.*?)\]/g, '$1')
                 .replace(/\$1/g, '')
                 .replace(/—/g, ' — ')
                 .replace(/\n+/g, ' ')
                 .replace(/\s+/g, ' ')
                 .trim()

      if (text.length > 10) {
        const paddedIndex = String(sceneIndex).padStart(2, '0')
        const filename = `${episodeId}_SC${paddedIndex}.mp3`
        const filePath = path.join(audioDir, filename)

        try {
          const res = await tts.toStream(text)
          const chunks = []
          const rawWords = []

          if (res.metadataStream) {
            res.metadataStream.on('data', d => {
              const str = d.toString()
              try {
                const json = JSON.parse(str.trim())
                if (json.Metadata) {
                  for (const m of json.Metadata) {
                    if (m.Type === 'WordBoundary' && m.Data && m.Data.text) {
                      rawWords.push({
                        ttsWord: m.Data.text.Text,
                        startMs: Math.round(m.Data.Offset / 10000),
                        endMs: Math.round((m.Data.Offset + m.Data.Duration) / 10000)
                      })
                    }
                  }
                }
              } catch (e) {
                // Regex scan fallback in case chunks are concatenated or split
                const matches = str.match(/\{[\s\S]*?"Metadata"\s*:\s*\[[\s\S]*?\][\s\S]*?\}/g)
                if (matches) {
                  for (const block of matches) {
                    try {
                      const json = JSON.parse(block)
                      if (json.Metadata) {
                        for (const m of json.Metadata) {
                          if (m.Type === 'WordBoundary' && m.Data && m.Data.text) {
                            rawWords.push({
                              ttsWord: m.Data.text.Text,
                              startMs: Math.round(m.Data.Offset / 10000),
                              endMs: Math.round((m.Data.Offset + m.Data.Duration) / 10000)
                            })
                          }
                        }
                      }
                    } catch (err) {}
                  }
                }
              }
            })
          }

          for await (const chunk of res.audioStream) {
            chunks.push(chunk)
          }

          const buffer = Buffer.concat(chunks)
          await fs.writeFile(filePath, buffer)
          generatedAudioFiles.push(filePath)

          // Measure exact audio duration via ffprobe
          const exactDurationSec = await this.getAudioDuration(filePath)
          const exactDurationMs = exactDurationSec > 0 
            ? Math.round(exactDurationSec * 1000) 
            : Math.round((buffer.length * 8 * 1000) / 48000)

          let parsedSentences = []

          if (rawWords.length > 0) {
            // Sort raw words by startMs
            rawWords.sort((a, b) => a.startMs - b.startMs)

            // Reconcile punctuation and casing from the original spoken text
            let cursor = 0
            const alignedWords = []
            for (const rw of rawWords) {
              const cleanWord = rw.ttsWord.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
              let foundIdx = -1
              for (let c = cursor; c <= text.length - cleanWord.length; c++) {
                const candidate = text.slice(c, c + cleanWord.length).replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
                if (candidate === cleanWord) {
                  foundIdx = c
                  break
                }
              }
              if (foundIdx !== -1) {
                let endIdx = foundIdx + rw.ttsWord.length
                while (endIdx < text.length && /[,.?!;:—"'()\]]/.test(text[endIdx])) {
                  endIdx++
                }
                const originalToken = text.slice(foundIdx, endIdx)
                alignedWords.push({
                  ...rw,
                  text: originalToken
                })
                cursor = endIdx
              } else {
                alignedWords.push({
                  ...rw,
                  text: rw.ttsWord
                })
              }
            }

            // Cluster into cadence-aware subtitle cards (optimal 4-8 words per cue)
            let currentGroup = []
            for (let i = 0; i < alignedWords.length; i++) {
              const w = alignedWords[i]
              currentGroup.push(w)

              const isLastWord = (i === alignedWords.length - 1)
              const nextWord = isLastWord ? null : alignedWords[i + 1]

              const hasTerminalPunct = /[.?!;—:]$/.test(w.text)
              const hasCommaPunct = /[,]$/.test(w.text) && currentGroup.length >= 3
              const hasPauseGap = nextWord ? (nextWord.startMs - w.endMs > 240) : false
              const nextIsOrphanBeforePunct = nextWord && /[,.?!;—:]$/.test(nextWord.text) && currentGroup.length < 8

              const cardDuration = w.endMs - currentGroup[0].startMs
              const isGroupFull = currentGroup.length >= 8 && !nextIsOrphanBeforePunct
              const isTimeExceeded = cardDuration > 3000 && currentGroup.length >= 4 && !nextIsOrphanBeforePunct

              if (isLastWord || hasTerminalPunct || hasCommaPunct || hasPauseGap || isGroupFull || isTimeExceeded) {
                const firstWord = currentGroup[0]
                const lastWord = currentGroup[currentGroup.length - 1]

                let cueEnd = lastWord.endMs + 100
                if (nextWord && cueEnd > nextWord.startMs) {
                  cueEnd = Math.max(lastWord.endMs, nextWord.startMs - 20)
                }
                if (cueEnd > exactDurationMs) {
                  cueEnd = exactDurationMs
                }

                parsedSentences.push({
                  text: currentGroup.map(item => item.text).join(' '),
                  start: globalTimeMs + firstWord.startMs,
                  end: globalTimeMs + cueEnd
                })

                currentGroup = []
              }
            }
          }

          // Fallback if no word boundaries from Edge-TTS metadata
          if (parsedSentences.length === 0) {
            const rawSentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [text]
            let runningStart = globalTimeMs
            const totalChars = text.length

            for (const s of rawSentences) {
              const sTrim = s.trim()
              if (!sTrim) continue
              
              const words = sTrim.split(/\s+/)
              const chunkSize = 8
              const chunks = []
              for (let i = 0; i < words.length; i += chunkSize) {
                chunks.push(words.slice(i, i + chunkSize).join(' '))
              }

              const sentenceDuration = Math.max(1200, Math.round((sTrim.length / totalChars) * exactDurationMs))
              const chunkDuration = Math.round(sentenceDuration / chunks.length)

              for (const chunk of chunks) {
                parsedSentences.push({
                  text: chunk,
                  start: runningStart,
                  end: Math.min(globalTimeMs + exactDurationMs, runningStart + chunkDuration)
                })
                runningStart += chunkDuration
              }
            }
          }

          for (const s of parsedSentences) {
            allSubtitleEntries.push(s)
          }

          results.push({
            scene: sceneIndex,
            filename,
            size: buffer.length,
            durationMs: exactDurationMs,
            wordCount: rawWords.length,
            cueCount: parsedSentences.length,
            previewText: text.substring(0, 80) + '...'
          })

          globalTimeMs += exactDurationMs

          const pct = Math.min(85, Math.round(10 + (sceneIndex / sceneBlocks.length) * 75))
          const currentLogs = [...(this.getStatus(franchiseId, episodeId).log || [])]
          currentLogs.push(`Synthesized SC${String(sceneIndex).padStart(2, '0')} (${(exactDurationMs / 1000).toFixed(1)}s, ${parsedSentences.length} subtitle cues)`)
          this.updateStatus(franchiseId, episodeId, {
            status: 'running',
            progress: pct,
            message: `Synthesizing scene ${sceneIndex}/${sceneBlocks.length}...`,
            log: currentLogs.slice(-25)
          })
        } catch (err) {
          console.error(`Error generating audio for scene ${sceneIndex}:`, err)
        }
      }
      sceneIndex++
    }

    try {
      tts.close()
    } catch (e) {}

    this.updateStatus(franchiseId, episodeId, {
      status: 'running',
      progress: 90,
      message: `Assembling master audio & compiling ${allSubtitleEntries.length} timed cues...`,
      log: [...(this.getStatus(franchiseId, episodeId).log || []), `Concatenating ${generatedAudioFiles.length} scene tracks and formatting SRT/VTT...`]
    })

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

    this.updateStatus(franchiseId, episodeId, {
      status: 'completed',
      progress: 100,
      message: `Voiceover & subtitles ready! Generated ${results.length} scenes & ${allSubtitleEntries.length} subtitle cues.`,
      log: [...(this.getStatus(franchiseId, episodeId).log || []), `Complete: Master audio and ${allSubtitleEntries.length} subtitle cues ready.`]
    })

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
