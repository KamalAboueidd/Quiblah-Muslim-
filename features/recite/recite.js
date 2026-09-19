// features/recite/recite.js - استوديو المصحح القرآني الذكي الفاخر مطابق للتصميم بالملي

// -----------------------------------------------------------------------------
// 1. Surah Database (114 Surahs with Arabic Name & Total Ayat)
// -----------------------------------------------------------------------------
const SURAHS_DB = [
    { number: 1, name: "الفاتحة", ayat: 7 },
    { number: 2, name: "البقرة", ayat: 286 },
    { number: 3, name: "آل عمران", ayat: 200 },
    { number: 4, name: "النساء", ayat: 176 },
    { number: 5, name: "المائدة", ayat: 120 },
    { number: 6, name: "الأنعام", ayat: 165 },
    { number: 7, name: "الأعراف", ayat: 206 },
    { number: 8, name: "الأنفال", ayat: 75 },
    { number: 9, name: "التوبة", ayat: 129 },
    { number: 10, name: "يونس", ayat: 109 },
    { number: 11, name: "هود", ayat: 123 },
    { number: 12, name: "يوسف", ayat: 111 },
    { number: 13, name: "الرعد", ayat: 43 },
    { number: 14, name: "إبراهيم", ayat: 52 },
    { number: 15, name: "الحجر", ayat: 99 },
    { number: 16, name: "النحل", ayat: 128 },
    { number: 17, name: "الإسراء", ayat: 111 },
    { number: 18, name: "الكهف", ayat: 110 },
    { number: 19, name: "مريم", ayat: 98 },
    { number: 20, name: "طه", ayat: 135 },
    { number: 21, name: "الأنبياء", ayat: 112 },
    { number: 22, name: "الحج", ayat: 78 },
    { number: 23, name: "المؤمنون", ayat: 118 },
    { number: 24, name: "النور", ayat: 64 },
    { number: 25, name: "الفرقان", ayat: 77 },
    { number: 26, name: "الشعراء", ayat: 227 },
    { number: 27, name: "النمل", ayat: 93 },
    { number: 28, name: "القصص", ayat: 88 },
    { number: 29, name: "العنكبوت", ayat: 69 },
    { number: 30, name: "الروم", ayat: 60 },
    { number: 31, name: "لقمان", ayat: 34 },
    { number: 32, name: "السجدة", ayat: 30 },
    { number: 33, name: "الأحزاب", ayat: 73 },
    { number: 34, name: "سبأ", ayat: 54 },
    { number: 35, name: "فاطر", ayat: 45 },
    { number: 36, name: "يس", ayat: 83 },
    { number: 37, name: "الصافات", ayat: 182 },
    { number: 38, name: "ص", ayat: 88 },
    { number: 39, name: "الزمر", ayat: 75 },
    { number: 40, name: "غافر", ayat: 85 },
    { number: 41, name: "فصلت", ayat: 54 },
    { number: 42, name: "الشورى", ayat: 53 },
    { number: 43, name: "الزخرف", ayat: 89 },
    { number: 44, name: "الدخان", ayat: 59 },
    { number: 45, name: "الجاثية", ayat: 37 },
    { number: 46, name: "الأحقاف", ayat: 35 },
    { number: 47, name: "محمد", ayat: 38 },
    { number: 48, name: "الفتح", ayat: 29 },
    { number: 49, name: "الحجرات", ayat: 18 },
    { number: 50, name: "ق", ayat: 45 },
    { number: 51, name: "الذاريات", ayat: 60 },
    { number: 52, name: "الطور", ayat: 49 },
    { number: 53, name: "النجم", ayat: 62 },
    { number: 54, name: "القمر", ayat: 55 },
    { number: 55, name: "الرحمن", ayat: 78 },
    { number: 56, name: "الواقعة", ayat: 96 },
    { number: 57, name: "الحديد", ayat: 29 },
    { number: 58, name: "المجادلة", ayat: 22 },
    { number: 59, name: "الحشر", ayat: 24 },
    { number: 60, name: "الممتحنة", ayat: 13 },
    { number: 61, name: "الصف", ayat: 14 },
    { number: 62, name: "الجمعة", ayat: 11 },
    { number: 63, name: "المنافقون", ayat: 11 },
    { number: 64, name: "التغابن", ayat: 18 },
    { number: 65, name: "الطلاق", ayat: 12 },
    { number: 66, name: "التحريم", ayat: 12 },
    { number: 67, name: "الملك", ayat: 30 },
    { number: 68, name: "القلم", ayat: 52 },
    { number: 69, name: "الحاقة", ayat: 52 },
    { number: 70, name: "المعارج", ayat: 44 },
    { number: 71, name: "نوح", ayat: 28 },
    { number: 72, name: "الجن", ayat: 28 },
    { number: 73, name: "المزمل", ayat: 20 },
    { number: 74, name: "المدثر", ayat: 56 },
    { number: 75, name: "القيامة", ayat: 40 },
    { number: 76, name: "الإنسان", ayat: 31 },
    { number: 77, name: "المرسلات", ayat: 50 },
    { number: 78, name: "النبأ", ayat: 40 },
    { number: 79, name: "النازعات", ayat: 46 },
    { number: 80, name: "عبس", ayat: 42 },
    { number: 81, name: "التكوير", ayat: 29 },
    { number: 82, name: "الانفطار", ayat: 19 },
    { number: 83, name: "المطففين", ayat: 36 },
    { number: 84, name: "الانشقاق", ayat: 25 },
    { number: 85, name: "البروج", ayat: 22 },
    { number: 86, name: "الطارق", ayat: 17 },
    { number: 87, name: "الأعلى", ayat: 19 },
    { number: 88, name: "الغاشية", ayat: 26 },
    { number: 89, name: "الفجر", ayat: 30 },
    { number: 90, name: "البلد", ayat: 20 },
    { number: 91, name: "الشمس", ayat: 15 },
    { number: 92, name: "الليل", ayat: 21 },
    { number: 93, name: "الضحى", ayat: 11 },
    { number: 94, name: "الشرح", ayat: 8 },
    { number: 95, name: "التين", ayat: 8 },
    { number: 96, name: "العلق", ayat: 19 },
    { number: 97, name: "القدر", ayat: 5 },
    { number: 98, name: "البينة", ayat: 8 },
    { number: 99, name: "الزلزلة", ayat: 8 },
    { number: 100, name: "العاديات", ayat: 11 },
    { number: 101, name: "القارعة", ayat: 11 },
    { number: 102, name: "التكاثر", ayat: 8 },
    { number: 103, name: "العصر", ayat: 3 },
    { number: 104, name: "الهمزة", ayat: 9 },
    { number: 105, name: "الفيل", ayat: 5 },
    { number: 106, name: "قريش", ayat: 4 },
    { number: 107, name: "الماعون", ayat: 7 },
    { number: 108, name: "الكوثر", ayat: 3 },
    { number: 109, name: "الكافرون", ayat: 6 },
    { number: 110, name: "النصر", ayat: 3 },
    { number: 111, name: "المسد", ayat: 5 },
    { number: 112, name: "الإخلاص", ayat: 4 },
    { number: 113, name: "الفلق", ayat: 5 },
    { number: 114, name: "الناس", ayat: 6 }
];

// Offline Sample Verses for instant fallback
const LOCAL_SAMPLE_VERSES = {
    "1:1": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "1:2": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    "1:3": "الرَّحْمَٰنِ الرَّحِيمِ",
    "1:4": "مَالِكِ يَوْمِ الدِّينِ",
    "1:5": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    "1:6": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    "1:7": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    "112:1": "قُلْ هُوَ اللَّهُ أَحَدٌ",
    "112:2": "اللَّهُ الصَّمَدُ",
    "112:3": "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    "112:4": "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ"
};

// -----------------------------------------------------------------------------
// 2. Application State
// -----------------------------------------------------------------------------
let currentSurahNumber = null;
let currentAyahNumber = null;
let isFullSurahMode = false;
let recitationScopeMode = 'single'; // 'single' | 'range' | 'full'
let rangeFromAyah = 1;
let rangeToAyah = 1;
let currentSurahVerses = []; // Array of { numberInSurah, text, rawWords, normWords }
let currentTargetVerseText = "";

// Studio Mode State: 'recite' (عرض المصحف) vs 'memorize' (إخفاء النص وتسميع غيبي)
let studioDisplayMode = "recite";
let isVerseRevealed = false;

// Audio & Recording State
let audioExemplary = null;
let isExemplaryPlaying = false;
let currentPlayingAyahIndex = 0; // For full surah sequential playback
let mediaRecorder = null;
let audioChunks = [];
let audioStream = null;
let isRecording = false;
let recordStartTime = null;
let timerInterval = null;
let silenceTimer = null;
let recordedAudioBlob = null;

// Live Speech Recognition
let speechRecognizer = null;
let speechRestartTimeout = null;
let speechRestartAttempts = 0;
let liveTranscript = "";
let accumulatedSpeechText = "";
let currentInterimSpeechText = "";
let committedPreviousSessionsText = "";
let currentSessionFinalText = "";
let isRecognizing = false;
let audioCtx = null, audioAnalyser = null, audioAnimFrameId = null;
let lastAccuracy = 100;

// AI Engine Configuration
let aiEngineMode = localStorage.getItem("recite_engine_mode") || "smart_demo";
let makeWebhookUrl = localStorage.getItem("recite_make_webhook") || "";
let pythonServiceUrl = localStorage.getItem("recite_python_url") || "http://localhost:8080";
let hfApiToken = localStorage.getItem("recite_hf_token") || "";

// Brave Browser Detection Cache
let isBraveBrowserCached = false;
try {
    if (navigator.brave && typeof navigator.brave.isBrave === 'function') {
        navigator.brave.isBrave().then(val => { if (val) isBraveBrowserCached = true; }).catch(() => {});
    }
    if (/Brave/i.test(navigator.userAgent)) {
        isBraveBrowserCached = true;
    }
} catch (e) {}

// -----------------------------------------------------------------------------
// 3. DOM Elements Cache
// -----------------------------------------------------------------------------
let cardSelectSurah, selectedSurahDisplay, surahDropdownFlyout, surahSearchInput, surahItemsList;
let cardSelectAyah, selectedAyahDisplay, ayahDropdownFlyout, tabFullSurah, tabSingleAyah, tabRangeAyah;
let wrapSingleAyah, wrapRangeAyah, inputRangeFrom, inputRangeTo;
let btnRangeFromPrev, btnRangeFromNext, btnRangeToPrev, btnRangeToNext, btnApplyRange;
let inputAyahNum, btnAyahPrev, btnAyahNext, ayahMaxLabel, ayahGridScrollable;
let btnShowMushaf, mushafOpenBook;
let btnModeRecite, btnModeMemorize;
let mushafMemorizeCanvas, memorizeCanvasHint, btnRevealVerse, memorizeLiveWords;
let cardListenExemplary, btnPlayExemplary, exemplaryPlayIcon;
let cardReciteVoice, btnMainRecord, recordMicIcon;
let centerSurahTitle, centerAyahsRange, mushafPageBasmala, mushafVersesFlow;
let barBtnRecord, barRecordIcon, barWaveformVisualizer, barTimeDisplay, barRecordingIndicator, barRecLabel;
let quickListenContainer, btnQuickListen, quickListenIcon, quickListenText;
let barVolumeBtn, barVolumeIcon;
let playerStatusMain, playerStatusSub;

// New Live Speech & Evaluation UI Elements
let liveSpeechFeedbackStrip, speechFeedbackLabel, speechLiveTextDisplay;
let recitationEvalBanner, evalBannerScoreText, ebCorrectCount, ebErrorsCount, ebMissingCount, btnBannerOpenModal, evalBannerWordsGrid;
let evalBannerTranscript, ebTranscriptText, userRecitationPlayerBox, userRecitationAudio, btnDownloadUserAudio;
let userModalPlayerBox, userModalRecitationAudio, btnDownloadModalAudio;
let btnReReciteSimple, btnBannerReset;
let capBtnPlay, capPlayIcon, capTimeline, capTimelineFill, capTimelinePin, capCurrTime, capTotalTime, customLuxuryAudioBar;
let capModalBtnPlay, capModalPlayIcon, capModalTimeline, capModalTimelineFill, capModalTimelinePin, capModalCurrTime, capModalTotalTime, customModalAudioBar;

// Modals
let evaluationModalBackdrop, btnCloseEvaluation, scoreNumber, scoreEvaluationTitle;
let countCorrect, countErrors, countMissing, wordsAlignmentCloud, transcriptionTextDisplay;
let btnEvalRetry, btnEvalNext;
let settingsModal, btnOpenSettings, btnCloseSettings, btnSaveSettings;
let inputEngineMode, inputMakeWebhook, inputPythonUrl, inputHfToken;

