<template>
  <div class="space-y-6 relative">
    <!-- Global Floating Toast Notification -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="toast.show" 
        class="fixed top-20 right-6 z-50 max-w-md w-full shadow-2xl rounded-2xl p-4 border flex items-start space-x-3 backdrop-blur-md transition-all pointer-events-auto"
        :class="{
          'bg-white/95 dark:bg-slate-900/95 border-emerald-500/40 text-slate-900 dark:text-white': toast.type === 'success',
          'bg-white/95 dark:bg-slate-900/95 border-purple-500/40 text-slate-900 dark:text-white': toast.type === 'info',
          'bg-white/95 dark:bg-slate-900/95 border-rose-500/40 text-slate-900 dark:text-white': toast.type === 'error'
        }"
      >
        <div class="p-2 rounded-xl shrink-0" :class="{
          'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500': toast.type === 'success',
          'bg-purple-50 dark:bg-purple-950/60 text-purple-500': toast.type === 'info',
          'bg-rose-50 dark:bg-rose-950/60 text-rose-500': toast.type === 'error'
        }">
          <Check v-if="toast.type === 'success'" class="w-5 h-5" />
          <Loader2 v-else-if="toast.type === 'info' && toast.loading" class="w-5 h-5 animate-spin" />
          <Info v-else-if="toast.type === 'info'" class="w-5 h-5" />
          <AlertTriangle v-else-if="toast.type === 'error'" class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0 pt-0.5">
          <h4 class="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ toast.title }}</h4>
          <p class="text-xs font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed break-words">{{ toast.message }}</p>
        </div>
        <button 
          @click="toast.show = false"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </transition>

    <!-- Top Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <router-link 
          :to="`/franchises/${$route.params.franchiseId}`" 
          class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm transition"
        >
          <ArrowLeft class="w-4 h-4" />
        </router-link>
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase font-semibold">{{ $route.params.franchiseId }}</span>
            <span class="text-slate-400">/</span>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ $route.params.episodeId }}</span>
          </div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Video Production & Compilation Studio</span>
            <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">1080p 16:9</span>
          </h1>
        </div>
      </div>

      <!-- Quick Pipeline Status Pills -->
      <div class="flex items-center space-x-3">
        <button 
          @click="openProgressModal"
          class="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-mono font-semibold flex items-center space-x-1.5 transition cursor-pointer"
        >
          <Activity class="w-3.5 h-3.5" :class="{ 'animate-pulse text-amber-500': modalState.status === 'running' }" />
          <span>Stage Progress Modal</span>
          <span v-if="modalState.status === 'running'" class="px-1.5 py-0.2 text-[10px] rounded bg-purple-600 text-white font-bold">
            {{ modalState.progress }}%
          </span>
        </button>

        <div class="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-sm text-xs font-mono">
          <span class="text-slate-400">Pipeline:</span>
          <span :class="pipeline.imagesReady === pipeline.totalScenes && pipeline.totalScenes > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-500'">
            {{ pipeline.imagesReady }}/{{ pipeline.totalScenes }} Visuals
          </span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span :class="pipeline.hasMasterAudio ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'">
            {{ pipeline.hasMasterAudio ? 'VO & Subtitles Synced' : 'No VO' }}
          </span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span :class="pipeline.hasVideo ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'">
            {{ pipeline.hasVideo ? '1080p Master Ready' : 'Uncompiled' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Stage Navigation Tabs (3 Focused Episodic Stages) -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
      <div class="flex items-center space-x-2">
        <button 
          @click="activeStage = 'visuals'"
          class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer"
          :class="activeStage === 'visuals' 
            ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <Image class="w-4 h-4" />
          <span>Stage 1: Visual Assets & Storyboard ({{ scenes.length }})</span>
        </button>

        <button 
          @click="activeStage = 'audio'"
          class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer"
          :class="activeStage === 'audio' 
            ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <Volume2 class="w-4 h-4" />
          <span>Stage 2: Voiceover & Subtitle Sync</span>
        </button>

        <button 
          @click="activeStage = 'compiler'"
          class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer"
          :class="activeStage === 'compiler' 
            ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <Film class="w-4 h-4" />
          <span>Stage 3: FFmpeg Compilation & Master Cut</span>
          <span v-if="pipeline.hasVideo" class="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      </div>

      <router-link 
        :to="`/franchises/${$route.params.franchiseId}`"
        class="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-mono font-semibold flex items-center space-x-1.5 transition cursor-pointer shrink-0"
      >
        <Youtube class="w-3.5 h-3.5" />
        <span>Open YouTube Launchpad in Series Hub &rarr;</span>
      </router-link>
    </div>

    <!-- STAGE 1: Visual Assets & Storyboard Stills -->
    <div v-if="activeStage === 'visuals'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Scene Visual Prompts & Storyboard Panels</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              16:9 1080p images matched to prompt matrix. Auto-synthesize storyboard panels for testing or drop your own renders.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button 
              @click="runVisualAlignmentValidation()"
              :disabled="isValidatingAlignment"
              class="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-2 transition shadow-md shadow-indigo-950/20 disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck class="w-4 h-4" :class="{ 'animate-pulse': isValidatingAlignment }" />
              <span>{{ isValidatingAlignment ? 'Auditing Alignment...' : '🛡️ Validate Scene Alignment' }}</span>
            </button>

            <button 
              @click="synthesizeAllBatches"
              :disabled="isSynthesizingAll || generatingStoryboards"
              class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-2 transition shadow-md shadow-purple-900/20 disabled:opacity-50 cursor-pointer"
            >
              <Wand2 class="w-4 h-4" :class="{ 'animate-spin': isSynthesizingAll || generatingStoryboards }" />
              <span>{{ isSynthesizingAll ? '⚡ Synthesizing All Batches...' : `⚡ 1-Click Synthesize All (${scenes.length} Panels)` }}</span>
            </button>
          </div>
        </div>

        <!-- Notification Toast -->
        <div v-if="storyboardFeedback" class="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-mono flex items-center justify-between">
          <span>{{ storyboardFeedback }}</span>
          <button @click="storyboardFeedback = ''" class="cursor-pointer">✕</button>
        </div>

        <!-- Character & Item Vault (Google Flow Reference Plates) -->
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center space-x-2.5">
              <div class="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Users class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wide flex items-center space-x-2">
                  <span>Franchise Character & Item Vault</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">
                    {{ characterModels.length }} Reference Plates
                  </span>
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Standardised character DNA, weapons, artifacts & environmental prop plates for instant Alt+Tab Google Flow generation.
                </p>
              </div>
            </div>

            <!-- Category Filter Tabs -->
            <div class="flex flex-wrap items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-mono">
              <button 
                v-for="cat in vaultCategories" 
                :key="cat.key"
                @click="selectedVaultCategory = cat.key"
                class="px-2.5 py-1 rounded-lg transition capitalize cursor-pointer font-medium flex items-center space-x-1"
                :class="selectedVaultCategory === cat.key ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <span>{{ cat.label }}</span>
                <span class="text-[10px] opacity-75">({{ cat.count }})</span>
              </button>
            </div>
          </div>

          <!-- Character & Item Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              v-for="model in filteredCharacterModels" 
              :key="model.id"
              class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition"
            >
              <div class="space-y-2.5">
                <div class="flex items-start justify-between gap-1">
                  <div class="min-w-0 flex-1">
                    <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate" :title="model.name">{{ model.name }}</h4>
                    <span 
                      class="text-xs font-mono px-2 py-0.5 rounded font-bold inline-block mt-0.5 border"
                      :class="getCategoryBadgeClass(model.category)"
                    >
                      {{ model.category }} • {{ model.tier }}
                    </span>
                  </div>
                </div>

                <!-- Model Preview Thumbnail (16:9) -->
                <div class="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative group">
                  <img :src="model.url" :alt="model.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <a 
                      :href="model.url" 
                      target="_blank" 
                      class="p-2 rounded-lg bg-black/70 hover:bg-black text-white backdrop-blur-xs transition"
                      title="View Full Resolution"
                    >
                      <ExternalLink class="w-4 h-4" />
                    </a>
                    <button 
                      @click="downloadModelPlate(model)"
                      class="p-2 rounded-lg bg-black/70 hover:bg-black text-white backdrop-blur-xs transition cursor-pointer"
                      title="Download Image File"
                    >
                      <Download class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Google Flow Setup Name Bar (1-Click Paste for Google Flow Reference Setup) -->
                <div 
                  @click="copyModelName(model)"
                  class="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-purple-500/50 hover:bg-purple-50/20 dark:hover:bg-purple-950/20 transition group"
                  title="Click to copy clean Reference Name (WITHOUT @{}) to paste directly into Google Flow character/object setup"
                >
                  <div class="flex items-center space-x-1.5 min-w-0 flex-1">
                    <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold shrink-0">
                      Flow Name
                    </span>
                    <span class="text-xs font-mono text-slate-700 dark:text-slate-300 truncate font-bold">
                      {{ model.flowName || model.name }}
                    </span>
                  </div>
                  <span 
                    class="text-xs font-mono shrink-0 ml-1 font-bold"
                    :class="copiedVaultId === model.id && copiedVaultType === 'name' ? 'text-emerald-500' : 'text-purple-600 dark:text-purple-400 group-hover:underline'"
                  >
                    {{ copiedVaultId === model.id && copiedVaultType === 'name' ? 'Copied ✓' : 'Copy Name' }}
                  </span>
                </div>

                <!-- Description -->
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {{ model.description }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 gap-1.5">
                <button 
                  @click="downloadModelPlate(model)"
                  class="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold flex items-center space-x-1 transition cursor-pointer"
                  title="Download Master Reference Plate"
                >
                  <Download class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Download</span>
                </button>
                
                <div class="flex items-center space-x-1">
                  <button 
                    @click="copyModelName(model)"
                    class="px-2.5 py-1.5 rounded-lg transition cursor-pointer text-xs font-mono font-bold flex items-center space-x-1"
                    :class="copiedVaultId === model.id && copiedVaultType === 'name' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'"
                    title="Copy Clean Reference Name WITHOUT @{} (for Google Flow Setup)"
                  >
                    <Check v-if="copiedVaultId === model.id && copiedVaultType === 'name'" class="w-3.5 h-3.5" />
                    <Tag v-else class="w-3.5 h-3.5 text-slate-500" />
                    <span>{{ copiedVaultId === model.id && copiedVaultType === 'name' ? 'Copied' : 'Name' }}</span>
                  </button>

                  <button 
                    @click="copyModelToken(model)"
                    class="px-2.5 py-1.5 rounded-lg transition cursor-pointer text-xs font-mono font-bold flex items-center space-x-1"
                    :class="copiedVaultId === model.id && copiedVaultType === 'token' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400'"
                    title="Copy Google Flow Token (@{...})"
                  >
                    <Check v-if="copiedVaultId === model.id && copiedVaultType === 'token'" class="w-3.5 h-3.5" />
                    <Copy v-else class="w-3.5 h-3.5" />
                    <span>{{ copiedVaultId === model.id && copiedVaultType === 'token' ? 'Copied' : 'Token' }}</span>
                  </button>

                  <button 
                    @click="copyModelDna(model)"
                    class="px-2.5 py-1.5 rounded-lg transition cursor-pointer text-xs font-mono font-bold flex items-center space-x-1"
                    :class="copiedVaultId === model.id && copiedVaultType === 'dna' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'"
                    title="Copy Complete Visual DNA Prompt"
                  >
                    <Check v-if="copiedVaultId === model.id && copiedVaultType === 'dna'" class="w-3.5 h-3.5" />
                    <Sparkles v-else class="w-3.5 h-3.5" />
                    <span>{{ copiedVaultId === model.id && copiedVaultType === 'dna' ? 'Copied' : 'DNA' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Google Flow Entity ID Mapper & Token Synchronizer -->
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center space-x-2.5">
              <div class="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Hash class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wide flex items-center space-x-2">
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
                  Map character & item reference names to Google Flow UUIDs (e.g. <code>Caelen Vance - Phantom Marksman: f16555...</code>) to replace <code>@{Name}</code> with <code>@UUID</code> in clipboard XML.
                </p>
              </div>
            </div>

            <!-- Active Output Format Toggle -->
            <div class="flex items-center space-x-1 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-700">
              <span class="text-[10px] font-bold uppercase text-slate-500 px-1.5">Output:</span>
              <button 
                @click="togglePromptTagMode('token')"
                class="px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center space-x-1"
                :class="promptTagMode === 'token' 
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
                title="Use human-readable tokens like @{Caelen Vance - Phantom Marksman}"
              >
                <span>🏷️ @{Token}</span>
              </button>
              <button 
                @click="togglePromptTagMode('uuid')"
                class="px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center space-x-1"
                :class="promptTagMode === 'uuid' 
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
                title="Use Google Flow entity UUIDs like @f16555b2-8ae8-..."
              >
                <span>🔑 @UUID</span>
                <span v-if="entityCount > 0" class="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-black">
                  {{ entityCount }}
                </span>
              </button>
            </div>
          </div>

          <!-- Textarea Input Area -->
          <div class="space-y-2">
            <textarea 
              v-model="entityMapRawText" 
              rows="6"
              placeholder="Character Entities&#10;Caelen Vance - Phantom Marksman: f16555b2-8ae8-40bb-8027-5b8a0c9d859c&#10;...&#10;&#10;Weapon & Item Entities&#10;Weapon: Void-Strung Heavy Recurve: e4b863c6-f8cf-46f4-b5c8-b9ef69dc0893"
              class="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 font-mono text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y shadow-xs"
            ></textarea>
          </div>

          <!-- Action Buttons Bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div class="flex items-center space-x-2">
              <button 
                @click="syncEntityMapping"
                :disabled="isSavingEntityMap || !entityMapRawText.trim()"
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-mono flex items-center space-x-2 transition shadow-md shadow-purple-950/20 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isSavingEntityMap }" />
                <span>{{ isSavingEntityMap ? 'Synchronizing...' : `⚡ Read & Sync Entity IDs (${entityCount} Mapped)` }}</span>
              </button>

              <button 
                v-if="entityCount > 0"
                @click="copyCurrentEntityMapping"
                class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                title="Copy current mapping text to clipboard"
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

        <!-- Prompt Matrix Hub Banner & Universal Asset Ingestion Zone -->
        <div class="space-y-4">
          <!-- 1. Quick Bridge to Visual Prompt Matrix Hub -->
          <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center space-x-3.5">
              <div class="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-950/40">
                <Layers class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Visual Prompt Matrix & Google Flow Batch Hub</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-bold">{{ scenes.length }} Scenes Synchronized</span>
                </h3>
                <p class="text-xs text-slate-300 mt-0.5">
                  Dynamic 24-scene Google Flow partition deck with automatic anti-grid directives and zero-duplicate copy tracking.
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-2 shrink-0">
              <router-link 
                :to="`/prompts/${$route.params.franchiseId}/${$route.params.episodeId}`"
                class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-md shadow-purple-950/40 cursor-pointer"
              >
                <span>Open Prompt Matrix Hub</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </router-link>
            </div>
          </div>

          <!-- Visual QA & Anti-Clutter Telemetry Bar -->
          <div class="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center space-x-3.5">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-bold text-white">Visual QA & Anti-Clutter Verification</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {{ qaAuditReport ? `${qaAuditReport.overallScore}% Verified Clean` : '100% Verified Clean' }}
                  </span>
                </div>
                <p class="text-xs text-slate-300 mt-0.5">
                  Automated OCR verification: zero burned-in filenames, zero top headers, zero Korean glyphs, and zero speech bubbles.
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2.5">
              <div v-if="qaAuditReport" class="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <span class="text-emerald-400 font-bold">✓ {{ qaAuditReport.cleanCount + qaAuditReport.autoCleanedCount }} Clean</span>
                <span v-if="qaAuditReport.warningCount > 0" class="text-amber-400 font-bold">• {{ qaAuditReport.warningCount }} Warning</span>
                <span v-if="qaAuditReport.clutteredCount > 0" class="text-rose-400 font-bold">• {{ qaAuditReport.clutteredCount }} Cluttered</span>
              </div>

              <button 
                @click="openFailedDrawer('all')"
                class="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold flex items-center space-x-1.5 transition border border-purple-500/40 cursor-pointer"
                title="Open drawer to copy prompts for failed, cluttered or missing scenes and replace images"
              >
                <Zap class="w-3.5 h-3.5 text-purple-300" />
                <span>Failed Prompts Drawer</span>
              </button>

              <button 
                @click="runVisualQaAudit(false)"
                :disabled="isValidatingQa"
                class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-700 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isValidatingQa }" />
                <span>{{ isValidatingQa ? 'Scanning OCR...' : 'Run QA Scan' }}</span>
              </button>

              <button 
                @click="runVisualQaAudit(true)"
                :disabled="isValidatingQa"
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Sparkles class="w-3.5 h-3.5 text-emerald-200" />
                <span>Auto-Clean All Plates</span>
              </button>
            </div>
          </div>

          <!-- 2. Master Universal Batch Ingestion Dropzone (All Batches) -->
          <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div 
              @dragover.prevent
              @drop.prevent="handleBatchDrop"
              @click="triggerBatchUpload"
              class="p-8 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-500/40 hover:border-purple-500 bg-purple-50/30 dark:bg-purple-950/10 text-center space-y-3.5 transition cursor-pointer group hover:shadow-inner"
            >
              <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-xs group-hover:scale-110 transition">
                <Archive v-if="batchUploading" class="w-6 h-6 animate-spin" />
                <FolderDown v-else class="w-6 h-6" />
              </div>

              <div>
                <div class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                  {{ batchUploading ? 'Processing & Ingesting Visual Assets...' : 'Universal Master Visual Ingest Dropzone (All Batches)' }}
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-1">
                  <strong>Click anywhere to browse files</strong>, or drag & drop a <strong>.ZIP archive</strong>, folder, or images directly here.
                </p>
              </div>

              <!-- Ingestion Action Buttons -->
              <div class="flex flex-wrap items-center justify-center gap-2.5 pt-1" @click.stop>
                <button 
                  @click="triggerZipUpload"
                  :disabled="batchUploading"
                  class="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Archive class="w-3.5 h-3.5" />
                  <span>Upload .ZIP Archive</span>
                </button>

                <button 
                  @click="triggerFolderUpload"
                  :disabled="batchUploading"
                  class="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <FolderOpen class="w-3.5 h-3.5 text-purple-500" />
                  <span>Upload Folder</span>
                </button>

                <button 
                  @click="triggerBatchUpload"
                  :disabled="batchUploading"
                  class="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <Image class="w-3.5 h-3.5 text-indigo-500" />
                  <span>Select Image Files</span>
                </button>
              </div>

              <!-- Hidden Inputs -->
              <input 
                ref="zipFileInput" 
                type="file" 
                accept=".zip,application/zip,application/x-zip-compressed" 
                class="hidden" 
                @change="handleZipFileInput" 
              />
              <input 
                ref="folderFileInput" 
                type="file" 
                webkitdirectory 
                directory 
                multiple 
                class="hidden" 
                @change="handleFolderFileInput" 
              />
              <input 
                ref="batchFileInput" 
                type="file" 
                multiple 
                accept="image/*" 
                class="hidden" 
                @change="handleBatchFileInput" 
              />
              <input 
                ref="batchScopedFileInput" 
                type="file" 
                multiple 
                accept="image/*,.zip,application/zip,application/x-zip-compressed" 
                class="hidden" 
                @change="handleBatchScopedFileInput" 
              />
            </div>

            <!-- Ingest Feedback Toast -->
            <div v-if="batchUploadFeedback" class="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-mono flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Check class="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{{ batchUploadFeedback }}</span>
              </div>
              <button @click="batchUploadFeedback = ''" class="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>
          </div>
        </div>

        <!-- BATCH ACCORDIONS DECK -->
        <div class="space-y-4 pt-2">
          <div class="flex items-center justify-between pb-1">
            <h3 class="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Batch Production Deck ({{ batchedScenes.length }} Batches • 24 Cuts / Batch)
            </h3>
            <button 
              @click="toggleAllBatches"
              class="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              {{ areAllBatchesExpanded ? 'Collapse All Batches' : 'Expand All Batches' }}
            </button>
          </div>

          <div 
            v-for="batch in batchedScenes" 
            :key="batch.index"
            class="rounded-2xl border transition-all overflow-hidden"
            :class="batch.isFullyReady 
              ? 'border-emerald-500/30 bg-white dark:bg-slate-900 shadow-sm' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'"
          >
            <!-- Accordion Header -->
            <div 
              class="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none transition-colors"
              :class="expandedBatches[batch.index] ? 'bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'"
              @click="toggleBatch(batch.index)"
            >
              <div class="flex items-center space-x-3.5">
                <button class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
                  <ChevronDown v-if="expandedBatches[batch.index]" class="w-4 h-4" />
                  <ChevronRight v-else class="w-4 h-4" />
                </button>
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-base font-bold text-slate-900 dark:text-white">{{ batch.label }}</span>
                    
                    <!-- Panels Loaded Readiness Badge -->
                    <span 
                      class="text-xs font-mono font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5"
                      :class="batch.isFullyReady 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'"
                    >
                      <span v-if="batch.isFullyReady">✓ {{ batch.readyCount }}/{{ batch.totalCount }} Panels Loaded</span>
                      <span v-else>{{ batch.readyCount }}/{{ batch.totalCount }} Loaded ({{ batch.missingCount }} Missing)</span>
                    </span>

                    <!-- Batch Visual QA Health Badge -->
                    <span 
                      v-if="qaAuditReport"
                      class="text-xs font-mono font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5"
                      :class="batch.isFullyClean
                        ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                        : (batch.clutteredCount > 0 
                          ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : (batch.warningCount > 0 
                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'))"
                    >
                      <ShieldCheck v-if="batch.isFullyClean" class="w-3.5 h-3.5 text-teal-500" />
                      <AlertTriangle v-else-if="batch.clutteredCount > 0" class="w-3.5 h-3.5 text-rose-500" />
                      <AlertCircle v-else-if="batch.warningCount > 0" class="w-3.5 h-3.5 text-amber-500" />
                      <Info v-else class="w-3.5 h-3.5 text-slate-400" />
                      <span v-if="batch.isFullyClean">100% QA Clean</span>
                      <span v-else-if="batch.clutteredCount > 0">{{ batch.clutteredCount }} Cluttered</span>
                      <span v-else-if="batch.warningCount > 0">{{ batch.warningCount }} Fixable</span>
                      <span v-else>{{ batch.cleanCount }}/{{ batch.readyCount }} Clean</span>
                    </span>

                    <!-- Google Flow Required References Badge (N/10 Limit Tracker) -->
                    <span 
                      class="text-xs font-mono font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5 border"
                      :class="batch.refCount > 10 
                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' 
                        : (batch.refCount > 7 
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                          : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30')"
                    >
                      <Users class="w-3.5 h-3.5 text-purple-500" />
                      <span>{{ batch.refCount }}/10 Flow Refs</span>
                    </span>
                  </div>

                  <div class="flex items-center space-x-3 mt-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span>Range: <strong>{{ batch.startTag }}</strong> → <strong>{{ batch.endTag }}</strong></span>
                  </div>
                </div>
              </div>

              <!-- Quick Batch Action Buttons -->
              <div class="flex flex-wrap items-center gap-2" @click.stop>
                <!-- 1-Click Render Batch Preview Video Button -->
                <button 
                  @click="compileBatchDirect(batch.index)"
                  :disabled="compiling"
                  class="px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                  :title="`1-Click Render ${batch.name} Preview Video`"
                >
                  <Film class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{{ `🎬 Render ${batch.name}` }}</span>
                </button>

                <!-- Fix / Copy Failed Prompts for this Batch Button -->
                <button 
                  v-if="batch.failedCount > 0"
                  @click="openFailedDrawer(batch.index)"
                  class="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                  :title="`Open drawer to copy failed prompts & replace images for ${batch.name}`"
                >
                  <Zap class="w-3.5 h-3.5 text-amber-500" />
                  <span>{{ `⚡ Fix ${batch.name} (${batch.failedCount})` }}</span>
                </button>

                <!-- 1-Click Validate Alignment for this Batch -->
                <button 
                  @click="runVisualAlignmentValidation(batch.index)"
                  :disabled="isValidatingAlignment"
                  class="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                  :title="`Validate scene alignment strictly for ${batch.name}`"
                >
                  <ShieldCheck class="w-3.5 h-3.5" />
                  <span>{{ `🔍 Validate ${batch.name}` }}</span>
                </button>
              </div>
            </div>

            <!-- Accordion Content (Expanded) -->
            <div v-if="expandedBatches[batch.index]" class="p-6 space-y-6">
              <!-- Required Vault References Hub (Google Flow 10-Ref Limit Tracker) -->
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center space-x-2">
                    <div class="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Users class="w-4 h-4" />
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>Required References for {{ batch.name }}</span>
                        <span 
                          class="text-xs font-mono px-2.5 py-0.5 rounded-full font-bold border"
                          :class="batch.refCount > 10 
                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' 
                            : (batch.refCount > 7 
                              ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                              : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30')"
                        >
                          {{ batch.refCount }}/10 Flow Slots Used
                        </span>
                      </h4>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Attach these reference plates into Google Flow when generating scenes {{ batch.startTag }}–{{ batch.endTag }}.
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center space-x-2">
                    <button 
                      v-if="batch.refCount > 0"
                      @click="copyAllBatchTokens(batch.references, batch.name)"
                      class="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 transition cursor-pointer"
                      title="Copy all tokens in this batch comma-separated"
                    >
                      <Check v-if="copiedVaultId === batch.name && copiedVaultType === 'batch_tokens'" class="w-3.5 h-3.5 text-emerald-500" />
                      <Copy v-else class="w-3.5 h-3.5" />
                      <span>{{ copiedVaultId === batch.name && copiedVaultType === 'batch_tokens' ? 'Tokens Copied' : 'Copy All Batch Tokens' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Reference Chips Grid -->
                <div v-if="batch.refCount > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
                  <div 
                    v-for="model in batch.references" 
                    :key="model.id || model.name"
                    class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-2xs hover:border-purple-500/40 transition group"
                  >
                    <div class="flex items-center space-x-2.5 min-w-0">
                      <!-- Thumbnail -->
                      <div class="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800 relative">
                        <img v-if="model.url && model.hasPlate" :src="model.url" :alt="model.name" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
                          {{ (model.name || 'R')[0] }}
                        </div>
                      </div>

                      <div class="min-w-0 flex-1">
                        <div class="text-xs font-mono font-bold text-slate-900 dark:text-white truncate" :title="model.name">
                          {{ model.flowName || model.name }}
                        </div>
                        <span 
                          class="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold inline-block border mt-0.5"
                          :class="getCategoryBadgeClass(model.category)"
                        >
                          {{ model.category }}
                        </span>
                      </div>
                    </div>

                    <!-- Quick Action Icons -->
                    <div class="flex items-center space-x-1 shrink-0">
                      <button 
                        @click.stop="downloadModelPlate(model)"
                        class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition cursor-pointer"
                        title="Download Reference Plate"
                      >
                        <Download class="w-3.5 h-3.5" />
                      </button>
                      <button 
                        @click.stop="copyModelToken(model)"
                        class="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 text-xs transition cursor-pointer"
                        :title="`Copy Token '${model.token || model.name}'`"
                      >
                        <Check v-if="copiedVaultId === model.id && copiedVaultType === 'token'" class="w-3.5 h-3.5 text-emerald-500" />
                        <Copy v-else class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="text-xs font-mono text-slate-400 italic">
                  No character/item references tagged in this batch.
                </div>

                <!-- Over Limit Alert -->
                <div v-if="batch.refCount > 10" class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold">
                  <AlertTriangle class="w-4 h-4 shrink-0 text-rose-500" />
                  <span>Google Flow Limit Warning: This batch has {{ batch.refCount }} references, which exceeds the 10-reference maximum. Ensure unused references are detached before generating.</span>
                </div>
              </div>

              <!-- Batch-Scoped Dropzone -->
              <div 
                @dragover.prevent
                @drop.prevent="handleBatchScopedDrop($event, batch.index)"
                @click="triggerBatchScopedUpload(batch.index)"
                class="p-6 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-500/30 hover:border-purple-500 bg-purple-50/20 hover:bg-purple-50/40 dark:bg-purple-950/10 dark:hover:bg-purple-950/20 text-center space-y-2 transition cursor-pointer group relative overflow-hidden"
              >
                <div v-if="batchActionState[batch.index]?.isIngesting" class="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center space-x-2 text-white z-10">
                  <Loader2 class="w-5 h-5 text-purple-400 animate-spin" />
                  <span class="text-xs font-mono font-bold">Ingesting and mapping {{ batch.name }} panels...</span>
                </div>

                <div class="flex items-center justify-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                  <FolderDown class="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition" />
                  <span>Dropzone for {{ batch.name }} ({{ batch.startTag }} – {{ batch.endTag }})</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  <strong>Click to browse files</strong> or drag & drop images / ZIP archive here. All files will be strictly mapped within {{ batch.name }} scenes.
                </p>
              </div>

              <!-- 24-Scene Grid for this Batch -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="scene in batch.scenes" 
                  :key="scene.tag"
                  class="rounded-xl border bg-slate-50 dark:bg-slate-950/40 p-4 space-y-3 relative group transition-all overflow-hidden"
                  :class="scene.hasImage 
                    ? (scene.qa?.status === 'cluttered' 
                      ? 'border-rose-300 dark:border-rose-500/40' 
                      : (scene.qa?.status === 'warning' ? 'border-amber-300 dark:border-amber-500/40' : 'border-slate-200 dark:border-slate-800')) 
                    : 'border-dashed border-slate-300 dark:border-slate-700'"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop($event, scene.tag)"
                >
                  <!-- Active Card Upload Loading Overlay -->
                  <div 
                    v-if="uploadingCardTags.has(scene.tag)" 
                    class="absolute inset-0 bg-slate-950/85 backdrop-blur-xs rounded-xl z-20 flex flex-col items-center justify-center space-y-2 p-4 text-center"
                  >
                    <Loader2 class="w-6 h-6 text-purple-400 animate-spin" />
                    <span class="text-sm font-mono font-bold text-white">Uploading [{{ scene.tag }}]...</span>
                    <span class="text-xs font-mono text-purple-300">Assigning image & verifying QA...</span>
                  </div>

                  <!-- Card Header -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-1.5">
                      <span class="text-sm font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                        [{{ scene.tag }}]
                      </span>
                      <!-- QA Status Mini-Badge -->
                      <span 
                        v-if="scene.qa"
                        class="text-xs font-mono px-2 py-0.5 rounded-md font-bold flex items-center space-x-1"
                        :class="{
                          'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30': scene.qa.status === 'clean' || scene.qa.status === 'auto_cleaned',
                          'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30': scene.qa.status === 'warning',
                          'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30': scene.qa.status === 'cluttered'
                        }"
                        :title="scene.qa.issues?.length ? scene.qa.issues.join(' | ') : 'QA Verified Clean'"
                      >
                        <Check v-if="scene.qa.status === 'clean' || scene.qa.status === 'auto_cleaned'" class="w-3.5 h-3.5 text-emerald-500" />
                        <AlertTriangle v-else-if="scene.qa.status === 'warning'" class="w-3.5 h-3.5 text-amber-500" />
                        <AlertCircle v-else class="w-3.5 h-3.5 text-rose-500" />
                        <span>{{ scene.qa.status === 'clean' || scene.qa.status === 'auto_cleaned' ? 'Clean' : (scene.qa.status === 'warning' ? 'Warning' : 'Cluttered') }}</span>
                      </span>
                    </div>

                    <div class="flex items-center space-x-1.5">
                      <button 
                        @click="copySingleScenePrompt(scene)" 
                        class="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-purple-600 hover:text-white text-slate-600 dark:text-slate-400 text-xs font-mono transition cursor-pointer"
                        title="Copy XML Scene Prompt"
                      >
                        <Copy class="w-3.5 h-3.5" />
                      </button>
                      <span class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">{{ scene.act ? scene.act.split(':')[0] : 'Scene' }}</span>
                    </div>
                  </div>

                  <!-- Image Preview or Placeholder -->
                  <div class="aspect-video w-full rounded-lg overflow-hidden bg-slate-900/80 border border-slate-200 dark:border-slate-800 relative flex items-center justify-center">
                    <img 
                      v-if="scene.hasImage" 
                      :src="`${scene.url}?t=${cacheBuster}`" 
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      :alt="scene.tag"
                    />
                    <div v-else class="text-center p-4 space-y-2">
                      <Image class="w-7 h-7 mx-auto text-slate-600" />
                      <div class="text-xs font-mono text-slate-400">No Image Rendered</div>
                      <div class="text-[11px] text-slate-500">Drag & drop PNG/JPG here</div>
                    </div>

                    <!-- Upload Overlay on Hover -->
                    <label class="absolute inset-0 bg-slate-900/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition cursor-pointer">
                      <Upload class="w-6 h-6 text-white mb-1" />
                      <span class="text-xs font-semibold text-white">Replace Image</span>
                      <input type="file" accept="image/*" class="hidden" @change="handleFileInput($event, scene.tag)" />
                    </label>
                  </div>

                  <!-- Scene Info -->
                  <div>
                    <div class="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{{ scene.description }}</div>
                    <p class="text-xs font-mono text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mt-1">{{ scene.prompt }}</p>
                  </div>

                  <!-- Scene Character & Item Reference Chips -->
                  <div v-if="getSceneReferences(scene.prompt).length > 0" class="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div 
                      v-for="refItem in getSceneReferences(scene.prompt)"
                      :key="refItem.id || refItem.name"
                      @click.stop="copyModelToken(refItem)"
                      class="inline-flex items-center space-x-1.5 pl-1.5 pr-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:bg-purple-50/20 text-xs font-mono transition cursor-pointer shadow-2xs group/chip"
                      :title="`Click to copy token '${refItem.token || refItem.name}'`"
                    >
                      <div class="w-5 h-5 rounded overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700">
                        <img v-if="refItem.url && refItem.hasPlate" :src="refItem.url" :alt="refItem.name" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase">
                          {{ (refItem.name || 'R')[0] }}
                        </div>
                      </div>
                      <span class="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{{ refItem.flowName || refItem.name }}</span>
                      <span class="text-[10px] px-1.5 py-0.5 rounded font-bold border" :class="getCategoryBadgeClass(refItem.category)">{{ refItem.category }}</span>
                      <Copy class="w-3 h-3 text-slate-400 group-hover/chip:text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- STAGE 2: Voiceover & Subtitle Sync -->
    <div v-if="activeStage === 'audio'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Radio class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Voiceover Synthesis & Subtitle Synchronization</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Generates neural speech and captures millisecond sentence boundaries directly into .srt & .vtt files.
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <select 
              v-model="selectedVoice"
              class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 shadow-sm"
            >
              <option value="en-US-ChristopherNeural">Christopher (US - Deep Narrative)</option>
              <option value="en-GB-RyanNeural">Ryan (UK - Clear Authoritative)</option>
              <option value="en-US-EricNeural">Eric (US - Intense Action)</option>
              <option value="en-US-GuyNeural">Guy (US - Dramatic Male)</option>
            </select>

            <button 
              @click="generateVoiceoverAndSubtitles"
              :disabled="synthesizingAudio"
              class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-md shadow-purple-900/20 disabled:opacity-50 cursor-pointer"
            >
              <Volume2 class="w-4 h-4" :class="{ 'animate-pulse': synthesizingAudio }" />
              <span>{{ synthesizingAudio ? 'Synthesizing Voice & Subtitles...' : 'Sync Voice & Subtitles (Edge-TTS)' }}</span>
            </button>
          </div>
        </div>

        <!-- Master Audio Player Card -->
        <div v-if="pipeline.hasMasterAudio" class="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center space-x-2">
              <CheckCircle class="w-4 h-4 text-emerald-500" />
              <span>Master Voiceover Audio Track Ready</span>
            </div>
            <div class="text-[11px] font-mono text-purple-700 dark:text-purple-300">
              audio/01_Episode_Master.mp3 • 48kbps Mono MP3
            </div>
          </div>
          <audio 
            ref="masterAudioPlayer"
            controls 
            preload="metadata"
            class="w-full md:w-96 h-9 rounded-lg"
            :src="`/api/audio/${$route.params.franchiseId}/${$route.params.episodeId}/01_Episode_Master.mp3`"
          ></audio>
        </div>

        <!-- Interactive Subtitle Timeline -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Synchronized Subtitles Preview (SRT / VTT)
            </h3>
            <div class="flex items-center space-x-2" v-if="subtitles.hasSubtitles">
              <a 
                :href="`/api/episodes/${$route.params.franchiseId}/${$route.params.episodeId}/subtitles/01_Episode_Subtitles.srt`" 
                download
                class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-mono transition"
              >
                Download .SRT
              </a>
              <a 
                :href="`/api/episodes/${$route.params.franchiseId}/${$route.params.episodeId}/subtitles/01_Episode_Subtitles.vtt`" 
                download
                class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-mono transition"
              >
                Download .VTT
              </a>
            </div>
          </div>

          <div v-if="!subtitles.hasSubtitles" class="p-8 text-center text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
            No subtitles generated yet. Click "Sync Voice & Subtitles" above to extract timed sentence boundaries.
          </div>

          <div v-else class="max-h-96 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 space-y-2">
            <div 
              v-for="(sub, idx) in parsedSubtitles" 
              :key="idx"
              @click="seekAudio(sub.startSeconds)"
              class="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/50 flex items-start space-x-3 cursor-pointer transition"
            >
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold shrink-0">
                {{ sub.timecode }}
              </span>
              <p class="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed">{{ sub.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- STAGE 3: FFmpeg Compilation & Master Cut -->
    <div v-if="activeStage === 'compiler'" class="space-y-6">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Film class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>FFmpeg 1080p Video Compilation</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Stitches 16:9 scene visuals with subtle Ken Burns motion, synchronized voiceover audio, and burned-in subtitles.
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Strategy Selector (Visible in Auto Mode) -->
            <select 
              v-if="compilationScope === 'auto'"
              v-model="autoCompileStrategy"
              class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:border-purple-500 shadow-sm cursor-pointer"
            >
              <option value="skip_compiled">⚡ Skip Compiled Batches</option>
              <option value="fresh_all">🔄 Fresh All Batches</option>
            </select>

            <!-- Dynamic Primary Action Button -->
            <button 
              @click="triggerCompilation()"
              :disabled="compiling"
              class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-purple-900/30 disabled:opacity-50 cursor-pointer"
            >
              <Play class="w-4 h-4 fill-current" :class="{ 'animate-spin': compiling }" />
              <span v-if="compiling">Processing {{ compilationScope === 'auto' ? 'Automated Batch Queue' : (compilationScope === 'batch' ? (currentSelectedBatch?.name || 'Batch') : (compilationScope === 'stitch' ? 'Batch Stitcher' : 'Master Video')) }}...</span>
              <span v-else-if="compilationScope === 'auto'">{{ autoCompileStrategy === 'skip_compiled' ? '⚡ Auto-Compile (Skip Ready & Stitch)' : '🔄 Auto-Compile (Fresh All 9 Batches & Stitch)' }}</span>
              <span v-else-if="compilationScope === 'batch'">Compile {{ currentSelectedBatch?.name || 'Batch A' }} Preview ({{ currentSelectedBatch?.totalCount || 24 }} Cuts)</span>
              <span v-else-if="compilationScope === 'stitch'">🔗 Stitch {{ compiledBatchesCount }} Compiled Batches into Master (Instant &lt;3s)</span>
              <span v-else>Compile Monolithic Master Video ({{ scenes.length }} Cuts)</span>
            </button>
          </div>
        </div>

        <!-- Compilation Scope & Target Mode Selector Card -->
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center space-x-2">
              <div class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Layers class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wide">
                  Compilation Mode & Master Assembly
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Select automated queue compilation, isolated single-batch testing (~25s), or instant lossless stitching (&lt;3s).
                </p>
              </div>
            </div>

            <!-- Scope Mode Switcher Pills -->
            <div class="flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-300 dark:border-slate-700 flex-wrap gap-1">
              <button 
                @click="compilationScope = 'auto'"
                class="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center space-x-1.5"
                :class="compilationScope === 'auto' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <Zap class="w-3.5 h-3.5 text-amber-300" />
                <span>⚡ Auto-Queue & Stitch</span>
              </button>

              <button 
                @click="compilationScope = 'batch'"
                class="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center space-x-1.5"
                :class="compilationScope === 'batch' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <Layers class="w-3.5 h-3.5 text-purple-300" />
                <span>📦 Grouped Batches ({{ selectedBatchIndices.length }})</span>
              </button>

              <button 
                @click="compilationScope = 'stitch'"
                class="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center space-x-1.5"
                :class="compilationScope === 'stitch' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <Film class="w-3.5 h-3.5 text-emerald-300" />
                <span>🔗 Stitch Batches (&lt;2s)</span>
              </button>

              <button 
                @click="compilationScope = 'omnibus'"
                class="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center space-x-1.5"
                :class="compilationScope === 'omnibus' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <Sparkles class="w-3.5 h-3.5 text-amber-300" />
                <span>🏆 Master Omnibus</span>
              </button>
            </div>
          </div>

          <!-- Mode 1: Auto-Queue & Stitch Explainer -->
          <div v-if="compilationScope === 'auto'" class="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckCircle class="w-4 h-4 text-emerald-500" />
                <span>Automated Sequential Pipeline Architecture (24 FPS)</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                Compiles Batch A &rarr; flushes memory &rarr; compiles Batch B &rarr; ... &rarr; Batch I (6 parallel threads @ 24fps), then automatically losslessly stitches all batches into <code class="text-purple-600 dark:text-purple-400 font-mono">01_Episode_Master_Batches_A-I_1080p.mp4</code> in &lt;2s.
              </p>
            </div>

            <div class="flex items-center space-x-2 shrink-0">
              <select 
                v-model="autoCompileStrategy"
                class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:border-purple-500 shadow-sm cursor-pointer"
              >
                <option value="skip_compiled">⚡ Skip Compiled (Fast)</option>
                <option value="fresh_all">🔄 Fresh All (Overwrite)</option>
              </select>

              <button 
                @click="triggerCompilation()"
                :disabled="compiling"
                class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shrink-0 shadow-md shadow-purple-900/20 cursor-pointer disabled:opacity-50"
              >
                <Zap class="w-3.5 h-3.5 text-amber-300" />
                <span>{{ autoCompileStrategy === 'skip_compiled' ? 'Start Queue (Skip Ready)' : 'Start Queue (Fresh All)' }}</span>
              </button>
            </div>
          </div>

          <!-- Mode 2: Custom Grouped Batch Checkbox Matrix -->
          <div v-if="compilationScope === 'batch'" class="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-4">
            <!-- Header & Action Helpers -->
            <div class="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div class="flex items-center space-x-2">
                <span class="text-xs font-bold text-slate-900 dark:text-white">Selected Batches:</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {{ selectedBatchIndices.length }} of {{ batchedScenes.length }} Batches
                </span>
                <span class="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  (Descriptor: <code class="text-purple-600 dark:text-purple-400 font-bold">{{ groupedBatchDescriptor }}</code>)
                </span>
              </div>

              <!-- Quick Action Presets -->
              <div class="flex items-center space-x-2">
                <button 
                  @click="selectMissingBatchesOnly()"
                  class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  ⚡ Select Missing Only
                </button>
                <button 
                  @click="selectAllBatches()"
                  class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Select All
                </button>
                <button 
                  @click="deselectAllBatches()"
                  class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <!-- Batch Checkbox Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <div 
                v-for="b in batchedScenes" 
                :key="b.index"
                @click="toggleBatchSelection(b.index)"
                class="p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 select-none relative"
                :class="selectedBatchIndices.includes(b.index)
                  ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/30 ring-1 ring-purple-600 shadow-sm' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/40 opacity-70'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      :checked="selectedBatchIndices.includes(b.index)"
                      @click.stop="toggleBatchSelection(b.index)"
                      class="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                    />
                    <span class="text-xs font-bold text-slate-900 dark:text-white">{{ b.name }}</span>
                  </div>
                  <span v-if="b.hasVideo" class="px-1.5 py-0.5 text-[9px] rounded font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">✓ MP4</span>
                  <span v-else class="text-[9px] font-mono text-slate-400">⏳ Pending</span>
                </div>

                <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {{ b.startTag }} &rarr; {{ b.endTag }}
                </div>

                <div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-mono">
                  <span :class="b.isFullyReady ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-500'">
                    {{ b.readyCount }}/{{ b.totalCount }} Loaded
                  </span>
                  <span class="text-slate-400">24 Cuts</span>
                </div>
              </div>
            </div>

            <!-- Grouped Action Footer -->
            <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label class="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  v-model="autoStitchGrouped"
                  class="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                />
                <span class="font-semibold">Auto-stitch selected batches into <code class="text-purple-600 dark:text-purple-400 font-mono">01_Episode_Master_{{ groupedBatchDescriptor }}_1080p.mp4</code></span>
              </label>

              <button 
                @click="compileGroupedBatchesAction()"
                :disabled="compiling || selectedBatchIndices.length === 0"
                class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-purple-900/30 cursor-pointer disabled:opacity-50"
              >
                <Play class="w-4 h-4 fill-current" />
                <span>Compile {{ selectedBatchIndices.length }} Selected Batches (24 FPS)</span>
              </button>
            </div>
          </div>

          <!-- Mode 3: Batch Stitcher Hub (Visible when compilationScope === 'stitch') -->
          <div v-if="compilationScope === 'stitch'" class="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="space-y-0.5">
                <div class="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Film class="w-4 h-4 text-emerald-500" />
                  <span>Lossless Batch Assembly Stitcher (FFmpeg -c copy)</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Instantly merges all compiled batch preview videos on disk in under 2 seconds into <code class="text-purple-600 dark:text-purple-400 font-mono">01_Episode_Master_Batches_A-I_1080p.mp4</code>.
                </p>
              </div>

              <div class="flex items-center space-x-3">
                <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-full" :class="compiledBatchesCount > 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'">
                  {{ compiledBatchesCount }} of {{ batchedScenes.length }} Batches Compiled on Disk
                </span>
                <button 
                  @click="stitchBatches()"
                  :disabled="compiling || compiledBatchesCount === 0"
                  class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-emerald-900/20 cursor-pointer disabled:opacity-50"
                >
                  <Film class="w-3.5 h-3.5" />
                  <span>Stitch {{ compiledBatchesCount }} Batches Now</span>
                </button>
              </div>
            </div>

            <!-- Stitched Batch Badges -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <div 
                v-for="b in batchedScenes" 
                :key="b.index"
                class="px-3 py-1.5 rounded-xl border flex items-center space-x-2 text-xs font-mono"
                :class="b.hasVideo 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400'"
              >
                <span class="font-bold">{{ b.name }}</span>
                <span v-if="b.hasVideo" class="text-[10px] text-emerald-500">✓ Ready</span>
                <span v-else class="text-[10px] text-slate-500">⏳ Uncompiled</span>
              </div>
            </div>
          </div>

          <!-- Mode 4: Multi-Master & Episode Omnibus Stitcher -->
          <div v-if="compilationScope === 'omnibus'" class="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-4">
            <div class="space-y-1">
              <div class="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Sparkles class="w-4 h-4 text-amber-500" />
                <span>Multi-Master Video Extension & Season Omnibus Studio</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                Losslessly concatenate multiple Master Videos (e.g. Part 1: Batches A–I + Part 2: Batches J–P or Episode 1 + Episode 2 + Episode 3) into an extended Grand Omnibus in &lt;5 seconds.
              </p>
            </div>

            <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span>Select Master Video Files to Merge:</span>
                <span class="font-mono text-purple-600 dark:text-purple-400">{{ selectedOmnibusFiles.length }} Selected</span>
              </div>

              <!-- Available Master Videos List -->
              <div class="space-y-2">
                <div 
                  v-for="vf in videoFiles.filter(f => f.isMaster || f.filename.includes('Master'))" 
                  :key="vf.filename"
                  class="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-mono"
                >
                  <label class="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      :value="vf.filename" 
                      v-model="selectedOmnibusFiles"
                      class="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                    />
                    <span class="font-bold text-slate-800 dark:text-slate-200">{{ vf.label }}</span>
                  </label>
                  <span class="text-slate-400 text-[11px]">({{ (vf.size / (1024 * 1024)).toFixed(1) }} MB)</span>
                </div>
              </div>

              <!-- Output Filename & Stitch Action -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div class="flex items-center space-x-2 w-full md:w-auto">
                  <span class="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">Omnibus Filename:</span>
                  <input 
                    type="text" 
                    v-model="omnibusOutputName"
                    class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 w-72"
                  />
                </div>

                <button 
                  @click="stitchOmnibusAction()"
                  :disabled="compiling || selectedOmnibusFiles.length < 2"
                  class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-purple-900/20 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles class="w-3.5 h-3.5" />
                  <span>Stitch {{ selectedOmnibusFiles.length }} Masters into Omnibus (&lt;5s)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- BGM Soundscape & Audio Ducking Configuration Card -->
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center space-x-2">
              <div class="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Music class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wide">
                  Background Music & Dynamic Sidechain Ducking
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Select a royalty-free soundscape. FFmpeg will automatically duck music by -6 dB during vocal narration.
                </p>
              </div>
            </div>

            <!-- Ducking Status Badge -->
            <div v-if="selectedBgmTrack !== 'none'" class="flex items-center space-x-2 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
              <Radio class="w-3 h-3 animate-pulse" />
              <span>Sidechain Ducking Active (-6 dB)</span>
            </div>
            <div v-else class="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              Acapella VO Only (No BGM)
            </div>
          </div>

          <!-- BGM Track Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <!-- No BGM Option -->
            <div 
              @click="selectBgmTrack('none')"
              :class="selectedBgmTrack === 'none' 
                ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 ring-1 ring-purple-600' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/50'"
              class="p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <VolumeX class="w-4 h-4 text-slate-400" />
                  <span class="text-xs font-bold text-slate-900 dark:text-white">None (Voiceover Only)</span>
                </div>
                <div v-if="selectedBgmTrack === 'none'" class="w-2 h-2 rounded-full bg-purple-600"></div>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                Pristine isolated narration without background music.
              </p>
            </div>

            <!-- Dynamic Tracks -->
            <div 
              v-for="track in bgmTracks" 
              :key="track.id"
              @click="selectBgmTrack(track.filename)"
              :class="selectedBgmTrack === track.filename 
                ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 ring-1 ring-purple-600' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/50'"
              class="p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2"
            >
              <div>
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center space-x-2 truncate">
                    <Music class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ track.title }}</span>
                  </div>
                  <div v-if="selectedBgmTrack === track.filename" class="w-2 h-2 rounded-full bg-purple-600 shrink-0"></div>
                </div>
                <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 font-medium inline-block mt-1">
                  {{ track.mood }}
                </span>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {{ track.desc }}
                </p>
              </div>

              <!-- Inline Preview Controller -->
              <div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80" @click.stop>
                <button 
                  @click="togglePreviewBgm(track)"
                  class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-300 text-[10px] font-mono font-semibold flex items-center space-x-1.5 transition"
                >
                  <component :is="activePreviewTrack === track.filename ? Pause : Play" class="w-3 h-3 fill-current" />
                  <span>{{ activePreviewTrack === track.filename ? 'Pause' : 'Preview' }}</span>
                </button>
                <span class="text-[10px] font-mono text-slate-400">120s Loop</span>
              </div>
            </div>
          </div>

          <!-- Volume & Ducking Tuning Slider (Visible when track is selected) -->
          <div v-if="selectedBgmTrack !== 'none'" class="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center space-x-3 w-full md:w-auto">
              <Sliders class="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <div class="space-y-0.5">
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">Resting BGM Level:</span>
                  <span class="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">{{ selectedBgmVolume }} dB</span>
                </div>
                <span class="text-[10px] text-slate-400">Standard broadcast resting range is -24 dB to -20 dB</span>
              </div>
            </div>

            <div class="flex items-center space-x-3 w-full md:w-72">
              <span class="text-[10px] font-mono text-slate-400">-36dB</span>
              <input 
                type="range" 
                min="-36" 
                max="-12" 
                step="1"
                v-model.number="selectedBgmVolume" 
                class="w-full accent-purple-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span class="text-[10px] font-mono text-slate-400">-12dB</span>
            </div>
          </div>
        </div>

        <!-- Brand Watermark & Channel Identity Overlay Card -->
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center space-x-2">
              <div class="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <ShieldCheck class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wide flex items-center space-x-2">
                  <span>Brand Watermark & Channel Identity Overlay</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">
                    Recap Runic Medallion
                  </span>
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Burns the transparent circular Recap Runic logo into compiled video cuts to protect intellectual property and establish channel branding.
                </p>
              </div>
            </div>

            <!-- Toggle Switch -->
            <label class="flex items-center space-x-2.5 cursor-pointer select-none bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <input 
                type="checkbox" 
                v-model="burnWatermark"
                class="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
              />
              <span class="text-xs font-bold font-mono" :class="burnWatermark ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500'">
                {{ burnWatermark ? '✓ Watermark Enabled' : 'Watermark Disabled' }}
              </span>
            </label>
          </div>

          <div v-if="burnWatermark" class="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <!-- Left: Placement Options -->
            <div class="space-y-3 lg:col-span-2">
              <div class="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                Watermark Screen Placement:
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <div 
                  v-for="pos in watermarkPositions" 
                  :key="pos.id"
                  @click="watermarkPosition = pos.id"
                  class="p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-1.5"
                  :class="watermarkPosition === pos.id 
                    ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 ring-1 ring-purple-600 shadow-xs' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/40'"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900 dark:text-white">{{ pos.label }}</span>
                    <span v-if="watermarkPosition === pos.id" class="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
                  </div>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {{ pos.desc }}
                  </p>
                  <div class="text-[9px] font-mono text-purple-600 dark:text-purple-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    {{ pos.xDesc }} • {{ pos.yDesc }}
                  </div>
                </div>
              </div>

              <!-- Opacity Selector -->
              <div class="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div class="space-y-0.5">
                  <span class="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">Logo Opacity Level:</span>
                  <p class="text-[10px] text-slate-400">20% subtle opacity recommended for non-intrusive viewer retention</p>
                </div>
                <div class="flex items-center space-x-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700">
                  <button 
                    v-for="op in opacityPresets" 
                    :key="op.value"
                    @click="watermarkOpacity = op.value"
                    class="px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer font-bold"
                    :class="watermarkOpacity === op.value 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'"
                  >
                    {{ op.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Right: Interactive Live Visual Preview Stage -->
            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-2.5">
              <div class="flex items-center justify-between text-xs font-mono font-bold">
                <span class="text-slate-700 dark:text-slate-300">Live Stage Mockup:</span>
                <span class="text-purple-600 dark:text-purple-400 font-bold">{{ Math.round(watermarkOpacity * 100) }}% Opacity</span>
              </div>

              <!-- 16:9 Mini Canvas Preview -->
              <div class="aspect-video w-full rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-300 dark:border-slate-700 relative overflow-hidden flex items-center justify-center p-2 shadow-inner">
                <!-- Watermark positioned dynamically -->
                <div 
                  class="absolute transition-all duration-300 flex items-center justify-center pointer-events-none"
                  :style="getWatermarkPreviewStyle"
                >
                  <img 
                    :src="watermarkLogoUrl" 
                    alt="Watermark" 
                    class="w-10 h-10 object-contain drop-shadow-md"
                    :style="`opacity: ${watermarkOpacity}`"
                  />
                </div>

                <div class="text-center space-y-0.5 opacity-40 pointer-events-none">
                  <div class="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">1080p Stage Preview</div>
                  <div class="text-[8px] font-mono text-slate-500">1920 × 1080 Canvas</div>
                </div>
              </div>

              <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400 text-center">
                Position: <span class="text-purple-600 dark:text-purple-400 font-bold">{{ watermarkPosition.toUpperCase().replace('_', ' ') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Compilation Progress & Status Box -->
        <div v-if="videoStatus.status === 'compiling' || compiling" class="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="font-bold text-purple-700 dark:text-purple-300 flex items-center space-x-2">
              <div class="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>{{ videoStatus.message || 'Processing video streams...' }}</span>
            </span>
            <span class="font-bold text-purple-600 dark:text-purple-400">{{ videoStatus.progress || 10 }}%</span>
          </div>
          <div class="w-full bg-purple-950/30 rounded-full h-2 overflow-hidden">
            <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="`width: ${videoStatus.progress || 10}%`"></div>
          </div>
        </div>

        <!-- Video Player & Render Switcher -->
        <div v-if="videoFiles.length > 0 || pipeline.hasVideo" class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div class="flex items-center space-x-2">
              <CheckCircle class="w-4 h-4 text-emerald-500 shrink-0" />
              <div class="flex items-center space-x-2">
                <span class="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">Active Video:</span>
                <select 
                  v-model="selectedVideoFile"
                  class="text-xs font-mono font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-1 px-2.5 text-purple-600 dark:text-purple-400 focus:ring-purple-500 cursor-pointer shadow-xs"
                >
                  <option v-for="f in (videoFiles.length ? videoFiles : [{ filename: '01_Episode_Master_1080p.mp4', label: 'Master Full Episode (1080p)', size: pipeline.videoSize }])" :key="f.filename" :value="f.filename">
                    {{ f.label }} ({{ (f.size / (1024 * 1024)).toFixed(1) }} MB)
                  </option>
                </select>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span class="px-2.5 py-1 rounded-full font-bold text-[11px]" :class="activeBadgeClass">
                {{ activeBadgeLabel }}
              </span>
              <a 
                :href="`/api/episodes/${$route.params.franchiseId}/${$route.params.episodeId}/video-stream?file=${encodeURIComponent(selectedVideoFile)}&download=1`"
                :download="getDownloadFilename(selectedVideoFile)"
                class="px-3 py-1 rounded-lg bg-purple-600/10 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                :title="`Download ${getDownloadFilename(selectedVideoFile)}`"
              >
                <Download class="w-3.5 h-3.5" />
                <span class="max-w-[280px] truncate">Download {{ getDownloadFilename(selectedVideoFile) }}</span>
              </a>
            </div>
          </div>

          <div class="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-2xl">
            <video 
              :key="`${selectedVideoFile}_${cacheBuster}`"
              controls 
              class="w-full h-full"
              :src="`/api/episodes/${$route.params.franchiseId}/${$route.params.episodeId}/video-stream?file=${selectedVideoFile}&t=${cacheBuster}`"
            ></video>
          </div>
        </div>

        <!-- Empty State if Video Not Compiled Yet -->
        <div v-if="!compiling && videoFiles.length === 0 && !pipeline.hasVideo" class="py-12 text-center space-y-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-400">
          <Film class="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <p class="font-semibold text-slate-700 dark:text-slate-300">No Video Renders Found Yet</p>
          <p class="text-slate-500">Ensure Visuals (Stage 1) and Voiceover (Stage 2) are prepared, then select a batch or click "Compile Master 1080p Video".</p>
        </div>
        <!-- Next Steps Callout Banner after Video Compilation -->
        <div v-if="pipeline.hasVideo || videoFiles.length > 0" class="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-rose-500/10 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ✓ Master Video Ready
              </span>
              <span class="text-xs font-mono text-slate-500 dark:text-slate-400">Episodic Pipeline Complete</span>
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Ready for Series Compilation & YouTube Publishing</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              Concatenate multi-episode Arc Features & Season Movies or grab the 3 High-CTR Master Thumbnails and YouTube Release Kit in the centralized Series Workspace.
            </p>
          </div>
          <router-link 
            :to="`/franchises/${$route.params.franchiseId}`"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-xs flex items-center space-x-2 transition shadow-md shadow-purple-950/20 shrink-0"
          >
            <span>Open Series Workspace Hub</span>
            <ArrowLeft class="w-4 h-4 rotate-180" />
          </router-link>
        </div>

      </div>
    </div>

    <!-- 3-STAGE PROGRESS MODAL COMPONENT -->
    <StageProgressModal
      :show="modalState.show"
      :is-minimized="modalState.isMinimized"
      :active-stage="modalState.activeStage"
      :status="modalState.status"
      :progress="modalState.progress"
      :message="modalState.message"
      :logs="modalState.logs"
      :pipeline="pipeline"
      @close="modalState.show = false"
      @minimize="modalState.isMinimized = !modalState.isMinimized"
      @maximize="modalState.isMinimized = false"
      @proceed-next="handleProceedNext"
      @switch-stage="handleSwitchStage"
    />

    <!-- SCENE VISUAL ALIGNMENT & QUALITY AUDIT MODAL -->
    <div v-if="showAlignmentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <!-- Modal Header -->
        <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/40">
          <div class="flex items-center space-x-3">
            <div class="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Scene Visual Alignment & Quality Audit</h3>
                <span 
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono uppercase tracking-wider"
                  :class="alignmentReport?.isFullyAligned ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'"
                >
                  {{ alignmentReport?.isFullyAligned ? '100% Fully Aligned' : `${alignmentReport?.alignmentScore || 0}% Scene Coverage` }}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time verification of physical asset files, sequence continuity, 9:16 vertical manhwa tiers, and narration audio synchronization.
              </p>
            </div>
          </div>
          <button 
            @click="showAlignmentModal = false" 
            class="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          <!-- 4 Core Metric Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div class="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Alignment Score</div>
              <div class="text-2xl font-black text-slate-900 dark:text-white font-mono flex items-baseline space-x-1">
                <span>{{ alignmentReport?.alignmentScore || 0 }}%</span>
                <span class="text-xs font-normal text-slate-400">coverage</span>
              </div>
              <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  :style="{ width: `${alignmentReport?.alignmentScore || 0}%` }"
                ></div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div class="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Physical Images</div>
              <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {{ alignmentReport?.attachedCount || 0 }} <span class="text-sm font-normal text-slate-400">/ {{ alignmentReport?.totalScenes || 0 }}</span>
              </div>
              <div class="text-[11px] text-slate-500">{{ alignmentReport?.missingCount || 0 }} scenes missing assets</div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div class="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Artwork Fidelity</div>
              <div class="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {{ alignmentReport?.highFidelityCount || 0 }} <span class="text-xs font-normal text-slate-400">High-Res</span>
              </div>
              <div class="text-[11px] text-slate-500">{{ alignmentReport?.placeholderCount || 0 }} storyboard stills</div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div class="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Anti-Slop Visual</div>
              <div class="text-base font-bold font-mono mt-1 flex items-center space-x-1.5" :class="alignmentReport?.isAntiSlopVisualCertified ? 'text-emerald-500' : 'text-amber-500'">
                <span>{{ alignmentReport?.isAntiSlopVisualCertified ? '✓ 100% Certified' : '⏳ In Production' }}</span>
              </div>
              <div class="text-[11px] text-slate-500">Tier A/B/C ratio aligned</div>
            </div>
          </div>

          <!-- Anomalies Alert Box if any -->
          <div v-if="alignmentReport?.anomalies && alignmentReport.anomalies.length > 0" class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div class="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-300 font-mono uppercase tracking-wider">
              <AlertTriangle class="w-4 h-4 text-amber-500" />
              <span>Pipeline Diagnostic Notices ({{ alignmentReport.anomalies.length }})</span>
            </div>
            <ul class="space-y-1 text-xs text-amber-800 dark:text-amber-200 font-mono">
              <li v-for="(anom, idx) in alignmentReport.anomalies.slice(0, 5)" :key="idx" class="flex items-start space-x-2">
                <span class="text-amber-500">•</span>
                <span>{{ anom.message }}</span>
              </li>
              <li v-if="alignmentReport.anomalies.length > 5" class="text-slate-500 italic pl-3">
                ...and {{ alignmentReport.anomalies.length - 5 }} more notices.
              </li>
            </ul>
          </div>

          <!-- Batch Selector Tabs -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div class="flex flex-wrap items-center gap-2">
              <button 
                @click="activeAlignmentBatchTab = 'all'"
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                :class="activeAlignmentBatchTab === 'all' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'"
              >
                All Scenes ({{ alignmentReport?.totalScenes || 0 }})
              </button>

              <button 
                v-for="b in alignmentReport?.batches || []" 
                :key="b.index"
                @click="activeAlignmentBatchTab = b.index"
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer"
                :class="activeAlignmentBatchTab === b.index 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'"
              >
                <span>{{ b.name }} ({{ b.attached }}/{{ b.total }})</span>
                <span v-if="b.isFullyReady" class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span v-else class="w-2 h-2 rounded-full bg-amber-400"></span>
              </button>
            </div>

            <!-- Quick Filter -->
            <div class="flex items-center space-x-2">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">Filter:</span>
              <select 
                v-model="alignmentFilter" 
                class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-mono font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Show All</option>
                <option value="missing">Missing Assets Only</option>
                <option value="high_fidelity">High-Fidelity Only</option>
                <option value="storyboard">Storyboard Stills Only</option>
              </select>
            </div>
          </div>

          <!-- Scenes Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            <div 
              v-for="scene in filteredAlignmentScenes" 
              :key="scene.tag"
              class="p-3.5 rounded-2xl border transition space-y-2.5 bg-slate-50/60 dark:bg-slate-950/40"
              :class="scene.hasImage ? 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/40' : 'border-rose-300 dark:border-rose-500/30 bg-rose-50/10'"
            >
              <!-- Thumbnail & Badges -->
              <div class="aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 relative group border border-slate-200 dark:border-slate-800">
                <img 
                  v-if="scene.hasImage" 
                  :src="`${scene.url}?t=${cacheBuster}`" 
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  alt="scene preview" 
                />
                <div v-else class="w-full h-full flex flex-col items-center justify-center space-y-2 text-slate-500 p-4 text-center">
                  <Image class="w-8 h-8 opacity-30 text-rose-400" />
                  <span class="text-[11px] font-mono text-rose-500 dark:text-rose-400">Missing Asset File</span>
                </div>

                <!-- Top Badges -->
                <div class="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                  <span class="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white font-mono font-bold text-[11px] border border-white/10">
                    [{{ scene.tag }}]
                  </span>
                  <span 
                    class="px-2 py-0.5 rounded-md font-mono font-bold text-[10px] backdrop-blur-xs"
                    :class="{
                      'bg-purple-950/80 text-purple-300 border border-purple-500/30': scene.tierCode === 'hero',
                      'bg-blue-950/80 text-blue-300 border border-blue-500/30': scene.tierCode === 'dual',
                      'bg-amber-950/80 text-amber-300 border border-amber-500/30': scene.tierCode === 'multi'
                    }"
                  >
                    {{ scene.tierCode === 'hero' ? 'Hero' : (scene.tierCode === 'dual' ? 'Dual' : 'Multi') }}
                  </span>
                </div>

                <!-- Bottom Status Overlay -->
                <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none text-[10px] font-mono">
                  <span 
                    v-if="scene.hasImage"
                    class="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs"
                    :class="scene.isHighFidelity ? 'text-emerald-400 border border-emerald-500/30' : 'text-purple-300 border border-purple-500/30'"
                  >
                    {{ scene.isHighFidelity ? `High-Res (${scene.fileSizeFormatted})` : 'Storyboard' }}
                  </span>
                  <span 
                    v-else
                    class="px-2 py-0.5 rounded-md bg-rose-950/90 text-rose-300 border border-rose-500/40"
                  >
                    Missing
                  </span>
                </div>
              </div>

              <!-- Scene Description & Sync Metas -->
              <div class="space-y-1">
                <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1" :title="scene.description">
                  {{ scene.description }}
                </div>
                <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                  <span :class="scene.inScript ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                    Script {{ scene.inScript ? '✓' : '—' }}
                  </span>
                  <span v-if="scene.inTts !== null" :class="scene.inTts ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'">
                    TTS Audio {{ scene.inTts ? '✓' : '⏳' }}
                  </span>
                  <span v-else class="text-slate-400">TTS Audio —</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-950/40">
          <div class="flex items-center space-x-3 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Audit scanned {{ alignmentReport?.totalScenes || 0 }} scenes • {{ alignmentReport?.attachedCount || 0 }} loaded • {{ alignmentReport?.missingCount || 0 }} missing</span>
            <span v-if="lastScannedTime" class="text-indigo-600 dark:text-indigo-400 font-semibold">• Last synced: {{ lastScannedTime }}</span>
            <span v-if="scanFeedback" class="text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">• {{ scanFeedback }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <button 
              @click="runVisualAlignmentValidation(activeAlignmentBatchTab === 'all' ? null : activeAlignmentBatchTab)"
              :disabled="isValidatingAlignment"
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 disabled:opacity-50 shadow-xs"
            >
              <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isValidatingAlignment }" />
              <span>{{ isValidatingAlignment ? 'Scanning Disk Assets...' : 'Re-scan Alignment' }}</span>
            </button>
            <button 
              @click="showAlignmentModal = false"
              class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-indigo-900/20"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- FAILED & CLUTTERED PROMPTS SLIDE-OVER DRAWER -->
    <Teleport to="body">
      <div 
        v-if="isFailedDrawerOpen" 
        class="fixed inset-0 z-50 overflow-hidden"
        @keydown.esc="isFailedDrawerOpen = false"
      >
        <!-- Backdrop -->
        <div 
          @click="isFailedDrawerOpen = false" 
          class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300"
        />

        <!-- Slide-over Drawer Container -->
        <div class="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <div class="w-screen max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
            
            <!-- Drawer Header -->
            <div class="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 shrink-0 space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                    <Zap class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="flex items-center space-x-2">
                      <h2 class="text-base font-bold text-slate-900 dark:text-white">Failed & Cluttered Scenes Hub</h2>
                      <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        {{ filteredFailedScenes.length }} Action Items
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Copy clean prompts for Google Flow regeneration, then drop replacement images directly on the cards below.
                    </p>
                  </div>
                </div>
                <button 
                  @click="isFailedDrawerOpen = false"
                  class="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>

              <!-- Filter Tabs Row 1: Batch Filter -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mr-1 font-bold">Batch:</span>
                <button 
                  @click="failedDrawerBatchFilter = 'all'"
                  class="px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer font-bold"
                  :class="failedDrawerBatchFilter === 'all' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs border border-purple-600' 
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'"
                >
                  All Batches
                </button>
                <button 
                  v-for="b in batchedScenes" 
                  :key="b.index"
                  @click="failedDrawerBatchFilter = b.index"
                  class="px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer font-bold flex items-center space-x-1"
                  :class="failedDrawerBatchFilter === b.index 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs border border-purple-600' 
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'"
                >
                  <span>{{ b.name }}</span>
                  <span 
                    v-if="b.failedCount > 0" 
                    class="text-[10px] px-1.5 py-0.2 rounded font-bold ml-0.5"
                    :class="failedDrawerBatchFilter === b.index ? 'bg-white/25 text-white' : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'"
                  >
                    {{ b.failedCount }}
                  </span>
                </button>
              </div>

              <!-- Filter Tabs Row 2: Issue Type Filter -->
              <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                <div class="flex items-center space-x-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-700">
                  <button 
                    @click="failedDrawerIssueFilter = 'all'"
                    class="px-2.5 py-1 rounded-lg transition cursor-pointer font-bold"
                    :class="failedDrawerIssueFilter === 'all' 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700/60'"
                  >
                    All Issues ({{ totalFailedCount }})
                  </button>
                  <button 
                    @click="failedDrawerIssueFilter = 'cluttered'"
                    class="px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center space-x-1"
                    :class="failedDrawerIssueFilter === 'cluttered' 
                      ? 'bg-rose-600 text-white shadow-xs' 
                      : 'text-slate-700 hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40'"
                  >
                    <span>🔴 Cluttered</span>
                    <span 
                      class="text-[10px] px-1.5 py-0.2 rounded font-bold"
                      :class="failedDrawerIssueFilter === 'cluttered' ? 'bg-white/25 text-white' : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'"
                    >
                      {{ totalClutteredCount }}
                    </span>
                  </button>
                  <button 
                    @click="failedDrawerIssueFilter = 'warning'"
                    class="px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center space-x-1"
                    :class="failedDrawerIssueFilter === 'warning' 
                      ? 'bg-amber-600 text-white shadow-xs' 
                      : 'text-slate-700 hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40'"
                  >
                    <span>🟡 Warnings</span>
                    <span 
                      class="text-[10px] px-1.5 py-0.2 rounded font-bold"
                      :class="failedDrawerIssueFilter === 'warning' ? 'bg-white/25 text-white' : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'"
                    >
                      {{ totalWarningCount }}
                    </span>
                  </button>
                  <button 
                    @click="failedDrawerIssueFilter = 'missing'"
                    class="px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center space-x-1"
                    :class="failedDrawerIssueFilter === 'missing' 
                      ? 'bg-slate-700 text-white shadow-xs' 
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700/60'"
                  >
                    <span>⚪ Missing</span>
                    <span 
                      class="text-[10px] px-1.5 py-0.2 rounded font-bold"
                      :class="failedDrawerIssueFilter === 'missing' ? 'bg-white/25 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'"
                    >
                      {{ totalMissingCount }}
                    </span>
                  </button>
                </div>

                <!-- Master Bulk Copy Buttons -->
                <div class="flex items-center space-x-2">
                  <button 
                    v-if="filteredFailedScenes.length > 0"
                    @click="copyFailedXmlPrompts"
                    class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Check v-if="activeCopiedFailedTag === 'ALL_FILTERED'" class="w-3.5 h-3.5 text-emerald-300" />
                    <Zap v-else class="w-3.5 h-3.5 text-purple-200" />
                    <span>{{ activeCopiedFailedTag === 'ALL_FILTERED' ? 'XML Copied!' : `⚡ Copy Filtered XML (${filteredFailedScenes.length})` }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Drawer Body: List of Failed / Cluttered Scenes -->
            <div class="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar bg-slate-100/50 dark:bg-slate-950/40">
              <!-- Empty State: All Clean -->
              <div v-if="filteredFailedScenes.length === 0" class="py-16 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/30 p-8 shadow-sm">
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
                  <ShieldCheck class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Zero Issues Detected!</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 font-mono">
                    All scenes matching this filter are verified 100% clean and loaded on disk.
                  </p>
                </div>
              </div>

              <!-- Scene Cards List -->
              <div 
                v-for="scene in filteredFailedScenes" 
                :key="scene.tag"
                class="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all space-y-3 relative overflow-hidden"
                :class="{
                  'border-rose-400 dark:border-rose-500/40': scene.qa?.status === 'cluttered',
                  'border-amber-400 dark:border-amber-500/40': scene.qa?.status === 'warning',
                  'border-slate-300 dark:border-slate-700': !scene.hasImage
                }"
              >
                <!-- Card Header -->
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center space-x-2">
                    <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                      [{{ scene.tag }}]
                    </span>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700">
                      {{ getSceneBatchName(scene.tag) }}
                    </span>

                    <!-- Issue Badge -->
                    <span 
                      class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center space-x-1"
                      :class="{
                        'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40': scene.qa?.status === 'cluttered',
                        'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40': scene.qa?.status === 'warning',
                        'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700': !scene.hasImage
                      }"
                    >
                      <AlertCircle v-if="scene.qa?.status === 'cluttered'" class="w-3 h-3 text-rose-500" />
                      <AlertTriangle v-else-if="scene.qa?.status === 'warning'" class="w-3 h-3 text-amber-500" />
                      <Info v-else class="w-3 h-3 text-slate-400" />
                      <span>{{ scene.qa?.status === 'cluttered' ? '🔴 Cluttered (Speech / SFX)' : (scene.qa?.status === 'warning' ? '🟡 Perimeter Header / Margin' : '⚪ Missing on Disk') }}</span>
                    </span>
                  </div>

                  <!-- 1-Click Copy Scene Button -->
                  <button 
                    @click="copySingleScenePrompt(scene)"
                    class="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-600 dark:bg-purple-950/60 dark:hover:bg-purple-600 border border-purple-300 dark:border-purple-500/40 text-purple-700 hover:text-white dark:text-purple-300 dark:hover:text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-xs group"
                  >
                    <Check v-if="activeCopiedFailedTag === scene.tag" class="w-3.5 h-3.5 text-emerald-500 group-hover:text-white" />
                    <Copy v-else class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 group-hover:text-white" />
                    <span>{{ activeCopiedFailedTag === scene.tag ? 'Copied XML!' : 'Copy XML <scene>' }}</span>
                  </button>
                </div>

                <!-- Issue Details Notice if any -->
                <div v-if="scene.qa?.issues && scene.qa.issues.length > 0" class="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 text-[11px] font-mono text-rose-800 dark:text-rose-200 space-y-0.5 font-semibold">
                  <div v-for="(issue, iIdx) in scene.qa.issues" :key="iIdx" class="flex items-center space-x-1.5">
                    <span class="text-rose-500 font-bold">•</span>
                    <span>{{ issue }}</span>
                  </div>
                </div>

                <!-- Visual Plate & Dropzone Area (Split Layout) -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <!-- Thumbnail with replacement drop target -->
                  <div 
                    class="aspect-video sm:aspect-auto sm:h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-800 relative group flex items-center justify-center cursor-pointer shadow-xs"
                    @dragover.prevent
                    @drop.prevent="handleFileDrop($event, scene.tag)"
                  >
                    <img 
                      v-if="scene.hasImage" 
                      :src="`${scene.url}?t=${cacheBuster}`" 
                      class="w-full h-full object-cover" 
                      :alt="scene.tag"
                    />
                    <div v-else class="text-center p-3 space-y-1">
                      <Image class="w-5 h-5 mx-auto text-slate-600" />
                      <div class="text-[10px] font-mono text-slate-400 font-semibold">No Image</div>
                    </div>

                    <!-- Upload Loading Overlay -->
                    <div v-if="uploadingCardTags.has(scene.tag)" class="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center space-y-1 text-white z-10">
                      <Loader2 class="w-5 h-5 text-purple-400 animate-spin" />
                      <span class="text-[10px] font-mono">Verifying QA...</span>
                    </div>

                    <!-- Hover Replace Overlay -->
                    <label v-else class="absolute inset-0 bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition cursor-pointer p-2 text-center">
                      <Upload class="w-4 h-4 text-purple-300 mb-1" />
                      <span class="text-[11px] font-bold text-white">Drop or Click to Replace</span>
                      <span class="text-[9px] font-mono text-slate-300">Auto-sanitizes on drop</span>
                      <input type="file" accept="image/*" class="hidden" @change="handleFileInput($event, scene.tag)" />
                    </label>
                  </div>

                  <!-- Prompt Text Container -->
                  <div class="sm:col-span-2 flex flex-col justify-between space-y-2">
                    <div>
                      <div class="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{{ scene.description }}</div>
                      <p class="text-[11px] font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/90 p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 line-clamp-4 select-all leading-relaxed mt-1 font-medium shadow-2xs">
                        {{ scene.prompt }}
                      </p>
                    </div>

                    <!-- Quick Inline Actions -->
                    <div class="flex items-center justify-between pt-1 text-xs font-mono">
                      <button 
                        @click="copySingleRawPrompt(scene)" 
                        class="text-slate-700 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 font-semibold transition cursor-pointer flex items-center space-x-1.5"
                      >
                        <Copy class="w-3.5 h-3.5" />
                        <span>Copy Plain Text</span>
                      </button>

                      <label class="text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 hover:underline font-bold cursor-pointer flex items-center space-x-1.5">
                        <Upload class="w-3.5 h-3.5" />
                        <span>Replace Image</span>
                        <input type="file" accept="image/*" class="hidden" @change="handleFileInput($event, scene.tag)" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Drawer Footer -->
            <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
              <span class="font-medium">Wrapped in Google Flow &lt;scene id="..."&gt; containers with 9:16 anti-grid directives.</span>
              <button 
                @click="isFailedDrawerOpen = false" 
                class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white font-bold transition cursor-pointer shadow-sm"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Global Hidden Audio Element for BGM Preview -->
    <audio ref="bgmAudioPlayer" @ended="onBgmEnded"></audio>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import StageProgressModal from '../components/StageProgressModal.vue'
import { 
  ArrowLeft, 
  Image, 
  Volume2, 
  Film, 
  Sparkles, 
  Wand2, 
  Upload, 
  Radio, 
  CheckCircle, 
  Play,
  Activity,
  Music,
  Sliders,
  VolumeX,
  Pause,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  Users,
  Check,
  FolderDown,
  Archive,
  FolderOpen,
  Tag,
  Layers,
  Zap,
  Loader2,
  AlertCircle,
  Info,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  X,
  Youtube,
  Share2,
  Hash,
  Clock,
  MessageSquare,
  CheckCircle2,
  FileText
} from 'lucide-vue-next'
import { 
  parseEntityMappingText, 
  transformTokens, 
  saveEntityMapToStorage, 
  loadEntityMapFromStorage, 
  getTagModeFromStorage, 
  setTagModeToStorage 
} from '../utils/entityMapper.js'

const route = useRoute()
const activeStage = ref('visuals')
const scenes = ref([])
const cacheBuster = ref(Date.now())
const generatingStoryboards = ref(false)
const storyboardFeedback = ref('')

// Google Flow Entity ID Mapping State
const entityMapRawText = ref('')
const parsedEntities = ref({})
const promptTagMode = ref('uuid') // 'uuid' | 'token'
const isSavingEntityMap = ref(false)

const entityCount = computed(() => Object.keys(parsedEntities.value).length)

const syncEntityMapping = async () => {
  const result = parseEntityMappingText(entityMapRawText.value)
  parsedEntities.value = result.entities
  saveEntityMapToStorage(route.params.franchiseId, entityMapRawText.value, result.entities)
  
  try {
    isSavingEntityMap.value = true
    await fetch(`/api/franchises/${route.params.franchiseId}/flow-entities`, {
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
    `✓ Successfully mapped ${result.count} entities! Output mode: ${promptTagMode.value === 'uuid' ? '@UUID' : '@{Token}'}`,
    'success'
  )
}

const togglePromptTagMode = (mode) => {
  promptTagMode.value = mode
  setTagModeToStorage(mode)
  triggerToast(
    'Prompt Format Toggled',
    mode === 'uuid' ? 'Active Output: Google Flow Entity IDs (@UUID)' : 'Active Output: Human-Readable Tokens (@{Name})',
    'info',
    false,
    2500
  )
}

const copyCurrentEntityMapping = async () => {
  try {
    await navigator.clipboard.writeText(entityMapRawText.value)
    triggerToast('Mapping Copied', '✓ Copied Entity ID mapping text to clipboard!', 'success')
  } catch (e) {
    console.error('Copy error:', e)
  }
}

const loadFlowEntities = async () => {
  promptTagMode.value = getTagModeFromStorage()
  const local = loadEntityMapFromStorage(route.params.franchiseId)
  if (local && local.rawText) {
    entityMapRawText.value = local.rawText
    parsedEntities.value = local.entities || parseEntityMappingText(local.rawText).entities
  }

  try {
    const res = await fetch(`/api/franchises/${route.params.franchiseId}/flow-entities?cb=${Date.now()}`)
    const data = await res.json()
    if (data && data.rawText) {
      entityMapRawText.value = data.rawText
      parsedEntities.value = data.entities || parseEntityMappingText(data.rawText).entities
      saveEntityMapToStorage(route.params.franchiseId, data.rawText, parsedEntities.value)
    }
  } catch (e) {
    console.warn('Failed to fetch flow entities:', e)
  }
}


const modalState = ref({
  show: false,
  isMinimized: false,
  activeStage: 'visuals',
  status: 'idle',
  progress: 0,
  message: '',
  logs: []
})
let imagePollTimer = null
let ttsPollTimer = null

const openProgressModal = () => {
  if (modalState.value.status === 'idle') {
    if (pipeline.value.hasVideo) {
      modalState.value.activeStage = 'compiler'
      modalState.value.status = 'completed'
      modalState.value.progress = 100
      modalState.value.message = 'Master 1080p Video compilation completed successfully!'
      modalState.value.logs = ['All 3 stages complete: Visuals, Audio & Master Cut ready.']
    } else if (pipeline.value.hasMasterAudio) {
      modalState.value.activeStage = 'audio'
      modalState.value.status = 'completed'
      modalState.value.progress = 100
      modalState.value.message = 'Voiceover & subtitles ready.'
      modalState.value.logs = ['Voiceover audio and subtitles synchronized.']
    } else if (pipeline.value.imagesReady > 0) {
      modalState.value.activeStage = 'visuals'
      modalState.value.status = 'completed'
      modalState.value.progress = 100
      modalState.value.message = `${pipeline.value.imagesReady} visual panels ready.`
      modalState.value.logs = [`${pipeline.value.imagesReady} panels available.`]
    }
  }
  modalState.value.show = true
  modalState.value.isMinimized = false
}

const selectedVoice = ref('en-US-ChristopherNeural')
const synthesizingAudio = ref(false)
const masterAudioPlayer = ref(null)

// Toast Notification & Card Loading State
const toast = ref({
  show: false,
  title: '',
  message: '',
  type: 'info', // 'info' | 'success' | 'error'
  loading: false
})
let toastTimer = null

const triggerToast = (title, message, type = 'info', loading = false, duration = 4500) => {
  clearTimeout(toastTimer)
  toast.value = {
    show: true,
    title,
    message,
    type,
    loading
  }
  if (!loading && duration > 0) {
    toastTimer = setTimeout(() => {
      toast.value.show = false
    }, duration)
  }
}

const uploadingCardTags = ref(new Set())

// Character Models & Ingestion State
const characterModels = ref([])
const selectedVaultCategory = ref('all')
const batchUploading = ref(false)
const batchUploadFeedback = ref('')
const batchFileInput = ref(null)
const zipFileInput = ref(null)
const folderFileInput = ref(null)
// Scene Visual Alignment & Quality Audit State
const isValidatingAlignment = ref(false)
const alignmentReport = ref(null)
const alignmentFilter = ref('all')
const showAlignmentModal = ref(false)
const activeAlignmentBatchTab = ref('all')
const lastScannedTime = ref('')
const scanFeedback = ref('')

const runVisualAlignmentValidation = async (targetBatchIndex = null) => {
  isValidatingAlignment.value = true
  scanFeedback.value = 'Scanning disk...'
  triggerToast('Validating Scenes', 'Auditing visual scene alignment and file integrity...', 'info', true)

  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/validate-alignment?cb=${Date.now()}`)
    if (!res.ok) throw new Error(`Server returned ${res.status}`)
    const data = await res.json()
    if (data.success) {
      alignmentReport.value = data
      lastScannedTime.value = new Date().toLocaleTimeString()
      cacheBuster.value = Date.now()
      
      if (typeof targetBatchIndex === 'number') {
        activeAlignmentBatchTab.value = targetBatchIndex
      } else {
        activeAlignmentBatchTab.value = 'all'
      }
      showAlignmentModal.value = true

      // Synchronously refresh main sequencer view in background
      loadScenes()
      loadPipelineStatus()

      scanFeedback.value = `✓ Updated at ${lastScannedTime.value}`
      setTimeout(() => { scanFeedback.value = '' }, 5000)

      if (data.isFullyAligned) {
        triggerToast('Alignment Verified', `✓ 100% of scenes (${data.totalScenes}/${data.totalScenes}) are fully aligned!`, 'success')
      } else {
        triggerToast('Alignment Audit', `Audit complete: ${data.attachedCount}/${data.totalScenes} attached (${data.missingCount} missing).`, 'info')
      }
    } else {
      throw new Error(data.error || 'Failed to validate alignment')
    }
  } catch (err) {
    console.error('Validation error:', err)
    scanFeedback.value = `Error: ${err.message}`
    triggerToast('Validation Error', err.message, 'error')
  } finally {
    isValidatingAlignment.value = false
  }
}

// Visual QA & Anti-Clutter State
const isValidatingQa = ref(false)
const qaAuditReport = ref(null)

const runVisualQaAudit = async (autoFix = false) => {
  isValidatingQa.value = true
  triggerToast(
    autoFix ? 'Auto-Cleaning Plates' : 'Auditing Visual QA',
    autoFix ? 'Sanitizing edge clutter and filenames with Sharp...' : 'Scanning images for filenames, headers and speech bubbles...',
    'info',
    true
  )

  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/qa-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoFix })
    })
    const data = await res.json()
    if (data.success) {
      qaAuditReport.value = data
      cacheBuster.value = Date.now()
      loadScenes()
      loadPipelineStatus()

      if (data.isFullyClean) {
        triggerToast('Visual QA Verified', `✓ 100% of attached images (${data.cleanCount + data.autoCleanedCount}/${data.totalImages}) are verified clean!`, 'success')
      } else {
        triggerToast('Visual QA Audit', `Audit complete: ${data.cleanCount} clean, ${data.warningCount} fixable, ${data.clutteredCount} cluttered.`, 'info')
      }
    }
  } catch (err) {
    console.error('QA Audit error:', err)
    triggerToast('QA Audit Failed', err.message, 'error')
  } finally {
    isValidatingQa.value = false
  }
}

const filteredAlignmentScenes = computed(() => {
  if (!alignmentReport.value || !Array.isArray(alignmentReport.value.batches)) return []
  let list = []
  if (activeAlignmentBatchTab.value === 'all') {
    list = alignmentReport.value.batches.flatMap(b => b.scenes)
  } else {
    const batch = alignmentReport.value.batches.find(b => b.index === activeAlignmentBatchTab.value)
    list = batch ? batch.scenes : []
  }

  if (alignmentFilter.value === 'missing') {
    return list.filter(s => !s.hasImage)
  }
  if (alignmentFilter.value === 'high_fidelity') {
    return list.filter(s => s.isHighFidelity)
  }
  if (alignmentFilter.value === 'storyboard') {
    return list.filter(s => s.hasImage && !s.isHighFidelity)
  }
  return list
})

const loadCharacterModels = async () => {
  try {
    const res = await fetch(`/api/franchises/${route.params.franchiseId}/character-models?cb=${Date.now()}`)
    const data = await res.json()
    if (Array.isArray(data)) {
      characterModels.value = data
    }
  } catch (e) {
    console.warn('Failed to load character models:', e)
  }
}

const copiedVaultId = ref(null)
const copiedVaultType = ref(null)

const vaultCategories = computed(() => {
  const total = characterModels.value.length
  const chars = characterModels.value.filter(m => m.type === 'character' || ['protagonist', 'antagonist', 'supporting'].includes(m.category?.toLowerCase())).length
  const weapons = characterModels.value.filter(m => m.category === 'Weapons').length
  const artifacts = characterModels.value.filter(m => m.category === 'Artifacts').length
  const props = characterModels.value.filter(m => m.category === 'Props').length

  const list = [{ key: 'all', label: 'All', count: total }]
  if (chars > 0) list.push({ key: 'characters', label: 'Characters', count: chars })
  if (weapons > 0) list.push({ key: 'Weapons', label: 'Weapons', count: weapons })
  if (artifacts > 0) list.push({ key: 'Artifacts', label: 'Artifacts', count: artifacts })
  if (props > 0) list.push({ key: 'Props', label: 'Props', count: props })
  return list
})

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

const filteredCharacterModels = computed(() => {
  if (selectedVaultCategory.value === 'all') return characterModels.value
  if (selectedVaultCategory.value === 'characters') {
    return characterModels.value.filter(m => m.type === 'character' || ['protagonist', 'antagonist', 'supporting'].includes(m.category?.toLowerCase()))
  }
  if (selectedVaultCategory.value === 'items') {
    return characterModels.value.filter(m => m.type !== 'character' || ['weapons', 'artifacts', 'props'].includes(m.category?.toLowerCase()))
  }
  return characterModels.value.filter(m => 
    m.category?.toLowerCase() === selectedVaultCategory.value.toLowerCase() ||
    m.role?.toLowerCase() === selectedVaultCategory.value.toLowerCase()
  )
})

const copyModelName = async (model) => {
  if (!model) return
  const cleanName = model.flowName || model.token?.replace(/[@{}]/g, '') || model.name
  try {
    await navigator.clipboard.writeText(cleanName)
    copiedVaultId.value = model.id
    copiedVaultType.value = 'name'
    triggerToast('Copied Reference Name', `Copied "${cleanName}" (without @{}) — ready to paste into Google Flow!`, 'success')
    setTimeout(() => {
      if (copiedVaultId.value === model.id && copiedVaultType.value === 'name') {
        copiedVaultId.value = null
        copiedVaultType.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Clipboard write error:', err)
  }
}

const copyModelToken = async (model) => {
  if (!model) return
  const tokenText = model.token || `@{${model.name}}`
  try {
    await navigator.clipboard.writeText(tokenText)
    copiedVaultId.value = model.id
    copiedVaultType.value = 'token'
    triggerToast('Copied Token', `Copied "${tokenText}" to clipboard for Google Flow!`, 'success')
    setTimeout(() => {
      if (copiedVaultId.value === model.id && copiedVaultType.value === 'token') {
        copiedVaultId.value = null
        copiedVaultType.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Clipboard write error:', err)
  }
}

const copyModelDna = async (model) => {
  if (!model) return
  const textToCopy = model.fullDna || model.dnaAnchor || model.description || `${model.name}, dark fantasy action manhwa webtoon art style, sharp ink linework, cinematic lighting`
  try {
    await navigator.clipboard.writeText(textToCopy)
    copiedVaultId.value = model.id
    copiedVaultType.value = 'dna'
    triggerToast('Copied Full DNA', `Copied complete visual prompt for "${model.name}" to clipboard!`, 'success')
    setTimeout(() => {
      if (copiedVaultId.value === model.id && copiedVaultType.value === 'dna') {
        copiedVaultId.value = null
        copiedVaultType.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Clipboard write error:', err)
  }
}

const downloadModelPlate = async (model) => {
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
    triggerToast('Download Started', `Downloading reference plate "${model.filename}"`, 'info')
  } catch (err) {
    const a = document.createElement('a')
    a.href = model.url
    a.download = model.filename || `${model.name}.jpg`
    a.target = '_blank'
    a.click()
  }
}

// Universal Ingestion Triggers
const triggerZipUpload = () => {
  if (zipFileInput.value) zipFileInput.value.click()
}

const triggerFolderUpload = () => {
  if (folderFileInput.value) folderFileInput.value.click()
}

const triggerBatchUpload = () => {
  if (batchFileInput.value) batchFileInput.value.click()
}

const activeScopedBatchIndex = ref(null)
const batchScopedFileInput = ref(null)

const triggerBatchScopedUpload = (batchIndex) => {
  activeScopedBatchIndex.value = batchIndex
  if (batchScopedFileInput.value) {
    batchScopedFileInput.value.click()
  }
}

const handleBatchScopedFileInput = async (e) => {
  const files = e.target ? Array.from(e.target.files) : []
  const targetBatchIndex = activeScopedBatchIndex.value
  if (files.length > 0 && targetBatchIndex !== null) {
    const zipFile = files.find(f => f.name.toLowerCase().endsWith('.zip'))
    if (zipFile) {
      await handleZipUpload(zipFile, targetBatchIndex)
    } else {
      await processBatchFiles(files, targetBatchIndex)
    }
  }
  if (e.target) e.target.value = ''
  activeScopedBatchIndex.value = null
}

const handleZipFileInput = async (e) => {
  const files = e.target ? Array.from(e.target.files) : []
  if (files.length > 0) {
    await handleZipUpload(files[0])
  }
  if (e.target) e.target.value = ''
}

const handleFolderFileInput = async (e) => {
  const files = e.target ? Array.from(e.target.files) : []
  await processBatchFiles(files)
  if (e.target) e.target.value = ''
}

const handleBatchFileInput = async (e) => {
  const files = e.target ? Array.from(e.target.files) : []
  await processBatchFiles(files)
  if (e.target) e.target.value = ''
}

const getFlowDirectiveHeader = (collectionTitle) => {
  const is16x9 = (route.params.franchiseId || '').toLowerCase().includes('series_02') || (franchise.value?.bibleContent || '').includes('16:9')
  const aspectInstruction = is16x9 
    ? '16:9 horizontal widescreen landscape aspect ratio (1920x1080 horizontal full bleed)'
    : '9:16 vertical manhwa aspect ratio (1080x1920 vertical format)'

  return `[SYSTEM DIRECTIVE: TARGET COLLECTION "${collectionTitle}" | CREATE IF NOT PRESENT | DO NOT ASSIGN TO PRIOR BATCHES]

📁 MANDATORY COLLECTION GROUPING & SESSION ISOLATION INSTRUCTION:
1. TARGET COLLECTION: Before or immediately upon generating the images below, YOU MUST CREATE A DEDICATED COLLECTION NAMED:
   "${collectionTitle}"
   and automatically assign, group, and organize 100% of all generated scene images into this Collection in Google Flow.
2. ZERO CROSS-BATCH CONTAMINATION: DO NOT assign, route, or link any of these generated images to prior collections or earlier batch threads (such as previous batches or older chat runs). Every image generated from this prompt must belong strictly and exclusively to "${collectionTitle}".
3. HARD BATCH BOUNDARY: Treat this generation batch as a completely isolated container.

🎨 GENERATION & COMPOSITION INVARIANTS:
1. STANDALONE SCENES: Generate EXACTLY ONE separate, standalone full-frame ${aspectInstruction} manhwa image for each <scene> container below.
2. ZERO GRIDS / ZERO STRIPS: DO NOT create multi-panel comic strips, storyboards, grids, collages, or contact sheets.
3. 🚫 ABSOLUTE ZERO-TEXT & ZERO-KOREAN MANDATE (STRICTLY ENFORCED):
   - Every generated image MUST be 100% pure, textless illustration artwork.
   - ABSOLUTELY ZERO Korean characters / Hangul (한글), ZERO English words/letters, ZERO Japanese kanji/hiragana, ZERO numbers, ZERO speech bubbles, ZERO dialogue balloons, ZERO comic sound effects (SFX/onomatopoeia), ZERO subtitles, ZERO captions, ZERO watermarks, ZERO signatures, ZERO chapter titles, ZERO artist logos, ZERO burned-in filenames, and ZERO UI text.
   - Never draw or overlay any words, glyphs, or letters onto the artwork under any circumstances.
4. MANDATORY FULL COMPLETION & AUTO-RETRY PROTOCOL: If any individual image generation fails, times out, or returns a policy/tool error, you MUST automatically retry that specific <scene> until all requested scenes in this prompt are successfully generated. Do not stop early or omit any scenes.
5. MANDATORY ANATOMICAL DIRECTIVE: Flawless human anatomy only. Exactly two arms, two legs, five fingers per hand, natural joint articulation. ZERO extra limbs, ZERO mutated hands, ZERO duplicate body parts, ZERO fused fingers, and ZERO extra feet.
6. MANDATORY LIMB CONNECTIVITY & ANTI-GHOST HANDS: Every hand holding an object, weapon, bow, or prop MUST be physically and seamlessly attached to the character's wrist, forearm, and shoulder. ZERO floating hands, ZERO detached or ghost hands hovering in mid-air, ZERO severed appendages, and ZERO duplicate floating arms holding props.
7. MANDATORY FILE NAMING CONVENTION: Name each generated image file strictly matching its scene tag as specified in the filename attribute (e.g. IMG_001.jpg, IMG_002.jpg). Never use randomized or hash filenames.
8. ART STYLE: Dark fantasy action manhwa webtoon art style, sharp black ink linework, high contrast cel shading, cinematic dramatic lighting, textless ${aspectInstruction}.`
}

// Failed & Cluttered Prompts Drawer State
const isFailedDrawerOpen = ref(false)
const failedDrawerBatchFilter = ref('all')
const failedDrawerIssueFilter = ref('all')
const activeCopiedFailedTag = ref(null)

const openFailedDrawer = (batchIndex = 'all', issueType = 'all') => {
  failedDrawerBatchFilter.value = batchIndex
  failedDrawerIssueFilter.value = issueType
  isFailedDrawerOpen.value = true
}

const getSceneBatchName = (tag) => {
  const cleanTag = (tag || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const numMatch = cleanTag.match(/\d+/)
  if (!numMatch) return 'Batch A'
  const num = parseInt(numMatch[0], 10)
  const batchIdx = Math.floor((num - 1) / 24)
  const letter = String.fromCharCode(65 + batchIdx)
  return `Batch ${letter}`
}

const extractTokensFromText = (text) => {
  if (!text) return []
  const matches = [...text.matchAll(/@\{([^}]+)\}/g)]
  const unique = new Set()
  const list = []
  for (const m of matches) {
    const fullToken = m[0]
    if (!unique.has(fullToken)) {
      unique.add(fullToken)
      list.push(fullToken)
    }
  }
  return list
}

const resolveVaultModel = (tokenStr) => {
  if (!tokenStr) return null
  const cleanName = tokenStr.replace(/[@{}]/g, '').trim()
  
  // Find match in characterModels
  const match = characterModels.value.find(m => {
    if (m.token === tokenStr) return true
    if (m.flowName && m.flowName.toLowerCase() === cleanName.toLowerCase()) return true
    if (m.name && m.name.toLowerCase() === cleanName.toLowerCase()) return true
    if (m.dnaAnchor && m.dnaAnchor.includes(cleanName)) return true
    const cleanWithoutPrefix = cleanName.replace(/^(Weapon|Item|Prop|Artifact):\s*/i, '').trim()
    if (m.name && m.name.toLowerCase().includes(cleanWithoutPrefix.toLowerCase())) return true
    return false
  })

  if (match) {
    return match
  }

  // Fallback object if not found in vault
  const isWeapon = /^weapon:/i.test(cleanName) || /bow|sword|staff|blade|dagger/i.test(cleanName)
  const isArtifact = /^item:/i.test(cleanName) || /orb|ring|relic|crystal/i.test(cleanName)
  const isProp = /^prop:/i.test(cleanName) || /console|table|banner/i.test(cleanName)
  const cat = isWeapon ? 'Weapons' : (isArtifact ? 'Artifacts' : (isProp ? 'Props' : 'Characters'))

  return {
    id: cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: cleanName,
    flowName: cleanName,
    token: tokenStr,
    category: cat,
    role: cat,
    type: isWeapon ? 'weapon' : (isArtifact ? 'artifact' : (isProp ? 'prop' : 'character')),
    tier: 'Custom Ref',
    hasPlate: false,
    url: null,
    description: cleanName
  }
}

const getBatchVaultReferences = (items) => {
  if (!items || !items.length) return { models: [], count: 0, isOverLimit: false, tokens: [] }
  const uniqueTokens = new Set()
  for (const item of items) {
    const text = (item.prompt || '') + ' ' + (item.characterAnchor || '')
    const tokens = extractTokensFromText(text)
    tokens.forEach(t => uniqueTokens.add(t))
  }
  const seenModelKeys = new Set()
  const models = []
  for (const token of uniqueTokens) {
    const model = resolveVaultModel(token)
    if (model) {
      const key = (model.id || model.token || model.name).toLowerCase()
      if (!seenModelKeys.has(key)) {
        seenModelKeys.add(key)
        models.push(model)
      }
    }
  }
  return {
    models,
    count: models.length,
    isOverLimit: models.length > 10,
    tokens: Array.from(uniqueTokens)
  }
}

const getSceneReferences = (promptText) => {
  if (!promptText) return []
  const tokens = extractTokensFromText(promptText)
  const seenModelKeys = new Set()
  const models = []
  for (const token of tokens) {
    const model = resolveVaultModel(token)
    if (model) {
      const key = (model.id || model.token || model.name).toLowerCase()
      if (!seenModelKeys.has(key)) {
        seenModelKeys.add(key)
        models.push(model)
      }
    }
  }
  return models
}

const copyAllBatchTokens = async (models, batchName = '') => {
  if (!models || !models.length) return
  const tokenList = models.map(m => m.token || `@{${m.name}}`).join(', ')
  try {
    await navigator.clipboard.writeText(tokenList)
    copiedVaultId.value = batchName || 'batch_tokens'
    copiedVaultType.value = 'batch_tokens'
    triggerToast('Batch Tokens Copied', `✓ Copied all reference tokens for ${batchName || 'this batch'} to clipboard!`, 'success')
    setTimeout(() => {
      if (copiedVaultId.value === (batchName || 'batch_tokens') && copiedVaultType.value === 'batch_tokens') {
        copiedVaultId.value = null
        copiedVaultType.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Clipboard copy error:', err)
  }
}

const formatFlowReferenceHeader = (_references) => {
  // Omitted per operator directive (zero-bloat prompt payload)
  return ''
}

const copySingleScenePrompt = (scene) => {
  if (!scene) return
  const rawId = (scene.tag || '').replace(/[^A-Za-z0-9]/g, '')
  const num = rawId.replace(/IMG/i, '').padStart(3, '0')
  const tag = `IMG_${num}`
  const filename = `${tag}.jpg`
  const finalPrompt = transformTokens(scene.prompt, parsedEntities.value, promptTagMode.value)
  const sceneXml = `<scene id="${tag}" filename="${filename}">\n# Filename: ${filename}\n${finalPrompt}\n</scene>`
  
  const fRaw = route.params.franchiseId || 'Series_02'
  const eRaw = route.params.episodeId || 'EP01'
  const sNum = (fRaw.match(/Series_?(\d+)/i)?.[1] || '02').padStart(2, '0')
  const epNum = (eRaw.match(/EP?(\d+)/i)?.[1] || '01').padStart(2, '0')
  const collectionTitle = getCollectionName(`Single_${tag}`)
  const header = getFlowDirectiveHeader(collectionTitle)
  const payload = `${header}\n\n${sceneXml}`

  navigator.clipboard.writeText(payload).then(() => {
    activeCopiedFailedTag.value = scene.tag
    triggerToast('Prompt Copied', `✓ Copied XML <scene> prompt for [${scene.tag}] (${promptTagMode.value === 'uuid' ? '@UUID' : '@{Token}'})!`, 'success')
    setTimeout(() => {
      if (activeCopiedFailedTag.value === scene.tag) {
        activeCopiedFailedTag.value = null
      }
    }, 2500)
  }).catch(err => {
    console.error('Clipboard copy error:', err)
  })
}

const copySingleRawPrompt = (scene) => {
  if (!scene) return
  const finalPrompt = transformTokens(scene.prompt, parsedEntities.value, promptTagMode.value)
  navigator.clipboard.writeText(finalPrompt).then(() => {
    triggerToast('Plain Prompt Copied', `✓ Copied raw prompt text for [${scene.tag}] (${promptTagMode.value === 'uuid' ? '@UUID' : '@{Token}'})!`, 'success')
  })
}

const allScenesWithQa = computed(() => {
  const qaMap = new Map()
  if (qaAuditReport.value && Array.isArray(qaAuditReport.value.results)) {
    qaAuditReport.value.results.forEach(r => {
      qaMap.set(r.tag.toUpperCase(), r)
    })
  }

  return scenes.value.map(s => {
    const qaInfo = qaMap.get(s.tag.toUpperCase()) || null
    return {
      ...s,
      qa: qaInfo
    }
  })
})

const totalClutteredCount = computed(() => {
  return allScenesWithQa.value.filter(s => s.qa && s.qa.status === 'cluttered').length
})

const totalWarningCount = computed(() => {
  return allScenesWithQa.value.filter(s => s.qa && s.qa.status === 'warning').length
})

const totalMissingCount = computed(() => {
  return allScenesWithQa.value.filter(s => !s.hasImage).length
})

const totalFailedCount = computed(() => {
  return totalClutteredCount.value + totalWarningCount.value + totalMissingCount.value
})

const filteredFailedScenes = computed(() => {
  let list = allScenesWithQa.value

  // 1. Filter by Batch if selected
  if (failedDrawerBatchFilter.value !== 'all' && typeof failedDrawerBatchFilter.value === 'number') {
    const start = failedDrawerBatchFilter.value * 24
    const end = start + 24
    list = list.slice(start, end)
  }

  // 2. Filter by Issue Type
  if (failedDrawerIssueFilter.value === 'cluttered') {
    return list.filter(s => s.qa && s.qa.status === 'cluttered')
  }
  if (failedDrawerIssueFilter.value === 'warning') {
    return list.filter(s => s.qa && s.qa.status === 'warning')
  }
  if (failedDrawerIssueFilter.value === 'missing') {
    return list.filter(s => !s.hasImage)
  }

  // Default 'all': any scene that is cluttered, warning, or missing image
  return list.filter(s => !s.hasImage || (s.qa && (s.qa.status === 'cluttered' || s.qa.status === 'warning')))
})

// Helper to generate dynamic spreadsheet-style batch letters (A..Z, AA..AZ, BA..BZ, etc.)
const getBatchLetter = (index) => {
  let letter = ''
  let num = index
  while (num >= 0) {
    letter = String.fromCharCode((num % 26) + 65) + letter
    num = Math.floor(num / 26) - 1
  }
  return letter
}

const getCollectionName = (batchName) => {
  const fRaw = route.params.franchiseId || 'Series_02'
  const eRaw = route.params.episodeId || 'EP01'
  
  const sNum = (fRaw.match(/Series_?(\d+)/i)?.[1] || '02').padStart(2, '0')
  const epNum = (eRaw.match(/EP?(\d+)/i)?.[1] || '01').padStart(2, '0')

  const bLetterMatch = (batchName || '').match(/Batch\s+([A-Z]+)/i)
  const batchCode = bLetterMatch ? `Batch ${bLetterMatch[1]}` : (batchName || 'Batch')

  return `Series ${sNum} EP${epNum} ${batchCode}`
}

const copyFailedXmlPrompts = () => {
  const targetList = filteredFailedScenes.value
  if (!targetList.length) return

  const scenesXml = targetList.map(scene => {
    const rawId = scene.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    const finalPrompt = transformTokens(scene.prompt, parsedEntities.value, promptTagMode.value)
    return `<scene id="${tag}" filename="${filename}">\n# Filename: ${filename}\n${finalPrompt}\n</scene>`
  }).join('\n\n')

  const fRaw = route.params.franchiseId || 'Series_02'
  const eRaw = route.params.episodeId || 'EP01'
  const collectionTitle = getCollectionName(`Failed_${targetList.length}`)
  const header = getFlowDirectiveHeader(collectionTitle)
  const batchXml = `<batch id="Failed_and_Cluttered_Scenes" series="${fRaw}" episode="${eRaw}" scenes="Failed_${targetList.length}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${header}\n\n${batchXml}`

  navigator.clipboard.writeText(payload).then(() => {
    activeCopiedFailedTag.value = 'ALL_FILTERED'
    triggerToast('Batch XML Copied', `✓ Copied ${targetList.length} failed/cluttered scene XML prompts to clipboard!`, 'success')
    setTimeout(() => {
      if (activeCopiedFailedTag.value === 'ALL_FILTERED') {
        activeCopiedFailedTag.value = null
      }
    }, 2500)
  })
}

// Batch Accordion & Per-Batch Automation State
const expandedBatches = ref({ 0: true })
const batchActionState = ref({})
const isSynthesizingAll = ref(false)

const batchedScenes = computed(() => {
  const list = []
  const chunkSize = 24
  const total = scenes.value.length || 0
  const count = Math.ceil(total / chunkSize)

  const qaMap = new Map()
  if (qaAuditReport.value && Array.isArray(qaAuditReport.value.results)) {
    qaAuditReport.value.results.forEach(r => {
      qaMap.set(r.tag.toUpperCase(), r)
    })
  }

  for (let i = 0; i < count; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, total)
    const items = scenes.value.slice(start, end).map(s => {
      const qaInfo = qaMap.get(s.tag.toUpperCase()) || null
      return {
        ...s,
        qa: qaInfo
      }
    })
    const readyCount = items.filter(s => s.hasImage).length
    const cleanCount = items.filter(s => s.qa && (s.qa.status === 'clean' || s.qa.status === 'auto_cleaned')).length
    const warningCount = items.filter(s => s.qa && s.qa.status === 'warning').length
    const clutteredCount = items.filter(s => s.qa && s.qa.status === 'cluttered').length
    const missingCount = items.filter(s => !s.hasImage).length
    const failedCount = clutteredCount + warningCount + missingCount
    const letter = getBatchLetter(i)
    const batchVideoFilename = `01_Episode_Batch_${letter}_Preview.mp4`
    const hasVideo = Array.isArray(videoFiles.value) && videoFiles.value.some(f => f.filename === batchVideoFilename)
    const batchRefs = getBatchVaultReferences(items)

    list.push({
      index: i,
      letter,
      name: `Batch ${letter}`,
      label: `Batch ${letter}: Scenes ${String(start + 1).padStart(3, '0')}–${String(end).padStart(3, '0')}`,
      startTag: items[0]?.tag || `IMG_${String(start + 1).padStart(3, '0')}`,
      endTag: items[items.length - 1]?.tag || `IMG_${String(end).padStart(3, '0')}`,
      scenes: items,
      references: batchRefs.models,
      refCount: batchRefs.count,
      isOverLimit: batchRefs.isOverLimit,
      readyCount,
      totalCount: items.length,
      missingCount,
      cleanCount,
      warningCount,
      clutteredCount,
      failedCount,
      hasVideo,
      batchVideoFilename,
      isFullyReady: readyCount === items.length && items.length > 0,
      isFullyClean: (cleanCount === readyCount) && (readyCount === items.length) && items.length > 0,
      progressPercent: items.length ? Math.round((readyCount / items.length) * 100) : 0
    })
  }
  return list
})

const compiledBatchesCount = computed(() => {
  return batchedScenes.value.filter(b => b.hasVideo).length
})

const toggleBatch = (bIdx) => {
  expandedBatches.value[bIdx] = !expandedBatches.value[bIdx]
}

const areAllBatchesExpanded = computed(() => {
  if (batchedScenes.value.length === 0) return false
  return batchedScenes.value.every(b => expandedBatches.value[b.index])
})

const toggleAllBatches = () => {
  const target = !areAllBatchesExpanded.value
  batchedScenes.value.forEach(b => {
    expandedBatches.value[b.index] = target
  })
}

const synthesizeSingleBatch = async (batchIndex) => {
  const letter = getBatchLetter(batchIndex)
  const batch = batchedScenes.value.find(b => b.index === batchIndex)
  const totalInBatch = batch ? batch.totalCount : 24
  
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'visuals',
    status: 'running',
    progress: 10,
    message: `Synthesizing ${totalInBatch} storyboard panels for Batch ${letter}...`,
    logs: [`Initializing Puppeteer 1080p render pipeline for Batch ${letter}...`]
  }

  clearInterval(imagePollTimer)
  imagePollTimer = setInterval(async () => {
    try {
      const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/status`)
      const data = await res.json()
      if (data && data.status) {
        if (modalState.value.activeStage === 'visuals') {
          modalState.value.progress = data.progress || modalState.value.progress
          modalState.value.message = data.message || modalState.value.message
          if (data.log && data.log.length > 0) {
            modalState.value.logs = data.log
          }
        }
      }
    } catch (e) {}
  }, 800)

  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/generate-storyboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchIndex })
    })
    const data = await res.json()
    clearInterval(imagePollTimer)
    if (data.success) {
      modalState.value.status = 'completed'
      modalState.value.progress = 100
      modalState.value.message = `Successfully synthesized all ${data.count} panels for Batch ${letter}!`
      modalState.value.logs = [...modalState.value.logs, `Completed: ${data.count} panels rendered for Batch ${letter}.`]
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()
    } else {
      modalState.value.status = 'failed'
      modalState.value.message = data.error || 'Synthesis failed'
      modalState.value.logs = [...modalState.value.logs, `Error: ${modalState.value.message}`]
    }
  } catch (e) {
    clearInterval(imagePollTimer)
    modalState.value.status = 'failed'
    modalState.value.message = e.message
    modalState.value.logs = [...modalState.value.logs, `Error: ${e.message}`]
  }
}

const synthesizeAllBatches = async () => {
  isSynthesizingAll.value = true
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'visuals',
    status: 'running',
    progress: 5,
    message: `1-Click Synthesizing all ${scenes.value.length} storyboard panels...`,
    logs: ['Initializing Puppeteer 1080p render pipeline for all batches...']
  }

  clearInterval(imagePollTimer)
  imagePollTimer = setInterval(async () => {
    try {
      const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/status`)
      const data = await res.json()
      if (data && data.status) {
        if (modalState.value.activeStage === 'visuals') {
          modalState.value.progress = data.progress || modalState.value.progress
          modalState.value.message = data.message || modalState.value.message
          if (data.log && data.log.length > 0) {
            modalState.value.logs = data.log
          }
        }
      }
    } catch (e) {}
  }, 800)

  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/generate-storyboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force: false })
    })
    const data = await res.json()
    clearInterval(imagePollTimer)
    if (data.success) {
      modalState.value.status = 'completed'
      modalState.value.progress = 100
      modalState.value.message = `Successfully synthesized all ${data.count} panels across all batches!`
      modalState.value.logs = [...modalState.value.logs, `Completed: All ${data.count} panels rendered in 1080p.`]
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()
    } else {
      modalState.value.status = 'failed'
      modalState.value.message = data.error || 'Failed to synthesize all panels.'
      modalState.value.logs = [...modalState.value.logs, `Error: ${modalState.value.message}`]
    }
  } catch (e) {
    clearInterval(imagePollTimer)
    modalState.value.status = 'failed'
    modalState.value.message = e.message
    modalState.value.logs = [...modalState.value.logs, `Error: ${e.message}`]
  } finally {
    isSynthesizingAll.value = false
  }
}

const handleBatchScopedDrop = async (event, batchIndex) => {
  const dt = event.dataTransfer
  if (!dt) return

  const files = Array.from(dt.files)
  if (files.length === 0) return

  const zipFile = files.find(f => f.name.toLowerCase().endsWith('.zip'))
  if (zipFile) {
    await handleZipUpload(zipFile, batchIndex)
    return
  }

  await processBatchFiles(files, batchIndex)
}

const handleBatchDrop = async (e) => {
  const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : []
  if (files.length === 0) return

  // Check if a .zip archive was dropped
  const zipFile = files.find(f => f.name.toLowerCase().endsWith('.zip'))
  if (zipFile) {
    await handleZipUpload(zipFile)
    return
  }

  await processBatchFiles(files)
}

const fetchWithRetry = async (url, options = {}, retries = 2, delayMs = 600) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options)
      if (res.ok || attempt === retries) return res
      if ([500, 502, 503, 504].includes(res.status) && attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs * (attempt + 1)))
        continue
      }
      return res
    } catch (err) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs * (attempt + 1)))
        continue
      }
      throw err
    }
  }
}

