// features/home/home.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© home.html
// Header Carousel Logic
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = 0;

        window.addEventListener('load', () => {
            slides.forEach(slide => {
                if (slide.dataset.bg) {
                    slide.style.backgroundImage = `url('${slide.dataset.bg}')`;
                }
            });
        });

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        // Change image every 8 seconds
        setInterval(nextSlide, 8000);

        // Standard App Logic
        let cities = [
            { ArabicName: "القاهرة", name: "Cairo" },
            { ArabicName: "الاسكندرية", name: "Alexandria" },
            { ArabicName: "الجيزة", name: "Giza" },
            { ArabicName: "السويس", name: "Suez" },
            { ArabicName: "بورسعيد", name: "Port Said" },
            { ArabicName: "المنصورة (الدقهلية)", name: "Dakahlia" },
            { ArabicName: "طنطا (الغربية)", name: "Gharbia" },
            { ArabicName: "الزقازيق (الشرقية)", name: "Al Sharqia" },
            { ArabicName: "بنها (القليوبية)", name: "Qalyubia" },
            { ArabicName: "دمنهور (البحيرة)", name: "Beheira" },
            { ArabicName: "كفر الشيخ", name: "Kafr el-Sheikh" },
            { ArabicName: "دمياط", name: "Damietta" },
            { ArabicName: "شبين الكوم (المنوفية)", name: "Monufia" },
            { ArabicName: "الفيوم", name: "Faiyum" },
            { ArabicName: "بني سويف", name: "Beni Suef" },
            { ArabicName: "المنيا", name: "Minya" },
            { ArabicName: "أسيوط", name: "Asyut" },
            { ArabicName: "سوهاج", name: "Sohag" },
            { ArabicName: "قنا", name: "Qena" },
            { ArabicName: "الأقصر", name: "Luxor" },
            { ArabicName: "أسوان", name: "Aswan" },
            { ArabicName: "مرسى مطروح", name: "Matrouh" },
            { ArabicName: "الغردقة (البحر الأحمر)", name: "Red Sea" },
            { ArabicName: "الخارجة (الوادي الجديد)", name: "New Valley" },
            { ArabicName: "الإسماعيلية", name: "Ismailia" },
            { ArabicName: "الطور (جنوب سيناء)", name: "South Sinai" },
        ];

        let currentCity = localStorage.getItem("selectedCity") || "Cairo";
        let isUsingLocation = false;
        let userLat = 0;
        let userLng = 0;
        let countdownInterval;
        let currentCityTimezone = "Africa/Cairo";
        let allVerses = [];

        function format12Hour(timeStr) {
            let parts = timeStr.split(":");
            let hours = parseInt(parts[0]);
            let minutes = parts[1];
            hours = hours % 12;
            hours = hours ? hours : 12; 
            let displayHours = hours < 10 ? '0' + hours : hours;
            return `${displayHours}:${minutes}`;
        }

        const selectWrapper = document.getElementById('custom-city-select');
        const selectedText = document.getElementById('selected-city-text');
        const optionsContainer = document.getElementById('custom-city-options');

        let customOptionsHTML = "";
        cities.forEach((city) => {
            let isSelected = city.name === currentCity ? 'selected' : '';
            if (city.name === currentCity) selectedText.textContent = city.ArabicName;
            customOptionsHTML += `<div class="custom-option ${isSelected}" data-value="${city.name}">${city.ArabicName}</div>`;
        });
        optionsContainer.innerHTML = customOptionsHTML;

        selectWrapper.querySelector('.custom-select-trigger').addEventListener('click', function(e) {
            selectWrapper.classList.toggle('open');
        });

        window.addEventListener('click', function(e) {
            if (!selectWrapper.contains(e.target)) {
                selectWrapper.classList.remove('open');
            }
        });

        optionsContainer.querySelectorAll('.custom-option').forEach(option => {
            option.addEventListener('click', function() {
                optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                selectedText.textContent = this.textContent;
                selectWrapper.classList.remove('open');
                
                isUsingLocation = false;
                currentCity = this.getAttribute('data-value');
                localStorage.setItem("selectedCity", currentCity);
                GetPrayersTimingsOfCity(currentCity);
            });
        });

        function fetchQuranVerses() {
            fetch('verses.json')
                .then(response => response.json())
                .then(data => {
                    allVerses = data;
                    rotateVerse();
                    setInterval(rotateVerse, 60000); 
                })
                .catch(error => console.error("Error loading verses:", error));
        }

        function rotateVerse() {
            if(allVerses.length === 0) return;
            const verseEl = document.getElementById("verse-text");
            const refEl = document.getElementById("verse-ref");
            
            verseEl.style.opacity = 0;
            
            setTimeout(() => {
                const randomVerse = allVerses[Math.floor(Math.random() * allVerses.length)];
                verseEl.innerHTML = randomVerse.text;
                refEl.innerHTML = randomVerse.reference;
                verseEl.style.opacity = 1;
            }, 500);
        }

        function FillTimerForPrayer(id, timeStr24) {
            const cleanTime24 = timeStr24.split(" ")[0]; 
            document.getElementById(id).innerHTML = format12Hour(cleanTime24);
        }

        function GetPrayersTimingsOfCity(cityName) {
            document.getElementById("loader").style.display = "block";
            
            let params = {
                country: "EG",
                city: cityName,
            };

            axios.get("https://api.aladhan.com/v1/timingsByCity", { params: params })
                .then((response) => {
                    document.getElementById("loader").style.display = "none";
                    
                    const data = response.data.data;
                    const timings = data.timings;
                    currentCityTimezone = data.meta.timezone;
                    
                    FillTimerForPrayer("fajr-time", timings.Fajr);
                    document.getElementById("shrouq-time").innerHTML = format12Hour(timings.Sunrise.split(" ")[0]);
                    FillTimerForPrayer("dhuhr-time", timings.Dhuhr);
                    FillTimerForPrayer("aser-time", timings.Asr);
                    FillTimerForPrayer("maghreb-time", timings.Sunset);
                    FillTimerForPrayer("isha-time", timings.Isha);

                    const hijriDate = `${data.date.hijri.day} ${data.date.hijri.month.ar} ${data.date.hijri.year} هـ`;
                    const gregDate = `${data.date.hijri.weekday.ar}، ${data.date.gregorian.day} ${data.date.gregorian.month.en} ${data.date.gregorian.year}`;
                    
                    document.getElementById("hijri-date").innerHTML = hijriDate;
                    document.getElementById("greg-date").innerHTML = gregDate;

                    setupNextPrayerCountdown(timings, currentCityTimezone);
                })
                .catch(error => {
                    console.error("Error fetching prayer times:", error);
                    document.getElementById("loader").style.display = "none";
                });
        }

        function detectLocation() {
            if ("geolocation" in navigator) {
                document.getElementById("loader").style.display = "block";
                navigator.geolocation.getCurrentPosition(function(position) {
                    isUsingLocation = true;
                    userLat = position.coords.latitude;
                    userLng = position.coords.longitude;
                    
                    // Reverse geocode
                    axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userLat}&longitude=${userLng}&localityLanguage=ar`)
                        .then(res => {
                            let cityName = res.data.city || res.data.principalSubdivision || "موقعك الحالي";
                            document.getElementById("selected-city-text").innerText = cityName;
                            
                            // Remove selection from standard list
                            document.getElementById('custom-city-options').querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                            
                            GetPrayersTimingsByCoordinates(userLat, userLng);
                        })
                        .catch(err => {
                            console.error(err);
                            document.getElementById("selected-city-text").innerText = "موقعك الحالي";
                            GetPrayersTimingsByCoordinates(userLat, userLng);
                        });
                }, function(error) {
                    console.error(error);
                    showToast("لم نتمكن من الوصول لموقعك. تأكد من تفعيل الموقع وإعطاء الصلاحية.", "fa-solid fa-triangle-exclamation");
                    document.getElementById("loader").style.display = "none";
                });
            } else {
                showToast("متصفحك لا يدعم تحديد الموقع.", "fa-solid fa-triangle-exclamation");
            }
        }

        function GetPrayersTimingsByCoordinates(lat, lng) {
            document.getElementById("loader").style.display = "block";
            
            let params = {
                latitude: lat,
                longitude: lng,
                method: 5 // Egyptian General Authority of Survey
            };

            axios.get("https://api.aladhan.com/v1/timings", { params: params })
                .then((response) => {
                    document.getElementById("loader").style.display = "none";
                    
                    const data = response.data.data;
                    const timings = data.timings;
                    currentCityTimezone = data.meta.timezone;
                    
                    FillTimerForPrayer("fajr-time", timings.Fajr);
                    document.getElementById("shrouq-time").innerHTML = format12Hour(timings.Sunrise.split(" ")[0]);
                    FillTimerForPrayer("dhuhr-time", timings.Dhuhr);
                    FillTimerForPrayer("aser-time", timings.Asr);
                    FillTimerForPrayer("maghreb-time", timings.Sunset);
                    FillTimerForPrayer("isha-time", timings.Isha);

                    const hijriDate = `${data.date.hijri.day} ${data.date.hijri.month.ar} ${data.date.hijri.year} هـ`;
                    const gregDate = `${data.date.hijri.weekday.ar}، ${data.date.gregorian.day} ${data.date.gregorian.month.en} ${data.date.gregorian.year}`;
                    
                    document.getElementById("hijri-date").innerHTML = hijriDate;
                    document.getElementById("greg-date").innerHTML = gregDate;

                    setupNextPrayerCountdown(timings, currentCityTimezone);
                })
                .catch(error => {
                    console.error("Error fetching prayer times:", error);
                    document.getElementById("loader").style.display = "none";
                });
        }

        function playAzanAlarm(prayerName) {
            const audio = document.getElementById('azan-audio');
            if (audio) {
                audio.play().catch(e => console.log("Audio play prevented by browser", e));
            }
            if (window.showToast) {
                window.showToast(`الآن موعد صلاة ${prayerName}`, "fa-solid fa-mosque", 15000);
            }
        }

        function setupNextPrayerCountdown(timings, timezone) {
            if (countdownInterval) clearInterval(countdownInterval);
            
            const prayerTimes = [
                { name: "الفجر", id: "fajr-time", cardId: "card-fajr", time: timings.Fajr.split(" ")[0] },
                { name: "الظهر", id: "dhuhr-time", cardId: "card-dhuhr", time: timings.Dhuhr.split(" ")[0] },
                { name: "العصر", id: "aser-time", cardId: "card-asr", time: timings.Asr.split(" ")[0] },
                { name: "المغرب", id: "maghreb-time", cardId: "card-maghrib", time: timings.Sunset.split(" ")[0] },
                { name: "العشاء", id: "isha-time", cardId: "card-isha", time: timings.Isha.split(" ")[0] }
            ];

            function tick() {
                const nowStr = new Date().toLocaleString("en-US", { timeZone: timezone });
                const now = new Date(nowStr);

                let nextPrayer = null;
                let nextPrayerDate = null;

                for (let i = 0; i < prayerTimes.length; i++) {
                    let pTime = prayerTimes[i].time.split(':');
                    let pDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(pTime[0]), parseInt(pTime[1]), 0);
                    
                    if (pDate > now) {
                        nextPrayer = prayerTimes[i];
                        nextPrayerDate = pDate;
                        break;
                    }
                }

                if (!nextPrayer) {
                    nextPrayer = prayerTimes[0];
                    let pTime = nextPrayer.time.split(':');
                    nextPrayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, parseInt(pTime[0]), parseInt(pTime[1]), 0);
                }

                document.querySelectorAll('.prayer-card').forEach(c => c.classList.remove('active'));
                document.getElementById(nextPrayer.cardId).classList.add('active');
                
                document.getElementById('next-prayer-name').innerText = nextPrayer.name;

                let distance = nextPrayerDate.getTime() - now.getTime();

                if (distance < 0) {
                    if (isUsingLocation) {
                        GetPrayersTimingsByCoordinates(userLat, userLng);
                    } else {
                        GetPrayersTimingsOfCity(currentCity);
                    }
                    return;
                }

                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (hours === 0 && minutes === 0 && seconds === 0) {
                    playAzanAlarm(nextPrayer.name);
                }

                document.getElementById('countdown-timer').innerText = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }

            tick();
            countdownInterval = setInterval(tick, 1000);
        }

        // Run
        fetchQuranVerses();
        GetPrayersTimingsOfCity(currentCity);
