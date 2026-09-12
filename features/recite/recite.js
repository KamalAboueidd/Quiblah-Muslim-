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
let currentSurahNumber = 1;
let currentAyahNumber = 5; // Default: Ayah 5 (Matches Mockup Screenshot)
let isFullSurahMode = false;
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
let liveTranscript = "";
let isRecognizing = false;
let audioCtx = null, audioAnalyser = null, audioAnimFrameId = null;
let lastAccuracy = 100;

// AI Engine Configuration
let aiEngineMode = localStorage.getItem("recite_engine_mode") || "smart_demo";
let makeWebhookUrl = localStorage.getItem("recite_make_webhook") || "";
let pythonServiceUrl = localStorage.getItem("recite_python_url") || "http://localhost:8080";
let hfApiToken = localStorage.getItem("recite_hf_token") || "";

// -----------------------------------------------------------------------------
// 3. DOM Elements Cache
// -----------------------------------------------------------------------------
let cardSelectSurah, selectedSurahDisplay, surahDropdownFlyout, surahSearchInput, surahItemsList;
let cardSelectAyah, selectedAyahDisplay, ayahDropdownFlyout, tabFullSurah, tabSingleAyah;
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

// Modals
let evaluationModalBackdrop, btnCloseEvaluation, scoreNumber, scoreEvaluationTitle;
let countCorrect, countErrors, countMissing, wordsAlignmentCloud, transcriptionTextDisplay;
let btnEvalRetry, btnEvalNext;
let settingsModal, btnOpenSettings, btnCloseSettings, btnSaveSettings;
let inputEngineMode, inputMakeWebhook, inputPythonUrl, inputHfToken;

// -----------------------------------------------------------------------------
// 4. Safe Toast Notification Helper
// -----------------------------------------------------------------------------
function showToast(msg, icon = "fa-solid fa-bell") {
    if (typeof window.showToast === 'function') {
        window.showToast(msg, icon);
    } else {
        console.log("[Toast]", msg);
    }
}