// -----------------------------------------------------------------------------
// 4. Reliable Toast Notification Helper
// -----------------------------------------------------------------------------
function showToast(msg, icon = "fa-solid fa-circle-exclamation") {
    if (window.parent && window.parent !== window && typeof window.parent.showToast === 'function') {
        window.parent.showToast(msg, icon);
        return;
    }

    let container = document.getElementById('global-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'global-toast-container';
        document.body.appendChild(container);
    }

    // Clean up any stale toasts so multiple clicks don't stack up
    const existingToasts = container.querySelectorAll('.app-toast');
    existingToasts.forEach(t => {
        t.classList.remove('show');
        setTimeout(() => { if (t.parentElement) t.remove(); }, 300);
    });

    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.innerHTML = `<i class="${icon}"></i> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 15);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 500);
    }, 4500);
}
window.showToast = showToast;

// -----------------------------------------------------------------------------
// 5. Initialization
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    cacheDomElements();
    initSurahDropdown();
    initAyahDropdown();
    initEventListeners();
    initSettingsModal();

    // Default initial state: no surah/ayah selected until the user chooses one
    renderInitialEmptyState();
});

function cacheDomElements() {
    audioExemplary = document.getElementById('audio-exemplary');

    cardSelectSurah = document.getElementById('card-select-surah');
    selectedSurahDisplay = document.getElementById('selected-surah-display');
    surahDropdownFlyout = document.getElementById('surah-dropdown-flyout');
    surahSearchInput = document.getElementById('surah-search-input');
    surahItemsList = document.getElementById('surah-items-list');

    cardSelectAyah = document.getElementById('card-select-ayah');
    selectedAyahDisplay = document.getElementById('selected-ayah-display');
    ayahDropdownFlyout = document.getElementById('ayah-dropdown-flyout');
    tabFullSurah = document.getElementById('tab-full-surah');
    tabSingleAyah = document.getElementById('tab-single-ayah');
    tabRangeAyah = document.getElementById('tab-range-ayah');

    wrapSingleAyah = document.getElementById('wrap-single-ayah');
    wrapRangeAyah = document.getElementById('wrap-range-ayah');
    inputRangeFrom = document.getElementById('input-range-from');
    inputRangeTo = document.getElementById('input-range-to');
    btnRangeFromPrev = document.getElementById('btn-range-from-prev');
    btnRangeFromNext = document.getElementById('btn-range-from-next');
    btnRangeToPrev = document.getElementById('btn-range-to-prev');
    btnRangeToNext = document.getElementById('btn-range-to-next');
    btnApplyRange = document.getElementById('btn-apply-range');

    inputAyahNum = document.getElementById('input-ayah-num');
    btnAyahPrev = document.getElementById('btn-ayah-prev');
    btnAyahNext = document.getElementById('btn-ayah-next');
    ayahMaxLabel = document.getElementById('ayah-max-label');
    ayahGridScrollable = document.getElementById('ayah-grid-scrollable');

    btnShowMushaf = document.getElementById('btn-show-mushaf');
    mushafOpenBook = document.getElementById('mushaf-open-book');

    btnModeRecite = document.getElementById('btn-mode-recite');
    btnModeMemorize = document.getElementById('btn-mode-memorize');
    mushafMemorizeCanvas = document.getElementById('mushaf-memorize-canvas');
    memorizeCanvasHint = document.getElementById('memorize-canvas-hint');
    btnRevealVerse = document.getElementById('btn-reveal-verse');
    memorizeLiveWords = document.getElementById('memorize-live-words');

    cardListenExemplary = document.getElementById('card-listen-exemplary');
    btnPlayExemplary = document.getElementById('btn-play-exemplary');
    exemplaryPlayIcon = document.getElementById('exemplary-play-icon');

    cardReciteVoice = document.getElementById('card-recite-voice');
    btnMainRecord = document.getElementById('btn-main-record');
    recordMicIcon = document.getElementById('record-mic-icon');

    centerSurahTitle = document.getElementById('center-surah-title');
    centerAyahsRange = document.getElementById('center-ayahs-range');
    mushafPageBasmala = document.getElementById('mushaf-page-basmala');
    mushafVersesFlow = document.getElementById('mushaf-verses-flow');

    quickListenContainer = document.getElementById('quick-listen-container');
    btnQuickListen = document.getElementById('btn-quick-listen');
    quickListenIcon = document.getElementById('quick-listen-icon');
    quickListenText = document.getElementById('quick-listen-text');

    barBtnRecord = document.getElementById('bar-btn-record');
    barRecordIcon = document.getElementById('bar-record-icon');
    barWaveformVisualizer = document.getElementById('bar-waveform-visualizer');
    barTimeDisplay = document.getElementById('bar-time-display');
    barRecordingIndicator = document.getElementById('bar-recording-indicator');
    barRecLabel = document.getElementById('bar-rec-label');

    playerStatusMain = document.getElementById('player-status-main');
    playerStatusSub = document.getElementById('player-status-sub');

    evaluationModalBackdrop = document.getElementById('evaluation-modal-backdrop');
    btnCloseEvaluation = document.getElementById('btn-close-evaluation');
    scoreNumber = document.getElementById('score-number');
    scoreEvaluationTitle = document.getElementById('score-evaluation-title');
    countCorrect = document.getElementById('count-correct');
    countErrors = document.getElementById('count-errors');
    countMissing = document.getElementById('count-missing');
    wordsAlignmentCloud = document.getElementById('words-alignment-cloud');
    transcriptionTextDisplay = document.getElementById('transcription-text-display');
    btnEvalRetry = document.getElementById('btn-eval-retry');
    btnEvalNext = document.getElementById('btn-eval-next');

    settingsModal = document.getElementById('settings-modal');
    btnOpenSettings = document.getElementById('btn-open-settings');
    btnCloseSettings = document.getElementById('btn-close-settings');
    btnSaveSettings = document.getElementById('btn-save-settings');
    inputEngineMode = document.getElementById('setting-engine-mode');
    inputMakeWebhook = document.getElementById('setting-make-webhook');
    inputPythonUrl = document.getElementById('setting-python-url');
    inputHfToken = document.getElementById('setting-hf-token');

    liveSpeechFeedbackStrip = document.getElementById('live-speech-feedback-strip');
    speechFeedbackLabel = document.getElementById('speech-feedback-label');
    speechLiveTextDisplay = document.getElementById('speech-live-text-display');

    recitationEvalBanner = document.getElementById('recitation-eval-banner');
    evalBannerScoreText = document.getElementById('eval-banner-score-text');
    ebCorrectCount = document.getElementById('eb-correct-count');
    ebErrorsCount = document.getElementById('eb-errors-count');
    ebMissingCount = document.getElementById('eb-missing-count');
    btnBannerOpenModal = document.getElementById('btn-banner-open-modal');
    evalBannerWordsGrid = document.getElementById('eval-banner-words-grid');

    evalBannerTranscript = document.getElementById('eval-banner-transcript');
    ebTranscriptText = document.getElementById('eb-transcript-text');
    userRecitationPlayerBox = document.getElementById('user-recitation-player-box');
    userRecitationAudio = document.getElementById('user-recitation-audio');
    btnDownloadUserAudio = document.getElementById('btn-download-user-audio');
    userModalPlayerBox = document.getElementById('user-modal-player-box');
    userModalRecitationAudio = document.getElementById('user-modal-recitation-audio');
    btnDownloadModalAudio = document.getElementById('btn-download-modal-audio');

    btnReReciteSimple = document.getElementById('btn-re-recite-simple');
    btnBannerReset = document.getElementById('btn-banner-reset');

    capBtnPlay = document.getElementById('cap-btn-play');
    capPlayIcon = document.getElementById('cap-play-icon');
    capTimeline = document.getElementById('cap-timeline');
    capTimelineFill = document.getElementById('cap-timeline-fill');
    capTimelinePin = document.getElementById('cap-timeline-pin');
    capCurrTime = document.getElementById('cap-curr-time');
    capTotalTime = document.getElementById('cap-total-time');
    customLuxuryAudioBar = document.getElementById('custom-luxury-audio-bar');

    capModalBtnPlay = document.getElementById('cap-modal-btn-play');
    capModalPlayIcon = document.getElementById('cap-modal-play-icon');
    capModalTimeline = document.getElementById('cap-modal-timeline');
    capModalTimelineFill = document.getElementById('cap-modal-timeline-fill');
    capModalTimelinePin = document.getElementById('cap-modal-timeline-pin');
    capModalCurrTime = document.getElementById('cap-modal-curr-time');
    capModalTotalTime = document.getElementById('cap-modal-total-time');
    customModalAudioBar = document.getElementById('custom-modal-audio-bar');

    if (btnReReciteSimple) {
        btnReReciteSimple.addEventListener('click', () => {
            resetStudioRecording();
            showToast('تمت إعادة الضبط - جاهز للتسميع 🎙️', 'fa-solid fa-rotate-right');
        });
    }
    if (btnBannerReset) {
        btnBannerReset.addEventListener('click', () => {
            resetStudioRecording();
            showToast('تمت إعادة الضبط - جاهز للتسميع 🎙️', 'fa-solid fa-rotate-right');
        });
    }

    wireLuxuryAudioPlayer(userRecitationAudio, capBtnPlay, capPlayIcon, capTimeline, capTimelineFill, capTimelinePin, capCurrTime, capTotalTime, customLuxuryAudioBar);
    wireLuxuryAudioPlayer(userModalRecitationAudio, capModalBtnPlay, capModalPlayIcon, capModalTimeline, capModalTimelineFill, capModalTimelinePin, capModalCurrTime, capModalTotalTime, customModalAudioBar);
}

function wireLuxuryAudioPlayer(audioEl, playBtn, playIcon, timeline, fill, pin, currTimeEl, totalTimeEl, barContainer) {
    if (!audioEl || !playBtn || !timeline || !fill || !pin) return;

    function formatAudioTime(sec) {
        if (!sec || isNaN(sec) || sec < 0) return '00:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }

    playBtn.onclick = () => {
        if (!audioEl.src) return;
        if (audioEl.paused) {
            audioEl.play().catch(e => console.warn("Audio play notice:", e));
        } else {
            audioEl.pause();
        }
    };

    audioEl.addEventListener('play', () => {
        if (playIcon) playIcon.className = 'fa-solid fa-pause';
        if (barContainer) barContainer.classList.add('playing');
    });

    audioEl.addEventListener('pause', () => {
        if (playIcon) playIcon.className = 'fa-solid fa-play';
        if (barContainer) barContainer.classList.remove('playing');
    });

    audioEl.addEventListener('ended', () => {
        if (playIcon) playIcon.className = 'fa-solid fa-play';
        if (barContainer) barContainer.classList.remove('playing');
        fill.style.width = '0%';
        pin.style.left = '0%';
        if (currTimeEl) currTimeEl.textContent = '00:00';
    });

    audioEl.addEventListener('timeupdate', () => {
        const cur = audioEl.currentTime || 0;
        const dur = audioEl.duration || 0;
        if (currTimeEl) currTimeEl.textContent = formatAudioTime(cur);
        if (totalTimeEl && dur > 0) totalTimeEl.textContent = formatAudioTime(dur);
        if (dur > 0) {
            const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
            fill.style.width = pct + '%';
            pin.style.left = pct + '%';
        }
    });

    audioEl.addEventListener('loadedmetadata', () => {
        const dur = audioEl.duration || 0;
        if (totalTimeEl && dur > 0) totalTimeEl.textContent = formatAudioTime(dur);
    });

    timeline.onclick = (e) => {
        const rect = timeline.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (width > 0 && audioEl.duration) {
            const pct = Math.min(1, Math.max(0, clickX / width));
            audioEl.currentTime = pct * audioEl.duration;
        }
    };
}

// -----------------------------------------------------------------------------
// 6. Surah & Ayah Dropdowns & Selectors
// -----------------------------------------------------------------------------
function initSurahDropdown() {
    if (!cardSelectSurah || !surahDropdownFlyout) return;
    renderSurahList(SURAHS_DB);

    cardSelectSurah.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = surahDropdownFlyout.style.display === 'block';
        closeAllFlyouts();
        if (!isOpen) {
            surahDropdownFlyout.style.display = 'block';
            cardSelectSurah.classList.add('open');
            setTimeout(() => surahSearchInput && surahSearchInput.focus(), 60);
        }
    });

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

    if (surahSearchInput) {
        surahSearchInput.addEventListener('input', (e) => {
            const rawQuery = e.target.value.trim();
            if (!rawQuery) {
                renderSurahList(SURAHS_DB);
                return;
            }
            const normalizedDigits = rawQuery.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
            const filtered = SURAHS_DB.filter(s => 
                s.number.toString() === normalizedDigits ||
                matchesArabicSearch(s.name, rawQuery)
            );
            renderSurahList(filtered);
        });
    }

    document.addEventListener('click', (e) => {
        if (surahDropdownFlyout && !surahDropdownFlyout.contains(e.target) && !cardSelectSurah.contains(e.target)) {
            surahDropdownFlyout.style.display = 'none';
            cardSelectSurah.classList.remove('open');
        }
        if (ayahDropdownFlyout && !ayahDropdownFlyout.contains(e.target) && !cardSelectAyah.contains(e.target)) {
            ayahDropdownFlyout.style.display = 'none';
            cardSelectAyah.classList.remove('open');
        }
    });
}

function closeAllFlyouts() {
    if (surahDropdownFlyout) surahDropdownFlyout.style.display = 'none';
    if (ayahDropdownFlyout) ayahDropdownFlyout.style.display = 'none';
    if (cardSelectSurah) cardSelectSurah.classList.remove('open');
    if (cardSelectAyah) cardSelectAyah.classList.remove('open');
}

function renderSurahList(list) {
    if (!surahItemsList) return;
    surahItemsList.innerHTML = '';
    if (!list.length) {
        surahItemsList.innerHTML = '<div style="text-align:center; padding:12px; color:rgba(255,255,255,0.5); font-size:12px;">لا توجد نتائج</div>';
        return;
    }

    list.forEach(s => {
        const item = document.createElement('div');
        item.className = `dropdown-item ${s.number === currentSurahNumber ? 'selected' : ''}`;
        item.innerHTML = `
            <div class="item-left-info">
                <span class="item-num-badge">${s.number}</span>
                <strong>سورة ${s.name}</strong>
            </div>
            <span class="item-ayat-count">${s.ayat} آية</span>
        `;
        item.addEventListener('click', () => {
            selectSurah(s.number);
            closeAllFlyouts();
        });
        surahItemsList.appendChild(item);
    });
}

function openSurahFlyout() {
    closeAllFlyouts();
    if (surahDropdownFlyout && cardSelectSurah) {
        surahDropdownFlyout.style.display = 'block';
        cardSelectSurah.classList.add('open');
        cardSelectSurah.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => surahSearchInput && surahSearchInput.focus(), 60);
    }
}

function renderInitialEmptyState() {
    if (selectedSurahDisplay) selectedSurahDisplay.textContent = 'اختر السورة';
    if (selectedAyahDisplay) selectedAyahDisplay.textContent = 'اختر الآية';
    if (centerSurahTitle) centerSurahTitle.textContent = 'اختر السورة';
    if (centerAyahsRange) centerAyahsRange.textContent = 'بانتظار اختيار السورة';
    if (ayahMaxLabel) ayahMaxLabel.textContent = 'من -';
    if (inputAyahNum) {
        inputAyahNum.value = 1;
        inputAyahNum.max = 1;
    }
    if (mushafPageBasmala) mushafPageBasmala.style.display = 'none';
    if (playerStatusMain) playerStatusMain.textContent = 'اختر السورة والآية للبدء';
    if (playerStatusSub) playerStatusSub.textContent = 'حدد السورة والآية الكريمة من القائمة الجانبية لبدء التلاوة أو التسميع والتدقيق';

    renderMushafView();
    updateMemorizeHintState();
}

function updateMemorizeHintState() {
    if (!memorizeCanvasHint) return;
    if (!currentSurahNumber) {
        memorizeCanvasHint.innerHTML = `
            <div class="feather-quill-icon mosque-hint-icon"><i class="fa-solid fa-book-quran"></i></div>
            <h3 class="hint-main-text">اختر السورة والآية أولاً</h3>
            <p class="hint-sub-text">يرجى اختيار السورة والآية الكريمة من القائمة الجانبية للبدء بالتسميع الغيبي وتدقيق الحفظ كلمة بكلمة</p>
            <button type="button" class="empty-prompt-btn" id="btn-prompt-open-surahs-mem" style="margin-top: 14px;">
                <i class="fa-solid fa-hand-pointer"></i> <span>اختر السورة الآن</span>
            </button>
        `;
        const btnMemPrompt = document.getElementById('btn-prompt-open-surahs-mem');
        if (btnMemPrompt) {
            btnMemPrompt.addEventListener('click', (e) => {
                e.stopPropagation();
                openSurahFlyout();
            });
        }
    } else {
        memorizeCanvasHint.innerHTML = `
            <div class="feather-quill-icon mosque-hint-icon"><i class="fa-solid fa-mosque"></i></div>
            <h3 class="hint-main-text">ابدأ التسميع الآن بصوتك</h3>
            <p class="hint-sub-text">النص مخفي لتسميع غيبي متقن، وسيتم تدوين ما تقرؤه فقط وتدقيقه كلمة بكلمة</p>
        `;
    }
}

function selectSurah(surahNum) {
    currentSurahNumber = surahNum;
    currentAyahNumber = 1;
    recitationScopeMode = 'single';
    isFullSurahMode = false;
    const surahMeta = SURAHS_DB.find(s => s.number === surahNum) || SURAHS_DB[0];
    rangeFromAyah = 1;
    rangeToAyah = Math.min(surahMeta.ayat, 5);
    clampRangeInputs(surahMeta.ayat);
    loadSurahAndVerses(currentSurahNumber, currentAyahNumber);
    renderAyahGrid();
    renderSurahList(SURAHS_DB);
    updateMemorizeHintState();
    if (playerStatusMain) playerStatusMain.textContent = 'اضغط على زر الميكروفون بالأسفل لبدء التسجيل';
    if (playerStatusSub) playerStatusSub.textContent = 'اقرأ الآية بوضوح وسيقوم الذكاء الاصطناعي بتدقيق النطق والتجويد';
    showToast(`تم اختيار سورة ${surahMeta.name}`);
}

function clampRangeInputs(maxAyat) {
    if (!maxAyat) {
        if (!currentSurahNumber) return;
        const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber);
        if (!surahMeta) return;
        maxAyat = surahMeta.ayat;
    }
    if (rangeFromAyah < 1) rangeFromAyah = 1;
    if (rangeFromAyah > maxAyat) rangeFromAyah = maxAyat;
    if (rangeToAyah < 1) rangeToAyah = 1;
    if (rangeToAyah > maxAyat) rangeToAyah = maxAyat;

    if (inputRangeFrom) {
        inputRangeFrom.min = 1;
        inputRangeFrom.max = maxAyat;
        inputRangeFrom.value = rangeFromAyah;
    }
    if (inputRangeTo) {
        inputRangeTo.min = 1;
        inputRangeTo.max = maxAyat;
        inputRangeTo.value = rangeToAyah;
    }
}

function stepRangeFrom(delta) {
    if (!currentSurahNumber) {
        showToast('يرجى اختيار السورة أولاً');
        openSurahFlyout();
        return;
    }
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
    let val = (parseInt(inputRangeFrom ? inputRangeFrom.value : rangeFromAyah, 10) || 1) + delta;
    if (val < 1) val = 1;
    if (val > surahMeta.ayat) val = surahMeta.ayat;
    rangeFromAyah = val;
    if (inputRangeFrom) inputRangeFrom.value = rangeFromAyah;
}

function stepRangeTo(delta) {
    if (!currentSurahNumber) {
        showToast('يرجى اختيار السورة أولاً');
        openSurahFlyout();
        return;
    }
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
    let val = (parseInt(inputRangeTo ? inputRangeTo.value : rangeToAyah, 10) || 1) + delta;
    if (val < 1) val = 1;
    if (val > surahMeta.ayat) val = surahMeta.ayat;
    rangeToAyah = val;
    if (inputRangeTo) inputRangeTo.value = rangeToAyah;
}

function applyAyahRange() {
    if (!currentSurahNumber) {
        showToast('يرجى اختيار السورة أولاً');
        openSurahFlyout();
        return;
    }
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
    let fromVal = parseInt(inputRangeFrom ? inputRangeFrom.value : rangeFromAyah, 10);
    let toVal = parseInt(inputRangeTo ? inputRangeTo.value : rangeToAyah, 10);
    if (isNaN(fromVal) || fromVal < 1) fromVal = 1;
    if (fromVal > surahMeta.ayat) fromVal = surahMeta.ayat;
    if (isNaN(toVal) || toVal < 1) toVal = 1;
    if (toVal > surahMeta.ayat) toVal = surahMeta.ayat;

    if (fromVal > toVal) {
        const temp = fromVal;
        fromVal = toVal;
        toVal = temp;
    }

    rangeFromAyah = fromVal;
    rangeToAyah = toVal;
    clampRangeInputs(surahMeta.ayat);
    setRecitationScope('range');
    closeAllFlyouts();
}

function initAyahDropdown() {
    if (!cardSelectAyah || !ayahDropdownFlyout) return;

    cardSelectAyah.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!currentSurahNumber) {
            showToast('يرجى اختيار السورة أولاً لتحديد الآية');
            openSurahFlyout();
            return;
        }
        const isOpen = ayahDropdownFlyout.style.display === 'block';
        closeAllFlyouts();
        if (!isOpen) {
            ayahDropdownFlyout.style.display = 'block';
            cardSelectAyah.classList.add('open');
            renderAyahGrid();
        }
    });

    if (tabFullSurah) {
        tabFullSurah.addEventListener('click', () => {
            setRecitationScope('full');
            closeAllFlyouts();
        });
    }

    if (tabSingleAyah) {
        tabSingleAyah.addEventListener('click', () => {
            setRecitationScope('single');
        });
    }

    if (tabRangeAyah) {
        tabRangeAyah.addEventListener('click', () => {
            setRecitationScope('range');
        });
    }

    if (btnAyahPrev) {
        btnAyahPrev.addEventListener('click', () => {
            goToAyah(currentAyahNumber - 1);
        });
    }

    if (btnAyahNext) {
        btnAyahNext.addEventListener('click', () => {
            goToAyah(currentAyahNumber + 1);
        });
    }

    if (inputAyahNum) {
        inputAyahNum.addEventListener('change', () => {
            const val = parseInt(inputAyahNum.value, 10);
            if (!isNaN(val)) goToAyah(val);
        });

        inputAyahNum.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = parseInt(inputAyahNum.value, 10);
                if (!isNaN(val)) goToAyah(val);
                inputAyahNum.blur();
            }
        });
    }

    if (btnRangeFromPrev) btnRangeFromPrev.addEventListener('click', () => stepRangeFrom(-1));
    if (btnRangeFromNext) btnRangeFromNext.addEventListener('click', () => stepRangeFrom(1));
    if (btnRangeToPrev) btnRangeToPrev.addEventListener('click', () => stepRangeTo(-1));
    if (btnRangeToNext) btnRangeToNext.addEventListener('click', () => stepRangeTo(1));
    if (btnApplyRange) btnApplyRange.addEventListener('click', applyAyahRange);

    if (inputRangeFrom) {
        inputRangeFrom.addEventListener('change', () => {
            const val = parseInt(inputRangeFrom.value, 10);
            if (!isNaN(val)) rangeFromAyah = val;
        });
    }
    if (inputRangeTo) {
        inputRangeTo.addEventListener('change', () => {
            const val = parseInt(inputRangeTo.value, 10);
            if (!isNaN(val)) rangeToAyah = val;
        });
    }
}

function renderAyahGrid() {
    if (!ayahGridScrollable) return;
    if (!currentSurahNumber) {
        ayahGridScrollable.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:16px; color:rgba(255,255,255,0.6); font-size:12px;">يرجى اختيار السورة أولاً لعرض آياتها</div>';
        return;
    }
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
    ayahGridScrollable.innerHTML = '';

    for (let i = 1; i <= surahMeta.ayat; i++) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `ayah-chip ${recitationScopeMode === 'single' && !isFullSurahMode && i === currentAyahNumber ? 'active' : ''}`;
        chip.textContent = i;
        chip.addEventListener('click', () => {
            goToAyah(i);
            closeAllFlyouts();
        });
        ayahGridScrollable.appendChild(chip);
    }
}

function setRecitationScope(mode) {
    if (!currentSurahNumber) {
        showToast('يرجى اختيار السورة أولاً');
        openSurahFlyout();
        return;
    }
    recitationScopeMode = mode;
    isFullSurahMode = (mode === 'full');
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];

    if (tabSingleAyah) tabSingleAyah.classList.toggle('active', mode === 'single');
    if (tabRangeAyah) tabRangeAyah.classList.toggle('active', mode === 'range');
    if (tabFullSurah) tabFullSurah.classList.toggle('active', mode === 'full');

    if (wrapSingleAyah) wrapSingleAyah.style.display = (mode === 'single') ? 'block' : 'none';
    if (wrapRangeAyah) wrapRangeAyah.style.display = (mode === 'range') ? 'block' : 'none';
    if (ayahGridScrollable) ayahGridScrollable.style.display = (mode === 'range') ? 'none' : 'grid';

    if (mode === 'full') {
        if (selectedAyahDisplay) selectedAyahDisplay.textContent = 'كامل السورة';
        if (centerAyahsRange) centerAyahsRange.textContent = `الآيات 1 - ${surahMeta.ayat}`;
        showToast(`تم اختيار كامل سورة ${surahMeta.name}`);
        renderMushafView();
        prepareExemplaryAudio(currentSurahNumber, 1);
        resetStudioRecording();
    } else if (mode === 'range') {
        clampRangeInputs(surahMeta.ayat);
        const from = Math.min(rangeFromAyah, rangeToAyah);
        const to = Math.max(rangeFromAyah, rangeToAyah);
        if (selectedAyahDisplay) selectedAyahDisplay.textContent = `الآيات ${from} - ${to}`;
        if (centerAyahsRange) centerAyahsRange.textContent = `من الآية ${from} إلى ${to} (سورة ${surahMeta.name})`;
        showToast(`تم تحديد النطاق: من الآية ${from} إلى ${to}`);
        renderMushafView();
        prepareExemplaryAudio(currentSurahNumber, from);
        resetStudioRecording();
    } else {
        if (selectedAyahDisplay) selectedAyahDisplay.textContent = `الآية ${currentAyahNumber}`;
        if (centerAyahsRange) centerAyahsRange.textContent = `الآية ${currentAyahNumber} من ${surahMeta.ayat}`;
        showToast(`تم تحديد الآية ${currentAyahNumber} من سورة ${surahMeta.name}`);
        renderMushafView();
        prepareExemplaryAudio(currentSurahNumber, currentAyahNumber);
        resetStudioRecording();
    }
}

function setReciteMode(fullSurah) {
    setRecitationScope(fullSurah ? 'full' : 'single');
}

function goToAyah(ayahNum) {
    if (!currentSurahNumber) {
        showToast('يرجى اختيار السورة أولاً');
        openSurahFlyout();
        return;
    }
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
    let num = parseInt(ayahNum, 10);
    if (isNaN(num) || num < 1) num = 1;
    if (num > surahMeta.ayat) num = surahMeta.ayat;

    currentAyahNumber = num;
    recitationScopeMode = 'single';
    isFullSurahMode = false;

    if (tabSingleAyah) tabSingleAyah.classList.add('active');
    if (tabRangeAyah) tabRangeAyah.classList.remove('active');
    if (tabFullSurah) tabFullSurah.classList.remove('active');
    if (wrapSingleAyah) wrapSingleAyah.style.display = 'block';
    if (wrapRangeAyah) wrapRangeAyah.style.display = 'none';
    if (ayahGridScrollable) ayahGridScrollable.style.display = 'grid';

    if (selectedAyahDisplay) selectedAyahDisplay.textContent = `الآية ${currentAyahNumber}`;
    if (inputAyahNum) inputAyahNum.value = currentAyahNumber;
    if (centerAyahsRange) centerAyahsRange.textContent = `الآية ${currentAyahNumber} من ${surahMeta.ayat}`;

    const found = currentSurahVerses.find(a => a.numberInSurah === currentAyahNumber);
    if (found) currentTargetVerseText = found.text;

    renderMushafView();
    prepareExemplaryAudio(currentSurahNumber, currentAyahNumber);
    resetStudioRecording();

    if (ayahGridScrollable) {
        ayahGridScrollable.querySelectorAll('.ayah-chip').forEach(c => {
            const chipNum = parseInt(c.textContent, 10);
            if (chipNum === currentAyahNumber) {
                c.classList.add('active');
            } else {
                c.classList.remove('active');
            }
        });
    }

    setTimeout(() => {
        const activeEl = document.getElementById(`ayah-banner-${currentAyahNumber}`);
        if (activeEl && mushafVersesFlow) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 60);
}

// -----------------------------------------------------------------------------
// 7. Quran Loader & The Grand 3D Open Mushaf Renderer
// -----------------------------------------------------------------------------
async function loadSurahAndVerses(surahNum, targetAyahNum) {
    const surahMeta = SURAHS_DB.find(s => s.number === surahNum) || SURAHS_DB[0];

    // Update Header and Cards
    if (selectedSurahDisplay) selectedSurahDisplay.textContent = `سورة ${surahMeta.name}`;
    if (centerSurahTitle) centerSurahTitle.textContent = `سورة ${surahMeta.name}`;
    if (ayahMaxLabel) ayahMaxLabel.textContent = `من ${surahMeta.ayat}`;
    if (inputAyahNum) {
        inputAyahNum.max = surahMeta.ayat;
        inputAyahNum.value = targetAyahNum;
    }
    clampRangeInputs(surahMeta.ayat);

    if (recitationScopeMode === 'full') {
        if (selectedAyahDisplay) selectedAyahDisplay.textContent = 'كامل السورة';
        if (centerAyahsRange) centerAyahsRange.textContent = `الآيات 1 - ${surahMeta.ayat}`;
    } else if (recitationScopeMode === 'range') {
        const from = Math.min(rangeFromAyah, rangeToAyah);
        const to = Math.max(rangeFromAyah, rangeToAyah);
        if (selectedAyahDisplay) selectedAyahDisplay.textContent = `الآيات ${from} - ${to}`;
        if (centerAyahsRange) centerAyahsRange.textContent = `من الآية ${from} إلى ${to} (سورة ${surahMeta.name})`;
    } else {
        if (selectedAyahDisplay) selectedAyahDisplay.textContent = `الآية ${targetAyahNum}`;
        if (centerAyahsRange) centerAyahsRange.textContent = `الآية ${targetAyahNum} من ${surahMeta.ayat}`;
    }

    // Basmala visibility (Surah 1 and 9 have no top basmala box because 1 has it as Ayah 1 and 9 has no basmala)
    if (mushafPageBasmala) {
        if (surahNum === 1 || surahNum === 9) {
            mushafPageBasmala.style.display = 'none';
        } else {
            mushafPageBasmala.style.display = 'block';
        }
    }

    // 1. Instant offline loading from pre-loaded full Quran database (all 114 Surahs)
    if (window.QURAN_FULL_DATA && window.QURAN_FULL_DATA[surahNum] && window.QURAN_FULL_DATA[surahNum].ayahs) {
        currentSurahVerses = processVersesData(window.QURAN_FULL_DATA[surahNum].ayahs, surahNum);
        const found = currentSurahVerses.find(a => a.numberInSurah === targetAyahNum);
        currentTargetVerseText = found ? found.text : (currentSurahVerses[0] ? currentSurahVerses[0].text : "");
        renderMushafView();
        prepareExemplaryAudio(surahNum, targetAyahNum);
        return;
    }

    // 2. Fetch Full Surah Verses via online API
    try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`);
        if (res.ok) {
            const data = await res.json();
            if (data.data && data.data.ayahs) {
                currentSurahVerses = processVersesData(data.data.ayahs, surahNum);
                const found = currentSurahVerses.find(a => a.numberInSurah === targetAyahNum);
                currentTargetVerseText = found ? found.text : (currentSurahVerses[0] ? currentSurahVerses[0].text : "");
                renderMushafView();
                prepareExemplaryAudio(surahNum, targetAyahNum);
                return;
            }
        }
    } catch (e) {
        console.warn("AlQuran Cloud API fetch notice:", e);
    }

    // 3. Offline Fallback
    const fallbackRaw = [];
    for (let i = 1; i <= surahMeta.ayat; i++) {
        const key = `${surahNum}:${i}`;
        const text = LOCAL_SAMPLE_VERSES[key] || `آية كريمة رقم ${i} من سورة ${surahMeta.name}`;
        fallbackRaw.push({ numberInSurah: i, text: text });
    }
    currentSurahVerses = processVersesData(fallbackRaw, surahNum);
    const found = currentSurahVerses.find(a => a.numberInSurah === targetAyahNum);
    currentTargetVerseText = found ? found.text : (currentSurahVerses[0] ? currentSurahVerses[0].text : "");
    renderMushafView();
    prepareExemplaryAudio(surahNum, targetAyahNum);
}

