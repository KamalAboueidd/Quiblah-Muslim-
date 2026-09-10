# قبلة المسلم (Quiblah Muslim) - Open Source Web App & PWA

> تطبيق إسلامي شامل وعصري كـ Progressive Web App (PWA)، يضم مواقيت الصلاة الدقيقة، اتجاه القبلة، قراءة وتفسير القرآن الكريم، الاستماع للتلاوات بأصوات أشهر القراء، الأذكار اليومية، وأقرب المساجد.

---

## 🌟 الميزات الرئيسية (Features)

1. **مواقيت الصلاة الدقيقة (Prayer Times)**: حساب دقيق للأوقات مع العداد التنازلي للصلاة القادمة والتقويم الهجري بناءً على الموقع الجغرافي.
2. **المصحف الشريف (Holy Quran)**: عرض السور والآيات بخط قرآني واضح، مع فهرس السور، والبحث السريع، والتفسير الميسر الفوري.
3. **التفسير ومعاني الكلمات (Tafseer)**: تفسير شامل للآيات (التفسير الميسر، تفسير الجلالين) مع إمكانية الاستماع ومشاركة الآيات.
4. **الاستماع للقرآن الكريم (Quran Audio Player)**: مشغل صوتي عائم مستمر يعمل عبر جميع الصفحات ومستوحى من تصميم المنصات العالمية، يضم مكتبة من أشهر القراء والتلاوات (MP3Quran API).
5. **أذكار الصباح والمساء والأدعية (Azkar)**: عداد إلكتروني تفاعلي مع ردود فعل لمسية (Haptic) وتنبيهات عند إتمام الأذكار.
6. **أسماء الله الحسنى (99 Names of Allah)**: استعراض تفاعلي لأسماء الله مع شرح معانيها وفضلها.
7. **بوصلة القبلة (Qibla Compass)**: تحديد اتجاه الكعبة المشرفة باستخدام مستشعرات البوصلة في الهواتف وحسابات دقيقة للزاوية الجغرافية.
8. **أقرب مسجد (Nearby Mosques)**: خريطة تفاعلية عبر Leaflet و OpenStreetMap تكتشف المساجد المحيطة بالمستخدم ضمن نطاق قابل للتخصيص (1 إلى 5 كم).
9. **حاسبة المسافة للكعبة (Distance to Kaaba)**: حساب المسافة الجيوديسية ورسم المسار المباشر نحو مكة المكرمة.
10. **تذكيرات الصلاة على النبي والسنن (Web Push Reminders)**: نظام إشعارات ويب مشفر يعمل حتى عندما يكون التطبيق مغلقاً.
11. **دعم كامل للعمل بدون إنترنت (Offline PWA)**: تخزين ذكي للأصول والبيانات في Service Worker Cache للعمل بدون اتصال.

---

## 📁 بنية المشروع وتنظيم الكود (Project Architecture)

يتبع المشروع معمارية قائمة على الميزات المستقلة (**Feature-Based Modular Architecture**) لتسهيل الصيانة والمساهمة البرمجية:

```text
PrayerTimer/
├── core/                        # النواة والمكتبات البرمجية المشتركة
│   ├── player-bridge.js         # جسر التواصل مع مشغل الصوت العام المستمر
│   ├── pwa.js                   # إدارة التثبيت وتحديثات Service Worker
│   ├── reminders.js             # عميل إشعارات الويب (Web Push Client)
│   ├── toast.js                 # نظام الإشعارات والتنبيهات المنبثقة
│   ├── visitor-counter.js       # عداد الزوار الإحصائي
│   ├── surahs_meta.js           # فهرس وبيانات سور القرآن الكريم
│   └── quran_data.js            # نصوص وبيانات المصحف الشريف
│
├── features/                    # وحدات الميزات المنفصلة (JS + CSS لكل ميزة)
│   ├── landing/                 # صفحة الهبوط الترحيبية (index.html)
│   ├── home/                    # لوحة المواقيت الرئيسية (home.html)
│   ├── quran/                   # قراءة القرآن الكريم (quran.html)
│   ├── tafseer/                 # تفسير الآيات (tafseer.html)
│   ├── listen/                  # مشغل الصوت والتلاوات (listen.html)
│   ├── azkar/                   # الأذكار العامة والأدعية (azkar.html)
│   ├── sabah-masaa/             # أذكار الصباح والمساء (sabah_masaa.html)
│   ├── names/                   # أسماء الله الحسنى (names.html)
│   ├── qibla/                   # بوصلة القبلة (qibla.html)
│   ├── mosques/                 # خريطة المساجد القريبة (mosques.html)
│   ├── distance/                # المسافة للكعبة المشرفة (distance.html)
│   └── reminders/               # إعدادات واشتراكات التذكيرات (reminders.html)
│
├── data/                        # قواعد البيانات والملفات الثابتة
│   ├── azkar.json
│   ├── names.json
│   ├── short_azkar.json
│   └── verses.json
│
├── assets/                      # الوسائط، الصور، والخلفيات
├── icons/                       # أيقونات تطبيق الـ PWA
├── api/                         # دوال الـ Serverless (Vercel Push API)
│
├── *.html                       # نقاط الدخول المهيكلة (Clean Semantic HTML)
├── service-worker.js            # نظام التخزين المؤقت المتقدم (PWA Cache v9)
├── server.js                    # خادم Node.js المحلي والمجدول الخلفي
└── .gitattributes               # إعدادات إحصائيات لغات GitHub Linguist
```

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend Core**: Vanilla JavaScript (ES6+), Modern Semantic HTML5, Modular CSS3.
- **PWA & Offline**: Service Worker (Cache Storage API), Web App Manifest.
- **Push Notifications**: Web Push API, VAPID Encryption.
- **Geospatial & Mapping**: Leaflet.js, OpenStreetMap, Overpass API.
- **HTTP Client**: Axios.
- **Icons & Typography**: FontAwesome 6, Google Fonts (Tajawal, Amiri Quran).
- **Backend / Local Server**: Node.js HTTP server.

---

## 🚀 التشغيل والتطوير المحلي (Local Development)

المشروع مصمم ليعمل بدون الحاجة لأي أدوات تجميع أو Build Bundlers معقدة:

```bash
# 1. استنساخ المستودع
git clone https://github.com/kamalaboueidd/Quiblah-Muslim-.git
cd Quiblah-Muslim-

# 2. تشغيل الخادم المحلي
node server.js
```

ثم افتح المتصفح على: `http://localhost:8000`

> **ملاحظة:** وظائف المستشعرات (البوصلة وتحديد الموقع الجغرافي) تتطلب بروتوكول HTTPS في بيئات الإنتاج (مفعل تلقائياً على GitHub Pages و Vercel).

---

## 🤝 المساهمة في المشروع (Contributing)

نرحب بكافة المساهمات لتطوير التطبيق وتحسينه:
1. قم بعمل **Fork** للمستودع.
2. أنشئ فرعاً لميزتك: `git checkout -b feature/amazing-feature`.
3. التزم بتنظيم الملفات داخل مجلد الميزة المناسب في `features/<feature-name>/`.
4. قم بعمل **Commit** للتعديلات و **Push** للفرع، ثم افتح **Pull Request**.

---

## 📄 الترخيص (License)
هذا المشروع مفتوح المصدر ومتاح لجميع المسلمين والمطورين لوجه الله تعالى.