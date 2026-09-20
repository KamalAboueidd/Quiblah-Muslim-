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

2. إرشادات ومميزات تطبيق "قبلة المسلم":
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

3. معلومات عن مؤسس ومطور المنصة:
   - المؤسس والمطور هو المهندس كمال أبو عيد (Kamal Abou Eid).
   - هو مهندس برمجيات مصري (Software Engineer) من مدينة الإسكندرية، جمهورية مصر العربية.
   - قام بتطوير وتصميم منصة وتطبيق "قبلة المسلم" بالكامل لخدمة المسلمين وتيسير عباداتهم باستخدام أحدث تقنيات هندسة البرمجيات والذكاء الاصطناعي.

قواعد صارمة وإلزامية في أسلوبك:
- تخصصك محصور في الجوانب الدينية والإسلامية والقرآنية ومميزات تطبيق قبلة المسلم ومطوره.
- إذا سألك المستخدم عن مواضيع خارج هذا النطاق (مثل السياسة، الرياضة، الفن، البرمجة العامة غير المرتبطة بالمنصة، أو المحادثات غير المفيدة)، اعتذر منه بلطف وبيّن له أنك مخصص للإجابة عن الأسئلة الإسلامية والقرآنية وميزات تطبيق قبلة المسلم.
- استشهد دائماً بالآيات القرآنية والأحاديث الصحيحة مع ذكر المصادر.
- يمنع منعاً باتاً استخدام أي رموز تعبيرية (emojis) إطلاقاً في جميع نصوص إجاباتك، واعتمد على فصاحة التعبير وجمال اللغة وعلامات الترقيم السليمة.
- نسق إجاباتك بنقاط واضحة وفقرات منسقة مع استخدام العناوين العريضة.`;

    // --- DOM Elements ---
    let chatMessagesFlow, chatInput, btnSendMessage, btnClearChat;
    let typingIndicator, welcomeCard;

    // --- State ---
    let conversationHistory = [];
    let isGenerating = false;

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
    function formatMarkdown(rawText) {
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

            // Bold formatting: **text**
            line = escapeHTML(line).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // Quranic quotation lines: ﴿...﴾ or «...»
            if (line.startsWith('﴿') || line.startsWith('«') || line.includes('﴾') || line.includes('»')) {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                html += `<div class="quran-quote">${line}</div>`;
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

    // --- Storage: Load & Save ---
    function loadChatHistory() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                conversationHistory = JSON.parse(raw);
            }
        } catch (e) {
            conversationHistory = [];
        }
    }

    function saveChatHistory() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
        } catch (e) {}
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
        avatar.innerHTML = isUser ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-mosque"></i>';

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

    function scrollToBottom() {
        if (!chatMessagesFlow) return;
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

    // --- Typing Indicator ---
    function setTyping(visible) {
        if (!typingIndicator) return;
        typingIndicator.style.display = visible ? 'inline-flex' : 'none';
        if (visible) scrollToBottom();
    }

    // --- Send Message Flow ---
    async function handleUserSend() {
        if (isGenerating || !chatInput) return;
        const rawText = chatInput.value.trim();
        if (!rawText) return;

        const userText = stripEmojis(rawText);
        chatInput.value = '';
        adjustTextareaHeight(chatInput);

        const timeStr = getMessageTimestamp();
        conversationHistory.push({
            role: 'user',
            content: userText,
            time: timeStr
        });
        saveChatHistory();
        appendMessageToDOM('user', userText, timeStr, true);

        isGenerating = true;
        setTyping(true);
        updateSendButtonState();

        try {
            const responseText = await callGroqChatAPI(userText);
            const botTimeStr = getMessageTimestamp();
            conversationHistory.push({
                role: 'assistant',
                content: responseText,
                time: botTimeStr
            });
            saveChatHistory();
            appendMessageToDOM('assistant', responseText, botTimeStr, true);
        } catch (err) {
            console.error("Groq Chat Error:", err);
            const errorMsg = "عذراً، تعذر الاتصال بالخادم الذكي في الوقت الحالي. يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة.";
            const botTimeStr = getMessageTimestamp();
            conversationHistory.push({
                role: 'assistant',
                content: errorMsg,
                time: botTimeStr
            });
            saveChatHistory();
            appendMessageToDOM('assistant', errorMsg, botTimeStr, true);
        } finally {
            setTyping(false);
            isGenerating = false;
            updateSendButtonState();
            if (chatInput) chatInput.focus();
        }
    }

    // --- Groq Chat API Call with Fallback ---
    async function callGroqChatAPI(userLatestMessage) {
        // Build message payload: System prompt + last 8 conversational turns
        const recentMessages = conversationHistory.slice(-8).map(m => ({
            role: m.role,
            content: m.content
        }));

        const payloadMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...recentMessages
        ];

        // Try primary model first, then fallback
        try {
            return await requestGroqCompletion(PRIMARY_MODEL, payloadMessages);
        } catch (primaryErr) {
            console.warn(`Primary model ${PRIMARY_MODEL} failed, attempting fallback to ${FALLBACK_MODEL}:`, primaryErr);
            return await requestGroqCompletion(FALLBACK_MODEL, payloadMessages);
        }
    }

    async function requestGroqCompletion(modelName, messages) {
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
                max_tokens: 800,
                top_p: 0.95
            })
        });

        if (!response.ok) {
            const errData = await response.text();
            throw new Error(`Groq API responded with status ${response.status}: ${errData}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error("Empty response from language model.");
        }
        return stripEmojis(content.trim());
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

    // --- Clear Conversation ---
    function clearChat() {
        conversationHistory = [];
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch(e) {}
        renderChatFlow();
        if (typeof window.showToast === 'function') {
            window.showToast('تم مسح المحادثة بنجاح', 'fa-solid fa-trash-can');
        }
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
        btnClearChat = document.getElementById('btn-clear-chat');
        typingIndicator = document.getElementById('typing-indicator-row');
        welcomeCard = document.getElementById('bot-welcome-card');

        loadChatHistory();
        renderChatFlow();
        initSuggestionChips();

        if (btnSendMessage) {
            btnSendMessage.addEventListener('click', handleUserSend);
        }

        if (btnClearChat) {
            btnClearChat.addEventListener('click', clearChat);
        }

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
