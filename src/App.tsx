import { useState } from 'react'
import type { BodySystem, LanguageCode } from './types/flashcard'
import { NavBar } from './components/NavBar'
import { SearchView } from './components/SearchView'
import { BodySearch } from './components/BodySearch'
import { StudyView } from './views/StudyView'
import { QuizView } from './views/QuizView'

export type View = 'home' | 'study' | 'quiz' | 'search' | 'bodySearch'

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
        />
        <BodySearch />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 p-6">
      <h1 className="text-4xl font-bold text-slate-800">Medical Interpreter</h1>
      <p className="text-lg text-slate-500">
        Learn medical terminology in 9 languages
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => setView('study')}
          className="rounded-xl bg-teal-600 px-8 py-4 text-lg font-medium text-white shadow-lg hover:bg-teal-700"
        >
          Study
        </button>
        <button
          type="button"
          onClick={() => setView('quiz')}
          className="rounded-xl bg-cyan-600 px-8 py-4 text-lg font-medium text-white shadow-lg hover:bg-cyan-700"
        >
          Quiz
        </button>
        <button
          type="button"
          onClick={() => setView('search')}
          className="rounded-xl bg-violet-600 px-8 py-4 text-lg font-medium text-white shadow-lg hover:bg-violet-700"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setView('bodySearch')}
          className="rounded-xl bg-purple-600 px-8 py-4 text-lg font-medium text-white shadow-lg hover:bg-purple-700"
        >
          Body Search
        </button>
      </div>
    </div>
  )
}
