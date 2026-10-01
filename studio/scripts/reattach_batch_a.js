import fs from 'fs'
import path from 'path'

const srcDir = 'C:\\Users\\MIchaelangelo\\Downloads\\download (13)'
const destDir = 'C:\\Users\\MIchaelangelo\\Documents\\My Brand\\02_Ventures & Digital Products\\Manhwa Recap Studio\\01_Franchises\\Series_01_The_Sovereign_Protocol\\EP01_Awakening_and_Catacombs\\images'

const files = fs.readdirSync(srcDir)

const mappingDefs = [
  { prefix: 'Man_carrying_rig_in_dungeon', tag: 'IMG_001' },
  { prefix: 'Man_walking_in_subterranean_dungeon', tag: 'IMG_002' },
  { prefix: 'Man_walking_in_dungeon', tag: 'IMG_003' },
  { prefix: 'Man_standing_amid_celebrating_team', tag: 'IMG_004' },
  { prefix: 'Character_standing_amidst_celebr', tag: 'IMG_005' },
  { prefix: 'Bandaged_hands_glowing_grey', tag: 'IMG_006' },
  { prefix: 'Bandaged_arms_glowing_grey', tag: 'IMG_007' },
  { prefix: 'Character_trudging_through_heavy', tag: 'IMG_008' },
  { prefix: 'Man_trudging_through_rain', tag: 'IMG_009' },
  { prefix: 'Man_walking_in_rain', tag: 'IMG_010' },
  { prefix: 'Aristocratic_nobles_whispering', tag: 'IMG_011' },
  { prefix: 'Aristocrats_in_imperial_banquet', tag: 'IMG_012' },
  { prefix: 'Noblewoman_standing_under_chande', tag: 'IMG_013' },
  { prefix: 'Hand_tossing_silver_ring', tag: 'IMG_014' },
  { prefix: 'Woman_tossing_silver_engagement', tag: 'IMG_015' },
  { prefix: 'Ring_bouncing_against_combat_boot', tag: 'IMG_016' },
  { prefix: 'Ring_bouncing_on_combat_boot', tag: 'IMG_017' },
  { prefix: 'Captain_holding_golden_wine_goblet', tag: 'IMG_018' },
  { exact: 'Armored_man_holding_wine_goblet_20261001125844.jpg', tag: 'IMG_019' },
  { exact: 'Armored_man_holding_wine_goblet_20261001125844_2.jpg', tag: 'IMG_020' },
  { exact: 'Armored_man_holding_wine_goblet_20261001125844_3.jpg', tag: 'IMG_021' },
  { prefix: 'Man_and_woman_in_ballroom', tag: 'IMG_022' },
  { exact: 'Man_draping_arm_over_woman_20261001125844.jpg', tag: 'IMG_023' },
  { exact: 'Man_draping_arm_over_woman_20261001125844_2.jpg', tag: 'IMG_024' }
]

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

// First clean destDir completely
const old = fs.readdirSync(destDir)
old.forEach(f => fs.unlinkSync(path.join(destDir, f)))
console.log(`Cleaned ${old.length} old files from images/`)

mappingDefs.forEach(def => {
  const matchFile = files.find(f => {
    if (def.exact) return f === def.exact
    if (def.prefix) return f.startsWith(def.prefix)
    return false
  })

  if (!matchFile) {
    console.error(`ERROR: No matching file found for ${def.tag} (${def.prefix || def.exact})`)
    return
  }

  const src = path.join(srcDir, matchFile)
  const dest1 = path.join(destDir, `${def.tag}.jpg`)
  const dest2 = path.join(destDir, `${def.tag.replace('_', '')}.jpg`)
  fs.copyFileSync(src, dest1)
  fs.copyFileSync(src, dest2)
  console.log(`Attached ${matchFile} -> ${def.tag}.jpg & ${def.tag.replace('_', '')}.jpg`)
})

const finalFiles = fs.readdirSync(destDir)
console.log(`Total files in images/: ${finalFiles.length}`)
