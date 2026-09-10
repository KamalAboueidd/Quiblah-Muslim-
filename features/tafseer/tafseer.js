// features/tafseer/tafseer.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© tafseer.html
// Carousel Rotation
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 8000);

        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menu-btn');
        const overlay = document.getElementById('sidebar-overlay');
        const surahListEl = document.getElementById('surah-list');
        const searchInput = document.getElementById('search-input');
        const contentContainer = document.getElementById('content-container');
        const readerArea = document.getElementById('reader-area');
        const mobileTitle = document.getElementById('mobile-title');
        const dropdownTrigger = document.getElementById('dropdown-trigger');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const selectedTafseerLabel = document.getElementById('selected-tafseer-label');
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        const ayahSearchInput = document.getElementById('ayah-search-input');
        const clearSearchBtn = document.getElementById('clear-search-btn');
        const scrollTopBtn = document.getElementById('scroll-top-btn');
        const ayahAudio = document.getElementById('ayah-audio');

        const TAFSEER_EDITIONS = {
            'ar.muyassar': {
                name: 'التفسير الميسر (مجمع الملك فهد)',
                source: 'alquran',
                identifier: 'ar.muyassar'
            },
            'ar-tafseer-al-saddi': {
                name: 'تفسير السعدي (تيسير الكريم الرحمن)',
                source: 'spa5k',
                slug: 'ar-tafseer-al-saddi'
            },
            'ar-tafsir-al-mukhtasar': {
                name: 'المختصر في التفسير (مركز تفسير)',
                source: 'spa5k',
                slug: 'ar-tafsir-al-mukhtasar'
            },
            'ar.waseet': {
                name: 'التفسير الوسيط (د. محمد سيد طنطاوي)',
                source: 'alquran',
                identifier: 'ar.waseet'
            },
            'ar-tafsir-ibn-kathir': {
                name: 'تفسير ابن كثير (تفسير القرآن العظيم)',
                source: 'spa5k',
                slug: 'ar-tafsir-ibn-kathir'
            },
            'ar.baghawi': {
                name: 'تفسير البغوي (معالم التنزيل)',
                source: 'alquran',
                identifier: 'ar.baghawi'
            },
            'ar.qurtubi': {
                name: 'تفسير القرطبي (الجامع لأحكام القرآن)',
                source: 'alquran',
                identifier: 'ar.qurtubi'
            },
            'ar-tafsir-al-tabari': {
                name: 'تفسير الطبري (جامع البيان)',
                source: 'spa5k',
                slug: 'ar-tafsir-al-tabari'
            },
            'ar.jalalayn': {
                name: 'تفسير الجلالين (المحلي والسيوطي)',
                source: 'alquran',
                identifier: 'ar.jalalayn'
            },
            'fath-al-qadir-al-shawkani': {
                name: 'فتح القدير (للإمام الشوكاني)',
                source: 'spa5k',
                slug: 'fath-al-qadir-al-shawkani'
            },
            'ar.miqbas': {
                name: 'تنوير المقباس من تفسير ابن عباس',
                source: 'alquran',
                identifier: 'ar.miqbas'
            },
            'i-rab-al-quran-li-al-darwish': {
                name: 'إعراب القرآن وبيانه (درويش)',
                source: 'spa5k',
                slug: 'i-rab-al-quran-li-al-darwish'
            }
        };

        let allSurahs = [];
        let currentSurahNumber = 1;
        let currentTafseerEdition = 'ar.muyassar';
        let currentSurahData = null;
        let tafseerCache = {};
        let quranTextCache = {};
        let currentPlayingAyahBtn = null;

        // Chunk / Pagination settings
        const BATCH_SIZE = 10;
        let currentRenderedAyahsCount = 0;

        function toggleSidebar() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        }

        menuBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);

        readerArea.addEventListener('scroll', () => {
            if (readerArea.scrollTop > 300) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            readerArea.scrollTo({ top: 0, behavior: 'smooth' });
        });

        function getQueryParams() {
            const params = new URLSearchParams(window.location.search);
            const surah = parseInt(params.get('surah')) || 1;
            const ayah = parseInt(params.get('ayah')) || null;
            const edition = params.get('tafseer') || null;
            return { surah, ayah, edition };
        }

        function fetchSurahs() {
            // 1. Instant local metadata (0ms load guaranteed, works offline)
            if (window.QURAN_SURAHS_DATA && window.QURAN_SURAHS_DATA.length > 0) {
                allSurahs = window.QURAN_SURAHS_DATA;
                renderSurahList(allSurahs);
                checkInitialLoad();
                return;
            }

            const cachedIndex = localStorage.getItem('quiblah_surah_index');
            if (cachedIndex) {
                try {
                    allSurahs = JSON.parse(cachedIndex);
                    renderSurahList(allSurahs);
                    checkInitialLoad();
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
                    checkInitialLoad();
                })
                .catch(error => {
                    console.warn("Alquran API surahs failed, trying Quran.com API...", error);
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
                            checkInitialLoad();
                        })
                        .catch(() => {
                            if (window.QURAN_SURAHS_DATA) {
                                allSurahs = window.QURAN_SURAHS_DATA;
                                renderSurahList(allSurahs);
                                checkInitialLoad();
                            } else {
                                surahListEl.innerHTML = `<div class="error-message" style="text-align: center; padding: 20px; color: var(--gold);">
                                    <p style="margin-bottom: 12px; font-size: 14px;">حدث خطأ في تحميل قائمة السور</p>
                                    <button type="button" onclick="fetchSurahs()" style="cursor: pointer; border: 1px solid var(--gold); color: var(--gold); background: rgba(0,0,0,0.4); padding: 7px 18px; border-radius: 20px; font-family: inherit; font-size: 13px; font-weight: 700;">
                                        <i class="fa-solid fa-rotate-right"></i> إعادة المحاولة
                                    </button>
                                </div>`;
                            }
                        });
                });
        }

        function checkInitialLoad() {
            const { surah, ayah, edition } = getQueryParams();
            const savedEdition = localStorage.getItem('quiblah_selected_tafseer');

            if (edition && TAFSEER_EDITIONS[edition]) {
                currentTafseerEdition = edition;
            } else if (savedEdition && TAFSEER_EDITIONS[savedEdition]) {
                currentTafseerEdition = savedEdition;
            }
            updateDropdownUI(currentTafseerEdition);

            if (surah >= 1 && surah <= 114) {
                currentSurahNumber = surah;
            }
            updateActiveSurahSidebar();
            loadSurahTafseer(currentSurahNumber, ayah);
        }

        function renderSurahList(surahs) {
            if (surahs.length === 0) {
                surahListEl.innerHTML = `<div style="text-align:center; padding: 25px; color:#999; font-size:14px;">لا توجد سورة بهذا الاسم</div>`;
                return;
            }

            let html = '';
            surahs.forEach(surah => {
                const isActive = surah.number === currentSurahNumber ? 'active' : '';
                const typeText = surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية';
                html += `
                    <div class="surah-item ${isActive}" data-id="${surah.number}">
                        <div class="surah-number">${surah.number}</div>
                        <div class="surah-details">
                            <div class="surah-name">${surah.name}</div>
                            <div class="surah-info">
                                <span style="color: var(--gold);">${typeText}</span>
                                <span>${surah.numberOfAyahs} آية</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            surahListEl.innerHTML = html;

            document.querySelectorAll('.surah-item').forEach(item => {
                item.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    if (id !== currentSurahNumber) {
                        currentSurahNumber = id;
                        updateActiveSurahSidebar();
                        loadSurahTafseer(id);
                    }

                    if (window.innerWidth <= 850 && sidebar.classList.contains('open')) {
                        toggleSidebar();
                    }
                });
            });
        }

        function updateActiveSurahSidebar() {
            document.querySelectorAll('.surah-item').forEach(el => {
                if (parseInt(el.getAttribute('data-id')) === currentSurahNumber) {
                    el.classList.add('active');
                    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else {
                    el.classList.remove('active');
                }
            });
        }

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            const filtered = allSurahs.filter(s => 
                s.name.includes(query) || 
                s.englishName.toLowerCase().includes(query) ||
                s.number.toString() === query
            );
            renderSurahList(filtered);
        });

        // --- Custom Dropdown Handlers ---
        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdownMenu.classList.contains('show');
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        function openDropdown() {
            dropdownMenu.classList.add('show');
            dropdownTrigger.classList.add('open');
            dropdownTrigger.setAttribute('aria-expanded', 'true');
        }

        function closeDropdown() {
            dropdownMenu.classList.remove('show');
            dropdownTrigger.classList.remove('open');
            dropdownTrigger.setAttribute('aria-expanded', 'false');
        }

        document.addEventListener('click', (e) => {
            const dropdownEl = document.getElementById('tafseer-dropdown');
            if (dropdownEl && !dropdownEl.contains(e.target)) {
                closeDropdown();
            }
        });

        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const val = this.getAttribute('data-value');
                selectTafseerEdition(val);
                closeDropdown();
            });
        });

        function updateDropdownUI(edition) {
            const allItems = document.querySelectorAll('.dropdown-item');
            allItems.forEach(it => {
                if (it.getAttribute('data-value') === edition) {
                    it.classList.add('active');
                    const span = it.querySelector('span');
                    if (span) {
                        selectedTafseerLabel.textContent = span.textContent;
                    }
                } else {
                    it.classList.remove('active');
                }
            });
            if (TAFSEER_EDITIONS[edition]) {
                selectedTafseerLabel.textContent = TAFSEER_EDITIONS[edition].name;
            }
        }

        function selectTafseerEdition(edition) {
            if (!TAFSEER_EDITIONS[edition] || currentTafseerEdition === edition) return;
            currentTafseerEdition = edition;
            try {
                localStorage.setItem('quiblah_selected_tafseer', edition);
            } catch(e) {}
            updateDropdownUI(edition);
            loadSurahTafseer(currentSurahNumber);
        }

        // --- Ayah Search Logic ---
        ayahSearchInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            clearSearchBtn.style.display = val ? 'flex' : 'none';
        });

        clearSearchBtn.addEventListener('click', () => {
            ayahSearchInput.value = '';
            clearSearchBtn.style.display = 'none';
            ayahSearchInput.focus();
        });

        const searchJumpBtn = document.getElementById('search-jump-btn');
        if (searchJumpBtn) {
            searchJumpBtn.addEventListener('click', () => {
                handleAyahSearch(ayahSearchInput.value.trim());
            });
        }

        ayahSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleAyahSearch(ayahSearchInput.value.trim());
            }
        });

        function handleAyahSearch(query) {
            if (!query) return;

            // 1. If query is a pure number (e.g. 7 or 255)
            const num = parseInt(query);
            if (!isNaN(num) && num.toString() === query) {
                jumpToAyah(num);
                return;
            }

            if (!currentSurahData) return;

            // 2. Text search in verses or tafseer text
            const q = query.toLowerCase();
            const matchIndex = currentSurahData.ayahs.findIndex(a => 
                a.text.includes(q) || a.tafseer.includes(q)
            );

            if (matchIndex !== -1) {
                const matchedAyah = currentSurahData.ayahs[matchIndex];
                jumpToAyah(matchedAyah.numberInSurah);
                if (window.showToast) {
                    window.showToast(`تم العثور على نتيجة في الآية (${matchedAyah.numberInSurah})`, "fa-solid fa-magnifying-glass", 3000);
                }
            } else {
                if (window.showToast) {
                    window.showToast(`لم يتم العثور على نتائج مطابقة لـ "${query}" في هذه السورة`, "fa-solid fa-circle-exclamation", 3500);
                }
            }
        }

        function jumpToAyah(num) {
            if (!num || isNaN(num)) return;

            if (!currentSurahData) return;
            if (num < 1 || num > currentSurahData.numberOfAyahs) {
                if (window.showToast) {
                    window.showToast(`الآية رقم (${num}) غير موجودة في هذه السورة`, "fa-solid fa-circle-exclamation", 3500);
                }
                return;
            }

            // Ensure the ayah is rendered in the DOM if beyond current batch
            if (num > currentRenderedAyahsCount) {
                while (currentRenderedAyahsCount < num) {
                    appendNextBatch();
                }
            }

            const targetRow = document.getElementById(`ayah-row-${num}`);
            if (targetRow) {
                targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetRow.classList.add('highlighted');
                setTimeout(() => {
                    targetRow.classList.remove('highlighted');
                }, 3000);
            }
        }

        function renderSurahTopHeader(meta) {
            const container = document.getElementById('surah-header-container');
            if (!container || !meta) return;
            const revelationLabel = meta.revelationType === 'Meccan' ? 'مكية' : 'مدنية';
            const juzHtml = meta.juz ? `<span style="color: rgba(255,255,255,0.2);">|</span><span class="surah-meta-item"><i class="fa-solid fa-book-bookmark"></i> الجزء ${meta.juz}</span>` : '';
            const pageHtml = meta.page ? `<span style="color: rgba(255,255,255,0.2);">|</span><span class="surah-meta-item"><i class="fa-solid fa-file-lines"></i> صفحة ${meta.page}</span>` : '';

            container.innerHTML = `
                <h1 class="surah-title">${meta.name}</h1>
                <div class="surah-meta">
                    <span class="surah-meta-item"><i class="fa-solid fa-kaaba"></i> ${revelationLabel}</span>
                    <span style="color: rgba(255,255,255,0.2);">|</span>
                    <span class="surah-meta-item"><i class="fa-solid fa-list-check"></i> آياتها ${meta.numberOfAyahs}</span>
                    ${juzHtml}
                    ${pageHtml}
                </div>
                <div class="surah-header-actions">
                    <a href="quran.html?surah=${meta.number}" class="header-action-link">
                        <i class="fa-solid fa-book-quran"></i> قراءة في المصحف
                    </a>
                    <button onclick="playSurahGlobalAudio(${meta.number}, '${meta.name}')" class="header-action-link">
                        <i class="fa-solid fa-circle-play"></i> استمع للسورة
                    </button>
                </div>
            `;
        }

        // Resilient fetch with timeout
        async function fetchWithTimeout(url, timeoutMs = 6500) {
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

        async function loadSurahTafseer(surahNumber, targetAyahNumber = null) {
            stopAudio();

            // 0ms instant surah header update from static metadata
            const cachedSurahMeta = (allSurahs && allSurahs.find(s => s.number === surahNumber)) || 
                                    (window.QURAN_SURAHS_DATA && window.QURAN_SURAHS_DATA.find(s => s.number === surahNumber));
            if (cachedSurahMeta) {
                renderSurahTopHeader(cachedSurahMeta);
                if (mobileTitle) {
                    mobileTitle.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> ${cachedSurahMeta.name}`;
                }
            }

            const editionConfig = TAFSEER_EDITIONS[currentTafseerEdition] || TAFSEER_EDITIONS['ar.muyassar'];

            contentContainer.innerHTML = `
                <div class="loader-container">
                    <i class="fa-solid fa-spinner fa-spin fa-3x"></i>
                    <p>جاري تحميل نص الآيات و${editionConfig.name}...</p>
                </div>
            `;

            readerArea.scrollTop = 0;

            const cacheKey = `tafseer_${currentTafseerEdition}_${surahNumber}`;
            if (tafseerCache[cacheKey]) {
                initSurahDisplay(tafseerCache[cacheKey], targetAyahNumber);
                return;
            }

            const localSaved = localStorage.getItem(cacheKey);
            if (localSaved) {
                try {
                    const parsed = JSON.parse(localSaved);
                    tafseerCache[cacheKey] = parsed;
                    initSurahDisplay(parsed, targetAyahNumber);
                    return;
                } catch(e) {
                    localStorage.removeItem(cacheKey);
                }
            }

            try {
                let combinedData = null;

                if (editionConfig.source === 'spa5k') {
                    // 1. Get Quran Uthmani text (from cache or API)
                    let quranEdition = quranTextCache[surahNumber];
                    if (!quranEdition) {
                        const qRes = await fetchWithTimeout(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani`, 8000);
                        quranEdition = (Array.isArray(qRes.data) ? qRes.data[0] : qRes.data);
                        quranTextCache[surahNumber] = quranEdition;
                    }

                    // 2. Fetch Tafsir from jsDelivr CDN
                    const spa5kUrl = `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${editionConfig.slug}/${surahNumber}.json`;
                    const spa5kRes = await fetchWithTimeout(spa5kUrl, 8000);
                    const rawAyahs = Array.isArray(spa5kRes) ? spa5kRes : (spa5kRes.ayahs || spa5kRes.data || []);
                    
                    const tafsirMap = {};
                    rawAyahs.forEach(item => {
                        if (item && item.ayah != null) {
                            tafsirMap[item.ayah] = item.text;
                        }
                    });

                    combinedData = {
                        number: quranEdition.number,
                        name: quranEdition.name,
                        englishName: quranEdition.englishName,
                        revelationType: quranEdition.revelationType,
                        numberOfAyahs: quranEdition.numberOfAyahs,
                        tafseerName: editionConfig.name,
                        ayahs: quranEdition.ayahs.map((ayah, index) => {
                            const tText = tafsirMap[ayah.numberInSurah] || (rawAyahs[index] ? rawAyahs[index].text : '') || 'لا يتوفر تفسير لهذه الآية';
                            return {
                                number: ayah.number,
                                numberInSurah: ayah.numberInSurah,
                                text: ayah.text,
                                juz: ayah.juz,
                                page: ayah.page,
                                tafseer: tText
                            };
                        })
                    };
                } else {
                    // source: alquran.cloud
                    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,${editionConfig.identifier}`;
                    const response = await fetchWithTimeout(url, 8000);
                    const editionsData = response.data;
                    const quranEdition = editionsData.find(e => e.edition.identifier === 'quran-uthmani') || editionsData[0];
                    const tafseerEdition = editionsData.find(e => e.edition.identifier === editionConfig.identifier) || editionsData[1];

                    // Cache quranEdition for instant switching
                    quranTextCache[surahNumber] = quranEdition;

                    combinedData = {
                        number: quranEdition.number,
                        name: quranEdition.name,
                        englishName: quranEdition.englishName,
                        revelationType: quranEdition.revelationType,
                        numberOfAyahs: quranEdition.numberOfAyahs,
                        tafseerName: editionConfig.name,
                        ayahs: quranEdition.ayahs.map((ayah, index) => {
                            const tafseerAyah = (tafseerEdition && tafseerEdition.ayahs) ? (tafseerEdition.ayahs[index] || {}) : {};
                            return {
                                number: ayah.number,
                                numberInSurah: ayah.numberInSurah,
                                text: ayah.text,
                                juz: ayah.juz,
                                page: ayah.page,
                                tafseer: tafseerAyah.text || 'لا يتوفر تفسير لهذه الآية'
                            };
                        })
                    };
                }

                tafseerCache[cacheKey] = combinedData;
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(combinedData));
                } catch(e) {
                    console.warn("Storage full");
                }

                initSurahDisplay(combinedData, targetAyahNumber);
            } catch(error) {
                console.error("Error fetching tafseer:", error);
                contentContainer.innerHTML = `
                    <div class="error-message" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(197,168,89,0.3); border-radius: 16px; padding: 25px; text-align: center; max-width: 500px; margin: 40px auto;">
                        <i class="fa-solid fa-triangle-exclamation fa-2x" style="color: var(--gold); margin-bottom: 12px;"></i>
                        <p style="color: #fff; font-size: 15px; margin-bottom: 15px;">تعذر جلب ${editionConfig.name} حالياً. يرجى التأكد من اتصال الإنترنت والمحاولة مرة أخرى.</p>
                        <button onclick="loadSurahTafseer(${surahNumber})" class="jump-btn" style="padding: 10px 24px; border-radius: 20px; font-weight: 700; cursor: pointer;">
                            <i class="fa-solid fa-rotate-right"></i> إعادة المحاولة الآن
                        </button>
                    </div>
                `;
            }
        }

        function initSurahDisplay(data, targetAyahNumber = null) {
            currentSurahData = data;
            currentRenderedAyahsCount = 0;
            if (mobileTitle) {
                mobileTitle.innerHTML = `<i class="fa-solid fa-book-open-reader"></i> ${data.name}`;
            }
            ayahSearchInput.placeholder = `ابحث برقم الآية (1 - ${data.numberOfAyahs}) أو كلماتها...`;

            renderSurahTopHeader({
                ...data,
                juz: data.ayahs && data.ayahs[0] ? data.ayahs[0].juz : '',
                page: data.ayahs && data.ayahs[0] ? data.ayahs[0].page : ''
            });

            // Table Structure (Ayahs and Tafseer) inside contentContainer
            let bodyHtml = '';
            if (data.number !== 1 && data.number !== 9) {
                bodyHtml += `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
            }

            bodyHtml += `
                <div class="tafseer-table-container">
                    <div class="tafseer-table-header">
                        <div class="th-num">الآية</div>
                        <div class="th-ayah">نص الآية الكريمة</div>
                        <div class="th-tafseer">التفسير (${data.tafseerName || 'المعتمد'})</div>
                    </div>
                    <div id="tafseer-rows-body"></div>
                </div>
                <div id="load-more-section"></div>
                <div id="sadaqallah-section" style="display: none;">
                    <div class="sadaqallah-box">
                        <span class="sadaqallah-line"></span>
                        <span class="sadaqallah-text">« صَدَقَ اللَّهُ الْعَظِيمُ »</span>
                        <span class="sadaqallah-line"></span>
                    </div>
                </div>
            `;

            contentContainer.innerHTML = bodyHtml;

            // Determine how many ayahs to render initially
            const initialCount = targetAyahNumber ? Math.max(targetAyahNumber, BATCH_SIZE) : BATCH_SIZE;
            renderBatch(initialCount);

            if (targetAyahNumber) {
                setTimeout(() => {
                    jumpToAyah(targetAyahNumber);
                }, 200);
            }
        }

        function renderBatch(count) {
            if (!currentSurahData) return;
            const rowsBody = document.getElementById('tafseer-rows-body');
            const total = currentSurahData.ayahs.length;
            const targetCount = Math.min(currentRenderedAyahsCount + count, total);

            let rowsHtml = '';
            for (let i = currentRenderedAyahsCount; i < targetCount; i++) {
                const ayah = currentSurahData.ayahs[i];
                let text = ayah.text;
                if (currentSurahData.number !== 1 && i === 0 && text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
                    text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
                }

                rowsHtml += `
                    <div class="tafseer-row" id="ayah-row-${ayah.numberInSurah}">
                        <!-- Col 1: Number and Transparent Actions -->
                        <div class="td-controls">
                            <div class="ayah-circle-badge">${ayah.numberInSurah}</div>
                            <div class="row-action-buttons">
                                <button class="ayah-action-btn" title="استمع للآية" aria-label="استمع للآية" onclick="togglePlayAyah(this, ${ayah.number})">
                                    <i class="fa-solid fa-play"></i>
                                </button>
                                <button class="ayah-action-btn" title="نسخ الآية والتفسير" aria-label="نسخ الآية والتفسير" onclick="copyAyahTafseer(${ayah.numberInSurah})">
                                    <i class="fa-regular fa-copy"></i>
                                </button>
                                <button class="ayah-action-btn" title="مشاركة الآية والتفسير" aria-label="مشاركة الآية والتفسير" onclick="shareAyahTafseer(${ayah.numberInSurah})">
                                    <i class="fa-solid fa-share-nodes"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Col 2: The Quranic Verse -->
                        <div class="td-ayah">
                            <div class="ayah-arabic-text">
                                ${text}
                                <span class="ayah-inline-num">${ayah.numberInSurah}</span>
                            </div>
                        </div>

                        <!-- Col 3: The Tafseer -->
                        <div class="td-tafseer">
                            <div class="tafseer-text">
                                ${ayah.tafseer}
                            </div>
                        </div>
                    </div>
                `;
            }

            rowsBody.insertAdjacentHTML('beforeend', rowsHtml);
            currentRenderedAyahsCount = targetCount;

            updateLoadMoreSection();
        }

        function appendNextBatch() {
            renderBatch(BATCH_SIZE);
        }

        function updateLoadMoreSection() {
            const loadMoreSection = document.getElementById('load-more-section');
            const sadaqallahSection = document.getElementById('sadaqallah-section');
            if (!loadMoreSection || !currentSurahData) return;

            const remaining = currentSurahData.numberOfAyahs - currentRenderedAyahsCount;

            if (remaining > 0) {
                loadMoreSection.innerHTML = `
                    <div class="load-more-container">
                        <button id="load-more-btn" class="load-more-btn" onclick="appendNextBatch()">
                            <i class="fa-solid fa-angles-down"></i> تحميل باقي الآيات (متبقي ${remaining} آية)
                        </button>
                    </div>
                `;
                if (sadaqallahSection) sadaqallahSection.style.display = 'none';
            } else {
                loadMoreSection.innerHTML = '';
                if (sadaqallahSection) sadaqallahSection.style.display = 'block';
            }
        }

        function togglePlayAyah(btn, globalAyahNum) {
            const audioSrc = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNum}.mp3`;

            if (currentPlayingAyahBtn === btn && !ayahAudio.paused) {
                stopAudio();
                return;
            }

            stopAudio();

            ayahAudio.src = audioSrc;
            currentPlayingAyahBtn = btn;
            btn.classList.add('playing');
            btn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
            btn.title = "إيقاف التلاوة";

            ayahAudio.play().catch(err => {
                console.warn("Audio play failed:", err);
                stopAudio();
                if (window.showToast) {
                    window.showToast("تعذر تشغيل الصوت للآية، يرجى المحاولة لاحقاً", "fa-solid fa-triangle-exclamation", 3500);
                }
            });
        }

        function stopAudio() {
            if (!ayahAudio.paused) {
                ayahAudio.pause();
            }
            if (currentPlayingAyahBtn) {
                currentPlayingAyahBtn.classList.remove('playing');
                currentPlayingAyahBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
                currentPlayingAyahBtn.title = "استمع للآية";
                currentPlayingAyahBtn = null;
            }
        }

        ayahAudio.addEventListener('ended', () => stopAudio());
        ayahAudio.addEventListener('error', () => stopAudio());

        function copyAyahTafseer(ayahNumberInSurah) {
            if (!currentSurahData) return;
            const ayah = currentSurahData.ayahs.find(a => a.numberInSurah === ayahNumberInSurah);
            if (!ayah) return;

            const copyText = `﴿ ${ayah.text} ﴾ [${currentSurahData.name} : آية ${ayah.numberInSurah}]\n\n📖 ${currentSurahData.tafseerName}:\n${ayah.tafseer}\n\n— عبر تطبيق قبلة المسلم`;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(copyText)
                    .then(() => {
                        if (window.showToast) {
                            window.showToast(`تم نسخ الآية (${ayahNumberInSurah}) وتفسيرها بنجاح`, "fa-solid fa-check", 3000);
                        }
                    })
                    .catch(() => fallbackCopy(copyText));
            } else {
                fallbackCopy(copyText);
            }
        }

        function fallbackCopy(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            if (window.showToast) {
                window.showToast("تم نسخ الآية وتفسيرها للحافظة", "fa-solid fa-check", 3000);
            }
        }

        function shareAyahTafseer(ayahNumberInSurah) {
            if (!currentSurahData) return;
            const ayah = currentSurahData.ayahs.find(a => a.numberInSurah === ayahNumberInSurah);
            if (!ayah) return;

            const shareData = {
                title: `${currentSurahData.name} - آية ${ayah.numberInSurah}`,
                text: `﴿ ${ayah.text} ﴾ [${currentSurahData.name} : ${ayah.numberInSurah}]\n\n📖 التفسير:\n${ayah.tafseer}`,
                url: `${window.location.origin}${window.location.pathname}?surah=${currentSurahData.number}&ayah=${ayah.numberInSurah}`
            };

            if (navigator.share) {
                navigator.share(shareData).catch(err => console.log("Share canceled", err));
            } else {
                copyAyahTafseer(ayahNumberInSurah);
            }
        }

        fetchSurahs();