function processVersesData(ayahs, surahNum) {
    return ayahs.map((a, idx) => {
        let txt = (a.text || "").replace(/^\uFEFF/, '').trim();
        if (surahNum !== 1 && surahNum !== 9 && idx === 0) {
            txt = txt.replace(/^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/, '')
                     .replace(/^بِسْمِ\s+اللَّهِ\s+الرَّحْمَٰنِ\s+الرَّحِيمِ\s*/, '');
        }
        const rawWords = txt.split(/\s+/).filter(Boolean);
        const normWords = rawWords.map(normalizeArabicText);
        return {
            numberInSurah: a.numberInSurah || (idx + 1),
            text: txt,
            rawWords: rawWords,
            normWords: normWords
        };
    });
}

function getActiveTargetAyahs() {
    if (recitationScopeMode === 'full' || isFullSurahMode) {
        return currentSurahVerses && currentSurahVerses.length ? currentSurahVerses : [];
    }
    if (recitationScopeMode === 'range') {
        const from = Math.min(rangeFromAyah, rangeToAyah);
        const to = Math.max(rangeFromAyah, rangeToAyah);
        return (currentSurahVerses && currentSurahVerses.length)
            ? currentSurahVerses.filter(a => a.numberInSurah >= from && a.numberInSurah <= to)
            : [];
    }
    const single = currentSurahVerses.find(a => a.numberInSurah === currentAyahNumber);
    return single ? [single] : (currentSurahVerses && currentSurahVerses.length ? [currentSurahVerses[0]] : []);
}

// Render the Sacred Mushaf with Active Ribbon Banner matching Mockup
function renderMushafView() {
    if (!mushafVersesFlow) return;

    if (!currentSurahNumber) {
        mushafVersesFlow.innerHTML = `
            <div class="mushaf-empty-prompt">
                <div class="empty-prompt-icon"><i class="fa-solid fa-book-quran"></i></div>
                <h3 class="empty-prompt-title">اختر السورة والآية للبدء</h3>
                <p class="empty-prompt-desc">يرجى اختيار السورة والآية الكريمة من القائمة الجانبية لعرض آيات المصحف وتدقيق تلاوتك بالذكاء الاصطناعي</p>
                <button type="button" class="empty-prompt-btn" id="btn-prompt-open-surahs">
                    <i class="fa-solid fa-hand-pointer"></i>
                    <span>اختر السورة الآن</span>
                </button>
            </div>
        `;
        const btnPrompt = document.getElementById('btn-prompt-open-surahs');
        if (btnPrompt) {
            btnPrompt.addEventListener('click', (e) => {
                e.stopPropagation();
                openSurahFlyout();
            });
        }
        return;
    }

    if (!currentSurahVerses || !currentSurahVerses.length) {
        mushafVersesFlow.innerHTML = '<div style="padding:20px;text-align:center;color:#836724;">جاري تحميل آيات السورة...</div>';
        return;
    }

    let html = '';
    const fromR = Math.min(rangeFromAyah, rangeToAyah);
    const toR = Math.max(rangeFromAyah, rangeToAyah);

    currentSurahVerses.forEach(ayah => {
        let isCurrentActive = false;
        if (recitationScopeMode === 'range') {
            isCurrentActive = (ayah.numberInSurah >= fromR && ayah.numberInSurah <= toR);
        } else if (recitationScopeMode === 'single' && !isFullSurahMode) {
            isCurrentActive = (ayah.numberInSurah === currentAyahNumber);
        }
        
        if (isCurrentActive) {
            // In Mockup: ❖ [Words] ⑤ ❖ inside the emerald ribbon in RTL
            html += `<div class="mushaf-verse-row active-ayah-banner" id="ayah-banner-${ayah.numberInSurah}">`;
            html += `<span class="banner-bracket">❖</span> `;
            
            ayah.rawWords.forEach((w, wIdx) => {
                html += `<span class="quran-word" id="word-${ayah.numberInSurah}-${wIdx}" data-ayah="${ayah.numberInSurah}">${escapeHTML(w)}</span> `;
            });

            html += `<span class="verse-num-circle active-circle">${toArabicEasternDigits(ayah.numberInSurah)}</span> `;
            html += `<span class="banner-bracket">❖</span></div>`;
        } else {
            // Normal Verse: [Words] ①
            html += `<div class="mushaf-verse-row" id="ayah-row-${ayah.numberInSurah}">`;
            
            ayah.rawWords.forEach((w, wIdx) => {
                html += `<span class="quran-word" id="word-${ayah.numberInSurah}-${wIdx}" data-ayah="${ayah.numberInSurah}">${escapeHTML(w)}</span> `;
            });

            html += `<span class="verse-num-circle">${toArabicEasternDigits(ayah.numberInSurah)}</span>`;
            html += `</div>`;
        }
    });

    mushafVersesFlow.innerHTML = html;

    // Clicking any verse or word in the Mushaf jumps to that Ayah
    mushafVersesFlow.querySelectorAll('.mushaf-verse-row, .quran-word, .verse-num-circle').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const aNum = parseInt(el.getAttribute('data-ayah') || el.closest('.mushaf-verse-row')?.id?.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(aNum)) goToAyah(aNum);
        });
    });

    // Auto scroll active ayah banner into view
    setTimeout(() => {
        const scrollTargetId = (recitationScopeMode === 'range') ? `ayah-banner-${fromR}` : `ayah-banner-${currentAyahNumber}`;
        const activeEl = document.getElementById(scrollTargetId);
        if (activeEl && mushafVersesFlow) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 60);
}

function toArabicEasternDigits(num) {
    const digits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(num).replace(/[0-9]/g, d => digits[d]);
}

// -----------------------------------------------------------------------------
// 8. Robust Arabic Normalization & Phonetic Matching for Quran
// -----------------------------------------------------------------------------
function normalizeArabicText(text) {
    if (!text) return "";
    return text
        .replace(/^\uFEFF/, '')
        // 1. Uthmani script Waw with dagger alef (e.g. ٱلصَّلَوٰةَ, ٱلزَّكَوٰةَ, ٱلْحَيَوٰةَ, ٱلرِّبَوٰاْ, مِشْكَوٰةٍ, بِٱلْغَدَوٰةِ, نَجَوٰةٍ) -> convert to Alef
        .replace(/\u0648[\u0670]/g, 'ا')
        // 2. Uthmani script Ya/Alif Maqsura with dagger alef (e.g. عَلَىٰ, إِلَىٰ, حَتَّىٰ, مُوسَىٰ) -> convert to Yeh
        .replace(/[ىي\u06CC\u0649][\u0670]/g, 'ي')
        // 3. Medina Mushaf standalone hamza before alef / dagger alef (e.g. ءَامَنُواْ, ءَاتَيْنَا, ءَايَاتِ, ءَادَمُ, ءَأَنتُمْ) -> Alef
        .replace(/\u0621[\u064E\u064F\u0650]?[\u0670\u0627آ]/g, 'ا')
        // 4. Remove all Tashkeel diacritics & Quranic pause/sajdah/stop marks
        .replace(/[\u064B-\u0652\u0653-\u065F\u06D6-\u06ED]/g, "")
        // 5. All Alef variants including Wasla to bare alef
        .replace(/[\u0671إأآٱ]/g, "ا")
        // 6. Replace remaining dagger alefs with bare alef (e.g. مَٰلِكِ -> مالك)
        .replace(/[\u0670]/g, "ا")
        // 6. Normalize Yeh and Alif Maqsura
        .replace(/[ىي\u06CC\u0649]/g, "ي")
        // 7. Normalize Teh Marbuta and Heh
        .replace(/[ةه]/g, "ه")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/[\u0640]/g, "") // Remove Tatweel
        .replace(/[^\u0621-\u064A\s]/g, "") // Keep only Arabic letters
        .replace(/ا+/g, "ا") // Collapse double alefs caused by dagger substitutions
        .trim();
}

// Fawatih Al-Suwar (Disjointed Letters - الحروف المقطعة) Equivalents for all 29 Surahs
const FAWATIH_EQUIVALENTS = {
    'الم': ['الم', 'الف لام ميم', 'ألف لام ميم', 'الف لم مم', 'إلف لام ميم'],
    'المص': ['المص', 'الف لام ميم صاد', 'ألف لام ميم صاد', 'الف لم مم صد'],
    'الر': ['الر', 'الف لام را', 'الف لام راء', 'ألف لام را', 'ألف لام راء', 'الف لم ر'],
    'المر': ['المر', 'الف لام ميم را', 'الف لام ميم راء', 'ألف لام ميم را', 'ألف لام ميم راء'],
    'كهيعص': ['كهيعص', 'كاف ها يا عين صاد', 'كاف هاء ياء عين صاد', 'كاف ها ياء عين صاد', 'كاف هاء يا عين صاد', 'كف ه ي عن صد'],
    'طه': ['طه', 'طا ها', 'طاء هاء', 'طاها', 'طا ه'],
    'طسم': ['طسم', 'طا سين ميم', 'طاء سين ميم', 'طاسين ميم'],
    'طس': ['طس', 'طا سين', 'طاء سين', 'طاسين'],
    'يس': ['يس', 'يا سين', 'ياء سين', 'ياسين'],
    'ص': ['ص', 'صاد'],
    'حم': ['حم', 'حا ميم', 'حاء ميم', 'حاميم'],
    'عسق': ['عسق', 'عين سين قاف', 'عن سن قف', 'عين سن قاف'],
    'ق': ['ق', 'قاف'],
    'ن': ['ن', 'نون']
};

