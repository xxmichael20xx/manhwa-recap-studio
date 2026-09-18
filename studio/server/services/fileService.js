import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { AntiSlopValidator } from './antiSlopValidator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const franchisesDir = path.resolve(projectRoot, '01_Franchises')
const engineDir = path.resolve(projectRoot, '00_Engine')

export class FileService {
  static async getFranchises() {
    try {
      const entries = await fs.readdir(franchisesDir, { withFileTypes: true })
      const franchises = []

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const franchisePath = path.join(franchisesDir, entry.name)
          const episodes = []
          let seriesBibleContent = ''
          let characterAnchor = ''

          // Check Series Bible
          const biblePath = path.join(franchisePath, '00_Series_Bible_and_Character_DNA', 'Series_Bible.md')
          try {
            seriesBibleContent = await fs.readFile(biblePath, 'utf-8')
            const anchorMatch = seriesBibleContent.match(/Prompt Anchor:\*{0,2}\s*`?([^`\r\n]+)`?/)
            if (anchorMatch) characterAnchor = anchorMatch[1].replace(/`|\*/g, '').trim()
          } catch (e) {
            // Bible might not exist yet
          }

          // Read Episodes
          const subEntries = await fs.readdir(franchisePath, { withFileTypes: true })
          for (const sub of subEntries) {
            if (sub.isDirectory() && sub.name.startsWith('EP')) {
              const epPath = path.join(franchisePath, sub.name)
              let scriptContent = ''
              let promptMatrixContent = ''
              let audioCount = 0

              try {
                scriptContent = await fs.readFile(path.join(epPath, '01_Episode_Script.md'), 'utf-8')
              } catch (e) {}

              try {
                promptMatrixContent = await fs.readFile(path.join(epPath, '02_Prompt_Matrix.md'), 'utf-8')
              } catch (e) {}

              try {
                const audioFiles = await fs.readdir(path.join(epPath, 'audio'))
                audioCount = audioFiles.filter(f => f.endsWith('.mp3') || f.endsWith('.wav')).length
              } catch (e) {}

              const audit = scriptContent ? AntiSlopValidator.auditScript(scriptContent) : null

              episodes.push({
                id: sub.name,
                name: sub.name.replace(/_/g, ' '),
                hasScript: !!scriptContent,
                hasPrompts: !!promptMatrixContent,
                audioCount,
                audit
              })
            }
          }

