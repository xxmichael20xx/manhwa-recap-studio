<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <router-link :to="`/franchises/${$route.params.franchiseId}`" class="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm">
          <ArrowLeft class="w-4 h-4" />
        </router-link>
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase font-semibold">{{ $route.params.franchiseId }}</span>
            <span class="text-slate-400">/</span>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ $route.params.episodeId }}</span>
          </div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Visual Prompt Matrix Hub</h1>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <button 
          @click="regeneratePrompts"
          :disabled="generating"
          class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-md shadow-purple-900/30 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': generating }" />
          <span>Sync & Regenerate</span>
        </button>

        <button 
          @click="copyAllPrompts"
          class="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 text-slate-900 dark:text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
        >
          <Copy class="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>{{ copiedAll ? 'All Prompts Copied!' : 'Copy All for Midjourney' }}</span>
        </button>

        <router-link 
          :to="`/tts/${$route.params.franchiseId}/${$route.params.episodeId}`"
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-md shadow-purple-950/40"
        >
          <Mic class="w-4 h-4" />
          <span>Audio Studio</span>
        </router-link>
      </div>
    </div>

    <!-- Prompts Table / Cards -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
          Showing {{ parsedPrompts.length }} Action Panels (16:9 Midjourney / Fooocus Ready)
        </span>
        <span class="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
          👑 --cref [CHARACTER_URL] --cw 80 Active
        </span>
      </div>

      <div class="divide-y divide-slate-200 dark:divide-slate-800">
        <div 
          v-for="(p, index) in parsedPrompts" 
          :key="index"
          class="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div class="space-y-1.5 flex-1">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-bold">
                {{ p.tag }}
              </span>
              <span class="text-xs font-semibold text-slate-900 dark:text-white">{{ p.description }}</span>
            </div>
            <p class="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 break-all select-all">
              {{ p.prompt }}
            </p>
          </div>

          <div>
            <button 
              @click="copySinglePrompt(p.prompt, index)"
              class="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-purple-600 hover:text-white hover:border-purple-600 text-slate-700 dark:text-slate-200 text-xs font-mono font-medium flex items-center space-x-1.5 transition-all w-full md:w-auto justify-center cursor-pointer shadow-sm"
            >
              <Check v-if="copiedIndex === index" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ copiedIndex === index ? 'Copied' : 'Copy Prompt' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, RefreshCw, Copy, Check, Mic } from 'lucide-vue-next'

const route = useRoute()
const parsedPrompts = ref([])
const generating = ref(false)
const copiedIndex = ref(null)
const copiedAll = ref(false)

const loadEpisode = async () => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}`)
    const data = await res.json()
    parseMarkdownPrompts(data.promptMatrix || '')
  } catch (err) {
    console.error(err)
  }
}

const parseMarkdownPrompts = (markdown) => {
  const lines = markdown.split('\n')
  const results = []
  
  for (const line of lines) {
    const match = line.match(/^\|\s*`?(\[IMG_\d+\])`?\s*\|\s*`?([^|]+)`?\s*\|/)
    if (match) {
      results.push({
        tag: match[1],
        description: `Scene Panel ${match[1]}`,
        prompt: match[2].trim()
      })
    }
  }

  // Fallback if empty
  if (results.length === 0) {
    for (let i = 1; i <= 22; i++) {
      const tag = `[IMG_${String(i).padStart(3, '0')}]`
      results.push({
        tag,
        description: `Action Panel ${tag}`,
        prompt: `manhwa webtoon style, action webcomic panel, Ethan Drake standing amidst shattered dungeon stone, dynamic low angle, cinematic lighting, 8k resolution --cref [CHARACTER_URL] --cw 80 --ar 16:9 --style raw`
      })
    }
  }

  parsedPrompts.value = results
}

const copySinglePrompt = (text, index) => {
  navigator.clipboard.writeText(text)
  copiedIndex.value = index
  setTimeout(() => { copiedIndex.value = null }, 2000)
}

const copyAllPrompts = () => {
  const allText = parsedPrompts.value.map(p => `${p.tag}: ${p.prompt}`).join('\n\n')
  navigator.clipboard.writeText(allText)
  copiedAll.value = true
  setTimeout(() => { copiedAll.value = false }, 2500)
}

const regeneratePrompts = async () => {
  generating.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/generate-prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterAnchor: 'Ethan Drake --cref [CHARACTER_URL] --cw 80' })
    })
    const data = await res.json()
    parseMarkdownPrompts(data.promptMatrix)
  } catch (err) {
    console.error(err)
  } finally {
    generating.value = false
  }
}

onMounted(() => {
  loadEpisode()
})
</script>
