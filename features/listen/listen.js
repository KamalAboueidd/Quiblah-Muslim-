// features/listen/listen.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© listen.html
// 114 Surah Names
    const SURAH_NAMES = [
        "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
        "هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
        "الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
        "لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
        "فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
        "الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
        "الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
        "نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
        "التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
        "الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
        "القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
        "المسد","الإخلاص","الفلق","الناس"
    ];

    // IDs of famous reciters to feature at the top (from API)
    // 92: Yasser Al Dosari, 51: Abdul Basit, 112: Minshawi, 118: Husary, 123: Mishary
    // 102: Maher, 86: Nasser Al Qatami, 5: Ahmed Al Ajmi, 30: Saad Al Ghamdi, 31: Saud Al Shuraim, 76: Ali Jaber, 106: Tablawi
    const CURATED_IDS = [92, 86, 5, 123, 102, 51, 112, 118, 30, 31, 76, 106]; 

    // Images for curated reciters (using tested working URLs only)
    const RECITER_IMAGES = {
        92: "https://tvquran.com/uploads/authors/images/%D9%8A%D8%A7%D8%B3%D8%B1%20%D8%A7%D9%84%D8%AF%D9%88%D8%B3%D8%B1%D9%8A.jpg", // Yasser Al Dosari
        51: "https://tvquran.com/uploads/authors/images/%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D8%B5%D9%85%D8%AF.jpg", // Abdul Basit
        112: "assets/minshawi.jpg", // Minshawi
        118: "https://tvquran.com/uploads/authors/images/%D9%85%D8%AD%D9%85%D9%88%D8%AF%20%D8%AE%D9%84%D9%8A%D9%84%20%D8%A7%D9%84%D8%AD%D8%B5%D8%B1%D9%8A.jpg", // Husary
        123: "https://tvquran.com/uploads/authors/images/%D9%85%D8%B4%D8%A7%D8%B1%D9%8A%20%D8%A7%D9%84%D8%B9%D9%81%D8%A7%D8%B3%D9%8A.jpg", // Mishary
        102: "https://tvquran.com/uploads/authors/images/%D9%85%D8%A7%D9%87%D8%B1%20%D8%A7%D9%84%D9%85%D8%B9%D9%8A%D9%82%D9%84%D9%8A.jpg", // Maher
        86: "https://tvquran.com/uploads/authors/images/%D9%86%D8%A7%D8%B5%D8%B1%20%D8%A7%D9%84%D9%82%D8%B7%D8%A7%D9%85%D9%8A.jpg", // Nasser Al Qatami
        5: "https://tvquran.com/uploads/authors/images/%D8%A3%D8%AD%D9%85%D8%AF%20%D8%A8%D9%86%20%D8%B9%D9%84%D9%8A%20%D8%A7%D9%84%D8%B9%D8%AC%D9%85%D9%8A.jpg", // Ahmed Al Ajmi
        30: "https://tvquran.com/uploads/authors/images/%D8%B3%D8%B9%D8%AF%20%D8%A7%D9%84%D8%BA%D8%A7%D9%85%D8%AF%D9%8A.jpg", // Saad Al Ghamdi
        31: "https://tvquran.com/uploads/authors/images/%D8%B3%D8%B9%D9%88%D8%AF%20%D8%A7%D9%84%D8%B4%D8%B1%D9%8A%D9%85.jpg", // Saud Al Shuraim
        76: "https://tvquran.com/uploads/authors/images/%D8%B9%D9%84%D9%8A%20%D8%AC%D8%A7%D8%A8%D8%B1.jpg", // Ali Jaber
        106: "https://tvquran.com/uploads/authors/images/%D9%85%D8%AD%D9%85%D8%AF%20%D9%85%D8%AD%D9%85%D9%88%D8%AF%20%D8%A7%D9%84%D8%B7%D8%A8%D9%84%D8%A7%D9%88%D9%8A.jpg" // Tablawi
    };

    let allReciters = [];
    let currentServer = "";
    let currentReciterName = "";
    let currentSurahList = []; // array of int surah numbers
    let currentPlayingSurahNum = null;
    let isPlaying = false;
    let isScrubbing = false;
    let showRemainingTime = true;

    const audio = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('btn-play-pause');

    let originalThemeColor = '#0b0d12';
    function setMetaThemeColor(color) {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', color);
    }

    window.addEventListener('DOMContentLoaded', () => {
        fetchReciters();
        
        // Mobile expand
        document.getElementById('player-bar').addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !e.target.closest('.btn-play') && !e.target.closest('.mobile-expand-btn') && !e.target.closest('.progress-bar') && !e.target.closest('.mobile-footer-btn')) {
                expandPlayerMobile();
            }
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            renderReciters(query);
        });
    });

    function togglePlayerExpand(e) {
        if (e) e.stopPropagation();
        setMetaThemeColor(originalThemeColor);
        document.getElementById('player-bar').classList.remove('expanded');
        document.body.style.overflow = '';
    }

    function fetchReciters() {
        document.getElementById('loader-reciters').style.display = 'block';
        axios.get('https://www.mp3quran.net/api/v3/reciters?language=ar')
            .then(res => {
                allReciters = res.data.reciters;
                document.getElementById('loader-reciters').style.display = 'none';
                renderReciters();
            })
            .catch(err => {
                showToast('فشل في تحميل بيانات القراء', 'fa-solid fa-triangle-exclamation');
                document.getElementById('loader-reciters').style.display = 'none';
            });
    }

    function renderReciters(query = "") {
        const curatedGrid = document.getElementById('curated-grid');
        const allGrid = document.getElementById('all-grid');
        curatedGrid.innerHTML = "";
        allGrid.innerHTML = "";

        const curated = [];
        const others = [];

        allReciters.forEach(reciter => {
            if (query && !reciter.name.toLowerCase().includes(query)) return;
            if (CURATED_IDS.includes(reciter.id) && !query) curated.push(reciter);
            else others.push(reciter);
        });

        if (query) {
            document.getElementById('curated-container').style.display = 'none';
            others.forEach(r => allGrid.appendChild(createReciterCard(r)));
        } else {
            document.getElementById('curated-container').style.display = 'block';
            curated.forEach(r => curatedGrid.appendChild(createReciterCard(r)));
            others.forEach(r => allGrid.appendChild(createReciterCard(r)));
        }
    }

    function createReciterCard(reciter) {
        const div = document.createElement('div');
        div.className = 'reciter-card';
        
        // Use provided real image, or fallback to a generated avatar with their name
        const imgUrl = RECITER_IMAGES[reciter.id] || `https://ui-avatars.com/api/?name=${encodeURIComponent(reciter.name)}&background=116035&color=C5A859&size=150&font-size=0.33&bold=true`;
        
        const iconHtml = `<div class="reciter-icon" style="background-image: url('${imgUrl}'); background-size: cover; background-position: top center;"></div>`;

        div.innerHTML = `
            ${iconHtml}
            <div class="reciter-name">${reciter.name}</div>
        `;
        div.onclick = () => openReciter(reciter);
        return div;
    }

    function openReciter(reciter) {
        if (!reciter.moshaf || reciter.moshaf.length === 0) {
            showToast('لا توجد تلاوات متاحة لهذا القارئ حالياً', 'fa-solid fa-info-circle');
            return;
        }
        
        // Pick the first available moshaf
        const moshaf = reciter.moshaf[0];
        currentServer = moshaf.server;
        currentReciterName = reciter.name;
        currentSurahList = moshaf.surah_list.split(',').map(Number);

        document.getElementById('current-reciter-name').textContent = reciter.name;
        document.getElementById('current-moshaf-name').textContent = moshaf.name;
        
        const imgUrl = RECITER_IMAGES[reciter.id] || `https://ui-avatars.com/api/?name=${encodeURIComponent(reciter.name)}&background=116035&color=C5A859&size=150&font-size=0.33&bold=true`;
        
        const heroAvatar = document.getElementById('spotify-hero-avatar');
        if (heroAvatar) {
            heroAvatar.style.backgroundImage = `url('${imgUrl}')`;
            heroAvatar.style.backgroundSize = 'cover';
            heroAvatar.style.backgroundPosition = 'top center';
        }

        const sideReciterName = document.getElementById('side-reciter-name');
        if (sideReciterName) sideReciterName.textContent = reciter.name;

        const sideReciterTitle = document.getElementById('side-reciter-title');
        if (sideReciterTitle) sideReciterTitle.textContent = reciter.name;

        const sidePanelArt = document.getElementById('side-panel-art');
        if (sidePanelArt) {
            sidePanelArt.style.backgroundImage = `url('${imgUrl}')`;
            sidePanelArt.style.backgroundSize = 'cover';
            sidePanelArt.style.backgroundPosition = 'top center';
        }

        const sideTrackTitle = document.getElementById('side-track-title');
        if (sideTrackTitle && currentSurahList.length > 0) {
            sideTrackTitle.textContent = `سورة ${SURAH_NAMES[currentSurahList[0] - 1]}`;
        }
        
        // Set player thumb image too
        const playerThumb = document.getElementById('player-thumb');
        if (playerThumb) {
            playerThumb.style.backgroundImage = `url('${imgUrl}')`;
            playerThumb.style.backgroundSize = 'cover';
            playerThumb.style.backgroundPosition = 'top center';
            playerThumb.innerHTML = '';
        }

        renderSurahs();
        
        document.getElementById('view-reciters').classList.remove('active');
        document.getElementById('view-surahs').classList.add('active');
        window.scrollTo(0, 0);
    }

    function showReciters() {
        document.getElementById('view-surahs').classList.remove('active');
        document.getElementById('view-reciters').classList.add('active');
    }

    function renderSurahs() {
        const list = document.getElementById('surah-list');
        list.innerHTML = "";

        currentSurahList.forEach(num => {
            const item = document.createElement('div');
            item.className = 'surah-item';
            item.id = `surah-row-${num}`;
            if (currentPlayingSurahNum === num && currentReciterName === document.getElementById('player-reciter-name').textContent) {
                item.classList.add('playing');
            }
            
            const isPlayingThis = item.classList.contains('playing') && isPlaying;
            const playIconClass = isPlayingThis ? 'fa-pause' : 'fa-play';

            item.innerHTML = `
                <div class="surah-num">${num}</div>
                <div class="surah-name">سورة ${SURAH_NAMES[num - 1]}</div>
                <div class="play-icon"><i aria-hidden="true" class="fa-solid ${playIconClass}"></i></div>
            `;
            
            item.onclick = () => playSurah(num, currentServer, currentReciterName);
            list.appendChild(item);
        });
    }

    // --- Audio Player Logic ---
    function formatTime(sec) {
        if (isNaN(sec)) return "0:00";
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        } else {
            return `${m}:${s.toString().padStart(2, '0')}`;
        }
    }

    function playFirstSurah() {
        if (!currentSurahList || currentSurahList.length === 0) return;
        if (isPlaying && currentReciterName === document.getElementById('current-reciter-name').textContent) {
            togglePlayPause();
            return;
        }
        playSurah(currentSurahList[0], currentServer, currentReciterName);
    }

    function playSurah(num, server, reciterName) {
        const numStr = String(num).padStart(3, '0');
        const serverUrl = server.endsWith('/') ? server : server + '/';
        const url = `${serverUrl}${numStr}.mp3`;
        
        const currentReciterObj = allReciters.find(r => r.name === reciterName);
        const imgUrl = (currentReciterObj && RECITER_IMAGES[currentReciterObj.id]) || `https://ui-avatars.com/api/?name=${encodeURIComponent(reciterName)}&background=116035&color=C5A859&size=150&font-size=0.33&bold=true`;

        // Update Spotify Desktop Side Panel
        const sideTrackTitle = document.getElementById('side-track-title');
        if (sideTrackTitle) sideTrackTitle.textContent = `سورة ${SURAH_NAMES[num - 1]}`;
        const sideReciterTitle = document.getElementById('side-reciter-title');
        if (sideReciterTitle) sideReciterTitle.textContent = reciterName;
        const sidePanelArt = document.getElementById('side-panel-art');
        if (sidePanelArt) sidePanelArt.style.backgroundImage = `url('${imgUrl}')`;

        // Forward to persistent parent shell if present
        if (window.parent && window.parent !== window && typeof window.parent.playGlobalQuran === 'function') {
            window.parent.playGlobalQuran({
                surahNum: num,
                surahName: `سورة ${SURAH_NAMES[num - 1]}`,
                reciterName: reciterName,
                audioUrl: url,
                serverUrl: serverUrl,
                surahList: currentSurahList,
                reciterImg: imgUrl
            });
            currentPlayingSurahNum = num;
            isPlaying = true;
            updateSurahListUI();
            updatePlayPauseIcon();
            return;
        }

        if (currentPlayingSurahNum === num && currentReciterName === reciterName) {
            // Toggle play/pause if clicking the same surah
            togglePlayPause();
            if (window.innerWidth <= 768) {
                document.getElementById('player-bar').classList.add('expanded');
                document.body.style.overflow = 'hidden';
            }
            return;
        }

        currentPlayingSurahNum = num;
        
        // Update Player UI
        document.getElementById('player-surah-name').textContent = `سورة ${SURAH_NAMES[num - 1]}`;
        document.getElementById('player-reciter-name').textContent = reciterName;
        document.getElementById('player-bar').classList.add('visible');
        
        // Reset progress
        const progressFill = document.getElementById('progress-fill');
        const progressThumb = document.getElementById('progress-thumb');
        const timeCurrent = document.getElementById('time-current');
        const timeTotal = document.getElementById('time-total');

        if (progressFill) {
            progressFill.style.width = '0%';
            progressFill.classList.add('buffering');
        }
        if (progressThumb) progressThumb.style.left = '0%';
        if (timeCurrent) timeCurrent.textContent = '0:00';
        if (timeTotal) timeTotal.textContent = '-0:00';
        
        // Auto expand the player immediately on mobile just like Spotify
        if (window.innerWidth <= 768) {
            document.getElementById('player-bar').classList.add('expanded');
            document.body.style.overflow = 'hidden';
        }
        
        audio.src = url;
        
        // Optimistic UI update: instantly show pause icon while buffering
        isPlaying = true;
        updatePlayPauseIcon();
        updateSurahListUI();
        
        audio.play().catch(err => {
            isPlaying = false;
            updatePlayPauseIcon();
            updateSurahListUI();
            showToast('حدث خطأ أثناء تشغيل السورة', 'fa-solid fa-triangle-exclamation');
        });
    }

    function togglePlayPause(e) {
        if (e) e.stopPropagation();
        if (!audio.src) return;
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.play();
            isPlaying = true;
        }
        updatePlayPauseIcon();
        updateSurahListUI();
    }

    function playNext(e) {
        if (e) e.stopPropagation();
        if (!currentSurahList.length || !currentPlayingSurahNum) return;
        const currentIndex = currentSurahList.indexOf(currentPlayingSurahNum);
        if (currentIndex < currentSurahList.length - 1) {
            playSurah(currentSurahList[currentIndex + 1], currentServer, currentReciterName);
        }
    }

    function playPrev(e) {
        if (e) e.stopPropagation();
        if (!currentSurahList.length || !currentPlayingSurahNum) return;
        const currentIndex = currentSurahList.indexOf(currentPlayingSurahNum);
        if (currentIndex > 0) {
            playSurah(currentSurahList[currentIndex - 1], currentServer, currentReciterName);
        }
    }

    function updatePlayPauseIcon() {
        playPauseBtn.innerHTML = isPlaying ? '<i aria-hidden="true" class="fa-solid fa-pause"></i>' : '<i aria-hidden="true" class="fa-solid fa-play"></i>';
        if (window.innerWidth <= 768 && document.getElementById('player-bar').classList.contains('expanded')) {
             playPauseBtn.innerHTML = isPlaying ? '<i aria-hidden="true" class="fa-solid fa-pause"></i>' : '<i aria-hidden="true" class="fa-solid fa-play"></i>';
        }
    }

    function updateSurahListUI() {
        document.querySelectorAll('.surah-item').forEach(el => {
            el.classList.remove('playing');
            el.querySelector('.play-icon i').className = 'fa-solid fa-play';
        });
        
        const activeRow = document.getElementById(`surah-row-${currentPlayingSurahNum}`);
        if (activeRow && currentReciterName === document.getElementById('current-reciter-name').textContent) {
            activeRow.classList.add('playing');
            activeRow.querySelector('.play-icon i').className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        }
    }

    // Buffering Shimmer Handlers
    audio.addEventListener('waiting', () => {
        const pFill = document.getElementById('progress-fill');
        if (pFill) pFill.classList.add('buffering');
    });
    audio.addEventListener('playing', () => {
        const pFill = document.getElementById('progress-fill');
        if (pFill) pFill.classList.remove('buffering');
    });
    audio.addEventListener('canplay', () => {
        const pFill = document.getElementById('progress-fill');
        if (pFill) pFill.classList.remove('buffering');
    });

    audio.addEventListener('timeupdate', () => {
        if (isScrubbing || !audio.duration) return;
        const c = audio.currentTime;
        const d = audio.duration;
        const pct = (c / d) * 100;
        
        const progressFill = document.getElementById('progress-fill');
        const progressThumb = document.getElementById('progress-thumb');
        const timeCurrent = document.getElementById('time-current');
        const timeTotal = document.getElementById('time-total');

        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressThumb) progressThumb.style.left = `${pct}%`;
        
        if (timeCurrent) timeCurrent.textContent = formatTime(c);

        const remaining = Math.max(0, d - c);
        const remStr = '-' + formatTime(remaining);
        if (timeTotal) {
            timeTotal.textContent = showRemainingTime ? remStr : formatTime(d);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        const timeTotal = document.getElementById('time-total');
        if (timeTotal && audio.duration) {
            const remaining = Math.max(0, audio.duration - audio.currentTime);
            timeTotal.textContent = showRemainingTime ? ('-' + formatTime(remaining)) : formatTime(audio.duration);
        }
    });

    const timeTotalEl = document.getElementById('time-total');
    if (timeTotalEl) {
        timeTotalEl.addEventListener('click', (e) => {
            e.stopPropagation();
            showRemainingTime = !showRemainingTime;
            if (audio.duration) {
                const remaining = Math.max(0, audio.duration - audio.currentTime);
                timeTotalEl.textContent = showRemainingTime ? ('-' + formatTime(remaining)) : formatTime(audio.duration);
            }
        });
    }

    let isRepeatEnabled = false;
    audio.addEventListener('ended', () => {
        if (isRepeatEnabled) {
            audio.currentTime = 0;
            audio.play();
        } else {
            playNext();
        }
    });

    // Seeking Helper Function for center bar
    function seekFromElement(e, barElement) {
        if (!audio.duration) return;
        const rect = barElement.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clickX = clientX - rect.left;
        let pct = clickX / rect.width;
        if (pct < 0) pct = 0;
        if (pct > 1) pct = 1;
        audio.currentTime = pct * audio.duration;
        
        const p = pct * 100;
        const progressFill = document.getElementById('progress-fill');
        const progressThumb = document.getElementById('progress-thumb');
        const timeCurrent = document.getElementById('time-current');
        const timeTotal = document.getElementById('time-total');

        if (progressFill) progressFill.style.width = `${p}%`;
        if (progressThumb) progressThumb.style.left = `${p}%`;
        if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);

        const remaining = Math.max(0, audio.duration - audio.currentTime);
        const remStr = '-' + formatTime(remaining);
        if (timeTotal) timeTotal.textContent = showRemainingTime ? remStr : formatTime(audio.duration);
    }

    function seek(e) {
        seekFromElement(e, document.getElementById('progress-bar'));
    }

    function expandPlayerMobile() {
        if (window.innerWidth <= 768) {
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) originalThemeColor = meta.getAttribute('content') || '#0b0d12';
            setMetaThemeColor('#1c202a');
            document.getElementById('player-bar').classList.add('expanded');
            document.body.style.overflow = 'hidden';
        }
    }

    function toggleRepeat(e) {
        if (e) e.stopPropagation();
        isRepeatEnabled = !isRepeatEnabled;
        const btn = document.getElementById('btn-repeat');
        if (btn) btn.classList.toggle('active', isRepeatEnabled);
        showToast(isRepeatEnabled ? 'تم تفعيل تكرار السورة' : 'تم إلغاء تكرار السورة', 'fa-solid fa-repeat');
    }

    const PLAYBACK_SPEEDS = [1.0, 1.25, 1.5, 0.75];
    let currentSpeedIndex = 0;
    function cyclePlaybackSpeed(e) {
        if (e) e.stopPropagation();
        currentSpeedIndex = (currentSpeedIndex + 1) % PLAYBACK_SPEEDS.length;
        const newSpeed = PLAYBACK_SPEEDS[currentSpeedIndex];
        audio.playbackRate = newSpeed;
        const label = document.getElementById('speed-label');
        if (label) label.textContent = `${newSpeed}x`;
        showToast(`سرعة التلاوة: ${newSpeed}x`, 'fa-solid fa-gauge-high');
    }

    function toggleFavoriteSurah(e) {
        if (e) e.stopPropagation();
        const favBtn = document.getElementById('player-fav-btn');
        if (favBtn) {
            favBtn.classList.toggle('active');
            const isFav = favBtn.classList.contains('active');
            favBtn.innerHTML = `<i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
            showToast(isFav ? 'تمت إضافة السورة للمفضلة' : 'تمت إزالة السورة من المفضلة', isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart');
        }
    }

    function shareCurrentSurah(e) {
        if (e) e.stopPropagation();
        const trackName = document.getElementById('player-surah-name').textContent;
        const reciterName = document.getElementById('player-reciter-name').textContent;
        const text = `استمع الآن إلى ${trackName} بصوت ${reciterName} عبر تطبيق قبلة المسلم: ${window.location.href}`;
        if (navigator.share) {
            navigator.share({ title: 'قبلة المسلم', text: text, url: window.location.href }).catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('تم نسخ رابط التلاوة بنجاح', 'fa-solid fa-check');
            });
        }
    }

    // Touch and drag support for progress-bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const startScrub = (e) => {
            isScrubbing = true;
            progressBar.classList.add('active');
            seekFromElement(e, progressBar);
        };
        const moveScrub = (e) => {
            if (!isScrubbing) return;
            seekFromElement(e, progressBar);
        };
        const endScrub = () => {
            if (isScrubbing) {
                isScrubbing = false;
                progressBar.classList.remove('active');
            }
        };

        progressBar.addEventListener('mousedown', startScrub);
        window.addEventListener('mousemove', moveScrub);
        window.addEventListener('mouseup', endScrub);

        progressBar.addEventListener('touchstart', startScrub, { passive: true });
        window.addEventListener('touchmove', moveScrub, { passive: true });
        window.addEventListener('touchend', endScrub);
    }

    // --- Volume Control Logic ---
    let currentVolume = 1;
    function seekVolume(e) {
        e.stopPropagation();
        const bar = document.getElementById('volume-bar');
        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        // LTR logic
        let pct = clickX / rect.width;
        if (pct < 0) pct = 0;
        if (pct > 1) pct = 1;
        
        audio.volume = pct;
        currentVolume = pct;
        updateVolumeUI();
    }

    function toggleMute(e) {
        e.stopPropagation();
        if (audio.volume > 0) {
            audio.volume = 0;
        } else {
            audio.volume = currentVolume > 0 ? currentVolume : 1;
        }
        updateVolumeUI();
    }

    function updateVolumeUI() {
        const pct = audio.volume * 100;
        document.getElementById('volume-fill').style.width = `${pct}%`;
        document.getElementById('volume-thumb').style.left = `${pct}%`;
        
        const icon = document.getElementById('vol-icon');
        if (audio.volume === 0) icon.className = 'fa-solid fa-volume-xmark';
        else if (audio.volume < 0.5) icon.className = 'fa-solid fa-volume-low';
        else icon.className = 'fa-solid fa-volume-high';
    }

    // Initialize volume UI
    updateVolumeUI();

    // Background Carousel Rotation
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    if (slides && slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 8000);
    }
