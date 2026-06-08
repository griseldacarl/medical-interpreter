import { useMemo, useState } from 'react'
import type { LanguageCode, TranslationEntry } from '../types/flashcard'
import { allTerms } from '../data'
import { JapaneseStack } from './JapaneseStack'
import { SpeakButton } from './SpeakButton'

interface QuizPanelProps {
  entry: TranslationEntry
  sourceLang: LanguageCode
  onNext: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function QuizPanel({ entry, sourceLang, onNext }: QuizPanelProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)
  const correct = entry.translations.en 

  const options = useMemo(() => {
    const others = allTerms
      .filter(t => (t.translations.en ) !== correct)
      .map(t => t.translations.en )
    const distractors = shuffle(others).slice(0, 3)
    return shuffle([correct, ...distractors])
  }, [correct])

  const showJapanese = sourceLang === 'ja' && entry.japaneseDetail
  const answered = selected !== null

  function handleSelect(option: string) {
    if (answered) return
    setSelected(option)
  }

  function handleNext() {
    setSelected(null)
    onNext()
  }

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
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 rounded-lg bg-white p-4 text-center shadow-lg sm:p-8 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-600 rounded-t-lg" />
        <span className="mb-3 block text-xs font-bold text-cyan-600 uppercase tracking-[0.15em]">
          {entry.system}
        </span>

        {entry.imageFile && !imgError && (
          <img
            src={`/images/${entry.imageFile}`}
            alt={entry.translations.en}
            onError={() => setImgError(true)}
            className="mx-auto mb-4 max-h-40 w-auto object-contain sm:max-h-64"
          />
        )}

        <div className="flex items-center justify-center">
          {showJapanese && entry.japaneseDetail ? (
            <JapaneseStack detail={entry.japaneseDetail} />
          ) : (
            <>
              <span className="block text-2xl font-bold text-slate-800 sm:text-4xl">
                {entry.translations[sourceLang]}
              </span>
              <SpeakButton text={entry.translations[sourceLang] } lang={sourceLang} />
            </>
          )}
        </div>

        {entry.phonetic?.[sourceLang] && !showJapanese && (
          <span className="mt-2 block text-sm italic text-slate-400 sm:text-lg">
            {entry.phonetic[sourceLang]}
          </span>
        )}
      </div>

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
            className="rounded bg-cyan-600 px-8 py-3 text-base font-medium text-white hover:bg-cyan-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
