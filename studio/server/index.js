import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { FileService } from './services/fileService.js'
import { TtsService } from './services/ttsService.js'
import { AntiSlopValidator } from './services/antiSlopValidator.js'
import { ImageService } from './services/imageService.js'
import { VideoService } from './services/videoService.js'
import { ActivityLogService } from './services/activityLogService.js'
import { VisualQaService } from './services/visualQaService.js'
import { PackagingService } from './services/packagingService.js'

dotenv.config()

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err)
})
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason)
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')
const bgmDir = path.resolve(projectRoot, 'assets/audio/bgm')

const app = express()
const PORT = process.env.PORT || 3101

app.use(cors())
app.use(express.json({ limit: '250mb' }))
app.use(express.urlencoded({ limit: '250mb', extended: true }))

// Activity Logs Endpoints
app.get('/api/activity-logs', (req, res) => {
  const { category, level, search, limit } = req.query
  res.json(ActivityLogService.getLogs({
    category,
    level,
    search,
    limit: limit ? parseInt(limit, 10) : 200
  }))
})

app.post('/api/activity-logs', (req, res) => {
  const { category, level, title, message, metadata, franchiseId, episodeId } = req.body
  const entry = ActivityLogService.log({ category, level, title, message, metadata, franchiseId, episodeId })
  res.json({ success: true, entry })
})

