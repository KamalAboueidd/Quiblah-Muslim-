// features/hadith/hadith.js - منطق وبرمجة صفحة hadith.html

// Background Carousel Rotation
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;
if (slides.length > 0) {
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 8000);
}

// Collections Configuration
const HADITH_COLLECTIONS = {
    'ara-nawawi': {
        id: 'ara-nawawi',
        name: 'الأربعون النووية',
        author: 'الإمام النووي رحمه الله',
        icon: 'fa-star-and-crescent',
        hasSections: false,
        totalHadiths: 42
    },
    'ara-bukhari': {
        id: 'ara-bukhari',
        name: 'صحيح البخاري',
        author: 'الإمام محمد بن إسماعيل البخاري',
        icon: 'fa-book-quran',
        hasSections: true,
        totalHadiths: 7563
    },
    'ara-muslim': {
        id: 'ara-muslim',
        name: 'صحيح مسلم',
        author: 'الإمام مسلم بن الحجاج',
        icon: 'fa-book-open',
        hasSections: true,
        totalHadiths: 3033
    },
    'ara-tirmidhi': {
        id: 'ara-tirmidhi',
        name: 'جامع الترمذي',
        author: 'الإمام أبو عيسى الترمذي',
        icon: 'fa-bookmark',
        hasSections: true,
        totalHadiths: 3956
    },
    'ara-abudawud': {
        id: 'ara-abudawud',
        name: 'سنن أبي داود',
        author: 'الإمام أبو داود السجستاني',
        icon: 'fa-feather-pointed',
        hasSections: true,
        totalHadiths: 5274
    },
    'ara-nasai': {
        id: 'ara-nasai',
        name: 'سنن النسائي',
        author: 'الإمام أحمد بن شعيب النسائي',
        icon: 'fa-scroll',
        hasSections: true,
        totalHadiths: 5758
    },
    'ara-ibnmajah': {
        id: 'ara-ibnmajah',
        name: 'سنن ابن ماجه',
        author: 'الإمام ابن ماجه القزويني',
        icon: 'fa-book',
        hasSections: true,
        totalHadiths: 4341
    },
    'ara-malik': {
        id: 'ara-malik',
        name: 'موطأ مالك',
        author: 'الإمام مالك بن أنس',
        icon: 'fa-award',
        hasSections: true,
        totalHadiths: 1857
    }
};

