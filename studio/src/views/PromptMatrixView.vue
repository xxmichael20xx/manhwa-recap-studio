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
            {{ episodeScopedModels.length }} Plates
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
          <span v-if="completedBatchesCount > 0" class="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <span>{{ completedBatchesCount }}/{{ dynamicBatches.length }}</span>
            <Check class="w-2.5 h-2.5 inline" />
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
        <button 
          @click="filterMode = 'fresh'"
          class="px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center space-x-1.5"
          :class="filterMode === 'fresh' 
            ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 font-bold shadow-xs' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
          title="Filter newly regenerated/fresh images synced after prompt matrix update"
        >
          <Sparkles class="w-3 h-3 text-cyan-500" />
          <span>Fresh / Synced</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
            {{ freshCount }}
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
          :disabled="isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit"
          class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm"
          :class="(isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
        >
          <Check v-if="activeCopiedKey === 'SELECTED'" class="w-3.5 h-3.5 text-emerald-300" />
          <Zap v-else class="w-3.5 h-3.5 text-purple-200" />
          <span>{{ activeCopiedKey === 'SELECTED' ? 'Selected XML Copied!' : `Copy Selected (${selectedTags.size} Scenes)` }}</span>
        </button>

        <!-- Direct Copy Missing Button -->
        <button 
          v-if="missingCount > 0 && selectedTags.size === 0"
          @click="copyMissingPrompts"
          :disabled="isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit"
          class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm"
          :class="(isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
        >
          <Check v-if="activeCopiedKey === 'MISSING'" class="w-3.5 h-3.5 text-emerald-300" />
          <AlertTriangle v-else class="w-3.5 h-3.5 text-amber-200" />
          <span>{{ activeCopiedKey === 'MISSING' ? 'Missing XML Copied!' : `⚡ Copy Failed/Missing Only (${missingCount})` }}</span>
        </button>
      </div>
    </div>

    <!-- Batch Pre-Flight Health Bar & Fast Navigator -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center space-x-2.5">
          <ShieldCheck class="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Batch Pre-Flight Health & Verification Hub</h2>
          <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
            {{ verifiedBatchesCount }}/{{ dynamicBatches.length }} Batches 100% on Disk • {{ readyCount }}/{{ parsedPrompts.length }} Master Plates
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="selectedBatchFilter = null"
            class="px-3 py-1 rounded-lg text-xs font-mono font-semibold transition cursor-pointer"
            :class="selectedBatchFilter === null 
              ? 'bg-purple-600 text-white shadow-xs' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
          >
            All Batches ({{ dynamicBatches.length }})
          </button>
        </div>
      </div>

            <!-- Mandatory Character Entity UUID Gate Warning Banner -->
      <div 
        v-if="isCopyDisabledDueToMissingUuids" 
        class="mb-3 p-4 rounded-xl border border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/40 shadow-xs flex items-start space-x-3 text-rose-900 dark:text-rose-200"
      >
        <AlertTriangle class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div class="space-y-1 text-xs">
          <div class="font-bold flex items-center space-x-2">
            <span class="text-sm font-semibold text-rose-700 dark:text-rose-300">Prompt Matrix Copying Locked</span>
            <span class="px-2 py-0.5 rounded-full bg-rose-200/80 dark:bg-rose-900 text-[10px] font-mono font-bold text-rose-800 dark:text-rose-200">
              {{ unmappedCharacterEntities.length }} Missing UUID{{ unmappedCharacterEntities.length > 1 ? 's' : '' }}
            </span>
          </div>
          <p class="text-rose-700 dark:text-rose-300 leading-relaxed">
            Copying prompt chunks or batch XML is disabled to prevent generation drift. The following character entities do not have valid Google Flow UUIDs configured in Character DNA / Vault:
          </p>
          <div class="flex flex-wrap gap-1.5 pt-1">
            <span 
              v-for="char in unmappedCharacterEntities" 
              :key="char"
              class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 font-mono text-[11px] font-semibold text-rose-700 dark:text-rose-300 shadow-2xs"
            >
              @{{ char }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-2 pt-2">
            <button 
              @click="copyFlowUuidPrompt"
              class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              title="Copy simplified prompt to ask Google Flow for character UUIDs"
            >
              <Copy class="w-3.5 h-3.5" />
              <span>📋 Copy Flow UUID Prompt</span>
            </button>
            <router-link
              :to="{ name: 'series-detail', params: { id: route.params.franchiseId } }"
              class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-mono font-bold flex items-center space-x-1.5 transition"
            >
              <ExternalLink class="w-3.5 h-3.5" />
              <span>Go to Character Vault to Paste UUIDs</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Mandatory Pre-Flight Audit Gate Warning Banner -->
      <div 
        v-if="isCopyDisabledDueToAudit" 
        class="mb-3 p-4 rounded-xl border border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/40 shadow-xs flex items-start space-x-3 text-rose-900 dark:text-rose-200"
      >
        <AlertTriangle class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div class="space-y-1 text-xs">
          <div class="font-bold flex items-center space-x-2">
            <span class="text-sm font-semibold text-rose-700 dark:text-rose-300">Prompt Matrix Copying Locked (Pre-Flight Audit Blocked)</span>
            <span class="px-2 py-0.5 rounded-full bg-rose-200/80 dark:bg-rose-900 text-[10px] font-mono font-bold text-rose-800 dark:text-rose-200">
              Score: {{ promptAuditReport?.overallScore }}%
            </span>
          </div>
          <p class="text-rose-700 dark:text-rose-300 leading-relaxed">
            Prompt matrix copying is locked until all 7 deterministic anti-slop checks pass 100%. Failing checks:
          </p>
          <ul class="list-disc list-inside space-y-0.5 pt-0.5">
            <li v-for="c in failingChecks" :key="c.id" class="text-rose-800 dark:text-rose-200 font-medium">
              <strong>{{ c.name }}:</strong> {{ c.details }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Batch Mini-Cards Grid -->
      <div class="grid grid-cols-[repeat(auto-fill,minmax(85px,1fr))] gap-2">
        <div 
          v-for="(b, bIdx) in dynamicBatches"
          :key="bIdx"
          @click="selectedBatchFilter = (selectedBatchFilter === bIdx ? null : bIdx)"
          class="p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col justify-between"
          :class="[
            selectedBatchFilter === bIdx 
              ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 shadow-xs' 
              : 'hover:border-purple-400 dark:hover:border-purple-600 bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
          ]"
          :title="`Click to filter scenes to ${b.name} (${b.startTag}–${b.endTag})`"
        >
          <div class="flex items-center justify-between text-[11px] font-mono font-bold">
            <span :class="selectedBatchFilter === bIdx ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'">
              {{ b.name }}
            </span>
            <CheckCircle2 v-if="b.missingCount === 0" class="w-3 h-3 text-emerald-500 shrink-0" />
            <AlertCircle v-else class="w-3 h-3 text-amber-500 shrink-0" />
          </div>
          <div class="my-1">
            <span class="text-xs font-mono font-bold" :class="b.missingCount === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
              {{ b.readyCount }}/{{ b.items.length }}
            </span>
          </div>
          <div class="text-[9px] font-mono truncate">
            <span v-if="b.freshCount > 0" class="text-cyan-600 dark:text-cyan-400 font-bold">
              {{ b.freshCount }} Fresh
            </span>
            <span v-else-if="b.missingCount > 0" class="text-rose-500 font-bold">
              {{ b.missingCount }} Missing
            </span>
            <span v-else class="text-slate-400">
              Synced
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Prompts Table / Cards -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center space-x-3">
          <span class="text-sm font-mono text-slate-500 dark:text-slate-400">
            Showing <strong class="text-slate-900 dark:text-white">{{ filteredPrompts.length }}</strong> of {{ parsedPrompts.length }} Scenes
            <span v-if="selectedBatchFilter !== null" class="ml-1 px-2 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
              Filtered: {{ dynamicBatches[selectedBatchFilter]?.name }}
            </span>
            • {{ dynamicBatches.length }} Batches (Micro-Chunks: {{ microChunkSize }} scenes)
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

      <!-- Active Filtered Batch Pre-Flight Status Header -->
      <div 
        v-if="selectedBatchFilter !== null && dynamicBatches[selectedBatchFilter]"
        class="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-500/5 via-slate-50 to-purple-500/5 dark:from-purple-950/20 dark:via-slate-900 dark:to-purple-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div class="space-y-1.5">
          <div class="flex items-center space-x-2.5">
            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-600 text-white shadow-xs">
              {{ dynamicBatches[selectedBatchFilter].name }}
            </span>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">
              Scenes {{ dynamicBatches[selectedBatchFilter].startIndex + 1 }}–{{ dynamicBatches[selectedBatchFilter].endIndex }} ({{ dynamicBatches[selectedBatchFilter].startTag }} → {{ dynamicBatches[selectedBatchFilter].endTag }})
            </h3>
            <span 
              class="text-xs font-mono px-2 py-0.5 rounded-full font-bold border flex items-center gap-1"
              :class="dynamicBatches[selectedBatchFilter].missingCount === 0 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'"
            >
              <Check v-if="dynamicBatches[selectedBatchFilter].missingCount === 0" class="w-3 h-3 text-emerald-500" />
              <AlertTriangle v-else class="w-3 h-3 text-amber-500" />
              <span>{{ dynamicBatches[selectedBatchFilter].missingCount === 0 ? '100% On Disk' : 'Missing Plates' }}</span>
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Verified: <strong class="text-slate-800 dark:text-slate-200">{{ dynamicBatches[selectedBatchFilter].readyCount }}/{{ dynamicBatches[selectedBatchFilter].items.length }}</strong> ({{ dynamicBatches[selectedBatchFilter].healthPercent }}%)</span>
            <span>•</span>
            <span class="text-cyan-600 dark:text-cyan-400 font-semibold">Fresh / Synced: <strong>{{ dynamicBatches[selectedBatchFilter].freshCount }}</strong></span>
            <span>•</span>
            <span class="text-amber-600 dark:text-amber-400 font-semibold">Needs Re-sync: <strong>{{ dynamicBatches[selectedBatchFilter].staleCount }}</strong></span>
            <span>•</span>
            <span :class="dynamicBatches[selectedBatchFilter].missingCount > 0 ? 'text-rose-500 font-bold' : 'text-slate-400'">Missing: <strong>{{ dynamicBatches[selectedBatchFilter].missingCount }}</strong></span>
          </div>
        </div>

        <div class="flex items-center space-x-2 shrink-0">
          <button 
            @click="compileBatchPreview(selectedBatchFilter)"
            :disabled="batchCompilingIndex === selectedBatchFilter"
            class="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-2 transition cursor-pointer disabled:opacity-50 shadow-sm"
            :title="`Compile ${dynamicBatches[selectedBatchFilter].name} Preview Video`"
          >
            <Loader2 v-if="batchCompilingIndex === selectedBatchFilter" class="w-3.5 h-3.5 animate-spin" />
            <Film v-else class="w-3.5 h-3.5" />
            <span>{{ batchCompilingIndex === selectedBatchFilter ? 'Compiling...' : 'Compile Batch Preview' }}</span>
          </button>
          <button 
            @click="openBatchDrawer(selectedBatchFilter)"
            class="px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-2xs"
            title="Open Google Flow Dispatch Drawer"
          >
            Dispatch Drawer
          </button>
          <button 
            @click="selectedBatchFilter = null"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Clear Batch Filter (View All Scenes)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="divide-y divide-slate-200 dark:divide-slate-800">
        <div 
          v-for="(p, index) in filteredPrompts" 
          :key="p.tag"
          class="p-5 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-start gap-5"
          :class="{ 
            'bg-purple-50/20 dark:bg-purple-950/10': selectedTags.has(p.tag),
            'border-l-4 border-l-rose-500 bg-rose-500/5 dark:bg-rose-950/15': isSceneFailingAudit(p.tag)
          }"
        >
          <!-- Multi-Select Checkbox -->
          <div class="pt-1 shrink-0 flex items-center lg:flex-col gap-2">
            <input 
              type="checkbox" 
              :checked="selectedTags.has(p.tag)"
              @change="toggleSelect(p.tag)"
              class="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              :title="`Select ${p.tag}`"
            />
          </div>

          <!-- Physical Plate Thumbnail Preview / Lightbox Trigger -->
          <div class="shrink-0 w-full sm:w-60 lg:w-64">
            <div 
              v-if="p.hasImage && p.imageUrl"
              @click="openLightbox(p)"
              class="group relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-sm cursor-pointer hover:border-purple-500/80 hover:shadow-md transition-all duration-200"
              :title="`Click to inspect ${p.tag} plate in full-resolution lightbox`"
            >
              <img 
                :src="p.imageUrl" 
                :alt="p.tag" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy" 
              />
              
              <!-- Hover Overlay with Zoom Icon -->
              <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white text-xs font-mono font-bold backdrop-blur-[2px]">
                <Eye class="w-4 h-4 text-purple-300" />
                <span>Inspect Plate</span>
              </div>

              <!-- Corner Metadata Badges -->
              <div class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-mono text-white/90 font-medium">
                {{ formatFileSize(p.size) }}
              </div>
              <div class="absolute top-1.5 right-1.5">
                <span 
                  v-if="p.freshness === 'fresh'"
                  class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/90 text-white shadow-xs flex items-center space-x-1"
                  title="Fresh: Plate generated/updated with latest prompt matrix"
                >
                  <Sparkles class="w-2.5 h-2.5" />
                  <span>Fresh</span>
                </span>
                <span 
                  v-else-if="p.freshness === 'stale'"
                  class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/90 text-white shadow-xs flex items-center space-x-1"
                  title="Needs Re-sync: Prompt matrix updated after this plate was generated"
                >
                  <Clock class="w-2.5 h-2.5" />
                  <span>Stale</span>
                </span>
              </div>
            </div>

            <!-- Missing Image Empty Placeholder with Dropzone Capability -->
            <div 
              v-else
              @dragover.prevent
              @drop.prevent="handlePromptPlateDrop($event, p.tag)"
              class="aspect-video w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 hover:border-purple-500 hover:bg-purple-50/20 dark:hover:bg-purple-950/20 flex flex-col items-center justify-center text-slate-400 p-3 text-center transition cursor-pointer group relative"
              :title="`Drop replacement JPG/PNG or .ZIP archive for [${p.tag}]`"
            >
              <div v-if="uploadingPromptTags.has(p.tag)" class="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-1 text-white rounded-xl z-10">
                <Loader2 class="w-5 h-5 text-purple-400 animate-spin" />
                <span class="text-[10px] font-mono font-bold">Uploading [{{ p.tag }}]...</span>
              </div>
              <Upload class="w-5 h-5 text-purple-500/70 mb-1 group-hover:scale-110 transition" />
              <span class="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">Drop Plate or ZIP Here</span>
              <span class="text-[10px] font-mono text-slate-400 mt-0.5">Auto-maps JPG, PNG, or .ZIP</span>
            </div>
          </div>

          <!-- Scene Content & Metadata -->
          <div class="space-y-3 flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-mono px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-bold">
                {{ p.tag }}
              </span>

              <!-- Audit Issue Badge -->
              <span 
                v-if="isSceneFailingAudit(p.tag)"
                class="text-xs font-mono px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 font-bold flex items-center space-x-1.5"
                :title="`Audit Issue: ${getSceneFailingReason(p.tag)}`"
              >
                <AlertTriangle class="w-3.5 h-3.5 text-rose-500" />
                <span>Audit Issue</span>
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

              <!-- Freshness & Timestamp Badge -->
              <span 
                v-if="p.hasImage && p.freshness === 'fresh'"
                class="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 font-semibold flex items-center space-x-1.5"
                :title="`Modified: ${formatDate(p.mtime)}`"
              >
                <Sparkles class="w-3.5 h-3.5 text-cyan-500" />
                <span>Fresh / Synced</span>
                <span v-if="p.mtime" class="text-[10px] opacity-75">({{ formatDate(p.mtime) }})</span>
              </span>
              <span 
                v-else-if="p.hasImage && p.freshness === 'stale'"
                class="text-xs font-mono px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-semibold flex items-center space-x-1.5"
                :title="`Plate mod: ${formatDate(p.mtime)} vs Matrix mod: ${formatDate(p.promptMatrixMtime)}`"
              >
                <Clock class="w-3.5 h-3.5 text-amber-500" />
                <span>Needs Re-sync</span>
                <span v-if="p.mtime" class="text-[10px] opacity-75">({{ formatDate(p.mtime) }})</span>
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

              <span class="text-sm font-bold text-slate-900 dark:text-white truncate">
                {{ p.description }}
              </span>
            </div>

            <!-- Surfaced Character & Item Tokens Bar -->
            <div v-if="p.characterTokens && p.characterTokens.length > 0" class="flex flex-wrap items-center gap-1.5">
              <span class="text-[10px] font-mono font-bold uppercase text-slate-500">Characters & Props:</span>
              <button 
                v-for="token in p.characterTokens"
                :key="token"
                @click="copyTokenDirect(token)"
                class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition cursor-pointer"
                :title="`Click to copy token '${token}'`"
              >
                <span>{{ token }}</span>
                <Check v-if="copiedDirectToken === token" class="w-3 h-3 text-emerald-500" />
                <Copy v-else class="w-3 h-3 text-purple-400 opacity-60" />
              </button>
            </div>

            <!-- Narrative Sync Clause (Voiceover Pairing) -->
            <div 
              v-if="p.narrativeSync" 
              class="text-xs font-serif italic text-slate-700 dark:text-slate-300 bg-purple-50/50 dark:bg-purple-950/20 px-3.5 py-2.5 rounded-xl border border-purple-200/60 dark:border-purple-800/40 flex items-start space-x-2 leading-relaxed"
            >
              <span class="text-sm select-none shrink-0">🎙️</span>
              <div>
                <span class="font-sans font-bold text-[10px] uppercase tracking-wider text-purple-700 dark:text-purple-300 block select-none mb-0.5">Narrative Sync (Bit-for-Bit VO Match)</span>
                <span>{{ p.narrativeSync }}</span>
              </div>
            </div>

            <!-- Prompt Text -->
            <p class="text-sm font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 break-words select-all leading-relaxed">
              {{ getDisplayPrompt(p) }}
            </p>
          </div>

          <!-- Actions Column -->
          <div class="shrink-0 pt-1 flex flex-row lg:flex-col items-center gap-2">
            <button 
              @click="copySinglePrompt(p, index)"
              :disabled="isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit"
              class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-sm w-full justify-center"
              :class="(isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-600 hover:text-white hover:border-purple-600 cursor-pointer'"
            >
              <Check v-if="copiedIndex === index" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ copiedIndex === index ? 'Copied XML' : 'Copy <scene>' }}</span>
            </button>
            <button 
              v-if="p.hasImage && p.imageUrl"
              @click="openLightbox(p)"
              class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold flex items-center space-x-1.5 transition cursor-pointer w-full justify-center"
              title="Inspect plate in full-resolution lightbox"
            >
              <Eye class="w-3.5 h-3.5 text-purple-500" />
              <span>Inspect Plate</span>
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

                            <!-- Drawer Character Entity UUID Gate Banner -->
              <div 
                v-if="isCopyDisabledDueToMissingUuids" 
                class="mt-4 p-3.5 rounded-xl border border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/50 shadow-xs flex items-start space-x-2.5 text-rose-900 dark:text-rose-200 text-xs"
              >
                <AlertTriangle class="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div class="space-y-1.5 flex-1">
                  <span class="font-bold text-rose-700 dark:text-rose-300 block">Copying Disabled: Missing Character UUIDs</span>
                  <p class="text-[11px] text-rose-700 dark:text-rose-300 leading-normal">
                    Please map UUIDs for: <span class="font-mono font-semibold">{{ unmappedCharacterEntities.join(', ') }}</span> in the Character Vault before copying chunks.
                  </p>
                  <div class="flex items-center space-x-2 pt-1">
                    <button 
                      @click="copyFlowUuidPrompt"
                      class="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-mono font-bold flex items-center space-x-1 transition cursor-pointer"
                    >
                      <Copy class="w-3 h-3" />
                      <span>📋 Copy Flow UUID Prompt</span>
                    </button>
                    <router-link
                      :to="{ name: 'series-detail', params: { id: route.params.franchiseId } }"
                      class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[11px] font-mono font-bold flex items-center space-x-1 transition"
                    >
                      <ExternalLink class="w-3 h-3" />
                      <span>Vault</span>
                    </router-link>
                  </div>
                </div>
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

              <!-- Collapsible Secondary Tools Accordion Group (Saves Drawer Space) -->
              <div class="mt-3 space-y-2">
                <!-- Accordion 1: Missing / Failed Scenes (if any) -->
                <div v-if="missingCount > 0" class="rounded-xl border border-amber-500/30 bg-amber-500/10 overflow-hidden">
                  <button 
                    @click="isMissingScenesAccordionOpen = !isMissingScenesAccordionOpen"
                    class="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-amber-500/15 transition-colors"
                  >
                    <div class="flex items-center space-x-2">
                      <AlertCircle class="w-4 h-4 text-amber-500" />
                      <span class="text-xs font-bold text-amber-800 dark:text-amber-200">Missing / Failed Scenes ({{ missingCount }})</span>
                    </div>
                    <ChevronDown class="w-4 h-4 text-amber-600 transition-transform duration-200" :class="{ 'rotate-180': isMissingScenesAccordionOpen }" />
                  </button>
                  <div v-if="isMissingScenesAccordionOpen" class="p-3 pt-0 border-t border-amber-500/20 mt-2 space-y-2">
                    <p class="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                      {{ missingCount }} master plates missing on disk for this episode.
                    </p>
                    <button 
                      @click="copyMissingPrompts"
                      :disabled="isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit"
                      class="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition shadow-xs flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
                    >
                      <span>{{ activeCopiedKey === 'MISSING' ? 'Copied Missing XML!' : `⚡ Copy ${missingCount} Missing Prompts` }}</span>
                    </button>
                  </div>
                </div>

                <!-- Accordion 2: Flow Agent Master Instructions -->
                <div class="rounded-xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 overflow-hidden">
                  <button 
                    @click="isMasterInstructionsAccordionOpen = !isMasterInstructionsAccordionOpen"
                    class="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-purple-500/10 transition-colors"
                  >
                    <div class="flex items-center space-x-2">
                      <Sparkles class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span class="text-xs font-bold text-slate-900 dark:text-white">Flow Agent Master Instructions</span>
                    </div>
                    <div class="flex items-center space-x-1.5">
                      <span class="text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        Tier 1
                      </span>
                      <ChevronDown class="w-4 h-4 text-purple-500 transition-transform duration-200" :class="{ 'rotate-180': isMasterInstructionsAccordionOpen }" />
                    </div>
                  </button>
                  <div v-if="isMasterInstructionsAccordionOpen" class="p-3 pt-0 border-t border-purple-500/20 mt-2 space-y-2">
                    <p class="text-[11px] text-slate-600 dark:text-slate-400 font-mono leading-relaxed">
                      Set once in Google Flow Agent Instructions. Enforces 100% textless artwork, anatomy invariants, single protagonist isolation, and {{ activeDirectiveFormat }} styling.
                    </p>
                    <button
                      @click="copyMasterAgentInstructions"
                      class="w-full py-2 px-3 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                      :class="copiedMasterInstructions 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'"
                    >
                      <Check v-if="copiedMasterInstructions" class="w-4 h-4" />
                      <Copy v-else class="w-4 h-4" />
                      <span>{{ copiedMasterInstructions ? `Copied Master Instructions!` : `📋 Copy Instructions (${activeDirectiveFormat})` }}</span>
                    </button>
                  </div>
                </div>

                <!-- Accordion 3: Pre-Flight Prompt Matrix Health Hub -->
                <div 
                  class="rounded-xl border overflow-hidden transition-colors"
                  :class="promptAuditReport?.isProductionReady 
                    ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20' 
                    : 'border-rose-500/40 bg-rose-50/30 dark:bg-rose-950/20'"
                >
                  <button 
                    @click="isPromptAuditAccordionOpen = !isPromptAuditAccordionOpen"
                    class="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div class="flex items-center space-x-2">
                      <ShieldCheck v-if="promptAuditReport?.isProductionReady" class="w-4 h-4 text-emerald-500" />
                      <AlertTriangle v-else class="w-4 h-4 text-rose-500" />
                      <span class="text-xs font-bold text-slate-900 dark:text-white">Pre-Flight Matrix Audit</span>
                      <span 
                        class="text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold border"
                        :class="promptAuditReport?.isProductionReady 
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'"
                      >
                        {{ promptAuditReport ? (promptAuditReport.isProductionReady ? '100% Production Ready' : `Blocked (${promptAuditReport.overallScore}%)`) : 'Auditing...' }}
                      </span>
                    </div>
                    <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isPromptAuditAccordionOpen }" />
                  </button>
                  <div v-if="isPromptAuditAccordionOpen" class="p-3 pt-0 border-t border-slate-200 dark:border-slate-800 mt-2 space-y-2">
                    <div class="flex items-center justify-between text-[11px] font-mono">
                      <span class="text-slate-500 dark:text-slate-400">Deterministic Score:</span>
                      <span class="font-bold" :class="promptAuditReport?.isProductionReady ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
                        {{ promptAuditReport?.overallScore ?? 0 }} / 100
                      </span>
                    </div>
                    <div v-if="promptAuditReport?.checks" class="space-y-1.5 pt-1">
                      <div 
                        v-for="check in promptAuditReport.checks" 
                        :key="check.id"
                        class="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-0.5"
                      >
                        <div class="flex items-center justify-between">
                          <span class="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{{ check.name }}</span>
                          <span 
                            class="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 border"
                            :class="check.passed 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'"
                          >
                            {{ check.passed ? '[PASS]' : `[FAIL ${check.score}%]` }}
                          </span>
                        </div>
                        <p class="text-[10px] font-mono text-slate-500 dark:text-slate-400 leading-tight">
                          {{ check.details }}
                        </p>
                      </div>
                    </div>
                    <div v-if="!promptAuditReport?.isProductionReady" class="pt-1">
                      <p class="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-semibold leading-tight">
                        ⚠️ XML copying locked until all pre-flight checks achieve 100% pass score.
                      </p>
                    </div>
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
                class="rounded-xl border transition-all duration-300 overflow-hidden"
                :class="batch.isFullyCopied 
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500/80 ring-2 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-500/40 shadow-xs'"
              >
                <!-- Streamlined Batch Row -->
                <div class="p-4 flex items-center justify-between select-none">
                  <div class="flex items-center space-x-3 min-w-0">
                    <span 
                      class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 transition-colors"
                      :class="batch.isFullyCopied 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'"
                    >
                      {{ batch.name }}
                    </span>
                    <div class="min-w-0">
                      <div class="text-sm font-bold text-slate-900 dark:text-white truncate">
                        Scenes {{ batch.startIndex + 1 }}–{{ batch.endIndex }}
                      </div>
                      <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        {{ batch.startTag }} → {{ batch.endTag }} ({{ batch.items.length }} scenes)
                      </div>
                    </div>
                  </div>

                  <!-- 1-Click Copy Batch XML Button -->
                  <div class="flex items-center space-x-2 shrink-0 ml-3">
                    <button
                      @click="copyBatchFullXml(batch, bIdx)"
                      :disabled="isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit"
                      class="px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-xs"
                      :class="[
                        (isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit)
                          ? 'opacity-40 cursor-not-allowed bg-slate-400 text-white'
                          : (batch.isFullyCopied || activeCopiedKey === `FULL_${bIdx}`
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-950/20'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white cursor-pointer active:scale-95')
                      ]"
                      :title="`Copy full ${batch.name} XML (${batch.items.length} scenes)`"
                    >
                      <Check v-if="batch.isFullyCopied || activeCopiedKey === `FULL_${bIdx}`" class="w-3.5 h-3.5 text-white" />
                      <Copy v-else class="w-3.5 h-3.5 text-purple-200" />
                      <span>{{ (batch.isFullyCopied || activeCopiedKey === `FULL_${bIdx}`) ? 'Copied' : 'Copy XML' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Fallback Copy All In One -->
              <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button 
                  @click="copyAllMaster"
                  :disabled="isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit"
                  class="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-sm font-bold flex items-center justify-center space-x-2 transition-all"
                  :class="(isCopyDisabledDueToMissingUuids || isCopyDisabledDueToAudit) ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-500/40 hover:text-slate-900 dark:hover:text-white cursor-pointer'"
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
                        {{ filteredVaultModels.length }} Reference Plates
                      </span>
                    </h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Master reference plates for Google Flow. Click Token to copy @{...}, Copy DNA, or Download plate directly.
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button 
                    @click="copyFlowUuidPrompt"
                    class="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 transition cursor-pointer"
                    title="Copy simplified prompt to ask Google Flow for character UUIDs"
                  >
                    <Sparkles class="w-3.5 h-3.5 text-purple-500" />
                    <span>📋 Copy Flow UUID Prompt</span>
                  </button>
                  <button 
                    @click="isVaultDrawerOpen = false"
                    class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Scope & Category Filter Tabs -->
              <div class="mt-4 flex flex-wrap items-center justify-between gap-2">
                <!-- Episode Scope Switcher -->
                <div class="flex items-center space-x-1 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-mono">
                  <button 
                    @click="episodeScope = 'episode'"
                    class="px-2.5 py-1 rounded-lg transition font-medium cursor-pointer"
                    :class="episodeScope === 'episode' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
                    title="Show only characters appearing in this episode"
                  >
                    This Episode ({{ episodeScopedModels.length }})
                  </button>
                  <button 
                    @click="episodeScope = 'all'"
                    class="px-2.5 py-1 rounded-lg transition font-medium cursor-pointer"
                    :class="episodeScope === 'all' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
                    title="Show all franchise characters across all episodes"
                  >
                    All Franchise ({{ vaultModels.length }})
                  </button>
                </div>

                <!-- Category Filter Tabs -->
                <div class="flex flex-wrap items-center gap-1.5 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-mono">
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
            </div>

            <!-- Drawer Body: Grid of Cards -->
            <div class="p-6 space-y-4 overflow-y-auto flex-1">
              <div class="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
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
                        {{ copiedVaultId === model.id && copiedVaultType === 'name' ? 'Copied' : 'Copy Name' }}
                      </span>
                    </div>

                    <!-- Description -->
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2" :title="model.description">
                      {{ model.description }}
                    </p>
                  </div>

                  <!-- Actions -->
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
                      title="Copy Complete Visual DNA Prompt"
                    >
                      <Check v-if="copiedVaultId === model.id && copiedVaultType === 'dna'" class="w-3 h-3 shrink-0" />
                      <Sparkles v-else class="w-3 h-3 shrink-0" />
                      <span class="truncate">{{ copiedVaultId === model.id && copiedVaultType === 'dna' ? 'Copied' : 'DNA' }}</span>
                    </button>
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
                  <span class="text-xs font-mono px-2 py-0.5 rounded-full font-bold flex items-center space-x-1"
                    :class="activeDirectiveFormat === '16:9' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'"
                  >
                    <span>🔒</span>
                    <span>{{ activeDirectiveFormat === '16:9' ? 'Format 2 (16:9 Landscape)' : 'Format 1 (9:16 Webtoon)' }}</span>
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

            <div class="flex items-center gap-2">
              <!-- Batch Scope Selector when previewing Tier 2 -->
              <select
                v-if="directiveTierTab === 'batch' && dynamicBatches.length > 0"
                v-model="previewDirectiveBatchIdx"
                class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer"
                title="Preview smart batch header for a specific batch"
              >
                <option :value="-1">Episode Scope (All {{ parsedPrompts.length }} Scenes)</option>
                <option v-for="(b, bIdx) in dynamicBatches" :key="bIdx" :value="bIdx">
                  {{ b.name }} ({{ b.startTag }}–{{ b.endTag }})
                </option>
              </select>

              <!-- Locked Series Format Badge (Strictly Locked at Series Creation) -->
              <div 
                class="flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border"
                :class="activeDirectiveFormat === '16:9'
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'"
                title="Aspect ratio is permanently locked by Series Bible"
              >
                <span class="text-amber-500">🔒</span>
                <span>{{ activeDirectiveFormat === '16:9' ? '16:9 Landscape' : '9:16 Webtoon' }}</span>
                <span class="text-[10px] text-slate-400 font-normal uppercase">(Series Locked)</span>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-5 space-y-4 overflow-y-auto flex-1 font-mono text-xs">
            <div class="p-3.5 rounded-xl border flex items-start space-x-2.5"
              :class="directiveTierTab === 'master' ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200/60 dark:border-purple-500/20' : 'bg-cyan-50/60 dark:bg-cyan-950/20 border-cyan-200/60 dark:border-cyan-500/20'"
            >
              <ShieldCheck class="w-4 h-4 shrink-0 mt-0.5" :class="directiveTierTab === 'master' ? 'text-purple-600 dark:text-purple-400' : 'text-cyan-600 dark:text-cyan-400'" />
              <div class="space-y-2 flex-1">
                <p class="text-[11px] leading-relaxed" :class="directiveTierTab === 'master' ? 'text-purple-950 dark:text-purple-200' : 'text-cyan-950 dark:text-cyan-200'">
                  <template v-if="directiveTierTab === 'master'">
                    <strong>Tier 1 — Smart Context-Aware Master Instructions:</strong> Paste once into Google Flow's <em>Agent Instructions</em> panel (document icon &rarr; + Add instruction). Enforces <code>@{Character Name}</code> entity mapping, detected protagonist, boss/construct anti-morphing guards, and text silencing.
                  </template>
                  <template v-else>
                    <strong>Tier 2 — Smart Per-Batch Header:</strong> Prepended automatically when copying any batch or chunk. Whitelists environmental text ONLY on scenes that actually contain UI panels/scrolls/signs and locks all other scenes to 100% pure textless.
                  </template>
                </p>

                <!-- Smart Context Auto-Detection Badges -->
                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-purple-700 dark:text-purple-300 border border-purple-300/60 dark:border-purple-700/60">
                    🎯 Protagonist: {{ activeFlowIntelligence.protagonistLabel }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                    📜 Env Text: {{ activeFlowIntelligence.diegeticSceneTags.length > 0 ? `${activeFlowIntelligence.diegeticSceneTags.length} Scene(s) Whitelisted` : '0 Scenes (100% Pure Textless Locked)' }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-rose-700 dark:text-rose-300 border border-rose-300/60 dark:border-rose-700/60">
                    🛡️ Anti-Morph: {{ activeFlowIntelligence.bossOrConstructList.length > 0 ? `${activeFlowIntelligence.bossOrConstructList.length} Boss/Construct Entity Guard(s)` : 'Standard Human Isolation' }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-cyan-700 dark:text-cyan-300 border border-cyan-300/60 dark:border-cyan-700/60">
                    🎭 Action Fidelity: {{ activeFlowIntelligence.nonCombatCount }} Dialogue/Calm vs {{ activeFlowIntelligence.combatCount }} Combat
                  </span>
                </div>
              </div>
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

    <!-- Lightbox Modal for Physical Image Inspection -->
    <Teleport to="body">
      <div 
        v-if="activeLightboxScene"
        class="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 sm:p-6"
        @keydown.esc="closeLightbox"
      >
        <!-- Backdrop -->
        <div 
          @click="closeLightbox"
          class="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300"
        />

        <!-- Modal Dialog -->
        <div class="relative w-full max-w-5xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10">
          <!-- Lightbox Header -->
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between gap-4">
            <div class="flex items-center space-x-3 min-w-0">
              <span class="text-sm font-mono px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold shrink-0">
                {{ activeLightboxScene.tag }}
              </span>
              <div class="min-w-0">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {{ activeLightboxScene.description }}
                </h3>
                <div class="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>{{ formatFileSize(activeLightboxScene.size) }}</span>
                  <span v-if="activeLightboxScene.mtime">• Mod: {{ formatDate(activeLightboxScene.mtime) }}</span>
                  <span 
                    v-if="activeLightboxScene.freshness === 'fresh'"
                    class="text-cyan-600 dark:text-cyan-400 font-bold"
                  >
                    • 🟢 Fresh / Synced
                  </span>
                  <span 
                    v-else-if="activeLightboxScene.freshness === 'stale'"
                    class="text-amber-600 dark:text-amber-400 font-bold"
                  >
                    • 🟡 Needs Re-sync
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2 shrink-0">
              <button 
                @click="prevLightboxScene"
                class="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Previous plate (Left Arrow)"
              >
                <ChevronLeft class="w-5 h-5" />
              </button>
              <button 
                @click="nextLightboxScene"
                class="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Next plate (Right Arrow)"
              >
                <ChevronRight class="w-5 h-5" />
              </button>
              <a 
                v-if="activeLightboxScene.imageUrl"
                :href="activeLightboxScene.imageUrl" 
                target="_blank" 
                download
                class="p-2 rounded-lg text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Open/Download original image"
              >
                <Download class="w-5 h-5" />
              </a>
              <button 
                @click="closeLightbox"
                class="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Close (Esc)"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Lightbox Image Viewport -->
          <div class="flex-1 bg-black/95 flex items-center justify-center p-4 overflow-hidden relative min-h-[300px] max-h-[60vh]">
            <img 
              v-if="activeLightboxScene.imageUrl"
              :src="activeLightboxScene.imageUrl" 
              :alt="activeLightboxScene.tag"
              class="max-w-full max-h-full object-contain rounded shadow-lg"
            />
            <!-- Navigation Chevrons on image sides -->
            <button 
              @click="prevLightboxScene"
              class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-xs transition cursor-pointer"
            >
              <ChevronLeft class="w-6 h-6" />
            </button>
            <button 
              @click="nextLightboxScene"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-xs transition cursor-pointer"
            >
              <ChevronRight class="w-6 h-6" />
            </button>
          </div>

          <!-- Lightbox Bottom Prompt & Characters Tray -->
          <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 overflow-y-auto max-h-[25vh]">
            <!-- Character tokens -->
            <div v-if="activeLightboxScene.characterTokens && activeLightboxScene.characterTokens.length > 0" class="flex flex-wrap items-center gap-1.5">
              <span class="text-[10px] font-mono font-bold uppercase text-slate-500">Entities:</span>
              <button 
                v-for="tok in activeLightboxScene.characterTokens"
                :key="tok"
                @click="copyTokenDirect(tok)"
                class="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition cursor-pointer"
              >
                {{ tok }}
              </button>
            </div>
            <!-- Monospace prompt -->
            <p class="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed select-all">
              {{ getDisplayPrompt(activeLightboxScene) }}
            </p>
          </div>
        </div>
      </div>
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
  ChevronDown, ChevronUp, Eye, ChevronLeft, ChevronRight, Clock, Upload
} from 'lucide-vue-next'
import { 
  parseEntityMappingText, 
  transformTokens, 
  buildSceneXmlNode,
  saveEntityMapToStorage, 
  loadEntityMapFromStorage, 
  getTagModeFromStorage, 
  setTagModeToStorage 
} from '../utils/entityMapper.js'

const route = useRoute()

// Pre-Flight Prompt Matrix Audit State & Software Firewall
const promptAuditReport = ref(null)
const isPromptAuditAccordionOpen = ref(true)

const isCopyDisabledDueToAudit = computed(() => {
  return promptAuditReport.value && !promptAuditReport.value.isProductionReady
})

const failingScenesSet = computed(() => {
  return new Set((promptAuditReport.value?.failingScenes || []).map(t => t.replace(/[[\]]/g, '').toUpperCase()))
})

const isSceneFailingAudit = (tag) => {
  if (!tag || !failingScenesSet.value.size) return false
  const cleanTag = tag.replace(/[[\]]/g, '').toUpperCase()
  return failingScenesSet.value.has(cleanTag)
}

const getSceneFailingReason = (tag) => {
  if (!tag || !promptAuditReport.value || !promptAuditReport.value.checks) return ''
  const cleanTag = tag.replace(/[[\]]/g, '').toUpperCase()
  const reasons = []
  promptAuditReport.value.checks.forEach(c => {
    if (c.failingScenes && c.failingScenes.some(ft => ft.replace(/[[\]]/g, '').toUpperCase() === cleanTag)) {
      reasons.push(c.name)
    }
  })
  return reasons.join(', ')
}

const failingChecks = computed(() => {
  if (!promptAuditReport.value || !promptAuditReport.value.checks) return []
  return promptAuditReport.value.checks.filter(c => !c.passed)
})

// Google Flow Entity Mapping State
const entityMapRawText = ref('')
const parsedEntities = ref({})
const promptTagMode = ref('token') // 'token' | 'uuid'

const entityCount = computed(() => Object.keys(parsedEntities.value).length)

// Character Entity UUID Gate (Anti-Unmapped Prompt Copying Invariant)
const unmappedCharacterEntities = computed(() => {
  const charNames = new Set()
  
  if (Array.isArray(vaultModels.value)) {
    vaultModels.value.forEach(m => {
      const isChar = m.type === 'character' || ['protagonist', 'antagonist', 'supporting', 'vip', 'boss'].includes(m.category?.toLowerCase())
      if (isChar) {
        const cleanName = (m.flowName || m.name || '').replace(/\s*\([^)]*\)/, '').trim()
        if (cleanName) {
          charNames.add(cleanName)
        }
      }
    })
  }

  if (Array.isArray(parsedPrompts.value)) {
    parsedPrompts.value.forEach(p => {
      const tokens = p.characterTokens || []
      tokens.forEach(t => {
        const clean = t.replace(/^@\{?/, '').replace(/\}?$/, '').replace(/\s*\([^)]*\)/, '').trim()
        if (clean && !clean.toLowerCase().startsWith('item:') && !clean.toLowerCase().startsWith('weapon:') && !clean.toLowerCase().startsWith('general')) {
          charNames.add(clean)
        }
      })
    })
  }

  const unmapped = []
  const entityMap = parsedEntities.value || {}

  for (const name of charNames) {
    let hasValidUuid = false
    const val = entityMap[name]
    if (val && typeof val === 'string' && val.trim().length >= 8) {
      hasValidUuid = true
    } else {
      for (const [k, v] of Object.entries(entityMap)) {
        if (k.toLowerCase() === name.toLowerCase() && v && typeof v === 'string' && v.trim().length >= 8) {
          hasValidUuid = true
          break
        }
        const strippedK = k.replace(/^(Boss|Character):\s*/i, '').replace(/\s*\([^)]*\)/, '').trim().toLowerCase()
        const strippedName = name.replace(/^(Boss|Character):\s*/i, '').replace(/\s*\([^)]*\)/, '').trim().toLowerCase()
        if (strippedK === strippedName && v && typeof v === 'string' && v.trim().length >= 8) {
          hasValidUuid = true
          break
        }
      }
    }
    // Also verify against vault models if not found in entityMap
    if (!hasValidUuid && Array.isArray(vaultModels.value)) {
      const matchModel = vaultModels.value.find(m => {
        const cName = (m.flowName || m.name || '').replace(/^(Boss|Character):\s*/i, '').replace(/\s*\([^)]*\)/, '').trim().toLowerCase()
        const target = name.replace(/^(Boss|Character):\s*/i, '').replace(/\s*\([^)]*\)/, '').trim().toLowerCase()
        return cName === target
      })
      if (matchModel && matchModel.flowUuid && typeof matchModel.flowUuid === 'string' && matchModel.flowUuid.trim().length >= 8 && !/^00000000-temp/i.test(matchModel.flowUuid)) {
        hasValidUuid = true
      }
    }
    if (!hasValidUuid) {
      unmapped.push(name)
    }
  }

  return unmapped
})

