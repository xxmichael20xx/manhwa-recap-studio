<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center space-x-2">
          <BookOpen class="w-6 h-6 text-cyan-400" />
          <span>Universal Anti-Slop Engine Codex</span>
        </h1>
        <p class="text-xs text-slate-400">Core directives, mathematical laws, and archetype blueprints inherited across all franchises.</p>
      </div>
      <span class="text-xs font-mono px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-semibold">
        /00_Engine/ Core
      </span>
    </div>

    <!-- Main Content Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Document Selector (4 cols) -->
      <div class="lg:col-span-4 space-y-2">
        <button
          v-for="(doc, index) in docs"
          :key="doc.filename"
          @click="selectedDocIndex = index"
          class="w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group"
          :class="selectedDocIndex === index ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' : 'bg-cyber-card border-cyber-border text-slate-400 hover:text-slate-200 hover:border-slate-700'"
        >
          <div class="space-y-1">
            <div class="text-xs font-mono text-slate-500 group-hover:text-slate-400">{{ doc.filename }}</div>
            <div class="text-sm font-bold text-slate-200">{{ doc.title }}</div>
          </div>
          <ChevronRight class="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-transform" />
        </button>
      </div>

      <!-- Document Viewer (8 cols) -->
      <div class="lg:col-span-8 bg-cyber-card border border-cyber-border rounded-2xl p-6 sm:p-8 space-y-6">
        <div v-if="currentDoc" class="space-y-4">
          <div class="border-b border-cyber-border/80 pb-4">
            <span class="text-xs font-mono text-cyan-400">{{ currentDoc.filename }}</span>
            <h2 class="text-xl font-extrabold text-white mt-1">{{ currentDoc.title }}</h2>
          </div>
          <pre class="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">{{ currentDoc.content }}</pre>
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
