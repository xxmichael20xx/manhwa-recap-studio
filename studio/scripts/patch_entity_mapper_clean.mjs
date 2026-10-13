import fs from 'fs';

const filePath = 'src/utils/entityMapper.js';
let content = fs.readFileSync(filePath, 'utf8');

// The block to insert inside transformTokens
const universalAliasCode = `

    // Universal Character Alias Replacement (Anti-Inconsistency Invariant)
    // Automatically transforms unbracketed character names and possessives (e.g. "Bram", "Bram's", "Cassian", "Linnea")
    for (const [key, uuid] of Object.entries(entityMap)) {
      if (/^(Weapon|Item):/i.test(key)) continue
      const aliases = new Set()
      const cleanKey = key.replace(/^(Boss|Character|Commander|Lord|Instructor|Director):\\s*/i, '')
                          .replace(/\\s*\\(.*?\\)/g, '')
                          .replace(/\\s*-\\s*.*$/, '')
                          .trim()
      if (cleanKey && cleanKey.length >= 3) aliases.add(cleanKey)
      const words = cleanKey.split(/\\s+/).filter(w => w.length >= 3)
      if (words.length > 0) aliases.add(words[0])
      if (cleanKey.toLowerCase().includes('bramwell')) aliases.add('Bram')
      if (cleanKey.toLowerCase().includes('minotaur')) aliases.add('Minotaur')
      if (cleanKey.toLowerCase().includes('cassian')) aliases.add('Cassian')
      if (cleanKey.toLowerCase().includes('vance')) aliases.add('Vance')

      const sortedAliases = Array.from(aliases).sort((a, b) => b.length - a.length)
      for (const alias of sortedAliases) {
        const escaped = alias.replace(/[.*+?^$\{}()|[\\]\\\\]/g, '\\\\$&')
        const possessiveRegex = new RegExp(\`(?<![@{a-zA-Z0-9_-])\\\\b\${escaped}('s|’s)\\\\b\`, 'g')
        transformed = transformed.replace(possessiveRegex, \`@\${uuid}'s\`)
        const standardRegex = new RegExp(\`(?<![@{a-zA-Z0-9_-])\\\\b\${escaped}\\\\b(?!['’]s)\`, 'g')
        transformed = transformed.replace(standardRegex, \`@\${uuid}\`)
      }
    }`;

// Find insertion point before return transformed
const returnIdx = content.indexOf('    return transformed\n  } else {');
const returnIdxCRLF = content.indexOf('    return transformed\r\n  } else {');

if (returnIdxCRLF !== -1) {
  content = content.slice(0, returnIdxCRLF) + universalAliasCode.replace(/\n/g, '\r\n') + '\r\n\r\n' + content.slice(returnIdxCRLF);
  console.log('Inserted universal alias code (CRLF)!');
} else if (returnIdx !== -1) {
  content = content.slice(0, returnIdx) + universalAliasCode + '\n\n' + content.slice(returnIdx);
  console.log('Inserted universal alias code (LF)!');
} else {
  console.error('Could not find return transformed in content!');
}

// 2. Enhance buildSceneXmlNode
const oldLookup = 'const hasToken = text.includes(tokenPattern) || text.includes(`@${uuid}`) || text.includes(key)';
const newLookup = `let hasToken = text.includes(tokenPattern) || text.includes(\`@\${uuid}\`) || text.includes(key)
      if (!hasToken && !isItem) {
        const cleanKey = key.replace(/^(Boss|Character|Commander|Lord|Instructor|Director):\\s*/i, '').trim()
        const words = cleanKey.split(/\\s+/).filter(w => w.length >= 3)
        const checkNames = [cleanKey, ...words]
        if (cleanKey.toLowerCase().includes('bramwell')) checkNames.push('Bram')
        if (cleanKey.toLowerCase().includes('minotaur')) checkNames.push('Minotaur')
        if (cleanKey.toLowerCase().includes('cassian')) checkNames.push('Cassian')
        if (cleanKey.toLowerCase().includes('vance')) checkNames.push('Vance')
        for (const n of checkNames) {
          const re = new RegExp(\`\\\\b\${n}\\\\b\`, 'i')
          if (re.test(text)) {
            hasToken = true
            break
          }
        }
      }`;

if (content.includes(oldLookup)) {
  content = content.replace(oldLookup, () => newLookup);
  console.log('Enhanced buildSceneXmlNode alias detection!');
} else {
  console.error('Could not find oldLookup in content!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched entityMapper.js!');
