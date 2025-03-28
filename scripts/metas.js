// Inicialização do Flatpickr para os campos de data
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Flatpickr para data inicial
    flatpickr("#goalStartDate", {
        locale: "pt",
        dateFormat: "d/m/Y",
        allowInput: true
    });

    // Configuração do Flatpickr para data final
    flatpickr("#goalEndDate", {
        locale: "pt",
        dateFormat: "d/m/Y",
        allowInput: true
    });

    // Atualizar valor do progresso em tempo real
    const progressInput = document.getElementById('goalProgress');
    const progressValue = document.getElementById('progressValue');
    
    if (progressInput && progressValue) {
        progressInput.addEventListener('input', function() {
            progressValue.textContent = `${this.value}%`;
        });
    }

    // Carregar metas salvas
    loadGoals();
});

// Gerenciamento de metas
let goals = JSON.parse(localStorage.getItem('goals')) || [];

// Função para salvar metas
function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

// Função para carregar metas
function loadGoals() {
    const goalsGrid = document.querySelector('.goals-grid');
    const emptyState = document.getElementById('emptyGoals');

    if (goals.length === 0) {
        goalsGrid.innerHTML = emptyState.outerHTML;
        return;
    }

    goalsGrid.innerHTML = goals.map((goal, index) => `
        <div class="goal-card" data-index="${index}">
            <div class="goal-header">
                <h3 class="goal-title">${goal.title}</h3>
                <div class="goal-actions">
                    <button class="btn btn-text" onclick="updateGoalProgress(${index}, 5)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn btn-text" onclick="updateGoalProgress(${index}, -5)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="btn btn-text" onclick="deleteGoal(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="goal-description">${goal.description}</p>
            <div class="goal-meta">
                <span class="goal-badge category-${goal.category}">${goal.category}</span>
                <span class="goal-badge priority-${goal.priority}">${goal.priority}</span>
            </div>
            <div class="goal-progress">
                <div class="goal-progress-header">
                    <span class="goal-progress-label">Progresso</span>
                    <span class="goal-progress-value">${goal.progress}%</span>
                </div>
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
                </div>
            </div>
            <div class="goal-dates">
                <span>Início: ${goal.startDate}</span>
                <span>Fim: ${goal.endDate}</span>
            </div>
        </div>
    `).join('');
}

// Função para adicionar nova meta
document.getElementById('addGoalForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const goal = {
        title: document.getElementById('goalTitle').value,
        description: document.getElementById('goalDescription').value,
        startDate: document.getElementById('goalStartDate').value,
        endDate: document.getElementById('goalEndDate').value,
        category: document.getElementById('goalCategory').value,
        priority: document.getElementById('goalPriority').value,
        progress: parseInt(document.getElementById('goalProgress').value)
    };

    goals.push(goal);
    saveGoals();
    loadGoals();

    // Fechar modal e resetar formulário
    const modal = bootstrap.Modal.getInstance(document.getElementById('addGoalModal'));
    modal.hide();
    this.reset();
    document.getElementById('progressValue').textContent = '0%';
});

// Função para atualizar progresso da meta
function updateGoalProgress(index, change) {
    if (index < 0 || index >= goals.length) return;

    goals[index].progress = Math.max(0, Math.min(100, goals[index].progress + change));
    saveGoals();
    loadGoals();
}

// Função para deletar meta
function deleteGoal(index) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
        goals.splice(index, 1);
        saveGoals();
        loadGoals();
    }
}

// Função para filtrar metas
document.querySelector('.btn-outline').addEventListener('click', function() {
    // Implementar lógica de filtro aqui
    alert('Funcionalidade de filtro em desenvolvimento');
}); 