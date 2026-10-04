import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { ActivityLogService } from './activityLogService.js'
import { VisualQaService } from './visualQaService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const franchisesDir = path.resolve(projectRoot, '01_Franchises')
const require = createRequire(import.meta.url)

export class ImageService {
  static statusState = {}

  static getStatus(franchiseId, episodeId) {
    const key = `${franchiseId}/${episodeId}`
    return this.statusState[key] || {
      status: 'idle',
      progress: 0,
      message: 'Ready to synthesize storyboard panels',
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

  static getImagesDir(franchiseId, episodeId) {
    return path.join(franchisesDir, franchiseId, episodeId, 'images')
  }

  /**
   * Resolves the best matching physical image file on disk for a given scene tag,
   * supporting underscores, non-underscores, zero-padding, lowercase, PNG, JPG, JPEG, and WEBP.
   */
  static resolveImageFilename(tag, existingFiles) {
    if (!tag || !Array.isArray(existingFiles) || existingFiles.length === 0) return null
    const numMatch = tag.match(/\d+/)
    if (!numMatch) return null
    const num = parseInt(numMatch[0], 10)
    const numStr = String(num)
    const padded = numStr.padStart(3, '0')
    const candidates = [
      `IMG_${padded}.jpg`,
      `IMG_${padded}.png`,
      `IMG_${padded}.jpeg`,
      `IMG_${padded}.webp`,
      `IMG${padded}.jpg`,
      `IMG${padded}.png`,
      `IMG${padded}.jpeg`,
      `IMG${padded}.webp`,
      `IMG_${numStr}.jpg`,
      `IMG_${numStr}.png`,
      `IMG${numStr}.jpg`,
      `IMG${numStr}.png`
    ]
    const existingLower = existingFiles.map(f => f.toLowerCase())
    for (const c of candidates) {
      const idx = existingLower.indexOf(c.toLowerCase())
      if (idx !== -1) return existingFiles[idx]
    }
    return null
  }

  static async getPromptMatrixScenes(franchiseId, episodeId) {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const promptMatrixPath = path.join(epPath, '02_Prompt_Matrix.md')
    const imagesDir = this.getImagesDir(franchiseId, episodeId)
    await fs.mkdir(imagesDir, { recursive: true })

    let content = ''
    try {
      content = await fs.readFile(promptMatrixPath, 'utf-8')
    } catch (e) {
      return []
    }

    let existingImages = []
    try {
      existingImages = await fs.readdir(imagesDir)
    } catch (e) {
      existingImages = []
    }

    const scenes = []
    let currentAct = 'General'

    // 1. Check for XML <scene id="..."> blocks
    const xmlMatches = [...content.matchAll(/<scene\s+id=["']?(IMG_?\d+)["']?>([\s\S]*?)<\/scene>/gi)]
    if (xmlMatches.length > 0) {
      for (const match of xmlMatches) {
        const rawId = match[1].replace(/_/g, '')
        const num = rawId.replace(/IMG/i, '').padStart(3, '0')
        const tag = `IMG_${num}`
        const prompt = match[2].trim()

        const matchedFilename = this.resolveImageFilename(tag, existingImages)
        const hasImage = Boolean(matchedFilename)
        const filename = matchedFilename || `${tag}.jpg`

        const descMatch = prompt.match(/^IMG\d+,\s*([^,\n]+)/i)
        const description = descMatch ? descMatch[1].trim() : `Scene ${num}`

        scenes.push({
          tag,
          filename,
          act: currentAct,
          description,
          prompt,
          hasImage,
          url: hasImage ? `/api/episodes/${franchiseId}/${episodeId}/images/${filename}` : null
        })
      }
      return scenes
    }

    // 2. Fallback to Markdown Table rows
    const lines = content.split('\n')
    for (const line of lines) {
      if (line.includes('---') || line.includes(':---') || line.toLowerCase().includes('scene tag')) continue

      const actMatch = line.match(/^##\s+(Act\s+\d+:[^(\n]+)/i)
      if (actMatch) {
        currentAct = actMatch[1].trim()
        continue
      }

      // Match 4-column table row: | `IMG_001` | Layout Tier / Description | Anchor | Full Prompt |
      const match4 = line.match(/^\|\s*`?\[?(IMG_?\d+)\]?`?\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*(.+?)\s*\|(?:\s*$)?/i)
      if (match4) {
        const rawTag = match4[1].trim().toUpperCase()
        const tag = rawTag.includes('_') ? rawTag : `IMG_${rawTag.replace(/IMG/i, '').padStart(3, '0')}`
        const layoutOrDesc = match4[2].trim()
        const anchor = match4[3].trim()
        const prompt = match4[4].trim()

        const matchedFilename = this.resolveImageFilename(tag, existingImages)
        const hasImage = Boolean(matchedFilename)
        const filename = matchedFilename || `${tag}.jpg`

        scenes.push({
          tag,
          filename,
          act: currentAct,
          description: `${layoutOrDesc} • ${anchor}`,
          prompt,
          hasImage,
          url: hasImage ? `/api/episodes/${franchiseId}/${episodeId}/images/${filename}` : null
        })
        continue
      }

      // Match 3-column table row: | `IMG_001` | Description | Full Prompt |
      const rowMatch = line.match(/^\|\s*`?\[?(IMG_?\d+)\]?`?\s*\|\s*([^|]+)\|\s*(.+?)\s*\|(?:\s*$)?/i)
      if (rowMatch) {
        const rawTag = rowMatch[1].trim().toUpperCase()
        const tag = rawTag.includes('_') ? rawTag : `IMG_${rawTag.replace(/IMG/i, '').padStart(3, '0')}`
        const description = rowMatch[2].trim()
        const prompt = rowMatch[3].trim()

        const matchedFilename = this.resolveImageFilename(tag, existingImages)
        const hasImage = Boolean(matchedFilename)
        const filename = matchedFilename || `${tag}.jpg`

        scenes.push({
          tag,
          filename,
          act: currentAct,
          description,
          prompt,
          hasImage,
          url: hasImage ? `/api/episodes/${franchiseId}/${episodeId}/images/${filename}` : null
        })
      }
    }

    return scenes
  }

  static async generateStoryboardStills(franchiseId, episodeId, options = {}) {
    const allScenes = await this.getPromptMatrixScenes(franchiseId, episodeId)
    const imagesDir = this.getImagesDir(franchiseId, episodeId)
    await fs.mkdir(imagesDir, { recursive: true })

    const batchSize = 24
    let scenes = allScenes
    let batchLabel = 'All'
    if (typeof options.batchIndex === 'number' && options.batchIndex >= 0) {
      const start = options.batchIndex * batchSize
      scenes = allScenes.slice(start, start + batchSize)
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
      batchLabel = `Batch ${letters[options.batchIndex] || options.batchIndex + 1}`
    }

    if (scenes.length === 0) {
      throw new Error(`No scenes found for storyboard generation (${batchLabel}).`)
    }

    this.updateStatus(franchiseId, episodeId, {
      status: 'running',
      progress: 5,
      message: `Initializing 1080p renderer for ${scenes.length} panels (${batchLabel})...`,
      log: [`Starting storyboard generation for ${scenes.length} panels (${batchLabel})...`]
    })

    const edgePaths = [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ]
    let browserExe = edgePaths.find(p => fsSync.existsSync(p))

    let browser
    try {
      const puppeteerCoreModule = await import('puppeteer-core')
      const puppeteerCore = puppeteerCoreModule.default || puppeteerCoreModule
      browser = await puppeteerCore.launch({
        executablePath: browserExe || undefined,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    } catch (err) {
      try {
        const puppeteerModule = await import('puppeteer')
        const puppeteer = puppeteerModule.default || puppeteerModule
        browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
      } catch (err2) {
        this.updateStatus(franchiseId, episodeId, {
          status: 'failed',
          message: `Browser launch failed: ${err.message}`,
          log: [`Error launching Puppeteer browser`]
        })
        throw new Error(`Puppeteer browser launch failed: ${err.message}`)
      }
    }

    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 })

    const generated = []

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i]
      const targetPath = path.join(imagesDir, scene.filename)
      
      // Non-destructive safeguard: Never overwrite existing high-fidelity artwork unless forced
      if (fsSync.existsSync(targetPath) && !options.force) {
        try {
          const stats = fsSync.statSync(targetPath)
          if (stats.size > 100000) {
            generated.push({ tag: scene.tag, filename: scene.filename, path: targetPath, preserved: true })
            this.updateStatus(franchiseId, episodeId, {
              status: 'running',
              progress: Math.round(10 + ((i + 1) / scenes.length) * 85),
              message: `Preserving high-fidelity panel ${i + 1} of ${scenes.length} ([${scene.tag}])...`,
              log: [`Preserved existing high-fidelity panel [${scene.tag}]: ${scene.filename}`]
            })
            continue
          }
        } catch (_) {}
      }

      this.updateStatus(franchiseId, episodeId, {
        status: 'running',
        progress: Math.round(10 + ((i + 1) / scenes.length) * 85),
        message: `Rendering panel ${i + 1} of ${scenes.length} ([${scene.tag}])...`,
        log: [`Rendering panel [${scene.tag}]: ${scene.description}`]
      })

      let accentColor = '#9333ea' // Purple
      let glowColor = 'rgba(147, 51, 234, 0.3)'
      if (scene.act.includes('Act 1')) {
        accentColor = '#e11d48' // Rose/Crimson
        glowColor = 'rgba(225, 29, 72, 0.3)'
      } else if (scene.act.includes('Act 2')) {
        accentColor = '#2563eb' // Blue
        glowColor = 'rgba(37, 99, 235, 0.3)'
      } else if (scene.act.includes('Act 3')) {
        accentColor = '#f59e0b' // Amber
        glowColor = 'rgba(245, 158, 11, 0.3)'
      } else if (scene.act.includes('Act 4')) {
        accentColor = '#10b981' // Emerald
        glowColor = 'rgba(16, 185, 129, 0.3)'
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              width: 1920px;
              height: 1080px;
              background-color: #030712;
              background-image: 
                radial-gradient(circle at 50% 30%, ${glowColor} 0%, transparent 60%),
                linear-gradient(to bottom, rgba(3, 7, 18, 0.6), #030712);
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              color: #f8fafc;
              position: relative;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 60px 80px;
            }
            body::before {
              content: '';
              position: absolute;
              inset: 0;
              background-size: 60px 60px;
              background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
              pointer-events: none;
            }
            .frame-corners {
              position: absolute;
              inset: 30px;
              border: 1px solid rgba(255, 255, 255, 0.08);
              pointer-events: none;
            }
            .corner {
              position: absolute;
              width: 30px;
              height: 30px;
              border: 3px solid ${accentColor};
            }
            .top-left { top: -2px; left: -2px; border-right: none; border-bottom: none; }
            .top-right { top: -2px; right: -2px; border-left: none; border-bottom: none; }
            .bottom-left { bottom: -2px; left: -2px; border-right: none; border-top: none; }
            .bottom-right { bottom: -2px; right: -2px; border-left: none; border-top: none; }

            .top-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              z-index: 10;
            }
            .franchise-badge {
              font-size: 16px;
              font-weight: 800;
              letter-spacing: 3px;
              text-transform: uppercase;
              color: #94a3b8;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .tag-badge {
              background: ${accentColor};
              color: #ffffff;
              font-family: monospace;
              font-weight: 900;
              font-size: 20px;
              padding: 6px 18px;
              border-radius: 8px;
              letter-spacing: 2px;
              box-shadow: 0 0 25px ${glowColor};
            }
            .act-pill {
              font-size: 14px;
              font-weight: 600;
              color: #cbd5e1;
              background: rgba(255, 255, 255, 0.05);
              padding: 6px 16px;
              border-radius: 20px;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .center-content {
              z-index: 10;
              max-width: 1400px;
            }
            .scene-title {
              font-size: 54px;
              font-weight: 900;
              line-height: 1.15;
              color: #ffffff;
              letter-spacing: -1px;
              text-shadow: 0 4px 20px rgba(0,0,0,0.8);
              margin-bottom: 24px;
            }
            .character-tag {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: rgba(15, 23, 42, 0.8);
              border: 1px solid rgba(255, 255, 255, 0.15);
              padding: 8px 18px;
              border-radius: 12px;
              font-size: 16px;
              color: #38bdf8;
              font-family: monospace;
              margin-bottom: 16px;
            }

            .bottom-bar {
              z-index: 10;
              background: rgba(15, 23, 42, 0.7);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 16px;
              padding: 24px 30px;
            }
            .prompt-label {
              font-size: 12px;
              font-family: monospace;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: ${accentColor};
              font-weight: 800;
              margin-bottom: 8px;
            }
            .prompt-text {
              font-family: monospace;
              font-size: 15px;
              color: #cbd5e1;
              line-height: 1.5;
              max-height: 70px;
              overflow: hidden;
            }

            .technical-meta {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 16px;
              padding-top: 12px;
              border-top: 1px solid rgba(255, 255, 255, 0.06);
              font-family: monospace;
              font-size: 12px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="frame-corners">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
          </div>

          <div class="top-bar">
            <div class="franchise-badge">
              <span>👑 ${franchiseId.replace(/_/g, ' ')}</span>
              <span>/</span>
              <span style="color: #cbd5e1;">${episodeId.replace(/_/g, ' ')}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
              <div class="act-pill">${scene.act}</div>
              <div class="tag-badge">[${scene.tag}]</div>
            </div>
          </div>

          <div class="center-content">
            <div class="character-tag">
              <span>⚡ ETHAN DRAKE</span>
              <span>•</span>
              <span style="color: #a855f7;">[SOVEREIGN PROTOCOL]</span>
            </div>
            <h1 class="scene-title">${scene.description}</h1>
          </div>

          <div class="bottom-bar">
            <div class="prompt-label">AI Visual Prompt Matrix Specification</div>
            <div class="prompt-text">${scene.prompt}</div>
            <div class="technical-meta">
              <span>ASPECT RATIO: 16:9 (1920x1080) // 30 FPS MASTER</span>
              <span>KEN BURNS MOTION: ACTIVE (ZOOM & PAN)</span>
              <span>SCALE SOVEREIGN PRODUCTION ENGINE v1.0</span>
            </div>
          </div>
        </body>
        </html>
      `

      await page.setContent(htmlContent, { waitUntil: 'load' })
      await page.screenshot({ path: targetPath, type: 'png' })
      generated.push({ tag: scene.tag, filename: scene.filename, path: targetPath })
    }

    await browser.close()

    this.updateStatus(franchiseId, episodeId, {
      status: 'completed',
      progress: 100,
      message: `Successfully synthesized all ${generated.length} storyboard panels!`,
      log: [`Storyboard generation complete: ${generated.length} panels rendered in 1080p.`]
    })

    ActivityLogService.success('visuals', 'Storyboard Panels Rendered', `Synthesized ${generated.length} fallback storyboard stills in 1080p.`, { count: generated.length }, franchiseId, episodeId)

    return {
      success: true,
      count: generated.length,
      files: generated
    }
  }

  static async extractAndIngestZip(franchiseId, episodeId, zipBase64, originalFilename = 'batch.zip', targetBatchIndex = null) {
    const imagesDir = this.getImagesDir(franchiseId, episodeId)
    await fs.mkdir(imagesDir, { recursive: true })

    const cleanBase64 = zipBase64.replace(/^data:application\/[\w.-]+;base64,/, '').replace(/^data:application\/zip;base64,/, '').replace(/^data:application\/x-zip-compressed;base64,/, '')
    const buffer = Buffer.from(cleanBase64, 'base64')

    const AdmZipModule = await import('adm-zip')
    const AdmZip = AdmZipModule.default || AdmZipModule
    const zip = new AdmZip(buffer)
    const zipEntries = zip.getEntries()

    // Filter valid image files, ignore OS meta / hidden files
    const imageEntries = zipEntries.filter(entry => {
      if (entry.isDirectory) return false
      const name = entry.entryName.toLowerCase()
      if (name.includes('__macosx') || name.startsWith('.') || path.basename(name).startsWith('.')) return false
      return /\.(png|jpe?g|webp)$/i.test(name)
    })

    if (imageEntries.length === 0) {
      ActivityLogService.warn('visuals', 'ZIP Archive Empty', `No valid image files found in ${originalFilename}.`, { filename: originalFilename }, franchiseId, episodeId)
      throw new Error('No valid image files (PNG, JPG, WEBP) found inside ZIP archive.')
    }

    // Sort entries naturally
    imageEntries.sort((a, b) => a.entryName.localeCompare(b.entryName, undefined, { numeric: true, sensitivity: 'base' }))

    const extracted = []
    const allScenes = await this.getPromptMatrixScenes(franchiseId, episodeId)
    const batchSize = 24
    let candidateScenes = allScenes
    if (typeof targetBatchIndex === 'number' && targetBatchIndex >= 0) {
      candidateScenes = allScenes.slice(targetBatchIndex * batchSize, (targetBatchIndex + 1) * batchSize)
    }

    const filesToMap = imageEntries.map((entry, idx) => ({
      id: `entry_${idx}`,
      name: path.basename(entry.entryName),
      getData: () => entry.getData()
    }))

    const mappings = this.matchImagesToScenes(filesToMap, candidateScenes)

    const backupDir = path.join(imagesDir, '..', 'images_original_backup')
    await fs.mkdir(backupDir, { recursive: true })

    for (const m of mappings) {
      const targetTag = m.scene.tag
      const targetPath = path.join(imagesDir, `${targetTag}.jpg`)
      const data = m.file.getData()
      await fs.writeFile(targetPath, data)

      // If a placeholder PNG exists for this tag, remove it so it doesn't mask the high-fidelity JPG
      const pngPath = path.join(imagesDir, `${targetTag}.png`)
      try {
        if (fsSync.existsSync(pngPath)) {
          await fs.unlink(pngPath)
        }
      } catch (_) {}

      // Automatically verify and sanitize image against Studio Quality / Anti-Clutter Criteria
      let qaReport = null
      try {
        qaReport = await VisualQaService.verifyImage(targetPath, { autoFix: true, backupDir })
      } catch (err) {
        console.warn(`[VisualQA] Verification error on ${targetTag}:`, err.message)
      }

      extracted.push({
        tag: targetTag,
        sourceName: m.file.name,
        savedAs: `${targetTag}.jpg`,
        score: m.score,
        matchSlug: m.slug,
        qa: qaReport
      })
    }

    ActivityLogService.success('visuals', 'ZIP Archive Ingested & QA Verified', `Unpacked, mapped & visual-QA audited ${extracted.length} scene images from "${originalFilename}".`, { count: extracted.length, archiveName: originalFilename }, franchiseId, episodeId)

    return {
      success: true,
      archiveName: originalFilename,
      count: extracted.length,
      extracted
    }
  }

  static cleanSlug(filename) {
    return filename
      .replace(/_\d{10,18}(?:_\d+)?\.(jpe?g|png|webp)$/i, '')
      .replace(/\.(jpe?g|png|webp)$/i, '')
      .toLowerCase()
      .replace(/[._-]/g, ' ')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
  }

  static matchImagesToScenes(imageFiles, scenes) {
    const scoredPairs = []
    imageFiles.forEach(file => {
      const slug = this.cleanSlug(file.name)
      const slugTokens = slug.split(/\s+/).filter(w => w.length > 2)

      // 1. Direct tag match (IMG_001, IMG001)
      const directMatch = file.name.match(/IMG_?0*(\d+)/i)
      if (directMatch) {
        const num = parseInt(directMatch[1], 10)
        const targetTag = `IMG_${String(num).padStart(3, '0')}`
        const matchedScene = scenes.find(s => s.tag === targetTag)
        if (matchedScene) {
          scoredPairs.push({ file, scene: matchedScene, score: 10000, slug })
          return
        }
      }

      // 2. Semantic n-gram and substring matching
      scenes.forEach(scene => {
        let score = 0
        const promptLower = (scene.prompt || '').toLowerCase()
        const descLower = (scene.description || '').toLowerCase()

        // Full slug match against prompt or description
        if (slug.length >= 8 && (promptLower.includes(slug) || descLower.includes(slug))) {
          score += 500 + slug.length * 5
        }

        // 3-word n-grams
        if (slugTokens.length >= 3) {
          for (let i = 0; i <= slugTokens.length - 3; i++) {
            const trigram = slugTokens.slice(i, i + 3).join(' ')
            if (promptLower.includes(trigram) || descLower.includes(trigram)) score += 50
          }
        }

        // 2-word n-grams
        if (slugTokens.length >= 2) {
          for (let i = 0; i <= slugTokens.length - 2; i++) {
            const bigram = slugTokens.slice(i, i + 2).join(' ')
            if (promptLower.includes(bigram) || descLower.includes(bigram)) score += 20
          }
        }

        // Individual significant tokens (filter generic stop words)
        const stopWords = ['man', 'woman', 'student', 'the', 'and', 'with', 'scene', 'top', 'bottom', 'block', 'shot', 'view']
        slugTokens.forEach(t => {
          if (stopWords.includes(t)) return
          if (promptLower.includes(t) || descLower.includes(t)) {
            score += 6
            // Extra bonus if token appears near the start of the prompt
            if (promptLower.indexOf(t) >= 0 && promptLower.indexOf(t) < 100) score += 8
          }
        })

        if (score > 0) {
          scoredPairs.push({ file, scene, score, slug })
        }
      })
    })

    scoredPairs.sort((a, b) => b.score - a.score)

    const assignedFiles = new Set()
    const assignedScenes = new Set()
    const finalMapping = []

    for (const pair of scoredPairs) {
      if (!assignedFiles.has(pair.file.id) && !assignedScenes.has(pair.scene.tag) && pair.score > 0) {
        assignedFiles.add(pair.file.id)
        assignedScenes.add(pair.scene.tag)
        finalMapping.push({
          file: pair.file,
          scene: pair.scene,
          score: pair.score,
          slug: pair.slug
        })
      }
    }

    // Fallback sequential assignment for unassigned
    const unassignedFiles = imageFiles.filter(f => !assignedFiles.has(f.id))
    const unassignedScenes = scenes.filter(s => !assignedScenes.has(s.tag))

    unassignedFiles.forEach((file, idx) => {
      const scene = unassignedScenes[idx]
      if (scene) {
        finalMapping.push({
          file,
          scene,
          score: 0,
          slug: this.cleanSlug(file.name)
        })
      }
    })

    finalMapping.sort((a, b) => a.scene.tag.localeCompare(b.scene.tag))
    return finalMapping
  }

  /**
   * Validates visual scene alignment, tag continuity, multi-panel tier compliance,
   * high-fidelity artwork status, and narration audio sync across all scenes and batches.
   */
  static async validateVisualAlignment(franchiseId, episodeId, options = {}) {
    const epPath = path.join(franchisesDir, franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    const imagesDir = this.getImagesDir(franchiseId, episodeId)
    const audioDir = path.join(epPath, 'audio')
    const ttsManifestPath = path.join(audioDir, 'tts_manifest.json')
    await fs.mkdir(imagesDir, { recursive: true })

    const scenes = await this.getPromptMatrixScenes(franchiseId, episodeId)
    let scriptContent = ''
    try {
      scriptContent = await fs.readFile(scriptPath, 'utf-8')
    } catch (_) {}

    let ttsManifest = null
    try {
      if (fsSync.existsSync(ttsManifestPath)) {
        ttsManifest = JSON.parse(await fs.readFile(ttsManifestPath, 'utf-8'))
      }
    } catch (_) {}

    let existingImageFiles = []
    try {
      existingImageFiles = await fs.readdir(imagesDir)
    } catch (_) {}

    // Extract tags present in script
    const scriptTagMatches = [...scriptContent.matchAll(/\[(IMG_\d+)\]/gi)]
    const scriptTags = new Set(scriptTagMatches.map(m => m[1].toUpperCase()))

    // TTS aligned tags
    const ttsTags = new Set()
    if (ttsManifest && Array.isArray(ttsManifest.scenes)) {
      ttsManifest.scenes.forEach(s => {
        if (s.tag) ttsTags.add(s.tag.toUpperCase())
      })
    }

    const sceneAudits = []
    const anomalies = []
    let highFidelityCount = 0
    let placeholderCount = 0
    let missingCount = 0

    // Inspect each prompt matrix scene
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i]
      const tag = scene.tag.toUpperCase()
      const inScript = scriptTags.has(tag)
      const inTts = ttsTags.size > 0 ? ttsTags.has(tag) : null

      // Check physical files on disk
      const foundFile = this.resolveImageFilename(tag, existingImageFiles)
      let fileSize = 0
      let fileExt = null
      let isHighFidelity = false

      if (foundFile) {
        const full = path.join(imagesDir, foundFile)
        try {
          const stat = fsSync.statSync(full)
          if (stat.size > 0) {
            fileSize = stat.size
            fileExt = path.extname(foundFile).replace('.', '').toLowerCase()
            // > 60KB typically indicates authentic high-fidelity raster artwork vs lightweight storyboard SVG/placeholder
            isHighFidelity = stat.size >= 60000
          }
        } catch (_) {}
      }

      // Identify Tier Archetype
      const promptLower = (scene.prompt || '').toLowerCase()
      let tier = 'Tier A: Hero Plate'
      let tierCode = 'hero'
      if (promptLower.includes('three-panel') || promptLower.includes('3-panel') || promptLower.includes('four-panel') || promptLower.includes('multi-panel')) {
        tier = 'Tier C: Multi-Panel Strip'
        tierCode = 'multi'
      } else if (promptLower.includes('dual-panel') || promptLower.includes('2-panel') || promptLower.includes('two-panel') || promptLower.includes('top block')) {
        tier = 'Tier B: Dual-Panel Strip'
        tierCode = 'dual'
      }

      let status = 'ready'
      if (!foundFile) {
        status = 'missing'
        missingCount++
        anomalies.push({
          type: 'missing_asset',
          tag,
          severity: 'warning',
          message: `Scene [${tag}] has no physical image asset in images/ folder.`
        })
      } else if (isHighFidelity) {
        highFidelityCount++
      } else {
        placeholderCount++
      }

      if (!inScript && scriptContent.length > 0) {
        anomalies.push({
          type: 'script_mismatch',
          tag,
          severity: 'info',
          message: `Tag [${tag}] is present in Prompt Matrix but not referenced in 01_Episode_Script.md.`
        })
      }

      sceneAudits.push({
        index: i,
        tag,
        description: scene.description,
        act: scene.act,
        prompt: scene.prompt,
        hasImage: Boolean(foundFile),
        filename: foundFile,
        url: foundFile ? `/api/episodes/${franchiseId}/${episodeId}/images/${foundFile}` : null,
        fileSize,
        fileSizeFormatted: fileSize ? `${Math.round(fileSize / 1024)} KB` : '0 KB',
        fileExt,
        isHighFidelity,
        tier,
        tierCode,
        inScript,
        inTts,
        status
      })
    }

    // Sequence continuity check: detect gaps in numeric tags
    for (let i = 0; i < sceneAudits.length - 1; i++) {
      const curNum = parseInt(sceneAudits[i].tag.replace('IMG_', ''), 10)
      const nextNum = parseInt(sceneAudits[i + 1].tag.replace('IMG_', ''), 10)
      if (nextNum !== curNum + 1) {
        anomalies.push({
          type: 'sequence_gap',
          tag: sceneAudits[i].tag,
          severity: 'error',
          message: `Sequence gap detected between ${sceneAudits[i].tag} and ${sceneAudits[i + 1].tag}.`
        })
      }
    }

    // Check for truly orphaned images in imagesDir not mapped to any known scene tag or scene index
    const attachedFilenames = new Set(sceneAudits.map(s => s.filename).filter(Boolean))
    const maxSceneNum = scenes.length
    const orphanedFiles = existingImageFiles.filter(f => {
      if (f.startsWith('.')) return false
      // If it is the attached file for a scene, not orphaned
      if (attachedFilenames.has(f)) return false

      // Check if it corresponds to an alias/duplicate of a known scene in the episode (1..maxSceneNum)
      const numMatch = f.match(/IMG_?0*(\d+)/i)
      if (numMatch) {
        const num = parseInt(numMatch[1], 10)
        if (num >= 1 && num <= maxSceneNum) {
          // File is an alias/duplicate of a valid scene in the episode, not an unknown orphan
          return false
        }
      }

      // Truly unmapped file
      return true
    })

    if (orphanedFiles.length > 0) {
      anomalies.push({
        type: 'orphaned_files',
        count: orphanedFiles.length,
        files: orphanedFiles,
        severity: 'info',
        message: `Found ${orphanedFiles.length} unattached or extra image file(s) in images/ folder.`
      })
    }

    // Partition into 24-scene batches
    const chunkSize = 24
    const totalScenes = sceneAudits.length
    const batchCount = Math.ceil(totalScenes / chunkSize)
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const batches = []

    for (let b = 0; b < batchCount; b++) {
      const start = b * chunkSize
      const end = Math.min(start + chunkSize, totalScenes)
      const batchScenes = sceneAudits.slice(start, end)
      const attached = batchScenes.filter(s => s.hasImage).length
      const highFid = batchScenes.filter(s => s.isHighFidelity).length
      const missingTags = batchScenes.filter(s => !s.hasImage).map(s => s.tag)
      const letter = letters[b] || `Batch_${b + 1}`

      batches.push({
        index: b,
        letter,
        name: `Batch ${letter}`,
        label: `Batch ${letter}: Scenes ${String(start + 1).padStart(3, '0')}–${String(end).padStart(3, '0')}`,
        startTag: batchScenes[0]?.tag || `IMG_${String(start + 1).padStart(3, '0')}`,
        endTag: batchScenes[batchScenes.length - 1]?.tag || `IMG_${String(end).padStart(3, '0')}`,
        total: batchScenes.length,
        attached,
        missing: batchScenes.length - attached,
        highFidelityCount: highFid,
        isFullyReady: attached === batchScenes.length && batchScenes.length > 0,
        isProductionReady: highFid === batchScenes.length && batchScenes.length > 0,
        progressPercent: batchScenes.length ? Math.round((attached / batchScenes.length) * 100) : 0,
        missingTags,
        scenes: batchScenes
      })
    }

    const totalAttached = sceneAudits.filter(s => s.hasImage).length
    const alignmentScore = totalScenes > 0 ? Math.round((totalAttached / totalScenes) * 100) : 0
    const isFullyAligned = totalAttached === totalScenes && totalScenes > 0

    return {
      success: true,
      franchiseId,
      episodeId,
      timestamp: new Date().toISOString(),
      totalScenes,
      attachedCount: totalAttached,
      missingCount: totalScenes - totalAttached,
      highFidelityCount,
      placeholderCount,
      alignmentScore,
      isFullyAligned,
      isAntiSlopVisualCertified: isFullyAligned && highFidelityCount === totalScenes,
      batches,
      anomalies,
      orphanedFiles
    }
  }

  /**
   * Stitches two individual panels (top and bottom) into a seamless 9:16 vertical manhwa strip.
   * Eliminates multi-panel AI diffusion anatomy bleeding.
   */
  static async stitchMultiPanel({ topBufferOrPath, bottomBufferOrPath, outputPath, gutterHeight = 8, gutterColor = '#0b0f19' }) {
    const sharp = (await import('sharp')).default
    const CANVAS_W = 1080
    const CANVAS_H = 1920
    const panelH = Math.floor((CANVAS_H - gutterHeight) / 2)

    const topProcessed = await sharp(topBufferOrPath)
      .resize(CANVAS_W, panelH, { fit: 'cover', position: 'center' })
      .toBuffer()

    const bottomProcessed = await sharp(bottomBufferOrPath)
      .resize(CANVAS_W, panelH, { fit: 'cover', position: 'center' })
      .toBuffer()

    const gutterSvg = Buffer.from(
      `<svg width="${CANVAS_W}" height="${gutterHeight}"><rect width="${CANVAS_W}" height="${gutterHeight}" fill="${gutterColor}"/></svg>`
    )

    await sharp({
      create: {
        width: CANVAS_W,
        height: CANVAS_H,
        channels: 4,
        background: gutterColor
      }
    })
      .composite([
        { input: topProcessed, top: 0, left: 0 },
        { input: gutterSvg, top: panelH, left: 0 },
        { input: bottomProcessed, top: panelH + gutterHeight, left: 0 }
      ])
      .jpeg({ quality: 95 })
      .toFile(outputPath)

    return outputPath
  }

  static getImagePath(franchiseId, episodeId, filename) {
    return path.join(this.getImagesDir(franchiseId, episodeId), filename)
  }
}
