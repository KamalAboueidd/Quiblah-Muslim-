// pwa.js - إدارة تثبيت تطبيق قبلة المسلم ودعم PWA
(function () {
    'use strict';

    // 1. تسجيل الـ Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('./service-worker.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker مسجل بنجاح بنطاق:', registration.scope);
                })
                .catch((error) => {
                    console.warn('[PWA] تعذر تسجيل Service Worker:', error);
                });
        });
    }

    // 2. فحص هل التطبيق مثبت ويعمل كـ Standalone App
    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        window.navigator.standalone === true;

    if (isStandalone) {
        // التطبيق مثبت بالفعل ويعمل كنافذة مستقلة، لا حاجة لإظهار أي أزرار تثبيت
        return;
    }

    // فحص بيئة iOS Safari
    const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) && !window.MSStream;
    const isIOSSafari = isIOS && /safari/.test(window.navigator.userAgent.toLowerCase()) && !/crios|fxios|opios/.test(window.navigator.userAgent.toLowerCase());

    let deferredPrompt = null;
    let installBtn = null;

    // 3. حقن تنسيقات زر التثبيت ونافذة إرشادات iOS
    const pwaStyles = `
    <style id="pwa-custom-styles">
        .pwa-install-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            border-radius: 30px;
            background: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--gold, #C5A859);
            color: var(--white, #ffffff);
            font-family: "Tajawal", sans-serif;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), 0 0 10px rgba(197, 168, 89, 0.15);
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
        }

        .pwa-install-btn:hover {
            background: rgba(197, 168, 89, 0.25);
            border-color: #dfc374;
            color: var(--gold, #C5A859);
            box-shadow: 0 6px 20px rgba(197, 168, 89, 0.35);
            transform: translateY(-50%) scale(1.03);
        }

        .pwa-install-btn:active {
            transform: translateY(-50%) scale(0.97);
        }

        .pwa-install-btn:focus-visible {
            outline: 2px solid var(--gold, #C5A859);
            outline-offset: 3px;
        }

        .pwa-install-btn i {
            color: var(--gold, #C5A859);
            font-size: 15px;
            transition: transform 0.25s ease;
        }

        .pwa-install-btn:hover i {
            transform: translateY(2px);
        }

        /* Responsive */
        @media (max-width: 850px) {
            .top-bar-install-btn {
                left: 15px;
                padding: 6px 14px;
                font-size: 13px;
            }
        }

        @media (max-width: 480px) {
            .top-bar-install-btn {
                padding: 6px 12px;
                font-size: 12px;
                gap: 6px;
            }
            .pwa-btn-full-text {
                display: none;
            }
            .pwa-btn-short-text {
                display: inline;
            }
        }

        @media (min-width: 481px) {
            .pwa-btn-short-text {
                display: none;
            }
        }

        /* iOS Safari Guide Modal */
        .pwa-ios-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            direction: rtl;
        }

        .pwa-ios-modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .pwa-ios-modal-card {
            background: #181c1c;
            border: 1px solid var(--gold, #C5A859);
            border-radius: 20px;
            max-width: 420px;
            width: 100%;
            padding: 25px 20px;
            color: #ffffff;
            box-shadow: 0 15px 40px rgba(0,0,0,0.6), 0 0 20px rgba(197, 168, 89, 0.2);
            text-align: center;
            font-family: "Tajawal", sans-serif;
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pwa-ios-modal-overlay.active .pwa-ios-modal-card {
            transform: scale(1);
        }

        .pwa-ios-modal-title {
            font-size: 20px;
            font-weight: 800;
            color: var(--gold, #C5A859);
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .pwa-ios-steps {
            text-align: right;
            padding: 0 10px;
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            gap: 14px;
            font-size: 15px;
            line-height: 1.6;
        }

        .pwa-ios-step {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.05);
            padding: 10px 14px;
            border-radius: 12px;
        }

        .pwa-ios-step i {
            color: var(--gold, #C5A859);
            font-size: 18px;
            flex-shrink: 0;
            width: 24px;
            text-align: center;
        }

        .pwa-ios-close-btn {
            background: var(--gold, #C5A859);
            color: #111111;
            border: none;
            padding: 10px 30px;
            border-radius: 25px;
            font-family: inherit;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            transition: background 0.2s;
            margin-top: 10px;
        }

        .pwa-ios-close-btn:hover {
            background: #dfc374;
        }
    </style>
    `;

    if (!document.getElementById('pwa-custom-styles')) {
        document.head.insertAdjacentHTML('beforeend', pwaStyles);
    }

    // 4. إنشاء زر التثبيت
    function createInstallButton() {
        if (document.getElementById('pwa-install-btn')) {
            return document.getElementById('pwa-install-btn');
        }

        const btn = document.createElement('button');
        btn.id = 'pwa-install-btn';
        btn.type = 'button';
        btn.className = 'pwa-install-btn';
        btn.setAttribute('aria-label', 'تثبيت تطبيق قبلة المسلم');
        btn.style.display = 'none';
        btn.innerHTML = `
            <i class="fa-solid fa-download" aria-hidden="true"></i>
            <span class="pwa-install-btn-text">
                <span class="pwa-btn-full-text">تثبيت التطبيق</span>
                <span class="pwa-btn-short-text">تثبيت</span>
            </span>
        `;

        btn.addEventListener('click', handleInstallClick);
        return btn;
    }

    // 5. موضع الزر داخل الواجهة
    function injectInstallButton() {
        installBtn = createInstallButton();

        // البحث أولاً عن .top-bar
        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            // التأكد من أن الـ top-bar يتيح الموضع النسبي للزر
            topBar.style.position = 'relative';
            installBtn.classList.add('top-bar-install-btn');
            topBar.appendChild(installBtn);
            return;
        }

        // في صفحة المصحف (quran.html) ذات التوزيع الخاص
        const mobileHeader = document.querySelector('.mobile-header');
        if (mobileHeader) {
            installBtn.style.margin = '0 10px';
            mobileHeader.appendChild(installBtn);
            return;
        }

        const navBar = document.querySelector('.nav-bar');
        if (navBar) {
            installBtn.style.margin = '5px 10px';
            navBar.appendChild(installBtn);
            return;
        }

        // Fallback في نهاية الـ body
        document.body.appendChild(installBtn);
    }

    // 6. التعامل مع الضغط على زر التثبيت
    async function handleInstallClick() {
        if (deferredPrompt) {
            // المتصفح يدعم beforeinstallprompt (Chrome, Edge, Android)
            try {
                deferredPrompt.prompt();
                const choiceResult = await deferredPrompt.userChoice;
                if (choiceResult.outcome === 'accepted') {
                    console.log('[PWA] وافق المستخدم على التثبيت');
                    if (installBtn) installBtn.style.display = 'none';
                } else {
                    console.log('[PWA] رفض المستخدم التثبيت');
                }
            } catch (err) {
                console.warn('[PWA] خطأ أثناء استدعاء prompt:', err);
            } finally {
                deferredPrompt = null;
            }
        } else if (isIOSSafari) {
            // أجهزة iOS Safari: عرض نافذة الإرشادات
            showIOSInstallModal();
        }
    }

    // 7. نافذة إرشادات iOS Safari
    function showIOSInstallModal() {
        let modal = document.getElementById('pwa-ios-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'pwa-ios-modal';
            modal.className = 'pwa-ios-modal-overlay';
            modal.innerHTML = `
                <div class="pwa-ios-modal-card">
                    <div class="pwa-ios-modal-title">
                        <i class="fa-solid fa-mobile-screen-button"></i>
                        <span>تثبيت قبلة المسلم على الآيفون</span>
                    </div>
                    <div class="pwa-ios-steps">
                        <div class="pwa-ios-step">
                            <i class="fa-solid fa-arrow-up-from-bracket"></i>
                            <span>1. اضغط على زر المشاركة <strong>(Share)</strong> في شريط متصفح Safari.</span>
                        </div>
                        <div class="pwa-ios-step">
                            <i class="fa-solid fa-square-plus"></i>
                            <span>2. مرر للأسفل واختر <strong>"إضافة إلى الشاشة الرئيسية"</strong>.</span>
                        </div>
                        <div class="pwa-ios-step">
                            <i class="fa-solid fa-check"></i>
                            <span>3. اضغط على <strong>"إضافة" (Add)</strong> بالأعلى لتثبيت التطبيق.</span>
                        </div>
                    </div>
                    <button type="button" class="pwa-ios-close-btn" id="pwa-ios-close-btn">فهمت</button>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.id === 'pwa-ios-close-btn') {
                    modal.classList.remove('active');
                }
            });
        }
        modal.classList.add('active');
    }

    // 8. الاستماع لحدث beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        // منع ظهور النافذة الافتراضية المزعجة للمتصفح
        e.preventDefault();
        deferredPrompt = e;

        if (!installBtn) {
            injectInstallButton();
        }
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
        }
    });

    // 9. الاستماع لحدث اكتمال التثبيت بنجاح
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] تم تثبيت التطبيق بنجاح');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
        deferredPrompt = null;
        if (typeof window.showToast === 'function') {
            window.showToast('تم تثبيت تطبيق قبلة المسلم بنجاح', 'fa-solid fa-circle-check', 6000);
        }
    });

    // 10. إظهار الزر لمستخدمي iOS Safari إن رغبوا
    document.addEventListener('DOMContentLoaded', () => {
        injectInstallButton();

        if (isIOSSafari && !isStandalone) {
            // إظهار زر التثبيت على iOS Safari
            if (installBtn) {
                installBtn.style.display = 'inline-flex';
            }
        }
    });
})();
