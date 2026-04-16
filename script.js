// ============================================
// ОПТИМИЗИРОВАННЫЙ SCRIPT.JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация всех модулей
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

    // Настройка наблюдателя
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
                
                // Отмечаем как анимированный
                element.dataset.animated = 'true';
                
                // Запускаем анимацию
                animateCounter(element, target, 2500, suffix);
                
                // Перестаем следить после запуска
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Подготовка и наблюдение за элементами
    stats.forEach(stat => {
        // Если data-target уже есть, используем его
        if (!stat.dataset.target) {
            // Иначе извлекаем из текста
            const rawText = stat.textContent.trim();
            const match = rawText.match(/^(\d+)(.*)$/);
            
            if (match) {
                stat.dataset.target = match[1];
                stat.dataset.suffix = match[2];
            } else {
                return; // Пропускаем элементы без чисел
            }
        }

        // Сбрасываем визуальное значение
        stat.textContent = '0' + (stat.dataset.suffix || '');
        
        // Начинаем наблюдение
        observer.observe(stat);
    });
}

function animateCounter(element, target, duration, suffix) {
    const startTime = performance.now();

    // Функция плавности (Ease Out Quint)
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
        // Fallback для старых браузеров
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

    // Подготовка элементов
    elementsToAnimate.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(card);
    });
}

// ============================================
// 3. ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// 4. ЭФФЕКТЫ НАВЕДЕНИЯ НА КНОПКИ
// ============================================

function initButtonHoverEffects() {
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// 6. СЧЕТЧИК ОНЛАЙН МАСТЕРОВ (ЖИВАЯ СТАТИСТИКА)
// ============================================

function initOnlineCounter() {
    const counterElement = document.querySelector('.online-count');
    if (!counterElement) return;

    const minCount = 3;   // Минимальное количество мастеров
    const maxCount = 16;  // Максимальное количество мастеров

    // Генерируем случайное начальное значение при каждой загрузке страницы (от 1 до 8)
    const initialCount = Math.floor(Math.random() * 8) + 1;
    counterElement.textContent = initialCount;
    let currentCount = initialCount;
    
    // Функция обновления счетчика
    function updateCounter() {
        // Генерируем плавное изменение от текущего значения (от -3 до +3)
        const minChange = -3;
        const maxChange = 3;
        const change = Math.floor(Math.random() * (maxChange - minChange + 1)) + minChange;
        
        // Применяем изменение, но остаёмся в пределах от 3 до 28
        let targetCount = currentCount + change;
        targetCount = Math.max(minCount, Math.min(maxCount, targetCount));
        
        // Добавляем визуальный эффект
        counterElement.classList.add('updating');
        
        // Мгновенная смена числа (без анимации набегания)
        setTimeout(() => {
            counterElement.textContent = targetCount;
            counterElement.classList.remove('updating');
            currentCount = targetCount;
        }, 150);
    }
    
    // Обновляем каждые 12-20 секунд
    function scheduleNextUpdate() {
        const delay = Math.random() * 8000 + 12000; // 12-20 секунд
        setTimeout(() => {
            updateCounter();
            scheduleNextUpdate();
        }, delay);
    }
    
    // Запускаем через 5 секунд после загрузки
    setTimeout(() => {
        scheduleNextUpdate();
    }, 5000);
}

// ============================================
// FAQ АККОРДЕОН
// ============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Закрываем все остальные FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Переключаем текущий FAQ
            item.classList.toggle('active');
        });
    });
}