const handleZipUpload = async (file, targetBatchIndex = null) => {
  batchUploading.value = true
  const batchLabel = typeof targetBatchIndex === 'number' ? `Batch ${targetBatchIndex + 1}` : 'Visual Deck'
  
  triggerToast('Processing ZIP Archive', `Unpacking "${file.name}" for ${batchLabel}...`, 'info', true)

  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'visuals',
    status: 'running',
    progress: 20,
    message: `Unpacking "${file.name}" and mapping visual scenes...`,
    logs: [
      `Reading ZIP archive "${file.name}"...`,
      `Extracting image files for ${batchLabel}...`,
      `Running semantic n-gram scene matcher...`
    ]
  }

  try {
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    modalState.value.progress = 50
    modalState.value.message = 'Sending visual assets to studio engine...'

    const res = await fetchWithRetry(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/upload-zip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zipBase64: base64Data,
        filename: file.name,
        batchIndex: typeof targetBatchIndex === 'number' ? targetBatchIndex : undefined
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Server returned ${res.status}: ${errText.slice(0, 100)}`)
    }

    const data = await res.json()
    if (data.success) {
      const extractedLogs = Array.isArray(data.extracted) 
        ? data.extracted.map(e => `[${e.tag}] ← ${e.sourceName} (Score: ${e.score})`) 
        : []

      modalState.value = {
        show: true,
        isMinimized: false,
        activeStage: 'visuals',
        status: 'completed',
        progress: 100,
        message: `Successfully unzipped and mapped ${data.count} visual panels!`,
        logs: [
          ...modalState.value.logs,
          ...extractedLogs,
          `✓ Successfully assigned all ${data.count} panels from "${file.name}".`
        ]
      }

      triggerToast('Ingestion Complete', `✓ Successfully mapped ${data.count} panels from "${file.name}"!`, 'success')
      batchUploadFeedback.value = `✓ Successfully unzipped and mapped ${data.count} visual panels from "${file.name}"!`
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()
    } else {
      throw new Error(data.error || 'Failed to unpack ZIP archive')
    }
  } catch (err) {
    console.error('ZIP upload failed:', err)
    modalState.value = {
      show: true,
      isMinimized: false,
      activeStage: 'visuals',
      status: 'failed',
      progress: 0,
      message: `ZIP Upload Failed: ${err.message}`,
      logs: [...modalState.value.logs, `Error: ${err.message}`]
    }
    triggerToast('Ingestion Failed', `ZIP Upload Error: ${err.message}`, 'error')
    batchUploadFeedback.value = `ZIP Upload Error: ${err.message}`
  } finally {
    batchUploading.value = false
    setTimeout(() => { batchUploadFeedback.value = '' }, 8000)
  }
}

const processBatchFiles = async (files, targetBatchIndex = null) => {
  const imageFiles = files.filter(f => /\.(png|jpe?g|webp)$/i.test(f.name))
  if (imageFiles.length === 0) {
    triggerToast('Upload Notice', 'No PNG, JPG, or WEBP images found in selection.', 'error')
    batchUploadFeedback.value = 'No PNG, JPG, or WEBP images found in selection.'
    setTimeout(() => { batchUploadFeedback.value = '' }, 4000)
    return
  }

  batchUploading.value = true
  triggerToast('Analyzing Panels', `Analyzing and matching ${imageFiles.length} images...`, 'info', true)

  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'visuals',
    status: 'running',
    progress: 15,
    message: `Analyzing and mapping ${imageFiles.length} images...`,
    logs: [`Processing ${imageFiles.length} loose images...`]
  }

  try {
    const candidateScenes = typeof targetBatchIndex === 'number' 
      ? scenes.value.slice(targetBatchIndex * 24, (targetBatchIndex + 1) * 24)
      : scenes.value

    const usedTags = new Set()
    const mappedItems = []

    for (const file of imageFiles) {
      const fileNameClean = file.name.toLowerCase().replace(/[^a-z0-9_]/g, ' ')

      // 1. Deterministic Tag Match: Check for exact scene index in filename (e.g. IMG001, IMG_001)
      let targetScene = null
      const tagMatch = file.name.match(/IMG_?0*(\d+)/i)
      if (tagMatch) {
        const num = parseInt(tagMatch[1], 10)
        const formattedTag = `IMG_${String(num).padStart(3, '0')}`
        targetScene = candidateScenes.find(s => s.tag === formattedTag && !usedTags.has(s.tag))
      }

      // 2. Number in filename match (e.g. 01.png, scene_1.jpg)
      if (!targetScene) {
        const numMatch = file.name.match(/(?:scene|panel|image|shot|cut)?[-_ ]*0*(\d+)/i)
        if (numMatch) {
          const num = parseInt(numMatch[1], 10)
          const formattedTag = `IMG_${String(num).padStart(3, '0')}`
          targetScene = candidateScenes.find(s => s.tag === formattedTag && !usedTags.has(s.tag))
        }
      }

      // 3. Keyword score matching against scene description & prompt
      if (!targetScene) {
        let highestScore = 0
        for (const s of candidateScenes) {
          if (usedTags.has(s.tag)) continue
          let score = 0
          const text = `${s.description} ${s.prompt}`.toLowerCase()
          const words = text.split(/[\s,._-]+/).filter(w => w.length >= 4)
          for (const word of words) {
            if (fileNameClean.includes(word)) {
              score += word.length
            }
          }
          if (score > highestScore) {
            highestScore = score
            targetScene = s
          }
        }
      }

      // 4. Fallback to first available scene in batch
      if (!targetScene) {
        targetScene = candidateScenes.find(s => !usedTags.has(s.tag))
      }

      if (targetScene) {
        usedTags.add(targetScene.tag)
        const base64Data = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
        mappedItems.push({ tag: targetScene.tag, base64Data, filename: file.name })
      }
    }

    // Sort by scene order
    mappedItems.sort((a, b) => a.tag.localeCompare(b.tag, undefined, { numeric: true }))

    modalState.value.progress = 40
    modalState.value.message = `Uploading ${mappedItems.length} matched panels...`

    // Chunk upload in batches of 4 to guarantee payload safety
    const chunkSize = 4
    let totalUploaded = 0

    for (let i = 0; i < mappedItems.length; i += chunkSize) {
      const chunk = mappedItems.slice(i, i + chunkSize)
      const currentProgress = Math.round(40 + (i / mappedItems.length) * 55)
      modalState.value.progress = currentProgress
      modalState.value.message = `Uploading panels ${i + 1} to ${Math.min(i + chunkSize, mappedItems.length)} of ${mappedItems.length}...`
      batchUploadFeedback.value = `Uploading panels ${i + 1} to ${Math.min(i + chunkSize, mappedItems.length)} of ${mappedItems.length}...`

      const res = await fetchWithRetry(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/batch-upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: chunk })
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Server returned ${res.status}: ${errText.slice(0, 100)}`)
      }

      const data = await res.json()
      if (data.success) {
        totalUploaded += data.count
        chunk.forEach(c => {
          modalState.value.logs.push(`[${c.tag}] ← ${c.filename} (Assigned ✓)`)
        })
      } else {
        throw new Error(data.error || 'Upload chunk failed')
      }
    }

    modalState.value = {
      show: true,
      isMinimized: false,
      activeStage: 'visuals',
      status: 'completed',
      progress: 100,
      message: `Successfully ingested and mapped ${totalUploaded} panels!`,
      logs: [
        ...modalState.value.logs,
        `✓ Finished mapping all ${totalUploaded} panels into the pipeline.`
      ]
    }

    triggerToast('Panels Ingested', `✓ Successfully ingested and mapped ${totalUploaded} panels!`, 'success')
    batchUploadFeedback.value = `✓ Successfully ingested and mapped ${totalUploaded} panels!`
    cacheBuster.value = Date.now()
    await loadScenes()
    await loadPipelineStatus()
  } catch (e) {
    modalState.value = {
      show: true,
      isMinimized: false,
      activeStage: 'visuals',
      status: 'failed',
      progress: 0,
      message: `Batch Upload Error: ${e.message}`,
      logs: [...modalState.value.logs, `Error: ${e.message}`]
    }
    triggerToast('Upload Error', e.message, 'error')
    batchUploadFeedback.value = `Batch upload error: ${e.message}`
  } finally {
    batchUploading.value = false
    setTimeout(() => { batchUploadFeedback.value = '' }, 8000)
  }
}

