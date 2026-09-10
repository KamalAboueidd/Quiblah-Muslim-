// features/mosques/mosques.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© mosques.html
const slides = document.querySelectorAll('.carousel-slide');
    let cur = 0;
    setInterval(() => { slides[cur].classList.remove('active'); cur = (cur+1)%slides.length; slides[cur].classList.add('active'); }, 8000);

    let map;
    let userMarker;
    let radiusCircle = null;
    let mosqueMarkers = [];
    let mosqueData = [];
    let currentPos = null;
    let distanceLine = null;
    let selectedRadius = 1000; // 1 km default as requested by user

    function drawLineToMosque(lat, lng) {
        if (userMarker) {
            removeDistanceLine();
            distanceLine = L.polyline([userMarker.getLatLng(), [lat, lng]], {
                color: '#c5a859',
                weight: 3,
                dashArray: '5, 10',
                opacity: 0.85
            }).addTo(map);
        }
    }

    function removeDistanceLine() {
        if (distanceLine) {
            map.removeLayer(distanceLine);
            distanceLine = null;
        }
    }

    window.toggleLineToMosque = function(lat, lng) {
        if (!userMarker) return;
        if (distanceLine) {
            const coords = distanceLine.getLatLngs();
            if (coords[1] && Math.abs(coords[1].lat - lat) < 0.0001 && Math.abs(coords[1].lng - lng) < 0.0001) {
                removeDistanceLine();
                return;
            }
        }
        drawLineToMosque(lat, lng);
    };

    window.setSearchRadius = function(radius) {
        selectedRadius = radius;
        document.querySelectorAll('.radius-pill').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`pill-${radius}`);
        if (activeBtn) activeBtn.classList.add('active');

        if (currentPos) {
            setUserLocationAndSearch(currentPos.lat, currentPos.lng, 'موقعك الحالي', selectedRadius);
        } else {
            startLocationSearch();
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        // Initialize Map
        map = L.map('map', { zoomControl: true, attributionControl: false }).setView([30.0444, 31.2357], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        // 1. Instant load from cached location if available
        const cachedLat = localStorage.getItem('quiblah_user_lat');
        const cachedLng = localStorage.getItem('quiblah_user_lng');
        const cachedCity = localStorage.getItem('quiblah_user_city');

        if (cachedLat && cachedLng) {
            currentPos = { lat: parseFloat(cachedLat), lng: parseFloat(cachedLng) };
            if (cachedCity) {
                document.getElementById('user-location-display').style.display = 'block';
                document.getElementById('user-location-text').innerText = cachedCity;
            }
            setUserLocationAndSearch(currentPos.lat, currentPos.lng, cachedCity || 'موقعك الحالي', selectedRadius);
        }

        // 2. Automatically request fresh GPS location on load
        startLocationSearch();
    });

    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    }

    function setUserLocationAndSearch(lat, lng, popupText = 'موقعك الحالي', radius = selectedRadius) {
        currentPos = { lat: lat, lng: lng };
        if (userMarker) { map.removeLayer(userMarker); }
        if (radiusCircle) { map.removeLayer(radiusCircle); }

        const zoomLevel = radius <= 1200 ? 16 : (radius <= 2500 ? 15 : 14);
        map.setView([lat, lng], zoomLevel);

        userMarker = L.marker([lat, lng], { icon: L.divIcon({
            className: '',
            iconSize: [36, 54],
            iconAnchor: [18, 54],
            html: '<svg viewBox="0 0 100 150" style="width:36px;height:54px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5));"><path fill="#c5a859" stroke="#fff" stroke-width="4" d="M50,4 A46,46 0 0,0 4,50 C4,95 50,146 50,146 C50,146 96,95 96,50 A46,46 0 0,0 50,4 Z"/><circle cx="50" cy="50" r="20" fill="#fff"/></svg>'
        })}).bindPopup(`<b style="font-family:Tajawal;font-size:15px;color:#000;">${popupText}</b>`).addTo(map);

        // Draw visual 1km boundary circle
        radiusCircle = L.circle([lat, lng], {
            radius: radius,
            color: '#C5A859',
            fillColor: '#C5A859',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '5, 8'
        }).addTo(map);

        fetchMosques(lat, lng, radius); 
    }

    function fetchMosquesInView() {
        const center = map.getCenter();
        const bounds = map.getBounds();
        const radius = Math.min(Math.round(map.distance(center, bounds.getNorthEast())), 5000);
        
        if (typeof showToast === 'function') showToast('جاري البحث في المنطقة المعروضة...', 1500, 'info');
        fetchMosques(center.lat, center.lng, radius);
    }

    async function fetchMosques(lat, lng, radius) {
        mosqueMarkers.forEach(m => map.removeLayer(m));
        mosqueMarkers = [];
        mosqueData = [];
        
        const radiusLabel = radius >= 1000 ? (radius / 1000) + ' كم' : radius + ' متر';
        document.getElementById('mosques-list').innerHTML = `
            <div style="text-align:center; padding:25px; color:#aaa;">
                <i aria-hidden="true" class="fa-solid fa-spinner fa-spin fa-2x" style="color:var(--gold);"></i><br><br>
                جاري البحث عن المساجد في نطاق ${radiusLabel}...
            </div>`;

        // Enhanced Overpass Query covering nodes, ways, and relations (nwr)
        // Catches all mosques, places of worship without religion tag, named masjids, angles/zawiyas, etc.
        const overpassQuery = `
            [out:json][timeout:25];
            (
              nwr["amenity"="mosque"](around:${radius},${lat},${lng});
              nwr["building"="mosque"](around:${radius},${lat},${lng});
              nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
              nwr["amenity"="place_of_worship"](around:${radius},${lat},${lng});
              nwr["name"~"مسجد|جامع|مصلى|زاوية",i](around:${radius},${lat},${lng});
            );
            out center;
        `;

        // Robust endpoints queried via GET (CORS simple request, zero preflight issues)
        const encodedQuery = encodeURIComponent(overpassQuery.replace(/\s+/g, ' ').trim());
        const apis = [
            `https://overpass-api.de/api/interpreter?data=${encodedQuery}`,
            `https://overpass.kumi.systems/api/interpreter?data=${encodedQuery}`,
            `https://lz4.overpass-api.de/api/interpreter?data=${encodedQuery}`,
            `https://z.overpass-api.de/api/interpreter?data=${encodedQuery}`
        ];

        let elements = null;
        for (const api of apis) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                
                const response = await fetch(api, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data && Array.isArray(data.elements)) {
                        elements = data.elements;
                        break;
                    }
                }
            } catch (err) {
                console.warn(`Overpass mirror timeout/failure, trying next...`);
            }
        }

        // Secondary Fallback: Nominatim OpenStreetMap Search API if Overpass is busy
        if (!elements || elements.length === 0) {
            try {
                const deltaDeg = (radius / 111320) * 1.15;
                const minLat = lat - deltaDeg, maxLat = lat + deltaDeg;
                const minLng = lng - (deltaDeg / Math.cos(lat * Math.PI / 180));
                const maxLng = lng + (deltaDeg / Math.cos(lat * Math.PI / 180));
                
                const [nomMosques, nomGamaa] = await Promise.all([
                    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=مسجد&viewbox=${minLng},${maxLat},${maxLng},${minLat}&bounded=1&limit=50&accept-language=ar`).then(r => r.ok ? r.json() : []).catch(() => []),
                    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=جامع&viewbox=${minLng},${maxLat},${maxLng},${minLat}&bounded=1&limit=50&accept-language=ar`).then(r => r.ok ? r.json() : []).catch(() => [])
                ]);

                const combined = [...(Array.isArray(nomMosques) ? nomMosques : []), ...(Array.isArray(nomGamaa) ? nomGamaa : [])];
                if (combined.length > 0) {
                    elements = combined.map(n => ({
                        lat: parseFloat(n.lat),
                        lon: parseFloat(n.lon),
                        tags: { name: (n.display_name || '').split(',')[0], amenity: 'mosque' }
                    }));
                }
            } catch(e) {
                console.warn("Nominatim fallback error:", e);
            }
        }

        if (!elements) {
            document.getElementById('mosques-list').innerHTML = `
                <div style="text-align:center; padding:25px; color:#e74c3c; line-height: 1.8;">
                    <i class="fa-solid fa-triangle-exclamation fa-2x" style="margin-bottom:10px;"></i><br>
                    تعذر الاتصال بخوادم الخرائط حالياً.<br>
                    <button type="button" onclick="fetchMosques(${lat}, ${lng}, ${radius})" style="margin-top:10px; background:rgba(197,168,89,0.2); border:1px solid var(--gold); color:var(--gold); padding:6px 16px; border-radius:20px; cursor:pointer; font-family:inherit;">
                        <i class="fa-solid fa-rotate-right"></i> إعادة المحاولة
                    </button>
                </div>`;
            if (typeof showToast === 'function') showToast('حدث خطأ في جلب البيانات، يرجى المحاولة ثانية', 3000, 'error');
            return;
        }

        // Process elements and filter non-Islamic or non-mosque entities
        const rawMosques = [];
        elements.forEach((el) => {
            const mLat = el.lat || (el.center && el.center.lat);
            const mLng = el.lon || (el.center && el.center.lon);
            if (!mLat || !mLng) return;
            
            const tags = el.tags || {};

            // Exclude commercial shops, pharmacies, schools that might have "مسجد" in their address
            if (tags.shop || tags.office || (tags.amenity && !['place_of_worship', 'mosque', 'community_centre'].includes(tags.amenity))) {
                return;
            }

            // Exclude if religion explicitly non-Muslim
            if (tags.religion && tags.religion.toLowerCase() !== 'muslim') return;

            const rawName = tags.name || tags['name:ar'] || tags['name:en'] || '';
            const lowerName = rawName.toLowerCase();

            // Exclude churches, monasteries, cathedrals, cemeteries
            if (lowerName.includes('كنيسة') || lowerName.includes('دير') || lowerName.includes('مطرانية') || 
                lowerName.includes('كاتدرائية') || lowerName.includes('church') || lowerName.includes('synagogue') || 
                lowerName.includes('cathedral') || lowerName.includes('monastery') || lowerName.includes('مدافن') || 
                lowerName.includes('مقبرة') || lowerName.includes('cemetery') || lowerName.includes('saint') || lowerName.includes('coptic')) {
                return;
            }

            let name = rawName.trim() || 'مسجد';
            if (name.startsWith("شارع ")) name = name.replace("شارع ", "");
            
            let areaName = '';
            if (tags['addr:suburb']) areaName = tags['addr:suburb'];
            else if (tags['addr:city']) areaName = tags['addr:city'];
            else if (tags['addr:village']) areaName = tags['addr:village'];
            else if (tags['addr:street']) areaName = tags['addr:street'];
            if (areaName.startsWith("شارع ")) areaName = areaName.replace("شارع ", "");

            let distNum = 0;
            if (currentPos) {
                distNum = getDistance(currentPos.lat, currentPos.lng, mLat, mLng);
            }

            // Exclude anything strictly beyond requested radius (allow 100m margin for center calculation)
            if (radius && distNum > radius + 100) return;

            rawMosques.push({ lat: mLat, lng: mLng, name, areaName, dist: distNum });
        });

        // Deduplicate: merge nodes & ways/relations referring to the same mosque (< 35m distance)
        const dedupedMosques = [];
        for (const item of rawMosques) {
            const existing = dedupedMosques.find(d => getDistance(d.lat, d.lng, item.lat, item.lng) < 35);
            if (existing) {
                // If existing has generic 'مسجد' and current item has a specific name, upgrade
                if (existing.name === 'مسجد' && item.name !== 'مسجد') {
                    existing.name = item.name;
                }
                if (!existing.areaName && item.areaName) {
                    existing.areaName = item.areaName;
                }
            } else {
                dedupedMosques.push(item);
            }
        }

        // Sort by closest first
        dedupedMosques.sort((a, b) => a.dist - b.dist);

        // Build markers and mosqueData
        dedupedMosques.forEach((m, index) => {
            const formattedDist = m.dist < 1000 ? `${m.dist} متر` : `${(m.dist / 1000).toFixed(1)} كم`;

            const marker = L.marker([m.lat, m.lng], { icon: L.divIcon({
                className:'', iconSize:[32,32], iconAnchor:[16,32],
                html:`<div style="background:var(--gold); width:32px; height:32px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 0 10px rgba(0,0,0,0.6);">
                    <i aria-hidden="true" class="fa-solid fa-mosque" style="color:#000; font-size:15px; transform:rotate(45deg);"></i>
                </div>`
            })}).bindPopup(`
                <div style="text-align:right; direction:rtl; font-family:'Tajawal', sans-serif;">
                    <div style="font-size:15px; font-weight:800; color:#fff; margin-bottom:5px;">${m.name}</div>
                    <div style="display:flex; justify-content:space-between; gap:12px; align-items:center; margin-bottom:8px;">
                        <span style="color:#aaa; font-size:12px;"><i class="fa-solid fa-map-pin"></i> ${m.areaName || 'مسجد'}</span>
                        <span style="color:var(--gold); font-size:12px; font-weight:bold;"><i class="fa-solid fa-person-walking"></i> ${formattedDist}</span>
                    </div>
                    <div style="display:flex; gap:6px; margin-top:8px;">
                        <button type="button" onclick="window.toggleLineToMosque(${m.lat}, ${m.lng})" style="flex:1; background:rgba(197,168,89,0.15); border:1px solid rgba(197,168,89,0.4); padding:5px 8px; border-radius:5px; text-align:center; color:var(--gold); font-size:12px; cursor:pointer; font-family:inherit; font-weight:700;">
                            <i class="fa-solid fa-route"></i> المسافة
                        </button>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" style="flex:1; background:rgba(28,158,91,0.25); border:1px solid var(--green); padding:5px 8px; border-radius:5px; text-align:center; color:#2ecc71; font-size:12px; text-decoration:none; font-family:inherit; font-weight:700;">
                            <i class="fa-solid fa-location-arrow"></i> اتجاهات السير
                        </a>
                    </div>
                </div>
            `, { offset: [0, -20], className: 'custom-map-popup', closeButton: false });

            marker.on('mouseover', function() { this.openPopup(); });
            marker.addTo(map);
            mosqueMarkers.push(marker);
            
            mosqueData.push({ id: index, name: m.name, lat: m.lat, lng: m.lng, dist: m.dist, marker, areaName: m.areaName });
        });

        renderMosqueList();

        if (typeof showToast === 'function') {
            if (mosqueData.length > 0) {
                showToast(`تم العثور على ${mosqueData.length} مسجد ضمن نطاق ${radiusLabel}`, 3000, 'success');
            } else {
                showToast(`لم يتم العثور على مساجد ضمن نطاق ${radiusLabel}`, 3000, 'info');
            }
        }
    }
    
    function renderMosqueList() {
        const listEl = document.getElementById('mosques-list');
        const radiusLabel = selectedRadius >= 1000 ? (selectedRadius / 1000) + ' كم' : selectedRadius + ' متر';
        
        if (mosqueData.length === 0) {
            listEl.innerHTML = `
                <div style="text-align:center; padding:25px; color:#aaa; line-height:1.8;">
                    <i class="fa-solid fa-mosque" style="font-size:32px; color:rgba(197,168,89,0.5); margin-bottom:12px;"></i><br>
                    لم يتم العثور على مساجد مسجلة ضمن نطاق ${radiusLabel}.<br>
                    <button type="button" onclick="setSearchRadius(${selectedRadius + 1000})" style="margin-top:14px; background:rgba(197,168,89,0.2); border:1px solid var(--gold); color:var(--gold); padding:7px 18px; border-radius:20px; cursor:pointer; font-family:inherit; font-weight:700; font-size:13px;">
                        <i class="fa-solid fa-arrows-maximize"></i> توسيع البحث إلى ${((selectedRadius + 1000)/1000)} كم
                    </button>
                </div>`;
            return;
        }
        
        let html = '';
        mosqueData.forEach(m => {
            const formattedDist = m.dist < 1000 ? `${m.dist} متر` : `${(m.dist / 1000).toFixed(1)} كم`;
            html += `
                <div class="mosque-item" onclick="flyToMosque(${m.lat}, ${m.lng}, ${m.id})">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                        <div class="mosque-item-title"><i aria-hidden="true" class="fa-solid fa-mosque"></i> ${m.name}</div>
                        <span style="color:var(--gold); font-weight:800; font-size:12.5px; white-space:nowrap;">
                            <i class="fa-solid fa-person-walking"></i> ${formattedDist}
                        </span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; gap:8px; flex-wrap:wrap;">
                        <span id="list-area-${m.id}" style="color:#aaa; font-size:12px;"><i aria-hidden="true" class="fa-solid fa-map-pin"></i> ${m.areaName || 'مسجد'}</span>
                        <div style="display:flex; gap:6px;" onclick="event.stopPropagation();">
                            <button type="button" class="mosque-nav-link" onclick="window.toggleLineToMosque(${m.lat}, ${m.lng})" title="رسم خط المسافة">
                                <i class="fa-solid fa-route"></i> المسافة
                            </button>
                            <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" class="mosque-nav-link" title="الاتجاهات عبر خرائط جوجل" style="background:rgba(28,158,91,0.2); border-color:var(--green); color:#2ecc71;">
                                <i class="fa-solid fa-diamond-turn-right"></i> اتجاهات السير
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
        listEl.innerHTML = html;

        // Fetch area names in background if missing
        mosqueData.forEach((m, idx) => {
            if (!m.areaName || m.areaName === 'مسجد') {
                setTimeout(() => {
                    axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${m.lat}&longitude=${m.lng}&localityLanguage=ar`)
                        .then(res => {
                            let area = res.data.locality || res.data.city || '';
                            if (area.startsWith("شارع ")) area = area.replace("شارع ", "");
                            if (area) {
                                m.areaName = area;
                                const areaEl = document.getElementById(`list-area-${m.id}`);
                                if (areaEl) areaEl.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${area}`;
                            }
                        }).catch(() => {});
                }, idx * 400);
            }
        });
    }
    
    window.flyToMosque = function(lat, lng, id) {
        map.flyTo([lat, lng], 17, { duration: 1.2 });
        const target = mosqueData.find(m => m.id === id);
        if (target && target.marker) {
            setTimeout(() => target.marker.openPopup(), 1200);
        }
        
        if (window.innerWidth < 850) {
            document.getElementById('map-wrapper').scrollIntoView({behavior: 'smooth'});
        }
    };

    function searchByCityName() {
        const query = document.getElementById('search-input').value;
        if (!query) return;
        
        if (typeof showToast === 'function') showToast('جاري البحث عن المنطقة...', 2000, 'info');

        axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=ar`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const place = res.data[0];
                    const lat = parseFloat(place.lat);
                    const lng = parseFloat(place.lon);
                    const cityName = place.display_name.split(',')[0];
                    
                    document.getElementById('user-location-display').style.display = 'block';
                    document.getElementById('user-location-text').innerText = cityName;
                    
                    setUserLocationAndSearch(lat, lng, cityName, selectedRadius);
                } else {
                    if (typeof showToast === 'function') showToast('لم يتم العثور على المنطقة', 3000, 'warning');
                }
            })
            .catch(err => {
                console.error(err);
                if (typeof showToast === 'function') showToast('حدث خطأ أثناء البحث', 3000, 'error');
            });
    }

    function fetchUserLocationName(lat, lng) {
        axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`)
            .then(res => {
                let city = res.data.city || res.data.principalSubdivision || '';
                let locality = res.data.locality || '';
                let text = locality ? `${city}، ${locality}` : city;
                if (!text) text = 'موقعك الحالي';
                
                document.getElementById('user-location-display').style.display = 'block';
                document.getElementById('user-location-text').innerText = text;
                localStorage.setItem('quiblah_user_city', text);
            })
            .catch(() => {
                document.getElementById('user-location-display').style.display = 'block';
                document.getElementById('user-location-text').innerText = 'موقعك الحالي';
            });
    }

    function startLocationSearch() {
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('loader-text').style.display = 'inline-flex';
        document.getElementById('loader-text').innerHTML = `<i aria-hidden="true" class="fa-solid fa-spinner fa-spin"></i> جاري تحديد موقعك...`;

        if (!('geolocation' in navigator)) {
            document.getElementById('loader-text').innerHTML = `<span style="color:#e74c3c;">تحديد الموقع غير مدعوم</span>`;
            setTimeout(() => {
                document.getElementById('loader-text').style.display = 'none';
                document.getElementById('start-btn').style.display = 'inline-flex';
            }, 3000);
            return;
        }

        navigator.geolocation.getCurrentPosition(pos => {
            currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            localStorage.setItem('quiblah_user_lat', currentPos.lat);
            localStorage.setItem('quiblah_user_lng', currentPos.lng);

            document.getElementById('loader-text').innerHTML = `
                <i aria-hidden="true" class="fa-solid fa-spinner fa-spin"></i> جاري البحث...
            `;
            setUserLocationAndSearch(currentPos.lat, currentPos.lng, 'موقعك الحالي', selectedRadius); 
            fetchUserLocationName(currentPos.lat, currentPos.lng);

            document.getElementById('loader-text').style.display = 'none';
            document.getElementById('start-btn').style.display = 'inline-flex';
        }, (err) => {
            console.warn("GPS error:", err);
            // Fallback to Cairo or cached location if GPS is off
            const cachedLat = localStorage.getItem('quiblah_user_lat');
            const cachedLng = localStorage.getItem('quiblah_user_lng');
            if (!currentPos && cachedLat && cachedLng) {
                currentPos = { lat: parseFloat(cachedLat), lng: parseFloat(cachedLng) };
                setUserLocationAndSearch(currentPos.lat, currentPos.lng, 'موقعك المسجل', selectedRadius);
            } else if (!currentPos) {
                setUserLocationAndSearch(30.0444, 31.2357, 'القاهرة (افتراضي)', selectedRadius);
            }

            document.getElementById('loader-text').innerHTML = `
                <i aria-hidden="true" class="fa-solid fa-triangle-exclamation" style="color:#e74c3c;"></i> <span style="color:#e74c3c;">يرجى تفعيل خدمة الموقع GPS لدقة أفضل</span>`;
            setTimeout(() => {
                document.getElementById('loader-text').style.display = 'none';
                document.getElementById('start-btn').style.display = 'inline-flex';
            }, 4000);
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
    }

    function toggleListSearch() {
        const input = document.getElementById('list-search-input');
        const icon = document.getElementById('toggle-list-search');
        if (input.style.display === 'none') {
            input.style.display = 'block';
            input.focus();
            icon.style.color = 'var(--gold)';
        } else {
            input.style.display = 'none';
            input.value = '';
            icon.style.color = '#aaa';
            filterMosqueList();
        }
    }

    function filterMosqueList() {
        const query = document.getElementById('list-search-input').value.toLowerCase();
        const items = document.querySelectorAll('.mosque-item');
        items.forEach(item => {
            const text = item.innerText.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
