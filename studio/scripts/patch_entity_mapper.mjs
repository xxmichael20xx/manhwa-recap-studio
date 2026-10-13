import fs from 'fs';

const filePath = 'src/utils/entityMapper.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add universal alias transformer inside transformTokens()
const targetInsertPoint = `      // Also match stripped key (e.g. @Void-Strung Heavy Recurve)
      const strippedKey = key.replace(/^(Weapon|Item):\\s*/i, '').trim()
      if (strippedKey !== key) {
        const escapedStripped = strippedKey.replace(/[.*+?^$\{}()|[\\]\\\\]/g, '\\\\$&')
        const strippedRegex = new RegExp(\`@\${escapedStripped}(?![a-zA-Z0-9_-])\`, 'g')
        transformed = transformed.replace(strippedRegex, \`@\${uuid}\`)
      }
    }`;

const universalAliasCode = `      // Also match stripped key (e.g. @Void-Strung Heavy Recurve)
      const strippedKey = key.replace(/^(Weapon|Item):\\s*/i, '').trim()
      if (strippedKey !== key) {
        const escapedStripped = strippedKey.replace(/[.*+?^$\{}()|[\\]\\\\]/g, '\\\\$&')
        const strippedRegex = new RegExp(\`@\${escapedStripped}(?![a-zA-Z0-9_-])\`, 'g')
        transformed = transformed.replace(strippedRegex, \`@\${uuid}\`)
      }
    }

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

// Replace in content
if (content.includes('// Universal Character Alias Replacement')) {
  console.log('Universal alias replacement already present!');
} else if (content.includes('// Also match stripped key')) {
  const normalized = content.replace(/\r\n/g, '\n');
  const normalizedTarget = targetInsertPoint.replace(/\r\n/g, '\n');
  const normalizedReplacement = universalAliasCode.replace(/\r\n/g, '\n');
  
  if (normalized.includes(normalizedTarget)) {
    content = normalized.replace(normalizedTarget, normalizedReplacement).replace(/\n/g, '\r\n');
    console.log('1. Injected universal alias replacement into transformTokens!');
  } else {
    console.error('Target insert point not found in normalized content!');
  }
}

// 2. Also enhance buildSceneXmlNode to resolve aliases to charRefs
const oldLookupRegex = /const hasToken = text\.includes\(tokenPattern\) \|\| text\.includes\(`@\$\{uuid\}`\) \|\| text\.includes\(key\)/;

const newLookupCode = `let hasToken = text.includes(tokenPattern) || text.includes(\`@\${uuid}\`) || text.includes(key)
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

if (oldLookupRegex.test(content)) {
  content = content.replace(oldLookupRegex, newLookupCode);
  console.log('2. Enhanced buildSceneXmlNode alias detection for charRefs!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated src/utils/entityMapper.js!');
