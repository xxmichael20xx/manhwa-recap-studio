<template>
  <div class="space-y-8">
    <!-- Top Hero Section -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-crimson-500/10 via-purple-500/5 to-secondary border border-brand-crimson-500/20 p-8 shadow-sm">
      <div class="relative z-10 max-w-3xl space-y-3">
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-crimson-500/10 border border-brand-crimson-500/30 text-brand-crimson-600 dark:text-brand-crimson-400 text-xs font-mono uppercase tracking-wider">
          <span>🚀 Multi-Franchise Production Hub</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Universal Anti-Slop Studio
        </h1>
        <p class="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Manage original webtoon franchises, draft mathematically sound 4-act scripts, generate 1-click Midjourney/Fooocus prompt matrices, and render free Edge-TTS voiceovers.
        </p>

        <div class="pt-4 flex flex-wrap gap-3">
          <div class="flex items-center space-x-2 text-xs font-mono text-muted-foreground bg-card px-3 py-1.5 rounded-lg border border-border shadow-sm">
            <span class="w-2 h-2 rounded-full bg-brand-cyan-500"></span>
            <span>Triple-Archetype Engine Ready</span>
          </div>
          <div class="flex items-center space-x-2 text-xs font-mono text-muted-foreground bg-card px-3 py-1.5 rounded-lg border border-border shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>$5,000 EXP Re-Indexing Active</span>
          </div>
          <div class="flex items-center space-x-2 text-xs font-mono text-muted-foreground bg-card px-3 py-1.5 rounded-lg border border-border shadow-sm">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>200 CON Durability Law Enforced</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Franchises & Series Grid -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-foreground flex items-center space-x-2">
            <Film class="w-5 h-5 text-brand-crimson-500" />
            <span>Active Franchises</span>
          </h2>
          <p class="text-xs text-muted-foreground">Isolated story repositories inheriting the universal engine</p>
        </div>
        <router-link 
          to="/engine"
          class="text-xs font-mono text-brand-cyan-600 dark:text-brand-cyan-400 hover:underline flex items-center space-x-1"
        >
          <span>View Archetype Blueprints</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-12 text-muted-foreground font-mono">
        Scanning /01_Franchises/ directory...
      </div>

      <div v-else-if="franchises.length === 0" class="text-center py-12 bg-card rounded-xl border border-border text-muted-foreground">
        No active franchises found in 01_Franchises directory.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="item in franchises" 
          :key="item.id"
          class="bg-card border border-border hover:border-brand-crimson-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand-crimson-500/5 flex flex-col justify-between group shadow-sm"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <span class="text-xs font-mono px-2.5 py-1 rounded bg-brand-crimson-500/10 text-brand-crimson-600 dark:text-brand-crimson-400 border border-brand-crimson-500/20 uppercase font-semibold">
                {{ item.id.includes('01') ? 'Archetype A' : 'Archetype B' }}
              </span>
              <span class="text-xs font-mono text-muted-foreground">{{ item.episodes.length }} Episodes</span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-foreground group-hover:text-brand-crimson-500 transition-colors">
                {{ item.name }}
              </h3>
              <p class="text-xs text-muted-foreground mt-1 line-clamp-2">
                {{ item.characterAnchor || 'Universal character prompt seed configured.' }}
              </p>
            </div>

            <!-- Episodes List Mini -->
            <div class="space-y-2 pt-2 border-t border-border">
              <div 
                v-for="ep in item.episodes" 
                :key="ep.id"
                class="flex items-center justify-between text-xs bg-secondary/60 px-3 py-2 rounded-lg border border-border"
              >
                <div class="flex items-center space-x-2">
                  <PlayCircle class="w-3.5 h-3.5 text-brand-crimson-500" />
                  <span class="font-medium text-foreground truncate max-w-[140px]">{{ ep.name }}</span>
                </div>
                <div class="flex items-center space-x-2 font-mono text-[10px]">
                  <span v-if="ep.audit?.isAntiSlopCertified" class="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {{ ep.audit.overallScore }}% Anti-Slop
                  </span>
                  <span v-if="ep.audioCount > 0" class="text-brand-cyan-600 dark:text-brand-cyan-400 font-semibold">
                    {{ ep.audioCount }} VO
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <router-link 
              :to="`/franchises/${item.id}`"
              class="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-brand-crimson-600 text-primary-foreground text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm"
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
