<template>
  <header class="bg-white/90 dark:bg-brand-dark-900/90 border-b border-slate-200 dark:border-brand-dark-800 px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm backdrop-blur-md">
    <div class="flex items-center space-x-3">
      <!-- Mobile Navigation Hamburger Button -->
      <button 
        type="button"
        @click="$emit('toggle-mobile-sidebar')"
        class="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-brand-dark-800 bg-slate-100/80 dark:bg-brand-dark-950 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-brand-dark-800 transition active:scale-95 shadow-sm cursor-pointer"
        title="Open navigation menu"
      >
        <Menu class="w-4 h-4" />
      </button>

      <div>
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white capitalize flex items-center">
          <span class="mr-2">{{ viewIcon }}</span>
          {{ viewTitle }}
        </h2>
        <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden xs:block">{{ viewSubtitle }}</p>
      </div>
    </div>

    <div class="flex items-center space-x-2 sm:space-x-3 flex-wrap justify-end gap-y-1.5">
      <!-- Dark / Light Mode Toggle Button -->
      <button
        @click="$emit('toggle-theme')"
        class="h-8 px-3 rounded-xl border border-slate-200 dark:border-brand-dark-700 bg-slate-100 dark:bg-brand-dark-800 hover:bg-slate-200 dark:hover:bg-brand-dark-700 text-slate-700 dark:text-slate-200 transition shadow-sm flex items-center space-x-2 text-xs font-medium cursor-pointer"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <span v-if="isDark" class="flex items-center space-x-1.5 text-brand-gold-400">
          <Sun class="w-3.5 h-3.5 text-brand-gold-400" />
          <span class="hidden md:inline font-mono font-semibold">Light Mode</span>
        </span>
        <span v-else class="flex items-center space-x-1.5 text-purple-600 dark:text-purple-400">
          <Moon class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span class="hidden md:inline font-mono font-semibold">Dark Mode</span>
        </span>
      </button>

      <!-- Quick Action: Copy Master Character DNA -->
      <button 
        @click="$emit('copy-dna')"
        class="h-8 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 border border-purple-400/30 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-900/40 transition active:scale-95 cursor-pointer"
        title="Copy Ethan Drake's locked Midjourney --cref prompt string"
      >
        <Sparkles class="w-3.5 h-3.5 text-brand-gold-400" />
        <span class="hidden sm:inline">Copy Character DNA</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, Sun, Moon, Sparkles } from 'lucide-vue-next'

const props = defineProps({
  isDark: Boolean
})

defineEmits(['toggle-mobile-sidebar', 'toggle-theme', 'copy-dna'])

const route = useRoute()

const viewTitle = computed(() => {
  if (route.path === '/') return 'Production Dashboard'
  if (route.path.startsWith('/franchises')) return 'Franchise Studio'
  if (route.path.startsWith('/editor')) return '4-Act Script Editor'
  if (route.path.startsWith('/prompts')) return 'Prompt Matrix Hub'
  if (route.path.startsWith('/tts')) return 'Voiceover Audio Suite'
  if (route.path === '/engine') return 'Anti-Slop Codex'
  return 'Studio'
})

const viewIcon = computed(() => {
  if (route.path === '/') return '👑'
  if (route.path.startsWith('/franchises')) return '🎬'
  if (route.path.startsWith('/editor')) return '✍️'
  if (route.path.startsWith('/prompts')) return '🎨'
  if (route.path.startsWith('/tts')) return '🎙️'
  if (route.path === '/engine') return '📜'
  return '⚡'
})

const viewSubtitle = computed(() => {
  if (route.path === '/') return 'Multi-Franchise Overview & Episode Pipelines'
  if (route.path.startsWith('/franchises')) return 'Manage Series DNA, Bibles & Season Arcs'
  if (route.path.startsWith('/editor')) return 'Real-time Anti-Slop Validation & Word Count'
  if (route.path.startsWith('/prompts')) return '1-Click Midjourney / Fooocus Prompt Generation'
  if (route.path.startsWith('/tts')) return 'Free Edge-TTS Synthesis & Waveform Player'
  if (route.path === '/engine') return 'Universal Mathematical Laws & Archetype Blueprints'
  return ''
})
</script>
