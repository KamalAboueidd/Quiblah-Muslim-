// scripts/send-onesignal-reminder.js - خادم إرسال التذكيرات الإسلامية لـ OneSignal تلقائياً
const https = require('https');

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || '1927aef6-662e-4720-bc7b-99c243f78c8a';
const ONESIGNAL_REST_KEY = process.env.ONESIGNAL_REST_KEY;

const ISLAMIC_REMINDERS = [
    {
        title: 'قبلة المسلم • الصلاة على النبي',
        body: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ 🤍'
    },
    {
        title: 'قبلة المسلم • ذكر وطمأنينة',
        body: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ ✨'
    },
    {
        title: 'قبلة المسلم • استغفار وتوبة',
        body: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ 🌿'
    },
    {
        title: 'قبلة المسلم • كنز من كنوز الجنة',
        body: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ 🤲'
    },
    {
        title: 'قبلة المسلم • الباقيات الصالحات',
        body: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ 🕊️'
    },
    {
        title: 'قبلة المسلم • دعاء جامع',
        body: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ 🌸'
    },
    {
        title: 'قبلة المسلم • التوكل على الله',
        body: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ ، عَلَى اللَّهِ تَوَكَّلْنَا 💫'
    },
    {
        title: 'قبلة المسلم • صلاة وسلام',
        body: 'إنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا ﷺ'
    },
    {
        title: 'قبلة المسلم • تهليل وتوحيد',
        body: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ ☀️'
    },
    {
        title: 'قبلة المسلم • شكر النعمة',
        body: 'الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ ملء السموات وملء الأرض 🤍'
    }
];

// اختيار ذكر عشوائي
function getRandomReminder() {
    const idx = Math.floor(Math.random() * ISLAMIC_REMINDERS.length);
    return ISLAMIC_REMINDERS[idx];
}

async function sendPushNotification(reminder) {
    const item = reminder || getRandomReminder();

    const payload = JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        included_segments: ['Subscribed Users', 'Total Subscriptions'],
        headings: {
            en: item.title,
            ar: item.title
        },
        contents: {
            en: item.body,
            ar: item.body
        },
        chrome_web_icon: 'https://quiblah-muslim.vercel.app/icons/icon-192.png',
        chrome_web_badge: 'https://quiblah-muslim.vercel.app/icons/icon-192.png',
        firefox_icon: 'https://quiblah-muslim.vercel.app/icons/icon-192.png',
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

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log('✅ تم إرسال الإشعار بنجاح عبر OneSignal!');
                        console.log('📬 تفاصيل الإرسال:', JSON.stringify(parsed, null, 2));
                        resolve(parsed);
                    } else {
                        console.error('❌ خطأ من خادم OneSignal:', parsed);
                        reject(new Error(`OneSignal Error ${res.statusCode}: ${data}`));
                    }
                } catch (e) {
                    console.log('Response raw:', data);
                    resolve({ raw: data });
                }
            });
        });

        req.on('error', (err) => {
            console.error('❌ خطأ في الاتصال بالشبكة:', err);
            reject(err);
        });

        req.write(payload);
        req.end();
    });
}

// تشغيل مباشر
if (require.main === module) {
    console.log('🚀 جاري إرسال إشعار التذكير الإسلامي عبر OneSignal...');
    sendPushNotification()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = { sendPushNotification, getRandomReminder };
