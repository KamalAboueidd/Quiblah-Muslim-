// toast.js

// 1. Inject CSS
const toastCSS = `
<style>
    /* --- Luxury Golden Islamic Scrollbar (Global) --- */
    html, body, * {
        scrollbar-width: thin;
        scrollbar-color: #C5A859 rgba(12, 16, 23, 0.75);
    }

    ::-webkit-scrollbar {
        width: 7px;
        height: 7px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(12, 16, 23, 0.65);
        border-radius: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #dfc26e 0%, #C5A859 50%, #9a7d30 100%);
        border-radius: 8px;
        border: 1.5px solid rgba(12, 16, 23, 0.7);
        box-shadow: 0 0 6px rgba(197, 168, 89, 0.35);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #f3de96 0%, #dfc26e 50%, #C5A859 100%);
        box-shadow: 0 0 10px rgba(197, 168, 89, 0.6);
    }

    ::-webkit-scrollbar-button {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }

    #global-toast-container {
        position: fixed;
        top: 25px;
        right: 25px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
        align-items: flex-end;
    }

    .app-toast {
        background: rgba(15, 15, 15, 0.95);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--gold, #C5A859);
        color: var(--white, #fff);
        padding: 9px 22px;
        border-radius: 10px;
        font-family: "Tajawal", sans-serif;
        font-size: 15px;
        font-weight: 700;
        line-height: 1.4;
        text-align: center;
        box-shadow: 0 8px 25px rgba(0,0,0,0.5), 0 0 12px rgba(197, 168, 89, 0.2);
        opacity: 0;
        transform: translateX(30px);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 10px;
        direction: rtl;
        max-width: 90vw;
        width: max-content;
        word-wrap: break-word;
    }

    @media (max-width: 600px) {
        #global-toast-container {
            top: 15px;
            right: 15px;
            left: 15px;
        }
        .app-toast {
            font-size: 13px;
            padding: 8px 14px;
            gap: 8px;
            width: max-content;
            max-width: 100%;
        }
        .app-toast i {
            font-size: 15px;
        }
    }

    .app-toast.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .app-toast i {
        color: var(--gold, #C5A859);
        font-size: 18px;
    }
</style>
`;
document.head.insertAdjacentHTML('beforeend', toastCSS);

(function() {
    // If inside an iframe, delegate to the parent shell's showToast and never run duplicate intervals
    if (window.parent && window.parent !== window) {
        window.showToast = function(message, iconClass = "fa-solid fa-bell", duration = 5000) {
            try {
                if (typeof window.parent.showToast === 'function') {
                    window.parent.showToast(message, iconClass, duration);
                    return;
                }
            } catch(e) {}
            localShowToast(message, iconClass, duration);
        };
        // Child frames should NEVER run the random dhikr interval or create duplicate toast containers
        return;
    }

    // 2. Inject Container in the top window
    let toastContainer = document.getElementById('global-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'global-toast-container';
        document.body.appendChild(toastContainer);
    }

    let activeToastTimeout = null;

    function dismissExistingToasts() {
        if (activeToastTimeout) {
            clearTimeout(activeToastTimeout);
            activeToastTimeout = null;
        }
        if (!toastContainer) return;
        const existing = toastContainer.querySelectorAll('.app-toast');
        existing.forEach(t => {
            t.classList.remove('show');
            t.style.opacity = '0';
            t.style.pointerEvents = 'none';
            setTimeout(() => {
                if (t.parentElement) t.remove();
            }, 300);
        });
    }

    // 3. Global showToast function (Strict single-toast queue: never overlap)
    function localShowToast(message, iconClass = "fa-solid fa-bell", duration = 5000) {
        if (!toastContainer) {
            toastContainer = document.getElementById('global-toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'global-toast-container';
                document.body.appendChild(toastContainer);
            }
        }

        // Smoothly dismiss any currently visible toast so they never stack on top of each other
        dismissExistingToasts();

        const cleanMessage = String(message || '').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{200D}\u{FE0F}]/gu, '').trim();

        const toast = document.createElement('div');
        toast.className = 'app-toast';
        toast.innerHTML = `<i class="${iconClass}"></i> <span>${cleanMessage}</span>`;
        toastContainer.appendChild(toast);

        // Trigger reflow for smooth slide-in animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 15);

        // Remove after duration
        activeToastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, 400);
        }, duration);
    }

    window.showToast = localShowToast;

    // 4. Random Azkar Logic (Only in top window, strictly avoids collision)
    let shortAzkarList = [];
    function fetchShortAzkar() {
        if (typeof axios !== 'undefined') {
            axios.get('short_azkar.json')
                .then(res => { shortAzkarList = res.data; })
                .catch(err => console.error("Error loading short azkar", err));
        } else {
            fetch('short_azkar.json')
                .then(res => res.json())
                .then(data => { shortAzkarList = data; })
                .catch(err => console.error("Error loading short azkar", err));
        }
    }

    function showRandomZikr() {
        // Never trigger if another toast is currently on screen
        if (toastContainer && toastContainer.querySelector('.app-toast.show')) {
            return;
        }
        if (shortAzkarList && shortAzkarList.length > 0) {
            const randomIndex = Math.floor(Math.random() * shortAzkarList.length);
            const zikr = shortAzkarList[randomIndex];
            localShowToast(zikr, "fa-solid fa-leaf", 7000);
        }
    }

    // Initialize only in top-level window
    fetchShortAzkar();
    // 1 minute interval for random zikr in top window
    setInterval(showRandomZikr, 60000);
})();