          franchises.push({
            id: entry.name,
            name: entry.name.replace(/^Series_\d+_/, '').replace(/_/g, ' '),
            folder: entry.name,
            characterAnchor,
            bibleContent: seriesBibleContent,
            episodes: episodes.sort((a, b) => a.id.localeCompare(b.id))
          })
        }
      }

      return franchises
    } catch (error) {
      console.error('Error reading franchises:', error)
      return []
    }
  }

  static async getEpisode(franchiseId, episodeId) {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    const promptPath = path.join(epPath, '02_Prompt_Matrix.md')
    const audioDir = path.join(epPath, 'audio')

    let script = ''
    let promptMatrix = ''
    let audioFiles = []

    try {
      script = await fs.readFile(scriptPath, 'utf-8')
    } catch (e) {}

    try {
      promptMatrix = await fs.readFile(promptPath, 'utf-8')
    } catch (e) {}

    try {
      const files = await fs.readdir(audioDir)
      audioFiles = files.filter(f => f.endsWith('.mp3') || f.endsWith('.wav'))
    } catch (e) {}

    const audit = script ? AntiSlopValidator.auditScript(script) : null

    return {
      franchiseId,
      episodeId,
      script,
      promptMatrix,
      audioFiles,
      audit
    }
  }

  static async getHistoryDir(franchiseId, episodeId) {
    const historyDir = path.join(franchisesDir, franchiseId, episodeId, '.history')
    await fs.mkdir(historyDir, { recursive: true })
    return historyDir
  }

  static async getScriptHistory(franchiseId, episodeId) {
    const historyDir = await this.getHistoryDir(franchiseId, episodeId)
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')

    let files = []
    try {
      files = await fs.readdir(historyDir)
    } catch (e) {
      files = []
    }

    // If no history exists yet, but current script exists, create an initial baseline snapshot
    if (files.filter(f => f.endsWith('.md')).length === 0) {
      try {
        const currentScript = await fs.readFile(scriptPath, 'utf-8')
        if (currentScript && currentScript.trim()) {
          const initialTimestamp = new Date().toISOString()
          const initialFile = `snapshot_${Date.now()}_initial.md`
          const contentWithMeta = `<!-- metadata: {"label": "Initial Baseline", "timestamp": "${initialTimestamp}"} -->\n${currentScript}`
          await fs.writeFile(path.join(historyDir, initialFile), contentWithMeta, 'utf-8')
          files = [initialFile]
        }
      } catch (e) {}
    }

    const mdFiles = files.filter(f => f.endsWith('.md'))
    const history = []

    for (const file of mdFiles) {
      const filePath = path.join(historyDir, file)
      try {
        const raw = await fs.readFile(filePath, 'utf-8')
        const stat = await fs.stat(filePath)
        
        let label = 'Snapshot'
        let timestamp = stat.mtime.toISOString()
        let cleanScript = raw

        // Extract metadata header if present
        const metaMatch = raw.match(/^<!--\s*metadata:\s*({.*?})\s*-->\r?\n?/)
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1])
            if (meta.label) label = meta.label
            if (meta.timestamp) timestamp = meta.timestamp
          } catch (err) {}
          cleanScript = raw.slice(metaMatch[0].length)
        }

        const audit = AntiSlopValidator.auditScript(cleanScript)

        history.push({
          filename: file,
          label,
          timestamp,
          wordCount: audit.wordCount,
          estimatedMinutes: audit.estimatedMinutes,
          overallScore: audit.overallScore,
          isAntiSlopCertified: audit.isAntiSlopCertified,
          scriptPreview: cleanScript.slice(0, 300) + (cleanScript.length > 300 ? '...' : '')
        })
      } catch (e) {
        console.error(`Error reading snapshot ${file}:`, e)
      }
    }

    // Sort descending by timestamp
    history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return history
  }

  static async createScriptSnapshot(franchiseId, episodeId, scriptContent, label = 'Manual Checkpoint') {
    const historyDir = await this.getHistoryDir(franchiseId, episodeId)
    const timestamp = new Date().toISOString()
    const safeLabel = label.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim() || 'Snapshot'
    const filename = `snapshot_${Date.now()}_${safeLabel.replace(/\s+/g, '_').toLowerCase()}.md`
    const contentWithMeta = `<!-- metadata: {"label": "${safeLabel}", "timestamp": "${timestamp}"} -->\n${scriptContent}`
    
    await fs.writeFile(path.join(historyDir, filename), contentWithMeta, 'utf-8')
    const audit = AntiSlopValidator.auditScript(scriptContent)

    return {
      success: true,
      snapshot: {
        filename,
        label: safeLabel,
        timestamp,
        wordCount: audit.wordCount,
        estimatedMinutes: audit.estimatedMinutes,
        overallScore: audit.overallScore,
        isAntiSlopCertified: audit.isAntiSlopCertified
      }
    }
  }

  static async restoreScriptSnapshot(franchiseId, episodeId, filename) {
    const historyDir = await this.getHistoryDir(franchiseId, episodeId)
    const snapshotPath = path.join(historyDir, filename)
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')

    // Read the snapshot
    const raw = await fs.readFile(snapshotPath, 'utf-8')
    let cleanScript = raw
    const metaMatch = raw.match(/^<!--\s*metadata:\s*({.*?})\s*-->\r?\n?/)
    if (metaMatch) {
      cleanScript = raw.slice(metaMatch[0].length)
    }

    // Read current live script to create an automatic safety backup before overwriting
    try {
      const currentScript = await fs.readFile(scriptPath, 'utf-8')
      if (currentScript.trim() && currentScript.trim() !== cleanScript.trim()) {
        const backupTimestamp = new Date().toISOString()
        const backupFilename = `snapshot_${Date.now()}_pre_restore_backup.md`
        const backupContent = `<!-- metadata: {"label": "Auto-Backup Before Restoring ${filename}", "timestamp": "${backupTimestamp}"} -->\n${currentScript}`
        await fs.writeFile(path.join(historyDir, backupFilename), backupContent, 'utf-8')
      }
    } catch (e) {}

    // Overwrite live script
    await fs.writeFile(scriptPath, cleanScript, 'utf-8')
    const audit = AntiSlopValidator.auditScript(cleanScript)

    return {
      success: true,
      script: cleanScript,
      audit,
      restoredFrom: filename
    }
  }

  static async saveScript(franchiseId, episodeId, scriptContent, label = 'Auto-Save') {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    await fs.mkdir(epPath, { recursive: true })
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    await fs.writeFile(scriptPath, scriptContent, 'utf-8')

    // Automatically create a snapshot on every save
    try {
      await this.createScriptSnapshot(franchiseId, episodeId, scriptContent, label || 'Auto-Save')
    } catch (e) {
      console.error('Snapshot creation failed during save:', e)
    }

    const audit = AntiSlopValidator.auditScript(scriptContent)
    return { success: true, audit }
  }

  static async generatePromptMatrix(franchiseId, episodeId, characterAnchor = '') {
    const epData = await this.getEpisode(franchiseId, episodeId)
    if (!epData.script) throw new Error('Episode script not found.')

    // Extract scenes and prompts from script
    const sceneRegex = /### Scene \d+: ([^\n]+) \(([^\)]+)\)[\s\S]*?(?:Prompt Tag:\s*([^\n]+)|Visual Prompt \[([^\]]+)\]:\s*([^\n]+))[\s\S]*?Voiceover:\s*([\s\S]*?)(?=(?:### Scene|\Z|## 🎙️ Act))/g
    
    // Fallback simple line-by-line extractor for prompt tags
    const promptMatches = [...epData.script.matchAll(/Visual Prompt \[([^\]]+)\]:\s*\`?([^\`\n]+)\`?/g)]
    
    let markdownTable = `# 🖼️ Episode Visual Prompt Matrix\n## Franchise: ${franchiseId.replace(/_/g, ' ')} | Episode: ${episodeId}\n\n`
    markdownTable += `> **Character Anchor:** \`${characterAnchor || 'Ethan Drake --cref [CHARACTER_URL] --cw 80'}\`\n\n`
    markdownTable += `| Tag | Midjourney / Fooocus Prompt String |\n| :--- | :--- |\n`

    if (promptMatches.length > 0) {
      for (const match of promptMatches) {
        const tag = `[${match[1]}]`
        const promptText = match[2].trim()
        markdownTable += `| \`${tag}\` | \`${promptText}\` |\n`
      }
    } else {
      // Auto-generate placeholder prompts based on acts
      markdownTable += `| \`[IMG_001]\` | \`manhwa webtoon style, high action webcomic panel, cinematic composition --ar 16:9 --style raw\` |\n`
    }

    const promptPath = path.join(franchisesDir, franchiseId, episodeId, '02_Prompt_Matrix.md')
    await fs.writeFile(promptPath, markdownTable, 'utf-8')

    return { success: true, promptMatrix: markdownTable }
  }

  static async getEngineDocuments() {
    try {
      const files = await fs.readdir(engineDir)
      const docs = []
      for (const file of files) {
        if (file.endsWith('.md')) {
          const content = await fs.readFile(path.join(engineDir, file), 'utf-8')
          docs.push({
            filename: file,
            title: file.replace(/^\d+_/, '').replace(/\.md$/, '').replace(/_/g, ' '),
            content
          })
        }
      }
      return docs
    } catch (e) {
      return []
    }
  }
}
