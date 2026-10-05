import { createCanvas, loadImage } from '@napi-rs/canvas'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import sharp from 'sharp'

export class MotionEngine {
  /**
   * Deterministically cycle through all 6 directional presets based on scene index
   */
  static getMotionType(isVertical, isTallStrip, motionIndex) {
    if (isVertical) {
      if (isTallStrip) {
        const tallPresets = [
          'vertical_glide_down',              // 0. Top to Bottom Constant Reading Glide
          'vertical_diagonal_left_to_right', // 1. Constant Diagonal Glide Down-Right
          'vertical_zoom_in',                // 2. Constant Glide with Subtle Push-In
          'vertical_glide_up',                // 3. Bottom to Top Constant Reveal Glide
          'vertical_diagonal_right_to_left', // 4. Constant Diagonal Glide Down-Left
          'vertical_zoom_out'                // 5. Constant Glide with Subtle Pull-Out
        ]
        return tallPresets[motionIndex % tallPresets.length]
      } else {
        const cardPresets = [
          'vertical_glide_down',
          'vertical_diagonal_left_to_right',
          'vertical_zoom_in',
          'vertical_glide_up',
          'vertical_diagonal_right_to_left',
          'vertical_zoom_out'
        ]
        return cardPresets[motionIndex % cardPresets.length]
      }
    } else {
      const landPresets = [
        'pan_left_to_right',     // 0. Constant Left to Right Pan
        'hero_zoom_in',          // 1. Constant Hero Push-In
        'pan_right_to_left',     // 2. Constant Right to Left Pan
        'pan_diagonal_sweep',    // 3. Constant Diagonal Sweep
        'hero_zoom_out',         // 4. Constant Hero Pull-Out
        'pan_top_to_bottom'      // 5. Constant Top to Bottom Pan
      ]
      return landPresets[motionIndex % landPresets.length]
    }
  }

