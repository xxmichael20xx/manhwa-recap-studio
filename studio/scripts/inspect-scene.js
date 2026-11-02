#!/usr/bin/env node
/**
 * studio/scripts/inspect-scene.js
 *
 * Universal Studio Scene Inspector & Diagnostic CLI (v1.0).
 * Eliminates single-scene scratch test scripts (check_108.mjs, check_174.mjs, etc.).
 *
 * Usage:
 *   node studio/scripts/inspect-scene.js <franchiseId> <episodeId> <sceneTag>
 *   npm run inspect:scene <franchiseId> <episodeId> <sceneTag>
 *
 * Example:
 *   node studio/scripts/inspect-scene.js Series_06_The_Archmage_Engineer EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival IMG_472
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const jsonOnly = args.includes('--json')
const positionalArgs = args.filter(a => !a.startsWith('--'))
const franchiseId = positionalArgs[0]
const episodeId = positionalArgs[1]
let targetTag = positionalArgs[2]

if (!franchiseId || !episodeId || !targetTag) {
  console.error('\x1b[31m[ERROR]\x1b[0m Usage: node studio/scripts/inspect-scene.js <franchiseId> <episodeId> <sceneTag> [--json]')
  process.exit(1)
}

// Normalise target tag (e.g. "472" -> "IMG_472", "img_472" -> "IMG_472", "[IMG_472]" -> "IMG_472")
targetTag = targetTag.toUpperCase().replace(/[\[\]]/g, '')
if (!targetTag.startsWith('IMG_')) {
  const num = parseInt(targetTag.replace(/\D/g, ''), 10)
  targetTag = `IMG_${String(num).padStart(3, '0')}`
}

const epPath = path.resolve(projectRoot, '01_Franchises', franchiseId, episodeId)
const promptPath = path.join(epPath, '02_Prompt_Matrix.md')
const scriptPath = path.join(epPath, '01_Episode_Script.md')

if (!fs.existsSync(promptPath)) {
  console.error(`\x1b[31m[FATAL]\x1b[0m Prompt matrix not found: ${promptPath}`)
  process.exit(1)
}

const promptText = fs.readFileSync(promptPath, 'utf-8')
const scriptText = fs.existsSync(scriptPath) ? fs.readFileSync(scriptPath, 'utf-8') : ''

// Extract the scene XML block
const sceneRegex = new RegExp(`(<scene\\b[^>]*\\bid=["']?${targetTag}["']?[^>]*>[\\s\\S]*?<\\/scene>)`, 'i')
const match = promptText.match(sceneRegex)

if (!match) {
  console.error(`\x1b[31m[ERROR]\x1b[0m Scene tag '${targetTag}' not found in 02_Prompt_Matrix.md`)
  process.exit(1)
}

const sceneXml = match[1]

// Parse XML node attributes & inner tags
const attrMatch = sceneXml.match(/<scene\b([^>]*)>/i)
const attrsStr = attrMatch ? attrMatch[1] : ''

const getAttr = name => {
  const m = attrsStr.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))
  return m ? m[1] : null
}

const getTag = name => {
  const m = sceneXml.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, 'i'))
  return m ? m[1].trim() : null
}

const layout = getTag('layout') || getAttr('tier') || 'Unknown'
const zone = getAttr('zone') || 'Not Set'
const transition = getAttr('transition') || 'adjacent'
const charRefs = getTag('character_refs') || getAttr('character_refs') || ''
const narrativeSync = getTag('narrative_sync') || ''
const prompt = getTag('prompt') || ''

// Token analysis
const promptChars = prompt.length
const estimatedTokens = Math.ceil(promptChars / 4)
const tokensFound = [...prompt.matchAll(/@\{([^}]+)\}/g)].map(m => m[0])
const charRefsList = charRefs.split(',').map(s => s.trim()).filter(Boolean)

// Script match lookup
let scriptClause = ''
if (scriptText) {
  const scriptRegex = new RegExp(`\\[${targetTag}\\]\\s*([^\\r\\n]+)`, 'i')
  const sMatch = scriptText.match(scriptRegex)
  if (sMatch) scriptClause = sMatch[1].replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim()
}

// Quick rule evaluation
const diagnostics = []
if (estimatedTokens > 450) diagnostics.push(`⚠️  Token budget exceeded: ${estimatedTokens}/450 tokens (${promptChars} chars)`)
if (prompt.includes('"')) diagnostics.push(`⚠️  Spoken quotes ('"') detected in visual prompt (Gate 04 risk)`)
if (prompt.includes('@@')) diagnostics.push(`⚠️  Double @ symbol detected: ${prompt.match(/@@[^{]*/)[0]}`)
if (!narrativeSync) diagnostics.push(`⚠️  Missing <narrative_sync> block`)
if (scriptClause && narrativeSync && scriptClause !== narrativeSync) {
  diagnostics.push(`⚠️  Narrative sync mismatch with script text`)
}

if (jsonOnly) {
  console.log(JSON.stringify({
    tag: targetTag,
    layout,
    zone,
    transition,
    character_refs: charRefsList,
    tokens: tokensFound,
    estimatedTokens,
    promptChars,
    narrativeSync,
    scriptClause,
    prompt,
    diagnostics
  }, null, 2))
  process.exit(0)
}

console.log('==============================================================================')
console.log(`  MANHWA RECAP STUDIO — SCENE INSPECTOR: [${targetTag}]`)
console.log('==============================================================================')
console.log(`Episode      : ${episodeId}`)
console.log(`Layout Tier  : ${layout}`)
console.log(`Zone / Room  : ${zone} (Transition: ${transition})`)
console.log(`Char Refs    : ${charRefsList.join(', ') || 'None'}`)
console.log(`Tokens Found : ${tokensFound.join(', ') || 'None'}`)
console.log(`Token Budget : ${estimatedTokens} / 450 tokens (${promptChars} characters)`)
console.log('------------------------------------------------------------------------------')
console.log(`\x1b[36m[NARRATIVE SYNC (VO Clause)]:\x1b[0m`)
console.log(`  "${narrativeSync}"`)
if (scriptClause && scriptClause !== narrativeSync) {
  console.log(`\x1b[33m[SCRIPT TAG PROSE]:\x1b[0m\n  "${scriptClause}"`)
}
console.log('\n\x1b[35m[PROMPT TEXT]:\x1b[0m')
console.log(prompt)
console.log('------------------------------------------------------------------------------')
if (diagnostics.length > 0) {
  console.log(`\x1b[33m[SCENE DIAGNOSTICS]:\x1b[0m`)
  diagnostics.forEach(d => console.log(`  ${d}`))
} else {
  console.log(`\x1b[32m[SCENE STATUS: HEALTHY]\x1b[0m Adheres to token cap, textless standard, and narrative pairing.`)
}
console.log('==============================================================================')
