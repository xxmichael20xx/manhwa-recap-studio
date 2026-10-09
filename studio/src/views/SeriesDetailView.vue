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
        <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold">
          16:9 Landscape
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

        <div class="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <span class="text-slate-500">Total Episodes:</span>
          <span class="font-bold text-purple-600 dark:text-purple-400">{{ franchise.episodes?.length || 0 }}</span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span class="text-slate-500">Vault Models:</span>
          <span class="font-bold text-amber-600 dark:text-amber-400">{{ models.length }}</span>
        </div>
      </div>
    </div>

    <!-- Top-Level Franchise Navigation Tabs -->
    <div class="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
      <button 
        @click="activeTab = 'episodes'"
        class="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer shrink-0"
        :class="activeTab === 'episodes' 
          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        <Layers class="w-4 h-4" />
        <span>1. Episodic Pipeline ({{ franchise.episodes?.length || 0 }})</span>
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

    <!-- TAB 1: EPISODIC PRODUCTION PIPELINE -->
    <div v-if="activeTab === 'episodes'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Layers class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Episodic Production Pipeline</span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Individual episode workflows for script drafting, prompt matrix generation, voiceover sync, and 1080p video stitching.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="ep in franchise.episodes" 
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

          <!-- Category Filter Chips -->
          <div class="flex items-center space-x-2 overflow-x-auto">
            <button 
              @click="vaultFilter = 'all'"
              class="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer"
              :class="vaultFilter === 'all' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
            >
              All Assets ({{ models.length }})
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

        <!-- Character & Item Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          <div 
            v-for="item in filteredModels" 
            :key="item.id"
            class="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:border-amber-500/40 transition-all group"
          >
            <!-- Reference Plate Preview & Badges -->
            <div class="aspect-video w-full rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden relative group/img">
              <img 
                v-if="item.hasPlate" 
                :src="`/api/franchises/${franchise.folder}/character-models/${item.filename}`" 
                :alt="item.name"
                class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 space-y-2">
                <Crown class="w-8 h-8 opacity-40" />
                <span class="text-[10px] font-mono">Reference Plate Pending</span>
              </div>

              <!-- Badges -->
              <div class="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase backdrop-blur-md shadow-sm"
                  :class="{
                    'bg-amber-500/90 text-slate-950': item.category === 'Protagonist',
                    'bg-rose-500/90 text-white': item.category === 'Antagonist',
                    'bg-purple-500/90 text-white': item.category === 'Supporting',
                    'bg-cyan-500/90 text-slate-950': item.type === 'item' || item.type === 'weapon'
                  }"
                >
                  {{ item.category || item.type }}
                </span>
                <span v-if="item.tier" class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-200 backdrop-blur-md">
                  {{ item.tier }}
                </span>
              </div>
            </div>

            <!-- Card Header & Token -->
            <div class="space-y-1.5">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{{ item.name }}</span>
                <button 
                  @click="copyToken(item.token)"
                  class="text-[10px] font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Copy class="w-3 h-3" />
                  <span>Copy Token</span>
                </button>
              </h3>
              <div class="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-amber-600 dark:text-amber-400 select-all break-all">
                {{ item.token }}
              </div>
            </div>

            <!-- Description / Visual DNA -->
            <div class="space-y-1">
              <label class="text-[10px] font-mono uppercase text-slate-400 font-semibold">Visual DNA Anchor</label>
              <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {{ item.dnaAnchor || item.description }}
              </p>
            </div>

            <!-- Copy Full Prompt Anchor -->
            <button 
              @click="copyToken(item.dnaAnchor || item.token)"
              class="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-amber-500 flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Sparkles class="w-3.5 h-3.5" />
              <span>Copy Full DNA Anchor</span>
            </button>
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
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              v-for="ep in franchise.episodes" 
              :key="ep.id"
              class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  :id="ep.id" 
                  v-model="selectedEpisodes" 
                  :value="ep.id"
                  class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label :for="ep.id" class="cursor-pointer">
                  <div class="text-xs font-bold text-slate-900 dark:text-white">{{ ep.name }}</div>
                  <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400">{{ ep.id }}</div>
                </label>
              </div>

              <div class="flex items-center space-x-2">
                <span class="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold">
                  Master Ready (44m 18s)
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

          <!-- Episode Selector Dropdown -->
          <div class="flex items-center space-x-2">
            <label class="text-xs font-mono text-slate-400 font-semibold">Select Release Target:</label>
            <select 
              v-model="selectedPackageEpisode" 
              @change="loadPackagingData"
              class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white cursor-pointer"
            >
              <option v-for="ep in franchise.episodes" :key="ep.id" :value="ep.id">
                {{ ep.name }}
              </option>
            </select>
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

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Variant A: Split Transformation -->
            <div class="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 hover:border-purple-500/40 transition-all">
              <div class="aspect-video w-full rounded-xl bg-slate-900 overflow-hidden relative border border-slate-200 dark:border-slate-800">
                <img 
                  :src="`/api/episodes/${franchise.folder}/${selectedPackageEpisode}/thumbnails/01_Thumbnail_Concept_A.jpg`" 
                  alt="Variant A"
                  class="w-full h-full object-cover"
                  @error="onThumbError"
                />
                <span class="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-purple-600 text-white font-bold uppercase shadow-sm">
                  Variant A: The Split Transformation
                </span>
              </div>
              <div class="space-y-1">
                <h4 class="text-xs font-bold text-slate-900 dark:text-white">Weak Underdog vs Awakened Sovereign</h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Split-contrast lighting showing the mocked archer on the left and cyan sovereign runes on the right.</p>
              </div>
              <div class="grid grid-cols-2 gap-2 pt-1">
                <a 
                  :href="`/api/episodes/${franchise.folder}/${selectedPackageEpisode}/thumbnails/01_Thumbnail_Concept_A.jpg`" 
                  download="01_Thumbnail_Concept_A.jpg"
                  class="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-center text-slate-700 dark:text-slate-300 hover:text-purple-600 flex items-center justify-center space-x-1"
                >
                  <Download class="w-3 h-3" />
                  <span>Download</span>
                </a>
                <button 
                  @click="copyToken(pkgData?.thumbnailConcepts?.conceptA || 'Split Transformation Prompt')"
                  class="py-1.5 px-2 rounded-lg bg-purple-600 text-white text-[11px] font-mono text-center hover:bg-purple-700 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Copy class="w-3 h-3" />
                  <span>Prompt</span>
                </button>
              </div>
            </div>

            <!-- Variant B: Proctor Panic -->
            <div class="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 hover:border-amber-500/40 transition-all">
              <div class="aspect-video w-full rounded-xl bg-slate-900 overflow-hidden relative border border-slate-200 dark:border-slate-800">
                <img 
                  :src="`/api/episodes/${franchise.folder}/${selectedPackageEpisode}/thumbnails/01_Thumbnail_Concept_B.jpg`" 
                  alt="Variant B"
                  class="w-full h-full object-cover"
                  @error="onThumbError"
                />
                <span class="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-bold uppercase shadow-sm">
                  Variant B: Proctor's Panic
                </span>
              </div>
              <div class="space-y-1">
                <h4 class="text-xs font-bold text-slate-900 dark:text-white">Examiner Shock & Shattered Crystal</h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Extreme high-tension facial close-up of arrogant examiners sweating as measurement crystals shatter.</p>
              </div>
              <div class="grid grid-cols-2 gap-2 pt-1">
                <a 
                  :href="`/api/episodes/${franchise.folder}/${selectedPackageEpisode}/thumbnails/01_Thumbnail_Concept_B.jpg`" 
                  download="01_Thumbnail_Concept_B.jpg"
                  class="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-center text-slate-700 dark:text-slate-300 hover:text-amber-600 flex items-center justify-center space-x-1"
                >
                  <Download class="w-3 h-3" />
                  <span>Download</span>
                </a>
                <button 
                  @click="copyToken(pkgData?.thumbnailConcepts?.conceptB || 'Proctor Panic Prompt')"
                  class="py-1.5 px-2 rounded-lg bg-amber-600 text-white text-[11px] font-mono text-center hover:bg-amber-700 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Copy class="w-3 h-3" />
                  <span>Prompt</span>
                </button>
              </div>
            </div>

            <!-- Variant C: Calamity Cleave Spectacle -->
            <div class="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 hover:border-rose-500/40 transition-all">
              <div class="aspect-video w-full rounded-xl bg-slate-900 overflow-hidden relative border border-slate-200 dark:border-slate-800">
                <img 
                  :src="`/api/episodes/${franchise.folder}/${selectedPackageEpisode}/thumbnails/01_Thumbnail_Concept_C.jpg`" 
                  alt="Variant C"
                  class="w-full h-full object-cover"
                  @error="onThumbError"
                />
                <span class="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600 text-white font-bold uppercase shadow-sm">
                  Variant C: Calamity Cleave
                </span>
              </div>
              <div class="space-y-1">
                <h4 class="text-xs font-bold text-slate-900 dark:text-white">Solo Orbital Siphon Cleave</h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Epic panoramic widescreen spectacle of Caelen single-handedly shattering the S-Rank Red Gate titan.</p>
              </div>
              <div class="grid grid-cols-2 gap-2 pt-1">
                <a 
                  :href="`/api/episodes/${franchise.folder}/${selectedPackageEpisode}/thumbnails/01_Thumbnail_Concept_C.jpg`" 
                  download="01_Thumbnail_Concept_C.jpg"
                  class="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-center text-slate-700 dark:text-slate-300 hover:text-rose-600 flex items-center justify-center space-x-1"
                >
                  <Download class="w-3 h-3" />
                  <span>Download</span>
                </a>
                <button 
                  @click="copyToken(pkgData?.thumbnailConcepts?.conceptC || 'Calamity Cleave Prompt')"
                  class="py-1.5 px-2 rounded-lg bg-rose-600 text-white text-[11px] font-mono text-center hover:bg-rose-700 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Copy class="w-3 h-3" />
                  <span>Prompt</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. The 5 High-CTR Title Archetypes -->
        <div class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText class="w-4 h-4 text-purple-600" />
            <span>5 High-CTR Title Archetypes (&le; 100 Characters)</span>
          </h3>

          <div class="space-y-2">
            <div 
              v-for="(title, idx) in pkgData?.titles || defaultTitles" 
              :key="idx"
              class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-purple-500/40 transition-all"
            >
              <div class="space-y-0.5">
                <div class="text-[10px] font-mono text-slate-400 font-semibold uppercase">Archetype {{ idx + 1 }} • {{ title.length }} Chars</div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">{{ title }}</div>
              </div>
              <button 
                @click="copyToken(title)"
                class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 text-xs font-mono text-purple-600 dark:text-purple-400 flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <Copy class="w-3 h-3" />
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, Layers, FileText, Sparkles, Mic, Film, 
  Crown, Youtube, Copy, Download, Check, Loader2, X 
} from 'lucide-vue-next'

