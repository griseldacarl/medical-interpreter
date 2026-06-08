import { useState } from 'react'
import type { LanguageCode } from '../../types/flashcard'
import type { EmergencyCategory, EmergencyCase } from '../../types/emergency'
import { allEmergencyCases, emergencyCategories, filterEmergencyCases } from '../../data/emergency'
import { CaseCard } from './CaseCard'
import { CaseDetail } from './CaseDetail'

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Français' },
  { code: 'so', label: 'Soomaali' },
  { code: 'es', label: 'Español' },
  { code: 'ja', label: '日本語' },
  { code: 'ps', label: 'پښتو' },
  { code: 'my', label: 'မြန်မာဘာသာ' },
  { code: 'prs', label: 'دری' },
  { code: 'fa', label: 'فارسی' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'de', label: 'Deutsch' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'en', label: 'English' },
]

export function EmergencyView() {
  const [category, setCategory] = useState<EmergencyCategory | 'all'>('all')
  const [lang, setLang] = useState<LanguageCode>('en')
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null)

  const filtered = filterEmergencyCases(allEmergencyCases, category)

  if (selectedCase) {
    return (
      <div className="mx-auto max-w-2xl p-4 pb-24">
        <CaseDetail
          caseData={selectedCase}
          lang={lang}
          onBack={() => setSelectedCase(null)}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-4 pb-24">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-slate-800">Emergency Medicine</h1>
        <p className="mt-1 text-sm text-slate-400">109 clinical cases with multilingual patient guides</p>
      </div>

      <div className="mb-4">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Language</h2>
        <div className="flex flex-wrap gap-1.5">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLang(l.code)}
              className={`rounded-sm px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                lang === l.code
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-white text-slate-500 hover:text-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Category</h2>
        <div className="flex flex-wrap gap-1.5">
          {emergencyCategories.map(c => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={`rounded-sm px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                category === c.key
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-white text-slate-500 hover:text-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(c => (
          <CaseCard
            key={c.id}
            caseData={c}
            lang={lang}
            onClick={() => setSelectedCase(c)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-400">
          No cases found for this category.
        </p>
      )}
    </div>
  )
}
