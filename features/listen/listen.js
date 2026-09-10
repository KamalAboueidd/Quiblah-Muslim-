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

    const audio = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('btn-play-pause');

    window.addEventListener('DOMContentLoaded', () => {
        fetchReciters();
        
        // Mobile expand
        document.getElementById('player-bar').addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !e.target.closest('.btn-play') && !e.target.closest('.mobile-expand-btn') && !e.target.closest('.progress-bar')) {
                document.getElementById('player-bar').classList.add('expanded');
                document.body.style.overflow = 'hidden';
            }
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            renderReciters(query);
        });
    });

    function togglePlayerExpand(e) {
        e.stopPropagation();
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
        
        const headerIcon = document.querySelector('.reciter-header .reciter-icon');
        const imgUrl = RECITER_IMAGES[reciter.id] || `https://ui-avatars.com/api/?name=${encodeURIComponent(reciter.name)}&background=116035&color=C5A859&size=150&font-size=0.33&bold=true`;
        
        headerIcon.style.backgroundImage = `url('${imgUrl}')`;
        headerIcon.style.backgroundSize = 'cover';
        headerIcon.style.backgroundPosition = 'top center';
        headerIcon.innerHTML = '';
        
        // Set player thumb image too
        const playerThumb = document.querySelector('.player-thumb');
        playerThumb.style.backgroundImage = `url('${imgUrl}')`;
        playerThumb.style.backgroundSize = 'cover';
        playerThumb.style.backgroundPosition = 'top center';
        playerThumb.innerHTML = '';

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

    function playSurah(num, server, reciterName) {
        const numStr = String(num).padStart(3, '0');
        const serverUrl = server.endsWith('/') ? server : server + '/';
        const url = `${serverUrl}${numStr}.mp3`;
        
        // Forward to persistent parent shell if present
        if (window.parent && window.parent !== window && typeof window.parent.playGlobalQuran === 'function') {
            const currentReciterObj = allReciters.find(r => r.name === reciterName);
            const imgUrl = (currentReciterObj && RECITER_IMAGES[currentReciterObj.id]) || `https://ui-avatars.com/api/?name=${encodeURIComponent(reciterName)}&background=116035&color=C5A859&size=150&font-size=0.33&bold=true`;
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
            return;
        }

        if (currentPlayingSurahNum === num && currentReciterName === reciterName) {
            // Toggle play/pause if clicking the same surah
            togglePlayPause();
            // Also auto-expand on mobile if clicked again
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
        document.getElementById('progress-fill').style.width = '0%';
        document.getElementById('progress-thumb').style.left = '0%';
        document.getElementById('time-current').textContent = '0:00';
        
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

    audio.addEventListener('timeupdate', () => {
        const c = audio.currentTime;
        const d = audio.duration;
        if (d) {
            const pct = (c / d) * 100;
            // Since LTR, width expands from left to right
            document.getElementById('progress-fill').style.width = `${pct}%`;
            document.getElementById('progress-thumb').style.left = `${pct}%`;
            document.getElementById('time-current').textContent = formatTime(c);
            document.getElementById('time-total').textContent = formatTime(d);
        }
    });

    audio.addEventListener('ended', () => playNext());

    function seek(e) {
        e.stopPropagation();
        if (!audio.duration) return;
        const bar = document.getElementById('progress-bar');
        const rect = bar.getBoundingClientRect();
        // LTR logic: x is from left, progress grows to right
        const clickX = e.clientX - rect.left;
        let pct = clickX / rect.width;
        if (pct < 0) pct = 0;
        if (pct > 1) pct = 1;
        audio.currentTime = pct * audio.duration;
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
