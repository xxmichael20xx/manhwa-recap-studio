/**
 * Headless Multi-Core + GPU Batch Video Compiler (`studio/scripts/fast-compile.mjs`)
 *
 * Runs outside Express/Vite UI using Node `worker_threads` for parallel C++ Skia
 * (`@napi-rs/canvas`) rendering via `MotionEngine` and NVIDIA `h264_nvenc` for
 * Step 6 batch muxing, then calls `VideoService.stitchBatches()` for lossless
 * `-c copy` master assembly.
 *
 * Preserves 100% visual, motion, subtitle, watermark, and audio DSP parity with
 * `VideoService.compileEpisodeVideo()`.
 */

import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import readline from 'node:readline'
import { stdin as input, stdout as output } from 'node:process'
import { Worker, isMainThread, parentPort } from 'worker_threads'
import sharp from 'sharp'
import { VideoService } from '../server/services/videoService.js'
import { ImageService } from '../server/services/imageService.js'
import { TtsService } from '../server/services/ttsService.js'
import { MotionEngine } from '../server/services/motionEngine.js'
import { ActivityLogService } from '../server/services/activityLogService.js'
import { PackagingService } from '../server/services/packagingService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')
const franchisesDir = path.resolve(projectRoot, '01_Franchises')

// ============================================================================
// WORKER THREAD ENTRYPOINT: Parallel C++ Skia + NVENC Clip Renderer
// ============================================================================
if (!isMainThread) {
  const renderTask = async (task) => {
    const {
      imagePath,
      frames,
      motionIndex,
      clipPath,
      cachedClipPath,
      fresh,
      tag
    } = task

    const fps = 24
    const durationSec = Math.max(1.0, frames / 30)

    let isCachedValid = false
    if (!fresh && cachedClipPath && fsSync.existsSync(cachedClipPath)) {
      try {
        const imgStat = await fs.stat(imagePath)
        const cacheStat = await fs.stat(cachedClipPath)
        if (cacheStat.size > 5000 && cacheStat.mtimeMs >= imgStat.mtimeMs) {
          isCachedValid = true
        }
      } catch (_) {}
    }

    if (isCachedValid) {
      try {
        await fs.copyFile(cachedClipPath, clipPath)
        return { tag, frames, elapsedSec: 0.01, isCached: true }
      } catch (_) {
        isCachedValid = false
      }
    }

    const start = Date.now()
    try {
      await MotionEngine.renderSceneClip({
        imagePath,
        durationSec,
        fps,
        motionIndex,
        outputPath: clipPath,
        encoder: 'new_gpu'
      })
    } catch (err) {
      // Retry once with index 0 and CPU fallback if NVENC session cap is hit
      const fallbackEncoder = /nvenc|session|memory|resource/i.test(err.message) ? 'old_cpu' : 'new_gpu'
      await MotionEngine.renderSceneClip({
        imagePath,
        durationSec,
        fps,
        motionIndex: fallbackEncoder === 'new_gpu' ? 0 : motionIndex,
        outputPath: clipPath,
        encoder: fallbackEncoder
      })
    }

    if (cachedClipPath) {
      await fs.copyFile(clipPath, cachedClipPath).catch(() => {})
    }

    const elapsedSec = Number(((Date.now() - start) / 1000).toFixed(2))
    return { tag, frames, elapsedSec, isCached: false }
  }

  parentPort.on('message', async (msg) => {
    if (msg?.type === 'shutdown') {
      process.exit(0)
    }
    try {
      const result = await renderTask(msg.task)
      parentPort.postMessage({ id: msg.id, ok: true, result })
    } catch (err) {
      parentPort.postMessage({ id: msg.id, ok: false, error: err?.message || String(err) })
    }
  })
}

// ============================================================================
// MAIN THREAD HELPERS
// ============================================================================
const parseCliArgs = (argv) => {
  const args = argv.slice(2)
  const positional = []
  const opts = {
    workers: Math.min(6, Math.max(2, os.cpus().length - 2)),
    batches: null,
    actNumber: null,
    skipExisting: false,
    fresh: false,
    cpuMux: false,
    stitch: true,
    dryRun: false,
    kenBurns: true,
    burnSubtitles: true,
    bgmTrack: '01_Catacombs_SubBass_Drone.mp3',
    bgmVolume: -22,
    watermark: true,
    watermarkOpacity: 0.20,
    watermarkPosition: 'top_right'
  }

  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--workers' && args[i + 1]) {
      opts.workers = Math.max(1, Math.min(10, parseInt(args[++i], 10) || 4))
    } else if ((a === '--batch' || a === '--batches') && args[i + 1]) {
      opts.batches = parseBatchSpec(args[++i])
    } else if (a === '--act' && args[i + 1]) {
      opts.actNumber = parseInt(args[++i], 10) || null
    } else if (a === '--skip-existing') {
      opts.skipExisting = true
    } else if (a === '--fresh') {
      opts.fresh = true
    } else if (a === '--cpu-mux') {
      opts.cpuMux = true
    } else if (a === '--no-stitch') {
      opts.stitch = false
    } else if (a === '--no-subtitles') {
      opts.burnSubtitles = false
    } else if (a === '--no-watermark') {
      opts.watermark = false
    } else if (a === '--no-kenburns') {
      opts.kenBurns = false
    } else if (a === '--bgm' && args[i + 1]) {
      opts.bgmTrack = args[++i]
    } else if (a === '--bgm-vol' && args[i + 1]) {
      opts.bgmVolume = Number(args[++i])
    } else if (a === '--dry-run') {
      opts.dryRun = true
    } else if (a === '--help' || a === '-h') {
      opts.help = true
    } else if (!a.startsWith('-')) {
      positional.push(a)
    }
  }

  return { positional, opts }
}

/**
 * Parse 1-based batch specification like "3", "1,3,5", or "1-4,7" into 0-based indices.
 */
