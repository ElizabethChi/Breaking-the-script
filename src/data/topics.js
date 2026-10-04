import { HOME_QUERIES } from './heroSlots.js';

// Topic labels keep the reference capitalisation. Each topic maps to one or more Openverse queries.
export const TOPICS = [
  { label: 'All', queries: HOME_QUERIES, home: true },
  { label: 'wallpaper', queries: ['phone wallpaper', 'abstract wallpaper'] },
  { label: 'Love', queries: ['love romantic', 'couple love photography'] },
  { label: 'Blue', queries: ['blue aesthetic', 'blue portrait'] },
  { label: 'Blue wallpapers', queries: ['blue wallpaper', 'blue abstract background'] },
  { label: 'Photography techniques', queries: ['photography long exposure', 'photography composition'] },
  { label: 'Film photography tips', queries: ['35mm film photography', 'analog film portrait'] },
  { label: 'Black men street fashion', queries: ['black man street fashion', 'streetwear style men'] },
  { label: 'Patterns design', queries: ['pattern design', 'geometric pattern design'] },
  { label: 'Patterns', queries: ['seamless pattern', 'textile pattern'] },
  { label: 'Ankara dress styles', queries: ['ankara dress', 'african print fashion'] },
  { label: 'Diy crafts for gifts', queries: ['diy gift craft', 'handmade gift ideas'] },
  { label: 'Deep questions to ask', queries: ['question mark thinking', 'conversation questions'] },
];