const isCopyDisabledDueToMissingUuids = computed(() => {
  if (promptTagMode.value !== 'uuid') return false
  return unmappedCharacterEntities.value.length > 0
})

const copyFlowUuidPrompt = async () => {
  const characters = (vaultModels.value || [])
    .filter(m => m.type === 'character' || m.type === 'boss' || ['protagonist', 'antagonist', 'supporting', 'vip', 'boss'].includes(m.category?.toLowerCase()))
    .map(m => m.flowName || m.name)
  
  const items = (vaultModels.value || [])
    .filter(m => m.type === 'weapon' || m.type === 'artifact' || m.type === 'prop' || m.category?.toLowerCase() === 'item')
    .map(m => m.flowName || m.name)

  const allEntities = [...new Set([...characters, ...items, ...unmappedCharacterEntities.value])].filter(Boolean)
  const entityList = allEntities.length > 0 
    ? `\n\nList:\n${allEntities.map(e => `- ${e}`).join('\n')}` 
    : ''

  const promptText = `Please list all characters and items in this project with their UUIDs:

Format:
Name: UUID${entityList}`

  try {
    await navigator.clipboard.writeText(promptText)
    showToast('📋 Flow UUID Prompt Copied! Paste into Google Flow chat to retrieve UUIDs.')
  } catch (e) {
    console.error('Failed to copy flow prompt:', e)
  }
}

