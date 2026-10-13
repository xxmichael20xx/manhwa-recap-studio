import fs from 'fs';

const file = 'src/views/PromptMatrixView.vue';
let content = fs.readFileSync(file, 'utf8');

const targetStr = ':class="isCopyDisabledDueToMissingUuids ? \'opacity-40 cursor-not-allowed\' : \'cursor-pointer\'"';

// Let's find this button
const btnStart = content.indexOf('v-for="(chunk, cIdx) in batch.chunks"');
if (btnStart !== -1) {
  const slice = content.substring(btnStart, btnStart + 1000);
  console.log('Found chunk button area:\n', slice.substring(0, 300));
  
  // Replace the two :class attributes on that button
  const oldChunkBtnCode = `:class="isCopyDisabledDueToMissingUuids ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'"
                        :class="chunk.isCopied
                          ? (activeCopiedKey === \`\${bIdx}_\${cIdx}\`
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40')
                          : (activeCopiedKey === \`\${bIdx}_\${cIdx}\`
                              ? 'bg-purple-600 text-white border-purple-700'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-950/30')"`;

  const newChunkBtnCode = `:class="[
                          isCopyDisabledDueToMissingUuids ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                          chunk.isCopied
                            ? (activeCopiedKey === \`\${bIdx}_\${cIdx}\`
                                ? 'bg-emerald-500 text-white border-emerald-600'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40')
                            : (activeCopiedKey === \`\${bIdx}_\${cIdx}\`
                                ? 'bg-purple-600 text-white border-purple-700'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-950/30')
                        ]"`;

  // Normalize CRLF to LF for matching
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedOld = oldChunkBtnCode.replace(/\r\n/g, '\n');
  const normalizedNew = newChunkBtnCode.replace(/\r\n/g, '\n');

  if (normalizedContent.includes(normalizedOld)) {
    const replaced = normalizedContent.replace(normalizedOld, normalizedNew);
    // restore CRLF
    fs.writeFileSync(file, replaced.replace(/\n/g, '\r\n'), 'utf8');
    console.log('Successfully replaced chunk button :class!');
  } else {
    console.error('Could not match normalizedOld in normalizedContent!');
  }
}
