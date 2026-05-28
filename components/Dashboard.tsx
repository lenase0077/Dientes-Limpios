'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState, loadState, saveState, resetState } from '@/lib/storage'
import { recordBrush, updatePetStats } from '@/lib/gameLogic'
import { checkNewAchievements } from '@/lib/achievements'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { useNotifications } from '@/hooks/useNotifications'
import Pet from './Pet'
import Streak from './Streak'
import BrushButton from './BrushButton'
import Stats from './Stats'
import Achievements from './Achievements'
import Settings from './Settings'
import GuiltMessages from './GuiltMessages'
import WelcomeModal from './WelcomeModal'
import { Download } from 'lucide-react'

export default function Dashboard() {
  const [state, setState] = useState<GameState | null>(null)
  const [showAchievement, setShowAchievement] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const { isInstallable, promptInstall } = useInstallPrompt()
  const { 
    permission: notificationPermission, 
    isSupported: notificationSupported,
    requestPermission: requestNotificationPermission,
    sendTestNotification,
  } = useNotifications(state)
  
  useEffect(() => {
    const loaded = loadState()
    setState(updatePetStats(loaded))
    
    const hasSeenWelcome = localStorage.getItem('dientes-welcome-seen')
    if (!hasSeenWelcome) {
      setShowWelcome(true)
    }
  }, [])
  
  useEffect(() => {
    if (!state) return
    
    const interval = setInterval(() => {
      setState(prev => prev ? updatePetStats(prev) : null)
    }, 60000)
    
    return () => clearInterval(interval)
  }, [state])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
  
  const handleBrush = (duration: number) => {
    if (!state) return
    
    const { newState, xpGained } = recordBrush(state, duration)
    const { newAchievements, updatedState } = checkNewAchievements(newState)
    
    setState(updatedState)
    saveState(updatedState)
    
    if (newAchievements.length > 0) {
      setShowAchievement(`${newAchievements[0].emoji} ${newAchievements[0].title}`)
      setTimeout(() => setShowAchievement(null), 3000)
    }
  }
  
  const handleUpdate = (newState: GameState) => {
    setState(newState)
    saveState(newState)
  }
  
  const handleReset = () => {
    resetState()
    setState(loadState())
  }

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission()
    if (granted && state) {
      const updatedState = {
        ...state,
        settings: { ...state.settings, notifications: true }
      }
      setState(updatedState)
      saveState(updatedState)
    }
    localStorage.setItem('dientes-welcome-seen', 'true')
    setShowWelcome(false)
  }

  const handleSkipWelcome = () => {
    localStorage.setItem('dientes-welcome-seen', 'true')
    setShowWelcome(false)
  }
  
  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white text-xl font-medium"
        >
          Cargando...
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleSkipWelcome}
        onEnableNotifications={handleEnableNotifications}
        onSkip={handleSkipWelcome}
      />
      
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-8 py-5 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-2xl shadow-2xl shadow-yellow-500/50"
          >
            <p className="text-white font-bold text-lg">🏆 ¡Nuevo Logro!</p>
            <p className="text-white text-sm font-medium">{showAchievement}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-4xl font-black text-white tracking-tight">
            🦷 Dientes App
          </h1>
          <div className="flex items-center gap-3">
            {isInstallable && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={promptInstall}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/50 transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Instalar</span>
              </motion.button>
            )}
            <Settings 
              state={state} 
              onUpdate={handleUpdate} 
              onReset={handleReset}
              onRequestNotificationPermission={requestNotificationPermission}
              onSendTestNotification={sendTestNotification}
              notificationPermission={notificationPermission}
              notificationSupported={notificationSupported}
            />
          </div>
        </motion.div>
        
        <GuiltMessages state={state} />
        
        <div className="grid md:grid-cols-2 gap-6">
          <Pet state={state} />
          <div className="space-y-6">
            <Streak state={state} />
            <BrushButton state={state} onBrush={handleBrush} />
          </div>
        </div>
        
        <Stats state={state} />
        
        <Achievements state={state} />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-600 pb-4 space-y-1"
        >
          <p>Tu progreso se guarda localmente en tu navegador</p>
          <p>Hecho con 💙 para tu salud dental</p>
        </motion.div>
      </div>
    </div>
  )
}
