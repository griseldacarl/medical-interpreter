interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="w-full">
      <div className="mb-1 text-center text-sm text-slate-500">
        Card {current} of {total}
      </div>
      <div className="h-1 w-full rounded-full bg-slate-200">
        <div
          className="h-1 rounded-full bg-amber-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
