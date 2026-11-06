<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
    <div class="relative w-full max-w-6xl bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      
      <!-- Top Control Bar -->
      <div class="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 select-none">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Film class="w-4 h-4" />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h2 class="text-sm font-bold text-white tracking-wide">{{ batchName }} &bull; Instant Preview</h2>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                0s Render Latency
              </span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <Sparkles class="w-3 h-3 mr-0.5" />
                <span>+20% Motion Speed</span>
              </span>
            </div>
            <p class="text-[11px] font-mono text-slate-400 mt-0.5">
              {{ activeCut ? `Cut ${currentCutIndex + 1}/${batchCuts.length} [${activeCut.tag}] • ${activeCut.duration?.toFixed(1)}s` : 'Loading cuts...' }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <!-- Keyboard shortcut indicator -->
          <span class="hidden sm:inline-block text-[10px] font-mono text-slate-500 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/50">
            Space: Play/Pause &bull; Esc: Close
          </span>

          <button 
            @click="closePlayer"
            class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close Preview (Esc)"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Main Stage: 16:9 Canvas Viewport -->
      <div class="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[360px] sm:min-h-[500px]">
        <canvas 
          ref="canvasRef" 
          width="1920" 
          height="1080" 
          class="w-full h-full max-h-[70vh] object-contain shadow-2xl"
        ></canvas>

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center space-y-3">
          <div class="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs font-mono font-medium text-slate-300">{{ loadingStatus }}</p>
        </div>

        <!-- In-Canvas Active Subtitle Overlay (Mirroring Skia text styling) -->
        <div 
          v-if="currentSubtitleText" 
          class="absolute bottom-6 left-0 right-0 px-8 text-center pointer-events-none select-none"
        >
          <span 
            class="inline-block text-white font-extrabold text-base sm:text-lg md:text-xl px-4 py-1.5 rounded-lg leading-relaxed tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
            style="text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 3px 6px rgba(0,0,0,0.9);"
          >
            {{ currentSubtitleText }}
          </span>
        </div>
      </div>

      <!-- Bottom Audio Transport & Scrubber -->
      <div class="px-6 py-4 bg-slate-900 border-t border-slate-800 space-y-3 select-none">
        
        <!-- Progress Bar & Time -->
        <div class="flex items-center space-x-3 text-xs font-mono">
          <span class="text-purple-400 font-bold w-12 text-right">{{ formatTime(currentBatchTime) }}</span>
          
          <div 
            ref="progressTrackRef"
            @click="seekProgress"
            class="flex-1 h-2.5 bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group"
          >
            <!-- Cut markers along track -->
            <div 
              v-for="(cut, idx) in batchCuts" 
              :key="idx" 
              class="absolute top-0 bottom-0 border-r border-slate-700/50 pointer-events-none"
              :style="{ left: `${((cut.startTime - batchStartTime) / Math.max(0.1, batchDuration)) * 100}%` }"
            ></div>

            <!-- Filled Progress -->
            <div 
              class="h-full bg-linear-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-75 relative"
              :style="{ width: `${progressPercent}%` }"
            >
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"></div>
            </div>
          </div>

          <span class="text-slate-400 w-12">{{ formatTime(batchDuration) }}</span>
        </div>

        <!-- Controls Bar -->
        <div class="flex items-center justify-between">
          
          <!-- Left: Cut Stepper -->
          <div class="flex items-center space-x-1.5">
            <button 
              @click="prevCut"
              :disabled="currentCutIndex <= 0"
              class="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              title="Previous Scene Cut (Left Arrow)"
            >
              <SkipBack class="w-4 h-4" />
            </button>
            <button 
              @click="skipSeconds(-5)"
              class="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Rewind 5 Seconds"
            >
              <RotateCcw class="w-4 h-4" />
            </button>
          </div>

          <!-- Center: Master Play/Pause -->
          <div class="flex items-center space-x-3">
            <button 
              @click="togglePlay"
              class="w-12 h-12 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition transform active:scale-95 cursor-pointer"
              :title="isPlaying ? 'Pause (Space)' : 'Play (Space)'"
            >
              <Pause v-if="isPlaying" class="w-5 h-5 fill-current" />
              <Play v-else class="w-5 h-5 fill-current ml-0.5" />
            </button>
          </div>

          <!-- Right: Cut Stepper + Audio Volume -->
          <div class="flex items-center space-x-2">
            <button 
              @click="skipSeconds(5)"
              class="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Fast Forward 5 Seconds"
            >
              <RotateCcw class="w-4 h-4 scale-x-[-1]" />
            </button>
            <button 
              @click="nextCut"
              :disabled="currentCutIndex >= batchCuts.length - 1"
              class="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              title="Next Scene Cut (Right Arrow)"
            >
              <SkipForward class="w-4 h-4" />
            </button>

            <div class="h-4 w-px bg-slate-800 mx-1"></div>

            <button 
              @click="toggleMute"
              class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              :title="isMuted ? 'Unmute' : 'Mute'"
            >
              <VolumeX v-if="isMuted" class="w-4 h-4 text-rose-400" />
              <Volume2 v-else class="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>

    <!-- Hidden Native Audio Controller -->
    <audio 
      ref="audioRef"
      preload="auto"
      :src="audioUrl"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="onAudioEnded"
      @timeupdate="onTimeUpdate"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { 
  Film, 
  Play, 
  Pause, 
  X, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  franchiseId: { type: String, required: true },
  episodeId: { type: String, required: true },
  batchIndex: { type: Number, default: 0 },
  batchName: { type: String, default: 'Batch A' },
  scenes: { type: Array, default: () => [] }
})

