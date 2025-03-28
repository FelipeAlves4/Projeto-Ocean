// Dados de exemplo
let transactions = [
    {
        id: 1,
        type: 'income',
        description: 'Salário',
        amount: 5000,
        category: 'Trabalho',
        date: '2024-03-15'
    },
    {
        id: 2,
        type: 'expense',
        description: 'Aluguel',
        amount: 1500,
        category: 'Moradia',
        date: '2024-03-10'
    },
    {
        id: 3,
        type: 'expense',
        description: 'Supermercado',
        amount: 300,
        category: 'Alimentação',
        date: '2024-03-05'
    },
    {
        id: 4,
        type: 'income',
        description: 'Freelance',
        amount: 800,
        category: 'Trabalho',
        date: '2024-03-01'
    }
];

let budget = {
    'Moradia': 2000,
    'Alimentação': 1000,
    'Transporte': 500,
    'Saúde': 300,
    'Lazer': 400,
    'Outros': 600
};

// Elementos do DOM
const menuButton = document.querySelector('.menu-button');
const menuDropdown = document.querySelector('.menu-dropdown');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const transactionModal = document.getElementById('transactionModal');
const addTransactionBtn = document.querySelector('.add-transaction-btn');
const closeModalBtn = document.querySelector('.close-button');
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.querySelector('.transaction-list');
const expenseChart = document.getElementById('expenseChart');
const incomeChart = document.getElementById('incomeChart');
const budgetList = document.querySelector('.budget-list');
const filterModal = document.getElementById('filterModal');
const filterBtn = document.querySelector('.filter-btn');
const filterForm = document.getElementById('filterForm');
const closeFilterBtn = document.querySelector('.close-filter-btn');
const editBudgetBtn = document.querySelector('.edit-budget-btn');
const budgetModal = document.getElementById('budgetModal');
const budgetForm = document.getElementById('budgetForm');
const closeBudgetBtn = document.querySelector('.close-budget-btn');

// Funções utilitárias
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Gerenciamento do Menu
menuButton.addEventListener('click', () => {
    menuDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
        menuDropdown.classList.remove('active');
    }
});

// Gerenciamento das Tabs
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and target content
        button.classList.add('active');
        document.querySelector(`.tab-content[data-tab="${target}"]`).classList.add('active');
    });
});

// Gerenciamento do Modal de Transação
addTransactionBtn.addEventListener('click', () => {
    transactionModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    transactionModal.style.display = 'none';
});

transactionModal.addEventListener('click', (e) => {
    if (e.target === transactionModal) {
        transactionModal.style.display = 'none';
    }
});

transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(transactionForm);
    const newTransaction = {
        id: transactions.length + 1,
        type: formData.get('type'),
        description: formData.get('description'),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        date: formData.get('date')
    };
    
    transactions.push(newTransaction);
    updateTransactionList();
    updateCharts();
    updateBudgetList();
    updateSummaryCards();
    
    transactionModal.style.display = 'none';
    transactionForm.reset();
});

// Gerenciamento do Modal de Filtro
filterBtn.addEventListener('click', () => {
    filterModal.style.display = 'flex';
});

closeFilterBtn.addEventListener('click', () => {
    filterModal.style.display = 'none';
});

filterModal.addEventListener('click', (e) => {
    if (e.target === filterModal) {
        filterModal.style.display = 'none';
    }
});

filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(filterForm);
    const type = formData.get('filterType');
    const category = formData.get('filterCategory');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    
    // Implementar lógica de filtro aqui
    updateTransactionList();
    
    filterModal.style.display = 'none';
    filterForm.reset();
});

// Gerenciamento do Modal de Orçamento
editBudgetBtn.addEventListener('click', () => {
    budgetModal.style.display = 'flex';
    
    // Preencher o formulário com os valores atuais
    Object.entries(budget).forEach(([category, amount]) => {
        const input = budgetForm.querySelector(`input[name="${category}"]`);
        if (input) {
            input.value = amount;
        }
    });
});

closeBudgetBtn.addEventListener('click', () => {
    budgetModal.style.display = 'none';
});

budgetModal.addEventListener('click', (e) => {
    if (e.target === budgetModal) {
        budgetModal.style.display = 'none';
    }
});

budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(budgetForm);
    Object.keys(budget).forEach(category => {
        budget[category] = parseFloat(formData.get(category)) || 0;
    });
    
    updateBudgetList();
    updateSummaryCards();
    
    budgetModal.style.display = 'none';
    budgetForm.reset();
});

// Funções de Atualização
function updateTransactionList() {
    transactionList.innerHTML = transactions.map(transaction => `
        <div class="transaction-item ${transaction.type}">
            <div class="transaction-icon">
                <i class="fas ${transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
            </div>
            <div class="transaction-info">
                <h3>${transaction.description}</h3>
                <p>${transaction.category} • ${formatDate(transaction.date)}</p>
            </div>
            <div class="transaction-value">
                ${formatCurrency(transaction.amount)}
            </div>
        </div>
    `).join('');
}

function updateCharts() {
    // Dados para os gráficos
    const expenseData = {};
    const incomeData = {};
    
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            expenseData[transaction.category] = (expenseData[transaction.category] || 0) + transaction.amount;
        } else {
            incomeData[transaction.category] = (incomeData[transaction.category] || 0) + transaction.amount;
        }
    });

    // Configuração do gráfico de despesas
    new Chart(expenseChart, {
        type: 'doughnut',
        data: {
            labels: Object.keys(expenseData),
            datasets: [{
                data: Object.values(expenseData),
                backgroundColor: [
                    '#ef4444',
                    '#f97316',
                    '#f59e0b',
                    '#eab308',
                    '#84cc16',
                    '#22c55e',
                    '#14b8a6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Configuração do gráfico de receitas
    new Chart(incomeChart, {
        type: 'doughnut',
        data: {
            labels: Object.keys(incomeData),
            datasets: [{
                data: Object.values(incomeData),
                backgroundColor: [
                    '#10b981',
                    '#059669',
                    '#047857',
                    '#065f46',
                    '#064e3b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateBudgetList() {
    budgetList.innerHTML = Object.entries(budget).map(([category, amount]) => {
        const spent = transactions
            .filter(t => t.type === 'expense' && t.category === category)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const progress = (spent / amount) * 100;
        
        return `
            <div class="budget-item">
                <div class="budget-header">
                    <h3>${category}</h3>
                    <span>${formatCurrency(spent)} / ${formatCurrency(amount)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${Math.min(progress, 100)}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function updateSummaryCards() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const savings = totalIncome - totalExpenses;
    
    document.querySelector('.total-balance').textContent = formatCurrency(savings);
    document.querySelector('.monthly-income').textContent = formatCurrency(totalIncome);
    document.querySelector('.monthly-expenses').textContent = formatCurrency(totalExpenses);
    document.querySelector('.savings').textContent = formatCurrency(savings);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateTransactionList();
    updateCharts();
    updateBudgetList();
    updateSummaryCards();
}); 