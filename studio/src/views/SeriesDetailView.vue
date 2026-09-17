<template>
  <div v-if="franchise" class="space-y-8">
    <!-- Header Back Navigation -->
    <div class="flex items-center justify-between">
      <router-link to="/" class="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Dashboard</span>
      </router-link>
      <span class="text-xs font-mono px-3 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase font-semibold">
        {{ franchise.folder }}
      </span>
    </div>

    <!-- Franchise Overview Banner -->
    <div class="bg-cyber-card border border-cyber-border rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      <div class="space-y-4 max-w-3xl">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
          {{ franchise.name }}
        </h1>
        <div class="space-y-2">
          <label class="text-xs font-mono uppercase text-slate-400">Locked Character Prompt Anchor</label>
          <div class="bg-black/50 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 break-all select-all">
            {{ franchise.characterAnchor || 'Ethan Drake --cref [CHARACTER_URL] --cw 80' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Episodes Grid -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold text-white flex items-center space-x-2">
        <Layers class="w-5 h-5 text-rose-500" />
        <span>Episodic Production Pipeline</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="ep in franchise.episodes" 
          :key="ep.id"
          class="bg-cyber-card border border-cyber-border rounded-2xl p-6 space-y-6 hover:border-slate-700 transition-all"
        >
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">Tier 1: Episode (~20 Mins)</span>
              <h3 class="text-lg font-bold text-white mt-1">{{ ep.name }}</h3>
            </div>
            <div v-if="ep.audit" class="text-right">
              <span class="text-xs font-mono font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {{ ep.audit.overallScore }}% Anti-Slop
              </span>
              <p class="text-[10px] font-mono text-slate-400 mt-1">~{{ ep.audit.wordCount }} words ({{ ep.audit.estimatedMinutes }}m)</p>
            </div>
          </div>

          <!-- Pipeline Step Cards -->
          <div class="grid grid-cols-3 gap-3">
            <router-link 
              :to="`/editor/${franchise.folder}/${ep.id}`"
              class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 text-center space-y-1 transition-all group"
            >
              <FileText class="w-4 h-4 mx-auto text-rose-500 group-hover:scale-110 transition-transform" />
              <div class="text-[11px] font-bold text-slate-200">Script Editor</div>
              <div class="text-[9px] font-mono text-emerald-400">Validated</div>
            </router-link>

            <router-link 
              :to="`/prompts/${franchise.folder}/${ep.id}`"
              class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-center space-y-1 transition-all group"
            >
              <Sparkles class="w-4 h-4 mx-auto text-cyan-400 group-hover:scale-110 transition-transform" />
              <div class="text-[11px] font-bold text-slate-200">Prompt Matrix</div>
              <div class="text-[9px] font-mono text-cyan-400">22 Prompts</div>
            </router-link>

            <router-link 
              :to="`/tts/${franchise.folder}/${ep.id}`"
              class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 text-center space-y-1 transition-all group"
            >
              <Mic class="w-4 h-4 mx-auto text-purple-400 group-hover:scale-110 transition-transform" />
              <div class="text-[11px] font-bold text-slate-200">Audio Studio</div>
              <div class="text-[9px] font-mono text-purple-400">Edge-TTS</div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Layers, FileText, Sparkles, Mic } from 'lucide-vue-next'

const route = useRoute()
const franchise = ref(null)

const loadFranchise = async () => {
  try {
    const res = await fetch('/api/franchises')
    const list = await res.json()
    franchise.value = list.find(f => f.id === route.params.id)
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadFranchise()
})
</script>
