// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const addTaskForm = document.getElementById('addTaskForm');
const pendingTasksList = document.getElementById('pendingTasksList');
const completedTasksList = document.getElementById('completedTasksList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const emptyPendingTasks = document.getElementById('emptyPendingTasks');
const emptyCompletedTasks = document.getElementById('emptyCompletedTasks');
const taskDate = document.getElementById('taskDate');

// Initialize Local Storage
function initLocalStorage() {
  if (!localStorage.getItem('tasks')) {
    // Sample tasks data
    const sampleTasks = [
      {
        id: '1',
        title: 'Preparar relatório mensal',
        date: '2023-05-15',
        completed: false,
        priority: 'alta',
        category: 'trabalho'
      },
      {
        id: '2',
        title: 'Fazer compras no supermercado',
        date: '2023-05-16',
        completed: false,
        priority: 'média',
        category: 'pessoal'
      },
      {
        id: '3',
        title: 'Revisar proposta de projeto',
        date: '2023-05-14',
        completed: true,
        priority: 'alta',
        category: 'trabalho'
      },
      {
        id: '4',
        title: 'Assistir aula online de inglês',
        date: '2023-05-18',
        completed: false,
        priority: 'baixa',
        category: 'estudos'
      },
      {
        id: '5',
        title: 'Agendar consulta médica',
        date: '2023-05-20',
        completed: false,
        priority: 'média',
        category: 'pessoal'
      }
    ];
    localStorage.setItem('tasks', JSON.stringify(sampleTasks));
  }
}

// Toggle Mobile Menu
function toggleMobileMenu() {
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

// Tab Functionality
function setupTabs() {
  if (tabBtns.length > 0 && tabContents.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons and content
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show corresponding content
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Display Tasks
function displayTasks() {
  if (!pendingTasksList || !completedTasksList) return;
  
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  // Update counters
  if (pendingCount) pendingCount.textContent = pendingTasks.length;
  if (completedCount) completedCount.textContent = completedTasks.length;
  
  // Clear lists
  if (pendingTasksList) {
    pendingTasksList.innerHTML = '';
    if (pendingTasks.length === 0) {
      pendingTasksList.appendChild(emptyPendingTasks);
    } else {
      pendingTasks.forEach(task => {
        const taskItem = createTaskItem(task);
        pendingTasksList.appendChild(taskItem);
      });
    }
  }
  
  if (completedTasksList) {
    completedTasksList.innerHTML = '';
    if (completedTasks.length === 0) {
      completedTasksList.appendChild(emptyCompletedTasks);
    } else {
      completedTasks.forEach(task => {
        const taskItem = createTaskItem(task);
        completedTasksList.appendChild(taskItem);
      });
    }
  }
}

// Create Task Item
function createTaskItem(task) {
  const taskItem = document.createElement('div');
  taskItem.className = `task-item-card ${task.completed ? 'completed-task' : ''}`;
  taskItem.dataset.id = task.id;
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
  
  const taskContent = document.createElement('div');
  taskContent.className = 'task-content';
  
  const taskHeader = document.createElement('div');
  taskHeader.className = 'task-header';
  
  const taskTitle = document.createElement('p');
  taskTitle.className = 'task-title';
  taskTitle.textContent = task.title;
  
  const taskBadges = document.createElement('div');
  taskBadges.className = 'task-badges';
  
  const priorityBadge = document.createElement('span');
  priorityBadge.className = `task-badge priority-${task.priority}`;
  priorityBadge.textContent = task.priority;
  
  const categoryBadge = document.createElement('span');
  categoryBadge.className = `task-badge category-${task.category}`;
  categoryBadge.textContent = task.category;
  
  taskBadges.appendChild(priorityBadge);
  taskBadges.appendChild(categoryBadge);
  
  const taskDateDisplay = document.createElement('div');
  taskDateDisplay.className = 'task-date-display';
  taskDateDisplay.innerHTML = `<i class="fas fa-calendar-day"></i> ${formatDate(task.date)}`;
  
  taskHeader.appendChild(taskTitle);
  taskHeader.appendChild(taskBadges);
  
  taskContent.appendChild(taskHeader);
  taskContent.appendChild(taskDateDisplay);
  
  taskItem.appendChild(checkbox);
  taskItem.appendChild(taskContent);
  
  return taskItem;
}

// Toggle Task Status
function toggleTaskStatus(taskId) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  displayTasks();
}

// Add New Task
function addTask(title, date, priority, category) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const newTask = {
    id: Date.now().toString(),
    title,
    date,
    completed: false,
    priority,
    category
  };
  
  tasks.unshift(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  displayTasks();
}

// Handle Task Form Submission
function handleTaskForm() {
  if (addTaskForm) {
    addTaskForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const title = document.getElementById('taskTitle').value;
      const date = document.getElementById('taskDate').value || new Date().toISOString().split('T')[0];
      const priority = document.getElementById('taskPriority').value;
      const category = document.getElementById('taskCategory').value;
      
      if (title.trim()) {
        addTask(title, date, priority, category);
        addTaskForm.reset();
        
        // Reset the date picker to today
        if (flatpickr && taskDate._flatpickr) {
          taskDate._flatpickr.setDate(new Date());
        }
      }
    });
  }
}

// Initialize Date Picker
function initDatePicker() {
  if (taskDate && typeof flatpickr !== 'undefined') {
    flatpickr(taskDate, {
      dateFormat: 'Y-m-d',
      defaultDate: new Date(),
      locale: 'pt',
      altInput: true,
      altFormat: 'j F Y',
      disableMobile: true
    });
  }
}

// Menu Dropdown Functionality
function setupMenuDropdown() {
    const menuButton = document.getElementById('menuButton');
    const menuDropdown = document.getElementById('menuDropdown');
    
    if (menuButton && menuDropdown) {
        menuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            menuDropdown.classList.toggle('active');
        });

        // Fecha o menu quando clicar fora
        document.addEventListener('click', function(e) {
            if (!menuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('active');
            }
        });

        // Fecha o menu quando clicar em um item
        const menuItems = menuDropdown.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menuDropdown.classList.remove('active');
            });
        });
    }
}

