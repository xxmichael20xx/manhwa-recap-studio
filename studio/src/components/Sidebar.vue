<template>
  <aside 
    class="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 z-40"
    :class="[isCollapsed ? 'w-20' : 'w-64']"
  >
    <!-- Brand Header & Logo -->
    <div>
      <div class="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <router-link 
          to="/" 
          @click="$emit('navigate')"
          class="flex items-center space-x-3 overflow-hidden group select-none"
        >
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-600/25 flex-shrink-0 text-xl group-hover:scale-105 transition-transform text-white">
            👑
          </div>
          <div v-if="!isCollapsed" class="overflow-hidden">
            <h1 class="font-bold text-sm text-slate-900 dark:text-white leading-tight truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Manhwa Studio
            </h1>
            <p class="text-[11px] text-purple-600 dark:text-purple-400 font-semibold tracking-wide">
              ShipByMike &bull; v1.0
            </p>
          </div>
        </router-link>
        
        <div class="flex items-center space-x-1">
          <button 
            @click="toggleCollapse"
            class="hidden lg:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            :title="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
          >
            <ChevronLeft v-if="!isCollapsed" class="w-4 h-4" />
            <ChevronRight v-else class="w-4 h-4" />
          </button>
          <button 
            @click="$emit('navigate')"
            class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Close Menu"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="p-3 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.id"
          :to="item.path"
          @click="$emit('navigate')"
          class="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative select-none"
          :class="[
            isItemActive(item) 
              ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-semibold shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" :class="[isCollapsed ? 'mx-auto' : 'mr-3', isItemActive(item) ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300']" />
          <span v-if="!isCollapsed" class="truncate flex-1">{{ item.label }}</span>
          <span 
            v-if="!isCollapsed && item.badge" 
            class="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md border tracking-wider uppercase"
            :class="isItemActive(item) ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-amber-400 border-purple-200 dark:border-purple-500/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'"
          >
            {{ item.badge }}
          </span>
          
          <!-- Tooltip on collapsed mode -->
          <div 
            v-if="isCollapsed" 
            class="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center space-x-1"
          >
            <span>{{ item.label }}</span>
            <span v-if="item.badge" class="text-[9px] font-bold text-purple-400">({{ item.badge }})</span>
          </div>
        </router-link>
      </nav>
    </div>

    <!-- Footer Venture Meta -->
    <div class="p-4 border-t border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-900/50">
      <div v-if="!isCollapsed" class="space-y-1">
        <p class="text-slate-400 dark:text-slate-500 text-[10px] font-mono uppercase">Venture</p>
        <p class="font-bold text-slate-900 dark:text-white truncate">Manhwa Recap Studio</p>
        <p class="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-semibold">👑 Sovereign Slate Theme Active</p>
      </div>
      <div v-else class="text-center text-slate-400 dark:text-slate-500 text-xs font-mono">v1.0</div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutDashboard, Film, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'

const route = useRoute()
defineEmits(['navigate'])

const isCollapsed = ref(false)
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    badge: 'Hub'
  },
  {
    id: 'franchises',
    label: 'Franchise Studio',
    path: '/franchises/Series_01_The_Sovereign_Protocol',
    icon: Film,
    badge: 'Series 01'
  },
  {
    id: 'engine',
    label: 'Anti-Slop Codex',
    path: '/engine',
    icon: BookOpen,
    badge: '5 Pillars'
  }
]

const isItemActive = (item) => {
  if (item.path === '/') return route.path === '/'
  return route.path.startsWith(item.path)
}
</script>
