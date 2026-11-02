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
          <div v-if="status === 'running' || status === 'compiling'" class="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <CheckCircle2 v-else-if="status === 'completed'" class="w-7 h-7 text-emerald-500" />
          <AlertCircle v-else-if="status === 'failed'" class="w-7 h-7 text-rose-500" />
          <Film v-else class="w-7 h-7 text-purple-500" />
          <span v-if="status === 'running' || status === 'compiling'" class="absolute text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">
            {{ progress }}%
          </span>
        </div>

        <div class="space-y-0.5 text-left pr-2">
          <div class="flex items-center space-x-2">
            <span class="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
              Omnibus Master
            </span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ tierLabel }}</span>
          </div>
          <p class="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
            {{ message || 'Stitching master movie...' }}
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
        <div class="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all max-h-[90vh]">
          
          <!-- Modal Top Header -->
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Film class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                    MASTER OMNIBUS COMPILER
                  </span>
                  <span v-if="status === 'running' || status === 'compiling'" class="flex items-center space-x-1 text-[11px] font-mono text-amber-500">
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
                  {{ franchiseTitle || 'Multi-Episode Master Movie' }}
                </h3>
              </div>
            </div>

            <div class="flex items-center space-x-1.5">
              <button 
                @click="$emit('minimize')" 
                class="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Minimize to floating widget"
              >
                <Minimize2 class="w-4 h-4" />
              </button>
              <button 
                @click="$emit('close')" 
                class="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Close"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- 4-Stage Progress Step Ribbon -->
          <div class="px-6 py-3 bg-slate-100/60 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
            <!-- Stage 1: Discovery -->
            <div class="flex items-center space-x-2" :class="activeStage >= 1 ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400'">
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border" :class="activeStage > 1 ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-purple-600 text-white border-purple-600'">
                <CheckCircle2 v-if="activeStage > 1" class="w-3.5 h-3.5" />
                <span v-else>1</span>
              </span>
              <span class="hidden sm:inline">{{ stage === 'compiling_episodes' ? 'Episode Queue' : 'Discovery' }}</span>
            </div>

            <div class="h-0.5 w-4 sm:w-8 bg-slate-300 dark:bg-slate-800" :class="{ 'bg-emerald-500': activeStage > 1 }"></div>

            <!-- Stage 2: Audio Audit & Normalisation -->
            <div class="flex items-center space-x-2" :class="activeStage >= 2 ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400'">
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border" :class="activeStage > 2 ? 'bg-emerald-500 text-white border-emerald-500' : activeStage === 2 ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'">
                <CheckCircle2 v-if="activeStage > 2" class="w-3.5 h-3.5" />
                <span v-else>2</span>
              </span>
              <span class="hidden sm:inline">Audio Audit</span>
            </div>

            <div class="h-0.5 w-4 sm:w-8 bg-slate-300 dark:bg-slate-800" :class="{ 'bg-emerald-500': activeStage > 2 }"></div>

            <!-- Stage 3: Lossless Concat -->
            <div class="flex items-center space-x-2" :class="activeStage >= 3 ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400'">
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border" :class="activeStage > 3 ? 'bg-emerald-500 text-white border-emerald-500' : activeStage === 3 ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'">
                <CheckCircle2 v-if="activeStage > 3" class="w-3.5 h-3.5" />
                <span v-else>3</span>
              </span>
              <span class="hidden sm:inline">Lossless Concat</span>
            </div>

            <div class="h-0.5 w-4 sm:w-8 bg-slate-300 dark:bg-slate-800" :class="{ 'bg-emerald-500': activeStage > 3 }"></div>

            <!-- Stage 4: Chapter Ledger -->
            <div class="flex items-center space-x-2" :class="activeStage >= 4 ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400'">
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border" :class="status === 'completed' ? 'bg-emerald-500 text-white border-emerald-500' : activeStage === 4 ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'">
                <CheckCircle2 v-if="status === 'completed'" class="w-3.5 h-3.5" />
                <span v-else>4</span>
              </span>
              <span class="hidden sm:inline">Chapters</span>
            </div>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="p-6 space-y-5 overflow-y-auto">
            
            <!-- Episode Sequence Visual Cards -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span class="flex items-center space-x-1.5 font-bold">
                  <Layers class="w-3.5 h-3.5 text-purple-500" />
                  <span>Stitching Episode Sequence ({{ episodeList.length }} Parts)</span>
                </span>
                <span class="text-[11px] text-purple-600 dark:text-purple-400 font-mono">{{ tierLabel }}</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div 
                  v-for="(ep, idx) in episodeList" 
                  :key="ep.id || idx"
                  class="p-3 rounded-xl border flex items-center justify-between transition-all"
                  :class="activeStage > 2 || status === 'completed' 
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30' 
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'"
                >
                  <div class="space-y-0.5 min-w-0 pr-2">
                    <div class="flex items-center space-x-1.5">
                      <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                        Part {{ idx + 1 }}
                      </span>
                      <span class="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {{ ep.title || ep.id }}
                      </span>
                    </div>
                    <div class="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
                      <span class="flex items-center space-x-1">
                        <ShieldCheck class="w-3 h-3 text-emerald-500" />
                        <span>48 kHz Stereo AAC</span>
                      </span>
                      <span v-if="ep.durationFormatted">· {{ ep.durationFormatted }}</span>
                    </div>
                  </div>

                  <div class="shrink-0">
                    <CheckCircle2 v-if="activeStage > 2 || status === 'completed'" class="w-4 h-4 text-emerald-500" />
                    <div v-else-if="status === 'running' || status === 'compiling'" class="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <Film v-else class="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Progress Bar & Status Text -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-mono">
                <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                  <div v-if="status === 'running' || status === 'compiling'" class="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <span class="truncate max-w-md">{{ message || 'Preparing omnibus stitcher...' }}</span>
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
                  <div v-if="status === 'running' || status === 'compiling'" class="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <!-- Terminal Activity Console -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span class="flex items-center space-x-1.5">
                  <Terminal class="w-3.5 h-3.5 text-purple-500" />
                  <span>Stitcher Telemetry Stream</span>
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
                    'text-emerald-400 font-semibold': logLine.includes('complete') || logLine.includes('Complete') || logLine.includes('Successfully') || logLine.includes('Verified') || logLine.includes('success'),
                    'text-rose-400 font-semibold': logLine.includes('failed') || logLine.includes('Error') || logLine.includes('error'),
                    'text-amber-400': logLine.includes('progress') || logLine.includes('Normalising') || logLine.includes('Resampling') || logLine.includes('Audit')
                  }">{{ logLine }}</span>
                </div>
              </div>
            </div>

            <!-- Result Summary Card (When Completed) -->
            <div v-if="status === 'completed' && completedMetadata" class="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-500/30 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <Sparkles class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span class="text-xs font-bold text-slate-900 dark:text-white">Master Movie Ready</span>
                </div>
                <span class="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {{ completedMetadata.totalDurationFormatted }}
                </span>
              </div>
              <p class="text-[11px] font-mono text-slate-600 dark:text-slate-300 break-all">
                🎬 {{ completedFilename || completedMetadata.filename }}
              </p>

              <!-- Chapter Ledger Preview -->
              <div v-if="completedMetadata.chapterLedger && completedMetadata.chapterLedger.length > 0" class="space-y-1 pt-1 border-t border-purple-200 dark:border-purple-900/40">
                <div class="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">
                  YouTube Timestamp Chapters
                </div>
                <div class="bg-white/80 dark:bg-slate-950/80 rounded-lg p-2.5 font-mono text-[11px] text-slate-800 dark:text-slate-200 max-h-24 overflow-y-auto space-y-0.5 border border-purple-200/50 dark:border-purple-900/20">
                  <div v-for="ch in completedMetadata.chapterLedger" :key="ch.partNumber">
                    {{ ch.startTimestampFormatted }} - {{ ch.partLabel }}: {{ ch.episodeTitle }}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer Actions -->
          <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span v-if="status === 'running' || status === 'compiling'">Lossless concatenation is running asynchronously in background.</span>
              <span v-else-if="status === 'completed'" class="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>All parts compiled with 100% audio sync &amp; zero mute sections.</span>
              </span>
              <span v-else-if="status === 'failed'" class="text-rose-500 font-semibold">Compilation halted. Review errors above.</span>
            </div>

            <div class="flex items-center space-x-2">
              <button 
                @click="$emit('minimize')"
                class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Minimize
              </button>

              <!-- Completed: Copy YouTube Chapters -->
              <button 
                v-if="status === 'completed' && completedMetadata"
                @click="copyChapters"
                class="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-bold font-mono flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Check v-if="copiedChapters" class="w-3.5 h-3.5 text-emerald-500" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedChapters ? 'Chapters Copied!' : 'Copy YouTube Chapters' }}</span>
              </button>

              <!-- Completed: Download / View Master Movie -->
              <a 
                v-if="status === 'completed' && downloadUrl"
                :href="downloadUrl"
                target="_blank"
                download
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-md shadow-emerald-900/20 cursor-pointer"
              >
                <Download class="w-3.5 h-3.5" />
                <span>Download Master MP4</span>
              </a>

              <!-- Close Button -->
              <button 
                @click="$emit('close')"
                class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-xs font-bold transition cursor-pointer shadow-sm"
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
import { ref, computed, watch, nextTick } from 'vue'
import { 
  Film, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Minimize2, 
  Maximize2, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Layers,
  ShieldCheck 
} from 'lucide-vue-next'

