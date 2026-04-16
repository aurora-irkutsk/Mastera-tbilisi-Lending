// ============================================
// ОПТИМИЗИРОВАННЫЙ SCRIPT.JS — MULTILINGUAL
// Языки: RU / KA / GE
// ============================================

// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕВОДЫ (все alert и тексты)
// ============================================

const i18n = {
    ru: {
        phoneInvalid:        'Пожалуйста, введите корректный грузинский номер телефона в формате: +995XXXXXXXXX (9 цифр после +995)',
        phoneOperator:       'Пожалуйста, введите корректный код оператора. Номер должен начинаться с +995 и далее 55, 56, 57, 58, 59, 51-54, 68, 70-79, 90-99',
        telegramInvalid:     'Пожалуйста, введите корректный Telegram username (например: @username) или номер телефона',
        contactRequired:     'Пожалуйста, заполните хотя бы один из контактов: Telegram или WhatsApp',
        submitError:         'Ошибка при отправке. Попробуйте ещё раз.',
    },
    ka: {
        phoneInvalid:        'გთხოვთ, შეიყვანოთ სწორი ქართული ტელეფონის ნომერი ფორმატში: +995XXXXXXXXX (9 ციფრი +995-ის შემდეგ)',
        phoneOperator:       'გთხოვთ, შეიყვანოთ სწორი ოპერატორის კოდი. ნომერი უნდა იწყებოდეს +995-ით და შემდეგ 55, 56, 57, 58, 59, 51-54, 68, 70-79, 90-99',
        telegramInvalid:     'გთხოვთ, შეიყვანოთ სწორი Telegram მომხმარებლის სახელი (მაგ: @username) ან ტელეფონის ნომერი',
        contactRequired:     'გთხოვთ, შეავსოთ ერთ-ერთი საკონტაქტო ველი: Telegram ან WhatsApp',
        submitError:         'გაგზავნისას მოხდა შეცდომა. სცადეთ კიდევ ერთხელ.',
    },
    en: {
        phoneInvalid:        'Please enter a valid Georgian phone number in the format: +995XXXXXXXXX (9 digits after +995)',
        phoneOperator:       'Please enter a valid operator code. The number must start with +995 followed by 55, 56, 57, 58, 59, 51-54, 68, 70-79, 90-99',
        telegramInvalid:     'Please enter a valid Telegram username (e.g. @username) or phone number',
        contactRequired:     'Please fill in at least one contact field: Telegram or WhatsApp',
        submitError:         'An error occurred while submitting. Please try again.',
    }
};

// Глобальная переменная текущего языка
let currentLang = 'ru';

// Вспомогательная функция — получить перевод
function t(key) {
    return (i18n[currentLang] || i18n.ru)[key] || i18n.ru[key] || key;
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initStatsAnimation();
    initScrollAnimation();
    initSmoothScroll();
    initButtonHoverEffects();
    initOnlineCounter();
    initLanguageSwitcher();
    initTypingEffect();
    initModalForms();
    initScrollToTop();
    initClientLeadFormTracking();
    initMasterLeadFormTracking();
    initTelegramButtonTracking();
    initFAQ();
});

// ============================================
// 1. АНИМАЦИЯ ЦИФР (УНИВЕРСАЛЬНАЯ)
// ============================================

function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const element = entry.target;
                const target = parseInt(element.dataset.target, 10);
                const suffix = element.dataset.suffix || '';
                element.dataset.animated = 'true';
                animateCounter(element, target, 2500, suffix);
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        if (!stat.dataset.target) {
            const rawText = stat.textContent.trim();
            const match = rawText.match(/^(\d+)(.*)$/);
            if (match) {
                stat.dataset.target = match[1];
                stat.dataset.suffix = match[2];
            } else {
                return;
            }
        }
        stat.textContent = '0' + (stat.dataset.suffix || '');
        observer.observe(stat);
    });
}

function animateCounter(element, target, duration, suffix) {
    const startTime = performance.now();

    function easeOutQuint(t) {
        return 1 - Math.pow(1 - t, 5);
    }

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuint(progress);
        const current = Math.floor(easedProgress * target);
        element.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target + suffix;
        }
    }

    requestAnimationFrame(animate);
}

