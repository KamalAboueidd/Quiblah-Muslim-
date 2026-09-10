// player-bridge.js - قبلة المسلم: جسر مشغل القرآن المستمر والتكامل عبر الصفحات
(function() {
    // If opened directly in browser window (outside shell), redirect to shell index.html so audio stays persistent
    try {
        if (window === window.top && !window.location.search.includes('no_shell=1')) {
            const pageName = window.location.pathname.split('/').pop() || 'home.html';
            if (pageName !== 'index.html') {
                const target = pageName + window.location.search;
                window.location.replace('index.html?page=' + encodeURIComponent(target));
                return;
            }
        }
    } catch(e) {
        console.warn("Shell redirect check:", e);
    }

    // Inform parent of current page
    try {
        if (window.parent && window.parent !== window) {
            const pagePath = window.location.pathname.split('/').pop() + window.location.search;
            window.parent.postMessage({
                type: 'PAGE_NAVIGATED',
                title: document.title,
                page: pagePath
            }, '*');
        }
    } catch(e) {}

    // Call the global player in parent shell using postMessage for zero-error cross-frame safety
    window.playGlobalQuran = function(options) {
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: 'PLAY_QURAN',
                    options: options
                }, '*');
                return;
            }
            // If parent is directly accessible
            if (window.parent && typeof window.parent.playGlobalQuran === 'function') {
                window.parent.playGlobalQuran(options);
            }
        } catch(e) {
            console.error("Error triggering global audio:", e);
        }
    };

    // Global Surah Play trigger for Quran and Tafseer pages
    window.playSurahGlobalAudio = function(surahNumber, surahName) {
        const numStr = String(surahNumber).padStart(3, '0');
        const audioUrl = `https://server8.mp3quran.net/afs/${numStr}.mp3`;
        window.playGlobalQuran({
            surahNum: surahNumber,
            surahName: surahName || `سورة رقم ${surahNumber}`,
            reciterName: 'مشاري العفاسي',
            audioUrl: audioUrl,
            reciterImg: 'https://tvquran.com/uploads/authors/images/%D9%85%D8%B4%D8%A7%D8%B1%D9%8A%20%D8%A7%D9%84%D8%B9%D9%81%D8%A7%D8%B3%D9%8A.jpg'
        });
        if (window.showToast) {
            window.showToast(`بدأ تشغيل ${surahName || 'السورة'} بصوت مشاري العفاسي`, 'fa-solid fa-headphones', 4000);
        }
    };
})();
