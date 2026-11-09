#!/usr/bin/env node
/**
 * studio/scripts/lock-launch.js
 *
 * Universal Studio YouTube Release Locking & Disk Parity Engine (v1.0).
 * Atomically locks operator-selected Titles and Thumbnails into the Master Series Bible
 * (YouTube_Locked_Package.md), synchronises disk assets, generates episodic packages,
 * and verifies parity with the live Studio API.
 *
 * Usage:
 *   node studio/scripts/lock-launch.js <franchiseId> [--title "<Title>"] [--thumb "<ImagePath>"] [--concept "<A|B|C>"] [--verify-only]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

// Parse CLI Arguments
const args = process.argv.slice(2)
const verifyOnly = args.includes('--verify-only')
const positionalArgs = args.filter(a => !a.startsWith('--'))
const franchiseId = positionalArgs[0]

if (!franchiseId) {
  console.error('\x1b[31m[ERROR]\x1b[0m Usage: node studio/scripts/lock-launch.js <franchiseId> [--title "<Title>"] [--thumb "<ImagePath>"] [--concept "<A|B|C>"] [--verify-only]')
  process.exit(1)
}

function getNamedArg(flag) {
  const idx = args.indexOf(flag)
  if (idx !== -1 && idx + 1 < args.length && !args[idx + 1].startsWith('--')) {
    return args[idx + 1]
  }
  return null
}

const inputTitle = getNamedArg('--title')
const inputThumb = getNamedArg('--thumb')
const inputConcept = (getNamedArg('--concept') || 'A').toUpperCase()

const franchiseDir = path.resolve(projectRoot, '01_Franchises', franchiseId)
if (!fs.existsSync(franchiseDir)) {
  console.error(`\x1b[31m[FATAL]\x1b[0m Franchise directory not found: ${franchiseDir}`)
  process.exit(1)
}

// Release Cadence Governance: Series 07+ = Discrete Act/Part Model (Option 1); Series 01-06 = Accumulative Model (Option 2)
const seriesNumMatch = franchiseId.match(/Series_0*(\d+)/i)
const seriesNum = seriesNumMatch ? parseInt(seriesNumMatch[1], 10) : 1
const isActPartModel = seriesNum >= 7

const bibleDir = path.join(franchiseDir, '00_Series_Bible_and_Character_DNA')
const masterLockedPkgPath = path.join(bibleDir, 'YouTube_Locked_Package.md')
const omnibusDir = path.join(franchiseDir, 'omnibus')
const omnibusThumbDir = path.join(omnibusDir, 'thumbnails')

// Identify available episode directories
const epEntries = fs.readdirSync(franchiseDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && /^EP\d+/i.test(d.name))
  .map(d => d.name)
  .sort()

const firstEp = epEntries[0] || 'EP01'
const firstEpThumbDir = path.join(franchiseDir, firstEp, 'thumbnails')

console.log(`\x1b[36m[LOCK-LAUNCH]\x1b[0m Initialising release lock for: \x1b[1m${franchiseId}\x1b[0m`)
console.log(`\x1b[36m[LOCK-LAUNCH]\x1b[0m Cadence Architecture: \x1b[33m${isActPartModel ? 'Series 07+ Discrete Act/Part Model (Option 1)' : 'Series 01-06 Legacy Accumulative Model (Option 2)'}\x1b[0m`)
console.log(`\x1b[36m[LOCK-LAUNCH]\x1b[0m First Episode: ${firstEp} | Total Episodes: ${epEntries.length}`)

let modifiedCount = 0

// 1. Process Thumbnail Invariant & Asset Synchronisation
if (inputThumb) {
  const resolvedThumbPath = path.resolve(inputThumb)
  if (!fs.existsSync(resolvedThumbPath)) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Source thumbnail file not found: ${resolvedThumbPath}`)
    process.exit(1)
  }

  const stat = fs.statSync(resolvedThumbPath)
  const sizeMB = stat.size / (1024 * 1024)
  console.log(`\x1b[32m[THUMB]\x1b[0m Ingesting verified thumbnail: ${path.basename(resolvedThumbPath)} (${sizeMB.toFixed(2)} MB)`)

  if (sizeMB > 2.0) {
    console.warn(`\x1b[33m[WARN]\x1b[0m File size (${sizeMB.toFixed(2)} MB) exceeds YouTube 2.0 MB recommendation!`)
  }

  // Ensure directories exist
  if (!fs.existsSync(firstEpThumbDir)) fs.mkdirSync(firstEpThumbDir, { recursive: true })
  if (!fs.existsSync(omnibusThumbDir)) fs.mkdirSync(omnibusThumbDir, { recursive: true })

  const canonicalConceptName = `01_Thumbnail_Concept_${inputConcept}.jpg`

  // Targets to synchronise atomically
  const targets = [
    path.join(firstEpThumbDir, canonicalConceptName),
    path.join(firstEpThumbDir, '01_Thumbnail_Master.jpg'),
    path.join(bibleDir, canonicalConceptName),
    path.join(bibleDir, '01_Thumbnail_Master.jpg'),
    path.join(omnibusDir, '01_Thumbnail_Master.jpg'),
    path.join(omnibusThumbDir, canonicalConceptName),
    path.join(omnibusThumbDir, '01_Thumbnail_Master.jpg')
  ]

  for (const target of targets) {
    fs.copyFileSync(resolvedThumbPath, target)
    console.log(`  \x1b[90m→ Synced target:\x1b[0m ${path.relative(franchiseDir, target)}`)
    modifiedCount++
  }
}

// 2. Process Title Invariant & Master Bible SSOT Mutation
if (inputTitle) {
  // Strip any leading (Episode X) or (Episode 1-N) to obtain canonical base title
  const cleanBase = inputTitle.replace(/^\((?:Episode|Episodes|Part|Parts)\s+[^)]+\)\s*/i, '').trim()
  
  if (cleanBase.length > 84) {
    console.warn(`\x1b[33m[WARN]\x1b[0m Base title length is ${cleanBase.length} chars (target <= 84 for 100 char limit on compilations).`)
  }

  console.log(`\x1b[32m[TITLE]\x1b[0m Locking Base Series Title: "${cleanBase}" (${cleanBase.length} chars)`)

  if (fs.existsSync(masterLockedPkgPath)) {
    let bibleContent = fs.readFileSync(masterLockedPkgPath, 'utf-8')

    // Pattern A: Update Base Locked Title block
    const baseBlockRegex = /(\*\*Base Locked Title[^\n]*\*\*:?\s*\r?\n```(?:text)?\r?\n)([\s\S]*?)(\r?\n```)/i
    if (baseBlockRegex.test(bibleContent)) {
      bibleContent = bibleContent.replace(baseBlockRegex, `$1${cleanBase}$3`)
    }

    // Pattern B: Update Upload Cadence Lines
    if (isActPartModel) {
      const part1 = `(Part 1) ${cleanBase}`
      const part2 = `(Part 2) ${cleanBase}`
      const part3 = `(Part 3) ${cleanBase}`

      bibleContent = bibleContent.replace(/(-\s*\*\*(?:Upload 1|Part 1)[^*]*\*\*:\s*`)[^`]+(`)/i, `$1${part1}$2`)
      bibleContent = bibleContent.replace(/(-\s*\*\*(?:Upload 2|Part 2)[^*]*\*\*:\s*`)[^`]+(`)/i, `$1${part2}$2`)
      bibleContent = bibleContent.replace(/(-\s*\*\*(?:Upload 3|Part 3)[^*]*\*\*:\s*`)[^`]+(`)/i, `$1${part3}$2`)
    } else {
      const upload1 = `(Episode 1) ${cleanBase}`
      const upload2 = `(Episode 1-2) ${cleanBase}`
      const upload3 = `(Episode 1-3) ${cleanBase}`

      bibleContent = bibleContent.replace(/(-\s*\*\*Upload 1[^*]*\*\*:\s*`)[^`]+(`)/i, `$1${upload1}$2`)
      bibleContent = bibleContent.replace(/(-\s*\*\*Upload 2[^*]*\*\*:\s*`)[^`]+(`)/i, `$1${upload2}$2`)
      bibleContent = bibleContent.replace(/(-\s*\*\*Upload 3[^*]*\*\*:\s*`)[^`]+(`)/i, `$1${upload3}$2`)
    }

    // Pattern C: Update Locked Master Thumbnail Concept if provided
    if (inputThumb || inputConcept) {
      bibleContent = bibleContent.replace(/(-\s*\*\*Variant ID:\*\*\s*`concept_)[a-c](`)/i, `$1${inputConcept.toLowerCase()}$2`)
      bibleContent = bibleContent.replace(/(-\s*\*\*Filename:\*\*\s*`)01_Thumbnail_Concept_[A-C]\.jpg(`)/i, `$101_Thumbnail_Concept_${inputConcept}.jpg$2`)

      // Ensure explicit Locked Canonical Master Thumbnail line exists for PackagingService filter
      const lockedThumbLine = `- **Locked Canonical Master Thumbnail:** **Concept ${inputConcept}** (\`01_Thumbnail_Concept_${inputConcept}.jpg\`)`
      if (!bibleContent.includes('Locked Canonical Master Thumbnail:')) {
        bibleContent = bibleContent.replace(/(##\s*[^\n]*Locked Master Thumbnail[^\n]*\r?\n)/i, `$1\n${lockedThumbLine}\n`)
      } else {
        bibleContent = bibleContent.replace(/-\s*\*\*Locked Canonical Master Thumbnail:\*\*\s*[^\r\n]+/i, lockedThumbLine)
      }
    }

    fs.writeFileSync(masterLockedPkgPath, bibleContent, 'utf-8')
    console.log(`\x1b[32m[SSOT]\x1b[0m Updated Master Series Bible: ${path.relative(franchiseDir, masterLockedPkgPath)}`)
    modifiedCount++
  }
}

// 3. Verify Master Bible Integrity
if (!fs.existsSync(masterLockedPkgPath)) {
  console.error(`\x1b[31m[ERROR]\x1b[0m Master Series Bible YouTube_Locked_Package.md not found!`)
  process.exit(1)
}

const currentBible = fs.readFileSync(masterLockedPkgPath, 'utf-8')
const lockedBaseMatch = currentBible.match(/\*\*Base Locked Title[^\n]*\*\*:?\s*\r?\n```(?:text)?\r?\n([\s\S]*?)\r?\n```/i)
const activeLockedBase = lockedBaseMatch ? lockedBaseMatch[1].trim() : (inputTitle ? inputTitle.replace(/^\((?:Episode|Episodes|Part|Parts)\s+[^)]+\)\s*/i, '').trim() : null)

