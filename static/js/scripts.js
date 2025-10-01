/* ======================== FUNÇÃO PRINCIPAL ======================== */
document.addEventListener('DOMContentLoaded', function() {
    
    // ... (Seu código de API, ICON_MAP, resetForm, etc. - MANTIDO) ...
    const API_URL = 'http://127.0.0.1:5000/api'; 
    
    const demandaForm = document.getElementById('demandaForm');
    const btnAbrirCriar = document.getElementById('btn-abrir-criar-demanda');
    const collapseForm = document.getElementById('collapseCriarDemanda');
    const inputOrcamento = document.getElementById('demanda-orcamento');
    const selectCategoria = document.getElementById('demanda-categoria');
    const sectionMinhasDemandas = document.getElementById('section-minhas-demandas');
    const containerBtnCriar = document.getElementById('container-btn-criar');
    
    const ICON_MAP = {
        'eletricidade': 'bi bi-lightning-charge-fill',
        'hidraulica': 'bi bi-droplet-fill',
        'pintura': 'bi bi-brush-fill',
        'jardinagem': 'bi bi-tree-fill',
        'reformas': 'bi bi-tools',
        'outros': 'bi bi-question-lg'
    };

    let demandas = [];
    let isEditing = false;
    let currentEditingIndex = -1;

    function resetForm() {
        if (demandaForm) demandaForm.reset();
        isEditing = false;
        currentEditingIndex = -1;
        const formTitle = document.getElementById('form-title');
        const btnSalvar = document.getElementById('btn-salvar-demanda');
        if (formTitle) formTitle.textContent = 'Criar Nova Demanda';
        if (btnSalvar) btnSalvar.textContent = 'Criar Demanda';
        const iconPreview = document.getElementById('icon-preview');
        if (iconPreview) iconPreview.className = 'fs-2 text-primary';
    }

    // ... (Lógica de Carrossel - MANTIDA) ...
    const track = document.querySelector('.carousel-track');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');

    if (track && prevButton && nextButton) {
        let slides = Array.from(document.querySelectorAll('.img-slide'));
        let currentIndex = 2;

        function updateCarousel() {
             slides.forEach(slide => { slide.classList.remove('destaque-mid'); });
             slides[currentIndex].classList.add('destaque-mid');
             const containerWidth = track.parentElement.offsetWidth;
             const middleImage = slides[currentIndex];
             const middleImageWidth = middleImage.offsetWidth;
             const totalPreviousWidth = slides.slice(0, currentIndex).reduce((acc, img) => acc + img.offsetWidth, 0);
             const totalPreviousMargin = currentIndex * 20;
             const offset = (containerWidth / 2) - (middleImageWidth / 2) - totalPreviousWidth - totalPreviousMargin;
             track.style.transform = `translateX(${offset}px)`;
        }

        function handleNext() {
             track.style.transition = 'transform 0.6s ease-in-out';
             currentIndex++;
             updateCarousel();
             if (currentIndex > slides.length - 3) {
                 setTimeout(() => { track.style.transition = 'none'; currentIndex = 2; updateCarousel(); }, 600);
             }
        }
        
        function handlePrev() {
             track.style.transition = 'transform 0.6s ease-in-out';
             currentIndex--;
             updateCarousel();
             if (currentIndex < 2) {
                 setTimeout(() => { track.style.transition = 'none'; currentIndex = slides.length - 3; updateCarousel(); }, 600);
             }
        }

        nextButton.addEventListener('click', handleNext);
        prevButton.addEventListener('click', handlePrev);

        updateCarousel();
        window.addEventListener('resize', updateCarousel);
        // setInterval(handleNext, 3000); // Comentei para evitar loop infinito em algumas páginas
    }

    // ... (Lógica de Galeria - MANTIDA) ...
    const productGallery = document.getElementById('productGallery');
    const galleryPagination = document.getElementById('galleryPagination');
    const galleries = [
        ['images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg'],
        ['images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg']
    ];
    let currentGalleryIndex = 0;

    if (productGallery || galleryPagination) {
        function renderGallery(index) {
             if (!productGallery) return;
             productGallery.innerHTML = '';
             const imagesToLoad = galleries[index];
             if (!imagesToLoad) return;
             imagesToLoad.forEach(imagePath => {
                 const colDiv = document.createElement('div');
                 colDiv.className = 'col-lg-4 col-md-4 col-6 mb-4'; 
                 const img = document.createElement('img');
                 img.src = imagePath;
                 img.alt = 'Imagem da galeria';
                 img.className = 'img-fluid rounded';
                 colDiv.appendChild(img);
                 productGallery.appendChild(colDiv);
             });
             updatePagination(index);
        }

        function updatePagination(activeIndex) {
             if (!galleryPagination) return;
             const pageItems = galleryPagination.querySelectorAll('.page-item');
             pageItems.forEach(item => { item.classList.remove('active'); });
             const currentPageItem = galleryPagination.querySelector(`[data-page="${activeIndex + 1}"]`);
             if (currentPageItem) currentPageItem.classList.add('active');
             const prevArrow = galleryPagination.querySelector('[data-page="prev"]');
             const nextArrow = galleryPagination.querySelector('[data-page="next"]');
             if (prevArrow) prevArrow.classList.toggle('disabled', activeIndex === 0);
             if (nextArrow) nextArrow.classList.toggle('disabled', activeIndex === galleries.length - 1);
        }

        if (galleryPagination) {
             galleryPagination.addEventListener('click', function(event) {
                 const target = event.target.closest('.page-item');
                 if (!target || target.classList.contains('active') || target.classList.contains('disabled')) return;
                 const pageData = target.dataset.page;
                 if (pageData === 'prev') {
                     if (currentGalleryIndex > 0) { currentGalleryIndex--; renderGallery(currentGalleryIndex); }
                 } else if (pageData === 'next') {
                     if (currentGalleryIndex < galleries.length - 1) { currentGalleryIndex++; renderGallery(currentGalleryIndex); }
                 } else {
                     const pageNumber = parseInt(pageData);
                     if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= galleries.length) {
                         currentGalleryIndex = pageNumber - 1;
                         renderGallery(currentGalleryIndex);
                     }
                 }
             });
             renderGallery(currentGalleryIndex);
        }
    }

    // ... (Lógica de Login/Cadastro - MANTIDA com as verificações de existência) ...
    const loginFormContainer = document.getElementById('loginForm');
    const cadastroFormContainer = document.getElementById('cadastroForm');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showCadastroBtn = document.getElementById('showCadastroBtn');
    const escolhaPerfilContainer = document.getElementById('escolhaPerfilContainer');

    if (loginFormContainer || cadastroFormContainer || showLoginBtn || showCadastroBtn) {

        function showLogin() {
             if (cadastroFormContainer) cadastroFormContainer.style.display = 'none';
             if (escolhaPerfilContainer) escolhaPerfilContainer.style.display = 'none';
             if (loginFormContainer) {
                 loginFormContainer.style.display = 'block';
                 loginFormContainer.classList.add('fade-in');
             }
        }

        function showCadastro() {
             if (loginFormContainer) loginFormContainer.style.display = 'none';
             if (escolhaPerfilContainer) escolhaPerfilContainer.style.display = 'none';
             if (cadastroFormContainer) {
                 cadastroFormContainer.style.display = 'block';
                 cadastroFormContainer.classList.add('fade-in');
             }
        }

        if (showLoginBtn) showLoginBtn.addEventListener('click', showLogin);
        if (showCadastroBtn) showCadastroBtn.addEventListener('click', showCadastro);
        
        window.clearLoginForm = () => {
             const loginEmail = document.getElementById('loginEmail');
             const loginSenha = document.getElementById('loginSenha');
             if(loginEmail) loginEmail.value = '';
             if(loginSenha) loginSenha.value = '';
        }
        
        window.clearCadastroForm = () => {
             const cadastroNome = document.getElementById('cadastroNome');
             const cadastroEmail = document.getElementById('cadastroEmail');
             const cadastroSenha = document.getElementById('cadastroSenha');
             const cadastroCpf = document.getElementById('cadastroCpf');
             const cadastroTelefone = document.getElementById('cadastroTelefone');
             if(cadastroNome) cadastroNome.value = '';
             if(cadastroEmail) cadastroEmail.value = '';
             if(cadastroSenha) cadastroSenha.value = '';
             if(cadastroCpf) cadastroCpf.value = '';
             if(cadastroTelefone) cadastroTelefone.value = '';
        }

        if (loginFormContainer) {
             const formLogin = loginFormContainer.querySelector('form');
             if (formLogin) {
                 formLogin.addEventListener('submit', async function(event) {
                      event.preventDefault();
                      const email = document.getElementById('loginEmail').value;
                      alert(`Login simulado realizado com sucesso!\nE-mail: ${email}`);
                 });
             }
        }

        if (cadastroFormContainer) {
             const formCadastro = cadastroFormContainer.querySelector('form');
             if (formCadastro) {
                 formCadastro.addEventListener('submit', async function(e) {
                      e.preventDefault(); 
                      const url = `${API_URL}/auth/register`;
                      const dadosCadastro = {
                          nome: document.getElementById('cadastroNome').value, 
                          email: document.getElementById('cadastroEmail').value,
                          senha: document.getElementById('cadastroSenha').value,
                          cpf: document.getElementById('cadastroCpf').value.replace(/\D/g, ''), 
                          telefone: document.getElementById('cadastroTelefone').value.replace(/\D/g, ''),
                      };

                      try {
                          const response = await fetch(url, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(dadosCadastro)
                          });

                          const data = await response.json();
                          
                          if (response.ok) {
                              alert(`Usuário ${data.mensagem} (ID: ${data.id_usuario})`);
                              if (cadastroFormContainer) cadastroFormContainer.style.display = 'none';
                              if (loginFormContainer) loginFormContainer.style.display = 'none';
                              if (escolhaPerfilContainer) {
                                  escolhaPerfilContainer.style.display = 'block';
                                  escolhaPerfilContainer.classList.add('fade-in');
                              }
                              localStorage.setItem('temp_user_id', data.id_usuario); 
                          } else {
                              alert(`Erro ao cadastrar: ${data.erro || data.mensagem}`);
                              console.error("Erro do servidor:", data);
                          }
                      } catch (error) {
                          console.error('Erro de conexão:', error);
                          alert('Erro de conexão com o servidor. Verifique se o Flask está rodando em http://127.0.0.1:5000.');
                      }
                 });
             }
        }
    } 
    
    // ====================== LÓGICA DO FILTRO DE CARDS (CORRIGIDA E REFORÇADA) ======================
    const filterButtons = document.querySelectorAll('.btn-filter');
    // Mapeamento dos data-target do botão para os IDs das seções no HTML
    const sections = {
        'destaques': document.getElementById('cards-destaques'), // O ID DEVE SER 'cards-destaques' NO HTML
        'disponiveis': document.getElementById('cards-disponiveis'), // O ID DEVE SER 'cards-disponiveis' NO HTML
        'minhas-demandas': document.getElementById('cards-minhas-demandas') // O ID DEVE SER 'cards-minhas-demandas' NO HTML
    };
    
    // Função que aplica as classes de exibição/esconder
    function updateSectionVisibility(target) {
        // 1. Mostra/Esconde o botão de CRIAR DEMANDA e fecha o formulário
        if (containerBtnCriar && btnAbrirCriar && collapseForm) {
            if (target === 'minhas-demandas') {
                containerBtnCriar.classList.remove('d-none');
            } else {
                containerBtnCriar.classList.add('d-none');
                if (collapseForm.classList.contains('show')) {
                    // Força o fechamento do collapse, resetando o estado
                    collapseForm.classList.remove('show');
                    btnAbrirCriar.textContent = 'Criar Nova Demanda';
                    btnAbrirCriar.classList.remove('btn-danger');
                    btnAbrirCriar.classList.add('btn-dark');
                    resetForm();
                }
            }
        }
        
        // 2. Mostra/Esconde as seções de cards
        for (const key in sections) {
            const sectionElement = sections[key];
            if (sectionElement) {
                // Todas as seções de card devem ter a classe 'cards-section'
                // O filtro alterna a classe 'd-none' (display: none do Bootstrap)
                sectionElement.classList.add('cards-section'); 
                
                if (key === target) {
                    sectionElement.classList.remove('d-none');
                } else {
                    sectionElement.classList.add('d-none');
                }
            }
        }
    }


    if (filterButtons.length > 0) { 
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.dataset.target; // Ex: 'destaques'

                // 1. Ativa/Desativa o botão clicado
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Aplica a visibilidade das seções
                updateSectionVisibility(target);
            });
        });
        
        // **NOVO:** Força o estado inicial ao carregar a página:
        const activeOnInit = document.querySelector('.btn-filter.active');
        if (activeOnInit) {
            const targetOnInit = activeOnInit.dataset.target;
            updateSectionVisibility(targetOnInit);
        } else if (filterButtons[0]) {
            // Se nenhum estiver ativo, ativa o primeiro (Destaques) e mostra sua seção
            filterButtons[0].classList.add('active');
            updateSectionVisibility(filterButtons[0].dataset.target);
        }
    }


    // ... (Lógica de Demandas - MANTIDA) ...

    // 1. Controle de Exibição do Formulário
    if (btnAbrirCriar && collapseForm) {
        btnAbrirCriar.addEventListener('click', function() {
            const isShown = collapseForm.classList.contains('show');
            if (isShown) {
                collapseForm.classList.remove('show');
                this.textContent = 'Criar Nova Demanda';
                this.classList.remove('btn-danger');
                this.classList.add('btn-dark');
                resetForm(); 
            } else {
                collapseForm.classList.add('show');
                this.textContent = 'Fechar Formulário';
                this.classList.remove('btn-dark');
                this.classList.add('btn-danger');
                if (!isEditing) {
                    resetForm();
                }
            }
        });
    }

    // 2. Máscara de Moeda (R$)
    if (inputOrcamento) {
        inputOrcamento.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); 
            if (!value) return e.target.value = '';
            while (value.length < 3) value = '0' + value; 
            const integerPart = value.substring(0, value.length - 2);
            const decimalPart = value.substring(value.length - 2);
            let formattedValue = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            e.target.value = `R$ ${formattedValue},${decimalPart}`;
        });
        if (inputOrcamento.value) inputOrcamento.dispatchEvent(new Event('input')); 
    }

    // 3. Seleção e Pré-visualização do Ícone
    if (selectCategoria) {
        selectCategoria.addEventListener('change', function() {
            const selectedCategory = this.value;
            const iconClass = ICON_MAP[selectedCategory] || ICON_MAP['outros'];
            const iconPreview = document.getElementById('icon-preview');
            if (iconPreview) {
                iconPreview.className = `${iconClass} fs-2 text-primary`;
            }
        });
    }

    // 4. Criação e Edição (Manipulação do Form)
    if (demandaForm && btnAbrirCriar && selectCategoria && inputOrcamento) { 
        demandaForm.addEventListener('submit', function(event) {
            event.preventDefault();
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

            if (isEditing) {
                demandas[currentEditingIndex] = novaDemanda;
            } else {
                demandas.unshift(novaDemanda);
            }

            localStorage.setItem('minhasDemandas', JSON.stringify(demandas));
            renderDemandas();
            btnAbrirCriar.click(); 
        });
    }

    // 5. Função de Edição
    window.editarDemanda = function(index) {
        if (!btnAbrirCriar || !collapseForm || !selectCategoria || !inputOrcamento) return;
        const demanda = demandas[index];
        if (!demanda) return;
        if (!collapseForm.classList.contains('show')) {
            btnAbrirCriar.click(); 
        }
        document.getElementById('demanda-titulo').value = demanda.titulo;
        document.getElementById('demanda-subtitulo').value = demanda.subtitulo || ''; 
        document.getElementById('demanda-localizacao').value = demanda.localizacao || ''; 
        document.getElementById('demanda-descricao').value = demanda.descricao;
        document.getElementById('demanda-categoria').value = demanda.categoria;
        document.getElementById('demanda-orcamento').value = demanda.orcamento;

        isEditing = true;
        currentEditingIndex = index;
        const formTitle = document.getElementById('form-title');
        const btnSalvar = document.getElementById('btn-salvar-demanda');
        if (formTitle) formTitle.textContent = 'Editar Demanda Existente';
        if (btnSalvar) btnSalvar.textContent = 'Salvar Alterações';
        
        selectCategoria.dispatchEvent(new Event('change'));
        inputOrcamento.dispatchEvent(new Event('input'));
    };

    // 6. Função de Excluir 
    window.excluirDemanda = function(index) {
        if (confirm("Tem certeza que deseja excluir esta demanda? Esta ação não pode ser desfeita.")) {
            demandas.splice(index, 1);
            localStorage.setItem('minhasDemandas', JSON.stringify(demandas));
            renderDemandas();
            if (isEditing && currentEditingIndex === index) {
                resetForm();
            }
        }
    };


    // 7. Renderização dos Cards (Minhas Demandas)
    function renderDemandas() {
        if (!sectionMinhasDemandas) return;
        sectionMinhasDemandas.innerHTML = '';

        if (demandas.length === 0) {
            sectionMinhasDemandas.innerHTML = `
                <div class="col-12 text-center p-5">
                    <div class="alert alert-info" role="alert">
                        <i class="bi bi-info-circle-fill me-2"></i> Você ainda não criou nenhuma demanda. Use o botão 'Criar Nova Demanda' para começar!
                    </div>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();

        demandas.forEach((d, index) => {
            const subtitulo = d.subtitulo || '';
            const localizacao = d.localizacao || ''; 

            const cardHTML = document.createElement('div');
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

    const savedDemandas = localStorage.getItem('minhasDemandas');
    if (savedDemandas) {
        try { demandas = JSON.parse(savedDemandas); } catch (e) { console.error("Erro ao carregar demandas do localStorage", e); demandas = []; }
    }

    renderDemandas();
    
    // ... (Lógica de Escolha de Perfil - MANTIDA) ...
    window.escolherPerfil = function(tipo) {
        const userId = localStorage.getItem('temp_user_id');
        const escolhaPerfilContainer = document.getElementById('escolhaPerfilContainer');

        if (escolhaPerfilContainer) escolhaPerfilContainer.style.display = 'none';

        if (!userId) {
            alert("Erro: ID de usuário não encontrado. Faça login ou cadastre-se novamente.");
            // showLogin(); // Não chame showLogin aqui para evitar loop
            return; 
        }

        localStorage.setItem('user_id', userId);
        localStorage.removeItem('temp_user_id'); 

        if (tipo === 'profissional') {
            alert("Você escolheu Profissional. O próximo passo é preencher os dados de sua profissão.");
            window.location.href = './perfil.html'; 
            
        } else if (tipo === 'cliente') {
            alert("Você escolheu Cliente/Recrutador. Redirecionando para o painel principal.");
            window.location.href = './index.html'; 

        } else if (tipo === 'finalizar') {
            alert("Cadastro de perfil adiado. Redirecionando para o painel principal.");
            window.location.href = './index.html'; 
        }
    }
});
    // ====================== CHAT ESTATICO (Não Alterada) ======================
    class ChatBot {
        constructor() {
            this.messageCount = 0;
            this.responses = ["Olá! 👋 Como posso ajudá-lo hoje?", "Entendi! Deixe-me verificar isso para você...", "Posso ajudar com informações sobre nossos produtos e serviços.", "Para questões mais específicas, posso conectá-lo com um atendente humano.", "Há mais alguma coisa em que posso ajudar?", "Obrigado por entrar em contato! Estou aqui sempre que precisar.", "Vou anotar sua solicitação e nossa equipe entrará em contato em breve.", "Essa é uma ótima pergunta! Vou buscar as informações mais atualizadas."];
            this.quickResponses = {'ola': 'Olá! Como posso ajudá-lo?', 'oi': 'Oi! Em que posso ser útil?', 'ajuda': 'Claro! Estou aqui para ajudar. O que você precisa?', 'produto': 'Temos vários produtos disponíveis. Sobre qual você gostaria de saber?', 'preço': 'Para informações sobre preços, posso conectá-lo com nossa equipe comercial.', 'contato': 'Você pode nos contatar através deste chat ou pelo email contato@empresa.com', 'horario': 'Nosso atendimento funciona 24/7 através deste chat!', 'obrigado': 'De nada! Fico feliz em ajudar! 😊'};
            this.init();
        }
        init() {
            this.bindEvents();
            if (typeof bootstrap !== 'undefined' && document.getElementById('chatWidget')) {
                this.bootstrapCollapse = new bootstrap.Collapse(document.getElementById('chatWidget'), { toggle: false });
            }
        }
        bindEvents() {
            const supportButton = document.querySelector('#supportButton button');
            if (supportButton) supportButton.addEventListener('click', () => this.openChat());
            const closeButton = document.querySelector('#chatWidget .btn-light');
            if (closeButton) closeButton.addEventListener('click', () => this.closeChat());
            const sendMessageButton = document.getElementById('sendMessage');
            if (sendMessageButton) sendMessageButton.addEventListener('click', () => this.sendUserMessage());
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.sendUserMessage();
                });
            }
        }
        openChat() {
            if (this.bootstrapCollapse) {
                this.bootstrapCollapse.show();
                setTimeout(() => this.addBotMessage("Olá! 👋 Bem-vindo ao nosso suporte! Como posso ajudá-lo hoje?"), 500);
                setTimeout(() => this.addBotMessage("Você pode me perguntar sobre nossos produtos, serviços ou qualquer dúvida que tiver!"), 1500);
            }
        }
        closeChat() {
            if (this.bootstrapCollapse) {
                this.bootstrapCollapse.hide();
                setTimeout(() => {
                    const chatMessages = document.getElementById('chatMessages');
                    if (chatMessages) chatMessages.innerHTML = '<div class="text-muted small">Inicie uma conversa...</div>';
                    this.messageCount = 0;
                }, 300);
            }
        }
        sendUserMessage() {
            const input = document.getElementById('messageInput');
            if (!input) return;
            const message = input.value.trim();
            if (!message) return;
            this.addUserMessage(message);
            input.value = '';
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.generateBotResponse(message);
            }, 1000 + Math.random() * 1000);
        }
        addUserMessage(message) {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
            // Remove o placeholder se for a primeira mensagem
            if (chatMessages.querySelector('.text-muted.small')) {
                 chatMessages.innerHTML = '';
            }
            const div = document.createElement('div');
            div.className = 'mb-4 fade-in';
            div.innerHTML = `<div class="d-flex justify-content-end"><div class="bg-primary text-white rounded px-3 py-2" style="max-width: 80%">${message}</div></div>`;
            chatMessages.appendChild(div);
            this.scrollToBottom();
        }
        addBotMessage(message) {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
             // Remove o placeholder se for a primeira mensagem
            if (chatMessages.querySelector('.text-muted.small')) {
                chatMessages.innerHTML = '';
            }
            const div = document.createElement('div');
            div.className = 'mb-4 fade-in';
            div.innerHTML = `<div class="d-flex align-items-start mb-2"><div class="w-8 h-8 bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2"><i class="bi bi-robot text-white"></i></div><div class="bg-light border rounded px-3 py-2" style="max-width: 80%">${message}</div></div>`;
            chatMessages.appendChild(div);
            this.scrollToBottom();
        }
        showTypingIndicator() {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
            const div = document.createElement('div');
            div.id = 'typingIndicator';
            div.className = 'mb-4 fade-in';
            div.innerHTML = `<div class="d-flex align-items-start mb-2"><div class="w-8 h-8 bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2"><i class="bi bi-robot text-white"></i></div><div class="bg-light border rounded px-3 py-2"><div class="typing-indicator"><span></span><span></span><span></span></div></div></div>`;
            chatMessages.appendChild(div);
            this.scrollToBottom();
        }
        hideTypingIndicator() {
            const typing = document.getElementById('typingIndicator');
            if (typing) typing.remove();
        }
        generateBotResponse(userMsg) {
            const msg = userMsg.toLowerCase();
            let reply = this.quickResponses[msg] || this.responses[Math.floor(Math.random() * this.responses.length)];
            this.addBotMessage(reply);
            this.messageCount++;
            if (this.messageCount === 3) {
                setTimeout(() => this.addBotMessage("Se precisar de ajuda mais específica, posso conectá-lo com um atendente humano. Gostaria?"), 2000);
            }
        }
        scrollToBottom() {
            const container = document.getElementById('chatMessages');
            if (container) container.scrollTop = container.scrollHeight;
        }
    }
    new ChatBot();
});