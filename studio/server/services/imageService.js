import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

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

    const lines = content.split('\n')
    const scenes = []
    let currentAct = 'General'

    for (const line of lines) {
      const actMatch = line.match(/^##\s+(Act\s+\d+:[^(\n]+)/i)
      if (actMatch) {
        currentAct = actMatch[1].trim()
        continue
      }

      // Match table row: | `[IMG_001]` | Description | Full Prompt |
      const rowMatch = line.match(/^\|\s*`?\[?(IMG_\d+)\]?`?\s*\|\s*([^|]+)\|\s*([^|]+)\|/i)
      if (rowMatch) {
        const tag = rowMatch[1].trim().toUpperCase()
        const description = rowMatch[2].trim()
        const prompt = rowMatch[3].trim()

        const filename = `${tag}.png`
        const hasImage = existingImages.includes(filename)

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

  static async generateStoryboardStills(franchiseId, episodeId) {
    const scenes = await this.getPromptMatrixScenes(franchiseId, episodeId)
    const imagesDir = this.getImagesDir(franchiseId, episodeId)
    await fs.mkdir(imagesDir, { recursive: true })

    this.updateStatus(franchiseId, episodeId, {
      status: 'running',
      progress: 5,
      message: `Initializing Puppeteer renderer for ${scenes.length} panels...`,
      log: [`Starting storyboard generation for ${scenes.length} panels...`]
    })

    let puppeteer
    try {
      puppeteer = require('C:/Users/MIchaelangelo/.gemini/antigravity/scratch/node_modules/puppeteer')
    } catch (err) {
      this.updateStatus(franchiseId, episodeId, {
        status: 'failed',
        message: `Puppeteer could not be loaded: ${err.message}`,
        log: [`Error: Puppeteer could not be loaded`]
      })
      throw new Error(`Puppeteer could not be loaded: ${err.message}`)
    }

    let browser
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    } catch (err) {
      this.updateStatus(franchiseId, episodeId, {
        status: 'failed',
        message: `Browser launch failed: ${err.message}`,
        log: [`Error launching Puppeteer browser`]
      })
      throw err
    }

    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 })

    const generated = []

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i]
      const targetPath = path.join(imagesDir, scene.filename)
      
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

    return {
      success: true,
      count: generated.length,
      files: generated
    }
  }

  static getImagePath(franchiseId, episodeId, filename) {
    return path.join(this.getImagesDir(franchiseId, episodeId), filename)
  }
}