const emit = defineEmits(['close'])

// Component State
const canvasRef = ref(null)
const audioRef = ref(null)
const progressTrackRef = ref(null)

const isPlaying = ref(false)
const isMuted = ref(false)
const isLoading = ref(true)
const loadingStatus = ref('Loading batch timeline...')

const timelineBeats = ref([])
const subtitleCues = ref([])
const imageMap = new Map() // tag -> HTMLImageElement
const bgCanvasMap = new Map() // tag -> HTMLCanvasElement (pre-blurred ambient background)
const spriteCanvasMap = new Map() // tag -> HTMLCanvasElement (drop-shadow strip sprite)

let animFrameId = null

const audioUrl = computed(() => {
  return `/api/audio/${props.franchiseId}/${props.episodeId}/01_Episode_Master.mp3`
})

// Batch Window Calculations
const batchCuts = computed(() => {
  if (timelineBeats.value.length === 0) return []
  const batchSize = 24
  const start = props.batchIndex * batchSize
  return timelineBeats.value.slice(start, start + batchSize)
})

const batchStartTime = computed(() => {
  return batchCuts.value.length > 0 ? (batchCuts.value[0].startTime || 0) : 0
})

const batchEndTime = computed(() => {
  if (batchCuts.value.length === 0) return 0
  const last = batchCuts.value[batchCuts.value.length - 1]
  return last.endTime || (last.startTime + last.duration)
})

const batchDuration = computed(() => {
  return Math.max(0.1, batchEndTime.value - batchStartTime.value)
})

const currentAudioTime = ref(0)
const currentBatchTime = computed(() => {
  return Math.max(0, currentAudioTime.value - batchStartTime.value)
})

const progressPercent = computed(() => {
  if (batchDuration.value <= 0) return 0
  return Math.min(100, Math.max(0, (currentBatchTime.value / batchDuration.value) * 100))
})

const activeCut = computed(() => {
  if (batchCuts.value.length === 0) return null
  const t = currentAudioTime.value
  const found = batchCuts.value.find(c => t >= c.startTime && t < c.endTime)
  return found || batchCuts.value[batchCuts.value.length - 1]
})

const currentCutIndex = computed(() => {
  if (!activeCut.value) return 0
  return batchCuts.value.findIndex(c => c.tag === activeCut.value.tag)
})

const currentSubtitleText = computed(() => {
  const t = currentAudioTime.value
  const cue = subtitleCues.value.find(c => t >= c.startSec && t <= c.endSec)
  return cue ? cue.text : ''
})

// Motion Presets (1:1 Match with motionEngine.js + 20% Speed Calibration)
const getMotionType = (isVertical, isTallStrip, motionIndex) => {
  if (isVertical) {
    const tallPresets = [
      'vertical_glide_down',
      'vertical_diagonal_left_to_right',
      'vertical_zoom_in',
      'vertical_glide_up',
      'vertical_diagonal_right_to_left',
      'vertical_zoom_out'
    ]
    return tallPresets[motionIndex % tallPresets.length]
  } else {
    const landPresets = [
      'pan_left_to_right',
      'hero_zoom_in',
      'pan_right_to_left',
      'pan_diagonal_sweep',
      'hero_zoom_out',
      'pan_top_to_bottom'
    ]
    return landPresets[motionIndex % landPresets.length]
  }
}

