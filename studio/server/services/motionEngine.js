import puppeteer from 'puppeteer-core'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import sharp from 'sharp'

export class MotionEngine {
  static browserInstance = null

  static getEdgePath() {
    const candidates = [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
    ]
    for (const c of candidates) {
      if (fsSync.existsSync(c)) return c
    }
    return candidates[0]
  }

  static async getBrowser() {
    if (!this.browserInstance || !this.browserInstance.connected) {
      const execPath = this.getEdgePath()
      this.browserInstance = await puppeteer.launch({
        executablePath: execPath,
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--enable-gpu-rasterization',
          '--enable-zero-copy',
          '--ignore-gpu-blocklist',
          '--use-gl=angle',
          '--use-angle=d3d11'
        ]
      })
    }
    return this.browserInstance
  }

  static async closeBrowser() {
    if (this.browserInstance) {
      try {
        await this.browserInstance.close()
      } catch (e) {}
      this.browserInstance = null
    }
  }

  static getRendererHTML() {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; background: #07090e; overflow: hidden; }
        canvas { width: 1920px; height: 1080px; display: block; }
      </style>
    </head>
    <body>
      <canvas id="c" width="1920" height="1080"></canvas>
      <script>
        window.renderSceneFrames = function(dataUri, totalFrames, motionType) {
          return new Promise((resolve) => {
            const canvas = document.getElementById('c');
            const ctx = canvas.getContext('2d', { alpha: false });

            const img = new Image();
            img.onload = () => {
              const imgW = img.naturalWidth;
              const imgH = img.naturalHeight;
              const isVertical = (imgW / imgH) < 0.95;
              const isTallStrip = (imgH / imgW) >= 1.35;

              // Pre-render ambient blurred background
              const bgCanvas = document.createElement('canvas');
              bgCanvas.width = 1920;
              bgCanvas.height = 1080;
              const bgCtx = bgCanvas.getContext('2d', { alpha: false });
              
              const bgScale = Math.max(1920 / imgW, 1080 / imgH);
              const bgDrawW = imgW * bgScale;
              const bgDrawH = imgH * bgScale;
              const bgDrawX = (1920 - bgDrawW) / 2;
              const bgDrawY = (1080 - bgDrawH) / 2;

              bgCtx.filter = 'blur(48px) brightness(0.60) saturate(1.25)';
              bgCtx.drawImage(img, bgDrawX, bgDrawY, bgDrawW, bgDrawH);
              bgCtx.filter = 'none';
              
              const grad = bgCtx.createRadialGradient(960, 540, 350, 960, 540, 1150);
              grad.addColorStop(0, 'rgba(0,0,0,0.12)');
              grad.addColorStop(1, 'rgba(0,0,0,0.82)');
              bgCtx.fillStyle = grad;
              bgCtx.fillRect(0, 0, 1920, 1080);

              let stripDisplayW = 680;
              let stripDisplayH = isTallStrip ? Math.round((imgH / imgW) * stripDisplayW) : 1040;
              if (!isTallStrip && isVertical) {
                stripDisplayW = Math.round((imgW / imgH) * stripDisplayH);
              }
              const maxScrollY = isTallStrip ? Math.max(0, stripDisplayH - 1080) : 0;
              const baseCenterX = isVertical ? (1920 - stripDisplayW) / 2 : 0;
              const baseCenterY = (!isTallStrip && isVertical) ? 20 : 0;

              // Landscape calculations
              const landScale = Math.max(1920 / imgW, 1080 / imgH);
              const landW = imgW * landScale;
              const landH = imgH * landScale;
              const maxLandScrollX = Math.max(0, landW - 1920);
              const maxLandScrollY = Math.max(0, landH - 1080);
              const landCenterX = (1920 - landW) / 2;
              const landCenterY = (1080 - landH) / 2;

              const framesBase64 = [];

              for (let i = 0; i < totalFrames; i++) {
                // 100% Constant Uniform Linear Velocity: Equal delta on every single frame from frame 0 to frame N
                const linearProgress = totalFrames > 1 ? (i / (totalFrames - 1)) : 0;

                ctx.drawImage(bgCanvas, 0, 0);

                ctx.save();
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                if (isVertical) {
                  let curX = baseCenterX;
                  let curY = baseCenterY;
                  let curZoom = 1.0;

                  if (isTallStrip) {
                    if (motionType === 'vertical_snap_up') {
                      // 1. Bottom to Top Constant Linear Glide
                      curY = -((1.0 - linearProgress) * maxScrollY);
                    } else if (motionType === 'vertical_diagonal_left_to_right') {
                      // 2. Constant Diagonal Glide Down-Right
                      curY = -(linearProgress * maxScrollY);
                      curX = (baseCenterX - 20) + (linearProgress * 40);
                    } else if (motionType === 'vertical_diagonal_right_to_left') {
                      // 3. Constant Diagonal Glide Down-Left
                      curY = -(linearProgress * maxScrollY);
                      curX = (baseCenterX + 20) - (linearProgress * 40);
                    } else if (motionType === 'vertical_zoom_in') {
                      // 4. Constant Glide with Subtle Push-In
                      curY = -(linearProgress * maxScrollY);
                      curZoom = 1.0 + 0.035 * linearProgress;
                    } else if (motionType === 'vertical_zoom_out') {
                      // 5. Constant Glide with Subtle Pull-Out
                      curY = -(linearProgress * maxScrollY);
                      curZoom = 1.035 - 0.035 * linearProgress;
                    } else {
                      // 6. Standard Top to Bottom Constant Linear Glide
                      curY = -(linearProgress * maxScrollY);
                    }
                  } else {
                    // Single vertical panel
                    if (motionType === 'vertical_snap_up') {
                      curZoom = 1.0 + 0.035 * linearProgress;
                    } else if (motionType === 'vertical_zoom_out') {
                      curZoom = 1.035 - 0.035 * linearProgress;
                    } else if (motionType === 'vertical_diagonal_left_to_right') {
                      curX = (baseCenterX - 20) + (linearProgress * 40);
                    } else if (motionType === 'vertical_diagonal_right_to_left') {
                      curX = (baseCenterX + 20) - (linearProgress * 40);
                    }
                  }

                  ctx.translate(960, 540);
                  ctx.scale(curZoom, curZoom);
                  ctx.translate(-960, -540);

                  // Skia sub-pixel floating-point antialiasing + rich ambient drop shadow
                  ctx.shadowColor = 'rgba(0, 0, 0, 0.90)';
                  ctx.shadowBlur = 40;
                  ctx.shadowOffsetX = 0;
                  ctx.shadowOffsetY = 12;

                  ctx.drawImage(img, curX, curY, stripDisplayW, stripDisplayH);

                  ctx.shadowColor = 'transparent';
                  ctx.lineWidth = 1.5;
                  ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
                  ctx.strokeRect(curX, curY, stripDisplayW, stripDisplayH);
                } else {
                  // Landscape Artwork Omni-Directional Modes (Constant Linear Speed)
                  let curX = landCenterX;
                  let curY = landCenterY;
                  let curZoom = 1.0;

                  if (motionType === 'pan_left_to_right') {
                    // 1. Constant Left to Right
                    curX = -(maxLandScrollX * (1.0 - linearProgress));
                  } else if (motionType === 'pan_right_to_left') {
                    // 2. Constant Right to Left
                    curX = -(maxLandScrollX * linearProgress);
                  } else if (motionType === 'pan_top_to_bottom') {
                    // 3. Constant Top to Bottom
                    curY = -(maxLandScrollY * linearProgress);
                  } else if (motionType === 'pan_bottom_to_top') {
                    // 4. Constant Bottom to Top
                    curY = -(maxLandScrollY * (1.0 - linearProgress));
                  } else if (motionType === 'hero_zoom_in') {
                    // 5. Constant Hero Push-In
                    curZoom = 1.0 + 0.05 * linearProgress;
                  } else if (motionType === 'hero_zoom_out') {
                    // 6. Constant Hero Pull-Out
                    curZoom = 1.05 - 0.05 * linearProgress;
                  } else if (motionType === 'pan_diagonal_sweep') {
                    // 7. Constant Diagonal Sweep
                    curX = -(maxLandScrollX * (1.0 - linearProgress));
                    curY = -(maxLandScrollY * linearProgress);
                  } else {
                    curX = -(maxLandScrollX * (1.0 - linearProgress));
                  }

                  ctx.translate(960, 540);
                  ctx.scale(curZoom, curZoom);
                  ctx.translate(-960, -540);

                  ctx.drawImage(img, curX, curY, landW, landH);
                }

                ctx.restore();

                framesBase64.push(canvas.toDataURL('image/jpeg', 0.80).slice(23));
              }

              resolve(framesBase64);
            };
            img.src = dataUri;
          });
        };
      </script>
    </body>
    </html>
    `
  }

  /**
   * Deterministically cycle through all 6 directional presets based on scene index
   */
  static getMotionType(isVertical, isTallStrip, motionIndex) {
    if (isVertical) {
      if (isTallStrip) {
        const tallPresets = [
          'vertical_snap_down',               // Top to Bottom
          'vertical_diagonal_left_to_right',  // Diagonal Top-Left to Bottom-Right
          'vertical_zoom_in',                 // Dramatic Push-In
          'vertical_snap_up',                 // Bottom to Top
          'vertical_diagonal_right_to_left',  // Diagonal Top-Right to Bottom-Left
          'vertical_zoom_out'                 // Contextual Pull-Out
        ]
        return tallPresets[motionIndex % tallPresets.length]
      } else {
        const cardPresets = [
          'vertical_snap_down',
          'vertical_diagonal_left_to_right',
          'vertical_zoom_in',
          'vertical_snap_up',
          'vertical_diagonal_right_to_left',
          'vertical_zoom_out'
        ]
        return cardPresets[motionIndex % cardPresets.length]
      }
    } else {
      const landPresets = [
        'pan_left_to_right',     // Left to Right
        'hero_zoom_in',          // Dramatic Push-In
        'pan_right_to_left',     // Right to Left
        'pan_diagonal_sweep',    // Diagonal Sweep
        'hero_zoom_out',         // Dramatic Pull-Out
        'pan_top_to_bottom'      // Top to Bottom
      ]
      return landPresets[motionIndex % landPresets.length]
    }
  }

  /**
   * Render a pristine 60fps Sub-Pixel Clip via In-Memory Canvas Evaluation (Zero Timeout, High Concurrency)
   */
  static async renderSceneClip({ imagePath, durationSec, fps = 60, motionIndex = 0, outputPath }) {
    const browser = await this.getBrowser()
    const page = await browser.newPage()
    page.setDefaultTimeout(120000)
    page.setDefaultNavigationTimeout(120000)
    await page.setViewport({ width: 1920, height: 1080 })

    try {
      const imageBuf = await fs.readFile(imagePath)
      const mime = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg'
      const dataUri = `data:${mime};base64,${imageBuf.toString('base64')}`

      let meta = { width: 1920, height: 1080 }
      try {
        meta = await sharp(imageBuf).metadata()
      } catch (e) {}

      const isVertical = (meta.width / meta.height) < 0.95
      const isTallStrip = (meta.height / meta.width) >= 1.35
      const motionType = this.getMotionType(isVertical, isTallStrip, motionIndex)
      const totalFrames = Math.max(30, Math.round(durationSec * fps))

      await page.setContent(this.getRendererHTML(), { waitUntil: 'load', timeout: 120000 })
      
      const framesBase64 = await page.evaluate(async (uri, tot, mType) => {
        return await window.renderSceneFrames(uri, tot, mType)
      }, dataUri, totalFrames, motionType)

      const ffmpeg = spawn('ffmpeg', [
        '-y',
        '-f', 'image2pipe',
        '-vcodec', 'mjpeg',
        '-r', String(fps),
        '-i', '-',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '18',
        '-pix_fmt', 'yuv420p',
        '-r', String(fps),
        outputPath
      ])

      let ffmpegErr = ''
      ffmpeg.stderr.on('data', d => { ffmpegErr += d.toString() })

      const pipePromise = new Promise((resolve, reject) => {
        ffmpeg.on('close', code => {
          if (code === 0) resolve(outputPath)
          else reject(new Error(`FFmpeg image2pipe failed with code ${code}: ${ffmpegErr.slice(-400)}`))
        })
        ffmpeg.on('error', reject)
      })

      for (const b64 of framesBase64) {
        ffmpeg.stdin.write(Buffer.from(b64, 'base64'))
      }
      ffmpeg.stdin.end()

      await pipePromise
      return outputPath
    } finally {
      await page.close()
    }
  }
}
