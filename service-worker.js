// service-worker.js - قبلة المسلم PWA Service Worker
const CACHE_NAME = 'quiblah-muslim-v100';

// الأصول الأساسية لتشغيل التطبيق أوفلاين بالكامل (App Shell & Core Data)
const STATIC_ASSETS = [
    './',
    './index.html',
    './home.html',
    './tracker.html',
    './bot.html',
    './quiz.html',
    './quran.html',
    './tafseer.html',
    './hadith.html',
    './azkar.html',
    './sabah_masaa.html',
    './names.html',
    './qibla.html',
    './distance.html',
    './listen.html',
    './mosques.html',
    './reminders.html',
    './recite.html',
    './khatmah.html',
    // النواة والمكتبات المشتركة (Core)
    './core/player-bridge.js',
    './core/pwa.js',
    './core/toast.js',
    './core/visitor-counter.js',
    './core/reminders.js',
    './core/surahs_meta.js',
    './core/quran_pages_data.js',
    './core/quran_data.js',
    // وحدات وميزات التطبيق (Features JS & CSS)
    './features/landing/landing.js',
    './features/landing/landing.css',
    './features/home/home.js',
    './features/home/home.css',
    './features/bot/bot.js',
    './features/bot/bot.css',
    './features/quran/quran.js',
    './features/quran/quran.css',
    './features/tafseer/tafseer.js',
    './features/tafseer/tafseer.css',
    './features/hadith/hadith.js',
    './features/hadith/hadith.css',
    './features/listen/listen.js',
    './features/listen/listen.css',
    './features/azkar/azkar.js',
    './features/azkar/azkar.css',
    './features/sabah-masaa/sabah-masaa.js',
    './features/sabah-masaa/sabah-masaa.css',
    './features/names/names.js',
    './features/names/names.css',
    './features/qibla/qibla.js',
    './features/qibla/qibla.css',
    './features/mosques/mosques.js',
    './features/mosques/mosques.css',
    './features/distance/distance.js',
    './features/distance/distance.css',
    './features/reminders/reminders-page.js',
    './features/reminders/reminders-page.css',
    './features/recite/recite.js',
    './features/recite/recite.css',
    './features/quiz/quiz.js',
    './features/quiz/quiz.css',
    './features/quiz/quiz-data.js',
    './features/tracker/tracker.js',
    './features/tracker/tracker.css',
    './features/khatmah/khatmah.js',
    './features/khatmah/khatmah.css',
    // البيانات والأصول
    './manifest.json',
    './azkar.json',
    './names.json',
    './short_azkar.json',
    './verses.json',
    './assets/mosque.svg',
    './assets/favicon.png',
    './assets/salawat.mp3',
    './assets/bg1.jpg',
    './assets/bg2.jpg',
    './assets/bg3.jpg',
    './assets/minshawi.jpg',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-192.png',
    './icons/icon-maskable-512.png',
    './icons/apple-touch-icon.png',
    // مكتبات خارجية مهمة لضمان عمل الأيقونات والخطوط والتصميم أوفلاين
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2',
    'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'
];

// تثبيت السيرفس ووركر وتخزين الأصول الأساسية بالتوازي وبأمان
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            await Promise.allSettled(
                STATIC_ASSETS.map(async (asset) => {
                    try {
                        const req = new Request(asset, { cache: 'reload' });
                        const res = await fetch(req);
                        if (res && (res.status === 200 || res.type === 'opaque')) {
                            await cache.put(asset, res);
                        }
                    } catch (err) {
                        console.warn(`[PWA SW] Pre-cache skip for ${asset}:`, err);
                    }
                })
            );
        }).then(() => self.skipWaiting())
    );
});

// تفعيل السيرفس ووركر وحذف الكاشات القديمة تلقائياً والسيطرة الفورية
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

// دالة مساعدة فائقة الدقة للبحث في الكاش مع مراعاة كافة الصيغ والروابط وإصدارات ?v=
async function matchInCaches(request) {
    const reqUrl = typeof request === 'string' ? request : request.url;
    let url;
    try {
        url = new URL(reqUrl, self.location.origin);
    } catch (e) {
        url = new URL(reqUrl, 'https://localhost');
    }
    const cache = await caches.open(CACHE_NAME);

    // 1. التطابق المباشر التام
    let match = await cache.match(request);
    if (match) return match;

    // 2. التطابق مع تجاهل الباراميترات (?v=77, ?m=sm, ?v=64, etc.)
    match = await cache.match(request, { ignoreSearch: true });
    if (match) return match;

    // 3. التطابق بالرابط النظيف بدون Query Params
    const cleanUrl = url.origin + url.pathname;
    match = await cache.match(cleanUrl, { ignoreSearch: true });
    if (match) return match;

    // 4. التطابق بالمسار النسبي (مثل ./features/home/home.css أو ./home.html)
    const relUrl = '.' + url.pathname;
    match = await cache.match(relUrl, { ignoreSearch: true });
    if (match) return match;

    // 5. البحث بآخر جزء من المسار (Filename) في كل المفاتيح المخزنة بالكاش
    const fileName = url.pathname.split('/').filter(Boolean).pop();
    if (fileName && (fileName.endsWith('.css') || fileName.endsWith('.js') || fileName.endsWith('.html') || fileName.endsWith('.json') || fileName.endsWith('.svg') || fileName.endsWith('.png') || fileName.endsWith('.woff2'))) {
        const keys = await cache.keys();
        const matchedKey = keys.find(k => {
            const kUrl = new URL(k.url);
            return kUrl.pathname.endsWith('/' + fileName) || kUrl.pathname === fileName;
        });
        if (matchedKey) {
            return await cache.match(matchedKey);
        }
    }

    return null;
}

