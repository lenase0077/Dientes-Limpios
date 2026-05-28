'use client'

import { motion } from 'framer-motion'
import { GameState } from '@/lib/storage'
import { getPetMood } from '@/lib/gameLogic'

interface PetProps {
  state: GameState
}

export default function Pet({ state }: PetProps) {
  const mood = getPetMood(state)
  
  const petEmojis = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
    sick: '🤒',
    dead: '💀',
  }
  
  const petColors = {
    happy: 'from-emerald-400 via-green-500 to-teal-600',
    neutral: 'from-amber-400 via-yellow-500 to-orange-500',
    sad: 'from-orange-400 via-red-500 to-rose-600',
    sick: 'from-purple-400 via-pink-500 to-fuchsia-600',
    dead: 'from-slate-600 via-gray-700 to-slate-800',
  }
  
  const messages = {
    happy: `¡${state.petName} está radiante!`,
    neutral: `${state.petName} te espera...`,
    sad: `${state.petName} necesita amor...`,
    sick: `¡${state.petName} está sufriendo!`,
    dead: `${state.petName} ha partido...`,
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-8 border border-white/10 shadow-2xl"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{
            scale: mood === 'happy' ? [1, 1.05, 1] : 1,
            rotate: mood === 'sad' || mood === 'sick' ? [-2, 2, -2] : 0,
          }}
          transition={{
            duration: mood === 'happy' ? 2 : 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`relative w-36 h-36 rounded-full bg-gradient-to-br ${petColors[mood]} flex items-center justify-center text-7xl shadow-2xl ring-4 ring-white/10`}
        >
          <span className="drop-shadow-2xl">{petEmojis[mood]}</span>
          {mood === 'happy' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-3 -right-3 text-3xl"
            >
              ✨
            </motion.div>
          )}
          {mood === 'dead' && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-5xl">⚰️</span>
            </div>
          )}
        </motion.div>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-1">{state.petName}</h3>
          <p className="text-sm text-slate-400">{messages[mood]}</p>
        </div>
        
        <div className="w-full space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <span className="text-red-500">❤️</span> Salud
              </span>
              <span className="text-sm font-bold text-white">{Math.round(state.petHealth)}%</span>
            </div>
            <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${state.petHealth}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 shadow-lg shadow-pink-500/50"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <span className="text-yellow-500">😊</span> Felicidad
              </span>
              <span className="text-sm font-bold text-white">{Math.round(state.petHappiness)}%</span>
            </div>
            <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${state.petHappiness}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 shadow-lg shadow-amber-500/50"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
