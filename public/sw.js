const CACHE_NAME = 'dientes-v1'
const urlsToCache = [
  '/',
  '/icon.svg',
  '/manifest.json',
]

let notificationTimers = []

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
          return response
        })
      })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduleNotifications(event.data.payload)
  }
})

function scheduleNotifications({ morningTime, nightTime, enabled }) {
  notificationTimers.forEach(timer => clearTimeout(timer))
  notificationTimers = []

  if (!enabled) return

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

  const scheduleNotification = (timeStr, type) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)

    if (target <= now) {
      target.setDate(target.getDate() + 1)
    }

    const delay = target.getTime() - now.getTime()

    const timer = setTimeout(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      
      self.registration.showNotification('Dientes Limpios', {
        body: randomMessage,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: `brush-${type}`,
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 200],
        actions: [
          { action: 'open', title: 'Abrir App' },
          { action: 'dismiss', title: 'Después' },
        ],
      })

      scheduleNotification(timeStr, type)
    }, delay)

    notificationTimers.push(timer)
  }

  scheduleNotification(morningTime, 'morning')
  scheduleNotification(nightTime, 'night')
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
    )
  }
})
