<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <router-link 
          :to="`/franchises/${$route.params.franchiseId}`" 
          class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm transition"
        >
          <ArrowLeft class="w-4 h-4" />
        </router-link>
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase font-semibold">{{ $route.params.franchiseId }}</span>
            <span class="text-slate-400">/</span>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ $route.params.episodeId }}</span>
          </div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Video Production & Compilation Studio</span>
            <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">1080p 16:9</span>
          </h1>
        </div>
      </div>

      <!-- Quick Pipeline Status Pills -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-sm text-xs font-mono">
          <span class="text-slate-400">Pipeline:</span>
          <span :class="pipeline.imagesReady === pipeline.totalScenes && pipeline.totalScenes > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-500'">
            {{ pipeline.imagesReady }}/{{ pipeline.totalScenes }} Visuals
          </span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span :class="pipeline.hasMasterAudio ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'">
            {{ pipeline.hasMasterAudio ? 'VO & Subtitles Synced' : 'No VO' }}
          </span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span :class="pipeline.hasVideo ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'">
            {{ pipeline.hasVideo ? '1080p Master Ready' : 'Uncompiled' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Stage Navigation Tabs -->
    <div class="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
      <button 
        @click="activeStage = 'visuals'"
        class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer"
        :class="activeStage === 'visuals' 
          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        <Image class="w-4 h-4" />
        <span>Stage 1: Visual Assets & Storyboard ({{ scenes.length }})</span>
      </button>

      <button 
        @click="activeStage = 'audio'"
        class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer"
        :class="activeStage === 'audio' 
          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        <Volume2 class="w-4 h-4" />
        <span>Stage 2: Voiceover & Subtitle Sync</span>
      </button>

      <button 
        @click="activeStage = 'compiler'"
        class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer"
        :class="activeStage === 'compiler' 
          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        <Film class="w-4 h-4" />
        <span>Stage 3: FFmpeg Compilation & Master Cut</span>
        <span v-if="pipeline.hasVideo" class="w-2 h-2 rounded-full bg-emerald-400"></span>
      </button>
    </div>

    <!-- STAGE 1: Visual Assets & Storyboard Stills -->
    <div v-if="activeStage === 'visuals'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Scene Visual Prompts & Storyboard Panels</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              16:9 1080p images matched to prompt matrix. Auto-synthesize storyboard panels for testing or drop your own renders.
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <button 
              @click="generateStoryboards"
              :disabled="generatingStoryboards"
              class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-md shadow-purple-900/20 disabled:opacity-50 cursor-pointer"
            >
              <Wand2 class="w-4 h-4" :class="{ 'animate-spin': generatingStoryboards }" />
              <span>{{ generatingStoryboards ? 'Synthesizing 22 Panels...' : 'Synthesize All Storyboard Panels ($0)' }}</span>
            </button>
          </div>
        </div>

        <!-- Notification Toast -->
        <div v-if="storyboardFeedback" class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center justify-between">
          <span>✓ {{ storyboardFeedback }}</span>
          <button @click="storyboardFeedback = ''" class="cursor-pointer">✕</button>
        </div>

        <!-- Scenes Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div 
            v-for="scene in scenes" 
            :key="scene.tag"
            class="rounded-xl border bg-slate-50 dark:bg-slate-950/40 p-4 space-y-3 relative group transition-all"
            :class="scene.hasImage ? 'border-slate-200 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-700'"
            @dragover.prevent
            @drop.prevent="handleFileDrop($event, scene.tag)"
          >
            <!-- Card Header -->
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                [{{ scene.tag }}]
              </span>
              <span class="text-[10px] font-mono text-slate-400 uppercase">{{ scene.act.split(':')[0] }}</span>
            </div>

            <!-- Image Preview or Placeholder -->
            <div class="aspect-video w-full rounded-lg overflow-hidden bg-slate-900/80 border border-slate-200 dark:border-slate-800 relative flex items-center justify-center">
              <img 
                v-if="scene.hasImage" 
                :src="`${scene.url}?t=${cacheBuster}`" 
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                :alt="scene.tag"
              />
              <div v-else class="text-center p-4 space-y-2">
                <Image class="w-6 h-6 mx-auto text-slate-600" />
                <div class="text-[11px] font-mono text-slate-400">No Image Rendered</div>
                <div class="text-[10px] text-slate-500">Drag & drop PNG/JPG here</div>
              </div>

              <!-- Upload Overlay on Hover -->
              <label class="absolute inset-0 bg-slate-900/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition cursor-pointer">
                <Upload class="w-5 h-5 text-white mb-1" />
                <span class="text-[11px] font-semibold text-white">Replace Image</span>
                <input type="file" accept="image/*" class="hidden" @change="handleFileInput($event, scene.tag)" />
              </label>
            </div>

            <!-- Scene Info -->
            <div>
              <div class="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{{ scene.description }}</div>
              <p class="text-[11px] font-mono text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{{ scene.prompt }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- STAGE 2: Voiceover & Subtitle Sync -->
    <div v-if="activeStage === 'audio'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Radio class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Voiceover Synthesis & Subtitle Synchronization</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Generates neural speech and captures millisecond sentence boundaries directly into .srt & .vtt files.
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <select 
              v-model="selectedVoice"
              class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 shadow-sm"
            >
              <option value="en-US-ChristopherNeural">Christopher (US - Deep Narrative)</option>
              <option value="en-GB-RyanNeural">Ryan (UK - Clear Authoritative)</option>
              <option value="en-US-EricNeural">Eric (US - Intense Action)</option>
              <option value="en-US-GuyNeural">Guy (US - Dramatic Male)</option>
            </select>

            <button 
              @click="generateVoiceoverAndSubtitles"
              :disabled="synthesizingAudio"
              class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-md shadow-purple-900/20 disabled:opacity-50 cursor-pointer"
            >
              <Volume2 class="w-4 h-4" :class="{ 'animate-pulse': synthesizingAudio }" />
              <span>{{ synthesizingAudio ? 'Synthesizing Voice & Subtitles...' : 'Sync Voice & Subtitles (Edge-TTS)' }}</span>
            </button>
          </div>
        </div>

        <!-- Master Audio Player Card -->
        <div v-if="pipeline.hasMasterAudio" class="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center space-x-2">
              <CheckCircle class="w-4 h-4 text-emerald-500" />
              <span>Master Voiceover Audio Track Ready</span>
            </div>
            <div class="text-[11px] font-mono text-purple-700 dark:text-purple-300">
              audio/01_Episode_Master.mp3 • 48kbps Mono MP3
            </div>
          </div>
          <audio 
            ref="masterAudioPlayer"
            controls 
            preload="metadata"
            class="w-full md:w-96 h-9 rounded-lg"
            :src="`/api/audio/${$route.params.franchiseId}/${$route.params.episodeId}/01_Episode_Master.mp3`"
          ></audio>
        </div>

        <!-- Interactive Subtitle Timeline -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Synchronized Subtitles Preview (SRT / VTT)
            </h3>
            <div class="flex items-center space-x-2" v-if="subtitles.hasSubtitles">
              <a 
                :href="`/api/episodes/${$route.params.franchiseId}/${$route.params.episodeId}/subtitles/01_Episode_Subtitles.srt`" 
                download
                class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-mono transition"
              >
                Download .SRT
              </a>
              <a 
                :href="`/api/episodes/${$route.params.franchiseId}/${$route.params.episodeId}/subtitles/01_Episode_Subtitles.vtt`" 
                download
                class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-mono transition"
              >
                Download .VTT
              </a>
            </div>
          </div>

          <div v-if="!subtitles.hasSubtitles" class="p-8 text-center text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
            No subtitles generated yet. Click "Sync Voice & Subtitles" above to extract timed sentence boundaries.
          </div>

          <div v-else class="max-h-96 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 space-y-2">
            <div 
              v-for="(sub, idx) in parsedSubtitles" 
              :key="idx"
              @click="seekAudio(sub.startSeconds)"
              class="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/50 flex items-start space-x-3 cursor-pointer transition"
            >
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold shrink-0">
                {{ sub.timecode }}
              </span>
              <p class="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed">{{ sub.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- STAGE 3: FFmpeg Compilation & Master Cut -->
    <div v-if="activeStage === 'compiler'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Film class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>FFmpeg 1080p Video Compilation</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Stitches 16:9 scene visuals with subtle Ken Burns motion, synchronized voiceover audio, and burned-in subtitles.
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <button 
              @click="compileVideo"
              :disabled="compiling"
              class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-purple-900/30 disabled:opacity-50 cursor-pointer"
            >
              <Play class="w-4 h-4 fill-current" :class="{ 'animate-spin': compiling }" />
              <span>{{ compiling ? 'Compiling 1080p Video...' : 'Compile Master 1080p Video' }}</span>
            </button>
          </div>
        </div>

        <!-- Compilation Progress & Status Box -->
        <div v-if="videoStatus.status === 'compiling' || compiling" class="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="font-bold text-purple-700 dark:text-purple-300 flex items-center space-x-2">
              <div class="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>{{ videoStatus.message || 'Processing video streams...' }}</span>
            </span>
            <span class="font-bold text-purple-600 dark:text-purple-400">{{ videoStatus.progress || 10 }}%</span>
          </div>
          <div class="w-full bg-purple-950/30 rounded-full h-2 overflow-hidden">
            <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="`width: ${videoStatus.progress || 10}%`"></div>
          </div>
        </div>

        <!-- Master HTML5 Video Player -->
        <div v-if="pipeline.hasVideo" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center space-x-2">
              <CheckCircle class="w-4 h-4 text-emerald-500" />
              <span>01_Episode_Master_1080p.mp4 (Ready for Distribution)</span>
            </h3>
            <span class="text-xs font-mono text-slate-400">
              {{ (pipeline.videoSize / (1024 * 1024)).toFixed(1) }} MB
            </span>
          </div>

          <div class="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-2xl">
            <video 
              controls 
              class="w-full h-full"
              :src="`/api/episodes/${$route.params.franchiseId}/${$route.params.episodeId}/video-stream?t=${cacheBuster}`"
            ></video>
          </div>
        </div>

        <!-- Empty State if Video Not Compiled Yet -->
        <div v-else-if="!compiling" class="py-12 text-center space-y-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-400">
          <Film class="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <p class="font-semibold text-slate-700 dark:text-slate-300">No Master Video Compiled Yet</p>
          <p class="text-slate-500">Ensure Visuals (Stage 1) and Voiceover (Stage 2) are prepared, then click "Compile Master 1080p Video".</p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, 
  Image, 
  Volume2, 
  Film, 
  Sparkles, 
  Wand2, 
  Upload, 
  Radio, 
  CheckCircle, 
  Play 
} from 'lucide-vue-next'

const route = useRoute()
const activeStage = ref('visuals')
const scenes = ref([])
const cacheBuster = ref(Date.now())
const generatingStoryboards = ref(false)
const storyboardFeedback = ref('')

const selectedVoice = ref('en-US-ChristopherNeural')
const synthesizingAudio = ref(false)
const masterAudioPlayer = ref(null)

const subtitles = ref({ srt: '', vtt: '', hasSubtitles: false })
const compiling = ref(false)
const videoStatus = ref({ status: 'idle', progress: 0, message: '' })
let pollTimer = null

const pipeline = ref({
  totalScenes: 0,
  imagesReady: 0,
  audioReady: 0,
  hasMasterAudio: false,
  hasSubtitles: false,
  hasVideo: false,
  videoSize: 0
})

const loadPipelineStatus = async () => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/pipeline-status`)
    pipeline.value = await res.json()
  } catch (e) {}
}

const loadScenes = async () => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images`)
    scenes.value = await res.json()
  } catch (e) {}
}

