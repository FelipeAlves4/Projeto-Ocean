import { showToast, togglePasswordVisibility } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    if (!form) return;

    // Setup password toggle
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            togglePasswordVisibility(passwordInput, togglePasswordBtn);
        });
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
        const btnArrow = submitBtn ? submitBtn.querySelector('.btn-arrow') : null;
        const loadingSpinner = submitBtn ? submitBtn.querySelector('.loading-spinner') : null;

        const usuario = (emailInput && emailInput.value || '').trim();
        const senha = (passwordInput && passwordInput.value || '').trim();

        if (!usuario || !senha) {
            showToast('Campos obrigatórios', 'Por favor, preencha email e senha.', 'warning');
            if (!usuario && emailInput) emailInput.focus(); else if (passwordInput) passwordInput.focus();
            return;
        }

        if (senha.length < 6) {
            showToast('Senha muito curta', 'A senha deve ter ao menos 6 caracteres.', 'error');
            if (passwordInput) passwordInput.focus();
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
                    password: senha
                }),
            });

            let result = {};
            try { result = await response.json(); } catch (_) {}

            if (!response.ok || !result.success) {
                const message = result.message || (response.status === 409 ? 'Usuário já existe.' : 'Erro no cadastro.');
                const type = response.status === 409 ? 'warning' : 'error';
                throw new Error(message);
            }

            // Sucesso! Preencher email para tela de login
            localStorage.setItem('justRegisteredEmail', usuario);

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
        }
    });
});


