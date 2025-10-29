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
ar ou ocultar senha');
        if (togglePasswordBtn && passwordInput) {
            togglePasswordBtn.addEventListener('click', () => {
                glePasswordBtn.addEventListener('click', () => {
                    this.togglePasswordVisibility(passwordInput, togglePasswordBtn); this.togglePasswordVisibility(passwordInput, togglePasswordBtn);
                }); const isPassword = passwordInput.type === 'password';
            }PasswordBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');

            // Form Submit
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    oginForm = document.getElementById('loginForm');
                    this.handleFormSubmit(e); f(loginForm) {
                    }); loginForm.addEventListener('submit', (e) => {
                    }ubmit(e);

                // Create Account Button
                const createAccountBtn = document.querySelector('.create-account');
                if (createAccountBtn) {
                    createAccountBtn.addEventListener('click', () => {
                        reateAccountBtn = document.querySelector('.create-account');
                        window.location.href = '/paginas/registro.html'; f(createAccountBtn) {
                        }); createAccountBtn.addEventListener('click', () => {
                        }ref = '/paginas/registro.html';

                    // Forgot Password Button
                    const forgotPasswordBtn = document.querySelector('.forgot-password');
                    if (forgotPasswordBtn) {
                        forgotPasswordBtn.addEventListener('click', () => {
                            orgotPasswordBtn = document.querySelector('.forgot-password');
                            this.showToast('Função Indisponível', 'Recuperação de senha ainda não implementada.', 'info'); f(forgotPasswordBtn) {
                            }); forgotPasswordBtn.addEventListener('click', () => {
                            }                this.showToast('Função Indisponível', 'Recuperação de senha ainda não implementada.', 'info');
                    }

                    togglePasswordVisibility(passwordInput, toggleBtn) { }
                    const isPassword = passwordInput.type === 'password';

                    // Toggle input type        const isPassword = passwordInput.type === 'password';
                    passwordInput.type = isPassword ? 'text' : 'password';

                    // Toggle icontype = isPassword ? 'text' : 'password';
                    const eyeIcon = toggleBtn.querySelector('.eye-icon');
                    if (eyeIcon) {
                        if (isPassword) {
                            rySelector('.eye-icon');
                            // Show eye-off icon
                            eyeIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>eIcon.innerHTML = `
                                < path d = "M21 4L3 20" /> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            `;12" cy="12" r="3"/>
            } else {20"/>
                // Show eye icon
                eyeIcon.innerHTML = `
                                < path d = "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> Show eye icon
                                    < circle cx = "12" cy = "12" r = "3" /> eyeIcon.innerHTML = `
                `; <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        } <circle cx="12" cy="12" r="3" />
                    } `;
    }

    async handleFormSubmit(e) {    }
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnArrow = submitBtn.querySelector('.btn-arrow');        const submitBtn = document.querySelector('.submit-btn');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');mitBtn.querySelector('.btn-text');
elector('.btn-arrow');
        // Basic validation
        if (!validateEmail(email)) {
            this.showToast('Email Inválido', 'Por favor, insira um email válido.', 'error');/ Basic validation
            return;        if (!this.validateForm(email, password)) {
        }

        if (password.length < 6) {
            this.showToast('Senha Muito Curta', 'A senha deve ter pelo menos 6 caracteres.', 'error');/ Show loading state
            return;        this.setLoadingState(submitBtn, btnText, btnArrow, loadingSpinner, true);
        }

        // Show loading state            /*
        this.setLoadingState(submitBtn, btnText, btnArrow, loadingSpinner, true);/ BACKEND LOGIN (desativado para testes sem backend)
nst response = await fetch('/api/login', {
        try {
            /*
            // BACKEND LOGIN (desativado para testes sem backend)pe': 'application/json'
            const response = await fetch('/api/login', {
                method: 'POST', senha: password })
                headers: {
                    'Content-Type': 'application/json'
                },(!response.ok) {
                body: JSON.stringify({ usuario: email, senha: password })alha no login.');
            });
            const result = await response.json();
            if (!response.ok) {/
                throw new Error(result.erro || 'Falha no login.');
            } LOGIN SIMPLES (sem backend) para testes locais
            localStorage.setItem('token', result.token);            const allowedDefaults = [
            */
', p: 'admin123' }
            // LOGIN SIMPLES (sem backend) para testes locais
            const allowedDefaults = [('users');
                { u: 'demo@ocean.com', p: 'demo123' },nst storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
                { u: 'admin@ocean.com', p: 'admin123' };
            ];werCase() && c.p === password);
            const storedUsersRaw = localStorage.getItem('users');
            const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
            const allUsers = [...allowedDefaults, ...storedUsers];
            const isAllowed = allUsers.some(c => c.u.toLowerCase() === email.toLowerCase() && c.p === password);
            if (!isAllowed) {/ Se veio de registro, limpar sugestão
                throw new Error('Credenciais inválidas. Tente demo@ocean.com / demo123');            const justRegistered = localStorage.getItem('justRegisteredEmail');
            }LowerCase() === email.toLowerCase()) {

            // Se veio de registro, limpar sugestão
            const justRegistered = localStorage.getItem('justRegisteredEmail');
            if (justRegistered && justRegistered.toLowerCase() === email.toLowerCase()) {/ Persistência simples
                localStorage.removeItem('justRegisteredEmail');            localStorage.setItem('token', 'dev-token');
            }sLoggedIn', 'true');

            // Persistência simples
            localStorage.setItem('token', 'dev-token');-vindo ao Ocean Dashboard.', 'success');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('usuario', email);
                window.location.href = '//statics.teams.cdn.office.net/evergreen-assets/safelinks/2/atp-safelinks.html';
            this.showToast('Login Realizado!', 'Bem-vindo ao Ocean Dashboard.', 'success');

            setTimeout(() => {r) {
                window.location.href = '//statics.teams.cdn.office.net/evergreen-assets/safelinks/2/atp-safelinks.html';            this.showToast('Erro no Login', error.message, 'error');
            }, 1200);

        } catch (error) {out(() => {
            this.showToast('Erro no Login', error.message, 'error');ate(submitBtn, btnText, btnArrow, loadingSpinner, false);
        } finally {
            // Hide loading state
            setTimeout(() => {
                this.setLoadingState(submitBtn, btnText, btnArrow, loadingSpinner, false);
            }, 2000);etLoadingState(submitBtn, btnText, btnArrow, loadingSpinner, isLoading) {
        }        if (isLoading) {
    }
e.display = 'none';
    setLoadingState(submitBtn, btnText, btnArrow, loadingSpinner, isLoading) {none';
        if (isLoading) {'flex';
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnArrow.style.display = 'none';ext.style.display = 'inline';
            loadingSpinner.style.display = 'flex';nline';
        } else {one';
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnArrow.style.display = 'inline';
            loadingSpinner.style.display = 'none';/ simulateLogin removed in favor of real API
        }
    }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // simulateLogin removed in favor of real APItest(email);

    showToast(title, description, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');alidateForm(email, password) {
        const toast = document.createElement('div');        if (!this.validateEmail(email)) {
        toast.className = 'toast';favor, insira um email válido.', 'error');

        // Add type-specific styling
        const typeColors = {
            success: 'hsl(142, 76%, 36%)',            this.showToast('Senha Muito Curta', 'A senha deve ter pelo menos 6 caracteres.', 'error');
            error: 'hsl(0, 84%, 60%)',
            info: 'hsl(210, 100%, 55%)'
        };

        toast.style.borderLeft = `4px solid ${ typeColors[type] || typeColors.info } `;
ast(title, description, type = 'info') {
        toast.innerHTML = `        const toastContainer = document.getElementById('toastContainer');
            <div class="toast-title">${title}</div>
            <div class="toast-description">${description}</div>        toast.className = 'toast';
                    `;

        toastContainer.appendChild(toast);
  success: 'hsl(142, 76%, 36%)',
        // Auto remove after 5 seconds            error: 'hsl(0, 84%, 60%)',
        setTimeout(() => {
            if (toast.parentNode) {        };
                toast.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {Left = `4px solid ${ typeColors[type] || typeColors.info } `;
                    toastContainer.removeChild(toast);
                }, 300);
            }e">${title}</div>
        }, 5000);on}</div>
    }

    startAnimations() {ainer.appendChild(toast);
        // Add entrance animations to elements
        const animatedElements = document.querySelectorAll('.fade-in-up');        // Auto remove after 5 seconds
> {
        // Intersection Observer for scroll-triggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {                setTimeout(() => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        });

        animatedElements.forEach(element => {ions() {
            observer.observe(element);Add entrance animations to elements
        });        const animatedElements = document.querySelectorAll('.fade-in-up');

        // Add ripple effect to buttonscroll-triggered animations
        this.addRippleEffect();st observer = new IntersectionObserver((entries) => {
    }            entries.forEach(entry => {
g) {
    addRippleEffect() {t.style.animationPlayState = 'running';
        const buttons = document.querySelectorAll('.submit-btn, .forgot-password, .create-account');           }
            });
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');        animatedElements.forEach(element => {
                const rect = button.getBoundingClientRect();t);
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';    addRippleEffect() {
                ripple.classList.add('ripple');-password, .create-account');

                button.style.position = 'relative';
                button.style.overflow = 'hidden';) => {
                button.appendChild(ripple);                const ripple = document.createElement('span');
ntRect();
                setTimeout(() => { rect.height);
                    ripple.remove();left - size / 2;
                }, 600);                const y = e.clientY - rect.top - size / 2;
            });
        }); ripple.style.height = size + 'px';
    }tyle.left = x + 'px';
 ripple.style.top = y + 'px';
    prefillFromRegistration() {     ripple.classList.add('ripple');
        const justRegistered = localStorage.getItem('justRegisteredEmail');
        if (justRegistered) {                button.style.position = 'relative';
            const emailInput = document.getElementById('email');erflow = 'hidden';
            if (emailInput && !emailInput.value) {
                emailInput.value = justRegistered;
            }
        }
    }
});
);
// Utility Functions
function addRippleStyles() {
    const style = document.createElement('style');    prefillFromRegistration() {
    style.textContent = `gistered = localStorage.getItem('justRegisteredEmail');
        .ripple {
                        {
                            position: absolute; ById('email');
                            border - radius: 50 %; t && !emailInput.value) {
                                background: rgba(255, 255, 255, 0.3); mailInput.value = justRegistered;
                                animation: ripple 0.6s ease - out;
                                pointer - events: none;
                            }

                            @keyframes ripple {
                                0 % {
                                    y Functions
                transform: scale(0); addRippleStyles() {
                                        opacity: 1; createElement('style');
                                    }ntent = `
            100% {
                transform: scale(1);ute;
                opacity: 0;order-radius: 50%;
            }ound: rgba(255, 255, 255, 0.3);
        }ase-out;
         none;
        @keyframes fadeOut {
            0% {
                opacity: 1;@keyframes ripple {
                transform: translateX(0);
            }transform: scale(0);
            100% {
                opacity: 0;
                transform: translateX(100%);00% {
            }ansform: scale(1);
        }
    `;
                                    document.head.appendChild(style);
                                }
                                @keyframes fadeOut {
                                    // Initialize when DOM is loaded
                                    document.addEventListener('DOMContentLoaded', () => {
                                        opacity: 1;
                                        addRippleStyles(); transform: translateX(0);
                                        new OceanLogin();
                                    });
                                    y: 0;
                                    // Add some interactive effectsform: translateX(100%);
                                    document.addEventListener('mousemove', debounce((e) => { }
    const liquidBlobs = document.querySelectorAll('.liquid-blob');
                                }
                                const mouseX = e.clientX / window.innerWidth;
                                const mouseY = e.clientY / window.innerHeight;

                                liquidBlobs.forEach((blob, index) => {
                                    const speed = (index + 1) * 0.02;
                                    const x = mouseX * speed * 20; document.addEventListener('DOMContentLoaded', () => {
                                        const y = mouseY * speed * 20;

                                        blob.style.transform = `translate(${x}px, ${y}px)`;
                                    });
                                }, 50));// Add some interactive effects

                                // Keyboard shortcutst.addEventListener('mousemove', (e) => {
                                document.addEventListener('keydown', (e) => {
                                    clearTimeout(debounceTimeout);
                                    // Enter key to submit form    debounceTimeout = setTimeout(() => {
                                    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                                        lobs = document.querySelectorAll('.liquid-blob');
                                        const form = document.getElementById('loginForm'); erWidth;
                                        if (form) {
                                            Y / window.innerHeight;
                                            form.dispatchEvent(new Event('submit'));
                                        }
                                    } peed = (index + 1) * 0.02;

                                    // Escape key to clear form   const y = mouseY * speed * 20;
                                    if (e.key === 'Escape') {
                                        const form = document.getElementById('loginForm'); blob.style.transform = `translate(${x}px, ${y}px)`;
                                        if (form) {
                                            form.reset();
                                        }
                                    }
                                });
                                addEventListener('keydown', (e) => {
                                    // Performance optimization - Reduce animations on low-end devices/ Enter key to submit form
                                    if (navigator.hardwareConcurrency <= 2) {
                                        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                                            document.documentElement.style.setProperty('--animation-duration', '0.1s'); const form = document.getElementById('loginForm');
                                        }
                                        'submit'));
                                // Export for module use (if needed)
                                if (typeof module !== 'undefined' && module.exports) { }
                                module.exports = OceanLogin;
                            }

                            // removed legacy submit handler that bypassed backend    }
                        });

                        // Performance optimization - Reduce animations on low-end devices
                        if (navigator.hardwareConcurrency <= 2) {
                            document.documentElement.style.setProperty('--animation-duration', '0.1s');
                        }

                        // Export for module use (if needed)
                        if (typeof module !== 'undefined' && module.exports) {
                            module.exports = OceanLogin;
                        }

// removed legacy submit handler that bypassed backend