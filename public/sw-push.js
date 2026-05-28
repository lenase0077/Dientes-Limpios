// Service Worker for scheduled tooth brushing reminders
const CACHE_NAME = 'dientes-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Handle scheduled notifications
let notificationTimers = [];

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduleNotifications(event.data.morningTime, event.data.nightTime);
  } else if (event.data && event.data.type === 'CLEAR_NOTIFICATIONS') {
    clearScheduledNotifications();
  }
});

function clearScheduledNotifications() {
  notificationTimers.forEach(timer => clearTimeout(timer));
  notificationTimers = [];
}

function scheduleNotifications(morningTime, nightTime) {
  clearScheduledNotifications();

  const now = new Date();
  
  // Schedule morning notification
  const morningTimer = scheduleNextNotification(morningTime, '¡Buenos días! 🌅', 'Es hora de cepillarte los dientes para empezar el día fresco y limpio.');
  if (morningTimer) notificationTimers.push(morningTimer);

  // Schedule night notification
  const nightTimer = scheduleNextNotification(nightTime, '¡Hora de dormir! 🌙', 'No olvides cepillarte antes de acostarte. Tus dientes te lo agradecerán.');
  if (nightTimer) notificationTimers.push(nightTimer);
}

function scheduleNextNotification(timeStr, title, body) {
  if (!timeStr) return null;

  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  return setTimeout(() => {
    self.registration.showNotification(title, {
      body: body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'brush-reminder',
      requireInteraction: true,
      data: { url: '/' }
    });

    // Reschedule for the next day
    const nextTimer = scheduleNextNotification(timeStr, title, body);
    if (nextTimer) {
      const index = notificationTimers.indexOf(notificationTimers.find(t => t === setTimeout(() => {}, 0)));
      if (index > -1) {
        notificationTimers[index] = nextTimer;
      } else {
        notificationTimers.push(nextTimer);
      }
    }
  }, delay);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
