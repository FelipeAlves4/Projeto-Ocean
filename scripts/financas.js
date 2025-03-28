// Dados de exemplo
let transacoes = [
    {
        id: 1,
        tipo: 'receita',
        descricao: 'Salário',
        valor: 5000,
        categoria: 'salario',
        data: '2024-03-25'
    },
    {
        id: 2,
        tipo: 'despesa',
        descricao: 'Aluguel',
        valor: 1500,
        categoria: 'moradia',
        data: '2024-03-20'
    }
];

// Elementos do DOM
const modal = document.getElementById('modalTransacao');
const btnNovaTransacao = document.getElementById('btnNovaTransacao');
const btnCancelar = document.getElementById('btnCancelar');
const formTransacao = document.getElementById('formTransacao');
const transacoesLista = document.querySelector('.transacoes-lista');

// Configuração dos gráficos
const ctxDespesas = document.getElementById('graficoDespesas').getContext('2d');
const ctxReceitas = document.getElementById('graficoReceitas').getContext('2d');

let graficoDespesas = new Chart(ctxDespesas, {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                '#ef4444',
                '#f97316',
                '#eab308',
                '#84cc16',
                '#22c55e',
                '#14b8a6',
                '#06b6d4',
                '#3b82f6',
                '#6366f1',
                '#8b5cf6'
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right'
            }
        }
    }
});

let graficoReceitas = new Chart(ctxReceitas, {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                '#22c55e',
                '#84cc16',
                '#eab308',
                '#f97316',
                '#ef4444'
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right'
            }
        }
    }
});

// Funções auxiliares
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

function calcularTotais() {
    const totais = {
        saldo: 0,
        receitas: 0,
        despesas: 0
    };

    transacoes.forEach(transacao => {
        if (transacao.tipo === 'receita') {
            totais.receitas += transacao.valor;
            totais.saldo += transacao.valor;
        } else {
            totais.despesas += transacao.valor;
            totais.saldo -= transacao.valor;
        }
    });

    return totais;
}

function atualizarContadores() {
    const totais = calcularTotais();
    
    document.querySelector('[data-tipo="saldo"]').textContent = formatarMoeda(totais.saldo);
    document.querySelector('[data-tipo="receitas"]').textContent = formatarMoeda(totais.receitas);
    document.querySelector('[data-tipo="despesas"]').textContent = formatarMoeda(totais.despesas);
}

function atualizarGraficos() {
    const categoriasDespesas = {};
    const categoriasReceitas = {};

    transacoes.forEach(transacao => {
        if (transacao.tipo === 'despesa') {
            categoriasDespesas[transacao.categoria] = (categoriasDespesas[transacao.categoria] || 0) + transacao.valor;
        } else {
            categoriasReceitas[transacao.categoria] = (categoriasReceitas[transacao.categoria] || 0) + transacao.valor;
        }
    });

    graficoDespesas.data.labels = Object.keys(categoriasDespesas);
    graficoDespesas.data.datasets[0].data = Object.values(categoriasDespesas);
    graficoDespesas.update();

    graficoReceitas.data.labels = Object.keys(categoriasReceitas);
    graficoReceitas.data.datasets[0].data = Object.values(categoriasReceitas);
    graficoReceitas.update();
}

function renderizarTransacoes() {
    transacoesLista.innerHTML = '';
    
    transacoes.sort((a, b) => new Date(b.data) - new Date(a.data))
        .forEach(transacao => {
            const transacaoElement = document.createElement('div');
            transacaoElement.className = 'transacao-item';
            
            const icon = transacao.tipo === 'receita' ? 'fa-arrow-up' : 'fa-arrow-down';
            
            transacaoElement.innerHTML = `
                <div class="transacao-info">
                    <div class="transacao-icon">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="transacao-detalhes">
                        <span class="transacao-descricao">${transacao.descricao}</span>
                        <span class="transacao-data">${formatarData(transacao.data)}</span>
                    </div>
                </div>
                <span class="transacao-valor ${transacao.tipo}">
                    ${transacao.tipo === 'receita' ? '+' : '-'}${formatarMoeda(transacao.valor)}
                </span>
            `;
            
            transacoesLista.appendChild(transacaoElement);
        });
}

// Event Listeners
btnNovaTransacao.addEventListener('click', () => {
    modal.style.display = 'block';
    formTransacao.reset();
});

btnCancelar.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

formTransacao.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(formTransacao);
    const novaTransacao = {
        id: transacoes.length + 1,
        tipo: formData.get('tipo'),
        descricao: formData.get('descricao'),
        valor: parseFloat(formData.get('valor')),
        categoria: formData.get('categoria'),
        data: formData.get('data')
    };
    
    transacoes.push(novaTransacao);
    
    atualizarContadores();
    atualizarGraficos();
    renderizarTransacoes();
    
    modal.style.display = 'none';
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadores();
    atualizarGraficos();
    renderizarTransacoes();
}); 