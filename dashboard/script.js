import { showToast, showConfirm, showPrompt } from '../scripts/utils.js'

// ============================================
// AUTHENTICATION CHECK
// ============================================

function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const usuario = localStorage.getItem('usuario');
    
    if (!isLoggedIn || !usuario) {
        // Redirect to login if not authenticated
        showToast('Acesso Negado', 'Você precisa fazer login para acessar o dashboard.', 'error');
        setTimeout(() => {
            window.location.href = '../paginas/login.html';
        }, 1500);
        return false;
    }
    
    return true;
}

// Check authentication on page load
if (!checkAuthentication()) {
    // Stop execution if not authenticated
    throw new Error('User not authenticated');
}

// ============================================
// DATA MANAGEMENT (User-specific)
// ============================================

// Get current user email
const currentUser = localStorage.getItem('usuario') || 'guest';

// Default data structure (vazio para novos usuários)
const defaultData = {
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
}

// Load data from localStorage or use default (user-specific)
function loadData() {
    const userDataKey = `oceanDashboardData_${currentUser}`;
    const savedData = localStorage.getItem(userDataKey);
    return savedData ? JSON.parse(savedData) : defaultData;
}

// Save data to localStorage (user-specific)
function saveData(data) {
    const userDataKey = `oceanDashboardData_${currentUser}`;
    localStorage.setItem(userDataKey, JSON.stringify(data));
}

// Initialize data
const appData = loadData()

// ============================================
// UPDATE USER PROFILE INFO
// ============================================

function updateUserProfile() {
    const userEmail = localStorage.getItem('usuario') || 'usuario@ocean.com';
    const profileEmail = document.getElementById('profileEmail');
    const profileEmailInput = document.getElementById('profileEmailInput');
    const profileName = document.getElementById('profileName');
    const profileNameInput = document.getElementById('profileNameInput');
    
    // Get saved profile data or use defaults
    const savedProfile = appData.profile || {};
    const displayName = savedProfile.name || userEmail.split('@')[0];
    const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    
    if (profileEmail) {
        profileEmail.textContent = userEmail;
    }
    if (profileEmailInput) {
        profileEmailInput.value = userEmail;
    }
    if (profileName) {
        profileName.textContent = capitalizedName;
    }
    if (profileNameInput) {
        profileNameInput.value = savedProfile.name || capitalizedName;
    }
}

// Render profile page with synchronized data
function renderProfilePage() {
    // Update user profile info
    updateUserProfile()
    
    // Update profile statistics
    const completedTasks = appData.tasks.filter((t) => t.status === "completed").length
    const activeGoals = appData.goals.length
    
    // Calculate days of use (from first task creation or default to 1)
    let daysUsed = 1
    if (appData.tasks && appData.tasks.length > 0) {
        const taskDates = appData.tasks
            .map(t => new Date(t.createdAt).getTime())
            .filter(date => !isNaN(date))
        
        if (taskDates.length > 0) {
            const firstTaskDate = new Date(Math.min(...taskDates))
            const today = new Date()
            const diffTime = Math.abs(today - firstTaskDate)
            daysUsed = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
        }
    }
    
    // Update profile stats
    const tasksCompletedEl = document.getElementById('profileTasksCompleted')
    const activeGoalsEl = document.getElementById('profileActiveGoals')
    const daysUsedEl = document.getElementById('profileDaysUsed')
    const profileBioEl = document.getElementById('profileBio')
    const profileNameInput = document.getElementById('profileNameInput')
    
    if (tasksCompletedEl) {
        tasksCompletedEl.textContent = completedTasks
    }
    if (activeGoalsEl) {
        activeGoalsEl.textContent = activeGoals
    }
    if (daysUsedEl) {
        daysUsedEl.textContent = daysUsed
    }
    
    // Load saved profile data
    if (appData.profile) {
        if (profileNameInput && appData.profile.name) {
            profileNameInput.value = appData.profile.name
        }
        if (profileBioEl && appData.profile.bio) {
            profileBioEl.value = appData.profile.bio
        }
    }
    
    // Update header name display
    updateUserProfile()
}

// Update profile on page load
updateUserProfile();

// ============================================
// DOM ELEMENTS
// ============================================

const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const sidebar = document.getElementById("sidebar")
const overlay = document.getElementById("overlay")
const navItems = document.querySelectorAll(".nav-item")
const tabBtns = document.querySelectorAll(".tab-btn")
const tabPanels = document.querySelectorAll(".tab-panel")

// ============================================
// MOBILE MENU
// ============================================

function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle("active")
    sidebar.classList.toggle("active")
    overlay.classList.toggle("active")
    document.body.style.overflow = sidebar.classList.contains("active") ? "hidden" : ""
}

mobileMenuBtn.addEventListener("click", toggleMobileMenu)
overlay.addEventListener("click", toggleMobileMenu)

// ============================================
// NAVIGATION
// ============================================

navItems.forEach((item) => {
    item.addEventListener("click", () => {
        navItems.forEach((nav) => nav.classList.remove("active"))
        item.classList.add("active")

        if (sidebar.classList.contains("active")) {
            toggleMobileMenu()
        }

        const section = item.dataset.section
        handleNavigation(section)
    })
})

function handleNavigation(section) {
    const allSections = document.querySelectorAll(".page-section")
    allSections.forEach((s) => s.classList.remove("active"))

    const targetSection = document.querySelector(`[data-section-content="${section}"]`)
    if (targetSection) {
        targetSection.classList.add("active")
    }

    // Update page title based on section
    const pageTitle = document.querySelector(".page-title")
    const pageSubtitle = document.querySelector(".page-subtitle")

    const sectionTitles = {
        dashboard: { title: "Dashboard", subtitle: "Controle suas tarefas, metas e finanças em um só lugar." },
        tarefas: { title: "Tarefas", subtitle: "Gerencie todas as suas tarefas e projetos." },
        metas: { title: "Metas", subtitle: "Acompanhe o progresso das suas metas." },
        financas: { title: "Finanças", subtitle: "Controle suas receitas e despesas." },
        produtos: { title: "Produtos", subtitle: "Gerencie seu catálogo de produtos." },
        configuracoes: { title: "Configurações", subtitle: "Personalize sua experiência." },
        perfil: { title: "Perfil", subtitle: "Gerencie suas informações pessoais." },
        ajuda: { title: "Ajuda", subtitle: "Encontre respostas para suas dúvidas." },
    }

    if (sectionTitles[section]) {
        pageTitle.textContent = sectionTitles[section].title
        pageSubtitle.textContent = sectionTitles[section].subtitle
    }

    if (section === "tarefas") {
        renderFullTasksList()
    } else if (section === "metas") {
        renderFullGoalsList()
    } else if (section === "financas") {
        renderFinancesPage()
    } else if (section === "produtos") {
        renderProductsPage()
    } else if (section === "perfil") {
        renderProfilePage()
    }
}

// ============================================
// TAB SWITCHING
// ============================================

tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const targetTab = btn.dataset.tab

        tabBtns.forEach((tab) => tab.classList.remove("active"))
        tabPanels.forEach((panel) => panel.classList.remove("active"))

        btn.classList.add("active")
        const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`)
        if (targetPanel) {
            targetPanel.classList.add("active")
        }
        
        // Update finances when switching to finance tab
        if (targetTab === "financeira") {
            renderFinances()
        }
    })
})

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderSummaryCards() {
    // Recalculate finances before rendering to ensure values are up to date
    recalculateFinances()
    
    const completedTasks = appData.tasks.filter((t) => t.status === "completed").length
    const totalTasks = appData.tasks.length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Update summary cards
    document.querySelector(".summary-card:nth-child(1) .card-value").textContent = `${completedTasks}/${totalTasks}`
    document.querySelector(".summary-card:nth-child(1) .progress-fill").style.width = `${completionRate}%`

    document.querySelector(".summary-card:nth-child(2) .card-value").textContent = `${appData.stats.productiveTime}h`

    const activeGoals = appData.goals.length
    const goalsInProgress = appData.goals.filter((g) => g.progress < 100 && g.progress >= 50).length
    const goalsDelayed = appData.goals.filter((g) => g.progress < 50).length
    document.querySelector(".summary-card:nth-child(3) .card-value").textContent = activeGoals
    document.querySelector(".summary-card:nth-child(3) .card-subtitle").textContent =
        `${goalsInProgress} em progresso, ${goalsDelayed} atrasada${goalsDelayed !== 1 ? "s" : ""}`

    document.querySelector(".summary-card:nth-child(4) .card-value").textContent =
        `R$ ${appData.finances.balance.toLocaleString("pt-BR")}`
}

function renderTasks() {
    const tasksList = document.querySelector(".tasks-list")
    tasksList.innerHTML = ""

    appData.tasks.forEach((task) => {
        const taskItem = document.createElement("div")
        taskItem.className = "task-item"
        taskItem.innerHTML = `
          <div class="task-info">
            <div class="task-indicator ${task.status === "completed" ? "task-indicator-success" : ""}"></div>
            <span class="task-name">${task.name}</span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="task-badge ${task.status === "completed" ? "badge-completed" : "badge-pending"}">
              ${task.status === "completed" ? "Concluída" : "Pendente"}
            </span>
            <button class="task-action-btn" data-task-id="${task.id}" data-action="${task.status === "completed" ? "uncomplete" : "complete"}" 
                    style="background: none; border: none; cursor: pointer; padding: 0.5rem; color: var(--text-secondary); transition: var(--transition);"
                    onmouseover="this.style.color='var(--accent-primary)'" 
                    onmouseout="this.style.color='var(--text-secondary)'">
              ${task.status === "completed" ? "↶" : "✓"}
            </button>
            <button class="task-delete-btn" data-task-id="${task.id}"
                    style="background: none; border: none; cursor: pointer; padding: 0.5rem; color: var(--text-secondary); transition: var(--transition);"
                    onmouseover="this.style.color='var(--danger)'" 
                    onmouseout="this.style.color='var(--text-secondary)'">
              ✕
            </button>
          </div>
        `
        tasksList.appendChild(taskItem)
    })

    // Add event listeners for task actions
    document.querySelectorAll(".task-action-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation()
            const taskId = Number.parseInt(btn.dataset.taskId)
            const action = btn.dataset.action
            toggleTaskStatus(taskId, action)
        })
    })

    document.querySelectorAll(".task-delete-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation()
            const taskId = Number.parseInt(btn.dataset.taskId)
            const confirmed = await showConfirm({
                title: 'Excluir tarefa',
                message: 'Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.',
                confirmText: 'Excluir',
                danger: true
            })
            if (confirmed) {
                deleteTask(taskId)
                showToast('Tarefa excluída', 'A tarefa foi removida com sucesso.', 'success')
            }
        })
    })
}

function renderGoals() {
    const goalsGrid = document.querySelector(".goals-grid")
    goalsGrid.innerHTML = ""

    appData.goals.forEach((goal) => {
        const goalCard = document.createElement("div")
        goalCard.className = "goal-card"

        let progressClass = ""
        if (goal.progress >= 70) progressClass = ""
        else if (goal.progress >= 50) progressClass = "progress-success"
        else progressClass = "progress-warning"

        goalCard.innerHTML = `
          <div class="goal-header">
            <h4 class="goal-title">${goal.title}</h4>
            <span class="goal-percentage">${goal.progress}%</span>
          </div>
          <div class="progress-bar progress-bar-large">
            <div class="progress-fill ${progressClass}" style="width: ${goal.progress}%"></div>
          </div>
          <p class="goal-description">${goal.description}</p>
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <button class="goal-update-btn" data-goal-id="${goal.id}"
                    style="flex: 1; padding: 0.5rem; background: var(--accent-primary); color: white; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.875rem; transition: var(--transition);"
                    onmouseover="this.style.background='var(--accent-hover)'" 
                    onmouseout="this.style.background='var(--accent-primary)'">
              Atualizar Progresso
            </button>
            <button class="goal-delete-btn" data-goal-id="${goal.id}"
                    style="padding: 0.5rem 1rem; background: transparent; color: var(--danger); border: 1px solid var(--danger); border-radius: var(--radius-sm); cursor: pointer; font-size: 0.875rem; transition: var(--transition);"
                    onmouseover="this.style.background='var(--danger-light)'" 
                    onmouseout="this.style.background='transparent'">
              Excluir
            </button>
          </div>
        `
        goalsGrid.appendChild(goalCard)
    })

    // Add event listeners for goal actions
    document.querySelectorAll(".goal-update-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const goalId = Number.parseInt(btn.dataset.goalId)
            const goal = appData.goals.find((g) => g.id === goalId)
            const newProgress = await showPrompt({
                title: 'Atualizar progresso',
                message: `Meta: ${goal.title}<br/>Progresso atual: ${goal.progress}%`,
                placeholder: 'Novo progresso (0-100)',
                defaultValue: String(goal.progress)
            })
            if (newProgress !== null) {
                const progress = Math.min(100, Math.max(0, Number.parseInt(newProgress) || 0))
                goal.progress = progress
                goal.current = (progress / 100) * goal.target
                saveData(appData)
                renderGoals()
                renderSummaryCards()
                animateProgressBars()
                showToast('Progresso atualizado', 'A meta foi atualizada com sucesso.', 'success')
            }
        })
    })

    document.querySelectorAll(".goal-delete-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const goalId = Number.parseInt(btn.dataset.goalId)
            const confirmed = await showConfirm({
                title: 'Excluir meta',
                message: 'Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.',
                confirmText: 'Excluir',
                danger: true
            })
            if (confirmed) {
                deleteGoal(goalId)
                showToast('Meta excluída', 'A meta foi removida com sucesso.', 'success')
            }
        })
    })
}

function renderFinances() {
    // Always recalculate before rendering to ensure values are accurate
    recalculateFinances()
    
    // Update all finance income elements (there may be multiple - dashboard and finances page)
    document.querySelectorAll(".finance-income .finance-value").forEach(el => {
        el.textContent = `R$ ${appData.finances.income.toLocaleString("pt-BR")}`
    })
    
    // Update all finance expense elements
    document.querySelectorAll(".finance-expense .finance-value").forEach(el => {
        el.textContent = `R$ ${appData.finances.expenses.toLocaleString("pt-BR")}`
    })
    
    // Update all finance balance elements
    document.querySelectorAll(".finance-balance .finance-value").forEach(el => {
        el.textContent = `R$ ${appData.finances.balance.toLocaleString("pt-BR")}`
    })
    
    // Also update by ID if they exist (for the finances page)
    const totalIncomeEl = document.getElementById("totalIncome")
    const totalExpensesEl = document.getElementById("totalExpenses")
    const totalBalanceEl = document.getElementById("totalBalance")
    
    if (totalIncomeEl) {
        totalIncomeEl.textContent = `R$ ${appData.finances.income.toLocaleString("pt-BR")}`
    }
    if (totalExpensesEl) {
        totalExpensesEl.textContent = `R$ ${appData.finances.expenses.toLocaleString("pt-BR")}`
    }
    if (totalBalanceEl) {
        totalBalanceEl.textContent = `R$ ${appData.finances.balance.toLocaleString("pt-BR")}`
    }
}

// ============================================
// DATA MANIPULATION FUNCTIONS
// ============================================

function toggleTaskStatus(taskId, action) {
    const task = appData.tasks.find((t) => t.id === taskId)
    if (task) {
        task.status = action === "complete" ? "completed" : "pending"
        saveData(appData)
        renderTasks()
        renderSummaryCards()
        animateProgressBars()
        const verb = action === 'complete' ? 'concluída' : 'marcada como pendente'
        showToast('Tarefa atualizada', `Tarefa ${verb}.`, 'success')
    }
}

async function deleteTask(taskId) {
    appData.tasks = appData.tasks.filter((t) => t.id !== taskId)
    saveData(appData)
    renderTasks()
    renderSummaryCards()
}

function addTask(taskName) {
    const newTask = {
        id: Date.now(),
        name: taskName,
        status: "pending",
        createdAt: new Date().toISOString(),
    }
    appData.tasks.unshift(newTask)
    saveData(appData)
    renderTasks()
    renderSummaryCards()
    showToast('Tarefa adicionada', 'A nova tarefa foi criada.', 'success')
}

function updateGoalProgress(goalId) {
    const goal = appData.goals.find((g) => g.id === goalId)
    if (goal) {
        // handled via showPrompt in renderGoals
    }
}

function deleteGoal(goalId) {
    appData.goals = appData.goals.filter((g) => g.id !== goalId)
    saveData(appData)
    renderGoals()
    renderSummaryCards()
}

function addGoal(title, description, target) {
    const newGoal = {
        id: Date.now(),
        title,
        description,
        progress: 0,
        target,
        current: 0,
    }
    appData.goals.push(newGoal)
    saveData(appData)
    renderGoals()
    renderSummaryCards()
    showToast('Meta adicionada', 'A nova meta foi criada.', 'success')
}

// ============================================
// ACTION BUTTONS
// ============================================

// "Adicionar" button functionality
document.querySelector(".btn-outline").addEventListener("click", async () => {
    const activeNav = document.querySelector(".nav-item.active")
    const section = activeNav ? activeNav.dataset.section : "dashboard"

    if (section === "tarefas" || section === "dashboard") {
        const taskName = await showPrompt({ title: 'Nova tarefa', message: 'Digite o nome da nova tarefa:' })
        if (taskName && taskName.trim()) {
            addTask(taskName.trim())
            const tasksTab = document.querySelector('[data-tab="tarefas"]')
            if (tasksTab) tasksTab.click()
        }
    } else if (section === "metas") {
        const title = await showPrompt({ title: 'Nova meta', message: 'Digite o título da meta:' })
        if (title && title.trim()) {
            const description = await showPrompt({ title: 'Descrição', message: 'Digite a descrição da meta:' })
            const target = await showPrompt({ title: 'Valor alvo', message: 'Digite o valor alvo (número):', placeholder: 'Ex: 100' })
            if (description && target) {
                addGoal(title.trim(), description.trim(), Number.parseFloat(target) || 100)
                const goalsTab = document.querySelector('[data-tab="progresso"]')
                if (goalsTab) goalsTab.click()
            }
        }
    } else {
        showToast('Ação indisponível', 'Adicionar está disponível apenas para Tarefas e Metas.', 'info')
    }
})

// "Hoje" button functionality
document.querySelector(".btn-primary").addEventListener("click", () => {
    const today = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    const pending = appData.tasks.filter((t) => t.status === "pending").length
    showToast('Hoje', `${today} — Tarefas pendentes: ${pending}`, 'info')
})

// ============================================
// ANIMATIONS
// ============================================

function animateProgressBars() {
    const progressFills = document.querySelectorAll(".progress-fill")

    progressFills.forEach((fill) => {
        const width = fill.style.width
        fill.style.width = "0%"

        setTimeout(() => {
            fill.style.width = width
        }, 100)
    })
}

function animateOnScroll() {
    const cards = document.querySelectorAll(".summary-card, .goal-card, .finance-card")

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "0"
                    entry.target.style.transform = "translateY(20px)"

                    setTimeout(() => {
                        entry.target.style.transition = "all 0.6s ease-out"
                        entry.target.style.opacity = "1"
                        entry.target.style.transform = "translateY(0)"
                    }, 100)

                    observer.unobserve(entry.target)
                }
            })
        },
        {
            threshold: 0.1,
        },
    )

    cards.forEach((card) => observer.observe(card))
}

// ============================================
// WINDOW EVENTS
// ============================================

let resizeTimer
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 1024 && sidebar.classList.contains("active")) {
            toggleMobileMenu()
        }
    }, 250)
})

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener("load", () => {
    // Recalculate finances on page load to ensure values are accurate
    recalculateFinances()
    
    renderSummaryCards()
    renderTasks()
    renderGoals()
    renderFinances()
    renderDashboardProducts()
    animateProgressBars()
    animateOnScroll()

    // Task filter
    const taskFilter = document.getElementById("taskFilter")
    if (taskFilter) {
        taskFilter.addEventListener("change", renderFullTasksList)
    }

    // Add task button
    const addTaskBtn = document.getElementById("addTaskBtn")
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", async () => {
            const taskName = await showPrompt({ title: 'Nova tarefa', message: 'Digite o nome da nova tarefa:' })
            if (taskName && taskName.trim()) {
                addTask(taskName.trim())
                renderFullTasksList()
            }
        })
    }

    // Add goal button
    const addGoalBtn = document.getElementById("addGoalBtn")
    if (addGoalBtn) {
        addGoalBtn.addEventListener("click", async () => {
            const title = await showPrompt({ title: 'Nova meta', message: 'Digite o título da meta:' })
            if (title && title.trim()) {
                const description = await showPrompt({ title: 'Descrição', message: 'Digite a descrição da meta:' })
                const target = await showPrompt({ title: 'Valor alvo', message: 'Digite o valor alvo (número):', placeholder: 'Ex: 100' })
                if (description && target) {
                    addGoal(title.trim(), description.trim(), Number.parseFloat(target) || 100)
                    renderFullGoalsList()
                }
            }
        })
    }

    // Add transaction button
    const addTransactionBtn = document.getElementById("addTransactionBtn")
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener("click", () => {
            showAddTransactionModal()
        })
    }

    // Transaction filter
    const transactionFilter = document.getElementById("transactionFilter")
    if (transactionFilter) {
        transactionFilter.addEventListener("change", () => {
            renderTransactions()
        })
    }

    // Generate report button
    const generateReportBtn = document.getElementById("generateReportBtn")
    if (generateReportBtn) {
        generateReportBtn.addEventListener("click", () => {
            generateFinancialReport()
        })
    }

    // Close report modal
    const closeReportBtn = document.getElementById("closeReportBtn")
    const reportModal = document.getElementById("reportModal")
    if (closeReportBtn) {
        closeReportBtn.addEventListener("click", () => {
            closeReportModal()
        })
    }
    
    // Close modal when clicking outside
    if (reportModal) {
        reportModal.addEventListener("click", (e) => {
            if (e.target === reportModal) {
                closeReportModal()
            }
        })
    }

    // Export report button
    const exportReportBtn = document.getElementById("exportReportBtn")
    if (exportReportBtn) {
        exportReportBtn.addEventListener("click", () => {
            exportReportToPDF()
        })
    }

    // Upgrade report button
    const upgradeReportBtn = document.getElementById("upgradeReportBtn")
    if (upgradeReportBtn) {
        upgradeReportBtn.addEventListener("click", () => {
            showUpgradeModal()
        })
    }

    // Save profile button
    const saveProfileBtn = document.getElementById("saveProfileBtn")
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", () => {
            const profileNameInput = document.getElementById("profileNameInput")
            const profileBio = document.getElementById("profileBio")
            
            // Initialize profile object if it doesn't exist
            if (!appData.profile) {
                appData.profile = {}
            }
            
            // Save profile data
            if (profileNameInput) {
                appData.profile.name = profileNameInput.value.trim()
            }
            if (profileBio) {
                appData.profile.bio = profileBio.value.trim()
            }
            
            // Save to localStorage
            saveData(appData)
            
            // Update profile display
            updateUserProfile()
            
            showToast('Perfil atualizado', 'Suas informações foram salvas com sucesso.', 'success')
        })
    }

    // Logout button
    const logoutBtn = document.getElementById("logoutBtn")
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            const confirmed = await showConfirm({
                title: 'Fazer Logout',
                message: 'Tem certeza que deseja sair? Você precisará fazer login novamente.',
                confirmText: 'Sair',
                cancelText: 'Cancelar',
                danger: false
            })
            if (confirmed) {
                // Clear authentication data
                localStorage.removeItem('isLoggedIn')
                localStorage.removeItem('usuario')
                localStorage.removeItem('loginTime')
                showToast('Logout realizado', 'Você foi desconectado com sucesso.', 'success')
                setTimeout(() => {
                    window.location.href = '../paginas/login.html'
                }, 1000)
            }
        })
    }

    // Clear data button
    const clearDataBtn = document.getElementById("clearDataBtn")
    if (clearDataBtn) {
        clearDataBtn.addEventListener("click", async () => {
            const confirmed = await showConfirm({
                title: 'Limpar dados',
                message: 'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.',
                confirmText: 'Limpar',
                danger: true
            })
            if (confirmed) {
                const userDataKey = `oceanDashboardData_${currentUser}`;
                localStorage.removeItem(userDataKey)
                showToast('Dados limpos', 'Seus dados locais foram removidos.', 'success')
                setTimeout(() => location.reload(), 600)
            }
        })
    }

    // Theme toggle functionality
    const darkModeToggle = document.getElementById("darkModeToggle")
    if (darkModeToggle) {
        // Carregar tema salvo ou usar padrão (dark)
        const savedTheme = localStorage.getItem('dashboardTheme') || 'dark'
        document.documentElement.setAttribute('data-theme', savedTheme)
        darkModeToggle.checked = savedTheme === 'dark'

        // Event listener para mudança de tema
        darkModeToggle.addEventListener("change", (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light'
            document.documentElement.setAttribute('data-theme', newTheme)
            localStorage.setItem('dashboardTheme', newTheme)
            showToast(
                newTheme === 'dark' ? 'Tema escuro ativado' : 'Tema claro ativado',
                'A aparência foi alterada com sucesso.',
                'success'
            )
        })
    }

    // Export data button
    const exportDataBtn = document.getElementById("exportDataBtn")
    if (exportDataBtn) {
        exportDataBtn.addEventListener("click", () => {
            const dataStr = JSON.stringify(appData, null, 2)
            const dataBlob = new Blob([dataStr], { type: "application/json" })
            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement("a")
            link.href = url
            link.download = "ocean-data.json"
            link.click()
            URL.revokeObjectURL(url)
            showToast('Exportado', 'Seus dados foram exportados como JSON.', 'success')
        })
    }

    // FAQ accordion
    const faqQuestions = document.querySelectorAll(".faq-question")
    faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
            const faqItem = question.parentElement
            const isActive = faqItem.classList.contains("active")

            document.querySelectorAll(".faq-item").forEach((item) => {
                item.classList.remove("active")
            })

            if (!isActive) {
                faqItem.classList.add("active")
            }
        })
    })

    // Products page event listeners
    const addProductBtn = document.getElementById("addProductBtn")
    if (addProductBtn) {
        addProductBtn.addEventListener("click", () => {
            showProductModal()
        })
    }

    const productCategoryFilter = document.getElementById("productCategoryFilter")
    if (productCategoryFilter) {
        productCategoryFilter.addEventListener("change", () => {
            renderProducts()
        })
    }

    const productStatusFilter = document.getElementById("productStatusFilter")
    if (productStatusFilter) {
        productStatusFilter.addEventListener("change", () => {
            renderProducts()
        })
    }

    const productSearchInput = document.getElementById("productSearchInput")
    if (productSearchInput) {
        productSearchInput.addEventListener("input", () => {
            renderProducts()
        })
    }
})

// ============================================
// FULL TASKS LIST RENDERING
// ============================================

function renderFullTasksList() {
    const tasksList = document.getElementById("fullTasksList")
    if (!tasksList) return

    tasksList.innerHTML = ""

    const filter = document.getElementById("taskFilter")?.value || "all"
    const filteredTasks = filter === "all" ? appData.tasks : appData.tasks.filter((t) => t.status === filter)

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
              <div class="empty-state">
                  <div class="empty-icon">📋</div>
                  <h3>Nenhuma tarefa encontrada</h3>
                  <p>Adicione uma nova tarefa para começar</p>
              </div>
          `
        return
    }

    filteredTasks.forEach((task) => {
        const taskItem = document.createElement("div")
        taskItem.className = "task-item"
        taskItem.innerHTML = `
          <div class="task-info">
            <div class="task-indicator ${task.status === "completed" ? "task-indicator-success" : ""}"></div>
            <span class="task-name">${task.name}</span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="task-badge ${task.status === "completed" ? "badge-completed" : "badge-pending"}">
              ${task.status === "completed" ? "Concluída" : "Pendente"}
            </span>
            <button class="task-action-btn" data-task-id="${task.id}" data-action="${task.status === "completed" ? "uncomplete" : "complete"}" 
                    style="background: none; border: none; cursor: pointer; padding: 0.5rem; color: var(--text-secondary); transition: var(--transition);"
                    onmouseover="this.style.color='var(--accent-primary)'" 
                    onmouseout="this.style.color='var(--text-secondary)'">
              ${task.status === "completed" ? "↶" : "✓"}
            </button>
            <button class="task-delete-btn" data-task-id="${task.id}"
                    style="background: none; border: none; cursor: pointer; padding: 0.5rem; color: var(--text-secondary); transition: var(--transition);"
                    onmouseover="this.style.color='var(--danger)'" 
                    onmouseout="this.style.color='var(--text-secondary)'">
              ✕
            </button>
          </div>
        `
        tasksList.appendChild(taskItem)
    })

    document.querySelectorAll("#fullTasksList .task-action-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation()
            const taskId = Number.parseInt(btn.dataset.taskId)
            const action = btn.dataset.action
            toggleTaskStatus(taskId, action)
            renderFullTasksList()
        })
    })

    document.querySelectorAll("#fullTasksList .task-delete-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation()
            const taskId = Number.parseInt(btn.dataset.taskId)
            const confirmed = await showConfirm({
                title: 'Excluir tarefa',
                message: 'Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.',
                confirmText: 'Excluir',
                danger: true
            })
            if (confirmed) {
                deleteTask(taskId)
                renderFullTasksList()
                showToast('Tarefa excluída', 'A tarefa foi removida com sucesso.', 'success')
            }
        })
    })
}

