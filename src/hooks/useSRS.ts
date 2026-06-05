import { useState, useCallback } from 'react'

const STORAGE_KEY = 'srs-data'

export interface SRSCard {
  id: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: number
}

function loadCards(): Record<string, SRSCard> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveCards(cards: Record<string, SRSCard>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

function sm2(card: SRSCard, quality: number): SRSCard {
  const q = quality as 1 | 2 | 3 | 4
  let { easeFactor, interval, repetitions } = card

  if (q >= 3) {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  } else {
    repetitions = 0
    interval = 1
  }

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  if (easeFactor < 1.3) easeFactor = 1.3

  const nextReview = Date.now() + interval * 86400000

  return { easeFactor, interval, repetitions, nextReview, id: card.id }
}

export function useSRS() {
  const [cards, setCards] = useState<Record<string, SRSCard>>(loadCards)

  const getCard = useCallback(
    (id: string): SRSCard =>
      cards[id] ?? {
        id,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReview: 0,
      },
    [cards],
  )

  const rateCard = useCallback(
    (id: string, quality: number) => {
      setCards(prev => {
        const current = prev[id] ?? {
          id,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReview: 0,
        }
        const updated = sm2(current, quality)
        const next = { ...prev, [id]: updated }
        saveCards(next)
        return next
      })
    },
    [],
  )

  return { cards, getCard, rateCard }
}
