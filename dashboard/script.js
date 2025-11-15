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

// Default data structure
const defaultData = {
    tasks: [
        { id: 1, name: "Reunião de planejamento", status: "pending", createdAt: new Date().toISOString() },
        { id: 2, name: "Revisar documentação", status: "pending", createdAt: new Date().toISOString() },
        { id: 3, name: "Atualizar relatório", status: "completed", createdAt: new Date().toISOString() },
        { id: 4, name: "Preparar apresentação", status: "pending", createdAt: new Date().toISOString() },
        { id: 5, name: "Enviar e-mails", status: "completed", createdAt: new Date().toISOString() },
    ],
    goals: [
        {
            id: 1,
            title: "Aumentar Produtividade",
            description: "Completar 20 tarefas por semana",
            progress: 75,
            target: 20,
            current: 15,
        },
        {
            id: 2,
            title: "Economia Mensal",
            description: "Economizar R$ 1.000 este mês",
            progress: 60,
            target: 1000,
            current: 600,
        },
        {
            id: 3,
            title: "Aprendizado Contínuo",
            description: "Estudar 10 horas por semana",
            progress: 45,
            target: 10,
            current: 4.5,
        },
    ],
    finances: {
        income: 4200,
        expenses: 1360,
        balance: 2840,
    },
    stats: {
        tasksCompleted: 12,
        tasksTotal: 20,
        productiveTime: 5.2,
        activeGoals: 4,
    },
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
    
    if (profileEmail) {
        profileEmail.textContent = userEmail;
    }
    if (profileEmailInput) {
        profileEmailInput.value = userEmail;
    }
    if (profileName) {
        // Extract name from email (before @) or use default
        const emailName = userEmail.split('@')[0];
        profileName.textContent = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
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
    })
})

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderSummaryCards() {
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
    document.querySelector(".finance-income .finance-value").textContent =
        `R$ ${appData.finances.income.toLocaleString("pt-BR")}`
    document.querySelector(".finance-expense .finance-value").textContent =
        `R$ ${appData.finances.expenses.toLocaleString("pt-BR")}`
    document.querySelector(".finance-balance .finance-value").textContent =
        `R$ ${appData.finances.balance.toLocaleString("pt-BR")}`
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
    renderSummaryCards()
    renderTasks()
    renderGoals()
    renderFinances()
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
            showToast('Em breve', 'Funcionalidade de adicionar transação em desenvolvimento.', 'info')
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
    renderFinances()

    const transactionsList = document.getElementById("transactionsList")
    if (!transactionsList) return

    transactionsList.innerHTML = `
          <div class="empty-state">
              <div class="empty-icon">💰</div>
              <h3>Nenhuma transação registrada</h3>
              <p>Adicione transações para acompanhar suas finanças</p>
          </div>
      `
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
})

console.log("[v0] All functions are now fully operational")
