<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground flex items-center space-x-2">
          <BookOpen class="w-6 h-6 text-brand-amethyst-400" />
          <span>Universal Anti-Slop Engine Codex</span>
        </h1>
        <p class="text-xs text-muted-foreground">Core directives, mathematical laws, and archetype blueprints inherited across all franchises.</p>
      </div>
      <span class="text-xs font-mono px-3 py-1 rounded bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-500/30 uppercase font-semibold">
        👑 /00_Engine/ Core
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
          class="w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer"
          :class="selectedDocIndex === index ? 'bg-brand-amethyst-500/15 border-brand-amethyst-500/50 text-brand-amethyst-300 shadow-lg shadow-brand-amethyst-500/10' : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-brand-amethyst-500/30'"
        >
          <div class="space-y-1">
            <div class="text-xs font-mono text-muted-foreground group-hover:text-foreground">{{ doc.filename }}</div>
            <div class="text-sm font-bold text-foreground">{{ doc.title }}</div>
          </div>
          <ChevronRight class="w-4 h-4 text-muted-foreground group-hover:text-brand-amethyst-400 transition-transform" />
        </button>
      </div>

      <!-- Document Viewer (8 cols) -->
      <div class="lg:col-span-8 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div v-if="currentDoc" class="space-y-4">
          <div class="border-b border-border pb-4">
            <span class="text-xs font-mono text-brand-amethyst-400 font-semibold">{{ currentDoc.filename }}</span>
            <h2 class="text-xl font-extrabold text-foreground mt-1">{{ currentDoc.title }}</h2>
          </div>
          <pre class="font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed overflow-x-auto bg-secondary/40 p-4 rounded-xl border border-border shadow-inner">{{ currentDoc.content }}</pre>
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
