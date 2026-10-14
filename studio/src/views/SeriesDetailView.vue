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
          {{ franchise.format || (franchise.id?.includes('02') ? '16:9 Landscape' : '9:16 Webtoon') }}
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
                rows="7"
                placeholder="Paste raw agent text, e.g.:&#10;I've pulled the absolute latest list of character entities for you. Here are all 16 UUIDs:&#10;&#10;Boss: Archon of Deletion: 030776ff-8016-4192-80ee-bcc02a6f1920 (Colossal automaton)&#10;Bramwell Locke: 16c4c742-5932-4c96-9c0c-c42aadbcb00a (Manhwa protagonist)&#10;Linnea Croft: 7cf4d027-6863-4e4b-8f93-f58ceb6f0b0b&#10;..."
                class="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 font-mono text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y shadow-xs"
              ></textarea>

              <!-- Action Buttons Bar -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="syncEntityMapping"
                    :disabled="isSavingEntityMap || !entityMapRawText.trim()"
                    class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-mono flex items-center space-x-2 transition shadow-md shadow-purple-950/20 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isSavingEntityMap }" />
                    <span>{{ isSavingEntityMap ? 'Synchronizing...' : `⚡ Parse & Sync Entity IDs (${entityCount} Mapped)` }}</span>
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
                      {{ getModelUuid(model) ? '✓ Mapped' : 'Pending' }}
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
                  {{ copiedVaultId === model.id && copiedVaultType === 'name' ? 'Copied ✓' : 'Copy Name' }}
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

          <!-- Episode Selector Dropdown -->
          <div class="flex items-center space-x-2">
            <label class="text-xs font-mono text-slate-400 font-semibold">Select Release Target:</label>
            <select 
              v-model="selectedPackageEpisode" 
              @change="loadPackagingData"
              class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white cursor-pointer"
            >
              <option v-for="ep in availableEpisodes" :key="ep.id" :value="ep.id">
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

          <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            <div 
              v-for="(variant, idx) in (pkgData?.thumbnailVariants || [])" 
              :key="variant.id || idx"
              class="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 transition-all"
              :class="variant.id === 'concept_a' ? 'hover:border-purple-500/40' : variant.id === 'concept_b' ? 'hover:border-amber-500/40' : 'hover:border-rose-500/40'"
            >
              <div class="aspect-video w-full rounded-xl bg-slate-900 overflow-hidden relative border border-slate-200 dark:border-slate-800">
                <img 
                  :src="variant.url || `/api/episodes/${franchise.folder}/${selectedPackageEpisode}/thumbnails/${variant.filename}`" 
                  :alt="variant.name"
                  class="w-full h-full object-cover"
                  @error="onThumbError"
                />
                <span 
                  class="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded text-white font-bold uppercase shadow-sm"
                  :class="variant.id === 'concept_a' ? 'bg-purple-600' : variant.id === 'concept_b' ? 'bg-amber-600' : 'bg-rose-600'"
                >
                  {{ variant.id === 'concept_a' ? 'Variant A: Split Transformation' : variant.id === 'concept_b' ? 'Variant B: Proctor\'s Panic' : 'Variant C: Calamity Cleave' }}
                </span>
                <span v-if="variant.hasImage" class="absolute bottom-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-emerald-400 font-bold border border-emerald-500/30">
                  ✓ {{ variant.fileSizeFormatted }} MozJPEG
                </span>
              </div>
              <div class="space-y-1">
                <h4 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{{ variant.name }}</h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{{ variant.composition || variant.subtitle }}</p>
              </div>
              <div class="grid grid-cols-2 gap-2 pt-1">
                <a 
                  :href="variant.url || `/api/episodes/${franchise.folder}/${selectedPackageEpisode}/thumbnails/${variant.filename}`" 
                  :download="variant.filename"
                  class="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-center text-slate-700 dark:text-slate-300 hover:text-purple-600 flex items-center justify-center space-x-1"
                >
                  <Download class="w-3 h-3" />
                  <span>Download</span>
                </a>
                <button 
                  @click="copyToken(variant.prompt)"
                  class="py-1.5 px-2 rounded-lg text-white text-[11px] font-mono text-center flex items-center justify-center space-x-1 cursor-pointer transition"
                  :class="variant.id === 'concept_a' ? 'bg-purple-600 hover:bg-purple-700' : variant.id === 'concept_b' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'"
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
              <span>10 High-CTR Title Archetypes (&le; 100 Characters)</span>
            </h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              10 Formulas Available
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, Layers, FileText, Sparkles, Mic, Film, 
  Crown, Youtube, Copy, Download, Check, Loader2, X, Trash2,
  Tag, ExternalLink, RefreshCw, Hash, ChevronDown
} from 'lucide-vue-next'
import {
  parseEntityMappingText,
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
      selectedEpisodes.value = availableEpisodes.value.map(e => e.id)
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

const loadPackagingData = async () => {
  if (!selectedPackageEpisode.value) return
  try {
    const res = await fetch(`/api/episodes/${route.params.id}/${selectedPackageEpisode.value}/youtube-package`)
    pkgData.value = await res.json()
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
  const textToCopy = model.fullDna || model.dnaAnchor || model.description || `${model.name}, dark fantasy action manhwa webtoon art style, sharp ink linework, cinematic lighting`
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
  parsedEntities.value = result.entities
  saveEntityMapToStorage(route.params.id, entityMapRawText.value, result.entities)
  
  try {
    isSavingEntityMap.value = true
    await fetch(`/api/franchises/${route.params.id}/flow-entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText: entityMapRawText.value, entities: result.entities })
    })
  } catch (e) {
    console.warn('Failed to persist flow entities to server:', e)
  } finally {
    isSavingEntityMap.value = false
  }

  triggerToast(
    'Flow Entity IDs Synchronized',
    `✓ Successfully mapped ${result.count} entities! Mode: ${promptTagMode.value === 'uuid' ? '@UUID' : '@{Token}'}`
  )
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
    triggerToast('Mapping Copied', '✓ Copied Entity ID mapping text to clipboard!')
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
    if (data && data.rawText) {
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
    const res = await fetch(`/api/franchises/${route.params.id}/stitch-master-omnibus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        masterFilePaths: selectedEpisodes.value.map(epId => `01_Franchises/${route.params.id}/${epId}/video/01_Episode_Master_1080p.mp4`),
        outputFilename: `${route.params.id}_${selectedTier.value}_Master_1080p.mp4`
      })
    })
    const data = await res.json()
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Omnibus stitching failed')
    }
    const savedName = data.filename || (data.output ? data.output.split(/[\\/]/).pop() : 'Master Omnibus')
    triggerToast('Multi-Episode Stitching Completed', `Saved to: ${savedName}`)
    await loadOmnibusFiles()
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

onMounted(() => {
  loadFranchise()
  loadModels()
  loadOmnibusFiles()
  loadFlowEntities()
})
</script>
