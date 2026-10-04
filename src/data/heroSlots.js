// The first screen is composed from explicit "slots" so the 7-column layout matches the reference
// rhythm regardless of what the API returns. Heights are in px at the 219px reference column width.
// `qi` indexes HOME_QUERIES; `fallback` is a locally bundled image (or a tile colour) used if the API fails.

export const HOME_QUERIES = [
  'editorial male portrait photography', // 0
  'dramatic black and white portrait', //   1
  'anime character illustration pink', //   2
  '3D stylized character portrait', //      3
  'male fashion streetwear portrait', //    4
  'menswear editorial burgundy suit', //    5
  'colorful illustrated bird poster', //    6
  'yellow background character illustration', // 7
  'teal luxury sports car photography', //  8
  'graphic design portrait poster', //      9
  'purple 3D avatar portrait', //          10
  'cinematic red portrait', //             11
];

const REF_WIDTH = 219;
const base = import.meta.env.BASE_URL;
const local = (n) => `${base}fallback/${n}.jpg`;

// col/row are 0-based. Order below is row-major so narrower layouts still read left-to-right.
const RAW = [
  // row 0
  { col: 0, row: 0, h: 291, qi: 2, fb: { src: local('01'), title: 'Pink character poster' } },
  { col: 1, row: 0, h: 300, qi: 0, fb: { src: local('04'), title: 'Low-key portrait' } },
  { col: 2, row: 0, h: 460, qi: 11, fb: { src: local('07'), title: 'Red character portrait' } },
  { col: 3, row: 0, h: 274, qi: 2, fb: { src: local('09'), title: 'Bearded character on pink' } },
  { col: 4, row: 0, h: 291, qi: 10, fb: { tile: '#7b3ff2', title: 'Purple 3D avatar' }, badge: '3/9' },
  { col: 5, row: 0, h: 329, qi: 0, fb: { tile: '#8b6b4c', title: 'Portrait, brown jacket' } },
  { col: 6, row: 0, h: 389, qi: 4, fb: { tile: '#c8c8c3', title: 'Streetwear mirror photo' } },
  // row 1
  { col: 0, row: 1, h: 328, qi: 7, fb: { src: local('02'), title: 'Portrait on yellow' } },
  { col: 1, row: 1, h: 290, qi: 0, fb: { src: local('05'), title: 'Portrait on orange-red' } },
  { col: 2, row: 1, h: 380, qi: 8, fb: { src: local('08'), title: 'Teal sports car' } },
  { col: 3, row: 1, h: 275, qi: 4, fb: { src: local('10'), title: 'Beanie portrait on gray' } },
  { col: 4, row: 1, h: 330, qi: 1, fb: { tile: '#3b3b3b', title: 'Black and white portrait' }, badge: '3/9' },
  { col: 5, row: 1, h: 390, qi: 1, fb: { tile: '#0f5b55', title: 'Portrait on teal' } },
  { col: 6, row: 1, h: 400, qi: 6, fb: { tile: '#dcaa1f', title: 'Illustrated owl poster' } },
  // row 2 (mostly below the fold)
  { col: 0, row: 2, h: 310, qi: 9, fb: { src: local('03'), title: 'Orange and teal graphic' } },
  { col: 1, row: 2, h: 330, qi: 9, fb: { src: local('06'), title: 'Editorial design' } },
  { col: 3, row: 2, h: 320, qi: 5, fb: { tile: '#6b1a2c', title: 'Burgundy suit editorial' } },
  { col: 4, row: 2, h: 300, qi: 3, fb: { tile: '#4a78c8', title: 'Stylized illustration' } },
];

export const HERO_SLOTS = RAW.map((s, i) => ({
  ...s,
  id: `slot-${s.col}-${s.row}`,
  ratio: s.h / REF_WIDTH,
  order: i,
}));
