// api/cron-reminder.js - Vercel Serverless Function لإرسال التذكيرات الإسلامية لـ OneSignal
const https = require('https');

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || '1927aef6-662e-4720-bc7b-99c243f78c8a';
const ONESIGNAL_REST_KEY = process.env.ONESIGNAL_REST_KEY;

const ISLAMIC_REMINDERS = [
    { title: 'قبلة المسلم • الصلاة على النبي', body: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ 🤍' },
    { title: 'قبلة المسلم • ذكر وطمأنينة', body: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ ✨' },
    { title: 'قبلة المسلم • استغفار وتوبة', body: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ وَأَتُوبُ إِلَيْهِ 🌿' },
    { title: 'قبلة المسلم • كنز من كنوز الجنة', body: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ 🤲' },
    { title: 'قبلة المسلم • الباقيات الصالحات', body: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ 🕊️' },
    { title: 'قبلة المسلم • دعاء مبارك', body: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ 🌸' },
    { title: 'قبلة المسلم • التوكل على الله', body: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ ، عَلَى اللَّهِ تَوَكَّلْنَا 💫' }
];

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const item = ISLAMIC_REMINDERS[Math.floor(Math.random() * ISLAMIC_REMINDERS.length)];

    const payload = JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        included_segments: ['Subscribed Users', 'Total Subscriptions'],
        headings: { en: item.title, ar: item.title },
        contents: { en: item.body, ar: item.body },
        chrome_web_icon: 'https://quiblah-muslim.vercel.app/icons/icon-192.png',
        chrome_web_badge: 'https://quiblah-muslim.vercel.app/icons/icon-192.png',
        url: 'https://quiblah-muslim.vercel.app/reminders.html',
        priority: 10
    });

    const options = {
        hostname: 'api.onesignal.com',
        path: '/notifications',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Key ${ONESIGNAL_REST_KEY}`,
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    return new Promise((resolve) => {
        const osReq = https.request(options, (osRes) => {
            let data = '';
            osRes.on('data', chunk => { data += chunk; });
            osRes.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    res.status(osRes.statusCode).json({
                        success: osRes.statusCode >= 200 && osRes.statusCode < 300,
                        sentReminder: item,
                        oneSignalResponse: parsed
                    });
                } catch (e) {
                    res.status(200).json({ success: true, raw: data });
                }
                resolve();
            });
        });

        osReq.on('error', (err) => {
            res.status(500).json({ success: false, error: err.message });
            resolve();
        });

        osReq.write(payload);
        osReq.end();
    });
};
