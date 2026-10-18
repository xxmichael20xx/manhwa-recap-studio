<template>
  <div v-if="franchise" class="space-y-6">
    <!-- Toast Notification Overlay -->
    <transition
      enter-active-class="transform transition ease-out duration-200"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="toast.show" 
        class="fixed bottom-6 right-6 z-50 flex items-center space-x-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      >
        <div class="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
          <Check class="w-4 h-4" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white">{{ toast.title }}</h4>
          <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">{{ toast.message }}</p>
        </div>
        <button 
          @click="toast.show = false"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </transition>

    <!-- Header Back Navigation & Series Identity -->
    <div class="flex items-center justify-between">
      <router-link 
        to="/" 
        class="inline-flex items-center space-x-2 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Franchise Hub</span>
      </router-link>
      <div class="flex items-center space-x-2">
        <span class="text-xs font-mono px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 uppercase font-semibold">
          {{ franchise.folder }}
        </span>
        <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold flex items-center space-x-1">
          <span>🔒</span>
          <span>{{ franchise.format || (franchise.id?.includes('02') ? 'Format 2: 16:9 Landscape' : 'Format 1: 9:16 Webtoon') }}</span>
        </span>
      </div>
    </div>

    <!-- Franchise Overview Banner -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="space-y-2 max-w-3xl">
          <div class="flex items-center space-x-2 text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold uppercase">
            <Sparkles class="w-4 h-4" />
            <span>Franchise Command Center</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {{ franchise.name }}
          </h1>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Centralized hub for Character & Prop DNA vaults, multi-episode movie compilation, and YouTube packaging launchpads.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <!-- Quick Obtain Episode 1 Action (Direct Master MP4 Download) -->
          <a 
            v-if="episode1?.hasCompiledVideo"
            :href="`/api/episodes/${franchise.folder || $route.params.id}/${episode1.id}/video-stream?file=01_Episode_Master_1080p.mp4&download=1`"
            :download="`${franchise.folder}_${episode1.id}_Master_1080p.mp4`"
            class="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold font-mono flex items-center space-x-2 shadow-md shadow-purple-900/20 transition cursor-pointer hover:scale-[1.02] shrink-0"
            title="Download Episode 1 Master Video (1080p MP4)"
          >
            <Download class="w-4 h-4 text-purple-200" />
            <span>Download Episode 1 ({{ episode1.videoSizeFormatted || '1080p' }})</span>
          </a>

          <div class="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <span class="text-slate-500">Total Episodes:</span>
            <span class="font-bold text-purple-600 dark:text-purple-400">{{ franchise.episodes?.length || 0 }}</span>
            <span class="text-slate-300 dark:text-slate-700">•</span>
            <span class="text-slate-500">Vault Models:</span>
            <span class="font-bold text-amber-600 dark:text-amber-400">{{ models.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top-Level Franchise Navigation Tabs -->
    <div class="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
      <button 
        @click="activeTab = 'bible'"
        class="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer shrink-0"
        :class="activeTab === 'bible' 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'"
      >
        <BookOpen class="w-4 h-4" />
        <span>0. Series Bible &amp; Roadmap</span>
      </button>

      <button 
        @click="activeTab = 'episodes'"
        class="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer shrink-0"
        :class="activeTab === 'episodes' 
          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        <Layers class="w-4 h-4" />
        <span>1. Episodic Pipeline ({{ availableEpisodes.length }})</span>
      </button>

      <button 
        @click="activeTab = 'vault'"
        class="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer shrink-0"
        :class="activeTab === 'vault' 
          ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400'"
      >
        <Crown class="w-4 h-4" />
        <span>2. Character & Item Vault ({{ models.length }})</span>
      </button>

      <button 
        @click="activeTab = 'compiler'"
        class="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer shrink-0"
        :class="activeTab === 'compiler' 
          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        <Film class="w-4 h-4" />
        <span>3. Multi-Episode Master Compiler</span>
      </button>

      <button 
        @click="activeTab = 'youtube'"
        class="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer shrink-0"
        :class="activeTab === 'youtube' 
          ? 'bg-rose-600 text-white shadow-md shadow-rose-900/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400'"
      >
        <Youtube class="w-4 h-4" :class="activeTab === 'youtube' ? 'text-white' : 'text-rose-500'" />
        <span>4. YouTube Launchpad & Release Kit</span>
      </button>
    </div>

    <!-- TAB 0: SERIES BIBLE & NARRATIVE ACT ROADMAP -->
    <div v-if="activeTab === 'bible'" class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Series Bible &amp; Multi-Episode Act Roadmap</span>
            </h2>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
              Anti-Improvisation Gate
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Master franchise worldbuilding lore, progression arithmetic, character DNA anchors, and locked multi-episode narrative arcs.
          </p>
        </div>

        <div class="flex items-center space-x-2">
          <button 
            @click="copyToken(franchise?.bibleContent || '')"
            :disabled="!franchise?.bibleContent"
            class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-mono text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5 transition cursor-pointer shadow-xs hover:scale-[1.02] disabled:opacity-50"
            title="Copy entire Series Bible markdown"
          >
            <Copy class="w-3.5 h-3.5" />
            <span>Copy Full Bible Markdown</span>
          </button>
        </div>
      </div>

      <!-- If Bible exists -->
      <div v-if="franchise?.bibleContent" class="space-y-6">
        <!-- Quick Specs Banner -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
            <span class="text-[10px] font-mono uppercase text-slate-400 font-bold">Official Title</span>
            <div class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ franchise?.name }}</div>
          </div>
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
            <span class="text-[10px] font-mono uppercase text-slate-400 font-bold">Video Format</span>
            <div class="text-xs font-bold text-slate-900 dark:text-white">{{ franchise?.format || 'Format 1: 9:16 Webtoon' }}</div>
          </div>
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
            <span class="text-[10px] font-mono uppercase text-slate-400 font-bold">Lore Verification</span>
            <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <Check class="w-3.5 h-3.5" />
              <span>Series Bible Verified</span>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
            <span class="text-[10px] font-mono uppercase text-slate-400 font-bold">Master Path</span>
            <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate" title="00_Series_Bible_and_Character_DNA/Series_Bible.md">
              00_Series_Bible.../Series_Bible.md
            </div>
          </div>
        </div>

        <!-- Markdown Document Card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div class="flex items-center space-x-2">
              <FileText class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span class="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">Series_Bible.md (Master Ground Truth)</span>
            </div>
            <span class="text-[10px] font-mono text-slate-400">
              {{ (franchise.bibleContent.length / 1024).toFixed(1) }} KB • Markdown
            </span>
          </div>

          <pre class="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[680px] overflow-y-auto selection:bg-indigo-500 selection:text-white">{{ franchise.bibleContent }}</pre>
        </div>
      </div>

      <!-- Missing Bible Alert -->
      <div v-else class="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-8 text-center space-y-3">
        <div class="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <BookOpen class="w-6 h-6" />
        </div>
        <h3 class="text-sm font-bold text-amber-900 dark:text-amber-200">No Series Bible Found</h3>
        <p class="text-xs text-amber-700 dark:text-amber-300 max-w-md mx-auto leading-relaxed">
          This franchise requires a master <code class="font-mono font-bold">Series_Bible.md</code> inside <code class="font-mono">00_Series_Bible_and_Character_DNA/</code> before episodic scripts and acts can be drafted.
        </p>
      </div>
    </div>

    <!-- TAB 1: EPISODIC PRODUCTION PIPELINE -->
    <div v-if="activeTab === 'episodes'" class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Layers class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Episodic Production Pipeline</span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Individual episode workflows for script drafting, prompt matrix generation, voiceover sync, and 1080p video stitching.
          </p>
        </div>

        <button 
          @click="openSeriesClimaxModal"
          class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center space-x-2 shadow-md shadow-rose-900/20 transition cursor-pointer hover:scale-[1.02]"
        >
          <Zap class="w-4 h-4 text-amber-200" />
          <span>🔥 Generate Series Climax Short</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="ep in availableEpisodes" 
          :key="ep.id"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 hover:border-purple-500/50 dark:hover:border-purple-500/40 transition-all duration-200 shadow-sm hover:shadow-lg"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold uppercase">Tier 1: Episode (~20–45 Mins)</span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-1">{{ ep.name }}</h3>
              <p class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">{{ ep.id }}</p>
            </div>
            <div v-if="ep.audit" class="text-right shrink-0">
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                {{ ep.audit.overallScore }}% Anti-Slop
              </span>
              <p class="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">~{{ ep.audit.wordCount }} words ({{ ep.audit.estimatedMinutes }}m)</p>
            </div>
          </div>

          <!-- Master Video Ready Banner (Direct 1-Click Download) -->
          <div v-if="ep.hasCompiledVideo" class="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between gap-3">
            <div class="flex items-center space-x-2 text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold min-w-0 truncate">
              <Check class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span class="truncate">Master Video Ready ({{ ep.videoSizeFormatted || '1080p' }})</span>
            </div>
            <a 
              :href="`/api/episodes/${franchise.folder || $route.params.id}/${ep.id}/video-stream?file=01_Episode_Master_1080p.mp4&download=1`"
              :download="`${franchise.folder}_${ep.id}_Master_1080p.mp4`"
              class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono flex items-center space-x-1.5 shadow-sm transition cursor-pointer hover:scale-[1.02] shrink-0"
              :title="`Download ${ep.name} Master MP4`"
            >
              <Download class="w-3.5 h-3.5" />
              <span>Download Video</span>
            </a>
          </div>

          <!-- Pipeline Step Cards (4 Focused Tools) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <router-link 
              :to="`/editor/${franchise.folder}/${ep.id}`"
              class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-center space-y-1.5 transition-all group hover:scale-[1.02]"
            >
              <FileText class="w-4 h-4 mx-auto text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
              <div class="text-[11px] font-bold text-slate-900 dark:text-slate-100">1. Script Editor</div>
              <div class="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">4-Act Verified</div>
            </router-link>

            <router-link 
              :to="`/prompts/${franchise.folder}/${ep.id}`"
              class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-center space-y-1.5 transition-all group hover:scale-[1.02]"
            >
              <Sparkles class="w-4 h-4 mx-auto text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <div class="text-[11px] font-bold text-slate-900 dark:text-slate-100">2. Prompt Matrix</div>
              <div class="text-[9px] font-mono text-amber-600 dark:text-amber-400">312 Scenes</div>
            </router-link>

            <router-link 
              :to="`/tts/${franchise.folder}/${ep.id}`"
              class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-center space-y-1.5 transition-all group hover:scale-[1.02]"
            >
              <Mic class="w-4 h-4 mx-auto text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
              <div class="text-[11px] font-bold text-slate-900 dark:text-slate-100">3. Audio Studio</div>
              <div class="text-[9px] font-mono text-purple-600 dark:text-purple-400">Edge-TTS Sync</div>
            </router-link>

            <router-link 
              :to="`/video/${franchise.folder}/${ep.id}`"
              class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-center space-y-1.5 transition-all group hover:scale-[1.02]"
            >
              <Film class="w-4 h-4 mx-auto text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
              <div class="text-[11px] font-bold text-slate-900 dark:text-slate-100">4. Video Studio</div>
              <div class="text-[9px] font-mono text-purple-600 dark:text-purple-400">3-Stage Stitcher</div>
            </router-link>
          </div>

          <!-- Viral Climax Short Generator Button & Quick Download -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <Sparkles class="w-3.5 h-3.5 text-amber-500" />
              <span>Climax Hook:</span>
              <span class="font-mono text-slate-700 dark:text-slate-300 font-semibold">45-60s TikTok / Shorts</span>
            </div>
            <div class="flex items-center space-x-2">
              <a 
                v-if="ep.hasCompiledVideo"
                :href="`/api/episodes/${franchise.folder || $route.params.id}/${ep.id}/video-stream?file=01_Episode_Master_1080p.mp4&download=1`"
                :download="`${franchise.folder}_${ep.id}_Master_1080p.mp4`"
                class="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-600 hover:text-white border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold font-mono flex items-center space-x-1.5 transition cursor-pointer hover:scale-[1.02]"
                :title="`Obtain ${ep.id} Master MP4`"
              >
                <Download class="w-3.5 h-3.5" />
                <span>Obtain MP4</span>
              </a>
              <button 
                @click="openClimaxModal(ep)"
                class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-amber-900/20 transition cursor-pointer hover:scale-[1.02]"
              >
                <Zap class="w-3.5 h-3.5" />
                <span>⚡ Climax Short</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: CHARACTER & ITEM VAULT -->
    <div v-if="activeTab === 'vault'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Crown class="w-5 h-5 text-amber-500" />
              <span>Franchise Character, Weapon & Item Vault</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Locked Character DNA tokens, visual prompt anchors, and master reference plates matching Midjourney <code class="text-amber-500">--cref</code> & Google Flow standards.
            </p>
          </div>

          <!-- Filter Bar: Episode Filter & Category Filter Chips -->
          <div class="flex flex-wrap items-center justify-between gap-3 w-full pt-1">
            <!-- Episode Scope Filter -->
            <div class="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-mono">
              <button 
                @click="selectedEpisodeFilter = 'all'"
                class="px-2.5 py-1 rounded-lg transition font-medium cursor-pointer"
                :class="selectedEpisodeFilter === 'all' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                All Episodes ({{ models.length }})
              </button>
              <button 
                v-for="ep in availableEpisodes"
                :key="ep.id"
                @click="selectedEpisodeFilter = ep.id"
                class="px-2.5 py-1 rounded-lg transition font-medium cursor-pointer"
                :class="selectedEpisodeFilter === ep.id ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                {{ ep.id.slice(0, 4) }} ({{ getEpisodeModelCount(ep.id) }})
              </button>
            </div>

            <!-- Category Filter Chips -->
            <div class="flex items-center space-x-2 overflow-x-auto">
              <button 
                @click="vaultFilter = 'all'"
                class="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer"
                :class="vaultFilter === 'all' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
              >
                All Assets ({{ episodeScopedModels.length }})
              </button>
              <button 
                @click="vaultFilter = 'protagonist'"
                class="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer"
                :class="vaultFilter === 'protagonist' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
              >
                Protagonists
              </button>
              <button 
                @click="vaultFilter = 'antagonist'"
                class="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer"
                :class="vaultFilter === 'antagonist' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
              >
                Antagonists
              </button>
              <button 
                @click="vaultFilter = 'item'"
                class="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer"
                :class="vaultFilter === 'item' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
              >
                Weapons & Items
              </button>
            </div>
          </div>
          <!-- Google Flow Entity ID Mapper & Token Synchronizer Accordion -->
          <div class="rounded-xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 overflow-hidden">
            <button 
              @click="isEntityMapperAccordionOpen = !isEntityMapperAccordionOpen"
              class="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-purple-500/10 transition-colors select-none"
            >
              <div class="flex items-center space-x-2.5">
                <div class="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Hash class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>Google Flow Entity ID Mapper & Synchronizer</span>
                    <span 
                      class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border"
                      :class="entityCount > 0 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'"
                    >
                      {{ entityCount }} Entities Mapped
                    </span>
                  </h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">
                    Series-level UUID dictionary: maps names to Google Flow UUIDs to auto-replace <code>@{Name}</code> with <code>@UUID</code> across all episodes.
                  </p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <span class="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {{ isEntityMapperAccordionOpen ? 'Hide Mapper' : 'Open Mapper' }}
                </span>
                <ChevronDown class="w-4 h-4 text-purple-500 transition-transform duration-200" :class="{ 'rotate-180': isEntityMapperAccordionOpen }" />
              </div>
            </button>

            <!-- Collapsible Mapper Body -->
            <div v-if="isEntityMapperAccordionOpen" class="p-4 pt-1 border-t border-purple-500/20 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-[11px] font-mono text-slate-500">
                  Paste lines formatted as <code>Flow Name: UUID</code>. Click "Read & Sync" to persist across all episodes.
                </span>

                <!-- Active Output Format Toggle -->
                <div class="flex items-center space-x-1 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-700">
                  <span class="text-[10px] font-bold uppercase text-slate-500 px-1.5">Output:</span>
                  <button 
                    @click="togglePromptTagMode('token')"
                    class="px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center space-x-1"
                    :class="promptTagMode === 'token' 
                      ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
                  >
                    <span>🏷️ @{Token}</span>
                  </button>
                  <button 
                    @click="togglePromptTagMode('uuid')"
                    class="px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center space-x-1"
                    :class="promptTagMode === 'uuid' 
                      ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
                  >
                    <span>🔑 @UUID</span>
                    <span v-if="entityCount > 0" class="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-black">
                      {{ entityCount }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Textarea Input Area -->
              <textarea 
                v-model="entityMapRawText" 
                @paste="handleEntityMapPaste"
                rows="7"
                placeholder="Paste raw agent text, e.g.:&#10;I've pulled the absolute latest list of character entities for you. Here are all 16 UUIDs:&#10;&#10;Boss: Archon of Deletion: 030776ff-8016-4192-80ee-bcc02a6f1920 (Colossal automaton)&#10;Bramwell Locke: 16c4c742-5932-4c96-9c0c-c42aadbcb00a (Manhwa protagonist)&#10;Linnea Croft: 7cf4d027-6863-4e4b-8f93-f58ceb6f0b0b&#10;..."
                class="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 font-mono text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y shadow-xs"
              ></textarea>

              <!-- Action Buttons Bar -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div class="flex flex-wrap items-center gap-2">
                  <button 
                    @click="syncEntityMapping"
                    :disabled="isSavingEntityMap || !entityMapRawText.trim()"
                    class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-mono flex items-center space-x-2 transition shadow-md shadow-purple-950/20 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isSavingEntityMap }" />
                    <span>{{ isSavingEntityMap ? 'Synchronizing...' : `⚡ Parse & Sync Entity IDs (${entityCount} Mapped)` }}</span>
                  </button>

                  <button 
                    @click="copyFlowAgentPrompt"
                    class="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 transition cursor-pointer"
                    title="Copy pre-formatted prompt to ask Google Flow chat agent for entity IDs"
                  >
                    <Sparkles class="w-3.5 h-3.5 text-purple-500" />
                    <span>📋 Copy Flow Agent Prompt</span>
                  </button>

                  <button 
                    v-if="entityMapRawText.trim()"
                    @click="prettifyEntityMapping"
                    class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                    title="Separate concatenated entities into clean lines"
                  >
                    <Sparkles class="w-3.5 h-3.5 text-indigo-500" />
                    <span>✨ Prettify Text</span>
                  </button>

                  <button 
                    v-if="entityCount > 0"
                    @click="copyCurrentEntityMapping"
                    class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Copy class="w-3.5 h-3.5" />
                    <span>Copy Mapping Text</span>
                  </button>
                </div>

                <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Active mode: <strong class="text-purple-600 dark:text-purple-400">{{ promptTagMode === 'uuid' ? '@UUID replacement' : '@{Name} tokens' }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Character & Item Cards Grid (Matches Uploaded Screenshot Design) -->
        <div class="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4 pt-2">
          <div 
            v-for="model in filteredModels" 
            :key="model.id"
            class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 shadow-sm space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition"
          >
            <div class="space-y-2.5">
              <!-- Header: Name & Role Badge with UUID Status -->
              <div class="flex items-start justify-between gap-1">
                <div class="min-w-0 flex-1">
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate" :title="model.name">{{ model.name }}</h4>
                  <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span 
                      class="text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold inline-block border"
                      :class="getCategoryBadgeClass(model.category)"
                    >
                      {{ model.category }} • {{ model.tier }}
                    </span>
                    <span 
                      class="text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold border"
                      :class="getModelUuid(model) 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'"
                      :title="getModelUuid(model) ? `Mapped to UUID: ${getModelUuid(model)}` : 'No UUID mapped yet. Paste mapping in textarea above.'"
                    >
                      {{ getModelUuid(model) ? 'Mapped' : 'Pending' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Model Thumbnail Preview (16:9) with Hover Zoom -->
              <div class="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative group">
                <img 
                  v-if="model.hasPlate"
                  :src="model.url" 
                  :alt="model.name" 
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-1">
                  <Crown class="w-6 h-6 opacity-40" />
                  <span class="text-[9px] font-mono">Plate Pending</span>
                </div>

                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <a 
                    :href="model.url" 
                    target="_blank" 
                    class="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white backdrop-blur-xs transition"
                    title="View Full Resolution"
                  >
                    <ExternalLink class="w-3.5 h-3.5" />
                  </a>
                  <button 
                    @click="downloadVaultPlate(model)"
                    class="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white backdrop-blur-xs transition cursor-pointer"
                    title="Download Image"
                  >
                    <Download class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Google Flow Setup Name Bar (1-Click Paste for Google Flow Reference Setup) -->
              <div 
                @click="copyVaultName(model)"
                class="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-purple-500/50 hover:bg-purple-50/20 dark:hover:bg-purple-950/20 transition group"
                title="Click to copy clean Reference Name (WITHOUT @{}) to paste directly into Google Flow character/object setup"
              >
                <div class="flex items-center space-x-1.5 min-w-0 flex-1">
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold shrink-0">
                    Flow Name
                  </span>
                  <span class="text-[10px] font-mono text-slate-700 dark:text-slate-300 truncate font-semibold">
                    {{ model.flowName || model.name }}
                  </span>
                </div>
                <span 
                  class="text-[9px] font-mono shrink-0 ml-1 font-bold"
                  :class="copiedVaultId === model.id && copiedVaultType === 'name' ? 'text-emerald-500' : 'text-purple-600 dark:text-purple-400 group-hover:underline'"
                >
                  {{ copiedVaultId === model.id && copiedVaultType === 'name' ? 'Copied' : 'Copy Name' }}
                </span>
              </div>

              <!-- Description -->
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2" :title="model.description">
                {{ model.description }}
              </p>
            </div>

            <!-- 4-Button Toolbar (Plate, Name, Token, DNA) -->
            <div class="grid grid-cols-4 gap-1.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80">
              <button 
                @click="downloadVaultPlate(model)"
                class="py-1.5 px-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-mono font-semibold flex items-center justify-center space-x-1 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                title="Download Master Reference Plate"
              >
                <Download class="w-3 h-3 shrink-0 text-slate-500 dark:text-slate-400" />
                <span class="truncate">Plate</span>
              </button>

              <button 
                @click="copyVaultName(model)"
                class="py-1.5 px-1 rounded-lg transition cursor-pointer text-[10px] font-mono font-semibold flex items-center justify-center space-x-1"
                :class="copiedVaultId === model.id && copiedVaultType === 'name' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'"
                title="Copy Clean Reference Name WITHOUT @{} (for Google Flow Setup)"
              >
                <Check v-if="copiedVaultId === model.id && copiedVaultType === 'name'" class="w-3 h-3 shrink-0" />
                <Tag v-else class="w-3 h-3 shrink-0 text-slate-500" />
                <span class="truncate">{{ copiedVaultId === model.id && copiedVaultType === 'name' ? 'Copied' : 'Name' }}</span>
              </button>

              <button 
                @click="copyVaultToken(model)"
                class="py-1.5 px-1 rounded-lg transition cursor-pointer text-[10px] font-mono font-semibold flex items-center justify-center space-x-1"
                :class="copiedVaultId === model.id && copiedVaultType === 'token' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400'"
                title="Copy Google Flow Token (@{...})"
              >
                <Check v-if="copiedVaultId === model.id && copiedVaultType === 'token'" class="w-3 h-3 shrink-0" />
                <Copy v-else class="w-3 h-3 shrink-0" />
                <span class="truncate">{{ copiedVaultId === model.id && copiedVaultType === 'token' ? 'Copied' : 'Token' }}</span>
              </button>

              <button 
                @click="copyVaultDna(model)"
                class="py-1.5 px-1 rounded-lg transition cursor-pointer text-[10px] font-mono font-semibold flex items-center justify-center space-x-1"
                :class="copiedVaultId === model.id && copiedVaultType === 'dna' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'"
                title="Copy Visual DNA Prompt Anchor"
              >
                <Check v-if="copiedVaultId === model.id && copiedVaultType === 'dna'" class="w-3 h-3 shrink-0" />
                <Sparkles v-else class="w-3 h-3 shrink-0" />
                <span class="truncate">{{ copiedVaultId === model.id && copiedVaultType === 'dna' ? 'Copied' : 'DNA' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: MULTI-EPISODE MASTER COMPILER -->
    <div v-if="activeTab === 'compiler'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div class="space-y-1">
          <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Film class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Multi-Episode Master Compiler (Arc Features & Season Movies)</span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Concatenate multiple completed episode master MP4s into standalone 45–60 minute Arc Features or 2-hour Season Movies with automatic chapter markers.
          </p>
        </div>

        <!-- Format Tier Selection -->
        <div class="space-y-3">
          <label class="text-xs font-mono uppercase text-slate-400 font-bold">Select Compilation Format Tier</label>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            <div 
              @click="selectedTier = 'tier2'"
              class="p-4 rounded-xl border cursor-pointer transition-all space-y-1.5"
              :class="selectedTier === 'tier2' 
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200' 
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold font-mono uppercase">Tier 2: Arc Feature / Saga</span>
                <Check v-if="selectedTier === 'tier2'" class="w-4 h-4 text-purple-600" />
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Typical Runtime: 45–60 Minutes (~6,500–8,500 words). Merges 2–3 episodes.</p>
            </div>

            <div 
              @click="selectedTier = 'tier3'"
              class="p-4 rounded-xl border cursor-pointer transition-all space-y-1.5"
              :class="selectedTier === 'tier3' 
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200' 
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold font-mono uppercase">Tier 3: Season Movie</span>
                <Check v-if="selectedTier === 'tier3'" class="w-4 h-4 text-purple-600" />
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Typical Runtime: 1.5–2.5 Hours (~12,000–20,000 words). Merges 3–5 episodes.</p>
            </div>

            <div 
              @click="selectedTier = 'tier4'"
              class="p-4 rounded-xl border cursor-pointer transition-all space-y-1.5"
              :class="selectedTier === 'tier4' 
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200' 
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold font-mono uppercase">Tier 4: Grand Omnibus</span>
                <Check v-if="selectedTier === 'tier4'" class="w-4 h-4 text-purple-600" />
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Typical Runtime: 3.0+ Hours (~25,000+ words). Multi-season binge cut.</p>
            </div>
          </div>
        </div>

        <!-- Episode Selection Ledger -->
        <div class="space-y-3">
          <label class="text-xs font-mono uppercase text-slate-400 font-bold">Select Episodes to Concatenate</label>
          <div class="space-y-2">
            <div 
              v-for="ep in availableEpisodes" 
              :key="ep.id"
              class="p-4 rounded-xl border flex items-center justify-between transition-all"
              :class="ep.hasCompiledVideo 
                ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800' 
                : 'bg-slate-50/50 dark:bg-slate-950/30 border-dashed border-slate-200 dark:border-slate-800 opacity-60'"
            >
              <div class="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  :id="ep.id" 
                  v-model="selectedEpisodes" 
                  :value="ep.id"
                  :disabled="!ep.hasCompiledVideo"
                  class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                />
                <label :for="ep.id" :class="ep.hasCompiledVideo ? 'cursor-pointer' : 'cursor-not-allowed'">
                  <div class="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>{{ ep.name }}</span>
                    <span v-if="!ep.hasCompiledVideo" class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                      No Master Video
                    </span>
                  </div>
                  <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400">{{ ep.id }}</div>
                </label>
              </div>

              <div class="flex items-center space-x-2">
                <span v-if="ep.hasCompiledVideo" class="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold flex items-center space-x-1">
                  <Check class="w-3.5 h-3.5" />
                  <span>Master Video Ready ({{ ep.videoSizeFormatted || '1080p' }})</span>
                </span>
                <a 
                  v-if="ep.hasCompiledVideo"
                  :href="`/api/episodes/${franchise.folder || $route.params.id}/${ep.id}/video-stream?file=01_Episode_Master_1080p.mp4&download=1`"
                  :download="`${franchise.folder}_${ep.id}_Master_1080p.mp4`"
                  class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-xs font-mono text-purple-600 dark:text-purple-400 flex items-center space-x-1 transition shadow-xs cursor-pointer hover:scale-[1.02]"
                  :title="`Download ${ep.name} Master MP4`"
                >
                  <Download class="w-3 h-3" />
                  <span>Download</span>
                </a>
                <span v-else class="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold flex items-center space-x-1">
                  <span>⏳ Compilation Pending</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Render Controls -->
        <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div class="text-xs font-mono text-slate-500">
            Selected: <span class="text-purple-600 dark:text-purple-400 font-bold">{{ selectedEpisodes.length }}</span> episode(s)
          </div>
          <button 
            @click="triggerOmnibusCompile"
            :disabled="selectedEpisodes.length === 0 || isCompilingOmnibus"
            class="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold font-mono flex items-center space-x-2 transition cursor-pointer shadow-lg shadow-purple-900/20"
          >
            <Loader2 v-if="isCompilingOmnibus" class="w-4 h-4 animate-spin" />
            <Film v-else class="w-4 h-4" />
            <span>{{ isCompilingOmnibus ? 'Stitching Master Movie...' : 'Stitch Master Multi-Episode Movie' }}</span>
          </button>
        </div>

        <!-- Compiled Master Omnibus Movies List -->
        <div v-if="omnibusFiles.length > 0" class="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-2">
              <Film class="w-3.5 h-3.5 text-purple-600" />
              <span>Compiled Master Movie &amp; Omnibus Files</span>
            </h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
              {{ omnibusFiles.length }} Video(s) Ready
            </span>
          </div>

          <div class="space-y-2">
            <div 
              v-for="file in omnibusFiles" 
              :key="file.filename"
              class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/40 transition"
            >
              <div class="space-y-1 min-w-0">
                <div class="text-xs font-bold font-mono text-slate-900 dark:text-white truncate">
                  🎬 {{ file.filename }}
                </div>
                <div class="text-[11px] font-mono text-slate-500 flex items-center space-x-3">
                  <span>Size: {{ file.sizeFormatted }}</span>
                  <span>•</span>
                  <span>Lossless 1080p Concat</span>
                </div>
              </div>

              <div class="flex items-center space-x-2 shrink-0">
                <a 
                  :href="file.url + '&download=1'"
                  :download="file.filename"
                  class="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-xs font-mono text-purple-600 dark:text-purple-400 flex items-center space-x-1.5 transition"
                >
                  <Download class="w-3.5 h-3.5" />
                  <span>Download MP4</span>
                </a>
                <button 
                  @click="deleteOmnibusFile(file.filename)"
                  class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-mono text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center space-x-1.5 transition cursor-pointer"
                  title="Delete compiled master video"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: YOUTUBE LAUNCHPAD & PACKAGING HUB -->
    <div v-if="activeTab === 'youtube'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Youtube class="w-5 h-5 text-rose-500" />
              <span>YouTube Launchpad & Packaging Hub</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              5 High-CTR Title Archetypes (&le;100 chars), Pure-Image 3-Variant Thumbnails (<2MB MozJPEG compliant), SEO descriptions, and pinned comments.
            </p>
          </div>

          <!-- Episode / Master Omnibus Selector Dropdown & Quick Download -->
          <div class="flex items-center space-x-3 flex-wrap gap-y-2">
            <div class="flex items-center space-x-2">
              <label class="text-xs font-mono text-slate-400 font-semibold">Select Release Target:</label>
              <select 
                v-model="selectedPackageEpisode" 
                @change="loadPackagingData"
                class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white cursor-pointer"
              >
                <optgroup label="Compiled Master Releases">
                  <option value="omnibus_master" :disabled="compiledEpisodes.length < 2">
                    🎬 Master Omnibus Movie (Parts 1 - {{ compiledEpisodes.length }} Compiled)
                  </option>
                  <option value="omnibus_complete" :disabled="compiledEpisodes.length === 0">
                    🏆 Complete Story Marathon (Full Series Complete)
                  </option>
                </optgroup>
                <optgroup label="Individual Episode Releases">
                  <option v-for="ep in availableEpisodes" :key="ep.id" :value="ep.id">
                    {{ ep.name }}
                  </option>
                </optgroup>
              </select>
            </div>

            <a 
              v-if="currentSelectedEpisodeVideoDownloadUrl"
              :href="currentSelectedEpisodeVideoDownloadUrl"
              :download="currentSelectedEpisodeVideoFilename"
              class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold font-mono flex items-center space-x-1.5 shadow-sm shadow-purple-900/20 transition cursor-pointer hover:scale-[1.02]"
              :title="`Download ${currentSelectedEpisode?.name || selectedPackageEpisode} Master Video`"
            >
              <Download class="w-3.5 h-3.5" />
              <span>Download Video ({{ currentSelectedEpisodeVideoSize }})</span>
            </a>
          </div>
        </div>

        <!-- 1. The 3 High-CTR Master Thumbnails Showcase -->
        <div class="space-y-4 pt-2">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles class="w-4 h-4 text-amber-500" />
              <span>The 3 High-CTR Visual Thumbnail Showcase (Zero-Tag Pure Storytelling)</span>
            </h3>
            <span class="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% YouTube Compliant (<2MB MozJPEG)</span>
          </div>

          <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            <div 
              v-for="(variant, idx) in (pkgData?.thumbnailVariants || [])" 
              :key="variant.id || idx"
              class="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 transition-all relative"
              :class="variant.id === 'concept_a' ? 'hover:border-purple-500/40' : variant.id === 'concept_b' ? 'hover:border-amber-500/40' : 'hover:border-rose-500/40'"
            >
              <div class="aspect-video w-full rounded-xl bg-slate-900 overflow-hidden relative border border-slate-200 dark:border-slate-800">
                <img 
                  :src="variant.url || `/api/episodes/${franchise.folder}/${selectedPackageEpisode}/thumbnails/${variant.filename}`" 
                  :alt="variant.name"
                  class="w-full h-full object-cover"
                  @error="onThumbError"
                />

                <!-- Dynamic High-CTR Yellow Badge Live Preview Overlay (Top-Left) -->
                <div 
                  v-if="activeThumbnailBadge" 
                  class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-yellow-400 text-slate-950 font-black text-xs font-mono tracking-wider shadow-xl border border-yellow-200 shadow-yellow-500/40 flex items-center space-x-1 z-10 select-none pointer-events-none"
                >
                  <span>⚡ {{ activeThumbnailBadge }}</span>
                </div>

                <!-- Concept Category Badge (Top-Right) -->
                <span 
                  class="absolute top-2.5 right-2.5 text-[9px] font-mono px-2 py-0.5 rounded text-white font-bold uppercase shadow-sm z-10"
                  :class="variant.id === 'concept_a' ? 'bg-purple-600/90' : variant.id === 'concept_b' ? 'bg-amber-600/90' : 'bg-rose-600/90'"
                >
                  {{ variant.id === 'concept_a' ? 'Concept A' : variant.id === 'concept_b' ? 'Concept B' : 'Concept C' }}
                </span>

                <span v-if="variant.hasImage" class="absolute bottom-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-emerald-400 font-bold border border-emerald-500/30 z-10">
                  {{ variant.fileSizeFormatted }} MozJPEG
                </span>
              </div>

              <div class="space-y-1">
                <h4 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{{ variant.name }}</h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{{ variant.composition || variant.subtitle }}</p>
              </div>

              <!-- Action Controls: Split Download Dropdown & Prompt Button -->
              <div class="pt-1 flex items-center space-x-2 relative">
                <!-- Split Download Dropdown -->
                <div class="flex-1 flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative">
                  <button 
                    @click="downloadDynamicThumbnail(variant, activeThumbnailBadge)"
                    :disabled="isDownloadingThumb"
                    class="flex-1 py-1.5 px-2 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center space-x-1.5 transition cursor-pointer truncate"
                    :title="`Download thumbnail with ${activeThumbnailBadge ? activeThumbnailBadge + ' badge' : 'clean artwork'}`"
                  >
                    <Loader2 v-if="isDownloadingThumb" class="w-3 h-3 animate-spin text-purple-600 shrink-0" />
                    <Download v-else class="w-3 h-3 shrink-0" />
                    <span class="truncate font-semibold">
                      {{ activeThumbnailBadge ? `Download (${activeThumbnailBadge})` : 'Download Clean' }}
                    </span>
                  </button>
                  <button 
                    @click.stop="toggleDownloadMenu(variant.id)"
                    class="px-2 py-1.5 border-l border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-purple-600 flex items-center justify-center cursor-pointer transition shrink-0"
                    title="Choose badge version"
                  >
                    <ChevronDown class="w-3 h-3 transition-transform" :class="activeDropdownCard === variant.id ? 'rotate-180' : ''" />
                  </button>

                  <!-- Badge Selection Dropdown Menu -->
                  <div 
                    v-if="activeDropdownCard === variant.id" 
                    class="absolute bottom-full left-0 mb-1.5 w-60 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-30 space-y-0.5"
                  >
                    <div class="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>Select Badge Version</span>
                      <span class="text-purple-600 font-bold">Dynamic Canvas</span>
                    </div>
                    <button
                      v-for="opt in dynamicBadgeOptions"
                      :key="opt.id"
                      @click.stop="selectBadgeAndDownload(variant, opt.badgeText)"
                      class="w-full text-left px-3 py-2 text-xs font-mono flex items-center justify-between hover:bg-purple-50 dark:hover:bg-purple-950/60 transition cursor-pointer"
                      :class="activeThumbnailBadge === opt.badgeText ? 'text-purple-600 dark:text-purple-400 font-bold bg-purple-50/50 dark:bg-purple-950/30' : 'text-slate-700 dark:text-slate-300'"
                    >
                      <span>{{ opt.label }}</span>
                      <Check v-if="activeThumbnailBadge === opt.badgeText" class="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    </button>
                  </div>
                </div>

                <!-- Prompt Copy Button -->
                <button 
                  @click="copyToken(variant.prompt)"
                  class="py-1.5 px-2.5 rounded-lg text-white text-[11px] font-mono flex items-center justify-center space-x-1 cursor-pointer transition shrink-0"
                  :class="variant.id === 'concept_a' ? 'bg-purple-600 hover:bg-purple-700' : variant.id === 'concept_b' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'"
                  title="Copy illustration prompt"
                >
                  <Copy class="w-3 h-3" />
                  <span>Prompt</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. The 10 High-CTR Title Archetypes -->
        <div class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText class="w-4 h-4 text-purple-600" />
              <span>Unified Franchise Titles &amp; Format Variants (&le; 100 Characters)</span>
            </h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              {{ (pkgData?.titles || defaultTitles).length }} Formats Ready
            </span>
          </div>

          <div class="space-y-2.5">
            <div 
              v-for="(item, idx) in pkgData?.titles || defaultTitles" 
              :key="idx"
              class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/40 transition-all group"
            >
              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                    {{ typeof item === 'object' && item.archetype ? item.archetype : `Archetype ${idx + 1}` }}
                  </span>
                  <span v-if="typeof item === 'object' && item.ctrScore" class="text-[10px] font-mono text-amber-500 font-bold">
                    🔥 {{ item.ctrScore }} CTR
                  </span>
                  <span class="text-[10px] font-mono text-slate-400">
                    • {{ (typeof item === 'string' ? item : item.title).length }} / 100 Chars
                  </span>
                </div>
                <div class="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {{ typeof item === 'string' ? item : item.title }}
                </div>
              </div>
              <button 
                @click="copyToken(typeof item === 'string' ? item : item.title)"
                class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 text-xs font-mono text-purple-600 dark:text-purple-400 flex items-center justify-center space-x-1 cursor-pointer shrink-0 transition"
              >
                <Copy class="w-3.5 h-3.5" />
                <span>Copy Title</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 3. Description & SEO Timestamps -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-mono uppercase text-slate-400 font-bold">SEO Description & Chapter Timestamps</label>
              <button 
                @click="copyToken(pkgData?.description || '')"
                class="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Copy class="w-3 h-3" />
                <span>Copy Description</span>
              </button>
            </div>
            <textarea 
              readonly 
              :value="pkgData?.description || 'Loading SEO description...'"
              rows="8"
              class="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-700 dark:text-slate-300 resize-none"
            ></textarea>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-mono uppercase text-slate-400 font-bold">Pinned High-Retention Comment</label>
              <button 
                @click="copyToken(pkgData?.pinnedComment || '')"
                class="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Copy class="w-3 h-3" />
                <span>Copy Comment</span>
              </button>
            </div>
            <textarea 
              readonly 
              :value="pkgData?.pinnedComment || 'Loading pinned comment...'"
              rows="8"
              class="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-700 dark:text-slate-300 resize-none"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: TIKTOK / SHORTS VIRAL CLIMAX GENERATOR -->
    <div 
      v-if="isClimaxModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      @click.self="closeClimaxModal"
    >
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div class="flex items-center space-x-3">
            <div class="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/20">
              <Zap class="w-5 h-5 fill-current" />
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">TikTok & Shorts Viral Climax Hook</h3>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold uppercase">
                  Viral Acquisition Funnel
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {{ selectedClimaxEpisode?.name || 'Episode' }} ({{ selectedClimaxEpisode?.id }}) • Slices the 45–60s peak face-slap climax to hook viewers into YouTube.
              </p>
            </div>
          </div>
          <button 
            @click="closeClimaxModal"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div v-if="isLoadingClimaxData" class="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 class="w-8 h-8 text-amber-500 animate-spin" />
            <p class="text-xs font-mono text-slate-400">Loading Climax Short metadata & video...</p>
          </div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Left Col (5 cols): Video Preview & Compiling Controls -->
            <div class="lg:col-span-5 space-y-4">
              <div class="bg-slate-950 rounded-2xl p-3 border border-slate-800 flex flex-col items-center justify-center shadow-inner relative overflow-hidden min-h-[420px]">
                <!-- Video Element when compiled -->
                <video 
                  v-if="climaxData?.meta?.url" 
                  controls 
                  playsinline 
                  class="w-full max-w-[240px] aspect-[9/16] rounded-xl shadow-2xl object-cover bg-black border border-slate-800"
                  :src="climaxData.meta.url"
                ></video>

                <!-- Empty State when not compiled -->
                <div v-else class="flex flex-col items-center justify-center text-center p-6 space-y-3 max-w-[240px]">
                  <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Zap class="w-8 h-8" />
                  </div>
                  <h4 class="text-sm font-bold text-white">No Climax Short Yet</h4>
                  <p class="text-xs text-slate-400 leading-relaxed">
                    Slices the peak narrative face-slap from the master video, crops to vertical 9:16, and attaches a 3s animated YouTube CTA outro.
                  </p>
                </div>

                <!-- Overlay Spinner when generating -->
                <div 
                  v-if="isGeneratingShort" 
                  class="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-3 z-10"
                >
                  <Loader2 class="w-8 h-8 text-amber-400 animate-spin" />
                  <p class="text-xs font-mono text-amber-200 font-semibold text-center">Slicing Climax & Attaching Outro...</p>
                  <span class="text-[10px] font-mono text-slate-400">FFmpeg 1080x1920 single-pass render</span>
                </div>
              </div>

              <!-- Compile Action Buttons -->
              <div class="space-y-2">
                <button 
                  @click="generateClimaxShort(selectedClimaxEpisode?.id)"
                  :disabled="isGeneratingShort"
                  class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-rose-900/20 transition cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                >
                  <Loader2 v-if="isGeneratingShort" class="w-4 h-4 animate-spin" />
                  <Zap v-else class="w-4 h-4 text-amber-200" />
                  <span>{{ climaxData?.meta?.url ? '⚡ Re-Generate Climax Short' : '⚡ Generate 60s Climax Short Now' }}</span>
                </button>

                <a 
                  v-if="climaxData?.meta?.url"
                  :href="`${climaxData.meta.url}?download=1`"
                  download="TikTok_Climax_Hook.mp4"
                  class="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Download class="w-4 h-4 text-emerald-500" />
                  <span>Download TikTok Video ({{ climaxData?.meta?.filesizeFormatted || '1080p MP4' }})</span>
                </a>
              </div>

              <!-- Metadata Specs Pill Grid -->
              <div v-if="climaxData?.meta" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-slate-400 font-mono text-[11px]">Runtime:</span>
                  <span class="font-bold text-slate-900 dark:text-white font-mono">{{ climaxData.meta.formattedDuration }} (inc. 3s CTA outro)</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400 font-mono text-[11px]">Timeline Slice:</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{{ climaxData.meta.timecode }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400 font-mono text-[11px]">Climax Tags:</span>
                  <span class="font-bold text-amber-600 dark:text-amber-400 font-mono">[{{ climaxData.meta.startTag }} → {{ climaxData.meta.endTag }}]</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400 font-mono text-[11px]">Target Platforms:</span>
                  <span class="font-bold text-purple-600 dark:text-purple-400">TikTok • YT Shorts • IG Reels</span>
                </div>
              </div>
            </div>

            <!-- Right Col (7 cols): Viral Copywriting, Hook Titles & Bio Funnel Hub -->
            <div class="lg:col-span-7 space-y-5">
              <!-- Section 1: 4 High-CTR Viral Hook Titles -->
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <Sparkles class="w-4 h-4 text-amber-500" />
                    <h4 class="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      High-CTR Viral Hook Titles (A/B Test)
                    </h4>
                  </div>
                  <span class="text-[10px] font-mono text-slate-400">Click title to copy</span>
                </div>

                <div class="space-y-2">
                  <div 
                    v-for="(hook, idx) in (climaxData?.package?.viralHooks || defaultClimaxHooks)" 
                    :key="idx"
                    class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition group flex items-start justify-between gap-3"
                  >
                    <div class="space-y-1 min-w-0">
                      <div class="flex items-center space-x-2">
                        <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          {{ hook.hookType || 'Hook' }}
                        </span>
                        <span v-if="hook.ctrScore" class="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {{ hook.ctrScore }} CTR
                        </span>
                      </div>
                      <p class="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                        {{ hook.title }}
                      </p>
                    </div>

                    <button 
                      @click="copyClimaxText(`title_${idx}`, hook.title)"
                      class="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 text-xs font-mono shrink-0 flex items-center space-x-1 transition cursor-pointer shadow-sm"
                    >
                      <Check v-if="copiedClimaxField === `title_${idx}`" class="w-3.5 h-3.5 text-emerald-500" />
                      <Copy v-else class="w-3.5 h-3.5" />
                      <span>{{ copiedClimaxField === `title_${idx}` ? 'Copied' : 'Copy' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Section 2: TikTok / Shorts Caption & SEO Hashtags -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
                    <Hash class="w-3.5 h-3.5 text-rose-500" />
                    <span>TikTok / Shorts Caption & Hashtag Pack</span>
                  </label>
                  <button 
                    @click="copyClimaxText('caption', climaxData?.package?.caption || '')"
                    class="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Check v-if="copiedClimaxField === 'caption'" class="w-3 h-3 text-emerald-500" />
                    <Copy v-else class="w-3 h-3" />
                    <span>{{ copiedClimaxField === 'caption' ? 'Copied Caption' : 'Copy Caption' }}</span>
                  </button>
                </div>
                <textarea 
                  readonly 
                  :value="climaxData?.package?.caption || 'Loading TikTok caption...'"
                  rows="5"
                  class="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
                ></textarea>
              </div>

              <!-- Section 3: High-Conversion Pinned Bio Comment -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
                    <Youtube class="w-3.5 h-3.5 text-rose-500" />
                    <span>Pinned Bio-Funnel Comment</span>
                  </label>
                  <button 
                    @click="copyClimaxText('pinnedComment', climaxData?.package?.pinnedComment || '')"
                    class="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Check v-if="copiedClimaxField === 'pinnedComment'" class="w-3 h-3 text-emerald-500" />
                    <Copy v-else class="w-3 h-3" />
                    <span>{{ copiedClimaxField === 'pinnedComment' ? 'Copied Comment' : 'Copy Comment' }}</span>
                  </button>
                </div>
                <textarea 
                  readonly 
                  :value="climaxData?.package?.pinnedComment || 'Loading pinned comment...'"
                  rows="3"
                  class="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div class="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Zero-drift 45-60s slice • Lossless AAC Audio • 3s animated search CTA</span>
          </div>
          <button 
            @click="closeClimaxModal"
            class="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, Layers, FileText, Sparkles, Mic, Film, 
  Crown, Youtube, Copy, Download, Check, Loader2, X, Trash2,
  Tag, ExternalLink, RefreshCw, Hash, ChevronDown, Zap, BookOpen
} from 'lucide-vue-next'
import {
  parseEntityMappingText,
  normalizeEntityMappingText,
  saveEntityMapToStorage,
  loadEntityMapFromStorage,
  getTagModeFromStorage,
  setTagModeToStorage
} from '../utils/entityMapper.js'

const route = useRoute()
const franchise = ref(null)
const activeTab = ref(route.query.tab || 'episodes')
const vaultFilter = ref('all')
const models = ref([])
const selectedTier = ref('tier2')
const selectedEpisodes = ref([])
const isCompilingOmnibus = ref(false)
const selectedPackageEpisode = ref('')
const pkgData = ref(null)
const omnibusFiles = ref([])

// Dynamic Thumbnail Badge Engine (Client-Side Canvas Compositing)
const activeThumbnailBadge = ref('1 - 2')
const activeDropdownCard = ref(null)
const isDownloadingThumb = ref(false)

const dynamicBadgeOptions = computed(() => {
  const options = [
    { id: 'clean', label: '🌟 Clean (No Badge / Textless)', badgeText: '' },
    { id: 'complete', label: '🏆 Complete (Full Story Marathon)', badgeText: 'COMPLETE' },
    { id: 'ep_1', label: '🟡 Episode 1 (Single Episode)', badgeText: 'EP 1' }
  ]
  const count = Math.max(2, availableEpisodes.value.length)
  for (let i = 2; i <= count; i++) {
    options.push({
      id: `ep_1_${i}`,
      label: `🟡 Episodes 1 - ${i} (${i === 2 ? 'Omnibus Movie' : `Episodes 1-${i}`})`,
      badgeText: `1 - ${i}`
    })
  }
  return options
})

const toggleDownloadMenu = (cardId) => {
  activeDropdownCard.value = activeDropdownCard.value === cardId ? null : cardId
}

const selectBadgeAndDownload = (variant, badgeText) => {
  activeThumbnailBadge.value = badgeText
  activeDropdownCard.value = null
  downloadDynamicThumbnail(variant, badgeText)
}

const generateYellowBadgeSvgMarkup = (badgeText) => {
  const cleanBadge = (badgeText || '').trim()
  const posX = 60
  const posY = 60
  const charWidth = 36
  const padX = 36
  const mainWidth = Math.max(220, cleanBadge.length * charWidth + padX * 2)
  const mainHeight = 92

  return `<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="yellowBingeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="45%" stop-color="#facc15" />
        <stop offset="100%" stop-color="#eab308" />
      </linearGradient>
      <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.9" />
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.65" />
      </filter>
    </defs>
    <g filter="url(#badgeShadow)">
      <rect x="${posX - 3}" y="${posY - 3}" width="${mainWidth + 6}" height="${mainHeight + 6}" rx="24" fill="#09090b" stroke="rgba(255,255,255,0.5)" stroke-width="3" />
      <rect x="${posX}" y="${posY}" width="${mainWidth}" height="${mainHeight}" rx="22" fill="url(#yellowBingeGrad)" />
      <rect x="${posX + 4}" y="${posY + 4}" width="${mainWidth - 8}" height="${mainHeight / 2 - 4}" rx="18" fill="rgba(255,255,255,0.25)" />
      <text x="${posX + mainWidth / 2}" y="${posY + 65}" font-family="'Montserrat', 'Arial Black', Impact, -apple-system, sans-serif" font-size="56" font-weight="900" letter-spacing="2" fill="#09090b" text-anchor="middle">${cleanBadge}</text>
    </g>
  </svg>`
}

const downloadDynamicThumbnail = async (variant, badgeText = '') => {
  try {
    isDownloadingThumb.value = true
    const rawUrl = variant.url || `/api/episodes/${franchise.value?.folder || route.params.id}/${selectedPackageEpisode.value}/thumbnails/${variant.filename}`
    const textlessUrl = rawUrl.replace(/\.jpg$/i, '_Textless.jpg')

    const img = new Image()
    img.crossOrigin = 'anonymous'

    await new Promise((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => {
        img.src = rawUrl
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image asset'))
      }
      img.src = textlessUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, 1920, 1080)

    if (badgeText && badgeText.trim()) {
      const svgMarkup = generateYellowBadgeSvgMarkup(badgeText)
      const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      const svgImg = new Image()
      await new Promise((resolve, reject) => {
        svgImg.onload = () => {
          ctx.drawImage(svgImg, 0, 0, 1920, 1080)
          URL.revokeObjectURL(svgUrl)
          resolve()
        }
        svgImg.onerror = reject
        svgImg.src = svgUrl
      })
    }

    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Canvas render failed')
      const safeBadge = badgeText ? `Badge_${badgeText.replace(/[^a-zA-Z0-9_-]/g, '')}` : 'Clean'
      const filename = `${franchise.value?.name ? franchise.value.name.replace(/\s+/g, '_') : 'Series'}_${variant.id || 'Concept'}_${safeBadge}.jpg`

      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)

      triggerToast('Thumbnail Exported', `${filename} (${(blob.size / 1024).toFixed(1)} KB) ready!`)
      isDownloadingThumb.value = false
    }, 'image/jpeg', 0.92)

  } catch (err) {
    console.error('Download error:', err)
    triggerToast('Export Error', err.message || 'Failed to render dynamic thumbnail')
    isDownloadingThumb.value = false
  }
}


// In-app Toast System
const toast = ref({
  show: false,
  title: '',
  message: ''
})
let toastTimer = null

const triggerToast = (title, message) => {
  clearTimeout(toastTimer)
  toast.value = { show: true, title, message }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

const defaultTitles = [
  "Mocked as an F-Rank Archer, He Siphons Boss Stats in Secret and Draws at Mach 4",
  "Assigned to the Trash Class, His 6,500 LBS Bow Shot Shocked the High Director",
  "When an S-Rank Red Gate Trapped 300 Students, the F-Rank Archer Soloed the Boss",
  "They Gave Him Dungeon Refuse Duty, Unaware His System Steals S-Rank Boss Stats",
  "The S-Rank Scion Dropped His Staff in Terror While the Mocked Archer One-Shot It",
  "He Shattered 12 Inches of S-Rank Obsidian Armor with a Single Hypersonic Arrow",
  "(1-5) Mocked for Rolling 'Garbage Archer', He Unlocks the Omniscient Siphon Bow",
  "They Exiled Him as a Weak Archer, But His Void-Strung Bow Controls the Dungeon",
  "The Guild Thought He Was Paralyzed, But He Moved at Mach 2.5 Across Falling Rocks",
  "From Mocked Orphan to S-Rank Calamity Slayer: The Rise of the Plunderer Archer"
]

const loadFranchise = async () => {
  try {
    const res = await fetch('/api/franchises')
    const list = await res.json()
    franchise.value = list.find(f => f.id === route.params.id)
    if (availableEpisodes.value.length) {
      selectedPackageEpisode.value = availableEpisodes.value[0].id
      // Pre-select only verified compiled episodes for multi-episode stitching
      selectedEpisodes.value = compiledEpisodes.value.map(e => e.id)
      loadPackagingData()
      loadOmnibusFiles()
    }
  } catch (err) {
    console.error(err)
  }
}

const loadModels = async () => {
  try {
    const res = await fetch(`/api/franchises/${route.params.id}/character-models`)
    models.value = await res.json()
  } catch (err) {
    console.error(err)
  }
}

const omnibusMetadata = ref(null)

const loadPackagingData = async () => {
  if (!selectedPackageEpisode.value) return
  if (selectedPackageEpisode.value === 'omnibus_master' || selectedPackageEpisode.value === 'omnibus_complete') {
    const isComplete = selectedPackageEpisode.value === 'omnibus_complete'
    try {
      const res = await fetch(`/api/franchises/${route.params.id}/omnibus-metadata`)
      const meta = await res.json()
      omnibusMetadata.value = meta

      // Load base episode 1 packaging to inherit visual thumbnail concepts
      const firstEp = availableEpisodes.value[0]?.id || 'EP01'
      const basePkgRes = await fetch(`/api/episodes/${route.params.id}/${firstEp}/youtube-package`)
      const basePkg = await basePkgRes.json()

      // Dynamically enhance package for Master Omnibus / Complete Story Marathon
      const partCount = meta?.partCount || (compiledEpisodes.value.length >= 2 ? compiledEpisodes.value.length : 2)
      const partBadge = isComplete ? 'COMPLETE' : (meta?.partBadgeText || (partCount > 1 ? `1 - ${partCount}` : 'PART 1'))
      const durationStr = meta?.totalDurationFormatted || '2h 50m 16s'

      const canonicalTitle = route.params.id?.includes('Series_03')
        ? 'Reborn As A Smiling Architect, My Infinite +N Enchantment Broke The Demigod Tower'
        : route.params.id?.includes('Series_02')
        ? 'Mocked As An F-Rank Archer, He Siphons Boss Stats To Solo The S-Rank Red Gate'
        : route.params.id?.includes('Series_01')
        ? 'Abandoned As The Weakest Scavenger, He Awakens The Singularity Sovereign Protocol'
        : (franchise.value?.name || 'Transmigrated Game Architect')

      const rawCompleteTitles = [
        {
          archetype: 'Complete Prefix (Binge Standard - Confirmed)',
          ctrScore: '99%',
          title: `(Complete) ${canonicalTitle}`
        },
        {
          archetype: 'Full Story High-Visibility',
          ctrScore: '98%',
          title: `[Complete] ${canonicalTitle}`
        },
        {
          archetype: 'Complete Series Marathon Bracket',
          ctrScore: '96%',
          title: `${canonicalTitle.length > 70 ? canonicalTitle.slice(0, 70).trim() + '...' : canonicalTitle} [Complete Marathon]`
        },
        {
          archetype: 'Clean Pipe Marathon Standard',
          ctrScore: '95%',
          title: `${canonicalTitle.length > 70 ? canonicalTitle.slice(0, 70).trim() + '...' : canonicalTitle} | Complete Story`
        },
        {
          archetype: 'Parenthetical Full Story',
          ctrScore: '93%',
          title: `(Full Story) ${canonicalTitle}`
        }
      ]

      const rawOmnibusTitles = [
        {
          archetype: 'Canonical Prefix (Binge Standard - Confirmed)',
          ctrScore: '99%',
          title: `(Episodes ${partBadge}) ${canonicalTitle}`
        },
        {
          archetype: 'Canonical Suffix (Full Saga)',
          ctrScore: '97%',
          title: `${canonicalTitle} (Episodes ${partBadge})`
        },
        {
          archetype: 'Clean Pipe Delimiter',
          ctrScore: '95%',
          title: `${canonicalTitle} | Episodes ${partBadge}`
        },
        {
          archetype: 'Bracket High-Visibility',
          ctrScore: '94%',
          title: `[Episodes ${partBadge}] ${canonicalTitle}`
        }
      ]

      const titles = (isComplete ? rawCompleteTitles : rawOmnibusTitles).map(t => {
        let clean = t.title.trim()
        if (clean.length > 100) clean = clean.slice(0, 97).trim() + '...'
        return {
          ...t,
          title: clean,
          charCount: clean.length,
          isCompliant: clean.length <= 100
        }
      })

      const dynamicBreakdownFallback = compiledEpisodes.value.map((ep, idx) => `• Episode ${idx + 1}: ${ep.name}`).join('\n')
      const dynamicChapterFallback = compiledEpisodes.value.map((ep, idx) => `00:00 Episode ${idx + 1}: ${ep.name}`).join('\n')

      const completeDescription = `🏆 COMPLETE STORY MARATHON (FULL SERIES COMPLETE - ${durationStr})
Mocked by the imperial proctors as having the most useless talent in the empire—[Common Tool Polisher]—Bram was cast out into the outer slums to rot. The feudal lords had no idea he was a former lead VR game architect from Earth, and his talent was the universe's ultimate underlying reality hack: Uncapped Recursive Enhancement and Semantic Refactoring.

While arrogant noble knights brag about ancestral holy relics, Bram quietly enhances ordinary kitchen knives to +500 kinetic impact, rewrites legendary imperial rapiers into brittle chalk, and solo-speedruns the entire 100-Floor Tower of Demigods using a discarded wooden broom.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ CUMULATIVE EPISODE BREAKDOWN:
${meta?.cumulativeBreakdownString || dynamicBreakdownFallback}

⏱️ 100% MATHEMATICALLY ACCURATE CHAPTER TIMESTAMPS:
${meta?.youtubeChapterString || dynamicChapterFallback}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 COMPLETE MARATHON PRODUCTION SPECS:
• Series Title: ${franchise.value?.name || 'Transmigrated Game Architect'}
• Compilation: Complete Series Marathon (Episodes 1 through ${partCount})
• Total Master Runtime: ${durationStr}
• Master Quality: 1080p 24FPS Cinematic Master Cut
• Format: Authentic Webtoon Visual Flow

💬 COMMUNITY MARATHON QUESTION:
Now that you've watched the complete story from Floor 1 to Floor 100, which moment was the most satisfying: Bram turning the golden holy rapier into chalk, or confronting the Demigod Architect at the summit? Drop your thoughts below! 👇

⚖️ COPYRIGHT & FAIR USE NOTICE:
This production features original scripted manhwa recap storytelling, dynamic character lore, custom voiceover narration, and original visual staging. All rights reserved by Manhwa Recap Studio.`

      const omnibusDescription = `🎬 MULTI-EPISODE MARATHON COMPILATION (${partBadge} FULL SAGA - ${durationStr})
Mocked by the imperial proctors as having the most useless talent in the empire—[Common Tool Polisher]—Bram was cast out into the outer slums to rot. The feudal lords had no idea he was a former lead VR game architect from Earth, and his talent was the universe's ultimate underlying reality hack: Uncapped Recursive Enhancement and Semantic Refactoring.

While arrogant noble knights brag about ancestral holy relics, Bram quietly enhances ordinary kitchen knives to +500 kinetic impact, rewrites legendary imperial rapiers into brittle chalk, and solo-speedruns the lethal 100-Floor Tower of Demigods using a discarded wooden broom.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ CUMULATIVE EPISODE BREAKDOWN:
${meta?.cumulativeBreakdownString || dynamicBreakdownFallback}

⏱️ 100% MATHEMATICALLY ACCURATE CHAPTER TIMESTAMPS:
${meta?.youtubeChapterString || dynamicChapterFallback}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 SERIES & PRODUCTION SPECS:
• Series Title: ${franchise.value?.name || 'Transmigrated Game Architect'}
• Compilation: Episodes ${partBadge} (Full Arc Feature / Season Movie)
• Total Master Runtime: ${durationStr}
• Master Quality: 1080p 24FPS Cinematic Master Cut
• Format: Authentic Webtoon Visual Flow

💬 COMMUNITY MARATHON QUESTION:
Which moment in this full compilation was the most satisfying: Bram turning the golden holy rapier into chalk, or pulverizing the Floor 10 Minotaur with a single pine needle? Let us know below!

⚖️ COPYRIGHT & FAIR USE NOTICE:
This production features original scripted manhwa recap storytelling, dynamic character lore, custom voiceover narration, and original visual staging. All rights reserved by Manhwa Recap Studio.`

      activeThumbnailBadge.value = isComplete ? 'COMPLETE' : partBadge
      pkgData.value = {
        ...basePkg,
        titles,
        description: isComplete ? completeDescription : omnibusDescription,
        pinnedComment: isComplete
          ? `🏆 THE COMPLETE STORY MARATHON IS HERE! Bram rewrote an ancestral S-Rank golden rapier into chalk, siphoned 10,000 enhancement charges, and conquered Floors 1 through 100 without breaking a sweat! 😭☕\n\nWhat was your favourite part across the entire complete story? Drop your thoughts below! 👇`
          : `Bram really rewrote an ancestral S-Rank golden rapier into chalk, siphoned 10,000 enhancement charges, and conquered Floors 1 through 70 without breaking a sweat! 😭☕\n\nWhat was your favourite part of this full ${partBadge} saga? Drop your thoughts below! 👇`,
        isOmnibus: true,
        isComplete,
        partBadgeText: isComplete ? 'COMPLETE' : partBadge
      }
    } catch (e) {
      console.error('Failed to load omnibus package data:', e)
    }
    return
  }

  try {
    const res = await fetch(`/api/episodes/${route.params.id}/${selectedPackageEpisode.value}/youtube-package`)
    pkgData.value = await res.json()
    omnibusMetadata.value = null
    activeThumbnailBadge.value = '' // Default to Clean for single episode release
  } catch (err) {
    console.error(err)
  }
}

const loadOmnibusFiles = async () => {
  try {
    const res = await fetch(`/api/franchises/${route.params.id}/omnibus-files`)
    if (res.ok) {
      omnibusFiles.value = await res.json()
    }
  } catch (err) {
    console.error('Error loading omnibus files:', err)
  }
}

const availableEpisodes = computed(() => {
  if (!franchise.value?.episodes) return []
  const seenPrefixes = new Set()
  return franchise.value.episodes.filter(ep => {
    const prefix = ep.id.slice(0, 4).toUpperCase()
    if (seenPrefixes.has(prefix)) return false
    seenPrefixes.add(prefix)
    return true
  })
})

const compiledEpisodes = computed(() => {
  return availableEpisodes.value.filter(ep => ep.hasCompiledVideo)
})

const episode1 = computed(() => {
  return availableEpisodes.value.find(ep => /EP0*1/i.test(ep.id)) || availableEpisodes.value[0] || null
})

const currentSelectedEpisode = computed(() => {
  if (!selectedPackageEpisode.value || selectedPackageEpisode.value.startsWith('omnibus')) return null
  return availableEpisodes.value.find(e => e.id === selectedPackageEpisode.value) || null
})

const currentSelectedEpisodeVideoDownloadUrl = computed(() => {
  if (currentSelectedEpisode.value?.hasCompiledVideo) {
    const fId = franchise.value?.folder || route.params.id
    const eId = currentSelectedEpisode.value.id
    return `/api/episodes/${fId}/${eId}/video-stream?file=01_Episode_Master_1080p.mp4&download=1`
  }
  return null
})

const currentSelectedEpisodeVideoFilename = computed(() => {
  if (!currentSelectedEpisode.value) return 'Episode_Master_1080p.mp4'
  const fId = franchise.value?.folder || route.params.id
  return `${fId}_${currentSelectedEpisode.value.id}_Master_1080p.mp4`
})

const currentSelectedEpisodeVideoSize = computed(() => {
  return currentSelectedEpisode.value?.videoSizeFormatted || '1080p'
})

const selectedEpisodeFilter = ref('all')

const episodeScopedModels = computed(() => {
  if (selectedEpisodeFilter.value === 'all') return models.value
  const targetEp = selectedEpisodeFilter.value.toLowerCase()
  return models.value.filter(m => {
    if (Array.isArray(m.episodes) && m.episodes.length > 0) {
      return m.episodes.some(ep => ep.toLowerCase().includes(targetEp) || targetEp.includes(ep.toLowerCase()))
    }
    return true
  })
})

const getEpisodeModelCount = (epId) => {
  if (!epId) return 0
  const targetEp = epId.toLowerCase()
  return models.value.filter(m => {
    if (Array.isArray(m.episodes) && m.episodes.length > 0) {
      return m.episodes.some(ep => ep.toLowerCase().includes(targetEp) || targetEp.includes(ep.toLowerCase()))
    }
    return true
  }).length
}

const filteredModels = computed(() => {
  const base = episodeScopedModels.value
  if (vaultFilter.value === 'all') return base
  if (vaultFilter.value === 'protagonist') return base.filter(m => m.category === 'Protagonist')
  if (vaultFilter.value === 'antagonist') return base.filter(m => m.category === 'Antagonist')
  if (vaultFilter.value === 'item') return base.filter(m => m.type === 'item' || m.type === 'weapon' || m.category === 'Item')
  return base
})

const copiedVaultId = ref(null)
const copiedVaultType = ref(null)

const getCategoryBadgeClass = (category) => {
  const cat = (category || '').toLowerCase()
  if (cat.includes('protagonist')) return 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800'
  if (cat.includes('antagonist')) return 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
  if (cat.includes('supporting')) return 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
  if (cat.includes('weapon')) return 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
  if (cat.includes('artifact')) return 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-800'
  if (cat.includes('prop')) return 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800'
  return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
}

const copyVaultName = async (model) => {
  if (!model) return
  const cleanName = model.flowName || model.token?.replace(/[@{}]/g, '') || model.name
  try {
    await navigator.clipboard.writeText(cleanName)
    copiedVaultId.value = model.id
    copiedVaultType.value = 'name'
    triggerToast('Flow Name Copied', cleanName)
    setTimeout(() => {
      if (copiedVaultId.value === model.id && copiedVaultType.value === 'name') {
        copiedVaultId.value = null
        copiedVaultType.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Clipboard error:', err)
  }
}

const copyVaultToken = async (model) => {
  if (!model) return
  const tokenText = model.token || `@{${model.name}}`
  try {
    await navigator.clipboard.writeText(tokenText)
    copiedVaultId.value = model.id
    copiedVaultType.value = 'token'
    triggerToast('Token Copied', tokenText)
    setTimeout(() => {
      if (copiedVaultId.value === model.id && copiedVaultType.value === 'token') {
        copiedVaultId.value = null
        copiedVaultType.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Clipboard error:', err)
  }
}

const copyVaultDna = async (model) => {
  if (!model) return
  const textToCopy = model.fullDna || model.dnaAnchor || model.description || `${model.name}, modern 2025 urban cultivation manhwa webtoon art style, sharp ink linework, bright high-key lighting, vibrant clean cel shading`
  try {
    await navigator.clipboard.writeText(textToCopy)
    copiedVaultId.value = model.id
    copiedVaultType.value = 'dna'
    triggerToast('DNA Anchor Copied', model.name)
    setTimeout(() => {
      if (copiedVaultId.value === model.id && copiedVaultType.value === 'dna') {
        copiedVaultId.value = null
        copiedVaultType.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Clipboard error:', err)
  }
}

const downloadVaultPlate = async (model) => {
  if (!model) return
  try {
    const res = await fetch(model.url)
    const blob = await res.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = model.filename || `${model.name.replace(/\s+/g, '_')}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(blobUrl)
    triggerToast('Downloaded Plate', model.filename || model.name)
  } catch (err) {
    console.error('Download error:', err)
  }
}

// Google Flow Entity ID Mapping State
const entityMapRawText = ref('')
const parsedEntities = ref({})
const promptTagMode = ref('uuid') // 'uuid' | 'token'
const isSavingEntityMap = ref(false)
const isEntityMapperAccordionOpen = ref(true)

const entityCount = computed(() => Object.keys(parsedEntities.value).length)

const getModelUuid = (model) => {
  if (!model) return null
  const candidates = [
    model.flowName, 
    model.name, 
    model.id, 
    model.token ? model.token.replace(/[@{}]/g, '') : null
  ].filter(Boolean)
  
  for (const c of candidates) {
    if (parsedEntities.value[c]) return parsedEntities.value[c]
    const stripped = c.replace(/^(Boss|Character|Commander|Lord|Instructor|Director):\s*/i, '').trim()
    if (parsedEntities.value[stripped]) return parsedEntities.value[stripped]
  }
  return null
}

const syncEntityMapping = async () => {
  const result = parseEntityMappingText(entityMapRawText.value)
  // Automatically format the textarea with clean individual lines
  if (result.normalizedText && result.normalizedText !== entityMapRawText.value) {
    entityMapRawText.value = result.normalizedText
  }

  parsedEntities.value = result.entities
  saveEntityMapToStorage(route.params.id, entityMapRawText.value, result.entities)
  
  let charactersUpdated = 0
  let matricesUpdated = 0

  try {
    isSavingEntityMap.value = true
    const res = await fetch(`/api/franchises/${route.params.id}/flow-entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText: entityMapRawText.value, entities: result.entities })
    })
    if (res.ok) {
      const data = await res.json()
      charactersUpdated = data.charactersUpdated || 0
      matricesUpdated = data.matricesUpdated || 0
    }
  } catch (e) {
    console.warn('Failed to persist flow entities to server:', e)
  } finally {
    isSavingEntityMap.value = false
  }

  // Refresh character models from server to reflect synced flowUuid
  await loadModels()

  const cascadeInfo = (charactersUpdated > 0 || matricesUpdated > 0)
    ? ` • Cascaded to ${charactersUpdated} vault models & ${matricesUpdated} prompt matrices`
    : ''

  triggerToast(
    'Flow Entity IDs Synchronized',
    `Mapped ${result.count} entities${cascadeInfo}! Mode: ${promptTagMode.value === 'uuid' ? '@UUID' : '@{Token}'}`
  )
}

const handleEntityMapPaste = () => {
  setTimeout(() => {
    const result = parseEntityMappingText(entityMapRawText.value)
    if (result.normalizedText && result.normalizedText !== entityMapRawText.value) {
      entityMapRawText.value = result.normalizedText
      triggerToast('Auto-Formatted Paste', `Reformatted ${result.count} entities into clean lines!`)
    }
  }, 50)
}

const prettifyEntityMapping = () => {
  const result = parseEntityMappingText(entityMapRawText.value)
  if (result.normalizedText) {
    entityMapRawText.value = result.normalizedText
    triggerToast('Text Prettified', `Formatted ${result.count} entities into clean individual lines!`)
  }
}

const copyFlowAgentPrompt = async () => {
  const characters = (models.value || []).filter(m => m.type === 'character' || m.type === 'boss' || m.category === 'Protagonist' || m.category === 'Antagonist' || m.category === 'Supporting').map(m => m.flowName || m.name)
  const items = (models.value || []).filter(m => m.type === 'weapon' || m.type === 'artifact' || m.type === 'prop' || m.category === 'Item').map(m => m.flowName || m.name)
  const allEntities = [...new Set([...characters, ...items])]
  const entityList = allEntities.length > 0 
    ? `\n\nList:\n${allEntities.map(e => `- ${e}`).join('\n')}` 
    : ''

  const promptText = `Please list all characters and items in this project with their UUIDs:

Format:
Name: UUID${entityList}`

  try {
    await navigator.clipboard.writeText(promptText)
    triggerToast('Flow Agent Prompt Copied', 'Paste directly into Google Flow chat to get character UUIDs!')
  } catch (e) {
    console.error('Failed to copy flow prompt:', e)
  }
}

const togglePromptTagMode = (mode) => {
  promptTagMode.value = mode
  setTagModeToStorage(mode)
  triggerToast(
    'Prompt Format Toggled',
    mode === 'uuid' ? 'Active Output: Google Flow Entity IDs (@UUID)' : 'Active Output: Human-Readable Tokens (@{Name})'
  )
}

const copyCurrentEntityMapping = async () => {
  try {
    await navigator.clipboard.writeText(entityMapRawText.value)
    triggerToast('Mapping Copied', 'Copied Entity ID mapping text to clipboard!')
  } catch (e) {
    console.error('Copy error:', e)
  }
}

const loadFlowEntities = async () => {
  promptTagMode.value = getTagModeFromStorage()
  const local = loadEntityMapFromStorage(route.params.id)
  if (local && local.rawText) {
    entityMapRawText.value = local.rawText
    parsedEntities.value = local.entities || parseEntityMappingText(local.rawText).entities
  }

  try {
    const res = await fetch(`/api/franchises/${route.params.id}/flow-entities?cb=${Date.now()}`)
    const data = await res.json()
    if (data && typeof data.rawText === 'string') {
      entityMapRawText.value = data.rawText
      parsedEntities.value = data.entities || parseEntityMappingText(data.rawText).entities
      saveEntityMapToStorage(route.params.id, data.rawText, parsedEntities.value)
    }
  } catch (e) {
    console.warn('Failed to fetch flow entities:', e)
  }
}

const copyToken = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  triggerToast('Copied to Clipboard', text.length > 60 ? `${text.slice(0, 60)}...` : text)
}

const onThumbError = (e) => {
  e.target.style.display = 'none'
}

const triggerOmnibusCompile = async () => {
  if (selectedEpisodes.value.length < 2) {
    triggerToast('Selection Required', 'Please select at least 2 episodes to concatenate.')
    return
  }
  isCompilingOmnibus.value = true
  try {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`
    const outputFilename = `${route.params.id}_${selectedTier.value}_Master_${ts}_1080p.mp4`

    const res = await fetch(`/api/franchises/${route.params.id}/stitch-master-omnibus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        masterFilePaths: selectedEpisodes.value.map(epId => `01_Franchises/${route.params.id}/${epId}/video/01_Episode_Master_1080p.mp4`),
        outputFilename
      })
    })
    const data = await res.json()
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Omnibus stitching failed')
    }
    const savedName = data.filename || (data.output ? data.output.split(/[\\/]/).pop() : 'Master Omnibus')
    triggerToast('Multi-Episode Stitching Completed', `Saved to: ${savedName}`)
    await loadOmnibusFiles()
    await loadPackagingData()
  } catch (err) {
    triggerToast('Stitching Error', err.message)
  } finally {
    isCompilingOmnibus.value = false
  }
}

const deleteOmnibusFile = async (filename) => {
  if (!confirm(`Are you sure you want to delete compiled master movie "${filename}"? This action cannot be undone.`)) {
    return
  }
  try {
    const res = await fetch(`/api/franchises/${route.params.id}/omnibus-files?file=${encodeURIComponent(filename)}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to delete master movie')
    }
    triggerToast('Master Movie Deleted', filename)
    await loadOmnibusFiles()
  } catch (err) {
    triggerToast('Delete Error', err.message)
  }
}

// TikTok / Shorts Viral Climax Funnel Engine
const isClimaxModalOpen = ref(false)
const selectedClimaxEpisode = ref(null)
const climaxData = ref(null)
const isGeneratingShort = ref(false)
const isLoadingClimaxData = ref(false)
const copiedClimaxField = ref(null)

const defaultClimaxHooks = computed(() => {
  const currentId = route.params.id || ''
  if (currentId.includes('Series_04')) {
    return [
      { title: "He ran an idle cultivation game for 10 years, then Earth merged with his save file 😭💀", hookType: "Reality Convergence", ctrScore: "99%" },
      { title: "Arrogant S-Rank Scion drew a sacred jade blade, so he snapped it with a kitchen knife 💀", hookType: "Action Shock", ctrScore: "98%" },
      { title: "Mocked as a broke night-shift clerk until 1 billion years of Dao cultivation unlocked 😭", hookType: "Underdog Awakening", ctrScore: "97%" },
      { title: "The state spectrometer tried measuring his power... and violently exploded with 1 billion years of Dao ⚡💀", hookType: "Measurement Overflow", ctrScore: "96%" }
    ]
  }
  if (currentId.includes('Series_03')) {
    return [
      { title: "They mocked his F-Rank cleaning talent until he turned their $10M Holy Sword into chalk 😭💀", hookType: "Noble Humiliation", ctrScore: "99%" },
      { title: "Arrogant Noble draws a Flaming S-Rank Rapier on a slum craftsman... and instantly regrets it 💀", hookType: "Dramatic Shock", ctrScore: "97%" },
      { title: "Slum craftsman taps the Noble's Holy Sword with one finger: [SEMANTIC REFACTORING ACTIVATED]", hookType: "System Revelation", ctrScore: "95%" },
      { title: "He turned an ancestral holy blade into brittle chalk with a single tap 😭☕", hookType: "Deadpan Comedy", ctrScore: "94%" }
    ]
  }
  if (currentId.includes('Series_02')) {
    return [
      { title: "They expelled the weak archer from the raid, until his void bow shot at Mach 2.5 💀", hookType: "Underdog Awakening", ctrScore: "99%" },
      { title: "S-Rank Colossus wipes out the elite guild, but the mocked porter draws a 6,500lb recurve 😭🏹", hookType: "Boss Destruction", ctrScore: "97%" }
    ]
  }
  return [
    { title: "They mocked him as the weakest student until his true hidden sovereign power awakened 💀", hookType: "Underdog Awakening", ctrScore: "99%" },
    { title: "Arrogant elite drew their sacred blade on an ordinary student... and instantly regretted it 😭", hookType: "Dramatic Shock", ctrScore: "97%" }
  ]
})

const openClimaxModal = (ep) => {
  selectedClimaxEpisode.value = ep
  isClimaxModalOpen.value = true
  loadClimaxShort(ep.id)
}

const openSeriesClimaxModal = () => {
  const ep1 = availableEpisodes.value[0]
  if (!ep1) {
    triggerToast('No Episodes Found', 'Please create or load Episode 1 first.')
    return
  }
  openClimaxModal(ep1)
}

const closeClimaxModal = () => {
  isClimaxModalOpen.value = false
  climaxData.value = null
}

const loadClimaxShort = async (epId) => {
  if (!epId || !route.params.id) return
  isLoadingClimaxData.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.id}/${epId}/climax-short`)
    if (res.ok) {
      const data = await res.json()
      climaxData.value = data
    } else {
      climaxData.value = null
    }
  } catch (err) {
    console.error('Failed to load climax short:', err)
    climaxData.value = null
  } finally {
    isLoadingClimaxData.value = false
  }
}

const generateClimaxShort = async (epId) => {
  if (!epId || !route.params.id) return
  isGeneratingShort.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.id}/${epId}/generate-climax-short`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to generate climax short')
    }
    climaxData.value = data
    triggerToast('Viral Short Generated', 'TikTok & Shorts climax hook compiled successfully!')
  } catch (err) {
    console.error('Generation error:', err)
    triggerToast('Compilation Error', err.message)
  } finally {
    isGeneratingShort.value = false
  }
}

const copyClimaxText = (field, text) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  copiedClimaxField.value = field
  triggerToast('Copied to Clipboard', text.length > 60 ? `${text.slice(0, 60)}...` : text)
  setTimeout(() => {
    if (copiedClimaxField.value === field) {
      copiedClimaxField.value = null
    }
  }, 2000)
}

onMounted(() => {
  loadFranchise()
  loadModels()
  loadOmnibusFiles()
  loadFlowEntities()
  window.addEventListener('click', () => {
    activeDropdownCard.value = null
  })
})
</script>