// Check Quranic word vs Speech Recognition word with variations
function areArabicWordsMatching(expectedRaw, spokenRaw) {
    if (!expectedRaw || !spokenRaw) return false;
    const eNorm = normalizeArabicText(expectedRaw);
    const sNorm = normalizeArabicText(spokenRaw);
    if (eNorm === sNorm) return true;

    // Fawatih al-Suwar (Disjointed letters) cross-matching
    if (FAWATIH_EQUIVALENTS[eNorm] && FAWATIH_EQUIVALENTS[eNorm].some(eq => normalizeArabicText(eq) === sNorm)) {
        return true;
    }
    if (FAWATIH_EQUIVALENTS[sNorm] && FAWATIH_EQUIVALENTS[sNorm].some(eq => normalizeArabicText(eq) === eNorm)) {
        return true;
    }

    // Ta marbuta vs open ta at end of word (Quranic رسم: رحمت vs رحمة, نعمت vs نعمة, سنت vs سنة, امرات vs امراة)
    if (eNorm.replace(/ت$/, 'ه') === sNorm.replace(/ت$/, 'ه')) return true;

    // Alif vs Yeh at end of word (e.g. على vs علا, هدى vs هدا)
    if (eNorm.length > 2 && sNorm.length > 2) {
        if (eNorm.replace(/[يا]$/, '') === sNorm.replace(/[يا]$/, '')) return true;
    }

    // Without any alefs in both (e.g. الرحمن vs الرحمان, ابراهيم vs ابراهم, السموات vs السماوات)
    if (eNorm.replace(/ا/g, '') === sNorm.replace(/ا/g, '')) return true;

    // Prefixed Ba differences (e.g. باسم vs بسم)
    if (eNorm.replace(/^ب[ا]?/, 'ب') === sNorm.replace(/^ب[ا]?/, 'ب')) return true;

    // Minor phonetic slip tolerance for words of length >= 4 (Levenshtein distance <= 1)
    if (eNorm.length >= 4 && sNorm.length >= 4 && Math.abs(eNorm.length - sNorm.length) <= 1) {
        let diff = 0;
        let i = 0, j = 0;
        while (i < eNorm.length && j < sNorm.length) {
            if (eNorm[i] !== sNorm[j]) {
                diff++;
                if (diff > 1) break;
                if (eNorm.length > sNorm.length) i++;
                else if (sNorm.length > eNorm.length) j++;
                else { i++; j++; }
            } else {
                i++; j++;
            }
        }
        diff += (eNorm.length - i) + (sNorm.length - j);
        if (diff <= 1) return true;
    }

    return false;
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getGlobalAyahNumber(surahNum, ayahNum) {
    let count = 0;
    for (let i = 0; i < surahNum - 1; i++) {
        count += (SURAHS_DB[i] ? SURAHS_DB[i].ayat : 0);
    }
    return count + ayahNum;
}

// -----------------------------------------------------------------------------
// 9. Exemplary Reciter Player ("استمع للتلاوة النموذجية")
// -----------------------------------------------------------------------------
function prepareExemplaryAudio(surahNum, ayahNum) {
    if (!audioExemplary || !surahNum) return;
    pauseExemplaryAudio();

    let targetNum = ayahNum;
    if (recitationScopeMode === 'full') {
        targetNum = ayahNum || 1;
    } else if (recitationScopeMode === 'range') {
        const from = Math.min(rangeFromAyah, rangeToAyah);
        targetNum = ayahNum || from;
    }

    const sPadded = String(surahNum).padStart(3, '0');
    const aPadded = String(targetNum).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sPadded}${aPadded}.mp3`;

    audioExemplary.src = audioUrl;

    audioExemplary.onended = () => {
        if (recitationScopeMode === 'full') {
            // Advance to next ayah in full surah mode
            const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
            if (targetNum < surahMeta.ayat) {
                prepareExemplaryAudio(currentSurahNumber, targetNum + 1);
                playExemplaryAudio();
                return;
            }
        } else if (recitationScopeMode === 'range') {
            const to = Math.max(rangeFromAyah, rangeToAyah);
            if (targetNum < to) {
                prepareExemplaryAudio(currentSurahNumber, targetNum + 1);
                playExemplaryAudio();
                return;
            }
        }
        pauseExemplaryAudio();
        if (playerStatusMain) playerStatusMain.textContent = 'أحسنت الاستماع! الآن اقرأ الآية بصوتك';
        if (playerStatusSub) playerStatusSub.textContent = 'اضغط على زر التسجيل بالأسفل لبدء التسميع وتدقيق التلاوة';
        showToast('أحسنت الاستماع! اضغط الآن على زر الميكروفون وابدأ التسميع بصوتك.');
    };

    audioExemplary.onerror = () => {
        const globalNum = getGlobalAyahNumber(surahNum, targetNum);
        const fallbackUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNum}.mp3`;
        if (audioExemplary.src !== fallbackUrl) {
            audioExemplary.src = fallbackUrl;
            if (isExemplaryPlaying) {
                audioExemplary.play().catch(e => console.warn("Fallback play error:", e));
            }
        }
    };
}

function toggleExemplaryAudio() {
    if (!currentSurahNumber) {
        showToast('يرجى اختيار السورة أولاً للاستماع للتلاوة');
        openSurahFlyout();
        return;
    }
    if (!audioExemplary) return;
    if (isExemplaryPlaying) {
        pauseExemplaryAudio();
    } else {
        playExemplaryAudio();
    }
}

function playExemplaryAudio() {
    if (!currentSurahNumber) {
        showToast('يرجى اختيار السورة أولاً للاستماع للتلاوة');
        openSurahFlyout();
        return;
    }
    if (!audioExemplary || !audioExemplary.src) return;

    if (isRecording) {
        stopRecordingAndAnalyze();
    }

    audioExemplary.play().then(() => {
        isExemplaryPlaying = true;
        if (exemplaryPlayIcon) exemplaryPlayIcon.className = 'fa-solid fa-pause';
        if (quickListenIcon) quickListenIcon.className = 'fa-solid fa-pause';
        if (quickListenText) quickListenText.textContent = 'إيقاف التلاوة';
        if (btnQuickListen) btnQuickListen.classList.add('playing');
        if (cardListenExemplary) cardListenExemplary.classList.add('playing');
        if (barWaveformVisualizer) barWaveformVisualizer.classList.add('playing');
        if (playerStatusMain) playerStatusMain.textContent = 'جاري تشغيل تلاوة الآيات (الشيخ مشاري العفاسي)';
        if (playerStatusSub) playerStatusSub.textContent = 'استمع جيداً إلى مخارج الحروف وأحكام التجويد';
    }).catch(err => {
        console.warn("Exemplary play notice:", err);
    });
}

function pauseExemplaryAudio() {
    if (!audioExemplary) return;
    try { audioExemplary.pause(); } catch (e) {}
    isExemplaryPlaying = false;
    if (exemplaryPlayIcon) exemplaryPlayIcon.className = 'fa-solid fa-play';
    if (quickListenIcon) quickListenIcon.className = 'fa-solid fa-play';
    if (quickListenText) quickListenText.textContent = 'استمع للآيات';
    if (btnQuickListen) btnQuickListen.classList.remove('playing');
    if (cardListenExemplary) cardListenExemplary.classList.remove('playing');
    if (barWaveformVisualizer) barWaveformVisualizer.classList.remove('playing');
    if (playerStatusMain) playerStatusMain.textContent = 'اضغط على زر الميكروفون لبدء التسجيل';
    if (playerStatusSub) playerStatusSub.textContent = 'اقرأ الآية بوضوح وسيقوم الذكاء الاصطناعي بتدقيق النطق والتجويد';
}

function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// -----------------------------------------------------------------------------
// 10. Studio Display Modes (وضع التلاوة vs وضع التسميع)
// -----------------------------------------------------------------------------
function setStudioMode(mode) {
    studioDisplayMode = mode;
    resetStudioRecording();

    if (mode === 'memorize') {
        pauseExemplaryAudio();
        if (btnModeMemorize) btnModeMemorize.classList.add('active');
        if (btnModeRecite) btnModeRecite.classList.remove('active');
        if (mushafVersesFlow) mushafVersesFlow.style.display = 'none';
        if (mushafMemorizeCanvas) mushafMemorizeCanvas.style.display = 'flex';
        if (quickListenContainer) quickListenContainer.style.display = 'none';
        if (cardListenExemplary) cardListenExemplary.style.display = 'none';

        updateMemorizeHintState();

        if (!currentSurahNumber) {
            if (playerStatusMain) playerStatusMain.textContent = 'وضع التسميع (اختر السورة والآية أولاً)';
            if (playerStatusSub) playerStatusSub.textContent = 'يرجى اختيار السورة والآية الكريمة من القائمة الجانبية للبدء بالتسميع';
        } else {
            if (playerStatusMain) playerStatusMain.textContent = 'وضع التسميع نشط (النص مخفي)';
            if (playerStatusSub) playerStatusSub.textContent = 'سمّع الآية غيباً، وسيتم كتابة ما تقرؤه فقط وتدقيقه فوراً';
        }
        showToast('تم تفعيل وضع التسميع (النص مخفي للتسميع الغيبي)');
    } else {
        if (btnModeRecite) btnModeRecite.classList.add('active');
        if (btnModeMemorize) btnModeMemorize.classList.remove('active');
        if (mushafVersesFlow) mushafVersesFlow.style.display = 'block';
        if (mushafMemorizeCanvas) mushafMemorizeCanvas.style.display = 'none';
        if (quickListenContainer) quickListenContainer.style.display = 'flex';
        if (cardListenExemplary) cardListenExemplary.style.display = 'flex';

        if (!currentSurahNumber) {
            renderMushafView();
            if (playerStatusMain) playerStatusMain.textContent = 'وضع التلاوة (اختر السورة والآية أولاً)';
            if (playerStatusSub) playerStatusSub.textContent = 'يرجى اختيار السورة والآية الكريمة من القائمة الجانبية لعرض المصحف';
        } else {
            if (playerStatusMain) playerStatusMain.textContent = 'وضع التلاوة نشط (عرض المصحف)';
            if (playerStatusSub) playerStatusSub.textContent = 'اقرأ من المصحف الشريف أو استمع لتلاوة الآيات';
        }
        showToast('تم تفعيل وضع التلاوة (عرض المصحف)');
    }
}

function toggleRevealVerse() {
    if (!memorizeLiveWords) return;
    const targetAyahs = getActiveTargetAyahs();
    if (!targetAyahs.length) return;

    isVerseRevealed = !isVerseRevealed;
    if (isVerseRevealed) {
        let html = '<div style="margin-bottom:8px; font-size:14px; color:#836724; font-family:Tajawal, sans-serif; font-weight:700;">❖ نص الآية الكريمة للمساعدة:</div>';
        targetAyahs.forEach(ayah => {
            ayah.rawWords.forEach(w => {
                html += `<span class="inscribed-word revealed-peek">${escapeHTML(w)}</span> `;
            });
        });
        memorizeLiveWords.innerHTML = html;
        if (btnRevealVerse) btnRevealVerse.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span>إخفاء النص</span>';
        if (memorizeCanvasHint) memorizeCanvasHint.classList.add('has-words');
    } else {
        memorizeLiveWords.innerHTML = '';
        if (btnRevealVerse) btnRevealVerse.innerHTML = '<i class="fa-solid fa-eye"></i> <span>كشف النص للمساعدة</span>';
        if (memorizeCanvasHint) memorizeCanvasHint.classList.remove('has-words');
    }
}

// -----------------------------------------------------------------------------
// 11. Recording Studio & Real-Time Inscription ("اقرأ بصوتك")
// -----------------------------------------------------------------------------
function startLiveWaveform(stream) {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!audioCtx) audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const source = audioCtx.createMediaStreamSource(stream);
        audioAnalyser = audioCtx.createAnalyser();
        audioAnalyser.fftSize = 64;
        source.connect(audioAnalyser);

        const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
        const bars = barWaveformVisualizer ? barWaveformVisualizer.querySelectorAll('.wbar') : [];

        function updateBars() {
            if (!isRecording) return;
            audioAnalyser.getByteFrequencyData(dataArray);
            bars.forEach((bar, idx) => {
                const val = dataArray[idx % dataArray.length] || 0;
                const h = Math.max(3, Math.min(22, Math.round((val / 255) * 22)));
                bar.style.height = `${h}px`;
            });
            audioAnimFrameId = requestAnimationFrame(updateBars);
        }
        updateBars();
    } catch (e) {
        console.warn("Live waveform notice:", e);
    }
}

function stopLiveWaveform() {
    if (audioAnimFrameId) {
        cancelAnimationFrame(audioAnimFrameId);
        audioAnimFrameId = null;
    }
    if (barWaveformVisualizer) {
        barWaveformVisualizer.querySelectorAll('.wbar').forEach(b => b.style.height = '');
    }
}

async function startRecording() {
    if (!currentSurahNumber) {
        showToast('يرجى اختيار السورة والآيات أولاً للبدء بالتسميع', 'fa-solid fa-book-quran');
        openSurahFlyout();
        if (cardSelectSurah) {
            cardSelectSurah.classList.add('pulse-highlight');
            setTimeout(() => cardSelectSurah.classList.remove('pulse-highlight'), 1500);
        }
        return;
    }
    pauseExemplaryAudio();

    if (recitationEvalBanner) recitationEvalBanner.style.display = 'none';
    if (liveSpeechFeedbackStrip) {
        liveSpeechFeedbackStrip.style.display = 'block';
        const dot = liveSpeechFeedbackStrip.querySelector('.pulse-rec-dot');
        if (dot) dot.style.display = '';
        if (speechFeedbackLabel) speechFeedbackLabel.textContent = '🎙️ جاري الاستماع لتلاوتك الكريمة الآن...';
        if (speechLiveTextDisplay) {
            speechLiveTextDisplay.innerHTML = `
                <div class="listening-live-box">
                    <div class="listening-wave-anim">
                        <span></span><span></span><span></span><span></span><span></span>
                    </div>
                    <span class="listening-live-text">نستمع لتلاوتك الكريمة الآن... رتّل بخشوع وتؤدة، وسيتم تدقيق وعرض كامل التلاوة فور الضغط على زر الإيقاف.</span>
                </div>
            `;
        }
    }

    // 1. Reset state
    liveTranscript = "";
    accumulatedSpeechText = "";
    currentInterimSpeechText = "";
    committedPreviousSessionsText = "";
    currentSessionFinalText = "";
    audioChunks = [];
    isRecording = true;
    recordStartTime = Date.now();

    // UI Updates for User Voice Recording
    if (cardReciteVoice) cardReciteVoice.classList.add('recording');
    if (recordMicIcon) recordMicIcon.className = 'fa-solid fa-stop';
    if (barBtnRecord) barBtnRecord.classList.add('recording');
    if (barRecordIcon) barRecordIcon.className = 'fa-solid fa-stop';
    if (barRecordingIndicator) barRecordingIndicator.classList.add('recording');
    if (barRecLabel) barRecLabel.textContent = 'جاري التسميع...';
    if (barWaveformVisualizer) barWaveformVisualizer.classList.add('recording');
    if (btnReReciteSimple) btnReReciteSimple.style.display = 'inline-flex';

    if (studioDisplayMode === 'memorize') {
        if (playerStatusMain) playerStatusMain.textContent = 'تسميع غيبي جاري... اقرأ الآيات من حفظك';
        if (playerStatusSub) playerStatusSub.textContent = 'اقرأ برياحتك، وعند الانتهاء اضغط زر الإيقاف للتدقيق الفوري';
        if (!isVerseRevealed && memorizeLiveWords) memorizeLiveWords.innerHTML = '';
    } else {
        if (playerStatusMain) playerStatusMain.textContent = 'جاري الاستماع لتلاوتك الكريمة...';
        if (playerStatusSub) playerStatusSub.textContent = 'اقرأ برياحتك وبدون استعجال، وعند الانتهاء اضغط زر الإيقاف للتدقيق';
    }

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
        if (barTimeDisplay) barTimeDisplay.textContent = formatTime(elapsed);
    }, 1000);

    // 2. CRITICAL: Start SpeechRecognition SYNCHRONOUSLY within the user-gesture tick!
    // Mobile browsers (Chrome Android / Safari iOS) reject SpeechRecognition if called after an async await.
    try {
        startLiveSpeechRecognition();
    } catch (eSpeech) {
        console.warn("Live speech recognition init note:", eSpeech);
    }

    // 3. Acquire microphone and start continuous MediaRecorder so user voice is ALWAYS recorded for playback
    const micPromise = (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        ? navigator.mediaDevices.getUserMedia({ audio: true }).catch(micErr => {
            console.warn("Microphone access for MediaRecorder:", micErr);
            return null;
        })
        : Promise.resolve(null);

        try {
            const stream = await micPromise;
            if (stream && isRecording) {
                audioStream = stream;

                // Start continuous MediaRecorder — NEVER restarted during recording
                try {
                    let preferredMime = '';
                    if (typeof MediaRecorder !== 'undefined') {
                        const mimes = [
                            'audio/webm;codecs=opus',
                            'audio/webm',
                            'audio/mp4',
                            'audio/ogg;codecs=opus',
                            'audio/aac'
                        ];
                        for (const m of mimes) {
                            if (MediaRecorder.isTypeSupported(m)) { preferredMime = m; break; }
                        }
                    }
                    const recorderOptions = preferredMime ? { mimeType: preferredMime } : {};
                    mediaRecorder = new MediaRecorder(stream, recorderOptions);
                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data && e.data.size > 0) audioChunks.push(e.data);
                    };
                    mediaRecorder.start(1000); // Collect chunks every 1s for progressive buffering
                } catch (mrErr) {
                    console.warn("MediaRecorder start notice:", mrErr);
                    mediaRecorder = null;
                }

                // Connect live waveform visualizer to the microphone stream
                startLiveWaveform(stream);
            }
        } catch (streamErr) {
            console.warn("Stream acquisition notice:", streamErr);
        }
}

function triggerSilenceCountdown() {
    // Recitation continues uninterrupted across pauses and ayahs until user explicitly clicks stop
    if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
    }
}

