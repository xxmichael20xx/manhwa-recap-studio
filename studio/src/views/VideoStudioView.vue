<template>
  <div class="space-y-6">
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

    <!-- Stage Navigation Tabs -->
    <div class="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
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
              @click="autoIngestDownloads"
              :disabled="ingestingDownloads"
              class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center space-x-2 transition shadow-md shadow-emerald-950/20 disabled:opacity-50 cursor-pointer"
            >
              <Download class="w-4 h-4" :class="{ 'animate-bounce': ingestingDownloads }" />
              <span>{{ ingestingDownloads ? 'Ingesting Google Flow Images...' : '📥 Ingest from Downloads' }}</span>
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

        <!-- Character Model DNA Sheets & Reference Plates -->
        <!-- Character Vault (Google Flow Reference Plates) -->
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center space-x-2">
              <div class="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Users class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wide">
                  Franchise Character Vault (Google Flow Reference Plates)
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Standardised character plates and naming matching Google Flow collections for rapid Alt+Tab generation.
                </p>
              </div>
            </div>

            <!-- Filter Tabs -->
            <div class="flex items-center space-x-1.5 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-mono">
              <button 
                v-for="cat in ['all', 'Protagonist', 'Antagonist', 'Supporting']" 
                :key="cat"
                @click="selectedVaultCategory = cat"
                class="px-2.5 py-1 rounded-lg transition capitalize cursor-pointer"
                :class="selectedVaultCategory === cat ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                {{ cat === 'all' ? `All (${characterModels.length})` : cat }}
              </button>
            </div>
          </div>

          <!-- Character Models Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              v-for="model in filteredCharacterModels" 
              :key="model.id"
              class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-1">
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ model.name }}</h4>
                    <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 font-semibold inline-block mt-0.5">
                      {{ model.role }} • {{ model.tier }}
                    </span>
                  </div>
                </div>

                <!-- Model Preview Thumbnail (16:9) -->
                <div class="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative group">
                  <img :src="model.url" :alt="model.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <a 
                    :href="model.url" 
                    target="_blank" 
                    class="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition"
                    title="View full resolution in new tab"
                  >
                    <ExternalLink class="w-3.5 h-3.5" />
                  </a>
                </div>

                <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {{ model.description }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 gap-1.5">
                <button 
                  @click="downloadModelPlate(model)"
                  class="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-mono font-semibold flex items-center space-x-1 transition cursor-pointer"
                >
                  <Download class="w-3 h-3" />
                  <span>Download</span>
                </button>
                <button 
                  @click="copyModelDna(model)"
                  class="px-2 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-mono font-semibold flex items-center space-x-1 transition cursor-pointer"
                >
                  <Copy class="w-3 h-3" />
                  <span>Copy DNA</span>
                </button>
              </div>
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
                  <div class="flex items-center space-x-2.5">
                    <span class="text-sm font-bold text-slate-900 dark:text-white">{{ batch.label }}</span>
                    <span 
                      class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center space-x-1"
                      :class="batch.isFullyReady 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'"
                    >
                      <span v-if="batch.isFullyReady">✓ {{ batch.readyCount }}/{{ batch.totalCount }} Panels Loaded (100%)</span>
                      <span v-else>{{ batch.readyCount }}/{{ batch.totalCount }} Loaded • {{ batch.totalCount - batch.readyCount }} Missing ({{ batch.progressPercent }}%)</span>
                    </span>
                  </div>
                  <div class="flex items-center space-x-3 mt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span>Range: <strong>{{ batch.startTag }}</strong> → <strong>{{ batch.endTag }}</strong></span>
                  </div>
                </div>
              </div>

              <!-- Quick Batch Action Buttons -->
              <div class="flex flex-wrap items-center gap-2" @click.stop>
                <!-- 1-Click Synthesize Batch -->
                <button 
                  @click="synthesizeSingleBatch(batch.index)"
                  :disabled="batchActionState[batch.index]?.isSynthesizing"
                  class="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                  title="1-Click background synthesis for this batch"
                >
                  <Wand2 class="w-3.5 h-3.5" :class="{ 'animate-spin': batchActionState[batch.index]?.isSynthesizing }" />
                  <span>{{ batchActionState[batch.index]?.isSynthesizing ? 'Synthesizing...' : `⚡ Synthesize ${batch.name}` }}</span>
                </button>

                <!-- 1-Click Ingest from Downloads for this Batch -->
                <button 
                  @click="autoIngestSingleBatchDownloads(batch.index)"
                  :disabled="batchActionState[batch.index]?.isIngesting"
                  class="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                  title="Auto-ingest downloaded images strictly into this batch"
                >
                  <Download class="w-3.5 h-3.5" :class="{ 'animate-bounce': batchActionState[batch.index]?.isIngesting }" />
                  <span>{{ batchActionState[batch.index]?.isIngesting ? 'Ingesting...' : `📥 Ingest ${batch.name}` }}</span>
                </button>
              </div>
            </div>

            <!-- Accordion Content (Expanded) -->
            <div v-if="expandedBatches[batch.index]" class="p-6 space-y-6">
              <!-- Batch-Scoped Dropzone -->
              <div 
                @dragover.prevent
                @drop.prevent="handleBatchScopedDrop($event, batch.index)"
                @click="triggerBatchScopedUpload(batch.index)"
                class="p-6 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-500/30 hover:border-purple-500 bg-purple-50/20 hover:bg-purple-50/40 dark:bg-purple-950/10 dark:hover:bg-purple-950/20 text-center space-y-2 transition cursor-pointer group"
              >
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
                  class="rounded-xl border bg-slate-50 dark:bg-slate-950/40 p-4 space-y-3 relative group transition-all"
                  :class="scene.hasImage ? 'border-slate-200 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-700'"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop($event, scene.tag)"
                >
                  <!-- Card Header -->
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                      [{{ scene.tag }}]
                    </span>
                    <span class="text-[10px] font-mono text-slate-400 uppercase">{{ scene.act ? scene.act.split(':')[0] : 'Scene' }}</span>
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
                      <Image class="w-6 h-6 mx-auto text-slate-600" />
                      <div class="text-[11px] font-mono text-slate-400">No Image Rendered</div>
                      <div class="text-[10px] text-slate-500">Drag & drop PNG/JPG here</div>
                    </div>

                    <!-- Upload Overlay on Hover -->
                    <label class="absolute inset-0 bg-slate-900/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition cursor-pointer">
                      <Upload class="w-5 h-5 text-white mb-1" />
                      <span class="text-[11px] font-semibold text-white">Replace Image</span>
                      <input type="file" accept="image/*" class="hidden" @change="handleFileInput($event, scene.tag)" />
                    </label>
                  </div>

                  <!-- Scene Info -->
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{{ scene.description }}</div>
                    <p class="text-[11px] font-mono text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{{ scene.prompt }}</p>
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
            <!-- Compile Master Action Button -->
            <button 
              @click="compileVideo"
              :disabled="compiling"
              class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-purple-900/30 disabled:opacity-50 cursor-pointer"
            >
              <Play class="w-4 h-4 fill-current" :class="{ 'animate-spin': compiling }" />
              <span>{{ compiling ? 'Compiling Master Video...' : 'Compile Master 1080p Video' }}</span>
            </button>
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

        <!-- Hidden Audio Element for BGM Preview -->
        <audio ref="bgmAudioPlayer" @ended="onBgmEnded"></audio>

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

            <div class="flex items-center space-x-3 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span v-if="selectedVideoFile === '01_Episode_Master_1080p.mp4'" class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                Full 13m 28s Master
              </span>
              <span v-else class="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">
                Batch Preview Cut
              </span>
              <a 
                :href="`/api/episodes/${$route.params.franchiseId}/${$route.params.episodeId}/video-stream?file=${selectedVideoFile}&download=1`"
                download
                class="hover:text-purple-600 dark:hover:text-purple-400 underline flex items-center space-x-1 font-semibold"
              >
                <span>Download MP4</span>
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
        <div v-else-if="!compiling" class="py-12 text-center space-y-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-400">
          <Film class="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <p class="font-semibold text-slate-700 dark:text-slate-300">No Video Renders Found Yet</p>
          <p class="text-slate-500">Ensure Visuals (Stage 1) and Voiceover (Stage 2) are prepared, then select a batch or click "Compile Master 1080p Video".</p>
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
  Layers,
  Zap,
  Loader2,
  AlertCircle
} from 'lucide-vue-next'

