import fs from 'fs';
import path from 'path';

const genPath = path.resolve('scripts/generate_series03_prompt_matrix.mjs');
let content = fs.readFileSync(genPath, 'utf8');

// Target Scene 5 replacement
const oldScene5 = `  {
    num: 5,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Holographic system interface and needle runes',
    charRef: UUIDS.BRAM,
    prompt: \`Dual-panel manhwa webtoon comic strip. Top block: Semi-transparent holographic system interface flashing cyan runes without letters floating before @{Bramwell Locke}. Bottom block: Microscopic cyan numerical runes spiraling violently into the needle tip held by @{Bramwell Locke}. \${ZONES.BOSS_CAVERN} \${NEG}\`
  },`;

const newScene5 = `  {
    num: 5,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Holographic system interface and needle runes',
    charRef: UUIDS.BRAM,
    prompt: \`Dual-panel manhwa webtoon comic strip. Top block: Medium close-up profile shot of 24-year-old @{Bramwell Locke} in basalt cavern, messy parted chestnut-brown hair with short relaxed fringe over forehead, calm golden-amber eyes, confident unbothered craftsman smile, wearing rolled-up cream linen shirt and dark brown leather artisan vest, calmly observing a clean translucent cyan holographic status window floating in front of him. Bottom block: Extreme close-up of @{Bramwell Locke}'s right hand and wrist in rolled-up cream linen sleeve, slender fingers holding the green pine needle perfectly steady as microscopic cyan numerical runes and kinetic light spiral violently into the needle tip, amber eye reflection. \${ZONES.BOSS_CAVERN} \${NEG}\`
  },`;

if (content.includes(oldScene5)) {
  content = content.replace(oldScene5, newScene5);
  console.log('Updated Scene 5 with full Character DNA!');
} else {
  console.error('Could not find oldScene5 in generate_series03_prompt_matrix.mjs!');
}

// Also fortify Scene 6
const oldScene6 = `  {
    num: 6,
    tier: 'Tier C: Action Strip',
    desc: 'Supersonic pine needle piercing minotaur',
    charRefs: \`\${UUIDS.MINOTAUR}, \${UUIDS.BRAM}\`,
    prompt: \`Three-panel vertical manhwa action strip. Top: Pine needle releasing a conical sonic shockwave ring as @{Bramwell Locke} launches it with a flick. Middle: Blinding supersonic beam shattering the granite warhammer into stone shrapnel. Bottom: Needle piercing cleanly through @{Boss: Abyssal Minotaur}'s forehead into rear cavern basalt wall. \${ZONES.BOSS_CAVERN} \${NEG}\`
  },`;

const newScene6 = `  {
    num: 6,
    tier: 'Tier C: Action Strip',
    desc: 'Supersonic pine needle piercing minotaur',
    charRefs: \`\${UUIDS.MINOTAUR}, \${UUIDS.BRAM}\`,
    prompt: \`Three-panel vertical manhwa action strip. Top: Siphoned green pine needle held in slender fingers of 24-year-old @{Bramwell Locke} with messy chestnut-brown hair and rolled-up cream linen shirt releasing conical sonic shockwave ring as he launches it with a flick. Middle: Blinding supersonic kinetic beam shattering the spiked granite warhammer of @{Boss: Abyssal Minotaur} into stone shrapnel. Bottom: Needle piercing cleanly through @{Boss: Abyssal Minotaur}'s forehead between curved obsidian horns into rear cavern basalt wall. \${ZONES.BOSS_CAVERN} \${NEG}\`
  },`;

if (content.includes(oldScene6)) {
  content = content.replace(oldScene6, newScene6);
  console.log('Updated Scene 6 with full Character DNA!');
}

// Fortify Scene 15
const oldScene15 = `  {
    num: 15,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Imperial proctors watching dark crystal',
    charRef: UUIDS.BRAM,
    prompt: \`Dual-panel manhwa webtoon comic strip. Top block: Imperial proctors in high robes watching the obsidian crystal with eager anticipation. Bottom block: The obsidian crystal remaining completely dark with only a faint, dull grey flicker as @{Bramwell Locke} stands calmly. \${ZONES.TESTING_DAIS} \${NEG}\`
  },`;

const newScene15 = `  {
    num: 15,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Imperial proctors watching dark crystal',
    charRef: UUIDS.BRAM,
    prompt: \`Dual-panel manhwa webtoon comic strip. Top block: Imperial proctors in gold-trimmed high robes watching the black obsidian crystal with eager anticipation. Bottom block: The obsidian crystal remaining completely dark with only a faint, dull grey flicker as 24-year-old @{Bramwell Locke} with messy chestnut-brown hair, golden-amber eyes, rolled-up cream linen shirt and dark brown leather artisan vest stands calmly with hands in pockets, polite unbothered smile. \${ZONES.TESTING_DAIS} \${NEG}\`
  },`;

