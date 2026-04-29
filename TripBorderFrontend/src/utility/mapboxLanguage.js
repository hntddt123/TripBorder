import { mapBoxLangs } from '../constants/constants';

export const getMapboxLanguage = (deviceLang = navigator.language || 'en') => {
  const lang = deviceLang.toLowerCase();

  if (lang.includes('zh-tw') || lang.includes('zh_hant')) return 'zh-TW';
  if (lang.startsWith('zh')) return 'zh';

  // Add more if we want later (ja, ko, etc. – Mapbox supports tons)
  const supported = Object.entries(mapBoxLangs).map((code) => code);
  const base = lang.split('-')[0];
  return supported.includes(base) ? base : 'en';
};