// Modifica a função initApp para incluir o setup do menu dropdown
function initApp() {
    initLocalStorage();
    toggleMobileMenu();
    setupTabs();
    setupMenuDropdown();
    
    // Tasks page specific functionality
    if (window.location.pathname.includes('tarefas.html')) {
        initDatePicker();
        handleTaskForm();
        displayTasks();
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initApp);

// Função para atualizar a interface baseada no estado de login
function atualizarInterfaceLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginButton = document.getElementById('loginButton');
    const navActions = document.querySelector('.nav-actions');
    
    if (isLoggedIn) {
        if (loginButton) loginButton.style.display = 'none';
        if (!document.querySelector('.nav-link[onclick="logout()"]')) {
            const logoutButton = document.createElement('a');
            logoutButton.href = '#';
            logoutButton.className = 'nav-link';
            logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
            logoutButton.onclick = function(e) {
                e.preventDefault();
                logout();
            };
            navActions.insertBefore(logoutButton, document.getElementById('menuButton'));
        }
    } else {
        if (loginButton) loginButton.style.display = 'flex';
        const logoutButton = document.querySelector('.nav-link[onclick="logout()"]');
        if (logoutButton) logoutButton.remove();
    }
}

// Adiciona evento de clique ao botão de login
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = './paginas/login.html';
        });
    }
    atualizarInterfaceLogin();
});

// Modifica a função verificarLogin para não redirecionar automaticamente
function verificarLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        atualizarInterfaceLogin();
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('usuario');
    window.location.href = './paginas/login.html';
}

// Adiciona o botão de logout na navbar
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelector('.nav-links');
    const logoutButton = document.createElement('a');
    logoutButton.href = '#';
    logoutButton.className = 'nav-link';
    logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
    logoutButton.onclick = function(e) {
        e.preventDefault();
        logout();
    };
    navLinks.appendChild(logoutButton);
});
