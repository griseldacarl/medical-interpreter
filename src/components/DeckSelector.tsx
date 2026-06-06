import type { BodySystem, LanguageCode } from '../types/flashcard'

interface DeckSelectorProps {
  selectedSystem: BodySystem | 'all'
  onSelectSystem: (system: BodySystem | 'all') => void
  sourceLang: LanguageCode
  onSelectLang: (lang: LanguageCode) => void
}

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Français' },
  { code: 'so', label: 'Soomaali' },
  { code: 'es', label: 'Español' },
  { code: 'ja', label: '日本語' },
]

const SYSTEMS: { value: BodySystem | 'all'; label: string }[] = [
  { value: 'all', label: 'All Systems' },
  { value: 'skeletal', label: 'Skeletal' },
  { value: 'muscular', label: 'Muscular' },
  { value: 'cardiovascular', label: 'Cardiovascular' },
  { value: 'nervous', label: 'Nervous' },
  { value: 'respiratory', label: 'Respiratory' },
  { value: 'digestive', label: 'Digestive' },
  { value: 'positions', label: 'Positions' },
  { value: 'interview', label: 'Interview' },
]

export function DeckSelector({
  selectedSystem,
  onSelectSystem,
  sourceLang,
  onSelectLang,
}: DeckSelectorProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-600">Language</h2>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => onSelectLang(l.code)}
              className={
                sourceLang === l.code
                  ? 'rounded-sm bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 sm:px-5 sm:py-2.5'
                  : 'rounded-sm bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:px-5 sm:py-2.5'
              }
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-600">System</h2>
        <div className="flex flex-wrap gap-2">
          {SYSTEMS.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => onSelectSystem(s.value)}
              className={
                selectedSystem === s.value
                  ? 'rounded-sm bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 sm:px-5 sm:py-2.5'
                  : 'rounded-sm bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:px-5 sm:py-2.5'
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
