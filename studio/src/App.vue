<template>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- Collapsible Sidebar for Desktop (>= 1024px) -->
    <Sidebar class="hidden lg:flex shrink-0" />

    <!-- Mobile Slide-Over Navigation Drawer (< 1024px) -->
    <div 
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 z-50 lg:hidden flex"
    >
      <!-- Backdrop overlay -->
      <div 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
        @click="isMobileSidebarOpen = false"
      ></div>

      <!-- Slide-over Drawer Shell -->
      <div class="relative w-72 max-w-[85vw] bg-white dark:bg-[#0a0d14] h-full shadow-2xl flex flex-col z-10">
        <Sidebar @navigate="isMobileSidebarOpen = false" />
      </div>
    </div>

    <!-- Main Content Flow Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Sticky Dynamic Header synced with Vue Router & Theme Toggle -->
      <Header 
        :is-dark="isDark" 
        :environment="currentEnvironment"
        @update:environment="currentEnvironment = $event"
        @toggle-theme="toggleTheme" 
        @copy-dna="copyMasterDna" 
        @toggle-mobile-sidebar="isMobileSidebarOpen = !isMobileSidebarOpen"
      />

      <!-- Scrollable Main View Area (SPA Router Outlet) -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div class="max-w-7xl mx-auto">
          <router-view />
        </div>
      </main>

      <!-- Footer -->
      <footer class="border-t border-slate-200 dark:border-slate-800/80 py-3 px-6 bg-white/60 dark:bg-[#0a0d14]/60 text-center text-xs text-slate-500 font-mono flex items-center justify-between">
        <span>Manhwa Recap Studio &bull; Universal Narrative Engineering</span>
        <span class="text-rose-500 font-semibold">Port 3100 (API 3101)</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const isMobileSidebarOpen = ref(false)
const currentEnvironment = ref('live')
const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('manhwa-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('manhwa-theme', 'light')
  }
}

const copyMasterDna = () => {
  const masterAnchor = `Ethan Drake, 22-year-old male hunter, sharp angular jawline, jet-black messy undercut hair, piercing steel-grey eyes, high-collar charcoal tactical trench-coat over dark combat armour --cref [CHARACTER_URL] --cw 80 --ar 16:9 --style raw`
  navigator.clipboard.writeText(masterAnchor)
  alert('✨ Copied Ethan Drake Master Character DNA Prompt Anchor to Clipboard!')
}

onMounted(() => {
  const saved = localStorage.getItem('manhwa-theme')
  if (saved === 'light') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>
