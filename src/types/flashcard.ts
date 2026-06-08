export type BodySystem =
  | 'skeletal'
  | 'muscular'
  | 'cardiovascular'
  | 'nervous'
  | 'respiratory'
  | 'digestive'
  | 'positions'
  | 'interview'

export type LanguageCode =
  | 'ar' | 'rw' | 'sw' | 'zh' | 'fr' | 'so' | 'es' | 'ja'
  | 'ps' | 'my' | 'prs' | 'fa' | 'pt' | 'ru' | 'vi' | 'de' | 'bn'
  | 'en'

export interface JapaneseDetail {
  kanji: string
  hiragana: string
  katakana: string
  romaji: string
}

export interface TranslationEntry {
  id: string
  system: BodySystem
  translations: Record<LanguageCode, string>
  phonetic?: Partial<Record<LanguageCode, string>>
  japaneseDetail?: JapaneseDetail
  position?: string
  imageFile?: string
  category?: string
}
