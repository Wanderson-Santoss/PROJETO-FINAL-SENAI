/* ====================== 2. LÓGICA DE FILTRO DE CARDS ====================== */
document.addEventListener('DOMContentLoaded', function() {
    
    // Variáveis definidas em utils-api-form.js
    const { 
        filterButtons, sectionDestaques, sectionMinhasDemandas, 
        sectionDisponiveis, containerBtnCriar, btnAbrirCriar 
    } = window;

    // Se as variáveis globais não existirem, o código para aqui (erro de ordem)
    if (!filterButtons || !sectionDestaques || !sectionMinhasDemandas || !sectionDisponiveis) {
        console.error("Erro: Variáveis globais do filtro (IDs) não encontradas. Verifique utils-api-form.js e seu HTML.");
        return;
    }

    // Função central para alternar a visibilidade das seções
    // Esta função é chamada tanto pelo clique quanto pelo demanda-crud.js após salvar um novo card.
    window.updateSectionVisibility = function(targetId) {
        
        const allSections = [
            { element: sectionDestaques, id: 'destaques' },
            { element: sectionMinhasDemandas, id: 'minhas-demandas' },
            { element: sectionDisponiveis, id: 'disponiveis' }
        ];

        let targetSectionFound = false;

        allSections.forEach(section => {
            if (section.id === targetId) {
                // 1. Mostrar a seção correta e o botão de criar
                section.element.classList.remove('d-none');
                section.element.classList.add('d-flex'); // Usa d-flex para layout em row
                targetSectionFound = true;
            } else {
                // 2. Esconder as outras
                section.element.classList.add('d-none');
                section.element.classList.remove('d-flex'); 
            }
        });
        
        // 3. Gerenciar o botão "Criar Nova Demanda"
        if (targetId === 'minhas-demandas' && containerBtnCriar) {
            containerBtnCriar.classList.remove('d-none');
        } else if (containerBtnCriar) {
            containerBtnCriar.classList.add('d-none');
            
            // 4. Se mudar de aba com o formulário aberto, fecha ele
            if (window.collapseForm && window.collapseForm.classList.contains('show')) {
                // Isso simula o clique, o que dispara o evento hidden.bs.collapse e reseta o form (em utils-api-form.js)
                if (btnAbrirCriar) btnAbrirCriar.click(); 
            }
        }
    }

    // 5. Adicionar Event Listeners aos botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;

            // Desativa a classe 'active' de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Ativa a classe 'active' no botão clicado (efeito visual)
            this.classList.add('active');

            // Troca a seção
            window.updateSectionVisibility(targetId);

            // Se for 'Minhas Demandas', re-renderiza os cards
            if (targetId === 'minhas-demandas' && window.renderDemandas) {
                window.renderDemandas();
            }
        });
    });

    // 6. Inicialização: Garante que a seção "Destaques" esteja visível ao carregar
    window.updateSectionVisibility('destaques');
});