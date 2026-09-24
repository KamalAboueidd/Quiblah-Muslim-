/**
 * features/radial-nav/radial-nav.js
 * قائمة التنقل الدائرية القوسية السريعة (Radial Arc Quick-Nav)
 * تطبيق قبلة المسلم - طور بواسطة كمال أبو عيد
 */

(function () {
    'use strict';

    // 1. القائمة الأساسية الأكثر استخداماً (Primary Worship & Quran)
    const PRIMARY_PAGES = [
        { id: 'home', title: 'المواقيت', url: 'home.html', icon: 'fa-solid fa-clock' },
        { id: 'tracker', title: 'متابعة العبادات', url: 'tracker.html', icon: 'fa-solid fa-calendar-check' },
        { id: 'khatmah', title: 'خطة الختمة', url: 'khatmah.html', icon: 'fa-solid fa-book-bookmark' },
        { id: 'quran', title: 'المصحف الشريف', url: 'quran.html', icon: 'fa-solid fa-book-quran' },
        { id: 'azkar', title: 'الأذكار اليومية', url: 'azkar.html', icon: 'fa-solid fa-hands-praying' },
        { id: 'azkar_sm', title: 'الصباح والمساء', url: 'azkar.html?m=sm', icon: 'fa-solid fa-sun' },
        { id: 'qibla', title: 'اتجاه القبلة', url: 'qibla.html', icon: 'fa-solid fa-compass' },
        { id: 'tafseer', title: 'التفسير الميسر', url: 'tafseer.html', icon: 'fa-solid fa-book-open-reader' },
        { id: 'hadith', title: 'الأحاديث النبوية', url: 'hadith.html', icon: 'fa-solid fa-book-bookmark' },
        { id: 'listen', title: 'الاستماع والتلاوات', url: 'listen.html', icon: 'fa-solid fa-headphones' }
    ];

    // 2. قائمة الخدمات والمعارف الإضافية (Secondary Services)
    const SECONDARY_PAGES = [
        { id: 'names', title: 'أسماء الله الحسنى', url: 'names.html', icon: 'fa-solid fa-list-ol' },
        { id: 'mosques', title: 'أقرب مسجد', url: 'mosques.html', icon: 'fa-solid fa-mosque' },
        { id: 'quiz', title: 'اختبر نفسك', url: 'quiz.html', icon: 'fa-solid fa-award' },
        { id: 'bot', title: 'المساعد الذكي', url: 'bot.html', icon: 'fa-solid fa-robot' },
        { id: 'recite', title: 'المصحح القرآني', url: 'recite.html', icon: 'fa-solid fa-microphone-lines' },
        { id: 'reminders', title: 'التذكيرات', url: 'reminders.html', icon: 'fa-solid fa-bell' }
    ];

    let showSecondary = false;
    let closeTimeout = null;
    let isPinned = false;

    // تهيئة القائمة عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRadialNav);
    } else {
        initRadialNav();
    }

    function initRadialNav() {
        if (document.getElementById('radial-nav-container')) return;

        // تصفية الصفحة الحالية
        const currentPath = window.location.pathname.split('/').pop() || 'home.html';
        const search = window.location.search || '';

        const filterCurrent = (list) => {
            return list.filter(p => {
                if (p.url.includes('?')) {
                    return (currentPath + search) !== p.url;
                }
                return currentPath !== p.url;
            });
        };

        const primaryFiltered = filterCurrent(PRIMARY_PAGES).slice(0, 7);
        const secondaryFiltered = filterCurrent(SECONDARY_PAGES).slice(0, 6);

        // إنشاء الحاوية الرئيسية (بدون أي transform لكامل الشاشة)
        const container = document.createElement('aside');
        container.className = 'radial-nav-container';
        container.id = 'radial-nav-container';
        container.setAttribute('aria-label', 'قائمة التنقل السريع');

        // خلفية الضباب والتعتيم الكلي للشاشة كاملة
        const backdrop = document.createElement('div');
        backdrop.className = 'radial-nav-backdrop';
        backdrop.id = 'radial-nav-backdrop';

        // زر المحور الجانبي (Side Jewel - بدون كلمة تنقل)
        const hubBtn = document.createElement('button');
        hubBtn.type = 'button';
        hubBtn.className = 'radial-nav-hub';
        hubBtn.id = 'radial-nav-hub';
        hubBtn.setAttribute('aria-expanded', 'false');
        hubBtn.setAttribute('title', 'التنقل السريع بين الصفحات');
        hubBtn.innerHTML = `
            <div class="radial-hub-ripple"></div>
            <i class="fa-solid fa-compass radial-hub-icon" aria-hidden="true"></i>
        `;

        // درع الحماية القوسي
        const plate = document.createElement('div');
        plate.className = 'radial-nav-plate';
        plate.id = 'radial-nav-plate';
        plate.innerHTML = `
            <div class="radial-orbit-arc-line"></div>
            <div class="radial-items-wrap" id="radial-items-wrap"></div>
        `;

        container.appendChild(backdrop);
        container.appendChild(hubBtn);
        container.appendChild(plate);
        document.body.appendChild(container);

        const itemsWrap = plate.querySelector('#radial-items-wrap');

        // رسم كبسولات القوس
        const renderCurrentView = () => {
            const currentList = showSecondary ? secondaryFiltered : primaryFiltered;
            renderPillArc(itemsWrap, currentList, showSecondary, () => {
                showSecondary = !showSecondary;
                renderCurrentView();
            });
        };

        renderCurrentView();

        // ربط التفاعلات
        setupEventHandlers(container, hubBtn, backdrop);

        window.addEventListener('resize', debounce(() => {
            renderCurrentView();
        }, 150));
    }

    // حساب الإحداثيات ورسم الكبسولات في مسار قوسي متناسق
    function renderPillArc(wrap, pages, isSecondaryMode, onToggleMode) {
        if (!wrap) return;
        wrap.innerHTML = '';

        const width = window.innerWidth;
        const isSmallMobile = width <= 480;
        const isMobile = width <= 768;

        // إجمالي العناصر = الصفحات + زر التبديل
        const totalItems = pages.length + 1;
        const midIndex = (totalItems - 1) / 2;

        // تباعد رأسي واسع ومريح يمنع التصاق القوائم ببعضها نهائياً
        const itemSpacing = isSmallMobile ? 42 : (isMobile ? 44 : 50);

        // المسافة الأفقية من الشريط الجانبي (قريبة بدون الفراغ القديم)
        const baseDist = isSmallMobile ? 36 : (isMobile ? 40 : 50);
        const arcBulge = isSmallMobile ? 22 : (isMobile ? 28 : 38);

        function calcPos(i) {
            const u = midIndex === 0 ? 0 : (i - midIndex) / midIndex;
            const ty = Math.round((i - midIndex) * itemSpacing);
            const curve = Math.cos(u * (Math.PI / 2.3));
            const tx = -Math.round(baseDist + (arcBulge * curve));
            return { tx, ty };
        }

        pages.forEach((page, i) => {
            const { tx, ty } = calcPos(i);
            const delay = (i * 0.032).toFixed(3);

            const a = document.createElement('a');
            a.href = page.url;
            a.className = 'radial-item-pill';
            a.setAttribute('title', `الانتقال إلى ${page.title}`);
            a.style.setProperty('--tx', `${tx}px`);
            a.style.setProperty('--ty', `${ty}px`);
            a.style.setProperty('--delay', `${delay}s`);

            a.innerHTML = `
                <div class="radial-pill-icon">
                    <i class="${page.icon}" aria-hidden="true"></i>
                </div>
                <span class="radial-pill-name">${page.title}</span>
            `;

            a.addEventListener('click', () => {
                triggerHaptic();
                closeRadialNav(true);
            });

            wrap.appendChild(a);
        });

        // زر التبديل بين القائمة الأساسية وباقي الخدمات في آخر القوس
        const toggleIdx = pages.length;
        const { tx: ttx, ty: tty } = calcPos(toggleIdx);
        const tDelay = (pages.length * 0.032).toFixed(3);

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'radial-item-pill pill-toggle-more';
        toggleBtn.style.setProperty('--tx', `${ttx}px`);
        toggleBtn.style.setProperty('--ty', `${tty}px`);
        toggleBtn.style.setProperty('--delay', `${tDelay}s`);

        if (isSecondaryMode) {
            toggleBtn.innerHTML = `
                <div class="radial-pill-icon"><i class="fa-solid fa-arrow-rotate-left"></i></div>
                <span class="radial-pill-name">العبادات الأساسية</span>
            `;
        } else {
            toggleBtn.innerHTML = `
                <div class="radial-pill-icon"><i class="fa-solid fa-ellipsis"></i></div>
                <span class="radial-pill-name">باقي الأقسام</span>
            `;
        }

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerHaptic();
            if (onToggleMode) onToggleMode();
        });

        wrap.appendChild(toggleBtn);
    }

    // إدارة أحداث التفاعل المستقرة تماماً
    function setupEventHandlers(container, hubBtn, backdrop) {
        // الفتح عند الـ Hover
        hubBtn.addEventListener('mouseenter', () => {
            openRadialNav();
        });

        // بقاء القائمة مفتوحة طالما الماوس داخل المنطقة
        container.addEventListener('mouseenter', () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
        });

        // الإغلاق بمهلة مستقرة عند خروج الماوس
        container.addEventListener('mouseleave', () => {
            scheduleClose();
        });

        // النقر للتبديل والتثبيت
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

        // النقر على الخلفية المظللة يغلق فوراً
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
        }, 450);
    }

    function triggerHaptic() {
        try {
            if (navigator.vibrate) navigator.vibrate(20);
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
