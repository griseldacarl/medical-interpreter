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
        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search across 266 terms in all 9 languages..."
          className="w-full rounded border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
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
          <span className="material-symbols-outlined text-4xl">search_off</span>
          <p className="text-sm">No results found for "{query.trim()}"</p>
        </div>
      )}

      {!query.trim() && (
        <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
          <span className="material-symbols-outlined text-4xl">search</span>
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
