<template>
  <div>
    <!-- FLOATING MINIMIZED PILL (When Minimized & Active) -->
    <transition name="fade">
      <div 
        v-if="show && isMinimized"
        @click="$emit('maximize')"
        class="fixed bottom-6 right-6 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-purple-500/40 dark:border-purple-500/50 rounded-2xl shadow-2xl p-3.5 flex items-center space-x-3.5 cursor-pointer hover:scale-[1.02] hover:border-purple-500 transition-all group"
      >
        <div class="relative flex items-center justify-center">
          <div v-if="status === 'running'" class="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <CheckCircle2 v-else-if="status === 'completed'" class="w-7 h-7 text-emerald-500" />
          <AlertCircle v-else-if="status === 'failed'" class="w-7 h-7 text-rose-500" />
          <Play v-else class="w-7 h-7 text-purple-500" />
          <span v-if="status === 'running'" class="absolute text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">
            {{ progress }}%
          </span>
        </div>

        <div class="space-y-0.5 text-left pr-2">
          <div class="flex items-center space-x-2">
            <span class="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
              Stage {{ currentStageNumber }}
            </span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ currentStageTitle }}</span>
          </div>
          <p class="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
            {{ message || 'Processing pipeline...' }}
          </p>
        </div>

        <button 
          @click.stop="$emit('maximize')"
          class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-purple-500 transition"
          title="Expand progress details"
        >
          <Maximize2 class="w-3.5 h-3.5" />
        </button>
      </div>
    </transition>

    <!-- FULL MODAL OVERLAY -->
    <transition name="modal">
      <div 
        v-if="show && !isMinimized" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm"
      >
        <div class="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all">
          
          <!-- Modal Top Header -->
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <component :is="currentStageIcon" class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                    STAGE {{ currentStageNumber }} OF 3
                  </span>
                  <span v-if="status === 'running'" class="flex items-center space-x-1 text-[11px] font-mono text-amber-500">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                    <span>ACTIVE</span>
                  </span>
                  <span v-else-if="status === 'completed'" class="text-[11px] font-mono text-emerald-500 font-bold flex items-center space-x-1">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>COMPLETED</span>
                  </span>
                  <span v-else-if="status === 'failed'" class="text-[11px] font-mono text-rose-500 font-bold flex items-center space-x-1">
                    <AlertCircle class="w-3.5 h-3.5" />
                    <span>ERROR</span>
                  </span>
                </div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {{ currentStageTitle }}
                </h3>
              </div>
            </div>

            <div class="flex items-center space-x-1.5">
              <button 
                @click="$emit('minimize')" 
                class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Minimize to floating widget"
              >
                <Minimize2 class="w-4 h-4" />
              </button>
              <button 
                @click="$emit('close')" 
                class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Close"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- 3-Stage Progress Step Ribbon -->
          <div class="px-6 py-3 bg-slate-100/60 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
            <!-- Stage 1: Visuals -->
            <div 
              class="flex items-center space-x-2 transition cursor-pointer"
              :class="stageClass(1)"
              @click="$emit('switch-stage', 'visuals')"
            >
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border" :class="stepBadgeClass(1)">
                <CheckCircle2 v-if="pipeline.imagesReady === pipeline.totalScenes && pipeline.totalScenes > 0" class="w-3.5 h-3.5" />
                <span v-else>1</span>
              </span>
              <span class="font-semibold hidden sm:inline">Visuals</span>
            </div>

            <div class="h-0.5 w-6 sm:w-12 bg-slate-300 dark:bg-slate-800" :class="{ 'bg-emerald-500': pipeline.imagesReady === pipeline.totalScenes && pipeline.totalScenes > 0 }"></div>

            <!-- Stage 2: Audio & Subtitles -->
            <div 
              class="flex items-center space-x-2 transition cursor-pointer"
              :class="stageClass(2)"
              @click="$emit('switch-stage', 'audio')"
            >
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border" :class="stepBadgeClass(2)">
                <CheckCircle2 v-if="pipeline.hasMasterAudio && pipeline.hasSubtitles" class="w-3.5 h-3.5" />
                <span v-else>2</span>
              </span>
              <span class="font-semibold hidden sm:inline">Voice & Subs</span>
            </div>

            <div class="h-0.5 w-6 sm:w-12 bg-slate-300 dark:bg-slate-800" :class="{ 'bg-emerald-500': pipeline.hasMasterAudio && pipeline.hasSubtitles }"></div>

            <!-- Stage 3: Master Cut -->
            <div 
              class="flex items-center space-x-2 transition cursor-pointer"
              :class="stageClass(3)"
              @click="$emit('switch-stage', 'compiler')"
            >
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border" :class="stepBadgeClass(3)">
                <CheckCircle2 v-if="pipeline.hasVideo" class="w-3.5 h-3.5" />
                <span v-else>3</span>
              </span>
              <span class="font-semibold hidden sm:inline">1080p Master</span>
            </div>
          </div>

          <!-- Body Content -->
          <div class="p-6 space-y-5">
            <!-- Progress Bar & Status Text -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-mono">
                <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                  <div v-if="status === 'running'" class="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <span class="truncate max-w-md">{{ message || 'Preparing pipeline operation...' }}</span>
                </span>
                <span class="font-bold text-purple-600 dark:text-purple-400 text-sm">
                  {{ progress }}%
                </span>
              </div>

              <!-- Bar -->
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                <div 
                  class="h-full rounded-full transition-all duration-300 relative overflow-hidden"
                  :class="status === 'failed' ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-500'"
                  :style="{ width: Math.max(5, Math.min(100, progress)) + '%' }"
                >
                  <!-- Shimmer effect when running -->
                  <div v-if="status === 'running'" class="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <!-- Terminal Activity Console -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span class="flex items-center space-x-1.5">
                  <Terminal class="w-3.5 h-3.5 text-purple-500" />
                  <span>Engine Activity Stream</span>
                </span>
                <span v-if="logs && logs.length > 0">{{ logs.length }} events</span>
              </div>

              <div 
                ref="logContainer"
                class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 h-44 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1.5 shadow-inner"
              >
                <div v-if="!logs || logs.length === 0" class="text-slate-600 italic">
                  Awaiting engine execution signals...
                </div>
                <div 
                  v-for="(logLine, idx) in logs" 
                  :key="idx"
                  class="flex items-start space-x-2 leading-relaxed"
                >
                  <span class="text-purple-500 select-none">›</span>
                  <span :class="{
                    'text-emerald-400 font-semibold': logLine.includes('complete') || logLine.includes('ready') || logLine.includes('Successfully'),
                    'text-rose-400 font-semibold': logLine.includes('failed') || logLine.includes('Error'),
                    'text-amber-400': logLine.includes('progress') || logLine.includes('Encoding')
                  }">{{ logLine }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span v-if="status === 'running'">Process is running asynchronously in background.</span>
              <span v-else-if="status === 'completed'" class="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Stage {{ currentStageNumber }} completed successfully.</span>
              <span v-else-if="status === 'failed'" class="text-rose-500 font-semibold">Stage execution failed. Review log above.</span>
            </div>

            <div class="flex items-center space-x-2">
              <button 
                @click="$emit('minimize')"
                class="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Minimize
              </button>

              <!-- Stage 1 Done -> Proceed to Stage 2 -->
              <button 
                v-if="status === 'completed' && activeStage === 'visuals'"
                @click="$emit('proceed-next', 'audio')"
                class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-md shadow-purple-900/20 cursor-pointer"
              >
                <span>Proceed to Stage 2: Voiceover Sync</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>

              <!-- Stage 2 Done -> Proceed to Stage 3 -->
              <button 
                v-else-if="status === 'completed' && activeStage === 'audio'"
                @click="$emit('proceed-next', 'compiler')"
                class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-md shadow-purple-900/20 cursor-pointer"
              >
                <span>Proceed to Stage 3: FFmpeg Compilation</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>

              <!-- Stage 3 Done -> Close & View Cut -->
              <button 
                v-else-if="status === 'completed' && activeStage === 'compiler'"
                @click="$emit('close')"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-md shadow-emerald-900/20 cursor-pointer"
              >
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>View Master 1080p Video</span>
              </button>

              <!-- Close Button -->
              <button 
                v-else
                @click="$emit('close')"
                class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { 
  Image, 
  Volume2, 
  Film, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Terminal, 
  Minimize2, 
  Maximize2, 
  X,
  ArrowRight
} from 'lucide-vue-next'

