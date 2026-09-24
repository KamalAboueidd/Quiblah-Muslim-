/**
 * features/radial-nav/radial-nav.js
 * قائمة التنقل الدائرية السريعة المتمحورة حول حافة الشاشة
 * تطبيق قبلة المسلم - طور بواسطة كمال أبو عيد
 */

(function () {
    'use strict';

    // قائمة جميع صفحات وأقسام التطبيق
    const ALL_PAGES = [
        { id: 'home', title: 'المواقيت', url: 'home.html', icon: 'fa-solid fa-clock' },
        { id: 'quran', title: 'المصحف الشريف', url: 'quran.html', icon: 'fa-solid fa-book-quran' },
        { id: 'azkar', title: 'الأذكار اليومية', url: 'azkar.html', icon: 'fa-solid fa-hands-praying' },
        { id: 'azkar_sm', title: 'الصباح والمساء', url: 'azkar.html?m=sm', icon: 'fa-solid fa-sun' },
        { id: 'qibla', title: 'اتجاه القبلة', url: 'qibla.html', icon: 'fa-solid fa-compass' },
        { id: 'tafseer', title: 'التفسير الميسر', url: 'tafseer.html', icon: 'fa-solid fa-book-open-reader' },
        { id: 'tracker', title: 'متابعة العبادات', url: 'tracker.html', icon: 'fa-solid fa-calendar-check' },
        { id: 'hadith', title: 'الأحاديث النبوية', url: 'hadith.html', icon: 'fa-solid fa-book-bookmark' },
        { id: 'listen', title: 'الاستماع والتلاوات', url: 'listen.html', icon: 'fa-solid fa-headphones' },
        { id: 'names', title: 'أسماء الله الحسنى', url: 'names.html', icon: 'fa-solid fa-list-ol' },
        { id: 'mosques', title: 'أقرب مسجد', url: 'mosques.html', icon: 'fa-solid fa-mosque' },
        { id: 'quiz', title: 'اختبر نفسك', url: 'quiz.html', icon: 'fa-solid fa-award' },
        { id: 'bot', title: 'المساعد الذكي', url: 'bot.html', icon: 'fa-solid fa-robot' }
    ];

    let closeTimeout = null;
    let isPinned = false;

    // تهيئة القائمة عند اكتمال تحميل DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRadialNav);
    } else {
        initRadialNav();
    }

    function initRadialNav() {
        if (document.getElementById('radial-nav-container')) return;

        // تحديد الصفحة الحالية لاستبعادها وعرض باقي الصفحات
        const currentPath = window.location.pathname.split('/').pop() || 'home.html';
        const search = window.location.search || '';
        
        let destinationPages = ALL_PAGES.filter(p => {
            if (p.url.includes('?')) {
                return (currentPath + search) !== p.url;
            }
            return currentPath !== p.url;
        });

        // التأكد من وجود 12 صفحة موزعة على مدارين (6 في المدار الداخلي و 6 في المدار الخارجي)
        destinationPages = destinationPages.slice(0, 12);
        const innerPages = destinationPages.slice(0, 6);
        const outerPages = destinationPages.slice(6, 12);

        // إنشاء بنية القائمة الدائرية
        const container = document.createElement('aside');
        container.className = 'radial-nav-container';
        container.id = 'radial-nav-container';
        container.setAttribute('aria-label', 'قائمة التنقل الدائرية السريعة');

        // خلفية التظليل
        const backdrop = document.createElement('div');
        backdrop.className = 'radial-nav-backdrop';
        backdrop.id = 'radial-nav-backdrop';

        // زر المحور البارز على الجنب
        const hubBtn = document.createElement('button');
        hubBtn.type = 'button';
        hubBtn.className = 'radial-nav-hub';
        hubBtn.id = 'radial-nav-hub';
        hubBtn.setAttribute('aria-expanded', 'false');
        hubBtn.setAttribute('title', 'التنقل السريع بين جميع الصفحات');
        hubBtn.innerHTML = `
            <div class="radial-hub-ripple"></div>
            <i class="fa-solid fa-compass radial-hub-icon" aria-hidden="true"></i>
            <span class="radial-hub-text">تنقل</span>
        `;

        // طبق الأقواس والمسارات المدارية
        const plate = document.createElement('div');
        plate.className = 'radial-nav-plate';
        plate.id = 'radial-nav-plate';
        plate.innerHTML = `
            <div class="radial-orbit-arc arc-inner"></div>
            <div class="radial-orbit-arc arc-outer"></div>
            <div class="radial-items-wrap" id="radial-items-wrap"></div>
        `;

        container.appendChild(backdrop);
        container.appendChild(hubBtn);
        container.appendChild(plate);
        document.body.appendChild(container);

        const itemsWrap = plate.querySelector('#radial-items-wrap');

        // بناء عناصر المدارين وحساب الإحداثيات
        renderRadialItems(itemsWrap, innerPages, outerPages);

        // ربط أحداث الماوس واللمس
        setupEventHandlers(container, hubBtn, backdrop);

        // تحديث الإحداثيات عند تغيير حجم الشاشة (Resize)
        window.addEventListener('resize', debounce(() => {
            renderRadialItems(itemsWrap, innerPages, outerPages);
        }, 150));
    }

    // حساب الإحداثيات القطبية ورسم العناصر
    function renderRadialItems(wrap, innerPages, outerPages) {
        if (!wrap) return;
        wrap.innerHTML = '';

        const isMobile = window.innerWidth <= 768;
        const R1 = isMobile ? 98 : 132;
        const R2 = isMobile ? 168 : 228;

        const container = document.getElementById('radial-nav-container');
        if (container) {
            container.style.setProperty('--orbit-r1', `${R1}px`);
            container.style.setProperty('--orbit-r2', `${R2}px`);
        }

        // زوايا المدار الداخلي (6 عناصر من -65 إلى +65 درجة)
        const innerAngles = [-65, -39, -13, 13, 39, 65];

        // زوايا المدار الخارجي (6 عناصر من -72 إلى +72 درجة متداخلة بلباقة)
        const outerAngles = [-72, -43, -15, 15, 43, 72];

        let globalIndex = 0;

        // 1. رسم عناصر المدار الداخلي
        innerPages.forEach((page, i) => {
            const angle = innerAngles[i] || 0;
            const rad = (angle * Math.PI) / 180;
            const tx = -Math.round(R1 * Math.cos(rad));
            const ty = Math.round(R1 * Math.sin(rad));
            const delay = (globalIndex * 0.032).toFixed(3);

            const itemEl = createItemElement(page, tx, ty, delay, 1);
            wrap.appendChild(itemEl);
            globalIndex++;
        });

        // 2. رسم عناصر المدار الخارجي
        outerPages.forEach((page, i) => {
            const angle = outerAngles[i] || 0;
            const rad = (angle * Math.PI) / 180;
            const tx = -Math.round(R2 * Math.cos(rad));
            const ty = Math.round(R2 * Math.sin(rad));
            const delay = (globalIndex * 0.032).toFixed(3);

            const itemEl = createItemElement(page, tx, ty, delay, 2);
            wrap.appendChild(itemEl);
            globalIndex++;
        });
    }

    function createItemElement(page, tx, ty, delay, orbitNumber) {
        const a = document.createElement('a');
        a.href = page.url;
        a.className = `radial-item orbit-${orbitNumber}`;
        a.setAttribute('data-orbit', orbitNumber);
        a.setAttribute('title', `الانتقال إلى ${page.title}`);
        a.style.setProperty('--tx', `${tx}px`);
        a.style.setProperty('--ty', `${ty}px`);
        a.style.setProperty('--delay', `${delay}s`);

        a.innerHTML = `
            <div class="radial-item-circle">
                <i class="${page.icon}" aria-hidden="true"></i>
            </div>
            <span class="radial-item-label">${page.title}</span>
        `;

        a.addEventListener('click', () => {
            triggerHaptic();
            closeRadialNav(true);
        });

        return a;
    }

    // إدارة التفاعل (Hover للكمبيوتر + Tap للموبايل والتثبيت)
    function setupEventHandlers(container, hubBtn, backdrop) {
        // سلوك الـ Hover على الكمبيوتر
        hubBtn.addEventListener('mouseenter', () => {
            openRadialNav();
        });

        hubBtn.addEventListener('mouseleave', () => {
            scheduleClose();
        });

        container.addEventListener('mouseenter', () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
        });

        container.addEventListener('mouseleave', () => {
            scheduleClose();
        });

        // سلوك النقر / اللمس (Toggle و تثبيت للموبايل والكمبيوتر)
        hubBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerHaptic();
            if (container.classList.contains('is-open')) {
                if (isPinned) {
                    closeRadialNav(true);
                } else {
                    isPinned = true;
                }
            } else {
                openRadialNav(true);
            }
        });

        // النقر على خلفية التظليل يغلق القائمة فوراً
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                e.stopPropagation();
                closeRadialNav(true);
            });
        }

        // زر Escape يغلق القائمة
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && container.classList.contains('is-open')) {
                closeRadialNav(true);
            }
        });
    }

    function openRadialNav(pinned = false) {
        const container = document.getElementById('radial-nav-container');
        const hubBtn = document.getElementById('radial-nav-hub');
        if (!container || !hubBtn) return;

        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }

        if (pinned) isPinned = true;

        container.classList.add('is-open');
        hubBtn.setAttribute('aria-expanded', 'true');
    }

    function closeRadialNav(force = false) {
        const container = document.getElementById('radial-nav-container');
        const hubBtn = document.getElementById('radial-nav-hub');
        if (!container || !hubBtn) return;

        if (isPinned && !force) return;

        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }

        isPinned = false;
        container.classList.remove('is-open');
        hubBtn.setAttribute('aria-expanded', 'false');
    }

    function scheduleClose() {
        if (isPinned) return;
        if (closeTimeout) clearTimeout(closeTimeout);
        closeTimeout = setTimeout(() => {
            closeRadialNav(true);
        }, 360);
    }

    function triggerHaptic() {
        try {
            if (navigator.vibrate) navigator.vibrate(22);
        } catch (e) {}
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
})();
