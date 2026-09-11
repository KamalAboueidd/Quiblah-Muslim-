// server.js - قبلة المسلم: Web Push & Islamic Reminder Backend Server
const http = require('http');
const fs = require('fs');
const path = require('path');

let webpush;
try {
    webpush = require('web-push');
} catch (e) {
    console.warn('[Server] web-push module not yet found, will retry loading on request.');
}

const PORT = process.env.PORT || 8000;
const VAPID_FILE = path.join(__dirname, 'vapid-keys.json');
const SUBSCRIPTIONS_FILE = path.join(__dirname, 'subscriptions.json');
const SHORT_AZKAR_FILE = path.join(__dirname, 'short_azkar.json');
const VERSES_FILE = path.join(__dirname, 'verses.json');

// 1. إدارة مفاتيح VAPID
function getOrGenerateVapidKeys() {
    if (fs.existsSync(VAPID_FILE)) {
        try {
            const keys = JSON.parse(fs.readFileSync(VAPID_FILE, 'utf8'));
            if (keys.publicKey && keys.privateKey) {
                return keys;
            }
        } catch (e) {
            console.warn('[VAPID] تعذر قراءة ملف المفاتيح، سيتم توليد مفاتيح جديدة:', e);
        }
    }

    if (!webpush) {
        try { webpush = require('web-push'); } catch (err) {}
    }

    if (webpush) {
        const keys = webpush.generateVAPIDKeys();
        fs.writeFileSync(VAPID_FILE, JSON.stringify(keys, null, 2), 'utf8');
        console.log('[VAPID] تم توليد مفاتيح VAPID جديدة وتخزينها بأمان.');
        return keys;
    } else {
        console.error('[VAPID] خطأ: مكتبة web-push غير متوفرة لتوليد المفاتيح.');
        return null;
    }
}

let vapidKeys = getOrGenerateVapidKeys();
if (vapidKeys && webpush) {
    webpush.setVapidDetails(
        'mailto:contact@quiblah-muslim.app',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
}

// 2. إدارة الاشتراكات (Subscriptions)
function loadSubscriptions() {
    if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
        return [];
    }
    try {
        const data = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8');
        return JSON.parse(data) || [];
    } catch (e) {
        console.warn('[Subs] تعذر قراءة الاشتراكات:', e);
        return [];
    }
}

function saveSubscriptions(subs) {
    try {
        fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2), 'utf8');
    } catch (e) {
        console.error('[Subs] تعذر حفظ الاشتراكات:', e);
    }
}

// 3. قراءة محتوى الأذكار والآيات لتنويع التذكيرات
function getIslamicRemindersPool() {
    let pool = {
        salawat: [
            "صلِّ على النبي ﷺ 🤍",
            "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ",
            "أكثروا من الصلاة على النبي ﷺ",
            "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ"
        ],
        istighfar: [
            "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ",
            "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
            "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
            "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنَّا"
        ],
        adhkar: [
            "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
            "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
            "الْحَمْدُ لِلَّهِ حَمْداً كَثِيراً طَيِّباً مُبَارَكاً فِيهِ",
            "لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ الْعَلِيِّ الْعَظِيمِ",
            "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلاَ إِلَهَ إِلاَّ اللَّهُ، وَاللَّهُ أَكْبَرُ"
        ],
        quran: [
            "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴿الرعد: ٢٨﴾",
            "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ ﴿البقرة: ١٥٢﴾",
            "إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿الشرح: ٦﴾",
            "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ ﴿غافر: ٦٠﴾"
        ]
    };

    // دمج محتوى short_azkar.json إن وُجد
    if (fs.existsSync(SHORT_AZKAR_FILE)) {
        try {
            const rawAzkar = JSON.parse(fs.readFileSync(SHORT_AZKAR_FILE, 'utf8'));
            if (Array.isArray(rawAzkar)) {
                rawAzkar.forEach(item => {
                    const str = typeof item === 'string' ? item : (item.text || item.content || '');
                    if (str) {
                        if (str.includes('صَلِّ') || str.includes('صل')) {
                            pool.salawat.push(str);
                        } else if (str.includes('أَسْتَغْفِرُ') || str.includes('اغفر')) {
                            pool.istighfar.push(str);
                        } else {
                            pool.adhkar.push(str);
                        }
                    }
                });
            }
        } catch(e) {}
    }

    // دمج آيات verses.json إن وُجد
    if (fs.existsSync(VERSES_FILE)) {
        try {
            const rawVerses = JSON.parse(fs.readFileSync(VERSES_FILE, 'utf8'));
            if (Array.isArray(rawVerses)) {
                rawVerses.forEach(v => {
                    if (v.text && v.reference) {
                        pool.quran.push(`${v.text} ﴿${v.reference}﴾`);
                    }
                });
            }
        } catch(e) {}
    }

    return pool;
}

