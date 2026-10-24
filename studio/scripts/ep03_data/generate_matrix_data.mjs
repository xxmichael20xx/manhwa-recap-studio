import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { scriptScenes } from './generate_ep03_script.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('Total script scenes loaded:', scriptScenes.length)