// Initialize & Load Batch Assets
const initBatchPlayer = async () => {
  isLoading.value = true
  loadingStatus.value = 'Fetching timeline and subtitle cues...'

  try {
    // 1. Fetch Dynamic Timeline
    const tlRes = await fetch(`/api/episodes/${props.franchiseId}/${props.episodeId}/timeline`)
    if (tlRes.ok) {
      const data = await tlRes.json()
      timelineBeats.value = data.beats || []
    }

    // 2. Fetch Subtitles
    const subRes = await fetch(`/api/episodes/${props.franchiseId}/${props.episodeId}/subtitles`)
    if (subRes.ok) {
      const subData = await subRes.json()
      if (subData.srt) {
        subtitleCues.value = parseSrt(subData.srt)
      }
    }

    // 3. Preload Batch Images
    loadingStatus.value = `Preloading ${batchCuts.value.length} scene image plates...`
    await preloadBatchImages()

    // 4. Set Initial Audio Time to Batch Start
    if (audioRef.value) {
      audioRef.value.currentTime = batchStartTime.value
      currentAudioTime.value = batchStartTime.value
    }

    isLoading.value = false
    drawFrame()
  } catch (err) {
    console.error('Failed to init BatchCanvasPlayer:', err)
    loadingStatus.value = `Load Error: ${err.message}`
  }
}

// Preload Images and Cache Skia-style Ambient Sprites
const preloadBatchImages = async () => {
  const cuts = batchCuts.value
  const promises = cuts.map((cut) => {
    return new Promise((resolve) => {
      const matchedScene = props.scenes.find(s => s.tag === cut.tag)
      const url = matchedScene?.url || `/api/episodes/${props.franchiseId}/${props.episodeId}/images/${cut.tag}.jpg`

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        imageMap.set(cut.tag, img)
        prepareAmbientCanvases(cut.tag, img)
        resolve()
      }
      img.onerror = () => {
        // Fallback placeholder
        resolve()
      }
      img.src = url
    })
  })
  await Promise.all(promises)
}

// Prepare Offscreen Canvas Ambient Blur and Drop Shadow Sprites
const prepareAmbientCanvases = (tag, img) => {
  const imgW = img.width
  const imgH = img.height
  const isVertical = (imgW / imgH) < 0.95
  const isTallStrip = (imgH / imgW) >= 1.35

  // 1. Ambient Background Canvas
  const bgCanvas = document.createElement('canvas')
  bgCanvas.width = 1920
  bgCanvas.height = 1080
  const bgCtx = bgCanvas.getContext('2d')

  const bgScale = Math.max(1920 / imgW, 1080 / imgH)
  const bgDrawW = imgW * bgScale
  const bgDrawH = imgH * bgScale

  bgCtx.filter = 'blur(48px) brightness(0.60) saturate(1.25)'
  bgCtx.drawImage(img, (1920 - bgDrawW) / 2, (1080 - bgDrawH) / 2, bgDrawW, bgDrawH)
  bgCtx.filter = 'none'

  const grad = bgCtx.createRadialGradient(960, 540, 350, 960, 540, 1150)
  grad.addColorStop(0, 'rgba(0,0,0,0.12)')
  grad.addColorStop(1, 'rgba(0,0,0,0.82)')
  bgCtx.fillStyle = grad
  bgCtx.fillRect(0, 0, 1920, 1080)

  bgCanvasMap.set(tag, bgCanvas)

  // 2. Vertical Strip Drop Shadow Sprite
  if (isVertical) {
    let stripDisplayW = 680
    let stripDisplayH = isTallStrip ? Math.round((imgH / imgW) * stripDisplayW) : 1040
    if (!isTallStrip) {
      stripDisplayW = Math.round((imgW / imgH) * stripDisplayH)
    }

    const pad = 80
    const spriteCanvas = document.createElement('canvas')
    spriteCanvas.width = stripDisplayW + pad * 2
    spriteCanvas.height = stripDisplayH + pad * 2
    const sCtx = spriteCanvas.getContext('2d')

    sCtx.shadowColor = 'rgba(0, 0, 0, 0.90)'
    sCtx.shadowBlur = 40
    sCtx.shadowOffsetY = 12
    sCtx.drawImage(img, pad, pad, stripDisplayW, stripDisplayH)
    sCtx.shadowColor = 'transparent'
    sCtx.lineWidth = 1.5
    sCtx.strokeStyle = 'rgba(255, 255, 255, 0.10)'
    sCtx.strokeRect(pad, pad, stripDisplayW, stripDisplayH)

    spriteCanvasMap.set(tag, {
      canvas: spriteCanvas,
      stripDisplayW,
      stripDisplayH,
      pad,
      isTallStrip
    })
  }
}

