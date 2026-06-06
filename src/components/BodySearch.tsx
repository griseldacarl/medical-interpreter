import { useMemo, useState } from 'react'
import { allTerms } from '../data'
import { bodyViews } from '../data/bodyRegions'
import type { BodyView } from '../data/bodyRegions'
import { ResultCard } from './ResultCard'

function BodyMap({
  view,
  hovered,
  onHover,
  onSelect,
}: {
  view: BodyView
  hovered: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}) {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <img
        src={`/images/${view.imageFile}`}
        alt={view.label}
        className="w-full rounded-xl"
      />
      <svg
        viewBox="0 0 1408 768"
        className="absolute inset-0 h-full w-full"
      >
        {view.regions.map(r => {
          const [x, y, w, h] = r.rect
          const isHovered = hovered === r.id

          return (
            <rect
              key={r.id}
              x={x}
              y={y}
              width={w}
              height={h}
        fill={isHovered ? 'rgba(147, 51, 234, 0.25)' : 'transparent'}
        stroke={isHovered ? '#9333ea' : 'transparent'}
              strokeWidth={2}
              rx={6}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => onHover(r.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(r.id)}
            />
          )
        })}
      </svg>

      {hovered && (
        <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded bg-purple-700 px-4 py-1.5 text-sm font-medium text-white shadow-lg">
          {view.regions.find(r => r.id === hovered)?.label}
        </div>
      )}
    </div>
  )
}

export function BodySearch() {
  const [viewIndex, setViewIndex] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const currentView = bodyViews[viewIndex]

  const results = useMemo(() => {
    if (!selectedRegion) return []
    const region = currentView.regions.find(r => r.id === selectedRegion)
    if (!region) return []
    const ids = new Set(region.termIds)
    return allTerms.filter(t => ids.has(t.id))
  }, [selectedRegion, currentView])

  if (selectedRegion) {
    const region = currentView.regions.find(r => r.id === selectedRegion)
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <button
          type="button"
          onClick={() => setSelectedRegion(null)}
          className="mb-4 inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to body map
        </button>

        <p className="mb-4 text-sm text-slate-500">
          {region?.label} · {results.length} term{results.length !== 1 ? 's' : ''}
        </p>

        <div className="space-y-4">
          {results.map(entry => (
            <ResultCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    )
  }

  return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {bodyViews.map((v, i) => (
            <button
              key={v.imageFile}
              type="button"
              onClick={() => {
                setViewIndex(i)
                setHovered(null)
              }}
              className={
                viewIndex === i
                  ? 'rounded-sm bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700'
                  : 'rounded-sm bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors'
              }
            >
              {v.label}
            </button>
          ))}
        </div>

        <BodyMap
          view={currentView}
          hovered={hovered}
          onHover={setHovered}
          onSelect={setSelectedRegion}
        />

        <p className="mt-4 text-center text-sm text-slate-400">
          Click a body region to see related terms
        </p>
      </div>
  )
}
