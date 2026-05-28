import { GameState } from './storage'

export interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  xpReward: number
  check: (state: GameState) => boolean
  secret?: boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_brush',
    title: 'Primera Vez',
    description: 'Cepíllate los dientes por primera vez',
    emoji: '🎉',
    xpReward: 20,
    check: (s) => s.totalBrushes >= 1,
  },
  {
    id: 'streak_3',
    title: 'Tres Días Seguidos',
    description: 'Mantén una racha de 3 días',
    emoji: '🔥',
    xpReward: 30,
    check: (s) => s.streak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Una Semana Perfecta',
    description: 'Mantén una racha de 7 días',
    emoji: '⭐',
    xpReward: 50,
    check: (s) => s.streak >= 7,
  },
  {
    id: 'streak_14',
    title: 'Dos Semanas de Acero',
    description: 'Mantén una racha de 14 días',
    emoji: '💪',
    xpReward: 80,
    check: (s) => s.streak >= 14,
  },
  {
    id: 'streak_30',
    title: 'Un Mes Legendario',
    description: 'Mantén una racha de 30 días',
    emoji: '🏆',
    xpReward: 150,
    check: (s) => s.streak >= 30,
  },
  {
    id: 'streak_100',
    title: 'Cien Días de Gloria',
    description: 'Mantén una racha de 100 días',
    emoji: '👑',
    xpReward: 500,
    check: (s) => s.streak >= 100,
  },
  {
    id: 'total_10',
    title: 'Diez Cepillados',
    description: 'Cepíllate 10 veces en total',
    emoji: '🪥',
    xpReward: 25,
    check: (s) => s.totalBrushes >= 10,
  },
  {
    id: 'total_50',
    title: 'Cincuenta Cepillados',
    description: 'Cepíllate 50 veces en total',
    emoji: '✨',
    xpReward: 60,
    check: (s) => s.totalBrushes >= 50,
  },
  {
    id: 'total_100',
    title: 'Cien Cepillados',
    description: 'Cepíllate 100 veces en total',
    emoji: '💎',
    xpReward: 100,
    check: (s) => s.totalBrushes >= 100,
  },
  {
    id: 'total_500',
    title: 'Quinientos Cepillados',
    description: 'Cepíllate 500 veces en total',
    emoji: '🌟',
    xpReward: 250,
    check: (s) => s.totalBrushes >= 500,
  },
  {
    id: 'level_5',
    title: 'Caballero Dental',
    description: 'Alcanza el nivel 5',
    emoji: '🛡️',
    xpReward: 100,
    check: (s) => s.level >= 5,
  },
  {
    id: 'level_10',
    title: 'Leyenda Inmortal',
    description: 'Alcanza el nivel máximo',
    emoji: '⚡',
    xpReward: 1000,
    check: (s) => s.level >= 10,
  },
  {
    id: 'pet_happy',
    title: 'Mascota Feliz',
    description: 'Mantén a tu mascota al 100% de felicidad',
    emoji: '😊',
    xpReward: 30,
    check: (s) => s.petHappiness >= 100,
  },
  {
    id: 'pet_health',
    title: 'Salud Perfecta',
    description: 'Mantén a tu mascota al 100% de salud',
    emoji: '❤️',
    xpReward: 30,
    check: (s) => s.petHealth >= 100,
  },
  {
    id: 'night_owl',
    title: 'Búho Nocturno',
    description: 'Cepíllate después de las 11 PM',
    emoji: '🦉',
    xpReward: 15,
    check: (s) => s.records.some(r => new Date(r.timestamp).getHours() >= 23),
    secret: true,
  },
  {
    id: 'early_bird',
    title: 'Madrugador',
    description: 'Cepíllate antes de las 6 AM',
    emoji: '🐦',
    xpReward: 15,
    check: (s) => s.records.some(r => new Date(r.timestamp).getHours() < 6),
    secret: true,
  },
  {
    id: 'marathon',
    title: 'Maratón Dental',
    description: 'Cepíllate por más de 5 minutos seguidos',
    emoji: '🏃',
    xpReward: 25,
    check: (s) => s.records.some(r => r.duration >= 300),
    secret: true,
  },
  {
    id: 'comeback',
    title: 'El Regreso',
    description: 'Vuelve a cepillarte después de perder una racha',
    emoji: '🔄',
    xpReward: 40,
    check: (s) => s.totalBrushes > 1 && s.streak === 1 && s.maxStreak > 1,
    secret: true,
  },
]

export function checkNewAchievements(state: GameState): { newAchievements: Achievement[]; updatedState: GameState } {
  const newAchievements: Achievement[] = []
  
  for (const achievement of ACHIEVEMENTS) {
    if (!state.achievements.includes(achievement.id) && achievement.check(state)) {
      newAchievements.push(achievement)
    }
  }
  
  if (newAchievements.length > 0) {
    const newIds = newAchievements.map(a => a.id)
    const bonusXp = newAchievements.reduce((sum, a) => sum + a.xpReward, 0)
    
    const updatedState: GameState = {
      ...state,
      achievements: [...state.achievements, ...newIds],
      xp: state.xp + bonusXp,
    }
    
    return { newAchievements, updatedState }
  }
  
  return { newAchievements: [], updatedState: state }
}