const togglePromptTagMode = (mode) => {
  promptTagMode.value = mode
  setTagModeToStorage(mode)
}

const getDisplayPrompt = (p) => {
  if (!p || !p.prompt) return ''
  return transformTokens(p.prompt, parsedEntities.value, promptTagMode.value)
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

const episodeScope = ref('episode') // 'episode' (default) | 'all'

const episodeScopedModels = computed(() => {
  if (episodeScope.value === 'all') return vaultModels.value
  const currentEpId = (route.params.episodeId || '').toLowerCase()
  if (!currentEpId) return vaultModels.value

  return vaultModels.value.filter(m => {
    if (/protagonist/i.test(m.category || '')) return true
    const searchToken = (m.token || `@{${m.name}}`).toLowerCase()
    const searchName = (m.flowName || m.name || '').replace(/^(Boss|Character|Commander|Lord):\s*/i, '').trim().toLowerCase()
    const searchUuid = (m.flowUuid || '').toLowerCase()
    const inPrompts = parsedPrompts.value.some(p => {
      const promptLower = `${p.prompt || ''} ${(p.characterTokens || []).join(' ')}`.toLowerCase()
      return (searchUuid && searchUuid.length >= 8 && promptLower.includes(searchUuid)) ||
             promptLower.includes(searchToken) ||
             (searchName && promptLower.includes(searchName))
    })
    if (inPrompts) return true
    if (Array.isArray(m.episodes) && m.episodes.length > 0) {
      return m.episodes.some(ep => {
        const epLower = ep.toLowerCase()
        return epLower.includes(currentEpId) || currentEpId.includes(epLower)
      })
    }
    return false
  })
})

const vaultCategories = computed(() => {
  const models = episodeScopedModels.value
  const total = models.length
  const chars = models.filter(m => m.type === 'character' || ['protagonist', 'antagonist', 'supporting'].includes(m.category?.toLowerCase())).length
  const weapons = models.filter(m => m.category === 'Weapons').length
  const artifacts = models.filter(m => m.category === 'Artifacts').length
  const props = models.filter(m => m.category === 'Props').length

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
  const models = episodeScopedModels.value
  if (selectedVaultCategory.value === 'all') return models
  if (selectedVaultCategory.value === 'characters') {
    return models.filter(m => m.type === 'character' || ['protagonist', 'antagonist', 'supporting'].includes(m.category?.toLowerCase()))
  }
  if (selectedVaultCategory.value === 'items') {
    return models.filter(m => m.type !== 'character' || ['weapons', 'artifacts', 'props'].includes(m.category?.toLowerCase()))
  }
  return models.filter(m => 
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
  const textToCopy = model.fullDna || model.dnaAnchor || model.description || `${model.name}, modern 2025 urban cultivation manhwa webtoon art style, sharp ink linework, bright high-key lighting, vibrant clean cel shading`
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
      showToast(`Batch ${getBatchCode(index)} compilation dispatched! Monitor progress in Video Studio.`)
    } else {
      showToast(data.error || `Failed to compile Batch ${getBatchCode(index)} preview`)
    }
  } catch (e) {
    showToast(`Error dispatching compilation: ${e.message}`)
  } finally {
    setTimeout(() => {
      batchCompilingIndex.value = null
    }, 2000)
  }
}

// Multi-Selection & Filtering State
const selectedTags = ref(new Set())
const filterMode = ref('all') // 'all', 'missing', 'ready', 'fresh'
const selectedBatchFilter = ref(null)

// Lightbox & Preview State
const activeLightboxScene = ref(null)

const openLightbox = (scene) => {
  activeLightboxScene.value = scene
}

const closeLightbox = () => {
  activeLightboxScene.value = null
}

const prevLightboxScene = () => {
  if (!activeLightboxScene.value) return
  const scenesWithImages = filteredPrompts.value.filter(p => p.hasImage)
  const idx = scenesWithImages.findIndex(p => p.tag === activeLightboxScene.value.tag)
  if (idx > 0) {
    activeLightboxScene.value = scenesWithImages[idx - 1]
  } else if (scenesWithImages.length > 0) {
    activeLightboxScene.value = scenesWithImages[scenesWithImages.length - 1]
  }
}

const nextLightboxScene = () => {
  if (!activeLightboxScene.value) return
  const scenesWithImages = filteredPrompts.value.filter(p => p.hasImage)
  const idx = scenesWithImages.findIndex(p => p.tag === activeLightboxScene.value.tag)
  if (idx !== -1 && idx < scenesWithImages.length - 1) {
    activeLightboxScene.value = scenesWithImages[idx + 1]
  } else if (scenesWithImages.length > 0) {
    activeLightboxScene.value = scenesWithImages[0]
  }
}

const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  try {
    const d = new Date(isoString)
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  } catch (_) {
    return ''
  }
}

