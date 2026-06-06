import { useState } from 'react'
import type { LanguageCode, TranslationEntry } from '../types/flashcard'
import { JapaneseStack } from './JapaneseStack'
import { SpeakButton } from './SpeakButton'

interface FlashCardProps {
  entry: TranslationEntry
  sourceLang: LanguageCode
  flipped: boolean
  onFlip: () => void
}

export function FlashCard({ entry, sourceLang, flipped, onFlip }: FlashCardProps) {
  const [imgError, setImgError] = useState(false)
  const showJapanese = sourceLang === 'ja' && entry.japaneseDetail

  return (
    <div
      className="perspective-1000 mx-auto w-full max-w-4xl cursor-pointer"
      onClick={onFlip}
    >
      <div
        className="relative transition-transform duration-600 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="backface-hidden flex min-h-[300px] flex-col items-center justify-center rounded-lg bg-white p-4 shadow-lg sm:min-h-[560px] sm:p-10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-600 rounded-t-lg" />

          <span className="mb-3 text-xs font-bold text-amber-600 uppercase tracking-[0.15em]">
            {entry.system}
          </span>

          {entry.imageFile && !imgError && (
            <img
              src={`/images/${entry.imageFile}`}
              alt={entry.translations.en}
              onError={() => setImgError(true)}
              className="mb-6 max-h-40 w-auto object-contain sm:max-h-64"
            />
          )}

          {showJapanese && entry.japaneseDetail ? (
            <JapaneseStack detail={entry.japaneseDetail} />
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span className="text-center text-3xl font-serif font-bold text-slate-800 sm:text-5xl">
                {entry.translations[sourceLang]}
              </span>
              <SpeakButton text={entry.translations[sourceLang]} lang={sourceLang} />
            </div>
          )}

          {entry.phonetic?.[sourceLang] && !showJapanese && (
            <span className="mt-2 text-sm italic text-slate-400 sm:text-lg">
              {entry.phonetic[sourceLang]}
            </span>
          )}

          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="inline-block w-4 h-px bg-slate-300" />
            tap to reveal
            <span className="inline-block w-4 h-px bg-slate-300" />
          </div>
        </div>

        <div
          className="backface-hidden absolute inset-0 flex min-h-[300px] flex-col items-center justify-center rounded-lg bg-slate-900 p-4 shadow-lg sm:min-h-[560px] sm:p-10"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-600 rounded-t-lg" />

          <span className="mb-3 text-xs font-bold text-amber-600 uppercase tracking-[0.15em]">
            English
          </span>

          <span className="text-center text-3xl font-serif font-bold text-white sm:text-5xl">
            {entry.translations.en}
          </span>

          <div className="mt-4">
            <SpeakButton text={entry.translations.en} lang="en" />
          </div>

          {entry.position && (
            <span className="mt-3 text-sm text-slate-400">{entry.position}</span>
          )}
        </div>
      </div>
    </div>
  )
}
