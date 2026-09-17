import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const franchisesDir = path.resolve(projectRoot, '01_Franchises')

export class TtsService {
  static async generateEpisodeAudio(franchiseId, episodeId, voice = 'en-US-ChristopherNeural') {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    const audioDir = path.join(epPath, 'audio')

    await fs.mkdir(audioDir, { recursive: true })
    const scriptContent = await fs.readFile(scriptPath, 'utf-8')

    // Parse scenes from script
    const sceneBlocks = scriptContent.split(/### Scene \d+:/g).slice(1)
    const results = []

    const tts = new MsEdgeTTS()
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)

    let sceneIndex = 1
    for (const block of sceneBlocks) {
      const voiceoverMatch = block.match(/Voiceover:\s*([\s\S]*?)(?=(?:### Scene|\Z|## 🎙️ Act))/i)
      let text = voiceoverMatch ? voiceoverMatch[1].trim() : ''
      
      // Clean markdown tags from spoken text
      text = text.replace(/\*\*\[.*?\]\*\*/g, '')
                 .replace(/\*\*.*?\*\*/g, '$1')
                 .replace(/\*.*?\*/g, '$1')
                 .replace(/\[.*?\]/g, '')
                 .replace(/\n+/g, ' ')
                 .trim()

      if (text.length > 10) {
        const paddedIndex = String(sceneIndex).padStart(2, '0')
        const filename = `${episodeId}_SC${paddedIndex}.mp3`
        const filePath = path.join(audioDir, filename)

        try {
          const readable = tts.toStream(text)
          const chunks = []
          for await (const chunk of readable) {
            chunks.push(chunk)
          }
          const buffer = Buffer.concat(chunks)
          await fs.writeFile(filePath, buffer)

          results.push({
            scene: sceneIndex,
            filename,
            size: buffer.length,
            previewText: text.substring(0, 80) + '...'
          })
        } catch (err) {
          console.error(`Error generating audio for scene ${sceneIndex}:`, err)
        }
      }
      sceneIndex++
    }

    return {
      success: true,
      voice,
      generatedCount: results.length,
      files: results
    }
  }

  static getAudioFilePath(franchiseId, episodeId, filename) {
    return path.join(franchisesDir, franchiseId, episodeId, 'audio', filename)
  }
}
