const entityMap = {
  'Bramwell Locke': '16c4c742-5932-4c96-9c0c-c42aadbcb00a',
  'Boss: Abyssal Minotaur': '70365391-fd2f-47b2-88c5-c587c1a02a65',
  'Commander Vance Sterling': '78f698f6-7fc3-4258-97d0-8e5733f8c70f',
  'Linnea Croft': '7cf4d027-6863-4e4b-8f93-f58ceb6f0b0b',
  'Lord Cassian Valerius': '85907b43-f56f-4b92-9869-b3c40d8d0c17'
};

const sampleText = "Top block: 24-year-old @{Bramwell Locke} standing in arena. Bottom block: Close-up of Bram's unbothered smile as Bram drinks tea with Linnea and Cassian watches in anger while Minotaur roars.";

let transformed = sampleText;

// 1. Existing bracket replacement
transformed = transformed.replace(/@\{([^}]+)\}/g, (match, key) => {
  return entityMap[key.trim()] ? '@' + entityMap[key.trim()] : match;
});

// 2. Universal alias replacement
for (const [key, uuid] of Object.entries(entityMap)) {
  if (/^(Weapon|Item):/i.test(key)) continue;
  const aliases = new Set();
  const cleanKey = key.replace(/^(Boss|Character|Commander|Lord|Instructor|Director):\s*/i, '').trim();
  if (cleanKey.length >= 3) aliases.add(cleanKey);
  const words = cleanKey.split(/\s+/).filter(w => w.length >= 3);
  if (words.length > 0) aliases.add(words[0]);
  if (cleanKey.toLowerCase().includes('bramwell')) aliases.add('Bram');
  if (cleanKey.toLowerCase().includes('minotaur')) aliases.add('Minotaur');
  if (cleanKey.toLowerCase().includes('cassian')) aliases.add('Cassian');
  if (cleanKey.toLowerCase().includes('vance')) aliases.add('Vance');

  const sortedAliases = Array.from(aliases).sort((a, b) => b.length - a.length);
  for (const alias of sortedAliases) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const possessiveRegex = new RegExp(`(?<![@{a-zA-Z0-9_-])\\b${escaped}('s|’s)\\b`, 'g');
    transformed = transformed.replace(possessiveRegex, `@${uuid}'s`);
    const standardRegex = new RegExp(`(?<![@{a-zA-Z0-9_-])\\b${escaped}\\b(?!['’]s)`, 'g');
    transformed = transformed.replace(standardRegex, `@${uuid}`);
  }
}

console.log('Original Text:\n', sampleText);
console.log('\nTransformed Text:\n', transformed);
