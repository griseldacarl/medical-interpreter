import { useMemo, useState } from 'react'
import type { BodySystem, LanguageCode } from '../types/flashcard'
import { filterBySystem } from '../data'
import { DeckSelector } from '../components/DeckSelector'
import { QuizPanel } from '../components/QuizPanel'
import { ProgressBar } from '../components/ProgressBar'

interface QuizViewProps {
  system: BodySystem | 'all'
  sourceLang: LanguageCode
  onSystemChange: (s: BodySystem | 'all') => void
  onLangChange: (l: LanguageCode) => void
}

export function QuizView({
  system,
  sourceLang,
  onSystemChange,
  onLangChange,
}: QuizViewProps) {
  const [index, setIndex] = useState(0)

  const terms = useMemo(() => {
    const bySystem = filterBySystem(system)
    return bySystem
      .filter(t => sourceLang in t.translations)
      .sort(() => Math.random() - 0.5)
  }, [system, sourceLang])

  const current = terms[index]
  const total = terms.length

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <aside className="border-b border-slate-200 bg-slate-50 lg:w-60 lg:border-b-0 lg:border-r">
        <DeckSelector
          selectedSystem={system}
          onSelectSystem={s => {
            onSystemChange(s)
            setIndex(0)
          }}
          sourceLang={sourceLang}
          onSelectLang={l => {
            onLangChange(l)
            setIndex(0)
          }}
        />
      </aside>
      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        {total === 0 ? (
          <p className="text-slate-500">No terms available for this selection.</p>
        ) : (
          <>
            <ProgressBar current={index + 1} total={total} />
            <div className="mt-6">
              <QuizPanel
                key={current.id}
                entry={current}
                sourceLang={sourceLang}
                onNext={() => setIndex(i => (i + 1) % total)}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