// Parse SRT Helper
const parseSrt = (srtText) => {
  const cues = []
  const blocks = srtText.trim().replace(/\r\n/g, '\n').split(/\n\s*\n/)
  const timeRegex = /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/

  for (const block of blocks) {
    const lines = block.split('\n')
    if (lines.length >= 2) {
      const match = lines[1].match(timeRegex)
      if (match) {
        const startSec = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]) + parseInt(match[4]) / 1000
        const endSec = parseInt(match[5]) * 3600 + parseInt(match[6]) * 60 + parseInt(match[7]) + parseInt(match[8]) / 1000
        const text = lines.slice(2).join(' ')
        cues.push({ startSec, endSec, text })
      }
    }
  }
  return cues
}

// 60 FPS Render Loop (1:1 with Skia Motion Engine + 20% Calibrated Speed)
const drawFrame = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cut = activeCut.value
  if (!cut) {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 1920, 1080)
    return
  }

  const tag = cut.tag
  const img = imageMap.get(tag)
  const bgCanvas = bgCanvasMap.get(tag)

  // 1. Draw Ambient Blurred Background
  if (bgCanvas) {
    ctx.drawImage(bgCanvas, 0, 0)
  } else {
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, 1920, 1080)
  }

  // 2. Compute Motion Progress
  const cutDuration = Math.max(0.1, cut.duration || (cut.endTime - cut.startTime))
  const rawProgress = (currentAudioTime.value - cut.startTime) / cutDuration
  const progress = Math.max(0.0, Math.min(1.0, rawProgress))

  const cutGlobalIdx = props.batchIndex * 24 + currentCutIndex.value
  const isVertical = spriteCanvasMap.has(tag)
  const isTallStrip = isVertical ? spriteCanvasMap.get(tag).isTallStrip : false
  const motionType = getMotionType(isVertical, isTallStrip, cutGlobalIdx)

  ctx.save()
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (isVertical && spriteCanvasMap.has(tag)) {
    const spriteData = spriteCanvasMap.get(tag)
    const { canvas: sCanvas, stripDisplayW, stripDisplayH, pad } = spriteData
    const maxScrollY = isTallStrip ? Math.max(0, stripDisplayH - 1080) : 0
    const baseCenterX = (1920 - stripDisplayW) / 2
    const baseCenterY = !isTallStrip ? 20 : 0

    let curX = baseCenterX
    let curY = baseCenterY
    let curZoom = 1.0

    // Calibrated +20% Motion Speed Curves
    if (isTallStrip) {
      if (motionType === 'vertical_glide_up') {
        curY = -((1.0 - progress) * maxScrollY)
      } else if (motionType === 'vertical_diagonal_left_to_right') {
        curY = -(progress * maxScrollY)
        curX = (baseCenterX - 24) + (progress * 48) // +20% speed
      } else if (motionType === 'vertical_diagonal_right_to_left') {
        curY = -(progress * maxScrollY)
        curX = (baseCenterX + 24) - (progress * 48) // +20% speed
      } else if (motionType === 'vertical_zoom_in') {
        curY = -(progress * maxScrollY)
        curZoom = 1.0 + 0.042 * progress // +20% speed
      } else if (motionType === 'vertical_zoom_out') {
        curY = -(progress * maxScrollY)
        curZoom = 1.042 - 0.042 * progress // +20% speed
      } else {
        curY = -(progress * maxScrollY)
      }
    } else {
      if (motionType === 'vertical_snap_up') {
        curZoom = 1.0 + 0.042 * progress
      } else if (motionType === 'vertical_zoom_out') {
        curZoom = 1.042 - 0.042 * progress
      } else if (motionType === 'vertical_diagonal_left_to_right') {
        curX = (baseCenterX - 24) + (progress * 48)
      } else if (motionType === 'vertical_diagonal_right_to_left') {
        curX = (baseCenterX + 24) - (progress * 48)
      }
    }

    if (curZoom !== 1.0) {
      ctx.translate(960, 540)
      ctx.scale(curZoom, curZoom)
      ctx.translate(-960, -540)
    }

    ctx.drawImage(sCanvas, curX - pad, curY - pad)
  } else if (img) {
    // Landscape Artwork (+20% Travel Room with 1.18 Overscan)
    const imgW = img.width
    const imgH = img.height
    const landScale = Math.max(1920 / imgW, 1080 / imgH) * 1.18
    const landW = imgW * landScale
    const landH = imgH * landScale
    const maxLandScrollX = Math.max(0, landW - 1920)
    const maxLandScrollY = Math.max(0, landH - 1080)
    const landCenterX = (1920 - landW) / 2
    const landCenterY = (1080 - landH) / 2

    let curX = landCenterX
    let curY = landCenterY
    let curZoom = 1.0

    if (motionType === 'pan_left_to_right') {
      curX = -(maxLandScrollX * (1.0 - progress))
    } else if (motionType === 'pan_right_to_left') {
      curX = -(maxLandScrollX * progress)
    } else if (motionType === 'pan_top_to_bottom') {
      curY = -(maxLandScrollY * progress)
    } else if (motionType === 'pan_bottom_to_top') {
      curY = -(maxLandScrollY * (1.0 - progress))
    } else if (motionType === 'hero_zoom_in') {
      curZoom = 1.0 + 0.06 * progress // +20% speed
    } else if (motionType === 'hero_zoom_out') {
      curZoom = 1.06 - 0.06 * progress // +20% speed
    } else if (motionType === 'pan_diagonal_sweep') {
      curX = -(maxLandScrollX * (1.0 - progress))
      curY = -(maxLandScrollY * progress)
    } else {
      curX = -(maxLandScrollX * (1.0 - progress))
    }

    if (curZoom !== 1.0) {
      ctx.translate(960, 540)
      ctx.scale(curZoom, curZoom)
      ctx.translate(-960, -540)
    }

    ctx.drawImage(img, curX, curY, landW, landH)
  }

  ctx.restore()

  // Loop requestAnimationFrame while playing
  if (isPlaying.value) {
    animFrameId = requestAnimationFrame(drawFrame)
  }
}

