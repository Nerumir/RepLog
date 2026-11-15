export interface BiomePalette {
  groundTop: string;
  groundBottom: string;
  road: string;
  roadLine: string;
  npcOutfit: string;
  npcBulk: number;
}

// Ordre : Prairie, Forêt, Toundra, Désert, Volcan, Valhalla — carrure des PNJ croissante.
export const BIOME_PALETTES: BiomePalette[] = [
  {
    groundTop: '#BEE9A6',
    groundBottom: '#8FD35C',
    road: '#D8C08A',
    roadLine: '#C3A868',
    npcOutfit: '#4D9E4B',
    npcBulk: 0.15,
  },
  {
    groundTop: '#7FBF94',
    groundBottom: '#3F7A4E',
    road: '#A98A5C',
    roadLine: '#8A6E45',
    npcOutfit: '#2E5C3E',
    npcBulk: 0.32,
  },
  {
    groundTop: '#F3FAFF',
    groundBottom: '#CFE6F5',
    road: '#C8D8E2',
    roadLine: '#9FB8C7',
    npcOutfit: '#6B8CAE',
    npcBulk: 0.48,
  },
  {
    groundTop: '#F3D08B',
    groundBottom: '#D1A054',
    road: '#C98E4B',
    roadLine: '#A9733A',
    npcOutfit: '#B5733A',
    npcBulk: 0.64,
  },
  {
    groundTop: '#4A2430',
    groundBottom: '#2B1812',
    road: '#5B3A30',
    roadLine: '#E8572E',
    npcOutfit: '#3B2320',
    npcBulk: 0.8,
  },
  {
    groundTop: '#5B3B8C',
    groundBottom: '#2B1B4E',
    road: '#E7D08A',
    roadLine: '#C9A646',
    npcOutfit: '#8C2F39',
    npcBulk: 0.98,
  },
];
