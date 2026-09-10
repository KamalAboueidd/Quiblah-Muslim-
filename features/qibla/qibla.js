// features/qibla/qibla.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© qibla.html
// ── Carousel ──────────────────────────────────────
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 8000);

        // ── Math Helpers ──────────────────────────────────
        const rad = d => d * Math.PI / 180;
        const deg = r => r * 180 / Math.PI;
        const norm360 = a => ((a % 360) + 360) % 360;

        // ── State Variables ───────────────────────────────
        let userLat = null;
        let userLng = null;
        let qiblaAngle = null;

        let targetHeading = null;    // Real-time heading from sensors (0-360)
        let currentHeading = null;   // Interpolated heading for silky-smooth 60fps rendering
        let hasAbsoluteSensor = false;
        let isAligned = false;
        let lastAlignedAt = 0;
        let rafId = null;

        // ── Great-Circle Qibla Calculation ────────────────
        function computeQiblaAngle(lat, lng) {
            const kaabaLat = rad(21.422487);
            const kaabaLng = rad(39.826206);
            const uLat = rad(lat);
            const uLng = rad(lng);

            const deltaLng = kaabaLng - uLng;
            const y = Math.sin(deltaLng);
            const x = Math.cos(uLat) * Math.tan(kaabaLat) - Math.sin(uLat) * Math.cos(deltaLng);
            let qAngle = deg(Math.atan2(y, x));
            return norm360(Math.round(qAngle));
        }

        // ── Orientation Processor ─────────────────────────
        function updateHeadingFromEvent(e) {
            // 1. iOS Safari: webkitCompassHeading directly provides True North bearing of the top edge
            if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading) && e.webkitCompassHeading >= 0) {
                hasAbsoluteSensor = true;
                setHeading(e.webkitCompassHeading);
                return;
            }

            // 2. Android Chrome: deviceorientationabsolute or e.absolute === true
            const isAbsolute = e.type === 'deviceorientationabsolute' || e.absolute === true;
            if (e.alpha !== null && !isNaN(e.alpha)) {
                if (isAbsolute) {
                    hasAbsoluteSensor = true;
                } else if (hasAbsoluteSensor) {
                    // Ignore relative events once absolute has arrived
                    return;
                }

                const screenAngle = (window.screen && window.screen.orientation && window.screen.orientation.angle) || 0;
                // In Android, alpha is counter-clockwise around Z. When flat, heading from North is (360 - alpha + screenAngle)
                const heading = norm360(360 - e.alpha + screenAngle);
                setHeading(heading);
            }
        }

        function setHeading(h) {
            targetHeading = norm360(h);
            if (currentHeading === null) {
                currentHeading = targetHeading;
            }
        }

        // ── Silky Smooth 60FPS Render Loop ────────────────
        function renderLoop() {
            rafId = requestAnimationFrame(renderLoop);

            if (targetHeading !== null && currentHeading !== null) {
                // Shortest angular distance [-180, +180]
                let diff = ((targetHeading - currentHeading + 540) % 360) - 180;

                // Adaptive interpolation: follows quick turns immediately, stabilizes cleanly when resting
                if (Math.abs(diff) > 0.1) {
                    const factor = Math.abs(diff) > 30 ? 0.35 : (Math.abs(diff) > 10 ? 0.22 : 0.12);
                    currentHeading = norm360(currentHeading + diff * factor);
                }
            }

            if (qiblaAngle == null) return;

            const h = currentHeading !== null ? currentHeading : 0;

            // 1. Rotate the compass background so North points to True North
            const compassBg = document.getElementById('compass-bg');
            if (compassBg) {
                compassBg.style.transform = `rotate(${-h}deg)`;
            }

            // 2. Rotate the arrow so it points directly at Qibla relative to the top of the phone
            // When the top of the phone faces Qibla (h == qiblaAngle), arrowRotation == 0 (straight UP towards ▼)
            const arrowRotation = norm360(qiblaAngle - h);
            const compassArrow = document.getElementById('compass-arrow');
            if (compassArrow) {
                compassArrow.style.transform = `rotate(${arrowRotation}deg)`;
            }

            // 3. Keep the Kaaba icon upright
            const kaabaTip = document.getElementById('kaaba-tip');
            if (kaabaTip) {
                kaabaTip.style.transform = `translateX(-50%) rotate(${-arrowRotation}deg)`;
            }

            // 4. Center display shows Qibla angle from True North
            updateAngleDisplay(qiblaAngle);

            // 5. Alignment check (within ±4° of Qibla)
            let angleToQibla = Math.abs(((h - qiblaAngle + 540) % 360) - 180);
            const nowAligned = currentHeading !== null && angleToQibla <= 4;

            if (nowAligned !== isAligned) {
                isAligned = nowAligned;
                const ring = document.getElementById('compass-ring');
                if (ring) ring.classList.toggle('aligned', nowAligned);

                const msg = document.getElementById('aligned-msg');
                if (msg) msg.classList.toggle('show', nowAligned);

                if (nowAligned && navigator.vibrate && Date.now() - lastAlignedAt > 3000) {
                    try { navigator.vibrate([70, 40, 70]); } catch(e) {}
                    lastAlignedAt = Date.now();
                }
            }
        }

        function updateAngleDisplay(angle) {
            const el = document.getElementById('angle-display');
            if (el) el.textContent = Math.round(angle) + '°';
        }

        // ── Show compass UI ───────────────────────────────
        function showCompass() {
            document.getElementById('compass-arrow').style.opacity = '1';
            document.getElementById('kaaba-tip').classList.add('show');
            document.getElementById('gps-loading-text').style.display = 'none';
            document.getElementById('angle-label').textContent = 'اتجاه القبلة من الشمال الحقيقي';
            document.getElementById('calibrate-hint').style.display = 'block';
        }

        function showCompassShell() {
            document.getElementById('compass-scene').style.opacity = '1';
            document.getElementById('loader').style.display = 'none';
        }

        // ── Start sensors ─────────────────────────────────
        function startSensors() {
            if (window.DeviceOrientationEvent) {
                // Listen for absolute first (Android Chrome)
                window.addEventListener('deviceorientationabsolute', updateHeadingFromEvent, true);
                // Listen for standard (iOS Safari webkitCompassHeading)
                window.addEventListener('deviceorientation', updateHeadingFromEvent, true);
            }
            if (!rafId) renderLoop();
        }

        // iOS 13+ permission request
        function requestSensorPermission() {
            document.getElementById('perm-btn').style.display = 'none';
            if (typeof DeviceOrientationEvent !== 'undefined' &&
                typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(state => {
                    if (state === 'granted') {
                        startSensors();
                    } else {
                        showToast('يرجى السماح بالوصول لمستشعرات الحركة لتحديد اتجاه القبلة', 'fa-solid fa-triangle-exclamation');
                    }
                }).catch(err => {
                    console.error("Sensor permission error:", err);
                    startSensors();
                });
            } else {
                startSensors();
            }
        }

        function applyQiblaData(lat, lng, cityName = '') {
            userLat = lat;
            userLng = lng;
            qiblaAngle = computeQiblaAngle(lat, lng);

            document.getElementById('status-row').style.display = 'flex';
            document.getElementById('status-text').textContent = `القبلة ${Math.round(qiblaAngle)}° من الشمال`;
            if (cityName) {
                document.getElementById('city-name').textContent = cityName;
            }

            updateAngleDisplay(qiblaAngle);
            showCompass();

            if (!rafId) renderLoop();
        }

        // ── Geolocation (High Accuracy with LocalStorage Cache) ─────
        function startGeolocationFlow() {
            // Instant load from cache if available
            const cachedLat = localStorage.getItem('quiblah_user_lat');
            const cachedLng = localStorage.getItem('quiblah_user_lng');
            const cachedCity = localStorage.getItem('quiblah_user_city');
            if (cachedLat && cachedLng) {
                applyQiblaData(parseFloat(cachedLat), parseFloat(cachedLng), cachedCity || '');
            }

            if (!('geolocation' in navigator)) {
                if (!qiblaAngle) applyQiblaData(30.0444, 31.2357, 'القاهرة (افتراضي)');
                return;
            }

            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                localStorage.setItem('quiblah_user_lat', lat);
                localStorage.setItem('quiblah_user_lng', lng);
                applyQiblaData(lat, lng);

                // Reverse geocode city name in background
                axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`)
                    .then(r => {
                        const city = r.data.city || r.data.principalSubdivision || '';
                        if (city) {
                            localStorage.setItem('quiblah_user_city', city);
                            document.getElementById('city-name').textContent = city;
                        }
                    }).catch(() => {});

            }, (err) => {
                console.warn("GPS timeout/error:", err);
                if (!qiblaAngle) {
                    applyQiblaData(30.0444, 31.2357, 'القاهرة (افتراضي)');
                    showToast('تم تعيين القبلة على القاهرة. يرجى تفعيل الـ GPS لدقة أعلى.', 'fa-solid fa-location-dot', 4000);
                }
            }, { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 });
        }

        // ── Auto-start on page load ───────────────────────
        window.addEventListener('DOMContentLoaded', () => {
            showCompassShell();

            // iOS 13+ requires user interaction for motion sensors
            if (typeof DeviceOrientationEvent !== 'undefined' &&
                typeof DeviceOrientationEvent.requestPermission === 'function') {
                document.getElementById('perm-btn').classList.add('visible');
                document.getElementById('perm-btn').onclick = () => {
                    requestSensorPermission();
                    startGeolocationFlow();
                };
            } else {
                startSensors();
                startGeolocationFlow();
            }
        });