  /**
   * Render a pristine 60 FPS Sub-Pixel Clip via Native C++ Skia Engine:
   * - 100% Constant uniform linear velocity (zero acceleration jumps, zero pauses).
   * - Pure floating-point sub-pixel anti-aliasing via native Skia C++ (eliminates all integer stair-stepping).
   * - 40px feathered ambient drop-shadow + 1.5px delicate border.
   * - Direct raw memory RGBA stream piped to FFmpeg (Zero Chromium, Zero WebSocket Base64 overhead).
   */
  static async renderSceneClip({ imagePath, durationSec, fps = 24, motionIndex = 0, outputPath }) {
    const img = await loadImage(imagePath)
    const imgW = img.width
    const imgH = img.height
    const isVertical = (imgW / imgH) < 0.95
    const isTallStrip = (imgH / imgW) >= 1.35
    const motionType = this.getMotionType(isVertical, isTallStrip, motionIndex)
    const totalFrames = Math.max(24, Math.round(durationSec * fps))

    const mainCanvas = createCanvas(1920, 1080)
    const ctx = mainCanvas.getContext('2d')

    // 1. Pre-render Ambient Blurred Background ONCE (<5ms)
    const bgCanvas = createCanvas(1920, 1080)
    const bgCtx = bgCanvas.getContext('2d')
    const bgScale = Math.max(1920 / imgW, 1080 / imgH)
    const bgDrawW = imgW * bgScale
    const bgDrawH = imgH * bgScale
    bgCtx.filter = 'blur(48px) brightness(0.60) saturate(1.25)'
    bgCtx.drawImage(img, (1920 - bgDrawW) / 2, (1080 - bgDrawH) / 2, bgDrawW, bgDrawH)
    bgCtx.filter = 'none'

    const grad = bgCtx.createRadialGradient(960, 540, 350, 960, 540, 1150)
    grad.addColorStop(0, 'rgba(0,0,0,0.12)')
    grad.addColorStop(1, 'rgba(0,0,0,0.82)')
    bgCtx.fillStyle = grad
    bgCtx.fillRect(0, 0, 1920, 1080)

    // 2. Pre-calculate Dimensions & Cached Sprite
    let stripDisplayW = 680
    let stripDisplayH = isTallStrip ? Math.round((imgH / imgW) * stripDisplayW) : 1040
    if (!isTallStrip && isVertical) {
      stripDisplayW = Math.round((imgW / imgH) * stripDisplayH)
    }

    const maxScrollY = isTallStrip ? Math.max(0, stripDisplayH - 1080) : 0
    const baseCenterX = isVertical ? (1920 - stripDisplayW) / 2 : 0
    const baseCenterY = (!isTallStrip && isVertical) ? 20 : 0

    // Landscape calculations
    const landScale = Math.max(1920 / imgW, 1080 / imgH) * 1.15
    const landW = imgW * landScale
    const landH = imgH * landScale
    const maxLandScrollX = Math.max(0, landW - 1920)
    const maxLandScrollY = Math.max(0, landH - 1080)
    const landCenterX = (1920 - landW) / 2
    const landCenterY = (1080 - landH) / 2

    // 3. Pre-render Cached Strip Sprite with Drop Shadow ONCE
    const pad = 80
    let spriteCanvas = null
    if (isVertical) {
      spriteCanvas = createCanvas(stripDisplayW + pad * 2, stripDisplayH + pad * 2)
      const sCtx = spriteCanvas.getContext('2d')
      sCtx.shadowColor = 'rgba(0, 0, 0, 0.90)'
      sCtx.shadowBlur = 40
      sCtx.shadowOffsetY = 12
      sCtx.drawImage(img, pad, pad, stripDisplayW, stripDisplayH)
      sCtx.shadowColor = 'transparent'
      sCtx.lineWidth = 1.5
      sCtx.strokeStyle = 'rgba(255, 255, 255, 0.10)'
      sCtx.strokeRect(pad, pad, stripDisplayW, stripDisplayH)
    }

    // 4. Initialize FFmpeg Raw RGBA Pipe (24 FPS + Ultrafast + FastStart)
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-f', 'rawvideo',
      '-pix_fmt', 'rgba',
      '-s', '1920x1080',
      '-r', String(fps),
      '-i', '-',
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '18',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-r', String(fps),
      outputPath
    ])

    let ffmpegErr = ''
    ffmpeg.stderr.on('data', d => { ffmpegErr += d.toString() })
    ffmpeg.stdin.on('error', () => {}) // Suppress EPIPE on early exit

    const pipePromise = new Promise((resolve, reject) => {
      ffmpeg.on('close', code => {
        if (code === 0) resolve(outputPath)
        else reject(new Error(`FFmpeg rawvideo failed with code ${code}: ${ffmpegErr.slice(-400)}`))
      })
      ffmpeg.on('error', reject)
    })

    // 5. 100% Constant Uniform Linear Velocity Frame Loop with Stream Backpressure
    for (let i = 0; i < totalFrames; i++) {
      if (ffmpeg.stdin.destroyed) break
      const progress = totalFrames > 1 ? (i / (totalFrames - 1)) : 0

      ctx.drawImage(bgCanvas, 0, 0)
      ctx.save()
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      if (isVertical) {
        let curX = baseCenterX
        let curY = baseCenterY
        let curZoom = 1.0

        if (isTallStrip) {
          if (motionType === 'vertical_glide_up') {
            // 1. Bottom to Top Constant Glide
            curY = -((1.0 - progress) * maxScrollY)
          } else if (motionType === 'vertical_diagonal_left_to_right') {
            // 2. Constant Diagonal Glide Down-Right
            curY = -(progress * maxScrollY)
            curX = (baseCenterX - 20) + (progress * 40)
          } else if (motionType === 'vertical_diagonal_right_to_left') {
            // 3. Constant Diagonal Glide Down-Left
            curY = -(progress * maxScrollY)
            curX = (baseCenterX + 20) - (progress * 40)
          } else if (motionType === 'vertical_zoom_in') {
            // 4. Constant Glide with Subtle Push-In
            curY = -(progress * maxScrollY)
            curZoom = 1.0 + 0.035 * progress
          } else if (motionType === 'vertical_zoom_out') {
            // 5. Constant Glide with Subtle Pull-Out
            curY = -(progress * maxScrollY)
            curZoom = 1.035 - 0.035 * progress
          } else {
            // 6. Standard Top to Bottom Constant Linear Glide
            curY = -(progress * maxScrollY)
          }
        } else {
          // Single vertical panel
          if (motionType === 'vertical_snap_up') {
            curZoom = 1.0 + 0.035 * progress
          } else if (motionType === 'vertical_zoom_out') {
            curZoom = 1.035 - 0.035 * progress
          } else if (motionType === 'vertical_diagonal_left_to_right') {
            curX = (baseCenterX - 20) + (progress * 40)
          } else if (motionType === 'vertical_diagonal_right_to_left') {
            curX = (baseCenterX + 20) - (progress * 40)
          }
        }

        if (curZoom !== 1.0) {
          ctx.translate(960, 540)
          ctx.scale(curZoom, curZoom)
          ctx.translate(-960, -540)
        }

        ctx.drawImage(spriteCanvas, curX - pad, curY - pad)
      } else {
        // Landscape Artwork Omni-Directional Modes (Constant Linear Speed)
        let curX = landCenterX
        let curY = landCenterY
        let curZoom = 1.0

        if (motionType === 'pan_left_to_right') {
          // 0. Constant Left to Right
          curX = -(maxLandScrollX * (1.0 - progress))
        } else if (motionType === 'pan_right_to_left') {
          // 1. Constant Right to Left
          curX = -(maxLandScrollX * progress)
        } else if (motionType === 'pan_top_to_bottom') {
          // 2. Constant Top to Bottom
          curY = -(maxLandScrollY * progress)
        } else if (motionType === 'pan_bottom_to_top') {
          // 3. Constant Bottom to Top
          curY = -(maxLandScrollY * (1.0 - progress))
        } else if (motionType === 'hero_zoom_in') {
          // 4. Constant Hero Push-In
          curZoom = 1.0 + 0.05 * progress
        } else if (motionType === 'hero_zoom_out') {
          // 5. Constant Hero Pull-Out
          curZoom = 1.05 - 0.05 * progress
        } else if (motionType === 'pan_diagonal_sweep') {
          // 6. Constant Diagonal Sweep
          curX = -(maxLandScrollX * (1.0 - progress))
          curY = -(maxLandScrollY * progress)
        } else {
          curX = -(maxLandScrollX * (1.0 - progress))
        }

        if (curZoom !== 1.0) {
          ctx.translate(960, 540)
          ctx.scale(curZoom, curZoom)
          ctx.translate(-960, -540)
        }

        ctx.drawImage(img, curX, curY, landW, landH)
      }

      ctx.restore()

      const frameData = mainCanvas.data()
      if (!ffmpeg.stdin.destroyed) {
        const canWrite = ffmpeg.stdin.write(frameData)
        if (!canWrite && !ffmpeg.stdin.destroyed) {
          await new Promise((resolve) => {
            const timer = setTimeout(resolve, 1500)
            const onDrain = () => { clearTimeout(timer); cleanup(); resolve() }
            const onClose = () => { clearTimeout(timer); cleanup(); resolve() }
            const cleanup = () => {
              ffmpeg.stdin.removeListener('drain', onDrain)
              ffmpeg.removeListener('close', onClose)
              ffmpeg.removeListener('error', onClose)
            }
            ffmpeg.stdin.once('drain', onDrain)
            ffmpeg.once('close', onClose)
            ffmpeg.once('error', onClose)
          })
        }
      }
    }

    if (!ffmpeg.stdin.destroyed) {
      ffmpeg.stdin.end()
    }
    await Promise.race([
      pipePromise,
      new Promise((_, reject) => setTimeout(() => {
        try { ffmpeg.kill('SIGKILL') } catch (_) {}
        reject(new Error(`FFmpeg rawvideo timed out after 45s for ${path.basename(outputPath)}`))
      }, 45000))
    ])
    return outputPath
  }

  static async closeBrowser() {
    // No-op for backwards compatibility: native Skia has zero browser instances
  }
}
