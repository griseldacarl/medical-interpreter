import type { EmergencyCase } from '../../types/emergency'
import type { LanguageCode } from '../../types/flashcard'
import { SpeakButton } from '../SpeakButton'

interface CaseDetailProps {
  caseData: EmergencyCase
  lang: LanguageCode
  onBack: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  cardiac: 'Cardiac', trauma: 'Trauma', toxicology: 'Toxicology',
  pediatric: 'Pediatric', neurologic: 'Neurologic',
  respiratory: 'Respiratory', 'gi-gu': 'GI/GU', general: 'General',
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</h4>
      {children}
    </div>
  )
}

function LineItem({ text, lang }: { text: string; lang: LanguageCode }) {
  return (
    <div className="flex items-start gap-2 py-0.5">
      <span className="material-symbols-outlined mt-0.5 text-sm text-amber-500">circle</span>
      <span className="text-sm text-slate-700 flex-1">{text}</span>
      <SpeakButton text={text} lang={lang} />
    </div>
  )
}

export function CaseDetail({ caseData, lang, onBack }: CaseDetailProps) {
  const t = caseData.translations[lang]
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 rounded px-2 py-1 text-sm font-semibold text-slate-500 hover:text-slate-700"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back
        </button>
        <span className="rounded-sm bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 uppercase tracking-wider">
          {CATEGORY_LABELS[caseData.category]}
        </span>
        <span className="text-xs font-medium text-slate-400">#{caseData.caseNumber}</span>
      </div>

      <h2 className="font-serif text-2xl font-bold text-slate-800">{t.title}</h2>

      <Section label="Chief Complaint">
        <div className="flex items-start gap-2">
          <p className="text-sm text-slate-700 flex-1">{t.chiefComplaint}</p>
          <SpeakButton text={t.chiefComplaint} lang={lang} />
        </div>
      </Section>

      <Section label="Questions to Ask">
        {t.questions.map((q, i) => (
          <LineItem key={i} text={q} lang={lang} />
        ))}
      </Section>

      <Section label="Explanations">
        {t.explanations.map((e, i) => (
          <LineItem key={i} text={e} lang={lang} />
        ))}
      </Section>

      <Section label="Instructions">
        {t.instructions.map((ins, i) => (
          <LineItem key={i} text={ins} lang={lang} />
        ))}
      </Section>

      <Section label="Disposition">
        {t.disposition.map((d, i) => (
          <LineItem key={i} text={d} lang={lang} />
        ))}
      </Section>

      <Section label="Follow-up">
        {t.followUp.map((f, i) => (
          <LineItem key={i} text={f} lang={lang} />
        ))}
      </Section>

      <Section label="Warning Signs">
        {t.warningSigns.map((w, i) => (
          <LineItem key={i} text={w} lang={lang} />
        ))}
      </Section>

      <Section label="Diagnosis">
        <div className="flex items-start gap-2">
          <p className="text-sm font-medium text-slate-700 flex-1">{t.diagnosis}</p>
          <SpeakButton text={t.diagnosis} lang={lang} />
        </div>
      </Section>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="mb-3 font-serif text-lg font-bold text-slate-800">Clinical Details</h3>

        {caseData.presentingComplaint && (
          <Section label="Presenting Complaint">
            <p className="text-sm text-slate-700">{caseData.presentingComplaint}</p>
          </Section>
        )}

        {caseData.vitalSigns && (
          <Section label="Vital Signs">
            <p className="text-sm text-slate-700">{caseData.vitalSigns}</p>
          </Section>
        )}

        {caseData.examFindings && (
          <Section label="Exam Findings">
            <p className="text-sm text-slate-700">{caseData.examFindings}</p>
          </Section>
        )}

        {caseData.differential.length > 0 && (
          <Section label="Differential Diagnosis">
            <ul className="list-inside list-disc text-sm text-slate-700">
              {caseData.differential.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </Section>
        )}

        {caseData.workup && (
          <Section label="Workup">
            <p className="text-sm text-slate-700">{caseData.workup}</p>
          </Section>
        )}

        {caseData.diagnosis && (
          <Section label="Diagnosis">
            <p className="text-sm font-medium text-slate-700">{caseData.diagnosis}</p>
          </Section>
        )}

        {caseData.criticalActions.length > 0 && (
          <Section label="Critical Actions">
            <ul className="list-inside list-disc text-sm text-slate-700">
              {caseData.criticalActions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Section>
        )}

        {caseData.clinicalPearls && (
          <Section label="Clinical Pearls">
            <p className="text-sm text-slate-700">{caseData.clinicalPearls}</p>
          </Section>
        )}
      </div>
    </div>
  )
}