// التعامل مع طلبات الشبكة (Fetch)
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // تجاهل أي بروتوكول غير HTTP/HTTPS أو أي طريقة غير GET
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }

    // استثناء تدفق الصوت وملفات الـ MP3 وطلبات Range من السيرفس ووركر
    // ليعمل مشغل الصوت عبر محرك المتصفح المباشر فوراً (Streaming فائق السرعة - Spotify speed)
    if (
        request.headers.has('range') ||
        request.destination === 'audio' ||
        url.pathname.endsWith('.mp3') ||
        url.hostname.includes('mp3quran.net') ||
        url.hostname.includes('everyayah.com') ||
        url.hostname.includes('qurancdn.com')
    ) {
        return; // ترك الطلب للمتصفح مباشرة
    }

    // 1. طلبات التنقل في صفحات HTML (التنقل بين الصفحات والـ iframes)
    if (request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    // تجربة سريعة للشبكة لجلب التحديث مع مهلة 2 ثانية
                    const controller = new AbortController();
                    const timer = setTimeout(() => controller.abort(), 2000);
                    const netRes = await fetch(request, { signal: controller.signal });
                    clearTimeout(timer);
                    if (netRes && (netRes.status === 200 || netRes.type === 'opaque')) {
                        const copy = netRes.clone();
                        caches.open(CACHE_NAME).then(c => c.put(request, copy)).catch(() => {});
                        return netRes;
                    }
                } catch (err) {
                    // في حال عدم وجود إنترنت (أوفلاين) أو انتهاء المهلة
                }

                // جلب الصفحة المطلوبة من الكاش فوراً أوفلاين
                const cached = await matchInCaches(request);
                if (cached) return cached;

                // كاحتياط، الرجوع للصفحة الرئيسية المخزنة
                const homeCached = await matchInCaches('./home.html');
                if (homeCached) return homeCached;
                const indexCached = await matchInCaches('./index.html');
                if (indexCached) return indexCached;

                return new Response('Offline', { status: 503, statusText: 'Offline' });
            })()
        );
        return;
    }

    // 2. ملفات التصميم والسكربتات الخاصة بالتطبيق (JS & CSS):
    // استراتيجية Stale-While-Revalidate مع تفضيل الكاش:
    // الكاش يعود فوراً بـ 0ms حتى لا يضيع التصميم (CSS) ولا تتراكم الأزرار أبداً عند العمل أوفلاين
    if (
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.css') ||
        url.search.includes('v=') ||
        request.destination === 'style' ||
        request.destination === 'script'
    ) {
        event.respondWith(
            (async () => {
                // فحص الكاش أولاً - إذا وجد يعود في 0ms فوراً مع دعم كامل للـ Query Strings (?v=77, etc.)
                const cached = await matchInCaches(request);

                // استدعاء الشبكة في الخلفية لتحديث الكاش للإصدارات القادمة
                const fetchPromise = fetch(request).then(async (netRes) => {
                    if (netRes && (netRes.status === 200 || netRes.type === 'opaque')) {
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(request, netRes.clone()).catch(() => {});
                    }
                    return netRes;
                }).catch(() => null);

                if (cached) {
                    return cached;
                }

                // إذا لم يكن مخزناً مسبقاً، ننتظر الشبكة
                const netRes = await fetchPromise;
                if (netRes) return netRes;

                // استجابة آمنة بديلة تمنع انهيار المتصفح أو رمي TypeError
                if (url.pathname.endsWith('.css') || request.destination === 'style') {
                    return new Response('/* Offline CSS */', {
                        status: 200,
                        headers: { 'Content-Type': 'text/css' }
                    });
                }
                if (url.pathname.endsWith('.js') || request.destination === 'script') {
                    return new Response('/* Offline JS */', {
                        status: 200,
                        headers: { 'Content-Type': 'application/javascript' }
                    });
                }

                return new Response('Not found', { status: 404 });
            })()
        );
        return;
    }

    // 3. الخطوط ومكتبات الـ CDN (Google Fonts, FontAwesome, jsDelivr)
    if (
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('cdnjs.cloudflare.com') ||
        url.hostname.includes('cdn.jsdelivr.net')
    ) {
        event.respondWith(
            (async () => {
                const cached = await matchInCaches(request);
                if (cached) {
                    // تحديث هادئ بالخلفية
                    fetch(request).then(async (netRes) => {
                        if (netRes && (netRes.status === 200 || netRes.type === 'opaque')) {
                            const cache = await caches.open(CACHE_NAME);
                            cache.put(request, netRes).catch(() => {});
                        }
                    }).catch(() => {});
                    return cached;
                }

                try {
                    const netRes = await fetch(request);
                    if (netRes && (netRes.status === 200 || netRes.type === 'opaque')) {
                        const copy = netRes.clone();
                        caches.open(CACHE_NAME).then(c => c.put(request, copy)).catch(() => {});
                    }
                    return netRes;
                } catch (err) {
                    return new Response('', { status: 200, headers: { 'Content-Type': 'text/css' } });
                }
            })()
        );
        return;
    }

    // 4. استدعاءات الـ APIs الخارجية ومصادر البيانات (Aladhan, Alquran Cloud, Quran.com, إلخ): Network-First مع مهلة
    if (
        url.hostname.includes('api.aladhan.com') ||
        url.hostname.includes('api.alquran.cloud') ||
        url.hostname.includes('api.quran.com') ||
        url.hostname.includes('raw.githubusercontent.com') ||
        url.hostname.includes('api.bigdatacloud.net')
    ) {
        event.respondWith(
            (async () => {
                try {
                    const controller = new AbortController();
                    const timer = setTimeout(() => controller.abort(), 3500);
                    const netRes = await fetch(request, { signal: controller.signal });
                    clearTimeout(timer);
                    if (netRes && (netRes.status === 200 || netRes.type === 'opaque')) {
                        const copy = netRes.clone();
                        caches.open(CACHE_NAME).then(c => c.put(request, copy)).catch(() => {});
                        return netRes;
                    }
                } catch (err) {}

                const cached = await matchInCaches(request);
                if (cached) return cached;

                return new Response(JSON.stringify({ error: 'offline', offline: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            })()
        );
        return;
    }

    // 5. الأصول المحلية الثابتة الأخرى (صور، ملفات JSON، صوتيات، SVG): Cache-First
    event.respondWith(
        (async () => {
            const cached = await matchInCaches(request);
            if (cached) {
                // تحديث هادئ بالخلفية
                fetch(request).then(async (netRes) => {
                    if (netRes && (netRes.status === 200 || netRes.type === 'opaque')) {
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(request, netRes).catch(() => {});
                    }
                }).catch(() => {});
                return cached;
            }

            try {
                const netRes = await fetch(request);
                if (netRes && (netRes.status === 200 || netRes.type === 'opaque')) {
                    const copy = netRes.clone();
                    caches.open(CACHE_NAME).then(c => c.put(request, copy)).catch(() => {});
                }
                return netRes;
            } catch (err) {
                return new Response('Asset not found offline', { status: 404 });
            }
        })()
    );
});

// ============================================================================
// نظام التذكيرات الإسلامية والإشعارات الحقيقية (Web Push API)
// ============================================================================

// الاستماع لحدث وصول إشعار دفع حقيقي من السيرفر (Push Event)
self.addEventListener('push', (event) => {
    let payload = {};
    if (event.data) {
        try {
            payload = event.data.json();
        } catch (e) {
            payload = { body: event.data.text() };
        }
    }

    const title = payload.title || 'قبلة المسلم';
    const body = payload.body || 'صلِّ على النبي ﷺ 🤍';
    const targetUrl = (payload.data && payload.data.url) ? payload.data.url : './home.html';

    const notificationOptions = {
        body: body,
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        image: payload.image || undefined,
        dir: 'rtl',
        lang: 'ar',
        tag: payload.tag || 'islamic-reminder',
        renotify: true,
        vibrate: [200, 100, 200],
        requireInteraction: false,
        data: {
            url: targetUrl,
            timestamp: Date.now()
        }
    };

    // إشعار النوافذ المفتوحة للتطبيق في حال كانت الشاشة نشطة لتشغيل الصوت الخفيف
    const notifyClientsPromise = self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clients) => {
            clients.forEach((client) => {
                client.postMessage({
                    type: 'PUSH_REMINDER_RECEIVED',
                    payload: { title, body }
                });
            });
        }).catch(() => {});

    // إظهار إشعار النظام الحقيقي
    const showNotificationPromise = self.registration.showNotification(title, notificationOptions);

    event.waitUntil(Promise.all([showNotificationPromise, notifyClientsPromise]));
});

// التعامل مع النقر على الإشعار (Notification Click)
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = (event.notification.data && event.notification.data.url) 
        ? event.notification.data.url 
        : './home.html';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // البحث عن نافذة مفتوحة للتطبيق والتركيز عليها
            for (const client of clientList) {
                if ('focus' in client) {
                    if (client.url.includes('index.html') || client.url.includes('home.html')) {
                        return client.focus();
                    }
                }
            }
            // في حال لم يكن التطبيق مفتوحاً، فتح نافذة جديدة
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })
    );
});

// التعامل مع إغلاق الإشعار يدوياً
self.addEventListener('notificationclose', (event) => {
    // يمكن استخدامه للإحصائيات إن لزم الأمر مستقبلاً
});
