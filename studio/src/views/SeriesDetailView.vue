<template>
  <div v-if="franchise" class="space-y-8">
    <!-- Header Back Navigation -->
    <div class="flex items-center justify-between">
      <router-link to="/" class="inline-flex items-center space-x-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Dashboard</span>
      </router-link>
      <span class="text-xs font-mono px-3 py-1 rounded bg-brand-amethyst-500/10 text-brand-amethyst-400 border border-brand-amethyst-500/20 uppercase font-semibold">
        {{ franchise.folder }}
      </span>
    </div>

    <!-- Franchise Overview Banner -->
    <div class="bg-card border border-border rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
      <div class="space-y-4 max-w-3xl">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-foreground">
          {{ franchise.name }}
        </h1>
        <div class="space-y-2">
          <label class="text-xs font-mono uppercase text-muted-foreground">Locked Character Prompt Anchor</label>
          <div class="bg-secondary/60 p-3 rounded-xl border border-border text-xs font-mono text-brand-gold-400 break-all select-all">
            👑 {{ franchise.characterAnchor || 'Ethan Drake --cref [CHARACTER_URL] --cw 80' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Episodes Grid -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold text-foreground flex items-center space-x-2">
        <Layers class="w-5 h-5 text-brand-amethyst-400" />
        <span>Episodic Production Pipeline</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="ep in franchise.episodes" 
          :key="ep.id"
          class="bg-card border border-border rounded-2xl p-6 space-y-6 hover:border-brand-amethyst-500/40 transition-all shadow-sm"
        >
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground uppercase">Tier 1: Episode (~20 Mins)</span>
              <h3 class="text-lg font-bold text-foreground mt-1">{{ ep.name }}</h3>
            </div>
            <div v-if="ep.audit" class="text-right">
              <span class="text-xs font-mono font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {{ ep.audit.overallScore }}% Anti-Slop
              </span>
              <p class="text-[10px] font-mono text-muted-foreground mt-1">~{{ ep.audit.wordCount }} words ({{ ep.audit.estimatedMinutes }}m)</p>
            </div>
          </div>

          <!-- Pipeline Step Cards -->
          <div class="grid grid-cols-3 gap-3">
            <router-link 
              :to="`/editor/${franchise.folder}/${ep.id}`"
              class="p-3 rounded-xl bg-secondary/40 border border-border hover:border-brand-amethyst-500/50 text-center space-y-1 transition-all group"
            >
              <FileText class="w-4 h-4 mx-auto text-brand-amethyst-400 group-hover:scale-110 transition-transform" />
              <div class="text-[11px] font-bold text-foreground">Script Editor</div>
              <div class="text-[9px] font-mono text-emerald-400">Validated</div>
            </router-link>

            <router-link 
              :to="`/prompts/${franchise.folder}/${ep.id}`"
              class="p-3 rounded-xl bg-secondary/40 border border-border hover:border-brand-gold-500/50 text-center space-y-1 transition-all group"
            >
              <Sparkles class="w-4 h-4 mx-auto text-brand-gold-400 group-hover:scale-110 transition-transform" />
              <div class="text-[11px] font-bold text-foreground">Prompt Matrix</div>
              <div class="text-[9px] font-mono text-brand-gold-400">22 Prompts</div>
            </router-link>

            <router-link 
              :to="`/tts/${franchise.folder}/${ep.id}`"
              class="p-3 rounded-xl bg-secondary/40 border border-border hover:border-brand-amethyst-500/50 text-center space-y-1 transition-all group"
            >
              <Mic class="w-4 h-4 mx-auto text-brand-amethyst-400 group-hover:scale-110 transition-transform" />
              <div class="text-[11px] font-bold text-foreground">Audio Studio</div>
              <div class="text-[9px] font-mono text-brand-amethyst-400">Edge-TTS</div>
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