async function stopRecordingAndAnalyze() {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (!isRecording) return;

    isRecording = false;
    if (timerInterval) clearInterval(timerInterval);

    // 1. Commit every single in-flight word from current session cleanly
    let sessionWordsToCommit = currentSessionFinalText 
        ? (currentInterimSpeechText ? currentSessionFinalText + ' ' + currentInterimSpeechText : currentSessionFinalText)
        : currentInterimSpeechText;
    sessionWordsToCommit = (sessionWordsToCommit || '').trim();

    if (sessionWordsToCommit) {
        const activeAyahs = (typeof getActiveTargetAyahs === 'function') ? getActiveTargetAyahs() : [];
        sessionWordsToCommit = recoverClippedSpeechWord(committedPreviousSessionsText, sessionWordsToCommit, activeAyahs);
        committedPreviousSessionsText = combineSpeechSegments(committedPreviousSessionsText, sessionWordsToCommit);
        currentSessionFinalText = "";
        currentInterimSpeechText = "";
    }
    if (committedPreviousSessionsText) {
        liveTranscript = committedPreviousSessionsText.trim();
        accumulatedSpeechText = liveTranscript;
    }

    stopLiveSpeechRecognition();
    stopLiveWaveform();

    // 2. Stop MediaRecorder and collect complete lossless audio blob
    let recordedBlob = null;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        recordedBlob = await new Promise((resolve) => {
            const safetyTimeout = setTimeout(() => {
                try {
                    const mime = mediaRecorder?.mimeType || 'audio/webm';
                    const blob = new Blob(audioChunks, { type: mime });
                    resolve(blob.size > 0 ? blob : null);
                } catch (e) { resolve(null); }
            }, 2500);
            mediaRecorder.onstop = () => {
                clearTimeout(safetyTimeout);
                try {
                    const mimeType = mediaRecorder.mimeType || 'audio/webm';
                    const blob = new Blob(audioChunks, { type: mimeType });
                    resolve(blob.size > 0 ? blob : null);
                } catch (e) { resolve(null); }
            };
            try { mediaRecorder.stop(); } catch (e) { clearTimeout(safetyTimeout); resolve(null); }
        });
    } else if (audioChunks && audioChunks.length) {
        try {
            const mime = audioChunks[0]?.type || 'audio/webm';
            recordedBlob = new Blob(audioChunks, { type: mime });
            if (recordedBlob.size === 0) recordedBlob = null;
        } catch (e) {}
    }

    if (recordedBlob) {
        recordedAudioBlob = recordedBlob;
    }

    // 3. Release microphone stream
    if (audioStream) {
        try { audioStream.getTracks().forEach(t => t.stop()); } catch (e) {}
        audioStream = null;
    }
    mediaRecorder = null;

    // Update UI states immediately
    if (cardReciteVoice) cardReciteVoice.classList.remove('recording');
    if (recordMicIcon) recordMicIcon.className = 'fa-solid fa-microphone';
    if (barBtnRecord) barBtnRecord.classList.remove('recording');
    if (barRecordIcon) barRecordIcon.className = 'fa-solid fa-microphone';
    if (barRecordingIndicator) barRecordingIndicator.classList.remove('recording');
    if (barRecLabel) barRecLabel.textContent = 'تم إنهاء التسجيل';
    if (barWaveformVisualizer) barWaveformVisualizer.classList.remove('recording');

    // Update live feedback strip immediately
    if (liveSpeechFeedbackStrip) {
        const dot = liveSpeechFeedbackStrip.querySelector('.pulse-rec-dot');
        if (dot) dot.style.display = 'none';
    }

    // 4. Attempt Whisper transcription for authoritative lossless transcript
    let whisperTranscript = null;
    if (recordedBlob && recordedBlob.size > 1000) {
        if (speechFeedbackLabel) {
            speechFeedbackLabel.textContent = '🔍 جاري تحليل تلاوتك بالذكاء الاصطناعي...';
        }
        if (playerStatusMain) {
            playerStatusMain.innerHTML = '<span style="color:var(--gold-light,#f5df9a); font-weight:700;"><i class="fa-solid fa-spinner fa-spin"></i> جاري تحليل التلاوة بالذكاء الاصطناعي...</span>';
        }
        if (playerStatusSub) {
            playerStatusSub.textContent = 'يتم تحليل تلاوتك بدقة عالية للتدقيق الأمثل';
        }

        try {
            whisperTranscript = await transcribeWithWhisper(recordedBlob);
        } catch (whisperErr) {
            console.warn("Whisper transcription notice:", whisperErr);
            whisperTranscript = null;
        }
    }

    // 5. Choose best available transcript and show feedback
    const finalTranscript = (whisperTranscript && whisperTranscript.trim().length > 0)
        ? whisperTranscript.trim()
        : null;

    if (finalTranscript) {
        if (speechFeedbackLabel) {
            speechFeedbackLabel.textContent = '✓ تم تحليل التلاوة بنجاح، جاري التدقيق...';
        }
    } else {
        if (speechFeedbackLabel) {
            speechFeedbackLabel.textContent = '✓ تم تسجيل التلاوة، جاري التدقيق الفوري...';
        }
    }

    // 6. Execute evaluation with the best available transcript
    executeImmediateEvaluation(recordedBlob, finalTranscript);
}

function resetStudioRecording() {
    if (silenceTimer) clearTimeout(silenceTimer);
    stopLiveWaveform();
    if (isRecording) {
        stopLiveSpeechRecognition();
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            try { mediaRecorder.stop(); } catch (e) {}
        }
        mediaRecorder = null;
        if (audioStream) {
            try { audioStream.getTracks().forEach(t => t.stop()); } catch (e) {}
            audioStream = null;
        }
        isRecording = false;
        if (timerInterval) clearInterval(timerInterval);
    }

    audioChunks = [];
    recordedAudioBlob = null;
    liveTranscript = "";
    accumulatedSpeechText = "";
    currentInterimSpeechText = "";
    committedPreviousSessionsText = "";
    currentSessionFinalText = "";
    if (userRecitationAudio) {
        try { userRecitationAudio.pause(); } catch(e) {}
        userRecitationAudio.src = '';
    }
    if (userModalRecitationAudio) {
        try { userModalRecitationAudio.pause(); } catch(e) {}
        userModalRecitationAudio.src = '';
    }
    if (capPlayIcon) capPlayIcon.className = 'fa-solid fa-play';
    if (capTimelineFill) capTimelineFill.style.width = '0%';
    if (capTimelinePin) capTimelinePin.style.left = '0%';
    if (capCurrTime) capCurrTime.textContent = '00:00';
    if (customLuxuryAudioBar) customLuxuryAudioBar.classList.remove('playing');

    if (capModalPlayIcon) capModalPlayIcon.className = 'fa-solid fa-play';
    if (capModalTimelineFill) capModalTimelineFill.style.width = '0%';
    if (capModalTimelinePin) capModalTimelinePin.style.left = '0%';
    if (capModalCurrTime) capModalCurrTime.textContent = '00:00';
    if (customModalAudioBar) customModalAudioBar.classList.remove('playing');

    if (userRecitationPlayerBox) userRecitationPlayerBox.style.display = 'none';
    if (userModalPlayerBox) userModalPlayerBox.style.display = 'none';
    if (evalBannerTranscript) evalBannerTranscript.style.display = 'none';
    isVerseRevealed = false;
    if (liveSpeechFeedbackStrip) liveSpeechFeedbackStrip.style.display = 'none';
    if (recitationEvalBanner) recitationEvalBanner.style.display = 'none';
    if (cardReciteVoice) cardReciteVoice.classList.remove('recording');
    if (recordMicIcon) recordMicIcon.className = 'fa-solid fa-microphone';
    if (barBtnRecord) barBtnRecord.classList.remove('recording');
    if (barRecordIcon) barRecordIcon.className = 'fa-solid fa-microphone';
    if (barRecordingIndicator) barRecordingIndicator.classList.remove('recording');
    if (barRecLabel) barRecLabel.textContent = 'جاهز للتسميع';
    if (barWaveformVisualizer) barWaveformVisualizer.classList.remove('recording');
    if (barTimeDisplay) barTimeDisplay.textContent = '00:00';
    if (btnReReciteSimple) btnReReciteSimple.style.display = 'none';
    if (playerStatusMain) playerStatusMain.textContent = 'اضغط على زر الميكروفون لبدء التسجيل';
    if (playerStatusSub) playerStatusSub.textContent = 'اقرأ الآية بوضوح وسيقوم الذكاء الاصطناعي بتدقيق النطق والتجويد';

    if (btnRevealVerse) btnRevealVerse.innerHTML = '<i class="fa-solid fa-eye"></i> <span>كشف النص للمساعدة</span>';
    if (memorizeLiveWords) memorizeLiveWords.innerHTML = '';
    if (memorizeCanvasHint) memorizeCanvasHint.classList.remove('has-words');

    // Clear word highlights in Mushaf
    if (mushafVersesFlow) {
        mushafVersesFlow.querySelectorAll('.quran-word').forEach(w => {
            w.classList.remove('spoken-match', 'spoken-slip', 'spoken-active');
            w.removeAttribute('title');
        });
    }
}

// -----------------------------------------------------------------------------
// 12. Web Speech API (Live Inscription & Live Highlights)
// -----------------------------------------------------------------------------

// Smart, seamless speech segment merger that prevents duplicates on Mobile Chrome
// while preserving 100% of spoken words across pauses and ayah transitions
function combineSpeechSegments(prev, next) {
    const p = (prev || '').trim();
    const n = (next || '').trim();
    if (!p) return n;
    if (!n) return p;

    const normP = normalizeArabicText(p);
    const normN = normalizeArabicText(n);

    // If identical, return without duplicating
    if (normP === normN) return p;

    // If new session already includes previous session from start, use the new complete one
    if (normN.startsWith(normP)) return n;

    // If previous session already ends with new session, keep previous
    if (normP.endsWith(normN)) return p;

    // Check for overlapping boundary words at the seam between segments
    const pWords = p.split(/\s+/).filter(Boolean);
    const nWords = n.split(/\s+/).filter(Boolean);
    const pNorm = pWords.map(normalizeArabicText);
    const nNorm = nWords.map(normalizeArabicText);

    const maxOverlap = Math.min(pWords.length, nWords.length);
    for (let len = maxOverlap; len >= 1; len--) {
        let match = true;
        for (let k = 0; k < len; k++) {
            if (pNorm[pNorm.length - len + k] !== nNorm[k]) {
                match = false;
                break;
            }
        }
        if (match) {
            const phrase = nWords.slice(0, len).map(normalizeArabicText).join(' ');
            const repeatedPhrase = phrase + ' ' + phrase;
            let allowedInQuran = false;
            const targetTextNorm = (typeof currentTargetVerseText === 'string' && currentTargetVerseText) 
                ? normalizeArabicText(currentTargetVerseText) 
                : '';
            if (targetTextNorm && targetTextNorm.includes(repeatedPhrase)) {
                allowedInQuran = true;
            }

            if (!allowedInQuran) {
                // Stitch without repeating the shared words replayed by speech recognizer
                return pWords.concat(nWords.slice(len)).join(' ');
            }
        }
    }

    // Consecutive non-overlapping sentences across pauses and ayahs
    return p + ' ' + n;
}

// Build flat target words from active target ayahs
function buildTargetWordsList(targetAyahs) {
    const list = [];
    if (!targetAyahs || !targetAyahs.length) return list;
    targetAyahs.forEach(ayah => {
        const rawWords = ayah.rawWords || (ayah.text ? ayah.text.split(/\s+/).filter(Boolean) : []);
        rawWords.forEach((w, idx) => {
            list.push({
                raw: w,
                norm: normalizeArabicText(w),
                ayahNum: ayah.numberInSurah,
                wordIdx: idx
            });
        });
    });
    return list;
}

// Recovers a dropped/clipped opening word caused by silence/pause between Ayahs or recording startup
function recoverClippedSpeechWord(prevCommittedText, currentSessionText, targetAyahs) {
    const curr = (currentSessionText || '').trim();
    if (!curr) return curr;

    const targetWords = buildTargetWordsList(targetAyahs);
    if (!targetWords.length) return curr;

    const currWords = curr.split(/\s+/).filter(Boolean);
    if (!currWords.length) return curr;

    const prev = (prevCommittedText || '').trim();
    const prevWords = prev ? prev.split(/\s+/).filter(Boolean) : [];

    let nextExpectedIdx = 0;

    if (prevWords.length > 0) {
        let foundIdx = -1;
        const lastPrevWord = prevWords[prevWords.length - 1];
        
        for (let i = targetWords.length - 1; i >= 0; i--) {
            if (areArabicWordsMatching(targetWords[i].raw, lastPrevWord)) {
                if (prevWords.length >= 2 && i >= 1) {
                    if (areArabicWordsMatching(targetWords[i - 1].raw, prevWords[prevWords.length - 2])) {
                        foundIdx = i;
                        break;
                    }
                } else {
                    foundIdx = i;
                    break;
                }
            }
        }

        if (foundIdx === -1) {
            // Fuzzy fallback: the last word may have been mispronounced.
            // Try anchoring on the second-to-last word to approximate position.
            if (prevWords.length >= 2) {
                const secondToLast = prevWords[prevWords.length - 2];
                for (let i = targetWords.length - 1; i >= 0; i--) {
                    if (areArabicWordsMatching(targetWords[i].raw, secondToLast)) {
                        // Confirm with third-to-last if possible
                        if (prevWords.length >= 3 && i >= 1) {
                            if (areArabicWordsMatching(targetWords[i - 1].raw, prevWords[prevWords.length - 3])) {
                                foundIdx = Math.min(i + 1, targetWords.length - 1);
                                break;
                            }
                        } else {
                            foundIdx = Math.min(i + 1, targetWords.length - 1);
                            break;
                        }
                    }
                }
            }
            if (foundIdx === -1) {
                return curr;
            }
        }

        nextExpectedIdx = foundIdx + 1;
    } else {
        nextExpectedIdx = 0;
    }

    if (nextExpectedIdx >= targetWords.length) {
        return curr;
    }

    const expectedOpening = targetWords[nextExpectedIdx];
    const firstSpoken = currWords[0];

    // If first spoken matches expected word, no clipping occurred
    if (areArabicWordsMatching(expectedOpening.raw, firstSpoken)) {
        return curr;
    }

    // Check if the first spoken word matches the word AFTER the expected opening word (nextExpectedIdx + 1)
    if (nextExpectedIdx + 1 < targetWords.length) {
        const expectedSecond = targetWords[nextExpectedIdx + 1];
        if (areArabicWordsMatching(expectedSecond.raw, firstSpoken)) {
            let confirmed = true;
            if (currWords.length >= 2 && nextExpectedIdx + 2 < targetWords.length) {
                const expectedThird = targetWords[nextExpectedIdx + 2];
                if (!areArabicWordsMatching(expectedThird.raw, currWords[1])) {
                    confirmed = false;
                }
            }

            if (confirmed) {
                return expectedOpening.raw + ' ' + curr;
            }
        }
    }

    return curr;
}

// Safety net: Ensures every Ayah boundary in the full transcript preserves its opening word
function ensureAllAyahBoundariesIntact(transcribedText, targetAyahs) {
    if (!transcribedText || !targetAyahs || targetAyahs.length <= 1) return transcribedText;
    let words = transcribedText.split(/\s+/).filter(Boolean);
    if (!words.length) return transcribedText;

    for (let aIdx = 0; aIdx < targetAyahs.length - 1; aIdx++) {
        const currAyah = targetAyahs[aIdx];
        const nextAyah = targetAyahs[aIdx + 1];
        if (!currAyah.rawWords || !currAyah.rawWords.length || !nextAyah.rawWords || nextAyah.rawWords.length < 2) continue;

        const currLastWord = currAyah.rawWords[currAyah.rawWords.length - 1];
        const nextFirstWord = nextAyah.rawWords[0];
        const nextSecondWord = nextAyah.rawWords[1];

        for (let i = 0; i < words.length - 1; i++) {
            if (areArabicWordsMatching(words[i], currLastWord)) {
                const candidateFollow = words[i + 1];
                if (!areArabicWordsMatching(candidateFollow, nextFirstWord) && areArabicWordsMatching(candidateFollow, nextSecondWord)) {
                    // Single-word drop: first word of next ayah was clipped
                    let confirmed = true;
                    if (words.length > i + 2 && nextAyah.rawWords.length > 2) {
                        if (!areArabicWordsMatching(words[i + 2], nextAyah.rawWords[2])) {
                            confirmed = false;
                        }
                    }
                    if (confirmed) {
                        words.splice(i + 1, 0, nextFirstWord);
                        break;
                    }
                }
                // Two-word drop: first AND second words of next ayah were clipped
                if (!areArabicWordsMatching(candidateFollow, nextFirstWord) && 
                    !areArabicWordsMatching(candidateFollow, nextSecondWord) &&
                    nextAyah.rawWords.length > 2 &&
                    areArabicWordsMatching(candidateFollow, nextAyah.rawWords[2])) {
                    let confirmed2 = true;
                    if (words.length > i + 2 && nextAyah.rawWords.length > 3) {
                        if (!areArabicWordsMatching(words[i + 2], nextAyah.rawWords[3])) {
                            confirmed2 = false;
                        }
                    }
                    if (confirmed2) {
                        words.splice(i + 1, 0, nextFirstWord, nextSecondWord);
                        break;
                    }
                }
            }
        }
    }
    return words.join(' ');
}

function mergeTwoSpeechSegments(prev, next) {
    return combineSpeechSegments(prev, next);
}

// Intelligent n-gram deduplication to eliminate Whisper hallucinations and repetitive speech loops
function deduplicateSpokenPhrases(text, targetVerseText) {
    if (!text) return '';
    let words = text.split(/\s+/).filter(Boolean);
    if (words.length <= 1) return text;

    const normTarget = normalizeArabicText(targetVerseText || '');

    let changed = true;
    while (changed) {
        changed = false;
        const maxLen = Math.floor(words.length / 2);
        for (let len = maxLen; len >= 1; len--) {
            for (let i = 0; i <= words.length - 2 * len; i++) {
                let isDup = true;
                for (let k = 0; k < len; k++) {
                    if (normalizeArabicText(words[i + k]) !== normalizeArabicText(words[i + len + k])) {
                        isDup = false;
                        break;
                    }
                }
                if (isDup) {
                    const phraseNorm = words.slice(i, i + len).map(normalizeArabicText).join(' ');
                    const repPhrase = phraseNorm + ' ' + phraseNorm;
                    // Keep only if legitimately repeated in the Quran target text (e.g. "دكا دكا")
                    if (normTarget && normTarget.includes(repPhrase)) {
                        continue;
                    }
                    // Remove duplicate repeated phrase
                    words.splice(i + len, len);
                    changed = true;
                    break;
                }
            }
            if (changed) break;
        }
    }
    return words.join(' ');
}

function startLiveSpeechRecognition() {
    accumulatedSpeechText = "";
    currentInterimSpeechText = "";
    committedPreviousSessionsText = "";
    currentSessionFinalText = "";
    liveTranscript = "";
    speechRestartAttempts = 0;
    if (speechRestartTimeout) {
        clearTimeout(speechRestartTimeout);
        speechRestartTimeout = null;
    }
    spawnSpeechRecognizer();
}

