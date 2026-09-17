<template>
  <aside 
    class="bg-card border-r border-border flex flex-col justify-between transition-all duration-300 z-40"
    :class="[isCollapsed ? 'w-20' : 'w-64']"
  >
    <!-- Brand Header & Logo -->
    <div>
      <div class="p-5 flex items-center justify-between border-b border-border/80">
        <router-link 
          to="/" 
          @click="$emit('navigate')"
          class="flex items-center space-x-3 overflow-hidden group select-none"
        >
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-amethyst-500 via-purple-700 to-brand-gold-500 p-[1px] shadow-lg shadow-brand-amethyst-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
            <div class="w-full h-full bg-card rounded-xl flex items-center justify-center">
              <span class="text-lg">👑</span>
            </div>
          </div>
          <div v-if="!isCollapsed" class="overflow-hidden">
            <h1 class="font-bold text-sm text-foreground leading-tight truncate group-hover:text-brand-amethyst-500 transition-colors">
              Manhwa Studio
            </h1>
            <p class="text-[11px] text-brand-amethyst-600 dark:text-brand-amethyst-400 font-semibold tracking-wide">
              ShipByMike &bull; v1.0
            </p>
          </div>
        </router-link>
        
        <div class="flex items-center space-x-1">
          <button 
            @click="toggleCollapse"
            class="hidden lg:inline-flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
            :title="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
          >
            <ChevronLeft v-if="!isCollapsed" class="w-4 h-4" />
            <ChevronRight v-else class="w-4 h-4" />
          </button>
          <button 
            @click="$emit('navigate')"
            class="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
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
              ? 'bg-brand-amethyst-50 dark:bg-brand-amethyst-500/10 text-brand-amethyst-700 dark:text-brand-amethyst-400 font-semibold shadow-sm' 
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" :class="[isCollapsed ? 'mx-auto' : 'mr-3']" />
          <span v-if="!isCollapsed" class="truncate flex-1">{{ item.label }}</span>
          <span 
            v-if="!isCollapsed && item.badge" 
            class="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border tracking-wider uppercase"
          >
            {{ item.badge }}
          </span>
          
          <!-- Tooltip on collapsed mode -->
          <div 
            v-if="isCollapsed" 
            class="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center space-x-1"
          >
            <span>{{ item.label }}</span>
            <span v-if="item.badge" class="text-[9px] font-bold text-brand-amethyst-400">({{ item.badge }})</span>
          </div>
        </router-link>
      </nav>
    </div>

    <!-- Footer Venture Meta -->
    <div class="p-4 border-t border-border/80 text-xs">
      <div v-if="!isCollapsed" class="space-y-1">
        <p class="text-muted-foreground text-[11px] font-mono uppercase">Venture</p>
        <p class="font-semibold text-foreground truncate">Manhwa Recap Studio</p>
        <p class="text-[10px] text-brand-gold-600 dark:text-brand-gold-400 font-mono">👑 Shadow Monarch Theme Active</p>
      </div>
      <div v-else class="text-center text-muted-foreground text-xs font-mono">v1.0</div>
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
