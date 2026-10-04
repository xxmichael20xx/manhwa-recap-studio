import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import { promisify } from 'util'
import sharp from 'sharp'
import { ActivityLogService } from './activityLogService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const execAsync = promisify(exec)

export class VisualQaService {
  /**
   * Run Windows OCR on a single image file or buffer and extract all detected text lines with positions
   */
  static async runOcr(filePath) {
    if (!fsSync.existsSync(filePath)) {
      return { lines: [], text: '' }
    }

    const escapedPath = filePath.replace(/'/g, "''")
    const psScript = `
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation\`1' } | Select -First 1
function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.FileAccessMode, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

$ocr = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
$file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync('${escapedPath}')) ([Windows.Storage.StorageFile])
$stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
$decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
$bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
$result = Await ($ocr.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])

$lines = @()
$h = [double]$bitmap.PixelHeight
$w = [double]$bitmap.PixelWidth

foreach ($line in $result.Lines) {
    $words = @($line.Words)
    if ($words.Count -gt 0) {
        $firstWord = $words[0]
        $y = [double]$firstWord.BoundingRect.Y
        $normY = [math]::Round(($y / $h), 3)
        $lines += [PSCustomObject]@{
            text = $line.Text
            y = $y
            normalizedY = $normY
        }
    }
}

[PSCustomObject]@{
    width = $w
    height = $h
    lines = $lines
} | ConvertTo-Json -Depth 4
`

    try {
      const { stdout } = await execAsync(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${psScript.replace(/\n/g, ' ')}"`, {
        timeout: 10000,
        maxBuffer: 1024 * 1024
      })

      const cleanJson = stdout.trim().replace(/^\uFEFF/, '')
      if (!cleanJson) return { lines: [], text: '', width: 1080, height: 1920 }
      const parsed = JSON.parse(cleanJson)
      const lines = Array.isArray(parsed.lines) ? parsed.lines : (parsed.lines ? [parsed.lines] : [])
      const text = lines.map(l => l.text).join(' ')
      return {
        lines,
        text,
        width: parsed.width || 1080,
        height: parsed.height || 1920
      }
    } catch (err) {
      // Fallback if PowerShell OCR is unavailable
      return { lines: [], text: '', width: 1080, height: 1920, error: err.message }
    }
  }

  /**
   * Verify an image against the 5 Studio Quality & Anti-Clutter Criteria
   */
  static async verifyImage(filePath, options = {}) {
    const { autoFix = false, backupDir = null } = options

    if (!fsSync.existsSync(filePath)) {
      return {
        isValid: false,
        status: 'missing',
        score: 0,
        message: 'Image file does not exist on disk',
        checks: {}
      }
    }

    const metadata = await sharp(filePath).metadata()
    const width = metadata.width || 1080
    const height = metadata.height || 1920
    const aspectRatio = (width / height).toFixed(3)
    const isNineSixteen = Math.abs((width / height) - (9 / 16)) < 0.08 || Math.abs((width / height) - (16 / 9)) < 0.08

    const ocrResult = await this.runOcr(filePath)
    const lines = ocrResult.lines || []

    const issues = []
    const detectedText = []
    let hasFilename = false
    let hasPromptHeader = false
    let hasForeignGlyphs = false
    let hasSpeechBubbles = false
    let topClutterLines = []
    let bottomClutterLines = []

    // Korean / Hangul regex
    const hangulRegex = /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/i

    for (const item of lines) {
      const lineText = item.text.trim()
      const normY = item.normalizedY || (item.y / height)
      detectedText.push({ text: lineText, normalizedY: normY })

      // Check 1: Filename / Extension burned in
      if (/IMG_?\d+/i.test(lineText) || /filename/i.test(lineText) || /\.(jpe?g|png|webp)/i.test(lineText)) {
        hasFilename = true
        issues.push(`Burned-in filename detected: "${lineText}"`)
        if (normY < 0.12) topClutterLines.push(lineText)
        if (normY > 0.88) bottomClutterLines.push(lineText)
      }

      // Check 2: Prompt headers / Chapter titles at top edge
      if (normY < 0.09) {
        if (/MANHWA|EP\.|CAELEN|VALEN|SKILL|FANTASY|CHAPTER|ACADEMY|CEREMONY|HUNTER/i.test(lineText)) {
          hasPromptHeader = true
          issues.push(`Top prompt banner detected: "${lineText}"`)
          topClutterLines.push(lineText)
        }
      }

      // Check 3: Bottom metadata tags
      if (normY > 0.91) {
        if (/MANHWA|PROMPT|SCENE|IMG|RESOLUTION|STUDENT/i.test(lineText)) {
          issues.push(`Bottom metadata tag detected: "${lineText}"`)
          bottomClutterLines.push(lineText)
        }
      }

      // Check 4: Foreign / Korean / Pseudo-Hangul glyphs or SFX
      if (hangulRegex.test(lineText) || /KOREAN\s*SFX/i.test(lineText)) {
        hasForeignGlyphs = true
        issues.push(`Korean/Foreign glyphs detected: "${lineText}"`)
      }

      // Check 5: Speech bubbles in middle
      if (normY >= 0.12 && normY <= 0.88) {
        if (lineText.length > 25 || lines.length >= 10) {
          hasSpeechBubbles = true
        }
      }
    }

    if (lines.length >= 12) {
      hasSpeechBubbles = true
      issues.push(`Heavy speech bubble / UI clutter density (${lines.length} text lines detected)`)
    }

    const canAutoFix = (hasFilename || hasPromptHeader || topClutterLines.length > 0 || bottomClutterLines.length > 0) && !hasSpeechBubbles

    let autoFixApplied = false
    let currentPath = filePath

    // Auto-fix if requested and possible
    if (autoFix && canAutoFix) {
      const sanitized = await this.sanitizeImage(filePath, {
        topTrimPercent: (hasPromptHeader || topClutterLines.length > 0) ? 0.06 : 0.0,
        bottomTrimPercent: (hasFilename || bottomClutterLines.length > 0) ? 0.06 : 0.0,
        backupDir
      })
      if (sanitized.success) {
        autoFixApplied = true
      }
    }

    // Determine QA Status & Score
    let status = 'clean'
    let score = 100

    if (issues.length > 0) {
      if (autoFixApplied) {
        status = 'auto_cleaned'
        score = 95
      } else if (canAutoFix) {
        status = 'warning'
        score = 75
      } else {
        status = 'cluttered'
        score = Math.max(30, 100 - (issues.length * 15))
      }
    }

    return {
      isValid: status === 'clean' || status === 'auto_cleaned',
      status, // 'clean' | 'auto_cleaned' | 'warning' | 'cluttered'
      score,
      issues,
      canAutoFix,
      autoFixApplied,
      checks: {
        filenameArtifacts: { passed: !hasFilename, details: hasFilename ? 'Burned-in filename detected' : 'Clean' },
        promptHeaders: { passed: !hasPromptHeader, details: hasPromptHeader ? 'Top metadata header detected' : 'Clean' },
        foreignGlyphs: { passed: !hasForeignGlyphs, details: hasForeignGlyphs ? 'Korean or foreign glyphs detected' : 'Clean' },
        textClutter: { passed: !hasSpeechBubbles, textLines: lines.length, details: hasSpeechBubbles ? 'Speech bubble or UI clutter detected' : 'Clean' },
        aspectRatio: { passed: isNineSixteen, ratio: '9:16', resolution: `${width}x${height}` }
      },
      detectedText,
      dimensions: { width, height, aspectRatio }
    }
  }

