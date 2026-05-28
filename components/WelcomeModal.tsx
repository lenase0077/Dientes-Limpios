'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, X } from 'lucide-react'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  onEnableNotifications: () => void
  onSkip: () => void
}

export default function WelcomeModal({ isOpen, onClose, onEnableNotifications, onSkip }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                <h3 className="text-2xl font-bold text-white">¡Bienvenido! 🦷</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </motion.button>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-slate-300">
                  Tu mascota dental te va a ayudar a mantener una rutina de cepillado perfecta.
                </p>
                
                <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/30">
                  <div className="flex items-start gap-3">
                    <Bell className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white mb-1">¿Activar recordatorios?</h4>
                      <p className="text-sm text-slate-400">
                        Te enviaremos notificaciones molestas a la hora de cepillarte. 
                        Tu mascota te lo agradecerá.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onEnableNotifications}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/50"
                >
                  <Bell className="w-5 h-5" />
                  Sí, activar notificaciones
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSkip}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 font-medium rounded-2xl transition-all"
                >
                  <BellOff className="w-4 h-4" />
                  No, gracias
                </motion.button>
              </div>
              
              <p className="text-xs text-slate-600 text-center mt-4">
                Podés cambiar esto después en Configuración
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
