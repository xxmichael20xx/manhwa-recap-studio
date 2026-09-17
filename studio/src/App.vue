<template>
  <div class="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
    <!-- Top Navigation Header -->
    <header class="border-b border-cyber-border/80 bg-[#0a0d14]/90 backdrop-blur sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo & Brand -->
        <div class="flex items-center space-x-3">
          <router-link to="/" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-purple-600 to-cyan-500 p-[1px] shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/40 transition-all">
              <div class="w-full h-full bg-[#0a0d14] rounded-xl flex items-center justify-center">
                <Layers class="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                MANHWA RECAP <span class="text-rose-500">STUDIO</span>
              </span>
              <div class="flex items-center space-x-2">
                <span class="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">Engine v1.0.0</span>
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-[10px] text-slate-400">Zero-Slop Active</span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center space-x-1">
          <router-link 
            to="/" 
            class="px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
            :class="$route.path === '/' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Dashboard</span>
          </router-link>

          <router-link 
            to="/engine" 
            class="px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
            :class="$route.path === '/engine' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
          >
            <BookOpen class="w-4 h-4" />
            <span>Anti-Slop Codex</span>
          </router-link>
        </nav>

        <!-- Right System Indicators -->
        <div class="flex items-center space-x-3">
          <div class="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyber-card border border-cyber-border text-xs font-mono text-slate-300">
            <ShieldCheck class="w-4 h-4 text-emerald-400" />
            <span>5 Pillars Locked</span>
          </div>
          <a 
            href="https://github.com/xxmichael20xx/manhwa-recap-studio" 
            target="_blank"
            class="p-2 rounded-lg bg-cyber-card border border-cyber-border hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="GitHub Repository"
          >
            <Github class="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>

    <!-- Main View Outlet -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="border-t border-cyber-border/40 py-4 bg-[#0a0d14]/60 text-center text-xs text-slate-500 font-mono">
      Manhwa Recap Studio — Universal Narrative Engineering Suite &bull; ShipByMike
    </footer>
  </div>
</template>

<script setup>
import { Layers, LayoutDashboard, BookOpen, ShieldCheck, Github } from 'lucide-vue-next'
</script>