// Built-in instant fallback dataset (Selected Authentic Hadiths from An-Nawawi)
const BUILTIN_NAWAWI = [
    {
        hadithnumber: 1,
        arabicnumber: 1,
        text: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ».",
        chapter: "باب الإخلاص وإحضار النية",
        grade: "صحيح متفق عليه"
    },
    {
        hadithnumber: 2,
        arabicnumber: 2,
        text: "عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ أَيْضاً قَالَ: «بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صلى الله عليه وسلم ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ شَدِيدُ سَوَادِ الشَّعَرِ، لاَ يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلاَ يَعْرِفُهُ مِنَّا أَحَدٌ، حَتَّى جَلَسَ إِلَى النَّبِيِّ صلى الله عليه وسلم، فَأَسْنَدَ رُكْبَتَيْهِ إِلَى رُكْبَتَيْهِ، وَوَضَعَ كَفَّيْهِ عَلَى فَخِذَيْهِ، وَقَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ... فَقَالَ: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّداً رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً... قَالَ: فَأَخْبِرْنِي عَنِ الإِيمَانِ... قَالَ: أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلاَئِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ... قَالَ: فَأَخْبِرْنِي عَنِ الإِحْسَانِ... قَالَ: أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ... ثُمَّ قَالَ: يَا عُمَرُ، أَتَدْرِي مَنِ السَّائِلُ؟ قُلْتُ: اللَّهُ وَرَسُولُهُ أَعْلَمُ. قَالَ: فَإِنَّهُ جِبْرِيلُ أَتَاكُمْ يُعَلِّمُكُمْ دِينَكُمْ».",
        chapter: "حديث جبريل عليه السلام (مراتب الدين)",
        grade: "صحيح مسلم"
    },
    {
        hadithnumber: 3,
        arabicnumber: 3,
        text: "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: سَمِعْت رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: «بُنِيَ الإِسْلامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لا إلَهَ إلا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ».",
        chapter: "أركان الإسلام",
        grade: "صحيح متفق عليه"
    },
    {
        hadithnumber: 4,
        arabicnumber: 4,
        text: "عَنْ أُمِّ الْمُؤْمِنِينَ أُمِّ عَبْدِ اللَّهِ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا قَالَتْ: قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: «مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ». وفي رواية لمسلم: «مَنْ عَمِلَ عَمَلاً لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ».",
        chapter: "التحذير من البدع والمحدثات",
        grade: "صحيح متفق عليه"
    },
    {
        hadithnumber: 5,
        arabicnumber: 5,
        text: "عَنْ أَبِي عَبْدِ اللَّهِ النُّعْمَانِ بْنِ بَشِيرٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: سَمِعْت رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: «إنَّ الْحَلالَ بَيِّنٌ وَإِنَّ الْحَرَامَ بَيِّنٌ، وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ لا يَعْلَمُهُنَّ كَثِيرٌ مِنْ النَّاسِ، فَمَنْ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ، وَمَنْ وَقَعَ فِي الشُّبُهَاتِ وَقَعَ فِي الْحَرَامِ... أَلا وَإِنَّ فِي الْجَسَدِ مُضْغَةً إذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ، وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ، أَلا وَهِيَ الْقَلْبُ».",
        chapter: "اتقاء الشبهات وسلامة القلب",
        grade: "صحيح متفق عليه"
    },
    {
        hadithnumber: 6,
        arabicnumber: 6,
        text: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ: «مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ».",
        chapter: "آداب اللسان وإكرام الجار والضيف",
        grade: "صحيح متفق عليه"
    },
    {
        hadithnumber: 7,
        arabicnumber: 7,
        text: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ أَنَّ رَجُلاً قَالَ لِلنَّبِيِّ صلى الله عليه وسلم: أَوْصِنِي. قَالَ: «لا تَغْضَبْ». فَرَدَّدَ مِرَارًا، قَالَ: «لا تَغْضَبْ».",
        chapter: "النهي عن الغضب",
        grade: "صحيح البخاري"
    },
    {
        hadithnumber: 8,
        arabicnumber: 8,
        text: "عَنْ أَبِي يَعْلَى شَدَّادِ بْنِ أَوْسٍ رَضِيَ اللَّهُ عَنْهُ عَنْ رَسُولِ اللَّهِ صلى الله عليه وسلم قَالَ: «إنَّ اللَّهَ كَتَبَ الإِحْسَانَ عَلَى كُلِّ شَيْءٍ، فَإِذَا قَتَلْتُمْ فَأَحْسِنُوا الْقِتْلَةَ، وَإِذَا ذَبَحْتُمْ فَأَحْسِنُوا الذِّبْحَةَ، وَلْيُحِدَّ أَحَدُكُمْ شَفْرَتَهُ، وَلْيُرِحْ ذَبِيحَتَهُ».",
        chapter: "وجوب الإحسان في كل شيء",
        grade: "صحيح مسلم"
    },
    {
        hadithnumber: 9,
        arabicnumber: 9,
        text: "عَنْ أَبِي حَمْزَةَ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ خَادِمِ رَسُولِ اللَّهِ صلى الله عليه وسلم، عَنْ النَّبِيِّ صلى الله عليه وسلم قَالَ: «لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ».",
        chapter: "محبة الخير للمؤمنين",
        grade: "صحيح متفق عليه"
    },
    {
        hadithnumber: 10,
        arabicnumber: 10,
        text: "عَنْ أَبِي ذَرٍّ جُنْدَبِ بْنِ جُنَادَةَ، وَأَبِي عَبْدِ الرَّحْمَنِ مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللَّهُ عَنْهُمَا، عَنْ رَسُولِ اللَّهِ صلى الله عليه وسلم قَالَ: «اتَّقِ اللَّهَ حَيْثُمَا كُنْت، وَأَتْبِعْ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ».",
        chapter: "تقوى الله وحسن الخلق",
        grade: "حسن رواه الترمذي"
    }
];

// App State
let currentCollectionId = 'ara-nawawi';
let currentSectionId = 'all';
let allHadiths = [];
let filteredHadiths = [];
let currentPage = 1;
const PAGE_SIZE = 10;
let currentFontSize = parseInt(localStorage.getItem('hadith_font_size') || '22', 10);
let sectionsMetadata = {};