const loadSubtitles = async () => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/subtitles`)
    subtitles.value = await res.json()
  } catch (e) {}
}

const generateStoryboards = async () => {
  generatingStoryboards.value = true
  storyboardFeedback.value = ''
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/generate-storyboard`, {
      method: 'POST'
    })
    const data = await res.json()
    if (data.success) {
      storyboardFeedback.value = `Successfully synthesized ${data.count} 1080p storyboard panels!`
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()
    }
  } catch (e) {
    console.error(e)
  } finally {
    generatingStoryboards.value = false
  }
}

const handleFileInput = async (event, tag) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async (e) => {
    await uploadBase64(tag, e.target.result)
  }
  reader.readAsDataURL(file)
}

const handleFileDrop = async (event, tag) => {
  const file = event.dataTransfer.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async (e) => {
    await uploadBase64(tag, e.target.result)
  }
  reader.readAsDataURL(file)
}

const uploadBase64 = async (tag, base64Data) => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag, base64Data })
    })
    const data = await res.json()
    if (data.success) {
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()
    }
  } catch (e) {}
}

const generateVoiceoverAndSubtitles = async () => {
  synthesizingAudio.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/generate-tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voice: selectedVoice.value })
    })
    const data = await res.json()
    if (data.success) {
      await loadSubtitles()
      await loadPipelineStatus()
    }
  } catch (e) {
    console.error(e)
  } finally {
    synthesizingAudio.value = false
  }
}

