import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')
const bgmDir = path.resolve(projectRoot, 'assets/audio/bgm')

await fs.mkdir(bgmDir, { recursive: true })

const tracks = [
  {
    name: '01_Catacombs_SubBass_Drone.mp3',
    title: 'Catacombs Sub-Bass Drone',
    mood: 'Atmospheric / Suspense',
    desc: 'Deep subterranean sub-bass, resonant low-frequency rumble and dark ambient air for dungeon exploration.',
    command: [
      '-y',
      '-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.08:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=42:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=64:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=96:sample_rate=48000',
      '-filter_complex',
      '[0:a]lowpass=f=180,volume=1.2[noise];[1:a]volume=0.35[s1];[2:a]volume=0.25[s2];[3:a]volume=0.15[s3];[s1][s2][s3]amix=inputs=3:normalize=0[drones];[noise][drones]amix=inputs=2:normalize=0[mixed];[mixed]aecho=0.8:0.88:1200:0.35[echoed];[echoed]flanger=delay=15:depth=8:speed=0.15[out]',
      '-map', '[out]',
      '-t', '120',
      '-c:a', 'libmp3lame',
      '-b:a', '192k'
    ]
  },
  {
    name: '02_Betrayal_Melancholic_Ambience.mp3',
    title: 'Betrayal Melancholic Ambience',
    mood: 'Tragic / Cold Realisation',
    desc: 'Slow evolving minor chord pads in A minor with subtle cold harmonic shimmer, reflecting betrayal and isolation.',
    command: [
      '-y',
      '-f', 'lavfi', '-i', 'sine=frequency=55:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=82.4:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=130.81:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=164.81:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=220:sample_rate=48000',
      '-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=0.015:sample_rate=48000',
      '-filter_complex',
      '[0:a]volume=0.3[c0];[1:a]volume=0.25[c1];[2:a]volume=0.2[c2];[3:a]volume=0.18[c3];[4:a]volume=0.12[c4];[c0][c1][c2][c3][c4]amix=inputs=5:normalize=0[chord];[5:a]bandpass=frequency=600:width_type=h:width=400,volume=0.4[air];[chord][air]amix=inputs=2:normalize=0[pad];[pad]tremolo=f=0.2:d=0.3[pulsing];[pulsing]aecho=0.8:0.9:800|1600:0.3|0.2[echoed];[echoed]flanger=delay=12:depth=6:speed=0.15[out]',
      '-map', '[out]',
      '-t', '120',
      '-c:a', 'libmp3lame',
      '-b:a', '192k'
    ]
  },
  {
    name: '03_Awakening_Power_Surge.mp3',
    title: 'Awakening Power Surge',
    mood: 'Epic / System Ascension',
    desc: 'Harmonic open fifth chords with shimmering high-register mana surge and dynamic swelling, ideal for sovereign awakening.',
    command: [
      '-y',
      '-f', 'lavfi', '-i', 'sine=frequency=65.41:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=98.0:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=130.81:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=196.0:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=293.66:sample_rate=48000',
      '-filter_complex',
      '[0:a]volume=0.35[s0];[1:a]volume=0.3[s1];[2:a]volume=0.25[s2];[3:a]volume=0.2[s3];[4:a]volume=0.15[s4];[s0][s1][s2][s3][s4]amix=inputs=5:normalize=0[chord];[chord]tremolo=f=0.35:d=0.45[swelled];[swelled]aecho=0.8:0.85:600|1200:0.4|0.25[echoed];[echoed]chorus=0.7:0.9:55:0.4:0.25:2[out]',
      '-map', '[out]',
      '-t', '120',
      '-c:a', 'libmp3lame',
      '-b:a', '192k'
    ]
  },
  {
    name: '04_Combat_Dungeon_Raid.mp3',
    title: 'Combat Dungeon Raid',
    mood: 'Action / Boss Battle',
    desc: 'Tense low-end percussive pulse, driving combat drones and tension riser texture for high-stakes dungeon skirmishes.',
    command: [
      '-y',
      '-f', 'lavfi', '-i', 'sine=frequency=48:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=72:sample_rate=48000',
      '-f', 'lavfi', '-i', 'sine=frequency=108:sample_rate=48000',
      '-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=0.03:sample_rate=48000',
      '-filter_complex',
      '[0:a]tremolo=f=1.5:d=0.8,volume=0.45[kick];[1:a]volume=0.25[bass];[2:a]tremolo=f=3.0:d=0.5,volume=0.2[mid];[3:a]highpass=f=1200,volume=0.25,tremolo=f=3.0:d=0.6[hi];[kick][bass][mid][hi]amix=inputs=4:normalize=0[raw];[raw]aecho=0.8:0.7:400:0.3[echoed];[echoed]flanger=delay=8:depth=4:speed=0.2[out]',
      '-map', '[out]',
      '-t', '120',
      '-c:a', 'libmp3lame',
      '-b:a', '192k'
    ]
  }
]

for (const track of tracks) {
  const targetPath = path.join(bgmDir, track.name)
  console.log(`🎵 Generating BGM Soundscape: ${track.title} -> ${track.name}...`)
  
  const args = [...track.command, targetPath]
  await new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args)
    let stderr = ''
    proc.stderr.on('data', d => { stderr += d.toString() })
    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Ready: ${track.name}`)
        resolve()
      } else {
        console.error(`FFmpeg stderr:\n${stderr}`)
        reject(new Error(`Failed to generate ${track.name} (Code ${code})`))
      }
    })
  })
}

// Generate metadata index file for UI
const manifest = tracks.map(t => ({
  id: t.name.replace(/\.mp3$/, ''),
  filename: t.name,
  title: t.title,
  mood: t.mood,
  desc: t.desc,
  url: `/api/bgm/${t.name}`
}))

await fs.writeFile(path.join(bgmDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8')
console.log('✨ All 4 BGM tracks and manifest.json generated successfully.')