// Primary and Backup API Bases
const API_BASE_JSDELIVR = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
const API_BASE_RAW = 'https://raw.githubusercontent.com/fawazahmed0/hadith-api/1';

// DOM Elements
const booksPillsWrapper = document.getElementById('books-pills-wrapper');
const searchInput = document.getElementById('hadith-search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const chapterSelect = document.getElementById('chapter-select');
const hadithsList = document.getElementById('hadiths-list');
const paginationControls = document.getElementById('pagination-controls');
const jumpInput = document.getElementById('jump-input');
const jumpBtn = document.getElementById('jump-btn');
const totalHadithsCount = document.getElementById('total-hadiths-count');
const currentRangeText = document.getElementById('current-range-text');
const btnIncreaseFont = document.getElementById('btn-font-increase');
const btnDecreaseFont = document.getElementById('btn-font-decrease');
const toastMsg = document.getElementById('toast-msg');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initBookPills();
    initFontSize();
    initEvents();

    // Check URL params for collection
    const params = new URLSearchParams(window.location.search);
    const bookParam = params.get('book');
    if (bookParam && HADITH_COLLECTIONS[bookParam]) {
        currentCollectionId = bookParam;
    }

    loadCollection(currentCollectionId);
});

// Render Book Selector Pills
function initBookPills() {
    booksPillsWrapper.innerHTML = '';
    Object.values(HADITH_COLLECTIONS).forEach(book => {
        const btn = document.createElement('button');
        btn.className = `book-pill-btn ${book.id === currentCollectionId ? 'active' : ''}`;
        btn.dataset.id = book.id;
        btn.innerHTML = `<i class="fa-solid ${book.icon}"></i> <span>${book.name}</span>`;
        btn.onclick = () => switchCollection(book.id);
        booksPillsWrapper.appendChild(btn);
    });
}