// BGM & Sidechain Ducking State
const bgmTracks = ref([])
const selectedBgmTrack = ref('01_Catacombs_SubBass_Drone.mp3')
const selectedBgmVolume = ref(-22)
const activePreviewTrack = ref(null)
const bgmAudioPlayer = ref(null)

// Brand Watermark & Channel Identity Overlay State
const burnWatermark = ref(true)
const watermarkLogoUrl = ref('/brand/recap_runic_logo_transparent.png')
const watermarkOpacity = ref(0.20)
const watermarkPosition = ref('top_right')
const watermarkPositions = [
  { id: 'top_right', label: 'Top-Right (Option B — Default)', desc: 'Standard broadcast watermark position', xDesc: 'Right (W-w-36)', yDesc: 'Top (36px)' },
  { id: 'top_left', label: 'Top-Left', desc: 'Alternative upper corner placement', xDesc: 'Left (36px)', yDesc: 'Top (36px)' },
  { id: 'bottom_right', label: 'Bottom-Right', desc: 'Subtle lower corner placement', xDesc: 'Right (W-w-36)', yDesc: 'Bottom (H-h-36)' },
  { id: 'bottom_left', label: 'Bottom-Left', desc: 'Lower left watermark placement', xDesc: 'Left (36px)', yDesc: 'Bottom (H-h-36)' },
  { id: 'custom_user', label: 'Custom Option A (65% X / 25% Y)', desc: 'Offset focal aesthetic from bottom', xDesc: 'X: 65%', yDesc: 'Y: 25% from bottom' }
]
const opacityPresets = [
  { value: 0.10, label: '10% (Ghost)' },
  { value: 0.20, label: '20% (Subtle — Default)' },
  { value: 0.35, label: '35% (Balanced)' },
  { value: 0.50, label: '50% (Prominent)' }
]