// ============================================
// ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ
// ============================================

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const savedLang = localStorage.getItem('language') || 'ru';
    
    // Устанавливаем сохраненный язык
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
    // Обновляем активную кнопку
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Обновляем HTML lang атрибут
    document.documentElement.lang = lang;
    
    // Обновляем все элементы с переводами
    document.querySelectorAll('[data-ru], [data-ka], [data-en]').forEach(element => {
        // Для h1 просто меняем текст и убираем курсор если есть
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

    // Обновляем placeholders
    document.querySelectorAll('[data-ru-placeholder], [data-ka-placeholder], [data-en-placeholder]').forEach(element => {
        const placeholder = element.dataset[lang + 'Placeholder'];
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
    
    // Обновляем title
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.dataset[lang]) {
        titleElement.textContent = titleElement.dataset[lang];
    }
    
    // Обновляем суффиксы у счётчиков статистики
    document.querySelectorAll('.stat-number[data-suffix-ru], .stat-number[data-suffix-ka], .stat-number[data-suffix-en]').forEach(element => {
        const suffixKey = lang === 'en' ? 'suffixEn' : lang === 'ka' ? 'suffixKa' : 'suffixRu';
        const newSuffix = element.dataset[suffixKey];
        if (newSuffix) {
            element.dataset.suffix = newSuffix;
            // Обновляем текст, если элемент уже анимирован
            if (element.dataset.animated === 'true') {
                const target = parseInt(element.dataset.target, 10);
                element.textContent = target + newSuffix;
            } else {
                // Если ещё не анимирован, показываем 0 с новым суффиксом
                element.textContent = '0' + newSuffix;
            }
        }
    });
    
    // Обновляем meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDesc.dataset[lang]) {
        metaDesc.setAttribute('content', metaDesc.dataset[lang]);
    }
}

// ============================================
// МОДАЛЬНЫЕ ОКНА ФОРМ
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

    // Автоформатирование телефонных номеров
    initPhoneFormatting();

    // Управление кнопками submit через checkbox
    initConsentCheckboxes();

    // Валидация форм перед отправкой
    const clientForm = document.getElementById('clientForm');
    const masterForm = document.getElementById('masterForm');

    if (clientForm) {
        clientForm.addEventListener('submit', validateForm);
    }

    if (masterForm) {
        masterForm.addEventListener('submit', validateForm);
    }
}

// Управление активностью кнопок submit
function initConsentCheckboxes() {
    const clientConsent = document.getElementById('clientConsent');
    const clientSubmitBtn = document.getElementById('clientSubmitBtn');
    const masterConsent = document.getElementById('masterConsent');
    const masterSubmitBtn = document.getElementById('masterSubmitBtn');
    
    // Обработчик для формы клиента
    if (clientConsent && clientSubmitBtn) {
        clientConsent.addEventListener('change', function() {
            clientSubmitBtn.disabled = !this.checked;
        });
    }
    
    // Обработчик для формы мастера
    if (masterConsent && masterSubmitBtn) {
        masterConsent.addEventListener('change', function() {
            masterSubmitBtn.disabled = !this.checked;
        });
    }
}

// Форматирование телефонных номеров для Грузии
function initPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('#clientPhone, #masterPhone, #leadPhone, #masterLeadPhone');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Удаляем все кроме цифр
            
            // Автоматически добавляем +995
            if (!value.startsWith('995')) {
                if (value.length > 0) {
                    value = '995' + value;
                }
            }
            
            // Ограничиваем длину: +995 + 9 цифр = 12 символов
            if (value.length > 12) {
                value = value.substring(0, 12);
            }
            
            // Форматируем как +995XXXXXXXXX
            if (value.length > 0) {
                e.target.value = '+' + value;
            } else {
                e.target.value = '';
            }
        });
        
        // Устанавливаем +995 при фокусе, если поле пустое
        input.addEventListener('focus', (e) => {
            if (e.target.value === '') {
                e.target.value = '+995';
            }
        });
        
        // Очищаем если осталось только +995
        input.addEventListener('blur', (e) => {
            if (e.target.value === '+995') {
                e.target.value = '';
            }
        });
    });
}

