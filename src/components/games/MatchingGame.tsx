import { useState, useMemo, useRef, useEffect } from 'react'
import type { LanguageCode, TranslationEntry } from '../../types/flashcard'
import type { GameResults } from './types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface MatchingGameProps {
  terms: TranslationEntry[]
  sourceLang: LanguageCode
  onComplete: (results: GameResults) => void
}

export function MatchingGame({ terms, sourceLang, onComplete }: MatchingGameProps) {
  const startTime = useMemo(() => Date.now(), [])

  const pairs = useMemo(() => {
    const selected = shuffle(terms).slice(0, 4)
    return selected.map(t => ({
      id: t.id,
      source: t.translations[sourceLang] ?? t.translations.en,
      target: t.translations.en,
    }))
  }, [terms, sourceLang])

  const leftOrder = useMemo(() => shuffle([0, 1, 2, 3]), [])
  const rightOrder = useMemo(() => shuffle([0, 1, 2, 3]), [])

  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [selectedSource, setSelectedSource] = useState<number | null>(null)
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null)
  const [wrongIds, setWrongIds] = useState<{ left: number; right: number } | null>(null)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const completedRef = useRef(false)

  useEffect(() => {
    if (matched.size === 4 && !completedRef.current) {
      completedRef.current = true
      onComplete({ gameType: 'matching', score: 4, total: 4, timeMs: Date.now() - startTime, wrongAttempts })
    }
  }, [matched.size, wrongAttempts, startTime, onComplete])

  if (terms.length < 4) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-slate-500">Need at least 4 terms for this game. Try selecting a different system.</p>
      </div>
    )
  }

  function handleClickLeft(colIdx: number) {
    const pairIndex = leftOrder[colIdx]
    if (matched.has(pairIndex) || wrongIds) return
    setSelectedSource(pairIndex)
    if (selectedTarget !== null) {
      checkMatch(pairIndex, selectedTarget)
    }
  }

  function handleClickRight(colIdx: number) {
    const pairIndex = rightOrder[colIdx]
    if (matched.has(pairIndex) || wrongIds) return
    setSelectedTarget(pairIndex)
    if (selectedSource !== null) {
      checkMatch(selectedSource, pairIndex)
    }
  }

  function checkMatch(sourceIdx: number, targetIdx: number) {
    if (sourceIdx === targetIdx) {
      setMatched(prev => new Set([...prev, sourceIdx]))
      setSelectedSource(null)
      setSelectedTarget(null)
    } else {
      setWrongAttempts(w => w + 1)
      setWrongIds({ left: sourceIdx, right: targetIdx })
      setTimeout(() => {
        setWrongIds(null)
        setSelectedSource(null)
        setSelectedTarget(null)
      }, 600)
    }
  }

  function colBtnClass(
    pairIndex: number,
    isSelected: boolean,
    isMatched: boolean,
  ): string {
    if (isMatched) return 'border-emerald-500 bg-emerald-50 text-emerald-700 cursor-default'
    if (wrongIds && (wrongIds.left === pairIndex || wrongIds.right === pairIndex)) {
      return 'border-rose-500 bg-rose-50 text-rose-700'
    }
    if (isSelected) return 'border-green-500 bg-green-50 text-green-700'
    return 'border-slate-200 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50'
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <span className="text-sm font-medium text-slate-500">
          {matched.size === 4 ? 'All matched!' : `Matched ${matched.size} of 4`}
        </span>
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
          <div
            className="h-1.5 rounded-full bg-green-600 transition-all duration-300"
            style={{ width: `${(matched.size / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <div className="space-y-3">
          <h3 className="text-center text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Term
          </h3>
          {leftOrder.map((pairIndex, colIdx) => {
            const p = pairs[pairIndex]
            const isMatched = matched.has(pairIndex)
            const isSelected = selectedSource === pairIndex
            return (
              <button
                key={colIdx}
                type="button"
                onClick={() => handleClickLeft(colIdx)}
                className={`w-full rounded border-2 px-4 py-3 text-center text-base font-medium transition-colors sm:px-6 sm:py-4 ${colBtnClass(pairIndex, isSelected, isMatched)}`}
              >
                {p.source}
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          <h3 className="text-center text-sm font-semibold text-slate-600 uppercase tracking-wider">
            English
          </h3>
          {rightOrder.map((pairIndex, colIdx) => {
            const p = pairs[pairIndex]
            const isMatched = matched.has(pairIndex)
            const isSelected = selectedTarget === pairIndex
            return (
              <button
                key={colIdx}
                type="button"
                onClick={() => handleClickRight(colIdx)}
                className={`w-full rounded border-2 px-4 py-3 text-center text-base font-medium transition-colors sm:px-6 sm:py-4 ${colBtnClass(pairIndex, isSelected, isMatched)}`}
              >
                {p.target}
              </button>
            )
          })}
        </div>
      </div>

      {wrongAttempts > 0 && (
        <p className="mt-4 text-center text-sm text-slate-500">
          Wrong guesses: {wrongAttempts}
        </p>
      )}
    </div>
  )
}