const parseBatchSpec = (spec) => {
  const indices = new Set()
  for (const part of String(spec).split(',')) {
    const trimmed = part.trim()
    const rangeMatch = trimmed.match(/^(\d+)-(\d+)$/)
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10)
      const end = parseInt(rangeMatch[2], 10)
      for (let n = Math.min(start, end); n <= Math.max(start, end); n++) {
        if (n >= 1) indices.add(n - 1)
      }
    } else if (/^\d+$/.test(trimmed)) {
      const n = parseInt(trimmed, 10)
      if (n >= 1) indices.add(n - 1)
    }
  }
  return Array.from(indices).sort((a, b) => a - b)
}

/**
 * Resolve exact or unambiguous prefix folder name inside parentDir.
 */
const resolveFolder = async (parentDir, query, label) => {
  const entries = await fs.readdir(parentDir, { withFileTypes: true })
  const dirs = entries.filter(e => e.isDirectory()).map(e => e.name)
  const exact = dirs.find(d => d === query)
  if (exact) return exact

  const lower = query.toLowerCase()
  const prefixMatches = dirs.filter(d => d.toLowerCase().startsWith(lower))
  if (prefixMatches.length === 1) return prefixMatches[0]

  const subMatches = dirs.filter(d => d.toLowerCase().includes(lower))
  if (subMatches.length === 1) return subMatches[0]

  const candidates = prefixMatches.length > 0 ? prefixMatches : subMatches
  if (candidates.length > 1) {
    throw new Error(`Ambiguous ${label} "${query}". Matches:\n  - ${candidates.join('\n  - ')}`)
  }
  throw new Error(`${label} "${query}" not found in ${parentDir}`)
}

/**
 * Persistent worker pool reusing worker_threads across all clips and batches.
 */
class ClipWorkerPool {
  constructor(size) {
    this.size = size
    this.workers = []
    this.idle = []
    this.queue = []
    this.pending = new Map()
    this.nextId = 1

    for (let i = 0; i < size; i++) {
      const w = new Worker(__filename, { workerData: { workerIdx: i } })
      w.on('message', (msg) => this.#onMessage(w, msg))
      w.on('error', (err) => console.error(`[Worker ${i}] error:`, err))
      this.workers.push(w)
      this.idle.push(w)
    }
  }

  run(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
      this.#dispatch()
    })
  }

  #dispatch() {
    while (this.idle.length > 0 && this.queue.length > 0) {
      const w = this.idle.shift()
      const job = this.queue.shift()
      const id = this.nextId++
      this.pending.set(id, { ...job, worker: w })
      w.postMessage({ id, task: job.task })
    }
  }

  #onMessage(w, msg) {
    const entry = this.pending.get(msg.id)
    if (!entry) return
    this.pending.delete(msg.id)
    this.idle.push(w)
    if (msg.ok) entry.resolve(msg.result)
    else entry.reject(new Error(msg.error))
    this.#dispatch()
  }

  async close() {
    await Promise.all(this.workers.map(w => w.terminate()))
  }
}

const CPU_MUX_ENCODER = {
  name: 'libx264',
  label: 'CPU libx264 (veryfast stillimage CRF 22)',
  args: ['-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'stillimage', '-crf', '22', '-pix_fmt', 'yuv420p']
}

/**
 * Probe the best quality/compression VBR H.264 mux encoder on this host:
 * NVIDIA NVENC (VBR CQ 24) -> CPU libx264 (veryfast stillimage CRF 22).
 * Excludes fixed-bitrate h264_mf (-b:v 8M) from Step 6 so 9:16 and 16:9 masters stay compact.
 */
const detectMuxEncoder = async (cpuOnly = false) => {
  if (cpuOnly) return CPU_MUX_ENCODER
  const candidates = [
    {
      name: 'h264_nvenc',
      label: 'GPU h264_nvenc (VBR CQ 24)',
      args: ['-c:v', 'h264_nvenc', '-preset', 'p4', '-rc', 'vbr', '-cq', '24', '-b:v', '0', '-pix_fmt', 'yuv420p']
    }
  ]

  for (const cand of candidates) {
    const ok = await new Promise((resolve) => {
      const p = spawn('ffmpeg', [
        '-y', '-f', 'lavfi', '-i', 'color=c=black:s=256x256:d=0.04',
        ...cand.args,
        '-f', 'null', '-'
      ])
      p.on('close', code => resolve(code === 0))
      p.on('error', () => resolve(false))
    })
    if (ok) return cand
  }
  return CPU_MUX_ENCODER
}

const resolveBeatImagePath = (tag, globalBeatIdx, existingFiles, imagesDir) => {
  const variants = [
    `${tag}.jpg`,
    `${tag}.png`,
    `${tag.replace('_', '')}.jpg`,
    `${tag.replace('_', '')}.png`
  ]
  let filename = variants.find(v => existingFiles.includes(v))
  if (!filename && existingFiles.length > 0) {
    filename = existingFiles[globalBeatIdx % existingFiles.length]
  }
  if (!filename) filename = `${tag}.jpg`
  return path.join(imagesDir, filename)
}

const buildBatchSrt = async (srtPath, batchStartTime, batchDuration, outSrtPath) => {
  const rawCues = await VideoService.parseSrtCues(srtPath)
  const formatTm = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0')
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
    const s = String(Math.floor(sec % 60)).padStart(2, '0')
    const ms = String(Math.floor((sec % 1) * 1000)).padStart(3, '0')
    return `${h}:${m}:${s},${ms}`
  }

  const batchCues = rawCues
    .filter(c => c.endSec > batchStartTime && c.startSec < (batchStartTime + batchDuration))
    .map((c, idx) => {
      const newStart = Math.max(0, c.startSec - batchStartTime)
      const newEnd = Math.max(newStart + 0.1, c.endSec - batchStartTime)
      return `${idx + 1}\n${formatTm(newStart)} --> ${formatTm(newEnd)}\n${c.text}`
    })

  await fs.writeFile(outSrtPath, batchCues.join('\n\n'), 'utf-8')
}

