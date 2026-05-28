'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState } from '@/lib/storage'
import { Settings as SettingsIcon, Save, RotateCcw, X } from 'lucide-react'

interface SettingsProps {
  state: GameState
  onUpdate: (state: GameState) => void
  onReset: () => void
}

export default function Settings({ 
  state, 
  onUpdate, 
  onReset,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [petName, setPetName] = useState(state.petName)
  const [morningTime, setMorningTime] = useState(state.settings.morningTime)
  const [nightTime, setNightTime] = useState(state.settings.nightTime)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  
  const handleSave = () => {
    onUpdate({
      ...state,
      petName,
      settings: {
        ...state.settings,
        morningTime,
        nightTime,
      },
    })
    setIsOpen(false)
  }
  
  const handleReset = () => {
    onReset()
    setShowResetConfirm(false)
    setIsOpen(false)
  }
  
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="p-3 glass rounded-2xl border border-white/10 transition-all hover:border-white/20"
      >
        <SettingsIcon className="w-5 h-5 text-slate-400" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            >
              <div className="glass rounded-3xl border border-white/10 p-8 w-full max-w-md shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <SettingsIcon className="w-6 h-6" />
                    Configuración
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </motion.button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-medium">Nombre de tu mascota</label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
                      maxLength={20}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-medium">Hora de cepillado matutino</label>
                    <input
                      type="time"
                      value={morningTime}
                      onChange={(e) => setMorningTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-medium">Hora de cepillado nocturno</label>
                    <input
                      type="time"
                      value={nightTime}
                      onChange={(e) => setNightTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/50"
                  >
                    <Save className="w-5 h-5" />
                    Guardar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold rounded-2xl transition-all backdrop-blur-sm"
                  >
                    Cancelar
                  </motion.button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10">
                  <AnimatePresence mode="wait">
                    {!showResetConfirm ? (
                      <motion.button
                        key="reset"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-2xl transition-all border border-red-500/30"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reiniciar todo el progreso
                      </motion.button>
                    ) : (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        <p className="text-sm text-red-400 text-center font-medium">
                          ¿Estás seguro? Perderás TODO tu progreso, rachas y logros.
                        </p>
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleReset}
                            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all"
                          >
                            Sí, reiniciar
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowResetConfirm(false)}
                            className="flex-1 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold rounded-2xl transition-all"
                          >
                            No, cancelar
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
