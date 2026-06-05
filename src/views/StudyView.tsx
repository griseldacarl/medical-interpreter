import { useMemo, useState } from 'react'
import type { BodySystem, LanguageCode } from '../types/flashcard'
import { filterBySystem } from '../data'
import { useSRS } from '../hooks/useSRS'
import { DeckSelector } from '../components/DeckSelector'
import { FlashCard } from '../components/FlashCard'
import { SRSControls } from '../components/SRSControls'
import { ProgressBar } from '../components/ProgressBar'

interface StudyViewProps {
  system: BodySystem | 'all'
  sourceLang: LanguageCode
  onSystemChange: (s: BodySystem | 'all') => void
  onLangChange: (l: LanguageCode) => void
}

export function StudyView({
  system,
  sourceLang,
  onSystemChange,
  onLangChange,
}: StudyViewProps) {
  const { getCard, rateCard } = useSRS()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const filtered = useMemo(() => {
    const bySystem = filterBySystem(system)
    return bySystem
      .filter(t => sourceLang in t.translations)
      .sort((a, b) => {
        const ca = getCard(a.id)
        const cb = getCard(b.id)
        return ca.nextReview - cb.nextReview
      })
  }, [system, sourceLang, getCard])

  const current = filtered[index]
  const total = filtered.length

  function nextCard() {
    setFlipped(false)
    setIndex(i => (i + 1) % total)
  }

  function handleRate(quality: number) {
    if (!current) return
    rateCard(current.id, quality)
    nextCard()
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <aside className="border-b border-slate-200 bg-white lg:w-60 lg:border-b-0 lg:border-r">
        <DeckSelector
          selectedSystem={system}
          onSelectSystem={s => {
            onSystemChange(s)
            setIndex(0)
            setFlipped(false)
          }}
          sourceLang={sourceLang}
          onSelectLang={l => {
            onLangChange(l)
            setIndex(0)
            setFlipped(false)
          }}
        />
      </aside>
      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        {total === 0 ? (
          <p className="text-slate-500">No terms found for this selection.</p>
        ) : (
          <>
            <ProgressBar current={index + 1} total={total} />
            <div className="mt-6">
              <FlashCard
                key={current.id}
                entry={current}
                sourceLang={sourceLang}
                flipped={flipped}
                onFlip={() => setFlipped(f => !f)}
              />
            </div>
            {flipped && <SRSControls onRate={handleRate} />}
          </>
        )}
      </main>
    </div>
  )
}