const route = useRoute()
const activeStage = ref('visuals')
const scenes = ref([])
const cacheBuster = ref(Date.now())
const generatingStoryboards = ref(false)
const storyboardFeedback = ref('')

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

// Character Models & Ingestion State
const characterModels = ref([])
const selectedVaultCategory = ref('all')
const batchUploading = ref(false)
const batchUploadFeedback = ref('')
const batchFileInput = ref(null)
const zipFileInput = ref(null)
const folderFileInput = ref(null)
const ingestingDownloads = ref(false)

const autoIngestDownloads = async () => {
  ingestingDownloads.value = true
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/auto-ingest-downloads`, {
      method: 'POST'
    })
    const data = await res.json()
    if (data.success) {
      storyboardFeedback.value = `✓ Successfully ingested and semantically mapped ${data.count} panels from "${data.source}"!`
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()
    } else {
      storyboardFeedback.value = `Ingestion note: ${data.error || 'No images found in Downloads.'}`
    }
  } catch (e) {
    storyboardFeedback.value = `Ingestion error: ${e.message}`
  } finally {
    ingestingDownloads.value = false
    setTimeout(() => { storyboardFeedback.value = '' }, 8000)
  }
}

const loadCharacterModels = async () => {
  try {
    const res = await fetch(`/api/franchises/${route.params.franchiseId}/character-models`)
    const data = await res.json()
    if (Array.isArray(data)) {
      characterModels.value = data
    }
  } catch (e) {
    console.warn('Failed to load character models:', e)
  }
}

const filteredCharacterModels = computed(() => {
  if (selectedVaultCategory.value === 'all') return characterModels.value
  return characterModels.value.filter(m => m.role?.toLowerCase() === selectedVaultCategory.value.toLowerCase())
})

const copyModelDna = (model) => {
  if (!model) return
  navigator.clipboard.writeText(model.dnaAnchor).then(() => {
    batchUploadFeedback.value = `Copied ${model.name} DNA tokens to clipboard!`
    setTimeout(() => { batchUploadFeedback.value = '' }, 3000)
  })
}

const downloadModelPlate = (model) => {
  if (!model) return
  const a = document.createElement('a')
  a.href = model.url
  a.download = model.filename
  a.click()
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

// Batch Accordion & Per-Batch Automation State
const expandedBatches = ref({ 0: true })
const batchActionState = ref({})
const isSynthesizingAll = ref(false)

const batchedScenes = computed(() => {
  const list = []
  const chunkSize = 24
  const total = scenes.value.length || 0
  const count = Math.ceil(total / chunkSize)
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']

  for (let i = 0; i < count; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, total)
    const items = scenes.value.slice(start, end)
    const readyCount = items.filter(s => s.hasImage).length
    const letter = letters[i] || `Batch_${i + 1}`

    list.push({
      index: i,
      letter,
      name: `Batch ${letter}`,
      label: `Batch ${letter}: Scenes ${String(start + 1).padStart(3, '0')}–${String(end).padStart(3, '0')}`,
      startTag: items[0]?.tag || `IMG_${String(start + 1).padStart(3, '0')}`,
      endTag: items[items.length - 1]?.tag || `IMG_${String(end).padStart(3, '0')}`,
      scenes: items,
      readyCount,
      totalCount: items.length,
      isFullyReady: readyCount === items.length && items.length > 0,
      progressPercent: items.length ? Math.round((readyCount / items.length) * 100) : 0
    })
  }
  return list
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
  const letter = String.fromCharCode(65 + batchIndex)
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

const autoIngestSingleBatchDownloads = async (batchIndex) => {
  const letter = String.fromCharCode(65 + batchIndex)
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'visuals',
    status: 'running',
    progress: 25,
    message: `Auto-ingesting and mapping Batch ${letter} from Downloads...`,
    logs: [`Scanning Downloads folder for Batch ${letter} image files...`]
  }

  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/auto-ingest-downloads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchIndex })
    })
    const data = await res.json()
    if (data.success) {
      modalState.value.status = 'completed'
      modalState.value.progress = 100
      modalState.value.message = `Successfully ingested & mapped ${data.count} panels for Batch ${letter}!`
      modalState.value.logs = [
        ...modalState.value.logs,
        `Matched ${data.count} files from "${data.source}".`,
        `Batch ${letter} visual assets are now 100% synchronized.`
      ]
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()
    } else {
      modalState.value.status = 'failed'
      modalState.value.message = data.error || 'Ingest failed'
      modalState.value.logs = [...modalState.value.logs, `Note: ${data.error || 'No images found in Downloads.'}`]
    }
  } catch (e) {
    modalState.value.status = 'failed'
    modalState.value.message = e.message
    modalState.value.logs = [...modalState.value.logs, `Error: ${e.message}`]
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

const handleZipUpload = async (file, targetBatchIndex = null) => {
  batchUploading.value = true
  batchUploadFeedback.value = `Unpacking and ingesting "${file.name}"...`

  try {
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/upload-zip`, {
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
      batchUploadFeedback.value = `✓ Successfully unzipped and mapped ${data.count} visual panels from "${file.name}"!`
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()
    } else {
      throw new Error(data.error || 'Failed to unpack ZIP archive')
    }
  } catch (err) {
    console.error('ZIP upload failed:', err)
    batchUploadFeedback.value = `ZIP Upload Error: ${err.message}`
  } finally {
    batchUploading.value = false
    setTimeout(() => { batchUploadFeedback.value = '' }, 6000)
  }
}

