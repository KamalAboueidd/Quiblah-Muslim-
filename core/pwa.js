// core/pwa.js - إدارة تثبيت تطبيق قبلة المسلم ودعم PWA لكافة الأجهزة والمنصات
(function () {
    'use strict';

    // 1. تسجيل الـ Service Worker وإدارة التحديث التلقائي
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('./service-worker.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker مسجل بنجاح بنطاق:', registration.scope);
                    registration.update();
                })
                .catch((error) => {
                    console.warn('[PWA] تعذر تسجيل Service Worker:', error);
                });
        });

        // فحص التحديثات عند العودة للتطبيق من الخلفية
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                navigator.serviceWorker.getRegistration().then((reg) => {
                    if (reg) reg.update();
                });
            }
        });

        // عند تفعيل سيرفس ووركر جديد
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[PWA] تم تفعيل إصدار جديد من التطبيق بنجاح');
        });
    }

    // 2. فحص هل التطبيق مثبت ويعمل كـ Standalone App
    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');

    if (isStandalone) {
        // التطبيق مثبت بالفعل ويعمل كنافذة مستقلة - إخفاء جميع عناصر التثبيت فوراً
        document.documentElement.classList.add('is-standalone');
        const hideTriggers = () => {
            document.querySelectorAll('.pwa-install-trigger, #pwa-install-btn, .top-bar-install-btn, .footer-pwa-action, .sheet-pwa-banner, #btn-bot-install-pwa').forEach((el) => {
                el.style.setProperty('display', 'none', 'important');
            });
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', hideTriggers);
        } else {
            hideTriggers();
        }
        return;
    }

    // فحص بيئة ونوع جهاز المستخدم
    const ua = (window.navigator.userAgent || '').toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    const isAndroid = /android/.test(ua);
    const isDesktop = !isIOS && !isAndroid;

    let deferredPrompt = null;
    let installBtn = null;
    let isDownloadingApp = false;

    // 3. حقن تنسيقات أزرار التثبيت ونافذة الإرشادات الشاملة
    const pwaStyles = `
    <style id="pwa-custom-styles">
        /* إخفاء عناصر التثبيت داخل التطبيق المثبت */
        @media (display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui), (display-mode: window-controls-overlay) {
            .pwa-install-trigger,
            .pwa-install-btn,
            .sheet-pwa-banner,
            .footer-pwa-action,
            #btn-bot-install-pwa {
                display: none !important;
            }
        }
        html.is-standalone .pwa-install-trigger,
        html.is-standalone .pwa-install-btn,
        html.is-standalone .sheet-pwa-banner,
        html.is-standalone .footer-pwa-action,
        html.is-standalone #btn-bot-install-pwa {
            display: none !important;
        }
        /* زر التثبيت في شريط العنوان أو الرأس (Desktop & Tablet) */
        .pwa-install-btn {
            display: inline-flex !important;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            border-radius: 30px;
            background: rgba(197, 168, 89, 0.1) !important;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(197, 168, 89, 0.4) !important;
            color: var(--white, #ffffff);
            font-family: "Tajawal", sans-serif;
            font-size: 13.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.25s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
            outline: none;
            text-decoration: none;
            user-select: none;
            white-space: nowrap;
        }

        .top-bar-install-btn {
            position: absolute;
            left: 30px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 20;
        }

        .pwa-install-btn:hover {
            background: rgba(197, 168, 89, 0.22) !important;
            border-color: var(--gold, #C5A859) !important;
            color: var(--gold-light, #f5e4ab);
            box-shadow: 0 0 16px rgba(197, 168, 89, 0.4);
            transform: translateY(-50%) scale(1.02);
        }

        .pwa-install-btn i {
            color: var(--gold, #C5A859);
            font-size: 14px;
            transition: transform 0.2s ease;
        }

        .pwa-install-btn:hover i {
            transform: translateY(-1px);
        }

        /* في صفحة المساعد الذكي (bot.html) */
        .bot-pwa-header-btn {
            display: inline-flex !important;
            align-items: center;
            gap: 6px;
            background: rgba(197, 168, 89, 0.08) !important;
            border: 1px solid rgba(197, 168, 89, 0.25) !important;
            color: var(--gold, #C5A859);
            padding: 7px 12px;
            border-radius: 12px;
            font-family: inherit;
            font-size: 13.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.25s ease;
            white-space: nowrap;
        }

        .bot-pwa-header-btn:hover {
            background: rgba(197, 168, 89, 0.18) !important;
            border-color: var(--gold, #C5A859) !important;
            color: var(--gold-light, #f5e4ab);
            transform: translateY(-1px);
        }

        /* التجاوب للشاشات الصغيرة */
        @media (max-width: 1024px) {
            .top-bar-install-btn {
                display: none !important; /* على الموبايل والتابلت يتم الاعتماد على الفوتر وشيت استكشف */
            }
        }

        /* نافذة إرشادات التثبيت الذكية لجميع الأجهزة */
        .pwa-guide-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 10000000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            direction: rtl;
        }

        .pwa-guide-modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .pwa-guide-modal-card {
            background: rgba(12, 12, 12, 0.65);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(197, 168, 89, 0.3);
            border-radius: 24px;
            max-width: 440px;
            width: 100%;
            padding: 26px 22px;
            color: #ffffff;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 20px rgba(197, 168, 89, 0.15);
            text-align: right;
            direction: rtl;
            font-family: "Tajawal", sans-serif;
            transform: scale(0.92);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pwa-guide-modal-overlay.active .pwa-guide-modal-card {
            transform: scale(1);
        }

        .pwa-guide-modal-header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
            margin-bottom: 18px;
            direction: rtl;
        }

        .pwa-guide-modal-icon {
            width: auto;
            height: auto;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            filter: none !important;
            border-radius: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--gold, #C5A859);
            font-size: 26px;
            padding: 0;
            flex-shrink: 0;
        }

        .pwa-guide-modal-title {
            font-size: 19px;
            font-weight: 800;
            color: var(--gold, #C5A859);
            margin: 0;
            text-align: right;
        }

        .pwa-guide-steps {
            text-align: right;
            direction: rtl;
            padding: 0;
            margin: 18px 0 22px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-size: 14.5px;
            line-height: 1.6;
        }

        .pwa-guide-step {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            text-align: right;
            direction: rtl;
            gap: 12px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(197, 168, 89, 0.12);
            padding: 12px 14px;
            border-radius: 14px;
        }

        .pwa-guide-step i {
            color: var(--gold, #C5A859);
            font-size: 18px;
            flex-shrink: 0;
            width: 24px;
            text-align: center;
        }

        .pwa-guide-step span {
            text-align: right;
            flex: 1;
            color: rgba(255, 255, 255, 0.9);
        }

        .pwa-guide-step strong {
            color: var(--gold-light, #f5e4ab);
        }

        .pwa-guide-close-btn {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: var(--gold, #C5A859);
            padding: 8px 24px;
            border-radius: 20px;
            font-family: inherit;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.2s ease;
            display: block;
            margin: 10px auto 0;
            text-align: center;
            outline: none;
        }

        .pwa-guide-close-btn:hover {
            color: var(--gold-light, #f5e4ab);
            background: transparent !important;
            transform: scale(1.08);
            text-shadow: 0 0 10px rgba(197, 168, 89, 0.5);
        }
    </style>
    `;

    if (!document.getElementById('pwa-custom-styles')) {
        document.head.insertAdjacentHTML('beforeend', pwaStyles);
    }

    // 4. إنشاء زر التثبيت الأساسي
    function createInstallButton() {
        if (document.getElementById('pwa-install-btn')) {
            return document.getElementById('pwa-install-btn');
        }

        const btn = document.createElement('button');
        btn.id = 'pwa-install-btn';
        btn.type = 'button';
        btn.className = 'pwa-install-btn pwa-install-trigger';
        btn.setAttribute('aria-label', 'تثبيت تطبيق قبلة المسلم');
        btn.title = 'تثبيت التطبيق على جهازك';
        btn.innerHTML = `
            <i class="fa-solid fa-cloud-arrow-down" aria-hidden="true"></i>
            <span>تثبيت التطبيق</span>
        `;

        btn.addEventListener('click', handleInstallClick);
        return btn;
    }

    // 5. موضع الزر داخل الواجهة
    function injectInstallButton() {
        installBtn = createInstallButton();

        // 1) إذا تواجد .top-bar (كما في الصفحة الرئيسية وغيرها على Desktop)
        const topBar = document.querySelector('.top-bar');
        if (topBar && !document.querySelector('.top-bar .top-bar-install-btn')) {
            installBtn.classList.add('top-bar-install-btn');
            topBar.appendChild(installBtn);
        }

        // 2) إذا كانت صفحة المساعد الذكي (bot.html)
        const botHeaderActions = document.querySelector('.bot-header-actions');
        if (botHeaderActions && !document.getElementById('btn-bot-install-pwa')) {
            const botBtn = document.createElement('button');
            botBtn.id = 'btn-bot-install-pwa';
            botBtn.type = 'button';
            botBtn.className = 'bot-pwa-header-btn pwa-install-trigger';
            botBtn.title = 'تثبيت التطبيق على جهازك';
            botBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> <span>تثبيت</span>';
            botBtn.addEventListener('click', handleInstallClick);
            botHeaderActions.prepend(botBtn);
        }

        // 3) ربط جميع الأزرار والروابط التي تحمل كلاس .pwa-install-trigger في الصفحة
        document.querySelectorAll('.pwa-install-trigger').forEach((el) => {
            el.removeEventListener('click', handleInstallClick);
            el.addEventListener('click', handleInstallClick);
            el.style.display = 'inline-flex';
        });
    }

    // 6. التعامل مع الضغط على زر التثبيت
    async function handleInstallClick(e) {
        if (e && e.preventDefault) e.preventDefault();

        // إغلاق قائمة الصفحات السفلية إن كانت مفتوحة
        if (typeof window.closePagesSheet === 'function') {
            window.closePagesSheet();
        }

        if (deferredPrompt) {
            // المتصفح يدعم beforeinstallprompt (Chrome / Android / Edge)
            try {
                deferredPrompt.prompt();
                const choiceResult = await deferredPrompt.userChoice;
                if (choiceResult && choiceResult.outcome === 'accepted') {
                    console.log('[PWA] وافق المستخدم على التثبيت');
                    isDownloadingApp = true;
                    if (typeof window.showToast === 'function') {
                        window.showToast('جاري التنزيل...', 'fa-solid fa-spinner fa-spin', 6000);
                    }
                    hideAllInstallTriggers();
                } else {
                    console.log('[PWA] رفض المستخدم التثبيت');
                }
            } catch (err) {
                console.warn('[PWA] خطأ أثناء استدعاء prompt:', err);
                showInstallGuideModal();
            } finally {
                deferredPrompt = null;
            }
        } else {
            // إذا لم يتوفر حدث التثبيت التلقائي (مثل بعد الحذف، على iOS، أو متصفحات سطح المكتب)
            showInstallGuideModal();
        }
    }

    // إتاحة الدالة عالمياً
    window.triggerPWAInstall = handleInstallClick;

    // 7. نافذة إرشادات التثبيت الذكية المتوافقة مع نوع الجهاز
    function showInstallGuideModal() {
        let modal = document.getElementById('pwa-guide-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'pwa-guide-modal';
            modal.className = 'pwa-guide-modal-overlay';

            let title = 'تثبيت تطبيق قبلة المسلم';
            let iconHtml = '<i class="fa-solid fa-cloud-arrow-down"></i>';
            let stepsHtml = '';

            if (isIOS) {
                iconHtml = '<i class="fa-brands fa-apple"></i>';
                title = 'تثبيت التطبيق على الآيفون والآيباد';
                stepsHtml = `
                    <div class="pwa-guide-step">
                        <i class="fa-solid fa-arrow-up-from-bracket"></i>
                        <span>1. اضغط على زر المشاركة <strong>(Share)</strong> أسفل شريط متصفح Safari.</span>
                    </div>
                    <div class="pwa-guide-step">
                        <i class="fa-solid fa-square-plus"></i>
                        <span>2. مرر للأسفل واختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</span>
                    </div>
                    <div class="pwa-guide-step">
                        <i class="fa-solid fa-check"></i>
                        <span>3. اضغط على <strong>"إضافة" (Add)</strong> بالأعلى لتثبيت التطبيق على جهازك.</span>
                    </div>
                `;
            } else if (isAndroid) {
                iconHtml = '<i class="fa-brands fa-android"></i>';
                title = 'تثبيت التطبيق على الأندرويد';
                stepsHtml = `
                    <div class="pwa-guide-step">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                        <span>1. اضغط على زر القائمة <strong>(الثلاث نقاط ⋮)</strong> أعلى المتصفح.</span>
                    </div>
                    <div class="pwa-guide-step">
                        <i class="fa-solid fa-download"></i>
                        <span>2. اختر <strong>"تثبيت التطبيق" (Install app)</strong> أو <strong>"إضافة للشاشة الرئيسية"</strong>.</span>
                    </div>
                    <div class="pwa-guide-step">
                        <i class="fa-solid fa-check"></i>
                        <span>3. وافق على التثبيت وسيعمل التطبيق كبرنامج مستقل وسريع.</span>
                    </div>
                `;
            } else {
                // Desktop / Laptop (Chrome / Edge / Safari / Windows / Mac)
                iconHtml = '<i class="fa-solid fa-laptop"></i>';
                title = 'تثبيت التطبيق على جهاز الكمبيوتر';
                stepsHtml = `
                    <div class="pwa-guide-step">
                        <i class="fa-solid fa-circle-down"></i>
                        <span>1. اضغط على أيقونة التثبيت <strong>(Install ⊕)</strong> الموجودة في شريط العنوان أعلى المتصفح بجوار الرابط.</span>
                    </div>
                    <div class="pwa-guide-step">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                        <span>2. أو اضغط على قائمة المتصفح <strong>(⋮)</strong> بالأعلى واختر <strong>"تثبيت تطبيق قبلة المسلم"</strong>.</span>
                    </div>
                    <div class="pwa-guide-step">
                        <i class="fa-solid fa-desktop"></i>
                        <span>3. سيعمل التطبيق كنافذة مستقلة وفائقة السرعة على جهازك.</span>
                    </div>
                `;
            }

            modal.innerHTML = `
                <div class="pwa-guide-modal-card">
                    <div class="pwa-guide-modal-header">
                        <div class="pwa-guide-modal-icon">${iconHtml}</div>
                        <h3 class="pwa-guide-modal-title">${title}</h3>
                    </div>
                    <div class="pwa-guide-steps">
                        ${stepsHtml}
                    </div>
                    <button type="button" class="pwa-guide-close-btn" id="pwa-guide-close-btn">فهمت</button>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.id === 'pwa-guide-close-btn') {
                    modal.classList.remove('active');
                }
            });
        }
        modal.classList.add('active');
    }

    // 8. إخفاء جميع عناصر التثبيت عند اكتمال التثبيت
    function hideAllInstallTriggers() {
        document.documentElement.classList.add('is-standalone');
        document.querySelectorAll('.pwa-install-trigger, #pwa-install-btn, .top-bar-install-btn, .footer-pwa-action, .sheet-pwa-banner, #btn-bot-install-pwa').forEach((el) => {
            el.style.setProperty('display', 'none', 'important');
        });
    }

    // فحص تطبيقات PWA المثبتة عبر المتصفح إن دعم ذلك
    if ('getInstalledRelatedApps' in navigator) {
        navigator.getInstalledRelatedApps().then((apps) => {
            if (apps && apps.length > 0) {
                hideAllInstallTriggers();
            }
        }).catch(() => {});
    }

    // 9. الاستماع لحدث beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        // منع ظهور البانر الافتراضي الصامت للمتصفح للاعتماد على أزرارنا الفاخرة
        e.preventDefault();
        deferredPrompt = e;
        injectInstallButton();
    });

    // 10. الاستماع لحدث اكتمال التثبيت بنجاح
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] تم تثبيت التطبيق بنجاح');
        deferredPrompt = null;
        hideAllInstallTriggers();

        // عند موافقة المستخدم يبدأ المتصفح التنزيل الفعلي أولاً، فنمنحه وقتاً كافياً لإكمال التنزيل قبل إظهار "تم التنزيل بنجاح"
        const waitMs = isDownloadingApp ? 6500 : 1500;
        setTimeout(() => {
            if (typeof window.showToast === 'function') {
                window.showToast('تم التنزيل بنجاح', 'fa-solid fa-circle-check', 6000);
            }
            isDownloadingApp = false;
        }, waitMs);
    });

    // 11. حقن أزرار التثبيت فور تحميل الـ DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectInstallButton);
    } else {
        injectInstallButton();
    }
})();