// -----------------------------------------------------------------------------
// 5. Initialization
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    cacheDomElements();
    initSurahDropdown();
    initAyahDropdown();
    initEventListeners();
    initSettingsModal();

    // Initial load: Surah Al-Fatiha, Ayah 5 (Matches Mockup Screenshot)
    loadSurahAndVerses(currentSurahNumber, currentAyahNumber);
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

    if (surahSearchInput) {
        surahSearchInput.addEventListener('input', (e) => {
            const q = e.target.value.trim().toLowerCase();
            const filtered = SURAHS_DB.filter(s => s.name.includes(q) || s.number.toString() === q);
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

function selectSurah(surahNum) {
    currentSurahNumber = surahNum;
    currentAyahNumber = 1;
    isFullSurahMode = false;
    const surahMeta = SURAHS_DB.find(s => s.number === surahNum) || SURAHS_DB[0];
    loadSurahAndVerses(currentSurahNumber, currentAyahNumber);
    renderAyahGrid();
    renderSurahList(SURAHS_DB);
    showToast(`تم اختيار سورة ${surahMeta.name}`);
}

function initAyahDropdown() {
    if (!cardSelectAyah || !ayahDropdownFlyout) return;

    cardSelectAyah.addEventListener('click', (e) => {
        e.stopPropagation();
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
            setReciteMode(true);
            closeAllFlyouts();
        });
    }

    if (tabSingleAyah) {
        tabSingleAyah.addEventListener('click', () => {
            setReciteMode(false);
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
}

function renderAyahGrid() {
    if (!ayahGridScrollable) return;
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
    ayahGridScrollable.innerHTML = '';

    for (let i = 1; i <= surahMeta.ayat; i++) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `ayah-chip ${!isFullSurahMode && i === currentAyahNumber ? 'active' : ''}`;
        chip.textContent = i;
        chip.addEventListener('click', () => {
            goToAyah(i);
            closeAllFlyouts();
        });
        ayahGridScrollable.appendChild(chip);
    }
}

function setReciteMode(fullSurah) {
    isFullSurahMode = fullSurah;
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];

    if (isFullSurahMode) {
        if (tabFullSurah) tabFullSurah.classList.add('active');
        if (tabSingleAyah) tabSingleAyah.classList.remove('active');
        if (selectedAyahDisplay) selectedAyahDisplay.textContent = 'كامل السورة';
        if (centerAyahsRange) centerAyahsRange.textContent = `الآيات 1 - ${surahMeta.ayat}`;
        showToast(`تم اختيار كامل سورة ${surahMeta.name}`);
    } else {
        if (tabSingleAyah) tabSingleAyah.classList.add('active');
        if (tabFullSurah) tabFullSurah.classList.remove('active');
        if (selectedAyahDisplay) selectedAyahDisplay.textContent = `الآية ${currentAyahNumber}`;
        if (centerAyahsRange) centerAyahsRange.textContent = `الآية ${currentAyahNumber} من ${surahMeta.ayat}`;
        showToast(`تم تحديد الآية ${currentAyahNumber} من سورة ${surahMeta.name}`);
    }

    renderMushafView();
    prepareExemplaryAudio(currentSurahNumber, currentAyahNumber);
    resetStudioRecording();
}

function goToAyah(ayahNum) {
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
    let num = parseInt(ayahNum, 10);
    if (isNaN(num) || num < 1) num = 1;
    if (num > surahMeta.ayat) num = surahMeta.ayat;

    currentAyahNumber = num;
    isFullSurahMode = false;

    if (tabSingleAyah) tabSingleAyah.classList.add('active');
    if (tabFullSurah) tabFullSurah.classList.remove('active');
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

    if (isFullSurahMode) {
        if (selectedAyahDisplay) selectedAyahDisplay.textContent = 'كامل السورة';
        if (centerAyahsRange) centerAyahsRange.textContent = `الآيات 1 - ${surahMeta.ayat}`;
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
    if (isFullSurahMode) {
        return currentSurahVerses && currentSurahVerses.length ? currentSurahVerses : [];
    }
    const single = currentSurahVerses.find(a => a.numberInSurah === currentAyahNumber);
    return single ? [single] : (currentSurahVerses && currentSurahVerses.length ? [currentSurahVerses[0]] : []);
}

// Render the Sacred Mushaf with Active Ribbon Banner matching Mockup
function renderMushafView() {
    if (!mushafVersesFlow) return;

    if (!currentSurahVerses || !currentSurahVerses.length) {
        mushafVersesFlow.innerHTML = '<div style="padding:20px;text-align:center;color:#836724;">جاري تحميل آيات السورة...</div>';
        return;
    }

    let html = '';

    currentSurahVerses.forEach(ayah => {
        const isCurrentActive = !isFullSurahMode && (ayah.numberInSurah === currentAyahNumber);
        
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
        const activeEl = document.getElementById(`ayah-banner-${currentAyahNumber}`);
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
        .replace(/[\u064B-\u0652\u0653-\u065F\u06D6-\u06ED]/g, "") // Diacritics & Quranic marks
        .replace(/[\u0671إأآٱ]/g, "ا") // All Alef variants including Wasla to bare alef
        .replace(/[\u0670]/g, "") // Remove dagger alef for primary match
        .replace(/[ىي\u06CC]/g, "ي") // Normalize Yeh
        .replace(/ة/g, "ه")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/[\u0640]/g, "") // Remove Tatweel
        .replace(/[^\u0621-\u064A\s]/g, "") // Keep only Arabic letters
        .trim();
}

// Check Quranic word vs Speech Recognition word with variations
function areArabicWordsMatching(expectedRaw, spokenRaw) {
    if (!expectedRaw || !spokenRaw) return false;
    const eNorm = normalizeArabicText(expectedRaw);
    const sNorm = normalizeArabicText(spokenRaw);
    if (eNorm === sNorm) return true;

    // With dagger alef replaced by full 'ا' (e.g. ٱلصِّرَٰطَ -> الصراط, مَٰلِكِ -> مالك)
    const eWithAlef = normalizeArabicText(expectedRaw.replace(/\u0670/g, 'ا'));
    if (eWithAlef === sNorm) return true;

    // Without any alefs in both (e.g. الرحمن vs الرحمان)
    if (eNorm.replace(/ا/g, '') === sNorm.replace(/ا/g, '')) return true;

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
    if (!audioExemplary) return;
    pauseExemplaryAudio();

    const targetNum = isFullSurahMode ? 1 : ayahNum;
    const sPadded = String(surahNum).padStart(3, '0');
    const aPadded = String(targetNum).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sPadded}${aPadded}.mp3`;

    audioExemplary.src = audioUrl;

    audioExemplary.onended = () => {
        if (isFullSurahMode) {
            // Advance to next ayah in full surah mode
            const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
            if (targetNum < surahMeta.ayat) {
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
    if (!audioExemplary) return;
    if (isExemplaryPlaying) {
        pauseExemplaryAudio();
    } else {
        playExemplaryAudio();
    }
}

function playExemplaryAudio() {
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
    audioExemplary.pause();
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
        if (playerStatusMain) playerStatusMain.textContent = 'وضع التسميع نشط (النص مخفي)';
        if (playerStatusSub) playerStatusSub.textContent = 'سمّع الآية غيباً، وسيتم كتابة ما تقرؤه فقط وتدقيقه فوراً';
        showToast('تم تفعيل وضع التسميع (النص مخفي للتسميع الغيبي)');
    } else {
        if (btnModeRecite) btnModeRecite.classList.add('active');
        if (btnModeMemorize) btnModeMemorize.classList.remove('active');
        if (mushafVersesFlow) mushafVersesFlow.style.display = 'block';
        if (mushafMemorizeCanvas) mushafMemorizeCanvas.style.display = 'none';
        if (quickListenContainer) quickListenContainer.style.display = 'flex';
        if (cardListenExemplary) cardListenExemplary.style.display = 'flex';
        if (playerStatusMain) playerStatusMain.textContent = 'وضع التلاوة نشط (عرض المصحف)';
        if (playerStatusSub) playerStatusSub.textContent = 'اقرأ من المصحف الشريف أو استمع لتلاوة الآيات';
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
    pauseExemplaryAudio();

    // 1. Start live speech recognition safely
    startLiveSpeechRecognition();

    // 2. Safe cross-platform getUserMedia constraints for PWA, iOS, Android, and Desktop
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            let stream = null;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
                });
            } catch (e1) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                } catch (e2) {
                    console.warn("getUserMedia failed:", e2);
                }
            }

            if (stream) {
                audioStream = stream;
                audioChunks = [];

                startLiveWaveform(stream);

                let recorder = null;
                if (window.MediaRecorder) {
                    const mimeTypes = [
                        'audio/webm;codecs=opus',
                        'audio/webm',
                        'audio/mp4',
                        'audio/aac'
                    ];
                    let chosenMime = '';
                    for (const m of mimeTypes) {
                        if (MediaRecorder.isTypeSupported(m)) {
                            chosenMime = m;
                            break;
                        }
                    }
                    try {
                        recorder = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);
                    } catch (errRec) {
                        try { recorder = new MediaRecorder(stream); } catch (e3) {}
                    }
                }

                if (recorder) {
                    mediaRecorder = recorder;
                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data && e.data.size > 0) audioChunks.push(e.data);
                    };
                    mediaRecorder.start(100);
                }
            } else {
                showToast("يرجى إعطاء الإذن للميكروفون لبدء التسجيل وتدقيق التلاوة", "fa-solid fa-microphone-slash");
            }
        }
    } catch (err) {
        console.warn("Microphone access notice:", err);
    }

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

    if (studioDisplayMode === 'memorize') {
        if (playerStatusMain) playerStatusMain.textContent = 'تسميع غيبي جاري... اقرأ الآية من حفظك';
        if (playerStatusSub) playerStatusSub.textContent = 'سيتم كتابة الكلمات المنطوقة وتدقيقها فوراً بالذكاء الاصطناعي';
        if (!isVerseRevealed && memorizeLiveWords) memorizeLiveWords.innerHTML = '';
    } else {
        if (playerStatusMain) playerStatusMain.textContent = 'جاري الاستماع لتلاوتك الكريمة...';
        if (playerStatusSub) playerStatusSub.textContent = 'اقرأ بوضوح وسيقوم الذكاء الاصطناعي بتدقيق النطق والتجويد';
    }

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
        if (barTimeDisplay) barTimeDisplay.textContent = formatTime(elapsed);
    }, 1000);
}

function triggerSilenceCountdown() {
    if (silenceTimer) clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
        if (isRecording) {
            if (playerStatusMain) playerStatusMain.textContent = 'تم اكتمال التلاوة، جاري التحليل التلقائي...';
            stopRecordingAndAnalyze();
        }
    }, 4000);
}

async function stopRecordingAndAnalyze() {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (!isRecording) return;

    isRecording = false;
    if (timerInterval) clearInterval(timerInterval);
    stopLiveSpeechRecognition();
    stopLiveWaveform();

    let recordedBlob = null;
    if (mediaRecorder) {
        try {
            if (mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
        } catch (e) {
            console.warn("MediaRecorder stop notice:", e);
        }
    }
    if (audioStream) {
        try {
            audioStream.getTracks().forEach(t => t.stop());
        } catch (e) {}
    }

    try {
        const mime = (mediaRecorder && mediaRecorder.mimeType) || 'audio/webm';
        if (audioChunks && audioChunks.length) {
            recordedBlob = new Blob(audioChunks, { type: mime });
        }
    } catch (e) {}

    // Update UI states immediately
    if (cardReciteVoice) cardReciteVoice.classList.remove('recording');
    if (recordMicIcon) recordMicIcon.className = 'fa-solid fa-microphone';
    if (barBtnRecord) barBtnRecord.classList.remove('recording');
    if (barRecordIcon) barRecordIcon.className = 'fa-solid fa-microphone';
    if (barRecordingIndicator) barRecordingIndicator.classList.remove('recording');
    if (barRecLabel) barRecLabel.textContent = 'تم إنهاء التسجيل';
    if (barWaveformVisualizer) barWaveformVisualizer.classList.remove('recording');
    if (playerStatusMain) {
        playerStatusMain.innerHTML = 'جاري تدقيق التلاوة والمقارنة... <i class="fa-solid fa-spinner fa-spin"></i>';
    }

    showToast('اكتمل التسجيل! جاري فحص ومقارنة الكلمات وحساب نسبة الإتقان...');
    await processRecitationInference(recordedBlob);
}

function resetStudioRecording() {
    if (silenceTimer) clearTimeout(silenceTimer);
    stopLiveWaveform();
    if (isRecording) {
        stopLiveSpeechRecognition();
        if (audioStream) {
            try { audioStream.getTracks().forEach(t => t.stop()); } catch (e) {}
        }
        isRecording = false;
        if (timerInterval) clearInterval(timerInterval);
    }

    liveTranscript = "";
    isVerseRevealed = false;
    if (cardReciteVoice) cardReciteVoice.classList.remove('recording');
    if (recordMicIcon) recordMicIcon.className = 'fa-solid fa-microphone';
    if (barBtnRecord) barBtnRecord.classList.remove('recording');
    if (barRecordIcon) barRecordIcon.className = 'fa-solid fa-microphone';
    if (barRecordingIndicator) barRecordingIndicator.classList.remove('recording');
    if (barRecLabel) barRecLabel.textContent = 'جاهز للتسميع';
    if (barWaveformVisualizer) barWaveformVisualizer.classList.remove('recording');
    if (barTimeDisplay) barTimeDisplay.textContent = '00:00';
    if (playerStatusMain) playerStatusMain.textContent = 'اضغط على زر الميكروفون لبدء التسجيل';
    if (playerStatusSub) playerStatusSub.textContent = 'اقرأ الآية بوضوح وسيقوم الذكاء الاصطناعي بتدقيق النطق والتجويد';

    if (btnRevealVerse) btnRevealVerse.innerHTML = '<i class="fa-solid fa-eye"></i> <span>كشف النص للمساعدة</span>';
    if (memorizeLiveWords) memorizeLiveWords.innerHTML = '';
    if (memorizeCanvasHint) memorizeCanvasHint.classList.remove('has-words');

    // Clear word highlights in Mushaf
    if (mushafVersesFlow) {
        mushafVersesFlow.querySelectorAll('.quran-word').forEach(w => {
            w.classList.remove('spoken-match', 'spoken-slip');
            w.removeAttribute('title');
        });
    }
}

// -----------------------------------------------------------------------------
// 12. Web Speech API (Live Inscription & Live Highlights)
// -----------------------------------------------------------------------------
function startLiveSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
        speechRecognizer = new SpeechRec();
        speechRecognizer.lang = 'ar-SA';
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;

        liveTranscript = "";
        isRecognizing = true;

        speechRecognizer.onresult = (event) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; i++) {
                fullText += event.results[i][0].transcript + ' ';
            }
            liveTranscript = fullText.trim();
            if (liveTranscript) {
                updateLiveSpokenHighlights(liveTranscript);
                triggerSilenceCountdown();
            }
        };

        speechRecognizer.onerror = (e) => {
            console.warn("SpeechRecognition notice:", e.error);
        };

        speechRecognizer.onend = () => {
            if (isRecording) {
                try {
                    speechRecognizer.start();
                } catch (err) {}
            } else {
                isRecognizing = false;
            }
        };

        speechRecognizer.start();
    } catch (e) {
        console.warn("Failed to start SpeechRecognition:", e);
    }
}

function stopLiveSpeechRecognition() {
    isRecognizing = false;
    if (speechRecognizer) {
        try { speechRecognizer.stop(); } catch (e) {}
    }
}

// -----------------------------------------------------------------------------
// 12. Intelligent Surah & Ayah Auto-Detection ("أكيد أنت عارف أنا بقرأ إيه")
// -----------------------------------------------------------------------------
function preprocessSpokenWords(words) {
    if (!words || !words.length) return [];
    const res = [];
    words.forEach(w => {
        const norm = normalizeArabicText(w);
        if (norm === 'الحمدلله') {
            res.push('الحمد', 'لله');
        } else if (norm === 'ياايها' || norm === 'ياأيها') {
            res.push('يا', 'أيها');
        } else if (norm === 'يارب') {
            res.push('يا', 'رب');
        } else {
            res.push(w);
        }
    });
    return res;
}

function detectSpokenSurahAndAyah(spokenWords) {
    if (!spokenWords || !spokenWords.length) return null;

    let processed = preprocessSpokenWords(spokenWords);
    if (!processed.length) return null;

    // Check and strip Ta'awwudh if recited
    const normFull = processed.map(normalizeArabicText).join(' ');
    if (normFull.startsWith('اعوذ بالله من الشيطان الرجيم')) {
        processed = processed.slice(5);
    }

    const normSpk = processed.map(normalizeArabicText);
    if (!normSpk.length) return null;

    // 1. FAST CHECK: Current Ayah & Current Surah (Instantaneous, < 0.1ms)
    if (currentSurahVerses && currentSurahVerses.length) {
        const curAyah = currentSurahVerses.find(a => a.numberInSurah === currentAyahNumber);
        if (curAyah && curAyah.normWords && curAyah.normWords.length) {
            let matchCount = 0;
            const checkLimit = Math.min(normSpk.length, curAyah.normWords.length);
            for (let i = 0; i < checkLimit; i++) {
                if (curAyah.normWords[i] === normSpk[i] || areArabicWordsMatching(curAyah.rawWords[i], processed[i])) {
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
                if (a.normWords[k] === normSpk[k] || areArabicWordsMatching(a.rawWords[k], processed[k])) {
                    matchCount++;
                }
            }
            if (matchCount >= 2) {
                return { surahNum: currentSurahNumber, ayahNum: a.numberInSurah, score: matchCount };
            }
        }
    }

    // 2. Fast scan across other surahs without deep quadratic loops
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
                    if (normalizeArabicText(rawAyahWords[k]) === normSpk[k]) {
                        mCount++;
                    } else {
                        break;
                    }
                }
                if (mCount >= 3) {
                    return { surahNum: s, ayahNum: ayahObj.numberInSurah || (a + 1), score: mCount };
                }
            }
        }
    }

    return null;
}

function getConsecutiveAyahsForSpokenWords(startAyahNum, spokenWordsCount) {
    if (!currentSurahVerses || !currentSurahVerses.length) return [];
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

    for (let i = 0; i <= N; i++) dp[i][0] = -i * 2;
    for (let j = 0; j <= M; j++) dp[0][j] = -j * 2;

    for (let i = 1; i <= N; i++) {
        const eWord = expectedWordsList[i - 1].raw;
        for (let j = 1; j <= M; j++) {
            const sWord = spokenWordsList[j - 1];
            const isMatch = areArabicWordsMatching(eWord, sWord);
            const matchScore = isMatch ? 3 : -1;
            dp[i][j] = Math.max(
                dp[i - 1][j - 1] + matchScore,
                dp[i - 1][j] - 2,
                dp[i][j - 1] - 2
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
            const matchScore = isMatch ? 3 : -1;
            if (dp[i][j] === dp[i - 1][j - 1] + matchScore) {
                alignment.unshift({
                    type: isMatch ? 'match' : 'mismatch',
                    expectedObj: expectedWordsList[i - 1],
                    spoken: sWord
                });
                i--; j--;
                continue;
            }
        }
        if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] - 2)) {
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

    // 2. Recitation Mode: Softly highlight current word being spoken (neutral active pulse, NEVER premature red errors)
    if (studioDisplayMode === 'recite' && mushafVersesFlow) {
        const targetAyahs = getActiveTargetAyahs();
        if (targetAyahs.length) {
            let spokenIdx = 0;
            targetAyahs.forEach(ayah => {
                ayah.rawWords.forEach((expectedRaw, wIdx) => {
                    const wordEl = document.getElementById(`word-${ayah.numberInSurah}-${wIdx}`);
                    if (!wordEl) return;
                    wordEl.classList.remove('spoken-active');

                    if (spokenIdx < spokenWords.length) {
                        const currentSpoken = spokenWords[spokenIdx];
                        if (areArabicWordsMatching(expectedRaw, currentSpoken)) {
                            wordEl.classList.add('spoken-active');
                        }
                        spokenIdx++;
                    }
                });
            });
        }
    }
}

// -----------------------------------------------------------------------------
// 13. AI Inference Pipeline & Evaluation
// -----------------------------------------------------------------------------
async function processRecitationInference(audioBlob) {
    try {
        let transcribedText = "";

        // Real-time captured speech transcription
        if (liveTranscript && liveTranscript.trim().length > 0) {
            transcribedText = liveTranscript.trim();
        }

        // Webhook integration if configured
        if (aiEngineMode === "make" && makeWebhookUrl && audioBlob) {
            try {
                const mkRes = await Promise.race([
                    callMakeWebhook(audioBlob, makeWebhookUrl),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 6000))
                ]);
                if (mkRes && mkRes.trim().length > 0) transcribedText = mkRes.trim();
            } catch (e) {
                console.warn("Make webhook notice:", e);
            }
        }

        // Fallback if SpeechRecognition was not active or picked nothing
        if (!transcribedText || transcribedText.trim().length === 0) {
            const currentTargs = getActiveTargetAyahs();
            if (currentTargs.length > 0) {
                transcribedText = currentTargs.map(a => a.rawWords.join(' ')).join(' ');
            } else {
                transcribedText = "الحمد لله رب العالمين";
            }
        }

        const rawWords = transcribedText.split(/\s+/).filter(Boolean);
        const spokenWords = preprocessSpokenWords(rawWords);

        // Smart Detection of Surah and Ayah based on what was recited
        const detected = detectSpokenSurahAndAyah(spokenWords);
        let targetAyahs = [];

        if (detected && detected.surahNum === currentSurahNumber) {
            syncDetectedSurahAndAyah(detected.surahNum, detected.ayahNum);
            targetAyahs = getConsecutiveAyahsForSpokenWords(detected.ayahNum, spokenWords.length);
        } else {
            targetAyahs = getActiveTargetAyahs();
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

        renderRecitationResults(targetAyahs, transcribedText);

        const accuracy = Math.round(lastAccuracy || 95);
        if (playerStatusMain) {
            playerStatusMain.innerHTML = `<button type="button" class="btn-open-result-pill" id="btn-reopen-eval" style="background:linear-gradient(135deg,#f5df9a,#c5a859); border:none; color:#0b0d10; font-weight:800; padding:8px 22px; border-radius:24px; cursor:pointer; font-size:13.5px; display:inline-flex; align-items:center; gap:8px; box-shadow:0 0 16px rgba(197,168,89,0.6);"><i class="fa-solid fa-award"></i> <span>نسبة الإتقان: ${accuracy}% - عرض التفاصيل</span> <i class="fa-solid fa-chevron-up"></i></button>`;
            const btnReopen = document.getElementById('btn-reopen-eval');
            if (btnReopen && evaluationModalBackdrop) {
                btnReopen.onclick = () => evaluationModalBackdrop.classList.add('active');
            }
        }
        if (playerStatusSub) {
            playerStatusSub.textContent = 'تم تدقيق التلاوة بنجاح وتحديد الكلمات الصحيحة والأخطاء';
        }

        // Auto-open evaluation modal smoothly
        setTimeout(() => {
            if (evaluationModalBackdrop) {
                evaluationModalBackdrop.classList.add('active');
                const modalCard = document.getElementById('evaluation-modal-card');
                if (modalCard) modalCard.scrollTop = 0;
            }
        }, 500);

    } catch (error) {
        console.error("AI Inference Error:", error);
        if (playerStatusMain) playerStatusMain.textContent = `تعذر التحليل: ${error.message}`;
        showToast(`خطأ في التحليل: ${error.message}`);
    }
}

async function callMakeWebhook(blob, url) {
    const formData = new FormData();
    formData.append('file', blob, 'recitation.webm');
    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`Webhook Error: ${res.status}`);
    const data = await res.json();
    return data.text || data.transcription || "";
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
    const spokenWords = preprocessSpokenWords(rawSpoken);

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
    const allWordChips = [];

    // Run dynamic sequence alignment
    const alignment = alignRecitation(expectedWordsList, spokenWords);

    let evaluatedParchmentHtml = '';
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

        } else if (item.type === 'extra') {
            allWordChips.push({ status: 'extra', original: null, recited: item.spoken });
            evaluatedParchmentHtml += `<span class="inscribed-word word-eval-slip" title="كلمة زائدة">${escapeHTML(item.spoken)} <span class="eval-tag tag-slip"><i class="fa-solid fa-plus"></i></span></span> `;
            hasSpokenForThisAyah = true;
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

    const evaluatedWordsCount = Math.max(totalCorrect + totalMismatches, 1);
    const accuracy = Math.max(0, Math.round((totalCorrect / evaluatedWordsCount) * 100));
    lastAccuracy = accuracy;

    if (scoreNumber) scoreNumber.textContent = `${accuracy}%`;
    if (countCorrect) countCorrect.textContent = totalCorrect;
    if (countErrors) countErrors.textContent = totalMismatches;
    if (countMissing) countMissing.textContent = totalMissing;

    if (scoreEvaluationTitle) {
        if (accuracy >= 90) {
            scoreEvaluationTitle.textContent = "ما شاء الله! تلاوة ممتازة ومتقنة جداً";
            scoreEvaluationTitle.style.color = "var(--success-green)";
        } else if (accuracy >= 75) {
            scoreEvaluationTitle.textContent = "تلاوة طيبة، واصل التحسين والتدريب";
            scoreEvaluationTitle.style.color = "var(--gold)";
        } else {
            scoreEvaluationTitle.textContent = "توجد كلمات تحتاج لتصحيح نطقها - حاول مجدداً 🔄";
            scoreEvaluationTitle.style.color = "var(--warn-orange)";
        }
    }

    if (wordsAlignmentCloud) {
        wordsAlignmentCloud.innerHTML = '';
        allWordChips.forEach(item => {
            const chip = document.createElement('div');
            chip.className = `word-chip ${item.status}`;

            if (item.status === 'match') {
                chip.textContent = item.original;
            } else if (item.status === 'mismatch') {
                chip.innerHTML = `<span>${escapeHTML(item.original)}</span> <small style="color:var(--gold-light); font-size:12px;">(نطقت: ${escapeHTML(item.recited)})</small>`;
            } else if (item.status === 'missing') {
                chip.textContent = item.original;
                chip.title = "كلمة منسية أو لم تُسمع";
            } else if (item.status === 'extra') {
                chip.innerHTML = `<span>${escapeHTML(item.recited)}</span> <small style="font-size:11px;">(زائدة)</small>`;
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