// ============================================
// FULL GOALS LIST RENDERING
// ============================================

function renderFullGoalsList() {
    const goalsGrid = document.getElementById("fullGoalsList")
    if (!goalsGrid) return

    goalsGrid.innerHTML = ""

    if (appData.goals.length === 0) {
        goalsGrid.innerHTML = `
              <div class="empty-state" style="grid-column: 1 / -1;">
                  <div class="empty-icon">🎯</div>
                  <h3>Nenhuma meta cadastrada</h3>
                  <p>Crie sua primeira meta para começar a acompanhar seu progresso</p>
              </div>
          `
        return
    }

    appData.goals.forEach((goal) => {
        const goalCard = document.createElement("div")
        goalCard.className = "goal-card"

        let progressClass = ""
        if (goal.progress >= 70) progressClass = ""
        else if (goal.progress >= 50) progressClass = "progress-success"
        else progressClass = "progress-warning"

        goalCard.innerHTML = `
          <div class="goal-header">
            <h4 class="goal-title">${goal.title}</h4>
            <span class="goal-percentage">${goal.progress}%</span>
          </div>
          <div class="progress-bar progress-bar-large">
            <div class="progress-fill ${progressClass}" style="width: ${goal.progress}%"></div>
          </div>
          <p class="goal-description">${goal.description}</p>
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <button class="goal-update-btn" data-goal-id="${goal.id}"
                    style="flex: 1; padding: 0.5rem; background: var(--accent-primary); color: white; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.875rem; transition: var(--transition);"
                    onmouseover="this.style.background='var(--accent-hover)'" 
                    onmouseout="this.style.background='var(--accent-primary)'">
              Atualizar Progresso
            </button>
            <button class="goal-delete-btn" data-goal-id="${goal.id}"
                    style="padding: 0.5rem 1rem; background: transparent; color: var(--danger); border: 1px solid var(--danger); border-radius: var(--radius-sm); cursor: pointer; font-size: 0.875rem; transition: var(--transition);"
                    onmouseover="this.style.background='var(--danger-light)'" 
                    onmouseout="this.style.background='transparent'">
              Excluir
            </button>
          </div>
        `
        goalsGrid.appendChild(goalCard)
    })

    document.querySelectorAll("#fullGoalsList .goal-update-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const goalId = Number.parseInt(btn.dataset.goalId)
            const goal = appData.goals.find((g) => g.id === goalId)
            const newProgress = await showPrompt({
                title: 'Atualizar progresso',
                message: `Meta: ${goal.title}<br/>Progresso atual: ${goal.progress}%`,
                placeholder: 'Novo progresso (0-100)',
                defaultValue: String(goal.progress)
            })
            if (newProgress !== null) {
                const progress = Math.min(100, Math.max(0, Number.parseInt(newProgress) || 0))
                goal.progress = progress
                goal.current = (progress / 100) * goal.target
                saveData(appData)
                renderFullGoalsList()
                renderSummaryCards()
                animateProgressBars()
                showToast('Progresso atualizado', 'A meta foi atualizada com sucesso.', 'success')
            }
        })
    })

    document.querySelectorAll("#fullGoalsList .goal-delete-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const goalId = Number.parseInt(btn.dataset.goalId)
            const confirmed = await showConfirm({
                title: 'Excluir meta',
                message: 'Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.',
                confirmText: 'Excluir',
                danger: true
            })
            if (confirmed) {
                deleteGoal(goalId)
                renderFullGoalsList()
                showToast('Meta excluída', 'A meta foi removida com sucesso.', 'success')
            }
        })
    })
}

