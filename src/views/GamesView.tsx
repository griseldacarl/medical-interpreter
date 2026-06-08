import { useState, useMemo, useCallback } from 'react'
import type { BodySystem, LanguageCode } from '../types/flashcard'
import { filterBySystem } from '../data'
import { DeckSelector } from '../components/DeckSelector'
import { GameMenu } from '../components/games/GameMenu'
import { FillInBlank } from '../components/games/FillInBlank'
import { MatchingGame } from '../components/games/MatchingGame'
import { RearrangeSentence } from '../components/games/RearrangeSentence'
import { GuessSentence } from '../components/games/GuessSentence'
import { PictureMatch } from '../components/games/PictureMatch'
import { ResultsScreen } from '../components/games/ResultsScreen'
import type { GameType, GameResults } from '../components/games/types'

interface GamesViewProps {
  system: BodySystem | 'all'
  sourceLang: LanguageCode
  onSystemChange: (s: BodySystem | 'all') => void
  onLangChange: (l: LanguageCode) => void
}

type Phase = 'menu' | 'playing' | 'results'

const GAME_LIST: GameType[] = ['fill-in-blank', 'matching', 'rearrange', 'guess-sentence', 'picture-match']

export function GamesView({ system, sourceLang, onSystemChange, onLangChange }: GamesViewProps) {
  const [phase, setPhase] = useState<Phase>('menu')
  const [gameType, setGameType] = useState<GameType | null>(null)
  const [gameResults, setGameResults] = useState<GameResults | null>(null)
  const [gameKey, setGameKey] = useState(0)

  const filtered = useMemo(() => {
    const bySystem = filterBySystem(system)
    return bySystem.filter(t => sourceLang in t.translations)
  }, [system, sourceLang])

  const availableGames = useMemo(() => {
    const hasInterview = filtered.some(t => t.system === 'interview')
    const hasImages = filtered.some(t => !!t.imageFile)
    const hasTerms = filtered.length >= 4
    return {
      'fill-in-blank': hasTerms,
      'matching': hasTerms,
      'rearrange': hasInterview,
      'guess-sentence': hasInterview,
      'picture-match': hasImages,
    }
  }, [filtered])

  const handleSelectGame = useCallback((game: GameType) => {
    setGameType(game)
    setPhase('playing')
    setGameKey(k => k + 1)
  }, [])

  const handleRandomGame = useCallback(() => {
    const available = GAME_LIST.filter(g => availableGames[g])
    if (available.length === 0) return
    const pick = available[Math.floor(Math.random() * available.length)]
    setGameType(pick)
    setPhase('playing')
    setGameKey(k => k + 1)
  }, [availableGames])

  const handleComplete = useCallback((results: GameResults) => {
    setGameResults(results)
    setPhase('results')
  }, [])

  const handlePlayAgain = useCallback(() => {
    setPhase('playing')
    setGameKey(k => k + 1)
  }, [])

  const handleMenu = useCallback(() => {
    setPhase('menu')
    setGameType(null)
    setGameResults(null)
  }, [])

  function renderGame() {
    if (!gameType) return null

    const props = {
      terms: filtered,
      sourceLang,
      onComplete: handleComplete,
    }

    const key = `${gameType}-${gameKey}`
    switch (gameType) {
      case 'fill-in-blank': return <FillInBlank key={key} {...props} />
      case 'matching': return <MatchingGame key={key} {...props} />
      case 'rearrange': return <RearrangeSentence key={key} {...props} />
      case 'guess-sentence': return <GuessSentence key={key} {...props} />
      case 'picture-match': return <PictureMatch key={key} {...props} />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <aside className="border-b border-slate-200 bg-slate-50 lg:w-60 lg:border-b-0 lg:border-r">
        <DeckSelector
          selectedSystem={system}
          onSelectSystem={s => {
            onSystemChange(s)
            if (phase === 'playing' || phase === 'results') {
              setPhase('menu')
              setGameType(null)
              setGameResults(null)
            }
          }}
          sourceLang={sourceLang}
          onSelectLang={l => {
            onLangChange(l)
            if (phase === 'playing' || phase === 'results') {
              setPhase('menu')
              setGameType(null)
              setGameResults(null)
            }
          }}
        />
      </aside>
      <main className="flex flex-1 flex-col items-center justify-start p-4 pt-8 sm:p-6 sm:pt-12">
        {phase === 'menu' && (
          <div className="w-full">
            <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">Games</h2>
            <GameMenu
              terms={filtered}
              onSelectGame={handleSelectGame}
              onRandomGame={handleRandomGame}
            />
          </div>
        )}
        {phase === 'playing' && renderGame()}
        {phase === 'results' && gameResults && (
          <ResultsScreen
            results={gameResults}
            onPlayAgain={handlePlayAgain}
            onMenu={handleMenu}
          />
        )}
      </main>
    </div>
  )
}
