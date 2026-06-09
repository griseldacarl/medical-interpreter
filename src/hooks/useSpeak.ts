import { useEffect, useRef } from 'react'

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

function findVoice(
  voices: SpeechSynthesisVoice[],
  lang: string,
): SpeechSynthesisVoice | undefined {
  return (
    voices.find(v => v.lang.startsWith(lang + '-'))
    ?? voices.find(v => v.lang.split('-')[0] === lang)
    ?? (lang === 'prs' ? voices.find(v => v.lang.startsWith('fa-')) : undefined)
  )
}

export function useSpeak() {
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    const synth = window.speechSynthesis
    const load = () => {
      voicesRef.current = synth.getVoices()
    }
    load()
    synth.onvoiceschanged = load
    return () => {
      synth.onvoiceschanged = null
    }
  }, [])

  const speak = (text: string, lang: string) => {
    const synth = window.speechSynthesis
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = LANG_MAP[lang] ?? lang
    utterance.rate = 0.9

    const voice = findVoice(voicesRef.current, lang)
    if (voice) utterance.voice = voice

    utterance.onerror = () => {
      // Fallback: retry with just the lang tag set
      const retry = new SpeechSynthesisUtterance(text)
      retry.lang = utterance.lang
      retry.rate = 0.9
      synth.speak(retry)
    }

    synth.speak(utterance)
  }

  return { speak }
}
