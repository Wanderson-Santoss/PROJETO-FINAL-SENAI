/* ======================== FUNÇÃO PRINCIPAL ======================== */
// Garante que o script só é executado após a página ser completamente carregada
document.addEventListener('DOMContentLoaded', function() {
    
    // Constante para a URL base da API (Ajuste se seu Flask rodar em outra porta)
    const API_URL = 'http://127.0.0.1:5000/api'; 
    
    // ====================== Variáveis Globais para Demandas ======================
    const demandaForm = document.getElementById('demandaForm');
    const btnAbrirCriar = document.getElementById('btn-abrir-criar-demanda');
    const collapseForm = document.getElementById('collapseCriarDemanda');
    const inputOrcamento = document.getElementById('demanda-orcamento');
    const selectCategoria = document.getElementById('demanda-categoria');
    const sectionMinhasDemandas = document.getElementById('section-minhas-demandas');
    const containerBtnCriar = document.getElementById('container-btn-criar');
    
    // Mapeamento de categorias para ícones do Bootstrap (bi bi-*)
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

    // Função para resetar o formulário
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

    // ====================== CARROSSEL PERSONALIZADO ======================
    const track = document.querySelector('.carousel-track');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');

    if (track && prevButton && nextButton) {
        let slides = Array.from(document.querySelectorAll('.img-slide'));
        let currentIndex = 2;

        function updateCarousel() {
            slides.forEach(slide => {
                slide.classList.remove('destaque-mid');
            });
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
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 2;
                    updateCarousel();
                }, 600);
            }
        }
        
        function handlePrev() {
            track.style.transition = 'transform 0.6s ease-in-out';
            currentIndex--;
            updateCarousel();
            if (currentIndex < 2) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = slides.length - 3;
                    updateCarousel();
                }, 600);
            }
        }

        nextButton.addEventListener('click', handleNext);
        prevButton.addEventListener('click', handlePrev);

        updateCarousel();
        window.addEventListener('resize', updateCarousel);
        setInterval(handleNext, 3000); 
    }
    
    // ====================== GALERIA DE PRODUTOS ======================
    const productGallery = document.getElementById('productGallery');
    const galleryPagination = document.getElementById('galleryPagination');
    const galleries = [
        ['images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg'],
        ['images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg']
    ];
    let currentGalleryIndex = 0;

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
        pageItems.forEach(item => {
            item.classList.remove('active');
        });
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
                if (currentGalleryIndex > 0) {
                    currentGalleryIndex--;
                    renderGallery(currentGalleryIndex);
                }
            } else if (pageData === 'next') {
                if (currentGalleryIndex < galleries.length - 1) {
                    currentGalleryIndex++;
                    renderGallery(currentGalleryIndex);
                }
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

    // ====================== TRANSIÇÃO LOGIN/CADASTRO ======================
    const loginFormContainer = document.getElementById('loginForm');
    const cadastroFormContainer = document.getElementById('cadastroForm');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showCadastroBtn = document.getElementById('showCadastroBtn');
    const escolhaPerfilContainer = document.getElementById('escolhaPerfilContainer');

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
    
    // Função global para limpar o formulário de login (usada no botão Cancelar)
    window.clearLoginForm = () => {
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginSenha').value = '';
    }
    
    // Função global para limpar o formulário de cadastro (usada no botão Cancelar)
    window.clearCadastroForm = () => {
        document.getElementById('cadastroNome').value = '';
        document.getElementById('cadastroEmail').value = '';
        document.getElementById('cadastroSenha').value = '';
        document.getElementById('cadastroCpf').value = '';
        document.getElementById('cadastroTelefone').value = '';
    }

    // ====================== LÓGICA DE LOGIN (Para Futura Implementação) ======================
    if (loginFormContainer) {
        const formLogin = loginFormContainer.querySelector('form');
        if (formLogin) {
            formLogin.addEventListener('submit', async function(event) {
                event.preventDefault();
                // **FUTURO**: Adicione aqui a lógica de login com o backend
                const email = document.getElementById('loginEmail').value;
                const senha = document.getElementById('loginSenha').value;
                
                // Exemplo de chamada de API:
                /*
                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, senha })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        localStorage.setItem('user_id', data.id_usuario);
                        localStorage.setItem('auth_token', data.token);
                        alert(`Login realizado com sucesso! Bem-vindo(a), ${data.nome}.`);
                        window.location.href = './index.html';
                    } else {
                        alert(`Erro no login: ${data.erro || data.mensagem}`);
                    }
                } catch (error) {
                    alert('Erro de conexão com o servidor.');
                }
                */
               alert(`Login simulado realizado com sucesso!\nE-mail: ${email}`);
            });
        }
    }


    // ====================================================================
    // 🌟 LÓGICA PRINCIPAL DE CADASTRO (CONEXÃO COM FLASK) 🌟
    // ====================================================================
    if (cadastroFormContainer) {
        const formCadastro = cadastroFormContainer.querySelector('form');
        if (formCadastro) {
            formCadastro.addEventListener('submit', async function(e) {
                e.preventDefault(); 

                const url = `${API_URL}/auth/register`;

                // Coleta de dados
                const dadosCadastro = {
                    nome: document.getElementById('cadastroNome').value, 
                    email: document.getElementById('cadastroEmail').value,
                    senha: document.getElementById('cadastroSenha').value,
                    // Remove formatação do CPF antes de enviar
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
                        // SUCESSO: O usuário base foi criado (Status 201)
                        alert(`Usuário ${data.mensagem} (ID: ${data.id_usuario})`);
                        
                        // Esconde os formulários de login/cadastro
                        cadastroFormContainer.style.display = 'none';
                        if (loginFormContainer) loginFormContainer.style.display = 'none';
                        
                        // Mostra a escolha de perfil
                        if (escolhaPerfilContainer) {
                            escolhaPerfilContainer.style.display = 'block';
                            escolhaPerfilContainer.classList.add('fade-in');
                        }
                        
                        // 🚨 PASSO CRUCIAL: Armazena o ID retornado pelo Flask para a próxima etapa (perfil)
                        localStorage.setItem('temp_user_id', data.id_usuario); 
                        
                    } else {
                        // ERRO do Backend (Ex: 400 Bad Request)
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
    
    // ====================== LÓGICA DO FILTRO DE CARDS (Não Alterada) ======================
    const filterButtons = document.querySelectorAll('.btn-filter');
    const sections = {
        'destaques': document.getElementById('section-destaques'),
        'promocoes': document.getElementById('section-promocoes'),
        'disponiveis': document.getElementById('section-disponiveis'),
        'minhas-demandas': document.getElementById('section-minhas-demandas')
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;

            // 1. Ativa/Desativa o botão clicado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Mostra/Esconde o botão de CRIAR DEMANDA
            if (containerBtnCriar) {
                if (target === 'minhas-demandas') {
                    containerBtnCriar.classList.remove('d-none');
                } else {
                    // Esconde o botão e fecha o formulário se estiver aberto
                    containerBtnCriar.classList.add('d-none');
                    if (collapseForm && collapseForm.classList.contains('show')) {
                        btnAbrirCriar.click(); // Simula o clique para fechar o formulário
                    }
                }
            }

            // 3. Mostra/Esconde as seções de cards
            for (const key in sections) {
                if (sections[key]) {
                    if (key === target) {
                        sections[key].classList.remove('d-none');
                        sections[key].classList.add('cards-section');
                    } else {
                        sections[key].classList.remove('cards-section');
                        sections[key].classList.add('d-none');
                    }
                }
            }
        });
    });


    // ====================== LÓGICA DE DEMANDAS (Não Alterada) ======================

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
        // Necessário para renderizar o valor formatado ao carregar ou editar
        inputOrcamento.dispatchEvent(new Event('input')); 
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
    if (demandaForm) {
        demandaForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Pega os valores do formulário (AGORA INCLUINDO SUBTÍTULO E LOCALIZAÇÃO)
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

    // 5. Função de Edição (Disponível globalmente para os botões do card)
    window.editarDemanda = function(index) {
        const demanda = demandas[index];
        if (!demanda) return;

        // 1. Abre o formulário em modo edição
        if (!collapseForm || !collapseForm.classList.contains('show')) {
            btnAbrirCriar.click(); 
        }

        // 2. Preenche o formulário (INCLUINDO SUBTÍTULO E LOCALIZAÇÃO)
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
        
        // Dispara eventos para atualizar preview de ícone e formatação do orçamento
        selectCategoria.dispatchEvent(new Event('change'));
        inputOrcamento.dispatchEvent(new Event('input'));
    };

    // 6. Função de Excluir (Disponível globalmente para os botões do card)
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


    // 7. Renderização dos Cards (Minhas Demandas - Estilo Escuro)
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

        demandas.forEach((d, index) => {
            // Garante que campos novos, se não existirem (demandas antigas), sejam string vazia
            const subtitulo = d.subtitulo || '';
            const localizacao = d.localizacao || ''; 

            const cardHTML = `
                <div class="col-lg-4 col-md-6 mb-4">
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
                </div>
            `;
            sectionMinhasDemandas.innerHTML += cardHTML;
        });
    }

    // Carrega as demandas do localStorage ao iniciar
    const savedDemandas = localStorage.getItem('minhasDemandas');
    if (savedDemandas) {
        try {
            demandas = JSON.parse(savedDemandas);
        } catch (e) {
            console.error("Erro ao carregar demandas do localStorage", e);
            demandas = [];
        }
    }

    // Renderiza as demandas ao carregar a página
    renderDemandas();
    
    // =================================================================
    // FUNÇÃO DE ESCOLHA DE PERFIL (Chamada pelos botões no HTML)
    // =================================================================
    window.escolherPerfil = function(tipo) {
        const userId = localStorage.getItem('temp_user_id');
        const escolhaPerfilContainer = document.getElementById('escolhaPerfilContainer');

        if (escolhaPerfilContainer) escolhaPerfilContainer.style.display = 'none';

        if (!userId) {
            alert("Erro: ID de usuário não encontrado. Faça login ou cadastre-se novamente.");
            showLogin(); 
            return; 
        }

        // Armazena o ID como 'user_id' definitivo para ser usado na próxima página (perfil.html)
        localStorage.setItem('user_id', userId);
        localStorage.removeItem('temp_user_id'); // Remove o ID temporário

        if (tipo === 'profissional') {
            alert("Você escolheu Profissional. O próximo passo é preencher os dados de sua profissão.");
            // Redireciona para o formulário de perfil profissional
            window.location.href = './perfil.html'; 
            
        } else if (tipo === 'cliente') {
            alert("Você escolheu Cliente/Recrutador. Redirecionando para o painel principal.");
            // Redireciona para o painel principal ou formulário de cliente
            window.location.href = './index.html'; 

        } else if (tipo === 'finalizar') {
            alert("Cadastro de perfil adiado. Redirecionando para o painel principal.");
            window.location.href = './index.html'; 
        }
    }


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