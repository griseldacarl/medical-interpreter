import { useMemo } from 'react'
import type { TranslationEntry } from '../../types/flashcard'
import type { GameType } from './types'

interface GameMenuProps {
  terms: TranslationEntry[]
  onSelectGame: (game: GameType) => void
  onRandomGame: () => void
}

const GAMES: { type: GameType; title: string; description: string; icon: string }[] = [
  { type: 'fill-in-blank', title: 'Fill in the Blank', description: 'Complete the term by filling in blank characters', icon: 'edit_note' },
  { type: 'matching', title: 'Matching Game', description: 'Match 4 source terms to their English translations', icon: 'link' },
  { type: 'rearrange', title: 'Rearrange Sentence', description: 'Put jumbled words into the correct order', icon: 'shuffle' },
  { type: 'guess-sentence', title: 'Guess the Sentence', description: 'Identify the full sentence from the beginning or ending', icon: 'psychology' },
  { type: 'picture-match', title: 'Picture Match', description: 'Match anatomy images to the correct term', icon: 'image' },
]

export function GameMenu({ terms, onSelectGame, onRandomGame }: GameMenuProps) {
  const availability = useMemo(() => {
    const hasInterview = terms.some(t => t.system === 'interview')
    const hasImages = terms.some(t => !!t.imageFile)
    const hasTerms = terms.length >= 4
    return {
      'fill-in-blank': hasTerms,
      'matching': hasTerms,
      'rearrange': hasInterview,
      'guess-sentence': hasInterview,
      'picture-match': hasImages,
    }
  }, [terms])

  const availableGames = useMemo(
    () => GAMES.filter(g => availability[g.type]),
    [availability],
  )

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onRandomGame}
        disabled={availableGames.length === 0}
        className={`mb-8 flex w-full items-center justify-center gap-3 rounded-lg px-6 py-5 text-lg font-bold shadow-md transition-colors ${
          availableGames.length === 0
            ? 'cursor-not-allowed bg-slate-300 text-slate-500'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        <span className="material-symbols-outlined text-3xl">casino</span>
        Play Random Game
        <span className="text-sm font-normal opacity-80">— surprise me!</span>
      </button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GAMES.map(game => {
          const available = availability[game.type]
          return (
            <div
              key={game.type}
              className={`rounded-lg border bg-white p-5 shadow-sm transition-shadow ${
                available
                  ? 'border-slate-200 hover:border-green-300 hover:shadow-md'
                  : 'border-slate-100 opacity-50'
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className={`material-symbols-outlined text-2xl ${
                  available ? 'text-green-600' : 'text-slate-400'
                }`}>
                  {game.icon}
                </span>
                <h3 className={`text-lg font-semibold ${
                  available ? 'text-slate-800' : 'text-slate-500'
                }`}>
                  {game.title}
                </h3>
              </div>
              <p className={`mb-4 text-sm ${
                available ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {game.description}
              </p>
              {available ? (
                <button
                  type="button"
                  onClick={() => onSelectGame(game.type)}
                  className="rounded bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Play
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  {game.type === 'rearrange' || game.type === 'guess-sentence'
                    ? 'Requires interview data'
                    : game.type === 'picture-match'
                      ? 'Requires terms with images'
                      : 'Need at least 4 terms'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