const getWatermarkPreviewStyle = computed(() => {
  switch (watermarkPosition.value) {
    case 'top_left':
      return { top: '8px', left: '8px' }
    case 'bottom_right':
      return { bottom: '8px', right: '8px' }
    case 'bottom_left':
      return { bottom: '8px', left: '8px' }
    case 'custom_user':
      return { bottom: '25%', left: '65%', transform: 'translate(-50%, 50%)' }
    case 'top_right':
    default:
      return { top: '8px', right: '8px' }
  }
})

const loadBgmTracks = async () => {
  try {
    const res = await fetch('/api/bgm')
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      bgmTracks.value = data
    }
  } catch (e) {
    console.warn('Failed to load BGM tracks:', e)
  }
}

const selectBgmTrack = (filename) => {
  selectedBgmTrack.value = filename
}

const togglePreviewBgm = (track) => {
  if (!bgmAudioPlayer.value) return
  if (activePreviewTrack.value === track.filename) {
    bgmAudioPlayer.value.pause()
    activePreviewTrack.value = null
  } else {
    activePreviewTrack.value = track.filename
    bgmAudioPlayer.value.src = track.url
    bgmAudioPlayer.value.volume = 0.75
    bgmAudioPlayer.value.play().catch((err) => {
      console.warn('BGM preview play error:', err)
      activePreviewTrack.value = null
    })
  }
}

