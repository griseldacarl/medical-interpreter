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
      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
      title="Listen to pronunciation"
    >
      <span className="material-symbols-outlined text-2xl">volume_up</span>
    </button>
  )
}
