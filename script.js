document.addEventListener('DOMContentLoaded', () => {
    // Lucide Icons Initialization
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Snake Pipes Animation
    const snakeContainer = document.getElementById('snakes-container');
    if (snakeContainer) {
        function createSnake() {
            const snake = document.createElement('div');
            snake.className = 'snake';

            const isHorizontal = Math.random() > 0.5;
            const size = 100 + Math.random() * 200;

            if (isHorizontal) {
                snake.style.width = size + 'px';
                snake.style.height = '2px';
                snake.style.top = Math.random() * 100 + 'vh';
                snake.style.left = '-300px';
            } else {
                snake.style.width = '2px';
                snake.style.height = size + 'px';
                snake.style.left = Math.random() * 100 + 'vw';
                snake.style.top = '-300px';
            }

            snakeContainer.appendChild(snake);

            const duration = 8000 + Math.random() * 12000;
            const animation = snake.animate([
                { transform: 'translate(0, 0)', opacity: 0 },
                { opacity: 0.3, offset: 0.2 },
                { opacity: 0.3, offset: 0.8 },
                { transform: isHorizontal ? `translateX(${window.innerWidth + 600}px)` : `translateY(${window.innerHeight + 600}px)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'linear'
            });

            animation.onfinish = () => {
                snake.remove();
                createSnake();
            };
        }

        for (let i = 0; i < 6; i++) {
            setTimeout(createSnake, i * 2000);
        }
    }

    // Bento Card Tilt & Shine
    document.querySelectorAll('.tilt-card').forEach(card => {
        const shine = card.querySelector('.shine');
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (centerY - y) / 15;
            const rotateY = (x - centerX) / 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 60%)`;
                shine.style.opacity = '1';
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            if (shine) shine.style.opacity = '0';
        });
    });

    // Reveal on Scroll
    const observerOptions = { threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${(index % 4) * 0.1}s`;
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Mockup Mode Switcher
    const modeBtns = document.querySelectorAll('.mode-btn');
    const appContainer = document.querySelector('.app-showcase .container');
    const phoneScreen = document.getElementById('phone-screen');
    const sTitle = document.getElementById('showcase-title');
    const sDesc = document.getElementById('showcase-desc');

    const content = {
        user: {
            title: "Simplicity for Users.",
            desc: "The WaterPaid mobile app gives you total control. Monitor your consumption in real-time."
        },
        admin: {
            title: "Power for Managers.",
            desc: "A centralized command center for billing agents and network managers."
        }
    };

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (mode === 'admin') {
                appContainer.classList.add('admin-active');
                phoneScreen.classList.remove('user-mode');
                phoneScreen.classList.add('admin-mode');
                updateNavVisibility('admin');
            } else {
                appContainer.classList.remove('admin-active');
                phoneScreen.classList.add('user-mode');
                phoneScreen.classList.remove('admin-mode');
                updateNavVisibility('user');
            }

            switchScreen('home', mode);

            sTitle.style.opacity = 0;
            sDesc.style.opacity = 0;
            setTimeout(() => {
                sTitle.textContent = content[mode].title;
                sDesc.textContent = content[mode].desc;
                sTitle.style.opacity = 1;
                sDesc.style.opacity = 1;
            }, 300);
        });
    });

    // Mockup Screen Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const userOnlyItems = document.querySelectorAll('.user-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');

    function updateNavVisibility(mode) {
        if (mode === 'admin') {
            userOnlyItems.forEach(el => el.style.display = 'none');
            adminOnlyItems.forEach(el => el.style.display = 'flex');
        } else {
            userOnlyItems.forEach(el => el.style.display = 'flex');
            adminOnlyItems.forEach(el => el.style.display = 'none');
        }
    }

    updateNavVisibility('user');

    function switchScreen(screenId, mode = null) {
        const currentMode = mode || (phoneScreen.classList.contains('admin-mode') ? 'admin' : 'user');

        // Hide ALL screens first
        document.querySelectorAll('.mock-screen').forEach(s => {
            s.style.display = 'none';
            s.classList.remove('active');
        });

        // Show ONLY the target screen
        const target = document.getElementById(`${currentMode}-${screenId}`);
        if (target) {
            target.style.display = 'block';
            target.classList.add('active');
        }

        // Handle FAB visibility - Only on User Home screen
        const fabs = document.querySelector('.mock-fabs');
        if (fabs) {
            fabs.style.display = (screenId === 'home' && currentMode === 'user') ? 'flex' : 'none';
        }

        // Update Nav Active State
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.target === screenId) item.classList.add('active');
        });

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            switchScreen(item.dataset.target);
        });
    });

    // Dialog Logic
    const editBtn = document.querySelector('.edit-btn');
    const dialogOverlay = document.getElementById('edit-profile-dialog');
    const cancelBtn = document.getElementById('cancel-edit');
    const saveBtn = document.getElementById('save-edit');
    const profileName = document.querySelector('.profile-name');
    const profilePhone = document.querySelector('.profile-phone');
    const inputPseudo = document.getElementById('edit-pseudo');
    const inputPhone = document.getElementById('edit-phone');

    if (editBtn && dialogOverlay) {
        editBtn.addEventListener('click', () => {
            dialogOverlay.classList.add('active');
        });

        cancelBtn.addEventListener('click', () => {
            dialogOverlay.classList.remove('active');
        });

        saveBtn.addEventListener('click', () => {
            if (profileName) profileName.textContent = inputPseudo.value;
            if (profilePhone) profilePhone.textContent = inputPhone.value;
            dialogOverlay.classList.remove('active');
        });

        dialogOverlay.addEventListener('click', (e) => {
            if (e.target === dialogOverlay) {
                dialogOverlay.classList.remove('active');
            }
        });
    }

    // Info Bubble Logic (Out-of-bounds)
    const bubbleContainer = document.getElementById('bubble-container');
    const bubble = document.createElement('div');
    bubble.className = 'info-bubble';
    bubble.innerHTML = `<h4></h4><p></p>`;
    bubbleContainer.appendChild(bubble);

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-info-title]');
        if (trigger) {
            e.stopPropagation();
            const title = trigger.getAttribute('data-info-title');
            const desc = trigger.getAttribute('data-info-desc');

            bubble.querySelector('h4').textContent = title;
            bubble.querySelector('p').textContent = desc;

            const rect = trigger.getBoundingClientRect();
            const mockupRect = document.querySelector('.phone-mockup').getBoundingClientRect();

            // Position relative to mockup container to allow protrusion
            const x = rect.left - mockupRect.left;
            const y = rect.top - mockupRect.top;

            // Offset bubble to show above the element and potentially protrude
            bubble.style.left = `${x - 100 + rect.width / 2}px`;
            bubble.style.top = `${y - 120}px`;

            bubble.classList.add('active');
        } else if (!e.target.closest('.info-bubble')) {
            bubble.classList.remove('active');
        }
    });

    // Hero Parallax
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('mousemove', (e) => {
        if (!heroContent) return;
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        heroContent.style.transform = `translate(${x}px, ${y}px)`;
    });
});
