<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <BookOpen class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <span>Universal Anti-Slop Engine Codex</span>
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">Core directives, mathematical laws, and archetype blueprints inherited across all franchises.</p>
      </div>
      <span class="text-xs font-mono px-3 py-1 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 uppercase font-semibold">
        👑 /00_Engine/ Core
      </span>
    </div>

    <!-- Main Content Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Document Selector (4 cols) -->
      <div class="lg:col-span-4 space-y-2.5">
        <button
          v-for="(doc, index) in docs"
          :key="doc.filename"
          @click="selectedDocIndex = index"
          class="w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer"
          :class="selectedDocIndex === index ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-500 text-purple-900 dark:text-purple-100 shadow-sm ring-1 ring-purple-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-purple-500/40 hover:bg-slate-50 dark:hover:bg-slate-800'"
        >
          <div class="space-y-1">
            <div class="text-xs font-mono" :class="selectedDocIndex === index ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400 dark:text-slate-500 group-hover:text-purple-500 dark:group-hover:text-purple-400'">{{ doc.filename }}</div>
            <div class="text-sm font-bold" :class="selectedDocIndex === index ? 'text-purple-950 dark:text-white' : 'text-slate-900 dark:text-slate-100'">{{ doc.title }}</div>
          </div>
          <ChevronRight class="w-4 h-4 transition-transform" :class="selectedDocIndex === index ? 'text-amber-500 dark:text-amber-400 translate-x-0.5' : 'text-slate-400 group-hover:text-purple-500'" />
        </button>
      </div>

      <!-- Document Viewer (8 cols) -->
      <div class="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div v-if="currentDoc" class="space-y-4">
          <div class="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span class="text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold">{{ currentDoc.filename }}</span>
              <h2 class="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{{ currentDoc.title }}</h2>
            </div>
            <span class="text-[11px] font-mono px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-semibold">
              👑 Universal Law Active
            </span>
          </div>
          <pre class="font-mono text-xs text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed overflow-x-auto bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner select-text">{{ currentDoc.content }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { BookOpen, ChevronRight } from 'lucide-vue-next'

const docs = ref([])
const selectedDocIndex = ref(0)

const currentDoc = computed(() => docs.value[selectedDocIndex.value] || null)

const loadEngineDocs = async () => {
  try {
    const res = await fetch('/api/engine')
    docs.value = await res.json()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadEngineDocs()
})
</script>
