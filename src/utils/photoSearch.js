import { getAssetUrl } from './assetHelper';

// Comprehensive local library of high quality product photos
export const PRODUCT_PHOTOS_MAP = {
  // Berries & Cherries
  cherry: 'products/cherry.jpg',
  cherries: 'products/cherry.jpg',
  strawberry: 'products/strawberry.jpg',
  strawberries: 'products/strawberry.jpg',
  blueberry: 'products/blueberry.jpg',
  blueberries: 'products/blueberry.jpg',
  grapes: 'products/grapes.jpg',
  grape: 'products/grapes.jpg',

  // Common Fruits
  apple: 'products/apple.jpg',
  apples: 'products/apple.jpg',
  banana: 'products/banana.jpg',
  bananas: 'products/banana.jpg',
  mango: 'products/mango.jpg',
  mangoes: 'products/mango.jpg',
  orange: 'products/orange.jpg',
  oranges: 'products/orange.jpg',
  pomegranate: 'products/pomegranate.jpg',
  watermelon: 'products/watermelon.jpg',
  papaya: 'products/papaya.jpg',
  pineapple: 'products/pineapple.jpg',
  lemon: 'products/lemon.jpg',
  lemons: 'products/lemon.jpg',
  lime: 'products/lemon.jpg',
  coconut: 'products/coconut.jpg',
  coconuts: 'products/coconut.jpg',
  kiwi: 'products/kiwi.jpg',
  avocado: 'products/avocado.jpg',
  'dragon fruit': 'products/dragon-fruit.jpg',
  dragonfruit: 'products/dragon-fruit.jpg',

  // Vegetables
  tomato: 'products/tomato.jpg',
  tomatoes: 'products/tomato.jpg',
  potato: 'products/potato.jpg',
  potatoes: 'products/potato.jpg',
  onion: 'products/onion.jpg',
  onions: 'products/onion.jpg',
  carrot: 'products/carrot.jpg',
  carrots: 'products/carrot.jpg',
  chilli: 'products/green-chilli.jpg',
  chili: 'products/green-chilli.jpg',
  chillies: 'products/green-chilli.jpg',
  capsicum: 'products/capsicum.jpg',
  pepper: 'products/capsicum.jpg',
  cucumber: 'products/cucumber.jpg',
  cauliflower: 'products/cauliflower.jpg',
  cabbage: 'products/cabbage.jpg',
  garlic: 'products/garlic.jpg',
  ginger: 'products/ginger.jpg',
  peas: 'products/peas.jpg',
  matar: 'products/peas.jpg',
  eggplant: 'products/eggplant.jpg',
  brinjal: 'products/eggplant.jpg',
  beetroot: 'products/beetroot.jpg',
  mushroom: 'products/mushroom.jpg',
  mushrooms: 'products/mushroom.jpg',

  // Greens & Herbs
  spinach: 'products/spinach.jpg',
  palak: 'products/spinach.jpg',
  coriander: 'products/coriander.jpg',
  cilantro: 'products/coriander.jpg',
  mint: 'products/mint.jpg',
  pudina: 'products/mint.jpg',

  // Groceries & Pantry
  rice: 'products/rice.jpg',
  atta: 'products/atta.jpg',
  flour: 'products/atta.jpg',
  wheat: 'products/atta.jpg',
  dal: 'products/dal.jpg',
  pulses: 'products/dal.jpg',
  oil: 'products/oil.jpg',
  milk: 'products/milk.jpg',
  egg: 'products/eggs.jpg',
  eggs: 'products/eggs.jpg',
  'dry fruits': 'products/dry-fruits.jpg',
  cashew: 'products/dry-fruits.jpg',
  almond: 'products/dry-fruits.jpg',
  nuts: 'products/dry-fruits.jpg'
};

/**
 * Searches local library by keyword (instant, zero network latency)
 */
export const findLocalPhoto = (name) => {
  if (!name || typeof name !== 'string') return null;
  const clean = name.toLowerCase().trim();

  // Exact match
  if (PRODUCT_PHOTOS_MAP[clean]) {
    return PRODUCT_PHOTOS_MAP[clean];
  }

  // Substring keyword match (e.g. "fresh red cherry" -> matches "cherry")
  const keys = Object.keys(PRODUCT_PHOTOS_MAP);
  for (const key of keys) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(clean)) {
      return PRODUCT_PHOTOS_MAP[key];
    }
  }

  return null;
};

/**
 * Live internet photo search via Wikipedia / Wikimedia Public Commons API
 * Returns array of { title, url, thumbnail }
 */
export const searchInternetPhotos = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();
  const searchTerms = `${cleanQuery} fruit OR vegetable OR plant OR food`;

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      searchTerms
    )}&gsrlimit=8&prop=pageimages&piprop=thumbnail&pithumbsize=600&format=json&origin=*`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.query || !data.query.pages) return [];

    const pages = Object.values(data.query.pages);
    const results = pages
      .filter((page) => page.thumbnail && page.thumbnail.source)
      .map((page) => ({
        id: page.pageid,
        title: page.title,
        url: page.thumbnail.source,
        thumbnail: page.thumbnail.source
      }));

    return results;
  } catch (err) {
    console.warn('Internet photo search failed:', err);
    return [];
  }
};