// اختيار نص تذكير بحسب تفضيلات المشترك
function pickReminderMessage(userSettings) {
    const pool = getIslamicRemindersPool();
    const types = (userSettings && userSettings.types) || ['salawat', 'adhkar', 'quran', 'istighfar'];
    const activeTypes = types.filter(t => pool[t] && pool[t].length > 0);

    const chosenType = activeTypes.length > 0 
        ? activeTypes[Math.floor(Math.random() * activeTypes.length)] 
        : 'salawat';

    const list = pool[chosenType] || pool.salawat;
    const item = list[Math.floor(Math.random() * list.length)];
    return item || "صلِّ على النبي ﷺ 🤍";
}

// 4. إرسال إشعار الدفع لمشترك
async function sendPushToSubscriber(subscriber, payload) {
    if (!webpush) {
        try { webpush = require('web-push'); } catch(e) {}
    }
    if (!webpush || !vapidKeys) {
        console.warn('[Push] لا يمكن الإرسال، web-push أو VAPID غير متاحين حالياً.');
        return false;
    }

    const jsonPayload = JSON.stringify(payload);
    try {
        await webpush.sendNotification(subscriber.subscription, jsonPayload);
        return true;
    } catch (err) {
        // إذا كان الاشتراك منتهي أو تم إلغاؤه من المتصفح (404 أو 410)
        if (err.statusCode === 404 || err.statusCode === 410) {
            console.log('[Push] تم إلغاء صلاحية الاشتراك من المتصفح، جاري الحذف...');
            return 'remove';
        }
        console.warn(`[Push] تعذر إرسال التنبيه لنقطة: ${subscriber.subscription.endpoint.substring(0, 45)}...`, err.message);
        return false;
    }
}

// 5. المجدول الدوري (Server-Side 5-Minutes Scheduler)
const SCHEDULER_INTERVAL_MS = 5 * 60 * 1000; // 5 دقائق

async function runScheduledReminders() {
    const subscribers = loadSubscriptions();
    if (subscribers.length === 0) return;

    console.log(`[Scheduler] بدء دورة إرسال التذكيرات إلى ${subscribers.length} مشترك...`);
    const validSubs = [];

    for (const sub of subscribers) {
        // فحص هل المستخدم مفعّل للتذكير
        if (sub.settings && sub.settings.enabled === false) {
            validSubs.push(sub);
            continue;
        }

        const messageText = pickReminderMessage(sub.settings);
        const payload = {
            title: "قبلة المسلم",
            body: messageText,
            icon: "icons/icon-192.png",
            badge: "icons/icon-192.png",
            dir: "rtl",
            lang: "ar",
            tag: "islamic-reminder",
            renotify: true,
            data: {
                url: "./home.html",
                timestamp: Date.now()
            }
        };

        const result = await sendPushToSubscriber(sub, payload);
        if (result !== 'remove') {
            validSubs.push(sub);
        }
    }

    if (validSubs.length !== subscribers.length) {
        saveSubscriptions(validSubs);
        console.log(`[Scheduler] تم تنظيف الاشتراكات المنتهية، المتبقي: ${validSubs.length}`);
    }
}

// بدء تشغيل المؤقت كل 5 دقائق
setInterval(runScheduledReminders, SCHEDULER_INTERVAL_MS);

// 6. خدمة استعلام وتجميع المساجد القريبة وسرعة الاستجابة (Nearby Mosques Aggregator)
const mosquesMemoryCache = new Map();

function haversineMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const p1 = lat1 * Math.PI / 180, p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180, dl = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dp/2)*Math.sin(dp/2) + Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)*Math.sin(dl/2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

async function getNearbyMosquesServer(lat, lng, radius = 2000) {
    const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    const now = Date.now();
    const cached = mosquesMemoryCache.get(cacheKey);
    if (cached && (now - cached.timestamp < 10 * 60 * 1000)) {
        return cached.mosques
            .map(m => ({ ...m, dist: haversineMeters(lat, lng, m.lat, m.lng) }))
            .filter(m => m.dist <= radius + 150)
            .sort((a, b) => a.dist - b.dist);
    }

    // استعلام متوازي: Photon + Overpass
    const fetchPhotonTask = async () => {
        try {
            const urls = [
                `https://photon.komoot.io/api/?q=%D9%85%D8%B3%D8%AC%D8%AF&lat=${lat}&lon=${lng}&limit=50`,
                `https://photon.komoot.io/api/?q=%D8%AC%D8%A7%D9%85%D8%B9&lat=${lat}&lon=${lng}&limit=50`
            ];
            const responses = await Promise.all(urls.map(u => 
                fetch(u, { headers: { 'User-Agent': 'QuiblahMuslim/1.0' }, signal: AbortSignal.timeout(4000) })
                    .then(r => r.ok ? r.json() : null)
                    .catch(() => null)
            ));
            const list = [];
            for (const res of responses) {
                if (!res || !Array.isArray(res.features)) continue;
                for (const f of res.features) {
                    const coords = f.geometry?.coordinates;
                    if (!coords) continue;
                    const mLng = coords[0], mLat = coords[1];
                    const props = f.properties || {};
                    let name = (props.name || '').trim();
                    if (!name) name = 'مسجد';
                    if (name.includes('جامعة') && !name.includes('مسجد') && !name.includes('جامع ')) continue;
                    if (props.osm_value && ['university', 'college', 'school', 'hospital'].includes(props.osm_value)) continue;

                    list.push({
                        name: name,
                        lat: mLat,
                        lng: mLng,
                        areaName: props.street || props.city || props.district || props.county || 'مسجد',
                        source: 'photon'
                    });
                }
            }
            return list;
        } catch (e) {
            return [];
        }
    };

    const fetchOverpassTask = async () => {
        try {
            const overpassQuery = `[out:json][timeout:8];(
              node["amenity"="mosque"](around:${Math.max(radius, 3000)},${lat},${lng});
              way["amenity"="mosque"](around:${Math.max(radius, 3000)},${lat},${lng});
              node["building"="mosque"](around:${Math.max(radius, 3000)},${lat},${lng});
              way["building"="mosque"](around:${Math.max(radius, 3000)},${lat},${lng});
              node["amenity"="place_of_worship"]["religion"="muslim"](around:${Math.max(radius, 3000)},${lat},${lng});
              way["amenity"="place_of_worship"]["religion"="muslim"](around:${Math.max(radius, 3000)},${lat},${lng});
            );out center;`;

            const res = await fetch(`https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=${encodeURIComponent(overpassQuery)}`, {
                signal: AbortSignal.timeout(4500)
            });
            if (!res.ok) return [];
            const data = await res.json();
            return (data.elements || []).map(el => {
                const mLat = el.lat || (el.center && el.center.lat);
                const mLng = el.lon || (el.center && el.center.lon);
                if (!mLat || !mLng) return null;
                const tags = el.tags || {};
                let name = tags.name || tags['name:ar'] || tags['name:en'] || 'مسجد';
                if (name.includes('جامعة') && !name.includes('مسجد') && !name.includes('جامع ')) return null;
                const area = tags['addr:street'] || tags['addr:suburb'] || tags['addr:city'] || '';
                return { name, lat: mLat, lng: mLng, areaName: area || 'مسجد', source: 'overpass' };
            }).filter(Boolean);
        } catch(e) {
            return [];
        }
    };

    const [photonList, overpassList] = await Promise.all([fetchPhotonTask(), fetchOverpassTask()]);
    const rawAll = [...overpassList, ...photonList];

    const deduped = [];
    for (const item of rawAll) {
        const dFromUser = haversineMeters(lat, lng, item.lat, item.lng);
        const existing = deduped.find(d => haversineMeters(d.lat, d.lng, item.lat, item.lng) < 35);
        if (existing) {
            if (existing.name === 'مسجد' && item.name !== 'مسجد') {
                existing.name = item.name;
            }
            if ((!existing.areaName || existing.areaName === 'مسجد') && item.areaName && item.areaName !== 'مسجد') {
                existing.areaName = item.areaName;
            }
        } else {
            deduped.push({ ...item, dist: dFromUser });
        }
    }

    deduped.sort((a, b) => a.dist - b.dist);
    mosquesMemoryCache.set(cacheKey, { timestamp: now, mosques: deduped });

    return deduped.filter(m => m.dist <= radius + 150);
}

// 7. خادم الويب وواجهة الـ API
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav'
};

