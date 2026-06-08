import type { EmergencyCase, EmergencyCategory } from '../../types/emergency'
import { cardiacCases } from './cardiac'
import { traumaCases } from './trauma'
import { toxicologyCases } from './toxicology'
import { pediatricCases } from './pediatric'
import { neurologicCases } from './neurologic'
import { respiratoryCases } from './respiratory'
import { giGuCases } from './gi_gu'
import { generalCases } from './general'

export const allEmergencyCases: EmergencyCase[] = [
  ...cardiacCases,
  ...traumaCases,
  ...toxicologyCases,
  ...pediatricCases,
  ...neurologicCases,
  ...respiratoryCases,
  ...giGuCases,
  ...generalCases,
]

export function filterEmergencyCases(
  cases: EmergencyCase[],
  category: EmergencyCategory | 'all',
): EmergencyCase[] {
  if (category === 'all') return cases
  return cases.filter(c => c.category === category)
}

export const emergencyCategories: { key: EmergencyCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'cardiac', label: 'Cardiac' },
  { key: 'respiratory', label: 'Respiratory' },
  { key: 'gi-gu', label: 'GI/GU' },
  { key: 'neurologic', label: 'Neurologic' },
  { key: 'trauma', label: 'Trauma' },
  { key: 'toxicology', label: 'Toxicology' },
  { key: 'pediatric', label: 'Pediatric' },
  { key: 'general', label: 'General' },
]
