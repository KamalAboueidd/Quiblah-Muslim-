// features/azkar/azkar.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© azkar.html
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
                        document.querySelector('.search-container').style.display = 'none'; // Hide search for SM
                        document.querySelector('.nav-item[href="azkar.html?m=sm"]').classList.add('active');
                    } else {
                        categoriesToShow = categoriesToShow.filter(cat => cat !== 'أذكار الصباح' && cat !== 'أذكار المساء');
                        document.querySelector('.nav-item[href="azkar.html"]').classList.add('active');
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
                if(!groupedAzkar[cat]) {
                    groupedAzkar[cat] = [];
                }
                // Convert count string to int securely
                zikr.targetCount = parseInt(zikr.count) || 1;
                zikr.currentCount = zikr.targetCount;
                groupedAzkar[cat].push(zikr);
            });
        }

        // Render Categories
        function renderCategories(categoryNames) {
            const gridContainer = document.getElementById('categories-grid');
            if (categoryNames.length === 0) {
                gridContainer.innerHTML = `<div class="empty-state"><i aria-hidden="true" class="fa-solid fa-box-open fa-2x" style="margin-bottom: 15px;"></i><br/>لا توجد أقسام مطابقة للبحث</div>`;
                return;
            }

            // Sort so Morning & Evening are first
            categoryNames.sort((a, b) => {
                if(a.includes("الصباح")) return -1;
                if(b.includes("الصباح")) return 1;
                if(a.includes("المساء")) return -1;
                if(b.includes("المساء")) return 1;
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
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            const allCats = Object.keys(groupedAzkar);
            const filtered = allCats.filter(cat => cat.toLowerCase().includes(query));
            renderCategories(filtered);
        });

        // Navigation
        window.showCategories = function() {
            readerView.classList.remove('active');
            categoriesView.classList.add('active');
            window.scrollTo(0, 0);
        }

        window.openCategory = function(categoryName) {
            activeCategoryAzkar = JSON.parse(JSON.stringify(groupedAzkar[categoryName])); // Deep copy to reset counts
            completedCount = 0;
            
            let icon = "fa-star";
            if (categoryName.includes("الصباح")) icon = "fa-sun";
            else if (categoryName.includes("المساء")) icon = "fa-moon";
            
            readerTitle.innerHTML = `<i aria-hidden="true" class="fa-solid ${icon}"></i> ${categoryName}`;
            updateProgress();
            
            renderReader();
            
            categoriesView.classList.remove('active');
            readerView.classList.add('active');
            window.scrollTo(0, 0);
        }

        // Reader View Rendering
        function renderReader() {
            let html = '';
            activeCategoryAzkar.forEach((zikr, index) => {
                const isCompleted = zikr.currentCount <= 0;
                const completedClass = isCompleted ? 'completed' : '';
                const btnContent = isCompleted ? '<i aria-hidden="true" class="fa-solid fa-check"></i>' : zikr.currentCount;
                const btnClass = isCompleted ? 'done' : '';
                
                const descHtml = zikr.description ? `<div class="zikr-desc">${zikr.description}</div>` : '';

                html += `
                    <div class="zikr-card ${completedClass}" id="zikr-${index}">
                        <div class="zikr-number">${index + 1}</div>
                        <div class="zikr-text">${zikr.zekr}</div>
                        ${descHtml}
                        
                        <div class="zikr-footer">
                            <div class="action-btns">
                                <button class="copy-btn" onclick="copyText('${zikr.zekr.replace(/'/g, "\\'").replace(/\n/g, ' ')}')">
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
            });
            readerList.innerHTML = html;
        }

        window.adjustCount = function(index, amount) {
            let zikr = activeCategoryAzkar[index];
            
            let newCurrentCount = zikr.currentCount - amount;
            if (newCurrentCount < 0) newCurrentCount = 0;
            if (newCurrentCount > zikr.targetCount) newCurrentCount = zikr.targetCount;
            
            if (newCurrentCount === zikr.currentCount) return; // No change
            
            let wasCompleted = (zikr.currentCount === 0);
            zikr.currentCount = newCurrentCount;
            let isCompleted = (zikr.currentCount === 0);
            
            const textEl = document.getElementById(`counter-text-${index}`);
            if (textEl) {
                textEl.innerHTML = `تمت القراءة: ${zikr.targetCount - zikr.currentCount} / ${zikr.targetCount}`;
            }
            
            const card = document.getElementById(`zikr-${index}`);
            if (isCompleted && !wasCompleted) {
                card.classList.add('completed');
                completedCount++;
                updateProgress();
                
                // Add pop animation to the card to signify completion
                card.style.transform = "scale(0.98)";
                setTimeout(() => card.style.transform = "scale(1)", 150);
                
                // Optional: scroll to next uncompleted zikr
                if (index + 1 < activeCategoryAzkar.length) {
                    setTimeout(() => {
                        document.getElementById(`zikr-${index + 1}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 500);
                }
            } else if (!isCompleted && wasCompleted) {
                card.classList.remove('completed');
                completedCount--;
                updateProgress();
            }
        }

        function updateProgress() {
            if (activeCategoryAzkar.length === 0) return;
            const percentage = (completedCount / activeCategoryAzkar.length) * 100;
            progressBar.style.width = `${percentage}%`;
        }

        window.copyText = function(text) {
            navigator.clipboard.writeText(text).then(() => {
                showToast("تم نسخ الذكر بنجاح!", "fa-solid fa-check");
            });
        }

        // Initialize
        fetchAzkar();
