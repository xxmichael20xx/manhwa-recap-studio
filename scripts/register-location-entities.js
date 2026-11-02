import fs from 'fs';
import path from 'path';

const studioRoot = 'C:/Users/MIchaelangelo/Documents/My Brand/02_Ventures & Digital Products/Manhwa Recap Studio';
const franchiseDir = `${studioRoot}/01_Franchises/Series_05_The_Fourth_Magius`;
const entsPath = `${franchiseDir}/vault/entities.json`;
const zonesPath = `${franchiseDir}/vault/zones.json`;

const ents = JSON.parse(fs.readFileSync(entsPath, 'utf8'));
const zones = JSON.parse(fs.readFileSync(zonesPath, 'utf8'));

const locationSpecs = [
  {
    id: 'oakhaven_apothecary_loft',
    token: '@{Oakhaven Apothecary Loft}',
    name: 'Oakhaven Apothecary Loft',
    plate: 'character_vault/10_Location_Oakhaven_Apothecary_Loft.jpg'
  },
  {
    id: 'rowan_apothecary_shop',
    token: '@{Rowan Apothecary Shop}',
    name: 'Rowan Apothecary Shop',
    plate: 'character_vault/11_Location_Rowan_Apothecary_Shop.jpg'
  },
  {
    id: 'white_dimension_library',
    token: '@{The White Dimension Library}',
    name: 'The White Dimension Library',
    plate: 'character_vault/12_Location_White_Dimension_Library.jpg'
  },
  {
    id: 'blackwood_forest_clearing',
    token: '@{Blackwood Forest Clearing}',
    name: 'Blackwood Forest Clearing',
    plate: 'character_vault/13_Location_Blackwood_Forest_Clearing.jpg'
  },
  {
    id: 'oakhaven_perimeter_gate',
    token: '@{Oakhaven Perimeter Gate}',
    name: 'Oakhaven Perimeter Gate',
    plate: 'character_vault/14_Location_Oakhaven_Perimeter_Gate.jpg'
  },
  {
    id: 'oakhaven_apothecary_courtyard',
    token: '@{Oakhaven Apothecary Rear Courtyard}',
    name: 'Oakhaven Apothecary Rear Courtyard',
    plate: 'character_vault/15_Location_Apothecary_Courtyard.jpg'
  }
];

for (const loc of locationSpecs) {
  const zoneObj = zones[loc.id];
  const cleanCanon = (zoneObj?.canon || loc.name).trim().replace(/\.$/, '');
  ents[loc.id] = {
    id: loc.id,
    kind: 'location',
    token: loc.token,
    aliases: [
      loc.name,
      `Location: ${loc.name}`,
      loc.token.replace(/^@\{|\}$/g, '')
    ],
    status: 'approved',
    age_class: 'non_living',
    dna: cleanCanon,
    plate: loc.plate,
    episodes: ['EP01', 'EP02_The_Painless_Crafts_and_The_Agony_of_Magic']
  };
}

fs.writeFileSync(entsPath, JSON.stringify(ents, null, 2), 'utf8');
console.log(`Registered ${locationSpecs.length} location entities in ${entsPath}. Total entities: ${Object.keys(ents).length}`);
