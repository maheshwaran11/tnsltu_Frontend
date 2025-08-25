import ta from './../locals/ta.json';
import en from './../locals/en.json';

const translations = { ta, en };

export function t(key, lang = 'en') {
  return translations[lang]?.[key] || key;
}