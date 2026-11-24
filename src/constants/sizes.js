export const BANNER_SIZES = [
  {
    id: 'post-square',
    name: 'Instagram / WhatsApp Post',
    category: 'Social Media',
    width: 1080,
    height: 1080,
    aspect: '1:1',
    ratio: 1,
    icon: 'square',
    badge: 'Popular',
    desc: 'Square post for WhatsApp status, groups & Instagram grid'
  },
  {
    id: 'story-portrait',
    name: 'WhatsApp Status / Story',
    category: 'Social Media',
    width: 1080,
    height: 1920,
    aspect: '9:16',
    ratio: 9 / 16,
    icon: 'smartphone',
    badge: 'Best for Mobile',
    desc: 'Full-screen mobile story & status updates'
  },
  {
    id: 'facebook-landscape',
    name: 'Facebook / Banner Card',
    category: 'Social Media',
    width: 1200,
    height: 630,
    aspect: '1.91:1',
    ratio: 1200 / 630,
    icon: 'layout',
    desc: 'Wide banner for Facebook feeds, groups & website banners'
  },
  {
    id: 'poster-a4',
    name: 'Shop Poster A4',
    category: 'Print Posters',
    width: 2480,
    height: 3508,
    aspect: 'A4 (1:1.41)',
    ratio: 2480 / 3508,
    icon: 'file-text',
    badge: 'Print Ready',
    desc: 'Standard A4 shop wall print, display standee'
  },
  {
    id: 'poster-a5',
    name: 'Shop Flyer A5',
    category: 'Print Posters',
    width: 1748,
    height: 2480,
    aspect: 'A5 (1:1.41)',
    ratio: 1748 / 2480,
    icon: 'file',
    desc: 'Handout pamphlet & counter flyer'
  },
  {
    id: 'display-16-9',
    name: 'Shop Display Board (TV)',
    category: 'Display Board',
    width: 1920,
    height: 1080,
    aspect: '16:9',
    ratio: 16 / 9,
    icon: 'tv',
    badge: 'Digital Screen',
    desc: 'Counter TV screen, LED digital board & landscape signage'
  },
  {
    id: 'custom',
    name: 'Custom Dimensions',
    category: 'Custom',
    width: 1000,
    height: 1000,
    aspect: 'Custom',
    ratio: 1,
    icon: 'sliders',
    desc: 'Enter custom pixel width and height'
  }
];