// Switch Collection
function switchCollection(collectionId) {
    if (currentCollectionId === collectionId) return;
    currentCollectionId = collectionId;

    // Update active pill & auto scroll into view
    document.querySelectorAll('.book-pill-btn').forEach(btn => {
        const isActive = btn.dataset.id === collectionId;
        btn.classList.toggle('active', isActive);
        if (isActive) {
            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    });

    // Reset controls
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    currentSectionId = 'all';
    currentPage = 1;

    // Load data
    loadCollection(collectionId);
}

// Load Hadith Collection
async function loadCollection(collectionId) {
    renderLoadingState();

    // For Nawawi, start immediately with built-in data so user never sees a blank page
    if (collectionId === 'ara-nawawi') {
        allHadiths = [...BUILTIN_NAWAWI];
        applyFiltersAndRender();
    }

    try {
        const data = await fetchHadithData(collectionId);
        if (data && data.hadiths && data.hadiths.length > 0) {
            allHadiths = data.hadiths;
            sectionsMetadata = (data.metadata && data.metadata.sections) ? data.metadata.sections : {};
            setupChapterDropdown(sectionsMetadata);
            applyFiltersAndRender();
        } else if (collectionId === 'ara-nawawi') {
            // Already showing built-in Nawawi
            setupChapterDropdown({});
            applyFiltersAndRender();
        } else {
            renderErrorState('لم يتم العثور على أحاديث لهذا الكتاب حالياً.');
        }
    } catch (err) {
        console.warn('Hadith fetch fallback triggered:', err);
        if (collectionId === 'ara-nawawi' && allHadiths.length > 0) {
            // Safe, already showing built-in
            setupChapterDropdown({});
            applyFiltersAndRender();
        } else {
            // Fallback for major collections: provide sample authentic hadiths
            allHadiths = [...BUILTIN_NAWAWI];
            setupChapterDropdown({});
            applyFiltersAndRender();
            showToast('تم تحميل الأحاديث المختارة (وضع بدون إنترنت)');
        }
    }
}

// Fetch helper with cache and fallback
async function fetchHadithData(collectionId) {
    const cacheKey = `hadith_collection_${collectionId}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch (e) {
            sessionStorage.removeItem(cacheKey);
        }
    }

    // Try jsDelivr then raw GitHub
    const urls = [
        `${API_BASE_JSDELIVR}/editions/${collectionId}.min.json`,
        `${API_BASE_JSDELIVR}/editions/${collectionId}.json`,
        `${API_BASE_RAW}/editions/${collectionId}.min.json`
    ];

    let lastError = null;
    for (const url of urls) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify(data));
                } catch (storageErr) {
                    // Ignore quota exceeded
                }
                return data;
            }
        } catch (err) {
            lastError = err;
        }
    }
    throw lastError || new Error('Network error loading collection');
}

// Setup Chapter / Book Section Dropdown
function setupChapterDropdown(sections) {
    chapterSelect.innerHTML = '<option value="all">📖 جميع الأبواب والأقسام</option>';
    const sectionEntries = Object.entries(sections).filter(([k, v]) => v && v.trim() !== '');

    if (sectionEntries.length > 0) {
        chapterSelect.parentElement.style.display = 'block';
        sectionEntries.forEach(([secId, secName]) => {
            const opt = document.createElement('option');
            opt.value = secId;
            opt.textContent = `${secId}. ${secName}`;
            chapterSelect.appendChild(opt);
        });
    } else {
        chapterSelect.parentElement.style.display = 'none';
    }
}

// Arabic Text Normalization for accurate searching
function normalizeArabic(text) {
    if (!text) return '';
    return text
        .replace(/[\u064B-\u065F\u0670]/g, '') // Remove tashkeel & diacritics
        .replace(/[إأآا]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/[ىي]/g, 'ي')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/[^\u0621-\u064A0-9\s]/g, ' ') // Clean punctuation
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

// Filter and Render
function applyFiltersAndRender() {
    const query = normalizeArabic(searchInput.value);
    const selectedSec = chapterSelect.value;

    filteredHadiths = allHadiths.filter(hadith => {
        // Section filter
        if (selectedSec !== 'all') {
            const hBook = hadith.reference ? hadith.reference.book : hadith.chapterId;
            if (String(hBook) !== String(selectedSec)) {
                return false;
            }
        }

        // Search query filter
        if (query) {
            const normText = normalizeArabic(hadith.text);
            const normChapter = normalizeArabic(hadith.chapter || (sectionsMetadata && sectionsMetadata[hadith.reference?.book] ? sectionsMetadata[hadith.reference.book] : ''));
            const hadithNum = String(hadith.hadithnumber || hadith.arabicnumber || '');
            return normText.includes(query) || normChapter.includes(query) || hadithNum === query;
        }

        return true;
    });

    // Reset page if out of bounds
    const maxPages = Math.ceil(filteredHadiths.length / PAGE_SIZE) || 1;
    if (currentPage > maxPages) currentPage = maxPages;
    if (currentPage < 1) currentPage = 1;

    renderHadithsPage();
    renderPagination();
    updateStats();
}

// Render Hadith Cards on Current Page
function renderHadithsPage() {
    hadithsList.innerHTML = '';

    if (filteredHadiths.length === 0) {
        hadithsList.innerHTML = `
            <div class="state-container">
                <i class="fa-solid fa-book-open-reader fa-3x"></i>
                <div class="state-title">لم يتم العثور على أحاديث</div>
                <div class="state-desc">جرب البحث بكلمات أخرى أو اختر قسماً آخر</div>
            </div>
        `;
        return;
    }

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filteredHadiths.slice(startIndex, startIndex + PAGE_SIZE);

    const currentBook = HADITH_COLLECTIONS[currentCollectionId];

    pageItems.forEach((hadith, index) => {
        const hadithNum = hadith.hadithnumber || hadith.arabicnumber || (startIndex + index + 1);
        let chapterName = hadith.chapter || (sectionsMetadata && hadith.reference?.book ? sectionsMetadata[hadith.reference.book] : '') || currentBook.name;
        if (/^[A-Za-z0-9\s\-_.']+$/.test(chapterName.trim())) {
            chapterName = currentBook.name;
        }
        const gradeText = hadith.grade || (hadith.grades && hadith.grades.length > 0 ? hadith.grades[0].grade : 'صحيح');
        
        // Clean Hadith text
        const rawText = hadith.text || '';
        
        const card = document.createElement('div');
        card.className = 'hadith-card';
        card.innerHTML = `
            <div class="hadith-card-header">
                <div class="hadith-badge">
                    <i class="fa-solid fa-book-bookmark"></i>
                    <span>حديث رقم #${hadithNum}</span>
                    ${chapterName ? `<span class="hadith-chapter-badge">• ${escapeHTML(chapterName)}</span>` : ''}
                </div>
                <div class="hadith-actions">
                    <button class="card-action-btn" onclick="copyHadith(this, ${hadithNum})" title="نسخ نص الحديث">
                        <i class="fa-regular fa-copy"></i> نسخ
                    </button>
                    <button class="card-action-btn" onclick="shareHadith(${hadithNum})" title="مشاركة الحديث">
                        <i class="fa-solid fa-share-nodes"></i> مشاركة
                    </button>
                </div>
            </div>

            <div class="hadith-body" style="font-size: ${currentFontSize}px;">
                ${formatHadithText(rawText)}
            </div>

            <div class="hadith-card-footer">
                <div class="hadith-grade">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>درجة الحديث: ${escapeHTML(gradeText)}</span>
                </div>
                <div class="hadith-ref">
                    <i class="fa-solid fa-book"></i>
                    <span>المصدر: ${currentBook.name}</span>
                </div>
            </div>
        `;

        hadithsList.appendChild(card);
    });

    // Scroll smoothly to top of hadith container on page transition
    if (currentPage > 1) {
        const topElement = document.querySelector('.meta-bar');
        if (topElement) {
            topElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Format Hadith text with quotes and clean paragraphs
function formatHadithText(text) {
    if (!text) return '';
    let formatted = escapeHTML(text);

    // Highlight Prophet's words inside quotes if present
    formatted = formatted.replace(/«([^»]+)»/g, '<span style="color: var(--gold); font-weight: bold;">«$1»</span>');

    return formatted;
}

// Render Navigation & Pagination Controls
function renderPagination() {
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(filteredHadiths.length / PAGE_SIZE) || 1;

    if (totalPages <= 1) {
        paginationControls.style.display = 'none';
        return;
    }
    paginationControls.style.display = 'flex';

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.disabled = (currentPage === 1);
    prevBtn.innerHTML = `<i class="fa-solid fa-chevron-right"></i> السابق`;
    prevBtn.onclick = () => goToPage(currentPage - 1);
    paginationControls.appendChild(prevBtn);

    // Page Number Buttons with smart ellipsis
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage < maxVisibleButtons - 1) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    if (startPage > 1) {
        paginationControls.appendChild(createPageBtn(1));
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.color = 'var(--text-muted)';
            ellipsis.style.padding = '0 6px';
            paginationControls.appendChild(ellipsis);
        }
    }

    for (let p = startPage; p <= endPage; p++) {
        paginationControls.appendChild(createPageBtn(p));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.color = 'var(--text-muted)';
            ellipsis.style.padding = '0 6px';
            paginationControls.appendChild(ellipsis);
        }
        paginationControls.appendChild(createPageBtn(totalPages));
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.disabled = (currentPage === totalPages);
    nextBtn.innerHTML = `التالي <i class="fa-solid fa-chevron-left"></i>`;
    nextBtn.onclick = () => goToPage(currentPage + 1);
    paginationControls.appendChild(nextBtn);

    // Update Jump input max
    jumpInput.max = totalPages;
    jumpInput.placeholder = `1-${totalPages}`;
}

function createPageBtn(pageNumber) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${pageNumber === currentPage ? 'active' : ''}`;
    btn.textContent = pageNumber;
    btn.onclick = () => goToPage(pageNumber);
    return btn;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredHadiths.length / PAGE_SIZE) || 1;
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderHadithsPage();
    renderPagination();
    updateStats();
}