// ============================================
// 2. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
// ============================================

function initScrollAnimation() {
    const elementsToAnimate = document.querySelectorAll('.section-card');

    if (!window.IntersectionObserver) {
        elementsToAnimate.forEach(el => el.style.opacity = 1);
        return;
    }

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.scrollAnimated) {
                entry.target.dataset.scrollAnimated = 'true';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elementsToAnimate.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(card);
    });
}

// ============================================
// 3. ПЛАВНАЯ ПРОКРУТКА
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// 4. ЭФФЕКТЫ НАВЕДЕНИЯ НА КНОПКИ
// ============================================

function initButtonHoverEffects() {
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// 5. СЧЕТЧИК ОНЛАЙН МАСТЕРОВ
// ============================================

function initOnlineCounter() {
    const counterElement = document.querySelector('.online-count');
    if (!counterElement) return;

    const minCount = 3;
    const maxCount = 16;
    const initialCount = Math.floor(Math.random() * 8) + 1;
    counterElement.textContent = initialCount;
    let currentCount = initialCount;

    function updateCounter() {
        const change = Math.floor(Math.random() * 7) - 3; // -3..+3
        let targetCount = Math.max(minCount, Math.min(maxCount, currentCount + change));
        counterElement.classList.add('updating');
        setTimeout(() => {
            counterElement.textContent = targetCount;
            counterElement.classList.remove('updating');
            currentCount = targetCount;
        }, 150);
    }

    function scheduleNextUpdate() {
        const delay = Math.random() * 8000 + 12000;
        setTimeout(() => {
            updateCounter();
            scheduleNextUpdate();
        }, delay);
    }

    setTimeout(scheduleNextUpdate, 5000);
}

// ============================================
// 6. FAQ АККОРДЕОН
// ============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });
}

// ============================================
// 7. ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ
// ============================================

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const browserLang = navigator.language || navigator.userLanguage;

    let defaultLang = 'ru';
    if (browserLang.startsWith('ka')) defaultLang = 'ka';
    else if (browserLang.startsWith('en')) defaultLang = 'en';

    const savedLang = localStorage.getItem('language') || defaultLang;
    setLanguage(savedLang);

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
            localStorage.setItem('language', lang);
        });
    });
}

function setLanguage(lang) {
    // Обновляем глобальную переменную
    currentLang = lang;

    // Активная кнопка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // HTML lang атрибут
    document.documentElement.lang = lang;

    // Переводим все элементы с data-атрибутами
    document.querySelectorAll('[data-ru], [data-ka], [data-en]').forEach(element => {
        if (element.classList.contains('hero-title')) {
            const cursor = element.querySelector('.typing-cursor');
            if (cursor) cursor.remove();
            const text = element.dataset[lang];
            if (text) element.textContent = text;
            return;
        }

        const text = element.dataset[lang];
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else if (element.hasAttribute('content')) {
                element.setAttribute('content', text);
            } else {
                element.textContent = text;
            }
        }
    });

    // Placeholders через отдельные атрибуты
    document.querySelectorAll('[data-ru-placeholder], [data-ka-placeholder], [data-en-placeholder]').forEach(element => {
        const placeholder = element.dataset[lang + 'Placeholder'];
        if (placeholder) element.placeholder = placeholder;
    });

    // Title страницы
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.dataset[lang]) {
        titleElement.textContent = titleElement.dataset[lang];
    }

    // Суффиксы счётчиков статистики
    document.querySelectorAll('.stat-number[data-suffix-ru], .stat-number[data-suffix-ka], .stat-number[data-suffix-en]').forEach(element => {
        const suffixKey = lang === 'en' ? 'suffixEn' : lang === 'ka' ? 'suffixKa' : 'suffixRu';
        const newSuffix = element.dataset[suffixKey];
        if (newSuffix) {
            element.dataset.suffix = newSuffix;
            if (element.dataset.animated === 'true') {
                const target = parseInt(element.dataset.target, 10);
                element.textContent = target + newSuffix;
            } else {
                element.textContent = '0' + newSuffix;
            }
        }
    });

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDesc.dataset[lang]) {
        metaDesc.setAttribute('content', metaDesc.dataset[lang]);
    }
}

