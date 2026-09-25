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
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
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
                const bookmark = {
                    surahNumber: parseInt(surahNumber),
                    ayahNumber: parseInt(ayahNumber),
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

                // Touch support: show on touch, immediately hide on lift ("أول لما أشيل إيدي الغي وأخفيها")
                let touchActive = false;

                btn.addEventListener('touchstart', (e) => {
                    touchActive = true;
                    wrap.classList.add('is-open');
                }, { passive: true });

                const closeOnRelease = () => {
                    if (touchActive) {
                        touchActive = false;
                        wrap.classList.remove('is-open');
                    }
                };

                btn.addEventListener('touchend', closeOnRelease, { passive: true });
                btn.addEventListener('touchcancel', closeOnRelease, { passive: true });

                // Dismiss if tapped outside
                document.addEventListener('touchstart', (e) => {
                    if (!wrap.contains(e.target)) {
                        wrap.classList.remove('is-open');
                    }
                }, { passive: true });

                document.addEventListener('click', (e) => {
                    if (!wrap.contains(e.target)) {
                        wrap.classList.remove('is-open');
                    }
                });
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

            if (currentSurahNumber === bm.surahNumber) {
                scrollToAyah(bm.ayahNumber, true);
            } else {
                loadSurah(bm.surahNumber, bm.ayahNumber);
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
                html += `
                    <div class="surah-item ${isActive}" data-id="${surah.number}">
                        <div class="surah-number">${surah.number}</div>
                        <div class="surah-details">
                            <div class="surah-name">${surah.name} ${bookmarkBadge}</div>
                            <div class="surah-info">${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • آياتها ${surah.numberOfAyahs}</div>
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
                    
                    loadSurah(id);
                    
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

        // Calculate page for any ayah using QURAN_SURAH_PAGES
        function getPageForAyah(surahNum, ayahNum) {
            const pages = window.QURAN_SURAH_PAGES;
            if (!pages) return 1;
            const currentSurah = pages.find(s => s.num === surahNum);
            if (!currentSurah) return 1;
            if (surahNum === 114) return 604;

            const nextSurah = pages.find(s => s.num === surahNum + 1);
            const startPage = currentSurah.page;
            const endPage = nextSurah ? Math.max(startPage, nextSurah.page - 1) : 604;

            if (startPage === endPage) return startPage;

            const meta = window.QURAN_SURAHS_DATA ? window.QURAN_SURAHS_DATA.find(s => s.number === surahNum) : null;
            const totalAyahs = (meta && meta.numberOfAyahs) ? meta.numberOfAyahs : 1;

            const ratio = Math.max(0, Math.min(1, (ayahNum - 1) / totalAyahs));
            const estimatedPage = Math.floor(startPage + ratio * (endPage - startPage + 1));
            return Math.min(endPage, Math.max(startPage, estimatedPage));
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

            contentContainer.innerHTML = `
                <div class="surah-picker-landing">
                    <div class="picker-icon-box">
                        <i class="fa-solid fa-book-quran"></i>
                    </div>
                    <div class="picker-ayah-quote">« وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا »</div>
                    <h2 class="picker-main-title">اختر السورة المباركة للبدء في القراءة</h2>
                    <p class="picker-subtext">تصفح فهرس سور القرآن الكريم (114 سورة) واقرأ آيات الذكر الحكيم برسم المصحف العثماني الشريف</p>
                    
                    <button type="button" class="open-surah-drawer-btn" onclick="toggleSidebar()">
                        <i class="fa-solid fa-list-ul"></i>
                        <span>فتح قائمة السور (114 سورة)</span>
                    </button>
                </div>
            `;
            updateTopbarBookmarkUI();
        }

        function buildSurahSectionHtml(data, isFirst = false) {
            const bm = getQuranBookmark();
            let html = `
                <div class="single-surah-block" id="surah-block-${data.number}" data-surah="${data.number}">
                    <div class="surah-header-card">
                        <h1 class="surah-title">${data.name}</h1>
                        <div class="surah-meta">
                            <span>${data.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                            <span>آياتها: ${data.numberOfAyahs}</span>
                        </div>
                        <div class="surah-header-actions">
                            <a href="tafseer.html?surah=${data.number}" class="header-action-link" title="تفسير السورة">
                                <i class="fa-solid fa-book-open-reader"></i> <span>تفسير السورة</span>
                            </a>
                            <button onclick="playSurahGlobalAudio(${data.number}, '${escapeQuotes(data.name)}')" class="header-action-link" title="استمع للسورة">
                                <i class="fa-solid fa-circle-play"></i> <span>استمع</span>
                            </button>
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
                            <button type="button" class="ayah-bookmark-btn ${isBookmarked ? 'is-bookmarked' : ''}" onclick="toggleAyahBookmark(${data.number}, ${ayah.numberInSurah}, '${escapeQuotes(data.name)}', null, event)" title="${isBookmarked ? 'إزالة علامة القراءة' : 'وضع علامة قراءة عند هذه الآية'}">
                                <i class="${isBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}"></i>
                            </button>
                        </span>
                    </span>
                `;
            });

            html += `
                    <div class="sadaqallah-box">
                        <span class="sadaqallah-line"></span>
                        <span class="sadaqallah-text">« صَدَقَ اللَّهُ الْعَظِيمُ »</span>
                        <span class="sadaqallah-line"></span>
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
            const sentinelHtml = `
                <div id="infinite-scroll-sentinel" class="infinite-loading-indicator" style="display: none;">
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <span>جاري تحضير السورة التالية...</span>
                </div>
            `;
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

            // 1. Infinite scroll check
            const scrollBottom = readerArea.scrollTop + readerArea.clientHeight;
            if (scrollBottom >= readerArea.scrollHeight - 650) {
                loadNextSurahInInfiniteScroll();
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
            if (e.key === 'Escape') closeQuickTafseer();
        });

        // Expose helpers globally for inline onclick handlers
        window.loadSurah = loadSurah;
        window.toggleSidebar = toggleSidebar;
        window.renderSurahPickerLanding = renderSurahPickerLanding;
        window.toggleAyahBookmark = toggleAyahBookmark;
        window.handleTopbarBookmarkClick = handleTopbarBookmarkClick;
        window.handleSyncKhatmahClick = handleSyncKhatmahClick;
        window.clearQuranBookmark = clearQuranBookmark;
        window.toggleBookmarkFromModal = toggleBookmarkFromModal;
        window.scrollToAyah = scrollToAyah;

        // Initialize with query params support
        const urlParams = new URLSearchParams(window.location.search);
        let urlSurah = parseInt(urlParams.get('surah'));
        const urlAyah = parseInt(urlParams.get('ayah'));
        const urlPage = parseInt(urlParams.get('page'));

        if (!urlSurah && urlPage && urlPage >= 1 && urlPage <= 604 && window.QURAN_SURAH_PAGES) {
            for (let i = 0; i < window.QURAN_SURAH_PAGES.length; i++) {
                if (window.QURAN_SURAH_PAGES[i].page <= urlPage) {
                    urlSurah = window.QURAN_SURAH_PAGES[i].num;
                } else {
                    break;
                }
            }
        }

        fetchSurahs();
        updateTopbarBookmarkUI();

        if (urlSurah && urlSurah >= 1 && urlSurah <= 114) {
            currentSurahNumber = urlSurah;
            loadSurah(urlSurah, urlAyah || null);
        } else {
            currentSurahNumber = null;
            renderSurahPickerLanding();
        }

