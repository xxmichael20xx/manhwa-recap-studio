import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { FileService } from './services/fileService.js'
import { TtsService } from './services/ttsService.js'
import { AntiSlopValidator } from './services/antiSlopValidator.js'

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
    const { script } = req.body
    const result = await FileService.saveScript(franchiseId, episodeId, script)
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

// Stream Audio Files
app.get('/api/audio/:franchiseId/:episodeId/:filename', (req, res) => {
  const { franchiseId, episodeId, filename } = req.params
  const filePath = TtsService.getAudioFilePath(franchiseId, episodeId, filename)

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'audio/mpeg')
    const readStream = fs.createReadStream(filePath)
    readStream.pipe(res)
  } else {
    res.status(404).send('Audio file not found')
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
