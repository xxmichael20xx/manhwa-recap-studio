import fs from 'fs';
import path from 'path';

const filePath = 'C:\\Users\\MIchaelangelo\\Documents\\My Brand\\02_Ventures & Digital Products\\Manhwa Recap Studio\\studio\\src\\views\\PromptMatrixView.vue';
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original content length:', content.length);

// 1. Update unmappedCharacterEntities computed property
const oldUnmappedRegex = /\/\/ Character Entity UUID Gate \(Anti-Unmapped Prompt Copying Invariant\)[\s\S]*?const isCopyDisabledDueToMissingUuids = computed\(\(\) => unmappedCharacterEntities\.value\.length > 0\)/;

const newUnmappedCode = `// Character Entity UUID Gate (Anti-Unmapped Prompt Copying Invariant)
const unmappedCharacterEntities = computed(() => {
  const charNames = new Set()
  
  if (Array.isArray(vaultModels.value)) {
    vaultModels.value.forEach(m => {
      const isChar = m.type === 'character' || ['protagonist', 'antagonist', 'supporting', 'vip', 'boss'].includes(m.category?.toLowerCase())
      if (isChar) {
        const cleanName = (m.flowName || m.name || '').replace(/\\s*\\([^)]*\\)/, '').trim()
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
        const clean = t.replace(/^@\\{?/, '').replace(/\\}?$/, '').replace(/\\s*\\([^)]*\\)/, '').trim()
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
        const strippedK = k.replace(/^(Boss|Character):\\s*/i, '').replace(/\\s*\\([^)]*\\)/, '').trim().toLowerCase()
        const strippedName = name.replace(/^(Boss|Character):\\s*/i, '').replace(/\\s*\\([^)]*\\)/, '').trim().toLowerCase()
        if (strippedK === strippedName && v && typeof v === 'string' && v.trim().length >= 8) {
          hasValidUuid = true
          break
        }
      }
    }
    if (!hasValidUuid) {
      unmapped.push(name)
    }
  }

  return unmapped
})

const isCopyDisabledDueToMissingUuids = computed(() => unmappedCharacterEntities.value.length > 0)`;

if (oldUnmappedRegex.test(content)) {
  content = content.replace(oldUnmappedRegex, newUnmappedCode);
  console.log('1. Updated unmappedCharacterEntities logic.');
} else {
  console.error('Failed to locate unmappedCharacterEntities block!');
}

// 2. Insert main warning banner before <!-- Batch Mini-Cards Grid -->
const bannerHtml = `      <!-- Mandatory Character Entity UUID Gate Warning Banner -->
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
          <p class="text-[11px] text-rose-600 dark:text-rose-400 pt-1">
            💡 Open the <strong>Google Flow Character Entities</strong> card above or the <strong>Character Vault</strong> to assign their respective UUIDs before copying prompts.
          </p>
        </div>
      </div>\n\n`;

if (!content.includes('Prompt Matrix Copying Locked')) {
  content = content.replace('<!-- Batch Mini-Cards Grid -->', bannerHtml + '      <!-- Batch Mini-Cards Grid -->');
  console.log('2. Inserted main warning banner.');
} else {
  console.log('2. Warning banner already present.');
}

// 3. Top buttons disabled binding
content = content.replace(
  /@click="copySelectedPrompts"\s+class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm cursor-pointer"/,
  `@click="copySelectedPrompts"
          :disabled="isCopyDisabledDueToMissingUuids"
          class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm"
          :class="isCopyDisabledDueToMissingUuids ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"`
);

content = content.replace(
  /@click="copyMissingPrompts"\s+class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm cursor-pointer"/,
  `@click="copyMissingPrompts"
          :disabled="isCopyDisabledDueToMissingUuids"
          class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono flex items-center space-x-1.5 transition shadow-sm"
          :class="isCopyDisabledDueToMissingUuids ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"`
);
console.log('3. Updated top copy buttons disabled binding.');

// 4. Single prompt copy button
content = content.replace(
  /@click="copySinglePrompt\(p, index\)"\s+class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-purple-600 hover:text-white hover:border-purple-600 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-sm w-full justify-center"/,
  `@click="copySinglePrompt(p, index)"
              :disabled="isCopyDisabledDueToMissingUuids"
              class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-sm w-full justify-center"
              :class="isCopyDisabledDueToMissingUuids ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-600 hover:text-white hover:border-purple-600 cursor-pointer'"`
);
console.log('4. Updated single prompt copy button.');

// 5. Drawer warning banner before <!-- Dispatch Progress Tracker -->
const drawerBannerHtml = `              <!-- Drawer Character Entity UUID Gate Banner -->
              <div 
                v-if="isCopyDisabledDueToMissingUuids" 
                class="mt-4 p-3.5 rounded-xl border border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/50 shadow-xs flex items-start space-x-2.5 text-rose-900 dark:text-rose-200 text-xs"
              >
                <AlertTriangle class="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div class="space-y-1">
                  <span class="font-bold text-rose-700 dark:text-rose-300 block">Copying Disabled: Missing Character UUIDs</span>
                  <p class="text-[11px] text-rose-700 dark:text-rose-300 leading-normal">
                    Please map UUIDs for: <span class="font-mono font-semibold">{{ unmappedCharacterEntities.join(', ') }}</span> in the Character Vault before copying chunks.
                  </p>
                </div>
              </div>\n\n`;

