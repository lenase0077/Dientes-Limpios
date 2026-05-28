export interface BrushRecord {
  timestamp: number
  type: 'morning' | 'night'
  duration: number
}

export interface GameState {
  streak: number
  maxStreak: number
  totalBrushes: number
  xp: number
  level: number
  petHealth: number
  petHappiness: number
  petName: string
  lastBrush: number | null
  records: BrushRecord[]
  achievements: string[]
  settings: {
    morningTime: string
    nightTime: string
    theme: 'light' | 'dark'
    notifications: boolean
  }
  createdAt: number
}

const STORAGE_KEY = 'dientes-game-state'

export const defaultState: GameState = {
  streak: 0,
  maxStreak: 0,
  totalBrushes: 0,
  xp: 0,
  level: 1,
  petHealth: 100,
  petHappiness: 100,
  petName: 'Dientín',
  lastBrush: null,
  records: [],
  achievements: [],
  settings: {
    morningTime: '08:00',
    nightTime: '22:00',
    theme: 'dark',
    notifications: true,
  },
  createdAt: Date.now(),
}

export function loadState(): GameState {
  if (typeof window === 'undefined') return defaultState
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return defaultState
  try {
    return { ...defaultState, ...JSON.parse(stored) }
  } catch {
    return defaultState
  }
}

export function saveState(state: GameState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
