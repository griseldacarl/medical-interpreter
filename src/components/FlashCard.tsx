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
        className="relative transition-transform duration-400 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="backface-hidden flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-lg sm:min-h-[560px] sm:p-8"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="mb-3 text-sm font-medium text-teal-600 uppercase tracking-wide">
            {entry.system}
          </span>

          {entry.imageFile && !imgError && (
            <img
              src={`/images/${entry.imageFile}`}
              alt={entry.translations.en}
              onError={() => setImgError(true)}
              className="mb-4 max-h-40 w-auto object-contain sm:max-h-64"
            />
          )}

          {showJapanese && entry.japaneseDetail ? (
            <JapaneseStack detail={entry.japaneseDetail} />
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-center text-2xl font-bold text-slate-800 sm:text-4xl">
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

          <span className="mt-4 text-sm text-slate-400 sm:mt-8">tap to reveal</span>
        </div>

        <div
          className="backface-hidden absolute inset-0 flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-slate-100 p-4 shadow-lg sm:min-h-[560px] sm:p-8"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span className="text-center text-3xl font-bold text-slate-800 sm:text-5xl">
            {entry.translations.en}
          </span>
          <SpeakButton text={entry.translations.en} lang="en" />
          {entry.position && (
            <span className="mt-3 text-lg text-slate-500">{entry.position}</span>
          )}
        </div>
      </div>
    </div>
  )
}