function spawnSpeechRecognizer() {
    if (!isRecording) return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
        console.log("Speech recognition not supported natively in this browser.");
        return;
    }

    // Cleanly tear down any prior recognizer without calling abort on an ended instance
    if (speechRecognizer) {
        try {
            speechRecognizer.onresult = null;
            speechRecognizer.onend = null;
            speechRecognizer.onerror = null;
            if (isRecognizing) {
                speechRecognizer.stop();
            }
        } catch (e) {}
        speechRecognizer = null;
    }

    try {
        const recognizer = new SpeechRec();
        speechRecognizer = recognizer;
        recognizer.lang = 'ar-SA';
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.maxAlternatives = 1;

        currentSessionFinalText = "";
        currentInterimSpeechText = "";

        recognizer.onstart = () => {
            isRecognizing = true;
            speechRestartAttempts = 0;
            if (speechFeedbackLabel) {
                speechFeedbackLabel.textContent = '🎙️ نستمع لتلاوتك الكريمة الآن بوضوح...';
            }
        };

        recognizer.onresult = (event) => {
            if (!isRecording) return;

            const finalSegments = [];
            let interimSegment = '';

            for (let i = 0; i < event.results.length; ++i) {
                const res = event.results[i];
                const segment = (res[0]?.transcript || '').trim();
                if (!segment) continue;

                if (res.isFinal) {
                    finalSegments.push(segment);
                } else {
                    interimSegment = segment;
                }
            }

            currentSessionFinalText = finalSegments.join(' ').trim();
            currentInterimSpeechText = interimSegment.trim();

            let currentSessionFull = currentSessionFinalText 
                ? (currentInterimSpeechText ? currentSessionFinalText + ' ' + currentInterimSpeechText : currentSessionFinalText)
                : currentInterimSpeechText;

            if (currentSessionFull) {
                const activeAyahs = (typeof getActiveTargetAyahs === 'function') ? getActiveTargetAyahs() : [];
                currentSessionFull = recoverClippedSpeechWord(committedPreviousSessionsText, currentSessionFull, activeAyahs);
            }

            const fullRaw = combineSpeechSegments(committedPreviousSessionsText, currentSessionFull);

            liveTranscript = normalizeQuranicDisjointedLetters(fullRaw.trim(), currentSurahNumber, currentAyahNumber);
            accumulatedSpeechText = liveTranscript;

            // Live Visual Feedback:
            // 1. Recitation mode: Highlights recited words in green on the Mushaf as the user recites!
            // 2. Memorization mode: Renders spoken words live on the canvas!
            updateLiveSpokenHighlights(liveTranscript);
        };

        recognizer.onerror = (e) => {
            console.warn("SpeechRecognition notice:", e.error);
            // Non-fatal pause / breath silences - never abort or reset recording
            if (e.error === 'no-speech' || e.error === 'aborted') {
                return;
            }

            if (e.error === 'audio-capture') {
                speechRestartAttempts++;
                if (speechRestartAttempts <= 2 && isRecording) {
                    if (speechRestartTimeout) clearTimeout(speechRestartTimeout);
                    speechRestartTimeout = setTimeout(() => {
                        if (isRecording) spawnSpeechRecognizer();
                    }, 500);
                } else {
                    console.warn("Speech recognition audio-capture attempt limit reached.");
                }
                return;
            }

            const isBraveOrBlocked = isBraveBrowserCached || (navigator.brave && typeof navigator.brave.isBrave === 'function') || /Brave/i.test(navigator.userAgent) || (e.error === 'network' && navigator.onLine);

            if (e.error === 'not-allowed') {
                isBraveBrowserCached = true;
                if (speechFeedbackLabel) speechFeedbackLabel.textContent = '⚠️ متصفح Brave يحجب التعرف الصوتي (Google Speech)';
                showToast("متصفح Brave يحجب خدمة التعرف الصوتي افتراضياً. يمكنك تفعيلها من إعدادات Brave (درع Brave والخصوصية ⬅️ استخدام خدمات Google الصوتية) أو فتح الموقع في Google Chrome.", "fa-solid fa-triangle-exclamation");
            } else if (e.error === 'network') {
                if (navigator.onLine) {
                    isBraveBrowserCached = true;
                    if (speechFeedbackLabel) speechFeedbackLabel.textContent = '⚠️ متصفح Brave يمنع خدمة التعرف الصوتي';
                    showToast("متصفح Brave يمنع خدمة التعرف الصوتي. يرجى تفعيل (استخدام خدمات Google الصوتية) في إعدادات Brave أو استخدام Google Chrome.", "fa-solid fa-triangle-exclamation");
                } else {
                    if (speechFeedbackLabel) speechFeedbackLabel.textContent = '⚠️ خدمة التعرف الصوتي تحتاج لاتصال بالإنترنت';
                    if (isRecording) {
                        if (speechRestartTimeout) clearTimeout(speechRestartTimeout);
                        speechRestartTimeout = setTimeout(() => {
                            if (isRecording) spawnSpeechRecognizer();
                        }, 500);
                    }
                }
            }
        };

        recognizer.onend = () => {
            isRecognizing = false;
            // Commit all recognized words from this session cleanly using combineSpeechSegments and recovery
            let currentSessionFull = currentSessionFinalText 
                ? (currentInterimSpeechText ? currentSessionFinalText + ' ' + currentInterimSpeechText : currentSessionFinalText)
                : currentInterimSpeechText;

            if (currentSessionFull) {
                const activeAyahs = (typeof getActiveTargetAyahs === 'function') ? getActiveTargetAyahs() : [];
                currentSessionFull = recoverClippedSpeechWord(committedPreviousSessionsText, currentSessionFull, activeAyahs);
                committedPreviousSessionsText = combineSpeechSegments(committedPreviousSessionsText, currentSessionFull);
                currentSessionFinalText = "";
                currentInterimSpeechText = "";
                liveTranscript = committedPreviousSessionsText.trim();
                accumulatedSpeechText = liveTranscript;
            }

            // Zero-delay immediate respawn if recording is still active
            if (isRecording) {
                if (speechRestartTimeout) clearTimeout(speechRestartTimeout);
                spawnSpeechRecognizer();
            }
        };

        recognizer.start();
    } catch (e) {
        console.warn("Failed to start SpeechRecognition:", e);
        if (isRecording) {
            if (speechRestartTimeout) clearTimeout(speechRestartTimeout);
            speechRestartTimeout = setTimeout(() => {
                if (isRecording) {
                    spawnSpeechRecognizer();
                }
            }, 50);
        }
    }
}

function stopLiveSpeechRecognition() {
    isRecognizing = false;
    if (speechRestartTimeout) {
        clearTimeout(speechRestartTimeout);
        speechRestartTimeout = null;
    }
    if (speechRecognizer) {
        try {
            speechRecognizer.onresult = null;
            speechRecognizer.onend = null;
            speechRecognizer.onerror = null;
            speechRecognizer.stop();
        } catch (e) {}
        speechRecognizer = null;
    }
}

// -----------------------------------------------------------------------------
// 12. Fawatih Al-Suwar Normalization & Intelligent Surah/Ayah Detection
// -----------------------------------------------------------------------------
function normalizeQuranicDisjointedLetters(text, surahNum = currentSurahNumber, ayahNum = currentAyahNumber) {
    if (!text) return '';
    let res = text;

    function replacePhrase(str, pattern, replacement) {
        const regex = new RegExp('(?:^|\\s)(?:' + pattern + ')(?=\\s|$)', 'gi');
        return str.replace(regex, (match) => {
            const startsWithSpace = match.startsWith(' ');
            return (startsWithSpace ? ' ' : '') + replacement;
        });
    }

    // 1. Five-letter: كهيعص (سورة مريم)
    res = replacePhrase(res, '(?:كاف|كف)\\s+(?:ها|هاء)\\s+(?:يا|ياء)\\s+(?:عين|عن)\\s+(?:صاد|صد)', 'كهيعص');

    // 2. Four-letter: المص (سورة الأعراف)
    res = replacePhrase(res, '(?:[أإا]لف)\\s+(?:لام|لم)\\s+(?:ميم|مم)\\s+(?:صاد|صد)', 'المص');

    // 3. Four-letter: المر (سورة الرعد)
    res = replacePhrase(res, '(?:[أإا]لف)\\s+(?:لام|لم)\\s+(?:ميم|مم)\\s+(?:را|راء|ر)', 'المر');

    // 4. Three-letter: الم (البقرة، آل عمران، العنكبوت، الروم، لقمان، السجدة)
    res = replacePhrase(res, '(?:[أإا]لف)\\s+(?:لام|لم)\\s+(?:ميم|مم)', 'الم');

    // 5. Three-letter: الر (يونس، هود، يوسف، إبراهيم، الحجر)
    res = replacePhrase(res, '(?:[أإا]لف)\\s+(?:لام|لم)\\s+(?:را|راء|ر)', 'الر');

    // 6. Three-letter: طسم (الشعراء، القصص)
    res = replacePhrase(res, '(?:طا|طاء)\\s+(?:سين|سن)\\s+(?:ميم|مم)', 'طسم');

    // 7. Three-letter: عسق (الشورى آية 2)
    res = replacePhrase(res, '(?:عين|عن)\\s+(?:سين|سن)\\s+(?:قاف|قف)', 'عسق');

    // 8. Two-letter: طس (النمل)
    res = replacePhrase(res, '(?:طا|طاء)\\s+(?:سين|سن)|طاسين', 'طس');

    // 9. Two-letter: حم (غافر، فصلت، الشورى 1، الزخرف، الدخان، الجاثية، الأحقاف)
    res = replacePhrase(res, '(?:حا|حاء)\\s+(?:ميم|مم)|حاميم', 'حم');

    // 10. Two-letter: طه (طه)
    res = replacePhrase(res, '(?:طا|طاء)\\s+(?:ها|هاء)|طاها', 'طه');

    // 11. Two-letter: يس (يس)
    res = replacePhrase(res, '(?:يا|ياء)\\s+(?:سين|سن)', 'يس');
    if (surahNum === 36 || /^\s*ياسين(?:\s+|$)/.test(res)) {
        res = replacePhrase(res, 'ياسين', 'يس');
    }

    // 12. Single-letter: ص (ص)
    if (surahNum === 38 || /(?:^|\s)صاد\s+والقر[اآ]ن/.test(res) || /^\s*صاد\s*$/.test(res)) {
        res = replacePhrase(res, 'صاد', 'ص');
    }

    // 13. Single-letter: ق (ق)
    if (surahNum === 50 || /(?:^|\s)قاف\s+والقر[اآ]ن/.test(res) || /^\s*قاف\s*$/.test(res)) {
        res = replacePhrase(res, 'قاف', 'ق');
    }

    // 14. Single-letter: ن (القلم)
    if (surahNum === 68 || /(?:^|\s)نون\s+والقلم/.test(res) || /^\s*نون\s*$/.test(res)) {
        res = replacePhrase(res, 'نون', 'ن');
    }

    return res.trim().replace(/\s+/g, ' ');
}

function preprocessSpokenWords(words) {
    if (!words || !words.length) return [];

    // 1. Normalize disjointed letters across the sequence of spoken words
    const joinedText = words.join(' ');
    const normalizedText = normalizeQuranicDisjointedLetters(joinedText, currentSurahNumber, currentAyahNumber);
    const splitWords = normalizedText.split(/\s+/).filter(Boolean);

    // 2. Expand merged spoken words
    const expanded = [];
    splitWords.forEach(w => {
        const norm = normalizeArabicText(w);
        if (norm === 'الحمدلله') {
            expanded.push('الحمد', 'لله');
        } else if (norm === 'يارب') {
            expanded.push('يا', 'رب');
        } else if (norm === 'انشاءالله' || norm === 'انشاالله') {
            expanded.push('إن', 'شاء', 'الله');
        } else {
            expanded.push(w);
        }
    });

    // 3. Merge vocative particles with following words to match Uthmani script (e.g. يا أيها -> ياأيها)
    const merged = [];
    const vocativesToJoin = ['ايها', 'أيها', 'ايه', 'أيه', 'بني', 'بنى', 'ابت', 'أبت', 'اهل', 'أهل', 'ابراهيم', 'إبراهيم', 'موسى', 'عيسى', 'نوح', 'داود', 'ليتني', 'ويلتى', 'حسرة', 'حسرتي'];

    for (let i = 0; i < expanded.length; i++) {
        const curr = expanded[i];
        const next = expanded[i + 1];
        if (curr === 'يا' && next) {
            const nextClean = next.replace(/^[أإآ]/, 'ا').replace(/[ى]/, 'ي');
            const shouldJoin = vocativesToJoin.some(v => nextClean.startsWith(v.replace(/^[أإآ]/, 'ا').replace(/[ى]/, 'ي')));
            if (shouldJoin) {
                merged.push('يا' + next);
                i++;
                continue;
            }
        }
        if (curr === 'ها' && next && (next === 'انتم' || next === 'أنتم')) {
            merged.push('ها' + next);
            i++;
            continue;
        }
        merged.push(curr);
    }

    return merged;
}

// Filter out opening Isti'adhah, Basmalah (when not part of target verse), and closing Tasdiq
function stripExtraneousRecitationWords(words, targetAyahs) {
    if (!words || !words.length) return [];
    let res = [...words];

    // 1. Strip Ta'awwudh / Isti'adhah at the beginning ("أعوذ بالله من الشيطان الرجيم")
    if (res.length >= 5) {
        const norm5 = res.slice(0, 5).map(normalizeArabicText).join(' ');
        if (norm5.startsWith('اعوذ بالله من الشيطان الرجيم')) {
            res = res.slice(5);
        }
    }

    // 2. Strip Basmalah at the beginning IF the first target ayah is NOT Ayah 1 of Surah 1 (Al-Fatihah)
    const isFatihahAyah1 = targetAyahs && targetAyahs.length > 0 && targetAyahs[0].ayahNum === 1 && currentSurahNumber === 1;
    if (!isFatihahAyah1 && res.length >= 4) {
        const norm4 = res.slice(0, 4).map(normalizeArabicText).join(' ');
        if (norm4 === 'بسم الله الرحمن الرحيم' || norm4 === 'باسم الله الرحمن الرحيم') {
            res = res.slice(4);
        }
    }

    // 3. Strip closing Tasdiq ('صدق الله العظيم' / 'صدق الله العلي العظيم')
    if (res.length >= 4) {
        const last4 = res.slice(-4).map(normalizeArabicText).join(' ');
        if (last4 === 'صدق الله العلي العظيم') {
            res = res.slice(0, -4);
        }
    }
    if (res.length >= 3) {
        const last3 = res.slice(-3).map(normalizeArabicText).join(' ');
        if (last3 === 'صدق الله العظيم') {
            res = res.slice(0, -3);
        }
    }

    return res;
}

function detectSpokenSurahAndAyah(spokenWords) {
    if (!spokenWords || !spokenWords.length) return null;

    let processed = preprocessSpokenWords(spokenWords);
    if (!processed.length) return null;

    // 1. Check and strip Ta'awwudh if recited
    const normFull = processed.map(normalizeArabicText).join(' ');
    if (normFull.startsWith('اعوذ بالله من الشيطان الرجيم')) {
        processed = processed.slice(5);
    }

    // 2. Check and handle Basmalah if recited before surah (when target surah is not Al-Fatihah)
    const normAfterTaawwudh = processed.map(normalizeArabicText).join(' ');
    let withoutBasmalah = processed;
    if (currentSurahNumber !== 1 && (normAfterTaawwudh.startsWith('بسم الله الرحمن الرحيم') || normAfterTaawwudh.startsWith('باسم الله الرحمن الرحيم'))) {
        withoutBasmalah = processed.slice(4);
    }

    const testCandidates = [processed];
    if (withoutBasmalah !== processed && withoutBasmalah.length > 0) {
        testCandidates.unshift(withoutBasmalah); // prioritize matching without opening Basmalah for non-Fatihah surahs
    }

    for (let candidate of testCandidates) {
        const normSpk = candidate.map(normalizeArabicText);
        if (!normSpk.length) continue;

        // FAST CHECK: Current Ayah & Current Surah (Instantaneous, < 0.1ms)
        if (currentSurahVerses && currentSurahVerses.length) {
            const curAyah = currentSurahVerses.find(a => a.numberInSurah === currentAyahNumber);
            if (curAyah && curAyah.normWords && curAyah.normWords.length) {
                let matchCount = 0;
                const checkLimit = Math.min(normSpk.length, curAyah.normWords.length);
                for (let i = 0; i < checkLimit; i++) {
                    if (curAyah.normWords[i] === normSpk[i] || areArabicWordsMatching(curAyah.rawWords[i], candidate[i])) {
                        matchCount++;
                    }
                }
                if (matchCount >= 2 || (checkLimit <= 3 && matchCount >= 1)) {
                    return { surahNum: currentSurahNumber, ayahNum: currentAyahNumber, score: matchCount };
                }
            }

            for (let i = 0; i < currentSurahVerses.length; i++) {
                const a = currentSurahVerses[i];
                let matchCount = 0;
                const checkLimit = Math.min(normSpk.length, a.normWords.length);
                for (let k = 0; k < checkLimit; k++) {
                    if (a.normWords[k] === normSpk[k] || areArabicWordsMatching(a.rawWords[k], candidate[k])) {
                        matchCount++;
                    }
                }
                if (matchCount >= 2 || (a.normWords.length <= 2 && matchCount >= a.normWords.length)) {
                    return { surahNum: currentSurahNumber, ayahNum: a.numberInSurah, score: matchCount };
                }
            }
        }
    }

    const normSpk = processed.map(normalizeArabicText);
    if (!normSpk.length) return null;

    // 3. Fast scan across other surahs without deep quadratic loops
    if (window.QURAN_FULL_DATA) {
        for (let s = 1; s <= 114; s++) {
            if (s === currentSurahNumber) continue;
            const sData = window.QURAN_FULL_DATA[s];
            if (!sData || !sData.ayahs) continue;
            for (let a = 0; a < sData.ayahs.length; a++) {
                const ayahObj = sData.ayahs[a];
                const rawAyahWords = (ayahObj.text || '').replace(/^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/, '').split(/\s+/).filter(Boolean);
                let mCount = 0;
                const lim = Math.min(normSpk.length, rawAyahWords.length, 4);
                for (let k = 0; k < lim; k++) {
                    if (normalizeArabicText(rawAyahWords[k]) === normSpk[k] || areArabicWordsMatching(rawAyahWords[k], processed[k])) {
                        mCount++;
                    } else {
                        break;
                    }
                }
                if (mCount >= 3 || (rawAyahWords.length <= 2 && mCount >= rawAyahWords.length && processed.length === rawAyahWords.length)) {
                    return { surahNum: s, ayahNum: ayahObj.numberInSurah || (a + 1), score: mCount };
                }
            }
        }
    }

    return null;
}

function getConsecutiveAyahsForSpokenWords(startAyahNum, spokenWordsCount) {
    if (!currentSurahVerses || !currentSurahVerses.length) return [];
    if (recitationScopeMode === 'full' || isFullSurahMode) {
        return currentSurahVerses;
    }
    if (recitationScopeMode === 'range') {
        const from = Math.min(rangeFromAyah, rangeToAyah);
        const to = Math.max(rangeFromAyah, rangeToAyah);
        return currentSurahVerses.filter(a => a.numberInSurah >= from && a.numberInSurah <= to);
    }
    const result = [];
    let wordCount = 0;

    for (let i = 0; i < currentSurahVerses.length; i++) {
        const a = currentSurahVerses[i];
        if (a.numberInSurah >= startAyahNum) {
            result.push(a);
            wordCount += a.rawWords.length;
            if (wordCount >= spokenWordsCount) {
                break;
            }
        }
    }
    return result.length > 0 ? result : [currentSurahVerses[0]];
}

