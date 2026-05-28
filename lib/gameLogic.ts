import { GameState, BrushRecord } from './storage'

export const LEVELS = [
  { level: 1, xp: 0, title: 'Novato del Cepillo', emoji: '🪥' },
  { level: 2, xp: 50, title: 'Aprendiz Dental', emoji: '✨' },
  { level: 3, xp: 150, title: 'Higienista Junior', emoji: '💎' },
  { level: 4, xp: 300, title: 'Guerrero del Esmalte', emoji: '⚔️' },
  { level: 5, xp: 500, title: 'Caballero Dental', emoji: '🛡️' },
  { level: 6, xp: 800, title: 'Mago de la Pasta', emoji: '🧙' },
  { level: 7, xp: 1200, title: 'Señor del Cepillo', emoji: '👑' },
  { level: 8, xp: 1800, title: 'Emperador Dental', emoji: '🏰' },
  { level: 9, xp: 2500, title: 'Dios del Esmalte', emoji: '⚡' },
  { level: 10, xp: 3500, title: 'Leyenda Inmortal', emoji: '🌟' },
]

export const GUILT_MESSAGES = [
  'Tu mascota te está esperando...',
  'Las bacterias están ganando la batalla...',
  '¿No quieres decepcionar a Dientín, verdad?',
  'Tu aliento podría matar plantas...',
  'Cada minuto sin cepillarte, una bacteria celebra...',
  'Tu dentista está llorando en este momento...',
  '¿Sabías que la placa se endurece en 48 horas?',
  'Tu mascota está perdiendo la esperanza...',
  'Los dientes amarillos están de moda... ¿verdad?',
  'Tu cepillo de dientes te extraña...',
  '¿Quieres terminar como tu tío sin dientes?',
  'Las caries nunca duermen. ¿Y tú?',
  'Tu sonrisa del futuro depende de AHORA',
  'Dientín está llorando en un rincón...',
  '¿Sabías que puedes perder un diente HOY?',
]

export function getLevel(xp: number): { level: number; title: string; emoji: string; currentXp: number; nextXp: number; progress: number } {
  let current = LEVELS[0]
  let next = LEVELS[1]
  
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) {
      current = LEVELS[i]
      next = LEVELS[i + 1] || LEVELS[i]
    }
  }
  
  const progress = next.xp > current.xp 
    ? ((xp - current.xp) / (next.xp - current.xp)) * 100 
    : 100
  
  return {
    level: current.level,
    title: current.title,
    emoji: current.emoji,
    currentXp: xp - current.xp,
    nextXp: next.xp - current.xp,
    progress,
  }
}

export function calculateXpGain(state: GameState): number {
  let xp = 10
  if (state.streak >= 7) xp += 5
  if (state.streak >= 30) xp += 10
  if (state.streak >= 100) xp += 25
  return xp
}

export function getHoursSinceLastBrush(state: GameState): number {
  if (!state.lastBrush) return Infinity
  return (Date.now() - state.lastBrush) / (1000 * 60 * 60)
}

export function getPetMood(state: GameState): 'happy' | 'neutral' | 'sad' | 'sick' | 'dead' {
  const hours = getHoursSinceLastBrush(state)
  if (hours === Infinity) return 'sad'
  if (hours < 8) return 'happy'
  if (hours < 16) return 'neutral'
  if (hours < 24) return 'sad'
  if (hours < 48) return 'sick'
  return 'dead'
}

export function getGuiltMessage(state: GameState): string {
  const hours = getHoursSinceLastBrush(state)
  if (hours < 8) return '¡Excelente! Sigue así, campeón.'
  if (hours < 12) return 'Ya casi es hora de tu próximo cepillado...'
  if (hours < 16) return GUILT_MESSAGES[Math.floor(Math.random() * 5)]
  if (hours < 24) return GUILT_MESSAGES[5 + Math.floor(Math.random() * 5)]
  return GUILT_MESSAGES[10 + Math.floor(Math.random() * 5)]
}

