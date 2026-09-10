/**
 * Visitor Counter for Quiblah Muslim
 * Developed by Kamal Abou Eid
 * Clean, lightweight, session-aware visitor counter with fallback and local caching.
 */
(function () {
    const STORAGE_KEY = 'qm_visitor_count';
    const SESSION_KEY = 'qm_visited_session';
    const BASE_OFFSET = 3280; // Baseline visits
    const API_HIT = 'https://countapi.mileshilliard.com/api/v1/hit/quiblah-muslim-visitors';
    const API_GET = 'https://countapi.mileshilliard.com/api/v1/get/quiblah-muslim-visitors';
    const FALLBACK_HIT = 'https://abacus.jasoncameron.dev/hit/quiblah-muslim/views';
    const FALLBACK_GET = 'https://abacus.jasoncameron.dev/get/quiblah-muslim/views';

    function initVisitorCounter() {
        const countElements = document.querySelectorAll('.visitor-count, #visitor-count');
        if (!countElements.length) return;

        // 1. Immediately display cached or baseline count
        let cached = localStorage.getItem(STORAGE_KEY);
        let initialNum = cached ? parseInt(cached, 10) : BASE_OFFSET;
        updateDisplay(initialNum);

        // 2. Check if already counted in this browser session
        let hasVisited = false;
        try {
            hasVisited = !!sessionStorage.getItem(SESSION_KEY);
        } catch (e) {
            hasVisited = false;
        }

        const primaryUrl = hasVisited ? API_GET : API_HIT;
        const fallbackUrl = hasVisited ? FALLBACK_GET : FALLBACK_HIT;

        fetchWithTimeout(primaryUrl, 3500)
            .then(res => {
                if (!res.ok) throw new Error('Primary counter error ' + res.status);
                return res.json();
            })
            .then(data => {
                const val = (data && typeof data.value === 'number') ? data.value : 1;
                handleSuccess(val);
            })
            .catch(() => {
                // Attempt fallback API
                return fetchWithTimeout(fallbackUrl, 3500)
                    .then(res => {
                        if (!res.ok) throw new Error('Fallback counter error ' + res.status);
                        return res.json();
                    })
                    .then(data => {
                        const val = (data && typeof data.value === 'number') ? data.value : 1;
                        handleSuccess(val);
                    })
                    .catch(() => {
                        // Offline or network error: advance local count if new session
                        if (!hasVisited) {
                            try {
                                sessionStorage.setItem(SESSION_KEY, '1');
                            } catch (e) {}
                            const nextCount = initialNum + 1;
                            try {
                                localStorage.setItem(STORAGE_KEY, nextCount);
                            } catch (e) {}
                            animateCount(initialNum, nextCount);
                        }
                    });
            });

        function handleSuccess(apiValue) {
            try {
                sessionStorage.setItem(SESSION_KEY, '1');
            } catch (e) {}
            const total = BASE_OFFSET + apiValue;
            try {
                localStorage.setItem(STORAGE_KEY, total);
            } catch (e) {}
            if (total !== initialNum) {
                animateCount(initialNum, total);
            } else {
                updateDisplay(total);
            }
        }

        function updateDisplay(num) {
            const formatted = Number(num).toLocaleString('en-US');
            countElements.forEach(el => {
                el.textContent = formatted;
            });
        }

        function animateCount(from, to) {
            if (from === to) {
                updateDisplay(to);
                return;
            }
            const duration = 800; // ms
            const start = performance.now();
            function step(timestamp) {
                const progress = Math.min((timestamp - start) / duration, 1);
                const current = Math.floor(from + (to - from) * progress);
                updateDisplay(current);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    updateDisplay(to);
                }
            }
            requestAnimationFrame(step);
        }

        function fetchWithTimeout(resource, timeout = 3500) {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            return fetch(resource, {
                signal: controller.signal
            }).finally(() => clearTimeout(id));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVisitorCounter);
    } else {
        initVisitorCounter();
    }
})();