// Update stats bar
function updateStats() {
    const total = filteredHadiths.length;
    totalHadithsCount.textContent = total.toLocaleString('ar-EG');

    const startIndex = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const endIndex = Math.min(currentPage * PAGE_SIZE, total);
    currentRangeText.textContent = total === 0 ? '0' : `الأحاديث من ${startIndex} إلى ${endIndex}`;
}

// Font Size Handler
function initFontSize() {
    updateFontSizeDisplay();
    btnIncreaseFont.onclick = () => {
        if (currentFontSize < 34) {
            currentFontSize += 2;
            saveAndApplyFontSize();
        }
    };
    btnDecreaseFont.onclick = () => {
        if (currentFontSize > 16) {
            currentFontSize -= 2;
            saveAndApplyFontSize();
        }
    };
}

function saveAndApplyFontSize() {
    localStorage.setItem('hadith_font_size', currentFontSize);
    document.querySelectorAll('.hadith-body').forEach(el => {
        el.style.fontSize = `${currentFontSize}px`;
    });
    updateFontSizeDisplay();
}

function updateFontSizeDisplay() {
    const display = document.getElementById('current-font-display');
    if (display) display.textContent = `${currentFontSize}px`;
}

// Copy Hadith
window.copyHadith = function(button, hadithNum) {
    const hadith = allHadiths.find(h => (h.hadithnumber || h.arabicnumber) === hadithNum);
    if (!hadith) return;

    const book = HADITH_COLLECTIONS[currentCollectionId];
    const textToCopy = `${hadith.text}\n\n[المصدر: ${book.name} - حديث رقم #${hadithNum}]`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        button.classList.add('copied');
        button.innerHTML = `<i class="fa-solid fa-check"></i> تم النسخ`;
        showToast('تم نسخ الحديث الشريف إلى الحافظة');
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = `<i class="fa-regular fa-copy"></i> نسخ`;
        }, 2000);
    }).catch(() => {
        showToast('تعذر النسخ التلقائي');
    });
};

