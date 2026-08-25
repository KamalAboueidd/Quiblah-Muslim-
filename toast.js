// toast.js

// 1. Inject CSS
const toastCSS = `
<style>
    #global-toast-container {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 15px;
        pointer-events: none;
    }

    .app-toast {
        background: rgba(15, 15, 15, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid var(--gold, #C5A859);
        color: var(--white, #fff);
        padding: 15px 30px;
        border-radius: 12px;
        font-family: "Tajawal", sans-serif;
        font-size: 18px;
        font-weight: 700;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(197, 168, 89, 0.2);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 12px;
        direction: rtl;
        max-width: 90vw;
        width: max-content;
        word-wrap: break-word;
    }

    @media (max-width: 600px) {
        .app-toast {
            font-size: 15px;
            padding: 12px 20px;
            gap: 10px;
            width: 85vw;
        }
        .app-toast i {
            font-size: 20px;
        }
    }

    .app-toast.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .app-toast i {
        color: var(--gold, #C5A859);
        font-size: 24px;
    }
</style>
`;
document.head.insertAdjacentHTML('beforeend', toastCSS);

// 2. Inject Container
const toastContainer = document.createElement('div');
toastContainer.id = 'global-toast-container';
document.body.appendChild(toastContainer);

// 3. Global showToast function
window.showToast = function(message, iconClass = "fa-solid fa-bell", duration = 6000) {
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    // Trigger reflow for animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 500);
    }, duration);
};

// 4. Random Azkar Logic (Every 10 minutes)
let shortAzkarList = [];
function fetchShortAzkar() {
    // We use Axios if available, else fetch
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
    if (shortAzkarList.length > 0) {
        const randomIndex = Math.floor(Math.random() * shortAzkarList.length);
        const zikr = shortAzkarList[randomIndex];
        window.showToast(zikr, "fa-solid fa-leaf", 8000); // Show for 8 seconds
    }
}

// Initialize
fetchShortAzkar();
// 3 minutes = 180000 ms
setInterval(showRandomZikr, 180000);
