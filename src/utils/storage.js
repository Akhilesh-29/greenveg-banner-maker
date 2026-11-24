const SHOP_PROFILE_KEY = 'shop_banner_maker_profile';
const RECENT_BANNERS_KEY = 'shop_banner_maker_recents';
const DRAFT_BANNER_KEY = 'shop_banner_maker_draft';
const THEME_KEY = 'shop_banner_maker_theme';

export const DEFAULT_SHOP_PROFILE = {
  name: 'GREENVEG BASKET',
  phone: '98450 12345',
  address: 'Main Market Road, Near City Circle',
  tagline: 'Fresh Fruits, Vegetables & Pure Daily Groceries',
  logoUrl: '',
  showShopHeader: true,
  showShopFooter: true,
  showPhone: true,
  showAddress: true,
  showHomeDeliveryBadge: true
};

export const getStoredShopProfile = () => {
  try {
    const raw = localStorage.getItem(SHOP_PROFILE_KEY);
    if (!raw) return DEFAULT_SHOP_PROFILE;
    const parsed = JSON.parse(raw);
    // If user has old default placeholder name, upgrade to GREENVEG BASKET
    if (!parsed.name || parsed.name === 'SRI KRISHNA FRESH MART') {
      parsed.name = 'GREENVEG BASKET';
    }
    return { ...DEFAULT_SHOP_PROFILE, ...parsed };
  } catch {
    return DEFAULT_SHOP_PROFILE;
  }
};

export const saveStoredShopProfile = (profile) => {
  try {
    localStorage.setItem(SHOP_PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save shop profile', err);
  }
};

export const getRecentBanners = () => {
  try {
    const raw = localStorage.getItem(RECENT_BANNERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveBannerToHistory = (bannerItem) => {
  try {
    const recents = getRecentBanners();
    const filtered = recents.filter(item => item.id !== bannerItem.id);
    const updated = [
      {
        ...bannerItem,
        updatedAt: new Date().toISOString()
      },
      ...filtered
    ].slice(0, 20);
    localStorage.setItem(RECENT_BANNERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save to history', err);
    return [];
  }
};

export const deleteBannerFromHistory = (id) => {
  try {
    const recents = getRecentBanners();
    const updated = recents.filter(item => item.id !== id);
    localStorage.setItem(RECENT_BANNERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete banner', err);
    return [];
  }
};

export const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch {
    return 'light';
  }
};

export const saveStoredTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Failed to save theme', err);
  }
};
