// features/recite/recite.js - استوديو المصحح القرآني الذكي والتسميع بالذكاء الاصطناعي

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
let currentAyahNumber = 1;
let isFullSurahMode = true; // Default: Recite full Surah with verse marks!
let currentSurahVerses = []; // Array of verses objects { numberInSurah, text, rawWords, normWords }
let currentTargetVerseText = "";

// Audio Recording & Silence Auto-Analysis
let mediaRecorder = null;
let audioChunks = [];
let audioStream = null;
let isRecording = false;
let recordStartTime = null;
let timerInterval = null;
let silenceTimer = null; // Auto analyze after 5 seconds of silence!
let recordedAudioBlob = null;

let audioContext = null;
let analyser = null;
let dataArray = null;
let animationFrameId = null;

// Speech Recognition (Web Speech API)
let speechRecognizer = null;
let liveTranscript = "";
let isRecognizing = false;

// Exemplary Reciter Audio
let audioExemplary = null;
let isExemplaryPlaying = false;

// User Settings
let aiEngineMode = localStorage.getItem("recite_engine_mode") || "make";
let makeWebhookUrl = localStorage.getItem("recite_make_webhook") || "https://hook.eu1.make.com/cidwvfapp9ikvvgfs37fr9upt32nxtbx";
let pythonServiceUrl = localStorage.getItem("recite_python_url") || "http://localhost:8080";
let hfApiToken = localStorage.getItem("recite_hf_token") || "";

// -----------------------------------------------------------------------------
// 3. DOM Elements Cache
// -----------------------------------------------------------------------------
// Selectors
const surahDropdownWrap = document.getElementById('surah-dropdown-wrap');
const surahDropdownTrigger = document.getElementById('surah-dropdown-trigger');
const selectedSurahTitle = document.getElementById('selected-surah-title');
const surahSearchInput = document.getElementById('surah-search-input');
const surahItemsList = document.getElementById('surah-items-list');

const btnModeFull = document.getElementById('btn-mode-full');
const btnModeSingle = document.getElementById('btn-mode-single');
const ayahStepperInner = document.getElementById('ayah-stepper-inner');
const btnAyahPrev = document.getElementById('btn-ayah-prev');
const btnAyahNext = document.getElementById('btn-ayah-next');
const inputAyahNum = document.getElementById('input-ayah-num');
const totalAyatBadge = document.getElementById('total-ayat-badge');
const recorderPromptTitle = document.getElementById('recorder-prompt-title');
const btnToggleSurahMode = document.getElementById('btn-toggle-surah-mode'); // backward compat

// Mushaf 3D Elements
const mushafSurahName = document.getElementById('mushaf-surah-name');
const mushafBasmala = document.getElementById('mushaf-basmala');
const mushafVersesFlow = document.getElementById('mushaf-verses-flow');

// Exemplary Player Card
const btnPlayExemplary = document.getElementById('btn-play-exemplary');
const exemplaryPlayIcon = document.getElementById('exemplary-play-icon');
const exemplaryBarsVisualizer = document.getElementById('exemplary-bars-visualizer');
const exemplaryTimer = document.getElementById('exemplary-timer');

// Recording Studio Card
const btnMainRecord = document.getElementById('btn-main-record');
const recorderStatusCaption = document.getElementById('recorder-status-caption');
const recorderTimer = document.getElementById('recorder-timer');
const recorderActionsRow = document.getElementById('recorder-actions-row');
const btnStopAnalyze = document.getElementById('btn-stop-analyze');
const btnResetRecord = document.getElementById('btn-reset-record');
const waveformCanvas = document.getElementById('waveform-canvas');
const recordedAudioPlayer = document.getElementById('recorded-audio-player');

// Evaluation Modal
const evaluationModalBackdrop = document.getElementById('evaluation-modal-backdrop');
const btnCloseEvaluation = document.getElementById('btn-close-evaluation');
const scoreNumber = document.getElementById('score-number');
const scoreEvaluationTitle = document.getElementById('score-evaluation-title');
const countCorrect = document.getElementById('count-correct');
const countErrors = document.getElementById('count-errors');
const countMissing = document.getElementById('count-missing');
const wordsAlignmentCloud = document.getElementById('words-alignment-cloud');
const transcriptionTextDisplay = document.getElementById('transcription-text-display');
const btnEvalRetry = document.getElementById('btn-eval-retry');
const btnEvalNext = document.getElementById('btn-eval-next');

// Settings Modal & Banner
const apiSetupBanner = document.getElementById('api-setup-banner');
const btnBannerSetup = document.getElementById('btn-banner-setup');
const settingsModal = document.getElementById('settings-modal');
const btnOpenSettings = document.getElementById('btn-open-settings');
const btnCloseSettings = document.getElementById('btn-close-settings');
const btnSaveSettings = document.getElementById('btn-save-settings');

const inputEngineMode = document.getElementById('setting-engine-mode');
const inputMakeWebhook = document.getElementById('setting-make-webhook');
const inputPythonUrl = document.getElementById('setting-python-url');
const inputHfToken = document.getElementById('setting-hf-token');

const toastMsg = document.getElementById('toast-msg');

