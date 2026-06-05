import type { JapaneseDetail } from '../types/flashcard'

interface JapaneseStackProps {
  detail: JapaneseDetail
}

export function JapaneseStack({ detail }: JapaneseStackProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold text-slate-800 sm:text-5xl">{detail.kanji}</span>
      <span className="text-xl text-slate-500 sm:text-3xl">{detail.hiragana}</span>
      <span className="text-base italic text-slate-400 sm:text-xl">{detail.romaji}</span>
      <span className="text-base text-slate-400 sm:text-xl">{detail.katakana}</span>
    </div>
  )
}