const onBgmEnded = () => {
  activePreviewTrack.value = null
}

const subtitles = ref({ srt: '', vtt: '', hasSubtitles: false })
const compiling = ref(false)
const videoStatus = ref({ status: 'idle', progress: 0, message: '' })
let pollTimer = null

const pipeline = ref({
  totalScenes: 0,
  imagesReady: 0,
  audioReady: 0,
  hasMasterAudio: false,
  hasSubtitles: false,
  hasVideo: false,
  videoSize: 0
})

const videoFiles = ref([])
const selectedVideoFile = ref('01_Episode_Master_1080p.mp4')
const selectedBatchTarget = ref('all')
const compilationScope = ref('auto')
const autoCompileStrategy = ref('skip_compiled') // 'skip_compiled' | 'fresh_all'
const selectedBatchIndex = ref(0)
const selectedBatchIndices = ref([0, 1, 2, 3, 4, 5, 6, 7, 8]) // Default all 9 batches selected
const autoStitchGrouped = ref(true)
const omnibusOutputName = ref('00_Season_01_Omnibus_1080p.mp4')
const selectedOmnibusFiles = ref([])

const activeVideoMeta = computed(() => {
  return videoFiles.value.find(f => f.filename === selectedVideoFile.value) || {
    filename: selectedVideoFile.value,
    size: pipeline.value.videoSize || 0,
    isMaster: selectedVideoFile.value.includes('Master'),
    isOmnibus: selectedVideoFile.value.includes('Omnibus'),
    isShort: selectedVideoFile.value.startsWith('shorts/'),
    label: selectedVideoFile.value,
    batchLetter: (selectedVideoFile.value.match(/Batch_([A-Za-z0-9_]+)_Preview/i) || [])[1] || null
  }
})

