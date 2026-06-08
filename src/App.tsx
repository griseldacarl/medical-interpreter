import { useState } from 'react'
import type { BodySystem, LanguageCode } from './types/flashcard'
import { NavBar } from './components/NavBar'
import { SearchView } from './components/SearchView'
import { BodySearch } from './components/BodySearch'
import { StudyView } from './views/StudyView'
import { QuizView } from './views/QuizView'
import { GamesView } from './views/GamesView'
import { EmergencyView } from './components/emergency/EmergencyView'

export type View = 'home' | 'study' | 'quiz' | 'search' | 'bodySearch' | 'games' | 'emergency'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [system, setSystem] = useState<BodySystem | 'all'>('all')
  const [sourceLang, setSourceLang] = useState<LanguageCode>('fr')

  if (view === 'study') {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <NavBar
          currentView="study"
          onHome={() => setView('home')}
          onStudy={() => {}}
          onQuiz={() => setView('quiz')}
          onSearch={() => setView('search')}
          onBodySearch={() => setView('bodySearch')}
          onGames={() => setView('games')}
        />
        <StudyView
          system={system}
          sourceLang={sourceLang}
          onSystemChange={setSystem}
          onLangChange={setSourceLang}
        />
      </div>
    )
  }

  if (view === 'quiz') {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <NavBar
          currentView="quiz"
          onHome={() => setView('home')}
          onStudy={() => setView('study')}
          onQuiz={() => {}}
          onSearch={() => setView('search')}
          onBodySearch={() => setView('bodySearch')}
          onGames={() => setView('games')}
        />
        <QuizView
          system={system}
          sourceLang={sourceLang}
          onSystemChange={setSystem}
          onLangChange={setSourceLang}
        />
      </div>
    )
  }

  if (view === 'search') {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <NavBar
          currentView="search"
          onHome={() => setView('home')}
          onStudy={() => setView('study')}
          onQuiz={() => setView('quiz')}
          onSearch={() => {}}
          onBodySearch={() => setView('bodySearch')}
          onGames={() => setView('games')}
        />
        <SearchView />
      </div>
    )
  }

  if (view === 'bodySearch') {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <NavBar
          currentView="bodySearch"
          onHome={() => setView('home')}
          onStudy={() => setView('study')}
          onQuiz={() => setView('quiz')}
          onSearch={() => setView('search')}
          onBodySearch={() => {}}
          onGames={() => setView('games')}
        />
        <BodySearch />
      </div>
    )
  }

  if (view === 'games') {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <NavBar
          currentView="games"
          onHome={() => setView('home')}
          onStudy={() => setView('study')}
          onQuiz={() => setView('quiz')}
          onSearch={() => setView('search')}
          onBodySearch={() => setView('bodySearch')}
          onGames={() => {}}
        />
        <GamesView
          system={system}
          sourceLang={sourceLang}
          onSystemChange={setSystem}
          onLangChange={setSourceLang}
        />
      </div>
    )
  }

  if (view === 'emergency') {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <NavBar
          currentView="emergency"
          onHome={() => setView('home')}
          onStudy={() => setView('study')}
          onQuiz={() => setView('quiz')}
          onSearch={() => setView('search')}
          onBodySearch={() => setView('bodySearch')}
          onGames={() => setView('games')}
        />
        <EmergencyView />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-slate-50 p-8">
      <div className="text-center">
        <span className="material-symbols-outlined text-5xl text-amber-600 mb-3">language</span>
        <h1 className="text-5xl font-serif font-bold text-slate-800">Medical Interpreter</h1>
        <p className="mt-2 text-base text-slate-400">
          Learn medical terminology in 9 languages
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          type="button"
          onClick={() => setView('study')}
          className="flex items-center gap-3 rounded bg-amber-600 px-6 py-4 text-base font-semibold text-white shadow-md hover:bg-amber-700"
        >
          <span className="material-symbols-outlined">library_books</span>
          Study
        </button>
        <button
          type="button"
          onClick={() => setView('quiz')}
          className="flex items-center gap-3 rounded bg-cyan-600 px-6 py-4 text-base font-semibold text-white shadow-md hover:bg-cyan-700"
        >
          <span className="material-symbols-outlined">quiz</span>
          Quiz
        </button>
        <button
          type="button"
          onClick={() => setView('search')}
          className="flex items-center gap-3 rounded bg-violet-600 px-6 py-4 text-base font-semibold text-white shadow-md hover:bg-violet-700"
        >
          <span className="material-symbols-outlined">search</span>
          Search
        </button>
        <button
          type="button"
          onClick={() => setView('bodySearch')}
          className="flex items-center gap-3 rounded bg-purple-600 px-6 py-4 text-base font-semibold text-white shadow-md hover:bg-purple-700"
        >
          <span className="material-symbols-outlined">accessibility_new</span>
          Body Search
        </button>
        <button
          type="button"
          onClick={() => setView('games')}
          className="flex items-center gap-3 rounded bg-green-600 px-6 py-4 text-base font-semibold text-white shadow-md hover:bg-green-700"
        >
          <span className="material-symbols-outlined">sports_esports</span>
          Games
        </button>
        <button
          type="button"
          onClick={() => setView('emergency')}
          className="flex items-center gap-3 rounded bg-amber-600 px-6 py-4 text-base font-semibold text-white shadow-md hover:bg-amber-700"
        >
          <span className="material-symbols-outlined">local_hospital</span>
          Emergency Medicine
        </button>
      </div>
    </div>
  )
}
