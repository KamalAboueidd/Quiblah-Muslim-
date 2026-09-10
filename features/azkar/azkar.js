// features/azkar/azkar.js - منطق وبرمجة صفحة azkar.html
// Header Carousel Logic
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;
setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}, 8000);

// State
let allAzkar = [];
let groupedAzkar = {};
let activeCategoryAzkar = [];
let completedCount = 0;

// Batch & Infinite Scroll Settings
const BATCH_SIZE = 10;
let currentRenderedCount = 0;
let infiniteScrollObserver = null;

// Elements
const categoriesView = document.getElementById('categories-view');
const readerView = document.getElementById('reader-view');
const categoriesGrid = document.getElementById('categories-grid');
const searchInput = document.getElementById('search-input');
const readerList = document.getElementById('azkar-reader-list');
const readerTitle = document.getElementById('reader-title');
const progressBar = document.getElementById('progress-bar');

// Fetch & Group
function fetchAzkar() {
    axios.get('azkar.json')
        .then(response => {
            allAzkar = response.data;
            groupAzkar(allAzkar);
            
            const urlParams = new URLSearchParams(window.location.search);
            const mode = urlParams.get('m');
            
            let categoriesToShow = Object.keys(groupedAzkar);
            if (mode === 'sm') {
                categoriesToShow = ['أذكار الصباح', 'أذكار المساء'];
                const searchBox = document.querySelector('.search-container');
                if (searchBox) searchBox.style.display = 'none';
                const navSm = document.querySelector('.nav-item[href="azkar.html?m=sm"]');
                if (navSm) navSm.classList.add('active');
            } else {
                categoriesToShow = categoriesToShow.filter(cat => cat !== 'أذكار الصباح' && cat !== 'أذكار المساء');
                const navAz = document.querySelector('.nav-item[href="azkar.html"]');
                if (navAz) navAz.classList.add('active');
            }
            
            renderCategories(categoriesToShow);
        })
        .catch(error => {
            categoriesGrid.innerHTML = `<div class="empty-state">حدث خطأ أثناء تحميل الأذكار.</div>`;
            console.error("Error fetching Azkar:", error);
        });
}

function groupAzkar(azkarArray) {
    groupedAzkar = {};
    azkarArray.forEach(zikr => {
        const cat = zikr.category || "أخرى";
        if (!groupedAzkar[cat]) {
            groupedAzkar[cat] = [];
        }
        zikr.targetCount = parseInt(zikr.count) || 1;
        zikr.currentCount = zikr.targetCount;
        groupedAzkar[cat].push(zikr);
    });
}

// Render Categories
function renderCategories(categoryNames) {
    const gridContainer = document.getElementById('categories-grid');
    if (!gridContainer) return;
    if (categoryNames.length === 0) {
        gridContainer.innerHTML = `<div class="empty-state"><i aria-hidden="true" class="fa-solid fa-box-open fa-2x" style="margin-bottom: 15px;"></i><br/>لا توجد أقسام مطابقة للبحث</div>`;
        return;
    }

    // Sort so Morning & Evening are first
    categoryNames.sort((a, b) => {
        if (a.includes("الصباح")) return -1;
        if (b.includes("الصباح")) return 1;
        if (a.includes("المساء")) return -1;
        if (b.includes("المساء")) return 1;
        return 0;
    });

    let html = '';
    categoryNames.forEach(cat => {
        let icon = "fa-star";
        if (cat.includes("الصباح")) icon = "fa-sun";
        else if (cat.includes("المساء")) icon = "fa-moon";
        else if (cat.includes("النوم")) icon = "fa-bed";
        else if (cat.includes("الصلاة")) icon = "fa-person-praying";
        else if (cat.includes("الوضوء")) icon = "fa-hands-bubbles";
        else if (cat.includes("المسجد")) icon = "fa-mosque";
        else if (cat.includes("المنزل")) icon = "fa-house";

        const itemsCount = groupedAzkar[cat] ? groupedAzkar[cat].length : 0;

        html += `
            <div class="category-card" onclick="openCategory('${cat}')">
                <i aria-hidden="true" class="fa-solid ${icon}"></i>
                <div>
                    <div class="cat-title">${cat}</div>
                    <div class="cat-count mt-2">${itemsCount} أذكار</div>
                </div>
            </div>
        `;
    });
    gridContainer.innerHTML = html;
}

// Search Filter
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        const allCats = Object.keys(groupedAzkar);
        const filtered = allCats.filter(cat => cat.toLowerCase().includes(query));
        renderCategories(filtered);
    });
}

// Navigation
window.showCategories = function() {
    if (infiniteScrollObserver) {
        infiniteScrollObserver.disconnect();
        infiniteScrollObserver = null;
    }
    const loadMoreSection = document.getElementById('azkar-load-more-section');
    if (loadMoreSection) loadMoreSection.innerHTML = '';
    readerView.classList.remove('active');
    categoriesView.classList.add('active');
    window.scrollTo(0, 0);
};

window.openCategory = function(categoryName) {
    activeCategoryAzkar = JSON.parse(JSON.stringify(groupedAzkar[categoryName] || [])); // Deep copy
    completedCount = 0;
    currentRenderedCount = 0;
    
    let icon = "fa-star";
    if (categoryName.includes("الصباح")) icon = "fa-sun";
    else if (categoryName.includes("المساء")) icon = "fa-moon";
    
    readerTitle.innerHTML = `<i aria-hidden="true" class="fa-solid ${icon}"></i> ${categoryName}`;
    updateProgress();
    
    readerList.innerHTML = '';
    renderNextBatch();
    
    categoriesView.classList.remove('active');
    readerView.classList.add('active');
    window.scrollTo(0, 0);
};

