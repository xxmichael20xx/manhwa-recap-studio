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
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Integrated Voiceover Audio Studio</h1>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <select 
          v-model="selectedVoice"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 shadow-sm"
        >
          <option value="en-US-ChristopherNeural">Christopher (US - Deep Narrative)</option>
          <option value="en-GB-RyanNeural">Ryan (UK - Clear Authoritative)</option>
          <option value="en-US-EricNeural">Eric (US - Intense Action)</option>
          <option value="en-US-GuyNeural">Guy (US - Dramatic Male)</option>
        </select>

        <button 
          @click="generateAllAudio"
          :disabled="rendering"
          class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-md shadow-purple-900/30 disabled:opacity-50 cursor-pointer"
        >
          <Volume2 class="w-4 h-4" :class="{ 'animate-pulse': rendering }" />
          <span>{{ rendering ? 'Rendering Audio...' : 'Generate All Scene VO (Edge-TTS $0)' }}</span>
        </button>
      </div>
    </div>

    <!-- Audio Player / Track List -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden space-y-4 p-6 shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 class="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Radio class="w-4 h-4 text-purple-500" />
            <span>Generated Scene Audio Tracks (Ready for CapCut Timeline)</span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Files saved directly in {{ $route.params.episodeId }}/audio/</p>
        </div>
        <span class="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
          {{ audioList.length }} Tracks Available
        </span>
      </div>

      <div v-if="rendering" class="py-12 text-center space-y-3 font-mono text-xs text-purple-500">
        <div class="inline-block w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p>Synthesizing neural voiceover tracks via Microsoft Edge-TTS...</p>
      </div>

      <div v-else-if="audioList.length === 0" class="py-12 text-center text-slate-400 dark:text-slate-500 font-mono text-xs">
        No audio tracks generated yet. Click "Generate All Scene VO" to synthesize audio from the script.
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="(track, index) in audioList" 
          :key="index"
          class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div class="space-y-1 flex-1">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-500/30">
                SCENE {{ String(index + 1).padStart(2, '0') }}
              </span>
              <span class="text-xs font-mono text-slate-900 dark:text-white">{{ track }}</span>
            </div>
          </div>

          <div class="flex items-center space-x-3 w-full sm:w-auto">
            <audio 
              controls 
              class="h-9 w-full sm:w-64 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner"
              :src="`/api/audio/${$route.params.franchiseId}/${$route.params.episodeId}/${track}`"
            ></audio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Volume2, Radio } from 'lucide-vue-next'

const route = useRoute()
const selectedVoice = ref('en-US-ChristopherNeural')
const audioList = ref([])
const rendering = ref(false)

const loadEpisodeAudio = async () => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}`)
    const data = await res.json()
    audioList.value = data.audioFiles || []
  } catch (err) {
    console.error(err)
  }
}

const generateAllAudio = async () => {
  rendering.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/generate-tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voice: selectedVoice.value })
    })
    const data = await res.json()
    audioList.value = data.files.map(f => f.filename)
  } catch (err) {
    console.error(err)
  } finally {
    rendering.value = false
  }
}

onMounted(() => {
  loadEpisodeAudio()
})
</script>
