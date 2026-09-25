// features/quran/quran.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© quran.html
// Header Carousel Logic
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 8000);

        // Sidebar Mobile Toggle
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menu-btn');
        const overlay = document.getElementById('sidebar-overlay');
        
        function toggleSidebar() {
            const isOpen = sidebar.classList.toggle('open');
            overlay.classList.toggle('active', isOpen);
            document.body.classList.toggle('sidebar-opened', isOpen);
        }

        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
        overlay.addEventListener('click', toggleSidebar);

        // API Integration
        let allSurahs = [];
        let currentSurahNumber = null;

        const surahListEl = document.getElementById('surah-list');
        const searchInput = document.getElementById('search-input');
        const contentContainer = document.getElementById('content-container');
        const readerArea = document.getElementById('reader-area');
        const mobileTitle = document.getElementById('mobile-title');

        // --- Reading Settings & Appearance Management (إعدادات القراءة والمظهر والخط) ---
        const READING_MODE_STORAGE_KEY = 'quiblah_quran_reading_mode';
        const FONT_SIZE_STORAGE_KEY = 'quiblah_quran_font_size';
        const THEME_STORAGE_KEY = 'quiblah_quran_theme';

        let currentReadingMode = localStorage.getItem(READING_MODE_STORAGE_KEY) || 'pages';
        if (currentReadingMode !== 'pages' && currentReadingMode !== 'continuous') {
            currentReadingMode = 'pages';
        }

        let currentQuranFontSize = parseInt(localStorage.getItem(FONT_SIZE_STORAGE_KEY)) || 32;
        if (isNaN(currentQuranFontSize) || currentQuranFontSize < 20 || currentQuranFontSize > 54) {
            currentQuranFontSize = 32;
        }

        const VALID_THEMES = ['carousel', 'black-gold', 'paper-light', 'dark-static'];
        let currentQuranTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'carousel';
        if (!VALID_THEMES.includes(currentQuranTheme)) {
            currentQuranTheme = 'carousel';
        }

        function getReadingMode() {
            return currentReadingMode;
        }

        function setReadingMode(mode, userInitiated = true) {
            if (mode !== 'pages' && mode !== 'continuous') mode = 'pages';
            currentReadingMode = mode;
            try {
                localStorage.setItem(READING_MODE_STORAGE_KEY, mode);
            } catch(e) {
                console.warn("Failed to save reading mode:", e);
            }
            updateModeSwitcherUI();

            if (userInitiated) {
                const label = mode === 'pages' ? 'تصفح بالصفحات' : 'التمرير المستمر';
                if (typeof showToast === 'function') {
                    showToast(`تم ضبط طريقة العرض: ${label}`, 'fa-solid fa-sliders');
                }

                if (mode === 'pages') {
                    const page = currentVisiblePage || (currentSurahNumber ? getStartPageForSurah(currentSurahNumber) : 1);
                    loadMushafPage(page);
                } else {
                    if (currentSurahNumber) {
                        loadSurah(currentSurahNumber);
                    } else if (currentVisiblePage) {
                        let sNum = 1;
                        if (window.QURAN_PAGES_MAP && window.QURAN_PAGES_MAP[currentVisiblePage]) {
                            sNum = window.QURAN_PAGES_MAP[currentVisiblePage][1][0][0];
                        }
                        loadSurah(sNum);
                    }
                }
            }
        }

        function updateModeSwitcherUI() {
            // Update landing cards if present
            const landingPages = document.getElementById('landing-card-pages');
            const landingCont = document.getElementById('landing-card-continuous');
            if (landingPages) {
                landingPages.classList.toggle('is-selected', currentReadingMode === 'pages');
                const icon = landingPages.querySelector('.landing-card-radio i');
                if (icon) {
                    icon.className = currentReadingMode === 'pages' ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
                }
            }
            if (landingCont) {
                landingCont.classList.toggle('is-selected', currentReadingMode === 'continuous');
                const icon = landingCont.querySelector('.landing-card-radio i');
                if (icon) {
                    icon.className = currentReadingMode === 'continuous' ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
                }
            }

            // Update modal pills if present
            const pillPages = document.getElementById('modal-pill-pages');
            const pillCont = document.getElementById('modal-pill-continuous');
            if (pillPages) {
                pillPages.classList.toggle('active', currentReadingMode === 'pages');
            }
            if (pillCont) {
                pillCont.classList.toggle('active', currentReadingMode === 'continuous');
            }
        }

        // --- Font Size Logic ---
        function applyQuranFontSize(size, save = true) {
            size = Math.max(18, Math.min(60, parseInt(size) || 32));
            currentQuranFontSize = size;
            document.documentElement.style.setProperty('--quran-font-size', `${size}px`);

            const lh = size >= 40 ? '3.0' : (size >= 30 ? '2.8' : '2.5');
            document.documentElement.style.setProperty('--quran-line-height', lh);

            if (save) {
                try { localStorage.setItem(FONT_SIZE_STORAGE_KEY, size.toString()); } catch(e){}
            }

            const fontInput = document.getElementById('quran-font-input');
            if (fontInput && document.activeElement !== fontInput) {
                fontInput.value = size;
            }

            const previewAyah = document.getElementById('font-preview-ayah');
            if (previewAyah) {
                previewAyah.style.fontSize = `${size}px`;
                previewAyah.style.lineHeight = lh;
            }
        }

        function adjustQuranFontSize(delta) {
            applyQuranFontSize(currentQuranFontSize + delta, true);
        }

        function onQuranFontSizeInput(val) {
            applyQuranFontSize(val, true);
        }

        // --- Theme & Senior Comfort Backgrounds Logic ---
        function applyQuranTheme(theme, save = true) {
            if (!VALID_THEMES.includes(theme)) theme = 'carousel';
            currentQuranTheme = theme;

            VALID_THEMES.forEach(t => document.body.classList.remove(`theme-${t}`));
            document.body.classList.add(`theme-${theme}`);

            if (save) {
                try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch(e){}
            }

            document.querySelectorAll('.theme-card').forEach(card => {
                card.classList.remove('active');
            });
            const activeCard = document.getElementById(`theme-card-${theme}`);
            if (activeCard) activeCard.classList.add('active');

            if (save && typeof showToast === 'function') {
                const names = {
                    'carousel': 'خلفيات متحركة دورية',
                    'black-gold': 'أسود ملكي وذهبي (مريح للعين)',
                    'paper-light': 'ورقي كلاسيكي (أبيض وأسود)',
                    'dark-static': 'رمادي داكن هادئ'
                };
                showToast(`تم تطبيق المظهر: ${names[theme] || theme}`, 'fa-solid fa-palette');
            }
        }

        function setQuranTheme(theme) {
            applyQuranTheme(theme, true);
        }

        // --- Settings Modal Open / Close / Reset ---
        function openQuranSettingsModal() {
            const backdrop = document.getElementById('settings-modal-backdrop');
            if (!backdrop) return;

            applyQuranFontSize(currentQuranFontSize, false);
            applyQuranTheme(currentQuranTheme, false);
            updateModeSwitcherUI();

            backdrop.classList.add('show');
        }

        function closeQuranSettingsModal() {
            const backdrop = document.getElementById('settings-modal-backdrop');
            if (backdrop) backdrop.classList.remove('show');
        }

        function resetQuranSettings() {
            applyQuranFontSize(32, true);
            setQuranTheme('carousel');
            setReadingMode('pages', true);
            if (typeof showToast === 'function') {
                showToast('تمت استعادة الإعدادات الافتراضية', 'fa-solid fa-rotate-left');
            }
        }

        // --- Bookmark Management (علامة القراءة وموضع التوقف) ---
        const BOOKMARK_STORAGE_KEY = 'quiblah_quran_bookmark';

        function escapeQuotes(str) {
            if (!str) return '';
            return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        function formatTimeAgo(timestamp) {
            if (!timestamp) return '';
            const diff = Math.floor((Date.now() - timestamp) / 1000);
            if (diff < 60) return 'منذ لحظات';
            if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
            if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
            const days = Math.floor(diff / 86400);
            if (days === 1) return 'أمس';
            if (days < 30) return `منذ ${days} يوم`;
            return 'منذ فترة';
        }

        function getQuranBookmark() {
            try {
                const raw = localStorage.getItem(BOOKMARK_STORAGE_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch(e) {
                console.warn("Failed to read quran bookmark:", e);
                return null;
            }
        }

        function saveQuranBookmark(surahNumber, ayahNumber, surahName, ayahText) {
            try {
                const snippet = (ayahText || '').trim().replace(/\s+/g, ' ').substring(0, 140);
                const resolvedSurahName = surahName || (allSurahs.find(s => s.number === parseInt(surahNumber))?.name || `سورة ${surahNumber}`);
                const pageNumber = (window.QURAN_AYAH_PAGE_MAP && window.QURAN_AYAH_PAGE_MAP[`${surahNumber}:${ayahNumber}`]) || getPageForAyah(parseInt(surahNumber), parseInt(ayahNumber));
                const bookmark = {
                    surahNumber: parseInt(surahNumber),
                    ayahNumber: parseInt(ayahNumber),
                    pageNumber: pageNumber,
                    surahName: resolvedSurahName,
                    ayahSnippet: snippet,
                    timestamp: Date.now()
                };
                localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmark));
                updateTopbarBookmarkUI();
                renderSurahBookmarkTags();
                return bookmark;
            } catch(e) {
                console.warn("Failed to save quran bookmark:", e);
                return null;
            }
        }

        function clearQuranBookmark() {
            try {
                localStorage.removeItem(BOOKMARK_STORAGE_KEY);
                updateTopbarBookmarkUI();
                renderSurahBookmarkTags();
                document.querySelectorAll('.ayah-unit.is-bookmarked').forEach(el => el.classList.remove('is-bookmarked'));
                document.querySelectorAll('.ayah-bookmark-btn.is-bookmarked').forEach(btn => {
                    btn.classList.remove('is-bookmarked');
                    btn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
                    btn.title = 'وضع علامة قراءة عند هذه الآية';
                });
                document.querySelectorAll('.bookmark-ribbon-tag').forEach(tag => tag.remove());
                updateModalBookmarkState();
            } catch(e) {
                console.warn("Failed to clear quran bookmark:", e);
            }
        }

        function isAyahBookmarked(surahNumber, ayahNumber) {
            const bm = getQuranBookmark();
            return bm && bm.surahNumber === parseInt(surahNumber) && bm.ayahNumber === parseInt(ayahNumber);
        }

        function toggleAyahBookmark(surahNumber, ayahNumber, surahName, ayahText, event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            const surahId = parseInt(surahNumber);
            const ayahId = parseInt(ayahNumber);
            const currentBm = getQuranBookmark();

            if (currentBm && currentBm.surahNumber === surahId && currentBm.ayahNumber === ayahId) {
                clearQuranBookmark();
                if (typeof showToast === 'function') {
                    showToast('تمت إزالة علامة القراءة', 'fa-solid fa-bookmark');
                }
            } else {
                if (!ayahText) {
                    const unitEl = document.getElementById(`ayah-unit-${surahId}-${ayahId}`);
                    if (unitEl) {
                        const verseSpan = unitEl.querySelector('.verse');
                        if (verseSpan) ayahText = verseSpan.innerText;
                    }
                }
                const saved = saveQuranBookmark(surahId, ayahId, surahName, ayahText);
                
                if (currentSurahNumber === surahId) {
                    document.querySelectorAll('.ayah-unit.is-bookmarked').forEach(el => el.classList.remove('is-bookmarked'));
                    document.querySelectorAll('.ayah-bookmark-btn.is-bookmarked').forEach(btn => {
                        btn.classList.remove('is-bookmarked');
                        btn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
                        btn.title = 'وضع علامة قراءة عند هذه الآية';
                    });
                    document.querySelectorAll('.bookmark-ribbon-tag').forEach(tag => tag.remove());

                    const newUnit = document.getElementById(`ayah-unit-${surahId}-${ayahId}`);
                    if (newUnit) {
                        newUnit.classList.add('is-bookmarked');
                        const btn = newUnit.querySelector('.ayah-bookmark-btn');
                        if (btn) {
                            btn.classList.add('is-bookmarked');
                            btn.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
                            btn.title = 'إزالة علامة القراءة';
                        }
                        const actionsWrap = newUnit.querySelector('.ayah-actions-wrap');
                        if (actionsWrap && !actionsWrap.querySelector('.bookmark-ribbon-tag')) {
                            const tag = document.createElement('span');
                            tag.className = 'bookmark-ribbon-tag';
                            tag.innerHTML = '<i class="fa-solid fa-bookmark"></i> موضع توقفك';
                            actionsWrap.prepend(tag);
                        }
                    }
                }

                updateModalBookmarkState();
                if (typeof showToast === 'function') {
                    const sName = (saved && saved.surahName) ? saved.surahName : `سورة ${surahId}`;
                    showToast(`تم حفظ علامة القراءة: ${sName} - آية (${ayahId})`, 'fa-solid fa-bookmark');
                }
            }
        }

        function scrollToAyah(ayahNumber, highlight = true) {
            const unitEl = document.getElementById(`ayah-unit-${currentSurahNumber}-${ayahNumber}`);
            if (unitEl) {
                unitEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (highlight) {
                    unitEl.classList.remove('pulse-focus');
                    void unitEl.offsetWidth; // force reflow
                    unitEl.classList.add('pulse-focus');
                    setTimeout(() => {
                        unitEl.classList.remove('pulse-focus');
                    }, 3000);
                }
            }
        }

        function updateTopbarBookmarkUI() {
            const btn = document.getElementById('topbar-bookmark-btn');
            if (!btn) return;
            const bm = getQuranBookmark();
            const label = btn.querySelector('.bookmark-btn-text');
            const dropdown = document.getElementById('bookmark-hover-dropdown');
            const wrap = document.getElementById('topbar-bookmark-wrap');

            // Prevent native browser tooltip from overlaying the dropdown
            btn.removeAttribute('title');
            btn.title = '';

            if (wrap && !wrap.dataset.bound) {
                wrap.dataset.bound = 'true';

                // Click / Tap toggle: opens and stays open until dismissed
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    wrap.classList.toggle('is-open');
                });

                // Desktop mouse hover support
                wrap.addEventListener('mouseenter', () => {
                    wrap.classList.add('is-open');
                });
                wrap.addEventListener('mouseleave', () => {
                    wrap.classList.remove('is-open');
                });

                // Dismiss if clicked or tapped outside
                document.addEventListener('click', (e) => {
                    if (!wrap.contains(e.target)) {
                        wrap.classList.remove('is-open');
                    }
                });

                document.addEventListener('touchstart', (e) => {
                    if (!wrap.contains(e.target)) {
                        wrap.classList.remove('is-open');
                    }
                }, { passive: true });
            }

            if (bm) {
                btn.classList.add('has-bookmark');
                const sNameClean = bm.surahName.replace(/^سُورَةُ\s+|^سورة\s+/, '');
                if (label) {
                    label.textContent = `${sNameClean} (${bm.ayahNumber})`;
                }

                if (dropdown) {
                    const timeAgo = formatTimeAgo(bm.timestamp);
                    dropdown.innerHTML = `
                        <div class="bm-dropdown-header">
                            <span class="bm-dropdown-tag"><i class="fa-solid fa-bookmark"></i> آخر موضع قراءة محفوظ</span>
                            <button type="button" class="bm-dropdown-del-btn" onclick="clearQuranBookmark(); event.stopPropagation();" title="حذف علامة القراءة">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        <div class="bm-dropdown-surah">${escapeHtml(bm.surahName)}</div>
                        ${bm.ayahSnippet ? `<div class="bm-dropdown-ayah-text">« ${escapeHtml(bm.ayahSnippet)} »</div>` : ''}
                        <div class="bm-dropdown-meta">
                            <span><i class="fa-solid fa-feather-pointed"></i> الآية رقم (${bm.ayahNumber})</span>
                            ${timeAgo ? `<span><i class="fa-regular fa-clock"></i> تم الحفظ: ${timeAgo}</span>` : ''}
                        </div>
                        <button type="button" class="bm-dropdown-go-btn" onclick="handleTopbarBookmarkClick(); event.stopPropagation();">
                            <i class="fa-solid fa-book-open-reader"></i>
                            <span>متابعة القراءة من الآية (${bm.ayahNumber})</span>
                        </button>
                    `;
                }
            } else {
                btn.classList.remove('has-bookmark');
                if (label) {
                    label.textContent = 'علامة القراءة';
                }

                if (dropdown) {
                    dropdown.innerHTML = `
                        <div class="bm-dropdown-empty">
                            <i class="fa-solid fa-bookmark bm-empty-gold-icon"></i>
                            <div class="bm-empty-title">لا توجد علامة قراءة محفوظة</div>
                            <div class="bm-empty-desc">اضغط على أيقونة <i class="fa-solid fa-bookmark" style="color: var(--gold); font-size: 11px; margin: 0 3px;"></i> بجانب أي آية أثناء التلاوة لحفظ موضع توقفك.</div>
                        </div>
                    `;
                }
            }
        }

        function handleTopbarBookmarkClick() {
            const bm = getQuranBookmark();
            if (!bm) {
                return;
            }

            const wrap = document.getElementById('topbar-bookmark-wrap');
            if (wrap) wrap.classList.remove('is-open');

            if (currentReadingMode === 'pages') {
                const targetPage = bm.pageNumber || (window.QURAN_AYAH_PAGE_MAP && window.QURAN_AYAH_PAGE_MAP[`${bm.surahNumber}:${bm.ayahNumber}`]) || getPageForAyah(bm.surahNumber, bm.ayahNumber);
                if (currentVisiblePage === targetPage) {
                    scrollToAyah(bm.ayahNumber, true);
                } else {
                    loadMushafPage(targetPage, bm.ayahNumber);
                }
            } else {
                if (currentSurahNumber === bm.surahNumber) {
                    scrollToAyah(bm.ayahNumber, true);
                } else {
                    loadSurah(bm.surahNumber, bm.ayahNumber);
                }
            }
        }

        function renderSurahBookmarkTags() {
            const bm = getQuranBookmark();
            document.querySelectorAll('.surah-item').forEach(item => {
                const id = parseInt(item.getAttribute('data-id'));
                const nameEl = item.querySelector('.surah-name');
                if (!nameEl) return;
                
                const existingTag = nameEl.querySelector('.surah-bm-tag');
                if (existingTag) existingTag.remove();
                
                if (bm && bm.surahNumber === id) {
                    const tag = document.createElement('span');
                    tag.className = 'surah-bm-tag';
                    tag.title = `علامة قراءة عند الآية ${bm.ayahNumber}`;
                    tag.innerHTML = `<i class="fa-solid fa-bookmark"></i> آية ${bm.ayahNumber}`;
                    nameEl.appendChild(tag);
                }
            });
        }

        // Fetch All Surahs (with Instant Local Cache & Multi-tier Fallback)
        function fetchSurahs() {
            // 1. Instant local metadata (0ms load guaranteed, works offline)
            if (window.QURAN_SURAHS_DATA && window.QURAN_SURAHS_DATA.length > 0) {
                allSurahs = window.QURAN_SURAHS_DATA;
                renderSurahList(allSurahs);
                return;
            }

            if (window.QURAN_FULL_DATA) {
                allSurahs = Object.values(window.QURAN_FULL_DATA).map(s => ({
                    number: s.number,
                    name: s.name,
                    englishName: s.englishName,
                    revelationType: s.revelationType,
                    numberOfAyahs: s.numberOfAyahs
                }));
                renderSurahList(allSurahs);
                return;
            }

            const cachedIndex = localStorage.getItem('quiblah_surah_index');
            if (cachedIndex) {
                try {
                    allSurahs = JSON.parse(cachedIndex);
                    renderSurahList(allSurahs);
                    return;
                } catch(e) {
                    localStorage.removeItem('quiblah_surah_index');
                }
            }

            fetchWithTimeout('https://api.alquran.cloud/v1/surah', 6000)
                .then(response => {
                    allSurahs = response.data;
                    try { localStorage.setItem('quiblah_surah_index', JSON.stringify(allSurahs)); } catch(e){}
                    renderSurahList(allSurahs);
                })
                .catch(error => {
                    console.warn("Alquran API surah list failed, trying Quran.com API...", error);
                    fetchWithTimeout('https://api.quran.com/api/v4/chapters?language=ar', 6000)
                        .then(r2 => {
                            allSurahs = r2.chapters.map(c => ({
                                number: c.id,
                                name: c.name_arabic,
                                englishName: c.name_simple,
                                revelationType: c.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
                                numberOfAyahs: c.verses_count
                            }));
                            renderSurahList(allSurahs);
                        })
                        .catch(() => {
                            if (window.QURAN_SURAHS_DATA) {
                                allSurahs = window.QURAN_SURAHS_DATA;
                                renderSurahList(allSurahs);
                            } else {
                                surahListEl.innerHTML = `
                                    <div style="text-align: center; padding: 25px; color: var(--gold);">
                                        <p style="margin-bottom: 12px; font-size: 14px;">تعذر تحميل قائمة السور</p>
                                        <button type="button" onclick="fetchSurahs()" style="cursor: pointer; border: 1px solid var(--gold); color: var(--gold); background: rgba(0,0,0,0.4); padding: 7px 18px; border-radius: 20px; font-family: inherit; font-size: 13px; font-weight: 700;">
                                            <i class="fa-solid fa-rotate-right"></i> إعادة المحاولة
                                        </button>
                                    </div>
                                `;
                            }
                        });
                });
        }

        // Render Sidebar List
        function renderSurahList(surahs) {
            if (surahs.length === 0) {
                surahListEl.innerHTML = `<div style="text-align:center; padding: 20px; color:#aaa;">لا توجد نتائج</div>`;
                return;
            }

            const bm = getQuranBookmark();
            let html = '';
            surahs.forEach(surah => {
                const isActive = (currentSurahNumber && surah.number === currentSurahNumber) ? 'active' : '';
                const isBookmarked = (bm && bm.surahNumber === surah.number);
                const bookmarkBadge = isBookmarked ? `<span class="surah-bm-tag" title="علامة قراءة عند الآية ${bm.ayahNumber}"><i class="fa-solid fa-bookmark"></i> آية ${bm.ayahNumber}</span>` : '';
                const startPage = getStartPageForSurah(surah.number);
                html += `
                    <div class="surah-item ${isActive}" data-id="${surah.number}">
                        <div class="surah-number">${surah.number}</div>
                        <div class="surah-details">
                            <div class="surah-name">${surah.name} ${bookmarkBadge}</div>
                            <div class="surah-info">
                                <span>${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                                <span class="info-sep">•</span>
                                <span>آياتها ${surah.numberOfAyahs}</span>
                                <span class="info-sep">•</span>
                                <span class="surah-page-label">ص ${startPage}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            surahListEl.innerHTML = html;

            // Add click events
            document.querySelectorAll('.surah-item').forEach(item => {
                item.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    currentSurahNumber = id;
                    // Update active class
                    document.querySelectorAll('.surah-item').forEach(el => el.classList.remove('active'));
                    this.classList.add('active');
                    
                    if (currentReadingMode === 'pages') {
                        const startPage = getStartPageForSurah(id);
                        loadMushafPage(startPage);
                    } else {
                        loadSurah(id);
                    }
                    
                    // Close sidebar on mobile
                    if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
                        toggleSidebar();
                    }
                });
            });
        }

        // --- Arabic Search Normalization Helper ---
        function normalizeArabicSearch(text) {
            if (!text) return "";
            return String(text)
                .replace(/^\uFEFF/, '')
                .replace(/و\u0670/g, 'ا')
                .replace(/\u0670/g, 'ا')
                .replace(/[\u064B-\u065F\u06D6-\u06ED]/g, '')
                .replace(/[\u0671إأآٱا]/g, 'ا')
                .replace(/[ةه]/g, 'ه')
                .replace(/[ىي\u06CC]/g, 'ي')
                .replace(/ؤ/g, 'و')
                .replace(/ئ/g, 'ي')
                .replace(/ء/g, '')
                .replace(/[\u0640]/g, '')
                .replace(/[^\u0621-\u064A0-9\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();
        }

        function matchesArabicSearch(targetText, queryText) {
            if (!targetText || !queryText) return false;
            const nTarget = normalizeArabicSearch(targetText);
            const nQuery = normalizeArabicSearch(queryText);
            if (!nQuery) return false;

            if (nTarget.includes(nQuery)) return true;

            const noAlefTarget = nTarget.replace(/ا/g, '');
            const noAlefQuery = nQuery.replace(/ا/g, '');
            if (noAlefQuery.length >= 2 && noAlefTarget.includes(noAlefQuery)) return true;

            return false;
        }

        // Search filtering
        searchInput.addEventListener('input', (e) => {
            const rawQuery = e.target.value.trim();
            if (!rawQuery) {
                renderSurahList(allSurahs);
                return;
            }
            const normalizedDigits = rawQuery.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
            const qLower = rawQuery.toLowerCase();
            const filtered = allSurahs.filter(s => 
                s.number.toString() === normalizedDigits ||
                matchesArabicSearch(s.name, rawQuery) ||
                (s.englishName && s.englishName.toLowerCase().includes(qLower))
            );
            renderSurahList(filtered);
        });

        // Resilient Helper: fetch with timeout using native fetch (independent of CDN/axios)
        async function fetchWithTimeout(url, timeoutMs = 6000) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(timer);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.json();
            } catch(e) {
                clearTimeout(timer);
                throw e;
            }
        }

        // Multi-tier Quran Surah Fetcher:
        // Tier 1: Al-Quran Cloud (Uthmani)
        // Tier 2: Quran.com API v4 (Official Cloudflare high-availability)
        // Tier 3: jsdelivr mirror
        async function smartFetchSurah(id, surahMeta) {
            // Tier 1: Al-Quran Cloud
            try {
                const json = await fetchWithTimeout(`https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`, 6000);
                if (json && json.data && json.data.ayahs && json.data.ayahs.length > 0) {
                    return json.data;
                }
            } catch(err1) {
                console.warn(`Tier 1 (alquran.cloud) failed for surah ${id}:`, err1.message);
            }

            // Tier 2: Quran.com API v4
            try {
                const json2 = await fetchWithTimeout(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${id}`, 6500);
                if (json2 && json2.verses && json2.verses.length > 0) {
                    return {
                        number: id,
                        name: surahMeta ? surahMeta.name : `سورة ${id}`,
                        englishName: surahMeta ? surahMeta.englishName : `Surah ${id}`,
                        revelationType: surahMeta ? surahMeta.revelationType : 'Meccan',
                        numberOfAyahs: json2.verses.length,
                        ayahs: json2.verses.map((v, idx) => ({
                            number: v.id || idx + 1,
                            numberInSurah: idx + 1,
                            text: v.text_uthmani
                        }))
                    };
                }
            } catch(err2) {
                console.warn(`Tier 2 (quran.com) failed for surah ${id}:`, err2.message);
            }

            // Tier 3: jsdelivr mirror
            try {
                const json3 = await fetchWithTimeout(`https://cdn.jsdelivr.net/gh/risan/quran-json@main/data/surahs/${id}.json`, 6500);
                if (json3 && json3.verses && json3.verses.length > 0) {
                    return {
                        number: id,
                        name: json3.name || (surahMeta ? surahMeta.name : `سورة ${id}`),
                        englishName: json3.transliteration || (surahMeta ? surahMeta.englishName : `Surah ${id}`),
                        revelationType: json3.type || (surahMeta ? surahMeta.revelationType : 'Meccan'),
                        numberOfAyahs: json3.total_verses || json3.verses.length,
                        ayahs: json3.verses.map((v, idx) => ({
                            number: v.id || idx + 1,
                            numberInSurah: v.id || idx + 1,
                            text: v.text
                        }))
                    };
                }
            } catch(err3) {
                console.warn(`Tier 3 (jsdelivr mirror) failed for surah ${id}:`, err3.message);
            }

            throw new Error("جميع خوادم القرآن غير متاحة حالياً");
        }

        // Load Specific Surah Content (with instant caching & multi-tier resilience)
        async function loadSurah(id, targetAyah = null) {
            if (currentReadingMode === 'pages') {
                const targetPage = targetAyah ? getPageForAyah(id, targetAyah) : getStartPageForSurah(id);
                loadMushafPage(targetPage, targetAyah);
                return;
            }

            currentSurahNumber = id;
            readerArea.scrollTop = 0;

            // Sync active state in sidebar
            document.querySelectorAll('.surah-item').forEach(el => {
                if (parseInt(el.getAttribute('data-id')) === id) {
                    el.classList.add('active');
                    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else {
                    el.classList.remove('active');
                }
            });

            // Close sidebar on mobile if open
            if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
                toggleSidebar();
            }

            const surahMeta = (allSurahs && allSurahs.find(s => s.number === id)) || 
                              (window.QURAN_SURAHS_DATA && window.QURAN_SURAHS_DATA.find(s => s.number === id));

            // 0. Full local Quran data (all 114 surahs, 0ms instant load, 100% offline!)
            if (window.QURAN_FULL_DATA && window.QURAN_FULL_DATA[id]) {
                renderSurahView(window.QURAN_FULL_DATA[id], targetAyah);
                return;
            }

            // 1. Built-in initial cache (e.g. Al-Fatihah, 0ms instant load!)
            if (window.SURAHS_INITIAL_CACHE && window.SURAHS_INITIAL_CACHE[id]) {
                renderSurahView(window.SURAHS_INITIAL_CACHE[id], targetAyah);
                return;
            }

            const cacheKey = 'quiblah_surah_uthmani_' + id;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    const data = JSON.parse(cachedData);
                    renderSurahView(data, targetAyah);
                    return;
                } catch(e) {
                    localStorage.removeItem(cacheKey);
                }
            }

            contentContainer.innerHTML = `
                <div class="loader-container">
                    <i aria-hidden="true" class="fa-solid fa-spinner fa-spin fa-3x"></i>
                    <p>جاري تحميل آيات سورة ${surahMeta ? surahMeta.name : id}...</p>
                </div>
            `;

            try {
                const data = await smartFetchSurah(id, surahMeta);
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                } catch(e) {
                    console.warn("Storage full", e);
                }
                renderSurahView(data, targetAyah);
            } catch(error) {
                contentContainer.innerHTML = `
                    <div class="error-message" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(197,168,89,0.3); border-radius: 16px; padding: 25px; text-align: center; max-width: 500px; margin: 40px auto;">
                        <i class="fa-solid fa-circle-exclamation fa-2x" style="color: var(--gold); margin-bottom: 12px;"></i>
                        <p style="color: #fff; font-size: 15px; margin-bottom: 15px;">تعذر تحميل آيات السورة حالياً. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.</p>
                        <button onclick="loadSurah(${id}, ${targetAyah || 'null'})" style="cursor: pointer; border: 1px solid var(--gold); color: var(--gold); background: rgba(0,0,0,0.4); padding: 8px 20px; border-radius: 20px; font-family: inherit; font-size: 13.5px; font-weight: 700; transition: all 0.2s;">
                            <i class="fa-solid fa-rotate-right"></i> إعادة المحاولة الآن
                        </button>
                    </div>
                `;
                console.error("Error fetching surah content:", error);
            }
        }

        // State for infinite scroll & mushaf page tracking
        let loadedSurahIds = [];
        let isLoadingNextSurah = false;
        let currentVisiblePage = 1;
        let currentVisibleJuz = 1;

        // Get start page for any surah
        function getStartPageForSurah(surahNum) {
            const sNum = parseInt(surahNum);
            if (window.QURAN_SURAH_PAGES) {
                const found = window.QURAN_SURAH_PAGES.find(s => s.num === sNum);
                if (found) return found.page;
            }
            if (window.QURAN_AYAH_PAGE_MAP && window.QURAN_AYAH_PAGE_MAP[`${sNum}:1`]) {
                return window.QURAN_AYAH_PAGE_MAP[`${sNum}:1`];
            }
            return 1;
        }

        // Calculate page for any ayah using accurate Medina Mushaf map
        function getPageForAyah(surahNum, ayahNum) {
            const sNum = parseInt(surahNum);
            const aNum = parseInt(ayahNum);
            if (window.QURAN_AYAH_PAGE_MAP && window.QURAN_AYAH_PAGE_MAP[`${sNum}:${aNum}`]) {
                return window.QURAN_AYAH_PAGE_MAP[`${sNum}:${aNum}`];
            }

            const pages = window.QURAN_SURAH_PAGES;
            if (!pages) return 1;
            const currentSurah = pages.find(s => s.num === sNum);
            if (!currentSurah) return 1;
            if (sNum === 114) return 604;

            const nextSurah = pages.find(s => s.num === sNum + 1);
            const startPage = currentSurah.page;
            const endPage = nextSurah ? Math.max(startPage, nextSurah.page - 1) : 604;

            if (startPage === endPage) return startPage;

            const meta = window.QURAN_SURAHS_DATA ? window.QURAN_SURAHS_DATA.find(s => s.number === sNum) : null;
            const totalAyahs = (meta && meta.numberOfAyahs) ? meta.numberOfAyahs : 1;

            const ratio = Math.max(0, Math.min(1, (aNum - 1) / totalAyahs));
            const estimatedPage = Math.floor(startPage + ratio * (endPage - startPage + 1));
            return Math.min(endPage, Math.max(startPage, estimatedPage));
        }

        // Jump directly to any mushaf page
        function jumpToMushafPage(val) {
            const pageNum = parseInt(val);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 604) {
                loadMushafPage(pageNum);
            } else {
                if (typeof showToast === 'function') {
                    showToast('يرجى إدخال رقم صفحة صحيح بين 1 و 604', 'fa-solid fa-circle-exclamation');
                }
            }
        }

        // Calculate juz for any mushaf page using QURAN_JUZ_DATA
        function getJuzForPage(page) {
            const juzList = window.QURAN_JUZ_DATA;
            if (!juzList) return 1;
            for (let i = 0; i < juzList.length; i++) {
                if (page >= juzList[i].start && page <= juzList[i].end) {
                    return juzList[i].juz;
                }
            }
            return 1;
        }

        // Update Mushaf Page Badge in Header
        function updateCurrentMushafPageUI(pageNum) {
            currentVisiblePage = pageNum;
            currentVisibleJuz = getJuzForPage(pageNum);

            const badge = document.getElementById('mushaf-page-badge');
            const textEl = document.getElementById('mushaf-page-text');
            if (badge && textEl) {
                badge.style.display = 'inline-flex';
                textEl.textContent = `ص ${pageNum} • الجزء ${currentVisibleJuz}`;
            }
        }

        // Sync with Khatmah Tracker Button Handler
        function handleSyncKhatmahClick() {
            const page = currentVisiblePage || 1;
            const btn = document.getElementById('topbar-khatmah-btn');

            if (btn) {
                btn.classList.add('synced');
                setTimeout(() => btn.classList.remove('synced'), 700);
            }

            const STORAGE_KEY = 'quiblah_khatmah_v1';
            let khatmahData = {};
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) khatmahData = JSON.parse(raw);
            } catch(e) {}

            khatmahData.currentPage = page;
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(khatmahData));
            } catch(e) {}

            if (navigator && typeof navigator.vibrate === 'function') {
                try { navigator.vibrate(20); } catch(e) {}
            }

            if (typeof showToast === 'function') {
                showToast(`تم تحديث موضعك في الختمة إلى صفحة ${page} بنجاح`, 'fa-solid fa-bookmark');
            }
        }

        function renderSurahPickerLanding() {
            currentSurahNumber = null;
            loadedSurahIds = [];
            const badge = document.getElementById('mushaf-page-badge');
            if (badge) badge.style.display = 'none';

            if (mobileTitle) {
                mobileTitle.innerHTML = `<i class="fa-solid fa-book-quran"></i> <span>القرآن الكريم</span>`;
            }

            const isPages = currentReadingMode === 'pages';

            contentContainer.innerHTML = `
                <div class="surah-picker-landing">
                    <div class="picker-icon-box">
                        <i class="fa-solid fa-book-quran"></i>
                    </div>
                    <div class="picker-ayah-quote">« وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا »</div>
                    <h2 class="picker-main-title">اختر السورة المباركة للبدء في القراءة</h2>
                    <p class="picker-subtext">تصفح فهرس سور القرآن الكريم (114 سورة) واقرأ آيات الذكر الحكيم برسم المصحف العثماني الشريف</p>
                    
                    <!-- Reading Mode Choice Cards on Landing -->
                    <div class="landing-mode-selector-wrap">
                        <div class="landing-mode-title">
                            <i class="fa-solid fa-sliders"></i>
                            <span>طريقة عرض وترتيب المصحف المفضلة لديك:</span>
                        </div>
                        <div class="landing-mode-cards-grid">
                            <div class="landing-mode-card ${isPages ? 'is-selected' : ''}" id="landing-card-pages" onclick="setReadingMode('pages')">
                                <div class="landing-card-top">
                                    <div class="landing-card-title-group">
                                        <i class="fa-solid fa-book-open landing-card-pure-icon"></i>
                                        <strong class="landing-card-name">تصفح بالصفحات</strong>
                                        <span class="landing-card-badge">الافتراضي</span>
                                    </div>
                                    <div class="landing-card-radio">
                                        <i class="${isPages ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
                                    </div>
                                </div>
                                <div class="landing-card-desc">عرض المصحف الحقيقي صفحة بصفحة (604 صفحات) مع تنقل سهل يميناً ويساراً</div>
                            </div>
                            <div class="landing-mode-card ${!isPages ? 'is-selected' : ''}" id="landing-card-continuous" onclick="setReadingMode('continuous')">
                                <div class="landing-card-top">
                                    <div class="landing-card-title-group">
                                        <i class="fa-solid fa-arrows-up-down landing-card-pure-icon"></i>
                                        <strong class="landing-card-name">تمرير مستمر</strong>
                                    </div>
                                    <div class="landing-card-radio">
                                        <i class="${!isPages ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
                                    </div>
                                </div>
                                <div class="landing-card-desc">تتابع السور تلقائياً مع تحميل السورة التالية عند التمرير لأسفل دون تقطيع</div>
                            </div>
                        </div>
                    </div>

                    <button type="button" class="open-surah-drawer-btn" onclick="toggleSidebar()">
                        <i class="fa-solid fa-list-ul"></i>
                        <span>فتح قائمة السور (114 سورة)</span>
                    </button>
                </div>
            `;
            updateTopbarBookmarkUI();
            updateModeSwitcherUI();
        }

        function buildSurahSectionHtml(data, isFirst = false) {
            const bm = getQuranBookmark();
            let html = `
                <div class="single-surah-block" id="surah-block-${data.number}" data-surah="${data.number}">
                    <div class="surah-header-card compact-header" id="surah-header-${data.number}">
                        <div class="surah-header-row">
                            <div class="surah-header-actions-side">
                                <a href="tafseer.html?surah=${data.number}" class="header-action-link" title="تفسير السورة">
                                    <i class="fa-solid fa-book-open-reader"></i> <span>تفسير السورة</span>
                                </a>
                                <button type="button" onclick="playSurahGlobalAudio(${data.number}, '${escapeQuotes(data.name)}')" class="header-action-link" title="استمع للسورة">
                                    <i class="fa-solid fa-circle-play"></i> <span>استمع</span>
                                </button>
                            </div>
                            <div class="surah-header-center-info">
                                <h1 class="surah-title">${data.name}</h1>
                                <div class="surah-meta">
                                    <span>${data.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                                    <span class="meta-dot">•</span>
                                    <span>آياتها: ${data.numberOfAyahs}</span>
                                </div>
                            </div>
                            <div class="surah-header-side-placeholder"></div>
                        </div>
                    </div>
            `;

            // Add Bismillah for all surahs except Fatihah (1) and Tawbah (9)
            if (data.number !== 1 && data.number !== 9) {
                html += `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
            }

            html += `<div class="verses-container">`;

            data.ayahs.forEach((ayah, index) => {
                let text = (ayah.text || '').replace(/^\ufeff/, '');
                if (data.number !== 1 && index === 0) {
                    text = text.replace(/^[\ufeff]?بّ?ِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/, '');
                }

                const isBookmarked = (bm && bm.surahNumber === data.number && bm.ayahNumber === ayah.numberInSurah);
                const ayahPage = getPageForAyah(data.number, ayah.numberInSurah);
                const ayahJuz = getJuzForPage(ayahPage);

                html += `
                    <span class="ayah-unit ${isBookmarked ? 'is-bookmarked' : ''}" id="ayah-unit-${data.number}-${ayah.numberInSurah}" data-surah="${data.number}" data-ayah="${ayah.numberInSurah}" data-page="${ayahPage}" data-juz="${ayahJuz}">
                        <span class="verse">${text}</span>
                        <span class="ayah-actions-wrap">
                            ${isBookmarked ? '<span class="bookmark-ribbon-tag"><i class="fa-solid fa-bookmark"></i> موضع توقفك</span>' : ''}
                            <span class="verse-number" onclick="showQuickTafseer(${data.number}, ${ayah.numberInSurah})" title="تفسير الآية (${ayah.numberInSurah})">${ayah.numberInSurah}</span>
                            <button type="button" class="ayah-bookmark-btn ${isBookmarked ? 'is-bookmarked' : ''}" onclick="toggleAyahBookmark(${data.number}, ${ayah.numberInSurah}, '${escapeQuotes(data.name)}', ${ayahPage}, event)" title="${isBookmarked ? 'إزالة علامة القراءة' : 'وضع علامة قراءة عند هذه الآية'}">
                                <i class="${isBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}"></i>
                            </button>
                        </span>
                    </span>
                `;
            });

            const nextNum = data.number < 114 ? data.number + 1 : null;

            html += `
                        <!-- Pure Golden Typography Navigation Links -->
                        <div class="surah-end-actions" id="surah-end-${data.number}">
                            <div class="surah-end-stars">✦ &nbsp; ✦ &nbsp; ✦</div>
                            <div class="surah-end-links-row">
                                ${nextNum ? `
                                    <a href="javascript:void(0)" class="surah-gold-link next-surah-link" onclick="loadSurah(${nextNum})" title="الانتقال إلى السورة التالية">
                                        <i class="fa-solid fa-chevron-left"></i>
                                        <span>الانتقال إلى السورة التالية</span>
                                    </a>
                                ` : ''}

                                <a href="javascript:void(0)" class="surah-gold-link catalog-surah-link" onclick="toggleSidebar()" title="عرض قائمة وفهرس سور القرآن الكريم كاملة">
                                    <i class="fa-solid fa-list-ul"></i>
                                    <span>عرض قائمة السور</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            return html;
        }

        function renderSurahView(data, targetAyah = null) {
            currentSurahNumber = data.number;
            loadedSurahIds = [data.number];
            if (mobileTitle) mobileTitle.innerText = data.name;

            const surahHtml = buildSurahSectionHtml(data, true);

            const sentinelHtml = (currentReadingMode === 'continuous') ? `
                <div id="infinite-scroll-sentinel" class="infinite-loading-indicator" style="display: none;">
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <span>جاري تحضير السورة التالية...</span>
                </div>
            ` : '';

            const footerHtml = `
                <div id="quran-footer" style="text-align: center; padding: 20px; margin-top: 40px; color: rgba(255,255,255,0.7); font-size: 14px; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; box-sizing: border-box; line-height: 1.6;">
                    جميع الحقوق محفوظة &copy; 2026 - قبلة المسلم <br>
                    تم التطوير بواسطة <strong style="color: var(--gold);">كمال أبو عيد</strong>
                </div>
            `;

            contentContainer.innerHTML = surahHtml + sentinelHtml + footerHtml;
            updateTopbarBookmarkUI();

            const initialPage = getPageForAyah(data.number, targetAyah || 1);
            updateCurrentMushafPageUI(initialPage);

            if (targetAyah) {
                setTimeout(() => {
                    scrollToAyah(targetAyah, true);
                }, 150);
            }
        }

        // =========================================================================
        // Medina Mushaf Page-by-Page Reading Mode (تصفح صفحات مصحف المدينة المنورة 1-604)
        // =========================================================================
        async function loadMushafPage(pageNum, targetAyah = null) {
            pageNum = Math.max(1, Math.min(604, parseInt(pageNum) || 1));
            currentVisiblePage = pageNum;
            readerArea.scrollTop = 0;

            try {
                localStorage.setItem('quiblah_last_page', pageNum);
            } catch(e) {}

            const pageInfo = (window.QURAN_PAGES_MAP && window.QURAN_PAGES_MAP[pageNum]) || null;
            const juzNum = pageInfo ? pageInfo[0] : getJuzForPage(pageNum);
            const ranges = pageInfo ? pageInfo[1] : []; // array of [surahNum, startAyah, endAyah]

            if (!ranges || ranges.length === 0) {
                let sNum = 1;
                if (window.QURAN_SURAH_PAGES) {
                    for (let i = 0; i < window.QURAN_SURAH_PAGES.length; i++) {
                        if (window.QURAN_SURAH_PAGES[i].page <= pageNum) sNum = window.QURAN_SURAH_PAGES[i].num;
                        else break;
                    }
                }
                ranges.push([sNum, 1, 10]);
            }

            const primarySurahNum = ranges[0][0];
            currentSurahNumber = primarySurahNum;
            loadedSurahIds = [primarySurahNum];

            // Sync active state in sidebar
            document.querySelectorAll('.surah-item').forEach(el => {
                if (parseInt(el.getAttribute('data-id')) === primarySurahNum) {
                    el.classList.add('active');
                    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else {
                    el.classList.remove('active');
                }
            });

            // Close sidebar on mobile
            if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
                toggleSidebar();
            }

            updateCurrentMushafPageUI(pageNum);

            const primaryMeta = (allSurahs && allSurahs.find(s => s.number === primarySurahNum)) || 
                                (window.QURAN_SURAHS_DATA && window.QURAN_SURAHS_DATA.find(s => s.number === primarySurahNum));
            if (mobileTitle) {
                mobileTitle.innerHTML = `<i class="fa-solid fa-book-open"></i> <span>${primaryMeta ? primaryMeta.name : 'سورة ' + primarySurahNum} (ص ${pageNum})</span>`;
            }

            // Ensure full surah data is ready for all ranges on this page
            for (const r of ranges) {
                const sId = r[0];
                if (!window.QURAN_FULL_DATA || !window.QURAN_FULL_DATA[sId]) {
                    try {
                        const fetched = await smartFetchSurah(sId);
                        if (!window.QURAN_FULL_DATA) window.QURAN_FULL_DATA = {};
                        window.QURAN_FULL_DATA[sId] = fetched;
                    } catch(err) {
                        console.error(`Failed to fetch surah ${sId} for page ${pageNum}:`, err);
                    }
                }
            }

            const bm = getQuranBookmark();
            let pageHtml = `<div class="mushaf-page-wrapper" id="mushaf-page-${pageNum}" data-page="${pageNum}">`;

            // Process each surah range on this page
            ranges.forEach((range, rIdx) => {
                const sNum = range[0];
                const startAyah = range[1];
                const endAyah = range[2];

                const sMeta = (allSurahs && allSurahs.find(s => s.number === sNum)) || 
                              (window.QURAN_SURAHS_DATA && window.QURAN_SURAHS_DATA.find(s => s.number === sNum)) ||
                              { name: `سورة ${sNum}`, numberOfAyahs: endAyah, revelationType: 'Meccan' };

                const fullSurah = (window.QURAN_FULL_DATA && window.QURAN_FULL_DATA[sNum]) || 
                                  (window.SURAHS_INITIAL_CACHE && window.SURAHS_INITIAL_CACHE[sNum]);

                // If this is the first ayah of the surah, render compact Surah Header + Bismillah
                if (startAyah === 1) {
                    pageHtml += `
                        <div class="surah-header-card compact-header" id="surah-header-${sNum}">
                            <div class="surah-header-row">
                                <div class="surah-header-actions-side">
                                    <a href="tafseer.html?surah=${sNum}" class="header-action-link" title="تفسير ${escapeHtml(sMeta.name)}">
                                        <i class="fa-solid fa-book-open-reader"></i> <span>تفسير السورة</span>
                                    </a>
                                    <button type="button" onclick="playSurahGlobalAudio(${sNum}, '${escapeQuotes(sMeta.name)}')" class="header-action-link" title="استمع للسورة">
                                        <i class="fa-solid fa-circle-play"></i> <span>استمع</span>
                                    </button>
                                </div>
                                <div class="surah-header-center-info">
                                    <h1 class="surah-title">${sMeta.name}</h1>
                                    <div class="surah-meta">
                                        <span>${sMeta.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                                        <span class="meta-dot">•</span>
                                        <span>آياتها: ${sMeta.numberOfAyahs}</span>
                                    </div>
                                </div>
                                <div class="surah-header-side-placeholder"></div>
                            </div>
                        </div>
                    `;

                    if (sNum !== 1 && sNum !== 9) {
                        pageHtml += `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
                    }
                } else if (rIdx === 0) {
                    // Page continues an existing surah: render thin, graceful mushaf page header
                    pageHtml += `
                        <div class="mushaf-page-mini-header">
                            <div class="page-mini-actions">
                                <a href="tafseer.html?surah=${sNum}" class="header-action-link mini-link" title="تفسير ${escapeHtml(sMeta.name)}">
                                    <i class="fa-solid fa-book-open-reader"></i> <span>تفسير</span>
                                </a>
                                <button type="button" onclick="playSurahGlobalAudio(${sNum}, '${escapeQuotes(sMeta.name)}')" class="header-action-link mini-link" title="استمع للسورة">
                                    <i class="fa-solid fa-circle-play"></i> <span>استمع</span>
                                </button>
                            </div>
                            <div class="page-mini-center">
                                <span class="page-mini-surah">${sMeta.name}</span>
                                <span class="page-mini-sep">•</span>
                                <span class="page-mini-juz">الجزء ${juzNum}</span>
                            </div>
                            <div class="page-mini-tag">
                                <span>ص ${pageNum}</span>
                            </div>
                        </div>
                    `;
                }

                pageHtml += `<div class="verses-container mushaf-page-verses">`;

                if (fullSurah && fullSurah.ayahs) {
                    for (let aNum = startAyah; aNum <= endAyah; aNum++) {
                        const ayahObj = fullSurah.ayahs.find(a => a.numberInSurah === aNum) || fullSurah.ayahs[aNum - 1];
                        if (!ayahObj) continue;

                        let text = (ayahObj.text || '').replace(/^\ufeff/, '');
                        if (sNum !== 1 && aNum === 1) {
                            text = text.replace(/^[\ufeff]?بّ?ِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/, '');
                        }

                        const isBookmarked = (bm && bm.surahNumber === sNum && bm.ayahNumber === aNum);

                        pageHtml += `
                            <span class="ayah-unit ${isBookmarked ? 'is-bookmarked' : ''}" id="ayah-unit-${sNum}-${aNum}" data-surah="${sNum}" data-ayah="${aNum}" data-page="${pageNum}" data-juz="${juzNum}">
                                <span class="verse">${text}</span>
                                <span class="ayah-actions-wrap">
                                    ${isBookmarked ? '<span class="bookmark-ribbon-tag"><i class="fa-solid fa-bookmark"></i> موضع توقفك</span>' : ''}
                                    <span class="verse-number" onclick="showQuickTafseer(${sNum}, ${aNum})" title="تفسير الآية (${aNum})">${aNum}</span>
                                    <button type="button" class="ayah-bookmark-btn ${isBookmarked ? 'is-bookmarked' : ''}" onclick="toggleAyahBookmark(${sNum}, ${aNum}, '${escapeQuotes(sMeta.name)}', ${pageNum}, event)" title="${isBookmarked ? 'إزالة علامة القراءة' : 'وضع علامة قراءة عند هذه الآية'}">
                                        <i class="${isBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}"></i>
                                    </button>
                                </span>
                            </span>
                        `;
                    }
                }

                pageHtml += `</div>`; // closes verses-container


            });

            // Mushaf Page Bottom Navigation
            const prevP = pageNum > 1 ? pageNum - 1 : null;
            const nextP = pageNum < 604 ? pageNum + 1 : null;

            pageHtml += `
                <div class="mushaf-page-navigation" id="mushaf-page-navigation" role="navigation" aria-label="تنقل صفحات المصحف">
                    <button type="button" class="page-nav-btn prev-page-btn" ${!prevP ? 'disabled' : `onclick="loadMushafPage(${prevP})"`} title="${prevP ? `الانتقال إلى صفحة ${prevP}` : 'أول صفحة في المصحف'}">
                        <i class="fa-solid fa-chevron-right"></i>
                        <span class="nav-btn-text">${prevP ? `صفحة ${prevP}` : 'بداية المصحف'}</span>
                    </button>

                    <div class="page-nav-center-info">
                        <div class="page-nav-title">صفحة <strong>${pageNum}</strong> من <strong>604</strong></div>
                        <div class="page-nav-sub">
                            <span>الجزء ${juzNum}</span>
                        </div>
                    </div>

                    <button type="button" class="page-nav-btn next-page-btn" ${!nextP ? 'disabled' : `onclick="loadMushafPage(${nextP})"`} title="${nextP ? `الانتقال إلى صفحة ${nextP}` : 'آخر صفحة في المصحف'}">
                        <span class="nav-btn-text">${nextP ? `صفحة ${nextP}` : 'نهاية المصحف'}</span>
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                </div>

                <!-- Quick Page Jump Bar -->
                <div class="mushaf-quick-jump-strip">
                    <span class="jump-label"><i class="fa-solid fa-compass"></i> انتقل لصفحة:</span>
                    <div class="jump-input-wrap">
                        <input type="number" id="quick-page-input" min="1" max="604" value="${pageNum}" onkeydown="if(event.key==='Enter') jumpToMushafPage(this.value)" placeholder="1 - 604" aria-label="رقم صفحة المصحف">
                        <button type="button" class="jump-submit-btn" onclick="jumpToMushafPage(document.getElementById('quick-page-input').value)">
                            <span>انتقال</span> <i class="fa-solid fa-arrow-left"></i>
                        </button>
                    </div>
                </div>

                <!-- Desktop Floating Edge Arrows -->
                <div class="mushaf-floating-nav">
                    ${prevP ? `
                        <button type="button" class="floating-page-arrow floating-prev" onclick="loadMushafPage(${prevP})" title="الصفحة السابقة (ص ${prevP})">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    ` : ''}
                    ${nextP ? `
                        <button type="button" class="floating-page-arrow floating-next" onclick="loadMushafPage(${nextP})" title="الصفحة التالية (ص ${nextP})">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                    ` : ''}
                </div>
            `;

            pageHtml += `</div>`; // closes mushaf-page-wrapper

            const footerHtml = `
                <div id="quran-footer" style="text-align: center; padding: 20px; margin-top: 30px; color: rgba(255,255,255,0.7); font-size: 14px; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; box-sizing: border-box; line-height: 1.6;">
                    جميع الحقوق محفوظة &copy; 2026 - قبلة المسلم <br>
                    تم التطوير بواسطة <strong style="color: var(--gold);">كمال أبو عيد</strong>
                </div>
            `;

            contentContainer.innerHTML = pageHtml + footerHtml;
            updateTopbarBookmarkUI();

            history.replaceState(null, '', `?page=${pageNum}`);

            if (targetAyah) {
                setTimeout(() => {
                    scrollToAyah(targetAyah, true);
                }, 120);
            }
        }

        async function loadNextSurahInInfiniteScroll() {
            if (isLoadingNextSurah || loadedSurahIds.length === 0) return;
            const maxLoaded = Math.max(...loadedSurahIds);
            if (maxLoaded >= 114) return;

            const nextId = maxLoaded + 1;
            isLoadingNextSurah = true;

            const sentinel = document.getElementById('infinite-scroll-sentinel');
            if (sentinel) sentinel.style.display = 'flex';

            try {
                let nextData = null;
                if (window.QURAN_FULL_DATA && window.QURAN_FULL_DATA[nextId]) {
                    nextData = window.QURAN_FULL_DATA[nextId];
                } else if (window.SURAHS_INITIAL_CACHE && window.SURAHS_INITIAL_CACHE[nextId]) {
                    nextData = window.SURAHS_INITIAL_CACHE[nextId];
                } else {
                    const surahMeta = (allSurahs && allSurahs.find(s => s.number === nextId)) || 
                                      (window.QURAN_SURAHS_DATA && window.QURAN_SURAHS_DATA.find(s => s.number === nextId));
                    nextData = await smartFetchSurah(nextId, surahMeta);
                }

                if (nextData && sentinel && sentinel.parentNode) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'infinite-surah-break';
                    wrapper.innerHTML = buildSurahSectionHtml(nextData, false);
                    sentinel.parentNode.insertBefore(wrapper, sentinel);
                    loadedSurahIds.push(nextId);
                }
            } catch(e) {
                console.warn("Failed to load next surah in infinite scroll:", e);
            } finally {
                if (sentinel) sentinel.style.display = 'none';
                isLoadingNextSurah = false;
            }
        }

        // Scroll listener on readerArea for infinite scroll and active mushaf page tracker
        let scrollTimer = null;
        if (readerArea) {
            readerArea.addEventListener('scroll', () => {
                if (scrollTimer) return;
                scrollTimer = setTimeout(() => {
                    scrollTimer = null;
                    onReaderAreaScrolled();
                }, 75);
            }, { passive: true });
        }

        function onReaderAreaScrolled() {
            if (!loadedSurahIds || loadedSurahIds.length === 0) return;

            // 1. Infinite scroll check (ONLY when continuous mode is active!)
            if (currentReadingMode === 'continuous') {
                const scrollBottom = readerArea.scrollTop + readerArea.clientHeight;
                if (scrollBottom >= readerArea.scrollHeight - 650) {
                    loadNextSurahInInfiniteScroll();
                }
            }

            // 2. Track current visible ayah and page
            const readerRect = readerArea.getBoundingClientRect();
            const targetY = readerRect.top + 160;
            const targetEl = document.elementFromPoint(readerRect.left + readerRect.width / 2, targetY);
            const ayahEl = targetEl ? targetEl.closest('.ayah-unit') : null;

            if (ayahEl) {
                const surahId = parseInt(ayahEl.getAttribute('data-surah'));
                const pageNum = parseInt(ayahEl.getAttribute('data-page'));

                if (pageNum) {
                    updateCurrentMushafPageUI(pageNum);
                }

                if (surahId && surahId !== currentSurahNumber) {
                    currentSurahNumber = surahId;
                    const surahObj = (allSurahs && allSurahs.find(s => s.number === surahId)) ||
                                     (window.QURAN_SURAHS_DATA && window.QURAN_SURAHS_DATA.find(s => s.number === surahId));
                    const name = surahObj ? surahObj.name : `سورة ${surahId}`;
                    if (mobileTitle) mobileTitle.innerText = name;

                    document.querySelectorAll('.surah-item').forEach(el => {
                        if (parseInt(el.getAttribute('data-id')) === surahId) {
                            el.classList.add('active');
                        } else {
                            el.classList.remove('active');
                        }
                    });

                    history.replaceState(null, '', `?surah=${surahId}`);
                }
            }
        }

        // --- Quick Tafseer Modal Logic & Multi-Source Support ---
        const TAFSEER_CONFIG = {
            'ar.muyassar': { name: 'التفسير الميسر', source: 'alquran', identifier: 'ar.muyassar' },
            'ar-tafseer-al-saddi': { name: 'تفسير السعدي', source: 'spa5k', slug: 'ar-tafseer-al-saddi' },
            'ar-tafsir-al-mukhtasar': { name: 'المختصر في التفسير', source: 'spa5k', slug: 'ar-tafsir-al-mukhtasar' },
            'ar.waseet': { name: 'التفسير الوسيط (طنطاوي)', source: 'alquran', identifier: 'ar.waseet' },
            'ar-tafsir-ibn-kathir': { name: 'تفسير ابن كثير', source: 'spa5k', slug: 'ar-tafsir-ibn-kathir' },
            'ar.baghawi': { name: 'تفسير البغوي', source: 'alquran', identifier: 'ar.baghawi' },
            'ar.qurtubi': { name: 'تفسير القرطبي', source: 'alquran', identifier: 'ar.qurtubi' },
            'ar-tafsir-al-tabari': { name: 'تفسير الطبري', source: 'spa5k', slug: 'ar-tafsir-al-tabari' },
            'ar.jalalayn': { name: 'تفسير الجلالين', source: 'alquran', identifier: 'ar.jalalayn' },
            'fath-al-qadir-al-shawkani': { name: 'فتح القدير (الشوكاني)', source: 'spa5k', slug: 'fath-al-qadir-al-shawkani' },
            'ar.miqbas': { name: 'تنوير المقباس (ابن عباس)', source: 'alquran', identifier: 'ar.miqbas' },
            'i-rab-al-quran-li-al-darwish': { name: 'إعراب القرآن وبيانه (درويش)', source: 'spa5k', slug: 'i-rab-al-quran-li-al-darwish' }
        };

        let currentQuickSurah = 1;
        let currentQuickAyah = 1;
        let currentQuickEdition = localStorage.getItem('quiblah_selected_tafseer') || 'ar.muyassar';
        const quickTafseerCache = {};

        function showQuickTafseer(surahNum, ayahNum) {
            currentQuickSurah = surahNum;
            currentQuickAyah = ayahNum;

            const modalBackdrop = document.getElementById('tafseer-modal-backdrop');
            const selectEl = document.getElementById('quick-tafseer-select');

            if (!TAFSEER_CONFIG[currentQuickEdition]) {
                currentQuickEdition = 'ar.muyassar';
            }

            if (selectEl) {
                selectEl.value = currentQuickEdition;
            }

            syncCustomTafseerUI(currentQuickEdition);

            updateModalBookmarkState();
            modalBackdrop.classList.add('show');
            loadQuickTafseerContent(surahNum, ayahNum, currentQuickEdition);
        }

        function updateModalBookmarkState() {
            const modalBtn = document.getElementById('modal-bookmark-btn');
            if (!modalBtn) return;
            const isBm = isAyahBookmarked(currentQuickSurah, currentQuickAyah);
            if (isBm) {
                modalBtn.classList.add('is-bookmarked');
                modalBtn.innerHTML = '<i class="fa-solid fa-bookmark"></i> <span id="modal-bookmark-text">علامة قراءة محفوظة (إلغاء)</span>';
                modalBtn.title = 'إزالة علامة القراءة';
            } else {
                modalBtn.classList.remove('is-bookmarked');
                modalBtn.innerHTML = '<i class="fa-regular fa-bookmark"></i> <span id="modal-bookmark-text">حفظ كعلامة قراءة</span>';
                modalBtn.title = 'حفظ هذه الآية كعلامة قراءة';
            }
        }

        function toggleBookmarkFromModal() {
            const modalAyahText = document.getElementById('modal-ayah-text');
            const ayahText = modalAyahText ? modalAyahText.innerText : '';
            const surahMeta = (allSurahs && allSurahs.find(s => s.number === currentQuickSurah)) ||
                              (window.QURAN_SURAHS_DATA && window.QURAN_SURAHS_DATA.find(s => s.number === currentQuickSurah));
            const surahName = surahMeta ? surahMeta.name : `سورة ${currentQuickSurah}`;
            toggleAyahBookmark(currentQuickSurah, currentQuickAyah, surahName, ayahText);
        }

        async function loadQuickTafseerContent(surahNum, ayahNum, edition) {
            const modalAyahText = document.getElementById('modal-ayah-text');
            const modalTafseerText = document.getElementById('modal-tafseer-text');
            const modalTitle = document.getElementById('modal-title');
            const modalFullLink = document.getElementById('modal-full-link');

            const editionConfig = TAFSEER_CONFIG[edition] || TAFSEER_CONFIG['ar.muyassar'];

            modalTitle.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> آية (${ayahNum})`;
            modalTafseerText.innerHTML = `<div style="text-align:center; padding:15px; color:var(--gold);"><i class="fa-solid fa-spinner fa-spin"></i> جاري جلب ${editionConfig.name}...</div>`;
            modalFullLink.href = `tafseer.html?surah=${surahNum}&ayah=${ayahNum}&tafseer=${edition}`;

            try {
                // محاولة جلب نص الآية واسم السورة فوراً من المصحف المخزن محلياً أوفلاين
                const localSurah = window.QURAN_FULL_DATA && window.QURAN_FULL_DATA[surahNum];
                if (localSurah) {
                    const localAyah = localSurah.ayahs && localSurah.ayahs.find(a => (a.numberInSurah === ayahNum || a.number === ayahNum));
                    if (localAyah) {
                        modalAyahText.innerText = localAyah.text;
                        modalAyahText.setAttribute('data-loaded-text', localAyah.text);
                        modalAyahText.setAttribute('data-ayah-id', `${surahNum}:${ayahNum}`);
                        modalTitle.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> ${localSurah.name} - آية (${ayahNum})`;
                    }
                }

                if (editionConfig.source === 'spa5k') {
                    // 1. Get Ayah text if not already loaded
                    let ayahText = modalAyahText.getAttribute('data-loaded-text');
                    if (!ayahText || modalAyahText.getAttribute('data-ayah-id') !== `${surahNum}:${ayahNum}`) {
                        try {
                            modalAyahText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
                            const qRes = await fetchWithTimeout(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/editions/quran-uthmani`, 4000);
                            const qData = (qRes.data && qRes.data[0]) ? qRes.data[0] : qRes.data;
                            ayahText = qData.text;
                            modalAyahText.innerText = ayahText;
                            modalAyahText.setAttribute('data-loaded-text', ayahText);
                            modalAyahText.setAttribute('data-ayah-id', `${surahNum}:${ayahNum}`);
                            modalTitle.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> ${qData.surah ? qData.surah.name : ''} - آية (${ayahNum})`;
                        } catch(e) {}
                    }

                    // 2. Fetch Tafsir array (cached per surah)
                    const cKey = `${editionConfig.slug}_${surahNum}`;
                    let rawAyahs = quickTafseerCache[cKey];
                    if (!rawAyahs) {
                        const spa5kUrl = `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${editionConfig.slug}/${surahNum}.json`;
                        const spaRes = await fetchWithTimeout(spa5kUrl, 8000);
                        rawAyahs = Array.isArray(spaRes) ? spaRes : (spaRes.ayahs || spaRes.data || []);
                        quickTafseerCache[cKey] = rawAyahs;
                    }

                    const matched = rawAyahs.find(item => item && item.ayah === ayahNum) || rawAyahs[ayahNum - 1];
                    modalTafseerText.innerText = (matched && matched.text) ? matched.text : 'لا يتوفر تفسير لهذه الآية في هذه الطبعة';
                } else {
                    // alquran.cloud source
                    const url = `https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/editions/quran-uthmani,${editionConfig.identifier}`;
                    const res = await fetchWithTimeout(url, 7000);
                    const editions = res.data;
                    const quranAyah = editions.find(e => e.edition.identifier === 'quran-uthmani') || editions[0];
                    const tafseerAyah = editions.find(e => e.edition.identifier === editionConfig.identifier) || editions[1];

                    modalTitle.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> ${quranAyah.surah ? quranAyah.surah.name : (localSurah ? localSurah.name : '')} - آية (${ayahNum})`;
                    modalAyahText.innerText = quranAyah.text;
                    modalAyahText.setAttribute('data-loaded-text', quranAyah.text);
                    modalAyahText.setAttribute('data-ayah-id', `${surahNum}:${ayahNum}`);
                    modalTafseerText.innerText = tafseerAyah ? tafseerAyah.text : 'لا يتوفر تفسير لهذه الآية';
                }
            } catch(err) {
                console.warn("Quick tafseer error:", err);
                modalTafseerText.innerHTML = `
                    <div style="text-align: center; padding: 15px; color: #f87171;">
                        <p style="margin-bottom: 8px;">تعذر تحميل التفسير حالياً</p>
                        <a href="${modalFullLink.href}" style="color: var(--gold); text-decoration: underline; font-size: 13px;">
                            فتح في صفحة التفسير الشاملة
                        </a>
                    </div>
                `;
            }
        }

        function syncCustomTafseerUI(edition) {
            const nameSpan = document.getElementById('selected-tafseer-name');
            const edConfig = TAFSEER_CONFIG[edition];
            if (nameSpan && edConfig) {
                nameSpan.textContent = edConfig.name;
            }
            document.querySelectorAll('#custom-tafseer-menu .tafseer-option-item').forEach(item => {
                if (item.getAttribute('data-value') === edition) {
                    item.classList.add('is-selected');
                } else {
                    item.classList.remove('is-selected');
                }
            });
        }

        const customTafseerDropdown = document.getElementById('custom-tafseer-dropdown');
        const customTafseerTrigger = document.getElementById('custom-tafseer-trigger');
        const customTafseerMenu = document.getElementById('custom-tafseer-menu');

        if (customTafseerTrigger && customTafseerDropdown) {
            customTafseerTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = customTafseerDropdown.classList.toggle('is-open');
                customTafseerTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            document.addEventListener('click', (e) => {
                if (!customTafseerDropdown.contains(e.target)) {
                    customTafseerDropdown.classList.remove('is-open');
                    customTafseerTrigger.setAttribute('aria-expanded', 'false');
                }
            });

            if (customTafseerMenu) {
                customTafseerMenu.querySelectorAll('.tafseer-option-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const val = item.getAttribute('data-value');
                        if (val && TAFSEER_CONFIG[val]) {
                            currentQuickEdition = val;
                            try {
                                localStorage.setItem('quiblah_selected_tafseer', currentQuickEdition);
                            } catch(err) {}
                            syncCustomTafseerUI(currentQuickEdition);
                            const quickSelect = document.getElementById('quick-tafseer-select');
                            if (quickSelect) quickSelect.value = currentQuickEdition;
                            customTafseerDropdown.classList.remove('is-open');
                            customTafseerTrigger.setAttribute('aria-expanded', 'false');
                            loadQuickTafseerContent(currentQuickSurah, currentQuickAyah, currentQuickEdition);
                        }
                    });
                });
            }
        }

        const quickSelectEl = document.getElementById('quick-tafseer-select');
        if (quickSelectEl) {
            quickSelectEl.addEventListener('change', (e) => {
                currentQuickEdition = e.target.value;
                try {
                    localStorage.setItem('quiblah_selected_tafseer', currentQuickEdition);
                } catch(err) {}
                syncCustomTafseerUI(currentQuickEdition);
                loadQuickTafseerContent(currentQuickSurah, currentQuickAyah, currentQuickEdition);
            });
        }

        function closeQuickTafseer() {
            const modalBackdrop = document.getElementById('tafseer-modal-backdrop');
            modalBackdrop.classList.remove('show');
        }

        const modalCloseBtn = document.getElementById('modal-close-btn');
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeQuickTafseer);

        const modalBackdropEl = document.getElementById('tafseer-modal-backdrop');
        if (modalBackdropEl) {
            modalBackdropEl.addEventListener('click', (e) => {
                if (e.target.id === 'tafseer-modal-backdrop') closeQuickTafseer();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeQuickTafseer();
                closeQuranSettingsModal();
                return;
            }

            // Keyboard Page Flip in Pages Mode (ArrowLeft = Next Page in RTL, ArrowRight = Prev Page)
            if (currentReadingMode === 'pages' && currentVisiblePage) {
                if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
                    return;
                }
                const modal = document.getElementById('settings-modal-backdrop');
                if (modal && modal.classList.contains('active')) return;
                const tafseerM = document.getElementById('tafseer-modal-backdrop');
                if (tafseerM && tafseerM.classList.contains('active')) return;

                if (e.key === 'ArrowLeft') {
                    if (currentVisiblePage < 604) loadMushafPage(currentVisiblePage + 1);
                } else if (e.key === 'ArrowRight') {
                    if (currentVisiblePage > 1) loadMushafPage(currentVisiblePage - 1);
                }
            }
        });

        // Touch Swipe Handling on readerArea for Page-by-Page Mode
        let touchStartX = 0;
        let touchStartY = 0;
        if (readerArea) {
            readerArea.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length === 1) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            readerArea.addEventListener('touchend', (e) => {
                if (currentReadingMode !== 'pages' || !currentVisiblePage) return;
                if (e.changedTouches && e.changedTouches.length === 1) {
                    const deltaX = e.changedTouches[0].clientX - touchStartX;
                    const deltaY = e.changedTouches[0].clientY - touchStartY;
                    // Check if horizontal swipe is dominant and significant (> 55px)
                    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
                        if (deltaX < 0) {
                            // Swiped Left -> In RTL, Next Page
                            if (currentVisiblePage < 604) loadMushafPage(currentVisiblePage + 1);
                        } else {
                            // Swiped Right -> Previous Page
                            if (currentVisiblePage > 1) loadMushafPage(currentVisiblePage - 1);
                        }
                    }
                }
            }, { passive: true });
        }

        const settingsBackdropEl = document.getElementById('settings-modal-backdrop');
        if (settingsBackdropEl) {
            settingsBackdropEl.addEventListener('click', (e) => {
                if (e.target.id === 'settings-modal-backdrop') closeQuranSettingsModal();
            });
        }

        // Expose helpers globally for inline onclick handlers
        window.loadSurah = loadSurah;
        window.loadMushafPage = loadMushafPage;
        window.jumpToMushafPage = jumpToMushafPage;
        window.getStartPageForSurah = getStartPageForSurah;
        window.getPageForAyah = getPageForAyah;
        window.toggleSidebar = toggleSidebar;
        window.renderSurahPickerLanding = renderSurahPickerLanding;
        window.toggleAyahBookmark = toggleAyahBookmark;
        window.handleTopbarBookmarkClick = handleTopbarBookmarkClick;
        window.handleSyncKhatmahClick = handleSyncKhatmahClick;
        window.clearQuranBookmark = clearQuranBookmark;
        window.toggleBookmarkFromModal = toggleBookmarkFromModal;
        window.scrollToAyah = scrollToAyah;
        window.setReadingMode = setReadingMode;
        window.getReadingMode = getReadingMode;
        window.openQuranSettingsModal = openQuranSettingsModal;
        window.closeQuranSettingsModal = closeQuranSettingsModal;
        window.adjustQuranFontSize = adjustQuranFontSize;
        window.onQuranFontSizeInput = onQuranFontSizeInput;
        window.setQuranTheme = setQuranTheme;
        window.resetQuranSettings = resetQuranSettings;

        // Apply saved font size, theme, and reading mode UI on boot
        applyQuranFontSize(currentQuranFontSize, false);
        applyQuranTheme(currentQuranTheme, false);
        updateModeSwitcherUI();

        // Initialize with query params support
        const urlParams = new URLSearchParams(window.location.search);
        let urlSurah = parseInt(urlParams.get('surah'));
        const urlAyah = parseInt(urlParams.get('ayah'));
        const urlPage = parseInt(urlParams.get('page'));

        fetchSurahs();
        updateTopbarBookmarkUI();

        if (urlPage && urlPage >= 1 && urlPage <= 604) {
            if (currentReadingMode === 'pages') {
                loadMushafPage(urlPage, urlAyah || null);
            } else {
                let sNum = 1;
                if (window.QURAN_PAGES_MAP && window.QURAN_PAGES_MAP[urlPage]) {
                    sNum = window.QURAN_PAGES_MAP[urlPage][1][0][0];
                }
                loadSurah(sNum, urlAyah || null);
            }
        } else if (urlSurah && urlSurah >= 1 && urlSurah <= 114) {
            currentSurahNumber = urlSurah;
            if (currentReadingMode === 'pages') {
                const targetPage = urlAyah ? getPageForAyah(urlSurah, urlAyah) : getStartPageForSurah(urlSurah);
                loadMushafPage(targetPage, urlAyah || null);
            } else {
                loadSurah(urlSurah, urlAyah || null);
            }
        } else {
            currentSurahNumber = null;
            renderSurahPickerLanding();
        }

