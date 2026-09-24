/**
 * features/khatmah/khatmah.js - منطق وعمليات خطة الختمة الذكية
 * تطبيق قبلة المسلم - طور بواسطة كمال أبو عيد
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'quiblah_smart_khatmah_v1';
    const TOTAL_PAGES = 604;
    const RING_RADIUS = 50;
    const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~314.16px

    // 1. أجزاء القرآن الكريم الـ 30 وحدود صفحاتها وأسماؤها المشهورة
    const JUZ_DATA = [
        { juz: 1, start: 1, end: 21, name: "الم" },
        { juz: 2, start: 22, end: 41, name: "سيقول" },
        { juz: 3, start: 42, end: 61, name: "تلك الرسل" },
        { juz: 4, start: 62, end: 81, name: "لن تنالوا" },
        { juz: 5, start: 82, end: 101, name: "والمحصنات" },
        { juz: 6, start: 102, end: 121, name: "لا يحب الله" },
        { juz: 7, start: 122, end: 141, name: "وإذا سمعوا" },
        { juz: 8, start: 142, end: 161, name: "ولو أننا" },
        { juz: 9, start: 162, end: 181, name: "قال الملأ" },
        { juz: 10, start: 182, end: 201, name: "واعلموا" },
        { juz: 11, start: 202, end: 221, name: "يعتذرون" },
        { juz: 12, start: 222, end: 241, name: "وما من دابة" },
        { juz: 13, start: 242, end: 261, name: "وما أبرئ" },
        { juz: 14, start: 262, end: 281, name: "الر" },
        { juz: 15, start: 282, end: 301, name: "سبحان الذي" },
        { juz: 16, start: 302, end: 321, name: "قال ألم" },
        { juz: 17, start: 322, end: 341, name: "اقترب للناس" },
        { juz: 18, start: 342, end: 361, name: "قد أفلح" },
        { juz: 19, start: 362, end: 381, name: "وقال الذين" },
        { juz: 20, start: 382, end: 401, name: "أمن خلق" },
        { juz: 21, start: 402, end: 421, name: "اتل ما أوحي" },
        { juz: 22, start: 422, end: 441, name: "ومن يقنت" },
        { juz: 23, start: 442, end: 461, name: "وما أنزلنا" },
        { juz: 24, start: 462, end: 481, name: "فمن أظلم" },
        { juz: 25, start: 482, end: 501, name: "إليه يرد" },
        { juz: 26, start: 502, end: 521, name: "حم" },
        { juz: 27, start: 522, end: 541, name: "قال فما خطبكم" },
        { juz: 28, start: 542, end: 561, name: "قد سمع الله" },
        { juz: 29, start: 562, end: 581, name: "تبارك الذي" },
        { juz: 30, start: 582, end: 604, name: "عمّ يتساءلون" }
    ];

    // 2. بدايات سور القرآن الكريم الـ 114 بالصفحات
    const SURAH_PAGES = [
        { num: 1, name: "الفاتحة", page: 1 },
        { num: 2, name: "البقرة", page: 2 },
        { num: 3, name: "آل عمران", page: 50 },
        { num: 4, name: "النساء", page: 77 },
        { num: 5, name: "المائدة", page: 106 },
        { num: 6, name: "الأنعام", page: 128 },
        { num: 7, name: "الأعراف", page: 151 },
        { num: 8, name: "الأنفال", page: 177 },
        { num: 9, name: "التوبة", page: 187 },
        { num: 10, name: "يونس", page: 208 },
        { num: 11, name: "هود", page: 221 },
        { num: 12, name: "يوسف", page: 235 },
        { num: 13, name: "الرعد", page: 249 },
        { num: 14, name: "إبراهيم", page: 255 },
        { num: 15, name: "الحجر", page: 262 },
        { num: 16, name: "النحل", page: 267 },
        { num: 17, name: "الإسراء", page: 282 },
        { num: 18, name: "الكهف", page: 293 },
        { num: 19, name: "مريم", page: 305 },
        { num: 20, name: "طه", page: 312 },
        { num: 21, name: "الأنبياء", page: 322 },
        { num: 22, name: "الحج", page: 332 },
        { num: 23, name: "المؤمنون", page: 342 },
        { num: 24, name: "النور", page: 350 },
        { num: 25, name: "الفرقان", page: 359 },
        { num: 26, name: "الشعراء", page: 367 },
        { num: 27, name: "النمل", page: 377 },
        { num: 28, name: "القصص", page: 385 },
        { num: 29, name: "العنكبوت", page: 396 },
        { num: 30, name: "الروم", page: 404 },
        { num: 31, name: "لقمان", page: 411 },
        { num: 32, name: "السجدة", page: 415 },
        { num: 33, name: "الأحزاب", page: 418 },
        { num: 34, name: "سبأ", page: 428 },
        { num: 35, name: "فاطر", page: 434 },
        { num: 36, name: "يس", page: 440 },
        { num: 37, name: "الصافات", page: 446 },
        { num: 38, name: "ص", page: 453 },
        { num: 39, name: "الزمر", page: 458 },
        { num: 40, name: "غافر", page: 467 },
        { num: 41, name: "فصلت", page: 477 },
        { num: 42, name: "الشورى", page: 483 },
        { num: 43, name: "الزخرف", page: 489 },
        { num: 44, name: "الدخان", page: 496 },
        { num: 45, name: "الجاثية", page: 499 },
        { num: 46, name: "الأحقاف", page: 502 },
        { num: 47, name: "محمد", page: 507 },
        { num: 48, name: "الفتح", page: 511 },
        { num: 49, name: "الحجرات", page: 515 },
        { num: 50, name: "ق", page: 518 },
        { num: 51, name: "الذاريات", page: 520 },
        { num: 52, name: "الطور", page: 523 },
        { num: 53, name: "النجم", page: 526 },
        { num: 54, name: "القمر", page: 528 },
        { num: 55, name: "الرحمن", page: 531 },
        { num: 56, name: "الواقعة", page: 534 },
        { num: 57, name: "الحديد", page: 537 },
        { num: 58, name: "المجادلة", page: 542 },
        { num: 59, name: "الحشر", page: 545 },
        { num: 60, name: "الممتحنة", page: 549 },
        { num: 61, name: "الصف", page: 551 },
        { num: 62, name: "الجمعة", page: 553 },
        { num: 63, name: "المنافقون", page: 554 },
        { num: 64, name: "التغابن", page: 556 },
        { num: 65, name: "الطلاق", page: 558 },
        { num: 66, name: "التحريم", page: 560 },
        { num: 67, name: "الملك", page: 562 },
        { num: 68, name: "القلم", page: 564 },
        { num: 69, name: "الحاقة", page: 566 },
        { num: 70, name: "المعارج", page: 568 },
        { num: 71, name: "نوح", page: 570 },
        { num: 72, name: "الجن", page: 572 },
        { num: 73, name: "المزمل", page: 574 },
        { num: 74, name: "المدثر", page: 575 },
        { num: 75, name: "القيامة", page: 577 },
        { num: 76, name: "الإنسان", page: 578 },
        { num: 77, name: "المرسلات", page: 580 },
        { num: 78, name: "النبأ", page: 582 },
        { num: 79, name: "النازعات", page: 583 },
        { num: 80, name: "عبس", page: 585 },
        { num: 81, name: "التكوير", page: 586 },
        { num: 82, name: "الانفطار", page: 587 },
        { num: 83, name: "المطففين", page: 587 },
        { num: 84, name: "الانشقاق", page: 589 },
        { num: 85, name: "البروج", page: 590 },
        { num: 86, name: "الطارق", page: 591 },
        { num: 87, name: "الأعلى", page: 591 },
        { num: 88, name: "الغاشية", page: 592 },
        { num: 89, name: "الفجر", page: 593 },
        { num: 90, name: "البلد", page: 594 },
        { num: 91, name: "الشمس", page: 595 },
        { num: 92, name: "الليل", page: 595 },
        { num: 93, name: "الضحى", page: 596 },
        { num: 94, name: "الشرح", page: 596 },
        { num: 95, name: "التين", page: 597 },
        { num: 96, name: "العلق", page: 597 },
        { num: 97, name: "القدر", page: 598 },
        { num: 98, name: "البينة", page: 598 },
        { num: 99, name: "الزلزلة", page: 599 },
        { num: 100, name: "العاديات", page: 599 },
        { num: 101, name: "القارعة", page: 600 },
        { num: 102, name: "التكاثر", page: 600 },
        { num: 103, name: "العصر", page: 601 },
        { num: 104, name: "الهمزة", page: 601 },
        { num: 105, name: "الفيل", page: 601 },
        { num: 106, name: "قريش", page: 602 },
        { num: 107, name: "الماعون", page: 602 },
        { num: 108, name: "الكوثر", page: 602 },
        { num: 109, name: "الكافرون", page: 603 },
        { num: 110, name: "النصر", page: 603 },
        { num: 111, name: "المسد", page: 603 },
        { num: 112, name: "الإخلاص", page: 604 },
        { num: 113, name: "الفلق", page: 604 },
        { num: 114, name: "الناس", page: 604 }
    ];

    // الصلوات الخمس لتقسيم الورد
    const PRAYERS_LIST = [
        { key: 'fajr', name: 'الفجر', icon: 'fa-regular fa-sun' },
        { key: 'dhuhr', name: 'الظهر', icon: 'fa-solid fa-sun' },
        { key: 'asr', name: 'العصر', icon: 'fa-solid fa-cloud-sun' },
        { key: 'maghrib', name: 'المغرب', icon: 'fa-solid fa-cloud-moon' },
        { key: 'isha', name: 'العشاء', icon: 'fa-solid fa-moon' }
    ];

    // الحالة الحالية للتطبيق
    let khatmahData = loadKhatmahData();
    let currentDuaaFontSize = 18;
    let currentJuzFilter = 'all';
    let isJuzExpanded = false;

    // استخراج السورة الأنسب لرقم الصفحة
    function getSurahForPage(pageNum) {
        let best = SURAH_PAGES[0];
        for (let i = 0; i < SURAH_PAGES.length; i++) {
            if (SURAH_PAGES[i].page <= pageNum) {
                best = SURAH_PAGES[i];
            } else {
                break;
            }
        }
        return best;
    }

    // استخراج الجزء الأنسب لرقم الصفحة
    function getJuzForPage(pageNum) {
        for (let i = 0; i < JUZ_DATA.length; i++) {
            if (pageNum >= JUZ_DATA[i].start && pageNum <= JUZ_DATA[i].end) {
                return JUZ_DATA[i];
            }
        }
        return JUZ_DATA[0];
    }

    // مفتاح تاريخ اليوم YYYY-MM-DD
    function getTodayKey() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    // تحميل البيانات من LocalStorage
    function loadKhatmahData() {
        const defaultState = {
            planDays: 30, // 30 يوماً افتراضياً (ختمة شهرية)
            startDate: getTodayKey(),
            currentPage: 0,
            streak: 0,
            lastStreakDate: '',
            todayDate: getTodayKey(),
            todaySlots: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
            completedKhatmahs: []
        };

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultState;
            const parsed = JSON.parse(raw);
            const state = Object.assign({}, defaultState, parsed);

            // تحقق من تجديد اليوم
            const today = getTodayKey();
            if (state.todayDate !== today) {
                state.todayDate = today;
                state.todaySlots = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
                saveKhatmahData(state);
            }
            return state;
        } catch (e) {
            return defaultState;
        }
    }

    // حفظ البيانات
    function saveKhatmahData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn("Storage save warning:", e);
        }
    }

    // إشعار لمسي للموبايل
    function triggerHaptic() {
        try {
            if (navigator && typeof navigator.vibrate === 'function') {
                navigator.vibrate(15);
            }
        } catch (e) {}
    }

    // حساب وتيرة القراءة (Pace)
    function calculatePace() {
        const start = new Date(khatmahData.startDate || getTodayKey()).getTime();
        const now = new Date(getTodayKey()).getTime();
        const diffDays = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
        const totalDays = khatmahData.planDays || 30;
        const pagesPerDay = Math.ceil(TOTAL_PAGES / totalDays);
        const expectedPage = Math.min(TOTAL_PAGES, (diffDays + 1) * pagesPerDay);
        const current = khatmahData.currentPage || 0;
        const delta = current - expectedPage;

        const remainingPages = Math.max(0, TOTAL_PAGES - current);
        const daysLeft = Math.max(0, totalDays - diffDays);

        return {
            diffDays,
            totalDays,
            daysLeft,
            pagesPerDay,
            expectedPage,
            delta,
            remainingPages
        };
    }

    // تحديث الواجهة الرئيسية بالكامل
    function renderKhatmahUI() {
        const current = Math.min(TOTAL_PAGES, Math.max(0, khatmahData.currentPage || 0));
        const percent = Math.min(100, Math.round((current / TOTAL_PAGES) * 100));
        const pace = calculatePace();

        // 1. Astrolabe Progress Dial
        const ringFill = document.getElementById('progress-ring-fill');
        const percentText = document.getElementById('progress-percent');
        const fractionText = document.getElementById('progress-fraction');

        if (ringFill) {
            const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;
            ringFill.style.strokeDashoffset = offset;
        }
        if (percentText) percentText.textContent = `${percent}%`;
        if (fractionText) fractionText.textContent = `${current} من ${TOTAL_PAGES} ص`;

        // 2. Preset Chips Active State
        document.querySelectorAll('.hero-chip-btn').forEach(chip => {
            const plan = parseInt(chip.getAttribute('data-plan'));
            if (plan === khatmahData.planDays) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });

        // 3. Dynamic Pace Ribbon & Encouragement
        const heroPaceBadge = document.getElementById('hero-pace-badge');
        const heroQuoteText = document.getElementById('hero-quote-text');
        const heroSubquoteText = document.getElementById('hero-subquote-text');
        const streakCountText = document.getElementById('streak-count-text');
        const daysLeftText = document.getElementById('days-left-text');
        const currentJuzBadgeText = document.getElementById('current-juz-badge-text');
        const dailyRateBadgeText = document.getElementById('daily-rate-badge-text');

        const currentJuz = getJuzForPage(Math.max(1, current));

        if (heroPaceBadge && heroQuoteText && heroSubquoteText) {
            heroPaceBadge.className = 'hero-pace-pill';
            if (current >= TOTAL_PAGES) {
                heroPaceBadge.classList.add('pace-ahead');
                heroPaceBadge.innerHTML = `<i class="fa-solid fa-crown"></i> متقدم ومكتمل!`;
                heroQuoteText.textContent = 'مبارك! أتممت ختم كتاب الله تعالى كاملاً';
                heroSubquoteText.textContent = 'تقبل الله منك وجعله شفيعاً لك يوم القيامة ورفعة في الدرجات.';
            } else if (pace.delta > 2) {
                heroPaceBadge.classList.add('pace-ahead');
                heroPaceBadge.innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> متقدم بـ ${pace.delta} صفحة`;
                heroQuoteText.textContent = 'ما شاء الله! وتيرة متقدمة تسبق خطتك';
                heroSubquoteText.textContent = `أنت متقدم على جدولك، استمر بهذا الإقبال والهمة العالية.`;
            } else if (pace.delta < -2) {
                heroPaceBadge.classList.add('pace-behind');
                heroPaceBadge.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> متأخر بـ ${Math.abs(pace.delta)} صفحة`;
                heroQuoteText.textContent = 'خطوات يسيرة وتستعيد وتيرة خطتك';
                heroSubquoteText.textContent = `لا بأس، قراءة صفحتين إضافيتين بعد كل صلاة اليوم تعيدك للقمة فوراً!`;
            } else {
                heroPaceBadge.classList.add('pace-ontrack');
                heroPaceBadge.innerHTML = `<i class="fa-solid fa-check-double"></i> ملتزم بالخطة تماماً`;
                heroQuoteText.textContent = 'تلاوة مباركة وثبات يومي على الورد';
                heroSubquoteText.textContent = `استمرارك اليومي خير من كثير ينقطع، بوركت همتك وحفظك الله.`;
            }
        }

        if (streakCountText) streakCountText.textContent = `${khatmahData.streak || 0} يوم`;
        if (daysLeftText) daysLeftText.textContent = `${pace.daysLeft} يوماً`;
        if (currentJuzBadgeText) currentJuzBadgeText.textContent = `الجزء ${currentJuz.juz} (${currentJuz.name})`;
        if (dailyRateBadgeText) dailyRateBadgeText.textContent = `${pace.pagesPerDay} ص / يوم`;

        // 4. Bookmark & Page Logger
        const currentHeroPageNum = document.getElementById('current-page-num-hero');
        const currentSurahInfo = document.getElementById('current-page-surah-info');
        const currentJuzInfo = document.getElementById('current-page-juz-info');
        const pageSlider = document.getElementById('page-range-slider');
        const pageNumInput = document.getElementById('page-num-input');

        const activeSurah = getSurahForPage(Math.max(1, current));
        if (currentHeroPageNum) currentHeroPageNum.textContent = current;
        if (currentSurahInfo) currentSurahInfo.textContent = `سورة ${activeSurah.name}`;
        if (currentJuzInfo) currentJuzInfo.textContent = `الجزء ${currentJuz.juz} (${currentJuz.name})`;
        if (pageSlider) pageSlider.value = current;
        if (pageNumInput) pageNumInput.value = current;

        // 5. Render Today's Prayer Wird
        renderTodayPrayerSlots(pace);

        // 6. Render Juz' Roadmap (30 Juz)
        renderJuzRoadmap(current);

        // 7. Render Completed Khatmahs History
        renderKhatmahHistory();
    }

    // تقسيم ورد اليوم على الصلوات
    function renderTodayPrayerSlots(pace) {
        const slotsContainer = document.getElementById('prayer-slots-grid');
        const wirdPagesRange = document.getElementById('today-wird-pages-range');
        const allDoneBanner = document.getElementById('today-all-done-banner');
        const progressBarFill = document.getElementById('today-progress-bar-fill');
        if (!slotsContainer) return;

        const current = khatmahData.currentPage || 0;
        const pagesPerDay = pace.pagesPerDay || 20;

        const startPageToday = Math.min(TOTAL_PAGES, current + 1);
        const endPageToday = Math.min(TOTAL_PAGES, current + pagesPerDay);

        if (wirdPagesRange) {
            if (current >= TOTAL_PAGES) {
                wirdPagesRange.textContent = 'تم إتمام الختمة كاملة بحمد الله!';
            } else {
                wirdPagesRange.textContent = `من ص ${startPageToday} إلى ص ${endPageToday} (${pagesPerDay} صفحة)`;
            }
        }

        const perPrayer = Math.max(1, Math.floor(pagesPerDay / 5));
        const remainder = pagesPerDay % 5;

        slotsContainer.innerHTML = '';
        let currentSlotStart = startPageToday;
        let completedCount = 0;

        PRAYERS_LIST.forEach((prayer, idx) => {
            const extra = idx < remainder ? 1 : 0;
            const slotCount = perPrayer + extra;
            const slotEnd = Math.min(TOTAL_PAGES, currentSlotStart + slotCount - 1);
            const isCompleted = Boolean(khatmahData.todaySlots && khatmahData.todaySlots[prayer.key]);

            if (isCompleted) completedCount++;

            const startSurah = getSurahForPage(currentSlotStart);
            const tile = document.createElement('div');
            tile.className = `prayer-stop-tile ${isCompleted ? 'completed' : ''}`;
            tile.id = `prayer-slot-${prayer.key}`;

            tile.innerHTML = `
                <div class="stop-top-line">
                    <div class="stop-prayer-title">
                        <i class="${prayer.icon}"></i>
                        <span>بعد ${prayer.name}</span>
                    </div>
                    <button type="button" class="stop-toggle-btn" aria-label="تحديد صلاة ${prayer.name}" data-key="${prayer.key}">
                        <i class="fa-solid fa-check"></i>
                    </button>
                </div>
                <div class="stop-meta-line">
                    <span class="stop-pages-tag">ص ${currentSlotStart} - ${slotEnd} (${slotCount} صفحات)</span>
                    <span class="stop-surah-tag">سورة ${startSurah.name}</span>
                </div>
                <div class="stop-actions-line">
                    <a href="quran.html?surah=${startSurah.num}" class="stop-read-action" title="فتح سورة ${startSurah.name} في المصحف">
                        <i class="fa-solid fa-book-open"></i>
                        <span>تلاوة</span>
                    </a>
                    <span class="stop-state-label">${isCompleted ? 'تم الإنجاز' : 'في الانتظار'}</span>
                </div>
            `;

            // حدث النقر على التبديل
            const checkBtn = tile.querySelector('.stop-toggle-btn');
            if (checkBtn) {
                checkBtn.addEventListener('click', () => {
                    togglePrayerSlot(prayer.key, slotCount);
                });
            }

            slotsContainer.appendChild(tile);
            currentSlotStart = slotEnd + 1;
        });

        // شريط تقدم ورد اليوم
        if (progressBarFill) {
            const pct = Math.round((completedCount / 5) * 100);
            progressBarFill.style.width = `${pct}%`;
        }

        if (allDoneBanner) {
            allDoneBanner.style.display = (completedCount === 5) ? 'flex' : 'none';
        }
    }

    // تبديل إنجاز جزء الصلاة
    function togglePrayerSlot(prayerKey, slotPagesCount) {
        triggerHaptic();
        if (!khatmahData.todaySlots) khatmahData.todaySlots = {};

        const wasCompleted = Boolean(khatmahData.todaySlots[prayerKey]);
        khatmahData.todaySlots[prayerKey] = !wasCompleted;

        if (!wasCompleted) {
            khatmahData.currentPage = Math.min(TOTAL_PAGES, (khatmahData.currentPage || 0) + slotPagesCount);
            showToast(`أحسنت! أتممت قراءة ورد ${getPrayerName(prayerKey)} (${slotPagesCount} صفحات)`, 'fa-solid fa-check');
            checkStreakUpdate();
        } else {
            khatmahData.currentPage = Math.max(0, (khatmahData.currentPage || 0) - slotPagesCount);
        }

        checkKhatmahCompletion();
        saveKhatmahData(khatmahData);
        renderKhatmahUI();
    }

    function getPrayerName(key) {
        const found = PRAYERS_LIST.find(p => p.key === key);
        return found ? found.name : key;
    }

    // تحديث سلسلة الالتزام (Streak)
    function checkStreakUpdate() {
        const today = getTodayKey();
        if (khatmahData.lastStreakDate !== today) {
            khatmahData.streak = (khatmahData.streak || 0) + 1;
            khatmahData.lastStreakDate = today;
        }
    }

    // فحص إتمام الختمة
    function checkKhatmahCompletion() {
        if (khatmahData.currentPage >= TOTAL_PAGES) {
            khatmahData.currentPage = TOTAL_PAGES;
            const completionEntry = {
                id: Date.now(),
                date: getTodayKey(),
                planDays: khatmahData.planDays
            };
            if (!khatmahData.completedKhatmahs) khatmahData.completedKhatmahs = [];
            
            const alreadyLogged = khatmahData.completedKhatmahs.some(k => k.date === getTodayKey());
            if (!alreadyLogged) {
                khatmahData.completedKhatmahs.unshift(completionEntry);
            }

            openDuaaModal();
            showToast("هنيئاً لك! أتممت ختم القرآن الكريم كاملاً مباركاً", "fa-solid fa-crown");
        }
    }

    // رسم خارطة الأجزاء الـ 30 مع دعم الفلترة والطي والتوسيع
    function renderJuzRoadmap(currentPage) {
        const grid = document.getElementById('juz-roadmap-grid');
        if (!grid) return;
        grid.innerHTML = '';

        // تصفية الأجزاء حسب الفلتر النشط
        const filteredList = JUZ_DATA.filter(juz => {
            const isCompleted = currentPage >= juz.end;
            if (currentJuzFilter === 'completed' && !isCompleted) return false;
            if (currentJuzFilter === 'remaining' && isCompleted) return false;
            return true;
        });

        // إذا كانت القائمة مطوية، يتم عرض أول 3 أجزاء فقط
        const PREVIEW_LIMIT = 3;
        const shouldLimit = !isJuzExpanded && filteredList.length > PREVIEW_LIMIT;
        const displayList = shouldLimit ? filteredList.slice(0, PREVIEW_LIMIT) : filteredList;

        displayList.forEach(juz => {
            const isCompleted = currentPage >= juz.end;
            const isInProgress = currentPage >= juz.start && currentPage < juz.end;

            let percentInJuz = 0;
            const juzTotalPages = (juz.end - juz.start + 1);

            if (isCompleted) {
                percentInJuz = 100;
            } else if (isInProgress) {
                const readInJuz = (currentPage - juz.start + 1);
                percentInJuz = Math.round((readInJuz / juzTotalPages) * 100);
            }

            const tile = document.createElement('div');
            tile.className = `juz-tile ${isCompleted ? 'completed' : ''} ${isInProgress ? 'in-progress' : ''}`;
            tile.title = `الجزء ${juz.juz} (${juz.name}): من ص ${juz.start} إلى ص ${juz.end} - انقر للقراءة الفورية`;

            tile.innerHTML = `
                <div class="juz-tile-header">
                    <span class="juz-tile-title">الجزء ${juz.juz}</span>
                    <i class="${isCompleted ? 'fa-solid fa-circle-check' : (isInProgress ? 'fa-solid fa-circle-notch fa-spin' : 'fa-regular fa-circle')}" style="color: ${isCompleted ? 'var(--success)' : (isInProgress ? 'var(--gold)' : 'var(--text-dim)')}; font-size: 13px;"></i>
                </div>
                <div class="juz-tile-name">${juz.name}</div>
                <span class="juz-tile-pages">ص ${juz.start} - ${juz.end}</span>
                <div class="juz-progress-line">
                    <div class="juz-progress-line-fill" style="width: ${percentInJuz}%;"></div>
                </div>
            `;

            // عند النقر يفتح المصحف على بداية هذا الجزء
            tile.addEventListener('click', () => {
                const surah = getSurahForPage(juz.start);
                window.location.href = `quran.html?surah=${surah.num}`;
            });

            grid.appendChild(tile);
        });

        // زر توسيع أو طي القائمة عند وجود أكثر من 3 أجزاء
        if (filteredList.length > PREVIEW_LIMIT) {
            const expandWrap = document.createElement('div');
            expandWrap.className = 'juz-expand-wrapper';
            expandWrap.style.gridColumn = '1 / -1';

            const expandBtn = document.createElement('button');
            expandBtn.type = 'button';
            expandBtn.className = 'btn-toggle-juz-expand';
            expandBtn.id = 'btn-toggle-juz-expand';

            if (!isJuzExpanded) {
                expandBtn.innerHTML = `<i class="fa-solid fa-chevron-down"></i> <span>عرض بقية الأجزاء (${filteredList.length - PREVIEW_LIMIT} أجزاء إضافية)</span>`;
            } else {
                expandBtn.innerHTML = `<i class="fa-solid fa-chevron-up"></i> <span>طي القائمة وعرض الأجزاء الأولى</span>`;
            }

            expandBtn.addEventListener('click', () => {
                isJuzExpanded = !isJuzExpanded;
                triggerHaptic();
                renderJuzRoadmap(khatmahData.currentPage || 0);
            });

            expandWrap.appendChild(expandBtn);
            grid.appendChild(expandWrap);
        }
    }

    // رسم سجل الختمات السابقة
    function renderKhatmahHistory() {
        const list = document.getElementById('khatmah-history-list');
        if (!list) return;

        const history = khatmahData.completedKhatmahs || [];
        if (!history.length) {
            list.innerHTML = `
                <div class="empty-history-clean">
                    <i class="fa-solid fa-book-quran" style="font-size: 24px; color: var(--gold); margin-bottom: 8px; display: block;"></i>
                    <span>لم يتم تسجيل ختمات سابقة بعد.. عند إتمام صفحة 604 ستُضاف ختمتك تلقائياً هنا لتكون ذكرى طيبة مباركة!</span>
                </div>
            `;
            return;
        }

        list.innerHTML = '';
        history.forEach((k, idx) => {
            const item = document.createElement('div');
            item.className = 'history-item-tile';
            item.innerHTML = `
                <div class="history-left-info">
                    <i class="fa-solid fa-award"></i>
                    <div>
                        <strong style="font-size: 14px; color: #fff; display: block;">الختمة رقم ${history.length - idx}</strong>
                        <span style="font-size: 12px; color: var(--text-dim);">خطة الـ ${k.planDays} يوماً</span>
                    </div>
                </div>
                <span style="font-size: 12px; color: var(--gold-light); font-weight: 700;"><i class="fa-regular fa-calendar" style="margin-left: 6px;"></i>${k.date}</span>
            `;
            list.appendChild(item);
        });
    }

    // تحديث الصفحة يدوياً
    function setCurrentPageManual(newPage) {
        const val = Math.min(TOTAL_PAGES, Math.max(0, parseInt(newPage) || 0));
        khatmahData.currentPage = val;
        triggerHaptic();
        checkKhatmahCompletion();
        saveKhatmahData(khatmahData);
        renderKhatmahUI();
    }

    // إعداد مستمعي الأحداث
    function setupEventListeners() {
        // رقائق التبديل السريع في الهيرو (Hero Preset Chips)
        document.querySelectorAll('.hero-chip-btn').forEach(chip => {
            chip.addEventListener('click', () => {
                const plan = parseInt(chip.getAttribute('data-plan'));
                if (plan) {
                    khatmahData.planDays = plan;
                    khatmahData.startDate = getTodayKey();
                    saveKhatmahData(khatmahData);
                    triggerHaptic();
                    renderKhatmahUI();
                    showToast(`تم تعيين خطة الختمة: ${plan} يوماً! سددك الله`, 'fa-solid fa-check');
                }
            });
        });

        // فلترة خارطة الأجزاء
        document.querySelectorAll('.juz-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.juz-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentJuzFilter = btn.getAttribute('data-filter') || 'all';
                renderJuzRoadmap(khatmahData.currentPage || 0);
            });
        });

        // أزرار الحصى للتنقل السريع (Pebble Stepper Buttons)
        document.querySelectorAll('.pebble-btn[data-delta]').forEach(btn => {
            btn.addEventListener('click', () => {
                const delta = parseInt(btn.getAttribute('data-delta')) || 0;
                setCurrentPageManual((khatmahData.currentPage || 0) + delta);
            });
        });

        // شريط التمرير للصفحات (Slider)
        const slider = document.getElementById('page-range-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value) || 0;
                const heroNum = document.getElementById('current-page-num-hero');
                const numInput = document.getElementById('page-num-input');
                if (heroNum) heroNum.textContent = val;
                if (numInput) numInput.value = val;
            });
            slider.addEventListener('change', (e) => {
                setCurrentPageManual(e.target.value);
            });
        }

        // إدخال رقم الصفحة المباشر
        const btnJumpPage = document.getElementById('btn-jump-page');
        const pageNumInput = document.getElementById('page-num-input');
        if (btnJumpPage && pageNumInput) {
            btnJumpPage.addEventListener('click', () => {
                setCurrentPageManual(pageNumInput.value);
                showToast(`تم تحديث موضعك في المصحف: صفحة ${pageNumInput.value}`, 'fa-solid fa-bookmark');
            });
            pageNumInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    setCurrentPageManual(pageNumInput.value);
                    showToast(`تم تحديث موضعك في المصحف: صفحة ${pageNumInput.value}`, 'fa-solid fa-bookmark');
                }
            });
        }

        // مودال إعدادات الخطة
        const btnOpenPlanSettings = document.getElementById('btn-open-plan-settings');
        const planSettingsModal = document.getElementById('plan-settings-modal');
        const btnClosePlanSettings = document.getElementById('btn-close-plan-settings');
        const btnCancelPlan = document.getElementById('btn-cancel-plan');
        const btnSavePlan = document.getElementById('btn-save-plan');

        if (btnOpenPlanSettings && planSettingsModal) {
            btnOpenPlanSettings.addEventListener('click', () => {
                openPlanSettingsModal();
            });
        }

        const closePlanModal = () => {
            if (planSettingsModal) planSettingsModal.classList.remove('active');
        };

        if (btnClosePlanSettings) btnClosePlanSettings.addEventListener('click', closePlanModal);
        if (btnCancelPlan) btnCancelPlan.addEventListener('click', closePlanModal);
        if (planSettingsModal) {
            planSettingsModal.addEventListener('click', (e) => {
                if (e.target === planSettingsModal) closePlanModal();
            });
        }

        // بطاقات الخيارات الجاهزة في المودال (Preset Choice Cards)
        document.querySelectorAll('.preset-card-choice').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.preset-card-choice').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const days = card.getAttribute('data-days');
                const customInputBox = document.getElementById('custom-days-group');
                if (customInputBox) {
                    customInputBox.style.display = (days === 'custom') ? 'flex' : 'none';
                }
            });
        });

        // حفظ الخطة
        if (btnSavePlan) {
            btnSavePlan.addEventListener('click', () => {
                const selectedPreset = document.querySelector('.preset-card-choice.selected');
                let days = 30;
                if (selectedPreset) {
                    const presetDays = selectedPreset.getAttribute('data-days');
                    if (presetDays === 'custom') {
                        const customVal = parseInt(document.getElementById('input-custom-days')?.value);
                        days = (customVal && customVal >= 1 && customVal <= 365) ? customVal : 30;
                    } else {
                        days = parseInt(presetDays) || 30;
                    }
                }

                const startPageInput = document.getElementById('input-start-page');
                if (startPageInput && startPageInput.value) {
                    const sp = parseInt(startPageInput.value);
                    if (!isNaN(sp) && sp >= 0 && sp <= TOTAL_PAGES) {
                        khatmahData.currentPage = sp;
                    }
                }

                khatmahData.planDays = days;
                khatmahData.startDate = getTodayKey();
                saveKhatmahData(khatmahData);
                closePlanModal();
                renderKhatmahUI();
                showToast(`تم تفعيل خطتك بنجاح: ختمة في ${days} يوماً! سددك الله`, 'fa-solid fa-check');
            });
        }

        // مودال دعاء ختم القرآن
        const btnOpenDuaaModal = document.getElementById('btn-open-duaa-modal');
        const duaaModal = document.getElementById('duaa-khatm-modal');
        const btnCloseDuaaModal = document.getElementById('btn-close-duaa-modal');
        const btnCopyDuaa = document.getElementById('btn-copy-duaa');
        const btnDuaaZoomIn = document.getElementById('btn-duaa-zoom-in');
        const btnDuaaZoomOut = document.getElementById('btn-duaa-zoom-out');

        if (btnOpenDuaaModal) {
            btnOpenDuaaModal.addEventListener('click', openDuaaModal);
        }

        if (btnCloseDuaaModal && duaaModal) {
            btnCloseDuaaModal.addEventListener('click', () => duaaModal.classList.remove('active'));
            duaaModal.addEventListener('click', (e) => {
                if (e.target === duaaModal) duaaModal.classList.remove('active');
            });
        }

        if (btnCopyDuaa) {
            btnCopyDuaa.addEventListener('click', () => {
                const text = document.getElementById('duaa-text-body')?.innerText || '';
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        showToast('تم نسخ دعاء ختم القرآن الكريم بنجاح!', 'fa-solid fa-copy');
                    });
                }
            });
        }

        if (btnDuaaZoomIn) {
            btnDuaaZoomIn.addEventListener('click', () => {
                currentDuaaFontSize = Math.min(26, currentDuaaFontSize + 2);
                const el = document.getElementById('duaa-text-body');
                if (el) el.style.fontSize = `${currentDuaaFontSize}px`;
            });
        }

        if (btnDuaaZoomOut) {
            btnDuaaZoomOut.addEventListener('click', () => {
                currentDuaaFontSize = Math.max(14, currentDuaaFontSize - 2);
                const el = document.getElementById('duaa-text-body');
                if (el) el.style.fontSize = `${currentDuaaFontSize}px`;
            });
        }

        // زر إعادة ضبط الختمة / بدء ختمة جديدة
        const btnRestartKhatmah = document.getElementById('btn-restart-khatmah');
        if (btnRestartKhatmah) {
            btnRestartKhatmah.addEventListener('click', () => {
                if (confirm('هل ترغب في بدء ختمة جديدة؟ سيتم أرشفة ختمتك الحالية في السجل والبدء من الصفحة الأولى.')) {
                    if (khatmahData.currentPage > 0) {
                        if (!khatmahData.completedKhatmahs) khatmahData.completedKhatmahs = [];
                        khatmahData.completedKhatmahs.unshift({
                            id: Date.now(),
                            date: getTodayKey(),
                            planDays: khatmahData.planDays
                        });
                    }
                    khatmahData.currentPage = 0;
                    khatmahData.startDate = getTodayKey();
                    khatmahData.todaySlots = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
                    saveKhatmahData(khatmahData);
                    renderKhatmahUI();
                    showToast('تم بدء ختمة جديدة مباركة! وفقك الله لإتمامها', 'fa-solid fa-book-quran');
                }
            });
        }

        // الدليل الإرشادي (Guide Onboarding Banner)
        const guideBanner = document.getElementById('khatmah-guide-banner');
        const btnToggleGuide = document.getElementById('btn-toggle-guide');
        const btnGuideClose = document.getElementById('btn-guide-close');
        const btnGuideDismiss = document.getElementById('btn-guide-dismiss');
        const btnGuideStartPlan = document.getElementById('btn-guide-start-plan');

        const isGuideDismissed = localStorage.getItem('quiblah_khatmah_guide_dismissed') === 'true';
        if (guideBanner) {
            if (isGuideDismissed) {
                guideBanner.classList.add('hidden');
            } else {
                guideBanner.classList.remove('hidden');
            }
        }

        const dismissGuide = () => {
            if (guideBanner) {
                guideBanner.classList.add('hidden');
            }
            localStorage.setItem('quiblah_khatmah_guide_dismissed', 'true');
        };

        if (btnGuideClose) btnGuideClose.addEventListener('click', dismissGuide);
        if (btnGuideDismiss) btnGuideDismiss.addEventListener('click', dismissGuide);
        if (btnGuideStartPlan) {
            btnGuideStartPlan.addEventListener('click', () => {
                openPlanSettingsModal();
            });
        }
        if (btnToggleGuide) {
            btnToggleGuide.addEventListener('click', () => {
                if (guideBanner) {
                    guideBanner.classList.toggle('hidden');
                    if (!guideBanner.classList.contains('hidden')) {
                        guideBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            });
        }

        // أزرار طي وتوسيع الأقسام (Section Collapse)
        const btnCollapseJuzDeck = document.getElementById('btn-collapse-juz-deck');
        const juzDeckBody = document.getElementById('juz-deck-body');
        if (btnCollapseJuzDeck && juzDeckBody) {
            btnCollapseJuzDeck.addEventListener('click', () => {
                const isCollapsed = juzDeckBody.classList.toggle('collapsed');
                btnCollapseJuzDeck.classList.toggle('collapsed', isCollapsed);
            });
        }

        const btnCollapseHistoryDeck = document.getElementById('btn-collapse-history-deck');
        const historyDeckBody = document.getElementById('history-deck-body');
        if (btnCollapseHistoryDeck && historyDeckBody) {
            btnCollapseHistoryDeck.addEventListener('click', () => {
                const isCollapsed = historyDeckBody.classList.toggle('collapsed');
                btnCollapseHistoryDeck.classList.toggle('collapsed', isCollapsed);
            });
        }
    }

    function openPlanSettingsModal() {
        const modal = document.getElementById('plan-settings-modal');
        if (!modal) return;

        document.querySelectorAll('.preset-card-choice').forEach(c => {
            const d = c.getAttribute('data-days');
            if (parseInt(d) === khatmahData.planDays) {
                c.classList.add('selected');
            } else {
                c.classList.remove('selected');
            }
        });

        const startPageInput = document.getElementById('input-start-page');
        if (startPageInput) startPageInput.value = khatmahData.currentPage || 0;

        modal.classList.add('active');
    }

    function openDuaaModal() {
        const modal = document.getElementById('duaa-khatm-modal');
        if (modal) modal.classList.add('active');
    }

    // كاروسيل الخلفيات
    function initCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        if (!slides || slides.length < 2) return;
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 6500);
    }

    // نافذة التنبيه السريعة (Toast)
    function showToast(msg, icon = 'fa-solid fa-circle-check') {
        const toast = document.getElementById('toast-msg');
        if (!toast) return;
        toast.innerHTML = `<i class="${icon}"></i> <span>${msg}</span>`;
        toast.className = 'toast-msg show';
        setTimeout(() => {
            toast.className = 'toast-msg';
        }, 3200);
    }

    // تشغيل عند تحميل المستند
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initCarousel();
            setupEventListeners();
            renderKhatmahUI();
        });
    } else {
        initCarousel();
        setupEventListeners();
        renderKhatmahUI();
    }

    // دوال عامة للنوافذ
    window.openPlanSettingsModal = openPlanSettingsModal;
    window.openDuaaModal = openDuaaModal;

})();