const handleKeydown = (e) => {
  if (!activeLightboxScene.value) return
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevLightboxScene()
  if (e.key === 'ArrowRight') nextLightboxScene()
}

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
const microChunkSize = ref(24) // Default 24 scenes (Full Batch)
const copiedChunksState = ref({}) // key: `${bIdx}_${cIdx}` -> boolean
const activeCopiedKey = ref(null) // e.g. `${bIdx}_${cIdx}`, `FULL_${bIdx}`, 'MISSING', 'SELECTED', 'ALL'
const copiedToastMessage = ref('')
let toastTimer = null

// Drawer Accordion States
const isMissingScenesAccordionOpen = ref(false)
const isMasterInstructionsAccordionOpen = ref(false)
const expandedBatchIndices = ref(new Set([0])) // First batch open by default

const toggleBatchAccordion = (bIdx) => {
  const next = new Set(expandedBatchIndices.value)
  if (next.has(bIdx)) {
    next.delete(bIdx)
  } else {
    next.add(bIdx)
  }
  expandedBatchIndices.value = next
}

const showToast = (msg) => {
  copiedToastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    copiedToastMessage.value = ''
  }, 4500)
}

// Filtered Prompts
const filteredPrompts = computed(() => {
  let list = parsedPrompts.value
  if (selectedBatchFilter.value !== null && dynamicBatches.value[selectedBatchFilter.value]) {
    list = dynamicBatches.value[selectedBatchFilter.value].items
  }
  if (filterMode.value === 'missing') {
    return list.filter(p => !p.hasImage)
  }
  if (filterMode.value === 'ready') {
    return list.filter(p => p.hasImage)
  }
  if (filterMode.value === 'fresh') {
    return list.filter(p => p.hasImage && p.freshness === 'fresh')
  }
  return list
})