// -----------------------------------------------------------------------------
// 4. Initialization
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    audioExemplary = document.getElementById('audio-exemplary');

    initCarousel();
    initCustomSurahDropdown();
    initSettingsValues();
    initEventListeners();
    checkApiBannerVisibility();

    // Load initial Surah (Al-Fatiha, Ayah 1)
    loadSurahAndVerses(currentSurahNumber, currentAyahNumber);
});

// Fullscreen Background Carousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 8000);
}

// -----------------------------------------------------------------------------
// 5. Custom Surah Dropdown & Search Logic
// -----------------------------------------------------------------------------
function initCustomSurahDropdown() {
    renderSurahDropdownItems(SURAHS_DB);

    // Toggle Dropdown
    surahDropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = surahDropdownWrap.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
            surahDropdownWrap.classList.add('open');
            surahDropdownTrigger.setAttribute('aria-expanded', 'true');
            setTimeout(() => surahSearchInput.focus(), 50);
        }
    });

    // Search filter
    surahSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        const filtered = SURAHS_DB.filter(s => {
            return s.name.includes(query) || s.number.toString() === query;
        });
        renderSurahDropdownItems(filtered);
    });

    // Close on click outside or Esc
    document.addEventListener('click', (e) => {
        if (!surahDropdownWrap.contains(e.target)) {
            closeAllDropdowns();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllDropdowns();
    });
}

function closeAllDropdowns() {
    surahDropdownWrap.classList.remove('open');
    surahDropdownTrigger.setAttribute('aria-expanded', 'false');
}

function renderSurahDropdownItems(list) {
    surahItemsList.innerHTML = '';
    if (!list.length) {
        surahItemsList.innerHTML = '<div style="text-align:center; padding: 15px; color: rgba(255,255,255,0.5); font-size:13px;">لا توجد نتائج مطابقة</div>';
        return;
    }

    list.forEach(s => {
        const item = document.createElement('div');
        item.className = `dropdown-item ${s.number === currentSurahNumber ? 'selected' : ''}`;
        item.setAttribute('role', 'option');
        item.innerHTML = `
            <div class="item-left-info">
                <span class="item-num-badge">${s.number}</span>
                <span class="item-surah-name">سورة ${s.name}</span>
            </div>
            <span class="item-ayat-count">${s.ayat} آيات</span>
        `;

        item.addEventListener('click', () => {
            selectSurah(s.number);
            closeAllDropdowns();
        });

        surahItemsList.appendChild(item);
    });
}

function selectSurah(surahNum) {
    currentSurahNumber = surahNum;
    currentAyahNumber = 1;
    loadSurahAndVerses(currentSurahNumber, currentAyahNumber);
}