// ============================================
// 8. МОДАЛЬНЫЕ ОКНА
// ============================================

function initModalForms() {
    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeClientForm();
            closeMasterForm();
            closeClientLeadForm();
            closeMasterLeadForm();
            closeThankYou();
            closeMasterThankYou();
        }
    });

    initPhoneFormatting();
    initConsentCheckboxes();

    const clientForm = document.getElementById('clientForm');
    const masterForm = document.getElementById('masterForm');
    if (clientForm) clientForm.addEventListener('submit', validateForm);
    if (masterForm) masterForm.addEventListener('submit', validateForm);
}

// Управление кнопками submit через checkbox
function initConsentCheckboxes() {
    const clientConsent   = document.getElementById('clientConsent');
    const clientSubmitBtn = document.getElementById('clientSubmitBtn');
    const masterConsent   = document.getElementById('masterConsent');
    const masterSubmitBtn = document.getElementById('masterSubmitBtn');

    if (clientConsent && clientSubmitBtn) {
        clientConsent.addEventListener('change', function () {
            clientSubmitBtn.disabled = !this.checked;
        });
    }
    if (masterConsent && masterSubmitBtn) {
        masterConsent.addEventListener('change', function () {
            masterSubmitBtn.disabled = !this.checked;
        });
    }
}

// Форматирование телефонных номеров
function initPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('#clientPhone, #masterPhone, #leadPhone, #masterLeadPhone');

    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (!value.startsWith('995') && value.length > 0) {
                value = '995' + value;
            }
            if (value.length > 12) value = value.substring(0, 12);
            e.target.value = value.length > 0 ? '+' + value : '';
        });

        input.addEventListener('focus', (e) => {
            if (e.target.value === '') e.target.value = '+995';
        });

        input.addEventListener('blur', (e) => {
            if (e.target.value === '+995') e.target.value = '';
        });
    });
}

// ============================================
// 9. ВАЛИДАЦИЯ — ОБЩИЕ ФУНКЦИИ
// ============================================

const VALID_OPERATOR_CODES = ['55','56','57','58','59','51','52','53','54','68','70','71','72','74','75','77','79','90','91','92','93','94','95','96','97','98','99'];
const PHONE_PATTERN    = /^\+995[0-9]{9}$/;
const TELEGRAM_PATTERN = /^(@[a-zA-Z0-9_]{5,32}|[0-9]{9,15})$/;

function validatePhone(phoneInput) {
    if (!phoneInput) return true;
    const val = phoneInput.value;

    if (!PHONE_PATTERN.test(val)) {
        alert(t('phoneInvalid'));
        phoneInput.focus();
        return false;
    }

    const code = val.substring(4, 6);
    if (!VALID_OPERATOR_CODES.includes(code)) {
        alert(t('phoneOperator'));
        phoneInput.focus();
        return false;
    }

    return true;
}

function validateTelegram(telegramInput) {
    if (!telegramInput) return true;
    const val = telegramInput.value.trim();
    if (!val) return true; // необязательное поле — проверяем только если заполнено

    if (!TELEGRAM_PATTERN.test(val)) {
        alert(t('telegramInvalid'));
        telegramInput.focus();
        return false;
    }
    return true;
}

// Валидация стандартных форм (clientForm / masterForm)
function validateForm(e) {
    const form = e.target;
    const phoneInput    = form.querySelector('input[type="tel"]');
    const telegramInput = form.querySelector('input[name="telegram"]');

    if (!validatePhone(phoneInput)) { e.preventDefault(); return false; }
    if (!validateTelegram(telegramInput)) { e.preventDefault(); return false; }

    return true;
}

// ============================================
// 10. ЛИД-ФОРМА КЛИЕНТА
// ============================================