const missingCount = computed(() => parsedPrompts.value.filter(p => !p.hasImage).length)
const readyCount = computed(() => parsedPrompts.value.filter(p => p.hasImage).length)
const freshCount = computed(() => parsedPrompts.value.filter(p => p.hasImage && p.freshness === 'fresh').length)

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
  
  // If cleanName is a UUID, reverse-resolve via parsedEntities
  let entityKey = null
  if (parsedEntities.value) {
    for (const [k, u] of Object.entries(parsedEntities.value)) {
      if (u === cleanName) {
        entityKey = k
        break
      }
    }
  }

  // Find match in vaultModels
  const match = vaultModels.value.find(m => {
    if (m.token === tokenStr) return true
    if (m.flowName && m.flowName.toLowerCase() === cleanName.toLowerCase()) return true
    if (m.name && m.name.toLowerCase() === cleanName.toLowerCase()) return true
    if (m.dnaAnchor && m.dnaAnchor.includes(cleanName)) return true
    const cleanWithoutPrefix = cleanName.replace(/^(Weapon|Item|Prop|Artifact):\s*/i, '').trim()
    if (m.name && m.name.toLowerCase().includes(cleanWithoutPrefix.toLowerCase())) return true
    if (entityKey) {
      if (m.token === `@{${entityKey}}`) return true
      if (m.name && m.name.toLowerCase() === entityKey.toLowerCase()) return true
      const keyWithoutPrefix = entityKey.replace(/^(Weapon|Item|Prop|Artifact):\s*/i, '').trim().toLowerCase()
      if (m.name && m.name.toLowerCase().includes(keyWithoutPrefix)) return true
    }
    return false
  })

  if (match) {
    return match
  }

  // Fallback object if not in vault
  const displayName = entityKey || cleanName
  const isWeapon = /^weapon:/i.test(displayName) || /bow|sword|staff|blade|dagger/i.test(displayName)
  const isArtifact = /^item:/i.test(displayName) || /orb|ring|relic|crystal/i.test(displayName)
  const isProp = /^prop:/i.test(displayName) || /console|table|banner/i.test(displayName)
  const cat = isWeapon ? 'Weapons' : (isArtifact ? 'Artifacts' : (isProp ? 'Props' : 'Characters'))

  return {
    id: cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: displayName,
    flowName: displayName,
    token: tokenStr.startsWith('@') ? tokenStr : `@{${displayName}}`,
    category: cat,
    role: cat,
    type: isWeapon ? 'weapon' : (isArtifact ? 'artifact' : (isProp ? 'prop' : 'character')),
    tier: 'Custom Ref',
    hasPlate: false,
    url: null,
    description: displayName
  }
}

