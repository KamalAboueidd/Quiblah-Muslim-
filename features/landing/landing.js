// features/landing/landing.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© index.html
// 114 Surah Names in Arabic
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

        // Background Carousel
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 8000);

        // App Elements
        const appFrame = document.getElementById('app-frame');
        const loadingBar = document.getElementById('nav-loading-bar');
        const audio = document.getElementById('global-quran-audio');
        const playerBar = document.getElementById('global-player-bar');
        const playerThumb = document.getElementById('player-thumb');
        const playerSurahTitle = document.getElementById('player-surah-title');
        const playerReciterTitle = document.getElementById('player-reciter-title');
        const btnPlayPause = document.getElementById('btn-play-pause');
        const scrubberBar = document.getElementById('scrubber-bar');
        const scrubberFill = document.getElementById('scrubber-fill');
        const scrubberThumb = document.getElementById('scrubber-thumb');
        const playerTopProgress = document.getElementById('player-top-progress');
        const playerTopFill = document.getElementById('player-top-fill');
        const timeCurrent = document.getElementById('time-current');
        const timeTotal = document.getElementById('time-total');
        const volumeBar = document.getElementById('volume-bar');
        const volumeFill = document.getElementById('volume-fill');
        const btnMute = document.getElementById('btn-mute');

        // State
        let currentSurahNum = 1;
        let currentReciterName = "مشاري العفاسي";
        let currentServerUrl = "https://server8.mp3quran.net/afs/";
        let currentSurahList = Array.from({length: 114}, (_, i) => i + 1);
        let currentReciterImg = "";
        let isAudioPlaying = false;
        let isScrubbing = false;
        let showRemainingTime = true;

        // Initialize target page from URL param (e.g. index.html?page=quran.html)
        const params = new URLSearchParams(window.location.search);
        const targetPage = params.get('page');
        if (targetPage) {
            appFrame.src = decodeURIComponent(targetPage);
        }

        // Iframe Navigation & Title Synchronization
        appFrame.addEventListener('load', () => {
            loadingBar.style.width = '100%';
            setTimeout(() => {
                loadingBar.style.opacity = '0';
                loadingBar.style.width = '0%';
            }, 300);

            try {
                const innerWin = appFrame.contentWindow;
                const innerDoc = appFrame.contentDocument;
                if (innerDoc && innerDoc.title) {
                    document.title = innerDoc.title;
                }
                const fullPath = innerWin.location.pathname.split('/').pop() + innerWin.location.search;
                if (fullPath && fullPath !== 'home.html') {
                    history.replaceState(null, '', 'index.html?page=' + encodeURIComponent(fullPath));
                } else {
                    history.replaceState(null, '', 'index.html');
                }
            } catch(e) {
                // Cross-origin fallback (should not happen on local/same-origin)
            }
        });

        // Browser Back / Forward handler
        window.addEventListener('popstate', () => {
            const currentParams = new URLSearchParams(window.location.search);
            const p = currentParams.get('page') || 'home.html';
            appFrame.src = decodeURIComponent(p);
        });

        // PostMessage Listener for Cross-Frame Communication
        window.addEventListener('message', (event) => {
            if (!event.data) return;
            if (event.data.type === 'PLAY_QURAN' && event.data.options) {
                window.playGlobalQuran(event.data.options);
            }
            if (event.data.type === 'PAGE_NAVIGATED') {
                if (event.data.title) document.title = event.data.title;
                if (event.data.page && event.data.page !== 'home.html') {
                    history.replaceState(null, '', 'index.html?page=' + encodeURIComponent(event.data.page));
                } else if (event.data.page === 'home.html') {
                    history.replaceState(null, '', 'index.html');
                }
            }
        });

        // Format Seconds to MM:SS
        function formatSeconds(sec) {
            if (isNaN(sec) || !isFinite(sec)) return "0:00";
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = Math.floor(sec % 60);
            if (h > 0) {
                return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }
            return `${m}:${s.toString().padStart(2, '0')}`;
        }

        // --- Master Play Surah Function ---
        window.playGlobalQuran = function(opts) {
            if (!opts) return;
            const surahNum = opts.surahNum || 1;
            const reciter = opts.reciterName || "مشاري العفاسي";
            const surahTitle = opts.surahName || `سورة ${SURAH_NAMES[surahNum - 1]}`;
            const audioSrc = opts.audioUrl || (opts.serverUrl ? `${opts.serverUrl}${String(surahNum).padStart(3, '0')}.mp3` : `https://server8.mp3quran.net/afs/${String(surahNum).padStart(3, '0')}.mp3`);
            
            currentSurahNum = surahNum;
            currentReciterName = reciter;
            if (opts.serverUrl) currentServerUrl = opts.serverUrl;
            if (opts.surahList) currentSurahList = opts.surahList;
            if (opts.reciterImg) currentReciterImg = opts.reciterImg;

            // Update UI
            playerSurahTitle.textContent = surahTitle;
            playerReciterTitle.textContent = reciter;
            if (currentReciterImg) {
                playerThumb.style.backgroundImage = `url('${currentReciterImg}')`;
                playerThumb.innerHTML = '';
            } else {
                playerThumb.style.backgroundImage = 'none';
                playerThumb.innerHTML = '<i class="fa-solid fa-book-quran"></i>';
            }

            // Reveal player bar
            playerBar.classList.add('visible');
            document.body.classList.add('player-active');

            // Reset progress & loader
            if (scrubberFill) scrubberFill.style.width = '0%';
            if (scrubberThumb) scrubberThumb.style.left = '0%';
            if (playerTopFill) {
                playerTopFill.style.width = '0%';
                playerTopFill.classList.add('buffering');
            }
            if (timeCurrent) timeCurrent.textContent = '0:00';
            if (timeTotal) timeTotal.textContent = '-0:00';

            // Set audio source & play
            audio.src = audioSrc;
            audio.play().then(() => {
                isAudioPlaying = true;
                updatePlayPauseState();
                setupMediaSession(surahTitle, reciter);
            }).catch(err => {
                console.warn("Autoplay blocked or network error:", err);
                isAudioPlaying = false;
                updatePlayPauseState();
            });
        };

        // --- MediaSession for Background & Lock Screen Playback ---
        function setupMediaSession(surahTitle, reciter) {
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: surahTitle,
                    artist: reciter,
                    album: 'قبلة المسلم',
                    artwork: [
                        { src: currentReciterImg || 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                        { src: currentReciterImg || 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                        { src: 'icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
                    ]
                });

                navigator.mediaSession.setActionHandler('play', () => {
                    audio.play();
                    isAudioPlaying = true;
                    updatePlayPauseState();
                });
                navigator.mediaSession.setActionHandler('pause', () => {
                    audio.pause();
                    isAudioPlaying = false;
                    updatePlayPauseState();
                });
                navigator.mediaSession.setActionHandler('previoustrack', () => playPrevSurah());
                navigator.mediaSession.setActionHandler('nexttrack', () => playNextSurah());
                navigator.mediaSession.setActionHandler('seekto', (details) => {
                    if (details.seekTime && audio.duration) {
                        audio.currentTime = details.seekTime;
                    }
                });
            }
        }

        // Play / Pause Toggle
        function togglePlayPause(e) {
            if (e) e.stopPropagation();
            if (!audio.src) return;
            if (audio.paused) {
                audio.play();
                isAudioPlaying = true;
            } else {
                audio.pause();
                isAudioPlaying = false;
            }
            updatePlayPauseState();
        }

        function updatePlayPauseState() {
            btnPlayPause.innerHTML = isAudioPlaying 
                ? '<i class="fa-solid fa-pause"></i>' 
                : '<i class="fa-solid fa-play"></i>';
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = isAudioPlaying ? 'playing' : 'paused';
            }
        }

        // Next / Prev Surah
        function playNextSurah(e) {
            if (e) e.stopPropagation();
            const currentIndex = currentSurahList.indexOf(currentSurahNum);
            if (currentIndex !== -1 && currentIndex < currentSurahList.length - 1) {
                const nextNum = currentSurahList[currentIndex + 1];
                window.playGlobalQuran({
                    surahNum: nextNum,
                    surahName: `سورة ${SURAH_NAMES[nextNum - 1]}`,
                    reciterName: currentReciterName,
                    serverUrl: currentServerUrl,
                    surahList: currentSurahList,
                    reciterImg: currentReciterImg
                });
            }
        }

        function playPrevSurah(e) {
            if (e) e.stopPropagation();
            const currentIndex = currentSurahList.indexOf(currentSurahNum);
            if (currentIndex > 0) {
                const prevNum = currentSurahList[currentIndex - 1];
                window.playGlobalQuran({
                    surahNum: prevNum,
                    surahName: `سورة ${SURAH_NAMES[prevNum - 1]}`,
                    reciterName: currentReciterName,
                    serverUrl: currentServerUrl,
                    surahList: currentSurahList,
                    reciterImg: currentReciterImg
                });
            }
        }

        // Buffering & Network state handling
        audio.addEventListener('waiting', () => {
            if (playerTopFill) playerTopFill.classList.add('buffering');
            if (scrubberFill) scrubberFill.classList.add('buffering');
        });
        audio.addEventListener('playing', () => {
            if (playerTopFill) playerTopFill.classList.remove('buffering');
            if (scrubberFill) scrubberFill.classList.remove('buffering');
        });
        audio.addEventListener('canplay', () => {
            if (playerTopFill) playerTopFill.classList.remove('buffering');
            if (scrubberFill) scrubberFill.classList.remove('buffering');
        });

        // Audio Progress Updates
        audio.addEventListener('timeupdate', () => {
            if (isScrubbing || !audio.duration) return;
            const c = audio.currentTime;
            const d = audio.duration;
            const percent = (c / d) * 100;
            
            if (scrubberFill) scrubberFill.style.width = `${percent}%`;
            if (scrubberThumb) scrubberThumb.style.left = `${percent}%`;
            if (playerTopFill) playerTopFill.style.width = `${percent}%`;
            
            if (timeCurrent) timeCurrent.textContent = formatSeconds(c);
            
            const remaining = Math.max(0, d - c);
            const remainingFormatted = '-' + formatSeconds(remaining);
            
            if (timeTotal) {
                timeTotal.textContent = showRemainingTime ? remainingFormatted : formatSeconds(d);
            }
        });

        audio.addEventListener('loadedmetadata', () => {
            if (timeTotal && audio.duration) {
                const remaining = Math.max(0, audio.duration - audio.currentTime);
                timeTotal.textContent = showRemainingTime ? ('-' + formatSeconds(remaining)) : formatSeconds(audio.duration);
            }
        });

        // Click to toggle between remaining time (-mm:ss) and total duration (mm:ss)
        if (timeTotal) {
            timeTotal.addEventListener('click', (e) => {
                e.stopPropagation();
                showRemainingTime = !showRemainingTime;
                if (audio.duration) {
                    const remaining = Math.max(0, audio.duration - audio.currentTime);
                    timeTotal.textContent = showRemainingTime ? ('-' + formatSeconds(remaining)) : formatSeconds(audio.duration);
                }
            });
        }

        audio.addEventListener('ended', () => {
            playNextSurah();
        });

        // Unified Seeking helper
        function seekElement(e, element) {
            if (!audio.duration) return;
            const rect = element.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clickX = clientX - rect.left;
            const percent = Math.max(0, Math.min(1, clickX / rect.width));
            audio.currentTime = percent * audio.duration;
            const p = percent * 100;
            if (scrubberFill) scrubberFill.style.width = `${p}%`;
            if (scrubberThumb) scrubberThumb.style.left = `${p}%`;
            if (playerTopFill) playerTopFill.style.width = `${p}%`;
            if (timeCurrent) timeCurrent.textContent = formatSeconds(audio.currentTime);
            const remaining = Math.max(0, audio.duration - audio.currentTime);
            const remStr = '-' + formatSeconds(remaining);
            if (timeTotal) timeTotal.textContent = showRemainingTime ? remStr : formatSeconds(audio.duration);
        }

        // Seeking on top edge progress loader
        if (playerTopProgress) {
            playerTopProgress.addEventListener('click', (e) => {
                e.stopPropagation();
                seekElement(e, playerTopProgress);
            });
        }

        // Seeking on center scrubber with click & drag (mouse + touch)
        if (scrubberBar) {
            const startScrub = (e) => {
                isScrubbing = true;
                scrubberBar.classList.add('active');
                seekElement(e, scrubberBar);
            };
            const moveScrub = (e) => {
                if (!isScrubbing) return;
                seekElement(e, scrubberBar);
            };
            const endScrub = () => {
                if (isScrubbing) {
                    isScrubbing = false;
                    scrubberBar.classList.remove('active');
                }
            };

            scrubberBar.addEventListener('mousedown', startScrub);
            window.addEventListener('mousemove', moveScrub);
            window.addEventListener('mouseup', endScrub);

            scrubberBar.addEventListener('touchstart', startScrub, { passive: true });
            window.addEventListener('touchmove', moveScrub, { passive: true });
            window.addEventListener('touchend', endScrub);
        }

        // Volume Control
        volumeBar.addEventListener('click', (e) => {
            const rect = volumeBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(1, clickX / rect.width));
            audio.volume = percent;
            volumeFill.style.width = `${percent * 100}%`;
            updateVolumeIcon();
        });

        function toggleMute() {
            audio.muted = !audio.muted;
            updateVolumeIcon();
        }

        function updateVolumeIcon() {
            if (audio.muted || audio.volume === 0) {
                btnMute.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            } else if (audio.volume < 0.5) {
                btnMute.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
            } else {
                btnMute.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
        }

        // Mobile Player Expand / Collapse
        function expandPlayerMobile() {
            if (window.innerWidth <= 768) {
                playerBar.classList.add('expanded');
            }
        }

        function togglePlayerExpand(e) {
            if (e) e.stopPropagation();
            playerBar.classList.remove('expanded');
        }

        function closePlayer() {
            audio.pause();
            isAudioPlaying = false;
            playerBar.classList.remove('visible');
            playerBar.classList.remove('expanded');
            document.body.classList.remove('player-active');
        }