app.post('/api/activity-logs/clear', (req, res) => {
  res.json(ActivityLogService.clearLogs())
})

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Brand Static Assets & Identity
app.use('/brand', express.static(path.resolve(projectRoot, 'assets/brand')))
app.get('/api/brand', (req, res) => {
  try {
    const brandJsonPath = path.resolve(projectRoot, 'assets/brand/brand_identity.json')
    if (fs.existsSync(brandJsonPath)) {
      const data = JSON.parse(fs.readFileSync(brandJsonPath, 'utf-8'))
      return res.json(data)
    }
    res.status(404).json({ error: 'Brand identity not found' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Franchises
app.get('/api/franchises', async (req, res) => {
  try {
    const franchises = await FileService.getFranchises()
    res.json(franchises)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// =========================================================================
// Master Cross-Episode Omnibus Lossless Stitcher & Delivery
// (Mounted prior to /api/episodes/:franchiseId/:episodeId to prevent route capture)
// =========================================================================

const handleStitchMasterOmnibus = async (req, res) => {
  try {
    const { franchiseId } = req.params
    const { masterFilePaths = [], outputFilename } = req.body || {}
    const result = await VideoService.stitchMasterOmnibus(franchiseId, masterFilePaths, outputFilename)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const handleOmnibusStream = (req, res) => {
  const { franchiseId } = req.params
  const requestedFile = req.query.file || ''
  const safeFilename = path.basename(requestedFile)
  const omnibusDir = path.resolve(projectRoot, '01_Franchises', franchiseId, 'omnibus')
  const filePath = path.join(omnibusDir, safeFilename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`Omnibus video (${safeFilename}) not found`)
  }

  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const range = req.headers.range
  const isDownload = req.query.download === '1' || req.query.download === 'true'

  if (isDownload) {
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`)
  }

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(filePath, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes'
    }
    res.writeHead(200, head)
    fs.createReadStream(filePath).pipe(res)
  }
}

const handleOmnibusFiles = (req, res) => {
  const { franchiseId } = req.params
  const omnibusDir = path.resolve(projectRoot, '01_Franchises', franchiseId, 'omnibus')
  if (!fs.existsSync(omnibusDir)) return res.json([])
  try {
    const files = fs.readdirSync(omnibusDir).filter(f => f.endsWith('.mp4')).map(f => {
      const st = fs.statSync(path.join(omnibusDir, f))
      return {
        filename: f,
        size: st.size,
        sizeFormatted: `${(st.size / (1024 * 1024)).toFixed(1)} MB`,
        mtime: st.mtime,
        url: `/api/franchises/${franchiseId}/omnibus-stream?file=${encodeURIComponent(f)}`
      }
    })
    res.json(files)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const handleOmnibusDelete = (req, res) => {
  const { franchiseId } = req.params
  const requestedFile = req.query.file || req.body?.file || ''
  if (!requestedFile) {
    return res.status(400).json({ error: 'File parameter is required' })
  }
  const safeFilename = path.basename(requestedFile)
  const omnibusDir = path.resolve(projectRoot, '01_Franchises', franchiseId, 'omnibus')
  const filePath = path.join(omnibusDir, safeFilename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `Omnibus video (${safeFilename}) not found` })
  }

  try {
    fs.unlinkSync(filePath)
    ActivityLogService.info(
      'video',
      'Omnibus Master Deleted',
      `Deleted compiled omnibus master ${safeFilename}`,
      { filename: safeFilename },
      franchiseId,
      'omnibus'
    )
    res.json({ success: true, deleted: safeFilename })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Support both /api/franchises/:franchiseId and /api/episodes/:franchiseId prefixes
app.post('/api/franchises/:franchiseId/stitch-master-omnibus', handleStitchMasterOmnibus)
app.post('/api/episodes/:franchiseId/stitch-master-omnibus', handleStitchMasterOmnibus)

app.get('/api/franchises/:franchiseId/omnibus-stream', handleOmnibusStream)
app.get('/api/episodes/:franchiseId/omnibus-stream', handleOmnibusStream)

app.get('/api/franchises/:franchiseId/omnibus-files', handleOmnibusFiles)
app.get('/api/episodes/:franchiseId/omnibus-files', handleOmnibusFiles)

app.get(['/api/franchises/:franchiseId/omnibus-metadata', '/api/episodes/:franchiseId/omnibus-metadata'], async (req, res) => {
  try {
    const { franchiseId } = req.params
    const metadata = await VideoService.getOmnibusMetadata(franchiseId)
    res.json(metadata || { message: 'No omnibus metadata available yet' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/franchises/:franchiseId/omnibus-files', handleOmnibusDelete)
app.delete('/api/episodes/:franchiseId/omnibus-files', handleOmnibusDelete)

// Episode Details
app.get('/api/episodes/:franchiseId/:episodeId', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const episode = await FileService.getEpisode(franchiseId, episodeId)
    res.json(episode)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Save Script
app.post('/api/episodes/:franchiseId/:episodeId/script', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { script, label } = req.body
    const result = await FileService.saveScript(franchiseId, episodeId, script, label)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Script History Snapshots
app.get('/api/episodes/:franchiseId/:episodeId/history', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const history = await FileService.getScriptHistory(franchiseId, episodeId)
    res.json(history)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create Manual Snapshot
app.post('/api/episodes/:franchiseId/:episodeId/history', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { script, label } = req.body
    const result = await FileService.createScriptSnapshot(franchiseId, episodeId, script, label)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Restore Snapshot
app.post('/api/episodes/:franchiseId/:episodeId/history/restore', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { filename } = req.body
    if (!filename) return res.status(400).json({ error: 'Filename is required to restore.' })
    const result = await FileService.restoreScriptSnapshot(franchiseId, episodeId, filename)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Audit Script (Live)
app.post('/api/audit', (req, res) => {
  try {
    const { script } = req.body
    const audit = AntiSlopValidator.auditScript(script || '')
    res.json(audit)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Prompt Matrix Audit (Deterministic Pre-Flight Linter)
const handlePromptMatrixAudit = async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const epPath = path.resolve(projectRoot, '01_Franchises', franchiseId, episodeId)
    const scriptPath = path.join(epPath, '01_Episode_Script.md')
    const promptPath = path.join(epPath, '02_Prompt_Matrix.md')

    let scriptText = req.body?.script || ''
    let promptMatrixText = req.body?.promptMatrix || ''

    if (!scriptText && fs.existsSync(scriptPath)) {
      scriptText = await fs.promises.readFile(scriptPath, 'utf-8')
    }
    if (!promptMatrixText && fs.existsSync(promptPath)) {
      promptMatrixText = await fs.promises.readFile(promptPath, 'utf-8')
    }

    // Load character vault
    const vaultDir = path.resolve(projectRoot, '01_Franchises', franchiseId, 'character_vault')
    let characters = []
    let items = []
    let flowEntities = {}

    const charsPath = path.join(vaultDir, 'characters.json')
    if (fs.existsSync(charsPath)) {
      try {
        const cData = JSON.parse(await fs.promises.readFile(charsPath, 'utf-8'))
        characters = cData.characters || []
      } catch (e) {}
    }

    const itemsPath = path.join(vaultDir, 'items.json')
    if (fs.existsSync(itemsPath)) {
      try {
        const iData = JSON.parse(await fs.promises.readFile(itemsPath, 'utf-8'))
        items = iData.items || []
      } catch (e) {}
    }

    const flowPath = path.join(vaultDir, 'flow_entities.json')
    if (fs.existsSync(flowPath)) {
      try {
        const fData = JSON.parse(await fs.promises.readFile(flowPath, 'utf-8'))
        flowEntities = fData.entities || {}
      } catch (e) {}
    }

    const audit = AntiSlopValidator.auditPromptMatrix(scriptText, promptMatrixText, {
      characters,
      items,
      flowEntities
    })

    res.json({
      success: true,
      franchiseId,
      episodeId,
      ...audit
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

app.get('/api/episodes/:franchiseId/:episodeId/prompt-matrix-audit', handlePromptMatrixAudit)
app.post('/api/episodes/:franchiseId/:episodeId/prompt-matrix-audit', handlePromptMatrixAudit)

// Generate Prompt Matrix
app.post('/api/episodes/:franchiseId/:episodeId/generate-prompts', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { characterAnchor } = req.body
    const result = await FileService.generatePromptMatrix(franchiseId, episodeId, characterAnchor)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Generate Voiceover Audio (Edge-TTS)
app.post('/api/episodes/:franchiseId/:episodeId/generate-tts', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { voice, force, batchIndex } = req.body || {}
    const result = await TtsService.generateEpisodeAudio(franchiseId, episodeId, voice, { force, batchIndex })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Stream Audio Files (with HTTP Range Requests & Content-Length)
app.get('/api/audio/:franchiseId/:episodeId/:filename', (req, res) => {
  const { franchiseId, episodeId, filename } = req.params
  const filePath = TtsService.getAudioFilePath(franchiseId, episodeId, filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Audio file not found')
  }

  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(filePath, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg',
    }
    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Accept-Ranges': 'bytes',
      'Content-Type': 'audio/mpeg',
    }
    res.writeHead(200, head)
    fs.createReadStream(filePath).pipe(res)
  }
})

// BGM Soundscape Tracks List
app.get('/api/bgm', async (req, res) => {
  try {
    const manifestPath = path.join(bgmDir, 'manifest.json')
    if (fs.existsSync(manifestPath)) {
      const data = JSON.parse(await fs.promises.readFile(manifestPath, 'utf-8'))
      return res.json(data)
    }
    if (fs.existsSync(bgmDir)) {
      const files = await fs.promises.readdir(bgmDir)
      const tracks = files.filter(f => f.endsWith('.mp3')).map(f => ({
        id: f.replace(/\.mp3$/, ''),
        filename: f,
        title: f.replace(/\.mp3$/, '').replace(/_/g, ' '),
        mood: 'Cinematic Soundscape',
        desc: 'Royalty-free background OST',
        url: `/api/bgm/${f}`
      }))
      return res.json(tracks)
    }
    res.json([])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Stream BGM Audio File (with Range requests)
app.get('/api/bgm/:filename', (req, res) => {
  const { filename } = req.params
  const filePath = path.join(bgmDir, filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('BGM file not found')
  }

  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(filePath, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg',
    }
    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Accept-Ranges': 'bytes',
      'Content-Type': 'audio/mpeg',
    }
    res.writeHead(200, head)
    fs.createReadStream(filePath).pipe(res)
  }
})

// Scene Images List & Status
app.get('/api/episodes/:franchiseId/:episodeId/images', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const scenes = await ImageService.getPromptMatrixScenes(franchiseId, episodeId)
    res.json(scenes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Image Generation Status (Must be before :filename route)
app.get('/api/episodes/:franchiseId/:episodeId/images/status', (req, res) => {
  const { franchiseId, episodeId } = req.params
  res.json(ImageService.getStatus(franchiseId, episodeId))
})

// Validate Visual Scene Alignment, Fidelity & Sequence Integrity (Must be before :filename route)
app.get('/api/episodes/:franchiseId/:episodeId/images/validate-alignment', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const result = await ImageService.validateVisualAlignment(franchiseId, episodeId)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Generate Storyboard Stills (Full or Single Batch)
app.post('/api/episodes/:franchiseId/:episodeId/images/generate-storyboard', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { force, batchIndex } = req.body || {}
    const result = await ImageService.generateStoryboardStills(franchiseId, episodeId, { 
      force: Boolean(force),
      batchIndex: typeof batchIndex === 'number' ? batchIndex : null
    })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Voiceover TTS Status
app.get('/api/episodes/:franchiseId/:episodeId/tts-status', (req, res) => {
  const { franchiseId, episodeId } = req.params
  res.json(TtsService.getStatus(franchiseId, episodeId))
})

// Helper to detect extension, sanitize, and clean older conflicting extensions for same tag
const saveUploadedImage = async (imagesDir, tag, base64Data, franchiseId, episodeId) => {
  const cleanTag = tag.toUpperCase()
  let ext = 'png'
  const match = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,/)
  if (match) {
    const sub = match[1].toLowerCase()
    if (sub === 'jpeg' || sub === 'jpg') ext = 'jpg'
    else if (sub === 'webp') ext = 'webp'
  }

  const filename = `${cleanTag}.${ext}`
  const targetPath = path.join(imagesDir, filename)
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(cleanBase64, 'base64')
  await fs.promises.writeFile(targetPath, buffer)

  // Remove conflicting alternate extensions to prevent caching / shadowing
  const allExts = ['jpg', 'jpeg', 'png', 'webp']
  for (const altExt of allExts) {
    if (altExt !== ext) {
      const altPath = path.join(imagesDir, `${cleanTag}.${altExt}`)
      if (fs.existsSync(altPath)) {
        try { await fs.promises.unlink(altPath) } catch (_) {}
      }
    }
  }

  // Automatically run Visual QA & Anti-Clutter Sanitization
  let qaReport = null
  const backupDir = path.join(imagesDir, '..', 'images_original_backup')
  try {
    qaReport = await VisualQaService.verifyImage(targetPath, { autoFix: true, backupDir })
  } catch (err) {
    console.warn(`[VisualQA] QA error on ${cleanTag}:`, err.message)
  }

  return { filename, url: filename, qa: qaReport }
}

// Manual Image Upload / Dropzone (Base64) with Auto Visual-QA Verification
app.post('/api/episodes/:franchiseId/:episodeId/images/upload', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { tag, base64Data } = req.body
    if (!tag || !base64Data) {
      return res.status(400).json({ error: 'tag and base64Data are required.' })
    }

    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
    await fs.promises.mkdir(imagesDir, { recursive: true })
    const { filename, qa } = await saveUploadedImage(imagesDir, tag, base64Data, franchiseId, episodeId)

    res.json({
      success: true,
      filename,
      url: `/api/episodes/${franchiseId}/${episodeId}/images/${filename}`,
      qa
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Batch Image Upload (Multiple images at once)
app.post('/api/episodes/:franchiseId/:episodeId/images/batch-upload', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { items } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items array is required' })
    }

    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
    await fs.promises.mkdir(imagesDir, { recursive: true })

    const uploaded = []
    for (const item of items) {
      if (!item.tag || !item.base64Data) continue
      const { filename, qa } = await saveUploadedImage(imagesDir, item.tag, item.base64Data, franchiseId, episodeId)
      uploaded.push({ tag: item.tag.toUpperCase(), filename, qa })
    }

    res.json({
      success: true,
      count: uploaded.length,
      uploaded
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Single Image QA Verification on Demand
app.post('/api/episodes/:franchiseId/:episodeId/images/verify', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { filename, tag, autoFix } = req.body || {}
    const targetName = filename || (tag ? `${tag.toUpperCase()}.jpg` : null)
    if (!targetName) {
      return res.status(400).json({ error: 'filename or tag is required' })
    }

    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
    const filePath = path.join(imagesDir, targetName)
    const backupDir = path.join(imagesDir, '..', 'images_original_backup')

    const report = await VisualQaService.verifyImage(filePath, { autoFix: Boolean(autoFix), backupDir })
    res.json({
      success: true,
      filename: targetName,
      ...report
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Full Episode Image QA Audit & Batch Sanitization
app.get('/api/episodes/:franchiseId/:episodeId/images/qa-audit', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const audit = await VisualQaService.auditEpisodeImages(franchiseId, episodeId, { autoFix: false })
    res.json(audit)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/episodes/:franchiseId/:episodeId/images/qa-audit', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { autoFix } = req.body || {}
    const audit = await VisualQaService.auditEpisodeImages(franchiseId, episodeId, { autoFix: Boolean(autoFix) })
    res.json(audit)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Stitch Two Single Renders into Multi-Panel 9:16 Strip
app.post('/api/episodes/:franchiseId/:episodeId/images/stitch-strip', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { tag, topBase64, bottomBase64, gutterHeight, gutterColor } = req.body
    if (!tag || !topBase64 || !bottomBase64) {
      return res.status(400).json({ error: 'tag, topBase64, and bottomBase64 are required' })
    }

    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
    await fs.promises.mkdir(imagesDir, { recursive: true })
    const targetPath = path.join(imagesDir, `${tag.toUpperCase()}.jpg`)

    const topBuf = Buffer.from(topBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const bottomBuf = Buffer.from(bottomBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64')

    await ImageService.stitchMultiPanel({
      topBufferOrPath: topBuf,
      bottomBufferOrPath: bottomBuf,
      outputPath: targetPath,
      gutterHeight: gutterHeight || 8,
      gutterColor: gutterColor || '#0b0f19'
    })

    res.json({
      success: true,
      filename: `${tag.toUpperCase()}.jpg`,
      url: `/api/episodes/${franchiseId}/${episodeId}/images/${tag.toUpperCase()}.jpg`
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Upload & Extract ZIP Archive of Scene Images (with Optional Batch Scoping)
app.post('/api/episodes/:franchiseId/:episodeId/images/upload-zip', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { zipBase64, filename, batchIndex } = req.body
    if (!zipBase64) {
      return res.status(400).json({ error: 'zipBase64 payload is required' })
    }

    const result = await ImageService.extractAndIngestZip(franchiseId, episodeId, zipBase64, filename || 'batch.zip', typeof batchIndex === 'number' ? batchIndex : null)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Stream Scene Image (Must be AFTER all specific /images/* sub-routes)
app.get('/api/episodes/:franchiseId/:episodeId/images/:filename', (req, res) => {
  const { franchiseId, episodeId, filename } = req.params
  const filePath = ImageService.getImagePath(franchiseId, episodeId, filename)

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filename).toLowerCase()
    const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : (ext === '.webp' ? 'image/webp' : 'image/png')
    res.setHeader('Content-Type', contentType)
    const readStream = fs.createReadStream(filePath)
    readStream.pipe(res)
  } else {
    res.status(404).send('Image file not found')
  }
})

// Unified Character, Weapon & Item Models List for Franchise Vault
function formatAppearance(appearance, fallbackRole = '') {
  if (!appearance) return fallbackRole
  if (typeof appearance === 'string') return appearance
  if (typeof appearance === 'object') {
    const parts = []
    if (appearance.height) parts.push(appearance.height)
    if (appearance.physique) parts.push(appearance.physique)
    if (appearance.hair) parts.push(appearance.hair)
    if (appearance.eyes) parts.push(appearance.eyes)
    if (appearance.attire) parts.push(`Attire: ${appearance.attire}`)
    if (appearance.weapons) parts.push(`Weapons: ${appearance.weapons}`)
    
    if (parts.length === 0) {
      const vals = Object.values(appearance).filter(v => typeof v === 'string' && v.trim())
      if (vals.length > 0) return vals.join('. ')
    } else {
      return parts.join('. ')
    }
  }
  return fallbackRole
}

function buildModelGenerationPrompt(item, format = '16:9 Full-Bleed Landscape', isItem = false) {
  if (item.generation_prompt) return item.generation_prompt
  if (item.generationPrompt) return item.generationPrompt

  const isLandscape = (format || '').includes('16:9') || (item.dna_prompt_anchor || '').includes('16:9')
  const ratioPrefix = isLandscape 
    ? '16:9 horizontal widescreen cinematic composition.' 
    : 'Vertical 9:16 portrait.'
  const ratioSuffix = isLandscape 
    ? 'horizontal 16:9, widescreen, cinematic composition, edge-to-edge full bleed landscape, completely textless artwork, no speech bubbles, no words, no banners.' 
    : 'vertical 9:16, completely textless artwork, no speech bubbles, no words, no banners.'

  let desc = ''
  if (item.dna_prompt_anchor) {
    desc = item.dna_prompt_anchor.replace(/^@\{[^}]+\},\s*/, '')
    if (desc.includes('horizontal 16:9') || desc.includes('vertical 9:16')) {
      return `${ratioPrefix} ${desc}`
    }
  } else if (!isItem && item.appearance) {
    desc = formatAppearance(item.appearance, item.role || '')
  } else {
    desc = item.description || item.visual_dna || item.name
  }

  return `${ratioPrefix} ${item.name}, ${desc}. Dark fantasy action manhwa art style, sharp ink linework, high contrast cel shading, cinematic dramatic lighting, ${ratioSuffix}`
}

app.get('/api/franchises/:franchiseId/character-models', async (req, res) => {
  try {
    const { franchiseId } = req.params
    const modelsDir = path.resolve(projectRoot, '01_Franchises', franchiseId, '00_Series_Bible_and_Character_DNA', 'models')
    const vaultDir = path.resolve(projectRoot, '01_Franchises', franchiseId, 'character_vault')
    const charFilesDir = path.resolve(projectRoot, '01_Franchises', franchiseId, '00_Characters')
    
    const allItems = []

    // 1. Ingest Characters
    const vaultCharPath = path.join(vaultDir, 'characters.json')
    const manifestCharPath = path.join(modelsDir, 'character_models.json')
    let seriesFormat = '16:9 Full-Bleed Landscape'
    
    if (fs.existsSync(vaultCharPath)) {
      const rawVault = JSON.parse(await fs.promises.readFile(vaultCharPath, 'utf-8'))
      if (rawVault.format) seriesFormat = rawVault.format
      const charList = Array.isArray(rawVault) ? rawVault : (rawVault.characters || [])
      for (const c of charList) {
        const roleStr = (c.role || 'Character').toLowerCase()
        const isAntagonist = (c.category && c.category.toLowerCase() === 'antagonist') ||
                             roleStr.includes('antagonist') ||
                             roleStr.includes('boss') ||
                             roleStr.includes('calamity') ||
                             roleStr.includes('monster') ||
                             roleStr.includes('enemy') ||
                             roleStr.includes('villain')
        const isSupporting = (c.category && c.category.toLowerCase() === 'supporting') ||
                             roleStr.includes('supporting') ||
                             roleStr.includes('proctor') ||
                             roleStr.includes('instructor') ||
                             roleStr.includes('vip')
        const roleCategory = c.category || (isAntagonist ? 'Antagonist' : (isSupporting ? 'Supporting' : 'Protagonist'))
        const plateFile = c.reference_plate || `${c.id}.jpg`
        const diskExists = fs.existsSync(path.join(vaultDir, plateFile)) || 
                           fs.existsSync(path.join(modelsDir, plateFile)) ||
                           fs.existsSync(path.join(charFilesDir, plateFile))
        const flowName = c.flowName || (c.token ? c.token.replace(/[@{}]/g, '') : c.name)
        const genPrompt = buildModelGenerationPrompt(c, seriesFormat, false)
        
        allItems.push({
          id: c.id,
          name: c.name,
          flowName: flowName,
          category: roleCategory,
          role: roleCategory,
          type: 'character',
          tier: `Tier ${c.tier || 1}: ${c.role || 'Character'}`,
          filename: plateFile,
          hasPlate: diskExists,
          url: `/api/franchises/${franchiseId}/character-models/${plateFile}`,
          description: formatAppearance(c.appearance, c.role || ''),
          dnaAnchor: c.dna_prompt_anchor || c.token || c.name,
          fullDna: c.dna_prompt_anchor || '',
          token: c.token || `@{${c.name}}`,
          generationPrompt: genPrompt,
          flowUuid: c.flowUuid || null,
          episodes: Array.isArray(c.episodes) ? c.episodes : []
        })
      }
    } else if (fs.existsSync(manifestCharPath)) {
      const data = JSON.parse(await fs.promises.readFile(manifestCharPath, 'utf-8'))
      if (Array.isArray(data)) {
        allItems.push(...data)
      }
    }

    // 2. Ingest Weapons, Artifacts & Key Props
    const vaultItemsPath = path.join(vaultDir, 'items.json')
    const manifestItemsPath = path.join(modelsDir, 'items.json')
    const activeItemsFile = fs.existsSync(vaultItemsPath) ? vaultItemsPath : (fs.existsSync(manifestItemsPath) ? manifestItemsPath : null)
    
    if (activeItemsFile) {
      const rawItems = JSON.parse(await fs.promises.readFile(activeItemsFile, 'utf-8'))
      
      // A. Weapons
      if (rawItems.weapons) {
        for (const [key, item] of Object.entries(rawItems.weapons)) {
          const plateFile = item.reference_plate || `${key}.jpg`
          const diskExists = fs.existsSync(path.join(vaultDir, plateFile)) || 
                             fs.existsSync(path.join(modelsDir, plateFile)) ||
                             fs.existsSync(path.join(charFilesDir, plateFile))
          allItems.push({
            id: key,
            name: item.name,
            flowName: item.flowName || (item.token ? item.token.replace(/[@{}]/g, '') : item.name),
            category: 'Weapons',
            role: 'Weapons',
            type: 'weapon',
            tier: item.category || `Tier ${item.tier || 2} Weapon`,
            filename: plateFile,
            hasPlate: diskExists,
            url: `/api/franchises/${franchiseId}/character-models/${plateFile}`,
            description: item.visual_dna || `${item.name} (${item.category || 'Signature Weapon'})`,
            dnaAnchor: item.token || `@{Weapon: ${item.name}}`,
            fullDna: item.visual_dna || '',
            token: item.token || `@{Weapon: ${item.name}}`,
            generationPrompt: buildModelGenerationPrompt(item, seriesFormat, true),
            flowUuid: item.flowUuid || null
          })
        }
      }

      // B. Key Props and Artifacts
      if (rawItems.key_props_and_artifacts) {
        for (const [key, item] of Object.entries(rawItems.key_props_and_artifacts)) {
          const plateFile = item.reference_plate || `${key}.jpg`
          const isArtifact = (item.category || '').toLowerCase().includes('relic') || (item.category || '').toLowerCase().includes('artifact') || key.includes('artifact') || key.includes('core')
          const categoryName = isArtifact ? 'Artifacts' : 'Props'
          const diskExists = fs.existsSync(path.join(vaultDir, plateFile)) || 
                             fs.existsSync(path.join(modelsDir, plateFile)) ||
                             fs.existsSync(path.join(charFilesDir, plateFile))
          allItems.push({
            id: key,
            name: item.name,
            flowName: item.flowName || (item.token ? item.token.replace(/[@{}]/g, '') : item.name),
            category: categoryName,
            role: categoryName,
            type: isArtifact ? 'artifact' : 'prop',
            tier: item.category || (isArtifact ? 'Primordial Relic' : 'Key Environmental Prop'),
            filename: plateFile,
            hasPlate: diskExists,
            url: `/api/franchises/${franchiseId}/character-models/${plateFile}`,
            description: item.visual_dna || `${item.name} (${item.category || 'Prop/Artifact'})`,
            dnaAnchor: item.token || `@{${item.name}}`,
            fullDna: item.visual_dna || '',
            token: item.token || `@{${item.name}}`,
            generationPrompt: buildModelGenerationPrompt(item, seriesFormat, true),
            flowUuid: item.flowUuid || null
          })
        }
      }

      // C. Array of items (e.g. { items: [ ... ] } or [ ... ])
      const itemsList = Array.isArray(rawItems) ? rawItems : (Array.isArray(rawItems.items) ? rawItems.items : [])
      for (const item of itemsList) {
        const itemType = (item.type || item.category || 'Item').toLowerCase()
        const isWeapon = itemType.includes('weapon') || (item.category && item.category.toLowerCase().includes('weapon'))
        const isArtifact = itemType.includes('artifact') || itemType.includes('relic') || (item.category && item.category.toLowerCase().includes('relic'))
        const categoryName = isWeapon ? 'Weapons' : (isArtifact ? 'Artifacts' : 'Props')
        const plateFile = item.reference_plate || `${item.id}.jpg`
        const diskExists = fs.existsSync(path.join(vaultDir, plateFile)) || 
                           fs.existsSync(path.join(modelsDir, plateFile)) ||
                           fs.existsSync(path.join(charFilesDir, plateFile))
        allItems.push({
          id: item.id,
          name: item.name,
          flowName: item.flowName || (item.token ? item.token.replace(/[@{}]/g, '') : item.name),
          category: categoryName,
          role: categoryName,
          type: isWeapon ? 'weapon' : (isArtifact ? 'artifact' : 'prop'),
          tier: item.true_rank || item.apparent_rank || item.category || categoryName,
          filename: plateFile,
          hasPlate: diskExists,
          url: `/api/franchises/${franchiseId}/character-models/${plateFile}`,
          description: item.description || item.visual_dna || `${item.name} (${categoryName})`,
          dnaAnchor: item.dna_prompt_anchor || item.token || `@{${item.name}}`,
          fullDna: item.dna_prompt_anchor || item.visual_dna || '',
          token: item.token || `@{${item.name}}`,
          generationPrompt: buildModelGenerationPrompt(item, seriesFormat, true),
          flowUuid: item.flowUuid || null
        })
      }
    }

    // 3. Fallback to image files in directory if empty
    if (allItems.length === 0) {
      const activeDir = fs.existsSync(vaultDir) ? vaultDir : (fs.existsSync(modelsDir) ? modelsDir : null)
      if (activeDir) {
        const files = await fs.promises.readdir(activeDir)
        const images = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f)).map(f => {
          const cleanName = f.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
          const isWeapon = /weapon/i.test(f)
          const isArtifact = /artifact|relic|core/i.test(f)
          const isProp = /prop/i.test(f)
          const cat = isWeapon ? 'Weapons' : (isArtifact ? 'Artifacts' : (isProp ? 'Props' : 'General'))
          return {
            id: f.replace(/\.[^/.]+$/, '').toLowerCase(),
            name: cleanName,
            flowName: cleanName,
            category: cat,
            role: cat,
            type: isWeapon ? 'weapon' : (isArtifact ? 'artifact' : (isProp ? 'prop' : 'character')),
            tier: 'Standard Reference',
            filename: f,
            hasPlate: true,
            url: `/api/franchises/${franchiseId}/character-models/${f}`,
            description: cleanName,
            dnaAnchor: `@{${cleanName}}`,
            token: `@{${cleanName}}`,
            generationPrompt: `16:9 horizontal widescreen cinematic composition. ${cleanName}, dark fantasy action manhwa art style, sharp ink linework, high contrast cel shading, cinematic dramatic lighting, horizontal 16:9, completely textless artwork, no words, no banners.`
          }
        })
        return res.json(images)
      }
    }

    // 4. Bidirectional Parity Guard: detect any flow_entities that lack a character/item card
    const flowEntitiesPath = path.join(vaultDir, 'flow_entities.json')
    if (fs.existsSync(flowEntitiesPath)) {
      try {
        const flowData = JSON.parse(await fs.promises.readFile(flowEntitiesPath, 'utf-8'))
        const existingNames = new Set(allItems.map(i => i.name.toLowerCase()))
        allItems.forEach(i => {
          if (i.flowName) existingNames.add(i.flowName.toLowerCase())
          if (i.id) existingNames.add(i.id.toLowerCase())
          if (i.name) {
            existingNames.add(i.name.toLowerCase())
            existingNames.add(i.name.toLowerCase().replace(/^(boss|character|weapon|artifact|prop|item):\s*/i, ''))
            existingNames.add(i.name.toLowerCase().replace(/\s*\([^)]*\)$/, ''))
          }
        })

        const rawLines = (flowData.rawText || '').split('\n')
        for (const line of rawLines) {
          const match = line.match(/^([^:\r\n]+):\s*([a-f0-9-]{36}|00000000-[^\s\r\n]+)/i)
          if (match) {
            const rawEntityName = match[1].trim()
            const cleanName = rawEntityName.replace(/^(Boss|Character|Weapon|Artifact):\s*/i, '').trim()
            const uuid = match[2].trim()

            if (!existingNames.has(rawEntityName.toLowerCase()) && !existingNames.has(cleanName.toLowerCase())) {
              allItems.push({
                id: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                name: cleanName,
                flowName: rawEntityName,
                category: rawEntityName.toLowerCase().includes('boss') ? 'Antagonist' : 'Unregistered',
                role: 'Unregistered Flow Entity',
                type: 'unregistered',
                tier: '⚠️ Missing from characters.json',
                filename: null,
                hasPlate: false,
                isUnregistered: true,
                url: null,
                description: `⚠️ Detected in flow_entities.json with UUID ${uuid}, but missing from characters.json. Reference plate not generated.`,
                dnaAnchor: `@{${cleanName}}`,
                token: `@{${cleanName}}`,
                flowUuid: uuid,
                episodes: []
              })
            }
          }
        }
      } catch (e) {
        console.error('Error auditing flow entities parity:', e)
      }
    }

    res.json(allItems)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Upload & Replace Character / Item Model Reference Plate (Base64)
app.post('/api/franchises/:franchiseId/character-models/:modelId/upload-plate', async (req, res) => {
  try {
    const { franchiseId, modelId } = req.params
    const { base64Data, filename: customFilename } = req.body
    if (!base64Data) {
      return res.status(400).json({ error: 'base64Data is required' })
    }

    const vaultDir = path.resolve(projectRoot, '01_Franchises', franchiseId, 'character_vault')
    const charFilesDir = path.resolve(projectRoot, '01_Franchises', franchiseId, '00_Characters')
    const modelsDir = path.resolve(projectRoot, '01_Franchises', franchiseId, '00_Series_Bible_and_Character_DNA', 'models')
    
    await fs.promises.mkdir(vaultDir, { recursive: true })

    // Determine extension
    let ext = 'jpg'
    const match = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,/)
    if (match) {
      const sub = match[1].toLowerCase()
      if (sub === 'png') ext = 'png'
      else if (sub === 'webp') ext = 'webp'
      else if (sub === 'jpeg' || sub === 'jpg') ext = 'jpg'
    }

    // Lookup metadata in characters.json or items.json
    const vaultCharPath = path.join(vaultDir, 'characters.json')
    const vaultItemsPath = path.join(vaultDir, 'items.json')
    let targetFilename = customFilename || null

    let charData = null
    let charIndex = -1
    let itemData = null
    let itemKey = null
    let itemIndex = -1

    if (fs.existsSync(vaultCharPath)) {
      try {
        const raw = JSON.parse(await fs.promises.readFile(vaultCharPath, 'utf-8'))
        const list = Array.isArray(raw) ? raw : (raw.characters || [])
        charIndex = list.findIndex(c => c.id === modelId || c.name === modelId || c.flowName === modelId || c.reference_plate === modelId)
        if (charIndex !== -1) {
          charData = raw
          if (!targetFilename && list[charIndex].reference_plate) {
            targetFilename = list[charIndex].reference_plate
          }
        }
      } catch (_) {}
    }

    if (!charData && fs.existsSync(vaultItemsPath)) {
      try {
        const raw = JSON.parse(await fs.promises.readFile(vaultItemsPath, 'utf-8'))
        if (Array.isArray(raw.items)) {
          itemIndex = raw.items.findIndex(i => i.id === modelId || i.name === modelId || i.reference_plate === modelId)
          if (itemIndex !== -1) {
            itemData = raw
            if (!targetFilename && raw.items[itemIndex].reference_plate) {
              targetFilename = raw.items[itemIndex].reference_plate
            }
          }
        } else if (raw.weapons && raw.weapons[modelId]) {
          itemData = raw
          itemKey = modelId
          if (!targetFilename && raw.weapons[modelId].reference_plate) {
            targetFilename = raw.weapons[modelId].reference_plate
          }
        } else if (raw.key_props_and_artifacts && raw.key_props_and_artifacts[modelId]) {
          itemData = raw
          itemKey = modelId
          if (!targetFilename && raw.key_props_and_artifacts[modelId].reference_plate) {
            targetFilename = raw.key_props_and_artifacts[modelId].reference_plate
          }
        }
      } catch (_) {}
    }

    if (!targetFilename) {
      targetFilename = `${modelId.replace(/[^a-zA-Z0-9_-]/g, '_')}.${ext}`
    }

    // Save image buffer to vaultDir
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(cleanBase64, 'base64')
    const targetPath = path.join(vaultDir, targetFilename)
    await fs.promises.writeFile(targetPath, buffer)

    // Mirror to 00_Characters if directory exists
    if (fs.existsSync(charFilesDir)) {
      await fs.promises.writeFile(path.join(charFilesDir, targetFilename), buffer)
    }

    // Mirror to modelsDir if directory exists
    if (fs.existsSync(modelsDir)) {
      await fs.promises.writeFile(path.join(modelsDir, targetFilename), buffer)
    }

    // Update characters.json or items.json
    if (charData) {
      const list = Array.isArray(charData) ? charData : charData.characters
      list[charIndex].reference_plate = targetFilename
      list[charIndex].hasPlate = true
      await fs.promises.writeFile(vaultCharPath, JSON.stringify(charData, null, 2), 'utf-8')
    } else if (itemData) {
      if (itemIndex !== -1) {
        itemData.items[itemIndex].reference_plate = targetFilename
        itemData.items[itemIndex].hasPlate = true
      } else if (itemKey && itemData.weapons && itemData.weapons[itemKey]) {
        itemData.weapons[itemKey].reference_plate = targetFilename
      } else if (itemKey && itemData.key_props_and_artifacts && itemData.key_props_and_artifacts[itemKey]) {
        itemData.key_props_and_artifacts[itemKey].reference_plate = targetFilename
      }
      await fs.promises.writeFile(vaultItemsPath, JSON.stringify(itemData, null, 2), 'utf-8')
    }

    res.json({
      success: true,
      filename: targetFilename,
      url: `/api/franchises/${franchiseId}/character-models/${targetFilename}?t=${Date.now()}`
    })
  } catch (err) {
    console.error('Error uploading character reference plate:', err)
    res.status(500).json({ error: err.message })
  }
})

// Stream Character / Item Model Reference Plate Image
app.get('/api/franchises/:franchiseId/character-models/:filename', (req, res) => {
  const { franchiseId, filename } = req.params
  let filePath = path.resolve(projectRoot, '01_Franchises', franchiseId, 'character_vault', filename)
  
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(projectRoot, '01_Franchises', franchiseId, '00_Series_Bible_and_Character_DNA', 'models', filename)
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(projectRoot, '01_Franchises', franchiseId, '00_Characters', filename)
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filename).toLowerCase()
    res.setHeader('Content-Type', ext === '.png' ? 'image/png' : (ext === '.webp' ? 'image/webp' : 'image/jpeg'))
    const readStream = fs.createReadStream(filePath)
    readStream.pipe(res)
  } else {
    res.status(404).send('Reference plate not found')
  }
})

// Fetch Flow Entity Mapping
app.get('/api/franchises/:franchiseId/flow-entities', async (req, res) => {
  try {
    const { franchiseId } = req.params
    const filePath = path.resolve(projectRoot, '01_Franchises', franchiseId, 'character_vault', 'flow_entities.json')
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'))
      return res.json(data)
    }
    res.json({ rawText: '', entities: {} })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Save Flow Entity Mapping & Auto-Cascade to characters.json and prompt matrices
app.post('/api/franchises/:franchiseId/flow-entities', async (req, res) => {
  try {
    const { franchiseId } = req.params
    const { rawText, entities } = req.body
    const vaultDir = path.resolve(projectRoot, '01_Franchises', franchiseId, 'character_vault')
    const franchisePath = path.resolve(projectRoot, '01_Franchises', franchiseId)
    
    if (!fs.existsSync(vaultDir)) {
      await fs.promises.mkdir(vaultDir, { recursive: true })
    }
    
    // 1. Save flow_entities.json
    const filePath = path.join(vaultDir, 'flow_entities.json')
    await fs.promises.writeFile(filePath, JSON.stringify({ rawText: rawText || '', entities: entities || {} }, null, 2), 'utf-8')
    
    const entityEntries = Object.entries(entities || {})
    const entityMapLower = {}
    for (const [k, v] of entityEntries) {
      entityMapLower[k.toLowerCase().trim()] = v
      const stripped = k.replace(/^(Boss|Character|Weapon|Artifact):\s*/i, '').trim().toLowerCase()
      entityMapLower[stripped] = v
    }

    // 2. Auto-Propagate into characters.json
    let charactersUpdated = 0
    const charPath = path.join(vaultDir, 'characters.json')
    const charOldToNewUuidMap = {}

    if (fs.existsSync(charPath) && entityEntries.length > 0) {
      try {
        const charRaw = JSON.parse(await fs.promises.readFile(charPath, 'utf-8'))
        const isArray = Array.isArray(charRaw)
        const charList = isArray ? charRaw : (charRaw.characters || [])
        
        for (const c of charList) {
          const nameLower = (c.name || '').toLowerCase().trim()
          const flowNameLower = (c.flowName || '').toLowerCase().trim()
          const idLower = (c.id || '').toLowerCase().trim()
          const tokenLower = (c.token || '').replace(/[@{}]/g, '').toLowerCase().trim()
          
          const newUuid = entityMapLower[nameLower] || 
                          entityMapLower[flowNameLower] || 
                          entityMapLower[idLower] || 
                          entityMapLower[tokenLower]

          if (newUuid) {
            if (c.flowUuid && c.flowUuid !== newUuid) {
              charOldToNewUuidMap[c.flowUuid] = newUuid
            }
            if (c.id) {
              charOldToNewUuidMap[`00000000-temp-${c.id}`] = newUuid
              charOldToNewUuidMap[`00000000-temp-${c.id.replace(/_/g, '-')}`] = newUuid
            }
            if (c.flowUuid !== newUuid) {
              c.flowUuid = newUuid
              charactersUpdated++
            }
          }
        }

        if (charactersUpdated > 0) {
          await fs.promises.writeFile(charPath, JSON.stringify(charRaw, null, 2), 'utf-8')
        }
      } catch (err) {
        console.error('Error auto-propagating to characters.json:', err)
      }
    }

    // 3. Auto-Propagate into episodic 02_Prompt_Matrix.md files
    let matricesUpdated = 0
    if (fs.existsSync(franchisePath)) {
      try {
        const epDirs = await fs.promises.readdir(franchisePath, { withFileTypes: true })
        for (const ep of epDirs) {
          if (ep.isDirectory() && ep.name.startsWith('EP')) {
            const matrixFile = path.join(franchisePath, ep.name, '02_Prompt_Matrix.md')
            if (fs.existsSync(matrixFile)) {
              let matrixContent = await fs.promises.readFile(matrixFile, 'utf-8')
              let fileChanged = false

              // Replace mapped old/temp UUIDs
              for (const [oldId, newId] of Object.entries(charOldToNewUuidMap)) {
                if (matrixContent.includes(oldId)) {
                  matrixContent = matrixContent.replaceAll(oldId, newId)
                  fileChanged = true
                }
              }

              // Also check for direct name or token references in character_ref tags
              for (const [name, uuid] of Object.entries(entities || {})) {
                const tagRegex1 = new RegExp(`<character_ref>\\s*@{?${name}}?\\s*<\\/character_ref>`, 'gi')
                if (tagRegex1.test(matrixContent)) {
                  matrixContent = matrixContent.replace(tagRegex1, `<character_ref>${uuid}</character_ref>`)
                  fileChanged = true
                }
              }

              if (fileChanged) {
                await fs.promises.writeFile(matrixFile, matrixContent, 'utf-8')
                matricesUpdated++
              }
            }
          }
        }
      } catch (err) {
        console.error('Error auto-propagating to prompt matrices:', err)
      }
    }

    ActivityLogService.info(
      'vault',
      'Flow Entities Synchronized & Cascaded',
      `Mapped ${entityEntries.length} entities. Auto-updated ${charactersUpdated} characters and ${matricesUpdated} prompt matrices.`,
      { count: entityEntries.length, charactersUpdated, matricesUpdated },
      franchiseId
    )

    res.json({
      success: true,
      count: entityEntries.length,
      charactersUpdated,
      matricesUpdated
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})



// Fetch Subtitles (.srt / .vtt)
app.get('/api/episodes/:franchiseId/:episodeId/subtitles', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const subtitles = await TtsService.getSubtitles(franchiseId, episodeId)
    res.json(subtitles)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Stream Subtitle File (.srt or .vtt)
app.get('/api/episodes/:franchiseId/:episodeId/subtitles/:filename', (req, res) => {
  const { franchiseId, episodeId, filename } = req.params
  const filePath = TtsService.getSubtitleFilePath(franchiseId, episodeId, filename)

  if (fs.existsSync(filePath)) {
    const isVtt = filename.endsWith('.vtt')
    res.setHeader('Content-Type', isVtt ? 'text/vtt' : 'application/x-subrip')
    const readStream = fs.createReadStream(filePath)
    readStream.pipe(res)
  } else {
    res.status(404).send('Subtitle file not found')
  }
})

// Overall Production Pipeline Status
app.get('/api/episodes/:franchiseId/:episodeId/pipeline-status', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const scenes = await ImageService.getPromptMatrixScenes(franchiseId, episodeId)
    const imagesReady = scenes.filter(s => s.hasImage).length

    const audioDir = TtsService.getAudioDir(franchiseId, episodeId)
    let audioReady = 0
    let hasMasterAudio = false
    try {
      const audioFiles = await fs.promises.readdir(audioDir)
      audioReady = audioFiles.filter(f => f.endsWith('.mp3') && f.includes('_SC')).length
      hasMasterAudio = audioFiles.includes('01_Episode_Master.mp3')
    } catch (e) {}

    const subtitles = await TtsService.getSubtitles(franchiseId, episodeId)

    const masterVideoPath = VideoService.getMasterVideoPath(franchiseId, episodeId)
    const hasVideo = fs.existsSync(masterVideoPath)
    let videoSize = 0
    if (hasVideo) {
      try { videoSize = (await fs.promises.stat(masterVideoPath)).size } catch (e) {}
    }

    const imageState = ImageService.getStatus(franchiseId, episodeId)
    const ttsState = TtsService.getStatus(franchiseId, episodeId)
    const videoState = VideoService.getStatus(franchiseId, episodeId)

    let format = '9:16'
    try {
      const biblePath = path.resolve(projectRoot, '01_Franchises', franchiseId, '00_Series_Bible_and_Character_DNA', 'Series_Bible.md')
      if (fs.existsSync(biblePath)) {
        const bibleContent = fs.readFileSync(biblePath, 'utf-8')
        const formatMatch = bibleContent.match(/(?:Video\s+)?Format:\*{0,2}\s*\*?([^\r\n*]+)\*?/i)
        if (formatMatch) {
          if (formatMatch[1].includes('16:9')) format = '16:9'
          else if (formatMatch[1].includes('9:16')) format = '9:16'
        }
      }
    } catch (_) {}

    if (format !== '16:9') {
      try {
        const charPath = path.resolve(projectRoot, '01_Franchises', franchiseId, 'character_vault', 'characters.json')
        if (fs.existsSync(charPath)) {
          const charData = JSON.parse(fs.readFileSync(charPath, 'utf-8'))
          if (charData.format && charData.format.includes('16:9')) format = '16:9'
        }
      } catch (_) {}
    }

    if (format !== '16:9' && franchiseId.toLowerCase().includes('series_02')) {
      format = '16:9'
    }

    res.json({
      totalScenes: scenes.length,
      imagesReady,
      audioReady,
      hasMasterAudio,
      hasSubtitles: subtitles.hasSubtitles,
      hasVideo,
      videoSize,
      imageState,
      ttsState,
      videoState,
      format
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Trigger Video Compilation (FFmpeg)
app.post('/api/episodes/:franchiseId/:episodeId/compile-video', (req, res) => {
  const { franchiseId, episodeId } = req.params
  const options = req.body || {}

  // Spawn in background so client receives immediate response
  VideoService.compileEpisodeVideo(franchiseId, episodeId, options).catch(err => {
    console.error('Video compilation error:', err)
  })

  res.json({
    success: true,
    message: 'Video compilation initiated',
    status: VideoService.getStatus(franchiseId, episodeId)
  })
})

// Trigger Automated Sequential Compilation for All Batches & Auto-Stitch
app.post('/api/episodes/:franchiseId/:episodeId/auto-compile-all', (req, res) => {
  const { franchiseId, episodeId } = req.params
  const options = req.body || {}

  VideoService.autoCompileAllBatches(franchiseId, episodeId, options).catch(err => {
    console.error('Auto compile all error:', err)
  })

  res.json({
    success: true,
    message: 'Automated sequential batch pipeline initiated',
    status: VideoService.getStatus(franchiseId, episodeId)
  })
})

// Trigger Instant Lossless Batch Stitching (-c copy into Master 1080p)
app.post('/api/episodes/:franchiseId/:episodeId/stitch-batches', (req, res) => {
  const { franchiseId, episodeId } = req.params
  const options = req.body || {}

  VideoService.stitchBatches(franchiseId, episodeId, options).catch(err => {
    console.error('Batch stitch error:', err)
  })

  res.json({
    success: true,
    message: 'Batch stitcher initiated',
    status: VideoService.getStatus(franchiseId, episodeId)
  })
})

// Trigger Selective Grouped Batch Queue Compilation
app.post('/api/episodes/:franchiseId/:episodeId/compile-grouped-batches', (req, res) => {
  const { franchiseId, episodeId } = req.params
  const options = req.body || {}

  VideoService.compileGroupedBatches(franchiseId, episodeId, options).catch(err => {
    console.error('Grouped batch compilation error:', err)
  })

  res.json({
    success: true,
    message: 'Grouped batch pipeline initiated',
    status: VideoService.getStatus(franchiseId, episodeId)
  })
})

// Video Compilation Progress & Status
app.get('/api/episodes/:franchiseId/:episodeId/video-status', (req, res) => {
  const { franchiseId, episodeId } = req.params
  res.json(VideoService.getStatus(franchiseId, episodeId))
})

// List Available Video Renders (Master & Batch Previews)
app.get('/api/episodes/:franchiseId/:episodeId/video-files', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const files = await VideoService.getVideoFiles(franchiseId, episodeId)
    res.json(files)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Stream Video (Master & Batch Previews with HTTP Range Requests)
app.get('/api/episodes/:franchiseId/:episodeId/video-stream', (req, res) => {
  const { franchiseId, episodeId } = req.params
  const requestedParam = req.query.file || '01_Episode_Master_1080p.mp4'
  const normalizedRel = path.normalize(requestedParam).replace(/^(\.\.[\/\\])+/, '')
  const videoDir = VideoService.getVideoDir(franchiseId, episodeId)
  const videoPath = path.resolve(videoDir, normalizedRel)

  if (!videoPath.startsWith(videoDir) || !fs.existsSync(videoPath)) {
    return res.status(404).send(`Compiled video (${requestedParam}) not found`)
  }

  const stat = fs.statSync(videoPath)
  const fileSize = stat.size
  const range = req.headers.range

  const isDownload = req.query.download === '1' || req.query.download === 'true'
  let downloadFilename = path.basename(requestedParam)
  if (isDownload) {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`
    const cleanBase = path.basename(requestedParam).replace(/^01_Episode_/, '').replace(/\.mp4$/i, '')
    downloadFilename = `${franchiseId}_${episodeId}_${cleanBase}_${timestamp}.mp4`
  }
  const dispositionHeader = isDownload ? { 'Content-Disposition': `attachment; filename="${downloadFilename}"` } : {}

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(videoPath, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
      ...dispositionHeader
    }
    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      ...dispositionHeader
    }
    res.writeHead(200, head)
    fs.createReadStream(videoPath).pipe(res)
  }
})

// Delete Compiled Video File (Master or Batch Preview)
app.delete('/api/episodes/:franchiseId/:episodeId/video-files', (req, res) => {
  const { franchiseId, episodeId } = req.params
  const requestedParam = req.query.file || req.body?.file || ''
  if (!requestedParam) {
    return res.status(400).json({ error: 'File parameter is required' })
  }
  const safeFilename = path.basename(requestedParam)
  const videoDir = VideoService.getVideoDir(franchiseId, episodeId)
  const videoPath = path.join(videoDir, safeFilename)

  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: `Compiled video (${safeFilename}) not found` })
  }

  try {
    fs.unlinkSync(videoPath)
    ActivityLogService.info(
      'video',
      'Episode Video Deleted',
      `Deleted compiled video ${safeFilename}`,
      { filename: safeFilename },
      franchiseId,
      episodeId
    )
    res.json({ success: true, deleted: safeFilename })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// YouTube Packaging & Release Suite (Titles, Description, Timestamps, Thumbnail Variants)
app.get('/api/episodes/:franchiseId/:episodeId/youtube-package', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const pkg = await PackagingService.generatePackage(franchiseId, episodeId)
    res.json(pkg)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Generate TikTok Climax Short (45-60s with 3s animated outro card)
app.post('/api/episodes/:franchiseId/:episodeId/generate-climax-short', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const options = req.body || {}
    const meta = await VideoService.extractClimaxShort(franchiseId, episodeId, options)
    const pkg = await PackagingService.generateTikTokPackage(franchiseId, episodeId)
    res.json({
      success: true,
      meta,
      package: pkg
    })
  } catch (err) {
    console.error('Error generating climax short:', err)
    res.status(500).json({ error: err.message })
  }
})

// Get TikTok Climax Short Metadata & Packaging
app.get('/api/episodes/:franchiseId/:episodeId/climax-short', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const meta = await VideoService.getClimaxShortMetadata(franchiseId, episodeId)
    const pkg = await PackagingService.generateTikTokPackage(franchiseId, episodeId)
    res.json({
      meta,
      package: pkg
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Stream TikTok Climax Short Video (with Range support)
app.get('/api/episodes/:franchiseId/:episodeId/shorts/:filename', (req, res) => {
  const { franchiseId, episodeId, filename } = req.params
  const safeFilename = path.basename(filename)
  const filePath = path.resolve(projectRoot, '01_Franchises', franchiseId, episodeId, 'shorts', safeFilename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`Short video (${safeFilename}) not found`)
  }

  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const range = req.headers.range
  const isDownload = req.query.download === '1' || req.query.download === 'true'

  if (isDownload) {
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`)
  }

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(filePath, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes'
    }
    res.writeHead(200, head)
    fs.createReadStream(filePath).pipe(res)
  }
})

// Thumbnail Variants List
app.get('/api/episodes/:franchiseId/:episodeId/thumbnail-variants', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const variants = await PackagingService.getThumbnailVariants(franchiseId, episodeId)
    res.json(variants)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Composite Vector Badge onto Thumbnail (Sharp Engine)
app.post('/api/episodes/:franchiseId/:episodeId/render-thumbnail-badge', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const options = req.body || {}
    const result = await PackagingService.compositeThumbnailBadge(franchiseId, episodeId, options)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Upload & Save Thumbnail Variant Image
app.post('/api/episodes/:franchiseId/:episodeId/upload-thumbnail-variant', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { variantId, base64Data, applyBadge, badgeText, subBadgeText, badgeColorPreset, badgePosition } = req.body || {}
    if (!variantId || !base64Data) {
      return res.status(400).json({ error: 'variantId and base64Data are required.' })
    }
    const result = await PackagingService.saveThumbnailUpload(franchiseId, episodeId, variantId, base64Data, {
      applyBadge: Boolean(applyBadge),
      badgeText,
      subBadgeText,
      badgeColorPreset,
      badgePosition
    })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Serve Thumbnail Image
app.get([
  '/api/episodes/:franchiseId/:episodeId/thumbnail/:filename', 
  '/api/episodes/:franchiseId/:episodeId/thumbnails/:filename',
  '/api/franchises/:franchiseId/omnibus/thumbnail/:filename',
  '/api/franchises/:franchiseId/omnibus/thumbnails/:filename'
], (req, res) => {
  const { franchiseId, episodeId, filename } = req.params
  const safeFilename = path.basename(filename)
  let thumbPath = episodeId && episodeId !== 'omnibus_master' && episodeId !== 'omnibus'
    ? path.join(projectRoot, '01_Franchises', franchiseId, episodeId, 'thumbnails', safeFilename)
    : path.join(projectRoot, '01_Franchises', franchiseId, 'omnibus', safeFilename)

  if (!fs.existsSync(thumbPath)) {
    const omniPath = path.join(projectRoot, '01_Franchises', franchiseId, 'omnibus', safeFilename)
    if (fs.existsSync(omniPath)) {
      thumbPath = omniPath
    } else {
      const franchisePath = path.join(projectRoot, '01_Franchises', franchiseId)
      if (fs.existsSync(franchisePath)) {
        const eps = fs.readdirSync(franchisePath).filter(d => d.startsWith('EP'))
        if (eps.length > 0) {
          const epThumbPath = path.join(franchisePath, eps[0], 'thumbnails', safeFilename)
          if (fs.existsSync(epThumbPath)) {
            thumbPath = epThumbPath
          }
        }
      }
    }
  }

  if (fs.existsSync(thumbPath)) {
    res.sendFile(thumbPath)
  } else {
    res.status(404).send('Thumbnail not found')
  }
})

// Engine Documents
app.get('/api/engine', async (req, res) => {
  try {
    const docs = await FileService.getEngineDocuments()
    res.json(docs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Manhwa Recap Studio Backend API listening on http://localhost:${PORT}`)
})