// -----------------------------------------------------------------------------
// 6. Quran Loader & Live Calligraphic Inscribe Canvas
// -----------------------------------------------------------------------------
async function loadSurahAndVerses(surahNum, targetAyahNum) {
    const surahMeta = SURAHS_DB.find(s => s.number === surahNum) || SURAHS_DB[0];

    // Update Dropdown and Headers
    if (selectedSurahTitle) selectedSurahTitle.textContent = `سورة ${surahMeta.name}`;
    if (mushafSurahName) mushafSurahName.textContent = `سُوْرَةُ ${surahMeta.name}`;
    
    // Update Stepper Input & Total Badge
    if (inputAyahNum) {
        inputAyahNum.max = surahMeta.ayat;
        inputAyahNum.value = targetAyahNum;
    }
    if (totalAyatBadge) {
        totalAyatBadge.textContent = `من ${surahMeta.ayat}`;
    }

    // Basmala visibility
    if (mushafBasmala) {
        if (surahNum === 9) { // At-Tawbah has no Basmala
            mushafBasmala.style.display = 'none';
        } else {
            mushafBasmala.style.display = 'block';
        }
    }

    // Set Mushaf Canvas in Ready State (Quran text is NOT displayed beforehand)
    resetMushafCanvasToReady();

    // 1. Instant offline loading from pre-loaded full Quran database (all 114 Surahs)
    if (window.QURAN_FULL_DATA && window.QURAN_FULL_DATA[surahNum] && window.QURAN_FULL_DATA[surahNum].ayahs) {
        currentSurahVerses = processVersesData(window.QURAN_FULL_DATA[surahNum].ayahs, surahNum);
        const found = currentSurahVerses.find(a => a.numberInSurah === targetAyahNum);
        currentTargetVerseText = found ? found.text : (currentSurahVerses[0] ? currentSurahVerses[0].text : "");
        prepareExemplaryAudio(surahNum, targetAyahNum);
        return;
    }

    // 2. Fetch Full Surah Verses for target verification via API
    try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`);
        if (res.ok) {
            const data = await res.json();
            if (data.data && data.data.ayahs) {
                currentSurahVerses = processVersesData(data.data.ayahs, surahNum);
                const found = currentSurahVerses.find(a => a.numberInSurah === targetAyahNum);
                currentTargetVerseText = found ? found.text : (currentSurahVerses[0] ? currentSurahVerses[0].text : "");
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

function setReciteMode(mode) {
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];

    if (mode === 'full') {
        isFullSurahMode = true;
        if (btnModeFull) btnModeFull.classList.add('active');
        if (btnModeSingle) btnModeSingle.classList.remove('active');
        if (ayahStepperInner) ayahStepperInner.style.display = 'none';
        if (recorderPromptTitle) recorderPromptTitle.textContent = 'اضغط على الميكروفون وابدأ بتسميع السورة كاملة بصوتك';
        showToast(`تم تفعيل وضع تسميع كامل سورة ${surahMeta.name}`);
    } else {
        isFullSurahMode = false;
        if (btnModeSingle) btnModeSingle.classList.add('active');
        if (btnModeFull) btnModeFull.classList.remove('active');
        if (ayahStepperInner) ayahStepperInner.style.display = 'flex';
        if (recorderPromptTitle) recorderPromptTitle.textContent = `اضغط على الميكروفون وابدأ بتسميع الآية رقم ${currentAyahNumber} بصوتك`;
        showToast(`تم تفعيل وضع تسميع الآية رقم ${currentAyahNumber} من سورة ${surahMeta.name}`);
    }

    resetMushafCanvasToReady();
    resetStudioRecording();
}

let isPeekRevealed = false;

function resetMushafCanvasToReady() {
    if (!mushafVersesFlow) return;

    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
    const scopeTitle = isFullSurahMode 
        ? `تسميع كامل سورة ${surahMeta.name}`
        : `تسميع الآية رقم ${currentAyahNumber} من سورة ${surahMeta.name}`;
    const scopeSub = isFullSurahMode 
        ? `المصحف جاهز لاستقبال تلاوتك لجميع آيات السورة (${surahMeta.ayat} آيات)`
        : `المصحف مخفي لاختبار حفظك عن ظهر قلب - اقرأ الآية وسيقوم القلم بخطّ ما تقرأه وتصحيحه`;

    isPeekRevealed = false;

    mushafVersesFlow.innerHTML = `
        <div class="inscribe-canvas-wrapper" id="inscribe-canvas-wrapper">
            <div class="inscribe-prompt-hint" id="inscribe-prompt-hint">
                <i class="fa-solid fa-feather-pointed inscribe-nib-icon"></i>
                <h3 class="inscribe-scope-title" id="prompt-scope-title">${escapeHTML(scopeTitle)}</h3>
                <p class="inscribe-scope-sub" id="prompt-scope-sub">${escapeHTML(scopeSub)}</p>
                <div class="inscribe-instruction-badge">
                    <i class="fa-solid fa-microphone-lines"></i>
                    <span>اضغط زر الميكروفون بالأسفل وابدأ التسميع.. ما تقرؤه بصوتك سيظهر ويُصحّح هنا مباشرة</span>
                </div>
                <button type="button" class="btn-peek-mushaf" id="btn-peek-mushaf" title="كشف نص الآية للمساعدة">
                    <i class="fa-solid fa-eye"></i>
                    <span id="peek-btn-text">كشف النص للمراجعة</span>
                </button>
                <div class="peek-verse-box" id="peek-verse-box" style="display: none;"></div>
            </div>
            <div class="live-inscribed-stream" id="live-inscribed-stream" style="display: none;"></div>
        </div>
    `;

    // Attach Peek Button Listener
    const btnPeek = document.getElementById('btn-peek-mushaf');
    const peekBox = document.getElementById('peek-verse-box');
    const peekBtnText = document.getElementById('peek-btn-text');

    if (btnPeek && peekBox) {
        btnPeek.addEventListener('click', () => {
            isPeekRevealed = !isPeekRevealed;
            if (isPeekRevealed) {
                peekBox.style.display = 'block';
                if (peekBtnText) peekBtnText.textContent = 'إخفاء النص للمواصلة في الحفظ';
                const eyeIcon = btnPeek.querySelector('i');
                if (eyeIcon) eyeIcon.className = 'fa-solid fa-eye-slash';

                if (isFullSurahMode) {
                    let peekHtml = '';
                    currentSurahVerses.forEach(a => {
                        peekHtml += `${escapeHTML(a.text)} <span class="ayah-end-num">﴿ ${toArabicDigits(a.numberInSurah)} ﴾</span> `;
                    });
                    peekBox.innerHTML = peekHtml || 'جاري تحميل الآيات...';
                } else {
                    const found = currentSurahVerses.find(a => a.numberInSurah === currentAyahNumber);
                    const txt = found ? found.text : currentTargetVerseText;
                    peekBox.innerHTML = `${escapeHTML(txt)} <span class="ayah-end-num">﴿ ${toArabicDigits(currentAyahNumber)} ﴾</span>`;
                }
            } else {
                peekBox.style.display = 'none';
                if (peekBtnText) peekBtnText.textContent = 'كشف النص للمراجعة';
                const eyeIcon = btnPeek.querySelector('i');
                if (eyeIcon) eyeIcon.className = 'fa-solid fa-eye';
            }
        });
    }
}

function goToAyah(ayahNum) {
    const surahMeta = SURAHS_DB.find(s => s.number === currentSurahNumber) || SURAHS_DB[0];
    let targetNum = parseInt(ayahNum, 10);
    if (isNaN(targetNum) || targetNum < 1) targetNum = 1;
    if (targetNum > surahMeta.ayat) targetNum = surahMeta.ayat;

    currentAyahNumber = targetNum;
    if (inputAyahNum) inputAyahNum.value = currentAyahNumber;

    const foundAyah = currentSurahVerses.find(a => a.numberInSurah === currentAyahNumber);
    if (foundAyah) {
        currentTargetVerseText = foundAyah.text;
    }

    if (!isFullSurahMode && recorderPromptTitle) {
        recorderPromptTitle.textContent = `اضغط على الميكروفون وابدأ بتسميع الآية رقم ${currentAyahNumber} بصوتك`;
    }

    resetMushafCanvasToReady();
    prepareExemplaryAudio(currentSurahNumber, currentAyahNumber);
    resetStudioRecording();
}

function toArabicDigits(num) {
    const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(num).replace(/[0-9]/g, d => arabicDigits[d]);
}

// -----------------------------------------------------------------------------
// 7. Exemplary Reciter Player ("استمع للتلاوة النموذجية")
// -----------------------------------------------------------------------------
function prepareExemplaryAudio(surahNum, ayahNum) {
    if (!audioExemplary) return;

    pauseExemplaryAudio();

    // EveryAyah Mishary Alafasy CDN standard formatting: 001005.mp3
    const sPadded = String(surahNum).padStart(3, '0');
    const aPadded = String(ayahNum).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sPadded}${aPadded}.mp3`;

    audioExemplary.src = audioUrl;
    exemplaryTimer.textContent = '00:00 / 00:00';

    audioExemplary.onloadedmetadata = () => {
        const total = formatTime(audioExemplary.duration);
        exemplaryTimer.textContent = `00:00 / ${total}`;
    };

    audioExemplary.ontimeupdate = () => {
        const cur = formatTime(audioExemplary.currentTime);
        const total = formatTime(audioExemplary.duration || 0);
        exemplaryTimer.textContent = `${cur} / ${total}`;
    };

    audioExemplary.onended = () => {
        pauseExemplaryAudio();
        showToast('أحسنت الاستماع! الآن اقرأ الآية بصوتك وسيقوم القلم القرآني بخطّ تلاوتك وتصحيحها.');
    };

    audioExemplary.onerror = () => {
        const fallbackUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNum}.mp3`;
        if (audioExemplary.src !== fallbackUrl) {
            audioExemplary.src = fallbackUrl;
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
        exemplaryPlayIcon.className = 'fa-solid fa-pause';
        exemplaryBarsVisualizer.classList.add('playing');
    }).catch(err => {
        console.warn("Exemplary audio play failed:", err);
    });
}

function pauseExemplaryAudio() {
    if (!audioExemplary) return;
    audioExemplary.pause();
    isExemplaryPlaying = false;
    exemplaryPlayIcon.className = 'fa-solid fa-play';
    exemplaryBarsVisualizer.classList.remove('playing');
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// -----------------------------------------------------------------------------
// 8. Recording Studio & Audio Visualizer ("اقرأ بنفسك")
// -----------------------------------------------------------------------------
async function startRecording() {
    pauseExemplaryAudio();

    try {
        audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: 16000,
                echoCancellation: true,
                noiseSuppression: true
            }
        });

        let mimeType = 'audio/webm;codecs=opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : 'audio/wav';
        }

        audioChunks = [];
        mediaRecorder = new MediaRecorder(audioStream, { mimeType });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };

        // Audio Context Waveform
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioCtx();
            const source = audioContext.createMediaStreamSource(audioStream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            waveformCanvas.style.display = 'block';
            drawWaveform();
        } catch (err) {
            console.warn("AudioContext visualizer skipped:", err);
        }

        mediaRecorder.start(100);
        isRecording = true;
        recordStartTime = Date.now();

        // UI Updates
        btnMainRecord.classList.add('recording');
        recorderStatusCaption.textContent = 'جاري الاستماع لتلاوتك وتدوينها داخل المصحف...';
        recorderActionsRow.style.display = 'flex';

        // Prepare Live Inscribe Stream inside Mushaf
        const hint = document.getElementById('inscribe-prompt-hint');
        const stream = document.getElementById('live-inscribed-stream');
        if (hint) hint.style.display = 'none';
        if (stream) {
            stream.style.display = 'block';
            stream.innerHTML = '<span class="inscribed-word interim"><i class="fa-solid fa-feather-pointed"></i> استمر في التلاوة، القلم يدوّن الآن...</span>';
        }

        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
            recorderTimer.textContent = formatTime(elapsed);
        }, 1000);

        // Start Live Speech transcription with Silence Auto-Analysis
        startLiveSpeechRecognition();

    } catch (err) {
        console.error("Microphone access error:", err);
        showToast('تعذر الوصول للميكروفون، يرجى السماح بالإذن في المتصفح.');
    }
}

function triggerSilenceCountdown() {
    if (silenceTimer) clearTimeout(silenceTimer);
    // 5 seconds after silence, automatically finish and analyze!
    silenceTimer = setTimeout(() => {
        if (isRecording) {
            recorderStatusCaption.textContent = 'تم اكتمال التلاوة، جاري التحليل التلقائي...';
            stopRecordingAndAnalyze();
        }
    }, 5000);
}

function stopRecordingAndAnalyze() {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (!mediaRecorder || !isRecording) return;

    stopLiveSpeechRecognition();

    mediaRecorder.onstop = async () => {
        isRecording = false;
        clearInterval(timerInterval);

        if (audioStream) {
            audioStream.getTracks().forEach(t => t.stop());
        }
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().catch(() => {});
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        const mime = mediaRecorder.mimeType || 'audio/webm';
        recordedAudioBlob = new Blob(audioChunks, { type: mime });

        // UI Updates
        btnMainRecord.classList.remove('recording');
        recorderStatusCaption.textContent = 'جاري تدقيق التلاوة عبر الذكاء الاصطناعي...';

        // Playback audio element
        const audioUrl = URL.createObjectURL(recordedAudioBlob);
        recordedAudioPlayer.src = audioUrl;

        showToast('اكتمل التسجيل! جاري فحص ومقارنة الكلمات وتحديد الأخطاء...');

        // Process with AI Engine
        await processRecitationInference(recordedAudioBlob);
    };

    mediaRecorder.stop();
}

function resetStudioRecording() {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (isRecording) {
        stopLiveSpeechRecognition();
        if (audioStream) audioStream.getTracks().forEach(t => t.stop());
        isRecording = false;
        clearInterval(timerInterval);
    }

    liveTranscript = "";
    btnMainRecord.classList.remove('recording');
    recorderStatusCaption.textContent = 'اضغط لبدء التسجيل';
    recorderTimer.textContent = '00:00';
    recorderActionsRow.style.display = 'none';
    waveformCanvas.style.display = 'none';

    resetMushafCanvasToReady();
}

function drawWaveform() {
    if (!isRecording || !analyser) return;

    animationFrameId = requestAnimationFrame(drawWaveform);
    analyser.getByteFrequencyData(dataArray);

    const canvas = waveformCanvas;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / dataArray.length) * 1.5;
    let x = (width - (dataArray.length * barWidth)) / 2;

    for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.85;

        const gradient = ctx.createLinearGradient(0, height / 2 - barHeight / 2, 0, height / 2 + barHeight / 2);
        gradient.addColorStop(0, '#C5A859');
        gradient.addColorStop(0.5, '#dfc274');
        gradient.addColorStop(1, '#2F7A78');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, height / 2 - barHeight / 2, barWidth - 3, Math.max(barHeight, 4), 3);
        } else {
            ctx.rect(x, height / 2 - barHeight / 2, barWidth - 3, Math.max(barHeight, 4));
        }
        ctx.fill();

        x += barWidth;
    }
}

// -----------------------------------------------------------------------------
// 9. Web Speech API (Live Transcription & Real-Time Inscribing)
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
                updateLiveInscribedWords(liveTranscript);
                // Reset/trigger the 5-second silence countdown!
                triggerSilenceCountdown();
            }
        };

        speechRecognizer.onerror = (e) => {
            console.warn("SpeechRecognition notice:", e.error);
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

// Inscribe live spoken words into the Mushaf canvas with dynamic Ayah dividers
function updateLiveInscribedWords(spokenText) {
    const stream = document.getElementById('live-inscribed-stream');
    if (!stream) return;

    const spokenWords = spokenText.split(/\s+/).filter(Boolean);
    if (!spokenWords.length) return;

    const targetAyahs = getActiveTargetAyahs();
    if (!targetAyahs.length) return;

    stream.innerHTML = '';
    let spokenIdx = 0;

    for (let aIdx = 0; aIdx < targetAyahs.length; aIdx++) {
        const ayah = targetAyahs[aIdx];
        const rawWords = ayah.rawWords || [];
        const normWords = ayah.normWords || [];

        const ayahSpokenStart = spokenIdx;
        const wordsToMatch = Math.min(rawWords.length, spokenWords.length - spokenIdx);

        if (wordsToMatch <= 0 && spokenIdx >= spokenWords.length) {
            break;
        }

        for (let w = 0; w < wordsToMatch; w++) {
            const currentSpoken = spokenWords[spokenIdx];
            const expectedRaw = rawWords[w];
            const expectedNorm = normWords[w];
            const spokenNorm = normalizeArabicText(currentSpoken);

            const span = document.createElement('span');
            span.className = 'inscribed-word';

            if (spokenNorm === expectedNorm) {
                span.className += ' correct';
                span.textContent = expectedRaw;
            } else {
                span.className += ' slip';
                span.textContent = currentSpoken; // What the user actually recited!
                span.title = `نطقت: ${currentSpoken} | المتوقع: ${expectedRaw}`;
            }
            stream.appendChild(span);
            spokenIdx++;
        }

        // If the user has finished or exceeded this Ayah's words, insert Ayah End rosette!
        if (spokenIdx - ayahSpokenStart >= rawWords.length) {
            const ayahEnd = document.createElement('span');
            ayahEnd.className = 'ayah-end-num';
            ayahEnd.textContent = ` ﴿ ${toArabicDigits(ayah.numberInSurah)} ﴾ `;
            stream.appendChild(ayahEnd);
        }

        if (spokenIdx >= spokenWords.length) {
            break;
        }
    }

    // Inscribe any extra words spoken beyond target
    while (spokenIdx < spokenWords.length) {
        const span = document.createElement('span');
        span.className = 'inscribed-word slip extra';
        span.textContent = spokenWords[spokenIdx];
        span.title = 'كلمة زائدة';
        stream.appendChild(span);
        spokenIdx++;
    }
}

// -----------------------------------------------------------------------------
// 10. AI Inference Pipeline Dispatcher (Make.com / HF / Python / SpeechRecognition)
// -----------------------------------------------------------------------------
async function processRecitationInference(audioBlob) {
    try {
        let transcribedText = "";

        // Priority 1: Real-time captured speech transcription
        if (liveTranscript && liveTranscript.trim().length > 0) {
            transcribedText = liveTranscript.trim();
        }

        // Priority 2: Make.com Webhook Gateway
        if (aiEngineMode === "make") {
            const url = makeWebhookUrl || "https://hook.eu1.make.com/cidwvfapp9ikvvgfs37fr9upt32nxtbx";
            try {
                const mkRes = await callMakeWebhook(audioBlob, url);
                if (mkRes && mkRes.trim().length > 0) {
                    transcribedText = mkRes.trim();
                }
            } catch (e) {
                console.warn("Make webhook notice:", e);
            }
        } else if (aiEngineMode === "direct_hf") {
            if (!hfApiToken) {
                showToast('تنبيه: يرجى وضع توكن Hugging Face أولاً في الإعدادات ⚙️');
                settingsModal.classList.add('active');
            } else {
                try {
                    const hfRes = await callDirectHuggingFace(audioBlob, hfApiToken);
                    if (hfRes && hfRes.trim().length > 0) {
                        transcribedText = hfRes.trim();
                    }
                } catch (e) {
                    console.warn("Hugging Face notice:", e);
                    showToast(e.message);
                }
            }
        } else if (aiEngineMode === "python" && pythonServiceUrl) {
            try {
                const pyRes = await callPythonService(audioBlob, pythonServiceUrl);
                if (pyRes && pyRes.trim().length > 0) {
                    transcribedText = pyRes.trim();
                }
            } catch (e) {
                console.warn("Python service notice:", e);
            }
        }

        // Never fake 100% correct if no audio/speech was captured!
        if (!transcribedText || transcribedText.trim().length === 0) {
            recorderStatusCaption.textContent = 'لم يتم التقاط أي كلمات، يرجى إعادة التسميع بصوت واضح.';
            showToast('تنبيه: لم يتم التقاط كلمات واضحة من الميكروفون. تأكد من إعطاء الإذن والتحدث بوضوح.');
            return;
        }

        const targetAyahs = getActiveTargetAyahs();
        renderRecitationResults(targetAyahs, transcribedText);
        recorderStatusCaption.textContent = 'تم اكتمال التحليل والتصحيح بنجاح!';

    } catch (error) {
        console.error("AI Inference Error:", error);
        recorderStatusCaption.textContent = `تعذر التحليل: ${error.message}`;
        showToast(`خطأ في التحليل: ${error.message}`);
    }
}

// Make.com Webhook Gateway
async function callMakeWebhook(blob, url) {
    const formData = new FormData();
    formData.append('file', blob, 'recitation.webm');

    const res = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (!res.ok) throw new Error(`Make.com استجاب بخطأ: ${res.status}`);
    const text = await res.text();
    try {
        const json = JSON.parse(text);
        return json.transcription || json.text || json.result || "";
    } catch (e) {
        if (text && text.trim() !== "Accepted") {
            return text.trim();
        }
        return "";
    }
}

// Direct Hugging Face Inference API
async function callDirectHuggingFace(blob, token) {
    const url = "https://api-inference.huggingface.co/models/tarteel-ai/whisper-base-ar-quran";
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        if (attempts > 1) {
            recorderStatusCaption.textContent = `جاري إيقاظ الذكاء الاصطناعي (محاولة ${attempts}/${maxAttempts})...`;
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "audio/webm",
                "x-wait-for-model": "true"
            },
            body: blob
        });

        if (res.status === 503) {
            const errData = await res.json().catch(() => ({}));
            const waitSec = Math.min(errData.estimated_time || 15, 20);
            await new Promise(r => setTimeout(r, waitSec * 1000));
            continue;
        }

        if (!res.ok) {
            const errText = await res.text().catch(() => "");
            throw new Error(`استجاب Hugging Face برمز (${res.status}): ${errText.slice(0, 80)}`);
        }

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data[0].text;
        return data.text || "";
    }

    throw new Error("استغرق إيقاظ النموذج وقتاً، يرجى إعادة المحاولة الآن وسيعمل مباشرة.");
}

// Python FastAPI Service
async function callPythonService(blob, baseUrl) {
    const formData = new FormData();
    formData.append('file', blob, 'recitation.webm');

    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/transcribe-recitation`, {
        method: 'POST',
        body: formData
    });

    if (!res.ok) throw new Error(`سيرفر بايثون استجاب بخطأ: ${res.status}`);
    const data = await res.json();
    return data.transcription || "";
}

