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
    initModalForms();
    initScrollToTop();
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
// 5. АНИМАЦИЯ ИКОНОК
// ============================================

function animateIcons() {
    const icons = document.querySelectorAll('.section-icon');
    icons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.animation = 'bounce 2s ease-in-out infinite';
        }, index * 200);
    });
}

// Запуск анимации иконок после загрузки
window.addEventListener('load', () => {
    setTimeout(animateIcons, 500);
});

// ============================================
// 6. СЧЕТЧИК ОНЛАЙН МАСТЕРОВ (ЖИВАЯ СТАТИСТИКА)
// ============================================

function initOnlineCounter() {
    const counterElement = document.querySelector('.online-count');
    if (!counterElement) return;

    const minCount = 3;   // Минимальное количество мастеров
    const maxCount = 58;  // Максимальное количество мастеров
    
    // Генерируем случайное начальное значение при каждой загрузке страницы (от 1 до 12)
    const initialCount = Math.floor(Math.random() * 12) + 1;
    counterElement.textContent = initialCount;
    let currentCount = initialCount;
    
    // Функция обновления счетчика
    function updateCounter() {
        // Генерируем небольшое изменение от текущего значения (от -8 до +8)
        const minChange = -8;
        const maxChange = 8;
        const change = Math.floor(Math.random() * (maxChange - minChange + 1)) + minChange;
        
        // Применяем изменение, но остаёмся в пределах от 3 до 58
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

// Инициализация FAQ при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
});

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
    document.querySelectorAll('[data-ru], [data-ka]').forEach(element => {
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
    document.querySelectorAll('[data-ru-placeholder], [data-ka-placeholder]').forEach(element => {
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
    document.querySelectorAll('.stat-number[data-suffix-ru], .stat-number[data-suffix-ka]').forEach(element => {
        const newSuffix = element.dataset['suffix' + lang.charAt(0).toUpperCase() + lang.slice(1)];
        if (newSuffix) {
            element.dataset.suffix = newSuffix;
            // Обновляем текст, если элемент уже анимирован
            if (element.dataset.animated === 'true') {
                const currentNumber = element.textContent.replace(/[^\d]/g, '');
                element.textContent = currentNumber + newSuffix;
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
    const phoneInputs = document.querySelectorAll('#clientPhone, #masterPhone');
    
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
        gtag('event', 'open_client_form', {
            'event_category': 'forms',
            'event_label': 'Client Form Opened'
        });
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
        gtag('event', 'open_master_form', {
            'event_category': 'forms',
            'event_label': 'Master Form Opened'
        });
    }
}

function closeMasterForm() {
    const modal = document.getElementById('masterFormModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// КНОПКА "ВВЕРХ"
// ============================================

function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    
    if (!scrollButton) return;
    
    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    // Плавный скролл наверх при клике
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