function initClientLeadFormTracking() {
    const leadForm = document.getElementById('clientLeadForm');
    if (!leadForm) return;

    let isSubmitting = false;

    leadForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (isSubmitting) return;
        if (!validateLeadForm(e)) return;

        isSubmitting = true;

        const formData = new FormData(leadForm);
        const transactionId = 'client_' + Date.now();

        try {
            const response = await fetch('https://formspree.io/f/xpqjbpyk', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Submit failed');

            if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                    send_to: 'AW-17979861714/I6VRCOzYvpwcENLVu_1C',
                    value: 1.2,
                    currency: 'USD',
                    transaction_id: transactionId
                });
                gtag('event', 'generate_lead', {
                    form_name: 'client_lead_form',
                    form_location: 'Как найти мастера',
                    user_type: 'client',
                    value: 1.2,
                    currency: 'USD'
                });
            }

            closeClientLeadForm();
            openThankYou();
            leadForm.reset();

        } catch (error) {
            console.error(error);
            alert(t('submitError'));
            isSubmitting = false;
        }
    });

    // Checkbox
    const leadConsent   = document.getElementById('leadConsent');
    const leadSubmitBtn = document.getElementById('leadSubmitBtn');
    if (leadConsent && leadSubmitBtn) {
        leadSubmitBtn.disabled = !leadConsent.checked;
        leadConsent.addEventListener('change', function () {
            leadSubmitBtn.disabled = !this.checked;
        });
    }
}

function validateLeadForm(e) {
    const form          = e.target;
    const phoneInput    = document.getElementById('leadPhone');
    const telegramInput = form.querySelector('input[name="telegram"]');
    const whatsappInput = form.querySelector('input[name="whatsapp"]');

    const telegramValue = telegramInput ? telegramInput.value.trim() : '';
    const whatsappValue = whatsappInput ? whatsappInput.value.trim() : '';

    if (!telegramValue && !whatsappValue) {
        alert(t('contactRequired'));
        if (telegramInput && !telegramValue) telegramInput.focus();
        else if (whatsappInput) whatsappInput.focus();
        return false;
    }

    if (!validatePhone(phoneInput)) return false;
    if (telegramValue && !validateTelegram(telegramInput)) return false;

    return true;
}

// ============================================
// 11. ЛИД-ФОРМА МАСТЕРА
// ============================================

function initMasterLeadFormTracking() {
    const masterLeadForm = document.getElementById('masterLeadForm');
    if (!masterLeadForm) return;

    let isSubmitting = false;

    masterLeadForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (isSubmitting) return;
        if (!validateMasterLeadForm(e)) return;

        isSubmitting = true;

        const formData = new FormData(masterLeadForm);

        try {
            const response = await fetch('https://formspree.io/f/mykdoebj', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Submit failed');

            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    form_name: 'master_lead_form',
                    form_location: 'Как начать получать заказы',
                    user_type: 'master',
                    value: 0,
                    currency: 'USD'
                });
                gtag('event', 'master_lead_submit', { method: 'form' });
            }

            closeMasterLeadForm();
            openMasterThankYou();
            masterLeadForm.reset();

        } catch (error) {
            console.error('Master form error:', error);
            alert(t('submitError'));
            isSubmitting = false;
        }
    });

    // Checkbox
    const masterLeadConsent   = document.getElementById('masterLeadConsent');
    const masterLeadSubmitBtn = document.getElementById('masterLeadSubmitBtn');
    if (masterLeadConsent && masterLeadSubmitBtn) {
        masterLeadSubmitBtn.disabled = !masterLeadConsent.checked;
        masterLeadConsent.addEventListener('change', function () {
            masterLeadSubmitBtn.disabled = !this.checked;
        });
    }
}

