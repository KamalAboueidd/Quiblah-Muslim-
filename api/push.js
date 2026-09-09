// api/push.js - Vercel Serverless Function for Web Push Notifications
const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

// مفاتيح VAPID الدائمة لتطبيق قبلة المسلم
const DEFAULT_VAPID_KEYS = {
    publicKey: process.env.VAPID_PUBLIC_KEY || "BM9ib8LqEqXQVJZvSJOtIx-qaqfWhzp2jJHiMQe5SWF0H6kBtta5cSyvBe0G-Ep5Ixg70YeERnVyck4YKXBBVkc",
    privateKey: process.env.VAPID_PRIVATE_KEY || "mumUtJZvck8-xtbcLky9BCnAjaoL_BXyU3iVypbXa9Q"
};

webpush.setVapidDetails(
    'mailto:contact@quiblah-muslim.app',
    DEFAULT_VAPID_KEYS.publicKey,
    DEFAULT_VAPID_KEYS.privateKey
);

// مسار التخزين المؤقت على Vercel (/tmp)
const TMP_SUBS_FILE = path.join('/tmp', 'subscriptions.json');

// 1. إدارة الاشتراكات (مع دعم Vercel KV / Upstash Redis إن وُجدت أو /tmp)
async function loadSubscriptions() {
    // 1. فحص هل يوجد Upstash Redis / Vercel KV
    const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
        try {
            const resp = await fetch(`${redisUrl}/get/quiblah_subscriptions`, {
                headers: { Authorization: `Bearer ${redisToken}` }
            });
            const data = await resp.json();
            if (data && data.result) {
                return JSON.parse(data.result) || [];
            }
        } catch (e) {
            console.warn('[Redis] تعذر قراءة الاشتراكات من Redis:', e);
        }
    }

    // 2. الرجوع للملف المؤقت /tmp
    if (fs.existsSync(TMP_SUBS_FILE)) {
        try {
            const content = fs.readFileSync(TMP_SUBS_FILE, 'utf8');
            return JSON.parse(content) || [];
        } catch (e) {}
    }
    return [];
}

async function saveSubscriptions(subs) {
    const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
        try {
            await fetch(`${redisUrl}/set/quiblah_subscriptions`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${redisToken}` },
                body: JSON.stringify(subs)
            });
        } catch (e) {
            console.warn('[Redis] تعذر حفظ الاشتراكات في Redis:', e);
        }
    }

    try {
        fs.writeFileSync(TMP_SUBS_FILE, JSON.stringify(subs, null, 2), 'utf8');
    } catch (e) {}
}

// 2. نصوص التذكيرات
const REMINDERS_POOL = [
    "صلِّ على النبي ﷺ 🤍",
    "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ",
    "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
    "الْحَمْدُ لِلَّهِ حَمْداً كَثِيراً طَيِّباً مُبَارَكاً فِيهِ",
    "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ",
    "لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ الْعَلِيِّ الْعَظِيمِ",
    "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴿الرعد: ٢٨﴾",
    "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ ﴿البقرة: ١٥٢﴾",
    "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ"
];

function getRandomReminder() {
    return REMINDERS_POOL[Math.floor(Math.random() * REMINDERS_POOL.length)];
}

// 3. المعالج الرئيسي لـ Vercel Serverless
module.exports = async (req, res) => {
    // تمكين الـ CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // استخراج المسار الفرعي (مثلاً: /vapid-public-key أو /subscribe)
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.replace(/^\/api\/push/, '') || '/';

    // --- GET /api/push/vapid-public-key ---
    if (pathname === '/vapid-public-key' || pathname === '/vapid-public-key/') {
        return res.status(200).json({ publicKey: DEFAULT_VAPID_KEYS.publicKey });
    }

    // --- POST /api/push/subscribe ---
    if (pathname === '/subscribe' || pathname === '/subscribe/') {
        try {
            const body = req.body || {};
            if (!body.subscription || !body.subscription.endpoint) {
                return res.status(400).json({ error: 'Invalid subscription payload' });
            }

            const subscribers = await loadSubscriptions();
            const endpoint = body.subscription.endpoint;
            const existingIndex = subscribers.findIndex(s => s.subscription.endpoint === endpoint);

            const record = {
                subscription: body.subscription,
                settings: body.settings || { enabled: true, interval: 5 },
                updatedAt: new Date().toISOString()
            };

            if (existingIndex >= 0) {
                subscribers[existingIndex] = record;
            } else {
                subscribers.push(record);
            }

            await saveSubscriptions(subscribers);
            return res.status(200).json({ success: true, count: subscribers.length });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    // --- POST /api/push/unsubscribe ---
    if (pathname === '/unsubscribe' || pathname === '/unsubscribe/') {
        try {
            const body = req.body || {};
            const endpoint = body.endpoint || (body.subscription && body.subscription.endpoint);
            if (endpoint) {
                const subscribers = await loadSubscriptions();
                const filtered = subscribers.filter(s => s.subscription.endpoint !== endpoint);
                await saveSubscriptions(filtered);
            }
            return res.status(200).json({ success: true });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    // --- POST /api/push/send-test ---
    if (pathname === '/send-test' || pathname === '/send-test/') {
        try {
            const body = req.body || {};
            const subscription = body.subscription;
            if (!subscription || !subscription.endpoint) {
                return res.status(400).json({ error: 'Missing subscription' });
            }

            const payload = JSON.stringify({
                title: "قبلة المسلم",
                body: body.message || "صلِّ على النبي ﷺ 🤍",
                icon: "icons/icon-192.png",
                badge: "icons/icon-192.png",
                dir: "rtl",
                lang: "ar",
                tag: "islamic-reminder-test",
                renotify: true,
                data: { url: "./home.html" }
            });

            await webpush.sendNotification(subscription, payload);
            return res.status(200).json({ success: true });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // --- GET/POST /api/push/cron (مشغل التذكيرات عبر Vercel Cron أو cron-job.org) ---
    if (pathname === '/cron' || pathname === '/cron/') {
        try {
            const subscribers = await loadSubscriptions();
            if (subscribers.length === 0) {
                return res.status(200).json({ message: 'No subscribers found' });
            }

            let sentCount = 0;
            const validSubs = [];

            for (const sub of subscribers) {
                if (sub.settings && sub.settings.enabled === false) {
                    validSubs.push(sub);
                    continue;
                }

                const payload = JSON.stringify({
                    title: "قبلة المسلم",
                    body: getRandomReminder(),
                    icon: "icons/icon-192.png",
                    badge: "icons/icon-192.png",
                    dir: "rtl",
                    lang: "ar",
                    tag: "islamic-reminder",
                    renotify: true,
                    data: { url: "./home.html" }
                });

                try {
                    await webpush.sendNotification(sub.subscription, payload);
                    sentCount++;
                    validSubs.push(sub);
                } catch (pushErr) {
                    if (pushErr.statusCode !== 404 && pushErr.statusCode !== 410) {
                        validSubs.push(sub);
                    }
                }
            }

            if (validSubs.length !== subscribers.length) {
                await saveSubscriptions(validSubs);
            }

            return res.status(200).json({
                success: true,
                sentTo: sentCount,
                totalSubscribers: subscribers.length
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(404).json({ error: 'Endpoint not found' });
};
