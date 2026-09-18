import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { FileService } from './services/fileService.js'
import { TtsService } from './services/ttsService.js'
import { AntiSlopValidator } from './services/antiSlopValidator.js'
import { ImageService } from './services/imageService.js'
import { VideoService } from './services/videoService.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3101

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
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

// Stream Scene Image
app.get('/api/episodes/:franchiseId/:episodeId/images/:filename', (req, res) => {
  const { franchiseId, episodeId, filename } = req.params
  const filePath = ImageService.getImagePath(franchiseId, episodeId, filename)

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/png')
    const readStream = fs.createReadStream(filePath)
    readStream.pipe(res)
  } else {
    res.status(404).send('Image file not found')
  }
})

// Generate All Storyboard Stills (Tier 1 Fallback)
app.post('/api/episodes/:franchiseId/:episodeId/images/generate-storyboard', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const result = await ImageService.generateStoryboardStills(franchiseId, episodeId)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Manual Image Upload / Dropzone (Base64)
app.post('/api/episodes/:franchiseId/:episodeId/images/upload', async (req, res) => {
  try {
    const { franchiseId, episodeId } = req.params
    const { tag, base64Data } = req.body
    if (!tag || !base64Data) {
      return res.status(400).json({ error: 'tag and base64Data are required.' })
    }

    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
    await fs.promises.mkdir(imagesDir, { recursive: true })
    const targetPath = path.join(imagesDir, `${tag.toUpperCase()}.png`)

    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(cleanBase64, 'base64')
    await fs.promises.writeFile(targetPath, buffer)

    res.json({
      success: true,
      filename: `${tag.toUpperCase()}.png`,
      url: `/api/episodes/${franchiseId}/${episodeId}/images/${tag.toUpperCase()}.png`
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

    const videoState = VideoService.getStatus(franchiseId, episodeId)

    res.json({
      totalScenes: scenes.length,
      imagesReady,
      audioReady,
      hasMasterAudio,
      hasSubtitles: subtitles.hasSubtitles,
      hasVideo,
      videoSize,
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

// Video Compilation Progress & Status
app.get('/api/episodes/:franchiseId/:episodeId/video-status', (req, res) => {
  const { franchiseId, episodeId } = req.params
  res.json(VideoService.getStatus(franchiseId, episodeId))
})

// Stream Compiled Master Video (with HTTP Range Requests)
app.get('/api/episodes/:franchiseId/:episodeId/video-stream', (req, res) => {
  const { franchiseId, episodeId } = req.params
  const videoPath = VideoService.getMasterVideoPath(franchiseId, episodeId)

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Compiled video not found')
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