// Share Hadith
window.shareHadith = function(hadithNum) {
    const hadith = allHadiths.find(h => (h.hadithnumber || h.arabicnumber) === hadithNum);
    if (!hadith) return;

    const book = HADITH_COLLECTIONS[currentCollectionId];
    const shareData = {
        title: `حديث شريف من ${book.name}`,
        text: `${hadith.text}\n\n[المصدر: ${book.name} - حديث #${hadithNum}]\nعبر تطبيق قبلة المسلم`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(() => {});
    } else {
        copyHadith(document.activeElement, hadithNum);
    }
};

// Toast notification
function showToast(text) {
    toastMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${escapeHTML(text)}</span>`;
    toastMsg.classList.add('show');
    setTimeout(() => {
        toastMsg.classList.remove('show');
    }, 2500);
}

// UI States
function renderLoadingState() {
    hadithsList.innerHTML = `
        <div class="state-container">
            <i class="fa-solid fa-spinner fa-spin fa-3x"></i>
            <div class="state-title">جاري تحميل الأحاديث النبوية...</div>
            <div class="state-desc">يتم الآن جلب الأحاديث الشريفة بأعلى سرعة</div>
        </div>
    `;
    paginationControls.style.display = 'none';
}

function renderErrorState(msg) {
    hadithsList.innerHTML = `
        <div class="state-container">
            <i class="fa-solid fa-triangle-exclamation fa-3x"></i>
            <div class="state-title">حدث خطأ أثناء تحميل الأحاديث</div>
            <div class="state-desc">${escapeHTML(msg)}</div>
            <button class="retry-btn" onclick="loadCollection('${currentCollectionId}')">
                <i class="fa-solid fa-rotate-right"></i> إعادة المحاولة
            </button>
        </div>
    `;
    paginationControls.style.display = 'none';
}

// Events
function initEvents() {
    // Pills scroll arrows
    const pillsScrollLeft = document.getElementById('pills-scroll-left');
    const pillsScrollRight = document.getElementById('pills-scroll-right');
    if (pillsScrollLeft && pillsScrollRight && booksPillsWrapper) {
        pillsScrollLeft.addEventListener('click', () => {
            // In RTL browsers, scrolling to see next books on the left:
            booksPillsWrapper.scrollBy({ left: -180, behavior: 'smooth' });
        });
        pillsScrollRight.addEventListener('click', () => {
            // Scrolling back towards the right:
            booksPillsWrapper.scrollBy({ left: 180, behavior: 'smooth' });
        });
    }

    // Search input with debounce
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        clearSearchBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
        debounceTimer = setTimeout(() => {
            currentPage = 1;
            applyFiltersAndRender();
        }, 250);
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        currentPage = 1;
        applyFiltersAndRender();
    });

    // Chapter select
    chapterSelect.addEventListener('change', () => {
        currentPage = 1;
        applyFiltersAndRender();
    });

    // Jump to page
    jumpBtn.addEventListener('click', handleJump);
    jumpInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleJump();
    });
}

function handleJump() {
    const val = parseInt(jumpInput.value.trim(), 10);
    const totalPages = Math.ceil(filteredHadiths.length / PAGE_SIZE) || 1;
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
        goToPage(val);
        jumpInput.value = '';
    } else {
        showToast(`يرجى إدخال رقم صفحة بين 1 و ${totalPages}`);
    }
}

// Utility: Escape HTML
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