const processBatchFiles = async (files, targetBatchIndex = null) => {
  const imageFiles = files.filter(f => /\.(png|jpe?g|webp)$/i.test(f.name))
  if (imageFiles.length === 0) {
    batchUploadFeedback.value = 'No PNG, JPG, or WEBP images found in selection.'
    setTimeout(() => { batchUploadFeedback.value = '' }, 4000)
    return
  }

  batchUploading.value = true
  batchUploadFeedback.value = `Analyzing and matching ${imageFiles.length} images...`

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

    // Chunk upload in batches of 4 to guarantee payload safety
    const chunkSize = 4
    let totalUploaded = 0

    for (let i = 0; i < mappedItems.length; i += chunkSize) {
      const chunk = mappedItems.slice(i, i + chunkSize)
      batchUploadFeedback.value = `Uploading panels ${i + 1} to ${Math.min(i + chunkSize, mappedItems.length)} of ${mappedItems.length}...`

      const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/batch-upload`, {
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
      } else {
        throw new Error(data.error || 'Upload chunk failed')
      }
    }

    batchUploadFeedback.value = `✓ Successfully ingested and mapped ${totalUploaded} panels!`
    cacheBuster.value = Date.now()
    await loadScenes()
    await loadPipelineStatus()
  } catch (e) {
    batchUploadFeedback.value = `Batch upload error: ${e.message}`
  } finally {
    batchUploading.value = false
    setTimeout(() => { batchUploadFeedback.value = '' }, 6000)
  }
}

// BGM & Sidechain Ducking State
const bgmTracks = ref([])
const selectedBgmTrack = ref('01_Catacombs_SubBass_Drone.mp3')
const selectedBgmVolume = ref(-22)
const activePreviewTrack = ref(null)
const bgmAudioPlayer = ref(null)

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
    bgmAudioPlayer.value.volume = Math.max(0.01, Math.min(1.0, Math.pow(10, selectedBgmVolume.value / 20)))
    bgmAudioPlayer.value.play().catch(() => {})
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

const availableBatches = computed(() => {
  const total = scenes.value.length || 266
  const chunkSize = 24
  const count = Math.ceil(total / chunkSize)
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
  const list = []
  for (let i = 0; i < count; i++) {
    const start = i * chunkSize + 1
    const end = Math.min((i + 1) * chunkSize, total)
    const letter = letters[i] || `Batch_${i + 1}`
    list.push({
      index: i,
      letter,
      label: `Batch ${letter} (Scenes ${String(start).padStart(3, '0')}–${String(end).padStart(3, '0')})`,
      filename: `Batch_${letter}_Preview_1080p.mp4`
    })
  }
  return list
})

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
  const reader = new FileReader()
  reader.onload = async (e) => {
    await uploadBase64(tag, e.target.result)
  }
  reader.readAsDataURL(file)
}

const handleFileDrop = async (event, tag) => {
  const file = event.dataTransfer.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async (e) => {
    await uploadBase64(tag, e.target.result)
  }
  reader.readAsDataURL(file)
}

const uploadBase64 = async (tag, base64Data) => {
  try {
    const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag, base64Data })
    })
    const data = await res.json()
    if (data.success) {
      cacheBuster.value = Date.now()
      await loadScenes()
      await loadPipelineStatus()
    }
  } catch (e) {}
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

const compileVideo = async () => {
  compiling.value = true
  modalState.value = {
    show: true,
    isMinimized: false,
    activeStage: 'compiler',
    status: 'running',
    progress: 10,
    message: 'Initializing compilation for Full 1080p Master Episode...',
    logs: ['Launching FFmpeg compilation job for Full 1080p Master Episode...']
  }

  try {
    const payload = {
      kenBurns: true,
      burnSubtitles: true,
      bgmTrack: selectedBgmTrack.value,
      bgmVolume: selectedBgmVolume.value
    }

    await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/compile-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    startPolling()
  } catch (e) {
    compiling.value = false
    modalState.value.status = 'failed'
    modalState.value.message = e.message
    modalState.value.logs = [...modalState.value.logs, `Compilation error: ${e.message}`]
  }
}

const startPolling = () => {
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
        modalState.value.message = 'Master 1080p Video compilation completed successfully!'
        modalState.value.logs = [...(data.log || []), 'Master 1080p MP4 ready with frame-accurate subtitles.']
        cacheBuster.value = Date.now()
        await loadPipelineStatus()
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
