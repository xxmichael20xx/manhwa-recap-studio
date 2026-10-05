import { TtsService } from '../server/services/ttsService.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../../')
const franchiseId = 'Series_02_The_Omniscient_Dungeon_Sovereign'
const episodeId = 'EP01_The_Double_FRank_Anomaly_and_Awakening'
const epDir = path.resolve(projectRoot, '01_Franchises', franchiseId, episodeId)
const audioDir = path.join(epDir, 'audio')
const subtitlesDir = path.join(epDir, 'subtitles')
const scriptPath = path.join(epDir, '01_Episode_Script.md')

async function run() {
  console.log('🎙️ Reconciling full 312 scenes audio & subtitles...')
  const result = await TtsService.generateEpisodeAudio(franchiseId, episodeId, 'en-US-ChristopherNeural')
  console.log('\n🎉 Master Audio & Subtitle Generation Fully Complete!')
  console.log('Files generated:', result.generatedCount)
  console.log(`Total Duration: ${(result.totalDurationMs / 60000).toFixed(2)} mins (${(result.totalDurationMs / 1000).toFixed(1)}s)`)
}

run()
