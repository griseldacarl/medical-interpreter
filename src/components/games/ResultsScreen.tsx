import type { GameResults, GameType } from './types'

interface ResultsScreenProps {
  results: GameResults
  onPlayAgain: () => void
  onMenu: () => void
}

const GAME_NAMES: Record<GameType, string> = {
  'fill-in-blank': 'Fill in the Blank',
  'matching': 'Matching Game',
  'rearrange': 'Rearrange Sentence',
  'guess-sentence': 'Guess the Sentence',
  'picture-match': 'Picture Match',
}

const GAME_ICONS: Record<GameType, string> = {
  'fill-in-blank': 'edit_note',
  'matching': 'link',
  'rearrange': 'shuffle',
  'guess-sentence': 'psychology',
  'picture-match': 'image',
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}m ${secs}s`
}

export function ResultsScreen({ results, onPlayAgain, onMenu }: ResultsScreenProps) {
  const percentage = Math.round((results.score / results.total) * 100)

  let stars = 0
  if (percentage >= 90) stars = 5
  else if (percentage >= 75) stars = 4
  else if (percentage >= 60) stars = 3
  else if (percentage >= 40) stars = 2
  else stars = 1

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mb-6">
        <span className={`material-symbols-outlined text-6xl ${
          percentage >= 60 ? 'text-green-600' : 'text-amber-600'
        }`}>
          {GAME_ICONS[results.gameType]}
        </span>
      </div>

      <h2 className="mb-1 text-2xl font-bold text-slate-800">
        {GAME_NAMES[results.gameType]}
      </h2>
      <p className="mb-6 text-slate-500">Complete!</p>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-5xl font-bold text-slate-800">
          {results.score}
          <span className="text-2xl text-slate-400">/{results.total}</span>
        </div>

        <div className="mb-4 text-lg font-medium text-slate-600">
          {percentage}% correct
        </div>

        <div className="mb-4 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <span
              key={s}
              className={`material-symbols-outlined text-2xl ${
                s <= stars ? 'text-amber-500' : 'text-slate-200'
              }`}
            >
              star
            </span>
          ))}
        </div>

        <div className="space-y-2 text-sm text-slate-500">
          <p>Time: {formatTime(results.timeMs)}</p>
          {results.wrongAttempts !== undefined && (
            <p>Wrong guesses: {results.wrongAttempts}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700"
        >
          Play Again
        </button>
        <button
          type="button"
          onClick={onMenu}
          className="rounded border border-slate-300 bg-white px-8 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
        >
          Menu
        </button>
      </div>
    </div>
  )
}