if (content.includes(oldScene15)) {
  content = content.replace(oldScene15, newScene15);
  console.log('Updated Scene 15 with full Character DNA!');
}

// Fortify Scene 16
const oldScene16 = `  {
    num: 16,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Dull iron knife holographic rank icon',
    charRef: UUIDS.BRAM,
    prompt: \`Dual-panel manhwa webtoon comic strip. Top block: Dull holographic crystal flashing low grey light above @{Bramwell Locke}'s head. Bottom block: Faint iron knife icon appearing on the diagnostic plate without any glowing aura. \${ZONES.TESTING_DAIS} \${NEG}\`
  },`;

const newScene16 = `  {
    num: 16,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'Dull iron knife holographic rank icon',
    charRef: UUIDS.BRAM,
    prompt: \`Dual-panel manhwa webtoon comic strip. Top block: Dull holographic crystal flashing low grey light above messy chestnut-brown hair of 24-year-old @{Bramwell Locke}, golden-amber eyes, rolled-up cream linen shirt. Bottom block: Faint iron knife icon appearing on diagnostic plate without glowing aura as @{Bramwell Locke} looks on with an unbothered craftsman smile in his dark brown leather artisan vest. \${ZONES.TESTING_DAIS} \${NEG}\`
  },`;

if (content.includes(oldScene16)) {
  content = content.replace(oldScene16, newScene16);
  console.log('Updated Scene 16 with full Character DNA!');
}

// Fortify Scene 65
const oldScene65 = `  {
    num: 65,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'System withdrawing 2,500 units into pine needle',
    charRef: UUIDS.BRAM,
    prompt: \`Dual-panel manhwa webtoon comic strip. Top block: System calculation runes withdrawing 2,500 units into the pine needle held by @{Bramwell Locke}. Bottom block: Blinding supersonic kinetic aura igniting along the needle's edge. \${ZONES.BOSS_CAVERN} \${NEG}\`
  },`;

const newScene65 = `  {
    num: 65,
    tier: 'Tier B: Dual-Panel Split',
    desc: 'System withdrawing 2,500 units into pine needle',
    charRef: UUIDS.BRAM,
    prompt: \`Dual-panel manhwa webtoon comic strip. Top block: Medium close-up profile shot of 24-year-old @{Bramwell Locke} in basalt cavern, messy parted chestnut-brown hair with short relaxed fringe over forehead, calm golden-amber eyes, confident unbothered craftsman smile, wearing rolled-up cream linen shirt and dark brown leather artisan vest, observing translucent cyan holographic calculation runes withdrawing 2,500 units into the pine needle. Bottom block: Extreme close-up of @{Bramwell Locke}'s slender fingers in rolled-up cream linen sleeve holding the green pine needle as blinding supersonic kinetic aura ignites along needle's edge, amber eye reflection. \${ZONES.BOSS_CAVERN} \${NEG}\`
  },`;

if (content.includes(oldScene65)) {
  content = content.replace(oldScene65, newScene65);
  console.log('Updated Scene 65 with full Character DNA!');
}

// Fortify Scene 66
const oldScene66 = `  {
    num: 66,
    tier: 'Tier C: Action Strip',
    desc: 'Hypersonic needle obliterating warhammer and minotaur',
    charRefs: \`\${UUIDS.MINOTAUR}, \${UUIDS.BRAM}\`,
    prompt: \`Three-panel vertical manhwa action strip. Top: Hypersonic pine needle releasing blinding emerald-cyan light from @{Bramwell Locke}'s fingers. Middle: Smashing straight through @{Boss: Abyssal Minotaur}'s granite warhammer, disintegrating the stone. Bottom: Cleanly piercing through @{Boss: Abyssal Minotaur}'s skull, pinning it to the rear basalt wall. \${ZONES.BOSS_CAVERN} \${NEG}\`
  },`;

const newScene66 = `  {
    num: 66,
    tier: 'Tier C: Action Strip',
    desc: 'Hypersonic needle obliterating warhammer and minotaur',
    charRefs: \`\${UUIDS.MINOTAUR}, \${UUIDS.BRAM}\`,
    prompt: \`Three-panel vertical manhwa action strip. Top: Hypersonic pine needle releasing blinding emerald-cyan light from slender fingers of 24-year-old @{Bramwell Locke} with messy chestnut-brown hair and rolled-up cream linen shirt. Middle: Smashing straight through colossal spiked granite warhammer of @{Boss: Abyssal Minotaur}, disintegrating stone. Bottom: Cleanly piercing through @{Boss: Abyssal Minotaur}'s skull between curved obsidian horns, pinning titan to rear basalt wall. \${ZONES.BOSS_CAVERN} \${NEG}\`
  },`;

if (content.includes(oldScene66)) {
  content = content.replace(oldScene66, newScene66);
  console.log('Updated Scene 66 with full Character DNA!');
}

fs.writeFileSync(genPath, content, 'utf8');
console.log('Saved changes to generate_series03_prompt_matrix.mjs');
