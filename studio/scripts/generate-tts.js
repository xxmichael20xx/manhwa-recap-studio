#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { TtsService } from '../server/services/ttsService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = process.argv.slice(2)
const franchiseId = args[0] || 'Series_04_The_Billion_Year_Sovereign'
const episodeId = args[1] || 'EP02_The_Campus_Appraisal_and_The_Celestial_Countdown'
const voice = args[2] || 'en-US-ChristopherNeural'
const force = args.includes('--force')

console.log('='.repeat(78))
console.log('  MANHWA RECAP STUDIO — AUTOMATED EDGETTS EPISODE AUDIO SYNTHESIZER')
console.log('='.repeat(78))
console.log(`Franchise : ${franchiseId}`)
console.log(`Episode   : ${episodeId}`)
console.log(`Voice     : ${voice}`)
console.log(`Force     : ${force}`)
console.log('-'.repeat(78))

try {
  const result = await TtsService.generateEpisodeAudio(franchiseId, episodeId, voice, { force })
  console.log('\n' + '='.repeat(78))
  console.log(`[SUCCESS] Episode Voiceover Synthesis Complete!`)
  console.log(`Scenes Synthesized : ${result.generatedCount}`)
  console.log(`Total Duration     : ${(result.totalDurationMs / 1000).toFixed(1)}s (${Math.floor(result.totalDurationMs / 60000)}m ${Math.round((result.totalDurationMs % 60000) / 1000)}s)`)
  console.log(`Subtitle Cues      : ${result.subtitleCount}`)
  console.log(`Master Audio Track : ${result.masterAudioFile}`)
  console.log('='.repeat(78))
  process.exit(0)
} catch (err) {
  console.error(`\x1b[31m[ERROR]\x1b[0m Failed to synthesize episode audio:`, err.message)
  process.exit(1)
}
