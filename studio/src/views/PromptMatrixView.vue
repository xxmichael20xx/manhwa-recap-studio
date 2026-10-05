<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <router-link :to="`/franchises/${$route.params.franchiseId}`" class="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors">
          <ArrowLeft class="w-4 h-4" />
        </router-link>
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase font-semibold">{{ $route.params.franchiseId }}</span>
            <span class="text-slate-400">/</span>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ $route.params.episodeId }}</span>
          </div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
            <span>Visual Prompt Matrix Hub</span>
            <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">
              {{ parsedPrompts.length }} Master Plates
            </span>
          </h1>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <button 
          @click="loadEpisode"
          :disabled="generating"
          class="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': generating }" />
          <span>Sync</span>
        </button>

        <!-- Flow System Directive Button (Format-Aware: 16:9 vs 9:16) -->
        <button 
          @click="isDirectiveModalOpen = true"
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-blue-950/30 cursor-pointer"
          title="Open Google Flow System Instructions & Renaming Directives"
        >
          <FileCode2 class="w-4 h-4 text-cyan-200" />
          <span>Flow Instructions</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950/60 border border-blue-400/30 text-cyan-100 font-bold">
            {{ activeDirectiveFormat === '16:9' ? '16:9' : '9:16' }}
          </span>
        </button>

        <!-- Character & Item Vault Drawer Trigger -->
        <button 
          @click="isVaultDrawerOpen = true"
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-purple-600 to-indigo-600 hover:from-amber-500 hover:to-purple-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-purple-950/30 cursor-pointer"
        >
          <Users class="w-4 h-4 text-amber-200" />
          <span>Character & Item Vault</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950/60 border border-purple-400/30 text-purple-100">
            {{ vaultModels.length }} Plates
          </span>
        </button>

        <!-- Batch Copy Drawer Trigger Button -->
        <button 
          @click="isDrawerOpen = true"
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-purple-950/30 cursor-pointer"
        >
          <Layers class="w-4 h-4 text-purple-200" />
          <span>Batch Copy Hub</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-900/60 border border-purple-400/30 text-purple-100">
            {{ dynamicBatches.length }} {{ dynamicBatches.length === 1 ? 'Batch' : 'Batches' }}
          </span>
          <span v-if="copiedBatchesCount > 0" class="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {{ copiedBatchesCount }}/{{ dynamicBatches.length }} ✓
          </span>
        </button>

        <router-link 
          :to="`/tts/${$route.params.franchiseId}/${$route.params.episodeId}`"
          class="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
        >
          <Mic class="w-3.5 h-3.5" />
          <span>Audio</span>
        </router-link>
      </div>
    </div>

    <!-- Multi-Select & Filter Control Bar -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
      <!-- Filter Tabs -->
      <div class="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-mono">
        <button 
          @click="filterMode = 'all'"
          class="px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium"
          :class="filterMode === 'all' 
            ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-bold shadow-xs' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          All Scenes ({{ parsedPrompts.length }})
        </button>
        <button 
          @click="filterMode = 'missing'"
          class="px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center space-x-1.5"
          :class="filterMode === 'missing' 
            ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-bold shadow-xs' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          <span>Missing / Failed</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold" :class="missingCount > 0 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'">
            {{ missingCount }}
          </span>
        </button>
        <button 
          @click="filterMode = 'ready'"
          class="px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center space-x-1.5"
          :class="filterMode === 'ready' 
            ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          <span>Ready on Disk</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            {{ readyCount }}
          </span>
        </button>
      </div>

      <!-- Quick Selection Actions -->
      <div class="flex flex-wrap items-center gap-2">
        <button 
          @click="selectAll"
          class="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
        >
          Select All
        </button>
        <button 
          v-if="missingCount > 0"
          @click="selectMissing"
          class="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold border border-amber-300 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition cursor-pointer flex items-center space-x-1"
        >
          <AlertCircle class="w-3.5 h-3.5 text-amber-500" />
          <span>Select Missing ({{ missingCount }})</span>
        </button>
        <button 
          v-if="selectedTags.size > 0"
          @click="clearSelection"
          class="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-400 hover:text-rose-500 transition cursor-pointer"
        >
          Clear ({{ selectedTags.size }})
        </button>

        <!-- Copy Selected Button -->
        <button 
          v-if="selectedTags.size > 0"
          @click="copySelectedPrompts"
          class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
        >
          <Check v-if="activeCopiedIndex === 'SELECTED'" class="w-3.5 h-3.5 text-emerald-300" />
          <Zap v-else class="w-3.5 h-3.5 text-purple-200" />
          <span>{{ activeCopiedIndex === 'SELECTED' ? 'Selected XML Copied!' : `Copy Selected (${selectedTags.size} Scenes)` }}</span>
        </button>

        <!-- Direct Copy Missing Button -->
        <button 
          v-if="missingCount > 0 && selectedTags.size === 0"
          @click="copyMissingPrompts"
          class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
        >
          <Check v-if="activeCopiedIndex === 'MISSING'" class="w-3.5 h-3.5 text-emerald-300" />
          <AlertTriangle v-else class="w-3.5 h-3.5 text-amber-200" />
          <span>{{ activeCopiedIndex === 'MISSING' ? 'Missing XML Copied!' : `⚡ Copy Failed/Missing Only (${missingCount})` }}</span>
        </button>
      </div>
    </div>

    <!-- Prompts Table / Cards -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center space-x-3">
          <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
            Showing <strong class="text-slate-900 dark:text-white">{{ filteredPrompts.length }}</strong> of {{ parsedPrompts.length }} Scenes • Dynamic Chunks ({{ batchChunkSize }} scenes/batch)
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <span 
            v-for="(batch, bIdx) in dynamicBatches" 
            :key="bIdx"
            class="text-[11px] font-mono px-2.5 py-0.5 rounded border font-semibold flex items-center space-x-1"
            :class="copiedBatchIndices[bIdx] 
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'"
          >
            <CheckCircle2 v-if="copiedBatchIndices[bIdx]" class="w-3 h-3 text-emerald-500" />
            <span>{{ batch.name }}: {{ batch.startTag }}–{{ batch.endTag }}</span>
          </span>
        </div>
      </div>

      <div class="divide-y divide-slate-200 dark:divide-slate-800">
        <div 
          v-for="(p, index) in filteredPrompts" 
          :key="p.tag"
          class="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
          :class="{ 'bg-purple-50/20 dark:bg-purple-950/10': selectedTags.has(p.tag) }"
        >
          <!-- Multi-Select Checkbox -->
          <div class="pt-1">
            <input 
              type="checkbox" 
              :checked="selectedTags.has(p.tag)"
              @change="toggleSelect(p.tag)"
              class="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
          </div>

          <div class="space-y-2 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-mono px-2.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-bold">
                {{ p.tag }}
              </span>

              <!-- Status Tag (Ready vs Missing) -->
              <span 
                v-if="p.hasImage" 
                class="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-semibold flex items-center space-x-1"
              >
                <Check class="w-3 h-3 text-emerald-500" />
                <span>Ready</span>
              </span>
              <span 
                v-else 
                class="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-semibold flex items-center space-x-1"
              >
                <AlertCircle class="w-3 h-3 text-amber-500" />
                <span>Missing/Retry</span>
              </span>

              <span class="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold">
                Batch {{ Math.floor(index / batchChunkSize) + 1 }}
              </span>
              <template v-if="p.characterAnchor">
                <button 
                  v-for="anchor in p.characterAnchor.split(',').map(a => a.trim()).filter(Boolean)"
                  :key="anchor"
                  @click.stop="copyTokenDirect(anchor)"
                  class="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 font-semibold flex items-center space-x-1 cursor-pointer transition shadow-2xs"
                  :title="`Click to copy token '${anchor}'`"
                >
                  <Check v-if="copiedDirectToken === anchor" class="w-2.5 h-2.5 text-emerald-500" />
                  <Copy v-else class="w-2.5 h-2.5 text-amber-600/70 dark:text-amber-400/70" />
                  <span>{{ anchor }}</span>
                </button>
              </template>
              <span class="text-xs font-semibold text-slate-900 dark:text-white">{{ p.description }}</span>
            </div>
            <p class="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 break-words select-all leading-relaxed">
              {{ p.prompt }}
            </p>
          </div>

          <div class="shrink-0 pt-1 flex items-center space-x-2">
            <button 
              @click="copySinglePrompt(p, index)"
              class="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-purple-600 hover:text-white hover:border-purple-600 text-slate-700 dark:text-slate-200 text-xs font-mono font-medium flex items-center space-x-1.5 transition-all w-full md:w-auto justify-center cursor-pointer shadow-sm"
            >
              <Check v-if="copiedIndex === index" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ copiedIndex === index ? 'Copied XML' : 'Copy <scene>' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Batch Dispatch Side Drawer -->
    <Teleport to="body">
      <div 
        v-if="isDrawerOpen" 
        class="fixed inset-0 z-50 overflow-hidden"
        @keydown.esc="isDrawerOpen = false"
      >
        <!-- Backdrop -->
        <div 
          @click="isDrawerOpen = false" 
          class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
        />

        <!-- Slide-over Drawer Panel -->
        <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div class="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
            
            <!-- Drawer Header -->
            <div class="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2.5">
                  <div class="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                    <Layers class="w-5 h-5" />
                  </div>
                  <div>
                    <h2 class="text-base font-bold text-slate-900 dark:text-white">Batch Dispatch Hub</h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {{ parsedPrompts.length }} Scenes • Dynamic Google Flow Partitioning
                    </p>
                  </div>
                </div>
                <button 
                  @click="isDrawerOpen = false"
                  class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>

              <!-- Anti-Duplicate Tracker Progress -->
              <div class="mt-5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-slate-700 dark:text-slate-300">Dispatch Progress</span>
                  <span class="font-mono text-purple-600 dark:text-purple-400 font-bold">
                    {{ copiedBatchesCount }} of {{ dynamicBatches.length }} Batches Copied
                  </span>
                </div>
                <!-- Progress Bar -->
                <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-purple-600 to-emerald-500 transition-all duration-300"
                    :style="{ width: `${dynamicBatches.length ? (copiedBatchesCount / dynamicBatches.length) * 100 : 0}%` }"
                  />
                </div>
                <div class="flex items-center justify-between pt-1">
                  <span class="text-[11px] text-slate-400">
                    {{ copiedBatchesCount === dynamicBatches.length && dynamicBatches.length > 0 ? '🎉 All batches copied with zero duplicates!' : 'Copy batches sequentially to prevent duplicate scenes.' }}
                  </span>
                  <button 
                    v-if="copiedBatchesCount > 0"
                    @click="resetCopiedState" 
                    class="text-[11px] font-mono text-slate-500 hover:text-rose-500 flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw class="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <!-- Dedicated Missing / Failed Scenes Action in Drawer -->
              <div v-if="missingCount > 0" class="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-amber-700 dark:text-amber-300">Missing / Failed Scenes</span>
                  <p class="text-[10px] font-mono text-slate-500 dark:text-slate-400">{{ missingCount }} plates missing on disk</p>
                </div>
                <button 
                  @click="copyMissingPrompts"
                  class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer"
                >
                  {{ activeCopiedIndex === 'MISSING' ? 'Copied!' : `⚡ Copy ${missingCount} Missing` }}
                </button>
              </div>

              <!-- Batch Size Settings -->
              <div class="mt-4 flex items-center justify-between">
                <div>
                  <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">Scenes per Batch:</span>
                  <span class="text-[10px] font-mono text-purple-600 dark:text-purple-400 ml-1.5 font-bold">(Max: 24)</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <button 
                    v-for="size in [12, 18, 24]" 
                    :key="size"
                    @click="setBatchChunkSize(size)"
                    class="px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer"
                    :class="batchChunkSize === size 
                      ? 'bg-purple-600 text-white shadow-sm font-bold' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'"
                  >
                    {{ size }} {{ size === 24 ? '⚡ Max' : '' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Drawer Body: Dynamic Batch List -->
            <div class="p-6 space-y-3.5 overflow-y-auto flex-1">
              <!-- Standalone Directive Badge -->
              <div class="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-500/20 flex items-start space-x-2.5">
                <ShieldCheck class="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div class="text-[11px] text-purple-900 dark:text-purple-300 leading-relaxed font-mono">
                  <span class="font-bold">Anti-Grid & Auto-Retry Directive:</span> Forces Google Flow to generate <strong>1 standalone 9:16 vertical image per &lt;scene&gt;</strong> and mandates automatic retry on failed calls.
                </div>
              </div>

              <div 
                v-for="(batch, bIdx) in dynamicBatches" 
                :key="bIdx"
                class="p-4 rounded-xl border transition-all"
                :class="copiedBatchIndices[bIdx] 
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-500/40'"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <span 
                      class="px-2 py-0.5 rounded text-xs font-mono font-bold"
                      :class="copiedBatchIndices[bIdx] 
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                        : 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'"
                    >
                      {{ batch.name }}
                    </span>
                    <span class="text-xs font-semibold text-slate-900 dark:text-white">
                      Scenes {{ batch.startIndex + 1 }}–{{ batch.endIndex }}
                    </span>
                  </div>
                  <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {{ batch.items.length }} {{ batch.items.length === 1 ? 'scene' : 'scenes' }}
                  </span>
                </div>

                <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
                  <span>Range: <strong>{{ batch.startTag }}</strong> → <strong>{{ batch.endTag }}</strong></span>
                  <span v-if="copiedBatchIndices[bIdx]" class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>Copied & Pasted</span>
                  </span>
                  <span v-else class="text-slate-400">
                    Not copied yet
                  </span>
                </div>

                <!-- Action Button for Batch -->
                <div class="space-y-2">
                  <button 
                    @click="copyBatchByIndex(bIdx)"
                    class="w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
                    :class="copiedBatchIndices[bIdx]
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/20'"
                  >
                    <Check v-if="activeCopiedIndex === bIdx" class="w-4 h-4 text-emerald-200 animate-bounce" />
                    <Zap v-else class="w-4 h-4 text-purple-200" />
                    <span>
                      {{ activeCopiedIndex === bIdx 
                        ? `${batch.name} XML Copied to Clipboard!` 
                        : (copiedBatchIndices[bIdx] ? `Re-Copy ${batch.name} XML (${batch.items.length} Scenes)` : `⚡ Copy ${batch.name} XML (${batch.items.length} Scenes)`) 
                      }}
                    </span>
                  </button>

                </div>
              </div>

              <!-- Fallback Copy All In One -->
              <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button 
                  @click="copyAllMaster"
                  class="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Copy class="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                  <span>{{ activeCopiedIndex === 'ALL' ? 'All Scenes Copied!' : `Copy Entire Episode (All ${parsedPrompts.length} Scenes)` }}</span>
                </button>
              </div>
            </div>

            <!-- Drawer Footer -->
            <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-center">
              <p class="text-[11px] font-mono text-slate-400">
                Each batch is wrapped in clean &lt;scene id="..."&gt; containers for Google Flow Agent Mode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Character & Item Vault Side Drawer -->
    <Teleport to="body">
      <div 
        v-if="isVaultDrawerOpen" 
        class="fixed inset-0 z-50 overflow-hidden"
        @keydown.esc="isVaultDrawerOpen = false"
      >
        <!-- Backdrop -->
        <div 
          @click="isVaultDrawerOpen = false" 
          class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
        />

        <!-- Slide-over Drawer Panel -->
        <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div class="w-screen max-w-3xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
            
            <!-- Drawer Header -->
            <div class="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2.5">
                  <div class="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                    <Users class="w-5 h-5" />
                  </div>
                  <div>
                    <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>Character & Item Vault</span>
                      <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">
                        {{ vaultModels.length }} Reference Plates
                      </span>
                    </h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Master reference plates for Google Flow. Click Token to copy @{...}, Copy DNA, or Download plate directly.
                    </p>
                  </div>
                </div>
                <button 
                  @click="isVaultDrawerOpen = false"
                  class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>

              <!-- Category Filter Tabs -->
              <div class="mt-4 flex flex-wrap items-center gap-1.5 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-mono">
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

            <!-- Drawer Body: Grid of Cards -->
            <div class="p-6 space-y-4 overflow-y-auto flex-1">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  v-for="model in filteredVaultModels" 
                  :key="model.id"
                  class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 shadow-sm space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition"
                >
                  <div class="space-y-2.5">
                    <div class="flex items-start justify-between gap-1">
                      <div class="min-w-0 flex-1">
                        <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate" :title="model.name">{{ model.name }}</h4>
                        <span 
                          class="text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold inline-block mt-0.5 border"
                          :class="getCategoryBadgeClass(model.category)"
                        >
                          {{ model.category }} • {{ model.tier }}
                        </span>
                      </div>
                    </div>

                    <!-- Model Thumbnail Preview (16:9) -->
                    <div class="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative group">
                      <img :src="model.url" :alt="model.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
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
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {{ model.description }}
                    </p>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center justify-between pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 gap-1.5">
                    <button 
                      @click="downloadVaultPlate(model)"
                      class="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-mono font-semibold flex items-center space-x-1 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                      title="Download Master Reference Plate"
                    >
                      <Download class="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      <span>Download</span>
                    </button>
                    
                    <div class="flex items-center space-x-1">
                      <button 
                        @click="copyVaultName(model)"
                        class="px-2 py-1.5 rounded-lg transition cursor-pointer text-[10px] font-mono font-semibold flex items-center space-x-1"
                        :class="copiedVaultId === model.id && copiedVaultType === 'name' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'"
                        title="Copy Clean Reference Name WITHOUT @{} (for Google Flow Setup)"
                      >
                        <Check v-if="copiedVaultId === model.id && copiedVaultType === 'name'" class="w-3 h-3" />
                        <Tag v-else class="w-3 h-3 text-slate-500" />
                        <span>{{ copiedVaultId === model.id && copiedVaultType === 'name' ? 'Copied' : 'Name' }}</span>
                      </button>

                      <button 
                        @click="copyVaultToken(model)"
                        class="px-2 py-1.5 rounded-lg transition cursor-pointer text-[10px] font-mono font-semibold flex items-center space-x-1"
                        :class="copiedVaultId === model.id && copiedVaultType === 'token' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400'"
                        title="Copy Google Flow Token (@{...})"
                      >
                        <Check v-if="copiedVaultId === model.id && copiedVaultType === 'token'" class="w-3 h-3" />
                        <Copy v-else class="w-3 h-3" />
                        <span>{{ copiedVaultId === model.id && copiedVaultType === 'token' ? 'Copied' : 'Token' }}</span>
                      </button>

                      <button 
                        @click="copyVaultDna(model)"
                        class="px-2 py-1.5 rounded-lg transition cursor-pointer text-[10px] font-mono font-semibold flex items-center space-x-1"
                        :class="copiedVaultId === model.id && copiedVaultType === 'dna' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'"
                        title="Copy Complete Visual DNA Prompt"
                      >
                        <Check v-if="copiedVaultId === model.id && copiedVaultType === 'dna'" class="w-3 h-3" />
                        <Sparkles v-else class="w-3 h-3" />
                        <span>{{ copiedVaultId === model.id && copiedVaultType === 'dna' ? 'Copied' : 'DNA' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Drawer Footer -->
            <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-center">
              <p class="text-[11px] font-mono text-slate-400">
                All reference plates are locked in Franchise Character Vault for 100% visual consistency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Google Flow System Directive Modal (Format-Aware: 16:9 vs 9:16) -->
    <Teleport to="body">
      <div 
        v-if="isDirectiveModalOpen" 
        class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
        @keydown.esc="isDirectiveModalOpen = false"
      >
        <!-- Backdrop -->
        <div 
          @click="isDirectiveModalOpen = false" 
          class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        />

        <!-- Modal Card -->
        <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                <FileCode2 class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <span>Google Flow System Instructions</span>
                  <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">
                    {{ activeDirectiveFormat === '16:9' ? 'Format 2 (16:9)' : 'Format 1 (9:16)' }}
                  </span>
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Pre-execution requirement for sequential image synthesis & auto-renaming
                </p>
              </div>
            </div>
            <button 
              @click="isDirectiveModalOpen = false"
              class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Format Switcher Bar -->
          <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Series Format:</span>
            <div class="flex items-center space-x-1.5 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-mono">
              <button 
                @click="activeDirectiveFormat = '16:9'"
                class="px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1.5"
                :class="activeDirectiveFormat === '16:9' 
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <span>16:9 Full Bleed Landscape</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-mono font-bold">Series 02</span>
              </button>
              <button 
                @click="activeDirectiveFormat = '9:16'"
                class="px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1.5"
                :class="activeDirectiveFormat === '9:16' 
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <span>9:16 Vertical Webtoon</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 font-mono font-bold">Series 01</span>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-5 space-y-4 overflow-y-auto flex-1 font-mono text-xs">
            <div class="p-3.5 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200/60 dark:border-cyan-500/20 flex items-start space-x-2.5">
              <ShieldCheck class="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
              <p class="text-[11px] text-cyan-950 dark:text-cyan-200 leading-relaxed">
                <strong>Where to paste:</strong> Copy this instruction once into your Google Flow Assistant Settings / System Directives. The agent will automatically generate each scene and immediately invoke the file renaming tool sequentially in the same turn.
              </p>
            </div>

            <!-- Code Preview Block -->
            <div class="relative group">
              <pre class="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-[11px] leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto select-all">{{ currentDirectiveText }}</pre>
              <button 
                @click="copyDirective"
                class="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white text-[11px] font-bold border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
              >
                <Check v-if="copiedDirective" class="w-3.5 h-3.5 text-emerald-400" />
                <Copy v-else class="w-3.5 h-3.5 text-cyan-300" />
                <span>{{ copiedDirective ? 'Copied!' : 'Copy Directive' }}</span>
              </button>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between">
            <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Format: <strong class="text-slate-900 dark:text-white">{{ activeDirectiveFormat === '16:9' ? '16:9 Widescreen (1920x1080)' : '9:16 Vertical Webtoon (1080x1920)' }}</strong>
            </span>
            <div class="flex items-center space-x-2">
              <button 
                @click="isDirectiveModalOpen = false"
                class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
              <button 
                @click="copyDirective"
                class="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center space-x-2 transition shadow-md shadow-cyan-950/30 cursor-pointer"
              >
                <Check v-if="copiedDirective" class="w-4 h-4 text-emerald-200 animate-bounce" />
                <Copy v-else class="w-4 h-4 text-cyan-200" />
                <span>{{ copiedDirective ? `Copied ${activeDirectiveFormat} Directive!` : `⚡ Copy ${activeDirectiveFormat} Flow Instructions` }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, RefreshCw, Copy, Check, CheckCircle2, 
  Mic, Zap, Layers, X, RotateCcw, ShieldCheck, 
  AlertCircle, AlertTriangle, Play, Film, Loader2,
  Users, Download, ExternalLink, Sparkles, Tag, FileCode2
} from 'lucide-vue-next'

const route = useRoute()

// Character & Item Vault State
const isVaultDrawerOpen = ref(false)
const vaultModels = ref([])
const selectedVaultCategory = ref('all')
const copiedVaultId = ref(null)
const copiedVaultType = ref(null)
const copiedDirectToken = ref(null)

const loadVaultModels = async () => {
  try {
    const res = await fetch(`/api/franchises/${route.params.franchiseId}/character-models?cb=${Date.now()}`)
    const data = await res.json()
    if (Array.isArray(data)) {
      vaultModels.value = data
    }
  } catch (e) {
    console.warn('Failed to load character/item models:', e)
  }
}

const vaultCategories = computed(() => {
  const total = vaultModels.value.length
  const chars = vaultModels.value.filter(m => m.type === 'character' || ['protagonist', 'antagonist', 'supporting'].includes(m.category?.toLowerCase())).length
  const weapons = vaultModels.value.filter(m => m.category === 'Weapons').length
  const artifacts = vaultModels.value.filter(m => m.category === 'Artifacts').length
  const props = vaultModels.value.filter(m => m.category === 'Props').length

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

const filteredVaultModels = computed(() => {
  if (selectedVaultCategory.value === 'all') return vaultModels.value
  if (selectedVaultCategory.value === 'characters') {
    return vaultModels.value.filter(m => m.type === 'character' || ['protagonist', 'antagonist', 'supporting'].includes(m.category?.toLowerCase()))
  }
  if (selectedVaultCategory.value === 'items') {
    return vaultModels.value.filter(m => m.type !== 'character' || ['weapons', 'artifacts', 'props'].includes(m.category?.toLowerCase()))
  }
  return vaultModels.value.filter(m => 
    m.category?.toLowerCase() === selectedVaultCategory.value.toLowerCase() ||
    m.role?.toLowerCase() === selectedVaultCategory.value.toLowerCase()
  )
})

const copyVaultName = async (model) => {
  if (!model) return
  const cleanName = model.flowName || model.token?.replace(/[@{}]/g, '') || model.name
  try {
    await navigator.clipboard.writeText(cleanName)
    copiedVaultId.value = model.id
    copiedVaultType.value = 'name'
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

const copyVaultToken = async (model) => {
  if (!model) return
  const tokenText = model.token || `@{${model.name}}`
  try {
    await navigator.clipboard.writeText(tokenText)
    copiedVaultId.value = model.id
    copiedVaultType.value = 'token'
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

const copyVaultDna = async (model) => {
  if (!model) return
  const textToCopy = model.fullDna || model.dnaAnchor || model.description || `${model.name}, dark fantasy action manhwa webtoon art style, sharp ink linework, cinematic lighting`
  try {
    await navigator.clipboard.writeText(textToCopy)
    copiedVaultId.value = model.id
    copiedVaultType.value = 'dna'
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
  } catch (err) {
    const a = document.createElement('a')
    a.href = model.url
    a.download = model.filename || `${model.name}.jpg`
    a.target = '_blank'
    a.click()
  }
}

const copyTokenDirect = async (tokenStr) => {
  try {
    await navigator.clipboard.writeText(tokenStr)
    copiedDirectToken.value = tokenStr
    setTimeout(() => {
      if (copiedDirectToken.value === tokenStr) {
        copiedDirectToken.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Clipboard write error:', err)
  }
}
const parsedPrompts = ref([])
const rawMarkdown = ref('')
const generating = ref(false)
const copiedIndex = ref(null)
const batchCompilingIndex = ref(null)

const compileBatchPreview = async (index) => {
  batchCompilingIndex.value = index
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/compile-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        batchIndex: index,
        kenBurns: true, 
        burnSubtitles: true
      })
    })
    const data = await res.json()
    if (data.success) {
      setTimeout(() => {
        batchCompilingIndex.value = null
      }, 3000)
    }
  } catch (e) {
    batchCompilingIndex.value = null
  }
}

// Multi-Selection & Filtering State
const selectedTags = ref(new Set())
const filterMode = ref('all') // 'all', 'missing', 'ready'

// Side Drawer State & Anti-Duplicate Tracking
const isDrawerOpen = ref(false)
const batchChunkSize = ref(24) // Default 24 scenes per batch (Google Flow Maximum Limit)
const copiedBatchIndices = ref({})
const activeCopiedIndex = ref(null)

// Filtered Prompts
const filteredPrompts = computed(() => {
  if (filterMode.value === 'missing') {
    return parsedPrompts.value.filter(p => !p.hasImage)
  }
  if (filterMode.value === 'ready') {
    return parsedPrompts.value.filter(p => p.hasImage)
  }
  return parsedPrompts.value
})

const missingCount = computed(() => parsedPrompts.value.filter(p => !p.hasImage).length)
const readyCount = computed(() => parsedPrompts.value.filter(p => p.hasImage).length)

// Dynamic Batches Computation based on total parsed scenes
const dynamicBatches = computed(() => {
  if (!parsedPrompts.value || parsedPrompts.value.length === 0) return []
  const batches = []
  const total = parsedPrompts.value.length
  const chunkSize = batchChunkSize.value || 24
  const count = Math.ceil(total / chunkSize)

  for (let i = 0; i < count; i++) {
    const startIndex = i * chunkSize
    const endIndex = Math.min(startIndex + chunkSize, total)
    const items = parsedPrompts.value.slice(startIndex, endIndex)
    const startTag = items[0]?.tag || `IMG${String(startIndex + 1).padStart(3, '0')}`
    const endTag = items[items.length - 1]?.tag || `IMG${String(endIndex).padStart(3, '0')}`

    batches.push({
      name: `Batch ${String.fromCharCode(65 + i)}`, // Batch A, Batch B, Batch C...
      batchNumber: i + 1,
      startIndex,
      endIndex,
      startTag,
      endTag,
      items
    })
  }

  return batches
})

const copiedBatchesCount = computed(() => {
  return Object.values(copiedBatchIndices.value).filter(Boolean).length
})

const setBatchChunkSize = (size) => {
  batchChunkSize.value = size
  copiedBatchIndices.value = {} // Reset trackers when partition scheme changes
}

const resetCopiedState = () => {
  copiedBatchIndices.value = {}
  activeCopiedIndex.value = null
}

const toggleSelect = (tag) => {
  const s = new Set(selectedTags.value)
  if (s.has(tag)) s.delete(tag)
  else s.add(tag)
  selectedTags.value = s
}

const selectAll = () => {
  selectedTags.value = new Set(filteredPrompts.value.map(p => p.tag))
}

const selectMissing = () => {
  selectedTags.value = new Set(parsedPrompts.value.filter(p => !p.hasImage).map(p => p.tag))
}

const clearSelection = () => {
  selectedTags.value = new Set()
}

// Google Flow System Directive State & Auto-Detection
const isDirectiveModalOpen = ref(false)
const activeDirectiveFormat = ref('16:9') // '16:9' or '9:16'
const copiedDirective = ref(false)

const currentDirectiveText = computed(() => {
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const aspectRule = is16x9 
    ? '3. 16:9 FULL-BLEED LANDSCAPE COMPOSITION: Every scene must be rendered as an edge-to-edge 16:9 horizontal landscape manhwa illustration (1920x1080) with sharp ink linework, cinematic contrast, and zero split-panel grids.'
    : '3. 9:16 VERTICAL WEBTOON COMPOSITION: Every scene must be rendered as an independent full-frame 9:16 vertical manhwa asset (1080x1920) with sharp ink linework, cinematic contrast, and zero split-panel grids.'

  return `[PRE-EXECUTION REQUIREMENT: TWO-STEP GENERATION & SEQUENTIAL FILE RENAMING]
1. MANDATORY TWO-STEP EXECUTION: For every scene generated from the <scene> tags below, you MUST execute two sequential actions within the exact same turn:
   - Step 1 (Generation): Generate the visual plate matching the prompt and character/item DNA tokens.
   - Step 2 (Sequential Renaming): Immediately call the file renaming tool to rename each output file to its exact attribute name (e.g. "IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg").
2. STRICT ZERO-HASH NAMING: You are strictly forbidden from leaving files with randomized alphanumeric hashes, timestamps, or default names. Every file output must match filename="IMG_XXX.jpg" bit-for-bit.
${aspectRule}
4. TEXTLESS ARTWORK: Render pure illustration only. Do not embed speech bubbles, watermarks, or typography into the image unless explicitly quoted inside system HUD descriptions.
5. MANDATORY ANATOMICAL & QUALITY DIRECTIVE: Flawless human anatomy only. Exactly two arms, two legs, five fingers per hand, natural joint articulation. ZERO extra limbs, ZERO mutated hands, ZERO duplicate body parts, and ZERO severed or floating limbs.
6. MANDATORY LIMB CONNECTIVITY & ANTI-GHOST HANDS: Every hand holding an object, weapon, or prop MUST be physically and seamlessly attached to the character's wrist, forearm, and shoulder. ZERO floating hands, ZERO detached or ghost hands hovering in mid-air, ZERO severed appendages, and ZERO duplicate floating arms holding props.
7. MANDATORY FULL COMPLETION & AUTO-RETRY PROTOCOL: If any individual image generation fails, times out, or returns a policy/tool error, you MUST automatically retry that specific <scene> until all requested scenes in this prompt are successfully generated. Do not stop early or omit any scenes.`
})

const copyDirective = async () => {
  try {
    await navigator.clipboard.writeText(currentDirectiveText.value)
    copiedDirective.value = true
    setTimeout(() => {
      copiedDirective.value = false
    }, 2500)
  } catch (err) {
    console.error('Failed to copy directive:', err)
  }
}

const copyBatchByIndex = (index) => {
  const batch = dynamicBatches.value[index]
  if (!batch || !batch.items.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'

  const scenesXml = batch.items.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return `<scene id="${tag}" filename="${filename}">\n${p.prompt}\n</scene>`
  }).join('\n\n')

  const payload = `<batch id="${batch.name.replace(/\s+/g, '_')}" series="${franchiseId}" episode="${episodeId}" scenes="${batch.startTag}-${batch.endTag}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`

  navigator.clipboard.writeText(payload)
  
  // Mark this batch as copied to avoid duplicate generation
  copiedBatchIndices.value = {
    ...copiedBatchIndices.value,
    [index]: true
  }
  activeCopiedIndex.value = index

  setTimeout(() => {
    if (activeCopiedIndex.value === index) {
      activeCopiedIndex.value = null
    }
  }, 2500)
}

const copySelectedPrompts = () => {
  const selectedItems = parsedPrompts.value.filter(p => selectedTags.value.has(p.tag))
  if (!selectedItems.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'

  const scenesXml = selectedItems.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return `<scene id="${tag}" filename="${filename}">\n${p.prompt}\n</scene>`
  }).join('\n\n')

  const payload = `<batch id="Selected_Scenes" series="${franchiseId}" episode="${episodeId}" scenes="Selected_${selectedItems.length}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  navigator.clipboard.writeText(payload)
  
  activeCopiedIndex.value = 'SELECTED'
  setTimeout(() => {
    if (activeCopiedIndex.value === 'SELECTED') {
      activeCopiedIndex.value = null
    }
  }, 2500)
}

const copyMissingPrompts = () => {
  const missingItems = parsedPrompts.value.filter(p => !p.hasImage)
  if (!missingItems.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'

  const scenesXml = missingItems.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return `<scene id="${tag}" filename="${filename}">\n${p.prompt}\n</scene>`
  }).join('\n\n')

  const payload = `<batch id="Missing_Scenes" series="${franchiseId}" episode="${episodeId}" scenes="Missing_${missingItems.length}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  navigator.clipboard.writeText(payload)
  
  activeCopiedIndex.value = 'MISSING'
  setTimeout(() => {
    if (activeCopiedIndex.value === 'MISSING') {
      activeCopiedIndex.value = null
    }
  }, 2500)
}

const copyAllMaster = () => {
  if (!parsedPrompts.value.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'

  const scenesXml = parsedPrompts.value.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return `<scene id="${tag}" filename="${filename}">\n${p.prompt}\n</scene>`
  }).join('\n\n')

  const payload = `<batch id="Master_Deck" series="${franchiseId}" episode="${episodeId}" scenes="All_${parsedPrompts.value.length}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`

  navigator.clipboard.writeText(payload)
  
  // Mark all batches as copied
  const allCopied = {}
  dynamicBatches.value.forEach((_, idx) => {
    allCopied[idx] = true
  })
  copiedBatchIndices.value = allCopied
  activeCopiedIndex.value = 'ALL'

  setTimeout(() => {
    if (activeCopiedIndex.value === 'ALL') {
      activeCopiedIndex.value = null
    }
  }, 2500)
}

const loadEpisode = async () => {
  try {
    const [epRes, imgRes] = await Promise.all([
      fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}`),
      fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images`)
    ])
    const data = await epRes.json()
    const imagesData = await imgRes.json()
    
    const imageMap = new Map()
    if (Array.isArray(imagesData)) {
      imagesData.forEach(img => {
        imageMap.set(img.tag.toUpperCase(), img)
      })
    }

    rawMarkdown.value = data.promptMatrix || ''
    
    // Auto-detect Format (16:9 vs 9:16) from franchise ID and prompt matrix content
    const is16x9 = (route.params.franchiseId || '').toLowerCase().includes('series_02') || (rawMarkdown.value || '').includes('16:9')
    activeDirectiveFormat.value = is16x9 ? '16:9' : '9:16'
    
    parseMarkdownPrompts(rawMarkdown.value, imageMap)
  } catch (err) {
    console.error(err)
  }
}

const parseMarkdownPrompts = (markdown, imageMap = new Map()) => {
  const results = []

  // 1. Check for XML <scene id="IMG_001"> ... </scene> blocks
  const sceneRegex = /<scene\s+[^>]*id=["']?(IMG_?\d+)["']?[^>]*>\s*([\s\S]*?)\s*<\/scene>/gi
  let sMatch
  while ((sMatch = sceneRegex.exec(markdown)) !== null) {
    const rawTag = sMatch[1].replace(/_/g, '')
    const tag = `[${rawTag.replace(/(\d+)/, '_$1')}]`
    const promptText = sMatch[2].trim()
    const anchors = [...promptText.matchAll(/@\{([^}]+)\}/g)].map(m => m[0]).join(', ')
    
    const cleanTag = tag.replace(/[[\]]/g, '').toUpperCase()
    const imgInfo = imageMap.get(cleanTag)

    results.push({
      tag,
      description: `Scene Panel ${rawTag}`,
      characterAnchor: anchors,
      prompt: promptText,
      hasImage: imgInfo ? imgInfo.hasImage : false,
      imageUrl: imgInfo ? imgInfo.url : null
    })
  }

  if (results.length > 0) {
    // Enrich descriptions from table if present
    const lines = markdown.split('\n')
    for (const line of lines) {
      const match4 = line.match(/^\|\s*`?\[?(IMG_?\d+)\]?`?\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*(.+?)\s*\|(?:\s*$)?/i)
      if (match4) {
        const cleanTag = match4[1].toUpperCase()
        const item = results.find(r => r.tag.replace(/[[\]]/g, '').toUpperCase() === cleanTag)
        if (item) {
          item.description = match4[2].trim()
          if (match4[3].trim()) item.characterAnchor = match4[3].trim()
        }
      }
    }
    parsedPrompts.value = results
    return
  }

  // 2. Parse Markdown Table rows
  const lines = markdown.split('\n')
  for (const line of lines) {
    if (line.includes('---') || line.includes(':---') || line.toLowerCase().includes('scene tag')) continue

    // Check for 4-column table: | Tag | Layout Tier / Description | Anchor | Prompt |
    const match4 = line.match(/^\|\s*`?\[?(IMG_?\d+)\]?`?\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*(.+?)\s*\|(?:\s*$)?/i)
    if (match4) {
      const rawTag = match4[1].trim().toUpperCase()
      const tag = `[${rawTag}]`
      const cleanTag = rawTag
      const imgInfo = imageMap.get(cleanTag)
      const desc = match4[2].trim()
      const anchor = match4[3].trim()
      const prompt = match4[4].trim()

      results.push({
        tag,
        description: desc,
        characterAnchor: anchor,
        prompt,
        hasImage: imgInfo ? imgInfo.hasImage : false,
        imageUrl: imgInfo ? imgInfo.url : null
      })
      continue
    }

    // Check for 3-column table: | Tag | Description | Prompt |
    const match3 = line.match(/^\|\s*`?\[?(IMG_?\d+)\]?`?\s*\|\s*([^|]+)\|\s*(.+?)\s*\|(?:\s*$)?/i)
    if (match3) {
      const rawTag = match3[1].trim().toUpperCase()
      const tag = `[${rawTag}]`
      const cleanTag = rawTag
      const imgInfo = imageMap.get(cleanTag)
      const pText = match3[3].trim()
      const anchors = [...pText.matchAll(/@\{([^}]+)\}/g)].map(m => m[0]).join(', ')
      results.push({
        tag,
        description: match3[2].trim(),
        characterAnchor: anchors,
        prompt: pText,
        hasImage: imgInfo ? imgInfo.hasImage : false,
        imageUrl: imgInfo ? imgInfo.url : null
      })
    }
  }

  parsedPrompts.value = results
}

const copySinglePrompt = (item, index) => {
  const id = typeof item === 'object' && item.tag 
    ? item.tag.replace(/[^A-Za-z0-9]/g, '')
    : `IMG${String(index + 1).padStart(3, '0')}`
  const promptText = typeof item === 'object' && item.prompt ? item.prompt : item
  const payload = `<scene id="${id}">\n${promptText}\n</scene>`
  navigator.clipboard.writeText(payload)
  copiedIndex.value = index
  setTimeout(() => {
    if (copiedIndex.value === index) {
      copiedIndex.value = null
    }
  }, 2000)
}

onMounted(() => {
  loadEpisode()
  loadVaultModels()
})
</script>
