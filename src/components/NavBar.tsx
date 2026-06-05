import type { View } from '../App'

interface NavBarProps {
  currentView: View
  onHome: () => void
  onStudy: () => void
  onQuiz: () => void
  onSearch: () => void
  onBodySearch: () => void
}

export function NavBar({ currentView, onHome, onStudy, onQuiz, onSearch, onBodySearch }: NavBarProps) {
  return (
    <nav className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      <button
        type="button"
        onClick={onHome}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.69-8.69a2.25 2.25 0 00-3.18 0l-8.69 8.69a.75.75 0 001.06 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159A2.25 2.25 0 0121 15.159v5.091a.75.75 0 01-.75.75h-5.25a.75.75 0 01-.75-.75v-3.75a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v3.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-5.091a2.25 2.25 0 01.659-1.591L12 5.432z" />
        </svg>
        Home
      </button>

      <div className="flex gap-1">
        <button
          type="button"
          onClick={onStudy}
          className={
            currentView === 'study'
              ? 'rounded-lg bg-teal-100 px-3 py-1.5 text-sm font-medium text-teal-700 sm:px-5'
              : 'rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors sm:px-5'
          }
        >
          Study
        </button>
        <button
          type="button"
          onClick={onSearch}
          className={
            currentView === 'search'
              ? 'rounded-lg bg-violet-100 px-3 py-1.5 text-sm font-medium text-violet-700 sm:px-5'
              : 'rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors sm:px-5'
          }
        >
          Search
        </button>
        <button
          type="button"
          onClick={onBodySearch}
          className={
            currentView === 'bodySearch'
              ? 'rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 sm:px-5'
              : 'rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors sm:px-5'
          }
        >
          Body
        </button>
        <button
          type="button"
          onClick={onQuiz}
          className={
            currentView === 'quiz'
              ? 'rounded-lg bg-cyan-100 px-3 py-1.5 text-sm font-medium text-cyan-700 sm:px-5'
              : 'rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors sm:px-5'
          }
        >
          Quiz
        </button>
      </div>
    </nav>
  )
}