function validateMasterLeadForm(e) {
    const form          = e.target;
    const phoneInput    = document.getElementById('masterLeadPhone');
    const telegramInput = form.querySelector('input[name="telegram"]');
    const whatsappInput = form.querySelector('input[name="whatsapp"]');

    const telegramValue = telegramInput ? telegramInput.value.trim() : '';
    const whatsappValue = whatsappInput ? whatsappInput.value.trim() : '';

    if (!telegramValue && !whatsappValue) {
        alert(t('contactRequired'));
        if (telegramInput && !telegramValue) telegramInput.focus();
        else if (whatsappInput) whatsappInput.focus();
        return false;
    }

    if (!validatePhone(phoneInput)) return false;
    if (telegramValue && !validateTelegram(telegramInput)) return false;

    return true;
}

// ============================================
// 12. УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ
// ============================================

function openClientForm()      { _modal('clientFormModal',       'flex'); }
function closeClientForm()     { _modal('clientFormModal',       'none'); }
function openMasterForm()      { _modal('masterFormModal',        'flex'); }
function closeMasterForm()     { _modal('masterFormModal',        'none'); }
function openClientLeadForm()  { _modal('clientLeadFormModal',   'flex'); }
function closeClientLeadForm() { _modal('clientLeadFormModal',   'none'); }
function openThankYou()        { _modal('thankYouModal',          'flex'); }
function closeThankYou()       { _modal('thankYouModal',          'none'); }
function openMasterThankYou()  { _modal('masterThankYouModal',   'flex'); }
function closeMasterThankYou() { _modal('masterThankYouModal',   'none'); }
function openMasterLeadForm()  { _modal('masterLeadFormModal',   'flex'); }
function closeMasterLeadForm() { _modal('masterLeadFormModal',   'none'); }

function _modal(id, display) {
    const el = document.getElementById(id);
    if (el) el.style.display = display;
}

// ============================================
// 13. КНОПКА «НАВЕРХ» / TELEGRAM FAB
// ============================================

function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    if (!scrollButton) return;

    window.addEventListener('scroll', () => {
        scrollButton.classList.toggle('visible', window.pageYOffset > 300);
    });
}

// ============================================
// 14. ТРЕКИНГ КНОПКИ TELEGRAM
// ============================================

function initTelegramButtonTracking() {
    const telegramButton = document.getElementById('scrollToTop');
    if (!telegramButton) return;

    let isButtonClicked = false;

    telegramButton.addEventListener('click', function (e) {
        if (isButtonClicked) return;
        isButtonClicked = true;
        e.preventDefault();

        const goToTelegram = () => { window.location.href = telegramButton.href; };

        if (typeof gtag === 'function') {
            gtag('event', 'telegram_click', {
                method: 'telegram',
                event_category: 'engagement'
            });
            setTimeout(goToTelegram, 600);
        } else {
            goToTelegram();
        }
    });
}

// ============================================
// 15. ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ ДЛЯ H1
// ============================================

function initTypingEffect() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;

    const textParts = {
        ru: {
            start:   'Сервис ',
            option1: 'поиска мастеров Тбилиси',
            option2: 'подбора мастеров Тбилиси'
        },
        en: {
            start:   'Master ',
            option1: 'search service Tbilisi',
            option2: 'matching service Tbilisi'
        },
        ka: {
            start:   'სერვისი ',
            option1: 'ძიების თბილისში',
            option2: 'შერჩევის თბილისში'
        }
    };

    const parts = textParts[currentLang] || textParts.ru;

    const typeSpeed  = 180;
    const deleteSpeed = 50;
    const pauseTime  = 1000;

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    titleElement.innerHTML = '';
    titleElement.appendChild(cursor);

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function typeText(text) {
        for (let i = 0; i < text.length; i++) {
            titleElement.insertBefore(document.createTextNode(text[i]), cursor);
            await wait(typeSpeed);
        }
    }

    async function deleteText(count) {
        for (let i = 0; i < count; i++) {
            if (titleElement.childNodes.length > 1) {
                titleElement.removeChild(titleElement.childNodes[titleElement.childNodes.length - 2]);
            }
            await wait(deleteSpeed);
        }
    }

    async function runAnimation() {
        await typeText(parts.start + parts.option1);
        await wait(pauseTime);
        await deleteText(parts.option1.length);
        await typeText(parts.option2);
        await wait(1000);
        cursor.remove();
    }

    setTimeout(runAnimation, 500);
}