'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState } from '@/lib/storage'
import { shouldBrushNow } from '@/lib/gameLogic'
import { Sparkles } from 'lucide-react'

interface BrushButtonProps {
  state: GameState
  onBrush: (duration: number) => void
}

export default function BrushButton({ state, onBrush }: BrushButtonProps) {
  const [brushing, setBrushing] = useState(false)
  const [timer, setTimer] = useState(120)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const brushType = shouldBrushNow(state)
  const canBrush = brushType !== null || !state.lastBrush || (Date.now() - state.lastBrush > 4 * 60 * 60 * 1000)
  
  const startBrushing = useCallback(() => {
    setBrushing(true)
    setTimer(120)
  }, [])
  
  const stopBrushing = useCallback(() => {
    const duration = 120 - timer
    setBrushing(false)
    setTimer(120)
    if (duration >= 30) {
      onBrush(duration)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [timer, onBrush])
  
  useEffect(() => {
    if (!brushing) return
    
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          stopBrushing()
          return 120
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [brushing, stopBrushing])
  
  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60
  const progress = ((120 - timer) / 120) * 100
  
  if (brushing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass rounded-3xl p-10 border border-white/10 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="84"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-slate-700/50"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="84"
                stroke="url(#gradient)"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 84}`}
                strokeDashoffset={`${2 * Math.PI * 84 * (1 - progress / 100)}`}
                strokeLinecap="round"
                animate={{
                  strokeDashoffset: `${2 * Math.PI * 84 * (1 - progress / 100)}`,
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                key={timer}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-5xl font-mono font-bold text-white"
              >
                {minutes}:{seconds.toString().padStart(2, '0')}
              </motion.span>
            </div>
          </div>
          
          <div className="text-center">
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl text-cyan-300 font-bold"
            >
              ¡Sigue cepillando!
            </motion.p>
            <p className="text-sm text-slate-400 mt-2">
              {timer > 60 ? '¡Vas muy bien!' : '¡Casi terminas!'}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopBrushing}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/50"
          >
            Terminar ({120 - timer}s)
          </motion.button>
        </div>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative"
    >
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6 }}
              className="text-7xl"
            >
              🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={canBrush ? { scale: 1.02, y: -2 } : {}}
        whileTap={canBrush ? { scale: 0.98 } : {}}
        onClick={startBrushing}
        disabled={!canBrush}
        className={`
          w-full p-8 rounded-3xl font-bold text-lg transition-all
          ${canBrush 
            ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white shadow-2xl shadow-blue-500/50' 
            : 'bg-slate-800/50 text-slate-500 cursor-not-allowed backdrop-blur-sm'}
        `}
      >
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6" />
          <span className="text-xl">
            {brushType === 'morning' 
              ? '¡Cepillado Matutino!' 
              : brushType === 'night' 
              ? '¡Cepillado Nocturno!' 
              : canBrush 
              ? '¡Cepillarme Ahora!' 
              : 'Ya te cepillaste'}
          </span>
        </div>
        {canBrush && (
          <p className="text-sm mt-3 opacity-80">
            Mantén presionado 2 minutos para XP completo
          </p>
        )}
      </motion.button>
    </motion.div>
  )
}
