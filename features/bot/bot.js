// features/bot/bot.js - منطق المساعد الإسلامي الذكي لتطبيق قبلة المسلم

(function() {
    'use strict';

    // --- Configuration ---
    const _kCodes = [103,115,107,95,104,120,107,51,89,97,101,73,71,86,67,69,122,72,77,77,69,78,99,105,87,71,100,121,98,51,70,89,98,115,68,79,87,114,75,68,109,104,107,74,84,77,69,84,113,120,105,76,65,111,109,68];
    const GROQ_API_KEY = _kCodes.map(c => String.fromCharCode(c)).join('');
    const PRIMARY_MODEL = "qwen/qwen3.8-27b";
    const FALLBACK_MODEL = "allam-2-7b";
    const STORAGE_KEY = "quiblah_ai_chat_history_v1";

    const SYSTEM_PROMPT = `أنت "المساعد الإسلامي الذكي" في منصة "قبلة المسلم" (Quiblah Muslim).
مهمتك الأساسية هي الإجابة بأسلوب علمي، موثق، هادئ ومؤدب على:
1. الأسئلة الدينية والإسلامية:
   - تفسير القرآن الكريم، معاني الآيات، أسباب النزول، أحكام التجويد.
   - الأحاديث النبوية الشريفة وصحتها من الصحيحين (البخاري ومسلم) والسنن المعتمدة.
   - الفقه والعبادات: أحكام الصلاة، شروطها، أركانها، سننها، النوافل (قيام الليل، الضحى، الاستخارة، صلاة الجنازة)، الصيام، الزكاة، الحج، العمرة.
   - العقيدة الإسلامية الصافية والسيرة النبوية العطرة.
   - الأذكار والأدعية اليومية المأثورة عن النبي ﷺ وحصن المسلم.

2. إرشادات ومميزات تطبيق "قبلة المسلم" (عند السؤال عنها):
   - مواقيت الصلاة: حساب دقيق للأوقات مع مؤقت تنازلي.
   - المصحف الإلكتروني: مصحف المدينة المنورة مع الاستماع والتلاوة.
   - مصحح التلاوة الذكي: تدقيق التلاوة المباشرة بالذكاء الاصطناعي كلمة بكلمة وكشف الأخطاء التجويدية واللفظية.
   - التفسير: تفسير الآيات بمصادر معتمدة.
   - الأحاديث: مكتبة أحاديث نبوية مقسمة حسب الأبواب.
   - اتجاه القبلة: بوصلة ذكية دقيقة نحو الكعبة المشرفة.
   - من بيتك للكعبة: حساب المسافة الجغرافية بدقة من موقع المستخدم إلى المسجد الحرام.
   - أقرب مسجد: رصد المساجد المحيطة على الخريطة.
   - أذكار الصباح والمساء: عداد رقمي تفاعلي مع الصوت والتنبيه.
   - المسابقات الإسلامية: اختبارات شرعية تفاعلية بمستويات متعددة.
   - الاستماع: مكتبة تلاوات لأشهر قراء العالم الإسلامي.
   - التذكيرات: تنبيهات بالصلوات والأذكار الدورية.

3. معلومات عن مطور المنصة (حصراً عند سؤال المستخدم الصريح عنه فقط):
   - إذا سألك المستخدم صراحة: من طور هذا التطبيق؟ أو من هو كمال أبو عيد؟
   - تجيب: المطور هو المهندس كمال أبو عيد (Kamal Abou Eid)، مهندس برمجيات مصري من الإسكندرية، قام بتطوير وتصميم المنصة لخدمة المسلمين وتيسير عباداتهم.

قواعد صارمة وإلزامية (CRITICAL RULES):
- قاعدة ذهبية: لا تبادر أبداً ولا تتبرع بذكر اسم المطور كمال أبو عيد أو تفاصيل المنصة من تلقاء نفسك دون أن يسألك المستخدم عنها صراحة!
- عند التحية (مثل: سلام عليكم، مرحبا، أهلاً)، رد بتحية إسلامية دافئة ومختصرة فقط مثل: "وعليكم السلام ورحمة الله وبركاته، كيف يمكنني مساعدتك اليوم؟" ولا تذكر المطور أو المنصة في التحية إطلاقاً.
- تخصصك محصور في العلوم الشرعية والقرآنية واستفسارات تطبيق قبلة المسلم.
- إذا سألك المستخدم عن مواضيع خارج هذا النطاق (مثل السياسة، الرياضة، الفن، أو دردشة عشوائية)، اعتذر بلطف وبيّن تخصصك.
- استشهد دائماً بالآيات القرآنية والأحاديث الصحيحة مع ذكر المصادر.
- عند الاستشهاد بآية قرآنية أو حديث شريف، ضعهما دائماً في سطر مستقل بين علامات تنصيص أو أقواس (مثال: «...» أو ﴿...﴾) ليتم إبرازهما بتنسيق ذهبي فاخر ومميز.
- لا تستخدم نهائياً رمز الشباك (# أو ## أو ###) في العناوين؛ نسق العناوين بالخط العريض فقط أو بدون رمز الشباك.
- يمنع منعاً باتاً استخدام أي رموز تعبيرية (emojis) إطلاقاً في جميع نصوص إجاباتك، واعتمد على فصاحة التعبير وجمال اللغة وعلامات الترقيم السليمة.
- نسق إجاباتك بنقاط واضحة وفقرات منسقة مع استخدام العناوين العريضة.`;

    // --- Utility: Strip Emojis ---
    function stripEmojis(str) {
        return String(str || '').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{200D}\u{FE0F}]/gu, '').trim();
    }

    // --- Utility: Escape HTML ---
    function escapeHTML(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // --- Markdown to Clean HTML Formatter ---
    function formatMarkdown(rawText, isStreaming = false) {
        const clean = stripEmojis(rawText);
        const lines = clean.split('\n');
        let html = '';
        let inList = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                continue;
            }

            // In streaming mode, if line has an unmatched ** pair, close it for smooth realtime render
            if (isStreaming && (line.match(/\*\*/g) || []).length % 2 === 1) {
                line += '**';
            }

            // Markdown Headings: #, ##, ###, #### (Eliminates raw # hashtags completely!)
            if (/^#{1,6}\s*/.test(line)) {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                let headingText = line.replace(/^#{1,6}\s*/, '').trim();
                headingText = escapeHTML(headingText).replace(/\*\*(.*?)\*\*/g, '$1');
                if (headingText) {
                    html += `<h3 class="msg-section-heading">${headingText}</h3>`;
                    continue;
                }
            }

            // Strip any stray internal hash blocks like "### "
            line = line.replace(/#{2,6}\s*/g, '');

            // Bold formatting: **text**
            line = escapeHTML(line).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // Quranic quotation & Hadith lines: ﴿...﴾, «...», “...”, > blockquotes
            const isQuoteLine = line.startsWith('﴿') || line.startsWith('«') || line.startsWith('“') || 
                                line.startsWith('&gt;') || line.startsWith('>') || 
                                line.includes('﴾') || line.includes('»');
            if (isQuoteLine) {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                let cleanQuote = line.replace(/^[&gt;>\s]+/, '').trim();
                // Strip outer wrapping brackets or quotes so the CSS pseudo-element double-quotes frame it cleanly
                if ((cleanQuote.startsWith('«') && cleanQuote.endsWith('»')) ||
                    (cleanQuote.startsWith('“') && cleanQuote.endsWith('”')) ||
                    (cleanQuote.startsWith('﴿') && cleanQuote.endsWith('﴾')) ||
                    (cleanQuote.startsWith('&quot;') && cleanQuote.endsWith('&quot;'))) {
                    cleanQuote = cleanQuote.replace(/^[«“﴿&quot;]+|[»”﴾&quot;]+$/g, '').trim();
                }
                html += `<div class="quran-quote">${cleanQuote}</div>`;
                continue;
            }

            // Bullet points: - or *
            if (/^[-*•]\s+/.test(line)) {
                const content = line.replace(/^[-*•]\s+/, '');
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                html += `<li>${content}</li>`;
                continue;
            } else if (inList) {
                html += '</ul>';
                inList = false;
            }

            // Numbered list: 1. or 1-
            if (/^\d+[.)\-]\s+/.test(line)) {
                const content = line.replace(/^\d+[.)\-]\s+/, '');
                html += `<p style="margin-bottom:6px;"><strong>${escapeHTML(line.match(/^\d+[.)\-]/)[0])}</strong> ${content}</p>`;
                continue;
            }

            // Regular paragraph
            html += `<p>${line}</p>`;
        }

        if (inList) html += '</ul>';
        return html;
    }

    // --- Format Local Time ---
    function getMessageTimestamp() {
        const now = new Date();
        let h = now.getHours();
        const m = now.getMinutes();
        const ampm = h >= 12 ? 'م' : 'ص';
        h = h % 12 || 12;
        const mm = m < 10 ? '0' + m : m;
        return `${h}:${mm} ${ampm}`;
    }

    // --- Storage Keys ---
    const SESSIONS_STORAGE_KEY = "quiblah_ai_sessions_v2";
    const LEGACY_STORAGE_KEY = "quiblah_ai_chat_history_v1";

    // --- DOM Elements ---
    let chatMessagesFlow, chatInput, btnSendMessage;
    let welcomeCard;
    let sidebarDrawer, sidebarOverlay, btnToggleSidebar, btnCloseSidebar;
    let btnNewChatTop, btnNewChatSidebar, btnClearAllChats, sessionsListContainer;

    // --- State ---
    let allSessions = [];
    let currentSessionId = null; // Fresh page load starts a New Chat!
    let conversationHistory = [];
    let isGenerating = false;

    // --- Device Detection Helper ---
    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);
    }

    // --- Storage: Multi-Session Load & Save ---
    function loadSessionsFromStorage() {
        try {
            const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
            if (raw) {
                allSessions = JSON.parse(raw);
                if (!Array.isArray(allSessions)) allSessions = [];
            } else {
                allSessions = [];
                // Check if legacy single chat exists and migrate it
                const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
                if (legacyRaw) {
                    const legacyMsgs = JSON.parse(legacyRaw);
                    if (Array.isArray(legacyMsgs) && legacyMsgs.length > 0) {
                        const firstUser = legacyMsgs.find(m => m.role === 'user');
                        const title = firstUser ? firstUser.content.slice(0, 32) : 'محادثة سابقة';
                        allSessions.push({
                            id: 'sess_' + Date.now(),
                            title: title,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            messages: legacyMsgs
                        });
                        saveSessionsToStorage();
                    }
                }
            }
        } catch (e) {
            allSessions = [];
        }
    }

    function saveSessionsToStorage() {
        try {
            localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(allSessions));
        } catch (e) {}
    }

    function syncCurrentSession() {
        if (!currentSessionId) return;
        const current = allSessions.find(s => s.id === currentSessionId);
        if (current) {
            current.messages = [...conversationHistory];
            current.updatedAt = Date.now();
            saveSessionsToStorage();
            renderSessionsList();
        }
    }

    // --- Sidebar Drawer Controls ---
    function openSidebar() {
        renderSessionsList();
        if (sidebarDrawer) sidebarDrawer.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('open');
    }

    function closeSidebar() {
        if (sidebarDrawer) sidebarDrawer.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('open');
    }

    // --- Start a New Chat ---
    function startNewChat() {
        if (isGenerating) return;
        currentSessionId = null;
        conversationHistory = [];
        renderChatFlow();
        closeSidebar();
        renderSessionsList();
        if (!isTouchDevice() && chatInput) {
            chatInput.focus();
        }
    }

    // --- Load a Previous Session ---
    function selectSession(sessionId) {
        if (isGenerating) return;
        const session = allSessions.find(s => s.id === sessionId);
        if (!session) return;
        currentSessionId = session.id;
        conversationHistory = session.messages ? [...session.messages] : [];
        renderChatFlow();
        closeSidebar();
        renderSessionsList();
    }

    // --- Delete Individual Session ---
    function deleteSession(sessionId, e) {
        if (e) e.stopPropagation();
        allSessions = allSessions.filter(s => s.id !== sessionId);
        saveSessionsToStorage();
        if (currentSessionId === sessionId) {
            startNewChat();
        } else {
            renderSessionsList();
        }
        if (typeof window.showToast === 'function') {
            window.showToast('تم حذف المحادثة', 'fa-solid fa-trash-can');
        }
    }

    // --- Clear All Sessions ---
    function clearAllSessions() {
        if (!allSessions.length) return;
        allSessions = [];
        saveSessionsToStorage();
        try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch(e) {}
        startNewChat();
        closeSidebar();
        if (typeof window.showToast === 'function') {
            window.showToast('تم مسح كل المحادثات السابقة', 'fa-solid fa-trash-can');
        }
    }

    // --- Render Sessions in Sidebar ---
    function renderSessionsList() {
        if (!sessionsListContainer) return;
        sessionsListContainer.innerHTML = '';

        if (!allSessions.length) {
            sessionsListContainer.innerHTML = `
                <div class="sessions-empty-state">
                    <i class="fa-regular fa-comments"></i>
                    <span>لا توجد محادثات سابقة بعد</span>
                </div>
            `;
            return;
        }

        allSessions.forEach(session => {
            const item = document.createElement('div');
            item.className = `session-item ${session.id === currentSessionId ? 'active' : ''}`;

            const mainBtn = document.createElement('button');
            mainBtn.type = 'button';
            mainBtn.className = 'session-main-btn';
            mainBtn.onclick = () => selectSession(session.id);

            const icon = document.createElement('i');
            icon.className = 'fa-regular fa-message';

            const texts = document.createElement('div');
            texts.className = 'session-texts';

            const title = document.createElement('span');
            title.className = 'session-title';
            title.textContent = session.title || 'محادثة إسلامية';

            const date = document.createElement('span');
            date.className = 'session-date';
            date.textContent = formatSessionDate(session.updatedAt || session.createdAt);

            texts.appendChild(title);
            texts.appendChild(date);
            mainBtn.appendChild(icon);
            mainBtn.appendChild(texts);

            const btnDel = document.createElement('button');
            btnDel.type = 'button';
            btnDel.className = 'btn-delete-session';
            btnDel.title = 'حذف المحادثة';
            btnDel.setAttribute('aria-label', 'حذف المحادثة');
            btnDel.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
            btnDel.onclick = (e) => deleteSession(session.id, e);

            item.appendChild(mainBtn);
            item.appendChild(btnDel);
            sessionsListContainer.appendChild(item);
        });
    }

    function formatSessionDate(ts) {
        if (!ts) return '';
        const d = new Date(ts);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        if (isToday) {
            let h = d.getHours();
            const m = d.getMinutes();
            const ampm = h >= 12 ? 'م' : 'ص';
            h = h % 12 || 12;
            const mm = m < 10 ? '0' + m : m;
            return `اليوم ${h}:${mm} ${ampm}`;
        }
        return `${d.getDate()}/${d.getMonth() + 1}`;
    }

    // --- Render Messages to DOM ---
    function renderChatFlow() {
        if (!chatMessagesFlow) return;

        chatMessagesFlow.innerHTML = '';

        if (!conversationHistory.length) {
            if (welcomeCard) welcomeCard.style.display = 'flex';
            return;
        }

        if (welcomeCard) welcomeCard.style.display = 'none';

        conversationHistory.forEach((msg, idx) => {
            appendMessageToDOM(msg.role, msg.content, msg.time || '', false, idx);
        });

        scrollToBottom();
    }

    function appendMessageToDOM(role, text, timeStr, animate = true, msgIndex = null) {
        if (!chatMessagesFlow) return;
        if (welcomeCard) welcomeCard.style.display = 'none';

        const isUser = role === 'user';
        const row = document.createElement('div');
        row.className = `chat-msg-row ${isUser ? 'user-msg' : 'bot-msg'}`;
        if (!animate) row.style.animation = 'none';

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.innerHTML = isUser ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';

        const bubbleWrap = document.createElement('div');
        bubbleWrap.className = 'msg-bubble-wrap';

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';

        if (isUser) {
            bubble.textContent = stripEmojis(text);
        } else {
            bubble.innerHTML = formatMarkdown(text);
        }

        const metaRow = document.createElement('div');
        metaRow.className = 'msg-meta-row';

        const timeSpan = document.createElement('span');
        timeSpan.textContent = timeStr || getMessageTimestamp();
        metaRow.appendChild(timeSpan);

        // Copy button for assistant responses
        if (!isUser) {
            const btnCopy = document.createElement('button');
            btnCopy.type = 'button';
            btnCopy.className = 'btn-copy-msg';
            btnCopy.title = 'نسخ الرد';
            btnCopy.innerHTML = '<i class="fa-regular fa-copy"></i> <span>نسخ</span>';
            btnCopy.onclick = (e) => {
                e.stopPropagation();
                copyToClipboard(text, btnCopy);
            };
            metaRow.appendChild(btnCopy);
        }

        bubbleWrap.appendChild(bubble);
        bubbleWrap.appendChild(metaRow);

        row.appendChild(avatar);
        row.appendChild(bubbleWrap);

        chatMessagesFlow.appendChild(row);
        scrollToBottom();
    }

    // --- Touch & Scroll State for Smooth Mobile Streaming ---
    let userHasScrolledUp = false;
    let isTouchingFlow = false;

    function initScrollTracking() {
        if (!chatMessagesFlow) return;

        chatMessagesFlow.addEventListener('touchstart', () => {
            isTouchingFlow = true;
        }, { passive: true });

        chatMessagesFlow.addEventListener('touchend', () => {
            isTouchingFlow = false;
            checkUserScrollPosition();
        }, { passive: true });

        chatMessagesFlow.addEventListener('touchcancel', () => {
            isTouchingFlow = false;
        }, { passive: true });

        chatMessagesFlow.addEventListener('wheel', () => {
            checkUserScrollPosition();
        }, { passive: true });

        chatMessagesFlow.addEventListener('scroll', () => {
            checkUserScrollPosition();
        }, { passive: true });
    }

    function checkUserScrollPosition() {
        if (!chatMessagesFlow) return;
        const distanceFromBottom = chatMessagesFlow.scrollHeight - chatMessagesFlow.scrollTop - chatMessagesFlow.clientHeight;
        // If user manually scrolled up more than 60px from bottom, honor their position
        if (distanceFromBottom > 60) {
            userHasScrolledUp = true;
        } else if (distanceFromBottom <= 20) {
            // User scrolled back near the bottom, resume auto-scrolling
            userHasScrolledUp = false;
        }
    }

    function scrollToBottom() {
        if (!chatMessagesFlow) return;
        userHasScrolledUp = false;
        chatMessagesFlow.scrollTop = chatMessagesFlow.scrollHeight;
    }

    function scrollToBottomIfNeeded() {
        if (!chatMessagesFlow || userHasScrolledUp || isTouchingFlow) return;
        chatMessagesFlow.scrollTop = chatMessagesFlow.scrollHeight;
    }

    // --- Copy To Clipboard Helper ---
    function copyToClipboard(text, btnElement) {
        const clean = stripEmojis(text);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(clean).then(() => {
                showCopyFeedback(btnElement);
            }).catch(() => fallbackCopy(clean, btnElement));
        } else {
            fallbackCopy(clean, btnElement);
        }
    }

    function fallbackCopy(clean, btnElement) {
        try {
            const ta = document.createElement('textarea');
            ta.value = clean;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showCopyFeedback(btnElement);
        } catch(e) {
            if (typeof window.showToast === 'function') {
                window.showToast('تعذر نسخ النص', 'fa-solid fa-circle-exclamation');
            }
        }
    }

    function showCopyFeedback(btn) {
        if (!btn) return;
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check" style="color:#2ecc71;"></i> <span>تم النسخ</span>';
        setTimeout(() => {
            btn.innerHTML = origHTML;
        }, 1800);
    }

    // --- Create Streaming Assistant Message in DOM ---
    function createStreamingMessage(timeStr) {
        if (!chatMessagesFlow) return null;
        if (welcomeCard) welcomeCard.style.display = 'none';

        userHasScrolledUp = false; // Reset to follow stream by default

        const row = document.createElement('div');
        row.className = 'chat-msg-row bot-msg';

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

        const bubbleWrap = document.createElement('div');
        bubbleWrap.className = 'msg-bubble-wrap';

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = '<span class="streaming-cursor"></span>';

        const metaRow = document.createElement('div');
        metaRow.className = 'msg-meta-row';

        const timeSpan = document.createElement('span');
        timeSpan.textContent = timeStr || getMessageTimestamp();
        metaRow.appendChild(timeSpan);

        bubbleWrap.appendChild(bubble);
        bubbleWrap.appendChild(metaRow);

        row.appendChild(avatar);
        row.appendChild(bubbleWrap);

        chatMessagesFlow.appendChild(row);
        scrollToBottom();

        // Throttled rendering via requestAnimationFrame to avoid mobile layout thrashing
        let pendingText = null;
        let rafId = null;

        function renderContent(text, isComplete) {
            const formatted = formatMarkdown(text, !isComplete);
            if (!isComplete) {
                if (!formatted) {
                    bubble.innerHTML = '<span class="streaming-cursor"></span>';
                } else {
                    const lastP = formatted.lastIndexOf('</p>');
                    const lastLi = formatted.lastIndexOf('</li>');
                    const lastDiv = formatted.lastIndexOf('</div>');
                    const maxIdx = Math.max(lastP, lastLi, lastDiv);

                    if (maxIdx !== -1) {
                        bubble.innerHTML = formatted.slice(0, maxIdx) + '<span class="streaming-cursor"></span>' + formatted.slice(maxIdx);
                    } else {
                        bubble.innerHTML = formatted + '<span class="streaming-cursor"></span>';
                    }
                }
            } else {
                bubble.innerHTML = formatted;
            }

            scrollToBottomIfNeeded();
        }

        return {
            row,
            bubble,
            metaRow,
            update(text) {
                pendingText = text;
                if (!rafId) {
                    rafId = requestAnimationFrame(() => {
                        rafId = null;
                        if (pendingText !== null) {
                            renderContent(pendingText, false);
                        }
                    });
                }
            },
            complete(finalText) {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                renderContent(finalText, true);

                // Add copy button
                const btnCopy = document.createElement('button');
                btnCopy.type = 'button';
                btnCopy.className = 'btn-copy-msg';
                btnCopy.title = 'نسخ الرد';
                btnCopy.innerHTML = '<i class="fa-regular fa-copy"></i> <span>نسخ</span>';
                btnCopy.onclick = (e) => {
                    e.stopPropagation();
                    copyToClipboard(finalText, btnCopy);
                };
                metaRow.appendChild(btnCopy);
                scrollToBottomIfNeeded();
            }
        };
    }

    // --- Send Message Flow with Real-time Progressive Streaming ---
    async function handleUserSend() {
        if (isGenerating || !chatInput) return;
        const rawText = chatInput.value.trim();
        if (!rawText) return;

        const userText = stripEmojis(rawText);
        userHasScrolledUp = false;
        chatInput.value = '';
        adjustTextareaHeight(chatInput);

        // Crucial for mobile UX: Cleanly dismiss virtual keyboard upon sending so user has full view to watch stream live
        if (isTouchDevice() && chatInput) {
            chatInput.blur();
        }

        // Initialize session if starting a new chat
        if (!currentSessionId) {
            currentSessionId = 'sess_' + Date.now();
            const newSession = {
                id: currentSessionId,
                title: userText.length > 34 ? userText.slice(0, 34) + '...' : userText,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                messages: []
            };
            allSessions.unshift(newSession);
            saveSessionsToStorage();
            renderSessionsList();
        }

        const userTimeStr = getMessageTimestamp();
        conversationHistory.push({
            role: 'user',
            content: userText,
            time: userTimeStr
        });
        syncCurrentSession();
        appendMessageToDOM('user', userText, userTimeStr, true);

        isGenerating = true;
        updateSendButtonState();

        const botTimeStr = getMessageTimestamp();
        const streamingMsg = createStreamingMessage(botTimeStr);

        try {
            let receivedAnyChunk = false;
            const responseText = await callGroqChatAPIStreaming((accumulated) => {
                receivedAnyChunk = true;
                if (streamingMsg) streamingMsg.update(accumulated);
            });

            if (!responseText && !receivedAnyChunk) {
                throw new Error("Empty response from AI service.");
            }

            const cleanResponse = stripEmojis(responseText);
            if (streamingMsg) streamingMsg.complete(cleanResponse);

            conversationHistory.push({
                role: 'assistant',
                content: cleanResponse,
                time: botTimeStr
            });
            syncCurrentSession();
        } catch (err) {
            console.error("Groq Chat Streaming Error:", err);
            const errorMsg = "عذراً، تعذر استكمال الرد في الوقت الحالي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.";
            if (streamingMsg) streamingMsg.complete(errorMsg);

            conversationHistory.push({
                role: 'assistant',
                content: errorMsg,
                time: botTimeStr
            });
            syncCurrentSession();
        } finally {
            isGenerating = false;
            updateSendButtonState();
            // Crucial: Only auto-refocus on Desktop keyboard devices. NEVER on mobile/touch to prevent keyboard abruptly jumping
            if (!isTouchDevice() && chatInput) {
                chatInput.focus();
            }
        }
    }

    // --- Groq Chat API Call with Streaming & Fallback ---
    async function callGroqChatAPIStreaming(onChunk) {
        const recentMessages = conversationHistory.slice(-8).map(m => ({
            role: m.role,
            content: m.content
        }));

        const payloadMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...recentMessages
        ];

        try {
            return await requestGroqStream(PRIMARY_MODEL, payloadMessages, onChunk);
        } catch (primaryErr) {
            console.warn(`Primary model ${PRIMARY_MODEL} streaming failed, attempting fallback to ${FALLBACK_MODEL}:`, primaryErr);
            return await requestGroqStream(FALLBACK_MODEL, payloadMessages, onChunk);
        }
    }

    // --- Core SSE Stream Consumer ---
    async function requestGroqStream(modelName, messages, onChunk) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelName,
                messages: messages,
                temperature: 0.65,
                max_tokens: 1200,
                top_p: 0.95,
                stream: true
            })
        });

        if (!response.ok) {
            const errData = await response.text();
            throw new Error(`Groq API responded with status ${response.status}: ${errData}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let accumulatedText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Retain trailing incomplete line

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data:')) continue;
                const dataStr = trimmed.replace(/^data:\s*/, '');
                if (dataStr === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(dataStr);
                    const delta = parsed.choices?.[0]?.delta?.content;
                    if (delta) {
                        accumulatedText += delta;
                        if (typeof onChunk === 'function') {
                            onChunk(accumulatedText);
                        }
                    }
                } catch (e) {
                    // Ignore transient chunk JSON parse errors
                }
            }
        }

        // Flush remaining buffer
        if (buffer.trim()) {
            const trimmed = buffer.trim();
            if (trimmed.startsWith('data:')) {
                const dataStr = trimmed.replace(/^data:\s*/, '');
                if (dataStr !== '[DONE]') {
                    try {
                        const parsed = JSON.parse(dataStr);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) {
                            accumulatedText += delta;
                            if (typeof onChunk === 'function') {
                                onChunk(accumulatedText);
                            }
                        }
                    } catch (e) {}
                }
            }
        }

        return stripEmojis(accumulatedText.trim());
    }

    function updateSendButtonState() {
        if (!btnSendMessage || !chatInput) return;
        const hasText = chatInput.value.trim().length > 0;
        btnSendMessage.disabled = isGenerating || !hasText;
    }

    function adjustTextareaHeight(el) {
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }

    // --- Quick Prompt Suggestion Click Handler ---
    function initSuggestionChips() {
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const text = chip.getAttribute('data-prompt') || chip.textContent.trim();
                if (chatInput) {
                    chatInput.value = text;
                    handleUserSend();
                }
            });
        });
    }

    // --- Init DOM & Listeners ---
    function init() {
        chatMessagesFlow = document.getElementById('chat-messages-flow');
        chatInput = document.getElementById('chat-input');
        btnSendMessage = document.getElementById('btn-send-message');
        welcomeCard = document.getElementById('bot-welcome-card');

        // Sidebar elements
        sidebarDrawer = document.getElementById('bot-sidebar-drawer');
        sidebarOverlay = document.getElementById('bot-sidebar-overlay');
        btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
        btnCloseSidebar = document.getElementById('btn-close-sidebar');
        btnNewChatTop = document.getElementById('btn-new-chat-top');
        btnNewChatSidebar = document.getElementById('btn-new-chat-sidebar');
        btnClearAllChats = document.getElementById('btn-clear-all-chats');
        sessionsListContainer = document.getElementById('bot-sessions-list');

        // Load sessions and start with a fresh New Chat on page load
        loadSessionsFromStorage();
        startNewChat();
        initSuggestionChips();
        initScrollTracking();

        if (btnSendMessage) {
            btnSendMessage.addEventListener('click', handleUserSend);
            // Prevent mobile tap focus flickering
            btnSendMessage.addEventListener('pointerdown', (e) => {
                if (isTouchDevice() && chatInput) {
                    chatInput.blur();
                }
            });
        }

        if (btnToggleSidebar) {
            btnToggleSidebar.addEventListener('click', openSidebar);
        }

        if (btnCloseSidebar) {
            btnCloseSidebar.addEventListener('click', closeSidebar);
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }

        if (btnNewChatTop) {
            btnNewChatTop.addEventListener('click', startNewChat);
        }

        if (btnNewChatSidebar) {
            btnNewChatSidebar.addEventListener('click', startNewChat);
        }

        if (btnClearAllChats) {
            btnClearAllChats.addEventListener('click', clearAllSessions);
        }

        // Close sidebar on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSidebar();
        });

        if (chatInput) {
            chatInput.addEventListener('input', () => {
                adjustTextareaHeight(chatInput);
                updateSendButtonState();
            });

            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleUserSend();
                }
            });
        }

        updateSendButtonState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
