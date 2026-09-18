<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <router-link :to="`/franchises/${$route.params.franchiseId}`" class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm transition">
          <ArrowLeft class="w-4 h-4" />
        </router-link>
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase font-semibold">{{ $route.params.franchiseId }}</span>
            <span class="text-slate-400">/</span>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ $route.params.episodeId }}</span>
          </div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">4-Act Script & Anti-Slop Studio</h1>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <button 
          @click="openHistoryDrawer" 
          class="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
          title="Inspect version history & restore previous drafts"
        >
          <History class="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>History</span>
          <span v-if="historyList.length > 0" class="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-500/30">
            {{ historyList.length }}
          </span>
        </button>

        <button 
          @click="saveScript" 
          :disabled="saving"
          class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-md shadow-purple-900/20 disabled:opacity-50 cursor-pointer"
        >
          <Save class="w-4 h-4" />
          <span>{{ saving ? 'Saving...' : 'Save Script to Disk' }}</span>
        </button>

        <router-link 
          :to="`/prompts/${$route.params.franchiseId}/${$route.params.episodeId}`"
          class="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
        >
          <Sparkles class="w-4 h-4" />
          <span>Prompt Matrix</span>
        </router-link>
      </div>
    </div>

    <!-- Notification Toasts -->
    <div v-if="restoreFeedback" class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center justify-between shadow-sm">
      <div class="flex items-center space-x-2">
        <Check class="w-4 h-4 text-emerald-500" />
        <span>{{ restoreFeedback }} (live draft was automatically backed up).</span>
      </div>
      <button @click="restoreFeedback = ''" class="text-xs hover:opacity-75 font-bold">✕</button>
    </div>

    <!-- Main Workspace Layout: Editor (Left) + Anti-Slop Audit Panel (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Editor Column (8 cols) -->
      <div class="lg:col-span-8 space-y-4">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[750px] shadow-sm">
          <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center space-x-2">
              <FileCode class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>01_Episode_Script.md</span>
            </span>
            <span v-if="savedFeedback" class="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
              ✓ Saved to 01_Franchises Directory
            </span>
          </div>
          <textarea 
            v-model="scriptText" 
            @input="handleInput"
            class="flex-1 w-full bg-transparent p-6 text-slate-900 dark:text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none"
            placeholder="Write your 4-act script here..."
          ></textarea>
        </div>
      </div>

      <!-- Anti-Slop Audit Sidebar (4 cols) -->
      <div class="lg:col-span-4 space-y-6">
        <!-- Live Metrics Card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck class="w-4 h-4 text-emerald-500" />
              <span>Anti-Slop Real-Time Audit</span>
            </h2>
            <span 
              class="text-xs font-mono font-bold px-2 py-1 rounded"
              :class="audit.overallScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'"
            >
              {{ audit.overallScore || 0 }}% CERTIFIED
            </span>
          </div>

          <!-- Words & Runtime Estimates -->
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Word Count</div>
              <div class="text-lg font-extrabold text-slate-900 dark:text-white font-mono mt-1">{{ audit.wordCount || 0 }}</div>
            </div>
            <div class="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Runtime @ 140 WPM</div>
              <div class="text-lg font-extrabold text-amber-500 dark:text-amber-400 font-mono mt-1">{{ audit.estimatedMinutes || 0 }}m</div>
            </div>
          </div>

          <!-- 5 Pillars Checklist -->
          <div class="space-y-3 pt-2">
            <div class="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider font-semibold">Pillars Verification</div>
            <div 
              v-for="check in audit.checks" 
              :key="check.id"
              class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 dark:text-slate-100">{{ check.name }}</span>
                <span 
                  class="font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold"
                  :class="check.passed ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20' : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20'"
                >
                  {{ check.score }}%
                </span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{{ check.details }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Slide-Over History Drawer -->
    <teleport to="body">
      <div v-if="historyOpen" class="fixed inset-0 z-50 overflow-hidden">
        <!-- Backdrop -->
        <div 
          @click="closeHistoryDrawer" 
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        ></div>

        <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div class="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
            
            <!-- Drawer Header -->
            <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div class="flex items-center space-x-2.5">
                <div class="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <History class="w-4 h-4" />
                </div>
                <div>
                  <h2 class="text-sm font-bold text-slate-900 dark:text-white">Script Version History</h2>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">Review and restore previous script drafts</p>
                </div>
              </div>
              <button 
                @click="closeHistoryDrawer"
                class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Manual Checkpoint Creator -->
            <div class="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20">
              <div class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                <span>Create Manual Snapshot</span>
                <span class="text-[10px] font-mono text-purple-600 dark:text-purple-400">Zero-Loss Safety</span>
              </div>
              <div class="flex space-x-2">
                <input 
                  v-model="manualLabel" 
                  type="text" 
                  placeholder="e.g., Pre-Boss Battle Polish" 
                  @keyup.enter="createManualSnapshot"
                  class="flex-1 px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <button 
                  @click="createManualSnapshot" 
                  :disabled="creatingSnapshot || !manualLabel.trim()"
                  class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <PlusCircle class="w-3.5 h-3.5" />
                  <span>{{ creatingSnapshot ? 'Saving...' : 'Snapshot' }}</span>
                </button>
              </div>
            </div>

            <!-- Snapshots List -->
            <div class="flex-1 overflow-y-auto p-4 space-y-3">
              <div v-if="historyLoading" class="p-8 text-center text-xs text-slate-400">
                Loading history snapshots...
              </div>
              
              <div v-else-if="historyList.length === 0" class="p-8 text-center text-xs text-slate-400">
                No snapshots found yet. Save your script or create a manual snapshot above!
              </div>

              <div 
                v-else 
                v-for="item in historyList" 
                :key="item.filename"
                class="p-4 rounded-xl border transition-all space-y-3"
                :class="item.label.includes('Auto-Backup') 
                  ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30' 
                  : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-purple-500/40'"
              >
                <!-- Snapshot Title & Time -->
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-bold text-slate-900 dark:text-white">
                        {{ item.label }}
                      </span>
                      <span 
                        v-if="item.label.includes('Auto-Backup')"
                        class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                      >
                        BACKUP
                      </span>
                    </div>
                    <div class="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex items-center space-x-1 mt-0.5">
                      <Clock class="w-3 h-3" />
                      <span>{{ formatDate(item.timestamp) }}</span>
                    </div>
                  </div>

                  <!-- Anti-Slop Badge -->
                  <span 
                    class="text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0"
                    :class="item.overallScore >= 80 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                      : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'"
                  >
                    {{ item.overallScore || 0 }}% CERT
                  </span>
                </div>

                <!-- Stats summary -->
                <div class="flex items-center space-x-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>{{ item.wordCount }} words</span>
                  <span>•</span>
                  <span>{{ item.estimatedMinutes }}m runtime</span>
                </div>

                <!-- Preview Snippet -->
                <p class="text-[11px] font-mono text-slate-600 dark:text-slate-300 line-clamp-3 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                  {{ item.scriptPreview || '(Empty script)' }}
                </p>

                <!-- Actions: Restore with Confirmation -->
                <div class="pt-1 flex items-center justify-end space-x-2">
                  <template v-if="confirmRestoreTarget === item.filename">
                    <span class="text-[10px] font-mono text-amber-600 dark:text-amber-400 mr-auto font-medium">
                      Overwrite current draft?
                    </span>
                    <button 
                      @click="confirmRestoreTarget = null" 
                      class="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      @click="restoreVersion(item.filename)" 
                      :disabled="restoring"
                      class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1 shadow-sm transition cursor-pointer"
                    >
                      <Check class="w-3.5 h-3.5" />
                      <span>{{ restoring ? 'Restoring...' : 'Yes, Restore' }}</span>
                    </button>
                  </template>

                  <button 
                    v-else 
                    @click="confirmRestoreTarget = item.filename"
                    class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <RotateCcw class="w-3.5 h-3.5" />
                    <span>Restore Draft</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Drawer Footer -->
            <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-center">
              <span class="text-[10px] text-slate-400 font-mono">
                🛡️ Zero-Loss Safety: Live draft is automatically backed up before any restore.
              </span>
            </div>

          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  FileCode, 
  ShieldCheck, 
  History, 
  X, 
  PlusCircle, 
  RotateCcw, 
  Check, 
  Clock 
} from 'lucide-vue-next'

const route = useRoute()
const scriptText = ref('')
const audit = ref({ wordCount: 0, estimatedMinutes: 0, overallScore: 0, checks: [] })
const saving = ref(false)
const savedFeedback = ref(false)
const restoreFeedback = ref('')

// History & Snapshot State
const historyOpen = ref(false)
const historyList = ref([])
const historyLoading = ref(false)
const manualLabel = ref('')
const creatingSnapshot = ref(false)
const confirmRestoreTarget = ref(null)
const restoring = ref(false)

let debounceTimer = null

const loadEpisode = async () => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}`)
    const data = await res.json()
    scriptText.value = data.script || ''
    if (data.audit) audit.value = data.audit
  } catch (err) {
    console.error(err)
  }
}

const loadHistory = async () => {
  historyLoading.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/history`)
    const data = await res.json()
    if (Array.isArray(data)) {
      historyList.value = data
    }
  } catch (err) {
    console.error('Failed to load script history:', err)
  } finally {
    historyLoading.value = false
  }
}