const props = defineProps({
  show: { type: Boolean, default: false },
  isMinimized: { type: Boolean, default: false },
  status: { type: String, default: 'idle' }, // 'idle', 'running', 'compiling', 'completed', 'failed'
  progress: { type: Number, default: 0 },
  stage: { type: String, default: 'discovery' }, // 'discovery', 'audit', 'normalising', 'stitching', 'chapters', 'completed'
  message: { type: String, default: '' },
  logs: { type: Array, default: () => [] },
  franchiseTitle: { type: String, default: '' },
  tier: { type: String, default: 'tier2' },
  episodeList: { type: Array, default: () => [] },
  result: { type: Object, default: null }
})

const emit = defineEmits(['close', 'minimize', 'maximize', 'toast'])

const logContainer = ref(null)
const copiedChapters = ref(false)

const tierLabel = computed(() => {
  switch (props.tier) {
    case 'tier1': return 'Tier 1: Episode / Chapter'
    case 'tier2': return 'Tier 2: Arc Feature (45–60 Min)'
    case 'tier3': return 'Tier 3: Season Movie (1.5–2.5 Hours)'
    case 'tier4': return 'Tier 4: Grand Omnibus (3.0+ Hours)'
    default: return 'Multi-Episode Master'
  }
})

const activeStage = computed(() => {
  if (props.status === 'completed') return 4
  if (props.stage === 'chapters') return 4
  if (props.stage === 'stitching') return 3
  if (props.stage === 'normalising' || props.stage === 'audit') return 2
  return 1
})

const completedMetadata = computed(() => {
  return props.result?.metadata || null
})

const completedFilename = computed(() => {
  return props.result?.filename || ''
})

const downloadUrl = computed(() => {
  if (props.result?.url) return `${props.result.url}&download=true`
  return ''
})

// Auto-scroll logs
watch(() => props.logs?.length, async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
})

const copyChapters = async () => {
  if (!completedMetadata.value?.chapterLedger) return
  const text = completedMetadata.value.chapterLedger.map(ch => {
    return `${ch.startTimestampFormatted} - ${ch.partLabel}: ${ch.episodeTitle}`
  }).join('\n')

  try {
    await navigator.clipboard.writeText(text)
    copiedChapters.value = true
    emit('toast', { title: 'Chapters Copied', message: 'YouTube chapter timestamps copied to clipboard!' })
    setTimeout(() => { copiedChapters.value = false }, 2500)
  } catch (err) {
    emit('toast', { title: 'Copy Error', message: 'Could not copy to clipboard.' })
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
