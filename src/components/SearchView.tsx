import { useMemo, useState } from 'react'
import { allTerms } from '../data'
import { ResultCard } from './ResultCard'

export function SearchView() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return allTerms.filter(entry =>
      entry.id.toLowerCase().includes(q) ||
      Object.values(entry.translations).some(t => t.toLowerCase().includes(q)),
    )
  }, [query])

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="relative mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search across 266 terms in all 9 languages..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          autoFocus
        />
      </div>

      {query.trim() && results.length > 0 && (
        <p className="mb-4 text-xs text-slate-400">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query.trim()}"
        </p>
      )}

      {query.trim() && results.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm">No results found for "{query.trim()}"</p>
        </div>
      )}

      {!query.trim() && (
        <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm">Type a word to search across all 266 terms</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map(entry => (
          <ResultCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
