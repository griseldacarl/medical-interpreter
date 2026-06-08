import type { EmergencyCase } from '../../types/emergency'
import type { LanguageCode } from '../../types/flashcard'

interface CaseCardProps {
  caseData: EmergencyCase
  lang: LanguageCode
  onClick: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  cardiac: 'Cardiac', trauma: 'Trauma', toxicology: 'Toxicology',
  pediatric: 'Pediatric', neurologic: 'Neurologic',
  respiratory: 'Respiratory', 'gi-gu': 'GI/GU', general: 'General',
}

export function CaseCard({ caseData, lang, onClick }: CaseCardProps) {
  const t = caseData.translations[lang]
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <span className="rounded-sm bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 uppercase tracking-wider">
          {CATEGORY_LABELS[caseData.category]}
        </span>
        <span className="text-xs font-medium text-slate-400">#{caseData.caseNumber}</span>
      </div>
      <h3 className="font-serif text-lg font-bold text-slate-800">{t.title}</h3>
      <p className="text-sm text-slate-600 line-clamp-2">{t.chiefComplaint}</p>
    </button>
  )
}