const activeBadgeLabel = computed(() => {
  const meta = activeVideoMeta.value
  const filename = meta.filename || ''
  
  if (meta.isShort || filename.startsWith('shorts/')) {
    return '⚡ Viral Short (9:16)'
  }

  if (meta.isOmnibus || filename.includes('Omnibus')) {
    return '🏆 Grand Omnibus Cut'
  }
  
  const masterBatchMatch = filename.match(/Master_Batches_([A-Za-z0-9_-]+)_1080p/i)
  if (masterBatchMatch) {
    const range = masterBatchMatch[1].replace('-', '–').replace(/_/g, ', ')
    return `🌟 Master (Batches ${range})`
  }
  
  if (meta.isMaster || filename === '01_Episode_Master_1080p.mp4') {
    return '🌟 Master (Full Episode)'
  }
  
  if (meta.batchLetter) {
    return `🎬 Batch ${meta.batchLetter} Preview (24 Cuts)`
  }
  
  return '🎬 Video Preview'
})

const activeBadgeClass = computed(() => {
  const meta = activeVideoMeta.value
  if (meta.isShort || meta.filename?.startsWith('shorts/')) {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
  }
  if (meta.isOmnibus || meta.filename?.includes('Omnibus')) {
    return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
  }
  if (meta.isMaster || meta.filename?.includes('Master')) {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
  }
  return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
})