const computeWatermarkLayout = async (targetBeats, existingFiles, imagesDir, watermarkPosition) => {
  let isVerticalDeck = false
  if (targetBeats.length > 0 && existingFiles.length > 0) {
    const samplePath = resolveBeatImagePath(targetBeats[0].tag, 0, existingFiles, imagesDir)
    if (fsSync.existsSync(samplePath)) {
      try {
        const meta = await sharp(samplePath).metadata()
        isVerticalDeck = (meta.width / meta.height) < 0.95
      } catch (_) {}
    }
  }

  const watermarkScale = isVerticalDeck ? 200 : 240
  let overlayExpr = 'W-w-36:36'

  if (isVerticalDeck) {
    const stripW = 680
    const stripLeft = `(W-${stripW})/2`
    const stripRight = `(W+${stripW})/2`
    if (watermarkPosition === 'top_left') overlayExpr = `${stripLeft}+20:36`
    else if (watermarkPosition === 'bottom_right') overlayExpr = `${stripRight}-w-20:H-h-36`
    else if (watermarkPosition === 'bottom_left') overlayExpr = `${stripLeft}+20:H-h-36`
    else if (watermarkPosition === 'custom_user') overlayExpr = `${stripLeft}+${stripW}*0.65-w/2:H*0.75-h/2`
    else if (watermarkPosition === 'center') overlayExpr = '(W-w)/2:(H-h)/2'
    else overlayExpr = `${stripRight}-w-20:36`
  } else {
    if (watermarkPosition === 'top_left') overlayExpr = '36:36'
    else if (watermarkPosition === 'bottom_right') overlayExpr = 'W-w-36:H-h-36'
    else if (watermarkPosition === 'bottom_left') overlayExpr = '36:H-h-36'
    else if (watermarkPosition === 'custom_user') overlayExpr = 'W*0.65-w/2:H*0.75-h/2'
    else if (watermarkPosition === 'center') overlayExpr = '(W-w)/2:(H-h)/2'
  }

  return { watermarkScale, overlayExpr }
}

const muxBatch = async ({
  franchiseId,
  episodeId,
  batchCode,
  concatListPath,
  masterAudioPath,
  batchStartTime,
  batchDuration,
  effectiveSrtPath,
  targetBeats,
  existingFiles,
  imagesDir,
  targetVideoPath,
  opts,
  muxEncoder
}) => {
  const cleanTempSrt = path.join(os.tmpdir(), `sub_${franchiseId}_${episodeId}_${batchCode}_${Date.now()}.srt`)
  await fs.copyFile(effectiveSrtPath, cleanTempSrt).catch(() => {})
  const safeSrtPath = cleanTempSrt.replace(/\\/g, '/').replace(/:/g, '\\:')

  const bgmDir = path.resolve(projectRoot, 'assets/audio/bgm')
  let bgmPath = null
  if (opts.bgmTrack && opts.bgmTrack !== 'none') {
    const candidate = path.join(bgmDir, opts.bgmTrack)
    if (fsSync.existsSync(candidate)) bgmPath = candidate
  }

  const brandDir = path.resolve(projectRoot, 'assets/brand')
  let watermarkPath = null
  if (opts.watermark) {
    const t = path.join(brandDir, 'recap_runic_logo_transparent.png')
    const d = path.join(brandDir, 'recap_runic_logo.jpg')
    if (fsSync.existsSync(t)) watermarkPath = t
    else if (fsSync.existsSync(d)) watermarkPath = d
  }

  const { watermarkScale, overlayExpr } = await computeWatermarkLayout(
    targetBeats,
    existingFiles,
    imagesDir,
    opts.watermarkPosition
  )
  const safeOpacity = Math.max(0.05, Math.min(1.0, Number(opts.watermarkOpacity) || 0.20))
  const subStyle = "force_style='FontSize=20,FontName=Arial,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2.5,Shadow=1.5,Alignment=2,MarginV=42'"

  let nextInputIdx = 2
  const bgmInputIdx = bgmPath ? nextInputIdx++ : null
  const watermarkInputIdx = watermarkPath ? nextInputIdx++ : null

  const filterParts = []
  if (opts.burnSubtitles) {
    if (watermarkPath) {
      filterParts.push(`[0:v]subtitles='${safeSrtPath}':${subStyle}[v_sub]`)
      filterParts.push(`[${watermarkInputIdx}:v]scale=${watermarkScale}:-1,format=rgba,colorchannelmixer=aa=${safeOpacity}[wm_faded]`)
      filterParts.push(`[v_sub][wm_faded]overlay=${overlayExpr}:format=auto[v]`)
    } else {
      filterParts.push(`[0:v]subtitles='${safeSrtPath}':${subStyle}[v]`)
    }
  } else if (watermarkPath) {
    filterParts.push(`[0:v]null[v_sub]`)
    filterParts.push(`[${watermarkInputIdx}:v]scale=${watermarkScale}:-1,format=rgba,colorchannelmixer=aa=${safeOpacity}[wm_faded]`)
    filterParts.push(`[v_sub][wm_faded]overlay=${overlayExpr}:format=auto[v]`)
  } else {
    filterParts.push(`[0:v]null[v]`)
  }

  if (bgmPath) {
    const calibratedGain = (Number.isFinite(Number(opts.bgmVolume)) ? Number(opts.bgmVolume) : -22) + 33
    const gainStr = calibratedGain >= 0 ? `+${calibratedGain}` : `${calibratedGain}`
    filterParts.push(`[1:a]volume=1.0,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asplit=2[vo_main][vo_sc]`)
    filterParts.push(`[${bgmInputIdx}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${gainStr}dB[bgm_base]`)
    filterParts.push(`[bgm_base][vo_sc]sidechaincompress=threshold=0.08:ratio=2.5:attack=15:release=320:link=average[bgm_ducked]`)
    filterParts.push(`[vo_main][bgm_ducked]amix=inputs=2:duration=first:dropout_transition=2:normalize=false,loudnorm=I=-14:TP=-1.5:LRA=7[aout]`)
  } else {
    filterParts.push(`[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,loudnorm=I=-14:TP=-1.5:LRA=7[aout]`)
  }

  const ffmpegArgs = [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', concatListPath.replace(/\\/g, '/'),
    '-ss', String(batchStartTime),
    '-t', String(batchDuration),
    '-i', masterAudioPath.replace(/\\/g, '/')
  ]
  if (bgmPath) ffmpegArgs.push('-stream_loop', '-1', '-i', bgmPath.replace(/\\/g, '/'))
  if (watermarkPath) ffmpegArgs.push('-loop', '1', '-i', watermarkPath.replace(/\\/g, '/'))

  const videoEncoderArgs = (muxEncoder && Array.isArray(muxEncoder.args))
    ? muxEncoder.args
    : CPU_MUX_ENCODER.args

  ffmpegArgs.push(
    '-filter_complex', filterParts.join(';'),
    '-map', '[v]',
    '-map', '[aout]',
    ...videoEncoderArgs,
    '-movflags', '+faststart',
    '-r', '24',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-ar', '48000',
    '-ac', '2',
    '-shortest',
    targetVideoPath.replace(/\\/g, '/')
  )

  return new Promise((resolve, reject) => {
    let stderr = ''
    const proc = spawn('ffmpeg', ffmpegArgs, { cwd: projectRoot })
    proc.stderr.on('data', d => { stderr += d.toString() })
    proc.on('close', async (code) => {
      await fs.unlink(cleanTempSrt).catch(() => {})
      if (code === 0) resolve()
      else reject(new Error(`FFmpeg mux failed (${code}): ${stderr.slice(-800)}`))
    })
    proc.on('error', reject)
  })
}

