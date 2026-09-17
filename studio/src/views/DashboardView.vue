<template>
  <div class="space-y-8">
    <!-- Top Hero Section -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/20 to-cyber-card border border-rose-500/20 p-8 shadow-2xl">
      <div class="relative z-10 max-w-3xl space-y-3">
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono uppercase tracking-wider">
          <span>🚀 Multi-Franchise Production Hub</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Universal Anti-Slop Studio
        </h1>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
          Manage original webtoon franchises, draft mathematically sound 4-act scripts, generate 1-click Midjourney/Fooocus prompt matrices, and render free Edge-TTS voiceovers.
        </p>

        <div class="pt-4 flex flex-wrap gap-4">
          <div class="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Triple-Archetype Engine Ready</span>
          </div>
          <div class="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>$5,000 EXP Re-Indexing Active</span>
          </div>
          <div class="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>200 CON Durability Law Enforced</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Franchises & Series Grid -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center space-x-2">
            <Film class="w-5 h-5 text-rose-500" />
            <span>Active Franchises</span>
          </h2>
          <p class="text-xs text-slate-400">Isolated story repositories inheriting the universal engine</p>
        </div>
        <router-link 
          to="/engine"
          class="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
        >
          <span>View Archetype Blueprints</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-12 text-slate-500 font-mono">
        Scanning /01_Franchises/ directory...
      </div>

      <div v-else-if="franchises.length === 0" class="text-center py-12 bg-cyber-card rounded-xl border border-cyber-border text-slate-400">
        No active franchises found in 01_Franchises directory.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="item in franchises" 
          :key="item.id"
          class="bg-cyber-card border border-cyber-border hover:border-rose-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10 flex flex-col justify-between group"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <span class="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase font-semibold">
                {{ item.id.includes('01') ? 'Archetype A' : 'Archetype B' }}
              </span>
              <span class="text-xs font-mono text-slate-400">{{ item.episodes.length }} Episodes</span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                {{ item.name }}
              </h3>
              <p class="text-xs text-slate-400 mt-1 line-clamp-2">
                {{ item.characterAnchor || 'Universal character prompt seed configured.' }}
              </p>
            </div>

            <!-- Episodes List Mini -->
            <div class="space-y-2 pt-2 border-t border-cyber-border/60">
              <div 
                v-for="ep in item.episodes" 
                :key="ep.id"
                class="flex items-center justify-between text-xs bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80"
              >
                <div class="flex items-center space-x-2">
                  <PlayCircle class="w-3.5 h-3.5 text-rose-500" />
                  <span class="font-medium text-slate-200 truncate max-w-[140px]">{{ ep.name }}</span>
                </div>
                <div class="flex items-center space-x-2 font-mono text-[10px]">
                  <span v-if="ep.audit?.isAntiSlopCertified" class="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {{ ep.audit.overallScore }}% Anti-Slop
                  </span>
                  <span v-if="ep.audioCount > 0" class="text-cyan-400">
                    {{ ep.audioCount }} VO
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <router-link 
              :to="`/franchises/${item.id}`"
              class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-600 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <span>Open Franchise Studio</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Film, ArrowRight, PlayCircle } from 'lucide-vue-next'

const franchises = ref([])
const loading = ref(true)

const fetchFranchises = async () => {
  try {
    const res = await fetch('/api/franchises')
    franchises.value = await res.json()
  } catch (err) {
    console.error('Failed to load franchises:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFranchises()
})
</script>
