'use client'

import { useState, useEffect } from 'react'
import { GameState } from '@/lib/storage'

export function useNotifications(state: GameState | null) {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return false

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }

  const scheduleNotifications = () => {
    if (!state || permission !== 'granted') return

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATIONS',
        payload: {
          morningTime: state.settings.morningTime,
          nightTime: state.settings.nightTime,
          enabled: state.settings.notifications,
        },
      })
    }
  }

  const sendTestNotification = () => {
    if (permission !== 'granted') {
      console.warn('Permiso de notificaciones no otorgado')
      alert('Primero tenés que dar permiso para notificaciones')
      return
    }

    const messages = [
      '🦷 ¡Hora de cepillarte! Tu mascota te espera...',
      '⏰ El tiempo pasa y tus dientes no se cepillan solos',
      '🔥 ¡No rompas tu racha! Cepíllate ahora',
      '😢 Dientín está llorando... ¡salvalo!',
      '🦠 Las bacterias están ganando la batalla',
    ]

    const randomMessage = messages[Math.floor(Math.random() * messages.length)]

    try {
      const notification = new Notification('Dientes Limpios', {
        body: randomMessage,
        icon: '/icon.svg',
        tag: 'brush-test',
      })

      setTimeout(() => notification.close(), 5000)
    } catch (error) {
      console.error('Error al enviar notificación:', error)
      alert('Error al enviar notificación. Esto puede pasar en algunos navegadores mobile.')
    }
  }

  useEffect(() => {
    if (state && permission === 'granted') {
      scheduleNotifications()
    }
  }, [state, permission])

  return {
    permission,
    isSupported,
    requestPermission,
    scheduleNotifications,
    sendTestNotification,
  }
}