// ============================================
// FINANCES PAGE RENDERING
// ============================================

function renderFinancesPage() {
    // Recalculate finances from transactions
    recalculateFinances()
    renderFinances()
    renderTransactions()
}

// Recalculate finances from transactions
function recalculateFinances() {
    // Initialize transactions array if it doesn't exist
    if (!appData.transactions) {
        appData.transactions = []
    }
    
    // Initialize finances object if it doesn't exist
    if (!appData.finances) {
        appData.finances = {
            income: 0,
            expenses: 0,
            balance: 0
        }
    }
    
    let totalIncome = 0
    let totalExpenses = 0
    
    // Calculate totals from all transactions
    if (appData.transactions && appData.transactions.length > 0) {
        appData.transactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount) || 0
            if (transaction.type === 'income') {
                totalIncome += amount
            } else if (transaction.type === 'expense') {
                totalExpenses += amount
            }
        })
    }
    
    // Always update finances object (even if totals are 0 - this ensures values are always accurate)
    appData.finances.income = totalIncome
    appData.finances.expenses = totalExpenses
    appData.finances.balance = totalIncome - totalExpenses
    
    // Save updated data
    saveData(appData)
}

// Render transactions list
function renderTransactions() {
    const transactionsList = document.getElementById("transactionsList")
    if (!transactionsList) return

    const filter = document.getElementById("transactionFilter")?.value || "all"
    let transactions = appData.transactions || []
    
    // Filter transactions
    if (filter !== "all") {
        transactions = transactions.filter(t => t.type === filter)
    }
    
    // Sort by date (newest first)
    transactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date))

    if (transactions.length === 0) {
        transactionsList.innerHTML = `
          <div class="empty-state">
              <div class="empty-icon">💰</div>
              <h3>Nenhuma transação registrada</h3>
              <p>Adicione transações para acompanhar suas finanças</p>
          </div>
      `
        return
    }

    transactionsList.innerHTML = ""
    
    transactions.forEach(transaction => {
        const transactionItem = document.createElement("div")
        transactionItem.className = "transaction-item"
        transactionItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            margin-bottom: 0.75rem;
            transition: var(--transition);
        `
        transactionItem.onmouseenter = function() {
            this.style.background = "var(--bg-hover)"
            this.style.transform = "translateX(4px)"
        }
        transactionItem.onmouseleave = function() {
            this.style.background = "var(--bg-card)"
            this.style.transform = "translateX(0)"
        }

        const isIncome = transaction.type === 'income'
        const amountColor = isIncome ? 'var(--success)' : 'var(--danger)'
        const amountPrefix = isIncome ? '+' : '-'
        const date = new Date(transaction.date).toLocaleDateString('pt-BR')

        transactionItem.innerHTML = `
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
                    <div style="
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: ${amountColor};
                    "></div>
                    <strong style="color: var(--text-primary);">${transaction.description}</strong>
                    ${transaction.category ? `<span style="
                        background: var(--bg-secondary);
                        color: var(--text-secondary);
                        padding: 0.25rem 0.5rem;
                        border-radius: 12px;
                        font-size: 0.75rem;
                    ">${transaction.category}</span>` : ''}
                </div>
                <div style="color: var(--text-secondary); font-size: 0.875rem; margin-left: 1.5rem;">
                    ${date}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="
                    color: ${amountColor};
                    font-weight: 700;
                    font-size: 1.125rem;
                ">${amountPrefix} R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <button class="transaction-delete-btn" data-transaction-id="${transaction.id}"
                    style="
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 0.5rem;
                        color: var(--text-secondary);
                        transition: var(--transition);
                        border-radius: var(--radius-sm);
                    "
                    onmouseover="this.style.color='var(--danger)'; this.style.background='var(--danger-light)'"
                    onmouseout="this.style.color='var(--text-secondary)'; this.style.background='transparent'"
                    title="Excluir transação">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `
        transactionsList.appendChild(transactionItem)
    })

    // Add delete event listeners
    document.querySelectorAll(".transaction-delete-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation()
            const transactionId = Number.parseInt(btn.dataset.transactionId)
            const confirmed = await showConfirm({
                title: 'Excluir transação',
                message: 'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.',
                confirmText: 'Excluir',
                danger: true
            })
            if (confirmed) {
                deleteTransaction(transactionId)
                showToast('Transação excluída', 'A transação foi removida com sucesso.', 'success')
            }
        })
    })
}

// Show add transaction modal
function showAddTransactionModal() {
    // Create custom modal for transaction form
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    
    const modal = document.createElement('div')
    modal.className = 'modal'
    
    modal.innerHTML = `
        <div class="modal-header">
            Nova Transação
        </div>
        <div class="modal-body">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Tipo *</label>
                <select id="transactionType" style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                </select>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Descrição *</label>
                <input type="text" id="transactionDescription" placeholder="Ex: Salário, Aluguel, Supermercado..." style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Valor (R$) *</label>
                <input type="number" id="transactionAmount" placeholder="0.00" step="0.01" min="0" style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Categoria</label>
                <input type="text" id="transactionCategory" placeholder="Ex: Trabalho, Moradia, Alimentação..." style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
            </div>
            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Data</label>
                <input type="date" id="transactionDate" style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn btn-outline" id="cancelTransactionBtn">Cancelar</button>
            <button class="btn btn-primary" id="saveTransactionBtn">Salvar</button>
        </div>
    `
    
    overlay.appendChild(modal)
    document.body.appendChild(overlay)
    
    // Set default date to today
    const dateInput = document.getElementById('transactionDate')
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0]
        dateInput.value = today
    }
    
    // Focus on description input
    setTimeout(() => {
        document.getElementById('transactionDescription')?.focus()
    }, 100)
    
    // Event listeners
    document.getElementById('cancelTransactionBtn').addEventListener('click', () => {
        document.body.removeChild(overlay)
    })
    
    const saveBtn = document.getElementById('saveTransactionBtn')
    saveBtn.addEventListener('click', () => {
        const type = document.getElementById('transactionType').value
        const description = document.getElementById('transactionDescription').value.trim()
        const amountInput = document.getElementById('transactionAmount').value
        const amount = parseFloat(amountInput)
        const category = document.getElementById('transactionCategory').value.trim()
        const date = document.getElementById('transactionDate').value || new Date().toISOString().split('T')[0]
        
        // Validation
        if (!description) {
            showToast('Campo obrigatório', 'A descrição é obrigatória.', 'error')
            document.getElementById('transactionDescription').focus()
            return
        }
        
        if (!amountInput || isNaN(amount) || amount <= 0) {
            showToast('Valor inválido', 'O valor deve ser maior que zero.', 'error')
            document.getElementById('transactionAmount').focus()
            return
        }
        
        // Add transaction
        addTransaction({
            type,
            description,
            amount,
            category: category || null,
            date: new Date(date).toISOString()
        })
        
        // Close modal
        document.body.removeChild(overlay)
        showToast('Transação adicionada', 'A transação foi registrada com sucesso.', 'success')
    })
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay)
        }
    })
    
    // Enter key to save (only when in input fields)
    const handleKeyDown = function(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay)
            }
            document.removeEventListener('keydown', handleKeyDown)
        }
    }
    document.addEventListener('keydown', handleKeyDown)
    
    // Prevent form submission on Enter in inputs
    modal.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                e.preventDefault()
                saveBtn.click()
            }
        })
    })
}

// Add transaction
function addTransaction(transaction) {
    if (!appData.transactions) {
        appData.transactions = []
    }
    
    const newId = appData.transactions.length > 0 
        ? Math.max(...appData.transactions.map(t => t.id)) + 1 
        : 1
    
    const newTransaction = {
        id: newId,
        ...transaction
    }
    
    appData.transactions.push(newTransaction)
    
    saveData(appData)
    recalculateFinances()
    renderFinances()
    renderTransactions()
}

// Delete transaction
function deleteTransaction(transactionId) {
    const transaction = appData.transactions.find(t => t.id === transactionId)
    if (!transaction) return
    
    // Remove transaction
    appData.transactions = appData.transactions.filter(t => t.id !== transactionId)
    
    saveData(appData)
    recalculateFinances()
    renderFinances()
    renderTransactions()
}

// Smooth scroll
document.documentElement.style.scrollBehavior = "smooth"

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + K to add task
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        document.querySelector(".btn-outline").click()
    }

    // Escape to close mobile menu
    if (e.key === "Escape" && sidebar.classList.contains("active")) {
        toggleMobileMenu()
    }
    
    // Escape to close report modal
    if (e.key === "Escape") {
        const reportModal = document.getElementById("reportModal")
        if (reportModal && reportModal.style.display === "flex") {
            closeReportModal()
        }
    }
})

// ============================================
// FINANCIAL REPORT GENERATION
// ============================================

// Check if user has premium plan
function isPremiumUser() {
    return localStorage.getItem('isPremium') === 'true'
}

// Generate financial report
function generateFinancialReport() {
    const reportModal = document.getElementById('reportModal')
    const reportBody = document.getElementById('reportBody')
    const reportTitle = document.getElementById('reportTitle')
    const upgradeBtn = document.getElementById('upgradeReportBtn')
    
    if (!reportModal || !reportBody) return
    
    const isPremium = isPremiumUser()
    const finances = appData.finances
    
    // Calculate additional metrics
    const savingsRate = finances.income > 0 ? ((finances.balance / finances.income) * 100).toFixed(1) : 0
    const expenseRate = finances.income > 0 ? ((finances.expenses / finances.income) * 100).toFixed(1) : 0
    
    // Build report HTML
    let reportHTML = `
        <div class="report-section">
            <div class="report-summary">
                <div class="report-summary-card">
                    <div class="label">Receitas Totais</div>
                    <div class="value" style="color: var(--success);">R$ ${finances.income.toLocaleString('pt-BR')}</div>
                </div>
                <div class="report-summary-card">
                    <div class="label">Despesas Totais</div>
                    <div class="value" style="color: var(--danger);">R$ ${finances.expenses.toLocaleString('pt-BR')}</div>
                </div>
                <div class="report-summary-card">
                    <div class="label">Saldo</div>
                    <div class="value" style="color: var(--accent-primary);">R$ ${finances.balance.toLocaleString('pt-BR')}</div>
                </div>
                <div class="report-summary-card">
                    <div class="label">Taxa de Poupança</div>
                    <div class="value">${savingsRate}%</div>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h3>Gráfico de Receitas vs Despesas</h3>
            <div class="report-chart-container">
                <canvas id="incomeExpenseChart"></canvas>
            </div>
        </div>
        
        <div class="report-section">
            <h3>Distribuição Financeira</h3>
            <div class="report-chart-container">
                <canvas id="distributionChart"></canvas>
            </div>
        </div>
    `
    
    // Add premium features if user is premium
    if (isPremium) {
        reportHTML += `
            <div class="report-section">
                <h3>Análise de Tendências <span class="report-premium-badge">PREMIUM</span></h3>
                <div class="report-chart-container">
                    <canvas id="trendsChart"></canvas>
                </div>
            </div>
            
            <div class="report-section">
                <h3>Projeções Futuras <span class="report-premium-badge">PREMIUM</span></h3>
                <div class="report-chart-container">
                    <canvas id="projectionsChart"></canvas>
                </div>
            </div>
            
            <div class="report-section">
                <h3>Recomendações Personalizadas <span class="report-premium-badge">PREMIUM</span></h3>
                <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--radius-md);">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
                            <strong>💡 Economia:</strong> Com base nos seus dados, você pode economizar até R$ ${(finances.expenses * 0.15).toFixed(2)} reduzindo despesas em 15%.
                        </li>
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
                            <strong>📈 Investimento:</strong> Considere investir 20% do seu saldo (R$ ${(finances.balance * 0.2).toFixed(2)}) para crescimento a longo prazo.
                        </li>
                        <li style="padding: 0.75rem 0;">
                            <strong>🎯 Meta:</strong> Mantenha uma taxa de poupança acima de 30% para alcançar suas metas financeiras.
                        </li>
                    </ul>
                </div>
            </div>
        `
        upgradeBtn.style.display = 'none'
    } else {
        reportHTML += `
            <div class="report-upgrade-banner">
                <h4>🚀 Desbloqueie Relatórios Premium!</h4>
                <p>Obtenha análises avançadas, projeções futuras e recomendações personalizadas</p>
                <button class="btn" style="background: white; color: var(--accent-primary); border: none;" onclick="showUpgradeModal()">
                    Fazer Upgrade Agora
                </button>
            </div>
        `
        upgradeBtn.style.display = 'block'
    }
    
    reportBody.innerHTML = reportHTML
    reportTitle.textContent = `Relatório Financeiro - ${new Date().toLocaleDateString('pt-BR')}`
    reportModal.style.display = 'flex'
    
    // Atualizar texto do botão de exportação baseado no nível
    const exportReportBtn = document.getElementById('exportReportBtn')
    if (exportReportBtn) {
        if (isPremium) {
            exportReportBtn.textContent = 'Exportar PDF Completo'
            exportReportBtn.classList.remove('btn-outline')
            exportReportBtn.classList.add('btn-primary')
        } else {
            exportReportBtn.textContent = 'Exportar PDF Básico'
            exportReportBtn.classList.remove('btn-primary')
            exportReportBtn.classList.add('btn-outline')
        }
    }
    
    // Initialize charts
    setTimeout(() => {
        initializeReportCharts(isPremium)
    }, 100)
}

// Initialize report charts
function initializeReportCharts(isPremium) {
    const finances = appData.finances
    
    // Income vs Expense Chart
    const incomeExpenseCtx = document.getElementById('incomeExpenseChart')
    if (incomeExpenseCtx && typeof Chart !== 'undefined') {
        new Chart(incomeExpenseCtx, {
            type: 'bar',
            data: {
                labels: ['Receitas', 'Despesas'],
                datasets: [{
                    label: 'Valores (R$)',
                    data: [finances.income, finances.expenses],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR')
                            }
                        }
                    }
                }
            }
        })
    }
    
    // Distribution Chart (Pie)
    const distributionCtx = document.getElementById('distributionChart')
    if (distributionCtx && typeof Chart !== 'undefined') {
        new Chart(distributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Receitas', 'Despesas', 'Saldo'],
                datasets: [{
                    data: [finances.income, finances.expenses, finances.balance],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(74, 144, 226, 0.8)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(74, 144, 226, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': R$ ' + context.parsed.toLocaleString('pt-BR')
                            }
                        }
                    }
                }
            }
        })
    }
    
    // Premium charts
    if (isPremium) {
        // Trends Chart (Line)
        const trendsCtx = document.getElementById('trendsChart')
        if (trendsCtx && typeof Chart !== 'undefined') {
            // Simulated monthly data
            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
            const incomeData = months.map(() => finances.income + (Math.random() * 500 - 250))
            const expenseData = months.map(() => finances.expenses + (Math.random() * 300 - 150))
            
            new Chart(trendsCtx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Receitas',
                        data: incomeData,
                        borderColor: 'rgba(16, 185, 129, 1)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Despesas',
                        data: expenseData,
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR')
                                }
                            }
                        }
                    }
                }
            })
        }
        
        // Projections Chart
        const projectionsCtx = document.getElementById('projectionsChart')
        if (projectionsCtx && typeof Chart !== 'undefined') {
            const futureMonths = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
            const projectedIncome = futureMonths.map(() => finances.income * 1.05)
            const projectedExpenses = futureMonths.map(() => finances.expenses * 0.95)
            
            new Chart(projectionsCtx, {
                type: 'bar',
                data: {
                    labels: futureMonths,
                    datasets: [{
                        label: 'Receitas Projetadas',
                        data: projectedIncome,
                        backgroundColor: 'rgba(16, 185, 129, 0.6)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 2
                    }, {
                        label: 'Despesas Projetadas',
                        data: projectedExpenses,
                        backgroundColor: 'rgba(239, 68, 68, 0.6)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR')
                                }
                            }
                        }
                    }
                }
            })
        }
    }
}

// Close report modal
function closeReportModal() {
    const reportModal = document.getElementById('reportModal')
    if (reportModal) {
        reportModal.style.display = 'none'
        // Destroy charts to free memory
        Chart.getChart('incomeExpenseChart')?.destroy()
        Chart.getChart('distributionChart')?.destroy()
        Chart.getChart('trendsChart')?.destroy()
        Chart.getChart('projectionsChart')?.destroy()
    }
}

// Export report to PDF
async function exportReportToPDF() {
    const reportModal = document.getElementById('reportModal')
    const reportHeader = document.querySelector('#reportModal .report-modal-header')
    const reportBody = document.getElementById('reportBody')
    const exportBtn = document.getElementById('exportReportBtn')

    if (!reportModal || !reportBody || reportModal.style.display === 'none') {
        showToast('Erro', 'Abra o relatório antes de exportar.', 'error')
        return
    }

    if (!window.html2canvas || !window.jspdf?.jsPDF) {
        showToast('Erro', 'Bibliotecas de exportação não foram carregadas.', 'error')
        return
    }

    // Verificar se é usuário premium
    const isPremium = isPremiumUser()
    
    // Se não for premium, mostrar opção de upgrade
    if (!isPremium) {
        const upgrade = await showConfirm({
            title: '🔒 Exportação Premium',
            message: `
                <div style="text-align: left; padding: 1rem 0;">
                    <p>Você está usando o plano <strong>Básico</strong>.</p>
                    <p><strong>Exportação Básica inclui:</strong></p>
                    <ul style="list-style: none; padding: 0; margin: 1rem 0;">
                        <li style="padding: 0.5rem 0;">✅ Resumo financeiro</li>
                        <li style="padding: 0.5rem 0;">✅ Gráfico de Receitas vs Despesas</li>
                        <li style="padding: 0.5rem 0;">✅ Gráfico de Distribuição</li>
                    </ul>
                    <p><strong>Com Premium você teria:</strong></p>
                    <ul style="list-style: none; padding: 0; margin: 1rem 0;">
                        <li style="padding: 0.5rem 0;">✨ Análise de Tendências</li>
                        <li style="padding: 0.5rem 0;">✨ Projeções Futuras</li>
                        <li style="padding: 0.5rem 0;">✨ Recomendações Personalizadas</li>
                        <li style="padding: 0.5rem 0;">✨ Exportação em alta qualidade</li>
                    </ul>
                </div>
            `,
            confirmText: 'Continuar Exportação Básica',
            cancelText: 'Fazer Upgrade Agora'
        })

        if (upgrade === false) {
            // Usuário escolheu fazer upgrade
            showUpgradeModal()
            return
        }
    }

    const originalText = exportBtn?.textContent
    if (exportBtn) {
        exportBtn.disabled = true
        exportBtn.textContent = 'Exportando...'
    }

    const exportType = isPremium ? 'completo' : 'básico'
    showToast('Exportando...', `Gerando PDF ${exportType} com os gráficos do relatório. Aguarde...`, 'info')

    try {
        // Aguardar os gráficos renderizarem completamente (apenas os disponíveis)
        await waitForChartsToRender(isPremium)

        // Criar um container temporário para exportação (sem footer e botões)
        const exportContainer = document.createElement('div')
        exportContainer.style.position = 'absolute'
        exportContainer.style.left = '-9999px'
        exportContainer.style.width = '900px'
        exportContainer.style.backgroundColor = '#ffffff'
        exportContainer.style.padding = '2rem'
        exportContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif'
        exportContainer.style.color = '#1e293b'
        exportContainer.style.lineHeight = '1.6'
        
        // Clonar o header
        if (reportHeader) {
            const headerClone = reportHeader.cloneNode(true)
            // Remover o botão de fechar
            const closeBtn = headerClone.querySelector('.report-close-btn')
            if (closeBtn) closeBtn.remove()
            
            // Aplicar estilos ao header
            headerClone.style.borderBottom = '2px solid #e2e8f0'
            headerClone.style.paddingBottom = '1rem'
            headerClone.style.marginBottom = '1.5rem'
            const headerTitle = headerClone.querySelector('h2')
            if (headerTitle) {
                headerTitle.style.color = '#1e293b'
                headerTitle.style.margin = '0'
                headerTitle.style.fontSize = '1.75rem'
                headerTitle.style.fontWeight = '700'
            }
            
            exportContainer.appendChild(headerClone)
        }

        // Clonar o body com todo o conteúdo
        const bodyClone = reportBody.cloneNode(true)
        
        // Filtrar conteúdo baseado no nível do usuário
        if (!isPremium) {
            // Remover todas as seções premium
            const allSections = bodyClone.querySelectorAll('.report-section')
            allSections.forEach(section => {
                const title = section.querySelector('h3')
                if (title) {
                    const titleText = title.textContent
                    // Remover seções premium
                    if (titleText.includes('Tendências') || 
                        titleText.includes('Projeções') || 
                        titleText.includes('Recomendações')) {
                        section.remove()
                    }
                }
            })
            
            // Remover gráficos premium diretamente (caso ainda existam)
            const trendsChart = bodyClone.querySelector('#trendsChart')
            if (trendsChart) {
                const trendsSection = trendsChart.closest('.report-section')
                if (trendsSection) trendsSection.remove()
            }
            
            const projectionsChart = bodyClone.querySelector('#projectionsChart')
            if (projectionsChart) {
                const projectionsSection = projectionsChart.closest('.report-section')
                if (projectionsSection) projectionsSection.remove()
            }
            
            // Remover banner de upgrade se existir
            const upgradeBanner = bodyClone.querySelector('.report-upgrade-banner')
            if (upgradeBanner) {
                const bannerSection = upgradeBanner.closest('.report-section')
                if (bannerSection) {
                    bannerSection.remove()
                } else {
                    upgradeBanner.remove()
                }
            }
            
            // Adicionar banner informativo sobre upgrade no PDF
            const upgradeInfo = document.createElement('div')
            upgradeInfo.className = 'report-section'
            upgradeInfo.style.cssText = `
                background: linear-gradient(135deg, #4a90e2, #357abd);
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                color: white;
                text-align: center;
            `
            upgradeInfo.innerHTML = `
                <h3 style="color: white; margin: 0 0 0.5rem 0; font-size: 1.25rem;">🚀 Desbloqueie Exportação Premium!</h3>
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 1rem 0; font-size: 0.9rem;">
                    Faça upgrade para ter acesso a análises avançadas, projeções futuras e recomendações personalizadas no seu PDF.
                </p>
                <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 0.85rem; font-weight: 600;">
                    Visite o dashboard para fazer upgrade agora!
                </p>
            `
            bodyClone.insertBefore(upgradeInfo, bodyClone.firstChild)
        }
        
        // Aplicar estilos aos elementos do body
        const sections = bodyClone.querySelectorAll('.report-section')
        sections.forEach(section => {
            section.style.marginBottom = '2.5rem'
            section.style.pageBreakInside = 'avoid'
            
            const sectionTitle = section.querySelector('h3')
            if (sectionTitle) {
                sectionTitle.style.color = '#1e293b'
                sectionTitle.style.fontSize = '1.5rem'
                sectionTitle.style.fontWeight = '600'
                sectionTitle.style.marginBottom = '1.5rem'
                sectionTitle.style.marginTop = '0'
            }
        })
        
        // Estilizar cards de resumo
        const summaryCards = bodyClone.querySelectorAll('.report-summary-card')
        summaryCards.forEach(card => {
            card.style.backgroundColor = '#f8fafc'
            card.style.border = '1px solid #e2e8f0'
            card.style.borderRadius = '8px'
            card.style.padding = '1.5rem'
            card.style.textAlign = 'center'
            
            const label = card.querySelector('.label')
            if (label) {
                label.style.color = '#64748b'
                label.style.fontSize = '0.875rem'
                label.style.marginBottom = '0.5rem'
            }
            
            const value = card.querySelector('.value')
            if (value) {
                value.style.color = value.style.color || '#1e293b'
                value.style.fontSize = '1.75rem'
                value.style.fontWeight = '700'
            }
        })
        
        // Estilizar containers de gráficos
        const chartContainers = bodyClone.querySelectorAll('.report-chart-container')
        chartContainers.forEach(container => {
            container.style.backgroundColor = '#ffffff'
            container.style.border = '1px solid #e2e8f0'
            container.style.borderRadius = '8px'
            container.style.padding = '1rem'
            container.style.marginBottom = '1.5rem'
            container.style.pageBreakInside = 'avoid'
            
            const canvas = container.querySelector('canvas')
            if (canvas) {
                const chartId = canvas.id
                const originalCanvas = document.getElementById(chartId)
                if (originalCanvas) {
                    const chart = Chart.getChart(originalCanvas)
                    if (chart) {
                        // Criar uma imagem do gráfico com alta qualidade
                        const img = document.createElement('img')
                        img.src = chart.toBase64Image('image/png', 1.0)
                        img.style.width = '100%'
                        img.style.height = 'auto'
                        img.style.display = 'block'
                        img.style.maxWidth = '100%'
                        
                        // Substituir o canvas pela imagem
                        canvas.parentNode.replaceChild(img, canvas)
                    }
                }
            }
        })
        
        // Estilizar lista de recomendações
        const recommendations = bodyClone.querySelectorAll('.report-section ul')
        recommendations.forEach(ul => {
            ul.style.listStyle = 'none'
            ul.style.padding = '0'
            ul.style.margin = '0'
            
            const lis = ul.querySelectorAll('li')
            lis.forEach(li => {
                li.style.padding = '0.75rem 0'
                li.style.borderBottom = '1px solid #e2e8f0'
                li.style.color = '#1e293b'
            })
        })
        
        exportContainer.appendChild(bodyClone)

        // Adicionar ao DOM temporariamente
        document.body.appendChild(exportContainer)

        // Aguardar imagens dos gráficos carregarem
        const images = exportContainer.querySelectorAll('img')
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve()
                } else {
                    img.onload = resolve
                    img.onerror = resolve // Continuar mesmo se houver erro
                    setTimeout(resolve, 1000) // Timeout de segurança
                }
            })
        })
        await Promise.all(imagePromises)

        // Aguardar frames para garantir renderização completa
        await new Promise(resolve => requestAnimationFrame(resolve))
        await new Promise(resolve => requestAnimationFrame(resolve))
        await new Promise(resolve => setTimeout(resolve, 300))

        // Capturar com alta qualidade
        const canvas = await window.html2canvas(exportContainer, {
            backgroundColor: '#ffffff',
            scale: 2, // Alta qualidade
            useCORS: true,
            logging: false,
            allowTaint: true,
            width: exportContainer.offsetWidth,
            height: exportContainer.scrollHeight,
            windowWidth: exportContainer.scrollWidth,
            windowHeight: exportContainer.scrollHeight
        })

        // Remover container temporário
        document.body.removeChild(exportContainer)

        // Criar PDF
        const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4')
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 10 // Margem de 10mm
        const contentWidth = pageWidth - (margin * 2)
        const contentHeight = pageHeight - (margin * 2)

        // Calcular dimensões da imagem
        const imgWidth = contentWidth
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Converter canvas para imagem
        const imgData = canvas.toDataURL('image/png', 1.0)

        // Adicionar imagens em páginas múltiplas se necessário
        let heightLeft = imgHeight
        let position = 0

        // Primeira página
        pdf.addImage(
            imgData,
            'PNG',
            margin,
            margin,
            imgWidth,
            imgHeight,
            undefined,
            'FAST'
        )
        heightLeft -= contentHeight

        // Páginas adicionais se necessário
        while (heightLeft > 0) {
            position = margin - (imgHeight - heightLeft)
            pdf.addPage()
            pdf.addImage(
                imgData,
                'PNG',
                margin,
                position,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            )
            heightLeft -= contentHeight
        }

        // Adicionar data de geração no rodapé
        const totalPages = pdf.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i)
            pdf.setFontSize(8)
            pdf.setTextColor(128, 128, 128)
            pdf.text(
                `Gerado em ${new Date().toLocaleString('pt-BR')} - Página ${i} de ${totalPages}`,
                pageWidth / 2,
                pageHeight - 5,
                { align: 'center' }
            )
        }

        // Salvar arquivo
        const fileName = `relatorio-ocean-${new Date().toISOString().slice(0, 10)}.pdf`
        pdf.save(fileName)

        showToast('Sucesso!', 'Seu relatório com os gráficos foi exportado em PDF.', 'success')
    } catch (error) {
        console.error('Erro ao exportar PDF:', error)
        showToast('Erro', 'Não foi possível exportar o relatório. Tente novamente.', 'error')
    } finally {
        if (exportBtn) {
            exportBtn.disabled = false
            exportBtn.textContent = originalText || 'Exportar PDF'
        }
    }
}

// Aguardar gráficos renderizarem
async function waitForChartsToRender(isPremium = true) {
    // Gráficos básicos sempre disponíveis
    const basicCharts = ['incomeExpenseChart', 'distributionChart']
    
    // Gráficos premium apenas se for usuário premium
    const premiumCharts = isPremium ? ['trendsChart', 'projectionsChart'] : []
    
    const chartIds = [...basicCharts, ...premiumCharts]
    const promises = chartIds.map(id => {
        return new Promise((resolve) => {
            const canvas = document.getElementById(id)
            if (!canvas) {
                resolve()
                return
            }

            const chart = Chart.getChart(canvas)
            if (!chart) {
                resolve()
                return
            }

            // Aguardar o chart renderizar
            chart.update('none')
            
            // Aguardar alguns frames para garantir renderização completa
            let frames = 0
            const checkRender = () => {
                frames++
                if (frames >= 3) {
                    resolve()
                } else {
                    requestAnimationFrame(checkRender)
                }
            }
            requestAnimationFrame(checkRender)
        })
    })

    await Promise.all(promises)
    // Aguardar um pouco mais para garantir que tudo está renderizado
    await new Promise(resolve => setTimeout(resolve, 300))
}

// Show upgrade modal
function showUpgradeModal() {
    showConfirm({
        title: '🚀 Upgrade para Premium',
        message: `
            <div style="text-align: left; padding: 1rem 0;">
                <p><strong>Benefícios do Premium:</strong></p>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 0.5rem 0;">✅ Relatórios avançados com análises detalhadas</li>
                    <li style="padding: 0.5rem 0;">✅ Projeções futuras e tendências</li>
                    <li style="padding: 0.5rem 0;">✅ Recomendações personalizadas de investimento</li>
                    <li style="padding: 0.5rem 0;">✅ Exportação em múltiplos formatos</li>
                    <li style="padding: 0.5rem 0;">✅ Suporte prioritário</li>
                </ul>
                <p style="margin-top: 1rem;"><strong>Preço: R$ 29,90/mês</strong></p>
            </div>
        `,
        confirmText: 'Fazer Upgrade',
        cancelText: 'Agora Não'
    }).then(confirmed => {
        if (confirmed) {
            // Simulate premium upgrade
            localStorage.setItem('isPremium', 'true')
            showToast('Upgrade realizado!', 'Agora você tem acesso a todos os recursos Premium.', 'success')
            setTimeout(() => {
                generateFinancialReport()
            }, 1000)
        }
    })
}

// Make functions globally available
window.showUpgradeModal = showUpgradeModal

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

// Initialize products array if it doesn't exist
if (!appData.products) {
    appData.products = []
    saveData(appData)
}

// Render products page
function renderProductsPage() {
    renderProducts()
}

// Render products in dashboard
function renderDashboardProducts() {
    const productsGrid = document.getElementById("dashboardProductsGrid")
    if (!productsGrid) return

    // Get first 6 products (most recent)
    const products = (appData.products || []).slice(0, 6)

    // Clear grid
    productsGrid.innerHTML = ""

    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">📦</div>
                <h3>Nenhum produto cadastrado</h3>
                <p>Adicione produtos para começar a gerenciar seu catálogo</p>
            </div>
        `
        return
    }

    // Render products
    products.forEach(product => {
        const productCard = document.createElement("div")
        productCard.className = "product-card-dashboard"
        
        const statusClass = product.status === "ativo" ? "status-active" : 
                          product.status === "esgotado" ? "status-out-of-stock" : "status-inactive"
        const statusText = product.status === "ativo" ? "Ativo" : 
                          product.status === "esgotado" ? "Esgotado" : "Inativo"
        
        productCard.innerHTML = `
            <div class="product-header">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-status ${statusClass}">${statusText}</span>
            </div>
            <p class="product-description">${product.description}</p>
            <div class="product-details">
                <div class="product-detail-item">
                    <span class="detail-label">Categoria:</span>
                    <span class="detail-value">${product.category}</span>
                </div>
                <div class="product-detail-item">
                    <span class="detail-label">Preço:</span>
                    <span class="detail-value price">R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="product-detail-item">
                    <span class="detail-label">Estoque:</span>
                    <span class="detail-value ${product.stock <= 5 ? 'low-stock' : ''}">${product.stock} unidades</span>
                </div>
            </div>
        `
        
        productsGrid.appendChild(productCard)
    })
}

