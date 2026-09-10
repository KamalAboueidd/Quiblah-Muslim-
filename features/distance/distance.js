// features/distance/distance.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© distance.html
// Carousel Background Rotation
        const slides = document.querySelectorAll('.carousel-slide');
        let curSlide = 0;
        setInterval(() => {
            slides[curSlide].classList.remove('active');
            curSlide = (curSlide + 1) % slides.length;
            slides[curSlide].classList.add('active');
        }, 8000);

        // Coordinates of the Holy Kaaba in Mecca
        const KAABA = { lat: 21.4224779, lng: 39.8251832 };

        // Supported Cities & Egyptian Governorates with Exact Geographic Coordinates
        const CITIES_DB = [
            { key: "Cairo", nameAr: "القاهرة", lat: 30.0444, lng: 31.2357, country: "مصر" },
            { key: "Giza", nameAr: "الجيزة", lat: 30.0131, lng: 31.2089, country: "مصر" },
            { key: "Alexandria", nameAr: "الإسكندرية", lat: 31.2001, lng: 29.9187, country: "مصر" },
            { key: "Suez", nameAr: "السويس", lat: 29.9668, lng: 32.5498, country: "مصر" },
            { key: "Port Said", nameAr: "بورسعيد", lat: 31.2653, lng: 32.3019, country: "مصر" },
            { key: "Ismailia", nameAr: "الإسماعيلية", lat: 30.5965, lng: 32.2715, country: "مصر" },
            { key: "Dakahlia", nameAr: "المنصورة (الدقهلية)", lat: 31.0409, lng: 31.3785, country: "مصر" },
            { key: "Gharbia", nameAr: "طنطا (الغربية)", lat: 30.7865, lng: 31.0004, country: "مصر" },
            { key: "Al Sharqia", nameAr: "الزقازيق (الشرقية)", lat: 30.5765, lng: 31.5041, country: "مصر" },
            { key: "Qalyubia", nameAr: "بنها (القليوبية)", lat: 30.4660, lng: 31.1856, country: "مصر" },
            { key: "Beheira", nameAr: "دمنهور (البحيرة)", lat: 31.0425, lng: 30.4703, country: "مصر" },
            { key: "Kafr el-Sheikh", nameAr: "كفر الشيخ", lat: 31.1107, lng: 30.9388, country: "مصر" },
            { key: "Damietta", nameAr: "دمياط", lat: 31.4175, lng: 31.8144, country: "مصر" },
            { key: "Monufia", nameAr: "شبين الكوم (المنوفية)", lat: 30.5525, lng: 31.0094, country: "مصر" },
            { key: "Faiyum", nameAr: "الفيوم", lat: 29.3084, lng: 30.8428, country: "مصر" },
            { key: "Beni Suef", nameAr: "بني سويف", lat: 29.0661, lng: 31.0994, country: "مصر" },
            { key: "Minya", nameAr: "المنيا", lat: 28.0871, lng: 30.7618, country: "مصر" },
            { key: "Asyut", nameAr: "أسيوط", lat: 27.1783, lng: 31.1859, country: "مصر" },
            { key: "Sohag", nameAr: "سوهاج", lat: 26.5569, lng: 31.6948, country: "مصر" },
            { key: "Qena", nameAr: "قنا", lat: 26.1551, lng: 32.7160, country: "مصر" },
            { key: "Luxor", nameAr: "الأقصر", lat: 25.6872, lng: 32.6396, country: "مصر" },
            { key: "Aswan", nameAr: "أسوان", lat: 24.0889, lng: 32.8998, country: "مصر" },
            { key: "Matrouh", nameAr: "مرسى مطروح", lat: 31.3543, lng: 27.2373, country: "مصر" },
            { key: "Red Sea", nameAr: "الغردقة (البحر الأحمر)", lat: 27.2579, lng: 33.8116, country: "مصر" },
            { key: "New Valley", nameAr: "الخارجة (الوادي الجديد)", lat: 25.4514, lng: 30.5464, country: "مصر" },
            { key: "South Sinai", nameAr: "شرم الشيخ / الطور", lat: 27.9158, lng: 34.3299, country: "مصر" },
            { key: "Riyadh", nameAr: "الرياض", lat: 24.7136, lng: 46.6753, country: "السعودية" },
            { key: "Medina", nameAr: "المدينة المنورة", lat: 24.5247, lng: 39.5692, country: "السعودية" },
            { key: "Jeddah", nameAr: "جدة", lat: 21.5433, lng: 39.1728, country: "السعودية" },
            { key: "Jerusalem", nameAr: "القدس الشريف", lat: 31.7683, lng: 35.2137, country: "فلسطين" },
            { key: "Dubai", nameAr: "دبي", lat: 25.2048, lng: 55.2708, country: "الإمارات" },
            { key: "Amman", nameAr: "عمّان", lat: 31.9454, lng: 35.9284, country: "الأردن" },
            { key: "Istanbul", nameAr: "إسطنبول", lat: 41.0082, lng: 28.9784, country: "تركيا" }
        ];

        // Active State
        let currentCityKey = localStorage.getItem("selectedCity") || "Cairo";
        let activeCoords = { lat: 30.0444, lng: 31.2357 };
        let activeLocationTitle = "القاهرة، مصر";
        let map = null;
        let flightPolyline = null;
        let userMarker = null;
        let kaabaMarker = null;
        let airplaneMarker = null;
        let planeAnimInterval = null;

        // Haversine Distance in Kilometers
        function calculateHaversine(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        }

        // Qibla Great-Circle Bearing
        function calculateBearing(lat1, lon1, lat2, lon2) {
            const toRad = Math.PI / 180;
            const toDeg = 180 / Math.PI;
            const phi1 = lat1 * toRad;
            const phi2 = lat2 * toRad;
            const deltaLambda = (lon2 - lon1) * toRad;
            const y = Math.sin(deltaLambda) * Math.cos(phi2);
            const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
            const deg = (Math.atan2(y, x) * toDeg + 360) % 360;
            return Math.round(deg);
        }

        // Compass Direction Label in Arabic
        function getCompassDirectionText(bearing) {
            if (bearing >= 337.5 || bearing < 22.5) return "شمال";
            if (bearing >= 22.5 && bearing < 67.5) return "شمال شرق";
            if (bearing >= 67.5 && bearing < 112.5) return "شرق";
            if (bearing >= 112.5 && bearing < 157.5) return "جنوب شرق";
            if (bearing >= 157.5 && bearing < 202.5) return "جنوب";
            if (bearing >= 202.5 && bearing < 247.5) return "جنوب غرب";
            if (bearing >= 247.5 && bearing < 292.5) return "غرب";
            return "شمال غرب";
        }

        // Animated Number Counter
        function animateCounter(elementId, targetValue, duration = 1200) {
            const el = document.getElementById(elementId);
            if (!el) return;
            const start = 0;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(start + (targetValue - start) * easeOut);
                el.textContent = current.toLocaleString('ar-EG');
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            requestAnimationFrame(update);
        }

        // Calculate and Render All Values
        function updateCalculations(lat, lng, locationLabel) {
            const distKm = calculateHaversine(lat, lng, KAABA.lat, KAABA.lng);
            const distMiles = distKm * 0.621371;

            // 1. Hero Number with animated counter
            animateCounter('dist-km', Math.round(distKm));
            document.getElementById('user-location-text').textContent = locationLabel;

            // 2. Flight Duration (commercial passenger jet at ~800 km/h)
            const flightHoursTotal = distKm / 800;
            const flHours = Math.floor(flightHoursTotal);
            const flMinutes = Math.round((flightHoursTotal - flHours) * 60);
            document.getElementById('stat-flight').textContent = 
                flHours > 0 ? `${flHours} س و ${flMinutes} دقيقة` : `${flMinutes} دقيقة`;

            // 3. Driving / Road Route Estimate (winding factor 1.28 + average speed 85 km/h)
            const driveHoursTotal = (distKm * 1.28) / 85;
            const drHours = Math.floor(driveHoursTotal);
            const drMinutes = Math.round((driveHoursTotal - drHours) * 60);
            document.getElementById('stat-drive').textContent = `${drHours} س و ${drMinutes} دقيقة`;

            // 4. Walking / Pilgrim Caravan Trek (estimated 28 km / day)
            const walkDays = Math.ceil(distKm / 28);
            document.getElementById('stat-walk').textContent = `${walkDays} يوماً سيراً`;

            // 5. Qibla Bearing
            const bearing = calculateBearing(lat, lng, KAABA.lat, KAABA.lng);
            const directionName = getCompassDirectionText(bearing);
            document.getElementById('stat-qibla').textContent = `${bearing}° (${directionName})`;

            // 6. Miles
            document.getElementById('stat-miles').textContent = `${Math.round(distMiles).toLocaleString('ar-EG')} ميل`;

            // Update map
            updateMap(lat, lng, locationLabel);
        }

        // Geodesic Curve Interpolator (creates a smooth curved flight path)
        function generateArcPoints(lat1, lon1, lat2, lon2, segments = 80) {
            const points = [];
            for (let i = 0; i <= segments; i++) {
                const f = i / segments;
                const deltaLat = lat2 - lat1;
                const deltaLon = lon2 - lon1;
                const arcLift = Math.sin(f * Math.PI) * (Math.abs(deltaLon) * 0.08);
                const curLat = lat1 + deltaLat * f + arcLift;
                const curLng = lon1 + deltaLon * f;
                points.push([curLat, curLng]);
            }
            return points;
        }

        // Initialize / Update Leaflet Map
        function updateMap(userLat, userLng, userLabel) {
            if (!window.L) return;

            const mapCenter = [(userLat + KAABA.lat) / 2, (userLng + KAABA.lng) / 2];

            if (!map) {
                map = L.map('map', {
                    zoomControl: true,
                    attributionControl: false,
                    scrollWheelZoom: false
                }).setView(mapCenter, 5);

                // Luxury Dark Tiles
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19,
                    subdomains: 'abcd'
                }).addTo(map);
            }

            // Clear previous elements
            if (userMarker) map.removeLayer(userMarker);
            if (kaabaMarker) map.removeLayer(kaabaMarker);
            if (flightPolyline) map.removeLayer(flightPolyline);
            if (airplaneMarker) map.removeLayer(airplaneMarker);
            if (planeAnimInterval) clearInterval(planeAnimInterval);

            // User Marker (Glowing Green Ring)
            const userIcon = L.divIcon({
                className: '',
                iconSize: [22, 22],
                iconAnchor: [11, 11],
                html: `
                    <div style="position: relative; width: 22px; height: 22px;">
                        <div style="width: 22px; height: 22px; border-radius: 50%; background: rgba(46, 204, 113, 0.35); animation: pulseWave 1.8s infinite ease-out;"></div>
                        <div style="position: absolute; top: 4px; left: 4px; width: 14px; height: 14px; border-radius: 50%; background: #2ecc71; border: 2.5px solid #fff; box-shadow: 0 0 12px #2ecc71;"></div>
                    </div>
                `
            });
            userMarker = L.marker([userLat, userLng], { icon: userIcon })
                .bindPopup(`<b style="font-family: Tajawal; font-size: 14px; color: #111;">📍 ${userLabel}</b>`)
                .addTo(map);

            // Kaaba Marker (Glowing Gold Mosque/Cube with Pulsing Wave)
            const kaabaIcon = L.divIcon({
                className: '',
                iconSize: [42, 42],
                iconAnchor: [21, 21],
                html: `
                    <div class="pulsing-marker" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
                        <div class="pulse-ring"></div>
                        <div style="font-size: 34px; line-height: 1; filter: drop-shadow(0 0 12px rgba(197, 168, 89, 0.95)); cursor: pointer;">🕋</div>
                    </div>
                `
            });
            kaabaMarker = L.marker([KAABA.lat, KAABA.lng], { icon: kaabaIcon })
                .bindPopup(`<div style="font-family: Tajawal; text-align: center; color: #111;"><b style="font-size: 15px; color: #9d8036;">🕋 الكعبة المشرفة</b><br><span style="font-size: 12px;">المسجد الحرام، مكة المكرمة</span></div>`)
                .addTo(map);

            // Curved Geodesic Flight Path
            const arcPoints = generateArcPoints(userLat, userLng, KAABA.lat, KAABA.lng, 90);
            flightPolyline = L.polyline(arcPoints, {
                color: '#C5A859',
                weight: 3,
                opacity: 0.85,
                dashArray: '8, 8'
            }).addTo(map);

            // Fit Bounds
            map.fitBounds([[userLat, userLng], [KAABA.lat, KAABA.lng]], {
                padding: [45, 45],
                maxZoom: 7
            });

            // Smooth Animated Airplane gliding along the flight route towards the Kaaba
            const planeIcon = L.divIcon({
                className: '',
                iconSize: [28, 28],
                iconAnchor: [14, 14],
                html: `<div id="flight-plane" style="font-size: 24px; color: #dfc274; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.8)); transform: rotate(0deg); transition: transform 0.1s linear;"><i class="fa-solid fa-plane"></i></div>`
            });

            let pointIndex = 0;
            airplaneMarker = L.marker(arcPoints[0], { icon: planeIcon }).addTo(map);

            planeAnimInterval = setInterval(() => {
                pointIndex = (pointIndex + 1) % arcPoints.length;
                const pNow = arcPoints[pointIndex];
                const pNext = arcPoints[(pointIndex + 1) % arcPoints.length];
                airplaneMarker.setLatLng(pNow);

                // Rotate plane icon toward next waypoint
                const deg = calculateBearing(pNow[0], pNow[1], pNext[0], pNext[1]);
                const planeEl = document.getElementById('flight-plane');
                if (planeEl) {
                    planeEl.style.transform = `rotate(${deg - 45}deg)`;
                }
            }, 120);
        }

        // Custom City Dropdown Population & Handling
        function setupCityDropdown() {
            const container = document.getElementById('city-dropdown-container');
            const trigger = document.getElementById('city-dropdown-trigger');
            const menu = document.getElementById('city-dropdown-menu');
            const currentLabel = document.getElementById('current-city-label');

            // Populate options
            let html = '';
            CITIES_DB.forEach(c => {
                const isSel = c.key === currentCityKey;
                html += `
                    <div class="dropdown-option ${isSel ? 'selected' : ''}" data-key="${c.key}">
                        <span>${c.nameAr}</span>
                        <span style="font-size: 11px; opacity: 0.6;">${c.country}</span>
                    </div>
                `;
            });
            menu.innerHTML = html;

            // Toggle Dropdown
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = menu.classList.contains('show');
                if (isOpen) {
                    menu.classList.remove('show');
                    trigger.classList.remove('open');
                } else {
                    menu.classList.add('show');
                    trigger.classList.add('open');
                }
            });

            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    menu.classList.remove('show');
                    trigger.classList.remove('open');
                }
            });

            // Option selection
            menu.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.addEventListener('click', function() {
                    const key = this.getAttribute('data-key');
                    selectCity(key);
                    menu.classList.remove('show');
                    trigger.classList.remove('open');
                });
            });
        }

        function selectCity(cityKey) {
            currentCityKey = cityKey;
            localStorage.setItem("selectedCity", cityKey);

            const cityObj = CITIES_DB.find(c => c.key === cityKey) || CITIES_DB[0];
            document.getElementById('current-city-label').textContent = cityObj.nameAr;

            // Update selected class in dropdown
            document.querySelectorAll('.dropdown-option').forEach(el => {
                if (el.getAttribute('data-key') === cityKey) el.classList.add('selected');
                else el.classList.remove('selected');
            });

            activeCoords = { lat: cityObj.lat, lng: cityObj.lng };
            activeLocationTitle = `${cityObj.nameAr}، ${cityObj.country}`;
            updateCalculations(cityObj.lat, cityObj.lng, activeLocationTitle);

            if (window.showToast) {
                window.showToast(`تم التحديث لموقع ${cityObj.nameAr}`, 'fa-solid fa-location-dot', 2500);
            }
        }

        // GPS Geolocation Handler (High Accuracy, Safe Fallback)
        document.getElementById('btn-gps').addEventListener('click', () => {
            const gpsBtn = document.getElementById('btn-gps');
            const origHtml = gpsBtn.innerHTML;
            gpsBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري تحديد الإحداثيات...`;
            gpsBtn.style.opacity = '0.75';

            if (!navigator.geolocation) {
                gpsBtn.innerHTML = origHtml;
                gpsBtn.style.opacity = '1';
                if (window.showToast) {
                    window.showToast('متصفحك لا يدعم خدمة GPS', 'fa-solid fa-triangle-exclamation', 3500);
                }
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    gpsBtn.innerHTML = origHtml;
                    gpsBtn.style.opacity = '1';
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    activeCoords = { lat, lng };

                    // Fetch address or city name
                    activeLocationTitle = "موقعي الحالي الدقيق (GPS)";
                    document.getElementById('current-city-label').textContent = "📍 موقعي الحالي (GPS)";

                    // Reverse geocode optionally
                    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`)
                        .then(r => r.json())
                        .then(data => {
                            const locality = data.locality || data.city || data.principalSubdivision;
                            if (locality) {
                                activeLocationTitle = `موقعي: ${locality}`;
                                document.getElementById('current-city-label').textContent = `📍 ${locality}`;
                            }
                            updateCalculations(lat, lng, activeLocationTitle);
                        })
                        .catch(() => {
                            updateCalculations(lat, lng, activeLocationTitle);
                        });

                    updateCalculations(lat, lng, activeLocationTitle);
                    if (window.showToast) {
                        window.showToast('تم تحديد موقعك بدقة عالية عبر GPS!', 'fa-solid fa-circle-check', 3000);
                    }
                },
                (err) => {
                    gpsBtn.innerHTML = origHtml;
                    gpsBtn.style.opacity = '1';
                    console.warn("GPS failed or denied:", err.message);
                    if (window.showToast) {
                        window.showToast('تعذر الوصول للـ GPS، تم الاعتماد على موقع المدينة المحددة', 'fa-solid fa-circle-exclamation', 3500);
                    }
                },
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
            );
        });

        // Fit Map Bounds Button
        document.getElementById('btn-fit-map').addEventListener('click', () => {
            if (map && activeCoords) {
                map.fitBounds([[activeCoords.lat, activeCoords.lng], [KAABA.lat, KAABA.lng]], {
                    padding: [45, 45]
                });
            }
        });

        // Initial Load (Instant, Guaranteed 0ms without GPS blocking)
        setupCityDropdown();
        const initialCity = CITIES_DB.find(c => c.key === currentCityKey) || CITIES_DB[0];
        document.getElementById('current-city-label').textContent = initialCity.nameAr;
        activeCoords = { lat: initialCity.lat, lng: initialCity.lng };
        activeLocationTitle = `${initialCity.nameAr}، ${initialCity.country}`;
        updateCalculations(initialCity.lat, initialCity.lng, activeLocationTitle);
