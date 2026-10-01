import { VideoService } from '../server/services/videoService.js'

console.log('Testing VideoService.compileEpisodeVideo directly...')
try {
  const result = await VideoService.compileEpisodeVideo(
    'Series_01_The_Sovereign_Protocol',
    'EP01_Awakening_and_Catacombs',
    {}
  )
  console.log('Result:', result)
} catch (err) {
  console.error('Compilation error:', err)
}
