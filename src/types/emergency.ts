import type { LanguageCode } from './flashcard'

export type EmergencyCategory =
  | 'cardiac'
  | 'trauma'
  | 'toxicology'
  | 'pediatric'
  | 'neurologic'
  | 'respiratory'
  | 'gi-gu'
  | 'general'

export interface EmergencyCaseTranslation {
  title: string
  chiefComplaint: string
  questions: string[]
  explanations: string[]
  instructions: string[]
  disposition: string[]
  followUp: string[]
  warningSigns: string[]
  diagnosis: string
}

export interface EmergencyCase {
  id: string
  caseNumber: number
  category: EmergencyCategory
  translations: Record<LanguageCode, EmergencyCaseTranslation>
  presentingComplaint: string
  vitalSigns: string
  examFindings: string
  differential: string[]
  workup: string
  diagnosis: string
  criticalActions: string[]
  clinicalPearls: string
  imageFile?: string
}
