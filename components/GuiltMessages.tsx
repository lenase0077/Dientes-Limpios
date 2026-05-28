'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState } from '@/lib/storage'
import { getGuiltMessage, getHoursSinceLastBrush, getTimeUntilNextBrush } from '@/lib/gameLogic'
import { Clock } from 'lucide-react'

interface GuiltMessagesProps {
  state: GameState
}

export default function GuiltMessages({ state }: GuiltMessagesProps) {
  const [message, setMessage] = useState('')
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; type: 'morning' | 'night' }>({ hours: 0, minutes: 0, type: 'morning' })
  
  useEffect(() => {
    setMessage(getGuiltMessage(state))
    setTimeLeft(getTimeUntilNextBrush(state))
    
    const interval = setInterval(() => {
      setMessage(getGuiltMessage(state))
      setTimeLeft(getTimeUntilNextBrush(state))
    }, 60000)
    
    return () => clearInterval(interval)
  }, [state])
  
  const hours = getHoursSinceLastBrush(state)
  const urgency = hours > 16 ? 'critical' : hours > 12 ? 'warning' : 'info'
  
  const urgencyStyles = {
    critical: 'from-red-500/20 via-pink-500/20 to-rose-500/20 border-red-500/40',
    warning: 'from-orange-500/20 via-amber-500/20 to-yellow-500/20 border-orange-500/40',
    info: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20 border-blue-500/40',
  }
  
  const urgencyIcons = {
    critical: '🚨',
    warning: '⚠️',
    info: '💡',
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-3xl p-6 border backdrop-blur-sm ${urgencyStyles[urgency]}`}
    >
      <div className="flex items-start gap-4">
        <motion.span
          animate={urgency === 'critical' ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-3xl"
        >
          {urgencyIcons[urgency]}
        </motion.span>
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-base font-semibold text-white"
            >
              {message}
            </motion.p>
          </AnimatePresence>
          
          {hours !== Infinity && hours > 8 && (
            <p className="text-sm text-slate-400 mt-2">
              Último cepillado: hace {Math.floor(hours)} horas
            </p>
          )}
          
          {hours === Infinity && (
            <p className="text-sm text-slate-400 mt-2">
              Aún no te has cepillado. ¡Empieza ahora!
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <Clock className="w-4 h-4 text-slate-500" />
        <span className="text-sm text-slate-400">
          Próximo cepillado {timeLeft.type === 'morning' ? 'matutino' : 'nocturno'} en:{' '}
          <span className="text-white font-bold">
            {timeLeft.hours}h {timeLeft.minutes}m
          </span>
        </span>
      </div>
    </motion.div>
  )
}
