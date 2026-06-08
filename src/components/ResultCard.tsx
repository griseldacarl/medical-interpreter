import { SpeakButton } from './SpeakButton'
import type { LanguageCode, TranslationEntry } from '../types/flashcard'

const LANG_DISPLAY: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'so', label: 'Soomaali' },
  { code: 'ps', label: 'پښتو' },
  { code: 'my', label: 'မြန်မာ' },
  { code: 'prs', label: 'دری' },
  { code: 'fa', label: 'فارسی' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'de', label: 'Deutsch' },
  { code: 'bn', label: 'বাংলা' },
]

export function ResultCard({ entry }: { entry: TranslationEntry }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 uppercase">
          {entry.system}
        </span>
        {entry.category && (
          <span className="text-xs text-slate-400">{entry.category}</span>
        )}
        <span className="text-xs text-slate-300">·</span>
        <span className="font-mono text-xs text-slate-400">{entry.id}</span>
      </div>

      <div className="divide-y divide-slate-100">
        {LANG_DISPLAY.map(({ code, label }) => {
          const text = entry.translations[code]
          const isJaWithDetail = code === 'ja' && entry.japaneseDetail

          return (
            <div key={code} className="flex items-center gap-3 py-2">
              <span className="w-10 shrink-0 text-xs font-medium text-slate-400 sm:w-16">
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{code.toUpperCase()}</span>
              </span>

              <div className="min-w-0 flex-1">
                <span className="text-sm text-slate-800">{text}</span>

                {isJaWithDetail && (
                  <span className="ml-2 text-xs italic text-slate-400">
                    {entry.japaneseDetail!.romaji} ／ {entry.japaneseDetail!.hiragana}
                  </span>
                )}

                {!isJaWithDetail && entry.phonetic?.[code] && (
                  <span className="ml-2 text-xs italic text-slate-400">
                    {entry.phonetic[code]}
                  </span>
                )}
              </div>

              <SpeakButton text={text} lang={code} />
            </div>
          )
        })}
      </div>

      {entry.imageFile && (
        <img
          src={`/images/${entry.imageFile}`}
          alt={entry.translations.en}
          className="mt-3 max-h-48 w-auto rounded-lg object-contain"
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      )}
    </div>
  )
}