const currentSelectedBatch = computed(() => {
  return batchedScenes.value.find(b => b.index === selectedBatchIndex.value) || batchedScenes.value[0] || null
})

const groupedBatchDescriptor = computed(() => {
  if (selectedBatchIndices.value.length === 0) return 'None'
  const letters = selectedBatchIndices.value.map(i => availableBatches.value[i]?.letter || String.fromCharCode(65 + i))
  letters.sort()
  const charCodes = letters.map(l => l.charCodeAt(0))
  let isContiguous = true
  for (let i = 1; i < charCodes.length; i++) {
    if (charCodes[i] !== charCodes[i - 1] + 1) {
      isContiguous = false
      break
    }
  }
  if (isContiguous && letters.length > 1) {
    return `Batches_${letters[0]}-${letters[letters.length - 1]}`
  } else {
    return `Batches_${letters.join('_')}`
  }
})

const selectMissingBatchesOnly = () => {
  selectedBatchIndices.value = batchedScenes.value
    .filter(b => !b.hasVideo)
    .map(b => b.index)
}

const selectAllBatches = () => {
  selectedBatchIndices.value = batchedScenes.value.map(b => b.index)
}

const deselectAllBatches = () => {
  selectedBatchIndices.value = []
}

const toggleBatchSelection = (idx) => {
  const i = selectedBatchIndices.value.indexOf(idx)
  if (i >= 0) {
    selectedBatchIndices.value.splice(i, 1)
  } else {
    selectedBatchIndices.value.push(idx)
    selectedBatchIndices.value.sort((a, b) => a - b)
  }
}

