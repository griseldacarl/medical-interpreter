import { useState, useMemo } from 'react'
import type { LanguageCode, TranslationEntry } from '../../types/flashcard'
import { allTerms } from '../../data'
import type { GameResults } from './types'

const QUESTION_COUNT = 8

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface PictureMatchProps {
  terms: TranslationEntry[]
  sourceLang: LanguageCode
  onComplete: (results: GameResults) => void
}

export function PictureMatch({ terms, sourceLang, onComplete }: PictureMatchProps) {
  const startTime = useMemo(() => Date.now(), [])

  const imageTerms = useMemo(
    () => terms.filter(t => !!t.imageFile && !!t.translations[sourceLang]),
    [terms, sourceLang],
  )

  const questions = useMemo(() => {
    const count = Math.min(QUESTION_COUNT, imageTerms.length)
    return shuffle(imageTerms).slice(0, count)
  }, [imageTerms])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  const current = questions[index]
  const answered = selected !== null
  const isLast = index >= questions.length - 1
  const imgFailed = current ? imgErrors.has(current.id) : false

  const options = useMemo(() => {
    if (!current) return []
    const correct = current.translations[sourceLang]
    if (!correct) return []
    const others = allTerms
      .filter(t => t.translations[sourceLang] !== correct)
      .map(t => t.translations[sourceLang])
    const distractors = shuffle(others).slice(0, 3)
    return shuffle([correct, ...distractors])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, sourceLang])

  if (!current || questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-slate-500">
          No terms with images for this selection. Try selecting a different system.
        </p>
      </div>
    )
  }

  function handleSelect(option: string) {
    if (answered) return
    setSelected(option)
    if (option === current.translations[sourceLang]) {
      setScore(s => s + 1)
    }
  }

  function handleNext() {
    if (isLast) {
      onComplete({ gameType: 'picture-match', score, total: questions.length, timeMs: Date.now() - startTime })
      return
    }
    setIndex(i => i + 1)
    setSelected(null)
  }

  const correct = current.translations[sourceLang] ?? ''

  function btnClass(option: string): string {
    if (!answered) {
      return 'border-slate-200 text-slate-700 hover:bg-slate-50'
    }
    if (option === correct) {
      return 'border-emerald-500 bg-emerald-50 text-emerald-700'
    }
    if (option === selected) {
      return 'border-rose-500 bg-rose-50 text-rose-700'
    }
    return 'border-slate-200 text-slate-400'
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 text-center">
        <span className="text-sm font-medium text-slate-500">
          Question {index + 1} of {questions.length}
        </span>
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
          <div
            className="h-1.5 rounded-full bg-green-600 transition-all duration-300"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {!imgFailed && current.imageFile && (
        <div className="mb-6 flex items-center justify-center">
          <img
            src={`/images/${current.imageFile}`}
            alt={current.translations.en}
            onError={() => setImgErrors(prev => new Set([...prev, current.id]))}
            className="max-h-48 w-auto rounded-lg object-contain sm:max-h-64"
          />
        </div>
      )}

      {imgFailed && (
        <div className="mb-6 flex items-center justify-center rounded-lg bg-slate-100 p-8">
          <span className="text-sm text-slate-400">Image not available</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => handleSelect(opt)}
            className={`rounded border-2 px-4 py-3 text-left text-base font-medium transition-colors sm:px-6 sm:py-4 ${btnClass(opt)}`}
          >
            {opt}
          </button>
        ))}
      </div>

      {answered && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleNext}
            className="rounded bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700"
          >
            {isLast ? 'See Results' : 'Next'}
          </button>
        </div>
      )}
    </div>
  )
}
