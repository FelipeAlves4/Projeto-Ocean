import { showToast, togglePasswordVisibility } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    if (!form) return;

    // Setup password toggle
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function () {
            togglePasswordVisibility(passwordInput, togglePasswordBtn);
        });
    }

    // Setup confirm password toggle
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (toggleConfirmPasswordBtn && confirmPasswordInput) {
        toggleConfirmPasswordBtn.addEventListener('click', function () {
            togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn);
        });
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const birthDateInput = document.getElementById('birthDate');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
        const btnArrow = submitBtn ? submitBtn.querySelector('.btn-arrow') : null;
        const loadingSpinner = submitBtn ? submitBtn.querySelector('.loading-spinner') : null;

        const firstName = (firstNameInput && firstNameInput.value || '').trim();
        const lastName = (lastNameInput && lastNameInput.value || '').trim();
        const birthDate = (birthDateInput && birthDateInput.value || '').trim();
        const usuario = (emailInput && emailInput.value || '').trim();
        const senha = (passwordInput && passwordInput.value || '').trim();
        const confirmSenha = (confirmPasswordInput && confirmPasswordInput.value || '').trim();

        // Validações
        if (!firstName) {
            showToast('Campo obrigatório', 'Por favor, preencha o nome.', 'warning');
            if (firstNameInput) firstNameInput.focus();
            return;
        }

        if (!lastName) {
            showToast('Campo obrigatório', 'Por favor, preencha o sobrenome.', 'warning');
            if (lastNameInput) lastNameInput.focus();
            return;
        }

        if (!birthDate) {
            showToast('Campo obrigatório', 'Por favor, preencha a data de nascimento.', 'warning');
            if (birthDateInput) birthDateInput.focus();
            return;
        }

        if (!usuario) {
            showToast('Campo obrigatório', 'Por favor, preencha o email.', 'warning');
            if (emailInput) emailInput.focus();
            return;
        }

        if (!senha) {
            showToast('Campo obrigatório', 'Por favor, preencha a senha.', 'warning');
            if (passwordInput) passwordInput.focus();
            return;
        }

        if (senha.length < 6) {
            showToast('Senha muito curta', 'A senha deve ter ao menos 6 caracteres.', 'error');
            if (passwordInput) passwordInput.focus();
            return;
        }

        if (!confirmSenha) {
            showToast('Campo obrigatório', 'Por favor, confirme a senha.', 'warning');
            if (confirmPasswordInput) confirmPasswordInput.focus();
            return;
        }

        if (senha !== confirmSenha) {
            showToast('Senhas não coincidem', 'As senhas devem ser iguais.', 'error');
            if (confirmPasswordInput) confirmPasswordInput.focus();
            return;
        }
        const grecaptcha = window.grecaptcha;
        const captchaToken = grecaptcha ? grecaptcha.getResponse() : '';
        if (!captchaToken) {
            showToast('Verificação pendente', 'Marque o reCAPTCHA para continuar.', 'warning');
            grecaptcha && grecaptcha.reset();
            return;
        }

        if (submitBtn && btnText && btnArrow && loadingSpinner) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnArrow.style.display = 'none';
            loadingSpinner.style.display = 'flex';
        }

        try {
            const terms = document.getElementById('termsAccept');
            if (!terms || !terms.checked) {
                throw new Error('Você deve aceitar os Termos de Uso.');
            }

            // Cadastro de usuário via backend Flask
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usuario,
                    password: senha,
                    firstName: firstName,
                    lastName: lastName,
                    birthDate: birthDate,
                    captchaToken
                }),
            });

            let result = {};
            try { result = await response.json(); } catch (_) { }

            if (!response.ok || !result.success) {
                const message = result.message || (response.status === 409 ? 'Usuário já existe.' : 'Erro no cadastro.');
                const type = response.status === 409 ? 'warning' : 'error';
                throw new Error(message);
            }

            // Sucesso! Preencher email para tela de login
            localStorage.setItem('justRegisteredEmail', usuario);
            
            // Salvar informações do usuário no localStorage
            const userInfo = {
                firstName: firstName,
                lastName: lastName,
                birthDate: birthDate,
                email: usuario
            };
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            
            // Also save to localStorage for fallback login
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
            registeredUsers[usuario] = senha;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            
            // Definir plano gratuito (básico) por padrão para novos usuários
            localStorage.setItem('isPremium', 'false');
            
            // Inicializar dados vazios para o novo usuário
            const emptyUserData = {
                tasks: [],
                goals: [],
                finances: {
                    income: 0,
                    expenses: 0,
                    balance: 0,
                },
                transactions: [],
                stats: {
                    tasksCompleted: 0,
                    tasksTotal: 0,
                    productiveTime: 0,
                    activeGoals: 0,
                },
                products: [],
                sales: [],
                profile: {
                    name: firstName,
                    lastName: lastName,
                    birthDate: birthDate,
                    bio: ''
                }
            };
            const userDataKey = `oceanDashboardData_${usuario}`;
            localStorage.setItem(userDataKey, JSON.stringify(emptyUserData));

            showToast('Cadastro realizado', 'Usuário registrado com sucesso! Redirecionando...', 'success');
            // Mantém o botão desabilitado até o redirecionamento para evitar duplo envio
            setTimeout(() => {
                window.location.href = './login.html';
            }, 1300);
        } catch (err) {
            const msg = (err && err.message) ? err.message : 'Falha ao conectar. Verifique sua conexão.';
            showToast('Erro ao registrar', msg, msg.includes('existe') ? 'warning' : 'error');
            if (msg.toLowerCase().includes('senha')) { if (passwordInput) passwordInput.focus(); }
            else if (emailInput) { emailInput.focus(); }
            if (window.grecaptcha) {
                window.grecaptcha.reset();
            }
        } finally {
            if (submitBtn && btnText && btnArrow && loadingSpinner) {
                setTimeout(() => {
                    // Se houve sucesso, o redirect já ocorrerá e não reabilitamos o botão antes disso
                    if (!window.location.href.endsWith('./login.html')) {
                        submitBtn.disabled = false;
                        btnText.style.display = 'inline';
                        btnArrow.style.display = 'inline';
                        loadingSpinner.style.display = 'none';
                    }
                }, 800);
            }
            if (window.grecaptcha && window.location.href.endsWith('registro.html')) {
                window.grecaptcha.reset();
            }
        }
    });
});


