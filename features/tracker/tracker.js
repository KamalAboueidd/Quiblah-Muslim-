/**
 * features/tracker/tracker.js - منطق وإدارة متابعة العبادات اليومية والتقويم التفاعلي
 * تطبيق قبلة المسلم - طور بواسطة كمال أبو عيد
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'quiblah_worship_tracker_v1';
    const RING_RADIUS = 48;
    const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~301.59px

    // الصلوات الخمس المفروضة
    const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const TOTAL_PRAYERS = 5;

    // أسماء الأيام والشهور بالعربية لضمان العرض الدقيق دائماً
    const ARABIC_WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const ARABIC_MONTHS = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    // التاريخ النشط حالياً
    let currentDateKey = getTodayDateKey();
    let trackerStore = loadAllTrackerData();

    // حالة التقويم المنبثق
    let calViewYear = parseInt(currentDateKey.split('-')[0], 10);
    let calViewMonth = parseInt(currentDateKey.split('-')[1], 10) - 1; // 0-indexed
    let calCloseTimeout = null;

    // رسائل التحفيز بناء على صلوات الفريضة
    const PRAYER_MESSAGES = [
        { min: 5, title: "مبارك.. أتممت صلوات الفريضة الخمس كاملة", sub: "طوبى لك.. جعلها الله في ميزان حسناتك ونوراً لك يوم القيامة." },
        { min: 4, title: "أحسنت.. بقي صلاة واحدة لتتم فريضة اليوم", sub: "حافظ عليها واختم يومك بتمام الفرائض." },
        { min: 3, title: "تقبل الله.. أنجزت أكثر من نصف الصلوات المفروضة", sub: "استمر في المحافظة على ما تبقى في أوقاتها." },
        { min: 1, title: "استعن بالله وحافظ على الصلوات في أوقاتها", sub: "الصلاة عماد الدين.. اجعلها أولويتك وأول ما تسعى له." },
        { min: 0, title: "صلوات الفريضة الخمس", sub: "عماد الدين.. حافظ عليها في أوقاتها لتنال أجر الفريضة كاملاً." }
    ];

    // ================= تهيئة الصفحة =================
    document.addEventListener('DOMContentLoaded', () => {
        initCarousel();
        setupDateControls();
        setupCollapsibles();
        setupPrayerListeners();
        setupHabitListeners();
        setupQuranStepper();
        setupBottomActions();
        setupCalendarDropdown();

        // رسم واجهة اليوم
        renderDayView(currentDateKey);
    });

    // دالة الفتح والطي للقوائم
    window.toggleSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        triggerHaptic();
        section.classList.toggle('expanded');
    };

    function setupCollapsibles() {
        document.querySelectorAll('.tracker-section-card.collapsible').forEach(card => {
            const header = card.querySelector('.section-header');
            if (header) {
                header.setAttribute('role', 'button');
                header.setAttribute('tabindex', '0');
                header.setAttribute('aria-expanded', card.classList.contains('expanded') ? 'true' : 'false');

                const handleToggle = () => {
                    triggerHaptic();
                    card.classList.toggle('expanded');
                    header.setAttribute('aria-expanded', card.classList.contains('expanded') ? 'true' : 'false');
                };

                header.addEventListener('click', handleToggle);
                header.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggle();
                    }
                });
            }
        });
    }

    // ================= Background Carousel =================
    function initCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        if (!slides || slides.length === 0) return;
        let activeIdx = 0;
        setInterval(() => {
            slides[activeIdx].classList.remove('active');
            activeIdx = (activeIdx + 1) % slides.length;
            slides[activeIdx].classList.add('active');
        }, 8000);
    }

    // ================= أدوات التواريخ والتنقل =================
    function getTodayDateKey() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function formatDateForDisplay(dateKey) {
        try {
            const parts = dateKey.split('-');
            const y = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10) - 1;
            const d = parseInt(parts[2], 10);
            const date = new Date(y, m, d);
            const dayName = ARABIC_WEEKDAYS[date.getDay()];
            const monthName = ARABIC_MONTHS[m];
            return `${dayName}، ${d} ${monthName}`;
        } catch (e) {
            return dateKey;
        }
    }

    function getRelativeDateKey(baseDateKey, dayOffset) {
        const parts = baseDateKey.split('-');
        const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        date.setDate(date.getDate() + dayOffset);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    // ================= التحكم في التنقل بين الأيام =================
    function setupDateControls() {
        const prevBtn = document.getElementById('btn-prev-day');
        const nextBtn = document.getElementById('btn-next-day');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerHaptic();
                currentDateKey = getRelativeDateKey(currentDateKey, -1);
                renderDayView(currentDateKey);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const today = getTodayDateKey();
                if (currentDateKey >= today) return;
                triggerHaptic();
                currentDateKey = getRelativeDateKey(currentDateKey, 1);
                renderDayView(currentDateKey);
            });
        }
    }

    function updateDateNavigatorUI(dateKey) {
        const today = getTodayDateKey();
        const yesterday = getRelativeDateKey(today, -1);
        const isToday = (dateKey === today);
        const isYesterday = (dateKey === yesterday);

        const dateLabel = document.getElementById('current-date-label');
        const nextBtn = document.getElementById('btn-next-day');
        const prevBtn = document.getElementById('btn-prev-day');

        if (dateLabel) {
            let tagHtml = '';
            if (isToday) {
                tagHtml = `<span class="date-tag-mini">اليوم</span>`;
            } else if (isYesterday) {
                tagHtml = `<span class="date-tag-mini" style="color:#f39c12; background:rgba(243,156,18,0.18);">أمس</span>`;
            }
            dateLabel.innerHTML = `${formatDateForDisplay(dateKey)} ${tagHtml}`;
        }

        if (nextBtn) {
            if (isToday) {
                nextBtn.disabled = true;
                nextBtn.innerHTML = `<span>اليوم</span> <i class="fa-solid fa-chevron-left"></i>`;
            } else if (isYesterday) {
                nextBtn.disabled = false;
                nextBtn.innerHTML = `<span>اليوم</span> <i class="fa-solid fa-chevron-left"></i>`;
            } else {
                nextBtn.disabled = false;
                nextBtn.innerHTML = `<span>التالي</span> <i class="fa-solid fa-chevron-left"></i>`;
            }
        }

        if (prevBtn) {
            if (isToday) {
                prevBtn.innerHTML = `<i class="fa-solid fa-chevron-right"></i> <span>أمس</span>`;
            } else {
                prevBtn.innerHTML = `<i class="fa-solid fa-chevron-right"></i> <span>السابق</span>`;
            }
        }
    }

    // ================= التقويم التفاعلي (Interactive Calendar Popup) =================
    function setupCalendarDropdown() {
        const navContainer = document.getElementById('tracker-date-navigator');
        const triggerBadge = document.getElementById('btn-today-reset');
        const popup = document.getElementById('calendar-dropdown-popup');
        const prevMonthBtn = document.getElementById('cal-prev-month');
        const nextMonthBtn = document.getElementById('cal-next-month');
        const jumpTodayBtn = document.getElementById('cal-jump-today');

        if (!triggerBadge || !popup) return;

        // فتح التقويم
        function openCalendar() {
            if (calCloseTimeout) {
                clearTimeout(calCloseTimeout);
                calCloseTimeout = null;
            }
            // ضبط شهر العرض على الشهر المختار حالياً
            const parts = currentDateKey.split('-');
            calViewYear = parseInt(parts[0], 10);
            calViewMonth = parseInt(parts[1], 10) - 1;
            renderCalendarGrid();
            popup.classList.add('show');
            popup.setAttribute('aria-hidden', 'false');
            triggerBadge.classList.add('cal-active');
        }

        // إغلاق التقويم
        function closeCalendar() {
            popup.classList.remove('show');
            popup.setAttribute('aria-hidden', 'true');
            triggerBadge.classList.remove('cal-active');
        }

        // إغلاق مع مهلة للتنقل السلس بالماوس
        function scheduleClose() {
            calCloseTimeout = setTimeout(() => {
                closeCalendar();
            }, 250);
        }

        // سلوك الـ Hover (كما طلب كمال)
        triggerBadge.addEventListener('mouseenter', () => {
            openCalendar();
        });
        triggerBadge.addEventListener('mouseleave', () => {
            scheduleClose();
        });

        popup.addEventListener('mouseenter', () => {
            if (calCloseTimeout) {
                clearTimeout(calCloseTimeout);
                calCloseTimeout = null;
            }
        });
        popup.addEventListener('mouseleave', () => {
            scheduleClose();
        });

        // سلوك النقر (Toggle) للتابلت والموبايل
        triggerBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            if (popup.classList.contains('show')) {
                closeCalendar();
            } else {
                openCalendar();
            }
        });

        // النقر خارج التقويم يغلقه
        document.addEventListener('click', (e) => {
            if (popup && popup.classList.contains('show')) {
                if (!popup.contains(e.target) && !triggerBadge.contains(e.target)) {
                    closeCalendar();
                }
            }
        });

        // التنقل بين الشهور (السابق والتالي)
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerHaptic();
                calViewMonth--;
                if (calViewMonth < 0) {
                    calViewMonth = 11;
                    calViewYear--;
                }
                renderCalendarGrid();
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const today = new Date();
                // عدم السماح بالتنقل لشهور مستقبلية بعد الشهر الحالي
                if (calViewYear > today.getFullYear() || (calViewYear === today.getFullYear() && calViewMonth >= today.getMonth())) {
                    return;
                }
                triggerHaptic();
                calViewMonth++;
                if (calViewMonth > 11) {
                    calViewMonth = 0;
                    calViewYear++;
                }
                renderCalendarGrid();
            });
        }

        // زر العودة لليوم
        if (jumpTodayBtn) {
            jumpTodayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerHaptic();
                currentDateKey = getTodayDateKey();
                renderDayView(currentDateKey);
                closeCalendar();
            });
        }
    }

    // رسم خلايا وأيام التقويم
    function renderCalendarGrid() {
        const titleElem = document.getElementById('cal-month-title');
        const gridElem = document.getElementById('cal-days-grid');
        const nextMonthBtn = document.getElementById('cal-next-month');
        if (!titleElem || !gridElem) return;

        titleElem.textContent = `${ARABIC_MONTHS[calViewMonth]} ${calViewYear}`;

        const todayKey = getTodayDateKey();
        const todayDate = new Date();
        const isCurrentMonthOrFuture = (calViewYear > todayDate.getFullYear() || (calViewYear === todayDate.getFullYear() && calViewMonth >= todayDate.getMonth()));
        if (nextMonthBtn) {
            nextMonthBtn.disabled = isCurrentMonthOrFuture;
            nextMonthBtn.style.opacity = isCurrentMonthOrFuture ? '0.3' : '1';
        }

        gridElem.innerHTML = '';

        // أول يوم في الشهر
        const firstDay = new Date(calViewYear, calViewMonth, 1);
        const startingDayOfWeek = firstDay.getDay(); // 0: Sunday, 6: Saturday
        // أيام الأسبوع تبدأ من السبت في تقويمنا العربي
        // السبت = 6، الأحد = 0، الاثنين = 1، الثلاثاء = 2، الأربعاء = 3، الخميس = 4، الجمعة = 5
        const arabicDayOffset = (startingDayOfWeek + 1) % 7;

        // إجمالي أيام الشهر
        const daysInMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();

        // خلايا فارغة قبل بداية الشهر
        for (let i = 0; i < arabicDayOffset; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'cal-day-cell empty';
            gridElem.appendChild(emptyCell);
        }

        // أيام الشهر
        for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'cal-day-cell';

            const mStr = String(calViewMonth + 1).padStart(2, '0');
            const dStr = String(dayNum).padStart(2, '0');
            const cellDateKey = `${calViewYear}-${mStr}-${dStr}`;

            cell.setAttribute('data-date', cellDateKey);
            cell.textContent = String(dayNum);

            const isToday = (cellDateKey === todayKey);
            const isSelected = (cellDateKey === currentDateKey);
            const isFuture = (cellDateKey > todayKey);

            if (isToday) cell.classList.add('is-today');
            if (isSelected) cell.classList.add('is-selected');

            // فحص هل يوجد عبادات مسجلة في هذا اليوم
            const hasData = checkDayHasWorshipData(cellDateKey);
            if (hasData) {
                cell.classList.add('has-data');
                const dot = document.createElement('span');
                dot.className = 'cal-day-dot';
                cell.appendChild(dot);
            }

            if (isFuture) {
                cell.classList.add('is-future');
                cell.disabled = true;
            } else {
                cell.addEventListener('click', (e) => {
                    e.stopPropagation();
                    triggerHaptic();
                    currentDateKey = cellDateKey;
                    renderDayView(currentDateKey);
                    const popup = document.getElementById('calendar-dropdown-popup');
                    if (popup) popup.classList.remove('show');
                });
            }

            gridElem.appendChild(cell);
        }
    }

    function checkDayHasWorshipData(dateKey) {
        const data = trackerStore[dateKey];
        if (!data) return false;
        let count = 0;
        if (data.prayers) {
            Object.values(data.prayers).forEach(v => { if (v > 0) count++; });
        }
        if (data.habits) {
            Object.values(data.habits).forEach(v => { if (v) count++; });
        }
        if ((data.quran_pages || 0) > 0) count++;
        return count > 0;
    }

    // ================= قراءة وكتابة البيانات في LocalStorage =================
    function loadAllTrackerData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.error('Error loading tracker data:', e);
            return {};
        }
    }

    function saveAllTrackerData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving tracker data:', e);
        }
    }

    function getDayData(dateKey) {
        if (!trackerStore[dateKey]) {
            trackerStore[dateKey] = {
                prayers: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
                habits: {},
                quran_pages: 0
            };
        }
        return trackerStore[dateKey];
    }

    // ================= رسم واجهة اليوم المحدد =================
    function renderDayView(dateKey) {
        const dayData = getDayData(dateKey);

        // 1. تحديث شريط التاريخ والتنقل
        updateDateNavigatorUI(dateKey);

        // 2. تحديث الصلوات المفروضة الخمس
        PRAYER_KEYS.forEach(p => {
            const status = (dayData.prayers && dayData.prayers[p]) ? dayData.prayers[p] : 0;
            updatePrayerItemUI(p, status);
        });

        // 3. تحديث مربعات السنن والعبادات
        document.querySelectorAll('.habit-check-card').forEach(card => {
            const key = card.getAttribute('data-habit');
            if (key) {
                const isChecked = Boolean(dayData.habits && dayData.habits[key]);
                if (isChecked) {
                    card.classList.add('checked');
                } else {
                    card.classList.remove('checked');
                }
            }
        });

        // 4. تحديث عداد صفحات القرآن
        const quranPages = dayData.quran_pages || 0;
        const quranValueElem = document.getElementById('quran-pages-count');
        if (quranValueElem) {
            quranValueElem.textContent = `${quranPages} ${quranPages === 1 ? 'صفحة' : (quranPages === 2 ? 'صفحتان' : (quranPages <= 10 && quranPages >= 3 ? 'صفحات' : 'صفحة'))}`;
        }

        // 5. حساب النسبة والمؤشرات بدقة
        calculateAndRenderStats(dayData);
    }

    // ================= إعداد مستمعي الصلوات (في المسجد / في البيت) =================
    function setupPrayerListeners() {
        document.querySelectorAll('.prayer-choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const prayer = btn.getAttribute('data-prayer');
                const choiceType = btn.getAttribute('data-choice'); // "mosque" or "home"
                const choiceVal = (choiceType === 'mosque') ? 2 : 1;

                const dayData = getDayData(currentDateKey);
                if (!dayData.prayers) dayData.prayers = {};

                // النقر على نفس الخيار النشط يفرغه (Toggle)
                if (dayData.prayers[prayer] === choiceVal) {
                    dayData.prayers[prayer] = 0;
                } else {
                    dayData.prayers[prayer] = choiceVal;
                }

                triggerHaptic();
                saveAllTrackerData(trackerStore);
                updatePrayerItemUI(prayer, dayData.prayers[prayer]);
                calculateAndRenderStats(dayData);

                // التحقق من إتمام الصلوات الخمس
                checkAllPrayersCompleted(dayData);
            });
        });
    }

    function updatePrayerItemUI(prayer, status) {
        const item = document.getElementById(`prayer-item-${prayer}`);
        if (!item) return;

        item.classList.remove('status-mosque', 'status-home');
        const statusText = item.querySelector('.prayer-status-text');

        const mosqueBtn = item.querySelector('.prayer-choice-btn[data-choice="mosque"]');
        const homeBtn = item.querySelector('.prayer-choice-btn[data-choice="home"]');

        if (mosqueBtn) mosqueBtn.classList.remove('active-mosque');
        if (homeBtn) homeBtn.classList.remove('active-home');

        if (status === 2) {
            item.classList.add('status-mosque');
            if (mosqueBtn) mosqueBtn.classList.add('active-mosque');
            if (statusText) statusText.textContent = "صليتها في المسجد";
        } else if (status === 1) {
            item.classList.add('status-home');
            if (homeBtn) homeBtn.classList.add('active-home');
            if (statusText) statusText.textContent = "صليتها في البيت";
        } else {
            if (statusText) statusText.textContent = "لم تُصلَّ بعد";
        }
    }

    // ================= إعداد مستمعي السنن والعبادات =================
    function setupHabitListeners() {
        document.querySelectorAll('.habit-check-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = card.getAttribute('data-habit');
                if (!key) return;

                const dayData = getDayData(currentDateKey);
                if (!dayData.habits) dayData.habits = {};

                const newState = !dayData.habits[key];
                dayData.habits[key] = newState;

                triggerHaptic();
                saveAllTrackerData(trackerStore);

                if (newState) {
                    card.classList.add('checked');
                } else {
                    card.classList.remove('checked');
                }

                calculateAndRenderStats(dayData);
            });
        });
    }

    // ================= إعداد عداد صفحات القرآن =================
    function setupQuranStepper() {
        const minusBtn = document.getElementById('btn-quran-minus');
        const plusBtn = document.getElementById('btn-quran-plus');

        if (minusBtn) {
            minusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dayData = getDayData(currentDateKey);
                if ((dayData.quran_pages || 0) > 0) {
                    dayData.quran_pages = (dayData.quran_pages || 0) - 1;
                    triggerHaptic();
                    saveAllTrackerData(trackerStore);
                    renderDayView(currentDateKey);
                }
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dayData = getDayData(currentDateKey);
                dayData.quran_pages = (dayData.quran_pages || 0) + 1;
                triggerHaptic();
                saveAllTrackerData(trackerStore);
                renderDayView(currentDateKey);
            });
        }
    }

    // ================= حساب الإحصائيات الدقيقة (المؤشر للصلوات الخمس) =================
    function calculateAndRenderStats(dayData) {
        // 1. الصلوات المفروضة الخمس (المعيار الأساسي للعداد)
        let prayersDone = 0;
        PRAYER_KEYS.forEach(p => {
            if (dayData.prayers && (dayData.prayers[p] === 1 || dayData.prayers[p] === 2)) {
                prayersDone++;
            }
        });

        const prayerPercent = Math.round((prayersDone / TOTAL_PRAYERS) * 100);

        // تحديث نص النسبة والكسر للصلوات
        const percentElem = document.getElementById('progress-percent');
        const fractionElem = document.getElementById('progress-fraction');
        if (percentElem) percentElem.textContent = `${prayerPercent}%`;
        if (fractionElem) fractionElem.textContent = `${prayersDone} من ${TOTAL_PRAYERS} صلوات`;

        // تحريك حلقة SVG الدائرية
        const ringFill = document.getElementById('progress-ring-fill');
        if (ringFill) {
            const offset = RING_CIRCUMFERENCE - (prayerPercent / 100) * RING_CIRCUMFERENCE;
            ringFill.style.strokeDashoffset = offset;

            // يتحول اللون إلى الأخضر الزمردي عند إتمام 5 من 5
            if (prayersDone === 5) {
                ringFill.style.stroke = '#2ecc71';
            } else {
                ringFill.style.stroke = 'url(#goldGradient)';
            }
        }

        // 2. حساب السنن والنوافل المنجزة
        let sunanDone = 0;
        ['sunnah_fajr', 'sunnah_dhuhr', 'sunnah_maghrib', 'sunnah_isha', 'duha', 'witr'].forEach(s => {
            if (dayData.habits && dayData.habits[s]) sunanDone++;
        });

        let adhkarDone = 0;
        ['azkar_morning', 'azkar_evening', 'azkar_sleep', 'salawat', 'istighfar'].forEach(a => {
            if (dayData.habits && dayData.habits[a]) adhkarDone++;
        });
        if ((dayData.quran_pages || 0) > 0) adhkarDone++;

        let deedsDone = 0;
        ['sadaqah', 'birr_walidayn', 'siyam_nafl', 'husn_khuluq'].forEach(d => {
            if (dayData.habits && dayData.habits[d]) deedsDone++;
        });

        const totalNawafilDone = sunanDone + adhkarDone + deedsDone;

        // تحديث بادج السنن والنوافل في الهيرو
        const nawafilCountText = document.getElementById('nawafil-count-text');
        if (nawafilCountText) {
            nawafilCountText.textContent = `${totalNawafilDone} سنن وأوراد مسجلة`;
        }

        // تحديث بادجات العناوين (نصوص صافية بدون خلفيات أو حواف مع dir=ltr لمنع الانعكاس)
        const badgePrayers = document.getElementById('badge-prayers');
        if (badgePrayers) badgePrayers.textContent = `${prayersDone} / 5`;

        const badgeSunan = document.getElementById('badge-sunan');
        if (badgeSunan) badgeSunan.textContent = `${sunanDone} / 6`;

        const badgeAdhkar = document.getElementById('badge-adhkar');
        if (badgeAdhkar) badgeAdhkar.textContent = `${adhkarDone} / 6`;

        const badgeDeeds = document.getElementById('badge-deeds');
        if (badgeDeeds) badgeDeeds.textContent = `${deedsDone} / 4`;

        // تحديث رسالة التحفيز بناء على صلوات الفريضة
        updatePrayerMotivation(prayersDone);

        // تحديث سلسلة الصلوات المتتالية
        updateStreakDisplay();
    }

    function updatePrayerMotivation(prayersDone) {
        const quoteElem = document.getElementById('tracker-quote-text');
        const subquoteElem = document.getElementById('tracker-subquote-text');
        if (!quoteElem || !subquoteElem) return;

        const msg = PRAYER_MESSAGES.find(m => prayersDone >= m.min) || PRAYER_MESSAGES[PRAYER_MESSAGES.length - 1];
        quoteElem.textContent = msg.title;
        subquoteElem.textContent = msg.sub;
    }

    // ================= حساب سلسلة الصلوات الخمس المتتالية (Streak) =================
    function calculateStreak() {
        const today = getTodayDateKey();
        let streak = 0;
        let checkDate = today;

        while (true) {
            const dayData = trackerStore[checkDate];
            if (!dayData) {
                if (checkDate === today) {
                    checkDate = getRelativeDateKey(checkDate, -1);
                    continue;
                }
                break;
            }

            let prayersDone = 0;
            PRAYER_KEYS.forEach(p => {
                if (dayData.prayers && dayData.prayers[p] > 0) prayersDone++;
            });

            if (prayersDone === 5) {
                streak++;
                checkDate = getRelativeDateKey(checkDate, -1);
            } else {
                if (checkDate === today) {
                    checkDate = getRelativeDateKey(checkDate, -1);
                    continue;
                }
                break;
            }
        }

        return streak;
    }

    function updateStreakDisplay() {
        const streak = calculateStreak();
        const streakCountElem = document.getElementById('streak-count');
        if (streakCountElem) {
            streakCountElem.textContent = `${streak} ${streak === 1 ? 'يوم' : (streak === 2 ? 'يومان' : (streak <= 10 ? 'أيام' : 'يوماً'))}`;
        }
    }

    // ================= فحص إتمام الصلوات الخمس =================
    function checkAllPrayersCompleted(dayData) {
        const allDone = PRAYER_KEYS.every(p => dayData.prayers && dayData.prayers[p] > 0);
        if (allDone && !dayData._prayersCongratulated) {
            dayData._prayersCongratulated = true;
            saveAllTrackerData(trackerStore);
            showAppToast("مبارك.. أتممت صلوات الفريضة الخمس كاملة لهذا اليوم! تقبل الله طاعتك.", "success");
        }
    }

    // ================= أزرار التحكم السفلية =================
    function setupBottomActions() {
        const shareBtn = document.getElementById('btn-share-tracker');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                triggerHaptic();
                shareProgressSummary();
            });
        }

        const resetBtn = document.getElementById('btn-reset-tracker');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const isConfirmed = confirm("هل أنت متأكد من رغبتك في إعادة ضبط إنجاز هذا اليوم؟");
                if (isConfirmed) {
                    triggerHaptic();
                    delete trackerStore[currentDateKey];
                    saveAllTrackerData(trackerStore);
                    renderDayView(currentDateKey);
                    showAppToast("تمت إعادة ضبط سجل هذا اليوم بنجاح", "info");
                }
            });
        }
    }

    function shareProgressSummary() {
        const dayData = getDayData(currentDateKey);
        let prayersDone = 0;
        PRAYER_KEYS.forEach(p => {
            if (dayData.prayers && dayData.prayers[p] > 0) prayersDone++;
        });

        let sunanDone = 0;
        ['sunnah_fajr', 'sunnah_dhuhr', 'sunnah_maghrib', 'sunnah_isha', 'duha', 'witr'].forEach(s => {
            if (dayData.habits && dayData.habits[s]) sunanDone++;
        });
        let adhkarDone = 0;
        ['azkar_morning', 'azkar_evening', 'azkar_sleep', 'salawat', 'istighfar'].forEach(a => {
            if (dayData.habits && dayData.habits[a]) adhkarDone++;
        });
        if ((dayData.quran_pages || 0) > 0) adhkarDone++;
        let deedsDone = 0;
        ['sadaqah', 'birr_walidayn', 'siyam_nafl', 'husn_khuluq'].forEach(d => {
            if (dayData.habits && dayData.habits[d]) deedsDone++;
        });

        const totalNawafil = sunanDone + adhkarDone + deedsDone;
        const streak = calculateStreak();

        const shareText = `متابعة العبادات اليومية - قبلة المسلم
التاريخ: ${formatDateForDisplay(currentDateKey)}
الصلوات المفروضة: ${prayersDone} من 5 صلوات (${Math.round((prayersDone / 5) * 100)}%)
السنن والأوراد الإضافية: ${totalNawafil} سنن ونوافل
سلسلة إتمام الصلوات: ${streak} أيام متتالية
رابط التطبيق: https://kamalaboueidd.github.io/Quiblah-Muslim-/tracker.html`;

        if (navigator.share) {
            navigator.share({
                title: "متابعة العبادات اليومية - قبلة المسلم",
                text: shareText
            }).catch(() => {
                copyTextToClipboard(shareText);
            });
        } else {
            copyTextToClipboard(shareText);
        }
    }

    function copyTextToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showAppToast("تم نسخ ملخص إنجازك اليومي للمشاركة", "success");
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showAppToast("تم نسخ ملخص إنجازك اليومي للمشاركة", "success");
        } catch (err) {
            showAppToast("تعذر النسخ التلقائي", "error");
        }
        document.body.removeChild(textArea);
    }

    // ================= Haptic Feedback & Toast =================
    function triggerHaptic() {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate(15); } catch (e) {}
        }
    }

    function showAppToast(msg, type = "info") {
        if (typeof window.showToast === 'function') {
            window.showToast(msg, type);
        } else {
            console.log(`[Toast ${type}]:`, msg);
        }
    }

})();