const route = useRoute()
const franchise = ref(null)
const activeTab = ref('episodes')
const vaultFilter = ref('all')
const models = ref([])
const selectedTier = ref('tier2')
const selectedEpisodes = ref([])
const isCompilingOmnibus = ref(false)
const selectedPackageEpisode = ref('')
const pkgData = ref(null)

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
  }, 3000)
}

const defaultTitles = [
  "They Exiled Him as an F-Rank Archer, But His Bow Draws at Mach 4",
  "Mocked for Rolling 'Garbage Wood Archer', He Siphons Boss Stats in Secret",
  "The S-Rank Geniuses Cried for Help While the F-Rank Orphan One-Shot the Calamity",
  "They Gave Him Dungeon Refuse Duty, Unaware His Stats Scale to Infinity",
  "When an S-Rank Red Gate Trapped the Academy, the F-Rank Archer Revealed True Sovereign Power"
]

const loadFranchise = async () => {
  try {
    const res = await fetch('/api/franchises')
    const list = await res.json()
    franchise.value = list.find(f => f.id === route.params.id)
    if (franchise.value?.episodes?.length) {
      selectedPackageEpisode.value = franchise.value.episodes[0].id
      selectedEpisodes.value = [franchise.value.episodes[0].id]
      loadPackagingData()
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

const loadPackagingData = async () => {
  if (!selectedPackageEpisode.value) return
  try {
    const res = await fetch(`/api/episodes/${route.params.id}/${selectedPackageEpisode.value}/youtube-package`)
    pkgData.value = await res.json()
  } catch (err) {
    console.error(err)
  }
}

const filteredModels = computed(() => {
  if (vaultFilter.value === 'all') return models.value
  if (vaultFilter.value === 'protagonist') return models.value.filter(m => m.category === 'Protagonist')
  if (vaultFilter.value === 'antagonist') return models.value.filter(m => m.category === 'Antagonist')
  if (vaultFilter.value === 'item') return models.value.filter(m => m.type === 'item' || m.type === 'weapon' || m.category === 'Item')
  return models.value
})

const copyToken = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  triggerToast('Copied to Clipboard', text.length > 60 ? `${text.slice(0, 60)}...` : text)
}

const onThumbError = (e) => {
  e.target.style.display = 'none'
}

const triggerOmnibusCompile = async () => {
  isCompilingOmnibus.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.id}/stitch-master-omnibus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        masterFilePaths: selectedEpisodes.value.map(epId => `01_Franchises/${route.params.id}/${epId}/video/01_Episode_Master.mp4`),
        outputFilename: `${route.params.id}_${selectedTier.value}_Master.mp4`
      })
    })
    const data = await res.json()
    triggerToast('Multi-Episode Stitching Completed', `Saved to: ${data.output}`)
  } catch (err) {
    triggerToast('Stitching Error', err.message)
  } finally {
    isCompilingOmnibus.value = false
  }
}

onMounted(() => {
  loadFranchise()
  loadModels()
})
</script>
