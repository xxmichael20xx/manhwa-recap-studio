import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const tmpDir = path.resolve(projectRoot, '.tmp')
const logFilePath = path.join(tmpDir, 'studio_activity_log.json')

export class ActivityLogService {
  static logs = []
  static maxLogs = 1000
  static initialized = false

  static async init() {
    if (this.initialized) return
    try {
      if (!fsSync.existsSync(tmpDir)) {
        fsSync.mkdirSync(tmpDir, { recursive: true })
      }
      if (fsSync.existsSync(logFilePath)) {
        const data = JSON.parse(await fs.readFile(logFilePath, 'utf-8'))
        if (Array.isArray(data)) {
          this.logs = data.slice(0, this.maxLogs)
        }
      }
    } catch (err) {
      console.warn('Could not load existing activity logs:', err.message)
      this.logs = []
    }
    this.initialized = true

    // Initial system boot log
    if (this.logs.length === 0) {
      this.info('system', 'Studio Engine Initialized', 'Manhwa Recap Studio backend started successfully.')
    }
  }

  static async persist() {
    try {
      if (!fsSync.existsSync(tmpDir)) {
        await fs.mkdir(tmpDir, { recursive: true })
      }
      await fs.writeFile(logFilePath, JSON.stringify(this.logs.slice(0, 500), null, 2), 'utf-8')
    } catch (e) {
      console.warn('Failed to persist activity log to disk:', e.message)
    }
  }

  static log({ category = 'system', level = 'info', title = '', message = '', metadata = null, franchiseId = null, episodeId = null }) {
    const id = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const now = new Date()

    const entry = {
      id,
      timestamp: now.toISOString(),
      timeFormatted: now.toLocaleTimeString(),
      category, // visuals | audio | video | prompt_matrix | script | system | api
      level,    // info | success | warn | error
      title: title || 'Studio Event',
      message: message || '',
      metadata: metadata || {},
      franchiseId,
      episodeId
    }

    this.logs.unshift(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Async background persist (non-blocking)
    this.persist()
    return entry
  }

  static info(category, title, message = '', metadata = {}, franchiseId = null, episodeId = null) {
    return this.log({ category, level: 'info', title, message, metadata, franchiseId, episodeId })
  }

  static success(category, title, message = '', metadata = {}, franchiseId = null, episodeId = null) {
    return this.log({ category, level: 'success', title, message, metadata, franchiseId, episodeId })
  }

  static warn(category, title, message = '', metadata = {}, franchiseId = null, episodeId = null) {
    return this.log({ category, level: 'warn', title, message, metadata, franchiseId, episodeId })
  }

  static error(category, title, message = '', metadata = {}, franchiseId = null, episodeId = null) {
    return this.log({ category, level: 'error', title, message, metadata, franchiseId, episodeId })
  }

  static getLogs({ category = 'all', level = 'all', search = '', limit = 200 } = {}) {
    let filtered = [...this.logs]

    if (category && category !== 'all') {
      filtered = filtered.filter(l => l.category.toLowerCase() === category.toLowerCase())
    }

    if (level && level !== 'all') {
      filtered = filtered.filter(l => l.level.toLowerCase() === level.toLowerCase())
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.message.toLowerCase().includes(q) || 
        l.category.toLowerCase().includes(q) ||
        (l.franchiseId && l.franchiseId.toLowerCase().includes(q)) ||
        (l.episodeId && l.episodeId.toLowerCase().includes(q))
      )
    }

    // Telemetry Statistics
    const stats = {
      total: this.logs.length,
      visuals: this.logs.filter(l => l.category === 'visuals').length,
      audio: this.logs.filter(l => l.category === 'audio').length,
      video: this.logs.filter(l => l.category === 'video').length,
      prompts: this.logs.filter(l => l.category === 'prompt_matrix').length,
      script: this.logs.filter(l => l.category === 'script').length,
      system: this.logs.filter(l => l.category === 'system' || l.category === 'api').length,
      errors: this.logs.filter(l => l.level === 'error').length,
      successes: this.logs.filter(l => l.level === 'success').length
    }

    return {
      total: filtered.length,
      logs: filtered.slice(0, limit),
      stats
    }
  }

  static clearLogs() {
    this.logs = []
    this.info('system', 'Activity Logs Cleared', 'Studio activity history was cleared by operator.')
    this.persist()
    return { success: true, count: 0 }
  }
}

// Auto-initialize on module load
ActivityLogService.init()
