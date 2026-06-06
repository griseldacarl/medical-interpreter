interface SRSControlsProps {
  onRate: (quality: number) => void
}

export function SRSControls({ onRate }: SRSControlsProps) {
  return (
    <div className="mt-6 flex justify-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={() => onRate(1)}
        className="rounded bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 flex items-center gap-1.5"
      >
        <span className="material-symbols-outlined text-base">undo</span>
        Again
      </button>
      <button
        type="button"
        onClick={() => onRate(2)}
        className="rounded bg-orange-400 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 flex items-center gap-1.5"
      >
        <span className="material-symbols-outlined text-base">remove</span>
        Hard
      </button>
      <button
        type="button"
        onClick={() => onRate(3)}
        className="rounded bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 flex items-center gap-1.5"
      >
        <span className="material-symbols-outlined text-base">check</span>
        Good
      </button>
      <button
        type="button"
        onClick={() => onRate(4)}
        className="rounded bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 flex items-center gap-1.5"
      >
        <span className="material-symbols-outlined text-base">double_arrow</span>
        Easy
      </button>
    </div>
  )
}