const isBatchUpToDate = async (videoDir, batchCode, batchIdxNum, totalScenes, imagesDir) => {
  const candidate = path.join(videoDir, `01_Episode_Batch_${batchCode}_Preview.mp4`)
  if (!fsSync.existsSync(candidate)) return false
  try {
    const stat = await fs.stat(candidate)
    if (stat.size < 100000) return false
    const dur = await VideoService.getVideoDuration(candidate)
    if (!dur) return false

    const startScene = batchIdxNum * 24 + 1
    const endScene = Math.min((batchIdxNum + 1) * 24, totalScenes)
    for (let s = startScene; s <= endScene; s++) {
      const imgNum = String(s).padStart(3, '0')
      for (const ext of ['.jpg', '.png']) {
        const imgPath = path.join(imagesDir, `IMG_${imgNum}${ext}`)
        if (fsSync.existsSync(imgPath)) {
          const imgStat = await fs.stat(imgPath)
          if (imgStat.mtimeMs > stat.mtimeMs) return false
        }
      }
    }
    return true
  } catch (_) {
    return false
  }
}

const resolveBibleVoice = async (franchiseId) => {
  let voice = 'en-GB-RyanNeural'
  try {
    const fJsonPath = path.join(franchisesDir, franchiseId, 'franchise.json')
    if (fsSync.existsSync(fJsonPath)) {
      const fj = JSON.parse(await fs.readFile(fJsonPath, 'utf-8'))
      if (fj.voice?.id) voice = fj.voice.id
    }
    const biblePath = path.join(franchisesDir, franchiseId, '00_Series_Bible_and_Character_DNA', 'Series_Bible.md')
    if (fsSync.existsSync(biblePath)) {
      const bText = await fs.readFile(biblePath, 'utf-8')
      const m = bText.match(/<!--\s*STUDIO_BIBLE_DIRECTIVES_START\s*([\s\S]*?)\s*STUDIO_BIBLE_DIRECTIVES_END\s*-->/)
      if (m?.[1]) {
        const parsed = JSON.parse(m[1].trim())
        if (parsed.voiceId) voice = parsed.voiceId
      }
    }
  } catch (_) {}
  return voice
}

const getEpisodeReadiness = async (franchiseId, episodeId) => {
  const epDir = path.join(franchisesDir, franchiseId, episodeId)
  const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
  const audioPath = path.join(TtsService.getAudioDir(franchiseId, episodeId), '01_Episode_Master.mp3')
  const srtPath = path.join(TtsService.getSubtitlesDir(franchiseId, episodeId), '01_Episode_Subtitles.srt')
  const masterPath = VideoService.getMasterVideoPath(franchiseId, episodeId)

  const matrixScenes = await ImageService.getPromptMatrixScenes(franchiseId, episodeId).catch(() => [])
  const expectedCount = matrixScenes.length
  const existingFiles = fsSync.existsSync(imagesDir) ? await fs.readdir(imagesDir) : []
  const imgFiles = existingFiles.filter(f => /\.(jpg|jpeg|png)$/i.test(f))

  const missingTags = []
  for (const s of matrixScenes) {
    const tag = s.tag
    const variants = [`${tag}.jpg`, `${tag}.png`, `${tag.replace('_', '')}.jpg`, `${tag.replace('_', '')}.png`]
    if (!variants.some(v => existingFiles.includes(v))) {
      missingTags.push(tag)
    }
  }

  return {
    hasScript: fsSync.existsSync(path.join(epDir, '01_Episode_Script.md')),
    hasMatrix: fsSync.existsSync(path.join(epDir, '02_Prompt_Matrix.md')),
    expectedCount,
    imageCount: imgFiles.length,
    missingTags,
    hasAudio: fsSync.existsSync(audioPath),
    hasSrt: fsSync.existsSync(srtPath),
    hasMaster: fsSync.existsSync(masterPath)
  }
}

const generateAudioAndTelemetry = async (franchiseId, episodeId, voice) => {
  console.log(`\n▶ Synthesizing EdgeTTS audio + SRT for ${franchiseId}/${episodeId} (voice: ${voice})...`)
  const result = await TtsService.generateEpisodeAudio(franchiseId, episodeId, voice, { force: false })
  const epDir = path.join(franchisesDir, franchiseId, episodeId)
  const sceneDurations = {}
  for (const f of result.files || []) {
    const sKey = `IMG_${String(f.scene).padStart(3, '0')}`
    sceneDurations[sKey] = Number(((f.durationMs || 0) / 1000).toFixed(3))
  }
  const telemetryPath = path.join(epDir, 'audio_telemetry.json')
  const narrativeHash = await TtsService.computeNarrativeHash(franchiseId, episodeId)
  await fs.writeFile(telemetryPath, JSON.stringify({
    franchiseId,
    episodeId,
    voiceId: result.voice || voice,
    totalDurationSeconds: Number(((result.totalDurationMs || 0) / 1000).toFixed(3)),
    generatedCount: result.generatedCount,
    narrativeHash,
    measuredAt: new Date().toISOString(),
    sceneDurations
  }, null, 2), 'utf-8')
  console.log(`✓ Audio ready: ${(result.totalDurationMs / 1000).toFixed(1)}s, ${result.subtitleCount} SRT cues.`)
}