// Render products grid
function renderProducts() {
    const productsGrid = document.getElementById("productsGrid")
    if (!productsGrid) return

    // Get filters
    const categoryFilter = document.getElementById("productCategoryFilter")?.value || "all"
    const statusFilter = document.getElementById("productStatusFilter")?.value || "all"
    const searchInput = document.getElementById("productSearchInput")?.value.toLowerCase() || ""

    // Filter products
    let filteredProducts = appData.products || []
    
    if (categoryFilter !== "all") {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter)
    }
    
    if (statusFilter !== "all") {
        filteredProducts = filteredProducts.filter(p => p.status === statusFilter)
    }
    
    if (searchInput) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchInput) || 
            p.description.toLowerCase().includes(searchInput)
        )
    }

    // Clear grid
    productsGrid.innerHTML = ""

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">📦</div>
                <h3>Nenhum produto encontrado</h3>
                <p>Adicione produtos para começar a gerenciar seu catálogo</p>
            </div>
        `
        return
    }

    // Render products
    filteredProducts.forEach(product => {
        const productCard = document.createElement("div")
        productCard.className = "product-card"
        
        const statusClass = product.status === "ativo" ? "status-active" : 
                          product.status === "esgotado" ? "status-out-of-stock" : "status-inactive"
        const statusText = product.status === "ativo" ? "Ativo" : 
                          product.status === "esgotado" ? "Esgotado" : "Inativo"
        
        productCard.innerHTML = `
            <div class="product-header">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-status ${statusClass}">${statusText}</span>
            </div>
            <p class="product-description">${product.description}</p>
            <div class="product-details">
                <div class="product-detail-item">
                    <span class="detail-label">Categoria:</span>
                    <span class="detail-value">${product.category}</span>
                </div>
                <div class="product-detail-item">
                    <span class="detail-label">Preço:</span>
                    <span class="detail-value price">R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="product-detail-item">
                    <span class="detail-label">Estoque:</span>
                    <span class="detail-value ${product.stock <= 5 ? 'low-stock' : ''}">${product.stock} unidades</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-outline product-edit-btn" data-product-id="${product.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Editar
                </button>
                <button class="btn btn-danger product-delete-btn" data-product-id="${product.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Excluir
                </button>
            </div>
        `
        
        productsGrid.appendChild(productCard)
    })

    // Add event listeners
    document.querySelectorAll(".product-edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const productId = Number.parseInt(btn.dataset.productId)
            editProduct(productId)
        })
    })

    document.querySelectorAll(".product-delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const productId = Number.parseInt(btn.dataset.productId)
            const confirmed = await showConfirm({
                title: 'Excluir produto',
                message: 'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.',
                confirmText: 'Excluir',
                danger: true
            })
            if (confirmed) {
                deleteProduct(productId)
                showToast('Produto excluído', 'O produto foi removido com sucesso.', 'success')
            }
        })
    })
}

// Show add/edit product modal
function showProductModal(productId = null) {
    const product = productId ? appData.products.find(p => p.id === productId) : null
    const isEdit = !!product

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    
    const modal = document.createElement('div')
    modal.className = 'modal'
    
    modal.innerHTML = `
        <div class="modal-header">
            ${isEdit ? 'Editar Produto' : 'Novo Produto'}
        </div>
        <div class="modal-body">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Nome *</label>
                <input type="text" id="productName" placeholder="Nome do produto" 
                    value="${product ? product.name : ''}" style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Descrição *</label>
                <textarea id="productDescription" rows="3" placeholder="Descrição do produto" style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                    resize: vertical;
                ">${product ? product.description : ''}</textarea>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Preço (R$) *</label>
                <input type="number" id="productPrice" placeholder="0.00" step="0.01" min="0" 
                    value="${product ? product.price : ''}" style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Categoria *</label>
                <select id="productCategory" style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
                    <option value="eletrônicos" ${product && product.category === 'eletrônicos' ? 'selected' : ''}>Eletrônicos</option>
                    <option value="roupas" ${product && product.category === 'roupas' ? 'selected' : ''}>Roupas</option>
                    <option value="alimentos" ${product && product.category === 'alimentos' ? 'selected' : ''}>Alimentos</option>
                    <option value="casa" ${product && product.category === 'casa' ? 'selected' : ''}>Casa</option>
                    <option value="esportes" ${product && product.category === 'esportes' ? 'selected' : ''}>Esportes</option>
                    <option value="outros" ${product && product.category === 'outros' ? 'selected' : ''}>Outros</option>
                </select>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Estoque *</label>
                <input type="number" id="productStock" placeholder="0" min="0" 
                    value="${product ? product.stock : ''}" style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
            </div>
            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Status *</label>
                <select id="productStatus" style="
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
                    <option value="ativo" ${product && product.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                    <option value="inativo" ${product && product.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                    <option value="esgotado" ${product && product.status === 'esgotado' ? 'selected' : ''}>Esgotado</option>
                </select>
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn btn-outline" id="cancelProductBtn">Cancelar</button>
            <button class="btn btn-primary" id="saveProductBtn">${isEdit ? 'Salvar' : 'Adicionar'}</button>
        </div>
    `
    
    overlay.appendChild(modal)
    document.body.appendChild(overlay)
    
    // Focus on name input
    setTimeout(() => {
        document.getElementById('productName')?.focus()
    }, 100)
    
    // Event listeners
    document.getElementById('cancelProductBtn').addEventListener('click', () => {
        document.body.removeChild(overlay)
    })
    
    const saveBtn = document.getElementById('saveProductBtn')
    saveBtn.addEventListener('click', () => {
        const name = document.getElementById('productName').value.trim()
        const description = document.getElementById('productDescription').value.trim()
        const priceInput = document.getElementById('productPrice').value
        const price = parseFloat(priceInput)
        const category = document.getElementById('productCategory').value
        const stockInput = document.getElementById('productStock').value
        const stock = Number.parseInt(stockInput)
        const status = document.getElementById('productStatus').value
        
        // Validation
        if (!name) {
            showToast('Campo obrigatório', 'O nome é obrigatório.', 'error')
            document.getElementById('productName').focus()
            return
        }
        
        if (!description) {
            showToast('Campo obrigatório', 'A descrição é obrigatória.', 'error')
            document.getElementById('productDescription').focus()
            return
        }
        
        if (!priceInput || isNaN(price) || price < 0) {
            showToast('Valor inválido', 'O preço deve ser um número válido maior ou igual a zero.', 'error')
            document.getElementById('productPrice').focus()
            return
        }
        
        if (!stockInput || isNaN(stock) || stock < 0) {
            showToast('Estoque inválido', 'O estoque deve ser um número válido maior ou igual a zero.', 'error')
            document.getElementById('productStock').focus()
            return
        }
        
        // Save product
        if (isEdit) {
            updateProduct(productId, {
                name,
                description,
                price,
                category,
                stock,
                status
            })
        } else {
            addProduct({
                name,
                description,
                price,
                category,
                stock,
                status
            })
        }
        
        // Close modal
        document.body.removeChild(overlay)
        showToast(
            isEdit ? 'Produto atualizado' : 'Produto adicionado',
            isEdit ? 'O produto foi atualizado com sucesso.' : 'O produto foi adicionado com sucesso.',
            'success'
        )
    })
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay)
        }
    })
    
    // Escape key to close
    const handleKeyDown = function(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay)
            }
            document.removeEventListener('keydown', handleKeyDown)
        }
    }
    document.addEventListener('keydown', handleKeyDown)
}

// Add product
function addProduct(productData) {
    if (!appData.products) {
        appData.products = []
    }
    
    const newId = appData.products.length > 0 
        ? Math.max(...appData.products.map(p => p.id)) + 1 
        : 1
    
    const newProduct = {
        id: newId,
        ...productData,
        createdAt: new Date().toISOString()
    }
    
    appData.products.push(newProduct)
    saveData(appData)
    renderProducts()
}

// Update product
function updateProduct(productId, productData) {
    const product = appData.products.find(p => p.id === productId)
    if (!product) return
    
    Object.assign(product, productData)
    saveData(appData)
    renderProducts()
}

// Edit product
function editProduct(productId) {
    showProductModal(productId)
}

// Delete product
function deleteProduct(productId) {
    appData.products = appData.products.filter(p => p.id !== productId)
    saveData(appData)
    renderProducts()
}

console.log("[v0] All functions are now fully operational")

// ============================================
// CHAT DE SUPORTE
// ============================================

// Respostas automáticas do chat
const chatResponses = {
    "tarefa": {
        message: "Para adicionar uma tarefa, você pode:\n\n1. Clicar no botão 'Adicionar' no topo da página\n2. Usar o atalho Ctrl+K\n3. Ir até a seção 'Tarefas' e clicar em 'Nova Tarefa'\n\nPrecisa de mais ajuda?",
        keywords: ["tarefa", "adicionar tarefa", "criar tarefa", "nova tarefa"]
    },
    "finança": {
        message: "Para gerenciar suas finanças:\n\n1. Acesse a seção 'Finanças' no menu\n2. Clique em 'Nova Transação' para adicionar receitas ou despesas\n3. Visualize seu saldo total e transações recentes\n4. Use 'Gerar Relatório' para análises detalhadas\n\nAlguma dúvida específica?",
        keywords: ["finança", "financeiro", "transação", "receita", "despesa", "saldo", "dinheiro"]
    },
    "produto": {
        message: "Para gerenciar produtos:\n\n1. Acesse a seção 'Produtos' no menu\n2. Clique em 'Novo Produto' para adicionar\n3. Use os filtros para buscar produtos\n4. Edite ou exclua produtos conforme necessário\n\nPrecisa de ajuda com algo específico?",
        keywords: ["produto", "produtos", "estoque", "catálogo"]
    },
    "meta": {
        message: "Para gerenciar metas:\n\n1. Acesse a seção 'Metas' no menu\n2. Clique em 'Nova Meta' para criar\n3. Acompanhe o progresso visualmente\n4. Atualize o progresso clicando em 'Atualizar Progresso'\n\nTem alguma dúvida?",
        keywords: ["meta", "metas", "objetivo", "progresso"]
    },
    "perfil": {
        message: "Para editar seu perfil:\n\n1. Acesse a seção 'Perfil' no menu\n2. Edite suas informações pessoais\n3. Clique em 'Salvar Alterações'\n\nAlgo mais?",
        keywords: ["perfil", "conta", "informações", "dados pessoais"]
    },
    "configuração": {
        message: "Nas configurações você pode:\n\n1. Alterar o tema (claro/escuro)\n2. Gerenciar notificações\n3. Exportar ou limpar dados\n4. Fazer logout\n\nPrecisa de ajuda com alguma configuração específica?",
        keywords: ["configuração", "configurações", "ajustes", "tema", "notificação"]
    },
    "default": {
        message: "Entendi! Como posso ajudá-lo? Você pode perguntar sobre:\n\n• Como adicionar tarefas\n• Como gerenciar finanças\n• Como usar produtos\n• Como criar metas\n• Configurações\n• Perfil\n\nOu digite sua dúvida específica!"
    }
}

// Função para encontrar resposta baseada na mensagem
function findChatResponse(message) {
    const lowerMessage = message.toLowerCase()
    
    for (const [key, response] of Object.entries(chatResponses)) {
        if (key === "default") continue
        
        for (const keyword of response.keywords) {
            if (lowerMessage.includes(keyword)) {
                return response.message
            }
        }
    }
    
    return chatResponses.default.message
}

// Função para adicionar mensagem ao chat
function addChatMessage(text, isUser = false) {
    const messagesContainer = document.getElementById('chatMessages')
    const messageDiv = document.createElement('div')
    messageDiv.className = `chat-message ${isUser ? 'chat-message-user' : 'chat-message-bot'}`
    
    const now = new Date()
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${isUser ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'}
        </div>
        <div class="message-content">
            <div class="message-bubble">
                <p>${text.replace(/\n/g, '<br>')}</p>
            </div>
            <span class="message-time">${timeString}</span>
        </div>
    `
    
    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
    
    // Remover sugestões após primeira mensagem do usuário
    if (isUser) {
        const suggestions = document.getElementById('chatSuggestions')
        if (suggestions) {
            suggestions.style.display = 'none'
        }
    }
}

// Inicializar chat de suporte
function initSupportChat() {
    const chatButton = document.getElementById('supportChatButton')
    const chatWindow = document.getElementById('supportChatWindow')
    const chatMinimizeBtn = document.getElementById('chatMinimizeBtn')
    const chatInput = document.getElementById('chatInput')
    const chatSendBtn = document.getElementById('chatSendBtn')
    const chatSuggestions = document.getElementById('chatSuggestions')
    
    if (!chatButton || !chatWindow) return
    
    // Toggle chat window
    chatButton.addEventListener('click', () => {
        const isActive = chatWindow.classList.contains('active')
        
        if (isActive) {
            chatWindow.classList.remove('active')
            chatButton.classList.remove('active')
        } else {
            chatWindow.classList.add('active')
            chatButton.classList.add('active')
            chatInput.focus()
        }
    })
    
    // Minimizar chat
    if (chatMinimizeBtn) {
        chatMinimizeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('active')
            chatButton.classList.remove('active')
        })
    }
    
    // Enviar mensagem
    function sendMessage() {
        const message = chatInput.value.trim()
        if (!message) return
        
        // Adicionar mensagem do usuário
        addChatMessage(message, true)
        chatInput.value = ''
        
        // Simular digitação do bot
        setTimeout(() => {
            const response = findChatResponse(message)
            addChatMessage(response, false)
        }, 1000)
    }
    
    // Botão enviar
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage)
    }
    
    // Enter para enviar
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage()
            }
        })
    }
    
    // Sugestões de mensagens
    if (chatSuggestions) {
        const suggestionBtns = chatSuggestions.querySelectorAll('.suggestion-btn')
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const suggestion = btn.dataset.suggestion
                addChatMessage(suggestion, true)
                chatSuggestions.style.display = 'none'
                
                setTimeout(() => {
                    const response = findChatResponse(suggestion)
                    addChatMessage(response, false)
                }, 1000)
            })
        })
    }
}

// Inicializar chat quando a página carregar
window.addEventListener('load', () => {
    initSupportChat()
})