function syncDetectedSurahAndAyah(surahNum, ayahNum) {
    if (surahNum !== currentSurahNumber) {
        currentSurahNumber = surahNum;
        currentAyahNumber = ayahNum;
        loadSurahAndVerses(surahNum, ayahNum);
        const sMeta = SURAHS_DB.find(s => s.number === surahNum);
        showToast(`تم التعرف تلقائياً: سورة ${sMeta ? sMeta.name : surahNum} - الآية ${ayahNum} ✨`);
    } else if (ayahNum !== currentAyahNumber) {
        currentAyahNumber = ayahNum;
        if (selectedAyahDisplay) selectedAyahDisplay.textContent = `الآية ${ayahNum}`;
        if (centerAyahsRange) centerAyahsRange.textContent = `الآية ${ayahNum} من ${currentSurahVerses.length}`;
        if (inputAyahNum) inputAyahNum.value = ayahNum;
        const activeAyah = currentSurahVerses.find(a => a.numberInSurah === ayahNum);
        if (activeAyah) currentTargetVerseText = activeAyah.text;
    }
}

// Global Needleman-Wunsch Sequence Alignment for Quranic Words
function alignRecitation(expectedWordsList, spokenWordsList) {
    const N = expectedWordsList.length;
    const M = spokenWordsList.length;
    const dp = Array.from({ length: N + 1 }, () => new Int32Array(M + 1));

    const GAP_PENALTY = 1;
    const MISMATCH_PENALTY = 3;
    const MATCH_SCORE = 3;

    for (let i = 0; i <= N; i++) dp[i][0] = -i * GAP_PENALTY;
    for (let j = 0; j <= M; j++) dp[0][j] = -j * GAP_PENALTY;

    for (let i = 1; i <= N; i++) {
        const eWord = expectedWordsList[i - 1].raw;
        for (let j = 1; j <= M; j++) {
            const sWord = spokenWordsList[j - 1];
            const isMatch = areArabicWordsMatching(eWord, sWord);
            const score = isMatch ? MATCH_SCORE : -MISMATCH_PENALTY;
            dp[i][j] = Math.max(
                dp[i - 1][j - 1] + score,
                dp[i - 1][j] - GAP_PENALTY,
                dp[i][j - 1] - GAP_PENALTY
            );
        }
    }

    let i = N, j = M;
    const alignment = [];
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0) {
            const eWord = expectedWordsList[i - 1].raw;
            const sWord = spokenWordsList[j - 1];
            const isMatch = areArabicWordsMatching(eWord, sWord);
            const score = isMatch ? MATCH_SCORE : -MISMATCH_PENALTY;
            if (dp[i][j] === dp[i - 1][j - 1] + score) {
                alignment.unshift({
                    type: isMatch ? 'match' : 'mismatch',
                    expectedObj: expectedWordsList[i - 1],
                    spoken: sWord
                });
                i--; j--;
                continue;
            }
        }
        if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] - GAP_PENALTY)) {
            alignment.unshift({
                type: 'missing',
                expectedObj: expectedWordsList[i - 1],
                spoken: null
            });
            i--;
        } else if (j > 0) {
            alignment.unshift({
                type: 'extra',
                expectedObj: null,
                spoken: spokenWordsList[j - 1]
            });
            j--;
        } else {
            break;
        }
    }
    return alignment;
}

function updateLiveSpokenHighlights(spokenText) {
    const rawWords = spokenText.split(/\s+/).filter(Boolean);
    if (!rawWords.length) return;

    const spokenWords = preprocessSpokenWords(rawWords);

    // 1. Memorization Mode: Render spoken words live in natural Quran calligraphy WITHOUT premature errors
    if (studioDisplayMode === 'memorize') {
        if (memorizeCanvasHint) memorizeCanvasHint.classList.add('has-words');
        if (memorizeLiveWords) {
            let liveHtml = '';
            spokenWords.forEach(spkWord => {
                liveHtml += `<span class="inscribed-word live-reciting">${escapeHTML(spkWord)}</span> `;
            });
            memorizeLiveWords.innerHTML = liveHtml;
        }
    }

    // 2. Recitation Mode: Highlight recited words in glowing GREEN on the Mushaf text word by word!
    if (studioDisplayMode === 'recite' && mushafVersesFlow) {
        const targetAyahs = (typeof getActiveTargetAyahs === 'function') ? getActiveTargetAyahs() : [];
        if (targetAyahs.length && spokenWords.length) {
            let sIdx = 0;
            let lastMatchedEl = null;

            targetAyahs.forEach(ayah => {
                (ayah.rawWords || []).forEach((expectedRaw, wIdx) => {
                    const wordEl = document.getElementById(`word-${ayah.numberInSurah}-${wIdx}`);
                    if (!wordEl) return;
                    wordEl.classList.remove('spoken-active');

                    if (sIdx < spokenWords.length) {
                        let matched = false;
                        for (let look = 0; look <= 2 && (sIdx + look) < spokenWords.length; look++) {
                            if (areArabicWordsMatching(expectedRaw, spokenWords[sIdx + look])) {
                                matched = true;
                                sIdx += look + 1;
                                break;
                            }
                        }
                        if (matched) {
                            wordEl.classList.add('spoken-match');
                            lastMatchedEl = wordEl;
                        }
                    }
                });
            });

            // Luminous pulse on the very latest word recited
            if (lastMatchedEl) {
                lastMatchedEl.classList.add('spoken-active');
            }
        }
    }
}