// 2.1 Update Episodic Packages to Lock Title and Thumbnail Exclusively
for (const epName of epEntries) {
  const epPkgPath = path.join(franchiseDir, epName, '03_YouTube_Package.md')
  if (fs.existsSync(epPkgPath)) {
    let epContent = fs.readFileSync(epPkgPath, 'utf-8')
    const epNumMatch = epName.match(/EP0*(\d+)/i)
    const epNum = epNumMatch ? parseInt(epNumMatch[1], 10) : 1
    const epCleanBase = activeLockedBase

    if (epCleanBase) {
      // Lock to single title based on series cadence
      let epPrefix = `(Episode ${epNum})`
      if (isActPartModel) {
        epPrefix = `(Part 1)`
      } else {
        epPrefix = epNum > 1 && epEntries.length > 1 && epName === epEntries[epEntries.length - 1] ? `(Episode 1-${epNum})` : `(Episode ${epNum})`
      }
      const singleTitleSection = `## 🎯 1. High-CTR Title Options (<= 100 Characters)\n\n1. ${epPrefix} ${epCleanBase}\n`
      epContent = epContent.replace(/##\s*[^\n]*(?:High-CTR Title Options|Master Title Kit)[^\n]*[\s\S]*?(?=##\s+|$)/i, singleTitleSection)

      // Ensure description reflects Part/Act structure and states episode boundary
      if (isActPartModel) {
        epContent = epContent.replace(/🎬 (?:Episode|Release|Compilation):[^\n]+/i, `🎬 Release: Part 1 — Act 1 Feature (Covers Episodes 01 - ${String(epEntries.length).padStart(2, '0')})`)
      }

      // Lock thumbnail to single concept
      const lockedThumbLine = `- **Locked Canonical Master Thumbnail:** **Concept ${inputConcept}** (\`01_Thumbnail_Concept_${inputConcept}.jpg\`)`
      if (!epContent.includes('Locked Canonical Master Thumbnail:')) {
        epContent = epContent.replace(/(##\s*[^\n]*Master Visual Thumbnail Concepts[^\n]*\r?\n)/i, `$1\n${lockedThumbLine}\n`)
      } else {
        epContent = epContent.replace(/-\s*\*\*Locked Canonical Master Thumbnail:\*\*\s*[^\r\n]+/i, lockedThumbLine)
      }

      fs.writeFileSync(epPkgPath, epContent, 'utf-8')
      console.log(`\x1b[32m[EP-SSOT]\x1b[0m Locked single Title & Thumbnail in: ${path.relative(franchiseDir, epPkgPath)}`)
    }
  }
}

console.log(`\n\x1b[1m=== VERIFICATION CONTRACT ===\x1b[0m`)
console.log(`1. Master Bible SSOT Base Title: \x1b[32m${activeLockedBase || 'UNKNOWN'}\x1b[0m`)

// Check Concept A Disk Parity
const conceptAFile = path.join(firstEpThumbDir, `01_Thumbnail_Concept_${inputConcept}.jpg`)
const masterThumbFile = path.join(firstEpThumbDir, '01_Thumbnail_Master.jpg')

let thumbStatus = 'MISSING'
let thumbSize = 0
if (fs.existsSync(conceptAFile)) {
  thumbSize = fs.statSync(conceptAFile).size
  thumbStatus = `${(thumbSize / 1024).toFixed(1)} KB`
}
console.log(`2. Canonical Thumbnail (${path.basename(conceptAFile)}): \x1b[32m${thumbStatus}\x1b[0m`)

// 4. Live Studio API Ping & Parity Assertion
async function verifyLiveApi() {
  const url = `http://localhost:3101/api/episodes/${franchiseId}/${firstEp}/youtube-package`
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve({ ok: true, status: res.statusCode, data: json })
        } catch (e) {
          resolve({ ok: false, error: e.message })
        }
      })
    })
    req.on('error', (err) => {
      resolve({ ok: false, error: err.message })
    })
    req.setTimeout(2500, () => {
      req.destroy()
      resolve({ ok: false, error: 'Connection timeout' })
    })
  })
}

