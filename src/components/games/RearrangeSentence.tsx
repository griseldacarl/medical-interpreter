import { useState, useMemo, useEffect } from 'react'
import type { LanguageCode, TranslationEntry } from '../../types/flashcard'
import type { GameResults } from './types'

const SENTENCE_COUNT = 5

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getWords(sentence: string): string[] {
  return sentence.split(/\s+/).filter(Boolean)
}

interface RearrangeSentenceProps {
  terms: TranslationEntry[]
  sourceLang: LanguageCode
  onComplete: (results: GameResults) => void
}

export function RearrangeSentence({ terms, sourceLang, onComplete }: RearrangeSentenceProps) {
  const startTime = useMemo(() => Date.now(), [])

  const interviewTerms = useMemo(
    () => terms.filter(t => t.system === 'interview' && !!t.translations[sourceLang]),
    [terms, sourceLang],
  )

  const sentences = useMemo(() => {
    const count = Math.min(SENTENCE_COUNT, interviewTerms.length)
    return shuffle(interviewTerms).slice(0, count)
  }, [interviewTerms])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [pool, setPool] = useState<string[]>(() => {
    const first = sentences[0]
    return first ? shuffle(getWords(first.translations[sourceLang] )) : []
  })
  const [answer, setAnswer] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const current = sentences[index]
  const originalWords = current ? getWords(current.translations[sourceLang] ) : []
  const isLast = index >= sentences.length - 1

  const isCJK = current ? /[\u4e00-\u9fff]/.test(current.translations[sourceLang] ) : false

  useEffect(() => {
    setPool(shuffle(originalWords))
    setAnswer([])
    setChecked(false)
    setIsCorrect(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id])

  if (!current || sentences.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-slate-500">
          {terms.length === 0
            ? 'No interview data for this selection. Try selecting "All Systems" or "Interview".'
            : 'No interview sentences available for this language.'}
        </p>
      </div>
    )
  }

  if (isCJK) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-slate-500">This game does not support Chinese or Japanese. Try a different language.</p>
      </div>
    )
  }

  function handleWordClick(word: string) {
    if (checked) return
    setAnswer(prev => [...prev, word])
    setPool(prev => prev.filter(w => w !== word))
  }

  function handleAnswerClick(word: string) {
    if (checked) return
    setAnswer(prev => prev.filter(w => w !== word))
    setPool(prev => [...prev, word])
  }

  function handleCheck() {
    setChecked(true)
    const correct = answer.join(' ') === originalWords.join(' ')
    setIsCorrect(correct)
    if (correct) {
      setScore(s => s + 1)
    }
  }

  function handleNext() {
    if (isLast) {
      onComplete({ gameType: 'rearrange', score, total: sentences.length, timeMs: Date.now() - startTime })
      return
    }
    setIndex(i => i + 1)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 text-center">
        <span className="text-sm font-medium text-slate-500">
          Sentence {index + 1} of {sentences.length}
        </span>
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
          <div
            className="h-1.5 rounded-full bg-green-600 transition-all duration-300"
            style={{ width: `${((index + 1) / sentences.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-slate-500 mb-1">English:</span>
        <p className="text-base text-slate-700 sm:text-lg">{current.translations.en}</p>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <span className="mb-3 block text-sm font-medium text-slate-500">Your answer:</span>
        <div className="mb-4 flex min-h-[48px] flex-wrap gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-3">
          {answer.length === 0 ? (
            <span className="text-sm text-slate-400">Click words below to build the sentence...</span>
          ) : (
            answer.map((word, i) => (
              <button
                key={`a-${word}-${i}`}
                type="button"
                onClick={() => handleAnswerClick(word)}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  checked
                    ? isCorrect
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {word}
              </button>
            ))
          )}
        </div>

        <span className="mb-3 block text-sm font-medium text-slate-500">Available words:</span>
        <div className="flex min-h-[40px] flex-wrap gap-2">
          {pool.length === 0 && !checked ? (
            <span className="text-sm text-slate-400">All words used!</span>
          ) : pool.length === 0 && checked && !isCorrect ? (
            <span className="text-sm text-slate-400">Click words in your answer to return them here.</span>
          ) : (
            pool.map((word, i) => (
              <button
                key={`p-${word}-${i}`}
                type="button"
                onClick={() => handleWordClick(word)}
                className="rounded bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              >
                {word}
              </button>
            ))
          )}
        </div>
      </div>

      {checked && (
        <div className={`mb-4 rounded-lg p-4 text-center text-base font-medium ${
          isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}>
          {isCorrect
            ? '✓ Correct!'
            : `✗ The correct order: ${originalWords.join(' ')}`}
        </div>
      )}

      <div className="text-center">
        {checked ? (
          <button
            type="button"
            onClick={handleNext}
            className="rounded bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700"
          >
            {isLast ? 'See Results' : 'Next Sentence'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCheck}
            disabled={answer.length === 0}
            className={`rounded px-8 py-3 text-base font-medium text-white ${
              answer.length === 0
                ? 'cursor-not-allowed bg-slate-300'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Check Answer
          </button>
        )}
      </div>
    </div>
  )
}
