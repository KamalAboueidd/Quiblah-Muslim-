// features/reminders/reminders-page.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© reminders.html
// Header Carousel Logic
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 8000);

        // Page Reminders Controller
        (function() {
            const enableToggle = document.getElementById('page-enable-toggle');
            const statusBadge = document.getElementById('page-status-badge');
            const soundToggle = document.getElementById('page-sound-toggle');
            const intervalDropdown = document.getElementById('page-interval-dropdown');
            const intervalTrigger = document.getElementById('interval-dropdown-trigger');
            const intervalLabel = document.getElementById('interval-dropdown-label');
            const intervalItems = document.querySelectorAll('.dropdown-luxury-item');
            const btnSendTest = document.getElementById('page-btn-send-test');
            const btnPreviewSound = document.getElementById('page-btn-preview-sound');
            const salawatAudio = document.getElementById('salawat-audio-player');

            const typeSalawat = document.getElementById('page-type-salawat');
            const typeAdhkar = document.getElementById('page-type-adhkar');
            const typeQuran = document.getElementById('page-type-quran');
            const typeIstighfar = document.getElementById('page-type-istighfar');

            const intervalLabelsMap = {
                '5': 'كل 5 دقائق (الموصى به)',
                '15': 'كل 15 دقيقة',
                '30': 'كل 30 دقيقة',
                '60': 'كل ساعة (60 دقيقة)'
            };

            function syncPageUI() {
                if (!window.IslamicReminders) return;
                const settings = window.IslamicReminders.getSettings();

                enableToggle.checked = !!settings.enabled;
                soundToggle.checked = !!settings.sound;

                if (settings.enabled) {
                    statusBadge.textContent = `مفعّل (كل ${settings.interval || 5} دقائق)`;
                    statusBadge.classList.add('active');
                } else {
                    statusBadge.textContent = 'غير مفعّل';
                    statusBadge.classList.remove('active');
                }

                // Dropdown label
                const currentVal = String(settings.interval || 5);
                intervalLabel.textContent = intervalLabelsMap[currentVal] || intervalLabelsMap['5'];
                intervalItems.forEach(item => {
                    if (item.getAttribute('data-value') === currentVal) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });

                // Types
                typeSalawat.checked = !!settings.types.salawat;
                typeAdhkar.checked = !!settings.types.adhkar;
                typeQuran.checked = !!settings.types.quran;
                typeIstighfar.checked = !!settings.types.istighfar;
            }

            // Dropdown Toggle
            intervalTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                intervalDropdown.classList.toggle('open');
            });

            document.addEventListener('click', () => {
                intervalDropdown.classList.remove('open');
            });

            // Select Interval
            intervalItems.forEach(item => {
                item.addEventListener('click', function() {
                    const val = parseInt(this.getAttribute('data-value'), 10);
                    intervalDropdown.classList.remove('open');
                    if (window.IslamicReminders) {
                        const settings = window.IslamicReminders.getSettings();
                        settings.interval = val;
                        localStorage.setItem('quiblah_islamic_reminders', JSON.stringify(settings));
                        syncPageUI();
                        if (settings.enabled) {
                            // Update server subscription settings
                            fetch('./api/push/subscribe').catch(() => {});
                        }
                    }
                });
            });

            // Master Enable Toggle
            enableToggle.addEventListener('change', async function() {
                const wantEnabled = this.checked;
                const modalToggle = document.getElementById('reminder-enable-toggle');
                if (modalToggle) {
                    modalToggle.checked = wantEnabled;
                    modalToggle.dispatchEvent(new Event('change'));
                } else {
                    // Fallback
                    const settings = window.IslamicReminders.getSettings();
                    settings.enabled = wantEnabled;
                    localStorage.setItem('quiblah_islamic_reminders', JSON.stringify(settings));
                    syncPageUI();
                }
            });

            // Sound Toggle
            soundToggle.addEventListener('change', function() {
                const settings = window.IslamicReminders.getSettings();
                settings.sound = this.checked;
                localStorage.setItem('quiblah_islamic_reminders', JSON.stringify(settings));
                syncPageUI();
            });

            // Types Checkboxes
            [
                { el: typeSalawat, key: 'salawat' },
                { el: typeAdhkar, key: 'adhkar' },
                { el: typeQuran, key: 'quran' },
                { el: typeIstighfar, key: 'istighfar' }
            ].forEach(({ el, key }) => {
                el.addEventListener('change', function() {
                    const settings = window.IslamicReminders.getSettings();
                    settings.types[key] = this.checked;
                    localStorage.setItem('quiblah_islamic_reminders', JSON.stringify(settings));
                    syncPageUI();
                });
            });

            // Send Test Notification
            btnSendTest.addEventListener('click', () => {
                const testBtnInModal = document.getElementById('btn-send-test-push');
                if (testBtnInModal) {
                    testBtnInModal.click();
                } else {
                    alert('يرجى تفعيل التذكيرات أولاً للاشتراك في الإشعارات.');
                }
            });

            // Preview Salawat Audio
            let isPlayingSalawat = false;
            btnPreviewSound.addEventListener('click', () => {
                if (isPlayingSalawat) {
                    salawatAudio.pause();
                    salawatAudio.currentTime = 0;
                    isPlayingSalawat = false;
                    btnPreviewSound.innerHTML = `<i class="fa-solid fa-play"></i> <span>استماع لصوت "صلِّ على النبي"</span>`;
                } else {
                    salawatAudio.play().then(() => {
                        isPlayingSalawat = true;
                        btnPreviewSound.innerHTML = `<i class="fa-solid fa-pause"></i> <span>إيقاف الصوت</span>`;
                    }).catch(() => {
                        if (window.IslamicReminders) {
                            window.IslamicReminders.playChime();
                        }
                    });
                }
            });

            salawatAudio.addEventListener('ended', () => {
                isPlayingSalawat = false;
                btnPreviewSound.innerHTML = `<i class="fa-solid fa-play"></i> <span>استماع لصوت "صلِّ على النبي"</span>`;
            });

            // Listen to settings changes from modal
            window.addEventListener('load', () => {
                setTimeout(syncPageUI, 200);
            });
            window.addEventListener('storage', syncPageUI);
            document.addEventListener('click', () => {
                setTimeout(syncPageUI, 400);
            });
        })();