// Transport Controls
const togglePlay = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    // If at end of batch, loop to start
    if (audioRef.value.currentTime >= batchEndTime.value - 0.2) {
      audioRef.value.currentTime = batchStartTime.value
    }
    audioRef.value.play().then(() => {
      animFrameId = requestAnimationFrame(drawFrame)
    }).catch(e => console.warn('Audio play error:', e))
  }
}

const toggleMute = () => {
  if (!audioRef.value) return
  isMuted.value = !isMuted.value
  audioRef.value.muted = isMuted.value
}

const seekProgress = (event) => {
  if (!progressTrackRef.value || !audioRef.value) return
  const rect = progressTrackRef.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const ratio = Math.max(0, Math.min(1, clickX / rect.width))
  const targetTime = batchStartTime.value + ratio * batchDuration.value
  audioRef.value.currentTime = targetTime
  currentAudioTime.value = targetTime
  drawFrame()
}

const skipSeconds = (sec) => {
  if (!audioRef.value) return
  const newTime = Math.max(batchStartTime.value, Math.min(batchEndTime.value, audioRef.value.currentTime + sec))
  audioRef.value.currentTime = newTime
  currentAudioTime.value = newTime
  drawFrame()
}

const prevCut = () => {
  if (currentCutIndex.value <= 0) return
  const target = batchCuts.value[currentCutIndex.value - 1]
  if (target && audioRef.value) {
    audioRef.value.currentTime = target.startTime
    currentAudioTime.value = target.startTime
    drawFrame()
  }
}

const nextCut = () => {
  if (currentCutIndex.value >= batchCuts.value.length - 1) return
  const target = batchCuts.value[currentCutIndex.value + 1]
  if (target && audioRef.value) {
    audioRef.value.currentTime = target.startTime
    currentAudioTime.value = target.startTime
    drawFrame()
  }
}

const onTimeUpdate = () => {
  if (!audioRef.value) return
  currentAudioTime.value = audioRef.value.currentTime

  // Clamp playback to batch end time
  if (audioRef.value.currentTime >= batchEndTime.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = batchStartTime.value
    currentAudioTime.value = batchStartTime.value
    isPlaying.value = false
    drawFrame()
  }
}

const onAudioEnded = () => {
  isPlaying.value = false
  if (audioRef.value) {
    audioRef.value.currentTime = batchStartTime.value
  }
  drawFrame()
}

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const closePlayer = () => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
  }
  isPlaying.value = false
  emit('close')
}

// Keyboard shortcuts (Space = Play/Pause, Escape = Close)
const onKeyDown = (e) => {
  if (!props.isOpen) return
  if (e.code === 'Space') {
    e.preventDefault()
    togglePlay()
  } else if (e.code === 'Escape') {
    closePlayer()
  } else if (e.code === 'ArrowLeft') {
    prevCut()
  } else if (e.code === 'ArrowRight') {
    nextCut()
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    initBatchPlayer()
    window.addEventListener('keydown', onKeyDown)
  } else {
    closePlayer()
    window.removeEventListener('keydown', onKeyDown)
  }
})

watch(() => props.batchIndex, () => {
  if (props.isOpen) {
    initBatchPlayer()
  }
})

onMounted(() => {
  if (props.isOpen) {
    initBatchPlayer()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
  }
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
