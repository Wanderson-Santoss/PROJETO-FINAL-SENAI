/* ====================== 4. CRUD DE DEMANDAS ====================== */
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos e variáveis definidas globalmente em utils-api-form.js
    const { 
        demandaForm, sectionMinhasDemandas, btnAbrirCriar, 
        selectCategoria, inputOrcamento, ICON_MAP 
    } = window;

    // 7. Renderização dos Cards (Minhas Demandas)
    function renderDemandas() {
        if (!sectionMinhasDemandas) return;
        sectionMinhasDemandas.innerHTML = '';

        if (window.demandas.length === 0) {
            sectionMinhasDemandas.innerHTML = `
                <div class="col-12 text-center p-5">
                    <div class="alert alert-info" role="alert">
                        <i class="bi bi-info-circle-fill me-2"></i> Você ainda não criou nenhuma demanda. Use o botão 'Criar Nova Demanda' para começar!
                    </div>
                </div>
            `;
            // IMPORTANTE: Garante que a seção mantém o layout de linha (d-flex) 
            // mesmo que só haja a mensagem de vazio, como configuramos em card-filters.js
            sectionMinhasDemandas.classList.add('d-flex'); 
            return;
        }

        // Se houver cards, o d-flex já está lá pela função updateSectionVisibility
        const fragment = document.createDocumentFragment();

        window.demandas.forEach((d, index) => {
            const subtitulo = d.subtitulo || '';
            const localizacao = d.localizacao || ''; 

            const cardHTML = document.createElement('div');
            // IMPORTANTE: Use a classe de coluna para respeitar o layout 'row g-4' da seção!
            cardHTML.className = 'col-lg-4 col-md-6 mb-4'; 
            cardHTML.innerHTML = `
                <div class="card card-dark bg-dark shadow-lg h-100 p-3" style="border: 1px solid #444; color: white;"> 
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex align-items-start mb-2">
                            <i class="${d.icone} fs-4 me-3 text-info"></i> 
                            <div class="text-white">
                                <h6 class="text-uppercase fw-bold mb-0">${d.titulo}</h6>
                                <p class="mb-0 fw-semibold small text-warning">${subtitulo}</p> 
                                <p class="mb-2 fw-semibold small text-muted">${localizacao}</p>
                            </div>
                        </div>
                        <p class="small mb-4 description-text flex-grow-1" style="color: #ccc;">
                            ${d.descricao.substring(0, 150)}${d.descricao.length > 150 ? '...' : ''}
                            <a href="#" class="text-danger small">ler mais...</a>
                        </p>
                        <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-auto" style="border-color: #555 !important;">
                            <div class="price-info">
                                <span class="fw-bold me-2 small">Orçamento Máximo:</span>
                                <span class="text-success fw-bold">${d.orcamento}</span>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-secondary" onclick="editarDemanda(${index})">Editar</button>
                                <button class="btn btn-sm btn-danger" onclick="excluirDemanda(${index})">Excluir</button>
                            </div>
                        </div>
                        <p class="text-muted small mt-2 mb-0 text-end">Criado em: ${d.data}</p>
                    </div>
                </div>
            `;
            fragment.appendChild(cardHTML);
        });
        sectionMinhasDemandas.appendChild(fragment);
    }
    window.renderDemandas = renderDemandas; // Torna a função acessível globalmente

    // 4. Criação e Edição (Manipulação do Form)
    if (demandaForm && btnAbrirCriar) { 
        demandaForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // FORÇA A ATIVAÇÃO DO FILTRO 'MINHAS DEMANDAS' e VISIBILIDADE
            const btnMinhasDemandas = window.filterButtons.find(b => b.dataset.target === 'minhas-demandas');
            if (btnMinhasDemandas && window.updateSectionVisibility) {
                // Simula o clique para garantir que a seção correta esteja visível
                window.updateSectionVisibility('minhas-demandas');
                window.filterButtons.forEach(btn => btn.classList.remove('active'));
                btnMinhasDemandas.classList.add('active');
            }

            const novaDemanda = {
                titulo: document.getElementById('demanda-titulo').value,
                subtitulo: document.getElementById('demanda-subtitulo').value,
                localizacao: document.getElementById('demanda-localizacao').value,
                categoria: selectCategoria.value,
                descricao: document.getElementById('demanda-descricao').value,
                orcamento: inputOrcamento.value,
                icone: ICON_MAP[selectCategoria.value] || ICON_MAP['outros'],
                data: new Date().toLocaleDateString('pt-BR')
            };

            if (window.isEditing) {
                window.demandas[window.currentEditingIndex] = novaDemanda;
            } else {
                window.demandas.unshift(novaDemanda);
            }

            localStorage.setItem('minhasDemandas', JSON.stringify(window.demandas));
            
            // AQUI ESTÁ A CHAVE: RE-RENDERIZA TUDO para mostrar o novo card
            renderDemandas();
            
            // Fecha o formulário
            btnAbrirCriar.click(); 
        });
    }

    // 5. Função de Edição
    window.editarDemanda = function(index) {
        if (!btnAbrirCriar || !window.collapseForm || !selectCategoria || !inputOrcamento) return;
        const demanda = window.demandas[index];
        if (!demanda) return;
        
        // Simula o clique para abrir o formulário
        if (!window.collapseForm.classList.contains('show')) {
            btnAbrirCriar.click(); 
        }
        
        // Preenche o formulário
        document.getElementById('demanda-titulo').value = demanda.titulo;
        document.getElementById('demanda-subtitulo').value = demanda.subtitulo || ''; 
        document.getElementById('demanda-localizacao').value = demanda.localizacao || ''; 
        document.getElementById('demanda-descricao').value = demanda.descricao;
        document.getElementById('demanda-categoria').value = demanda.categoria;
        document.getElementById('demanda-orcamento').value = demanda.orcamento;

        window.isEditing = true;
        window.currentEditingIndex = index;
        const formTitle = document.getElementById('form-title');
        const btnSalvar = document.getElementById('btn-salvar-demanda');
        if (formTitle) formTitle.textContent = 'Editar Demanda Existente';
        if (btnSalvar) btnSalvar.textContent = 'Salvar Alterações';
        
        // Dispara eventos para atualizar pré-visualizações
        selectCategoria.dispatchEvent(new Event('change'));
        inputOrcamento.dispatchEvent(new Event('input'));
    };

    // 6. Função de Excluir 
    window.excluirDemanda = function(index) {
        if (confirm("Tem certeza que deseja excluir esta demanda? Esta ação não pode ser desfeita.")) {
            window.demandas.splice(index, 1);
            localStorage.setItem('minhasDemandas', JSON.stringify(window.demandas));
            renderDemandas();
            if (window.isEditing && window.currentEditingIndex === index) {
                window.resetForm();
            }
        }
    };
    
    // 8. Carrega as demandas do localStorage na inicialização
    const savedDemandas = localStorage.getItem('minhasDemandas');
    if (savedDemandas) {
        try { window.demandas = JSON.parse(savedDemandas); } catch (e) { console.error("Erro ao carregar demandas do localStorage", e); window.demandas = []; }
    }
    renderDemandas(); // Renderiza ao carregar a página
});