// reminders.js - نظام التذكيرات الإسلامية والإشعارات الحقيقية (Web Push)
(function () {
    'use strict';

    // 1. مفاتيح التخزين والإعدادات الافتراضية
    const STORAGE_KEY = 'quiblah_islamic_reminders';
    const DEFAULT_SETTINGS = {
        enabled: false,
        interval: 5, // بالدقائق
        sound: true,
        types: {
            salawat: true,
            adhkar: true,
            quran: true,
            istighfar: true
        }
    };

    let cachedSettings = null;
    let swRegistration = null;

    // 2. قراءة وحفظ الإعدادات بأمان في LocalStorage
    function getSettings() {
        if (cachedSettings) return cachedSettings;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                cachedSettings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(raw));
                return cachedSettings;
            }
        } catch (e) {
            console.warn('[Reminders] تعذر قراءة الإعدادات من التخزين المحلي:', e);
        }
        cachedSettings = Object.assign({}, DEFAULT_SETTINGS);
        return cachedSettings;
    }

    function saveSettings(newSettings) {
        cachedSettings = Object.assign({}, getSettings(), newSettings);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedSettings));
        } catch (e) {
            console.error('[Reminders] تعذر حفظ الإعدادات:', e);
        }
        return cachedSettings;
    }

    // 3. التحقق من دعم المتصفح لـ Web Push و Service Worker
    function isPushSupported() {
        return (
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window
        );
    }

    // 4. تحويل مفتاح VAPID من Base64Url إلى Uint8Array
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // 5. صوت التذكير: تشغيل مقطع الصلاة على النبي ﷺ مع الرجوع للنغمة الهادئة
    function playSalawatAudio() {
        try {
            const audio = new Audio('assets/salawat.mp3');
            audio.volume = 0.85;
            audio.play().catch(() => {
                playGentleReminderChime();
            });
        } catch (e) {
            playGentleReminderChime();
        }
    }

    function playGentleReminderChime() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const now = ctx.currentTime;
            const freqs = [528, 660];
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + (idx * 0.1));

                gain.gain.setValueAtTime(0, now + (idx * 0.1));
                gain.gain.linearRampToValueAtTime(0.15, now + (idx * 0.1) + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.1) + 1.2);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now + (idx * 0.1));
                osc.stop(now + (idx * 0.1) + 1.25);
            });
        } catch (e) {
            console.warn('[Reminders] تعذر تشغيل نغمة التذكير:', e);
        }
    }

    // الاستماع لرسائل السيرفس ووركر لتشغيل الصوت عند وصول تذكير والتطبيق مفتوح
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'PUSH_REMINDER_RECEIVED') {
                const settings = getSettings();
                if (settings.enabled && settings.sound) {
                    playSalawatAudio();
                }
            }
        });
    }

    // 6. الحصول على Service Worker Registration
    async function getSWRegistration() {
        if (swRegistration) return swRegistration;
        if (!('serviceWorker' in navigator)) return null;

        try {
            swRegistration = await navigator.serviceWorker.ready;
            return swRegistration;
        } catch (e) {
            console.warn('[Reminders] تعذر الحصول على جاهزية السيرفس ووركر:', e);
            return null;
        }
    }

    // 7. الاشتراك الفعلي في Web Push وإرسال البيانات للسيرفر
    async function subscribeToPush() {
        const registration = await getSWRegistration();
        if (!registration) {
            throw new Error('Service Worker غير جاهز أو غير مفعل في هذه الصفحة');
        }

        // 1. طلب إذن المتصفح الصريح
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('لم يتم منح إذن الإشعارات من المتصفح');
        }

        // 2. جلب المفتاح العام VAPID من السيرفر
        let vapidPublicKey = null;
        try {
            const resp = await fetch('./api/push/vapid-public-key');
            if (resp.ok) {
                const data = await resp.json();
                vapidPublicKey = data.publicKey;
            }
        } catch (e) {
            console.warn('[Reminders] تعذر الاتصال بنقطة VAPID على السيرفر:', e);
        }

        if (!vapidPublicKey) {
            throw new Error('تعذر جلب مفتاح التشفير من الخادم. تأكد من تشغيل السيرفر (node server.js).');
        }

        const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

        // 3. الاشتراك عبر PushManager
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            });
        }

        // 4. إرسال بيانات الاشتراك وتفضيلات المستخدم للخادم
        const settings = getSettings();
        const activeTypes = Object.keys(settings.types).filter(k => settings.types[k]);

        await fetch('./api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subscription: subscription,
                settings: {
                    enabled: true,
                    interval: parseInt(settings.interval, 10) || 5,
                    types: activeTypes,
                    sound: !!settings.sound
                }
            })
        });

        console.log('[Reminders] تم الاشتراك بنجاح في نظام التذكيرات الفعلي.');
        return subscription;
    }

    // 8. إلغاء الاشتراك
    async function unsubscribeFromPush() {
        const registration = await getSWRegistration();
        if (!registration) return;

        try {
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                // إبلاغ السيرفر أولاً
                try {
                    await fetch('./api/push/unsubscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ endpoint: subscription.endpoint })
                    });
                } catch (e) {}

                // إلغاء الاشتراك من المتصفح
                await subscription.unsubscribe();
                console.log('[Reminders] تم إلغاء اشتراك الإشعارات من المتصفح.');
            }
        } catch (e) {
            console.warn('[Reminders] خطأ أثناء إلغاء الاشتراك:', e);
        }
    }

    // 9. إرسال إشعار تجريبي فوري
    async function sendTestNotification() {
        const registration = await getSWRegistration();
        if (!registration) {
            alert('السيرفس ووركر غير مفعل حالياً.');
            return;
        }

        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            alert('يرجى تفعيل التذكيرات أولاً للاشتراك في الإشعارات.');
            return;
        }

        try {
            const resp = await fetch('./api/push/send-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscription: subscription,
                    message: "صلِّ على النبي ﷺ 🤍"
                })
            });
            const resData = await resp.json();
            if (resData.success) {
                console.log('[Reminders] تم إرسال الإشعار التجريبي بنجاح.');
            } else {
                alert('حدث خطأ أثناء إرسال الإشعار التجريبي: ' + (resData.error || ''));
            }
        } catch (e) {
            alert('تعذر الاتصال بالخادم لإرسال الإشعار: ' + e.message);
        }
    }

    // 10. حقن واجهة إعدادات التذكيرات الإسلامية (Settings UI Modal & Styles)
    function injectStylesAndModal() {
        if (document.getElementById('islamic-reminders-styles')) return;

        const styles = `
        <style id="islamic-reminders-styles">
            /* Trigger Button in Top Bar / Navigation */
            .reminders-trigger-btn {
                display: inline-flex;
                align-items: center;
                gap: 7px;
                background: rgba(0, 0, 0, 0.45);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(197, 168, 89, 0.35);
                color: var(--gold, #C5A859);
                padding: 6px 14px;
                border-radius: 20px;
                font-family: inherit;
                font-size: 13.5px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.25s ease;
                white-space: nowrap;
                user-select: none;
                outline: none;
            }

            .reminders-trigger-btn:hover {
                background: rgba(197, 168, 89, 0.2);
                border-color: var(--gold, #C5A859);
                color: #ffffff;
                box-shadow: 0 0 12px rgba(197, 168, 89, 0.3);
                transform: translateY(-1px);
            }

            .reminders-trigger-btn.active {
                border-color: #4ade80;
                color: #ffffff;
                background: rgba(74, 222, 128, 0.12);
            }

            .reminders-trigger-btn .active-dot {
                width: 7px;
                height: 7px;
                background: #4ade80;
                border-radius: 50%;
                display: inline-block;
                box-shadow: 0 0 8px #4ade80;
            }

            /* Modal Backdrop */
            .reminders-modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                height: 100dvh;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                box-sizing: border-box;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .reminders-modal-backdrop.open {
                opacity: 1;
                pointer-events: auto;
            }

            /* Modal Card */
            .reminders-modal-card {
                background: #0f1014;
                background: rgba(15, 16, 20, 0.96);
                border: 1px solid rgba(197, 168, 89, 0.35);
                border-radius: 20px;
                width: 100%;
                max-width: 440px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(197, 168, 89, 0.15);
                padding: 24px;
                box-sizing: border-box;
                font-family: "Tajawal", sans-serif;
                color: #ffffff;
                direction: rtl;
                transform: translateY(20px) scale(0.97);
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                max-height: 90vh;
                overflow-y: auto;
            }

            .reminders-modal-backdrop.open .reminders-modal-card {
                transform: translateY(0) scale(1);
            }

            /* Modal Header */
            .reminders-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                padding-bottom: 14px;
                margin-bottom: 20px;
            }

            .reminders-modal-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 19px;
                font-weight: 800;
                color: var(--gold, #C5A859);
            }

            .reminders-modal-close {
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(197, 168, 89, 0.2);
                color: var(--gold, #C5A859);
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .reminders-modal-close:hover {
                background: rgba(197, 168, 89, 0.2);
                color: #ffffff;
            }

            /* Section Rows */
            .reminders-setting-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 14px;
                padding: 14px 16px;
                margin-bottom: 14px;
                transition: border-color 0.2s;
            }

            .reminders-setting-row:hover {
                border-color: rgba(197, 168, 89, 0.25);
            }

            .setting-info {
                display: flex;
                flex-direction: column;
                gap: 3px;
            }

            .setting-title {
                font-size: 15px;
                font-weight: 700;
                color: #ffffff;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .setting-desc {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.55);
            }

            /* Toggle Switch */
            .reminder-switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 26px;
                flex-shrink: 0;
            }

            .reminder-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .reminder-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: rgba(255, 255, 255, 0.15);
                transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 34px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .reminder-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 4px;
                bottom: 3px;
                background-color: #ffffff;
                transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 50%;
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            }

            .reminder-switch input:checked + .reminder-slider {
                background-color: var(--gold, #C5A859);
                border-color: #dfc274;
            }

            .reminder-switch input:checked + .reminder-slider:before {
                transform: translateX(20px);
                background-color: #111111;
            }

            /* Interval Select */
            .interval-select {
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid rgba(197, 168, 89, 0.35);
                color: var(--gold, #C5A859);
                padding: 6px 12px;
                border-radius: 10px;
                font-family: inherit;
                font-size: 13.5px;
                font-weight: 700;
                outline: none;
                cursor: pointer;
            }

            /* Types Box */
            .reminder-types-box {
                background: rgba(0, 0, 0, 0.25);
                border: 1px solid rgba(255, 255, 255, 0.07);
                border-radius: 14px;
                padding: 14px 16px;
                margin-bottom: 16px;
            }

            .types-box-title {
                font-size: 14px;
                font-weight: 700;
                color: var(--gold, #C5A859);
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 7px;
            }

            .types-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .type-check-label {
                display: flex;
                align-items: center;
                gap: 9px;
                font-size: 13.5px;
                color: rgba(255, 255, 255, 0.85);
                cursor: pointer;
                user-select: none;
            }

            .type-check-label input {
                accent-color: var(--gold, #C5A859);
                width: 16px;
                height: 16px;
                cursor: pointer;
            }

            /* Actions / Buttons */
            .reminders-actions {
                display: flex;
                gap: 10px;
                margin-top: 18px;
            }

            .btn-test-notification {
                flex: 1;
                background: transparent !important;
                border: 1px solid var(--gold, #C5A859) !important;
                color: var(--gold, #C5A859) !important;
                padding: 10px 14px;
                border-radius: 12px;
                font-family: inherit;
                font-size: 13.5px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 7px;
                outline: none;
            }

            .btn-test-notification:hover {
                background: rgba(197, 168, 89, 0.15) !important;
                color: #ffffff !important;
                box-shadow: 0 0 15px rgba(197, 168, 89, 0.3);
            }

            .btn-sound-preview {
                background: transparent !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                color: #ffffff !important;
                padding: 10px 14px;
                border-radius: 12px;
                font-family: inherit;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                outline: none;
            }

            .btn-sound-preview:hover {
                border-color: var(--gold, #C5A859) !important;
                color: var(--gold, #C5A859) !important;
                background: rgba(197, 168, 89, 0.08) !important;
            }

            .reminders-unsupported-note {
                background: rgba(239, 68, 68, 0.15);
                border: 1px solid rgba(239, 68, 68, 0.4);
                color: #fca5a5;
                font-size: 12.5px;
                padding: 10px 12px;
                border-radius: 10px;
                margin-bottom: 14px;
                line-height: 1.6;
                display: none;
            }
        </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);

        const modalHtml = `
        <div class="reminders-modal-backdrop" id="reminders-modal-backdrop">
            <div class="reminders-modal-card" id="reminders-modal-card" role="dialog" aria-modal="true">
                <div class="reminders-modal-header">
                    <div class="reminders-modal-title">
                        <i class="fa-solid fa-bell"></i>
                        <span>التذكيرات الإسلامية</span>
                    </div>
                    <button type="button" class="reminders-modal-close" id="reminders-modal-close-btn" aria-label="إغلاق">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="reminders-unsupported-note" id="reminders-unsupported-note">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    تنبيه: متصفحك أو هذا الرابط لا يدعم خدمة Web Push الحقيقية في الخلفية. لكي تعمل الإشعارات كإشعارات نظام مستقلة، يرجى تشغيل التطبيق عبر السيرفر (Localhost) أو بروتوكول HTTPS.
                </div>

                <!-- Row: Enable Switch -->
                <div class="reminders-setting-row">
                    <div class="setting-info">
                        <div class="setting-title">
                            <i class="fa-solid fa-heart" style="color: var(--gold);"></i>
                            <span>تفعيل التذكيرات</span>
                        </div>
                        <div class="setting-desc">إرسال إشعارات نظام حقيقية حتى عند قفل الشاشة</div>
                    </div>
                    <label class="reminder-switch">
                        <input type="checkbox" id="reminder-enable-toggle" />
                        <span class="reminder-slider"></span>
                    </label>
                </div>

                <!-- Row: Interval -->
                <div class="reminders-setting-row">
                    <div class="setting-info">
                        <div class="setting-title">
                            <i class="fa-solid fa-clock" style="color: var(--gold);"></i>
                            <span>الفاصل الزمني</span>
                        </div>
                        <div class="setting-desc">تكرار التذكير بذكر الله والصلاة على النبي ﷺ</div>
                    </div>
                    <select class="interval-select" id="reminder-interval-select">
                        <option value="5">كل 5 دقائق (الموصى به)</option>
                        <option value="15">كل 15 دقيقة</option>
                        <option value="30">كل 30 دقيقة</option>
                        <option value="60">كل ساعة</option>
                    </select>
                </div>

                <!-- Row: Sound -->
                <div class="reminders-setting-row">
                    <div class="setting-info">
                        <div class="setting-title">
                            <i class="fa-solid fa-volume-high" style="color: var(--gold);"></i>
                            <span>صوت التذكير</span>
                        </div>
                        <div class="setting-desc">نغمة هادئة لطيفة عند فتح التطبيق</div>
                    </div>
                    <label class="reminder-switch">
                        <input type="checkbox" id="reminder-sound-toggle" />
                        <span class="reminder-slider"></span>
                    </label>
                </div>

                <!-- Types Checklist -->
                <div class="reminder-types-box">
                    <div class="types-box-title">
                        <i class="fa-solid fa-list-check"></i>
                        <span>محتوى التذكيرات:</span>
                    </div>
                    <div class="types-grid">
                        <label class="type-check-label">
                            <input type="checkbox" id="type-salawat" />
                            <span>الصلاة على النبي ﷺ</span>
                        </label>
                        <label class="type-check-label">
                            <input type="checkbox" id="type-adhkar" />
                            <span>الأذكار والتسبيح</span>
                        </label>
                        <label class="type-check-label">
                            <input type="checkbox" id="type-quran" />
                            <span>آيات قرآنية</span>
                        </label>
                        <label class="type-check-label">
                            <input type="checkbox" id="type-istighfar" />
                            <span>الاستغفار</span>
                        </label>
                    </div>
                </div>

                <!-- Actions -->
                <div class="reminders-actions">
                    <button type="button" class="btn-test-notification" id="btn-send-test-push">
                        <i class="fa-solid fa-paper-plane"></i>
                        <span>إرسال إشعار تجريبي الآن</span>
                    </button>
                    <button type="button" class="btn-sound-preview" id="btn-sound-preview" title="تجربة صوت النغمة">
                        <i class="fa-solid fa-play"></i>
                        <span>نغمة</span>
                    </button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // ربط الأحداث
        setupModalEvents();
    }

    // 11. مزامنة الواجهة مع التخزين المحلي
    function syncUIFromSettings() {
        const settings = getSettings();

        const enableToggle = document.getElementById('reminder-enable-toggle');
        const intervalSelect = document.getElementById('reminder-interval-select');
        const soundToggle = document.getElementById('reminder-sound-toggle');
        const typeSalawat = document.getElementById('type-salawat');
        const typeAdhkar = document.getElementById('type-adhkar');
        const typeQuran = document.getElementById('type-quran');
        const typeIstighfar = document.getElementById('type-istighfar');

        if (enableToggle) enableToggle.checked = !!settings.enabled;
        if (intervalSelect) intervalSelect.value = String(settings.interval || 5);
        if (soundToggle) soundToggle.checked = !!settings.sound;

        if (typeSalawat) typeSalawat.checked = !!settings.types.salawat;
        if (typeAdhkar) typeAdhkar.checked = !!settings.types.adhkar;
        if (typeQuran) typeQuran.checked = !!settings.types.quran;
        if (typeIstighfar) typeIstighfar.checked = !!settings.types.istighfar;

        // تحديث زر الـ Trigger في الصفحة إن وُجد
        const triggerBtns = document.querySelectorAll('.reminders-trigger-btn');
        triggerBtns.forEach(btn => {
            if (settings.enabled) {
                btn.classList.add('active');
                btn.innerHTML = `<i class="fa-solid fa-bell"></i> <span>التذكير: مفعّل</span> <span class="active-dot"></span>`;
            } else {
                btn.classList.remove('active');
                btn.innerHTML = `<i class="fa-regular fa-bell"></i> <span>التذكيرات 🔔</span>`;
            }
        });

        // تحديث شارة بطاقة التذكيرات السريعة إن وُجدت
        const quickStatus = document.getElementById('reminders-quick-status');
        if (quickStatus) {
            if (settings.enabled) {
                quickStatus.textContent = `مفعّل (كل ${settings.interval || 5} دقائق)`;
                quickStatus.classList.add('active');
            } else {
                quickStatus.textContent = 'غير مفعّل';
                quickStatus.classList.remove('active');
            }
        }
    }

    // 12. ربط عناصر الـ Modal
    function setupModalEvents() {
        const backdrop = document.getElementById('reminders-modal-backdrop');
        const card = document.getElementById('reminders-modal-card');
        const closeBtn = document.getElementById('reminders-modal-close-btn');
        const enableToggle = document.getElementById('reminder-enable-toggle');
        const intervalSelect = document.getElementById('reminder-interval-select');
        const soundToggle = document.getElementById('reminder-sound-toggle');
        const testPushBtn = document.getElementById('btn-send-test-push');
        const soundPreviewBtn = document.getElementById('btn-sound-preview');
        const unsupportedNote = document.getElementById('reminders-unsupported-note');

        if (!isPushSupported() && unsupportedNote) {
            unsupportedNote.style.display = 'block';
        }

        // إغلاق النافذة
        function closeModal() {
            backdrop.classList.remove('open');
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) closeModal();
            });
        }

        // زر التجربة الصوتية
        if (soundPreviewBtn) {
            soundPreviewBtn.addEventListener('click', () => {
                playGentleReminderChime();
            });
        }

        // تفعيل / تعطيل التذكيرات
        if (enableToggle) {
            enableToggle.addEventListener('change', async function () {
                const wantEnabled = this.checked;
                if (wantEnabled) {
                    try {
                        // طلب الإذن والاشتراك الصريح
                        await subscribeToPush();
                        saveSettings({ enabled: true });
                        syncUIFromSettings();
                        if (typeof window.showToast === 'function') {
                            window.showToast('تم تفعيل التذكيرات الإسلامية بنجاح 🤍');
                        }
                    } catch (err) {
                        this.checked = false;
                        saveSettings({ enabled: false });
                        syncUIFromSettings();
                        alert('تعذر تفعيل التذكيرات: ' + err.message);
                    }
                } else {
                    // إلغاء التفعيل
                    try {
                        await unsubscribeFromPush();
                    } catch(e) {}
                    saveSettings({ enabled: false });
                    syncUIFromSettings();
                    if (typeof window.showToast === 'function') {
                        window.showToast('تم إيقاف التذكيرات مؤقتاً.');
                    }
                }
            });
        }

        // تغيير الفاصل الزمني
        if (intervalSelect) {
            intervalSelect.addEventListener('change', function () {
                const val = parseInt(this.value, 10);
                saveSettings({ interval: val });
                // تحديث الخادم إذا كان مفعلاً
                const settings = getSettings();
                if (settings.enabled) {
                    subscribeToPush().catch(() => {});
                }
            });
        }

        // تبديل الصوت
        if (soundToggle) {
            soundToggle.addEventListener('change', function () {
                saveSettings({ sound: this.checked });
            });
        }

        // فئات الأذكار
        ['type-salawat', 'type-adhkar', 'type-quran', 'type-istighfar'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', function () {
                    const settings = getSettings();
                    const key = id.replace('type-', '');
                    settings.types[key] = this.checked;
                    saveSettings({ types: settings.types });

                    if (settings.enabled) {
                        subscribeToPush().catch(() => {});
                    }
                });
            }
        });

        // إرسال إشعار تجريبي
        if (testPushBtn) {
            testPushBtn.addEventListener('click', async () => {
                const settings = getSettings();
                if (!settings.enabled) {
                    if (confirm('التذكيرات غير مفعلة حالياً. هل ترغب في تفعيلها لإرسال الإشعار؟')) {
                        enableToggle.checked = true;
                        enableToggle.dispatchEvent(new Event('change'));
                        setTimeout(sendTestNotification, 1000);
                    }
                    return;
                }
                await sendTestNotification();
            });
        }
    }

    // 13. الواجهة العامة (Public API)
    window.IslamicReminders = {
        openSettings: function () {
            injectStylesAndModal();
            syncUIFromSettings();
            const backdrop = document.getElementById('reminders-modal-backdrop');
            if (backdrop) backdrop.classList.add('open');
        },
        getSettings: getSettings,
        isSupported: isPushSupported,
        playChime: playGentleReminderChime
    };

    // التهيئة عند تحميل الصفحة
    window.addEventListener('DOMContentLoaded', () => {
        injectStylesAndModal();
        syncUIFromSettings();
    });

})();
