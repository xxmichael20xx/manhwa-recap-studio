import { TtsService } from '../server/services/ttsService.js'

async function run() {
  console.log('🎙️ Initiating Stage 2 Full Neural TTS Audio & Subtitle Generation for Series 02 EP01 (312 Scenes)...')
  const franchiseId = 'Series_02_The_Omniscient_Dungeon_Sovereign'
  const episodeId = 'EP01_The_FRank_Awakening_and_The_Plunderers_Bow'
  const voice = 'en-US-ChristopherNeural'

  const startTime = Date.now()
  try {
    const result = await TtsService.generateEpisodeAudio(franchiseId, episodeId, voice)
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`\n🎉 Full TTS Audio Generation Completed in ${elapsedSec}s!`)
    console.log(`📊 Total Scenes Synthesized: ${result.totalScenes}`)
    console.log(`⏱️ Total Master Runtime: ${(result.totalDurationMs / 60000).toFixed(2)} minutes (${(result.totalDurationMs / 1000).toFixed(1)}s)`)
    console.log(`🎵 Master MP3: ${result.masterAudio}`)
    console.log(`📝 Master SRT: ${result.masterSrt}`)
  } catch (err) {
    console.error('❌ TTS Generation Error:', err)
    process.exit(1)
  }
}

run()