const getBatchVaultReferences = (items) => {
  if (!items || !items.length) return { models: [], count: 0, isOverLimit: false, tokens: [] }
  const uniqueTokens = new Set()
  for (const item of items) {
    const text = (item.prompt || '') + ' ' + (item.characterAnchor || '')
    const tokens = extractTokensFromText(text)
    tokens.forEach(t => uniqueTokens.add(t))
    if (item.character_ref) {
      String(item.character_ref).split(',').map(s => s.trim()).filter(Boolean).forEach(r => uniqueTokens.add(r))
    }
    if (item.character_refs) {
      String(item.character_refs).split(',').map(s => s.trim()).filter(Boolean).forEach(r => uniqueTokens.add(r))
    }
    if (item.item_ref) {
      String(item.item_ref).split(',').map(s => s.trim()).filter(Boolean).forEach(r => uniqueTokens.add(r))
    }
    if (item.item_refs) {
      String(item.item_refs).split(',').map(s => s.trim()).filter(Boolean).forEach(r => uniqueTokens.add(r))
    }
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
  if (scene.character_ref) {
    String(scene.character_ref).split(',').map(s => s.trim()).filter(Boolean).forEach(r => tokens.push(r))
  }
  if (scene.character_refs) {
    String(scene.character_refs).split(',').map(s => s.trim()).filter(Boolean).forEach(r => tokens.push(r))
  }
  if (scene.item_ref) {
    String(scene.item_ref).split(',').map(s => s.trim()).filter(Boolean).forEach(r => tokens.push(r))
  }
  if (scene.item_refs) {
    String(scene.item_refs).split(',').map(s => s.trim()).filter(Boolean).forEach(r => tokens.push(r))
  }
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

// =========================================================================
// Smart Context-Aware Flow Instruction Engine (Episode & Batch Intelligence)
// =========================================================================

const formatEntityWithId = (nameStr) => {
  if (!nameStr) return ''
  const clean = nameStr.replace(/^@\{?/, '').replace(/\}?$/, '').trim()
  const map = parsedEntities.value || {}
  let uuid = map[clean]
  if (!uuid) {
    for (const [k, v] of Object.entries(map)) {
      if (k.toLowerCase() === clean.toLowerCase() || k.replace(/^(Boss|Character|Commander|Lord):\s*/i, '').trim().toLowerCase() === clean.toLowerCase()) {
        uuid = v
        break
      }
    }
  }
  if (!uuid && Array.isArray(vaultModels.value)) {
    const m = vaultModels.value.find(vm => (vm.flowName || vm.name || '').toLowerCase().includes(clean.toLowerCase()))
    if (m && m.flowUuid && !/^00000000-temp/i.test(m.flowUuid)) {
      uuid = m.flowUuid
    }
  }
  if (uuid && promptTagMode.value === 'uuid') {
    return `${clean} (@${uuid})`
  }
  return `@{${clean}}`
}

const analyzeFlowContext = (itemsList = null) => {
  const items = Array.isArray(itemsList) && itemsList.length > 0 ? itemsList : (parsedPrompts.value || [])
  const models = Array.isArray(vaultModels.value) && vaultModels.value.length > 0 ? vaultModels.value : (episodeScopedModels.value || [])

  const nonHumanRegex = /\b(boss|automaton|puppet|golem|construct|chimera|wyrm|minotaur|seraph|archon|behemoth|beast|titan|monster|vanguard-0|mechanical|sentinel|overseer)\b/i
  const allEpisodeItems = parsedPrompts.value || items

  // 1. Identify Protagonist (exclude Boss:, Location:, Prop:, Item:, and non-human constructs; rank by protagonist metadata then scene frequency)
  const humanCharModels = models.filter(m => {
    const label = (m.flowName || m.name || '').trim()
    if (/^(Boss|Location|Prop|Item|Artifact|Monster|Construct|Environment):/i.test(label)) return false
    if (nonHumanRegex.test(label)) return false
    return true
  })

  let protagonistModel = humanCharModels.find(m => /protagonist|\bmc\b|main\s+character/i.test(`${m.category || ''} ${m.role || ''}`))
  if (!protagonistModel && humanCharModels.length > 0) {
    let bestScore = -1
    for (const m of humanCharModels) {
      const rawLabel = (m.flowName || m.name || '').replace(/^(Character|Commander|Lord):\s*/i, '').trim().toLowerCase()
      const uuidLower = (m.flowUuid || '').toLowerCase()
      let count = 0
      for (const it of allEpisodeItems) {
        const hay = `${it?.prompt || ''} ${it?.characterAnchor || ''} ${it?.character_ref || ''} ${it?.character_refs || ''} ${(it?.characterTokens || []).join(' ')}`.toLowerCase()
        if ((rawLabel && hay.includes(rawLabel)) || (uuidLower && uuidLower.length >= 8 && hay.includes(uuidLower))) {
          count++
        }
      }
      if (count > bestScore) {
        bestScore = count
        protagonistModel = m
      }
    }
  }
  const protagonistRawName = protagonistModel
    ? (protagonistModel.flowName || protagonistModel.name)
    : (Object.keys(parsedEntities.value || {}).find(k => !/^(Boss|Location|Prop|Item|Artifact|Monster|Construct):/i.test(k) && !nonHumanRegex.test(k)) || 'Main Protagonist')
  const protagonistLabel = formatEntityWithId(protagonistRawName)

  // 2. Identify Bosses, Monsters, Constructs & Automatons appearing in the target items scope
  const bossOrConstructSet = new Set()
  const combinedItemsText = items.map(it => `${it?.prompt || ''} ${it?.characterAnchor || ''} ${it?.character_ref || ''} ${it?.character_refs || ''}`).join(' ').toLowerCase()

  models.forEach(m => {
    const label = m.flowName || m.name || ''
    const combined = `${label} ${m.category || ''} ${m.role || ''} ${m.description || ''}`
    if ((/^Boss:/i.test(label) || nonHumanRegex.test(combined)) && label.toLowerCase() !== protagonistRawName.toLowerCase()) {
      const strippedLabel = label.replace(/^(Boss|Character|Commander|Lord):\s*/i, '').trim().toLowerCase()
      const uuidLower = (m.flowUuid || '').toLowerCase()
      const appearsInScope = items.length === 0 ||
        (strippedLabel && combinedItemsText.includes(strippedLabel)) ||
        (uuidLower && uuidLower.length >= 8 && combinedItemsText.includes(uuidLower))
      if (appearsInScope) {
        bossOrConstructSet.add(formatEntityWithId(label))
      }
    }
  })

  // Also scan scene tokens & prompts for boss/construct entities
  const morphRiskSceneTags = []
  const diegeticSceneTags = []
  const diegeticTypeSet = new Set()
  let combatCount = 0
  let nonCombatCount = 0
  let tierACount = 0
  let tierBCount = 0
  let tierCCount = 0

  // Positive diegetic environmental text detectors (ignoring negative tail mentions)
  const systemUiRegex = /\b(system\s+(?:panel|window|screen|hud|interface|notification|alert|message|status)|holographic\s+(?:screen|panel|window|hud|display|interface|console)|status\s+(?:window|screen|panel|board)|floating\s+(?:hud|status|system|interface|window|panel)|diagnostic\s+(?:screen|window|panel|hud)|radar\s+console|ui\s+(?:panel|window|screen))\b/i
  const scrollBookRegex = /\b(cultivation\s+scroll|ancient\s+scroll|unrolled\s+scroll|parchment\s+scroll|open\s+book|ancient\s+tome|grimoire|jade\s+slip|talisman\s+paper|written\s+ledger|blueprint)\b/i
  const steleInscriptionRegex = /\b(stone\s+stele|stele\s+inscription|carved\s+tablet|monolith\s+inscription|engraved\s+pillar|runic\s+stele|leaderboard\s+stele|sect\s+monolith)\b/i
  const signageRegex = /\b(shop\s+sign|storefront\s+sign|signboard|wooden\s+sign|sect\s+plaque|gate\s+plaque|tavern\s+sign|apothecar(?:y|ies)\s+sign|neon\s+sign|store\s+banner)\b/i
  const combatRegex = /\b(strike|strikes|punch|punches|slash|slashes|cleave|cleaves|explosion|impact|shockwave|parry|clash|combat|battle|attack|attacks|siphon|pierce|shatter|decapitat|blood\s+spray)\b/i
  const morphFeatureRegex = /\b(wings|twelve\s+wings|feathered\s+wings|mechanical\s+hand|puppet\s+hand|brass\s+joint|porcelain\s+limb|claws|tentacles|automaton\s+arm)\b/i

  items.forEach((item, idx) => {
    const rawTag = (item?.tag || `IMG_${String(idx + 1).padStart(3, '0')}`).replace(/[[\]]/g, '').toUpperCase()
    const cleanBody = item?.prompt || ''

    if (/three-panel|four-panel|multi-panel/i.test(cleanBody)) tierCCount++
    else if (/dual-panel|two-panel|split\s+strip/i.test(cleanBody)) tierBCount++
    else tierACount++

    if (combatRegex.test(cleanBody)) combatCount++
    else nonCombatCount++

    if (morphFeatureRegex.test(cleanBody) || nonHumanRegex.test(cleanBody)) {
      morphRiskSceneTags.push(rawTag)
      const tokens = item?.characterTokens || extractTokensFromText(cleanBody)
      tokens.forEach(t => {
        const cleanT = t.replace(/[@{}]/g, '').trim()
        if (cleanT && cleanT.toLowerCase() !== protagonistRawName.toLowerCase() && nonHumanRegex.test(cleanT)) {
          bossOrConstructSet.add(formatEntityWithId(cleanT))
        }
      })
    }

    // Check environmental text in core scene description (before negative boilerplate)
    const strippedForTextCheck = cleanBody.replace(/\b(?:no|zero|without)\s+(?:ui|text|scroll|sign|hud|labels|captions|subtitles)[^.,;]*/gi, '')
    let hasDiegetic = false
    if (systemUiRegex.test(strippedForTextCheck)) {
      hasDiegetic = true
      diegeticTypeSet.add('glowing holographic System/UI status panels')
    }
    if (scrollBookRegex.test(strippedForTextCheck)) {
      hasDiegetic = true
      diegeticTypeSet.add('ancient cultivation scrolls/books/talismans')
    }
    if (steleInscriptionRegex.test(strippedForTextCheck)) {
      hasDiegetic = true
      diegeticTypeSet.add('stone stele/monolith inscriptions')
    }
    if (signageRegex.test(strippedForTextCheck)) {
      hasDiegetic = true
      diegeticTypeSet.add('in-world shop/sect signage')
    }
    if (hasDiegetic) {
      diegeticSceneTags.push(rawTag)
    }
  })

  return {
    totalScenes: items.length,
    protagonistRawName,
    protagonistLabel,
    bossOrConstructList: Array.from(bossOrConstructSet),
    morphRiskSceneTags,
    diegeticSceneTags,
    diegeticTypes: Array.from(diegeticTypeSet),
    combatCount,
    nonCombatCount,
    tierACount,
    tierBCount,
    tierCCount,
    detectedEntityTags: models.length > 0
      ? models.map(m => formatEntityWithId(m.flowName || m.name)).filter(Boolean).slice(0, 6)
      : []
  }
}

const getFlowMasterInstructions = (format = '16:9', itemsScope = null) => {
  const is16x9 = format === '16:9'
  const intel = analyzeFlowContext(itemsScope)
  const bossClause = intel.bossOrConstructList.length > 0
    ? `Specifically in this episode, keep ${intel.protagonistLabel}'s human anatomy 100% separate and distinct from ${intel.bossOrConstructList.join(', ')} (never transfer wings, claws, mechanical puppet hands, or boss weapons onto ${intel.protagonistLabel}).`
    : `Keep each entity's anatomy, weapons, and features 100% distinct.`

  const diegeticSummary = intel.diegeticSceneTags.length > 0
    ? `ACTIVE EPISODE TEXT WHITELIST: Environmental text (${intel.diegeticTypes.join(', ')}) is present in ${intel.diegeticSceneTags.length} scene(s) [${intel.diegeticSceneTags.slice(0, 18).join(', ')}${intel.diegeticSceneTags.length > 18 ? '...' : ''}]. All other ${Math.max(0, intel.totalScenes - intel.diegeticSceneTags.length)} scenes in this episode MUST be 100% pure textless artwork.`
    : `ACTIVE EPISODE TEXT LOCK: Zero environmental text objects were detected across all ${intel.totalScenes} scenes — enforce 100% pure textless illustration across the entire episode.`

  const compositionRule = is16x9
    ? `- STANDALONE 16:9 SCENE: Generate exactly ONE standalone 16:9 horizontal widescreen landscape image (1920x1080 full bleed) per <scene> node. Zero comic strips or multi-panel grids.`
    : `- 3-TIER 9:16 WEBTOON COMPOSITION: Generate exactly ONE standalone vertical 9:16 (1080x1920) comic plate per <scene> node, following the specified layout tier (Episode Breakdown: ${intel.tierACount} Tier A Hero Plates, ${intel.tierBCount} Tier B Dual-Panel Split Strips, ${intel.tierCCount} Tier C Multi-Panel Strips).`

  const aspectLabel = is16x9
    ? 'horizontal 16:9 widescreen aspect ratio (1920x1080)'
    : 'vertical 9:16 webtoon aspect ratio (1080x1920)'
  const artStyleAspect = is16x9 ? 'horizontal 16:9' : 'vertical 9:16'
  const entityListStr = intel.detectedEntityTags && intel.detectedEntityTags.length > 0
    ? intel.detectedEntityTags.join(', ')
    : '@{Michael Montrey}, @{Apex Archmage Michael}, @{Patriarch Valerius Montrey}, @{Carved Blackwood Staff}'

  return `STRICT OPERATIONAL DIRECTIVES (${is16x9 ? '16:9 FULL-BLEED LANDSCAPE' : '9:16 AUTHENTIC WEBTOON STRIP'})

1. MANDATORY FILE NAMING:
- ALWAYS automatically rename every generation to match the exact string provided in the filename="..." attribute of the user's XML <scene> node (e.g., IMG_001.jpg, IMG_002.jpg).
- This action must be performed immediately following generation without requiring a separate "sync" command or further user input.

2. TEXT CONTROL (STRICT NARRATIVE SILENCE):
- FORBIDDEN (NARRATIVE & COMIC OVERLAYS): Strictly zero speech bubbles, dialogue balloons, thought bubbles, narrator caption boxes, subtitles, comic sound effects (SFX/onomatopoeia), Hangul (한글), or digital watermarks/numbers.
- ALLOWED (ENVIRONMENTAL / DIEGETIC): Text is permitted ONLY when it is a logical, physical in-world part of the scene (e.g., glowing holographic system/UI status panels, text on an ancient cultivation scroll or book, stone stele inscriptions, or shop signage).
- STYLE: All environmental text must be integrated naturally into the hand-drawn manhwa aesthetic. Never render prompt meta-labels (such as "Top block", "Middle", "Bottom", or "Environment") as visible text.
- ${diegeticSummary}

3. COMPOSITION, LOGIC & ANTI-MORPHING:
- ANATOMY & SCENE TYPE (CHARACTER VS UNPOPULATED ENVIRONMENT): For scenes featuring characters, flawless human anatomy required: exactly two arms, two legs, and five slender fingers per hand. Zero extra limbs, zero floating hands, or severed appendages. Every hand holding a weapon or prop must connect naturally to the wrist, forearm, and shoulder. For unpopulated environment/landscape scenes: strictly ZERO humans, zero people, zero figures in the sky, and zero floating bystanders.
- SINGLE PROTAGONIST: Strictly one instance of the protagonist (${intel.protagonistLabel}) per scene. No duplicate clones.
- CONTEXT-AWARE CROWD & EXTRAS STAGING: Natural background students, pedestrians, onlookers, and ambient extras in soft depth-of-field blur are explicitly permitted ONLY in public and communal environments (university campus paths, lecture halls, city boulevards, public auditoriums). In private interior scenes (e.g. private dorm rooms, secluded meditation chambers, high-security command rooms), maintain strict isolation with zero extraneous strangers. In all cases: strictly zero foreground strangers stealing primary focus, zero clone audience copies, and zero floating bystanders.
- ANTI-MORPHING SUBJECT ISOLATION: Never merge, fuse, or transfer monster, boss, or mechanical automaton features (such as wings, claws, mechanical puppet hands, or boss weapons) onto the human protagonist. ${bossClause}
- LITERAL ACTION FIDELITY: Depict ONLY the exact posture and action described in the <scene> prompt (${intel.nonCombatCount} non-combat/dialogue scenes vs ${intel.combatCount} combat scenes in this deck). If characters are sitting, talking, resting, or observing, NEVER hallucinate combat strikes, punches, kicks, or assassin attacks.
${compositionRule}
- ISOLATION: Isolate each batch within its dedicated collection as specified in the system directive.

4. ART STYLE INVARIANT:
- Modern 2025 urban cultivation manhwa webtoon art style: sharp black ink linework, bright high-key lighting, vibrant clean cel shading, ${artStyleAspect}. Clean contemporary architecture, modern cityscapes, and high-clarity lighting, ${aspectLabel}.
- STRICTLY FORBIDDEN STYLE DRIFT: Never generate gloomy dark medieval fantasy, castles, photorealistic 3D CGI renders, live-action photography, oil paintings, or flat Western comic book cartoons. Pass this exact 2D manhwa art style invariant into every image generation tool call.

5. CHARACTER ENTITY REFERENCE MAPPING RULE:
- Always map @{Character Name} tags to their corresponding character entity references in this project (e.g. ${entityListStr}).
- Resolve each @{Name} tag to its corresponding visual identity, facial features, hair, and signature attire locked in the project entity bible before generating. Never invent random appearances for tagged characters.`
}

const getFlowDirectiveHeader = (collectionTitle, format = '16:9', batchItems = null) => {
  const is16x9 = format === '16:9'
  const intel = analyzeFlowContext(batchItems)
  const aspectShort = is16x9 ? '16:9 horizontal (1920x1080)' : '9:16 vertical manhwa (1080x1920)'
  const entityListStr = intel.detectedEntityTags && intel.detectedEntityTags.length > 0
    ? intel.detectedEntityTags.join(', ')
    : '@{Michael Montrey}, @{Apex Archmage Michael}, @{Patriarch Valerius Montrey}, @{Carved Blackwood Staff}'

  const batchTextRule = intel.diegeticSceneTags.length > 0
    ? `Strictly ZERO speech bubbles, dialogue balloons, thought bubbles, SFX, Hangul (한글), or comic caption boxes. In-world environmental text (${intel.diegeticTypes.join(', ')}) is permitted ONLY in [${intel.diegeticSceneTags.join(', ')}]; all other scenes in "${collectionTitle}" MUST be 100% pure textless artwork.`
    : `Zero environmental text objects exist in this batch — enforce 100% PURE TEXTLESS ILLUSTRATION across all ${intel.totalScenes} scenes in "${collectionTitle}" (zero speech bubbles, zero dialogue, zero SFX, zero Hangul, zero caption boxes, zero letters/numbers).`

  const batchAntiMorphRule = intel.bossOrConstructList.length > 0
    ? `Keep ${intel.protagonistLabel}'s human anatomy 100% separate from ${intel.bossOrConstructList.join(', ')} (never fuse boss wings, claws, or mechanical puppet hands onto ${intel.protagonistLabel}).`
    : `Strictly one instance of ${intel.protagonistLabel} per scene; never clone the protagonist or merge features across characters.`

  return `[SYSTEM DIRECTIVE: TARGET COLLECTION "${collectionTitle}" | CREATE IF NOT PRESENT | DO NOT ASSIGN TO PRIOR BATCHES]

STRICT OPERATIONAL DIRECTIVES FOR COLLECTION "${collectionTitle}":
1. MANDATORY COLLECTION ISOLATION: Create and isolate 100% of generated scenes in this batch inside "${collectionTitle}". Never mix with prior batches.
2. MANDATORY IMMEDIATE FILE NAMING: Automatically rename every generated asset to match the exact filename="..." attribute of its <scene> node (e.g. IMG_001.jpg) immediately after generation without waiting for a "sync" command.
3. SMART TEXT CONTROL (SCENE-LOCKED):
   - ${batchTextRule}
   - Never render structural prompt words ("Top block", "Middle", "Bottom", "Environment") as visible caption boxes.
4. ANATOMY & ANTI-MORPHING ISOLATION:
   - Flawless human anatomy for character scenes: exactly two arms, two legs, and five slender fingers per hand connected naturally to wrists and shoulders. For unpopulated environment scenes, enforce zero humans, zero people, zero figures in the sky, and zero floating bystanders.
   - ${batchAntiMorphRule}
5. CONTEXT-AWARE CROWD & EXTRAS STAGING:
   - Natural background students, pedestrians, and onlookers in soft depth-of-field blur are permitted in public campus/city settings as context requires. Never introduce foreground strangers stealing focus or clone duplicates. Private dorm rooms and confidential chambers remain strictly isolated.
6. LITERAL ACTION FIDELITY (${intel.nonCombatCount} Calm/Dialogue vs ${intel.combatCount} Combat Scenes):
   - Depict ONLY the exact posture and action written in each <scene>. Never invent punches, kicks, or assassin attacks during dialogue, sitting, or observation scenes.
7. ART STYLE INVARIANT:
   - Modern 2025 urban cultivation manhwa webtoon art style: sharp black ink linework, bright high-key lighting, vibrant clean cel shading, cinematic contemporary lighting, ${aspectShort}. Clean modern architecture and cityscapes. Never generate gloomy dark medieval fantasy, photorealistic 3D CGI renders, or flat Western cartoons.
8. CHARACTER ENTITY REFERENCE MAPPING:
   - Always map @{Character Name} tags to their corresponding character entity references in this project (e.g. ${entityListStr}).`
}

// Helper to generate dynamic zero-padded batch codes (01, 02, ... 13)
const getBatchCode = (index) => {
  return String(index + 1).padStart(2, '0')
}

const BATCH_SIZE = 24

const getSceneBatchName = (item, idx) => {
  if (item && item.tag) {
    const num = parseInt(item.tag.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(num) && num > 0) {
      const bIdx = Math.floor((num - 1) / BATCH_SIZE)
      return `Batch ${getBatchCode(bIdx)}`
    }
  }
  const bIdx = Math.floor(idx / BATCH_SIZE)
  return `Batch ${getBatchCode(bIdx)}`
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
    const batchCode = getBatchCode(i)
    const batchName = `Batch ${batchCode}`
    const collectionTitle = getCollectionName(batchName, i)

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

    const readyItems = items.filter(p => p.hasImage)
    const missingItems = items.filter(p => !p.hasImage)
    const freshItems = items.filter(p => p.hasImage && p.freshness === 'fresh')
    const staleItems = items.filter(p => p.hasImage && p.freshness === 'stale')
    const readyCount = readyItems.length
    const missingCount = missingItems.length
    const freshCount = freshItems.length
    const staleCount = staleItems.length
    const healthPercent = items.length > 0 ? Math.round((readyCount / items.length) * 100) : 0

    batches.push({
      name: batchName,
      letter: batchCode,
      batchCode,
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
      nextChunkLabel,
      readyCount,
      missingCount,
      freshCount,
      staleCount,
      healthPercent,
      isBatchComplete: items.length > 0 && readyCount === items.length
    })
  }

  return batches
})

