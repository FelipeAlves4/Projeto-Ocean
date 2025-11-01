
// Função para debounce
export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Função para validação de email
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Toggle visibility of a password input and update the eye icon
export function togglePasswordVisibility(passwordInput, toggleBtn) {
    if (!passwordInput || !toggleBtn) return;
    const isPassword = passwordInput.type === 'password';

    // Toggle input type
    passwordInput.type = isPassword ? 'text' : 'password';

    // Toggle aria-pressed attribute for accessibility
    toggleBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');

    // Update the icon inside the button (expects an element with class .eye-icon)
    const eyeIcon = toggleBtn.querySelector('.eye-icon');
    if (!eyeIcon) return;

    if (isPassword) {
        // Switch to eye-off (with a slash)
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
            <path d="M21 4L3 20" />
        `;
    } else {
        // Switch to eye (open)
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        `;
    }
}

// Injetar estilos base de toast e modais uma única vez
function ensureBaseStyles() {
    if (document.getElementById('ocean-ui-styles')) return;
    const style = document.createElement('style');
    style.id = 'ocean-ui-styles';
    style.textContent = `
        .toast-container { position: fixed; top: 16px; right: 16px; display: flex; flex-direction: column; gap: 8px; z-index: 9999; max-width: 360px; }
        .toast { background: rgba(17, 24, 39, 0.95); color: #fff; padding: 12px 14px; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); backdrop-filter: blur(8px); border-left: 4px solid #3b82f6; animation: slideIn 250ms ease-out; }
        .toast-title { font-weight: 700; margin-bottom: 2px; }
        .toast-description { font-size: 0.9rem; opacity: 0.9; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(16px); } }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 9998; animation: fadeIn 120ms ease-out; }
        .modal { width: min(92vw, 420px); background: #0f172a; color: #e5e7eb; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.35); overflow: hidden; }
        .modal-header { padding: 14px 16px; font-weight: 700; background: rgba(255,255,255,0.04); }
        .modal-body { padding: 14px 16px; }
        .modal-actions { display: flex; gap: 8px; padding: 12px 16px; justify-content: flex-end; background: rgba(255,255,255,0.03); }
        .btn { padding: 8px 12px; border-radius: 8px; border: 1px solid transparent; cursor: pointer; font-weight: 600; }
        .btn-primary { background: #3b82f6; color: #fff; }
        .btn-outline { background: transparent; color: #e5e7eb; border-color: rgba(255,255,255,0.2); }
        .btn-danger { background: #ef4444; color: #fff; }
        .modal-input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); color: #fff; margin-top: 8px; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    `;
    document.head.appendChild(style);
}

function ensureToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

export function showToast(title, description, type = 'info') {
    ensureBaseStyles();
    const container = ensureToastContainer();

    const typeColors = {
        success: 'hsl(142, 76%, 36%)',
        error: 'hsl(0, 84%, 60%)',
        info: 'hsl(210, 100%, 55%)',
        warning: 'hsl(38, 92%, 50%)'
    };

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeft = `4px solid ${typeColors[type] || typeColors.info}`;
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'fadeOut 250ms ease-in forwards';
            setTimeout(() => {
                if (toast.parentNode) container.removeChild(toast);
            }, 260);
        }
    }, 4000);
}

function createModal({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', confirmClass = 'btn-primary', input = null }) {
    ensureBaseStyles();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const header = document.createElement('div');
    header.className = 'modal-header';
    header.textContent = title || 'Confirmação';

    const body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = `<div>${message || ''}</div>`;
    let inputEl = null;
    if (input) {
        inputEl = document.createElement('input');
        inputEl.className = 'modal-input';
        inputEl.type = input.type || 'text';
        inputEl.value = input.value || '';
        inputEl.placeholder = input.placeholder || '';
        body.appendChild(inputEl);
        setTimeout(() => inputEl.focus(), 0);
    }

    const actions = document.createElement('div');
    actions.className = 'modal-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-outline';
    cancelBtn.textContent = cancelText;

    const confirmBtn = document.createElement('button');
    confirmBtn.className = `btn ${confirmClass}`;
    confirmBtn.textContent = confirmText;

    actions.appendChild(cancelBtn);
    actions.appendChild(confirmBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(actions);

    overlay.appendChild(modal);

    return { overlay, confirmBtn, cancelBtn, inputEl };
}

export function showConfirm({ title = 'Confirmar ação', message = 'Tem certeza?', confirmText = 'Confirmar', cancelText = 'Cancelar', danger = false } = {}) {
    return new Promise((resolve) => {
        const { overlay, confirmBtn, cancelBtn } = createModal({
            title,
            message,
            confirmText,
            cancelText,
            confirmClass: danger ? 'btn-danger' : 'btn-primary',
        });

        function cleanup(result) {
            document.body.removeChild(overlay);
            resolve(result);
        }

        confirmBtn.addEventListener('click', () => cleanup(true));
        cancelBtn.addEventListener('click', () => cleanup(false));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(false); });
        document.addEventListener('keydown', function onKey(e) {
            if (e.key === 'Escape') { cleanup(false); document.removeEventListener('keydown', onKey); }
            if (e.key === 'Enter') { cleanup(true); document.removeEventListener('keydown', onKey); }
        });

        document.body.appendChild(overlay);
    });
}

export function showPrompt({ title = 'Inserir valor', message = '', placeholder = '', defaultValue = '' } = {}) {
    return new Promise((resolve) => {
        const { overlay, confirmBtn, cancelBtn, inputEl } = createModal({
            title,
            message,
            confirmText: 'Salvar',
            cancelText: 'Cancelar',
            confirmClass: 'btn-primary',
            input: { type: 'text', value: defaultValue, placeholder },
        });

        function cleanup(result) {
            document.body.removeChild(overlay);
            resolve(result);
        }

        confirmBtn.addEventListener('click', () => cleanup(inputEl.value));
        cancelBtn.addEventListener('click', () => cleanup(null));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(null); });
        inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') cleanup(inputEl.value); if (e.key === 'Escape') cleanup(null); });

        document.body.appendChild(overlay);
        inputEl.select();
    });
}