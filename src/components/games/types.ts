export type GameType = 'fill-in-blank' | 'matching' | 'rearrange' | 'guess-sentence' | 'picture-match'

export interface GameResults {
  gameType: GameType
  score: number
  total: number
  timeMs: number
  wrongAttempts?: number
}