if (!content.includes('Copying Disabled: Missing Character UUIDs')) {
  content = content.replace('<!-- Dispatch Progress Tracker -->', drawerBannerHtml + '              <!-- Dispatch Progress Tracker -->');
  console.log('5. Inserted drawer warning banner.');
}

// 6. Drawer missing button
content = content.replace(
  /@click="copyMissingPrompts"\s+class="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer"/,
  `@click="copyMissingPrompts"
                  :disabled="isCopyDisabledDueToMissingUuids"
                  class="px-3.5 py-2 rounded-lg bg-amber-600 text-white text-xs font-mono font-bold transition shadow-xs"
                  :class="isCopyDisabledDueToMissingUuids ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500 cursor-pointer'"`
);
console.log('6. Updated drawer missing button.');

// 7. Drawer batch chunk buttons
// 7a. copyNextBatchChunk
content = content.replace(
  /@click="copyNextBatchChunk\(batch, bIdx\)"\s+class="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm text-white"\s+:class="activeCopiedKey && activeCopiedKey\.startsWith\(`\$\{bIdx\}_`\)\s+\?\s+'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950\/20'\s+:\s+\(batch\.isFullyCopied\s+\?\s+'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950\/20'\s+:\s+'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-950\/20'\)"/,
  `@click="copyNextBatchChunk(batch, bIdx)"
                    :disabled="isCopyDisabledDueToMissingUuids"
                    class="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm text-white"
                    :class="isCopyDisabledDueToMissingUuids
                      ? 'opacity-50 cursor-not-allowed bg-slate-500'
                      : (activeCopiedKey && activeCopiedKey.startsWith(\`\${bIdx}_\`)
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20 cursor-pointer'
                        : (batch.isFullyCopied
                          ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20 cursor-pointer'
                          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-950/20 cursor-pointer'))"`
);

// 7b. copyChunk micro-chunk buttons
content = content.replace(
  /@click="copyChunk\(batch, bIdx, chunk, cIdx\)"\s+class="px-2.5 py-2 rounded-lg text-xs font-mono font-bold border transition flex items-center justify-between cursor-pointer shadow-2xs"/,
  `@click="copyChunk(batch, bIdx, chunk, cIdx)"
                        :disabled="isCopyDisabledDueToMissingUuids"
                        class="px-2.5 py-2 rounded-lg text-xs font-mono font-bold border transition flex items-center justify-between shadow-2xs"
                        :class="isCopyDisabledDueToMissingUuids ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'"`
);

// 7c. copyBatchFullXml
content = content.replace(
  /@click="copyBatchFullXml\(batch, bIdx\)"\s+class="w-full py-2 px-3 rounded-lg text-\[11px\] font-mono font-bold flex items-center justify-center space-x-1.5 transition border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"/,
  `@click="copyBatchFullXml(batch, bIdx)"
                    :disabled="isCopyDisabledDueToMissingUuids"
                    class="w-full py-2 px-3 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center space-x-1.5 transition border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    :class="isCopyDisabledDueToMissingUuids ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'"`
);

// 7d. copyAllMaster
content = content.replace(
  /@click="copyAllMaster"\s+class="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500\/40 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"/,
  `@click="copyAllMaster"
                  :disabled="isCopyDisabledDueToMissingUuids"
                  class="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-sm font-bold flex items-center justify-center space-x-2 transition-all"
                  :class="isCopyDisabledDueToMissingUuids ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-500/40 hover:text-slate-900 dark:hover:text-white cursor-pointer'"`
);
console.log('7. Updated drawer batch action buttons.');

// 8. Add guards inside JS copy functions
const guardCheck = `  if (isCopyDisabledDueToMissingUuids.value) {
    showToast(\`⚠️ Copy Locked: Missing Google Flow UUIDs for: \${unmappedCharacterEntities.value.join(', ')}. Map character entities first!\`)
    return
  }
`;

const copyFns = [
  'const copyChunk = async (batch, bIdx, chunk, cIdx) => {',
  'const copyNextBatchChunk = async (batch, bIdx) => {',
  'const copyBatchFullXml = async (batch, bIdx) => {',
  'const copySelectedPrompts = async () => {',
  'const copyMissingPrompts = async () => {',
  'const copyAllMaster = async () => {',
  'const copySinglePrompt = async (item, index) => {'
];

copyFns.forEach(fnSignature => {
  if (content.includes(fnSignature) && !content.includes(fnSignature + '\n' + guardCheck)) {
    content = content.replace(fnSignature, fnSignature + '\n' + guardCheck);
    console.log(`8. Added guard to ${fnSignature.split(' ')[1]}`);
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched PromptMatrixView.vue!');
