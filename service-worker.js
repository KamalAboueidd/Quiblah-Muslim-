// service-worker.js - قبلة المسلم PWA Service Worker
const CACHE_NAME = 'quiblah-muslim-v1';

// الأصول الأساسية لتشغيل التطبيق (App Shell)
const STATIC_ASSETS = [
    './',
    './index.html',
    './quran.html',
    './azkar.html',
    './sabah_masaa.html',
    './names.html',
    './qibla.html',
    './distance.html',
    './listen.html',
    './mosques.html',
    './toast.js',
    './pwa.js',
    './manifest.json',
    './azkar.json',
    './short_azkar.json',
    './verses.json',
    './assets/mosque.svg',
    './assets/bg1.jpg',
    './assets/bg2.jpg',
    './assets/bg3.jpg',
    './assets/minshawi.jpg',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-192.png',
    './icons/icon-maskable-512.png'
];

// تثبيت السيرفس ووركر وتخزين الأصول الأساسية
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // تخزين الأصول الأساسية بأمان حتى لا يفشل التثبيت إذا تعثر ملف واحد
            for (const asset of STATIC_ASSETS) {
                try {
                    await cache.add(asset);
                } catch (err) {
                    console.warn(`[PWA SW] Could not cache asset during install: ${asset}`, err);
                }
            }
        }).then(() => self.skipWaiting())
    );
});

// تفعيل السيرفس ووركر وحذف الكاشات القديمة تلقائياً
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log(`[PWA SW] Removing old cache: ${key}`);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// التعامل مع طلبات الشبكة (Fetch)
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // تجاهل أي بروتوكول غير HTTP/HTTPS أو أي طريقة غير GET
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }

    // 1. طلبات التنقل في صفحات HTML: استراتيجية Network-First مع الرجوع للكاش أوفلاين
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) return cachedResponse;
                    return caches.match('./index.html');
                })
        );
        return;
    }

    // 2. استدعاءات الـ APIs الخارجية (Aladhan, Alquran Cloud, BigDataCloud, إلخ): Network-First
    if (
        url.hostname.includes('api.aladhan.com') ||
        url.hostname.includes('api.alquran.cloud') ||
        url.hostname.includes('raw.githubusercontent.com') ||
        url.hostname.includes('api.bigdatacloud.net')
    ) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                })
        );
        return;
    }

    // 3. الخطوط ومكتبات الـ CDN (Google Fonts & FontAwesome): Stale-While-Revalidate
    if (
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('cdnjs.cloudflare.com')
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const networkFetch = fetch(request).then((networkRes) => {
                    if (networkRes && networkRes.status === 200) {
                        const copy = networkRes.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkRes;
                }).catch(() => null);

                return cached || networkFetch;
            })
        );
        return;
    }

    // 4. الأصول المحلية الثابتة (صور، ملفات JSON، JS، SVG): Cache-First
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) {
                // تحديث هادئ في الخلفية إن أمكن
                fetch(request).then((networkRes) => {
                    if (networkRes && networkRes.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, networkRes));
                    }
                }).catch(() => {});
                return cached;
            }

            return fetch(request).then((networkRes) => {
                if (networkRes && networkRes.status === 200) {
                    const copy = networkRes.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return networkRes;
            });
        })
    );
});