const openHistoryDrawer = () => {
  historyOpen.value = true
  confirmRestoreTarget.value = null
  loadHistory()
}

const closeHistoryDrawer = () => {
  historyOpen.value = false
  confirmRestoreTarget.value = null
}

const createManualSnapshot = async () => {
  if (!manualLabel.value.trim() || creatingSnapshot.value) return
  creatingSnapshot.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        script: scriptText.value, 
        label: manualLabel.value.trim() 
      })
    })
    const data = await res.json()
    if (data.success) {
      manualLabel.value = ''
      await loadHistory()
    }
  } catch (err) {
    console.error('Failed to create manual snapshot:', err)
  } finally {
    creatingSnapshot.value = false
  }
}

const restoreVersion = async (filename) => {
  restoring.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/history/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    })
    const data = await res.json()
    if (data.success) {
      scriptText.value = data.script
      if (data.audit) audit.value = data.audit
      restoreFeedback.value = `Successfully restored draft from snapshot (${filename})`
      confirmRestoreTarget.value = null
      await loadHistory()
      closeHistoryDrawer()
      setTimeout(() => {
        restoreFeedback.value = ''
      }, 6000)
    }
  } catch (err) {
    console.error('Failed to restore snapshot:', err)
  } finally {
    restoring.value = false
  }
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  try {
    const d = new Date(isoString)
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return isoString
  }
}

const handleInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptText.value })
      })
      audit.value = await res.json()
    } catch (e) {}
  }, 400)
}

const saveScript = async () => {
  saving.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script: scriptText.value })
    })
    const data = await res.json()
    audit.value = data.audit
    savedFeedback.value = true
    await loadHistory()
    setTimeout(() => { savedFeedback.value = false }, 3000)
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadEpisode()
  loadHistory()
})
</script>
