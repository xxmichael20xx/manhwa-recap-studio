import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { TtsService } from './ttsService.js'
import { VideoService } from './videoService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const franchisesDir = path.resolve(projectRoot, '01_Franchises')

export class PackagingService {
  /**
   * Format seconds to YouTube timestamp (MM:SS or HH:MM:SS)
   */
  static formatTimestamp(seconds) {
    const sec = Math.max(0, Math.floor(seconds))
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  /**
   * Monotonically parse script acts and timestamps from SRT
   */
  static async generatePackage(franchiseId, episodeId) {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    const promptPath = path.join(epPath, '02_Prompt_Matrix.md')
    const srtPath = path.join(TtsService.getSubtitlesDir(franchiseId, episodeId), '01_Episode_Subtitles.srt')
    const masterAudioPath = TtsService.getAudioFilePath(franchiseId, episodeId, '01_Episode_Master.mp3')

    let script = ''
    try { script = await fs.readFile(scriptPath, 'utf-8') } catch (e) {}

    let totalDuration = 1920 // default 32m
    if (fsSync.existsSync(masterAudioPath)) {
      totalDuration = await VideoService.getAudioDuration(masterAudioPath)
    }

    // 1. Parse Dynamic Timeline
    const timeline = await VideoService.parseDynamicTimeline(franchiseId, episodeId, totalDuration)

    // 2. Parse Acts and extract clean chapter markers
    const actRegex = /##\s+(Act\s+\d+[^:\n]*:\s*([^\n\r]+)|Prologue[^\n\r]*|Epilogue[^\n\r]*)/gi
    const scriptLines = script.split('\n')
    const chapters = []

    let currentActTitle = 'Prologue: The Double F-Rank Anomaly'
    let currentStartSec = 0

    // Always start chapter 1 at 00:00 for YouTube compliance
    chapters.push({
      time: '00:00',
      seconds: 0,
      title: 'Prologue: The Double F-Rank Scavenger'
    })

    // Find all acts in script and correlate with timeline beats
    for (let i = 0; i < scriptLines.length; i++) {
      const line = scriptLines[i].trim()
      if (/^#{2,3}\s+(ACT\s+\d+|📦\s+Batch|[A-Z\s]+)/i.test(line) && line.toLowerCase().includes('act')) {
        let actClean = line.replace(/^#{2,3}\s+/, '').replace(/\([^)]*\)/g, '').trim()
        actClean = actClean.replace(/^ACT\s+(\d+[A-Z]?):\s*/i, 'Act $1: ')
        
        // Find next [IMG_XXX] tag in script
        let tagFound = null
        for (let j = i; j < Math.min(i + 20, scriptLines.length); j++) {
          const match = scriptLines[j].match(/\[(IMG_\d+)\]/)
          if (match) {
            tagFound = match[1].toUpperCase()
            break
          }
        }

        if (tagFound) {
          const beat = timeline.find(b => b.tag === tagFound)
          if (beat && beat.startTime > 30) {
            const timeStr = this.formatTimestamp(beat.startTime)
            if (!chapters.some(c => c.time === timeStr)) {
              chapters.push({
                time: timeStr,
                seconds: Math.round(beat.startTime),
                title: actClean
              })
            }
          }
        }
      }
    }

    // Ensure Outro exists at near end
    const outroSec = Math.max(0, totalDuration - 45)
    chapters.push({
      time: this.formatTimestamp(outroSec),
      seconds: Math.round(outroSec),
      title: 'Epilogue & Sovereign Ascendancy'
    })

    const cleanFranchiseName = franchiseId.replace(/^Series_\d+_/, '').replace(/_/g, ' ')
    const cleanEpisodeName = episodeId.replace(/^EP\d+_/, '').replace(/_/g, ' ')

    // 3. Generate High-CTR Title Archetypes
    const titles = [
      {
        archetype: 'False Rank & Hidden Sovereign',
        title: `They Left the Weakest F-Rank to Die in the Abyss, Unaware He Awakened the World's First Sovereign Protocol`,
        ctrScore: '98%',
        style: 'High curiosity & underdog transformation hook'
      },
      {
        archetype: 'Marathon System (Junkie\'s Manhwa Style)',
        title: `(1-8) Everyone Mocked His F-Rank Rank, Until He Unlocked a 10,000x Calculation Sovereign System`,
        ctrScore: '96%',
        style: 'Numbered binge-compilation & progression hook'
      },
      {
        archetype: 'Catacombs Betrayal & Solo Dominance',
        title: `Betrayed and Left Behind in an F-Rank Dungeon, He Returned as an Untouchable Abyssal Monarch`,
        ctrScore: '94%',
        style: 'Betrayal, high-stakes revenge & dominance'
      },
      {
        archetype: 'Institutional Anomaly & Proctor Shock',
        title: `The Guild Tried to Blacklist Him as Garbage, But His Zero-Mana Slashes Broke the Entire Academy`,
        ctrScore: '92%',
        style: 'High-IQ tactical proctor shockwave'
      },
      {
        archetype: 'Sovereign Pillar & Empire Genesis',
        title: `He Was Classified as Double F-Rank, But His Calculation Velocity Made Him the World's Strongest Pillar`,
        ctrScore: '91%',
        style: 'Epic power scaling & unshakeable status'
      }
    ]

    // 4. Generate Chapter Text for Description
    const chapterText = chapters.map(c => `${c.time} - ${c.title}`).join('\n')

    // 5. Generate Full SEO Description
    const description = `They abandoned the weakest Double F-Rank hunter in the depths of the Imperial Catacombs, unaware that his terminal crisis would trigger the awakening of the legendary Singularity Protocol...

Watch the full story of Caelen Vance as he transcends ordinary human hunter classifications, mastering spatial shears, low-gravity inversions, and unstoppable calculation velocity to become the world's first unshakeable Sovereign Pillar.

🔥 Series: ${cleanFranchiseName}
🎬 Episode: ${cleanEpisodeName}
⏱️ Full Runtime: ${(totalDuration / 60).toFixed(1)} Minutes (Full 1080p 24FPS Cinematic Master)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ CHAPTER TIMESTAMPS:
${chapterText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 COMMUNITY QUESTION:
Would you have spared Lord Vane on that collapsing bridge, or eliminated him right away? Let me know your thoughts in the comments below! 👇

🔔 Subscribe to the channel and turn on notifications so you don't miss Episode 02: The Guild Inquest & Dimensional Incursion!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎵 MUSIC & AUDIO ATTRIBUTION:
All background OST soundscapes and atmospheric scores are licensed royalty-free for creative production:
- Catacombs Sub-Bass Drone (Atmospheric / Suspense)
- Betrayal Melancholic Ambience (A-Minor Harmonic Pad)
- Awakening Power Surge (Open Fifth Sovereign Swell)
- Combat Dungeon Raid (High-Stakes Low Percussion)

⚖️ DISCLAIMER:
This video is an original narrative adaptation and production. All scripts, lore mechanics, visual designs, voiceovers, and motion assemblies were created with original creative transformation under fair use principles.

#manhwarecap #webtoon #sololeveling #animerecap #manhwa #overpoweredmc #actionmanhwa #levelingsystem #recap`

    // 6. Master 16:9 Thumbnail Prompts (Midjourney / Fooocus / Google Flow)
    const thumbnailPrompts = [
      {
        name: 'Variant A: The Split Transformation (Recommended)',
        badgeText: 'FALSE F-RANK',
        badgeColor: 'Crimson & Gold',
        composition: 'Split-Contrast (Left Weak Scavenger / Right Glowing Sovereign)',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Split-screen high contrast manhwa composition. Left half: Bruised and bloodied young male protagonist in ragged clothes kneeling in dark crimson dungeon shadows, clutching a cracked wooden spear with hopeless exhaustion. Right half: The same protagonist standing tall and majestic in a glowing midnight Singularity coat with glowing cerulean mana eyes, surrounded by floating geometric blue runes and a colossal defeated monster core in the background. Dark fantasy action manhwa webtoon art style, ultra-sharp ink linework, high contrast vibrant cel shading, volumetric epic lighting, 16:9 horizontal, textless manhwa artwork.`
      },
      {
        name: 'Variant B: The Gravity Snap & Proctor Shock',
        badgeText: 'SOVEREIGN AWAKENING',
        badgeColor: 'Electric Cyan',
        composition: 'Center Dynamic Action (Finger Snap & Floating Rubble)',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Dynamic center composition. Protagonist Caelen Vance floating in mid-air inside a colossal volcanic magma cavern, calmly snapping his fingers as glowing purple gravitational distortion rings freeze falling boulders and students in mid-air. In bottom foreground: Lord Vane and examiner Keith Morgan staring in utter shock and disbelief. Dark fantasy action manhwa art style, vibrant cel shading, high contrast, dramatic cinematic lighting, horizontal 16:9.`
      },
      {
        name: 'Variant C: The 10,000x System Interface (Junkie\'s Manhwa Style)',
        badgeText: '10000x EXP SYSTEM',
        badgeColor: 'Holographic Blue',
        composition: 'System UI Overlay with Confident Protagonist',
        prompt: `YouTube video thumbnail art, 16:9 landscape aspect ratio. Cinematic wide-angle manhwa composition. Protagonist standing calmly in foreground with glowing cyan eyes, beside a floating translucent holographic status window displaying glowing golden RPG metrics and calculation velocity runes. In background: Towering dimensional portal and defeated dungeon boss. Dark fantasy action manhwa art style, ultra-sharp linework, vibrant anime lighting, horizontal 16:9.`
      }
    ]

    // 7. Tags string
    const tags = [
      'manhwa recap',
      'webtoon recap',
      'anime recap',
      'solo leveling',
      'manhwa',
      'webtoon',
      'overpowered mc',
      'manhwa with overpowered mc',
      'f rank to god rank',
      'system manhwa',
      'regression manhwa',
      'manhwa recap full',
      'best manhwa recap',
      'action manhwa recap',
      'leveling manhwa',
      'singularity protocol',
      'double f rank',
      'junkies manhwa',
      'manhwa cult',
      'dragon tea'
    ].join(', ')

    // 8. Pinned Comment
    const pinnedComment = `💬 Question for you guys: Would you have spared Lord Vane on that collapsing bridge, or eliminated him right away? Let me know in the comments below! 👇\n\n🔔 Episode 02: The Guild Inquest & Dimensional Incursion is already in production! Make sure to Subscribe and hit the bell icon so you don't miss the next upload!`

    return {
      success: true,
      franchiseId,
      episodeId,
      franchiseName: cleanFranchiseName,
      episodeName: cleanEpisodeName,
      totalDurationSeconds: totalDuration,
      formattedDuration: this.formatTimestamp(totalDuration),
      titles,
      chapters,
      description,
      chapterText,
      thumbnailPrompts,
      tags,
      pinnedComment
    }
  }
}
