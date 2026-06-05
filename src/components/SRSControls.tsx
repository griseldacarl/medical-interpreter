interface SRSControlsProps {
  onRate: (quality: number) => void
}

export function SRSControls({ onRate }: SRSControlsProps) {
  return (
    <div className="mt-4 flex justify-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={() => onRate(1)}
        className="rounded-xl bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-600 sm:px-5 sm:py-2.5"
      >
        Again
      </button>
      <button
        type="button"
        onClick={() => onRate(2)}
        className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600 sm:px-5 sm:py-2.5"
      >
        Hard
      </button>
      <button
        type="button"
        onClick={() => onRate(3)}
        className="rounded-xl bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 sm:px-5 sm:py-2.5"
      >
        Good
      </button>
      <button
        type="button"
        onClick={() => onRate(4)}
        className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 sm:px-5 sm:py-2.5"
      >
        Easy
      </button>
    </div>
  )
}