const availableBatches = computed(() => {
  const total = scenes.value.length || 216
  const chunkSize = 24
  const count = Math.ceil(total / chunkSize)
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
  const list = []
  for (let i = 0; i < count; i++) {
    const start = i * chunkSize + 1
    const end = Math.min((i + 1) * chunkSize, total)
    const letter = letters[i] || `Batch_${i + 1}`
    list.push({
      index: i,
      letter,
      label: `Batch ${letter} (Scenes ${String(start).padStart(3, '0')}–${String(end).padStart(3, '0')})`,
      filename: `01_Episode_Batch_${letter}_Preview.mp4`
    })
  }
  return list
})

const getDownloadFilename = (filename) => {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`
  const franchise = route.params.franchiseId || 'Series'
  const episode = route.params.episodeId || 'EP01'
  const cleanBase = (filename || '01_Episode_Master_1080p.mp4')
    .replace(/^shorts\//, '')
    .replace(/^01_Episode_/, '')
    .replace(/\.mp4$/i, '')
  return `${franchise}_${episode}_${cleanBase}_${timestamp}.mp4`
}

const loadVideoFiles = async () => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/video-files`)
    const files = await res.json()
    videoFiles.value = files || []
    if (files && files.length > 0) {
      if (!files.some(f => f.filename === selectedVideoFile.value)) {
        selectedVideoFile.value = files[0].filename
      }
    }
  } catch (e) {}
}

const loadPipelineStatus = async () => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/pipeline-status`)
    pipeline.value = await res.json()
    await loadVideoFiles()
  } catch (e) {}
}

const loadScenes = async () => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images`)
    scenes.value = await res.json()
  } catch (e) {}
}

const loadSubtitles = async () => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/subtitles`)
    subtitles.value = await res.json()
  } catch (e) {}
}

const generateStoryboards = async () => {
  generatingStoryboards.value = true
  storyboardFeedback.value = ''
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'visuals',
    status: 'running',
    progress: 5,
    message: `Synthesizing ${scenes.value.length} 1080p storyboard panels...`,
    logs: ['Initializing Puppeteer 1080p render pipeline...']
  }

  clearInterval(imagePollTimer)
  imagePollTimer = setInterval(async () => {
    try {
      const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/status`)
      const data = await res.json()
      if (data && data.status) {
        if (modalState.value.activeStage === 'visuals') {
          modalState.value.progress = data.progress || modalState.value.progress
          modalState.value.message = data.message || modalState.value.message
          if (data.log && data.log.length > 0) {
            modalState.value.logs = data.log
          }
        }
      }
    } catch (e) {}
  }, 800)

  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/generate-storyboard`, {
      method: 'POST'
    })
    const data = await res.json()
    clearInterval(imagePollTimer)
    if (data.success) {
      modalState.value.status = 'completed'
      modalState.value.progress = 100
      modalState.value.message = `Successfully synthesized all ${data.count} 1080p panels!`
      modalState.value.logs = [...modalState.value.logs, `Completed: ${data.count} panels rendered in 1080p.`]
      storyboardFeedback.value = `Successfully synthesized ${data.count} 1080p storyboard panels!`
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()
    } else {
      modalState.value.status = 'failed'
      modalState.value.message = data.error || 'Failed to synthesize storyboard panels.'
      modalState.value.logs = [...modalState.value.logs, `Error: ${modalState.value.message}`]
    }
  } catch (e) {
    clearInterval(imagePollTimer)
    modalState.value.status = 'failed'
    modalState.value.message = e.message
    modalState.value.logs = [...modalState.value.logs, `Network error: ${e.message}`]
  } finally {
    generatingStoryboards.value = false
  }
}

const handleFileInput = async (event, tag) => {
  const file = event.target.files[0]
  if (!file) return
  uploadingCardTags.value = new Set(uploadingCardTags.value).add(tag)
  triggerToast('Uploading Panel', `Uploading image for [${tag}]...`, 'info', true)
  const reader = new FileReader()
  reader.onload = async (e) => {
    await uploadBase64(tag, e.target.result)
  }
  reader.readAsDataURL(file)
}

const handleFileDrop = async (event, tag) => {
  const file = event.dataTransfer.files[0]
  if (!file) return
  uploadingCardTags.value = new Set(uploadingCardTags.value).add(tag)
  triggerToast('Uploading Panel', `Uploading image for [${tag}]...`, 'info', true)
  const reader = new FileReader()
  reader.onload = async (e) => {
    await uploadBase64(tag, e.target.result)
  }
  reader.readAsDataURL(file)
}

const uploadBase64 = async (tag, base64Data) => {
  uploadingCardTags.value = new Set(uploadingCardTags.value).add(tag)
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag, base64Data })
    })
    const data = await res.json()
    if (data.success) {
      triggerToast('Panel Updated', `✓ [${tag}] visual panel successfully updated!`, 'success')
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()

      if (data.qa && qaAuditReport.value && Array.isArray(qaAuditReport.value.results)) {
        const cleanTag = tag.toUpperCase()
        const idx = qaAuditReport.value.results.findIndex(r => r.tag.toUpperCase() === cleanTag)
        const updatedItem = {
          filename: data.filename,
          tag: cleanTag,
          ...data.qa
        }
        if (idx >= 0) {
          qaAuditReport.value.results[idx] = updatedItem
        } else {
          qaAuditReport.value.results.push(updatedItem)
        }
      }
    } else {
      triggerToast('Upload Failed', data.error || `Failed to upload [${tag}]`, 'error')
    }
  } catch (e) {
    triggerToast('Upload Error', e.message || `Error uploading [${tag}]`, 'error')
  } finally {
    const updated = new Set(uploadingCardTags.value)
    updated.delete(tag)
    uploadingCardTags.value = updated
  }
}

const generateVoiceoverAndSubtitles = async () => {
  synthesizingAudio.value = true
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'audio',
    status: 'running',
    progress: 5,
    message: `Connecting to Edge-TTS neural engine (${selectedVoice.value})...`,
    logs: [`Initializing Edge-TTS neural engine with voice ${selectedVoice.value}...`]
  }

  clearInterval(ttsPollTimer)
  ttsPollTimer = setInterval(async () => {
    try {
      const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/tts-status`)
      const data = await res.json()
      if (data && data.status) {
        if (modalState.value.activeStage === 'audio') {
          modalState.value.progress = data.progress || modalState.value.progress
          modalState.value.message = data.message || modalState.value.message
          if (data.log && data.log.length > 0) {
            modalState.value.logs = data.log
          }
        }
      }
    } catch (e) {}
  }, 800)

  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/generate-tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voice: selectedVoice.value })
    })
    const data = await res.json()
    clearInterval(ttsPollTimer)
    if (data.success) {
      modalState.value.status = 'completed'
      modalState.value.progress = 100
      modalState.value.message = `Master audio & ${data.subtitleCount || 255} subtitle cues synchronized!`
      modalState.value.logs = [...modalState.value.logs, `Success: Generated ${data.generatedCount} scenes & ${data.subtitleCount} cues.`]
      await loadSubtitles()
      await loadPipelineStatus()
    } else {
      modalState.value.status = 'failed'
      modalState.value.message = data.error || 'Failed to generate voiceover audio.'
      modalState.value.logs = [...modalState.value.logs, `Error: ${modalState.value.message}`]
    }
  } catch (e) {
    clearInterval(ttsPollTimer)
    modalState.value.status = 'failed'
    modalState.value.message = e.message
    modalState.value.logs = [...modalState.value.logs, `Network error: ${e.message}`]
  } finally {
    synthesizingAudio.value = false
  }
}

const parsedSubtitles = computed(() => {
  if (!subtitles.value.srt) return []
  const blocks = subtitles.value.srt.split(/\n\s*\n/)
  const result = []
  for (const block of blocks) {
    const lines = block.trim().split('\n')
    if (lines.length >= 3) {
      const timeLine = lines[1]
      const text = lines.slice(2).join(' ')
      const match = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})/)
      let startSeconds = 0
      if (match) {
        const parts = match[1].split(/[:,]/)
        startSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]) + parseInt(parts[3]) / 1000
      }
      result.push({
        timecode: timeLine.split('-->')[0].trim(),
        text,
        startSeconds
      })
    }
  }
  return result
})

const seekAudio = (seconds) => {
  if (masterAudioPlayer.value) {
    masterAudioPlayer.value.currentTime = seconds
    masterAudioPlayer.value.play()
  }
}

const compileBatchDirect = (batchIdx) => {
  activeStage.value = 'compiler'
  compilationScope.value = 'batch'
  selectedBatchIndex.value = batchIdx
  compileVideo(batchIdx)
}

const triggerCompilation = () => {
  if (compilationScope.value === 'auto') {
    autoCompileAllBatches()
  } else if (compilationScope.value === 'batch') {
    compileGroupedBatchesAction()
  } else if (compilationScope.value === 'stitch') {
    stitchBatches()
  } else if (compilationScope.value === 'omnibus') {
    stitchOmnibusAction()
  } else {
    compileVideo()
  }
}

const compileGroupedBatchesAction = async () => {
  if (selectedBatchIndices.value.length === 0) return
  compiling.value = true
  const selectedLetters = selectedBatchIndices.value.map(i => availableBatches.value[i]?.letter || String.fromCharCode(65 + i)).join(', ')
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'compiler',
    status: 'running',
    progress: 5,
    message: `Initializing Grouped Queue for ${selectedBatchIndices.value.length} batches (${selectedLetters})...`,
    logs: [
      `Starting selective grouped batch compilation for batches: ${selectedLetters}...`,
      `Frame Rate: 24 FPS Standard (6 parallel CPU threads).`,
      autoStitchGrouped.value ? `Will losslessly auto-stitch into 01_Episode_Master_${groupedBatchDescriptor.value}_1080p.mp4.` : 'Auto-stitch disabled.'
    ]
  }

  try {
    const payload = {
      batchIndices: selectedBatchIndices.value,
      autoStitch: autoStitchGrouped.value,
      kenBurns: true,
      burnSubtitles: true,
      bgmTrack: selectedBgmTrack.value,
      bgmVolume: selectedBgmVolume.value,
      watermark: burnWatermark.value,
      watermarkOpacity: watermarkOpacity.value,
      watermarkPosition: watermarkPosition.value,
      force: true
    }

    await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/compile-grouped-batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    startPolling(false, null, true)
  } catch (e) {
    compiling.value = false
    modalState.value.status = 'failed'
    modalState.value.message = e.message
    modalState.value.logs = [...modalState.value.logs, `Grouped compile error: ${e.message}`]
  }
}

const stitchOmnibusAction = async () => {
  if (selectedOmnibusFiles.value.length < 2) return
  compiling.value = true
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'compiler',
    status: 'running',
    progress: 10,
    message: `Losslessly stitching ${selectedOmnibusFiles.value.length} Master Videos into ${omnibusOutputName.value}...`,
    logs: [
      `Assembling Grand Omnibus from: ${selectedOmnibusFiles.value.join(', ')}...`
    ]
  }

  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/stitch-master-omnibus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        masterFilePaths: selectedOmnibusFiles.value,
        outputFilename: omnibusOutputName.value
      })
    })
    const data = await res.json()
    if (data.success) {
      compiling.value = false
      modalState.value.status = 'completed'
      modalState.value.progress = 100
      modalState.value.message = `Grand Omnibus (${data.filename}) successfully stitched in <2 seconds!`
      await loadVideoFiles()
    } else {
      throw new Error(data.error || 'Omnibus stitching failed')
    }
  } catch (e) {
    compiling.value = false
    modalState.value.status = 'failed'
    modalState.value.message = e.message
  }
}

const autoCompileAllBatches = async () => {
  const isSkip = autoCompileStrategy.value === 'skip_compiled'
  compiling.value = true
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'compiler',
    status: 'running',
    progress: 5,
    message: isSkip 
      ? 'Initializing Auto-Queue (Skipping already compiled batches)...' 
      : 'Initializing Auto-Queue (Fresh All: Recompiling 100% batches)...',
    logs: [
      `Starting automated sequential compilation (${isSkip ? 'Skip Already Compiled Batches' : 'Fresh All Re-render'})...`,
      'Memory will be flushed after each batch. Master video will be auto-stitched at the end.'
    ]
  }

  try {
    const payload = {
      kenBurns: true,
      burnSubtitles: true,
      bgmTrack: selectedBgmTrack.value,
      bgmVolume: selectedBgmVolume.value,
      watermark: burnWatermark.value,
      watermarkOpacity: watermarkOpacity.value,
      watermarkPosition: watermarkPosition.value,
      skipExisting: isSkip,
      force: true
    }

    await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/auto-compile-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    startPolling(false, null, true)
  } catch (e) {
    compiling.value = false
    modalState.value.status = 'failed'
    modalState.value.message = e.message
    modalState.value.logs = [...modalState.value.logs, `Auto-compile error: ${e.message}`]
  }
}

const stitchBatches = async () => {
  compiling.value = true
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'compiler',
    status: 'running',
    progress: 10,
    message: `Losslessly stitching ${compiledBatchesCount.value} compiled batches into Master 1080p video...`,
    logs: [
      `Executing instant lossless FFmpeg stream copy (-c copy) across ${compiledBatchesCount.value} batches...`
    ]
  }

  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/stitch-batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const data = await res.json()
    if (data.success) {
      startPolling(false, null, false, true)
    } else {
      throw new Error(data.error || 'Stitching failed')
    }
  } catch (e) {
    compiling.value = false
    modalState.value.status = 'failed'
    modalState.value.message = e.message
    modalState.value.logs = [...modalState.value.logs, `Stitch error: ${e.message}`]
  }
}

const compileVideo = async (targetBatchIdx = null) => {
  const isBatch = targetBatchIdx !== null || compilationScope.value === 'batch'
  const bIdx = targetBatchIdx !== null ? targetBatchIdx : selectedBatchIndex.value
  const bLetter = getBatchLetter(bIdx)
  const bObj = batchedScenes.value.find(b => b.index === bIdx) || { name: `Batch ${bLetter}`, letter: bLetter, totalCount: 24 }

  compiling.value = true
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'compiler',
    status: 'running',
    progress: 10,
    message: isBatch 
      ? `Initializing C++ Skia compilation for ${bObj.name} (${bObj.totalCount} cuts)...`
      : 'Initializing compilation for Full 1080p Master Episode...',
    logs: [
      isBatch 
        ? `Launching fast C++ Skia synthesis for ${bObj.name} (${bObj.totalCount} cuts)...`
        : 'Launching FFmpeg compilation job for Full 1080p Master Episode...'
    ]
  }

  try {
    const payload = {
      kenBurns: true,
      burnSubtitles: true,
      bgmTrack: selectedBgmTrack.value,
      bgmVolume: selectedBgmVolume.value,
      watermark: burnWatermark.value,
      watermarkOpacity: watermarkOpacity.value,
      watermarkPosition: watermarkPosition.value
    }
    if (isBatch) {
      payload.batchIndex = bIdx
    }

    await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/compile-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    startPolling(isBatch, bObj)
  } catch (e) {
    compiling.value = false
    modalState.value.status = 'failed'
    modalState.value.message = e.message
    modalState.value.logs = [...modalState.value.logs, `Compilation error: ${e.message}`]
  }
}

const startPolling = (isBatch = false, bObj = null, isAutoQueue = false, isStitch = false) => {
  clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/video-status`)
      const data = await res.json()
      videoStatus.value = data

      if (modalState.value.activeStage === 'compiler') {
        modalState.value.progress = data.progress || modalState.value.progress
        modalState.value.message = data.message || modalState.value.message
        if (data.log && data.log.length > 0) {
          modalState.value.logs = data.log
        }
      }

      if (data.status === 'completed') {
        clearInterval(pollTimer)
        compiling.value = false
        modalState.value.status = 'completed'
        modalState.value.progress = 100
        let successMsg = 'Master 1080p Video compiled successfully!'
        if (isBatch && bObj) {
          successMsg = `${bObj.name} Preview (${bObj.totalCount} cuts) compiled successfully!`
        } else if (isAutoQueue) {
          successMsg = 'All batches compiled & Master 1080p Video auto-stitched successfully!'
        } else if (isStitch) {
          successMsg = 'Master 1080p Video losslessly stitched in under 3 seconds!'
        }
        modalState.value.message = successMsg
        modalState.value.logs = [...(data.log || []), `${isBatch ? (bObj?.name || 'Batch') : 'Master 1080p'} MP4 ready with frame-accurate subtitles.`]
        cacheBuster.value = Date.now()
        await loadPipelineStatus()

        // Auto-select compiled batch preview or master video in player
        if (isBatch && bObj) {
          const expectedFilename = `01_Episode_Batch_${bObj.letter}_Preview.mp4`
          if (videoFiles.value.some(f => f.filename === expectedFilename)) {
            selectedVideoFile.value = expectedFilename
          }
        } else {
          selectedVideoFile.value = '01_Episode_Master_1080p.mp4'
        }
      } else if (data.status === 'failed') {
        clearInterval(pollTimer)
        compiling.value = false
        modalState.value.status = 'failed'
        modalState.value.message = data.message || 'FFmpeg compilation failed.'
        modalState.value.logs = [...(data.log || []), `Error: ${data.message}`]
      }
    } catch (e) {}
  }, 1000)
}

const handleProceedNext = (nextStage) => {
  activeStage.value = nextStage
  modalState.value.activeStage = nextStage
  modalState.value.status = 'idle'
  modalState.value.progress = 0
  modalState.value.message = ''
  modalState.value.logs = []
  if (nextStage === 'audio') {
    generateVoiceoverAndSubtitles()
  } else if (nextStage === 'compiler') {
    compileVideo()
  }
}

const handleSwitchStage = (stage) => {
  activeStage.value = stage
  modalState.value.activeStage = stage
}

onMounted(() => {
  loadPipelineStatus()
  loadScenes()
  loadSubtitles()
  loadBgmTracks()
  loadCharacterModels()
  loadFlowEntities()
})

onUnmounted(() => {
  clearInterval(pollTimer)
  clearInterval(imagePollTimer)
  clearInterval(ttsPollTimer)
  if (bgmAudioPlayer.value) {
    bgmAudioPlayer.value.pause()
  }
})
</script>
