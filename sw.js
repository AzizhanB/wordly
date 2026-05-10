// Wordly Service Worker
const CACHE = 'wordly-v1';

// Günlük bildirim için kelimeler (SW içinde tutuyoruz)
const REMINDER_MESSAGES = [
  { title: "Wordly 💜", body: "Bugün henüz çalışmadın! 10 kelime seni bekliyor 📚" },
  { title: "Wordly 💜", body: "Günlük serinini kaçırma! Streak'ini koru 🔥" },
  { title: "Wordly 💜", body: "5 dakika yeterli — hadi bir tur atalım! ✨" },
  { title: "Wordly 💜", body: "Her gün biraz, büyük fark yaratır 🌸" },
  { title: "Wordly 💜", body: "İngilizce seni bekliyor! Bugünün kelimelerini çöz 💪" },
];

// Install
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Fetch (cache-first for offline)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Push notification geldiğinde göster
self.addEventListener('push', e => {
  const msg = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
  e.waitUntil(
    self.registration.showNotification(msg.title, {
      body: msg.body,
      icon: '/wordly/icon.png',
      badge: '/wordly/icon.png',
      vibrate: [200, 100, 200],
      tag: 'wordly-daily',
      renotify: true,
      actions: [{ action: 'open', title: 'Uygulamayı Aç 📖' }]
    })
  );
});

// Bildirime tıklanınca uygulamayı aç
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('wordly') && 'focus' in client) return client.focus();
      }
      return clients.openWindow('/wordly/');
    })
  );
});

// ── Yerel zamanlayıcı (Push server olmadan) ──
// Her saat kontrol et, saat 20:00 ise bildirim at
self.addEventListener('message', e => {
  if (e.data === 'CHECK_NOTIFICATION') checkAndNotify();
});

async function checkAndNotify() {
  const now = new Date();
  const hour = now.getHours();
  const today = now.toDateString();

  // Her saat başı bir bildirim at (08:00-23:00 arası)
  if (hour < 8 || hour >= 24) return; // gece yarısı - sabah 8 arası sessiz
  const lastSentKey = `lastNotifHour_${today}_${hour}`;
  const lastSent = await getStore(lastSentKey);
  if (!lastSent) {
    await setStore(lastSentKey, '1');
    const msg = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
    await self.registration.showNotification(msg.title, {
      body: msg.body,
      icon: '/wordly/icon.png',
      tag: 'wordly-hourly',
      renotify: true,
    });
  }
}

// Simple IndexedDB key-value store
function getStore(key) {
  return new Promise(resolve => {
    const req = indexedDB.open('wordly-sw', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('kv');
    req.onsuccess = e => {
      const tx = e.target.result.transaction('kv', 'readonly');
      const r = tx.objectStore('kv').get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => resolve(null);
    };
    req.onerror = () => resolve(null);
  });
}

function setStore(key, value) {
  return new Promise(resolve => {
    const req = indexedDB.open('wordly-sw', 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('kv');
    req.onsuccess = e => {
      const tx = e.target.result.transaction('kv', 'readwrite');
      tx.objectStore('kv').put(value, key);
      tx.oncomplete = () => resolve();
    };
    req.onerror = () => resolve();
  });
}
