const LANG_MAP: Record<string, string> = {
  ar: 'ar-SA',
  rw: 'rw-RW',
  sw: 'sw-TZ',
  zh: 'zh-CN',
  fr: 'fr-FR',
  so: 'so-SO',
  es: 'es-ES',
  ja: 'ja-JP',
  en: 'en-US',
  ps: 'ps-AF',
  my: 'my-MM',
  prs: 'prs-AF',
  fa: 'fa-IR',
  pt: 'pt-PT',
  ru: 'ru-RU',
  vi: 'vi-VN',
  de: 'de-DE',
  bn: 'bn-BD',
}

export function useSpeak() {
  const speak = (text: string, lang: string) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = LANG_MAP[lang] ?? lang
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  return { speak }
}
