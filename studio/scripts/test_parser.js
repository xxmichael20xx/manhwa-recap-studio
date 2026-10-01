import fs from 'fs'
import path from 'path'

const projectRoot = 'C:/Users/MIchaelangelo/Documents/My Brand/02_Ventures & Digital Products/Manhwa Recap Studio'
const scriptPath = path.join(projectRoot, '01_Franchises/Series_01_The_Sovereign_Protocol/EP01_Awakening_and_Catacombs/01_Episode_Script.md')

const scriptContent = fs.readFileSync(scriptPath, 'utf-8')
const inlineRegex = /\[(IMG_\d+)\][`\s]*([^\[\n\r]+)/g
const extractedBeats = []
let m
while ((m = inlineRegex.exec(scriptContent)) !== null) {
  extractedBeats.push({
    tag: m[1].toUpperCase(),
    text: m[2].replace(/`/g, '').trim()
  })
}

console.log('Total Extracted Beats from Script:', extractedBeats.length)
console.log('First 5 beats:', JSON.stringify(extractedBeats.slice(0, 5), null, 2))
