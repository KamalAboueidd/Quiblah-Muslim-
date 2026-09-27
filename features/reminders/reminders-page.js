// features/reminders/reminders-page.js - منطق وبرمجة صفحة الأذان والإقامة
(function () {
    'use strict';

    // ==========================================
    // 1. Fullscreen Background Carousel
    // ==========================================
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 8000);
    }

    // ==========================================
    // 2. Governorates & Prayer Sync with Iqamah
    // ==========================================
    const CITIES = [
        { ArabicName: "القاهرة", name: "Cairo", govName: "القاهرة" },
        { ArabicName: "الاسكندرية", name: "Alexandria", govName: "الإسكندرية" },
        { ArabicName: "الجيزة", name: "Giza", govName: "الجيزة" },
        { ArabicName: "السويس", name: "Suez", govName: "السويس" },
        { ArabicName: "بورسعيد", name: "Port Said", govName: "بورسعيد" },
        { ArabicName: "المنصورة (الدقهلية)", name: "Dakahlia", govName: "الدقهلية" },
        { ArabicName: "طنطا (الغربية)", name: "Gharbia", govName: "الغربية" },
        { ArabicName: "الزقازيق (الشرقية)", name: "Al Sharqia", govName: "الشرقية" },
        { ArabicName: "بنها (القليوبية)", name: "Qalyubia", govName: "القليوبية" },
        { ArabicName: "دمنهور (البحيرة)", name: "Beheira", govName: "البحيرة" },
        { ArabicName: "كفر الشيخ", name: "Kafr el-Sheikh", govName: "كفر الشيخ" },
        { ArabicName: "دمياط", name: "Damietta", govName: "دمياط" },
        { ArabicName: "شبين الكوم (المنوفية)", name: "Monufia", govName: "المنوفية" },
        { ArabicName: "الفيوم", name: "Faiyum", govName: "الفيوم" },
        { ArabicName: "بني سويف", name: "Beni Suef", govName: "بني سويف" },
        { ArabicName: "المنيا", name: "Minya", govName: "المنيا" },
        { ArabicName: "أسيوط", name: "Asyut", govName: "أسيوط" },
        { ArabicName: "سوهاج", name: "Sohag", govName: "سوهاج" },
        { ArabicName: "قنا", name: "Qena", govName: "قنا" },
        { ArabicName: "الأقصر", name: "Luxor", govName: "الأقصر" },
        { ArabicName: "أسوان", name: "Aswan", govName: "أسوان" },
        { ArabicName: "مرسى مطروح", name: "Matrouh", govName: "مطروح" },
        { ArabicName: "الغردقة (البحر الأحمر)", name: "Red Sea", govName: "البحر الأحمر" },
        { ArabicName: "الخارجة (الوادي الجديد)", name: "New Valley", govName: "الوادي الجديد" },
        { ArabicName: "الإسماعيلية", name: "Ismailia", govName: "الإسماعيلية" },
        { ArabicName: "الطور (جنوب سيناء)", name: "South Sinai", govName: "جنوب سيناء" }
    ];

    // Standard Iqamah duration after Adhan in minutes
    const IQAMAH_DELAYS = {
        "الفجر": 20,
        "الظهر": 15,
        "العصر": 15,
        "المغرب": 10,
        "العشاء": 15
    };

    let currentCity = localStorage.getItem("selectedCity") || "Cairo";
    let activePrayerData = null;
    let prayerCountdownInterval = null;

    const citySelect = document.getElementById('gov-city-select');
    const activeCityLabel = document.getElementById('active-city-label');
    const nextPrayerNameEl = document.getElementById('next-prayer-name-display');
    const nextPrayerTimeEl = document.getElementById('next-prayer-time-display');
    const nextPrayerCountdownEl = document.getElementById('next-prayer-countdown-display');
    const nextIqamahTimeEl = document.getElementById('next-iqamah-time-display');
    const nextIqamahCountdownEl = document.getElementById('next-iqamah-countdown-display');

    function getGovernorateDisplayName(cityIdentifier) {
        if (!cityIdentifier) {
            const govSelectedCityText = document.getElementById('gov-selected-city-text');
            if (govSelectedCityText && govSelectedCityText.textContent.trim()) {
                cityIdentifier = govSelectedCityText.textContent.trim();
            } else {
                cityIdentifier = localStorage.getItem("selectedCity") || currentCity || "Alexandria";
            }
        }

        const raw = String(cityIdentifier).trim();
        const clean = raw.toLowerCase();

        for (const c of CITIES) {
            if (
                c.name.toLowerCase() === clean ||
                c.ArabicName.toLowerCase() === clean ||
                (c.govName && c.govName.toLowerCase() === clean) ||
                clean.includes(c.name.toLowerCase()) ||
                clean.includes(c.govName.toLowerCase()) ||
                c.ArabicName.includes(raw) ||
                raw.includes(c.ArabicName)
            ) {
                return c.govName || c.ArabicName;
            }
        }

        const match = raw.match(/\(([^)]+)\)/);
        if (match && match[1]) {
            return match[1].trim();
        }

        return raw || "الإسكندرية";
    }

    function syncCurrentCityAcrossUI(chosenCity, arabicName) {
        const govName = getGovernorateDisplayName(arabicName || chosenCity);
        const displayName = arabicName || govName;

        const govSelectedCityText = document.getElementById('gov-selected-city-text');
        if (govSelectedCityText) govSelectedCityText.textContent = displayName;

        const activeCityLabel = document.getElementById('active-city-label');
        if (activeCityLabel) activeCityLabel.textContent = govName;

        const overlayCityText = document.getElementById('adhan-screen-city-text');
        if (overlayCityText) {
            overlayCityText.textContent = `حسب التوقيت المحلي لمحافظة ${govName} وضواحيها`;
        }

        const overlayStatusText = document.getElementById('adhan-screen-status-text');
        if (overlayStatusText) {
            overlayStatusText.textContent = `يُرفع الآن الأذان المبارك في ${govName}`;
        }

        if (chosenCity) {
            currentCity = chosenCity;
            localStorage.setItem("selectedCity", chosenCity);
            localStorage.setItem("quiblah_selected_gov_name", govName);
            localStorage.setItem("quiblah_user_city", govName);
        }
    }

    function initCitySelector() {
        const govCityDropdown = document.getElementById('gov-city-dropdown');
        const govCityTrigger = document.getElementById('gov-city-trigger');
        const govSelectedCityText = document.getElementById('gov-selected-city-text');
        const govCityOptionsList = document.getElementById('gov-city-options-list');

        if (!govCityDropdown || !govCityOptionsList) return;

        function attachItemEvents(item) {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                const chosenCity = this.getAttribute('data-value');
                const arabicName = this.querySelector('span') ? this.querySelector('span').textContent.trim() : chosenCity;

                syncCurrentCityAcrossUI(chosenCity, arabicName);

                govCityOptionsList.querySelectorAll('.dropdown-luxury-item').forEach(el => el.classList.remove('active'));
                this.classList.add('active');

                govCityDropdown.classList.remove('open');
                if (govCityTrigger) govCityTrigger.setAttribute('aria-expanded', 'false');

                const govName = getGovernorateDisplayName(arabicName || chosenCity);
                if (window.showToast) {
                    window.showToast(`تم اعتماد محافظة ${govName} لرفع الأذان وموعد الإقامة`, 'fa-solid fa-location-dot');
                }

                fetchPrayerTimingsForCity(chosenCity);
            });
        }

        const saved = localStorage.getItem("selectedCity") || currentCity || "Alexandria";
        let activeFound = false;

        const existingItems = govCityOptionsList.querySelectorAll('.dropdown-luxury-item');
        if (existingItems.length > 0) {
            existingItems.forEach(item => {
                const val = item.getAttribute('data-value') || '';
                const spanText = item.querySelector('span') ? item.querySelector('span').textContent.trim() : '';
                const isSelected = (
                    val.toLowerCase() === saved.toLowerCase() ||
                    spanText === saved ||
                    spanText.includes(saved) ||
                    saved.includes(spanText)
                );
                if (isSelected && !activeFound) {
                    item.classList.add('active');
                    activeFound = true;
                    syncCurrentCityAcrossUI(val, spanText);
                } else {
                    item.classList.remove('active');
                }
                attachItemEvents(item);
            });
        }

        if (!activeFound) {
            syncCurrentCityAcrossUI(saved, saved);
        }

        // Toggle trigger
        if (govCityTrigger) {
            govCityTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = govCityDropdown.classList.toggle('open');
                this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
        }

        // Close on click outside or escape
        document.addEventListener('click', function (e) {
            if (!govCityDropdown.contains(e.target)) {
                govCityDropdown.classList.remove('open');
                if (govCityTrigger) govCityTrigger.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && govCityDropdown.classList.contains('open')) {
                govCityDropdown.classList.remove('open');
                if (govCityTrigger) govCityTrigger.setAttribute('aria-expanded', 'false');
            }
        });

        // Load timings for current city
        fetchPrayerTimingsForCity(currentCity);
    }

    function format12Hour(timeStr) {
        if (!timeStr) return '--:--';
        const parts = timeStr.split(':');
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1];
        const isPM = hours >= 12;
        hours = hours % 12;
        hours = hours ? hours : 12;
        const displayHours = hours < 10 ? '0' + hours : hours;
        return `${displayHours}:${minutes} ${isPM ? 'م' : 'ص'}`;
    }

    function addMinutesToTimeStr(timeStr, minutesToAdd) {
        if (!timeStr) return '--:--';
        const parts = timeStr.split(':');
        let hours = parseInt(parts[0], 10);
        let minutes = parseInt(parts[1], 10) + minutesToAdd;
        if (minutes >= 60) {
            hours += Math.floor(minutes / 60);
            minutes = minutes % 60;
        }
        hours = hours % 24;
        const hStr = hours < 10 ? '0' + hours : hours;
        const mStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hStr}:${mStr}`;
    }

    async function fetchPrayerTimingsForCity(cityName) {
        // Try to load cached timings first
        const cacheKey = `quiblah_timings_${cityName.toLowerCase()}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                activePrayerData = parsed;
                startPrayerAndIqamahCountdown(parsed);
            } catch (e) { }
        }

        try {
            const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=Egypt&method=5`;
            const res = await fetch(url);
            if (res.ok) {
                const json = await res.json();
                if (json && json.data && json.data.timings) {
                    activePrayerData = json.data;
                    localStorage.setItem(cacheKey, JSON.stringify(json.data));
                    localStorage.setItem("quiblah_last_timings", JSON.stringify(json.data));
                    startPrayerAndIqamahCountdown(json.data);
                }
            }
        } catch (err) {
            console.warn('[Reminders] Failed to fetch live prayer timings:', err);
        }
    }

    function startPrayerAndIqamahCountdown(data) {
        if (!data || !data.timings) return;
        if (prayerCountdownInterval) clearInterval(prayerCountdownInterval);

        const timezone = data.meta ? data.meta.timezone : "Africa/Cairo";
        const t = data.timings;

        const prayers = [
            { name: "الفجر", key: "Fajr", time: t.Fajr.split(' ')[0] },
            { name: "الظهر", key: "Dhuhr", time: t.Dhuhr.split(' ')[0] },
            { name: "العصر", key: "Asr", time: t.Asr.split(' ')[0] },
            { name: "المغرب", key: "Maghrib", time: (t.Sunset || t.Maghrib).split(' ')[0] },
            { name: "العشاء", key: "Isha", time: t.Isha.split(' ')[0] }
        ];

        function tick() {
            const now = new Date();
            const nowInTz = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

            let nextPrayer = null;
            let nextPrayerDate = null;
            let currentActivePrayer = null;
            let currentPrayerAdhanDate = null;

            for (let i = 0; i < prayers.length; i++) {
                const p = prayers[i];
                const parts = p.time.split(':');
                const pDate = new Date(nowInTz);
                pDate.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);

                const iqamahDelay = IQAMAH_DELAYS[p.name] || 15;
                const iqamahDate = new Date(pDate.getTime() + iqamahDelay * 60 * 1000);

                // If currently between Adhan and Iqamah
                if (nowInTz >= pDate && nowInTz < iqamahDate) {
                    currentActivePrayer = p;
                    currentPrayerAdhanDate = pDate;
                }

                if (pDate > nowInTz && !nextPrayer) {
                    nextPrayer = p;
                    nextPrayerDate = pDate;
                }
            }

            // If past Isha, next is Fajr tomorrow
            if (!nextPrayer) {
                const p = prayers[0];
                const parts = p.time.split(':');
                const pDate = new Date(nowInTz);
                pDate.setDate(pDate.getDate() + 1);
                pDate.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
                nextPrayer = p;
                nextPrayerDate = pDate;
            }

            // Case A: Currently between Adhan and Iqamah!
            if (currentActivePrayer) {
                const delayMin = IQAMAH_DELAYS[currentActivePrayer.name] || 15;
                const iqamahDate = new Date(currentPrayerAdhanDate.getTime() + delayMin * 60 * 1000);
                const diffIqamah = iqamahDate - nowInTz;

                const iqMinutes = Math.floor(diffIqamah / (1000 * 60));
                const iqSeconds = Math.floor((diffIqamah % (1000 * 60)) / 1000);
                const iqStr = `${String(iqMinutes).padStart(2, '0')}:${String(iqSeconds).padStart(2, '0')}`;

                if (nextPrayerNameEl) nextPrayerNameEl.textContent = `أذان ${currentActivePrayer.name} مرفوع الآن`;
                if (nextPrayerTimeEl) nextPrayerTimeEl.textContent = format12Hour(currentActivePrayer.time);
                if (nextPrayerCountdownEl) {
                    nextPrayerCountdownEl.textContent = "حان وقت الصلاة";
                    nextPrayerCountdownEl.style.color = "var(--gold-hover)";
                }

                const iqamahClockTime = addMinutesToTimeStr(currentActivePrayer.time, delayMin);
                if (nextIqamahTimeEl) nextIqamahTimeEl.textContent = format12Hour(iqamahClockTime);
                if (nextIqamahCountdownEl) {
                    nextIqamahCountdownEl.textContent = `(الإقامة بعد: ${iqStr})`;
                    nextIqamahCountdownEl.style.color = "#ffdd57";
                }
            } else {
                // Case B: Counting down to next Adhan
                const diffMs = nextPrayerDate - nowInTz;
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

                const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                if (nextPrayerNameEl) nextPrayerNameEl.textContent = `صلاة ${nextPrayer.name}`;
                if (nextPrayerTimeEl) nextPrayerTimeEl.textContent = format12Hour(nextPrayer.time);
                if (nextPrayerCountdownEl) {
                    nextPrayerCountdownEl.textContent = timeStr;
                    nextPrayerCountdownEl.style.color = "var(--gold-hover)";
                }

                const delayMin = IQAMAH_DELAYS[nextPrayer.name] || 15;
                const iqamahClockTime = addMinutesToTimeStr(nextPrayer.time, delayMin);
                if (nextIqamahTimeEl) nextIqamahTimeEl.textContent = format12Hour(iqamahClockTime);
                if (nextIqamahCountdownEl) {
                    nextIqamahCountdownEl.textContent = `(بعد الأذان بـ ${delayMin} دقيقة)`;
                    nextIqamahCountdownEl.style.color = "var(--gold-light)";
                }
            }
        }

        tick();
        prayerCountdownInterval = setInterval(tick, 1000);
    }

    // ==========================================
    // 3. Muezzins Selection & Preview Logic
    // ==========================================
    const MUEZZINS = [
        {
            id: 'makkah_mulla',
            name: 'الشيخ علي أحمد ملا',
            title: 'أذان الحرم المكي الشريف',
            location: 'مكة المكرمة - المملكة العربية السعودية',
            url: 'https://www.islamcan.com/audio/adhan/azan1.mp3',
            fallbackUrl: 'assets/Azan/456572.mp3',
            badge: 'الحرم المكي'
        },
        {
            id: 'madinah_bukhari',
            name: 'الشيخ عصام بخاري',
            title: 'أذان المسجد النبوي الشريف',
            location: 'المدينة المنورة - المملكة العربية السعودية',
            url: 'https://www.islamcan.com/audio/adhan/azan2.mp3',
            fallbackUrl: 'assets/Azan/456572.mp3',
            badge: 'المسجد النبوي'
        },
        {
            id: 'egypt_abdulbasit',
            name: 'الشيخ عبد الباسط عبد الصمد',
            title: 'الأذان المصري برواية حفص',
            location: 'جمهورية مصر العربية',
            url: 'https://www.islamcan.com/audio/adhan/azan7.mp3',
            fallbackUrl: 'assets/Azan/456572.mp3',
            badge: 'الأذان المصري'
        },
        {
            id: 'alaqsa',
            name: 'أذان المسجد الأقصى المبارك',
            title: 'نداء الحق من أرض الإسراء',
            location: 'القدس الشريف - فلسطين',
            url: 'https://www.islamcan.com/audio/adhan/azan3.mp3',
            fallbackUrl: 'assets/Azan/456572.mp3',
            badge: 'القدس الشريف'
        },
        {
            id: 'fajr_special',
            name: 'أذان الفجر (الصلاة خير من النوم)',
            title: 'الأذان الروحاني لصلاة الفجر',
            location: 'مساجد العالم الإسلامي',
            url: 'https://www.islamcan.com/audio/adhan/azan14.mp3',
            fallbackUrl: 'assets/Azan/456572.mp3',
            badge: 'أذان الفجر'
        }
    ];

    const previewAudioPlayer = document.getElementById('preview-audio-player');
    const adhanAudioPlayer = document.getElementById('adhan-audio-player');
    const muezzinsGrid = document.getElementById('muezzins-grid');

    let currentlyPlayingMuezzinId = null;

    function getSelectedMuezzinId() {
        return localStorage.getItem('quiblah_selected_muezzin') || 'makkah_mulla';
    }

    function getSelectedMuezzinObj() {
        const id = getSelectedMuezzinId();
        return MUEZZINS.find(m => m.id === id) || MUEZZINS[0];
    }

    function createMuezzinCardElement(muezzin, isSelected) {
        const isPlaying = currentlyPlayingMuezzinId === muezzin.id;
        const card = document.createElement('div');
        card.className = `muezzin-card ${isSelected ? 'active-selected' : ''} ${isPlaying ? 'is-playing' : ''}`;
        card.id = `muezzin-card-${muezzin.id}`;

        card.innerHTML = `
            <div class="muezzin-card-header">
                <div class="muezzin-main-info">
                    <span class="muezzin-title">${muezzin.name}</span>
                    <span class="muezzin-location">${muezzin.title} • ${muezzin.location}</span>
                </div>
                <span class="muezzin-badge">${isSelected ? 'المؤذن المعتمد حالياً' : muezzin.badge}</span>
            </div>

            <div class="muezzin-playing-indicator" aria-hidden="true">
                <span class="card-wave-bar"></span>
                <span class="card-wave-bar"></span>
                <span class="card-wave-bar"></span>
                <span class="card-wave-bar"></span>
            </div>

            <div class="muezzin-card-actions">
                <button type="button" class="btn-preview-muezzin" data-id="${muezzin.id}" title="استماع إلى عينة من الأذان">
                    <i class="fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                    <span>${isPlaying ? 'إيقاف' : 'استماع'}</span>
                </button>
                <button type="button" class="btn-select-muezzin" data-id="${muezzin.id}" title="تعيين كمؤذن رئيسي للصلوات">
                    <i class="fa-solid ${isSelected ? 'fa-circle-check' : 'fa-check'}"></i>
                    <span>${isSelected ? 'المعتمد لصلواتك' : 'اختيار كمؤذن رئيسي'}</span>
                </button>
            </div>
        `;

        const btnPreview = card.querySelector('.btn-preview-muezzin');
        const btnSelect = card.querySelector('.btn-select-muezzin');

        btnPreview.addEventListener('click', () => togglePreviewMuezzin(muezzin));
        btnSelect.addEventListener('click', () => selectActiveMuezzin(muezzin));

        return card;
    }

    const muezzinPrimaryBox = document.getElementById('muezzin-primary-box');
    const muezzinsCollapsible = document.getElementById('muezzins-collapsible-wrapper');
    const btnToggleMuezzins = document.getElementById('btn-toggle-muezzins');
    const labelToggleMuezzins = document.getElementById('label-toggle-muezzins');
    let isMuezzinsExpanded = false;

    function renderMuezzins() {
        if (!muezzinPrimaryBox || !muezzinsGrid) return;

        const activeMuezzin = getSelectedMuezzinObj();
        const otherMuezzins = MUEZZINS.filter(m => m.id !== activeMuezzin.id);

        // 1. Render primary active card
        muezzinPrimaryBox.innerHTML = '';
        muezzinPrimaryBox.appendChild(createMuezzinCardElement(activeMuezzin, true));

        // 2. Render other muezzins
        muezzinsGrid.innerHTML = '';
        otherMuezzins.forEach(muezzin => {
            muezzinsGrid.appendChild(createMuezzinCardElement(muezzin, false));
        });

        // 3. Update expand button label
        if (labelToggleMuezzins) {
            labelToggleMuezzins.textContent = isMuezzinsExpanded
                ? 'إخفاء باقي المؤذنين'
                : `عرض باقي المؤذنين (${otherMuezzins.length})`;
        }
    }

    // Toggle Muezzins Expand/Collapse
    if (btnToggleMuezzins && muezzinsCollapsible) {
        btnToggleMuezzins.addEventListener('click', function () {
            isMuezzinsExpanded = !isMuezzinsExpanded;
            this.classList.toggle('open', isMuezzinsExpanded);
            this.setAttribute('aria-expanded', isMuezzinsExpanded ? 'true' : 'false');
            muezzinsCollapsible.classList.toggle('open', isMuezzinsExpanded);

            const otherCount = MUEZZINS.length - 1;
            if (labelToggleMuezzins) {
                labelToggleMuezzins.textContent = isMuezzinsExpanded
                    ? 'إخفاء باقي المؤذنين'
                    : `عرض باقي المؤذنين (${otherCount})`;
            }
        });
    }

    function togglePreviewMuezzin(muezzin) {
        if (!previewAudioPlayer) return;

        // If currently playing this same muezzin -> Stop
        if (currentlyPlayingMuezzinId === muezzin.id) {
            previewAudioPlayer.pause();
            currentlyPlayingMuezzinId = null;
            renderMuezzins();
            return;
        }

        // Stop any active adhan playback
        if (adhanAudioPlayer && !adhanAudioPlayer.paused) {
            adhanAudioPlayer.pause();
        }

        // Set audio source with fallback handling
        previewAudioPlayer.pause();
        previewAudioPlayer.src = muezzin.url;
        previewAudioPlayer.onerror = function () {
            console.warn('[Audio] Failed to stream from CDN, falling back to local asset.');
            previewAudioPlayer.src = muezzin.fallbackUrl || 'assets/Azan/456572.mp3';
            previewAudioPlayer.play().catch(e => console.log(e));
        };

        previewAudioPlayer.play().then(() => {
            currentlyPlayingMuezzinId = muezzin.id;
            renderMuezzins();
        }).catch(err => {
            console.warn('Audio play blocked:', err);
            // Fallback attempt
            previewAudioPlayer.src = muezzin.fallbackUrl || 'assets/Azan/456572.mp3';
            previewAudioPlayer.play().then(() => {
                currentlyPlayingMuezzinId = muezzin.id;
                renderMuezzins();
            }).catch(e => console.error(e));
        });

        previewAudioPlayer.onended = function () {
            currentlyPlayingMuezzinId = null;
            renderMuezzins();
        };
    }

    function selectActiveMuezzin(muezzin) {
        localStorage.setItem('quiblah_selected_muezzin', muezzin.id);
        localStorage.setItem('quiblah_selected_muezzin_url', muezzin.url);
        localStorage.setItem('quiblah_selected_muezzin_name', muezzin.name);

        renderMuezzins();

        if (window.showToast) {
            window.showToast(`تم تعيين ${muezzin.name} كمؤذن معتمد لصلواتك`, 'fa-solid fa-circle-check');
        }
    }

    // ==========================================
    // 4. Adhan Playback Modes (Collapsible)
    // ==========================================
    function initAdhanModes() {
        const modeCards = document.querySelectorAll('.adhan-mode-card');
        const modesCollapsible = document.getElementById('modes-collapsible-wrapper');
        const headerToggle = document.getElementById('adhan-modes-header-toggle');
        const btnToggleModes = document.getElementById('btn-toggle-adhan-modes');
        const activeSummaryText = document.getElementById('active-mode-summary-text');
        const labelToggleModes = document.getElementById('label-toggle-modes');

        const modeTitles = {
            'full': 'أذان كامل بصوت المؤذن المعتمد',
            'takbeer': 'تكبير فقط (تنبيه سريع ومختصر)',
            'silent': 'وضع صامت (تنبيه شاشة بصري)'
        };

        let isModesOpen = false;

        function setModesOpenState(open) {
            isModesOpen = open;
            if (modesCollapsible) modesCollapsible.classList.toggle('open', open);
            if (btnToggleModes) {
                btnToggleModes.classList.toggle('open', open);
                btnToggleModes.setAttribute('aria-expanded', open ? 'true' : 'false');
            }
            if (labelToggleModes) {
                labelToggleModes.textContent = open ? 'إغلاق الخيارات' : 'تغيير الوضع';
            }
        }

        if (headerToggle) {
            headerToggle.addEventListener('click', (e) => {
                setModesOpenState(!isModesOpen);
            });
        }

        if (btnToggleModes) {
            btnToggleModes.addEventListener('click', (e) => {
                e.stopPropagation();
                setModesOpenState(!isModesOpen);
            });
        }

        function updateModeUI(selectedMode) {
            if (activeSummaryText) {
                activeSummaryText.textContent = modeTitles[selectedMode] || modeTitles['full'];
            }

            modeCards.forEach(card => {
                const cardMode = card.getAttribute('data-mode');
                const radioIcon = card.querySelector('.radio-icon');
                if (cardMode === selectedMode) {
                    card.classList.add('active');
                    if (radioIcon) {
                        radioIcon.classList.remove('fa-circle');
                        radioIcon.classList.add('fa-circle-dot');
                    }
                } else {
                    card.classList.remove('active');
                    if (radioIcon) {
                        radioIcon.classList.remove('fa-circle-dot');
                        radioIcon.classList.add('fa-circle');
                    }
                }
            });
        }

        const currentMode = localStorage.getItem('quiblah_adhan_mode') || 'full';
        updateModeUI(currentMode);

        modeCards.forEach(card => {
            card.addEventListener('click', function () {
                const chosenMode = this.getAttribute('data-mode');
                localStorage.setItem('quiblah_adhan_mode', chosenMode);
                updateModeUI(chosenMode);

                // Auto close after selection for convenience
                setModesOpenState(false);

                if (window.showToast) {
                    window.showToast(`تم ضبط وضع الأذان: ${modeTitles[chosenMode] || chosenMode}`, 'fa-solid fa-sliders');
                }
            });
        });
    }

    // ==========================================
    // 5. Extra Settings Accordion (Duaa, Reminders)
    // ==========================================
    function initExtraSettings() {
        const toggleHeader = document.getElementById('btn-toggle-extra-settings');
        const extraCollapsible = document.getElementById('extra-settings-collapsible');
        const btnExtraAction = document.getElementById('btn-extra-settings-action');
        const labelToggleExtra = document.getElementById('label-toggle-extra');

        let isExtraOpen = false;

        function setExtraOpenState(open) {
            isExtraOpen = open;
            if (extraCollapsible) extraCollapsible.classList.toggle('open', open);
            if (btnExtraAction) {
                btnExtraAction.classList.toggle('open', open);
                btnExtraAction.setAttribute('aria-expanded', open ? 'true' : 'false');
            }
            if (labelToggleExtra) {
                labelToggleExtra.textContent = open ? 'إخفاء الإعدادات' : 'عرض الإعدادات';
            }
        }

        if (toggleHeader) {
            toggleHeader.addEventListener('click', () => {
                setExtraOpenState(!isExtraOpen);
            });
        }

        if (btnExtraAction) {
            btnExtraAction.addEventListener('click', (e) => {
                e.stopPropagation();
                setExtraOpenState(!isExtraOpen);
            });
        }
    }

    // ==========================================
    // 5. Post-Adhan Duaa Controller
    // ==========================================
    function initPostAdhanDuaa() {
        const btnCopy = document.getElementById('btn-copy-duaa');
        const btnReadVoice = document.getElementById('btn-read-duaa-voice');
        const duaaTextEl = document.getElementById('post-adhan-duaa-text');
        const toggleAutoDuaa = document.getElementById('toggle-auto-duaa');

        if (toggleAutoDuaa) {
            const savedState = localStorage.getItem('quiblah_auto_duaa_enabled');
            toggleAutoDuaa.checked = savedState !== null ? savedState === 'true' : true;
            toggleAutoDuaa.addEventListener('change', function () {
                localStorage.setItem('quiblah_auto_duaa_enabled', this.checked);
            });
        }

        if (btnCopy && duaaTextEl) {
            btnCopy.addEventListener('click', function () {
                const text = duaaTextEl.textContent.trim();
                navigator.clipboard.writeText(text).then(() => {
                    if (window.showToast) {
                        window.showToast('تم نسخ دعاء ما بعد الأذان بنجاح 🤍', 'fa-solid fa-copy');
                    }
                }).catch(() => {
                    const ta = document.createElement('textarea');
                    ta.value = text;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    if (window.showToast) {
                        window.showToast('تم نسخ دعاء ما بعد الأذان بنجاح 🤍', 'fa-solid fa-copy');
                    }
                });
            });
        }

        if (btnReadVoice && duaaTextEl) {
            btnReadVoice.addEventListener('click', function () {
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const text = duaaTextEl.textContent.trim().replace(/«|»/g, '');
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'ar-SA';
                    utterance.rate = 0.85;

                    const voices = window.speechSynthesis.getVoices();
                    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
                    if (arabicVoice) utterance.voice = arabicVoice;

                    window.speechSynthesis.speak(utterance);
                    if (window.showToast) {
                        window.showToast('جاري قراءة دعاء ما بعد الأذان...', 'fa-solid fa-volume-high');
                    }
                } else {
                    if (window.showToast) {
                        window.showToast('ميزة القراءة الصوتية غير مدعومة في متصفحك.', 'fa-solid fa-triangle-exclamation');
                    }
                }
            });
        }
    }

    // ==========================================
    // 6. Interactive Adhan Screen Overlay
    // ==========================================
    const adhanOverlay = document.getElementById('adhan-screen-backdrop');
    const btnPreviewAdhan = document.getElementById('btn-preview-adhan-screen');
    const btnTestQuickAdhan = document.getElementById('btn-test-quick-adhan');
    const btnCloseAdhan = document.getElementById('btn-close-adhan-screen');
    const btnMuteAdhan = document.getElementById('btn-mute-adhan');
    const btnStopAdhan = document.getElementById('btn-stop-adhan');
    const btnModalShowDuaa = document.getElementById('btn-modal-show-duaa');

    const overlayPrayerTitle = document.getElementById('adhan-screen-prayer-title');
    const overlayCityText = document.getElementById('adhan-screen-city-text');
    const overlayMuezzinName = document.getElementById('adhan-screen-muezzin-name');
    const overlayMuezzinLocation = document.getElementById('adhan-screen-muezzin-location');
    const overlayElapsedTime = document.getElementById('adhan-elapsed-time');
    const iconMuteAdhan = document.getElementById('icon-mute-adhan');
    const labelMuteAdhan = document.getElementById('label-mute-adhan');

    let adhanTimerInterval = null;
    let adhanSecondsElapsed = 0;

    function openAdhanScreen(prayerTitleOverride) {
        if (!adhanOverlay) return;

        // Stop any preview playback
        if (previewAudioPlayer && !previewAudioPlayer.paused) {
            previewAudioPlayer.pause();
            currentlyPlayingMuezzinId = null;
            renderMuezzins();
        }

        const currentMode = localStorage.getItem('quiblah_adhan_mode') || 'full';
        const muezzin = getSelectedMuezzinObj();
        const activeGov = getGovernorateDisplayName();

        // Update Overlay text
        const prayerTitle = prayerTitleOverride || (nextPrayerNameEl ? nextPrayerNameEl.textContent : 'صلاة الظهر');
        if (overlayPrayerTitle) {
            overlayPrayerTitle.textContent = `حَانَ الآنَ مَوْعِدُ ${prayerTitle}`;
        }
        if (overlayCityText) {
            overlayCityText.textContent = `حسب التوقيت المحلي لمحافظة ${activeGov} وضواحيها`;
        }
        const overlayStatusText = document.getElementById('adhan-screen-status-text');
        if (overlayStatusText) {
            overlayStatusText.textContent = `يُرفع الآن الأذان المبارك في ${activeGov}`;
        }
        if (overlayMuezzinName) {
            overlayMuezzinName.textContent = muezzin.title || muezzin.name;
        }
        if (overlayMuezzinLocation) {
            overlayMuezzinLocation.textContent = `بصوت: ${muezzin.name}`;
        }

        // Start playback if mode is not silent
        if (adhanAudioPlayer) {
            adhanAudioPlayer.muted = false;
            updateMuteBtnUI(false);

            if (currentMode !== 'silent') {
                adhanAudioPlayer.src = muezzin.url;
                adhanAudioPlayer.onerror = function () {
                    adhanAudioPlayer.src = muezzin.fallbackUrl || 'assets/Azan/456572.mp3';
                    adhanAudioPlayer.play().catch(() => { });
                };

                adhanAudioPlayer.play().catch(e => {
                    console.warn('[Adhan] Autoplay blocked, falling back to local:', e);
                    adhanAudioPlayer.src = muezzin.fallbackUrl || 'assets/Azan/456572.mp3';
                    adhanAudioPlayer.play().catch(() => { });
                });

                // If mode is takbeer only, schedule stop after 28 seconds
                if (currentMode === 'takbeer') {
                    setTimeout(() => {
                        if (adhanAudioPlayer && !adhanAudioPlayer.paused) {
                            adhanAudioPlayer.pause();
                        }
                    }, 28000);
                }
            }
        }

        // Start elapsed timer
        adhanSecondsElapsed = 0;
        if (overlayElapsedTime) overlayElapsedTime.textContent = '00:00';
        if (adhanTimerInterval) clearInterval(adhanTimerInterval);

        adhanTimerInterval = setInterval(() => {
            adhanSecondsElapsed++;
            const m = Math.floor(adhanSecondsElapsed / 60);
            const s = adhanSecondsElapsed % 60;
            if (overlayElapsedTime) {
                overlayElapsedTime.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            }
        }, 1000);

        adhanOverlay.classList.add('open');
        adhanOverlay.setAttribute('aria-hidden', 'false');
    }

    function closeAdhanScreen() {
        if (!adhanOverlay) return;

        if (adhanAudioPlayer && !adhanAudioPlayer.paused) {
            adhanAudioPlayer.pause();
        }
        if (adhanTimerInterval) {
            clearInterval(adhanTimerInterval);
        }

        adhanOverlay.classList.remove('open');
        adhanOverlay.setAttribute('aria-hidden', 'true');
    }

    function updateMuteBtnUI(isMuted) {
        if (!iconMuteAdhan || !labelMuteAdhan) return;
        if (isMuted) {
            iconMuteAdhan.className = 'fa-solid fa-volume-xmark';
            labelMuteAdhan.textContent = 'إلغاء الكتم';
        } else {
            iconMuteAdhan.className = 'fa-solid fa-volume-high';
            labelMuteAdhan.textContent = 'كتم الصوت';
        }
    }

    function initAdhanScreenOverlay() {
        if (btnPreviewAdhan) {
            btnPreviewAdhan.addEventListener('click', () => openAdhanScreen());
        }

        if (btnTestQuickAdhan) {
            btnTestQuickAdhan.addEventListener('click', () => openAdhanScreen('الأذان التجريبي'));
        }

        if (btnCloseAdhan) {
            btnCloseAdhan.addEventListener('click', closeAdhanScreen);
        }

        if (btnStopAdhan) {
            btnStopAdhan.addEventListener('click', closeAdhanScreen);
        }

        if (btnMuteAdhan && adhanAudioPlayer) {
            btnMuteAdhan.addEventListener('click', function () {
                adhanAudioPlayer.muted = !adhanAudioPlayer.muted;
                updateMuteBtnUI(adhanAudioPlayer.muted);
            });
        }

        if (btnModalShowDuaa) {
            btnModalShowDuaa.addEventListener('click', function () {
                closeAdhanScreen();
                const duaaCard = document.getElementById('post-adhan-duaa-card');
                if (duaaCard) {
                    duaaCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    duaaCard.style.boxShadow = '0 0 25px rgba(197, 168, 89, 0.6)';
                    setTimeout(() => {
                        duaaCard.style.boxShadow = '';
                    }, 2500);
                }
            });
        }

        // Close on backdrop click outside card
        if (adhanOverlay) {
            adhanOverlay.addEventListener('click', function (e) {
                if (e.target === adhanOverlay) {
                    closeAdhanScreen();
                }
            });
        }
    }

    // ==========================================
    // 7. Periodic Islamic Reminders Integration
    // ==========================================
    function initPeriodicReminders() {
        const enableToggle = document.getElementById('page-enable-toggle');
        const statusBadge = document.getElementById('page-status-badge');
        const soundToggle = document.getElementById('page-sound-toggle');
        const intervalDropdown = document.getElementById('page-interval-dropdown');
        const intervalTrigger = document.getElementById('interval-dropdown-trigger');
        const intervalLabel = document.getElementById('interval-dropdown-label');
        const intervalItems = intervalDropdown ? intervalDropdown.querySelectorAll('.dropdown-luxury-item') : [];
        const btnSendTest = document.getElementById('page-btn-send-test');
        const btnPreviewSound = document.getElementById('page-btn-preview-sound');
        const salawatAudio = document.getElementById('salawat-audio-player');

        const typeSalawat = document.getElementById('page-type-salawat');
        const typeAdhkar = document.getElementById('page-type-adhkar');
        const typeQuran = document.getElementById('page-type-quran');
        const typeIstighfar = document.getElementById('page-type-istighfar');

        const intervalLabelsMap = {
            '5': 'كل 5 دقائق (الموصى به)',
            '15': 'كل 15 دقيقة',
            '30': 'كل 30 دقيقة',
            '60': 'كل ساعة (60 دقيقة)'
        };

        function syncPageUI() {
            if (!window.IslamicReminders) return;
            const settings = window.IslamicReminders.getSettings();

            if (enableToggle) enableToggle.checked = !!settings.enabled;
            if (soundToggle) soundToggle.checked = !!settings.sound;

            if (statusBadge) {
                if (settings.enabled) {
                    statusBadge.textContent = `مفعّل (كل ${settings.interval || 5} دقائق)`;
                    statusBadge.classList.add('active');
                } else {
                    statusBadge.textContent = 'غير مفعّل';
                    statusBadge.classList.remove('active');
                }
            }

            // Dropdown label
            const currentVal = String(settings.interval || 5);
            if (intervalLabel) intervalLabel.textContent = intervalLabelsMap[currentVal] || intervalLabelsMap['5'];
            intervalItems.forEach(item => {
                if (item.getAttribute('data-value') === currentVal) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Types
            if (typeSalawat) typeSalawat.checked = !!settings.types.salawat;
            if (typeAdhkar) typeAdhkar.checked = !!settings.types.adhkar;
            if (typeQuran) typeQuran.checked = !!settings.types.quran;
            if (typeIstighfar) typeIstighfar.checked = !!settings.types.istighfar;
        }

        // Dropdown Toggle
        if (intervalTrigger && intervalDropdown) {
            intervalTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                intervalDropdown.classList.toggle('open');
            });

            document.addEventListener('click', () => {
                intervalDropdown.classList.remove('open');
            });

            // Select Interval
            intervalItems.forEach(item => {
                item.addEventListener('click', function () {
                    const val = parseInt(this.getAttribute('data-value'), 10);
                    intervalDropdown.classList.remove('open');
                    if (window.IslamicReminders) {
                        const settings = window.IslamicReminders.getSettings();
                        settings.interval = val;
                        localStorage.setItem('quiblah_islamic_reminders', JSON.stringify(settings));
                        syncPageUI();
                        if (settings.enabled) {
                            fetch('./api/push/subscribe').catch(() => { });
                        }
                    }
                });
            });
        }

        // Master Enable Toggle
        if (enableToggle) {
            enableToggle.addEventListener('change', async function () {
                const wantEnabled = this.checked;
                if (!window.IslamicReminders) return;

                if (wantEnabled) {
                    const ok = await window.IslamicReminders.enable();
                    if (!ok) {
                        this.checked = false;
                    }
                } else {
                    window.IslamicReminders.disable();
                }
                syncPageUI();
            });
        }

        // Sound Toggle
        if (soundToggle) {
            soundToggle.addEventListener('change', function () {
                if (window.IslamicReminders) {
                    const settings = window.IslamicReminders.getSettings();
                    settings.sound = this.checked;
                    localStorage.setItem('quiblah_islamic_reminders', JSON.stringify(settings));
                }
            });
        }

        // Type Checkboxes
        [
            { el: typeSalawat, key: 'salawat' },
            { el: typeAdhkar, key: 'adhkar' },
            { el: typeQuran, key: 'quran' },
            { el: typeIstighfar, key: 'istighfar' }
        ].forEach(({ el, key }) => {
            if (el) {
                el.addEventListener('change', function () {
                    if (window.IslamicReminders) {
                        const settings = window.IslamicReminders.getSettings();
                        settings.types[key] = this.checked;
                        localStorage.setItem('quiblah_islamic_reminders', JSON.stringify(settings));
                    }
                });
            }
        });

        // Test Push Button
        if (btnSendTest) {
            btnSendTest.addEventListener('click', async () => {
                const remindersApi = window.IslamicReminders || (window.top && window.top.IslamicReminders);
                if (remindersApi && remindersApi.sendTestNotification) {
                    await remindersApi.sendTestNotification();
                } else {
                    if (window.showToast) {
                        window.showToast('جاري إرسال إشعار الصلاة على النبي ﷺ...', 'fa-solid fa-bell');
                    }
                    try {
                        const audio = new Audio('assets/salawat.mp3');
                        audio.play().catch(() => {});
                    } catch (e) {}
                }
            });
        }

        // Preview Salawat Sound
        if (btnPreviewSound && salawatAudio) {
            btnPreviewSound.addEventListener('click', () => {
                salawatAudio.currentTime = 0;
                salawatAudio.play().catch(e => {
                    console.log('Salawat preview blocked:', e);
                });
            });
        }

        // Initial sync
        setTimeout(syncPageUI, 300);
    }

    // ==========================================
    // 8. Initialization Lifecycle
    // ==========================================
    function initAll() {
        initCitySelector();
        renderMuezzins();
        initAdhanModes();
        initExtraSettings();
        initPostAdhanDuaa();
        initAdhanScreenOverlay();
        initPeriodicReminders();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

})();
