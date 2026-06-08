import type { View } from '../App'

interface NavBarProps {
  currentView: View
  onHome: () => void
  onStudy: () => void
  onQuiz: () => void
  onSearch: () => void
  onBodySearch: () => void
  onGames: () => void
}

export function NavBar({ currentView, onHome, onStudy, onQuiz, onSearch, onBodySearch, onGames }: NavBarProps) {
  const tabs: { view: View; label: string; icon: string; active: string; inactive: string }[] = [
    { view: 'study', label: 'Study', icon: 'library_books', active: 'text-amber-600 bg-amber-100', inactive: 'text-slate-400' },
    { view: 'search', label: 'Search', icon: 'search', active: 'text-violet-600 bg-violet-100', inactive: 'text-slate-400' },
    { view: 'bodySearch', label: 'Body', icon: 'accessibility_new', active: 'text-purple-600 bg-purple-100', inactive: 'text-slate-400' },
    { view: 'games', label: 'Games', icon: 'sports_esports', active: 'text-green-600 bg-green-100', inactive: 'text-slate-400' },
    { view: 'quiz', label: 'Quiz', icon: 'quiz', active: 'text-cyan-600 bg-cyan-100', inactive: 'text-slate-400' },
  ]

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 h-12">
        <button
          type="button"
          onClick={onHome}
          className="flex items-center gap-1.5 text-sm font-bold text-slate-700 tracking-tight"
        >
          <span className="material-symbols-outlined text-amber-600 text-lg">language</span>
          Medical Interpreter
        </button>
        <div className="flex gap-0.5">
          {tabs.map(t => (
            <button
              key={t.view}
              type="button"
              onClick={
                t.view === 'study' ? onStudy :
                t.view === 'search' ? onSearch :
                t.view === 'bodySearch' ? onBodySearch :
                t.view === 'games' ? onGames :
                onQuiz
              }
              className={`flex items-center gap-1 rounded-sm px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                currentView === t.view
                  ? t.active
                  : `${t.inactive} hover:text-slate-600`
              }`}
            >
              <span className="material-symbols-outlined text-base">{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
