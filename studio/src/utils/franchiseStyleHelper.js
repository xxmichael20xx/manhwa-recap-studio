/**
 * Franchise Style & Genre Intelligence Helper
 * Dynamically derives art style, architectural constraints, negative style drift,
 * and genre-specific vocabulary per franchise.
 * Eliminates cross-series contamination (e.g. urban streetwear leaking into medieval fantasy).
 * Single Source of Truth (SSOT) architecture for all series metadata.
 */

export const getFranchiseArtStyleDirective = (franchiseId = '', format = '16:9') => {
  const fId = String(franchiseId || '').toLowerCase()
  const aspectDesc = format === '16:9'
    ? '16:9 horizontal widescreen landscape aspect ratio (1920x1080 horizontal full bleed)'
    : '9:16 vertical manhwa aspect ratio (1080x1920 vertical format)'

  if (fId.includes('series_05') || fId.includes('fourth_magius')) {
    return {
      styleName: 'The Crystalline Arcane Bastion (High-Magic Medieval Empire)',
      genreRule: `High fantasy action manhwa webtoon art style, sharp black ink linework, clean elegant lighting, luminous arcane starlight, vibrant high-contrast cel shading, textless ${aspectDesc}. The Crystalline Arcane Bastion of the Valerius Empire: an elegant, light and clean aristocratic high-magic medieval empire built of pale silver granite and luminous raw blue mana crystals. Soaring gothic cathedral spires with glowing star-sapphire crystal tips, stained-glass rose windows, intricate flying buttresses, glowing ethereal cyan magic circles faintly hovering above cathedral domes and spires, sleek silver wyverns soaring gracefully in clear cobalt-blue skies, grand reflective polished marble terraces with multi-tiered crystal water fountains, arched stone viaducts spanning lush green hills, and rustic ancient cedar frontier workshops.`,
      forbiddenRule: `STRICTLY FORBIDDEN STYLE DRIFT: Never generate modern streetwear, hoodies, t-shirts, sneakers, backpacks, denim, modern haircuts, asphalt roads, streetlights, cars, skyscrapers, contemporary cityscapes, or modern tech. All characters must strictly wear period-accurate medieval fantasy attire (rough-spun linen tunics, leather doublets, aristocratic fur-lined velvet coats, high-collared archmage mantles).`,
      crowdRule: `Natural background medieval citizens, servants, and palace guards in soft depth-of-field blur are permitted ONLY in public communal spaces (estate courtyards, grand council chambers, village markets). In private rooms (Rowan Thorne's workshop, private dorm rooms, master suites), enforce strict isolation with zero extraneous background characters.`,
      vocabulary: {
        diegeticScrolls: 'ancient grimoires/spellbooks/scrolls',
        diegeticSignage: 'medieval apothecary/tavern/guild signage',
        diegeticSteles: 'ancient runic steles/monolith inscriptions',
        diegeticUi: 'glowing holographic arcane seals/system panels'
      }
    }
  }

  if (fId.includes('series_04') || fId.includes('billion_year')) {
    return {
      styleName: 'Modern 2025 Urban Cultivation',
      genreRule: `Modern 2025 urban cultivation manhwa webtoon art style, sharp black ink linework, bright high-key lighting, vibrant clean cel shading, cinematic contemporary lighting, textless ${aspectDesc}. Clean modern architecture, university campus pathways, lecture halls, and contemporary cityscapes.`,
      forbiddenRule: `STRICTLY FORBIDDEN STYLE DRIFT: Never generate gloomy dark medieval fantasy, castles, photorealistic 3D CGI renders, live-action photography, oil paintings, or flat Western comic book cartoons.`,
      crowdRule: `Natural background students, pedestrians, and onlookers in soft depth-of-field blur are permitted in public campus/city settings as context requires. Never introduce foreground strangers stealing focus or clone duplicates. Private dorm rooms and confidential chambers remain strictly isolated.`,
      vocabulary: {
        diegeticScrolls: 'ancient cultivation scrolls/jade slips/blueprints',
        diegeticSignage: 'modern storefront/university campus signage',
        diegeticSteles: 'cultivation leaderboard monoliths',
        diegeticUi: 'holographic system status windows'
      }
    }
  }

  if (fId.includes('series_03') || fId.includes('game_architect')) {
    return {
      styleName: 'Fantasy Dungeon Tower & Game Architect',
      genreRule: `High fantasy tower cultivation manhwa webtoon art style, sharp ink linework, high contrast cel shading, vibrant architectural holographic blueprint arrays, textless ${aspectDesc}. Colossal dungeon tower floors, floating stone labyrinth arenas, and mystical chamber architecture.`,
      forbiddenRule: `STRICTLY FORBIDDEN STYLE DRIFT: Never generate modern cars, modern city streetlights, photorealistic 3D CGI renders, or flat Western comic book cartoons.`,
      crowdRule: `Dungeon raid party members, spectators, and guild examinees in soft depth-of-field blur permitted in public tower plazas and examination halls. Private architect workshops remain strictly isolated.`,
      vocabulary: {
        diegeticScrolls: 'architectural blueprint arrays/tomes',
        diegeticSignage: 'tower plaza/guild signage',
        diegeticSteles: 'dungeon monolith stele inscriptions',
        diegeticUi: 'system blueprint diagnostic HUDs'
      }
    }
  }

  if (fId.includes('series_02') || fId.includes('abyssal_regressor') || fId.includes('dungeon_sovereign')) {
    return {
      styleName: 'Dark Fantasy Dungeon Hunter & Regression',
      genreRule: `Dark fantasy dungeon raid manhwa webtoon art style, sharp black ink linework, high contrast dramatic cel shading, kinetic action lighting, textless ${aspectDesc}. Vast subterranean cavern arenas, glowing crystal fissures, ancient ruined dungeon vaults, and rugged hunter outposts.`,
      forbiddenRule: `STRICTLY FORBIDDEN STYLE DRIFT: Never generate flat Western cartoons, casual modern streetwear where tactical armor is required, or photorealistic 3D CGI.`,
      crowdRule: `Hunter association raid members and medical personnel permitted in staging arenas. Boss chambers and private guild vaults remain strictly isolated.`,
      vocabulary: {
        diegeticScrolls: 'hunter license documents/ancient scrolls',
        diegeticSignage: 'hunter outpost/association signage',
        diegeticSteles: 'dungeon gate runic steles',
        diegeticUi: 'hunter status window displays'
      }
    }
  }

  if (fId.includes('series_01') || fId.includes('singularity_protocol')) {
    return {
      styleName: 'Urban Hunter / Sci-Fi Awakening',
      genreRule: `Modern supernatural action hunter manhwa art style, sharp black ink linework, high contrast dramatic lighting, textless ${aspectDesc}. Modern awakened hunter agency facilities, dimensional rift containment zones, and urban dungeon gate perimeters.`,
      forbiddenRule: `STRICTLY FORBIDDEN STYLE DRIFT: Never generate medieval castles or flat Western cartoons.`,
      crowdRule: `Association staff and background hunters permitted in public guild headquarters. Sealed gate containment zones remain strictly isolated.`,
      vocabulary: {
        diegeticScrolls: 'containment logs/dossiers',
        diegeticSignage: 'agency perimeter/hazard signage',
        diegeticSteles: 'dimensional gate marker steles',
        diegeticUi: 'digital agency tactical HUDs'
      }
    }
  }

  // Universal Fallback
  return {
    styleName: 'Universal Manhwa Webtoon',
    genreRule: `High-fidelity action manhwa webtoon art style, sharp black ink linework, dynamic dramatic lighting, vibrant clean cel shading, textless ${aspectDesc}. Setting matching the established series bible.`,
    forbiddenRule: `STRICTLY FORBIDDEN STYLE DRIFT: Never generate photorealistic 3D CGI renders, live-action photography, or flat Western comic book cartoons.`,
    crowdRule: `Natural background crowds in soft depth-of-field blur permitted in public settings as context requires. Private interior spaces remain strictly isolated.`,
    vocabulary: {
      diegeticScrolls: 'in-world scrolls/documents/books',
      diegeticSignage: 'in-world shop/building signage',
      diegeticSteles: 'stone stele/monolith inscriptions',
      diegeticUi: 'glowing holographic system/UI panels'
    }
  }
}

export const getFranchiseDefaultVaultDna = (franchiseId = '', modelName = '') => {
  const fId = String(franchiseId || '').toLowerCase()
  if (fId.includes('series_05') || fId.includes('fourth_magius')) {
    return `${modelName}, dark fantasy action manhwa art style, sharp ink linework, high contrast cel shading, cinematic dramatic lighting, aristocratic high-fantasy medieval attire, textless artwork`
  }
  if (fId.includes('series_04') || fId.includes('billion_year')) {
    return `${modelName}, modern 2025 urban cultivation manhwa webtoon art style, sharp ink linework, bright high-key lighting, vibrant clean cel shading`
  }
  return `${modelName}, modern action manhwa webtoon art style, sharp black ink linework, high contrast cel shading, dynamic lighting, textless artwork`
}
