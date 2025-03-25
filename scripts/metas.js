// Gerenciamento do estado das metas
let metas = JSON.parse(localStorage.getItem('metas')) || [];
let metaEmEdicao = null;

// Elementos do DOM
const btnNovaMeta = document.getElementById('btnNovaMeta');
const modalMeta = document.getElementById('modalMeta');
const formMeta = document.getElementById('formMeta');
const btnCancelar = document.getElementById('btnCancelar');
const metasContainer = document.querySelector('.metas-container');

// Funções auxiliares
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

function calcularProgresso(dataInicio, dataPrazo) {
    const hoje = new Date();
    const inicio = new Date(dataInicio);
    const prazo = new Date(dataPrazo);
    
    const totalDias = (prazo - inicio) / (1000 * 60 * 60 * 24);
    const diasDecorridos = (hoje - inicio) / (1000 * 60 * 60 * 24);
    
    let progresso = (diasDecorridos / totalDias) * 100;
    progresso = Math.min(Math.max(progresso, 0), 100);
    
    return Math.round(progresso);
}

function criarCardMeta(meta) {
    const progresso = calcularProgresso(meta.dataInicio, meta.dataPrazo);
    const status = progresso >= 100 ? 'concluida' : progresso >= 75 ? 'em-progresso' : 'pendente';
    
    return `
        <div class="meta-card" data-id="${meta.id}">
            <div class="meta-header">
                <h3>${meta.titulo}</h3>
                <div class="meta-actions">
                    <button class="btn-icon btn-editar" title="Editar meta">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-excluir" title="Excluir meta">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="meta-descricao">${meta.descricao}</p>
            <div class="meta-progresso">
                <div class="progress-bar">
                    <div class="progress ${status}" style="width: ${progresso}%"></div>
                </div>
                <span>${progresso}%</span>
            </div>
            <div class="meta-datas">
                <span><i class="fas fa-calendar"></i> Início: ${formatarData(meta.dataInicio)}</span>
                <span><i class="fas fa-calendar-check"></i> Prazo: ${formatarData(meta.dataPrazo)}</span>
            </div>
        </div>
    `;
}

function renderizarMetas() {
    metasContainer.innerHTML = metas.map(meta => criarCardMeta(meta)).join('');
    adicionarEventListenersCards();
    atualizarContadores();
}

function salvarMetas() {
    localStorage.setItem('metas', JSON.stringify(metas));
    mostrarNotificacao('Metas salvas com sucesso!', 'success');
}

function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;
    notificacao.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${mensagem}</span>
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notificacao.classList.remove('show');
        setTimeout(() => {
            notificacao.remove();
        }, 300);
    }, 3000);
}

function abrirModal(meta = null) {
    metaEmEdicao = meta;
    formMeta.reset();
    
    if (meta) {
        document.getElementById('titulo').value = meta.titulo;
        document.getElementById('descricao').value = meta.descricao;
        document.getElementById('dataInicio').value = meta.dataInicio;
        document.getElementById('dataPrazo').value = meta.dataPrazo;
        modalMeta.querySelector('h2').textContent = 'Editar Meta';
    } else {
        modalMeta.querySelector('h2').textContent = 'Nova Meta';
    }
    
    modalMeta.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    modalMeta.style.display = 'none';
    document.body.style.overflow = 'auto';
    metaEmEdicao = null;
}

function atualizarContadores() {
    const totalMetas = metas.length;
    const metasConcluidas = metas.filter(meta => calcularProgresso(meta.dataInicio, meta.dataPrazo) >= 100).length;
    const metasEmProgresso = metas.filter(meta => {
        const progresso = calcularProgresso(meta.dataInicio, meta.dataPrazo);
        return progresso > 0 && progresso < 100;
    }).length;
    
    // Atualizar contadores na interface
    document.querySelectorAll('.contador').forEach(el => {
        if (el.dataset.tipo === 'total') el.textContent = totalMetas;
        if (el.dataset.tipo === 'concluidas') el.textContent = metasConcluidas;
        if (el.dataset.tipo === 'em-progresso') el.textContent = metasEmProgresso;
    });
}

// Event Listeners
btnNovaMeta.addEventListener('click', () => {
    abrirModal();
    mostrarNotificacao('Adicione uma nova meta!', 'info');
});

btnCancelar.addEventListener('click', () => {
    fecharModal();
    mostrarNotificacao('Operação cancelada', 'info');
});

modalMeta.addEventListener('click', (e) => {
    if (e.target === modalMeta) {
        fecharModal();
    }
});

formMeta.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(formMeta);
    const meta = {
        id: metaEmEdicao ? metaEmEdicao.id : Date.now(),
        titulo: formData.get('titulo'),
        descricao: formData.get('descricao'),
        dataInicio: formData.get('dataInicio'),
        dataPrazo: formData.get('dataPrazo')
    };
    
    if (metaEmEdicao) {
        const index = metas.findIndex(m => m.id === metaEmEdicao.id);
        metas[index] = meta;
        mostrarNotificacao('Meta atualizada com sucesso!', 'success');
    } else {
        metas.push(meta);
        mostrarNotificacao('Meta adicionada com sucesso!', 'success');
    }
    
    salvarMetas();
    renderizarMetas();
    fecharModal();
});

function adicionarEventListenersCards() {
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.meta-card');
            const metaId = parseInt(card.dataset.id);
            const meta = metas.find(m => m.id === metaId);
            abrirModal(meta);
            mostrarNotificacao('Editando meta...', 'info');
        });
    });
    
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.meta-card');
            const metaId = parseInt(card.dataset.id);
            const meta = metas.find(m => m.id === metaId);
            
            if (confirm('Tem certeza que deseja excluir esta meta?')) {
                card.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    metas = metas.filter(m => m.id !== metaId);
                    salvarMetas();
                    renderizarMetas();
                    mostrarNotificacao('Meta excluída com sucesso!', 'success');
                }, 300);
            }
        });
    });
}

// Inicialização
renderizarMetas();

// Adicionar estilos dinâmicos para notificações
const style = document.createElement('style');
style.textContent = `
    .notificacao {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .notificacao.show {
        transform: translateY(0);
        opacity: 1;
    }

    .notificacao.success {
        border-left: 4px solid #2ecc71;
    }

    .notificacao.info {
        border-left: 4px solid #3498db;
    }

    .notificacao i {
        font-size: 1.2rem;
    }

    .notificacao.success i {
        color: #2ecc71;
    }

    .notificacao.info i {
        color: #3498db;
    }

    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 