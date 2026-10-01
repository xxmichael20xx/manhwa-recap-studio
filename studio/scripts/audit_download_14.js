import fs from 'fs'
import path from 'path'

const srcDir = 'C:\\Users\\MIchaelangelo\\Downloads\\download (14)'
const files = fs.readdirSync(srcDir)

const mapping = [
  { tag: 'IMG_001', prefix: 'Character_walking_in_subterranea' },
  { tag: 'IMG_002', exact: 'Man_walking_in_subterranean_dungeon_20261002014938.jpg' },
  { tag: 'IMG_003', exact: 'Man_walking_in_dungeon_20261002014938.jpg' },
  { tag: 'IMG_004', prefix: 'Man_standing_amidst_celebrating' },
  { tag: 'IMG_005', exact: 'Man_standing_near_celebrating_team_20261002014938.jpg' },
  { tag: 'IMG_006', prefix: 'Bandaged_hands_glowing_grey' },
  { tag: 'IMG_007', exact: 'Bandaged_arms_with_glowing_channels_20261002014938.jpg' },
  { tag: 'IMG_008', prefix: 'Person_trudging_through_heavy_rain' },
  { tag: 'IMG_009', exact: 'Man_walking_in_heavy_rain_20261002014938.jpg' },
  { tag: 'IMG_010', exact: 'Man_walking_in_rain_20261002014938.jpg' },
  { tag: 'IMG_011', prefix: 'Aristocrats_attending_banquet_ba' },
  { tag: 'IMG_012', prefix: 'Aristocrats_attending_grand_impe' },
  { tag: 'IMG_013', prefix: 'Noblewoman_standing_under_chande' },
  { tag: 'IMG_014', exact: 'Hand_tossing_silver_ring_20261002014938.jpg' },
  { tag: 'IMG_015', exact: 'Woman_tossing_silver_ring_20261002014938.jpg' },
  { tag: 'IMG_016', exact: 'Ring_bouncing_against_boot_20261002014938.jpg' },
  { tag: 'IMG_017', exact: 'Ring_bouncing_against_combat_boot_20261002014938.jpg' },
  { tag: 'IMG_018', exact: 'Captain_holding_golden_wine_goblet_20261002014938.jpg' },
  { tag: 'IMG_019', exact: 'Armored_captain_holding_wine_goblet_20261002014938.jpg' },
  { tag: 'IMG_020', exact: 'Man_holding_golden_wine_goblet_20261002014938.jpg' },
  { tag: 'IMG_021', exact: 'Man_holding_wine_goblet_20261002014938.jpg' },
  { tag: 'IMG_022', exact: 'Man_and_woman_in_ballroom_20261002014938.jpg' },
  { tag: 'IMG_023', exact: 'Man_and_woman_in_ballroom_20261002014938_2.jpg' },
  { tag: 'IMG_024', exact: 'Marcus_and_Evelyn_in_ballroom_20261002014938.jpg' }
]

console.log('--- Matching Audit for download (14) ---')
let matchedCount = 0
mapping.forEach(m => {
  const f = files.find(file => {
    if (m.exact) return file === m.exact
    if (m.prefix) return file.startsWith(m.prefix)
    return false
  })
  if (f) {
    matchedCount++
    console.log(`✅ ${m.tag} -> ${f}`)
  } else {
    console.log(`❌ MISSING: ${m.tag} (${m.prefix || m.exact})`)
  }
})
console.log(`Total Matched: ${matchedCount} / ${mapping.length}`)
