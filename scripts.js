/* ======================== FUNÇÃO PRINCIPAL ======================== */
// Garante que o script só é executado após a página ser completamente carregada
document.addEventListener('DOMContentLoaded', function() {
    
    // ====================== CARROSSEL PERSONALIZADO ======================
    // Seleciona os elementos principais do carrossel
    const track = document.querySelector('.carousel-track');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');

    // Verifica se os elementos do carrossel existem na página para evitar erros
    if (track && prevButton && nextButton) {
        let slides = Array.from(document.querySelectorAll('.img-slide'));
        let currentIndex = 2; // O índice da imagem central que está em destaque

        // Função para atualizar a posição do carrossel e o destaque da imagem
        function updateCarousel() {
            slides.forEach(slide => {
                slide.classList.remove('destaque-mid');
            });
            
            // Adiciona a classe de destaque à imagem central
            slides[currentIndex].classList.add('destaque-mid');

            // Calcula a posição do carrossel para centralizar a imagem em destaque
            const containerWidth = track.parentElement.offsetWidth;
            const middleImage = slides[currentIndex];
            const middleImageWidth = middleImage.offsetWidth;
            const totalPreviousWidth = slides.slice(0, currentIndex).reduce((acc, img) => acc + img.offsetWidth, 0);
            const totalPreviousMargin = currentIndex * 20; // 20px de gap

            const offset = (containerWidth / 2) - (middleImageWidth / 2) - totalPreviousWidth - totalPreviousMargin;
            track.style.transform = `translateX(${offset}px)`;
        }

        // Lógica para o loop infinito do carrossel
        function handleNext() {
            currentIndex++;
            updateCarousel();
            if (currentIndex > slides.length - 3) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 2;
                    updateCarousel();
                }, 600);
                setTimeout(() => {
                    track.style.transition = 'transform 0.6s ease-in-out';
                }, 700);
            }
        }
        
        function handlePrev() {
            currentIndex--;
            updateCarousel();
            if (currentIndex < 2) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = slides.length - 3;
                    updateCarousel();
                }, 600);
                setTimeout(() => {
                    track.style.transition = 'transform 0.6s ease-in-out';
                }, 700);
            }
        }

        // Adiciona os eventos de clique aos botões de navegação
        nextButton.addEventListener('click', handleNext);
        prevButton.addEventListener('click', handlePrev);

        // Inicia o carrossel e o mantém atualizado em redimensionamentos de tela
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
        setInterval(handleNext, 3000); // Roda automaticamente a cada 3 segundos
    }
    
    // ====================== GALERIA DE PRODUTOS ======================
    const productGallery = document.getElementById('productGallery');
    const galleryPagination = document.getElementById('galleryPagination');

    // Define os caminhos das imagens para a galeria do perfil
    const galleries = [
        ['images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg', 'images/Bolos/bolo1.jpeg'],
        ['images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg', 'images/Bolos/bolo2.jpeg']
    ];

    let currentGalleryIndex = 0;

    // Função para renderizar as imagens na galeria
    function renderGallery(index) {
        if (!productGallery) return;
        productGallery.innerHTML = ''; // Limpa a galeria para recarregar as novas imagens
        const imagesToLoad = galleries[index];
        if (!imagesToLoad) return;
        imagesToLoad.forEach(imagePath => {
            const colDiv = document.createElement('div');
            // Classes de coluna do Bootstrap para o layout de 3x2 em telas grandes e 2x3 em telas pequenas
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

    // Função para atualizar o estado dos botões da paginação
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

    // Adiciona o evento de clique para a paginação da galeria
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
        renderGallery(currentGalleryIndex); // Renderiza a galeria inicial
    }

    // ====================== TRANSIÇÃO LOGIN/CADASTRO ======================
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showCadastroBtn = document.getElementById('showCadastroBtn');

    // Funções para mostrar e esconder formulários com um efeito de transição
    function showLogin() {
        if (cadastroForm) cadastroForm.style.display = 'none';
        if (loginForm) {
            loginForm.style.display = 'block';
            loginForm.classList.add('fade-in');
        }
    }

    function showCadastro() {
        if (loginForm) loginForm.style.display = 'none';
        if (cadastroForm) {
            cadastroForm.style.display = 'block';
            cadastroForm.classList.add('fade-in');
        }
    }

    // Adiciona os eventos de clique para os botões que alternam entre os formulários
    if (showLoginBtn) showLoginBtn.addEventListener('click', showLogin);
    if (showCadastroBtn) showCadastroBtn.addEventListener('click', showCadastro);

    // Adiciona o listener de submit para os formulários
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            alert(`Login realizado com sucesso!\nE-mail: ${email}`);
        });
    }

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('cadastroEmail').value;
            const telefone = document.getElementById('cadastroTelefone').value;
            alert(`Cadastro realizado com sucesso!\nE-mail: ${email}\nTelefone: ${telefone}`);
        });
    }

    // ====================== LÓGICA DO FILTRO DE CARDS ======================
    const filterButtons = document.querySelectorAll('.btn-filter');
    const sections = {
        'destaques': document.getElementById('section-destaques'),
        'promocoes': document.getElementById('section-promocoes'),
        'disponiveis': document.getElementById('section-disponiveis')
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;

            // Remove a classe 'active' de todos os botões e adiciona ao clicado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Oculta todas as seções e mostra apenas a seção alvo
            for (const key in sections) {
                if (sections[key]) {
                    if (key === target) {
                        // Remove a classe de esconder e adiciona a de animação
                        sections[key].classList.remove('d-none');
                        sections[key].classList.add('cards-section');
                    } else {
                        // Remove a classe de animação e adiciona a de esconder
                        sections[key].classList.remove('cards-section');
                        sections[key].classList.add('d-none');
                    }
                }
            }
        });
    });
    
    // ====================== CHAT ESTATICO ======================
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
            const div = document.createElement('div');
            div.className = 'mb-4 fade-in';
            div.innerHTML = `<div class="d-flex justify-content-end"><div class="bg-primary text-white rounded px-3 py-2" style="max-width: 80%">${message}</div></div>`;
            chatMessages.appendChild(div);
            this.scrollToBottom();
        }
        addBotMessage(message) {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
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