export function shouldBrushNow(state: GameState): 'morning' | 'night' | null {
  const now = new Date()
  const hour = now.getHours()
  const [morningH, morningM] = state.settings.morningTime.split(':').map(Number)
  const [nightH, nightM] = state.settings.nightTime.split(':').map(Number)
  
  const todayMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), morningH, morningM)
  const todayNight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), nightH, nightM)
  
  const brushedToday = state.records.filter(r => {
    const d = new Date(r.timestamp)
    return d.toDateString() === now.toDateString()
  })
  
  const brushedMorning = brushedToday.some(r => r.type === 'morning')
  const brushedNight = brushedToday.some(r => r.type === 'night')
  
  if (hour >= morningH - 1 && hour <= morningH + 2 && !brushedMorning) return 'morning'
  if (hour >= nightH - 1 && hour <= nightH + 2 && !brushedNight) return 'night'
  
  return null
}

export function getTimeUntilNextBrush(state: GameState): { hours: number; minutes: number; type: 'morning' | 'night' } {
  const now = new Date()
  const [morningH, morningM] = state.settings.morningTime.split(':').map(Number)
  const [nightH, nightM] = state.settings.nightTime.split(':').map(Number)
  
  const todayMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), morningH, morningM)
  const todayNight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), nightH, nightM)
  const tomorrowMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, morningH, morningM)
  
  let target: Date
  let type: 'morning' | 'night'
  
  if (now < todayMorning) {
    target = todayMorning
    type = 'morning'
  } else if (now < todayNight) {
    target = todayNight
    type = 'night'
  } else {
    target = tomorrowMorning
    type = 'morning'
  }
  
  const diff = target.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return { hours, minutes, type }
}

export function updatePetStats(state: GameState): GameState {
  const hours = getHoursSinceLastBrush(state)
  let health = state.petHealth
  let happiness = state.petHappiness
  
  if (hours > 12) {
    happiness = Math.max(0, happiness - (hours - 12) * 2)
  }
  if (hours > 24) {
    health = Math.max(0, health - (hours - 24) * 3)
  }
  
  if (hours < 8) {
    health = Math.min(100, health + 5)
    happiness = Math.min(100, happiness + 10)
  }
  
  return { ...state, petHealth: health, petHappiness: happiness }
}

export function recordBrush(state: GameState, duration: number): { newState: GameState; xpGained: number; newAchievements: string[] } {
  const now = Date.now()
  const brushType = shouldBrushNow(state) || (new Date().getHours() < 14 ? 'morning' : 'night')
  
  const record: BrushRecord = {
    timestamp: now,
    type: brushType,
    duration,
  }
  
  let newStreak = state.streak
  const yesterday = new Date(now - 24 * 60 * 60 * 1000)
  const brushedYesterday = state.records.some(r => {
    const d = new Date(r.timestamp)
    return d.toDateString() === yesterday.toDateString()
  })
  
  const brushedToday = state.records.some(r => {
    const d = new Date(r.timestamp)
    return d.toDateString() === new Date(now).toDateString()
  })
  
  if (!brushedToday && (brushedYesterday || state.streak === 0)) {
    newStreak = state.streak + 1
  }
  
  const xpGained = calculateXpGain({ ...state, streak: newStreak })
  const newXp = state.xp + xpGained
  const newLevel = getLevel(newXp).level
  
  const newState: GameState = {
    ...state,
    streak: newStreak,
    maxStreak: Math.max(state.maxStreak, newStreak),
    totalBrushes: state.totalBrushes + 1,
    xp: newXp,
    level: newLevel,
    lastBrush: now,
    records: [...state.records, record],
    petHealth: Math.min(100, state.petHealth + 10),
    petHappiness: Math.min(100, state.petHappiness + 20),
  }
  
  return { newState, xpGained, newAchievements: [] }
}
