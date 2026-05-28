'use client'

import { useState, useEffect, useCallback } from 'react'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

type UsePushReturn = {
  isSupported: boolean
  isSubscribed: boolean
  isLoading: boolean
  permission: NotificationPermission | 'unsupported'
  requestPermission: () => Promise<NotificationPermission>
  subscribe: () => Promise<void>
  unsubscribe: () => Promise<void>
  scheduleReminders: (morningTime: string, nightTime: string) => void
  sendTestNotification: () => void
}

export function usePush(): UsePushReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported')

  useEffect(() => {
    const checkSupport = async () => {
      const supported =
        typeof window !== 'undefined' &&
        'serviceWorker' in navigator &&
        'Notification' in window

      setIsSupported(supported)

      if (!supported) {
        setIsLoading(false)
        return
      }

      setPermission(Notification.permission)

      try {
        const registration = await navigator.serviceWorker.ready
        setIsSubscribed(true)
      } catch {
        setIsSubscribed(false)
      } finally {
        setIsLoading(false)
      }
    }

    void checkSupport()
  }, [])

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied'

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [isSupported])

  const subscribe = useCallback(async () => {
    if (!isSupported) return

    setIsLoading(true)

    try {
      let currentPermission = Notification.permission
      if (currentPermission === 'default') {
        currentPermission = await Notification.requestPermission()
        setPermission(currentPermission)
      }

      if (currentPermission !== 'granted') {
        throw new Error('Notification permission denied')
      }

      await navigator.serviceWorker.register('/sw-push.js', {
        scope: '/',
      })

      await navigator.serviceWorker.ready
      setIsSubscribed(true)
    } catch (error) {
      console.error('Push subscription failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isSupported])

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return

    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      
      // Clear scheduled notifications
      registration.active?.postMessage({ type: 'CLEAR_NOTIFICATIONS' })
      
      setIsSubscribed(false)
    } catch (error) {
      console.error('Push unsubscribe failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isSupported])

  const scheduleReminders = useCallback((morningTime: string, nightTime: string) => {
    if (!isSupported || !isSubscribed) return

    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        type: 'SCHEDULE_NOTIFICATIONS',
        morningTime,
        nightTime,
      })
    })
  }, [isSupported, isSubscribed])

  const sendTestNotification = useCallback(() => {
    if (!isSupported || permission !== 'granted') {
      console.warn('Notifications not supported or permission not granted')
      return
    }

    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('Dientes Limpios - Test', {
        body: '¡Las notificaciones funcionan! 🎉',
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'test-notification',
        data: { url: '/' }
      })
    })
  }, [isSupported, permission])

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    requestPermission,
    subscribe,
    unsubscribe,
    scheduleReminders,
    sendTestNotification,
  }
}
