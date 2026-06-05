import { useSpeak } from '../hooks/useSpeak'

interface SpeakButtonProps {
  text: string
  lang: string
}

export function SpeakButton({ text, lang }: SpeakButtonProps) {
  const { speak } = useSpeak()

  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation()
        speak(text, lang)
      }}
      className="ml-2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
      title="Listen to pronunciation"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M11.553 3.064A.75.75 0 0112 3.75v16.5a.75.75 0 01-1.255.555L5.46 16H2.75A.75.75 0 012 15.25v-6.5A.75.75 0 012.75 8H5.46l5.285-4.805a.75.75 0 01.808-.131zM14.47 9.97a.75.75 0 011.06 0 3.5 3.5 0 010 4.95.75.75 0 01-1.06-1.06 2 2 0 000-2.83.75.75 0 010-1.06z" />
        <path d="M16.95 7.05a.75.75 0 011.06 0 7 7 0 010 9.9.75.75 0 01-1.06-1.06 5.5 5.5 0 000-7.78.75.75 0 010-1.06z" />
      </svg>
    </button>
  )
}
