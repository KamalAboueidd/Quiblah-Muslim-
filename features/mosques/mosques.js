// features/mosques/mosques.js - منطق وبرمجة صفحة المساجد القريبة (mosques.html)
// تطوير: كمال أبو عيد - قبلة المسلم

(function() {
    // ── خلفية الكاروسيل الدوارة ────────────────────────────
    const slides = document.querySelectorAll('.carousel-slide');
    let curSlide = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[curSlide].classList.remove('active');
            curSlide = (curSlide + 1) % slides.length;
            slides[curSlide].classList.add('active');
        }, 8000);
    }

    // ── الحالة العامة والتخزين ─────────────────────────────
    let map = null;
    let userMarker = null;
    let radiusCircle = null;
    let mosqueMarkers = [];
    let mosqueData = [];
    let cachedMosquesPool = []; // مجمع المساجد المسترجعة للاستجابة الفورية عند تغيير النطاق
    let currentPos = null;
    let distanceLine = null;
    let distanceTooltip = null;
    let selectedRadius = 1000; // النطاق الافتراضي 1 كم
    let activeAbortController = null;
    let isAddModalOpen = false;
    let tempPickMarker = null;

    // ── دوال قياس وحساب المسافات الدقيقة ───────────────────
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // نصف قطر الأرض بالمتر
        const p1 = lat1 * Math.PI / 180;
        const p2 = lat2 * Math.PI / 180;
        const dp = (lat2 - lat1) * Math.PI / 180;
        const dl = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
                  Math.cos(p1) * Math.cos(p2) *
                  Math.sin(dl / 2) * Math.sin(dl / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    }

    function formatDistanceText(dist) {
        if (dist < 1000) {
            return `${dist} متر`;
        }
        return `${(dist / 1000).toFixed(1)} كم`;
    }

    function estimateTimeText(dist) {
        if (dist <= 1800) {
            const minutes = Math.max(1, Math.round(dist / 75)); // متوسط المشي 4.5 كم/ساعة
            return `~${minutes} دقيقة مشياً`;
        }
        const driveMinutes = Math.max(2, Math.round(dist / 450)); // متوسط القيادة في المدينة
        return `~${driveMinutes} دقيقة بالسيارة`;
    }

    // ── رسم مسار وخط المسافة بين المستخدم والمسجد ─────────
    function drawLineToMosque(lat, lng, mosqueName = '', distMeters = 0) {
        if (!userMarker || !map) return;
        removeDistanceLine();

        const userLatLng = userMarker.getLatLng();
        distanceLine = L.polyline([userLatLng, [lat, lng]], {
            color: '#c5a859',
            weight: 3.5,
            dashArray: '6, 10',
            opacity: 0.9
        }).addTo(map);

        const midLat = (userLatLng.lat + lat) / 2;
        const midLng = (userLatLng.lng + lng) / 2;
        const distStr = distMeters > 0 ? formatDistanceText(distMeters) : formatDistanceText(getDistance(userLatLng.lat, userLatLng.lng, lat, lng));

        distanceTooltip = L.tooltip({
            permanent: true,
            direction: 'center',
            className: 'distance-line-tooltip'
        })
        .setLatLng([midLat, midLng])
        .setContent(`<i class="fa-solid fa-person-walking"></i> ${distStr}`)
        .addTo(map);
    }

    function removeDistanceLine() {
        if (distanceLine && map) {
            map.removeLayer(distanceLine);
            distanceLine = null;
        }
        if (distanceTooltip && map) {
            map.removeLayer(distanceTooltip);
            distanceTooltip = null;
        }
    }

    window.toggleLineToMosque = function(lat, lng, name, dist) {
        if (!userMarker) return;
        if (distanceLine) {
            const coords = distanceLine.getLatLngs();
            if (coords[1] && Math.abs(coords[1].lat - lat) < 0.0001 && Math.abs(coords[1].lng - lng) < 0.0001) {
                removeDistanceLine();
                return;
            }
        }
        drawLineToMosque(lat, lng, name, dist);
    };

    // ── تغيير نطاق البحث (1 كم، 2 كم، 3 كم، 5 كم) ───────────
    window.setSearchRadius = function(radius) {
        selectedRadius = radius;

        // تحديث الأزرار (Pills)
        document.querySelectorAll('.radius-pill').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`pill-${radius}`);
        if (activeBtn) activeBtn.classList.add('active');

        // تحديث الدائرة على الخريطة
        if (radiusCircle) {
            radiusCircle.setRadius(radius);
            if (map) {
                map.fitBounds(radiusCircle.getBounds(), { padding: [30, 30], maxZoom: 16, animate: true });
            }
        }

        // إذا كان الموقع متوفراً، نستعرض المساجد المطابقة فوراً ونطلب المزيد إذا لزم
        if (currentPos) {
            // تصفية فورية إن وُجدت مساجد في الذاكرة
            if (cachedMosquesPool.length > 0) {
                const tolerance = radius <= 200 ? 50 : (radius <= 500 ? 80 : 120);
                const inRadius = cachedMosquesPool.filter(m => m.dist <= radius + tolerance);
                if (inRadius.length >= 3) {
                    renderMosques(inRadius);
                }
            }
            fetchMosques(currentPos.lat, currentPos.lng, selectedRadius);
        } else {
            startLocationSearch();
        }
    };

    // ── ضبط موقع المستخدم على الخريطة وبدء البحث ─────────
    function setUserLocationAndSearch(lat, lng, popupText = 'موقعك الحالي', radius = selectedRadius) {
        currentPos = { lat, lng };

        if (!map) return;

        if (userMarker) { map.removeLayer(userMarker); }
        if (radiusCircle) { map.removeLayer(radiusCircle); }
        removeDistanceLine();

        userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'user-pulse-marker-container',
                iconSize: [40, 54],
                iconAnchor: [20, 54],
                html: `
                    <div class="user-pulse-circle"></div>
                    <svg viewBox="0 0 100 150" style="width:36px;height:50px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.6));">
                        <path fill="#c5a859" stroke="#fff" stroke-width="4" d="M50,4 A46,46 0 0,0 4,50 C4,95 50,146 50,146 C50,146 96,95 96,50 A46,46 0 0,0 50,4 Z"/>
                        <circle cx="50" cy="50" r="18" fill="#fff"/>
                        <circle cx="50" cy="50" r="9" fill="#1c9e5b"/>
                    </svg>
                `
            })
        }).bindPopup(`<b style="font-family:'Tajawal',sans-serif;font-size:15px;color:#fff;">${popupText}</b>`).addTo(map);

        radiusCircle = L.circle([lat, lng], {
            radius: radius,
            color: '#C5A859',
            fillColor: '#C5A859',
            fillOpacity: 0.08,
            weight: 2,
            dashArray: '6, 8'
        }).addTo(map);

        map.fitBounds(radiusCircle.getBounds(), { padding: [30, 30], maxZoom: 16 });

        fetchMosques(lat, lng, radius);
    }

    // ── جلب المساجد القريبة باستراتيجية متوازية وفائقة السرعة ──
    async function fetchMosques(lat, lng, radius) {
        if (activeAbortController) {
            activeAbortController.abort();
        }
        activeAbortController = new AbortController();
        const signal = activeAbortController.signal;

        mosqueMarkers.forEach(m => map.removeLayer(m));
        mosqueMarkers = [];
        mosqueData = [];

        const radiusLabel = radius >= 1000 ? (radius / 1000) + ' كم' : radius + ' متر';
        const listEl = document.getElementById('mosques-list');
        listEl.innerHTML = `
            <div class="mosque-loading-state">
                <i aria-hidden="true" class="fa-solid fa-spinner fa-spin fa-2x" style="color:var(--gold);"></i>
                <div style="font-weight:700; margin-top:12px; font-size:15px;">جاري البحث عن أقرب المساجد في نطاق ${radiusLabel}...</div>
                <div style="font-size:12px; color:#aaa; margin-top:5px;">يتم الفحص والتحقق من أقرب بيوت الله إليك</div>
            </div>`;

        let rawElements = null;

        // 1. الخيار الأول: فحص خادم الويب المحلي /api/mosques إذا كان متاحاً
        try {
            const localApiUrl = `/api/mosques?lat=${lat}&lng=${lng}&radius=${radius}`;
            const localRes = await fetch(localApiUrl, { signal: AbortSignal.timeout(2800) });
            if (localRes.ok) {
                const data = await localRes.json();
                if (data && data.status === 'success' && Array.isArray(data.mosques) && data.mosques.length > 0) {
                    processAndDisplayMosques(data.mosques, lat, lng, radius);
                    return;
                }
            }
        } catch (e) {
            // الخادم المحلي غير متاح أو يعمل التطبيق كصفحة ثابتة (Static/GitHub Pages)، الانتقال للخطوة التالية
        }

        // 2. الخيار الثاني: استعلام متوازي عالي الأداء مع خوادم OpenStreetMap & Overpass
        const overpassQuery = `[out:json][timeout:8];(
          node["amenity"="mosque"](around:${radius},${lat},${lng});
          way["amenity"="mosque"](around:${radius},${lat},${lng});
          node["building"="mosque"](around:${radius},${lat},${lng});
          way["building"="mosque"](around:${radius},${lat},${lng});
          node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
          way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
        );out center;`;

        const overpassMirrors = [
            `https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=${encodeURIComponent(overpassQuery)}`,
            `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`,
            `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
        ];

        const queryMirror = async (url) => {
            const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data && Array.isArray(data.elements)) {
                return data.elements;
            }
            throw new Error('No elements');
        };

        try {
            // السباق بين المرايا: أسرع خادم يستجيب بنجاح يُعتمد فوراً
            rawElements = await Promise.any(overpassMirrors.map(queryMirror));
        } catch (err) {
            console.warn("[Mosques] Overpass race finished with no direct mirrors:", err);
        }

        // 3. الخيار الثالث: Fallback عبر Nominatim إذا تعثرت خوادم Overpass
        if (!rawElements || rawElements.length === 0) {
            try {
                const deltaDeg = (radius / 111320) * 1.1;
                const minLat = lat - deltaDeg, maxLat = lat + deltaDeg;
                const minLng = lng - (deltaDeg / Math.cos(lat * Math.PI / 180));
                const maxLng = lng + (deltaDeg / Math.cos(lat * Math.PI / 180));

                const nomRes = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=%D9%85%D8%B3%D8%AC%D8%AF&viewbox=${minLng},${maxLat},${maxLng},${minLat}&bounded=1&limit=40&accept-language=ar`,
                    { signal: AbortSignal.timeout(4000) }
                );
                if (nomRes.ok) {
                    const nomData = await nomRes.json();
                    if (Array.isArray(nomData) && nomData.length > 0) {
                        rawElements = nomData.map(n => ({
                            lat: parseFloat(n.lat),
                            lon: parseFloat(n.lon),
                            tags: { name: (n.display_name || '').split(',')[0], amenity: 'mosque' }
                        }));
                    }
                }
            } catch (nomErr) {
                console.warn("[Mosques] Nominatim fallback failed:", nomErr);
            }
        }

        // في حال تعذر الاتصال بجميع الخوادم
        if (!rawElements) {
            listEl.innerHTML = `
                <div style="text-align:center; padding:25px; color:#e74c3c; line-height: 1.8;">
                    <i class="fa-solid fa-triangle-exclamation fa-2x" style="margin-bottom:10px;"></i><br>
                    تعذر الاتصال بخوادم الخرائط حالياً، يرجى التحقق من اتصال الإنترنت.<br>
                    <button type="button" onclick="fetchMosques(${lat}, ${lng}, ${radius})" style="margin-top:14px; background:rgba(197,168,89,0.25); border:1px solid var(--gold); color:var(--gold); padding:8px 20px; border-radius:20px; cursor:pointer; font-family:inherit; font-weight:700;">
                        <i class="fa-solid fa-rotate-right"></i> إعادة المحاولة الآن
                    </button>
                </div>`;
            if (typeof showToast === 'function') showToast('تعذر جلب المساجد، يرجى المحاولة مرة ثانية', 3500, 'error');
            return;
        }

        // تحويل وتصفية عناصر OpenStreetMap
        const parsedList = [];
        rawElements.forEach((el) => {
            const mLat = el.lat || (el.center && el.center.lat);
            const mLng = el.lon || (el.center && el.center.lon);
            if (!mLat || !mLng) return;

            const tags = el.tags || {};
            if (tags.shop || tags.office || (tags.amenity && !['place_of_worship', 'mosque', 'community_centre'].includes(tags.amenity))) {
                return;
            }
            if (tags.religion && tags.religion.toLowerCase() !== 'muslim') return;

            const rawName = tags.name || tags['name:ar'] || tags['name:en'] || '';
            const lower = rawName.toLowerCase();

            // استبعاد الكنائس والأديرة والجامعات غير المسجدية
            if (lower.includes('كنيسة') || lower.includes('دير') || lower.includes('مطرانية') ||
                lower.includes('church') || lower.includes('cathedral') || lower.includes('synagogue') ||
                lower.includes('مدافن') || lower.includes('مقبرة')) {
                return;
            }
            if (lower.includes('جامعة') && !lower.includes('مسجد') && !lower.includes('جامع ')) return;

            let name = rawName.trim() || 'مسجد';
            if (name.startsWith("شارع ")) name = name.replace("شارع ", "");

            let areaName = tags['addr:street'] || tags['addr:suburb'] || tags['addr:city'] || tags['addr:district'] || '';
            if (areaName.startsWith("شارع ")) areaName = areaName.replace("شارع ", "");

            const dist = getDistance(lat, lng, mLat, mLng);
            const tolerance = radius <= 200 ? 50 : (radius <= 500 ? 80 : 120);
            if (dist > radius + tolerance) return;

            parsedList.push({ name, lat: mLat, lng: mLng, areaName, dist });
        });

        // 4. دمج المساجد المجتمعية المضافة محلياً ومن Supabase
        try {
            const communityMosques = await getCommunityMosques(lat, lng, radius);
            communityMosques.forEach(cm => {
                const dist = getDistance(lat, lng, cm.lat, cm.lng);
                const tolerance = radius <= 200 ? 50 : (radius <= 500 ? 80 : 150);
                if (dist <= radius + tolerance) {
                    parsedList.push({
                        ...cm,
                        dist: dist
                    });
                }
            });
        } catch (comErr) {
            console.warn("[Mosques] Community mosques integration notice:", comErr);
        }

        processAndDisplayMosques(parsedList, lat, lng, radius);
    }

    // ── معالجة، دمج التكرارات، وعرض المساجد ────────────────
    function processAndDisplayMosques(rawList, userLat, userLng, radius) {
        // حساب المسافات إذا لم تكن محسوبة
        const listWithDist = rawList.map(m => ({
            ...m,
            dist: m.dist !== undefined ? m.dist : getDistance(userLat, userLng, m.lat, m.lng)
        })).filter(m => m.dist <= radius + 150);

        // دمج المساجد المكررة التي تقل المسافة بينها عن 35 متر
        const deduped = [];
        for (const item of listWithDist) {
            const existing = deduped.find(d => getDistance(d.lat, d.lng, item.lat, item.lng) < 35);
            if (existing) {
                if (existing.name === 'مسجد' && item.name !== 'مسجد') {
                    existing.name = item.name;
                }
                if (!existing.areaName && item.areaName) {
                    existing.areaName = item.areaName;
                }
            } else {
                deduped.push(item);
            }
        }

        // الترتيب من الأقرب للأبعد
        deduped.sort((a, b) => a.dist - b.dist);

        // تحديث المسبح المؤقت
        cachedMosquesPool = deduped;

        renderMosques(deduped);
    }

    // ── رسم العناصر على الخريطة والقائمة ───────────────────
    function renderMosques(list) {
        mosqueMarkers.forEach(m => map.removeLayer(m));
        mosqueMarkers = [];
        mosqueData = [];

        list.forEach((m, index) => {
            const formattedDist = formatDistanceText(m.dist);
            const timeEst = estimateTimeText(m.dist);

            // إنشاء علامة مخصصة مميزة على الخريطة (تمييز مساجد المجتمع بنجمة ذهبية)
            const isCommunity = !!m.isCommunity;
            const pinClass = isCommunity ? 'mosque-map-pin community-pin' : 'mosque-map-pin';
            const pinIcon = isCommunity ? '<i aria-hidden="true" class="fa-solid fa-star"></i>' : '<i aria-hidden="true" class="fa-solid fa-mosque"></i>';

            const marker = L.marker([m.lat, m.lng], {
                icon: L.divIcon({
                    className: '',
                    iconSize: [36, 36],
                    iconAnchor: [18, 36],
                    html: `
                        <div class="${pinClass}">
                            ${pinIcon}
                        </div>`
                })
            }).bindPopup(`
                <div class="custom-popup-content">
                    <div class="popup-mosque-title">
                        <i class="${isCommunity ? 'fa-solid fa-star' : 'fa-solid fa-mosque'}" style="color:var(--gold);"></i> ${m.name}
                    </div>
                    ${isCommunity ? `<div style="font-size:11.5px; color:var(--gold); font-weight:700; margin-bottom:6px;"><i class="fa-solid fa-users"></i> مضاف بواسطة المصلين</div>` : ''}
                    <div class="popup-meta-row">
                        <span class="popup-meta-dist"><i class="fa-solid fa-person-walking"></i> ${formattedDist} (${timeEst})</span>
                        ${m.areaName ? `<span class="popup-meta-area"><i class="fa-solid fa-location-dot"></i> ${m.areaName}</span>` : ''}
                    </div>
                    <div class="popup-actions-row">
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" class="popup-btn-gmaps" title="الاتجاهات في خرائط Google">
                            <i class="fa-solid fa-diamond-turn-right"></i> فتح في Google Maps
                        </a>
                        <button type="button" class="popup-btn-route" onclick="window.toggleLineToMosque(${m.lat}, ${m.lng}, '${m.name.replace(/'/g, "\\'")}', ${m.dist})">
                            <i class="fa-solid fa-route"></i> المسافة
                        </button>
                    </div>
                </div>
            `, { offset: [0, -22], className: 'custom-map-popup', closeButton: true });

            marker.addTo(map);
            mosqueMarkers.push(marker);

            mosqueData.push({
                id: index,
                name: m.name,
                lat: m.lat,
                lng: m.lng,
                dist: m.dist,
                marker: marker,
                areaName: m.areaName || 'مسجد',
                isCommunity: isCommunity
            });
        });

        renderMosqueListUI();

        const radiusLabel = selectedRadius >= 1000 ? (selectedRadius / 1000) + ' كم' : selectedRadius + ' متر';
        if (typeof showToast === 'function') {
            if (mosqueData.length > 0) {
                showToast(`تم العثور على ${mosqueData.length} مسجد ضمن نطاق ${radiusLabel}`, 2500, 'success');
            } else {
                showToast(`لم يتم العثور على مساجد في نطاق ${radiusLabel}`, 2500, 'info');
            }
        }
    }

    function renderMosqueListUI() {
        const listEl = document.getElementById('mosques-list');
        const radiusLabel = selectedRadius >= 1000 ? (selectedRadius / 1000) + ' كم' : selectedRadius + ' متر';

        if (mosqueData.length === 0) {
            listEl.innerHTML = `
                <div style="text-align:center; padding:30px 20px; color:#aaa; line-height:1.8;">
                    <i class="fa-solid fa-mosque" style="font-size:38px; color:rgba(197,168,89,0.5); margin-bottom:12px;"></i><br>
                    <strong style="color:var(--white); font-size:16px;">لم يتم العثور على مساجد ضمن نطاق ${radiusLabel}</strong><br>
                    ${selectedRadius < 1000 ? `
                    يمكنك توسيع نطاق البحث للعثور على مساجد أخرى قريبة.<br>
                    <button type="button" onclick="setSearchRadius(${selectedRadius < 500 ? 500 : 1000})" style="margin-top:16px; background:rgba(197,168,89,0.25); border:1px solid var(--gold); color:var(--gold); padding:8px 22px; border-radius:20px; cursor:pointer; font-family:inherit; font-weight:700; font-size:13.5px; transition:0.3s;">
                        <i class="fa-solid fa-arrows-maximize"></i> توسيع البحث إلى ${selectedRadius < 500 ? '500 متر' : '1 كم'}
                    </button>` : `
                    يمكنك البحث في كامل نطاق الخريطة المعروضة.<br>
                    <button type="button" onclick="fetchMosquesInView()" style="margin-top:16px; background:rgba(197,168,89,0.25); border:1px solid var(--gold); color:var(--gold); padding:8px 22px; border-radius:20px; cursor:pointer; font-family:inherit; font-weight:700; font-size:13.5px; transition:0.3s;">
                        <i class="fa-solid fa-magnifying-glass-location"></i> البحث في نطاق الخريطة
                    </button>`}
                </div>`;
            return;
        }

        let html = '';
        mosqueData.forEach(m => {
            const formattedDist = formatDistanceText(m.dist);
            const timeEst = estimateTimeText(m.dist);

            html += `
                <div class="mosque-item" onclick="flyToMosque(${m.lat}, ${m.lng}, ${m.id})">
                    <div class="mosque-item-header">
                        <div class="mosque-item-title">
                            <i aria-hidden="true" class="fa-solid fa-mosque"></i>
                            <span>${m.name}</span>
                        </div>
                        <span class="mosque-dist-badge">
                            <i class="fa-solid fa-person-walking"></i> ${formattedDist}
                            <span class="mosque-dist-time">(${timeEst})</span>
                        </span>
                    </div>

                    <div class="mosque-item-body">
                        <span class="mosque-area-label" id="list-area-${m.id}">
                            <i aria-hidden="true" class="fa-solid fa-map-pin"></i> ${m.areaName}
                        </span>
                        ${m.isCommunity ? `<span class="mosque-community-badge"><i class="fa-solid fa-users"></i> مضاف بواسطة المصلين</span>` : ''}
                    </div>

                    <div class="mosque-actions-bar" onclick="event.stopPropagation();">
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" class="mosque-gmaps-btn" title="الاتجاهات عبر خرائط Google">
                            <i class="fa-solid fa-diamond-turn-right"></i> خرائط Google
                        </a>
                        <button type="button" class="mosque-nav-link" onclick="window.toggleLineToMosque(${m.lat}, ${m.lng}, '${m.name.replace(/'/g, "\\'")}', ${m.dist})" title="رسم خط المسافة على الخريطة">
                            <i class="fa-solid fa-route"></i> المسافة
                        </button>
                    </div>
                </div>
            `;
        });

        listEl.innerHTML = html;
    }

    // ── التركيز والانتقال إلى المسجد المحدد ───────────────
    window.flyToMosque = function(lat, lng, id) {
        if (!map) return;
        map.flyTo([lat, lng], 17, { duration: 0.8 });
        const target = mosqueData.find(m => m.id === id);
        if (target && target.marker) {
            setTimeout(() => target.marker.openPopup(), 850);
        }

        if (window.innerWidth < 850) {
            const mapWrap = document.getElementById('map-wrapper');
            if (mapWrap) {
                mapWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // ── البحث في نطاق الخريطة المعروض حالياً ──────────────
    window.fetchMosquesInView = function() {
        if (!map) return;
        const center = map.getCenter();
        const bounds = map.getBounds();
        const radius = Math.min(Math.round(map.distance(center, bounds.getNorthEast())), 5000);

        if (typeof showToast === 'function') showToast('جاري البحث في المنطقة المعروضة...', 1500, 'info');
        setUserLocationAndSearch(center.lat, center.lng, 'المنطقة المحددة', radius);
    };

    // ── البحث عن مدينة أو منطقة بالاسم ───────────────────
    window.searchByCityName = function() {
        const input = document.getElementById('search-input');
        if (!input || !input.value.trim()) return;
        const query = input.value.trim();

        if (typeof showToast === 'function') showToast('جاري البحث عن المنطقة...', 1500, 'info');

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=ar`)
            .then(r => r.json())
            .then(res => {
                if (res && res.length > 0) {
                    const place = res[0];
                    const lat = parseFloat(place.lat);
                    const lng = parseFloat(place.lon);
                    const cityName = (place.display_name || '').split(',')[0];

                    const displayEl = document.getElementById('user-location-display');
                    const textEl = document.getElementById('user-location-text');
                    if (displayEl && textEl) {
                        displayEl.style.display = 'inline-block';
                        textEl.innerText = cityName;
                    }

                    setUserLocationAndSearch(lat, lng, cityName, selectedRadius);
                } else {
                    if (typeof showToast === 'function') showToast('لم يتم العثور على المنطقة المحددة', 2500, 'warning');
                }
            })
            .catch(() => {
                if (typeof showToast === 'function') showToast('تعذر البحث عن المنطقة', 2500, 'error');
            });
    };

    // ── جلب اسم الموقع بالعربية في الخلفية ─────────────────
    function fetchUserLocationName(lat, lng) {
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`)
            .then(r => r.json())
            .then(data => {
                const city = data.city || data.principalSubdivision || '';
                const locality = data.locality || '';
                let text = locality ? `${city}، ${locality}` : city;
                if (!text) text = 'موقعك الحالي';

                const displayEl = document.getElementById('user-location-display');
                const textEl = document.getElementById('user-location-text');
                if (displayEl && textEl) {
                    displayEl.style.display = 'inline-block';
                    textEl.innerText = text;
                }
                localStorage.setItem('quiblah_user_city', text);
            })
            .catch(() => {});
    }

    // ── تحديد الموقع الجغرافي (زر موقعي) ──────────────────
    window.startLocationSearch = function() {
        const startBtn = document.getElementById('start-btn');
        const loaderText = document.getElementById('loader-text');

        if (startBtn) startBtn.style.display = 'none';
        if (loaderText) {
            loaderText.style.display = 'inline-flex';
            loaderText.innerHTML = `<i aria-hidden="true" class="fa-solid fa-spinner fa-spin"></i> جاري تحديد موقعك...`;
        }

        const restoreBtn = () => {
            if (loaderText) loaderText.style.display = 'none';
            if (startBtn) startBtn.style.display = 'inline-flex';
        };

        if (!('geolocation' in navigator)) {
            if (loaderText) loaderText.innerHTML = `<span style="color:#e74c3c;">تحديد الموقع غير مدعوم</span>`;
            setTimeout(restoreBtn, 2000);
            return;
        }

        // استخدام إعدادات سريعة وموثوقة لعدم تعليق المتصفح
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                localStorage.setItem('quiblah_user_lat', currentPos.lat);
                localStorage.setItem('quiblah_user_lng', currentPos.lng);

                restoreBtn();
                setUserLocationAndSearch(currentPos.lat, currentPos.lng, 'موقعك الحالي', selectedRadius);
                fetchUserLocationName(currentPos.lat, currentPos.lng);
                if (typeof showToast === 'function') showToast('تم تحديد موقعك بنجاح', 2000, 'success');
            },
            (err) => {
                console.warn("[Mosques] Geolocation error/timeout:", err);
                restoreBtn();

                // إذا كان لدينا موقع محفوظ سابقاً في localStorage
                const cachedLat = localStorage.getItem('quiblah_user_lat');
                const cachedLng = localStorage.getItem('quiblah_user_lng');
                const cachedCity = localStorage.getItem('quiblah_user_city');

                if (cachedLat && cachedLng) {
                    currentPos = { lat: parseFloat(cachedLat), lng: parseFloat(cachedLng) };
                    setUserLocationAndSearch(currentPos.lat, currentPos.lng, cachedCity || 'موقعك المحفوظ', selectedRadius);
                    if (typeof showToast === 'function') showToast('تم استخدام موقعك المحفوظ', 2500, 'info');
                } else {
                    // استخدام القاهرة كافتراضي لعدم ترك الشاشة فارغة
                    currentPos = { lat: 30.0444, lng: 31.2357 };
                    setUserLocationAndSearch(30.0444, 31.2357, 'القاهرة (افتراضي)', selectedRadius);
                    if (typeof showToast === 'function') showToast('يرجى السماح بخدمة الموقع GPS لدقة أفضل', 3500, 'warning');
                }
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
    };

    // ── تصفية القائمة بالاسم ─────────────────────────────
    window.toggleListSearch = function() {
        const input = document.getElementById('list-search-input');
        const icon = document.getElementById('toggle-list-search');
        if (!input) return;

        if (input.style.display === 'none') {
            input.style.display = 'block';
            input.focus();
            if (icon) icon.style.color = 'var(--gold)';
        } else {
            input.style.display = 'none';
            input.value = '';
            if (icon) icon.style.color = '#aaa';
            filterMosqueList();
        }
    };

    window.filterMosqueList = function() {
        const input = document.getElementById('list-search-input');
        if (!input) return;
        const query = input.value.toLowerCase().trim();
        const items = document.querySelectorAll('.mosque-item');
        items.forEach(item => {
            const text = item.innerText.toLowerCase();
            if (!query || text.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    };

    // ── تهيئة الخريطة عند تحميل الصفحة ────────────────────
    document.addEventListener("DOMContentLoaded", () => {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        map = L.map('map', { zoomControl: true, attributionControl: false }).setView([30.0444, 31.2357], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            subdomains: ['a', 'b', 'c']
        }).addTo(map);

        // الاستماع للنقر على الخريطة لاختيار موقع مسجد جديد إذا كانت النافذة مفتوحة
        map.on('click', (e) => {
            if (isAddModalOpen) {
                setPickedLocation(e.latlng.lat, e.latlng.lng);
                const banner = document.getElementById('map-picker-banner');
                if (banner && banner.style.display !== 'none') {
                    if (typeof showToast === 'function') {
                        showToast('تم تحديد الموقع، جاري العودة للنافذة...', 1200, 'success');
                    }
                    setTimeout(() => {
                        window.returnFromMapPicker();
                    }, 500);
                } else {
                    if (typeof showToast === 'function') {
                        showToast('تم تحديد مكان المسجد على الخريطة بنجاح', 1500, 'info');
                    }
                }
            }
        });

        // 1. التحميل اللحظي الفوري من الموقع المحفوظ في الذاكرة
        const cachedLat = localStorage.getItem('quiblah_user_lat');
        const cachedLng = localStorage.getItem('quiblah_user_lng');
        const cachedCity = localStorage.getItem('quiblah_user_city');

        if (cachedLat && cachedLng) {
            currentPos = { lat: parseFloat(cachedLat), lng: parseFloat(cachedLng) };
            if (cachedCity) {
                const displayEl = document.getElementById('user-location-display');
                const textEl = document.getElementById('user-location-text');
                if (displayEl && textEl) {
                    displayEl.style.display = 'inline-block';
                    textEl.innerText = cachedCity;
                }
            }
            setUserLocationAndSearch(currentPos.lat, currentPos.lng, cachedCity || 'موقعك الحالي', selectedRadius);
        } else {
            // 2. طلب تحديد الموقع فوراً إذا لم يكن هناك موقع محفوظ
            startLocationSearch();
        }
    });

    // ── منطق إضافة المساجد المجتمعية وقاعدة البيانات ─────────

    // جلب المساجد المجتمعية من LocalStorage و Supabase
    async function getCommunityMosques(centerLat, centerLng, radius) {
        const communityMosques = [];
        const seenKeys = new Set();

        // 1. من الذاكرة المحلية (LocalStorage)
        try {
            const localData = JSON.parse(localStorage.getItem('quiblah_community_mosques') || '[]');
            if (Array.isArray(localData)) {
                localData.forEach(m => {
                    const key = `${parseFloat(m.lat).toFixed(4)},${parseFloat(m.lng).toFixed(4)}`;
                    if (!seenKeys.has(key)) {
                        seenKeys.add(key);
                        communityMosques.push({
                            id: m.id || ('local_' + Math.random()),
                            name: m.name,
                            areaName: m.areaName || '',
                            lat: parseFloat(m.lat),
                            lng: parseFloat(m.lng),
                            isCommunity: true
                        });
                    }
                });
            }
        } catch (err) {
            console.warn('[Community] LocalStorage read notice:', err);
        }

        // 2. من Supabase في حال كانت الإعدادات متوفرة
        if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
            try {
                const supaUrl = window.SUPABASE_CONFIG.url.replace(/\/$/, '');
                const res = await fetch(`${supaUrl}/rest/v1/mosques?select=*`, {
                    headers: {
                        'apikey': window.SUPABASE_CONFIG.anonKey,
                        'Authorization': `Bearer ${window.SUPABASE_CONFIG.anonKey}`
                    },
                    signal: AbortSignal.timeout(3500)
                });
                if (res.ok) {
                    const supaRows = await res.json();
                    if (Array.isArray(supaRows)) {
                        supaRows.forEach(row => {
                            const mLat = parseFloat(row.latitude);
                            const mLng = parseFloat(row.longitude);
                            const key = `${mLat.toFixed(4)},${mLng.toFixed(4)}`;
                            if (!seenKeys.has(key) && !isNaN(mLat) && !isNaN(mLng)) {
                                seenKeys.add(key);
                                communityMosques.push({
                                    id: 'supa_' + row.id,
                                    name: row.name,
                                    areaName: row.area_name || '',
                                    lat: mLat,
                                    lng: mLng,
                                    isCommunity: true
                                });
                            }
                        });
                    }
                }
            } catch (supaErr) {
                console.warn('[Community] Supabase fetch notice:', supaErr);
            }
        }

        return communityMosques;
    }

    // فتح نافذة إضافة مسجد
    window.openAddMosqueModal = function() {
        const overlay = document.getElementById('add-mosque-modal-overlay');
        if (!overlay) return;
        isAddModalOpen = true;
        overlay.style.display = 'flex';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // قفل اسكرول الصفحة أثناء فتح القائمة

        const banner = document.getElementById('map-picker-banner');
        if (banner) banner.style.display = 'none';

        const latInput = document.getElementById('new-mosque-lat');
        const lngInput = document.getElementById('new-mosque-lng');
        const coordsText = document.getElementById('coords-text');

        // إذا كان هناك موقع محدد مسبقاً والحقول فارغة، نملؤها بموقع المستخدم الافتراضي
        if ((!latInput.value || !lngInput.value) && currentPos) {
            setPickedLocation(currentPos.lat, currentPos.lng);
        } else if (latInput.value && lngInput.value) {
            placePickMarker(parseFloat(latInput.value), parseFloat(lngInput.value));
        }

        setTimeout(() => {
            const nameInput = document.getElementById('new-mosque-name');
            if (nameInput) nameInput.focus();
        }, 200);
    };

    // إغلاق نافذة إضافة مسجد
    window.closeAddMosqueModal = function(e) {
        if (e && e.target && e.target !== e.currentTarget && !e.target.closest('.modal-close-btn') && !e.target.closest('.btn-cancel')) {
            return;
        }
        const overlay = document.getElementById('add-mosque-modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (!isAddModalOpen) overlay.style.display = 'none';
            }, 250);
        }
        const banner = document.getElementById('map-picker-banner');
        if (banner) banner.style.display = 'none';

        document.body.style.overflow = ''; // إعادة فتح اسكرول الصفحة
        isAddModalOpen = false;

        if (tempPickMarker && map) {
            map.removeLayer(tempPickMarker);
            tempPickMarker = null;
        }
    };

    // تفعيل وضع تحديد الموقع على الخريطة مباشرة
    window.activateMapPicker = function() {
        const overlay = document.getElementById('add-mosque-modal-overlay');
        const banner = document.getElementById('map-picker-banner');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.classList.remove('active');
        }
        if (banner) banner.style.display = 'flex';
        document.body.style.overflow = ''; // السماح بالتصفح والتحرك في الخريطة بحرية

        if (currentPos && map) {
            map.panTo([currentPos.lat, currentPos.lng]);
        }

        if (typeof showToast === 'function') {
            showToast('انقر على أي مكان بالخريطة لتحديد مكان المسجد', 2500, 'info');
        }
    };

    // العودة من وضع تحديد الخريطة إلى النافذة
    window.returnFromMapPicker = function() {
        const overlay = document.getElementById('add-mosque-modal-overlay');
        const banner = document.getElementById('map-picker-banner');
        if (banner) banner.style.display = 'none';
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('active'), 10);
        }
        document.body.style.overflow = 'hidden';
    };

    // استخدام الموقع الحالي كإحداثيات للمسجد
    window.useCurrentLocationForMosque = function() {
        if (currentPos) {
            setPickedLocation(currentPos.lat, currentPos.lng);
            if (map) map.panTo([currentPos.lat, currentPos.lng]);
            if (typeof showToast === 'function') showToast('تم تعيين إحداثيات موقعك الحالي', 1800, 'info');
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setPickedLocation(currentPos.lat, currentPos.lng);
                    if (map) map.panTo([currentPos.lat, currentPos.lng]);
                    if (typeof showToast === 'function') showToast('تم تعيين إحداثيات موقعك الحالي', 1800, 'info');
                },
                () => {
                    if (typeof showToast === 'function') showToast('يرجى النقر مباشرة على الخريطة لتحديد مكان المسجد', 2500, 'warning');
                }
            );
        }
    };

    // تعيين الإحداثيات المختارة وتحديث حقول الإدخال والاسم
    function setPickedLocation(lat, lng) {
        const latInput = document.getElementById('new-mosque-lat');
        const lngInput = document.getElementById('new-mosque-lng');
        const coordsText = document.getElementById('coords-text');

        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;
        if (coordsText) coordsText.textContent = `${lat.toFixed(5)} ، ${lng.toFixed(5)}`;

        placePickMarker(lat, lng);

        // جلب اسم المنطقة بالعربية لعرضها للمستخدم وتعبئتها تلقائياً إن كانت فارغة
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`)
            .then(r => r.json())
            .then(data => {
                const city = data.city || data.principalSubdivision || '';
                const locality = data.locality || '';
                let placeName = locality ? `${city}، ${locality}` : city;
                if (placeName && coordsText) {
                    coordsText.textContent = `${placeName} (${lat.toFixed(4)}، ${lng.toFixed(4)})`;
                }
                const areaInput = document.getElementById('new-mosque-area');
                if (areaInput && !areaInput.value.trim() && placeName) {
                    areaInput.value = placeName;
                }
            })
            .catch(() => {});
    }

    // وضع أو تحريك العلامة المؤقتة على الخريطة
    function placePickMarker(lat, lng) {
        if (!map) return;
        if (tempPickMarker) {
            tempPickMarker.setLatLng([lat, lng]);
        } else {
            tempPickMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: '',
                    iconSize: [34, 34],
                    iconAnchor: [17, 34],
                    html: `<div class="temp-pick-marker-icon"><i class="fa-solid fa-mosque"></i></div>`
                }),
                zIndexOffset: 1000
            }).addTo(map);
        }
    }

    // إرسال وحفظ المسجد الجديد
    window.submitNewMosque = async function(event) {
        if (event) event.preventDefault();
        const nameInput = document.getElementById('new-mosque-name');
        const areaInput = document.getElementById('new-mosque-area');
        const latInput = document.getElementById('new-mosque-lat');
        const lngInput = document.getElementById('new-mosque-lng');
        const submitBtn = document.getElementById('btn-submit-mosque');

        const name = nameInput ? nameInput.value.trim() : '';
        const area = areaInput ? areaInput.value.trim() : '';
        const lat = latInput ? parseFloat(latInput.value) : NaN;
        const lng = lngInput ? parseFloat(lngInput.value) : NaN;

        if (!name) {
            if (typeof showToast === 'function') showToast('يرجى كتابة اسم المسجد', 2500, 'warning');
            return;
        }
        if (isNaN(lat) || isNaN(lng)) {
            if (typeof showToast === 'function') showToast('يرجى تحديد موقع المسجد بالضغط على الخريطة أو زر موقعي', 3000, 'warning');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...`;
        }

        const newMosqueObj = {
            id: 'custom_' + Date.now(),
            name: name,
            areaName: area || 'مسجد مضاف',
            lat: lat,
            lng: lng,
            isCommunity: true,
            createdAt: new Date().toISOString()
        };

        // 1. الحفظ الفوري محلياً في الذاكرة لضمان العمل حتى دون اتصال
        try {
            const localCommunity = JSON.parse(localStorage.getItem('quiblah_community_mosques') || '[]');
            localCommunity.push(newMosqueObj);
            localStorage.setItem('quiblah_community_mosques', JSON.stringify(localCommunity));
        } catch (storageErr) {
            console.warn('[Community] LocalStorage save error:', storageErr);
        }

        // 2. الإرسال إلى Supabase في حال كانت الإعدادات متوفرة
        if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
            try {
                const supaUrl = window.SUPABASE_CONFIG.url.replace(/\/$/, '');
                await fetch(`${supaUrl}/rest/v1/mosques`, {
                    method: 'POST',
                    headers: {
                        'apikey': window.SUPABASE_CONFIG.anonKey,
                        'Authorization': `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        name: name,
                        area_name: area,
                        latitude: lat,
                        longitude: lng
                    })
                });
            } catch (supaPostErr) {
                console.warn('[Community] Supabase post error:', supaPostErr);
            }
        }

        // 3. إغلاق النافذة وتنظيف النموذج
        closeAddMosqueModal();
        if (nameInput) nameInput.value = '';
        if (areaInput) areaInput.value = '';
        if (latInput) latInput.value = '';
        if (lngInput) lngInput.value = '';
        const coordsText = document.getElementById('coords-text');
        if (coordsText) coordsText.textContent = 'لم يتم تحديد الموقع بعد';

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> حفظ وإضافة المسجد`;
        }

        // 4. إشعار نجاح فوري
        if (typeof showToast === 'function') {
            showToast(`تمت إضافة "${name}" بنجاح! جزاك الله خيراً`, 4000, 'success');
        }

        // 5. إضافة المسجد فوراً إلى العرض الحالي والخريطة
        const userBaseLat = (userMarker && userMarker.getLatLng().lat) || (currentPos && currentPos.lat) || lat;
        const userBaseLng = (userMarker && userMarker.getLatLng().lng) || (currentPos && currentPos.lng) || lng;
        newMosqueObj.dist = getDistance(userBaseLat, userBaseLng, lat, lng);

        cachedMosquesPool = cachedMosquesPool.filter(m => getDistance(m.lat, m.lng, lat, lng) > 15);
        cachedMosquesPool.unshift(newMosqueObj);
        cachedMosquesPool.sort((a, b) => a.dist - b.dist);

        renderMosques(cachedMosquesPool);

        if (map) {
            map.flyTo([lat, lng], 17, { duration: 0.8 });
        }
    };

})();