const parsedSubtitles = computed(() => {
  if (!subtitles.value.srt) return []
  const blocks = subtitles.value.srt.split(/\n\s*\n/)
  const result = []
  for (const block of blocks) {
    const lines = block.trim().split('\n')
    if (lines.length >= 3) {
      const timeLine = lines[1]
      const text = lines.slice(2).join(' ')
      const match = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})/)
      let startSeconds = 0
      if (match) {
        const parts = match[1].split(/[:,]/)
        startSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]) + parseInt(parts[3]) / 1000
      }
      result.push({
        timecode: timeLine.split('-->')[0].trim(),
        text,
        startSeconds
      })
    }
  }
  return result
})

const seekAudio = (seconds) => {
  if (masterAudioPlayer.value) {
    masterAudioPlayer.value.currentTime = seconds
    masterAudioPlayer.value.play()
  }
}

const compileVideo = async () => {
  compiling.value = true
  try {
    await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/compile-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kenBurns: true, burnSubtitles: true })
    })
    startPolling()
  } catch (e) {
    compiling.value = false
  }
}

const startPolling = () => {
  clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/video-status`)
      const data = await res.json()
      videoStatus.value = data
      if (data.status === 'completed' || data.status === 'failed') {
        clearInterval(pollTimer)
        compiling.value = false
        cacheBuster.value = Date.now()
        await loadPipelineStatus()
      }
    } catch (e) {}
  }, 1000)
}

onMounted(() => {
  loadPipelineStatus()
  loadScenes()
  loadSubtitles()
})

onUnmounted(() => {
  clearInterval(pollTimer)
})
</script>