// -----------------------------------------------------------------------------
// 13. AI Inference Pipeline & Evaluation
// -----------------------------------------------------------------------------
function executeImmediateEvaluation(audioBlob, whisperTranscript) {
    try {
        let transcribedText = "";

        // Prioritize Whisper transcript (lossless continuous audio) over Web Speech API transcript
        if (whisperTranscript && whisperTranscript.trim().length > 0) {
            transcribedText = whisperTranscript.trim();
        } else {
            // Fallback: use Web Speech API accumulated transcript
            transcribedText = (liveTranscript || "").trim();

            // Fallback: check DOM element if liveTranscript was empty
            if (!transcribedText && speechLiveTextDisplay) {
                const activeTextEl = speechLiveTextDisplay.querySelector('.speech-active-text');
                if (activeTextEl && activeTextEl.textContent) {
                    transcribedText = activeTextEl.textContent.trim();
                }
            }
            if (!transcribedText && accumulatedSpeechText) {
                transcribedText = accumulatedSpeechText.trim();
            }
        }

        // Honest evaluation: Never fake user recitation with the target verse!
        if (!transcribedText || transcribedText.length === 0) {
            // Still configure audio playback so user can hear what was recorded!
            const effectiveBlob = audioBlob || recordedAudioBlob;
            if (effectiveBlob && effectiveBlob.size > 0) {
                try {
                    const audioUrl = URL.createObjectURL(effectiveBlob);
                    if (userRecitationAudio) userRecitationAudio.src = audioUrl;
                    if (userModalRecitationAudio) userModalRecitationAudio.src = audioUrl;
                    if (btnDownloadUserAudio) btnDownloadUserAudio.href = audioUrl;
                    if (btnDownloadModalAudio) btnDownloadModalAudio.href = audioUrl;
                    if (userRecitationPlayerBox) userRecitationPlayerBox.style.display = 'block';
                } catch (e) {}
            }

            const hasRecordedAudio = Boolean(effectiveBlob && effectiveBlob.size > 1200);
            const isBraveOrBlocked = isBraveBrowserCached || (navigator.brave && typeof navigator.brave.isBrave === 'function') || /Brave/i.test(navigator.userAgent) || (hasRecordedAudio && navigator.onLine);

            if (playerStatusMain) {
                if (isBraveOrBlocked) {
                    playerStatusMain.innerHTML = `
                        <div class="brave-guide-banner" style="background:rgba(255,80,0,0.14); border:1.5px solid #ff5000; border-radius:12px; padding:12px 16px; text-align:right; color:#fff; max-width:620px; margin:0 auto; box-shadow: 0 4px 16px rgba(255,80,0,0.2);">
                            <div style="font-weight:800; color:#ff7733; font-size:15px; margin-bottom:5px; display:flex; align-items:center; gap:8px;">
                                <i class="fa-solid fa-shield-halved"></i> متصفحك (Brave) يحجب التعرف الصوتي افتراضياً
                            </div>
                            <div style="font-size:13px; line-height:1.6; color:rgba(255,255,255,0.92); margin-bottom:10px;">
                                تم تسجيل تلاوتك بصوتك بنجاح 🎙️ (يمكنك الاستماع لها بالمشغل أدناه)، ولكن متصفح Brave يحجب خدمة تحويل الصوت لنصوص تلقائياً لحماية الخصوصية.
                            </div>
                            <div style="background:rgba(0,0,0,0.38); border-radius:8px; padding:10px 12px; font-size:12.5px; line-height:1.75; text-align:right;">
                                <div style="color:var(--gold,#c5a859); font-weight:700; margin-bottom:4px;">حل هذه المشكلة (خلال ثوانٍ):</div>
                                <div>1️⃣ <strong>الحل الأسرع:</strong> افتح الموقع في متصفح <strong>Google Chrome</strong> وسيعمل التسميع فوراً وبدقة تامة.</div>
                                <div>2️⃣ <strong>أو لتشغيله في Brave:</strong> ادخل إعدادات Brave (⚙️) ⬅️ (درع Brave والخصوصية) ⬅️ فعّل <strong>(استخدام خدمات Google الصوتية / Use Google speech services)</strong>.</div>
                            </div>
                        </div>
                    `;
                } else {
                    playerStatusMain.innerHTML = `<span style="color:#e74c3c; font-weight:700;"><i class="fa-solid fa-microphone-slash"></i> لم يتم التقاط كلمات واضحة</span>`;
                }
            }
            if (playerStatusSub) {
                playerStatusSub.textContent = isBraveOrBlocked 
                    ? 'اتبع التعليمات أعلاه لتشغيل التسميع في Brave أو افتح الرابط في Google Chrome'
                    : 'تأكد من إعطاء صلاحية الميكروفون والتلاوة بصوت واضح بالقرب من الميكروفون ثم اضغط إنهاء.';
            }
            if (speechFeedbackLabel) {
                speechFeedbackLabel.textContent = isBraveOrBlocked ? '⚠️ متصفح Brave يحجب التعرف الصوتي' : '⚠️ لم يتم سماع أي كلمات';
            }
            showToast(isBraveOrBlocked 
                ? 'متصفح Brave يحجب خدمة التعرف الصوتي. يرجى تفعيلها من إعدادات Brave أو استخدام Chrome'
                : 'لم يتم التقاط أي كلمات منطوقة.. يرجى التلاوة بصوت واضح بالقرب من الميكروفون', 
                'fa-solid fa-triangle-exclamation');
            return;
        }

        let targetText = currentTargetVerseText || "";
        try {
            const targetAyahs = (typeof getActiveTargetAyahs === 'function') ? getActiveTargetAyahs() : [];
            if (targetAyahs && targetAyahs.length) {
                targetText = targetAyahs.map(a => a.text).join(' ');
            }
        } catch (e) {}

        transcribedText = normalizeQuranicDisjointedLetters(transcribedText, currentSurahNumber, currentAyahNumber);
        transcribedText = deduplicateSpokenPhrases(transcribedText, targetText);
        liveTranscript = transcribedText;
        accumulatedSpeechText = transcribedText;

        // Preprocess spoken words
        const rawWords = transcribedText.split(/\s+/).filter(Boolean);
        const spokenWords = preprocessSpokenWords(rawWords);

        // Target Ayahs determination: respect user's scope mode first
        let targetAyahs = [];
        if (recitationScopeMode === 'full' || isFullSurahMode) {
            targetAyahs = currentSurahVerses && currentSurahVerses.length ? currentSurahVerses : [];
        } else if (recitationScopeMode === 'range') {
            const from = Math.min(rangeFromAyah, rangeToAyah);
            const to = Math.max(rangeFromAyah, rangeToAyah);
            targetAyahs = (currentSurahVerses && currentSurahVerses.length)
                ? currentSurahVerses.filter(a => a.numberInSurah >= from && a.numberInSurah <= to)
                : [];
        } else {
            // Single ayah mode: check if user recited consecutively beyond the single ayah
            targetAyahs = getConsecutiveAyahsForSpokenWords(currentAyahNumber || 1, spokenWords.length);
        }

        if (!targetAyahs || !targetAyahs.length) {
            targetAyahs = getActiveTargetAyahs();
        }

        // Guaranteed safety fallback
        if (!targetAyahs || !targetAyahs.length) {
            let activeAyahText = currentTargetVerseText || "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ";
            let rawW = activeAyahText.split(/\s+/).filter(Boolean);
            targetAyahs = [{
                numberInSurah: currentAyahNumber || 1,
                text: activeAyahText,
                rawWords: rawW,
                normWords: rawW.map(normalizeArabicText)
            }];
        }

        // Boundary Safety Net: recover any opening ayah words that got clipped during breath pauses
        if (targetAyahs && targetAyahs.length > 1) {
            transcribedText = ensureAllAyahBoundariesIntact(transcribedText, targetAyahs);
            liveTranscript = transcribedText;
            accumulatedSpeechText = transcribedText;
        }

        // 1. Render Evaluation Results immediately (diff chips, banner, clouds)
        renderRecitationResults(targetAyahs, transcribedText);

        // 2. Update status bar immediately with the golden result button
        const accuracy = Math.round(lastAccuracy || 95);
        if (playerStatusMain) {
            playerStatusMain.innerHTML = `
                <div class="eval-status-display-row" style="display:inline-flex; align-items:center; gap:12px; flex-wrap:wrap; justify-content:center;">
                    <span style="color:var(--gold,#c5a859); font-weight:800; font-size:15.5px; display:inline-flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-award"></i> <span>نسبة الإتقان: ${accuracy}%</span>
                    </span>
                    <button type="button" class="btn-open-result-pill" id="btn-reopen-eval" style="background:transparent; border:none; color:var(--gold-light,#f5df9a); cursor:pointer; font-weight:700; font-size:13px; padding:2px 4px; display:inline-flex; align-items:center; gap:5px; text-decoration:underline; text-underline-offset:3px;">
                        <span>تقرير تفصيلي</span> <i class="fa-solid fa-chevron-left" style="font-size:10px;"></i>
                    </button>
                </div>
            `;
            const btnReopen = document.getElementById('btn-reopen-eval');
            if (btnReopen && evaluationModalBackdrop) {
                btnReopen.onclick = () => evaluationModalBackdrop.classList.add('active');
            }
        }
        if (playerStatusSub) {
            playerStatusSub.textContent = 'تم تدقيق التلاوة بنجاح وتحديد الكلمات الصحيحة والأخطاء وتصحيحها ✓';
        }
        if (speechFeedbackLabel) {
            speechFeedbackLabel.textContent = `✓ تم التدقيق بنجاح: نسبة الإتقان ${accuracy}%`;
        }

        // 3. Make in-page evaluation banner visible and scroll to it smoothly
        if (recitationEvalBanner) {
            recitationEvalBanner.style.display = 'block';
            setTimeout(() => {
                recitationEvalBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 80);
        }

        // 4. Auto-open evaluation modal smoothly
        setTimeout(() => {
            if (evaluationModalBackdrop) {
                evaluationModalBackdrop.classList.add('active');
                const modalCard = document.getElementById('evaluation-modal-card');
                if (modalCard) modalCard.scrollTop = 0;
            }
        }, 500);

        showToast(`اكتمل تدقيق التلاوة! نسبة الإتقان: ${accuracy}% ✨`, 'fa-solid fa-award');

    } catch (err) {
        console.error("Immediate Evaluation Error:", err);
        if (playerStatusMain) {
            playerStatusMain.innerHTML = `<button type="button" class="btn-open-result-pill" onclick="resetStudioRecording()" style="background:#e74c3c; border:none; color:#fff; font-weight:700; padding:7px 18px; border-radius:20px; cursor:pointer; font-size:13px;"><i class="fa-solid fa-rotate-left"></i> حدث خطأ أثناء التدقيق - اضغط لإعادة المحاولة</button>`;
        }
        if (playerStatusSub) {
            playerStatusSub.textContent = `تفاصيل: ${err.message}`;
        }
        showToast(`تعذر إتمام التدقيق: ${err.message}`);
    }
}

async function processRecitationInference(audioBlob, whisperTranscript) {
    executeImmediateEvaluation(audioBlob, whisperTranscript);
}

async function callMakeWebhook(blob, url) {
    const formData = new FormData();
    formData.append('file', blob, 'recitation.webm');

    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        try {
            const res = await fetch(url, { method: 'POST', body: formData, signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                return data.text || data.transcription || "";
            }
            if (res.status === 503 && attempt < maxRetries) {
                // Hugging Face cold start — wait and retry
                console.log("Whisper model loading (503), retrying in 5s...");
                await new Promise(r => setTimeout(r, 5000));
                continue;
            }
            throw new Error(`Webhook Error: ${res.status}`);
        } catch (fetchErr) {
            clearTimeout(timeoutId);
            if (fetchErr.name === 'AbortError') throw new Error('Webhook timeout (30s)');
            throw fetchErr;
        }
    }
    return "";
}

async function callPythonService(blob, url) {
    if (!url || !url.trim()) return "";
    const cleanUrl = url.trim();

    // Guard: Prevent HTTPS Mixed Content blocks on Vercel
    if (window.location.protocol === 'https:' && cleanUrl.includes('localhost')) {
        console.log("Skipping HTTP localhost Python service on HTTPS deployment.");
        return "";
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
        const formData = new FormData();
        formData.append('file', blob, 'recitation.webm');
        const headers = {};
        if (hfApiToken) headers['Authorization'] = `Bearer ${hfApiToken.trim()}`;
        const res = await fetch(`${cleanUrl}/api/transcribe-recitation`, {
            method: 'POST',
            body: formData,
            headers,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`Python Service Error: ${res.status}`);
        const data = await res.json();
        if (data.success && data.transcription) {
            return data.transcription;
        }
        return data.text || "";
    } catch (e) {
        clearTimeout(timeoutId);
        console.warn("Python service notice:", e.message);
        return "";
    }
}

async function callHuggingFaceRouter(blob, token) {
    if (!token || !token.trim()) return "";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    try {
        const res = await fetch("https://router.huggingface.co/hf-inference/models/tarteel-ai/whisper-base-ar-quran", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token.trim()}`,
                "Content-Type": blob.type || "audio/webm",
                "x-wait-for-model": "true"
            },
            body: blob,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data[0]?.text) return data[0].text;
            if (data?.text) return data.text;
        }
    } catch (e) {
        clearTimeout(timeoutId);
        console.warn("Direct Hugging Face call note:", e.message);
    }
    return "";
}

async function transcribeWithWhisper(audioBlob) {
    // 1. Try Direct Hugging Face Router if token is configured
    if (hfApiToken && hfApiToken.trim()) {
        try {
            const text = await callHuggingFaceRouter(audioBlob, hfApiToken.trim());
            if (text && text.trim().length > 0) {
                console.log("Whisper transcription via Hugging Face Router:", text.trim());
                return text.trim();
            }
        } catch (e) {}
    }

    // 2. Try Make.com webhook if configured
    if (makeWebhookUrl && makeWebhookUrl.trim()) {
        try {
            const text = await callMakeWebhook(audioBlob, makeWebhookUrl.trim());
            if (text && text.trim().length > 0) {
                console.log("Whisper transcription via Make.com:", text.trim());
                return text.trim();
            }
        } catch (e) {
            console.warn("Make.com webhook failed:", e.message);
        }
    }

    // 3. Try Python service (if reachable)
    if (pythonServiceUrl && pythonServiceUrl.trim()) {
        try {
            const text = await callPythonService(audioBlob, pythonServiceUrl.trim());
            if (text && text.trim().length > 0) {
                console.log("Whisper transcription via Python service:", text.trim());
                return text.trim();
            }
        } catch (e) {
            console.warn("Python service failed:", e.message);
        }
    }

    // No Whisper service available — fall back gracefully to Web Speech API transcript
    return null;
}

function renderRecitationResults(targetAyahs, transcribedText) {
    if (!targetAyahs || !targetAyahs.length) {
        let activeAyahText = currentTargetVerseText || "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ";
        let rawW = activeAyahText.split(/\s+/).filter(Boolean);
        targetAyahs = [{
            numberInSurah: currentAyahNumber || 1,
            text: activeAyahText,
            rawWords: rawW,
            normWords: rawW.map(normalizeArabicText)
        }];
    }

    const rawSpoken = transcribedText.split(/\s+/).filter(Boolean);
    let spokenWords = preprocessSpokenWords(rawSpoken);

    // Filter out opening Isti'adhah, Basmalah (when not part of target verse), and closing Tasdiq
    spokenWords = stripExtraneousRecitationWords(spokenWords, targetAyahs);

    // Build complete expected words list across all target Ayahs
    const expectedWordsList = [];
    targetAyahs.forEach(ayah => {
        (ayah.rawWords || []).forEach((w, wIdx) => {
            expectedWordsList.push({
                raw: w,
                ayahNum: ayah.numberInSurah,
                wordIdx: wIdx
            });
        });
    });

    const totalExpected = expectedWordsList.length;
    let totalCorrect = 0;
    let totalMismatches = 0;
    let totalMissing = 0;
    const evaluatedSpokenWords = spokenWords;

    const allWordChips = [];

    // Run dynamic sequence alignment
    const alignment = alignRecitation(expectedWordsList, evaluatedSpokenWords);

    let evaluatedParchmentHtml = '';
    let bannerGridHtml = '';
    let lastAyahNum = expectedWordsList[0]?.ayahNum || 1;
    let hasSpokenForThisAyah = false;

    // Reset Mushaf word elements
    targetAyahs.forEach(ayah => {
        (ayah.rawWords || []).forEach((_, wIdx) => {
            const wordEl = document.getElementById(`word-${ayah.numberInSurah}-${wIdx}`);
            if (wordEl) {
                wordEl.classList.remove('spoken-match', 'spoken-slip', 'spoken-active');
            }
        });
    });

    alignment.forEach(item => {
        if (item.type === 'match') {
            totalCorrect++;
            const aNum = item.expectedObj.ayahNum;
            const wIdx = item.expectedObj.wordIdx;

            if (aNum !== lastAyahNum && hasSpokenForThisAyah) {
                evaluatedParchmentHtml += `<span class="inscribed-verse-circle">${toArabicEasternDigits(lastAyahNum)}</span> `;
                lastAyahNum = aNum;
                hasSpokenForThisAyah = false;
            }

            const wordEl = document.getElementById(`word-${aNum}-${wIdx}`);
            if (wordEl) wordEl.className = 'quran-word spoken-match';

            allWordChips.push({ status: 'match', original: item.expectedObj.raw, recited: item.spoken });
            evaluatedParchmentHtml += `<span class="inscribed-word word-eval-correct" title="نطق صحيح ✓">${escapeHTML(item.expectedObj.raw)} <span class="eval-tag tag-correct"><i class="fa-solid fa-check"></i></span></span> `;
            hasSpokenForThisAyah = true;

            bannerGridHtml += `
                <div class="eval-diff-chip chip-correct" title="نطق صحيح ✓">
                    <div class="chip-word-row">
                        <span>${escapeHTML(item.expectedObj.raw)}</span>
                        <span class="chip-badge"><i class="fa-solid fa-check"></i></span>
                    </div>
                </div>
            `;

        } else if (item.type === 'mismatch') {
            totalMismatches++;
            const aNum = item.expectedObj.ayahNum;
            const wIdx = item.expectedObj.wordIdx;

            if (aNum !== lastAyahNum && hasSpokenForThisAyah) {
                evaluatedParchmentHtml += `<span class="inscribed-verse-circle">${toArabicEasternDigits(lastAyahNum)}</span> `;
                lastAyahNum = aNum;
                hasSpokenForThisAyah = false;
            }

            const wordEl = document.getElementById(`word-${aNum}-${wIdx}`);
            if (wordEl) {
                wordEl.className = 'quran-word spoken-slip';
                wordEl.title = `المتوقع: ${item.expectedObj.raw} | نطقت: ${item.spoken}`;
            }

            allWordChips.push({ status: 'mismatch', original: item.expectedObj.raw, recited: item.spoken });
            evaluatedParchmentHtml += `<span class="inscribed-word word-eval-slip" title="المتوقع: ${escapeHTML(item.expectedObj.raw)} | نطقت: ${escapeHTML(item.spoken)}">${escapeHTML(item.spoken)} <span class="eval-tag tag-slip"><i class="fa-solid fa-xmark"></i></span></span> `;
            hasSpokenForThisAyah = true;

            bannerGridHtml += `
                <div class="eval-diff-chip chip-mismatch" title="خطأ: نطقت ${escapeHTML(item.spoken)} بدلاً من ${escapeHTML(item.expectedObj.raw)}">
                    <div class="chip-wrong-row">
                        <span class="chip-wrong-text"><del>${escapeHTML(item.spoken)}</del></span>
                        <span class="chip-badge-cross"><i class="fa-solid fa-xmark"></i></span>
                    </div>
                    <div class="chip-correction-box">
                        <i class="fa-solid fa-arrow-left"></i> الصواب: <strong>${escapeHTML(item.expectedObj.raw)}</strong>
                    </div>
                </div>
            `;

        } else if (item.type === 'missing') {
            totalMissing++;
            const aNum = item.expectedObj.ayahNum;
            const wIdx = item.expectedObj.wordIdx;
            const wordEl = document.getElementById(`word-${aNum}-${wIdx}`);
            if (wordEl) {
                wordEl.classList.remove('spoken-match', 'spoken-active');
            }
            allWordChips.push({ status: 'missing', original: item.expectedObj.raw, recited: null });
            evaluatedParchmentHtml += `<span class="inscribed-word word-eval-missing" title="كلمة منسية لم تُسمع: ${escapeHTML(item.expectedObj.raw)}"><del>${escapeHTML(item.expectedObj.raw)}</del> <span class="eval-tag tag-missing"><i class="fa-solid fa-minus"></i></span></span> `;
            hasSpokenForThisAyah = true;

            bannerGridHtml += `
                <div class="eval-diff-chip chip-missing" title="كلمة منسية: ${escapeHTML(item.expectedObj.raw)}">
                    <div class="chip-miss-row">
                        <span><del>${escapeHTML(item.expectedObj.raw)}</del></span>
                        <span class="chip-badge-cross" style="background:#f39c12;"><i class="fa-solid fa-minus"></i></span>
                    </div>
                    <span class="chip-miss-label">كلمة منسية</span>
                </div>
            `;

        } else if (item.type === 'extra') {
            allWordChips.push({ status: 'extra', original: null, recited: item.spoken });
            evaluatedParchmentHtml += `<span class="inscribed-word word-eval-slip" title="كلمة زائدة">${escapeHTML(item.spoken)} <span class="eval-tag tag-slip"><i class="fa-solid fa-plus"></i></span></span> `;
            hasSpokenForThisAyah = true;

            bannerGridHtml += `
                <div class="eval-diff-chip chip-mismatch" title="كلمة زائدة غير موجودة بالآية">
                    <div class="chip-wrong-row">
                        <span class="chip-wrong-text">${escapeHTML(item.spoken)}</span>
                        <span class="chip-badge-cross"><i class="fa-solid fa-plus"></i></span>
                    </div>
                    <div class="chip-correction-box" style="color:#f39c12;">
                        <span>كلمة زائدة</span>
                    </div>
                </div>
            `;
        }
    });

    // Append verse number circle for the last completed Ayah
    if (hasSpokenForThisAyah) {
        evaluatedParchmentHtml += `<span class="inscribed-verse-circle">${toArabicEasternDigits(lastAyahNum)}</span> `;
    }

    // In Memorization Mode: Inscribe the evaluated Quran text onto parchment
    if (studioDisplayMode === 'memorize' && memorizeLiveWords) {
        memorizeLiveWords.innerHTML = evaluatedParchmentHtml;
        if (memorizeCanvasHint) memorizeCanvasHint.classList.add('has-words');
    }

    // In-Page Evaluation Banner (Visible in BOTH Recite & Memorize Modes!)
    if (evalBannerWordsGrid) evalBannerWordsGrid.innerHTML = bannerGridHtml;

    // Display recited transcript in banner (Revealed after finishing recitation)
    if (evalBannerTranscript && ebTranscriptText) {
        ebTranscriptText.textContent = transcribedText;
        evalBannerTranscript.style.display = 'flex';
    }

    // Configure user recitation audio playback if audio blob was captured
    if (recordedAudioBlob && recordedAudioBlob.size > 0) {
        try {
            const audioUrl = URL.createObjectURL(recordedAudioBlob);
            if (userRecitationAudio) userRecitationAudio.src = audioUrl;
            if (userModalRecitationAudio) userModalRecitationAudio.src = audioUrl;

            const isMp4 = recordedAudioBlob.type && recordedAudioBlob.type.includes('mp4');
            const ext = isMp4 ? 'mp4' : 'webm';
            const dlName = `recitation_surah_${currentSurahNumber || 1}_ayah_${currentAyahNumber || 1}.${ext}`;

            if (btnDownloadUserAudio) {
                btnDownloadUserAudio.href = audioUrl;
                btnDownloadUserAudio.download = dlName;
            }
            if (btnDownloadModalAudio) {
                btnDownloadModalAudio.href = audioUrl;
                btnDownloadModalAudio.download = dlName;
            }
            if (userRecitationPlayerBox) userRecitationPlayerBox.style.display = 'block';
            if (userModalPlayerBox) userModalPlayerBox.style.display = 'block';
        } catch (e) {
            console.warn("User audio playback init notice:", e);
        }
    } else {
        if (userRecitationPlayerBox) userRecitationPlayerBox.style.display = 'none';
        if (userModalPlayerBox) userModalPlayerBox.style.display = 'none';
    }

    const totalWordsEvaluated = Math.max(totalExpected, totalCorrect + totalMismatches + totalMissing, 1);
    const accuracy = Math.max(0, Math.round((totalCorrect / totalWordsEvaluated) * 100));
    lastAccuracy = accuracy;

    if (evalBannerScoreText) evalBannerScoreText.textContent = `نسبة الإتقان: ${accuracy}%`;
    if (ebCorrectCount) ebCorrectCount.textContent = totalCorrect;
    if (ebErrorsCount) ebErrorsCount.textContent = totalMismatches;
    if (ebMissingCount) ebMissingCount.textContent = totalMissing;

    if (recitationEvalBanner) {
        recitationEvalBanner.style.display = 'block';
    }

    if (scoreNumber) scoreNumber.textContent = `${accuracy}%`;
    if (countCorrect) countCorrect.textContent = totalCorrect;
    if (countErrors) countErrors.textContent = totalMismatches;
    if (countMissing) countMissing.textContent = totalMissing;

    if (scoreEvaluationTitle) {
        if (accuracy >= 90) {
            scoreEvaluationTitle.textContent = "ما شاء الله! تلاوة ممتازة ومتقنة جداً";
            scoreEvaluationTitle.style.color = "var(--success-green)";
        } else if (accuracy >= 75) {
            scoreEvaluationTitle.textContent = "تلاوة طيبة، راجع الكلمات المحددة باللون الأحمر";
            scoreEvaluationTitle.style.color = "var(--gold)";
        } else {
            scoreEvaluationTitle.textContent = "توجد أخطاء تم رصدها وتحديد صوابها - استمع وتدرب مجدداً 🔄";
            scoreEvaluationTitle.style.color = "var(--warn-orange)";
        }
    }

    if (wordsAlignmentCloud) {
        wordsAlignmentCloud.innerHTML = '';
        allWordChips.forEach(item => {
            const chip = document.createElement('div');
            chip.className = `word-chip ${item.status}`;

            if (item.status === 'match') {
                chip.innerHTML = `<span>${escapeHTML(item.original)}</span> <i class="fa-solid fa-check" style="color:#2ecc71; margin-right:4px;"></i>`;
            } else if (item.status === 'mismatch') {
                chip.innerHTML = `<span style="text-decoration:underline wavy #e74c3c 1.5px;">${escapeHTML(item.recited)}</span> <i class="fa-solid fa-xmark" style="color:#e74c3c; margin-right:4px;"></i> <small style="color:#2ecc71; font-size:12px; margin-right:6px; font-weight:700;">(الصواب: ${escapeHTML(item.original)})</small>`;
            } else if (item.status === 'missing') {
                chip.innerHTML = `<del>${escapeHTML(item.original)}</del> <i class="fa-solid fa-minus" style="color:#f39c12; margin-right:4px;"></i> <small style="color:#f39c12; font-size:11px;">(منسية)</small>`;
            } else if (item.status === 'extra') {
                chip.innerHTML = `<span>${escapeHTML(item.recited)}</span> <i class="fa-solid fa-plus" style="color:#e74c3c; margin-right:4px;"></i> <small style="color:#ff7675; font-size:11px;">(زائدة)</small>`;
            }
            wordsAlignmentCloud.appendChild(chip);
        });
    }

    if (transcriptionTextDisplay) transcriptionTextDisplay.textContent = transcribedText;
    if (evaluationModalBackdrop) {
        evaluationModalBackdrop.classList.add('active');
        const modalCard = document.getElementById('evaluation-modal-card');
        if (modalCard) modalCard.scrollTop = 0;
    }
}

// -----------------------------------------------------------------------------
// 13. Event Listeners & Modals
// -----------------------------------------------------------------------------
function initEventListeners() {
    // Mode Switcher Buttons (وضع التلاوة vs وضع التسميع)
    if (btnModeRecite) {
        btnModeRecite.addEventListener('click', () => setStudioMode('recite'));
    }
    if (btnModeMemorize) {
        btnModeMemorize.addEventListener('click', () => setStudioMode('memorize'));
    }

    // Reveal Verse Button in Memorize Mode
    if (btnRevealVerse) {
        btnRevealVerse.addEventListener('click', toggleRevealVerse);
    }

    // "عرض المصحف" Button: switch to recite mode and scroll smoothly to Mushaf
    if (btnShowMushaf && mushafOpenBook) {
        btnShowMushaf.addEventListener('click', () => {
            if (!currentSurahNumber) {
                showToast('يرجى اختيار السورة أولاً لعرض المصحف');
                openSurahFlyout();
                return;
            }
            setStudioMode('recite');
            mushafOpenBook.scrollIntoView({ behavior: 'smooth', block: 'center' });
            showToast('تم عرض المصحف الشريف');
        });
    }

    // Exemplary Reciter Audio: Dedicated to Sheikh Mishary's recitation
    if (btnQuickListen) {
        btnQuickListen.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleExemplaryAudio();
        });
    }
    if (cardListenExemplary) cardListenExemplary.addEventListener('click', toggleExemplaryAudio);
    if (btnPlayExemplary) {
        btnPlayExemplary.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleExemplaryAudio();
        });
    }

    // Dedicated Recording Controls: Bottom Bar and Sidebar Tool
    const toggleRecording = () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecordingAndAnalyze();
        }
    };

    if (barBtnRecord) barBtnRecord.addEventListener('click', toggleRecording);
    if (cardReciteVoice) cardReciteVoice.addEventListener('click', toggleRecording);
    if (btnMainRecord) {
        btnMainRecord.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleRecording();
        });
    }

    // Evaluation Modal Actions
    if (btnCloseEvaluation && evaluationModalBackdrop) {
        btnCloseEvaluation.addEventListener('click', () => {
            evaluationModalBackdrop.classList.remove('active');
        });
    }

    if (btnEvalRetry && evaluationModalBackdrop) {
        btnEvalRetry.addEventListener('click', () => {
            evaluationModalBackdrop.classList.remove('active');
            resetStudioRecording();
        });
    }

    if (btnEvalNext && evaluationModalBackdrop) {
        btnEvalNext.addEventListener('click', () => {
            evaluationModalBackdrop.classList.remove('active');
            goToAyah(currentAyahNumber + 1);
        });
    }

    // In-Page Evaluation Banner "التقرير المفصل"
    if (btnBannerOpenModal && evaluationModalBackdrop) {
        btnBannerOpenModal.addEventListener('click', () => {
            evaluationModalBackdrop.classList.add('active');
        });
    }

    // Settings Modal
    if (btnOpenSettings && settingsModal) {
        btnOpenSettings.addEventListener('click', () => settingsModal.classList.add('active'));
    }
    if (btnCloseSettings && settingsModal) {
        btnCloseSettings.addEventListener('click', () => settingsModal.classList.remove('active'));
    }
    if (btnSaveSettings) {
        btnSaveSettings.addEventListener('click', saveSettingsValues);
    }
}

function initSettingsModal() {
    if (inputEngineMode) inputEngineMode.value = aiEngineMode;
    if (inputMakeWebhook) inputMakeWebhook.value = makeWebhookUrl;
    if (inputPythonUrl) inputPythonUrl.value = pythonServiceUrl;
    if (inputHfToken) inputHfToken.value = hfApiToken;
}

function saveSettingsValues() {
    if (inputEngineMode) aiEngineMode = inputEngineMode.value;
    if (inputMakeWebhook) makeWebhookUrl = inputMakeWebhook.value.trim();
    if (inputPythonUrl) pythonServiceUrl = inputPythonUrl.value.trim();
    if (inputHfToken) hfApiToken = inputHfToken.value.trim();

    localStorage.setItem("recite_engine_mode", aiEngineMode);
    localStorage.setItem("recite_make_webhook", makeWebhookUrl);
    localStorage.setItem("recite_python_url", pythonServiceUrl);
    localStorage.setItem("recite_hf_token", hfApiToken);

    if (settingsModal) settingsModal.classList.remove('active');
    showToast('تم حفظ إعدادات الذكاء الاصطناعي بنجاح!');
}