const createPromptHelper = () => {
  const rl = readline.createInterface({ input, output })
  const lineQueue = []
  const waiters = []
  let closed = false

  rl.on('line', (line) => {
    if (waiters.length > 0) {
      const resolve = waiters.shift()
      resolve(line)
    } else {
      lineQueue.push(line)
    }
  })

  rl.on('close', () => {
    closed = true
    while (waiters.length > 0) {
      const resolve = waiters.shift()
      resolve('')
    }
  })

  const ask = (promptText) => {
    output.write(promptText)
    if (lineQueue.length > 0) {
      const next = lineQueue.shift()
      if (!input.isTTY) output.write(`${next}\n`)
      return Promise.resolve(next)
    }
    if (closed) return Promise.resolve('')
    return new Promise((resolve) => waiters.push(resolve))
  }

  return { ask, close: () => rl.close() }
}

const runInteractiveWizard = async (opts) => {
  const prompt = createPromptHelper()
  try {
    console.log('════════════════════════════════════════════════════════════════')
    console.log('⚡ MANHWA FAST-COMPILE WIZARD (Headless Worker Threads)')
    console.log('════════════════════════════════════════════════════════════════')

    const franchiseDirs = (await fs.readdir(franchisesDir, { withFileTypes: true }))
      .filter(d => d.isDirectory() && d.name.startsWith('Series_'))
      .map(d => d.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    if (franchiseDirs.length === 0) throw new Error(`No Series_* folders found in ${franchisesDir}`)

    const retiredSeriesPrefixes = ['Series_01_', 'Series_02_', 'Series_03_']

    console.log('\nSelect Series:')
    for (let i = 0; i < franchiseDirs.length; i++) {
      const fId = franchiseDirs[i]
      const isRetired = retiredSeriesPrefixes.some(p => fId.startsWith(p))
      let pendingCount = 0
      if (!isRetired) {
        const epEntries = (await fs.readdir(path.join(franchisesDir, fId), { withFileTypes: true }))
          .filter(e => e.isDirectory() && /^EP\d+/i.test(e.name))
        for (const ep of epEntries) {
          const imgs = fsSync.existsSync(path.join(franchisesDir, fId, ep.name, 'images'))
            ? (await fs.readdir(path.join(franchisesDir, fId, ep.name, 'images'))).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).length
            : 0
          const hasMaster = fsSync.existsSync(VideoService.getMasterVideoPath(fId, ep.name))
          if (imgs > 0 && !hasMaster) pendingCount++
        }
      }
      const badge = pendingCount > 0 ? ` [⏳ ${pendingCount} pending]` : ''
      console.log(`  [${i + 1}] ${fId}${badge}`)
    }

    const sAns = (await prompt.ask('\nEnter Series # (e.g. 7): ')).trim()
    const sIdx = parseInt(sAns, 10) - 1
    if (isNaN(sIdx) || sIdx < 0 || sIdx >= franchiseDirs.length) {
      throw new Error(`Invalid series selection: "${sAns}"`)
    }
    const franchiseId = franchiseDirs[sIdx]

    const epDirs = (await fs.readdir(path.join(franchisesDir, franchiseId), { withFileTypes: true }))
      .filter(d => d.isDirectory() && /^EP\d+/i.test(d.name))
      .map(d => d.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    if (epDirs.length === 0) throw new Error(`No EP* folders found in ${franchiseId}`)

    console.log(`\nEpisodes in ${franchiseId}:`)
    let defaultEpIdx = epDirs.length - 1
    const epStatuses = []
    for (let i = 0; i < epDirs.length; i++) {
      const st = await getEpisodeReadiness(franchiseId, epDirs[i])
      epStatuses.push(st)
      const imgLabel = st.expectedCount > 0 ? `${st.imageCount}/${st.expectedCount}` : `${st.imageCount}`
      const audLabel = st.hasAudio && st.hasSrt ? 'audio=OK' : 'audio=MISSING'
      const masterLabel = st.hasMaster ? 'master=OK' : (st.imageCount > 0 ? '⏳ PENDING' : 'empty')
      if (st.imageCount > 0 && !st.hasMaster) defaultEpIdx = i
      console.log(`  [${i + 1}] ${epDirs[i]}  (imgs=${imgLabel}, ${audLabel}, ${masterLabel})`)
    }

    const eAns = (await prompt.ask(`\nEnter Episode # [default ${defaultEpIdx + 1}]: `)).trim()
    const eIdx = eAns === '' ? defaultEpIdx : (parseInt(eAns, 10) - 1)
    if (isNaN(eIdx) || eIdx < 0 || eIdx >= epDirs.length) {
      throw new Error(`Invalid episode selection: "${eAns}"`)
    }
    const episodeId = epDirs[eIdx]
    const status = epStatuses[eIdx]

    console.log('\n── Pre-Flight Validation ───────────────────────────────────────')
    console.log(`Script : ${status.hasScript ? 'OK' : 'MISSING'} | Matrix: ${status.hasMatrix ? 'OK' : 'MISSING'}`)
    console.log(`Images : ${status.imageCount}/${status.expectedCount || '?'} plates`)
    console.log(`Audio  : ${status.hasAudio ? 'OK' : 'MISSING'} | SRT: ${status.hasSrt ? 'OK' : 'MISSING'}`)

    if (!status.hasScript || !status.hasMatrix) {
      throw new Error('Missing 01_Episode_Script.md or 02_Prompt_Matrix.md.')
    }
    if (status.imageCount === 0) {
      throw new Error(`No images found in ${episodeId}/images/. Assign images in the Studio UI first.`)
    }
    if (status.missingTags.length > 0) {
      const preview = status.missingTags.slice(0, 12).join(', ')
      const extra = status.missingTags.length > 12 ? ` (+${status.missingTags.length - 12} more)` : ''
      console.warn(`⚠ Missing ${status.missingTags.length} scene image(s): ${preview}${extra}`)
      const cont = (await prompt.ask('Continue anyway with fallback matching? [y/N]: ')).trim().toLowerCase()
      if (cont !== 'y' && cont !== 'yes') {
        throw new Error('Halted: finish assigning missing images in the Studio UI first.')
      }
    }

    if (!status.hasAudio || !status.hasSrt) {
      const voice = await resolveBibleVoice(franchiseId)
      const genAns = (await prompt.ask(`\nAudio/SRT missing. Generate EdgeTTS audio + SRT now (voice: ${voice})? [Y/n]: `)).trim().toLowerCase()
      if (genAns === '' || genAns === 'y' || genAns === 'yes') {
        await generateAudioAndTelemetry(franchiseId, episodeId, voice)
      } else {
        throw new Error('Halted: cannot compile video without 01_Episode_Master.mp3 and SRT.')
      }
    }

    console.log('\nCompile Mode:')
    console.log('  [1] Full Compile Episode (smart-skip up-to-date batches + stitch Episode Master)')
    console.log('  [2] Pure Fresh All (purge clip_cache + re-render all batches + stitch)')
    console.log('  [3] Specific Batches only (e.g. 1-4 or 3)')
    console.log('  [4] Dry-run check only (no video written)')
    console.log('  [5] Compile & Stitch Full Act (syncs YouTube_ActN_Launch_Package.md + thumbnail)')
    const modeAns = (await prompt.ask('Select mode [1]: ')).trim() || '1'

    if (modeAns === '1') {
      opts.skipExisting = true
    } else if (modeAns === '2') {
      opts.fresh = true
    } else if (modeAns === '3') {
      const spec = (await prompt.ask('Enter batch range/list (e.g. 1-4 or 2,5): ')).trim()
      opts.batches = parseBatchSpec(spec)
    } else if (modeAns === '4') {
      opts.dryRun = true
    } else if (modeAns === '5') {
      const acts = await PackagingService.parseSeriesActs(franchiseId)
      if (acts.length === 0) throw new Error(`No Acts parsed for ${franchiseId}`)
      console.log('\nAvailable Acts:')
      for (const a of acts) {
        console.log(`  [${a.actNumber}] Act ${a.actNumber}: ${a.title} (${a.rangeLabel}) ${a.hasCompiledAct ? '✓ compiled' : '⏳ pending'}`)
      }
      const detected = await PackagingService.detectActForEpisodes(franchiseId, [episodeId])
      const aAns = (await prompt.ask(`Enter Act # [default ${detected.actNumber}]: `)).trim()
      opts.actNumber = aAns ? parseInt(aAns, 10) : detected.actNumber
      opts.skipExisting = true
    } else {
      throw new Error(`Invalid compile mode selection: "${modeAns}"`)
    }

    return { franchiseId, episodeId }
  } finally {
    prompt.close()
  }
}

const printUsage = () => {
  console.log(`
Usage:
  node studio/scripts/fast-compile.mjs                  (Interactive Wizard Mode)
  node studio/scripts/fast-compile.mjs <franchiseId> <episodeId> [options]
  node studio/scripts/fast-compile.mjs <franchiseId> --act <N> [options]

Examples:
  node studio/scripts/fast-compile.mjs
  node studio/scripts/fast-compile.mjs Series_07 EP07
  node studio/scripts/fast-compile.mjs Series_07 --act 2
  node studio/scripts/fast-compile.mjs Series_07_The_Obsidian_Spellsword EP07_The_Heresy_Summons_and_The_Frozen_Spire --skip-existing
  node studio/scripts/fast-compile.mjs Series_07 EP07 --batches 1-4 --workers 6
  node studio/scripts/fast-compile.mjs Series_07 EP07 --dry-run

Options:
  --act N           Compile & stitch all episodes in Act N + auto-update YouTube_ActN_Launch_Package.md
  --workers N       Parallel Skia worker threads (default: 6, max: 10)
  --batch SPEC      1-based batch index/range/list (e.g. 1, 1-4, 2,5,8)
  --skip-existing   Skip batches whose Preview MP4 is newer than all source images
  --fresh           Purge clip_cache and existing Batch Preview MP4s before compiling
  --cpu-mux         Use CPU libx264 for final batch mux instead of GPU h264_nvenc
  --no-stitch       Compile batch previews only; skip lossless Master stitch
  --no-subtitles    Skip burning SRT subtitles
  --no-watermark    Skip brand watermark overlay
  --no-kenburns     Disable motion index cycling (motionIndex=0)
  --bgm FILE        BGM filename in assets/audio/bgm/ or "none" (default: 01_Catacombs_SubBass_Drone.mp3)
  --bgm-vol DB      BGM volume offset in dB (default: -22)
  --dry-run         Validate audio, timeline, images, and cache hits without rendering
`.trim())
}

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================
if (isMainThread) {
  const { positional, opts } = parseCliArgs(process.argv)

  if (opts.help) {
    printUsage()
    process.exit(0)
  }

  const compileEpisode = async (franchiseId, episodeId) => {

    const imagesDir = ImageService.getImagesDir(franchiseId, episodeId)
    const audioDir = TtsService.getAudioDir(franchiseId, episodeId)
    const subtitlesDir = TtsService.getSubtitlesDir(franchiseId, episodeId)
    const videoDir = VideoService.getVideoDir(franchiseId, episodeId)
    const clipCacheDir = path.resolve(projectRoot, '.tmp', 'clip_cache', franchiseId, episodeId)

    const masterAudioPath = path.join(audioDir, '01_Episode_Master.mp3')
    const srtPath = path.join(subtitlesDir, '01_Episode_Subtitles.srt')

    if (!fsSync.existsSync(masterAudioPath)) {
      throw new Error(`Missing master audio: ${masterAudioPath}. Generate Stage 2 Voiceover first.`)
    }

    const existingImages = fsSync.existsSync(imagesDir) ? await fs.readdir(imagesDir) : []
    const imgFilesOnly = existingImages.filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    if (imgFilesOnly.length === 0) {
      throw new Error(`No scene images found in ${imagesDir}. Generate/save scene plates first.`)
    }

    const totalDuration = await VideoService.getAudioDuration(masterAudioPath)
    const fullBeats = await VideoService.parseDynamicTimeline(franchiseId, episodeId, totalDuration)
    const batchSize = 24
    const totalBatches = Math.ceil(fullBeats.length / batchSize)
    const targetBatchIndices = opts.batches
      ? opts.batches.filter(b => b >= 0 && b < totalBatches)
      : Array.from({ length: totalBatches }, (_, i) => i)

    if (targetBatchIndices.length === 0) {
      throw new Error(`No valid batches matched. Episode has ${totalBatches} batches (${fullBeats.length} cuts).`)
    }

    const muxEncoder = await detectMuxEncoder(opts.cpuMux)

    console.log('════════════════════════════════════════════════════════════════')
    console.log('⚡ MANHWA FAST-COMPILE CLI (Worker Threads + Hardware Mux)')
    console.log('════════════════════════════════════════════════════════════════')
    console.log(`Franchise : ${franchiseId}`)
    console.log(`Episode   : ${episodeId}`)
    console.log(`Images    : ${imgFilesOnly.length} files | Timeline Cuts: ${fullBeats.length} (${totalBatches} batches)`)
    console.log(`Audio     : ${totalDuration.toFixed(1)}s | SRT: ${fsSync.existsSync(srtPath) ? 'OK' : 'MISSING'}`)
    console.log(`Workers   : ${opts.workers} parallel Skia threads | Step-6 Mux: ${muxEncoder.label}`)
    console.log(`Batches   : ${targetBatchIndices.map(b => String(b + 1).padStart(2, '0')).join(', ')}`)
    console.log('════════════════════════════════════════════════════════════════')

    if (opts.dryRun) {
      let cacheHits = 0
      for (const bIdx of targetBatchIndices) {
        const start = bIdx * batchSize
        const slice = fullBeats.slice(start, start + batchSize)
        for (let i = 0; i < slice.length; i++) {
          const beat = slice[i]
          const globalIdx = start + i
          const cacheKey = `${beat.tag}_f${beat.frames}_m${opts.kenBurns ? globalIdx : 0}_sp20.mp4`
          if (fsSync.existsSync(path.join(clipCacheDir, cacheKey))) cacheHits++
        }
      }
      console.log(`Dry-run complete: ${cacheHits} cached clips available. Ready to compile.`)
      return
    }

    await fs.mkdir(videoDir, { recursive: true })
    await fs.mkdir(clipCacheDir, { recursive: true })

    if (opts.fresh) {
      console.log('Purging clip_cache and existing Batch Preview MP4s (--fresh)...')
      await fs.rm(clipCacheDir, { recursive: true, force: true })
      await fs.mkdir(clipCacheDir, { recursive: true })
      const vFiles = await fs.readdir(videoDir)
      for (const vf of vFiles) {
        if (vf.startsWith('01_Episode_Batch_') && vf.endsWith('.mp4')) {
          await fs.unlink(path.join(videoDir, vf)).catch(() => {})
        }
      }
    }

    const pool = new ClipWorkerPool(opts.workers)

    try {
      for (const bIdx of targetBatchIndices) {
        const batchCode = String(bIdx + 1).padStart(2, '0')
        const batchStartWall = Date.now()
        const outputFilename = `01_Episode_Batch_${batchCode}_Preview.mp4`
        const targetVideoPath = path.join(videoDir, outputFilename)

        if (opts.skipExisting && await isBatchUpToDate(videoDir, batchCode, bIdx, fullBeats.length, imagesDir)) {
          console.log(`⏩ [Batch ${batchCode}] Up to date on disk — skipping.`)
          continue
        }

        const startIdx = bIdx * batchSize
        const endIdx = Math.min(startIdx + batchSize, fullBeats.length)
        const targetBeats = fullBeats.slice(startIdx, endIdx)
        const batchStartTime = targetBeats[0].startTime
        const batchEndTime = targetBeats[targetBeats.length - 1].endTime
        const batchDuration = Math.max(0.1, batchEndTime - batchStartTime)

        const sessionNonce = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        const tempClipsDir = path.resolve(projectRoot, '.tmp', `fast_clips_${franchiseId}_${episodeId}_b${batchCode}_${sessionNonce}`)
        await fs.mkdir(tempClipsDir, { recursive: true })

        console.log(`\n▶ [Batch ${batchCode}] Rendering ${targetBeats.length} cuts (${batchDuration.toFixed(1)}s) across ${opts.workers} workers...`)

        let doneCount = 0
        const clipPaths = new Array(targetBeats.length)

        await Promise.all(targetBeats.map(async (beat, localIdx) => {
          const globalBeatIdx = startIdx + localIdx
          const clipPath = path.join(tempClipsDir, `clip_${String(localIdx).padStart(3, '0')}.mp4`)
          const imagePath = resolveBeatImagePath(beat.tag, globalBeatIdx, existingImages, imagesDir)
          const cacheKey = `${beat.tag}_f${beat.frames}_m${opts.kenBurns ? globalBeatIdx : 0}_sp20.mp4`
          const cachedClipPath = path.join(clipCacheDir, cacheKey)

          const res = await pool.run({
            imagePath,
            frames: beat.frames,
            motionIndex: opts.kenBurns ? globalBeatIdx : 0,
            clipPath,
            cachedClipPath,
            fresh: opts.fresh,
            tag: beat.tag
          })

          clipPaths[localIdx] = clipPath
          doneCount++
          const statusLabel = res.isCached ? '⚡ cached' : `${res.elapsedSec}s`
          process.stdout.write(`  [${batchCode}] ${doneCount}/${targetBeats.length} ${res.tag} (${statusLabel})\n`)
        }))

        const concatListPath = path.join(tempClipsDir, 'concat_list.txt')
        await fs.writeFile(
          concatListPath,
          clipPaths.map(c => `file '${c.replace(/\\/g, '/')}'`).join('\n'),
          'utf-8'
        )

        let effectiveSrtPath = srtPath
        if (opts.burnSubtitles) {
          const batchSrtPath = path.join(tempClipsDir, `batch_${batchCode}_subtitles.srt`)
          await buildBatchSrt(srtPath, batchStartTime, batchDuration, batchSrtPath)
          effectiveSrtPath = batchSrtPath
        }

        const muxStart = Date.now()
        console.log(`  [${batchCode}] Muxing + Subtitles + Watermark + BGM (${muxEncoder.name})...`)

        try {
          await muxBatch({
            franchiseId,
            episodeId,
            batchCode,
            concatListPath,
            masterAudioPath,
            batchStartTime,
            batchDuration,
            effectiveSrtPath,
            targetBeats,
            existingFiles: existingImages,
            imagesDir,
            targetVideoPath,
            opts,
            muxEncoder
          })
        } catch (muxErr) {
          if (muxEncoder.name !== 'libx264') {
            console.warn(`  [${batchCode}] ${muxEncoder.name} mux failed (${muxErr.message.slice(0, 120)}), retrying with libx264...`)
            await muxBatch({
              franchiseId,
              episodeId,
              batchCode,
              concatListPath,
              masterAudioPath,
              batchStartTime,
              batchDuration,
              effectiveSrtPath,
              targetBeats,
              existingFiles: existingImages,
              imagesDir,
              targetVideoPath,
              opts,
              muxEncoder: CPU_MUX_ENCODER
            })
          } else {
            throw muxErr
          }
        } finally {
          await fs.rm(tempClipsDir, { recursive: true, force: true }).catch(() => {})
        }

        const muxSec = ((Date.now() - muxStart) / 1000).toFixed(1)
        const batchSec = ((Date.now() - batchStartWall) / 1000).toFixed(1)
        const spec = await VideoService.auditStreamSpecs(targetVideoPath)
        console.log(`✓ [Batch ${batchCode}] Complete in ${batchSec}s (mux ${muxSec}s) -> ${outputFilename} [${spec.width}x${spec.height} @ ${spec.fps}fps, ${spec.sampleRate}Hz]`)

        ActivityLogService.success(
          'video',
          `Batch ${batchCode} Preview Compiled (Fast CLI)`,
          `Rendered ${outputFilename} with ${targetBeats.length} Ken Burns cuts in ${batchSec}s.`,
          { cuts: targetBeats.length, isBatchCompile: true, batchCode, outputFilename, fastCli: true },
          franchiseId,
          episodeId
        )
      }
    } finally {
      await pool.close()
    }

    if (opts.stitch) {
      console.log('\n▶ Running Lossless Batch Stitcher (VideoService.stitchBatches)...')
      const stitchRes = await VideoService.stitchBatches(franchiseId, episodeId, {})
      console.log(`✓ Master Ready: ${stitchRes.videoPath}`)
    }
  }

  const run = async () => {
    const startWall = Date.now()
    let franchiseId
    let episodeId = null

    if (positional.length === 0) {
      const picked = await runInteractiveWizard(opts)
      franchiseId = picked.franchiseId
      episodeId = picked.episodeId
    } else if (positional.length === 1 && opts.actNumber) {
      franchiseId = await resolveFolder(franchisesDir, positional[0], 'Franchise')
    } else if (positional.length === 1) {
      printUsage()
      process.exit(1)
    } else {
      franchiseId = await resolveFolder(franchisesDir, positional[0], 'Franchise')
      const franchiseDir = path.join(franchisesDir, franchiseId)
      episodeId = await resolveFolder(franchiseDir, positional[1], 'Episode')
    }

    if (opts.actNumber) {
      const acts = await PackagingService.parseSeriesActs(franchiseId)
      const act = acts.find(a => a.actNumber === Number(opts.actNumber))
      if (!act || act.episodeIds.length === 0) {
        throw new Error(`Act ${opts.actNumber} has no episodes in ${franchiseId}`)
      }
      console.log(`\n🎬 Compiling & Stitching Act ${act.actNumber}: ${act.title} (${act.episodeIds.join(', ')})`)
      const masterPaths = []
      for (const ep of act.episodeIds) {
        const masterPath = VideoService.getMasterVideoPath(franchiseId, ep)
        if (opts.fresh || !fsSync.existsSync(masterPath)) {
          await compileEpisode(franchiseId, ep)
        } else {
          console.log(`⏩ [${ep}] Master already exists -> reusing for Act stitch.`)
        }
        masterPaths.push(`01_Franchises/${franchiseId}/${ep}/video/01_Episode_Master_1080p.mp4`)
      }
      if (!opts.dryRun) {
        const now = new Date()
        const pad = n => String(n).padStart(2, '0')
        const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`
        const outName = `${franchiseId}_Act${act.actNumber}_Master_${ts}_1080p.mp4`
        const res = await VideoService.stitchMasterOmnibus(franchiseId, masterPaths, outName, {
          selectedEpisodes: act.episodeIds,
          compileEpisodes: false,
          actNumber: act.actNumber
        })
        console.log(`✓ Act ${act.actNumber} Stitched: ${res.videoPath}`)
        console.log(`✓ YouTube Package Synced: omnibus/YouTube_Act${act.actNumber}_Launch_Package.md`)
      }
    } else {
      await compileEpisode(franchiseId, episodeId)
    }

    const totalMins = ((Date.now() - startWall) / 60000).toFixed(2)
    console.log(`\n🏁 All done in ${totalMins} mins!`)
  }

  run().catch((err) => {
    console.error('\n❌ Fast-Compile Error:', err.message)
    process.exit(1)
  })
}
