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
    const { voice } = req.body
    const result = await TtsService.generateEpisodeAudio(franchiseId, episodeId, voice)
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

// Character Models List for Franchise
app.get('/api/franchises/:franchiseId/character-models', async (req, res) => {
  try {
    const { franchiseId } = req.params
    const modelsDir = path.resolve(projectRoot, '01_Franchises', franchiseId, '00_Series_Bible_and_Character_DNA', 'models')
    const manifestPath = path.join(modelsDir, 'character_models.json')
    if (fs.existsSync(manifestPath)) {
      const data = JSON.parse(await fs.promises.readFile(manifestPath, 'utf-8'))
      return res.json(data)
    }
    if (fs.existsSync(modelsDir)) {
      const files = await fs.promises.readdir(modelsDir)
      const images = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f)).map(f => ({
        id: f.replace(/\.[^/.]+$/, '').toLowerCase(),
        name: f.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        tier: 'Standard Reference',
        filename: f,
        url: `/api/franchises/${franchiseId}/character-models/${f}`
      }))
      return res.json(images)
    }
    res.json([])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Stream Character Model Image
app.get('/api/franchises/:franchiseId/character-models/:filename', (req, res) => {
  const { franchiseId, filename } = req.params
  const filePath = path.resolve(projectRoot, '01_Franchises', franchiseId, '00_Series_Bible_and_Character_DNA', 'models', filename)

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filename).toLowerCase()
    res.setHeader('Content-Type', ext === '.png' ? 'image/png' : 'image/jpeg')
    const readStream = fs.createReadStream(filePath)
    readStream.pipe(res)
  } else {
    res.status(404).send('Character model file not found')
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
      videoState
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

// Trigger Multi-Master Cross-Episode Omnibus Lossless Stitcher
app.post('/api/episodes/:franchiseId/stitch-master-omnibus', async (req, res) => {
  try {
    const { franchiseId } = req.params
    const { masterFilePaths = [], outputFilename } = req.body || {}
    const result = await VideoService.stitchMasterOmnibus(franchiseId, masterFilePaths, outputFilename)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
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

// Stream Video (Master or Specific Batch Preview with HTTP Range Requests)
app.get('/api/episodes/:franchiseId/:episodeId/video-stream', (req, res) => {
  const { franchiseId, episodeId } = req.params
  const requestedFile = req.query.file ? path.basename(req.query.file) : '01_Episode_Master_1080p.mp4'
  const videoDir = VideoService.getVideoDir(franchiseId, episodeId)
  const videoPath = path.join(videoDir, requestedFile)

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send(`Compiled video (${requestedFile}) not found`)
  }

  const stat = fs.statSync(videoPath)
  const fileSize = stat.size
  const range = req.headers.range

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
    fs.createReadStream(videoPath).pipe(res)
  }
})

// YouTube Packaging & Release Suite (Titles, Description, Timestamps, 16:9 Thumbnail Prompts)
app.get('/api/episodes/:franchiseId/:episodeId/youtube-package', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const pkg = await PackagingService.generatePackage(franchiseId, episodeId)
    res.json(pkg)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Serve Thumbnail Image
app.get('/api/episodes/:franchiseId/:episodeId/thumbnail/:filename', (req, res) => {
  const { franchiseId, episodeId, filename } = req.params
  const safeFilename = path.basename(filename)
  const thumbPath = path.join(projectRoot, '01_Franchises', franchiseId, episodeId, 'thumbnails', safeFilename)
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