const props = defineProps({
  show: { type: Boolean, default: false },
  isMinimized: { type: Boolean, default: false },
  activeStage: { type: String, default: 'visuals' },
  status: { type: String, default: 'idle' },
  progress: { type: Number, default: 0 },
  message: { type: String, default: '' },
  logs: { type: Array, default: () => [] },
  pipeline: {
    type: Object,
    default: () => ({
      totalScenes: 0,
      imagesReady: 0,
      audioReady: 0,
      hasMasterAudio: false,
      hasSubtitles: false,
      hasVideo: false
    })
  }
})

defineEmits(['close', 'minimize', 'maximize', 'proceed-next', 'switch-stage'])

const logContainer = ref(null)

watch(() => props.logs, async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
}, { deep: true })

const currentStageNumber = computed(() => {
  if (props.activeStage === 'visuals') return 1
  if (props.activeStage === 'audio') return 2
  return 3
})

const currentStageTitle = computed(() => {
  if (props.activeStage === 'visuals') return 'Visual Assets & Storyboard Generation'
  if (props.activeStage === 'audio') return 'Neural Voiceover & Subtitle Synchronization'
  return 'FFmpeg 1080p Master Cut Compilation'
})

const currentStageIcon = computed(() => {
  if (props.activeStage === 'visuals') return Image
  if (props.activeStage === 'audio') return Volume2
  return Film
})

const stageClass = (stageNum) => {
  if (stageNum === currentStageNumber.value) {
    return 'text-purple-600 dark:text-purple-400 font-bold'
  }
  return 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
}

const stepBadgeClass = (stageNum) => {
  if (stageNum === currentStageNumber.value) {
    return 'bg-purple-600 text-white border-purple-500'
  }
  if (stageNum === 1 && props.pipeline.imagesReady === props.pipeline.totalScenes && props.pipeline.totalScenes > 0) {
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
  }
  if (stageNum === 2 && props.pipeline.hasMasterAudio && props.pipeline.hasSubtitles) {
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
  }
  if (stageNum === 3 && props.pipeline.hasVideo) {
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
  }
  return 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
