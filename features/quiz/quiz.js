// features/quiz/quiz.js - محرك المسابقات والأسئلة الدينية التفاعلي

(function () {
    // --- 1. Audio Synthesizer (Web Audio API - بدون أي ملفات خارجية) ---
    class SoundFX {
        constructor() {
            this.ctx = null;
            this.enabled = localStorage.getItem('quiblah_quiz_sound') !== 'false';
        }

        initContext() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        toggleSound() {
            this.enabled = !this.enabled;
            localStorage.setItem('quiblah_quiz_sound', this.enabled);
            return this.enabled;
        }

        play(type) {
            if (!this.enabled) return;
            try {
                this.initContext();
                if (!this.ctx) return;
                const now = this.ctx.currentTime;

                if (type === 'correct') {
                    // نغمة نجاح ثلاثية رخيمة ومبهجة (C5 -> E5 -> G5)
                    const notes = [523.25, 659.25, 783.99];
                    notes.forEach((freq, idx) => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                        gain.gain.setValueAtTime(0, now + idx * 0.08);
                        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.03);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
                        osc.connect(gain);
                        gain.connect(this.ctx.destination);
                        osc.start(now + idx * 0.08);
                        osc.stop(now + idx * 0.08 + 0.36);
                    });
                } else if (type === 'wrong') {
                    // نغمة خطأ منخفضة ولطيفة غير مزعجة
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(180, now);
                    osc.frequency.exponentialRampToValueAtTime(110, now + 0.28);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.3);
                } else if (type === 'click') {
                    // نقرة خفيفة
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(600, now);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.06);
                } else if (type === 'victory') {
                    // عزف تتويج واحتفال تصاعدي (C -> G -> C -> E)
                    const fanfare = [523.25, 783.99, 1046.50, 1318.51];
                    fanfare.forEach((freq, idx) => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
                        gain.gain.setValueAtTime(0, now + idx * 0.12);
                        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.04);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);
                        osc.connect(gain);
                        gain.connect(this.ctx.destination);
                        osc.start(now + idx * 0.12);
                        osc.stop(now + idx * 0.12 + 0.65);
                    });
                }
            } catch (e) {
                console.warn('Sound error:', e);
            }
        }
    }

    // --- 2. Canvas Confetti (قصاصات احتفالية) ---
    class Confetti {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.particles = [];
            this.animating = false;
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            if (this.canvas) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
        }

        burst(count = 90) {
            if (!this.canvas || !this.ctx) return;
            this.resize();
            const colors = ['#C5A859', '#dfc26e', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6', '#ffffff'];
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 2 + 50,
                    w: Math.random() * 9 + 5,
                    h: Math.random() * 5 + 3,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    vx: (Math.random() - 0.5) * 16,
                    vy: (Math.random() - 0.8) * 15,
                    gravity: 0.28,
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 12,
                    opacity: 1,
                    decay: Math.random() * 0.01 + 0.01
                });
            }
            if (!this.animating) {
                this.animating = true;
                this.animate();
            }
        }

        animate() {
            if (!this.animating) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.rotation += p.rotationSpeed;
                p.opacity -= p.decay;

                if (p.opacity <= 0 || p.y > this.canvas.height) {
                    this.particles.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.globalAlpha = p.opacity;
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                this.ctx.restore();
            }

            if (this.particles.length > 0) {
                requestAnimationFrame(() => this.animate());
            } else {
                this.animating = false;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    // --- 3. User Progress & Stats Store ---
    const Store = {
        get() {
            const raw = localStorage.getItem('quiblah_quiz_profile');
            if (raw) {
                try { return JSON.parse(raw); } catch (e) {}
            }
            return {
                xp: 0,
                highScore: 0,
                maxStreak: 0,
                totalAnswered: 0,
                totalCorrect: 0,
                completedStages: [1],
                badges: []
            };
        },
        save(data) {
            localStorage.setItem('quiblah_quiz_profile', JSON.stringify(data));
        },
        addXp(pts) {
            const data = this.get();
            data.xp = (data.xp || 0) + pts;
            this.save(data);
            return data.xp;
        },
        getRank(xp) {
            if (xp >= 3000) return { title: "الراسخون في العلم", level: 5, next: 5000 };
            if (xp >= 1800) return { title: "عالم ومحدث", level: 4, next: 3000 };
            if (xp >= 900) return { title: "فقيه الأمة", level: 3, next: 1800 };
            if (xp >= 350) return { title: "طالب علم مجتهد", level: 2, next: 900 };
            return { title: "باحث في المعرفة", level: 1, next: 350 };
        }
    };

    // --- 4. Main Quiz Engine ---
    const sound = new SoundFX();
    const confetti = new Confetti('confetti-canvas');

    const state = {
        mode: 'stages', // 'stages' | 'quick' | 'streak'
        category: 'all',
        level: 1,
        questions: [],
        currentIndex: 0,
        currentQuestion: null,
        score: 0,
        streak: 0,
        maxStreakThisRound: 0,
        correctCount: 0,
        wrongCount: 0,
        roundAnswers: [],
        timerSeconds: 20,
        timerInterval: null,
        answered: false,
        lifeline5050Used: false,
        lifelineFreezeUsed: false,
        lifelineSkipUsed: false
    };

    // DOM Elements
    const elements = {
        // Screens
        screenLobby: document.getElementById('screen-lobby'),
        screenGame: document.getElementById('screen-game'),
        screenSummary: document.getElementById('screen-summary'),

        // Lobby elements
        userTitle: document.getElementById('quiz-user-title'),
        rankLabel: document.getElementById('quiz-rank-label'),
        xpFill: document.getElementById('quiz-xp-fill'),
        statXp: document.getElementById('stat-xp'),
        statAccuracy: document.getElementById('stat-accuracy'),
        statStreak: document.getElementById('stat-streak'),
        categoriesGrid: document.getElementById('categories-grid'),
        modesGrid: document.getElementById('modes-grid'),
        levelsWrap: document.getElementById('levels-wrap'),
        startCta: document.getElementById('quiz-start-cta'),

        // Game elements
        progressCurrent: document.getElementById('q-progress-current'),
        progressTotal: document.getElementById('q-progress-total'),
        progressFill: document.getElementById('game-progress-fill'),
        streakBadge: document.getElementById('streak-flame-badge'),
        streakVal: document.getElementById('streak-val'),
        scoreVal: document.getElementById('score-val'),
        timerPill: document.getElementById('game-timer-pill'),
        timerVal: document.getElementById('timer-val'),
        catPill: document.getElementById('question-cat-pill'),
        levelPill: document.getElementById('question-level-pill'),
        qText: document.getElementById('question-text'),
        choicesContainer: document.getElementById('choices-container'),
        explanationCard: document.getElementById('explanation-card'),
        explanationText: document.getElementById('explanation-text'),
        explanationSource: document.getElementById('explanation-source'),
        btnNextQuestion: document.getElementById('btn-next-question'),
        btn5050: document.getElementById('lifeline-5050'),
        btnFreeze: document.getElementById('lifeline-freeze'),
        btnSkip: document.getElementById('lifeline-skip'),

        // Summary elements
        summaryScore: document.getElementById('summary-score-val'),
        summaryCorrect: document.getElementById('summary-correct-val'),
        summaryWrong: document.getElementById('summary-wrong-val'),
        summaryXp: document.getElementById('summary-xp-val'),
        summaryStreak: document.getElementById('summary-streak-val'),
        reviewList: document.getElementById('round-review-list'),

        // Stats Modal
        statsModal: document.getElementById('stats-modal'),
        soundToggleBtn: document.getElementById('quiz-sound-toggle')
    };

    // --- Init ---
    function init() {
        initCarousel();
        renderLobby();
        bindEvents();
        updateSoundButtonIcon();
    }

    function initCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides.length > 1) {
            let current = 0;
            setInterval(() => {
                slides[current].classList.remove('active');
                current = (current + 1) % slides.length;
                slides[current].classList.add('active');
            }, 8000);
        }
    }

    function updateSoundButtonIcon() {
        if (!elements.soundToggleBtn) return;
        const icon = elements.soundToggleBtn.querySelector('i');
        if (sound.enabled) {
            icon.className = 'fa-solid fa-volume-high';
            elements.soundToggleBtn.classList.add('active');
            elements.soundToggleBtn.title = 'كتم المؤثرات الصوتية';
        } else {
            icon.className = 'fa-solid fa-volume-xmark';
            elements.soundToggleBtn.classList.remove('active');
            elements.soundToggleBtn.title = 'تفعيل المؤثرات الصوتية';
        }
    }

    // Render Lobby
    function renderLobby() {
        const profile = Store.get();
        const rank = Store.getRank(profile.xp);

        elements.userTitle.textContent = rank.title;
        elements.rankLabel.textContent = `المستوى ${rank.level} • ${profile.xp} نقطة XP`;

        const prevThreshold = rank.level === 1 ? 0 : (rank.level === 2 ? 350 : (rank.level === 3 ? 900 : 1800));
        const progressPercent = Math.min(100, Math.max(10, ((profile.xp - prevThreshold) / (rank.next - prevThreshold)) * 100));
        elements.xpFill.style.width = `${progressPercent}%`;

        elements.statXp.textContent = profile.xp.toLocaleString('ar-EG');
        const accuracy = profile.totalAnswered > 0 ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100) : 0;
        elements.statAccuracy.textContent = `${accuracy}%`;
        elements.statStreak.textContent = `${profile.maxStreak || 0}x`;

        // Render Categories
        elements.categoriesGrid.innerHTML = '';
        Object.values(QUIZ_CATEGORIES).forEach(cat => {
            const card = document.createElement('div');
            card.className = `category-card ${state.category === cat.id ? 'selected' : ''}`;
            card.dataset.catId = cat.id;
            card.innerHTML = `
                <i class="fa-solid ${cat.icon} category-icon" aria-hidden="true"></i>
                <div class="category-text-info">
                    <div class="category-name">${cat.name}</div>
                    <div class="category-sub">${cat.description}</div>
                </div>
            `;
            card.addEventListener('click', () => {
                sound.play('click');
                state.category = cat.id;
                document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                updateReadySummary();
            });
            elements.categoriesGrid.appendChild(card);
        });

        // Modes listener
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => {
                sound.play('click');
                state.mode = card.dataset.mode;
                document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                updateReadySummary();
            });
        });

        // Levels listener
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                sound.play('click');
                state.level = Number(btn.dataset.level);
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                updateReadySummary();
            });
        });

        updateReadySummary();
    }

    function updateReadySummary() {
        const readyCat = document.getElementById('ready-cat-pill');
        const readyLvl = document.getElementById('ready-lvl-pill');
        const readyMode = document.getElementById('ready-mode-pill');

        if (readyCat) {
            const catObj = QUIZ_CATEGORIES[state.category] || QUIZ_CATEGORIES.all;
            readyCat.innerHTML = `<i class="fa-solid ${catObj.icon}"></i> ${catObj.name}`;
        }
        if (readyLvl) {
            const lvlObj = QUIZ_LEVELS[state.level] || QUIZ_LEVELS[1];
            const icon = state.level === 1 ? 'fa-seedling' : (state.level === 2 ? 'fa-book-open' : 'fa-graduation-cap');
            readyLvl.innerHTML = `<i class="fa-solid ${icon}"></i> مستوى: ${lvlObj.badge}`;
        }
        if (readyMode) {
            const modeTexts = {
                stages: '<i class="fa-solid fa-layer-group"></i> رحلة المراحل (10 أسئلة)',
                quick: '<i class="fa-solid fa-bolt"></i> الاختبار السريع (مؤقت 20 ثانية)',
                streak: '<i class="fa-solid fa-fire"></i> تحدي السلسلة (دون خطأ)'
            };
            readyMode.innerHTML = modeTexts[state.mode] || modeTexts.stages;
        }
    }

    function switchScreen(screenName) {
        elements.screenLobby.classList.remove('active');
        elements.screenGame.classList.remove('active');
        elements.screenSummary.classList.remove('active');

        if (screenName === 'lobby') {
            elements.screenLobby.classList.add('active');
            renderLobby();
        } else if (screenName === 'game') {
            elements.screenGame.classList.add('active');
        } else if (screenName === 'summary') {
            elements.screenSummary.classList.add('active');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Prepare and Start Round ---
    async function startRound() {
        sound.play('click');
        elements.startCta.disabled = true;
        elements.startCta.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إعداد التحدي...';

        let pool = [...BUILTIN_QUESTIONS];

        // تصفية حسب التصنيف والمستوى
        if (state.category !== 'all') {
            pool = pool.filter(q => q.category === state.category);
        }
        if (state.level) {
            pool = pool.filter(q => q.level === state.level);
        }

        // إذا كان العدد قليل أو اختيار متقدم، جلب أسئلة إضافية إن أمكن
        if (pool.length < 10) {
            const onlineQs = await fetchOnlineQuestions(state.category === 'all' ? 'hadith' : state.category, state.level);
            if (onlineQs && onlineQs.length > 0) {
                pool = pool.concat(onlineQs);
            }
        }

        // خلط الأسئلة
        shuffleArray(pool);

        // تحديد حجم الجولة
        const roundCount = state.mode === 'streak' ? pool.length : 10;
        state.questions = pool.slice(0, Math.max(roundCount, 5));

        // إعادة ضبط المتغيرات
        state.currentIndex = 0;
        state.score = 0;
        state.streak = 0;
        state.maxStreakThisRound = 0;
        state.correctCount = 0;
        state.wrongCount = 0;
        state.roundAnswers = [];
        state.lifeline5050Used = false;
        state.lifelineFreezeUsed = false;
        state.lifelineSkipUsed = false;

        // تحديث وسائل المساعدة
        resetLifelineButtons();

        elements.startCta.disabled = false;
        elements.startCta.innerHTML = '<i class="fa-solid fa-play"></i> ابدأ التحدي الآن';

        switchScreen('game');
        loadQuestion(0);
    }

    function resetLifelineButtons() {
        elements.btn5050.disabled = false;
        elements.btnFreeze.disabled = false;
        elements.btnSkip.disabled = false;
    }

    function loadQuestion(index) {
        if (index >= state.questions.length) {
            finishRound();
            return;
        }

        state.currentIndex = index;
        state.answered = false;
        state.currentQuestion = state.questions[index];
        const q = state.currentQuestion;

        // Update indicators
        elements.progressCurrent.textContent = index + 1;
        elements.progressTotal.textContent = state.questions.length;
        const pct = ((index) / state.questions.length) * 100;
        elements.progressFill.style.width = `${pct}%`;

        elements.scoreVal.textContent = state.score;
        elements.streakVal.textContent = `${state.streak}x`;

        // Category and Level Pill
        const catInfo = QUIZ_CATEGORIES[q.category] || QUIZ_CATEGORIES.all;
        elements.catPill.innerHTML = `<i class="fa-solid ${catInfo.icon}"></i> ${catInfo.name}`;
        const lvlInfo = QUIZ_LEVELS[q.level] || QUIZ_LEVELS[1];
        elements.levelPill.textContent = lvlInfo.badge;

        const modePill = document.getElementById('question-mode-pill');
        if (modePill) {
            const modeLabels = {
                stages: '<i class="fa-solid fa-layer-group"></i> رحلة المراحل',
                quick: '<i class="fa-solid fa-bolt"></i> الاختبار السريع',
                streak: '<i class="fa-solid fa-fire"></i> تحدي السلسلة'
            };
            modePill.innerHTML = modeLabels[state.mode] || modeLabels.stages;
        }

        // Question Text
        elements.qText.textContent = q.question;

        // Hide Explanation & Next button
        elements.explanationCard.classList.remove('active');
        elements.btnNextQuestion.style.display = 'none';

        // Choices
        const choices = [...q.choices];
        shuffleArray(choices);

        const letters = ['أ', 'ب', 'ج', 'د'];
        elements.choicesContainer.innerHTML = '';
        choices.forEach((choice, i) => {
            const btn = document.createElement('button');
            btn.className = 'choice-option';
            btn.innerHTML = `
                <span class="choice-letter">${letters[i] || (i + 1)}</span>
                <span class="choice-text">${choice}</span>
            `;
            btn.addEventListener('click', () => handleSelectAnswer(choice, btn));
            elements.choicesContainer.appendChild(btn);
        });

        // Start Timer
        startTimer();
    }

    function startTimer() {
        clearInterval(state.timerInterval);
        if (state.mode === 'quick') {
            state.timerSeconds = 20;
        } else if (state.mode === 'streak') {
            state.timerSeconds = 25;
        } else {
            // رحلة المراحل: وقت كافٍ ومريح للقراءة والتفكر في الأسئلة والفوائد
            state.timerSeconds = 35;
        }
        elements.timerPill.classList.remove('warning');
        elements.timerVal.textContent = `${state.timerSeconds}s`;

        state.timerInterval = setInterval(() => {
            state.timerSeconds--;
            elements.timerVal.textContent = `${state.timerSeconds}s`;

            if (state.timerSeconds <= 5) {
                elements.timerPill.classList.add('warning');
            }

            if (state.timerSeconds <= 0) {
                clearInterval(state.timerInterval);
                handleTimeOut();
            }
        }, 1000);
    }

    function handleTimeOut() {
        if (state.answered) return;
        sound.play('wrong');
        state.answered = true;
        state.wrongCount++;
        state.streak = 0;
        elements.streakBadge.classList.remove('pulsing');
        elements.streakVal.textContent = '0x';

        // Highlight correct answer
        highlightCorrectAnswer();

        // Record Answer
        state.roundAnswers.push({
            question: state.currentQuestion.question,
            userChoice: 'انتهى الوقت ولم تجب',
            correctChoice: state.currentQuestion.answer,
            isCorrect: false,
            explanation: state.currentQuestion.explanation
        });

        showExplanation();
        elements.btnNextQuestion.style.display = 'inline-flex';
        const isLastQuestionTimeout = (state.currentIndex >= state.questions.length - 1);
        if (isLastQuestionTimeout) {
            elements.btnNextQuestion.innerHTML = `<span>إنهاء وعرض النتيجة</span> <i class="fa-solid fa-trophy"></i>`;
        } else {
            elements.btnNextQuestion.innerHTML = `<span>السؤال التالي</span> <i class="fa-solid fa-arrow-left"></i>`;
        }

        if (state.mode === 'streak') {
            finishRound();
        }
    }

    function handleSelectAnswer(selectedText, optionBtn) {
        if (state.answered) return;
        state.answered = true;
        clearInterval(state.timerInterval);

        const q = state.currentQuestion;
        const isCorrect = selectedText === q.answer;

        // Disable all options
        document.querySelectorAll('.choice-option').forEach(b => b.classList.add('locked'));

        if (isCorrect) {
            sound.play('correct');
            optionBtn.classList.add('correct');

            state.correctCount++;
            state.streak++;
            if (state.streak > state.maxStreakThisRound) {
                state.maxStreakThisRound = state.streak;
            }

            // Points calculation (Base: 100 * Level multiplier * Streak multiplier)
            const lvlMultiplier = QUIZ_LEVELS[q.level] ? QUIZ_LEVELS[q.level].xpMultiplier : 1;
            const streakMultiplier = 1 + (state.streak - 1) * 0.25;
            const timeBonus = Math.max(0, Math.floor(state.timerSeconds * 2));
            const pointsGained = Math.round((100 * lvlMultiplier * streakMultiplier) + timeBonus);

            state.score += pointsGained;
            elements.scoreVal.textContent = state.score;

            elements.streakBadge.classList.add('pulsing');
            elements.streakVal.textContent = `${state.streak}x`;

            // Small celebratory confetti burst on streak >= 3
            if (state.streak >= 3 && state.streak % 3 === 0) {
                confetti.burst(30);
            }
        } else {
            sound.play('wrong');
            optionBtn.classList.add('wrong');
            state.wrongCount++;
            state.streak = 0;
            elements.streakBadge.classList.remove('pulsing');
            elements.streakVal.textContent = '0x';

            highlightCorrectAnswer();
        }

        // Record Answer
        state.roundAnswers.push({
            question: q.question,
            userChoice: selectedText,
            correctChoice: q.answer,
            isCorrect: isCorrect,
            explanation: q.explanation
        });

        showExplanation();
        elements.btnNextQuestion.style.display = 'inline-flex';

        // Update button text for final question or next question
        const isLastQuestion = (state.currentIndex >= state.questions.length - 1);
        if (isLastQuestion && (isCorrect || state.mode !== 'streak')) {
            elements.btnNextQuestion.innerHTML = `<span>إنهاء وعرض النتيجة</span> <i class="fa-solid fa-trophy"></i>`;
        } else {
            elements.btnNextQuestion.innerHTML = `<span>السؤال التالي</span> <i class="fa-solid fa-arrow-left"></i>`;
        }

        setTimeout(() => {
            elements.btnNextQuestion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 120);

        // In survival streak mode, game ends on wrong answer!
        if (!isCorrect && state.mode === 'streak') {
            setTimeout(() => finishRound(), 1200);
        }
    }

    function highlightCorrectAnswer() {
        const q = state.currentQuestion;
        document.querySelectorAll('.choice-option').forEach(b => {
            const text = b.querySelector('.choice-text').textContent;
            if (text === q.answer) {
                b.classList.add('correct');
            }
        });
    }

    function showExplanation() {
        const q = state.currentQuestion;
        if (q.explanation) {
            elements.explanationText.textContent = q.explanation;
            if (q.source) {
                elements.explanationSource.innerHTML = `<i class="fa-solid fa-bookmark"></i> المصدر: ${q.source}`;
            } else {
                elements.explanationSource.innerHTML = '';
            }
            elements.explanationCard.classList.add('active');
        }
    }

    // --- Lifelines ---
    function useLifeline5050() {
        if (state.answered || state.lifeline5050Used) return;
        sound.play('click');
        state.lifeline5050Used = true;
        elements.btn5050.disabled = true;

        const q = state.currentQuestion;
        const options = Array.from(document.querySelectorAll('.choice-option'));
        const wrongOptions = options.filter(btn => {
            const text = btn.querySelector('.choice-text').textContent;
            return text !== q.answer;
        });

        shuffleArray(wrongOptions);
        // إخفاء خيارين خاطئين فقط ليتبقى خياران بالضبط (الخيار الصحيح + خيار خاطئ واحد)
        const countToHide = Math.min(2, Math.max(1, wrongOptions.length - 1));
        wrongOptions.slice(0, countToHide).forEach(btn => btn.classList.add('hidden-5050'));
    }

    function useLifelineFreeze() {
        if (state.answered || state.lifelineFreezeUsed) return;
        sound.play('click');
        state.lifelineFreezeUsed = true;
        elements.btnFreeze.disabled = true;
        state.timerSeconds += 15;
        elements.timerVal.textContent = `${state.timerSeconds}s`;
        elements.timerPill.classList.remove('warning');
    }

    function useLifelineSkip() {
        if (state.answered || state.lifelineSkipUsed) return;
        sound.play('click');
        state.lifelineSkipUsed = true;
        elements.btnSkip.disabled = true;
        clearInterval(state.timerInterval);
        loadQuestion(state.currentIndex + 1);
    }

    // --- Finish Round & Summary ---
    function finishRound() {
        clearInterval(state.timerInterval);

        const total = state.questions.length || 10;
        const accuracyPct = Math.round((state.correctCount / total) * 100);

        // Feedback DOM elements
        const feedbackIcon = document.getElementById('summary-feedback-icon');
        const summaryTitle = document.getElementById('summary-title');
        const summarySubtitle = document.getElementById('summary-subtitle');

        // تقييم واقعي ودقيق للنتيجة
        if (state.correctCount === 0) {
            // نتيجة صفر: لا تتويج ولا قصاصات احتفالية بل توجيه واقعي لتدارك العلم
            if (feedbackIcon) {
                feedbackIcon.className = 'summary-feedback-icon neutral';
                feedbackIcon.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
            }
            if (summaryTitle) summaryTitle.textContent = 'لم توفق في هذه الجولة';
            if (summarySubtitle) {
                summarySubtitle.textContent = 'العلم الشرعي يُنال بالمدارسة والمحاولة. راجع الفوائد والإجابات الصحيحة في الأسفل، وأعد المحاولة لتثبيت المعرفة.';
            }
            sound.play('wrong');
        } else if (accuracyPct < 50) {
            // أقل من 50%: تشجيع واقعي بدون احتفال مبالغ
            if (feedbackIcon) {
                feedbackIcon.className = 'summary-feedback-icon neutral';
                feedbackIcon.innerHTML = '<i class="fa-solid fa-book-open"></i>';
            }
            if (summaryTitle) summaryTitle.textContent = 'بداية طيبة ومحاولة مفيدة';
            if (summarySubtitle) {
                summarySubtitle.textContent = `أجبت على ${state.correctCount} من أصل ${total} أسئلة بنجاح. بمراجعة الفوائد الشرعية ستعزز حصيلتك وتصل لدرجات أعلى.`;
            }
            sound.play('click');
        } else if (accuracyPct < 80) {
            // 50% إلى 79%: أداء جيد
            if (feedbackIcon) {
                feedbackIcon.className = 'summary-feedback-icon good';
                feedbackIcon.innerHTML = '<i class="fa-solid fa-star"></i>';
            }
            if (summaryTitle) summaryTitle.textContent = 'أداء متميز ونتيجة طيبة';
            if (summarySubtitle) {
                summarySubtitle.textContent = `أحسنت! حققت نسبة دقة ${accuracyPct}%، وهي حصيلة معرفية ممتازة، واصل خوض التحديات لترسيخ الفوائد.`;
            }
            sound.play('correct');
            confetti.burst(40);
        } else {
            // 80% فأعلى: تتويج كامل واحتفال
            if (feedbackIcon) {
                feedbackIcon.className = 'summary-feedback-icon trophy';
                feedbackIcon.innerHTML = '<i class="fa-solid fa-trophy"></i>';
            }
            if (summaryTitle) summaryTitle.textContent = 'ما شاء الله! إتقان وبراعة';
            if (summarySubtitle) {
                summarySubtitle.textContent = `تميز رائع بنسبة دقة ${accuracyPct}% واستحضار متقن للمعلومات والفوائد الشرعية.`;
            }
            sound.play('victory');
            confetti.burst(120);
        }

        // Add XP and Update Profile
        const xpEarned = state.score;
        Store.addXp(xpEarned);

        const profile = Store.get();
        profile.totalAnswered += state.questions.length;
        profile.totalCorrect += state.correctCount;
        if (state.score > (profile.highScore || 0)) {
            profile.highScore = state.score;
        }
        if (state.maxStreakThisRound > (profile.maxStreak || 0)) {
            profile.maxStreak = state.maxStreakThisRound;
        }
        Store.save(profile);

        // Update Summary UI
        elements.summaryScore.textContent = state.score.toLocaleString('ar-EG');
        elements.summaryCorrect.textContent = state.correctCount;
        elements.summaryWrong.textContent = state.wrongCount;
        elements.summaryXp.textContent = `+${xpEarned}`;
        elements.summaryStreak.textContent = `${state.maxStreakThisRound}x`;

        // Render Review List
        renderReviewList();

        switchScreen('summary');
    }

    function renderReviewList() {
        elements.reviewList.innerHTML = '';
        state.roundAnswers.forEach((ans, i) => {
            const item = document.createElement('div');
            item.className = 'review-item-card';
            item.innerHTML = `
                <div class="review-q-header">
                    <span>${i + 1}. ${ans.question}</span>
                    <span class="review-status-badge ${ans.isCorrect ? 'correct' : 'wrong'}">
                        ${ans.isCorrect ? '<i class="fa-solid fa-check"></i> إجابة صحيحة' : '<i class="fa-solid fa-xmark"></i> إجابة خاطئة'}
                    </span>
                </div>
                <div class="review-answer-line">إجابتك: <strong>${ans.userChoice}</strong></div>
                ${!ans.isCorrect ? `<div class="review-answer-line">الإجابة الصحيحة: <strong style="color: var(--green-correct);">${ans.correctChoice}</strong></div>` : ''}
                ${ans.explanation ? `<div class="review-answer-line" style="font-size: 12px; color: #94a3b8; margin-top: 6px;"><i class="fa-solid fa-lightbulb" style="color: var(--gold);"></i> ${ans.explanation}</div>` : ''}
            `;
            elements.reviewList.appendChild(item);
        });
    }

    // --- Helpers ---
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // --- Bind DOM Events ---
    function bindEvents() {
        // Start challenge CTA
        elements.startCta.addEventListener('click', startRound);

        // Next Question
        elements.btnNextQuestion.addEventListener('click', () => {
            sound.play('click');
            loadQuestion(state.currentIndex + 1);
        });

        // Lifelines
        elements.btn5050.addEventListener('click', useLifeline5050);
        elements.btnFreeze.addEventListener('click', useLifelineFreeze);
        elements.btnSkip.addEventListener('click', useLifelineSkip);

        // Sound Toggle
        elements.soundToggleBtn.addEventListener('click', () => {
            sound.toggleSound();
            updateSoundButtonIcon();
            sound.play('click');
        });

        // Review toggle in Summary
        const btnToggleReview = document.getElementById('btn-toggle-review');
        if (btnToggleReview) {
            btnToggleReview.addEventListener('click', () => {
                elements.reviewList.classList.toggle('active');
                btnToggleReview.innerHTML = elements.reviewList.classList.contains('active')
                    ? '<i class="fa-solid fa-chevron-up"></i> إخفاء مراجعة الأسئلة'
                    : '<i class="fa-solid fa-list-check"></i> مراجعة الأسئلة والإجابات';
            });
        }

        // Summary Actions
        document.getElementById('btn-restart-round').addEventListener('click', () => {
            startRound();
        });
        document.getElementById('btn-back-lobby').addEventListener('click', () => {
            sound.play('click');
            switchScreen('lobby');
        });

        // Stats Modal Open / Close
        const btnOpenStats = document.getElementById('quiz-stats-toggle');
        const btnCloseStats = document.getElementById('btn-close-stats');
        if (btnOpenStats && elements.statsModal) {
            btnOpenStats.addEventListener('click', () => {
                sound.play('click');
                renderBadges();
                elements.statsModal.classList.add('active');
            });
        }
        if (btnCloseStats && elements.statsModal) {
            btnCloseStats.addEventListener('click', () => {
                elements.statsModal.classList.remove('active');
            });
            elements.statsModal.addEventListener('click', (e) => {
                if (e.target === elements.statsModal) {
                    elements.statsModal.classList.remove('active');
                }
            });
        }

        // Keyboard Shortcuts (1, 2, 3, 4 for options, Space/Enter for Next)
        window.addEventListener('keydown', (e) => {
            if (!elements.screenGame.classList.contains('active')) return;
            const options = document.querySelectorAll('.choice-option');
            if (['1', '2', '3', '4'].includes(e.key)) {
                const idx = parseInt(e.key) - 1;
                if (options[idx] && !state.answered) {
                    options[idx].click();
                }
            } else if (e.key === 'Enter' || e.key === ' ') {
                if (state.answered && elements.btnNextQuestion.style.display !== 'none') {
                    e.preventDefault();
                    elements.btnNextQuestion.click();
                }
            }
        });
    }

    function renderBadges() {
        const profile = Store.get();
        const container = document.getElementById('modal-badges-grid');
        if (!container) return;

        const allBadges = [
            { id: 'first_win', name: 'أول فوز', desc: 'أجبت إجابة صحيحة', icon: 'fa-seedling', unlocked: profile.totalCorrect > 0 },
            { id: 'streak_5', name: 'شعلة العلم', desc: 'سلسلة 5 إجابات صحيحة متتالية', icon: 'fa-fire', unlocked: (profile.maxStreak || 0) >= 5 },
            { id: 'scholar_100', name: 'باحث مجتهد', desc: 'أجبت أكثر من 20 سؤالاً', icon: 'fa-book-open-reader', unlocked: (profile.totalAnswered || 0) >= 20 },
            { id: 'xp_1000', name: 'كنز الحسنات', desc: 'جمعت 1,000 نقطة XP', icon: 'fa-gem', unlocked: (profile.xp || 0) >= 1000 },
            { id: 'accuracy_master', name: 'دقة متناهية', desc: 'نسبة دقة تجاوزت 80%', icon: 'fa-bullseye', unlocked: profile.totalAnswered >= 10 && (profile.totalCorrect / profile.totalAnswered) >= 0.8 },
            { id: 'quran_lover', name: 'خبير الشريعة', desc: 'وصلت للمستوى المتقدم', icon: 'fa-crown', unlocked: (profile.xp || 0) >= 2500 }
        ];

        container.innerHTML = '';
        allBadges.forEach(b => {
            const item = document.createElement('div');
            item.className = `badge-item ${b.unlocked ? 'unlocked' : 'locked'}`;
            item.innerHTML = `
                <div class="badge-icon"><i class="fa-solid ${b.icon}"></i></div>
                <div class="badge-name">${b.name}</div>
                <div class="badge-desc">${b.desc}</div>
            `;
            container.appendChild(item);
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
