import type { BodySystem, LanguageCode, TranslationEntry } from '../types/flashcard'
import { cardiovascularTerms } from './cardiovascular'
import { digestiveTerms } from './digestive'
import { muscularTerms } from './muscular'
import { nervousTerms } from './nervous'
import { positionsTerms } from './positions'
import { respiratoryTerms } from './respiratory'
import { skeletalTerms } from './skeletal'
import { interviewTerms } from './interview'

export const allTerms: TranslationEntry[] = [
  ...cardiovascularTerms,
  ...digestiveTerms,
  ...muscularTerms,
  ...nervousTerms,
  ...positionsTerms,
  ...respiratoryTerms,
  ...skeletalTerms,
  ...interviewTerms,
]

export function filterBySystem(system: BodySystem | 'all'): TranslationEntry[] {
  if (system === 'all') return allTerms
  return allTerms.filter(t => t.system === system)
}

export function filterByLanguage(
  terms: TranslationEntry[],
  lang: LanguageCode,
): TranslationEntry[] {
  return terms.filter(t => lang in t.translations)
}
