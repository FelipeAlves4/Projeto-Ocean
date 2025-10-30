document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    if (!form) return;

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
            alert('Por favor, preencha email e senha.');
            return;
        }

        if (senha.length < 6) {
            alert('A senha deve ter ao menos 6 caracteres.');
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
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Erro no cadastro.');
            }

            // Sucesso! Preencher email para tela de login
            localStorage.setItem('justRegisteredEmail', usuario);

            alert('Usuário registrado com sucesso! Redirecionando para o login...');
            window.location.href = '../paginas/login.html';
        } catch (err) {
            alert(err.message);
        } finally {
            if (submitBtn && btnText && btnArrow && loadingSpinner) {
                setTimeout(() => {
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnArrow.style.display = 'inline';
                    loadingSpinner.style.display = 'none';
                }, 1000);
            }
        }
    });
});


