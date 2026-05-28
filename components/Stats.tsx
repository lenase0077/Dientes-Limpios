'use client'

import { motion } from 'framer-motion'
import { GameState } from '@/lib/storage'
import { getLevel } from '@/lib/gameLogic'
import { Zap, Target, Calendar, Award } from 'lucide-react'

interface StatsProps {
  state: GameState
}

export default function Stats({ state }: StatsProps) {
  const levelInfo = getLevel(state.xp)
  
  const stats = [
    { icon: Zap, label: 'XP Total', value: state.xp.toLocaleString(), color: 'text-yellow-500', bg: 'from-yellow-500/20 to-amber-500/20' },
    { icon: Target, label: 'Cepillados', value: state.totalBrushes.toString(), color: 'text-cyan-500', bg: 'from-cyan-500/20 to-blue-500/20' },
    { icon: Calendar, label: 'Días Activo', value: Math.floor((Date.now() - state.createdAt) / (1000 * 60 * 60 * 24)).toString(), color: 'text-green-500', bg: 'from-green-500/20 to-emerald-500/20' },
    { icon: Award, label: 'Logros', value: `${state.achievements.length}`, color: 'text-purple-500', bg: 'from-purple-500/20 to-pink-500/20' },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-3xl p-8 border border-white/10 shadow-2xl"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {levelInfo.emoji}
            </span>
            <div>
              <h3 className="text-xl font-bold text-white">Nivel {levelInfo.level}</h3>
              <p className="text-sm text-slate-400">{levelInfo.title}</p>
            </div>
          </div>
          <span className="text-sm text-slate-500 font-medium">
            {levelInfo.currentXp} / {levelInfo.nextXp} XP
          </span>
        </div>
        
        <div className="w-full h-4 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 shadow-lg shadow-amber-500/50"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-4 bg-gradient-to-br ${stat.bg} rounded-2xl border border-white/5 backdrop-blur-sm`}
          >
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
            <div>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
