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
          <span>Batch Dispatch Hub</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-900/60 border border-purple-400/30 text-purple-100">
            {{ dynamicBatches.length }} {{ dynamicBatches.length === 1 ? 'Batch' : 'Batches' }}
          </span>
          <span v-if="completedBatchesCount > 0" class="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {{ completedBatchesCount }}/{{ dynamicBatches.length }} ✓
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

        <!-- Format Output Toggle (@{Token} vs @UUID) -->
        <div class="flex items-center space-x-1 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-700">
          <span class="text-[10px] font-bold uppercase text-slate-500 px-1.5">Format:</span>
          <button 
            @click="togglePromptTagMode('token')"
            class="px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center space-x-1"
            :class="promptTagMode === 'token' 
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            title="Display & copy with human-readable tokens like @{Name}"
          >
            <span>🏷️ @{Token}</span>
          </button>
          <button 
            @click="togglePromptTagMode('uuid')"
            class="px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center space-x-1"
            :class="promptTagMode === 'uuid' 
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            title="Display & copy with Google Flow entity UUIDs like @UUID"
          >
            <span>🔑 @UUID</span>
            <span v-if="entityCount > 0" class="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-black">
              {{ entityCount }}
            </span>
          </button>
        </div>

        <!-- Copy Selected Button -->
        <button 
          v-if="selectedTags.size > 0"
          @click="copySelectedPrompts"
          class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
        >
          <Check v-if="activeCopiedKey === 'SELECTED'" class="w-3.5 h-3.5 text-emerald-300" />
          <Zap v-else class="w-3.5 h-3.5 text-purple-200" />
          <span>{{ activeCopiedKey === 'SELECTED' ? 'Selected XML Copied!' : `Copy Selected (${selectedTags.size} Scenes)` }}</span>
        </button>

        <!-- Direct Copy Missing Button -->
        <button 
          v-if="missingCount > 0 && selectedTags.size === 0"
          @click="copyMissingPrompts"
          class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
        >
          <Check v-if="activeCopiedKey === 'MISSING'" class="w-3.5 h-3.5 text-emerald-300" />
          <AlertTriangle v-else class="w-3.5 h-3.5 text-amber-200" />
          <span>{{ activeCopiedKey === 'MISSING' ? 'Missing XML Copied!' : `⚡ Copy Failed/Missing Only (${missingCount})` }}</span>
        </button>
      </div>
    </div>

    <!-- Prompts Table / Cards -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center space-x-3">
          <span class="text-sm font-mono text-slate-500 dark:text-slate-400">
            Showing <strong class="text-slate-900 dark:text-white">{{ filteredPrompts.length }}</strong> of {{ parsedPrompts.length }} Scenes • {{ dynamicBatches.length }} Batches (Micro-Chunks: {{ microChunkSize }} scenes)
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <button 
            v-for="(batch, bIdx) in dynamicBatches" 
            :key="bIdx"
            @click="openBatchDrawer(bIdx)"
            class="text-xs font-mono px-3 py-1 rounded-lg border font-semibold flex items-center space-x-1.5 cursor-pointer transition"
            :class="batch.isFullyCopied 
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30' 
              : (batch.copiedChunksCount > 0 
                ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-400')"
            :title="`Open Dispatch Hub for ${batch.name} (${batch.copiedChunksCount}/${batch.chunks.length} chunks copied)`"
          >
            <CheckCircle2 v-if="batch.isFullyCopied" class="w-3.5 h-3.5 text-emerald-500" />
            <span v-else-if="batch.copiedChunksCount > 0" class="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>{{ batch.name }}: {{ batch.startTag }}–{{ batch.endTag }}</span>
            <span v-if="batch.copiedChunksCount > 0" class="text-[10px] opacity-75">({{ batch.copiedChunksCount }}/{{ batch.chunks.length }})</span>
          </button>
        </div>
      </div>

      <div class="divide-y divide-slate-200 dark:divide-slate-800">
        <div 
          v-for="(p, index) in filteredPrompts" 
          :key="p.tag"
          class="p-5 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
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

          <div class="space-y-3 flex-1">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="text-sm font-mono px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-bold">
                {{ p.tag }}
              </span>

              <!-- Status Tag (Ready vs Missing) -->
              <span 
                v-if="p.hasImage" 
                class="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-semibold flex items-center space-x-1.5"
              >
                <Check class="w-3.5 h-3.5 text-emerald-500" />
                <span>Ready</span>
              </span>
              <span 
                v-else 
                class="text-xs font-mono px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-semibold flex items-center space-x-1.5"
              >
                <AlertCircle class="w-3.5 h-3.5 text-amber-500" />
                <span>Missing/Retry</span>
              </span>

              <span class="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold">
                {{ getSceneBatchName(p, index) }}
              </span>

              <!-- Rich Character & Item Vault Reference Chips -->
              <template v-if="getSceneVaultReferences(p).length > 0">
                <div class="flex flex-wrap items-center gap-2">
                  <div 
                    v-for="refItem in getSceneVaultReferences(p)"
                    :key="refItem.id || refItem.name"
                    class="group/chip inline-flex items-center space-x-2 pl-1.5 pr-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/60 hover:bg-purple-50/30 dark:hover:bg-purple-950/20 shadow-2xs transition"
                  >
                    <!-- Mini Avatar Plate Thumbnail -->
                    <div class="w-5 h-5 rounded overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700">
                      <img v-if="refItem.url && refItem.hasPlate" :src="refItem.url" :alt="refItem.name" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-[9px] font-bold text-slate-500 uppercase">
                        {{ (refItem.name || 'R')[0] }}
                      </div>
                    </div>

                    <!-- Category Pill -->
                    <span 
                      class="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border"
                      :class="getCategoryBadgeClass(refItem.category)"
                    >
                      {{ refItem.category }}
                    </span>

                    <!-- Token Name & 1-Click Copy -->
                    <button 
                      @click.stop="copyVaultToken(refItem)"
                      class="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 flex items-center space-x-1.5 cursor-pointer transition max-w-[170px] truncate"
                      :title="`Click to copy token '${refItem.token || refItem.name}' for Google Flow`"
                    >
                      <span class="truncate">{{ refItem.flowName || refItem.name }}</span>
                      <Check v-if="copiedVaultId === refItem.id && copiedVaultType === 'token'" class="w-3 h-3 text-emerald-500 shrink-0" />
                      <Copy v-else class="w-3 h-3 text-slate-400 group-hover/chip:text-purple-500 shrink-0" />
                    </button>
                  </div>
                </div>
              </template>
              <span class="text-sm font-bold text-slate-900 dark:text-white">{{ p.description }}</span>
            </div>
            <p class="text-sm font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 break-words select-all leading-relaxed">
              {{ getDisplayPrompt(p) }}
            </p>
          </div>

          <div class="shrink-0 pt-1 flex items-center space-x-2">
            <button 
              @click="copySinglePrompt(p, index)"
              class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-purple-600 hover:text-white hover:border-purple-600 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold flex items-center space-x-2 transition-all w-full md:w-auto justify-center cursor-pointer shadow-sm"
            >
              <Check v-if="copiedIndex === index" class="w-4 h-4 text-emerald-500" />
              <Copy v-else class="w-4 h-4 text-slate-400" />
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
          <div class="w-screen max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
            
            <!-- Drawer Header -->
            <div class="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2.5">
                  <div class="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                    <Layers class="w-5 h-5" />
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white">Batch Dispatch Hub</h2>
                    <p class="text-sm text-slate-500 dark:text-slate-400 font-mono">
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

              <!-- Dispatch Progress Tracker -->
              <div class="mt-5 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-semibold text-slate-700 dark:text-slate-300">Dispatch Progress</span>
                  <span class="font-mono text-purple-600 dark:text-purple-400 font-bold">
                    {{ completedBatchesCount }} of {{ dynamicBatches.length }} Batches Done • {{ totalCopiedChunksCount }}/{{ totalChunksCount }} Chunks
                  </span>
                </div>
                <!-- Progress Bar -->
                <div class="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-purple-600 to-emerald-500 transition-all duration-300"
                    :style="{ width: `${overallProgressPercent}%` }"
                  />
                </div>
                <div class="flex items-center justify-between pt-1">
                  <span class="text-xs text-slate-500 dark:text-slate-400">
                    {{ completedBatchesCount === dynamicBatches.length && dynamicBatches.length > 0 ? '🎉 All batches and micro-chunks copied with zero duplicates!' : 'Paste micro-chunks sequentially into Google Flow chat.' }}
                  </span>
                  <button 
                    v-if="totalCopiedChunksCount > 0"
                    @click="resetCopiedState" 
                    class="text-xs font-mono font-semibold text-slate-500 hover:text-rose-500 flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw class="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <!-- Dedicated Missing / Failed Scenes Action in Drawer -->
              <div v-if="missingCount > 0" class="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span class="text-sm font-bold text-amber-700 dark:text-amber-300">Missing / Failed Scenes</span>
                  <p class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ missingCount }} plates missing on disk</p>
                </div>
                <button 
                  @click="copyMissingPrompts"
                  class="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer"
                >
                  {{ activeCopiedKey === 'MISSING' ? 'Copied!' : `⚡ Copy ${missingCount} Missing` }}
                </button>
              </div>

              <!-- Active Toast Notification -->
              <div v-if="copiedToastMessage" class="mt-4 p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-mono font-bold flex items-center justify-between">
                <span class="flex items-center space-x-1.5 min-w-0">
                  <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
                  <span class="truncate">{{ copiedToastMessage }}</span>
                </span>
                <button @click="copiedToastMessage = ''" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 cursor-pointer text-xs ml-2 shrink-0">✕</button>
              </div>

              <!-- Two-Tier Prompt Architecture: Flow Agent Master Instructions Card -->
              <div class="mt-4 p-4 rounded-xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 space-y-2.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <Sparkles class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span class="text-xs font-bold text-slate-900 dark:text-white">Flow Agent Master Instructions</span>
                  </div>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    Tier 1 • Set Once
                  </span>
                </div>
                <p class="text-[11px] text-slate-600 dark:text-slate-400 font-mono leading-relaxed">
                  Set once in Google Flow Agent Instructions. Enforces 100% textless artwork, anatomy invariants, single protagonist isolation, and {{ activeDirectiveFormat }} styling.
                </p>
                <button
                  @click="copyMasterAgentInstructions"
                  class="w-full py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  :class="copiedMasterInstructions 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/20'"
                  :title="`Copy Master Instructions for ${activeDirectiveFormat} to paste into Google Flow Agent Instructions`"
                >
                  <Check v-if="copiedMasterInstructions" class="w-4 h-4" />
                  <Copy v-else class="w-4 h-4" />
                  <span>{{ copiedMasterInstructions ? `Copied Master Instructions (${activeDirectiveFormat})!` : `📋 Copy Flow Agent Master Instructions (${activeDirectiveFormat})` }}</span>
                </button>
              </div>

              <!-- Lean Prompt Mode Switch (Tier 2 Optimization) -->
              <div class="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div class="min-w-0 pr-3">
                  <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold text-slate-900 dark:text-white">Lean Prompt Mode</span>
                    <span 
                      class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border"
                      :class="isLeanPromptMode 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'"
                    >
                      {{ isLeanPromptMode ? 'High-Attention (Recommended)' : 'Full Tail' }}
                    </span>
                  </div>
                  <p class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {{ isLeanPromptMode ? 'Strips repetitive 800-char negative tail. Maximises cross-attention on character blocking & environment.' : 'Preserves full 800-char negative tail on every scene.' }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="toggleLeanPromptMode"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden"
                  :class="isLeanPromptMode ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'"
                  role="switch"
                  :aria-checked="isLeanPromptMode"
                >
                  <span 
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                    :class="isLeanPromptMode ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
              </div>

              <!-- Micro-Chunk Size Settings -->
              <div class="mt-4 flex items-center justify-between">
                <div>
                  <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">Scenes per Micro-Chunk:</span>
                  <span class="text-xs font-mono text-indigo-600 dark:text-indigo-400 ml-1.5 font-bold">(Micro-Drop)</span>
                </div>
                <div class="relative">
                  <select 
                    :value="microChunkSize"
                    @change="setMicroChunkSize(Number($event.target.value))"
                    class="px-3 py-1.5 pr-8 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 focus:border-purple-500 focus:outline-hidden focus:ring-1 focus:ring-purple-500/50 transition cursor-pointer appearance-none shadow-xs"
                  >
                    <option :value="4">4 scenes (Micro-Drop • Recommended)</option>
                    <option :value="6">6 scenes</option>
                    <option :value="8">8 scenes</option>
                    <option :value="12">12 scenes</option>
                    <option :value="18">18 scenes</option>
                    <option :value="24">24 scenes (Full Batch)</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                    <ChevronDown class="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Drawer Body: Dynamic Batch List -->
            <div class="p-6 space-y-4 overflow-y-auto flex-1">
              <!-- Standalone Directive Badge -->
              <div class="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-500/20 flex items-start space-x-2.5">
                <ShieldCheck class="w-4.5 h-4.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div class="text-xs text-purple-900 dark:text-purple-300 leading-relaxed font-mono">
                  <span class="font-bold">Anti-Grid & Auto-Retry Directive:</span> Forces Google Flow to generate <strong>1 standalone image per &lt;scene&gt;</strong> and mandates automatic retry on failed calls.
                </div>
              </div>

              <div 
                v-for="(batch, bIdx) in dynamicBatches" 
                :key="bIdx"
                :id="`batch-card-${bIdx}`"
                class="p-4 rounded-xl border transition-all"
                :class="batch.isFullyCopied 
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30' 
                  : (batch.copiedChunksCount > 0 
                    ? 'bg-purple-50/20 dark:bg-purple-950/10 border-purple-200/80 dark:border-purple-500/30' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-500/40')"
              >
                <!-- Card Header -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <span 
                      class="px-2.5 py-1 rounded-md text-xs font-mono font-bold"
                      :class="batch.isFullyCopied 
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                        : 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'"
                    >
                      {{ batch.name }}
                    </span>
                    <span class="text-sm font-bold text-slate-900 dark:text-white">
                      Scenes {{ batch.startIndex + 1 }}–{{ batch.endIndex }}
                    </span>
                  </div>
                  <span class="text-xs font-mono font-bold" :class="batch.isFullyCopied ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'">
                    {{ batch.copiedChunksCount }}/{{ batch.chunks.length }} Chunks Copied
                  </span>
                </div>

                <div class="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                  <span>Range: <strong>{{ batch.startTag }}</strong> → <strong>{{ batch.endTag }}</strong> ({{ batch.items.length }} scenes)</span>
                  <span v-if="batch.isFullyCopied" class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 class="w-4 h-4" />
                    <span>Batch Complete</span>
                  </span>
                  <span v-else-if="batch.copiedChunksCount > 0" class="text-purple-600 dark:text-purple-400 font-bold">
                    In Progress
                  </span>
                  <span v-else class="text-slate-400">
                    Ready to dispatch
                  </span>
                </div>

                <!-- Session Isolation Target Collection Banner -->
                <div class="mb-3 px-3 py-1.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-500/20 flex items-center justify-between text-[11px] font-mono">
                  <span class="text-slate-500 dark:text-slate-400">Target Collection:</span>
                  <strong class="text-indigo-700 dark:text-indigo-300 font-bold truncate ml-2">"{{ batch.collectionTitle }}"</strong>
                </div>

                <!-- Required Vault References (Google Flow 10-Ref Limit Tracker) -->
                <div class="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2.5">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <Users class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span class="text-sm font-bold text-slate-900 dark:text-white">Required References</span>
                      <span 
                        class="text-xs font-mono font-bold px-2 py-0.5 rounded-full border"
                        :class="batch.refCount > 10 
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30' 
                          : (batch.refCount > 7 
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                            : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30')"
                      >
                        {{ batch.refCount }}/10
                      </span>
                    </div>
                    <button 
                      v-if="batch.refCount > 0"
                      @click.stop="copyAllBatchTokens(batch.references, batch.name)"
                      class="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center space-x-1"
                      title="Copy comma-separated token list for this batch"
                    >
                      <Check v-if="copiedDirectToken === batch.name" class="w-3 h-3 text-emerald-500" />
                      <Copy v-else class="w-3 h-3" />
                      <span>{{ copiedDirectToken === batch.name ? 'Copied' : 'Copy Tokens' }}</span>
                    </button>
                  </div>

                  <!-- References List (Full Width) -->
                  <div v-if="batch.refCount > 0" class="space-y-1.5 pt-1">
                    <div 
                      v-for="model in batch.references" 
                      :key="model.id || model.name"
                      @click.stop="copyVaultToken(model)"
                      class="group/chip w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/60 hover:bg-purple-50/20 dark:hover:bg-purple-950/20 transition cursor-pointer shadow-2xs"
                      :title="`Click to copy token '${model.token || model.name}' (${model.category})`"
                    >
                      <div class="flex items-center space-x-2.5 min-w-0 flex-1">
                        <div class="w-6 h-6 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700">
                          <img v-if="model.url && model.hasPlate" :src="model.url" :alt="model.name" class="w-full h-full object-cover" />
                          <div v-else class="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                            {{ (model.name || 'R')[0] }}
                          </div>
                        </div>
                        <span class="text-xs font-mono text-slate-800 dark:text-slate-200 truncate font-bold">
                          {{ model.flowName || model.name }}
                        </span>
                      </div>
                      
                      <div class="flex items-center space-x-2 shrink-0 ml-2">
                        <span 
                          class="text-[10px] font-mono px-2 py-0.5 rounded font-bold border"
                          :class="getCategoryBadgeClass(model.category)"
                        >
                          {{ model.category }}
                        </span>
                        <Check v-if="copiedVaultId === model.id && copiedVaultType === 'token'" class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <Copy v-else class="w-3.5 h-3.5 text-slate-400 group-hover/chip:text-purple-500 shrink-0" />
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-xs font-mono text-slate-400 italic">
                    No character/item references tagged in this batch.
                  </div>

                  <!-- Over Limit Alert -->
                  <div v-if="batch.refCount > 10" class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center space-x-1.5 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold">
                    <AlertTriangle class="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span>Exceeds Google Flow 10-reference limit! Remove {{ batch.refCount - 10 }} unused plates.</span>
                  </div>
                </div>

                <!-- Fast Dispatch Micro-Chunk Action Controls -->
                <div class="space-y-2.5 pt-1">
                  <!-- Primary Action: Copy Next Chunk -->
                  <button 
                    @click="copyNextBatchChunk(batch, bIdx)"
                    class="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm text-white"
                    :class="activeCopiedKey && activeCopiedKey.startsWith(`${bIdx}_`)
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20'
                      : (batch.isFullyCopied
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20'
                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-950/20')"
                  >
                    <Check v-if="activeCopiedKey && activeCopiedKey.startsWith(`${bIdx}_`)" class="w-4 h-4 text-emerald-200" />
                    <Check v-else-if="batch.isFullyCopied" class="w-4 h-4 text-emerald-200" />
                    <Zap v-else class="w-4 h-4 text-indigo-200" />
                    <span>
                      {{ activeCopiedKey && activeCopiedKey.startsWith(`${bIdx}_`)
                        ? `✓ Copied Chunk! Next: (${batch.nextChunkLabel})`
                        : (batch.isFullyCopied 
                          ? `✓ All ${batch.chunks.length} Chunks Copied — Re-Copy Chunk 1` 
                          : `⚡ Copy Next Chunk (${batch.nextChunkLabel})` 
                        )
                      }}
                    </span>
                  </button>

                  <!-- 1-Click Micro-Chunk Button Grid -->
                  <div class="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold px-0.5">
                      <span>1-Click Micro-Chunks:</span>
                      <span>{{ batch.copiedChunksCount }}/{{ batch.chunks.length }} copied</span>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      <button
                        v-for="(chunk, cIdx) in batch.chunks"
                        :key="cIdx"
                        @click="copyChunk(batch, bIdx, chunk, cIdx)"
                        class="px-2.5 py-2 rounded-lg text-xs font-mono font-bold border transition flex items-center justify-between cursor-pointer shadow-2xs"
                        :class="chunk.isCopied
                          ? (activeCopiedKey === `${bIdx}_${cIdx}`
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40')
                          : (activeCopiedKey === `${bIdx}_${cIdx}`
                              ? 'bg-purple-600 text-white border-purple-700'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-950/30')"
                        :title="`Click to copy Chunk ${chunk.chunkNumber} (${chunk.startTag}–${chunk.endTag}) with collection header`"
                      >
                        <span class="truncate">Chunk {{ chunk.chunkNumber }}</span>
                        <span class="text-[10px] font-normal opacity-75 shrink-0 ml-1">({{ chunk.startScene }}–{{ chunk.endScene }})</span>
                        <Check v-if="chunk.isCopied" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
                        <Copy v-else class="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                      </button>
                    </div>
                  </div>

                  <!-- Fallback: Copy Full Batch XML -->
                  <button 
                    @click="copyBatchFullXml(batch, bIdx)"
                    class="w-full py-2 px-3 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center space-x-1.5 transition border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                    :title="`Copy all ${batch.items.length} scenes in one batch prompt`"
                  >
                    <Check v-if="activeCopiedKey === `FULL_${bIdx}`" class="w-3.5 h-3.5 text-emerald-500" />
                    <Copy v-else class="w-3 h-3 text-slate-400" />
                    <span>
                      {{ activeCopiedKey === `FULL_${bIdx}` 
                        ? `Full ${batch.name} XML Copied!` 
                        : `Copy Full ${batch.name} XML (${batch.items.length} scenes)` 
                      }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Fallback Copy All In One -->
              <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button 
                  @click="copyAllMaster"
                  class="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Copy class="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  <span>{{ activeCopiedKey === 'ALL' ? 'All Scenes Copied!' : `Copy Entire Episode (All ${parsedPrompts.length} Scenes)` }}</span>
                </button>
              </div>
            </div>

            <!-- Drawer Footer -->
            <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-center">
              <p class="text-xs font-mono text-slate-400">
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

          <!-- Format & Tier Switcher Bar -->
          <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-2.5">
            <div class="flex items-center space-x-1.5 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-mono">
              <button 
                @click="directiveTierTab = 'master'"
                class="px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1.5"
                :class="directiveTierTab === 'master' 
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <Sparkles class="w-3.5 h-3.5" />
                <span>Tier 1: Master Instructions</span>
              </button>
              <button 
                @click="directiveTierTab = 'batch'"
                class="px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1.5"
                :class="directiveTierTab === 'batch' 
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <Layers class="w-3.5 h-3.5" />
                <span>Tier 2: Batch Header</span>
              </button>
            </div>

            <div class="flex items-center space-x-1.5 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-mono">
              <button 
                @click="activeDirectiveFormat = '16:9'"
                class="px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1"
                :class="activeDirectiveFormat === '16:9' 
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <span>16:9 Landscape</span>
              </button>
              <button 
                @click="activeDirectiveFormat = '9:16'"
                class="px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1"
                :class="activeDirectiveFormat === '9:16' 
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <span>9:16 Webtoon</span>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-5 space-y-4 overflow-y-auto flex-1 font-mono text-xs">
            <div class="p-3.5 rounded-xl border flex items-start space-x-2.5"
              :class="directiveTierTab === 'master' ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200/60 dark:border-purple-500/20' : 'bg-cyan-50/60 dark:bg-cyan-950/20 border-cyan-200/60 dark:border-cyan-500/20'"
            >
              <ShieldCheck class="w-4 h-4 shrink-0 mt-0.5" :class="directiveTierTab === 'master' ? 'text-purple-600 dark:text-purple-400' : 'text-cyan-600 dark:text-cyan-400'" />
              <p class="text-[11px] leading-relaxed" :class="directiveTierTab === 'master' ? 'text-purple-950 dark:text-purple-200' : 'text-cyan-950 dark:text-cyan-200'">
                <template v-if="directiveTierTab === 'master'">
                  <strong>Tier 1 — Where to paste:</strong> Paste once into Google Flow's <em>Agent Instructions</em> (or system directives). Decouples all negative quality guards, anatomy invariants, and zero-text rules so per-scene prompts stay laser-focused without attention dilution.
                </template>
                <template v-else>
                  <strong>Tier 2 — Batch Collection Header:</strong> Prepended automatically when copying micro-chunks and full batches. Mandates collection isolation in Google Flow.
                </template>
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

    <!-- Global Floating Toast Notification (when drawer is closed) -->
    <Teleport to="body">
      <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="copiedToastMessage && !isDrawerOpen" 
          class="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-2xl border border-purple-500/30 backdrop-blur-md flex items-center justify-between space-x-3 pointer-events-auto"
        >
          <div class="flex items-center space-x-2.5 min-w-0">
            <div class="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 class="w-4 h-4 shrink-0" />
            </div>
            <span class="text-xs font-mono font-medium truncate">{{ copiedToastMessage }}</span>
          </div>
          <button @click="copiedToastMessage = ''" class="text-slate-400 hover:text-white cursor-pointer text-xs shrink-0 p-1">✕</button>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, RefreshCw, Copy, Check, CheckCircle2, 
  Mic, Zap, Layers, X, RotateCcw, ShieldCheck, 
  AlertCircle, AlertTriangle, Film, Loader2,
  Users, Download, ExternalLink, Sparkles, Tag, FileCode2, Hash,
  ChevronDown
} from 'lucide-vue-next'
import { 
  parseEntityMappingText, 
  transformTokens, 
  buildSceneXmlNode,
  stripBoilerplateTail,
  LEAN_MODE_STORAGE_KEY,
  saveEntityMapToStorage, 
  loadEntityMapFromStorage, 
  getTagModeFromStorage, 
  setTagModeToStorage 
} from '../utils/entityMapper.js'

const route = useRoute()

// Two-Tier Prompt Architecture & Lean Mode State
const isLeanPromptMode = ref(localStorage.getItem(LEAN_MODE_STORAGE_KEY) !== 'false')

const toggleLeanPromptMode = () => {
  isLeanPromptMode.value = !isLeanPromptMode.value
  try {
    localStorage.setItem(LEAN_MODE_STORAGE_KEY, String(isLeanPromptMode.value))
  } catch (e) {
    console.warn('Failed to save lean mode:', e)
  }
}

// Google Flow Entity Mapping State
const entityMapRawText = ref('')
const parsedEntities = ref({})
const promptTagMode = ref('uuid') // 'uuid' | 'token'

const entityCount = computed(() => Object.keys(parsedEntities.value).length)

const togglePromptTagMode = (mode) => {
  promptTagMode.value = mode
  setTagModeToStorage(mode)
}

const getDisplayPrompt = (p) => {
  if (!p || !p.prompt) return ''
  const body = isLeanPromptMode.value ? stripBoilerplateTail(p.prompt) : p.prompt
  return transformTokens(body, parsedEntities.value, promptTagMode.value)
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

// Side Drawer State & Fast Dispatch Micro-Chunk Tracking
const isDrawerOpen = ref(false)
const openBatchDrawer = (batchIdx) => {
  isDrawerOpen.value = true
  nextTick(() => {
    const el = document.getElementById(`batch-card-${batchIdx}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}
const microChunkSize = ref(4) // 4 (Micro-Drop • Recommended), 6, 8, 12, 18, 24
const copiedChunksState = ref({}) // key: `${bIdx}_${cIdx}` -> boolean
const activeCopiedKey = ref(null) // e.g. `${bIdx}_${cIdx}`, `FULL_${bIdx}`, 'MISSING', 'SELECTED', 'ALL'
const copiedToastMessage = ref('')
let toastTimer = null

const showToast = (msg) => {
  copiedToastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    copiedToastMessage.value = ''
  }, 4500)
}

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
  
  // Find match in vaultModels
  const match = vaultModels.value.find(m => {
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

  // Fallback object if not in vault
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

const getSceneVaultReferences = (scene) => {
  if (!scene) return []
  const text = (scene.prompt || '') + ' ' + (scene.characterAnchor || '')
  const tokens = extractTokensFromText(text)
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
    copiedDirectToken.value = batchName || tokenList
    setTimeout(() => {
      if (copiedDirectToken.value === (batchName || tokenList)) {
        copiedDirectToken.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Clipboard copy error:', err)
  }
}

const formatReferenceHeader = (_references) => {
  // Omitted per operator directive (zero-bloat prompt payload)
  return ''
}

const getFlowMasterInstructions = (format = '16:9') => {
  const is16x9 = format === '16:9'
  if (is16x9) {
    return `[SYSTEM DIRECTIVE: GOOGLE FLOW MASTER AGENT INSTRUCTIONS — 16:9 FULL BLEED LANDSCAPE]

📁 SESSION & COLLECTION ISOLATION:
1. Always create and isolate each batch within its dedicated collection. Never mix scenes across batches.
2. STANDALONE SCENES: Generate EXACTLY ONE standalone, edge-to-edge 16:9 horizontal widescreen landscape image (1920x1080 full bleed) per <scene> node. Zero comic strips, zero multi-panel grids, zero storyboards, zero collages.

🚫 ZERO-TEXT MANDATE (STRICTLY ENFORCED):
- 100% pure textless illustration artwork.
- ABSOLUTELY ZERO Hangul (한글), English words/letters, kanji, numbers, speech bubbles, dialogue balloons, sound effects (SFX), subtitles, captions, watermarks, signatures, chapter titles, or UI labels.

👥 ACTOR & ANATOMICAL INTEGRITY:
- Flawless human anatomy: exactly two arms, two legs, five slender fingers per hand, natural articulation. Complete limbs, pristine anatomy.
- ZERO extra limbs, mutated hands, duplicate body parts, fused fingers, floating hands, or detached ghost limbs.
- Every hand holding a weapon, bow, or prop MUST be physically and seamlessly attached to the forearm and shoulder.
- SINGLE PROTAGONIST MANDATE: Strictly ONE single instance of the protagonist per frame. Never clone or duplicate the main character. Diverse background faces and neutral indistinct crowd silhouettes.
- Floating holographic screens must float freely in mid-air with zero disembodied hands touching the glass.

🏛️ SPATIAL & CAMERA INTEGRITY:
- Strictly adhere to the indoor or outdoor environment defined in the prompt. Single unified camera perspective (zero split 50/50 rooms or fractured non-Euclidean doorways).

🎨 MASTER ART STYLE:
- Dark fantasy action manhwa webtoon art style, sharp ink linework, high contrast cel shading, cinematic dramatic lighting, horizontal 16:9, pure textless artwork.`
  } else {
    return `[SYSTEM DIRECTIVE: GOOGLE FLOW MASTER AGENT INSTRUCTIONS — 9:16 AUTHENTIC WEBTOON STRIP]

📁 SESSION & COLLECTION ISOLATION:
1. Always create and isolate each batch within its dedicated collection. Never mix scenes across batches.
2. STANDALONE SCENES: Generate EXACTLY ONE standalone 9:16 vertical manhwa aspect ratio (1080x1920) comic plate per <scene> node.
3. 3-TIER COMPOSITION ENGINE: Support Tier A (Cinematic Hero Plate 30%), Tier B (Dual-Panel Split Strip 50%), and Tier C (Three-Panel Action Strip 20%).

🚫 ZERO-TEXT MANDATE (STRICTLY ENFORCED):
- 100% pure textless illustration artwork.
- ABSOLUTELY ZERO Hangul (한글), English words/letters, kanji, numbers, speech bubbles, dialogue balloons, sound effects (SFX), subtitles, captions, watermarks, signatures, or chapter titles.

👥 ACTOR & ANATOMICAL INTEGRITY:
- Flawless human anatomy: exactly two arms, two legs, five slender fingers per hand. Zero extra limbs, zero floating hands, zero severed appendages.
- SINGLE PROTAGONIST MANDATE: Strictly ONE single instance of the protagonist per frame. Zero duplicate clones.

🎨 MASTER ART STYLE:
- Dark fantasy action manhwa webtoon art style, sharp ink linework, high contrast cel shading, cinematic dramatic lighting, vertical 9:16, pure textless artwork.`
  }
}

const getFlowDirectiveHeader = (collectionTitle, format = '16:9', isLean = false) => {
  if (isLean) {
    return `[SYSTEM DIRECTIVE: TARGET COLLECTION "${collectionTitle}" | CREATE IF NOT PRESENT | DO NOT ASSIGN TO PRIOR BATCHES]
Isolate all generated images from this batch into "${collectionTitle}". Pure textless standalone manhwa artwork.`
  }

  const is16x9 = format === '16:9'
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
7. 🚫 MANDATORY MULTI-ACTOR ISOLATION & ZERO-CLONING MANDATE:
   - When generating scenes with multiple characters or audience crowds, NEVER duplicate or clone the protagonist.
   - There MUST be strictly ONE single instance of the named protagonist in the entire image frame.
   - Secondary characters, examiners, and teachers MUST have distinctly different faces, uniforms, hair, and ages.
   - NEVER render the protagonist handing an item to himself, sitting in the crowd while standing on stage, or facing a doppelgänger.
8. 👥 MANDATORY BACKGROUND CROWD DE-IDENTIFICATION:
   - Audience crowds, classrooms, and background students MUST be rendered as diverse, softly blurred, indistinct silhouettes with varied hairstyles, distinct neutral postures, and ZERO duplicate faces matching the protagonist.
9. 🏛️ MANDATORY SPATIAL ENCLOSURE INTEGRITY:
   - Strictly adhere to the specific room/location described in the scene. If the scene is set in a corridor, locker room, or street, DO NOT spawn stage pedestals, crystal orbs, or drapery from other scenes.
10. 🔮 MANDATORY DECOUPLED FLOATING HUDs & ZERO DISEMBODIED HANDS:
   - Floating holographic system screens, diagnostic menus, and stat windows must float freely in open space.
   - Characters viewing the screen must have both arms anchored to their body (e.g. resting at sides, hand on quiver strap) with EXACTLY two arms. ZERO third hands, ZERO disembodied hands touching the holographic screen, ZERO hands inside or holding the UI glass.
   - Pure textless UI: abstract glowing runes, numeric gauges, and energy waveforms only.
11. 🚪 MANDATORY SINGLE-PERSPECTIVE THRESHOLD GEOMETRY:
   - Doorways, airlocks, and entrance/exit transitions must be shot from ONE unified camera perspective inside a single space.
   - NEVER render split 50/50 dual-room compositions. ZERO non-Euclidean door jambs, ZERO floating disconnected door panels, and ZERO split-dimensional geometry.
12. MANDATORY FILE NAMING CONVENTION: Name each generated image file strictly matching its scene tag as specified in the filename attribute (e.g. IMG_001.jpg, IMG_002.jpg). Never use randomized or hash filenames.
13. ART STYLE: Dark fantasy action manhwa webtoon art style, sharp black ink linework, high contrast cel shading, cinematic dramatic lighting, textless ${aspectInstruction}.`
}

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

const BATCH_SIZE = 24

const getSceneBatchName = (item, idx) => {
  if (item && item.tag) {
    const num = parseInt(item.tag.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(num) && num > 0) {
      const bIdx = Math.floor((num - 1) / BATCH_SIZE)
      return `Batch ${getBatchLetter(bIdx)}`
    }
  }
  const bIdx = Math.floor(idx / BATCH_SIZE)
  return `Batch ${getBatchLetter(bIdx)}`
}

// Dynamic Batches Computation: Standard 24-scene batches partitioned into micro-chunks
const dynamicBatches = computed(() => {
  if (!parsedPrompts.value || parsedPrompts.value.length === 0) return []
  const batches = []
  const total = parsedPrompts.value.length
  const batchCount = Math.ceil(total / BATCH_SIZE)
  const chunkSize = microChunkSize.value || 4

  for (let i = 0; i < batchCount; i++) {
    const startIndex = i * BATCH_SIZE
    const endIndex = Math.min(startIndex + BATCH_SIZE, total)
    const items = parsedPrompts.value.slice(startIndex, endIndex)
    const startTag = items[0]?.tag || `IMG${String(startIndex + 1).padStart(3, '0')}`
    const endTag = items[items.length - 1]?.tag || `IMG${String(endIndex).padStart(3, '0')}`
    const batchRefs = getBatchVaultReferences(items)
    const batchLetter = getBatchLetter(i)
    const batchName = `Batch ${batchLetter}`
    const collectionTitle = getCollectionName(batchName)

    // Compute micro-chunks for this batch
    const chunks = []
    const chunkCount = Math.ceil(items.length / chunkSize)
    for (let c = 0; c < chunkCount; c++) {
      const cStart = c * chunkSize
      const cEnd = Math.min(cStart + chunkSize, items.length)
      const chunkItems = items.slice(cStart, cEnd)
      const startSceneNum = startIndex + cStart + 1
      const endSceneNum = startIndex + cEnd
      const cStartTag = chunkItems[0]?.tag || `IMG${String(startSceneNum).padStart(3, '0')}`
      const cEndTag = chunkItems[chunkItems.length - 1]?.tag || `IMG${String(endSceneNum).padStart(3, '0')}`
      const isCopied = Boolean(copiedChunksState.value[`${i}_${c}`])

      chunks.push({
        chunkIndex: c,
        chunkNumber: c + 1,
        startScene: startSceneNum,
        endScene: endSceneNum,
        startTag: cStartTag,
        endTag: cEndTag,
        items: chunkItems,
        isCopied
      })
    }

    const copiedChunksCount = chunks.filter(c => c.isCopied).length
    const isFullyCopied = chunks.length > 0 && copiedChunksCount === chunks.length
    const nextUncopiedChunk = chunks.find(c => !c.isCopied) || chunks[0]
    const nextChunkLabel = nextUncopiedChunk 
      ? `Chunk ${nextUncopiedChunk.chunkNumber}: Scenes ${nextUncopiedChunk.startScene}–${nextUncopiedChunk.endScene}`
      : 'Chunk 1'

    batches.push({
      name: batchName,
      letter: batchLetter,
      batchNumber: i + 1,
      startIndex,
      endIndex,
      startTag,
      endTag,
      items,
      references: batchRefs.models,
      refCount: batchRefs.count,
      isOverLimit: batchRefs.isOverLimit,
      collectionTitle,
      chunks,
      copiedChunksCount,
      isFullyCopied,
      nextUncopiedChunk,
      nextChunkLabel
    })
  }

  return batches
})

const completedBatchesCount = computed(() => {
  return dynamicBatches.value.filter(b => b.isFullyCopied).length
})

const totalChunksCount = computed(() => {
  return dynamicBatches.value.reduce((acc, b) => acc + b.chunks.length, 0)
})

const totalCopiedChunksCount = computed(() => {
  return dynamicBatches.value.reduce((acc, b) => acc + b.copiedChunksCount, 0)
})

const overallProgressPercent = computed(() => {
  if (!totalChunksCount.value) return 0
  return Math.round((totalCopiedChunksCount.value / totalChunksCount.value) * 100)
})

const setMicroChunkSize = (size) => {
  microChunkSize.value = size
  copiedChunksState.value = {}
  activeCopiedKey.value = null
}

const resetCopiedState = () => {
  copiedChunksState.value = {}
  activeCopiedKey.value = null
  copiedToastMessage.value = ''
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
const directiveTierTab = ref('master') // 'master' (Tier 1) | 'batch' (Tier 2)
const copiedDirective = ref(false)
const copiedMasterInstructions = ref(false)

const currentDirectiveText = computed(() => {
  if (directiveTierTab.value === 'master') {
    return getFlowMasterInstructions(activeDirectiveFormat.value)
  }
  const is16x9 = activeDirectiveFormat.value === '16:9'
  return getFlowDirectiveHeader('Direct_Copy', is16x9 ? '16:9' : '9:16', isLeanPromptMode.value)
})

const copyDirective = async () => {
  try {
    await navigator.clipboard.writeText(currentDirectiveText.value)
    copiedDirective.value = true
    const label = directiveTierTab.value === 'master' ? 'Master Instructions' : 'Batch Directive'
    showToast(`Copied ${label} (${activeDirectiveFormat.value})!`)
    setTimeout(() => {
      copiedDirective.value = false
    }, 2500)
  } catch (err) {
    console.error('Failed to copy directive:', err)
  }
}

const copyMasterAgentInstructions = async () => {
  const text = getFlowMasterInstructions(activeDirectiveFormat.value)
  try {
    await navigator.clipboard.writeText(text)
    copiedMasterInstructions.value = true
    showToast(`Copied Flow Agent Master Instructions (${activeDirectiveFormat.value})! Paste once into Google Flow Agent Instructions.`)
    setTimeout(() => {
      copiedMasterInstructions.value = false
    }, 2500)
  } catch (err) {
    console.error('Failed to copy master instructions:', err)
  }
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

const copyChunk = async (batch, bIdx, chunk, cIdx) => {
  if (!chunk || !chunk.items.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const isLean = isLeanPromptMode.value
  const collectionTitle = batch.collectionTitle || getCollectionName(batch.name)
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', isLean)

  const scenesXml = chunk.items.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return buildSceneXmlNode(tag, filename, p.prompt, parsedEntities.value, promptTagMode.value, { lean: isLean })
  }).join('\n\n')

  const chunkXml = `<batch id="${batch.name.replace(/\s+/g, '_')}_Chunk_${chunk.chunkNumber}" series="${franchiseId}" episode="${episodeId}" batch="${batch.name}" chunk="${chunk.chunkNumber}" scenes="${chunk.startTag}-${chunk.endTag}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${flowDirective}\n\n${chunkXml}`

  try {
    await navigator.clipboard.writeText(payload)
    
    copiedChunksState.value = {
      ...copiedChunksState.value,
      [`${bIdx}_${cIdx}`]: true
    }

    const key = `${bIdx}_${cIdx}`
    activeCopiedKey.value = key
    showToast(`Copied ${batch.name} Chunk ${chunk.chunkNumber} (${chunk.startTag}–${chunk.endTag})${isLean ? ' [Lean Mode]' : ''}! Target Collection: "${collectionTitle}"`)

    setTimeout(() => {
      if (activeCopiedKey.value === key) {
        activeCopiedKey.value = null
      }
    }, 2500)
  } catch (err) {
    console.error('Failed to copy chunk:', err)
  }
}

const copyNextBatchChunk = async (batch, bIdx) => {
  if (!batch || !batch.chunks.length) return
  const chunkToCopy = batch.nextUncopiedChunk || batch.chunks[0]
  await copyChunk(batch, bIdx, chunkToCopy, chunkToCopy.chunkIndex)
}

const copyBatchFullXml = async (batch, bIdx) => {
  if (!batch || !batch.items.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const isLean = isLeanPromptMode.value
  const collectionTitle = batch.collectionTitle || getCollectionName(batch.name)
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', isLean)

  const scenesXml = batch.items.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return buildSceneXmlNode(tag, filename, p.prompt, parsedEntities.value, promptTagMode.value, { lean: isLean })
  }).join('\n\n')

  const batchXml = `<batch id="${batch.name.replace(/\s+/g, '_')}" series="${franchiseId}" episode="${episodeId}" scenes="${batch.startTag}-${batch.endTag}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${flowDirective}\n\n${batchXml}`

  try {
    await navigator.clipboard.writeText(payload)

    const updated = { ...copiedChunksState.value }
    batch.chunks.forEach((_, cIdx) => {
      updated[`${bIdx}_${cIdx}`] = true
    })
    copiedChunksState.value = updated

    const key = `FULL_${bIdx}`
    activeCopiedKey.value = key
    showToast(`Copied Full ${batch.name} XML (${batch.items.length} scenes)${isLean ? ' [Lean Mode]' : ''}! Target Collection: "${collectionTitle}"`)

    setTimeout(() => {
      if (activeCopiedKey.value === key) {
        activeCopiedKey.value = null
      }
    }, 2500)
  } catch (err) {
    console.error('Failed to copy full batch:', err)
  }
}

const copySelectedPrompts = async () => {
  const selectedItems = parsedPrompts.value.filter(p => selectedTags.value.has(p.tag))
  if (!selectedItems.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const isLean = isLeanPromptMode.value

  const collectionTitle = getCollectionName('Selected')
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', isLean)

  const scenesXml = selectedItems.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return buildSceneXmlNode(tag, filename, p.prompt, parsedEntities.value, promptTagMode.value, { lean: isLean })
  }).join('\n\n')

  const batchXml = `<batch id="Selected_Scenes" series="${franchiseId}" episode="${episodeId}" scenes="Selected_${selectedItems.length}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${flowDirective}\n\n${batchXml}`

  try {
    await navigator.clipboard.writeText(payload)
    activeCopiedKey.value = 'SELECTED'
    showToast(`Copied Selected Prompts (${selectedItems.length} scenes)${isLean ? ' [Lean Mode]' : ''}!`)
    setTimeout(() => {
      if (activeCopiedKey.value === 'SELECTED') {
        activeCopiedKey.value = null
      }
    }, 2500)
  } catch (err) {
    console.error('Failed to copy selected prompts:', err)
  }
}

const copyMissingPrompts = async () => {
  const missingItems = parsedPrompts.value.filter(p => !p.hasImage)
  if (!missingItems.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const isLean = isLeanPromptMode.value

  const collectionTitle = getCollectionName('Missing')
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', isLean)

  const scenesXml = missingItems.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return buildSceneXmlNode(tag, filename, p.prompt, parsedEntities.value, promptTagMode.value, { lean: isLean })
  }).join('\n\n')

  const batchXml = `<batch id="Missing_Scenes" series="${franchiseId}" episode="${episodeId}" scenes="Missing_${missingItems.length}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${flowDirective}\n\n${batchXml}`

  try {
    await navigator.clipboard.writeText(payload)
    activeCopiedKey.value = 'MISSING'
    showToast(`Copied Failed/Missing Scenes (${missingItems.length} scenes)${isLean ? ' [Lean Mode]' : ''}!`)
    setTimeout(() => {
      if (activeCopiedKey.value === 'MISSING') {
        activeCopiedKey.value = null
      }
    }, 2500)
  } catch (err) {
    console.error('Failed to copy missing prompts:', err)
  }
}

const copyAllMaster = async () => {
  if (!parsedPrompts.value.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const isLean = isLeanPromptMode.value

  const collectionTitle = getCollectionName('Master_Deck')
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', isLean)

  const scenesXml = parsedPrompts.value.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return buildSceneXmlNode(tag, filename, p.prompt, parsedEntities.value, promptTagMode.value, { lean: isLean })
  }).join('\n\n')

  const batchXml = `<batch id="Master_Deck" series="${franchiseId}" episode="${episodeId}" scenes="All_${parsedPrompts.value.length}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${flowDirective}\n\n${batchXml}`

  try {
    await navigator.clipboard.writeText(payload)

    const updated = {}
    dynamicBatches.value.forEach((b, bIdx) => {
      b.chunks.forEach((_, cIdx) => {
        updated[`${bIdx}_${cIdx}`] = true
      })
    })
    copiedChunksState.value = updated
    activeCopiedKey.value = 'ALL'
    showToast(`Copied Entire Episode (${parsedPrompts.value.length} scenes)${isLean ? ' [Lean Mode]' : ''}! Target Collection: "${collectionTitle}"`)

    setTimeout(() => {
      if (activeCopiedKey.value === 'ALL') {
        activeCopiedKey.value = null
      }
    }, 2500)
  } catch (err) {
    console.error('Failed to copy master deck:', err)
  }
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

const copySinglePrompt = async (item, index) => {
  const rawId = typeof item === 'object' && item.tag 
    ? item.tag.replace(/[^A-Za-z0-9]/g, '')
    : `IMG${String(index + 1).padStart(3, '0')}`
  const num = rawId.replace(/IMG/i, '').padStart(3, '0')
  const tag = `IMG_${num}`
  const filename = `${tag}.jpg`
  const promptText = typeof item === 'object' && item.prompt ? item.prompt : item
  const isLean = isLeanPromptMode.value
  const promptBody = isLean ? stripBoilerplateTail(promptText) : promptText
  const finalPrompt = transformTokens(promptBody, parsedEntities.value, promptTagMode.value)
  const sceneXml = `<scene id="${tag}" filename="${filename}">\n# Filename: ${filename}\n${finalPrompt}\n</scene>`
  
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const sceneNum = parseInt(num, 10)
  const bIdx = !isNaN(sceneNum) && sceneNum > 0 ? Math.floor((sceneNum - 1) / BATCH_SIZE) : 0
  const bLetter = getBatchLetter(bIdx)
  const collectionTitle = getCollectionName(`Batch ${bLetter}`)
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', isLean)
  const payload = `${flowDirective}\n\n${sceneXml}`
  
  try {
    await navigator.clipboard.writeText(payload)
    copiedIndex.value = index
    showToast(`Copied ${tag} XML${isLean ? ' [Lean Mode]' : ''}! Target Collection: "${collectionTitle}"`)
    setTimeout(() => {
      if (copiedIndex.value === index) {
        copiedIndex.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Failed to copy single prompt:', err)
  }
}

onMounted(() => {
  loadEpisode()
  loadVaultModels()
  loadFlowEntities()
})
</script>
