'use client'

import { motion } from 'framer-motion'
import { GameState } from '@/lib/storage'
import { Flame, Trophy } from 'lucide-react'

interface StreakProps {
  state: GameState
}

export default function Streak({ state }: StreakProps) {
  const streakColor = state.streak >= 30 
    ? 'from-purple-500 via-pink-500 to-rose-500' 
    : state.streak >= 14 
    ? 'from-orange-500 via-red-500 to-pink-500' 
    : state.streak >= 7 
    ? 'from-yellow-500 via-amber-500 to-orange-500'
    : 'from-blue-500 via-cyan-500 to-teal-500'
  
  const glowColor = state.streak >= 30 
    ? 'shadow-purple-500/50' 
    : state.streak >= 14 
    ? 'shadow-orange-500/50' 
    : state.streak >= 7 
    ? 'shadow-yellow-500/50'
    : 'shadow-blue-500/50'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-3xl p-8 border border-white/10 shadow-2xl"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Flame className={`w-10 h-10 ${state.streak > 0 ? 'text-orange-500' : 'text-slate-600'}`} />
          <span className="text-5xl font-black text-white">
            {state.streak}
          </span>
        </div>
        
        <p className="text-sm text-slate-400 font-medium">
          {state.streak === 0 ? '¡Empieza tu racha hoy!' : `${state.streak} días seguidos`}
        </p>
        
        {state.streak > 0 && (
          <div
            className={`w-full h-1.5 bg-gradient-to-r ${streakColor} rounded-full shadow-lg ${glowColor}`}
          />
        )}
        
        <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-slate-800/50 rounded-full backdrop-blur-sm">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-xs text-slate-400 font-medium">Récord: {state.maxStreak} días</span>
        </div>
        
        {state.streak >= 7 && (
          <div className="mt-3 px-4 py-2 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 rounded-full border border-yellow-500/30 backdrop-blur-sm">
            <span className="text-sm text-yellow-400 font-bold">
              🔥 x{state.streak >= 100 ? 4 : state.streak >= 30 ? 3 : state.streak >= 7 ? 2 : 1} XP BONUS
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
