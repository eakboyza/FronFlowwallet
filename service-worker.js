const APP_VERSION = '1.0.7';  // ← เปลี่ยนเลขตอน deploy เท่านั้น

// ✅ สร้าง CACHE_NAME อัตโนมัติจาก version
const CACHE_NAME = `flowwallet-${APP_VERSION}`;

const CACHE_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/styles/main.css',
    '/scripts/main.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/icon-96x96.png',
    '/icons/favicon.ico',
    '/icons/favicon.svg'
];

// ============================================
// INSTALL - เรียกเมื่อติดตั้ง Service Worker ครั้งแรก
// ============================================
self.addEventListener('install', event => {
    console.log('ServiceWorker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching files');
                return cache.addAll(CACHE_FILES);
            })
    );
    self.skipWaiting();
});

// ============================================
// ACTIVATE - เรียกเมื่อ Service Worker เริ่มทำงาน
// ============================================
self.addEventListener('activate', event => {
    console.log('ServiceWorker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Clearing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return clients.claim();
        })
    );
});

// ============================================
// FETCH - เรียกเมื่อมีการขอไฟล์
// ============================================
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});