// Валидация формы перед отправкой
function validateForm(e) {
    const form = e.target;
    const phoneInput = form.querySelector('input[type="tel"]');
    const telegramInput = form.querySelector('input[name="telegram"]');
    
    // Проверка телефона
    if (phoneInput) {
        const phoneValue = phoneInput.value;
        const phonePattern = /^\+995[0-9]{9}$/;
        
        if (!phonePattern.test(phoneValue)) {
            e.preventDefault();
            alert('Пожалуйста, введите корректный грузинский номер телефона в формате: +995XXXXXXXXX (9 цифр после +995)');
            phoneInput.focus();
            return false;
        }
        
        // Проверка, что номер начинается с допустимого кода оператора
        const operatorCode = phoneValue.substring(4, 6);
        const validCodes = ['55', '56', '57', '58', '59', '51', '52', '53', '54', '68', '70', '71', '72', '74', '75', '77', '79', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
        
        if (!validCodes.includes(operatorCode)) {
            e.preventDefault();
            alert('Пожалуйста, введите корректный код оператора. Номер должен начинаться с +995 и далее 55, 56, 57, 58, 59, 51-54, 68, 70-79, 90-99');
            phoneInput.focus();
            return false;
        }
    }
    
    // Проверка Telegram
    if (telegramInput) {
        const telegramValue = telegramInput.value.trim();
        const telegramPattern = /^(@[a-zA-Z0-9_]{5,32}|[0-9]{9,15})$/;
        
        if (!telegramPattern.test(telegramValue)) {
            e.preventDefault();
            alert('Пожалуйста, введите корректный Telegram username (например: @username) или номер телефона');
            telegramInput.focus();
            return false;
        }
    }
    
    return true;
}

function openClientForm() {
    const modal = document.getElementById('clientFormModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeClientForm() {
    const modal = document.getElementById('clientFormModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function openMasterForm() {
    const modal = document.getElementById('masterFormModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeMasterForm() {
    const modal = document.getElementById('masterFormModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// МОДАЛЬНОЕ ОКНО ДЛЯ ЗАЯВКИ КЛИЕНТА (LEAD FORM)
// ============================================

function openClientLeadForm() {
    const modal = document.getElementById('clientLeadFormModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeClientLeadForm() {
    const modal = document.getElementById('clientLeadFormModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function openThankYou() {
    const modal = document.getElementById('thankYouModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeThankYou() {
    const modal = document.getElementById('thankYouModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function openMasterThankYou() {
    const modal = document.getElementById('masterThankYouModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeMasterThankYou() {
    const modal = document.getElementById('masterThankYouModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// МОДАЛЬНОЕ ОКНО ДЛЯ ЗАЯВКИ МАСТЕРА (MASTER LEAD FORM)
// ============================================

function openMasterLeadForm() {
    const modal = document.getElementById('masterLeadFormModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeMasterLeadForm() {
    const modal = document.getElementById('masterLeadFormModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Трекинг отправки формы заявки мастера
function initMasterLeadFormTracking() {
    const masterLeadForm = document.getElementById('masterLeadForm');
    
    if (masterLeadForm) {
        masterLeadForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Проверяем валидность перед отправкой
            if (!validateMasterLeadForm(e)) {
                return;
            }

            // Собираем данные формы
            const formData = new FormData(masterLeadForm);

            // Отправляем форму через Formspree
            fetch('https://formspree.io/f/mykdoebj', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Конверсия для Google Ads (Мастер)
                    gtag('event', 'conversion', {
                      'send_to': 'AW-17979861714/YDu4CLemvpwcENLVu_1C',
                      'value': 1,
                      'currency': 'USD'
                    });

                    // 📊 Событие для GA4 (опционально, чтобы видеть в аналитике)
                    gtag('event', 'generate_lead', {
                      'event_category': 'forms',
                      'event_label': 'master_lead_form',
                      'form_location': 'Как начать получать заказы',
                      'value': 1,
                      'currency': 'USD'
                    });

                    // Закрываем форму и показываем благодарность
                    closeMasterLeadForm();
                    openMasterThankYou();
                    masterLeadForm.reset();
                } else {
                    alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
                }
            }).catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
            });
        });
    }

    // Управление кнопкой submit через checkbox
    const masterLeadConsent = document.getElementById('masterLeadConsent');
    const masterLeadSubmitBtn = document.getElementById('masterLeadSubmitBtn');

    if (masterLeadConsent && masterLeadSubmitBtn) {
        masterLeadSubmitBtn.disabled = !masterLeadConsent.checked;
        
        masterLeadConsent.addEventListener('change', function() {
            masterLeadSubmitBtn.disabled = !this.checked;
        });
    }
}

function validateMasterLeadForm(e) {
    const form = e.target;
    const phoneInput = document.getElementById('masterLeadPhone');
    const telegramInput = form.querySelector('input[name="telegram"]');
    const whatsappInput = form.querySelector('input[name="whatsapp"]');

    // Проверка: хотя бы один из контактов должен быть заполнен
    const telegramValue = telegramInput ? telegramInput.value.trim() : '';
    const whatsappValue = whatsappInput ? whatsappInput.value.trim() : '';

    if (!telegramValue && !whatsappValue) {
        const currentLang = document.documentElement.lang;
        if (currentLang === 'ka') {
            alert('გთხოვთ, შეავსოთ ერთ-ერთი საკონტაქტო ველი: Telegram ან WhatsApp');
        } else {
            alert('Пожалуйста, заполните хотя бы один из контактов: Telegram или WhatsApp');
        }
        if (telegramInput && !telegramValue) {
            telegramInput.focus();
        } else {
            whatsappInput.focus();
        }
        return false;
    }

    // Проверка телефона
    if (phoneInput) {
        const phoneValue = phoneInput.value;
        const phonePattern = /^\+995[0-9]{9}$/;

        if (!phonePattern.test(phoneValue)) {
            alert('Пожалуйста, введите корректный грузинский номер телефона в формате: +995XXXXXXXXX (9 цифр после +995)');
            phoneInput.focus();
            return false;
        }

        // Проверка кода оператора
        const operatorCode = phoneValue.substring(4, 6);
        const validCodes = ['55', '56', '57', '58', '59', '51', '52', '53', '54', '68', '70', '71', '72', '74', '75', '77', '79', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'];

        if (!validCodes.includes(operatorCode)) {
            alert('Пожалуйста, введите корректный код оператора. Номер должен начинаться с +995 и далее 55, 56, 57, 58, 59, 51-54, 68, 70-79, 90-99');
            phoneInput.focus();
            return false;
        }
    }

    // Проверка формата Telegram, если заполнен
    if (telegramValue) {
        const telegramPattern = /^(@[a-zA-Z0-9_]{5,32}|[0-9]{9,15})$/;
        if (!telegramPattern.test(telegramValue)) {
            alert('Пожалуйста, введите корректный Telegram username (например: @username) или номер телефона');
            telegramInput.focus();
            return false;
        }
    }

    return true;
}

// Трекинг отправки формы заявки клиента
function initClientLeadFormTracking() {
    const leadForm = document.getElementById('clientLeadForm');
    
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Проверяем валидность перед отправкой
            if (!validateLeadForm(e)) {
                return;
            }

            // Собираем данные формы
            const formData = new FormData(leadForm);

            // Отправляем форму через Formspree
            fetch('https://formspree.io/f/xpqjbpyk', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Конверсия для Google Ads (Клиент)
                    if (typeof gtag === 'function') {
                      gtag('event', 'conversion', {
                        'send_to': 'AW-17979861714/I6VRCOzYvpwcENLVu_1C',
                        'value': 1,
                        'currency': 'USD'
                      });
                  
                      // 📊 2. Событие для GA4 (для аналитики)
                      gtag('event', 'generate_lead', {
                        'event_category': 'forms',
                        'event_label': 'client_lead_form',
                        'form_location': 'Как найти мастера',
                        'value': 1,
                        'currency': 'USD'
                      });
                    }

                    // Закрываем форму и показываем благодарность
                    closeClientLeadForm();
                    openThankYou();
                    leadForm.reset();
                } else {
                    alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
                }
            }).catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
            });
        });
    }

    // Управление кнопкой submit через checkbox
    const leadConsent = document.getElementById('leadConsent');
    const leadSubmitBtn = document.getElementById('leadSubmitBtn');

    if (leadConsent && leadSubmitBtn) {
        // Кнопка активна по умолчанию (чекбокс checked)
        leadSubmitBtn.disabled = !leadConsent.checked;
        
        leadConsent.addEventListener('change', function() {
            leadSubmitBtn.disabled = !this.checked;
        });
    }
}

function validateLeadForm(e) {
    const form = e.target;
    const phoneInput = document.getElementById('leadPhone');
    const telegramInput = form.querySelector('input[name="telegram"]');
    const whatsappInput = form.querySelector('input[name="whatsapp"]');

    // Проверка: хотя бы один из контактов должен быть заполнен
    const telegramValue = telegramInput ? telegramInput.value.trim() : '';
    const whatsappValue = whatsappInput ? whatsappInput.value.trim() : '';

    if (!telegramValue && !whatsappValue) {
        const currentLang = document.documentElement.lang;
        if (currentLang === 'ka') {
            alert('გთხოვთ, შეავსოთ ერთ-ერთი საკონტაქტო ველი: Telegram ან WhatsApp');
        } else {
            alert('Пожалуйста, заполните хотя бы один из контактов: Telegram или WhatsApp');
        }
        if (telegramInput && !telegramValue) {
            telegramInput.focus();
        } else {
            whatsappInput.focus();
        }
        return false;
    }

    // Проверка телефона
    if (phoneInput) {
        const phoneValue = phoneInput.value;
        const phonePattern = /^\+995[0-9]{9}$/;

        if (!phonePattern.test(phoneValue)) {
            alert('Пожалуйста, введите корректный грузинский номер телефона в формате: +995XXXXXXXXX (9 цифр после +995)');
            phoneInput.focus();
            return false;
        }

        // Проверка кода оператора
        const operatorCode = phoneValue.substring(4, 6);
        const validCodes = ['55', '56', '57', '58', '59', '51', '52', '53', '54', '68', '70', '71', '72', '74', '75', '77', '79', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'];

        if (!validCodes.includes(operatorCode)) {
            alert('Пожалуйста, введите корректный код оператора. Номер должен начинаться с +995 и далее 55, 56, 57, 58, 59, 51-54, 68, 70-79, 90-99');
            phoneInput.focus();
            return false;
        }
    }

    // Проверка формата Telegram, если заполнен
    if (telegramValue) {
        const telegramPattern = /^(@[a-zA-Z0-9_]{5,32}|[0-9]{9,15})$/;
        if (!telegramPattern.test(telegramValue)) {
            alert('Пожалуйста, введите корректный Telegram username (например: @username) или номер телефона');
            telegramInput.focus();
            return false;
        }
    }

    return true;
}

// ============================================
// ПЛАВАЮЩАЯ КНОПКА TELEGRAM
// ============================================

function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    if (!scrollButton) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
}

// ============================================
// ТРЕКИНГ КЛИКА ПО КНОПКЕ TELEGRAM
// ============================================
function initTelegramButtonTracking() {
  const telegramButton = document.getElementById('scrollToTop');
  
  if (telegramButton) {
    telegramButton.addEventListener('click', function() {
      // Конверсия для Google Ads Telegram Bot
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-17979861714/ZQAYCNbLxpwcENLVu_1C',
          'value': 0.5,
          'currency': 'USD'
        });
        
        // 📊 Событие для GA4 (опционально)
        gtag('event', 'contact', {
          'event_category': 'engagement',
          'event_label': 'telegram_button_click',
          'method': 'telegram'
        });
      }
    });
  }
}

// ============================================
// ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ ДЛЯ H1
// ============================================

function initTypingEffect() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;

    // Части текста для разных языков
    const textParts = {
        ru: {
            start: "Сервис ",
            option1: "поиска мастеров Тбилиси",
            option2: "подбора мастеров Тбилиси"
        },
        en: {
            start: "Master ",
            option1: "search service Tbilisi",
            option2: "matching service Tbilisi"
        },
        ka: {
            start: "სერვისი ",
            option1: "ძიების თბილისში",
            option2: "შერჩევის თბილისში"
        }
    };

    const currentLang = document.documentElement.lang || 'ru';
    const parts = textParts[currentLang] || textParts.ru;
    
    // Скорости (мс)
    const typeSpeed = 180;
    const deleteSpeed = 50;
    const pauseTime = 1000;

    // Создаем курсор
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    titleElement.innerHTML = ''; // Очищаем перед стартом
    titleElement.appendChild(cursor);

    // Функция паузы
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Функция печати
    async function typeText(text) {
        for (let i = 0; i < text.length; i++) {
            // Вставляем перед курсором
            const char = document.createTextNode(text[i]);
            titleElement.insertBefore(char, cursor);
            await wait(typeSpeed);
        }
    }

    // Функция стирания
    async function deleteText(count) {
        for (let i = 0; i < count; i++) {
            // Удаляем символ перед курсором
            if (titleElement.childNodes.length > 1) { // >1 потому что последний узел - курсор
                titleElement.removeChild(titleElement.childNodes[titleElement.childNodes.length - 2]);
            }
            await wait(deleteSpeed);
        }
    }

    // Основной сценарий
    async function runAnimation() {
        // 1. Печатаем: "Сервис поиска..."
        await typeText(parts.start + parts.option1);
        
        // 2. Ждем
        await wait(pauseTime);
        
        // 3. Стираем "поиска..." (оставляем "Сервис ")
        await deleteText(parts.option1.length);
        
        // 4. Печатаем: "подбора..."
        await typeText(parts.option2);
        
        // 5. Убираем курсор через секунду
        await wait(1000);
        cursor.remove();
    }

    // Запуск с задержкой
    setTimeout(runAnimation, 500);
}
