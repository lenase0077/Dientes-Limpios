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

  const sendTestNotification = async () => {
    if (permission !== 'granted') {
      console.warn('Permiso de notificaciones no otorgado')
      return
    }

    const messages = [
      '🦷 ¡Hora de cepillarte! Tu mascota te espera...',
      '⏰ El tiempo pasa y tus dientes no se cepillan solos',
      '🔥 ¡No rompas tu racha! Cepíllate ahora',
      '😢 Dientín está llorando... ¡salvalo!',
      '🦠 Las bacterias están ganando la batalla',
      '💀 ¿Quieres terminar sin dientes? ¡Cepíllate!',
      '⚡ Tu dentista está llorando en este momento...',
      '🎯 ¡Mantén tu racha viva! Cepíllate ya',
    ]

    const randomMessage = messages[Math.floor(Math.random() * messages.length)]

    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
      const registration = await navigator.serviceWorker.ready
      registration.showNotification('Dientes Limpios', {
        body: randomMessage,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'brush-test',
        requireInteraction: true,
        actions: [
          { action: 'open', title: 'Abrir App' },
          { action: 'dismiss', title: 'Después' },
        ],
      } as any)
    } else {
      new Notification('Dientes Limpios', {
        body: randomMessage,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'brush-reminder',
        requireInteraction: true,
      })
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