const server = http.createServer(async (req, res) => {
    // تمكين CORS لجميع الواجهات المحلية
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // --- API: استعلام المساجد القريبة (Nearby Mosques API) ---
    if (pathname === '/api/mosques' && req.method === 'GET') {
        const lat = parseFloat(parsedUrl.searchParams.get('lat') || '30.0444');
        const lng = parseFloat(parsedUrl.searchParams.get('lng') || '31.2357');
        const radius = parseInt(parsedUrl.searchParams.get('radius') || '2000', 10);

        try {
            const mosques = await getNearbyMosquesServer(lat, lng, radius);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success', count: mosques.length, mosques }));
        } catch (err) {
            console.error('[Mosques API] Error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', message: err.message, mosques: [] }));
        }
        return;
    }

    // --- API: جلب المفتاح العام VAPID Public Key ---
    if (pathname === '/api/push/vapid-public-key' && req.method === 'GET') {
        if (!vapidKeys) vapidKeys = getOrGenerateVapidKeys();
        if (vapidKeys && vapidKeys.publicKey) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ publicKey: vapidKeys.publicKey }));
        } else {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'VAPID keys not available' }));
        }
        return;
    }

    // --- API: تسجيل اشتراك جديد / تحديث إعدادات ---
    if (pathname === '/api/push/subscribe' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                if (!data || !data.subscription || !data.subscription.endpoint) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid subscription payload' }));
                    return;
                }

                const subscribers = loadSubscriptions();
                const endpoint = data.subscription.endpoint;
                const existingIndex = subscribers.findIndex(s => s.subscription.endpoint === endpoint);

                const record = {
                    subscription: data.subscription,
                    settings: data.settings || {
                        enabled: true,
                        interval: 5,
                        types: ['salawat', 'adhkar', 'quran', 'istighfar'],
                        sound: true
                    },
                    updatedAt: new Date().toISOString()
                };

                if (existingIndex >= 0) {
                    subscribers[existingIndex] = record;
                } else {
                    subscribers.push(record);
                }

                saveSubscriptions(subscribers);
                console.log(`[API] تم حفظ اشتراك جديد بنجاح (${subscribers.length} مشتركين حالياً)`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, count: subscribers.length }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad JSON' }));
            }
        });
        return;
    }

    // --- API: إلغاء الاشتراك ---
    if (pathname === '/api/push/unsubscribe' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const endpoint = data.endpoint || (data.subscription && data.subscription.endpoint);
                if (endpoint) {
                    const subscribers = loadSubscriptions();
                    const filtered = subscribers.filter(s => s.subscription.endpoint !== endpoint);
                    saveSubscriptions(filtered);
                    console.log(`[API] تم إلغاء اشتراك (${filtered.length} مشتركين متبقين)`);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad JSON' }));
            }
        });
        return;
    }

    // --- API: إرسال إشعار تجريبي فوري ---
    if (pathname === '/api/push/send-test' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const subscription = data.subscription;
                if (!subscription || !subscription.endpoint) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing subscription' }));
                    return;
                }

                const customMsg = data.message || "صلِّ على النبي ﷺ 🤍";
                const payload = {
                    title: "قبلة المسلم",
                    body: customMsg,
                    icon: "icons/icon-192.png",
                    badge: "icons/icon-192.png",
                    dir: "rtl",
                    lang: "ar",
                    tag: "islamic-reminder-test",
                    renotify: true,
                    data: { url: "./home.html" }
                };

                const ok = await sendPushToSubscriber({ subscription }, payload);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: !!ok }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // --- تقديم الملفات الثابتة (Static Files) ---
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

    // حماية المسار
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        const headers = { 'Content-Type': contentType };
        if (path.basename(filePath) === 'service-worker.js') {
            headers['Service-Worker-Allowed'] = '/';
            headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        }

        res.writeHead(200, headers);
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` خادم قبلة المسلم يعمل الآن على المنفذ: http://localhost:${PORT}`);
    console.log(` نظام التذكيرات الإسلامية المشفر (Web Push) مفعّل.`);
    console.log(` المجدول الخلفي يرسل التذكيرات كل 5 دقائق تلقائياً.`);
    console.log(`====================================================`);
});