// Batch Rendering (10 at a time) & Infinite Scroll
window.renderNextBatch = function() {
    if (!activeCategoryAzkar || currentRenderedCount >= activeCategoryAzkar.length) return;

    const start = currentRenderedCount;
    const end = Math.min(start + BATCH_SIZE, activeCategoryAzkar.length);

    let html = '';
    for (let index = start; index < end; index++) {
        const zikr = activeCategoryAzkar[index];
        const isCompleted = zikr.currentCount <= 0;
        const completedClass = isCompleted ? 'completed' : '';
        const descHtml = zikr.description ? `<div class="zikr-desc">${zikr.description}</div>` : '';

        html += `
            <div class="zikr-card ${completedClass}" id="zikr-${index}">
                <div class="zikr-number">${index + 1}</div>
                <div class="zikr-text">${zikr.zekr}</div>
                ${descHtml}
                
                <div class="zikr-footer">
                    <div class="action-btns">
                        <button class="copy-btn" onclick="copyText('${(zikr.zekr || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}')">
                            <i aria-hidden="true" class="fa-regular fa-copy"></i> نسخ
                        </button>
                    </div>
                    
                    <div class="counter-container new-counter">
                        <button class="counter-btn-small" onclick="adjustCount(${index}, -1)" title="تراجع">
                            <i aria-hidden="true" class="fa-solid fa-minus"></i>
                        </button>
                        <div class="counter-text" id="counter-text-${index}">
                            تمت القراءة: ${zikr.targetCount - zikr.currentCount} / ${zikr.targetCount}
                        </div>
                        <button class="counter-btn-small plus" onclick="adjustCount(${index}, 1)" title="زيادة">
                            <i aria-hidden="true" class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    readerList.insertAdjacentHTML('beforeend', html);
    currentRenderedCount = end;

    updateLoadMoreSection();
};

function updateLoadMoreSection() {
    const loadMoreSection = document.getElementById('azkar-load-more-section');
    if (!loadMoreSection || !activeCategoryAzkar) return;

    if (infiniteScrollObserver) {
        infiniteScrollObserver.disconnect();
        infiniteScrollObserver = null;
    }

    const remaining = activeCategoryAzkar.length - currentRenderedCount;

    if (remaining > 0) {
        loadMoreSection.innerHTML = `
            <div class="azkar-load-more-container">
                <button id="azkar-load-more-btn" class="azkar-load-more-btn" onclick="renderNextBatch()">
                    <span>عرض المزيد من الأذكار</span>
                    <span class="remaining-badge">(متبقي ${remaining})</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
            </div>
        `;

        // Infinite Scroll: auto-load next batch when button comes into view
        const targetBtn = document.getElementById('azkar-load-more-btn');
        if (targetBtn && 'IntersectionObserver' in window) {
            infiniteScrollObserver = new IntersectionObserver((entries) => {
                if (entries[0] && entries[0].isIntersecting) {
                    renderNextBatch();
                }
            }, {
                root: null,
                rootMargin: '180px',
                threshold: 0.1
            });
            infiniteScrollObserver.observe(targetBtn);
        }
    } else {
        if (activeCategoryAzkar.length > BATCH_SIZE) {
            loadMoreSection.innerHTML = `
                <div class="azkar-end-indicator">
                    <span class="azkar-end-line"></span>
                    <span class="azkar-end-text">« تم إتمام عرض جميع أذكار هذا الباب بفضل الله »</span>
                    <span class="azkar-end-line"></span>
                </div>
            `;
        } else {
            loadMoreSection.innerHTML = '';
        }
    }
}

window.adjustCount = function(index, amount) {
    let zikr = activeCategoryAzkar[index];
    if (!zikr) return;
    
    let newCurrentCount = zikr.currentCount - amount;
    if (newCurrentCount < 0) newCurrentCount = 0;
    if (newCurrentCount > zikr.targetCount) newCurrentCount = zikr.targetCount;
    
    if (newCurrentCount === zikr.currentCount) return;
    
    let wasCompleted = (zikr.currentCount === 0);
    zikr.currentCount = newCurrentCount;
    let isCompleted = (zikr.currentCount === 0);
    
    const textEl = document.getElementById(`counter-text-${index}`);
    if (textEl) {
        textEl.innerHTML = `تمت القراءة: ${zikr.targetCount - zikr.currentCount} / ${zikr.targetCount}`;
    }
    
    const card = document.getElementById(`zikr-${index}`);
    if (isCompleted && !wasCompleted) {
        if (card) card.classList.add('completed');
        completedCount++;
        updateProgress();
        
        if (card) {
            card.style.transform = "scale(0.98)";
            setTimeout(() => card.style.transform = "scale(1)", 150);
        }
        
        // Auto-advance to next zikr (ensure next batch rendered if needed)
        if (index + 1 < activeCategoryAzkar.length) {
            if (index + 1 >= currentRenderedCount) {
                renderNextBatch();
            }
            setTimeout(() => {
                const nextCard = document.getElementById(`zikr-${index + 1}`);
                if (nextCard) nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    } else if (!isCompleted && wasCompleted) {
        if (card) card.classList.remove('completed');
        completedCount--;
        updateProgress();
    }
};

function updateProgress() {
    if (!progressBar || !activeCategoryAzkar || activeCategoryAzkar.length === 0) return;
    const percentage = (completedCount / activeCategoryAzkar.length) * 100;
    progressBar.style.width = `${percentage}%`;
}

window.copyText = function(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast("تم نسخ الذكر بنجاح!", "fa-solid fa-check");
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast("تم نسخ الذكر بنجاح!", "fa-solid fa-check");
    }
};

// Initialize
fetchAzkar();