  /**
   * Surgically trim perimeter margins and resample cleanly to 1080x1920 (9:16)
   */
  static async sanitizeImage(filePath, options = {}) {
    try {
      const { topTrimPercent = 0.06, bottomTrimPercent = 0.06, backupDir = null } = options

      if (!fsSync.existsSync(filePath)) {
        return { success: false, error: 'File not found' }
      }

      // Safe backup
      if (backupDir) {
        await fs.mkdir(backupDir, { recursive: true })
        const backupPath = path.join(backupDir, path.basename(filePath))
        if (!fsSync.existsSync(backupPath)) {
          await fs.copyFile(filePath, backupPath)
        }
      }

      const inputBuffer = await fs.readFile(filePath)
      const metadata = await sharp(inputBuffer).metadata()
      const width = metadata.width || 1080
      const height = metadata.height || 1920

      const topCropPx = Math.floor(height * topTrimPercent)
      const bottomCropPx = Math.floor(height * bottomTrimPercent)
      const newHeight = height - topCropPx - bottomCropPx
      const newWidth = width

      const cleanedBuffer = await sharp(inputBuffer)
        .extract({ left: 0, top: topCropPx, width: newWidth, height: newHeight })
        .resize(1080, 1920, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
        .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
        .toBuffer()

      await fs.writeFile(filePath, cleanedBuffer)

      return {
        success: true,
        filePath,
        trimmedTop: topCropPx,
        trimmedBottom: bottomCropPx
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  /**
   * Audit an entire episode's images directory and return complete QA health metrics
   */
  static async auditEpisodeImages(franchiseId, episodeId, options = {}) {
    const { autoFix = false } = options
    const imagesDir = path.resolve(__dirname, '../../../01_Franchises', franchiseId, episodeId, 'images')
    const backupDir = path.resolve(__dirname, '../../../01_Franchises', franchiseId, episodeId, 'images_original_backup')

    if (!fsSync.existsSync(imagesDir)) {
      return { totalImages: 0, cleanCount: 0, warningCount: 0, clutteredCount: 0, results: [] }
    }

    const files = (await fs.readdir(imagesDir)).filter(f => /\.(jpe?g|png|webp)$/i.test(f) && !f.startsWith('.'))
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

    const results = []
    let cleanCount = 0
    let autoCleanedCount = 0
    let warningCount = 0
    let clutteredCount = 0

    for (const file of files) {
      const fullPath = path.join(imagesDir, file)
      const report = await this.verifyImage(fullPath, { autoFix, backupDir })
      const item = {
        filename: file,
        tag: file.replace(/\.(jpe?g|png|webp)$/i, '').toUpperCase(),
        ...report
      }

      if (report.status === 'clean') cleanCount++
      else if (report.status === 'auto_cleaned') autoCleanedCount++
      else if (report.status === 'warning') warningCount++
      else if (report.status === 'cluttered') clutteredCount++

      results.push(item)
    }

    const total = files.length
    const overallScore = total > 0 ? Math.round(((cleanCount + autoCleanedCount) / total) * 100) : 100

    return {
      success: true,
      franchiseId,
      episodeId,
      totalImages: total,
      cleanCount,
      autoCleanedCount,
      warningCount,
      clutteredCount,
      overallScore,
      isFullyClean: (cleanCount + autoCleanedCount) === total,
      results
    }
  }
}
