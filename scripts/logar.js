// Ocean Login - JavaScript Functions

import { debounce, validateEmail } from './utils.js';

class OceanLogin {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAnimations();
        this.prefillFromRegistration();
    }

    setupEventListeners() {
        // Toggle Password Visibility
        const togglePasswordBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        if (togglePasswordBtn && passwordInput) {
            togglePasswordBtn.addEventListener('click', () => {
                this.togglePasswordVisibility(passwordInput, togglePasswordBtn);
            });
        }

        // Form Submit
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }

        // Create Account Button
        const createAccountBtn = document.querySelector('.create-account');
        if (createAccountBtn) {
            createAccountBtn.addEventListener('click', () => {
                window.location.href = '/paginas/registro.html';
            });
        }

        // Forgot Password Button
        const forgotPasswordBtn = document.querySelector('.forgot-password');
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', () => {
                this.showToast('Função Indisponível', 'Recuperação de senha ainda não implementada.', 'info');
            });
        }
    }

    togglePasswordVisibility(passwordInput, toggleBtn) {
        const isPassword = passwordInput.type === 'password';

        // Toggle input type
        passwordInput.type = isPassword ? 'text' : 'password';

        // Toggle icon
        const eyeIcon = toggleBtn.querySelector('.eye-icon');
        if (eyeIcon) {
            if (isPassword) {
                // Show eye-off icon
                eyeIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M21 4L3 20"/>
                `;
            } else {
                // Show eye icon
                eyeIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                `;
            }
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnArrow = submitBtn.querySelector('.btn-arrow');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');

        // Basic validation
        if (!validateEmail(email)) {
            this.showToast('Email Inválido', 'Por favor, insira um email válido.', 'error');
            return;
        }

        if (password.length < 6) {
            this.showToast('Senha Muito Curta', 'A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(submitBtn, btnText, btnArrow, loadingSpinner, true);

        try {
            // Backend login request
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha: password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || errorData.message || 'Falha no login.');
            }

            const result = await response.json();

            // Save token and user data to localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('usuario', email);
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect to dashboard
            this.showToast('Login Realizado!', 'Bem-vindo ao Ocean Dashboard.', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard/index.html';
            }, 1200);
        } catch (error) {
            this.showToast('Erro no Login', error.message, 'error');
        } finally {
            // Hide loading state
            setTimeout(() => {
                this.setLoadingState(submitBtn, btnText, btnArrow, loadingSpinner, false);
            }, 2000);
        }
    }

    setLoadingState(submitBtn, btnText, btnArrow, loadingSpinner, isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnArrow.style.display = 'none';
            loadingSpinner.style.display = 'flex';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnArrow.style.display = 'inline';
            loadingSpinner.style.display = 'none';
        }
    }

    showToast(title, description, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';

        // Add type-specific styling
        const typeColors = {
            success: 'hsl(142, 76%, 36%)',
            error: 'hsl(0, 84%, 60%)',
            info: 'hsl(210, 100%, 55%)'
        };

        toast.style.borderLeft = `4px solid ${typeColors[type] || typeColors.info}`;
        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-description">${description}</div>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    toastContainer.removeChild(toast);
                }, 300);
            }
        }, 5000);
    }

    startAnimations() {
        // Add entrance animations to elements
        const animatedElements = document.querySelectorAll('.fade-in-up');

        // Intersection Observer for scroll-triggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Add ripple effect to buttons
        this.addRippleEffect();
    }

    addRippleEffect() {
        const buttons = document.querySelectorAll('.submit-btn, .forgot-password, .create-account');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    prefillFromRegistration() {
        const justRegistered = localStorage.getItem('justRegisteredEmail');
        if (justRegistered) {
            const emailInput = document.getElementById('email');
            if (emailInput && !emailInput.value) {
                emailInput.value = justRegistered;
            }
        }
    }
}

// Utility Functions
function addRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }

        @keyframes fadeOut {
            0% {
                opacity: 1;
                transform: translateX(0);
            }
            100% {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addRippleStyles();
    new OceanLogin();

    // Add some interactive effects
    document.addEventListener('mousemove', debounce((e) => {
        const liquidBlobs = document.querySelectorAll('.liquid-blob');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        liquidBlobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.02;
            const x = mouseX * speed * 20;
            const y = mouseY * speed * 20;

            blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    }, 50));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Enter key to submit form
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            const form = document.getElementById('loginForm');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }

        // Escape key to clear form
        if (e.key === 'Escape') {
            const form = document.getElementById('loginForm');
            if (form) {
                form.reset();
            }
        }
    });
});

// Performance optimization - Reduce animations on low-end devices
if (navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
}

// Export for module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OceanLogin;
}