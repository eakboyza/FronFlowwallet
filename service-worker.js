const APP_VERSION = '1.0.8';
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

self.addEventListener('install', event => {
    console.log('ServiceWorker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching static files');
            return cache.addAll(CACHE_FILES);
        }).catch(error => {
            console.error('Cache addAll failed:', error);
        })
    );
    self.skipWaiting();
});

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

// ✅ แก้ไข fetch handler ให้กรอง requests
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // ✅ 1. ข้าม requests ที่ไม่ใช่ http/https
    if (!url.protocol.startsWith('http')) {
        console.log('🚫 Skipping non-http request:', url.protocol);
        return;
    }
    
    // ✅ 2. ข้าม API calls
    if (url.pathname.startsWith('/api/')) {
        console.log('🚫 Skipping API call:', url.pathname);
        event.respondWith(fetch(event.request));
        return;
    }
    
    // ✅ 3. ข้าม non-GET requests
    if (event.request.method !== 'GET') {
        console.log('🚫 Skipping non-GET request:', event.request.method);
        event.respondWith(fetch(event.request));
        return;
    }
    
    // ✅ 4. ข้าม requests จาก extension
    if (url.protocol === 'chrome-extension:') {
        console.log('🚫 Skipping chrome extension request');
        return;
    }
    
    // ✅ 5. ข้าม requests ที่มี query string แปลกๆ
    if (url.search.includes('extension=') || url.search.includes('chrome-extension')) {
        console.log('🚫 Skipping extension-related request');
        event.respondWith(fetch(event.request));
        return;
    }
    
    // ✅ 6. เฉพาะ static files เท่านั้นที่ใช้ cache
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                console.log('✅ Serving from cache:', url.pathname);
                return cachedResponse;
            }
            
            console.log('🌐 Fetching from network:', url.pathname);
            return fetch(event.request).then(networkResponse => {
                // ✅ Cache เฉพาะ response ที่สำเร็จและเป็น static files
                if (networkResponse && networkResponse.status === 200 && 
                    event.request.method === 'GET' &&
                    !url.pathname.startsWith('/api/') &&
                    url.protocol.startsWith('http')) {
                    
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache).catch(error => {
                            console.warn('Failed to cache:', url.pathname, error);
                        });
                    });
                }
                return networkResponse;
            }).catch(error => {
                console.error('Fetch failed:', url.pathname, error);
                // ✅ Return fallback response ถ้ามี
                if (url.pathname === '/') {
                    return caches.match('/index.html');
                }
                return new Response('Network error', { status: 503 });
            });
        })
    );
});