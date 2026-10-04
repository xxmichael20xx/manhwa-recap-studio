import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imgDir = "C:\\Users\\MIchaelangelo\\Documents\\My Brand\\02_Ventures & Digital Products\\Manhwa Recap Studio\\01_Franchises\\Series_01_The_Singularity_Protocol\\EP01_The_Double_FRank_Anomaly\\images";
const backupDir = path.join(imgDir, '..', 'images_original_backup');

if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const auditJsonPath = "C:\\Users\\MIchaelangelo\\.gemini\\antigravity\\brain\\35b3a359-df0f-430c-8756-3d2d6553e21d\\scratch\\image_audit.json";
const rawJson = fs.readFileSync(auditJsonPath, 'utf8').replace(/^\uFEFF/, '');
const auditData = JSON.parse(rawJson);

console.log(`Starting image perimeter clean-up across ${auditData.length} images...`);

let cleanedCount = 0;

for (const item of auditData) {
    const filePath = path.join(imgDir, item.Image);
    const backupPath = path.join(backupDir, item.Image);

    if (!fs.existsSync(filePath)) continue;

    // Create backup if not already backed up
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
    }

    // Check if this image has top/bottom perimeter clutter or filenames
    const hasPerimeterIssue = item.HasFileName || item.HasTopHeader || item.HasBottomText;

    if (hasPerimeterIssue) {
        const metadata = await sharp(backupPath).metadata();
        const width = metadata.width;
        const height = metadata.height;

        // Calculate trim margins based on detected text positions
        let topTrimPercent = 0.0;
        let bottomTrimPercent = 0.0;

        if (item.HasTopHeader || (item.TopText && item.TopText.length > 0)) {
            topTrimPercent = 0.06; // 6% top crop to remove top banner text/filenames
        }
        if (item.HasFileName || item.HasBottomText || (item.BottomText && item.BottomText.length > 0)) {
            bottomTrimPercent = 0.06; // 6% bottom crop to remove bottom filenames/timestamps
        }

        const topCropPx = Math.floor(height * topTrimPercent);
        const bottomCropPx = Math.floor(height * bottomTrimPercent);
        const newHeight = height - topCropPx - bottomCropPx;
        const newWidth = width;

        // Crop out the top/bottom clutter and resize smoothly back to standard 1080x1920 (9:16)
        const cleanedBuffer = await sharp(backupPath)
            .extract({ left: 0, top: topCropPx, width: newWidth, height: newHeight })
            .resize(1080, 1920, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
            .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
            .toBuffer();

        fs.writeFileSync(filePath, cleanedBuffer);
        cleanedCount++;
        console.log(`[CLEANED] ${item.Image} (TopTrim: -${topCropPx}px, BottomTrim: -${bottomCropPx}px)`);
    }
}

console.log(`\nSuccessfully cleaned ${cleanedCount} images! Original unedited files preserved in: images_original_backup/`);
