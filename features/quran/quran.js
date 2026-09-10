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
        let currentSurahNumber = 1;

        const surahListEl = document.getElementById('surah-list');
        const searchInput = document.getElementById('search-input');
        const contentContainer = document.getElementById('content-container');
        const readerArea = document.getElementById('reader-area');
        const mobileTitle = document.getElementById('mobile-title');

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

            let html = '';
            surahs.forEach(surah => {
                const isActive = surah.number === currentSurahNumber ? 'active' : '';
                html += `
                    <div class="surah-item ${isActive}" data-id="${surah.number}">
                        <div class="surah-number">${surah.number}</div>
                        <div class="surah-details">
                            <div class="surah-name">${surah.name}</div>
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

        // Search filtering
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allSurahs.filter(s => 
                s.name.includes(query) || s.englishName.toLowerCase().includes(query)
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
        async function loadSurah(id) {
            readerArea.scrollTop = 0;

            const surahMeta = (allSurahs && allSurahs.find(s => s.number === id)) || 
                              (window.QURAN_SURAHS_DATA && window.QURAN_SURAHS_DATA.find(s => s.number === id));

            // 0. Full local Quran data (all 114 surahs, 0ms instant load, 100% offline!)
            if (window.QURAN_FULL_DATA && window.QURAN_FULL_DATA[id]) {
                renderSurahView(window.QURAN_FULL_DATA[id]);
                return;
            }

            // 1. Built-in initial cache (e.g. Al-Fatihah, 0ms instant load!)
            if (window.SURAHS_INITIAL_CACHE && window.SURAHS_INITIAL_CACHE[id]) {
                renderSurahView(window.SURAHS_INITIAL_CACHE[id]);
                return;
            }

            const cacheKey = 'quiblah_surah_uthmani_' + id;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    const data = JSON.parse(cachedData);
                    renderSurahView(data);
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
                renderSurahView(data);
            } catch(error) {
                contentContainer.innerHTML = `
                    <div class="error-message" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(197,168,89,0.3); border-radius: 16px; padding: 25px; text-align: center; max-width: 500px; margin: 40px auto;">
                        <i class="fa-solid fa-circle-exclamation fa-2x" style="color: var(--gold); margin-bottom: 12px;"></i>
                        <p style="color: #fff; font-size: 15px; margin-bottom: 15px;">تعذر تحميل آيات السورة حالياً. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.</p>
                        <button onclick="loadSurah(${id})" style="cursor: pointer; border: 1px solid var(--gold); color: var(--gold); background: rgba(0,0,0,0.4); padding: 8px 20px; border-radius: 20px; font-family: inherit; font-size: 13.5px; font-weight: 700; transition: all 0.2s;">
                            <i class="fa-solid fa-rotate-right"></i> إعادة المحاولة الآن
                        </button>
                    </div>
                `;
                console.error("Error fetching surah content:", error);
            }
        }

        function renderSurahView(data) {
            mobileTitle.innerText = data.name;
            
            let html = `
                <div class="surah-header-card">
                    <h1 class="surah-title">${data.name}</h1>
                    <div class="surah-meta">
                        <span>${data.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                        <span>آياتها: ${data.numberOfAyahs}</span>
                    </div>
                    <div class="surah-header-actions" style="margin-top: 16px; display: flex; justify-content: center; align-items: center; gap: 8px; width: 100%; max-width: 440px; margin-left: auto; margin-right: auto; flex-wrap: nowrap;">
                        <a href="tafseer.html?surah=${data.number}" style="flex: 1 1 50%; justify-content: center; font-size: 12px; padding: 8px 10px; border: 1px solid var(--gold); border-radius: 20px; background: rgba(0,0,0,0.45); color: var(--gold); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; transition: all 0.2s;">
                            <i class="fa-solid fa-book-open-reader"></i> تفسير سورة ${data.name}
                        </a>
                        <button onclick="playSurahGlobalAudio(${data.number}, '${data.name}')" style="flex: 1 1 50%; justify-content: center; font-size: 12px; padding: 8px 10px; border: 1px solid var(--gold); border-radius: 20px; background: rgba(197, 168, 89, 0.25); color: var(--gold); cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; transition: all 0.2s;">
                            <i class="fa-solid fa-circle-play"></i> استمع للسورة
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
                
                html += `
                    <span class="verse">${text}</span>
                    <span class="verse-number" onclick="showQuickTafseer(${data.number}, ${ayah.numberInSurah})" title="اضغط لعرض تفسير الآية (${ayah.numberInSurah})">${ayah.numberInSurah}</span>
                `;
            });

            // Add Sadaqallah Al-Azeem in center
            html += `
                <div class="sadaqallah-box">
                    <span class="sadaqallah-line"></span>
                    <span class="sadaqallah-text">« صَدَقَ اللَّهُ الْعَظِيمُ »</span>
                    <span class="sadaqallah-line"></span>
                </div>
            `;

            html += `</div>`;
            
            // Append Footer
            html += `
                <div style="text-align: center; padding: 20px; margin-top: 40px; color: rgba(255,255,255,0.7); font-size: 14px; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; box-sizing: border-box; line-height: 1.6;">
                    جميع الحقوق محفوظة &copy; 2026 - قبلة المسلم <br>
                    تم التطوير بواسطة <strong style="color: var(--gold);">كمال أبو عيد</strong>
                </div>
            `;

            contentContainer.innerHTML = html;
        }

        // --- Quick Tafseer Modal Logic ---
        function showQuickTafseer(surahNum, ayahNum) {
            const modalBackdrop = document.getElementById('tafseer-modal-backdrop');
            const modalAyahText = document.getElementById('modal-ayah-text');
            const modalTafseerText = document.getElementById('modal-tafseer-text');
            const modalTitle = document.getElementById('modal-title');
            const modalFullLink = document.getElementById('modal-full-link');

            modalBackdrop.classList.add('show');
            modalTitle.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> تفسير الآية (${ayahNum})`;
            modalAyahText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
            modalTafseerText.innerHTML = `جاري جلب التفسير الميسر...`;
            modalFullLink.href = `tafseer.html?surah=${surahNum}&ayah=${ayahNum}`;

            fetchWithTimeout(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/editions/quran-uthmani,ar.muyassar`, 6000)
                .then(res => {
                    const editions = res.data;
                    const quranAyah = editions.find(e => e.edition.identifier === 'quran-uthmani') || editions[0];
                    const tafseerAyah = editions.find(e => e.edition.identifier === 'ar.muyassar') || editions[1];

                    modalTitle.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> ${quranAyah.surah.name} - آية (${ayahNum})`;
                    modalAyahText.innerText = quranAyah.text;
                    modalTafseerText.innerText = tafseerAyah.text;
                })
                .catch(err => {
                    console.warn("Alquran quick tafseer failed, trying fallback...", err);
                    fetchWithTimeout(`https://api.quran.com/api/v4/verses/by_key/${surahNum}:${ayahNum}?words=false&tafsirs=16`, 6000)
                        .then(r2 => {
                            if (r2 && r2.verse) {
                                modalTitle.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> آية (${ayahNum})`;
                                modalAyahText.innerText = r2.verse.text_uthmani || `آية ${ayahNum}`;
                                modalTafseerText.innerText = (r2.verse.tafsirs && r2.verse.tafsirs[0] ? r2.verse.tafsirs[0].text : "التفسير متاح في صفحة التفسير الشاملة");
                                return;
                            }
                            throw new Error();
                        })
                        .catch(() => {
                            modalAyahText.innerText = `تعذر جلب نص الآية`;
                            modalTafseerText.innerText = `حدث خطأ أثناء جلب التفسير المباشر. يرجى الضغط على زر 'عرض في صفحة التفسير الشاملة' بالأسفل.`;
                        });
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

        // Initialize with query params support
        const urlParams = new URLSearchParams(window.location.search);
        const urlSurah = parseInt(urlParams.get('surah'));
        if (urlSurah && urlSurah >= 1 && urlSurah <= 114) {
            currentSurahNumber = urlSurah;
        }

        fetchSurahs();
        // Load target surah immediately (defaults to Surah 1 Al-Fatihah)
        loadSurah(currentSurahNumber);
