// Ocean Platform JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize features
    initializeFeatures();

    // Initialize scroll animations
    initializeScrollAnimations();

    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Add loading states (only for buttons without links)
    addLoadingStates();
});

// Features data
const features = [
    {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>`,
        title: "IA Inteligente",
        description: "Algoritmos que aprendem seus padrões e sugerem otimizações automáticas",
        color: "hsl(217, 91%, 60%)"
    },
    {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
              </svg>`,
        title: "Sincronização Instantânea",
        description: "Todos os seus dispositivos sempre atualizados em tempo real",
        color: "hsl(191, 91%, 60%)"
    },
    {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12,22s8-4 8-10V5l-8-3-8 3v7c0,6 8,10 8,10"/>
              </svg>`,
        title: "Segurança Total",
        description: "Seus dados protegidos com criptografia de nível militar",
        color: "hsl(238, 91%, 60%)"
    },
    {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>`,
        title: "Multi-plataforma",
        description: "Acesse de qualquer lugar: web, mobile, tablet ou desktop",
        color: "hsl(172, 91%, 60%)"
    },
    {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>`,
        title: "Analytics Avançados",
        description: "Insights detalhados sobre sua produtividade e hábitos",
        color: "hsl(217, 91%, 55%)"
    },
    {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12,2a15.3,15.3 0,0,1 0,20 15.3,15.3 0,0,1 0,-20"/>
              </svg>`,
        title: "Colaboração Global",
        description: "Trabalhe em equipe com pessoas do mundo todo",
        color: "hsl(191, 91%, 55%)"
    }
];

// Initialize features grid
function initializeFeatures() {
    const featuresGrid = document.getElementById('features-grid');
    if (!featuresGrid) return;

    features.forEach((feature, index) => {
        const featureCard = document.createElement('div');
        featureCard.className = 'feature-card ocean-animate-float';
        featureCard.style.animationDelay = `${index * 0.3}s`;

        featureCard.innerHTML = `
            <div class="feature-icon" style="color: ${feature.color}">
                ${feature.icon}
            </div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        `;

        featuresGrid.appendChild(featureCard);
    });
}

// Scroll animations
function initializeScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.stat-card, .feature-card, .card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Interactive elements
function initializeInteractiveElements() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const newsletterButton = newsletterForm.querySelector('.btn');
        const newsletterInput = newsletterForm.querySelector('.newsletter-input');

        newsletterButton.addEventListener('click', function (e) {
            e.preventDefault();
            const email = newsletterInput.value;

            if (email && isValidEmail(email)) {
                // Simulate subscription
                showNotification('Obrigado! Você foi inscrito com sucesso.', 'success');
                newsletterInput.value = '';
            } else {
                showNotification('Por favor, insira um e-mail válido.', 'error');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add ripple effect to buttons
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        ${type === 'success' ? 'background: hsl(142, 76%, 36%);' : 'background: hsl(0, 84%, 60%);'}
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    circle.style.cssText += `
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 600ms linear;
        background-color: rgba(255, 255, 255, 0.6);
        pointer-events: none;
    `;

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(circle);
}

// Parallax effect for hero background
function initializeParallax() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        heroBackground.style.transform = `translateY(${parallax}px)`;
    });
}

// Initialize parallax after page load
window.addEventListener('load', initializeParallax);

// Add dynamic loading states (only for buttons without links)
function addLoadingStates() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        // Only add loading state to buttons that are not inside an <a> tag
        const parentLink = button.closest('a');
        if (!parentLink && button.textContent.includes('Começar')) {
            button.addEventListener('click', function (e) {
                e.preventDefault();

                const originalText = this.innerHTML;
                this.innerHTML = 'Carregando...';
                this.disabled = true;

                // Simulate loading
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                    showNotification('Funcionalidade em desenvolvimento!', 'success');
                }, 1500);
            });
        }
    });
}