const completedBatchesCount = computed(() => {
  return dynamicBatches.value.filter(b => b.isFullyCopied).length
})

const verifiedBatchesCount = computed(() => {
  return dynamicBatches.value.filter(b => b.isBatchComplete).length
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
const previewDirectiveBatchIdx = ref(-1) // -1 = All Episode, >=0 = specific batch index
const copiedDirective = ref(false)
const copiedMasterInstructions = ref(false)

const activePreviewItems = computed(() => {
  if (directiveTierTab.value === 'batch' && previewDirectiveBatchIdx.value >= 0 && dynamicBatches.value[previewDirectiveBatchIdx.value]) {
    return dynamicBatches.value[previewDirectiveBatchIdx.value].items
  }
  return parsedPrompts.value
})

const activeFlowIntelligence = computed(() => {
  return analyzeFlowContext(activePreviewItems.value)
})

const currentDirectiveText = computed(() => {
  if (directiveTierTab.value === 'master') {
    return getFlowMasterInstructions(activeDirectiveFormat.value, parsedPrompts.value)
  }
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const bIdx = previewDirectiveBatchIdx.value
  const targetBatch = bIdx >= 0 && dynamicBatches.value[bIdx] ? dynamicBatches.value[bIdx] : null
  const colName = targetBatch ? targetBatch.collectionTitle : getCollectionName('Batch 01', 0)
  const itemsScope = targetBatch ? targetBatch.items : parsedPrompts.value
  return getFlowDirectiveHeader(colName, is16x9 ? '16:9' : '9:16', itemsScope)
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
  const text = getFlowMasterInstructions(activeDirectiveFormat.value, parsedPrompts.value)
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

// Helper to convert letter (e.g. 'A', 'C', 'AA') to 1-indexed number
const batchLetterToNumber = (letter) => {
  if (!letter) return 1
  let num = 0
  for (let i = 0; i < letter.length; i++) {
    num = num * 26 + (letter.charCodeAt(i) - 64)
  }
  return num
}

const getBatchNumFormatted = (batchName, fallbackIdx = null) => {
  if (typeof fallbackIdx === 'number' && !isNaN(fallbackIdx) && fallbackIdx >= 0) {
    return String(fallbackIdx + 1).padStart(2, '0')
  }
  const digitMatch = (batchName || '').match(/Batch\s+(\d+)/i)
  if (digitMatch) {
    return digitMatch[1].padStart(2, '0')
  }
  const letterMatch = (batchName || '').match(/Batch\s+([A-Za-z]+)/i)
  if (letterMatch) {
    const num = batchLetterToNumber(letterMatch[1].toUpperCase())
    return String(num).padStart(2, '0')
  }
  return '01'
}

const getCollectionName = (batchName, batchIndex = null) => {
  const eRaw = route.params.episodeId || 'EP01'
  const epNum = (eRaw.match(/EP?(\d+)/i)?.[1] || '01').padStart(2, '0')

  if (batchName === 'Missing') return `EP${epNum} Missing`
  if (batchName === 'Selected') return `EP${epNum} Selected`
  if (batchName === 'Master_Deck') return `EP${epNum} Master Deck`

  const bNum = getBatchNumFormatted(batchName, batchIndex)
  return `EP${epNum} Batch ${bNum}`
}

const sanitizeForClipboard = (text) => {
  if (!text) return ''
  return text
    .replace(/[\u2014\u2015]/g, ' - ') // Em-dash to ASCII hyphen with spacing
    .replace(/[\u2013]/g, '-')        // En-dash to ASCII hyphen
    .replace(/[\u2018\u2019]/g, "'")  // Smart single quotes to ASCII apostrophe
    .replace(/[\u201C\u201D]/g, '"')  // Smart double quotes to ASCII double quotes
    .replace(/[\u2022]/g, '-')        // Bullet points to ASCII hyphen
    .replace(/\uFFFD/g, '')           // Strip any stray replacement chars
}

const writeToClipboardSafe = async (text) => {
  return navigator.clipboard.writeText(sanitizeForClipboard(text))
}

const copyChunk = async (batch, bIdx, chunk, cIdx) => {
  if (isCopyDisabledDueToMissingUuids.value) {
    showToast(`⚠️ Copy Locked: Missing Google Flow UUIDs for: ${unmappedCharacterEntities.value.join(', ')}. Map character entities first!`)
    return
  }
  if (isCopyDisabledDueToAudit.value) {
    showToast(`⚠️ Copy Locked: Pre-Flight Prompt Matrix Audit has not passed (Score: ${promptAuditReport.value?.overallScore || 0}%). Resolve failing scenes first!`)
    return
  }

  if (!chunk || !chunk.items.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const collectionTitle = batch.collectionTitle || getCollectionName(batch.name)
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', chunk.items)

  const scenesXml = chunk.items.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return buildSceneXmlNode(tag, filename, p.prompt, parsedEntities.value, promptTagMode.value, {
      character_ref: p.character_ref,
      character_refs: p.character_refs,
      item_ref: p.item_ref,
      item_refs: p.item_refs
    })
  }).join('\n\n')

  const chunkXml = `<batch id="${batch.name.replace(/\s+/g, '_')}_Chunk_${chunk.chunkNumber}" series="${franchiseId}" episode="${episodeId}" batch="${batch.name}" chunk="${chunk.chunkNumber}" scenes="${chunk.startTag}-${chunk.endTag}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${flowDirective}\n\n${chunkXml}`

  try {
    await writeToClipboardSafe(payload)
    
    copiedChunksState.value = {
      ...copiedChunksState.value,
      [`${bIdx}_${cIdx}`]: true
    }

    const key = `${bIdx}_${cIdx}`
    activeCopiedKey.value = key
    showToast(`Copied ${batch.name} Chunk ${chunk.chunkNumber} (${chunk.startTag}–${chunk.endTag})! Target Collection: "${collectionTitle}"`)

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
  if (isCopyDisabledDueToMissingUuids.value) {
    showToast(`⚠️ Copy Locked: Missing Google Flow UUIDs for: ${unmappedCharacterEntities.value.join(', ')}. Map character entities first!`)
    return
  }
  if (isCopyDisabledDueToAudit.value) {
    showToast(`⚠️ Copy Locked: Pre-Flight Prompt Matrix Audit has not passed (Score: ${promptAuditReport.value?.overallScore || 0}%). Resolve failing scenes first!`)
    return
  }

  if (!batch || !batch.chunks.length) return
  const chunkToCopy = batch.nextUncopiedChunk || batch.chunks[0]
  await copyChunk(batch, bIdx, chunkToCopy, chunkToCopy.chunkIndex)
}



const copyBatchFullXml = async (batch, bIdx) => {
  if (isCopyDisabledDueToMissingUuids.value) {
    showToast(`⚠️ Copy Locked: Missing Google Flow UUIDs for: ${unmappedCharacterEntities.value.join(', ')}. Map character entities first!`)
    return
  }
  if (isCopyDisabledDueToAudit.value) {
    showToast(`⚠️ Copy Locked: Pre-Flight Prompt Matrix Audit has not passed (Score: ${promptAuditReport.value?.overallScore || 0}%). Resolve failing scenes first!`)
    return
  }

  if (!batch || !batch.items.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const collectionTitle = batch.collectionTitle || getCollectionName(batch.name)
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', batch.items)

  const scenesXml = batch.items.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return buildSceneXmlNode(tag, filename, p.prompt, parsedEntities.value, promptTagMode.value, {
      character_ref: p.character_ref,
      character_refs: p.character_refs,
      item_ref: p.item_ref,
      item_refs: p.item_refs
    })
  }).join('\n\n')

  const batchXml = `<batch id="${batch.name.replace(/\s+/g, '_')}" series="${franchiseId}" episode="${episodeId}" scenes="${batch.startTag}-${batch.endTag}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${flowDirective}\n\n${batchXml}`

  try {
    await writeToClipboardSafe(payload)

    const updated = { ...copiedChunksState.value }
    batch.chunks.forEach((_, cIdx) => {
      updated[`${bIdx}_${cIdx}`] = true
    })
    copiedChunksState.value = updated

    const key = `FULL_${bIdx}`
    activeCopiedKey.value = key
    showToast(`Copied Full ${batch.name} XML (${batch.items.length} scenes)! Target Collection: "${collectionTitle}"`)

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
  if (isCopyDisabledDueToMissingUuids.value) {
    showToast(`⚠️ Copy Locked: Missing Google Flow UUIDs for: ${unmappedCharacterEntities.value.join(', ')}. Map character entities first!`)
    return
  }
  if (isCopyDisabledDueToAudit.value) {
    showToast(`⚠️ Copy Locked: Pre-Flight Prompt Matrix Audit has not passed (Score: ${promptAuditReport.value?.overallScore || 0}%). Resolve failing scenes first!`)
    return
  }

  const selectedItems = parsedPrompts.value.filter(p => selectedTags.value.has(p.tag))
  if (!selectedItems.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'

  const collectionTitle = getCollectionName('Selected')
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', selectedItems)

  const scenesXml = selectedItems.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return buildSceneXmlNode(tag, filename, p.prompt, parsedEntities.value, promptTagMode.value, {
      character_ref: p.character_ref,
      character_refs: p.character_refs,
      item_ref: p.item_ref,
      item_refs: p.item_refs
    })
  }).join('\n\n')

  const batchXml = `<batch id="Selected_Scenes" series="${franchiseId}" episode="${episodeId}" scenes="Selected_${selectedItems.length}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${flowDirective}\n\n${batchXml}`

  try {
    await writeToClipboardSafe(payload)
    activeCopiedKey.value = 'SELECTED'
    showToast(`Copied Selected Prompts (${selectedItems.length} scenes)!`)
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
  if (isCopyDisabledDueToMissingUuids.value) {
    showToast(`⚠️ Copy Locked: Missing Google Flow UUIDs for: ${unmappedCharacterEntities.value.join(', ')}. Map character entities first!`)
    return
  }
  if (isCopyDisabledDueToAudit.value) {
    showToast(`⚠️ Copy Locked: Pre-Flight Prompt Matrix Audit has not passed (Score: ${promptAuditReport.value?.overallScore || 0}%). Resolve failing scenes first!`)
    return
  }

  const missingItems = parsedPrompts.value.filter(p => !p.hasImage)
  if (!missingItems.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'

  const collectionTitle = getCollectionName('Missing')
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', missingItems)

  const scenesXml = missingItems.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return buildSceneXmlNode(tag, filename, p.prompt, parsedEntities.value, promptTagMode.value, {
      character_ref: p.character_ref,
      character_refs: p.character_refs,
      item_ref: p.item_ref,
      item_refs: p.item_refs
    })
  }).join('\n\n')

  const batchXml = `<batch id="Missing_Scenes" series="${franchiseId}" episode="${episodeId}" scenes="Missing_${missingItems.length}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${flowDirective}\n\n${batchXml}`

  try {
    await writeToClipboardSafe(payload)
    activeCopiedKey.value = 'MISSING'
    showToast(`Copied Failed/Missing Scenes (${missingItems.length} scenes)!`)
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
  if (isCopyDisabledDueToMissingUuids.value) {
    showToast(`⚠️ Copy Locked: Missing Google Flow UUIDs for: ${unmappedCharacterEntities.value.join(', ')}. Map character entities first!`)
    return
  }
  if (isCopyDisabledDueToAudit.value) {
    showToast(`⚠️ Copy Locked: Pre-Flight Prompt Matrix Audit has not passed (Score: ${promptAuditReport.value?.overallScore || 0}%). Resolve failing scenes first!`)
    return
  }

  if (!parsedPrompts.value.length) return

  const franchiseId = route.params.franchiseId || 'Series'
  const episodeId = route.params.episodeId || 'EP01'
  const is16x9 = activeDirectiveFormat.value === '16:9'

  const collectionTitle = getCollectionName('Master_Deck')
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', parsedPrompts.value)

  const scenesXml = parsedPrompts.value.map(p => {
    const rawId = p.tag.replace(/[^A-Za-z0-9]/g, '')
    const num = rawId.replace(/IMG/i, '').padStart(3, '0')
    const tag = `IMG_${num}`
    const filename = `${tag}.jpg`
    return buildSceneXmlNode(tag, filename, p.prompt, parsedEntities.value, promptTagMode.value, {
      character_ref: p.character_ref,
      character_refs: p.character_refs,
      item_ref: p.item_ref,
      item_refs: p.item_refs
    })
  }).join('\n\n')

  const batchXml = `<batch id="Master_Deck" series="${franchiseId}" episode="${episodeId}" scenes="All_${parsedPrompts.value.length}" format="${is16x9 ? '16:9' : '9:16'}">\n\n${scenesXml}\n\n</batch>`
  const payload = `${flowDirective}\n\n${batchXml}`

  try {
    await writeToClipboardSafe(payload)

    const updated = {}
    dynamicBatches.value.forEach((b, bIdx) => {
      b.chunks.forEach((_, cIdx) => {
        updated[`${bIdx}_${cIdx}`] = true
      })
    })
    copiedChunksState.value = updated
    activeCopiedKey.value = 'ALL'
    showToast(`Copied Entire Episode (${parsedPrompts.value.length} scenes)! Target Collection: "${collectionTitle}"`)

    setTimeout(() => {
      if (activeCopiedKey.value === 'ALL') {
        activeCopiedKey.value = null
      }
    }, 2500)
  } catch (err) {
    console.error('Failed to copy master deck:', err)
  }
}


const uploadingPromptTags = ref(new Set())

const handlePromptPlateDrop = async (event, tag) => {
  const dt = event.dataTransfer
  if (!dt) return

  const items = dt.items ? Array.from(dt.items) : []
  let files = []
  if (items.length > 0 && items[0].webkitGetAsEntry) {
    const traverseEntry = async (entry) => {
      if (!entry) return
      if (entry.isFile) {
        await new Promise((resolve) => {
          entry.file((file) => {
            if (file) files.push(file)
            resolve()
          }, () => resolve())
        })
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader()
        const readEntriesBatch = () => {
          return new Promise((resolve) => {
            dirReader.readEntries(async (entries) => {
              if (!entries || entries.length === 0) {
                resolve(false)
              } else {
                for (const subEntry of entries) {
                  await traverseEntry(subEntry)
                }
                resolve(true)
              }
            }, () => resolve(false))
          })
        }
        let hasMore = true
        while (hasMore) {
          hasMore = await readEntriesBatch()
        }
      }
    }
    const entries = items.map(item => item.webkitGetAsEntry ? item.webkitGetAsEntry() : null).filter(Boolean)
    for (const entry of entries) {
      await traverseEntry(entry)
    }
  }

  if (files.length === 0 && dt.files && dt.files.length > 0) {
    files = Array.from(dt.files)
  }
  if (files.length === 0) return

  // 1. Check if a .zip archive was dropped
  const zipFile = files.find(f => f.name.toLowerCase().endsWith('.zip'))
  if (zipFile) {
    uploadingPromptTags.value = new Set(uploadingPromptTags.value).add(tag)
    try {
      const match = tag.match(/IMG_?0*(\d+)/i)
      const sceneNum = match ? parseInt(match[1], 10) : 1
      const batchIndex = Math.floor((sceneNum - 1) / 24)

      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(zipFile)
      })

      const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/upload-zip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipBase64: base64Data,
          filename: zipFile.name,
          batchIndex
        })
      })
      const data = await res.json()
      if (data.success) {
        await loadEpisode()
      }
    } catch (err) {
      console.error('Prompt drop ZIP upload failed:', err)
    } finally {
      const s = new Set(uploadingPromptTags.value)
      s.delete(tag)
      uploadingPromptTags.value = s
    }
    return
  }

  // 2. Individual image file
  const imageFile = files.find(f => /\.(png|jpe?g|webp)$/i.test(f.name))
  if (imageFile) {
    uploadingPromptTags.value = new Set(uploadingPromptTags.value).add(tag)
    try {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(imageFile)
      })

      const res = await fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag, base64Data })
      })
      const data = await res.json()
      if (data.success) {
        await loadEpisode()
      }
    } catch (err) {
      console.error('Prompt drop image upload failed:', err)
    } finally {
      const s = new Set(uploadingPromptTags.value)
      s.delete(tag)
      uploadingPromptTags.value = s
    }
  }
}

