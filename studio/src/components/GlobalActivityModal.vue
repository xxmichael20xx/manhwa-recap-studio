<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 overflow-hidden flex items-center justify-end"
      @keydown.esc="$emit('close')"
    >
      <!-- Backdrop -->
      <div 
        @click="$emit('close')" 
        class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300"
      />

      <!-- Slide-Over Drawer Shell -->
      <div class="relative w-screen max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl h-full flex flex-col justify-between z-10">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                <Activity class="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h2 class="text-base font-bold text-slate-900 dark:text-white">Studio Activity Stream</h2>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-bold">
                    {{ stats.total || 0 }} Events
                  </span>
                  <span v-if="stats.errors > 0" class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold">
                    {{ stats.errors }} Errors
                  </span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Real-time ledger of visual syntheses, audio generations, video compilations & prompt actions.
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button 
                @click="fetchLogs" 
                class="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Refresh Logs"
              >
                <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
              </button>
              <button 
                @click="$emit('close')"
                class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Close"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Telemetry Metric Pills -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            <div class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">🖼️ Visuals</span>
              <span class="text-xs font-mono font-bold text-slate-900 dark:text-white">{{ stats.visuals || 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">🎙️ Audio</span>
              <span class="text-xs font-mono font-bold text-slate-900 dark:text-white">{{ stats.audio || 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">🎬 Video</span>
              <span class="text-xs font-mono font-bold text-slate-900 dark:text-white">{{ stats.video || 0 }}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">⚡ Prompts</span>
              <span class="text-xs font-mono font-bold text-slate-900 dark:text-white">{{ stats.prompts || 0 }}</span>
            </div>
          </div>

          <!-- Controls: Category Filter Tabs & Search -->
          <div class="mt-4 space-y-2.5">
            <div class="flex items-center space-x-2">
              <div class="relative flex-1">
                <Search class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search activity by title, scene tag, or message..."
                  class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <!-- Auto-poll toggle -->
              <button 
                @click="isAutoPoll = !isAutoPoll"
                class="px-2.5 py-1.5 rounded-xl border text-[11px] font-mono flex items-center space-x-1.5 transition cursor-pointer"
                :class="isAutoPoll 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'"
              >
                <div class="w-2 h-2 rounded-full" :class="isAutoPoll ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'" />
                <span>{{ isAutoPoll ? 'Live (2s)' : 'Paused' }}</span>
              </button>
            </div>

            <!-- Category Filter Pills -->
            <div class="flex flex-wrap items-center gap-1.5">
              <button 
                v-for="cat in [
                  { id: 'all', label: 'All' },
                  { id: 'visuals', label: 'Visuals' },
                  { id: 'audio', label: 'Audio' },
                  { id: 'video', label: 'Video' },
                  { id: 'prompt_matrix', label: 'Prompts' },
                  { id: 'script', label: 'Script' },
                  { id: 'system', label: 'System' }
                ]"
                :key="cat.id"
                @click="selectedCategory = cat.id"
                class="px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer"
                :class="selectedCategory === cat.id 
                  ? 'bg-purple-600 text-white font-bold shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'"
              >
                {{ cat.label }}
              </button>

              <button 
                @click="selectedLevel = selectedLevel === 'error' ? 'all' : 'error'"
                class="px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ml-auto"
                :class="selectedLevel === 'error' 
                  ? 'bg-rose-600 text-white font-bold shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-rose-500/10 hover:text-rose-500'"
              >
                Errors Only
              </button>
            </div>
          </div>
        </div>

        <!-- Activity Feed List -->
        <div class="p-5 sm:p-6 space-y-3 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          <div v-if="filteredLogs.length === 0" class="py-12 text-center space-y-2 text-slate-400 font-mono text-xs">
            <Activity class="w-8 h-8 mx-auto text-slate-500 mb-2 opacity-40" />
            <p class="font-semibold text-slate-700 dark:text-slate-300">No activity logs found</p>
            <p class="text-slate-500">Run syntheses, copy prompts, or ingest images to see real-time ledger events.</p>
          </div>

          <div 
            v-for="log in filteredLogs" 
            :key="log.id"
            class="pt-3 first:pt-0 pb-1 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 p-2.5 rounded-xl transition"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start space-x-2.5">
                <!-- Level Icon -->
                <div class="mt-0.5">
                  <CheckCircle2 v-if="log.level === 'success'" class="w-4 h-4 text-emerald-500" />
                  <AlertTriangle v-else-if="log.level === 'warn'" class="w-4 h-4 text-amber-500" />
                  <AlertCircle v-else-if="log.level === 'error'" class="w-4 h-4 text-rose-500" />
                  <Info v-else class="w-4 h-4 text-purple-500 dark:text-purple-400" />
                </div>

                <div class="space-y-1 flex-1">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span 
                      class="text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase"
                      :class="getCategoryBadgeClass(log.category)"
                    >
                      {{ log.category }}
                    </span>
                    <span class="text-xs font-bold text-slate-900 dark:text-white">{{ log.title }}</span>
                    <span v-if="log.episodeId" class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {{ log.episodeId }}
                    </span>
                  </div>

                  <p class="text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed break-words">
                    {{ log.message }}
                  </p>

                  <!-- Expandable Metadata -->
                  <div v-if="log.metadata && Object.keys(log.metadata).length > 0" class="pt-1">
                    <button 
                      @click="toggleDetails(log.id)"
                      class="text-[10px] font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{{ expandedLogIds[log.id] ? 'Hide Details' : 'View Payload' }}</span>
                      <ChevronDown class="w-3 h-3 transition-transform" :class="{ 'rotate-180': expandedLogIds[log.id] }" />
                    </button>

                    <pre 
                      v-if="expandedLogIds[log.id]" 
                      class="mt-1.5 p-2 rounded-lg bg-slate-100 dark:bg-slate-950 text-[10px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto border border-slate-200 dark:border-slate-800"
                    >{{ JSON.stringify(log.metadata, null, 2) }}</pre>
                  </div>
                </div>
              </div>

              <!-- Time & Copy Button -->
              <div class="flex flex-col items-end shrink-0 space-y-1">
                <span class="text-[10px] font-mono text-slate-400">{{ log.timeFormatted || formatTime(log.timestamp) }}</span>
                <button 
                  @click="copyLogLine(log)"
                  class="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Copy log text"
                >
                  <Copy class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs font-mono">
          <button 
            @click="exportLogsJson"
            class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Download class="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <div class="flex items-center space-x-2">
            <button 
              @click="clearAllLogs"
              class="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <button 
              @click="$emit('close')"
              class="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { 
  Activity, X, RefreshCw, Search, CheckCircle2, 
  AlertTriangle, AlertCircle, Info, Copy, ChevronDown, 
  Download, Trash2 
} from 'lucide-vue-next'

const props = defineProps({
  show: Boolean
})

defineEmits(['close'])

const logs = ref([])
const stats = ref({})
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedLevel = ref('all')
const isAutoPoll = ref(true)
const expandedLogIds = ref({})
let pollTimer = null

const fetchLogs = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/activity-logs?limit=300')
    const data = await res.json()
    logs.value = data.logs || []
    stats.value = data.stats || {}
  } catch (err) {
    console.warn('Could not fetch activity logs:', err)
  } finally {
    loading.value = false
  }
}