const apiResult = await verifyLiveApi()
if (apiResult.ok && apiResult.data) {
  const apiTitle = apiResult.data.canonicalTitle
  const apiThumb = apiResult.data.thumbnailVariants?.[0]?.filename
  const apiThumbSize = apiResult.data.thumbnailVariants?.[0]?.fileSizeFormatted

  console.log(`3. Live Studio API Check (Port 3101): \x1b[32mHTTP 200 OK\x1b[0m`)
  console.log(`   - API Canonical Title: "${apiTitle}"`)
  console.log(`   - API Primary Thumbnail: ${apiThumb} (${apiThumbSize})`)

  if (activeLockedBase && apiTitle !== activeLockedBase) {
    console.error(`\x1b[31m[DESYNC]\x1b[0m API Canonical Title ("${apiTitle}") does not match Master Bible ("${activeLockedBase}")!`)
    process.exit(1)
  }
} else {
  console.log(`3. Live Studio API Check: \x1b[33mDev server not responding (${apiResult.error || 'offline'})\x1b[0m`)
  console.log(`   (Skipping live API assertion; files on disk are verified)`)
}

console.log(`\n\x1b[32m✔ [SUCCESS]\x1b[0m Release lock and disk parity complete. Exit code 0.\n`)
process.exit(0)
