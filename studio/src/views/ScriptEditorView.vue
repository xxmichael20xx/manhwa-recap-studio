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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Save, Sparkles, FileCode, ShieldCheck } from 'lucide-vue-next'

const route = useRoute()
const scriptText = ref('')
const audit = ref({ wordCount: 0, estimatedMinutes: 0, overallScore: 0, checks: [] })
const saving = ref(false)
const savedFeedback = ref(false)
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
    setTimeout(() => { savedFeedback.value = false }, 3000)
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadEpisode()
})
</script>