const filteredLogs = computed(() => {
  let list = logs.value

  if (selectedCategory.value !== 'all') {
    list = list.filter(l => l.category === selectedCategory.value)
  }

  if (selectedLevel.value !== 'all') {
    list = list.filter(l => l.level === selectedLevel.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(l => 
      l.title.toLowerCase().includes(q) ||
      l.message.toLowerCase().includes(q) ||
      (l.episodeId && l.episodeId.toLowerCase().includes(q))
    )
  }

  return list
})

const getCategoryBadgeClass = (category) => {
  switch (category) {
    case 'visuals':
      return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'
    case 'audio':
      return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
    case 'video':
      return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
    case 'prompt_matrix':
      return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
    case 'script':
      return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
  }
}

const toggleDetails = (id) => {
  expandedLogIds.value[id] = !expandedLogIds.value[id]
}

const formatTime = (iso) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleTimeString()
  } catch (e) {
    return iso
  }
}

const copyLogLine = (log) => {
  const line = `[${log.timeFormatted || log.timestamp}] [${log.category.toUpperCase()}] ${log.title}: ${log.message}`
  navigator.clipboard.writeText(line)
}

const exportLogsJson = () => {
  const blob = new Blob([JSON.stringify(logs.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `studio_activity_logs_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const clearAllLogs = async () => {
  if (!confirm('Are you sure you want to clear the studio activity history?')) return
  try {
    await fetch('/api/activity-logs/clear', { method: 'POST' })
    await fetchLogs()
  } catch (err) {
    console.warn('Failed to clear logs:', err)
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    fetchLogs()
    if (isAutoPoll.value) {
      pollTimer = setInterval(fetchLogs, 2500)
    }
  } else {
    if (pollTimer) clearInterval(pollTimer)
  }
})

watch(isAutoPoll, (val) => {
  if (pollTimer) clearInterval(pollTimer)
  if (val && props.show) {
    pollTimer = setInterval(fetchLogs, 2500)
  }
})

onMounted(() => {
  if (props.show) {
    fetchLogs()
    pollTimer = setInterval(fetchLogs, 2500)
  }
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>
