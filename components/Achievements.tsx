'use client'

import { motion } from 'framer-motion'
import { GameState } from '@/lib/storage'
import { ACHIEVEMENTS } from '@/lib/achievements'
import { Lock } from 'lucide-react'

interface AchievementsProps {
  state: GameState
}

export default function Achievements({ state }: AchievementsProps) {
  const unlocked = ACHIEVEMENTS.filter(a => state.achievements.includes(a.id))
  const locked = ACHIEVEMENTS.filter(a => !state.achievements.includes(a.id))
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-3xl p-8 border border-white/10 shadow-2xl"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-2xl">🏆</span>
        Logros ({unlocked.length}/{ACHIEVEMENTS.length})
      </h3>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {unlocked.map((achievement, i) => (
          <div
            key={achievement.id}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/30 backdrop-blur-sm"
          >
            <span className="text-3xl">
              {achievement.emoji}
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{achievement.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{achievement.description}</p>
            </div>
            <span className="text-xs text-yellow-500 font-bold bg-yellow-500/10 px-3 py-1 rounded-full">
              +{achievement.xpReward} XP
            </span>
          </div>
        ))}
        
        {locked.map((achievement, i) => (
          <div
            key={achievement.id}
            className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm opacity-60"
          >
            <Lock className="w-7 h-7 text-slate-600" />
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-500">
                {achievement.secret ? '???' : achievement.title}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                {achievement.secret ? 'Logro secreto' : achievement.description}
              </p>
            </div>
            <span className="text-xs text-slate-600 bg-slate-700/50 px-3 py-1 rounded-full">
              +{achievement.xpReward} XP
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
