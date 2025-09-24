// Ocean Dashboard JavaScript

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    if (window.lucide && lucide.createIcons) {
        lucide.createIcons();
    }
    
    // Simple auth guard
    try {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            window.location.href = './login.html';
            return;
        }
    } catch (_) {}

    // Initialize theme
    initializeTheme();
    
    // Initialize settings
    initializeSettings();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load saved settings
    loadSettings();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    document.body.className = theme + '-theme';
    localStorage.setItem('theme', theme);
    
    // Update theme select in settings
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = theme;
    }
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    
    showToast('Tema alterado', `Interface alterada para tema ${newTheme === 'light' ? 'claro' : 'escuro'}`, 'info');
}

// Settings Management
function initializeSettings() {
    const defaultSettings = {
        theme: 'light',
        language: 'pt-BR',
        notifications: true,
        autoSave: true,
        dataBackup: false,
        analytics: true
    };
    
    const savedSettings = localStorage.getItem('appSettings');
    if (!savedSettings) {
        localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    }
}

function loadSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
        
        // Apply settings to UI elements
        const themeSelect = document.getElementById('themeSelect');
        const languageSelect = document.getElementById('languageSelect');
        const notificationsToggle = document.getElementById('notificationsToggle');
        const autoSaveToggle = document.getElementById('autoSaveToggle');
        const backupToggle = document.getElementById('backupToggle');
        const analyticsToggle = document.getElementById('analyticsToggle');
        
        if (themeSelect) themeSelect.value = settings.theme || 'light';
        if (languageSelect) languageSelect.value = settings.language || 'pt-BR';
        if (notificationsToggle) notificationsToggle.checked = settings.notifications !== false;
        if (autoSaveToggle) autoSaveToggle.checked = settings.autoSave !== false;
        if (backupToggle) backupToggle.checked = settings.dataBackup === true;
        if (analyticsToggle) analyticsToggle.checked = settings.analytics !== false;
        
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

function saveSettings() {
    try {
        const settings = {
            theme: document.getElementById('themeSelect')?.value || 'light',
            language: document.getElementById('languageSelect')?.value || 'pt-BR',
            notifications: document.getElementById('notificationsToggle')?.checked || false,
            autoSave: document.getElementById('autoSaveToggle')?.checked || false,
            dataBackup: document.getElementById('backupToggle')?.checked || false,
            analytics: document.getElementById('analyticsToggle')?.checked || false
        };
        
        localStorage.setItem('appSettings', JSON.stringify(settings));
        
        // Apply theme if changed
        applyTheme(settings.theme);
        
        showToast('Configurações salvas', 'Suas preferências foram atualizadas com sucesso!', 'success');
        
        // Request notification permission if enabled
        if (settings.notifications && 'Notification' in window) {
            Notification.requestPermission();
        }
        
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        showToast('Erro', 'Erro ao salvar configurações', 'error');
    }
}

// Navigation Management
function showSection(sectionName) {
    // Reset body class
    document.body.classList.remove('settings-view');
    
    // Show/hide welcome section and stats
    const welcomeSection = document.getElementById('welcomeSection');
    const statsGrid = document.getElementById('statsGrid');
    const tabNavigation = document.getElementById('tabNavigation');
    
    if (sectionName === 'settings') {
        // Hide dashboard elements, show settings
        document.body.classList.add('settings-view');
        if (welcomeSection) welcomeSection.style.display = 'none';
        if (statsGrid) statsGrid.style.display = 'none';
        if (tabNavigation) tabNavigation.style.display = 'none';
        showTabContent('settings');
    } else {
        // Show dashboard elements
        if (welcomeSection) welcomeSection.style.display = 'block';
        if (statsGrid) statsGrid.style.display = 'grid';
        if (tabNavigation) tabNavigation.style.display = 'flex';
        showTabContent('recent');
    }
    
    // Update sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Close sidebar
    closeSidebar();
}

function showTabContent(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected tab content
    const targetContent = document.getElementById(tabName);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}

// Sidebar Management
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

// Toast Notifications
function showToast(title, description, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Event Listeners
function initializeEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', openSidebar);
    }
    
    // Close sidebar
    const closeSidebarBtn = document.getElementById('closeSidebar');
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }
    
    // Sidebar overlay
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            showTabContent(tab);
        });
    });
    
    // Settings form
    const saveBtn = document.getElementById('saveSettings');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
    
    // Settings real-time updates
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            applyTheme(e.target.value);
            showToast('Tema alterado', `Interface alterada para tema ${e.target.value === 'light' ? 'claro' : 'escuro'}`, 'info');
        });
    }
    
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            showToast('Idioma alterado', `Interface alterada para ${e.target.value === 'pt-BR' ? 'Português' : 'English'}`, 'info');
        });
    }
    
    const notificationsToggle = document.getElementById('notificationsToggle');
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', (e) => {
            showToast(
                e.target.checked ? 'Notificações ativadas' : 'Notificações desativadas',
                e.target.checked ? 'Você receberá notificações em tempo real' : 'Notificações foram desabilitadas',
                'info'
            );
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt + T for theme toggle
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Escape to close sidebar
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });
}

// Utility Functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
}

// Demo data animation
function animateStats() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = width; }, 100);
        }, index * 200);
    });
}

// Initialize animations on load
window.addEventListener('load', () => { setTimeout(animateStats, 500); });


