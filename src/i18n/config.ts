// Global Language Map
export const langMap: Record<string, string[]> = {
  'en': ['en-US'],
  'zh': ['zh-CN'],
  'zh-tw': ['zh-TW'],
  // 可以在此添加其他语言配置,例如:
  // 'de': ['de-DE'],
  // 'es': ['es-ES'],
  // 'fr': ['fr-FR'],
  // 'ja': ['ja-JP'],
  // 'ko': ['ko-KR'],
  // 'pl': ['pl-PL'],
  // 'pt': ['pt-BR'],
  // 'ru': ['ru-RU'],
}

// Giscus Language Map
// https://giscus.app/
export const giscusLocaleMap: Record<string, string> = {
  'en': 'en',
  'zh': 'zh-CN',
  'zh-tw': 'zh-TW',
  // 可以在此添加其他语言的 Giscus 映射,例如:
  // 'de': 'de',
  // 'es': 'es',
  // 'fr': 'fr',
  // 'ja': 'ja',
  // 'ko': 'ko',
  // 'pl': 'pl',
  // 'pt': 'pt',
  // 'ru': 'ru',
}

// Twikoo Language Map
// https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
export const twikooLocaleMap: Record<string, string> = {
  'en': 'en',
  'zh': 'zh-cn',
  'zh-tw': 'zh-tw',
  // 可以在此添加其他语言的 Twikoo 映射,例如:
  // 'de': 'en', // fallback to English
  // 'es': 'en', // fallback to English
  // 'fr': 'en', // fallback to English
  // 'ja': 'ja',
  // 'ko': 'ko',
  // 'pl': 'en', // fallback to English
  // 'pt': 'en', // fallback to English
  // 'ru': 'en', // fallback to English
}

// Waline Language Map
// https://waline.js.org/en/guide/features/i18n.html
export const walineLocaleMap: Record<string, string> = {
  'en': 'en-US',
  'zh': 'zh-CN',
  'zh-tw': 'zh-TW',
  // 可以在此添加其他语言的 Waline 映射,例如:
  // 'de': 'en-US', // fallback to English
  // 'es': 'es',
  // 'fr': 'fr-FR',
  // 'ja': 'jp-JP',
  // 'ko': 'en-US', // fallback to English
  // 'pl': 'en-US', // fallback to English
  // 'pt': 'pt-BR',
  // 'ru': 'ru-RU',
}

// Supported Languages
export const supportedLangs = Object.keys(langMap).flat()