// -----------------------------------------------------------------------------
// 11. Arabic Text Normalizer & Alignment (Preserves Arabic Letters!)
// -----------------------------------------------------------------------------
const TASHKEEL_AND_PUNCTUATION_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u060C\u061B\u061F\u066A-\u066D]|[.,\/#!$%\^&\*;:{}=\-_`~()؟،«»"'\d]/gu;

function normalizeArabicText(str) {
    if (!str) return "";
    return str
        .replace(TASHKEEL_AND_PUNCTUATION_REGEX, '')
        .replace(/[إأآٱ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/\s+/g, ' ')
        .trim();
}

// -----------------------------------------------------------------------------
// 12. Results Evaluation Rendering & Final Inscription with Red Underlines
// -----------------------------------------------------------------------------
function renderRecitationResults(targetAyahs, transcribedText) {
    if (!Array.isArray(targetAyahs)) {
        targetAyahs = [ { numberInSurah: currentAyahNumber, text: targetAyahs, rawWords: (targetAyahs || "").split(/\s+/).filter(Boolean), normWords: (targetAyahs || "").split(/\s+/).filter(Boolean).map(normalizeArabicText) } ];
    }

    const spokenWords = transcribedText.split(/\s+/).filter(Boolean);
    const spokenNorm = spokenWords.map(normalizeArabicText);

    let totalExpected = 0;
    let totalCorrect = 0;
    let totalMismatches = 0;
    let totalMissing = 0;
    const allWordChips = [];

    const stream = document.getElementById('live-inscribed-stream');
    if (stream) {
        stream.style.display = 'block';
        stream.innerHTML = '';
    }

    let spokenIdx = 0;

    targetAyahs.forEach(ayah => {
        const rawWords = ayah.rawWords || [];
        const normWords = ayah.normWords || [];
        totalExpected += rawWords.length;

        rawWords.forEach((expectedRaw, wIdx) => {
            const expectedNorm = normWords[wIdx];
            const currentSpoken = spokenWords[spokenIdx];
            const currentSpokenNorm = spokenNorm[spokenIdx];

            const span = document.createElement('span');
            span.className = 'inscribed-word';

            if (currentSpoken !== undefined) {
                if (currentSpokenNorm === expectedNorm) {
                    totalCorrect++;
                    span.className += ' correct';
                    span.textContent = expectedRaw;
                    allWordChips.push({
                        status: 'match',
                        original: expectedRaw,
                        recited: currentSpoken
                    });
                } else {
                    totalMismatches++;
                    span.className += ' slip';
                    span.textContent = currentSpoken; // What user actually recited!
                    span.title = `نطقت: ${currentSpoken} | المتوقع: ${expectedRaw}`;
                    allWordChips.push({
                        status: 'mismatch',
                        original: expectedRaw,
                        recited: currentSpoken
                    });
                }
                spokenIdx++;
            } else {
                totalMissing++;
                span.className += ' slip';
                span.style.opacity = '0.6';
                span.textContent = expectedRaw;
                span.title = 'كلمة لم تُسمع أو ناقصة';
                allWordChips.push({
                    status: 'missing',
                    original: expectedRaw,
                    recited: null
                });
            }

            if (stream) stream.appendChild(span);
        });

        // Insert Gilded Ayah Number Ornament after each Ayah!
        if (stream) {
            const ayahEnd = document.createElement('span');
            ayahEnd.className = 'ayah-end-num';
            ayahEnd.textContent = ` ﴿ ${toArabicDigits(ayah.numberInSurah)} ﴾ `;
            stream.appendChild(ayahEnd);
        }
    });

    // Handle any extra words spoken beyond target
    while (spokenIdx < spokenWords.length) {
        const extraWord = spokenWords[spokenIdx];
        const span = document.createElement('span');
        span.className = 'inscribed-word slip extra';
        span.textContent = extraWord;
        span.title = 'كلمة زائدة';
        if (stream) stream.appendChild(span);

        allWordChips.push({
            status: 'extra',
            original: null,
            recited: extraWord
        });
        spokenIdx++;
    }

    const evaluatedWordsCount = Math.max(totalExpected, 1);
    const accuracy = Math.max(0, Math.round((totalCorrect / evaluatedWordsCount) * 100));

    scoreNumber.textContent = `${accuracy}%`;
    countCorrect.textContent = totalCorrect;
    countErrors.textContent = totalMismatches;
    countMissing.textContent = totalMissing;

    if (accuracy >= 95) {
        scoreEvaluationTitle.textContent = "ما شاء الله! تلاوة ممتازة ومتقنة جداً";
        scoreEvaluationTitle.style.color = "var(--success-green)";
    } else if (accuracy >= 80) {
        scoreEvaluationTitle.textContent = "تلاوة جيدة، واصل التحسين والإتقان";
        scoreEvaluationTitle.style.color = "var(--gold)";
    } else {
        scoreEvaluationTitle.textContent = "توجد كلمات تحتاج لتصحيح نطقها - حاول مجدداً 🔄";
        scoreEvaluationTitle.style.color = "var(--warn-orange)";
    }

    // Build Word Chips in Dialog
    wordsAlignmentCloud.innerHTML = '';
    allWordChips.forEach(item => {
        const chip = document.createElement('div');
        chip.className = `word-chip ${item.status}`;

        if (item.status === 'match') {
            chip.textContent = item.original;
            chip.title = "نطق سليم";
        } else if (item.status === 'mismatch') {
            chip.innerHTML = `<span>${escapeHTML(item.original)}</span> <small style="color:var(--gold-light); font-size:12px;">(نطقت: ${escapeHTML(item.recited)})</small>`;
            chip.title = `المتوقع: ${item.original} | المنطوق: ${item.recited}`;
        } else if (item.status === 'missing') {
            chip.textContent = item.original;
            chip.title = "كلمة منسية أو لم تُسمع";
        } else if (item.status === 'extra') {
            chip.innerHTML = `<span>${escapeHTML(item.recited)}</span> <small style="font-size:11px;">(زائدة)</small>`;
            chip.title = "كلمة زائدة غير موجودة في الآية";
        }

        wordsAlignmentCloud.appendChild(chip);
    });

    transcriptionTextDisplay.textContent = transcribedText;
    evaluationModalBackdrop.classList.add('active');
}

// -----------------------------------------------------------------------------
// 13. Event Listeners & Settings
// -----------------------------------------------------------------------------
function initEventListeners() {
    // Mode Segmented Buttons (Full Surah vs Specific Ayah)
    if (btnModeFull) {
        btnModeFull.addEventListener('click', () => {
            setReciteMode('full');
        });
    }

    if (btnModeSingle) {
        btnModeSingle.addEventListener('click', () => {
            setReciteMode('single');
        });
    }

    // Direct Ayah Number Input Field
    if (inputAyahNum) {
        inputAyahNum.addEventListener('change', () => {
            const val = parseInt(inputAyahNum.value, 10);
            if (!isNaN(val)) {
                goToAyah(val);
            }
        });
        inputAyahNum.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = parseInt(inputAyahNum.value, 10);
                if (!isNaN(val)) {
                    goToAyah(val);
                }
                inputAyahNum.blur();
            }
        });
    }

    // Ayah Stepper Buttons (< and > / + and -)
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

    // Exemplary Reciter Button
    btnPlayExemplary.addEventListener('click', toggleExemplaryAudio);

    // Main Big Record Button
    btnMainRecord.addEventListener('click', () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecordingAndAnalyze();
        }
    });

    // Stop & Analyze Button
    btnStopAnalyze.addEventListener('click', () => {
        if (isRecording) stopRecordingAndAnalyze();
    });

    // Reset Recording Button
    btnResetRecord.addEventListener('click', resetStudioRecording);

    // Evaluation Modal Actions
    btnCloseEvaluation.addEventListener('click', () => {
        evaluationModalBackdrop.classList.remove('active');
    });

    btnEvalRetry.addEventListener('click', () => {
        evaluationModalBackdrop.classList.remove('active');
        resetStudioRecording();
    });

    btnEvalNext.addEventListener('click', () => {
        evaluationModalBackdrop.classList.remove('active');
        goToAyah(currentAyahNumber + 1);
    });

    // Settings Modal
    btnOpenSettings.addEventListener('click', () => settingsModal.classList.add('active'));
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.remove('active'));
    if (btnBannerSetup) {
        btnBannerSetup.addEventListener('click', () => settingsModal.classList.add('active'));
    }

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.remove('active');
    });

    btnSaveSettings.addEventListener('click', () => {
        aiEngineMode = inputEngineMode.value;
        makeWebhookUrl = inputMakeWebhook.value.trim();
        pythonServiceUrl = inputPythonUrl.value.trim();
        hfApiToken = inputHfToken.value.trim();

        localStorage.setItem("recite_engine_mode", aiEngineMode);
        localStorage.setItem("recite_make_webhook", makeWebhookUrl);
        localStorage.setItem("recite_python_url", pythonServiceUrl);
        localStorage.setItem("recite_hf_token", hfApiToken);

        checkApiBannerVisibility();
        settingsModal.classList.remove('active');
        showToast('تم حفظ إعدادات الذكاء الاصطناعي بنجاح');
    });
}

function checkApiBannerVisibility() {
    if (!apiSetupBanner) return;
    if (hfApiToken || makeWebhookUrl) {
        apiSetupBanner.style.display = 'none';
    } else {
        apiSetupBanner.style.display = 'flex';
    }
}

function initSettingsValues() {
    inputEngineMode.value = aiEngineMode;
    inputMakeWebhook.value = makeWebhookUrl || "https://hook.eu1.make.com/cidwvfapp9ikvvgfs37fr9upt32nxtbx";
    inputPythonUrl.value = pythonServiceUrl;
    inputHfToken.value = hfApiToken;
}

// -----------------------------------------------------------------------------
// 14. Utilities & Toast Notifications
// -----------------------------------------------------------------------------
function showToast(text) {
    if (!toastMsg) return;
    toastMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${escapeHTML(text)}</span>`;
    toastMsg.classList.add('show');
    setTimeout(() => {
        toastMsg.classList.remove('show');
    }, 2800);
}

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