const loadEpisode = async () => {
  try {
    const [epRes, imgRes, auditRes] = await Promise.all([
      fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}`),
      fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/images`),
      fetch(`/api/episodes/${route.params.franchiseId}/${route.params.episodeId}/prompt-matrix-audit?cb=${Date.now()}`).catch(err => {
        console.warn('Failed to fetch prompt matrix audit:', err)
        return null
      })
    ])
    const data = await epRes.json()
    const imagesData = await imgRes.json()
    if (auditRes && auditRes.ok) {
      try {
        promptAuditReport.value = await auditRes.json()
      } catch (e) {
        console.warn('Failed to parse prompt audit report:', e)
      }
    }
    
    const imageMap = new Map()
    if (Array.isArray(imagesData)) {
      imagesData.forEach(img => {
        imageMap.set(img.tag.toUpperCase(), img)
      })
    }

    rawMarkdown.value = data.promptMatrix || ''
    
    // Strictly lock Aspect Ratio from Series Creation (never permit arbitrary flipping)
    const count9x16 = (rawMarkdown.value.match(/9:16|1080x1920/gi) || []).length
    const count16x9 = (rawMarkdown.value.match(/16:9|1920x1080/gi) || []).length
    const isPrompt16x9 = count16x9 > count9x16
    const isSeries16x9 = (data.format && data.format.includes('16:9')) || isPrompt16x9 || (route.params.franchiseId || '').toLowerCase().includes('series_02')
    activeDirectiveFormat.value = isSeries16x9 ? '16:9' : '9:16'
    
    parseMarkdownPrompts(rawMarkdown.value, imageMap)
  } catch (err) {
    console.error(err)
  }
}

const parseMarkdownPrompts = (markdown, imageMap = new Map()) => {
  const results = []

  // 1. Check for XML <scene id="IMG_001"> ... </scene> blocks
  const sceneRegex = /<scene\s+([^>]*?)>\s*([\s\S]*?)\s*<\/scene>/gi
  let sMatch
  while ((sMatch = sceneRegex.exec(markdown)) !== null) {
    const attrs = sMatch[1]
    const innerContent = sMatch[2].trim()

    const idMatch = attrs.match(/id=["']?(IMG_?\d+)["']?/i) || innerContent.match(/<tag>([^<]+)<\/tag>/i)
    if (!idMatch) continue
    const rawTag = idMatch[1].replace(/_/g, '').replace(/[[\]]/g, '')
    const tag = `[${rawTag.replace(/(\d+)/, '_$1')}]`

    const charRefMatch = attrs.match(/\bcharacter_ref=["']([^"']+)["']/i) || innerContent.match(/<character_ref>([^<]+)<\/character_ref>/i)
    const charRefsMatch = attrs.match(/\bcharacter_refs=["']([^"']+)["']/i) || innerContent.match(/<character_refs>([^<]+)<\/character_refs>/i)
    const itemRefMatch = attrs.match(/\bitem_ref=["']([^"']+)["']/i) || innerContent.match(/<item_ref>([^<]+)<\/item_ref>/i)
    const itemRefsMatch = attrs.match(/\bitem_refs=["']([^"']+)["']/i) || innerContent.match(/<item_refs>([^<]+)<\/item_refs>/i)
    const layoutMatch = innerContent.match(/<layout>([^<]+)<\/layout>/i)
    const narrativeMatch = innerContent.match(/<narrative_sync>([\s\S]*?)<\/narrative_sync>/i)

    let promptText = innerContent
    const promptTagMatch = innerContent.match(/<prompt>([\s\S]*?)<\/prompt>/i)
    if (promptTagMatch) {
      promptText = promptTagMatch[1].trim()
    }

    const anchors = [...promptText.matchAll(/@\{([^}]+)\}/g)].map(m => m[0]).join(', ')
    
    const cleanTag = tag.replace(/[[\]]/g, '').toUpperCase()
    const imgInfo = imageMap.get(cleanTag)

    results.push({
      tag,
      description: layoutMatch ? layoutMatch[1].trim() : `Scene Panel ${rawTag}`,
      narrativeSync: narrativeMatch ? narrativeMatch[1].trim() : null,
      characterAnchor: anchors,
      prompt: promptText,
      character_ref: charRefMatch ? charRefMatch[1].trim() : null,
      character_refs: charRefsMatch ? charRefsMatch[1].trim() : null,
      item_ref: itemRefMatch ? itemRefMatch[1].trim() : null,
      item_refs: itemRefsMatch ? itemRefsMatch[1].trim() : null,
      hasImage: imgInfo ? imgInfo.hasImage : false,
      imageUrl: imgInfo ? imgInfo.url : null,
      mtime: imgInfo ? imgInfo.mtime : null,
      mtimeMs: imgInfo ? imgInfo.mtimeMs : null,
      size: imgInfo ? imgInfo.size : null,
      promptMatrixMtime: imgInfo ? imgInfo.promptMatrixMtime : null,
      promptMatrixMtimeMs: imgInfo ? imgInfo.promptMatrixMtimeMs : null,
      freshness: imgInfo ? imgInfo.freshness : (imgInfo?.hasImage ? 'fresh' : 'missing'),
      characterTokens: imgInfo?.characterTokens || [...new Set([...promptText.matchAll(/@\{([^}]+)\}/g)].map(m => m[0]))]
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
        imageUrl: imgInfo ? imgInfo.url : null,
        mtime: imgInfo ? imgInfo.mtime : null,
        mtimeMs: imgInfo ? imgInfo.mtimeMs : null,
        size: imgInfo ? imgInfo.size : null,
        promptMatrixMtime: imgInfo ? imgInfo.promptMatrixMtime : null,
        promptMatrixMtimeMs: imgInfo ? imgInfo.promptMatrixMtimeMs : null,
        freshness: imgInfo ? imgInfo.freshness : (imgInfo?.hasImage ? 'fresh' : 'missing'),
        characterTokens: imgInfo?.characterTokens || [...new Set([...prompt.matchAll(/@\{([^}]+)\}/g)].map(m => m[0]))]
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
        imageUrl: imgInfo ? imgInfo.url : null,
        mtime: imgInfo ? imgInfo.mtime : null,
        mtimeMs: imgInfo ? imgInfo.mtimeMs : null,
        size: imgInfo ? imgInfo.size : null,
        promptMatrixMtime: imgInfo ? imgInfo.promptMatrixMtime : null,
        promptMatrixMtimeMs: imgInfo ? imgInfo.promptMatrixMtimeMs : null,
        freshness: imgInfo ? imgInfo.freshness : (imgInfo?.hasImage ? 'fresh' : 'missing'),
        characterTokens: imgInfo?.characterTokens || [...new Set([...pText.matchAll(/@\{([^}]+)\}/g)].map(m => m[0]))]
      })
    }
  }

  parsedPrompts.value = results
}

const copySinglePrompt = async (item, index) => {
  if (isCopyDisabledDueToMissingUuids.value) {
    showToast(`⚠️ Copy Locked: Missing Google Flow UUIDs for: ${unmappedCharacterEntities.value.join(', ')}. Map character entities first!`)
    return
  }
  if (isCopyDisabledDueToAudit.value) {
    showToast(`⚠️ Copy Locked: Pre-Flight Prompt Matrix Audit has not passed (Score: ${promptAuditReport.value?.overallScore || 0}%). Resolve failing scenes first!`)
    return
  }

  const rawId = typeof item === 'object' && item.tag 
    ? item.tag.replace(/[^A-Za-z0-9]/g, '')
    : `IMG${String(index + 1).padStart(3, '0')}`
  const num = rawId.replace(/IMG/i, '').padStart(3, '0')
  const tag = `IMG_${num}`
  const filename = `${tag}.jpg`
  const promptText = typeof item === 'object' && item.prompt ? item.prompt : item
  const sceneXml = buildSceneXmlNode(tag, filename, promptText, parsedEntities.value, promptTagMode.value, {
    character_ref: typeof item === 'object' ? item.character_ref : null,
    character_refs: typeof item === 'object' ? item.character_refs : null,
    item_ref: typeof item === 'object' ? item.item_ref : null,
    item_refs: typeof item === 'object' ? item.item_refs : null
  })
  
  const is16x9 = activeDirectiveFormat.value === '16:9'
  const sceneNum = parseInt(num, 10)
  const bIdx = !isNaN(sceneNum) && sceneNum > 0 ? Math.floor((sceneNum - 1) / BATCH_SIZE) : 0
  const bCode = getBatchCode(bIdx)
  const collectionTitle = getCollectionName(`Batch ${bCode}`, bIdx)
  const singleItemObj = typeof item === 'object' ? item : { tag, prompt: promptText }
  const flowDirective = getFlowDirectiveHeader(collectionTitle, is16x9 ? '16:9' : '9:16', [singleItemObj])
  const payload = `${flowDirective}\n\n${sceneXml}`
  
  try {
    await writeToClipboardSafe(payload)
    copiedIndex.value = index
    showToast(`Copied ${tag} XML! Target Collection: "${collectionTitle}"`)
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
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
